/* ============================================================
   M.E.T.A.S · Ver la pauta no puede dar una nota
   ------------------------------------------------------------
   Es el hallazgo que más dolía de toda la auditoría, y lo
   reprodujo un alumno de 5º sin proponérselo: al lado de
   «🧮 Calificar prueba» hay un «👁 Ver Pauta». Lo tocó,
   aparecieron las 16 respuestas debajo de cada pregunta, las
   copió, calificó, y la pantalla dijo 100/100. Esa nota entró en
   el registro, viajó al maestro y en Rutas la misión pasó a
   «Dominada · 100».

   Lo que costaba de ver es que el aviso al maestro YA ESTABA
   HECHO —el ⚠️ de registro.html y consulta-nube.html— y no se
   disparaba nunca: `pauta_vista` solo se registraba al IMPRIMIR,
   que es lo que hace el maestro, no al abrirla en la pantalla,
   que es lo que hace el alumno.

   Esta sonda hace lo que hizo Kevin y comprueba las cuatro
   cosas que tienen que pasar ahora:

   1. Abrir la pauta EN LA PANTALLA deja rastro (`pauta_vista`).
   2. La nota sacada después se sigue guardando —no se le borra
      nada al alumno— pero NO cuenta como dominar.
   3. Al alumno se le dice en el momento, sin regañarlo.
   4. Y el control que importa: sin abrir la pauta, la nota
      cuenta como siempre. Si esto fallara, el arreglo habría
      roto la evaluación de verdad, que es lo único que no se
      puede romper.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-pauta.js
   ============================================================ */
'use strict';

const { abrir } = require('./lib-navegador');
const BASE = 'http://localhost:8123';
const MISION = '/misiones/2y3ciclo-fracciones/fracciones.html';

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

/* Se identifica al alumno como lo haría él: sin eso el registro no guarda. */
async function preparar(nav) {
  const ctx = await nav.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, locale: 'es-HN' });
  await ctx.route('**/*.supabase.co/**', r => r.abort());
  const pg = await ctx.newPage();
  await pg.addInitScript(() => {
    try {
      localStorage.setItem('METAS_ID_V1', JSON.stringify({
        alumno: 'Kevin Josué Discua', num: '7', grado: '5', seccion: '1',
        docente: 'Prof. Prueba', codigo_aula: 'AULA1', escuela: 'Escuela de prueba'
      }));
    } catch (_) {}
  });
  await pg.goto(BASE + MISION, { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.gradeEval === 'function');
  await pg.waitForTimeout(400);
  return { ctx, pg };
}

const eventos = pg => pg.evaluate(() => {
  try { return JSON.parse(localStorage.getItem('METAS_REGISTRO_V1')) || []; } catch (_) { return []; }
});

/* Rellena la evaluación copiando lo que la pauta enseña, que es exactamente
   lo que hizo el alumno. */
async function copiarDeLaPauta(pg) {
  return pg.evaluate(() => {
    let n = 0;
    document.querySelectorAll('#evalOut .eval-answer').forEach(a => {
      const item = a.closest('.eval-item') || a.parentElement;
      const inp = item && item.querySelector('input[type=text], input:not([type])');
      const txt = (a.textContent || '').replace(/^[^:]*:\s*/, '').trim();
      if (inp && txt) { inp.value = txt; n++; }
    });
    return n;
  });
}

