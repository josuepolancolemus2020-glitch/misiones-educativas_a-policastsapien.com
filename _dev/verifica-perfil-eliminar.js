/* ============================================================
   M.E.T.A.S · Archivar un centro y la barrita al guardar
   ------------------------------------------------------------
   El perfil deja de borrar con una frase y pasa a archivar:
   deleted_at, nunca un DELETE. Se puede recuperar. Si el nombre
   ya está en un centro vivo, una línea y sigue archivado. La
   barrita verde sale solo en el aparato que guardó. Los avisos
   viejos que dicen «no se pudo anotar» no se pintan y no se
   borran del aparato.

   Dos aparatos y una base de prueba, como verifica-sync-dos-aparatos.
   No se toca Supabase.

   Uso:  node _dev/verifica-perfil-eliminar.js
   ============================================================ */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const PUERTO = 8126;
const BASE = `http://localhost:${PUERTO}`;
const UID = '11111111-1111-4111-8111-111111111111';
const JA = 'c1ababab-0000-4000-8000-000000000001';
const MC = 'c2ababab-0000-4000-8000-000000000002';

let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined && !bien ? '  → ' + JSON.stringify(extra).slice(0, 700) : ''));
};
const dormir = ms => new Promise(r => setTimeout(r, ms));

function normNombre(s) {
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
}

let tablas = { centros: [], aulas: [] };
let escrituras = [];
const sockets = new Set();
let reloj = Date.now();
function ahora() {
  reloj = Math.max(reloj + 1, Date.now());
  return new Date(reloj).toISOString();
}
const copiar = o => JSON.parse(JSON.stringify(o));

function filaCentro(id, nombre) {
  const t = ahora();
  return {
    id, owner: UID, nombre, anio_lectivo: 2026, direccion: null, aldea: null, municipio: null, departamento: null,
    codigo_sace: null, director: null, docente: null, modalidad: null, jornada: null, logo: null, logo_sec: null,
    version: 1, created_at: t, updated_at: t, deleted_at: null, op_creacion: null,
  };
}
function filaAula(id, centroId, escuela) {
  const t = ahora();
  return {
    id, owner: UID, centro_id: centroId, escuela, grado: 6, seccion: '1', anio_lectivo: 2026, docente_nombre: null,
    version: 1, created_at: t, updated_at: t, deleted_at: null, op_creacion: null,
  };
}

function choca(tabla, fila) {
  if (fila.deleted_at) return null;
  const otras = (tablas[tabla] || []).filter(f => f.id !== fila.id && !f.deleted_at);
  if (tabla !== 'centros') return null;
  const c = otras.find(f => f.owner === fila.owner && normNombre(f.nombre) === normNombre(fila.nombre)
    && Number(f.anio_lectivo) === Number(fila.anio_lectivo));
  return c ? 'centros_unico' : null;
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
    }
  }
  return out;
}

function avisarCambio(tabla, fila) {
  sockets.forEach(s => {
    s.temas.forEach((ids, topic) => {
      try {
        s.ws.send(JSON.stringify({
          topic, event: 'postgres_changes', ref: null,
          payload: { ids, data: { schema: 'metas', table: tabla, commit_timestamp: fila.updated_at,
            type: 'UPDATE', record: fila, old_record: { id: fila.id }, columns: [], errors: null } },
        }));
      } catch (_) { /* cerrado */ }
    });
  });
}

function cumplir(route, status, body) {
  return route.fulfill({
    status,
    headers: {
      'content-type': 'application/json', 'cache-control': 'no-store',
      'access-control-allow-origin': '*', 'access-control-allow-headers': '*',
      'access-control-allow-methods': 'GET, POST, PATCH, OPTIONS',
    },
    body: body == null ? '' : (typeof body === 'string' ? body : JSON.stringify(body)),
  });
}

