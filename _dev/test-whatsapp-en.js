/* ============================================================
   M.E.T.A.S · ¿queda algo en español en el mensaje de WhatsApp?
   ------------------------------------------------------------
   El texto que se comparte por WhatsApp se arma en JS y sale de
   la página sin pasar por el DOM, así que el MutationObserver
   del motor de idioma nunca lo ve. Desde ahora lo traduce
   METAS_TR_TEXTO, y este arnés lo comprueba: saca de cada misión
   los dos mensajes reales (el de «Misión Asignada» y el de la
   constancia), los pasa por el motor de verdad con el
   diccionario de esa misión cargado, y falla si alguna línea
   sigue igual que en español.

   Uso:  node _dev/test-whatsapp-en.js
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');

const MISIONES = [
  ['2y3ciclo-que-es-un-robot', 'que-es-un-robot'],
  ['2y3ciclo-sensores-robot', 'sensores-robot'],
  ['2y3ciclo-motores-mecanismos', 'motores-mecanismos'],
  ['2y3ciclo-electricidad-robots', 'electricidad-robots'],
  ['2y3ciclo-programando-robot', 'programando-robot'],
  ['2y3ciclo-robots-problemas', 'robots-problemas'],
  ['2y3ciclo-robot-decide', 'robot-decide']
];

/* Las líneas que se dejan en paz a propósito: la del enlace (es una URL) y
   la firma del proyecto. Todo lo demás tiene que cambiar al pasar a inglés. */
const SE_QUEDAN = [/^https?:\/\//, /^\s*$/, /policastsapien\.com$/];

/* ---------- un DOM de mentira, lo justo para que el motor arranque ---------- */

function elemento() {
  const el = {
    style: {}, dataset: {}, classList: { add() {}, remove() {}, contains: () => false },
    innerHTML: '', textContent: '', title: '',
    setAttribute() {}, getAttribute: () => null, hasAttribute: () => false,
    removeAttribute() {}, appendChild() {}, insertBefore() {}, addEventListener() {},
    querySelector: () => null, querySelectorAll: () => [], closest: () => null,
    isConnected: true, nodeType: 1, nodeName: 'DIV'
  };
  return el;
}

function contexto() {
  const doc = {
    readyState: 'complete',
    documentElement: elemento(),
    head: elemento(),
    body: elemento(),
    title: '',
    createElement: elemento,
    createTreeWalker: () => ({ nextNode: () => null }),
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementById: () => null,
    addEventListener() {},
    dispatchEvent() {}
  };
  const win = {
    document: doc,
    localStorage: { getItem: () => null, setItem() {} },
    MutationObserver: function () { this.observe = function () {}; this.disconnect = function () {}; },
    CustomEvent: function (n, o) { this.type = n; this.detail = o && o.detail; },
    NodeFilter: { SHOW_TEXT: 4 },
    addEventListener() {},
    requestAnimationFrame() {},
    setTimeout() {}, clearTimeout() {},
    navigator: { userAgent: 'node' },
    console
  };
  win.window = win;
  return vm.createContext(win);
}

function corre(ctx, rel) {
  vm.runInContext(fs.readFileSync(path.join(RAIZ, rel), 'utf8'), ctx, { filename: rel });
}

/* El JS de la misión y su -en.js se ejecutan JUNTOS, como un solo archivo.
   En el navegador dos <script> comparten el ámbito léxico del documento y por
   eso programando-robot-en.js puede nombrar las constantes de la misión
   (C_PARED, I_AV…); en vm cada runInContext estrena el suyo y esas const no
   se ven desde el segundo. Pegarlos devuelve el comportamiento real. */
function correMision(ctx, relJS, relEN) {
  const junto = fs.readFileSync(path.join(RAIZ, relJS), 'utf8') +
    '\n;\n' + fs.readFileSync(path.join(RAIZ, relEN), 'utf8');
  vm.runInContext(junto, ctx, { filename: relJS + ' + ' + relEN });
}

/* ---------- los dos mensajes, sacados del JS real de la misión ---------- */

function mensajes(rel) {
  const src = fs.readFileSync(path.join(RAIZ, rel), 'utf8');
  const out = [];

  // En el archivo los saltos están escritos \n; en marcha son saltos de verdad,
  // y de eso depende que el motor traduzca renglón por renglón.
  const real = t => t.replace(/\\n/g, '\n');

  const asignada = /function compartirMision\(\)\{[^`]*`([\s\S]*?)`/.exec(src);
  if (asignada) out.push(['Misión Asignada', real(asignada[1]).replace(/\$\{url\}/g, 'https://policastsapien.com/x')]);

  const constancia = /function shareWA\(\)\{[^`]*`([\s\S]*?)`/.exec(src);
  if (constancia) out.push(['Constancia', real(constancia[1]).replace(/\$\{name\}/g, 'Ana').replace(/\$\{pct\}/g, '87')]);

  return out;
}

/* ---------- comprobación ---------- */

let fallos = 0, revisados = 0;

for (const [carpeta, slug] of MISIONES) {
  const relJS = `misiones/${carpeta}/js/${slug}.js`;
  const relEN = `misiones/${carpeta}/js/${slug}-en.js`;

  const ctx = contexto();
  correMision(ctx, relJS, relEN);    // mismo orden que el HTML de la misión
  corre(ctx, 'js/metas-i18n.js');    // define MetasI18N y METAS_TR_TEXTO
  // Al pasar a inglés la misión repinta sus juegos y tropieza con este DOM de
  // mentira; el motor ya lo atrapa y avisa por consola. Aquí estorba.
  const warn = console.warn;
  console.warn = () => {};
  ctx.MetasI18N.set('en', true);
  console.warn = warn;

  const trTexto = ctx.METAS_TR_TEXTO;
  if (typeof trTexto !== 'function') {
    console.log(`✖ ${slug}: el motor no expone METAS_TR_TEXTO`);
    fallos++;
    continue;
  }

  const pares = mensajes(relJS);
  if (pares.length !== 2) {
    console.log(`✖ ${slug}: se esperaban 2 mensajes de WhatsApp y se hallaron ${pares.length}`);
    fallos++;
    continue;
  }

  console.log(`\n── ${slug}`);
  for (const [rotulo, es] of pares) {
    const en = trTexto(es);
    const lineasES = es.split('\n');
    const lineasEN = en.split('\n');
    for (let i = 0; i < lineasES.length; i++) {
      const linea = lineasES[i];
      if (SE_QUEDAN.some(re => re.test(linea.trim()))) continue;
      revisados++;
      if (lineasEN[i] === linea) {
        console.log(`   ✖ ${rotulo} · sigue en español: ${linea}`);
        fallos++;
      }
    }
    console.log(`   ${rotulo}:`);
    lineasEN.forEach(l => { if (l.trim()) console.log(`     ${l}`); });
  }
}

console.log(`\n${'─'.repeat(58)}`);
if (fallos) {
  console.log(`✖ ${fallos} línea(s) sin traducir de ${revisados} revisadas`);
  process.exit(1);
}
console.log(`✔ los 14 mensajes de WhatsApp pasan a inglés · ${revisados} líneas revisadas`);
