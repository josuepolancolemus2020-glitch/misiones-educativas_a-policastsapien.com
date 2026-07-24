/* =============================================================
   test-campeonismo-tec.js — Arnés de verificación de Campeonísimo
   con las materias nuevas (Programación 💻 y Robótica 🤖).

   Uso:  node _dev/test-campeonismo-tec.js

   Comprueba, sin navegador:
   1. CAMP_BANK tiene las claves «programación» y «robótica».
   2. Toda pregunta del banco: 4 opciones, c entre 0 y 3, opciones
      sin repetidos, texto no vacío.
   3. Todo `mision` corresponde a un `title` real de misiones.js.
   4. ≥10 preguntas por misión de las dos materias nuevas.
   5. Sin preguntas duplicadas (texto normalizado) dentro del banco
      ni contra el evalMCBank de su propia misión.
   6. Las `key` de CAMP_SUBJECTS coinciden con los `subject` de
      misiones.js (salvo «bachillerato», que el juego mapea a español).
   7. Cada materia de CAMP_SUBJECTS tiene sus estilos por materia en
      css/app.css: .camp-sa-*, .camp-sp-*, .camp-q-header-*,
      .camp-ms-bh-* y .camp-ws-*.
   8. La ruleta cubre todas las materias sin gajos repetidos.
============================================================= */
'use strict';

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const ROOT = path.resolve(__dirname, '..');
const P = {
  bank:  path.join(ROOT, 'js', 'data', 'campeonismo-bank.js'),
  mis:   path.join(ROOT, 'js', 'data', 'misiones.js'),
  juego: path.join(ROOT, 'js', 'tools', 'campeonismo.js'),
  css:   path.join(ROOT, 'css', 'app.css'),
};

const NUEVAS = ['programación', 'robótica'];

let fallos = 0;
const err = m => { fallos++; console.log('  ✗ ' + m); };
const ok  = m => console.log('  ✓ ' + m);

/* ── utilidades ───────────────────────────────────────────── */
function norm(s) {
  s = String(s || '').toLowerCase();
  try { s = s.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (_) {}
  return s.replace(/[^a-z0-9ñ]+/g, ' ').trim();
}

function cargar(file, nombres) {
  const ctx = { window: {}, document: {}, localStorage: {}, console };
  vm.createContext(ctx);
  /* `const` de nivel superior no queda como propiedad del contexto:
     se lee evaluando el identificador dentro del mismo contexto. */
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  const out = {};
  nombres.forEach(n => {
    try { out[n] = vm.runInContext(n, ctx); } catch (_) { out[n] = ctx[n]; }
  });
  return out;
}

/* Extrae un array literal por nombre desde un texto JS (igual que el juego) */
function extraerArray(txt, nombre) {
  const m = txt.match(new RegExp('(?:const|var|let)\\s+' + nombre + '\\s*=\\s*\\['));
  if (!m) return null;
  const start = txt.indexOf('[', m.index);
  let depth = 0, inStr = null, i = start;
  for (; i < txt.length; i++) {
    const ch = txt[i];
    if (inStr) { if (ch === '\\') { i++; continue; } if (ch === inStr) inStr = null; continue; }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) break; }
  }
  if (depth !== 0) return null;
  try { return new Function('return ' + txt.slice(start, i + 1))(); } catch (_) { return null; }
}

/* ── carga ────────────────────────────────────────────────── */
console.log('\n════════ CAMPEONÍSIMO · Programación y Robótica ════════\n');

const { CAMP_BANK }     = cargar(P.bank, ['CAMP_BANK']);
const { MISSIONS }      = cargar(P.mis,  ['MISSIONS']);
const juegoTxt          = fs.readFileSync(P.juego, 'utf8');
const cssTxt            = fs.readFileSync(P.css, 'utf8');
const CAMP_SUBJECTS     = extraerArray(juegoTxt, 'CAMP_SUBJECTS');

if (!CAMP_BANK)       { console.log('✗ No se pudo cargar CAMP_BANK');     process.exit(1); }
if (!MISSIONS)        { console.log('✗ No se pudo cargar MISSIONS');      process.exit(1); }
if (!CAMP_SUBJECTS)   { console.log('✗ No se pudo leer CAMP_SUBJECTS');   process.exit(1); }

const titulos = new Set(MISSIONS.map(m => m.title));

