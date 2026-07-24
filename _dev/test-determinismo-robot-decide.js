// Arnés de determinismo — Misión «Condicionales: el Robot Decide».
// Ejecutar: node _dev/test-determinismo-robot-decide.js
// Verifica (Node + vm, sin navegador):
//   · misma forma ×2 → salida idéntica (conceptual Y operativa) · formas distintas → distintas
//   · tras la Forma 30 vuelve la 1 · puntajes de ambas pruebas suman 100
//   · pareados con derangement determinista (sin puntos fijos en las 30 formas)
//   · sin Forma R (semillas 300000/400000) · colores de impresión tec · encabezado «Programación»
//   · coherencia de la sección I de la operativa contra el simulador con condicionales
//   · los 4 niveles del Lab son resolubles por código (solveSim) · sopas verificadas
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', '2y3ciclo-robot-decide', 'js', 'robot-decide.js'), 'utf8');
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

// ── Conceptual
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
// Derangement determinista en las 30 formas: pareados sin punto fijo
let sinPuntosFijos = true;
for (let f = 1; f <= 30; f++) {
  const d = JSON.parse(runConceptual(f));
  const terms = d.pr.terms, defs = d.pr.shuffledDefs;
  for (let i = 0; i < terms.length; i++) if (defs[i].def === terms[i].def) { sinPuntosFijos = false; break; }
}
ok('pareados sin puntos fijos en las 30 formas (derangement)', sinPuntosFijos);

// ── Operativa
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

// ── Coherencia interna
console.log('— Coherencia de los ítems generados —');
const cohEje = od.ejeItems.every(it => {
  const res = vm.runInContext(`(function(){const r=simRun({r:${it.sr},c:${it.sc},dir:'${it.dir}'},${JSON.stringify(it.prog)},{n:4,obst:${JSON.stringify(it.obstStr)}});return r.ok?coordName(r.st.r,r.st.c):null;})()`, sandbox);
  return res === it.ans && it.opts.indexOf(it.ans) >= 0 && new Set(it.opts).size === 4;
});
ok('sección I: cada respuesta coincide con el simulador (con condicional) y está entre las 4 opciones', cohEje);
const usaCondSecI = od.ejeItems.every(it => it.prog.some(p => p && typeof p === 'object' && p.cond));
ok('sección I: cada programa incluye UN condicional', usaCondSecI);
const cohCorto = vm.runInContext(`(function(){const r=${JSON.stringify(od.retoC)};const x=simRun({r:r.sr,c:r.sc,dir:r.dir},r.prog.slice(0,-1),{n:4,obst:r.obstStr});return x.ok&&x.st.r===r.dr&&x.st.c===r.dc&&r.ans===r.prog.length&&r.prog[r.prog.length-1]==='ENTREGA';})()`, sandbox);
ok('reto del laberinto: el programa ejemplo llega y ans = su longitud', cohCorto);
ok('reto del bug: la línea corregida difiere de la línea errada', od.retoB.correcta !== od.retoB.lines[od.retoB.linea - 1] && od.retoB.fixOpts.indexOf(od.retoB.correcta) >= 0);
const cohCompleta = od.cplItems.every(it => it.ans >= 0 && it.ans < it.opts.length && it.opts.length === 4);
ok('sección III: cada completa tiene 4 opciones y un índice válido', cohCompleta);
ok('sección IV: cada problema trae condición-pregunta + 2 ramas', od.vidaItems.every(it => /\?$/.test(it.cond) && it.si && it.no));

// ── Impresión
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

docs = [];
runConceptual(9); vm.runInContext('printEval()', sandbox);
runConceptual(9); vm.runInContext('printEval()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
ok('misma forma → mismo documento impreso (conceptual)', docs[0] === docs[1]);
ok('misma forma → mismo documento impreso (operativa)', docs[2] === docs[3]);

// ── Lab
console.log('— Simulador del lab —');
const labSol = vm.runInContext(`Object.keys(parteData).every(k=>{const nv=parteData[k];const map={n:nv.n,obst:(nv.obst||[]).map(o=>o[0]+','+o[1]),cross:(nv.cross||[]).map(o=>o[0]+','+o[1]),semFase:nv.semFase||0};return !!solveSim(nv.start,nv.dest,map,26);})`, sandbox);
ok('los 4 niveles del lab son resolubles por código (solveSim con condicionales)', labSol);
const simCond = vm.runInContext(`(function(){
  // SI HAY PARED ADELANTE (árbol en C3) → GIRA DERECHA, SINO → AVANZA; desde C5 mirando N
  const r=simRun({r:4,c:2,dir:'N'},[C_PARED,C_PARED],{n:5,obst:['2,2']});
  return r.ok&&r.st.r===3&&r.st.c===2; // avanza N a (3,2) sin pared, luego pared en (2,2)→gira E
})()`, sandbox);
ok('simulador: el condicional de pared rodea el árbol', simCond);
const simSem = vm.runInContext(`(function(){
  // semaforo en (2,2) fase 1 (tick0 rojo). En AVANZA hacia el cruce en rojo debe bloquear
  const rojo=simStep({r:3,c:2,dir:'N',tick:0},'AVANZA',{n:5,cross:['2,2'],semFase:1});
  const verde=simStep({r:3,c:2,dir:'N',tick:1},'AVANZA',{n:5,cross:['2,2'],semFase:1});
  return rojo.evento==='rojo'&&!verde.evento&&verde.r===2&&verde.c===2;
})()`, sandbox);
ok('simulador: el semáforo bloquea en rojo y deja pasar en verde', simSem);

// ── evalMCBank
ok('pregunta obligatoria presente (SI hay pared... NO tiene pared → Avanza)', vm.runInContext("evalMCBank.some(q=>q.q.includes('El robot NO tiene pared adelante')&&q.o[q.a]==='Avanza')", sandbox));
ok('pregunta diagnóstica presente (¿Qué es un condicional?)', vm.runInContext("evalMCBank.some(q=>q.q.includes('¿Qué es un condicional?')&&q.o[q.a].toLowerCase().includes('decidir'))", sandbox));
ok('formato evalMCBank {q,o,a} para el Campeonísimo', vm.runInContext("evalMCBank.length===15&&evalMCBank.every(q=>typeof q.q==='string'&&Array.isArray(q.o)&&q.o.length===4&&typeof q.a==='number')", sandbox));

// ── Sopas verificadas
console.log('— Sopas de letras —');
const sopaOk = vm.runInContext(`sopaSets.every(set=>set.words.every(w=>{
  const letras=w.cells.map(([r,c])=>set.grid[r][c]).join('');
  if(letras!==w.w)return false;
  // colinealidad en 8 direcciones
  const dr=Math.sign(w.cells[1][0]-w.cells[0][0]),dc=Math.sign(w.cells[1][1]-w.cells[0][1]);
  return w.cells.every(([r,c],i)=>r===w.cells[0][0]+dr*i&&c===w.cells[0][1]+dc*i);
}))`, sandbox);
ok('cada palabra de las 2 sopas coincide con su grid y es colineal (8 direcciones)', sopaOk);
ok('sopas sin tildes en mayúsculas', vm.runInContext("sopaSets.every(s=>s.words.every(w=>/^[A-Z]+$/.test(w.w)))", sandbox));

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
