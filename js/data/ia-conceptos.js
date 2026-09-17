/* ─────────────────────────────────────────────────────────────────────────
   El vocabulario de la Ruta de la Máquina que Aprende, en UN solo sitio.

   Por qué existe este archivo, y por qué las misiones lo leen en vez de
   escribir sus definiciones: son misiones seguidas de la misma ruta y el
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

   ⚠️ Y CÓMO SE ESCRIBE, que también es normativa (16 de septiembre de 2026):
   frases de una idea, ninguna de más de 25 palabras, ningún campo de más de 45.
   Esto lo lee un niño de cuarto grado en un teléfono. Una definición de cuarenta
   palabras con dos incisos no se lee: se salta, y entonces no define nada.

   El marco y el porqué de la materia entera están en
   CURRICULA-INTELIGENCIA-ARTIFICIAL.md.
   ───────────────────────────────────────────────────────────────────────── */

/* Los conceptos. `ciclo` dice en qué etapa de la ruta SE ESTRENA cada uno, no
   en cuál se usa: los de I Ciclo vuelven a salir en III, con más adentro. */
const IA_CONCEPTOS = [
  { clave: 'ia', emoji: '🧠', palabra: 'Inteligencia Artificial', ciclo: 1,
    corta: 'Una máquina que hace cosas de personas.',
    definicion: 'Programas que hacen tareas de personas: reconocer una cara, entender lo que dictas, traducir un letrero, escribir un texto. No piensan: calculan.',
    ejemplo: 'Le dictas y el teléfono escribe.' },

  { clave: 'maquina', emoji: '⚙️', palabra: 'Máquina', ciclo: 1,
    corta: 'Una cosa que hicieron personas para un trabajo.',
    definicion: 'La fabricaron personas para hacer un trabajo. No nace ni muere. Se enciende y se apaga.',
    ejemplo: 'Un molino, un ventilador, un teléfono.' },

  { clave: 'instruccion', emoji: '📋', palabra: 'Instrucción', ciclo: 1,
    corta: 'Una orden que la máquina obedece.',
    definicion: 'Es clara y se obedece sin preguntar. Un programa son muchas instrucciones seguidas.',
    ejemplo: '«Enciende la luz», «espera 5 segundos», «apágala».' },

  { clave: 'ejemplo', emoji: '🍎', palabra: 'Ejemplo', ciclo: 1,
    corta: 'Una cosa que le mostramos para que aprenda.',
    definicion: 'Puede ser una foto, un sonido o una frase. Con pocos se equivoca; con muchos acierta más.',
    ejemplo: 'Mil fotos de nances, para que reconozca uno.' },

  { clave: 'dato', emoji: '📦', palabra: 'Dato', ciclo: 2,
    corta: 'Un pedacito de información que se guarda.',
    definicion: 'Un número, una palabra, una foto o un sonido, guardado. Los datos son la comida de la Inteligencia Artificial.',
    ejemplo: 'El peso de una naranja. El color de un nance.' },

  { clave: 'etiqueta', emoji: '🏷️', palabra: 'Etiqueta', ciclo: 2,
    corta: 'El nombre correcto de un ejemplo.',
    definicion: 'La pone una persona antes de enseñarle el ejemplo. Sin ella, la máquina no sabe de qué es la foto.',
    ejemplo: 'A esta foto, «nance»; a esta otra, «anona».' },

  { clave: 'entrenar', emoji: '🏋️', palabra: 'Entrenar', ciclo: 2,
    corta: 'Mostrarle ejemplos hasta que aprenda el patrón.',
    definicion: 'Se le muestran ejemplos con su etiqueta hasta que encuentra el patrón. Se hace una vez y cuesta tiempo.',
    ejemplo: 'Diez mil fotos hasta que separe nances de anonas.' },

  { clave: 'patron', emoji: '🔁', palabra: 'Patrón', ciclo: 2,
    corta: 'Lo que se repite en muchos ejemplos.',
    definicion: 'Sirve para reconocer cosas nuevas. La máquina no entiende lo que ve: usa lo que se repite.',
    ejemplo: 'Los nances casi siempre son pequeños y amarillos.' },

  { clave: 'prueba', emoji: '🧪', palabra: 'Prueba', ciclo: 2,
    corta: 'Examinarla con ejemplos que nunca vio.',
    definicion: 'Si acierta con lo nuevo, aprendió el patrón. Si falla, solo se acordó de lo que vio.',
    ejemplo: 'Le enseñamos 100 fotos y la probamos con 20.' },

  { clave: 'error', emoji: '❌', palabra: 'Error', ciclo: 2,
    corta: 'Las veces que la máquina se equivoca.',
    definicion: 'Ninguna acierta el 100 %. En ese pedacito de error puede haber una persona.',
    ejemplo: 'Si acierta 9 de cada 10, falla 1.' },

  { clave: 'supervisado', emoji: '🏷️', palabra: 'Aprendizaje supervisado', ciclo: 2,
    corta: 'Aprende con ejemplos que traen su respuesta.',
    definicion: 'Los ejemplos ya traen puesta su etiqueta. Es como estudiar con el solucionario al lado.',
    ejemplo: 'Hojas con su etiqueta «sana» o «con plaga».' },

  { clave: 'nosupervisado', emoji: '🗂️', palabra: 'Aprendizaje no supervisado', ciclo: 2,
    corta: 'Agrupa sola lo que se parece.',
    definicion: 'Recibe ejemplos SIN etiqueta y los junta por parecido. No sabe cómo se llama cada grupo.',
    ejemplo: 'Separa sola las fotos de la fiesta y del campo.' },

  { clave: 'refuerzo', emoji: '🎯', palabra: 'Aprendizaje por refuerzo', ciclo: 2,
    corta: 'Aprende probando, con premio si le sale bien.',
    definicion: 'Gana un premio cuando le sale bien y nada cuando le sale mal. Va cambiando para ganar más.',
    ejemplo: 'Aprende ajedrez perdiendo millones de partidas primero.' },

  { clave: 'sesgo', emoji: '⚖️', palabra: 'Sesgo', ciclo: 2,
    corta: 'Se equivoca con lo que faltó en sus ejemplos.',
    definicion: 'Sus ejemplos estaban mal repartidos y falla con lo que faltaba. Alguien eligió mal: pregúntate quién.',
    ejemplo: 'Entrenada solo con manzanas y peras, un nance no existe.' },

  { clave: 'algoritmo', emoji: '🧩', palabra: 'Algoritmo', ciclo: 3,
    corta: 'La receta de pasos que la máquina sigue.',
    definicion: 'No dice la respuesta: dice cómo buscar el patrón en los ejemplos.',
    ejemplo: 'La receta para separar dos grupos con una raya.' },

  { clave: 'red', emoji: '🕸️', palabra: 'Red neuronal', ciclo: 3,
    corta: 'Muchas cuentitas conectadas, como en el cerebro.',
    definicion: 'Muchas cuentas pequeñas en capas. Cada conexión lleva un número que se ajusta al entrenar. No es un cerebro.',
    ejemplo: 'Con redes se reconocen caras, voces y letras.' },

  { clave: 'modelo', emoji: '📐', palabra: 'Modelo', ciclo: 3,
    corta: 'Lo que queda guardado después de entrenar.',
    definicion: 'Son los números que la máquina ajustó. No guarda los ejemplos: guarda lo que sacó de ellos.',
    ejemplo: 'El traductor de tu teléfono lleva uno dentro.' },

  { clave: 'generativa', emoji: '✨', palabra: 'IA generativa', ciclo: 3,
    corta: 'La que produce texto, imagen, voz o video.',
    definicion: 'No solo clasifica: PRODUCE. Escribe un texto, dibuja una imagen, imita una voz. Predice qué pedacito va después.',
    ejemplo: 'Un chat que te escribe un párrafo.' },

  { clave: 'modelolenguaje', emoji: '💬', palabra: 'Modelo de lenguaje', ciclo: 3,
    corta: 'Predice la palabra siguiente. No consulta nada.',
    definicion: 'Lo entrenaron con muchísimo texto. Predice una palabra, y luego la siguiente. No comprueba nada: completa.',
    ejemplo: 'El teclado que adivina tu palabra, mucho más grande.' },

  { clave: 'alucinacion', emoji: '🌀', palabra: 'Alucinación', ciclo: 3,
    corta: 'Inventa un dato y lo dice con seguridad.',
    definicion: 'Se inventa un dato, un nombre o una fecha. Y lo escribe igual de seguro que lo verdadero. No miente: completa.',
    ejemplo: 'Te da el nombre de un libro que no existe.' },

  { clave: 'peticion', emoji: '🧱', palabra: 'Petición', ciclo: 3,
    corta: 'Lo que le pides, con sus cuatro piezas.',
    definicion: 'Es el encargo que le escribes a una IA generativa. Las cuatro piezas: contexto, tarea, formato y ejemplo.',
    ejemplo: '«Soy alumno de séptimo. Explicame la fotosíntesis en cinco viñetas cortas.»' },

  { clave: 'deepfake', emoji: '🎭', palabra: 'Falsificación profunda', ciclo: 3,
    corta: 'Foto, voz o video fabricados que parecen reales.',
    definicion: 'Foto, audio o video hechos con Inteligencia Artificial para que parezcan de una persona real. En inglés, deepfake. Sirven para estafar, humillar y desinformar.',
    ejemplo: 'Un audio con la voz de tu mamá pidiendo dinero.' },

  { clave: 'verificar', emoji: '🔎', palabra: 'Verificar', ciclo: 3,
    corta: 'Comprobar el dato en una fuente que responde.',
    definicion: 'Se busca en el libro, en la ley o con la persona que lo sabe. No es preguntarle otra vez a la máquina.',
    ejemplo: 'Si te cita una ley, la buscas y la lees.' },

  { clave: 'privacidad', emoji: '🔒', palabra: 'Privacidad', ciclo: 3,
    corta: 'Lo tuyo es tuyo. Lo que subes se queda.',
    definicion: 'Tu nombre, tu cara, tu casa, tu familia. Lo que subes puede quedar guardado en otra computadora.',
    ejemplo: 'Nunca subas fotos de otros niños.' },
];

