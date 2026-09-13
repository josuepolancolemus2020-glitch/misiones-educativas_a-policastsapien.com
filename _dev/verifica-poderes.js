/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Los tres poderes dicen lo mismo en la pantalla y en el papel
   ──────────────────────────────────────────────────────────────
   Los datos de los tres poderes viven en UN solo archivo,
   `js/data/poderes-honduras.js`. De ahí los saca la misión (que los
   pinta al vuelo) y de ahí salió la ficha que el maestro fotocopia
   (`fichas/ficha-tres-poderes.html`), que es HTML plano como las
   demás del proyecto.

   Ese «salió de ahí» es lo que se despinta con el tiempo: alguien
   corrige el papel, o lo vuelve a armar de otra fuente, y a partir
   de ese día el alumno estudia una cosa y el examen le pide otra.
   Es la misma sonda que ya tienen el Himno y los próceres, y por la
   misma razón.

   Y mira tres cosas más que en esta misión cuestan caro:

   · Que la misión NO lleve los datos escritos a mano. Si algún día
     alguien los copia dentro del HTML «para que cargue antes», vuelve
     a haber dos originales y esta sonda deja de servir para nada.

   · Que la JERARQUÍA de las normas esté ENTERA y en su orden. Son
     ocho escalones y se copian completos a propósito: recortar la
     lista sería enseñar una jerarquía que no es la que dice la ley,
     y el escalón que primero se cae al recortar es justo el 6 y el 7
     —los reglamentos y la jurisprudencia—, que son los que enseñan
     que los tres poderes salen en la misma lista.

   · ⚠️ Que la sección de INVESTIGAR siga en el papel. Es lo primero
     que se cae al recortar una ficha para ganar una hoja, y sin ella
     la ficha se queda muda justo donde tiene que decirle al alumno
     que los números que faltan —cuántos diputados, cuántos
     magistrados— los tiene que buscar él, porque la Constitución no
     está en `_dev/leyes/` y aquí no se escribe de memoria.

   Uso:  node _dev/verifica-poderes.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ   = path.resolve(__dirname, '..');
const DATOS  = path.join(RAIZ, 'js', 'data', 'poderes-honduras.js');
const FICHA  = path.join(RAIZ, 'fichas', 'ficha-tres-poderes.html');
const MISION = path.join(RAIZ, 'misiones', '2y3ciclo-tres-poderes', 'tres-poderes.html');
const JSMIS  = path.join(RAIZ, 'misiones', '2y3ciclo-tres-poderes', 'js', 'tres-poderes.js');

let fallos = 0, avisos = 0;
const ok    = t => console.log('  ✅ ' + t);
const mal   = t => { console.log('  ❌ ' + t); fallos++; };
const avisa = t => { console.log('  ⚠️  ' + t); avisos++; };

/* Se carga el archivo de datos de verdad, no se lee con expresiones
   regulares: lo que se compara tiene que ser lo que la misión usa. */
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(DATOS, 'utf8') +
  ';this.__D={PODERES,PODERES_JERARQUIA,PODERES_CONCEPTOS,PODERES_RECORRIDO,' +
  'PODERES_SEPARACION,PODERES_RENDICION,PODERES_INVESTIGA};', ctx);
const D = ctx.__D;

const ficha  = fs.readFileSync(FICHA, 'utf8');
const mision = fs.readFileSync(MISION, 'utf8');
const jsmis  = fs.readFileSync(JSMIS, 'utf8');

/* Se compara sin distinguir mayúsculas, tildes ni signos: en la ficha un
   mismo texto encabeza un recuadro y en la pantalla va a media frase. */
const limpia = t => String(t)
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9ñ ]+/g, ' ').replace(/\s+/g, ' ').trim();
const fichaPlana  = limpia(ficha.replace(/<[^>]*>/g, ' '));
const misionPlana = limpia(mision.replace(/<[^>]*>/g, ' '));

console.log('\n⚖️  Los tres poderes: la pantalla y el papel\n');

/* ── 1) los tres poderes, dato por dato ────────────────────────── */
{
  let malos = 0;
  D.PODERES.forEach(p => {
    [['nombre', p.nombre], ['verbo', p.verbo], ['quien', p.quien]].forEach(([campo, valor]) => {
      if (!fichaPlana.includes(limpia(valor))) {
        mal(`la ficha no dice el ${campo} de ${p.nombre}: «${valor}»`); malos++;
      }
    });
  });
  if (!malos) ok(`los ${D.PODERES.length} poderes están en el papel con su verbo y quién los ejerce`);
}

/* ── 2) la jerarquía, ENTERA y en su orden ─────────────────────── */
{
  const esc = D.PODERES_JERARQUIA.escalones;
  const faltan = esc.filter(e => !fichaPlana.includes(limpia(e)));
  if (faltan.length) mal(`la ficha se dejó ${faltan.length} escalón(es) de la jerarquía: ${faltan.join(' · ')}`);
  else {
    /* y en ORDEN. ⚠️ Se mide DENTRO del bloque de la jerarquía y no en la
       ficha entera: «la Constitución de la República» aparece antes en los
       objetivos y en la introducción, así que buscarla en todo el documento
       daba «desordenados» con el papel perfectamente puesto. */
    const m = ficha.match(/<div class="linea-t">[\s\S]*?<\/div>\s*<\/div>/);
    const bloque = limpia((m ? m[0] : ficha).replace(/<[^>]*>/g, ' '));
    const pos = esc.map(e => bloque.indexOf(limpia(e)));
    const ordenada = pos.every((v, i) => i === 0 || v > pos[i - 1]);
    if (!ordenada) mal('los escalones de la jerarquía están en el papel pero DESORDENADOS');
    else ok(`la jerarquía está entera (${esc.length} escalones) y en su orden`);
  }
}

