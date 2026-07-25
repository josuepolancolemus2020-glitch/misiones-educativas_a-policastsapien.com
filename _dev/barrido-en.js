/* ============================================================
   M.E.T.A.S · Barrido de restos en español
   ------------------------------------------------------------
   Saca del JS de la misión y de su HTML todos los textos que se
   muestran al alumno y los pasa por el traductor del motor
   (js/metas-i18n.js). Avisa de los que siguen en español.

   Busca palabras españolas CON Y SIN tilde: con `[ñáéíóú¿¡]`
   solo, se colaron rótulos como «Serie/Paralelo» y las pestañas
   de navegación.

   Uso:
     node _dev/barrido-en.js <mision>.js <mision>-en.js [<mision>.html]
   ============================================================ */
const fs = require('fs'), vm = require('vm'), path = require('path');
const [, , misionJs, enJs, htmlFile] = process.argv;
if (!misionJs || !enJs) { console.error('Uso: node _dev/barrido-en.js <mision>.js <mision>-en.js [<mision>.html]'); process.exit(1); }

/* ---------- DOM de mentira, suficiente para arrancar el motor ---------- */
const noop = () => { };
function nuevoEl() {
  const el = {
    style: {}, dataset: {}, classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
    children: [], innerHTML: '', textContent: '', value: '', id: '', lang: '',
    appendChild: noop, insertBefore: noop, addEventListener: noop, removeEventListener: noop,
    setAttribute: noop, getAttribute: () => null, hasAttribute: () => false, removeAttribute: noop,
    querySelector: () => null, querySelectorAll: () => [], closest: () => null,
    getBoundingClientRect: () => ({ height: 0 }), isConnected: false, focus: noop, click: noop
  };
  return el;
}
const cuerpo = nuevoEl();
const documento = {
  readyState: 'complete', documentElement: nuevoEl(), body: cuerpo, head: nuevoEl(), title: '',
  addEventListener: noop, createElement: nuevoEl, createTextNode: nuevoEl,
  createTreeWalker: () => ({ nextNode: () => null }),
  getElementById: nuevoEl, querySelector: nuevoEl, querySelectorAll: () => [],
  dispatchEvent: noop
};
const ventana = {
  addEventListener: noop, matchMedia: () => ({ matches: false }), open: () => null,
  localStorage: { getItem: () => null, setItem: noop }, location: { href: '' },
  requestAnimationFrame: noop, CustomEvent: function () { }
};
const ctx = {
  window: ventana, document: documento, localStorage: ventana.localStorage, navigator: { userAgent: '' },
  console, Math, Date, Set, Map, JSON, WeakMap, Object, Array, String, Number, RegExp, Error,
  setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop,
  requestAnimationFrame: noop, MutationObserver: undefined, NodeFilter: { SHOW_TEXT: 4 },
  location: ventana.location, CustomEvent: function () { }
};
ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);

vm.runInContext(fs.readFileSync(misionJs, 'utf8'), ctx, { filename: misionJs });
vm.runInContext(fs.readFileSync(enJs, 'utf8'), ctx, { filename: enJs });
const motor = path.join(__dirname, '..', 'js', 'metas-i18n.js');
vm.runInContext(fs.readFileSync(motor, 'utf8'), ctx, { filename: motor });

const I18N = ctx.window.MetasI18N;
if (!I18N) { console.error('✖ el motor no se cargó'); process.exit(1); }

/* Lo que ya vive en los bancos NO se traduce con frases: se cambia el banco
   entero. Se guarda el español de los bancos para no marcarlo como resto. */
