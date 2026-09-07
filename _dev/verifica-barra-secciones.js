/* ============================================================
   M.E.T.A.S · La barra de secciones está arriba y no se va
   ------------------------------------------------------------
   Medido antes de tocar nada, en las 74 misiones y con un teléfono
   de 360×640: la barra quedaba FUERA de la primera pantalla en las
   74, mediana 3 156 px (4,9 pantallas) y peor 6 180 px (9,7).
   Ninguna era pegajosa y llegaban a siete filas de chips.

   Y lo que de verdad costaba no era la distancia: go() termina en
   scrollTo({top:0}), así que se bajaba 2,2 pantallas hasta la barra,
   se tocaba «Evaluación», la página saltaba arriba y la barra pasaba
   a estar a 7,7. Usarla dos veces eran dos viajes, y la distancia
   cambiaba en cada uno.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-barra-secciones.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = 'http://localhost:8123';

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

/* Las misiones se cuentan, no se escriben: la 75 entra sola. */
function misiones() {
  const out = [];
  for (const d of fs.readdirSync(path.join(RAIZ, 'misiones')).sort()) {
    const dir = path.join(RAIZ, 'misiones', d);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir).sort()) {
      if (!f.endsWith('.html') || f.startsWith('juego-')) continue;
      const s = fs.readFileSync(path.join(dir, f), 'utf8');
      if (s.includes('<nav class="nav"')) { out.push({ dir: d, f, s }); break; }
    }
  }
  return out;
}

/* Lo que la sonda pregunta en cada momento, en la pantalla. */
const mirar = pg => pg.evaluate(() => {
  const n = document.querySelector('nav.nav');
  if (!n) return { sinBarra: true };
  const b = n.getBoundingClientRect();
  const chips = [...n.querySelectorAll('.nav-t, button')].filter(e => e.offsetParent !== null);
  const ys = new Set(chips.map(c => Math.round(c.getBoundingClientRect().top)));
  const act = n.querySelector('.nav-t.active, .nav-t[aria-selected="true"], button.on');
  const ar = act && act.getBoundingClientRect();
  /* El guardián de siempre: lo que se ve, ¿se puede tocar? */
  const enElCentro = ar && document.elementFromPoint(ar.left + ar.width / 2, ar.top + ar.height / 2);
  const sec = document.querySelector('.sec.active');
  return {
    enPantalla: b.top < innerHeight && b.bottom > 0,
    top: Math.round(b.top),
    alto: Math.round(b.height),
    filas: ys.size,
    chips: chips.length,
    altoMinChip: chips.length ? Math.round(Math.min(...chips.map(c => c.getBoundingClientRect().height))) : 0,
    activo: act && act.textContent.trim().slice(0, 24),
    activoALaVista: !!(ar && ar.left >= b.left - 1 && ar.right <= b.right + 1),
    activoTocable: !!(enElCentro && enElCentro.closest('.nav-t, button')),
    pegajosa: getComputedStyle(n.parentElement).position === 'sticky' || getComputedStyle(n).position === 'sticky',
    seccion: sec && sec.id,
    scroll: Math.round(scrollY),
  };
});

