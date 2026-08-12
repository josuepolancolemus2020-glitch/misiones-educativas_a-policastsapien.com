// Arnés de determinismo — misión Prueba de Fin de Grado: 4º Grado (Repaso General).
// Ejecutar: node _dev/test-determinismo-fin-de-grado-4to.js
// Verifica el «bucle exacto»: misma forma → mismo examen y misma pauta, en las
// TRES pruebas (conceptual de Matemáticas, conceptual de Español y operativa);
// formas distintas → distinto; y tras la Forma 20 vuelve la Forma 1 (esta
// misión usa EVAL_FORMAS = 20, no 30). También comprueba que las semillas de
// las tres pruebas no se pisen entre sí y que la operativa dé cuentas exactas.
// La operativa de 4º NO repasa fracciones: son sumas y restas de naturales,
// decimales con lempiras, multiplicar y dividir, problemas y un reto de dos
// pasos. Por eso las cuentas se recalculan aquí desde el ENUNCIADO, no desde
// la respuesta: si la misión y este arnés se equivocaran igual, el error
// llegaría al examen impreso de 43 alumnos sin que nadie lo viera.
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', 'fin-de-grado-4to', 'js', 'fin-de-grado-4to.js'), 'utf8');
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
const opKey = `JSON.stringify((function(){_opRnd=_evalRng(100000+__FORMA__);return {su:genOpSumas(),de:genOpDecimales(),md:genOpMultDiv(),pr:genOpProblemas(),me:genOpMeta()};})())`;
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

console.log('Las 20 formas son 20 exámenes distintos, y cada una se repite igual');
['mat', 'esp'].forEach(mat => {
  const unas = [], otras = [];
  for (let f = 1; f <= 20; f++) { unas.push(concept(mat, f)); otras.push(concept(mat, f)); }
  ok(`${mat}: las 20 formas vuelven idénticas al regenerarlas`, unas.every((s, i) => s === otras[i]));
  ok(`${mat}: no hay dos formas iguales`, new Set(unas).size === 20);
});
{
  const unas = [], otras = [];
  for (let f = 1; f <= 20; f++) { unas.push(operativa(f)); otras.push(operativa(f)); }
  ok('operativa: las 20 formas vuelven idénticas al regenerarlas', unas.every((s, i) => s === otras[i]));
  ok('operativa: no hay dos formas iguales', new Set(unas).size === 20);
}

console.log('EVAL_FORMAS y ciclo');
const EF = vm.runInContext('EVAL_FORMAS', sandbox);
ok('EVAL_FORMAS = 20 (esta misión reduce de 30 a 20 formas)', EF === 20);
ok('tras la Forma 20 sigue la 1', vm.runInContext('(20 % EVAL_FORMAS) + 1', sandbox) === 1);

// ── La aritmética, recalculada desde el enunciado ─────────────────────────
const num = s => parseFloat(String(s).replace(/,/g, ''));
const casi = (a, b) => typeof a === 'number' && Math.abs(a - b) < 0.005;
const r2 = x => Math.round(x * 100) / 100, r1 = x => Math.round(x * 10) / 10;
const malas = [];          // cuentas que no cuadran
const imposibles = [];     // restas negativas, divisiones con residuo, vueltos negativos
const mal = (f, sec, it, por) => malas.push(`Forma ${f} · ${sec} · ${por} · «${it.text}» → ${it.ansNum}`);
const imposible = (f, sec, it, por) => imposibles.push(`Forma ${f} · ${sec} · ${por} · «${it.text}» → ${it.ansNum}`);
// La pauta que ve el maestro tiene que llevar dentro la misma respuesta que
// califica la pantalla: si se separan, corrige bien y el papel dice otra cosa.
const pautaLleva = (it, esperado) => (String(it.ansShow).replace(/,/g, '').match(/\d+(?:\.\d+)?/g) || []).some(n => casi(parseFloat(n), esperado));

