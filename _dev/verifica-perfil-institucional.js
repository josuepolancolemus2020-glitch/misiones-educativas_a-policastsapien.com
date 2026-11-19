/* =====================================================================
   M.E.T.A.S · Perfil institucional al entrar y en los impresos
   ---------------------------------------------------------------------
   Con datos ficticios:
   · en Mi aula, el aviso sale si todavía no hay perfil y no sale si
     ya hay uno; al tocarlo se abre el perfil en su propia pantalla;
   · al cambiar de centro se ven solo los grupos de ese centro;
   · un centro nuevo no se lleva los grupos que ya estaban;
   · el nombre del maestro entra en el impreso si el perfil lo trae,
     y vacío no borra el que ya estaba escrito;
   · cada documento conectado, sin perfil, da el mismo HTML que da
     otra vez (es el de hoy: el perfil no entra en la hoja);
   · el análisis, la papeleta, el parte y el collage: sin perfil el HTML
     no cambia; con un perfil ficticio salen el logo y el nombre;
   · el formulario de encabezado vive en su pantalla, no junto a Notas SACE.

   Uso: node _dev/verifica-perfil-institucional.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };

const LOGO = 'data:image/jpeg;base64,QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVo=';
const NOMBRE_HOY = 'Escuela Escrita A Mano';
const NOMBRE_PERFIL = 'Centro Ficticio Las Flores';

function clon(o) { return JSON.parse(JSON.stringify(o)); }

function grupoBase() {
  return {
    id: 'GFICT1',
    escuela: NOMBRE_HOY,
    grado: '6',
    seccion: '1',
    logo: '',
    logoSec: '',
    boleta: {
      director: 'Director Escrito A Mano',
      docente: 'Docente Ficticia',
      lugar: 'Calle Escrita A Mano',
      municipio: 'Municipio Escrito',
      departamento: 'Departamento Escrito',
      anio: '2026',
      codigoCentro: '',
      modalidad: '',
      jornada: '',
      aldea: '',
      escalaPers: ['S', 'MB', 'B'],
    },
    lista: [{
      num: 1, nombre: 'Alumna Ficticia Uno', idn: '0801-1990-00001', sexo: 'F',
      fnac: '2014-05-02', estado: 'activo', sace: true, claveFamilia: '15-K7QM',
    }],
    materias: ['Matemáticas'],
    notas: { I: { Matemáticas: { 1: '80' } } },
    recuperacion: {},
    inasisOficial: {},
    asistencia: [{ f: '2026-03-02', aus: { 1: 'A' } }],
    colectas: [{
      id: 'col-ficticia', concepto: 'Aporte ficticio', fecha: '2026-03-01', montoAlumno: '50.00',
      pagos: { 1: '50.00' }, pagosF: { 1: '2026-03-02' }, gastos: [],
    }],
    controles: [{ id: 'ctrl-ficticio', nombre: 'Entrega de ficha', icono: '📄', tipo: 'marca', fecha: '2026-03-02', datos: { 1: '1' } }],
    bitacora: [],
    equipos: {},
  };
}

function estadoAdmin(g) {
  return {
    v: 2, activo: g.id, grupos: [g],
    inventario: [{ id: 'inv-1', fecha: '2026-03-01', nombre: 'Borrador ficticio', cant: 1, valor: '10.00', dueno: 'escuela', cat: 'util', factura: false }],
    gastos: [{ id: 'gas-1', fecha: '2026-03-01', concepto: 'Copias ficticias', monto: '25.00', cat: 'copias', estado: 'pendiente', factura: false, escuela: NOMBRE_HOY, cobrarA: 'Dirección' }],
  };
}

const mem = {};
const localStorage = {
  getItem(k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
  setItem(k, v) { mem[k] = String(v); },
  removeItem(k) { delete mem[k]; },
};
const chunks = [];
function ventanaVacia() {
  const doc = { write(t) { chunks.push(String(t)); }, close() {}, open() {} };
  return { document: doc, close() {}, focus() {}, print() {}, addEventListener() {} };
}
const RealDate = Date;
function Fecha(...a) {
  return a.length ? new RealDate(...a) : new RealDate(2026, 10, 18, 12, 0, 0);
}
Fecha.now = () => new RealDate(2026, 10, 18, 12, 0, 0).getTime();
Fecha.parse = RealDate.parse;
Fecha.UTC = RealDate.UTC;
Fecha.prototype = RealDate.prototype;

const sandbox = {
  console, localStorage, Date: Fecha, URL, Promise, setTimeout, clearTimeout,
  location: { href: 'http://127.0.0.1:8080/index.html' },
  document: {
    addEventListener() {},
    removeEventListener() {},
    getElementById() { return null; },
    querySelector() { return null; },
    querySelectorAll() { return []; },
    createElement() { return { style: {}, setAttribute() {}, click() {}, remove() {}, appendChild() {} }; },
    body: { appendChild() {}, removeChild() {} },
    readyState: 'complete',
  },
  navigator: {},
  open: ventanaVacia,
  addEventListener() {},
  removeEventListener() {},
  Blob: function Blob() {},
  toast() {},
  LECTURA_TEXTOS: {
    6: [{
      id: 'tx-ficticio', titulo: 'El gato ficticio', texto: 'El gato ficticio mira la luna de papel.',
      preguntas: [{ q: '¿A quién mira?', tipo: 'literal', o: ['A la luna', 'Al sol', 'Al mar'], c: 0 }],
    }],
  },
};
sandbox.URL.createObjectURL = () => 'blob:ficticio';
sandbox.URL.revokeObjectURL = () => {};
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

function cargar(rel) {
  vm.runInContext(fs.readFileSync(path.join(RAIZ, rel), 'utf8'), sandbox, { filename: rel });
}

cargar('js/metas-centro.js');
cargar('js/tools/sace-lista.js');
cargar('js/tools/cuadros-sace.js');
cargar('js/tools/registros-admin.js');
cargar('js/tools/equipos.js');
cargar('js/data/instrumentos-evaluacion.js');
cargar('js/tools/herramientas-evaluacion.js');
cargar('js/tools/estadisticas-alumno.js');
cargar('js/tools/lectura-fluidez.js');
cargar('js/tools/convocatoria.js');
cargar('js/tools/plan-accion.js');
sandbox.FRASES = ['Una frase ficticia.'];
sandbox.DCNB_MAP = {};
sandbox.MISSIONS = [];
cargar('js/app.js');

function ponerGrupo(g) {
  localStorage.setItem('METAS_ADMIN_V1', JSON.stringify(estadoAdmin(g)));
}
function quitarPerfil() { localStorage.removeItem('METAS_CENTRO_LECTURA'); }
function ponerPerfil(g) {
  const perfil = {
    nombre: NOMBRE_PERFIL, direccion: 'Colonia Ficticia', aldea: 'Aldea Ficticia',
    municipio: 'Villanueva', departamento: 'Cortés', codigoSace: '000000000000',
    director: 'Directora Ficticia', anio: '2027', modalidad: 'No aplica', jornada: 'Matutina',
    logo: LOGO, logoSec: '', grado: '6', seccion: '1', gradoSeccion: '6º-1',
  };
  localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({
    actual: g.id, porAula: { [g.id]: perfil },
  }));
}
function htmlDe(fn) {
  chunks.length = 0;
  const r = fn();
  if (chunks.length) return chunks.join('');
  return r == null ? '' : String(r);
}
function imgs(html) { return (String(html).match(/<img\b/g) || []).length; }
function traePerfil(html) { return /centro ficticio las flores/i.test(html); }

/* nombre: el impreso escribe el centro. logo: ya tenía un hueco de logo. */
const docs = [
  ['Boletas', true, true, g => sandbox.adPrintBoletas(g, null)],
  ['Resumen final por grado', true, true, g => sandbox.adPrintResumenFinal(g)],
  ['Cuadro final del año', true, true, g => sandbox.adPrintCuadroFinal(g)],
  ['Listado de reprobados', true, false, g => sandbox.adPrintListaReprobados(g)],
  ['Matrícula por edades', true, false, g => sandbox.adPrintCuadroEdades(g, '2026-11-18')],
  ['Expediente del aula', true, false, g => sandbox.adPrintExpediente(estadoAdmin(g))],
  ['Solicitud de reembolso', true, false, g => sandbox.adPrintGastos(estadoAdmin(g).gastos, g)],
  ['Texto de reembolso', true, false, g => sandbox.adGastoTxtResumen(estadoAdmin(g).gastos, g)],
  ['Texto de un gasto', true, false, g => sandbox.adGastoTxtUno(Object.assign({}, estadoAdmin(g).gastos[0], { escuela: '' }), g)],
  ['Cuadro de gastos de mi bolsillo', true, true, g => sandbox.adPrintCuadroBolsillo(g)],
  ['Cuadro de inventario', true, true, g => sandbox.adPrintCuadroInventario(g)],
  ['Acta de inventario', true, false, g => sandbox.adPrintInventario(estadoAdmin(g).inventario, g)],
  ['Texto de inventario', true, false, g => sandbox.adInvTxtResumen(estadoAdmin(g).inventario, g)],
  ['Cuadro de ingresos', true, true, g => sandbox.adPrintCuadroIngresos(g)],
  ['Cuadro de egresos', true, true, g => sandbox.adPrintCuadroEgresos(g)],
  ['Talonario de aportes', true, true, g => sandbox.adPrintTalonario(g)],
  ['Hoja de colecta', true, true, g => sandbox.adPrintHojaColecta(g, g.colectas[0])],
  ['Resumen de asistencia', true, false, g => sandbox.adPrintAsis(g, '2026-03')],
  ['Asistencia día por día', true, false, g => sandbox.adPrintAsisDias(g, '2026-03')],
  ['Control del aula', true, false, g => sandbox.adPrintControl(g, g.controles[0])],
  ['Planilla de notas', true, false, g => sandbox.adPrintSace(g, 'I', 'Matemáticas')],
  ['Tiras de claves', true, false, g => sandbox.adTirasTodas(g)],
  ['Tira de una clave', true, false, g => sandbox.adTiraUno(g, 1)],
  ['Equipos de trabajo', true, false, g => sandbox.eqImprimir(g)],
  ['Hoja de evaluación', true, false, g => sandbox.heImprimirLista({
    titulo: 'Prueba ficticia', materia: 'Matemáticas', fecha: '2026-03-02', gid: g.id, tipo: 'actividades',
    calculo: 'promedio', criterios: [{ t: 'Resuelve', pts: 10 }],
  })],
  ['Rúbrica', true, false, g => sandbox.heImprimirRubricas({
    titulo: 'Rúbrica ficticia', materia: 'Matemáticas', fecha: '2026-03-02', gid: g.id,
    criterios: [{ t: 'Resuelve', d: ['', '', '', ''] }],
  })],
  ['Informe del estudiante', true, true, g => sandbox.estImprimirInforme(g, [1])],
  ['Informe del grado', true, true, g => sandbox.estImprimirInformeGrado(g)],
  ['Ficha de lectura', true, false, g => sandbox.lecImprimirFichas(g, 6, ['tx-ficticio'])],
  ['Listado de convocatoria', true, false, g => sandbox.convImprimirListado(convDe(g))],
  ['Boletos de convocatoria', true, false, g => sandbox.convImprimirBoletos(convDe(g))],
  ['Boletos en blanco', true, false, g => sandbox.convImprimirBlancos(convDe(g), 2, 1)],
  ['Acta de consentimiento', true, false, g => sandbox.paImprimirDocumentosTesis(tesisDe(g), [alumnoTesis()], 'consentimiento')],
  ['Programación DCNB', true, false, g => {
    localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({
      nombre: 'Docente Ficticia', escuela: g.escuela, progFiltros: { grado: 6, mes: 0, materia: '' },
    }));
    sandbox.docenteImprimirProg();
  }],
];

