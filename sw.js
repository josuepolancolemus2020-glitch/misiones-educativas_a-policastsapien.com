/* Dos cachés, y la diferencia es la que rompía la promesa de funcionar sin
   internet.

   CACHE_APP lleva el armazón y se renueva en cada despliegue: por eso su
   nombre lleva la versión. CACHE_DATOS lleva lo que el alumno y el maestro van
   visitando —las misiones, sus imágenes, el motor de los juegos— y su nombre
   NO cambia, así que un despliegue ya no se lo lleva por delante.

   Antes había una sola caché con la versión dentro, y al activarse el service
   worker borraba todo lo que no fuera ella. Como el nombre cambia en cada
   publicación (es la normativa de sellado), CADA DESPLIEGUE borraba las
   misiones que el alumno había abierto con señal justamente para usarlas sin
   ella. Entre el 13 y el 28 de agosto de 2026 eso pasó 37 veces. */
// ⚠️ CACHE_NAME es el que se sube en CADA cambio de HTML, CSS o JS, junto con
//    las etiquetas ?v=NN de las páginas (normativa de sellado del CLAUDE.md).
//    CACHE_DATOS no se toca nunca: subirlo volvería a borrarle al alumno lo
//    que tenía guardado, que es justo lo que este arreglo vino a evitar.
const CACHE_NAME = 'meta-app-v180';
const CACHE_APP = CACHE_NAME;
const CACHE_DATOS = 'meta-datos-v1';

/* El armazón: lo mínimo para que la aplicación ABRA sin señal la primera vez.
   Antes no estaba y hacía falta una SEGUNDA visita en línea para que el
   teléfono la tuviera entera; hasta entonces, sin internet, pantalla en blanco.

   Es a propósito lo mínimo y no los 25 scripts de la portada (2,8 MB): las
   herramientas del maestro entran solas en CACHE_DATOS la primera vez que
   abre la aplicación en línea —que tiene que hacerlo igual para entrar— y
   ahora se QUEDAN ahí. Precachearlas todas castigaría la primera visita de un
   pueblo con la conexión que hay. */
const ARMAZON = [
  './',
  './index.html',
  './manifest.json',
  './css/app.css',
  './js/app.js',
  './js/metas-dialogos.js',
  './js/data/misiones.js',
  './js/data/dcnb-map.js',
  './js/data/diagnosticos.js',
  './js/data/proceres.js',
  './js/data/paises.js',
  './js/data/frases.js',
  './js/data/consejos-padres.js',
];

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

/* Al instalar: pre-cachea el armazón, las imágenes, los recursos externos y el
   idioma inglés. Uno por uno y tolerando fallos: con addAll, un solo archivo
   caído (un CDN, una misión renombrada) aborta TODA la instalación y el alumno
   se queda sin service worker.

   Y con PLAZO_INSTALA, porque tolerar el fallo no basta: la señal mala no
   siempre falla, muchas veces se queda colgada y no contesta NUNCA. Con un
   `cache.add` a un CDN que no responde, la instalación se quedaba en marcha
   para siempre, el service worker nuevo no llegaba a activarse y el viejo
   seguía mandando —con su caché vieja y sin lo que se acabara de publicar—.
   Es la misma lección que ya está escrita en el cargador de los juegos 3D. */
const PLAZO_INSTALA = 12000;

function precachear(cache, url) {
  return Promise.race([
    cache.add(url).catch(err => console.warn('[sw] no se pudo cachear', url, err)),
    new Promise(listo => setTimeout(() => {
      console.warn('[sw] tardó demasiado y se sigue sin él:', url);
      listo();
    }, PLAZO_INSTALA))
  ]);
}

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(ARMAZON.concat(STATIC_ASSETS).map(url => precachear(cache, url)))
    )
  );
});

/* Al activar: se borran los ARMAZONES viejos y nada más. CACHE_DATOS
   sobrevive al despliegue, que es justo lo que hace que el alumno conserve
   las misiones que ya había abierto. */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key =>
        (key.indexOf('meta-app-') === 0 && key !== CACHE_APP) ? caches.delete(key) : null
      ))
    ).then(() => self.clients.claim())
  );
});

/* Cuánto se espera a la red antes de tirar de lo guardado. Tres segundos: lo
   bastante para que una conexión lenta-pero-viva gane y el alumno reciba lo
   nuevo, y lo bastante poco para que la aplicación no parezca trabada. */
const PLAZO_RED = 3000;

/* Guardar es lo que hace real la promesa de funcionar sin internet, pero no
   todo se puede guardar: `cache.put` revienta con un POST —y a Supabase se le
   habla por POST— y guardar un error 404 o 500 le enseñaría al teléfono una
   pantalla rota para siempre. Las opacas SÍ entran: son los recursos de otro
   dominio (el motor de los juegos 3D) y de esas no se puede leer el estado. */
/* El orden importa y no se deja al azar. `caches.match` sin nombre recorre las
   cachés en el orden en que se crearon, y CACHE_DATOS es más vieja que el
   armazón recién publicado: sin esto, después de un despliegue podía servirse
   el index.html guardado de ayer junto al app.js de hoy. Manda el armazón. */
function buscarCopia(peticion) {
  return caches.open(CACHE_APP)
    .then(c => c.match(peticion, { ignoreSearch: true }))
    .then(copia => copia || caches.open(CACHE_DATOS)
      .then(c => c.match(peticion, { ignoreSearch: true })));
}

function guardar(peticion, respuesta, cual) {
  if (peticion.method !== 'GET') return;
  if (!respuesta || !(respuesta.ok || respuesta.type === 'opaque')) return;
  const copia = respuesta.clone();
  caches.open(cual).then(cache => cache.put(peticion, copia)).catch(() => {});
}

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
    /* Archivos propios (HTML, CSS, JS): la red primero y revalidando contra el
       servidor (cache: 'no-cache' → ETag/304), porque la caché HTTP del
       navegador guarda hasta 10 minutos y escondía los despliegues nuevos:
       llegaba el HTML nuevo con el CSS y el JS viejos.

       Pero «la red primero» sin plazo no vale en un aula: la señal mala no
       falla, se queda colgada, y el alumno miraba una pantalla en blanco
       teniendo la misión guardada en el teléfono. Ahora se le dan PLAZO_RED
       milisegundos; pasados esos, si hay copia guardada se sirve esa. Si NO
       la hay se sigue esperando a la red, porque media pantalla es peor que
       una pantalla que tarda. */
    const red = fetch(event.request, { cache: 'no-cache' }).then(respuesta => {
      guardar(event.request, respuesta, CACHE_DATOS);
      return respuesta;
    });
    const plazo = new Promise(listo => setTimeout(() => listo(null), PLAZO_RED));
    event.respondWith(
      Promise.race([red.catch(() => null), plazo]).then(respuesta => {
        if (respuesta) return respuesta;
        /* ignoreSearch: el precache guarda «js/app.js» y la página lo pide como
           «js/app.js?v=NNN» (el sello de versión). Sin esto, lo precacheado no
           lo encontraba nadie y el armazón guardado no servía de nada. */
        return buscarCopia(event.request).then(copia => copia || red);
      })
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
          guardar(event.request, respuesta, CACHE_DATOS);
          return respuesta;
        });
      })
    );
  }
});
