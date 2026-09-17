/* ─────────────────────────────────────────────────────────────────────────
   La historia de la Inteligencia Artificial, en UN solo sitio.

   Aquí lo que se copia son FECHAS, y una fecha equivocada no se nota: se pinta
   igual de bien en la pantalla y en la ficha, y el alumno la estudia y la
   escribe en el examen. Por eso los hitos viven aquí y la misión los PINTA, y
   por eso `node _dev/verifica-ia.js` compara la ficha impresa contra
   este archivo, hito por hito.

   ⚠️ DE DÓNDE SALE CADA FECHA, Y LA REGLA QUE NO SE SALTA.
   Este repositorio no tiene una biblioteca de historia de la computación como
   tiene el DCNB en `_dev/dcnb-pdf/` o las leyes en `_dev/leyes/`. Así que aquí
   se aplica la misma regla que dejó fuera los números de decreto de la flor y
   del árbol nacionales, y la fecha de nacimiento de José Trinidad Reyes:

   1. Cada hito trae en `acredita` el DOCUMENTO o el HECHO PÚBLICO que lo
      sostiene: un artículo publicado con su revista, una propuesta con su
      nombre, una partida de ajedrez con su rival. No «lo dice internet».
   2. Donde la fecha exacta se discute, SE ESCRIBE LA DÉCADA. Los dos inviernos
      de la IA no tienen un día de inicio ni de final en el que estén de acuerdo
      los que lo cuentan, así que van como períodos y se dice que son períodos.
   3. Nada de cifras de producto: cuántos usuarios, cuántos parámetros, cuánto
      costó. Eso cambia cada mes, no se puede acreditar desde aquí, y la ficha
      se guarda un año en una gaveta.

   El día que entre a `_dev/` una fuente que acredite más, se amplía. Mientras
   tanto, lo que no se puede acreditar no se escribe. Buscar no es leer.

   ⚠️ Y CÓMO SE ESCRIBE, que es la otra mitad y se midió el 16 de septiembre de
   2026 con `node _dev/mide-legibilidad.js`. Esto lo lee un alumno de cuarto
   grado y también uno de bachillerato: frases cortas, una idea por frase, y
   ningún campo de más de 45 palabras —`que`, `porque`, `acredita`, `texto`—,
   porque cada campo se pinta como UN párrafo en un teléfono. El nombre del
   documento que acredita NO se recorta: se recorta lo que lo envuelve.
   ───────────────────────────────────────────────────────────────────────── */

/* Las cuatro edades en que se parte la historia. Sirven para colorear la línea
   del tiempo y para que el alumno vea que esto no fue una línea recta. */
const IA_EPOCAS = [
  { clave: 'antes',   nombre: 'Antes de que tuviera nombre', rango: '1936 a 1955', emoji: '🌱',
    resumen: 'Nace la máquina que calcula cualquier cosa. Y la pregunta: ¿podría pensar?' },
  { clave: 'nace',    nombre: 'Nace la Inteligencia Artificial', rango: '1956 a 1969', emoji: '🎉',
    resumen: 'Estrena nombre y llega el entusiasmo: se cree que pronto habrá máquinas que piensen.' },
  { clave: 'invierno', nombre: 'Los dos inviernos', rango: 'años setenta y finales de los ochenta', emoji: '❄️',
    resumen: 'Se prometió de más. Se acabó el dinero y el campo casi se para. Dos veces.' },
  { clave: 'deshielo', nombre: 'El deshielo y la explosión', rango: '1997 hasta hoy', emoji: '🚀',
    resumen: 'Por fin se juntan las tres cosas: datos, cómputo y algoritmos. Y todo se acelera.' },
];

/* Los hitos. `anio` es el año que se estudia; `orden` los pone en la línea del
   tiempo aunque un período no tenga un año exacto. */
