/**
 * Resumezy Progressive Web App Service Worker
 * Provides offline caching, lightning-fast font loading, and background sync.
 */

const CACHE_NAME = 'resumezy-pwa-v1';

const STATIC_ASSETS = [
  '/',
  '/resumezy',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/icon.svg',
  '/fonts/computer-modern/cmunrm.woff',
  '/fonts/computer-modern/cmunbx.woff',
  '/fonts/computer-modern/cmunti.woff',
  '/fonts/computer-modern/cmunbi.woff'
];

// Install: Cache critical shell and web fonts
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('PWA pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up old caches
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

// Fetch: Stale-While-Revalidate for fonts/static, Network-first for API
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass API calls
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Fonts & Images: Cache-first with network fallback
  if (url.pathname.includes('/fonts/') || url.pathname.includes('/icons/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // General App Shell navigation: Network-first with cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/resumezy') || caches.match('/');
      })
    );
    return;
  }

  // Stale-While-Revalidate for CSS/JS
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      }).catch(() => {});

      return cachedResponse || fetchPromise;
    })
  );
});
