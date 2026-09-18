/* ════════════════════════════════════════════════════════════════════
   ¿CÓMO SÉ QUE SÉ? · la cuarta unidad de la Ruta de la Raíz
   ────────────────────────────────────────────────────────────────────
   Mismo patrón que las unidades 1, 2 y 3, y por la misma razón: el mismo
   texto acaba en la pantalla y en la ficha que se fotocopia, y si se separan
   el alumno estudia una cosa y el examen le pide otra.
   `_dev/verifica-filosofia.js` compara las dos.

   ⚠️ Y aquí el estado de cada afirmación (`SAB_AFIRMACIONES`) sale de UN solo
   sitio, de donde se arman el Clasifica Y el Reto. Es la avería del Escudo
   marcado en rojo: con una sola fuente no se puede escribir.

   ⚠️ NADA de esto es para el maestro. Ni rutina de clase, ni ruta por ciclo,
   ni notas de cómo darla: la pantalla la abre el ALUMNO y la sonda lo
   comprueba. Está contado en CLAUDE.md.

   ⚠️ DE DÓNDE SALIÓ CADA COSA. Ninguna línea de aquí se buscó en internet.

   · LO QUE ESTA UNIDAD CUMPLE en Media es el **CE4.2** del currículo de
     Filosofía del CNB, BTP en Informática, undécimo grado, textual: «Explica
     los diferentes conceptos del renacimiento, **racionalismo, empirismo** e
     ilustración a través del método comparativo». Confirmado en el PDF,
     página 108 del archivo
     (`cnb-media-btp-sistematizacion-informatica-12-2025.pdf`), que se declara
     a sí mismo «Versión Preliminar 2025». De ahí salen las dos escuelas de
     `SAB_ESCUELAS`: la unidad las COMPARA, que es lo que el criterio pide.

   · Y el contenido procedimental **1.2 «Diferencias entre los tipos de
     saberes»** del mismo espacio curricular, página 109 del archivo. Eso es
     `SAB_ESTADOS`: creer, opinar y saber no son el mismo saber.

   · EN BÁSICA lo pide Ciencias Sociales, en las tres, textual: «Interpretan
     distintas fuentes de información para formular hipótesis y argumentar con
     fundamento». Confirmado en el PDF: `dcneb-basica-i-ciclo.pdf` página 218
     del archivo, `dcneb-basica-ii-ciclo.pdf` página 265 y
     `dcneb-basica-iii-ciclo.pdf` página 322. (Las de II y III dicen
     «argumentar los fundamentos»; la de I, «con fundamento». Se cita la de I,
     que es la que mejor se lee, y la diferencia queda anotada aquí.)

   · Y COMPROBAR sale de Ciencias Naturales, textual: «la ciencia es un espacio
     abierto de conocimiento, y el **método científico un instrumento sujeto a
     la crítica y la comprobación de resultados**». Confirmado en el PDF,
     `dcneb-basica-ii-ciclo.pdf` página 405 del archivo.

   ⚠️ LO QUE NO SE ESCRIBE, Y A PROPÓSITO: ni una fecha de los dos pensadores,
   como en las tres unidades anteriores. De cada uno se dice qué pensó y por
   qué se le recuerda. Un año sacado de un extracto de buscador no acredita
   nada.

   ⚠️ Y NO se dice que los sentidos mienten. Son la fuente principal y
   funcionan: por eso cada fuente de `SAB_FUENTES` dice PRIMERO para qué sirve
   y después cuándo falla. Una unidad donde todo engaña fabrica un alumno que
   no le cree a nada, y eso cuesta lo mismo que creerlo todo. Es la misma regla
   que el mensaje sin señales de los peligros de la IA.
   ════════════════════════════════════════════════════════════════════ */

/* ── Qué pregunta esta rama. ⚠️ Esta definición tiene que decir LO MISMO que
      la de la etapa 1 (`FILO_RAMAS`, la raíz «epistemologia»): el alumno abre
      las dos y no puede leer dos definiciones distintas de lo mismo. La sonda
      busca la tirada de palabras más larga que las dos comparten. ── */
const SAB_EPISTEMOLOGIA = {
  nombre: 'Epistemología',
  emoji: '🔬',
  pregunta: '¿Cómo sé que sé?',
  hace: 'Separa creer, opinar y saber.',
  ojo: 'No pregunta si algo es verdad. Pregunta con qué lo sostenés.'
};