const IA_HITOS = [
  { orden: 1, anio: '1936', epoca: 'antes', emoji: '📐',
    titulo: 'La máquina que puede calcular cualquier cosa',
    quien: 'Alan Turing',
    que: 'Describe una máquina imaginaria que sigue instrucciones y hace cualquier cálculo. De ahí sale la computadora.',
    porque: 'Todo cuelga de aquí: primero hubo que demostrar que una máquina puede calcularlo todo.',
    acredita: 'Artículo «On Computable Numbers, with an Application to the Entscheidungsproblem», en Proceedings of the London Mathematical Society.' },

  { orden: 2, anio: '1943', epoca: 'antes', emoji: '🕸️',
    titulo: 'La primera neurona de papel',
    quien: 'Warren McCulloch y Walter Pitts',
    que: 'Publican un modelo matemático de una neurona: recibe entradas, las suma y se activa o no.',
    porque: 'Es el abuelo de las redes de hoy: no copian el cerebro, copian esto.',
    acredita: 'Artículo «A Logical Calculus of the Ideas Immanent in Nervous Activity», en Bulletin of Mathematical Biophysics.' },

  { orden: 3, anio: '1950', epoca: 'antes', emoji: '❓',
    titulo: 'La pregunta: «¿pueden pensar las máquinas?»',
    quien: 'Alan Turing',
    que: 'Pregunta si las máquinas pueden pensar. Luego la cambia por otra que sí se puede probar: conversar a ciegas sin notar que es máquina. Es el juego de imitación.',
    porque: 'Es el acta de nacimiento de la idea. Turing no dijo que piense: dijo que se mire lo que HACE.',
    acredita: 'Artículo «Computing Machinery and Intelligence», en la revista Mind.' },

  { orden: 4, anio: '1956', epoca: 'nace', emoji: '🏷️',
    titulo: 'El nombre: «Inteligencia Artificial»',
    quien: 'John McCarthy y el taller de Dartmouth',
    que: 'Unos investigadores pasan un verano en el Dartmouth College, sobre máquinas que aprenden. Ahí se escribe el término por primera vez.',
    porque: 'Un campo sin nombre no existe. Ese año lo preguntan todos los exámenes.',
    acredita: 'La propuesta escrita del «Dartmouth Summer Research Project on Artificial Intelligence».' },

  { orden: 5, anio: '1958', epoca: 'nace', emoji: '👁️',
    titulo: 'El perceptrón: la primera máquina que aprendió sola',
    quien: 'Frank Rosenblatt',
    que: 'Construye un aparato que separa dos clases de figuras. Ajusta los números solo: ve ejemplos y se corrige.',
    porque: 'Es el antepasado del teléfono que reconoce caras. Y el primer aviso: se prometió de más.',
    acredita: 'Artículo «The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain», en Psychological Review.' },

  { orden: 6, anio: '1959', epoca: 'nace', emoji: '🎲',
    titulo: 'Un programa que le gana a quien lo escribió',
    quien: 'Arthur Samuel',
    que: 'Escribe un programa que juega damas. Mejora jugando, hasta ganarle a él. Le pone nombre: aprendizaje de máquina.',
    porque: 'Una máquina llega más lejos que su autor. No es más lista: practica millones de veces.',
    acredita: 'Artículo «Some Studies in Machine Learning Using the Game of Checkers», en IBM Journal of Research and Development.' },

  { orden: 7, anio: '1966', epoca: 'nace', emoji: '💬',
    titulo: 'ELIZA, la que parecía escuchar',
    quien: 'Joseph Weizenbaum',
    que: 'Escribe un programa que conversa: devuelve en pregunta lo que le dicen. No entiende nada, y la gente le contaba cosas íntimas.',
    porque: 'Contestar como una persona no es entender. Vale igual para los chats de hoy.',
    acredita: 'Artículo «ELIZA: A Computer Program For the Study of Natural Language Communication Between Man And Machine», en Communications of the ACM.' },

  { orden: 8, anio: 'años setenta', epoca: 'invierno', emoji: '❄️',
    titulo: 'El primer invierno',
    quien: 'Todo el campo',
    que: 'Se prometió traducción automática y máquinas que razonan en pocos años. No llegaron. Los informes fueron duros, se cortó el dinero y cerraron laboratorios.',
    porque: 'La técnica no falló: falló una promesa. Al cortarse el dinero, lo perdieron todos.',
    acredita: 'Es un período, no una fecha: va como década. Están documentados los informes críticos y el recorte de fondos.' },

  { orden: 9, anio: 'años ochenta', epoca: 'invierno', emoji: '🧾',
    titulo: 'Los sistemas expertos, y el segundo invierno',
    quien: 'La industria',
    que: 'Se venden programas con las reglas de un experto: «si la fiebre es alta, entonces…». Mantenerlas a mano sale carísimo y no aprenden solos. El negocio cae.',
    porque: 'Un sistema experto SIGUE reglas de una persona. El aprendizaje de máquina SACA la regla de los ejemplos.',
    acredita: 'Es un período. El mercado de los sistemas expertos está documentado; su final se cuenta por años, no por un día.' },

  { orden: 10, anio: '1997', epoca: 'deshielo', emoji: '♟️',
    titulo: 'Una máquina le gana al campeón mundial de ajedrez',
    quien: 'Deep Blue, de IBM, contra Garri Kaspárov',
    que: 'En una revancha a seis partidas, la computadora gana al campeón mundial. No aprendía: calculaba muchísimas jugadas por segundo.',
    porque: 'Ese día el público vio que esto iba en serio. Se puede ganar sin entender nada.',
    acredita: 'El enfrentamiento se jugó en público, en Nueva York, y está documentado partida por partida.' },

  { orden: 11, anio: '2012', epoca: 'deshielo', emoji: '🖼️',
    titulo: 'El año en que las máquinas aprendieron a ver',
    quien: 'El equipo de AlexNet, en el concurso ImageNet',
    que: 'Una red neuronal profunda gana el concurso de reconocer imágenes. La entrenaron con tarjetas gráficas y un millón de fotos etiquetadas.',
    porque: 'Arranca el aprendizaje profundo, con la receta entera: datos etiquetados, cómputo barato y buen algoritmo. Faltando una, no pasa.',
    acredita: 'El artículo «ImageNet Classification with Deep Convolutional Neural Networks» y los resultados publicados del concurso ILSVRC de ese año.' },

  { orden: 12, anio: '2016', epoca: 'deshielo', emoji: '⚫',
    titulo: 'AlphaGo gana al Go, que se creía imposible',
    quien: 'AlphaGo contra Lee Sedol',
    que: 'Un programa gana al mejor jugador de Go. El Go tiene demasiadas jugadas para calcularlas todas. Aprendió jugando millones de partidas contra sí mismo.',
    porque: 'Es el aprendizaje por refuerzo en una foto: aprender probando y premiándose. Y una jugada suya sorprendió a los expertos.',
    acredita: 'El enfrentamiento se jugó en público, en Seúl, y está documentado partida por partida.' },

  { orden: 13, anio: '2017', epoca: 'deshielo', emoji: '🔧',
    titulo: 'El motor de lo que usamos hoy',
    quien: 'Un equipo de investigadores en un artículo',
    que: 'Se presenta una manera nueva de armar redes de texto: se entrenan más rápido y con muchísimo más texto. Se llama transformador.',
    porque: 'Todos los chats de IA generativa de hoy salen de aquí. El público no se enteró hasta cinco años después.',
    acredita: 'El artículo «Attention Is All You Need», presentado en la conferencia NeurIPS de ese año.' },

  { orden: 14, anio: '2022', epoca: 'deshielo', emoji: '💥',
    titulo: 'La IA generativa llega al teléfono de todos',
    quien: 'El público, por primera vez',
    que: 'En noviembre se abre al público un chat de IA generativa, gratis y fácil. Lo prueba muchísima gente. Detrás está la idea de 2017, entrenada en grande.',
    porque: 'Salió de los laboratorios y entró en las tareas escolares. Un maestro corrige textos que no sabe de dónde salen.',
    acredita: 'La apertura al público está documentada con fecha. Cuánta gente lo usó no se escribe: esa cifra cambia y no se acredita.' },

  { orden: 15, anio: 'de 2023 a hoy', epoca: 'deshielo', emoji: '🎥',
    titulo: 'Deja de ser solo texto',
    quien: 'La industria entera',
    que: 'Los modelos trabajan también con imagen, voz y video. Describen una foto. Arman un video. Imitan una voz con pocos segundos.',
    porque: 'Las falsificaciones profundas dejan el cine y pasan al teléfono de cualquiera.',
    acredita: 'Es un período abierto. Va sin nombres de producto: cualquier lista envejece antes de que se fotocopie la ficha.' },
];

