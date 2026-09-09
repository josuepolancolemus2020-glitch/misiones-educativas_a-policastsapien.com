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

/* ── El escape que compila y sale en pantalla ──────────────────────────
   `\U0001F1ED` es un escape de PYTHON, no de JavaScript. JS solo entiende
   `\uXXXX` y `\u{XXXXX}`, los dos con u minúscula; con la mayúscula se
   come la barra y pinta el texto pelado. Eso salió publicado el 8 de
   septiembre de 2026 en el Laboratorio de la misión de Aspectos Cívicos:
   donde iba la bandera 🇭🇳 el alumno leía «U0001F1EDU0001F1F3».

   Entra aquí y no en otra sonda porque es exactamente el mismo daño que
   esta vigila: el archivo COMPILA, `node --check` lo da por bueno, el
   navegador no dice nada y el estropicio solo se ve mirando la pantalla.
   Y se cuela por donde se coló: al escribir bancos de datos con un guion
   de Python, `'\\U0001F1ED'` deja el escape crudo en el archivo.

   ⚠️ Los COMENTARIOS se quitan antes de mirar, que es la regla de siempre:
   este bloque explica el problema escribiendo el escape, así que buscarlo a
   secas hacía que la sonda se acusara a sí misma. Es la cuarta vez que
   muerde la misma trampa (verifica-legal, verifica-barra-secciones y
   verifica-teclado fueron las tres primeras). */
const sinComentarios = t => String(t)
  .replace(/\/\*[\s\S]*?\*\//g, '')   // de bloque
  .replace(/(^|[^:])\/\/.*$/gm, '$1'); // de línea, sin comerse el // de una URL
let escapes = 0;
for (const rel of archivos) {
  const txt = sinComentarios(fs.readFileSync(path.join(RAIZ, rel), 'utf8'));
  const encontrados = txt.match(/\\U[0-9A-Fa-f]{8}/g);
  if (encontrados) {
    escapes++;
    const unico = [...new Set(encontrados)];
    console.log(`  ✗ ${rel}\n      ${encontrados.length} escape(s) de Python que JS no entiende: ${unico.slice(0, 4).join(' ')}${unico.length > 4 ? '…' : ''}`);
    console.log('      se escribe el emoji de verdad, o \\u{1F1ED} con u minúscula y llaves');
  }
}

console.log('\n' + '─'.repeat(50));
if (malos) { console.log(`✖ ${malos} de ${archivos.length} archivos no compilan: lo que haya dentro no se ejecuta y la pantalla no lo dice.`); }
if (escapes) { console.log(`✖ ${escapes} archivo(s) con escapes \\U de Python: compilan, pero el alumno lee el código en vez del emoji.`); }
if (malos || escapes) process.exit(1);
console.log(`✅ Los ${archivos.length} archivos de JavaScript compilan, y ninguno lleva escapes que JS no entienda.`);
