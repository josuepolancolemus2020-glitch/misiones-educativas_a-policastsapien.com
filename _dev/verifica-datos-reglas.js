/* ═══════════════════════════════════════════════════════════════
   🗄️ JS/DATOS: LAS REGLAS QUE NO SE VEN EN PANTALLA

   js/datos/ es la única puerta entre las herramientas del maestro y la
   base (docs/rediseno-datos/03, 3.10). Sus pruebas de verdad son las de
   la capa B, contra un Supabase local; esta sonda solo LEE los archivos,
   corre en segundos con npm test y vigila lo que un descuido rompería
   sin que ninguna pantalla lo muestre:

   · QUE ESTÉN TODOS, en el orden de carga del contrato
     (pruebas-capa-b/CONTRATO.md), y cada uno sin globales propios
     (un solo global: window.MetasDatos).
   · NUNCA Math.random (regla 16): un id repetido es un pago perdido.
   · NUNCA Number(), parseFloat() ni parseInt() (regla 19), ni sus atajos
     +x, x*1, 1*x, x/1, x|0, ~~x ni x-0: un monto leído como número deja
     de ser lo que el docente escribió.
   · NUNCA «upsert» (regla 15): un pago se crea, se corrige o se anula.
   · NUNCA la dirección de la base desde localStorage (02, 2.6): con
     METAS_SB_URL se podía mandar la sesión a un servidor ajeno.
   · NINGÚN texto de sincronizar, guardar, recuperar ni restaurar
     (09-INTERFAZ.md): el docente escribe y queda.
   · QUE js/vendor/supabase.min.js sea el armado fijo (Realtime de
     supabase-js 2.45.4, _dev/supabase-local/arma-supabase-js.sh), sin
     Math.random y sin CDN.

   Uso:  node _dev/verifica-datos-reglas.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const ORDEN = ['ids', 'montos', 'nube', 'almacen', 'cola', 'tiempo-real', 'senal', 'calculos', 'datos', 'importar', 'claves-familia'];
let fallos = 0;
function comprueba(que, ok, detalle) {
  console.log((ok ? '  ✓ ' : '  ✗ ') + que + (ok || detalle === undefined ? '' : '  → ' + JSON.stringify(detalle)));
  if (!ok) fallos++;
}

// Separa el código de los comentarios y junta los textos entre comillas.
// Las reglas valen para el código y los textos; los comentarios pueden
// nombrar lo prohibido para explicar por qué lo está.
function partir(fuente) {
  let codigo = '';
  const textos = [];
  let i = 0;
  while (i < fuente.length) {
    const c = fuente[i];
    const d = fuente[i + 1];
    if (c === '/' && d === '*') { const f = fuente.indexOf('*/', i + 2); i = f < 0 ? fuente.length : f + 2; codigo += ' '; continue; }
    if (c === '/' && d === '/') { const f = fuente.indexOf('\n', i); i = f < 0 ? fuente.length : f; continue; }
    if (c === '\'' || c === '"' || c === '`') {
      let j = i + 1;
      let t = '';
      while (j < fuente.length && fuente[j] !== c) {
        if (fuente[j] === '\\') { t += fuente[j + 1]; j += 2; continue; }
        t += fuente[j++];
      }
      textos.push(t);
      codigo += c + t + c;
      i = j + 1;
      continue;
    }
    // Una expresión regular literal: se salta entera (lleva / y comillas).
    if (c === '/' && /[(,=:!&|?;{}\[]\s*$/.test(codigo.slice(-20))) {
      let j = i + 1;
      let clase = false;
      while (j < fuente.length && (fuente[j] !== '/' || clase)) {
        if (fuente[j] === '\\') { j += 2; continue; }
        if (fuente[j] === '[') clase = true;
        if (fuente[j] === ']') clase = false;
        j++;
      }
      codigo += '/re/';
      i = j + 1;
      continue;
    }
    codigo += c;
    i++;
  }
  return { codigo, textos };
}

console.log('▶ js/datos/: archivos y orden de carga');
const archivos = ORDEN.map((n) => path.join(RAIZ, 'js/datos', n + '.js'));
const faltan = archivos.filter((f) => !fs.existsSync(f)).map((f) => path.relative(RAIZ, f));
comprueba('están todos los archivos del contrato', faltan.length === 0, faltan);
const sobran = fs.readdirSync(path.join(RAIZ, 'js/datos')).filter((f) => !ORDEN.includes(f.replace(/\.js$/, '')));
comprueba('no hay archivos fuera del contrato en js/datos/', sobran.length === 0, sobran);

