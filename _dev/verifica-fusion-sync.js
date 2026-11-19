/* ============================================================
   M.E.T.A.S · Lo que anota un aparato lo ve el otro
   ------------------------------------------------------------
   Esta sonda comprobaba el espejo viejo (window.dsSync, de
   js/metas-docente-sync.js). Ese archivo ya no se carga: la
   portada lo dice, y lo que el maestro anota hoy viaja por
   filas (js/datos/). Esperar dsSync la dejaba en rojo sin
   llegar a mirar la sincronización.

   Lo que se comprueba ahora, con el service worker ENCENDIDO
   (serviceWorkers: 'allow'), que es como está en la tablet:

     la tablet lee una fila;
     en su caché queda plantada la copia vieja, que es lo que
     el service worker de v548 servía sin volver a la base;
     la PC cambia esa fila;
     la tablet la vuelve a leer y tiene que ver la versión nueva.

   Si el service worker siguiera contestando con lo guardado,
   la tablet vería «COPIA VIEJA DEL CACHE» y la marca de tiempo
   no avanzaría. La base de mentira vive en esta sonda: no se
   escribe nada en Supabase.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-fusion-sync.js
   ============================================================ */
'use strict';

const { abrir } = require('./lib-navegador');
const BASE = 'http://localhost:8123';
const UID = '11111111-1111-4111-8111-111111111111';
const FILA = '22222222-2222-4222-8222-222222222222';
const T1 = '2026-11-19T03:00:00.000Z';
const ORIGEN = 'https://uljjgrikyigdrkbikcxo.supabase.co';

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};

const filas = {
  observaciones: [{
    id: FILA, owner: UID, texto: 'La de antes', version: 1,
    updated_at: T1, created_at: T1, deleted_at: null,
  }],
};
const trafico = [];
let contarLecturas = false;
let lecturas = 0;

function copiar(o) {
  return JSON.parse(JSON.stringify(o));
}

function cumplir(route, status, body, tipo) {
  const cab = {
    'content-type': tipo || 'application/json',
    'cache-control': 'no-store',
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
  };
  return route.fulfill({
    status: status,
    headers: cab,
    body: body == null ? '' : (typeof body === 'string' ? body : JSON.stringify(body)),
  });
}

/* La base de mentira: guarda la fila y sube la versión en cada
   edición, como hace la de verdad. Lo demás contesta vacío para que
   «ponerse al día» pueda recorrer sus tablas sin trabarse. */
async function baseDeMentira(route) {
  const req = route.request();
  const url = new URL(req.url());
  const metodo = req.method();
  if (trafico.length < 80) trafico.push(metodo + ' ' + url.pathname + url.search.slice(0, 80));
  if (metodo === 'OPTIONS') return cumplir(route, 204, '', 'text/plain');
  if (url.pathname.indexOf('/auth/') >= 0) return cumplir(route, 200, {});
  if (url.pathname.indexOf('/functions/') >= 0) return cumplir(route, 401, { ok: false });
  if (url.pathname.indexOf('/rpc/blob_leer') >= 0) return cumplir(route, 200, []);
  if (url.pathname.indexOf('/rpc/blob_guardar') >= 0) return cumplir(route, 200, 0);
  if (url.pathname.indexOf('/rpc/') >= 0) return cumplir(route, 200, null);
  const tabla = (url.pathname.match(/\/rest\/v1\/([a-z0-9_]+)/) || [])[1];
  if (!tabla) return cumplir(route, 200, []);
  if (!filas[tabla]) filas[tabla] = [];
  const lista = filas[tabla];

  if (metodo === 'GET') {
    if (tabla === 'observaciones' && contarLecturas) lecturas++;
    let out = lista.filter(f => !f.deleted_at);
    const idEq = /(?:^|[?&])id=eq\.([^&]+)/.exec(url.search);
    if (idEq) out = out.filter(f => f.id === decodeURIComponent(idEq[1]));
    const inn = /id=in\.\(([^)]*)\)/.exec(url.search);
    if (inn) {
      const ids = inn[1].split(',').filter(Boolean).map(s => decodeURIComponent(s));
      out = out.filter(f => ids.indexOf(f.id) >= 0);
    }
    const gte = /updated_at=gte\.([^&]+)/.exec(url.search);
    if (gte) {
      const t = decodeURIComponent(gte[1]).replace(/^"|"$/g, '');
      out = out.filter(f => String(f.updated_at) >= t);
    }
    return cumplir(route, 200, out.map(copiar));
  }

  if (metodo === 'PATCH') {
    let body = {};
    try { body = JSON.parse(req.postData() || '{}'); } catch (_) { body = {}; }
    const id = ((/(?:^|[?&])id=eq\.([^&]+)/.exec(url.search) || [])[1] || '');
    const ver = ((/(?:^|[?&])version=eq\.([^&]+)/.exec(url.search) || [])[1] || '');
    const row = lista.filter(f => f.id === decodeURIComponent(id) && String(f.version) === decodeURIComponent(ver) && !f.deleted_at)[0];
    if (!row) return cumplir(route, 200, []);
    Object.keys(body).forEach(k => {
      if (k !== 'id' && k !== 'version' && k !== 'updated_at') row[k] = body[k];
    });
    row.version = row.version + 1;
    row.updated_at = new Date().toISOString();
    return cumplir(route, 200, [copiar(row)]);
  }
  return cumplir(route, 200, []);
}

