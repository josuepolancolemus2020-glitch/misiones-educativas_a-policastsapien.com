/* ════════════════════════════════════════════════════════════════════
   ¿DE QUÉ ESTÁ HECHO EL MUNDO? · la tercera unidad de la Ruta de la Raíz
   ────────────────────────────────────────────────────────────────────
   Mismo patrón que las unidades 1 y 2, y por la misma razón: el mismo texto
   acaba en la pantalla y en la ficha que se fotocopia, y si se separan el
   alumno estudia una cosa y el examen le pide otra.
   `_dev/verifica-filosofia.js` compara las dos.

   ⚠️ Y aquí la clasificación de cada cambio (`MUN_CAMBIOS`) sale de UN solo
   sitio, de donde se arman el Clasifica Y el Reto. Es la avería del Escudo
   marcado en rojo: con una sola fuente no se puede escribir.

   ⚠️ NADA de esto es para el maestro. Ni rutina de clase, ni ruta por ciclo,
   ni notas de cómo darla: la pantalla la abre el ALUMNO y la sonda lo
   comprueba. Está contado en CLAUDE.md.

   ⚠️ DE DÓNDE SALIÓ CADA COSA. Ninguna línea de aquí se buscó en internet.

   · LO QUE ESTA UNIDAD CUMPLE son dos criterios del currículo de Filosofía
     del CNB de Educación Media, BTP en Informática, undécimo grado, textual:
     **CE1.2** «Diferencia las etapas del saber filosófico a través del método
     comparativo» y **CE1.3** «Expone la importancia de las escuelas del
     pensamiento filosófico promoviendo procesos de reflexión». La primera
     etapa del saber filosófico es justamente esta: la que preguntó de qué
     está hecho todo. Confirmado en el PDF, página 107 del archivo
     (`cnb-media-btp-sistematizacion-informatica-12-2025.pdf`), que se declara
     a sí mismo «Versión Preliminar 2025».

   · Y sigue cumpliendo el **CE1.4** de la unidad 1 —«Describe la influencia de
     la filosofía… en el surgimiento de las ciencias»—, que aquí se ve
     trabajando: la misma pregunta, lo que se contestó pensando y lo que hoy
     se mide.

   · LO QUE MIDE LA CIENCIA HOY sale del DCNB de Básica, Ciencias Naturales,
     bloque «Materia, energía y tecnología», textual: «en este bloque se
     abordará la **constitución de la materia en partículas fundamentales como
     el átomo y los electrones**». Confirmado en el PDF,
     `dcneb-basica-ii-ciclo.pdf` página 415 del archivo y
     `dcneb-basica-iii-ciclo.pdf` página 531.

   · LA COSMOVISIÓN la nombra el propio DCNB en el perfil de egreso:
     «Manifestar capacidad para la gestión de proyectos artísticos y
     culturales para el desarrollo de su cultura, **en el marco de su
     cosmovisión**». Y Ciencias Sociales pide «Muestran actitud de respeto e
     interés por los pueblos indígenas de Honduras y su situación actual».

   ⚠️ LO QUE NO SE ESCRIBE, Y A PROPÓSITO: qué dice la cosmovisión de NINGÚN
   pueblo de Honduras sobre el origen del mundo. Este repositorio no tiene con
   qué acreditarlo, y ponerle a un pueblo una creencia que no se puede
   sostener es peor que callarla. Se convierte en `MUN_INVESTIGA`, que manda
   al alumno a preguntarlo en SU municipio — que es donde están esas
   respuestas y lo que el DCNB pide de verdad. Es la misma decisión que la
   sección sin nombres de la misión de próceres.

   ⚠️ NI UNA FECHA, igual que en las unidades 1 y 2. De Demócrito, Heráclito y
   Parménides se dice qué pensaron y por qué se les recuerda. Un año sacado de
   un extracto de buscador no acredita nada.
   ════════════════════════════════════════════════════════════════════ */

/* ── Qué pregunta esta rama. ⚠️ Esta definición tiene que decir LO MISMO que
      la de la etapa 1 (`FILO_RAMAS`, la raíz «metafísica»): el alumno abre las
      dos seguidas y no puede leer dos definiciones distintas de lo mismo. La
      sonda busca la tirada de palabras más larga que las dos comparten. ── */
