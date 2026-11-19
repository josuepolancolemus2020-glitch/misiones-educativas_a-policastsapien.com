/* ============================================================
   M.E.T.A.S · Dos aparatos, un centro: que el perfil sincronice
   ------------------------------------------------------------
   El 18 de noviembre de 2026 los registros de Supabase mostraron 161
   rechazos «no se pudo anotar» del perfil del centro. La causa: el
   perfil se mandaba a la base con CADA letra, un centro nuevo nacía con
   la primera («J», «M»), el nombre completo chocaba con otro centro
   igual (la regla centros_unico: dueño + nombre sin acentos + año) y la
   base contestaba 409 con el código 23505. Cada letra dejaba su
   tarjeta, las ediciones siguientes de ese centro también fallaban
   porque llevaban la fila entera (nombre incluido), y una edición
   vieja en cola volvía a escribir el nombre de antes.

   Esta sonda abre DOS aparatos (dos contextos del navegador, cada uno
   con su IndexedDB y su cola), con el service worker de verdad
   (serviceWorkers: 'allow'), y una base de prueba que vive aquí:
   aplica centros_unico y contesta 409 / 23505 como la de verdad, y
   avisa por un Realtime de mentira (el mismo protocolo Phoenix que usa
   js/vendor/supabase.min.js). No se toca Supabase.

     a) escribir letra por letra un centro cuyo nombre ya existe: se
        une o se avisa, y nunca queda una tarjeta por letra;
     b) A renombra mientras B tiene ediciones viejas en cola; B vuelve a
        tener señal y no revive el nombre viejo;
     c) A y B crean «María Consuelo» a la vez: queda un solo centro;
     d) dos centros se intercambian el nombre;
     e) B ve el cambio de A sin recargar;
     f) un service worker viejo (v548 y v567, de _dev/sw-viejos) se
        actualiza al de hoy con la pestaña abierta, y la pestaña avisa
        «Hay una versión nueva»;
     g) a lo sumo una tarjeta 23505 por fila.

   El servidor es propio (puerto 8125), como el de verifica-arranque-sw:
   así se puede servir el sw.js viejo sin tocar el del repositorio.

   Uso:  node _dev/verifica-sync-dos-aparatos.js
         (no necesita el servidor de 8123: levanta el suyo)
   ============================================================ */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const PUERTO = 8125;
const BASE = `http://localhost:${PUERTO}`;
const UID = '11111111-1111-4111-8111-111111111111';
const ORIGEN = 'https://uljjgrikyigdrkbikcxo.supabase.co';
const SW_HOY = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
const CACHE_HOY = (/const CACHE_NAME = '([^']+)'/.exec(SW_HOY) || [])[1];
const SW_VIEJOS = [
  ['v548 · el primero que guardaba la base', 'sw-v548-2026-11.js'],
  ['v567 · el último antes del PR 40', 'sw-v567-2026-11.js'],
].map(([nombre, f]) => ({ nombre, texto: fs.readFileSync(path.join(__dirname, 'sw-viejos', f), 'utf8') }));

let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined && !bien ? '  → ' + JSON.stringify(extra).slice(0, 900) : ''));
};
const dormir = ms => new Promise(r => setTimeout(r, ms));

/* ── el servidor de la aplicación ────────────────────────────── */
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.webmanifest': 'application/manifest+json',
};
let swServido = SW_HOY;
const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const enviar = (codigo, cuerpo, tipo) => {
    const etiqueta = '"' + crypto.createHash('sha1').update(cuerpo).digest('hex').slice(0, 16) + '"';
    const cab = { 'Cache-Control': 'no-cache', 'ETag': etiqueta };
    if (codigo === 200 && req.headers['if-none-match'] === etiqueta) { res.writeHead(304, cab); return res.end(); }
    res.writeHead(codigo, Object.assign(cab, { 'Content-Type': tipo }));
    res.end(cuerpo);
  };
  if (rel === '/sw.js') return enviar(200, Buffer.from(swServido), TIPOS['.js']);
  const f = path.join(RAIZ, rel);
  if (!f.startsWith(RAIZ)) { res.writeHead(403); return res.end(); }
  fs.readFile(f, (e, datos) => {
    if (e) return enviar(404, Buffer.from('no está: ' + rel), 'text/plain; charset=utf-8');
    enviar(200, datos, TIPOS[path.extname(f).toLowerCase()] || 'application/octet-stream');
  });
});
servidor.keepAliveTimeout = 1000;

/* ── la base de prueba ───────────────────────────────────────── */
// La misma normalización que metas.norm_nombre (SUPABASE-V2-ESQUEMA.sql).
function normNombre(t) {
  const de = 'áéíóúüñàèìòùâêîôûäëïö', a = 'aeiouunaeiouaeiouaeio';
  return String(t == null ? '' : t).trim().toLowerCase().split('').map(c => {
    const i = de.indexOf(c);
    return i >= 0 ? a[i] : c;
  }).join('').replace(/\s+/g, ' ');
}
let reloj = Date.now();
function ahora() {
  reloj = Math.max(reloj + 1, Date.now());
  return new Date(reloj).toISOString();
}
const copiar = o => JSON.parse(JSON.stringify(o));

let tablas = {};
let rechazos = [];
let escrituras = [];     // { aparato, metodo, tabla, cuerpo, status }
const sockets = new Set();

