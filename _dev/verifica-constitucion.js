/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · La Constitución dice lo mismo en la pantalla y en el papel
   ──────────────────────────────────────────────────────────────
   Los artículos viven en UN solo archivo, `js/data/constitucion-honduras.js`.
   De ahí los pinta la misión y de ahí salió la ficha que el maestro
   fotocopia, que es HTML plano como las otras 76. Es la misma sonda que ya
   tienen el Himno, los próceres y los tres poderes, y por la misma razón:
   un número de artículo que se separa entre la pantalla y el papel es el
   alumno estudiando uno y el examen pidiéndole otro.

   Y mira DOS cosas que solo pasan en esta misión, y que son las que de
   verdad la sostienen:

   · ⚠️ CADA ARTÍCULO TIENE QUE DECIR DE QUÉ LEY SALIÓ, Y ESA LEY TIENE QUE
     ESTAR EN `_dev/leyes/`. La Constitución NO está en el repositorio: todo
     lo que esta misión enseña sale de las tres normas que sí están y que la
     citan por número. Escrito así, la regla es una frase en un comentario que
     nadie vuelve a leer; aquí se comprueba: del `donde` de cada artículo se
     saca su número de decreto o de acuerdo y se busca el PDF. El día que
     alguien añada un artículo «sacado de la Constitución», no habrá PDF que
     lo respalde y esta sonda se pondrá roja — que es exactamente lo que tiene
     que pasar. Es la lección de `INVESTIGACION-ESTATUTO-DOCENTE.md` hecha
     comprobación: **buscar no es leer**.

   · ⚠️ SOLO UNO PUEDE TRAER TEXTO LITERAL. El 162, porque el Estatuto lo cita
     palabra por palabra. Si mañana aparece un segundo `citaLiteral`, es que
     alguien escribió de memoria el texto de un artículo que aquí no hay — y
     eso no da ningún error, se pinta igual de bien y el alumno se lo aprende.
     Del que sí lo trae se compara la cita ENTERA contra el papel: una cita
     recortada es lo que enseña mal, que es lo que ya cazó la sonda del Himno.

   Uso:  node _dev/verifica-constitucion.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ   = path.resolve(__dirname, '..');
const DATOS  = path.join(RAIZ, 'js', 'data', 'constitucion-honduras.js');
const FICHA  = path.join(RAIZ, 'fichas', 'ficha-constitucion.html');
const MISION = path.join(RAIZ, 'misiones', '2y3ciclo-constitucion', 'constitucion.html');
const JSMIS  = path.join(RAIZ, 'misiones', '2y3ciclo-constitucion', 'js', 'constitucion.js');
const LEYES  = path.join(RAIZ, '_dev', 'leyes');

let fallos = 0, avisos = 0;
const ok    = t => console.log('  ✅ ' + t);
const mal   = t => { console.log('  ❌ ' + t); fallos++; };
const avisa = t => { console.log('  ⚠️  ' + t); avisos++; };

/* Se carga el archivo de datos de verdad, no se lee con expresiones
   regulares: lo que se compara tiene que ser lo que la misión usa. */
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(DATOS, 'utf8') +
  ';this.__D={CONST_COMO_SE_LEE,CONST_ARTICULOS,CONST_SE_APOYAN,' +
  'CONST_CASOS,CONST_DEMOCRACIA,CONST_INVESTIGA};', ctx);
const D = ctx.__D;

const ficha  = fs.readFileSync(FICHA, 'utf8');
const mision = fs.readFileSync(MISION, 'utf8');
const jsmis  = fs.readFileSync(JSMIS, 'utf8');

/* Se compara sin distinguir mayúsculas, tildes ni signos: en la ficha un
   mismo texto encabeza un recuadro y en la pantalla va a media frase. Y las
   comillas angulares del papel no son las mismas que las del dato. */
const limpia = t => String(t)
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9ñ ]+/g, ' ').replace(/\s+/g, ' ').trim();
/* La tirada de palabras seguidas más larga que dos textos comparten. Sirve
   para juzgar lo que se acorta pero no puede cambiar de sentido. */
