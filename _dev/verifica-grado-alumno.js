/* ============================================================
   M.E.T.A.S · La alumna encuentra lo de SU grado
   ------------------------------------------------------------
   Medido el 9 de septiembre de 2026, antes de tocar nada, con una alumna
   de 4º que YA había escrito su grado al entrar en su primera misión:

     tarjetas en la lista .......... 67
     las cinco primeras ............ Los Adjetivos · Los Verbos ·
                                     Los Sustantivos · Los Pronombres ·
                                     El Adjetivo Avanzado (de Bachillerato)
     buscar «cuarto» ............... 0 resultados
     buscar «4to» .................. 0 resultados

   Las mismas 67 y en el mismo orden para ella y para uno de 9º. Cuatro de
   los cinco recorridos de la auditoría se atascaron en esa pantalla.

   La lógica —de qué grado es cada misión— vive en `js/grado-alumno.js` y
   se prueba sin navegador con `node _dev/prueba-grado-alumno.js`. Esta
   sonda comprueba lo que solo se ve abriendo la aplicación: que no se le
   pregunte el grado otra vez, que se ORDENE y no se filtre, que **solo se
   rotule lo suyo**, y que el chip no se cuele en el expediente que llega
   al maestro.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-grado-alumno.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { abrir, SIN_SW } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = 'http://localhost:8123';

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

/* El catálogo se cuenta, no se escribe: la misión 68 entra sola. */
const ctx = { window: {}, document: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/data/misiones.js'), 'utf8'), ctx);
vm.runInContext('window.M = MISSIONS;', ctx);
const TOTAL = ctx.window.M.length;

async function pantalla(nav, sembrar) {
  const c = await nav.newContext({ ...SIN_SW, viewport: { width: 393, height: 873 } });
  const pg = await c.newPage();
  if (sembrar) await pg.addInitScript(sembrar);
  await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.renderMissions === 'function');
  await pg.evaluate(() => switchView('view-misiones'));
  await pg.waitForTimeout(350);
  return { c, pg };
}
const mirar = pg => pg.evaluate(() => {
  const cont = document.getElementById('missions-container');
  const sep = [...cont.querySelectorAll('.mis-sep')];
  return {
    tarjetas: cont.querySelectorAll('.mission-card').length,
    rotulos: sep.map(h => h.textContent.replace(/\s+/g, ' ').trim()),
    mias: sep.length ? Number((sep[0].querySelector('b') || {}).textContent || 0) : 0,
    demas: sep.length > 1 ? Number((sep[1].querySelector('b') || {}).textContent || 0) : 0,
    chips: [...document.querySelectorAll('#grado-chips .gr-chip')].map(b => ({
      t: b.textContent.trim(), on: b.classList.contains('active'),
      alto: Math.round(b.getBoundingClientRect().height),
      /* El guardián de siempre: lo que se ve, ¿se puede tocar? Con el matiz
         que ya costó una falsa alarma en los juegos 3D: un chip que se salió
         de SU PROPIA franja —la fila se desliza de lado— no es un botón
         tapado, es uno al que se llega deslizando. Por eso se desliza y se
         vuelve a preguntar antes de acusar; un lienzo derramado seguiría
         encima después de deslizar, y ese sí se caza. */
      recibe: (() => {
        b.parentNode.scrollLeft = b.offsetLeft - 8;
        const r = b.getBoundingClientRect();
        const e = document.elementFromPoint(Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2));
        return !!(e && e.closest('.gr-chip') === b);
      })()
    })),
    primeras: [...cont.querySelectorAll('.mission-card .mc-title')].slice(0, 3).map(x => x.textContent.trim())
  };
});