/* ── 1. claves nuevas ─────────────────────────────────────── */
console.log('1) Claves del banco');
NUEVAS.forEach(k => {
  if (Array.isArray(CAMP_BANK[k]) && CAMP_BANK[k].length) ok(`CAMP_BANK['${k}'] con ${CAMP_BANK[k].length} preguntas`);
  else err(`Falta o está vacío CAMP_BANK['${k}']`);
});

/* ── 2 y 3. formato de TODAS las preguntas del banco ──────── */
console.log('\n2) Formato de las preguntas (banco completo)');
let totalQ = 0, malas = 0, misionMala = 0;
Object.keys(CAMP_BANK).forEach(mat => {
  (CAMP_BANK[mat] || []).forEach((q, i) => {
    totalQ++;
    const ref = `${mat}[${i}] «${String(q && q.q).slice(0, 46)}…»`;
    if (!q || typeof q.q !== 'string' || !q.q.trim()) { err(`${ref}: enunciado vacío`); malas++; return; }
    if (!Array.isArray(q.o) || q.o.length !== 4)      { err(`${ref}: no tiene 4 opciones`); malas++; return; }
    if (q.o.some(o => typeof o !== 'string' || !o.trim())) { err(`${ref}: opción vacía`); malas++; return; }
    if (new Set(q.o.map(norm)).size !== 4)            { err(`${ref}: opciones repetidas`); malas++; return; }
    if (typeof q.c !== 'number' || q.c < 0 || q.c > 3 || q.c % 1 !== 0) { err(`${ref}: índice c inválido (${q.c})`); malas++; return; }
    if (typeof q.mision !== 'string' || !titulos.has(q.mision)) { err(`${ref}: mision «${q.mision}» no existe en misiones.js`); misionMala++; }
  });
});
if (!malas)      ok(`${totalQ} preguntas con 4 opciones válidas y c entre 0 y 3`);
if (!misionMala) ok('Todos los valores de `mision` corresponden a un título real del catálogo');

/* ── 4 y 5. cobertura y duplicados en las materias nuevas ── */
console.log('\n3) Cobertura y duplicados (Programación y Robótica)');
const resumen = {};
NUEVAS.forEach(mat => {
  const lista = CAMP_BANK[mat] || [];
  const porMision = {};
  lista.forEach(q => { (porMision[q.mision] = porMision[q.mision] || []).push(q); });
  resumen[mat] = porMision;

  /* misiones del catálogo con ese subject */
  const delCatalogo = MISSIONS.filter(m => m.subject === mat).map(m => m.title);
  delCatalogo.forEach(t => {
    const n = (porMision[t] || []).length;
    if (n === 0) console.log(`  · (sin banco propio todavía) ${t}`);
    else if (n < 10) err(`«${t}» solo tiene ${n} preguntas (mínimo 10)`);
  });

  /* duplicados internos */
  const vistos = new Map();
  lista.forEach(q => {
    const k = norm(q.q);
    if (vistos.has(k)) err(`Duplicado interno en ${mat}: «${q.q.slice(0, 60)}…»`);
    else vistos.set(k, q);
  });

  /* duplicados contra el evalMCBank de la propia misión */
  Object.keys(porMision).forEach(titulo => {
    const mis = MISSIONS.find(m => m.title === titulo);
    if (!mis) return;
    const dir  = path.join(ROOT, path.dirname(mis.url));
    let evalQs = null;
    try {
      fs.readdirSync(path.join(dir, 'js'))
        .filter(f => f.endsWith('.js') && !/html2canvas/i.test(f))
        .forEach(f => {
          if (evalQs && evalQs.length) return;
          const txt = fs.readFileSync(path.join(dir, 'js', f), 'utf8');
          evalQs = extraerArray(txt, 'evalMCBank') || extraerArray(txt, 'QUIZ_QS') || evalQs;
        });
    } catch (_) {}
    if (!evalQs || !evalQs.length) { err(`No se pudo leer el evalMCBank de «${titulo}»`); return; }
    const evalSet = new Set(evalQs.map(q => norm(q.q)));
    porMision[titulo].forEach(q => {
      if (evalSet.has(norm(q.q))) err(`«${titulo}»: la pregunta repite textualmente el examen → «${q.q.slice(0, 60)}…»`);
    });
  });
});
if (!fallos) ok('≥10 preguntas por misión, sin duplicados internos ni contra el evalMCBank');

