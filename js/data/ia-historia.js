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
   ───────────────────────────────────────────────────────────────────────── */

/* Las cuatro edades en que se parte la historia. Sirven para colorear la línea
   del tiempo y para que el alumno vea que esto no fue una línea recta. */
const IA_EPOCAS = [
  { clave: 'antes',   nombre: 'Antes de que tuviera nombre', rango: '1936 a 1955', emoji: '🌱',
    resumen: 'Se inventa la idea de máquina que calcula cualquier cosa, y alguien se atreve a preguntar si podría pensar.' },
  { clave: 'nace',    nombre: 'Nace la Inteligencia Artificial', rango: '1956 a 1969', emoji: '🎉',
    resumen: 'El campo estrena nombre y llega el entusiasmo: se cree que en pocos años habrá máquinas que piensen.' },
  { clave: 'invierno', nombre: 'Los dos inviernos', rango: 'años setenta y finales de los ochenta', emoji: '❄️',
    resumen: 'Se había prometido más de lo que se podía cumplir. Se acabó el dinero y el campo casi se para. Dos veces.' },
  { clave: 'deshielo', nombre: 'El deshielo y la explosión', rango: '1997 hasta hoy', emoji: '🚀',
    resumen: 'Se juntan por fin las tres cosas que hacían falta: datos, cómputo y algoritmos. Y todo se acelera.' },
];

/* Los hitos. `anio` es el año que se estudia; `orden` los pone en la línea del
   tiempo aunque un período no tenga un año exacto. */
