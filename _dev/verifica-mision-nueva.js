#!/usr/bin/env node
/* Comprobación barata de una misión recién creada, ANTES de abrir el navegador.
   Nació de los tres fallos que de verdad se cuelan al calcar una misión:
   una función onclick que quedó con el nombre de la misión vieja, una sopa
   cuyas coordenadas no coinciden con su rejilla (el alumno toca la palabra y
   la pantalla le dice que no está) y un banco donde la respuesta correcta
   cayó casi siempre en la misma letra.

   Uso:  node _dev/verifica-mision-nueva.js misiones/<carpeta>/<archivo>.html   */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const RAIZ = path.resolve(__dirname, '..');

const htmlPath = process.argv[2];
if (!htmlPath) { console.error('Uso: node _dev/verifica-mision-nueva.js misiones/<carpeta>/<archivo>.html'); process.exit(2); }

const dir = path.dirname(htmlPath);
const html = fs.readFileSync(htmlPath, 'utf8');
let fallos = 0, avisos = 0;
const mal = m => { console.log('  ❌ ' + m); fallos++; };
const ojo = m => { console.log('  ⚠️  ' + m); avisos++; };
const bien = m => console.log('  ✅ ' + m);

// ── 1. Los scripts que el HTML pide existen ──────────────────────────────
console.log('\n📄 Scripts y hojas de estilo');
const refs = [...html.matchAll(/(?:src|href)="((?:js|css)\/[^"]+)"/g)].map(m => m[1]);
let jsSrc = '';
refs.forEach(r => {
  const p = path.join(dir, r);
  if (!fs.existsSync(p)) mal('falta el archivo ' + r);
  else if (r.endsWith('.js')) jsSrc += '\n' + fs.readFileSync(p, 'utf8');
});
if (fallos === 0) bien(refs.length + ' archivos locales referenciados y presentes');

// ── 2. Cada onclick del HTML tiene su función en el JS ───────────────────
console.log('\n🖱️  Funciones onclick');
const llamadas = new Set();
[...html.matchAll(/on(?:click|input|change|keydown)="([^"]+)"/g)].forEach(m => {
  /* Se quitan las cadenas del atributo antes de buscar: dentro de un mensaje
     al alumno cabe cualquier cosa, y «la cuenta es (3×5+2)/5» no es una
     llamada a una función llamada «es». */
  const codigo = m[1].replace(/'[^']*'/g, "''");
  [...codigo.matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)].forEach(f => llamadas.add(f[1]));
});
const nativas = new Set(['if', 'return', 'event', 'preventDefault', 'go', 'confirm', 'alert']);
const huerfanas = [...llamadas].filter(f => !nativas.has(f) &&
  !new RegExp('function\\s+' + f + '\\s*\\(|const\\s+' + f + '\\s*=|window\\.' + f + '\\s*=').test(jsSrc));
if (huerfanas.length) huerfanas.forEach(f => mal('el HTML llama a ' + f + '() y no existe en el JS'));
else bien(llamadas.size + ' funciones llamadas desde el HTML, todas definidas');

// ── 3. Los contenedores de los widgets existen en el HTML ────────────────
console.log('\n🎮 Widgets');
let f0 = fallos;
[...html.matchAll(/mount\('([\w-]+)'\)/g)].forEach(m => {
  if (!html.includes('id="' + m[1] + '"')) mal('se monta el widget ' + m[1] + ' y no hay un <div> con ese id');
});
const widgets = [...html.matchAll(/window\.(Widget\w+JSON)/g)].map(m => m[1]);
[...new Set(widgets)].forEach(w => {
  if (!jsSrc.includes(w + ' = {') && !jsSrc.includes(w + '={')) mal('el HTML monta ' + w + ' y ningún archivo lo define');
});
if (fallos === f0) bien([...new Set(widgets)].length + ' widgets montados y definidos');

