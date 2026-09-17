/* ════════════════════════════════════════════════════════════════════
   PENSAR CON ORDEN · la segunda unidad de la Ruta de la Raíz (Filosofía)
   ────────────────────────────────────────────────────────────────────
   Mismo patrón que la unidad 1 (`filosofia-asombro.js`) y por la misma razón:
   el mismo texto acaba en la pantalla y en la ficha que se fotocopia, y si se
   separan el alumno estudia una cosa y el examen le pide otra.
   `_dev/verifica-filosofia.js` compara las dos.

   ⚠️ Y aquí la clasificación de cada razón (`LOG_RAZONES`) sale de UN solo
   sitio, de donde se arman el Clasifica Y el Reto. No es comodidad: es la
   avería del Escudo marcado en rojo, que con una sola fuente no se puede
   escribir.

   ⚠️ DE DÓNDE SALIÓ CADA COSA. Ninguna línea de aquí se buscó en internet.

   · LO QUE ESTA UNIDAD CUMPLE es del currículo de Filosofía del CNB de
     Educación Media, BTP en Informática, undécimo grado, textual: **RA2**
     «Construir razonamientos sobre el entorno, aplicando elementos de la
     lógica clásica y simbólica para desarrollar un pensamiento complejo
     utilizando las tablas de verdad» y **CE2.1** «Identifica los elementos que
     conforman el pensamiento lógico clásico desde el contexto de la antigua
     Grecia». Confirmado en el PDF, página 107 del archivo
     (`cnb-media-btp-sistematizacion-informatica-12-2025.pdf`), que se declara
     a sí mismo «Versión Preliminar 2025».

   · ⚠️ LO QUE NO SE TRAE DE AHÍ, Y A PROPÓSITO: las TABLAS DE VERDAD y la
     lógica SIMBÓLICA (CE2.3 y CE2.4). Eso es undécimo grado, y esta ruta es de
     Básica: la misma unidad la abre un niño de 1.º. Lo que sí se enseña es lo
     que el propio currículo pone primero, la lógica CLÁSICA: las piezas de un
     argumento, el «si… entonces», la diferencia entre estar bien hecho y ser
     verdad, y las cuatro falacias. Prometer tablas de verdad a un niño de
     primero y no dárselas sería lo de siempre: un juego que promete una cosa
     y hace otra enseña a no creerle a la pantalla.

   · EL TEMARIO Y LA RUTA POR CICLO son del currículo holístico de Filosofía
     para Básica que escribió el autor. Esta es la unidad 2, de marzo. El
     porqué está en CURRICULA-FILOSOFIA.md.

   ⚠️ NI UNA FECHA, igual que en la unidad 1. De Aristóteles y de Lewis Carroll
   se dice qué hicieron y por qué se les recuerda: eso es lo que la unidad
   necesita y lo que nadie discute. Un año sacado de un extracto de buscador no
   acredita nada, y ponerlos es la actividad de investigar de la ficha.
   ════════════════════════════════════════════════════════════════════ */

/* ── Las tres piezas de un argumento. Es el CE2.1: los elementos del
      pensamiento lógico clásico. ── */
const LOG_PIEZAS = [
  { clave: 'razon', nombre: 'La razón', emoji: '🧱',
    que: 'Lo que se da para sostener lo otro.',
    donde: 'Casi siempre va después de «porque».',
    ejemplo: '…porque el suelo está mojado.' },
  { clave: 'conclusion', nombre: 'La conclusión', emoji: '🎯',
    que: 'Lo que se quiere que creas.',
    donde: 'Casi siempre va después de «así que» o «por lo tanto».',
    ejemplo: 'Así que llovió anoche.' },
  { clave: 'nexo', nombre: 'El nexo', emoji: '🔗',
    que: 'La palabra que amarra las dos.',
    donde: 'Es la que te dice cuál es cuál.',
    ejemplo: 'porque · así que · por lo tanto · si… entonces' }
];

/* ── El semáforo de razones: la actividad de I Ciclo, y la destreza de la
      unidad entera. Tres colores, y cada uno con la señal por la que se
      reconoce. ── */
