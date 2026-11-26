#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · El motor arranca cada widget por su cuenta
   ------------------------------------------------------------
   La plantilla del motor (js/motor-mision.js) arrancaba en cadena y
   pedía por su nombre trece datos del contenido, con los nombres de la
   misión de la que salió el código: TEXTOS, SAVE_KEY, ACHIEVEMENTS,
   fcData, qzData, classGroups, idData, cmpData, routeSets,
   neuronPartes, neuroPairs, enfermedadData y retoPairs. A la misión
   que no declaraba uno se le paraba la página ahí, y lo que venía
   después (su laboratorio, su panel de logros) no llegaba a iniciar.
   Una misión de Español tenía que declarar `neuronPartes` y
   `enfermedadData` para no reventar.

   Ahora cada paso arranca aparte y el que no tiene datos se salta.
   Esto lo prueba con La Célula, que es la misión que ya vive sobre la
   plantilla, sin tocar sus archivos: se carga su página en una página
   de mentira, con su contenido.js de verdad, y se le va quitando una
   declaración cada vez.

   1. CONTROL. Con todo declarado, todo se pinta y nada se esconde.
   2. UNA MENOS. Sin cada uno de los trece datos, uno por uno: la página
      no revienta, el widget de ese dato no se pinta y su tarjeta se
      esconde, y todo lo demás se pinta igual que en el control, con el
      laboratorio y los logros incluidos.
   3. NINGUNA. Sin los trece a la vez, y sin los demás datos que tienen
      reserva (niveles, sopas, tareas): quedan el laboratorio y el examen.
      La sección que se queda sin tarjetas esconde su pestaña, y la
      flecha que llevaba a ella salta a la que sigue.
   4. LOS NOMBRES NUEVOS. Con `ordenaData`, `describeData`,
      `emparejaData` y `situacionData` (y sus ids y campos nuevos) en vez
      de los de antes, la página pinta lo mismo que el control.
   5. ENSAYO: la sonda tiene que poder ponerse roja. Se le da al motor
      un laboratorio que revienta y se exige que lo diga, que no se
      lleve a los logros por delante, y que la misma avería SÍ pare la
      página cuando el arranque va en cadena, como iba antes.

   La página de mentira es un DOM pequeño hecho aquí (el proyecto no
   tiene dependencias): lee el HTML de la misión y sabe lo justo para
   que el motor pinte, esconda una tarjeta y cambie de sección. Lo mismo,
   en un navegador de verdad, lo mira de noche
   `verifica-motor-arranque-navegador.js`.

     node _dev/verifica-motor-arranque.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const CARPETA = '2y3ciclo-la-celula';
const DIR = path.join(RAIZ, 'misiones', CARPETA);
const PAGINA = 'la-celula.html';

/* Los trece que la tanda 0 probó uno por uno, con el paso del arranque
   que se queda sin datos (ninguno, si el dato no es de un widget) y el
   id que dice si su tarjeta se escondió. */
const TRECE = [
  { dato: 'TEXTOS' },
  { dato: 'SAVE_KEY' },
  { dato: 'ACHIEVEMENTS' },
  { dato: 'fcData', paso: 'tarjetas', id: 'fcInner' },
  { dato: 'qzData', paso: 'quiz', id: 'qzQ' },
  { dato: 'classGroups', paso: 'clasifica', id: 'clsBank' },
  { dato: 'idData', paso: 'identifica', id: 'idSent' },
  { dato: 'cmpData', paso: 'completa', id: 'cmpSent' },
  { dato: 'routeSets', paso: 'ordena', id: 'routeList' },
  { dato: 'neuronPartes', paso: 'describe', id: 'neuronOpts' },
  { dato: 'neuroPairs', paso: 'empareja', id: 'neuroOpts' },
  { dato: 'enfermedadData', paso: 'situacion', id: 'enferOpts' },
  { dato: 'retoPairs', paso: 'reto', id: 'retoWord' }
];
/* Los demás datos con reserva: no estaban en la lista porque no
   reventaban al cargar, sino al tocar. */
const CON_RESERVA = ['lvls', 'MXP', 'TOTAL_SECTIONS', 'sopaSets', 'identifyTaskDB', 'classifyTaskDB', 'completeTaskDB', 'explainQuestions'];