(async () => {
  console.log('\n════════ VER LA PAUTA NO PUEDE DAR UNA NOTA ════════\n');
  const nav = await abrir({ args: ['--no-sandbox'] });

  /* ── Lo que hizo el alumno de 5º ─────────────────────────── */
  console.log('1) Lo que hizo el alumno: mirar la pauta y calificar');
  const a = await preparar(nav);
  await a.pg.evaluate(() => { document.getElementById('s-evaluacion').classList.add('active'); genEval(); });
  await a.pg.waitForTimeout(300);
  await a.pg.evaluate(() => toggleEvalAns());
  await a.pg.waitForTimeout(300);

  const evs1 = await eventos(a.pg);
  const pautas = evs1.filter(e => e.tipo === 'pauta_vista');
  ok('abrir la pauta en la pantalla deja rastro', pautas.length > 0, evs1.map(e => e.tipo));

  const copiadas = await copiarDeLaPauta(a.pg);
  await a.pg.evaluate(() => gradeEval());
  await a.pg.waitForTimeout(400);

  const panel = await a.pg.innerText('#evalAutoResult').catch(() => '');
  ok(`se copiaron respuestas de la pauta (${copiadas}) y calificó`, /Resultado/.test(panel), panel.slice(0, 60));

  const evs2 = await eventos(a.pg);
  const notas = evs2.filter(e => e.tipo === 'evaluacion' && typeof e.nota === 'number');
  ok('la nota se sigue guardando (no se le borra nada al alumno)', notas.length > 0);

  console.log('\n2) Pero no cuenta como dominar');
  const prog = await a.pg.evaluate(() => {
    /* rutasProgress vive en app.js, que la misión no carga: se recalcula aquí
       con la MISMA regla, contra el registro real que acaba de escribirse. */
    const evs = JSON.parse(localStorage.getItem('METAS_REGISTRO_V1')) || [];
    const dia = t => String(t || '').slice(0, 10);
    const pautas = evs.filter(e => e.tipo === 'pauta_vista');
    let best = null, practica = null;
    evs.filter(e => (e.tipo === 'evaluacion' || e.tipo === 'prueba_operativa') && typeof e.nota === 'number')
       .forEach(e => {
         const base = e.base > 0 ? e.base : 100;
         const pct = Math.round((e.nota / base) * 100);
         const vio = pautas.some(p => p.mision === e.mision && p.t < e.t && dia(p.t) === dia(e.t));
         if (vio) { if (practica === null || pct > practica) practica = pct; }
         else if (best === null || pct > best) best = pct;
       });
    return { best, practica };
  });
  ok('la nota con la pauta vista NO entra en «mejor nota»', prog.best === null, prog);
  ok('y sí queda apuntada como práctica', prog.practica !== null, prog);

  console.log('\n3) Y al alumno se le dice, en el momento');
  const aviso = await a.pg.$('#evalAutoResult .metas-practica');
  ok('el panel avisa de que esto es práctica', !!aviso);
  if (aviso) {
    const t = await aviso.innerText();
    ok('sin regañar y diciendo cómo se saca la nota de verdad',
       /práctica/i.test(t) && /sin mirar la pauta/i.test(t), t.slice(0, 90));
    ok('y se ve', await aviso.isVisible());
  }
  await a.ctx.close();

  /* ── El control: sin mirar la pauta, todo sigue igual ─────── */
  console.log('\n4) El control: sin mirar la pauta, la nota cuenta como siempre');
  const b = await preparar(nav);
  await b.pg.evaluate(() => { document.getElementById('s-evaluacion').classList.add('active'); genEval(); });
  await b.pg.waitForTimeout(300);
  await b.pg.evaluate(() => gradeEval());
  await b.pg.waitForTimeout(400);
  const evs3 = await eventos(b.pg);
  ok('no se inventó ninguna pauta vista', evs3.filter(e => e.tipo === 'pauta_vista').length === 0);
  ok('la evaluación se registró', evs3.filter(e => e.tipo === 'evaluacion').length > 0);
  ok('y NO sale el aviso de práctica', !(await b.pg.$('#evalAutoResult .metas-practica')));
  await b.ctx.close();

  await nav.close();
  console.log('\n' + '─'.repeat(50));
  if (fallos) { console.log(`✖ ${fallos} problema(s): copiar la pauta todavía puede dar una nota.`); process.exit(1); }
  console.log('✅ TODO EN VERDE: la pauta se puede mirar, pero eso ya no es una nota.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