function centro(id, nombre, extra) {
  const t = ahora();
  return Object.assign({
    id, owner: UID, nombre, anio_lectivo: 2026, direccion: null, aldea: null, municipio: null, departamento: null,
    codigo_sace: null, director: null, docente: null, modalidad: null, jornada: null, logo: null, logo_sec: null,
    version: 1, created_at: t, updated_at: t, deleted_at: null, op_creacion: null,
  }, extra || {});
}
function aula(id, centroId, escuela, extra) {
  const t = ahora();
  return Object.assign({
    id, owner: UID, centro_id: centroId, escuela, grado: 6, seccion: '1', anio_lectivo: 2026, docente_nombre: null,
    version: 1, created_at: t, updated_at: t, deleted_at: null, op_creacion: null,
  }, extra || {});
}
function sembrar(semilla) {
  tablas = copiar(semilla || {});
  rechazos = [];
  escrituras = [];
}

// Las reglas «unique» que la sonda necesita: centros_unico y, para la
// tarjeta de una clase repetida, (aula, nombre) en asignaturas.
function choca(tabla, fila) {
  if (fila.deleted_at) return null;
  const otras = (tablas[tabla] || []).filter(f => f.id !== fila.id && !f.deleted_at);
  if (tabla === 'centros') {
    const c = otras.find(f => f.owner === fila.owner && normNombre(f.nombre) === normNombre(fila.nombre)
      && Number(f.anio_lectivo) === Number(fila.anio_lectivo));
    return c ? 'centros_unico' : null;
  }
  if (tabla === 'asignaturas') {
    const c = otras.find(f => f.aula_id === fila.aula_id && normNombre(f.nombre) === normNombre(fila.nombre));
    return c ? 'asignaturas_unico' : null;
  }
  return null;
}
function repetido(regla) {
  return {
    code: '23505',
    message: 'duplicate key value violates unique constraint "' + regla + '"',
    details: 'Key already exists.', hint: null,
  };
}

function filtrar(lista, params) {
  let out = lista.slice();
  for (const [k, v] of params) {
    if (k === 'select' || k === 'order' || k === 'limit' || k === 'or') continue;
    const m = /^(eq|is|in|gte|gt)\.(.*)$/.exec(v);
    if (!m) continue;
    const val = m[2].replace(/^"|"$/g, '');
    if (m[1] === 'eq') out = out.filter(f => String(f[k]) === val);
    else if (m[1] === 'is') out = out.filter(f => val === 'null' ? f[k] == null : String(f[k]) === val);
    else if (m[1] === 'in') {
      const ids = val.replace(/^\(|\)$/g, '').split(',').filter(Boolean);
      out = out.filter(f => ids.indexOf(String(f[k])) >= 0);
    } else if (m[1] === 'gte') out = out.filter(f => String(f[k]) >= val);
    else if (m[1] === 'gt') out = out.filter(f => String(f[k]) > val);
  }
  return out;
}

// Realtime: a cada aparato conectado le llega «cambió tal fila», como la
// de verdad. Un aparato sin señal no recibe nada.
function avisarCambio(tabla, fila) {
  sockets.forEach(s => {
    if (s.aparato.sinSenal) return;
    s.temas.forEach((ids, topic) => {
      try {
        s.ws.send(JSON.stringify({
          topic, event: 'postgres_changes', ref: null,
          payload: { ids, data: { schema: 'metas', table: tabla, commit_timestamp: fila.updated_at,
            type: 'UPDATE', record: fila, old_record: { id: fila.id }, columns: [], errors: null } },
        }));
      } catch (_) { /* el aparato se cerró */ }
    });
  });
}

