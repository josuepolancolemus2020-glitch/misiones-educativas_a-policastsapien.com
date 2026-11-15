/* ============================================================
   M.E.T.A.S · Que la aplicación instalada no se quede trabada al abrir
   ------------------------------------------------------------
   El 15 de noviembre de 2026 una tablet con la aplicación instalada
   desde abril se quedó en la pantalla de inicio (el logo con el nombre
   viejo, «M.E.T.A. Misiones Educativas») y nunca pasó a la portada. Esa
   pantalla dura hasta que llega el primer HTML, así que el HTML no llegó.

   Ninguna sonda podía verlo: Playwright abre cada página con un perfil
   limpio, sin el service worker que el teléfono lleva meses arrastrando,
   y la red de la prueba nunca se cuelga. Esta sonda hace las dos cosas:

     1. Instala la aplicación con un sw.js VIEJO (los de _dev/sw-viejos/,
        sacados del historial de git: el CI clona sin historia, por eso
        van copiados), la visita, y LUEGO publica el sw.js de hoy.
     2. Vuelve a abrir con tres redes: normal, lenta (2,5 s antes de
        contestar cada cosa) y colgada (ninguna petición contesta nunca,
        que es lo que hace la señal mala: no falla, se queda esperando).

   «Abrió» quiere decir que la portada se pintó (.valor-card a la vista)
   y que se puede usar (tocar ☰ abre el menú). Se mide el tiempo.

   Lo que NO se puede arreglar desde aquí, y la sonda lo deja escrito en
   vez de esconderlo: con un service worker viejo que espera a la red sin
   reloj y la red colgada, la primera apertura se queda trabada, porque
   el sw.js nuevo tiene que llegar por esa misma red. Lo que sí se exige
   es que UNA apertura con algo de señal baste para que el de hoy mande,
   y que desde entonces la red colgada ya no trabe nada.

   El servidor es propio (puerto 8124) para poder colgarlo y para servir
   el sw.js que toque sin tocar el archivo del repositorio. Contesta con
   `Cache-Control: no-cache`: todo se revalida, como un teléfono que abre
   la aplicación días después, cuando la caché del navegador ya no vale.

   Uso:  node _dev/verifica-arranque-sw.js
         (no necesita el servidor de 8123: levanta el suyo)
   ============================================================ */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const PUERTO = 8124;
const BASE = `http://localhost:${PUERTO}`;
const RETRASO_LENTO = 2500;
/* Cuánto se le da a una apertura antes de darla por trabada. La página sin
   señal sale a los 10 s (PLAZO_PAGINA); 30 s es el triple y algo más. */
const TOPE_APERTURA = 30000;

const SW_HOY = fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8');
const VIEJOS = [
  ['v13 · jun 2026 (igual al de abril)', 'sw-v13-2026-06.js'],
  ['v145 · ago 2026', 'sw-v145-2026-08.js'],
  ['v435 · oct 2026', 'sw-v435-2026-10.js'],
  ['v535 · antes del PR 11', 'sw-v535-antes-pr11.js'],
  ['v537 · main hasta hoy', 'sw-v537-main.js']
].map(([nombre, f]) => ({ nombre, texto: fs.readFileSync(path.join(__dirname, 'sw-viejos', f), 'utf8') }));

let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined && !bien ? '  → ' + JSON.stringify(extra) : ''));
};
const filas = [];

/* ── el servidor que se puede colgar ─────────────────────────── */
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg'
};
let modo = 'normal';
let swServido = SW_HOY;
const colgadas = new Set();

function servir(req, res) {
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
}

const servidor = http.createServer((req, res) => {
  if (modo === 'colgado') { colgadas.add(res); return; }           // no contesta NUNCA
  if (modo === 'lento') return setTimeout(() => servir(req, res), RETRASO_LENTO);
  servir(req, res);
});
servidor.keepAliveTimeout = 1000;

/* Al terminar una medición se sueltan las colgadas para que no se queden
   esperando en la siguiente. Solo DESPUÉS de medir: soltarlas antes sería
   darle a la página un «falló la red» que la señal colgada no da. */
function soltarColgadas() {
  for (const r of colgadas) { try { r.socket && r.socket.destroy(); } catch (_) {} }
  colgadas.clear();
}

