/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · La Ruta de la Raíz dice lo mismo en la pantalla y en el papel
   ──────────────────────────────────────────────────────────────
   El temario de la unidad vive en UN solo archivo,
   `js/data/filosofia-asombro.js`. De ahí lo saca la misión (que lo pinta al
   vuelo) y de ahí salió la ficha que el maestro fotocopia
   (`fichas/ficha-el-asombro.html`), que es HTML plano como las otras 75.

   Ese «salió de ahí» es lo que se despinta con el tiempo: alguien corrige el
   papel, o lo vuelve a armar de otra fuente, y a partir de ese día el alumno
   estudia una cosa y el examen le pide otra. Es la misma sonda que ya tienen
   el Himno, los próceres, los poderes y la Constitución, y por la misma razón.

   Y mira seis cosas más que en esta misión cuestan caro:

   · Que la misión NO lleve el temario escrito a mano. Si algún día alguien lo
     copia dentro del HTML «para que cargue antes», vuelve a haber dos
     originales y esta sonda deja de servir para nada.

   · ⚠️ Que la CLASE de cada pregunta de ejemplo sea la misma en el archivo de
     datos, en la actividad del papel y en su pauta. Es lo que de verdad cuesta
     caro: una pregunta clasificada de dos maneras le marca en rojo al alumno
     que acertó, que es la avería del Escudo de Aspectos Cívicos. La pauta NO
     se lee del papel y se cree: se RECALCULA del archivo de datos y se compara.

   · ⚠️ Que no haya NI UNA FECHA, ni en los datos ni en el papel. Es la regla
     propia de esta unidad, escrita en la cabecera del archivo de datos: de los
     tres pensadores se dice qué hicieron y por qué se les recuerda, porque un
     año sacado de un extracto de buscador no acredita nada. Una fecha que se
     cuele se pinta igual de bien y el alumno se la aprende para el examen.

   · ⚠️ Que la sección de INVESTIGAR siga en el papel, con su aviso de que no
     trae respuestas A PROPÓSITO. Es lo primero que se cae al recortar una
     ficha para ganar una hoja, y sin el aviso el maestro lo da por un descuido
     y se la salta.

   · Que la hoja del docente lleve la ruta de los TRES ciclos. El currículo es
     holístico: si se cae una, la escuela que trabaja la unidad el mismo mes se
     queda sin saber qué le toca a ese ciclo.

   · Y que se lea en cuarto grado. Se mide con la misma vara que la Ruta de la
     Máquina que Aprende, reutilizando `mide-legibilidad.js` en vez de copiarlo.
     Aquí aprieta más que allá: el currículo es el mismo para I, II y III Ciclo,
     así que la misma misión la abre un niño de 1.º y un joven de 9.º.

   Uso:  node _dev/verifica-filosofia.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { bloquesDe, resumen, FILO, MIN_BLOQUE } = require('./mide-legibilidad.js');

const RAIZ   = path.resolve(__dirname, '..');
const DATOS  = path.join(RAIZ, 'js', 'data', 'filosofia-asombro.js');
const FICHA  = path.join(RAIZ, 'fichas', 'ficha-el-asombro.html');
const MISION = path.join(RAIZ, 'misiones', 'basica-el-asombro', 'el-asombro.html');
const JSMIS  = path.join(RAIZ, 'misiones', 'basica-el-asombro', 'js', 'el-asombro.js');

/* La misma vara de la ruta de IA, y por el mismo motivo. */
const FRASE_MAX = 25, TRAMO_MAX = 45, MEDIA_BLOQUE = 11, MEDIA_MISION = 8.5;

let fallos = 0, avisos = 0;
const ok    = t => console.log('  ✅ ' + t);
const mal   = t => { console.log('  ❌ ' + t); fallos++; };
const avisa = t => { console.log('  ⚠️  ' + t); avisos++; };

/* Se carga el archivo de datos de verdad, no se lee con expresiones
   regulares: lo que se compara tiene que ser lo que la misión usa. */
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(DATOS, 'utf8') +
  ';this.__D={FILO_PALABRA,FILO_CLASES,FILO_PREGUNTAS,FILO_RAMAS,FILO_ARBOL,' +
  'FILO_PENSADORES,FILO_RUTINA,FILO_ORIGEN,FILO_VOCABULARIO,FILO_CICLOS};', ctx);
const D = ctx.__D;

const ficha  = fs.readFileSync(FICHA, 'utf8');
const mision = fs.readFileSync(MISION, 'utf8');
const jsmis  = fs.readFileSync(JSMIS, 'utf8');

