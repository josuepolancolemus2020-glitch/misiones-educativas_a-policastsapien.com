/* ============================================================
   M.E.T.A.S · Cargar una misión y sacarle sus formas de examen
   ------------------------------------------------------------
   La usan dos: `genera-formas-oro.js`, que escribe la referencia, y
   `verifica-formas-oro.js`, que la compara. Tienen que generar las
   formas EXACTAMENTE igual, y por eso lo hacen con este mismo código:
   si cada una cargara la misión a su manera, una diferencia entre las
   dos saldría como «cambió la Forma 7» sin que nadie la hubiera tocado.

   No se copia la lógica del examen: se carga el JavaScript de verdad de
   la misión en un `vm` con una página de mentira y se llama a su
   `genEval`, `genEvalOp` y `genEvalCrit`, y a su `printEval…`. Así lo
   que se congela es lo que el maestro recibe, y el día que el motor
   compartido sustituya a ese código, la referencia lo juzga a él.

   No es una sonda: no comprueba nada.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const RAIZ = path.resolve(__dirname, '..');
const DIR_MISIONES = path.join(RAIZ, 'misiones');
const DIR_ORO = path.join(__dirname, 'formas-oro');

/* Fuera del alcance por decisión de Josué (plan del motor, sección 10,
   punto 4): las de docentes y Prebásica no tienen examen por formas, y
   Fracciones heterogéneas usa otro generador y elige la primera forma al
   azar. Se nombran con su motivo para que una misión nueva no se quede
   fuera sin que nadie lo decida. */
const FUERA_DE_ALCANCE = {
  'mate-fracciones-heterogeneas': 'usa su propio generador; queda sin 50 formas (decisión 4)'
};
const fueraPorFamilia = slug => /^docente-/.test(slug) ? 'misión de docentes, sin examen por formas (decisión 4)'
  : /^prebasica-/.test(slug) ? 'Prebásica, sin examen por formas (decisión 4)' : '';

/* Las tres pruebas. `oro` dice si sus formas de hoy se congelan: la de
   pensamiento crítico se rehace entera (decisión 1) y no lleva referencia. */
const PRUEBAS = {
  conceptual: { gen: 'genEval', imprime: 'printEval', dato: '_evalPrintData', selector: 'evalFormaSel', oro: true },
  operativa:  { gen: 'genEvalOp', imprime: 'printEvalOp', dato: '_evalOpData', selector: 'evalOpFormaSel', oro: true },
  critica:    { gen: 'genEvalCrit', imprime: 'printEvalCrit', dato: '_evalCritData', selector: 'evalCritFormaSel', oro: false }
};

const sha = s => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

/* ── qué misiones hay ────────────────────────────────────────── */
/* El archivo donde están los bancos de la misión. En una misión de las de
   antes es su archivo único, el que trae `genEval`. En una que ya usa el
   motor (`js/motor-mision.js`) `genEval` vive en el motor y los bancos en
   su `js/contenido.js`. */
function archivoPrincipal(slug) {
  const dir = path.join(DIR_MISIONES, slug, 'js');
  if (!fs.existsSync(dir)) return null;
  const con = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !/html2canvas/.test(f))
    .filter(f => /function genEval\(/.test(fs.readFileSync(path.join(dir, f), 'utf8')));
  if (con.length > 1) throw new Error(slug + ': hay ' + con.length + ' archivos con genEval (' + con.join(', ') + ')');
  if (con.length) return path.join(dir, con[0]);
  const contenido = path.join(dir, 'contenido.js');
  return fs.existsSync(contenido) && usaElMotor(slug) ? contenido : null;
}

/* La página de una misión que ya usa el motor, o '' si no lo usa. */
function usaElMotor(slug) {
  const dir = path.join(DIR_MISIONES, slug);
  return fs.readdirSync(dir).filter(f => f.endsWith('.html'))
    .map(f => fs.readFileSync(path.join(dir, f), 'utf8'))
    .find(h => /<script[^>]*\ssrc="[^"]*js\/motor-mision\.js/.test(h)) || '';
}

function listarMisiones() {
  const dentro = [], fuera = [];
  fs.readdirSync(DIR_MISIONES).sort().forEach(slug => {
    if (!fs.statSync(path.join(DIR_MISIONES, slug)).isDirectory()) return;
    const motivo = FUERA_DE_ALCANCE[slug] || fueraPorFamilia(slug);
    if (motivo) { fuera.push({ slug, motivo }); return; }
    const js = archivoPrincipal(slug);
    if (!js) { fuera.push({ slug, motivo: 'no tiene examen por formas' }); return; }
    dentro.push(slug);
  });
  return { dentro, fuera };
}