let items = 0;
for (let f = 1; f <= 20; f++) {
  const d = JSON.parse(operativa(f));

  // I. Sumas y restas de naturales: se rehace la cuenta del enunciado
  d.su.forEach(it => {
    items++;
    const m = it.text.match(/^Calcula: ([\d,]+) ([+−]) ([\d,]+) =$/);
    if (!m) return mal(f, 'I sumas', it, 'el enunciado no es una suma ni una resta legible');
    const a = num(m[1]), b = num(m[3]);
    const esperado = m[2] === '+' ? a + b : a - b;
    if (m[2] === '−' && esperado <= 0) imposible(f, 'I sumas', it, 'resta con resultado negativo o cero');
    if (!casi(it.ansNum, esperado)) mal(f, 'I sumas', it, `debería ser ${esperado}`);
    if (!pautaLleva(it, esperado)) mal(f, 'I sumas', it, 'la pauta no muestra la respuesta');
  });

  // II. Decimales: dos cuentas escritas y tres situaciones con lempiras
  d.de.forEach(it => {
    items++;
    let m;
    if ((m = it.text.match(/^Calcula: ([\d.]+) ([+−]) ([\d.]+) =$/))) {
      const a = num(m[1]), b = num(m[3]);
      const esperado = r2(m[2] === '+' ? a + b : a - b);
      if (m[2] === '−' && esperado <= 0) imposible(f, 'II decimales', it, 'resta con resultado negativo o cero');
      if (!casi(it.ansNum, esperado)) mal(f, 'II decimales', it, `debería ser ${esperado}`);
      if (!pautaLleva(it, esperado)) mal(f, 'II decimales', it, 'la pauta no muestra la respuesta');
    } else if ((m = it.text.match(/compró .+ por L\.([\d.]+) y .+ por L\.([\d.]+)\. ¿Cuánto pagó en total\?$/))) {
      const esperado = r2(num(m[1]) + num(m[2]));
      if (!casi(it.ansNum, esperado)) mal(f, 'II decimales', it, `debería ser ${esperado}`);
      if (!pautaLleva(it, esperado)) mal(f, 'II decimales', it, 'la pauta no muestra la respuesta');
    } else if ((m = it.text.match(/cuesta L\.([\d.]+) y Marta paga con L\.([\d.]+)\. ¿Cuánto le devuelven\?$/))) {
      const esperado = r2(num(m[2]) - num(m[1]));
      if (esperado <= 0) imposible(f, 'II decimales', it, 'vuelto negativo o cero: paga con un billete que no alcanza');
      if (!casi(it.ansNum, esperado)) mal(f, 'II decimales', it, `debería ser ${esperado}`);
      if (!pautaLleva(it, esperado)) mal(f, 'II decimales', it, 'la pauta no muestra la respuesta');
    } else if ((m = it.text.match(/mide ([\d.]+) cm de largo y ([\d.]+) cm de ancho/))) {
      const esperado = r1(num(m[1]) - num(m[2]));
      if (esperado <= 0) imposible(f, 'II decimales', it, 'el ancho es mayor que el largo: la diferencia sale negativa');
      if (!casi(it.ansNum, esperado)) mal(f, 'II decimales', it, `debería ser ${esperado}`);
      if (!pautaLleva(it, esperado)) mal(f, 'II decimales', it, 'la pauta no muestra la respuesta');
    } else mal(f, 'II decimales', it, 'enunciado que este arnés no sabe recalcular');
  });

  // III. Multiplicar y dividir: la división tiene que ser EXACTA
  d.md.forEach(it => {
    items++;
    const m = it.text.match(/^Calcula: ([\d,]+) ([×÷]) ([\d,]+) =$/);
    if (!m) return mal(f, 'III mult/div', it, 'el enunciado no es una multiplicación ni una división legible');
    const a = num(m[1]), b = num(m[3]);
    if (m[2] === '÷' && a % b !== 0) imposible(f, 'III mult/div', it, `división con residuo (${a} ÷ ${b} no es exacta)`);
    const esperado = m[2] === '×' ? a * b : a / b;
    if (!casi(it.ansNum, esperado)) mal(f, 'III mult/div', it, `debería ser ${esperado}`);
    if (!pautaLleva(it, esperado)) mal(f, 'III mult/div', it, 'la pauta no muestra la respuesta');
  });

  // IV. Problemas de la vida real: tres formas, cada una con su cuenta
  d.pr.forEach(it => {
    items++;
    let m, esperado;
    if ((m = it.text.match(/^Una caja trae (\d+) lápices\. ¿Cuántos lápices hay en (\d+) cajas\?$/))) {
      esperado = num(m[1]) * num(m[2]);
    } else if ((m = it.text.match(/compró (\d+) libras de frijoles y pagó L\.([\d,]+)\. ¿Cuánto vale la libra\?$/))) {
      const libras = num(m[1]), total = num(m[2]);
      if (total % libras !== 0) imposible(f, 'IV problemas', it, `división con residuo (L.${total} ÷ ${libras} no da lempiras exactos)`);
      esperado = total / libras;
    } else if ((m = it.text.match(/mide (\d+) metros\. ¿Cuántos centímetros mide\?$/))) {
      esperado = num(m[1]) * 100;
    } else if ((m = it.text.match(/mide (\d+) m de largo y (\d+) m de ancho\. ¿Cuánto mide su perímetro\?$/))) {
      esperado = 2 * (num(m[1]) + num(m[2]));
    } else if ((m = it.text.match(/a las (\d+):(\d+) am y estudia (\d+) minutos/))) {
      const t = num(m[1]) * 60 + num(m[2]) + num(m[3]);
      esperado = t % 60;
      // Terminar en punto deja al alumno escribiendo «0» minutos, o dejando la
      // raya vacía creyendo que no hay nada que escribir: la casilla en blanco
      // se califica MAL y el niño acertó la hora.
      if (esperado === 0) imposible(f, 'IV problemas', it, 'la hora final cae en punto: pide escribir 0 minutos');
    } else return mal(f, 'IV problemas', it, 'enunciado que este arnés no sabe recalcular');
    if (!casi(it.ansNum, esperado)) mal(f, 'IV problemas', it, `debería ser ${esperado}`);
    if (!pautaLleva(it, esperado)) mal(f, 'IV problemas', it, 'la pauta no muestra la respuesta');
  });

  // V. Reto de dos pasos: cuántos cuadernos y cuánto le sobra
  d.me.forEach(it => {
    items++;
    const m = it.text.match(/cuesta L\.(\d+) y Josué lleva L\.([\d,]+)\./);
    if (!m) return mal(f, 'V reto', it, 'enunciado que este arnés no sabe recalcular');
    const precio = num(m[1]), lleva = num(m[2]);
    const cuantos = Math.floor(lleva / precio), sobra = lleva - cuantos * precio;
    if (cuantos < 2) imposible(f, 'V reto', it, 'no alcanza ni para dos cuadernos: el reto deja de tener dos pasos');
    if (sobra === 0) imposible(f, 'V reto', it, 'no le sobra nada: se pide escribir 0');
    if (!casi(it.ansNum, sobra)) mal(f, 'V reto', it, `debería sobrarle ${sobra}`);
    if (!pautaLleva(it, sobra)) mal(f, 'V reto', it, 'la pauta no muestra la respuesta');
    if (!String(it.ansShow).includes(`compra ${cuantos} cuaderno`)) mal(f, 'V reto', it, `la pauta no explica los ${cuantos} cuadernos del primer paso`);
  });
}

