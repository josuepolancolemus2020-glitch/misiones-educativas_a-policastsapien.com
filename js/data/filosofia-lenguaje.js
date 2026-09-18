/* ════════════════════════════════════════════════════════════════════
   PALABRAS QUE PIENSAN · la quinta unidad de la Ruta de la Raíz
   ────────────────────────────────────────────────────────────────────
   Mismo patrón que las unidades 1, 2, 3 y 4, y por la misma razón: el mismo
   texto acaba en la pantalla y en la ficha que se fotocopia, y si se separan
   el alumno estudia una cosa y el examen le pide otra.
   `_dev/verifica-filosofia.js` compara las dos.

   ⚠️ Y aquí la clase de cada frase (`LEN_FRASES`) sale de UN solo sitio, de
   donde se arman el Clasifica Y el Reto. Es la avería del Escudo marcado en
   rojo: con una sola fuente no se puede escribir.

   ⚠️ NADA de esto es para el maestro. Ni rutina de clase, ni ruta por ciclo,
   ni notas de cómo darla: la pantalla la abre el ALUMNO y la sonda lo
   comprueba. Está contado en CLAUDE.md.

   ⚠️ DE DÓNDE SALIÓ CADA COSA. Ninguna línea de aquí se buscó en internet.

   · EN MEDIA lo pide el currículo de Filosofía del CNB, BTP en Informática,
     undécimo grado, que se declara a sí mismo «Versión Preliminar 2025».
     Entre los contenidos del RA1, en «Las grandes tendencias actuales de la
     razón filosófica», nombra textualmente la **1.7 Filosofía analítica** y
     la **1.8 Hermenéutica** —página 108 del archivo—: las dos son el estudio
     del lenguaje y de la interpretación. Y el **CE1.3** pide «Expone la
     importancia de las escuelas del pensamiento filosófico promoviendo
     procesos de reflexión en la toma de decisiones» (página 107).

   · EN BÁSICA lo pide el Área de Comunicación, y con estas palabras:

     — II Ciclo, página 82 del archivo: «Analizan e interpretan ideas en
       textos orales: elementos esenciales, **datos objetivos, opiniones,
       intención del hablante**». De ahí sale que una frase se juzga por lo
       que HACE y no solo por lo que dice.

     — II Ciclo, página 97: «Identifican en sus propios textos, las diferentes
       clases de oraciones definidas por la **intención con que se dicen o
       escriben**: declarativas (afirman o niegan algo), exclamativas (indican
       energía, tristeza, susto o sorpresa), interrogativas (expresan
       preguntas y se escriben entre signos de interrogación), imperativas
       (expresan orden, ruegos, prohibiciones o súplicas)». Esas cuatro son
       `LEN_ACTOS`, y van con los nombres del DCNB.

     — III Ciclo, página 240: «**Infieren las intenciones del emisor e
       identifican la ironía y doble sentido** en un texto humorístico». De
       ahí sale `LEN_AMBIG`.

     — I Ciclo, página 46, Segundo Grado, bloque Lengua Oral: «Desarrollan
       fórmulas sociales de **saludo, pregunta, y despedida**, y de
       tratamiento en intercambios cotidianos». Saludar, preguntar y
       despedirse son cosas que se HACEN con palabras: es esta unidad en
       I Ciclo.

   · LOS DOS PENSADORES los nombra el propio CNB de Media, en las actividades
     de su espacio curricular de Filosofía (página 110 del archivo): «varios
     filósofos como Platón, Aristóteles, Sócrates Hegel, Bertrand Russel,
     Ortega y Gasset u otros filósofos». ⚠️ El documento escribe «Russel» con
     una sola l; aquí va **Bertrand Russell**, que es como se escribe su
     nombre, y la diferencia queda anotada aquí.

   ⚠️ Y NI UNA FECHA, como en las cuatro unidades anteriores. De un pensador
   se escribe qué hizo y por qué se le recuerda, nunca cuándo: una fecha mal
   copiada se pinta igual de bien y se estudia igual.

   ⚠️ Y NO se repite la unidad 2. Aquella examina las RAZONES que otros dan;
   esta examina las PALABRAS con que se las dan. Por eso `LEN_TRUCOS` no trae
   ninguna falacia: trae lo que hace la palabra elegida, la pregunta que ya
   lleva la respuesta dentro y el nombre que juzga antes de que se discuta.
   ════════════════════════════════════════════════════════════════════ */

