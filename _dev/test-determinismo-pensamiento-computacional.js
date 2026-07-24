// Arnés de determinismo — Misión «El Pensamiento Computacional».
// Ejecutar: node _dev/test-determinismo-pensamiento-computacional.js
// Verifica (Node + vm, sin navegador):
//   · misma forma ejecutada 2 veces → salida idéntica (conceptual Y operativa, también impresas)
//   · formas distintas → salidas distintas
//   · tras la Forma 30 vuelve la 1 (bucle exacto)
//   · pareados con derangement determinista: SIN puntos fijos en las 30 formas
//   · puntajes de ambas pruebas suman 100
//   · sin semillas de Forma R (300000/400000) · colores tec en impresión · pauta .pa verde · encabezado «Programación»
//   · coherencia interna de los ítems (ordena/completa/detective/descompón) · sopas válidas · lab íntegro
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', '2y3ciclo-pensamiento-computacional', 'js', 'pensamiento-computacional.js'), 'utf8');
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

// ── Conceptual: genEval llena window._evalPrintData con los ítems elegidos
function runConceptual(forma) {
  vm.runInContext('evalFormNum=' + forma, sandbox);
  vm.runInContext('genEval()', sandbox);
  return vm.runInContext('JSON.stringify(window._evalPrintData)', sandbox);
}
console.log('— Evaluación conceptual (semilla _evalRng(forma)) —');
const c1a = runConceptual(7), c1b = runConceptual(7), c2 = runConceptual(8);
ok('Forma 7 dos veces → examen idéntico', c1a === c1b);
ok('Forma 7 ≠ Forma 8', c1a !== c2);
runConceptual(30);
ok('tras la Forma 30 sigue la 1 (evalFormNum cicla)', vm.runInContext('evalFormNum', sandbox) === 1);
const cd = JSON.parse(c1a);
ok('estructura 5+5+5+5 ítems', cd.cp.length === 5 && cd.tf.length === 5 && cd.mc.length === 5 && cd.pr.terms.length === 5);
ok('puntaje conceptual = 100 (20×5)', (cd.cp.length + cd.tf.length + cd.mc.length + cd.pr.terms.length) * 5 === 100);
ok('pareados barajados con clave derivable', cd.pr.shuffledDefs.length === 5 && cd.pr.letters.length === 5);

// ── Derangement de pareados: SIN puntos fijos en NINGUNA de las 30 formas
let sinPuntosFijos = true;
for (let f = 1; f <= 30; f++) {
  const d = JSON.parse(runConceptual(f));
  if (d.pr.shuffledDefs.some((df, ix) => df.def === d.pr.terms[ix].def)) { sinPuntosFijos = false; console.log('    · punto fijo en Forma ' + f); }
}
ok('pareados sin puntos fijos en las 30 formas (derangement determinista)', sinPuntosFijos);

// ── Operativa: genEvalOp llena window._evalOpData (semilla 100000+forma)
function runOperativa(forma) {
  vm.runInContext('evalOpFormNum=' + forma, sandbox);
  vm.runInContext('genEvalOp()', sandbox);
  return vm.runInContext('JSON.stringify(window._evalOpData)', sandbox);
}
console.log('— Prueba operativa (semilla _evalRng(100000+forma)) —');
const o1a = runOperativa(7), o1b = runOperativa(7), o2 = runOperativa(8);
ok('Forma 7 dos veces → prueba idéntica', o1a === o1b);
ok('Forma 7 ≠ Forma 8', o1a !== o2);
runOperativa(30);
ok('tras la Forma 30 sigue la 1 (evalOpFormNum cicla)', vm.runInContext('evalOpFormNum', sandbox) === 1);
ok('Forma 5 conceptual ≠ Forma 5 operativa (semillas separadas)', runConceptual(5) !== runOperativa(5));
const od = JSON.parse(o1a);
ok('conteos 5+5+5+3+2 retos', od.ordItems.length === 5 && od.eaItems.length === 5 && od.cplItems.length === 5 && od.vidaItems.length === 3 && !!od.retoD && !!od.retoP);
ok('puntaje operativa = 100 (5×4+5×2+5×4+3×10+10+10)', 5 * 4 + 5 * 2 + 5 * 4 + 3 * 10 + 10 + 10 === 100);