const LOG_SEMAFORO = [
  { clave: 'verde', nombre: 'Sirve', emoji: '🟢', senalCorta: 'Sostiene',
    senal: 'Se puede comprobar o discutir, y de verdad sostiene lo que dice.',
    prueba: 'Pregúntate: si esto fuera verdad, ¿tendría que ser verdad lo otro?' },
  { clave: 'amarillo', nombre: 'Ayuda poco', emoji: '🟡', senalCorta: 'No alcanza',
    senal: 'Puede ser verdad, pero no sostiene lo que se quiere probar.',
    prueba: 'Pregúntate: ¿esto de qué me convence, de lo que dice o de otra cosa?' },
  { clave: 'rojo', nombre: 'No es una razón', emoji: '🔴', senalCorta: 'No se puede examinar',
    senal: 'No dice nada que se pueda examinar: es quien manda, o cuánta gente lo dice.',
    prueba: 'Pregúntate: ¿esto se puede comprobar, o solo se puede obedecer?' }
];

/* ── Las razones de ejemplo, con su color. UN SOLO SITIO. ── */
const LOG_RAZONES = [
  { r: 'Porque el suelo está mojado y no ha pasado la pila',      color: 'verde' },
  { r: 'Porque la malla mide 20 metros y el cerco pide 24',       color: 'verde' },
  { r: 'Porque conté los sacos y faltan tres',                    color: 'verde' },
  { r: 'Porque el pan está duro y lo compramos el lunes',         color: 'verde' },
  { r: 'Porque la hoja tiene manchas en las dos caras',           color: 'verde' },
  { r: 'Porque el bus pasa a las seis y ya son seis y media',     color: 'verde' },
  { r: 'Porque la suma da 48 y el recibo dice 84',                color: 'verde' },
  { r: 'Porque en el cuaderno está anotado el día que se pagó',   color: 'verde' },
  { r: 'Porque la llave quedó abierta toda la noche',             color: 'verde' },
  { r: 'Porque los dos números terminan en cero',                 color: 'verde' },

  { r: 'Porque a mí me pasó una vez',                             color: 'amarillo' },
  { r: 'Porque el otro día también amaneció nublado',             color: 'amarillo' },
  { r: 'Porque se ve más bonito',                                 color: 'amarillo' },
  { r: 'Porque el saco es más caro',                              color: 'amarillo' },
  { r: 'Porque el que lo vende es amable',                        color: 'amarillo' },
  { r: 'Porque en la televisión lo dijeron rápido',               color: 'amarillo' },
  { r: 'Porque mi primo tuvo suerte con eso',                     color: 'amarillo' },
  { r: 'Porque está escrito con letra grande',                    color: 'amarillo' },
  { r: 'Porque lo leí en un papel sin firma',                     color: 'amarillo' },
  { r: 'Porque a la vecina le funcionó',                          color: 'amarillo' },

  { r: 'Porque yo lo digo',                                       color: 'rojo' },
  { r: 'Porque todo el mundo lo compra',                          color: 'rojo' },
  { r: 'Porque siempre se ha hecho así',                          color: 'rojo' },
  { r: 'Porque el que dice lo otro ni terminó la escuela',         color: 'rojo' },
  { r: 'Porque si no me creés, te va a ir mal',                    color: 'rojo' },
  { r: 'Porque nadie más pregunta eso',                           color: 'rojo' },
  { r: 'Porque soy el mayor',                                     color: 'rojo' },
  { r: 'Porque ya está decidido',                                 color: 'rojo' },
  { r: 'Porque la mayoría votó que sí',                           color: 'rojo' },
  { r: 'Porque no hay nada que discutir',                         color: 'rojo' }
];

/* ── Las cuatro falacias que nombra el currículo. Cada una con su MECANISMO y
      con la PREGUNTA que la desarma: es la forma que ya funcionó en los
      peligros de la IA, y sin la pregunta esto sería una lista de miedos. ── */
