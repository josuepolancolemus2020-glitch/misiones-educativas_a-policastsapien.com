/* ============================================================
   M.E.T.A.S · El service worker no guarda la base
   ------------------------------------------------------------
   Desde el sello v548, la rama de «otro dominio» de sw.js servía
   primero lo guardado y metía en meta-datos-v1 los GET a
   *.supabase.co. La cola releía esa fila vieja, perdía los cinco
   reintentos y la primera operación trababa la cola entera. El
   otro aparato no veía el cambio, porque la marca de tiempo nunca
   avanzaba. Y al cerrar sesión esas filas se quedaban en el aparato.

   Esta sonda no abre el navegador: lee los archivos y corre el
   service worker y la conexión con la base en un entorno de
   mentira, con un fetch de verdad (el de Node) disparado a mano.

   Entra en npm test porque vive en _dev/ y no pide el navegador.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
function ok(bien, txt, extra) {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined && !bien ? '  → ' + JSON.stringify(extra) : ''));
}

/* ── caché de mentira, la misma forma que la del navegador ───── */
function cachésDeMentira() {
  const stores = new Map();
  function abrir(nombre) {
    if (!stores.has(nombre)) stores.set(nombre, new Map());
    const map = stores.get(nombre);
    return {
      put(req, res) {
        const url = typeof req === 'string' ? req : req.url;
        map.set(url, res);
        return Promise.resolve();
      },
      match(req) {
        const url = typeof req === 'string' ? req : req.url;
        return Promise.resolve(map.get(url));
      },
      keys() {
        return Promise.resolve([...map.keys()].map(u => new Request(u)));
      },
      delete(req) {
        const url = typeof req === 'string' ? req : req.url;
        return Promise.resolve(map.delete(url));
      },
      _urls() { return [...map.keys()]; },
    };
  }
  return {
    open(nombre) { return Promise.resolve(abrir(nombre)); },
    keys() { return Promise.resolve([...stores.keys()]); },
    delete(nombre) { return Promise.resolve(stores.delete(nombre)); },
    match(req) {
      const url = typeof req === 'string' ? req : req.url;
      for (const map of stores.values()) {
        if (map.has(url)) return Promise.resolve(map.get(url));
      }
      return Promise.resolve(undefined);
    },
    _tienda: stores,
    _abrir: abrir,
  };
}

function cajaBase() {
  const caja = {
    console, setTimeout, clearTimeout, URL, Request, Response, Headers,
    Promise, Date, AbortController, encodeURIComponent, decodeURIComponent,
    Math, JSON, Object, Array, String, Error, Map, Set, RegExp, parseInt, isNaN,
  };
  vm.createContext(caja);
  return caja;
}