async function abrirMision(nav, rel, viewport) {
  const ctx = await nav.newContext({ viewport, isMobile: viewport.width < 700, hasTouch: true, locale: 'es-HN' });
  await ctx.route('**/*.supabase.co/**', r => r.abort());
  /* Sin identidad, el modal tapa la barra y no se puede tocar nada. */
  await ctx.addInitScript(() => {
    try { localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({ nombre: 'Ana López', num: '7', grupo: '6-1' })); } catch (e) { }
  });
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('pageerror', e => errores.push(e.message.slice(0, 90)));
  await pg.goto(`${BASE}/misiones/${rel}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await pg.waitForTimeout(700);
  return { ctx, pg, errores };
}

(async () => {
  console.log('\n════════ LA BARRA DE SECCIONES ESTÁ ARRIBA Y NO SE VA ════════\n');
  const MIS = misiones();

  /* ── 1 · Las dos piezas compartidas, en TODAS ────────────────
     Es lo que se multiplica al copiar una misión, y abrir 74 con
     Playwright cuesta siete minutos: una comprobación así no la
     corre nadie antes de publicar. Se lee del archivo. */
  console.log(`── las dos piezas, en las ${MIS.length} misiones ──`);
  const sinCss = MIS.filter(m => !m.s.includes('css/barra-secciones.css')).map(m => m.dir);
  const sinJs = MIS.filter(m => !m.s.includes('js/barra-secciones.js')).map(m => m.dir);
  ok('todas cargan el CSS compartido', !sinCss.length, sinCss.slice(0, 5));
  ok('todas cargan el JS compartido', !sinJs.length, sinJs.slice(0, 5));

  /* El orden manda: el CSS de la barra sobrescribe el position:static
     de la misión por ORDEN, no con !important. Si se colara antes, la
     barra volvería al fondo sin dar un solo error. */
  const malOrden = MIS.filter(m => {
    const propio = m.s.lastIndexOf('<link rel="stylesheet" href="css/');
    return propio >= 0 && m.s.indexOf('css/barra-secciones.css') < propio;
  }).map(m => m.dir);
  ok('y el CSS va DESPUÉS del de la misión', !malOrden.length, malOrden.slice(0, 5));

  /* Los comentarios se quitan antes de mirar: este archivo EXPLICA por qué
     no hace falta !important, y buscarlo a secas se acusa a sí mismo. Es la
     misma trampa que ya cazó verifica-legal.js. */
  const cssBarra = fs.readFileSync(path.join(RAIZ, 'css/barra-secciones.css'), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  ok('sin un solo !important, que es lo que se gana con ese orden', !cssBarra.includes('!important'));

  /* ── 2 · Y en la pantalla ────────────────────────────────────
     Cuatro misiones a propósito distintas: la del hallazgo, la más
     larga, una del maestro (que ya tenía la barra arriba) y una con
     el aparato de videos montado. */
  const MUESTRA = [
    ['2ciclo-angulos-basicos/angulos-basicos.html', 'la del hallazgo'],
    ['fin-de-grado-7mo/fin-de-grado-7mo.html', 'la más larga'],
    ['2y3ciclo-fracciones/fracciones.html', 'con videos montados'],
  ];
  const nav = await abrir({ args: ['--no-sandbox'] });

  for (const [rel, quien] of MUESTRA) {
    console.log(`\n── ${rel.split('/')[0]} · ${quien} ──`);
    const { ctx, pg, errores } = await abrirMision(nav, rel, { width: 360, height: 640 });

    const alAbrir = await mirar(pg);
    ok('se ve al abrir, sin deslizar', alAbrir.enPantalla, alAbrir);
    ok('en UNA fila, no en siete', alAbrir.filas === 1, { filas: alAbrir.filas, chips: alAbrir.chips });
    ok('ningún chip baja de 44 px de alto', alAbrir.altoMinChip >= 44, alAbrir.altoMinChip);

    /* La ⭐ de una sección hecha va con top:-6px, o sea FUERA del chip. En
       una barra que se desplaza por dentro, sin aire arriba se corta: el
       alumno pierde de vista lo único que le dice qué lleva hecho. */
    const estrella = await pg.evaluate(() => {
      const n = document.querySelector('nav.nav');
      let c = n.querySelector('.nav-t.done');
      if (!c) { c = n.querySelector('.nav-t'); if (c) c.classList.add('done'); }
      if (!c) return null;
      return Math.round(c.getBoundingClientRect().top - n.getBoundingClientRect().top);
    });
    ok('y la ⭐ de lo hecho no se corta por arriba', estrella === null || estrella >= 6, { aireArriba: estrella });
    ok('y no se come la pantalla (≤ 90 px)', alAbrir.alto <= 90, alAbrir.alto);

    /* La barra es role="tablist" y las secciones role="tabpanel": si
       va detrás, un lector de pantalla lee la misión entera antes de
       decir que había pestañas. */
    ok('va ANTES de las secciones, no detrás de las veinte',
      await pg.evaluate(() => !!(document.querySelector('nav.nav')
        .compareDocumentPosition(document.querySelector('.sec')) & Node.DOCUMENT_POSITION_FOLLOWING)));

    /* Lo que de verdad estaba roto: usarla dos veces seguidas. */
    await pg.evaluate(() => window.scrollTo(0, 1200));
    await pg.waitForTimeout(300);
    const bajando = await mirar(pg);
    ok('sigue ahí con la sección a medio leer', bajando.enPantalla && bajando.top <= 2, bajando);

    const secs = await pg.evaluate(() => [...document.querySelectorAll('nav.nav .nav-t')].map(b => b.dataset.s).filter(Boolean));
    const lejos = secs[secs.length - 2] || secs[secs.length - 1];
    await pg.click(`[data-s="${lejos}"]`);
    await pg.waitForTimeout(900);
    const tras = await mirar(pg);
    ok('tras cambiar de sección NO hay que volver a buscarla', tras.enPantalla, tras);
    ok('y el chip de donde está el alumno se ve', tras.activoALaVista, { activo: tras.activo });
    ok('y se puede tocar: no hay nada encima', tras.activoTocable, { activo: tras.activo });
    ok('cambió de sección de verdad', tras.seccion === lejos, { pedida: lejos, puesta: tras.seccion });

    /* Y otra vez, sin viaje de por medio: era el caso imposible. */
    await pg.click(`[data-s="${secs[0]}"]`);
    await pg.waitForTimeout(900);
    const otra = await mirar(pg);
    ok('y otra vez seguida, sin bajar al fondo', otra.enPantalla && otra.seccion === secs[0], otra);

    ok('sin errores de JavaScript', !errores.length, errores.slice(0, 2));
    await ctx.close();
  }

  /* ── 3 · Opaca de verdad, y en los dos temas ──────────────────
     Pegada arriba, una barra sin fondo deja ver el contenido pasando
     por debajo. Ocho misiones —las del maestro— la traen SIN fondo:
     quieta al final del documento eso no se notaba. */
  console.log('\n── la barra tapa lo que pasa por debajo ──');
  for (const [rel, quien, tema] of [
    ['2ciclo-angulos-basicos/angulos-basicos.html', 'el alumno, claro', 'light'],
    ['2ciclo-angulos-basicos/angulos-basicos.html', 'el alumno, oscuro', 'dark'],
    ['docente-bienvenida-metas/bienvenida-metas.html', 'el maestro, sin fondo propio', null],
  ]) {
    const ctx = await nav.newContext({ viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true });
    await ctx.addInitScript(() => { try { localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({ nombre: 'Ana López', num: '7', grupo: '6-1' })); } catch (e) { } });
    if (tema) await ctx.addInitScript(t => document.addEventListener('DOMContentLoaded', () => document.documentElement.setAttribute('data-theme', t)), tema);
    const pg = await ctx.newPage();
    await pg.goto(`${BASE}/misiones/${rel}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await pg.waitForTimeout(800);
    await pg.evaluate(() => window.scrollTo(0, 900));
    await pg.waitForTimeout(400);
    const r = await pg.evaluate(() => {
      const n = document.querySelector('nav.nav'), marco = n.parentElement, b = marco.getBoundingClientRect();
      const e = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
      const opaco = c => c && !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(c);
      return {
        pegada: Math.round(b.top) <= 2,
        conFondo: opaco(getComputedStyle(n).backgroundColor) || opaco(getComputedStyle(marco).backgroundColor),
        recibeElToque: !!(e && marco.contains(e)),
        deDondeSale: opaco(getComputedStyle(n).backgroundColor) ? 'la barra' : 'el marco (medido)',
      };
    });
    ok(`${quien}: la barra tiene fondo y recibe el toque`, r.pegada && r.conFondo && r.recibeElToque, r);
    await ctx.close();
  }

  /* ── 4 · La pantalla del maestro, que no es un teléfono ──────── */
  console.log('\n── en la computadora del maestro (1280×720) ──');
  {
    const { ctx, pg } = await abrirMision(nav, '2ciclo-angulos-basicos/angulos-basicos.html', { width: 1280, height: 720 });
    const r = await mirar(pg);
    ok('también se ve al abrir', r.enPantalla, r);
    ok('y sigue en una fila', r.filas === 1, r.filas);
    await ctx.close();
  }

  await nav.close();
  console.log('\n' + '─'.repeat(52));
  if (fallos) { console.log(`✖ ${fallos} problema(s): el alumno vuelve a perderse buscando las secciones.`); process.exit(1); }
  console.log('✅ TODO EN VERDE: la barra está arriba, en una fila y no se va.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
