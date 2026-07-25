/* ============================================================
   M.E.T.A.S · Verificador de bancos traducidos al inglés
   ------------------------------------------------------------
   Comprueba que cada banco de <mision>-en.js sea traducción
   ÍNDICE A ÍNDICE del español. Eso es lo que hace que las 30
   formas deterministas de la evaluación saquen las mismas
   preguntas, la misma pauta y la misma clave ZipGrade en los dos
   idiomas: el generador escoge por índice, no por contenido.

   Uso:
     node _dev/verifica-bancos-en.js <mision>.js <mision>-en.js

   Avisa cuando: falta un banco, cambia el número de elementos,
   se mueve el índice de la respuesta correcta (.a / .c), cambia
   el número de opciones o se invierte un Verdadero/Falso.
   ============================================================ */
const fs = require('fs'), vm = require('vm');
const [, , misionJs, enJs] = process.argv;

const noop = () => {};
const el = new Proxy({}, { get: (t, k) => {
  if (k === 'classList') return { add: noop, remove: noop, toggle: noop, contains: () => false };
  if (k === 'style' || k === 'dataset') return {};
  if (k === 'appendChild' || k === 'addEventListener' || k === 'setAttribute') return noop;
  if (k === 'textContent' || k === 'innerHTML' || k === 'value') return '';
  return noop;
} });
const document = {
  readyState: 'loading', addEventListener: noop, createElement: () => el,
  getElementById: () => null, querySelector: () => null, querySelectorAll: () => [], body: el, head: el
};
const window = { addEventListener: noop, localStorage: { getItem: () => null, setItem: noop } };
const ctx = { window, document, localStorage: window.localStorage, console, Math, Date, Set, Map, JSON, setTimeout: noop, clearTimeout: noop, setInterval: noop, clearInterval: noop, requestAnimationFrame: noop, navigator: {}, location: { href: '' } };
ctx.globalThis = ctx; ctx.self = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(misionJs, 'utf8'), ctx, { filename: misionJs });
vm.runInContext(fs.readFileSync(enJs, 'utf8'), ctx, { filename: enJs });

const EN = ctx.window.MISION_EN;
if (!EN || !EN.data) { console.error('✖ MISION_EN.data no se definió'); process.exit(1); }

let fallos = 0, ok = 0;
const len = (v) => Array.isArray(v) ? v.length : (v && typeof v === 'object' ? Object.keys(v).length : null);

for (const clave of Object.keys(EN.data)) {
  let es; try { es = vm.runInContext(clave, ctx); } catch (e) { es = undefined; }
  const en = EN.data[clave];
  if (es === undefined) { console.log(`✖ ${clave}: no existe en el JS español`); fallos++; continue; }
  const le = len(es), lg = len(en);
  if (le !== lg) { console.log(`✖ ${clave}: ES ${le} vs EN ${lg}`); fallos++; continue; }
  // opciones de selección múltiple: el índice de la respuesta debe conservarse
  if (Array.isArray(es) && es.length && es[0] && typeof es[0] === 'object') {
    es.forEach((item, i) => {
      // idData.c es la posición de la palabra dentro de la oración: cambia con el orden del inglés
      (clave === 'idData' ? [] : ['a', 'c']).forEach(k => {
        if (typeof item[k] === 'number' && en[i][k] !== item[k]) {
          console.log(`✖ ${clave}[${i}].${k}: ES ${item[k]} vs EN ${en[i][k]} (rompe la pauta/ZipGrade)`); fallos++;
        }
      });
      if (Array.isArray(item.o) && item.o.length !== en[i].o.length) { console.log(`✖ ${clave}[${i}].o: distinto nº de opciones`); fallos++; }
      if (Array.isArray(item.opts) && item.opts.length !== en[i].opts.length) { console.log(`✖ ${clave}[${i}].opts: distinto nº de opciones`); fallos++; }
      if (typeof item.a === 'boolean' && en[i].a !== item.a) { console.log(`✖ ${clave}[${i}].a: V/F distinto (ES ${item.a} vs EN ${en[i].a})`); fallos++; }
      if (Array.isArray(item.words) && item.words.length !== en[i].words.length) { console.log(`✖ ${clave}[${i}].words: distinto nº de palabras`); fallos++; }
      if (Array.isArray(item.steps) && item.steps.length !== en[i].steps.length) { console.log(`✖ ${clave}[${i}].steps: distinto nº de pasos`); fallos++; }
    });
  }
  ok++;
}

// bancos españoles que el hook intercambia pero que la traducción no cubre
const faltan = [];
const src = fs.readFileSync(misionJs, 'utf8');
const hook = src.slice(src.indexOf('_BANCOS_ES'));
(hook.match(/usa\('(\w+)'\)/g) || []).forEach(m => {
  const k = m.slice(5, -2);
  if (!(k in EN.data) && !faltan.includes(k)) faltan.push(k);
});
if (faltan.length) { console.log('✖ sin traducir: ' + faltan.join(', ')); fallos += faltan.length; }

console.log(`\n${fallos ? '✖' : '✔'} ${ok} bancos revisados · ${fallos} problemas`);
process.exit(fallos ? 1 : 0);
