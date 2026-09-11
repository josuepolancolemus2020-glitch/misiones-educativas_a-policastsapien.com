/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · El Kit de Capacitación no le miente al que fotocopia
   ──────────────────────────────────────────────────────────────
   `kit-capacitacion.html` es la hoja que se reparte en las
   capacitaciones, y es papel de verdad: se fotocopia por
   participante y se guarda. Por eso escribe cifras a mano —no
   tiene una sola línea de JavaScript con la que contarlas— y ahí
   está el problema: una cifra escrita a mano envejece sola y
   nadie vuelve a leer el Kit para comprobarla.

   Envejeció dos veces el mismo día:

   · Decía «57 misiones» y «11 rutas» cuando ya eran 68 y 13, y
     su lista de materias no nombraba **E. Cívica** —los símbolos
     patrios y el Himno, que es lo que se estudia en septiembre—
     ni **Repaso General**, con las Pruebas de Fin de Grado. La
     cifra vieja se nota; la materia que falta, no: el maestro
     simplemente no se entera de que existe.
   · Y el pie prometía «una hoja por participante» cuando el Kit
     sale en CUATRO. Quien fotocopiaba para treinta leía 30 hojas
     donde hacían falta 120, y los últimos se quedaban sin el
     guion y sin la lista de comprobación.

   Las dos se descubrieron mirando, que es lo que no se repite.
   Esta sonda las mira sola.

   ⚠️ Los números NO se escriben aquí: se cuentan del catálogo
   (`js/data/misiones.js`) y del PDF. Una sonda con el número
   dentro se pone roja el día que entra una misión, sin que nada
   esté roto, y eso enseña a no mirarla.

   Uso:  node _dev/servidor-estatico.js   (en otra terminal)
         node _dev/verifica-kit-capacitacion.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { abrir } = require('./lib-navegador');

const RAIZ = path.resolve(__dirname, '..');
const BASE = process.env.METAS_BASE || 'http://localhost:8123';
const KIT = 'kit-capacitacion.html';

let fallos = 0, pruebas = 0;
const ok = (cond, txt, extra) => {
  pruebas++;
  if (cond) console.log('  ✅ ' + txt);
  else { fallos++; console.log('  ❌ ' + txt + (extra !== undefined ? '  → ' + JSON.stringify(extra) : '')); }
};

/* Sin tildes y en minúscula: el Kit escribe «E. Cívica» y el catálogo
   guarda «cívica», y las dos tienen que poder compararse. */
const sinTildes = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function catalogo() {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js', 'data', 'misiones.js'), 'utf8') +
    '\nthis.X = { MISSIONS, RUTAS };', ctx);
  return ctx.X;
}