function convDe(g) {
  return {
    titulo: 'Salida ficticia', icono: '📣', escuela: g.escuela, fecha: '2026-04-02', hora: '07:00',
    lugar: 'Parque ficticio', aporte: 0, incluye: '', maestro: 'Docente Ficticia', codigo: 'FIC',
    resp: [{ va: 1, alumno: 'Alumna Ficticia Uno', grado: '6', seccion: '1', personas: 1 }],
    manual: [], pagos: {},
  };
}
function alumnoTesis() {
  return {
    num: 1, nombre: 'Alumna Ficticia Uno', codigoTesis: 'TESIS-01', prom: 80, med: 80, std: 0,
    delta: 0, notas: [80], promConc: 80, promOper: 80, pruebasHechas: 1, temasReprobados: [],
    casoTipo: 'Caso ficticio', patronTag: 'estable', patronClase: '', sintesisCaso: 'Caso de prueba.',
    mis: { intentos: 0, misionesUnicas: 0 },
  };
}
function tesisDe(g) {
  return { grupoAula: g, evalsStats: [{}] };
}

function probarDoc(nombre, conNombre, conLogo, fn) {
  const g = grupoBase();
  ponerGrupo(g);
  quitarPerfil();
  let hoy;
  let otra;
  try {
    hoy = htmlDe(() => fn(clon(g)));
    otra = htmlDe(() => fn(clon(g)));
  } catch (e) {
    ok(false, nombre + ' se puede armar sin perfil (' + e.message + ')');
    return;
  }
  ok(hoy.length > 40 && hoy === otra, nombre + ' sin perfil da el mismo HTML dos veces');
  if (!(hoy.length > 40 && hoy === otra)) return;
  if (conNombre) ok(new RegExp(NOMBRE_HOY, 'i').test(hoy) && !traePerfil(hoy), nombre + ' sin perfil sigue con el nombre escrito a mano');
  ponerPerfil(g);
  let con;
  try { con = htmlDe(() => fn(clon(g))); }
  catch (e) { ok(false, nombre + ' se puede armar con perfil (' + e.message + ')'); quitarPerfil(); return; }
  ok(traePerfil(con), nombre + ' con perfil trae el nombre del centro');
  if (conLogo) ok(con.includes(LOGO), nombre + ' con perfil pone el logo en el hueco que ya tenía');
  else ok(!con.includes(LOGO) && imgs(con) === imgs(hoy), nombre + ' no gana un logo que hoy no tiene');
  quitarPerfil();
  let vuelta;
  try { vuelta = htmlDe(() => fn(clon(g))); }
  catch (e) { ok(false, nombre + ' al quitar el perfil vuelve a armarse'); return; }
  ok(vuelta === hoy, nombre + ' al quitar el perfil queda otra vez como hoy');
}

