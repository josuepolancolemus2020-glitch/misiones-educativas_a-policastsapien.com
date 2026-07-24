// Arnés de determinismo — misión ⚙️ Motores y Mecanismos (Robótica, Ruta de los Robots · etapa 3).
// Ejecutar: node _dev/test-determinismo-motores-mecanismos.js
// Verifica el «bucle exacto» (misma forma → mismo examen y misma pauta, conceptual Y
// pensamiento crítico), los pareados sin puntos fijos en las 30 formas, las sopas de letras
// contra su propio grid, el formato de evalMCBank, el SAVE_KEY, la ausencia de cadenas
// heredadas de la misión hermana y la coherencia del widget de engranajes.
const fs = require('fs'), path = require('path'), vm = require('vm');
const BASE = path.join(__dirname, '..', 'misiones', '2y3ciclo-motores-mecanismos');
const JS = path.join(BASE, 'js', 'motores-mecanismos.js');
const HTML = path.join(BASE, 'motores-mecanismos.html');
const CSS = path.join(BASE, 'css', 'motores-mecanismos.css');
const FICHA = path.join(__dirname, '..', 'fichas', 'ficha-motores-mecanismos.html');
const code = fs.readFileSync(JS, 'utf8');
const html = fs.readFileSync(HTML, 'utf8');
const css = fs.readFileSync(CSS, 'utf8');
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
const g = expr => vm.runInContext(expr, sandbox);

let fallos = 0;
const ok = (nombre, cond) => { console.log((cond ? '  ✔ ' : '  ✘ ') + nombre); if (!cond) fallos++; };

// ── Identidad de la misión ──
console.log('— Identidad de la misión —');
ok("SAVE_KEY === 'motores_mecanismos_v1'", g('SAVE_KEY') === 'motores_mecanismos_v1');
ok('TOTAL_SECTIONS === 13', g('TOTAL_SECTIONS') === 13);
ok('EVAL_FORMAS === 30', g('EVAL_FORMAS') === 30);
ok('el HTML carga su propio css y js', html.includes('css/motores-mecanismos.css') && html.includes('js/motores-mecanismos.js'));
ok('el HTML enlaza la ficha imprimible', html.includes('../../fichas/ficha-motores-mecanismos.html'));
ok('el HTML declara la URL canónica correcta', html.includes('https://metas.policastsapien.com/misiones/2y3ciclo-motores-mecanismos/motores-mecanismos.html'));
ok('la paleta tec #0e7490 sigue siendo la de la ruta', css.includes('--pri: #0e7490'));

// ── Cadenas heredadas de la misión hermana ──
console.log('— Sin herencias de ¿Qué es un Robot? —');
const prohibidas = ['que_es_un_robot', 'que-es-un-robot', '¿Qué es un Robot?', 'aspiradora', 'maquila',
  'percibir', 'controlador', 'labShowParte', 'parteData', 'critSensorBank', 'critCicloBank',
  'data-parte', 'svgP-', 'Instituto:', 'Forma R', 'evalReducida'];
prohibidas.forEach(p => {
  const enJs = code.toLowerCase().includes(p.toLowerCase());
  const enHtml = html.toLowerCase().includes(p.toLowerCase());
  ok('no aparece «' + p + '» (js ni html)', !enJs && !enHtml);
});

// ── Bancos de la evaluación conceptual ──
console.log('— Bancos de la evaluación conceptual (4 × 15) —');
['evalTFBank', 'evalMCBank', 'evalCPBank', 'evalPRBank'].forEach(b => {
  ok(b + ' tiene 15 ítems', g(b + '.length') === 15);
});
const mc = g('JSON.parse(JSON.stringify(evalMCBank))');
ok('evalMCBank en formato {q,o,a} con 4 opciones y respuesta válida',
  mc.every(it => typeof it.q === 'string' && it.q.length > 5 && Array.isArray(it.o) && it.o.length === 4
    && Number.isInteger(it.a) && it.a >= 0 && it.a <= 3 && typeof it.o[it.a] === 'string'));
ok('evalMCBank: las opciones van etiquetadas a) b) c) d)',
  mc.every(it => it.o.every((op, i) => op.startsWith('abcd'[i] + ') '))));
const cp = g('JSON.parse(JSON.stringify(evalCPBank))');
ok('evalCPBank: todos los ítems llevan el hueco ___', cp.every(it => it.q.includes('___') && it.a.length > 1));
const tf = g('JSON.parse(JSON.stringify(evalTFBank))');
ok('evalTFBank: respuestas booleanas y ambos valores presentes',
  tf.every(it => typeof it.a === 'boolean') && tf.some(it => it.a) && tf.some(it => !it.a));