const LOG_FALACIAS = [
  { clave: 'persona', nombre: 'Contra la persona', emoji: '👤',
    mecanismo: 'Se ataca a quien habla en vez de a lo que dice.',
    suena: '«No le creas: si ni terminó la escuela.»',
    desarma: '¿Qué tiene que ver quién lo dice con si es verdad? Pedile la razón, no el título.',
    cuesta: 'Se pierde la razón buena de quien no tiene con qué defenderse.' },
  { clave: 'apresurada', nombre: 'Generalización apresurada', emoji: '🔢',
    mecanismo: 'Se saca una regla de dos o tres casos.',
    suena: '«En ese pueblo son bien tramposos: me tocaron dos.»',
    desarma: '¿Cuántos casos viste, y de cuántos? Dos de doscientos no es una regla.',
    cuesta: 'Así se arman las famas de un barrio entero, y no se quitan.' },
  { clave: 'dilema', nombre: 'Falso dilema', emoji: '🚪',
    mecanismo: 'Se ofrecen dos salidas como si no hubiera más.',
    suena: '«O te vas a la ciudad o te quedás sin futuro.»',
    desarma: '¿Solo hay dos? Nombrá una tercera y el dilema se cae.',
    cuesta: 'Se decide con miedo una cosa que tenía otras salidas.' },
  { clave: 'mayoria', nombre: 'Apelación a la mayoría', emoji: '👥',
    mecanismo: 'Se ofrece como razón cuánta gente lo hace.',
    suena: '«Compralo: si todo el mundo lo compra.»',
    desarma: 'Si todo el mundo se equivoca, ¿deja de ser un error? Pedí una razón de la cosa, no del gentío.',
    cuesta: 'Es la que le costó a Wilmer la mitad del dinero de la siembra.' }
];

/* ── El «si… entonces», con su error clásico. Es lo que el currículo pide
      («usa si… entonces») y donde se equivoca casi todo el mundo. ── */
const LOG_SI_ENTONCES = {
  regla: 'Si llueve, la cancha se moja.',
  bien: { paso: 'Llovió.', luego: 'Así que la cancha está mojada.',
    porque: 'La regla dice que si pasa lo primero, pasa lo segundo. Y pasó lo primero.' },
  mal: { paso: 'La cancha está mojada.', luego: 'Así que llovió.',
    porque: 'La regla NO dice que solo la lluvia la moje. Alguien pudo regarla, o se reventó un tubo.' },
  ojo: 'La regla va en UN solo sentido. Leerla al revés es el error más común, y es el que usa quien te quiere convencer de algo.'
};

/* ── Bien hecho no es lo mismo que verdad. Es la pregunta de III Ciclo, y la
      idea más difícil de la unidad: se enseña con cuatro casos. ── */
const LOG_VALIDEZ = [
  { clave: 'ok', bienHecho: true, verdad: true, titulo: 'Bien hecho, y con razones verdaderas',
    razones: ['Todos los pinos son árboles.', 'El de la entrada de la escuela es un pino.'],
    conclusion: 'Así que el de la entrada es un árbol.',
    que: 'Aquí sí se puede confiar: el armado es bueno y las dos razones son verdad.' },
  { clave: 'falsa', bienHecho: true, verdad: false, titulo: 'Bien hecho, y aun así sale una mentira',
    razones: ['Todos los peces vuelan.', 'La tilapia es un pez.'],
    conclusion: 'Así que la tilapia vuela.',
    que: 'El armado es perfecto, y la conclusión es falsa. La culpa no es del armado: la primera razón es mentira. Esta es la respuesta a la pregunta de la unidad.' },
  { clave: 'nosigue', bienHecho: false, verdad: false, titulo: 'Mal hecho, aunque las razones sean verdad',
    razones: ['Todos los pinos son árboles.', 'El mango es un árbol.'],
    conclusion: 'Así que el mango es un pino.',
    que: 'Las dos razones son verdad y la conclusión es falsa. Aquí el problema sí es el armado: de «todos los pinos son árboles» no se saca nada sobre los demás árboles.' },
  { clave: 'suerte', bienHecho: false, verdad: true, titulo: 'Mal hecho, y le salió bien de casualidad',
    razones: ['Si llueve, la cancha se moja.', 'La cancha está mojada.'],
    conclusion: 'Así que llovió.',
    que: 'Puede que sí haya llovido, pero eso no lo demuestra este argumento: lo acertó de suerte. Un argumento así funciona hasta el día que falla.' }
];

