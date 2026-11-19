/* =====================================================================
   M.E.T.A.S · El centro en el encabezado del examen impreso
   ---------------------------------------------------------------------
   El motor de las misiones (js/motor-misiones.js, pieza 4) pone el
   perfil del centro arriba de la hoja impresa del examen, y
   js/metas-centro.js le da la lista de centros. Con datos ficticios:

   · TODAS las hojas de las misiones (las 84, más la plantilla de
     js/motor-mision.js) tienen la forma que el motor sabe cambiar, y
     sus tres impresiones son printEval, printEvalOp o printEvalCrit;
   (a) sin sesión, la hoja sale igual, byte por byte, aunque el perfil
       esté guardado en el aparato;
   (b) docente con un centro: logo en gris a la izquierda, nombre en
       mayúsculas, lugar y docente en letra pequeña, y sin la raya del
       centro;
   (d) «Sin encabezado»: la hoja de siempre, con la raya en blanco;
   (e) el docente cerró sesión: otra vez la hoja de siempre;
   · la lista de centros incluye los que no tienen grupos, sin repetir;
   · los impresos de Mi aula (boleta, marca, paraImpreso, textoCentro)
     salen iguales con la lista nueva en la copia y con o sin sesión.

   (c), el selector de dos centros, se mira en el navegador:
   _dev/verifica-encabezado-centro-navegador.js.

   Uso: node _dev/verifica-encabezado-centro.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
const ok = (c, t, extra) => { console.log((c ? '✓ ' : '✘ ') + t + (c || extra === undefined ? '' : '  → ' + extra)); if (!c) fallos++; };

/* ── un navegador de mentira, como en verifica-perfil-centro ── */
const mem = {};
const localStorage = {
  getItem(k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
  setItem(k, v) { mem[k] = String(v); },
  removeItem(k) { delete mem[k]; },
};
const chunks = [];
function ventanaVacia() {
  return { document: { write(t) { chunks.push(String(t)); }, close() {} }, close() {}, focus() {}, print() {} };
}
const sandbox = {
  console, localStorage, URL, setTimeout, clearTimeout,
  location: { href: 'http://127.0.0.1:8080/misiones/x/x.html', search: '' },
  document: {
    addEventListener() {}, removeEventListener() {},
    getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; },
    createElement() { return { style: {}, getContext() { return { drawImage() {} }; } }; },
    readyState: 'complete',
  },
  navigator: {},
  open: ventanaVacia,
  addEventListener() {}, removeEventListener() {},
};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const cargar = rel => vm.runInContext(fs.readFileSync(path.join(RAIZ, rel), 'utf8'), sandbox, { filename: rel });

cargar('js/metas-centro.js');
cargar('js/motor-misiones.js');
cargar('js/tools/registros-admin.js');
const MC = sandbox.MetasCentro;
const hoja = sandbox.MotorMisiones.centro.hoja;

const LOGO = 'data:image/jpeg;base64,QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo=';
const LOGO2 = 'data:image/jpeg;base64,WllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkE=';
const SESION = JSON.stringify({ codigo: 'DOC-FICTICIO', nombre: 'Docente De La Cuenta' });
const centroA = { id: 'c-a', nombre: 'Centro Ficticio Las Flores', logo: LOGO, direccion: 'Colonia Ficticia', municipio: 'Villanueva', departamento: 'Cortés', docente: 'Docente Ficticia' };

/* ══════════ 1 · Todas las hojas de las misiones ══════════ */
console.log('── las hojas de las misiones ──');
function archivosJs(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...archivosJs(p));
    else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}