/* ── el navegador ────────────────────────────────────────────── */
async function contextoNuevo(nav) {
  const ctx = await nav.newContext({
    viewport: { width: 800, height: 1280 }, isMobile: true, hasTouch: true,
    serviceWorkers: 'allow'
  });
  /* Supabase no entra en esta prueba. Las CSS de Google Fonts y del CDN las
     precacheaban los service workers viejos con addAll: si no contestan, la
     instalación entera falla y no habría service worker viejo que probar. */
  await ctx.route('**/*.supabase.co/**', r => r.abort());
  await ctx.route(/fonts\.googleapis\.com|fonts\.gstatic\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com/,
    r => r.fulfill({ status: 200, contentType: 'text/css', body: '/* de mentira */' }));
  return ctx;
}

async function esperarControl(pag) {
  await pag.evaluate(() => navigator.serviceWorker.ready);
  await pag.waitForFunction(() => !!navigator.serviceWorker.controller, null, { timeout: 15000 });
}

/* Un teléfono que vuelve a abrir la aplicación días después no tiene el
   service worker despierto: se le apaga para que arranque desde cero. */
async function apagarServiceWorkers(ctx) {
  const pag = ctx.pages()[0] || await ctx.newPage();
  const cdp = await ctx.newCDPSession(pag);
  await cdp.send('ServiceWorker.enable');
  await cdp.send('ServiceWorker.stopAllWorkers');
  await cdp.detach();
}

async function cerrarPaginas(ctx) {
  for (const p of ctx.pages()) await p.close().catch(() => {});
}

/* Abrir la aplicación como la abre el icono (start_url) y cronometrar hasta
   que se puede usar. Devuelve { ms, abrio, sinSenal }. */
async function abrirYMedir(ctx, direccion) {
  const pag = await ctx.newPage();
  const t0 = Date.now();
  const resto = () => Math.max(1, TOPE_APERTURA - (Date.now() - t0));
  let abrio = false, sinSenal = false;
  try {
    await pag.goto(direccion || `${BASE}/index.html`, { waitUntil: 'commit', timeout: TOPE_APERTURA });
    await pag.waitForFunction(() => {
      if (document.getElementById('reintentar')) return true;
      const v = document.querySelector('.valor-card');
      return !!(v && v.getBoundingClientRect().height > 0 && typeof switchView === 'function');
    }, null, { timeout: resto(), polling: 100 });
    sinSenal = await pag.evaluate(() => !!document.getElementById('reintentar'));
    if (!sinSenal) {
      await pag.click('#hamburger-btn', { timeout: resto() });
      await pag.waitForFunction(() => document.getElementById('app-drawer').classList.contains('open'),
        null, { timeout: resto(), polling: 100 });
      abrio = true;
    }
  } catch (_) { /* trabada: se queda en abrio=false */ }
  const ms = Date.now() - t0;
  return { pag, ms, abrio, sinSenal };
}

const seg = ms => (ms / 1000).toFixed(1).replace('.', ',') + ' s';

function anotar(caso, red, r, esperado) {
  const resultado = r.abrio ? 'abre y se usa' : r.sinSenal ? 'página «sin señal» + Reintentar' : 'TRABADA';
  filas.push({ caso, red, resultado, tiempo: r.abrio || r.sinSenal ? seg(r.ms) : `> ${seg(TOPE_APERTURA)}`, esperado });
}

/* Instalar con el service worker que se le pase, como lo instaló el teléfono:
   abrir con señal, que se registre solo (lo hace index.html), y una segunda
   visita para que guarde lo que guarda cada versión. */
async function instalar(nav, swTexto) {
  modo = 'normal';
  swServido = swTexto;
  const ctx = await contextoNuevo(nav);
  const pag = await ctx.newPage();
  await pag.goto(`${BASE}/index.html`, { waitUntil: 'load' });
  await esperarControl(pag);
  await pag.reload({ waitUntil: 'load' });
  await pag.waitForTimeout(2500);
  const nombre = await pag.evaluate(() => caches.keys());
  await cerrarPaginas(ctx);
  return { ctx, caches: nombre };
}

/* ¿Ya manda el de hoy? No basta con que exista su caché: eso pasa en cuanto
   EMPIEZA a instalarse. Manda cuando ya no hay nadie instalándose ni
   esperando y el activo está activado: entonces el viejo ya se fue. */
const HOY = (SW_HOY.match(/CACHE_NAME = '([^']+)'/) || [])[1];
function mandaElDeHoy(pag) {
  return pag.evaluate(async hoy => {
    const reg = await navigator.serviceWorker.getRegistration();
    const ks = await caches.keys();
    return !!(reg && reg.active && reg.active.state === 'activated' &&
              !reg.installing && !reg.waiting && ks.indexOf(hoy) >= 0);
  }, HOY).catch(() => false);
}