const MUN_METAFISICA = {
  nombre: 'Metafísica',
  emoji: '🌌',
  pregunta: '¿Qué es real? ¿Qué cambia y qué se queda?',
  hace: 'Pregunta de qué está hecho el mundo.',
  ojo: 'No es magia ni adivinanza. Es la pregunta que se hace ANTES de medir.'
};

/* ── Las cuatro preguntas grandes. La cuarta sigue sin contestarse, y se
      dice: una misión que prometa respuesta para todas enseña a no creerle
      a la pantalla. ── */
const MUN_PREGUNTAS = [
  { clave: 'hecho', nombre: '¿De qué está hecho todo?', emoji: '🧱',
    que: 'Buscar las piezas con las que está armado el mundo.',
    aqui: 'La piedra, el agua y vos, ¿tienen algo igual por dentro?',
    hoy: 'Esta se la pasó a la ciencia, y la ciencia la está midiendo.' },
  { clave: 'cambio', nombre: '¿Qué cambia y qué se queda?', emoji: '🔄',
    que: 'Ver qué le puede pasar a algo sin que deje de ser eso.',
    aqui: 'Al machete le cambiaron el mango. ¿Sigue siendo el mismo?',
    hoy: 'Esta se discute todavía, y se discute en los juzgados.' },
  { clave: 'real', nombre: '¿Qué es real y qué solo lo parece?', emoji: '🪞',
    que: 'Separar lo que está ahí de lo que uno cree que está ahí.',
    aqui: 'El reflejo del cerro en la laguna, ¿es un cerro?',
    hoy: 'Esta se usa todos los días, y casi nadie la nota.' },
  { clave: 'algo', nombre: '¿Por qué hay algo y no más bien nada?', emoji: '❔',
    que: 'Preguntar por qué existe el mundo, en vez de no existir nada.',
    aqui: 'No hay forma de medirla. Ni un aparato la contesta.',
    hoy: 'Esta sigue abierta. Nadie la ha cerrado, y se vale decirlo.' }
];

/* ── Las tres clases de cambio. Cada una con su PRUEBA, no con su
      definición: lo que hay que preguntarle a un cambio para saber cuál es. ── */
const MUN_TIPOS = [
  { clave: 'forma', nombre: 'Cambió la forma', emoji: '🔵', corto: 'Misma cosa, otra figura',
    senal: 'La materia es la misma. Solo se acomodó de otro modo.',
    prueba: 'Preguntate: ¿sigue siendo la misma sustancia?' },
  { clave: 'materia', nombre: 'Cambió la materia', emoji: '🟠', corto: 'Ya es otra cosa',
    senal: 'Lo que quedó es otra sustancia: otro color, otro olor, otro sabor.',
    prueba: 'Preguntate: ¿quedó algo distinto de lo que había?' },
  { clave: 'nombre', nombre: 'Cambió lo que decimos', emoji: '⚪', corto: 'La cosa está igual',
    senal: 'A la cosa no le pasó nada. Cambió su nombre, su dueño o su lugar.',
    prueba: 'Preguntate: ¿le pasó algo A LA COSA, o solo a lo que decimos de ella?' }
];

/* ⚠️ El atajo de «¿se puede deshacer?» es el que enseñan en la escuela y NO
   siempre acierta: hay cambios de materia que se deshacen en un laboratorio.
   Se dice en la pantalla en vez de callarlo. */
const MUN_TIPOS_OJO = 'Hay un atajo que se usa mucho: «si se puede deshacer, cambió la forma». Sirve casi siempre y no siempre. La sal disuelta en agua vuelve a salir, y ahí no cambió la materia.';

/* ── Los treinta cambios, con su clase. UN SOLO SITIO: de aquí salen el
      Clasifica y el Reto, así que no se pueden contradecir. Diez por clase. ── */
