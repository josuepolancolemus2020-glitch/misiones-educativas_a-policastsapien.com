#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · mision.html?m=<carpeta> abre la misión o lo dice claro
   ------------------------------------------------------------
   mision.html estuvo siete meses pidiendo un archivo que no existía y
   mostrando «Cargando misión...» para siempre, sin que ninguna sonda
   lo notara. Ahora es la puerta de entrada del motor, y esto vigila
   sus tres casos:

   · carpeta que existe  → lleva a la misión, a su dirección de siempre
   · carpeta que no existe → aviso claro y un botón a index.html
   · sin carpeta           → lo mismo

   Se comprueba con TODAS las misiones, las del alumno y las del
   maestro (que tienen su propio catálogo), y no con una de
   muestra: una carpeta con espacios, tildes o mayúsculas es justo la
   que se rompe y la que nadie prueba a mano.

   Es rápida: carga los guiones de verdad de mision.html en un `vm` con
   una página de mentira. No abre navegador.

     node _dev/verifica-puerta-mision.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(RAIZ, 'mision.html'), 'utf8');

let fallos = 0;
const ok = (nombre, cond, detalle) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre);
  if (!cond) { fallos++; if (detalle) console.log(detalle); }
};

/* ── lo que la página pide ───────────────────────────────────── */
const guiones = [];
const re = /<script([^>]*)>([\s\S]*?)<\/script>/g;
let m;
while ((m = re.exec(html))) {
  const src = (/\ssrc=["']([^"']+)["']/.exec(m[1]) || [])[1];
  guiones.push(src ? { src: src.split('?')[0], sello: (/\?v=(\d+)/.exec(src) || [])[1] } : { codigo: m[2] });
}
const hojas = []; const reL = /<link[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g;
while ((m = reL.exec(html))) hojas.push(m[1].split('?')[0]);

console.log('— Lo que mision.html pide existe —');
const faltan = guiones.filter(g => g.src).map(g => g.src).concat(hojas).filter(f => !fs.existsSync(path.join(RAIZ, f)));
ok('ningún guion ni hoja de estilo que no exista', faltan.length === 0, '      falta: ' + faltan.join(', '));
ok('carga el motor', guiones.some(g => g.src === 'js/motor-misiones.js'));
ok('nada de fuera (ni CDN ni otra web)', !/(?:src|href)=["'](?:https?:)?\/\//.test(html.replace(/<!--[\s\S]*?-->/g, '')));

/* ── abrir la página con una dirección dada ──────────────────── */
function abrir(busqueda) {
  const nada = () => {};
  const clases = new Set();
  const porId = {};
  const elemento = id => porId[id] || (porId[id] = { id, textContent: '', enfocado: false, focus() { this.enfocado = true; } });
  /* Los textos y el botón de la página, tal como vienen en el HTML. */
  const texto = (/id="aviso-texto"[^>]*>([^<]*)</.exec(html) || [])[1];
  if (texto !== undefined) elemento('aviso-texto').textContent = texto;
  if (/id="aviso-boton"/.test(html)) elemento('aviso-boton');
  const destino = { reemplazo: null, href: null };
  const ventana = {
    document: {
      documentElement: { classList: { add: c => clases.add(c), remove: c => clases.delete(c), contains: c => clases.has(c) } },
      getElementById: id => porId[id] || null,
      addEventListener: nada, readyState: 'complete', querySelector: () => null, querySelectorAll: () => [],
      createElement: () => ({ style: {}, setAttribute: nada, appendChild: nada }), head: { appendChild: nada }, body: { appendChild: nada, classList: { add: nada, remove: nada, toggle: nada } }
    },
    location: {
      search: busqueda, pathname: '/mision.html',
      replace: u => { destino.reemplazo = u; },
      assign: u => { destino.href = u; },
      set href(u) { destino.href = u; }, get href() { return 'http://localhost:8123/mision.html' + busqueda; }
    },
    localStorage: { getItem: () => null, setItem: nada, removeItem: nada },
    addEventListener: nada, matchMedia: () => ({ matches: false, addEventListener: nada }),
    URLSearchParams, console: { log: nada, warn: nada, error: nada }, setTimeout: nada, clearTimeout: nada
  };
  ventana.window = ventana; ventana.self = ventana; ventana.globalThis = ventana;
  const ctx = vm.createContext(ventana);
  let error = '';
  guiones.forEach(g => {
    /* letra-maestro.js es la preferencia de tamaño de letra: no decide
       adónde se va y tiene su propia sonda. */
    if (g.src && /letra-maestro/.test(g.src)) return;
    try { vm.runInContext(g.src ? fs.readFileSync(path.join(RAIZ, g.src), 'utf8') : g.codigo, ctx, { filename: g.src || 'mision.html' }); }
    catch (e) { error = error || (g.src || 'en línea') + ': ' + e.message; }
  });
  return {
    error, destino,
    oculto: clases.has('abriendo'),
    texto: porId['aviso-texto'] ? porId['aviso-texto'].textContent : '',
    enfocado: !!(porId['aviso-boton'] && porId['aviso-boton'].enfocado),
    catalogo: vm.runInContext("typeof MISSIONS !== 'undefined' ? JSON.stringify(MISSIONS.map(function(x){return {id:x.id,url:x.url};})) : '[]'", ctx),
    /* Las del maestro: los temas de MF_AREAS que ya tienen dirección. */
    maestro: vm.runInContext("typeof MF_AREAS !== 'undefined' ? JSON.stringify([].concat.apply([], MF_AREAS.map(function(a){return a.temas.filter(function(t){return t.url;}).map(function(t){return {url:t.url};});}))) : '[]'", ctx)
  };
}

/* ── carpeta que existe ──────────────────────────────────────── */
console.log('— Carpeta que existe: abre la misión —');
const vacio = abrir('');
const delAlumno = JSON.parse(vacio.catalogo), delMaestro = JSON.parse(vacio.maestro);
ok('el catálogo del alumno carga (' + delAlumno.length + ' misiones)', delAlumno.length > 80);
ok('el del maestro también (' + delMaestro.length + ' misiones con dirección)', delMaestro.length >= 8);
/* Toda carpeta `docente-*` que exista tiene que poder abrirse: si se
   publica una misión del maestro sin ponerle `url` en su catálogo, la
   puerta diría que no existe. */
const carpetasMaestro = fs.readdirSync(path.join(RAIZ, 'misiones')).filter(c => /^docente-/.test(c));
const sinCatalogo = carpetasMaestro.filter(c => !delMaestro.some(t => t.url.split('/')[1] === c));
ok('las ' + carpetasMaestro.length + ' carpetas docente-* están en el catálogo del maestro', sinCatalogo.length === 0, '      falta: ' + sinCatalogo.join(', '));
const catalogo = delAlumno.concat(delMaestro);

const malas = [];
const carpetas = new Set();
catalogo.forEach(mi => {
  const partes = mi.url.split('/');
  const carpeta = partes[1];
  if (partes[0] !== 'misiones' || partes.length !== 3) { malas.push(mi.url + ': no es misiones/<carpeta>/<página>'); return; }
  if (carpetas.has(carpeta.toLowerCase())) malas.push(carpeta + ': dos misiones en la misma carpeta; ?m= no sabría cuál abrir');
  carpetas.add(carpeta.toLowerCase());
  const r = abrir('?m=' + encodeURIComponent(carpeta));
  if (r.error) { malas.push(carpeta + ': ' + r.error); return; }
  if (!r.destino.reemplazo) { malas.push(carpeta + ': no llevó a ninguna parte'); return; }
  if (r.destino.href) malas.push(carpeta + ': dejó la puerta en el historial (usó href y no replace)');
  /* La dirección a la que lleva, leída como la leería el navegador, tiene
     que ser la del catálogo y un archivo que existe. */
  let leida = '';
  try { leida = decodeURIComponent(new URL(r.destino.reemplazo, 'http://x/mision.html').pathname).slice(1); } catch (e) { /* queda vacía */ }
  if (leida !== mi.url) malas.push(carpeta + ': llevó a «' + r.destino.reemplazo + '» y su dirección es «' + mi.url + '»');
  else if (!fs.existsSync(path.join(RAIZ, mi.url))) malas.push(carpeta + ': su página no existe (' + mi.url + ')');
  if (!r.oculto) malas.push(carpeta + ': enseñó el aviso de error antes de entrar');
});
ok('las ' + catalogo.length + ' misiones se abren por su carpeta, en su dirección de siempre y sin pasar por el aviso',
  malas.length === 0, malas.slice(0, 12).map(x => '      ' + x).join('\n'));

const celula = abrir('?m=2y3ciclo-la-celula');
ok('?m=2y3ciclo-la-celula lleva a misiones/2y3ciclo-la-celula/la-celula.html',
  celula.destino.reemplazo === 'misiones/2y3ciclo-la-celula/la-celula.html', '      llevó a: ' + celula.destino.reemplazo);
const docente = abrir('?m=docente-metas-sace');
ok('?m=docente-metas-sace lleva a misiones/docente-metas-sace/metas-sace.html',
  docente.destino.reemplazo === 'misiones/docente-metas-sace/metas-sace.html' && docente.oculto, '      llevó a: ' + docente.destino.reemplazo);
const mayus = abrir('?m=2Y3CICLO-LA-CELULA');
ok('no falla por mayúsculas', mayus.destino.reemplazo === celula.destino.reemplazo);
const conOtros = abrir('?utm=x&m=2y3ciclo-la-celula');
ok('la encuentra aunque el enlace traiga otros datos', conOtros.destino.reemplazo === celula.destino.reemplazo && conOtros.oculto);

/* ── carpeta que no existe y sin carpeta ─────────────────────── */
const sinDestino = r => !r.destino.reemplazo && !r.destino.href;
const aviso = (nombre, busqueda, dice) => {
  const r = abrir(busqueda);
  ok(nombre + ': no lleva a ninguna parte', !r.error && sinDestino(r), '      ' + (r.error || 'llevó a ' + (r.destino.reemplazo || r.destino.href)));
  ok(nombre + ': el aviso se ve', !r.oculto);
  ok(nombre + ': dice «' + dice + '»', r.texto.includes(dice), '      dice: ' + r.texto);
  return r;
};
console.log('— Carpeta que no existe: aviso y un botón —');
aviso('?m=no-existe', '?m=no-existe', 'mal escrito');
ok('el botón queda listo para el teclado', abrir('?m=no-existe').enfocado);
/* Lo que venga en ?m= solo sirve para buscar: nunca es adónde se va. */
['?m=https://example.com', '?m=//example.com', '?m=../index.html', '?m=javascript:alert(1)', '?m=misiones/2y3ciclo-la-celula/la-celula.html']
  .forEach(b => { const r = abrir(b); ok(b + ' no manda a ningún sitio', !r.error && sinDestino(r) && !r.oculto); });

console.log('— Sin carpeta: aviso y un botón —');
aviso('sin nada', '', 'no dice qué misión abrir');
aviso('?m= vacío', '?m=', 'no dice qué misión abrir');
aviso('?m= con espacios', '?m=%20%20', 'no dice qué misión abrir');
/* El motor de abril abría por número. Los números del catálogo no son
   correlativos y hoy no se atienden: ?id=1 es un enlace sin misión. */
aviso('?id=1 (ya no se atiende)', '?id=1', 'no dice qué misión abrir');

/* ── la página: una sola acción ──────────────────────────────── */
console.log('— La página: un aviso y una sola acción —');
const cuerpo = html.slice(html.indexOf('<body'));
const enlaces = cuerpo.match(/<a\b[^>]*>/g) || [];
const botones = cuerpo.match(/<button\b/g) || [];
ok('un solo enlace y ningún otro botón', enlaces.length === 1 && botones.length === 0, '      enlaces: ' + enlaces.length + ', botones: ' + botones.length);
ok('ese enlace va a index.html', /href="index\.html"/.test(enlaces[0] || ''));
ok('el botón mide al menos 44 px de alto', (() => { const a = /\.aviso-boton\s*\{[^}]*min-height:\s*(\d+)px/.exec(html); return !!a && Number(a[1]) >= 44; })());
ok('ya no dice «Cargando»', !/Cargando/.test(cuerpo));
ok('si un guion no llega, el aviso se muestra igual',
  guiones.filter(g => g.src && !/letra-maestro/.test(g.src)).length === (cuerpo.match(/onerror="document\.documentElement\.classList\.remove\('abriendo'\)"/g) || []).length);
ok('no prohíbe ampliar la pantalla', !/user-scalable\s*=\s*no/.test(html));

/* ── el sello ────────────────────────────────────────────────── */
console.log('— Sello de versión —');
const cache = (/CACHE_NAME\s*=\s*'meta-app-v(\d+)'/.exec(fs.readFileSync(path.join(RAIZ, 'sw.js'), 'utf8')) || [])[1];
const selloMotor = (guiones.find(g => g.src === 'js/motor-misiones.js') || {}).sello;
ok('el motor va sellado y su sello no pasa del de sw.js (v' + cache + ')', !!selloMotor && Number(selloMotor) <= Number(cache), '      motor: ' + selloMotor);

console.log(fallos === 0 ? '\n✅ La puerta abre las ' + catalogo.length + ' misiones y avisa claro cuando no puede.' : '\n❌ ' + fallos + ' fallo(s).');
process.exit(fallos === 0 ? 0 : 1);
