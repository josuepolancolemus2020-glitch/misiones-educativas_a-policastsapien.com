#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · La Evaluación Final en la pantalla, limpia
   ------------------------------------------------------------
   Debajo del título del examen había un párrafo de instrucciones
   («Copia el examen en tu cuaderno…») que el alumno ya no necesita: el
   examen se resuelve en la pantalla y los botones dicen lo que hacen.
   Se quitó, el bloque de formas quedó centrado y el espacio de
   «Completar» pasó de caja de formulario a raya gruesa, como en la hoja.
   Esto vigila, en el teléfono y en la computadora:

   · que bajo el título no vuelva el párrafo y que, ya generado, el
     título diga «Evaluación Final · Forma N · <misión>»;
   · que «Elige la forma», las pastillas, los círculos y los botones
     estén centrados en la tarjeta;
   · que el espacio de «Completar» sea solo una raya de 2 a 3 px, oscura,
     sin caja ni fondo, y que se siga escribiendo y calificando: la
     respuesta buena queda marcada como buena y la mala como mala.

   La hoja impresa sale de otra ventana (printEval) y no se mira aquí.

     node _dev/servidor-estatico.js                    (en otra terminal)
     node _dev/verifica-examen-pantalla.js                  → las de siempre
     node _dev/verifica-examen-pantalla.js --todas          → las 80
     node _dev/verifica-examen-pantalla.js <carpeta> …      → esas
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const DIR = path.join(__dirname, '..', 'misiones');
const DE_SIEMPRE = ['2y3ciclo-geografia-de-honduras', '2y3ciclo-la-celula', '2y3ciclo-robots-problemas'];

const paginaDe = slug => fs.readdirSync(path.join(DIR, slug)).find(f => f.endsWith('.html') && !f.startsWith('juego-'));
/* Las que tienen Evaluación Final. Fin de grado se llama «Evaluación de
   Repaso» y conserva su párrafo: explica los botones de materia. */
const conFinal = () => fs.readdirSync(DIR).filter(slug => {
  const p = paginaDe(slug);
  return p && /id="eval-screen-title">[^<]*Evaluación Final/.test(fs.readFileSync(path.join(DIR, slug, p), 'utf8'));
}).sort();

const args = process.argv.slice(2);
const lista = args.includes('--todas') ? conFinal() : (args.length ? args : DE_SIEMPRE);

let fallos = 0;
const mal = m => { console.log('  ❌ ' + m); fallos++; };
const bien = m => console.log('  ✅ ' + m);

/* Cuánto se aparta del centro de la tarjeta cada pieza del bloque. */
function medir() {
  const t = document.getElementById('eval-screen-title');
  const card = t.closest('.card') || t.parentNode;
  const cs = getComputedStyle(card), r = card.getBoundingClientRect();
  const centro = (r.left + parseFloat(cs.paddingLeft) + r.right - parseFloat(cs.paddingRight)) / 2;
  const union = els => {
    const rs = els.map(e => e.getBoundingClientRect()).filter(b => b.width > 0);
    if (!rs.length) return null;
    return (Math.min(...rs.map(b => b.left)) + Math.max(...rs.map(b => b.right))) / 2 - centro;
  };
  const tit = document.querySelector('.metas-formas-tit');
  const rango = document.createRange(); rango.selectNodeContents(tit);
  const bt = rango.getBoundingClientRect();
  const sig = t.nextElementSibling;
  return {
    siguiente: sig ? (sig.tagName + '.' + sig.className) : '',
    parrafo: !!(sig && sig.matches('p.eval-desc')),
    tit: (bt.left + bt.right) / 2 - centro,
    grupos: union([...document.querySelectorAll('.metas-grupos:not([hidden]) .metas-grupo')]),
    circulos: union([...document.querySelectorAll('#evalFormaSel .metas-forma-num')]),
    botones: union([...document.querySelectorAll('.eval-controls.metas-botones > *')].filter(e => e.offsetParent))
  };
}

