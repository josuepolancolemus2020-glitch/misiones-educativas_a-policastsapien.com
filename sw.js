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
const CACHE_NAME = 'meta-app-v581';
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
  // Mi aula del corte 1 y su motor de datos (docs/rediseno-datos/03, 3.10):
  // tienen que estar aunque el maestro abra la app sin señal, porque es
  // justo ahí donde anota y la cola guarda lo anotado.
  './css/mi-aula.css',
  './js/vendor/supabase.min.js',
  './js/datos/ids.js',
  './js/datos/montos.js',
  './js/datos/nube.js',
  './js/datos/almacen.js',
  './js/datos/cola.js',
  './js/datos/tiempo-real.js',
  './js/datos/senal.js',
  './js/datos/calculos.js',
  './js/datos/datos.js',
  './js/datos/importar.js',
  './js/datos/claves-familia.js',
  './js/metas-centro.js',
  './js/tools/mi-aula.js',
  './js/tools/mi-aula-papel.js',
  // La pantalla de antes (equipos, acumulativos…) armada desde las filas.
  './js/tools/mi-aula-puente.js',
  // Las tipografías. La CSS pesa 6 KB y trae todas las familias sin bajar
  // ni un byte de más: cada @font-face declara su unicode-range, así que
  // el navegador solo pide la letra que la página de verdad pinta. De ahí
  // se precachea únicamente Outfit, que es la del armazón del maestro:
  // index.html SÍ abre sin señal la primera vez, y tiene que abrir con su
  // letra. Las de las misiones NO van aquí, y no es un olvido: una misión
  // que no se visitó en línea no está en la caché, así que guardarle la
  // letra sería guardar la letra de una página que no existe todavía.
  './css/vendor/fuentes/fuentes.css',
  './css/vendor/fuentes/outfit-latin.woff2',
  './js/app.js',
  './js/metas-dialogos.js',
  // Quien pide lo pesado cuando hace falta (los textos de lectura y la foto
  // de las calificaciones). Pesa 3 KB y sin él esos dos botones no cargan nada.
  './js/metas-carga.js',
  './js/data/misiones.js',
  './js/data/dcnb-map.js',
  // De qué grado es cada misión. Va en el armazón porque la lista de
  // Misiones es lo primero que abre la alumna, y sin esto vuelve a ver
  // las 67 tarjetas iguales — justo en el aula sin señal, que es donde
  // la aplicación tiene que valerse sola.
  './js/grado-alumno.js',
  // El tamaño de letra del maestro. Va en el armazón porque se aplica en
  // el <head>, ANTES del primer pintado: si faltara sin señal, la pantalla
  // abriría pequeña y daría el salto justo cuando el maestro ya puso el
  // dedo — y en el aula sin señal es donde más la usa.
  './js/letra-maestro.js',
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
  // Y lo que comparten los SEIS juegos de la Ruta de la Máquina que
  // Aprende: la nube de puntos en el espacio de tres medidas, con el
  // vecino más cercano, los k vecinos y las k-medias. Es el aparato de
  // ESE parque, no el de todos: sin él sus seis juegos se quedan sin
  // dibujo y sin las tres cuentas que deciden lo que el alumno ve.
  './js/3d/nube-ia.js',
  './css/parque-ia.css',
  // La sección 🎬 Videos de las misiones. Sin estos cuatro, la sección
  // no se pinta sin internet y el alumno ve un hueco en vez de la lista
  // de lo que hay —que sí se puede enseñar sin señal, porque viene
  // guardada—. Los VIDEOS necesitan conexión y la pantalla lo dice; la
  // lista, no.
  './js/videos-mision.js',
  './css/videos-mision.css',
  './js/data/videos-misiones.js',
  // La animación que explica el tema, después de la historia de cada
  // misión. Sin estos dos, sin señal la tarjeta se queda con su frase de
  // reserva: justo en el aula sin internet, donde una explicación que se
  // mueve vale más. La escena de cada misión vive en su carpeta y entra
  // en CACHE_DATOS la primera vez que se abre, como el resto de la misión.
  './js/animacion-mision.js',
  './css/animacion-mision.css',
  // El vocabulario y las fechas de la Ruta de la Máquina que Aprende. Las
  // cuatro misiones los PINTAN de aquí en vez de escribirlos, así que sin
  // ellos esas pantallas salen vacías.
  './js/data/ia-conceptos.js',
  './js/data/ia-historia.js',
  // Las actividades de Descubre de las cuatro misiones de IA: sin este archivo
  // el arranque de la misión no pinta las actividades, y sin señal es cuando se repasa.
  './js/data/ia-descubre.js',
  // Los trece peligros de la etapa 5, con su mecanismo y su defensa.
  './js/data/ia-peligros.js',
  // El dossier fechado de la actualidad y el termómetro de la etapa 6.
  './js/data/ia-actualidad.js',
  './js/data/ia-futuros.js',
  './js/metas-videos.js',
  // La barra de secciones de las misiones, arriba y pegajosa. Sin estos
  // dos el <nav> vuelve al final del documento y sin position:sticky: en
  // una sección de catorce pantallas eso es el alumno sin forma de
  // cambiar de sección, justamente en el aula sin señal.
  './js/barra-secciones.js',
  './css/barra-secciones.css',
  // El acierto y el error sin depender del color. Sin esta hoja, el niño
  // que no distingue el rojo del verde vuelve a quedarse sin poder
  // terminar Clasifica — y sin señal es justo cuando más falta hace.
  './css/senal-no-color.css',
  // El Laboratorio con la letra del resto de la misión y botones de 44 px.
  // Sin esta hoja, la explicación del Laboratorio se lee a dos tercios del
  // párrafo de al lado, y justo sin señal es cuando la misión se repasa.
  './css/lab-legible.css',
  // Que las actividades se puedan hacer sin el dedo. Sin estos dos, el
  // alumno que no usa el dedo se queda sin poder clasificar, emparejar ni
  // identificar nada —y sin ver dónde tiene el foco—, justamente en el
  // aula sin señal, que es donde la aplicación tiene que valerse sola.
  './js/teclado-actividades.js',
  './css/teclado-actividades.css',
  // Que la estrella se gane. Sin él vuelven las cuatro estrellas de
  // regalo al abrir y el XP que se repite recargando — y el aula sin
  // señal es justo donde la aplicación tiene que valerse sola.
  './js/estrella-ganada.js',
  './js/motor-misiones.js',
  './js/motor-mision.js',
  // Las piezas propias de la Ruta de la Máquina que Aprende, compartidas por
  // sus cuatro misiones (el entrenador, la línea del tiempo, el predictor, el
  // cazador de inventos). Sin él esas cuatro pantallas se ven sin formato, y
  // el aula sin señal es justo donde tienen que valerse solas.
  './css/ruta-ia.css',
  './padres.html',
  // El texto de las notas en el portal de familias. Sin él, la página abre
  // y la familia no ve las notas aunque la clave ya esté vinculada.
  './js/familia-notas.js',
  './salida.html',
  './buzon.html',
  './manifest-padres.json',
  './img/qr-padres.png',
  './img/logo.png',
  // Los iconos de la aplicación instalada. Son cuatro y no dos: los dos
  // `any` los enseña el navegador casi enteros, y los dos `maskable` son
  // los que Android recorta con su máscara —por eso el logo va dentro del
  // círculo del 80 %—. Si faltara el maskable, Android se quedaría con el
  // `any` y le cortaría la palabra «EDITORIAL» al logo del editorial.
  './img/icon-192.png',
  './img/icon-512.png',
  './img/icon-maskable-192.png',
  './img/icon-maskable-512.png',
  './img/jose-cecilio-del-valle-edit.webp',
  './css/vendor/fontawesome/css/all.min.css',
  './css/vendor/fontawesome/webfonts/fa-solid-900.woff2',
  './css/vendor/fontawesome/webfonts/fa-regular-400.woff2'
  // Aquí estaban la CSS de Google Fonts y la de Font Awesome del CDN.
  // Se fueron con el hallazgo 7: las dos son hojas de estilo externas,
  // y una hoja de estilo bloquea el pintado. Y la de Google además
  // mentía: se guardaba la CSS, nunca los .woff2 de fonts.gstatic.com,
  // así que sin señal la letra no llegaba igual.
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

