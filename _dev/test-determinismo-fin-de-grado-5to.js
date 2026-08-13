// Arnés de determinismo — misión Prueba de Fin de Grado: 5º Grado (Repaso General).
// Ejecutar: node _dev/test-determinismo-fin-de-grado-5to.js
// Verifica el «bucle exacto»: misma forma → mismo examen y misma pauta, en las
// TRES pruebas (conceptual de Matemáticas, conceptual de Español y operativa);
// formas distintas → distinto; y tras la Forma 20 vuelve la Forma 1 (esta
// misión usa EVAL_FORMAS = 20, no 30). También comprueba que las semillas de
// las tres pruebas no se pisen entre sí y que la operativa dé cuentas exactas.
// La operativa de 5º repasa fracciones y números mixtos, decimales que se
// multiplican y se dividen, la teoría de números (divisores, factores primos,
// m.c.m. y M.C.D.), tres problemas y el reto de la circunferencia. Por eso las
// cuentas se recalculan aquí desde el ENUNCIADO, con aritmética entera y sin
// tocar las funciones de la misión: si el arnés reusara sus helpers, misión y
// arnés se equivocarían igual y el error llegaría al examen impreso de 43
// alumnos sin que nadie lo viera.
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', 'fin-de-grado-5to', 'js', 'fin-de-grado-5to.js'), 'utf8');
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
//    De paso se le pregunta a la MISIÓN si lo que imprime la pauta (ansShow)
//    lo daría por bueno la pantalla: se le pasa al calificador de verdad
//    —_isTxtMatch con la lista aceptada, _isNumMatch con el primer número que
//    trae la pauta— porque es el alumno que copió la respuesta del papel el que
//    tiene que salir aprobado. Es un dato derivado del ítem, así que no altera
//    el determinismo.
const opKey = `JSON.stringify((function(){_opRnd=_evalRng(100000+__FORMA__);
  var d={fr:genOpFracciones(),de:genOpDecimales(),te:genOpTeoria(),pr:genOpProblemas(),me:genOpMeta()};
  Object.keys(d).forEach(function(k){d[k].forEach(function(it){
    it.pautaCalifica = it.ansTxt ? _isTxtMatch(it.ansShow, it.ansTxt)
                                 : _isNumMatch((String(it.ansShow).match(/\\d+(?:\\.\\d+)?/) || [''])[0], it.ansNum);
  });});
  return d;})())`;
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
// Todo se rehace con ENTEROS: 7.855 × 44 en coma flotante da 345.62000000000006
// y una comparación floja daría por buenas dos respuestas distintas. Los
// decimales se parten en (valor entero, número de cifras) y se comparan así.
const aEnt = s => { const t = String(s).replace(/,/g, '').trim(), p = t.split('.'), d = p[1] ? p[1].length : 0; return { v: parseInt(p[0], 10) * Math.pow(10, d) + (p[1] ? parseInt(p[1], 10) : 0), d }; };
const igual = (a, b) => typeof a === 'number' && Math.abs(a - b) < 1e-9;
const mcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
const mcm = (a, b) => a / mcd(a, b) * b;
// La fracción canónica: simplificada, y si es entera solo el entero («8/8» es «1»)
const canon = (n, d) => { const g = mcd(n, d); return (d / g) === 1 ? String(n / g) : (n / g) + '/' + (d / g); };
// Lee «21/20», «1 1/20» o «3» y devuelve [numerador, denominador]
const fracDe = s => { const m = String(s).trim().match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/); if (m) return [(m[1] ? +m[1] : 0) * (+m[3]) + (+m[2]), +m[3]]; const k = String(s).trim().match(/^(\d+)$/); return k ? [+k[1], 1] : null; };
const esPrimo = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };

const malas = [];      // cuentas que no cuadran o pautas que no dicen la respuesta
const imposibles = []; // restas negativas, divisiones con residuo, vueltos negativos, ceros sobrantes
const mal = (f, sec, it, por) => malas.push(`Forma ${f} · ${sec} · ${por} · «${it.text}» → ${it.ansShow}`);
const imposible = (f, sec, it, por) => imposibles.push(`Forma ${f} · ${sec} · ${por} · «${it.text}» → ${it.ansShow}`);
// La pauta que ve el maestro tiene que llevar dentro la misma respuesta que
// califica la pantalla: si se separan, corrige bien y el papel dice otra cosa.
const pautaLleva = (it, esperado) => (String(it.ansShow).replace(/,/g, '').match(/\d+(?:\.\d+)?/g) || []).some(n => Math.abs(parseFloat(n) - esperado) < 1e-9);
// Un decimal con un cero pegado al final («345.620», «62.80») enseña a escribir
// los decimales como no los escribe nadie y el alumno duda de si le sobra una
// cifra. En LEMPIRAS no aplica: los centavos van siempre con dos cifras.
const ceroSobrante = s => /\.\d*0$/.test(String(s));

let items = 0;
for (let f = 1; f <= 20; f++) {
  const d = JSON.parse(operativa(f));

  // I. Fracciones y números mixtos: se rehace la cuenta del enunciado
  ok_fr: {
    if (d.fr.length !== 5) { mal(f, 'I fracciones', { text: '(sección)', ansShow: d.fr.length }, 'la sección no trae 5 ejercicios'); break ok_fr; }
    d.fr.forEach(it => {
      items++;
      let m;
      if ((m = it.text.match(/^Calcula y simplifica: (\d+)\/(\d+) ([+−]) (\d+)\/(\d+) =$/))) {
        const n1 = +m[1], d1 = +m[2], n2 = +m[4], d2 = +m[5], comun = mcm(d1, d2);
        const a = n1 * (comun / d1), b = n2 * (comun / d2);
        const rn = m[3] === '+' ? a + b : a - b;
        if (n1 === 0 || n2 === 0) imposible(f, 'I fracciones', it, 'el enunciado imprime una fracción de numerador 0');
        if (m[3] === '−' && rn <= 0) imposible(f, 'I fracciones', it, 'resta con resultado negativo o cero');
        if (rn === 0) imposible(f, 'I fracciones', it, 'la respuesta vale cero');
        if (it.ansShow !== canon(Math.abs(rn), comun)) mal(f, 'I fracciones', it, `la pauta debería decir ${canon(Math.abs(rn), comun)}`);
        // Cada forma aceptada tiene que VALER lo mismo: una forma aceptada de más
        // le da los 4 puntos a una respuesta equivocada.
        (it.ansTxt || []).forEach(a2 => { const p = fracDe(a2); if (!p || p[0] * comun !== Math.abs(rn) * p[1]) mal(f, 'I fracciones', it, `acepta «${a2}», que no vale ${canon(Math.abs(rn), comun)}`); });
      } else if ((m = it.text.match(/^Escribe (\d+) (\d+)\/(\d+) como fracción impropia:$/))) {
        const e = +m[1], n = +m[2], den = +m[3];
        if (n >= den) imposible(f, 'I fracciones', it, 'el número mixto del enunciado no es propio (numerador ≥ denominador)');
        const esperado = (e * den + n) + '/' + den;
        if (it.ansShow !== esperado) mal(f, 'I fracciones', it, `la pauta debería decir ${esperado}`);
        if (mcd(e * den + n, den) !== 1) mal(f, 'I fracciones', it, 'la impropia todavía se puede simplificar: hay dos respuestas buenas y solo una se acepta');
        if (String(it.ansTxt) !== esperado) mal(f, 'I fracciones', it, `acepta ${JSON.stringify(it.ansTxt)} y debería aceptar solo ${esperado}`);
      } else if ((m = it.text.match(/^Escribe (\d+)\/(\d+) como número mixto:$/))) {
        const imp = +m[1], den = +m[2], e = Math.floor(imp / den), n = imp % den;
        if (n === 0) imposible(f, 'I fracciones', it, 'la impropia es un entero exacto: no hay número mixto que escribir');
        if (imp <= den) imposible(f, 'I fracciones', it, 'la fracción del enunciado no es impropia');
        const esperado = e + ' ' + n + '/' + den;
        if (it.ansShow !== esperado) mal(f, 'I fracciones', it, `la pauta debería decir ${esperado}`);
        // El espacio del mixto no es estilo: «4 1/5» y «41/5» son 4.2 y 8.2.
        if (!/^\d+ \d+\/\d+$/.test(it.ansShow)) mal(f, 'I fracciones', it, 'el número mixto de la pauta va sin el espacio');
        if (String(it.ansTxt) !== esperado) mal(f, 'I fracciones', it, `acepta ${JSON.stringify(it.ansTxt)} y debería aceptar solo ${esperado}`);
      } else { mal(f, 'I fracciones', it, 'enunciado que este arnés no sabe recalcular'); return; }
      if (it.pautaCalifica !== true) mal(f, 'I fracciones', it, 'lo que imprime la pauta la pantalla lo daría por MALO');
    });
  }

  // II. Decimales: dos multiplicaciones, una división y dos situaciones con lempiras
  d.de.forEach(it => {
    items++;
    let m;
    if ((m = it.text.match(/^Calcula: ([\d.]+) × (\d+) =$/))) {
      const a = aEnt(m[1]), b = +m[2], v = a.v * b;
      if (ceroSobrante(m[1])) imposible(f, 'II decimales', it, 'el enunciado escribe un decimal con un cero sobrante');
      if (!igual(it.ansNum, v / Math.pow(10, a.d))) mal(f, 'II decimales', it, `debería ser ${v / Math.pow(10, a.d)}`);
      if (ceroSobrante(it.ansShow)) imposible(f, 'II decimales', it, 'la pauta escribe la respuesta con un cero sobrante al final');
      if (!pautaLleva(it, v / Math.pow(10, a.d))) mal(f, 'II decimales', it, 'la pauta no muestra la respuesta');
    } else if ((m = it.text.match(/^Calcula: ([\d.]+) ÷ (\d+) =$/))) {
      const a = aEnt(m[1]), b = +m[2];
      if (ceroSobrante(m[1])) imposible(f, 'II decimales', it, 'el enunciado escribe un decimal con un cero sobrante');
      if (a.v % b !== 0) imposible(f, 'II decimales', it, `división con residuo (${m[1]} ÷ ${b} no da un decimal exacto)`);
      const esperado = (a.v / b) / Math.pow(10, a.d);
      if (!igual(it.ansNum, esperado)) mal(f, 'II decimales', it, `debería ser ${esperado}`);
      if (ceroSobrante(it.ansShow)) imposible(f, 'II decimales', it, 'la pauta escribe la respuesta con un cero sobrante al final');
      if (!pautaLleva(it, esperado)) mal(f, 'II decimales', it, 'la pauta no muestra la respuesta');
    } else if ((m = it.text.match(/^La libra de .+ cuesta L\.([\d.]+)\. ¿Cuánto cuestan (\d+) libras\?$/))) {
      const p = aEnt(m[1]), n = +m[2], esperado = (p.v * n) / 100;
      if (n < 2) imposible(f, 'II decimales', it, 'una sola libra: no hay multiplicación que hacer');
      if (!igual(it.ansNum, esperado)) mal(f, 'II decimales', it, `debería ser ${esperado}`);
      if (!/^L\.\d+\.\d\d$/.test(it.ansShow)) mal(f, 'II decimales', it, 'la pauta no escribe los lempiras con sus dos centavos');
      if (!pautaLleva(it, esperado)) mal(f, 'II decimales', it, 'la pauta no muestra la respuesta');
    } else if ((m = it.text.match(/^Se pagaron L\.([\d.]+) por (\d+) libras de queso\. ¿Cuánto cuesta cada libra\?$/))) {
      const t = aEnt(m[1]), n = +m[2];
      if (t.v % n !== 0) imposible(f, 'II decimales', it, `división con residuo (L.${m[1]} ÷ ${n} no da centavos exactos)`);
      const esperado = (t.v / n) / 100;
      if (esperado <= 0) imposible(f, 'II decimales', it, 'la libra saldría a cero');
      if (!igual(it.ansNum, esperado)) mal(f, 'II decimales', it, `debería ser ${esperado}`);
      if (!/^L\.\d+\.\d\d$/.test(it.ansShow)) mal(f, 'II decimales', it, 'la pauta no escribe los lempiras con sus dos centavos');
      if (!pautaLleva(it, esperado)) mal(f, 'II decimales', it, 'la pauta no muestra la respuesta');
    } else mal(f, 'II decimales', it, 'enunciado que este arnés no sabe recalcular');
  });

  // III. Divisores, factores primos, m.c.m. y M.C.D.
  const mcmTextos = [];
  d.te.forEach(it => {
    items++;
    let m;
    if ((m = it.text.match(/^Escribe todos los divisores de (\d+), de menor a mayor:$/))) {
      const n = +m[1], ds = []; for (let i = 1; i <= n; i++) if (n % i === 0) ds.push(i);
      if (it.ansShow !== ds.join(', ')) mal(f, 'III teoría', it, `los divisores de ${n} son ${ds.join(', ')}`);
      // Con comas y sin ellas: el calificador borra los signos, así que «1, 2, 3»
      // y «1,2,3» no llegan iguales y las dos formas tienen que estar aceptadas.
      if (!(it.ansTxt || []).includes(ds.join(', ')) || !(it.ansTxt || []).includes(ds.join(''))) mal(f, 'III teoría', it, 'no acepta las dos formas de escribir la lista (con comas y sin ellas)');
    } else if ((m = it.text.match(/^Descompón (\d+) en factores primos:$/))) {
      const n = +m[1], fs2 = []; let r = n, p = 2; while (r > 1) { while (r % p === 0) { fs2.push(p); r /= p; } p++; }
      if (!fs2.every(esPrimo)) mal(f, 'III teoría', it, 'la descomposición trae un factor que no es primo');
      if (fs2.reduce((a, b) => a * b, 1) !== n) mal(f, 'III teoría', it, `los factores no multiplican ${n}`);
      if (it.ansShow !== fs2.join(' × ')) mal(f, 'III teoría', it, `debería ser ${fs2.join(' × ')}`);
      if (fs2.length < 2) imposible(f, 'III teoría', it, 'el número es primo: no hay descomposición que escribir');
    } else if ((m = it.text.match(/^Calcula el m\.c\.m\. de (\d+) y (\d+)\.$/))) {
      const a = +m[1], b = +m[2], esperado = mcm(a, b);
      mcmTextos.push(it.text);
      if (a === b) imposible(f, 'III teoría', it, 'los dos números son el mismo');
      if (!igual(it.ansNum, esperado)) mal(f, 'III teoría', it, `el m.c.m. de ${a} y ${b} es ${esperado}`);
      if (it.ansShow !== String(esperado)) mal(f, 'III teoría', it, `la pauta debería decir ${esperado}`);
    } else if ((m = it.text.match(/^Calcula el M\.C\.D\. de (\d+) y (\d+)\.$/))) {
      const a = +m[1], b = +m[2], esperado = mcd(a, b);
      if (a === b) imposible(f, 'III teoría', it, 'los dos números son el mismo');
      if (!igual(it.ansNum, esperado)) mal(f, 'III teoría', it, `el M.C.D. de ${a} y ${b} es ${esperado}`);
      if (it.ansShow !== String(esperado)) mal(f, 'III teoría', it, `la pauta debería decir ${esperado}`);
    } else { mal(f, 'III teoría', it, 'enunciado que este arnés no sabe recalcular'); return; }
    if (it.ansTxt && it.pautaCalifica !== true) mal(f, 'III teoría', it, 'lo que imprime la pauta la pantalla lo daría por MALO');
    if (it.ansNum !== undefined && it.ansNum === 0) imposible(f, 'III teoría', it, 'la respuesta vale cero');
  });
  // Dos veces el mismo m.c.m. son ocho de los veinte puntos de la sección en una
  // sola cuenta: el que la sabe cobra doble por saber lo mismo.
  if (mcmTextos.length !== 2 || mcmTextos[0] === mcmTextos[1]) malas.push(`Forma ${f} · III teoría · las dos preguntas de m.c.m. salieron repetidas · «${mcmTextos.join(' | ')}»`);

  // IV. Problemas de la vida real: tres, cada uno con su cuenta
  d.pr.forEach(it => {
    items++;
    let m, esperado;
    if ((m = it.text.match(/^En la pulpería, el litro de aceite cuesta L\.([\d.]+)\. Doña Marta compra (\d+) litros y paga con un billete de L\.(\d+)\.00\. ¿Cuánto recibe de vuelto\?$/))) {
      const p = aEnt(m[1]), cant = +m[2], billete = +m[3];
      if (![100, 200, 500].includes(billete)) mal(f, 'IV problemas', it, `L.${billete} no es un billete que circule`);
      const gasto = p.v * cant, vuelto = billete * 100 - gasto;
      esperado = vuelto / 100;
      if (vuelto <= 0) imposible(f, 'IV problemas', it, 'vuelto negativo o cero: paga con un billete que no alcanza');
      if (!it.ansShow.includes('gastó L.' + (gasto / 100).toFixed(2))) mal(f, 'IV problemas', it, `la pauta no explica el gasto de L.${(gasto / 100).toFixed(2)} del primer paso`);
    } else if ((m = it.text.match(/^Don Chepe riega el vivero cada (\d+) días y le echa abono cada (\d+) días\..*¿Dentro de cuántos días vuelve a hacer las dos el mismo día\?$/))) {
      const a = +m[1], b = +m[2];
      if (a === b) imposible(f, 'IV problemas', it, 'los dos plazos son iguales: no hay m.c.m. que buscar');
      esperado = mcm(a, b);
      if (!it.ansShow.includes(`m.c.m. de ${a} y ${b}`)) mal(f, 'IV problemas', it, 'la pauta no dice de qué números es el m.c.m.');
    } else if ((m = it.text.match(/^Un solar rectangular mide (\d+) m de largo y (\d+) m de ancho\. ¿Cuántos metros cuadrados tiene\?$/))) {
      esperado = (+m[1]) * (+m[2]);
    } else if ((m = it.text.match(/^Un rótulo con forma de triángulo mide (\d+) cm de base y (\d+) cm de altura\. ¿Cuál es su área\?$/))) {
      const b = +m[1], h = +m[2];
      if ((b * h) % 2 !== 0) imposible(f, 'IV problemas', it, 'el área del triángulo no sale exacta: cae en medio centímetro cuadrado');
      esperado = b * h / 2;
    } else if ((m = it.text.match(/^El contorno de un \S+ regular mide (\d+) cm\. ¿Cuánto mide cada uno de sus (\d+) lados\?$/))) {
      const per = +m[1], lados = +m[2];
      if (per % lados !== 0) imposible(f, 'IV problemas', it, `división con residuo (${per} ÷ ${lados} no da un lado exacto)`);
      esperado = per / lados;
    } else if ((m = it.text.match(/^Una tapadera redonda tiene (\d+) cm de diámetro\. ¿Cuánto mide su circunferencia\? \(π = 3\.14\)$/))) {
      const diam = +m[1];
      esperado = 314 * diam / 100;   // 3.14 × d, con enteros para no arrastrar la coma flotante
      if (ceroSobrante(it.ansShow.split(' ')[0])) imposible(f, 'IV problemas', it, 'la pauta escribe la respuesta con un cero sobrante al final');
      if (!it.ansShow.includes(`3.14 × ${diam}`)) mal(f, 'IV problemas', it, 'la pauta no muestra la multiplicación por 3.14');
    } else { mal(f, 'IV problemas', it, 'enunciado que este arnés no sabe recalcular'); return; }
    if (esperado === 0) imposible(f, 'IV problemas', it, 'la respuesta vale cero');
    if (!igual(it.ansNum, esperado)) mal(f, 'IV problemas', it, `debería ser ${esperado}`);
    if (!pautaLleva(it, esperado)) mal(f, 'IV problemas', it, 'la pauta no muestra la respuesta');
  });
  if (d.pr.length !== 3) malas.push(`Forma ${f} · IV problemas · la sección no trae 3 problemas sino ${d.pr.length}`);

  // V. Reto de la circunferencia: dos pasos, la vuelta y las vueltas
  d.me.forEach(it => {
    items++;
    const m = it.text.match(/^La llanta de la carreta de don Tulio tiene (\d+) cm de diámetro\. ¿Cuántos centímetros avanza la carreta en (\d+) vueltas completas de la llanta\? \(π = 3\.14\)$/);
    if (!m) return mal(f, 'V reto', it, 'enunciado que este arnés no sabe recalcular');
    const diam = +m[1], vueltas = +m[2];
    const porVuelta = 314 * diam / 100, total = 314 * diam * vueltas / 100;
    if (vueltas < 2) imposible(f, 'V reto', it, 'una sola vuelta: el reto se queda sin su segundo paso');
    if (!igual(it.ansNum, total)) mal(f, 'V reto', it, `debería ser ${total}`);
    if (!pautaLleva(it, total)) mal(f, 'V reto', it, 'la pauta no muestra la respuesta');
    // El primer paso también tiene que estar en la pauta: sin él, el maestro no
    // puede darle los puntos del paso 1 al que se equivocó solo en el segundo.
    if (!it.ansShow.includes(`3.14 × ${diam} = `)) mal(f, 'V reto', it, 'la pauta no explica el primer paso');
    if (!pautaLleva(it, porVuelta)) mal(f, 'V reto', it, `la pauta no muestra lo que avanza en una vuelta (${porVuelta})`);
    (String(it.ansShow).match(/\d+\.\d+/g) || []).forEach(n => { if (ceroSobrante(n)) imposible(f, 'V reto', it, `la pauta escribe ${n} con un cero sobrante al final`); });
  });
}