/* ── 3) el recorrido de la ley ─────────────────────────────────── */
{
  const faltan = D.PODERES_RECORRIDO.pasos.filter(x => !fichaPlana.includes(limpia(x.titulo)));
  if (faltan.length) mal(`la ficha se dejó ${faltan.length} paso(s) del recorrido de la ley`);
  else ok(`el recorrido de la ley está completo en el papel (${D.PODERES_RECORRIDO.pasos.length} pasos)`);
}

/* ── 4) los conceptos que el DCNB pide aclarar ─────────────────── */
{
  const faltan = D.PODERES_CONCEPTOS.filter(c => !fichaPlana.includes(limpia(c.palabra)));
  if (faltan.length) mal(`faltan en el papel: ${faltan.map(c => c.palabra).join(', ')}`);
  else ok(`los ${D.PODERES_CONCEPTOS.length} conceptos del currículo están en el papel`);
}

/* ── 5) ⚠️ la sección de investigar, que es lo primero que se cae ── */
{
  const preguntas = D.PODERES_INVESTIGA.preguntas;
  const faltan = preguntas.filter(q => !fichaPlana.includes(limpia(q.q)));
  if (faltan.length) {
    mal(`la ficha perdió ${faltan.length} de las ${preguntas.length} preguntas de investigar:`);
    faltan.forEach(q => console.log('       «' + q.q + '»'));
  } else ok(`las ${preguntas.length} preguntas de investigar siguen en el papel`);

  /* y la hoja del docente tiene que AVISAR de por qué no traen respuesta:
     sin ese aviso, un maestro las da por un descuido y se las salta */
  const avisaDocente = /no tienen respuesta en esta ficha/i.test(ficha) &&
                       /constituci/i.test(ficha) && /investigue/i.test(ficha);
  if (!avisaDocente) mal('la hoja del docente no avisa de que esas preguntas NO llevan respuesta a propósito');
  else ok('la hoja del docente avisa de por qué esas preguntas no traen respuesta');
}

/* ── 6) la misión no puede llevar los datos escritos a mano ─────── */
{
  /* El verbo de cada poder y la lista de escalones son lo que se copiaría.
     Se busca en el HTML, que es donde alguien los pegaría «para que cargue
     antes»; el JS los pinta desde el archivo de datos y ahí sí pueden salir. */
  const pegados = D.PODERES.filter(p => misionPlana.includes(limpia(p.queHace)));
  if (pegados.length) {
    mal(`la misión lleva escritos a mano los datos de ${pegados.length} poder(es): ` +
        pegados.map(p => p.nombre).join(', ') + ' — tienen que pintarse del archivo de datos');
  } else ok('la misión no lleva los datos escritos a mano: los pinta del archivo');

  const anclas = ['pod-mapa', 'pod-lista', 'pod-conceptos', 'pod-jerarquia',
                  'pod-recorrido', 'pod-separacion', 'pod-rendicion', 'pod-investiga'];
  const sinAncla = anclas.filter(a => !mision.includes('id="' + a + '"'));
  if (sinAncla.length) mal(`a la misión le faltan los anclajes: ${sinAncla.join(', ')}`);
  else ok(`los ${anclas.length} anclajes donde se pinta cada bloque están en la misión`);

  const sinPintar = anclas.filter(a => !jsmis.includes("'" + a + "'"));
  if (sinPintar.length) avisa(`hay anclaje sin quien lo pinte: ${sinPintar.join(', ')}`);
}

/* ── 7) la cita del DCNB no puede desaparecer del archivo de datos ── */
{
  const datos = fs.readFileSync(DATOS, 'utf8');
  /* Se aplanan los espacios antes de buscar: la cita va partida en varias
     líneas dentro del comentario de cabecera, y buscarla cruda fallaba con
     el texto perfectamente puesto —una sonda roja sin avería—. */
  const datosPlano = datos.replace(/\s+/g, ' ');
  if (!/Reconocen la Constitución de la República como ley fundamental/.test(datosPlano))
    mal('el archivo de datos perdió la cita textual de la expectativa del DCNB');
  else ok('el archivo de datos sigue citando la expectativa del DCNB con sus palabras');

  /* Y el aviso de lo que NO se escribe: el día que alguien ponga de memoria
     cuántos diputados hay, esto es lo que tiene que estorbarle. */
  if (!/Constitución de la República NO está en\s*`_dev\/leyes\/`/.test(datosPlano))
    avisa('el archivo de datos ya no explica que la Constitución no está en _dev/leyes/');
  else ok('el archivo de datos sigue diciendo por qué no se escriben los números que faltan');
}

console.log('\n' + (fallos
  ? '❌ ' + fallos + ' fallo(s)' + (avisos ? ', ' + avisos + ' aviso(s)' : '')
  : '✅ la pantalla y el papel dicen lo mismo de los tres poderes' + (avisos ? ` (${avisos} aviso)` : '')) + '\n');
process.exit(fallos ? 1 : 0);
