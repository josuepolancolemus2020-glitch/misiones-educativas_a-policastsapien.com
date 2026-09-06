/* ============================================================
   M.E.T.A.S · Que todo el JavaScript compile
   ------------------------------------------------------------
   No es manía de orden: en este proyecto un error de sintaxis NO
   da la cara. El navegador se calla, deja de ejecutar ese archivo
   y la página sigue pintándose como si nada. Ya pasó, y está
   escrito en CLAUDE.md: un `-en.js` mal cerrado dejaba el botón
   🌐 mudo y la ficha bilingüe imprimía en español, sin un solo
   aviso en pantalla. Lo mismo valdría para una misión entera: el
   alumno vería el texto y ningún botón respondería.

   Se comprueba con `node --check`, que es el mismo analizador que
   trae el navegador y no hace falta instalar nada. No juzga
   estilo: solo dice si el archivo se puede leer entero.

   Uso:  node _dev/verifica-sintaxis.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..');

/* Se pregunta a git qué archivos hay: así no se cuela node_modules ni nada
   que no esté versionado. `www/` se deja fuera a propósito —es la copia de
   Capacitor, va desfasada y se regenera sola— y `android/` tampoco es del
   sitio. Y la maquinaria de la auditoría son guiones de flujo escritos como
   módulos ES (`export const meta`), que no los lee ningún navegador: para
   `node --check` son un error de sintaxis y no lo son. */
const FUERA = [
  f => f.startsWith('www/'),                          // la copia de Capacitor
  f => f.startsWith('android/'),                      // el envoltorio de la app
  f => f.includes('node_modules/'),                   // dependencias
  f => f.startsWith('_dev/auditoria-2026-09/maquinaria/') // módulos ES, no van al navegador
];
const archivos = execSync('git ls-files "*.js"', { cwd: RAIZ, encoding: 'utf8' })
  .trim().split('\n')
  .filter(f => f && !FUERA.some(fn => fn(f)));

let malos = 0;
for (const rel of archivos) {
  const r = spawnSync(process.execPath, ['--check', path.join(RAIZ, rel)], { encoding: 'utf8' });
  if (r.status !== 0) {
    malos++;
    const linea = (r.stderr || '').split('\n').find(l => /SyntaxError/.test(l)) || (r.stderr || '').split('\n')[2] || '';
    console.log(`  ✗ ${rel}\n      ${linea.trim()}`);
  }
}

console.log('\n' + '─'.repeat(50));
if (malos) { console.log(`✖ ${malos} de ${archivos.length} archivos no compilan: lo que haya dentro no se ejecuta y la pantalla no lo dice.`); process.exit(1); }
console.log(`✅ Los ${archivos.length} archivos de JavaScript compilan.`);