let bancosES = '';
for (const clave of Object.keys(ctx.window.MISION_EN.data || {})) {
  try { bancosES += JSON.stringify(vm.runInContext(clave, ctx)); } catch (e) { }
}
bancosES = bancosES.replace(/\\"/g, '"').replace(/\\n/g, '\n');   // deshacer el escape del JSON

I18N.set('en', true);
const tr = I18N.tr;

/* ---------- textos candidatos ---------- */
const fuente = fs.readFileSync(misionJs, 'utf8');
const textos = new Set();
// literales de una línea: '…', "…" y `…`
const rx = /(['"`])((?:\\.|(?!\1)[^\\\r\n])*)\1/g;
let m;
while ((m = rx.exec(fuente))) {
  let t = m[2].replace(/\\'/g, "'").replace(/\\"/g, '"').trim();
  t = t.replace(/\$\{[^{}]*\}/g, '1');   // `Pregunta ${i} de ${n}` → «Pregunta 1 de 1»
  if (t.length > 2) textos.add(t);
}

/* Un bloque data-i18n se reemplaza ENTERO, así que hay que quitarlo con sus
   etiquetas anidadas: una expresión regular no basta, cuenta las aperturas. */
function quitarBloques(html) {
  let out = html, pos;
  const abre = /<([a-z0-9]+)[^>]*\sdata-i18n="[^"]*"[^>]*>/i;
  while ((pos = out.search(abre)) !== -1) {
    const m2 = abre.exec(out.slice(pos));
    const tag = m2[1].toLowerCase();
    let i = pos + m2[0].length, nivel = 1;
    const paso = new RegExp('<(/?)' + tag + '[\\s>]', 'gi');
    paso.lastIndex = i;
    let mm;
    while (nivel > 0 && (mm = paso.exec(out))) {
      nivel += mm[1] ? -1 : 1;
      i = paso.lastIndex;
    }
    const cierre = out.indexOf('>', i - 1);
    out = out.slice(0, pos) + ' ' + out.slice(cierre === -1 ? out.length : cierre + 1);
  }
  return out;
}

if (htmlFile && fs.existsSync(htmlFile)) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const sinBloques = quitarBloques(html);
  sinBloques.replace(/>([^<>{}]+)</g, (_, t) => { t = t.trim(); if (t.length > 2) textos.add(t); return ''; });
  sinBloques.replace(/(?:aria-label|title|placeholder)="([^"]+)"/g, (_, t) => { textos.add(t.trim()); return ''; });
}

/* Palabras españolas SIN tilde: buscarlas también, o se cuelan rótulos
   como «Serie/Paralelo» o «Elige un caso». */
const CON_TILDE = /[ñÑáéíóúÁÉÍÓÚ¿¡]/;
const SIN_TILDE = /\b(el|la|los|las|del|para|por|que|con|una|uno|unos|unas|elige|lee|toca|escribe|copia|primera|vez|respuesta|correcta|incorrecto|siguiente|anterior|nuevo|nueva|caso|casos|giro|fuerza|velocidad|sentido|engranaje|engranajes|palanca|polea|correa|motor|dientes|misión|mision)\b/i;
/* …pero no marcar el inglés que casualmente comparte palabra (la, no, son…) */
const ES_INGLES = /\b(the|and|of|with|you|for|it|is|are|to|in|force|speed|gear|turn|turns|motor|lever|pulley|belt|teeth|case|answer|test)\b/i;

const sospechosos = [];
for (const t of textos) {
  if (/^[\W\d_]+$/.test(t)) continue;                 // solo símbolos o números
  if (/^[a-z0-9_.#\-\[\]=/]+$/i.test(t)) continue;    // selectores, ids, clases
  if (/[<>{};:]{2,}|font-|padding|border|display:|margin/i.test(t)) continue; // CSS suelto
  if (bancosES.indexOf(t) !== -1) continue;           // vive en un banco: se cambia entero
  const es = CON_TILDE.test(t) || (SIN_TILDE.test(t) && !ES_INGLES.test(t));
  if (!es) continue;
  const out = tr(t);
  if (out === t) sospechosos.push(t);
}

if (!sospechosos.length) {
  console.log(`✔ barrido limpio · ${textos.size} textos revisados, ninguno se quedó en español`);
} else {
  console.log(`✖ ${sospechosos.length} textos siguen en español (de ${textos.size} revisados):\n`);
  sospechosos.forEach(t => console.log('  · ' + (t.length > 150 ? t.slice(0, 150) + '…' : t)));
}
