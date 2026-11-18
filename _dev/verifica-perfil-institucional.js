/* =====================================================================
   M.E.T.A.S · Perfil institucional al entrar y en los impresos
   ---------------------------------------------------------------------
   Con datos ficticios:
   · en Mi aula, el aviso sale si el grupo no tiene perfil y no sale
     si ya lo tiene; al tocarlo se abre Encabezado y logos;
   · cada documento conectado, sin perfil, da el mismo HTML que da
     otra vez (es el de hoy: el perfil no entra en la hoja).

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
ok(sin.includes('Configura tu perfil institucional') && sin.includes('data-metas="aviso-perfil"'),
  'sin perfil, arriba sale el aviso');
ok(sin.includes('data-metas="perfil-institucional"') && sin.includes('Perfil institucional'),
  'la entrada Perfil institucional queda a la vista');
ok(sin.indexOf('aviso-perfil') < sin.indexOf('ma-grupos'), 'el aviso queda arriba de los grupos');

const btn = busca(raiz, '[data-metas="aviso-perfil"]')[0];
ok(!!btn, 'el aviso es un botón');
if (btn) clics.forEach(fn => fn({ target: btn, preventDefault() {}, stopPropagation() {} }));
ok(raiz._html.includes('data-form="centro"') && raiz._html.includes('Encabezado y logos'),
  'al tocar el aviso se abre Encabezado y logos');

tablas.aulas[0].centro_id = 'centro-1';
tablas.centros.push({
  id: 'centro-1', nombre: NOMBRE_PERFIL, anio_lectivo: 2026, direccion: null, aldea: null,
  municipio: null, departamento: null, codigo_sace: null, director: null, modalidad: null,
  jornada: null, logo: null, logo_sec: null,
});
ui.metasMiAula.abrir();
const con = raiz._html;
ok(!con.includes('data-metas="aviso-perfil"') && !con.includes('Configura tu perfil institucional'),
  'con perfil, el aviso ya no sale');
ok(con.includes('data-metas="perfil-institucional"'), 'con perfil, la entrada para editarlo sigue');

console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ El aviso y los impresos respetan el perfil');
process.exit(fallos ? 1 : 0);
