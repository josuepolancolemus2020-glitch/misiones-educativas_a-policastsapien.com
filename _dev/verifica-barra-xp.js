/* ============================================================
   M.E.T.A.S · La barra de XP cabe en la pantalla del teléfono
   ------------------------------------------------------------
   La .xp-bar es una fila de siete elementos que NO se encogen:
   volver · «🎮 XP» · barra de progreso · WhatsApp · botón de
   idioma (en las traducidas) · «⭐ N» · nivel. En un teléfono no
   caben, y el sobrante no se recorta: empuja el DOCUMENTO ENTERO
   hacia la derecha, así que el alumno lee todo cortado por la
   izquierda. Medido a 360 px llegaba a 286 px de desborde con el
   nivel «Maestro del Pensamiento 🏆».

   Por eso cada CSS de misión lleva una media query por debajo de
   430 px. Como las misiones nuevas se sacan copiando el molde de
   otra, es fácil que una se quede sin ella y nadie lo note hasta
   que un alumno lo sufre. Este arnés lo caza.

   ⚠️ Pero hay DOS barras, y solo una se sale. La del alumno lleva
   siete elementos, y el que la desborda es el nivel (.xp-lvl), que
   llega a decir «Maestro del Pensamiento 🏆». La de las ocho
   misiones del maestro lleva cuatro —volver, «🎓 XP», la barra y
   el número— y de esos solo la barra no se encoge: cabe en 360 px
   con sitio de sobra, medido.

   Por eso la media query se le pide a la del alumno y no a la del
   maestro. No es tolerancia: copiarle la regla al maestro le
   ESCONDERÍA el «🎓 XP», que en su barra es la única palabra que
   hay —al lado no tiene «⭐ N» como el alumno, tiene un número
   pelado—. Se le quitaría el rótulo a una barra que nunca se salió.

   Comprueba, sin navegador:
   1. Todo CSS de misión con barra de alumno tiene la media query.
   2. Dentro lleva las tres reglas que la hacen caber.
   3. La .xp-bar base sigue siendo la del molde (si alguien le
      cambia el gap o el padding, el cálculo deja de valer).
   4. Cuánto le falta al espejo de www/ para ponerse al día
      (AVISO, no fallo: ver la nota de abajo).

   Uso:  node _dev/verifica-barra-xp.js
============================================================= */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..');
const MARCA = 'barra de XP en pantallas angostas';
/* Las tres reglas que hacen que quepa: sin el rótulo redundante,
   con los huecos apretados y con permiso para bajar de línea. */
const REGLAS = [
  { re: /\.xp-bar\s*\{[^}]*flex-wrap:\s*wrap/, que: 'flex-wrap: wrap en .xp-bar' },
  { re: /\.xp-bar\s+\.xp-lbl\s*\{[^}]*display:\s*none/, que: 'display: none en .xp-bar .xp-lbl' },
  { re: /\.xp-bar\s+\.xp-track\s*\{[^}]*flex:/, que: 'flex en .xp-bar .xp-track' }
];
/* Los moldes de los que salieron los números medidos. Son DOS: las misiones
   del alumno se escribieron en rem y las ocho del maestro en px, y las dos
   familias están medidas. Lo que no puede aparecer es un TERCERO, porque
   entonces el cálculo de los 430 px ya no vale para él y nadie lo midió. */
const MOLDES = [
  { nombre: 'alumno',  props: { display: 'flex', gap: '0.8rem', padding: '0.38rem 1rem' } },
  { nombre: 'maestro', props: { display: 'flex', gap: '10px',   padding: '8px 12px'     } }
];
const CLAVES = ['display', 'gap', 'padding'];

let fallos = 0;
const err = m => { fallos++; console.log('  ✗ ' + m); };
const ok = m => console.log('  ✓ ' + m);

const archivos = execSync('git ls-files "misiones/*/css/*.css"', { cwd: RAIZ, encoding: 'utf8' })
  .trim().split('\n').filter(f => f && !f.startsWith('www/'));

console.log(`\n════════ BARRA DE XP · ${archivos.length} misiones ════════\n`);

/* ── 1 y 2. la media query y sus reglas ─────────────────────── */
/* Quién lleva la barra larga se lee del HTML de la misión, no de una lista:
   una lista escrita a mano se queda vieja en cuanto entra una misión nueva.
   La señal es `.xp-lvl`, que es justo el elemento que desborda. */