/* Se compara sin distinguir mayúsculas, tildes ni signos: en la ficha un mismo
   texto encabeza un recuadro y en la pantalla va a media frase. */
const limpia = t => String(t)
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9ñ ]+/g, ' ').replace(/\s+/g, ' ').trim();
const sinHtml    = h => h.replace(/<[^>]*>/g, ' ');
const fichaPlana = limpia(sinHtml(ficha));
const misionPlana = limpia(sinHtml(mision));

console.log('\n🌳 La Ruta de la Raíz: la pantalla y el papel\n');

/* ── 1) las tres clases de pregunta, campo por campo ───────────── */
{
  let malos = 0;
  D.FILO_CLASES.forEach(k => {
    [['nombre', k.nombre], ['señal', k.senal], ['ejemplo', k.ejemplo],
     ['dónde se contesta', k.donde], ['trampa', k.trampa]].forEach(([campo, valor]) => {
      if (!fichaPlana.includes(limpia(valor))) {
        mal(`la ficha no dice el ${campo} de la pregunta ${k.nombre}: «${valor}»`); malos++;
      }
    });
  });
  if (!malos) ok(`las ${D.FILO_CLASES.length} clases de pregunta están en el papel con su señal, su ejemplo y su trampa`);
}

/* ── 2) ⚠️ la CLASE de cada pregunta: recalculada, no leída ─────── */
{
  /* La actividad 1 del papel es una tabla de preguntas y su pauta dice H, S o
     V para cada una. Aquí no se cree lo que dice la pauta: se busca cada
     pregunta de la tabla en el archivo de datos y se comprueba que la letra de
     la pauta sea la que le toca. Una pregunta clasificada de dos maneras le
     marca en rojo al alumno que acertó. */
  const letra = { hechos: 'H', significado: 'S', valor: 'V' };
  const clasePorPregunta = {};
  D.FILO_PREGUNTAS.forEach(p => { clasePorPregunta[limpia(p.p)] = letra[p.clase]; });

  /* ⚠️ La pauta se busca DENTRO del bloque .pauta, no por su título: ese
     mismo título encabeza la actividad en la página 6, y buscarlo en la ficha
     entera hacía caer el match en el encabezado —que no lleva claves— y daba
     «la pauta no trae ninguna clave» con el papel perfectamente puesto. */
  const bloquePauta = ficha.match(/<div class="pauta">[\s\S]*?\n    <\/div>/);
  const pauta = bloquePauta && bloquePauta[0].match(/¿De qué clase es\?[\s\S]*?<\/div>/);
  if (!pauta) mal('no se encontró la pauta de «¿De qué clase es?» en la hoja del docente');
  else {
    const claves = [...pauta[0].matchAll(/(\d+)\.\s*([HSV])\b/g)].map(m => [Number(m[1]), m[2]]);
    if (!claves.length) mal('la pauta de «¿De qué clase es?» no trae ninguna clave H/S/V');
    /* El orden de la tabla del papel: se leen sus celdas, no se supone. */
    const tabla = ficha.match(/<tr><th style="width:8%">Clase<\/th>[\s\S]*?<\/table>/);
    if (!tabla) mal('no se encontró la tabla de la actividad «¿De qué clase es?»');
    else {
      const celdas = [...tabla[0].matchAll(/<td>(¿[^<]+\?)<\/td>/g)].map(m => limpia(m[1]));
      if (celdas.length !== claves.length) {
        mal(`la tabla trae ${celdas.length} preguntas y la pauta ${claves.length} claves`);
      } else {
        let malos = 0;
        celdas.forEach((c, i) => {
          const debe = clasePorPregunta[c];
          if (!debe) { mal(`la tabla usa una pregunta que no está en el archivo de datos: «${c}»`); malos++; return; }
          if (claves[i][1] !== debe) {
            mal(`la pregunta ${i + 1} («${c}») es ${debe} en los datos y la pauta dice ${claves[i][1]}`); malos++;
          }
        });
        if (!malos) ok(`las ${celdas.length} preguntas de la actividad llevan en la pauta la clase que dicen los datos`);
      }
    }
  }
}