/* La raíz, dicha IGUAL que en la unidad 1 (`FILO_RAMAS`, clave «lenguaje»):
   el alumno abre las dos y no puede leer dos definiciones distintas. */
const LEN_LENGUAJE = {
  nombre: 'Filosofía del lenguaje',
  emoji: '💬',
  pregunta: '¿Cómo cambian las palabras lo que pienso?',
  hace: 'Mira qué hacen las palabras con las ideas.',
  ojo: 'No pregunta si una frase es bonita. Pregunta qué hace.'
};

/* ── Las cuatro cosas que HACE una frase. Los nombres son los del DCNB
      —declarativa, exclamativa, interrogativa, imperativa—, y cada una lleva
      su PRUEBA en vez de su definición: la pregunta que se le hace a la
      frase para saber cuál es. ── */
const LEN_ACTOS = [
  { clave: 'afirma', nombre: 'Afirma', emoji: '📌', corto: 'Dice que algo es así',
    senal: 'Cuenta algo. Se puede estar de acuerdo o no.',
    prueba: 'Preguntate: ¿se puede contestar «es verdad» o «es mentira»?' },
  { clave: 'pregunta', nombre: 'Pregunta', emoji: '❓', corto: 'Pide un dato',
    senal: 'Deja un hueco. Espera que alguien lo llene.',
    prueba: 'Preguntate: ¿espera una respuesta?' },
  { clave: 'pide', nombre: 'Pide o manda', emoji: '✋', corto: 'Quiere que hagas algo',
    senal: 'No pide un dato: pide una acción. Un favor, una orden, un ruego.',
    prueba: 'Preguntate: ¿me está pidiendo que yo haga algo?' },
  { clave: 'exclama', nombre: 'Exclama', emoji: '❗', corto: 'Suelta lo que siente',
    senal: 'Sale de golpe. Dice más de quien habla que de la cosa.',
    prueba: 'Preguntate: ¿esto dice cómo se siente el que habla?' }
];

/* ⚠️ El corazón de la unidad, y va escrito: la FORMA de la frase no dice lo
   que la frase HACE. «¿Me pasás la sal?» tiene forma de pregunta y es un
   pedido; nadie contesta «sí» y se queda sentado. */
const LEN_ACTOS_OJO = 'Ojo: la forma no dice lo que la frase hace. «¿Me pasás la sal?» parece una pregunta. Es un pedido. Nadie contesta «sí» y se queda sentado.';

/* ── ⚠️ El corazón de la unidad, y por eso tiene sus propias frases: ocho que
      PARECEN una cosa y HACEN otra. Es lo que el DCNB de II Ciclo llama la
      «intención del hablante» y lo que el de III Ciclo pide inferir.
      Y lo que lo decide no es la frase: es DÓNDE se dice. Por eso cada una
      trae su `donde`, que es el dato con el que el alumno acierta. ── */
