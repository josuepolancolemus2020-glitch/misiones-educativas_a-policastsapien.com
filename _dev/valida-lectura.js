/* ══════════════════════════════════════════════════════════════
   Validador del corpus de lectura (js/data/lectura-textos.js)

   Comprueba lo que a ojo se escapa y en el aula cuesta caro:
   · 50 textos por grado, largo dentro de la banda de palabras;
   · 5 preguntas exactas por texto, con la mezcla de tipos del grado;
   · ids únicos y estables (L<grado>-NN), títulos únicos;
   · críticas que empiezan con «Respuesta abierta»;
   · preguntas con sus signos ¿?;
   · sin dobles espacios ni espacios colgantes;
   · 3 opciones de selección múltiple por pregunta (o) con su correcta
     (c), sin repetirse, cortas para caber impresas, y con la letra
     correcta bien repartida entre a, b y c (la hoja la contesta el
     alumno: un patrón se aprende más rápido que el texto).

   Se corre antes de publicar cualquier cambio del corpus:
       node _dev/valida-lectura.js
══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(path.join(__dirname, '..', 'js', 'data', 'lectura-textos.js'), 'utf8');
const LECTURA_TEXTOS = new Function(src + '; return LECTURA_TEXTOS;')();

const BANDAS = { 2: [55, 75], 3: [75, 95], 4: [95, 115], 5: [110, 135], 6: [125, 150], 7: [140, 170], 8: [155, 185], 9: [170, 200] };
const MEZCLA = g => (g <= 4 ? { literal: 3, inferencial: 1, critica: 1 } : g <= 8 ? { literal: 2, inferencial: 2, critica: 1 } : { literal: 1, inferencial: 2, critica: 2 });

let errores = 0, avisos = 0;
const err = m => { errores++; console.log('  ❌ ' + m); };
const aviso = m => { avisos++; console.log('  ⚠️  ' + m); };
const ids = new Set(), titulos = new Set();

for (const g of [2, 3, 4, 5, 6, 7, 8, 9]) {
  const lote = LECTURA_TEXTOS[g] || [];
  const [min, max] = BANDAS[g];
  const mezcla = MEZCLA(g);
  console.log(`\n═══ ${g}º grado — ${lote.length} textos (banda ${min}–${max} palabras) ═══`);
  if (lote.length < 50) err(`solo ${lote.length} textos: deben ser 50 como mínimo`);
  const distC = [0, 0, 0];
  lote.forEach((t, i) => {
    const quien = `${t.id || '#' + i} «${t.titulo || 'sin título'}»`;
    if (!/^L\d-\d\d$/.test(t.id || '')) err(`${quien}: id inválido (formato L<grado>-NN)`);
    if (ids.has(t.id)) err(`${quien}: id repetido`); ids.add(t.id);
    const titN = String(t.titulo || '').toLowerCase();
    if (titulos.has(titN)) err(`${quien}: título repetido`); titulos.add(titN);
    const n = String(t.texto || '').trim().split(/\s+/).length;
    if (n < min || n > max) err(`${quien}: ${n} palabras, fuera de la banda ${min}–${max}`);
    if (/\s\s/.test(t.texto)) err(`${quien}: dobles espacios en el texto`);
    const pg = t.preguntas || [];
    if (pg.length !== 5) err(`${quien}: ${pg.length} preguntas (deben ser 5)`);
    const cuenta = { literal: 0, inferencial: 0, critica: 0 };
    pg.forEach((p, j) => {
      if (!cuenta.hasOwnProperty(p.tipo)) { err(`${quien} p${j + 1}: tipo desconocido «${p.tipo}»`); return; }
      cuenta[p.tipo]++;
      if (!/¿/.test(p.q) || !/\?/.test(p.q)) err(`${quien} p${j + 1}: faltan signos ¿? en la pregunta`);
      if (p.tipo === 'critica' && !/^Respuesta abierta/i.test(p.r)) err(`${quien} p${j + 1}: la guía crítica debe empezar con «Respuesta abierta»`);
      if (!String(p.r || '').trim()) err(`${quien} p${j + 1}: sin respuesta guía`);
      if (!Array.isArray(p.o) || p.o.length !== 3) err(`${quien} p${j + 1}: deben ser 3 opciones de selección múltiple`);
      else {
        if (p.o.some(x => !String(x || '').trim())) err(`${quien} p${j + 1}: opción vacía`);
        if (new Set(p.o.map(x => String(x).toLowerCase().trim())).size !== 3) err(`${quien} p${j + 1}: opciones repetidas`);
        p.o.forEach(x => { if (String(x).length > 90) err(`${quien} p${j + 1}: opción de más de 90 caracteres (no cabe impresa)`); });
        if (!(p.c >= 0 && p.c <= 2)) err(`${quien} p${j + 1}: c debe ser 0, 1 o 2`);
        else distC[p.c]++;
      }
    });
    Object.keys(mezcla).forEach(k => {
      if (cuenta[k] !== mezcla[k]) err(`${quien}: ${cuenta[k]} pregunta(s) ${k}, la mezcla de ${g}º pide ${mezcla[k]}`);
    });
  });
  if (lote.length) {
    const ns = lote.map(t => String(t.texto || '').trim().split(/\s+/).length);
    console.log(`  📏 palabras: mín ${Math.min(...ns)} · máx ${Math.max(...ns)} · promedio ${Math.round(ns.reduce((a, b) => a + b, 0) / ns.length)}`);
    const totC = distC[0] + distC[1] + distC[2];
    if (totC) {
      const pct = distC.map(x => Math.round(x * 100 / totC));
      console.log(`  🔤 correcta en: a ${pct[0]}% · b ${pct[1]}% · c ${pct[2]}%`);
      if (Math.max(...pct) > 45) err(`la correcta cae demasiado en una misma letra (a ${pct[0]}% · b ${pct[1]}% · c ${pct[2]}%)`);
    }
  }
}

console.log(`\n${errores ? '❌ ' + errores + ' error(es)' : '✅ corpus válido'}${avisos ? ' · ' + avisos + ' aviso(s)' : ''}`);
process.exit(errores ? 1 : 0);
