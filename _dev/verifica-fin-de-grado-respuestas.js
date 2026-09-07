/* ============================================================
   M.E.T.A.S · La Prueba de Fin de Grado no pierde las respuestas
   ------------------------------------------------------------
   Es la misión insignia —repasa el año entero y evalúa las dos
   materias el mismo día— y perdía el trabajo del alumno de dos
   maneras, las dos reproducidas por un alumno de 6º:

     · marcaba 15 respuestas en Matemáticas, tocaba Español y
       volvía: {marcados: 0, textos: 0};
     · recargaba la página y el examen se regeneraba entero.

   Cien preguntas contestadas a medias en un teléfono prestado,
   borradas por tocar la otra pestaña. Es la definición de
   abandonar.

   Y dos cosas que no estaban en el hallazgo:

   · La prueba OPERATIVA perdía sus 19 cuentas por la misma
     puerta: genEvalOp() corre al abrir la misión y saca la
     forma siguiente. Se comprueba igual.
   · ⚠️ Que al restaurar NO se le devuelvan respuestas de otro
     examen. Las preguntas salen del banco con _pickF, así que
     el día que entre una pregunta nueva —y aquí se publica
     varias veces al día— la Forma 5 ya no arma las mismas
     veinte: pegarle sus respuestas encima sería calificarle
     lo que no contestó, y esa nota va al expediente.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-fin-de-grado-respuestas.js
   ============================================================ */
'use strict';

const { abrir } = require('./lib-navegador');
const BASE = 'http://localhost:8123';
const GRADOS = ['4to', '5to', '6to', '7mo'];

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

/* Lo contestado, tal como lo lee la propia misión al calificar. */
const leerPuestas = pg => pg.evaluate(() => ({
  textos:   [...document.querySelectorAll('#evalOut [data-ecp]')].filter(e => e.value.trim() !== '').length,
  marcados: document.querySelectorAll('#evalOut input[type=radio]:checked').length,
  pareados: [...document.querySelectorAll('#evalOut [data-epr]')].filter(e => e.value !== '').length,
  forma:    (window._evalGradeData || {}).forma,
  materia:  (window._evalGradeData || {}).materia,
}));

/* La operativa es todo campos de escribir: 19 cuentas a lápiz en la pantalla. */
const leerOp = pg => pg.evaluate(() => ({
  escritos: [...document.querySelectorAll('#evalOpOut input')].filter(e => e.value.trim() !== '').length,
  forma:    window._currentEvalOpForm,
}));
const contestarOp = pg => pg.evaluate(() => {
  document.querySelectorAll('#evalOpOut input').forEach((e, i) => {
    e.value = String(i + 1); e.dispatchEvent(new Event('input', { bubbles: true }));
  });
});

/* Contesta lo que haya: es lo que hace el alumno, no lo que espera la sonda. */
const contestar = pg => pg.evaluate(() => {
  document.querySelectorAll('#evalOut [data-ecp]').forEach((e, i) => { e.value = 'respuesta ' + i; e.dispatchEvent(new Event('input', { bubbles: true })); });
  document.querySelectorAll('#evalOut input[type=radio]').forEach((e, i) => {
    if (i % 2 === 0) { e.checked = true; e.dispatchEvent(new Event('change', { bubbles: true })); }
  });
  document.querySelectorAll('#evalOut [data-epr]').forEach(sel => {
    if (sel.options.length > 1) { sel.selectedIndex = 1; sel.dispatchEvent(new Event('change', { bubbles: true })); }
  });
});