function cumplir(route, status, body, tipo) {
  return route.fulfill({
    status,
    headers: {
      'content-type': tipo || 'application/json', 'cache-control': 'no-store',
      'access-control-allow-origin': '*', 'access-control-allow-headers': '*',
      'access-control-allow-methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    },
    body: body == null ? '' : (typeof body === 'string' ? body : JSON.stringify(body)),
  });
}

function baseDe(aparato) {
  return async function (route) {
    const req = route.request();
    const url = new URL(req.url());
    const metodo = req.method();
    if (aparato.sinSenal) return route.abort('internetdisconnected');
    if (metodo === 'OPTIONS') return cumplir(route, 204, '', 'text/plain');
    if (url.pathname.indexOf('/auth/') >= 0) return cumplir(route, 200, {});
    if (url.pathname.indexOf('/functions/') >= 0) return cumplir(route, 401, { ok: false });
    if (url.pathname.indexOf('/rpc/blob_leer') >= 0) return cumplir(route, 200, []);
    if (url.pathname.indexOf('/rpc/blob_guardar') >= 0) return cumplir(route, 200, 0);
    if (url.pathname.indexOf('/rpc/') >= 0) return cumplir(route, 200, null);
    const tabla = (url.pathname.match(/\/rest\/v1\/([a-z0-9_]+)/) || [])[1];
    if (!tabla) return cumplir(route, 200, []);
    let cuerpo = null;
    try { cuerpo = JSON.parse(req.postData() || 'null'); } catch (_) { cuerpo = null; }
    if (tabla === 'rechazos') {
      rechazos.push(Object.assign({ aparato: aparato.nombre }, cuerpo));
      return cumplir(route, 201, '');
    }
    const lista = tablas[tabla] = tablas[tabla] || [];
    const anotar = status => escrituras.push({ aparato: aparato.nombre, metodo, tabla, cuerpo: copiar(cuerpo), status });

    if (metodo === 'GET') return cumplir(route, 200, filtrar(lista, url.searchParams).map(copiar));

    if (metodo === 'POST') {
      const filas = Array.isArray(cuerpo) ? cuerpo : [cuerpo];
      const nuevas = [];
      for (const b of filas) {
        if (lista.some(f => f.id === b.id)) { anotar(409); return cumplir(route, 409, repetido(tabla + '_pkey')); }
        const t = ahora();
        const fila = Object.assign({ deleted_at: null }, b, { owner: UID, version: 1, created_at: t, updated_at: t });
        const regla = choca(tabla, fila);
        if (regla) { anotar(409); return cumplir(route, 409, repetido(regla)); }
        nuevas.push(fila);
      }
      nuevas.forEach(f => { lista.push(f); avisarCambio(tabla, f); });
      anotar(201);
      return cumplir(route, 201, nuevas.map(copiar));
    }

    if (metodo === 'PATCH') {
      const quien = filtrar(lista, url.searchParams);
      const hechas = [];
      for (const f of quien) {
        const nueva = Object.assign({}, f, cuerpo || {});
        const regla = choca(tabla, nueva);
        if (regla) { anotar(409); return cumplir(route, 409, repetido(regla)); }
        hechas.push([f, nueva]);
      }
      const salen = hechas.map(([f, nueva]) => {
        Object.keys(cuerpo || {}).forEach(k => {
          if (['id', 'owner', 'version', 'updated_at', 'created_at'].indexOf(k) < 0) f[k] = nueva[k];
        });
        f.version += 1;
        f.updated_at = ahora();
        avisarCambio(tabla, f);
        return copiar(f);
      });
      anotar(200);
      return cumplir(route, 200, salen);
    }
    return cumplir(route, 200, []);
  };
}

/* ── un aparato ──────────────────────────────────────────────── */
const sesion = {
  access_token: 'e30.e30.x', refresh_token: 'r', expires_at: Math.floor(Date.now() / 1000) + 3600,
  uid: UID, nombre: 'Prof. Prueba', rol: 'docente',
};

async function aparato(nav, nombre) {
  const yo = { nombre, sinSenal: false, errores: [] };
  const ctx = await nav.newContext({ viewport: { width: 820, height: 1000 }, serviceWorkers: 'allow' });
  yo.ctx = ctx;
  await ctx.route('**/*supabase.co/**', baseDe(yo));
  await ctx.route(/fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com/,
    r => r.fulfill({ status: 200, contentType: 'text/css', body: '/* de mentira */' }));
  await ctx.routeWebSocket(/supabase\.co/, ws => {
    const s = { ws, aparato: yo, temas: new Map() };
    sockets.add(s);
    ws.onMessage(texto => {
      let m;
      try { m = JSON.parse(String(texto)); } catch (_) { return; }
      const responder = (response) => ws.send(JSON.stringify({ topic: m.topic, event: 'phx_reply',
        payload: { status: 'ok', response: response || {} }, ref: m.ref, join_ref: m.join_ref }));
      if (m.event === 'heartbeat' || m.event === 'phx_leave' || m.event === 'access_token') return responder({});
      if (m.event === 'phx_join') {
        const pedidos = (m.payload && m.payload.config && m.payload.config.postgres_changes) || [];
        if (!pedidos.length) return responder({});
        const conId = pedidos.map((f, i) => Object.assign({ id: 7000 + i }, f));
        s.temas.set(m.topic, conId.map(x => x.id));
        return responder({ postgres_changes: conId });
      }
    });
    ws.onClose(() => sockets.delete(s));
  });
  const pg = await ctx.newPage();
  yo.pg = pg;
  pg.on('pageerror', e => yo.errores.push(String(e)));
  await pg.addInitScript(s => {
    localStorage.setItem('sb-uljjgrikyigdrkbikcxo-auth-token', JSON.stringify(s));
    localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({ codigo: 'SONDA' }));
  }, sesion);
  await pg.goto(BASE + '/index.html', { waitUntil: 'load', timeout: 60000 });
  await pg.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30000 });
  await alDia(yo);
  return yo;
}

async function cerrar(...aparatos) {
  for (const a of aparatos) { try { await a.ctx.close(); } catch (_) { /* ya cerrado */ } }
  sockets.clear();
}

async function alDia(yo) {
  return yo.pg.evaluate(async uid => {
    const api = await window.MetasDatos.iniciar();
    await window.MetasDatos._tiempoReal.ponerseAlDia(uid);
    return !!api;
  }, UID);
}

async function esperarCola(yo, ms) {
  return yo.pg.evaluate(async espera => {
    const api = await window.MetasDatos.iniciar();
    return Promise.race([
      api.esperarCola().then(() => 'lista'),
      new Promise(r => setTimeout(() => r('espera'), espera)),
    ]);
  }, ms || 15000);
}

async function senal(yo, hay) {
  yo.sinSenal = !hay;
  await yo.ctx.setOffline(!hay);
  if (hay) {
    // Como en el teléfono: vuelve la señal y la app se pone al día sola.
    await yo.pg.evaluate(() => window.dispatchEvent(new Event('online')));
  }
}

async function estado(yo) {
  return yo.pg.evaluate(async () => {
    const api = await window.MetasDatos.iniciar();
    return {
      centros: api.lista('centros').map(c => ({ id: c.id, nombre: c.nombre, direccion: c.direccion, director: c.director })),
      aulas: api.lista('aulas').map(a => ({ id: a.id, centro_id: a.centro_id, escuela: a.escuela })),
      noAnotado: api.noAnotado(),
      preguntas: api.preguntas(),
      pendientes: api.pendientes(),
      cola: window.MetasDatos._almacen.cola().map(o => ({ tipo: o.tipo, tabla: o.tabla, id: o.id, cambios: o.cambios })),
      tarjetas: window.MetasDatos._almacen.noAnotado().map(t => ({ clave: t.clave, veces: t.veces, texto: t.texto })),
      dePreguntas: window.MetasDatos._almacen.preguntas().map(p => ({ tipo: p.tipo, datos: p.datos })),
    };
  });
}

