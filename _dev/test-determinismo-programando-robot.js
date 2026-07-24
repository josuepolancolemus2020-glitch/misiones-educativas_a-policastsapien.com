// Arnés de determinismo — Misión «🕹️ Programando un Robot» (Robótica, Ruta de los Robots, etapa 5).
// Ejecutar: node _dev/test-determinismo-programando-robot.js
// Verifica (Node + vm, sin navegador):
//   · misma forma ×2 → salida idéntica (conceptual Y pensamiento crítico) · formas distintas → distintas
//   · tras la Forma 30 vuelve la 1 · puntajes de ambas pruebas suman 100
//   · pareados con derangement determinista (sin puntos fijos en las 30 formas)
//   · sin Forma R (semillas 300000/400000 no usadas) · colores de impresión tec
//   · encabezado con «Centro Educativo:» (nunca «Instituto:») en AMBAS pruebas
//   · sopas verificadas contra su grid (colineales, contiguas, mayúsculas sin tildes)
//   · evalMCBank en formato {q,o,a} para el Campeonísimo · SAVE_KEY único
//   · simulador: los 6 niveles del lab son resolubles por BFS (solveSim) y su solución
//     de referencia lleva realmente al robot a la meta
//   · sin cadenas heredadas de que-es-un-robot ni de robot-decide
const fs = require('fs'), path = require('path'), vm = require('vm');
const JS = path.join(__dirname, '..', 'misiones', '2y3ciclo-programando-robot', 'js', 'programando-robot.js');
const code = fs.readFileSync(JS, 'utf8');
const noop = () => {};
function mkEl() { return { style: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false }, appendChild: noop, addEventListener: noop, setAttribute: noop, innerHTML: '', textContent: '', insertBefore: noop, querySelector: () => null, querySelectorAll: () => [], parentNode: null, dataset: {}, value: '' }; }
let docs = [];
const sandbox = {
  window: { addEventListener: noop, matchMedia: () => ({ matches: false }), open: () => ({ document: { write: d => docs.push(d), close: noop }, print: noop }) },
  document: { addEventListener: noop, readyState: 'complete', getElementById: () => mkEl(), querySelector: () => null, querySelectorAll: () => [], createElement: mkEl, body: mkEl() },
  localStorage: { getItem: () => null, setItem: noop }, navigator: { userAgent: 'x' },
  console, Math, JSON, parseFloat, parseInt, isNaN, Set, Object, Array, String, Number,
  setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop,
};
sandbox.window.document = sandbox.document;
vm.createContext(sandbox); vm.runInContext(code, sandbox);
const ev = expr => vm.runInContext(expr, sandbox);

let fallos = 0;
const ok = (nombre, cond) => { console.log((cond ? '  ✔ ' : '  ✘ ') + nombre); if (!cond) fallos++; };

// ── Identidad de la misión ──────────────────────────────────────────────
console.log('— Identidad —');
ok("SAVE_KEY único = 'programando_robot_v1'", ev('SAVE_KEY') === 'programando_robot_v1');
ok('EVAL_FORMAS = 30', ev('EVAL_FORMAS') === 30);
['que_es_un_robot', 'que-es-un-robot', '¿Qué es un Robot', 'percibir → decidir → actuar', 'aspiradora robot', 'licuadora', 'maquila',
  'robot_decide', 'robot-decide', 'ENTREGA', 'semFase', 'semáforo', 'Instituto:']
  .forEach(t => ok('sin cadena heredada «' + t + '»', code.indexOf(t) < 0));
ok('sin Forma R (semillas 300000/400000 no usadas)', code.indexOf('300000') < 0 && code.indexOf('400000') < 0);

// ── Evaluación conceptual ───────────────────────────────────────────────
function runConceptual(forma) {
  ev('window._evalPrintData=null; evalFormNum=' + forma + ';');
  ev('genEval()');
  return ev('JSON.stringify(window._evalPrintData)');
}
console.log('— Evaluación conceptual (semilla _evalRng(forma)) —');
const c1a = runConceptual(7), c1b = runConceptual(7), c2 = runConceptual(8);
ok('Forma 7 dos veces → examen idéntico', c1a === c1b);
ok('Forma 7 ≠ Forma 8', c1a !== c2);
runConceptual(30);
ok('tras la Forma 30 sigue la 1 (evalFormNum cicla)', ev('evalFormNum') === 1);
const cd = JSON.parse(c1a);
ok('estructura 5+5+5+5 ítems', cd.cp.length === 5 && cd.tf.length === 5 && cd.mc.length === 5 && cd.pr.terms.length === 5);
ok('puntaje conceptual = 100 (20 × 5 pts)', (cd.cp.length + cd.tf.length + cd.mc.length + cd.pr.terms.length) * 5 === 100);

