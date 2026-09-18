/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · La Ruta de la Raíz dice lo mismo en la pantalla y en el papel
   ──────────────────────────────────────────────────────────────
   El temario de cada unidad vive en UN solo archivo (`js/data/filosofia-*.js`).
   De ahí lo saca la misión (que lo pinta al vuelo) y de ahí salió la ficha que
   el maestro fotocopia, que es HTML plano como las otras 75.

   Ese «salió de ahí» es lo que se despinta con el tiempo: alguien corrige el
   papel, o lo vuelve a armar de otra fuente, y a partir de ese día el alumno
   estudia una cosa y el examen le pide otra. Es la misma sonda que ya tienen
   el Himno, los próceres, los poderes y la Constitución, y por la misma razón.

   Lo que se le pide a CADA unidad de la ruta:

   · ⚠️ Que la CLASIFICACIÓN que el papel usa en sus actividades sea la del
     archivo de datos, y que su PAUTA no se lea del papel y se crea: se
     RECALCULA de los datos y se compara. Es lo que de verdad cuesta caro —una
     pregunta clasificada de dos maneras le marca en rojo al alumno que
     acertó, que es la avería del Escudo de Aspectos Cívicos— y con una sola
     fuente ya no se puede escribir; esto lo comprueba.

   · Que la misión NO lleve el temario escrito a mano: los contenedores de los
     pintores tienen que estar VACÍOS en el HTML. Si algún día alguien copia el
     contenido dentro «para que cargue antes», vuelve a haber dos originales y
     esta sonda deja de servir para nada.

   · ⚠️ Que no haya NI UNA FECHA, ni en los datos ni en el papel. Es la regla
     propia de esta ruta: de los pensadores se dice qué hicieron y por qué se
     les recuerda, porque un año sacado de un extracto de buscador no acredita
     nada. Una fecha que se cuele se pinta igual de bien y el alumno se la
     aprende para el examen.

   · ⚠️ Que la sección de INVESTIGAR siga en el papel, con su aviso de que no
     trae respuestas A PROPÓSITO. Es lo primero que se cae al recortar una
     ficha para ganar una hoja, y sin el aviso el maestro lo da por un
     descuido y se la salta.

   · ⚠️ Que NO se cuele nada para el maestro, ni en la pantalla ni en el papel.
     Estas misiones llevaban la rutina de la clase —los cinco momentos, con sus
     minutos—, la ruta por ciclo con su actividad y su producto, y dos hojas de
     notas de clase. El autor lo pidió quitar: quien abre una misión es el
     ALUMNO, y un plan de clase en su pantalla es texto que no le habla a él
     y que encima le salía a examen («¿cuál es el primer momento de una clase
     de filosofía?»). Lo único del maestro que se queda es la PAUTA de la
     ficha, que es la clave de corrección de esos mismos ejercicios.

   · Que el círculo se RELLENE y no se pida la ✗ para señalar lo correcto.

   · Y que se lea en cuarto grado, con la misma vara que la Ruta de la Máquina
     que Aprende y reutilizando `mide-legibilidad.js` en vez de copiarlo. Aquí
     aprieta más que allá: el currículo es el mismo para I, II y III Ciclo, así
     que la misma misión la abre un niño de 1.º y un joven de 9.º.

   Uso:  node _dev/verifica-filosofia.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { bloquesDe, resumen, FILO, MIN_BLOQUE } = require('./mide-legibilidad.js');

const RAIZ = path.resolve(__dirname, '..');

/* La misma vara de la ruta de IA, y por el mismo motivo. */
const FRASE_MAX = 25, TRAMO_MAX = 45, MEDIA_BLOQUE = 11, MEDIA_MISION = 8.5;

let fallos = 0, avisos = 0;
const ok    = t => console.log('  ✅ ' + t);
const mal   = t => { console.log('  ❌ ' + t); fallos++; };
const avisa = t => { console.log('  ⚠️  ' + t); avisos++; };

/* Se compara sin distinguir mayúsculas, tildes ni signos: en la ficha un mismo
   texto encabeza un recuadro y en la pantalla va a media frase. */
const limpia = t => String(t)
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .toLowerCase().replace(/[^a-z0-9ñ ]+/g, ' ').replace(/\s+/g, ' ').trim();
const sinHtml = h => h.replace(/<[^>]*>/g, ' ');

/* ── Las dos unidades de la ruta ─────────────────────────────────── */
const UNIDADES = [
  {
    n: 1, nombre: 'El Asombro',
    datos: 'js/data/filosofia-asombro.js',
    ficha: 'fichas/ficha-el-asombro.html',
    dir: 'misiones/basica-el-asombro', html: 'el-asombro.html', js: 'js/el-asombro.js',
    exporta: 'FILO_PALABRA,FILO_CLASES,FILO_PREGUNTAS,FILO_RAMAS,FILO_ARBOL,' +
             'FILO_PENSADORES,FILO_ORIGEN,FILO_VOCABULARIO',
    contenedores: ['fi-palabra', 'fi-clases', 'fi-arbol', 'fi-raices', 'fi-pensadores'],
    pensadores: 'FILO_PENSADORES', vocabulario: 'FILO_VOCABULARIO',
  },
  {
    n: 2, nombre: 'Pensar con Orden',
    datos: 'js/data/filosofia-logica.js',
    ficha: 'fichas/ficha-pensar-con-orden.html',
    dir: 'misiones/basica-pensar-con-orden', html: 'pensar-con-orden.html', js: 'js/pensar-con-orden.js',
    exporta: 'LOG_PIEZAS,LOG_SEMAFORO,LOG_RAZONES,LOG_FALACIAS,LOG_SI_ENTONCES,' +
             'LOG_VALIDEZ,LOG_CONECTORES,LOG_VOCABULARIO,LOG_PENSADORES,LOG_ARBOL',
    contenedores: ['lg-piezas', 'lg-semaforo', 'lg-si', 'lg-falacias', 'lg-validez',
                   'lg-conectores', 'lg-arbol', 'lg-pensadores'],
    pensadores: 'LOG_PENSADORES', vocabulario: 'LOG_VOCABULARIO',
  },
  {
    n: 3, nombre: '¿De qué está hecho el mundo?',
    datos: 'js/data/filosofia-mundo.js',
    ficha: 'fichas/ficha-de-que-esta-hecho-el-mundo.html',
    dir: 'misiones/basica-de-que-esta-hecho-el-mundo', html: 'de-que-esta-hecho-el-mundo.html',
    js: 'js/de-que-esta-hecho-el-mundo.js',
    exporta: 'MUN_METAFISICA,MUN_PREGUNTAS,MUN_TIPOS,MUN_TIPOS_OJO,MUN_CAMBIOS,' +
             'MUN_IDENTIDAD,MUN_IDENTIDAD_OJO,MUN_PUENTE,MUN_PUENTE_OJO,MUN_COSMOS,' +
             'MUN_INVESTIGA,MUN_VOCABULARIO,MUN_PENSADORES,MUN_ARBOL',
    contenedores: ['mu-preguntas', 'mu-tipos', 'mu-identidad', 'mu-puente',
                   'mu-cosmos', 'mu-investiga', 'mu-arbol', 'mu-pensadores'],
    pensadores: 'MUN_PENSADORES', vocabulario: 'MUN_VOCABULARIO',
  },
  {
    n: 4, nombre: '¿Cómo sé que sé?',
    datos: 'js/data/filosofia-saber.js',
    ficha: 'fichas/ficha-como-se-que-se.html',
    dir: 'misiones/basica-como-se-que-se', html: 'como-se-que-se.html',
    js: 'js/como-se-que-se.js',
    exporta: 'SAB_EPISTEMOLOGIA,SAB_ESTADOS,SAB_NOSE,SAB_AFIRMACIONES,SAB_FUENTES,' +
             'SAB_FUENTES_OJO,SAB_ENGANOS,SAB_ENGANOS_OJO,SAB_PASOS,SAB_ESCUELAS,' +
             'SAB_ESCUELAS_OJO,SAB_INVESTIGA,SAB_VOCABULARIO,SAB_PENSADORES,SAB_ARBOL',
    contenedores: ['sb-estados', 'sb-fuentes', 'sb-enganos', 'sb-pasos', 'sb-escuelas',
                   'sb-investiga', 'sb-arbol', 'sb-pensadores'],
    pensadores: 'SAB_PENSADORES', vocabulario: 'SAB_VOCABULARIO',
  },
  {
    n: 5, nombre: 'Palabras que piensan',
    datos: 'js/data/filosofia-lenguaje.js',
    ficha: 'fichas/ficha-palabras-que-piensan.html',
    dir: 'misiones/basica-palabras-que-piensan', html: 'palabras-que-piensan.html',
    js: 'js/palabras-que-piensan.js',
    exporta: 'LEN_LENGUAJE,LEN_ACTOS,LEN_ACTOS_OJO,LEN_DISFRAZ,LEN_DISFRAZ_OJO,' +
             'LEN_FRASES,LEN_AMBIG,LEN_AMBIG_OJO,LEN_DEFINIR,LEN_DEFINIR_OJO,' +
             'LEN_CARGA,LEN_CARGA_OJO,LEN_TRUCOS,LEN_TRUCOS_OJO,LEN_INVESTIGA,' +
             'LEN_VOCABULARIO,LEN_PENSADORES,LEN_ARBOL',
    contenedores: ['ln-actos', 'ln-carga', 'ln-ambig', 'ln-definir', 'ln-trucos',
                   'ln-investiga', 'ln-arbol', 'ln-pensadores'],
    pensadores: 'LEN_PENSADORES', vocabulario: 'LEN_VOCABULARIO',
  },
];

