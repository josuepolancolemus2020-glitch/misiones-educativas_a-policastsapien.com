#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   mide-legibilidad.js · cuánto cuesta LEER una misión

   Mide, no opina. Para cada misión saca todo el texto que el alumno lee —lo
   escrito en el HTML, lo que se pinta desde los archivos de datos, los bancos
   del JS y las hojas de la ficha menos la del docente— y le calcula:

     · INFLESZ (Szigriszt-Pazos, la adaptación al español de Flesch):
         206,835 − 62,3 · (sílabas / palabras) − (palabras / frases)
       Cuanto más alto, más fácil. La escala de referencia: > 80 muy fácil,
       65-80 bastante fácil (primaria), 55-65 normal, 40-55 algo difícil,
       < 40 muy difícil.
     · palabras por frase, y la frase más larga;
     · palabras largas (4 sílabas o más), en porcentaje;
     · y el bloque peor de cada misión, para saber por dónde empezar.

   ⚠️ La escala NO es la vara: la vara son las misiones de primaria del propio
   catálogo. «Inteligencia Artificial» son nueve sílabas en dos palabras y a la
   fórmula le parece difícil, y un niño de cuarto la dice todos los días. Por
   eso se corre también con --ref, que mide misiones de I y II Ciclo escritas
   para ese alumno, y el umbral se pone donde ellas están, no donde diga un
   libro de texto.

   node _dev/mide-legibilidad.js               → las misiones de la ruta de IA
   node _dev/mide-legibilidad.js --ref         → las de referencia (primaria)
   node _dev/mide-legibilidad.js --detalle     → bloque por bloque
   node _dev/mide-legibilidad.js <carpeta>…    → las que se pidan
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const RAIZ = path.join(__dirname, '..');

const IA = [
  { dir: 'misiones/1ciclo-que-es-la-ia', html: 'que-es-la-ia.html', ficha: 'fichas/ficha-que-es-la-ia.html', datos: ['js/data/ia-conceptos.js', 'js/data/ia-descubre.js'] },
  { dir: 'misiones/2ciclo-como-aprende-una-maquina', html: 'como-aprende-una-maquina.html', ficha: 'fichas/ficha-como-aprende-una-maquina.html', datos: [] },
  { dir: 'misiones/2y3ciclo-historia-ia', html: 'historia-ia.html', ficha: 'fichas/ficha-historia-ia.html', datos: ['js/data/ia-historia.js'] },
  { dir: 'misiones/3ciclo-ia-generativa', html: 'ia-generativa.html', ficha: 'fichas/ficha-ia-generativa.html', datos: [] },
  { dir: 'misiones/3ciclo-peligros-ia', html: 'peligros-ia.html', ficha: 'fichas/ficha-peligros-ia.html', datos: ['js/data/ia-peligros.js'] },
  { dir: 'misiones/3ciclo-albores-singularidad', html: 'albores-singularidad.html', ficha: 'fichas/ficha-albores-singularidad.html', datos: ['js/data/ia-actualidad.js'] },
  { dir: 'misiones/3ciclo-escenarios-porvenir', html: 'escenarios-porvenir.html', ficha: 'fichas/ficha-escenarios-porvenir.html', datos: ['js/data/ia-futuros.js'] },
];
/* Misiones escritas para primaria, que son la vara. */
const REF = [
  { dir: 'misiones/1ciclo-segundo-grado' },
  { dir: 'misiones/2ciclo-multiplos-divisores-primos' },
  { dir: 'misiones/2ciclo-fracciones-multiplicar-dividir' },
  { dir: 'misiones/2ciclo-perimetro-cuadrilateros' },
  { dir: 'misiones/2y3ciclo-fracciones' },
];

// ───────────────────────────────────────────── sílabas y frases ──
const esVocal = c => 'aeiouáéíóúü'.includes(c);
const esFuerte = c => 'aeoáéóíú'.includes(c);   // las débiles con tilde rompen el diptongo
function silabas(palabra) {
  const w = palabra.toLowerCase().replace(/[^a-záéíóúüñ]/g, '');
  if (!w) return 0;
  let n = 0, prev = null;
  for (const c of w) {
    if (esVocal(c)) {
      if (prev === null) n++;
      else if (esFuerte(prev) && esFuerte(c)) n++;
      prev = c;
    } else prev = null;
  }
  return Math.max(1, n);
}
function frases(texto) {
  /* ⚠️ Primero por RENGLÓN y después por puntuación. Cada cadena de un banco
     y cada bloque del HTML llega como un renglón aparte; la primera versión
     colapsaba los saltos antes de cortar y pegaba tres cadenas seguidas en
     una «frase de 219 palabras» que no leía nadie. */
  /* ⚠️ Y « · » corta ítem. Es el separador de listas de todo el repositorio
     —«A 🍎 Le pone nombre · B 👤 Reconoce caras · C …»— y sin esta línea una
     leyenda de siete renglones se contaba como UNA frase de treinta y una
     palabras. El lector ve siete cosas cortas; la sonda veía un muro. Una
     medida que acusa a un archivo sano enseña a no mirarla. */
  return texto.split(/\n+/).flatMap(r => r.replace(/\s+/g, ' ').split(/(?<=[.!?…])\s+(?=[^a-záéíóúñ]|$)|\s+·\s+/))
    .map(s => s.trim()).filter(s => s.split(/\s+/).filter(Boolean).length >= 3);
}
/* El tramo más largo sin un corte de bloque: un párrafo en pantalla, una
   cadena en un banco. Frases cortas dentro de un párrafo de 120 palabras
   siguen siendo un muro de texto en un teléfono. */