/* Los nombres nuevos: dato, campos e ids de la página. */
const NOMBRES_NUEVOS = {
  datos: { routeSets: 'ordenaData', neuronPartes: 'describeData', neuroPairs: 'emparejaData', enfermedadData: 'situacionData' },
  campos: { neuroPairs: { trans: 'term', func: 'resp' }, enfermedadData: { disease: 'term', characteristic: 'resp' }, idData: { art: 'busca' } },
  ids: { neuronProg: 'describeProg', neuronDesc: 'describeDesc', neuronOpts: 'describeOpts', fbNeuron: 'fbDescribe',
    neuroProg: 'emparejaProg', neuroTrans: 'emparejaTerm', neuroOpts: 'emparejaOpts', fbNeuro: 'fbEmpareja',
    enferProg: 'situacionProg', enferDisease: 'situacionTerm', enferOpts: 'situacionOpts', fbEnfer: 'fbSituacion' },
  botones: { 'nextNeuron()': 'nextDescribe()', 'resetNeuron()': 'resetDescribe()', 'resetNeuro()': 'resetEmpareja()', 'resetEnfer()': 'resetSituacion()' }
};

/* ── tocar el contenido sin tocar el archivo ─────────────────── */
/* La sentencia entera de `const NOMBRE = …;`, contando paréntesis y
   saltando cadenas: el primer «;» puede ir dentro de un texto. */
function sentenciaDe(src, nombre) {
  const m = new RegExp('^const ' + nombre + '\\s*=', 'm').exec(src);
  if (!m) return null;
  let i = m.index + m[0].length, prof = 0, cad = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (cad) { if (c === '\\') { i++; continue; } if (c === cad) cad = null; continue; }
    if (c === '"' || c === "'" || c === '`') { cad = c; continue; }
    if ('[{('.includes(c)) prof++;
    else if (']})'.includes(c)) prof--;
    else if (c === ';' && prof === 0) return { desde: m.index, hasta: i + 1 };
  }
  return null;
}
function quita(src, nombres) {
  nombres.forEach(n => {
    const s = sentenciaDe(src, n);
    if (!s) throw new Error('el contenido de La Célula ya no declara ' + n + ': la sonda prueba con él');
    src = src.slice(0, s.desde) + '/* (la sonda quitó ' + n + ') */' + src.slice(s.hasta);
  });
  return src;
}
function conNombresNuevos(src) {
  Object.keys(NOMBRES_NUEVOS.campos).forEach(dato => {
    const s = sentenciaDe(src, dato);
    let trozo = src.slice(s.desde, s.hasta);
    Object.keys(NOMBRES_NUEVOS.campos[dato]).forEach(de => { trozo = trozo.replace(new RegExp('([{,])' + de + ':', 'g'), '$1' + NOMBRES_NUEVOS.campos[dato][de] + ':'); });
    src = src.slice(0, s.desde) + trozo + src.slice(s.hasta);
  });
  Object.keys(NOMBRES_NUEVOS.datos).forEach(de => { src = src.replace(new RegExp('^const ' + de + '\\s*=', 'm'), 'const ' + NOMBRES_NUEVOS.datos[de] + '='); });
  return src;
}
function paginaConNombresNuevos(html) {
  Object.keys(NOMBRES_NUEVOS.ids).forEach(de => { html = html.split('id="' + de + '"').join('id="' + NOMBRES_NUEVOS.ids[de] + '"'); });
  Object.keys(NOMBRES_NUEVOS.botones).forEach(de => { html = html.split('onclick="' + de + '"').join('onclick="' + NOMBRES_NUEVOS.botones[de] + '"'); });
  return html;
}

/* ── la página de mentira ────────────────────────────────────── */
const SIN_CIERRE = new Set(['meta', 'link', 'img', 'input', 'br', 'hr', 'source', 'path', 'circle', 'rect', 'line']);