(async () => {
  console.log('M.E.T.A.S · La alumna encuentra lo de SU grado');
  console.log(`  (el catálogo tiene ${TOTAL} misiones hoy; se cuentan, no se escriben)`);
  const nav = await abrir();

  console.log('\n1 · No se le pregunta el grado otra vez: ya lo escribió');
  let { c, pg } = await pantalla(nav, () => {
    localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({ nombre: 'Ana López', grado: '4to A' }));
  });
  let r = await mirar(pg);
  const c4 = r.chips.find(x => x.t === '4º');
  ok('el chip de 4º sale marcado solo, sin preguntar nada', !!c4 && c4.on, r.chips.map(x => x.t + (x.on ? '✓' : '')));
  ok('hay chips de 4º a 9º y un «Todos»', r.chips.length === 7 && r.chips[6].t === 'Todos', r.chips.map(x => x.t));
  ok('y se pueden tocar: 44 px y nada encima', r.chips.every(x => x.alto >= 44 && x.recibe),
     r.chips.map(x => x.t + ':' + x.alto + (x.recibe ? '' : ' TAPADO')));

  console.log('\n2 · Se ORDENA, nunca se filtra: no desaparece ni una tarjeta');
  ok(`siguen estando las ${TOTAL}`, r.tarjetas === TOTAL, r.tarjetas);
  ok('y los dos montones suman ese total', r.mias + r.demas === TOTAL, { mias: r.mias, demas: r.demas });
  ok('lo suyo va primero, con su rótulo', /Para 4º grado/.test(r.rotulos[0] || ''), r.rotulos);

  console.log('\n3 · Solo se rotula lo SUYO: nada dice «esto es de otro grado»');
  ok('el segundo rótulo no nombra ningún grado',
     !!r.rotulos[1] && !/\d\s*[ºo]|grado|ciclo|cuarto|quinto|sexto|s[eé]ptimo|octavo|noveno/i.test(r.rotulos[1]),
     r.rotulos[1]);
  await c.close();

  console.log('\n4 · Un alumno de 9º ve OTRA lista, no la misma');
  ({ c, pg } = await pantalla(nav, () => {
    localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({ nombre: 'Luis Cruz', grado: '9no B' }));
  }));
  const r9 = await mirar(pg);
  ok('su rótulo dice 9º', /Para 9º grado/.test(r9.rotulos[0] || ''), r9.rotulos);
  ok('y lo primero que ve NO es lo mismo que la de 4º',
     r9.primeras.join('|') !== r.primeras.join('|'), { de4: r.primeras, de9: r9.primeras });
  ok('también las tiene todas delante', r9.tarjetas === TOTAL);
  await c.close();

  console.log('\n5 · El chip manda, y no se mete en el expediente del alumno');
  ({ c, pg } = await pantalla(nav, () => {
    localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({ nombre: 'Ana López', grado: '4to A' }));
  }));
  await pg.click('#grado-chips .gr-chip[data-grado="6"]');
  await pg.waitForTimeout(250);
  let r6 = await mirar(pg);
  ok('tocar 6º reordena la lista', /Para 6º grado/.test(r6.rotulos[0] || ''), r6.rotulos);
  const idIntacta = await pg.evaluate(() => JSON.parse(localStorage.getItem('METAS_ALUMNO_V1')).grado);
  ok('y NO le cambia el grado que el maestro va a recibir', idIntacta === '4to A', idIntacta);

  await pg.click('#grado-chips .gr-chip[data-grado=""]');
  await pg.waitForTimeout(250);
  const rT = await mirar(pg);
  ok('«Todos» quita los rótulos y deja la lista entera', rT.rotulos.length === 0 && rT.tarjetas === TOTAL, rT.rotulos);

  await pg.reload({ waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.renderMissions === 'function');
  await pg.evaluate(() => switchView('view-misiones'));
  await pg.waitForTimeout(350);
  const rR = await mirar(pg);
  ok('y la elección aguanta cerrar la aplicación', rR.rotulos.length === 0 && rR.chips[6].on, rR.chips.map(x => x.t + (x.on ? '✓' : '')));
  await c.close();

  console.log('\n6 · El buscador: «cuarto» daba CERO');
  ({ c, pg } = await pantalla(nav, () => {
    localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({ nombre: 'Ana López', grado: '4to A' }));
  }));
  const de4 = (await mirar(pg)).mias;
  for (const q of ['cuarto', '4to', '4º']) {
    await pg.fill('#search-input', q);
    await pg.waitForTimeout(250);
    const n = await pg.evaluate(() => document.querySelectorAll('#missions-container .mission-card').length);
    ok(`buscar «${q}» encuentra sus ${de4} misiones`, n === de4, n);
  }
  await pg.fill('#search-input', '');
  await pg.waitForTimeout(200);

  console.log('\n7 · Con un filtro de materia puesto, tampoco se esconde nada');
  await pg.click('.pill[data-filter="matemáticas"]');
  await pg.waitForTimeout(300);
  const rm = await mirar(pg);
  ok('la suma de los dos montones es todo lo de la materia', rm.mias + rm.demas === rm.tarjetas,
     { mias: rm.mias, demas: rm.demas, total: rm.tarjetas });
  ok('y lo suyo sigue primero', /Para 4º grado/.test(rm.rotulos[0] || ''), rm.rotulos);
  await c.close();

  await nav.close();
  console.log('\n' + '─'.repeat(52));
  if (fallos) { console.log(`✖ ${fallos} problema(s).`); process.exit(1); }
  console.log('✅ Encuentra lo suyo, y no se le esconde ni se le señala nada.');
})().catch(e => { console.error('✘ La sonda tropezó:', e.message); process.exit(1); });
