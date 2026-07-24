// Arnés de determinismo — misión Sensores: los Sentidos del Robot (Robótica).
// Ejecutar: node _dev/test-determinismo-sensores-robot.js
// Verifica el «bucle exacto» (misma forma → mismo examen y misma pauta, conceptual
// Y pensamiento crítico), los pareados sin puntos fijos en las 30 formas, las sopas
// de letras contra su cuadrícula, el formato de evalMCBank, el SAVE_KEY propio y
// que no queden cadenas heredadas de la misión hermana ¿Qué es un Robot?
const fs = require('fs'), path = require('path'), vm = require('vm');
const JS_PATH = path.join(__dirname, '..', 'misiones', '2y3ciclo-sensores-robot', 'js', 'sensores-robot.js');
const HTML_PATH = path.join(__dirname, '..', 'misiones', '2y3ciclo-sensores-robot', 'sensores-robot.html');
const FICHA_PATH = path.join(__dirname, '..', 'fichas', 'ficha-sensores-robot.html');
const code = fs.readFileSync(JS_PATH, 'utf8');
const html = fs.readFileSync(HTML_PATH, 'utf8');
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

// ── Estructura de puntos y bancos ──
console.log('— Estructura de puntos y bancos —');
const d15 = JSON.parse(a.data);
ok('conceptual: 5 CP + 5 VF + 5 MC + 5 PR (20 × 5 pts = 100)', d15.cp.length === 5 && d15.tf.length === 5 && d15.mc.length === 5 && d15.pr.terms.length === 5 && 20 * 5 === 100);
const c15 = JSON.parse(a.crit);
ok('crítica: 2 casos sensor + 1 error + 1 cadena + 1 comparación + 1 diseño (5 × 20 = 100)', c15.sens.length === 2 && !!c15.err && !!c15.cic && !!c15.cmp && typeof c15.dis === 'string' && 5 * 20 === 100);
const banks = vm.runInContext('JSON.stringify({cp:evalCPBank,tf:evalTFBank,mc:evalMCBank,pr:evalPRBank})', sandbox);
const B = JSON.parse(banks);
ok('4 bancos × 15 ítems (CP/VF/MC/PR)', B.cp.length === 15 && B.tf.length === 15 && B.mc.length === 15 && B.pr.length === 15);
ok('evalMCBank en formato {q,o,a} con 4 opciones y respuesta válida (Campeonísimo)',
  B.mc.every(it => typeof it.q === 'string' && Array.isArray(it.o) && it.o.length === 4 && Number.isInteger(it.a) && it.a >= 0 && it.a <= 3));
ok('evalTFBank booleano y con verdaderas y falsas', B.tf.every(it => typeof it.a === 'boolean') && B.tf.some(it => it.a) && B.tf.some(it => !it.a));
ok('evalCPBank con hueco ___ en todas las preguntas', B.cp.every(it => it.q.includes('___') && typeof it.a === 'string' && it.a.length > 0));
ok('evalPRBank con términos y definiciones únicos', new Set(B.pr.map(x => x.term)).size === 15 && new Set(B.pr.map(x => x.def)).size === 15);
ok('documento crítico trae las 5 secciones', ['Elige el sensor y justifica', 'Corrige el error conceptual', 'Analiza la cadena', 'Comparación razonada', 'Diseña el sistema de sensores'].every(s => a.docCrit.includes(s)));
ok('colores de impresión: acento #0e7490 y fondo #ecfeff en ambos documentos', ['docConcept', 'docCrit'].every(k => a[k].includes('#0e7490') && a[k].includes('#ecfeff')));
ok('pauta .pa en verde #007a00 (conceptual)', a.docConcept.includes('.pa{color:#007a00'));
ok('encabezado dice Robótica en ambos documentos', a.docConcept.includes('Robótica') && a.docCrit.includes('Robótica'));
ok('normativa: pie con Nº de evaluación, casillas y Forma en ambos documentos',
  ['docConcept', 'docCrit'].every(k => a[k].includes('Nº de Evaluación temática realizada')
    && a[k].includes('Evaluación con valor en el parcial') && a[k].includes('Evaluación solo de repaso')
    && a[k].includes('class="forma-tag"')));