const MUN_CAMBIOS = [
  { c: 'La masa se vuelve tortilla',                         q: 'forma' },
  { c: 'El alambre se dobla para hacer un gancho',           q: 'forma' },
  { c: 'El hielo del vaso se derrite',                       q: 'forma' },
  { c: 'La hoja de papel se vuelve avión',                   q: 'forma' },
  { c: 'El barro se amasa y queda hecho una bola',           q: 'forma' },
  { c: 'La lámina del techo se abolla con el granizo',       q: 'forma' },
  { c: 'La camisa se arruga en la mochila',                  q: 'forma' },
  { c: 'El pan se parte en dos',                             q: 'forma' },
  { c: 'La arena se amontona para hacer un cerrito',         q: 'forma' },
  { c: 'El cabello mojado se peina para el otro lado',       q: 'forma' },
  { c: 'El clavo se llena de herrumbre',                     q: 'materia' },
  { c: 'El guineo se pone negro',                            q: 'materia' },
  { c: 'La leña se vuelve ceniza',                           q: 'materia' },
  { c: 'La leche se corta',                                  q: 'materia' },
  { c: 'La tortilla se tuesta y queda totoposte',            q: 'materia' },
  { c: 'La manzana partida se pone café',                    q: 'materia' },
  { c: 'El fósforo encendido se vuelve carboncito',          q: 'materia' },
  { c: 'El aguacate olvidado se pudre',                      q: 'materia' },
  { c: 'La carne cruda se cocina en el fuego',               q: 'materia' },
  { c: 'El hierro del portón se pica con la lluvia',         q: 'materia' },
  { c: 'El terreno pasa a nombre de otro dueño',             q: 'nombre' },
  { c: 'A la escuela le cambian el nombre',                  q: 'nombre' },
  { c: 'La aldea se vuelve municipio',                       q: 'nombre' },
  { c: 'Tu amigo se va a vivir lejos y ahora le decís así',  q: 'nombre' },
  { c: 'La calle del mango ahora se llama de otro modo',     q: 'nombre' },
  { c: 'El equipo del barrio se pone otro nombre',           q: 'nombre' },
  { c: 'Elvin pasa a ser el más alto: el otro se fue',      q: 'nombre' },
  { c: 'La pulpería pasa a ser de la hija',                  q: 'nombre' },
  { c: 'El río queda dentro de un área protegida',           q: 'nombre' },
  { c: 'La silla que era de tu hermano ahora es tuya',       q: 'nombre' }
];

/* ── ¿Sigue siendo el mismo? Cuatro casos donde la respuesta NO es una, y se
      dice. Aquí no se califica a nadie: lo que se califica es la regla que el
      alumno escriba y que la aplique igual a los cuatro. ── */
const MUN_IDENTIDAD = [
  { clave: 'machete', titulo: 'El machete del abuelo', emoji: '🔪',
    cambio: 'Le cambiaron el mango. Años después, la hoja.',
    unos: 'Sigue siendo el de él: nunca dejó de usarse y nunca hubo otro.',
    otros: 'Ya no es el de él: no le queda ni un pedazo del que era.',
    decide: 'Si lo que hace a una cosa es de qué está hecha, o para qué sirve.' },
  { clave: 'rio', titulo: 'La quebrada del pueblo', emoji: '🏞️',
    cambio: 'El agua de hoy no es la de ayer. Ya bajó toda.',
    unos: 'Es la misma quebrada: nace en el mismo cerro y va al mismo lado.',
    otros: 'No es la misma: de lo que había ayer no queda una gota.',
    decide: 'Si lo que hace a una cosa es su material, o su forma y su camino.' },
  { clave: 'vos', titulo: 'Vos, desde el kínder', emoji: '🧒',
    cambio: 'Casi todo tu cuerpo se ha ido cambiando por dentro.',
    unos: 'Sos el mismo: te acordás de aquello y tenés el mismo nombre.',
    otros: 'No sos el mismo: ni el cuerpo ni las ideas son las de entonces.',
    decide: 'Si lo que te hace vos es tu cuerpo, o lo que recordás.' },
  { clave: 'escuela', titulo: 'La escuela', emoji: '🏫',
    cambio: 'Cambiaron las aulas, los maestros y todos los alumnos.',
    unos: 'Es la misma escuela: está en el mismo sitio y hace lo mismo.',
    otros: 'Es otra: no queda nadie de los que estaban.',
    decide: 'Si lo que hace a una escuela son las personas, o lo que se hace ahí.' }
];

/* ⚠️ Y esto se dice con estas palabras, porque es la lección de la sección:
   una pregunta sin una sola respuesta buena NO se califica como si la
   tuviera. Es la misma decisión que héroe y prócer en la Ruta de la Patria. */
