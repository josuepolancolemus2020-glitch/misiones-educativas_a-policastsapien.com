/*
  M.E.T.A.S — _dev/verifica-enlaces-drive.js

  31 misiones tenían un botón «Abrir carpeta en Google Drive» que llevaba a
  una carpeta inexistente: el identificador era de relleno y nunca se
  sustituyó —«1la_celula_recursos», «1pensamiento_computacional_recursos»—.
  Google contesta con un error, y el alumno que toca ahí concluye que la
  aplicación está rota. Esa conclusión no se deshace: no vuelve a tocar.

  Un identificador de Drive de verdad son 28 caracteres o más de letras y
  números mezclando mayúsculas y minúsculas. Los de relleno eran palabras en
  minúscula unidas por guiones bajos, y esa es la señal que los separa.
*/
const fs = require('fs');
const path = require('path');

let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined ? '\n      ' + JSON.stringify(extra, null, 1) : ''));
};

const RE_LINK = /drive\.google\.com\/drive\/folders\/([A-Za-z0-9_-]+)/g;
const plausible = id => id.length >= 28 && /[A-Z]/.test(id) && !/_[a-z]+_|_recursos$/.test(id);

const sospechosos = [];
const promesasHuérfanas = [];
let total = 0;

function recorrer(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name !== 'node_modules') recorrer(p); continue; }
    if (!/\.(html|js)$/.test(e.name) || e.name.includes('html2canvas')) continue;
    const s = fs.readFileSync(p, 'utf8');
    let m;
    RE_LINK.lastIndex = 0;
    while ((m = RE_LINK.exec(s))) {
      total++;
      if (!plausible(m[1])) sospechosos.push({ archivo: p, id: m[1] });
    }
    // una promesa de carpeta sin carpeta es deuda a la vista del alumno
    if (/irá agregando recursos en esta carpeta/.test(s) && !RE_LINK.test(s))
      promesasHuérfanas.push(p);
    RE_LINK.lastIndex = 0;
  }
}
for (const d of ['misiones', 'fichas']) if (fs.existsSync(d)) recorrer(d);

console.log(`Enlaces a Google Drive (${total} en misiones/ y fichas/)`);
ok(sospechosos.length === 0,
   'ningún identificador de relleno: todos tienen forma de carpeta real',
   sospechosos.slice(0, 8));
ok(promesasHuérfanas.length === 0,
   'nadie promete una carpeta que no enlaza',
   promesasHuérfanas.slice(0, 8));
ok(total > 0, 'hay enlaces que revisar');

console.log('\n' + (fallos
  ? `✘ ${fallos} comprobaciones fallaron`
  : '✓ ningún botón lleva a una carpeta que no existe'));
console.log('  (que las carpetas reales sigan compartidas no lo puede ver esta sonda:\n'
          + '   habría que abrirlas con una cuenta de Google)');
process.exit(fallos ? 1 : 0);