/* Carga el archivo de datos DE VERDAD, no con expresiones regulares: lo que se
   compara tiene que ser lo que la misión usa. */
function cargar(u) {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, u.datos), 'utf8') +
    ';this.__D={' + u.exporta + '};', ctx);
  return ctx.__D;
}

/* ── comprobaciones genéricas, iguales para las dos unidades ─────── */
function faltanEnPapel(fichaPlana, lista, campos, quien) {
  let malos = 0;
  lista.forEach(x => {
    campos.forEach(([campo, saca]) => {
      const valor = saca(x);
      if (!valor) return;
      if (!fichaPlana.includes(limpia(valor))) {
        mal(`la ficha no dice el ${campo} de «${x.nombre || x.w || x.materia || x.titulo}»`); malos++;
      }
    });
  });
  return malos;
}

function niUnaFecha(u) {
  /* ⚠️ Aquí NO basta con buscar años de cuatro dígitos, y se descubrió
     probando la sonda al revés: una fecha de esta ruta no se escribe «1956»,
     se escribe «624 a. C.» o «siglo VI», porque los pensadores son de la
     Grecia antigua. Buscando solo cuatro dígitos, la sonda daba verde con la
     fecha puesta, que es peor que no tenerla. */
  const anios = t => {
    const s = String(t);
    return [...new Set([]
      .concat(s.match(/\b(1[0-9]{3}|20[0-9]{2})\b/g) || [])
      .concat(s.match(/\b\d{1,4}\s*[ad]\.?\s*de\s*C\.?/gi) || [])
      .concat(s.match(/\b\d{1,4}\s*[ad]\.?\s*C\.?\b/g) || [])
      .concat(s.match(/\bsiglos?\s+[IVXLCDM]+\b/gi) || [])
      .concat(s.match(/\bhace\s+[\d.,  ]+\s*(?:mil\s+)?años\b/gi) || [])
    )];
  };
  /* Se quitan antes los comentarios del archivo de datos: su cabecera explica
     por qué no hay fechas y nombra las páginas de los PDF donde se confirmó el
     currículo. Es la trampa que este repositorio ya mordió cinco veces: el
     sitio donde se explica por qué algo no está es justo donde está escrito. */
  const sinComentarios = fs.readFileSync(path.join(RAIZ, u.datos), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/.*$/gm, '$1');
  const ficha = fs.readFileSync(path.join(RAIZ, u.ficha), 'utf8');
  /* En el papel se mira solo lo que LEE una persona, sin el CSS ni los
     comentarios: el pie de las hojas y los estilos llevan números que no son
     fechas. */
  const leeUnaPersona = sinHtml(ficha.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<!--[\s\S]*?-->/g, ' '));
  const enDatos = anios(sinComentarios), enPapel = anios(leeUnaPersona);
  if (enDatos.length) mal(`u${u.n}: el archivo de datos trae una fecha: ${enDatos.join(', ')}. De los pensadores no se afirma ningún año (ver su cabecera)`);
  else if (enPapel.length) mal(`u${u.n}: la ficha trae una fecha que una persona lee: ${enPapel.join(', ')}`);
  else ok(`u${u.n}: ni una fecha, ni en los datos ni en el papel`);
}

function contenedoresVacios(u, mision) {
  /* ⚠️ Lo que se comprueba es que los CONTENEDORES de los pintores estén
     VACÍOS, que es el invariante de verdad: si están vacíos, lo que el alumno
     lee salió del archivo de datos y no puede separarse del papel.

     La primera versión de esto buscaba cualquier dato del banco dentro del
     HTML y acusaba a un archivo sano: la situación del arranque CITA a
     propósito (es la historia que va también en la ficha) y los widgets llevan
     un ejemplo de muestra para que la tarjeta no parpadee vacía antes de que
     el JS la pinte, igual que el «1 misión» de los chips de la portada.
     Acusar eso enseña a no mirar la sonda, que es la lección de «Cuadrado
     Perfecto». */
  let llenos = 0;
  u.contenedores.forEach(id => {
    const re = new RegExp('id="' + id + '"[^>]*>([\\s\\S]*?)<\\/div>');
    const m = mision.match(re);
    if (!m) { mal(`u${u.n}: el HTML no trae el contenedor #${id}, así que ese bloque no se pinta`); llenos++; return; }
    if (m[1].trim()) { mal(`u${u.n}: el contenedor #${id} viene con contenido escrito a mano en el HTML`); llenos++; }
  });
  if (!llenos) ok(`u${u.n}: los ${u.contenedores.length} bloques de contenido están vacíos en el HTML: los pinta el archivo de datos`);
  if (!mision.includes(u.datos)) mal(`u${u.n}: la misión no enlaza ${u.datos}`);
  else ok(`u${u.n}: la misión enlaza su archivo de datos, y antes de su propio JS`);
}

function investigaYCirculo(u, ficha, fichaPlana) {
  if (!/Investiga/i.test(sinHtml(ficha))) mal(`u${u.n}: la ficha se quedó sin la sección de investigar: es lo primero que se cae al recortar una hoja`);
  else if (!fichaPlana.includes(limpia('no traen respuesta')) && !fichaPlana.includes(limpia('No trae respuestas')))
    mal(`u${u.n}: la sección de investigar está, pero no dice que NO trae respuestas a propósito`);
  else ok(`u${u.n}: la sección de investigar está en el papel, y dice que no trae respuestas a propósito`);

  const mc = ficha.match(/<div class="preg-ops">[\s\S]*?<\/div>/g) || [];
  if (!mc.length) mal(`u${u.n}: la ficha no trae ninguna pregunta de selección múltiple con su círculo`);
  else if (/marca con una ✗|marcá con una ✗|con una ✗ (?:la|el) (?:respuesta|letra|opción)/i.test(sinHtml(ficha)))
    mal(`u${u.n}: la ficha pide marcar la respuesta correcta con una ✗: en el aula la ✗ significa MALO, y el círculo se RELLENA`);
  else ok(`u${u.n}: la selección múltiple lleva su círculo para rellenar (${mc.length} preguntas)`);
}

function pensadoresYVocabulario(u, D, fichaPlana) {
  const pens = D[u.pensadores];
  const malos = faltanEnPapel(fichaPlana, pens,
    [['nombre', p => p.nombre], ['quién fue', p => p.quien], ['qué hizo', p => p.hizo],
     ['por qué se le recuerda', p => p.porque], ['dato', p => p.dato]], 'pensador');
  if (!malos) ok(`u${u.n}: los ${pens.length} pensadores están en el papel, cada uno con sus cuatro campos`);

  const voc = D[u.vocabulario];
  const faltan = voc.filter(v => !fichaPlana.includes(limpia(v.a)));
  if (faltan.length) mal(`u${u.n}: la ficha se dejó la definición de: ${faltan.map(v => v.w).join(' · ')}`);
  else ok(`u${u.n}: las ${voc.length} palabras del vocabulario están en el papel con su definición`);
}

