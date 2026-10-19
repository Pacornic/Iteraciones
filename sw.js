/* Kaizen service worker — actualización automática sin versiones.
   Estrategia:
   - Mismo origen (index.html, config.js, iconos, manifest): RED PRIMERO.
     Con internet siempre sirve lo último y refresca la caché; sin internet usa la copia cacheada.
   - Librerías de CDN (supabase-js, pinada a @2): CACHÉ PRIMERO (inmutables).
   - Llamadas a Supabase (datos): nunca se cachean; offline, la app usa su copia local.
   No hay número de versión que tocar: los cambios se recogen solos al abrir con internet. */
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

  // CDN (librerías inmutables): caché primero, con respaldo de red.
  if (url.origin !== self.location.origin) {
    e.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const net = await fetch(req);
        if (net && net.status === 200) { const c = await caches.open(CACHE); try { c.put(req, net.clone()); } catch (_) {} }
        return net;
      } catch (_) { return cached || Response.error(); }
    })());
    return;
  }

  // Mismo origen (la app): RED PRIMERO, caché como respaldo offline.
  e.respondWith((async () => {
    try {
      const net = await fetch(req);
      if (net && net.status === 200) {
        const c = await caches.open(CACHE);
        try { c.put(req, net.clone()); } catch (_) {}
      }
      return net;
    } catch (_) {
      const cached = await caches.match(req);
      if (cached) return cached;
      if (req.mode === 'navigate') return (await caches.match('./index.html')) || Response.error();
      return Response.error();
    }
  })());
});
