// LEOMAX Service Worker — aggressive caching for performance
// Bump version on every meaningful asset change.
const CACHE_NAME = 'leomax-v40';

// Minimal install — pre-cache only the homepage + critical assets.
// Everything else gets cached on first visit (cache-first runtime).
const PRECACHE = [
  './LEOMAX_Website_Design.html',
  './monochrome.css',
  './leomax-nav.js',
  './manifest.json',
  './logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Strategy:
//   - HTML: network-first (always get latest, fallback to cache)
//   - Images / fonts / static assets: cache-first (long TTL — fixes "Use efficient cache lifetimes")
//   - 3rd-party (calendly): pass-through, no cache
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Don't intercept POST / non-GET requests
  if (req.method !== 'GET') return;

  // Don't cache cross-origin (calendly, analytics, etc.)
  if (url.origin !== location.origin) return;

  const isHTML = req.destination === 'document' ||
                 url.pathname.endsWith('.html') ||
                 url.pathname === '/' ||
                 url.pathname === '';

  if (isHTML) {
    // Network-first: always get latest HTML, fallback to cache
    event.respondWith(
      fetch(req).then(resp => {
        if (resp && resp.status === 200) {
          const clone = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone)).catch(()=>{});
        }
        return resp;
      }).catch(() => caches.match(req).then(m => m || caches.match('./LEOMAX_Website_Design.html')))
    );
  } else {
    // Cache-first for everything else (images, CSS, JS, fonts)
    event.respondWith(
      caches.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(resp => {
          if (resp && resp.status === 200) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, clone)).catch(()=>{});
          }
          return resp;
        }).catch(() => cached);
      })
    );
  }
});