const IA_HITOS = [
  { orden: 1, anio: '1936', epoca: 'antes', emoji: '📐',
    titulo: 'La máquina que puede calcular cualquier cosa',
    quien: 'Alan Turing',
    que: 'Describe en un artículo una máquina imaginaria que, siguiendo instrucciones, puede hacer cualquier cálculo que se pueda hacer. Es la idea de la que sale la computadora.',
    porque: 'Antes de preguntarse si una máquina puede pensar, alguien tuvo que demostrar que una sola máquina puede hacer cualquier cuenta. Todo lo demás cuelga de ahí.',
    acredita: 'El artículo «On Computable Numbers, with an Application to the Entscheidungsproblem», publicado en los Proceedings of the London Mathematical Society.' },

  { orden: 2, anio: '1943', epoca: 'antes', emoji: '🕸️',
    titulo: 'La primera neurona de papel',
    quien: 'Warren McCulloch y Walter Pitts',
    que: 'Publican un modelo matemático de cómo podría funcionar una neurona: recibe entradas, las suma y se activa o no.',
    porque: 'Es el abuelo de las redes neuronales de hoy. Una red neuronal no copia el cerebro: copia esta idea de 1943, que ya era una simplificación enorme.',
    acredita: 'El artículo «A Logical Calculus of the Ideas Immanent in Nervous Activity», en el Bulletin of Mathematical Biophysics.' },

  { orden: 3, anio: '1950', epoca: 'antes', emoji: '❓',
    titulo: 'La pregunta: «¿pueden pensar las máquinas?»',
    quien: 'Alan Turing',
    que: 'Publica un artículo que empieza con esa pregunta y propone cambiarla por otra que sí se puede probar: si una persona conversa a ciegas con una máquina y no logra distinguirla de otra persona, ¿qué más da? Se le conoce como el juego de imitación.',
    porque: 'Es el acta de nacimiento de la idea. Y es más fino de lo que parece: Turing no dijo que la máquina piense. Dijo que discutir eso no lleva a ningún lado y propuso mirar lo que HACE.',
    acredita: 'El artículo «Computing Machinery and Intelligence», publicado en la revista Mind.' },

  { orden: 4, anio: '1956', epoca: 'nace', emoji: '🏷️',
    titulo: 'El nombre: «Inteligencia Artificial»',
    quien: 'John McCarthy y el taller de Dartmouth',
    que: 'Un grupo de investigadores se junta un verano en el Dartmouth College para trabajar sobre la idea de que una máquina puede simular el aprendizaje. En la propuesta de ese taller aparece escrito por primera vez el término.',
    porque: 'Un campo sin nombre no existe. Desde ese verano hay algo que se llama así, y ese es el año que se pregunta en todos los exámenes.',
    acredita: 'La propuesta escrita del «Dartmouth Summer Research Project on Artificial Intelligence».' },

  { orden: 5, anio: '1958', epoca: 'nace', emoji: '👁️',
    titulo: 'El perceptrón: la primera máquina que aprendió sola',
    quien: 'Frank Rosenblatt',
    que: 'Construye un aparato que aprende a separar dos clases de figuras ajustando números por su cuenta, a base de ver ejemplos y corregirse.',
    porque: 'Es el primer antepasado directo de lo que hoy hace tu teléfono al reconocer una cara. Y también el primer aviso: se dijo que pronto caminaría y hablaría, y no.',
    acredita: 'El artículo «The Perceptron: A Probabilistic Model for Information Storage and Organization in the Brain», en Psychological Review.' },

  { orden: 6, anio: '1959', epoca: 'nace', emoji: '🎲',
    titulo: 'Un programa que le gana a quien lo escribió',
    quien: 'Arthur Samuel',
    que: 'Escribe un programa que juega damas y que va mejorando jugando partidas, hasta jugar mejor que él. Le pone nombre a lo que hace: aprendizaje de máquina.',
    porque: 'Es la demostración de que una máquina puede llegar más lejos que su autor en una tarea. No porque sea más lista: porque practica millones de veces.',
    acredita: 'El artículo «Some Studies in Machine Learning Using the Game of Checkers», en el IBM Journal of Research and Development.' },

  { orden: 7, anio: '1966', epoca: 'nace', emoji: '💬',
    titulo: 'ELIZA, la que parecía escuchar',
    quien: 'Joseph Weizenbaum',
    que: 'Escribe un programa que conversa devolviendo lo que le dicen en forma de pregunta. Es muy simple y no entiende nada. Pero la gente le contaba cosas íntimas y algunos se negaban a creer que no era una persona.',
    porque: 'Es la lección más útil de esta misión, y tiene sesenta años: que algo conteste como una persona NO significa que entienda. Su propio autor se asustó de lo que pasó.',
    acredita: 'El artículo «ELIZA: A Computer Program For the Study of Natural Language Communication Between Man And Machine», en Communications of the ACM.' },

  { orden: 8, anio: 'años setenta', epoca: 'invierno', emoji: '❄️',
    titulo: 'El primer invierno',
    quien: 'Todo el campo',
    que: 'Se había prometido traducción automática y máquinas que razonan en pocos años, y no llegaron. Los informes oficiales fueron duros, el dinero se cortó y muchos laboratorios cerraron.',
    porque: 'No fue un problema técnico: fue una promesa que no se cumplió. Cuando alguien promete de más, lo que se pierde no es el producto, es la confianza, y con ella el financiamiento de los que sí iban bien.',
    acredita: 'Es un período, no una fecha: por eso va como década y no como año. Lo que sí está documentado son los informes críticos del período y el recorte de fondos que siguió.' },

  { orden: 9, anio: 'años ochenta', epoca: 'invierno', emoji: '🧾',
    titulo: 'Los sistemas expertos, y el segundo invierno',
    quien: 'La industria',
    que: 'Se venden programas que guardan las reglas de un experto («si la fiebre es alta y hay manchas, entonces…») y aconsejan como él. Funcionan en lo suyo, pero mantener miles de reglas a mano resulta carísimo y no aprenden nada solos. A finales de la década el negocio se cae.',
    porque: 'Aquí se ve clarísima la diferencia que enseña toda esta ruta: un sistema experto SIGUE reglas que una persona escribió; el aprendizaje de máquina SACA la regla de los ejemplos. Lo primero no escala; lo segundo sí.',
    acredita: 'Es un período. Los sistemas expertos y su mercado están documentados; el final del auge se cuenta por años, no por un día.' },

  { orden: 10, anio: '1997', epoca: 'deshielo', emoji: '♟️',
    titulo: 'Una máquina le gana al campeón mundial de ajedrez',
    quien: 'Deep Blue, de IBM, contra Garri Kaspárov',
    que: 'En una revancha a seis partidas, la computadora gana el enfrentamiento al campeón mundial. No aprendía como las de hoy: calculaba muchísimas jugadas por segundo.',
    porque: 'Es el día en que el público entendió que esto iba en serio. Y enseña algo que sigue valiendo: se puede ganar sin entender nada, a puro cálculo.',
    acredita: 'El enfrentamiento se jugó en público, en Nueva York, y está documentado partida por partida.' },

  { orden: 11, anio: '2012', epoca: 'deshielo', emoji: '🖼️',
    titulo: 'El año en que las máquinas aprendieron a ver',
    quien: 'El equipo de AlexNet, en el concurso ImageNet',
    que: 'Una red neuronal profunda, entrenada con tarjetas gráficas sobre un millón de fotos etiquetadas, gana el concurso de reconocimiento de imágenes bajando el error muchísimo de golpe.',
    porque: 'Es el arranque del aprendizaje profundo, y es donde se ve la receta completa: MUCHOS datos etiquetados, MUCHO cómputo barato y un algoritmo bueno. Faltando una de las tres, no pasa.',
    acredita: 'El artículo «ImageNet Classification with Deep Convolutional Neural Networks» y los resultados publicados del concurso ILSVRC de ese año.' },

  { orden: 12, anio: '2016', epoca: 'deshielo', emoji: '⚫',
    titulo: 'AlphaGo gana al Go, que se creía imposible',
    quien: 'AlphaGo contra Lee Sedol',
    que: 'Un programa gana un enfrentamiento al mejor jugador de Go de su tiempo. El Go tiene tantas jugadas posibles que no se puede ganar calculándolas todas: el programa aprendió jugando contra sí mismo, millones de partidas.',
    porque: 'Es el aprendizaje por refuerzo enseñado en una foto: aprender probando y premiándose. Y una de sus jugadas sorprendió a los expertos humanos, que es otra cosa distinta a calcular rápido.',
    acredita: 'El enfrentamiento se jugó en público, en Seúl, y está documentado partida por partida.' },

  { orden: 13, anio: '2017', epoca: 'deshielo', emoji: '🔧',
    titulo: 'El motor de lo que usamos hoy',
    quien: 'Un equipo de investigadores en un artículo',
    que: 'Se presenta una manera nueva de construir redes para trabajar con texto, que permite entrenarlas mucho más rápido y con muchísimo más texto. Se llama transformador.',
    porque: 'Todos los chats de IA generativa que se usan hoy descienden de este artículo. Es la pieza técnica que separa el «antes» del «después», aunque el público no se enteró hasta cinco años más tarde.',
    acredita: 'El artículo «Attention Is All You Need», presentado en la conferencia NeurIPS de ese año.' },

  { orden: 14, anio: '2022', epoca: 'deshielo', emoji: '💥',
    titulo: 'La IA generativa llega al teléfono de todos',
    quien: 'El público, por primera vez',
    que: 'En noviembre se abre al público un chat de IA generativa gratuito y fácil de usar, y en pocas semanas lo está probando muchísima gente en todo el mundo. Detrás no había una idea nueva: había la de 2017, entrenada en grande.',
    porque: 'Es cuando esto dejó de ser cosa de laboratorios y entró en las tareas escolares. Desde ese mes, un maestro que no sabe qué es esto está corrigiendo textos que no sabe de dónde salen.',
    acredita: 'La apertura al público está documentada con fecha. A propósito NO se escribe cuánta gente lo usó: esa cifra cambia y no se puede acreditar desde aquí.' },

  { orden: 15, anio: 'de 2023 a hoy', epoca: 'deshielo', emoji: '🎥',
    titulo: 'Deja de ser solo texto',
    quien: 'La industria entera',
    que: 'Los modelos pasan a trabajar también con imagen, voz y video: se les enseña una foto y la describen, se les pide un video y lo arman, imitan una voz con pocos segundos de grabación.',
    porque: 'Es lo que hace que las falsificaciones profundas dejen de ser cosa de cine y pasen a ser cosa de un teléfono. Por eso la etapa 4 de esta ruta existe.',
    acredita: 'Es un período abierto y por eso va fechado y sin nombres de producto: cualquier lista concreta que se escriba aquí envejece antes de que se fotocopie la ficha.' },
];