/* ── 6. CAMP_SUBJECTS vs subjects de misiones.js ─────────── */
console.log('\n4) Materias: CAMP_SUBJECTS vs misiones.js');
const keys     = CAMP_SUBJECTS.map(s => s.key);
const subjects = [...new Set(MISSIONS.map(m => m.subject))].filter(s => s !== 'bachillerato');
subjects.forEach(s => { if (!keys.includes(s)) err(`El subject «${s}» del catálogo no está en CAMP_SUBJECTS`); });
keys.forEach(k => { if (!subjects.includes(k)) err(`CAMP_SUBJECTS tiene «${k}» pero ninguna misión lo usa`); });
if (new Set(keys).size !== keys.length) err('Hay `key` repetidas en CAMP_SUBJECTS');
const clases = CAMP_SUBJECTS.map(s => s.cls);
if (new Set(clases).size !== clases.length) err('Hay `cls` repetidas en CAMP_SUBJECTS (los estilos se pisarían)');
CAMP_SUBJECTS.forEach(s => {
  ['label', 'short', 'icon', 'color', 'bg', 'cls'].forEach(campo => {
    if (!s[campo]) err(`La materia «${s.key}» no tiene ${campo}`);
  });
  if (s.short && s.short.length !== 3) err(`El «short» de ${s.key} debería tener 3 letras (${s.short})`);
  if (s.color && !/^#[0-9a-f]{6}$/i.test(s.color)) err(`Color inválido en ${s.key}: ${s.color}`);
  if (s.bg && !/^#[0-9a-f]{6}$/i.test(s.bg)) err(`Bg inválido en ${s.key}: ${s.bg}`);
});
ok(`${keys.length} materias sincronizadas: ${keys.join(', ')}`);

/* ── 7. estilos por materia en app.css ───────────────────── */
console.log('\n5) Estilos por materia en css/app.css');
const PREFIJOS = ['camp-sa-', 'camp-sp-', 'camp-q-header-', 'camp-ms-bh-', 'camp-ws-'];
let faltanCss = 0;
CAMP_SUBJECTS.forEach(s => {
  PREFIJOS.forEach(pref => {
    const sel = '.' + pref + s.cls;
    /* el selector debe existir como clase completa (no como prefijo de otra) */
    const re = new RegExp('\\' + sel.replace(/[-]/g, '\\-') + '(?![\\w-])');
    if (!re.test(cssTxt)) { err(`Falta el estilo ${sel} (materia ${s.key})`); faltanCss++; }
  });
});
if (!faltanCss) ok(`${CAMP_SUBJECTS.length * PREFIJOS.length} clases .camp-*-<cls> presentes`);

/* ── 8. ruleta ───────────────────────────────────────────── */
console.log('\n6) Ruleta');
const usaLongitud = /_wheelSegs\(\)/.test(juegoTxt) && /CAMP_SUBJECTS\.length/.test(juegoTxt);
if (usaLongitud) ok(`La ruleta se genera desde CAMP_SUBJECTS (${CAMP_SUBJECTS.length * 2} gajos de ${(360 / (CAMP_SUBJECTS.length * 2)).toFixed(1)}°)`);
else err('La ruleta sigue con un número fijo de gajos: no cubre las materias nuevas');
if (/CAMP_SUBJECTS\[i % 4\]/.test(juegoTxt)) err('Quedó el módulo fijo «i % 4» en la ruleta');

/* ── resumen ─────────────────────────────────────────────── */
console.log('\n──────────── RESUMEN ────────────');
NUEVAS.forEach(mat => {
  const porMision = resumen[mat] || {};
  const total = Object.values(porMision).reduce((a, b) => a + b.length, 0);
  const icono = (CAMP_SUBJECTS.find(s => s.key === mat) || {}).icon || '';
  console.log(`\n${icono} ${mat.toUpperCase()} — ${total} preguntas en ${Object.keys(porMision).length} misiones`);
  MISSIONS.filter(m => m.subject === mat).forEach(m => {
    const n = (porMision[m.title] || []).length;
    const pos = (porMision[m.title] || []).reduce((acc, q) => { acc[q.c]++; return acc; }, [0, 0, 0, 0]);
    console.log(`   · ${String(n).padStart(3)} · ${m.title}${n ? `   (posición correcta A/B/C/D: ${pos.join('/')})` : ''}`);
  });
});
const totalBanco = Object.keys(CAMP_BANK).reduce((a, k) => a + CAMP_BANK[k].length, 0);
console.log(`\nBanco completo: ${totalBanco} preguntas en ${Object.keys(CAMP_BANK).length} materias.`);

console.log('\n─────────────────────────────────');
if (fallos) { console.log(`❌ ${fallos} problema(s) encontrado(s).\n`); process.exit(1); }
console.log('✅ TODO EN VERDE: materias, banco, estilos y ruleta al día.\n');
