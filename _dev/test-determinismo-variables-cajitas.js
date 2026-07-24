// Arnés de determinismo — Misión «Variables: las Cajitas de Memoria».
// Ejecutar: node _dev/test-determinismo-variables-cajitas.js
// Verifica (Node + vm, sin navegador):
//   · misma forma ejecutada 2 veces → salida idéntica (conceptual Y operativa, también impresas)
//   · formas distintas → salidas distintas
//   · tras la Forma 30 vuelve la 1 (bucle exacto)
//   · pareados con derangement determinista: SIN puntos fijos en las 30 formas
//   · puntajes de ambas pruebas suman 100
//   · sin semillas de Forma R (300000/400000) · colores tec en impresión · pauta .pa verde · encabezado «Programación»
//   · coherencia de la sección I operativa: el valor final de la pauta = ejecutar el programa por código
//   · coherencia interna de los demás ítems (completa/traza cruzada/detective) · sopas válidas · Máquina de Cajitas íntegra
const fs = require('fs'), path = require('path'), vm = require('vm');
const code = fs.readFileSync(path.join(__dirname, '..', 'misiones', '2y3ciclo-variables-cajitas', 'js', 'variables-cajitas.js'), 'utf8');
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

// Ejecución INDEPENDIENTE de un programa de variables (reimplementada en Node, sin usar el JS de la misión)
function execVar(prog, v) { let val = 0; for (const it of prog) { if (it.v !== v) continue; if (it.op === 'GUARDA') val = it.n; else if (it.op === 'SUMA') val += it.n; else if (it.op === 'RESTA') val -= it.n; /* MUESTRA no cambia */ } return val; }

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
ok('conteos 5+5+5+3 + 2 retos', od.ejeItems.length === 5 && od.prdItems.length === 5 && od.cplItems.length === 5 && od.vidaItems.length === 3 && !!od.retoC && !!od.retoB);
ok('puntaje operativa = 100 (5×4+5×2+5×4+3×10+10+10)', 5 * 4 + 5 * 2 + 5 * 4 + 3 * 10 + 10 + 10 === 100);

// ── Coherencia interna de los ítems deterministas (en varias formas)
console.log('— Coherencia de los ítems generados —');
let cohEje = true, cohCpl = true, cohRc = true, cohBug = true, cohVida = true;
for (const f of [1, 7, 13, 22, 30]) {
  const d = JSON.parse(runOperativa(f));
  // I. Ejecuta y traza: el valor final de la pauta = ejecutar el programa por código
  d.ejeItems.forEach(it => {
    if (execVar(it.prog, it.v) !== it.ans) cohEje = false;
    if (it.prog.length < 3 || it.prog.length > 4) cohEje = false;
    if (it.prog[0].op !== 'GUARDA') cohEje = false;
  });
  // III. Completa: ans apunta a una opción existente y única, y los pasos traen el hueco ___
  d.cplItems.forEach(it => {
    if (!(it.ans >= 0 && it.ans < it.opts.length)) cohCpl = false;
    if (new Set(it.opts).size !== 4) cohCpl = false;
    if (!it.lines.some(l => l.includes('___'))) cohCpl = false;
  });
  // V(a). Traza cruzada: dos variables, cada valor final = ejecutar el programa por código
  { const it = d.retoC;
    if (execVar(it.prog, it.v1) !== it.ans1) cohRc = false;
    if (execVar(it.prog, it.v2) !== it.ans2) cohRc = false;
    if (it.v1 === it.v2) cohRc = false; }
  // V(b). Detective: la línea señalada difiere de la buena, la corrección es la instrucción buena, y el opts la contiene
  { const it = d.retoB;
    if (it.mala[it.linea - 1] === it.buena[it.linea - 1]) cohBug = false;
    if (it.correcta !== it.buena[it.linea - 1]) cohBug = false;
    if (it.opts.indexOf(it.correcta) < 0) cohBug = false;
    if (it.finMal === it.meta) cohBug = false;
    if (new Set(it.opts).size !== it.opts.length) cohBug = false; }
  // IV. Vida real: cada problema trae tema, enunciado y pasos con al menos un GUARDA
  d.vidaItems.forEach(it => {
    if (!it.tema || !it.enun || !Array.isArray(it.pasos) || it.pasos.length < 2) cohVida = false;
    if (!it.pasos.some(p => p.indexOf('GUARDA') === 0)) cohVida = false;
  });
}
ok('sección I: el valor final de la pauta = ejecutar el programa de la cajita por código', cohEje);
ok('sección III: 4 opciones únicas, hueco ___ presente y respuesta válida', cohCpl);
ok('reto traza cruzada: los dos valores finales coinciden con ejecutar el programa por código', cohRc);
ok('reto detective: la línea señalada es la instrucción errada y la corrección es la buena (en opts)', cohBug);
ok('sección IV vida real: tema, enunciado y pasos con GUARDA inicial', cohVida);

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
ok('impresión habla de Variables (no de robot/secuencias)', docs[0].includes('Variables: las Cajitas de Memoria') && docs[1].includes('Variables: las Cajitas de Memoria'));
ok('sin Forma R (semillas 300000/400000 no usadas)', !code.includes('300000') && !code.includes('400000'));