const pr = g('JSON.parse(JSON.stringify(evalPRBank))');
ok('evalPRBank: términos y definiciones únicos',
  new Set(pr.map(x => x.term)).size === 15 && new Set(pr.map(x => x.def)).size === 15);

// ── Selección determinista de la evaluación conceptual ──
console.log('— Evaluación conceptual (semilla _evalRng(100000+forma)) —');
const conceptualKey = 'JSON.stringify((function(){var r=_evalRng(100000+__FORMA__);return {cp:_pickF(evalCPBank,5,r),tf:_pickF(evalTFBank,5,r),mc:_pickF(evalMCBank,5,r),pr:(function(){var p=_pickF(evalPRBank,5,r);return {terms:p,defs:_shuffleF(p,r)};})()};})())';
const concept = f => g(conceptualKey.replace(/__FORMA__/g, String(f)));
ok('misma forma (7) dos veces → idéntica', concept(7) === concept(7));
ok('forma 1 ≠ forma 2', concept(1) !== concept(2));

// ── Selección determinista de la prueba crítica ──
console.log('— Pensamiento crítico (semilla _evalRng(200000+forma)) —');
const criticalKey = 'JSON.stringify((function(){var r=_evalRng(200000+__FORMA__);return {sens:_pickF(critMecBank,2,r),err:_pickF(critErrorBank,1,r),cic:_pickF(critTrenBank,1,r),cmp:_pickF(critCompareBank,1,r),dis:_pickF(critDesignBank,1,r)};})())';
const critical = f => g(criticalKey.replace(/__FORMA__/g, String(f)));
ok('misma forma (7) dos veces → idéntica', critical(7) === critical(7));
ok('forma 1 ≠ forma 2', critical(1) !== critical(2));
ok('semillas independientes: conceptual(5) ≠ crítica(5)', concept(5) !== critical(5));