console.log('— Pareados sin puntos fijos (derangement, formas 1 a 30) —');
let fijos = 0;
for (let f = 1; f <= 30; f++) {
  const d = JSON.parse(runConceptual(f));
  if (d.pr.shuffledDefs.some((df, ix) => df.def === d.pr.terms[ix].def)) fijos++;
}
ok('ninguna de las 30 formas tiene puntos fijos en pareados', fijos === 0);

// ── Prueba de pensamiento crítico ───────────────────────────────────────
function runCrit(forma) {
  ev('window._evalCritData=null; evalCritFormNum=' + forma + ';');
  ev('genEvalCrit()');
  return ev('JSON.stringify(window._evalCritData)');
}
console.log('— Pensamiento crítico (semilla _evalRng(200000+forma)) —');
const k1a = runCrit(7), k1b = runCrit(7), k2 = runCrit(8);
ok('Forma 7 dos veces → prueba idéntica', k1a === k1b);
ok('Forma 7 ≠ Forma 8', k1a !== k2);
runCrit(30);
ok('tras la Forma 30 sigue la 1 (evalCritFormNum cicla)', ev('evalCritFormNum') === 1);
ok('semillas independientes: conceptual(5) ≠ crítica(5)', runConceptual(5) !== runCrit(5));
const kd = JSON.parse(k1a);
ok('crítica: 2 casos «falta» + 1 error + 1 trazado + 1 comparación + 1 diseño (5 × 20 = 100)',
  kd.sens.length === 2 && !!kd.err && !!kd.cic && !!kd.cmp && typeof kd.dis === 'string' && 5 * 20 === 100);
ok('sección III trae recorrido, final y explicación del sensor (3 guías)',
  Array.isArray(kd.cicGuides) && kd.cicGuides.length === 3 && kd.cicGuides.every(g => typeof g === 'string' && g.length > 10));
ok('sección III incluye la cuadrícula SVG y el programa numerado',
  typeof kd.cicSvg === 'string' && kd.cicSvg.indexOf('<svg') === 0 && /^1\) /.test(kd.cicProgTxt));

// ── Impresión ───────────────────────────────────────────────────────────
console.log('— Impresión (printEval / printEvalCrit) —');
docs = [];
runConceptual(3); runCrit(3);
ev('printEval(); printEvalCrit();');
ok('se generan 2 documentos', docs.length === 2);
ok('conceptual: evalPage + pautaPage + fit binario',
  docs[0].includes('id="evalPage"') && docs[0].includes('id="pautaPage"') && docs[0].includes('function fit'));
ok('crítica: critEvalPage + critPautaPage + fit binario',
  docs[1].includes('id="critEvalPage"') && docs[1].includes('id="critPautaPage"') && docs[1].includes('function fit'));
ok('colores de impresión tec (#0e7490 / #ecfeff) en ambos documentos',
  [0, 1].every(i => docs[i].includes('#0e7490') && docs[i].includes('#ecfeff')));
ok('pauta con respuestas en verde #007a00 (.pa)', docs[0].includes('.pa{color:#007a00'));
ok('encabezado dice «Programando un Robot» y «Robótica» en ambos',
  [0, 1].every(i => docs[i].includes('Programando un Robot') && docs[i].includes('Robótica')));
ok('encabezado usa «Centro Educativo:» y NUNCA «Instituto:» en ambos',
  [0, 1].every(i => docs[i].includes('<strong>Centro Educativo:</strong>') && !docs[i].includes('Instituto:')));
ok('pie normativo completo en ambos documentos',
  [0, 1].every(i => docs[i].includes('Nº de Evaluación temática realizada:')
    && docs[i].includes('Evaluación con valor en el parcial')
    && docs[i].includes('Evaluación solo de repaso')
    && docs[i].includes('Forma 3')));
ok('clave ZipGrade solo en la conceptual', docs[0].includes('ZipGrade') && !docs[1].includes('ZipGrade'));
ok('la crítica impresa trae las 5 secciones retematizadas',
  ['I. ¿Qué instrucción falta?', 'II. Corrige el programa', 'III. Traza el recorrido y predice dónde termina',
    'IV. Comparación razonada', 'V. Diseña el programa de tu robot'].every(s => docs[1].includes(s)));