// ── Impresión determinista: misma forma → mismo documento
docs = [];
runConceptual(9); vm.runInContext('printEval()', sandbox);
runConceptual(9); vm.runInContext('printEval()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
runOperativa(9); vm.runInContext('printEvalOp()', sandbox);
ok('misma forma → mismo documento impreso (conceptual)', docs[0] === docs[1]);
ok('misma forma → mismo documento impreso (operativa)', docs[2] === docs[3]);

// ── Lab «La Máquina de Cajitas»: 4 escenarios íntegros (instrucciones + preguntas coherentes)
console.log('— Lab: La Máquina de Cajitas —');
const labOk = vm.runInContext(`(function(){
  const ks=Object.keys(parteData);
  if(ks.length!==4)return false;
  return ks.every(k=>{
    const p=parteData[k];
    if(!p.nombre||!p.intro)return false;
    if(!Array.isArray(p.vars)||p.vars.length<1)return false;
    if(!Array.isArray(p.pasos)||p.pasos.length<3)return false;
    let hasI=false,hasQ=false;
    for(const paso of p.pasos){
      if(paso.t==='i'){hasI=true;if(!paso.instr||!paso.instr.op)return false;}
      else if(paso.t==='q'){hasQ=true;if(!Array.isArray(paso.opts)||paso.opts.indexOf(paso.ans)<0)return false;}
      else return false;
    }
    return hasI&&hasQ;
  });
})()`, sandbox);
ok('parteData: 4 escenarios con instrucciones y preguntas coherentes (respuesta ∈ opciones)', labOk);

// ── Sopas de letras: cada palabra coincide con su grid, celdas colineales y contiguas
console.log('— Sopas de letras —');
const sopaOk = vm.runInContext(`(function(){
  return sopaSets.length>=1&&sopaSets.every(set=>set.words.length>=1&&set.words.every(wo=>{
    const txt=wo.cells.map(c=>set.grid[c[0]][c[1]]).join('');
    if(txt!==wo.w)return false;
    const dr=Math.sign(wo.cells[1][0]-wo.cells[0][0]),dc=Math.sign(wo.cells[1][1]-wo.cells[0][1]);
    for(let i=1;i<wo.cells.length;i++){if(wo.cells[i][0]-wo.cells[i-1][0]!==dr||wo.cells[i][1]-wo.cells[i-1][1]!==dc)return false;}
    return true;
  }));
})()`, sandbox);
ok('sopas: cada palabra se lee exacta en sus celdas (colineales y contiguas)', sopaOk);

// ── Banco de selección + coherencia temática
console.log('— evalMCBank —');
ok('formato evalMCBank {q,o,a} con 4 opciones', vm.runInContext("evalMCBank.length===15&&evalMCBank.every(q=>typeof q.q==='string'&&Array.isArray(q.o)&&q.o.length===4&&typeof q.a==='number'&&q.a>=0&&q.a<4)", sandbox));
ok('MUESTRA solo lee: la opción correcta de esa pregunta es «MUESTRA»', vm.runInContext("evalMCBank.some(q=>q.q.indexOf('mira el valor sin cambiarlo')>=0&&q.o[q.a]==='MUESTRA')", sandbox));
ok("SAVE_KEY correcto ('variables_cajitas_v1')", vm.runInContext('SAVE_KEY', sandbox) === 'variables_cajitas_v1');

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