const fuentes = archivosJs(path.join(RAIZ, 'misiones')).concat([path.join(RAIZ, 'js/motor-mision.js')]);
const GUARDA = { printEval: '_evalPrintData', printEvalOp: '_evalOpData', printEvalCrit: '_evalCritData' };
let hojas = 0;
const malas = [];
const funcionesRaras = [];
const guardasRaras = [];
for (const f of fuentes) {
  const s = fs.readFileSync(f, 'utf8');
  let i = 0;
  while ((i = s.indexOf('<div class="ph"', i)) >= 0) {
    hojas++;
    /* El bloque va del <div class="ph"> hasta el cierre de la segunda raya. */
    const l1 = s.indexOf('<div class="ph-line">', i);
    const l2 = s.indexOf('<div class="ph-line">', l1 + 1);
    const fin = s.indexOf('</div>', l2) + 6;
    const bloque = s.slice(i, fin) + '</div>';
    const rel = path.relative(RAIZ, f);
    const r = hoja(bloque, centroA, 'Docente Ficticia');
    if (!r.includes('data-metas-encabezado="centro"') || /Centro Educativo:|>Instituto:|Universidad\/Instituto:/.test(r)) malas.push(rel);
    const antes = s.slice(0, i);
    const re = /function\s+([A-Za-z0-9_$]+)\s*\(/g;
    let m, ultima = null;
    while ((m = re.exec(antes))) ultima = m;
    const nombre = ultima ? ultima[1] : '?';
    if (!GUARDA[nombre]) funcionesRaras.push(rel + ' · ' + nombre);
    else if (!s.slice(ultima.index, ultima.index + 200).includes('window.' + GUARDA[nombre] + ')')) guardasRaras.push(rel + ' · ' + nombre);
    i++;
  }
}
ok(hojas >= 167, 'se encontraron las hojas de examen de las misiones', hojas);
ok(!malas.length, 'el motor sabe ponerle el centro a cada una de las ' + hojas + ' hojas', malas.slice(0, 5).join(', '));
ok(!funcionesRaras.length, 'cada hoja se imprime desde printEval, printEvalOp o printEvalCrit', funcionesRaras.slice(0, 5).join(', '));
ok(!guardasRaras.length, 'y cada una revisa su dato antes de abrir la ventana (_evalPrintData, _evalOpData, _evalCritData)', guardasRaras.slice(0, 5).join(', '));

/* ══════════ 2 · El encabezado nuevo ══════════ */
console.log('\n── el encabezado ──');
const HOJA = fs.readFileSync(path.join(RAIZ, 'misiones/1ciclo-segundo-grado/js/centena.js'), 'utf8');
const trozo = (HOJA.match(/<div class="ph"><h2>[\s\S]*?<\/p><\/div>/) || [''])[0];
const DOC = '<!DOCTYPE html><html><head><style>.ph{}</style></head><body><div id="evalPage">' + trozo
  + '<div class="sec-title">I. Completar</div></div><script>(function(){function fit(id){}fit("evalPage");})()</script></body></html>';
ok(trozo.includes('<strong>Centro Educativo:</strong>') && trozo.includes('<strong>Grado:</strong>'), 'la hoja de referencia trae la raya del centro');

const conCentro = hoja(DOC, centroA, 'Docente Ficticia');
const ph = conCentro.slice(conCentro.indexOf('<div class="ph"'), conCentro.indexOf('<div class="sec-title">'));
ok(/<img data-metas-logo[^>]*filter:grayscale\(1\)/.test(ph) && ph.includes(LOGO), 'el logo sale en blanco y negro');
ok(ph.indexOf('data-metas-logo') < ph.indexOf('CENTRO FICTICIO LAS FLORES') && ph.indexOf('CENTRO FICTICIO LAS FLORES') < ph.indexOf('<h2>'),
  'el logo va a la izquierda, el nombre en mayúsculas arriba, y debajo el título del examen');
ok(ph.includes('Colonia Ficticia, Villanueva · Docente: Docente Ficticia'), 'debajo del nombre, el lugar y el docente en letra pequeña');
ok(!/Centro Educativo:|Instituto:/.test(ph), 'ya no está la raya «Centro Educativo»');
ok(ph.includes('<strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span>'),
  'Nombre, Parcial y Fecha quedan como estaban');
ok(ph.includes('<strong>Grado y Sección:</strong><span class="ph-fill">&nbsp;</span><strong>N.º de lista:</strong><span class="ph-xs">&nbsp;</span>'),
  'Grado y Sección y N.º de lista quedan en blanco para el alumno');
ok(conCentro.includes(trozo.match(/<h2>[\s\S]*?<\/h2>/)[0]) && conCentro.includes(trozo.match(/<p class="ph-crit">[\s\S]*?<\/p>/)[0]),
  'el título, la forma y el valor total no cambian');
ok(conCentro.slice(conCentro.indexOf('<div class="sec-title">')) === DOC.slice(DOC.indexOf('<div class="sec-title">')),
  'las preguntas y el ajuste de la hoja no se tocan');
ok(conCentro.includes('data-metas-encabezado="centro"'), 'la hoja queda marcada para que nadie más la llene');
const sinAjuste = DOC.replace(/<script>[\s\S]*?<\/script>/, '');
const finDeGrado = hoja(sinAjuste, centroA, '');
ok(!conCentro.includes('data-metas-centro]') && /<script>[^<]*data-metas-centro[^<]*zoom[^<]*<\/script><\/body>/.test(finDeGrado),
  'solo la hoja sin ajuste propio (Fin de grado) recibe el ajuste que le quita lo que el bloque agrega');
ok(!hoja(sinAjuste, null, '').includes('<script>'), '«Sin encabezado» no recibe ningún ajuste');

const pelado = hoja(DOC, { id: 'c-z', nombre: 'Escuela Sin Datos' }, '');
ok(pelado.includes('ESCUELA SIN DATOS') && !pelado.includes('<img') && !pelado.includes('aria-hidden') && !pelado.includes('font-size:8.5pt'),
  'sin logo, sin lugar y sin docente no quedan huecos ni líneas vacías');
const soloDocente = hoja(DOC, { id: 'c-z', nombre: 'Escuela X', municipio: 'Danlí' }, '');
ok(soloDocente.includes('>Danlí</div>') && !soloDocente.includes('Docente:'), 'sin docente, solo el lugar');
const malo = hoja(DOC, { id: 'c-z', nombre: '<b>Escuela</b>', logo: 'javascript:alert(1)' }, '');
ok(!malo.includes('<b>') && !malo.includes('javascript:'), 'el nombre se escribe como texto y un logo que no es imagen no entra');

const uni = '<div class="ph"><h2>T</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Universidad/Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Carrera/Sección:</strong><span class="ph-s">&nbsp;</span><strong>N.º Cuenta:</strong><span class="ph-xs">&nbsp;</span></div></div>';
ok(hoja(uni, centroA, '').includes('<strong>Carrera/Sección:</strong><span class="ph-fill">&nbsp;</span><strong>N.º Cuenta:</strong>'),
  'la hoja universitaria conserva sus rótulos');

/* (d) «Sin encabezado» */
const sin = hoja(DOC, null, '');
ok(sin.replace(' data-metas-encabezado="sin"', '') === DOC, '(d) «Sin encabezado»: la hoja de siempre, con la raya en blanco');
ok(MC.examen(sin) === sin, '(d) y MetasCentro.examen no la llena aunque haya perfil y sesión');
const rara = DOC.replace('<strong>Grado:</strong>', '<strong>Curso:</strong>');
ok(hoja(rara, centroA, '').replace(' data-metas-encabezado="sin"', '') === rara, 'una hoja de forma desconocida sale como siempre, sin perder nada');

/* ══════════ 3 · La impresión envuelta ══════════ */
console.log('\n── la impresión de la misión ──');
let llamadas = 0;
sandbox.printEval = function () {
  llamadas++;
  if (!sandbox._evalPrintData) return 'aviso';
  const w = sandbox.open('', '_blank', '');
  w.document.write(DOC);
  w.document.close();
  return 'impreso';
};
sandbox.MotorMisiones.centro.envolver();
ok(sandbox.printEval.__metasCentro === true, 'printEval queda envuelta');
const imprimir = () => { chunks.length = 0; const r = sandbox.printEval(); return { r, html: chunks.join('') }; };

const perfilA = { id: 'c-a', nombre: centroA.nombre, direccion: centroA.direccion, municipio: centroA.municipio, departamento: centroA.departamento, docente: '', logo: LOGO, logoSec: '', grado: '6', seccion: '1', gradoSeccion: '6º-1', anio: '2027' };
localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA }, centros: [centroA] }));