ok('la crítica impresa incluye la cuadrícula SVG del trazado', docs[1].includes('<svg') && docs[1].includes('viewBox'));

docs = [];
runConceptual(9); ev('printEval()');
runConceptual(9); ev('printEval()');
runCrit(9); ev('printEvalCrit()');
runCrit(9); ev('printEvalCrit()');
ok('misma forma → mismo documento impreso (conceptual)', docs[0] === docs[1]);
ok('misma forma → mismo documento impreso (crítica)', docs[2] === docs[3]);

// ── Bancos ──────────────────────────────────────────────────────────────
console.log('— Bancos de ítems —');
ok('evalMCBank: 15 ítems en formato {q,o,a} para el Campeonísimo',
  ev("evalMCBank.length===15&&evalMCBank.every(q=>typeof q.q==='string'&&Array.isArray(q.o)&&q.o.length===4&&typeof q.a==='number'&&q.a>=0&&q.a<4)"));
ok('los 4 bancos conceptuales tienen 15 ítems cada uno',
  ev('evalTFBank.length===15&&evalMCBank.length===15&&evalCPBank.length===15&&evalPRBank.length===15'));
ok('V/F equilibrado (entre 6 y 9 verdaderos de 15)', (() => { const v = ev('evalTFBank.filter(x=>x.a).length'); return v >= 6 && v <= 9; })());
ok('evalCPBank: cada ítem trae el hueco ___ y su respuesta', ev("evalCPBank.every(x=>x.q.includes('___')&&typeof x.a==='string'&&x.a.length>0)"));
ok('evalPRBank: términos y definiciones únicos',
  ev('new Set(evalPRBank.map(x=>x.term)).size===15&&new Set(evalPRBank.map(x=>x.def)).size===15'));
ok('bancos de la crítica con material suficiente para 30 formas',
  ev('critFaltaBank.length>=6&&critErrorBank.length>=5&&critTraceBank.length>=4&&critCompareBank.length>=4&&critDesignBank.length>=5'));
ok('rúbrica de diseño con los 4 criterios (pseudocódigo, condicional, bucle, variable)',
  ev("['PSEUDOCÓDIGO','CONDICIONAL','BUCLE','VARIABLE'].every(k=>critDesignGuide.includes(k))"));
ok('quiz, clasificación, identifica y completa reescritos',
  ev('qzData.length===9&&classGroups.length===4&&idData.length===8&&cmpData.length===8&&fcData.length===14&&memoPairs.length===6'));
ok('idData: el índice señalado existe en cada oración', ev('idData.every(d=>d.c>=0&&d.c<d.s.length)'));
ok('cmpData: cada oración trae ___ y un índice válido', ev("cmpData.every(d=>d.s.includes('___')&&d.c>=0&&d.c<d.opts.length)"));
ok('qzData: índice correcto dentro de las opciones', ev('qzData.every(q=>q.c>=0&&q.c<q.o.length)'));

// ── Sopas de letras ─────────────────────────────────────────────────────
console.log('— Sopas de letras —');
ok('2 sopas de 10×10 con 6 palabras cada una',
  ev('sopaSets.length===2&&sopaSets.every(s=>s.size===10&&s.grid.length===10&&s.grid.every(r=>r.length===10)&&s.words.length===6)'));
ok('cada palabra coincide con su grid y es colineal y contigua (8 direcciones)', ev(`sopaSets.every(set=>set.words.every(w=>{
  const letras=w.cells.map(([r,c])=>set.grid[r][c]).join('');
  if(letras!==w.w)return false;
  const dr=Math.sign(w.cells[1][0]-w.cells[0][0]),dc=Math.sign(w.cells[1][1]-w.cells[0][1]);
  if(dr===0&&dc===0)return false;
  return w.cells.length===w.w.length&&w.cells.every(([r,c],i)=>r===w.cells[0][0]+dr*i&&c===w.cells[0][1]+dc*i);
}))`));
ok('sopas en mayúsculas y sin tildes', ev("sopaSets.every(s=>s.words.every(w=>/^[A-Z]+$/.test(w.w))&&s.grid.every(r=>r.every(l=>/^[A-Z]$/.test(l))))"));