/* Las tres cosas que tuvieron que juntarse. Es la explicación de por qué esto
   se aceleró de golpe después de setenta años, y es lo que de verdad hay que
   entender: ninguna de las tres sola habría bastado. */
const IA_TRES_PATAS = [
  { emoji: '📚', pata: 'Datos',
    que: 'Millones de fotos, textos y grabaciones, y muchos de ellos con su etiqueta puesta por personas.',
    antes: 'Antes de internet, juntar un millón de fotos etiquetadas era imposible.' },
  { emoji: '⚡', pata: 'Cómputo',
    que: 'Las tarjetas gráficas, hechas para los videojuegos, resultaron ser justo lo que servía para entrenar redes.',
    antes: 'Con las computadoras de los años ochenta, un entrenamiento de hoy tardaría siglos.' },
  { emoji: '🧩', pata: 'Algoritmos',
    que: 'Maneras nuevas de armar y entrenar las redes, que aprovechan los datos y el cómputo que ya había.',
    antes: 'Las ideas de los años ochenta se estancaban al crecer: no aprendían más por darles más.' },
];

/* Lo que enseñan los inviernos. Va aparte porque no es un hito: es la moraleja,
   y es la parte de esta misión que sirve fuera de la informática. */
const IA_LECCION_INVIERNOS = {
  titulo: 'Lo que enseñan los dos inviernos',
  texto: 'Las dos veces pasó lo mismo, y no fue que la tecnología fallara: fue que se prometió más de lo que se podía cumplir y en menos tiempo del que hacía falta. Cuando la promesa no llegó, se cortó el dinero para todos, también para los que iban bien. La lección no es de computadoras: quien promete de más no pierde el producto, pierde la confianza, y recuperarla cuesta una generación.',
  hoy: 'Hoy se vuelve a prometer mucho. Saber que esto ya pasó dos veces es lo que te deja escuchar una promesa y preguntar, en vez de creer o de burlarte.' };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { IA_EPOCAS, IA_HITOS, IA_TRES_PATAS, IA_LECCION_INVIERNOS };
}
