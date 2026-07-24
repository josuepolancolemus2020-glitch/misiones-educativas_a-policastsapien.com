// Arnés de determinismo — Misión «⚡ Electricidad para Robots» (Robótica, Ruta de los Robots etapa 4).
// Ejecutar: node _dev/test-determinismo-electricidad-robots.js
// Verifica (Node + vm, sin navegador):
//   · misma forma ejecutada 2 veces → salida idéntica (conceptual Y pensamiento crítico, también impresas)
//   · formas distintas → salidas distintas · tras la Forma 30 vuelve la 1 (bucle exacto)
//   · pareados con derangement determinista: SIN puntos fijos en las 30 formas
//   · puntajes de ambas pruebas suman 100 · sin semillas de Forma R (300000/400000)
//   · sopas de letras verificadas contra su grid (colineales, contiguas, sin tildes)
//   · formato de evalMCBank {q,o,a} para el Campeonísimo · SAVE_KEY propio
//   · ausencia de cadenas heredadas de la misión molde (¿Qué es un Robot?)
//   · coherencia del LAB DE CIRCUITOS: para cada caso, el resultado enciende/no enciende
//     calculado por el solver coincide con su clave, y con el interruptor abierto nada funciona
const fs = require('fs'), path = require('path'), vm = require('vm');
const BASE = path.join(__dirname, '..', 'misiones', '2y3ciclo-electricidad-robots');
const code = fs.readFileSync(path.join(BASE, 'js', 'electricidad-robots.js'), 'utf8');
const html = fs.readFileSync(path.join(BASE, 'electricidad-robots.html'), 'utf8');
const noop = () => {};
function mkEl() { return { style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, appendChild: noop, addEventListener: noop, setAttribute: noop, innerHTML: '', textContent: '', insertBefore: noop, querySelector: () => null, querySelectorAll: () => [], parentNode: null, dataset: {}, value: '', children: [] }; }
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

// ── Evaluación conceptual (semilla _evalRng(forma)) ──
function runConceptual(forma) {
  vm.runInContext('window._evalPrintData=null; evalFormNum=' + forma + '; genEval();', sandbox);
  return vm.runInContext('JSON.stringify(window._evalPrintData)', sandbox);
}
console.log('— Evaluación conceptual (semilla _evalRng(forma)) —');
const c7a = runConceptual(7), c7b = runConceptual(7), c8 = runConceptual(8);
ok('Forma 7 dos veces → examen idéntico', c7a === c7b);
ok('Forma 7 ≠ Forma 8', c7a !== c8);
runConceptual(30);
ok('tras la Forma 30 sigue la 1 (evalFormNum cicla)', vm.runInContext('evalFormNum', sandbox) === 1);
const cd = JSON.parse(c7a);
ok('estructura 5 CP + 5 VF + 5 MC + 5 PR', cd.cp.length === 5 && cd.tf.length === 5 && cd.mc.length === 5 && cd.pr.terms.length === 5);
ok('puntaje conceptual = 100 (20 × 5 pts)', (cd.cp.length + cd.tf.length + cd.mc.length + cd.pr.terms.length) * 5 === 100);
ok('pareados con clave derivable (5 defs + 5 letras)', cd.pr.shuffledDefs.length === 5 && cd.pr.letters.length === 5);

// ── Pareados: derangement determinista, SIN puntos fijos en NINGUNA de las 30 formas ──
let sinPuntosFijos = true;
for (let f = 1; f <= 30; f++) {
  const d = JSON.parse(runConceptual(f));
  if (d.pr.shuffledDefs.some((df, ix) => df.def === d.pr.terms[ix].def)) { sinPuntosFijos = false; console.log('    · punto fijo en Forma ' + f); }
}
ok('pareados sin puntos fijos en las 30 formas (derangement determinista)', sinPuntosFijos);

