/* =====================================================================
   M.E.T.A.S · El examen impreso con el encabezado limpio
   ---------------------------------------------------------------------
   Lo que pidió Josué el 20 de noviembre para toda hoja que el docente
   imprime con su sesión (con el encabezado del centro o sin él, y en
   inglés):
     · el título dice «Evaluación · Tema · Materia» («Test · Topic ·
       Subject»): sin «Final», sin el nivel (Educación Básica, Ciclo) y
       sin el tipo de prueba; las hojas se distinguen por «Forma NN»;
     · debajo del nombre del centro, la dirección completa del Perfil
       institucional (dirección, aldea, municipio, departamento), sin
       comas sueltas y en un renglón;
     · el pie, sin «N.º de Evaluación temática realizada», «Evaluación con
       valor en el parcial» ni «Evaluación solo de repaso»; la cajita
       «Forma NN» igual, y a su lado «Firma del padre o encargado».
   Esta sonda solo lee archivos: saca los títulos y el pie de las fuentes
   de las 84 misiones (y sus traducciones) y los pasa por el motor. La que
   abre las hojas de verdad, cuenta páginas y mide el pie es
   verifica-examen-encabezado-limpio-navegador.js.
   Uso: node _dev/verifica-examen-encabezado-limpio.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
function ok(c, msg, extra) {
  if (c) console.log('✓ ' + msg);
  else { fallos++; console.log('✘ ' + msg + (extra !== undefined ? '  → ' + (typeof extra === 'string' ? extra : JSON.stringify(extra)) : '')); }
}

const almacen = {};
const localStorage = {
  getItem: k => (k in almacen ? almacen[k] : null), setItem: (k, v) => { almacen[k] = String(v); },
  removeItem: k => { delete almacen[k]; },
};
const sandbox = {
  console, localStorage, setTimeout, clearTimeout,
  document: { addEventListener() {}, readyState: 'complete', getElementById() { return null; }, querySelectorAll() { return []; } },
  addEventListener() {},
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const cargar = rel => vm.runInContext(fs.readFileSync(path.join(RAIZ, rel), 'utf8'), sandbox, { filename: rel });
cargar('js/metas-centro.js');
cargar('js/motor-misiones.js');
const C = sandbox.MotorMisiones.centro;

function archivosJs(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...archivosJs(p));
    else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}

/* ══════════ 1 · Los títulos ══════════ */
console.log('── los títulos ──');
const MATERIAS_ES = ['Ciencias Naturales', 'Ciencias Sociales', 'Matemáticas', 'Español', 'Lengua', 'Programación', 'Robótica',
  'Filosofía', 'Educación Cívica', 'Inglés', 'Inteligencia Artificial', 'Gramática Española'];
const MATERIAS_EN = ['Robotics', 'Programming', 'English', 'Mathematics', 'Natural Sciences', 'Social Studies'];
const NO_VA_ES = /\b(Final|Educación Básica|Ciclo|Competencial|Pensamiento Crítico|Prueba Operativa|Actividades Operativas|Examen de|Misión|Matemática(?!s)|CC\.NN\.|Forma \d)\b/;
const NO_VA_EN = /\b(Final|Basic Education|Cycle|Competency|Critical Thinking|Practical Test|Concept Test| Exam|Form \d)\b/;

ok(C.titulo('Evaluación Final · Áreas Protegidas de Honduras · Educación Básica · Ciencias Naturales', 'es')
  === 'Evaluación · Áreas Protegidas de Honduras · Ciencias Naturales', 'el ejemplo de la captura: «Evaluación · Áreas Protegidas de Honduras · Ciencias Naturales»');
