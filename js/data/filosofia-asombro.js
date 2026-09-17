/* ════════════════════════════════════════════════════════════════════
   EL ASOMBRO · la primera unidad de la Ruta de la Raíz (Filosofía)
   ────────────────────────────────────────────────────────────────────
   Esto NO es contenido de una misión: es el temario de la unidad, y por eso
   vive aquí y no dentro de la misión que lo usa. La razón es la del Himno, la
   de los próceres, la de los poderes y la de la Constitución: el mismo texto
   acaba en dos sitios que una persona lee —la pantalla y la ficha que se
   fotocopia— y si se separan, el alumno estudia una cosa y el examen le pide
   otra. `_dev/verifica-filosofia.js` compara las dos.

   ⚠️ Y aquí hay una razón de más. La clasificación de cada pregunta de ejemplo
   (`FILO_PREGUNTAS`) sale de UN solo sitio y de ahí se arman el Clasifica Y el
   Reto. No es comodidad: este repositorio ya se encontró una misión donde el
   banco del Clasifica y el del Reto se contradecían —el Escudo marcado en rojo
   en Aspectos Cívicos— porque los dos se escriben a mano, uno debajo del otro,
   y al escribir el segundo se copia el primero y se retoca. Con una sola
   fuente, esa avería no se puede escribir.

   ⚠️ DE DÓNDE SALIÓ CADA COSA. Ninguna línea de aquí se buscó en internet.

   · FILOSOFÍA NO ES UNA MATERIA INVENTADA PARA ESTA PLATAFORMA. El DCNB de
     Educación Básica la nombra por su nombre dentro del Área de Ciencias
     Sociales, en su capítulo 11, y con estas palabras: «La Filosofía y dentro
     de ella, la Formación Ética y Ciudadana son fundamentales para preparar al
     hondureño de tal modo que se pueda desenvolver con éxito en un mundo
     globalizado…». Y entre las partes del área enumera «La Persona:
     (Filosofía). Se le concibe a la misma como el único ser capaz de pensar,
     comunicarse y elegir». Confirmado en los PDF, no en un buscador:
     `_dev/dcnb-pdf/dcneb-basica-iii-ciclo.pdf`, página 318 del archivo, y
     `_dev/dcnb-pdf/dcneb-basica-ii-ciclo.pdf`, página 261.

   · Y ES UN ESPACIO CURRICULAR PROPIO un nivel más arriba: en Educación Media,
     BTP en Informática, UNDÉCIMO GRADO, «Nombre del Espacio Curricular
     FILOSOFÍA · Duración 120 HORAS ANUALES · 3 HORAS SEMANALES», con la
     competencia «Explicar el origen del saber filosófico y su evolución
     histórica a través del método comparativo».
     `_dev/dcnb-pdf/cnb-media-btp-sistematizacion-informatica-12-2025.pdf`,
     página 107 del archivo. ⚠️ Ese documento se declara a sí mismo
     «Versión Preliminar 2025» en su encabezado, y así hay que citarlo.

   · LO QUE ESTA UNIDAD CUMPLE, de ese mismo documento y textual:
     CE1.1 «Identifica el alcance que tiene la filosofía como saber en sentido
     etimológico y conceptual» —de ahí sale que aquí se enseñe qué QUIERE DECIR
     la palabra, no solo qué es la cosa— y CE1.4 «Describe la influencia de la
     filosofía en el desarrollo de las sociedades a través del tiempo en el
     surgimiento de las ciencias», que es el árbol entero de esta misión: cada
     asignatura de la escuela nació de una pregunta filosófica.

   · EL TEMARIO Y LA RUTA POR CICLO son del currículo holístico de Filosofía
     para Básica que escribió el autor (diez unidades, una por mes, las mismas
     para I, II y III Ciclo, cambiando la profundidad y no el contenido). Esta
     es la unidad 1. El porqué está en CURRICULA-FILOSOFIA.md.

   ⚠️ LO QUE NO SE ESCRIBE, Y A PROPÓSITO: NI UNA FECHA. Ni un año de
   nacimiento, ni un siglo, ni «hace 2 500 años». De los tres pensadores se dice
   qué hicieron y por qué se les recuerda, que es lo que la unidad necesita y lo
   que nadie discute; una fecha sacada de un extracto de buscador no acredita
   nada. Es la misma decisión que dejó fuera los números de decreto de la flor y
   del árbol nacionales y la fecha de nacimiento de José Trinidad Reyes. El día
   que entre una fuente que lo acredite, se ponen: la línea de tiempo la pide el
   propio currículo para III Ciclo, y hasta entonces es una ACTIVIDAD de
   investigar, no una afirmación.
   ════════════════════════════════════════════════════════════════════ */

