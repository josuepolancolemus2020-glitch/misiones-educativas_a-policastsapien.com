// Arnés de determinismo — Misión «Detective de Bugs: la Depuración».
// Ejecutar: node _dev/test-determinismo-detective-bugs.js
// Verifica (Node + vm, sin navegador):
//   · misma forma ejecutada 2 veces → salida idéntica (conceptual Y operativa, también impresas)
//   · formas distintas → salidas distintas · tras la Forma 30 vuelve la 1 (bucle exacto)
//   · pareados con derangement determinista: SIN puntos fijos en las 30 formas
//   · puntajes de ambas pruebas suman 100 · sin semillas de Forma R (300000/400000)
//   · colores tec en impresión · pauta .pa verde · encabezado «Programación» · SVG con «•»
//   · coherencia de la Sección I contra el simulador (la casilla del programa buggeado = pauta)
//   · Secciones II/III/V coherentes · en el Lab, cada caso corregido llega y el corrupto no
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', '2y3ciclo-detective-bugs', 'js', 'detective-bugs.js'), 'utf8');
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
ok('conteos 5+5+5+3 y 2 retos', od.fallItems.length === 5 && od.predItems.length === 5 && od.culpItems.length === 5 && od.corrigeItems.length === 3 && !!od.retoDos && !!od.retoLogica);
ok('puntaje operativa = 100 (5×4+5×2+5×4+3×10+10+10)', 5 * 4 + 5 * 2 + 5 * 4 + 3 * 10 + 10 + 10 === 100);

// ── Helpers para simular en el sandbox
function finCellOf(it) { return vm.runInContext(`(function(){const r=simRunX({r:${it.sr},c:${it.sc},dir:'${it.dir}'},${JSON.stringify(it.mala)},{n:4});return r.ok?coordName(r.st.r,r.st.c):null;})()`, sandbox); }
function reaches(prog, it) { return vm.runInContext(`(function(){const r=simRunX({r:${it.sr},c:${it.sc},dir:'${it.dir}'},${JSON.stringify(prog)},{n:4});return r.ok&&r.st.r===${it.dr}&&r.st.c===${it.dc};})()`, sandbox); }
function classOf(it) { return vm.runInContext(`(function(){const r=simRunX({r:${it.sr},c:${it.sc},dir:'${it.dir}'},${JSON.stringify(it.mala)},{n:4});return _opClaseFallo(${it.sr},${it.sc},${it.dr},${it.dc},r);})()`, sandbox); }
function runsOk(prog, it) { return vm.runInContext(`(function(){const r=simRunX({r:${it.sr},c:${it.sc},dir:'${it.dir}'},${JSON.stringify(prog)},{n:4});return r.ok;})()`, sandbox); }
const OP_FALLO_OPTS = vm.runInContext('OP_FALLO_OPTS', sandbox);