const casos = [
  ['Evaluación Competencial · Pensamiento Crítico · Los Ecosistemas · Educación Básica · Ciencias Naturales', 'Evaluación · Los Ecosistemas · Ciencias Naturales'],
  ['Examen de Matemáticas · Prueba Operativa · Teoría de Números · Educación Básica', 'Evaluación · Teoría de Números · Matemáticas'],
  ['Examen de Matemáticas: Prueba Operativa · Repaso de Fin de Grado 5º · Educación Básica', 'Evaluación · Repaso de Fin de Grado 5º · Matemáticas'],
  ['Evaluación Final · Misión Teoría de Números · Matemática', 'Evaluación · Teoría de Números · Matemáticas'],
  ['Evaluación Final · Misión Las Eras Geológicas · CC.NN.', 'Evaluación · Las Eras Geológicas · Ciencias Naturales'],
  ['Robótica · Prueba de Pensamiento Crítico · Robots que Resuelven Problemas · Educación Básica', 'Evaluación · Robots que Resuelven Problemas · Robótica'],
  ['Evaluación Final · IA Generativa · Educación Básica · III Ciclo · Inteligencia Artificial', 'Evaluación · IA Generativa · Inteligencia Artificial'],
  ['Evaluación Final de Misión Coordenadas Geográficas - Geografía - Ciencias Sociales', 'Evaluación · Coordenadas Geográficas · Geografía · Ciencias Sociales'],
  ['Evaluación · Los Continentes: América, Oceanía y Antártida · Forma 2 · Educación Básica · Ciencias Sociales', 'Evaluación · Los Continentes: América, Oceanía y Antártida · Ciencias Sociales'],
];
const malosCasos = casos.filter(([a, d]) => C.titulo(a, 'es') !== d).map(([a, d]) => a + ' ⇒ ' + C.titulo(a, 'es') + ' (esperado ' + d + ')');
ok(!malosCasos.length, 'los formatos de título que usan las misiones quedan «Evaluación · Tema · Materia»', malosCasos.join(' | '));
ok(C.titulo('Programming Exam · Practical Test · Conditionals: the Robot Decides · Basic Education', 'en') === 'Test · Conditionals: the Robot Decides · Programming'
  && C.titulo('Competency Test · Critical Thinking · What Is a Robot? · Basic Education · Robotics', 'en') === 'Test · What Is a Robot? · Robotics',
  'en inglés, «Test · Topic · Subject»');
ok(C.titulo('Algo <b>raro</b> · Educación Básica', 'es') === 'Algo <b>raro</b> · Educación Básica'
  && C.titulo('Evaluación Final · Educación Básica', 'es') === 'Evaluación Final · Educación Básica',
  'un título con etiquetas o que se queda sin tema sale como estaba');

/* Todos los títulos de las fuentes. Lo que la misión arma al imprimir
   (${…}) se cambia por un tema cualquiera. */
