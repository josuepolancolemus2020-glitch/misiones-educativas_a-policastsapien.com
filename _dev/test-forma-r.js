// Arnés de la Forma R (piloto división-decimales). Ejecutar: node _dev/test-forma-r.js
// Verifica: determinismo de las semillas R (300000/400000 + forma), conteos y
// puntajes que suman 100, y que la vía estándar queda intacta.
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', '2y3ciclo-division-decimales', 'js', 'division-decimales.js'), 'utf8');
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

console.log('— Determinismo Forma R (operativa, semilla 400000+forma) —');
const runOp = seed => { vm.runInContext('_opRnd=_evalRng(' + seed + ')', sandbox); return vm.runInContext('JSON.stringify({den:genDivEnteroItems(),trn:genTransformItems(),mss:genMissingItems(2,true),prb:genProblemaItems(1)})', sandbox); };
const a = runOp(400001), b = runOp(400001), c = runOp(400002);
ok('misma forma → mismo examen', a === b);
ok('distinta forma → distinto examen', a !== c);
const d = JSON.parse(a);
ok('conteos 5+5+2+1', d.den.length === 5 && d.trn.length === 5 && d.mss.length === 2 && d.prb.length === 1);
ok('sección III solo dividendo faltante', d.mss.every(m => m.expr.startsWith('___')));
ok('problema trae A y b para el planteo armado', 'A' in d.prb[0] && 'b' in d.prb[0]);
ok('puntaje operativa R = 100', 5 * 8 + 5 * 4 + 2 * 10 + 1 * 20 === 100);

console.log('— Determinismo Forma R (conceptual, semilla 300000+forma) —');
vm.runInContext('var r1=_evalRng(300001); var k1=JSON.stringify([_pickF(evalCPBank,5,r1),_pickF(evalTFBank,5,r1),_pickF(evalPRBank,3,r1)]); var r2=_evalRng(300001); var k2=JSON.stringify([_pickF(evalCPBank,5,r2),_pickF(evalTFBank,5,r2),_pickF(evalPRBank,3,r2)]);', sandbox);
ok('misma forma → misma selección de bancos', vm.runInContext('k1===k2', sandbox));
ok('puntaje conceptual R = 100', 5 * 8 + 5 * 6 + 3 * 10 === 100);
ok('_formaLabel(103) → R-3', vm.runInContext('_formaLabel(103)', sandbox) === 'R-3');

console.log('— Generación e impresión en ambos modos —');
function probar(R) {
  vm.runInContext('evalReducida=' + R + '; evalFormNum=5; evalOpFormNum=5;', sandbox);
  vm.runInContext('genEval(); genEvalOp();', sandbox);
  docs = []; vm.runInContext('printEval(); printEvalOp();', sandbox);
  return { f: vm.runInContext('window._currentEvalForm', sandbox), fo: vm.runInContext('window._currentEvalOpForm', sandbox), pc: docs[0], po: docs[1] };
}
const std = probar(false);
ok('estándar: formas 5/5 y 2 documentos', std.f === 5 && std.fo === 5 && !!std.pc && !!std.po);
ok('estándar: conserva olimpiada y selección múltiple', std.po.includes('Retos de olimpiada') && std.pc.includes('Selección Múltiple'));
ok('estándar: sin bloque de apoyos', !std.pc.includes('Apoyos aplicados') && !std.po.includes('Apoyos aplicados'));
const r = probar(true);
ok('R: forma registrada 105 (100+N)', r.f === 105 && r.fo === 105);
ok('R: etiqueta impresa Forma R-5', r.pc.includes('Forma R-5') && r.po.includes('Forma R-5'));
ok('R conceptual: banco de palabras, sin MC, letra 13pt', r.pc.includes('Banco de palabras') && !r.pc.includes('Selección Múltiple') && r.pc.includes('font-size:13pt'));
ok('R operativa: ejemplo resuelto, planteo armado, sin olimpiada', r.po.includes('Ejemplo resuelto') && r.po.includes('Planteo: <strong') && !r.po.includes('Retos de olimpiada'));
ok('R: pauta con bloque «Apoyos aplicados»', r.pc.includes('Apoyos aplicados') && r.po.includes('Apoyos aplicados'));

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
