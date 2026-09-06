/*
  M.E.T.A.S — _dev/verifica-encabezados.js

  El texto que desfila detrás del título de cada misión (.hero::before) se
  copiaba junto con el resto del CSS al crear una misión nueva, y se quedaba
  con las palabras de la misión de la que se copió. En Geografía de Honduras
  un niño leía «NEURONA · CEREBRO · MÉDULA · SINAPSIS»; en Sólidos
  Geométricos, «RECTA NUMÉRICA · ORIGEN · ESCALA». Eran 20 misiones.

  La regla: dos misiones solo pueden compartir el desfile si son de la MISMA
  familia (los robots, la programación con el robot, las pruebas de fin de
  grado). Cualquier otro desfile repetido es una copia que se quedó puesta.
*/
const fs = require('fs');
const path = require('path');

// familias declaradas: comparten temario, así que comparten palabras a propósito
const FAMILIAS = [
  ['2y3ciclo-bucles-repetir', '2y3ciclo-detective-bugs', '2y3ciclo-mi-primer-programa',
   '2y3ciclo-pensamiento-computacional', '2y3ciclo-robot-decide', '2y3ciclo-robot-mensajero',
   '2y3ciclo-variables-cajitas'],
  ['2y3ciclo-electricidad-robots', '2y3ciclo-motores-mecanismos', '2y3ciclo-programando-robot',
   '2y3ciclo-que-es-un-robot', '2y3ciclo-robots-problemas'],
  ['fin-de-grado-4to', 'fin-de-grado-5to', 'fin-de-grado-6to', 'fin-de-grado-7mo'],
];
const familiaDe = d => {
  for (let i = 0; i < FAMILIAS.length; i++) if (FAMILIAS[i].indexOf(d) >= 0) return i;
  return null;
};

let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined ? '\n      ' + JSON.stringify(extra, null, 1) : ''));
};

const RE = /\.hero::before\s*\{[^}]*?content:\s*'([^']*)'/;
const porTexto = {};
const sinDesfile = [];

for (const d of fs.readdirSync('misiones')) {
  const dirCss = path.join('misiones', d, 'css');
  if (!fs.existsSync(dirCss)) continue;
  let txt = null;
  for (const f of fs.readdirSync(dirCss)) {
    if (!f.endsWith('.css')) continue;
    const m = RE.exec(fs.readFileSync(path.join(dirCss, f), 'utf8'));
    if (m) { txt = m[1]; break; }
  }
  if (txt === null) { sinDesfile.push(d); continue; }
  (porTexto[txt] = porTexto[txt] || []).push(d);
}

console.log('Desfiles del encabezado');
const prestados = [];
for (const txt of Object.keys(porTexto)) {
  const misiones = porTexto[txt];
  if (misiones.length === 1) continue;
  const fam = familiaDe(misiones[0]);
  const mismaFamilia = fam !== null && misiones.every(m => familiaDe(m) === fam);
  if (!mismaFamilia) prestados.push({ palabras: txt.slice(0, 46) + '…', misiones });
}
ok(prestados.length === 0, 'ninguna misión desfila las palabras de otra', prestados);
ok(Object.keys(porTexto).length > 0, `hay desfiles que revisar (${Object.keys(porTexto).length} textos distintos)`);

// Y la comprobación que delata el caso original: nadie fuera de Recta Numérica
// ni del Sistema Nervioso puede llevar sus palabras.
const AJENAS = [['RECTA NUMÉRICA · ORIGEN', '2ciclo-recta-numerica'],
                ['NEURONA · CEREBRO', '2y3ciclo-sistema-nervioso'],
                ['VALOR POSICIONAL · UNIDAD', '2ciclo-valor-posicional'],
                ['ADJETIVO · CALIFICATIVO', '2y3ciclo-adjetivos']];
for (const [frase, dueno] of AJENAS) {
  const intrusos = [];
  for (const txt of Object.keys(porTexto))
    if (txt.indexOf(frase) === 0) porTexto[txt].forEach(m => { if (m !== dueno) intrusos.push(m); });
  ok(intrusos.length === 0, `«${frase}…» solo en ${dueno}`, intrusos);
}

console.log('\n' + (fallos ? `✘ ${fallos} comprobaciones fallaron` : '✓ cada misión desfila lo suyo'));
process.exit(fallos ? 1 : 0);
