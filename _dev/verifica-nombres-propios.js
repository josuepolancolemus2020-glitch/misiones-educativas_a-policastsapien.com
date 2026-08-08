/* ============================================================
   M.E.T.A.S · Comprobador de nombres propios en minúscula
   ------------------------------------------------------------
   Nace de un error real: las tarjetas de repaso de la primera
   misión del maestro salieron escritas en minúscula («el
   presidente marco aurelio soto y su ministro ramón rosa», «la
   unah», «la ley fundamental de educación») y así se le mostraron
   a un maestro. En material que circula entre colegas y que sirve
   para preparar un concurso, esa minúscula le quita autoridad a
   todo lo demás, por bien verificado que esté el dato.

   Pasó porque el texto se escribió «como se pronuncia», en frase
   corrida, y nadie vuelve a leer catorce tarjetas buscando
   mayúsculas. Esto sí las lee.

   Qué revisa: misiones/ y fichas/, que es el material que se
   estudia y se imprime. No inventa reglas de gramática: solo
   conoce los nombres que este proyecto usa una y otra vez.

   Uso:  node _dev/verifica-nombres-propios.js
         node _dev/verifica-nombres-propios.js misiones/docente-...

   Si añade una misión con nombres propios nuevos (una institución,
   una ley, un municipio), agréguelos a NOMBRES: la lista es el
   comprobador.
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');

/* Cada entrada: [como aparece mal, como se escribe]. */
const NOMBRES = [
  ['ley fundamental de educación', 'Ley Fundamental de Educación'],
  ['ley orgánica de educación', 'Ley Orgánica de Educación'],
  ['ley de educación superior', 'Ley de Educación Superior'],
  ['código de instrucción pública', 'Código de Instrucción Pública'],
  ['código de la niñez y la adolescencia', 'Código de la Niñez y la Adolescencia'],
  ['código de ética', 'Código de Ética'],
  ['estatuto del docente', 'Estatuto del Docente'],
  ['reglamento general', 'Reglamento General'],
  ['constitución de la república', 'Constitución de la República'],
  ['secretaría de educación', 'Secretaría de Educación'],
  ['sistema nacional de educación', 'Sistema Nacional de Educación'],
  ['proyecto educativo de centro', 'Proyecto Educativo de Centro'],
  ['consejo de desarrollo', 'Consejo de Desarrollo'],
  ['dirección departamental', 'Dirección Departamental'],
  ['dirección municipal', 'Dirección Municipal'],
  ['dirección distrital', 'Dirección Distrital'],
  ['escuela superior del profesorado', 'Escuela Superior del Profesorado'],
  ['reforma liberal', 'Reforma Liberal'],
  ['la gaceta', 'La Gaceta'],
  ['marco aurelio soto', 'Marco Aurelio Soto'],
  ['ramón rosa', 'Ramón Rosa'],
  ['francisco morazán', 'Francisco Morazán'],
  ['ramón villeda morales', 'Ramón Villeda Morales'],
  ['honduras', 'Honduras'],
  ['tegucigalpa', 'Tegucigalpa'],
  ['unah', 'UNAH'],
  ['unesco', 'UNESCO'],
  ['upnfm', 'UPNFM'],
  ['sace', 'SACE'],
  /* Los trajo la misión de bienvenida del maestro, que presenta la plataforma:
     ahí se nombran a cada rato el pensador de la portada, el currículo y las
     pantallas del producto. Los nombres de las herramientas son nombres
     propios de verdad: el maestro los busca escritos igual en la misión, en la
     ficha y en el mosaico de su Zona Docente, y una minúscula ahí lo deja
     dudando de si es la misma cosa. */
  ['josé cecilio del valle', 'José Cecilio del Valle'],
  ['dcnb', 'DCNB'],
  ['whatsapp', 'WhatsApp'],
  ['zona docente', 'Zona Docente'],
  ['plan de acción', 'Plan de Acción'],
  ['parte mensual', 'Parte Mensual'],
  ['gobierno escolar', 'Gobierno Escolar'],
  ['campeonísimo', 'Campeonísimo'],
  ['evidencia de misiones', 'Evidencia de misiones'],
  /* Los trajeron las lecturas de la misión de los adjetivos: los textos son
     del contexto hondureño y nombran lugares una y otra vez. En una lectura
     que el niño lee EN VOZ ALTA, el municipio en minúscula es peor que en
     otro sitio: se lee igual y se copia mal después.

     ⚠️ «la esperanza» va aquí porque es la ciudad de Intibucá, que sale en
     varias misiones. Es la única de la lista que choca con una frase común
     («la esperanza de…»): si algún día salta por eso, no es un fallo del
     texto — se mira y se deja pasar, o se saca de aquí. */
  ['copán', 'Copán'],
  ['roatán', 'Roatán'],
  ['ojojona', 'Ojojona'],
  ['santa bárbara', 'Santa Bárbara'],
  ['intibucá', 'Intibucá'],
  ['trujillo', 'Trujillo'],
  ['la esperanza', 'La Esperanza'],
];

/* «Decreto 79» y «Acuerdo 1358-SE-2014» nombran una norma concreta y van con
   mayúscula. «artículo 27» NO: así lo escribe la propia Gaceta. */
