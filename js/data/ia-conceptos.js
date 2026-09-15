/* ─────────────────────────────────────────────────────────────────────────
   El vocabulario de la Ruta de la Máquina que Aprende, en UN solo sitio.

   Por qué existe este archivo, y por qué las cuatro misiones lo leen en vez de
   escribir sus definiciones: son cuatro misiones seguidas de la misma ruta y el
   alumno las abre una detrás de otra. Si «sesgo» se define de una manera en la
   etapa 2 y de otra en la 4, el que estudió las dos no aprende dos matices:
   aprende a desconfiar de las dos. Es la misma razón por la que la definición de
   héroe y prócer tiene que ser la misma en Aspectos Cívicos y en Próceres.

   Y hay una segunda razón, que es la que de verdad cuesta caro: cada misión
   tiene su FICHA IMPRESA, y una ficha se fotocopia y se guarda. Una definición
   corregida en la pantalla y no en el papel deja al alumno estudiando una cosa y
   al maestro corrigiendo por otra. Las sondas comparan las dos contra esto.

   ⚠️ LO QUE NO SE ESCRIBE AQUÍ, Y A PROPÓSITO: nada que envejezca. Ni qué
   empresa tiene el modelo más grande, ni cuántos parámetros, ni cuántos usuarios.
   Eso cambia cada mes y la ficha se guarda un año en una gaveta. Es la normativa
   del papel del proyecto: lo que no se puede contar al vuelo, o se fecha o no se
   escribe.

   El marco y el porqué de la materia entera están en
   CURRICULA-INTELIGENCIA-ARTIFICIAL.md.
   ───────────────────────────────────────────────────────────────────────── */

/* Los conceptos. `ciclo` dice en qué etapa de la ruta SE ESTRENA cada uno, no
   en cuál se usa: los de I Ciclo vuelven a salir en III, con más adentro. */