(async () => {
  await new Promise(listo => servidor.listen(PUERTO, listo));
  const nav = await abrir({ args: ['--no-sandbox'] });

  try {
    /* ── 1. De un service worker viejo al de hoy ─────────────── */
    for (const viejo of VIEJOS) {
      console.log(`\nInstalada con ${viejo.nombre}; se publica el de hoy y se vuelve a abrir`);
      for (const red of ['normal', 'lento', 'colgado']) {
        const { ctx, caches: cs } = await instalar(nav, viejo.texto);
        swServido = SW_HOY;                              // se publica el de hoy
        await apagarServiceWorkers(ctx);
        await cerrarPaginas(ctx);
        modo = red;
        const r = await abrirYMedir(ctx);
        if (red === 'colgado') { modo = 'normal'; soltarColgadas(); }
        const esperaReloj = /PLAZO_RED/.test(viejo.texto);
        if (red !== 'colgado' || esperaReloj) {
          anotar(viejo.nombre, red, r, 'abre');
          ok(r.abrio, `red ${red}: la portada se pinta y se usa (${seg(r.ms)})`, cs);
        } else {
          /* El viejo espera a la red sin reloj: aquí no hay nada que el
             servidor pueda hacer, porque no le llega nada. */
          anotar(viejo.nombre, red, r, 'trabada (sw viejo sin reloj; no se puede alcanzar)');
          console.log(`  · red colgada: ${r.abrio ? 'abrió' : 'trabada'} (${seg(r.ms)}) — el sw viejo espera sin reloj; ningún cambio del servidor le llega`);
        }

        /* Y después de esa apertura, ¿ya manda el de hoy? Con señal (normal
           o lenta) tiene que mandar, y entonces la red colgada ya no traba. */
        if (red !== 'colgado') {
          /* Con la MISMA red y la página abierta, como el maestro que la deja
             abierta un rato. La instalación del nuevo baja su armazón; con la
             red lenta tarda hasta PLAZO_INSTALA (12 s). Se le dan 30. Y luego
             unos segundos más para que guarde los guiones que la página le
             avisó que tenía (el mensaje «guardar-vistos»). */
          let manda = false;
          for (let i = 0; i < 30 && !(manda = await mandaElDeHoy(r.pag)); i++) await new Promise(l => setTimeout(l, 1000));
          if (manda) await new Promise(l => setTimeout(l, red === 'lento' ? 8000 : 3000));
          modo = 'normal';
          ok(manda, `después de abrir con red ${red}, ya manda el sw.js de hoy`);
          await apagarServiceWorkers(ctx).catch(() => {});
          await cerrarPaginas(ctx);
          modo = 'colgado';
          const r2 = await abrirYMedir(ctx);
          modo = 'normal';
          soltarColgadas();
          anotar(`${viejo.nombre} → ya actualizada (tras abrir con red ${red})`, 'colgado', r2, 'abre');
          ok(r2.abrio, `y la siguiente apertura con red colgada abre de lo guardado (${seg(r2.ms)})`);
          await r2.pag.close().catch(() => {});
        }
        await r.pag.close().catch(() => {});
        await ctx.close();
      }
    }

    /* ── 2. Con el sw.js de hoy desde el principio ───────────── */
    console.log('\nInstalada con el sw.js de hoy: visita repetida');
    for (const red of ['normal', 'lento', 'colgado']) {
      const { ctx } = await instalar(nav, SW_HOY);
      await apagarServiceWorkers(ctx);
      modo = red;
      const r = await abrirYMedir(ctx);
      modo = 'normal';
      soltarColgadas();
      anotar('sw.js de hoy, visita repetida', red, r, 'abre');
      ok(r.abrio, `red ${red}: abre desde lo guardado (${seg(r.ms)})`);
      await ctx.close();
    }

    /* ── 3. Sin copia guardada y la red colgada ──────────────── */
    console.log('\nSin copia guardada de la página y la red colgada');
    {
      const { ctx } = await instalar(nav, SW_HOY);
      /* Lo que pasa si la instalación no llegó a guardar la portada (se cortó
         la señal a medias): se borra de las dos cachés. */
      const p0 = await ctx.newPage();
      await p0.goto(`${BASE}/salida.html`, { waitUntil: 'load' });
      await p0.evaluate(async () => {
        for (const n of await caches.keys()) {
          const c = await caches.open(n);
          for (const r of await c.keys()) {
            const u = new URL(r.url);
            if (u.pathname === '/' || u.pathname === '/index.html') await c.delete(r);
          }
        }
      });
      await p0.close();
      await apagarServiceWorkers(ctx);
      modo = 'colgado';
      const r = await abrirYMedir(ctx);
      anotar('sw.js de hoy, portada sin copia guardada', 'colgado', r, 'página sin señal');
      ok(r.sinSenal, `a los ${seg(r.ms)} sale la página sin señal, no la pantalla congelada`);
      ok(r.ms < 15000, 'y sale antes de 15 s', r.ms);
      if (r.sinSenal) {
        const txt = await r.pag.evaluate(() => document.body.innerText);
        ok(/No hay señal suficiente para abrir M\.E\.T\.A\.S por primera vez/.test(txt), 'dice «No hay señal suficiente para abrir M.E.T.A.S por primera vez»', txt);
        ok(/M\.E\.T\.A\.S\./.test(txt), 'lleva el logo (M.E.T.A.S.)');
        ok(!/sin internet|sin conexión funciona|desconectad/i.test(txt), 'no promete funcionar sin internet', txt);
        const sinFuera = await r.pag.evaluate(() =>
          [...document.querySelectorAll('link[rel=stylesheet],script[src],img')].length === 0);
        ok(sinFuera, 'no pide ni una hoja, guion ni imagen: todo viene dentro de sw.js');
        const caja = await r.pag.locator('#reintentar').boundingBox();
        ok(caja && caja.height >= 44 && caja.width >= 44, 'el botón Reintentar mide al menos 44 px', caja);
        /* Vuelve la señal y se toca Reintentar: la portada abre. */
        modo = 'normal';
        soltarColgadas();
        await r.pag.click('#reintentar');
        const ya = await r.pag.waitForSelector('.valor-card', { timeout: 15000 }).then(() => true, () => false);
        ok(ya, 'al volver la señal, Reintentar abre la portada');
      }
      modo = 'normal';
      soltarColgadas();
      await r.pag.close().catch(() => {});

      /* Una misión que nunca se abrió, con la red colgada. */
      await apagarServiceWorkers(ctx);
      modo = 'colgado';
      const r2 = await abrirYMedir(ctx, `${BASE}/misiones/prebasica-tecnicas-libro1/prebasica-libro1.html`);
      modo = 'normal';
      soltarColgadas();
      anotar('sw.js de hoy, misión nunca abierta', 'colgado', r2, 'página sin señal');
      ok(r2.sinSenal && r2.ms < 15000, `una misión nunca abierta tampoco se congela: página sin señal a los ${seg(r2.ms)}`);
      await r2.pag.close().catch(() => {});

      /* El tope no puede cortar lo que SÍ está llegando: una misión que se
         abre por primera vez con la red lenta pero viva tiene que llegar
         entera, sin un solo guion ni hoja cortados por el reloj. */
      await apagarServiceWorkers(ctx);
      modo = 'lento';
      const pag = await ctx.newPage();
      const cortados = [];
      pag.on('requestfailed', q => {
        if (/^(script|stylesheet|document)$/.test(q.resourceType())) cortados.push(q.url().replace(BASE, ''));
      });
      const t0 = Date.now();
      const llego = await pag.goto(`${BASE}/misiones/2y3ciclo-que-es-un-robot/que-es-un-robot.html`,
        { waitUntil: 'load', timeout: 60000 }).then(() => true, () => false);
      const ms = Date.now() - t0;
      modo = 'normal';
      filas.push({ caso: 'sw.js de hoy, misión nunca abierta', red: 'lento', resultado: llego && !cortados.length ? 'llega entera' : 'CORTADA', tiempo: seg(ms), esperado: 'llega entera' });
      ok(llego && cortados.length === 0, `con la red lenta, una misión nueva llega entera, nada cortado por el reloj (${seg(ms)})`, cortados);
      await pag.close();
      await ctx.close();
    }
  } finally {
    await nav.close().catch(() => {});
    soltarColgadas();
    servidor.close();
  }

  console.log('\nTiempos por caso');
  const ancho = k => Math.max(k.length, ...filas.map(f => String(f[k]).length));
  const cols = ['caso', 'red', 'resultado', 'tiempo', 'esperado'];
  const w = Object.fromEntries(cols.map(k => [k, ancho(k)]));
  console.log('  ' + cols.map(k => k.padEnd(w[k])).join(' │ '));
  for (const f of filas) console.log('  ' + cols.map(k => String(f[k]).padEnd(w[k])).join(' │ '));

  console.log('\n' + (fallos
    ? `✘ ${fallos} comprobaciones fallaron`
    : '✓ Ninguna apertura se queda trabada con el sw.js de hoy'));
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); soltarColgadas(); process.exit(1); });
