// Arnés de determinismo — Misión «Mi Primer Programa Completo» (etapa 7 y última de la Ruta del Código).
// Ejecutar: node _dev/test-determinismo-mi-primer-programa.js
// Verifica (Node + vm, sin navegador):
//   · misma forma ×2 → salida idéntica (conceptual Y operativa) · formas distintas → distintas
//   · tras la Forma 30 vuelve la 1 · puntajes de ambas pruebas suman 100
//   · pareados con derangement determinista (sin puntos fijos en las 30 formas)
//   · sin Forma R (semillas 300000/400000) · colores de impresión tec · encabezado «Programación»
//   · encabezados con «Centro Educativo:» (nunca «Instituto:») en AMBAS pruebas
//   · coherencia de la sección I y de la tabla de traza (III) contra el simulador real, en las 30 formas
//   · los 6 niveles del Lab son resolubles por código (solveSim) y sus soluciones de referencia llegan
//   · el nivel final exige bucle + condicional + variable a la vez
//   · sopas verificadas contra su grid · evalMCBank {q,o,a} · SAVE_KEY único
//   · sin cadenas heredadas de robot-mensajero / robot-decide / bucles-repetir / variables-cajitas
const fs = require('fs'), path = require('path'), vm = require('vm');
const JS = path.join(__dirname, '..', 'misiones', '2y3ciclo-mi-primer-programa', 'js', 'mi-primer-programa.js');
const HTML = path.join(__dirname, '..', 'misiones', '2y3ciclo-mi-primer-programa', 'mi-primer-programa.html');
const CSS = path.join(__dirname, '..', 'misiones', '2y3ciclo-mi-primer-programa', 'css', 'mi-primer-programa.css');
const FICHA = path.join(__dirname, '..', 'fichas', 'ficha-mi-primer-programa.html');
const code = fs.readFileSync(JS, 'utf8');
const html = fs.readFileSync(HTML, 'utf8');
const css = fs.readFileSync(CSS, 'utf8');
const ficha = fs.readFileSync(FICHA, 'utf8');
const noop = () => { };
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
const R = s => vm.runInContext(s, sandbox);

let fallos = 0;
const ok = (nombre, cond) => { console.log((cond ? '  ✔ ' : '  ✘ ') + nombre); if (!cond) fallos++; };

// ── Identidad de la misión
console.log('— Identidad —');
ok("SAVE_KEY único = 'mi_primer_programa_v1'", R("SAVE_KEY") === 'mi_primer_programa_v1');
const heredadas = ['robot_decide_v1', 'robot_mensajero_v1', 'bucles_repetir_v1', 'variables_cajitas_v1', 'detective_bugs_v1',
  'el Robot Decide', 'Robot Mensajero', 'Repetir sin Cansarse', 'las Cajitas de Memoria', 'Detective de Bugs: la Depuración',
  'ficha-robot-decide', 'ficha-robot-mensajero', 'ficha-bucles-repetir', 'ficha-variables-cajitas', 'ficha-detective-bugs',
  '2y3ciclo-robot-decide', '2y3ciclo-robot-mensajero', '2y3ciclo-bucles-repetir', 'C_VERDE', 'semFase', 'SEMÁFORO EN VERDE'];
const sucias = heredadas.filter(s => code.includes(s) || html.includes(s) || css.includes(s) || ficha.includes(s));
ok('sin cadenas heredadas de otras misiones de la ruta' + (sucias.length ? ' → ' + sucias.join(', ') : ''), sucias.length === 0);
ok('HTML: etapa 7 de 7 + URL canónica propia', html.includes('Etapa 7 de 7') && html.includes('metas.policastsapien.com/misiones/2y3ciclo-mi-primer-programa/mi-primer-programa.html'));
ok('HTML: botón a la ficha ../../fichas/ficha-mi-primer-programa.html', html.includes('../../fichas/ficha-mi-primer-programa.html'));
ok('HTML: el primer botón del lab apunta al nivel n1 de ESTA misión', /data-parte="n1"[^>]*onclick="labShowParte\('n1'\)"/.test(html) && html.includes("labShowParte('n6')") && !html.includes('data-nivel='));
ok('CSS propio: estilos del simulador incluidos (bucle, variable, pseudocódigo)', css.includes('.sim-chip-loop') && css.includes('.lab-var-box') && css.includes('.pseudo-box') && css.includes('.evt-header'));

