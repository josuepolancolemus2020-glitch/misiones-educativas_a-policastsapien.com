// Arnés de determinismo — misión Prueba de Fin de Grado: 7º Grado (Repaso General).
// Ejecutar: node _dev/test-determinismo-fin-de-grado-7mo.js
// Verifica el «bucle exacto»: misma forma → mismo examen y misma pauta, en las
// TRES pruebas (conceptual de Matemáticas, conceptual de Español y operativa);
// formas distintas → distinto; y tras la Forma 20 vuelve la Forma 1 (esta
// misión usa EVAL_FORMAS = 20, no 30). También comprueba que las semillas de
// las tres pruebas no se pisen entre sí y que la operativa dé cuentas exactas.
// La operativa de 7º repasa enteros y valor absoluto, fracciones y decimales,
// ecuaciones, tres problemas de proporcionalidad y porcentaje, y el reto de
// traducir un enunciado a ecuación. Las cuentas se recalculan aquí desde el
// ENUNCIADO, con aritmética entera y sin tocar las funciones de la misión: si
// el arnés reusara sus helpers, misión y arnés se equivocarían igual y el
// error llegaría al examen impreso de 43 alumnos sin que nadie lo viera.
//
// ⚠️ LO PROPIO DE 7º: aquí un resultado NEGATIVO es una respuesta legítima
// —enteros, potencias de base negativa, ecuaciones con solución negativa— y
// este arnés NO lo trata como fallo. Lo que sí vigila es que el signo se
// conserve y se CALIFIQUE: que la pantalla no dé por buena «7» cuando la
// respuesta es «−7», ni «−7» cuando es «7». Es el error más caro del grado,
// porque no se ve: el examen sale bonito y regala la mitad de los puntos de
// dos secciones enteras. Por eso cada ítem de las 20 formas se prueba en las
// dos direcciones contra el calificador de verdad (_isNumMatch / _isTxtMatch).
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', 'fin-de-grado-7mo', 'js', 'fin-de-grado-7mo.js'), 'utf8');
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
const enSandbox = expr => vm.runInContext(expr, sandbox);

// ── Selección determinista de las pruebas conceptuales (misma composición y
//    mismo orden de consumo del rng que genEval: cp → tf → mc → pr → defs) ──
const conceptKey = `JSON.stringify((function(){var M=MATERIA_EVAL['__MAT__'];var r=_evalRng(M.semilla+__FORMA__);return {cp:_pickF(M.cp,5,r),tf:_pickF(M.tf,5,r),mc:_pickF(evalMCBank.filter(function(x){return x.materia==='__MAT__';}),5,r),pr:(function(){var p=_pickF(M.pr,5,r);return {terms:p,defs:_shuffleF(p,r)};})()};})())`;
const concept = (mat, f) => vm.runInContext(conceptKey.replace(/__MAT__/g, mat).replace(/__FORMA__/g, String(f)), sandbox);