ok('normativa: encabezado con Parcial + Centro Educativo + Nº Lista', ['docConcept', 'docCrit'].every(k => a[k].includes('Parcial:') && a[k].includes('Centro Educativo:') && a[k].includes('Nº Lista:')));
ok('clave ZipGrade solo en la conceptual', a.docConcept.includes('ZipGrade') && !a.docCrit.includes('ZipGrade'));
ok('auto-ajuste fit() de una página en ambos documentos', a.docConcept.includes('function fit(') && a.docCrit.includes('function fit('));

// ── Pareados sin puntos fijos en las 30 formas (derangement determinista) ──
console.log('— Pareados sin puntos fijos (formas 1 a 30) —');
let fijos = 0;
for (let f = 1; f <= 30; f++) {
  vm.runInContext('evalFormNum=' + f + ';genEval();', sandbox);
  const d = vm.runInContext('window._evalPrintData', sandbox);
  if (d.pr.shuffledDefs.some((df, ix) => df.def === d.pr.terms[ix].def)) fijos++;
}
ok('ninguna de las 30 formas tiene puntos fijos en pareados', fijos === 0);

// ── Sopas de letras verificadas contra su cuadrícula ──
console.log('— Sopa de letras (palabras verificadas por construcción) —');
const sopas = JSON.parse(vm.runInContext('JSON.stringify(sopaSets)', sandbox));
let sopaFallos = [];
sopas.forEach((set, si) => {
  ok(`sopa ${si + 1}: cuadrícula ${set.size}×${set.size} completa`, set.grid.length === set.size && set.grid.every(r => r.length === set.size));
  set.words.forEach(w => {
    const letras = w.cells.map(([r, c]) => (set.grid[r] || [])[c]).join('');
    const dr = w.cells[1][0] - w.cells[0][0], dc = w.cells[1][1] - w.cells[0][1];
    const colineal = w.cells.every((cell, i) => i === 0 || (cell[0] - w.cells[i - 1][0] === dr && cell[1] - w.cells[i - 1][1] === dc));
    const contigua = Math.abs(dr) <= 1 && Math.abs(dc) <= 1 && !(dr === 0 && dc === 0);
    const dentro = w.cells.every(([r, c]) => r >= 0 && r < set.size && c >= 0 && c < set.size);
    const mayusSinTilde = /^[A-Z]+$/.test(w.w);
    if (!(letras === w.w && colineal && contigua && dentro && mayusSinTilde && w.cells.length === w.w.length)) sopaFallos.push(`sopa ${si + 1} · ${w.w} → "${letras}"`);
  });
});
ok('todas las palabras se leen exactas, colineales y contiguas' + (sopaFallos.length ? ' [' + sopaFallos.join(' | ') + ']' : ''), sopaFallos.length === 0);
ok('cada sopa trae 6 palabras', sopas.every(s => s.words.length === 6));

// ── Identidad de la misión: SAVE_KEY, datos propios y ausencia de herencias ──
console.log('— Identidad de la misión —');
ok("SAVE_KEY === 'sensores_robot_v1'", vm.runInContext('SAVE_KEY', sandbox) === 'sensores_robot_v1');
const herencias = ['que_es_un_robot', 'que-es-un-robot', '¿Qué es un Robot?', 'parteData', 'labShowParte', 'data-parte'];
const enJs = herencias.filter(h => code.includes(h));
const enHtml = herencias.filter(h => html.includes(h));
ok('el JS no conserva cadenas de ¿Qué es un Robot?' + (enJs.length ? ' [' + enJs.join(', ') + ']' : ''), enJs.length === 0);
ok('el HTML no conserva cadenas de ¿Qué es un Robot?' + (enHtml.length ? ' [' + enHtml.join(', ') + ']' : ''), enHtml.length === 0);
ok('bancos interactivos propios (14 flashcards, 6 parejas, 9 quiz, 4 grupos, 8 identifica, 8 completa)',
  vm.runInContext('fcData.length', sandbox) === 14 && vm.runInContext('memoPairs.length', sandbox) === 6 &&
  vm.runInContext('qzData.length', sandbox) === 9 && vm.runInContext('classGroups.length', sandbox) === 4 &&
  vm.runInContext('idData.length', sandbox) === 8 && vm.runInContext('cmpData.length', sandbox) === 8);
