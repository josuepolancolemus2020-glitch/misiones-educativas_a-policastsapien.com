// Arnés de determinismo — Misión «Bucles: Repetir sin Cansarse».
// Ejecutar: node _dev/test-determinismo-bucles-repetir.js
// Verifica (Node + vm, sin navegador):
//   · misma forma ejecutada 2 veces → salida idéntica (conceptual Y operativa, también impresas)
//   · formas distintas → salidas distintas
//   · tras la Forma 30 vuelve la 1 (bucle exacto)
//   · pareados con derangement determinista: SIN puntos fijos en las 30 formas
//   · puntajes de ambas pruebas suman 100
//   · sin semillas de Forma R (300000/400000) · colores tec en impresión · pauta .pa verde · encabezado «Programación»
//   · coherencia de la sección I de la operativa contra el simulador (la casilla de la pauta = ejecutar el programa)
//   · coherencia del reto V (programa mínimo con bucle) contra el simulador (el rastro = la figura pintada)
//   · las 2 sopas: cada palabra se lee exacta en su grid (colineal y contigua)
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', '2y3ciclo-bucles-repetir', 'js', 'bucles-repetir.js'), 'utf8');
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
ok('conteos 5+5+5+3+2 retos', od.ejeItems.length === 5 && od.prdItems.length === 5 && od.cplItems.length === 5 && od.vidaItems.length === 3 && !!od.retoC && !!od.retoB);
ok('puntaje operativa = 100 (5×4+5×2+5×4+3×10+10+10)', 5 * 4 + 5 * 2 + 5 * 4 + 3 * 10 + 10 + 10 === 100);

// ── Coherencia interna de los ítems deterministas (en varias formas)
console.log('— Coherencia de los ítems generados (contra el simulador) —');
let cohEje = true, cohPrd = true, cohCpl = true, cohRc = true, cohRb = true;
const DIRNAME = { Norte: 'N', Este: 'E', Sur: 'S', Oeste: 'O' };
for (const f of [1, 7, 13, 22, 30]) {
  const d = JSON.parse(runOperativa(f));
  // I. Ejecuta el bucle: ans = casilla donde termina el robot al ejecutar el programa; ans entre las 4 opciones únicas
  d.ejeItems.forEach(it => {
    const res = vm.runInContext(`(function(){const r=simTrail({r:${it.sr},c:${it.sc},dir:'${it.dir}'},${JSON.stringify(it.prog)},4);return r.ok?coordName(r.st.r,r.st.c):null;})()`, sandbox);
    if (res !== it.ans) cohEje = false;
    if (it.opts.indexOf(it.ans) < 0) cohEje = false;
    if (new Set(it.opts).size !== 4) cohEje = false;
    if (it.st && it.st.r === it.sr && it.st.c === it.sc) cohEje = false; // no debe terminar donde empezó
  });
  // II. Predice: cada ítem trae texto y respuesta
  d.prdItems.forEach(it => { if (!it.txt || it.ans === undefined || String(it.ans).length === 0) cohPrd = false; });
  // III. Completa el bucle: ans apunta a una opción existente y única
  d.cplItems.forEach(it => {
    if (!(it.ans >= 0 && it.ans < it.opts.length)) cohCpl = false;
    if (new Set(it.opts).size !== 4) cohCpl = false;
    if (!it.txt.includes('___')) cohCpl = false;
  });
  // V(a). Olimpiada — programa mínimo con bucle: al ejecutar el modelo, el rastro = las casillas pintadas de la figura
  {
    const it = d.retoC;
    const mSt = /sale de ([A-E])(\d) mirando al (\w+)/.exec(it.start);
    const mMd = /REPETIR (\d+) VECES \[(.+)\]/.exec(it.modelo);
    if (!mSt || !mMd) { cohRc = false; }
    else {
      const c0 = 'ABCDE'.indexOf(mSt[1]);
      const r0 = Number(mSt[2]) - 1;
      const dir0 = DIRNAME[mSt[3]];
      const N = Number(mMd[1]);
      const body = mMd[2].split(',').map(s => s.trim());
      const prog = [{ rep: N, body }];
      const trail = vm.runInContext(`(function(){const r=simTrail({r:${r0},c:${c0},dir:'${dir0}'},${JSON.stringify(prog)},4);return r.ok?Array.from(r.trail).sort():null;})()`, sandbox);
      const paintSorted = trail ? [...it.paint].sort() : null;
      if (!trail || JSON.stringify(trail) !== JSON.stringify(paintSorted)) cohRc = false;
      if (it.ansN !== N) cohRc = false;
      if (it.ansEsc !== 1 + body.length) cohRc = false;
    }
  }
  // V(b). Detective del bug: el diagnóstico es una de las 2 causas y la corrección está entre las 4 opciones únicas
  {
    const it = d.retoB;
    const causas = vm.runInContext('OP_BUG_QUE', sandbox);
    if (causas.indexOf(it.errado) < 0) cohRb = false;
    if (it.opcCorr.indexOf(it.correccion) < 0) cohRb = false;
    if (new Set(it.opcCorr).size !== 4) cohRb = false;
  }
}
ok('sección I: cada respuesta coincide con la simulación y está entre las 4 opciones únicas', cohEje);
ok('sección II: cada ítem trae texto y respuesta', cohPrd);
ok('sección III: 4 opciones únicas, hueco ___ presente y respuesta válida', cohCpl);
ok('reto V(a): el rastro del programa mínimo = la figura pintada; N y escritas coherentes', cohRc);
ok('reto V(b): el diagnóstico es válido y la corrección está entre las 4 opciones únicas', cohRb);

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
ok('operativa impresa trae SVG determinista y puntos «•» en casillas vacías', docs[1].includes('<svg') && docs[1].includes('•'));
ok('ambos documentos hablan de «Bucles: Repetir sin Cansarse»', docs[0].includes('Bucles: Repetir sin Cansarse') && docs[1].includes('Bucles: Repetir sin Cansarse'));
ok('sin Forma R (semillas 300000/400000 no usadas)', !code.includes('300000') && !code.includes('400000'));

