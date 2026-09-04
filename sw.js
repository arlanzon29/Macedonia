/* Service worker mínimo.
   Existe por dos razones: Chrome exige un manejador de 'fetch' para considerar la
   web instalable en Android (sin eso no hay modo standalone y la barra de URL se
   queda), y de paso los juegos funcionan sin conexión. */
'use strict';

const CACHE = 'macedonia-v1';

const ASSETS = [
  './',
  './index.html',
  './games/escuadron/index.html',
  './games/convoy/index.html',
  './manifest.webmanifest',
  './icon.svg',
  './icon-maskable.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      // Un fallo suelto (un archivo renombrado) no debe abortar la instalación entera
      .then(c => Promise.allSettled(ASSETS.map(a => c.add(a))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Red primero, caché como respaldo: así una partida nueva llega en cuanto se
   publica, pero el juego sigue abriendo sin cobertura. */
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        if (res && res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