let r = imprimir();
ok(r.r === 'aviso' && !r.html, 'sin examen generado, la misión avisa y no se pregunta nada');
sandbox._evalPrintData = { listo: true };

r = imprimir();
ok(r.html === DOC, '(a) sin sesión: la hoja sale byte por byte como hoy, aunque el perfil esté en el aparato');

localStorage.setItem('METAS_DOCENTE_V1', SESION);
const abrirAntes = sandbox.open;
r = imprimir();
ok(r.html.includes('data-metas-encabezado="centro"') && r.html.includes('CENTRO FICTICIO LAS FLORES') && r.html.includes(LOGO) && !r.html.includes('Centro Educativo:'),
  '(b) docente con un centro: logo y nombre arriba, sin la raya en blanco');
ok(r.html.includes('Docente: Docente Ficticia'), '(b) con el docente que trae el centro');
ok(!r.html.includes('6º-1'), '(b) el grado no se llena: lo escribe el alumno');
ok(sandbox.open === abrirAntes, 'después de imprimir, window.open queda como estaba');

localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA }, centros: [Object.assign({}, centroA, { docente: '' })] }));
r = imprimir();
ok(r.html.includes('Docente: Docente De La Cuenta'), 'si el centro no trae docente, va el nombre de la cuenta');
localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({ codigo: 'DOC-FICTICIO' }));
r = imprimir();
ok(!r.html.includes('Docente:') && r.html.includes('Colonia Ficticia, Villanueva</div>'), 'y si tampoco hay nombre en la cuenta, no hay línea de docente');

