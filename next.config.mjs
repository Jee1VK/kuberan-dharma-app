const isProd = process.env.NODE_ENV === 'production';
const isCapacitor = process.env.CAPACITOR_BUILD === 'true' || process.env.NEXT_PUBLIC_BASE_PATH === '';
const repoName = 'kuberan-dharma-app';

const basePath = isCapacitor
  ? ''
  : (process.env.NEXT_PUBLIC_BASE_PATH !== undefined ? process.env.NEXT_PUBLIC_BASE_PATH : (isProd ? `/${repoName}` : ''));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: basePath,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