// ── 4. La sopa de letras cuadra letra por letra ──────────────────────────
console.log('\n🔤 Sopa de letras');
try {
  const m = jsSrc.match(/const sopaSets\s*=\s*(\[[\s\S]*?\n\]);/);
  if (!m) ojo('no se encontró sopaSets');
  else {
    const sets = eval(m[1]);
    const fs0 = fallos;
    let palabras = 0;
    sets.forEach((s, si) => {
      if (s.grid.length !== s.size) mal(`sopa ${si + 1}: tiene ${s.grid.length} filas y dice size ${s.size}`);
      s.grid.forEach((f, fi) => { if (f.length !== s.size) mal(`sopa ${si + 1}, fila ${fi}: ${f.length} columnas`); });
      s.words.forEach(w => {
        palabras++;
        if (w.cells.length !== w.w.length) { mal(`sopa ${si + 1}: ${w.w} tiene ${w.cells.length} celdas para ${w.w.length} letras`); return; }
        w.cells.forEach(([r, c], i) => {
          if (s.grid[r][c] !== w.w[i]) mal(`sopa ${si + 1}: ${w.w} pide '${w.w[i]}' en [${r},${c}] y la rejilla tiene '${s.grid[r][c]}'`);
        });
      });
    });
    if (fallos === fs0) bien(`${sets.length} sopas, ${palabras} palabras verificadas letra por letra`);
  }
} catch (e) { ojo('no se pudo leer sopaSets: ' + e.message); }

// ── 5. Reparto de respuestas: ninguna letra por encima del 40 % ──────────
console.log('\n🎯 Reparto de respuestas correctas');
const bancos = [['qzData', 'c'], ['evalMCBank', 'a'], ['cmpData', 'c']];
bancos.forEach(([nombre, clave]) => {
  const m = jsSrc.match(new RegExp('const ' + nombre + '\\s*=\\s*(\\[[\\s\\S]*?\\n\\]);'));
  if (!m) { ojo('no se encontró ' + nombre); return; }
  let arr;
  try { arr = eval(m[1]); } catch (e) { ojo(nombre + ' no se pudo leer: ' + e.message); return; }
  const cuenta = {};
  arr.forEach(it => { const k = it[clave]; cuenta[k] = (cuenta[k] || 0) + 1; });
  const total = arr.length;
  const detalle = Object.keys(cuenta).sort().map(k => 'abcd'[k] + ': ' + Math.round(100 * cuenta[k] / total) + '%').join(' · ');
  const max = Math.max(...Object.values(cuenta)) / total;
  if (max > 0.4) mal(`${nombre} (${total} ítems): ${detalle} → pasa del 40 %`);
  else bien(`${nombre} (${total} ítems): ${detalle}`);
});

// ── 6. Bancos con el tamaño que manda la plantilla ───────────────────────
console.log('\n📚 Tamaño de los bancos');
/* «Explica con tus palabras» la montan 20 de las 74 misiones, así que su banco
   se le pide SOLO a quien monta la sección, y se sabe quién es mirando el HTML.
   Exigírselo a todas pintaba de rojo a las otras 54 sin que nada estuviera
   roto, y una sonda que se equivoca enseña a no mirarla. */
const tamanos = [['fcData', 12], ['qzData', 9], ['evalTFBank', 15], ['evalMCBank', 15], ['evalCPBank', 15], ['evalPRBank', 15]];
if (html.includes('id="s-explica"')) tamanos.push(['explicaData', 5]);
/* ⚠️ Un banco puede estar ESCRITO a mano o GENERADO de un archivo de datos
   —`const fcData = (function(){ … })();`, como en las misiones de la Ruta de
   la Patria, que sacan su contenido de js/data/ para que la pantalla y la
   ficha impresa no se separen—. Lo que esta sonda tiene que medir es cuántos
   ítems TIENE, no cómo está escrito: pedirle un array literal castigaba la
   forma buena de hacerlo y pintaba de rojo una misión sana. */