function baseDe(route) {
  const req = route.request();
  const url = new URL(req.url());
  const metodo = req.method();
  if (metodo === 'OPTIONS') return cumplir(route, 204, '');
  if (url.pathname.indexOf('/auth/') >= 0) return cumplir(route, 200, {});
  if (url.pathname.indexOf('/rpc/') >= 0 || url.pathname.indexOf('/functions/') >= 0) return cumplir(route, 200, null);
  const tabla = (url.pathname.match(/\/rest\/v1\/([a-z0-9_]+)/) || [])[1];
  if (!tabla) return cumplir(route, 200, []);
  if (tabla === 'rechazos') return cumplir(route, 201, '');
  let cuerpo = null;
  try { cuerpo = JSON.parse(req.postData() || 'null'); } catch (_) { cuerpo = null; }
  const lista = tablas[tabla] = tablas[tabla] || [];
  const anotar = status => escrituras.push({ metodo, tabla, cuerpo: copiar(cuerpo), status });
  if (metodo === 'GET') return cumplir(route, 200, filtrar(lista, url.searchParams).map(copiar));
  if (metodo === 'POST') {
    const b = Array.isArray(cuerpo) ? cuerpo[0] : cuerpo;
    if (lista.some(f => f.id === b.id)) { anotar(409); return cumplir(route, 409, { code: '23505', message: 'pkey' }); }
    const t = ahora();
    const fila = Object.assign({ deleted_at: null }, b, { owner: UID, version: 1, created_at: t, updated_at: t });
    if (choca(tabla, fila)) { anotar(409); return cumplir(route, 409, { code: '23505', message: 'centros_unico' }); }
    lista.push(fila);
    avisarCambio(tabla, fila);
    anotar(201);
    return cumplir(route, 201, [copiar(fila)]);
  }
  if (metodo === 'PATCH') {
    const quien = filtrar(lista, url.searchParams);
    if (metodo === 'DELETE') { anotar(405); return cumplir(route, 405, { message: 'no delete' }); }
    for (const f of quien) {
      const nueva = Object.assign({}, f, cuerpo || {});
      if (choca(tabla, nueva)) { anotar(409); return cumplir(route, 409, { code: '23505', message: 'centros_unico' }); }
    }
    const salen = quien.map(f => {
      Object.keys(cuerpo || {}).forEach(k => {
        if (['id', 'owner', 'version', 'updated_at', 'created_at'].indexOf(k) < 0) f[k] = cuerpo[k];
      });
      f.version += 1;
      f.updated_at = ahora();
      avisarCambio(tabla, f);
      return copiar(f);
    });
    anotar(200);
    return cumplir(route, 200, salen);
  }
  if (metodo === 'DELETE') { anotar(405); return cumplir(route, 405, { message: 'no delete' }); }
  return cumplir(route, 200, []);
}

const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json' };
const servidor = http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel === '/') rel = '/index.html';
  const archivo = path.join(RAIZ, rel);
  if (!archivo.startsWith(RAIZ) || !fs.existsSync(archivo) || fs.statSync(archivo).isDirectory()) {
    res.writeHead(404); return res.end();
  }
  const cuerpo = fs.readFileSync(archivo);
  const etiqueta = '"' + crypto.createHash('sha1').update(cuerpo).digest('hex').slice(0, 16) + '"';
  const cab = { 'Cache-Control': 'no-cache', 'ETag': etiqueta, 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' };
  if (req.headers['if-none-match'] === etiqueta) { res.writeHead(304, cab); return res.end(); }
  res.writeHead(200, cab);
  res.end(cuerpo);
});

const sesion = {
  access_token: 'e30.e30.x', refresh_token: 'r', expires_at: Math.floor(Date.now() / 1000) + 3600,
  uid: UID, nombre: 'Prof. Prueba', rol: 'docente',
};

