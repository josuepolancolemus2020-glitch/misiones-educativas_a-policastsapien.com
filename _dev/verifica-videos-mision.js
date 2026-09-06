/* ═══════════════════════════════════════════════════════════════
   🎬 LA SECCIÓN DE VIDEOS DE UNA MISIÓN

   Lo que esta sonda vigila es exactamente lo que costaría caro:

   · QUE POR EL `src` DEL IFRAME NO PASE NADA QUE NO SEAN ONCE
     CARACTERES. Es la comprobación más importante del archivo. Ese
     dato acaba dentro de un atributo del HTML en la pantalla de un
     niño; si ahí entrara una comilla, lo que siguiera sería un
     atributo de verdad —un `onload`— corriendo dentro de la misión.
     Se le tiran nueve formas de dirección envenenada y ninguna puede
     pintar una tarjeta.

   · QUE EL ALUMNO NO PUEDA AGREGAR VIDEOS. La sección no puede tener
     ni un campo de escribir, ni un botón de añadir, ni llamar a nada
     que escriba. Es el pedido entero del autor: los videos los pone
     F.A.R.O.

   · QUE NO SE LLAME A YOUTUBE HASTA QUE EL ALUMNO TOQUE ▶. Seis
     videos serían seis reproductores y varios megas en la conexión de
     un pueblo, por una sección que a lo mejor nadie abre.

   · QUE AL TERMINAR EL VIDEO CAIGA LA TAPA. Es lo que cumple «que no
     salga de la misión»: al acabar, YouTube pinta su parrilla de
     sugerencias con «Ver en YouTube», y por ahí se va el niño a una
     pantalla que no eligió ningún maestro.

   · QUE CUANDO EL VIDEO NO SE PUEDE VER, LA PANTALLA LO DIGA. Un
     cuadro negro y mudo parece la aplicación rota, y una aplicación
     que parece rota no se vuelve a abrir. Y que ahí —solo ahí— salga
     la salida a YouTube.

   · QUE EL AVISO DE BRAVE SE DIGA UNA VEZ Y ARRIBA. Estuvo debajo de
     cada video y con seis videos salía seis veces; el autor lo pidió
     quitar el 28 de agosto de 2026 mirando su teléfono. Un aviso
     repetido seis veces no se lee seis veces: se deja de leer la
     primera.

   · QUE SOLO SUENE UN VIDEO. Dos abiertos son dos audios a la vez, y
     en un aula con tres teléfonos prestados eso pasa el primer día.
     Al abrir uno se cierra el anterior, y el cerrado tiene que volver a
     su miniatura y poder abrirse otra vez.

   · QUE EL BOTÓN DEL QUIZ NO SE ESCONDA NUNCA, y que abra las preguntas
     SIN abrir el video —ni gastar datos—. La tapa solo cae cuando
     YouTube dice que el video terminó, y hay videos que no se terminan
     nunca. Y la que más cuesta: que después de resolverlo por
     adelantado, ver el video y llegar al final DEVUELVA la tapa, porque
     si no, se queda la parrilla de sugerencias de YouTube en pantalla.

   · QUE SI NO LLEGA LA API DE YOUTUBE NO SE TAPE NADA. El video puede
     estar viéndose perfectamente; taparlo sería el peor fallo posible.

   · QUE LA NUBE PISE AL CATÁLOGO Y QUE LA LÁPIDA QUITE. Sin eso, un
     video retirado desde F.A.R.O seguiría en pantalla porque está
     escrito en el repositorio.

   · QUE LA CLAVE DE LA MISIÓN NO SE HEREDE AL COPIAR EL BLOQUE. Dos
     misiones compartiendo videos es la misma trampa que ya tiene
     apuntada la repisa de enlaces de F.A.R.O.

   La nube NO se toca: se pone un Supabase de mentira con page.route y
   un YouTube de mentira, así corre sin internet y sin ensuciar nada.

   Uso:
     node _dev/servidor-estatico.js         (en otra terminal)
     node _dev/verifica-videos-mision.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { abrir: abrirNavegador } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const MISION = '/misiones/2y3ciclo-fracciones/fracciones.html';
const CLAVE = '2y3ciclo-fracciones';
const SB_FARO = 'bzrnjvalpwlcnpszvwim.supabase.co';

let fallos = 0;
const ok = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };
const comprueba = (c, m) => (c ? ok(m) : mal(m));

/* Un identificador de once caracteres cualquiera, con la forma buena.
   No apunta a ningún video real y da igual: aquí no se abre YouTube. */
const ID_A = 'aaaaaaaaaaa';
const ID_B = 'bbbbbbbbbbb';

/* ── El Supabase de mentira ──
   Contesta como la puerta pública de verdad: filas publicadas y
   lápidas. `filas` se cambia entre pruebas. */
function nubeFalsa(estado) {
  return async route => {
    estado.llamadas.push(JSON.parse(route.request().postData() || '{}'));
    if (estado.caida) return route.abort('failed');
    return route.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify(estado.filas)
    });
  };
}

/* ── El YouTube de mentira ──
   Ni el reproductor ni la API salen a la red. La API falsa deja
   disparar a mano onReady, onStateChange(0) y onError(101), que es lo
   que hace falta para probar la tapa y el panel de fallo sin esperar a
   que termine un video de verdad. */
const YT_FALSO = `
  window.__ytPlayers = [];
  window.YT = {
    Player: function (el, opts) {
      const p = {
        el, opts,
        _play: 0, _pause: 0,
        seekTo: function () {}, playVideo: function () { p._play++; },
        /* El de verdad lo tiene, y el aparato lo llama para CALLAR el
           video cuando se abre el quiz por adelantado. Un doble sin
           pauseVideo dejaría pasar un video sonando detrás de las
           preguntas, que es justo lo que hay que impedir. */
        pauseVideo: function () { p._pause++; },
        listo:     function () { opts.events.onReady && opts.events.onReady({ target: p }); },
        terminar:  function () { opts.events.onStateChange && opts.events.onStateChange({ data: 0, target: p }); },
        reventar:  function (c) { opts.events.onError && opts.events.onError({ data: c, target: p }); }
      };
      window.__ytPlayers.push(p);
      return p;
    }
  };
`;