/* Lo que una máquina NO es. Va aparte de los conceptos porque no es vocabulario:
   es lo que hay que desarmar antes de enseñar nada. El error de creer que la
   máquina «entiende» es del que salen todos los demás, incluido creerle el dato
   inventado. La misión de I Ciclo lo enseña con estas mismas palabras. */
const IA_MITOS = [
  { mito: 'La máquina piensa como tú.',            verdad: 'Hace cuentas muy rápido con lo que le enseñaron. No entiende lo que dice.' },
  { mito: 'La máquina siente, se cansa o se enoja.', verdad: 'No siente nada. Ni alegría, ni sueño, ni cariño. Es un aparato.' },
  { mito: 'La máquina sabe todo lo que le preguntes.', verdad: 'Solo sabe de lo que le enseñaron. El resto a veces se lo inventa.' },
  { mito: 'La máquina nunca se equivoca.',           verdad: 'Se equivoca, y más con lo que no estaba en sus ejemplos.' },
  { mito: 'La máquina es mágica.',                   verdad: 'Son datos y matemática. Alguien la hizo y eligió sus ejemplos.' },
  { mito: 'La máquina es tu amiga y puedes contarle todo.', verdad: 'Lo que le cuentas puede quedar guardado. Lo de tu familia no se cuenta.' },
];

