/* ============================================================
   M.E.T.A.S · ¿En qué letra están las respuestas correctas?
   ------------------------------------------------------------
   SOLO MIDE, no cambia nada.

   Los tres bancos de opción múltiple de una misión se pintan en
   ORDEN FIJO (el motor no baraja esas opciones): el quiz de
   comprensión (qzData), la selección múltiple de la evaluación
   final (evalMCBank) y completa la oración (cmpData). Si al
   escribir el banco la correcta quedó siempre en la misma letra,
   se puede aprobar sin leer.

   Además informa dos cosas que hay que saber ANTES de arreglar:
   - si la misión tiene traducción de autor (-en.js), porque sus
     bancos van índice a índice y habría que moverlos a la par;
   - si el banco vive en un archivo aparte (banco compartido).

   Uso:  node _dev/mide-reparto-respuestas.js
         node _dev/mide-reparto-respuestas.js --detalle
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const DETALLE = process.argv.includes('--detalle');
const LIMITE = 0.4;                       /* ninguna letra debe pasar del 40% */
const LETRAS = ['a', 'b', 'c', 'd', 'e', 'f'];
const BANCOS = [['qzData', 'c'], ['evalMCBank', 'a'], ['cmpData', 'c']];

function ubicaLiteral(txt, nombre) {
  const m = new RegExp('(?:const|let|var)\\s+' + nombre + '\\s*=\\s*\\[').exec(txt);
  if (!m) return null;
  const inicio = m.index + m[0].length - 1;
  let prof = 0, dentro = false, comilla = '', esc = false;
  for (let i = inicio; i < txt.length; i++) {
    const ch = txt[i];
    if (esc) { esc = false; continue; }
    if (dentro) { if (ch === '\\') esc = true; else if (ch === comilla) dentro = false; continue; }
    if (ch === '"' || ch === "'" || ch === '`') { dentro = true; comilla = ch; continue; }
    if (ch === '[' || ch === '{') prof++;
    else if (ch === ']' || ch === '}') { prof--; if (prof === 0) return txt.slice(inicio, i + 1); }
  }
  return null;
}

const opcionesDe = q => Array.isArray(q.o) ? q.o : (Array.isArray(q.opts) ? q.opts : null);

/* ── Recorre las misiones ── */
const MIS = path.join(RAIZ, 'misiones');
const filas = [];
let conTraduccion = 0;

