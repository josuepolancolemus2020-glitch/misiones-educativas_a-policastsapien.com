#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · El banco grande, en la página de verdad
   ------------------------------------------------------------
   `verifica-conceptual-banco-grande.js` mide las formas cargando la
   misión en Node, con una página de mentira. Eso dice qué preguntas
   lleva cada forma, pero no que el maestro pueda llegar a ellas. Aquí
   se abre la misión en el navegador y se comprueba, en cada misión que
   trae banco grande:

   · el selector del examen conceptual llega hasta la última forma y lo
     dice a quien no lo ve;
   · tocando el círculo de una forma, de antes o nueva, sale EXACTAMENTE
     la que midió la sonda rápida (así lo que aquella dice vale para la
     página);
   · una forma nueva se contesta en la pantalla y, con todo bien, da
     100; con la selección mal marcada, 75: la clave sigue a las
     opciones barajadas;
   · la hoja impresa de esa forma trae sus veinte preguntas, las
     opciones en el orden de la pantalla y la clave con esas letras;
   · un teléfono que recibe la plantilla nueva y se sirve de lo guardado
     el motor de antes (el que no sabe repartir el banco grande) sigue
     dando sus formas de siempre, sin un error.

     node _dev/servidor-estatico.js            (en otra terminal)
     node _dev/verifica-banco-grande-navegador.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { abrir } = require('./lib-navegador');
const L = require('./lib-formas.js');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
let fallos = 0;
const mal = m => { console.log('  ❌ ' + m); fallos++; };
const bien = m => console.log('  ✅ ' + m);

const { dentro } = L.listarMisiones();
const tieneGrande = slug => {
  const dir = path.join(L.DIR_MISIONES, slug, 'js');
  return fs.readdirSync(dir).filter(f => f.endsWith('.js') && !/html2canvas/.test(f))
    .some(f => /(?:const|let|var)\s+evalCPBankNuevo\s*=/.test(fs.readFileSync(path.join(dir, f), 'utf8')));
};
const lista = dentro.filter(tieneGrande);
const paginaDe = slug => fs.readdirSync(path.join(L.DIR_MISIONES, slug)).find(f => f.endsWith('.html') && !f.startsWith('juego-'));

/* El motor de antes de este cambio, tal como lo tiene guardado un
   teléfono: el de la rama principal. Sin git (o sin esa rama) no hay con
   qué hacer esa prueba, y se dice. */
function motorDeAntes() {
  for (const rama of ['origin/main', 'main']) {
    try {
      const t = execSync('git show ' + rama + ':js/motor-misiones.js', { cwd: L.RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 16 * 1024 * 1024 });
      if (!/_repartoConceptual/.test(t)) return t;
    } catch (e) { /* se prueba la siguiente */ }
  }
  return null;
}