docs.forEach(d => probarDoc(d[0], d[1], d[2], d[3]));

/* ── Los cuatro documentos que todavía no llevaban el logo ── */
function htmlPlan() {
  chunks.length = 0;
  vm.runInContext('_paStudents = ['
    + '{ id: 1, name: "Alumna Ficticia Uno", grade: 80 },'
    + '{ id: 2, name: "Alumno Ficticio Dos", grade: 55 }]; paPrint();', sandbox);
  return chunks.join('');
}
const gPlan = grupoBase();
ponerGrupo(gPlan);
quitarPerfil();
const planHoy = htmlPlan();
const planOtra = htmlPlan();
ok(planHoy.length > 200 && planHoy === planOtra && !planHoy.includes(LOGO) && !traePerfil(planHoy)
  && !planHoy.includes('data-metas="marca-centro"'),
  'el análisis, sin perfil, repite el mismo HTML de hoy');
ponerPerfil(gPlan);
const planCon = htmlPlan();
const iLogoPlan = planCon.indexOf('data-metas-logo');
const iTitPlan = planCon.indexOf('ANÁLISIS Y PLAN DE ACCIÓN');
const iNomPlan = planCon.toLowerCase().indexOf('centro ficticio las flores');
const iSubPlan = planCon.indexOf('class="head-sub"');
ok(planCon.includes(LOGO) && iLogoPlan >= 0 && iLogoPlan < iTitPlan && iTitPlan < iNomPlan && iNomPlan < iSubPlan,
  'el análisis pone el logo a la izquierda del título azul y el nombre debajo');
ok(/width:46px;height:46px;object-fit:contain/.test(planCon), 'el logo del análisis mide 46 px y entra completo');
quitarPerfil();
ok(htmlPlan() === planHoy, 'el análisis, al quitar el perfil, queda otra vez como hoy');

