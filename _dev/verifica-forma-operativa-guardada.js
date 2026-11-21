#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · La forma de la prueba operativa se recuerda al recargar
   ------------------------------------------------------------
   Números decimales guardaba la forma del examen conceptual pero no
   la de la prueba operativa: su saveProgress() dejaba fuera
   evalOpFormNum y su loadProgress() no lo leía. Al recargar la
   página la operativa volvía a la Forma 1, y el maestro que reparte
   una forma por grupo le daba al segundo grupo la misma prueba que
   al primero. Las demás misiones del mismo motor sí la guardaban;
   esta se quedó atrás sin que nada lo dijera.

   Lo que se pide, a cada misión que trae prueba operativa
   (evalOpFormNum) y guarda su progreso con el motor de siempre
   (saveProgress con evalFormNum dentro):
     1. que lo que escribe en localStorage lleve evalOpFormNum;
     2. que al cargar lo lea de vuelta (… = s.evalOpFormNum).

   Las misiones con su propio motor y sin evalFormNum en el guardado
   no entran: no se les puede pedir «como las demás» algo que no
   hacen con ninguna de sus formas.

   Uso:  node _dev/verifica-forma-operativa-guardada.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const DIR = path.join(RAIZ, 'misiones');

let fallos = 0, revisadas = 0;

for (const carpeta of fs.readdirSync(DIR).sort()) {
  const js = path.join(DIR, carpeta, 'js');
  if (!fs.existsSync(js)) continue;
  for (const f of fs.readdirSync(js).filter(n => n.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(js, f), 'utf8');
    /* Trae prueba operativa propia: declara su contador de forma. */
    if (!/\b(let|var)\b[^;\n]*\bevalOpFormNum\s*=/.test(src)) continue;
    /* Lo que la misión escribe en su llave de progreso. */
    const escrituras = src.match(/localStorage\.setItem\(\s*SAVE_KEY\s*,[^;]*/g) || [];
    const guardado = escrituras.find(e => /\bevalFormNum\b/.test(e));
    if (!guardado) continue;
    revisadas++;
    const rel = path.join('misiones', carpeta, 'js', f);
    const guarda = /\bevalOpFormNum\b/.test(guardado);
    const lee = /\bevalOpFormNum\s*=\s*[A-Za-z_$][\w$]*\.evalOpFormNum\b/.test(src);
    if (guarda && lee) continue;
    fallos++;
    console.log('  ✘ ' + rel + ': ' +
      [!guarda && 'saveProgress no guarda evalOpFormNum', !lee && 'loadProgress no lo lee'].filter(Boolean).join(' y '));
  }
}

if (!revisadas) { console.log('  ✘ no encontré ninguna misión con prueba operativa: la sonda no está mirando donde debe'); process.exit(1); }
console.log(`\n${fallos ? '❌' : '✅'} ${revisadas} misiones con prueba operativa revisadas; ${fallos} no recuerdan su forma al recargar.\n`);
process.exit(fallos ? 1 : 0);