/* ── Qué quiere decir la palabra. Es el CE1.1, en sentido etimológico. ── */
const FILO_PALABRA = {
  palabra: 'filosofía',
  partes: [
    { trozo: 'filo', quiere: 'amor, cariño, ganas de' },
    { trozo: 'sofía', quiere: 'sabiduría, saber' }
  ],
  junto: 'Ganas de saber.',
  ojo: 'Fíjate en lo que NO dice: no dice «el que sabe». Dice el que QUIERE saber. Por eso un filósofo no es alguien que ya tiene las respuestas.'
};

/* ── Las tres clases de pregunta. Es la destreza de la unidad, y de aquí
      salen el Clasifica, el Reto, las tareas y la ficha. ── */
const FILO_CLASES = [
  { clave: 'hechos', nombre: 'De hechos', emoji: '🔎', corto: 'Buscando',
    como: 'Se responde BUSCANDO',
    senal: 'Tiene una sola respuesta y se puede comprobar.',
    donde: 'En un libro, en un mapa, midiendo, o preguntando a quien lo sabe.',
    ejemplo: '¿Cuántos departamentos tiene Honduras?',
    trampa: 'Si la buscas mucho y no aparece en ninguna parte, a lo mejor no era de hechos.' },
  { clave: 'significado', nombre: 'De significado', emoji: '❓', corto: 'Qué es',
    como: 'Se responde PENSANDO qué es algo',
    senal: 'Pide una definición. Se contesta con ejemplos y con casos que no valen.',
    donde: 'Pensando con otros y poniendo ejemplos.',
    ejemplo: '¿Qué es un amigo?',
    trampa: 'El diccionario ayuda, pero no cierra la pregunta: por eso se discute.' },
  { clave: 'valor', nombre: 'De valor', emoji: '⚖️', corto: 'Está bien',
    como: 'Se responde PENSANDO y dando razones',
    senal: 'Pregunta si algo está bien, si es justo o si vale la pena.',
    donde: 'Discutiendo, dando razones y escuchando las del otro.',
    ejemplo: '¿Está bien copiar en un examen?',
    trampa: 'Tiene varias respuestas buenas. Lo que se califica es la razón, no el sí o el no.' }
];

/* ── Las preguntas de ejemplo, con su clase. UN SOLO SITIO. ── */
const FILO_PREGUNTAS = [
  { p: '¿Cuántos departamentos tiene Honduras?',          clase: 'hechos' },
  { p: '¿Cuántos días tiene febrero?',                     clase: 'hechos' },
  { p: '¿A qué hora sale el bus?',                         clase: 'hechos' },
  { p: '¿Cuánto cuesta un cuaderno?',                      clase: 'hechos' },
  { p: '¿Quién compuso la letra del Himno Nacional?',      clase: 'hechos' },
  { p: '¿En qué mes llueve más aquí?',                     clase: 'hechos' },
  { p: '¿Cuántos alumnos hay en mi escuela?',              clase: 'hechos' },
  { p: '¿Cómo se escribe «cayó»?',                         clase: 'hechos' },
  { p: '¿Cuál es el río más largo del país?',              clase: 'hechos' },
  { p: '¿Qué come el zorzal?',                             clase: 'hechos' },

  { p: '¿Qué es un amigo?',                                clase: 'significado' },
  { p: '¿Qué es ser valiente?',                            clase: 'significado' },
  { p: '¿Qué es un número?',                               clase: 'significado' },
  { p: '¿Qué es una palabra?',                             clase: 'significado' },
  { p: '¿Qué es el tiempo?',                               clase: 'significado' },
  { p: '¿Qué es una familia?',                             clase: 'significado' },
  { p: '¿Qué es aprender?',                                clase: 'significado' },
  { p: '¿Qué es una regla?',                               clase: 'significado' },
  { p: '¿Qué es trabajar?',                                clase: 'significado' },
  { p: '¿Qué es lo bello?',                                clase: 'significado' },

  { p: '¿Está bien copiar en un examen?',                  clase: 'valor' },
  { p: '¿Está bien mentir para no hacer sufrir a alguien?', clase: 'valor' },
  { p: '¿Es justo que gane siempre el más rápido?',         clase: 'valor' },
  { p: '¿Vale la pena estudiar algo que no me gusta?',      clase: 'valor' },
  { p: '¿Está bien callarse cuando molestan a otro?',       clase: 'valor' },
  { p: '¿Debo obedecer una regla que me parece injusta?',   clase: 'valor' },
  { p: '¿Es justo repartir el almuerzo en partes iguales?', clase: 'valor' },
  { p: '¿Vale más el que saca mejor nota?',                 clase: 'valor' },
  { p: '¿Está bien quedarse con lo que uno se encontró?',   clase: 'valor' },
  { p: '¿Debo prestar mi cuaderno a quien no estudió?',     clase: 'valor' }
];