const tirada = (a, b) => {
  const A = limpia(a).split(' '), B = ' ' + limpia(b) + ' ';
  let mejor = 0;
  for (let i = 0; i < A.length; i++)
    for (let j = i + mejor; j < A.length; j++) {
      const t = A.slice(i, j + 1).join(' ');
      if (B.includes(' ' + t + ' ')) mejor = Math.max(mejor, j - i + 1); else break;
    }
  return mejor;
};

const fichaPlana  = limpia(ficha.replace(/<[^>]*>/g, ' '));
const misionPlana = limpia(mision.replace(/<[^>]*>/g, ' '));

console.log('\n📕 La Constitución: la pantalla y el papel\n');

/* ── 1) cada artículo, DENTRO DE SU PROPIO recuadro ─────────────
   No basta con que el dato esté en la ficha: tiene que estar en el recuadro
   de SU artículo. Lo que pasa al copiar y pegar un bloque es justo que un
   dato se cuele en el del vecino, y buscándolo en el documento entero eso
   pasa por bueno. */
{
  const bloques = [...ficha.matchAll(/<div class="pficha">([\s\S]*?)<\/div>\s*(?=<div class="pficha">|<h2|<\/div>)/g)]
    .map(m => limpia(m[1].replace(/<[^>]*>/g, ' ')));
  if (!bloques.length) { mal('la ficha ya no trae recuadros .pficha: no se puede comprobar artículo por artículo'); }
  else {
    let malos = 0;
    D.CONST_ARTICULOS.forEach(a => {
      const suyo = bloques.find(b => b.includes(limpia(a.art)));
      if (!suyo) { mal(`la ficha no trae el recuadro de «${a.art}»`); malos++; return; }
      if (!suyo.includes(limpia(a.donde)))
        { mal(`«${a.art}» no dice en su recuadro de qué ley salió: «${a.donde}»`); malos++; }
      /* El epígrafe del papel va ACORTADO a propósito —es un encabezado, y
         «Lo que la Constitución dice de tu maestro» no cabe al lado del número
         del artículo—. Así que no se exige idéntico: se exige que diga LO
         MISMO, midiendo la tirada de palabras más larga que comparten. Es la
         misma técnica con la que la sonda del Himno juzga una cita: una
         abreviación pasa, un epígrafe reescrito que diga otra cosa, no. */
      if (tirada(a.tema, suyo) < 3)
        { mal(`el epígrafe de «${a.art}» en el papel ya no dice lo que el archivo: «${a.tema}»`); malos++; }
    });
    if (!malos) ok(`los ${D.CONST_ARTICULOS.length} artículos están en el papel, cada uno con su ley en SU recuadro`);
  }
}

