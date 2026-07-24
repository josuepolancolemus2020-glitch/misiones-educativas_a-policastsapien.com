// Arnés de determinismo — misión ¿Qué es un Robot? (Robótica).
// Ejecutar: node _dev/test-determinismo-que-es-un-robot.js
// Verifica el «bucle exacto»: misma forma → mismo examen y misma pauta
// (conceptual Y pensamiento crítico), formas distintas → distinto,
// y tras la Forma 30 vuelve la Forma 1.
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', '2y3ciclo-que-es-un-robot', 'js', 'que-es-un-robot.js'), 'utf8');
const noop = () => {};
function mkEl() { return { style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, appendChild: noop, addEventListener: noop, setAttribute: noop, innerHTML: '', textContent: '', insertBefore: noop, querySelector: () => null, querySelectorAll: () => [], parentNode: null, dataset: {}, value: '' }; }
let docs = [];
const sandbox = {
  window: { addEventListener: noop, matchMedia: () => ({ matches: false }), open: () => ({ document: { write: d => docs.push(d), close: noop }, print: noop }) },
  document: { addEventListener: noop, readyState: 'complete', getElementById: () => mkEl(), querySelector: () => null, querySelectorAll: () => [], createElement: mkEl, body: mkEl() },
  localStorage: { getItem: () => null, setItem: noop }, navigator: { userAgent: 'x' },
  console, Math, JSON, parseFloat, parseInt, isNaN, setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop,
};
sandbox.window.document = sandbox.document;
vm.createContext(sandbox); vm.runInContext(code, sandbox);

let fallos = 0;
const ok = (nombre, cond) => { console.log((cond ? '  ✔ ' : '  ✘ ') + nombre); if (!cond) fallos++; };

// ── Selección determinista de la evaluación conceptual (misma composición que genEval) ──
const conceptualKey = 'JSON.stringify((function(){var r=_evalRng(__FORMA__);return {cp:_pickF(evalCPBank,5,r),tf:_pickF(evalTFBank,5,r),mc:_pickF(evalMCBank,5,r),pr:(function(){var p=_pickF(evalPRBank,5,r);return {terms:p,defs:_shuffleF(p,r)};})()};})())';
const concept = f => vm.runInContext(conceptualKey.replace(/__FORMA__/g, String(f)), sandbox);
console.log('— Evaluación conceptual (semilla _evalRng(forma)) —');
ok('misma forma (7) dos veces → idéntica', concept(7) === concept(7));
ok('forma 1 ≠ forma 2', concept(1) !== concept(2));

// ── Selección determinista de la prueba crítica (misma composición que genEvalCrit) ──
const criticalKey = 'JSON.stringify((function(){var r=_evalRng(200000+__FORMA__);return {sens:_pickF(critSensorBank,2,r),err:_pickF(critErrorBank,1,r),cic:_pickF(critCicloBank,1,r),cmp:_pickF(critCompareBank,1,r),dis:_pickF(critDesignBank,1,r)};})())';
const critical = f => vm.runInContext(criticalKey.replace(/__FORMA__/g, String(f)), sandbox);
console.log('— Pensamiento crítico (semilla _evalRng(200000+forma)) —');
ok('misma forma (7) dos veces → idéntica', critical(7) === critical(7));
ok('forma 1 ≠ forma 2', critical(1) !== critical(2));
ok('semillas independientes: conceptual(5) ≠ crítica(5)', concept(5) !== critical(5));

