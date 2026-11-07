/* Universe Studio offline app shell. Only static assets are cached, never saves or exports. */
const VERSION = 'universe-studio-v21-3-pwa-2026-11-07';
const SHELL = ['./', './index.html', './iphone-v21.1.css', './iphone-v21.1.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon-64.png'];
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('universe-studio-') && k !== VERSION).map(k => caches.delete(k)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  // Cache only same-origin app-shell resources, excluding any user JSON exports or AI calls.
  const appBase = new URL(self.registration.scope);
  const isApp = url.pathname === appBase.pathname || url.pathname === new URL('index.html', appBase).pathname;
  const isAsset = SHELL.some(path => new URL(path, appBase).pathname === url.pathname);
  if (!isApp && !isAsset) return;
  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const key = isApp ? new URL('index.html', appBase).href : url.href;
    const hit = await cache.match(key);
    if (hit) return hit;
    try {
      const network = await fetch(request);
      if (network.ok) await cache.put(key, network.clone());
      return network;
    } catch (e) {
      return (await cache.match(new URL('index.html', appBase).href)) || Response.error();
    }
  })());
});