const LEN_DISFRAZ = [
  { f: '¿Me pasás la sal?',              donde: 'En la mesa, comiendo.',
    forma: 'pregunta', hace: 'pide',
    como: 'Nadie contesta «sí» y se queda sentado. Se pasa la sal.' },
  { f: '¿Podés cerrar el portón?',       donde: 'Tu mamá, desde la cocina.',
    forma: 'pregunta', hace: 'pide',
    como: 'No pregunta si podés. Te está pidiendo que lo cerrés.' },
  { f: '¿Quién dejó esto aquí?',         donde: 'El maestro, viendo un morral en la puerta.',
    forma: 'pregunta', hace: 'pide',
    como: 'No busca un nombre. Busca que alguien lo quite.' },
  { f: 'Ya son las seis',                donde: 'En una visita que se alargó.',
    forma: 'afirma', hace: 'pide',
    como: 'Dice la hora y está pidiendo que se vayan.' },
  { f: 'La puerta está abierta',         donde: 'Tu papá, con el frío entrando.',
    forma: 'afirma', hace: 'pide',
    como: 'Nadie le está contando un dato. Le están diciendo: cerrala.' },
  { f: 'Qué calor hace aquí',            donde: 'Alguien sentado junto a la ventana cerrada.',
    forma: 'exclama', hace: 'pide',
    como: 'Suelta lo que siente y pide que abran la ventana.' },
  { f: '¿Y vos qué hora creés que es?',  donde: 'A alguien que llegó tarde.',
    forma: 'pregunta', hace: 'afirma',
    como: 'No espera la hora. Está diciendo que llegó tarde.' },
  { f: '¡Qué buena idea!',               donde: 'Con la cara de que no lo es.',
    forma: 'exclama', hace: 'afirma',
    como: 'Suena a elogio y afirma lo contrario. Es ironía.' }
];

const LEN_DISFRAZ_OJO = 'Ojo: lo que decide no es la frase. Es dónde se dice y quién la dice. La misma frase pide en la mesa y pregunta en un examen.';

/* ── Treinta y dos frases con lo que HACE cada una: ocho por clase, para que
      no se acierte por reparto. De aquí salen el Clasifica y el Reto. ── */
const LEN_FRASES = [
  { f: 'En mi grado somos cuarenta y tres',            q: 'afirma' },
  { f: 'El agua de la pila está a veinte grados',      q: 'afirma' },
  { f: 'Mi tía vive en Comayagua',                     q: 'afirma' },
  { f: 'La tienda cierra a las seis',                  q: 'afirma' },
  { f: 'Ese camino se pone lodoso en lluvia',          q: 'afirma' },
  { f: 'Mi hermano es el más alto de su clase',        q: 'afirma' },
  { f: 'El bus pasa cada media hora',                  q: 'afirma' },
  { f: 'Hoy no hubo clase de tercer grado',            q: 'afirma' },
  { f: '¿A qué hora empieza el partido?',              q: 'pregunta' },
  { f: '¿Cuántos años tiene tu abuela?',               q: 'pregunta' },
  { f: '¿De quién es este cuaderno?',                  q: 'pregunta' },
  { f: '¿Por dónde se va a la quebrada?',              q: 'pregunta' },
  { f: '¿Ya comiste?',                                 q: 'pregunta' },
  { f: '¿Cómo se escribe tu apellido?',                q: 'pregunta' },
  { f: '¿Cuánto cuesta el saco de abono?',             q: 'pregunta' },
  { f: '¿Qué día es el examen?',                       q: 'pregunta' },
  { f: 'Cerrá el portón, por favor',                   q: 'pide' },
  { f: 'Pasame el lápiz',                              q: 'pide' },
  { f: 'No dejes la puerta abierta',                   q: 'pide' },
  { f: 'Ayudame a cargar esto',                        q: 'pide' },
  { f: 'Esperame en la esquina',                       q: 'pide' },
  { f: 'Guardá silencio un momento',                   q: 'pide' },
  { f: 'Traeme un vaso de agua',                       q: 'pide' },
  { f: 'Avisale a tu mamá que ya voy',                 q: 'pide' },
  { f: '¡Qué frío!',                                   q: 'exclama' },
  { f: '¡Ay, me quemé!',                               q: 'exclama' },
  { f: '¡Qué bueno que viniste!',                      q: 'exclama' },
  { f: '¡No puede ser!',                               q: 'exclama' },
  { f: '¡Qué rico huele!',                             q: 'exclama' },
  { f: '¡Cuidado con ese perro!',                      q: 'exclama' },
  { f: '¡Ya me cansé!',                                q: 'exclama' },
  { f: '¡Qué lejos queda!',                            q: 'exclama' }
];

