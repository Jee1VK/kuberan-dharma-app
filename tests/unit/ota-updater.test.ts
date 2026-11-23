import { describe, it, expect } from 'vitest';
import {
  isNewerVersion,
  isValidOtaManifest,
  checkAndDownloadOtaUpdate,
} from '@/lib/ota/otaUpdater';

describe('Native OTA Live Updater', () => {
  it('accurately compares semantic versions', () => {
    expect(isNewerVersion('1.0.1', '1.0.0')).toBe(true);
    expect(isNewerVersion('1.0.12', '1.0.2')).toBe(true);
    expect(isNewerVersion('1.1.0', '1.0.99')).toBe(true);
    expect(isNewerVersion('2.0.0', '1.9.9')).toBe(true);
    expect(isNewerVersion('1.0.0', '1.0.0')).toBe(false);
    expect(isNewerVersion('1.0.0', '1.0.1')).toBe(false);
    expect(isNewerVersion('v1.0.5', '1.0.4')).toBe(true);
  });

  it('validates OTA manifest and enforces HTTPS-only bundle URLs', () => {
    expect(
      isValidOtaManifest({
        version: '1.0.5',
        url: 'https://jee1vk.github.io/kuberan-dharma-app/ota/kuberan-dharma-bundle.zip',
        notes: 'New shlokas',
      })
    ).toBe(true);

    // Reject insecure HTTP URLs
    expect(
      isValidOtaManifest({
        version: '1.0.5',
        url: 'http://example.com/bundle.zip',
      })
    ).toBe(false);

    // Reject missing version
    expect(isValidOtaManifest({ url: 'https://example.com/bundle.zip' })).toBe(false);
    expect(isValidOtaManifest(null)).toBe(false);
  });

  it('returns null safely on web (non-native) environments', async () => {
    const result = await checkAndDownloadOtaUpdate({ force: true });
    expect(result).toBeNull();
  });
});