const sensores = JSON.parse(vm.runInContext('JSON.stringify(Object.keys(sensorData))', sandbox));
ok('lab con 5 sensores tocables (luz, distancia, tacto, temperatura, humedad)',
  ['luz', 'distancia', 'tacto', 'temperatura', 'humedad'].every(k => sensores.includes(k)) && sensores.length === 5);
ok('cada sensor del lab trae los 4 aspectos (percibe, sentido, honduras, falla)',
  vm.runInContext("Object.values(sensorData).every(function(s){return ['percibe','sentido','honduras','falla'].every(function(k){return s[k]&&s[k].title&&s[k].info;});})", sandbox) === true);
ok('el HTML enlaza los 5 sensores del lab con data-sensor y svgS-*',
  ['luz', 'distancia', 'tacto', 'temperatura', 'humedad'].every(k => html.includes('data-sensor="' + k + '"') && html.includes('id="svgS-' + k + '"')));
ok('el botón inicial del lab apunta al primer sensor (luz), no a un valor heredado',
  html.indexOf('data-sensor="luz"') < html.indexOf('data-sensor="distancia"') && code.includes("labSensor='luz'") && code.includes('[data-sensor="luz"]'));
ok('el HTML enlaza la ficha imprimible', html.includes('../../fichas/ficha-sensores-robot.html'));
ok('URL canónica y og:url de la misión', html.includes('https://metas.policastsapien.com/misiones/2y3ciclo-sensores-robot/sensores-robot.html'));

// ── Ficha didáctica (si ya existe) ──
if (fs.existsSync(FICHA_PATH)) {
  console.log('— Ficha didáctica imprimible —');
  const ficha = fs.readFileSync(FICHA_PATH, 'utf8');
  const paginas = (ficha.match(/class="pagina"/g) || []).length;
  ok('la ficha tiene 7 páginas', paginas === 7);
  ok('la ficha trae 10 pareados en la Columna A y 10 en la Columna B',
    (ficha.match(/<td>\d+\. ____ /g) || []).length === 10 && (ficha.match(/<td>[A-J]\. /g) || []).length === 10);
  const clave = (ficha.match(/IV\. Pareados:<\/span>([^<]+)</) || [])[1] || '';
  const pares = (clave.match(/(\d+)([A-J])/g) || []).map(p => [parseInt(p, 10), p.replace(/[^A-J]/g, '')]);
  ok('la pauta del docente trae la clave real de los 10 pareados', pares.length === 10);
  ok('los pareados están BARAJADOS: ningún número cae en su letra natural (nunca 1A, 2B, 3C…)',
    pares.length === 10 && pares.every(([n, l]) => l !== 'ABCDEFGHIJ'[n - 1]));
  ok('la clave usa las 10 letras sin repetir', new Set(pares.map(p => p[1])).size === 10);
  ok('la ficha no reutiliza archivos ni claves de ¿Qué es un Robot?', !['que-es-un-robot', 'que_es_un_robot'].some(h => ficha.includes(h)));
  ok('la ficha apunta a su propio QR', ficha.includes('img/qr-mision-sensores-robot.png') && fs.existsSync(path.join(__dirname, '..', 'fichas', 'img', 'qr-mision-sensores-robot.png')));
} else {
  console.log('— Ficha didáctica imprimible — (aún no creada, se omite)');
}

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