localStorage.setItem('METAS_DOCENTE_V1', SESION);
localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA }, centros: [Object.assign({}, centroA, { nombre: '  ' })] }));
r = imprimir();
ok(r.html.replace(' data-metas-encabezado="sin"', '') === DOC, 'un centro sin nombre no cuenta: la hoja de siempre, sin logo ni nombre a medias');

localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA }, centros: [centroA] }));
localStorage.removeItem('METAS_DOCENTE_V1');
r = imprimir();
ok(r.html === DOC, '(e) el docente cerró sesión: la hoja vuelve a salir como hoy, con la raya en blanco');
ok(JSON.parse(localStorage.getItem('METAS_CENTRO_LECTURA')).centros.length === 1, '(e) y el perfil sigue guardado: no se borró nada');

/* ══════════ 4 · La lista de centros ══════════ */
console.log('\n── la lista de centros ──');
function apiDe(tablas) {
  return { lista(t) { return (tablas[t] || []).map(x => Object.assign({}, x)); } };
}
const filasCentros = [
  { id: 'c-b', nombre: 'Centro Ficticio Nuevo', logo: LOGO2, direccion: '', municipio: 'Danlí', departamento: 'El Paraíso', anio_lectivo: 2027, created_at: '2027-02-01T00:00:00Z' },
  { id: 'c-a', nombre: centroA.nombre, logo: LOGO, direccion: centroA.direccion, municipio: centroA.municipio, departamento: centroA.departamento, anio_lectivo: 2027, created_at: '2027-01-01T00:00:00Z' },
  { id: 'c-a', nombre: centroA.nombre, logo: LOGO, anio_lectivo: 2027, created_at: '2027-01-01T00:00:00Z' },
];
const filasAulas = [{ id: 'aula-1', centro_id: 'c-a', grado: 6, seccion: '1', escuela: centroA.nombre, docente_nombre: 'Docente Del Grupo' }];
localStorage.removeItem('METAS_CENTRO_LECTURA');
MC.refrescar(apiDe({ centros: filasCentros, aulas: filasAulas }), 'aula-1');
const copia = JSON.parse(localStorage.getItem('METAS_CENTRO_LECTURA'));
ok(Array.isArray(copia.centros) && copia.centros.length === 2, 'refrescar guarda la lista de centros, sin repetidos', JSON.stringify(copia.centros && copia.centros.map(c => c.id)));
ok(copia.centros[0].id === 'c-a' && copia.centros[1].id === 'c-b', 'en el orden de Mi aula: el más antiguo primero');
ok(copia.centros[1].nombre === 'Centro Ficticio Nuevo' && copia.centros[1].municipio === 'Danlí',
  'incluye el centro que todavía no tiene grupos');
ok(JSON.stringify(Object.keys(copia.centros[0]).sort()) === JSON.stringify(['departamento', 'direccion', 'docente', 'id', 'logo', 'municipio', 'nombre']),
  'cada centro lleva id, nombre, logo, dirección, municipio, departamento y docente');
ok(copia.centros[0].docente === 'Docente Del Grupo', 'sin docente en el centro, se toma el del grupo, como en la pantalla del perfil');
ok(copia.actual === 'aula-1' && Object.keys(copia.porAula).join() === 'aula-1' && copia.porAula['aula-1'].nombre === centroA.nombre,
  'el perfil por grupo y el grupo abierto quedan como antes');