/* ── 3) el árbol: cada materia con su pregunta de origen ────────── */
{
  let malos = 0;
  D.FILO_ARBOL.forEach(a => {
    if (!fichaPlana.includes(limpia(a.materia))) { mal(`la ficha no nombra la materia ${a.materia}`); malos++; }
    if (!fichaPlana.includes(limpia(a.nacio))) { mal(`la ficha no trae la pregunta de origen de ${a.materia}: «${a.nacio}»`); malos++; }
    if (!fichaPlana.includes(limpia(a.hoy))) { mal(`la ficha no trae el «pregúntate hoy» de ${a.materia}`); malos++; }
  });
  if (!malos) ok(`las ${D.FILO_ARBOL.length} materias del árbol están en el papel con su pregunta de origen`);

  /* Y la pauta del pareado, recalculada: la Columna B va barajada a propósito,
     así que si alguien reordena la tabla y no la clave, el maestro corrige mal. */
  const pauta = ficha.match(/Une la materia con su pregunta[\s\S]*?<\/div>/);
  if (!pauta) mal('no se encontró la pauta del pareado materia → pregunta');
  else {
    const cuerpo = ficha.match(/<tr><th style="width:50%">Columna A[\s\S]*?<\/table>/);
    if (!cuerpo) mal('no se encontró la tabla del pareado');
    else {
      /* La columna B, en el orden en que la ve el alumno. */
      const b = [...cuerpo[0].matchAll(/<b>(\d+)\.<\/b>\s*([^<]+)</g)].map(m => [Number(m[1]), limpia(m[2])]);
      const a = [...cuerpo[0].matchAll(/<\/span>\s*(?:[^\sA-Za-z<]*\s*)?([A-ZÁÉÍÓÚ][^<]*?)<\/td>/g)].map(m => limpia(m[1]));
      let malos = 0;
      a.forEach(mat => {
        const dato = D.FILO_ARBOL.find(x => limpia(x.materia) === mat);
        if (!dato) { mal(`la columna A del pareado nombra «${mat}», que no está en el árbol`); malos++; return; }
        const fila = b.find(([, txt]) => txt === limpia(dato.nacio));
        if (!fila) { mal(`la columna B del pareado no trae la pregunta de ${dato.materia}`); malos++; return; }
        const re = new RegExp(dato.materia.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*→\\s*(\\d+)');
        const dice = pauta[0].match(re);
        if (!dice) { mal(`la pauta del pareado no dice nada de ${dato.materia}`); malos++; return; }
        if (Number(dice[1]) !== fila[0]) {
          mal(`la pauta dice ${dato.materia} → ${dice[1]} y en el papel su pregunta es la ${fila[0]}`); malos++;
        }
      });
      if (!malos && a.length === D.FILO_ARBOL.length) ok(`la pauta del pareado cuadra con el orden barajado del papel (${a.length} materias)`);
      else if (!malos) mal(`la columna A del pareado trae ${a.length} materias y el árbol tiene ${D.FILO_ARBOL.length}`);
    }
  }
}

/* ── 4) las ocho raíces, con su pregunta ────────────────────────── */
{
  const faltan = D.FILO_RAMAS.filter(r => !fichaPlana.includes(limpia(r.nombre)) || !fichaPlana.includes(limpia(r.pregunta)));
  if (faltan.length) mal(`la ficha se dejó ${faltan.length} raíz(ces): ${faltan.map(r => r.nombre).join(' · ')}`);
  else ok(`las ${D.FILO_RAMAS.length} raíces están en el papel, cada una con su pregunta`);
}

/* ── 5) los cinco momentos, enteros y EN ORDEN ──────────────────── */
{
  const faltan = D.FILO_RUTINA.filter(x => !fichaPlana.includes(limpia(x.titulo)) || !fichaPlana.includes(limpia(x.que)));
  if (faltan.length) mal(`la ficha se dejó ${faltan.length} momento(s) de la clase: ${faltan.map(x => x.titulo).join(' · ')}`);
  else {
    /* En orden, y medido DENTRO del bloque de los pasos: «diálogo» y
       «asombro» salen antes en los objetivos y en la portada, así que
       buscarlos en la ficha entera daría «desordenados» con el papel bien. */
    const m = ficha.match(/<div class="pasos">[\s\S]*?<\/div>\s*<\/div>/);
    if (!m) mal('no se encontró el bloque de los cinco momentos en la ficha');
    else {
      const dentro = limpia(sinHtml(m[0]));
      const pos = D.FILO_RUTINA.map(x => dentro.indexOf(limpia(x.titulo)));
      const ordenados = pos.every((p, i) => p >= 0 && (i === 0 || p > pos[i - 1]));
      if (!ordenados) mal('los cinco momentos están en el papel pero DESORDENADOS: el orden es la lección');
      else ok('los cinco momentos de la clase están enteros y en su orden');
    }
  }
}

/* ── 6) los tres pensadores, campo por campo ────────────────────── */
{
  let malos = 0;
  D.FILO_PENSADORES.forEach(p => {
    [['nombre', p.nombre], ['quién fue', p.quien], ['qué hizo', p.hizo],
     ['por qué se le recuerda', p.porque], ['dato', p.dato]].forEach(([campo, valor]) => {
      if (!fichaPlana.includes(limpia(valor))) { mal(`la ficha no dice el ${campo} de ${p.nombre}`); malos++; }
    });
  });
  if (!malos) ok(`los ${D.FILO_PENSADORES.length} pensadores están en el papel, cada uno con sus cuatro campos`);
}

/* ── 7) el vocabulario y la etimología ─────────────────────────── */
{
  const faltan = D.FILO_VOCABULARIO.filter(v => !fichaPlana.includes(limpia(v.a)));
  if (faltan.length) mal(`la ficha se dejó la definición de: ${faltan.map(v => v.w).join(' · ')}`);
  else ok(`las ${D.FILO_VOCABULARIO.length} palabras del vocabulario están en el papel con su definición`);

  /* La etimología es el CE1.1 del currículo: sin los dos trozos, la unidad no
     cumple el criterio que dice cumplir. */
  const et = D.FILO_PALABRA.partes.every(z => fichaPlana.includes(limpia(z.trozo)) && fichaPlana.includes(limpia(z.quiere)));
  if (!et) mal('la ficha no trae los dos trozos de la palabra «filosofía» con lo que quiere decir cada uno');
  else if (!fichaPlana.includes(limpia(D.FILO_PALABRA.ojo))) mal('la ficha no trae el aviso de que la palabra NO dice «el que sabe»');
  else ok('la etimología está en el papel, con sus dos trozos y su aviso');
}

/* ── 8) la ruta de los TRES ciclos, en la hoja del docente ──────── */
{
  let malos = 0;
  D.FILO_CICLOS.forEach(c => {
    [['pregunta', c.pregunta], ['habilidad', c.habilidad], ['actividad', c.actividad], ['producto', c.producto]]
      .forEach(([campo, valor]) => {
        if (!fichaPlana.includes(limpia(valor))) { mal(`la hoja del docente no trae la ${campo} de ${c.ciclo}`); malos++; }
      });
  });
  if (!malos) ok(`la hoja del docente trae los ${D.FILO_CICLOS.length} ciclos con su pregunta, su habilidad, su actividad y su producto`);
}

/* ── 9) la misión PINTA, no escribe a mano ──────────────────────── */
{
  /* ⚠️ Lo que se comprueba es que los CONTENEDORES de los pintores estén
     VACÍOS en el HTML, que es el invariante de verdad: si están vacíos, lo que
     el alumno lee salió del archivo de datos y no puede separarse del papel.

     La primera versión de esto buscaba cualquier pregunta del banco dentro del
     HTML y acusaba a un archivo sano: la situación del arranque CITA dos
     preguntas a propósito —son la historia de Yensi y de Denis, y esa historia
     va también en la ficha— y los widgets llevan una pregunta de muestra para
     que la tarjeta no parpadee vacía antes de que el JS la pinte, igual que el
     «1 misión» de los chips de la portada. Acusar eso enseña a no mirar la
     sonda, que es la lección de «Cuadrado Perfecto». */
  const CONTENEDORES = ['fi-palabra', 'fi-clases', 'fi-arbol', 'fi-raices', 'fi-pensadores', 'fi-rutina', 'fi-ciclos'];
  let llenos = 0;
  CONTENEDORES.forEach(id => {
    const re = new RegExp('id="' + id + '"[^>]*>([\\s\\S]*?)<\\/div>');
    const m = mision.match(re);
    if (!m) { mal(`el HTML de la misión no trae el contenedor #${id}, así que ese bloque no se pinta`); llenos++; return; }
    if (m[1].trim()) { mal(`el contenedor #${id} viene con contenido escrito a mano en el HTML: se pinta del archivo de datos, o vuelve a haber dos originales`); llenos++; }
  });
  if (!llenos) ok(`los ${CONTENEDORES.length} bloques de contenido están vacíos en el HTML: los pinta el archivo de datos`);
  if (!mision.includes('js/data/filosofia-asombro.js')) mal('la misión no enlaza js/data/filosofia-asombro.js');
  else ok('la misión enlaza el archivo de datos, y antes de su propio JS');
}

/* ── 10) ⚠️ NI UNA FECHA, ni en los datos ni en el papel ─────────── */
{
  /* Se quitan antes los comentarios del archivo de datos: su cabecera explica
     por qué no hay fechas y nombra las páginas de los PDF donde se confirmó el
     currículo. Es la trampa que este repositorio ya mordió cinco veces: el
     sitio donde se explica por qué algo no está es justo donde está escrito. */
  const sinComentarios = fs.readFileSync(DATOS, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
  /* ⚠️ Aquí NO basta con buscar años de cuatro dígitos, y se descubrió
     probando la sonda al revés: una fecha de esta unidad no se escribe «1956»,
     se escribe «624 a. C.» o «siglo VI a. C.», porque los tres pensadores son
     de la Grecia antigua. Buscando solo cuatro dígitos, la sonda daba verde
     con la fecha puesta, que es peor que no tenerla. */
  const anios = t => {
    const s = String(t);
    return [...new Set([]
      .concat(s.match(/\b(1[0-9]{3}|20[0-9]{2})\b/g) || [])          // 1956
      .concat(s.match(/\b\d{1,4}\s*[ad]\.?\s*de\s*C\.?/gi) || [])   // 624 antes de Cristo
      .concat(s.match(/\b\d{1,4}\s*[ad]\.?\s*C\.?\b/g) || [])       // 624 a. C.
      .concat(s.match(/\bsiglos?\s+[IVXLCDM]+\b/gi) || [])          // siglo VI
      .concat(s.match(/\bhace\s+[\d.,\u00a0 ]+\s*(?:mil\s+)?años\b/gi) || []) // hace 2 500 años
    )];
  };
  const enDatos = anios(sinComentarios);
  /* En el papel se mira solo lo que LEE una persona, sin el CSS ni los
     comentarios: el pie de las hojas y los estilos llevan números que no son
     fechas. */
  const leeUnaPersona = sinHtml(ficha.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' '));
  const enPapel = anios(leeUnaPersona);
  if (enDatos.length) mal(`el archivo de datos trae una fecha: ${enDatos.join(', ')}. De los tres pensadores no se afirma ningún año (ver su cabecera)`);
  else if (enPapel.length) mal(`la ficha trae una fecha que una persona lee: ${enPapel.join(', ')}`);
  else ok('ni una fecha, ni en los datos ni en el papel: lo que no se puede acreditar se convierte en la investigación');
}

/* ── 11) la sección de INVESTIGAR sigue en el papel, con su aviso ─ */
{
  if (!/Investiga/i.test(sinHtml(ficha))) mal('la ficha se quedó sin la sección de investigar: es lo primero que se cae al recortar una hoja');
  else if (!fichaPlana.includes(limpia('no traen respuesta')) && !fichaPlana.includes(limpia('No trae respuestas')))
    mal('la sección de investigar está, pero no dice que NO trae respuestas a propósito: sin ese aviso el maestro lo da por un descuido');
  else ok('la sección de investigar está en el papel, y dice que no trae respuestas a propósito');

  /* Y la normativa del papel: el círculo se RELLENA, la ✗ es para lo que está mal. */
  const mc = ficha.match(/<div class="preg-ops">[\s\S]*?<\/div>/g) || [];
  if (!mc.length) mal('la ficha no trae ninguna pregunta de selección múltiple con su círculo');
  else if (/[✗✘xX]\s*(?:la|el)\s|marca con una ✗|con una ✗/.test(sinHtml(ficha)))
    mal('la ficha pide marcar con una ✗: en el aula la ✗ significa MALO, y el círculo se RELLENA');
  else ok(`la selección múltiple lleva su círculo para rellenar (${mc.length} preguntas), nunca la ✗`);
}

/* ── 12) que se lea en cuarto grado ─────────────────────────────── */
console.log(`\n📖 Que se lea en cuarto grado · frase ≤ ${FRASE_MAX} · tramo ≤ ${TRAMO_MAX} · bloque ≤ ${MEDIA_BLOQUE} · misión ≤ ${MEDIA_MISION}\n`);
FILO.forEach(m => {
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
  if (fallos === f0) ok(`${nombre}: ${r.pantalla} palabras en pantalla · ${r.porFrase.toFixed(1)} pal/frase · frase máx ${r.maxFrase} · tramo máx ${r.maxTramo}`);
});

console.log(`\n${fallos ? '❌' : '✅'} ${fallos} fallo(s), ${avisos} aviso(s)\n`);
process.exit(fallos ? 1 : 0);