const CON_NUMERO = [
  [/(^|[^\wáéíóúñü/-])(decreto)\s+\d/gi, 'Decreto'],
  [/(^|[^\wáéíóúñü/-])(acuerdo)\s+\d/gi, 'Acuerdo'],
];

/* Archivos que escriben nombres propios en minúscula A PROPÓSITO: son los que
   ENSEÑAN la regla de la mayúscula, y sus ejercicios consisten justamente en
   dar la frase mal escrita para que el alumno la corrija. Tocarlos rompería
   la actividad. */
const EXCEPCIONES = [
  'misiones/2y3ciclo-sustantivos/js/sustantivos.js',
  'fichas/ficha-sustantivos.html',
];

const CARPETAS = ['misiones', 'fichas'];
const EXT = ['.js', '.html'];

function archivos(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'www' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) archivos(p, acc);
    else if (EXT.includes(path.extname(e.name))) acc.push(p);
  }
  return acc;
}

const objetivo = process.argv[2];
let lista;
if (objetivo) {
  const abs = path.isAbsolute(objetivo) ? objetivo : path.join(RAIZ, objetivo);
  lista = fs.statSync(abs).isDirectory() ? archivos(abs) : [abs];
} else {
  lista = CARPETAS.flatMap(c => archivos(path.join(RAIZ, c)));
}
lista = lista.filter(f => !EXCEPCIONES.includes(path.relative(RAIZ, f).split(path.sep).join('/')));

/* Antes de buscar, se tapan las partes de la línea donde una minúscula NO es
   un error de redacción sino un nombre de archivo, una ruta, una clase de CSS
   o una llave de objeto: «ficha-geografia-de-honduras.html», «js/la-materia.js»,
   «honduras: { … }». Se sustituyen por espacios para no mover las columnas. */
function tapaCodigo(linea) {
  return linea
    .replace(/https?:\/\/\S+/g, m => ' '.repeat(m.length))
    .replace(/(href|src|content|id|class|action|data-[\w-]+)\s*=\s*"[^"]*"/gi, m => ' '.repeat(m.length))
    /* Una comilla simple con una sola palabra dentro es código (un argumento,
       una llave): la prosa de este proyecto usa comillas angulares. */
    .replace(/\\?'[\w-]+\\?'/g, m => ' '.repeat(m.length))
    /* Los dominios también son código a estos efectos: «sace.se.gob.hn» se
       escribe en minúscula porque así se teclea, y no es la sigla mal escrita.
       Lo destapó la misión de M.E.T.A.S y SACE, que le dice al maestro dónde
       entrar. El \b del final evita tapar prosa: «.com» sí, «.como» no. */
    .replace(/[\w./-]*[/.][\w./-]*/g, m => (/[/]|\.(html|js|css|png|jpg|webp|svg|json|hn|com|org|net|edu)\b/.test(m) ? ' '.repeat(m.length) : m))
    .replace(/[\wáéíóúñü]+\s*:\s*[{[]/g, m => ' '.repeat(m.length))
    /* Y una llave de objeto seguida de TEXTO entre comillas: «sace: '…'». Lo
       destapó la misión de M.E.T.A.S y SACE, donde cada parada guarda su lado
       oficial en una clave; sin esto, el comprobador leía la clave como la
       sigla escrita en minúscula y daba nueve falsos positivos. Solo se tapa
       la llave, no el texto: lo que va dentro de las comillas se sigue
       revisando, que es lo que lee el maestro. */
    .replace(/(^|[\s{,])[\wáéíóúñü]+\s*:\s*(?=['"`])/g, m => ' '.repeat(m.length));
}

let fallos = 0;
for (const f of lista) {
  const texto = fs.readFileSync(f, 'utf8');
  const lineas = texto.split('\n');
  let enComentario = false;

  lineas.forEach((cruda, i) => {
    /* Los comentarios del código se saltan: ahí se explica el error y hay que
       poder nombrarlo escrito mal, que es de lo que se está hablando. */
    const abre = cruda.lastIndexOf('/*'), cierra = cruda.lastIndexOf('*/');
    const eraComentario = enComentario;
    if (!enComentario && abre > cierra) enComentario = true;
    else if (enComentario && cierra > abre) enComentario = false;
    if (eraComentario || enComentario || /^\s*(\/\/|\*)/.test(cruda)) return;

    const linea = tapaCodigo(cruda);

    for (const [mal, bien] of NOMBRES) {
      const esc = mal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp('(^|[^\\wáéíóúñü/-])(' + esc + ')(?![\\wáéíóúñü/-])', 'g');
      let m;
      while ((m = re.exec(linea)) !== null) {
        console.log(`✖ ${path.relative(RAIZ, f)}:${i + 1}  «${m[2]}» debería ser «${bien}»`);
        fallos++;
      }
    }
    for (const [re, bien] of CON_NUMERO) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(linea)) !== null) {
        if (m[2] === m[2].toLowerCase()) {
          console.log(`✖ ${path.relative(RAIZ, f)}:${i + 1}  «${m[2]}» debería ser «${bien}»`);
          fallos++;
        }
      }
    }
  });
}

console.log(`\nRevisados ${lista.length} archivos de misiones/ y fichas/.`);
if (fallos) {
  console.log(`✖ ${fallos} nombre(s) propio(s) en minúscula. Esto lo lee un colega: se corrige antes de publicar.`);
  process.exit(1);
}
console.log('✅ ningún nombre propio en minúscula');
