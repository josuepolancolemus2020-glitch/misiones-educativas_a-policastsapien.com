/* ═══════════════════════════════════════════════════════════════
   🔢 ¿LEE BIEN LOS NÚMEROS?

   js/data/lectura-numerales.js es el que le dice al alumno cuánto vale
   «trescientos cuarenta y cinco mil». Si se equivoca, no falla una
   pantalla: le enseña un número mal. Por eso esto se corre ANTES de
   publicar cualquier cambio de ese archivo o del corpus de números.

   Uso:  node _dev/prueba-numerales.js
═══════════════════════════════════════════════════════════════ */
'use strict';
const path = require('path');
const N = require(path.resolve(__dirname, '..', 'js', 'data', 'lectura-numerales.js'));

let fallos = 0;
const igual = (real, esperado, que) => {
  const ok = JSON.stringify(real) === JSON.stringify(esperado);
  if (!ok) { fallos++; console.log(`  ❌ ${que}\n       salió: ${JSON.stringify(real)}\n     esperado: ${JSON.stringify(esperado)}`); }
  return ok;
};

console.log('\n═══ Leer un número escrito en palabras ═══');
[
  ['cinco', 5], ['quince', 15], ['veintiocho', 28], ['cuarenta y dos', 42],
  ['cien', 100], ['ciento veinte', 120], ['trescientos cuarenta y cinco', 345],
  ['mil', 1000], ['dos mil', 2000], ['dos mil cuatro', 2004],
  ['cien mil', 100000], ['ciento veinte mil', 120000],
  ['cuarenta y dos mil trescientos', 42300],
  ['trescientos cuarenta y cinco mil seiscientos setenta y ocho', 345678],
  ['novecientos noventa y nueve mil novecientos noventa y nueve', 999999],
  ['un millón', 1000000], ['dos millones quinientos mil', 2500000],
].forEach(([txt, v]) => igual(N.valorPalabras(txt.split(' ')), v, `«${txt}» vale ${v}`));

console.log('═══ Escribir un número en cifras y en palabras ═══');
[
  [5, '5', 'cinco'], [100, '100', 'cien'], [999, '999', 'novecientos noventa y nueve'],
  [1000, '1,000', 'mil'], [1200, '1,200', 'mil doscientos'],
  [21000, '21,000', 'veintiún mil'],
  [42300, '42,300', 'cuarenta y dos mil trescientos'],
  [100000, '100,000', 'cien mil'],
  [345678, '345,678', 'trescientos cuarenta y cinco mil seiscientos setenta y ocho'],
  [1000000, '1,000,000', 'un millón'],
].forEach(([v, cif, pal]) => {
  igual(N.enCifras(v), cif, `${v} en cifras es ${cif}`);
  igual(N.enPalabras(v), pal, `${v} en palabras es «${pal}»`);
});

console.log('═══ Ida y vuelta: escribirlo y volverlo a leer ═══');
/* La comprobación que más vale: cualquier número que el motor escriba en
   palabras tiene que poder volver a leerse y dar el mismo valor. */
let idaVuelta = 0;
for (let v = 1; v <= 1000000; v += v < 2000 ? 1 : (v < 100000 ? 997 : 9973)) {
  const leido = N.valorPalabras(N.enPalabras(v).split(' '));
  if (leido !== v) { fallos++; idaVuelta++; if (idaVuelta < 6) console.log(`  ❌ ${v} → «${N.enPalabras(v)}» → ${leido}`); }
}
if (!idaVuelta) console.log('  ✅ todos los números probados vuelven a leerse igual');

console.log('═══ Encontrar los números dentro de un texto ═══');
const detectaDe = txt => N.detectar(txt.trim().split(/\s+/)).map(x => x.v);

igual(detectaDe('La escuela juntó 42,300 tapitas en dos meses.'), [42300, 2],
  'encuentra la cifra con coma de millar y el número en palabras');
igual(detectaDe('Reunieron cuarenta y dos mil tapitas.'), [42000],
  '«cuarenta y dos mil» se lee como UN número, no como tres');
igual(detectaDe('Reunieron cuarenta y dos mil trescientas tapitas.'), [42300],
  'y sigue siendo uno solo cuando lleva centenas detrás');
igual(detectaDe('Un camión llegó con una caja.'), [],
  '«un» y «una» sueltos son artículos, no el número 1');
igual(detectaDe('Compraron un millón de semillas.'), [1000000],
  '«un millón» sí es número: el multiplicador manda');
igual(detectaDe('Había mangos y naranjas, cuarenta y cinco en total.'), [45],
  'la «y» solo alarga el número si detrás viene otro número');
igual(detectaDe('El primer día llegaron veinte niños.'), [20],
  'los ordinales no se cuentan como número');
igual(detectaDe('Pagó L 1,200 por 3 sacos.'), [1200, 3],
  'lee cifras con y sin coma de millar');
igual(detectaDe('Llevó 940, casi lo mismo, y él 1,250.'), [940, 1250],
  'la coma del final es puntuación, la de en medio es separador de millar');
igual(detectaDe('Iban por 12,000; después por 45,000.'), [12000, 45000],
  'un punto y coma detrás del número tampoco lo esconde');

console.log('═══ Valor posicional ═══');
igual(N.cifrasDe(345678).map(c => c.vale), [300000, 40000, 5000, 600, 70, 8],
  'las cifras de 345,678 valen 300,000 · 40,000 · 5,000 · 600 · 70 · 8');
igual(N.cifrasDe(100000).map(c => c.vale), [100000], 'los ceros no se ofrecen como cifra');
igual(N.nombrePosicion(4), 'decenas de millar', 'la posición 4 son decenas de millar');

console.log(`\n${fallos ? '❌ ' + fallos + ' fallo(s)' : '✅ el lector de numerales está bien'}`);
process.exit(fallos ? 1 : 0);
