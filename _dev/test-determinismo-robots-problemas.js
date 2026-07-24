// Arnés de determinismo — misión 🏆 Robots que Resuelven Problemas (Robótica, Ruta de los Robots · etapa 6 de 6).
// Ejecutar: node _dev/test-determinismo-robots-problemas.js
// Verifica el «bucle exacto» (misma forma → mismo examen y misma pauta, conceptual Y pensamiento
// crítico), los pareados sin puntos fijos en las 30 formas, las sopas de letras contra su propio
// grid, el formato de evalMCBank, el SAVE_KEY, la ausencia de cadenas heredadas de la misión molde
// y la coherencia del Taller de Diseño (orden del ciclo y claves de los 5 proyectos hondureños).
const fs = require('fs'), path = require('path'), vm = require('vm');
const BASE = path.join(__dirname, '..', 'misiones', '2y3ciclo-robots-problemas');
const JS = path.join(BASE, 'js', 'robots-problemas.js');
const HTML = path.join(BASE, 'robots-problemas.html');
const CSS = path.join(BASE, 'css', 'robots-problemas.css');
const FICHA = path.join(__dirname, '..', 'fichas', 'ficha-robots-problemas.html');
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
ok("SAVE_KEY === 'robots_problemas_v1'", g('SAVE_KEY') === 'robots_problemas_v1');
ok('TOTAL_SECTIONS === 13', g('TOTAL_SECTIONS') === 13);
ok('EVAL_FORMAS === 30', g('EVAL_FORMAS') === 30);
ok('el HTML carga su propio css y js', html.includes('css/robots-problemas.css') && html.includes('js/robots-problemas.js'));
ok('el HTML enlaza la ficha imprimible', html.includes('../../fichas/ficha-robots-problemas.html'));
ok('el HTML declara la URL canónica correcta',
  html.includes('<link rel="canonical" href="https://metas.policastsapien.com/misiones/2y3ciclo-robots-problemas/robots-problemas.html">')
  && html.includes('<meta property="og:url" content="https://metas.policastsapien.com/misiones/2y3ciclo-robots-problemas/robots-problemas.html">'));
ok('el HTML anuncia la etapa 6 de 6 (misión de cierre)', /Etapa 6 de 6/.test(html));
ok('la paleta tec #0e7490 sigue siendo la de la ruta', css.includes('--pri: #0e7490'));

// ── Cadenas heredadas del molde ──
console.log('— Sin herencias de ¿Qué es un Robot? ni de las misiones hermanas —');
const prohibidas = ['que_es_un_robot', 'que-es-un-robot', '¿Qué es un Robot?', 'labShowParte', 'labShowAspecto',
  'parteData', 'data-parte', 'data-aspecto', 'svgP-', 'lab-robot-svg', 'critSensorBank', 'critCicloBank',
  'critCicloQuestions', 'aspiradora', 'maquila', 'licuadora', 'martillo', 'humanoide',
  'Instituto:', 'Forma R', 'evalReducida',
  'sensores_robot', 'motores_mecanismos', 'electricidad_robots', 'programando_robot'];
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
ok('evalMCBank: enunciados únicos', new Set(mc.map(x => x.q)).size === 15);
const cp = g('JSON.parse(JSON.stringify(evalCPBank))');
ok('evalCPBank: todos los ítems llevan el hueco ___', cp.every(it => it.q.includes('___') && it.a.length > 1));
const tf = g('JSON.parse(JSON.stringify(evalTFBank))');
ok('evalTFBank: respuestas booleanas y ambos valores presentes',
  tf.every(it => typeof it.a === 'boolean') && tf.some(it => it.a) && tf.some(it => !it.a));
const pr = g('JSON.parse(JSON.stringify(evalPRBank))');
ok('evalPRBank: términos y definiciones únicos',
  new Set(pr.map(x => x.term)).size === 15 && new Set(pr.map(x => x.def)).size === 15);