function raya() {
  const i = document.querySelector('#evalOut input.eval-cp-input');
  if (!i) return null;
  const s = getComputedStyle(i);
  const [r, g, b] = (s.borderBottomColor.match(/\d+(\.\d+)?/g) || []).map(Number);
  return {
    arriba: parseFloat(s.borderTopWidth), izq: parseFloat(s.borderLeftWidth), der: parseFloat(s.borderRightWidth),
    abajo: parseFloat(s.borderBottomWidth), estilo: s.borderBottomStyle,
    luz: (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255,
    fondo: s.backgroundColor, radio: s.borderTopLeftRadius,
    alto: i.getBoundingClientRect().height
  };
}

(async () => {
  const nav = await abrir();
  for (const slug of lista) {
    console.log('\n🔵 ' + slug);
    const url = BASE + '/misiones/' + slug + '/' + encodeURIComponent(paginaDe(slug));
    for (const [nombre, vp] of [['teléfono', { width: 360, height: 800 }], ['computadora', { width: 1280, height: 900 }]]) {
      const ctx = await nav.newContext({ viewport: vp });
      const page = await ctx.newPage();
      const errores = [];
      page.on('pageerror', e => errores.push(String(e)));
      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(700);
      await page.evaluate(() => {
        const aviso = document.getElementById('metasIdModal'); if (aviso) aviso.remove();
        if (typeof go === 'function') go('s-evaluacion');
        if (typeof evalSwitchMode === 'function' && document.getElementById('evalModeBtnConcept')) evalSwitchMode('concept');
      });
      await page.waitForTimeout(150);
      /* Primero un toque de verdad (pointerdown): antes de él,
         js/estrella-ganada.js ya calla toda fiesta, y la prueba no
         diría nada. Luego se cuenta el confeti que cae al elegir forma. */
      const confeti = await page.evaluate(async () => {
        document.dispatchEvent(new Event('pointerdown', { bubbles: true }));
        let n = 0;
        new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(x => { if (x.classList && /confet/i.test(x.className)) n++; })))
          .observe(document.body, { childList: true, subtree: true });
        const sel = document.getElementById('evalFormaSel');
        sel.parentNode.querySelector('.metas-grupo[data-grupo="0"]').click();
        sel.querySelector('[data-forma="5"]').click();
        await new Promise(r => setTimeout(r, 100));
        document.querySelector('[onclick*="genEval()"]').click();
        await new Promise(r => setTimeout(r, 150));
        return n;
      });

      const m = await page.evaluate(medir);
      const titulo = await page.evaluate(() => document.getElementById('eval-screen-title').textContent.trim());
      if (m.parrafo) mal(nombre + ': bajo el título sigue el párrafo de instrucciones');
      else if (!/Evaluación Final · Forma \d+/.test(titulo)) mal(nombre + ': el título dice «' + titulo + '»');
      else bien(nombre + ': bajo «' + titulo + '» no hay párrafo (sigue ' + m.siguiente + ')');
      /* Unas misiones de Matemáticas nunca llevaron el nombre en el título;
         se anota para quien lo quiera unificar, pero no es de esta sonda. */
      if (!/Forma \d+ · \S/.test(titulo)) console.log('  · ' + nombre + ': el título no lleva el nombre de la misión');

      if (confeti) mal(nombre + ': al elegir la forma y al tocar «Nueva» cayeron ' + confeti + ' papelitos de confeti');
      else bien(nombre + ': elegir la forma y tocar «Nueva» no lanzan confeti');

      const lejos = ['tit', 'grupos', 'circulos', 'botones'].filter(k => m[k] !== null && Math.abs(m[k]) > 3);
      if (lejos.length) mal(nombre + ': descentrado ' + lejos.map(k => k + ' ' + m[k].toFixed(1) + ' px').join(', '));
      else bien(nombre + ': «Elige la forma», pastillas, círculos y botones centrados (±3 px)');

      const r = await page.evaluate(raya);
      if (!r) mal(nombre + ': no hay espacio de «Completar» en el examen');
      else if (r.arriba || r.izq || r.der || r.abajo < 2 || r.abajo > 3 || r.estilo !== 'solid' || r.luz > 0.4 || r.fondo !== 'rgba(0, 0, 0, 0)' || parseFloat(r.radio))
        mal(nombre + ': el espacio de «Completar» no es una raya: ' + JSON.stringify(r));
      else bien(nombre + ': «Completar» es una raya de ' + r.abajo + ' px, sin caja ni fondo, de ' + Math.round(r.alto) + ' px de alto');

      /* Se escribe la respuesta de la pauta y se califica; luego una mala. */
      const nota = await page.evaluate(() => {
        const d = window._evalPrintData, i = document.querySelector('#evalOut input.eval-cp-input');
        if (!d || !d.cp || !d.cp[0] || !i || typeof gradeEval !== 'function') return null;
        const uno = document.querySelector('#evalOut [data-cp="0"]') || i;
        const pon = v => { uno.value = v; uno.dispatchEvent(new Event('input', { bubbles: true })); gradeEval(); return uno.className; };
        return { buena: pon(String(d.cp[0].a)), mala: pon('zzqx') };
      });
      if (nota === null) console.log('  · ' + nombre + ': la misión no expone la pauta de «Completar»; no se califica aquí');
      else if (!/eval-input-ok/.test(nota.buena) || !/eval-input-no/.test(nota.mala)) mal(nombre + ': al calificar «Completar» quedó «' + nota.buena + '» con la buena y «' + nota.mala + '» con la mala');
      else bien(nombre + ': se escribe en la raya y se califica: la buena queda buena y la mala, mala');

      if (errores.length) mal(nombre + ': errores en la consola: ' + errores.join(' | '));
      await ctx.close();
    }
  }
  await nav.close();
  if (fallos) { console.log('\n❌ ' + fallos + ' fallo(s).'); process.exit(1); }
  console.log('\n✅ La Evaluación Final limpia en la pantalla, en ' + lista.length + ' misiones.');
})().catch(e => { console.error(e); process.exit(1); });
