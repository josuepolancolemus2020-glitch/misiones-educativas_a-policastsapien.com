const CACHE_NAME = 'meta-app-v170';
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
  // El andamio de los juegos 3D: telón, velos, lienzo y mandos. Sin
  // estos dos, los doce juegos dejan de funcionar sin internet —y esa
  // promesa está escrita en su propia pantalla—: se quedarían sin
  // cargador, sin telón y sin CSS, o sea en blanco.
  './js/3d/parque-3d.js',
  './css/parque-3d.css',
  // La sección 🎬 Videos de las misiones. Sin estos cuatro, la sección
  // no se pinta sin internet y el alumno ve un hueco en vez de la lista
  // de lo que hay —que sí se puede enseñar sin señal, porque viene
  // guardada—. Los VIDEOS necesitan conexión y la pantalla lo dice; la
  // lista, no.
  './js/videos-mision.js',
  './css/videos-mision.css',
  './js/data/videos-misiones.js',
  './js/metas-videos.js',
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

  /* ⚠️ LO QUE SE TRANSMITE NO PASA POR AQUÍ. NUNCA.
     ─────────────────────────────────────────────────────────────────
     Esto costó un video que se reproducía UN SEGUNDO y se iba al final,
     el 28 de agosto de 2026, el mismo día que se estrenó la sección
     🎬 Videos. El fallo no estaba en el reproductor: estaba aquí.

     La rama de abajo sirve «cache-first» TODO lo que no es del propio
     dominio. Eso se escribió para el motor de dibujo de los juegos 3D,
     que es un archivo suelto que no cambia. Pero un video no es un
     archivo: son cientos de trozos que el reproductor va pidiendo por
     rangos de bytes, y cada respuesta vale para ESE rango y ese
     momento. Servirle uno guardado —o guardarle una respuesta parcial,
     que además `cache.put` ni siquiera admite— le hace concluir que el
     flujo se acabó, y el reproductor salta al final. Que es exactamente
     lo que se vio.

     Y la sonda no podía cazarlo: Playwright arranca sin service worker,
     así que en la prueba esta rama no existe. Es el mismo punto ciego
     que ya está apuntado en el CLAUDE.md a cuenta de la convocatoria.

     Dos guardias, y hacen falta los dos:

       1. La casa de YouTube entera, por nombre. Los trozos de video no
          vienen de youtube.com sino de googlevideo.com, y el reproductor
          se reparte entre cuatro dominios más.
       2. CUALQUIER petición por rangos, venga de donde venga. Es la
          regla de verdad: el día que se incruste un audio o un video de
          otro sitio, este mismo fallo volvería con otra cara.

     No se llama a respondWith: se sale y lo atiende el navegador, que es
     quien sabe hacerlo. Y no, esto no rompe la promesa de los juegos 3D:
     un video necesita internet de todas formas, y la pantalla lo dice. */
  const CASA_YT = /(^|\.)(youtube|youtube-nocookie|googlevideo|ytimg|ggpht|youtu)\.(com|be)$/;
  if (CASA_YT.test(url.hostname) || event.request.headers.has('range')) return;

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