const MUN_IDENTIDAD_OJO = 'Estas cuatro no tienen UNA respuesta buena. Por eso no se califican como si la tuvieran. Lo que se examina es tu regla: decila antes y aplicala igual a las cuatro.';

/* ── El puente: la misma pregunta, lo que se contestó pensando y lo que hoy
      se mide. Es el CE1.4 visto trabajando. ── */
const MUN_PUENTE = [
  { clave: 'elementos', p: '¿De qué está hecho todo?',
    antes: 'Se contestó con cuatro cosas: agua, aire, fuego y tierra.',
    hoy: 'Hoy se cuentan y se ordenan en una tabla: son los elementos.',
    quien: 'La filosofía hizo la pregunta. La química la fue midiendo.' },
  { clave: 'atomo', p: '¿Hay una pieza que ya no se pueda partir?',
    antes: 'Se dijo que sí, y se le puso un nombre: átomo, «que no se parte».',
    hoy: 'Hoy se sabe que el átomo SÍ se parte. El nombre le quedó grande.',
    quien: 'La idea sirvió aunque el nombre falle: todo está hecho de piezas.' },
  { clave: 'quema', p: '¿Se pierde la materia cuando algo se quema?',
    antes: 'Parecía que sí: de un tronco grande queda un puño de ceniza.',
    hoy: 'Hoy se pesa lo que entra y lo que sale, y da lo mismo. Nada se pierde.',
    quien: 'Lo que faltaba no era pensar más: era una balanza.' },
  { clave: 'aire', p: '¿El aire es algo, si no se ve?',
    antes: 'Se dudó de que fuera algo, justamente porque no se ve.',
    hoy: 'Hoy se pesa y ocupa lugar. Es materia, como la piedra.',
    quien: 'Lo que no se ve puede ser real. Eso lo decide la medida.' }
];

/* ⚠️ Y el aviso que mantiene honesta la sección: no todas se le pasaron a la
   ciencia. La cuarta pregunta de `MUN_PREGUNTAS` sigue sin forma de medirse. */
const MUN_PUENTE_OJO = 'Ojo: no todas las preguntas se le pasaron a la ciencia. «¿Por qué hay algo y no más bien nada?» sigue sin aparato que la mida, y sigue siendo una buena pregunta.';

/* ── Qué es una cosmovisión, y las tres preguntas que TODA cosmovisión
      contesta. Sin la de ningún pueblo escrita: eso es MUN_INVESTIGA. ── */
const MUN_COSMOS = {
  que: 'Una cosmovisión es la forma entera en que un pueblo explica el mundo y su lugar en él.',
  toda: 'Todos tenemos una, aunque nunca la hayamos escrito. Se aprende oyendo en la casa.',
  preguntas: [
    { emoji: '🌄', p: '¿De dónde salió todo esto?' },
    { emoji: '👥', p: '¿Qué somos nosotros dentro de eso?' },
    { emoji: '🤲', p: '¿Qué se debe respetar, y por qué?' }
  ],
  aqui: 'En Honduras hay varias, y no todas contestan igual. Ninguna se resume bien en un renglón.'
};

/* ── La investigación. NO trae respuestas, y eso va dicho en la pantalla y en
      el papel: sin el aviso, se lee como un descuido y se salta. ── */
const MUN_INVESTIGA = {
  aviso: 'Aquí no hay respuestas escritas, y no es un descuido. Estas se averiguan donde vivís, porque es ahí donde están.',
  cuidado: 'Al preguntar, se pregunta con respeto y sin señalar a nadie. Se anota quién lo contó.',
  preguntas: [
    '¿Qué pueblos originarios hay en tu departamento? Preguntá en la escuela o en la alcaldía.',
    '¿Qué se cuenta en tu pueblo sobre de dónde salió el mundo? Pedile que te lo cuente a la persona más mayor que conozcás.',
    '¿Hay algo que en tu comunidad se respeta porque «tiene vida»? Un cerro, un río, un árbol.',
    '¿En qué se parece eso a lo que enseña la escuela, y en qué no? Escribí las dos y compará.'
  ]
};