// ── Pensamiento crítico (semilla _evalRng(200000+forma)) ──
function runCrit(forma) {
  vm.runInContext('window._evalCritData=null; evalCritFormNum=' + forma + '; genEvalCrit();', sandbox);
  return vm.runInContext('JSON.stringify(window._evalCritData)', sandbox);
}
console.log('— Prueba de pensamiento crítico (semilla _evalRng(200000+forma)) —');
const k7a = runCrit(7), k7b = runCrit(7), k8 = runCrit(8);
ok('Forma 7 dos veces → prueba idéntica', k7a === k7b);
ok('Forma 7 ≠ Forma 8', k7a !== k8);
runCrit(30);
ok('tras la Forma 30 sigue la 1 (evalCritFormNum cicla)', vm.runInContext('evalCritFormNum', sandbox) === 1);
ok('Forma 5 conceptual ≠ Forma 5 crítica (semillas separadas)', runConceptual(5) !== runCrit(5));
const kd = JSON.parse(k7a);
ok('crítica: 2 diagnósticos + 1 error + 1 análisis + 1 comparación + 1 diseño (5 × 20 = 100)',
  kd.sens.length === 2 && !!kd.err && !!kd.cic && !!kd.cmp && typeof kd.dis === 'string' && 5 * 20 === 100);

// ── Impresión ──
console.log('— Impresión (printEval / printEvalCrit) —');
docs = [];
runConceptual(3); runCrit(3);
vm.runInContext('printEval(); printEvalCrit();', sandbox);
ok('se generan 2 documentos', docs.length === 2);
ok('conceptual: evalPage + pautaPage + fit() binario', docs[0].includes('id="evalPage"') && docs[0].includes('id="pautaPage"') && docs[0].includes('function fit'));
ok('crítica: critEvalPage + critPautaPage + fit() binario', docs[1].includes('id="critEvalPage"') && docs[1].includes('id="critPautaPage"') && docs[1].includes('function fit'));
ok('colores de la ruta tec (#0e7490 / #ecfeff) en ambos documentos', [0, 1].every(i => docs[i].includes('#0e7490') && docs[i].includes('#ecfeff')));
ok('pauta con respuestas en verde #007a00 (.pa)', docs[0].includes('.pa{color:#007a00'));
ok('pauta marcada «Documento exclusivo del docente»', [0, 1].every(i => docs[i].includes('Documento exclusivo del docente')));
ok('encabezado con Parcial / Centro Educativo o Instituto / Nº Lista', [0, 1].every(i => docs[i].includes('Parcial:') && docs[i].includes('Nº Lista:')));
ok('pie normativo: Nº de Evaluación temática + casillas + etiqueta Forma', [0, 1].every(i =>
  docs[i].includes('Nº de Evaluación temática realizada') && docs[i].includes('Evaluación con valor en el parcial') &&
  docs[i].includes('Evaluación solo de repaso') && docs[i].includes('forma-tag')));
ok('encabezado dice «Robótica» y el tema de la misión', [0, 1].every(i => docs[i].includes('Robótica') && docs[i].includes('Electricidad para Robots')));
ok('clave ZipGrade solo en la conceptual', docs[0].includes('ZipGrade') && !docs[1].includes('ZipGrade'));
ok('sin Forma R (semillas 300000 / 400000 no usadas)', !code.includes('300000') && !code.includes('400000'));
// impresión determinista
docs = [];
runConceptual(9); vm.runInContext('printEval()', sandbox);
runConceptual(9); vm.runInContext('printEval()', sandbox);
runCrit(9); vm.runInContext('printEvalCrit()', sandbox);
runCrit(9); vm.runInContext('printEvalCrit()', sandbox);
ok('misma forma → mismo documento impreso (conceptual)', docs[0] === docs[1]);
ok('misma forma → mismo documento impreso (crítica)', docs[2] === docs[3]);

// ── Bancos ──
console.log('— Bancos de ítems —');
ok('4 bancos × 15 ítems (TF / MC / CP / PR)', vm.runInContext('evalTFBank.length===15&&evalMCBank.length===15&&evalCPBank.length===15&&evalPRBank.length===15', sandbox));
ok('formato evalMCBank {q,o,a} con 4 opciones y respuesta válida (Campeonísimo)',
  vm.runInContext("evalMCBank.every(q=>typeof q.q==='string'&&Array.isArray(q.o)&&q.o.length===4&&typeof q.a==='number'&&q.a>=0&&q.a<4)", sandbox));
