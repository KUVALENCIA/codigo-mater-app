// Cambiamos a v2 para que los celulares reconozcan que hay una actualización
const CACHE_NAME = 'codigo-mater-v2';

// Lista de todos los archivos que necesitamos guardar para funcionar sin internet
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json'
];

// 1. Evento de Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
          console.log('Archivos guardados en caché v2');
          return cache.addAll(urlsToCache);
      })
  );
  // Fuerza a que el nuevo Service Worker tome el control de inmediato
  self.skipWaiting();
});

// 2. Evento de Activación (NUEVO: Para limpiar la basura vieja)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Si encuentra una caché vieja que no sea la v2, la elimina
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Asegura que todas las pestañas abiertas tomen la nueva versión
  event.waitUntil(clients.claim());
});

// 3. Evento Fetch (Para entregar los archivos guardados cuando no hay internet)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
          // Si el archivo está en la caché, lo entrega. Si no, lo busca en internet.
          return response || fetch(event.request);
      })
  );
});