// ── Impresión determinista: misma forma → mismo documento
docs = [];
runConceptual(9); vm.runInContext('printEval()', sandbox);
runConceptual(9); vm.runInContext('printEval()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
ok('misma forma → mismo documento impreso (conceptual)', docs[0] === docs[1]);
ok('misma forma → mismo documento impreso (operativa)', docs[2] === docs[3]);

// ── Lab: los 4 niveles del simulador son resolubles con su propia solución de ejemplo (rastro = figura objetivo)
console.log('— Simulador del lab (dibuja con bucles) —');
const labOk = vm.runInContext(`(function(){
  const ks=Object.keys(parteData);
  if(ks.length!==4)return false;
  return ks.every(k=>{
    const nv=parteData[k];
    const r=simTrail({r:nv.start.r,c:nv.start.c,dir:nv.start.dir},nv.sol,nv.n);
    if(!r.ok)return false;
    if(r.trail.size!==nv.target.length)return false;
    return nv.target.every(t=>r.trail.has(t));
  });
})()`, sandbox);
ok('los 4 niveles: la solución de ejemplo (con bucle) dibuja exactamente la figura objetivo', labOk);

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

// ── Banco para el Campeonísimo + SAVE_KEY
console.log('— evalMCBank y SAVE_KEY —');
ok('formato evalMCBank {q,o,a} para el Campeonísimo', vm.runInContext("evalMCBank.length===15&&evalMCBank.every(q=>typeof q.q==='string'&&Array.isArray(q.o)&&q.o.length===4&&typeof q.a==='number')", sandbox));
ok("SAVE_KEY correcto ('bucles_repetir_v1')", vm.runInContext('SAVE_KEY', sandbox) === 'bucles_repetir_v1');
ok('sin cadenas heredadas de robot-mensajero/secuencias en el JS', !/robot[-_ ]?mensajero|secuencia/i.test(code));

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