cargar('js/tools/parte-mensual.js');
cargar('js/tools/gobierno-escolar.js');
cargar('js/tools/collage-maker.js');
quitarPerfil();
ok(sandbox.pmMarcaHtml() === '', 'el parte, sin perfil, no agrega HTML');
ponerPerfil(gPlan);
const parte = sandbox.pmMarcaHtml();
ok(parte.includes(LOGO) && /centro ficticio las flores/i.test(parte)
  && parte.indexOf('data-metas-logo') < parte.toLowerCase().indexOf('centro ficticio las flores'),
  'el parte pone el logo a la izquierda y el nombre al lado');
ok(/width:46px;height:46px;object-fit:contain/.test(parte), 'el logo del parte mide 46 px y entra completo');
ok(/beforebegin/.test(fs.readFileSync(path.join(RAIZ, 'js/tools/parte-mensual.js'), 'utf8'))
  && /parte-section-title/.test(fs.readFileSync(path.join(RAIZ, 'js/tools/parte-mensual.js'), 'utf8')),
  'el parte inserta la marca arriba del título del grupo');
quitarPerfil();
ok(sandbox.pmMarcaHtml() === '', 'el parte, al quitar el perfil, no deja marca');

ok(sandbox.coElegirLogo('data:image/jpeg;base64,DOCENTE', LOGO) === 'data:image/jpeg;base64,DOCENTE',
  'en el collage, si el docente sube un logo, manda el suyo');
ok(sandbox.coElegirLogo('', LOGO) === LOGO, 'en el collage, sin logo propio, se usa el del perfil');
ok(sandbox.coElegirLogo(null, '') === '', 'en el collage, sin perfil y sin logo propio, no hay logo');

/* Papeleta: el título de la vista, con un DOM mínimo. */
function nodoGe(tag) {
  const n = { tag: tag, children: [], parent: null, attrs: {}, style: {}, className: '', textContent: '' };
  n.appendChild = function (c) {
    if (c.parent) c.parent.children = c.parent.children.filter(function (x) { return x !== c; });
    c.parent = n;
    n.children.push(c);
    return c;
  };
  n.insertBefore = function (c, ref) {
    if (c.parent) c.parent.children = c.parent.children.filter(function (x) { return x !== c; });
    c.parent = n;
    const i = ref ? n.children.indexOf(ref) : n.children.length;
    n.children.splice(i < 0 ? n.children.length : i, 0, c);
    return c;
  };
  n.remove = function () { if (n.parent) n.parent.children = n.parent.children.filter(function (x) { return x !== n; }); n.parent = null; };
  n.setAttribute = function (k, v) { n.attrs[k] = String(v); if (k === 'class') n.className = String(v); };
  n.getAttribute = function (k) { return Object.prototype.hasOwnProperty.call(n.attrs, k) ? n.attrs[k] : null; };
  n.querySelector = function (sel) {
    const todos = [];
    (function rec(x) { todos.push(x); x.children.forEach(rec); })(n);
    return todos.filter(function (x) { return x !== n; }).find(function (x) { return casaGe(x, sel); }) || null;
  };
  Object.defineProperty(n, 'parentNode', { get: function () { return n.parent; } });
  Object.defineProperty(n, 'lastElementChild', { get: function () { return n.children[n.children.length - 1] || null; } });
  return n;
}
function casaGe(n, sel) {
  if (sel.charAt(0) === '.') return n.className === sel.slice(1) || (n.attrs.class === sel.slice(1));
  if (sel.indexOf('[') === 0) {
    const m = /\[([^\]=]+)(?:="([^"]*)")?\]/.exec(sel);
    return m && (m[2] == null ? n.getAttribute(m[1]) != null : n.getAttribute(m[1]) === m[2]);
  }
  return false;
}
const headerGe = nodoGe('header');
headerGe.className = 'app-header';
const tituloGe = nodoGe('h1');
tituloGe.className = 'view-title';
tituloGe.textContent = 'Gobierno Escolar 2026';
const cierreGe = nodoGe('div');
headerGe.appendChild(nodoGe('button'));
headerGe.appendChild(tituloGe);
headerGe.appendChild(cierreGe);
const qsAntes = sandbox.document.querySelector;
const ceAntes = sandbox.document.createElement;
sandbox.document.querySelector = function (sel) {
  if (sel === '#view-gobierno .app-header') return headerGe;
  if (headerGe.querySelector) return headerGe.querySelector(sel);
  return null;
};
sandbox.document.createElement = function (tag) { return nodoGe(tag); };
quitarPerfil();
sandbox.gePonerMarca();
ok(tituloGe.parent === headerGe && !headerGe.querySelector('[data-metas="marca-centro"]'),
  'la papeleta, sin perfil, deja el título donde estaba');
ponerPerfil(gPlan);
sandbox.gePonerMarca();
const marcaGe = headerGe.querySelector('[data-metas="marca-centro"]');
const imgGe = marcaGe && marcaGe.children[0];
const colGe = marcaGe && marcaGe.children[1];
const nomGe = colGe && colGe.children[1];
ok(!!marcaGe && imgGe && imgGe.getAttribute('data-metas-logo') === '' && imgGe.src === LOGO
  && colGe && colGe.children[0] === tituloGe && nomGe && /centro ficticio las flores/i.test(nomGe.textContent),
  'la papeleta pone el logo a la izquierda del título y el nombre debajo');
ok(imgGe && /width:46px;height:46px;object-fit:contain/.test(imgGe.style.cssText),
  'el logo de la papeleta mide 46 px y entra completo');
quitarPerfil();
sandbox.geRestaurarTitulo();
ok(tituloGe.parent === headerGe && headerGe.children[1] === tituloGe && !headerGe.querySelector('[data-metas="marca-centro"]'),
  'la papeleta, al quitar el perfil, deja el título otra vez como hoy');
sandbox.document.querySelector = qsAntes;
sandbox.document.createElement = ceAntes;