(async () => {
  const { MISSIONS, RUTAS } = catalogo();
  const fuente = fs.readFileSync(path.join(RAIZ, KIT), 'utf8');
  /* Se quitan los comentarios antes de buscar: el sitio donde se explica por
     qué una cifra ya no está es justo donde esa cifra sigue escrita. Es la
     trampa que este repositorio ya mordió cuatro veces. */
  const texto = fuente.replace(/<!--[\s\S]*?-->/g, '');

  console.log('\n📊 Las cifras del catálogo');

  const misiones = MISSIONS.length;
  const rutas = new Set(MISSIONS.map(m => m.ruta).filter(Boolean)).size;

  const dice = (n, que) => new RegExp('\\b' + n + '\\b[^<]{0,40}' + que, 'i').test(sinTildes(texto))
    || new RegExp(que + '[^<]{0,60}\\b' + n + '\\b', 'i').test(sinTildes(texto));

  /* ⚠️ El mensaje tiene que leerse distinto en rojo que en verde. La primera
     versión decía «dice que hay 69 misiones, que son las que hay» y ESO ES LO
     QUE IMPRIMÍA AL FALLAR: se leía como un ✅ con una cruz delante. Ahora la
     línea roja enseña la cifra que el Kit trae escrita, que es el dato con el
     que se arregla. */
  const cifraDe = (que) => {
    const m = new RegExp('\\b(\\d+)\\b[^<]{0,40}' + que, 'i').exec(sinTildes(texto))
      || new RegExp(que + '[^<]{0,60}\\b(\\d+)\\b', 'i').exec(sinTildes(texto))
      || /\bson (\d+) y siguen\b/.exec(sinTildes(texto));
    return m ? parseInt(m[1], 10) : null;
  };
  ok(dice(misiones, 'misiones') || sinTildes(texto).includes('son ' + misiones + ' y siguen'),
    'la cifra de misiones es la del catálogo (' + misiones + ')',
    { elKitDice: cifraDe('misiones'), hay: misiones });
  ok(dice(rutas, 'rutas'), 'la cifra de rutas es la del catálogo (' + rutas + ')',
    { elKitDice: cifraDe('rutas'), hay: rutas });

  /* Que no se le haya quedado dentro la cifra vieja de otra tanda. */
  const otras = (sinTildes(texto).match(/\b(\d+) misiones\b/g) || [])
    .map(s => parseInt(s, 10)).filter(n => n !== misiones);
  ok(!otras.length, 'ninguna cifra de misiones se quedó vieja', otras);

  /* ⚠️ La normativa del papel: una cifra escrita se FECHA. Sin fecha, el
     maestro que lo lea en marzo no sabe si son de este curso o del pasado. */
  ok(/\b(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s+(de\s+)?20\d\d/i.test(texto),
    'las cifras van fechadas, como pide la normativa del papel');

  console.log('\n📚 Las materias que el maestro va a encontrar');
  /* Se busca SOLO dentro del párrafo que presenta el catálogo, no en la hoja
     entera: una materia nombrada de pasada en otro sitio taparía que se cayó
     de la lista, y la lista es lo que el maestro lee para saber qué hay. */
  const parrafos = texto.match(/<p class="nota"[^>]*>[\s\S]*?<\/p>/g) || [];
  const lista = parrafos.find(p => sinTildes(p).includes('catalogo'));
  ok(!!lista, 'el Kit tiene su párrafo de presentación del catálogo');
  const claves = [...new Set(MISSIONS.map(m => m.subject))];
  const faltan = lista ? claves.filter(k => !sinTildes(lista).includes(sinTildes(k))) : claves;
  ok(!faltan.length,
    'ese párrafo nombra las ' + claves.length + ' materias del catálogo',
    faltan);

  console.log('\n🖨️  Lo que se manda a fotocopiar');
  const nav = await abrir();
  try {
    const pg = await nav.newPage();
    const resp = await pg.goto(BASE + '/' + KIT, { waitUntil: 'networkidle' });
    if (!resp || !resp.ok()) {
      ok(false, 'el Kit se abre desde ' + BASE + ' (¿está el servidor estático?)');
    } else {
      const pdf = await pg.pdf({ format: 'Letter', printBackground: true });
      /* Las páginas del PDF, que es la verdad de la impresora. Medir el alto
         en pantalla ancha miente: las columnas se estiran. */
      const hojas = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
      const pie = (await pg.textContent('.pie')) || '';
      const prometidas = (pie.match(/(\d+)\s*hojas?/i) || [])[1];

      ok(prometidas !== undefined, 'el pie dice cuántas hojas se fotocopian', pie.trim());
      if (prometidas !== undefined) {
        ok(Number(prometidas) === hojas,
          'promete ' + prometidas + ' hojas y el PDF sale en ' + hojas,
          { promete: Number(prometidas), imprime: hojas });
      }
    }
  } finally {
    await nav.close();
  }

  console.log('\n' + (fallos
    ? '❌ ' + fallos + ' fallo(s) de ' + pruebas + ' comprobaciones'
    : '✅ las ' + pruebas + ' comprobaciones en verde: el Kit dice la verdad') + '\n');
  process.exit(fallos ? 1 : 0);
})();