// ── Bancos de la prueba crítica ──
console.log('— Bancos de pensamiento crítico —');
ok('critCasoBank tiene 6 casos con pauta', g('critCasoBank.length') === 6 && g('critCasoBank.every(c=>c.txt.length>20&&c.ans.length>40)'));
ok('critErrorBank tiene 5 errores con dos correcciones', g('critErrorBank.length') === 5 && g('critErrorBank.every(e=>!!e.g1&&!!e.g2)'));
ok('critProcesoBank tiene 5 casos con falló/mejora/comunicación', g('critProcesoBank.length') === 5 && g('critProcesoBank.every(c=>!!c.f&&!!c.m&&!!c.c)'));
ok('critProcesoQuestions tiene 3 preguntas', g('critProcesoQuestions.length') === 3);
ok('critCompareBank tiene 4 comparaciones completas', g('critCompareBank.length') === 4 && g('critCompareBank.every(c=>!!c.a&&!!c.b&&!!c.ga&&!!c.gb&&!!c.gr)'));
ok('critDesignBank tiene 5 problemas hondureños', g('critDesignBank.length') === 5);
const guia = g('critDesignGuide');
ok('la rúbrica del proyecto final tiene 4 criterios (5 pts c/u = 20)',
  ['①', '②', '③', '④'].every(s => guia.includes(s)) && guia.includes('20 pts')
  && /PROBLEMA BIEN DEFINIDO/.test(guia) && /SENSORES Y MECANISMOS JUSTIFICADOS/.test(guia)
  && /PROGRAMA COHERENTE/.test(guia) && /MEJORA TRAS LA PRUEBA/.test(guia));

// ── Selección determinista de la evaluación conceptual ──
console.log('— Evaluación conceptual (semilla _evalRng(100000+forma)) —');
const conceptualKey = 'JSON.stringify((function(){var r=_evalRng(100000+__FORMA__);return {cp:_pickF(evalCPBank,5,r),tf:_pickF(evalTFBank,5,r),mc:_pickF(evalMCBank,5,r),pr:(function(){var p=_pickF(evalPRBank,5,r);return {terms:p,defs:_shuffleF(p,r)};})()};})())';
const concept = f => g(conceptualKey.replace(/__FORMA__/g, String(f)));
ok('misma forma (7) dos veces → idéntica', concept(7) === concept(7));
ok('forma 1 ≠ forma 2', concept(1) !== concept(2));

// ── Selección determinista de la prueba crítica ──
console.log('— Pensamiento crítico (semilla _evalRng(200000+forma)) —');
const criticalKey = 'JSON.stringify((function(){var r=_evalRng(200000+__FORMA__);return {sens:_pickF(critCasoBank,2,r),err:_pickF(critErrorBank,1,r),cic:_pickF(critProcesoBank,1,r),cmp:_pickF(critCompareBank,1,r),dis:_pickF(critDesignBank,1,r)};})())';
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
ok('conceptual: 5 CP + 5 VF + 5 MC + 5 PR (20 × 5 pts = 100)',
  d15.cp.length === 5 && d15.tf.length === 5 && d15.mc.length === 5 && d15.pr.terms.length === 5 && 20 * 5 === 100);
const c15 = JSON.parse(a.crit);
ok('crítica: 2 casos problema-diseño + 1 error + 1 proceso + 1 comparación + 1 proyecto (5 × 20 = 100)',
  c15.sens.length === 2 && !!c15.err && !!c15.cic && !!c15.cmp && typeof c15.dis === 'string' && 5 * 20 === 100);
ok('documento crítico con las 5 secciones',
  ['I. Del problema al diseño', 'II. Corrige el error conceptual', 'III. Analiza el proceso de diseño',
   'IV. Comparación razonada', 'V. Proyecto de diseño completo'].every(s => a.docCrit.includes(s)));
ok('la sección V imprime la rúbrica de 4 criterios en la pauta',
  a.docCrit.includes('V. Proyecto de diseño completo — Rúbrica') && a.docCrit.includes('MEJORA TRAS LA PRUEBA'));
