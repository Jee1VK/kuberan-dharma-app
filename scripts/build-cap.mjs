import { execSync } from 'node:child_process';

console.log('[Kuberan Dharma] Building Next.js static export for Capacitor (basePath="")...');
execSync('npx next build', {
  stdio: 'inherit',
  env: {
    ...process.env,
    CAPACITOR_BUILD: 'true',
    NEXT_PUBLIC_BASE_PATH: '',
  },
});
console.log('[Kuberan Dharma] Static export written to out/ successfully.');