/* ⚠️ NADA DEL MAESTRO, ni en la pantalla ni en el papel.
   Lo pidió el autor y aquí se comprueba, porque volver a meterlo es lo más
   fácil del mundo: la plantilla de la que se calca una misión de esta ruta
   llevaba la rutina de la clase y la ruta por ciclo, y las dos se pintaban
   perfectamente. La pantalla la abre el ALUMNO.

   ⚠️ Se quitan los COMENTARIOS antes de buscar, y las hojas de estilo. Es la
   trampa de siempre —van ya unas cuantas en este repositorio—: el sitio donde
   se explica que algo se quitó es justo donde ese algo sigue escrito. Sin
   esto, el comentario de `el-asombro.js` que cuenta por qué se fue el widget
   de los cinco momentos pone roja a la sonda, y el de la cabecera de las dos
   fichas también.

   Y NO se busca «docente» ni «maestro» a secas: la ficha dice «NO se
   fotocopia» en su pauta y el alumno tiene un botón que le manda el resultado
   a su maestro. Se buscan las frases que solo pueden venir de un plan de
   clase. */
const DEL_MAESTRO = [
  ['para el maestro',        'una tarjeta o un bloque dirigido al maestro'],
  ['hoja del docente',       'una hoja del docente'],
  ['notas de clase',         'notas de clase'],
  ['antes de dar la clase',  'instrucciones de cómo dar la clase'],
  ['momentos de una clase',  'la rutina de la clase'],
  ['metacognici',            'un momento de la rutina de la clase'],
  ['45 minutos',             'la duración de la sesión'],
  ['dos veces por semana',   'la frecuencia de la clase'],
  /* ⚠️ Estos tres llevan `dosPuntos`, y no es un detalle: su señal ES el dos
     puntos del rótulo de una ruta por ciclo —«Habilidad: …», «Producto: …»—.
     `limpia` se come la puntuación, así que la aguja «producto:» quedaba en
     «producto» y cazaba español corriente: la unidad 5 salió roja por decir
     «en la pulpería te dicen que un producto es de mejor calidad», que es una
     frase perfecta. Es la lección de «Cuadrado Perfecto» y la del `\bllama\b`
     de `verifica-descubre-ia`: una sonda que se pone roja sin avería enseña a
     no mirarla. Con `dosPuntos` se busca en el texto CON su puntuación. */
  ['habilidad:',             'la ruta por ciclo (su habilidad)', true],
  ['producto:',              'la ruta por ciclo (su producto)', true],
  ['pregunta con que se entra', 'la ruta por ciclo (su pregunta de entrada)'],
];
/* Normalización suave: baja acentos y mayúsculas pero DEJA la puntuación, que
   es lo único que distingue un rótulo de una palabra. */
const suave = t => String(t).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .toLowerCase().replace(/\s+/g, ' ');
const sinComentarios = t => t
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .replace(/^\s*\/\/.*$/gm, ' ');

function nadaDelMaestro(u) {
  const donde = [
    [u.ficha, 'la ficha'],
    [path.join(u.dir, u.html), 'la pantalla'],
    [path.join(u.dir, u.js), 'el JS de la misión'],
    [u.datos, 'el archivo de datos'],
  ];
  let malos = 0;
  donde.forEach(([rel, nombre]) => {
    const crudo = sinHtml(sinComentarios(fs.readFileSync(path.join(RAIZ, rel), 'utf8')));
    const txt = limpia(crudo), conPuntos = suave(crudo);
    DEL_MAESTRO.forEach(([aguja, que, dosPuntos]) => {
      if (dosPuntos ? conPuntos.includes(suave(aguja)) : txt.includes(limpia(aguja))) {
        mal(`u${u.n}: ${nombre} trae ${que} («${aguja}»): esto es para el alumno`); malos++;
      }
    });
  });
  if (!malos) ok(`u${u.n}: ni la pantalla ni el papel traen plan de clase, rutina ni ruta por ciclo`);
}

/* ── UNIDAD 1: lo suyo ───────────────────────────────────────────── */
function revisaAsombro(D, ficha, fichaPlana) {
  let malos = faltanEnPapel(fichaPlana, D.FILO_CLASES,
    [['nombre', k => k.nombre], ['señal', k => k.senal], ['ejemplo', k => k.ejemplo],
     ['dónde se contesta', k => k.donde], ['trampa', k => k.trampa]], 'clase');
  if (!malos) ok(`u1: las ${D.FILO_CLASES.length} clases de pregunta están en el papel con su señal, su ejemplo y su trampa`);

  /* ⚠️ La pauta se busca DENTRO del bloque .pauta, no por su título: ese mismo
     título encabeza la actividad, y buscarlo en la ficha entera hacía caer el
     match en el encabezado —que no lleva claves— y daba «la pauta no trae
     ninguna clave» con el papel perfectamente puesto. */
  const letra = { hechos: 'H', significado: 'S', valor: 'V' };
  const clase = {};
  D.FILO_PREGUNTAS.forEach(p => { clase[limpia(p.p)] = letra[p.clase]; });
  const bloque = ficha.match(/<div class="pauta">[\s\S]*?\n    <\/div>/);
  const pauta = bloque && bloque[0].match(/¿De qué clase es\?[\s\S]*?<\/div>/);
  const tabla = ficha.match(/<tr><th style="width:8%">Clase<\/th>[\s\S]*?<\/table>/);
  if (!pauta || !tabla) mal('u1: no se encontró la actividad «¿De qué clase es?» o su pauta');
  else {
    const claves = [...pauta[0].matchAll(/(\d+)\.\s*([HSV])\b/g)].map(m => m[2]);
    const celdas = [...tabla[0].matchAll(/<td>(¿[^<]+\?)<\/td>/g)].map(m => limpia(m[1]));
    if (celdas.length !== claves.length) mal(`u1: la tabla trae ${celdas.length} preguntas y la pauta ${claves.length} claves`);
    else {
      let m2 = 0;
      celdas.forEach((c, i) => {
        if (!clase[c]) { mal(`u1: la tabla usa una pregunta que no está en el archivo de datos: «${c}»`); m2++; return; }
        if (claves[i] !== clase[c]) { mal(`u1: la pregunta ${i + 1} («${c}») es ${clase[c]} en los datos y la pauta dice ${claves[i]}`); m2++; }
      });
      if (!m2) ok(`u1: las ${celdas.length} preguntas de la actividad llevan en la pauta la clase que dicen los datos`);
    }
  }

  malos = faltanEnPapel(fichaPlana, D.FILO_ARBOL,
    [['materia', a => a.materia], ['pregunta de origen', a => a.nacio], ['pregúntate hoy', a => a.hoy]], 'materia');
  if (!malos) ok(`u1: las ${D.FILO_ARBOL.length} materias del árbol están en el papel con su pregunta de origen`);

  const faltanR = D.FILO_RAMAS.filter(r => !fichaPlana.includes(limpia(r.nombre)) || !fichaPlana.includes(limpia(r.pregunta)));
  if (faltanR.length) mal(`u1: la ficha se dejó ${faltanR.length} raíz(ces): ${faltanR.map(r => r.nombre).join(' · ')}`);
  else ok(`u1: las ${D.FILO_RAMAS.length} raíces están en el papel, cada una con su pregunta`);

  const et = D.FILO_PALABRA.partes.every(z => fichaPlana.includes(limpia(z.trozo)) && fichaPlana.includes(limpia(z.quiere)));
  if (!et) mal('u1: la ficha no trae los dos trozos de la palabra «filosofía»');
  else if (!fichaPlana.includes(limpia(D.FILO_PALABRA.ojo))) mal('u1: la ficha no trae el aviso de que la palabra NO dice «el que sabe»');
  else ok('u1: la etimología está en el papel, con sus dos trozos y su aviso');
}

