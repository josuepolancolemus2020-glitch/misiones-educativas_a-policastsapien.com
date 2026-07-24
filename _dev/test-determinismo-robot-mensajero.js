// Arnés de determinismo — Misión «Secuencias: el Robot Mensajero».
// Ejecutar: node _dev/test-determinismo-robot-mensajero.js
// Verifica (Node + vm, sin navegador):
//   · misma forma ejecutada 2 veces → salida idéntica (conceptual Y operativa)
//   · formas distintas → salidas distintas
//   · tras la Forma 30 vuelve la 1 (bucle exacto)
//   · puntajes de ambas pruebas suman 100
//   · el simulador y el planificador funcionan (nivel del lab resoluble)
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', '2y3ciclo-robot-mensajero', 'js', 'robot-mensajero.js'), 'utf8');
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

// ── Coherencia interna de los ítems deterministas
console.log('— Coherencia de los ítems generados —');
const cohEje = od.ejeItems.every(it => {
  const res = vm.runInContext(`(function(){const r=simRun({r:${it.sr},c:${it.sc},dir:'${it.dir}'},${JSON.stringify(it.prog)},{n:4});return r.ok?coordName(r.st.r,r.st.c):null;})()`, sandbox);
  return res === it.ans && it.opts.indexOf(it.ans) >= 0 && new Set(it.opts).size === 4;
});
ok('sección I: cada respuesta coincide con la simulación y está entre las 4 opciones', cohEje);
const cohBug = (() => {
  const b = od.retoB;
  const malaOk = vm.runInContext(`(function(){const r=simRun({r:${b.sr},c:${b.sc},dir:'${b.dir}'},${JSON.stringify(b.mala.slice(0, -1))},{n:4});return r.ok&&r.st.r===${b.dr}&&r.st.c===${b.dc};})()`, sandbox);
  const buenaOk = vm.runInContext(`(function(){const r=simRun({r:${b.sr},c:${b.sc},dir:'${b.dir}'},${JSON.stringify(b.buena.slice(0, -1))},{n:4});return r.ok&&r.st.r===${b.dr}&&r.st.c===${b.dc};})()`, sandbox);
  return !malaOk && buenaOk && b.mala[b.linea - 1] !== b.correcta && b.buena[b.linea - 1] === b.correcta;
})();
ok('reto del bug: el programa bueno llega y el corrupto NO', cohBug);
const cohCorto = (() => {
  const r = od.retoC;
  const llega = vm.runInContext(`(function(){const x=simRun({r:${r.sr},c:${r.sc},dir:'${r.dir}'},${JSON.stringify(r.prog.slice(0, -1))},{n:4});return x.ok&&x.st.r===${r.dr}&&x.st.c===${r.dc};})()`, sandbox);
  return llega && r.ans === r.prog.length && r.prog[r.prog.length - 1] === 'ENTREGA';
})();
ok('reto del camino corto: el programa ejemplo llega y ans = su longitud', cohCorto);

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
ok('sin Forma R (semillas 300000/400000 no usadas)', !code.includes('300000') && !code.includes('400000'));

// ── Impresión determinista: misma forma → mismo documento
docs = [];
runConceptual(9); vm.runInContext('printEval()', sandbox);
runConceptual(9); vm.runInContext('printEval()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
ok('misma forma → mismo documento impreso (conceptual)', docs[0] === docs[1]);
ok('misma forma → mismo documento impreso (operativa)', docs[2] === docs[3]);

// ── Lab: los 4 niveles son resolubles con el propio simulador
console.log('— Simulador del lab —');
const labOk = vm.runInContext(`(function(){
  return Object.keys(parteData).every(k=>{
    const nv=parteData[k];
    const mapa={n:nv.n,obst:nv.obst.map(o=>o[0]+','+o[1])};
    // búsqueda BFS de camino start→dest respetando obstáculos
    const vis=new Set();const q=[[nv.start.r,nv.start.c]];vis.add(nv.start.r+','+nv.start.c);
    while(q.length){const[r,c]=q.shift();if(r===nv.dest[0]&&c===nv.dest[1])return true;
      [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr,nc])=>{const key=nr+','+nc;
        if(nr>=0&&nr<nv.n&&nc>=0&&nc<nv.n&&!vis.has(key)&&mapa.obst.indexOf(key)<0){vis.add(key);q.push([nr,nc]);}});}
    return false;
  });
})()`, sandbox);
ok('los 4 niveles del lab tienen camino libre hasta la casa', labOk);
const simOk = vm.runInContext(`(function(){
  const r=simRun({r:4,c:2,dir:'N'},['AVANZA','AVANZA','AVANZA','ENTREGA'],{n:5,obst:['2,0','2,4']});
  return r.ok&&r.st.r===1&&r.st.c===2&&r.st.entregado===true;
})()`, sandbox);
ok('simulador: AVANZA×3 + ENTREGA desde C5 mirando N termina en C2 entregado', simOk);
ok('pregunta diagnóstica presente (Norte→AVANZA,GIRA DERECHA,AVANZA → Este)', vm.runInContext("evalMCBank.some(q=>q.q.includes('mira hacia arriba (Norte)')&&q.o[q.a].includes('Este'))", sandbox));
ok('pregunta diagnóstica presente (¿Qué es una secuencia?)', vm.runInContext("evalMCBank.some(q=>q.q.includes('¿Qué es una secuencia en programación?')&&q.o[q.a].toLowerCase().includes('orden'))", sandbox));
ok('formato evalMCBank {q,o,a} para el Campeonísimo', vm.runInContext("evalMCBank.length===15&&evalMCBank.every(q=>typeof q.q==='string'&&Array.isArray(q.o)&&q.o.length===4&&typeof q.a==='number')", sandbox));

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