const IA_CONCEPTOS = [
  { clave: 'ia', emoji: '🧠', palabra: 'Inteligencia Artificial', ciclo: 1,
    corta: 'Una máquina que hace cosas que parecían de personas.',
    definicion: 'Programas de computadora que hacen tareas que antes solo hacían las personas: reconocer una cara, entender lo que dictas, traducir un letrero o escribir un texto. No piensan ni sienten: calculan.',
    ejemplo: 'Cuando le dictas un mensaje al teléfono y el teléfono lo escribe.' },

  { clave: 'maquina', emoji: '⚙️', palabra: 'Máquina', ciclo: 1,
    corta: 'Una cosa hecha por personas para hacer un trabajo.',
    definicion: 'Un objeto que las personas fabricaron para que haga un trabajo. No nace, no crece, no come y no muere. Se enciende, se apaga y se compone.',
    ejemplo: 'Un molino, un ventilador y un teléfono son máquinas.' },

  { clave: 'instruccion', emoji: '📋', palabra: 'Instrucción', ciclo: 1,
    corta: 'Una orden que la máquina obedece.',
    definicion: 'Una orden clara y en orden, de las que una máquina puede obedecer sin preguntar. Un programa es un montón de instrucciones, una detrás de otra.',
    ejemplo: '«Enciende la luz», «espera 5 segundos», «apágala».' },

  { clave: 'ejemplo', emoji: '🍎', palabra: 'Ejemplo', ciclo: 1,
    corta: 'Una cosa que le mostramos a la máquina para que aprenda.',
    definicion: 'Cada cosa que le enseñamos a la máquina para que aprenda. Con pocos ejemplos se equivoca; con muchos acierta más. Le llamamos ejemplo a la foto, al sonido o a la frase que le mostramos.',
    ejemplo: 'Mil fotos de nances para que aprenda a reconocer un nance.' },

  { clave: 'dato', emoji: '📦', palabra: 'Dato', ciclo: 2,
    corta: 'Un pedacito de información que la máquina puede guardar.',
    definicion: 'Cada pedazo de información que se guarda y se puede contar, medir o comparar: un número, una palabra, una foto, un sonido. Los datos son la comida de la Inteligencia Artificial.',
    ejemplo: 'El peso de una naranja, el color de un nance, la temperatura del día.' },

  { clave: 'etiqueta', emoji: '🏷️', palabra: 'Etiqueta', ciclo: 2,
    corta: 'El nombre correcto que le ponemos a un ejemplo.',
    definicion: 'La respuesta correcta que una persona le pone a un ejemplo antes de enseñárselo a la máquina. Sin etiqueta, la máquina ve la foto pero no sabe de qué es.',
    ejemplo: 'A esta foto le ponemos la etiqueta «nance»; a esta otra, «anona».' },

  { clave: 'entrenar', emoji: '🏋️', palabra: 'Entrenar', ciclo: 2,
    corta: 'Mostrarle muchos ejemplos hasta que aprenda el patrón.',
    definicion: 'Mostrarle a la máquina muchos ejemplos con sus etiquetas, una y otra vez, hasta que encuentre el patrón que los separa. Entrenar cuesta tiempo y se hace una vez; usar lo aprendido es rápido y se hace siempre.',
    ejemplo: 'Enseñarle diez mil fotos de frutas hasta que separe nances de anonas.' },

  { clave: 'patron', emoji: '🔁', palabra: 'Patrón', ciclo: 2,
    corta: 'Lo que se repite en muchos ejemplos.',
    definicion: 'Lo que se repite en muchos ejemplos y sirve para reconocerlos. La máquina no entiende lo que ve: encuentra lo que se repite y lo usa para decidir.',
    ejemplo: 'Los nances casi siempre son pequeños y amarillos; ese es el patrón.' },

  { clave: 'prueba', emoji: '🧪', palabra: 'Prueba', ciclo: 2,
    corta: 'Examinarla con ejemplos que nunca vio.',
    definicion: 'Examinar a la máquina con ejemplos que NO le enseñamos, para saber si de verdad aprendió el patrón o solo se acordó de lo que vio. Si acierta con lo nuevo, aprendió.',
    ejemplo: 'Le enseñamos 100 fotos y la probamos con 20 que nunca vio.' },

  { clave: 'error', emoji: '❌', palabra: 'Error', ciclo: 2,
    corta: 'Las veces que la máquina se equivoca.',
    definicion: 'Las veces que la máquina contesta mal. Ninguna acierta el 100 %: siempre queda un pedacito de error, y en ese pedacito puede haber una persona.',
    ejemplo: 'Si acierta 9 de cada 10, se equivoca 1 de cada 10.' },

  { clave: 'supervisado', emoji: '🏷️', palabra: 'Aprendizaje supervisado', ciclo: 2,
    corta: 'Aprende con ejemplos que ya traen su respuesta.',
    definicion: 'La máquina aprende con ejemplos que ya traen puesta la etiqueta correcta. Es como estudiar con el solucionario al lado: ve el ejercicio y ve la respuesta.',
    ejemplo: 'Fotos de hojas con su etiqueta «sana» o «con plaga».' },

  { clave: 'nosupervisado', emoji: '🗂️', palabra: 'Aprendizaje no supervisado', ciclo: 2,
    corta: 'Agrupa sola lo que se parece, sin que nadie le diga.',
    definicion: 'La máquina recibe ejemplos SIN etiqueta y los junta por parecido. No sabe cómo se llama cada grupo: sabe que estos se parecen entre sí y aquellos no.',
    ejemplo: 'Separa sola las fotos de la fiesta de las fotos del campo.' },

  { clave: 'refuerzo', emoji: '🎯', palabra: 'Aprendizaje por refuerzo', ciclo: 2,
    corta: 'Aprende probando, con premio cuando le sale bien.',
    definicion: 'La máquina prueba, recibe un premio cuando le sale bien y nada cuando le sale mal, y va cambiando lo que hace para ganar más premios. Aprende jugando miles de partidas contra sí misma.',
    ejemplo: 'Un programa que aprende a jugar ajedrez perdiendo millones de veces primero.' },

  { clave: 'sesgo', emoji: '⚖️', palabra: 'Sesgo', ciclo: 2,
    corta: 'Se equivoca con lo que no estaba en sus ejemplos.',
    definicion: 'Cuando los ejemplos con que se entrenó están mal repartidos, la máquina falla justo con lo que faltaba. No es que la máquina sea mala: es que alguien eligió mal los ejemplos. La pregunta que hay que hacerse siempre es quién los eligió.',
    ejemplo: 'Entrenada solo con manzanas y peras, para ella un nance no existe.' },

  { clave: 'algoritmo', emoji: '🧩', palabra: 'Algoritmo', ciclo: 3,
    corta: 'La receta de pasos que la máquina sigue.',
    definicion: 'La receta de pasos que la máquina sigue para resolver algo. En la Inteligencia Artificial, el algoritmo no dice la respuesta: dice cómo buscar el patrón en los ejemplos.',
    ejemplo: 'La receta para separar dos grupos trazando una raya entre ellos.' },

  { clave: 'red', emoji: '🕸️', palabra: 'Red neuronal', ciclo: 3,
    corta: 'Muchas cuentitas conectadas, inspiradas en el cerebro.',
    definicion: 'Un montón de operaciones pequeñas conectadas en capas, inspiradas de lejos en cómo se conectan las neuronas. Cada conexión tiene un número que se va ajustando al entrenar. No es un cerebro: es aritmética, mucha y muy rápida.',
    ejemplo: 'Con redes se reconocen caras, voces y letras manuscritas.' },

  { clave: 'modelo', emoji: '📐', palabra: 'Modelo', ciclo: 3,
    corta: 'Lo que queda guardado después de entrenar.',
    definicion: 'Lo que queda guardado cuando el entrenamiento termina: los números que la máquina ajustó. Usar el modelo no es entrenarlo. El modelo no guarda los ejemplos: guarda lo que sacó de ellos.',
    ejemplo: 'El traductor de tu teléfono lleva un modelo dentro, ya entrenado.' },

  { clave: 'generativa', emoji: '✨', palabra: 'IA generativa', ciclo: 3,
    corta: 'La que produce texto, imagen, voz o video nuevos.',
    definicion: 'La Inteligencia Artificial que no solo clasifica sino que PRODUCE: escribe un texto, dibuja una imagen, imita una voz o arma un video que antes no existían. Los arma prediciendo qué pedacito va después, uno por uno.',
    ejemplo: 'Un chat que te escribe un párrafo sobre lo que le pidas.' },

  { clave: 'modelolenguaje', emoji: '💬', palabra: 'Modelo de lenguaje', ciclo: 3,
    corta: 'Predice la palabra siguiente. No consulta nada.',
    definicion: 'Un programa entrenado con muchísimo texto que predice cuál es la palabra siguiente más probable, y luego la siguiente, y la siguiente. No busca en una enciclopedia ni comprueba nada: completa. Por eso escribe igual de seguro cuando acierta que cuando inventa.',
    ejemplo: 'Es el teclado que adivina tu palabra siguiente, pero muchísimo más grande.' },

  { clave: 'alucinacion', emoji: '🌀', palabra: 'Alucinación', ciclo: 3,
    corta: 'Cuando inventa un dato y lo dice con seguridad.',
    definicion: 'Cuando un modelo de lenguaje se inventa un dato, un nombre, una fecha o una fuente, y lo escribe con la misma seguridad que lo verdadero. No está mintiendo: está haciendo lo suyo, que es completar texto. El que tiene que verificar eres tú.',
    ejemplo: 'Te da el nombre de un libro que suena perfecto y que no existe.' },

  { clave: 'peticion', emoji: '🧱', palabra: 'Petición', ciclo: 3,
    corta: 'Lo que le pides, con sus cuatro piezas.',
    definicion: 'El encargo que se le escribe a una IA generativa. Sale mejor cuando lleva sus cuatro piezas: el contexto (quién eres y para qué), la tarea (qué quieres), el formato (cómo lo quieres) y un ejemplo de lo que esperas.',
    ejemplo: '«Soy alumno de séptimo. Explicame la fotosíntesis en cinco viñetas cortas.»' },

  { clave: 'deepfake', emoji: '🎭', palabra: 'Falsificación profunda', ciclo: 3,
    corta: 'Una foto, voz o video fabricados que parecen reales.',
    definicion: 'Una foto, un audio o un video hechos con Inteligencia Artificial para que parezcan de una persona de verdad. En inglés se le dice deepfake. Se usan para estafar, para humillar y para desinformar, y cada vez cuesta más notarlos a simple vista.',
    ejemplo: 'Un audio con la voz de alguien de tu familia pidiendo dinero.' },

  { clave: 'verificar', emoji: '🔎', palabra: 'Verificar', ciclo: 3,
    corta: 'Comprobar el dato en una fuente que responde por él.',
    definicion: 'Comprobar un dato en una fuente que responde por él: el libro, la ley, la página de la institución, la persona que lo sabe. Verificar no es preguntarle otra vez a la misma máquina, ni buscar si suena parecido: es ir al documento.',
    ejemplo: 'Si te da un artículo de una ley, buscas la ley y lees ese artículo.' },

  { clave: 'privacidad', emoji: '🔒', palabra: 'Privacidad', ciclo: 3,
    corta: 'Lo tuyo es tuyo, y lo que subes puede quedarse.',
    definicion: 'El derecho a que lo tuyo sea tuyo: tu nombre, tu cara, tu casa, tu familia, lo que escribes. Lo que se le escribe a un servicio en internet puede quedar guardado en otra computadora, y lo que queda guardado ya no lo controlas tú.',
    ejemplo: 'Nunca subas fotos de otros niños ni datos de tu familia.' },
];

