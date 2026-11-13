/* ═══════════════════════════════════════════════════════════════
   🧾 NOTAS SACE SE ENTIENDE SIN LEER

   Noviembre de 2026 (v504): la pestaña tenía, antes de la tabla, el
   Encabezado en acordeón, dos cajas amarillas de instrucciones, tres
   botones de respaldos con su explicación, el aviso «Parcial III
   protegido», la leyenda y el aviso de recuperación. Parcial y sección
   eran listas desplegables. Hasta quien hizo la app se confundía.

   Esta sonda falla si se vuelve atrás:

   · NADA DESPLEGABLE: ni <select> ni <details> en Notas SACE, en las
     cuatro secciones y los cuatro parciales.
   · NINGÚN BOTÓN SE PERDIÓ: cada id que existía antes sigue en la
     pestaña, y se alcanza: a la vista o dentro de la ventana de su chip.
   · LA TABLA A LA VISTA en una PC de 1366×768, sin bajar la pantalla.
   · CELULAR: los botones de parcial y sección se leen completos, la
     página no se corre de lado y la columna de nombres queda fija.
   · La elección queda marcada y se recuerda; el 🔒 se explica una sola
     vez; «Sugerir notas» en un parcial cerrado avisa y no toca nada.
   · La ayuda se abre sola la primera vez y nunca más; tres pasos.
   · Y ninguna nota cambia por pasearse por todo esto.

   Uso:
     node _dev/servidor-estatico.js       (en otra terminal)
     node _dev/verifica-notas-sace-simple.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { abrir, SIN_SW } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
let fallos = 0, pasan = 0;
const comprueba = (m, c, extra) => {
  if (c) { pasan++; console.log('  ✅ ' + m); }
  else { fallos++; console.log('  ❌ ' + m + (extra !== undefined ? '  ' + JSON.stringify(extra).slice(0, 400) : '')); }
};

const MATS = ['Español', 'Inglés', 'Educación Artística', 'Matemáticas', 'Ciencias Sociales',
  'Ciencias Naturales', 'Educación Física', 'Educación Cívica'];
/* Un 6º de verdad: 43 alumnos, los cuatro parciales llenos, algunos con final bajo 70 */
function sembrado(extraBoleta) {
  const lista = Array.from({ length: 43 }, (_, i) => ({ num: i + 1, nombre: 'Alumno' + (i + 1) + ' Apellido' }));
  const notas = { I: {}, II: {}, III: {}, IV: {} };
  ['I', 'II', 'III', 'IV'].forEach((p, pi) => MATS.forEach((m, k) => {
    notas[p][m] = {};
    lista.forEach(a => { notas[p][m][a.num] = 55 + ((a.num * 13 + k * 7 + pi * 3) % 46); });
  }));
  return { v: 2, activo: 'G1', grupos: [{ id: 'G1', grado: '6', seccion: '1', escuela: 'ESC. DE PRUEBA',
    materias: MATS, lista, colectas: [], asistencia: [{ f: '2026-08-12', aus: { 3: 'A' } }], notas,
    boleta: Object.assign({ parcialFechas: {} }, extraBoleta || {}),
    controles: [], bitacora: [], lectura: [], convocatorias: [] }] };
}

/* Los botones que había ANTES del rediseño, por sección. `vent`: el chip
   que abre la ventana donde ahora vive (null = a la vista). */
const ENC = ['ad-logo-file', 'ad-logosec-file', 'ad-boleta-centro', 'ad-bol-director', 'ad-bol-docente',
  'ad-bol-lugar', 'ad-bol-municipio', 'ad-bol-depto', 'ad-bol-anio'];
const COMUNES = [
  ['ad-sace-vista', null], ['ad-sace-orden-az', null], ['ad-sace-orden-gen', null], ['ad-sace-nocopy', null],
  ['ad-sace-boletas', null], ['ad-sace-bol-quien', null], ['ad-sace-cfinal', null], ['ad-sace-resumen', null],
  ['ad-sace-versiones', null], ['ad-sace-recuperar', 'ad-sace-chip-rescate'], ['ad-sace-perdidos', 'ad-sace-chip-rescate'],
  ...ENC.map(id => [id, 'ad-sace-chip-encabezado'])];
const POR_VISTA = {
  aprov: [['ad-sace-parcial', null], ['ad-sace-addmat', null], ['ad-sace-csv', null], ['ad-sace-ir-rec', null]],
  pers: [['ad-sace-csv', null], ['ad-sace-csv-num', null], ['ad-pers-editescala', null]],
  inasis: [['ad-sace-parcial', null], ['ad-sace-csv', null], ['ad-inasis-traer', null]],
  recup: []
};