/* ── Cuatro frases que quieren decir DOS cosas. El alumno las lee, encuentra
      las dos, y ve que lo que las arregla es preguntar. De aquí sale la
      ironía y el doble sentido que pide el DCNB de III Ciclo. ── */
const LEN_AMBIG = [
  { clave: 'banco', emoji: '🪑', frase: 'Te espero en el banco',
    una: 'En la banca del parque, a sentarse.',
    otra: 'En el banco donde se guarda la plata.',
    arregla: 'Se arregla con una pregunta: ¿en cuál de los dos?' },
  { clave: 'vaca', emoji: '🐄', frase: 'Vendí la vaca de mi tío',
    una: 'La vaca era de mi tío y yo la vendí.',
    otra: 'Le vendí mi vaca a mi tío.',
    arregla: 'Se arregla diciendo de quién era y a quién se le vendió.' },
  { clave: 'vieja', emoji: '👜', frase: 'Compré una bolsa vieja',
    una: 'La bolsa está usada.',
    otra: 'La bolsa es de un modelo de antes.',
    arregla: 'Se arregla con un dato: ¿usada, o de las de antes?' },
  { clave: 'medio', emoji: '🍞', frase: 'Dejé medio pan',
    una: 'La mitad de un pan.',
    otra: 'Un pan de los que se parten a la mitad.',
    arregla: 'Se arregla midiendo: ¿la mitad, o uno entero?' }
];

const LEN_AMBIG_OJO = 'Ojo: la frase no está mal escrita. Lo que pasa es que dice dos cosas a la vez. Y el que escucha elige una sin darse cuenta.';

/* ── Definir: la destreza de la filosofía analítica, y la que hace falta en
      las cuatro unidades anteriores. Una definición falla de dos maneras
      opuestas, y por eso se enseñan las dos pruebas. ── */
const LEN_DEFINIR = [
  { clave: 'ancha', emoji: '🫙', nombre: 'Muy ancha',
    que: 'Deja entrar cosas que no son.',
    ej: '«Una silla es algo donde uno se sienta.» Entonces una piedra es una silla.',
    prueba: 'Buscá algo que entre y no debería.' },
  { clave: 'angosta', emoji: '🥃', nombre: 'Muy angosta',
    que: 'Deja fuera cosas que sí son.',
    ej: '«Un ave es un animal que vuela.» Entonces la gallina no es ave.',
    prueba: 'Buscá algo que quede fuera y sí debería entrar.' },
  { clave: 'justa', emoji: '🎯', nombre: 'Justa',
    que: 'Entra todo lo que es y nada de lo que no.',
    ej: '«Una silla es un mueble con asiento y respaldo, para una persona.»',
    prueba: 'Probá las dos de arriba. Si aguanta las dos, sirve.' }
];

const LEN_DEFINIR_OJO = 'Ojo: definir no es adornar. Es decir qué entra y qué no. Una definición que aguanta las dos pruebas se puede usar para discutir.';

/* ── Lo que la palabra ARRASTRA. El DCNB de III Ciclo nombra el «lenguaje
      denotativo» (página 181): la misma cosa, dicha con otra palabra, llega
      distinto. ⚠️ Y elegir la palabra NO es mentir: es apuntar. Por eso cada
      par trae lo que las dos nombran IGUAL. ── */