/* El código de una misión, entero, para las sondas que lo leen como
   texto (buscan una función y el banco que usa). En una misión de antes
   es su archivo. En una que usa el motor, la función está en el motor y
   el banco en su contenido: se devuelven juntos, en el orden de la
   página, para que esas sondas la sigan midiendo y no la salten calladas. */
function fuenteDeMision(archivo) {
  const propio = fs.readFileSync(archivo, 'utf8');
  const dirJs = path.dirname(archivo), dirMision = path.dirname(dirJs);
  if (path.basename(dirJs) !== 'js' || path.basename(archivo) !== 'contenido.js') return propio;
  const html = usaElMotor(path.basename(dirMision));
  if (!html) return propio;
  const partes = [];
  const re = /<script[^>]*\ssrc=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html))) {
    const abs = path.resolve(dirMision, m[1].split('?')[0]);
    const suyo = path.dirname(abs) === dirJs && !/html2canvas|animacion-/.test(path.basename(abs));
    if (/[\\/]js[\\/]motor-mision\.js$/.test(abs) || suyo) partes.push(fs.readFileSync(abs, 'utf8'));
  }
  return partes.join('\n');
}

/* ── la página de mentira ────────────────────────────────────── */
/* Un elemento que aguanta que le pidan cualquier cosa. `getElementById`
   devuelve SIEMPRE el mismo objeto para el mismo id: el examen lee el
   número de forma del desplegable (`evalFormaSel`), y por ahí se le dice
   qué forma generar sin tocar sus variables. */
function hazElemento() {
  const nada = () => {};
  const el = {
    style: { setProperty: nada, removeProperty: nada }, dataset: {}, value: '', innerHTML: '', textContent: '',
    children: [], childNodes: [], options: [], files: [], checked: false, disabled: false,
    classList: { add: nada, remove: nada, toggle: nada, contains: () => false },
    appendChild: x => x, removeChild: x => x, insertBefore: x => x, prepend: nada, append: nada, remove: nada,
    replaceWith: nada, after: nada, before: nada,
    addEventListener: nada, removeEventListener: nada, dispatchEvent: nada,
    setAttribute: nada, getAttribute: () => null, removeAttribute: nada, hasAttribute: () => false,
    querySelector: () => null, querySelectorAll: () => [], getElementsByTagName: () => [], getElementsByClassName: () => [],
    closest: () => null, contains: () => false, matches: () => false, cloneNode: () => hazElemento(),
    focus: nada, blur: nada, click: nada, scrollIntoView: nada, animate: () => ({ onfinish: null, cancel: nada }),
    getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
    getContext: () => new Proxy({}, { get: () => nada }),
    insertAdjacentHTML: nada, insertAdjacentElement: nada,
    offsetWidth: 0, offsetHeight: 0, clientWidth: 0, clientHeight: 0, scrollHeight: 0, scrollTop: 0,
    parentNode: null, parentElement: null, firstChild: null, lastChild: null, nextSibling: null
  };
  return el;
}

/* ── cargar una misión ───────────────────────────────────────── */
/* `semillaAzar` cambia lo que devuelve `Math.random` dentro de la misión.
   Las formas no deben depender de él: quien genera carga dos veces con
   semillas distintas y exige que salga lo mismo. */