class Nodo {
  constructor(tag, attrs) {
    this.tagName = (tag || '').toUpperCase(); this.attrs = attrs || {}; this.children = []; this.parentNode = null;
    this._texto = ''; this._html = ''; this.style = {}; this.dataset = {}; this.value = '';
    Object.keys(this.attrs).forEach(k => { if (k.startsWith('data-')) this.dataset[k.slice(5).replace(/-(\w)/g, (_, c) => c.toUpperCase())] = this.attrs[k]; });
    if ('value' in this.attrs) this.value = this.attrs.value;
    const yo = this;
    this.classList = {
      _l: () => (yo.attrs.class || '').split(/\s+/).filter(Boolean),
      contains: c => yo.classList._l().includes(c),
      add: (...cs) => { const l = yo.classList._l(); cs.forEach(c => { if (!l.includes(c)) l.push(c); }); yo.attrs.class = l.join(' '); },
      remove: (...cs) => { yo.attrs.class = yo.classList._l().filter(c => !cs.includes(c)).join(' '); },
      toggle: (c, f) => { const tiene = yo.classList.contains(c); const pon = f === undefined ? !tiene : !!f; if (pon) yo.classList.add(c); else yo.classList.remove(c); return pon; }
    };
  }
  get id() { return this.attrs.id || ''; } set id(v) { this.attrs.id = v; }
  get className() { return this.attrs.class || ''; } set className(v) { this.attrs.class = String(v); }
  get parentElement() { return this.parentNode; }
  get options() { return this.children.filter(c => c.tagName === 'OPTION'); }
  get nextElementSibling() { const h = this.parentNode ? this.parentNode.children : []; return h[h.indexOf(this) + 1] || null; }
  get textContent() { return this._texto + this.children.map(c => c.textContent).join(''); }
  set textContent(v) { this.children.forEach(c => { c.parentNode = null; }); this.children = []; this._html = ''; this._texto = String(v); }
  get innerHTML() { return this._html || this._texto; }
  set innerHTML(v) { this.children.forEach(c => { c.parentNode = null; }); this.children = []; this._texto = ''; this._html = String(v); }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k.startsWith('data-')) this.dataset[k.slice(5)] = String(v); }
  getAttribute(k) { return k in this.attrs ? this.attrs[k] : null; }
  hasAttribute(k) { return k in this.attrs; }
  removeAttribute(k) { delete this.attrs[k]; }
  appendChild(n) { if (n.parentNode) n.remove(); n.parentNode = this; this.children.push(n); return n; }
  remove() { if (!this.parentNode) return; const h = this.parentNode.children; h.splice(h.indexOf(this), 1); this.parentNode = null; }
  addEventListener() {} removeEventListener() {} focus() {} click() { if (typeof this.onclick === 'function') this.onclick({ target: this, stopPropagation() {} }); }
  getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0, right: 0, bottom: 0 }; }
  es(compuesto) {
    return compuesto.every(p => p.t === 'tag' ? this.tagName === p.v.toUpperCase()
      : p.t === 'id' ? this.id === p.v
      : p.t === 'clase' ? this.classList.contains(p.v)
      : p.v === undefined ? this.hasAttribute(p.k) : this.getAttribute(p.k) === p.v);
  }
  matches(sel) { return leeSelector(sel).some(cadena => cadena.length === 1 && this.es(cadena[0])); }
  closest(sel) { let n = this; while (n && n.tagName) { if (n.matches(sel)) return n; n = n.parentNode; } return null; }
  todos(salida) { this.children.forEach(c => { salida.push(c); c.todos(salida); }); return salida; }
  querySelectorAll(sel) {
    const cadenas = leeSelector(sel);
    return this.todos([]).filter(n => cadenas.some(cadena => {
      /* De derecha a izquierda: el último compuesto es el nodo, y cada uno
         de los anteriores, un antepasado suyo, en orden. */
      if (!n.es(cadena[cadena.length - 1])) return false;
      let i = cadena.length - 2, a = n.parentNode;
      while (i >= 0 && a && a.tagName) { if (a.es(cadena[i])) i--; a = a.parentNode; }
      return i < 0;
    }));
  }
  querySelector(sel) { return this.querySelectorAll(sel)[0] || null; }
}
const _selectores = {};
function leeSelector(sel) {
  if (_selectores[sel]) return _selectores[sel];
  return (_selectores[sel] = sel.split(',').map(una => una.trim().split(/\s+/).map(comp => {
    const partes = []; let m;
    const re = /([a-zA-Z][\w-]*)|#([\w-]+)|\.([\w-]+)|\[([\w-]+)(?:=["']?([^"'\]]*)["']?)?\]/g;
    while ((m = re.exec(comp))) {
      if (m[1]) partes.push({ t: 'tag', v: m[1] }); else if (m[2]) partes.push({ t: 'id', v: m[2] });
      else if (m[3]) partes.push({ t: 'clase', v: m[3] }); else partes.push({ t: 'attr', k: m[4], v: m[5] });
    }
    return partes;
  })));
}