/* Dos grupos 6º-1 en centros distintos: cada uno usa su centro_id. */
const LOGO_DOS = LOGO + 'QQ==';
sandbox.MetasDatos = {
  lista: function (nombre) {
    if (nombre === 'aulas') return [
      { id: 'aula-uno', grado: 6, seccion: '1', escuela: 'Centro Uno', centro_id: 'c1' },
      { id: 'aula-dos', grado: 6, seccion: '1', escuela: 'Centro Dos', centro_id: 'c2' },
    ];
    if (nombre === 'centros') return [
      { id: 'c1', nombre: 'Centro Uno', logo: LOGO, logo_sec: '', anio_lectivo: 2026 },
      { id: 'c2', nombre: 'Centro Dos', logo: LOGO_DOS, logo_sec: '', anio_lectivo: 2026 },
    ];
    return [];
  },
};
const impUno = sandbox.MetasCentro.paraImpreso({ id: 'aula-uno', grado: '6', seccion: '1', escuela: 'Escrito a mano', boleta: {} });
const impDos = sandbox.MetasCentro.paraImpreso({ id: 'aula-dos', grado: '6', seccion: '1', escuela: 'Escrito a mano', boleta: {} });
const ajeno = { id: 'blob-viejo', grado: '6', seccion: '1', escuela: 'Escuela Escrita A Mano', boleta: { director: 'X' } };
const impAjeno = sandbox.MetasCentro.paraImpreso(ajeno);
ok(impUno.escuela === 'Centro Uno' && impUno.logo === LOGO, 'el primer 6º-1 usa el centro de su aula');
ok(impDos.escuela === 'Centro Dos' && impDos.logo === LOGO_DOS, 'el segundo 6º-1 usa el otro centro');
ok(impAjeno === ajeno, 'un grupo suelto con el mismo grado no hereda el centro del otro');
delete sandbox.MetasDatos;

sandbox.MetasDatos = {
  lista: function (nombre) {
    if (nombre === 'aulas') return [
      { id: 'aula-uno', grado: 6, seccion: '1', escuela: 'CEB John Arnold Cook', centro_id: 'c1' },
    ];
    if (nombre === 'centros') return [
      { id: 'c1', nombre: 'CEB John Arnold Cook', docente: docenteImpreso, anio_lectivo: 2026 },
    ];
    return [];
  },
};
let docenteImpreso = '';
const sinMaestro = sandbox.MetasCentro.paraImpreso({
  id: 'aula-uno', grado: '6', seccion: '1', escuela: 'X',
  boleta: { docente: 'Docente Escrita A Mano' },
});
ok(sinMaestro.boleta.docente === 'Docente Escrita A Mano',
  'sin nombre en el perfil, el del impreso se queda');
docenteImpreso = 'Maestra del Centro';
const conMaestro = sandbox.MetasCentro.paraImpreso({
  id: 'aula-uno', grado: '6', seccion: '1', escuela: 'X',
  boleta: { docente: 'Docente Escrita A Mano' },
});
ok(conMaestro.boleta.docente === 'Maestra del Centro',
  'el nombre del maestro del perfil sale en el impreso');
delete sandbox.MetasDatos;

/* Excel: no es HTML. Sin perfil, el centro del encabezado no cambia. */
function excelCentro(cual) {
  let visto = null;
  const api = sandbox.ResumenSace;
  const prev = api.xlsx;
  api.xlsx = function (cs, opt) { visto = opt; return new Uint8Array([1, 2, 3]); };
  try { cual(); } finally { api.xlsx = prev; }
  const datos = visto && visto.datos;
  const plano = JSON.stringify(datos || []);
  return plano;
}
const gExcel = grupoBase();
ponerGrupo(gExcel);
quitarPerfil();
const excelHoy = excelCentro(() => sandbox.adResumenFinalExcel(clon(gExcel)));
const excelOtra = excelCentro(() => sandbox.adResumenFinalExcel(clon(gExcel)));
ok(excelHoy.length > 10 && excelHoy === excelOtra && excelHoy.includes(NOMBRE_HOY) && !/Centro Ficticio/i.test(excelHoy),
  'el Excel del resumen, sin perfil, repite el mismo centro de hoy');
ponerPerfil(gExcel);
const excelCon = excelCentro(() => sandbox.adResumenFinalExcel(clon(gExcel)));
ok(/Centro Ficticio/i.test(excelCon), 'el Excel del resumen, con perfil, lleva el nombre del centro');
quitarPerfil();
const cuadroHoy = excelCentro(() => sandbox.adCuadroFinalExcel(clon(gExcel)));
const cuadroOtra = excelCentro(() => sandbox.adCuadroFinalExcel(clon(gExcel)));
ok(cuadroHoy.length > 10 && cuadroHoy === cuadroOtra && new RegExp(NOMBRE_HOY, 'i').test(cuadroHoy) && !/Centro Ficticio/i.test(cuadroHoy),
  'el Excel del cuadro final, sin perfil, repite el mismo centro de hoy');
ponerPerfil(gExcel);
const cuadroCon = excelCentro(() => sandbox.adCuadroFinalExcel(clon(gExcel)));
ok(/Centro Ficticio/i.test(cuadroCon), 'el Excel del cuadro final, con perfil, lleva el nombre del centro');
quitarPerfil();

