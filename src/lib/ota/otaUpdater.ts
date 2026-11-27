import { Capacitor } from '@capacitor/core';

export interface OtaManifest {
  version: string;
  url: string;
  sha256?: string;
  notes?: string;
  minNativeVersion?: string;
  builtAt?: string;
}

export interface DownloadedOtaUpdate {
  bundleId: string;
  version: string;
  sha256: string;
  notes?: string;
}

export const OTA_MANIFEST_URL =
  process.env.NEXT_PUBLIC_OTA_MANIFEST_URL ||
  'https://jee1vk.github.io/kuberan-dharma-app/ota-manifest.json';

export const BUILTIN_OTA_VERSION = process.env.NEXT_PUBLIC_OTA_VERSION || '1.0.0';

const OTA_LAST_CHECK_KEY = 'kuberan_dharma_ota_last_check';
const CHECK_THROTTLE_MS = 5 * 60 * 1000; // 5 minutes
const SHA256_HEX_REGEX = /^[a-f0-9]{64}$/i;

/**
 * Validates that a value is a 64-character hexadecimal SHA-256 digest.
 */
export function isValidSha256Hex(value: unknown): value is string {
  return typeof value === 'string' && SHA256_HEX_REGEX.test(value.trim());
}

/**
 * Compares dotted semantic versions (e.g. "1.0.12" > "1.0.2").
 * Returns true if `remoteVersion` is strictly newer than `currentVersion`.
 */
export function isNewerVersion(remoteVersion: string, currentVersion: string): boolean {
  const cleanRemote = remoteVersion.trim().replace(/^v/i, '');
  const cleanCurrent = currentVersion.trim().replace(/^v/i, '');

  if (!cleanRemote || cleanRemote === cleanCurrent) {
    return false;
  }

  const rParts = cleanRemote.split('.').map((n) => Number.parseInt(n, 10));
  const cParts = cleanCurrent.split('.').map((n) => Number.parseInt(n, 10));

  if (rParts.some(Number.isNaN) || cParts.some(Number.isNaN)) {
    return cleanRemote !== cleanCurrent;
  }

  const len = Math.max(rParts.length, cParts.length);
  for (let i = 0; i < len; i++) {
    const r = rParts[i] ?? 0;
    const c = cParts[i] ?? 0;
    if (r > c) return true;
    if (r < c) return false;
  }

  return false;
}

/**
 * Validates an OTA manifest payload. Enforces HTTPS bundle URLs and a valid
 * 64-character SHA-256 hex digest before allowing any bundle download.
 */
export function isValidOtaManifest(data: unknown): data is OtaManifest & { sha256: string } {
  if (!data || typeof data !== 'object') return false;
  const candidate = data as Record<string, unknown>;
  return (
    typeof candidate.version === 'string' &&
    candidate.version.trim().length > 0 &&
    typeof candidate.url === 'string' &&
    candidate.url.startsWith('https://') &&
    isValidSha256Hex(candidate.sha256)
  );
}

async function getUpdaterPlugin() {
  const mod = await import('@capgo/capacitor-updater');
  return mod.CapacitorUpdater;
}

/**
 * Confirms to the native OTA updater that the current web bundle booted cleanly,
 * then prunes stale older OTA bundles from device storage.
 */
export async function notifyOtaAppReady(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const updater = await getUpdaterPlugin();
    await updater.notifyAppReady();

    // Prune stale older bundles so device storage does not grow unbounded
    const [currentInfo, listInfo] = await Promise.all([updater.current(), updater.list()]);
    const activeId = currentInfo?.bundle?.id;
    const bundles = listInfo?.bundles || [];
    for (const b of bundles) {
      if (b.id && b.id !== 'builtin' && b.id !== activeId && b.status === 'success') {
        try {
          await updater.delete({ id: b.id });
        } catch {
          // Non-fatal cleanup error
        }
      }
    }
  } catch (err) {
    console.warn('[Kuberan OTA] notifyAppReady notice:', err);
  }
}

/**
 * Returns the currently running OTA bundle version (or the built-in APK version).
 */