function barraLarga(relCss) {
  const carpeta = path.join(RAIZ, path.dirname(path.dirname(relCss)));
  const htmls = fs.readdirSync(carpeta).filter(f => f.endsWith('.html'));
  return htmls.some(h => /class="[^"]*\bxp-lvl\b/.test(fs.readFileSync(path.join(carpeta, h), 'utf8')));
}

console.log('1) La media query de la barra');
let sinRegla = 0, cortas = 0;
for (const rel of archivos) {
  const s = fs.readFileSync(path.join(RAIZ, rel), 'utf8');
  if (!barraLarga(rel)) { cortas++; continue; }
  const m = /@media\s*\(max-width:\s*430px\)\s*\{([\s\S]*?\n\})/.exec(s);
  if (!s.includes(MARCA) || !m) { err(`${rel}: le falta la media query de la barra`); sinRegla++; continue; }
  for (const r of REGLAS) {
    if (!r.re.test(m[1])) { err(`${rel}: dentro de la media query falta ${r.que}`); sinRegla++; }
  }
}
if (!sinRegla) ok(`las ${archivos.length - cortas} con barra de alumno tienen la media query con sus tres reglas`);
if (cortas) ok(`${cortas} con barra corta (sin .xp-lvl): no la necesitan, y ponérsela les escondería su único rótulo`);

/* ── 3. la .xp-bar base sigue siendo la del molde ───────────── */
console.log('\n2) La .xp-bar base no cambió');
const firmas = new Map();
for (const rel of archivos) {
  const s = fs.readFileSync(path.join(RAIZ, rel), 'utf8');
  const m = /\.xp-bar\s*\{([^}]*)\}/.exec(s);
  if (!m) { err(`${rel}: no tiene .xp-bar`); continue; }
  const props = {};
  m[1].split(';').forEach(d => {
    const i = d.indexOf(':');
    if (i > 0) props[d.slice(0, i).trim()] = d.slice(i + 1).trim();
  });
  const molde = MOLDES.find(M => CLAVES.every(k => props[k] === M.props[k]));
  if (!molde) {
    err(`${rel}: .xp-bar no es ninguno de los moldes medidos (${CLAVES.map(k => k + ':' + props[k]).join(' | ')}) — vuelve a medir antes de dar por bueno el arreglo`);
    continue;
  }
  const f = `${molde.nombre} · ` + CLAVES.map(k => k + ':' + props[k]).join(' | ');
  firmas.set(f, (firmas.get(f) || 0) + 1);
}
for (const [f, n] of firmas) ok(`${n} misiones con ${f}`);

/* ── 4. el espejo de www/ ───────────────────────────────────── */
/* Esto AVISA, no falla, y el motivo está escrito en CLAUDE.md: www/ es la
   copia que se lleva Capacitor a la app de Android, no se edita a mano y se
   regenera con `npm run build:www` en Windows. O sea que entre una compilación
   y la siguiente va desfasada A PROPÓSITO: darlo por fallo pintaba de rojo el
   estado normal del repositorio, y una sonda que sale roja cuando todo está
   bien enseña a no mirarla. Lo que sí hace falta saber es CUÁNTO le falta,
   porque hasta que se compile la app el alumno de Android sigue con el CSS
   viejo. */
console.log('\n3) Espejo de www/ (aviso, no fallo)');
let difieren = 0;
for (const rel of archivos) {
  const esp = path.join(RAIZ, 'www', rel);
  if (!fs.existsSync(esp) ||
      fs.readFileSync(path.join(RAIZ, rel), 'utf8') !== fs.readFileSync(esp, 'utf8')) difieren++;
}
if (!difieren) ok(`los ${archivos.length} espejos coinciden`);
else console.log(`  ⚠ ${difieren} de ${archivos.length} copias de www/ están atrasadas.\n` +
                 '    La app de Android seguirá con el CSS viejo hasta que se corra\n' +
                 '    `npm run build:www` en Windows y se compile.');

console.log('\n' + '─'.repeat(50));
if (fallos) { console.log(`✖ ${fallos} problema(s): alguna misión puede desbordar la pantalla del teléfono`); process.exit(1); }
console.log('✅ TODO EN VERDE: la barra de XP cabe en las ' + archivos.length + ' misiones.');