// ── Generadores completos: genEval / genEvalCrit + printEval / printEvalCrit ──
console.log('— Generación e impresión (examen + pauta idénticos por forma) —');
function runForma(f) {
  vm.runInContext('window._evalPrintData=null; window._evalCritData=null; evalFormNum=' + f + '; evalCritFormNum=' + f + ';', sandbox);
  vm.runInContext('genEval(); genEvalCrit();', sandbox);
  docs = [];
  vm.runInContext('printEval(); printEvalCrit();', sandbox);
  return {
    f: vm.runInContext('window._currentEvalForm', sandbox),
    fc: vm.runInContext('window._currentEvalCritForm', sandbox),
    data: vm.runInContext('JSON.stringify(window._evalPrintData)', sandbox),
    crit: vm.runInContext('JSON.stringify(window._evalCritData)', sandbox),
    docConcept: docs[0], docCrit: docs[1],
    nextF: vm.runInContext('evalFormNum', sandbox), nextFC: vm.runInContext('evalCritFormNum', sandbox),
  };
}
const a = runForma(15), b = runForma(15), c = runForma(16);
ok('Forma 15 dos veces → mismos datos conceptuales', a.data === b.data);
ok('Forma 15 dos veces → mismos datos críticos', a.crit === b.crit);
ok('Forma 15 dos veces → documento impreso conceptual idéntico', a.docConcept === b.docConcept);
ok('Forma 15 dos veces → documento impreso crítico idéntico', a.docCrit === b.docCrit);
ok('Forma 15 ≠ Forma 16 (conceptual)', a.data !== c.data);
ok('Forma 15 ≠ Forma 16 (crítica)', a.crit !== c.crit);
ok('formas usadas registradas (15/15)', a.f === 15 && a.fc === 15);
ok('los documentos llevan la etiqueta Forma 15', a.docConcept.includes('Forma 15') && a.docCrit.includes('Forma 15'));

// ── Ciclo: tras la Forma 30 vuelve la 1 ──
const z = runForma(30);
ok('tras la Forma 30, la siguiente es la 1 (conceptual)', z.nextF === 1);
ok('tras la Forma 30, la siguiente es la 1 (crítica)', z.nextFC === 1);

// ── Estructura de puntos ──
console.log('— Estructura de puntos —');
const d15 = JSON.parse(a.data);
ok('conceptual: 5 CP + 5 VF + 5 MC + 5 PR (20 × 5 pts = 100)', d15.cp.length === 5 && d15.tf.length === 5 && d15.mc.length === 5 && d15.pr.terms.length === 5 && 20 * 5 === 100);
const c15 = JSON.parse(a.crit);
ok('crítica: 2 casos sensor + 1 error + 1 ciclo + 1 comparación + 1 diseño (5 × 20 = 100)', c15.sens.length === 2 && !!c15.err && !!c15.cic && !!c15.cmp && typeof c15.dis === 'string' && 5 * 20 === 100);
ok('pareados: definiciones barajadas por rng sembrado (Fisher-Yates)', a.docConcept.includes('Términos Pareados'));
ok('documento crítico trae las 5 secciones', ['¿Qué sensor necesita?', 'Corrige el error conceptual', 'Analiza el ciclo', 'Comparación razonada', 'Diseña y justifica tu robot'].every(s => a.docCrit.includes(s)));
ok('colores de impresión: acento #0e7490 y fondo #ecfeff en ambos documentos', ['docConcept', 'docCrit'].every(k => a[k].includes('#0e7490') && a[k].includes('#ecfeff')));
ok('pauta .pa en verde #007a00 (conceptual)', a.docConcept.includes('.pa{color:#007a00'));
ok('encabezado dice Robótica en ambos documentos', a.docConcept.includes('Robótica') && a.docCrit.includes('Robótica'));

// ── Pareados sin puntos fijos en las 30 formas (derangement determinista) ──
console.log('— Pareados sin puntos fijos (formas 1 a 30) —');
let fijos = 0;
for (let f = 1; f <= 30; f++) {
  vm.runInContext('evalFormNum=' + f + ';genEval();', sandbox);
  const d = vm.runInContext('window._evalPrintData', sandbox);
  if (d.pr.shuffledDefs.some((df, ix) => df.def === d.pr.terms[ix].def)) fijos++;
}
ok('ninguna de las 30 formas tiene puntos fijos en pareados', fijos === 0);

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
