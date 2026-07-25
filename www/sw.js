const CACHE_NAME = 'meta-app-v36';
const STATIC_ASSETS = [
  // Idioma inglés: se pre-cachea para que el botón EN/ES funcione sin red
  // desde la primera vez (antes se quedaba en español y sin avisar).
  './js/metas-i18n.js',
  './misiones/2y3ciclo-que-es-un-robot/js/que-es-un-robot-en.js',
  './fichas/js/ficha-que-es-un-robot-en.js',
  './padres.html',
  './manifest-padres.json',
  './img/qr-padres.png',
  './img/logo.png',
  './img/icon-192.png',
  './img/icon-512.png',
  './img/jose-cecilio-del-valle-edit.webp',
  './css/vendor/fontawesome/css/all.min.css',
  './css/vendor/fontawesome/webfonts/fa-solid-900.woff2',
  './css/vendor/fontawesome/webfonts/fa-regular-400.woff2',
  'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Al instalar: pre-cachea imágenes, recursos externos y el idioma inglés.
// Uno por uno y tolerando fallos: con addAll, un solo archivo caído (un CDN,
// una misión renombrada) aborta TODA la instalación y el alumno se queda sin
// service worker.
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(STATIC_ASSETS.map(url =>
        cache.add(url).catch(err => console.warn('[sw] no se pudo cachear', url, err))
      ))
    )
  );
});

// Al activar: elimina cachés viejos y toma control inmediato
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: Network-first para HTML/CSS/JS, cache-first para imágenes externas
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  const isLocal = url.origin === location.origin;
  const isImage = event.request.destination === 'image';

  if (isLocal && !isImage) {
    // Archivos propios (HTML, CSS, JS): siempre va a la red primero y
    // revalidando contra el servidor (cache: 'no-cache' → ETag/304), porque
    // la caché HTTP del navegador guarda hasta 10 minutos y escondía los
    // despliegues nuevos: llegaba el HTML nuevo con el CSS y el JS viejos.
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Imágenes y recursos externos: cache-first (no cambian frecuentemente)
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
  }
});