function cuantosTiene(nombre) {
  const lit = jsSrc.match(new RegExp('const ' + nombre + '\\s*=\\s*(\\[[\\s\\S]*?\\n\\]);'));
  if (lit) return eval(lit[1]).length;
  const gen = sentenciaDe(jsSrc, nombre);
  if (!gen) return null;
  /* Se cargan antes los archivos de datos que la propia misión enlaza: el
     banco generado los necesita para poder armarse. */
  const caja = {};
  vm.createContext(caja);
  (html.match(/src="[^"]*\/(js\/data\/[A-Za-z0-9._-]+\.js)"/g) || []).forEach(s => {
    const rel = s.match(/(js\/data\/[A-Za-z0-9._-]+\.js)/)[1];
    const p = path.join(RAIZ, rel);
    if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), caja);
  });
  vm.runInContext(gen + '\nthis.__n = ' + nombre + '.length;', caja);
  return caja.__n;
}

/* La sentencia entera de `const NOMBRE = …;`, contando paréntesis: el primer
   «;» puede ir DENTRO de la función que genera el banco. */
function sentenciaDe(src, nombre) {
  const m = src.match(new RegExp('^const ' + nombre + '\\s*=', 'm'));
  if (!m) return null;
  let i = m.index + m[0].length, prof = 0, cad = null;
  for (; i < src.length; i++) {
    const c = src[i];
    if (cad) { if (c === '\\') { i++; continue; } if (c === cad) cad = null; continue; }
    if (c === '"' || c === "'" || c === '`') { cad = c; continue; }
    if ('[{('.includes(c)) prof++;
    else if (']})'.includes(c)) prof--;
    else if (c === ';' && prof === 0) return src.slice(m.index, i + 1);
  }
  return null;
}

tamanos
  .forEach(([nombre, min]) => {
    let n;
    try { n = cuantosTiene(nombre); } catch (e) { ojo(nombre + ': ' + e.message); return; }
    if (n === null || n === undefined) { mal('falta ' + nombre); return; }
    if (n < min) mal(`${nombre} tiene ${n} y hacen falta al menos ${min}`);
    else bien(`${nombre}: ${n}`);
  });

// ── 7. Restos de la misión que se usó de plantilla ───────────────────────
console.log('\n🧹 Restos de la plantilla');
const slug = path.basename(htmlPath, '.html');
const fr0 = fallos;
const sospechosos = ['multiplos-divisores-primos', 'Múltiplos, Divisores y Primos', 'prefLetraMultiplosDivisores',
  'matematica_multiplos_divisores_v1', 'WidgetCribaJSON', 'WidgetFabricaJSON'];
sospechosos.forEach(s => {
  if (slug.includes(s)) return;
  if (html.includes(s) || jsSrc.includes(s)) mal('quedó una referencia a la misión plantilla: ' + s);
});
if (fallos === fr0) bien('sin restos de la misión que sirvió de plantilla');

// ── 8. Los enganches del proyecto ────────────────────────────────────────
console.log('\n🔌 Enganches de la plataforma');
[['../../js/metas-presentacion.js', 'modo presentación y letra grande'],
 ['../../js/metas-registro.js', 'registro de evidencia del docente']].forEach(([s, q]) => {
  if (!html.includes(s)) mal('falta <script src="' + s + '"> (' + q + ')');
  else bien(q);
});
/* Los DOS formatos que metas-registro.js sabe leer, con su misma expresión:
   «Resultado: 85/100 pts» y «Resultado automático: 85/100 puntos». La sonda
   pedía solo el primero y daba por rota la lectura de la nota en las misiones
   que usan el segundo, que la leen perfectamente. Si esto cambia, cambia en
   los dos sitios: aquí y en notaDePanel() de js/metas-registro.js. */
if (!/Resultado[^:]*:\s*\$\{total\}\s*\/\s*100/.test(jsSrc)) mal('el panel de resultado cambió de formato y metas-registro.js no podrá leer la nota');
else bien('el panel dice «Resultado … N/100», que es lo que lee el registro');

console.log(`\n${fallos ? '❌' : '✅'} ${fallos} fallo(s), ${avisos} aviso(s)\n`);
process.exit(fallos ? 1 : 0);
