const CACHE_NAME = 'kuberan-dharma-v1';

const getScopedPath = (path) => {
  const scope = self.registration.scope;
  const url = new URL(scope);
  const basePath = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
  const cleanPath = path.replace(/^\//, '');
  return `${basePath}${cleanPath}`;
};

const PRECACHE_ASSETS = [
  '',
  'feed/',
  'stashes/',
  'manifest.json',
  'images/kuberan_logo_transparent.png',
  'images/kuberan_watermark_full.png',
  'images/kuberan_watermark_emblem.png',
  'images/app-icon-192.png',
  'images/app-icon-512.png',
  'images/app-icon-maskable-512.png',
  'images/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      const urlsToPrecache = PRECACHE_ASSETS.map((p) => getScopedPath(p));
      try {
        await cache.addAll(urlsToPrecache);
      } catch (err) {
        console.warn('[SW] Non-critical precache notice:', err);
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match(getScopedPath('')) || caches.match(getScopedPath('feed/'));
          }
        });

      return cachedResponse || fetchPromise;
    })
  );
});