/* ── Los conectores: el puente con Español, que el currículo pide. ── */
const LOG_CONECTORES = [
  { w: 'porque',      hace: 'Presenta la razón.',        ej: 'No salgas, porque el río viene crecido.' },
  { w: 'así que',     hace: 'Presenta la conclusión.',   ej: 'El río viene crecido, así que no salgas.' },
  { w: 'por lo tanto', hace: 'Presenta la conclusión, en texto escrito.', ej: 'El río viene crecido; por lo tanto, no conviene cruzar.' },
  { w: 'si… entonces', hace: 'Pone una condición.',      ej: 'Si el río baja, entonces se puede cruzar.' },
  { w: 'sin embargo', hace: 'Presenta la objeción.',     ej: 'El río bajó; sin embargo, el puente sigue roto.' }
];

/* ── El vocabulario de la unidad. ── */
const LOG_VOCABULARIO = [
  { w: 'razón',         a: 'Lo que se da para sostener lo que se dice. Si no se puede examinar, no es una razón.' },
  { w: 'conclusión',    a: 'Lo que se quiere que creas. Es a donde apunta el argumento.' },
  { w: 'argumento',     a: 'Una razón y una conclusión amarradas. No es una pelea: es una construcción.' },
  { w: 'contradicción', a: 'Decir dos cosas que no pueden ser verdad a la vez. Encontrar la propia es avanzar.' },
  { w: 'falacia',       a: 'Un argumento que parece bueno y no lo es. Convence sin sostener nada.' },
  { w: 'validez',       a: 'Que el armado esté bien. Se puede tener validez y estar diciendo una mentira.' }
];

/* ── Los dos pensadores. Sin una sola fecha, a propósito. ── */
const LOG_PENSADORES = [
  { clave: 'aristoteles', nombre: 'Aristóteles', emoji: '📐', donde: 'Grecia',
    quien: 'El primero que puso en orden las formas del razonamiento.',
    hizo: 'Se dio cuenta de que hay armados que funcionan siempre, sin importar de qué se hable.',
    porque: 'Por eso la lógica se puede enseñar: no es una opinión sobre cada tema, es una forma.',
    dato: 'Fue alumno de Platón, y Platón fue alumno de Sócrates, el de la unidad anterior.' },
  { clave: 'carroll', nombre: 'Lewis Carroll', emoji: '🎩', donde: 'Inglaterra',
    quien: 'Enseñaba lógica con juegos y acertijos, y escribía cuentos.',
    hizo: 'Armó silogismos absurdos a propósito para que se viera el ARMADO y no el tema.',
    porque: 'Es la prueba de que esto se aprende jugando: si el armado es bueno, funciona hasta con tilapias que vuelan.',
    dato: 'El mismo que escribió el cuento de la niña que cae por la madriguera del conejo era profesor de matemáticas.' }
];

/* ── Qué le da la lógica a cada materia de la escuela. Es el CE1.4 de la
      unidad anterior visto desde aquí. ── */
const LOG_ARBOL = [
  { clave: 'mat',  materia: 'Matemáticas',        emoji: '🔢',
    le: 'Le da la demostración. Un resultado no vale porque salga: vale porque se sigue de lo anterior.',
    hoy: 'En tu cuaderno: ¿por qué 7 × 8 da 56? No vale «porque me lo aprendí».' },
  { clave: 'esp',  materia: 'Español',            emoji: '✍️',
    le: 'Le da el texto argumentativo, con sus conectores: porque, así que, sin embargo.',
    hoy: 'Busca en una noticia la conclusión y la razón. A veces falta una.' },
  { clave: 'cnat', materia: 'Ciencias Naturales', emoji: '🌱',
    le: 'Le da la inferencia: sacar una conclusión de lo que se observó.',
    hoy: 'Las hojas del patio están mordidas. ¿Qué se sigue de eso, y qué no?' }
];

/* Helpers: nadie reparte a mano las razones por color. Si mañana entra una
   razón nueva, el Clasifica y el Reto la reparten solos. */
function logDeColor(c)  { return LOG_RAZONES.filter(x => x.color === c).map(x => x.r); }
function logColor(c)    { return LOG_SEMAFORO.find(x => x.clave === c) || null; }
function logFalacia(c)  { return LOG_FALACIAS.find(x => x.clave === c) || null; }
function logPieza(c)    { return LOG_PIEZAS.find(x => x.clave === c) || null; }
/* Las que NO sirven como razón: amarillas y rojas juntas. La frontera que de
   verdad importa en I Ciclo es esta, no la de tres. */
function logNoSostienen() { return LOG_RAZONES.filter(x => x.color !== 'verde').map(x => x.r); }