// ── Simulador con sensores ──────────────────────────────────────────────
console.log('— Simulador con sensores —');
ok('sensor de pared: el borde del mapa y los obstáculos cuentan como pared', ev(`(function(){
  const map={n:5,obst:['2,2'],linea:[]};
  return _paredAdelante({r:0,c:2,dir:'N'},map)===true      // borde del mapa → pared
      && _paredAdelante({r:4,c:2,dir:'N'},map)===false     // casilla libre adelante
      && _paredAdelante({r:3,c:2,dir:'N'},map)===true      // obstáculo justo adelante
      && _paredAdelante({r:3,c:2,dir:'N'},{n:5,obst:['3,2'],linea:[]})===false; // el obstáculo bajo el robot no cuenta
})()`));
ok('sensor de línea: solo responde SÍ si la casilla de adelante tiene línea', ev(`(function(){
  const map={n:5,obst:[],linea:['3,2']};
  return _lineaAdelante({r:4,c:2,dir:'N'},map)===true && _lineaAdelante({r:4,c:1,dir:'N'},map)===false && _lineaAdelante({r:0,c:2,dir:'N'},map)===false;
})()`));
ok('el condicional de pared rodea el obstáculo (gira en vez de chocar)', ev(`(function(){
  const r=simRun({r:4,c:2,dir:'N'},[C_PARED,C_PARED],{n:5,obst:['2,2'],linea:[]});
  return r.ok&&r.st.r===3&&r.st.c===2&&r.st.dir==='E';
})()`));
ok('el condicional de línea sigue la línea y gira al perderla', ev(`(function(){
  const map={n:5,obst:[],linea:['3,2','2,2']};
  const r=simRun({r:4,c:2,dir:'N'},[C_LINEA,C_LINEA,C_LINEA],map);
  return r.ok&&r.st.r===2&&r.st.c===2&&r.st.dir==='E';
})()`));
ok('C_LINEAI gira a la izquierda cuando pierde la línea', ev(`(function(){
  const map={n:5,obst:[],linea:['3,2','2,2']};
  const r=simRun({r:4,c:2,dir:'N'},[C_LINEAI,C_LINEAI,C_LINEAI],map);
  return r.ok&&r.st.r===2&&r.st.c===2&&r.st.dir==='O';
})()`));
ok('AVANZA contra un obstáculo o el borde produce choque', ev(`(function(){
  const a=simStep({r:3,c:2,dir:'N'},'AVANZA',{n:5,obst:['2,2'],linea:[]});
  const b=simStep({r:0,c:2,dir:'N'},'AVANZA',{n:5,obst:[],linea:[]});
  return a.evento==='obstaculo'&&b.evento==='borde';
})()`));
ok('GIRA no cambia de casilla y ESPERA no cambia nada', ev(`(function(){
  const g=simStep({r:2,c:2,dir:'N'},'GIRA DERECHA',{n:5,obst:[],linea:[]});
  const e=simStep({r:2,c:2,dir:'N'},'ESPERA',{n:5,obst:[],linea:[]});
  return g.r===2&&g.c===2&&g.dir==='E'&&e.r===2&&e.c===2&&e.dir==='N';
})()`));

console.log('— Niveles del laboratorio —');
const niveles = JSON.parse(ev(`(function(){return JSON.stringify(Object.keys(parteData).map(k=>{
  const nv=parteData[k];
  const map={n:nv.n,obst:(nv.obst||[]).map(o=>o[0]+','+o[1]),linea:(nv.linea||[]).map(o=>o[0]+','+o[1])};
  const bfs=solveSim(nv.start,nv.dest,map,26);
  const pre=simRun(nv.start,nv.sol.slice(0,-1),map);
  return {k,bfs:bfs?bfs.len:null,
    solOk:simRun(nv.start,nv.sol,map).ok,
    cierraFin:nv.sol[nv.sol.length-1]===I_FIN,
    llega:pre.ok&&pre.st.r===nv.dest[0]&&pre.st.c===nv.dest[1],
    len:nv.sol.length,xpn:nv.xpn,
    startLibre:(nv.obst||[]).every(o=>!(o[0]===nv.start.r&&o[1]===nv.start.c)),
    destLibre:(nv.obst||[]).every(o=>!(o[0]===nv.dest[0]&&o[1]===nv.dest[1]))};
}));})()`));
ok('el lab tiene 6 niveles', niveles.length === 6);
ok('los 6 niveles son resolubles por código (solveSim con condicionales de sensor)', niveles.every(n => n.bfs !== null));
ok('la solución de referencia de cada nivel se ejecuta sin choques', niveles.every(n => n.solOk));
ok('la solución de referencia deja al robot en la meta antes del DETENTE final', niveles.every(n => n.llega && n.cierraFin));
ok('ninguna solución de referencia es más corta que el óptimo del BFS', niveles.every(n => n.len >= n.bfs));
ok('ni la salida ni la meta caen sobre un obstáculo', niveles.every(n => n.startLibre && n.destLibre));
ok('cada nivel otorga XP', niveles.every(n => n.xpn > 0));
ok('el XP del lab cabe en la barra (suma ≤ MXP)', niveles.reduce((s, n) => s + n.xpn, 0) <= ev('MXP'));
console.log('    niveles: ' + niveles.map(n => n.k + ' (BFS ' + n.bfs + ' / ref ' + n.len + ')').join(' · '));