(async () => {
  console.log('M.E.T.A.S · El service worker no guarda la base');

  console.log('\n1 · El archivo, leído');
  const swTxt = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
  const desdeFetch = swTxt.slice(swTxt.indexOf("self.addEventListener('fetch'"));
  const guarda = desdeFetch.indexOf('hostDeSupabase(url.hostname)');
  const match = desdeFetch.indexOf('caches.match(event.request)');
  ok(guarda > 0 && (match < 0 || guarda < match),
    'un host *.supabase.co se aparta antes de caches.match');
  ok(/event\.request\.method !== 'GET'/.test(desdeFetch.slice(0, match < 0 ? undefined : match)),
    'lo que no es GET también se aparta antes de la caché');
  ok(/headers\.has\('authorization'\)/.test(desdeFetch.slice(0, match < 0 ? undefined : match)),
    'lo que lleva la sesión se aparta antes de la caché');
  ok(/purgarLecturasDeLaBase/.test(swTxt) && /CACHE_DATOS/.test(swTxt.slice(swTxt.indexOf('function purgarLecturasDeLaBase'), swTxt.indexOf('function purgarLecturasDeLaBase') + 600)),
    'al activar, la purga abre solo meta-datos (CACHE_DATOS)');
  const nubeTxt = fs.readFileSync(path.join(RAIZ, 'js/datos/nube.js'), 'utf8');
  const llamar = nubeTxt.slice(nubeTxt.indexOf('async function llamar'), nubeTxt.indexOf('async function llamar') + 700);
  ok(/cache\s*=\s*'no-store'/.test(llamar), 'llamar() pide la base con cache no-store');

  console.log('\n2 · Un fetch simulado: la base no llama a respondWith');
  const cachés = cachésDeMentira();
  const oyentes = {};
  const sw = cajaBase();
  sw.self = sw;
  sw.location = new URL('http://127.0.0.1:8123/sw.js');
  sw.caches = cachés;
  sw.fetch = () => Promise.resolve(new Response('ok', { status: 200, headers: { 'content-type': 'text/plain' } }));
  sw.addEventListener = (tipo, fn) => { (oyentes[tipo] = oyentes[tipo] || []).push(fn); };
  sw.skipWaiting = () => {};
  sw.clients = { claim: () => Promise.resolve() };
  vm.runInContext(swTxt, sw, { filename: 'sw.js' });

  function disparar(tipo, extra) {
    const esperas = [];
    let respondio = false;
    const event = Object.assign({
      waitUntil(p) { esperas.push(Promise.resolve(p)); },
      respondWith(p) { respondio = true; esperas.push(Promise.resolve(p)); },
    }, extra || {});
    (oyentes[tipo] || []).forEach(fn => fn(event));
    return { respondio, listo: Promise.all(esperas) };
  }
  function pedir(url, init) {
    return disparar('fetch', { request: new Request(url, init) });
  }

  const base = pedir('https://uljjgrikyigdrkbikcxo.supabase.co/rest/v1/observaciones?select=*');
  ok(!base.respondio, 'GET a supabase.co no llama a respondWith');
  const sub = pedir('https://proyecto.supabase.co/auth/v1/user');
  ok(!sub.respondio, 'un subdominio de supabase.co tampoco');
  const post = pedir('https://cdn.jsdelivr.net/npm/three/build/three.min.js', { method: 'POST' });
  ok(!post.respondio, 'un POST, aunque no sea la base, no llama a respondWith');
  const conSesion = pedir('https://cdn.jsdelivr.net/npm/three/build/three.min.js', {
    headers: { authorization: 'Bearer secreto' },
  });
  ok(!conSesion.respondio, 'un GET con authorization no llama a respondWith');
  const yt = pedir('https://www.youtube.com/embed/abc');
  ok(!yt.respondio, 'YouTube sigue igual: lo atiende el navegador');
  const turno = pedir('https://challenges.cloudflare.com/turnstile/v0/api.js');
  ok(!turno.respondio, 'Turnstile sigue igual');

  const motor = pedir('https://cdn.jsdelivr.net/npm/three/build/three.min.js');
  ok(motor.respondio, 'un GET externo sin sesión sí se guarda (el motor de los juegos 3D)');
  await motor.listo;
  const local = pedir('http://127.0.0.1:8123/js/app.js?v=1');
  ok(local.respondio, 'un archivo de la aplicación sigue pasando por el service worker');
  await local.listo;
  const ajeno = pedir('https://evilsupabase.co/rest/v1/alumnos?select=*');
  ok(ajeno.respondio, 'un host que solo se parece a supabase.co no se aparta');
  await ajeno.listo;

  console.log('\n3 · Al activar se borran solo las lecturas de la base');
  const datos = await cachés.open('meta-datos-v1');
  await datos.put('https://uljjgrikyigdrkbikcxo.supabase.co/rest/v1/alumnos?select=*',
    new Response('[{"nombre":"Ana"}]', { status: 200 }));
  await datos.put('https://xyz.supabase.co/rest/v1/notas?select=*',
    new Response('[]', { status: 200 }));
  await datos.put('http://127.0.0.1:8123/misiones/prueba/mision.html',
    new Response('<h1>misión</h1>', { status: 200, headers: { 'content-type': 'text/html' } }));
  const otro = await cachés.open('archivo-del-alumno');
  await otro.put('https://uljjgrikyigdrkbikcxo.supabase.co/rest/v1/no-tocar',
    new Response('se queda', { status: 200 }));
  await otro.put('http://127.0.0.1:8123/js/app.js', new Response('app', { status: 200 }));
  const viejo = await cachés.open('meta-app-v1');
  await viejo.put('http://127.0.0.1:8123/index.html', new Response('viejo', { status: 200 }));

  const act = disparar('activate');
  await act.listo;
  const nombres = await cachés.keys();
  const urlsDatos = (await (await cachés.open('meta-datos-v1')).keys()).map(r => r.url);
  const urlsOtro = (await (await cachés.open('archivo-del-alumno')).keys()).map(r => r.url);
  const esBase = u => { try { return /(^|\.)supabase\.co$/i.test(new URL(u).hostname); } catch (e) { return false; } };
  ok(nombres.indexOf('meta-app-v1') < 0, 'el armazón viejo se sigue borrando', nombres);
  ok(!urlsDatos.some(esBase),
    'de meta-datos-v1 salen las entradas cuyo host es *.supabase.co', urlsDatos);
  ok(urlsDatos.some(u => u.indexOf('/misiones/prueba/mision.html') >= 0),
    'la misión que el alumno ya tenía sigue en meta-datos-v1', urlsDatos);
  ok(urlsOtro.some(u => /supabase\.co/.test(u)) && urlsOtro.some(u => u.indexOf('/js/app.js') >= 0),
    'ningún otro caché se toca, aunque tenga una dirección de la base', urlsOtro);

  console.log('\n4 · La conexión con la base pide no-store');
  const llamadas = [];
  const nav = cajaBase();
  nav.window = nav;
  nav.location = { hostname: 'metas.policastsapien.com' };
  nav.crypto = require('crypto').webcrypto;
  nav.localStorage = {
    m: new Map(),
    getItem(k) { return this.m.has(k) ? this.m.get(k) : null; },
    setItem(k, v) { this.m.set(k, String(v)); },
    removeItem(k) { this.m.delete(k); },
  };
  nav.fetch = (url, op) => {
    llamadas.push({ url: String(url), cache: op && op.cache, method: op && op.method, authorization: op && op.headers && op.headers.authorization });
    return Promise.resolve(new Response('[]', { status: 200, headers: { 'content-type': 'application/json' } }));
  };
  const uid = '11111111-1111-4111-8111-111111111111';
  nav.localStorage.setItem('sb-uljjgrikyigdrkbikcxo-auth-token', JSON.stringify({
    access_token: 'e30.e30.x', refresh_token: 'r',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    uid: uid, nombre: 'Prof. Prueba', rol: 'docente',
  }));
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/datos/ids.js'), 'utf8'), nav, { filename: 'js/datos/ids.js' });
  vm.runInContext(nubeTxt, nav, { filename: 'js/datos/nube.js' });
  nav.MetasDatos._nube.retomar();
  const leido = await nav.MetasDatos._nube.leer('observaciones?select=*');
  ok(Array.isArray(leido), 'la lectura simulada contestó');
  ok(llamadas.length === 1 && llamadas[0].cache === 'no-store',
    'el fetch de la lectura lleva cache no-store', llamadas);
  ok(llamadas[0] && llamadas[0].method === 'GET' && /supabase\.co/.test(llamadas[0].url)
    && typeof llamadas[0].authorization === 'string' && llamadas[0].authorization.indexOf('Bearer ') === 0,
    'sigue siendo un GET a la base, con la sesión', llamadas[0]);

  console.log('\n5 · Cerrar sesión olvida esas lecturas y nada más');
  const alm = cajaBase();
  alm.window = alm;
  alm.caches = cachésDeMentira();
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/datos/almacen.js'), 'utf8'), alm, { filename: 'js/datos/almacen.js' });
  const cDatos = await alm.caches.open('meta-datos-v1');
  await cDatos.put('https://uljjgrikyigdrkbikcxo.supabase.co/rest/v1/alumnos?select=*',
    new Response('[{"nombre":"Ana"}]', { status: 200 }));
  await cDatos.put('http://127.0.0.1:8123/misiones/prueba/mision.html',
    new Response('<h1>misión</h1>', { status: 200 }));
  const cOtro = await alm.caches.open('archivo-del-alumno');
  await cOtro.put('https://uljjgrikyigdrkbikcxo.supabase.co/rest/v1/no-tocar',
    new Response('se queda', { status: 200 }));
  alm.MetasDatos._almacen.olvidarCuenta(uid);
  let urlsOlvido = [];
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 0));
    urlsOlvido = (await (await alm.caches.open('meta-datos-v1')).keys()).map(r => r.url);
    if (!urlsOlvido.some(u => /supabase\.co/.test(u))) break;
  }
  const urlsAjeno = (await (await alm.caches.open('archivo-del-alumno')).keys()).map(r => r.url);
  ok(!urlsOlvido.some(u => /supabase\.co/.test(u)),
    'olvidarCuenta quita de meta-datos-v1 las lecturas de la base', urlsOlvido);
  ok(urlsOlvido.some(u => u.indexOf('/misiones/prueba/mision.html') >= 0),
    'y deja la misión guardada', urlsOlvido);
  ok(urlsAjeno.some(u => /supabase\.co/.test(u)),
    'no abre ningún otro caché', urlsAjeno);

  console.log('\n' + (fallos ? `✘ ${fallos} comprobaciones fallaron` : '✅ La base no se guarda en el aparato.'));
  process.exit(fallos ? 1 : 0);
})().catch(e => {
  console.error('✘ La sonda tropezó:', e && e.stack || e);
  process.exit(1);
});
