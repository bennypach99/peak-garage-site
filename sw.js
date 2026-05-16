const CACHE_NAME = 'drywall-takeoff-v1';
const URLS_TO_CACHE = [
  '/takeoff.html',
  '/manifest.json'
];

// Install: Cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching app shell');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network-first for HTML (to get latest JS logic), Cache-first for external assets (fonts/Firebase)
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // For the main HTML, try network first, fall back to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/takeoff.html');
      })
    );
    return;
  }

  // For everything else (Firebase, Fonts), try cache first, fall back to network
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then(networkResponse => {
        // Cache successful external requests dynamically
        if (networkResponse && networkResponse.status === 200 && request.url.startsWith('http')) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseToCache));
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback for non-navigation requests if needed
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});