async function abrirMision(nav, grado) {
  const ctx = await nav.newContext({ viewport: { width: 412, height: 915 }, isMobile: true, hasTouch: true, locale: 'es-HN' });
  await ctx.route('**/*.supabase.co/**', r => r.abort());
  const pg = await ctx.newPage();
  await pg.goto(`${BASE}/misiones/fin-de-grado-${grado}/fin-de-grado-${grado}.html`, { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.genEval === 'function' && window._evalGradeData);
  await pg.evaluate(() => { document.getElementById('s-evaluacion').classList.add('active'); });
  await pg.waitForTimeout(250);
  return { ctx, pg };
}

(async () => {
  console.log('\n════════ LA PRUEBA DE FIN DE GRADO NO PIERDE NADA ════════\n');
  const nav = await abrir({ args: ['--no-sandbox'] });

  for (const grado of GRADOS) {
    console.log(`── ${grado} ──`);
    const { ctx, pg } = await abrirMision(nav, grado);

    /* El botón dejó de llamar a genEval() y pasó a evalNueva(). De ese
       onclick cuelga _injectFormaSel el selector de Forma, con el que el
       maestro manda a imprimir la MISMA prueba para los 43. Si se despega,
       desaparece sin dar un solo error. */
    ok('el maestro sigue teniendo su selector de Forma',
       await pg.locator('#evalFormaSel').count() > 0);

    await contestar(pg);
    const puestas = await leerPuestas(pg);
    ok('se contestó algo en Matemáticas', puestas.textos + puestas.marcados + puestas.pareados > 0, puestas);

    /* 1 · Ir a Español y volver */
    await pg.evaluate(() => evalSwitchMode('esp'));
    await pg.waitForTimeout(250);
    const enEsp = await leerPuestas(pg);
    ok('en Español el examen sale limpio', enEsp.materia === 'esp' && enEsp.textos === 0, enEsp);

    await pg.evaluate(() => evalSwitchMode('mat'));
    await pg.waitForTimeout(250);
    const vuelta = await leerPuestas(pg);
    ok('al volver a Matemáticas está todo lo suyo',
       vuelta.textos === puestas.textos && vuelta.marcados === puestas.marcados && vuelta.pareados === puestas.pareados,
       { antes: puestas, ahora: vuelta });
    ok('y es la MISMA forma, no otra', vuelta.forma === puestas.forma, { antes: puestas.forma, ahora: vuelta.forma });

    /* 2 · Recargar */
    await pg.reload({ waitUntil: 'domcontentloaded' });
    await pg.waitForFunction(() => typeof window.genEval === 'function' && window._evalGradeData);
    await pg.evaluate(() => { document.getElementById('s-evaluacion').classList.add('active'); });
    await pg.waitForTimeout(400);
    const tras = await leerPuestas(pg);
    ok('tras recargar, el examen sigue siendo el suyo', tras.forma === puestas.forma, { antes: puestas.forma, ahora: tras.forma });
    ok('y sus respuestas siguen puestas',
       tras.textos === puestas.textos && tras.marcados === puestas.marcados,
       { antes: puestas, ahora: tras });

    /* 2-bis · Y si lo que estaba abierto era ESPAÑOL. evalMateria arranca
              siempre en 'mat', así que esta vuelta pasa por evalSwitchMode:
              es otro camino y se rompe aparte. */
    await pg.evaluate(() => evalSwitchMode('esp'));
    await pg.waitForTimeout(250);
    await contestar(pg);
    const esp = await leerPuestas(pg);
    await pg.reload({ waitUntil: 'domcontentloaded' });
    await pg.waitForFunction(() => typeof window.genEval === 'function' && window._evalGradeData);
    await pg.evaluate(() => { document.getElementById('s-evaluacion').classList.add('active'); });
    await pg.waitForTimeout(400);
    const espTras = await leerPuestas(pg);
    ok('si estaba en Español, abre en Español', espTras.materia === 'esp', espTras);
    ok('y lo contestado en Español también está',
       espTras.forma === esp.forma && espTras.textos === esp.textos,
       { antes: esp, ahora: espTras });

    /* Y lo de Matemáticas no se perdió por haber estado en la otra materia. */
    await pg.evaluate(() => evalSwitchMode('mat'));
    await pg.waitForTimeout(300);
    const matSigue = await leerPuestas(pg);
    ok('y lo de Matemáticas sigue esperando en su pestaña',
       matSigue.forma === puestas.forma && matSigue.textos === puestas.textos,
       { antes: puestas, ahora: matSigue });

    /* 3 · «Nueva Evaluación» pregunta antes de borrar */
    let preguntó = false;
    pg.on('dialog', d => { preguntó = true; d.dismiss(); });
    await pg.evaluate(() => evalNueva());
    await pg.waitForTimeout(300);
    ok('«Nueva Evaluación» avisa antes de borrar cien preguntas', preguntó);
    const trasCancelar = await leerPuestas(pg);
    ok('y si se cancela, no se borra nada', trasCancelar.textos === puestas.textos, trasCancelar);

    /* 4 · Y si acepta, sí se genera una nueva y limpia */
    pg.removeAllListeners('dialog');
    pg.on('dialog', d => d.accept());
    await pg.evaluate(() => evalNueva());
    await pg.waitForTimeout(400);
    const nueva = await leerPuestas(pg);
    ok('aceptando, sale un examen nuevo y limpio', nueva.textos === 0 && nueva.forma !== puestas.forma,
       { antes: puestas.forma, ahora: nueva.forma, textos: nueva.textos });

    /* 5 · La OPERATIVA pierde lo mismo, y por la misma puerta: son 19
           cuentas hechas y genEvalOp() corre al abrir la misión. */
    ok('la operativa también tiene su selector de Forma',
       await pg.locator('#evalOpFormaSel').count() > 0);
    await pg.evaluate(() => evalSwitchMode('op'));
    await pg.waitForTimeout(250);
    await contestarOp(pg);
    const op = await leerOp(pg);
    ok('se contestó algo en la operativa', op.escritos > 0, op);

    await pg.reload({ waitUntil: 'domcontentloaded' });
    await pg.waitForFunction(() => typeof window.genEvalOp === 'function' && window._evalOpData);
    await pg.evaluate(() => { document.getElementById('s-evaluacion').classList.add('active'); evalSwitchMode('op'); });
    await pg.waitForTimeout(400);
    const opTras = await leerOp(pg);
    ok('tras recargar, la operativa sigue siendo la suya', opTras.forma === op.forma, { antes: op.forma, ahora: opTras.forma });
    ok('y sus 19 cuentas siguen escritas', opTras.escritos === op.escritos, { antes: op.escritos, ahora: opTras.escritos });

    let preguntóOp = false;
    pg.removeAllListeners('dialog');
    pg.on('dialog', d => { preguntóOp = true; d.dismiss(); });
    await pg.evaluate(() => evalOpNueva());
    await pg.waitForTimeout(300);
    ok('«Nueva Prueba Operativa» también avisa antes de borrar', preguntóOp);
    ok('y cancelando no se borra nada', (await leerOp(pg)).escritos === op.escritos);

    await ctx.close();
    console.log('');
  }

  /* 5 · Lo que no está en el hallazgo, y cuesta más caro que perderlas:
         que no se le peguen sus respuestas encima de OTRAS preguntas. Pasa
         solo el día que entra una pregunta nueva al banco —_pickF saca otras
         cinco con la misma semilla—, y esto se publica varias veces al día.
         Aquí se simula ensuciando la huella, que es justo lo que cambiaría. */
  console.log('── que no se le inventen respuestas ──');
  const { ctx, pg } = await abrirMision(nav, '6to');
  await contestar(pg);
  const orig = await leerPuestas(pg);

  const ensuciar = campo => pg.evaluate(c => {
    const k = Object.keys(localStorage).find(x => /_resp$/.test(x));
    const o = JSON.parse(localStorage.getItem(k));
    o.mat[c] = (c === 'forma') ? (o.mat.forma % 20) + 1 : 'otro-examen';
    localStorage.setItem(k, JSON.stringify(o));
  }, campo);
  const recargar = async () => {
    await pg.reload({ waitUntil: 'domcontentloaded' });
    await pg.waitForFunction(() => typeof window.genEval === 'function' && window._evalGradeData);
    await pg.waitForTimeout(400);
    return leerPuestas(pg);
  };

  await ensuciar('huella');
  const cambiado = await recargar();
  ok('si el examen cambió, NO se le devuelven las respuestas viejas',
     cambiado.textos === 0 && cambiado.marcados === 0, { orig: orig.textos, ahora: cambiado.textos });
  ok('y la pantalla se lo dice, no se le borran en silencio',
     await pg.locator('text=/La prueba cambió/').count() > 0);
  ok('y lo guardado se tira, para que «Nueva Evaluación» no avise de fantasmas',
     await pg.evaluate(() => !evalHayRespuestas()));

  /* Y la forma sola también tiene que bastar: va dentro de la huella. */
  await contestar(pg);
  await ensuciar('forma');
  const otraForma = await recargar();
  ok('con la forma cambiada tampoco se le devuelven', otraForma.textos === 0, otraForma);
  await ctx.close();

  await nav.close();
  console.log('\n' + '─'.repeat(50));
  if (fallos) { console.log(`✖ ${fallos} problema(s): la prueba insignia todavía pierde el trabajo del alumno.`); process.exit(1); }
  console.log('✅ TODO EN VERDE: cambiar de materia y recargar ya no le borran nada.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
