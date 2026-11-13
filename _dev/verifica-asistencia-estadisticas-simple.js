/* ═══════════════════════════════════════════════════════════════
   📋📈 ASISTENCIA Y ESTADÍSTICAS SE ENTIENDEN SIN LEER (v505)

   Mismo criterio que Notas SACE (v504): las cajas amarillas de
   instrucciones pasaron a «ⓘ», el alumno de Estadísticas se elige con
   botones y no con una lista desplegable, y «Marcar como de prueba» va
   en Herramientas. Esta sonda falla si se vuelve atrás o si algo se
   perdió por el camino:

   · ni <select> ni <details> en las dos pestañas;
   · cada botón de antes sigue y hace lo mismo (‹ ›, elegir alumno,
     imprimir, de prueba, fecha, meses, día/mes, revisar, buzón);
   · antes de los alumnos del pase de lista no hay caja de instrucciones;
   · la ayuda se abre sola una vez, con 3 pasos de 12 palabras o menos;
   · el veredicto del año cuenta la recuperación, como la boleta;
   · en celular la página no se corre de lado;
   · y ninguna nota ni falta cambia por pasearse.

   Uso:
     node _dev/servidor-estatico.js       (en otra terminal)
     node _dev/verifica-asistencia-estadisticas-simple.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { abrir, SIN_SW } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
let fallos = 0, pasan = 0;
const comprueba = (m, c, extra) => {
  if (c) { pasan++; console.log('  ✅ ' + m); }
  else { fallos++; console.log('  ❌ ' + m + (extra !== undefined ? '  ' + JSON.stringify(extra).slice(0, 400) : '')); }
};

const MATS = ['Español', 'Matemáticas', 'Ciencias Naturales', 'Ciencias Sociales'];
/* 12 alumnos con el año cerrado. #3 reprueba Matemáticas (62) y la aprueba
   en recuperación (75), como Balloteth; #4 reprueba y no la recupera. */
function sembrado() {
  const lista = Array.from({ length: 12 }, (_, i) => ({ num: i + 1, nombre: 'Alumno' + (i + 1) + ' Apellido', sexo: i % 2 ? 'M' : 'F' }));
  const notas = { I: {}, II: {}, III: {}, IV: {} };
  ['I', 'II', 'III', 'IV'].forEach(p => MATS.forEach(m => {
    notas[p][m] = {};
    lista.forEach(a => { notas[p][m][a.num] = (m === 'Matemáticas' && (a.num === 3 || a.num === 4)) ? 62 : 80 + (a.num % 10); });
  }));
  return { v: 2, activo: 'G1', grupos: [{ id: 'G1', grado: '6', seccion: '1', escuela: 'ESC. DE PRUEBA', materias: MATS, lista,
    colectas: [], notas, recuperacion: { 'Matemáticas': { 3: 75 } }, boleta: { parcialFechas: {} },
    asistencia: [{ f: '2026-11-10', aus: { 2: 'A', 5: 'E' } }, { f: '2026-11-11', aus: { 2: 'A' } }],
    controles: [], bitacora: [], lectura: [], convocatorias: [] }] };
}