const partes = {};
for (const f of archivos.filter((x) => fs.existsSync(x))) {
  const fuente = fs.readFileSync(f, 'utf8');
  const n = path.basename(f);
  partes[n] = partir(fuente);
  const sinCabecera = fuente.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '').trim();
  comprueba(`${n}: todo dentro de (function (w) {…})(window), sin globales propios`,
    sinCabecera.startsWith('(function (w) {') && sinCabecera.endsWith('})(window);'));
}

console.log('▶ Reglas 15, 16 y 19 (en el código, no en los comentarios)');
const prohibido = [
  ['Math.random', /Math\s*\.\s*random/],
  ['Number()', /(^|[^.\w])Number\s*\(/],
  ['parseFloat()', /parseFloat\s*\(/],
  ['parseInt()', /parseInt\s*\(/],
  ['.upsert(', /\.upsert\s*\(/],
  ['localStorage METAS_SB_URL / METAS_SB_KEY', /METAS_SB_(URL|KEY)/],
  ['eval / new Function', /(^|[^.\w])eval\s*\(|new\s+Function\s*\(/],
  // Las otras formas de volver número un texto (rev. 9): +x, x*1, 1*x, x/1,
  // x|0, ~~x, x-0. Cualquiera de ellas sobre «150.50» da un double.
  ['+x (más delante de un valor)', /(^|[=(,:?!&|\[{;]|\breturn|\btypeof)\s*\+\s*(?![+=\s])(?=[\w$('"\[])/],
  ['x * 1 o 1 * x', /\*\s*1(?![\d.])|(?<![\d.\w])1\s*\*/],
  ['x / 1', /\/\s*1(?![\d.])/],
  ['x | 0', /(?<!\|)\|(?!\|)\s*0(?![\d.x])/],
  ['~~x', /~~/],
  ['x - 0', /-\s*0(?![\d.x])/],
];
for (const [que, re] of prohibido) {
  const donde = Object.keys(partes).filter((n) => re.test(partes[n].codigo));
  comprueba(`nunca ${que}`, donde.length === 0, donde);
}

console.log('▶ Ningún texto de sincronizar, guardar, recuperar ni restaurar (09-INTERFAZ.md)');
const palabras = /sincroniz|guardad|guardando|guardar|recuper|restaur|papelera|copia en la nube|pagos recuperados|al d[ií]a/i;
const malos = [];
for (const n of Object.keys(partes)) {
  for (const t of partes[n].textos) if (palabras.test(t)) malos.push(n + ': «' + t.slice(0, 60) + '»');
}
comprueba('ningún texto con esas palabras', malos.length === 0, malos);

console.log('▶ js/vendor/supabase.min.js');
const vend = path.join(RAIZ, 'js/vendor/supabase.min.js');
const v = fs.existsSync(vend) ? fs.readFileSync(vend, 'utf8') : '';
comprueba('existe', v.length > 0);
comprueba('es el armado fijo: realtime-js 2.10.2 de supabase-js 2.45.4',
  /^\/\* realtime-js 2\.10\.2 de supabase-js 2\.45\.4 .*arma-supabase-js\.sh \*\//.test(v), v.slice(0, 160));
comprueba('sin Math.random', !/Math\.random/.test(v));
comprueba('sin buscar <script> en el documento (publicPath de webpack)', !/getElementsByTagName/.test(v));
comprueba('sin pedir nada a un CDN', !/https?:\/\/(cdn|unpkg|esm\.sh|jsdelivr)/.test(v));
comprueba('su licencia va al lado', fs.existsSync(path.join(RAIZ, 'js/vendor/supabase-LICENSE.txt')));

console.log('▶ La dirección de la base');
const nube = partes['nube.js'] ? partes['nube.js'].textos : [];
const urls = nube.filter((t) => /^https?:\/\//.test(t));
comprueba('nube.js nombra una sola base, la del proyecto', urls.length === 1 && /^https:\/\/[a-z0-9]+\.supabase\.co$/.test(urls[0]), urls);
comprueba('la de prueba solo en 127.0.0.1 o localhost',
  partes['nube.js'] && /h === '127\.0\.0\.1' \|\| h === 'localhost'/.test(partes['nube.js'].codigo));

console.log(fallos ? `\n✘ ${fallos} comprobaciones de js/datos/ fallaron` : '\n✅ js/datos/ cumple sus reglas');
process.exit(fallos ? 1 : 0);