/* ── El aviso, al entrar a Mi aula ── */
const uiMem = {};
const uiStore = {
  getItem(k) { return Object.prototype.hasOwnProperty.call(uiMem, k) ? uiMem[k] : null; },
  setItem(k, v) { uiMem[k] = String(v); },
  removeItem(k) { delete uiMem[k]; },
};
function nodo(tag) {
  const n = {
    tagName: String(tag || 'div').toUpperCase(), id: '', className: '', attrs: {}, children: [],
    parentNode: null, hidden: false, style: {}, _html: '',
  };
  n.classList = {
    contains(c) { return n.className.split(/\s+/).indexOf(c) >= 0; },
    add(c) { if (!this.contains(c)) n.className = (n.className + ' ' + c).trim(); },
    remove(c) { n.className = n.className.split(/\s+/).filter(x => x !== c).join(' '); },
  };
  n.setAttribute = (k, v) => {
    n.attrs[k] = String(v);
    if (k === 'id') n.id = String(v);
    if (k === 'class') n.className = String(v);
  };
  n.getAttribute = k => (Object.prototype.hasOwnProperty.call(n.attrs, k) ? n.attrs[k] : null);
  n.appendChild = c => { c.parentNode = n; n.children.push(c); return c; };
  n.remove = () => { if (n.parentNode) n.parentNode.children = n.parentNode.children.filter(x => x !== n); };
  n.closest = sel => { let p = n; while (p) { if (casa(p, sel)) return p; p = p.parentNode; } return null; };
  n.contains = c => c === n || n.children.some(ch => ch.contains && ch.contains(c));
  n.addEventListener = () => {};
  n.focus = () => {};
  n.scrollIntoView = () => {};
  Object.defineProperty(n, 'innerHTML', {
    get() { return n._html; },
    set(h) {
      n._html = String(h);
      n.children = [];
      const re = /<button\b([^>]*)>/g;
      let m;
      while ((m = re.exec(n._html))) {
        const b = nodo('button');
        const ar = /([\w:-]+)="([^"]*)"/g;
        let a;
        while ((a = ar.exec(m[1]))) b.setAttribute(a[1], a[2]);
        n.appendChild(b);
      }
    },
  });
  return n;
}
function casa(n, sel) {
  if (sel.charAt(0) === '#') return n.id === sel.slice(1);
  if (sel.charAt(0) === '.') return n.classList.contains(sel.slice(1));
  const m = /^\[([^\]=]+)(?:="([^"]*)")?\]$/.exec(sel);
  if (m) return m[2] == null ? n.getAttribute(m[1]) != null : n.getAttribute(m[1]) === m[2];
  return n.tagName === sel.toUpperCase();
}
function busca(n, sel) {
  const out = [];
  (function rec(x) {
    if (casa(x, sel)) out.push(x);
    x.children.forEach(rec);
  })(n);
  return out;
}

const vista = nodo('div');
vista.id = 'view-mi-aula';
vista.className = 'view active';
const scroll = nodo('div');
scroll.className = 'view-scroll';
scroll.scrollTop = 0;
const raiz = nodo('div');
raiz.id = 'mi-aula';
const tarjeta = nodo('div');
tarjeta.id = 'ma-tarjeta';
scroll.appendChild(raiz);
vista.appendChild(scroll);
const porId = { 'view-mi-aula': vista, 'mi-aula': raiz, 'ma-tarjeta': tarjeta };
const clics = [];
const tablas = {
  aulas: [{ id: 'aula-1', escuela: NOMBRE_HOY, grado: 6, seccion: '1', anio_lectivo: 2026, created_at: '2026-02-01', centro_id: null }],
  centros: [], alumnos: [], familias: [], asignaturas: [], notas: [], colectas: [],
};
function lista(nombre, filtro) {
  let rows = tablas[nombre] || [];
  if (filtro) rows = rows.filter(r => Object.keys(filtro).every(k => r[k] === filtro[k]));
  return rows;
}
const api = {
  lista, cuenta() { return { id: 'docente-ficticio' }; }, pideContrasena() { return false; },
  preguntas() { return []; }, noAnotado() { return []; }, sinSenal() { return false; },
  escuchar() {}, alCambiarSenal() {},
};
const ui = {
  console, Date: Fecha, Promise, setTimeout, clearTimeout, localStorage: uiStore,
  location: { href: 'http://127.0.0.1:8080/index.html' },
  document: {
    readyState: 'complete',
    addEventListener(tipo, fn) { if (tipo === 'click') clics.push(fn); },
    removeEventListener() {},
    getElementById(id) { return porId[id] || null; },
    querySelector(sel) {
      if (sel === '#mi-aula [data-form="centro"]') return raiz._html.indexOf('data-form="centro"') >= 0 ? nodo('form') : null;
      return null;
    },
    querySelectorAll() { return []; },
    createElement() { return nodo('div'); },
  },
  navigator: {},
  MetasDatos: { iniciar() { return { then(fn) { fn(api); return this; }, catch() { return this; } }; } },
  switchView() {}, renderProfile() {},
};
ui.window = ui;
ui.globalThis = ui;
vm.createContext(ui);
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/metas-centro.js'), 'utf8'), ui, { filename: 'js/metas-centro.js' });
uiStore.setItem('METAS_MI_AULA_VISTA_V1', JSON.stringify({ aula: 'aula-1', seccion: 'alumnos' }));
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/tools/mi-aula.js'), 'utf8'), ui, { filename: 'js/tools/mi-aula.js' });

const sin = raiz._html;
ok(sin.includes('Completa tu perfil institucional') && sin.includes('data-metas="aviso-perfil"'),
  'sin perfil, arriba sale el aviso corto');
ok(!sin.includes('data-form="centro"'), 'sin perfil, el formulario no está junto al aula');
ok(sin.indexOf('aviso-perfil') < sin.indexOf('ma-grupos'), 'el aviso queda arriba de los grupos');