/* ── UNIDAD 2: lo suyo ───────────────────────────────────────────── */
function revisaLogica(D, ficha, fichaPlana) {
  let malos = faltanEnPapel(fichaPlana, D.LOG_PIEZAS,
    [['nombre', p => p.nombre], ['qué es', p => p.que], ['dónde va', p => p.donde], ['ejemplo', p => p.ejemplo]], 'pieza');
  if (!malos) ok(`u2: las ${D.LOG_PIEZAS.length} piezas de un argumento están en el papel`);

  malos = faltanEnPapel(fichaPlana, D.LOG_SEMAFORO,
    [['nombre', s => s.nombre], ['señal', s => s.senal], ['prueba', s => s.prueba]], 'color');
  if (!malos) ok(`u2: los ${D.LOG_SEMAFORO.length} colores del semáforo están en el papel con su señal y su prueba`);

  /* ⚠️ Cada color lleva SU EMOJI además del color: la hoja se fotocopia en
     blanco y negro y uno de cada doce niños no distingue el rojo del verde.
     Sin el emoji, el semáforo es justo la actividad que él no puede hacer. */
  const sinEmoji = D.LOG_SEMAFORO.filter(s => !ficha.includes(s.emoji));
  if (sinEmoji.length) mal(`u2: el papel dice ${sinEmoji.length} color(es) del semáforo SIN su emoji: ${sinEmoji.map(s => s.nombre).join(' · ')}. Fotocopiado en blanco y negro, eso es una actividad que no se puede hacer`);
  else ok('u2: los tres colores del semáforo llevan su emoji además del color');

  /* La pauta del semáforo, RECALCULADA de los datos. */
  const letra = { verde: 'V', amarillo: 'A', rojo: 'R' };
  const color = {};
  D.LOG_RAZONES.forEach(x => { color[limpia(x.r)] = letra[x.color]; });
  const bloque = ficha.match(/<div class="pauta">[\s\S]*?\n    <\/div>/);
  const pauta = bloque && bloque[0].match(/El semáforo[\s\S]*?<\/div>/);
  const tabla = ficha.match(/<tr><th style="width:8%">Color<\/th>[\s\S]*?<\/table>/);
  if (!pauta || !tabla) mal('u2: no se encontró la actividad del semáforo o su pauta');
  else {
    const claves = [...pauta[0].matchAll(/(\d+)\.\s*([VAR])\b/g)].map(m => m[2]);
    const celdas = [...tabla[0].matchAll(/<td>(Porque[^<]*)<\/td>/g)].map(m => limpia(m[1]));
    if (celdas.length !== claves.length) mal(`u2: la tabla trae ${celdas.length} razones y la pauta ${claves.length} claves`);
    else {
      let m2 = 0;
      celdas.forEach((c, i) => {
        if (!color[c]) { mal(`u2: la tabla usa una razón que no está en el archivo de datos: «${c}»`); m2++; return; }
        if (claves[i] !== color[c]) { mal(`u2: la razón ${i + 1} («${c}») es ${color[c]} en los datos y la pauta dice ${claves[i]}`); m2++; }
      });
      if (!m2) ok(`u2: las ${celdas.length} razones de la actividad llevan en la pauta el color que dicen los datos`);
    }
  }

  malos = faltanEnPapel(fichaPlana, D.LOG_FALACIAS,
    [['nombre', f => f.nombre], ['mecanismo', f => f.mecanismo], ['cómo suena', f => f.suena],
     ['la pregunta que la desarma', f => f.desarma], ['qué cuesta', f => f.cuesta]], 'falacia');
  if (!malos) ok(`u2: las ${D.LOG_FALACIAS.length} falacias están en el papel, y cada una con la pregunta que la desarma`);

  /* ⚠️ Los cuatro casos de validez, con su combinación. Es la idea más difícil
     de la unidad y la que se cae primero al recortar: sin los cuatro, el
     alumno no puede ver que «bien hecho» y «verdad» son dos cosas que se
     combinan de cuatro maneras. */
  malos = faltanEnPapel(fichaPlana, D.LOG_VALIDEZ,
    [['título', v => v.titulo], ['conclusión', v => v.conclusion], ['explicación', v => v.que]], 'caso');
  D.LOG_VALIDEZ.forEach(v => v.razones.forEach(r => {
    if (!fichaPlana.includes(limpia(r))) { mal(`u2: la ficha no trae la razón «${r}» del caso «${v.titulo}»`); malos++; }
  }));
  const combos = new Set(D.LOG_VALIDEZ.map(v => (v.bienHecho ? 'B' : 'M') + (v.verdad ? 'V' : 'F')));
  if (combos.size !== 4) mal(`u2: los casos de validez cubren ${combos.size} de las 4 combinaciones (${[...combos].join(', ')}): sin las cuatro no se ve que son dos cosas distintas`);
  else if (!malos) ok('u2: los cuatro casos de validez están en el papel y cubren las cuatro combinaciones');

  const S = D.LOG_SI_ENTONCES;
  const piezas = [['la regla', S.regla], ['el caso que SÍ vale', S.bien.luego], ['el error clásico', S.mal.luego],
                  ['por qué el error falla', S.mal.porque], ['el aviso del sentido único', S.ojo]];
  const faltanS = piezas.filter(([, v]) => !fichaPlana.includes(limpia(v)));
  if (faltanS.length) mal(`u2: la ficha se dejó del «si… entonces»: ${faltanS.map(x => x[0]).join(' · ')}`);
  else ok('u2: el «si… entonces» está en el papel con su lado bueno, su error clásico y su aviso');

  const faltanC = D.LOG_CONECTORES.filter(x => !fichaPlana.includes(limpia(x.w)) || !fichaPlana.includes(limpia(x.hace)));
  if (faltanC.length) mal(`u2: la ficha se dejó ${faltanC.length} conector(es): ${faltanC.map(x => x.w).join(' · ')}`);
  else ok(`u2: los ${D.LOG_CONECTORES.length} conectores están en el papel con lo que hace cada uno`);

  const faltanA = D.LOG_ARBOL.filter(a => !fichaPlana.includes(limpia(a.le)) || !fichaPlana.includes(limpia(a.hoy)));
  if (faltanA.length) mal(`u2: la ficha se dejó lo que la lógica le da a: ${faltanA.map(a => a.materia).join(' · ')}`);
  else ok(`u2: las ${D.LOG_ARBOL.length} materias están en el papel con lo que la lógica les da`);
}

