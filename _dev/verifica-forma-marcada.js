#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · El círculo marcado es la forma del título
   ------------------------------------------------------------
   El selector de forma era un desplegable con dos defectos que el
   maestro veía: al recargar enseñaba «Forma 1» aunque la guardada fuera
   otra, y después de generar la Forma 4 enseñaba la 5, así que el título
   decía una forma y el selector otra. Ahora son pastillas de grupos de
   diez y una fila de círculos (js/motor-misiones.js), y esto vigila que
   el círculo marcado, el título y la forma generada sean siempre la
   misma, en las tres pruebas que tenga cada misión:

   · al tocar un círculo de otro grupo se genera esa forma y queda marcada;
   · al tocar «Nueva» queda marcada la forma nueva, la del título;
   · mirar otro grupo no cambia la forma, y al generar se vuelve a abrir
     el grupo de la generada;
   · al recargar, el círculo marcado es la forma que la misión guardó, su
     grupo es el abierto, y «Nueva» genera justo esa;
   · en el teléfono va una sola fila de diez, cada círculo da al menos
     32 × 32 al dedo y la página no se corre de lado;
   · al imprimir no salen ni los círculos ni los botones.

     node _dev/servidor-estatico.js            (en otra terminal)
     node _dev/verifica-forma-marcada.js                → las de siempre
     node _dev/verifica-forma-marcada.js <carpeta> …    → esas
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const DIR = path.join(__dirname, '..', 'misiones');
/* Las tres que se piden siempre (conceptual y crítica) y una con prueba
   operativa, para que las tres pruebas queden medidas. */
const DE_SIEMPRE = ['2y3ciclo-la-celula', '2y3ciclo-robots-problemas', '2y3ciclo-desastres-naturales', '2y3ciclo-division-decimales'];
const lista = process.argv.slice(2).length ? process.argv.slice(2) : DE_SIEMPRE;

let fallos = 0;
const mal = m => { console.log('  ❌ ' + m); fallos++; };
const bien = m => console.log('  ✅ ' + m);

const PRUEBAS = [
  { nombre: 'conceptual', sel: 'evalFormaSel', titulo: 'eval-screen-title', modo: 'concept', gen: 'genEval' },
  { nombre: 'operativa', sel: 'evalOpFormaSel', titulo: 'evalop-screen-title', modo: 'op', gen: 'genEvalOp' },
  { nombre: 'crítica', sel: 'evalCritFormaSel', titulo: 'evalcrit-screen-title', modo: 'crit', gen: 'genEvalCrit' }
];

const paginaDe = slug => fs.readdirSync(path.join(DIR, slug)).find(f => f.endsWith('.html') && !f.startsWith('juego-'));

/* Todo lo que se mira de un selector, en un solo viaje al navegador. La
   forma del título se lee con o sin «R-» (la Forma R adaptada). */
function mirar(P) {
  const sel = document.getElementById(P.sel);
  if (!sel) return null;
  const b = sel.querySelector('[aria-pressed="true"]');
  const g = sel.parentNode.querySelector('.metas-grupo[aria-pressed="true"]');
  const t = (document.getElementById(P.titulo) || {}).textContent || '';
  const m = t.match(/Forma (?:R-)?(\d+)/);
  return {
    marcada: b ? parseInt(b.getAttribute('data-forma'), 10) : 0,
    titulo: m ? parseInt(m[1], 10) : 0,
    textoTitulo: t,
    grupo: g ? parseInt(g.getAttribute('data-grupo'), 10) : -1,
    fila: Array.from(sel.querySelectorAll('.metas-forma')).map(x => parseInt(x.getAttribute('data-forma'), 10)),
    toca: parseInt(sel.value, 10),
    tope: sel.options.length
  };
}