ok('bancos críticos completos (6 diagnósticos, 5 errores, 5 análisis, 4 comparaciones, 5 diseños)',
  vm.runInContext('critSensorBank.length===6&&critErrorBank.length===5&&critCicloBank.length===5&&critCompareBank.length===4&&critDesignBank.length===5', sandbox));
ok('temario eléctrico presente (serie/paralelo, conductor/aislante, seguridad)',
  vm.runInContext("['serie','paralelo','conductor','aislante','cortocircuito'].every(t=>JSON.stringify([evalTFBank,evalMCBank,evalCPBank,evalPRBank]).toLowerCase().includes(t))", sandbox));

// ── Sopas de letras generadas por script y verificadas por construcción ──
console.log('— Sopas de letras —');
const sopaOk = vm.runInContext(`(function(){
  return sopaSets.length===2&&sopaSets.every(set=>set.grid.length===set.size&&set.words.length===6&&set.words.every(wo=>{
    if(!/^[A-Z]+$/.test(wo.w))return false;                       // sin tildes ni Ñ
    if(wo.cells.length!==wo.w.length)return false;
    const txt=wo.cells.map(c=>set.grid[c[0]][c[1]]).join('');
    if(txt!==wo.w)return false;                                    // se lee exacta
    const dr=Math.sign(wo.cells[1][0]-wo.cells[0][0]),dc=Math.sign(wo.cells[1][1]-wo.cells[0][1]);
    for(let i=1;i<wo.cells.length;i++){if(wo.cells[i][0]-wo.cells[i-1][0]!==dr||wo.cells[i][1]-wo.cells[i-1][1]!==dc)return false;}
    return wo.cells.every(c=>c[0]>=0&&c[0]<set.size&&c[1]>=0&&c[1]<set.size);
  }));
})()`, sandbox);
ok('2 sopas × 6 palabras: exactas, colineales, contiguas y en mayúsculas sin tildes', sopaOk);
ok('todas las celdas del grid son letras mayúsculas sin tildes',
  vm.runInContext("sopaSets.every(s=>s.grid.every(r=>r.length===s.size&&r.every(l=>/^[A-Z]$/.test(l))))", sandbox));

// ── Laboratorio de circuitos: coherencia solver ↔ clave ──
console.log('— Laboratorio de circuitos —');
const casos = vm.runInContext('JSON.stringify(circuitoCasos)', sandbox);
const cs = JSON.parse(casos);
ok('8 casos con id único (correcto, motor, cable suelto, pila al revés, corto, serie, serie quemado, paralelo)',
  cs.length === 8 && new Set(cs.map(c => c.id)).size === 8);
const coherente = vm.runInContext(`(function(){
  return circuitoCasos.every(c=>{
    const cerrado=circuitoResuelve(c,true), abierto=circuitoResuelve(c,false);
    if(cerrado.enc.length!==c.clave.length)return false;
    if(!cerrado.enc.every((v,i)=>v===c.clave[i]))return false;      // el solver reproduce la clave
    if(!abierto.enc.every(v=>v===false))return false;               // interruptor abierto: nada funciona
    if(typeof cerrado.motivo!=='string'||!cerrado.motivo)return false;
    return true;
  });
})()`, sandbox);
ok('para cada caso: solver(cerrado) === clave y solver(abierto) = todo apagado', coherente);
const claves = vm.runInContext(`(function(){
  return circuitoCasos.every(c=>{
    const k=circuitoClave(c);
    if(k<0||k>2||k>=labPredOpts.length)return false;
    if(k===0&&!c.clave.every(x=>x))return false;
    if(k===1&&!(c.clave.some(x=>x)&&!c.clave.every(x=>x)))return false;
    if(k===2&&c.clave.some(x=>x))return false;
    return true;
  });
})()`, sandbox);
ok('circuitoClave() clasifica bien la predicción (todo / una parte / nada)', claves);
const casosEsperados = {
  correcto: [true], motor: [true], suelto: [false], reves: [false], corto: [false],
  serie: [true, true], 'serie-quemado': [false, false], paralelo: [false, true]
};
ok('claves didácticas correctas (serie quemado apaga los dos; paralelo deja uno encendido)',
  Object.entries(casosEsperados).every(([id, esperado]) => {
    const c = cs.find(x => x.id === id);
    return c && JSON.stringify(c.clave) === JSON.stringify(esperado);
  }));
