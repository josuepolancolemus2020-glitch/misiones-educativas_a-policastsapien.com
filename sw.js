const CACHE_NAME = 'meta-app-v156';
const STATIC_ASSETS = [
  // Idioma inglés: se pre-cachea para que el botón EN/ES funcione sin red
  // desde la primera vez (antes se quedaba en español y sin avisar).
  // Van TODAS las traducidas: si el catálogo le promete «🌐 EN» al alumno,
  // el archivo tiene que estar ya en el teléfono cuando lo abra sin señal.
  // Al traducir una misión nueva, añadir aquí sus dos líneas.
  './js/metas-i18n.js',
  './misiones/2y3ciclo-que-es-un-robot/js/que-es-un-robot-en.js',
  './fichas/js/ficha-que-es-un-robot-en.js',
  './misiones/2y3ciclo-sensores-robot/js/sensores-robot-en.js',
  './fichas/js/ficha-sensores-robot-en.js',
  './misiones/2y3ciclo-motores-mecanismos/js/motores-mecanismos-en.js',
  './fichas/js/ficha-motores-mecanismos-en.js',
  './misiones/2y3ciclo-electricidad-robots/js/electricidad-robots-en.js',
  './fichas/js/ficha-electricidad-robots-en.js',
  './misiones/2y3ciclo-programando-robot/js/programando-robot-en.js',
  './fichas/js/ficha-programando-robot-en.js',
  './misiones/2y3ciclo-robots-problemas/js/robots-problemas-en.js',
  './fichas/js/ficha-robots-problemas-en.js',
  './misiones/2y3ciclo-pensamiento-computacional/js/pensamiento-computacional-en.js',
  './fichas/js/ficha-pensamiento-computacional-en.js',
  './misiones/2y3ciclo-robot-decide/js/robot-decide-en.js',
  './fichas/js/ficha-robot-decide-en.js',
  './padres.html',
  './salida.html',
  './buzon.html',
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
    // Imágenes y recursos externos: cache-first (no cambian frecuentemente).
    // Y lo que se baja se GUARDA. Antes esta rama solo LEÍA de la caché,
    // así que lo externo no entraba nunca —nadie lo metía— y dependía de
    // la caché del navegador, que se vacía sola. Con los juegos 3D eso
    // dejó de ser un detalle: bajan su motor de dibujo de un CDN, y la
    // pantalla le promete al alumno que abriéndolos una vez con señal
    // después funcionan sin ella. Esta línea es la que cumple la promesa.
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(respuesta => {
          if (respuesta && (respuesta.ok || respuesta.type === 'opaque')) {
            const copia = respuesta.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, copia));
          }
          return respuesta;
        });
      })
    );
  }
});