/* ── UNIDAD 3: lo suyo ───────────────────────────────────────────── */
function revisaMundo(D, ficha, fichaPlana, misionJs) {
  let malos = faltanEnPapel(fichaPlana, D.MUN_PREGUNTAS,
    [['nombre', p => p.nombre], ['qué busca', p => p.que], ['el ejemplo de aquí', p => p.aqui],
     ['qué pasa hoy con ella', p => p.hoy]], 'pregunta');
  if (!malos) ok(`u3: las ${D.MUN_PREGUNTAS.length} preguntas grandes están en el papel con sus cuatro campos`);

  malos = faltanEnPapel(fichaPlana, D.MUN_TIPOS,
    [['nombre', t => t.nombre], ['señal', t => t.senal], ['prueba', t => t.prueba]], 'clase de cambio');
  if (!malos) ok(`u3: las ${D.MUN_TIPOS.length} clases de cambio están en el papel con su señal y su prueba`);

  /* ⚠️ Cada clase lleva SU EMOJI además del color: la hoja se fotocopia en
     blanco y negro y uno de cada doce niños no distingue el rojo del verde.
     Sin el emoji, clasificar cambios es justo la actividad que él no puede
     hacer. Es la misma comprobación que el semáforo de la unidad 2. */
  const sinEmoji = D.MUN_TIPOS.filter(t => !ficha.includes(t.emoji));
  if (sinEmoji.length) mal(`u3: el papel dice ${sinEmoji.length} clase(s) de cambio SIN su emoji: ${sinEmoji.map(t => t.nombre).join(' · ')}. Fotocopiado en blanco y negro, eso es una actividad que no se puede hacer`);
  else ok('u3: las tres clases de cambio llevan su emoji además del color');

  /* ⚠️ El ATAJO QUE FALLA va escrito, no callado. «Si se puede deshacer,
     cambió la forma» se enseña en la escuela y no siempre acierta: la sal
     disuelta vuelve a salir. Callarlo sería enseñar una regla falsa. */
  if (!fichaPlana.includes(limpia(D.MUN_TIPOS_OJO)))
    mal('u3: la ficha no avisa de que el atajo de «si se puede deshacer» no siempre acierta');
  else ok('u3: el papel dice que el atajo de la escuela falla, en vez de callarlo');

  /* La pauta de «¿Qué cambió?», RECALCULADA de los datos. Es la avería del
     Escudo marcado en rojo: el ejercicio y la clave salen del mismo sitio, y
     aquí se comprueba que el papel no se haya separado de él. */
  const letra = { forma: 'F', materia: 'M', nombre: 'D' };
  const clase = {};
  D.MUN_CAMBIOS.forEach(x => { clase[limpia(x.c)] = letra[x.q]; });
  const bloque = ficha.match(/<div class="pauta">[\s\S]*?\n    <\/div>/);
  const pauta = bloque && bloque[0].match(/¿Qué cambió\?[\s\S]*?<\/div>/);
  const tabla = ficha.match(/<tr><th style="width:10%">F, M o D<\/th>[\s\S]*?<\/table>/);
  if (!pauta || !tabla) mal('u3: no se encontró la actividad de «¿Qué cambió?» o su pauta');
  else {
    const claves = [...pauta[0].matchAll(/(\d+)\.\s*([FMD])\b/g)].map(m => m[2]);
    const celdas = [...tabla[0].matchAll(/<tr><td><\/td><td>([^<]*)<\/td><\/tr>/g)].map(m => limpia(m[1]));
    if (celdas.length !== claves.length) mal(`u3: la tabla trae ${celdas.length} cambios y la pauta ${claves.length} claves`);
    else {
      let m2 = 0;
      celdas.forEach((c, i) => {
        if (!clase[c]) { mal(`u3: la tabla usa un cambio que no está en el archivo de datos: «${c}»`); m2++; return; }
        if (claves[i] !== clase[c]) { mal(`u3: el cambio ${i + 1} («${c}») es ${clase[c]} en los datos y la pauta dice ${claves[i]}`); m2++; }
      });
      if (!m2) ok(`u3: los ${celdas.length} cambios de la actividad llevan en la pauta la clase que dicen los datos`);
    }
  }

  malos = faltanEnPapel(fichaPlana, D.MUN_IDENTIDAD,
    [['título', k => k.titulo], ['qué cambió', k => k.cambio], ['el lado del sí', k => k.unos],
     ['el lado del no', k => k.otros], ['qué lo decide', k => k.decide]], 'caso');
  if (!malos) ok(`u3: los ${D.MUN_IDENTIDAD.length} casos de identidad están en el papel con sus DOS lados`);

  /* ⚠️ Y que se diga que NO tienen una sola respuesta buena. Sin ese aviso, la
     ficha pregunta algo con dos respuestas buenas y solo acepta una: es la
     misma decisión que héroe y prócer en la Ruta de la Patria. */
  if (!fichaPlana.includes(limpia(D.MUN_IDENTIDAD_OJO)) &&
      !/no tiene(n)? una sola respuesta buena/i.test(sinHtml(ficha)))
    mal('u3: el papel no dice que los casos de identidad NO tienen una sola respuesta buena');
  else ok('u3: el papel avisa de que los casos de identidad no se califican como si tuvieran una respuesta');

  malos = faltanEnPapel(fichaPlana, D.MUN_PUENTE,
    [['la pregunta', x => x.p], ['lo que se contestó pensando', x => x.antes],
     ['lo que hoy se mide', x => x.hoy], ['quién hizo qué', x => x.quien]], 'puente');
  if (!malos) ok(`u3: los ${D.MUN_PUENTE.length} puentes están en el papel, con lo de antes y lo de hoy`);

  if (!fichaPlana.includes(limpia(D.MUN_PUENTE_OJO)))
    mal('u3: la ficha no avisa de que NO todas las preguntas se le pasaron a la ciencia');
  else ok('u3: el papel dice que queda una pregunta sin aparato que la mida');

  const C = D.MUN_COSMOS;
  const faltaC = [['qué es', C.que], ['que todos tenemos una', C.toda], ['lo de Honduras', C.aqui]]
    .filter(([, v]) => !fichaPlana.includes(limpia(v)));
  const faltaP = C.preguntas.filter(q => !fichaPlana.includes(limpia(q.p)));
  if (faltaC.length || faltaP.length)
    mal(`u3: la ficha se dejó de la cosmovisión: ${faltaC.map(x => x[0]).concat(faltaP.map(q => q.p)).join(' · ')}`);
  else ok('u3: la cosmovisión está en el papel con las tres preguntas que toda cosmovisión contesta');

  /* ⚠️ Y NINGÚN pueblo de Honduras lleva escrita aquí una creencia sobre el
     origen del mundo: este repositorio no tiene con qué acreditarlo, y ponerle
     a un pueblo una que no se sostiene es peor que callarla. Si mañana alguien
     escribe una, la sonda se pone roja. Es la misma regla que dejó fuera los
     números de decreto de la flor y del árbol nacionales. */
  const PUEBLOS = ['lenca', 'maya chortí', 'chortí', 'miskito', 'misquito', 'garífuna',
                   'tolupán', 'pech', 'tawahka', 'nahua'];
  const textos = [[fichaPlana, 'la ficha'],
                  [limpia(sinHtml(fs.readFileSync(path.join(RAIZ, 'misiones/basica-de-que-esta-hecho-el-mundo/de-que-esta-hecho-el-mundo.html'), 'utf8'))), 'la pantalla'],
                  [limpia(fs.readFileSync(path.join(RAIZ, 'js/data/filosofia-mundo.js'), 'utf8')), 'el archivo de datos']];
  let conPueblo = 0;
  textos.forEach(([t, donde]) => PUEBLOS.forEach(p => {
    if (t.includes(limpia(p))) { mal(`u3: ${donde} nombra al pueblo ${p}: aquí no se le atribuye a NINGÚN pueblo una creencia que no se puede acreditar`); conPueblo++; }
  }));
  if (!conPueblo) ok('u3: no se le atribuye a ningún pueblo una cosmovisión que no se puede acreditar');

  const faltanA = D.MUN_ARBOL.filter(a => !fichaPlana.includes(limpia(a.le)) || !fichaPlana.includes(limpia(a.hoy)));
  if (faltanA.length) mal(`u3: la ficha se dejó lo que esta pregunta le da a: ${faltanA.map(a => a.materia).join(' · ')}`);
  else ok(`u3: las ${D.MUN_ARBOL.length} materias están en el papel con lo que esta pregunta les deja`);

  /* ⚠️ La metafísica se define IGUAL que en la unidad 1. El alumno abre las
     dos seguidas y no puede leer dos definiciones distintas de lo mismo. No se
     comparan letra por letra —son dos redacciones—: se busca la tirada de
     palabras más larga que comparten, como hace la sonda del Himno con una
     cita. Si alguien cambia una sola, se cae. */
  const c1 = {}; vm.createContext(c1);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/data/filosofia-asombro.js'), 'utf8') + ';this.__R=FILO_RAMAS;', c1);
  const raiz = c1.__R.find(r => r.clave === 'metafisica');
  const a = limpia(raiz.pregunta + ' ' + raiz.hace).split(/\s+/);
  const b = limpia(D.MUN_METAFISICA.pregunta + ' ' + D.MUN_METAFISICA.hace).split(/\s+/);
  let mejor = 0;
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) {
    let k = 0; while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++;
    if (k > mejor) mejor = k;
  }
  if (mejor < 6) mal(`u3: la metafísica se define distinto que en la unidad 1 (solo comparten ${mejor} palabras seguidas): el alumno abre las dos y leería dos cosas`);
  else ok(`u3: la metafísica dice lo mismo que en la unidad 1 (${mejor} palabras seguidas iguales)`);

  /* Que el Clasifica y el Reto salgan del MISMO sitio: es lo que hace
     imposible la avería del Escudo marcado en rojo. */
  if (!/munDeClase\(/.test(misionJs))
    mal('u3: el JS de la misión no saca los cambios de munDeClase(): el Clasifica y el Reto podrían contradecirse');
  else ok('u3: el Clasifica y el Reto salen los dos del archivo de datos');
}