function cargarMision(slug, semillaAzar) {
  const js = archivoPrincipal(slug);
  if (!js) throw new Error(slug + ': no tiene examen por formas');
  const nada = () => {};
  const porId = {};
  const documentos = [];
  const documento = {
    readyState: 'complete', title: '', cookie: '', hidden: false, visibilityState: 'visible',
    addEventListener: nada, removeEventListener: nada, dispatchEvent: nada,
    getElementById: id => porId[id] || (porId[id] = hazElemento()),
    querySelector: () => null, querySelectorAll: () => [],
    getElementsByTagName: () => [], getElementsByClassName: () => [], getElementsByName: () => [],
    createElement: hazElemento, createElementNS: hazElemento, createTextNode: () => hazElemento(),
    createDocumentFragment: hazElemento, body: hazElemento(), head: hazElemento(), documentElement: hazElemento(),
    fonts: { ready: Promise.resolve() }
  };
  let s = (semillaAzar || 1) >>> 0;
  const mate = Object.create(Math);
  mate.random = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
  /* La fecha se deja quieta: si un examen impreso la llevara, cambiaría
     cada día y la referencia no serviría de nada. */
  const FechaReal = Date;
  class Fecha extends FechaReal {
    constructor(...a) { if (a.length) super(...a); else super(2026, 0, 15, 12, 0, 0); }
    static now() { return new FechaReal(2026, 0, 15, 12, 0, 0).getTime(); }
  }
  const almacen = { getItem: () => null, setItem: nada, removeItem: nada, clear: nada, key: () => null, length: 0 };
  const ventana = {
    document: documento, localStorage: almacen, sessionStorage: almacen,
    navigator: { userAgent: 'sonda', language: 'es', onLine: true, serviceWorker: undefined, vibrate: nada },
    location: { href: 'http://localhost/', search: '', hash: '', pathname: '/', origin: 'http://localhost', protocol: 'http:', host: 'localhost', reload: nada },
    history: { pushState: nada, replaceState: nada, back: nada },
    screen: { width: 1280, height: 800 }, innerWidth: 1280, innerHeight: 800, devicePixelRatio: 1,
    addEventListener: nada, removeEventListener: nada, dispatchEvent: nada,
    matchMedia: () => ({ matches: false, addEventListener: nada, removeEventListener: nada, addListener: nada, removeListener: nada }),
    open: () => ({ document: { write: d => documentos.push(String(d)), close: nada, open: nada }, print: nada, focus: nada, close: nada }),
    setTimeout: () => 0, clearTimeout: nada, setInterval: () => 0, clearInterval: nada,
    requestAnimationFrame: () => 0, cancelAnimationFrame: nada,
    alert: nada, confirm: () => true, prompt: () => null, scrollTo: nada, scroll: nada, print: nada,
    getComputedStyle: () => ({ getPropertyValue: () => '' }),
    speechSynthesis: { speak: nada, cancel: nada, getVoices: () => [], addEventListener: nada },
    SpeechSynthesisUtterance: function () {}, Audio: function () { return { play: () => Promise.resolve(), pause: nada }; },
    Image: function () { return hazElemento(); },
    fetch: () => Promise.reject(new Error('sin red en la sonda')),
    console: { log: nada, warn: nada, error: nada, info: nada, debug: nada },
    Math: mate, Date: Fecha, JSON, parseFloat, parseInt, isNaN, isFinite, encodeURIComponent, decodeURIComponent
  };
  ventana.window = ventana; ventana.self = ventana; ventana.globalThis = ventana; ventana.top = ventana; ventana.parent = ventana;
  const ctx = vm.createContext(ventana);
  const correr = (codigo, nombre) => vm.runInContext(codigo, ctx, { filename: nombre });

  /* Lo que la misión pide de fuera para armar su examen (los datos de
     `js/data/`, `js/metas-fracciones.js` y el motor compartido, que trae
     el generador de las formas) se carga antes, en el orden de su HTML.
     Lo demás de la página (animación, barra, teclado) no toca el examen. */
  const dirMision = path.join(DIR_MISIONES, slug);
  const conMotor = usaElMotor(slug);
  const html = conMotor || fs.readdirSync(dirMision).filter(f => f.endsWith('.html'))
    .map(f => fs.readFileSync(path.join(dirMision, f), 'utf8'))
    .find(h => h.includes('js/' + path.basename(js)));
  if (!html) throw new Error(slug + ': ninguna página carga ' + path.basename(js));
  const previos = [];
  const re = /<script[^>]*\ssrc=["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(html))) {
    const src = m[1].split('?')[0];
    if (/^https?:|^\/\//.test(src)) continue;
    const abs = path.resolve(dirMision, src);
    if (!conMotor && abs === js) break;
    const compartido = /[\\/]js[\\/]data[\\/]/.test(abs) || /[\\/]js[\\/](metas-fracciones|motor-misiones|motor-mision)\.js$/.test(abs);
    /* Con el motor, lo de la misión son varios archivos (su contenido y
       su código propio) y van todos, en el orden de la página. Se dejan
       fuera las animaciones, que no tocan el examen y piden un lienzo. */
    const suyo = conMotor && path.dirname(abs) === path.join(dirMision, 'js') && !/html2canvas|animacion-/.test(path.basename(abs));
    if (compartido || suyo) previos.push(abs);
  }
  previos.forEach(p => correr(fs.readFileSync(p, 'utf8'), p));
  if (!conMotor) correr(fs.readFileSync(js, 'utf8'), js);

  const tiene = nombre => correr('typeof ' + nombre, 'tiene') === 'function';
  const pruebas = Object.keys(PRUEBAS).filter(p => tiene(PRUEBAS[p].gen));
  const tope = correr('EVAL_FORMAS', 'tope');
  /* Fin de grado tiene dos exámenes conceptuales, uno por materia. */
  const materias = correr("typeof MATERIA_EVAL === 'object' && MATERIA_EVAL ? Object.keys(MATERIA_EVAL) : null", 'materias');

  /* Genera una forma y devuelve el dato tal como lo deja la misión y el
     documento que manda a imprimir. */
  function forma(prueba, n, materia) {
    const P = PRUEBAS[prueba];
    if (materia) correr('evalMateria = ' + JSON.stringify(materia), 'materia');
    Object.keys(PRUEBAS).forEach(k => { documento.getElementById(PRUEBAS[k].selector).value = String(n); });
    correr('window.' + P.dato + ' = null; ' + P.gen + '();', 'generar');
    const dato = correr('JSON.stringify(window.' + P.dato + ')', 'dato');
    if (!dato || dato === 'null') throw new Error(slug + ' · ' + prueba + ' · forma ' + n + ': no dejó datos');
    documentos.length = 0;
    correr(P.imprime + '();', 'imprimir');
    if (documentos.length !== 1) throw new Error(slug + ' · ' + prueba + ' · forma ' + n + ': escribió ' + documentos.length + ' documentos al imprimir');
    return { dato: JSON.parse(dato), impreso: documentos[0] };
  }

  return { slug, js, pruebas, tope, materias, forma, correr };
}

/* ── lo que se guarda de cada forma ──────────────────────────── */
/* El texto que se lee en la hoja: sin estilos, sin guiones y sin
   etiquetas. Es lo que el maestro ya tiene impreso con su clave. Se
   compara aparte de la hoja completa para poder decir si cambió lo que
   se lee o solo cómo se ve. */
function textoImpreso(html) {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<(br|\/p|\/div|\/tr|\/li|\/h[1-6]|\/table)[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .split('\n').map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
}

/* Las pruebas que una misión tiene, con Fin de grado partido por materia.
   La llave es el nombre con que se guarda y se nombra al fallar. */
function pruebasDe(mision) {
  const lista = [];
  mision.pruebas.forEach(p => {
    if (p === 'conceptual' && mision.materias) mision.materias.forEach(mat => lista.push({ llave: 'conceptual-' + mat, prueba: p, materia: mat }));
    else lista.push({ llave: p, prueba: p, materia: null });
  });
  return lista;
}

/* Todas las cadenas de texto de un dato, sin importar su forma. */
function cadenasDe(x, salida) {
  salida = salida || [];
  if (typeof x === 'string') salida.push(x);
  else if (Array.isArray(x)) x.forEach(v => cadenasDe(v, salida));
  else if (x && typeof x === 'object') Object.keys(x).forEach(k => cadenasDe(x[k], salida));
  return salida;
}

/* ── los bancos de una misión ────────────────────────────────── */
/* Los bancos son los arreglos de nivel superior cuyo nombre lleva «Bank»
   (`evalTFBank`, `critCaseBank`, `opVidaBank`…). Se buscan por nombre en
   el archivo porque un `const` no cuelga de `window`. */
function bancosDe(mision) {
  const codigo = fs.readFileSync(mision.js, 'utf8');
  const nombres = new Set();
  const re = /(?:^|[;\s{])(?:const|let|var)\s+([A-Za-z_$][\w$]*Bank[\w$]*)\s*=/g;
  let m;
  while ((m = re.exec(codigo))) nombres.add(m[1]);
  const bancos = {};
  nombres.forEach(n => {
    const j = mision.correr('typeof ' + n + " === 'undefined' ? 'null' : JSON.stringify(" + n + ')', 'banco');
    const v = j ? JSON.parse(j) : null;
    if (Array.isArray(v)) bancos[n] = v;
  });
  return bancos;
}

/* De qué banco sale cada parte del examen conceptual. En Fin de grado
   hay un juego por materia y la selección múltiple es un solo banco que
   se filtra por `materia`. */
function bancosConceptual(mision, bancos, materia) {
  if (!materia) return { cp: bancos.evalCPBank, tf: bancos.evalTFBank, mc: bancos.evalMCBank, pr: bancos.evalPRBank };
  const M = JSON.parse(mision.correr('JSON.stringify(MATERIA_EVAL[' + JSON.stringify(materia) + '])', 'materia'));
  return { cp: M.cp, tf: M.tf, pr: M.pr, mc: (bancos.evalMCBank || []).filter(x => x.materia === materia) };
}

/* Dos formas «con las mismas preguntas» aunque cambie el orden: se
   ordena todo arreglo antes de comparar. */
function sinOrden(x) {
  if (Array.isArray(x)) return x.map(sinOrden).map(v => JSON.stringify(v)).sort();
  if (x && typeof x === 'object') { const o = {}; Object.keys(x).sort().forEach(k => { o[k] = sinOrden(x[k]); }); return o; }
  return x;
}

/* Cuántas formas distintas hay y cuáles se repiten.
   `iguales`: la forma entera, con su orden. `mismoConjunto`: las mismas
   preguntas en otro orden. Devuelve parejas [forma, la primera igual]. */
function repetidas(datos) {
  const enteras = {}, conjuntos = {}, iguales = [], mismoConjunto = [];
  Object.keys(datos).map(Number).sort((a, b) => a - b).forEach(n => {
    const e = JSON.stringify(datos[n]), c = JSON.stringify(sinOrden(datos[n]));
    if (e in enteras) iguales.push([n, enteras[e]]); else enteras[e] = n;
    if (c in conjuntos) { if (!(iguales.length && iguales[iguales.length - 1][0] === n)) mismoConjunto.push([n, conjuntos[c]]); }
    else conjuntos[c] = n;
  });
  return { iguales, mismoConjunto, distintas: Object.keys(conjuntos).length };
}

/* Los textos de la prueba crítica que no están escritos en ningún banco
   de la misión. Sus bancos tienen una forma distinta en cada misión, así
   que se compara por texto y no por pregunta. `datos` es {forma: dato}. */
function textosFueraDeBanco(bancos, datos) {
  const enBanco = new Set(cadenasDe(bancos));
  const fuera = new Set();
  Object.keys(datos).forEach(n => cadenasDe(datos[n]).forEach(t => { if (!enBanco.has(t)) fuera.add(t); }));
  return Array.from(fuera).sort();
}

/* ── leer y escribir la referencia ───────────────────────────── */
const rutaOro = slug => path.join(DIR_ORO, slug + '.json');
const RUTA_PENDIENTE = path.join(DIR_ORO, '_critica-pendiente.json');

/* Una forma por renglón: así un cambio en la Forma 7 se ve en `git diff`
   como un renglón, no como el archivo entero. */
function escribirOro(oro) {
  const lineas = ['{'];
  ['slug', 'archivo', 'tope', 'congelado', 'desde'].forEach(k => lineas.push('  ' + JSON.stringify(k) + ': ' + JSON.stringify(oro[k]) + ','));
  lineas.push('  "bancos": {');
  const nb = Object.keys(oro.bancos).sort();
  nb.forEach((n, i) => lineas.push('    ' + JSON.stringify(n) + ': ' + JSON.stringify(oro.bancos[n]) + (i < nb.length - 1 ? ',' : '')));
  lineas.push('  },', '  "pruebas": {');
  const np = Object.keys(oro.pruebas);
  np.forEach((p, i) => {
    lineas.push('    ' + JSON.stringify(p) + ': {');
    const nf = Object.keys(oro.pruebas[p]).map(Number).sort((a, b) => a - b);
    nf.forEach((n, j) => lineas.push('      "' + n + '": ' + JSON.stringify(oro.pruebas[p][n]) + (j < nf.length - 1 ? ',' : '')));
    lineas.push('    }' + (i < np.length - 1 ? ',' : ''));
  });
  lineas.push('  }', '}', '');
  fs.mkdirSync(DIR_ORO, { recursive: true });
  fs.writeFileSync(rutaOro(oro.slug), lineas.join('\n'), 'utf8');
}
const leerOro = slug => fs.existsSync(rutaOro(slug)) ? JSON.parse(fs.readFileSync(rutaOro(slug), 'utf8')) : null;

/* Lo que se guarda de una forma: el dato entero, y la huella del texto
   de la hoja y de la hoja completa. La hoja completa pesa siete veces
   más que el dato y casi todo es estilo repetido; con la huella basta
   para saber si cambió, y el dato dice qué. */
function sellarForma(f) {
  return { dato: f.dato, texto: sha(textoImpreso(f.impreso)), hoja: sha(f.impreso) };
}

const huellaBanco = b => ({ n: b.length, huella: sha(JSON.stringify(b)).slice(0, 16) });

module.exports = { RAIZ, DIR_MISIONES, DIR_ORO, RUTA_PENDIENTE, PRUEBAS, FUERA_DE_ALCANCE, listarMisiones, usaElMotor, fuenteDeMision, cargarMision, pruebasDe,
  textoImpreso, cadenasDe, sha, bancosDe, textosFueraDeBanco, bancosConceptual, sinOrden, repetidas, rutaOro, escribirOro, leerOro, sellarForma, huellaBanco };