// ── Generadores completos: genEval / genEvalCrit + printEval / printEvalCrit ──
console.log('— Generación e impresión (examen + pauta idénticos por forma) —');
function runForma(f) {
  g('window._evalPrintData=null; window._evalCritData=null; evalFormNum=' + f + '; evalCritFormNum=' + f + ';');
  g('genEval(); genEvalCrit();');
  docs = [];
  g('printEval(); printEvalCrit();');
  return {
    f: g('window._currentEvalForm'), fc: g('window._currentEvalCritForm'),
    data: g('JSON.stringify(window._evalPrintData)'), crit: g('JSON.stringify(window._evalCritData)'),
    docConcept: docs[0], docCrit: docs[1],
    nextF: g('evalFormNum'), nextFC: g('evalCritFormNum'),
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
const z = runForma(30);
ok('tras la Forma 30, la siguiente es la 1 (conceptual)', z.nextF === 1);
ok('tras la Forma 30, la siguiente es la 1 (crítica)', z.nextFC === 1);

// ── Estructura de puntos y normativa impresa ──
console.log('— Estructura de puntos y normativa de impresión —');
const d15 = JSON.parse(a.data);
ok('conceptual: 5 CP + 5 VF + 5 MC + 5 PR (20 × 5 pts = 100)', d15.cp.length === 5 && d15.tf.length === 5 && d15.mc.length === 5 && d15.pr.terms.length === 5 && 20 * 5 === 100);
const c15 = JSON.parse(a.crit);
ok('crítica: 2 casos de mecanismo + 1 error + 1 tren + 1 comparación + 1 diseño (5 × 20 = 100)',
  c15.sens.length === 2 && !!c15.err && !!c15.cic && !!c15.cmp && typeof c15.dis === 'string' && 5 * 20 === 100);
ok('la prueba crítica trae la sección «Analiza el mecanismo»', a.docCrit.includes('III. Analiza el mecanismo'));
ok('documento crítico con las 5 secciones', ['I. ¿Qué mecanismo necesita?', 'II. Corrige el error conceptual', 'III. Analiza el mecanismo', 'IV. Comparación razonada', 'V. Diseña y justifica tu mecanismo'].every(s => a.docCrit.includes(s)));
['docConcept', 'docCrit'].forEach(k => {
  const doc = a[k];
  ok('[' + k + '] encabezado Nombre/Parcial/Fecha', doc.includes('<strong>Nombre:</strong>') && doc.includes('<strong>Parcial:</strong>') && doc.includes('<strong>Fecha:</strong>'));
  ok('[' + k + '] encabezado Centro Educativo/Grado/Nº', doc.includes('<strong>Centro Educativo:</strong>') && doc.includes('<strong>Grado y Sección:</strong>') && doc.includes('<strong>Nº Lista:</strong>'));
  ok('[' + k + '] pie normativo con Nº de Evaluación temática y casillas', doc.includes('Nº de Evaluación temática realizada:') && doc.includes('Evaluación con valor en el parcial') && doc.includes('Evaluación solo de repaso'));
  ok('[' + k + '] etiqueta Forma en el pie', doc.includes('class="forma-tag"'));
  ok('[' + k + '] pauta marcada como documento exclusivo del docente', doc.includes('Documento exclusivo del docente'));
  ok('[' + k + '] ajuste automático a 1 página (script fit)', /function fit\(/.test(doc) && doc.includes('@page{size:letter portrait'));
  ok('[' + k + '] título con materia · tema · Educación Básica', doc.includes('Motores y Mecanismos') && doc.includes('Educación Básica') && doc.includes('Robótica'));
  ok('[' + k + '] paleta tec en la impresión', doc.includes('#0e7490') && doc.includes('#ecfeff'));
});
ok('clave ZipGrade solo en la conceptual', a.docConcept.includes('Clave rápida estilo ZipGrade') && !a.docCrit.includes('ZipGrade'));
ok('pauta .pa en verde #007a00 (conceptual)', a.docConcept.includes('.pa{color:#007a00'));

// ── Pareados sin puntos fijos en las 30 formas ──
console.log('— Pareados sin puntos fijos (formas 1 a 30) —');
let fijos = 0, formasFijas = [];
for (let f = 1; f <= 30; f++) {
  g('evalFormNum=' + f + ';genEval();');
  const d = g('window._evalPrintData');
  if (d.pr.shuffledDefs.some((df, ix) => df.def === d.pr.terms[ix].def)) { fijos++; formasFijas.push(f); }
}
ok('ninguna de las 30 formas tiene puntos fijos en pareados' + (fijos ? ' (fallan: ' + formasFijas.join(',') + ')' : ''), fijos === 0);

// ── Sopas de letras verificadas contra su grid ──
console.log('— Sopas de letras (verificación por construcción) —');
const sopas = g('JSON.parse(JSON.stringify(sopaSets))');
ok('hay 2 sopas de 10 × 10', sopas.length === 2 && sopas.every(s => s.size === 10 && s.grid.length === 10 && s.grid.every(r => r.length === 10)));
let sopaErr = [];
sopas.forEach((set, si) => {
  set.words.forEach(w => {
    const cs = w.cells;
    if (!/^[A-Z]+$/.test(w.w)) sopaErr.push('S' + si + ' ' + w.w + ': mayúsculas sin tildes');
    if (cs.length !== w.w.length) { sopaErr.push('S' + si + ' ' + w.w + ': nº de celdas'); return; }
    const dr = Math.sign(cs[1][0] - cs[0][0]), dc = Math.sign(cs[1][1] - cs[0][1]);
    if (dr === 0 && dc === 0) { sopaErr.push('S' + si + ' ' + w.w + ': sin dirección'); return; }
    for (let i = 0; i < cs.length; i++) {
      const [r, cc] = cs[i];
      if (r !== cs[0][0] + dr * i || cc !== cs[0][1] + dc * i) { sopaErr.push('S' + si + ' ' + w.w + ': no es colineal/contigua'); break; }
      if (r < 0 || r > 9 || cc < 0 || cc > 9) { sopaErr.push('S' + si + ' ' + w.w + ': fuera del grid'); break; }
      if (set.grid[r][cc] !== w.w[i]) { sopaErr.push('S' + si + ' ' + w.w + ': letra ' + (i + 1) + ' no coincide'); break; }
    }
  });
  ok('sopa ' + (si + 1) + ': 6 palabras del tema', set.words.length === 6);
});
ok('todas las palabras son exactas, colineales y contiguas' + (sopaErr.length ? ' → ' + sopaErr.join(' | ') : ''), sopaErr.length === 0);

// ── Widget de engranajes: coherencia de las respuestas ──
console.log('— Widget del tren de engranajes —');
const casos = g('JSON.parse(JSON.stringify(gearCases))');
ok('hay 6 casos con relaciones distintas', casos.length === 6);
ok('los casos cubren 2 y 3 engranajes', casos.some(x => x.gears.length === 2) && casos.some(x => x.gears.length === 3));
ok('los casos cubren fuerza, velocidad e igualdad',
  ['fuerza', 'velocidad', 'igual'].every(r => casos.some(x => x.keyRel === r)));
let gearErr = [];
casos.forEach((x, i) => {
  // sentido esperado: cada contacto invierte el giro
  let esperadoDir = x.dirFirst;
  for (let k = 1; k < x.gears.length; k++) esperadoDir = -esperadoDir;
  const a0 = x.gears[0], b0 = x.gears[x.gears.length - 1];
  const esperadoRel = b0 > a0 ? 'fuerza' : (b0 < a0 ? 'velocidad' : 'igual');
  if (x.keyDir !== esperadoDir) gearErr.push('caso ' + (i + 1) + ': keyDir declarada ' + x.keyDir + ' ≠ ' + esperadoDir);
  if (x.keyRel !== esperadoRel) gearErr.push('caso ' + (i + 1) + ': keyRel declarada ' + x.keyRel + ' ≠ ' + esperadoRel);
  if (g('gearDirOf(gearCases[' + i + '])') !== esperadoDir) gearErr.push('caso ' + (i + 1) + ': gearDirOf()');
  if (g('gearRelOf(gearCases[' + i + '])') !== esperadoRel) gearErr.push('caso ' + (i + 1) + ': gearRelOf()');
  const factor = g('gearFactorOf(gearCases[' + i + '])');
  const esperadoF = b0 >= a0 ? b0 / a0 : a0 / b0;
  if (Math.abs(factor - esperadoF) > 1e-9) gearErr.push('caso ' + (i + 1) + ': factor ' + factor + ' ≠ ' + esperadoF);
  // el engranaje loco no cambia la relación
  if (x.gears.length === 3 && esperadoRel !== (x.gears[2] > x.gears[0] ? 'fuerza' : (x.gears[2] < x.gears[0] ? 'velocidad' : 'igual')))
    gearErr.push('caso ' + (i + 1) + ': el engranaje loco altera la relación');
  // SVG: una animación por engranaje y sentido alterno
  const svg = g('gearRenderSVG(gearCases[' + i + '])');
  const dirs = (svg.match(/animation-direction:(normal|reverse)/g) || []).map(s => s.split(':')[1]);
  if (dirs.length !== x.gears.length) gearErr.push('caso ' + (i + 1) + ': animaciones ' + dirs.length + ' ≠ ' + x.gears.length);
  const svgDirs = dirs.map(v => v === 'normal' ? 1 : -1);
  if (svgDirs[0] !== x.dirFirst) gearErr.push('caso ' + (i + 1) + ': el primer engranaje del SVG no gira como dice el caso');
  for (let k = 1; k < svgDirs.length; k++) if (svgDirs[k] !== -svgDirs[k - 1]) gearErr.push('caso ' + (i + 1) + ': el SVG no alterna el sentido en el contacto ' + k);
  if (svgDirs[svgDirs.length - 1] !== esperadoDir) gearErr.push('caso ' + (i + 1) + ': el último engranaje del SVG no coincide con la clave');
  // duración proporcional a los dientes (misma velocidad lineal en el contacto)
  const durs = (svg.match(/animation-duration:([0-9.]+)s/g) || []).map(s => parseFloat(s.split(':')[1]));
  x.gears.forEach((t, k) => { if (Math.abs(durs[k] - 2.4 * t / x.gears[0]) > 0.02) gearErr.push('caso ' + (i + 1) + ': duración del engranaje ' + (k + 1)); });
});
ok('sentido de giro y relación fuerza/velocidad coherentes con la clave' + (gearErr.length ? ' → ' + gearErr.join(' | ') : ''), gearErr.length === 0);
ok('las opciones del widget cubren las 3 relaciones y los 2 sentidos',
  g('GEAR_REL_OPTS.length') === 3 && g('GEAR_DIR_OPTS.length') === 2);
ok('el botón inicial del laboratorio apunta al primer caso (data-caso="0")',
  html.includes('data-caso="0"') && code.includes('gearShowCase(0);'));
ok('la animación respeta prefers-reduced-motion', css.includes('prefers-reduced-motion') && css.includes('.gear-spin'));

// ── Ficha imprimible ──
if (fs.existsSync(FICHA)) {
  console.log('— Ficha didáctica —');
  const fi = fs.readFileSync(FICHA, 'utf8');
  const pags = (fi.match(/class="pagina"/g) || []).length;
  ok('la ficha tiene 7 páginas', pags === 7);
  ok('la ficha usa el QR de esta misión', fi.includes('qr-mision-motores-mecanismos.png'));
  ok('la ficha trae las 4 actividades (10 + 10 + 10 + 10)',
    fi.includes('I. Completa los espacios') && fi.includes('II. Verdadero o Falso') && fi.includes('III. Selección múltiple') && fi.includes('IV. Relaciona (Pareados)'));
  const clave = (fi.match(/IV\. Pareados:<\/span>\s*([^<]+)</) || [])[1] || '';
  const letras = clave.trim().split('&nbsp;').map(s => s.trim().replace(/^\d+\.?\s*/, '')).filter(Boolean);
  ok('la clave de pareados no es 1A-2B-3C (permutación sin puntos fijos)',
    letras.length === 10 && letras.every((l, i) => l !== 'ABCDEFGHIJ'[i]) && new Set(letras).size === 10);
  ok('la ficha incluye actividades desconectadas', /desconectadas/i.test(fi) && /cart[oó]n/i.test(fi));
} else {
  console.log('— Ficha didáctica —');
  ok('existe fichas/ficha-motores-mecanismos.html', false);
}

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