(async () => {
  console.log('\n🧮 El banco grande del examen conceptual, en el navegador\n');
  const nav = await abrir();
  for (const slug of lista) {
    console.log('📘 ' + slug);
    const url = BASE + '/misiones/' + slug + '/' + paginaDe(slug);
    const m = L.cargarMision(slug, 7);
    const deAntes = m.tope, total = m.topeConceptual;
    const medida = n => { m.correr('evalFormNum = ' + n, 'forma pedida'); return m.forma('conceptual', n).dato; };

    const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    page.on('console', c => { if (c.type() === 'error' && !/favicon|font|Failed to load resource/.test(c.text())) errores.push(c.text()); });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    await page.evaluate(() => { const aviso = document.getElementById('metasIdModal'); if (aviso) aviso.remove(); go('s-evaluacion'); });
    await page.waitForTimeout(200);

    /* 1 · el selector */
    const sel = await page.evaluate(() => {
      const e = document.getElementById('evalFormaSel');
      return { formas: e ? e.options.length : 0, rotulo: e ? e.getAttribute('aria-label') : '', grupos: e ? e.parentNode.querySelectorAll('.metas-grupo').length : 0 };
    });
    if (sel.formas !== total || !new RegExp('1 a ' + total).test(sel.rotulo || '') || sel.grupos !== Math.ceil(total / 10))
      mal('el selector del examen conceptual tiene ' + sel.formas + ' formas en ' + sel.grupos + ' grupos («' + sel.rotulo + '») y tendría que llegar a la ' + total);
    else bien('el selector del examen conceptual llega a la Forma ' + total + ' (' + sel.grupos + ' grupos de diez), y lo dice a quien no lo ve');

    /* 2 · cada forma tocada es la que midió la sonda rápida */
    const tocar = async n => {
      await page.evaluate(n => {
        const s = document.getElementById('evalFormaSel');
        s.parentNode.querySelector('.metas-grupo[data-grupo="' + Math.floor((n - 1) / 10) + '"]').click();
        s.querySelector('[data-forma="' + n + '"]').click();
      }, n);
      await page.waitForTimeout(120);
      return page.evaluate(() => ({ forma: window._currentEvalForm, titulo: document.getElementById('eval-screen-title').textContent, dato: JSON.stringify(window._evalPrintData) }));
    };
    const aTocar = [1, deAntes, deAntes + 1, Math.round((deAntes + 1 + total) / 2), total];
    const distintas = [];
    for (const n of aTocar) {
      const v = await tocar(n);
      if (v.forma !== n || !new RegExp('Forma ' + n + '\\b').test(v.titulo) || v.dato !== JSON.stringify(medida(n))) distintas.push(n + ' (salió la ' + v.forma + ', «' + v.titulo + '»)');
    }
    if (distintas.length) mal('en la página no sale lo que midió la sonda rápida en las formas ' + distintas.join(', '));
    else bien('las formas ' + aTocar.join(', ') + ' salen en la página idénticas a las que mide la sonda rápida, pregunta por pregunta');

    /* 3 · una forma nueva se contesta y se califica */
    const nueva = aTocar[3];
    await tocar(nueva);
    const contestar = malaSeleccion => page.evaluate(mala => {
      const d = window._evalPrintData;
      d.cp.forEach((it, i) => { document.querySelector('[data-cp="' + i + '"]').value = it.a; });
      d.tf.forEach((it, i) => { document.querySelector('input[name="tf' + i + '"][value="' + it.a + '"]').checked = true; });
      d.mc.forEach((it, i) => { document.querySelector('input[name="mc' + i + '"][value="' + (mala ? (it.a + 1) % it.o.length : it.a) + '"]').checked = true; });
      d.pr.terms.forEach((it, i) => { document.querySelector('[data-pr="' + i + '"]').value = d.pr.letters[d.pr.shuffledDefs.findIndex(x => x.def === it.def)]; });
      gradeEval();
      const r = (document.getElementById('evalAutoResult').textContent.match(/(\d+)\/100/) || [])[1];
      /* Lo que la pantalla enseña como opción: tiene que ser el orden del dato. */
      const enPantalla = d.mc.map((it, i) => Array.from(document.querySelectorAll('input[name="mc' + i + '"]')).map(x => x.parentNode.textContent.trim()).join('|') === it.o.join('|'));
      return { puntos: Number(r), enPantalla: enPantalla.every(Boolean) };
    }, malaSeleccion);
    const todoBien = await contestar(false), seleccionMal = await contestar(true);
    if (todoBien.puntos !== 100 || seleccionMal.puntos !== 75 || !todoBien.enPantalla)
      mal('la Forma ' + nueva + ' contestada bien da ' + todoBien.puntos + '/100 y con la selección mal marcada ' + seleccionMal.puntos + '/100 (se esperaba 100 y 75)' + (todoBien.enPantalla ? '' : '; las opciones de la pantalla no van en el orden de la clave'));
    else bien('la Forma ' + nueva + ' se contesta en la pantalla: todo bien da 100 y con la selección mal marcada 75, así que la clave sigue a las opciones barajadas');

    /* 4 · la hoja impresa de esa forma */
    await page.evaluate(() => { window.__hoja = ''; window.open = () => ({ document: { write: t => { window.__hoja += t; }, close() {} }, print() {}, focus() {}, close() {} }); printEval(); });
    const hoja = await page.evaluate(() => {
      const d = window._evalPrintData, caja = document.createElement('div');
      caja.innerHTML = window.__hoja.replace(/<style[\s\S]*?<\/style>/g, '');
      const texto = caja.textContent.replace(/\s+/g, ' ');
      const plano = t => { const x = document.createElement('div'); x.innerHTML = t; return x.textContent.replace(/\s+/g, ' ').trim(); };
      const faltan = [];
      d.cp.forEach(it => { if (!it.q.split('___').every(p => texto.includes(plano(p)))) faltan.push(it.k); });
      d.tf.forEach(it => { if (!texto.includes(plano(it.q))) faltan.push(it.k); });
      d.mc.forEach(it => { if (!texto.includes(plano(it.q)) || !it.o.every(o => texto.includes(plano(o)))) faltan.push(it.k); });
      d.pr.terms.forEach(it => { if (!texto.includes(plano(it.term)) || !texto.includes(plano(it.def))) faltan.push(it.k); });
      /* La clave rápida: de la 11 a la 15, el círculo relleno es la letra correcta. */
      const filas = Array.from(caja.querySelectorAll('.zg-row'));
      const clave = d.mc.map((it, i) => {
        const fila = filas.find(f => f.querySelector('.zg-n').textContent.trim() === String(i + 11));
        return fila ? Array.from(fila.querySelectorAll('.zg-c')).findIndex(c => c.classList.contains('zg-fill')) === it.a : false;
      });
      return { forma: (window.__hoja.match(/Forma (\d+)/) || [])[1], faltan, clave: clave.every(Boolean) };
    });
    if (Number(hoja.forma) !== nueva || hoja.faltan.length || !hoja.clave)
      mal('la hoja impresa de la Forma ' + nueva + ' dice «Forma ' + hoja.forma + '»' + (hoja.faltan.length ? ', le faltan ' + hoja.faltan.join(', ') : '') + (hoja.clave ? '' : ' y su clave no marca la letra correcta de la selección'));
    else bien('la hoja impresa de la Forma ' + nueva + ' trae sus veinte preguntas y la clave marca la letra correcta de cada selección');

    if (errores.length) mal('errores en la página: ' + errores.slice(0, 3).join(' | '));
    else bien('sin errores en la página');
    await ctx.close();

    /* 5 · con el motor de antes guardado en el teléfono */
    const viejo = motorDeAntes();
    if (!viejo) console.log('  ⚠️  no se pudo leer el motor de antes (git show origin/main): la prueba del teléfono con lo guardado no se hizo');
    else {
      const ctx2 = await nav.newContext({ viewport: { width: 390, height: 844 } });
      const p2 = await ctx2.newPage();
      const err2 = [];
      p2.on('pageerror', e => err2.push(String(e)));
      await p2.route(/\/js\/motor-misiones\.js(\?.*)?$/, r => r.fulfill({ status: 200, contentType: 'application/javascript; charset=utf-8', body: viejo }));
      await p2.goto(url, { waitUntil: 'domcontentloaded' });
      await p2.waitForTimeout(800);
      const v = await p2.evaluate(() => {
        const aviso = document.getElementById('metasIdModal'); if (aviso) aviso.remove();
        go('s-evaluacion'); genEval();
        const e = document.getElementById('evalFormaSel');
        return { formas: e ? e.options.length : 0, tope: EVAL_FORMAS, forma: window._currentEvalForm, preguntas: window._evalPrintData ? window._evalPrintData.cp.length + window._evalPrintData.tf.length + window._evalPrintData.mc.length + window._evalPrintData.pr.terms.length : 0, viejo: typeof _repartoConceptual === 'undefined' };
      });
      if (!v.viejo) mal('la prueba del motor de antes no llegó a servirlo');
      else if (v.formas !== v.tope || v.preguntas !== 20 || err2.length) mal('con el motor de antes guardado ofrece ' + v.formas + ' formas (se esperaban las ' + v.tope + ' de siempre), la forma generada trae ' + v.preguntas + ' preguntas' + (err2.length ? ' y hay errores: ' + err2[0] : ''));
      else bien('con el motor de antes guardado en el teléfono, sigue dando sus ' + v.tope + ' formas de siempre y sin un error');
      await ctx2.close();
    }
    console.log('');
  }
  await nav.close();
  if (!lista.length) console.log('  Ninguna misión trae banco grande todavía.\n');
  console.log((fallos ? '❌ ' : '✅ ') + fallos + ' fallo(s) · ' + lista.length + ' misión(es) con banco grande\n');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ ' + (e && e.stack || e)); process.exit(1); });
