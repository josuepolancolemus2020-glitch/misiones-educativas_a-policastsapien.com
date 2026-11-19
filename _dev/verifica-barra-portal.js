/* ============================================================
   M.E.T.A.S · La barra del portal al deslizar
   ------------------------------------------------------------
   En el portal de las familias la barra de arriba (el robot,
   «Asistente M.E.T.A.S», el candado y «Inicio») se iba de la
   vista cuando la conversación crecía o al leer. El mismo dedo
   que ya recogía los botones —hacia abajo, para releer lo de
   arriba— tiene que traerla y dejarla. Hacia arriba los botones
   siguen saliendo (reabrirChips). La rueda con deltaY<0 hace lo
   mismo que el dedo hacia abajo.

   Se abre la página de verdad, sin navegador, con datos de
   mentira. Nunca un alumno real.

   Uso:  node _dev/verifica-barra-portal.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const HTML = fs.readFileSync(path.join(RAIZ, 'padres.html'), 'utf8');
const NOTAS = fs.readFileSync(path.join(RAIZ, 'js/familia-notas.js'), 'utf8');
const INLINE = (HTML.match(/<script>\n([\s\S]*?)\n<\/script>\s*<\/body>/) || [])[1];

let fallos = 0;
function ok(nombre, cond, extra) {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra == null ? '' : ' → ' + extra));
  if (!cond) fallos++;
}
function listaDe(nombre) {
  const m = HTML.match(new RegExp('const ' + nombre + ' = \\[([\\s\\S]*?)\\];'));
  if (!m) return null;
  return Function('return [' + m[1] + '];')();
}
const CHIPS_VIEJOS = listaDe('CHIPS_BASE');
const CHIPS_NUEVOS = listaDe('CHIPS_NUEVA');

function nodo(tag) {
  const el = {
    tag: tag, id: '', className: '', textContent: '', value: '',
    _html: '', children: [], parentNode: null, dataset: {},
    offsetTop: 8, offsetHeight: 0, scrollTop: 0, scrollHeight: 2400, clientHeight: 280,
    _vars: {},
  };
  const clases = new Set();
  const oyen = {};
  el.classList = {
    add() { for (let i = 0; i < arguments.length; i++) if (arguments[i]) clases.add(arguments[i]); },
    remove() { for (let i = 0; i < arguments.length; i++) clases.delete(arguments[i]); },
    contains(c) { return clases.has(c); },
  };
  el.style = {
    setProperty(k, v) { el._vars[k] = v; },
    getPropertyValue(k) { return el._vars[k] || ''; },
  };
  el.addEventListener = (tipo, fn, opt) => {
    const k = tipo + ((opt && opt.capture) ? ':c' : ':b');
    (oyen[k] = oyen[k] || []).push(fn);
  };
  el._oyen = oyen;
  el.appendChild = h => { h.parentNode = el; el.children.push(h); return h; };
  el.remove = () => {
    if (el.parentNode) el.parentNode.children = el.parentNode.children.filter(x => x !== el);
    el.parentNode = null;
  };
  el.contains = n => { let x = n; while (x) { if (x === el) return true; x = x.parentNode; } return false; };
  el.querySelector = sel => (el.querySelectorAll(sel)[0] || null);
  el.querySelectorAll = sel => {
    const out = [];
    (function walk(n) {
      (n.children || []).forEach(h => { if (coincide(h, sel)) out.push(h); walk(h); });
    })(el);
    return out;
  };
  Object.defineProperty(el, 'innerHTML', {
    get() { return el._html; },
    set(v) { el._html = String(v); el.children = []; },
  });
  return el;
}
function coincide(n, sel) {
  if (sel === 'button') return n.tag === 'button';
  if (sel.charAt(0) === '.') return (' ' + (n.className || '') + ' ').indexOf(' ' + sel.slice(1) + ' ') >= 0;
  return n.tag === sel;
}
function armarDocumento() {
  const doc = nodo('#document');
  const body = nodo('body');
  const header = nodo('header');
  header.id = 'encabezado';
  header.offsetHeight = 62;
  header.textContent = '🤖 Asistente M.E.T.A.S 🔒 Inicio';
  const chat = nodo('div'); chat.id = 'chat';
  const chips = nodo('div'); chips.id = 'chips';
  const inp = nodo('input'); inp.id = 'inp';
  const enviar = nodo('button'); enviar.id = 'enviar';
  const head = nodo('head');
  body.parentNode = doc;
  body.appendChild(header);
  body.appendChild(chat);
  body.appendChild(chips);
  body.appendChild(inp);
  body.appendChild(enviar);
  const ids = { encabezado: header, chat: chat, chips: chips, inp: inp, enviar: enviar };
  doc.body = body;
  doc.head = head;
  doc.getElementById = id => ids[id] || null;
  doc.createElement = tag => nodo(tag);
  doc.querySelectorAll = () => [];
  return { doc: doc, chat: chat, chips: chips, header: header };
}
function despachar(el, tipo, extra) {
  const ev = {
    type: tipo, target: el, bubbles: true, touches: [], deltaY: 0,
    preventDefault() {}, stopPropagation() {},
  };
  if (extra) Object.keys(extra).forEach(k => { ev[k] = extra[k]; });
  const camino = [];
  let n = el;
  while (n) { camino.push(n); n = n.parentNode; }
  const fire = (quien, cap) => {
    const lista = (quien._oyen && quien._oyen[tipo + (cap ? ':c' : ':b')]) || [];
    lista.slice().forEach(fn => fn(ev));
  };
  for (let i = camino.length - 1; i >= 0; i--) fire(camino[i], true);
  for (let i = 0; i < camino.length; i++) fire(camino[i], false);
}
function textos(chips) {
  return (chips.children || []).filter(n => n.tag === 'button').map(b => b.textContent);
}
function dedo(chat, y0, y1) {
  despachar(chat, 'touchstart', { touches: [{ clientX: 40, clientY: y0 }] });
  despachar(chat, 'touchmove', { touches: [{ clientX: 40, clientY: y1 }] });
}
function igual(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => x === b[i]);
}

/* Lo que contestaría la base. Nombres y montos inventados. */
const HIJO = [{ nombre: 'Lito', docente: 'Profe Sol' }];
const PAGOS = [{ recibo: 'RC-PRUEBA-0001', concepto: 'Papel de prueba', monto: '25.00' }];
const AVISOS = [{ titulo: 'Reunión de prueba', texto: 'El viernes es de prueba.' }];
const FILAS = [
  { nombre: 'Lito', asignatura: 'Matemáticas', periodo: 'I', valor: '80.00' },
  { nombre: 'Lito', asignatura: 'Español', periodo: 'II', valor: '64.00' },
];
const PLAN_VIEJO = [{
  evaluacion: 'Sumas de prueba', materia: 'Matemáticas', nota: 88, base: 100,
  fecha: '2026-03-02', tipo: 'prueba', parcial: 'I', categoria: 'satisfactorio',
  docente: 'Profe Sol', grado: '3', seccion: '1',
}];