const LEN_CARGA = [
  { clave: 'bolsa', cosa: 'una bolsa que ya usó otro',
    suave: 'de segunda mano', fuerte: 'usada',
    igual: 'Las dos nombran la misma bolsa.' },
  { clave: 'plata', cosa: 'el dinero que se fue en algo',
    suave: 'lo invirtió', fuerte: 'lo gastó',
    igual: 'En las dos, la plata ya no está.' },
  { clave: 'flaco', cosa: 'alguien que come poco',
    suave: 'come sanito', fuerte: 'no come',
    igual: 'Las dos hablan de la misma comida.' },
  { clave: 'casa', cosa: 'una casa chiquita',
    suave: 'acogedora', fuerte: 'apretada',
    igual: 'Las dos miden los mismos metros.' }
];

const LEN_CARGA_OJO = 'Ojo: elegir la palabra no es mentir. Es apuntar. Lo que se hace es darse cuenta de hacia dónde apunta, y decidir uno mismo.';

/* ── Cómo persuade la PALABRA, no la razón. La razón la examina la unidad 2;
      aquí se mira la frase.
      ⚠️ Y el cuarto NO es un truco, a propósito: una unidad donde toda
      palabra fuerte es trampa fabrica un alumno que no le cree a nadie, y
      eso cuesta lo mismo que creerlo todo. Es la regla del mensaje sin
      señales de los peligros de la IA. ── */
const LEN_TRUCOS = [
  { clave: 'cargada', emoji: '🪤', nombre: 'La pregunta con la respuesta dentro',
    hace: 'Da por hecho lo que todavía no se discutió.',
    suena: '«¿Por qué el abono caro rinde más?»',
    cuesta: 'Contestarla ya es aceptar que rinde más.',
    desarma: 'Contestá la de atrás primero: ¿rinde más?',
    truco: true },
  { clave: 'nombre', emoji: '🏷️', nombre: 'El nombre que ya juzga',
    hace: 'Le pone a la cosa un nombre que decide antes de mirarla.',
    suena: 'Llamarle «regalo» a un préstamo que hay que devolver.',
    cuesta: 'Se firma pensando que no se debe nada.',
    desarma: 'Cambiale el nombre y volvé a mirar: ¿sigue pareciendo lo mismo?',
    truco: true },
  { clave: 'vaga', emoji: '🌫️', nombre: 'La palabra que no se puede comprobar',
    hace: 'Suena a dato y no dice nada que se pueda medir.',
    suena: '«Es de mejor calidad» · «es más natural»',
    cuesta: 'Se paga más por algo que nadie puede contar.',
    desarma: 'Pedí el número o el ejemplo: ¿mejor en qué, y cuánto?',
    truco: true },
  { clave: 'fuerte', emoji: '✅', nombre: 'La palabra fuerte que SÍ vale',
    hace: 'Nombra con fuerza algo que de verdad es fuerte.',
    suena: '«Se cayó el puente» cuando el puente se cayó.',
    cuesta: 'Nada: decirlo flojo sería el error.',
    desarma: 'No hay que desarmarla. Se comprueba, como todo.',
    truco: false }
];

const LEN_TRUCOS_OJO = 'Ojo: no toda palabra fuerte es trampa. La cuarta no lo es. Desconfiar de todas las palabras cuesta lo mismo que creerlas todas.';

/* ── Lo que no se contesta copiando de aquí. Es la investigación que el
      currículo pide de verdad, y se hace donde vive el alumno. ── */
const LEN_INVESTIGA = {
  aviso: 'Aquí no hay respuestas escritas, y no es un descuido. Estas se averiguan hablando con la gente de tu casa y de tu comunidad.',
  cuidado: 'Al preguntar, se pregunta con respeto. Y se anota quién lo dijo y qué día.',
  preguntas: [
    'Buscá una palabra que usan tus abuelos y en la escuela no. Preguntá qué quiere decir. Anotá quién te lo dijo.',
    'Guardá un mensaje que te llegó esta semana. Escribí qué HACE: afirma, pregunta, pide o exclama.',
    'Preguntale a dos personas qué es «ser buen alumno». Escribí las dos respuestas. Marcá en qué no coinciden.',
    'Buscá un anuncio de la pulpería o de la radio. Copiá una palabra que no se pueda comprobar.'
  ]
};