/* Las tres cosas que tuvieron que juntarse. Es la explicación de por qué esto
   se aceleró de golpe después de setenta años, y es lo que de verdad hay que
   entender: ninguna de las tres sola habría bastado. */
const IA_TRES_PATAS = [
  { emoji: '📚', pata: 'Datos',
    que: 'Millones de fotos, textos y grabaciones. Muchos con su etiqueta, puesta por personas.',
    antes: 'Antes de internet, juntar un millón de fotos etiquetadas era imposible.' },
  { emoji: '⚡', pata: 'Cómputo',
    que: 'Las tarjetas gráficas se hicieron para los videojuegos. Servían justo para entrenar redes.',
    antes: 'Con las computadoras de los ochenta, un entrenamiento de hoy tardaría siglos.' },
  { emoji: '🧩', pata: 'Algoritmos',
    que: 'Maneras nuevas de armar y entrenar redes. Aprovechan los datos y el cómputo que ya había.',
    antes: 'Las ideas de los ochenta se estancaban: no aprendían más por darles más.' },
];

/* Lo que enseñan los inviernos. Va aparte porque no es un hito: es lo que
   queda de ellos, y es la parte de esta misión que sirve fuera de la
   informática. */
const IA_LECCION_INVIERNOS = {
  titulo: 'Lo que enseñan los dos inviernos',
  texto: 'Las dos veces pasó lo mismo. No falló la tecnología: se prometió de más. Al no llegar la promesa, se cortó el dinero también para los que iban bien. Quien promete de más pierde la confianza, y recuperarla cuesta una generación.',
  hoy: 'Hoy se promete mucho otra vez. Saberlo sirve para preguntar, no para creer ni para burlarse.' };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IA_EPOCAS, IA_HITOS, IA_TRES_PATAS, IA_LECCION_INVIERNOS };
}