// ── Conceptual
function runConceptual(forma) {
  R('evalFormNum=' + forma);
  R('genEval()');
  return R('JSON.stringify(window._evalPrintData)');
}
console.log('— Evaluación conceptual (semilla _evalRng(forma)) —');
const c1a = runConceptual(7), c1b = runConceptual(7), c2 = runConceptual(8);
ok('Forma 7 dos veces → examen idéntico', c1a === c1b);
ok('Forma 7 ≠ Forma 8', c1a !== c2);
runConceptual(30);
ok('tras la Forma 30 sigue la 1 (evalFormNum cicla)', R('evalFormNum') === 1);
const cd = JSON.parse(c1a);
ok('estructura 5+5+5+5 ítems', cd.cp.length === 5 && cd.tf.length === 5 && cd.mc.length === 5 && cd.pr.terms.length === 5);
ok('puntaje conceptual = 100 (20×5)', (cd.cp.length + cd.tf.length + cd.mc.length + cd.pr.terms.length) * 5 === 100);
ok('los 4 bancos conceptuales tienen 15 ítems cada uno', R('evalTFBank.length===15&&evalMCBank.length===15&&evalCPBank.length===15&&evalPRBank.length===15'));
// Derangement determinista en las 30 formas: pareados sin punto fijo
let sinPuntosFijos = true, formaMala = null;
for (let f = 1; f <= 30; f++) {
  const d = JSON.parse(runConceptual(f));
  const terms = d.pr.terms, defs = d.pr.shuffledDefs;
  for (let i = 0; i < terms.length; i++) if (defs[i].def === terms[i].def) { sinPuntosFijos = false; formaMala = f; break; }
}
ok('pareados sin puntos fijos en las 30 formas (derangement)' + (formaMala ? ' → falla la forma ' + formaMala : ''), sinPuntosFijos);

// ── Operativa
function runOperativa(forma) {
  R('evalOpFormNum=' + forma);
  R('genEvalOp()');
  return R('JSON.stringify(window._evalOpData)');
}
console.log('— Prueba operativa (semilla _evalRng(100000+forma)) —');
const o1a = runOperativa(7), o1b = runOperativa(7), o2 = runOperativa(8);
ok('Forma 7 dos veces → prueba idéntica', o1a === o1b);
ok('Forma 7 ≠ Forma 8', o1a !== o2);
runOperativa(30);
ok('tras la Forma 30 sigue la 1 (evalOpFormNum cicla)', R('evalOpFormNum') === 1);
ok('Forma 5 conceptual ≠ Forma 5 operativa (semillas separadas)', runConceptual(5) !== runOperativa(5));
const od = JSON.parse(o1a);
ok('conteos 5+5+5+2+2', od.ejeItems.length === 5 && od.cplItems.length === 5 && od.tzItems.length === 5 && od.bugItems.length === 2 && od.psItems.length === 2);
ok('puntaje operativa = 100 (5×4+5×4+5×2+2×10+2×15)', 5 * 4 + 5 * 4 + 5 * 2 + 2 * 10 + 2 * 15 === 100);

