import { describe, it, expect } from 'vitest';
import {
  isNewerVersion,
  isValidOtaManifest,
  isValidSha256Hex,
  checkAndDownloadOtaUpdate,
} from '@/lib/ota/otaUpdater';
import { clearLocalUser, exportLocalUserJson } from '@/lib/storage/userStore';

const SAMPLE_SHA256 = 'a3f5c8e190b2d4768123456789abcdef0123456789abcdef0123456789abcdef';

describe('Native OTA Live Updater & Privacy Export/Purge', () => {
  it('accurately compares semantic versions', () => {
    expect(isNewerVersion('1.0.1', '1.0.0')).toBe(true);
    expect(isNewerVersion('1.0.12', '1.0.2')).toBe(true);
    expect(isNewerVersion('1.1.0', '1.0.99')).toBe(true);
    expect(isNewerVersion('2.0.0', '1.9.9')).toBe(true);
    expect(isNewerVersion('1.0.0', '1.0.0')).toBe(false);
    expect(isNewerVersion('1.0.0', '1.0.1')).toBe(false);
    expect(isNewerVersion('v1.0.5', '1.0.4')).toBe(true);
  });

  it('validates SHA-256 hex digests and enforces HTTPS + checksum on OTA manifests', () => {
    expect(isValidSha256Hex(SAMPLE_SHA256)).toBe(true);
    expect(isValidSha256Hex('short-hash')).toBe(false);
    expect(isValidSha256Hex('')).toBe(false);

    expect(
      isValidOtaManifest({
        version: '1.0.5',
        url: 'https://jee1vk.github.io/kuberan-dharma-app/ota/kuberan-dharma-bundle.zip',
        sha256: SAMPLE_SHA256,
        notes: 'New shlokas',
      })
    ).toBe(true);

    // Reject manifests missing sha256 or with invalid sha256
    expect(
      isValidOtaManifest({
        version: '1.0.5',
        url: 'https://jee1vk.github.io/kuberan-dharma-app/ota/kuberan-dharma-bundle.zip',
      })
    ).toBe(false);

    expect(
      isValidOtaManifest({
        version: '1.0.5',
        url: 'https://jee1vk.github.io/kuberan-dharma-app/ota/kuberan-dharma-bundle.zip',
        sha256: 'not-a-valid-sha256',
      })
    ).toBe(false);

    // Reject insecure HTTP URLs even with valid sha256
    expect(
      isValidOtaManifest({
        version: '1.0.5',
        url: 'http://example.com/bundle.zip',
        sha256: SAMPLE_SHA256,
      })
    ).toBe(false);

    // Reject missing version
    expect(
      isValidOtaManifest({
        url: 'https://example.com/bundle.zip',
        sha256: SAMPLE_SHA256,
      })
    ).toBe(false);
    expect(isValidOtaManifest(null)).toBe(false);
  });

  it('returns null safely on web (non-native) environments', async () => {
    const result = await checkAndDownloadOtaUpdate({ force: true });
    expect(result).toBeNull();
  });

  it('exports portable JSON and purges all localStorage + sessionStorage keys', () => {
    const exported = JSON.parse(exportLocalUserJson());
    expect(exported.appId).toBe('com.kuberansilks.dharma');
    expect(exported.data).toBeDefined();

    if (typeof window !== 'undefined') {
      localStorage.setItem('kuberan_dharma_user_v1', '{}');
      localStorage.setItem('kuberan_dharma_installed', 'true');
      localStorage.setItem('kuberan_dharma_ota_last_check', '12345');
      sessionStorage.setItem('temp_session', '1');

      clearLocalUser();

      expect(localStorage.getItem('kuberan_dharma_user_v1')).toBeNull();
      expect(localStorage.getItem('kuberan_dharma_installed')).toBeNull();
      expect(localStorage.getItem('kuberan_dharma_ota_last_check')).toBeNull();
      expect(sessionStorage.getItem('temp_session')).toBeNull();
    }
  });
});