ok('el caso de cortocircuito avisa del peligro (pila caliente)',
  vm.runInContext("circuitoResuelve(circuitoCasos.find(c=>c.id==='corto'),true).peligro===true", sandbox));
const svgOk = vm.runInContext(`(function(){
  return circuitoCasos.every(c=>[true,false].every(cerr=>{
    const s=labSVG(c,cerr,circuitoResuelve(c,cerr));
    return s.indexOf('<svg')===0&&s.indexOf('</svg>')>0&&s.includes('circ-wire')&&s.includes('circ-lever');
  }));
})()`, sandbox);
ok('labSVG() dibuja un SVG válido para los 8 casos, abierto y cerrado', svgOk);
const svgDet = vm.runInContext(`(function(){
  const c=circuitoCasos[3];
  return labSVG(c,true,circuitoResuelve(c,true))===labSVG(c,true,circuitoResuelve(c,true));
})()`, sandbox);
ok('el dibujo del lab es determinista (misma entrada → mismo SVG)', svgDet);

// ── HTML del lab: el botón inicial apunta al primer caso (bug documentado) ──
console.log('— HTML del laboratorio —');
const dataCasos = [...html.matchAll(/data-caso="([^"]+)"/g)].map(m => m[1]);
ok('los 8 botones del lab llevan data-caso', dataCasos.length === 8);
ok('el primer botón data-caso coincide con circuitoCasos[0].id', dataCasos[0] === cs[0].id);
ok('todos los data-caso existen en circuitoCasos', dataCasos.every(d => cs.some(c => c.id === d)));
ok('el init apunta al primer caso, no a un data-parte heredado',
  code.includes("data-caso=\"'+circuitoCasos[0].id+'\"") && !code.includes('data-parte') && !html.includes('data-parte'));
ok('la ficha se enlaza desde Recursos del Tema', html.includes('../../fichas/ficha-electricidad-robots.html'));
ok('URL canónica y og:url correctas',
  html.includes('https://metas.policastsapien.com/misiones/2y3ciclo-electricidad-robots/electricidad-robots.html') && html.includes('rel="canonical"'));

// ── Identidad de la misión ──
console.log('— Identidad de la misión —');
ok("SAVE_KEY propio ('electricidad_robots_v1')", vm.runInContext('SAVE_KEY', sandbox) === 'electricidad_robots_v1');
const heredadas = ['que_es_un_robot', 'que-es-un-robot', '¿Qué es un Robot', 'Maestro Constructor',
  'Sensor vs Actuador', 'Explorador Robótico', 'percibir → decidir → actuar', 'parteData', 'aspiradora robot'];
const enJs = heredadas.filter(h => code.includes(h));
const enHtml = heredadas.filter(h => html.includes(h));
if (enJs.length) console.log('    · en el JS: ' + enJs.join(' | '));
if (enHtml.length) console.log('    · en el HTML: ' + enHtml.join(' | '));
ok('sin cadenas heredadas de la misión molde (JS y HTML)', enJs.length === 0 && enHtml.length === 0);
ok('logros y niveles retematizados', vm.runInContext("Object.keys(ACHIEVEMENTS).includes('lab_circuito')&&lvls.some(l=>l.n.includes('Circuito'))", sandbox));
ok('16 flashcards y 6 parejas de memorama del circuito', vm.runInContext('fcData.length===16&&memoPairs.length===6', sandbox));
ok('8 fallas en el widget de diagnóstico', vm.runInContext('diagData.length===8', sandbox));

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