/* Lo que una máquina NO es. Va aparte de los conceptos porque no es vocabulario:
   es lo que hay que desarmar antes de enseñar nada. El error de creer que la
   máquina «entiende» es del que salen todos los demás, incluido creerle el dato
   inventado. La misión de I Ciclo lo enseña con estas mismas palabras. */
const IA_MITOS = [
  { mito: 'La máquina piensa como tú.',            verdad: 'Hace cuentas muy rápido con lo que le enseñaron. No entiende lo que dice.' },
  { mito: 'La máquina siente, se cansa o se enoja.', verdad: 'No siente nada. Ni alegría, ni sueño, ni cariño. Es un aparato.' },
  { mito: 'La máquina sabe todo lo que le preguntes.', verdad: 'Solo sabe de lo que le enseñaron, y a veces se inventa el resto.' },
  { mito: 'La máquina nunca se equivoca.',           verdad: 'Se equivoca, y más con lo que no estaba en sus ejemplos.' },
  { mito: 'La máquina es mágica.',                   verdad: 'Son datos y matemática. Alguien la hizo y alguien eligió sus ejemplos.' },
  { mito: 'La máquina es tu amiga y puedes contarle todo.', verdad: 'Lo que le cuentas puede quedar guardado. Las cosas de tu familia no se cuentan.' },
];