/* Las tres reglas de oro del alumno. Son de I Ciclo y se repiten en las etapas
   que enseñan a USARLA, sin cambiarles una palabra: en III Ciclo dejan de ser
   una advertencia y pasan a tener su explicación, pero son las mismas tres. */
const IA_REGLAS_ORO = [
  { emoji: '🔒', regla: 'No le doy mis datos ni los de mi familia.',
    porque: 'Ni nombre completo, ni dirección, ni teléfono, ni la escuela, ni fotos de otros niños. Lo que se manda a internet puede quedarse.' },
  { emoji: '🔎', regla: 'No le creo sin comprobar.',
    porque: 'Contesta igual de segura cuando sabe y cuando se lo inventa. El dato se busca en el libro o con quien lo sabe.' },
  { emoji: '🧑‍🏫', regla: 'Si algo me asusta o me confunde, le aviso a una persona grande.',
    porque: 'Un mensaje raro, una foto que no debería estar, alguien que te pide algo. Eso no se resuelve solo.' },
];

/* Dónde la tiene ya encima el alumno, hoy. La lista es corta a propósito: son
   las que puede reconocer en el teléfono de su casa o de su maestro, no un
   catálogo de la industria. Y no se nombra ninguna empresa: el alumno reconoce
   LA TAREA, que es lo que no envejece. */
const IA_APLICACIONES = [
  { emoji: '🎙️', que: 'Dictar un mensaje', como: 'Oyó millones de voces antes de oír la tuya.' },
  { emoji: '📷', que: 'La cámara que encuentra caras', como: 'Aprendió qué forma tiene una cara con muchísimas fotos.' },
  { emoji: '🌐', que: 'Traducir un letrero', como: 'Vio el mismo texto en dos idiomas, millones de veces.' },
  { emoji: '🔤', que: 'El teclado que adivina la palabra', como: 'Predice la palabra siguiente: es un modelo de lenguaje chiquito.' },
  { emoji: '🎵', que: 'La música que te recomienda', como: 'Te junta con gente que oye parecido y te ofrece lo que a ellos les gustó.' },
  { emoji: '🗺️', que: 'La ruta más rápida', como: 'Aprende de cuánto tardaron otros por ese camino.' },
  { emoji: '🌽', que: 'Reconocer la plaga de un cultivo', como: 'Con fotos de hojas sanas y enfermas, etiquetadas por personas.' },
  { emoji: '💬', que: 'Un chat que escribe textos', como: 'Predice la palabra siguiente, una por una, hasta el párrafo.' },
];

/* Los cinco pasos para verificar lo que una IA te dijo. Van numerados porque se
   copian en el cuaderno y se usan en ese orden: el paso 1 descarta la mitad de
   los casos sin gastar internet, que en un pueblo es lo que hay. */
const IA_VERIFICA = [
  { n: 1, paso: 'Separa el dato de la explicación.', detalle: 'Se verifican los nombres, las fechas, los números y las fuentes. La explicación se juzga con la cabeza.' },
  { n: 2, paso: '¿Te suena posible?', detalle: 'Compáralo con lo que sabes y con tu libro. Si contradice todo, necesita una fuente muy buena.' },
  { n: 3, paso: 'Busca la fuente original.', detalle: 'El libro, la ley, la página de la institución. Otra página que repite lo mismo no sirve.' },
  { n: 4, paso: 'Si cita algo, comprueba que exista.', detalle: 'Un libro o una ley inventados son el error más común. Que el título suene bien no prueba nada.' },
  { n: 5, paso: 'Si no puedes verificarlo, no lo uses.', detalle: 'Ni en la tarea, ni en el examen, ni compartiéndolo. Compartir un dato sin comprobar es desinformación.' },
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