/* ══════════════════ unidad 4 · ¿Cómo sé que sé? ══════════════════ */
function revisaSaber(D, ficha, fichaPlana, misionJs) {
  let malos = faltanEnPapel(fichaPlana, D.SAB_ESTADOS,
    [['nombre', e => e.nombre], ['señal', e => e.senal], ['prueba', e => e.prueba]], 'manera');
  if (!malos) ok(`u4: las ${D.SAB_ESTADOS.length} maneras de estar con una idea están en el papel con su señal y su prueba`);

  /* ⚠️ Cada manera lleva SU EMOJI además del color. La hoja se fotocopia en
     blanco y negro y uno de cada doce niños no distingue el rojo del verde:
     sin el emoji, clasificar afirmaciones es justo la actividad que él no
     puede hacer. Es la misma comprobación que el semáforo de la unidad 2 y
     las clases de cambio de la 3. */
  const sinEmoji = D.SAB_ESTADOS.filter(e => !ficha.includes(e.emoji));
  if (sinEmoji.length) mal(`u4: el papel dice ${sinEmoji.length} manera(s) SIN su emoji: ${sinEmoji.map(e => e.nombre).join(' · ')}. Fotocopiado en blanco y negro, eso es una actividad que no se puede hacer`);
  else ok('u4: las tres maneras llevan su emoji además del color');

  /* ⚠️ «No sé» es una CUARTA que vale igual, y va escrita. Una unidad que solo
     enseñara las tres primeras fabrica un alumno que tiene que elegir una
     aunque no le toque ninguna, que es exactamente cómo se aprende a decir
     «sé» sin haberlo comprobado. */
  if (!fichaPlana.includes(limpia(D.SAB_NOSE)))
    mal('u4: el papel no dice que «no sé» vale igual y no es perder');
  else ok('u4: el papel dice que «no sé» es una respuesta que vale, no una derrota');

  malos = faltanEnPapel(fichaPlana, D.SAB_FUENTES,
    [['nombre', f => f.nombre], ['para qué sirve', f => f.sirve],
     ['cuándo falla', f => f.falla], ['cómo se arregla', f => f.arregla]], 'fuente');
  if (!malos) ok(`u4: las ${D.SAB_FUENTES.length} fuentes están en el papel con lo que hacen bien, lo que les falla y su arreglo`);

  /* ⚠️ Lo que SIRVE va ANTES de lo que FALLA, en el papel y en la pantalla. Una
     unidad que presente las fuentes por sus fallos fabrica un alumno que
     desconfía de todo, y eso cuesta lo mismo que creerlo todo: es la misma
     regla que el mensaje sin señales de los peligros de la IA. */
  [[fichaPlana, 'el papel'],
   [limpia(sinHtml(fs.readFileSync(path.join(RAIZ, 'misiones/basica-como-se-que-se/como-se-que-se.html'), 'utf8'))), 'la pantalla']]
    .forEach(([t, donde]) => {
      const alReves = D.SAB_FUENTES.filter(f => {
        const s = t.indexOf(limpia(f.sirve)), x = t.indexOf(limpia(f.falla));
        return s >= 0 && x >= 0 && x < s;
      });
      if (alReves.length) mal(`u4: en ${donde}, ${alReves.length} fuente(s) enseñan su fallo ANTES de para qué sirven: ${alReves.map(f => f.nombre).join(' · ')}`);
      else ok(`u4: en ${donde}, cada fuente dice primero para qué sirve y después dónde falla`);
    });

  if (!fichaPlana.includes(limpia(D.SAB_FUENTES_OJO)))
    mal('u4: la ficha no avisa de que ninguna fuente sobra y ninguna basta sola');
  else ok('u4: el papel dice que las fuentes se cruzan, en vez de elegir una');

  /* Los cuatro engaños. ⚠️ Cada uno tiene que traer CÓMO SE HACE y CÓMO SE
     DESARMA: sin lo primero el alumno lo lee en vez de producirlo, y sin lo
     segundo la unidad le enseña que sus ojos no sirven. */
  malos = faltanEnPapel(fichaPlana, D.SAB_ENGANOS,
    [['título', g => g.titulo], ['cómo se hace', g => g.hace], ['qué se ve', g => g.ves],
     ['qué pasa de verdad', g => g.pasa], ['cómo se desarma', g => g.desarma]], 'engaño');
  if (!malos) ok(`u4: los ${D.SAB_ENGANOS.length} engaños están en el papel con cómo se hacen y cómo se desarman`);

  if (!fichaPlana.includes(limpia(D.SAB_ENGANOS_OJO)))
    mal('u4: la ficha no avisa de que un sentido engañado NO quiere decir que no sirva');
  else ok('u4: el papel dice que los engaños se arreglan, en vez de dejar al alumno desconfiando de sus ojos');

  malos = faltanEnPapel(fichaPlana, D.SAB_PASOS,
    [['el paso', s => s.paso], ['por qué', s => s.porque]], 'paso');
  if (!malos) ok(`u4: los ${D.SAB_PASOS.length} pasos de comprobar están en el papel con su por qué`);

  malos = faltanEnPapel(fichaPlana, D.SAB_ESCUELAS,
    [['nombre', x => x.nombre], ['qué dice', x => x.dice], ['en qué acierta', x => x.acierta],
     ['dónde se queda corta', x => x.corto]], 'escuela');
  if (!malos) ok(`u4: las ${D.SAB_ESCUELAS.length} escuelas están en el papel con su acierto Y su límite`);

  /* ⚠️ Y que NO gane ninguna. El CE4.2 pide compararlas con el método
     comparativo, no elegir: declarar una ganadora sería calificar mal al
     alumno que argumente la otra. Es la decisión de héroe y prócer. */
  if (!fichaPlana.includes(limpia(D.SAB_ESCUELAS_OJO)))
    mal('u4: el papel no dice que no hay que elegir una escuela: la ciencia usa las dos');
  else ok('u4: el papel deja la discusión de las dos escuelas abierta, sin ganadora');

  /* La pauta de «¿Lo sé, lo creo o es mi opinión?», RECALCULADA de los datos.
     Es la avería del Escudo marcado en rojo: el ejercicio y la clave salen del
     mismo sitio, y aquí se comprueba que el papel no se haya separado de él. */
  const letra = { se: 'S', creo: 'C', opino: 'O' };
  const clase = {};
  D.SAB_AFIRMACIONES.forEach(x => { clase[limpia(x.a)] = letra[x.q]; });
  const bloque = ficha.match(/<div class="pauta">[\s\S]*?\n    <\/div>/);
  const pauta = bloque && bloque[0].match(/¿Lo sé, lo creo o es mi opinión\?[\s\S]*?<\/div>/);
  const tabla = ficha.match(/<tr><th style="width:10%">S, C u O<\/th>[\s\S]*?<\/table>/);
  if (!pauta || !tabla) mal('u4: no se encontró la actividad de «¿Lo sé, lo creo o es mi opinión?» o su pauta');
  else {
    const claves = [...pauta[0].matchAll(/(\d+)\.\s*([SCO])\b/g)].map(m => m[2]);
    const celdas = [...tabla[0].matchAll(/<tr><td><\/td><td>([^<]*)<\/td><\/tr>/g)].map(m => limpia(m[1]));
    if (celdas.length !== claves.length) mal(`u4: la tabla trae ${celdas.length} afirmaciones y la pauta ${claves.length} claves`);
    else {
      let m2 = 0;
      celdas.forEach((c, i) => {
        if (!clase[c]) { mal(`u4: la tabla usa una afirmación que no está en el archivo de datos: «${c}»`); m2++; return; }
        if (claves[i] !== clase[c]) { mal(`u4: la afirmación ${i + 1} («${c}») es ${clase[c]} en los datos y la pauta dice ${claves[i]}`); m2++; }
      });
      if (!m2) ok(`u4: las ${celdas.length} afirmaciones de la actividad llevan en la pauta la manera que dicen los datos`);
    }
  }

  /* ⚠️ Las 30 afirmaciones van DIEZ POR MANERA. Con un montón más grande que
     otro, el alumno que reparta al azar saca más de lo que sabe, y esa nota
     entra en su expediente igual que la del que la resolvió. */
  const cuenta = {};
  D.SAB_AFIRMACIONES.forEach(x => { cuenta[x.q] = (cuenta[x.q] || 0) + 1; });
  const desiguales = Object.values(cuenta);
  if (new Set(desiguales).size !== 1)
    mal(`u4: las afirmaciones NO están repartidas por igual entre las maneras: ${JSON.stringify(cuenta)}`);
  else ok(`u4: las ${D.SAB_AFIRMACIONES.length} afirmaciones van ${desiguales[0]} por manera, así que no se acierta por reparto`);

  const faltanA = D.SAB_ARBOL.filter(a => !fichaPlana.includes(limpia(a.le)) || !fichaPlana.includes(limpia(a.hoy)));
  if (faltanA.length) mal(`u4: la ficha se dejó lo que esta pregunta le da a: ${faltanA.map(a => a.materia).join(' · ')}`);
  else ok(`u4: las ${D.SAB_ARBOL.length} materias están en el papel con lo que esta pregunta les deja`);

  /* ⚠️ La epistemología se define IGUAL que en la unidad 1. El alumno abre las
     dos y no puede leer dos definiciones distintas de lo mismo. No se comparan
     letra por letra —son dos redacciones—: se busca la tirada de palabras más
     larga que comparten, como hace la sonda del Himno con una cita. */
  const c1 = {}; vm.createContext(c1);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/data/filosofia-asombro.js'), 'utf8') + ';this.__R=FILO_RAMAS;', c1);
  const raiz = c1.__R.find(r => r.clave === 'epistemologia');
  const a = limpia(raiz.pregunta + ' ' + raiz.hace).split(/\s+/);
  const b = limpia(D.SAB_EPISTEMOLOGIA.pregunta + ' ' + D.SAB_EPISTEMOLOGIA.hace).split(/\s+/);
  let mejor = 0;
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) {
    let k = 0; while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++;
    if (k > mejor) mejor = k;
  }
  if (mejor < 6) mal(`u4: la epistemología se define distinto que en la unidad 1 (solo comparten ${mejor} palabras seguidas): el alumno abre las dos y leería dos cosas`);
  else ok(`u4: la epistemología dice lo mismo que en la unidad 1 (${mejor} palabras seguidas iguales)`);

  /* Que el Clasifica y el Reto salgan del MISMO sitio: es lo que hace
     imposible la avería del Escudo marcado en rojo. */
  if (!/sabDeEstado\(/.test(misionJs))
    mal('u4: el JS de la misión no saca las afirmaciones de sabDeEstado(): el Clasifica y el Reto podrían contradecirse');
  else ok('u4: el Clasifica y el Reto salen los dos del archivo de datos');
}