for (const dir of fs.readdirSync(MIS).sort()) {
  const js = path.join(MIS, dir, 'js');
  if (!fs.existsSync(js)) continue;
  const archivos = fs.readdirSync(js).filter(f => f.endsWith('.js') && !f.includes('html2canvas'));
  /* Algunas misiones traen varios JS (widgets de interacción aparte): el
     principal es el que declara los bancos, no el primero de la carpeta. */
  const candidatos = archivos.filter(f => !f.endsWith('-en.js'));
  const principal = candidatos.find(f => /(?:const|let|var)\s+qzData\s*=\s*\[/.test(fs.readFileSync(path.join(js, f), 'utf8')))
    || candidatos.sort((a, b) => fs.statSync(path.join(js, b)).size - fs.statSync(path.join(js, a)).size)[0];
  if (!principal) continue;
  const tieneEn = archivos.some(f => f.endsWith('-en.js'));
  if (tieneEn) conTraduccion++;

  const txt = fs.readFileSync(path.join(js, principal), 'utf8');
  const fila = { mision: dir, archivo: principal, tieneEn, bancos: {} };

  for (const [nombre, clave] of BANCOS) {
    const src = ubicaLiteral(txt, nombre);
    if (!src) { fila.bancos[nombre] = { estado: 'no encontrado' }; continue; }
    let banco;
    try { banco = eval(src); } catch (e) { fila.bancos[nombre] = { estado: 'ilegible' }; continue; }
    if (!Array.isArray(banco) || !banco.length) { fila.bancos[nombre] = { estado: 'vacío' }; continue; }
    const cuenta = [0, 0, 0, 0, 0, 0];
    let total = 0;
    banco.forEach(q => {
      if (typeof q[clave] === 'number' && opcionesDe(q)) { cuenta[q[clave]]++; total++; }
    });
    if (!total) { fila.bancos[nombre] = { estado: 'sin índice de respuesta' }; continue; }
    const peor = Math.max(...cuenta);
    fila.bancos[nombre] = {
      estado: 'ok', total, cuenta,
      pct: peor / total,
      letra: LETRAS[cuenta.indexOf(peor)],
    };
  }
  filas.push(fila);
}

/* ── Informe ── */
const sesgados = [];
console.log('M.E.T.A.S · reparto de respuestas correctas · ' + filas.length + ' misiones medidas\n');

for (const fila of filas) {
  const partes = [];
  let malEnEsta = false;
  for (const [nombre] of BANCOS) {
    const b = fila.bancos[nombre];
    if (!b || b.estado !== 'ok') { partes.push(`${nombre}: ${b ? b.estado : 'n/d'}`); continue; }
    const mal = b.pct > LIMITE;
    if (mal) { malEnEsta = true; sesgados.push({ mision: fila.mision, banco: nombre, ...b }); }
    partes.push(`${nombre} ${b.total}q ${Math.round(b.pct * 100)}%${b.letra}${mal ? ' ✘' : ' ✔'}`);
  }
  if (DETALLE || malEnEsta) {
    console.log((malEnEsta ? '✘ ' : '✔ ') + fila.mision + (fila.tieneEn ? '  🌐' : '') + '\n    ' + partes.join(' · '));
  }
}

/* ── Resumen ── */
const porBanco = {};
BANCOS.forEach(([n]) => porBanco[n] = { medidos: 0, sesgados: 0, letras: {} });
for (const fila of filas) {
  BANCOS.forEach(([n]) => {
    const b = fila.bancos[n];
    if (!b || b.estado !== 'ok') return;
    porBanco[n].medidos++;
    if (b.pct > LIMITE) {
      porBanco[n].sesgados++;
      porBanco[n].letras[b.letra] = (porBanco[n].letras[b.letra] || 0) + 1;
    }
  });
}

console.log('\n══════════ RESUMEN ══════════');
BANCOS.forEach(([n]) => {
  const p = porBanco[n];
  const letras = Object.entries(p.letras).map(([l, c]) => `${l}=${c}`).join(' ') || 'ninguna';
  console.log(`${n.padEnd(12)} ${p.sesgados} de ${p.medidos} misiones pasan del ${LIMITE * 100}%  (letra dominante: ${letras})`);
});
BANCOS.forEach(([n]) => {
  const preguntas = filas.reduce((suma, f) => suma + ((f.bancos[n] && f.bancos[n].total) || 0), 0);
  console.log(`${''.padEnd(12)}   ${preguntas} preguntas medidas en ${n}`);
});
const misionesConSesgo = new Set(sesgados.map(s => s.mision));
const limpias = filas.filter(f => !misionesConSesgo.has(f.mision)).map(f => f.mision);
if (limpias.length) console.log('\nMisiones sin sesgo en ningún banco: ' + limpias.join(', '));
console.log(`\nMisiones con al menos un banco sesgado: ${misionesConSesgo.size} de ${filas.length}`);
console.log(`Misiones con traducción de autor (-en.js): ${conTraduccion}` +
  ` · de ellas sesgadas: ${filas.filter(f => f.tieneEn && misionesConSesgo.has(f.mision)).length}`);

const peores = sesgados.sort((a, b) => b.pct - a.pct).slice(0, 8);
if (peores.length) {
  console.log('\nLos casos más extremos:');
  peores.forEach(s => console.log(`  ${Math.round(s.pct * 100)}% en «${s.letra}» · ${s.banco} · ${s.mision} (${s.total} preguntas)`));
}
console.log('\nNota: esta herramienta no modifica nada. El arreglo automático de F.A.R.O');
console.log('(_dev/reparte-respuestas.js) NO se puede aplicar tal cual aquí mientras las');
console.log('misiones traducidas tengan sus bancos índice a índice en el -en.js.');