(async () => {
  const nav = await abrir();
  const errores = [];
  const pagina = async (vp, extra) => {
    const pg = await nav.newPage({ ...SIN_SW, viewport: vp });
    pg.on('pageerror', e => errores.push(e.message));
    await pg.route('**/rest/v1/**', r => r.abort('failed'));   /* la nube no se toca */
    if (extra) await pg.addInitScript(extra);
    await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    await pg.waitForFunction(() => typeof window.renderAdmin === 'function' && typeof window.adRenderSace === 'function');
    return pg;
  };
  const sembrar = (pg, sem, llaves) => pg.evaluate(([s, ll]) => {
    localStorage.clear();
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(s));
    Object.keys(ll || {}).forEach(k => localStorage.setItem(k, ll[k]));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-admin').classList.add('active');
    _adTab = 'sace'; renderAdmin(true); window.scrollTo(0, 0);
  }, [sem, llaves || null]);
  const notas = pg => pg.evaluate(() => JSON.stringify(JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].notas));
  const pinta = (pg, p, v) => pg.evaluate(([p, v]) => {
    const b = document.getElementById('ad-tab-body');
    b.dataset.parcial = p; b.dataset.vista = v; adRenderSace(b, adLoad()); window.scrollTo(0, 0);
  }, [p, v]);
  const visible = (pg, id) => pg.evaluate(id => {
    const e = document.getElementById(id); if (!e) return false;
    /* un input de archivo vive escondido dentro de su etiqueta «📷 Subir» */
    const v = e.type === 'file' ? e.closest('label') : e;
    const r = v.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(v).visibility !== 'hidden';
  }, id);

  /* ── 1 · PC 1366×768 ── */
  console.log('\n── PC de 1366×768 ──');
  const pg = await pagina({ width: 1366, height: 768 });
  const sem = sembrado();
  await sembrar(pg, sem, { METAS_SACE_AYUDA_VISTA_V1: '1', METAS_SACE_PARCIAL: 'III' });
  await pg.waitForSelector('#ad-sace-vista');
  const n0 = await notas(pg);

  const conDesplegable = [];
  for (const v of ['aprov', 'pers', 'inasis', 'recup']) for (const p of ['I', 'II', 'III', 'IV']) {
    await pinta(pg, p, v);
    const n = await pg.$$eval('#ad-tab-body select, #ad-tab-body details', xs => xs.length);
    if (n) conDesplegable.push(v + '·' + p + ': ' + n);
  }
  comprueba('ningún <select> ni <details> en Notas SACE (4 secciones × 4 parciales)', !conDesplegable.length, conDesplegable);

  const perdidos = [];
  for (const v of ['aprov', 'pers', 'inasis', 'recup']) {
    for (const [id, chip] of COMUNES.concat(POR_VISTA[v])) {
      await pinta(pg, 'III', v);
      if (!(await pg.$('#' + id))) { perdidos.push(v + ': #' + id + ' no existe'); continue; }
      if (chip) {
        comprueba(v + ': #' + id + ' está escondido hasta tocar su chip', !(await visible(pg, id)));
          await pg.click('#' + chip);
      }
      if (!(await visible(pg, id))) perdidos.push(v + ': #' + id + ' no se alcanza' + (chip ? ' desde #' + chip : ''));
      if (chip) await pg.keyboard.press('Escape');
    }
  }
  comprueba('cada botón de antes sigue y se alcanza (a la vista o desde su chip)', !perdidos.length, perdidos);

  /* Parcial IV: autorizar / sugerir / bloquear siguen donde estaban sus funciones */
  await pinta(pg, 'IV', 'aprov');
  comprueba('Parcial IV sin autorizar: está «🛡️ Autorizar sugerir notas»', await visible(pg, 'ad-sace-autorizar-iv'));
  await pg.evaluate(() => { const d = adLoad(); d.boleta.sugerirIVAuth = '2026-11-13T00:00:00Z'; adSave(d); });
  await pinta(pg, 'IV', 'aprov');
  comprueba('Parcial IV autorizado: están «✨ Sugerir notas» y «🔒 Bloquear sugerencia»',
    await visible(pg, 'ad-sace-sugerir') && await visible(pg, 'ad-sace-bloquear-iv'));
  await pg.evaluate(() => { const d = adLoad(); delete d.boleta.sugerirIVAuth; adSave(d); });
  /* «Revisar notas puestas solas» solo existe cuando hubo autocompletado */
  await pg.evaluate(() => { const d = adLoad(); d.boleta.autoRecI_III_v479 = 1; adSave(d); });
  await pinta(pg, 'III', 'aprov');
  const hayRev = await pg.$('#ad-sace-revisar-solas');
  if (hayRev) {
    await pg.click('#ad-sace-chip-rescate');
    comprueba('con autocompletado, «Revisar notas puestas solas» está en la ventana 🛟', await visible(pg, 'ad-sace-revisar-solas'));
    comprueba('la ventana 🛟 trae las tres opciones, cada una con su línea',
      await pg.$$eval('#ad-sace-v-rescate .ad-sace-opcion', xs => xs.length === 3 && xs.every(x => x.querySelector('button') && x.querySelector('p').textContent.trim())));
  } else console.log('  ·  (este grupo no ofrece «Revisar notas puestas solas»; se mira en verifica-notas-sin-pedir)');
  await pg.evaluate(() => { const d = adLoad(); delete d.boleta.autoRecI_III_v479; adSave(d); });

  /* la tabla, sin bajar la pantalla */
  await pinta(pg, 'III', 'aprov');
  const med = await pg.evaluate(() => {
    const w = document.querySelector('#ad-tab-body .ad-mx-wrap'), filas = w.querySelectorAll('tbody tr');
    const r3 = filas[2].getBoundingClientRect();
    return { arriba: Math.round(w.getBoundingClientRect().top), fila3: Math.round(r3.bottom), alto: innerHeight, scrollY };
  });
  comprueba('a 1366×768 la tabla empieza en la pantalla y se ven al menos 3 alumnos sin bajar',
    med.scrollY === 0 && med.arriba < med.alto && med.fila3 <= med.alto, med);
  const antesDeTabla = await pg.evaluate(() => {
    const w = document.querySelector('#ad-tab-body .ad-mx-wrap'), out = [];
    document.querySelectorAll('#ad-tab-body .pa-optional-hint, #ad-tab-body .ad-rec-bar, #ad-tab-body .ad-sug-bar').forEach(e => {
      if (e.offsetParent && (e.compareDocumentPosition(w) & Node.DOCUMENT_POSITION_FOLLOWING)) out.push(e.className + ': ' + e.textContent.trim().slice(0, 40));
    });
    return out;
  });
  comprueba('antes de la tabla no queda ninguna caja de instrucciones ni de respaldos', !antesDeTabla.length, antesDeTabla);
  const ley = await pg.evaluate(() => { const l = document.querySelector('#ad-tab-body .ad-nt-ley'), w = document.querySelector('#ad-tab-body .ad-mx-wrap');
    return l && Math.round(w.getBoundingClientRect().top - l.getBoundingClientRect().bottom); });
  comprueba('la leyenda de colores va pegada encima de la tabla (en una línea)', ley != null && ley >= 0 && ley <= 16, ley);
  comprueba('el aviso de recuperación va debajo de la tabla, con su botón',
    await pg.evaluate(() => { const a = document.getElementById('ad-sace-rec-aviso'), w = document.querySelector('#ad-tab-body .ad-mx-wrap');
      return !a.hidden && a.getBoundingClientRect().top >= w.getBoundingClientRect().bottom && !!a.querySelector('#ad-sace-ir-rec'); }));
  comprueba('«Herramientas» va debajo de la tabla',
    await pg.evaluate(() => { const c = document.getElementById('ad-sace-chip-encabezado'), w = document.querySelector('#ad-tab-body .ad-mx-wrap');
      return c.getBoundingClientRect().top > w.getBoundingClientRect().bottom; }));

  /* elegir, marcar y recordar */
  await pg.evaluate(() => localStorage.removeItem('METAS_SACE_CANDADO_AVISO_V1'));
  await pg.click('[data-sel-parcial="II"]');
  comprueba('el parcial tocado queda marcado (y solo ese)',
    await pg.$$eval('[data-sel-parcial]', bs => bs.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.selParcial).join()) === 'II');
  comprueba('y se recuerda en la llave de siempre', await pg.evaluate(() => localStorage.getItem('METAS_SACE_PARCIAL')) === 'II');
  const toast1 = await pg.evaluate(() => (document.getElementById('meta-toast') || {}).textContent || '');
  comprueba('la primera vez, el 🔒 se explica con un aviso breve', /🔒 Parcial II cerrado/.test(toast1), toast1);
  await pg.evaluate(() => { const t = document.getElementById('meta-toast'); if (t) t.textContent = ''; });
  await pg.click('[data-sel-parcial="III"]');
  comprueba('la segunda vez ya no sale', !(await pg.evaluate(() => (document.getElementById('meta-toast') || {}).textContent || '')));
  await pg.click('[data-sel-vista="pers"]');
  comprueba('la sección tocada queda marcada y se recuerda',
    await pg.$eval('[data-sel-vista="pers"]', b => b.getAttribute('aria-pressed')) === 'true' &&
    await pg.evaluate(() => localStorage.getItem('METAS_SACE_VISTA')) === 'pers');
  await pg.click('[data-sel-vista="aprov"]');
  await pg.click('#ad-sace-sugerir');
  const toast2 = await pg.evaluate(() => (document.getElementById('meta-toast') || {}).textContent || '');
  comprueba('«Sugerir notas» en el Parcial III avisa que solo funciona en el IV', /solo funciona en el Parcial IV/.test(toast2), toast2);

  /* boleta de un solo alumno, sin lista desplegable */
  await pg.click('#ad-sace-bol-quien');
  await pg.click('[data-bol-num="7"]');
  comprueba('«Boleta de un alumno» elige con un botón y el de imprimir dice a quién',
    /Alumno7/.test(await pg.textContent('#ad-sace-boletas')) && await pg.$eval('#ad-sace-bol-quien', b => b.value) === '7');
  await pg.click('#ad-sace-bol-quien');
  await pg.click('[data-bol-num=""]');
  comprueba('y se vuelve a todo el grupo', /todo el grupo/.test(await pg.textContent('#ad-sace-boletas')));
  /* Esc y ✕ cierran */
  await pg.click('#ad-sace-chip-encabezado');
  await pg.keyboard.press('Escape');
  comprueba('Esc cierra la ventana', !(await visible(pg, 'ad-boleta-centro')));

  comprueba('pasearse por todo esto no cambia ninguna nota', await notas(pg) === n0);
  await pg.close();

  /* ── 2 · la ayuda, como la ve un maestro (sin navigator.webdriver) ── */
  console.log('\n── la ayuda la primera vez ──');
  const pa = await pagina({ width: 1366, height: 768 }, () => Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }));
  await sembrar(pa, sembrado());
  await pa.waitForSelector('#ad-sace-vista');
  comprueba('la primera vez se abre sola', await visible(pa, 'ad-sace-v-ayuda'));
  const pasos = await pa.$$eval('#ad-sace-v-ayuda li', ls => ls.map(l => l.textContent.trim()));
  comprueba('trae 3 pasos como máximo, de 12 palabras o menos', pasos.length >= 1 && pasos.length <= 3 &&
    pasos.every(t => t.split(/\s+/).length <= 12), pasos);
  await pa.click('#ad-sace-v-ayuda .ad-gen-foot button');
  await pinta(pa, 'III', 'aprov');
  comprueba('la segunda vez ya no se abre sola', !(await visible(pa, 'ad-sace-v-ayuda')));
  await pa.click('#ad-sace-ayuda');
  comprueba('pero «ⓘ ¿Cómo se llena?» la abre cuando se pida', await visible(pa, 'ad-sace-v-ayuda'));
  await pa.close();

  /* ── 3 · celular ── */
  console.log('\n── celular de 390 px ──');
  const pc = await pagina({ width: 390, height: 844 });
  await sembrar(pc, sembrado(), { METAS_SACE_AYUDA_VISTA_V1: '1' });
  await pc.waitForSelector('#ad-sace-vista');
  const cel = await pc.evaluate(() => {
    const bs = [...document.querySelectorAll('#ad-tab-body .ad-seg-btn')];
    const cortados = bs.filter(b => b.scrollWidth > b.clientWidth + 1 || b.getBoundingClientRect().right > innerWidth + 1).map(b => b.textContent.trim());
    const anchos = [...document.querySelectorAll('#ad-tab-body .ad-seg')].map(s => Math.round(s.getBoundingClientRect().width));
    const card = document.querySelector('#ad-tab-body .pa-card').getBoundingClientRect().width;
    const fijo = document.querySelector('#ad-tab-body .ad-mx-sticky');
    const wrap = document.querySelector('#ad-tab-body .ad-mx-wrap');
    return { cortados, anchos, card: Math.round(card), deLado: document.documentElement.scrollWidth > innerWidth,
      fijo: getComputedStyle(fijo).position, tablaCorre: wrap.scrollWidth > wrap.clientWidth, bajo44: bs.filter(b => b.getBoundingClientRect().height < 44).length };
  });
  comprueba('los botones de parcial y sección se leen completos', !cel.cortados.length, cel.cortados);
  comprueba('y ocupan el ancho de la tarjeta', cel.anchos.every(a => a >= cel.card - 40), cel);
  comprueba('todos miden 44 px o más de alto', cel.bajo44 === 0, cel.bajo44);
  comprueba('la página no se corre de lado', !cel.deLado);
  comprueba('la tabla se corre de lado y la columna de nombres queda fija', cel.tablaCorre && cel.fijo === 'sticky', cel);
  await pc.close();

  comprueba('ningún error de JavaScript en la página', errores.length === 0, errores);
  await nav.close();
  console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron (' + pasan + ' pasan)' : '\n✓ Notas SACE sin desplegables, con todo a mano y la tabla a la vista (' + pasan + ' comprobaciones)');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