export async function getCurrentOtaVersion(): Promise<string> {
  if (!Capacitor.isNativePlatform()) return BUILTIN_OTA_VERSION;
  try {
    const updater = await getUpdaterPlugin();
    const current = await updater.current();
    const version = current?.bundle?.version;
    if (version && version !== 'builtin') {
      return version;
    }
    return BUILTIN_OTA_VERSION;
  } catch {
    return BUILTIN_OTA_VERSION;
  }
}

/**
 * Fetches the hosted OTA manifest, enforces SHA-256 integrity verification,
 * and downloads any newer bundle in the background.
 * Safe to call offline — network failures resolve cleanly to `null` with zero errors.
 */
export async function checkAndDownloadOtaUpdate(options?: {
  force?: boolean;
}): Promise<DownloadedOtaUpdate | null> {
  if (!Capacitor.isNativePlatform()) return null;

  // Throttle repeated background checks unless forced
  if (!options?.force && typeof window !== 'undefined') {
    try {
      const lastCheck = Number(localStorage.getItem(OTA_LAST_CHECK_KEY) || '0');
      if (Date.now() - lastCheck < CHECK_THROTTLE_MS) {
        return null;
      }
      localStorage.setItem(OTA_LAST_CHECK_KEY, String(Date.now()));
    } catch {
      // Ignore storage errors
    }
  }

  const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timeoutId = controller ? setTimeout(() => controller.abort(), 6000) : null;

  try {
    const response = await fetch(`${OTA_MANIFEST_URL}?t=${Date.now()}`, {
      cache: 'no-store',
      signal: controller?.signal,
    });

    if (!response.ok) return null;

    const payload: unknown = await response.json();
    if (!isValidOtaManifest(payload)) return null;

    const expectedSha256 = payload.sha256.trim().toLowerCase();

    const currentVersion = await getCurrentOtaVersion();
    if (!isNewerVersion(payload.version, currentVersion)) {
      return null;
    }

    const updater = await getUpdaterPlugin();

    // Reuse an already-verified local bundle matching both version and SHA-256
    try {
      const existingList = await updater.list();
      const alreadyDownloaded = (existingList?.bundles || []).find(
        (b) =>
          b.version === payload.version &&
          b.status === 'success' &&
          Boolean(b.id) &&
          (!b.checksum || b.checksum.toLowerCase() === expectedSha256)
      );
      if (alreadyDownloaded) {
        try {
          await updater.next({ id: alreadyDownloaded.id });
        } catch {
          // Non-fatal
        }
        return {
          bundleId: alreadyDownloaded.id,
          version: alreadyDownloaded.version,
          sha256: expectedSha256,
          notes: payload.notes,
        };
      }
    } catch {
      // Proceed with verified download if list() fails
    }

    // Native atomic download verifies streaming SHA-256 before extracting zip
    const bundle = await updater.download({
      url: payload.url,
      version: payload.version,
      checksum: expectedSha256,
    });

    if (!bundle?.id) return null;

    // Secondary defense-in-depth checksum verification before queueing/applying
    if (bundle.checksum && bundle.checksum.toLowerCase() !== expectedSha256) {
      try {
        await updater.delete({ id: bundle.id });
      } catch {
        // Ignore delete error
      }
      return null;
    }

    // Queue automatically for next app start even if user dismisses the prompt
    try {
      await updater.next({ id: bundle.id });
    } catch {
      // Non-fatal; user can still apply immediately
    }

    return {
      bundleId: bundle.id,
      version: bundle.version || payload.version,
      sha256: expectedSha256,
      notes: payload.notes,
    };
  } catch {
    // Offline, timeout, or SHA-256 mismatch — safely keep running current bundle
    return null;
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

/**
 * Immediately switches the native WebView to the downloaded OTA bundle (PWA-style reload).
 */
export async function applyOtaBundleNow(bundleId: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const updater = await getUpdaterPlugin();
    await updater.set({ id: bundleId });
  } catch (err) {
    console.warn('[Kuberan OTA] Failed to apply bundle immediately:', err);
  }
}