// ── Coherencia interna de los ítems (en varias formas)
console.log('— Coherencia de los ítems generados —');
let cohI = true, cohII = true, cohIII = true, cohDos = true, cohLog = true;
for (const f of [1, 7, 13, 22, 30]) {
  const d = JSON.parse(runOperativa(f));
  // I. El robot falló: la casilla escrita = simular el programa buggeado (y no llega al destino)
  d.fallItems.forEach(it => {
    if (finCellOf(it) !== it.ans) cohI = false;
    if (it.ans === vm.runInContext(`coordName(${it.dr},${it.dc})`, sandbox)) cohI = false; // termina en casilla equivocada
  });
  // II. Predice el fallo: la opción marcada = la clase real por simulación, y está entre las 3 opciones
  d.predItems.forEach(it => {
    const cls = classOf(it);
    if (cls < 0 || OP_FALLO_OPTS[cls] !== it.ans) cohII = false;
    if (OP_FALLO_OPTS.indexOf(it.ans) < 0) cohII = false;
  });
  // III. Señala al culpable: el bueno llega, el buggeado NO, y la línea señalada es la que difiere
  d.culpItems.forEach(it => {
    if (!reaches(it.buena, it)) cohIII = false;
    if (reaches(it.mala, it)) cohIII = false;
    if (it.mala[it.linea - 1] === it.buena[it.linea - 1]) cohIII = false;
    if (it.buena[it.linea - 1] !== it.correcta) cohIII = false;
    if (it.linea < 1 || it.linea > it.mala.length) cohIII = false;
  });
  // V(a). Dos bugs: el bueno llega, el de dos bugs NO; dos líneas distintas; correcciones = buena
  { const it = d.retoDos;
    if (!reaches(it.buena, it)) cohDos = false;
    if (reaches(it.mala, it)) cohDos = false;
    if (it.lineas.length !== 2 || it.lineas[0] === it.lineas[1]) cohDos = false;
    if (it.correcciones.length !== 2) cohDos = false;
    it.lineas.forEach((L, k) => { if (it.buena[L - 1] !== it.correcciones[k]) cohDos = false; }); }
  // V(b). Bug de lógica: corre SIN chocar, pero entrega en casilla distinta al destino
  { const it = d.retoLogica;
    if (!runsOk(it.mala, it)) cohLog = false;
    if (!it.entregaEn || it.entregaEn === it.destCell) cohLog = false;
    if (it.mala[it.lineaEntrega - 1] !== 'ENTREGA') cohLog = false; }
}
ok('Sección I: la casilla de la pauta coincide con simular el programa buggeado', cohI);
ok('Sección II: la clase marcada = la clase real por simulación (choca/se pasa/gira mal)', cohII);
ok('Sección III: el bueno llega, el buggeado NO y la línea señalada es la culpable única', cohIII);
ok('Reto dos bugs: el bueno llega, el de dos bugs NO llega, correcciones válidas', cohDos);
ok('Reto bug de lógica: corre sin chocar pero entrega en la casilla equivocada', cohLog);

// ── Lab / widgets de depuración: cada caso corregido llega y el corrupto no
console.log('— Lab: escena del crimen y widgets de depuración —');
const wgtOk = vm.runInContext(`(function(){
  const chk=d=>{const mala=[...d.buena];mala[d.bi]=d.malaInstr;return _casoLlega(d,d.buena)&&!_casoLlega(d,mala);};
  return _wgtCulpDefs.every(chk)&&_wgtFixDefs.every(chk);
})()`, sandbox);
ok('widgets ¿Línea culpable? y Corrige y gana: el bueno llega y el corrupto NO', wgtOk);
const labOk = vm.runInContext(`(function(){
  return Object.keys(parteData).every(k=>{
    const nv=parteData[k];const mapa={n:nv.n,obst:nv.obst.map(o=>o[0]+','+o[1])};
    const vis=new Set();const q=[[nv.start.r,nv.start.c]];vis.add(nv.start.r+','+nv.start.c);
    while(q.length){const[r,c]=q.shift();if(r===nv.dest[0]&&c===nv.dest[1])return true;
      [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr,nc])=>{const key=nr+','+nc;
        if(nr>=0&&nr<nv.n&&nc>=0&&nc<nv.n&&!vis.has(key)&&mapa.obst.indexOf(key)<0){vis.add(key);q.push([nr,nc]);}});}
    return false;
  });
})()`, sandbox);
ok('los 4 casos del laboratorio tienen camino libre hasta la casa', labOk);

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
ok('panel de resultado con texto exacto «Resultado: X/100 pts»', code.includes('Resultado: ${total}/100 pts'));

// ── Impresión determinista: misma forma → mismo documento
docs = [];
runConceptual(9); vm.runInContext('printEval()', sandbox);
runConceptual(9); vm.runInContext('printEval()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
ok('misma forma → mismo documento impreso (conceptual)', docs[0] === docs[1]);
ok('misma forma → mismo documento impreso (operativa)', docs[2] === docs[3]);

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
console.log('— evalMCBank y clave de guardado —');
ok('formato evalMCBank {q,o,a} (15 ítems, 4 opciones)', vm.runInContext("evalMCBank.length===15&&evalMCBank.every(q=>typeof q.q==='string'&&Array.isArray(q.o)&&q.o.length===4&&typeof q.a==='number')", sandbox));
ok('tema depuración presente (Grace Hopper / polilla en el banco)', vm.runInContext("evalMCBank.some(q=>q.q.toLowerCase().includes('grace hopper')||q.o.some(o=>o.toLowerCase().includes('polilla')))", sandbox));
ok("SAVE_KEY correcto ('detective_bugs_v1')", vm.runInContext('SAVE_KEY', sandbox) === 'detective_bugs_v1');

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