async function abrirPerfil(yo, nuevo) {
  await yo.pg.evaluate(async () => {
    window.metasMiAula.irA('perfil');
    await window.metasMiAula.abrir();
  });
  await yo.pg.waitForSelector('#mi-aula [data-form="centro"]', { timeout: 10000 });
  if (nuevo) {
    await yo.pg.click('#mi-aula [data-metas="agregar-perfil"]');
    await yo.pg.waitForSelector('#mi-aula [data-form="centro"][data-centro-id=""]', { timeout: 10000 });
  }
}

const centrosEnBase = () => (tablas.centros || []).filter(c => !c.deleted_at);
const escriturasDe = (tabla, metodo) => escrituras.filter(e => e.tabla === tabla && (!metodo || e.metodo === metodo));
const contarPalabras = t => String(t || '').replace(/\(\d+ veces\)/, '').trim().split(/\s+/).filter(Boolean).length;

// g) en todo momento: a lo sumo una tarjeta 23505 y una pregunta de
// nombre ocupado por fila, en cada aparato.
const todasLasTarjetas = [];
function anotarTarjetas(nombre, e) {
  e.tarjetas.forEach(t => todasLasTarjetas.push(Object.assign({ aparato: nombre }, t)));
  const porFila = {};
  e.dePreguntas.filter(p => p.tipo === 'nombre_ocupado').forEach(p => {
    const k = nombre + '|' + (p.datos && p.datos.centro);
    porFila[k] = (porFila[k] || 0) + 1;
  });
  Object.keys(porFila).forEach(k => {
    if (porFila[k] > 1) ok(false, 'una sola pregunta de nombre ocupado por centro (' + k + ')', porFila);
  });
}