async function aparato(nav, nombre) {
  const ctx = await nav.newContext({ viewport: { width: 390, height: 844 }, serviceWorkers: 'allow' });
  await ctx.route('**/*supabase.co/**', baseDe);
  await ctx.route(/fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com/, r => r.fulfill({ status: 200, contentType: 'text/css', body: '/* de mentira */' }));
  await ctx.routeWebSocket(/supabase\.co/, ws => {
    const s = { ws, temas: new Map() };
    sockets.add(s);
    ws.onMessage(texto => {
      let m;
      try { m = JSON.parse(String(texto)); } catch (_) { return; }
      const responder = response => ws.send(JSON.stringify({ topic: m.topic, event: 'phx_reply',
        payload: { status: 'ok', response: response || {} }, ref: m.ref, join_ref: m.join_ref }));
      if (m.event === 'heartbeat' || m.event === 'phx_leave' || m.event === 'access_token') return responder({});
      if (m.event === 'phx_join') {
        const pedidos = (m.payload && m.payload.config && m.payload.config.postgres_changes) || [];
        if (!pedidos.length) return responder({});
        const conId = pedidos.map((f, i) => Object.assign({ id: 8000 + i }, f));
        s.temas.set(m.topic, conId.map(x => x.id));
        return responder({ postgres_changes: conId });
      }
    });
    ws.onClose(() => sockets.delete(s));
  });
  const pg = await ctx.newPage();
  const errores = [];
  pg.on('pageerror', e => errores.push(String(e)));
  await pg.addInitScript(s => {
    localStorage.setItem('sb-uljjgrikyigdrkbikcxo-auth-token', JSON.stringify(s));
    localStorage.setItem('METAS_DOCENTE_V1', JSON.stringify({ codigo: 'SONDA' }));
  }, sesion);
  await pg.goto(BASE + '/index.html', { waitUntil: 'load', timeout: 60000 });
  await pg.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 30000 });
  await pg.evaluate(async uid => {
    await window.MetasDatos.iniciar();
    await window.MetasDatos._tiempoReal.ponerseAlDia(uid);
  }, UID);
  return { nombre, ctx, pg, errores };
}

async function perfil(yo) {
  await yo.pg.evaluate(async () => {
    window.metasMiAula.irA('perfil');
    await window.metasMiAula.abrir();
  });
  await yo.pg.waitForSelector('#mi-aula [data-form="centro"]', { timeout: 10000 });
}

async function esperarCola(yo) {
  await yo.pg.evaluate(async () => {
    const api = await window.MetasDatos.iniciar();
    await Promise.race([api.esperarCola(), new Promise(r => setTimeout(r, 12000))]);
  });
}

function centrosVivos() { return (tablas.centros || []).filter(c => !c.deleted_at); }
function centroDe(id) { return (tablas.centros || []).find(c => c.id === id); }