/* ── El vocabulario de la unidad. ── */
const MUN_VOCABULARIO = [
  { w: 'materia',     a: 'Aquello de lo que está hecha una cosa. Pesa y ocupa lugar, aunque no se vea.' },
  { w: 'forma',       a: 'El modo en que está acomodada esa materia. La misma masa da tortilla o bola.' },
  { w: 'cambio',      a: 'Que algo deje de ser como era. No todo cambio le pasa a la cosa.' },
  { w: 'real',        a: 'Lo que está ahí aunque nadie lo esté mirando ni lo crea.' },
  { w: 'cosmovisión', a: 'La forma entera en que un pueblo explica el mundo y su lugar en él.' },
  { w: 'átomo',       a: 'La palabra quiere decir «que no se puede partir». Se puso pensando, no midiendo.' }
];

/* ── Los tres pensadores. Sin una sola fecha, a propósito. Y los dos últimos
      se contradicen: eso no se esconde, es la discusión de la unidad. ── */
const MUN_PENSADORES = [
  { clave: 'democrito', nombre: 'Demócrito', emoji: '⚛️', donde: 'Grecia',
    quien: 'Pensó que todo está hecho de piezas chiquitísimas que se repiten.',
    hizo: 'Les puso nombre sin verlas nunca: átomos, «lo que ya no se parte».',
    porque: 'Llegó pensando a una idea que la ciencia después fue a medir.',
    dato: 'El nombre falló —el átomo sí se parte— y la idea de las piezas acertó.' },
  { clave: 'heraclito', nombre: 'Heráclito', emoji: '🌊', donde: 'Grecia',
    quien: 'Dijo que todo cambia siempre, sin parar, aunque no se note.',
    hizo: 'Puso el ejemplo del río: no te bañás dos veces en el mismo.',
    porque: 'Obliga a explicar por qué decimos «el mismo río» si el agua ya se fue.',
    dato: 'Para él lo raro no es que algo cambie: es que algo parezca quedarse.' },
  { clave: 'parmenides', nombre: 'Parménides', emoji: '🗿', donde: 'Grecia',
    quien: 'Dijo lo contrario: que lo que es, es, y no puede dejar de ser.',
    hizo: 'Sostuvo que el cambio que vemos nos engaña y hay que desconfiar.',
    porque: 'Enseña a no ganar una discusión solo con lo que uno ve.',
    dato: 'Él y Heráclito nunca se pusieron de acuerdo. La discusión sigue abierta.' }
];

/* ── Qué le da esta pregunta a tres materias de la escuela. Es el árbol de la
      unidad 1 visto desde aquí. ── */
const MUN_ARBOL = [
  { clave: 'cnat', materia: 'Ciencias Naturales', emoji: '🌱',
    le: 'Le dio la pregunta de arranque: de qué está hecho todo y cómo cambia.',
    hoy: 'En tu cuaderno: el bloque de la materia contesta lo que aquí se pregunta.' },
  { clave: 'mat',  materia: 'Matemáticas', emoji: '🔢',
    le: 'Le deja una pregunta incómoda: ¿dónde está el número 7 cuando nadie lo escribe?',
    hoy: 'Un número no se puede tocar ni pesar, y sirve igual. Pensá por qué.' },
  { clave: 'csoc', materia: 'Ciencias Sociales', emoji: '🌎',
    le: 'Le da las cosmovisiones: cada pueblo explica el mundo entero a su modo.',
    hoy: 'Averiguá qué pueblos originarios hay en tu departamento, y desde cuándo.' }
];

/* Helpers: nadie reparte a mano los cambios por clase. Si mañana entra uno
   nuevo, el Clasifica y el Reto lo reparten solos. */
function munDeClase(q)  { return MUN_CAMBIOS.filter(x => x.q === q).map(x => x.c); }
function munTipo(q)     { return MUN_TIPOS.find(x => x.clave === q) || null; }
function munPregunta(c) { return MUN_PREGUNTAS.find(x => x.clave === c) || null; }
function munCaso(c)     { return MUN_IDENTIDAD.find(x => x.clave === c) || null; }
/* Los que SÍ le pasan algo a la cosa: forma y materia juntas. Es la frontera
   que de verdad importa en I Ciclo, antes de partir en tres. */
function munLeCambioAlgo() { return MUN_CAMBIOS.filter(x => x.q !== 'nombre').map(x => x.c); }