function revisaLenguaje(D, ficha, fichaPlana, misionJs) {
  let malos = faltanEnPapel(fichaPlana, D.LEN_ACTOS,
    [['nombre', a => a.nombre], ['qué hace', a => a.corto], ['señal', a => a.senal],
     ['prueba', a => a.prueba]], 'clase');
  if (!malos) ok(`u5: las ${D.LEN_ACTOS.length} cosas que hace una frase están en el papel con su señal y su prueba`);

  /* ⚠️ Cada clase lleva SU EMOJI además del color. La hoja se fotocopia en
     blanco y negro y uno de cada doce niños no distingue el rojo del verde:
     sin el emoji, clasificar frases es justo la actividad que él no puede
     hacer. Es la misma comprobación que el semáforo de la unidad 2, las clases
     de cambio de la 3 y las maneras de la 4. */
  const sinEmoji = D.LEN_ACTOS.filter(a => !ficha.includes(a.emoji));
  if (sinEmoji.length) mal(`u5: el papel dice ${sinEmoji.length} clase(s) SIN su emoji: ${sinEmoji.map(a => a.nombre).join(' · ')}. Fotocopiado en blanco y negro, eso es una actividad que no se puede hacer`);
  else ok('u5: las cuatro clases llevan su emoji además del color');

  /* ⚠️ EL CORAZÓN DE LA UNIDAD: la FORMA de la frase no dice lo que la frase
     HACE. Sin eso escrito, la unidad enseña a clasificar por los signos de
     puntuación —que es lo que el alumno ya hace mal— y «¿me pasás la sal?»
     queda como pregunta. */
  if (!fichaPlana.includes(limpia(D.LEN_ACTOS_OJO)))
    mal('u5: el papel no avisa de que la forma de la frase NO dice lo que la frase hace');
  else ok('u5: el papel dice que la forma engaña, que es lo que la unidad viene a enseñar');

  /* Y las ocho disfrazadas con su DÓNDE: lo que decide no es la frase, es el
     sitio donde se dice. Sin el `donde` el ejercicio no tiene respuesta. */
  malos = faltanEnPapel(fichaPlana, D.LEN_DISFRAZ,
    [['frase', d => d.f], ['dónde se dice', d => d.donde], ['cómo se nota', d => d.como]], 'disfrazada');
  if (!malos) ok(`u5: las ${D.LEN_DISFRAZ.length} frases disfrazadas están en el papel con dónde se dicen y cómo se notan`);

  const sinForma = D.LEN_DISFRAZ.filter(d => d.forma === d.hace);
  if (sinForma.length) mal(`u5: ${sinForma.length} frase(s) de LEN_DISFRAZ hacen lo que parecen, así que no están disfrazadas: ${sinForma.map(d => d.f).join(' · ')}`);
  else ok('u5: en las ocho disfrazadas, lo que parece y lo que hace son distintos');

  if (!fichaPlana.includes(limpia(D.LEN_DISFRAZ_OJO)))
    mal('u5: el papel no dice que lo que decide es DÓNDE se dice la frase');
  else ok('u5: el papel dice que lo decide el sitio, no la frase');

  /* Las cuatro ambiguas: las DOS lecturas y la pregunta que las arregla. Con
     una sola lectura el ejercicio no se puede hacer. */
  malos = faltanEnPapel(fichaPlana, D.LEN_AMBIG,
    [['frase', a => a.frase], ['una lectura', a => a.una], ['la otra lectura', a => a.otra],
     ['cómo se arregla', a => a.arregla]], 'ambigua');
  if (!malos) ok(`u5: las ${D.LEN_AMBIG.length} frases de doble sentido están en el papel con sus DOS lecturas y su arreglo`);

  if (!fichaPlana.includes(limpia(D.LEN_AMBIG_OJO)))
    mal('u5: el papel no dice que la frase ambigua NO está mal escrita');
  else ok('u5: el papel dice que la ambigua está bien escrita, así que no se arregla escribiéndola mejor');

  /* Definir. ⚠️ Las dos fallas son CONTRARIAS y las dos tienen que estar: con
     una sola, el alumno aprende a estirar toda definición o a apretarla, y la
     mitad de las veces se equivoca en el sentido que no vio. */
  malos = faltanEnPapel(fichaPlana, D.LEN_DEFINIR,
    [['nombre', d => d.nombre], ['qué le pasa', d => d.que], ['el ejemplo', d => d.ej],
     ['la prueba', d => d.prueba]], 'definición');
  if (!malos) ok(`u5: las ${D.LEN_DEFINIR.length} clases de definición están en el papel con su ejemplo y su prueba`);

  const contrarias = ['ancha', 'angosta'].filter(k => D.LEN_DEFINIR.some(d => d.clave === k));
  if (contrarias.length !== 2)
    mal('u5: falta una de las dos fallas CONTRARIAS de una definición (muy ancha y muy angosta): con una sola se aprende a fallar en el otro sentido');
  else ok('u5: están las dos fallas contrarias de una definición, no solo una');

  if (!fichaPlana.includes(limpia(D.LEN_DEFINIR_OJO)))
    mal('u5: el papel no dice que definir no es adornar, sino decir qué entra y qué no');
  else ok('u5: el papel dice para qué sirve una definición que aguanta las dos pruebas');

  /* Lo que la palabra arrastra. ⚠️ Cada par tiene que decir lo que las dos
     nombran IGUAL: sin eso, elegir la palabra parece mentir, y no lo es. */
  malos = faltanEnPapel(fichaPlana, D.LEN_CARGA,
    [['la cosa', c => c.cosa], ['dicho suave', c => c.suave], ['dicho fuerte', c => c.fuerte],
     ['lo que las dos nombran igual', c => c.igual]], 'par');
  if (!malos) ok(`u5: los ${D.LEN_CARGA.length} pares están en el papel con lo que las dos palabras nombran igual`);

  if (!fichaPlana.includes(limpia(D.LEN_CARGA_OJO)))
    mal('u5: el papel no dice que elegir la palabra NO es mentir, es apuntar');
  else ok('u5: el papel dice que elegir la palabra es apuntar, no mentir');

  /* Los trucos de la palabra. ⚠️ Y EXACTAMENTE UNO no es truco: una unidad
     donde toda palabra fuerte es trampa fabrica un alumno que no le cree a
     nadie, y eso cuesta lo mismo que creerlo todo. Es la regla del mensaje sin
     señales de los peligros de la IA y del semáforo verde de la unidad 2. */
  malos = faltanEnPapel(fichaPlana, D.LEN_TRUCOS,
    [['nombre', t => t.nombre], ['qué hace', t => t.hace], ['cómo suena', t => t.suena],
     ['qué cuesta', t => t.cuesta], ['cómo se desarma', t => t.desarma]], 'truco');
  if (!malos) ok(`u5: los ${D.LEN_TRUCOS.length} casos están en el papel con cómo suenan y cómo se desarman`);

  const noTruco = D.LEN_TRUCOS.filter(t => !t.truco);
  if (noTruco.length !== 1)
    mal(`u5: hay ${noTruco.length} casos marcados como NO truco y tiene que haber exactamente 1: sin ninguno la unidad deja un alumno que desconfía de toda palabra fuerte, y con varios deja de enseñar los trucos`);
  else ok(`u5: uno de los ${D.LEN_TRUCOS.length} casos NO es truco («${noTruco[0].nombre}»), así que la unidad no fabrica desconfianza de todo`);

  if (!fichaPlana.includes(limpia(D.LEN_TRUCOS_OJO)))
    mal('u5: el papel no avisa de que NO toda palabra fuerte es trampa');
  else ok('u5: el papel avisa de que desconfiar de todas las palabras cuesta lo mismo que creerlas todas');

  /* La pauta de «¿Qué hace esta frase?», RECALCULADA de los datos. Es la
     avería del Escudo marcado en rojo: el ejercicio y la clave salen del mismo
     sitio, y aquí se comprueba que el papel no se haya separado de él. */
  const letra = { afirma: 'A', pregunta: 'P', pide: 'M', exclama: 'E' };
  const clase = {};
  D.LEN_FRASES.forEach(x => { clase[limpia(x.f)] = letra[x.q]; });
  const bloque = ficha.match(/<div class="pauta">[\s\S]*?\n    <\/div>/);
  const pauta = bloque && bloque[0].match(/¿Qué hace esta frase\?[\s\S]*?<\/div>/);
  const tabla = ficha.match(/<tr><th style="width:12%">A, P, M o E<\/th>[\s\S]*?<\/table>/);
  if (!pauta || !tabla) mal('u5: no se encontró la actividad de «¿Qué hace esta frase?» o su pauta');
  else {
    const claves = [...pauta[0].matchAll(/(\d+)\.\s*([APME])\b/g)].map(m => m[2]);
    const celdas = [...tabla[0].matchAll(/<tr><td><\/td><td>([^<]*)<\/td><\/tr>/g)].map(m => limpia(m[1]));
    if (celdas.length !== claves.length) mal(`u5: la tabla trae ${celdas.length} frases y la pauta ${claves.length} claves`);
    else {
      let m2 = 0;
      celdas.forEach((c, i) => {
        if (!clase[c]) { mal(`u5: la tabla usa una frase que no está en el archivo de datos: «${c}»`); m2++; return; }
        if (claves[i] !== clase[c]) { mal(`u5: la frase ${i + 1} («${c}») es ${clase[c]} en los datos y la pauta dice ${claves[i]}`); m2++; }
      });
      if (!m2) ok(`u5: las ${celdas.length} frases de la actividad llevan en la pauta la clase que dicen los datos`);
    }
  }

  /* ⚠️ Las 32 frases van OCHO POR CLASE. Con un montón más grande que otro, el
     alumno que reparta al azar saca más de lo que sabe, y esa nota entra en su
     expediente igual que la del que la resolvió. */
  const cuenta = {};
  D.LEN_FRASES.forEach(x => { cuenta[x.q] = (cuenta[x.q] || 0) + 1; });
  const desiguales = Object.values(cuenta);
  if (new Set(desiguales).size !== 1)
    mal(`u5: las frases NO están repartidas por igual entre las clases: ${JSON.stringify(cuenta)}`);
  else ok(`u5: las ${D.LEN_FRASES.length} frases van ${desiguales[0]} por clase, así que no se acierta por reparto`);

  const faltanA = D.LEN_ARBOL.filter(a => !fichaPlana.includes(limpia(a.le)) || !fichaPlana.includes(limpia(a.hoy)));
  if (faltanA.length) mal(`u5: la ficha se dejó lo que esta pregunta le da a: ${faltanA.map(a => a.materia).join(' · ')}`);
  else ok(`u5: las ${D.LEN_ARBOL.length} materias están en el papel con lo que esta pregunta les deja`);

  /* ⚠️ La filosofía del lenguaje se define IGUAL que en la unidad 1. El alumno
     abre las dos y no puede leer dos definiciones distintas de lo mismo. No se
     comparan letra por letra —son dos redacciones—: se busca la tirada de
     palabras más larga que comparten, como hace la sonda del Himno con una
     cita. */
  const c1 = {}; vm.createContext(c1);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/data/filosofia-asombro.js'), 'utf8') + ';this.__R=FILO_RAMAS;', c1);
  const raiz = c1.__R.find(r => r.clave === 'lenguaje');
  const a = limpia(raiz.pregunta + ' ' + raiz.hace).split(/\s+/);
  const b = limpia(D.LEN_LENGUAJE.pregunta + ' ' + D.LEN_LENGUAJE.hace).split(/\s+/);
  let mejor = 0;
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) {
    let k = 0; while (i + k < a.length && j + k < b.length && a[i + k] === b[j + k]) k++;
    if (k > mejor) mejor = k;
  }
  if (mejor < 6) mal(`u5: la filosofía del lenguaje se define distinto que en la unidad 1 (solo comparten ${mejor} palabras seguidas): el alumno abre las dos y leería dos cosas`);
  else ok(`u5: la filosofía del lenguaje dice lo mismo que en la unidad 1 (${mejor} palabras seguidas iguales)`);

  /* Que el Clasifica y el Reto salgan del MISMO sitio: es lo que hace
     imposible la avería del Escudo marcado en rojo. */
  if (!/lenDeClase\(/.test(misionJs))
    mal('u5: el JS de la misión no saca las frases de lenDeClase(): el Clasifica y el Reto podrían contradecirse');
  else ok('u5: el Clasifica y el Reto salen los dos del archivo de datos');
}

