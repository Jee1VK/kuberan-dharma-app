export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

/**
 * Returns an asset path prefixed with the base path when deployed (e.g. on GitHub Pages).
 */
export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${cleanPath}`;
}