/* Las tres reglas de oro del alumno. Son de I Ciclo y se repiten en las cuatro
   etapas, sin cambiarles una palabra: en III Ciclo dejan de ser una advertencia
   y pasan a tener su explicación, pero son las mismas tres. */
const IA_REGLAS_ORO = [
  { emoji: '🔒', regla: 'No le doy mis datos ni los de mi familia.',
    porque: 'Nombre completo, dirección, teléfono, la escuela, fotos de otros niños. Lo que se manda a internet puede quedarse guardado.' },
  { emoji: '🔎', regla: 'No le creo sin comprobar.',
    porque: 'La máquina contesta con la misma seguridad cuando sabe y cuando se lo inventa. El dato se busca en el libro o se le pregunta a quien lo sabe.' },
  { emoji: '🧑‍🏫', regla: 'Si algo me asusta o me confunde, le aviso a una persona grande.',
    porque: 'Un mensaje raro, una foto que no debería estar, alguien que te pide algo. Eso no se resuelve solo.' },
];

/* Dónde la tiene ya encima el alumno, hoy. La lista es corta a propósito: son
   las que puede reconocer en el teléfono de su casa o de su maestro, no un
   catálogo de la industria. Y no se nombra ninguna empresa: el alumno reconoce
   LA TAREA, que es lo que no envejece. */
