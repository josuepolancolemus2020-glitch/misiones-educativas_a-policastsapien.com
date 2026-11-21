#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · La Máquina Clasificadora de Los Sustantivos no sale vacía
   ------------------------------------------------------------
   El widget-clasificador solo se armaba si el alumno entraba por los
   dos botones que llaman a maqEnsureInit(); el arranque de la misión
   nunca lo pedía. Quien llegaba a «Máquina» por otro camino
   (go('s-maquina') a secas) encontraba la tarjeta con el título y nada
   debajo: ni palabra, ni cajas, ni botones para clasificar.

   Aquí se abre la misión, se va a la sección SIN tocar esos botones y
   se pide lo que el alumno necesita para jugar:
     1. una palabra en la cinta y la pregunta de su eje;
     2. las cuatro cajas (Propio, Común, Abstracto, Concreto);
     3. dos botones activos, los del eje de esa palabra, y que al
        tocar el correcto la máquina lo cuente.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-clasificador-sustantivos-navegador.js
   ============================================================ */
'use strict';

const { abrir } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const RUTA = '/misiones/2y3ciclo-sustantivos/sustantivos-II-III-ciclo-basica.html';

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

(async () => {
  const nav = await abrir();
  const page = await nav.newPage({ viewport: { width: 390, height: 780 } });
  const errores = [];
  page.on('pageerror', e => errores.push(String(e)));

  await page.goto(BASE + RUTA, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  console.log('\n⚙️  La Máquina Clasificadora, entrando sin sus botones');
  /* El aviso de «¡Hola, explorador!» tapa la pantalla la primera vez; se
     quita como en verifica-banco-grande-navegador, para poder tocar. */
  await page.evaluate(() => { const aviso = document.getElementById('metasIdModal'); if (aviso) aviso.remove(); go('s-maquina'); });
  /* La palabra entra en la cinta con una animación y los botones se
     encienden al terminar: se espera a que haya uno activo. */
  await page.waitForFunction(() =>
    [...document.querySelectorAll('#widget-clasificador .maq-btn')].some(b => !b.disabled), null, { timeout: 5000 }).catch(() => {});

  const m = await page.evaluate(() => {
    const h = document.getElementById('widget-clasificador');
    const txt = s => { const e = h && h.querySelector(s); return e ? e.textContent.trim() : ''; };
    const visibles = h ? [...h.querySelectorAll('.maq-btn')].filter(b => b.offsetParent !== null) : [];
    return {
      hijos: h ? h.children.length : -1,
      palabra: txt('#maqChipWord'),
      eje: txt('#maqAxisLabel'),
      cajas: h ? [...h.querySelectorAll('.maq-bin-label')].map(e => e.textContent.trim()) : [],
      activos: visibles.filter(b => !b.disabled).map(b => b.dataset.type)
    };
  });

  ok('el widget tiene contenido', m.hijos > 0, m.hijos);
  ok('hay una palabra en la cinta', m.palabra.length > 0, m.palabra);
  ok('se dice qué se pregunta de ella', /\?$/.test(m.eje), m.eje);
  ok('están las cuatro cajas', ['Propio', 'Común', 'Abstracto', 'Concreto'].every(c => m.cajas.includes(c)), m.cajas);
  ok('hay dos botones para clasificar', m.activos.length === 2, m.activos);

  /* Tocar la respuesta correcta tiene que sumar: si el widget está pintado
     pero no responde, para el alumno sigue estando vacío. */
  const tipo = await page.evaluate(() => maqQueue[maqIdx] && maqQueue[maqIdx].type);
  if (tipo) {
    await page.click(`#widget-clasificador .maq-btn[data-type="${tipo}"]`);
    await page.waitForTimeout(300);
    const correctas = await page.textContent('#maqOk');
    ok('al clasificar bien, la máquina lo cuenta', correctas.trim() === '1', correctas);
  } else ok('hay palabra en la cola para clasificar', false, tipo);

  ok('sin errores en la consola', errores.length === 0, errores.slice(0, 3));

  await nav.close();
  console.log(`\n${fallos ? '❌' : '✅'} ${fallos} fallo(s)\n`);
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ ' + e.message); process.exit(1); });