(async () => {
  await new Promise(r => servidor.listen(PUERTO, r));
  const nav = await abrir();
  tablas = {
    centros: [filaCentro(JA, 'John Arnold'), filaCentro(MC, 'María Consuelo')],
    aulas: [filaAula('a1ababab-0000-4000-8000-000000000001', MC, 'María Consuelo')],
  };
  const A = await aparato(nav, 'A');
  const B = await aparato(nav, 'B');
  await perfil(A);
  await perfil(B);

  await A.pg.click('#mi-aula [data-metas="guardar-perfil"]');
  const barra = await A.pg.locator('#mi-aula [data-metas="perfil-estado"]').evaluate(el => ({
    label: el.getAttribute('aria-label'),
    texto: (el.innerText || '').replace(/\s+/g, ' ').trim(),
    oculto: !!el.hidden,
    altoLinea: el.querySelector('.ma-barra-ok-linea') ? Math.round(el.querySelector('.ma-barra-ok-linea').getBoundingClientRect().height) : 0,
  }));
  ok(!barra.oculto && barra.label === 'Perfil guardado' && barra.texto === '✓' && barra.altoLinea <= 6,
    'en A, al guardar, barrita con ✓ y sin texto', barra);
  const frases = await A.pg.locator('#mi-aula').innerText();
  ok(!/Perfil guardado ✓|Guardado en la nube|Actualizado desde otro aparato/.test(frases), 'A no dice las frases que se quitaron');
  const barB0 = await B.pg.locator('#mi-aula [data-metas="perfil-estado"]').evaluate(el => !!(el.hidden || el.hasAttribute('hidden'))).catch(() => true);
  ok(barB0, 'B no muestra la barrita');

  await A.pg.click('#mi-aula [data-valor="' + MC + '"]');
  await A.pg.click('#mi-aula [data-metas="archivar-centro"]');
  const grupos = await A.pg.locator('#mi-aula [data-metas="aviso-archivar-grupos"]').innerText();
  ok(/Primero pasa su grupo a otro centro/.test(grupos), 'con grupos no deja archivar', grupos);
  ok(await A.pg.locator('#mi-aula [data-metas="si-archivar"]').count() === 0, 'no aparece «Sí, archivar» si hay grupos');

  await A.pg.click('#mi-aula [data-valor="' + JA + '"]');
  await A.pg.click('#mi-aula [data-metas="archivar-centro"]');
  const preg = await A.pg.locator('#mi-aula [data-metas="confirmar-archivar"]').innerText();
  ok(/¿Archivar John Arnold\? Puedes recuperarlo luego\./.test(preg), 'la pregunta queda en el formulario', preg);
  ok(await A.pg.locator('#mi-aula [role="dialog"]').count() === 0, 'sin ventana emergente');
  await A.pg.click('#mi-aula [data-metas="si-archivar"]');
  await esperarCola(A);
  await dormir(600);
  const enA = await A.pg.locator('#mi-aula [data-accion="institucion"]').allInnerTexts();
  ok(!enA.some(t => /John Arnold/.test(t)), 'John Arnold sale de los centros de A', enA);
  ok(/María Consuelo/.test((await A.pg.locator('#mi-aula [data-accion="institucion"][aria-pressed="true"]').innerText())),
    'queda activo el otro centro');
  const chip = await A.pg.locator('#mi-aula [data-metas="archivados"]').innerText();
  ok(chip.trim() === 'Archivados (1)', 'el chip cuenta el archivado', chip);
  const tomb = centroDe(JA);
  ok(tomb && tomb.deleted_at && !escrituras.some(e => e.metodo === 'DELETE'), 'borrado suave: deleted_at y ningún DELETE', tomb && tomb.deleted_at);
  await B.pg.waitForFunction(id => {
    return !Array.from(document.querySelectorAll('#mi-aula [data-accion="institucion"]')).some(b => b.getAttribute('data-valor') === id);
  }, JA, { timeout: 8000 }).catch(() => null);
  const enB = await B.pg.locator('#mi-aula [data-accion="institucion"]').allInnerTexts();
  ok(!enB.some(t => /John Arnold/.test(t)), 'en B el centro archivado desaparece', enB);

  await A.pg.click('#mi-aula [data-metas="archivados"]');
  await A.pg.click('#mi-aula [data-metas="recuperar-centro"]');
  await esperarCola(A);
  await dormir(600);
  ok(centroDe(JA) && centroDe(JA).deleted_at == null, 'recuperar deja deleted_at vacío');
  const volvio = await A.pg.locator('#mi-aula [data-accion="institucion"]').allInnerTexts();
  ok(volvio.some(t => /John Arnold/.test(t)), 'John Arnold vuelve a los centros', volvio);
  ok(await A.pg.locator('#mi-aula [data-metas="archivados"]').count() === 0, 'sin archivados, el chip no está');
  await B.pg.waitForFunction(id => {
    return Array.from(document.querySelectorAll('#mi-aula [data-accion="institucion"]')).some(b => b.getAttribute('data-valor') === id);
  }, JA, { timeout: 8000 }).catch(() => null);
  const enB2 = await B.pg.locator('#mi-aula [data-accion="institucion"]').allInnerTexts();
  ok(enB2.some(t => /John Arnold/.test(t)), 'B también lo ve recuperado', enB2);
  const barB2 = await B.pg.locator('#mi-aula [data-metas="perfil-estado"]').evaluate(el => !!(el.hidden || el.hasAttribute('hidden'))).catch(() => true);
  ok(barB2, 'al llegar el cambio, B sigue sin barrita');

  await A.pg.click('#mi-aula [data-valor="' + JA + '"]');
  await A.pg.click('#mi-aula [data-metas="archivar-centro"]');
  await A.pg.click('#mi-aula [data-metas="si-archivar"]');
  await esperarCola(A);
  await A.pg.click('#mi-aula [data-metas="agregar-perfil"]');
  await A.pg.fill('#mi-aula [data-centro="nombre"]', 'John Arnold');
  await A.pg.click('#mi-aula [data-metas="guardar-perfil"]');
  await esperarCola(A);
  ok(centrosVivos().filter(c => normNombre(c.nombre) === 'john arnold').length === 1, 'se puede crear otro con el mismo nombre');
  await A.pg.click('#mi-aula [data-metas="archivados"]');
  await A.pg.click('#mi-aula [data-metas="recuperar-centro"]');
  const linea = await A.pg.locator('#mi-aula [data-metas="choque-archivo"]').innerText();
  ok(linea.trim() === 'Ya tienes John Arnold.', 'si el nombre choca, una línea', linea);
  ok(centroDe(JA) && centroDe(JA).deleted_at, 'el archivado sigue archivado');
  ok(await A.pg.locator('#mi-aula [data-metas="archivados"]').innerText().then(t => t.trim()) === 'Archivados (1)', 'el chip sigue en 1');

  await A.pg.click('#mi-aula [data-metas="archivar-centro"]');
  await A.pg.click('#mi-aula [data-metas="si-archivar"]');
  await esperarCola(A);
  await A.pg.click('#mi-aula [data-metas="archivar-centro"]');
  const ultimo = await A.pg.locator('#mi-aula [data-metas="aviso-archivar-ultimo"]').innerText();
  ok(/No se puede archivar el último centro/.test(ultimo), 'el último centro no se archiva', ultimo);

  await A.pg.evaluate(uid => {
    const alm = window.MetasDatos._almacen;
    alm.ponerNoAnotado({ id: 'viejo-1', owner: uid, texto: 'Este cambio no quedó anotado: no se pudo anotar.', veces: 1 });
    alm.ponerNoAnotado({ id: 'viejo-2', owner: uid, texto: 'El centro no quedó anotado: no se pudo anotar.', veces: 4 });
    alm.ponerNoAnotado({ id: 'nuevo-1', owner: uid, clave: uid + '|centros|x|23505',
      texto: 'El centro no quedó anotado: ya tienes otro centro con ese nombre.', veces: 1 });
  }, UID);
  await A.pg.evaluate(async () => { await window.metasMiAula.abrir(); });
  const tarjeta = await A.pg.locator('#ma-tarjeta').innerText();
  ok(!/no se pudo anotar/.test(tarjeta), 'los avisos viejos genéricos no se pintan', tarjeta);
  ok(/ya tienes otro centro con ese nombre/.test(tarjeta), 'el aviso nuevo sí sale, con su motivo', tarjeta);
  const guardados = await A.pg.evaluate(() => window.MetasDatos._almacen.noAnotado().map(t => t.id));
  ok(guardados.indexOf('viejo-1') >= 0 && guardados.indexOf('viejo-2') >= 0 && guardados.indexOf('nuevo-1') >= 0,
    'los avisos viejos siguen guardados', guardados);

  ok(!A.errores.length && !B.errores.length, 'sin errores de página', A.errores.concat(B.errores).slice(0, 4));
  await A.ctx.close();
  await B.ctx.close();
  await nav.close();
  servidor.close();
  if (fallos) { console.log('\n' + fallos + ' fallos'); process.exit(1); }
  console.log('\nverde');
})().catch(e => { console.error(e); process.exit(1); });
