// Peak Bin Finder — minimal service worker.
// Its only job is to make the app reliably "installable" on Android/Chrome
// (an active SW with a fetch handler) and let it launch offline-friendly.
// It does NOT cache Firebase/CDN responses, so live sync is never stale.
const CACHE = 'peak-bin-finder-v1';

self.addEventListener('install', (e) => {
  self.skipWaiting();
  // Pre-cache the app shell (this file's host page) so a cold launch works.
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(['./', './bin-tracker.html']).catch(() => {}))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Only handle same-origin navigations/app-shell; let everything else
  // (Firebase, Google Fonts, CDNs) go straight to the network untouched.
  if (url.origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('./bin-tracker.html')))
    );
  }
});