/* ── Los tres estados de una afirmación. Cada uno con su PRUEBA, no con su
      definición: la pregunta que se le hace para saber cuál es. ── */
const SAB_ESTADOS = [
  { clave: 'creo', nombre: 'Lo creo', emoji: '🤔', corto: 'Todavía no lo comprobé',
    senal: 'Lo doy por cierto, pero no puedo decir cómo lo sé.',
    prueba: 'Preguntate: ¿puedo decir CÓMO lo sé?' },
  { clave: 'opino', nombre: 'Es mi opinión', emoji: '💬', corto: 'Otro puede pensar distinto',
    senal: 'Es un gusto o un juicio mío. Otro puede pensar lo contrario sin equivocarse.',
    prueba: 'Preguntate: ¿puede otro pensar lo contrario sin estar equivocado?' },
  { clave: 'se', nombre: 'Lo sé', emoji: '✅', corto: 'Es así y lo puedo comprobar',
    senal: 'Es así, y además puedo decir con qué se comprueba.',
    prueba: 'Preguntate: ¿es así Y puedo decir con qué se comprueba?' }
];

/* ⚠️ Y esto va dicho, porque es la mitad de la unidad: «no sé» no es una
   derrota. El que dice «no sé» puede ir a averiguarlo; el que dice «sé» sin
   comprobar se queda donde está. Es la misma decisión que la misión de
   actualidad de la IA, que dice en el papel que no pudo abrir ninguna fuente. */
const SAB_NOSE = 'Y hay una cuarta, que vale igual: «no sé». No es perder. El que dice «no sé» puede ir a averiguarlo. El que dice «sé» sin comprobarlo se queda con lo que le contaron.';

/* ── Las treinta afirmaciones, con su estado. UN SOLO SITIO: de aquí salen el
      Clasifica y el Reto, así que no se pueden contradecir. Diez por estado.
      ⚠️ Las de «lo sé» son todas comprobables por el propio alumno, con lo que
      tiene en la casa o en la escuela: si hiciera falta un laboratorio, no
      sería un saber suyo. ── */
const SAB_AFIRMACIONES = [
  /* ⚠️ Aquí NO va «el agua de la pila está fría»: el caso de pensamiento crítico
     de esta misma misión enseña que la piel no mide grados, así que el alumno que
     dijera otra cosa tendría razón y se le marcaría en rojo. Lo que va es algo
     que se comprueba MIRANDO. Es la avería del Escudo, con otra cara. */
  { a: 'La pila tiene agua hasta la mitad',                    q: 'se' },
  { a: 'En mi cuaderno caben treinta renglones',              q: 'se' },
  { a: 'Esta piedra pesa más que aquella',                    q: 'se' },
  { a: 'La puerta del aula mide más que yo',                  q: 'se' },
  { a: 'Hoy amaneció nublado',                                q: 'se' },
  { a: 'En mi grado somos cuarenta y tres',                   q: 'se' },
  { a: 'El limón está ácido',                                 q: 'se' },
  { a: 'La pared de la escuela es más larga que la cancha',   q: 'se' },
  { a: 'Este saco no lo levanto yo solo',                     q: 'se' },
  { a: 'De mi casa a la escuela hay ochocientos pasos',       q: 'se' },
  { a: 'Mañana va a llover',                                  q: 'creo' },
  { a: 'Esa semilla rinde más que la otra',                   q: 'creo' },
  { a: 'El examen se pasó para el jueves',                    q: 'creo' },
  { a: 'A ese río nunca se le seca el agua',                  q: 'creo' },
  { a: 'Oí que van a arreglar la carretera',                   q: 'creo' },
  { a: 'Ese camino es el más corto',                          q: 'creo' },
  { a: 'Al vecino le va bien con ese abono',                  q: 'creo' },
  { a: 'Dicen que el puente está cerrado',                    q: 'creo' },
  { a: 'Mi tío dice que ese árbol tiene cien años',           q: 'creo' },
  { a: 'Ese equipo va a ganar el campeonato',                 q: 'creo' },
  { a: 'Las baleadas son mejores que los tamales',            q: 'opino' },
  { a: 'Esta canción es fea',                                 q: 'opino' },
  { a: 'El azul es el color más bonito',                      q: 'opino' },
  { a: 'Es más divertido jugar que leer',                     q: 'opino' },
  { a: 'La camisa nueva le queda bien',                       q: 'opino' },
  { a: 'Ese apodo no me gusta',                               q: 'opino' },
  { a: 'La tarea de ayer estuvo aburrida',                    q: 'opino' },
  { a: 'El recreo debería ser más largo',                     q: 'opino' },
  { a: 'Ese es el mejor equipo de todos',                     q: 'opino' },
  { a: 'La comida de la casa sabe mejor',                     q: 'opino' }
];