['docConcept', 'docCrit'].forEach(k => {
  const doc = a[k];
  ok('[' + k + '] encabezado Nombre/Parcial/Fecha', doc.includes('<strong>Nombre:</strong>') && doc.includes('<strong>Parcial:</strong>') && doc.includes('<strong>Fecha:</strong>'));
  ok('[' + k + '] encabezado Centro Educativo/Grado/Nº', doc.includes('<strong>Centro Educativo:</strong>') && doc.includes('<strong>Grado y Sección:</strong>') && doc.includes('<strong>Nº Lista:</strong>'));
  ok('[' + k + '] pie normativo con Nº de Evaluación temática y casillas', doc.includes('Nº de Evaluación temática realizada:') && doc.includes('Evaluación con valor en el parcial') && doc.includes('Evaluación solo de repaso'));
  ok('[' + k + '] etiqueta Forma en el pie', doc.includes('class="forma-tag"'));
  ok('[' + k + '] pauta marcada como documento exclusivo del docente', doc.includes('Documento exclusivo del docente'));
  ok('[' + k + '] ajuste automático a 1 página (script fit)', /function fit\(/.test(doc) && doc.includes('@page{size:letter portrait'));
  ok('[' + k + '] título con materia · tipo de prueba · tema · Educación Básica',
    doc.includes('Robótica') && doc.includes('Robots que Resuelven Problemas') && doc.includes('Educación Básica'));
  ok('[' + k + '] paleta tec en la impresión', doc.includes('#0e7490') && doc.includes('#ecfeff'));
});
ok('clave ZipGrade solo en la conceptual', a.docConcept.includes('Clave rápida estilo ZipGrade') && !a.docCrit.includes('ZipGrade'));
ok('pauta .pa en verde #007a00 (conceptual)', a.docConcept.includes('.pa{color:#007a00'));
ok('sin Forma R en el código', !/Forma\s*R\b/.test(code) && !/formaR/i.test(code));

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

// ── Taller de diseño: coherencia del ciclo y de los proyectos ──
console.log('— Taller de Diseño (7 etapas × 5 proyectos hondureños) —');
const ETAPAS_ESPERADAS = ['identificar', 'idear', 'disenar', 'construir', 'probar', 'mejorar', 'comunicar'];
const etapas = g('JSON.parse(JSON.stringify(CICLO_ETAPAS))');
ok('CICLO_ETAPAS tiene las 7 etapas del ciclo de diseño en orden',
  etapas.length === 7 && etapas.every((e, i) => e.id === ETAPAS_ESPERADAS[i]));
ok('cada etapa trae nombre numerado, icono y guía',
  etapas.every((e, i) => e.n.startsWith(String(i + 1) + '.') && !!e.icon && e.guia.length > 20));
const ordenCorrecto = g('JSON.parse(JSON.stringify(cicloOrdenCorrecto()))');
ok('cicloOrdenCorrecto() coincide con el orden canónico', JSON.stringify(ordenCorrecto) === JSON.stringify(ETAPAS_ESPERADAS));

const proys = g('JSON.parse(JSON.stringify(proyectosHN))');
const IDS = ['cafe', 'rio', 'huerto', 'inundacion', 'basura'];
ok('hay 5 proyectos hondureños (café, río, huerto, inundaciones, basura)',
  proys.length === 5 && IDS.every(id => proys.some(p => p.id === id)));
let tallerErr = [];
proys.forEach(p => {
  ETAPAS_ESPERADAS.forEach(e => {
    if (!p.etapas[e] || p.etapas[e].length < 40) tallerErr.push(p.id + ': falta el texto de la etapa ' + e);
  });
  // decisiones
  const ks = p.decisiones.map(d => d.k);
  ['sensor', 'mecanismo', 'energia', 'programa'].forEach(k => {
    if (!ks.includes(k)) tallerErr.push(p.id + ': falta la decisión «' + k + '»');
  });
  if (new Set(ks).size !== ks.length) tallerErr.push(p.id + ': claves de decisión repetidas');
  p.decisiones.forEach(d => {
    if (!ETAPAS_ESPERADAS.includes(d.etapa)) tallerErr.push(p.id + '/' + d.k + ': etapa inexistente');
    if (!Array.isArray(d.opts) || d.opts.length < 3) tallerErr.push(p.id + '/' + d.k + ': faltan opciones');
    if (!Number.isInteger(d.a) || d.a < 0 || d.a >= d.opts.length) tallerErr.push(p.id + '/' + d.k + ': clave fuera de rango');
    if (!d.why || d.why.length < 25) tallerErr.push(p.id + '/' + d.k + ': falta la retroalimentación');
    if (new Set(d.opts).size !== d.opts.length) tallerErr.push(p.id + '/' + d.k + ': opciones repetidas');
  });
  // orden barajado determinista
  const o = p.orden;
  const esPerm = Array.isArray(o) && o.length === 7 && [...o].sort((x, y) => x - y).every((v, i) => v === i);
  if (!esPerm) tallerErr.push(p.id + ': «orden» no es una permutación de 0..6');
  else {
    if (o.every((v, i) => v === i)) tallerErr.push(p.id + ': el orden inicial ya está resuelto');
    if (o.some((v, i) => v === i)) tallerErr.push(p.id + ': el orden inicial tiene etapas ya en su lugar');
  }
});
ok('los 5 proyectos traen sus 7 etapas redactadas' + (tallerErr.length ? ' → ' + tallerErr.join(' | ') : ''), tallerErr.length === 0);
ok('cada proyecto decide sensor, mecanismo, energía y programa (repaso integrador de la ruta)',
  proys.every(p => ['sensor', 'mecanismo', 'energia', 'programa'].every(k => p.decisiones.some(d => d.k === k))));
ok('las decisiones se reparten por etapas (idear, diseñar y mejorar)',
  proys.every(p => ['idear', 'disenar', 'mejorar'].every(e => p.decisiones.some(d => d.etapa === e))));
ok('tallerDecisiones() devuelve solo las decisiones de la etapa pedida',
  proys.every(p => ETAPAS_ESPERADAS.every(e => {
    const sel = g('JSON.parse(JSON.stringify(tallerDecisiones(proyectosHN.find(x=>x.id==="' + p.id + '"),"' + e + '")))');
    return sel.every(d => d.etapa === e) && sel.length === p.decisiones.filter(d => d.etapa === e).length;
  })));

// La actividad de ordenar es autocalificable y determinista
console.log('— Ordenar las etapas: autocalificable y determinista —');
let ordenErr = [];
IDS.forEach(id => {
  g('tallerProy="' + id + '"; tallerBuildOrden();');
  const inicial = g('JSON.parse(JSON.stringify(tallerOrden))');
  g('tallerBuildOrden();');
  const inicial2 = g('JSON.parse(JSON.stringify(tallerOrden))');
  if (JSON.stringify(inicial) !== JSON.stringify(inicial2)) ordenErr.push(id + ': el barajado no es determinista');
  if (JSON.stringify(inicial) === JSON.stringify(ETAPAS_ESPERADAS)) ordenErr.push(id + ': arranca ya resuelto');
  if (!inicial.every(x => ETAPAS_ESPERADAS.includes(x)) || new Set(inicial).size !== 7) ordenErr.push(id + ': no contiene las 7 etapas');
  // mal → no suma; bien → suma
  g('xpTracker.wgt.clear(); xp=0;');
  g('tallerCheckOrden();');
  if (g('xp') !== 0) ordenErr.push(id + ': un orden incorrecto otorgó XP');
  g('tallerOrden=' + JSON.stringify(ETAPAS_ESPERADAS) + '; tallerCheckOrden();');
  if (g('xp') !== 5) ordenErr.push(id + ': el orden correcto no otorgó los 5 XP');
  g('tallerCheckOrden();');
  if (g('xp') !== 5) ordenErr.push(id + ': el XP del orden se repitió');
});
ok('el barajado inicial es determinista y la verificación premia solo el orden correcto' + (ordenErr.length ? ' → ' + ordenErr.join(' | ') : ''), ordenErr.length === 0);

// Las decisiones se califican contra los datos, no contra el HTML
console.log('— Decisiones del taller calificadas contra los datos —');
let decErr = [];
proys.forEach(p => {
  p.decisiones.forEach(d => {
    g('xpTracker.wgt.clear(); xp=0;');
    const btn = { parentElement: { dataset: {}, querySelectorAll: () => [] } };
    sandbox.__btn = btn;
    g('tallerDecide("' + p.id + '","' + d.k + '",' + d.a + ',__btn);');
    if (g('xp') !== 2) decErr.push(p.id + '/' + d.k + ': la opción correcta no dio +2 XP');
    g('xpTracker.wgt.clear(); xp=0;');
    const btn2 = { parentElement: { dataset: {}, querySelectorAll: () => [] } };
    sandbox.__btn = btn2;
    const mala = (d.a + 1) % d.opts.length;
    g('tallerDecide("' + p.id + '","' + d.k + '",' + mala + ',__btn);');
    if (g('xp') !== 0) decErr.push(p.id + '/' + d.k + ': una opción incorrecta otorgó XP');
  });
});
ok('cada decisión premia únicamente su clave declarada' + (decErr.length ? ' → ' + decErr.join(' | ') : ''), decErr.length === 0);
ok('el botón inicial del taller apunta al primer proyecto (data-proj="cafe")',
  html.includes('data-proj="cafe"') && code.includes("tallerShowProyecto('cafe');"));
ok('el HTML declara los 5 proyectos y las 7 etapas del taller',
  IDS.every(id => html.includes('data-proj="' + id + '"')) && ETAPAS_ESPERADAS.every(e => html.includes('data-etapa="' + e + '"')));
ok('el HTML trae la lista para ordenar el ciclo', html.includes('id="cicloList"') && html.includes('tallerCheckOrden()'));

// ── Ficha imprimible ──
console.log('— Ficha didáctica —');
if (fs.existsSync(FICHA)) {
  const fi = fs.readFileSync(FICHA, 'utf8');
  const pags = (fi.match(/class="pagina"/g) || []).length;
  ok('la ficha tiene 7 páginas', pags === 7);
  ok('la ficha usa el QR de esta misión', fi.includes('qr-mision-robots-problemas.png'));
  ok('la ficha trae las 4 actividades (10 + 10 + 10 + 10)',
    fi.includes('I. Completa los espacios') && fi.includes('II. Verdadero o Falso')
    && fi.includes('III. Selección múltiple') && fi.includes('IV. Relaciona (Pareados)'));
  const clave = (fi.match(/IV\. Pareados:<\/span>\s*([^<]+)</) || [])[1] || '';
  const letras = clave.trim().split('&nbsp;').map(s => s.trim().replace(/^\d+\.?\s*/, '')).filter(Boolean);
  ok('la clave de pareados no es 1A-2B-3C (permutación sin puntos fijos)',
    letras.length === 10 && letras.every((l, i) => l !== 'ABCDEFGHIJ'[i]) && new Set(letras).size === 10);
  ok('la ficha incluye las actividades desconectadas pedidas',
    /desconectadas/i.test(fi) && /boceto/i.test(fi) && /maqueta/i.test(fi)
    && /ficha de proyecto/i.test(fi) && /dos minutos/i.test(fi));
  ok('la ficha se identifica como etapa 6 de la Ruta de los Robots', /Etapa 6/.test(fi));
} else {
  ok('existe fichas/ficha-robots-problemas.html', false);
}

console.log(fallos === 0 ? '\n✅ Todo en orden (' + fallos + ' fallos)' : '\n❌ ' + fallos + ' fallos');
process.exit(fallos === 0 ? 0 : 1);