/* ── Las raíces: las ramas de la filosofía, cada una con SU pregunta.
      Son las ocho que trabajan las diez unidades del currículo, así que de
      paso el alumno ve adónde va la ruta. ── */
const FILO_RAMAS = [
  { clave: 'logica',        nombre: 'Lógica',                   emoji: '🧩', pregunta: '¿Qué hace que una razón sea buena?',       hace: 'Revisa si lo que decimos se sostiene.' },
  { clave: 'metafisica',    nombre: 'Metafísica',               emoji: '🌌', pregunta: '¿Qué es real? ¿Qué cambia y qué se queda?', hace: 'Pregunta de qué está hecho el mundo.' },
  { clave: 'epistemologia', nombre: 'Epistemología',            emoji: '🔬', pregunta: '¿Cómo sé que sé?',                         hace: 'Separa creer, opinar y saber.' },
  { clave: 'lenguaje',      nombre: 'Filosofía del lenguaje',   emoji: '💬', pregunta: '¿Cómo cambian las palabras lo que pienso?', hace: 'Mira qué hacen las palabras con las ideas.' },
  { clave: 'persona',       nombre: 'Antropología filosófica',  emoji: '🧍', pregunta: '¿Qué me hace ser yo?',                     hace: 'Pregunta qué es un ser humano.' },
  { clave: 'etica',         nombre: 'Ética',                    emoji: '⚖️', pregunta: '¿Qué debo hacer?',                         hace: 'Busca cómo saber si una acción es buena.' },
  { clave: 'politica',      nombre: 'Filosofía política',       emoji: '🏛️', pregunta: '¿Quién debe hacer las reglas?',            hace: 'Pregunta para qué sirve vivir juntos.' },
  { clave: 'estetica',      nombre: 'Estética',                 emoji: '🎨', pregunta: '¿Qué es la belleza?',                      hace: 'Pregunta qué hace que algo sea arte.' }
];

/* ── Las ramas del árbol: las asignaturas de la escuela, cada una con la
      pregunta de la que nació. Es el CE1.4 puesto en una tarjeta. ── */
const FILO_ARBOL = [
  { clave: 'mat',  materia: 'Matemáticas',        emoji: '🔢', raiz: 'logica',
    nacio: '¿Qué es un número?',
    cuenta: 'Nadie ha visto un 7 caminando por ahí. Alguien tuvo que preguntar qué clase de cosa es un número.',
    hoy: '¿Por qué 2 + 2 da 4 siempre, aunque nadie esté mirando?' },
  { clave: 'esp',  materia: 'Español',            emoji: '✍️', raiz: 'lenguaje',
    nacio: '¿Qué es una palabra?',
    cuenta: 'La gramática empezó cuando alguien se preguntó por qué unos sonidos significan algo y otros no.',
    hoy: '¿Puede una palabra querer decir dos cosas a la vez?' },
  { clave: 'cnat', materia: 'Ciencias Naturales', emoji: '🌱', raiz: 'metafisica',
    nacio: '¿De qué está hecho el mundo?',
    cuenta: 'Antes se contestaba con un mito. El día que alguien buscó una causa natural, empezó la ciencia.',
    hoy: '¿Cómo compruebo que algo es verdad y no solo que me lo dijeron?' },
  { clave: 'csoc', materia: 'Ciencias Sociales',  emoji: '🌎', raiz: 'politica',
    nacio: '¿Quién debe mandar?',
    cuenta: 'La educación cívica nació de esa pregunta. No de una lista de fechas: de una pregunta incómoda.',
    hoy: '¿Por qué obedecemos una regla que no nos gusta?' },
  { clave: 'arte', materia: 'Arte y Música',      emoji: '🎨', raiz: 'estetica',
    nacio: '¿Qué es lo bello?',
    cuenta: 'Para enseñar a hacer algo bonito, primero hubo que preguntarse qué hace que algo lo sea.',
    hoy: '¿Vale más un dibujo hecho a mano que uno hecho por una máquina?' },
  { clave: 'efis', materia: 'Educación Física',   emoji: '🤸', raiz: 'persona',
    nacio: '¿El cuerpo soy yo o es algo que tengo?',
    cuenta: 'Cuidar el cuerpo tiene sentido si el cuerpo es parte de la persona. Eso hubo que pensarlo.',
    hoy: '¿Por qué duele perder, si es solo un juego?' }
];

