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
     la salida a YouTube y el aviso de Brave.

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
const { chromium } = require('playwright');

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
        _play: 0,
        seekTo: function () {}, playVideo: function () { p._play++; },
        listo:     function () { opts.events.onReady && opts.events.onReady({ target: p }); },
        terminar:  function () { opts.events.onStateChange && opts.events.onStateChange({ data: 0, target: p }); },
        reventar:  function (c) { opts.events.onError && opts.events.onError({ data: c, target: p }); }
      };
      window.__ytPlayers.push(p);
      return p;
    }
  };
`;

async function abrir(navegador, { filas = [], caida = false, sinApi = false, api = true } = {}) {
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
  await page.goto(BASE + MISION, { waitUntil: 'domcontentloaded' });
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
async function lanzar() {
  try { return await chromium.launch(); }
  catch (e) { return await chromium.launch({ executablePath: process.env.CHROMIUM_BIN || '/opt/pw-browsers/chromium' }); }
}

(async () => {
  console.log('\n🎬 La sección de videos de una misión\n');
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
      comprueba(/Brave/i.test(txt), 'con el aviso de Brave');
      const href = await page.getAttribute('#s-videos .vm-fallo a[href*="youtube.com/watch"]', 'href');
      comprueba(!!href && href.includes(ID_A), 'y AQUÍ sí se ofrece la salida a YouTube, que es el último recurso');
      const brave = await page.getAttribute('#s-videos .vm-fallo a[href*="brave.com"]', 'href');
      comprueba(!!brave, 'el enlace de Brave lleva a brave.com');
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

  await nav.close();

  console.log('\n' + (fallos ? `❌ ${fallos} fallo(s)` : '✅ Todo en orden'));
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
