/* ═══════════════════════════════════════════════════════════════
   🔎 ¿ESTÁN TODOS LOS ADJETIVOS DE CADA LECTURA?

   En la sección 📖 Lectura el alumno CAZA los adjetivos tocándolos
   sobre el texto que acaba de leer. El motor sabe cuáles son porque
   la lectura los trae en `adjs` (calificativos) y `dets`
   (determinativos). Si esas listas están incompletas, pasan dos
   cosas y las dos son graves:

   · el alumno toca un adjetivo de verdad y la pantalla le dice que
     no lo es — le enseña lo contrario de la misión;
   · el resultado presume «17 adjetivos en un solo texto» cuando en
     realidad había 24: el número que se le muestra es falso.

   Por eso las listas tienen que ser el INVENTARIO COMPLETO, no una
   muestra bonita. Esto ayuda a conseguirlo:

   · los DETERMINATIVOS son clase cerrada (este, mi, tres, algunos…),
     así que aquí sí se puede afirmar: lo que esté en el texto y no
     esté en `dets` es un ERROR;
   · los CALIFICATIVOS son clase abierta y no hay lista posible, así
     que se proponen CANDIDATOS por terminación (-oso, -ado, -ible…)
     y por una lista de los más comunes. El candidato no es un fallo:
     es una pregunta para quien escribe el corpus, que decide mirando
     la oración. «cortado» en «el zacate recién cortado» es adjetivo;
     en «ha cortado» es verbo, y solo el ojo humano ve la diferencia.

   Uso:
     node _dev/audita-adjetivos-lectura.js
     node _dev/audita-adjetivos-lectura.js LA6-02      (una lectura)
═══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const CORPUS = [
  { archivo: 'misiones/2y3ciclo-adjetivos/js/lectura-adjetivos.js', constante: 'LECTURA_ADJETIVOS' },
];

const LIMPIA = /[.,;:()¿?¡!«»"“”'’…—–]/g;
const norm = p => String(p).replace(LIMPIA, '').toLowerCase();

/* Las dos clases cerradas viven en js/data/lectura-clases.js, que leen
   también la misión y el validador: una sola lista, y no tres copias que
   se van separando con los meses. */
const CLASES = require(path.join(RAIZ, 'js', 'data', 'lectura-clases.js'));
const DETERMINATIVOS = new Set(CLASES.determinativos);
const NEUTROS = new Set(CLASES.neutros);

/* Terminaciones que casi siempre anuncian un calificativo. Producen
   falsos positivos a propósito: más vale mirar de más que dejar fuera
   un adjetivo que el alumno sí va a tocar. */
const SUFIJOS = /(oso|osa|osos|osas|ado|ada|ados|adas|ido|ida|idos|idas|ante|antes|ente|entes|iente|ientes|al|ales|ar|ares|il|iles|ivo|iva|ivos|ivas|able|ables|ible|ibles|ísimo|ísima|ísimos|ísimas|udo|uda|udos|udas|izo|iza|ento|enta|iento|ienta|eño|eña|eños|eñas|esco|esca|ico|ica|icos|icas|oide)$/;

/* Calificativos frecuentes que no llevan terminación reconocible. */
const COMUNES = new Set((
  'alto alta altos altas bajo baja bajos bajas grande grandes pequeño pequeña pequeños pequeñas ' +
  'largo larga largos largas corto corta cortos cortas ancho ancha anchos anchas angosto angosta ' +
  'nuevo nueva nuevos nuevas viejo vieja viejos viejas joven jóvenes antiguo antigua antiguos antiguas ' +
  'bueno buena buenos buenas malo mala malos malas mejor mejores peor peores mayor mayores menor menores ' +
  'feo fea feos feas bonito bonita bonitos bonitas lindo linda bello bella ' +
  'frío fría fríos frías caliente calientes tibio tibia tibios tibias helado helada ' +
  'seco seca secos secas húmedo húmeda mojado mojada duro dura duros duras blando blanda blandos blandas ' +
  'suave suaves áspero áspera ásperos ásperas limpio limpia limpios limpias sucio sucia sucios sucias ' +
  'lleno llena llenos llenas vacío vacía vacíos vacías fuerte fuertes débil débiles ' +
  'rápido rápida rápidos rápidas lento lenta lentos lentas quieto quieta quietos quietas ' +
  'fácil fáciles difícil difíciles raro rara raros raras claro clara claros claras oscuro oscura oscuros oscuras ' +
  'dulce dulces salado salada amargo amarga ' +
  'verde verdes azul azules rojo roja rojos rojas gris grises blanco blanca blancos blancas ' +
  'negro negra negros negras café amarillo amarilla amarillos amarillas ' +
  'flaco flaca flacos flacas gordo gorda alegre alegres triste tristes feliz felices ' +
  'libre libres pobre pobres rico rica ricos ricas simple simples justo justa exacto exacta exactos exactas ' +
  'recto recta rectos rectas torcido torcida ' +
  'maduro madura maduros maduras fresco fresca frescos frescas ' +
  'entero entera enteros enteras único única únicos únicas ' +
  'propio propia sano sana sanos sanas enfermo enferma enfermos enfermas ' +
  'cerca lejos'  /* estos dos son adverbios: entran para verlos y descartarlos */
).split(' '));

let errores = 0, candidatos = 0;

function audita(entrada, soloId) {
  const src = fs.readFileSync(path.join(RAIZ, entrada.archivo), 'utf8');
  const corpus = new Function(src + '; return ' + entrada.constante + ';')();

  for (const g of Object.keys(corpus).map(Number).sort((a, b) => a - b)) {
    for (const t of corpus[g]) {
      if (soloId && t.id !== soloId) continue;
      const palabras = String(t.texto).trim().split(/\s+/).map(norm).filter(Boolean);
      const enAdjs = new Set((t.adjs || []).map(norm));
      const enDets = new Set((t.dets || []).map(norm));
      const enNeutros = new Set((t.neutros || []).map(norm));
      const faltanDet = [], posiblesAdj = [];
      const vistas = new Set();

      palabras.forEach(p => {
        if (vistas.has(p)) return;
        vistas.add(p);
        if (enAdjs.has(p) || enDets.has(p) || enNeutros.has(p) || NEUTROS.has(p)) return;
        if (DETERMINATIVOS.has(p)) faltanDet.push(p);
        else if (SUFIJOS.test(p) || COMUNES.has(p)) posiblesAdj.push(p);
      });

      /* Un adjetivo listado que no esté en el texto ya lo caza el
         validador; aquí interesa lo contrario, lo que sobra fuera. */
      if (faltanDet.length || posiblesAdj.length) {
        console.log(`\n── ${t.id} «${t.titulo}» (${g}º) ──`);
        if (faltanDet.length) {
          errores += faltanDet.length;
          console.log('  ❌ determinativos del texto que no están ni en dets ni en neutros: ' + faltanDet.join(', '));
        }
        if (posiblesAdj.length) {
          candidatos += posiblesAdj.length;
          console.log('  🔎 candidatos a calificativo (mirar la oración): ' + posiblesAdj.join(', '));
        }
      }
    }
  }
}

const soloId = process.argv[2] || null;
CORPUS.forEach(c => audita(c, soloId));
console.log(`\n${errores ? '❌ ' + errores + ' determinativo(s) sin clasificar' : '✅ ningún determinativo suelto'}` +
  ` · 🔎 ${candidatos} candidato(s) a calificativo por revisar a mano`);
process.exit(errores ? 1 : 0);
