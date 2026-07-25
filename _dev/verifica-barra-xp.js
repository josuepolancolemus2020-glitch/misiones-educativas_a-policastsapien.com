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

   Comprueba, sin navegador:
   1. Todo CSS de misión tiene la media query de la barra.
   2. Dentro lleva las tres reglas que la hacen caber.
   3. La .xp-bar base sigue siendo la del molde (si alguien le
      cambia el gap o el padding, el cálculo deja de valer).
   4. El espejo de www/ coincide.

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
/* El molde del que salieron los números medidos */
const BASE = { display: 'flex', gap: '0.8rem', padding: '0.38rem 1rem' };

let fallos = 0;
const err = m => { fallos++; console.log('  ✗ ' + m); };
const ok = m => console.log('  ✓ ' + m);

const archivos = execSync('git ls-files "misiones/*/css/*.css"', { cwd: RAIZ, encoding: 'utf8' })
  .trim().split('\n').filter(f => f && !f.startsWith('www/'));

console.log(`\n════════ BARRA DE XP · ${archivos.length} misiones ════════\n`);

/* ── 1 y 2. la media query y sus reglas ─────────────────────── */
console.log('1) La media query de la barra');
let sinRegla = 0;
for (const rel of archivos) {
  const s = fs.readFileSync(path.join(RAIZ, rel), 'utf8');
  const m = /@media\s*\(max-width:\s*430px\)\s*\{([\s\S]*?\n\})/.exec(s);
  if (!s.includes(MARCA) || !m) { err(`${rel}: le falta la media query de la barra`); sinRegla++; continue; }
  for (const r of REGLAS) {
    if (!r.re.test(m[1])) { err(`${rel}: dentro de la media query falta ${r.que}`); sinRegla++; }
  }
}
if (!sinRegla) ok(`las ${archivos.length} tienen la media query con sus tres reglas`);

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
  for (const k of Object.keys(BASE)) {
    if (props[k] !== BASE[k]) err(`${rel}: .xp-bar tiene ${k}:${props[k]} y el molde dice ${k}:${BASE[k]} — vuelve a medir antes de dar por bueno el arreglo`);
  }
  const f = Object.keys(BASE).map(k => k + ':' + props[k]).join(' | ');
  firmas.set(f, (firmas.get(f) || 0) + 1);
}
for (const [f, n] of firmas) ok(`${n} misiones con ${f}`);

/* ── 4. el espejo de www/ ───────────────────────────────────── */
console.log('\n3) Espejo de www/');
let difieren = 0;
for (const rel of archivos) {
  const esp = path.join(RAIZ, 'www', rel);
  if (!fs.existsSync(esp)) { err(`${rel}: no existe su copia en www/`); difieren++; continue; }
  if (fs.readFileSync(path.join(RAIZ, rel), 'utf8') !== fs.readFileSync(esp, 'utf8')) {
    err(`${rel}: la copia de www/ no coincide`); difieren++;
  }
}
if (!difieren) ok(`los ${archivos.length} espejos coinciden`);

console.log('\n' + '─'.repeat(50));
if (fallos) { console.log(`✖ ${fallos} problema(s): alguna misión puede desbordar la pantalla del teléfono`); process.exit(1); }
console.log('✅ TODO EN VERDE: la barra de XP cabe en las ' + archivos.length + ' misiones.');