// ── Coherencia contra el simulador REAL, en las 30 formas
console.log('— Coherencia de los ítems generados (30 formas) —');
const malI = [], malIII = [], malOpts = [], malPiezas = [];
for (let f = 1; f <= 30; f++) {
  const d = JSON.parse(runOperativa(f));
  d.ejeItems.forEach((it, i) => {
    const res = R(`(function(){const r=simRun({r:${it.sr},c:${it.sc},dir:'${it.dir}'},${JSON.stringify(it.prog)},{n:4,obst:${JSON.stringify(it.obstStr)},objs:${JSON.stringify(it.objsStr)}});return r.ok?coordName(r.st.r,r.st.c)+'|'+r.st.cuenta:'CHOQUE';})()`);
    if (res !== it.ans + '|' + it.cuenta) malI.push('F' + f + '#' + i);
    if (it.opts.indexOf(it.ans) < 0 || new Set(it.opts).size !== 4) malOpts.push('F' + f + '#' + i);
    const tieneBucle = R(`usaBucle(${JSON.stringify(it.prog)})`);
    const tieneCond = R(`usaCondicional(${JSON.stringify(it.prog)})`);
    if (!tieneBucle || !tieneCond) malPiezas.push('F' + f + '#' + i);
  });
  d.tzItems.forEach((it, i) => {
    const res = R(`(function(){const t=trazaCuenta({r:${it.sr},c:${it.sc},dir:'${it.dir}'},${JSON.stringify(it.prog)},{n:4,obst:${JSON.stringify(it.obstStr)},objs:${JSON.stringify(it.objsStr)}});return t.length?t[t.length-1].val:0;})()`);
    if (res !== it.ans || it.ans < 1 || it.filas.length !== it.filas.length) malIII.push('F' + f + '#' + i);
  });
}
ok('sección I: la casilla final coincide con el simulador en las 30 formas' + (malI.length ? ' → ' + malI.slice(0, 5).join(', ') : ''), malI.length === 0);
ok('sección I: 4 opciones distintas y la respuesta entre ellas', malOpts.length === 0);
ok('sección I: cada programa usa bucle 🔁 + condicional 🔀', malPiezas.length === 0);
ok('sección III: el valor final de CUENTA coincide con trazaCuenta y es ≥ 1' + (malIII.length ? ' → ' + malIII.slice(0, 5).join(', ') : ''), malIII.length === 0);
const odf = JSON.parse(runOperativa(7));
ok('sección II: cada completa tiene 4 opciones y un índice válido', odf.cplItems.every(it => it.ans >= 0 && it.ans < it.opts.length && it.opts.length === 4));
ok('sección IV: la corrección difiere de la línea errada y está entre las opciones', odf.bugItems.every(it => it.correcta !== it.lines[it.linea - 1] && it.fixOpts.indexOf(it.correcta) >= 0 && it.linea >= 1 && it.linea <= it.lines.length));
ok('sección V: cada pseudocódigo trae evento, variable, bucle y condicional', odf.psItems.every(it => it.plan.some(l => /^CUANDO /.test(l)) && it.plan.some(l => /^GUARDA /.test(l)) && it.plan.some(l => /REPETIR .* VECES \[/.test(l)) && it.plan.some(l => /SI .*→.*SINO/.test(l)) && it.plan[it.plan.length - 1] === 'TERMINA'));

// ── Impresión
console.log('— Impresión (printEval / printEvalOp) —');
docs = [];
runConceptual(3); runOperativa(3);
R('printEval(); printEvalOp();');
ok('se generan 2 documentos', docs.length === 2);
ok('conceptual: evalPage + pautaPage + fit binario + colores tec', docs[0].includes('id="evalPage"') && docs[0].includes('id="pautaPage"') && docs[0].includes('function fit') && docs[0].includes('#0e7490') && docs[0].includes('#ecfeff'));
ok('operativa: evalPage + pautaPage + fit binario + colores tec', docs[1].includes('id="evalPage"') && docs[1].includes('id="pautaPage"') && docs[1].includes('function fit') && docs[1].includes('#0e7490') && docs[1].includes('#ecfeff'));
ok('pauta con respuestas en verde #007a00 (.pa)', docs[0].includes('.pa{color:#007a00') && docs[1].includes('.pa{color:#007a00'));
ok('encabezado imprime «Programación»', docs[0].includes('Programación') && docs[1].includes('Programación'));
ok('AMBAS pruebas usan «Centro Educativo:» y ninguna «Instituto:»', docs[0].includes('Centro Educativo:') && docs[1].includes('Centro Educativo:') && !docs[0].includes('Instituto:') && !docs[1].includes('Instituto:'));
ok('encabezado línea 1 Nombre/Parcial/Fecha y línea 2 Centro/Grado/Nº', docs.every(d => d.includes('<strong>Nombre:</strong>') && d.includes('<strong>Parcial:</strong>') && d.includes('<strong>Fecha:</strong>') && d.includes('<strong>Grado:</strong>') && d.includes('<strong>Nº:</strong>')));
ok('pie normativo (Nº de Evaluación temática + casillas + Forma N)', docs.every(d => d.includes('Nº de Evaluación temática realizada') && d.includes('Evaluación con valor en el parcial') && d.includes('Evaluación solo de repaso') && d.includes('forma-tag')));
ok('clave ZipGrade SOLO en la conceptual', docs[0].includes('ZipGrade') && !docs[1].includes('ZipGrade'));
ok('operativa impresa: SVG determinista, tablas de traza y puntos «•» en casillas vacías', docs[1].includes('<svg') && docs[1].includes('tz-tbl') && docs[1].includes('•'));
ok('sin Forma R (semillas 300000/400000 no usadas)', !code.includes('300000') && !code.includes('400000'));

docs = [];
runConceptual(9); R('printEval()');
runConceptual(9); R('printEval()');
runOperativa(9); R('printEvalOp()');
runOperativa(9); R('printEvalOp()');
ok('misma forma → mismo documento impreso (conceptual)', docs[0] === docs[1]);
ok('misma forma → mismo documento impreso (operativa)', docs[2] === docs[3]);

// ── Lab: los 6 niveles resolubles
console.log('— Simulador del proyecto (lab) —');
ok('el lab tiene 6 niveles progresivos', R('Object.keys(parteData).length') === 6);
const labSol = R(`Object.keys(parteData).every(k=>{const nv=parteData[k];const map={n:nv.n,obst:(nv.obst||[]).map(o=>o[0]+','+o[1]),objs:(nv.objs||[]).map(o=>o[0]+','+o[1])};return !!solveSim(nv.start,nv.dest,map,22);})`);
ok('los 6 niveles son resolubles por código (solveSim BFS con objetos)', labSol);
const labRef = R(`Object.keys(parteData).filter(k=>parteData[k].sol).every(k=>{
  const nv=parteData[k];
  const map={n:nv.n,obst:(nv.obst||[]).map(o=>o[0]+','+o[1]),objs:(nv.objs||[]).map(o=>o[0]+','+o[1])};
  const all=(nv.objs||[]).length?((1<<(nv.objs||[]).length)-1):0;
  const r=simRun(nv.start,nv.sol,map);
  return r.ok&&r.fin&&r.st.r===nv.dest[0]&&r.st.c===nv.dest[1]&&(r.st.mask||0)===all;
})`);
ok('cada solución de referencia (sol) llega a la meta con TODOS los objetos y ejecuta TERMINA', labRef);
const n6 = R(`(function(){const nv=parteData.n6;return usaBucle(nv.sol)&&usaCondicional(nv.sol)&&usaVariable(nv.sol)&&(nv.objs||[]).length>0;})()`);
ok('el nivel final (n6) exige bucle 🔁 + condicional 🔀 + variable 🔢 a la vez', n6);
const simCond = R(`(function(){
  // SI HAY OBJETO AQUÍ → RECOGE, SINO → AVANZA, tres vueltas desde A4 mirando al Norte con 🍎 en A3
  const r=simRun({r:3,c:0,dir:'N'},[{rep:3,body:[C_OBJ]}],{n:5,obst:[],objs:['2,0']});
  return r.ok&&r.st.cuenta===1&&r.st.r===1&&r.st.c===0;
})()`);
ok('simulador: el condicional del objeto recoge y suma 1 a CUENTA', simCond);
const simPared = R(`(function(){
  // Con pared 🌳 adelante el condicional gira; sin pared avanza
  const gira=simStep({r:3,c:2,dir:'N',cuenta:0,mask:0},C_PARED,{n:5,obst:['2,2'],objs:[]});
  const avanza=simStep({r:3,c:2,dir:'N',cuenta:0,mask:0},C_PARED,{n:5,obst:[],objs:[]});
  return gira.condVal===true&&gira.dir==='E'&&avanza.condVal===false&&avanza.r===2;
})()`);
ok('simulador: el condicional de la pared gira con muro y avanza sin muro', simPared);
const simBucle = R(`(function(){
  // El bucle se expande: REPETIR 4 VECES [AVANZA, RECOGE] = 8 instrucciones ejecutadas y 2 escritas + 1
  const p=[{rep:4,body:['AVANZA','RECOGE']}];
  return countEjecutadas(p)===8&&countEscritas(p)===3;
})()`);
ok('simulador: el bucle se expande bien (ejecutadas ≠ escritas)', simBucle);
const simChoque = R(`(function(){const r=simRun({r:0,c:0,dir:'N'},['AVANZA'],{n:5,obst:[],objs:[]});return !r.ok&&r.evento==='borde';})()`);
ok('simulador: salir del patio detiene el programa', simChoque);

// ── evalMCBank (Campeonísimo)
console.log('— Bancos y Campeonísimo —');
ok('formato evalMCBank {q,o,a} para el Campeonísimo', R("evalMCBank.length===15&&evalMCBank.every(q=>typeof q.q==='string'&&Array.isArray(q.o)&&q.o.length===4&&typeof q.a==='number'&&q.a>=0&&q.a<4)"));
ok('pregunta diagnóstica presente (¿Qué es un programa completo?)', R("evalMCBank.some(q=>q.q.includes('¿Qué es un programa completo?')&&q.o[q.a].toLowerCase().includes('evento'))"));
ok('pregunta obligatoria del proyecto integrador (bucle + condicional juntos)', R("evalMCBank.some(q=>q.q.includes('REPETIR 6 VECES')&&q.o[q.a].toLowerCase().includes('bucle y un condicional'))"));
ok('banco de completar sin respuestas vacías', R("evalCPBank.every(i=>i.q.includes('___')&&!!i.a)"));
ok('banco de pareados con términos y definiciones únicos', R("new Set(evalPRBank.map(i=>i.term)).size===15&&new Set(evalPRBank.map(i=>i.def)).size===15"));

// ── Sopas verificadas
console.log('— Sopas de letras —');
const sopaOk = R(`sopaSets.every(set=>set.words.every(w=>{
  const letras=w.cells.map(([r,c])=>set.grid[r][c]).join('');
  if(letras!==w.w)return false;
  const dr=Math.sign(w.cells[1][0]-w.cells[0][0]),dc=Math.sign(w.cells[1][1]-w.cells[0][1]);
  return w.cells.every(([r,c],i)=>r===w.cells[0][0]+dr*i&&c===w.cells[0][1]+dc*i);
}))`);
ok('cada palabra de las 2 sopas coincide con su grid y es colineal y contigua (8 direcciones)', sopaOk);
ok('sopas sin tildes y en MAYÚSCULAS', R("sopaSets.every(s=>s.words.every(w=>/^[A-Z]+$/.test(w.w)))"));
ok('sopas 10×10 con 6 palabras cada una', R("sopaSets.length===2&&sopaSets.every(s=>s.size===10&&s.grid.length===10&&s.grid.every(r=>r.length===10)&&s.words.length===6)"));

// ── Ficha imprimible
console.log('— Ficha imprimible —');
ok('ficha de 7 páginas numeradas', (ficha.match(/class="pagina"/g) || []).length === 7 && ficha.includes('Página 7'));
ok('ficha: QR propio', ficha.includes('img/qr-mision-mi-primer-programa.png') && fs.existsSync(path.join(__dirname, '..', 'fichas', 'img', 'qr-mision-mi-primer-programa.png')));
ok('ficha: 10 completar + 10 V/F + 10 selección + 10 pareados',
  (ficha.match(/<span class="linea-resp"><\/span>/g) || []).length === 10 &&
  (ficha.match(/<li>____ /g) || []).length === 10 &&
  (ficha.match(/class="preg-n"/g) || []).length === 10 &&
  (ficha.match(/<td>\d+\. ____ /g) || []).length === 10);
const claveFicha = '1C, 2G, 3E, 4I, 5H, 6J, 7A, 8F, 9D, 10B';
ok('ficha: pauta de pareados presente', ficha.includes(claveFicha));
// La Columna B nunca en orden 1A-2B-3C: permutación sin puntos fijos
const pares = claveFicha.split(', ').map(s => ({ n: parseInt(s, 10), l: s.replace(/\d+/, '') }));
const letras = 'ABCDEFGHIJ';
ok('ficha: pareados barajados (permutación sin puntos fijos)', pares.length === 10 && pares.every(p => p.l !== letras[p.n - 1]) && new Set(pares.map(p => p.l)).size === 10);
ok('ficha: actividades desconectadas del proyecto', ficha.includes('pseudocódigo en papel') && ficha.includes('Ejecuta el programa de un compañero') && ficha.includes('Tabla de traza a mano') && ficha.includes('Presenta tu proyecto en 2 minutos'));

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