/* ══════════════════ la pasada ══════════════════ */
console.log('\n🌳 La Ruta de la Raíz: la pantalla y el papel\n');
UNIDADES.forEach(u => {
  console.log(`── Unidad ${u.n}: ${u.nombre} ──`);
  const D = cargar(u);
  const ficha = fs.readFileSync(path.join(RAIZ, u.ficha), 'utf8');
  const fichaPlana = limpia(sinHtml(ficha));
  const mision = fs.readFileSync(path.join(RAIZ, u.dir, u.html), 'utf8');
  if (u.n === 1) revisaAsombro(D, ficha, fichaPlana);
  else if (u.n === 2) revisaLogica(D, ficha, fichaPlana);
  else if (u.n === 3) revisaMundo(D, ficha, fichaPlana, fs.readFileSync(path.join(RAIZ, u.dir, u.js), 'utf8'));
  else if (u.n === 4) revisaSaber(D, ficha, fichaPlana, fs.readFileSync(path.join(RAIZ, u.dir, u.js), 'utf8'));
  else revisaLenguaje(D, ficha, fichaPlana, fs.readFileSync(path.join(RAIZ, u.dir, u.js), 'utf8'));
  pensadoresYVocabulario(u, D, fichaPlana);
  nadaDelMaestro(u);
  contenedoresVacios(u, mision);
  niUnaFecha(u);
  investigaYCirculo(u, ficha, fichaPlana);
  console.log('');
});

/* ── que se lea en cuarto grado ──────────────────────────────────── */
console.log(`📖 Que se lea en cuarto grado · frase ≤ ${FRASE_MAX} · tramo ≤ ${TRAMO_MAX} · bloque ≤ ${MEDIA_BLOQUE} · misión ≤ ${MEDIA_MISION}\n`);
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