/* ── De dónde sale lo que sabemos. ⚠️ Cada fuente dice PRIMERO para qué sirve
      y DESPUÉS cuándo falla: ninguna miente siempre, y decir lo contrario
      fabrica un alumno que no le cree a nada. ── */
const SAB_FUENTES = [
  { clave: 'sentidos', nombre: 'Los sentidos', emoji: '👀',
    sirve: 'Casi todo lo que sabés entró por aquí: mirando, tocando, oyendo, probando.',
    falla: 'A veces ven lo que no es. El lápiz dentro del vaso de agua se ve quebrado.',
    arregla: 'Se arregla con otro sentido o con una medida. Meté la mano y tocá el lápiz.' },
  { clave: 'memoria', nombre: 'La memoria', emoji: '🧠',
    sirve: 'Guarda lo que ya viste. Así no hay que comprobar todo otra vez cada día.',
    falla: 'Se acomoda sola. Dos personas que estuvieron en lo mismo lo cuentan distinto.',
    arregla: 'Se arregla escribiéndolo el mismo día, y preguntándole a otro que estuvo.' },
  { clave: 'otros', nombre: 'Lo que otro cuenta', emoji: '🗣️',
    sirve: 'Es la fuente más grande que hay. Nadie puede ver todo por su cuenta.',
    falla: 'Cuanto más lejos está de quien lo vio, más cambia por el camino.',
    arregla: 'Se arregla preguntando cómo lo sabe, y buscando a quien lo vio.' },
  { clave: 'razon', nombre: 'El razonamiento', emoji: '🧮',
    sirve: 'Saca cosas nuevas de las que ya sabés, sin salir a mirar.',
    falla: 'Si lo de arriba era falso, lo que sale también sale falso.',
    arregla: 'Se arregla mirando de dónde parte, que es la unidad 2 de esta ruta.' },
  { clave: 'medida', nombre: 'La medida', emoji: '📏',
    sirve: 'Deja que dos personas que no se ponen de acuerdo miren lo mismo.',
    falla: 'Si el instrumento está malo, todos miden mal y nadie lo nota.',
    arregla: 'Se arregla midiendo otra vez, con otra cinta y con otra persona.' }
];

/* ⚠️ Y el aviso que sostiene la sección: ninguna fuente sobra. */
const SAB_FUENTES_OJO = 'Ninguna de las cinco sobra. Y ninguna basta sola. Lo que se hace es cruzarlas. Lo que se ve, con lo que se mide. Lo que a uno le contaron, con quien lo vio.';

/* ── Los cuatro engaños que el alumno PUEDE reproducir. No se cuentan: se
      hacen, con lo que hay en la casa. Cada uno dice qué lo desarma. ── */
const SAB_ENGANOS = [
  { clave: 'lapiz', titulo: 'El lápiz quebrado', emoji: '✏️',
    hace: 'Meté medio lápiz en un vaso con agua y miralo de lado.',
    ves: 'Se ve quebrado justo donde empieza el agua.',
    pasa: 'El lápiz está entero. Lo que cambia es cómo viaja la luz al salir del agua.',
    desarma: 'Meté la mano y tocalo: el tacto no se equivoca ahí.' },
  { clave: 'manos', titulo: 'Las dos manos y el agua', emoji: '🤲',
    hace: 'Una mano en agua fría y otra en agua caliente, un rato. Después las dos al agua tibia.',
    ves: 'La misma agua tibia se siente caliente en una mano. Y fría en la otra.',
    pasa: 'La piel no mide grados: compara con lo que tenía antes.',
    desarma: 'Se desarma con un termómetro, que da el mismo número para las dos.' },
  { clave: 'moneda', titulo: 'La moneda que aparece', emoji: '🪙',
    hace: 'Poné una moneda en el fondo de una taza. Alejate hasta que el borde te la tape.',
    ves: 'Sin moverte, alguien echa agua despacio y la moneda aparece.',
    pasa: 'La moneda no se movió. La luz se dobla al salir del agua y te llega.',
    desarma: 'Se desarma mirando desde arriba: desde ahí siempre estuvo.' },
  { clave: 'mismo', titulo: 'El mismo color', emoji: '🎨',
    hace: 'Pintá dos cuadritos iguales: uno rodeado de blanco y otro de negro.',
    ves: 'El de fondo negro se ve más claro. Y los dos salieron del mismo lápiz.',
    pasa: 'El ojo compara con lo que tiene al lado, no mide.',
    desarma: 'Se desarma tapando los fondos con un papel: quedan iguales.' }
];

