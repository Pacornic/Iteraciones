/* Kaizen service worker — cachea el "shell" de la app para abrir sin conexión.
   NO cachea las llamadas a Supabase (los datos): esas van a la red y, offline,
   la app usa su copia local. Sube el número de versión al cambiar la app. */
const CACHE = 'kaizen-v1';
const ASSETS = [
  './',
  './index.html',
  './config.js',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.allSettled(ASSETS.map((u) => c.add(u)));
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

  // Datos de Supabase: siempre a la red (no cachear). Offline fallará y la app usa su copia local.
  if (url.hostname.endsWith('supabase.co')) return;

  // Documento / navegación: red primero, con copia en caché como respaldo offline.
  if (req.mode === 'navigate' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html')) {
    e.respondWith((async () => {
      try {
        const net = await fetch(req);
        const c = await caches.open(CACHE);
        c.put('./index.html', net.clone());
        return net;
      } catch (_) {
        return (await caches.match('./index.html')) || (await caches.match(req)) || Response.error();
      }
    })());
    return;
  }

  // Resto de GET (config.js, librerías, iconos): caché primero, red como respaldo.
  e.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const net = await fetch(req);
      if (net && net.status === 200) {
        const c = await caches.open(CACHE);
        try { c.put(req, net.clone()); } catch (_) {}
      }
      return net;
    } catch (_) {
      return cached || Response.error();
    }
  })());
});