const btn = busca(raiz, '[data-metas="aviso-perfil"]')[0];
ok(!!btn, 'el aviso es un botón');
if (btn) clics.forEach(fn => fn({ target: btn, preventDefault() {}, stopPropagation() {} }));
ok(raiz._html.includes('data-form="centro"') && raiz._html.includes('Nombre del maestro(a)'),
  'al tocar el aviso se abre el perfil, con el nombre del maestro');
ok(!raiz._html.includes('ma-secs'), 'el perfil es su pantalla: no lleva las secciones del aula');

const atras = nodo('button');
atras.id = 'mi-aula-back-btn';
clics.forEach(fn => fn({ target: atras, preventDefault() {}, stopPropagation() {} }));

tablas.aulas[0].centro_id = 'centro-1';
tablas.centros.push({
  id: 'centro-1', nombre: NOMBRE_PERFIL, anio_lectivo: 2026, direccion: null, aldea: null,
  municipio: null, departamento: null, codigo_sace: null, director: null, modalidad: null,
  jornada: null, logo: null, logo_sec: null,
});
ui.metasMiAula.abrir();
const con = raiz._html;
ok(!con.includes('data-metas="aviso-perfil"') && !con.includes('Completa tu perfil institucional'),
  'con perfil, el aviso ya no sale');
ok(con.includes('data-metas="perfil-institucional"'), 'con perfil, la entrada para editarlo sigue');
ok(!con.includes('data-form="centro"'), 'con perfil, el formulario no se mezcla con el aula');

const btnNotas = busca(raiz, '[data-valor="notas"]')[0];
if (btnNotas) clics.forEach(fn => fn({ target: btnNotas, preventDefault() {}, stopPropagation() {} }));
const notasHtml = raiz._html;
ok(notasHtml.includes('data-metas="perfil-desde-notas"') && !notasHtml.includes('data-form="centro"'),
  'Notas SACE tiene el acceso al perfil y no el formulario');
ok(!/Encabezado y logos/.test(notasHtml), 'Notas SACE no pinta el encabezado');

api.editar = function (tabla, id, cambios) {
  const fila = (tablas[tabla] || []).filter(r => r.id === id)[0];
  if (fila) Object.keys(cambios).forEach(k => { fila[k] = cambios[k]; });
  return { id: id };
};
api.crear = function (tabla, fila) {
  const id = fila.id || ('nuevo-' + ((tablas[tabla] || []).length + 1));
  const row = Object.assign({ id: id, deleted_at: null }, fila);
  (tablas[tabla] = tablas[tabla] || []).push(row);
  return { id: id };
};
tablas.aulas[0].centro_id = null;
tablas.centros.length = 0;
tablas.centros.push(
  { id: 'centro-1', nombre: 'CEB John Arnold Cook', anio_lectivo: 2026, logo: null, logo_sec: null, direccion: null, aldea: null, municipio: null, departamento: null, codigo_sace: null, director: null, docente: 'Maestra del Cook', modalidad: null, jornada: null },
  { id: 'centro-2', nombre: 'Instituto María Consuelo', anio_lectivo: 2026, logo: null, logo_sec: null, direccion: null, aldea: null, municipio: null, departamento: null, codigo_sace: null, director: null, docente: null, modalidad: null, jornada: null },
);
tablas.aulas.push({ id: 'aula-2', escuela: 'Instituto María Consuelo', grado: 8, seccion: '1', anio_lectivo: 2026, created_at: '2026-02-02', centro_id: 'centro-2' });
uiStore.setItem('METAS_MI_AULA_VISTA_V1', JSON.stringify({ aula: 'aula-1', seccion: 'notas' }));
ui.metasMiAula.abrir();
ok(tablas.aulas[0].centro_id === 'centro-1' && tablas.aulas[1].centro_id === 'centro-2',
  'el grupo sin centro queda en el primero y el otro no se mueve');
const listaPerfiles = raiz._html;
ok(listaPerfiles.includes('CEB John Arnold Cook') && listaPerfiles.includes('Instituto María Consuelo')
  && listaPerfiles.includes('+ Otro centro'),
  'los dos centros se ven y se puede agregar otro');
ok(listaPerfiles.includes('data-valor="aula-1"') && !listaPerfiles.includes('data-valor="aula-2"'),
  'al empezar se ven solo los grupos del centro activo');
const btnCentro = busca(raiz, '[data-valor="centro-2"]')[0];
if (btnCentro) clics.forEach(fn => fn({ target: btnCentro, preventDefault() {}, stopPropagation() {} }));
ok(tablas.aulas[0].centro_id === 'centro-1' && tablas.aulas[1].centro_id === 'centro-2',
  'cambiar de centro no mueve los grupos');
ok(raiz._html.includes('data-valor="aula-2"') && !raiz._html.includes('data-valor="aula-1"'),
  'en el otro centro se ve solo su grupo');
ok(!raiz._html.includes('data-form="centro"'), 'cambiar de centro no abre el formulario');

const btnNuevo = busca(raiz, '[data-accion="agregar-perfil"]')[0];
if (btnNuevo) clics.forEach(fn => fn({ target: btnNuevo, preventDefault() {}, stopPropagation() {} }));
ok(raiz._html.includes('data-form="centro"') && raiz._html.includes('data-centro-id=""')
  && raiz._html.includes('Nombre del maestro(a)'),
  'otro centro abre el perfil en blanco');
ok(tablas.aulas[0].centro_id === 'centro-1' && tablas.aulas[1].centro_id === 'centro-2',
  'abrir otro centro no cambia el centro de los grupos');

/* El perfil se guarda una vez, no letra por letra (18 nov 2026: un centro
   nacía con la primera letra y el nombre completo chocaba con otro igual). */