// ── Selección determinista de la operativa (mismo orden que genEvalOp) ──
//    De paso se le pregunta a la MISIÓN tres cosas de cada ítem, todas
//    derivadas del propio ítem (no consumen azar, así que no alteran el
//    determinismo):
//    · pautaCalifica — si lo que imprime la pauta lo daría por bueno la
//      pantalla. El alumno que copia la respuesta del papel tiene que salir
//      aprobado. El número se saca CON SU SIGNO y con sus comas de millar:
//      leerlo con /\d+/ devolvería «7» donde la pauta dice «−7», que es
//      justo el fallo que este grado tiene que cazar.
//    · sgPropia / sgGuion / sgLempira — que acepte su propia respuesta con el
//      menos de imprenta (−7), con el guion del teclado (-7) y con la L. del
//      dinero, que son las tres formas en que el alumno la escribe.
//    · sgSinSigno / sgNegada — las dos direcciones de la trampa: la respuesta
//      negativa NO puede colar sin su signo, y la positiva NO puede colar con
//      un signo que no le toca.
const opKey = `JSON.stringify((function(){_opRnd=_evalRng(100000+__FORMA__);
  var d={en:genOpEnteros(),nu:genOpNumeros(),ec:genOpEcuaciones(),pr:genOpProblemas(),re:genOpReto()};
  Object.keys(d).forEach(function(k){d[k].forEach(function(it){
    if(it.ansTxt){
      var neg=String(it.ansShow).charAt(0)==='−', cuerpo=neg?String(it.ansShow).slice(1):String(it.ansShow);
      it.pautaCalifica=_isTxtMatch(it.ansShow,it.ansTxt);
      it.sgPropia=_isTxtMatch(it.ansShow,it.ansTxt);
      it.sgGuion=_isTxtMatch((neg?'-':'')+cuerpo,it.ansTxt);
      it.sgSinSigno=neg?_isTxtMatch(cuerpo,it.ansTxt):null;
      it.sgNegada=neg?null:_isTxtMatch('-'+cuerpo,it.ansTxt);
    }else{
      var abs=String(Math.abs(it.ansNum)), ng=it.ansNum<0;
      it.pautaCalifica=_isNumMatch((String(it.ansShow).match(/[−-]?\\d[\\d,]*(?:\\.\\d+)?/) || [''])[0],it.ansNum);
      it.sgPropia=_isNumMatch((ng?'−':'')+abs,it.ansNum);
      it.sgGuion=_isNumMatch((ng?'-':'')+abs,it.ansNum);
      var lp=String(it.ansShow).match(/^L\.[\d,]+(?:\.\d+)?/);   // el dinero tal cual lo copia el alumno de la pauta
      it.sgLempira=(ng||!lp)?null:_isNumMatch(lp[0],it.ansNum);
      it.sgSinSigno=ng?_isNumMatch(abs,it.ansNum):null;
      it.sgNegada=ng?null:(_isNumMatch('-'+abs,it.ansNum)||_isNumMatch('−'+abs,it.ansNum));
    }
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
ok('EVAL_FORMAS = 20 (esta misión reduce de 30 a 20 formas)', enSandbox('EVAL_FORMAS') === 20);
ok('tras la Forma 20 sigue la 1', enSandbox('(20 % EVAL_FORMAS) + 1') === 1);

// ── El signo, a mano y en las dos direcciones ─────────────────────────────
// Estos casos son los que arreglaron _normTxt y _isNumMatch. Van escritos uno
// a uno —no derivados de ninguna forma— para que un «arreglo» futuro que
// vuelva a borrar el signo se caiga aquí, en la primera pantalla del arnés.
console.log('El signo se conserva y se califica (la trampa de 7º)');
const nrm = s => enSandbox(`_normTxt(${JSON.stringify(s)})`);
const num = (s, e) => enSandbox(`_isNumMatch(${JSON.stringify(s)}, ${JSON.stringify(e)})`);
const txt = (s, l) => enSandbox(`_isTxtMatch(${JSON.stringify(s)}, ${JSON.stringify(l)})`);
ok('_normTxt guarda el menos: «−7» y «-7» llegan iguales, «7» no', nrm('−7') === '-7' && nrm('-7') === '-7' && nrm('7') === '7');
ok('_normTxt guarda el menos de la fracción («  −3/4 » → «-3/4»)', nrm('  −3/4 ') === '-3/4');
ok('«−7» NO se da por bueno escribiendo «7»', num('7', -7) === false);
ok('«−7» se da por bueno con guion y con menos de imprenta', num('-7', -7) === true && num('−7', -7) === true);
ok('«7» NO se da por bueno escribiendo «−7» ni «-7»', num('−7', 7) === false && num('-7', 7) === false);
ok('«−64» (la potencia de base negativa) no cuela como «64»', num('64', -64) === false && num('-64', -64) === true);
ok('el dinero sigue valiendo con su L. y sus comas: «L.1,320» = 1320', num('L.1,320', 1320) === true);
{
  const accNeg = JSON.parse(enSandbox('JSON.stringify(_accFrac(-3,4))'));
  const accPos = JSON.parse(enSandbox('JSON.stringify(_accFrac(3,4))'));
  ok('«−3/4» NO se da por bueno escribiendo «3/4»', txt('3/4', accNeg) === false);
  ok('«−3/4» se da por bueno con guion y con menos de imprenta', txt('-3/4', accNeg) === true && txt('−3/4', accNeg) === true);
  ok('«3/4» NO se da por bueno escribiendo «−3/4»', txt('−3/4', accPos) === false && txt('-3/4', accPos) === false);
}
// La misma trampa en la prueba conceptual: el banco de Completar de
// Matemáticas trae respuestas negativas escritas a mano («−7», «−64») y las
// califica la misma _normTxt.
{
  const banco = JSON.parse(enSandbox('JSON.stringify(evalCPBankMat)'));
  const negativas = banco.filter(it => /^−/.test(it.a));
  const cuela = negativas.filter(it => {
    const lista = (it.acc && it.acc.length ? it.acc.concat([it.a]) : [it.a]).map(nrm);
    return lista.includes(nrm(it.a.replace(/^−/, '')));   // el mismo número, sin signo
  });
  ok(`Completar (mat): las ${negativas.length} respuestas negativas del banco no cuelan sin signo`, negativas.length > 0 && cuela.length === 0);
  const faltan = negativas.filter(it => { const lista = (it.acc || []).map(nrm); return !lista.includes(nrm(it.a)); });
  ok('Completar (mat): las negativas se aceptan también con el guion del teclado', faltan.length === 0);
}

// ── La aritmética, recalculada desde el enunciado ─────────────────────────
// Todo se rehace con ENTEROS: 12.41 − 6.61 en coma flotante da 5.799999999999999
// y una comparación floja daría por buenas dos respuestas distintas. Los
// decimales se parten en (valor entero, número de cifras) y se comparan así.
const aEnt = s => {
  const t = String(s).replace(/[−–—]/g, '-').replace(/^L\./, '').replace(/,/g, '').trim();
  const neg = t.charAt(0) === '-', u = neg ? t.slice(1) : t, p = u.split('.'), d = p[1] ? p[1].length : 0;
  const v = parseInt(p[0], 10) * Math.pow(10, d) + (p[1] ? parseInt(p[1], 10) : 0);
  return { v: neg ? -v : v, d };
};
const val = s => { const e = aEnt(s); return e.v / Math.pow(10, e.d); };
const igual = (a, b) => typeof a === 'number' && Math.abs(a - b) < 1e-9;
const mcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
const mcm = (a, b) => a / mcd(a, b) * b;
// La fracción canónica CON SIGNO: simplificada, el menos delante y, si es
// entera, solo el entero («−8/8» es «−1»)
const canon = (n, d) => { const g = mcd(n, d) || 1, sn = n < 0 ? '−' : ''; const nn = Math.abs(n) / g, dd = d / g; return dd === 1 ? sn + nn : sn + nn + '/' + dd; };
// Lee «21/20», «−3/4», «1 1/20» o «3» y devuelve [numerador con signo, denominador]
const fracDe = s => {
  const t = String(s).replace(/[−–—]/g, '-').trim(), neg = t.charAt(0) === '-', u = neg ? t.slice(1) : t;
  const m = u.match(/^(?:(\d+)\s+)?(\d+)\/(\d+)$/);
  if (m) { const n = (m[1] ? +m[1] : 0) * (+m[3]) + (+m[2]); return [neg ? -n : n, +m[3]]; }
  const k = u.match(/^(\d+)$/); return k ? [neg ? -(+k[1]) : +k[1], 1] : null;
};

const malas = [];      // cuentas que no cuadran o pautas que no dicen la respuesta
const imposibles = []; // divisiones con residuo, precios o vueltos negativos, ceros sobrantes
const signos = [];     // el signo que se pierde o que se regala al calificar
const mal = (f, sec, it, por) => malas.push(`Forma ${f} · ${sec} · ${por} · «${it.text}» → ${it.ansShow}`);
const imposible = (f, sec, it, por) => imposibles.push(`Forma ${f} · ${sec} · ${por} · «${it.text}» → ${it.ansShow}`);
// La pauta que ve el maestro tiene que llevar dentro la misma respuesta que
// califica la pantalla: si se separan, corrige bien y el papel dice otra cosa.
const pautaOk = (f, sec, it) => { if (it.pautaCalifica !== true) mal(f, sec, it, 'lo que imprime la pauta la pantalla lo daría por MALO'); };
// Un decimal con un cero pegado al final («5.80», «55.0») enseña a escribir
// los decimales como no los escribe nadie y el alumno duda de si le sobra una
// cifra. En LEMPIRAS no aplica: los centavos van siempre con dos cifras.
const ceroSobrante = s => /\.\d*0$/.test(String(s));
// Lo que se le MUESTRA a alguien lleva el menos de imprenta (−7), no el guion
// del teclado. Es la regla de _sg, y en el papel se nota: el guion se confunde
// con un renglón de la tabla.
const guionCrudo = s => /(^|[^\d])-\d/.test(String(s));
const revisaSigno = (f, sec, it) => {
  if (it.sgPropia !== true) signos.push(`Forma ${f} · ${sec} · NO acepta su propia respuesta · «${it.text}» → ${it.ansShow}`);
  if (it.sgGuion !== true) signos.push(`Forma ${f} · ${sec} · no acepta el guion del teclado · «${it.text}» → ${it.ansShow}`);
  // El alumno copia el dinero como se lo enseña la pauta, con su L. delante.
  if (it.sgLempira === false) signos.push(`Forma ${f} · ${sec} · no acepta la respuesta copiada tal cual de la pauta, con su L. · «${it.text}» → ${it.ansShow}`);
  if (it.sgSinSigno === true) signos.push(`Forma ${f} · ${sec} · DA POR BUENA la respuesta sin su signo menos · «${it.text}» → ${it.ansShow}`);
  if (it.sgNegada === true) signos.push(`Forma ${f} · ${sec} · da por buena una respuesta NEGATIVA donde la buena es positiva · «${it.text}» → ${it.ansShow}`);
  if (guionCrudo(it.text)) mal(f, sec, it, 'el enunciado escribe el negativo con el guion del teclado, no con el menos de imprenta');
  if (guionCrudo(it.ansShow)) mal(f, sec, it, 'la pauta escribe el negativo con el guion del teclado, no con el menos de imprenta');
};

let items = 0, puntos = 0;
for (let f = 1; f <= 20; f++) {
  const d = JSON.parse(operativa(f));

  // Composición de cada sección: una forma a la que se le cae un ejercicio, o
  // que repite dos veces el mismo tipo, se imprime igual de bonita y vale menos
  // de 100 puntos. Se cuenta por tipo de enunciado.
  const compo = {};
  const cuenta = k => { compo[k] = (compo[k] || 0) + 1; };
  puntos += d.en.length * 4 + d.nu.length * 4 + d.ec.length * 4 + d.pr.length * 10 + d.re.length * 10;

  // I. Enteros y valor absoluto — aquí el negativo es la respuesta buena
  d.en.forEach(it => {
    items++;
    let m, esperado;
    if ((m = it.text.match(/^Calcula: \(−(\d+)\) \+ (\d+) =$/))) {
      cuenta('en suma con negativo');
      esperado = (+m[2]) - (+m[1]);
    } else if ((m = it.text.match(/^Calcula: (\d+) − \(−(\d+)\) =$/))) {
      cuenta('en resta de un negativo');
      esperado = (+m[1]) + (+m[2]);
      if (esperado < 0) imposible(f, 'I enteros', it, 'restar un negativo tiene que SUMAR: el resultado no puede ser negativo');
    } else if ((m = it.text.match(/^Calcula: \(−(\d+)\) × (?:\(−(\d+)\)|(\d+)) =$/))) {
      cuenta('en producto de signos');
      const a = +m[1], b = m[2] ? +m[2] : +m[3], mismos = !!m[2];
      esperado = mismos ? a * b : -(a * b);   // menos por menos, más
    } else if ((m = it.text.match(/^Calcula: \|\(−(\d+)\)\((\d+)\) \+ (\d+)\| =$/))) {
      cuenta('en valor absoluto');
      esperado = Math.abs((+m[3]) - (+m[1]) * (+m[2]));
      if (it.ansNum < 0) mal(f, 'I enteros', it, 'un valor absoluto no puede salir negativo');
    } else if ((m = it.text.match(/^Calcula: \(−(\d+)\)([²³]) =$/))) {
      cuenta('en potencia de base negativa');
      const base = +m[1], exp = m[2] === '³' ? 3 : 2;
      esperado = Math.pow(base, exp) * (exp === 3 ? -1 : 1);   // impar → negativa; par → positiva
      if (exp === 2 && it.ansNum < 0) mal(f, 'I enteros', it, 'la potencia de exponente PAR de un negativo es positiva');
      if (exp === 3 && it.ansNum > 0) mal(f, 'I enteros', it, 'la potencia de exponente IMPAR de un negativo es negativa');
    } else { mal(f, 'I enteros', it, 'enunciado que este arnés no sabe recalcular'); return; }
    if (esperado === 0) imposible(f, 'I enteros', it, 'la respuesta vale cero');
    if (!igual(it.ansNum, esperado)) mal(f, 'I enteros', it, `debería ser ${esperado}`);
    // El signo va en lo que se imprime, no solo en el número que se compara.
    if (it.ansNum < 0 && !/^−/.test(String(it.ansShow))) mal(f, 'I enteros', it, 'la pauta imprime la respuesta negativa SIN su signo menos');
    pautaOk(f, 'I enteros', it); revisaSigno(f, 'I enteros', it);
  });

  // II. Fracciones y decimales
  d.nu.forEach(it => {
    items++;
    let m, esperado = null;
    if ((m = it.text.match(/^Calcula y simplifica: \(−(\d+)\/(\d+)\) \+ (\d+)\/(\d+) =$/))) {
      cuenta('nu fracción con negativo');
      const n1 = +m[1], d1 = +m[2], n2 = +m[3], d2 = +m[4], comun = mcm(d1, d2);
      const rn = n2 * (comun / d2) - n1 * (comun / d1);
      if (n1 === 0 || n2 === 0) imposible(f, 'II números', it, 'el enunciado imprime una fracción de numerador 0');
      if (rn === 0) imposible(f, 'II números', it, 'la respuesta vale cero');
      if (it.ansShow !== canon(rn, comun)) mal(f, 'II números', it, `la pauta debería decir ${canon(rn, comun)}`);
      // Cada forma aceptada tiene que VALER lo mismo, con su signo: una forma
      // aceptada de más le da los 4 puntos a una respuesta equivocada.
      (it.ansTxt || []).forEach(a2 => { const p = fracDe(a2); if (!p || p[0] * comun !== rn * p[1]) mal(f, 'II números', it, `acepta «${a2}», que no vale ${canon(rn, comun)}`); });
    } else if ((m = it.text.match(/^La libra de .+ cuesta L\.([\d.]+)\. ¿Cuánto cuestan (\d+) libras\?$/))) {
      cuenta('nu lempiras ×');
      const p = aEnt(m[1]), n = +m[2];
      esperado = (p.v * n) / 100;
      if (n < 2) imposible(f, 'II números', it, 'una sola libra: no hay multiplicación que hacer');
      if (p.v <= 0) imposible(f, 'II números', it, 'la libra no puede costar cero ni menos');
      // En lempiras los centavos van SIEMPRE con dos cifras: «L.58.40» es como
      // se escribe el dinero, y ahí el cero final no sobra.
      if (!/^L\.[\d,]+\.\d\d$/.test(it.ansShow)) mal(f, 'II números', it, 'la pauta no escribe los lempiras con sus dos centavos');
    } else if ((m = it.text.match(/^Por (\d+) bloques se pagaron L\.([\d,.]+)\. ¿Cuánto cuesta cada bloque\?$/))) {
      cuenta('nu lempiras ÷');
      const cant = +m[1], t = aEnt(m[2]);
      if (t.v % cant !== 0) imposible(f, 'II números', it, `división con residuo (L.${m[2]} ÷ ${cant} no da centavos exactos)`);
      esperado = (t.v / cant) / 100;
      if (esperado <= 0) imposible(f, 'II números', it, 'el bloque saldría a cero o menos');
      if (!/^L\.[\d,]+\.\d\d$/.test(it.ansShow)) mal(f, 'II números', it, 'la pauta no escribe los lempiras con sus dos centavos');
    } else if ((m = it.text.match(/^Calcula: ([\d.]+) ÷ (\d+) =$/))) {
      cuenta('nu decimal ÷');
      const a = aEnt(m[1]), b = +m[2];
      if (ceroSobrante(m[1])) imposible(f, 'II números', it, 'el enunciado escribe un decimal con un cero sobrante');
      if ((a.v * 10) % b !== 0) imposible(f, 'II números', it, `división con residuo (${m[1]} ÷ ${b} no da un decimal exacto)`);
      esperado = (a.v / b) / Math.pow(10, a.d);
      if (ceroSobrante(it.ansShow)) imposible(f, 'II números', it, 'la pauta escribe la respuesta con un cero sobrante al final');
    } else if ((m = it.text.match(/^Calcula: ([\d.]+) − ([\d.]+) =$/))) {
      cuenta('nu decimal −');
      const x = aEnt(m[1]), y = aEnt(m[2]);
      if (ceroSobrante(m[1]) || ceroSobrante(m[2])) imposible(f, 'II números', it, 'el enunciado escribe un decimal con un cero sobrante');
      esperado = (x.v - y.v) / 100;
      if (esperado === 0) imposible(f, 'II números', it, 'la respuesta vale cero');
      if (ceroSobrante(it.ansShow)) imposible(f, 'II números', it, 'la pauta escribe la respuesta con un cero sobrante al final');
    } else { mal(f, 'II números', it, 'enunciado que este arnés no sabe recalcular'); return; }
    if (esperado !== null) {
      if (!igual(it.ansNum, esperado)) mal(f, 'II números', it, `debería ser ${esperado}`);
      if (!igual(val(it.ansShow), esperado)) mal(f, 'II números', it, `la pauta imprime ${it.ansShow} y la respuesta es ${esperado}`);
    }
    pautaOk(f, 'II números', it); revisaSigno(f, 'II números', it);
  });

  // III. Ecuaciones — la solución puede ser negativa, y ahí está el examen
  d.ec.forEach(it => {
    items++;
    let m, esperado, letra = null;
    if ((m = it.text.match(/^Halla el valor de ([a-z]):\s+(\d+)\1 = (−?\d+)$/))) {
      cuenta('ec aL = c');
      const a = +m[2], c = val(m[3]); letra = m[1];
      if (c % a !== 0) imposible(f, 'III ecuaciones', it, `división con residuo (${c} ÷ ${a} no da un valor entero)`);
      esperado = c / a;
    } else if ((m = it.text.match(/^Halla el valor de ([a-z]):\s+\1 \+ (\d+) = (−?\d+)$/))) {
      cuenta('ec L + b');
      letra = m[1]; esperado = val(m[3]) - (+m[2]);
    } else if ((m = it.text.match(/^Halla el valor de ([a-z]):\s+(\d+)\1 \+ (\d+) = (−?\d+)$/))) {
      cuenta('ec aL + b');
      const a = +m[2], b = +m[3], c = val(m[4]); letra = m[1];
      if ((c - b) % a !== 0) imposible(f, 'III ecuaciones', it, `división con residuo ((${c} − ${b}) ÷ ${a} no da un valor entero)`);
      esperado = (c - b) / a;
    } else if ((m = it.text.match(/^Halla el valor de ([a-z]):\s+(\d+)\1 − (\d+) = (−?\d+)$/))) {
      cuenta('ec aL − b');
      const a = +m[2], b = +m[3], c = val(m[4]); letra = m[1];
      if ((c + b) % a !== 0) imposible(f, 'III ecuaciones', it, `división con residuo ((${c} + ${b}) ÷ ${a} no da un valor entero)`);
      esperado = (c + b) / a;
    } else if ((m = it.text.match(/^Si t = (−?\d+), ¿cuánto vale (\d+)t \+ (\d+)\?$/))) {
      cuenta('ec sustitución');
      esperado = val(m[1]) * (+m[2]) + (+m[3]);
    } else { mal(f, 'III ecuaciones', it, 'enunciado que este arnés no sabe recalcular'); return; }
    if (esperado === 0) imposible(f, 'III ecuaciones', it, 'la respuesta vale cero');
    if (!igual(it.ansNum, esperado)) mal(f, 'III ecuaciones', it, `debería ser ${esperado}`);
    // La pauta de una ecuación se lee «x = −5»: sin la letra el maestro no
    // sabe de cuál de las cinco es, y sin el signo corrige al revés.
    if (letra) {
      const esperadoShow = `${letra} = ${esperado < 0 ? '−' + Math.abs(esperado) : esperado}`;
      if (it.ansShow !== esperadoShow) mal(f, 'III ecuaciones', it, `la pauta debería decir «${esperadoShow}»`);
    } else if (String(it.ansShow) !== String(esperado)) {
      mal(f, 'III ecuaciones', it, `la pauta debería decir ${esperado}`);
    }
    pautaOk(f, 'III ecuaciones', it); revisaSigno(f, 'III ecuaciones', it);
  });

  // IV. Tres problemas de la vida real: directa, inversa y porcentaje
  d.pr.forEach(it => {
    items++;
    let m, esperado;
    if ((m = it.text.match(/^Si (\d+) libras de café cuestan L\.([\d,]+), ¿cuánto cuestan (\d+) libras al mismo precio\?$/))) {
      cuenta('pr directa');
      const u = +m[1], tot = val(m[2]), n = +m[3];
      if (tot % u !== 0) imposible(f, 'IV problemas', it, `división con residuo (L.${m[2]} ÷ ${u} no da un precio exacto por libra)`);
      esperado = tot / u * n;
      if (u === n) imposible(f, 'IV problemas', it, 'pregunta por las mismas libras que ya le dio: no hay proporción que hacer');
      // El nombre de la proporcionalidad ES parte de la respuesta: el maestro
      // da puntos por el planteo, no solo por el número.
      if (!/directa/.test(it.ansShow)) mal(f, 'IV problemas', it, 'la pauta no dice que la proporcionalidad es DIRECTA');
      const op = it.ansShow.match(/([\d,]+) × ([\d,]+) ÷ ([\d,]+)/);
      if (!op) mal(f, 'IV problemas', it, 'la pauta no muestra la operación que hay que hacer');
      else if (!igual(val(op[1]) * val(op[2]) / val(op[3]), esperado)) mal(f, 'IV problemas', it, `la operación que explica la pauta (${op[0]}) no da ${esperado}`);
    } else if ((m = it.text.match(/^Si (\d+) obreros levantan un muro en (\d+) días, ¿cuántos días tardan (\d+) obreros trabajando igual de rápido\?$/))) {
      cuenta('pr inversa');
      const a = +m[1], b = +m[2], c = +m[3];
      if ((a * b) % c !== 0) imposible(f, 'IV problemas', it, `división con residuo (${a} × ${b} ÷ ${c} no da días enteros)`);
      esperado = a * b / c;
      if (c <= a) imposible(f, 'IV problemas', it, 'los obreros de la pregunta no son más que los del dato: la inversa no se nota');
      if (esperado >= b) imposible(f, 'IV problemas', it, 'con más obreros tardarían lo mismo o más: la respuesta contradice el enunciado');
      if (!/inversa/.test(it.ansShow)) mal(f, 'IV problemas', it, 'la pauta no dice que la proporcionalidad es INVERSA');
      const op = it.ansShow.match(/(\d+) × (\d+) ÷ (\d+)/);
      if (!op) mal(f, 'IV problemas', it, 'la pauta no muestra la operación que hay que hacer');
      else if (!igual((+op[1]) * (+op[2]) / (+op[3]), esperado)) mal(f, 'IV problemas', it, `la operación que explica la pauta (${op[0]}) no da ${esperado}`);
    } else if ((m = it.text.match(/^En una escuela hay ([\d,]+) alumnos y el (\d+)% participa en la banda\. ¿Cuántos alumnos participan\?$/))) {
      cuenta('pr porcentaje');
      const N = val(m[1]), p = +m[2];
      if ((N * p) % 100 !== 0) imposible(f, 'IV problemas', it, `el ${p}% de ${N} no da alumnos enteros`);
      esperado = N * p / 100;
      if (esperado > N) mal(f, 'IV problemas', it, 'participan más alumnos de los que hay en la escuela');
      const op = it.ansShow.match(/([\d,]+) × (\d+) ÷ (\d+)/);
      if (!op) mal(f, 'IV problemas', it, 'la pauta no muestra la operación que hay que hacer');
      else if (!igual(val(op[1]) * (+op[2]) / (+op[3]), esperado)) mal(f, 'IV problemas', it, `la operación que explica la pauta (${op[0]}) no da ${esperado}`);
    } else { mal(f, 'IV problemas', it, 'enunciado que este arnés no sabe recalcular'); return; }
    // Aquí no hay negativos que valgan: ni los lempiras, ni los días, ni los
    // alumnos pueden salir con signo menos ni valer cero.
    if (esperado <= 0) imposible(f, 'IV problemas', it, 'la respuesta sale cero o negativa, y aquí se cuentan lempiras, días o alumnos');
    if (!igual(it.ansNum, esperado)) mal(f, 'IV problemas', it, `debería ser ${esperado}`);
    pautaOk(f, 'IV problemas', it); revisaSigno(f, 'IV problemas', it);
  });

  // V. El reto de la ecuación del enunciado: se plantea y se resuelve
  d.re.forEach(it => {
    items++;
    const m = it.text.match(/^Doña Ana compró (\d+) libras de frijoles y una bolsa de sal de L\.(\d+)\. En total pagó L\.([\d,]+)\. Si x es el precio de la libra de frijoles, plantea la ecuación y halla x\.$/);
    if (!m) { mal(f, 'V reto', it, 'enunciado que este arnés no sabe recalcular'); return; }
    cuenta('reto ecuación');
    const n = +m[1], s = +m[2], t = val(m[3]);
    if ((t - s) % n !== 0) imposible(f, 'V reto', it, `división con residuo ((${t} − ${s}) ÷ ${n} no da un precio exacto por libra)`);
    const esperado = (t - s) / n;
    if (esperado <= 0) imposible(f, 'V reto', it, 'la libra de frijoles saldría a cero o menos: la sal cuesta más que todo lo pagado');
    if (!igual(it.ansNum, esperado)) mal(f, 'V reto', it, `debería ser ${esperado}`);
    // Los 10 puntos son por PLANTEAR y resolver: la pauta tiene que traer la
    // ecuación, no solo el número, para poder dar el medio punto al que la
    // planteó bien y se equivocó al despejar.
    const eq = it.ansShow.match(/la ecuación es (\d+)x \+ (\d+) = ([\d,]+)/);
    if (!eq) mal(f, 'V reto', it, 'la pauta no trae la ecuación planteada');
    else {
      if (+eq[1] !== n || +eq[2] !== s || val(eq[3]) !== t) mal(f, 'V reto', it, 'la ecuación de la pauta no es la del enunciado');
      if (!igual((+eq[1]) * esperado + (+eq[2]), val(eq[3]))) mal(f, 'V reto', it, 'la ecuación de la pauta no se cumple con su propia respuesta');
    }
    if (!new RegExp('^x = ' + esperado + ':').test(it.ansShow)) mal(f, 'V reto', it, `la pauta debería empezar por «x = ${esperado}:»`);
    pautaOk(f, 'V reto', it); revisaSigno(f, 'V reto', it);
  });

  // La forma completa: 5 + 5 + 5 + 3 + 1 = 19 ejercicios y 100 puntos, sin
  // tipos repetidos. Un tipo que sale dos veces es medio temario sin examinar.
  const esperada = {
    'en suma con negativo': 1, 'en resta de un negativo': 1, 'en producto de signos': 1, 'en valor absoluto': 1, 'en potencia de base negativa': 1,
    'nu fracción con negativo': 1, 'nu lempiras ×': 1, 'nu lempiras ÷': 1, 'nu decimal ÷': 1, 'nu decimal −': 1,
    'ec aL = c': 1, 'ec L + b': 1, 'ec aL + b': 1, 'ec aL − b': 1, 'ec sustitución': 1,
    'pr directa': 1, 'pr inversa': 1, 'pr porcentaje': 1, 'reto ecuación': 1
  };
  Object.keys(esperada).forEach(k => { if (compo[k] !== esperada[k]) malas.push(`Forma ${f} · composición · «${k}» sale ${compo[k] || 0} vez/veces y deberían ser ${esperada[k]}`); });
}

console.log(`La aritmética de la operativa es exacta en las 20 formas (${items} ejercicios recalculados)`);
malas.slice(0, 10).forEach(m => console.log('      ↳ ' + m));
ok(`0 cuentas malas en enteros, números, ecuaciones, problemas y reto (${malas.length} halladas)`, malas.length === 0);
ok(`las 20 formas valen 100 puntos cada una (${puntos / 20} pts)`, puntos === 2000);

console.log('El signo se califica ejercicio por ejercicio, en las dos direcciones');
signos.slice(0, 10).forEach(m => console.log('      ↳ ' + m));
ok(`0 respuestas que cuelen sin su signo y 0 negativas dadas por buenas donde toca positiva (${signos.length} halladas)`, signos.length === 0);

console.log('Ningún ejercicio imposible de contestar');
imposibles.slice(0, 10).forEach(m => console.log('      ↳ ' + m));
ok(`0 divisiones con residuo, 0 precios o días negativos, 0 respuestas en cero y 0 ceros sobrantes (${imposibles.length} hallados)`, imposibles.length === 0);

console.log('Los bancos conceptuales alcanzan para elegir 5 por sección');
['mat', 'esp'].forEach(mat => {
  const n = enSandbox(`JSON.stringify([MATERIA_EVAL['${mat}'].cp.length,MATERIA_EVAL['${mat}'].tf.length,evalMCBank.filter(function(x){return x.materia==='${mat}';}).length,MATERIA_EVAL['${mat}'].pr.length])`);
  ok(`${mat}: bancos ${n} (todos ≥ 5)`, JSON.parse(n).every(x => x >= 5));
  const sec = JSON.parse(concept(mat, 1));
  ok(`${mat}: la Forma 1 arma 5 + 5 + 5 + 5 preguntas`, sec.cp.length === 5 && sec.tf.length === 5 && sec.mc.length === 5 && sec.pr.terms.length === 5 && sec.pr.defs.length === 5);
});

console.log(fallos === 0 ? '\n✅ Determinismo verificado: el bucle es exacto y el signo se respeta.' : `\n❌ ${fallos} fallo(s).`);
process.exit(fallos === 0 ? 0 : 1);