/* ── 2) ⚠️ la ley que lo acredita tiene que estar en _dev/leyes/ ──
   Es la regla que sostiene la misión entera, y aquí deja de ser una frase en
   un comentario. */
{
  const pdfs = fs.existsSync(LEYES) ? fs.readdirSync(LEYES).filter(f => /\.pdf$/i.test(f)) : [];
  const claves = pdfs.map(f => f.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
  let malos = 0;
  D.CONST_ARTICULOS.forEach(a => {
    /* del «donde» se saca el número: «Decreto 136-97», «Acuerdo 0760-SE-99» */
    const m = String(a.donde).match(/(?:decreto|acuerdo)\s+([0-9]+[0-9a-z\-]*)/i);
    if (!m) { mal(`«${a.art}» no dice de qué decreto o acuerdo sale: «${a.donde}»`); malos++; return; }
    const num = m[1].toLowerCase().replace(/[^a-z0-9]+/g, '-');
    if (!claves.some(c => c.includes(num))) {
      mal(`«${a.art}» dice salir del ${m[0]}, y ese documento NO está en _dev/leyes/. ` +
          'Aquí no se escribe lo que no acredita un PDF del repositorio.'); malos++;
    }
  });
  if (!malos) ok(`los ${D.CONST_ARTICULOS.length} artículos salen de leyes que SÍ están en _dev/leyes/ (${pdfs.length} PDF)`);
}

/* ── 3) ⚠️ uno y solo uno puede traer texto literal ─────────────── */
{
  const conTexto = D.CONST_ARTICULOS.filter(a => a.citaLiteral);
  if (conTexto.length === 0) {
    mal('ningún artículo trae el texto literal: el 162 lo tiene porque el Estatuto lo cita palabra por palabra');
  } else if (conTexto.length > 1) {
    mal(`hay ${conTexto.length} artículos con texto literal (${conTexto.map(a => a.art).join(', ')}). ` +
        'Solo el 162 está citado palabra por palabra en una ley de este repositorio: ' +
        'los demás textos no se pueden escribir, y escritos de memoria no dan ningún error.');
  } else {
    ok(`solo «${conTexto[0].art}» trae texto literal, que es el único que una ley de aquí cita entero`);
    /* y la cita va ENTERA: una recortada es lo que enseña mal */
    if (!fichaPlana.includes(limpia(conTexto[0].citaLiteral)))
      mal(`la cita del ${conTexto[0].art} no está ENTERA en el papel, o está recortada`);
    else ok('la cita literal está en el papel palabra por palabra');
  }
}

/* ── 4) cómo se lee una cita, que es la destreza de la misión ──── */
{
  const faltan = D.CONST_COMO_SE_LEE.piezas.filter(p => !fichaPlana.includes(limpia(p.parte)));
  if (faltan.length) mal(`la ficha se dejó ${faltan.length} pieza(s) de cómo se lee una cita: ${faltan.map(p => p.parte).join(' · ')}`);
  else ok(`las ${D.CONST_COMO_SE_LEE.piezas.length} piezas de la cita están en el papel`);
}

/* ── 5) los casos y sus cinco pasos de análisis ─────────────────
   El DCNB pide «ejemplificar un caso de violación y elaborar un análisis
   crítico»: sin los pasos, el caso se queda en una pregunta suelta. */
{
  const faltan = D.CONST_CASOS.casos.filter(c => !fichaPlana.includes(limpia(c.caso).slice(0, 60)));
  if (faltan.length) mal(`la ficha perdió ${faltan.length} de los ${D.CONST_CASOS.casos.length} casos`);
  else ok(`los ${D.CONST_CASOS.casos.length} casos para analizar están en el papel`);

  const sinPaso = D.CONST_CASOS.comoSeAnaliza.filter(p => !fichaPlana.includes(limpia(p.replace(/^\d+\.\s*/, ''))));
  if (sinPaso.length) mal(`faltan ${sinPaso.length} de los ${D.CONST_CASOS.comoSeAnaliza.length} pasos del análisis`);
  else ok(`los ${D.CONST_CASOS.comoSeAnaliza.length} pasos del análisis están en el papel`);

  /* ⚠️ y el aviso de que no señalan a nadie. Los casos hablan de un niño que
     trabaja y de un nombramiento sin concurso: en un pueblo eso se parece a
     alguien, y sin el aviso la clase acaba poniéndole nombre. */
  if (!fichaPlana.includes(limpia('no señalan a nadie')))
    mal('la ficha perdió el aviso de que los casos NO señalan a nadie de la comunidad');
  else ok('el papel sigue avisando de que los casos no señalan a nadie');
}

/* ── 6) ⚠️ la sección de investigar, que es lo primero que se cae ──
   Es donde vive lo que esta misión NO puede escribir. Sin ella la ficha se
   queda muda justo en el hueco, y el hueco parece un olvido. */
{
  const preguntas = D.CONST_INVESTIGA.preguntas;
  const faltan = preguntas.filter(q => !fichaPlana.includes(limpia(q.q).slice(0, 55)));
  if (faltan.length) {
    mal(`la ficha perdió ${faltan.length} de las ${preguntas.length} preguntas de investigar:`);
    faltan.forEach(q => console.log('       «' + q.q + '»'));
  } else ok(`las ${preguntas.length} preguntas de investigar siguen en el papel`);

  /* ⚠️ Se busca lo que el aviso DICE, no una frase exacta. La primera versión
     de esta sonda pedía una redacción concreta, la ficha ya avisaba con otras
     palabras en su recuadro ámbar, y el arreglo fue escribir el aviso OTRA VEZ
     dentro de la nota del docente — o sea, duplicar el texto y pasarse de hoja
     por una sonda mal escrita. Lo que tiene que estar es el aviso, dicho como
     sea: que esa sección no lleva respuestas, y que no es un descuido. */
  const avisaDocente = /no trae respuestas?[^.]{0,40}a prop[óo]sito|no tienen respuesta[^.]{0,60}prop[óo]sito/i.test(ficha) &&
                       /constituci/i.test(ficha);
  if (!avisaDocente) mal('la hoja del docente no avisa de que esas preguntas NO llevan respuesta a propósito');
  else ok('la hoja del docente avisa de por qué esas preguntas no traen respuesta');

  /* Y el otro aviso de la misma familia: los casos no tienen UNA respuesta
     buena. Sin él, un maestro corrige contra la pista y le marca en rojo un
     análisis mejor que el suyo. */
  if (!/NO tienen una sola respuesta correcta|no tienen una sola respuesta/i.test(ficha))
    mal('la hoja del docente no avisa de que los casos no tienen una sola respuesta buena');
  else ok('la hoja del docente avisa de cómo se califican los casos');
}

/* ── 7) la misión no puede llevar los datos escritos a mano ────── */
{
  const pegados = D.CONST_ARTICULOS.filter(a => misionPlana.includes(limpia(a.paraQue)));
  if (pegados.length) {
    mal(`la misión lleva escritos a mano ${pegados.length} artículo(s): ` +
        pegados.map(a => a.art).join(', ') + ' — tienen que pintarse del archivo de datos');
  } else ok('la misión no lleva los artículos escritos a mano: los pinta del archivo');

  const anclas = ['con-comolee', 'con-mapa', 'con-lista', 'con-apoyan',
                  'con-casos', 'con-democracia', 'con-investiga'];
  const sinAncla = anclas.filter(a => !mision.includes('id="' + a + '"'));
  if (sinAncla.length) mal(`a la misión le faltan los anclajes: ${sinAncla.join(', ')}`);
  else ok(`los ${anclas.length} anclajes donde se pinta cada bloque están en la misión`);

  const sinPintar = anclas.filter(a => !jsmis.includes("'" + a + "'"));
  if (sinPintar.length) avisa(`hay anclaje sin quien lo pinte: ${sinPintar.join(', ')}`);
}

/* ── 8) el archivo de datos sigue diciendo de dónde salió ──────── */
{
  /* Se aplanan los espacios: las citas van partidas en varias líneas dentro
     del comentario de cabecera, y buscarlas crudas fallaba con el texto
     perfectamente puesto — una sonda roja sin avería. */
  const datosPlano = fs.readFileSync(DATOS, 'utf8').replace(/\s+/g, ' ');
  if (!/Argumentan sobre la democracia participativa/.test(datosPlano))
    mal('el archivo de datos perdió la cita textual de la expectativa del DCNB');
  else ok('el archivo de datos sigue citando la expectativa del DCNB con sus palabras');

  if (!/Constitución de la República NO está en \*\*?`?_dev\/leyes\/`?/.test(datosPlano) &&
      !/NO está en \*\*`_dev\/leyes\/`\*\*/.test(datosPlano) &&
      !/Constitución[^.]{0,80}NO está en/.test(datosPlano))
    avisa('el archivo de datos ya no explica que la Constitución no está en _dev/leyes/');
  else ok('el archivo de datos sigue diciendo por qué no se escribe lo que no hay');
}

console.log('\n' + (fallos
  ? '❌ ' + fallos + ' fallo(s)' + (avisos ? ', ' + avisos + ' aviso(s)' : '')
  : '✅ la pantalla y el papel dicen lo mismo de la Constitución' + (avisos ? ` (${avisos} aviso)` : '')) + '\n');
process.exit(fallos ? 1 : 0);
