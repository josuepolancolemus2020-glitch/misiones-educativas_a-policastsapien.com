#!/usr/bin/env node
/* Mide cuánto le falta al RELATO de cada misión, para saber por dónde leer.

   La normativa del proyecto —«toda misión le pasa a ALGUIEN, y le cuesta
   algo»— es de juicio, no de código: si un dato se cuenta bien o mal lo
   decide una persona leyéndolo. Por eso esta herramienta NO FALLA NUNCA y
   no entra en `npm test`. Lo único que hace es ORDENAR las 83 misiones por
   cuánto le falta a su arranque, que es lo que decide si el alumno sigue
   leyendo, para que quien las lea empiece por las que peor están.

   Es la misma decisión que `mide-reparto-respuestas.js`, que informa de la
   racha más larga y no falla por ella: en una lista al azar las rachas
   pasan, y dar por avería lo que no lo es enseña a no mirar la herramienta.

   Qué mira, y por qué solo eso:

   · el ARRANQUE, no la misión entera. Una misión de catorce pantallas puede
     tener su mejor historia en la pestaña doce y no servir de nada: el
     alumno decide si sigue en los primeros dos párrafos.
   · si hay una PERSONA. No «el agricultor» en abstracto: alguien a quien le
     pasa algo. La lista sale del propio corpus —los oficios y las personas
     que ya salen en las misiones que sí lo hacen—, no de un diccionario.
   · si hay un PRECIO. Lo que se pierde, lo que cuesta, lo que se echa a
     perder, lo que hay que volver a pagar.

   Y avisa de lo que NO puede juzgar: que el relato sea verdad, que el alumno
   lo PRODUZCA en vez de leerlo, y que la historia valga la pena. Eso son 83
   lecturas y no hay atajo.

      node _dev/mide-relato.js              → la tabla, de peor a mejor
      node _dev/mide-relato.js --detalle    → el arranque de cada una, para leer
      node _dev/mide-relato.js --detalle <trozo del título>   → solo esas
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.join(__dirname, '..');

/* ── el catálogo manda: de ahí salen las direcciones, no de la carpeta ── */
const ctx = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/data/misiones.js'), 'utf8'), ctx);
const MISSIONS = vm.runInContext('MISSIONS', ctx).slice();