/* ⚠️ Y esto también va dicho: un engaño de los sentidos NO prueba que los
   sentidos no sirvan. Prueba que hay que saber cuándo cruzarlos. */
const SAB_ENGANOS_OJO = 'Ojo: que el ojo se equivoque aquí no quiere decir que no sirva. En los cuatro casos hay arreglo. Otro sentido o una medida lo resuelve en un minuto.';

/* ── Los cinco pasos de comprobar. El quinto es el que de verdad separa a
      quien piensa de quien defiende: decir qué te haría cambiar de idea. ── */
const SAB_PASOS = [
  { n: 1, paso: 'Decí exactamente qué se afirma.', porque: '«Ese abono es mejor» no se comprueba. «Ese abono da más mazorcas por planta» sí.' },
  { n: 2, paso: 'Preguntá cómo lo sabe quien lo dice.', porque: 'Si lo vio, si lo midió, o si se lo contaron. Las tres valen distinto.' },
  { n: 3, paso: 'Mirá si se puede ver, contar o medir.', porque: 'Lo que se cuenta o se mide lo puede revisar cualquiera. Ahí se acaba la discusión.' },
  { n: 4, paso: 'Buscá a quien diga lo contrario.', porque: 'Si solo buscás lo que te da la razón, siempre vas a encontrarlo.' },
  { n: 5, paso: 'Decí qué te haría cambiar de idea.', porque: 'Si no hay nada que te haga cambiar, no estabas sabiendo. Estabas defendiendo.' }
];

/* ── Las dos escuelas que el CE4.2 manda COMPARAR. De cada una: qué dice, qué
      acierta y dónde se queda corta. Y el final honesto: hoy se usan las dos. ── */
const SAB_ESCUELAS = [
  { clave: 'racionalismo', nombre: 'Racionalismo', emoji: '🧮',
    dice: 'Lo más seguro que sabemos lo saca la razón, pensando con orden.',
    acierta: 'Que 2 + 2 son 4 no hace falta salir a comprobarlo en el patio.',
    corto: 'Pensando solo no averiguás cuántos alumnos hay hoy en tu aula.' },
  { clave: 'empirismo', nombre: 'Empirismo', emoji: '👀',
    dice: 'Todo lo que sabemos entró alguna vez por los sentidos.',
    acierta: 'De qué color es el techo de tu escuela no se deduce. Hay que mirarlo.',
    corto: 'Mirando solo no sacás que dos rectas paralelas no se juntan nunca.' }
];

/* ⚠️ Y no se elige una. Enseñar que una ganó sería falso, y además dejaría al
   alumno sin la mitad de lo que usa todos los días. */
const SAB_ESCUELAS_OJO = 'No hay que elegir una. La ciencia que ves en tu cuaderno usa las dos. Mide con los sentidos. Y saca cuentas con la razón. La discusión sigue abierta, como la de la unidad anterior.';

/* ── La investigación. NO trae respuestas, y eso va dicho en la pantalla y en
      el papel: sin el aviso, se lee como un descuido y se salta. ── */
const SAB_INVESTIGA = {
  aviso: 'Aquí no hay respuestas escritas, y no es un descuido. Estas se averiguan donde vivís, porque es ahí donde están.',
  cuidado: 'Al preguntar, se pregunta con respeto. Y se anota quién lo contó y qué día.',
  preguntas: [
    'Preguntale a dos personas que estuvieron en lo mismo qué pasó. Puede ser una fiesta o un partido. Escribí las dos versiones. Marcá en qué NO coinciden.',
    '¿Cuántos alumnos hay hoy en tu escuela? Averiguá quién lleva ese dato y cómo lo cuenta.',
    'Buscá una cosa que «todo el mundo sabe» en tu comunidad. Preguntá a tres personas cómo lo saben. Anotá las tres respuestas.',
    'Medí con una cinta algo que creías conocer de memoria. Tu estatura, o la puerta de tu casa. Escribí lo que creías. Y escribí lo que salió.'
  ]
};

