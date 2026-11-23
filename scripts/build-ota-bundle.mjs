import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf8'));
const otaVersion = process.env.OTA_VERSION || process.env.NEXT_PUBLIC_OTA_VERSION || pkg.version || '1.0.0';
const otaNotes = process.env.OTA_NOTES || 'Latest sacred shlokas, UI polish, and offline improvements.';
const baseUrl = (process.env.OTA_BASE_URL || 'https://jee1vk.github.io/kuberan-dharma-app').replace(/\/$/, '');

const outDir = path.resolve('out');
const distDir = path.resolve('ota-dist');
const otaDir = path.join(distDir, 'ota');
const zipPath = path.join(otaDir, 'kuberan-dharma-bundle.zip');
const manifestPath = path.join(distDir, 'ota-manifest.json');

if (!fs.existsSync(path.join(outDir, 'index.html'))) {
  console.log('[Kuberan OTA] out/ not found — building Capacitor static export first...');
  execSync('node scripts/build-cap.mjs', {
    stdio: 'inherit',
    env: {
      ...process.env,
      CAPACITOR_BUILD: 'true',
      NEXT_PUBLIC_BASE_PATH: '',
      NEXT_PUBLIC_OTA_VERSION: otaVersion,
    },
  });
}

fs.mkdirSync(otaDir, { recursive: true });
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

console.log(`[Kuberan OTA] Packaging out/ -> ${zipPath} (v${otaVersion})...`);
const pyZipScript = [
  'import os, sys, zipfile',
  'src, dst = sys.argv[1], sys.argv[2]',
  'with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED, compresslevel=9) as zf:',
  '    for root, _, files in os.walk(src):',
  '        for f in files:',
  '            full = os.path.join(root, f)',
  '            rel = os.path.relpath(full, src).replace(os.sep, "/")',
  '            zf.write(full, rel)',
  'print("Packed", os.path.getsize(dst), "bytes")',
].join('\n');

let packed = false;
for (const pyBin of ['python3', 'python']) {
  try {
    execFileSync(pyBin, ['-c', pyZipScript, outDir, zipPath], { stdio: 'inherit' });
    packed = true;
    break;
  } catch {
    // Try next Python executable
  }
}

if (!packed) {
  throw new Error('Could not package OTA zip: neither python3 nor python is available.');
}

const manifest = {
  version: otaVersion,
  url: `${baseUrl}/ota/kuberan-dharma-bundle.zip`,
  notes: otaNotes,
  minNativeVersion: '1.0.0',
  builtAt: new Date().toISOString(),
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log(`[Kuberan OTA] Manifest written to ${manifestPath}`);
console.log(JSON.stringify(manifest, null, 2));