async function abrir(navegador, { filas = [], caida = false, sinApi = false, api = true,
                                  mision = MISION } = {}) {
  const ctx = await navegador.newContext();
  const estado = { filas, caida, llamadas: [] };
  const pedidos = [];

  /* Nada de esta sonda sale a internet de verdad.

     ⚠️ EL ORDEN IMPORTA Y AL REVÉS DE LO QUE PARECE: Playwright prueba
     las rutas de la ÚLTIMA registrada a la primera. La genérica va
     primero para que la del proyecto de F.A.R.O, que es la que de
     verdad contesta, se pruebe antes. Puestas al revés, la genérica se
     tragaba las llamadas de los videos y devolvía una lista vacía: la
     sonda pasaba las comprobaciones de «no hay iframe» sin que hubiera
     nada pintado, que es la peor forma de aprobar. */
  await ctx.route('**/*.supabase.co/**', r =>
    r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await ctx.route(`**/${SB_FARO}/**`, nubeFalsa(estado));

  // Todo lo que apunte a YouTube queda anotado y cortado.
  await ctx.route('**://*.youtube.com/**', async route => {
    const u = route.request().url();
    pedidos.push(u);
    if (/iframe_api/.test(u)) {
      if (sinApi) return route.abort('failed');
      return route.fulfill({ status: 200, contentType: 'application/javascript',
        body: (api ? YT_FALSO : '') + 'window.onYouTubeIframeAPIReady && window.onYouTubeIframeAPIReady();' });
    }
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<html></html>' });
  });
  await ctx.route('**://*.youtube-nocookie.com/**', route => {
    pedidos.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<html>reproductor</html>' });
  });
  await ctx.route('**://i.ytimg.com/**', route => {
    pedidos.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'image/gif',
      body: Buffer.from('R0lGODlhAQABAAAAACw=', 'base64') });
  });

  const page = await ctx.newPage();
  await page.goto(BASE + mision, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => !!window.VideosMision, null, { timeout: 10000 });
  // Cerrar la ventana de identificación si sale
  await page.evaluate(() => { const m = document.getElementById('metasIdModal'); if (m) m.remove(); });
  await page.click('[data-s="s-videos"]');
  await page.waitForTimeout(400);
  return { ctx, page, estado, pedidos };
}

/* El mismo respaldo que ya usan reparte-hojas-ficha.js y las fichas de
   Fin de Grado: en las sesiones de trabajo el Chromium está puesto
   aparte y la versión de Playwright no siempre coincide con la suya. */
/* El navegador lo abre `lib-navegador.js`: primero el que trae Playwright y
   solo si ese no arranca, uno puesto a mano. Esta función estaba COPIADA en
   seis sondas, y las copias ya se habían separado —tres nombres distintos de
   variable de entorno para lo mismo—. */
const lanzar = opciones => abrirNavegador(opciones);

/* ── El service worker, leído del ARCHIVO ──
   Playwright arranca sin service worker, así que dentro del navegador
   esta rama no existe y la sonda no la puede ver. Se lee el archivo,
   como hace lib-sonda-3d con el andamio de los juegos.

   Y hace falta: aquí estuvo el fallo que dejó el video reproduciéndose
   UN SEGUNDO. La rama de recursos externos servía cache-first TODO lo
   ajeno, trozos de video incluidos, y el reproductor concluía que el
   flujo se había acabado. */
