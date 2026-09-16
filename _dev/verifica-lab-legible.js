#!/usr/bin/env node
/* ══════════════════════════════════════════════════════════════════════════
   M.E.T.A.S · El Laboratorio se lee con la misma letra que el resto
   ──────────────────────────────────────────────────────────────────────────
   Medido el 16 de septiembre de 2026 en un teléfono de 360 px, con la letra
   grande puesta como abre toda misión: el párrafo se leía a 20 px y la
   explicación del Laboratorio a 14,1, con botones de 14 px y 33 px de alto.
   La regla que lo causaba (`.lab-asp-info{font-size:0.88rem}`) estaba copiada
   en 35 misiones y el `.lab-btn` en 42, porque el Laboratorio viene con la
   plantilla. Se arregló en UNA hoja, `css/lab-legible.css`, y esta sonda es
   la que impide que una misión nueva —o una copia vieja— vuelva a traer el
   Laboratorio chiquito.

   Qué vigila:

   1. **Del archivo, en TODAS las misiones con Laboratorio** (abrirlas con
      Playwright cuesta minutos y una comprobación así no la corre nadie): que
      enlacen la hoja, que el <link> vaya DESPUÉS del CSS propio de la misión
      —si se cuela antes, la misión vuelve a pisarla sin dar un solo error— y
      que la hoja esté en STATIC_ASSETS de sw.js.

   2. **En el navegador, en tres a propósito distintas**: una de la ruta de
      IA (la del hallazgo), una de programación (su Laboratorio no lleva
      `.lab-asp-info`) y una de matemáticas. Se mide con la letra grande
      puesta y quitada: que la explicación mida lo mismo que el párrafo de al
      lado, que ningún botón baje de 44 px y que nada se salga del teléfono.

   ⚠️ Al medir se ESPERA: la sección entra con una animación de escala y
   medir en el instante de abrirla devuelve 43,1 px donde hay 44. Es la
   misma trampa de las transiciones que ya está escrita en la normativa del
   teclado.

   Los números —cuántas misiones tienen Laboratorio— se cuentan, no se
   escriben: una sonda con el número dentro se pone roja el día que entre
   una misión sin que nada esté roto.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-lab-legible.js
   ══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = process.env.METAS_BASE || 'http://localhost:8123/';
let fallos = 0;
const mal = m => { console.log('  ❌ ' + m); fallos++; };
const bien = m => console.log('  ✅ ' + m);

/* ── 1 · Del archivo ─────────────────────────────────────────────────────── */
const misiones = [];
for (const dir of fs.readdirSync(path.join(RAIZ, 'misiones'))) {
  const carpeta = path.join(RAIZ, 'misiones', dir);
  if (!fs.statSync(carpeta).isDirectory()) continue;
  for (const f of fs.readdirSync(carpeta)) {
    if (!f.endsWith('.html')) continue;
    const html = fs.readFileSync(path.join(carpeta, f), 'utf8');
    if (html.includes('id="lab-display"')) misiones.push({ rel: 'misiones/' + dir + '/' + f, html });
  }
}
console.log(`\n📐 Laboratorio legible · ${misiones.length} misiones con Laboratorio\n`);

let sinHoja = 0, malOrden = 0;
for (const m of misiones) {
  const links = [...m.html.matchAll(/<link[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(x => x[1]);
  const pos = links.findIndex(h => h.endsWith('css/lab-legible.css'));
  if (pos < 0) { sinHoja++; mal(m.rel + ' no enlaza css/lab-legible.css'); continue; }
  /* El CSS propio de la misión es el que NO sale de la carpeta (`css/…`); la
     hoja compartida tiene que ir detrás del último de esos. */
  const ultimoPropio = links.reduce((u, h, i) => (!h.startsWith('../') && !h.startsWith('http') ? i : u), -1);
  if (ultimoPropio > pos) { malOrden++; mal(m.rel + ': lab-legible.css va ANTES del CSS de la misión y la misión la pisa'); }
}
if (!sinHoja) bien(`las ${misiones.length} enlazan la hoja compartida`);
if (!malOrden) bien('en todas el <link> va después del CSS propio de la misión');

const sw = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
if (/'\.\/css\/lab-legible\.css'/.test(sw)) bien('sw.js la precachea en STATIC_ASSETS');
else mal('sw.js no lleva ./css/lab-legible.css en STATIC_ASSETS: sin señal el Laboratorio vuelve a salir chiquito');

/* ── 2 · En el navegador ─────────────────────────────────────────────────── */
const ABRIR = [
  'misiones/1ciclo-que-es-la-ia/que-es-la-ia.html',
  'misiones/2y3ciclo-mi-primer-programa/mi-primer-programa.html',
  'misiones/2y3ciclo-fracciones/fracciones.html',
].filter(r => misiones.some(m => m.rel === r));

(async () => {
  const nav = await abrir({ args: ['--no-sandbox'] });
  for (const rel of ABRIR) {
    const ctx = await nav.newContext({ viewport: { width: 360, height: 640 }, serviceWorkers: 'block' });
    const pg = await ctx.newPage();
    const errores = []; pg.on('pageerror', e => errores.push(e.message));
    await pg.goto(BASE + rel, { waitUntil: 'load' });
    await pg.waitForTimeout(400);
    const nombre = rel.split('/').pop();
    for (const grande of [true, false]) {
      const r = await pg.evaluate(async (grande) => {
        document.body.classList.toggle('letra-grande', grande);
        const caja = document.getElementById('lab-display');
        const sec = caja.closest('.sec');
        const tab = document.querySelector('[data-s="' + sec.id + '"]'); if (tab) tab.click();
        await new Promise(r => setTimeout(r, 700)); /* la animación de entrada */
        const fz = el => el ? parseFloat(getComputedStyle(el).fontSize) : null;
        const btns = [...sec.querySelectorAll('.lab-btn')];
        return {
          p: fz(sec.querySelector('p')),
          info: fz(sec.querySelector('.lab-asp-info')),
          botones: btns.length,
          altoMin: btns.length ? Math.min(...btns.map(b => b.getBoundingClientRect().height)) : null,
          fzBoton: fz(btns[0]),
          seSalen: [...sec.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > 361).length,
        };
      }, grande);
      const modo = grande ? 'letra grande' : 'letra normal';
      if (r.info !== null) {
        if (r.info >= r.p - 0.5) bien(`${nombre} · ${modo}: la explicación mide ${r.info} px y el párrafo ${r.p}`);
        else mal(`${nombre} · ${modo}: la explicación mide ${r.info} px y el párrafo de al lado ${r.p}`);
      }
      if (r.botones && r.altoMin >= 43.5) bien(`${nombre} · ${modo}: ${r.botones} botones, el más bajo de ${Math.round(r.altoMin)} px, letra ${r.fzBoton} px`);
      else mal(`${nombre} · ${modo}: hay un botón de ${r.altoMin} px de alto (la regla son 44)`);
      if (r.seSalen === 0) bien(`${nombre} · ${modo}: nada se sale del teléfono`);
      else mal(`${nombre} · ${modo}: ${r.seSalen} elementos se salen del teléfono de 360 px`);
    }
    if (errores.length) mal(`${nombre}: errores de JS al abrir: ${errores.join(' | ')}`);
    await ctx.close();
  }
  await nav.close();
  console.log(fallos ? `\n❌ ${fallos} fallo(s)\n` : '\n✅ Laboratorio legible en todas.\n');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