/* Lee el HTML de la misión. No es un lector de HTML general: le basta
   con el de una misión, que está bien cerrado. */
function leeHtml(html) {
  const raiz = new Nodo('html', {});
  const pila = [raiz];
  const re = /<!--[\s\S]*?-->|<!DOCTYPE[^>]*>|<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:\s+[\w:-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    const arriba = pila[pila.length - 1];
    if (m[1]) { for (let i = pila.length - 1; i > 0; i--) if (pila[i].tagName === m[1].toUpperCase()) { pila.length = i; break; } }
    else if (m[2]) {
      const attrs = {};
      (m[3] || '').replace(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g, (_, k, a, b, c) => { attrs[k] = a !== undefined ? a : b !== undefined ? b : c !== undefined ? c : ''; });
      const n = arriba.appendChild(new Nodo(m[2], attrs));
      if (!m[4] && !SIN_CIERRE.has(m[2].toLowerCase())) pila.push(n);
    } else if (m[5] && m[5].trim()) { const t = new Nodo('', {}); t._texto = m[5]; arriba.appendChild(t); }
  }
  return raiz;
}

/* Carga la misión con el contenido y la página que se le den, dispara el
   arranque como lo dispara el navegador y devuelve lo que quedó. */
function carga(contenido, html, opciones) {
  opciones = opciones || {};
  const raiz = leeHtml(html);
  const escuchas = { documento: {}, ventana: {} };
  const guardado = {};
  const errores = [];
  const titulo = (/<title>([^<]*)<\/title>/.exec(html) || [])[1] || '';
  const documento = {
    readyState: 'loading', title: titulo,
    documentElement: raiz, body: raiz.querySelector('body') || raiz, head: raiz.querySelector('head') || raiz,
    getElementById: id => raiz.querySelector('#' + id),
    querySelector: s => raiz.querySelector(s), querySelectorAll: s => raiz.querySelectorAll(s),
    createElement: t => new Nodo(t, {}),
    addEventListener: (ev, f) => { (escuchas.documento[ev] = escuchas.documento[ev] || []).push(f); }, removeEventListener() {}
  };
  const ventana = {
    document: documento,
    localStorage: { getItem: k => (k in guardado ? guardado[k] : null), setItem: (k, v) => { guardado[k] = String(v); }, removeItem: k => { delete guardado[k]; } },
    location: { pathname: '/misiones/' + CARPETA + '/' + PAGINA, href: 'http://localhost/misiones/' + CARPETA + '/' + PAGINA, search: '', hash: '' },
    navigator: { userAgent: 'sonda' }, URLSearchParams,
    addEventListener: (ev, f) => { (escuchas.ventana[ev] = escuchas.ventana[ev] || []).push(f); }, removeEventListener() {},
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, clearInterval() {},
    scrollTo() {}, open: () => null,
    console: { log() {}, warn() {}, info() {}, error: (...a) => errores.push(a.join(' ')) },
    Math, Date, JSON, parseInt, parseFloat, isNaN, Set, Map, Array, Object, String, Number, RegExp, Error
  };
  ventana.window = ventana; ventana.self = ventana; ventana.globalThis = ventana;
  const ctx = vm.createContext(ventana);
  const corre = (codigo, nombre) => vm.runInContext(codigo, ctx, { filename: nombre });

  /* Los guiones de la misión, en el orden de su página: el motor, la
     plantilla, el contenido (el que se le da) y lo propio. Los de al
     lado (estrellas, registro, barra) no pintan los widgets y no entran
     aquí: los mira la sonda del navegador. */
  const srcs = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map(x => x[1].split('?')[0]);
  srcs.filter(s => /js\/motor-misiones\.js$|js\/motor-mision\.js$/.test(s) || (/^js\//.test(s) && !/animacion-/.test(s))).forEach(s => {
    const ruta = path.resolve(DIR, s);
    corre(/^js\/contenido\.js$/.test(s) ? contenido : fs.readFileSync(ruta, 'utf8'), ruta);
    if (/js\/motor-mision\.js$/.test(s) && opciones.cadena) corre('_arranca=function(nombre,datos,pintar){if(datos&&!datos())return;if(pintar)pintar();};', 'cadena');
  });
  if (opciones.laboratorioRoto) corre("MotorMisiones.registrarLaboratorio(function(){throw new Error('laboratorio roto a propósito');});", 'ensayo');

  let revento = '';
  try {
    documento.readyState = 'interactive';
    (escuchas.documento.readystatechange || []).forEach(f => f());
    (escuchas.documento.DOMContentLoaded || []).forEach(f => f());
    (escuchas.ventana.DOMContentLoaded || []).forEach(f => f());
    documento.readyState = 'complete';
  } catch (e) { revento = e && e.message ? e.message : String(e); }

  const el = id => documento.getElementById(id);
  const escondido = id => { const n = el(id); const caja = n && (n.closest('.card') || n); return !!caja && caja.style.display === 'none'; };
  const texto = id => { const n = el(id); return n ? (n.textContent || n.innerHTML || '').trim() : null; };
  const hijos = id => { const n = el(id); return n ? n.children.length : -1; };
  return { revento, errores, guardado, corre, el, escondido, texto, hijos, documento,
    /* Un motor que no lleva la cuenta de su arranque (el de antes) no la
       publica: se devuelve vacía y marcada, para que la sonda lo diga con
       sus fallos en vez de caerse ella. */
    arranque: JSON.parse(corre('JSON.stringify(MotorMisiones.arranque||null)', 'arranque')) || { pintados: [], sinDatos: [], fallaron: [], ausente: true } };
}