const sesion = {
  access_token: 'e30.e30.x',
  refresh_token: 'r',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  uid: UID,
  nombre: 'Prof. Prueba',
  rol: 'docente',
};

async function aparato(nav, nombre) {
  const ctx = await nav.newContext({
    viewport: { width: 800, height: 900 },
    serviceWorkers: 'allow',
  });
  await ctx.route('**/*supabase.co/**', baseDeMentira);
  if (typeof ctx.routeWebSocket === 'function') {
    try { await ctx.routeWebSocket(/supabase\.co/, ws => { try { ws.close(); } catch (_) {} }); }
    catch (_) { /* sin esto el aviso en vivo no conecta, y la prueba no lo necesita */ }
  }
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('pageerror', e => errores.push(String(e)));
  await pg.addInitScript(s => {
    localStorage.setItem('sb-uljjgrikyigdrkbikcxo-auth-token', JSON.stringify(s));
  }, sesion);
  await pg.goto(BASE + '/index.html', { waitUntil: 'load', timeout: 60000 });
  await pg.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30000 });
  return { ctx, pg, nombre, errores };
}

/* Pone al día y devuelve lo que el aparato guarda de la fila. */
async function ponerseAlDia(pg) {
  return pg.evaluate(async ({ id, uid }) => {
    const M = window.MetasDatos;
    if (!M || typeof M.iniciar !== 'function') return { ok: false, porque: 'sin MetasDatos' };
    try { await M.iniciar(); }
    catch (e) { return { ok: false, porque: 'iniciar: ' + String(e && e.message || e) }; }
    if (!M._nube.uid()) return { ok: false, porque: 'sin sesión' };
    try { await M._tiempoReal.ponerseAlDia(uid); }
    catch (e) { return { ok: false, porque: 'ponerse al día: ' + String(e && e.message || e) }; }
    const f = M._almacen.fila(uid, 'observaciones', id);
    return {
      ok: true,
      sw: !!navigator.serviceWorker.controller,
      version: f ? f.version : null,
      texto: f ? f.texto : null,
      cursor: M._almacen.meta('cursor|' + uid + '|observaciones') || null,
    };
  }, { id: FILA, uid: UID });
}

/* Deja en la caché del aparato la fila vieja, en las direcciones que
   la cola y el tiempo real vuelven a pedir. Con el fallo, la próxima
   lectura sale de aquí y no de la base. */
async function plantarCopiaVieja(pg) {
  return pg.evaluate(async ({ id, uid, origen, t1 }) => {
    const M = window.MetasDatos;
    const cache = await caches.open('meta-datos-v1');
    const base = origen + '/rest/v1/observaciones';
    const vieja = JSON.stringify([{
      id: id, owner: uid, texto: 'COPIA VIEJA DEL CACHE', version: 1,
      updated_at: t1, created_at: t1, deleted_at: null,
    }]);
    const cab = { 'content-type': 'application/json' };
    const urls = [
      base + '?id=eq.' + id + '&select=*',
      base + '?select=*&deleted_at=is.null&order=updated_at.asc,id.asc&limit=1000',
    ];
    const cursor = M._almacen.meta('cursor|' + uid + '|observaciones');
    if (cursor) {
      const desde = new Date(Date.parse(cursor) - 120000).toISOString();
      urls.push(base + '?select=*&updated_at=gte.' + encodeURIComponent(desde)
        + '&order=updated_at.asc,id.asc&limit=1000');
    }
    for (let i = 0; i < urls.length; i++) {
      await cache.put(urls[i], new Response(vieja, { status: 200, headers: cab }));
    }
    return { urls: urls, cursor: cursor };
  }, { id: FILA, uid: UID, origen: ORIGEN, t1: T1 });
}

