// Arnés de determinismo — misión Prueba de Fin de Grado: 6º Grado (Repaso General).
// Ejecutar: node _dev/test-determinismo-fin-de-grado-6to.js
// Verifica el «bucle exacto»: misma forma → mismo examen y misma pauta, en las
// TRES pruebas (conceptual de Matemáticas, conceptual de Español y operativa);
// formas distintas → distinto; y tras la Forma 20 vuelve la Forma 1 (esta
// misión usa EVAL_FORMAS = 20, no 30). También comprueba que las semillas de
// las tres pruebas no se pisen entre sí y que la operativa dé cuentas exactas.
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', 'fin-de-grado-6to', 'js', 'fin-de-grado-6to.js'), 'utf8');
const noop = () => {};
function mkEl() { return { style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, appendChild: noop, addEventListener: noop, setAttribute: noop, innerHTML: '', textContent: '', insertBefore: noop, querySelector: () => null, querySelectorAll: () => [], parentNode: null, dataset: {}, value: '' }; }
const sandbox = {
  window: { addEventListener: noop, matchMedia: () => ({ matches: false }), open: () => ({ document: { write: noop, close: noop }, print: noop }) },
  document: { addEventListener: noop, readyState: 'complete', getElementById: () => mkEl(), querySelector: () => null, querySelectorAll: () => [], createElement: mkEl, body: mkEl() },
  localStorage: { getItem: () => null, setItem: noop }, navigator: { userAgent: 'x' },
  console, Math, JSON, parseFloat, parseInt, isNaN, setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop,
};
sandbox.window.document = sandbox.document;
vm.createContext(sandbox); vm.runInContext(code, sandbox);

let fallos = 0;
const ok = (nombre, cond) => { console.log((cond ? '  ✔ ' : '  ✘ ') + nombre); if (!cond) fallos++; };

// ── Selección determinista de las pruebas conceptuales (misma composición y
//    mismo orden de consumo del rng que genEval: cp → tf → mc → pr → defs) ──
const conceptKey = `JSON.stringify((function(){var M=MATERIA_EVAL['__MAT__'];var r=_evalRng(M.semilla+__FORMA__);return {cp:_pickF(M.cp,5,r),tf:_pickF(M.tf,5,r),mc:_pickF(evalMCBank.filter(function(x){return x.materia==='__MAT__';}),5,r),pr:(function(){var p=_pickF(M.pr,5,r);return {terms:p,defs:_shuffleF(p,r)};})()};})())`;
const concept = (mat, f) => vm.runInContext(conceptKey.replace(/__MAT__/g, mat).replace(/__FORMA__/g, String(f)), sandbox);

// ── Selección determinista de la operativa (mismo orden que genEvalOp) ──
const opKey = `JSON.stringify((function(){_opRnd=_evalRng(100000+__FORMA__);return {fr:genOpFracciones(),de:genOpDecimales(),te:genOpTeoria(),pr:genOpProblemas(),me:genOpMeta()};})())`;
const operativa = f => vm.runInContext(opKey.replace(/__FORMA__/g, String(f)), sandbox);

console.log('Bucle exacto · conceptual de Matemáticas');
ok('Forma 7 dos veces → idéntica', concept('mat', 7) === concept('mat', 7));
ok('Forma 7 ≠ Forma 8', concept('mat', 7) !== concept('mat', 8));
ok('Forma 21 = Forma 21 (siempre la misma, aunque no exista en el selector)', concept('mat', 21) === concept('mat', 21));

console.log('Bucle exacto · conceptual de Español');
ok('Forma 3 dos veces → idéntica', concept('esp', 3) === concept('esp', 3));
ok('Forma 3 ≠ Forma 4', concept('esp', 3) !== concept('esp', 4));
ok('Español Forma 3 ≠ Matemáticas Forma 3 (semillas separadas)', concept('esp', 3) !== concept('mat', 3));

console.log('Bucle exacto · prueba operativa');
ok('Forma 5 dos veces → idéntica', operativa(5) === operativa(5));
ok('Forma 5 ≠ Forma 6', operativa(5) !== operativa(6));

console.log('EVAL_FORMAS y ciclo');
const EF = vm.runInContext('EVAL_FORMAS', sandbox);
ok('EVAL_FORMAS = 20 (esta misión reduce de 30 a 20 formas)', EF === 20);
ok('tras la Forma 20 sigue la 1', vm.runInContext('(20 % EVAL_FORMAS) + 1', sandbox) === 1);

console.log('La aritmética de la operativa es exacta en las 20 formas');
let cuentasMal = 0;
for (let f = 1; f <= 20; f++) {
  const d = JSON.parse(operativa(f));
  // fracciones: la respuesta aceptada debe reconstruir la operación del texto
  d.fr.forEach(it => {
    const m = it.text.match(/(\d+)\/(\d+) ([+−]) (\d+)\/(\d+)/);
    if (!m) { cuentasMal++; return; }
    const [, n1, d1, op, n2, d2] = m;
    const comun = vm.runInContext(`_mcmDe(${d1},${d2})`, sandbox);
    const val = op === '+' ? n1 * (comun / d1) + n2 * (comun / d2) : n1 * (comun / d1) - n2 * (comun / d2);
    const esperado = vm.runInContext(`_fmtFrac(${val},${comun})`, sandbox);
    if (it.ansTxt[0] !== esperado || val <= 0) cuentasMal++;
  });
  // teoría: recomputar m.c.m. / M.C.D. desde el enunciado
  d.te.forEach(it => {
    const m = it.text.match(/de (\d+) y (\d+)/); if (!m) { cuentasMal++; return; }
    const fn = it.text.includes('m.c.m.') ? '_mcmDe' : '_mcdDe';
    if (vm.runInContext(`${fn}(${m[1]},${m[2]})`, sandbox) !== it.ansNum) cuentasMal++;
  });
  // promedio: la nota que falta debe cerrar el promedio pedido y ser 60-100
  d.me.forEach(it => {
    const m = it.text.match(/lleva (\d+)%, (\d+)% y (\d+)%.*promedio del año sea (\d+)%/);
    if (!m) { cuentasMal++; return; }
    const falta = 4 * m[4] - (Number(m[1]) + Number(m[2]) + Number(m[3]));
    if (falta !== it.ansNum || falta < 60 || falta > 100) cuentasMal++;
  });
  // problemas: el vuelto nunca puede salir negativo
  d.pr.forEach(it => { if (typeof it.ansNum !== 'number' || it.ansNum <= 0) cuentasMal++; });
}
ok('0 cuentas malas en fracciones, teoría, promedio y problemas (formas 1-20)', cuentasMal === 0);

console.log('Los bancos conceptuales alcanzan para elegir 5 por sección');
['mat', 'esp'].forEach(mat => {
  const n = vm.runInContext(`JSON.stringify([MATERIA_EVAL['${mat}'].cp.length,MATERIA_EVAL['${mat}'].tf.length,evalMCBank.filter(function(x){return x.materia==='${mat}';}).length,MATERIA_EVAL['${mat}'].pr.length])`, sandbox);
  ok(`${mat}: bancos ${n} (todos ≥ 5)`, JSON.parse(n).every(x => x >= 5));
});

console.log(fallos === 0 ? '\n✅ Determinismo verificado: el bucle es exacto.' : `\n❌ ${fallos} fallo(s).`);
process.exit(fallos === 0 ? 0 : 1);