const LEN_VOCABULARIO = [
  { w: 'significado',  a: 'Lo que una palabra le hace entender al que la oye.' },
  { w: 'intención',    a: 'Lo que el que habla quiere lograr al decirlo.' },
  { w: 'ambiguo',      a: 'Que quiere decir dos cosas, y no se sabe cuál.' },
  { w: 'definir',      a: 'Decir qué entra y qué no entra en una palabra.' },
  { w: 'retórica',     a: 'El arte de decir las cosas para que convenzan.' },
  { w: 'literal',      a: 'Lo que la frase dice, sin lo que insinúa.' }
];

/* ⚠️ Ni una fecha: solo qué hizo y por qué se le recuerda. A los dos los
   nombra el propio CNB de Media en las actividades de su Filosofía. */
const LEN_PENSADORES = [
  { clave: 'russell', nombre: 'Bertrand Russell', emoji: '🧮', donde: 'Inglaterra',
    quien: 'Se puso a mirar las frases con la lupa con que se miran las cuentas.',
    hizo: 'Mostró que una frase puede estar bien escrita y no decir nada claro.',
    porque: 'Enseña a pedir que la frase se aclare antes de discutirla.',
    dato: 'De ahí viene la filosofía analítica, que el currículo nombra.' },
  { clave: 'ortega', nombre: 'José Ortega y Gasset', emoji: '💬', donde: 'España',
    quien: 'Dijo que cada palabra arrastra la vida de quien la usa.',
    hizo: 'Mostró que dos personas usan la misma palabra y no dicen lo mismo.',
    porque: 'Enseña a preguntar qué quiere decir el otro, no qué quiero decir yo.',
    dato: 'De ahí viene la hermenéutica, que es el arte de interpretar.' }
];

const LEN_ARBOL = [
  { clave: 'esp', materia: 'Español', emoji: '✍️',
    le: 'Le dio la pregunta por la intención. Qué hace la frase, no solo qué dice.',
    hoy: 'En tu cuaderno: al leer, escribí qué quería lograr el que escribió.' },
  { clave: 'csoc', materia: 'Ciencias Sociales', emoji: '🌎',
    le: 'Le dio el cuidado con el nombre. Quien pone el nombre ya contó la historia.',
    hoy: 'Buscá un hecho con dos nombres distintos y mirá qué cambia.' },
  { clave: 'mat', materia: 'Matemáticas', emoji: '🔢',
    le: 'Le dio la definición exacta. Un número par entra o no entra, sin discusión.',
    hoy: 'Definí «número par» y probá si tu definición aguanta las dos pruebas.' }
];

/* Helpers: nadie reparte a mano las frases por clase. Si mañana entra una
   nueva, el Clasifica y el Reto la reparten solos. */
function lenDeClase(q) { return LEN_FRASES.filter(x => x.q === q).map(x => x.f); }
function lenActo(c)    { return LEN_ACTOS.find(x => x.clave === c) || null; }
function lenAmbig(c)   { return LEN_AMBIG.find(x => x.clave === c) || null; }
function lenTruco(c)   { return LEN_TRUCOS.find(x => x.clave === c) || null; }
/* Las que PIDEN algo del que escucha: preguntar y pedir juntas. Es la
   frontera que de verdad importa en I Ciclo, antes de partir en cuatro. */
function lenPideAlgo() { return LEN_FRASES.filter(x => x.q === 'pregunta' || x.q === 'pide').map(x => x.f); }
/* Las que hacen lo que parecen: se usan al lado de las disfrazadas, porque
   una unidad donde toda frase esconde algo fabrica un alumno que no le cree
   a ninguna. Es la regla del cuarto truco que NO es truco. */
function lenDerechas(n) {
  const out = [];
  LEN_ACTOS.forEach(a => { const l = lenDeClase(a.clave); if (l[n]) out.push({ f: l[n], q: a.clave }); });
  return out;
}