function abrir(padre) {
  const dom = armarDocumento();
  const errores = [];
  const mem = {};
  Object.keys(padre).forEach(k => { mem[k] = padre[k]; });
  const sandbox = {
    console: console,
    document: dom.doc,
    location: { hostname: 'localhost', href: 'http://localhost/padres.html' },
    navigator: { onLine: true },
    localStorage: {
      getItem(k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
      setItem(k, v) { mem[k] = String(v); },
      removeItem(k) { delete mem[k]; },
    },
    fetch(url) {
      const u = String(url);
      let cuerpo = [];
      if (u.indexOf('vf_hijos') >= 0) cuerpo = HIJO;
      else if (u.indexOf('vf_pagos') >= 0) cuerpo = PAGOS;
      else if (u.indexOf('vf_avisos') >= 0) cuerpo = AVISOS;
      else if (u.indexOf('familia_notas') >= 0) cuerpo = FILAS;
      else if (u.indexOf('metas_consultar_plan_padre') >= 0) cuerpo = PLAN_VIEJO;
      return Promise.resolve({ ok: true, json: () => Promise.resolve(cuerpo) });
    },
    setTimeout(fn) {
      try { fn(); }
      catch (e) { errores.push(e && e.stack || e); }
      return 0;
    },
    clearTimeout() {},
    __METAS_NUBE_DE_PRUEBA__: { url: 'http://127.0.0.1:9', llavePublica: 'llave-de-prueba' },
  };
  sandbox.addEventListener = () => {};
  sandbox.removeEventListener = () => {};
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(NOTAS, sandbox, { filename: 'js/familia-notas.js' });
  vm.runInContext(INLINE, sandbox, { filename: 'padres.html' });
  return { ctx: sandbox, dom: dom, errores: errores };
}
function sesion() {
  return JSON.stringify({
    access_token: 'tok-prueba', refresh_token: 'ref-prueba',
    expires_at: Math.floor(Date.now() / 1000) + 86400,
  });
}
function padreNuevo() {
  const codigo = 'K7QMX4PA2B';
  return {
    METAS_FAMILIA_SESION_V1: sesion(),
    METAS_PADRE_V1: JSON.stringify({
      codigo: codigo, nueva: true,
      codigos: [{ codigo: codigo, alias: '', nueva: true }],
    }),
  };
}
function padreViejo() {
  const codigo = '15K7QM';
  return {
    METAS_PADRE_V1: JSON.stringify({
      codigo: codigo,
      codigos: [{ codigo: codigo, alias: '' }],
    }),
  };
}
function asentar() {
  return new Promise(r => setTimeout(r, 0));
}

/* Conversación ya larga: la vista no está al principio. Ahí es donde
   la barra se perdía, y donde el dedo hacia abajo tiene que devolverla. */
function conversacionLarga(chat) {
  for (let i = 0; i < 12; i++) {
    const m = nodo('div');
    m.className = 'msg bot';
    m._html = '<div class="bub">Nota de prueba ' + (i + 1) + ' de Lito. Esto es de mentira.</div>';
    chat.appendChild(m);
  }
  chat.scrollTop = 900;
}

function gestos(titulo, padre, menu) {
  console.log('\n— ' + titulo);
  let pag;
  try { pag = abrir(padre); }
  catch (e) { ok(titulo + ': la página arranca', false, e && e.stack || e); return; }
  return asentar().then(() => {
    if (pag.errores.length) ok(titulo + ': el arranque no revienta', false, pag.errores[0]);
    const chat = pag.dom.chat;
    const chips = pag.dom.chips;
    const barra = pag.dom.header;
    const textoBarra = barra.textContent;
    conversacionLarga(chat);
    const menuInicial = textos(chips);
    ok(titulo + ': los botones son los de esa clave', igual(menuInicial, menu), menuInicial.join(' | '));
    ok(titulo + ': al abrir, la barra está a la vista', !barra.classList.contains('fuera'));
    ok(titulo + ': midió su alto para no tapar el chat', barra._vars['--alto'] === '62px', barra._vars['--alto']);

    /* Se había ido (como al leer). Un roce corto no la trae: así no salta. */
    barra.classList.add('fuera');
    dedo(chat, 200, 210);
    ok(titulo + ': un dedo corto no mueve la barra ni los botones',
      barra.classList.contains('fuera') && !chips.classList.contains('recogido'));

    dedo(chat, 200, 280);
    ok(titulo + ': el touchmove hacia abajo deja la barra visible', !barra.classList.contains('fuera'));
    ok(titulo + ': y sigue recogiendo los botones', chips.classList.contains('recogido'));
    ok(titulo + ': la barra se queda si el dedo sigue hacia abajo', (function () {
      dedo(chat, 180, 260);
      return !barra.classList.contains('fuera') && chips.classList.contains('recogido');
    })());
    ok(titulo + ': el desliz no cambia el texto de la barra', barra.textContent === textoBarra);
    ok(titulo + ': ni la lista de botones', igual(textos(chips), menu));

    dedo(chat, 300, 220);
    ok(titulo + ': el dedo hacia arriba vuelve a mostrar los botones', !chips.classList.contains('recogido'));
    ok(titulo + ': y puede apartar la barra, sin quitarle el texto',
      barra.classList.contains('fuera') && barra.textContent === textoBarra);
    ok(titulo + ': reabrirChips no cambia el menú', igual(textos(chips), menu));

    barra.classList.add('fuera');
    chips.classList.add('recogido');
    despachar(chat, 'wheel', { deltaY: -40 });
    ok(titulo + ': la rueda con deltaY<0 muestra la barra', !barra.classList.contains('fuera'));
    ok(titulo + ': y recoge los botones, como el dedo hacia abajo', chips.classList.contains('recogido'));
    despachar(chat, 'wheel', { deltaY: 40 });
    ok(titulo + ': la rueda hacia abajo devuelve los botones', !chips.classList.contains('recogido'));

    /* Un toque en la propia barra no es el gesto del chat. */
    const recogidoAntes = chips.classList.contains('recogido');
    const fueraAntes = barra.classList.contains('fuera');
    dedo(barra, 40, 120);
    ok(titulo + ': deslizar la barra no dispara el gesto del chat',
      chips.classList.contains('recogido') === recogidoAntes && barra.classList.contains('fuera') === fueraAntes);
  });
}

(async () => {
  ok('se pudo leer el guion de padres.html', !!INLINE);
  ok('siguen el robot, el nombre, el candado e Inicio',
    /class="h-avatar">🤖</.test(HTML) && /class="h-t1">Asistente M\.E\.T\.A\.S</.test(HTML)
    && /class="h-privacidad"[^>]*>🔒</.test(HTML) && /class="h-inicio"[^>]*>Inicio</.test(HTML));
  ok('la barra se aparta con transición, no de golpe',
    /header\s*\{[^}]*transition:[^;]*max-height/.test(HTML) && !/header\.fuera\s*\{[^}]*display:\s*none/.test(HTML));
  ok('al apartarse suelta el hueco: no queda fija encima del texto',
    /header\.fuera\s*\{[^}]*max-height:\s*0/.test(HTML) && !/header[^{]*\{[^}]*position:\s*fixed/.test(HTML));
  const cache = (/CACHE_NAME = 'meta-app-v(\d+)'/.exec(fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8')) || [])[1];
  ok('el sello del portal es el de sw.js (v' + cache + ')',
    /* El número no se escribe aquí: es el de sw.js. Con la cifra fija, cada
       sello nuevo ponía roja esta sonda sin que el portal cambiara. */
    !!cache && new RegExp('familia-notas\\.js\\?v=' + cache + '"').test(HTML));

  await gestos('clave nueva', padreNuevo(), CHIPS_NUEVOS);
  await gestos('clave vieja', padreViejo(), CHIPS_VIEJOS);

  console.log('\n— clave nueva: si la caja estaba vacía, el dedo hacia arriba la llena');
  const nuevo = abrir(padreNuevo());
  await asentar();
  nuevo.dom.chips.innerHTML = '';
  nuevo.dom.chips.classList.add('recogido');
  nuevo.dom.header.classList.add('fuera');
  dedo(nuevo.dom.chat, 360, 200);
  ok('reabrirChips vuelve a poner botones', textos(nuevo.dom.chips).length >= 1 && !nuevo.dom.chips.classList.contains('recogido'));
  ok('y ninguno es «¿Qué es la clave?»', textos(nuevo.dom.chips).every(t => !/qu[eé] es la clave/i.test(t)));
  dedo(nuevo.dom.chat, 200, 280);
  ok('después, el dedo hacia abajo deja la barra visible', !nuevo.dom.header.classList.contains('fuera'));
  ok('y los botones se recogen otra vez', nuevo.dom.chips.classList.contains('recogido'));

  console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ La barra vuelve al deslizar hacia abajo, y los botones siguen igual');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ La sonda tropezó:', e && e.stack || e); process.exit(1); });