console.log(`La aritmética de la operativa es exacta en las 20 formas (${items} ejercicios recalculados)`);
malas.slice(0, 10).forEach(m => console.log('      ↳ ' + m));
ok(`0 cuentas malas en sumas, decimales, mult/div, problemas y reto (${malas.length} halladas)`, malas.length === 0);

console.log('Ningún ejercicio imposible de contestar');
imposibles.slice(0, 10).forEach(m => console.log('      ↳ ' + m));
ok(`0 restas negativas, 0 divisiones con residuo y 0 vueltos negativos (${imposibles.length} hallados)`, imposibles.length === 0);

console.log('Los bancos conceptuales alcanzan para elegir 5 por sección');
['mat', 'esp'].forEach(mat => {
  const n = vm.runInContext(`JSON.stringify([MATERIA_EVAL['${mat}'].cp.length,MATERIA_EVAL['${mat}'].tf.length,evalMCBank.filter(function(x){return x.materia==='${mat}';}).length,MATERIA_EVAL['${mat}'].pr.length])`, sandbox);
  ok(`${mat}: bancos ${n} (todos ≥ 5)`, JSON.parse(n).every(x => x >= 5));
});

console.log(fallos === 0 ? '\n✅ Determinismo verificado: el bucle es exacto.' : `\n❌ ${fallos} fallo(s).`);
process.exit(fallos === 0 ? 0 : 1);
