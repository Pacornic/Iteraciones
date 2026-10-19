/* Kaizen service worker — abre offline de forma fiable y se actualiza solo (sin versiones).
   Estrategia para los archivos de la app (mismo origen): "stale-while-revalidate":
     - Sirve AL INSTANTE la copia cacheada (por eso abre siempre, incluso sin red).
     - En paralelo, si hay internet, descarga la versión nueva y actualiza la caché
       para la próxima apertura. Así los cambios se recogen solos (a la siguiente vez).
   CDN (librerías inmutables): caché primero.
   Datos de Supabase: nunca se cachean; offline, la app usa su copia local. */
const CACHE = 'kaizen';
const CORE = [
  './', './index.html', './config.js', './manifest.webmanifest',
  './icon-192.png', './icon-512.png', './apple-touch-icon.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled(CORE.map((u) => c.add(u)));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch (_) { return; }

  // Datos de Supabase: siempre a la red (nunca cachear).
  if (url.hostname.endsWith('supabase.co')) return;

  // CDN u otros orígenes (librerías): caché primero, red como respaldo.
  if (url.origin !== self.location.origin) {
    e.respondWith((async () => {
      const cached = await caches.match(req, { ignoreSearch: true });
      if (cached) return cached;
      try {
        const net = await fetch(req);
        if (net && net.status === 200) { const c = await caches.open(CACHE); try { c.put(req, net.clone()); } catch (_) {} }
        return net;
      } catch (_) { return cached || Response.error(); }
    })());
    return;
  }

  // Mismo origen (la app): caché primero + refresco en segundo plano.
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    const fromNet = fetch(req).then((net) => {
      if (net && net.status === 200) { try { cache.put(req, net.clone()); } catch (_) {} }
      return net;
    }).catch(() => null);

    if (cached) { e.waitUntil(fromNet); return cached; }

    const net = await fromNet;
    if (net) return net;
    // Sin caché y sin red: para una navegación, devuelve el shell cacheado.
    if (req.mode === 'navigate') {
      return (await cache.match('./index.html', { ignoreSearch: true }))
          || (await cache.match('./', { ignoreSearch: true }))
          || Response.error();
    }
    return Response.error();
  })());
});