/* Las 8 del maestro viven en otra lista (js/tools/formacion-docente.js) y
   entran igual: ahí el que lee es el maestro, y la norma no cambia —hay
   alguien y hay un precio, solo que el precio lo paga él—. Se sacan del
   archivo por su `url`, que es lo único que hace falta aquí. */
{
  const doc = fs.readFileSync(path.join(RAIZ, 'js/tools/formacion-docente.js'), 'utf8');
  const re = /\{\s*t:\s*'((?:[^'\\]|\\.)*)'[\s\S]{0,900}?url:\s*'(misiones\/docente-[^']+)'/g;
  let m, n = 900;
  while ((m = re.exec(doc))) {
    MISSIONS.push({ id: ++n, title: m[1].replace(/\\'/g, "'"), subject: 'docente',
                    grade: 'Formación', url: m[2] });
  }
}

/* ── PERSONAS: quién puede aparecer en una historia de este país ──────────
   Salen de las misiones que YA lo hacen bien (el productor de plátano, el
   maestro que paga el bus, la mamá que compra la malla) más los oficios del
   corpus. No vale «la gente» ni «una persona»: eso es no nombrar a nadie. */
const PERSONAS = [
  'maestr', 'profesor', 'alumn', 'estudiante', 'niñ', 'niña', 'muchach',
  'mamá', 'papá', 'madre', 'padre', 'abuel', 'hermanit', 'familia',
  'don ', 'doña ', 'señor', 'señora', 'vecin',
  'agricultor', 'productor', 'campesin', 'ganader', 'pescador',
  'vendedor', 'vendedora', 'pulper', 'tendero', 'comerciante', 'cliente',
  'albañil', 'carpinter', 'costurer', 'sastre', 'mecánic', 'chofer',
  'enfermer', 'doctor', 'médic', 'partera', 'bombero', 'policía',
  'director', 'secretari', 'alcalde', 'regidor',
  'compañer', 'amig', 'primo', 'prima', 'tío', 'tía',
];

/* ── PRECIO: lo que cuesta. Un verbo de pérdida, no una palabra de dinero:
   «lempiras» solo no basta —una cuenta de matemáticas los usa sin que a
   nadie le pase nada—, pero «pierde», «se echa a perder» o «lo paga» sí. */
const PRECIOS = [
  'pierde', 'perdió', 'perder', 'pérdida',
  'cuesta', 'costó', 'le sale', 'paga', 'pagó', 'pagar', 'cobra',
  'se queda sin', 'se quedó sin', 'no alcanza', 'no le alcanza', 'no alcanzó',
  'falta', 'faltó', 'sobra', 'sobró', 'de más', 'de menos',
  'se echa a perder', 'se echó a perder', 'se arruina', 'se arruinó',
  'se muere', 'se murió', 'se seca', 'se secó',
  'se salen', 'se salieron', 'se escapan', 'se escaparon',
  'se equivoca', 'se equivocó', 'le falla', 'le falló', 'falla',
  'tira', 'tirar', 'desperdicia', 'desperdició', 'gasta de más',
  'vuelve a comprar', 'comprar otra vez', 'otra vez',
  'se cae', 'se rompe', 'se rompió', 'se derrumba',
  'lo paga', 'de su bolsa', 'de su bolsillo',
];

/* ── lo que NO cuenta como historia: el arranque de definición ─────────── */
const DEFINICION = /^(el|la|los|las|un|una)\s+[\wáéíóúñ]+\s+(es|son|se llama|se define|significa|consiste)\b/i;

const limpio = s => s.normalize('NFC')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
  .replace(/&[a-z]+;/g, ' ')
  .replace(/\s+/g, ' ').trim();

/* El arranque: desde el primer <h2> del cuerpo. Antes de él van la marca,
   la barra de XP y los mandos, que son iguales en las 83 y no cuentan. */
function arranque(html) {
  const cuerpo = html.slice(html.search(/<body/i));
  const i = cuerpo.search(/<h2\b/i);
  const t = limpio(i < 0 ? cuerpo : cuerpo.slice(i));
  return t.slice(0, 1100);
}

function mide(txt) {
  const b = txt.toLowerCase();
  const personas = PERSONAS.filter(p => b.includes(p));
  const precios = PRECIOS.filter(p => b.includes(p));
  /* la primera frase de verdad, saltándose el título de la tarjeta */
  const frases = txt.split(/(?<=[.!?…])\s+/).filter(f => f.replace(/[^\wáéíóúñ]/gi, '').length > 25);
  const primera = frases[0] || txt.slice(0, 140);
  return {
    personas, precios,
    definicion: DEFINICION.test(primera.replace(/^[^A-Za-zÁÉÍÓÚÑ]+/, '')),
    primera,
  };
}

const args = process.argv.slice(2);
const detalle = args.includes('--detalle');
const filtro = args.filter(a => !a.startsWith('--')).join(' ').toLowerCase();

const filas = [];
for (const m of MISSIONS) {
  const f = path.join(RAIZ, m.url);
  if (!fs.existsSync(f)) { console.log(`  ⚠ sin archivo: ${m.url}`); continue; }
  if (filtro && !m.title.toLowerCase().includes(filtro)) continue;
  const txt = arranque(fs.readFileSync(f, 'utf8'));
  const r = mide(txt);
  /* Cuánto le falta: sin persona y sin precio es lo más lejos del relato.
     Abrir con una definición suma, porque es justo el arranque que la
     normativa pone en la columna «en vez de». */
  const falta = (r.personas.length ? 0 : 2) + (r.precios.length ? 0 : 2) + (r.definicion ? 1 : 0);
  filas.push({ m, r, falta, txt });
}

filas.sort((a, b) => b.falta - a.falta || a.m.id - b.m.id);

if (detalle) {
  for (const f of filas) {
    console.log(`\n${'─'.repeat(72)}`);
    console.log(`#${f.m.id} · ${f.m.title}  [${f.m.subject} · ${f.m.grade}]  falta:${f.falta}`);
    console.log(`  persona: ${f.r.personas.join(', ') || '—'}`);
    console.log(`  precio:  ${f.r.precios.join(', ') || '—'}`);
    console.log(`  ${f.m.url}`);
    console.log(`\n${f.txt}\n`);
  }
} else {
  console.log('\n════════ CUÁNTO LE FALTA AL ARRANQUE ════════');
  console.log('  (no falla nunca: ordena por dónde leer primero)\n');
  for (const f of filas) {
    const p = f.r.personas.length ? '👤' : '· ';
    const c = f.r.precios.length ? '💸' : '· ';
    const d = f.r.definicion ? '📕' : '  ';
    console.log(`  ${String(f.falta).padStart(2)} ${p}${c}${d}  #${String(f.m.id).padStart(2)} ${f.m.title.slice(0, 44).padEnd(45)} ${f.m.subject}`);
  }
  const sin = filas.filter(f => !f.r.personas.length && !f.r.precios.length).length;
  const def = filas.filter(f => f.r.definicion).length;
  console.log(`\n  misiones medidas: ${filas.length}`);
  console.log(`  sin persona NI precio en el arranque: ${sin}`);
  console.log(`  arrancan con una definición: ${def}`);
  console.log('\n  👤 hay alguien   💸 hay un precio   📕 abre definiendo');
  console.log('\n  Lo que esto NO puede juzgar, y hay que leer: que el relato sea');
  console.log('  VERDAD, que el alumno lo PRODUZCA en vez de leerlo, y que valga');
  console.log('  la pena. Son 83 lecturas y no hay atajo.\n');
}
