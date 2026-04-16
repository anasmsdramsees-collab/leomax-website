const CACHE_NAME = 'leomax-v3';

const ASSETS = [
  './LEOMAX_Website_Design.html',
  './company-about.html',
  './company-case-studies.html',
  './company-contact.html',
  './company-founder.html',
  './company-process.html',
  './case-autopoint.html',
  './case-clenso.html',
  './case-garage.html',
  './case-hoolak.html',
  './case-jambak.html',
  './case-kbc.html',
  './case-lanova.html',
  './case-lsofia.html',
  './case-nadialamal.html',
  './case-nourish.html',
  './case-ramsees.html',
  './case-redstudio.html',
  './case-regional.html',
  './system-01-growth.html',
  './system-02-ai.html',
  './system-03-marketing.html',
  './system-04-content.html',
  './system-05-launch.html',
  './manifest.json',
  './PHOTO-2025-12-12-11-14-59.jpg'
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first for HTML, cache-first for assets
self.addEventListener('fetch', event => {
  const isHTML = event.request.destination === 'document' ||
                 event.request.url.endsWith('.html');

  if (isHTML) {
    // Network-first: always get latest HTML, fallback to cache
    event.respondWith(
      fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first for images, fonts, etc.
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      })
    );
  }
});