/* ── Los tres pensadores. Sin una sola fecha, a propósito: ver la cabecera. ── */
const FILO_PENSADORES = [
  { clave: 'tales', nombre: 'Tales de Mileto', emoji: '🌊', donde: 'Mileto',
    quien: 'El primero que conocemos que explicó el mundo sin contar un mito.',
    hizo: 'En vez de decir «lo hizo un dios», buscó una causa natural.',
    porque: 'Ahí arranca el camino que termina en las Ciencias Naturales.',
    dato: 'Dijo que todo salía del agua. Se equivocó, y aun así lo cambió todo: lo que importó fue la CLASE de respuesta que buscó, no la respuesta.' },
  { clave: 'socrates', nombre: 'Sócrates', emoji: '💬', donde: 'Atenas',
    quien: 'Preguntaba en la plaza a cualquiera, y no daba las respuestas.',
    hizo: 'Preguntaba hasta que la persona veía sola que se contradecía.',
    porque: 'De ahí sale el diálogo, que es la herramienta de esta materia.',
    dato: 'Decía que lo único que sabía era que no sabía nada. No escribió libros: lo que sabemos de él lo escribieron otros.' },
  { clave: 'hipatia', nombre: 'Hipatia de Alejandría', emoji: '🔭', donde: 'Alejandría',
    quien: 'Filósofa y matemática, y maestra de quien quisiera aprender.',
    hizo: 'Juntaba las dos cosas: pensar y medir.',
    porque: 'Recuerda que la filosofía y las matemáticas nacieron juntas.',
    dato: 'Enseñaba en Alejandría, la ciudad de la gran biblioteca del mundo antiguo.' }
];

/* ── Cómo una pregunta se vuelve una ciencia. Es el CE1.4 en cinco pasos. ── */
const FILO_ORIGEN = [
  'Alguien se asombra con algo de todos los días.',
  'Lo convierte en una pregunta.',
  'La discute con otros y le piden razones.',
  'Busca una forma de comprobar la respuesta.',
  'Cuando la forma de comprobar funciona, nace una ciencia.'
];

/* ── El vocabulario de la unidad. ── */
const FILO_VOCABULARIO = [
  { w: 'asombro',   a: 'Lo que sientes cuando algo de todos los días de pronto te parece raro. Es por donde empieza todo.' },
  { w: 'pregunta',  a: 'Una frase que abre. La buena no se contesta con sí o no y deja al otro con ganas de pensar.' },
  { w: 'sabiduría', a: 'Saber usar lo que uno sabe. No es lo mismo que tener muchos datos.' },
  { w: 'diálogo',   a: 'Pensar entre varios. No es discutir para ganar: es discutir para entender.' },
  { w: 'duda',      a: 'No estar seguro todavía. Aquí no es un defecto: es la herramienta de trabajo.' },
  { w: 'filosofía', a: 'Ganas de saber. «Filo» es amor y «sofía» es sabiduría: el que quiere saber, no el que ya sabe.' }
];

/* Helpers: nadie cuenta a mano, y nadie reparte a mano las preguntas por
   clase. Si mañana entra una pregunta nueva, el Clasifica y el Reto la
   reparten solos y no se pueden contradecir. */
function filoDeClase(c)   { return FILO_PREGUNTAS.filter(x => x.clase === c).map(x => x.p); }
function filoClase(c)     { return FILO_CLASES.find(x => x.clave === c) || null; }
function filoRama(c)      { return FILO_RAMAS.find(x => x.clave === c) || null; }
function filoPensador(c)  { return FILO_PENSADORES.find(x => x.clave === c) || null; }
/* Se responde pensando: las de significado y las de valor juntas. La frontera
   que de verdad importa en la unidad 1 es esta, no la de tres. */
function filoPensando()   { return FILO_PREGUNTAS.filter(x => x.clase !== 'hechos').map(x => x.p); }