const sinApi = sandbox.MetasDatos;
ok(sinApi === undefined && MC.centros().length === 2 && MC.centros()[1].id === 'c-b', 'MetasCentro.centros() devuelve la lista desde la copia');
sandbox.MetasDatos = apiDe({ centros: filasCentros, aulas: filasAulas });
ok(MC.centros().length === 2, 'y con el motor de datos, desde la base');
delete sandbox.MetasDatos;

MC.refrescar(apiDe({ centros: [], aulas: filasAulas }), 'aula-1');
ok(JSON.parse(localStorage.getItem('METAS_CENTRO_LECTURA')).centros.length === 2, 'una lista vacía de la base no borra la que había');
localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA } }));
MC.refrescar(apiDe({ centros: filasCentros, aulas: [] }), null);
const sinGrupos = JSON.parse(localStorage.getItem('METAS_CENTRO_LECTURA'));
ok(sinGrupos.centros.length === 2 && sinGrupos.porAula['aula-1'] && sinGrupos.actual === 'aula-1',
  'un docente con centros y sin grupos también guarda la lista, sin tocar lo demás');
localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': perfilA, 'aula-2': perfilA } }));
ok(MC.centros().length === 1 && MC.centros()[0].nombre === centroA.nombre, 'una copia de antes (sin lista) se arma con los perfiles de sus grupos, sin repetir');

/* ══════════ 5 · Los impresos de Mi aula no cambian ══════════ */
console.log('\n── los impresos de Mi aula ──');
const grupo = {
  id: 'aula-1', escuela: '', grado: '6', seccion: '1', logo: '', logoSec: '',
  boleta: { director: '', docente: 'Docente Ficticia', lugar: '', municipio: '', departamento: '', anio: '2027', escalaPers: ['S', 'MB', 'B'] },
  lista: [{ num: 1, nombre: 'Alumna Ficticia Uno' }], materias: ['Matemáticas'], notas: {},
};
function boleta(g) {
  chunks.length = 0;
  sandbox.adPrintBoletas(g, null);
  return chunks.join('');
}
function impresos() {
  const pi = MC.paraImpreso(grupo);
  return JSON.stringify({
    boleta: boleta(pi),
    paraImpreso: pi,
    marca: MC.marca(),
    get: MC.get('aula-1'),
    textoCentro: MC.textoCentro(grupo, 'Escrito a mano'),
  });
}
/* La copia como la escribe main (sin la lista) y como la escribe ahora. */
const copiaDeAntes = JSON.stringify({ actual: 'aula-1', porAula: { 'aula-1': copia.porAula['aula-1'] } });
const copiaDeAhora = JSON.stringify(copia);
const salidas = [];
for (const [rotulo, guardada, sesion] of [
  ['copia de antes, sin sesión', copiaDeAntes, null],
  ['copia de antes, con sesión', copiaDeAntes, SESION],
  ['copia nueva, sin sesión', copiaDeAhora, null],
  ['copia nueva, con sesión', copiaDeAhora, SESION],
]) {
  localStorage.setItem('METAS_CENTRO_LECTURA', guardada);
  if (sesion) localStorage.setItem('METAS_DOCENTE_V1', sesion); else localStorage.removeItem('METAS_DOCENTE_V1');
  salidas.push([rotulo, impresos()]);
}
ok(salidas[0][1].includes('CENTRO FICTICIO LAS FLORES') && salidas[0][1].includes(LOGO), 'la boleta de referencia lleva el centro y el logo');
ok(salidas.every(s => s[1] === salidas[0][1]), 'boleta, paraImpreso, marca, get y textoCentro salen iguales en los cuatro casos',
  salidas.filter(s => s[1] !== salidas[0][1]).map(s => s[0]).join(', '));

const conPh = [];
for (const f of archivosJs(path.join(RAIZ, 'js/tools')).concat([path.join(RAIZ, 'js/app.js')])) {
  if (fs.readFileSync(f, 'utf8').includes('class="ph"')) conPh.push(path.relative(RAIZ, f));
}
ok(!conPh.length, 'ningún impreso de Mi aula usa la hoja de examen (class="ph"): examen() no los toca', conPh.join(', '));

console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ El examen impreso lleva el centro del docente con sesión, y todo lo demás sale como hoy');
process.exit(fallos ? 1 : 0);