/* ════════════════════════════════════════════════════════════ */
async function escenarioA(nav) {
  console.log('\na · Escribir letra por letra un centro cuyo nombre ya existe');
  const C1 = 'c1aaaaaa-0000-4000-8000-000000000001';
  const C2 = 'c2aaaaaa-0000-4000-8000-000000000002';
  sembrar({
    centros: [centro(C1, 'María Consuelo'), centro(C2, 'Escuela Rural')],
    aulas: [aula('a1aaaaaa-0000-4000-8000-000000000001', C1, 'María Consuelo'),
      aula('a2aaaaaa-0000-4000-8000-000000000002', C2, 'Escuela Rural', { grado: 5 })],
  });
  const A = await aparato(nav, 'A');

  // a1 · Centro nuevo, letra por letra, con una pausa de más de 1,5 s a media palabra.
  await abrirPerfil(A, true);
  const nombre = A.pg.locator('#mi-aula [data-centro="nombre"]');
  await nombre.click();
  await nombre.pressSequentially('mar', { delay: 70 });
  await dormir(1800);
  await nombre.pressSequentially('ia consuelo', { delay: 70 });
  await dormir(1900);
  ok(escriturasDe('centros', 'POST').length === 0, 'mientras se escribe no se crea ningún centro (ni con «m», ni con «mar»)',
    escriturasDe('centros'));
  const aviso = await A.pg.locator('#mi-aula [data-metas="ya-existe"]').innerText().catch(() => '');
  ok(/Ya tienes María Consuelo\. ¿Abrirlo\?/.test(aviso), 'avisa «Ya tienes María Consuelo. ¿Abrirlo?»', aviso);
  await A.pg.click('#mi-aula [data-metas="guardar-perfil"]');
  await dormir(500);
  ok(escriturasDe('centros', 'POST').length === 0 && centrosEnBase().length === 2,
    '«Guardar perfil» con un nombre repetido no crea otro centro', centrosEnBase().map(c => c.nombre));
  await A.pg.click('#mi-aula [data-metas="abrir-centro"]');
  await A.pg.waitForSelector('#mi-aula [data-form="centro"][data-centro-id="' + C1 + '"]', { timeout: 5000 }).catch(() => null);
  const abierto = await A.pg.evaluate(() => ({
    id: document.querySelector('#mi-aula [data-form="centro"]').getAttribute('data-centro-id'),
    nombre: document.querySelector('#mi-aula [data-centro="nombre"]').value,
    grupos: (document.querySelector('#mi-aula [data-metas="grupos-del-centro"]') || {}).textContent || '',
  }));
  ok(abierto.id === C1 && abierto.nombre === 'María Consuelo', '«Abrirlo» abre el centro que ya existía', abierto);
  ok(/ⓘ\s*Este centro tiene 1 grupo/.test(abierto.grupos), 'el centro con grupos lo dice con ⓘ: «Este centro tiene 1 grupo»', abierto.grupos);

  // a2 · Un centro que ya existe, renombrado letra por letra al nombre de otro.
  await A.pg.click('#mi-aula [data-valor="' + C2 + '"]');
  await A.pg.waitForSelector('#mi-aula [data-form="centro"][data-centro-id="' + C2 + '"]', { timeout: 5000 });
  const antes = escriturasDe('centros').length;
  const n2 = A.pg.locator('#mi-aula [data-centro="nombre"]');
  await n2.click();
  await n2.fill('');
  await n2.pressSequentially('Maria Consuelo', { delay: 60 });
  await A.pg.locator('#mi-aula [data-centro="director"]').fill('Prof. Ana');
  await dormir(2000);
  await esperarCola(A);
  const a2 = await estado(A);
  const c2 = centrosEnBase().find(c => c.id === C2);
  ok(c2.nombre === 'Escuela Rural' && c2.director === 'Prof. Ana',
    'el nombre repetido no se manda y lo demás del perfil sí se guarda', c2);
  ok(escriturasDe('centros').length - antes <= 2, 'el perfil se guardó una o dos veces, no una vez por letra',
    escriturasDe('centros').slice(antes));
  ok(!rechazos.length && !a2.noAnotado.length, 'no hubo ningún rechazo ni tarjeta', { rechazos, noAnotado: a2.noAnotado });
  const est = await A.pg.locator('#mi-aula [data-metas="perfil-estado"]').innerText().catch(() => '');
  ok(est === 'Perfil guardado ✓', 'al guardar se ve «Perfil guardado ✓»', est);
  const aulaC2 = (tablas.aulas || []).find(a => a.centro_id === C2);
  ok(aulaC2.escuela === 'Escuela Rural', 'los grupos no se renombraron letra por letra', aulaC2);

  // a3 · La pestaña vieja: sin señal, una edición por letra con la fila entera.
  await A.pg.evaluate(() => { const el = document.activeElement; if (el && el.blur) el.blur(); });
  await senal(A, false);
  await A.pg.evaluate(({ id }) => {
    const M = window.MetasDatos;
    const palabra = 'Maria Consuelo';
    let antes = 'Escuela Rural';
    for (let i = 1; i <= palabra.length; i++) {
      const n = palabra.slice(0, i);
      if (n.trim() === antes.trim()) continue;
      const fila = { nombre: n, direccion: null, aldea: null, municipio: null, departamento: null, codigo_sace: null,
        director: 'Prof. Ana', anio_lectivo: 2026, modalidad: null, jornada: null, logo: null, logo_sec: null, docente: null };
      const base = Object.assign({}, fila, { nombre: antes });
      M._cola.encolar({ tipo: 'editar', tabla: 'centros', id, base_version: 2, base, cambios: fila });
      antes = n;
    }
  }, { id: C2 });
  const enCola = (await estado(A)).cola.filter(o => o.id === C2).length;
  const parches = escriturasDe('centros', 'PATCH').length;
  await senal(A, true);
  await esperarCola(A);
  await dormir(400);
  const a3 = await estado(A);
  ok(enCola >= 10, 'la pestaña vieja dejó una edición por letra en la cola (' + enCola + ')');
  ok(escriturasDe('centros', 'PATCH').length - parches <= 3, 'las ediciones seguidas del mismo centro salen juntas',
    escriturasDe('centros', 'PATCH').slice(parches));
  ok(a3.noAnotado.length === 0, 'ninguna tarjeta «no quedó anotado» por letra', a3.noAnotado);
  const preg = a3.preguntas.filter(p => /Ya hay otro centro llamado María Consuelo\. ¿Unirlos o cambiar nombre\?/.test(p.texto));
  ok(a3.preguntas.length === 1 && preg.length === 1, 'una sola pregunta: «Ya hay otro centro llamado María Consuelo. ¿Unirlos o cambiar nombre?»', a3.preguntas);
  ok(centrosEnBase().find(c => c.id === C2).nombre === 'Escuela Rural', 'el centro sigue con su nombre mientras no se responde');
  anotarTarjetas('A', a3);
  if (preg[0]) {
    const unir = await A.pg.locator('#ma-tarjeta [data-valor="unir"]');
    await unir.click();
    await esperarCola(A);
    const aulaMovida = (tablas.aulas || []).find(a => a.id === 'a2aaaaaa-0000-4000-8000-000000000002');
    ok(aulaMovida.centro_id === C1 && aulaMovida.escuela === 'María Consuelo',
      '«Unirlos» pasa los grupos al centro que ya tenía ese nombre', aulaMovida);
    ok(centrosEnBase().length === 2, 'y no borra ningún centro', centrosEnBase().map(c => c.nombre));
  }
  const fin = await estado(A);
  anotarTarjetas('A', fin);
  ok(!A.errores.length, 'sin errores de página', A.errores.slice(0, 3));
  await cerrar(A);
}

