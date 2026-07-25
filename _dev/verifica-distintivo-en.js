/* ============================================================
   M.E.T.A.S · Comprobador del distintivo 🌐 EN del catálogo
   ------------------------------------------------------------
   MISIONES_EN (js/data/misiones.js) es una lista escrita a mano:
   es lo que hace que el alumno vea «🌐 EN» en la tarjeta ANTES de
   abrir la misión. Si se desincroniza del disco, el alumno entra
   a buscar un botón que no existe, o al revés: hay traducción y
   nadie se entera.

   Este comprobador la cuadra en las dos direcciones:
   · id marcado pero SIN su archivo <mision>-en.js  → mentira
   · misión con archivo -en.js pero SIN marcar       → olvido

   Uso:  node _dev/verifica-distintivo-en.js
   ============================================================ */
const fs = require('fs'), path = require('path'), vm = require('vm');

const raiz = path.join(__dirname, '..');
const ctx = { console };
vm.createContext(ctx);
const src = fs.readFileSync(path.join(raiz, 'js/data/misiones.js'), 'utf8');
vm.runInContext(src + '\n;globalThis._x={MISSIONS,MISIONES_EN,rutaLabel};', ctx);
const { MISSIONS, MISIONES_EN, rutaLabel } = ctx._x;

/* De 'misiones/2y3ciclo-sensores-robot/sensores-robot.html' sale el
   hermano 'misiones/2y3ciclo-sensores-robot/js/sensores-robot-en.js' */
function rutaDelIngles(url) {
  const dir = path.dirname(url);
  const base = path.basename(url, '.html');
  return path.join(dir, 'js', base + '-en.js');
}

let fallos = 0;
const marcadas = [], sinMarcar = [];

for (const m of MISSIONS) {
  const rel = rutaDelIngles(m.url);
  const existe = fs.existsSync(path.join(raiz, rel));
  const marcada = MISIONES_EN.has(m.id);

  if (marcada && !existe) {
    console.log(`✖ id ${m.id} «${m.title}» está marcada pero falta ${rel}`);
    fallos++;
  } else if (!marcada && existe) {
    console.log(`✖ id ${m.id} «${m.title}» ya tiene traducción y NO está en MISIONES_EN`);
    sinMarcar.push(m);
    fallos++;
  } else if (marcada) {
    marcadas.push(m);
  }
}

/* ids que ni siquiera existen en el catálogo */
const ids = new Set(MISSIONS.map(m => m.id));
for (const id of MISIONES_EN) {
  if (!ids.has(id)) { console.log(`✖ el id ${id} de MISIONES_EN no existe en el catálogo`); fallos++; }
}

console.log('');
if (!fallos) {
  console.log(`✔ el distintivo 🌐 EN cuadra con el disco · ${marcadas.length} misiones traducidas`);
  marcadas
    .sort((a, b) => (a.ruta + a.etapa).localeCompare(b.ruta + b.etapa))
    .forEach(m => console.log(`   ${m.icon} ${m.title} — ${rutaLabel(m)}`));
} else {
  console.log(`✖ ${fallos} problema(s) en MISIONES_EN`);
  process.exit(1);
}