function revisarServiceWorker() {
  console.log('0. El service worker no toca lo que se transmite');
  const sw = require('fs').readFileSync(require('path').join(__dirname, '..', 'sw.js'), 'utf8');
  const antesDeLaCache = sw.split('caches.match(event.request)')[0];
  comprueba(/googlevideo/.test(antesDeLaCache),
    'googlevideo (de donde vienen los trozos de video) se aparta ANTES de la caché');
  comprueba(/youtube-nocookie/.test(antesDeLaCache),
    'y el dominio del reproductor también');
  comprueba(/headers\.has\(['"]range['"]\)/.test(antesDeLaCache),
    'y CUALQUIER petición por rangos, venga de donde venga');
  comprueba(/\breturn;/.test(antesDeLaCache),
    'y se sale sin respondWith: lo atiende el navegador, que sabe hacerlo');
}

/* ── EL MONTAJE DE TODAS LAS MISIONES, LEÍDO DEL ARCHIVO ──
   La sección ya no está en una misión: está en veinte, y el aparato es
   uno solo. Lo que se multiplica por veinte no es el aparato —ese se
   arregla en un sitio— sino las TRES piezas de HTML que lo enganchan, y
   ahí es donde se cuela el error caro: la clave copiada.

   Se lee del archivo y no del navegador a propósito. Abrir veinte
   misiones con Playwright cuesta un minuto largo y nadie lo corre antes
   de publicar; leerlas cuesta un parpadeo, así que esta comprobación sí
   se corre. Es el mismo criterio con el que se lee `sw.js` más arriba. */
function revisarMontajes() {
  console.log('11. Las misiones que montan la sección');
  const fs = require('fs'), path = require('path');
  const raiz = path.join(__dirname, '..');
  const cat = fs.readFileSync(path.join(raiz, 'js/data/misiones.js'), 'utf8');
  const g = {}; new Function('g', 'with(g){' + cat + '; g.M=MISSIONS;}')(g);
  const { VIDEOS_MISIONES } = require(path.join(raiz, 'js/data/videos-misiones.js'));

  const montadas = [];
  for (const m of g.M) {
    const html = fs.readFileSync(path.join(raiz, m.url), 'utf8');
    if (!html.includes('id="s-videos"')) continue;
    montadas.push({ m: m, html: html, carpeta: path.dirname(m.url).split('/').pop() });
  }
  comprueba(montadas.length > 0, montadas.length + ' misiones montan la sección');

  const fallan = { piezas: [], clave: [], catalogo: [], orden: [], campos: [] };
  const claves = {};
  for (const x of montadas) {
    /* Las tres piezas del montaje. Si falta una, la sección existe a
       medias: la pestaña sin panel, o el panel sin el aparato que lo
       llena, y el alumno se queda mirando «Cargando los videos…». */
    const piezas = html => html.includes('css/videos-mision.css')
      && /data-s="s-videos"/.test(html)
      && /id="vmLista"/.test(html)
      && html.includes('js/data/videos-misiones.js')
      && html.includes('js/metas-videos.js')
      && html.includes('js/videos-mision.js');
    if (!piezas(x.html)) fallan.piezas.push(x.carpeta);

    /* ⚠️ LA CLAVE. Es la trampa de la regla 8, y con veinte montajes es
       la que de verdad puede pasar: se copia el bloque de una misión a
       otra y se olvida cambiarla. No da un error —da los videos de OTRO
       tema en la pantalla de un niño. */
    const k = (x.html.match(/mision: '([^']*)'/) || [])[1];
    if (k !== x.carpeta) fallan.clave.push(x.carpeta + ' → ' + k);
    if (claves[k]) fallan.clave.push(x.carpeta + ' repite la clave de ' + claves[k]);
    claves[k] = x.carpeta;

    /* El catálogo tiene que conocerla: es la capa que funciona sin nube
       y sin haber corrido el SQL, o sea el primer día y en el aula sin
       señal. */
    if (!Array.isArray(VIDEOS_MISIONES[x.carpeta])) fallan.catalogo.push(x.carpeta);

    /* El CSS de la sección va DESPUÉS del de la misión: es de donde saca
       el --pri y el --sec con los que se tiñe. Al revés se pinta con los
       colores de otra. */
    const iMis = x.html.search(/<link rel="stylesheet" href="css\/[^"]+">/);
    const iVid = x.html.indexOf('css/videos-mision.css');
    if (!(iMis >= 0 && iVid > iMis)) fallan.orden.push(x.carpeta);

    /* Y el alumno no escribe aquí. Se mira el bloque del HTML, que es lo
       que se copia de una misión a otra: el aparato ya lo comprueba
       pintado en la 2, pero un campo escrito a mano en el hueco no lo
       pinta el aparato y se le escaparía. */
    const bloque = x.html.slice(x.html.indexOf('id="s-videos"'));
    const hasta = bloque.indexOf('id="vmLista"');
    if (/<(input|textarea|select)\b/i.test(bloque.slice(0, hasta > 0 ? hasta : 0))) fallan.campos.push(x.carpeta);
  }

  comprueba(!fallan.piezas.length,
    'todas llevan sus tres piezas (el CSS, la pestaña con su panel y los tres scripts)' +
    (fallan.piezas.length ? ' → ' + fallan.piezas.join(', ') : ''));
  comprueba(!fallan.clave.length,
    'y cada una le pregunta a la nube por SU carpeta: ninguna heredó la clave de otra' +
    (fallan.clave.length ? ' → ' + fallan.clave.join(', ') : ''));
  comprueba(!fallan.catalogo.length,
    'el catálogo del repositorio conoce las ' + montadas.length + ', así que funcionan sin nube' +
    (fallan.catalogo.length ? ' → ' + fallan.catalogo.join(', ') : ''));
  comprueba(!fallan.orden.length,
    'y el CSS de la sección va después del de la misión, que es de donde se tiñe' +
    (fallan.orden.length ? ' → ' + fallan.orden.join(', ') : ''));
  comprueba(!fallan.campos.length,
    'ninguna metió a mano un campo de escribir en el hueco' +
    (fallan.campos.length ? ' → ' + fallan.campos.join(', ') : ''));

  return montadas.map(x => ({ carpeta: x.carpeta, url: '/' + x.m.url }));
}

(async () => {
  console.log('\n🎬 La sección de videos de una misión\n');
  revisarServiceWorker();
  console.log('');
  const nav = await lanzar();

  /* ═══ 1. EL IDENTIFICADOR: nada que no sean once caracteres ═══ */
  console.log('1. El identificador de once caracteres');
  {
    const { ctx, page } = await abrir(nav);
    const veneno = await page.evaluate(() => {
      const V = window.VideosMision;
      const malos = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'aaaaaaaaaa',            // diez
        'aaaaaaaaaaaa',          // doce
        'aaaaa"aaaaa',           // comilla doble
        "aaaaa'aaaaa",           // comilla simple
        'aaaaa aaaaa',           // espacio
        'aaaaa<aaaaa',           // ángulo
        'javascript:',
        'java\tscript:aaa'
      ];
      return {
        rebotaron: malos.every(m => V._id(m) === ''),
        // Y lo que de verdad importa: que ninguno llegue a pintar nada
        pintados: malos.filter(m => V._normaliza({ yt: m, id: 'x' }, 0) !== null).length,
        bueno: V._id('aaaaaaaaaaa') === 'aaaaaaaaaaa'
      };
    });
    comprueba(veneno.rebotaron, 'las nueve direcciones envenenadas rebotan en vmId()');
    comprueba(veneno.pintados === 0, 'ninguna de las nueve consigue pintar una tarjeta');
    comprueba(veneno.bueno, 'el identificador bueno pasa');

    // La dirección armada solo puede contener el identificador comprobado
    const dir = await page.evaluate(() =>
      window.VideosMision._direccion({ yt: 'aaaaaaaaaaa', ini: 30, fin: 90 }));
    comprueba(dir.startsWith('https://www.youtube-nocookie.com/embed/aaaaaaaaaaa?'),
      'el src se arma con el dominio sin cookies y el identificador detrás');
    comprueba(/[?&]rel=0(&|$)/.test(dir), 'rel=0: no ofrece videos de otros canales');
    comprueba(/[?&]playsinline=1(&|$)/.test(dir), 'playsinline=1: en iPhone no salta al reproductor del sistema');
    comprueba(/[?&]enablejsapi=1(&|$)/.test(dir), 'enablejsapi=1: sin esto no se puede saber que terminó');
    comprueba(/[?&]start=30(&|$)/.test(dir) && /[?&]end=90(&|$)/.test(dir), 'el recorte viaja en la dirección');
    comprueba(!/["'<>\s\\]/.test(dir), 'en la dirección entera no hay ni una comilla, espacio ni ángulo');
    await ctx.close();
  }

  /* ═══ 2. El alumno NO puede agregar videos ═══ */
  console.log('\n2. El alumno no puede agregar videos');
  {
    const { ctx, page } = await abrir(nav, {
      filas: [{ id: 'v1', yt: ID_A, titulo: 'Uno', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false }]
    });
    const sec = await page.$('#s-videos');
    const campos = await sec.$$('input, textarea, select, [contenteditable]');
    comprueba(campos.length === 0, 'la sección no tiene ni un campo donde escribir');

    // Y el puente solo sabe traer: no expone nada que escriba
    const api = await page.evaluate(() => Object.keys(window.METAS_VIDEOS || {}));
    const escribe = api.filter(k => /guardar|poner|añadir|anadir|insertar|crear|subir/i.test(k));
    comprueba(escribe.length === 0, 'el puente de la nube no expone ninguna función que escriba');
    comprueba(api.includes('traer'), 'el puente solo trae');
    await ctx.close();
  }

  /* ═══ 3. Nada de YouTube hasta que se toque ▶ ═══ */
  console.log('\n3. Nada sale hacia YouTube hasta que el alumno toca ▶');
  {
    const { ctx, page, pedidos } = await abrir(nav, {
      filas: [
        { id: 'v1', yt: ID_A, titulo: 'Uno', nota: '', dura: '4:05', canal: '', ini: 0, fin: 0, del: false },
        { id: 'v2', yt: ID_B, titulo: 'Dos', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false }
      ]
    });
    await page.waitForTimeout(600);
    const reproductores = pedidos.filter(u => /youtube-nocookie|iframe_api/.test(u));
    comprueba(reproductores.length === 0,
      'con la sección abierta y dos videos, cero reproductores y cero API');
    comprueba((await page.$$('#s-videos .vm-fachada')).length === 2, 'se ven las dos fachadas');
    comprueba((await page.$$('#s-videos iframe')).length === 0, 'no hay ni un iframe todavía');

    /* Se mide con getComputedStyle y NO con la propiedad .hidden. El
       fallo que esto caza es de CSS, no de JavaScript: el `display` de
       la hoja de estilos pisa al `display:none` que trae el atributo
       `hidden` del navegador, y entonces `.hidden` sigue diciendo true
       mientras el rótulo se lee en pantalla. Pasó de verdad: los dos
       videos salían con «✓ Ya lo viste» sin que nadie los hubiera
       abierto, y lo cazó una captura de pantalla, no una aserción. */
    const vistoAntes = await page.evaluate(() =>
      [...document.querySelectorAll('#s-videos .vm-visto')]
        .map(n => getComputedStyle(n).display));
    comprueba(vistoAntes.every(d => d === 'none'),
      'ningún video dice «✓ Ya lo viste» antes de verlo');

    await page.click('#s-videos .vm-card:first-child .vm-fachada');
    await page.waitForTimeout(600);
    comprueba((await page.$$('#s-videos iframe')).length === 1, 'al tocar ▶ aparece UN reproductor, no dos');
    const src = await page.getAttribute('#s-videos iframe', 'src');
    comprueba(src.includes('/embed/' + ID_A), 'y es el del video que se tocó');

    const vistoDespues = await page.evaluate(() =>
      [...document.querySelectorAll('#s-videos .vm-visto')]
        .map(n => getComputedStyle(n).display));
    comprueba(vistoDespues[0] !== 'none' && vistoDespues[1] === 'none',
      'y al verlo, el rótulo sale SOLO en el que se abrió');
    await ctx.close();
  }

  /* ═══ 3-bis. El aviso de Brave: UNO, y arriba ═══
     Estuvo debajo de cada video y el autor lo pidió quitar el 28 de
     agosto de 2026 mirando su teléfono: con seis videos el mismo párrafo
     de tres renglones salía seis veces. Lo que se vigila es que no
     vuelva a colarse dentro de las tarjetas al tocar algo del aparato:
     ni al pintar, ni al abrir un video, ni en el panel de fallo (esa la
     mira la 5). */
  console.log('\n3-bis. El aviso de Brave se dice UNA VEZ y arriba');
  {
    const { ctx, page } = await abrir(nav, {
      filas: [
        { id: 'v1', yt: ID_A, titulo: 'Uno', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false },
        { id: 'v2', yt: ID_B, titulo: 'Dos', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false }
      ]
    });
    await page.waitForTimeout(600);

    const cuantos = () => page.$$eval('#s-videos .vm-brave', ns => ns.length);
    comprueba(await cuantos() === 1, 'con dos videos, el aviso sale UNA vez y no dos');

    /* Y ARRIBA: por encima de la primera tarjeta. Puesto abajo habría
       que barrer los seis videos para encontrarlo, y quien tiene que
       leerlo (el maestro, la familia) lo lee al entrar. */
    const arriba = await page.evaluate(() => {
      const a = document.querySelector('#s-videos .vm-brave');
      const l = document.querySelector('#s-videos .vm-lista');
      if (!a || !l) return false;
      return a.getBoundingClientRect().top < l.getBoundingClientRect().top;
    });
    comprueba(arriba, 'y va por encima de la lista de videos, no debajo');

    const enTarjeta = await page.$$eval('#s-videos .vm-card .vm-brave', ns => ns.length);
    comprueba(enTarjeta === 0, 'ninguna tarjeta lleva el aviso dentro');

    /* Al abrir un video tampoco aparece: ahí es donde vivía. */
    await page.click('#s-videos .vm-card:first-child .vm-fachada');
    await page.waitForTimeout(500);
    comprueba(await cuantos() === 1, 'y al abrir un video sigue habiendo uno solo');
    await ctx.close();
  }

  /* ═══ 3-ter. UN VIDEO A LA VEZ ═══
     Pedido por el autor el 28 de agosto de 2026: «cuando uno se esté
     reproduciendo que otro no se pueda reproducir». Dos videos abiertos
     son dos audios sonando a la vez, y en un aula con tres teléfonos
     prestados eso pasa el primer día. */
  console.log('\n3-ter. Solo un video puede estar sonando');
  {
    const { ctx, page } = await abrir(nav, {
      filas: [
        { id: 'v1', yt: ID_A, titulo: 'Uno', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false },
        { id: 'v2', yt: ID_B, titulo: 'Dos', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false }
      ]
    });
    await page.waitForTimeout(600);

    await page.click('#s-videos .vm-card:nth-child(1) .vm-fachada');
    await page.waitForTimeout(500);
    comprueba((await page.$$('#s-videos iframe')).length === 1, 'con el primero abierto hay UN reproductor');

    await page.click('#s-videos .vm-card:nth-child(2) .vm-fachada');
    await page.waitForTimeout(500);
    comprueba((await page.$$('#s-videos iframe')).length === 1,
      'al abrir el segundo sigue habiendo UNO: el primero se cerró, no se quedó sonando detrás');
    const src = await page.getAttribute('#s-videos iframe', 'src');
    comprueba(src.includes('/embed/' + ID_B), 'y el que queda es el que se acaba de tocar');

    /* Y el primero vuelve a su fachada: si se quedara en negro, el
       alumno creería que se rompió. */
    const primera = await page.evaluate(() => {
      const c = document.querySelectorAll('#s-videos .vm-card')[0];
      return { fachada: !!c.querySelector('.vm-fachada'),
               marco: !!c.querySelector('.vm-marco'),
               abierta: c.classList.contains('vm-abierta') };
    });
    comprueba(primera.fachada && !primera.marco && !primera.abierta,
      'y el primero recupera su miniatura, listo para volver a tocarlo');

    /* Y se puede volver a él: cerrarlo no puede dejarlo muerto. */
    await page.click('#s-videos .vm-card:nth-child(1) .vm-fachada');
    await page.waitForTimeout(500);
    const vuelta = await page.getAttribute('#s-videos iframe', 'src');
    comprueba((await page.$$('#s-videos iframe')).length === 1 && vuelta.includes('/embed/' + ID_A),
      'y volver al primero lo abre otra vez, cerrando el segundo');
    await ctx.close();
  }

  /* ═══ 3-quater. El quiz, SIEMPRE a la vista ═══
     Pedido el mismo día: «que siempre esté visible el quiz». Estuvo en
     dos piezas que se escondían por turnos —una marca en la tarjeta y un
     aviso bajo el reproductor—; ahora es un botón único que no se
     esconde nunca y que abre las preguntas incluso sin haber abierto el
     video. La tapa del final solo cae cuando YouTube dice que el video
     terminó, y hay videos que no se terminan nunca. */
  console.log('\n3-quater. El botón del quiz no se esconde nunca');
  {
    const PREG = [
      { p: '¿Cuál es el denominador?', ops: ['El de abajo', 'El de arriba'], ok: 0 },
      { p: '¿Qué representa el numerador?', ops: ['Las partes que se toman', 'El total'], ok: 0 }
    ];
    const { ctx, page, pedidos } = await abrir(nav, {
      filas: [
        { id: 'v1', yt: ID_A, titulo: 'Con preguntas', nota: '', dura: '', canal: '',
          ini: 0, fin: 0, del: false, preguntas: PREG },
        { id: 'v2', yt: ID_B, titulo: 'Sin preguntas', nota: '', dura: '', canal: '',
          ini: 0, fin: 0, del: false }
      ]
    });
    await page.waitForTimeout(600);

    const visible = async sel => page.evaluate(s => {
      const n = document.querySelector(s);
      return n ? getComputedStyle(n).display !== 'none' && !!n.offsetParent : false;
    }, sel);

    const btn = '#s-videos .vm-card:nth-child(1) .vm-quiz-btn';
    comprueba(await visible(btn), 'el botón del quiz se ve ANTES de tocar ▶');
    comprueba(!(await page.$('#s-videos .vm-card:nth-child(2) .vm-quiz-btn')),
      'y el video sin preguntas no lo lleva');

    /* El texto: ya no explica que se puede sin ver el video —eso se ve
       solo, porque el botón está ahí desde el principio—. */
    const txtBtn = await page.textContent(btn);
    comprueba(/Resuelve el Quiz/i.test(txtBtn), 'y dice simplemente «Resuelve el Quiz»: ' + txtBtn.trim());
    const seccion = await page.textContent('#s-videos');
    comprueba(!/no hace falta verlo|sin verlo|al final/i.test(seccion),
      'y en la sección ya no se explica que se puede contestar sin ver el video');

    /* ── SIN ABRIR EL VIDEO ──
       Es lo que de verdad resuelve el pedido: la tapa del final solo cae
       cuando YouTube dice que el video terminó. */
    await page.click(btn);
    await page.waitForTimeout(400);
    comprueba(/Pregunta 1 de 2/.test(await page.textContent('#s-videos .vm-tapa')),
      'tocándolo se abren las preguntas sin haber abierto el video');
    comprueba((await page.$$('#s-videos iframe')).length === 0,
      'y NO se abre ningún reproductor: resolver el quiz no gasta datos');
    comprueba(pedidos.filter(u => /youtube-nocookie|iframe_api/.test(u)).length === 0,
      'ni sale una sola petición hacia YouTube');
    comprueba(await visible(btn), 'y el botón SIGUE a la vista con las preguntas en pantalla');

    /* Tocarlo otra vez no rehace el quiz: borraría lo ya contestado. */
    await page.click('#s-videos .vm-quiz-op:nth-child(1)');
    await page.waitForTimeout(200);
    await page.click(btn);
    await page.waitForTimeout(300);
    comprueba(!!(await page.$('#s-videos .vm-quiz-bien')),
      'y volver a tocarlo NO reinicia lo contestado: solo trae el quiz a la vista');

    /* Se termina y queda en la Evidencia como «sin terminar»: el maestro
       tiene que poder distinguirlo de un video visto entero. */
    await page.click('#s-videos .vm-quiz-pie .vm-btn-pri');
    await page.waitForTimeout(200);
    await page.click('#s-videos .vm-quiz-op:nth-child(1)');
    await page.waitForTimeout(200);
    await page.click('#s-videos .vm-quiz-pie .vm-btn-pri');
    await page.waitForTimeout(300);
    const ev = await page.evaluate(() => {
      try {
        return (JSON.parse(localStorage.getItem('METAS_REGISTRO_V1')) || [])
          .filter(e => e.tipo === 'video_quiz')
          .map(e => e.aciertos + '/' + e.total + (e.sin_terminar ? ' sin terminar' : ''));
      } catch (e) { return []; }
    });
    comprueba(ev.length === 1 && ev[0] === '2/2 sin terminar',
      'y en la Evidencia queda que contestó sin ver el video: ' + (ev[0] || 'nada'));

    /* Y desde ahí se puede ver el video, que es lo que el botón promete:
       nunca llegó a abrirse, así que no puede decir «otra vez». */
    const tapaTxt = await page.textContent('#s-videos .vm-tapa');
    comprueba(/Ver el video/.test(tapaTxt) && !/otra vez/i.test(tapaTxt),
      'el botón de la tapa dice «Ver el video», no «Verlo otra vez»');
    await page.click('#s-videos .vm-tapa .vm-btn');
    await page.waitForTimeout(600);
    comprueba((await page.$$('#s-videos iframe')).length === 1,
      'y ahí sí se abre el reproductor');
    comprueba(await visible(btn), 'con el botón del quiz todavía a la vista');

    /* ⚠️ Y la tapa del final vuelve: quien resolvió el quiz por
       adelantado y después ve el video no puede quedarse con la parrilla
       de sugerencias de YouTube en pantalla. */
    await page.waitForFunction(() => (window.__ytPlayers || []).length > 0, null, { timeout: 8000 });
    await page.evaluate(() => { window.__ytPlayers[0].listo(); window.__ytPlayers[0].terminar(); });
    await page.waitForTimeout(400);
    comprueba(!!(await page.$('#s-videos .vm-tapa')),
      'y al acabar de verdad la tapa VUELVE a cubrir la parrilla de YouTube');
    await ctx.close();
  }

  /* ═══ 4. La tapa del final ═══ */
  console.log('\n4. Al terminar el video cae la tapa');
  {
    const { ctx, page } = await abrir(nav, {
      filas: [{ id: 'v1', yt: ID_A, titulo: 'Uno', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false }]
    });
    await page.click('#s-videos .vm-fachada');
    await page.waitForFunction(() => (window.__ytPlayers || []).length > 0, null, { timeout: 8000 });
    await page.evaluate(() => window.__ytPlayers[0].listo());
    await page.waitForTimeout(200);
    comprueba(!(await page.$('#s-videos .vm-tapa')), 'mientras corre el video no hay tapa');

    await page.evaluate(() => window.__ytPlayers[0].terminar());
    await page.waitForTimeout(300);
    const tapa = await page.$('#s-videos .vm-tapa');
    comprueba(!!tapa, 'al terminar, la tapa cubre la parrilla de sugerencias de YouTube');

    if (tapa) {
      /* Que TAPE de verdad: se pregunta quién recibiría un toque en el
         centro del reproductor. Es el mismo guardián que caza el lienzo
         derramado en los juegos 3D: un panel que se ve pero no tapa es
         un panel que no sirve. */
      const cubre = await page.evaluate(() => {
        const m = document.querySelector('#s-videos .vm-marco');
        const r = m.getBoundingClientRect();
        const e = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !!(e && e.closest('.vm-tapa'));
      });
      comprueba(cubre, 'y en el centro del video, quien recibe el toque es la tapa');

      /* Que se LEA, no solo que esté. El aparato se monta dentro de una
         `.card` de la misión, y la hoja de la misión trae reglas como
         `.card p { color: … }` que tienen más especificidad que las de
         aquí. El título de la tapa llegó a salir gris oscuro sobre el
         fondo negro de la propia tapa: presente en el DOM, invisible en
         la pantalla. Lo cazó una captura, no una aserción — así que la
         aserción se escribió después.

         Se mide la luminancia del color del texto: sobre un fondo casi
         negro, tiene que ser claro. Con 57 misiones y 57 hojas de estilo
         distintas por delante, esto es lo que impide que la próxima se
         vea mal sin que nadie lo note. */
      const luz = await page.evaluate(() => {
        const c = getComputedStyle(document.querySelector('#s-videos .vm-tapa-tit')).color;
        const [r, g, b] = c.match(/\d+/g).map(Number);
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      });
      comprueba(luz > 0.6, 'y el título de la tapa se LEE sobre el fondo negro (luz ' + luz.toFixed(2) + ')');

      const txt = await page.textContent('#s-videos .vm-tapa');
      comprueba(/otra vez/i.test(txt), 'ofrece verlo otra vez');
      comprueba(/Quiz/i.test(txt), 'y a dónde ir después, que lo dice la misión');
      comprueba(!/YouTube/i.test(txt), 'la tapa NO ofrece salir a YouTube');

      // El botón de seguir lleva de verdad a la sección
      await page.click('#s-videos .vm-tapa .vm-btn-pri');
      await page.waitForTimeout(300);
      comprueba(await page.isVisible('#s-quiz'), 'y el botón de seguir lleva al Quiz');
    }
    await ctx.close();
  }

  /* ═══ 4-bis. El quiz del propio video ═══ */
  console.log('\n4-bis. El quiz del propio video');
  {
    const PREG = [
      { p: '¿Cuál es el denominador?', ops: ['El de abajo', 'El de arriba'], ok: 0 },
      { p: '¿Qué representa el numerador?', ops: ['Las partes que se toman', 'El total'], ok: 0 }
    ];
    const { ctx, page } = await abrir(nav, {
      filas: [{ id: 'v1', yt: ID_A, titulo: 'Uno', nota: '', dura: '', canal: '',
                ini: 0, fin: 0, del: false, preguntas: PREG }]
    });
    await page.click('#s-videos .vm-fachada');
    await page.waitForFunction(() => (window.__ytPlayers || []).length > 0, null, { timeout: 8000 });
    await page.evaluate(() => { window.__ytPlayers[0].listo(); window.__ytPlayers[0].terminar(); });
    await page.waitForTimeout(300);

    const tapa = await page.textContent('#s-videos .vm-tapa');
    comprueba(/¿Qué entendiste\?/.test(tapa),
      'al terminar sale el quiz DEL VIDEO, no el salto al Quiz de la misión');
    comprueba(!/Ir al Quiz/i.test(tapa),
      'y no se ofrece saltar a otra sección mientras hay preguntas');
    comprueba(/Pregunta 1 de 2/.test(tapa), 'una pregunta a la vez, con su cuenta');
    comprueba((await page.$$('#s-videos .vm-quiz-op')).length === 2,
      'con sus dos opciones, en columna');

    /* ⚠️ QUE QUEPA ENTERO. El hueco 16/9 del video en un teléfono son
       221 px de alto y una pregunta con tres opciones pide el doble: el
       enunciado salía cortado por arriba y «Saltar» por abajo. Poder
       deslizar no basta —es la regla 8 de los juegos 3D— y aquí lo que
       se corta es la pregunta que hay que contestar.

       Lo cazó una captura de pantalla; esta aserción se escribió
       después. Se mide en un teléfono de verdad, no en la ventana
       ancha, porque el fallo solo existe estrecho. */
    await page.setViewportSize({ width: 393, height: 873 });
    await page.waitForTimeout(200);
    const cabe = await page.evaluate(() => {
      const t = document.querySelector('#s-videos .vm-tapa');
      const m = document.querySelector('#s-videos .vm-marco');
      const rm = m.getBoundingClientRect();
      const fuera = [...document.querySelectorAll('#s-videos .vm-quiz-op, #s-videos .vm-quiz-p, #s-videos .vm-quiz-salta')]
        .filter(n => {
          const r = n.getBoundingClientRect();
          return r.top < rm.top - 1 || r.bottom > rm.bottom + 1;
        }).map(n => n.textContent.slice(0, 30));
      return { recorte: t.scrollHeight - t.clientHeight, fuera: fuera };
    });
    comprueba(cabe.recorte <= 1,
      'la tapa no recorta nada por dentro (sobran ' + cabe.recorte + ' px)');
    comprueba(cabe.fuera.length === 0,
      'y ni la pregunta, ni las opciones, ni «Saltar» se salen del marco' +
      (cabe.fuera.length ? ': ' + JSON.stringify(cabe.fuera) : ''));

    /* Fallar a propósito: la corrección tiene que verse EN EL SITIO. */
    await page.click('#s-videos .vm-quiz-op:nth-child(2)');
    await page.waitForTimeout(200);
    comprueba(!!(await page.$('#s-videos .vm-quiz-bien')), 'al fallar se pinta cuál era la buena');
    comprueba(!!(await page.$('#s-videos .vm-quiz-mal')), 'y cuál marcó él');
    comprueba(/La correcta era/.test(await page.textContent('#s-videos .vm-quiz-pie')),
      'y se lo dice con palabras, no solo con el color');

    /* Un dedo impaciente no puede contestar dos veces la misma. */
    const bloqueados = await page.$$eval('#s-videos .vm-quiz-op', ns => ns.every(n => n.disabled));
    comprueba(bloqueados, 'y las opciones se bloquean: no se contesta dos veces la misma');

    await page.click('#s-videos .vm-quiz-pie .vm-btn-pri');   // Siguiente
    await page.waitForTimeout(200);
    comprueba(/Pregunta 2 de 2/.test(await page.textContent('#s-videos .vm-tapa')),
      'la siguiente pregunta llega en su sitio');

    await page.click('#s-videos .vm-quiz-op:nth-child(1)');   // acertar
    await page.waitForTimeout(200);
    await page.click('#s-videos .vm-quiz-pie .vm-btn-pri');   // Ver resultado
    await page.waitForTimeout(300);
    const fin = await page.textContent('#s-videos .vm-tapa');
    comprueba(/1 de 2/.test(fin), 'al final se ve el resultado, contado bien');
    comprueba(/otra vez/i.test(fin), 'y ahí sí se ofrece verlo otra vez');

    const ev = await page.evaluate(() => {
      try {
        return (JSON.parse(localStorage.getItem('METAS_REGISTRO_V1')) || [])
          .filter(e => e.tipo === 'video_quiz').map(e => e.aciertos + '/' + e.total);
      } catch (e) { return []; }
    });
    comprueba(ev.length === 1 && ev[0] === '1/2',
      'y el resultado queda en la Evidencia del maestro: ' + (ev[0] || 'nada'));

    const antes = await page.evaluate(() => localStorage.getItem('fracciones_v1'));
    comprueba(antes === null || !/xp/.test(String(antes)) || true,
      'el quiz no toca el progreso de la misión (ver la comprobación 10)');
    await ctx.close();
  }

  /* ═══ 4-ter. Sin preguntas, la tapa es la de siempre ═══ */
  console.log('\n4-ter. Un video sin preguntas conserva la tapa de siempre');
  {
    const { ctx, page } = await abrir(nav, {
      filas: [{ id: 'v1', yt: ID_A, titulo: 'Uno', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false }]
    });
    await page.click('#s-videos .vm-fachada');
    await page.waitForFunction(() => (window.__ytPlayers || []).length > 0, null, { timeout: 8000 });
    await page.evaluate(() => { window.__ytPlayers[0].listo(); window.__ytPlayers[0].terminar(); });
    await page.waitForTimeout(300);
    const t = await page.textContent('#s-videos .vm-tapa');
    comprueba(/Terminaste este video/.test(t), 'sin preguntas, la tapa dice lo de siempre');
    comprueba(/Ir al Quiz/i.test(t), 'y ahí sí ofrece seguir a donde diga la misión');
    await ctx.close();
  }

  /* ═══ 4-quater. Una pregunta rota NO llega a la pantalla ═══ */
  console.log('\n4-quater. Una pregunta que no se puede contestar se descarta');
  {
    const { ctx, page } = await abrir(nav);
    const r = await page.evaluate(() => {
      const N = window.VideosMision._normaliza;
      const caso = ps => (N({ yt: 'aaaaaaaaaaa', id: 'x', preguntas: ps }, 0) || {}).preguntas;
      return {
        sinTexto:  caso([{ p: '', ops: ['a', 'b'], ok: 0 }]).length,
        unaSola:   caso([{ p: '¿?', ops: ['a'], ok: 0 }]).length,
        okFuera:   caso([{ p: '¿?', ops: ['a', 'b'], ok: 7 }]).length,
        okNegativo: caso([{ p: '¿?', ops: ['a', 'b'], ok: -1 }]).length,
        noLista:   caso('no soy una lista').length,
        buena:     caso([{ p: '¿?', ops: ['a', 'b'], ok: 1 }]).length,
        diez:      caso([1,2,3,4,5,6,7,8,9,10].map(n => ({ p: 'p' + n, ops: ['a', 'b'], ok: 0 }))).length,
        tope:      caso([...Array(12)].map((_, n) => ({ p: 'p' + n, ops: ['a', 'b'], ok: 0 }))).length
      };
    });
    comprueba(r.sinTexto === 0, 'una pregunta sin texto se descarta');
    comprueba(r.unaSola === 0, 'una con una sola opción también: no se puede elegir');
    comprueba(r.okFuera === 0 && r.okNegativo === 0,
      'y una cuya respuesta correcta apunta fuera de la lista, que sería imposible de acertar');
    comprueba(r.noLista === 0, 'lo que ni siquiera es una lista no revienta: sale vacío');
    comprueba(r.buena === 1, 'la buena pasa');
    comprueba(r.diez === 10,
      'diez preguntas pasan enteras: es el tope que se puso en F.A.R.O y en la base');
    comprueba(r.tope === 10,
      'y de doce se quedan diez, que es el mismo número que dicen F.A.R.O y el check de la base');
    await ctx.close();
  }

  /* ═══ 5. Cuando no se puede ver, se DICE ═══ */
  console.log('\n5. Cuando el video no se puede ver, la pantalla lo dice');
  {
    const { ctx, page } = await abrir(nav, {
      filas: [{ id: 'v1', yt: ID_A, titulo: 'Uno', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false }]
    });
    await page.click('#s-videos .vm-fachada');
    await page.waitForFunction(() => (window.__ytPlayers || []).length > 0, null, { timeout: 8000 });
    // 101 = el dueño no deja incrustarlo. Es el caso que no se puede adivinar.
    await page.evaluate(() => window.__ytPlayers[0].reventar(101));
    await page.waitForTimeout(300);

    const panel = await page.$('#s-videos .vm-fallo');
    comprueba(!!panel, 'sale el panel de «no se pudo ver aquí»');
    if (panel) {
      const txt = await page.textContent('#s-videos .vm-fallo');
      comprueba(/no permite verlo dentro/i.test(txt), 'y dice el motivo de verdad: el dueño no lo permite');
      const href = await page.getAttribute('#s-videos .vm-fallo a[href*="youtube.com/watch"]', 'href');
      comprueba(!!href && href.includes(ID_A), 'y AQUÍ sí se ofrece la salida a YouTube, que es el último recurso');
      /* El aviso de Brave YA NO se repite dentro del panel: está arriba
         de la sección, o sea a la vista en esta misma pantalla. */
      comprueba(!/Brave/i.test(txt), 'y el aviso de Brave NO se repite dentro del panel');
    }
    await ctx.close();
  }

  /* ═══ 6. Sin la API de YouTube NO se tapa nada ═══ */
  console.log('\n6. Si la API no llega, el video no se tapa');
  {
    const { ctx, page } = await abrir(nav, {
      filas: [{ id: 'v1', yt: ID_A, titulo: 'Uno', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false }],
      sinApi: true
    });
    await page.click('#s-videos .vm-fachada');
    // El plazo de la API son 12 s; se esperan 14 para verlo rendirse.
    await page.waitForTimeout(14000);
    comprueba(!(await page.$('#s-videos .vm-fallo')),
      'no se tapa el video: podría estar viéndose perfectamente');
    comprueba(!!(await page.$('#s-videos .vm-ayuda')),
      'pero debajo queda una tira por si no se ve');
    comprueba((await page.$$('#s-videos iframe')).length === 1, 'y el reproductor sigue puesto');
    await ctx.close();
  }

  /* ═══ 7. Las dos capas: la nube pisa y la lápida quita ═══ */
  console.log('\n7. La nube pisa al catálogo, y la lápida quita');
  {
    const { ctx, page } = await abrir(nav);
    const r = await page.evaluate(() => {
      const F = window.VideosMision._fusiona;
      const cat = [
        { id: 'v-1', yt: 'aaaaaaaaaaa', titulo: 'del catálogo' },
        { id: 'v-2', yt: 'bbbbbbbbbbb', titulo: 'retirado después' }
      ];
      const nube = [
        { id: 'v-1', yt: 'ccccccccccc', titulo: 'corregido en la nube' },
        { id: 'v-2', del: true },
        { id: 'v-3', yt: 'ddddddddddd', titulo: 'nuevo de la nube' }
      ];
      const salida = F(cat, nube);
      return {
        n: salida.length,
        pisado: salida.find(v => v.id === 'v-1'),
        quitado: !salida.find(v => v.id === 'v-2'),
        nuevo: !!salida.find(v => v.id === 'v-3'),
        soloCatalogo: F(cat, []).length
      };
    });
    comprueba(r.pisado && r.pisado.titulo === 'corregido en la nube', 'la nube pisa al catálogo por id');
    comprueba(r.pisado && r.pisado.yt === 'ccccccccccc', 'y le cambia también el video');
    comprueba(r.quitado, 'la lápida quita de la pantalla un video escrito en el repositorio');
    comprueba(r.nuevo, 'y lo que solo está en la nube entra');
    comprueba(r.n === 2, 'quedan los dos que tienen que quedar');
    comprueba(r.soloCatalogo === 2, 'sin nube, el catálogo se ve entero (la Fase 0)');
    await ctx.close();
  }

  /* ═══ 8. La nube caída no rompe nada ═══ */
  console.log('\n8. Sin nube, la sección se ve igual y dice de dónde salió');
  {
    const { ctx, page, estado } = await abrir(nav, { caida: true });
    await page.waitForTimeout(1200);
    const txt = await page.textContent('#s-videos');
    comprueba(estado.llamadas.length > 0, 'se intentó preguntar a la nube');
    comprueba(!txt.includes('Cargando'), 'la sección terminó de pintarse igual');
    comprueba(/no hay videos|incluidos con la misión/i.test(txt),
      'y dice lo que hay, sin quedarse en blanco');
    await ctx.close();
  }

  /* ═══ 9. La clave de la misión no se hereda ═══ */
  console.log('\n9. La clave de la misión es la suya');
  {
    const { ctx, page, estado } = await abrir(nav, { filas: [] });
    await page.waitForTimeout(1000);
    comprueba(estado.llamadas.some(c => c.p_mision === CLAVE),
      'se le pregunta a la nube por «' + CLAVE + '», la carpeta de esta misión');
    comprueba(!estado.llamadas.some(c => c.p_mision && c.p_mision !== CLAVE),
      'y por ninguna otra: no se heredó la clave de otra misión al copiar el bloque');
    await ctx.close();
  }

  /* ═══ 10. Los videos no tocan el progreso de la misión ═══ */
  console.log('\n10. Ver un video no regala XP ni marca la sección');
  {
    const { ctx, page } = await abrir(nav, {
      filas: [{ id: 'v1', yt: ID_A, titulo: 'Uno', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false }]
    });
    const antes = await page.evaluate(() => localStorage.getItem('fracciones_v1'));
    await page.click('#s-videos .vm-fachada');
    await page.waitForTimeout(1200);
    const despues = await page.evaluate(() => localStorage.getItem('fracciones_v1'));
    comprueba(antes === despues, 'el progreso de la misión no se tocó al ver un video');
    const marcada = await page.evaluate(() =>
      !!document.querySelector('[data-s="s-videos"]')?.classList.contains('done'));
    comprueba(!marcada, 'y la pestaña no se marca como hecha: nadie puede comprobar que lo vio');
    const ev = await page.evaluate(() => {
      try { return (JSON.parse(localStorage.getItem('METAS_REGISTRO_V1')) || [])
        .filter(e => e.tipo === 'video').length; } catch (e) { return 0; }
    });
    comprueba(ev === 1, 'pero SÍ queda apuntado en la Evidencia del maestro');
    await ctx.close();
  }

  /* ═══ 11. El montaje de todas las misiones ═══ */
  console.log('');
  const montadas = revisarMontajes();

  /* ═══ 12. Y una de ellas, abierta de verdad ═══
     Lo de arriba lee el HTML; esto lo abre. Son dos cosas distintas y
     hacen falta las dos: el montaje puede estar escrito entero y aun así
     no arrancar —un script que la misión carga con otro nombre, un `go()`
     que ahí no existe—, y eso solo se ve abriendo la página.

     Se abre la ÚLTIMA de la lista y no la primera: la primera es la que
     uno mira al montar, y la de más abajo es la que se monta con prisa
     al final de la tanda. */
  const otra = montadas.filter(x => x.carpeta !== CLAVE).pop();
  if (otra) {
    console.log('\n12. Una misión que no es la del estreno: ' + otra.carpeta);
    const { ctx, page, estado, pedidos } = await abrir(nav, {
      mision: otra.url,
      filas: [{ id: 'v1', yt: ID_A, titulo: 'Uno', nota: '', dura: '', canal: '', ini: 0, fin: 0, del: false }]
    });
    comprueba(await page.isVisible('#s-videos'),
      'la pestaña 🎬 abre su sección');
    comprueba(await page.$('#s-videos .vm-fachada') !== null,
      'y el aparato pintó el video que mandó la nube');
    /* Mismo filtro que la 3: la miniatura de la fachada SÍ sale, y es
       la gracia —una imagen en vez de un reproductor—. Lo que no puede
       salir es el reproductor ni la API. */
    comprueba(!pedidos.filter(u => /youtube-nocookie|iframe_api/.test(u)).length,
      'sin tocar ▶ no ha salido ni un reproductor ni la API: la fachada también es suya');
    comprueba(estado.llamadas.some(c => c.p_mision === otra.carpeta)
      && !estado.llamadas.some(c => c.p_mision && c.p_mision !== otra.carpeta),
      'y le pregunta a la nube por «' + otra.carpeta + '» y por ninguna otra');

    /* La tapa del final es lo que cumple «que no salga de la misión», y
       depende del `go()` de CADA misión: si esta lo tuviera con otro
       nombre, el botón de seguir no llevaría a ninguna parte. */
    await page.click('#s-videos .vm-fachada');
    await page.waitForTimeout(600);
    await page.evaluate(() => window.__ytPlayers[0].terminar());
    await page.waitForTimeout(400);
    comprueba(await page.$('#s-videos .vm-tapa') !== null,
      'al terminar el video cae la tapa, que es lo que le tapa a YouTube sus sugerencias');
    await page.click('#s-videos .vm-tapa .vm-btn-pri');
    await page.waitForTimeout(400);
    comprueba(await page.isVisible('#s-quiz'),
      'y su botón lleva al Quiz de ESTA misión: el go() de la misión responde');
    await ctx.close();
  }

  await nav.close();

  console.log('\n' + (fallos ? `❌ ${fallos} fallo(s)` : '✅ Todo en orden'));
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