async function escenarioB(nav) {
  console.log('\nb · A renombra mientras B tiene ediciones viejas en cola');
  const C1 = 'c1bbbbbb-0000-4000-8000-000000000001';
  sembrar({
    centros: [centro(C1, 'Escuela Vieja')],
    aulas: [aula('a1bbbbbb-0000-4000-8000-000000000001', C1, 'Escuela Vieja')],
  });
  const A = await aparato(nav, 'A');
  const B = await aparato(nav, 'B');
  await senal(B, false);
  // B, sin señal: una edición como las de antes (la fila entera, con el
  // nombre que veía) y otra hecha hoy por datos.editar con la fila entera.
  const deB = await B.pg.evaluate(async ({ id }) => {
    const M = window.MetasDatos;
    const api = await M.iniciar();
    const fila = { nombre: 'Escuela Vieja', direccion: 'Calle 5', aldea: null, municipio: null, departamento: null,
      codigo_sace: null, director: null, anio_lectivo: 2026, modalidad: null, jornada: null, logo: null, logo_sec: null, docente: null };
    const base = Object.assign({}, fila, { direccion: null });
    M._cola.encolar({ tipo: 'editar', tabla: 'centros', id, base_version: 1, base, cambios: fila });
    api.editar('centros', id, Object.assign({}, fila, { director: 'Prof. Ana' }));
    return M._almacen.cola().filter(o => o.id === id).map(o => Object.keys(o.cambios));
  }, { id: C1 });
  ok(deB.length === 2 && deB[1].indexOf('nombre') < 0 && deB[1].join() === 'director',
    'datos.editar manda solo lo que cambió (sin el nombre)', deB);

  await abrirPerfil(A, false);
  const n = A.pg.locator('#mi-aula [data-centro="nombre"]');
  await n.click();
  await n.fill('');
  await n.pressSequentially('Escuela Nueva', { delay: 50 });
  await n.blur();
  await esperarCola(A);
  ok(centrosEnBase()[0].nombre === 'Escuela Nueva', 'A renombró el centro', centrosEnBase()[0]);

  await senal(B, true);
  const como = await esperarCola(B);
  await dormir(300);
  const eb = await estado(B);
  const c = centrosEnBase()[0];
  ok(como === 'lista', 'la cola de B sale entera al volver la señal', como);
  ok(c.nombre === 'Escuela Nueva', 'B no revive el nombre viejo', c);
  ok(c.direccion === 'Calle 5' && c.director === 'Prof. Ana', 'lo que B sí cambió llega a la base', c);
  ok(eb.centros[0] && eb.centros[0].nombre === 'Escuela Nueva', 'B ve el nombre nuevo', eb.centros);
  ok(!eb.noAnotado.length && !eb.preguntas.length && !rechazos.length, 'sin tarjetas, preguntas ni rechazos', eb);
  anotarTarjetas('B', eb);
  ok(!A.errores.length && !B.errores.length, 'sin errores de página', A.errores.concat(B.errores).slice(0, 3));
  await cerrar(A, B);
}

async function escenarioC(nav) {
  console.log('\nc · A y B crean «María Consuelo» a la vez');
  const AU = 'a1cccccc-0000-4000-8000-000000000001';
  sembrar({ centros: [], aulas: [aula(AU, null, 'Mi escuela')] });
  const A = await aparato(nav, 'A');
  const B = await aparato(nav, 'B');
  await senal(A, false);
  await senal(B, false);
  for (const [yo, nombre] of [[A, 'María Consuelo'], [B, 'Maria  Consuelo']]) {
    await abrirPerfil(yo, false);
    const n = yo.pg.locator('#mi-aula [data-centro="nombre"]');
    await n.click();
    await n.fill('');
    await n.pressSequentially(nombre, { delay: 30 });
    await yo.pg.click('#mi-aula [data-metas="guardar-perfil"]');
    await dormir(300);
  }
  const est = await B.pg.locator('#mi-aula [data-metas="perfil-estado"]').innerText().catch(() => '');
  ok(est === 'Guardado en este aparato. Se subirá cuando haya señal.' && contarPalabras(est) <= 12,
    'sin señal dice «Guardado en este aparato. Se subirá cuando haya señal.»', est);
  await Promise.all([senal(A, true), senal(B, true)]);
  await Promise.all([esperarCola(A), esperarCola(B)]);
  await alDia(A);
  await alDia(B);
  const ea = await estado(A);
  const eb = await estado(B);
  ok(centrosEnBase().length === 1, 'en la base queda un solo centro', centrosEnBase().map(c => c.nombre));
  ok(ea.centros.length === 1 && eb.centros.length === 1 && ea.centros[0].id === eb.centros[0].id,
    'los dos aparatos ven el mismo y único centro', { A: ea.centros, B: eb.centros });
  const au = (tablas.aulas || []).find(a => a.id === AU);
  ok(au && centrosEnBase()[0] && au.centro_id === centrosEnBase()[0].id, 'el grupo quedó en ese centro', au);
  ok(!ea.noAnotado.length && !eb.noAnotado.length, 'sin tarjetas «no quedó anotado»', { A: ea.noAnotado, B: eb.noAnotado });
  anotarTarjetas('A', ea);
  anotarTarjetas('B', eb);
  ok(!A.errores.length && !B.errores.length, 'sin errores de página', A.errores.concat(B.errores).slice(0, 3));
  await cerrar(A, B);
}

async function escenarioD(nav) {
  console.log('\nd · Dos centros se intercambian el nombre');
  const C1 = 'c1dddddd-0000-4000-8000-000000000001';
  const C2 = 'c2dddddd-0000-4000-8000-000000000002';
  sembrar({ centros: [centro(C1, 'Centro Uno'), centro(C2, 'Centro Dos')], aulas: [] });
  const A = await aparato(nav, 'A');
  const B = await aparato(nav, 'B');
  await senal(A, false);
  await A.pg.evaluate(async ({ c1, c2 }) => {
    const api = await window.MetasDatos.iniciar();
    api.editar('centros', c1, { nombre: 'Centro Dos' });
    api.editar('centros', c2, { nombre: 'Centro Uno' });
  }, { c1: C1, c2: C2 });
  await senal(A, true);
  await esperarCola(A);
  await dormir(500);
  const uno = centrosEnBase().find(c => c.id === C1);
  const dos = centrosEnBase().find(c => c.id === C2);
  ok(uno.nombre === 'Centro Dos' && dos.nombre === 'Centro Uno', 'en la base quedaron intercambiados', [uno, dos]);
  const ea = await estado(A);
  const eb = await estado(B);
  ok(!ea.noAnotado.length && !ea.preguntas.length, 'A no tiene tarjetas ni preguntas', ea);
  const verB = id => (eb.centros.find(c => c.id === id) || {}).nombre;
  ok(verB(C1) === 'Centro Dos' && verB(C2) === 'Centro Uno', 'B los ve intercambiados', eb.centros);
  anotarTarjetas('A', ea);
  await cerrar(A, B);
}