/* ── El vocabulario de la unidad. ── */
const SAB_VOCABULARIO = [
  { w: 'saber',      a: 'Que algo sea así y que además puedas decir con qué se comprueba.' },
  { w: 'creer',      a: 'Dar algo por cierto sin haberlo comprobado todavía.' },
  { w: 'opinión',    a: 'Un juicio tuyo, donde otro puede pensar lo contrario sin equivocarse.' },
  { w: 'fuente',     a: 'De dónde salió lo que decís. Quien lo vio, quien lo midió o quien lo contó.' },
  { w: 'hipótesis',  a: 'Una respuesta que se propone ANTES de comprobarla, para poder comprobarla.' },
  { w: 'comprobar',  a: 'Hacer algo que daría un resultado distinto si la afirmación fuera falsa.' }
];

/* ── Los dos pensadores, sin una sola fecha, a propósito. Cada uno es la cara
      de una de las dos escuelas que el currículo manda comparar. ── */
const SAB_PENSADORES = [
  { clave: 'descartes', nombre: 'René Descartes', emoji: '🧮', donde: 'Francia',
    quien: 'Decidió dudar de todo lo que pudiera dudarse. Quería ver qué quedaba en pie.',
    hizo: 'Encontró una cosa de la que no podía dudar. Mientras dudaba, estaba pensando.',
    porque: 'Enseñó a empezar por lo seguro. Desde ahí se construye, en vez de dar cosas por dadas.',
    dato: 'De él viene el racionalismo: primero la razón, y con orden.' },
  { clave: 'locke', nombre: 'John Locke', emoji: '👀', donde: 'Inglaterra',
    quien: 'Dijo que la mente empieza vacía. Todo lo que hay dentro entró por los sentidos.',
    hizo: 'Puso la experiencia en el centro. Sin mirar, oír y tocar no habría nada que pensar.',
    porque: 'Enseña que una idea que nunca tocó el mundo no se puede comprobar.',
    dato: 'De él viene el empirismo, la otra escuela que esta unidad compara.' }
];

/* ── Qué le da esta pregunta a tres materias de la escuela. Es el árbol de la
      unidad 1 visto desde aquí. ── */
const SAB_ARBOL = [
  { clave: 'cnat', materia: 'Ciencias Naturales', emoji: '🌱',
    le: 'Le dio el método: una hipótesis solo vale si hay forma de comprobarla.',
    hoy: 'En tu cuaderno: escribí qué esperabas ANTES del experimento, no después.' },
  { clave: 'csoc', materia: 'Ciencias Sociales', emoji: '🌎',
    le: 'Le dio la pregunta por la fuente. Quién lo contó, cuándo y desde dónde.',
    hoy: 'Buscá dos versiones de un mismo hecho y mirá en qué se separan.' },
  { clave: 'esp',  materia: 'Español', emoji: '✍️',
    le: 'Le dio una costumbre. Decir de dónde salió cada dato que se escribe.',
    hoy: 'Anotá de dónde sacaste cada dato. Hacelo en tu próximo trabajo.' }
];

/* Helpers: nadie reparte a mano las afirmaciones por estado. Si mañana entra
   una nueva, el Clasifica y el Reto la reparten solos. */
function sabDeEstado(q)  { return SAB_AFIRMACIONES.filter(x => x.q === q).map(x => x.a); }
function sabEstado(q)    { return SAB_ESTADOS.find(x => x.clave === q) || null; }
function sabFuente(c)    { return SAB_FUENTES.find(x => x.clave === c) || null; }
function sabEngano(c)    { return SAB_ENGANOS.find(x => x.clave === c) || null; }
/* Las que SE PUEDEN comprobar: lo que sé y lo que creo, juntas. Es la frontera
   que de verdad importa en I Ciclo, antes de partir en tres: una opinión no se
   comprueba, y pedirle pruebas a un gusto es lo que no hay que hacer. */
function sabSeComprueba() { return SAB_AFIRMACIONES.filter(x => x.q !== 'opino').map(x => x.a); }
