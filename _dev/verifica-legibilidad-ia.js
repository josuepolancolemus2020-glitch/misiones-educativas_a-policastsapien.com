#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════
   verifica-legibilidad-ia.js · que la Ruta de la Máquina que Aprende se pueda
   LEER en cuarto grado

   El autor lo pidió el 16 de septiembre de 2026 con estas palabras: «es un
   contenido que debe aplicarlo y entenderlo tanto un alumno de 4º como un
   adolescente adulto de bachillerato, aquí las barreras de edad deben ser para
   todos similares». Se midió con `_dev/mide-legibilidad.js` antes de tocar
   nada, contra misiones de primaria del propio catálogo, y el problema NO era
   el vocabulario (INFLESZ 77-85, más fácil que primaria): era la CANTIDAD y la
   FORMA. El doble de texto en pantalla, párrafos del doble de largo y frases
   de hasta 84 palabras.

   Lo que aquí se le pide a cada misión de la ruta, bloque por bloque —cada
   sección de la pantalla, los bancos del JS, cada archivo de datos y cada hoja
   de la ficha— es lo que se midió que cumple una misión de primaria:

     · ninguna frase de más de FRASE_MAX palabras;
     · ningún tramo sin corte (un párrafo, una cadena) de más de TRAMO_MAX;
     · ningún bloque con más de MEDIA_BLOQUE palabras por frase de media;
     · y la misión entera con MEDIA_MISION o menos.

   ⚠️ Los umbrales NO se escribieron a ojo: salen de la vara de primaria
   (6,7-7,7 palabras por frase, frase más larga 23-33, tramo 38-61) con algo
   de aire, y del contrato con el que se reescribieron las siete. Bajarlos
   más aprieta el texto hasta que suena a telegrama; subirlos vuelve a dejar
   pasar el párrafo de 100 palabras que un niño no termina.

   ⚠️ Un bloque de menos de MIN_BLOQUE palabras no se juzga: «Genera
   ejercicios personalizados» son 14 palabras largas, y con eso no se puede
   afirmar nada de cómo se lee una sección. La lección de «Cuadrado Perfecto»:
   una sonda que acusa a un archivo sano enseña a no mirarla.

   Está en `npm test`. Se comprobó al revés —pegándole un párrafo de 60
   palabras a una sección— y salió roja nombrando el bloque.

   node _dev/verifica-legibilidad-ia.js
   ═══════════════════════════════════════════════════════════════════════════ */
'use strict';
const path = require('path');
const { bloquesDe, resumen, IA, MIN_BLOQUE } = require('./mide-legibilidad.js');

const FRASE_MAX = 25;
const TRAMO_MAX = 45;
const MEDIA_BLOQUE = 11;
const MEDIA_MISION = 8.5;

let fallos = 0;
const bien = m => console.log('  ✅ ' + m);
const mal = m => { fallos++; console.log('  ❌ ' + m); };

console.log('\n📖 Que la Ruta de la Máquina que Aprende se lea en cuarto grado\n');
console.log(`   frase ≤ ${FRASE_MAX} palabras · tramo ≤ ${TRAMO_MAX} · bloque ≤ ${MEDIA_BLOQUE} pal/frase · misión ≤ ${MEDIA_MISION} pal/frase · bloques de ${MIN_BLOQUE}+ palabras\n`);

IA.forEach(m => {
  const nombre = path.basename(m.dir);
  const bloques = bloquesDe(m);
  const r = resumen(bloques);
  const f0 = fallos;
  bloques.filter(b => b.palabras >= MIN_BLOQUE).forEach(b => {
    if (b.maxFrase > FRASE_MAX) mal(`${nombre} · ${b.donde}: una frase de ${b.maxFrase} palabras («${b.fraseLarga.slice(0, 90)}…»)`);
    if (b.maxTramo > TRAMO_MAX) mal(`${nombre} · ${b.donde}: un tramo sin corte de ${b.maxTramo} palabras`);
    if (b.porFrase > MEDIA_BLOQUE) mal(`${nombre} · ${b.donde}: ${b.porFrase.toFixed(1)} palabras por frase de media`);
  });
  if (r.porFrase > MEDIA_MISION) mal(`${nombre}: ${r.porFrase.toFixed(1)} palabras por frase en la misión entera`);
  if (fallos === f0) bien(`${nombre}: ${r.pantalla} palabras en pantalla · ${r.porFrase.toFixed(1)} pal/frase · frase máx ${r.maxFrase} · tramo máx ${r.maxTramo}`);
});

console.log(`\n${fallos ? '❌' : '✅'} ${fallos} fallo(s)\n`);
process.exit(fallos ? 1 : 0);
