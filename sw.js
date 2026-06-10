// Peak Bin Finder — minimal, self-contained service worker.
// Purpose: make the app reliably installable on Android/Chrome and let it
// cold-launch. It is deliberately INERT for every page except bin-tracker.html,
// so it cannot interfere with any other site in your repository — even if it
// ends up registered at the domain root.
const CACHE = 'peak-bin-finder-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Only ever touch GET *navigations* to this app's own page. For literally
  // everything else (other pages, Firebase, fonts, CDNs, assets) we do NOT call
  // respondWith(), so the browser handles them exactly as if no SW existed.
  if (req.method !== 'GET' || req.mode !== 'navigate') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;
  if (!url.pathname.endsWith('/bin-tracker.html')) return;

  // Network-first for our own page; fall back to the cached copy when offline.
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(req))
  );
});