function tramos(texto) {
  return texto.split(/\n+/).map(r => r.split(/\s+/).filter(w => /[a-záéíóúüñ]/i.test(w)).length);
}
function mide(texto) {
  const fs_ = frases(texto);
  if (!fs_.length) return null;
  let palabras = 0, sil = 0, largas = 0, maxFrase = 0, fraseLarga = '';
  fs_.forEach(f => {
    const ws = f.split(/\s+/).filter(w => /[a-záéíóúüñ]/i.test(w));
    palabras += ws.length;
    if (ws.length > maxFrase) { maxFrase = ws.length; fraseLarga = f; }
    ws.forEach(w => { const s = silabas(w); sil += s; if (s >= 4) largas++; });
  });
  if (!palabras) return null;
  const inflesz = 206.835 - 62.3 * (sil / palabras) - (palabras / fs_.length);
  const maxTramo = Math.max(0, ...tramos(texto));
  return { frases: fs_.length, palabras, inflesz, porFrase: palabras / fs_.length, maxFrase, fraseLarga, maxTramo, largas: 100 * largas / palabras };
}

// ───────────────────────────────────────────── de dónde sale el texto ──
const limpiaHtml = h => h
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<\/?(p|li|h[1-6]|td|th|div|tr|details|summary|label|button|ul|ol|table|section)\b[^>]*>|<br\s*\/?>/gi, '\n')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();

