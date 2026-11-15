#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · Las misiones del maestro piden cuenta
   ------------------------------------------------------------
   La portada promete que las misiones del maestro «solo las ve el
   maestro registrado». Hasta noviembre de 2026 quien lo cumplía era la
   portada, que escondía el botón: la misión, con su dirección en la
   mano, se abría sin cuenta. Ahora cada misión del maestro y cada
   ficha suya carga js/solo-docente.js. Esto vigila:

   · que TODAS lo carguen (una misión nueva hecha copiando otra lo
     hereda; una hecha de cero, no), y antes que cualquier otro guion;
   · que sin cuenta la página se tape y ofrezca un solo botón a la
     portada;
   · que con cuenta no haga NADA: ni un paso nuevo para el maestro;
   · que pregunte lo mismo que pregunta la portada.

   Es rápida: corre el guion de verdad en una página de mentira. Las
   sondas de navegador entran a estas páginas como maestro (está en
   _dev/lib-navegador.js), porque van a medir la misión, no el candado.

     node _dev/verifica-solo-docente.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
const GUION = path.join(RAIZ, 'js', 'solo-docente.js');

let fallos = 0;
const ok = (nombre, cond, detalle) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre);
  if (!cond) { fallos++; if (detalle) console.log(detalle); }
};
const lista = xs => xs.slice(0, 12).map(x => '      ' + x).join('\n');
const rel = p => path.relative(RAIZ, p).split(path.sep).join('/');

/* ── qué páginas son del maestro ─────────────────────────────── */
/* Por carpeta y por nombre, y además por el catálogo: una misión del
   maestro que no se llamara `docente-…` se escaparía de la primera lista. */
const paginas = [];
fs.readdirSync(path.join(RAIZ, 'misiones')).filter(c => /^docente-/.test(c)).sort().forEach(c => {
  fs.readdirSync(path.join(RAIZ, 'misiones', c)).filter(f => f.endsWith('.html')).forEach(f => paginas.push(path.join(RAIZ, 'misiones', c, f)));
});
fs.readdirSync(path.join(RAIZ, 'fichas')).filter(f => /^ficha-docente-.*\.html$/.test(f)).sort().forEach(f => paginas.push(path.join(RAIZ, 'fichas', f)));

const catalogo = fs.readFileSync(path.join(RAIZ, 'js', 'tools', 'formacion-docente.js'), 'utf8');
/* Sin los comentarios: el del principio del archivo trae una dirección de
   ejemplo que no es ninguna misión. */
const delCatalogo = [...catalogo.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/url:\s*'([^']+\.html)'/g)].map(m => path.join(RAIZ, m[1]));

console.log('— Todas las páginas del maestro llevan el candado —');
ok('hay páginas que comprobar (' + paginas.length + ': misiones y fichas)', paginas.length >= 16);
const fueraDeLista = delCatalogo.filter(p => !paginas.includes(p));
ok('las ' + delCatalogo.length + ' misiones del catálogo del maestro están entre ellas', fueraDeLista.length === 0, lista(fueraDeLista.map(rel)));

const sinCandado = [], tarde = [], otroSello = [];
let sello = null;
paginas.forEach(p => {
  const t = fs.readFileSync(p, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const m = /<script[^>]*\ssrc="([^"]*solo-docente\.js)(\?v=\d+)?"[^>]*>/.exec(t);
  if (!m || path.resolve(path.dirname(p), m[1]) !== GUION) { sinCandado.push(rel(p)); return; }
  /* Antes que cualquier otro guion y dentro del <head>: si corriera
     después, la misión se vería un instante antes de taparse. Y sin
     defer ni async, que lo dejarían para después del primer pintado. */
  const primero = /<script\b/.exec(t);
  const finHead = t.indexOf('</head>');
  if (primero.index !== m.index || m.index > finHead || /\b(defer|async)\b/.test(m[0])) tarde.push(rel(p));
  if (sello === null) sello = m[2] || '';
  if ((m[2] || '') !== sello || !m[2]) otroSello.push(rel(p) + ': ' + (m[2] || 'sin sello'));
});
ok('ninguna se queda sin él', sinCandado.length === 0, lista(sinCandado));
ok('va en el <head>, el primero de los guiones y sin defer', tarde.length === 0, lista(tarde));
ok('todas lo piden con el mismo sello (' + sello + ')', otroSello.length === 0, lista(otroSello));

/* Los enlaces entre misión y ficha: si una ficha del maestro se abriera
   desde una página que no es del maestro, sería una puerta lateral. */