async function escenarioE(nav) {
  console.log('\ne · B ve el cambio de A sin recargar');
  const C1 = 'c1eeeeee-0000-4000-8000-000000000001';
  sembrar({ centros: [centro(C1, 'Escuela Vieja')], aulas: [aula('a1eeeeee-0000-4000-8000-000000000001', C1, 'Escuela Vieja')] });
  const A = await aparato(nav, 'A');
  const B = await aparato(nav, 'B');
  await abrirPerfil(A, false);
  await abrirPerfil(B, false);
  await B.pg.evaluate(() => { window.__sinRecargar = 'sigue'; const el = document.activeElement; if (el && el.blur) el.blur(); });
  const n = A.pg.locator('#mi-aula [data-centro="nombre"]');
  await n.click();
  await n.fill('');
  await n.pressSequentially('Escuela Nueva', { delay: 40 });
  await A.pg.locator('#mi-aula [data-centro="director"]').fill('Prof. Ana');
  await A.pg.click('#mi-aula [data-metas="guardar-perfil"]');
  await esperarCola(A);
  const visto = await B.pg.waitForFunction(() => {
    const n = document.querySelector('#mi-aula [data-centro="nombre"]');
    const d = document.querySelector('#mi-aula [data-centro="director"]');
    const seg = Array.from(document.querySelectorAll('#mi-aula [data-accion="institucion"]')).map(b => b.textContent);
    return n && d && n.value === 'Escuela Nueva' && d.value === 'Prof. Ana' && seg.some(t => /Escuela Nueva/.test(t))
      ? { nombre: n.value, director: d.value, seg } : null;
  }, null, { timeout: 8000 }).then(h => h.jsonValue()).catch(() => null);
  const sigue = await B.pg.evaluate(() => window.__sinRecargar);
  ok(!!visto, 'la pantalla del perfil de B muestra el nombre y el director nuevos', visto);
  ok(sigue === 'sigue', 'sin recargar la página de B');
  const grupoB = await B.pg.evaluate(async () => (await window.MetasDatos.iniciar()).lista('aulas').map(a => a.escuela));
  ok(grupoB[0] === 'Escuela Nueva', 'el grupo de B lleva el nombre nuevo', grupoB);
  ok(!A.errores.length && !B.errores.length, 'sin errores de página', A.errores.concat(B.errores).slice(0, 3));
  await cerrar(A, B);
}

async function escenarioF(nav) {
  console.log('\nf · Un service worker viejo se actualiza con la pestaña abierta');
  for (const viejo of SW_VIEJOS) {
    sembrar({ centros: [centro('c1ffffff-0000-4000-8000-000000000001', 'Escuela F')], aulas: [] });
    swServido = viejo.texto;
    const cacheVieja = (/const CACHE_NAME = '([^']+)'/.exec(viejo.texto) || [])[1];
    const yo = { nombre: 'F', sinSenal: false, errores: [] };
    const ctx = await nav.newContext({ viewport: { width: 820, height: 1000 }, serviceWorkers: 'allow' });
    await ctx.route('**/*supabase.co/**', baseDe(yo));
    await ctx.route(/fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com/,
      r => r.fulfill({ status: 200, contentType: 'text/css', body: '/* de mentira */' }));
    await ctx.routeWebSocket(/supabase\.co/, ws => { try { ws.close(); } catch (_) {} });
    const pg = await ctx.newPage();
    pg.on('pageerror', e => yo.errores.push(String(e)));
    await pg.goto(BASE + '/index.html', { waitUntil: 'load', timeout: 60000 });
    await pg.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30000 });
    // La tablet abrió la aplicación con el viejo ya instalado y la dejó abierta.
    await pg.reload({ waitUntil: 'load' });
    await pg.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30000 });
    // Que el viejo alcance a guardar una lectura de la base, como hacía.
    await pg.evaluate(async origen => {
      await fetch(origen + '/rest/v1/centros?select=*', { headers: { apikey: 'x', 'accept-profile': 'metas' } }).catch(() => null);
      await new Promise(r => setTimeout(r, 400));
    }, ORIGEN);
    const antes = await pg.evaluate(async () => ({ caches: await caches.keys() }));
    ok(antes.caches.indexOf(cacheVieja) >= 0, viejo.nombre + ': manda el service worker viejo (' + cacheVieja + ')', antes);
    // Se publica el de hoy. La pestaña sigue abierta: al volver a ella, busca.
    swServido = SW_HOY;
    await pg.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    const aviso = await pg.waitForSelector('#version-nueva:not([hidden])', { timeout: 30000 }).then(() => true).catch(() => false);
    const texto = await pg.locator('#version-nueva').innerText().catch(() => '');
    ok(aviso && /Hay una versión nueva/.test(texto), viejo.nombre + ': la pestaña abierta avisa «Hay una versión nueva»', texto);
    // El viejo puede terminar algo que ya tenía pedido y volver a guardarlo:
    // el de hoy hace una segunda pasada en la primera petición pasados 3 s.
    await dormir(3500);
    const despues = await pg.evaluate(async () => {
      await fetch('/index.html', { cache: 'no-store' }).catch(() => null);
      await new Promise(r => setTimeout(r, 600));
      const ks = await caches.keys();
      let deBase = [];
      if (ks.indexOf('meta-datos-v1') >= 0) {
        const c = await caches.open('meta-datos-v1');
        deBase = (await c.keys()).map(r => r.url).filter(u => /supabase\.co/.test(u));
      }
      return { caches: ks, deBase };
    });
    ok(despues.caches.indexOf(CACHE_HOY) >= 0 && despues.caches.indexOf(cacheVieja) < 0,
      viejo.nombre + ': el de hoy (' + CACHE_HOY + ') reemplazó al viejo', despues.caches);
    ok(!despues.deBase.length, viejo.nombre + ': no quedó ninguna lectura de la base guardada', despues.deBase);
    if (aviso) {
      await Promise.all([pg.waitForEvent('load', { timeout: 30000 }).catch(() => null), pg.click('[data-metas="version-nueva"]')]);
      await pg.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30000 }).catch(() => null);
      const tras = await pg.evaluate(() => ({
        oculto: document.getElementById('version-nueva').hidden,
        url: navigator.serviceWorker.controller && navigator.serviceWorker.controller.scriptURL,
      }));
      ok(tras.oculto && /\/sw\.js$/.test(tras.url || ''), viejo.nombre + ': un toque recarga y el aviso ya no sale', tras);
    }
    ok(!yo.errores.length, viejo.nombre + ': sin errores de página', yo.errores.slice(0, 3));
    await ctx.close();
  }
  swServido = SW_HOY;
}