(async () => {
  const nav = await abrir();
  const errores = [];
  const pagina = async (vp, extra) => {
    const pg = await nav.newPage({ ...SIN_SW, viewport: vp });
    pg.on('pageerror', e => errores.push(e.message));
    await pg.route('**/rest/v1/**', r => r.abort('failed'));   /* la nube no se toca */
    if (extra) await pg.addInitScript(extra);
    await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
    await pg.waitForFunction(() => typeof window.renderAdmin === 'function' && typeof window.adRenderEstadisticas === 'function');
    return pg;
  };
  const abrirTab = (pg, tab, llaves) => pg.evaluate(([s, t, ll]) => {
    localStorage.clear();
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(s));
    Object.keys(ll || {}).forEach(k => localStorage.setItem(k, ll[k]));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById('view-admin').classList.add('active');
    _adTab = t; renderAdmin(true); window.scrollTo(0, 0);
  }, [sembrado(), tab, llaves || null]);
  const grupo = pg => pg.evaluate(() => { const g = JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0];
    return JSON.stringify({ n: g.notas, r: g.recuperacion, a: g.asistencia }); });
  const visible = (pg, sel) => pg.evaluate(s => { const e = document.querySelector(s); if (!e) return false;
    const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; }, sel);
  const VISTAS = { METAS_ASIS_AYUDA_VISTA_V1: '1', METAS_EST_AYUDA_VISTA_V1: '1' };

  /* ── 1 · Asistencia ── */
  console.log('\n── 📋 Asistencia ──');
  const pg = await pagina({ width: 1366, height: 768 });
  await abrirTab(pg, 'asis', VISTAS);
  await pg.waitForSelector('#ad-asis-fecha');
  const g0 = await grupo(pg);
  comprueba('ni <select> ni <details>', await pg.$$eval('#ad-tab-body select, #ad-tab-body details', x => x.length) === 0);
  const faltanA = [];
  for (const s of ['#ad-asis-fecha', '#ad-exc-refresh', '#ad-asis-revisar', '[data-mes]', '[data-vista="dia"]', '[data-vista="mes"]',
    '#ad-tab-body .ad-chip[data-num="1"]', '#ad-asis-ayuda']) if (!(await visible(pg, s))) faltanA.push(s);
  comprueba('siguen la fecha, los alumnos, el buzón, los meses, día/mes y «Revisar»', !faltanA.length, faltanA);
  comprueba('antes de los alumnos no hay caja de instrucciones',
    await pg.evaluate(() => { const c = document.querySelector('#ad-tab-body .ad-chips');
      return ![...document.querySelectorAll('#ad-tab-body .pa-optional-hint')].some(h => h.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING); }));
  await pg.click('#ad-asis-ayuda');
  const pasosA = await pg.$$eval('.ad-gen-ov .ad-sace-pasos li', ls => ls.map(l => l.textContent.trim()));
  comprueba('«ⓘ ¿Cómo se pasa lista?» explica los toques en 3 pasos cortos',
    pasosA.length === 3 && pasosA.every(t => t.split(/\s+/).length <= 12) && /Un toque/.test(pasosA.join(' ')), pasosA);
  await pg.keyboard.press('Escape');
  comprueba('Esc la cierra', !(await pg.$('.ad-gen-ov')));
  await pg.fill('#ad-asis-fecha', '2026-11-10');
  await pg.dispatchEvent('#ad-asis-fecha', 'change');
  await pg.waitForTimeout(200);
  comprueba('la cuenta del día es una línea gris, no una caja amarilla',
    /1 ausentes · 📝 1 con excusa/.test(await pg.textContent('#ad-asis-cuenta')) &&
    await pg.$eval('#ad-asis-cuenta', e => !e.classList.contains('pa-optional-hint')));
  await pg.click('[data-vista="dia"]');
  comprueba('«Día por día» sigue y trae su botón de imprimir', await visible(pg, '#ad-asis-print-dias'));
  comprueba('pasearse por Asistencia no cambia nada', await grupo(pg) === g0);

  /* ── 2 · Estadísticas ── */
  console.log('\n── 📈 Estadísticas ──');
  await abrirTab(pg, 'est', VISTAS);
  await pg.waitForSelector('#est-alumno');
  comprueba('ni <select> ni <details>', await pg.$$eval('#ad-tab-body select, #ad-tab-body details', x => x.length) === 0);
  const faltanE = [];
  for (const s of ['#est-prev', '#est-next', '#est-alumno', '#est-prueba', '#est-print-uno', '#est-print-todos', '#est-print-grado',
    '#est-obs', '#est-nube-btn', '#est-ayuda']) if (!(await visible(pg, s))) faltanE.push(s);
  comprueba('siguen ‹ ›, el alumno, imprimir (3), de prueba, la observación y la nube', !faltanE.length, faltanE);
  comprueba('la primera tarjeta ya no tiene cajas amarillas',
    await pg.$$eval('#ad-tab-body .pa-card:first-child .pa-optional-hint', x => x.length) === 0);
  comprueba('«Marcar como de prueba» está en Herramientas',
    await pg.evaluate(() => { const b = document.getElementById('est-prueba'), t = b.closest('.ad-herrs').previousElementSibling;
      return /Herramientas/.test(t.textContent); }));
  const tit = () => pg.textContent('#ad-tab-body .pa-card:nth-child(3) .pa-card-title');
  await pg.click('#est-alumno');
  comprueba('tocar el nombre abre una ventana con un botón por alumno', await pg.$$eval('[data-elegir]', b => b.length) === 12);
  await pg.click('[data-elegir="7"]');
  await pg.waitForTimeout(150);
  comprueba('elegir uno lo muestra', /Alumno7/.test(await tit()) && await pg.$eval('#est-alumno', b => b.value) === '7');
  await pg.click('#est-next');
  comprueba('› pasa al siguiente', /Alumno8/.test(await tit()));
  await pg.click('#est-prev'); await pg.click('#est-prev');
  comprueba('‹ vuelve al anterior', /Alumno6/.test(await tit()));
  await pg.click('#est-alumno');
  await pg.keyboard.press('Escape');
  comprueba('cerrar la ventana sin elegir no cambia de alumno', /Alumno6/.test(await tit()) && !(await pg.$('[data-elegir]')));
  await pg.click('#est-prueba');
  comprueba('«🧪 Marcar como alumno de prueba» lo marca y lo dice en una línea',
    await pg.evaluate(() => adEsPrueba(adLoad().lista.find(a => a.num === 6))) && /Alumno de prueba/.test(await pg.textContent('#ad-tab-body .pa-card:first-child')));
  await pg.click('#est-prueba');
  comprueba('y se puede deshacer', !(await pg.evaluate(() => adEsPrueba(adLoad().lista.find(a => a.num === 6)))));

  /* ── 3 · el veredicto cuenta la recuperación ── */
  console.log('\n── ⚖️ el veredicto del año ──');
  const dec = await pg.evaluate(() => { const d = adLoad();
    return [3, 4, 1].map(n => { const x = estDecision(estSace(d, n)); return { aprueba: x.aprueba, rec: (x.recuperadas || []).length, html: estDecisionHtml(x) }; }); });
  comprueba('#3 reprobó Matemáticas y la aprobó en recuperación: APROBADO EN RECUPERACIÓN',
    dec[0].aprueba && dec[0].rec === 1 && /APROBADO EN RECUPERACIÓN/.test(dec[0].html) && /62 → 75/.test(dec[0].html), dec[0]);
  comprueba('#4 reprobó y no la recuperó: NO APROBADO', !dec[1].aprueba && /NO APROBADO/.test(dec[1].html));
  comprueba('#1 sin materias bajo 70: APROBADO', dec[2].aprueba && dec[2].rec === 0);
  const gr = await pg.evaluate(() => { const g = estDatosGrado(adLoad()); return { ap: g.decs.filter(x => x.aprueba).length, de: g.decs.length }; });
  const rs = await pg.evaluate(() => { const r = ResumenSace.calcular(adLoad(), { corte: '2026-12-31', SL: Object.assign({}, SaceLista, { matriculaFinal: d => d.lista }) }); return { rep: r.reprobados.T, ini: r.escalaGen.I.T }; });
  comprueba('el informe del grado aprueba a 11 de 12, igual que el Resumen final (1 reprobado = 1 Inicial)',
    gr.ap === 11 && gr.de === 12 && rs.rep === 1 && rs.ini === 1, { gr, rs });
  comprueba('pasearse por Estadísticas no cambia notas, recuperación ni faltas', await grupo(pg) === g0);
  await pg.close();

  /* ── 4 · la ayuda, como la ve un maestro (sin navigator.webdriver) ── */
  console.log('\n── la ayuda la primera vez ──');
  const pa = await pagina({ width: 1366, height: 768 }, () => Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }));
  for (const [tab, tituloRe] of [['asis', /pasa lista/], ['est', /Para qué sirve/]]) {
    await abrirTab(pa, tab);
    await pa.waitForTimeout(200);
    const t1 = await pa.$eval('.ad-gen-ov .ad-gen-title', e => e.textContent).catch(() => '');
    comprueba(tab + ': la primera vez se abre sola', tituloRe.test(t1), t1);
    await pa.keyboard.press('Escape');
    await pa.evaluate(() => renderAdmin(true));
    await pa.waitForTimeout(200);
    comprueba(tab + ': la segunda vez ya no', !(await pa.$('.ad-gen-ov')));
  }
  await pa.close();

  /* ── 5 · celular ── */
  console.log('\n── celular de 390 px ──');
  const pc = await pagina({ width: 390, height: 844 });
  for (const tab of ['asis', 'est']) {
    await abrirTab(pc, tab, VISTAS);
    await pc.waitForTimeout(200);
    const m = await pc.evaluate(() => ({ deLado: document.documentElement.scrollWidth > innerWidth,
      chicos: [...document.querySelectorAll('#ad-tab-body .ad-herr, #ad-tab-body .ad-sace-ayuda, #est-alumno')].filter(b => b.getBoundingClientRect().height < 44).length }));
    comprueba(tab + ': la página no se corre de lado y los botones nuevos miden 44 px', !m.deLado && m.chicos === 0, m);
  }
  await pc.close();

  comprueba('ningún error de JavaScript en la página', errores.length === 0, errores);
  await nav.close();
  console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron (' + pasan + ' pasan)' : '\n✓ Asistencia y Estadísticas sin cajas ni desplegables, con todo a mano (' + pasan + ' comprobaciones)');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