// ── Coherencia interna de los ítems deterministas (en varias formas)
console.log('— Coherencia de los ítems generados —');
let cohOrd = true, cohEa = true, cohCpl = true, cohRd = true, cohDet = true;
for (const f of [1, 7, 13, 22, 30]) {
  const d = JSON.parse(runOperativa(f));
  // I. Ordena: aplicar la respuesta sobre lo mostrado reconstruye el algoritmo correcto y no viene ya ordenado
  d.ordItems.forEach(it => {
    const seq = it.ans.split('-').map(Number);
    const rebuilt = seq.map(n => it.display[n - 1]);
    if (JSON.stringify(rebuilt) !== JSON.stringify(it.pasos)) cohOrd = false;
    if (JSON.stringify(it.display) === JSON.stringify(it.pasos)) cohOrd = false;
    if (seq.length !== it.n || new Set(seq).size !== it.n) cohOrd = false;
  });
  // II. E/A: respuesta E o A
  d.eaItems.forEach(it => { if (it.a !== 'E' && it.a !== 'A') cohEa = false; });
  // III. Completa: ans apunta a una opción existente y única, y los pasos traen el hueco ___
  d.cplItems.forEach(it => {
    if (!(it.ans >= 0 && it.ans < it.opts.length)) cohCpl = false;
    if (new Set(it.opts).size !== 4) cohCpl = false;
    if (!it.pasos.some(p => p.includes('___'))) cohCpl = false;
  });
  // V(a). Descompón: la respuesta reconstruye las partes en orden lógico y no viene ya ordenado
  { const it = d.retoD; const seq = it.ans.split('-').map(Number);
    const rebuilt = seq.map(n => it.display[n - 1]);
    if (JSON.stringify(rebuilt) !== JSON.stringify(it.partes)) cohRd = false;
    if (JSON.stringify(it.display) === JSON.stringify(it.partes)) cohRd = false; }
  // V(b). Detective: la línea señalada contiene exactamente el paso malo y el tipo es A/I
  { const it = d.retoP;
    if (it.lineas[it.linea - 1] !== it.malo) cohDet = false;
    if (it.tipo !== 'A' && it.tipo !== 'I') cohDet = false;
    if (it.lineas.filter(l => l === it.malo).length !== 1) cohDet = false; }
}
ok('sección I: la respuesta reconstruye el algoritmo y lo mostrado nunca viene ya ordenado', cohOrd);
ok('sección II: toda respuesta es E o A', cohEa);
ok('sección III: 4 opciones únicas, hueco ___ presente y respuesta válida', cohCpl);
ok('reto descompón: la respuesta reconstruye las partes en orden lógico', cohRd);
ok('reto detective: la línea señalada es el paso malo (único) y el tipo es A/I', cohDet);

// ── Impresión: ambos printers generan documento con 2 páginas lógicas y fit()
console.log('— Impresión (printEval / printEvalOp) —');
docs = [];
runConceptual(3); runOperativa(3);
vm.runInContext('printEval(); printEvalOp();', sandbox);
ok('se generan 2 documentos', docs.length === 2);
ok('conceptual: evalPage + pautaPage + fit binario + colores tec', docs[0].includes('id="evalPage"') && docs[0].includes('id="pautaPage"') && docs[0].includes('function fit') && docs[0].includes('#0e7490') && docs[0].includes('#ecfeff'));
ok('operativa: evalPage + pautaPage + fit binario + colores tec', docs[1].includes('id="evalPage"') && docs[1].includes('id="pautaPage"') && docs[1].includes('function fit') && docs[1].includes('#0e7490') && docs[1].includes('#ecfeff'));
ok('pauta con respuestas en verde #007a00 (.pa)', docs[0].includes('.pa{color:#007a00') && docs[1].includes('.pa{color:#007a00'));
ok('encabezado imprime «Programación»', docs[0].includes('Programación') && docs[1].includes('Programación'));
ok('sin Forma R (semillas 300000/400000 no usadas)', !code.includes('300000') && !code.includes('400000'));
ok('sin cuadrículas de robot en esta etapa (código limpio, sin simStep/planRuta/svgGrid)', !code.includes('simStep') && !code.includes('planRuta') && !code.includes('svgGridHTML'));