async function escenarioG(nav) {
  console.log('\ng · A lo sumo una tarjeta 23505 por fila');
  const AU = 'a1gggggg-0000-4000-8000-000000000001';
  const S1 = 's1gggggg-0000-4000-8000-000000000001';
  const S2 = 's2gggggg-0000-4000-8000-000000000002';
  const t = ahora();
  const asig = (id, nombre) => ({ id, owner: UID, aula_id: AU, nombre, orden: 1, version: 1, created_at: t, updated_at: t, deleted_at: null });
  sembrar({ centros: [], aulas: [aula(AU, null, 'Escuela G')], asignaturas: [asig(S1, 'Matemáticas'), asig(S2, 'Ciencias')] });
  const A = await aparato(nav, 'A');
  await senal(A, false);
  // Dos intentos de ponerle a «Ciencias» un nombre que ya tiene otra clase,
  // separados por algo que la menciona: no se pueden juntar en uno.
  await A.pg.evaluate(async ({ s2, au }) => {
    const api = await window.MetasDatos.iniciar();
    api.editar('asignaturas', s2, { nombre: 'Matematicas' });
    api.crear('notas', { alumno_id: au, asignatura_id: s2, periodo: 'I', componente: 'final', valor: 80 });
    api.editar('asignaturas', s2, { nombre: 'matemáticas' });
  }, { s2: S2, au: AU });
  await senal(A, true);
  await esperarCola(A);
  await dormir(300);
  const e = await estado(A);
  const deS2 = e.tarjetas.filter(x => (x.clave || '').indexOf(S2) >= 0);
  ok(deS2.length === 1, 'dos rechazos de la misma clase dejan UNA tarjeta', e.tarjetas);
  ok(deS2[0] && deS2[0].veces === 2, 'la tarjeta cuenta las veces (2)', deS2);
  ok(deS2[0] && /ya tienes esa clase en este grupo/.test(deS2[0].texto),
    'la tarjeta dice la razón real: «ya tienes esa clase en este grupo»', deS2);
  ok(deS2[0] && contarPalabras(deS2[0].texto) <= 12, 'la tarjeta no pasa de doce palabras', deS2[0] && deS2[0].texto);
  const pintada = await A.pg.evaluate(async () => {
    await window.metasMiAula.abrir();
    const t = document.querySelector('#ma-tarjeta [data-metas="no-anotado"]');
    return t ? t.textContent : '';
  });
  ok(/\(2 veces\)/.test(pintada), 'en pantalla se ve el contador «(2 veces)»', pintada);
  anotarTarjetas('A', e);
  await cerrar(A);
}

(async () => {
  console.log('M.E.T.A.S · Dos aparatos, un centro: que el perfil sincronice');
  await new Promise(r => servidor.listen(PUERTO, r));
  const nav = await abrir();
  try {
    // Una escena que tropieza (un botón que no está) cuenta como fallo y
    // las demás se siguen corriendo: así se ve cuáles fallan, no solo la primera.
    for (const escena of [escenarioA, escenarioB, escenarioC, escenarioD, escenarioE, escenarioF, escenarioG]) {
      try { await escena(nav); }
      catch (e) {
        ok(false, 'la escena ' + escena.name.replace('escenario', '') + ' se pudo recorrer entera', String(e && e.message || e).split('\n')[0]);
        for (const c of nav.contexts()) { try { await c.close(); } catch (_) { /* ya cerrado */ } }
        sockets.clear();
        swServido = SW_HOY;
      }
    }

    console.log('\ng · En todos los escenarios');
    const porFila = {};
    todasLasTarjetas.filter(t => /\|23505$/.test(t.clave || '')).forEach(t => {
      porFila[t.aparato + '|' + t.clave] = (porFila[t.aparato + '|' + t.clave] || 0) + 1;
    });
    ok(Object.keys(porFila).every(k => porFila[k] === 1), 'nunca hubo dos tarjetas 23505 de la misma fila en un aparato', porFila);
    ok(todasLasTarjetas.every(t => contarPalabras(t.texto) <= 12), 'ninguna tarjeta pasa de doce palabras',
      todasLasTarjetas.map(t => t.texto));
  } finally {
    await nav.close();
    servidor.close();
  }
  console.log('\n' + '─'.repeat(52));
  if (fallos) { console.log(`✖ ${fallos} problema(s).`); process.exit(1); }
  console.log('✅ Dos aparatos y un centro: se une o se avisa, sin una tarjeta por letra.');
})().catch(e => { console.error('✘ La sonda tropezó:', e && e.stack || e); process.exit(1); });