const fuentes = archivosJs(path.join(RAIZ, 'misiones')).concat([path.join(RAIZ, 'js/motor-mision.js')]);
const titulosEs = new Set();
const traducidos = [];
for (const f of fuentes) {
  const s = fs.readFileSync(f, 'utf8');
  if (/-en\.js$/.test(f)) continue;
  const re = /<div class="ph">\s*<h2>([^<]*)<\/h2>/g;
  let m;
  while ((m = re.exec(s))) titulosEs.add(m[1].replace(/\$\{[^}]*\}/g, 'Tema De La Hoja'));
  const en = f.replace(/\.js$/, '-en.js');
  if (fs.existsSync(en)) {
    const sen = fs.readFileSync(en, 'utf8');
    re.lastIndex = 0;
    while ((m = re.exec(s))) {
      const k = m[1];
      const i = sen.indexOf("'" + k.replace(/'/g, "\\'") + "':");
      if (i < 0) continue;
      const v = (sen.slice(i + k.length + 3).match(/^\s*'((?:[^'\\]|\\.)*)'/) || [])[1];
      if (v) traducidos.push(v.replace(/\\'/g, "'"));
    }
  }
}
const malosEs = [];
for (const t of titulosEs) {
  const d = C.titulo(t, 'es');
  const partes = d.split(' · ');
  /* Con un ${…} la materia puede ser lo que la misión pone al imprimir
     (Fin de grado: ${M.nombre}); esas las mira la sonda del navegador. */
  const variable = t.includes('Tema De La Hoja');
  if (partes[0] !== 'Evaluación' || partes.length < (variable ? 2 : 3) || NO_VA_ES.test(d)
    || (!variable && !MATERIAS_ES.includes(partes[partes.length - 1])) || partes.slice(1, -1).some(p => MATERIAS_ES.includes(p) && p !== 'Español'))
    malosEs.push(t + ' ⇒ ' + d);
}
ok(titulosEs.size >= 150 && !malosEs.length, 'los ' + titulosEs.size + ' títulos de las misiones quedan «Evaluación · Tema · Materia», con la materia al final', malosEs.join(' | '));
const malosEn = traducidos.map(t => [t, C.titulo(t, 'en')]).filter(([, d]) => {
  const p = d.split(' · ');
  return p[0] !== 'Test' || p.length < 3 || NO_VA_EN.test(d) || !MATERIAS_EN.includes(p[p.length - 1]);
}).map(([t, d]) => t + ' ⇒ ' + d);
ok(traducidos.length >= 16 && !malosEn.length, 'los ' + traducidos.length + ' títulos en inglés quedan «Test · Topic · Subject»', malosEn.join(' | '));

/* ══════════ 2 · La dirección del centro ══════════ */
console.log('\n── la dirección ──');
ok(C.lugar({ direccion: 'Col. San José', aldea: 'El Zapotal', municipio: 'Villanueva', departamento: 'Cortés' }) === 'Col. San José, El Zapotal, Villanueva, Cortés',
  'dirección, aldea, municipio y departamento, en ese orden');
ok(C.lugar({ direccion: '', aldea: '  ', municipio: 'Villanueva', departamento: 'Cortés' }) === 'Villanueva, Cortés'
  && C.lugar({ direccion: 'Barrio Abajo, ', municipio: '', departamento: '' }) === 'Barrio Abajo'
  && C.lugar({}) === '', 'lo vacío no sale: ni comas ni espacios sueltos');
ok(C.lugar({ municipio: 'Copán', departamento: 'copán' }) === 'Copán', 'lo repetido sale una vez');
const hojaRef = '<!DOCTYPE html><html><body><div id="evalPage"><div class="ph"><h2>Evaluación Final · La Materia · Educación Básica · Ciencias Naturales</h2>'
  + '<div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>'
  + '<div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>N.º Lista:</strong><span class="ph-xs">&nbsp;</span></div></div></div></body></html>';
const conCentro = C.hoja(hojaRef, { id: 'c', nombre: 'Escuela Ficticia', direccion: 'Col. Ficticia', aldea: '', municipio: 'Villanueva', departamento: 'Cortés' }, 'Docente', {});
const lugarHtml = (conCentro.match(/<div data-metas-lugar style="([^"]*)">([^<]*)<\/div>/) || []);
ok(lugarHtml[2] === 'Col. Ficticia, Villanueva, Cortés', 'en la hoja, debajo del nombre del centro', lugarHtml[2]);
ok(/white-space:nowrap/.test(lugarHtml[1] || '') && /text-overflow:ellipsis/.test(lugarHtml[1] || ''), 'en un solo renglón, con «…» si no cabe');
ok(/<h2>Evaluación · La Materia · Ciencias Naturales<\/h2>/.test(conCentro), 'y el título limpio en el encabezado del centro');

/* El examen lee la aldea de la lista de centros, sin escribir nada. */
const motorCentro = fs.readFileSync(path.join(RAIZ, 'js/metas-centro.js'), 'utf8');
ok((motorCentro.match(/aldea: c\.aldea \|\| ''/g) || []).length >= 3 && /aldea: campo\('aldea'\)/.test(motorCentro),
  'la lista de centros que lee el examen trae la aldea');

/* ══════════ 3 · El pie ══════════ */
console.log('\n── el pie ──');
const fuentePie = fs.readFileSync(path.join(RAIZ, 'misiones/2y3ciclo-areas-protegidas-de-honduras/js/areas-protegidas.js'), 'utf8');
const pieFuente = (fuentePie.match(/<div class="print-foot">[\s\S]*?<\/div>/) || [''])[0].replace(/\$\{forma\}/g, '30');
ok(/temática realizada/.test(pieFuente), 'el pie de referencia trae los tres rótulos');
const pie = C.pie('<body>' + pieFuente + '</body>', 'es');
ok(!/pf-item|temática realizada|valor en el parcial|solo de repaso/.test(pie), 'fuera los tres rótulos');
ok(pie.includes('<span class="forma-tag">Forma 30</span>'), 'la cajita «Forma 30» igual que hoy');
ok(/data-metas-firma[^>]*>[\s\S]*Firma del padre o encargado<\/span><\/span><span class="forma-tag">/.test(pie), 'a su izquierda, «Firma del padre o encargado»');
const estFirma = (pie.match(/data-metas-firma style="([^"]*)"/) || [, ''])[1];
ok(/border:1px solid #bbb/.test(estFirma) && /border-radius:3px/.test(estFirma) && /font-size:7pt;color:#555/.test(pie),
  'con el mismo borde, esquinas y letra que la de la Forma');
const altoFirma = parseFloat((estFirma.match(/height:(\d+)px/) || [, '99'])[1]);
ok(/data-metas-pie style="bottom:0;/.test(pie) && altoFirma + 2 <= 23.4, 'el pie baja al fondo: su borde de arriba no sube (≤ 23,4 px desde el fondo)', altoFirma);
/* La letra del tipo de hoja dentro de la misma cajita: «Forma 30 · C». */
ok(JSON.stringify(C.letras()) === JSON.stringify({ printEval: 'C', printEvalCrit: 'P', printEvalOp: 'O' }),
  'C la conceptual, P la de pensamiento crítico, O la operativa', C.letras());
const conLetra = C.pie('<body>' + pieFuente + '</body>', 'es', 'P');
const cajaForma = (conLetra.match(/<span class="forma-tag">([\s\S]*?<\/span>)<\/span><\/div>/) || [, ''])[1];
ok(/^Forma 30<span data-metas-letra style="([^"]*)"> · P<\/span>$/.test(cajaForma), 'la letra va en la misma cajita: «Forma 30 · P»', cajaForma);
const estLetra = (cajaForma.match(/data-metas-letra style="([^"]*)"/) || [, ''])[1];
ok(/font-size:6pt/.test(estLetra) && /color:#888/.test(estLetra), 'más pequeña (6 pt, la Forma va en 7) y en gris', estLetra);
ok(C.pie(pieFuente.replace('Forma 30', 'Form 30'), 'en', 'C').includes('>Form 30<span data-metas-letra style="font-size:6pt;color:#888;"> · C</span>'),
  'en inglés, la misma letra');
ok(C.pie(pieFuente.replace('Forma 30', 'Forma R-3'), 'es', 'O').includes('>Forma R-3<span data-metas-letra'), 'también en la Forma R-N de la adaptada');
ok(!/data-metas-letra/.test(C.pie(pieFuente, 'es', 'X')) && !/data-metas-letra/.test(C.pie(pieFuente, 'es')), 'sin una de las tres letras, la cajita va sin letra');
const motorTxt = fs.readFileSync(path.join(RAIZ, 'js/motor-misiones.js'), 'utf8');
ok(/return _imprimirCon\(null, original, yo, args, null, letra\)/.test(motorTxt) && /fecha: elegidos\.fecha \}, letra\)/.test(motorTxt),
  'la letra llega a la hoja con centro y sin centro');
const pieMate = pieFuente.replace('Forma 30', 'Matemáticas · Forma 30');
ok(C.pie(pieMate, 'es').includes('<span class="forma-tag">Matemáticas · Forma 30</span>')
  && C.pie(pieMate, 'es', 'C').includes('<span class="forma-tag">Matemáticas · Forma 30<span data-metas-letra'), '«Matemáticas · Forma N» también queda igual, con su letra');
const pieEn = pieFuente.replace('N.º de Evaluación temática realizada:', 'Topic test number:').replace('Evaluación con valor en el parcial', 'Test counts toward the term grade')
  .replace('Evaluación solo de repaso', 'Practice test only').replace('Forma 30', 'Form 30');
const pieEnLimpio = C.pie(pieEn, 'en');
ok(pieEnLimpio.includes('Parent or guardian signature') && pieEnLimpio.includes('>Form 30</span>') && !/pf-item/.test(pieEnLimpio), 'en inglés, «Parent or guardian signature»');
const raro = pieFuente.replace('<span class="forma-tag">', '<em>otro</em><span class="forma-tag">');
ok(C.pie(raro, 'es') === raro, 'un pie de forma desconocida sale como siempre');
const i18n = fs.readFileSync(path.join(RAIZ, 'js/metas-i18n.js'), 'utf8');
ok(i18n.includes("'Firma del padre o encargado': 'Parent or guardian signature'"), 'la frase nueva está en js/metas-i18n.js');

/* Todas las hojas de las fuentes traen el pie que el motor sabe limpiar. */
const piesRaros = [];
let pies = 0;
for (const f of fuentes) {
  if (/-en\.js$/.test(f)) continue;
  const s = fs.readFileSync(f, 'utf8');
  (s.match(/<div class="print-foot">[\s\S]*?<\/div>/g) || []).forEach(p => {
    pies++;
    const limpio = C.pie(p.replace(/\$\{[^}]*\}/g, '7'), 'es');
    if (!/data-metas-firma/.test(limpio)) piesRaros.push(path.relative(RAIZ, f));
  });
}
ok(pies >= 160 && !piesRaros.length, 'los ' + pies + ' pies de las misiones salen limpios', piesRaros.join(', '));

console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ Título «Evaluación · Tema · Materia», dirección completa y pie con la firma en todas las hojas');
process.exit(fallos ? 1 : 0);
