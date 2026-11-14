/* ═══════════════════════════════════════════════════════════════
   📝 ACUMULATIVOS: LAS NOTAS DEL PAPEL, CON EL PROMEDIO SOLO

   El caso que lo pidió: el maestro calificó el Himno en 6º-1 sobre la
   hoja de 📏 Herramientas de evaluación (cinco actividades, cada una
   sobre 100, la final es el promedio) y quiere pasar las notas para que
   el promedio salga solo. Esta sonda lo hace en un teléfono de 360 px
   con un 6º-1 de 43 y comprueba:

   · QUE DE LA HOJA SE LLEGUE A MI AULA con un toque, en la pestaña
     📝 Acumulativos, que va justo antes de 🧮 Notas SACE, con las mismas
     cinco actividades.
   · QUE EL PROMEDIO SEA EL BUENO: 90, 80, 100, 70 y 85 dan 85; con
     notas a medias se divide entre todas las actividades (así lo pidió el
     maestro: la final va subiendo) y dice cuántas faltan.
   · QUE LA HOJA CON NOTAS, que va de captura a WhatsApp, salga sin los
     alumnos que no tienen nada, y con la fecha.
   · QUE UNA NOTA FUERA DE RANGO NO SE GUARDE (150 de un dedo de más).
   · QUE ENTER BAJE por la misma columna.
   · QUE EL RESUMEN DIGA el promedio del grupo y quiénes van bajo 70.
   · QUE SE GUARDE EN EL AULA (para que la sincronización lo lleve) y
     siga ahí después de cerrar la aplicación.
   · QUE LA HOJA IMPRESA salga con las notas puestas.
   · QUE LA LISTA DE COTEJO se marque con ✓ y ✗, no con color solo.
   · QUE NADA SE SALGA del teléfono: la tabla se desliza en su caja.

   Uso:
     node _dev/servidor-estatico.js       (en otra terminal)
     node _dev/verifica-acumulativos.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const { abrir, SIN_SW } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
let fallos = 0;
function comprueba(que, ok, detalle) {
  console.log((ok ? '  ✓ ' : '  ✗ ') + que + (ok || detalle === undefined ? '' : '  → ' + JSON.stringify(detalle)));
  if (!ok) fallos++;
}

function sembrado() {
  const lista = [];
  for (let n = 1; n <= 43; n++) lista.push({ num: n, nombre: 'Alumno de prueba número ' + n, alta: 1 });
  lista[42].prueba = true;
  return { v: 2, activo: 'G1', grupos: [{ id: 'G1', escuela: 'Esc. Francisco Morazán', grado: '6', seccion: '1', lista,
    materias: ['Español', 'Matemáticas', 'Ciencias Sociales'], notas: {}, boleta: { docente: 'Prof. de prueba' } }] };
}

(async () => {
  const nav = await abrir();
  const ctx = await nav.newContext({ ...SIN_SW, viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('pageerror', e => errores.push(e.message));
  await ctx.route('**/rest/v1/**', r => r.abort('failed'));
  await pg.goto(BASE + '/index.html', { waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.heRender === 'function' && typeof window.adRenderAcum === 'function');
  await pg.evaluate(s => {
    localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(s));
    localStorage.removeItem('METAS_INSTRUMENTOS_V1');
    switchView('view-herr-eval');
  }, sembrado());

  console.log('\n── de la hoja a Mi aula ──');
  await pg.click('[data-plant="0"]');
  await pg.waitForSelector('#he-a-acum');
  await pg.click('#he-a-acum');
  await pg.waitForSelector('.ac-tabla');
  comprueba('se abre Mi aula', await pg.evaluate(() => document.getElementById('view-admin').classList.contains('active')));
  const tabs = await pg.$$eval('[data-adtab]', bs => bs.map(b => b.dataset.adtab));
  comprueba('📝 Acumulativos va justo antes de 🧮 Notas SACE', tabs.indexOf('acum') === tabs.indexOf('sace') - 1, tabs);
  comprueba('y es la pestaña abierta', /Acumulativos/.test(await pg.textContent('.pa-otab-active')));
  comprueba('con las cinco actividades del Himno', (await pg.$$('.ac-leyenda li')).length === 5
    && /Cantar el Himno Nacional completo/.test(await pg.textContent('.ac-leyenda')));
  comprueba('42 filas (sin el de prueba)', (await pg.$$('.ac-tabla tbody tr')).length === 42);
  comprueba('Ciencias Sociales elegida', /Ciencias Sociales/.test(await pg.textContent('[data-mat].he-chip-on')));

  console.log('\n── las notas y el promedio ──');
  const celda = (num, col) => `.ac-inp[data-num="${num}"][data-col="${col}"]`;
  const escribe = async (num, notas) => { for (let i = 0; i < notas.length; i++) await pg.fill(celda(num, i), String(notas[i])); };
  await escribe(1, [90, 80, 100, 70, 85]);
  const fin = async num => (await pg.textContent(`[data-fin="${num}"]`)).replace(/\s+/g, ' ').trim();
  comprueba('90, 80, 100, 70 y 85 dan 85', (await fin(1)) === '85', await fin(1));
  await escribe(2, [60, 70, 65]);
  comprueba('con tres de cinco se divide entre las cinco: 39 y «faltan 2»', /^39 faltan 2$/.test(await fin(2)), await fin(2));
  comprueba('sin notas, una raya (no un cero)', (await fin(4)) === '—', await fin(4));
  await escribe(3, [50, 60, 55, 65, 50]);
  comprueba('bajo 70 se marca con ↓, no solo con color', /^56 ↓$/.test(await fin(3)), await fin(3));

  await pg.fill(celda(5, 0), '150');
  comprueba('150 se marca como fuera de rango', await pg.$eval(celda(5, 0), i => i.classList.contains('ac-malo')));
  const guardado = () => pg.evaluate(() => JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].acumulativos[0]);
  let g = await guardado();
  comprueba('y no se guarda', !((g.notas['5'] || {}).c1), g.notas['5']);
  await pg.fill(celda(5, 0), '');

  await pg.focus(celda(6, 1));
  await pg.keyboard.type('77');
  await pg.keyboard.press('Enter');
  comprueba('Enter baja a la misma actividad del siguiente alumno',
    await pg.evaluate(() => document.activeElement.dataset.num + '/' + document.activeElement.dataset.col) === '7/1');

  /* las flechas, como en una hoja de cálculo (lo pidió el maestro que
     pasa las notas en la computadora) */
  const donde = () => pg.evaluate(() => document.activeElement.dataset.num + '/' + document.activeElement.dataset.col);
  await pg.focus(celda(8, 2));
  await pg.keyboard.press('ArrowDown');
  comprueba('flecha abajo: el siguiente alumno', await donde() === '9/2', await donde());
  await pg.keyboard.press('ArrowUp');
  comprueba('flecha arriba: el de antes', await donde() === '8/2', await donde());
  await pg.keyboard.press('ArrowLeft');
  comprueba('flecha izquierda: la actividad de antes', await donde() === '8/1', await donde());
  await pg.keyboard.press('ArrowRight');
  comprueba('flecha derecha: la siguiente', await donde() === '8/2', await donde());
  await pg.keyboard.type('88');
  await pg.keyboard.press('ArrowLeft');
  comprueba('con el cursor dentro del número, la flecha se queda a corregir la cifra', await donde() === '8/2', await donde());
  await pg.fill(celda(8, 2), '');

  const res = (await pg.textContent('#ac-resumen')).replace(/\s+/g, ' ');
  comprueba('el resumen: 2 de 42 completos, promedio 71, Nº 3 bajo 70',
    /2 de 42 con todas sus notas/.test(res) && /Promedio del grupo: 71/.test(res) && /1 bajo 70: Nº 3/.test(res), res);

  g = await guardado();
  comprueba('se guarda en el aula, por número de lista y actividad',
    g.notas['1'].c1 === 90 && g.notas['1'].c5 === 85 && g.notas['6'].c2 === 77 && g.parcial && g.id, g.notas['1']);
  const ancho = await pg.evaluate(() => document.querySelector('#view-admin .view-scroll').scrollWidth);
  comprueba('nada se sale de los 360 px (la tabla se desliza en su caja)', ancho <= 360, ancho);
  const chicos = await pg.$$eval('#ad-tab-body button, #ad-tab-body input', bs => bs.filter(b => b.offsetParent)
    .map(b => b.getBoundingClientRect()).filter(r => r.height < 44).length);
  comprueba('lo que se toca mide 44 px de alto', chicos === 0, chicos);

  console.log('\n── otra asignatura ──');
  await pg.click('#ac-otra-mat');
  await pg.waitForSelector('#mdlg-ok');
  await pg.fill('#mdlg-inp', 'Formación Ciudadana');
  await pg.click('#mdlg-ok');
  await pg.waitForSelector('.ac-tabla');
  comprueba('se puede escribir otra asignatura y queda elegida',
    /Formación Ciudadana/.test(await pg.textContent('[data-mat].he-chip-on')));
  comprueba('sin tocar las materias del grupo (las de Notas SACE)', await pg.evaluate(() =>
    !JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].materias.includes('Formación Ciudadana')));
  comprueba('y las notas siguen ahí', (await fin(1)) === '85', await fin(1));

  await pg.fill('#ac-fecha', '2026-11-13');
  await pg.dispatchEvent('#ac-fecha', 'change');
  await pg.waitForSelector('.ac-tabla');
  comprueba('la fecha se guarda', await pg.evaluate(() =>
    JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].acumulativos[0].fecha) === '2026-11-13');

  console.log('\n── en papel ──');
  const [hoja] = await Promise.all([pg.waitForEvent('popup'), pg.click('#ac-imprimir')]);
  await hoja.waitForLoadState('load');
  const fila1 = await hoja.$$eval('.v-solo .v-una tbody tr:first-child td', ts => ts.map(t => t.textContent.trim()));
  comprueba('la hoja sale con las notas y la final', JSON.stringify(fila1.slice(2)) === '["90","80","100","70","85","85"]', fila1);
  const fila2 = await hoja.$$eval('.v-solo .v-una tbody tr:nth-child(2) td', ts => ts.map(t => t.textContent.trim()));
  comprueba('y la incompleta lo dice', fila2[7] === '39 (faltan 2)', fila2[7]);
  const visibles = () => hoja.$$eval('.hoja', hs => hs.filter(h => h.offsetParent)[0].querySelectorAll('tbody tr').length);
  comprueba('sin los alumnos que no tienen ninguna nota (4 de 42)', await visibles() === 4, await visibles());
  comprueba('y lo dice en el encabezado', /Alumnos con nota: 4 de 42/.test(await hoja.textContent('.v-solo .v-una .enc')));
  comprueba('la fecha sale escrita', /2026/.test(await hoja.textContent('.v-solo .v-una .enc')));
  await hoja.click('#he-todos');
  comprueba('un botón los devuelve a todos para el papel', await visibles() === 42, await visibles());
  await hoja.close();

  console.log('\n── después de cerrar la aplicación ──');
  await pg.reload({ waitUntil: 'domcontentloaded' });
  await pg.waitForFunction(() => typeof window.adRenderAcum === 'function');
  await pg.evaluate(() => { switchView('view-admin'); _adTab = 'acum'; renderAdmin(true); });
  await pg.waitForSelector('[data-acid]');
  comprueba('el acumulativo sigue en la lista, en su parcial', /Evaluación del Himno Nacional/.test(await pg.textContent('#ad-tab-body'))
    && /I parcial/.test(await pg.textContent('#ad-tab-body')));
  await pg.click('[data-acid]');
  await pg.waitForSelector('.ac-tabla');
  comprueba('con sus notas', (await pg.inputValue(celda(1, 2))) === '100' && (await fin(1)) === '85');

  console.log('\n── lista de cotejo ──');
  await pg.click('#ac-volver');
  await pg.click('#ac-nuevo');
  await pg.click('[data-plant="4"]');   /* trabajo en equipo */
  await pg.waitForSelector('.ac-cot');
  const cot = '.ac-cot[data-num="1"][data-cid="c1"]';
  await pg.click(cot);
  comprueba('un toque: ✓', (await pg.textContent(cot)) === '✓');
  await pg.click(cot);
  comprueba('otro: ✗', (await pg.textContent(cot)) === '✗');
  await pg.click('.ac-cot[data-num="1"][data-cid="c2"]');
  comprueba('la final cuenta los logrados: 1 y faltan 3', /^1 faltan 3$/.test(await fin(1)), await fin(1));

  console.log('\n── borrar pregunta antes ──');
  await pg.click('#ac-borrar');
  await pg.waitForSelector('#mdlg-ok');
  await pg.click('#mdlg-ok');
  await pg.waitForTimeout(200);
  comprueba('queda solo el del Himno', await pg.evaluate(() =>
    JSON.parse(localStorage.getItem('METAS_ADMIN_V1')).grupos[0].acumulativos.length) === 1);

  comprueba('sin errores en la página', !errores.length, errores);
  await nav.close();
  console.log(fallos ? `\n✗ ${fallos} fallo(s)` : '\n✓ Todo bien');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