const camposVacios = { direccion: '', aldea: '', municipio: '', departamento: '', codigo_sace: '', director: '', modalidad: '', jornada: '' };
const tiraSi = f => { try { f(); return null; } catch (e) { return e; } };
const antesCentros = tablas.centros.length;
const sinConfirmar = tiraSi(() => ui.MetasCentro.guardar(api, null,
  Object.assign({ nombre: 'Instituto Nuevo', anio_lectivo: '2026' }, camposVacios), null));
ok(sinConfirmar && sinConfirmar.espera && tablas.centros.length === antesCentros,
  'un centro nuevo no se crea sin tocar «Guardar perfil»');
const corto = tiraSi(() => ui.MetasCentro.guardar(api, null,
  Object.assign({ nombre: 'J', anio_lectivo: '2026' }, camposVacios), null, { confirmado: true }));
ok(corto && corto.paraElDocente && /3 letras/.test(corto.message) && tablas.centros.length === antesCentros,
  'no se crea ningún centro con menos de 3 letras');
const repetido = tiraSi(() => ui.MetasCentro.guardar(api, null,
  Object.assign({ nombre: '  instituto MARIA consuelo ', anio_lectivo: '2026' }, camposVacios), null, { confirmado: true }));
ok(repetido && repetido.yaExiste && repetido.yaExiste.id === 'centro-2'
  && repetido.message === 'Ya tienes Instituto María Consuelo. ¿Abrirlo?' && tablas.centros.length === antesCentros,
  'un nombre que ya existe, sin importar acentos, avisa «Ya tienes…» y no crea otro');
const ediciones = [];
const editarDeVerdad = api.editar;
api.editar = function (tabla, id, cambios) { ediciones.push([tabla, id, Object.assign({}, cambios)]); return editarDeVerdad(tabla, id, cambios); };
const c1 = tablas.centros[0];
const igualQueHoy = { nombre: c1.nombre, anio_lectivo: '2026', docente: c1.docente };
Object.keys(camposVacios).forEach(k => { igualQueHoy[k] = ''; });
ui.MetasCentro.guardar(api, tablas.aulas[0], Object.assign({}, igualQueHoy, { logo: '', logo_sec: '' }), 'centro-1');
ok(ediciones.filter(e => e[0] === 'centros').length === 0, 'guardar el perfil sin cambios no manda nada a la base');
ediciones.length = 0;
ui.MetasCentro.guardar(api, tablas.aulas[0], Object.assign({}, igualQueHoy, { logo: '', logo_sec: '', direccion: 'Barrio El Centro' }), 'centro-1');
const deCentro = ediciones.filter(e => e[0] === 'centros');
ok(deCentro.length === 1 && JSON.stringify(Object.keys(deCentro[0][2])) === '["direccion"]',
  'al centro se le manda solo el campo que cambió, sin el nombre', ediciones);
ok(!ediciones.some(e => e[0] === 'aulas' && 'escuela' in e[2]), 'sin cambiar el nombre, los grupos no se renombran', ediciones);
ediciones.length = 0;
ui.MetasCentro.guardar(api, tablas.aulas[0], Object.assign({}, igualQueHoy, { logo: '', logo_sec: '', nombre: 'Instituto Maria Consuelo' }), 'centro-1');
ok(!ediciones.some(e => e[0] === 'centros' && 'nombre' in e[2]) && tablas.centros[0].nombre === 'CEB John Arnold Cook',
  'renombrar al nombre de otro centro no manda el nombre', ediciones);
ok(!ediciones.some(e => e[0] === 'aulas' && 'escuela' in e[2]), 'ni le pone a los grupos el nombre del otro centro', ediciones);
api.editar = editarDeVerdad;
/* Guardar centro-1 le puso su maestra a su grupo, como debe; se quita para
   que la prueba de abajo mire solo lo que hace el centro nuevo. */
tablas.aulas.forEach(a => { delete a.docente_nombre; });

const guardado = ui.MetasCentro.guardar(api, tablas.aulas[0], Object.assign({
  nombre: 'Instituto Nuevo', anio_lectivo: '2026', docente: 'Maestra Nueva',
}, camposVacios), null, { confirmado: true });
ok(guardado && guardado !== 'centro-1' && guardado !== 'centro-2', 'un centro nuevo tiene su propia fila');
ok(tablas.aulas[0].centro_id === 'centro-1' && tablas.aulas[1].centro_id === 'centro-2',
  'guardar un centro nuevo no se lleva los grupos que ya estaban');
ok(!tablas.aulas[0].docente_nombre && !tablas.aulas[1].docente_nombre,
  'el nombre del maestro no se copia a los grupos de otro centro');

const indexHtml = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
const cssVolver = fs.readFileSync(path.join(RAIZ, 'css/app.css'), 'utf8');
ok(indexHtml.includes('id="mi-aula-back-btn"') && indexHtml.includes('class="back-txt">Volver')
  && indexHtml.includes('id="view-mi-aula"') && indexHtml.includes('con-volver'),
  'Mi aula muestra Volver en la barra de arriba');
ok(indexHtml.includes('id="admin-back-btn"') && /id="view-admin"[\s\S]*con-volver/.test(indexHtml),
  'Más del aula también muestra Volver en la barra');
ok(/\.app-header\.con-volver[\s\S]*transform:\s*none !important/.test(cssVolver)
  && /\.back-icon-btn[\s\S]*min-height:\s*44px/.test(cssVolver),
  'esa barra no se esconde al bajar y el botón mide 44 px');

console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ El aviso y los impresos respetan el perfil');
process.exit(fallos ? 1 : 0);