(async () => {
  const nav = await abrir();
  for (const slug of lista) {
    console.log('\n🔵 ' + slug);
    const url = BASE + '/misiones/' + slug + '/' + paginaDe(slug);
    const ctx = await nav.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    const errores = [];
    page.on('pageerror', e => errores.push(String(e)));
    const entrar = async modo => {
      await page.evaluate(m => {
        const aviso = document.getElementById('metasIdModal'); if (aviso) aviso.remove();
        if (typeof go === 'function') go('s-evaluacion');
        if (m !== 'concept' && typeof evalSwitchMode === 'function') evalSwitchMode(m);
        else if (typeof evalSwitchMode === 'function' && document.getElementById('evalModeBtnConcept')) evalSwitchMode('concept');
      }, modo);
      await page.waitForTimeout(150);
    };
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);
    const hay = await page.evaluate(ps => ps.filter(p => document.getElementById(p.sel)).map(p => p.nombre), PRUEBAS);
    if (!hay.length) { mal('no tiene selector de forma'); await ctx.close(); continue; }

    for (const P of PRUEBAS.filter(p => hay.includes(p.nombre))) {
      console.log('  · prueba ' + P.nombre);
      await entrar(P.modo);
      const ver = () => page.evaluate(mirar, P);
      const tocar = n => page.evaluate(([id, n]) => {
        const sel = document.getElementById(id);
        sel.parentNode.querySelector('.metas-grupo[data-grupo="' + Math.floor((n - 1) / 10) + '"]').click();
        sel.querySelector('[data-forma="' + n + '"]').click();
      }, [P.sel, n]);
      const nueva = () => page.evaluate(gen => document.querySelector('[onclick*="' + gen + '()"]').click(), P.gen);
      const cuadra = (v, n) => v.marcada === n && v.titulo === n && v.fila.includes(n) && v.grupo === Math.floor((n - 1) / 10);

      let v = await ver();
      const tope = v.tope;
      /* 1 · un círculo de otro grupo */
      const k = Math.min(tope, 23);
      await tocar(k);
      v = await ver();
      if (!cuadra(v, k)) mal('al tocar el círculo ' + k + ' quedó marcado el ' + v.marcada + ', el título dice «' + v.textoTitulo + '» y está abierto el grupo ' + (v.grupo + 1));
      else bien('al tocar el círculo ' + k + ' se genera la Forma ' + k + ' y su círculo queda marcado');

      /* 2 · «Nueva», dos veces: la segunda sale de otro grupo si toca */
      let iguales = true, detalle = '';
      for (let i = 0; i < 9; i++) {
        await nueva();
        v = await ver();
        if (!cuadra(v, v.titulo) || !v.titulo) { iguales = false; detalle = 'marcado ' + v.marcada + ' y «' + v.textoTitulo + '»'; break; }
      }
      if (!iguales) mal('al tocar «Nueva» el círculo y el título no coinciden: ' + detalle);
      else bien('al tocar «Nueva» nueve veces (pasando de grupo), el círculo marcado es siempre el del título');

      /* 3 · mirar otro grupo no cambia la forma */
      const antes = v.titulo, otro = v.grupo === 0 ? 1 : 0;
      if (tope > 10) {
        await page.evaluate(([id, g]) => document.getElementById(id).parentNode.querySelector('.metas-grupo[data-grupo="' + g + '"]').click(), [P.sel, otro]);
        const mirando = await ver();
        await nueva();
        v = await ver();
        if (mirando.titulo !== antes || mirando.grupo !== otro || !cuadra(v, v.titulo)) mal('mirar el grupo ' + (otro + 1) + ' cambió la forma (' + mirando.titulo + ') o «Nueva» no volvió a abrir el grupo de la generada');
        else bien('mirar otro grupo no cambia la forma, y al generar se abre el grupo de la Forma ' + v.titulo);
      }

      /* 4 · recargar */
      const debeTocar = v.toca;
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(800);
      await entrar(P.modo);
      v = await ver();
      /* La crítica se genera sola al entrar a su pestaña: entonces ya está
         en el título. Las otras esperan a «Nueva». */
      const recargada = v.titulo ? v.titulo : v.marcada;
      if (recargada !== debeTocar || v.marcada !== debeTocar || v.grupo !== Math.floor((debeTocar - 1) / 10)) mal('al recargar está marcado el ' + v.marcada + ' (grupo ' + (v.grupo + 1) + ') y la misión tenía guardada la ' + debeTocar);
      else {
        if (!v.titulo) { await nueva(); v = await ver(); }
        if (!cuadra(v, debeTocar)) mal('al recargar se marcó la ' + debeTocar + ' pero se generó «' + v.textoTitulo + '»');
        else bien('al recargar queda marcada la Forma ' + debeTocar + ', la guardada, con su grupo abierto, y es la que se genera');
      }
    }

    /* El teléfono y el papel, en la prueba que esté a la vista. */
    const medida = await page.evaluate(() => {
      const sel = document.querySelector('.metas-formas-rejilla');
      const visible = Array.from(document.querySelectorAll('.metas-formas-rejilla')).find(x => x.getBoundingClientRect().width) || sel;
      const bs = Array.from(visible.querySelectorAll('.metas-forma')).map(b => b.getBoundingClientRect());
      return { filas: new Set(bs.map(r => Math.round(r.top))).size, n: bs.length, chico: bs.filter(r => r.width < 32 || r.height < 32).length, corre: document.documentElement.scrollWidth > innerWidth };
    });
    if (medida.filas !== 1 || medida.n > 10 || medida.chico || medida.corre) mal('en el teléfono: ' + medida.n + ' círculos en ' + medida.filas + ' filas, ' + medida.chico + ' con menos de 32 px, ' + (medida.corre ? 'la página se corre de lado' : 'sin correrse'));
    else bien('en el teléfono: una fila de ' + medida.n + ' círculos de al menos 32 × 32 y la página no se corre de lado');

    await page.emulateMedia({ media: 'print' });
    const enPapel = await page.evaluate(() => Array.from(document.querySelectorAll('.metas-formas, .eval-controls')).filter(e => getComputedStyle(e).display !== 'none').length);
    await page.emulateMedia({ media: 'screen' });
    if (enPapel) mal(enPapel + ' selectores o filas de botones salen al imprimir');
    else bien('al imprimir no salen ni los círculos ni los botones');

    if (errores.length) errores.slice(0, 5).forEach(e => mal('error en la consola: ' + e.slice(0, 160)));
    else bien('sin errores en la consola');
    await ctx.close();
  }
  await nav.close();
  console.log('\n' + (fallos ? '❌ ' + fallos + ' fallo(s)' : '✅ El círculo marcado es la forma del título, en ' + lista.length + ' misiones.') + '\n');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ ' + (e && e.stack || e)); process.exit(1); });