function seccionesHtml(html) {
  /* Cada <div class="sec…" id="s-…"> hasta el siguiente: es lo que el alumno
     ve pantalla por pantalla. Se corta antes de <nav>/<footer>. */
  const out = [];
  const re = /<div class="sec[^"]*" id="(s-[a-z0-9-]+)"[^>]*>/g;
  const idx = [];
  let m; while ((m = re.exec(html))) idx.push({ id: m[1], i: m.index });
  const finMain = Math.min(...['<nav', '<footer'].map(t => { const j = html.indexOf(t, idx.length ? idx[idx.length - 1].i : 0); return j < 0 ? html.length : j; }));
  idx.forEach((s, k) => {
    const fin = k + 1 < idx.length ? idx[k + 1].i : finMain;
    out.push({ nombre: s.id, texto: limpiaHtml(html.slice(s.i, fin)) });
  });
  return out;
}
function cadenasJs(src) {
  /* Los bancos del JS: cadenas largas, que son las que lee el alumno. Se quitan
     los comentarios antes —la lección de siempre— y la plantilla de impresión,
     que es CSS. */
  const sin = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:\\])\/\/[^\n]*/g, '$1');
  const out = [];
  const re = /'((?:[^'\\\n]|\\.)*)'|"((?:[^"\\\n]|\\.)*)"|`((?:[^`\\]|\\.)*)`/g;
  let m;
  while ((m = re.exec(sin))) {
    const s = (m[1] ?? m[2] ?? m[3] ?? '');
    if (s.length < 40 || /\{margin|<style|font-family|@page|^[\s\S]*\$\{[\s\S]*\}[\s\S]*\$\{/.test(s)) continue;
    const t = limpiaHtml(s.replace(/\\n/g, '\n').replace(/\\'/g, "'"));
    if (t.split(/\s+/).length >= 4) out.push(t);
  }
  return out;
}
function cadenasDatos(rel) {
  const mod = require(path.join(RAIZ, rel));
  const out = [];
  const anda = v => {
    if (typeof v === 'string') { if (v.length >= 20) out.push(limpiaHtml(v)); }
    else if (Array.isArray(v)) v.forEach(anda);
    else if (v && typeof v === 'object') Object.values(v).forEach(anda);
  };
  anda(mod);
  return out;
}
function paginasFicha(rel) {
  if (!fs.existsSync(path.join(RAIZ, rel))) return [];
  const html = fs.readFileSync(path.join(RAIZ, rel), 'utf8');
  const pags = html.split(/<section class="pagina">/).slice(1);
  return pags.map((p, i) => ({ i: i + 1, texto: limpiaHtml(p.replace(/<div class="nota-doc">[\s\S]*?<\/div>\s*<\/div>/, '').replace(/<div class="pauta">[\s\S]*?<\/div>\s*<\/div>/, '')) }))
    .filter(p => !/Hoja del Docente|Pauta de correcci/i.test(p.texto.slice(0, 200)));
}

// ───────────────────────────────────────────── una misión entera ──
function bloquesDe(m) {
  const html = fs.readFileSync(path.join(RAIZ, m.dir, m.html), 'utf8');
  const bloques = seccionesHtml(html).map(s => ({ donde: 'pantalla · ' + s.nombre, texto: s.texto }));
  const jsDir = path.join(RAIZ, m.dir, 'js');
  if (fs.existsSync(jsDir)) fs.readdirSync(jsDir).filter(f => /\.js$/.test(f) && !/html2canvas|-en\.js$|min\.js$/.test(f)).forEach(f => {
    const cad = cadenasJs(fs.readFileSync(path.join(jsDir, f), 'utf8'));
    if (cad.length) bloques.push({ donde: 'bancos · ' + f, texto: cad.join('\n') });
  });
  (m.datos || []).forEach(d => bloques.push({ donde: 'datos · ' + path.basename(d), texto: cadenasDatos(d).join('\n') }));
  if (m.ficha) paginasFicha(m.ficha).forEach(p => bloques.push({ donde: 'ficha · hoja ' + p.i, texto: p.texto }));
  return bloques.map(b => Object.assign(b, mide(b.texto) || {})).filter(b => b.palabras);
}
const MIN_BLOQUE = 30; /* con menos palabras un bloque no dice nada de sí: «Genera ejercicios personalizados» son 14 palabras largas y daba INFLESZ −7 en las siete */
function resumen(bloques) {
  const tot = bloques.reduce((a, b) => { a.p += b.palabras; a.f += b.frases; a.s += b.palabras * (206.835 - b.inflesz - b.porFrase) / 62.3; a.l += b.largas * b.palabras / 100; a.max = Math.max(a.max, b.maxFrase); a.tramo = Math.max(a.tramo, b.maxTramo); if (!/^ficha/.test(b.donde)) a.pantalla += b.palabras; return a; }, { p: 0, f: 0, s: 0, l: 0, max: 0, tramo: 0, pantalla: 0 });
  const inflesz = 206.835 - 62.3 * (tot.s / tot.p) - (tot.p / tot.f);
  const conTexto = bloques.filter(b => b.palabras >= MIN_BLOQUE);
  const peor = (conTexto.length ? conTexto : bloques).slice().sort((a, b) => (b.porFrase - a.porFrase))[0];
  return { palabras: tot.p, pantalla: tot.pantalla, inflesz, porFrase: tot.p / tot.f, maxFrase: tot.max, maxTramo: tot.tramo, largas: 100 * tot.l / tot.p, peor };
}
function descubre(dir) {
  const ia = IA.find(m => m.dir === dir);
  if (ia) return ia;
  const d = path.join(RAIZ, dir);
  const html = fs.readdirSync(d).find(f => /\.html$/.test(f) && !/^juego-/.test(f));
  return { dir, html };
}

// ───────────────────────────────────────────── main ──
const args = process.argv.slice(2);
const detalle = args.includes('--detalle');
const lista = args.includes('--ref') ? REF.map(r => descubre(r.dir))
  : args.filter(a => !a.startsWith('--')).length ? args.filter(a => !a.startsWith('--')).map(a => descubre(a.replace(/\/$/, '')))
  : IA;

console.log('\n📖 Cuánto cuesta leer · palabras (en pantalla / con la ficha) · INFLESZ (más alto = más fácil) · palabras por frase · frase más larga · tramo más largo sin corte · palabras de 4+ sílabas\n');
const filas = [];
lista.forEach(m => {
  const bloques = bloquesDe(m);
  const r = resumen(bloques);
  filas.push({ m, r, bloques });
  console.log(`${path.basename(m.dir).padEnd(38)} ${String(r.pantalla).padStart(5)}/${String(r.palabras).padStart(5)} pal · INFLESZ ${r.inflesz.toFixed(1).padStart(5)} · ${r.porFrase.toFixed(1).padStart(4)} pal/frase · frase máx ${String(r.maxFrase).padStart(3)} · tramo máx ${String(r.maxTramo).padStart(3)} · largas ${r.largas.toFixed(1).padStart(4)} %`);
  if (detalle) {
    bloques.slice().sort((a, b) => b.porFrase - a.porFrase).forEach(b => {
      console.log(`     ${b.donde.padEnd(36)} ${String(b.palabras).padStart(5)} pal · ${b.inflesz.toFixed(1).padStart(5)} · ${b.porFrase.toFixed(1).padStart(4)} pal/frase · frase máx ${String(b.maxFrase).padStart(3)} · tramo máx ${b.maxTramo}`);
    });
    console.log(`     ⚠️ frase más larga (${r.maxFrase} palabras): «${bloques.find(b => b.maxFrase === r.maxFrase).fraseLarga.slice(0, 160)}…»`);
  } else {
    console.log(`     bloque con las frases más largas: ${r.peor.donde} (${r.peor.porFrase.toFixed(1)} pal/frase, frase máx ${r.peor.maxFrase}, tramo máx ${r.peor.maxTramo})`);
  }
});
if (filas.length > 1) {
  const med = filas.map(f => f.r.inflesz).sort((a, b) => a - b);
  console.log(`\n   mediana INFLESZ de estas ${filas.length}: ${med[Math.floor(med.length / 2)].toFixed(1)}\n`);
}
module.exports = { silabas, frases, tramos, mide, bloquesDe, resumen, IA, REF, limpiaHtml, MIN_BLOQUE };