console.log('— Casos de trazado de la prueba crítica —');
const trazos = JSON.parse(ev(`(function(){return JSON.stringify(critTraceBank.map((c,i)=>{
  const map={n:c.n,obst:(c.obst||[]).map(o=>o[0]+','+o[1]),linea:(c.linea||[]).map(o=>o[0]+','+o[1])};
  const r=simRun(c.start,c.prog,map);
  return {i,ok:r.ok,fin:r.ok?coordName(r.st.r,r.st.c):null,dir:r.ok?r.st.dir:null,
    usaCond:c.prog.some(p=>p&&typeof p==='object'&&p.cond)};
}));})()`));
ok('los 4 casos de trazado se ejecutan sin choques', trazos.every(t => t.ok));
ok('cada caso de trazado usa al menos un condicional con sensor', trazos.every(t => t.usaCond));
console.log('    trazados: ' + trazos.map(t => 'caso ' + (t.i + 1) + ' → ' + t.fin + ' ' + t.dir).join(' · '));

// ── Logros, niveles XP y diploma ────────────────────────────────────────
console.log('— Gamificación —');
ok('ACHIEVEMENTS incluye lab_master y está retematizado',
  ev("ACHIEVEMENTS.lab_master!==undefined&&Object.values(ACHIEVEMENTS).every(a=>a.icon&&a.label)&&!JSON.stringify(ACHIEVEMENTS).includes('sensores y actuadores')"));
ok('xpTracker tiene el conjunto lab', ev("typeof xpTracker.lab==='object'&&xpTracker.lab instanceof Set"));
ok('niveles XP retematizados a programación', ev("lvls.length===7&&lvls.some(l=>l.n.includes('Programador'))&&lvls.some(l=>l.n.includes('Depurador'))"));

// ── Recursos externos referenciados ─────────────────────────────────────
console.log('— Archivos de la misión —');
[
  ['misiones/2y3ciclo-programando-robot/programando-robot.html', ['ficha-programando-robot.html', 'js/programando-robot.js', 'css/programando-robot.css', 'Etapa 5 de 6', 'labShowParte(\'n1\')']],
  ['fichas/ficha-programando-robot.html', ['qr-mision-programando-robot.png', 'Página 7', 'IV. Pareados']],
].forEach(([rel, must]) => {
  const p = path.join(__dirname, '..', rel);
  const existe = fs.existsSync(p);
  ok('existe ' + rel, existe);
  if (existe) { const h = fs.readFileSync(p, 'utf8'); must.forEach(m => ok('  ' + rel.split('/').pop() + ' contiene «' + m + '»', h.includes(m))); }
});
ok('existe el QR fichas/img/qr-mision-programando-robot.png', fs.existsSync(path.join(__dirname, '..', 'fichas', 'img', 'qr-mision-programando-robot.png')));

// Pareados de la ficha: la Columna B nunca es 1A, 2B, 3C… (derangement)
{
  const h = fs.readFileSync(path.join(__dirname, '..', 'fichas', 'ficha-programando-robot.html'), 'utf8');
  const m = h.match(/IV\. Pareados:<\/span>\s*([^<]+)</);
  const clave = m ? m[1].trim() : '';
  const pares = clave.split(',').map(s => s.trim()).filter(Boolean);
  ok('la pauta de la ficha trae los 10 pareados', pares.length === 10);
  const sinFijos = pares.every((p, i) => {
    const num = parseInt(p, 10), letra = p.replace(/[^A-J]/g, '');
    return num === i + 1 && letra && 'ABCDEFGHIJ'.indexOf(letra) !== num - 1;
  });
  ok('pareados de la ficha barajados (ninguno cae en su letra natural)', sinFijos);
  const letras = pares.map(p => p.replace(/[^A-J]/g, ''));
  ok('las 10 letras de la Columna B se usan una sola vez', new Set(letras).size === 10);
  console.log('    clave de pareados de la ficha: ' + clave);
}

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