const IA_APLICACIONES = [
  { emoji: '🎙️', que: 'Dictar un mensaje', como: 'La máquina convierte tu voz en letras porque oyó millones de voces antes.' },
  { emoji: '📷', que: 'La cámara que encuentra caras', como: 'Aprendió qué forma tiene una cara con muchísimas fotos.' },
  { emoji: '🌐', que: 'Traducir un letrero', como: 'Vio el mismo texto escrito en dos idiomas, millones de veces.' },
  { emoji: '🔤', que: 'El teclado que adivina la palabra', como: 'Predice la palabra siguiente: es un modelo de lenguaje chiquito.' },
  { emoji: '🎵', que: 'La música que te recomienda', como: 'Te agrupa con gente que oye parecido y te ofrece lo que a ellos les gustó.' },
  { emoji: '🗺️', que: 'La ruta más rápida', como: 'Aprende de cuánto tardaron otros por ese mismo camino.' },
  { emoji: '🌽', que: 'Reconocer la plaga de un cultivo', como: 'Con fotos de hojas sanas y de hojas enfermas, etiquetadas por personas.' },
  { emoji: '💬', que: 'Un chat que escribe textos', como: 'Predice la palabra siguiente, una por una, hasta armar el párrafo.' },
];

/* Los cinco pasos para verificar lo que una IA te dijo. Van numerados porque se
   copian en el cuaderno y se usan en ese orden: el paso 1 descarta la mitad de
   los casos sin gastar internet, que en un pueblo es lo que hay. */
const IA_VERIFICA = [
  { n: 1, paso: 'Separa el dato de la explicación.', detalle: 'Lo que hay que verificar son los nombres, las fechas, los números y las fuentes. La explicación se juzga con la cabeza.' },
  { n: 2, paso: '¿Te suena posible?', detalle: 'Compara con lo que ya sabes y con lo que dice tu libro. Un dato que contradice todo lo que viste necesita una fuente muy buena.' },
  { n: 3, paso: 'Busca la fuente original.', detalle: 'El libro, la ley, la página de la institución. No sirve otra página que repita lo mismo sin decir de dónde lo sacó.' },
  { n: 4, paso: 'Si cita algo, comprueba que exista.', detalle: 'Un libro, un artículo o una ley inventados es el error más común. Que el título suene bien no prueba nada.' },
  { n: 5, paso: 'Si no puedes verificarlo, no lo uses.', detalle: 'Ni en la tarea, ni en el examen, ni compartiéndolo. Un dato sin comprobar que se comparte ya es desinformación.' },
];

/* Las cuatro piezas de una buena petición. Están aquí y no dentro de la misión
   porque la ficha impresa las lleva iguales, y porque son lo único de esta ruta
   que el alumno va a usar HOY mismo si tiene un teléfono a la mano. */
const IA_PIEZAS_PETICION = [
  { emoji: '👤', pieza: 'Contexto', pregunta: '¿Quién eres y para qué lo quieres?', ejemplo: 'Soy alumno de séptimo grado en Honduras.' },
  { emoji: '🎯', pieza: 'Tarea',    pregunta: '¿Qué quieres exactamente?',        ejemplo: 'Explicame qué es la fotosíntesis.' },
  { emoji: '📐', pieza: 'Formato',  pregunta: '¿Cómo lo quieres?',                ejemplo: 'En cinco viñetas cortas y con palabras sencillas.' },
  { emoji: '🧩', pieza: 'Ejemplo',  pregunta: '¿A qué se tiene que parecer?',    ejemplo: 'Como se lo explicarías a alguien de quinto grado.' },
];

/* Se exporta para las sondas, que corren en Node. En el navegador no estorba. */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IA_CONCEPTOS, IA_MITOS, IA_REGLAS_ORO, IA_APLICACIONES, IA_VERIFICA, IA_PIEZAS_PETICION };
}