(async () => {
  console.log('M.E.T.A.S · Lo que anota un aparato lo ve el otro');
  const nav = await abrir();
  console.log('\n1 · Dos aparatos, con el service worker mandando');
  const tablet = await aparato(nav, 'tablet');
  const pc = await aparato(nav, 'pc');
  const t0 = await ponerseAlDia(tablet.pg);
  const p0 = await ponerseAlDia(pc.pg);
  ok('la tablet tiene el service worker', t0.sw === true, t0);
  ok('la PC tiene el service worker', p0.sw === true, p0);
  ok('las dos leen la fila de antes (versión 1)',
    t0.ok && p0.ok && t0.version === 1 && p0.version === 1 && t0.texto === 'La de antes' && p0.texto === 'La de antes',
    { tablet: t0, pc: p0 });

  console.log('\n2 · En la tablet queda la copia vieja, y la PC edita');
  const plantada = await plantarCopiaVieja(tablet.pg);
  ok('la copia vieja quedó en la caché de la tablet', plantada.urls.length >= 2, plantada);
  const edicion = await pc.pg.evaluate(async (id) => {
    const api = await window.MetasDatos.iniciar();
    api.editar('observaciones', id, { texto: 'La de ahora' });
    const como = await Promise.race([
      api.esperarCola().then(() => 'lista'),
      new Promise(ok => setTimeout(() => ok('espera'), 8000)),
    ]);
    return { como: como, pendientes: api.pendientes(), noAnotado: api.noAnotado() };
  }, FILA);
  ok('la edición de la PC sube (la cola no se queda trabada)',
    edicion.como === 'lista' && edicion.pendientes === 0, edicion);
  ok('la base quedó en la versión 2',
    filas.observaciones[0].version === 2 && filas.observaciones[0].texto === 'La de ahora',
    filas.observaciones[0]);

  console.log('\n3 · La tablet relee y ve la versión nueva');
  lecturas = 0;
  contarLecturas = true;
  const re = await tablet.pg.evaluate(async ({ id, uid }) => {
    const M = window.MetasDatos;
    const porId = await M._nube.leer('observaciones?id=eq.' + id + '&select=*');
    await M._tiempoReal.ponerseAlDia(uid);
    const f = M._almacen.fila(uid, 'observaciones', id);
    return {
      leida: porId[0] ? { version: porId[0].version, texto: porId[0].texto } : null,
      guardada: f ? { version: f.version, texto: f.texto, updated_at: f.updated_at } : null,
    };
  }, { id: FILA, uid: UID });
  ok('la relectura salió a la base y no a la caché', lecturas > 0, { lecturas: lecturas, trafico: trafico.slice(-15) });
  ok('la lectura por id trae la versión 2',
    !!re.leida && re.leida.version === 2 && re.leida.texto === 'La de ahora', re.leida);
  ok('ponerse al día guarda esa versión, no la copia vieja',
    !!re.guardada && re.guardada.version === 2 && re.guardada.texto === 'La de ahora'
      && re.guardada.updated_at !== T1,
    re.guardada);
  if (fallos && (tablet.errores.length || pc.errores.length)) {
    console.log('  errores de página:', JSON.stringify({ tablet: tablet.errores.slice(0, 3), pc: pc.errores.slice(0, 3) }));
  }

  await tablet.ctx.close();
  await pc.ctx.close();
  await nav.close();
  console.log('\n' + '─'.repeat(52));
  if (fallos) { console.log(`✖ ${fallos} problema(s).`); process.exit(1); }
  console.log('✅ La tablet, con el service worker, ve lo que la PC acaba de anotar.');
})().catch(e => { console.error('✘ La sonda tropezó:', e && e.stack || e); process.exit(1); });