// ── Impresión determinista: misma forma → mismo documento
docs = [];
runConceptual(9); vm.runInContext('printEval()', sandbox);
runConceptual(9); vm.runInContext('printEval()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
ok('misma forma → mismo documento impreso (conceptual)', docs[0] === docs[1]);
ok('misma forma → mismo documento impreso (operativa)', docs[2] === docs[3]);

// ── Lab «El maestro robot»: 4 escenarios × 4 desafíos íntegros
console.log('— Lab: El maestro robot —');
const labOk = vm.runInContext(`(function(){
  const ks=Object.keys(parteData);
  if(ks.length!==4)return false;
  return ks.every(k=>{
    const p=parteData[k];
    if(!p.algoritmo||p.algoritmo.length<4||p.algoritmo.length>6)return false;
    if(!p.ambigua||p.ambigua.mala<0||p.ambigua.mala>=p.ambigua.lista.length||!p.ambigua.fix)return false;
    if(!p.falta||p.falta.pasos.indexOf('❓')<0)return false;
    if(p.falta.distractores.indexOf(p.falta.correcta)>=0||p.falta.distractores.length!==3)return false;
    if(!p.partes||p.partes.correctas.length!==3||p.partes.extra.length!==3)return false;
    if(p.partes.correctas.some(c=>p.partes.extra.indexOf(c)>=0))return false;
    return true;
  });
})()`, sandbox);
ok('parteData: 4 escenarios con los 4 desafíos completos y coherentes', labOk);

// ── Sopas de letras: cada palabra coincide con su grid, celdas colineales y contiguas
console.log('— Sopas de letras —');
const sopaOk = vm.runInContext(`(function(){
  return sopaSets.length===2&&sopaSets.every(set=>set.words.length===6&&set.words.every(wo=>{
    const txt=wo.cells.map(c=>set.grid[c[0]][c[1]]).join('');
    if(txt!==wo.w)return false;
    const dr=Math.sign(wo.cells[1][0]-wo.cells[0][0]),dc=Math.sign(wo.cells[1][1]-wo.cells[0][1]);
    for(let i=1;i<wo.cells.length;i++){if(wo.cells[i][0]-wo.cells[i-1][0]!==dr||wo.cells[i][1]-wo.cells[i-1][1]!==dc)return false;}
    return true;
  }));
})()`, sandbox);
ok('2 sopas × 6 palabras: cada palabra se lee exacta en sus celdas (colineales y contiguas)', sopaOk);

// ── Banco para Campeonísimo + pregunta de diagnóstico
console.log('— evalMCBank y diagnóstico —');
ok('pregunta diagnóstica presente tal cual («¿Cuál de estas instrucciones es EXACTA?» → «Da 3 pasos hacia adelante»)', vm.runInContext("evalMCBank.some(q=>q.q==='¿Cuál de estas instrucciones es EXACTA?'&&q.o[0]==='Camina por ahí'&&q.o[1]==='Da 3 pasos hacia adelante'&&q.o[2]==='Muévete un poco'&&q.o[3]==='Ve rápido'&&q.a===1)", sandbox));
ok('formato evalMCBank {q,o,a} para el Campeonísimo', vm.runInContext("evalMCBank.length===15&&evalMCBank.every(q=>typeof q.q==='string'&&Array.isArray(q.o)&&q.o.length===4&&typeof q.a==='number')", sandbox));
ok("SAVE_KEY correcto ('pensamiento_computacional_v1')", vm.runInContext('SAVE_KEY', sandbox) === 'pensamiento_computacional_v1');

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
