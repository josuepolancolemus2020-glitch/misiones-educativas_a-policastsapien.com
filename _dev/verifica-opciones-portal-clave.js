/* ============================================================
   M.E.T.A.S · Opciones del portal con la clave nueva
   ------------------------------------------------------------
   Con la tira nueva el resumen dejaba #chips vacío, y el desliz
   hacia arriba no tenía nada que volver a mostrar. Aquí se abre
   la página de verdad (sin navegador: un documento mínimo) con
   datos de mentira, nunca de un alumno real:

     a) tras resumenNuevo() hay botones y ninguno es
        «¿Qué es la clave?»;
     b) un touchmove hacia arriba quita «recogido», también con
        la vista pegada al fondo y con la caja vacía;
     c) con la clave vieja los botones son los de siempre.

   Uso:  node _dev/verifica-opciones-portal-clave.js
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

/* Documento mínimo: lo justo para que el guion de padres.html pinte
   botones y oiga el dedo. No abre red. */
function nodo(tag) {
  const el = {
    tag: tag, id: '', className: '', textContent: '', value: '',
    _html: '', children: [], parentNode: null, dataset: {},
    offsetTop: 8, scrollTop: 0, scrollHeight: 800, clientHeight: 200,
  };
  const clases = new Set();
  const oyen = {};
  el.classList = {
    add() { for (let i = 0; i < arguments.length; i++) if (arguments[i]) clases.add(arguments[i]); },
    remove() { for (let i = 0; i < arguments.length; i++) clases.delete(arguments[i]); },
    contains(c) { return clases.has(c); },
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
  const chat = nodo('div'); chat.id = 'chat';
  const chips = nodo('div'); chips.id = 'chips';
  const inp = nodo('input'); inp.id = 'inp';
  const enviar = nodo('button'); enviar.id = 'enviar';
  body.parentNode = doc;
  body.appendChild(chat);
  body.appendChild(chips);
  body.appendChild(inp);
  body.appendChild(enviar);
  const ids = { chat: chat, chips: chips, inp: inp, enviar: enviar };
  doc.body = body;
  doc.getElementById = id => ids[id] || null;
  doc.createElement = tag => nodo(tag);
  doc.querySelectorAll = () => [];
  return { doc: doc, chat: chat, chips: chips };
}
function despachar(el, tipo, extra) {
  const ev = { type: tipo, target: el, bubbles: true, touches: [], deltaY: 0,
    preventDefault() {}, stopPropagation() {} };
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
function ultimo(chat) {
  const hs = chat.children || [];
  return hs.length ? String(hs[hs.length - 1]._html || '') : '';
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
  const pedidos = [];
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
      pedidos.push(u);
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
  const oyenVentana = {};
  sandbox.addEventListener = (tipo, fn) => { (oyenVentana[tipo] = oyenVentana[tipo] || []).push(fn); };
  sandbox.removeEventListener = () => {};
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(NOTAS, sandbox, { filename: 'js/familia-notas.js' });
  vm.runInContext(INLINE, sandbox, { filename: 'padres.html' });
  return { ctx: sandbox, dom: dom, pedidos: pedidos, errores: errores };
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
function igual(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => x === b[i]);
}
function sinClave(lista) {
  return lista.every(t => !/qu[eé] es la clave/i.test(t));
}
/* El arranque encadena promesas ya resueltas. Un turno de la cola basta
   para que termine antes de mirar los botones. */
function asentar() {
  return new Promise(r => setTimeout(r, 0));
}

(async () => {
  ok('se pudo leer el guion de padres.html', !!INLINE);
  ok('CHIPS_BASE y CHIPS_NUEVA están en la página', !!CHIPS_VIEJOS && !!CHIPS_NUEVOS && CHIPS_NUEVOS.length > 0);

  console.log('\n— a) clave nueva, después del resumen');
  let nuevo;
  try { nuevo = abrir(padreNuevo()); }
  catch (e) { ok('la página arranca con la clave nueva', false, e && e.stack || e); }
  if (nuevo) {
    await asentar();
    if (nuevo.errores.length) ok('el arranque nuevo no revienta', false, nuevo.errores[0]);
    const chips = nuevo.dom.chips;
    const chat = nuevo.dom.chat;
    chips.innerHTML = '';
    chips.classList.add('recogido');
    try { await nuevo.ctx.resumenNuevo(); }
    catch (e) { ok('resumenNuevo termina', false, e && e.stack || e); }
    const botones = textos(chips);
    console.log('  · chips: ' + botones.join(' | '));
    ok('hay al menos un botón', botones.length >= 1, botones.length);
    ok('ninguno es «¿Qué es la clave?»', sinClave(botones), botones.filter(t => /clave/i.test(t)).join(', '));
    ok('son las opciones de la clave nueva, en ese orden', igual(botones, CHIPS_NUEVOS), botones.join(' | '));
    ok('no ofrece faltas, pagos, bitácora ni conducta',
      !botones.some(t => /Faltó|Avisar falta|Pagos|Bitácora|Conducta/.test(t)));
    ok('el resumen ya no deja la caja recogida', !chips.classList.contains('recogido'));
    const resumen = ultimo(chat);
    ok('el resumen habla de Lito y de su nota', /Lito/.test(resumen) && /Matemáticas/.test(resumen) && /Español/.test(resumen));
    ok('y del recibo y del aviso de prueba', /RC-PRUEBA-0001/.test(resumen) && /Reunión de prueba/.test(resumen));

    console.log('\n— b) deslizar hacia arriba, con la vista pegada al fondo');
    chat.scrollTop = chat.scrollHeight;
    chips.classList.add('recogido');
    despachar(chat, 'touchstart', { touches: [{ clientX: 40, clientY: 320 }] });
    despachar(chat, 'touchmove', { touches: [{ clientX: 40, clientY: 240 }] });
    ok('el touchmove hacia arriba quita «recogido»', !chips.classList.contains('recogido'));
    ok('y no cambia los botones', igual(textos(chips), CHIPS_NUEVOS));

    despachar(chat, 'touchstart', { touches: [{ clientX: 40, clientY: 200 }] });
    despachar(chat, 'touchmove', { touches: [{ clientX: 40, clientY: 280 }] });
    ok('el dedo hacia abajo los recoge', chips.classList.contains('recogido'));
    despachar(chat, 'touchstart', { touches: [{ clientX: 40, clientY: 300 }] });
    despachar(chat, 'touchmove', { touches: [{ clientX: 40, clientY: 220 }] });
    ok('volver a subirlos los muestra otra vez', !chips.classList.contains('recogido'));

    chips.classList.add('recogido');
    despachar(chat, 'wheel', { deltaY: -40 });
    ok('la rueda hacia arriba los recoge', chips.classList.contains('recogido'));
    despachar(chat, 'wheel', { deltaY: 40 });
    ok('la rueda hacia abajo los devuelve', !chips.classList.contains('recogido'));

    chips.innerHTML = '';
    chips.classList.add('recogido');
    chat.scrollTop = chat.scrollHeight;
    despachar(chat, 'touchstart', { touches: [{ clientX: 30, clientY: 360 }] });
    despachar(chat, 'touchmove', { touches: [{ clientX: 30, clientY: 200 }] });
    ok('si la caja estaba vacía, el desliz la vuelve a llenar', textos(chips).length >= 1 && !chips.classList.contains('recogido'));
    ok('y tampoco entonces aparece «¿Qué es la clave?»', sinClave(textos(chips)));

    console.log('\n— cada botón contestado con la clave nueva');
    async function tocar(texto) {
      nuevo.pedidos.length = 0;
      await nuevo.ctx.manejar(texto);
      return { html: ultimo(chat), botones: textos(chips), red: nuevo.pedidos.slice() };
    }
    const va = await tocar('📊 ¿Cómo va?');
    ok('«¿Cómo va?» sigue dejando el menú', igual(va.botones, CHIPS_NUEVOS) && /Lito/.test(va.html));
    const av = await tocar('📣 Avisos');
    ok('«Avisos» lee el aviso de prueba y no el portal viejo',
      /Reunión de prueba/.test(av.html) && !/Aún no hay notas/.test(av.html)
      && av.red.some(u => u.indexOf('vf_avisos') >= 0)
      && !av.red.some(u => u.indexOf('metas_consultar') >= 0), av.html.slice(0, 180));
    ok('después de Avisos el menú sigue', igual(av.botones, CHIPS_NUEVOS) && sinClave(av.botones));
    const ult = await tocar('📝 Última nota');
    ok('«Última nota» es la del parcial más reciente (Español, 64)',
      /Español/.test(ult.html) && /64/.test(ult.html) && /Segundo parcial/.test(ult.html)
      && !/Matemáticas/.test(ult.html) && !/Aún no hay notas/.test(ult.html), ult.html.slice(0, 220));
    const todas = await tocar('📚 Todas las notas');
    ok('«Todas las notas» trae las dos materias',
      /Matemáticas/.test(todas.html) && /Español/.test(todas.html) && !/metas_consultar/.test(todas.red.join(' ')));
    const bol = await tocar('🧮 Boleta del parcial');
    ok('«Boleta del parcial» sale de las notas, por parcial',
      /Boleta del parcial/.test(bol.html) && /Primer parcial/.test(bol.html) && /Segundo parcial/.test(bol.html)
      && !bol.red.some(u => u.indexOf('metas_consultar') >= 0));
    const rec = await tocar('🧾 Recibos');
    ok('«Recibos» muestra el recibo de prueba',
      /RC-PRUEBA-0001/.test(rec.html) && /Papel de prueba/.test(rec.html) && /25/.test(rec.html)
      && rec.red.some(u => u.indexOf('vf_pagos') >= 0)
      && !rec.red.some(u => u.indexOf('metas_consultar') >= 0), rec.html.slice(0, 180));
    const ay = await tocar('🏠 ¿Cómo ayudo?');
    ok('«¿Cómo ayudo?» aconseja con la nota baja y no dice que no hay',
      /ayudar en casa/i.test(ay.html) && /Español/.test(ay.html) && !/Aún no hay notas/.test(ay.html)
      && !ay.red.some(u => u.indexOf('metas_consultar') >= 0));
    const co = await tocar('💡 Consejo');
    ok('«Consejo» contesta y deja el menú', /Consejo de hoy/.test(co.html) && igual(co.botones, CHIPS_NUEVOS));
    const ac = await tocar('🔄 Actualizar');
    ok('«Actualizar» vuelve a leer las notas de Lito', /Lito/.test(ac.html) && /Notas de Lito/.test(ac.html)
      && ac.red.some(u => u.indexOf('familia_notas') >= 0));
    ok('ninguna de esas respuestas ofrece «¿Qué es la clave?»',
      [va, av, ult, todas, bol, rec, ay, co, ac].every(r => sinClave(r.botones)));

    const c = JSON.parse(nuevo.ctx.localStorage.getItem('METAS_PADRE_V1'));
    c.codigos.push({ codigo: 'M4NPQ8RSTY', alias: '', nueva: true });
    nuevo.ctx.localStorage.setItem('METAS_PADRE_V1', JSON.stringify(c));
    const dos = nuevo.ctx.chipsMenu();
    ok('con dos claves aparece «Cambiar de hijo» delante', dos[0] === '👧 Cambiar de hijo' && igual(dos.slice(1), CHIPS_NUEVOS));
    await nuevo.ctx.manejar('👧 Cambiar de hijo');
    const cambio = ultimo(chat);
    const quienes = textos(chips);
    ok('«Cambiar de hijo» ofrece las dos claves de prueba',
      /K7QMX-4PA2B/.test(cambio) && /M4NPQ-8RSTY/.test(cambio)
      && quienes.indexOf('👧 K7QMX-4PA2B') >= 0 && quienes.indexOf('👧 M4NPQ-8RSTY') >= 0
      && sinClave(quienes), quienes.join(' | '));
  }

  console.log('\n— c) clave vieja, los botones de siempre');
  let viejo;
  try { viejo = abrir(padreViejo()); }
  catch (e) { ok('la página arranca con la clave vieja', false, e && e.stack || e); }
  if (viejo) {
    await asentar();
    if (viejo.errores.length) ok('el arranque viejo no revienta', false, viejo.errores[0]);
    const botones = textos(viejo.dom.chips);
    if (!botones.length) ok('la clave vieja dejó texto en el chat', ultimo(viejo.dom.chat).length > 0, ultimo(viejo.dom.chat).slice(0, 240));
    ok('son CHIPS_BASE, en el mismo orden', igual(botones, CHIPS_VIEJOS), botones.join(' | '));
    ok('siguen faltas, pagos, bitácora y conducta',
      ['🗓 ¿Faltó?', '🤒 Avisar falta', '💰 Pagos', '📔 Bitácora', '🙂 Conducta'].every(t => botones.indexOf(t) >= 0));
    viejo.dom.chat.scrollTop = viejo.dom.chat.scrollHeight;
    viejo.dom.chips.classList.add('recogido');
    despachar(viejo.dom.chat, 'touchstart', { touches: [{ clientX: 20, clientY: 300 }] });
    despachar(viejo.dom.chat, 'touchmove', { touches: [{ clientX: 20, clientY: 220 }] });
    ok('el desliz hacia arriba quita «recogido» y no cambia el menú',
      !viejo.dom.chips.classList.contains('recogido') && igual(textos(viejo.dom.chips), CHIPS_VIEJOS));
    ok('la clave vieja no pidió las vistas de la clave nueva',
      !viejo.pedidos.some(u => /vf_hijos|vf_pagos|vf_avisos|familia_notas/.test(u)), viejo.pedidos.join(' '));
  }

  console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ La clave nueva deja opciones, y la vieja no cambia');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ La sonda tropezó:', e && e.stack || e); process.exit(1); });