const fichasEnlazadas = new Set();
paginas.filter(p => /misiones/.test(rel(p))).forEach(p => {
  [...fs.readFileSync(p, 'utf8').matchAll(/href="([^"]*fichas\/[^"#?]+\.html)/g)].forEach(m => fichasEnlazadas.add(path.resolve(path.dirname(p), m[1])));
});
const fichasSinCandado = [...fichasEnlazadas].filter(f => !paginas.includes(f));
ok('toda ficha que enlaza una misión del maestro lleva también el candado', fichasSinCandado.length === 0, lista(fichasSinCandado.map(rel)));

/* ── el guion, corrido de verdad ─────────────────────────────── */
const codigo = fs.readFileSync(GUION, 'utf8');
function abrir(guardado, conCuerpo) {
  const clases = new Set(); const nodos = []; const escuchas = {};
  const nodo = etiqueta => ({ etiqueta, id: '', innerHTML: '', textContent: '', href: '', hijos: [], enfocado: false,
    appendChild(h) { this.hijos.push(h); return h; }, insertBefore(h) { this.hijos.unshift(h); nodos.push(h); return h; }, focus() { this.enfocado = true; } });
  const cuerpo = nodo('body'), cabeza = nodo('head');
  const documento = {
    documentElement: { classList: { add: c => clases.add(c), contains: c => clases.has(c) }, appendChild: h => h },
    head: cabeza, body: conCuerpo ? cuerpo : null, title: 'Misión del maestro',
    currentScript: { src: 'http://localhost:8123/js/solo-docente.js?v=1' },
    createElement: nodo,
    getElementById: id => nodos.find(n => n.id === id) || null,
    addEventListener: (ev, fn) => { escuchas[ev] = fn; }
  };
  const caja = { document: documento, URL,
    localStorage: { getItem: k => (k in guardado ? guardado[k] : null) } };
  let error = '';
  try { vm.runInNewContext(codigo, caja); } catch (e) { error = e.message; }
  if (!conCuerpo && escuchas.DOMContentLoaded) { documento.body = cuerpo; try { escuchas.DOMContentLoaded(); } catch (e) { error = e.message; } }
  const aviso = nodos.find(n => n.id === 'solo-docente-aviso');
  return { error, tapada: clases.has('solo-docente'), aviso, estilos: cabeza.hijos.length, titulo: documento.title,
    boton: aviso ? aviso.hijos.find(h => h.etiqueta === 'a') : null, espero: !!escuchas.DOMContentLoaded };
}
const cuenta = v => ({ METAS_DOCENTE_V1: JSON.stringify(v) });

console.log('— Con cuenta: no hace nada —');
const con = abrir(cuenta({ codigo: 'ABC12', nombre: 'Prof. Marta' }), false);
ok('no tapa la página', !con.error && !con.tapada, '      ' + con.error);
ok('no añade nada: ni aviso, ni estilos, ni espera a que cargue', !con.aviso && con.estilos === 0 && !con.espero && con.titulo === 'Misión del maestro');

console.log('— Sin cuenta: tapa y dice dónde entrar —');
const casos = { 'sin nada guardado': {}, 'cuenta sin código': cuenta({ nombre: 'x' }), 'cuenta vacía': cuenta(null), 'dato roto': { METAS_DOCENTE_V1: '{no es json' } };
Object.keys(casos).forEach(nombre => {
  const r = abrir(casos[nombre], false);
  ok(nombre + ': tapa la página y pone el aviso', !r.error && r.tapada && !!r.aviso && r.estilos === 1, '      ' + r.error);
});
const sin = abrir({}, false);
ok('decide antes de que exista el cuerpo de la página (va en el <head>)', sin.tapada && sin.espero);
ok('el aviso dice para quién es', !!sin.aviso && /Solo para el maestro registrado/.test(sin.aviso.innerHTML));
ok('un solo botón, y va a la portada', !!sin.boton && sin.boton.href === 'http://localhost:8123/index.html' && sin.aviso.hijos.filter(h => h.etiqueta === 'a').length === 1 && !/<a\b|<button\b/.test(sin.aviso.innerHTML),
  '      va a: ' + (sin.boton && sin.boton.href));
ok('el botón queda listo para el teclado', !!sin.boton && sin.boton.enfocado);
ok('también funciona si el cuerpo ya existe', (() => { const r = abrir({}, true); return r.tapada && !!r.aviso && !r.espero; })());
ok('tapa también en papel (no solo en pantalla)', !/@media\s+screen/.test(codigo) && /body > \*:not\(#solo-docente-aviso\)\{display:none !important\}/.test(codigo));
ok('el botón mide al menos 44 px', (() => { const m = /#solo-docente-aviso a\{[^}]*min-height:(\d+)px/.exec(codigo); return !!m && Number(m[1]) >= 44; })());

/* ── la misma pregunta que la portada ────────────────────────── */
console.log('— Pregunta lo mismo que la portada —');
const dePortada = /function mfLogueado\(\)\s*\{([\s\S]*?)\n\}/.exec(catalogo);
ok('la portada sigue preguntando por METAS_DOCENTE_V1 y su código', !!dePortada && /METAS_DOCENTE_V1/.test(dePortada[1]) && /d\.codigo/.test(dePortada[1]));
ok('y el candado, por lo mismo', /METAS_DOCENTE_V1/.test(codigo) && /d\.codigo/.test(codigo));

/* ── las sondas de navegador ─────────────────────────────────── */
console.log('— Las sondas de navegador entran como maestro —');
const lib = fs.readFileSync(path.join(__dirname, 'lib-navegador.js'), 'utf8');
ok('lib-navegador entra como maestro en estas páginas y solo en estas', /function entraComoMaestro/.test(lib) && /misiones\\\/docente-\|fichas\\\/ficha-docente-/.test(lib) && /sinMaestro/.test(lib));

console.log(fallos === 0 ? '\n✅ Las ' + paginas.length + ' páginas del maestro piden cuenta, y al maestro con cuenta no le cambia nada.' : '\n❌ ' + fallos + ' fallo(s).');
process.exit(fallos === 0 ? 0 : 1);