console.log(`La aritmética de la operativa es exacta en las 20 formas (${items} ejercicios recalculados)`);
malas.slice(0, 10).forEach(m => console.log('      ↳ ' + m));
ok(`0 cuentas malas en fracciones, decimales, teoría de números, problemas y reto (${malas.length} halladas)`, malas.length === 0);

console.log('Ningún ejercicio imposible de contestar');
imposibles.slice(0, 10).forEach(m => console.log('      ↳ ' + m));
ok(`0 restas negativas, 0 divisiones con residuo, 0 vueltos negativos y 0 ceros sobrantes (${imposibles.length} hallados)`, imposibles.length === 0);

console.log('Los bancos conceptuales alcanzan para elegir 5 por sección');
['mat', 'esp'].forEach(mat => {
  const n = vm.runInContext(`JSON.stringify([MATERIA_EVAL['${mat}'].cp.length,MATERIA_EVAL['${mat}'].tf.length,evalMCBank.filter(function(x){return x.materia==='${mat}';}).length,MATERIA_EVAL['${mat}'].pr.length])`, sandbox);
  ok(`${mat}: bancos ${n} (todos ≥ 5)`, JSON.parse(n).every(x => x >= 5));
  const sec = JSON.parse(concept(mat, 1));
  ok(`${mat}: la Forma 1 arma 5 + 5 + 5 + 5 preguntas`, sec.cp.length === 5 && sec.tf.length === 5 && sec.mc.length === 5 && sec.pr.terms.length === 5 && sec.pr.defs.length === 5);
});

console.log(fallos === 0 ? '\n✅ Determinismo verificado: el bucle es exacto.' : `\n❌ ${fallos} fallo(s).`);
process.exit(fallos === 0 ? 0 : 1);