/* Lo que se ve pintado en la página, widget por widget. Los ids son los
   de la página que se cargó: `ids` dice cómo se llaman en ella. */
function pintado(p, ids) {
  const id = n => (ids && ids[n]) || n;
  return {
    tarjetas: p.texto('fcW'), quiz: p.texto('qzQ'), clasifica: p.hijos('clsBank'), identifica: p.hijos('idSent'),
    completa: p.texto('cmpSent'), ordena: p.hijos('routeList'),
    describe: p.texto(id('neuronDesc')) + ' · ' + p.hijos(id('neuronOpts')),
    empareja: p.texto(id('neuroTrans')) + ' · ' + p.hijos(id('neuroOpts')),
    situacion: p.texto(id('enferDisease')) + ' · ' + p.hijos(id('enferOpts')),
    reto: p.documento.querySelectorAll('.reto-btns .btn').map(b => b.textContent).join(' | '),
    laboratorio: p.texto('lab-display'), logros: p.hijos('achList')
  };
}

module.exports = { CARPETA, PAGINA, TRECE, CON_RESERVA, NOMBRES_NUEVOS, quita, conNombresNuevos, paginaConNombresNuevos };

if (require.main === module) {
  let fallos = 0;
  const ok = (nombre, cond, detalle) => { console.log((cond ? '  ✔ ' : '  ✘ ') + nombre); if (!cond) { fallos++; if (detalle) console.log('      ' + detalle); } };
  const HTML = fs.readFileSync(path.join(DIR, PAGINA), 'utf8');
  const CONTENIDO = fs.readFileSync(path.join(DIR, 'js', 'contenido.js'), 'utf8');
  const PASOS = TRECE.filter(t => t.paso);

  /* ── 1 · control ── */
  console.log('— Control: La Célula con todo declarado —');
  const control = carga(CONTENIDO, HTML);
  const base = pintado(control);
  ok('arranca sin reventar y sin quejarse en la consola', !control.revento && !control.errores.length, control.revento || control.errores[0]);
  ok('el motor lleva la cuenta de su arranque (MotorMisiones.arranque)', !control.arranque.ausente && control.arranque.pintados.length >= 12, JSON.stringify(control.arranque));
  ok('ningún paso se quedó sin datos ni falló', control.arranque.sinDatos.length === 0 && control.arranque.fallaron.length === 0, JSON.stringify(control.arranque));
  ok('pinta sus doce piezas (tarjetas, quiz, clasifica, identifica, completa, ordena, tres widgets, reto, laboratorio y logros)',
    base.tarjetas === 'Célula' && /unidad estructural/.test(base.quiz) && base.clasifica === 10 && base.identifica === 8 && /___/.test(base.completa)
    && base.ordena === 5 && /· 4$/.test(base.describe) && /^Núcleo · 4$/.test(base.empareja) && /^Cloroplasto · 4$/.test(base.situacion)
    && /Animal \| .*Vegetal/.test(base.reto) && /Núcleo/.test(base.laboratorio) && base.logros === 8, JSON.stringify(base));
  ok('no esconde ninguna tarjeta', PASOS.every(t => !control.escondido(t.id)));

  /* ── 2 · una menos ── */
  console.log('— Sin cada uno de los trece datos, uno por uno —');
  TRECE.forEach(t => {
    const p = carga(quita(CONTENIDO, [t.dato]), HTML);
    const ve = pintado(p);
    const fallas = [];
    if (p.revento) fallas.push('la página revienta: ' + p.revento);
    if (p.errores.length) fallas.push('se queja en la consola: ' + p.errores[0]);
    if (p.arranque.fallaron.length) fallas.push('fallaron: ' + p.arranque.fallaron.join(', '));
    if (JSON.stringify(p.arranque.sinDatos) !== JSON.stringify(t.paso ? [t.paso] : [])) fallas.push('sin datos: ' + (p.arranque.sinDatos.join(', ') || 'ninguno') + ' (se esperaba ' + (t.paso || 'ninguno') + ')');
    PASOS.forEach(o => { if (p.escondido(o.id) !== (o.dato === t.dato)) fallas.push('la tarjeta de ' + o.paso + (o.dato === t.dato ? ' sigue a la vista' : ' se escondió')); });
    /* Todo lo demás, igual que en el control. Los logros son el caso
       aparte: sin ACHIEVEMENTS no hay panel, y se esconde su botón. */
    Object.keys(base).forEach(k => {
      if (k === t.paso) return;
      if (k === 'logros' && t.dato === 'ACHIEVEMENTS') { if (ve.logros !== 0 || p.el('achBtn').style.display !== 'none') fallas.push('sin logros, el panel o su botón siguen a la vista'); return; }
      if (JSON.stringify(ve[k]) !== JSON.stringify(base[k])) fallas.push(k + ' ya no se pinta igual: ' + JSON.stringify(ve[k]));
    });
    if (t.dato === 'SAVE_KEY') {
      const llave = 'metas_' + CARPETA.replace(/[^a-z0-9]+/gi, '_') + '_v1';
      try { p.corre("fin('s-aprende', false);", 'guardar'); } catch (e) { /* sin llave, guardar revienta: lo dice el renglón que sigue */ }
      if (p.corre('window.SAVE_KEY', 'llave') !== llave || !(llave in p.guardado)) fallas.push('sin SAVE_KEY el progreso no se guarda en la llave de la carpeta (' + llave + '): ' + Object.keys(p.guardado).join(', '));
    }
    if (t.dato === 'TEXTOS') {
      let tx = { impresion: {}, diploma: [] };
      try { tx = JSON.parse(p.corre('JSON.stringify(_T())', 'textos')); } catch (e) { /* el motor no tiene textos de reserva */ }
      if (tx.titulo !== 'La Célula' || !tx.impresion.acento || tx.diploma.length !== 5) fallas.push('sin TEXTOS los textos de reserva no alcanzan: ' + JSON.stringify(tx).slice(0, 120));
    }
    ok('sin ' + t.dato + ': ' + (t.paso ? 'no pinta «' + t.paso + '», esconde su tarjeta y ' : '') + 'todo lo demás arranca igual', fallas.length === 0, fallas.join(' · '));
  });

  /* ── 3 · ninguna ── */
  console.log('— Sin los trece a la vez, ni los demás datos con reserva —');
  const vacia = carga(quita(CONTENIDO, TRECE.map(t => t.dato).concat(CON_RESERVA)), HTML);
  ok('no revienta ni se queja', !vacia.revento && !vacia.errores.length && !vacia.arranque.fallaron.length, vacia.revento || vacia.errores[0] || vacia.arranque.fallaron.join(', '));
  ok('quedan sin datos los diez widgets, la sopa y nada más',
    JSON.stringify(vacia.arranque.sinDatos.slice().sort()) === JSON.stringify(PASOS.map(t => t.paso).concat(['sopa']).sort()), vacia.arranque.sinDatos.join(', '));
  ok('el laboratorio se pinta igual', pintado(vacia).laboratorio === base.laboratorio);
  ok('el generador de tareas, sin ningún banco, se esconde', vacia.escondido('tgType'));
  const pestana = s => vacia.documento.querySelector('.nav-t[data-s="' + s + '"]');
  ok('la sección que se queda sin tarjetas esconde su pestaña (Widgets, Tarjetas, Sopa) y la que tiene algo la conserva (Laboratorio, Evaluación)',
    ['s-widgets', 's-flash', 's-sopa', 's-tareas'].every(s => pestana(s).style.display === 'none') && ['s-lab', 's-evaluacion', 's-aprende'].every(s => pestana(s).style.display !== 'none'));
  try { vacia.corre("go('s-flash');", 'ir'); } catch (e) { /* lo dice el renglón que sigue */ }
  ok('la flecha que llevaba a una sección escondida salta a la primera que sigue con algo (de Tarjetas a Evaluación)',
    vacia.el('s-evaluacion').classList.contains('active') && !vacia.el('s-flash').classList.contains('active'));
  ok('y el examen sigue ahí: llega a la Forma 50', vacia.corre('evalFormasTotal()', 'tope') === 50);

  /* ── 4 · los nombres nuevos ── */
  console.log('— Con los nombres nuevos (ordenaData, describeData, emparejaData, situacionData) —');
  const nueva = carga(conNombresNuevos(CONTENIDO), paginaConNombresNuevos(HTML));
  const veNueva = pintado(nueva, NOMBRES_NUEVOS.ids);
  ok('ya no quedan los nombres de antes en lo que se cargó', !/^const (routeSets|neuronPartes|neuroPairs|enfermedadData)\b/m.test(conNombresNuevos(CONTENIDO)) && !/id="(neuron|neuro|enfer)[A-Z]/.test(paginaConNombresNuevos(HTML)));
  ok('arranca sin reventar y sin pasos sin datos', !nueva.revento && !nueva.errores.length && !nueva.arranque.sinDatos.length && !nueva.arranque.fallaron.length, nueva.revento || nueva.errores[0] || JSON.stringify(nueva.arranque));
  ok('y pinta lo mismo que con los nombres de antes', JSON.stringify(veNueva) === JSON.stringify(base), JSON.stringify(veNueva));
  const hayBotones = ['nextDescribe', 'resetDescribe', 'resetEmpareja', 'resetSituacion'].every(f => nueva.corre('typeof ' + f, 'fn') === 'function');
  ok('la página nueva encuentra sus botones (nextDescribe, resetDescribe, resetEmpareja, resetSituacion)', hayBotones);
  if (hayBotones) nueva.corre('nextDescribe();', 'siguiente');
  ok('y «Siguiente» avanza el widget con sus ids nuevos', nueva.texto('describeProg') === 'Organelo 2 de 8', nueva.texto('describeProg'));

  /* ── 5 · ensayo ── */
  console.log('— Ensayo: un laboratorio que revienta —');
  const rota = carga(CONTENIDO, HTML, { laboratorioRoto: true });
  ok('el motor lo dice: lo anota y lo escribe en la consola con su nombre',
    !rota.revento && JSON.stringify(rota.arranque.fallaron) === '["laboratorio"]' && rota.errores.length === 1 && /laboratorio/.test(rota.errores[0]), rota.revento || JSON.stringify(rota.arranque) + ' · ' + rota.errores.join(' | '));
  ok('y no se lleva a los logros por delante, que van después', pintado(rota).logros === 8);
  const cadena = carga(CONTENIDO, HTML, { laboratorioRoto: true, cadena: true });
  ok('con el arranque en cadena, como iba antes, la misma avería sí para la página y deja los logros sin pintar (la sonda la ve)',
    !!cadena.revento && pintado(cadena).logros === 0, 'no reventó: la sonda no distinguiría un arranque en cadena');

  console.log(fallos === 0
    ? '\n✅ El motor arranca cada widget por su cuenta: sin cualquiera de los ' + TRECE.length + ' datos heredados la página sigue, y los nombres nuevos pintan lo mismo.'
    : '\n❌ ' + fallos + ' fallo(s).');
  process.exit(fallos === 0 ? 0 : 1);
}