/* Con `cache: 'reload'`, y no es un capricho: GitHub Pages manda sus archivos
   con max-age=600, así que durante diez minutos después de publicar el
   navegador le contestaba al precacheo con SU copia vieja sin preguntarle al
   servidor. El armazón «nuevo» se llenaba con archivos del despliegue
   anterior y ahí se quedaban, porque el armazón no se vuelve a bajar hasta
   la siguiente versión. */
function precachear(cache, url) {
  return Promise.race([
    cache.add(new Request(url, { cache: 'reload' })).catch(err => console.warn('[sw] no se pudo cachear', url, err)),
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

/* Host de la base. Incluye el proyecto y los subdominios (auth, rest,
   realtime, storage): todos son datos del maestro, no un archivo de la
   aplicación. */
function hostDeSupabase(hostname) {
  return /(^|\.)supabase\.co$/i.test(hostname || '');
}

/* Al activar: se borran los ARMAZONES viejos. CACHE_DATOS sobrevive al
   despliegue, que es justo lo que hace que el alumno conserve las misiones
   que ya había abierto.

   De CACHE_DATOS sí se quitan las lecturas de Supabase que el arreglo
   anterior había guardado ahí. Una fila vieja en esa caché hacía que la
   cola releyera la versión de antes, perdiera los reintentos y se trabara,
   y que el otro aparato nunca viera el cambio. Solo esas entradas: ni otro
   caché, ni lo que el alumno ya tenía guardado. */
function purgarLecturasDeLaBase(nombres) {
  if (nombres.indexOf(CACHE_DATOS) < 0) return null;
  return caches.open(CACHE_DATOS).then(cache => cache.keys().then(reqs =>
    Promise.all(reqs.map(req => {
      let host = '';
      try { host = new URL(req.url).hostname; } catch (_) { return null; }
      return hostDeSupabase(host) ? cache.delete(req) : null;
    }))
  ));
}

/* Antes de borrar un armazón viejo se rescata lo que sigue valiendo.

   Los service worker de antes (v13, v145...) guardaban en SU meta-app-vNNN
   cada guion que pedía la página. Al activarse este, esa caché se borraba
   entera, y el aviso «guardar-vistos» de la portada no alcanzaba a reponer
   nada: sus descargas quedaban en cola detrás de las ~93 de la instalación
   (Chromium atiende 6 a la vez por servidor) y PLAZO_INSTALA dejaba de
   esperarlas. CACHE_DATOS quedaba vacía, y la siguiente apertura con la
   señal colgada esperaba 10 s por cada guion que faltaba: la aplicación
   instalada desde junio se quedaba trabada. Lo vio
   _dev/verifica-arranque-sw.js en el CI desde el 16 de noviembre de 2026,
   cuando la portada pasó de 41 a 55 guiones.

   Se copia de caché a caché, sin tocar la red, así que no le gasta datos al
   maestro. Solo lo propio y con sello (?v=NN): la dirección exacta es ESE
   archivo y no otro. Lo demás (la portada, las letras, lo sin sello) pudo
   haber cambiado y no se rescata. Lo que ya está en CACHE_DATOS no se pisa. */
function rescatarSellados(viejo) {
  return Promise.all([caches.open(viejo), caches.open(CACHE_DATOS)]).then(([de, a]) =>
    de.keys().then(reqs => Promise.all(reqs.map(req => {
      let url;
      try { url = new URL(req.url); } catch (_) { return null; }
      if (url.origin !== location.origin || !conSello(url)) return null;
      return a.match(req).then(ya => ya ? null : de.match(req).then(copia =>
        copiaValida(copia) && copia.type !== 'opaque' ? a.put(req, copia) : null));
    })))
  ).catch(() => {});
}

function limpiarLoViejo() {
  return caches.keys().then(keys =>
    Promise.all(keys.map(key =>
      (key.indexOf('meta-app-') === 0 && key !== CACHE_APP)
        ? rescatarSellados(key).then(() => caches.delete(key))
        : null
    )).then(() => purgarLecturasDeLaBase(keys))
  );
}

/* Una segunda pasada, unos segundos después de tomar el control. Mientras
   este se activa, el service worker viejo todavía contesta lo que la
   pestaña abierta ya había pedido, y al terminar lo vuelve a guardar en
   SU caché (meta-app-vNNN) y en meta-datos-v1 (las lecturas de la base, de
   v548 a v567). Se vio en _dev/verifica-sync-dos-aparatos.js. La pasada
   va en la primera petición que llega después del plazo, con waitUntil:
   así no se corta a medias. */
const PLAZO_SEGUNDA_LIMPIEZA = 3000;
let segundaLimpieza = 0;

self.addEventListener('activate', event => {
  event.waitUntil(
    limpiarLoViejo()
      .then(() => { segundaLimpieza = Date.now() + PLAZO_SEGUNDA_LIMPIEZA; })
      .then(() => self.clients.claim())
  );
});

/* Cuánto se espera a la red antes de tirar de lo guardado. Tres segundos: lo
   bastante para que una conexión lenta-pero-viva gane y el alumno reciba lo
   nuevo, y lo bastante poco para que la aplicación no parezca trabada. */
const PLAZO_RED = 3000;

/* ── Ninguna espera infinita ───────────────────────────────────────────
   Una tablet con la aplicación instalada desde abril se quedó en la pantalla
   de inicio (el logo con el nombre viejo) y no pasó de ahí. Esa pantalla dura
   hasta que llega el primer HTML, y el HTML no llegaba: la señal no fallaba,
   se quedaba colgada, y el service worker esperaba a la red SIN RELOJ.

   PLAZO_RED es cuánto se espera antes de mirar lo guardado. Pero si no había
   nada guardado se seguía esperando a la red, y eso podía ser para siempre.
   Ahora todo lo que se le pide a la red tiene un tope:

     · Una página (navegación) sin copia: PLAZO_PAGINA en total. Pasado eso,
       la página mínima de PAGINA_SIN_SENAL con su botón «Reintentar», en vez
       de la pantalla congelada.
     · Un guion, una hoja o una imagen sin copia: PLAZO_RECURSO. Pasado eso,
       un error, y la página sigue sin esa pieza. Un <script> que no contesta
       detiene TODO lo que viene después en la página: con 30 guiones en la
       portada, uno colgado bastaba para que nunca arrancara.
     · Lo que se trae por detrás: PLAZO_DETRAS, para no dejar conexiones
       abiertas que le roban turno a lo que el maestro sí está esperando.

   Los topes miden hasta que llegan las cabeceras, no la descarga entera: una
   conexión lenta pero viva contesta en uno o dos segundos aunque luego tarde
   en bajar el archivo, y esa no se corta. */
const PLAZO_PAGINA = 10000;
const PLAZO_RECURSO = 10000;
const PLAZO_DETRAS = 30000;

/* La promesa con reloj: si no se resuelve a tiempo, sale `null`. Si falla,
   también `null`: quien llama decide qué hacer sin respuesta. */
function conTope(promesa, ms) {
  return new Promise(listo => {
    const reloj = setTimeout(() => listo(null), ms);
    promesa.then(r => { clearTimeout(reloj); listo(r); },
                 () => { clearTimeout(reloj); listo(null); });
  });
}

/* fetch que se CANCELA al vencer el plazo, para soltar la conexión. Solo
   para lo que no es una navegación: a la petición de una página no se le
   pueden pasar opciones sin estropearla (ver navegarPorRed). Si vence, la
   promesa falla como falla una red caída, y cada rama ya sabe qué hacer. */
function traer(peticion, opciones, ms) {
  const corte = typeof AbortController === 'function' ? new AbortController() : null;
  const op = Object.assign({}, opciones, corte ? { signal: corte.signal } : null);
  const reloj = setTimeout(() => corte && corte.abort(), ms);
  const red = fetch(peticion, op);
  red.then(() => clearTimeout(reloj), () => clearTimeout(reloj));
  /* Sin AbortController (navegadores muy viejos) no se puede cancelar, pero
     igual se deja de esperar: el tope lo pone conTope. */
  return corte ? red : conTope(red, ms).then(r => r || Promise.reject(new Error('sin respuesta')));
}

/* La página para cuando no hay copia guardada y la red no contesta. Va aquí
   dentro y no en un archivo: si dependiera de un archivo, ese archivo tendría
   que llegar por la misma red que no contesta. Una sola frase neutra, la
   misma de la entrada del docente (09-INTERFAZ.md, 9.4), y un botón para
   intentar otra vez. Sin letra ni hoja de fuera: las del
   sistema, que ya están en el teléfono. */
const PAGINA_SIN_SENAL = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#1e3a7c">
<title>M.E.T.A.S.</title>
<style>
  :root { color-scheme: light; }
  html, body { margin: 0; height: 100%; }
  body { display: flex; align-items: center; justify-content: center; padding: 24px;
         box-sizing: border-box; background: #ffffff; color: #1f2937; text-align: center;
         font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  main { max-width: 26rem; }
  .logo { font-size: 2rem; font-weight: 900; letter-spacing: 5px; color: #1e3a7c; line-height: 1; }
  .sub { font-size: .8rem; font-weight: 600; color: #6b7280; margin-top: 6px; }
  p { font-size: 1.15rem; line-height: 1.5; margin: 28px 0; }
  button { font: inherit; font-size: 1.1rem; font-weight: 700; min-height: 48px; min-width: 44px;
           padding: 10px 28px; border: 0; border-radius: 12px; background: #1e3a7c; color: #ffffff;
           cursor: pointer; }
  button:focus-visible { outline: 3px solid #3b82f6; outline-offset: 3px; }
</style>
</head>
<body>
<main>
  <div class="logo" role="img" aria-label="M.E.T.A.S.">M.E.T.A.S.</div>
  <div class="sub">Misiones Educativas Tecnológicas Asincrónicas y Sincrónicas</div>
  <p>Para entrar la primera vez se necesita señal</p>
  <button type="button" id="reintentar" onclick="location.reload()">Intentar otra vez</button>
</main>
</body>
</html>`;

function paginaSinSenal() {
  /* 503 y no-store: que nadie la guarde como si fuera la portada. guardar()
     tampoco la guardaría, porque no es `ok`. */
  return new Response(PAGINA_SIN_SENAL, {
    status: 503,
    statusText: 'Sin señal',
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
  });
}

/* Guardar es lo que hace real la promesa de funcionar sin internet, pero no
   todo se puede guardar: `cache.put` revienta con un POST —y a Supabase se le
   habla por POST— y guardar un error 404 o 500 le enseñaría al teléfono una
   pantalla rota para siempre. Las opacas SÍ entran: son los recursos de otro
   dominio (el motor de los juegos 3D) y de esas no se puede leer el estado. */
/* El orden importa y no se deja al azar. `caches.match` sin nombre recorre las
   cachés en el orden en que se crearon, y CACHE_DATOS es más vieja que el
   armazón recién publicado: sin esto, después de un despliegue podía servirse
   el index.html guardado de ayer junto al app.js de hoy. Manda el armazón. */
function copiaValida(copia) {
  return (copia && (copia.ok || copia.type === 'opaque')) ? copia : null;
}

function buscarCopia(peticion) {
  return caches.open(CACHE_APP)
    .then(c => c.match(peticion, { ignoreSearch: true }))
    .then(copia => copiaValida(copia) || caches.open(CACHE_DATOS)
      .then(c => c.match(peticion, { ignoreSearch: true }))
      .then(copiaValida));
}

function guardar(peticion, respuesta, cual) {
  if (peticion.method !== 'GET') return;
  if (!respuesta || !(respuesta.ok || respuesta.type === 'opaque')) return;
  const copia = respuesta.clone();
  caches.open(cual).then(cache => cache.put(peticion, copia)).catch(() => {});
}

/* ── Abrir rápido lo que ya está guardado ──────────────────────────────
   Hasta la v535 TODO lo propio iba «la red primero»: 39 guiones, cada uno
   preguntándole al servidor si había cambiado y esperando hasta tres
   segundos por la respuesta. Con la señal de un aula eso eran 2,8 segundos
   de pantalla en blanco en una portada que el teléfono ya tenía entera.

   No hacía falta preguntar. Hay tres casos y cada uno tiene su regla:

     1. Guion u hoja de estilo CON sello (?v=NN). El sello es la versión:
        si la dirección exacta está guardada, es ESE archivo y no otro. Se
        sirve sin tocar la red. Por eso aquí se busca SIN ignoreSearch: con
        él, «app.js?v=521» encontraría el «app.js?v=520» de ayer.
     2. La portada. Se sirve la copia guardada al instante y se trae la
        nueva por detrás para la próxima vez. El maestro ve un despliegue
        una visita más tarde, y a cambio la portada abre sin esperar.
     3. Lo que no lleva sello (las letras, all.min.css, el manifest, los
        guiones de una misión): igual que la portada.

   Lo que NO cambia: sin copia guardada se va a la red como siempre, con
   su plazo y su copia de respaldo. Esto no promete más que antes sin
   internet; solo deja de hacer esperar por lo que ya se tiene. */
const RAIZ = new URL('./', self.location).pathname;

function conSello(url) {
  return /\.(js|css)$/.test(url.pathname) && url.searchParams.has('v');
}

function esPortada(url) {
  return url.pathname === RAIZ || url.pathname === RAIZ + 'index.html';
}

function fechaDe(copia) {
  const f = Date.parse(copia.headers.get('date') || '');
  return isNaN(f) ? 0 : f;
}

/* La copia MÁS NUEVA de las dos cachés, y no «manda el armazón» como en
   buscarCopia. Allí el armazón gana porque es lo único que se sabe fresco;
   aquí las dos se refrescan —el armazón al publicar, CACHE_DATOS en cada
   visita por detrás— y gana la que el servidor fechó más tarde. Si mandara
   siempre el armazón, lo que se trae por detrás no se serviría nunca.
   Se miran TODAS las coincidencias: con ignoreSearch puede haber guardado
   un «index.html?mision=x» de hace meses delante del de hoy. */
function copiaMasNueva(peticion, opciones) {
  return Promise.all([CACHE_APP, CACHE_DATOS].map(nombre =>
    caches.open(nombre).then(c => c.matchAll(peticion, opciones)).catch(() => [])
  )).then(listas => {
    let mejor = null;
    listas.forEach(lista => lista.forEach(copia => {
      if (copiaValida(copia) && (!mejor || fechaDe(copia) > fechaDe(mejor))) mejor = copia;
    }));
    return mejor;
  });
}

/* Traer la versión nueva por detrás. Siempre preguntándole al servidor
   ('no-cache' → ETag/304): si no, la caché del navegador contestaría con su
   copia de hasta diez minutos y se «actualizaría» con lo mismo que había.
   Se pide por la dirección y no con el Request original: el de una
   navegación no admite que se le cambien las opciones. */
function actualizarPorDetras(direccion, llave) {
  return traer(direccion, { cache: 'no-cache' }, PLAZO_DETRAS).then(respuesta => {
    /* Una respuesta redirigida no se le puede servir a una navegación. */
    if (respuesta && respuesta.ok && !respuesta.redirected) {
      return caches.open(CACHE_DATOS).then(c => c.put(llave, respuesta));
    }
  }).catch(() => {});
}

/* La página avisa de los guiones con sello que acaba de bajar (ver el final
   de index.html). En la primera visita este service worker aún no mandaba,
   así que no los vio pasar; sin esto la SEGUNDA visita los pedía todos a la
   red. Se piden con la caché del navegador permitida a propósito: acaban de
   bajar, así que salen de ahí sin gastarle datos al maestro otra vez. */
self.addEventListener('message', event => {
  const d = event.data;
  if (!d || d.tipo !== 'guardar-vistos' || !Array.isArray(d.urls)) return;
  event.waitUntil(caches.open(CACHE_DATOS).then(cache =>
    Promise.all(d.urls.slice(0, 200).map(u => {
      let url;
      try { url = new URL(u); } catch (_) { return null; }
      if (url.origin !== location.origin || !conSello(url)) return null;
      return cache.match(url.href).then(ya => {
        if (ya) return null;
        return traer(url.href, {}, PLAZO_DETRAS).then(r => (r && r.ok) ? cache.put(url.href, r) : null);
      }).catch(() => {});
    }))
  ));
});

/* Navegación a documentos HTML (portada y subcarpetas de misiones como
   /misiones/prebasica-tecnicas-libro1/prebasica-libro1.html):
   Se usa fetch(event.request) directo (Network First) sin pasar un objeto
   init que degrada mode: 'navigate' en móviles/WebAPK, y nunca se devuelve
   una copia 404 cacheada.

   Tres relojes: a los PLAZO_RED se mira si hay copia guardada; si no la hay
   se sigue esperando a la red, pero solo hasta PLAZO_PAGINA en total; y si la
   red tampoco llegó, la página sin señal. Antes, sin copia, se esperaba a la
   red para siempre: era la pantalla de inicio congelada. */
function navegarPorRed(event) {
  const inicio = Date.now();
  const red = fetch(event.request).then(respuesta => {
    if (respuesta && respuesta.ok) {
      guardar(event.request, respuesta, CACHE_DATOS);
      return respuesta;
    }
    return traer(event.request.url, { cache: 'reload' }, PLAZO_PAGINA).then(r2 => {
      if (r2 && r2.ok) {
        guardar(event.request, r2, CACHE_DATOS);
        return r2;
      }
      return respuesta;
    }).catch(() => respuesta);
  });
  const plazo = new Promise(listo => setTimeout(() => listo(null), PLAZO_RED));
  return Promise.race([red.catch(() => null), plazo]).then(respuesta => {
    if (respuesta && respuesta.ok) return respuesta;
    return buscarCopia(event.request).then(copia => {
      if (copia) return copia;
      /* Sin copia: lo que contestó la red, aunque sea un 404 (decir «no está»
         es mejor que esperar), o lo que conteste antes del tope. */
      if (respuesta) return respuesta;
      const queda = Math.max(0, PLAZO_PAGINA - (Date.now() - inicio));
      return conTope(red, queda).then(r => r || paginaSinSenal());
    });
  });
}

// Fetch: lo guardado primero cuando se sabe que vale; si no, la red con plazo.
self.addEventListener('fetch', event => {
  if (segundaLimpieza && Date.now() >= segundaLimpieza) {
    segundaLimpieza = 0;
    event.waitUntil(limpiarLoViejo().catch(() => {}));
  }
  const url = new URL(event.request.url);
  const isLocal = url.origin === location.origin;
  const isImage = event.request.destination === 'image';
  const isNavigate = event.request.mode === 'navigate' || event.request.destination === 'document';

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
  /* Turnstile (la comprobación de seguridad del portal de las familias):
     Cloudflare exige que su api.js se pida siempre a su dirección, sin
     guardarlo ni servirlo de otro lado; una copia vieja deja de funcionar
     sin avisar. Que lo atienda el navegador. */
  if (url.hostname === 'challenges.cloudflare.com') return;
  /* La base del maestro no se guarda ni se sirve de aquí. Desde el sello
     v548 esta rama de «otro dominio» respondía primero con lo guardado y
     luego metía el GET de rest/v1 en CACHE_DATOS. La cola releía esa fila
     vieja, perdía los cinco reintentos y la primera operación trababa todo
     lo que el aparato tenía por subir; el aviso de tiempo real tampoco
     avanzaba, así que la PC no veía lo que la tablet acababa de anotar.
     Lo que no es una lectura, y lo que lleva la sesión, tampoco: ahí va el
     dato del maestro. Se sale sin respondWith, igual que YouTube y
     Turnstile, y lo atiende el navegador. */
  if (hostDeSupabase(url.hostname)
      || event.request.method !== 'GET'
      || event.request.headers.has('authorization')) return;

  const esGet = event.request.method === 'GET';

  if (isLocal && isNavigate && esGet && esPortada(url)) {
    /* La portada: lo guardado al instante, lo nuevo por detrás. Se guarda
       sin los parámetros (?mision=…): la portada es un solo archivo, y con
       una llave por cada parámetro se irían amontonando copias viejas. */
    const llave = url.origin + url.pathname;
    event.respondWith(
      copiaMasNueva(event.request, { ignoreSearch: true }).then(copia => {
        if (copia) {
          event.waitUntil(actualizarPorDetras(llave, llave));
          return copia;
        }
        /* Sin copia, como siempre: la red con su plazo. */
        return navegarPorRed(event);
      })
    );
  } else if (isLocal && isNavigate) {
    event.respondWith(navegarPorRed(event));
  } else if (isLocal && !isImage && esGet) {

    /* Archivos propios (HTML, CSS, JS). Primero se mira si ya están: con
       sello, la dirección exacta; sin sello, la copia más nueva, que además
       se renueva por detrás. Solo si no hay nada se sigue a lo de siempre:
       la red primero y revalidando contra el
       servidor (cache: 'no-cache' → ETag/304), porque la caché HTTP del
       navegador guarda hasta 10 minutos y escondía los despliegues nuevos:
       llegaba el HTML nuevo con el CSS y el JS viejos.

       Pero «la red primero» sin plazo no vale en un aula: la señal mala no
       falla, se queda colgada, y el alumno miraba una pantalla en blanco
       teniendo la misión guardada en el teléfono. Ahora se le dan PLAZO_RED
       milisegundos; pasados esos, si hay copia guardada se sirve esa. Si NO
       la hay se sigue esperando a la red, porque media pantalla es peor que
       una pantalla que tarda. */
    const sellado = conSello(url);
    const deLaRed = () => {
      const red = traer(event.request, { cache: 'no-cache' }, PLAZO_RECURSO).then(respuesta => {
        guardar(event.request, respuesta, CACHE_DATOS);
        return respuesta;
      });
      const plazo = new Promise(listo => setTimeout(() => listo(null), PLAZO_RED));
      return Promise.race([red.catch(() => null), plazo]).then(respuesta => {
        if (respuesta && respuesta.ok) return respuesta;
        /* ignoreSearch: el precache guarda «js/app.js» y la página lo pide como
           «js/app.js?v=NNN» (el sello de versión). Sin esto, lo precacheado no
           lo encontraba nadie y el armazón guardado no servía de nada. */
        /* Sin copia se espera a la red hasta PLAZO_RECURSO, ni un segundo
           más: `traer` corta ahí, y entonces sale un error y la página sigue
           sin esta pieza en vez de quedarse detenida en ella. */
        return buscarCopia(event.request).then(copia => copia || red);
      });
    };
    event.respondWith(
      /* Las dos búsquedas son por dirección EXACTA (sin ignoreSearch). */
      copiaMasNueva(event.request).then(copia => {
        if (!copia) return deLaRed();
        /* Con sello no se toca la red: esa dirección es esa versión. */
        if (!sellado) event.waitUntil(actualizarPorDetras(event.request.url, event.request.url));
        return copia;
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
        if (cached && (cached.ok || cached.type === 'opaque')) return cached;
        /* Con tope solo lo que detiene la página: un guion, una hoja, una
           letra o una imagen. Lo demás (un recurso externo que no bloquea
           el pintado) sigue sin reloj. La base no llega a esta rama: se
           apartó arriba, con YouTube y Turnstile. */
        const bloquea = esGet && /^(script|style|font|image)$/.test(event.request.destination);
        const red = bloquea ? traer(event.request, {}, PLAZO_RECURSO) : fetch(event.request);
        return red.then(respuesta => {
          guardar(event.request, respuesta, CACHE_DATOS);
          return respuesta;
        });
      })
    );
  }
});
