/* ============================================================
   M.E.T.A.S · Misión Leer para investigar · CONTENIDO
   ------------------------------------------------------------
   Aquí solo hay datos: lo que la misión dice, pregunta y guarda. Ni
   una función. Quien pinta las pantallas, lleva el XP y arma el examen
   es el motor compartido (js/motor-mision.js).

   Para corregir un dato de esta misión se toca ESTE archivo y nada más.

   ► PARA QUIÉN ES. Español, primer parcial (febrero y marzo), de 7.º a
     9.º grado, con un apartado «Para Media» (10.º y 11.º). Cada
     pregunta del examen dice su `grado` y, en `curriculo`, la página de la
     programación o del DCNB de donde sale.

   ► DE DÓNDE SALE CADA COSA (todo está en `_dev/`):
     · Prog. 7-9 = `_dev/dcnb-pdf/programacion-espanol-7-9.pdf`, la
       programación mensual de SEDUC. Febrero y marzo: 7.º en la p. 7 del
       PDF (síntesis: resúmenes, sinopsis; esquemas y planes; citas
       bibliográficas; fichas bibliográficas; uso del diccionario), 8.º
       en la p. 15 (partes del libro, su función y su uso: glosario,
       capítulos, bibliografía; el comentario crítico, resúmenes,
       sinopsis; citas bibliográficas; fichas bibliográficas y
       hemerográficas; diccionarios especializados) y 9.º en la p. 23
       (textos de consulta: diccionarios, atlas y enciclopedias
       especializadas; la investigación fuera del libro: periódicos,
       revistas, otros, con sus etapas analítica, interpretativa y
       evaluativa; fichas bibliográficas y hemerográficas; resúmenes).
     · DCNB = `_dev/dcnb-pdf/dcneb-basica-iii-ciclo.pdf` (página del
       visor). pp. 88, 121 y 162: las tres etapas de la lectura
       (estructural o analítica; interpretativa: entender el contenido,
       desentrañar ideas, seleccionar ideas, reflexionar sobre lo leído;
       crítica o evaluativa: síntesis, evaluación y emisión de juicios);
       las partes del libro (portada, índice, introducción, prólogo,
       cuerpo, bibliografía, glosario, anexo o apéndice; la contraportada;
       en 8.º, capítulos; en 9.º, epílogo); la prelectura (conjeturar a
       partir de las partes externas del libro); la lectura general y la
       segunda lectura por párrafos, las formas para destacar lo relevante
       y la toma de notas; releer; el diccionario y el contexto (el sentido
       de la frase en que está la palabra). pp. 89, 122 y 163: el resumen
       textual (subrayan las ideas fundamentales después de haberlas
       entendido), el resumen parafraseado (ordenan lo subrayado y lo
       redactan con sus propias palabras), la sinopsis en llaves, y las
       gráficas, tablas y mapas conceptuales; los juicios con argumentos
       sólidos sobre aquello con lo que se está de acuerdo o en
       desacuerdo; la actitud objetiva o subjetiva del autor; la atención,
       la concentración, la observación y la memoria; las preguntas que
       orientan la investigación (¿qué?, ¿dónde?, ¿cuándo?, ¿cómo?, ¿por
       qué?). pp. 90, 123 y 164: las fichas bibliográficas (libros) y
       hemerográficas (revistas o periódicos); el párrafo (idea principal
       e ideas secundarias); las fichas de trabajo, «jerarquización de la
       información» (de cita textual, de resumen textual, de resumen
       parafraseado y de comentario personal); las predicciones y el
       propósito de la lectura; la investigación fuera del libro (folletos,
       periódicos, revistas, internet, entrevistas). pp. 91, 124 y 165:
       los textos de consulta (el diccionario, el de sinónimos y
       antónimos, la enciclopedia, el diccionario enciclopédico, los
       diccionarios especializados y el atlas), la bibliografía del
       informe y la biblioteca del aula. p. 93: el orden alfabético y el
       fichero de la biblioteca. pp. 92 y 166: hecho y opinión; guiar la
       lectura por el título, el autor, la fuente y el contenido. pp. 95,
       131 y 171: esquemas o planes (temas y subtemas) y las citas
       bibliográficas «al pie de página y/o en el contexto».
     · Para Media: `_dev/dcnb/programa-espanol-10.md` (RA3: la lectura y
       sus técnicas; ideas principales y secundarias; técnicas de
       síntesis; las Normas APA, 7.ª edición: citación y referencias
       bibliográficas) y `_dev/dcnb/programa-espanol-11-bch.md` (CE1.2:
       reportes de lectura, comentarios, síntesis; pasos para hacer una
       investigación; Normas APA).

   ► LOS CRUCES CON OTRAS MATERIAS, y de dónde sale su dato:
     · Ciencias Naturales: el descubrimiento de la célula (Robert Hooke,
       1665, el trozo de corcho, los cuartitos que llamó celdas; que lo
       que vio eran las cubiertas de células ya muertas; que la teoría
       celular la construyeron varios científicos y que toda célula
       proviene de otra), de la misión La Célula
       (misiones/2y3ciclo-la-celula/). Los colores de las alertas (verde,
       amarillo y rojo), de la misión Desastres Naturales.
     · Ciencias Sociales: los cuatro viajes de Colón (1492, 1493, 1498 y
       1502) y adónde llegó cada uno, de `js/data/viajes-colon.js`, con
       sus mismas palabras y sin el día de ningún desembarco, que ese
       archivo deja fuera a propósito.
     · Matemáticas: la tabla y la gráfica como técnicas de síntesis; la
       tabla de los viajes usa solo los cuatro años de arriba.
     · Cívica: la ficha bibliográfica de la Constitución NO se hizo. Sus
       datos de edición no están en `_dev/leyes/` (el plan los da por
       pendientes de verificar) y una ficha con datos supuestos enseña
       mal. Queda para cuando la Constitución esté en el repositorio.
     · El atlas (9.º) va como texto de consulta, con preguntas de «dónde
       lo buscas»; no afirma ningún dato de geografía.

   ► REDACCIÓN NUESTRA (no está definido en `_dev/`; el DCNB lo NOMBRA y
     manda usarlo, no lo define):
     · Para qué sirve cada parte del libro (portada, contraportada,
       índice, introducción, prólogo, cuerpo y capítulos, glosario,
       bibliografía, anexo o apéndice, epílogo). El DCNB da la lista y
       dice «su función»; la función de cada una está dicha aquí con
       palabras nuestras, las de uso corriente en la escuela.
     · Qué datos lleva la ficha bibliográfica (autor, título, editorial,
       lugar y año) y la hemerográfica (nombre del periódico o revista,
       fecha, título del artículo, autor y página). La programación solo
       las nombra, y el plan manda usarlas «tal como las nombra la
       programación»: por eso aquí no se enseña un ORDEN ni una
       puntuación obligatoria (eso lo fija cada docente, y en Media, APA),
       y el examen pregunta qué datos lleva y para qué sirve, nunca en qué
       orden van.
     · Qué es una cita textual (palabras exactas, entre comillas y
       diciendo de quién son), un comentario crítico (opinión sobre lo
       leído sostenida con razones; el DCNB dice «juicios con argumentos
       sólidos») y una sinopsis (el DCNB dice «sinopsis en llaves»: aquí
       es el esquema que ordena las ideas con llaves).
     · Qué es cada texto de consulta (diccionario, de sinónimos y
       antónimos, especializado, enciclopedia, atlas), el folleto, el
       fichero, la editorial, el subrayado, la gráfica, el mapa
       conceptual y el esquema.
     · El consejo ante una fuente dudosa (fijarse en quién lo dice, dónde
       y cuándo se publicó, y compararlo con otra fuente). El DCNB manda
       guiarse por «título, autor/a, fuente y contenido» (p. 166); el
       resto es consejo nuestro.
     · «Copiar sin decir de quién es» se dice así, sin la palabra
       «plagio», que no está en la programación ni en el DCNB.

   ► LO QUE SE DEJÓ FUERA:
     · El formato APA: es de Media y no hay norma en `_dev/`. La tarjeta
       «Para Media» solo lo nombra.
     · El diccionario enciclopédico y los índices de autores, de materias
       y de ilustraciones: el DCNB los nombra; aquí no se preguntan.
     · El libro del laboratorio («Un mundo que no se ve») NO EXISTE: se
       inventó para la misión con su autora, su editorial, su prólogo y su
       bibliografía, y la pantalla lo dice. Lo único cierto de ese libro
       es lo que cuenta de la célula, que sale de la misión La Célula.
     · Los nombres de alumnos y las escenas (Génesis, Kevin, Dania…) son
       inventados.

   ⚠️ El orden de cada banco del examen no se cambia una vez aprobado:
   decide qué preguntas caen en cada forma. Esta misión nació con sus 50
   formas y todavía no tiene nada congelado (espera el visto bueno).

   Va como declaraciones de JavaScript y no como un archivo .json porque
   los guiones de la página leen SAVE_KEY, xp y done en cuanto carga, y
   Campeonísimo busca el banco de selección múltiple por su declaración.
   Por eso mismo, en estos comentarios no se escribe una declaración de
   ejemplo: el lector la tomaría por la de verdad.
   ============================================================ */

// ===================== TEXTOS PROPIOS DE LA MISIÓN =====================
const TEXTOS={
  titulo:'Leer para investigar',
  emoji:'🔎',
  materia:'Español',
  confeti:['#0f766e','#4ba89f','#d97706','#f59e0b','#fde68a'],
  impresion:{acento:'#c49000',fondo:'#fef9e7'},
  rutaEtiqueta:'Secuencia',
  widgetIdentifica:{paso:'Pista',fin:'🎉 ¡Todas las pistas resueltas!'},
  tareaIdentifica:['Copia cada oración en tu cuaderno y subraya la parte del libro, la ficha o la técnica de síntesis que se nombra. Escribe al lado para qué sirve.','<strong>Ejemplo:</strong> Busqué «postulado» en el glosario del libro. → <span style="color:var(--jade);font-weight:700;">Glosario: explica las palabras difíciles</span>'],
  tareaClasifica:{instruccion:'Copia la siguiente tabla en tu cuaderno. Para cada fuente, escribe qué clase de fuente es, en qué ficha se registra, para qué te sirve y qué datos anotarías.',columnas:['Fuente','¿Qué es?','Ficha','¿Para qué sirve?','Datos que anotas']},
  diploma:['¡Sigue leyendo e investigando!','¡Muy buen trabajo!','¡Ya sabes dónde buscar cada cosa!','¡Resumes con tus palabras y dices de dónde salió cada dato!','¡Maestro de la investigación!']
};

// ===================== IDENTIDAD Y GUARDADO =====================
const SAVE_KEY='n4_leer_para_investigar_v1';
const MXP=200;
const TOTAL_SECTIONS=13;

// ===================== LOGROS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'🔎',label:'Primer quiz de la investigación superado'},
  flash_master:{icon:'🃏',label:'Todas las tarjetas de la investigación exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de fuentes y de fichas'},
  id_master:{icon:'🔍',label:'Cazador de las partes del libro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de la biblioteca'},
  nivel3:{icon:'📝',label:'¡Tomas buenas notas! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Investigador! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de la investigación dominados'}
};

// ===================== NIVELES =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Lector curioso 📖'},{t:55,n:'Tomador de notas 📝'},{t:90,n:'Fichador 🗃️'},{t:130,n:'Resumidor ✂️'},{t:165,n:'Investigador 🔎'},{t:190,n:'Maestro de la investigación 🏆'}];

// ===================== TARJETAS =====================
const fcData=[
  {w:'Etapa estructural o analítica',a:'🧱 La primera etapa de la lectura: <strong>conoces el libro por sus partes</strong> antes de leerlo entero. Miras la portada, el índice y cómo está dividido, y decides si te sirve.'},
  {w:'Etapa interpretativa',a:'💡 La segunda etapa: <strong>entiendes el contenido</strong>. Lees, relees, desentrañas las ideas, seleccionas las que te sirven y reflexionas sobre lo leído.'},
  {w:'Etapa crítica o evaluativa',a:'⚖️ La tercera etapa: <strong>sintetizas</strong> (resumen, sinopsis, mapa conceptual), <strong>evalúas</strong> lo leído y <strong>das tu juicio</strong>, con razones.'},
  {w:'Portada e índice',a:'📕 La <strong>portada</strong> dice el título de la obra, quién la escribió y quién la publicó. El <strong>índice</strong> dice en qué página empieza cada parte: es el mapa del libro.'},
  {w:'Prólogo e introducción',a:'🚪 Van antes del cuerpo del libro. El <strong>prólogo</strong> presenta la obra (a veces lo escribe otra persona). La <strong>introducción</strong> anuncia de qué tratará.'},
  {w:'Glosario',a:'🔤 Lista de <strong>palabras difíciles con su significado</strong>, casi siempre al final del libro. Te ahorra salir a buscar un diccionario.'},
  {w:'Bibliografía',a:'📚 Lista de <strong>los libros y demás obras que se consultaron</strong> para escribir un trabajo. Tu informe también lleva la suya.'},
  {w:'Idea principal e ideas secundarias',a:'🎯 En un párrafo, la <strong>idea principal</strong> dice lo más importante: si la quitas, el párrafo ya no se entiende. Las <strong>secundarias</strong> la explican o la amplían.'},
  {w:'Ficha bibliográfica',a:'🗃️ Registra un <strong>libro</strong> que consultaste: autor, título, editorial, lugar y año. Sirve para decir de dónde salió cada dato y para armar la bibliografía.'},
  {w:'Ficha hemerográfica',a:'📰 Registra un artículo de <strong>periódico o de revista</strong>: nombre de la publicación, fecha, título del artículo, autor y página.'},
  {w:'Resumen textual y parafraseado',a:'✂️ <strong>Textual:</strong> subrayas las ideas fundamentales, después de entenderlas. <strong>Parafraseado:</strong> ordenas lo subrayado y lo redactas <strong>con tus propias palabras</strong>.'},
  {w:'Sinopsis',a:'🗝️ Esquema que ordena las ideas <strong>con llaves</strong>, de lo general a lo particular, para verlas de un vistazo.'},
  {w:'Cita textual',a:'❝ Las <strong>palabras exactas</strong> de un autor, entre comillas y diciendo de quién son. Va dentro del texto o al pie de la página.'},
  {w:'Comentario crítico',a:'💬 Tu <strong>opinión sobre lo leído, sostenida con razones</strong>. Puedes estar de acuerdo o en desacuerdo con el autor, pero dices por qué.'},
];

// ===================== QUIZ =====================
const qzData=[
  {q:'¿Cuáles son las tres etapas de la lectura?',o:['a) Portada, índice y glosario','b) Estructural, interpretativa y evaluativa','c) Resumen, cita y comentario','d) Libro, periódico y revista'],c:1},
  {q:'¿Qué parte de un libro te dice en qué página empieza cada capítulo?',o:['a) El glosario','b) La bibliografía','c) El prólogo','d) El índice'],c:3},
  {q:'¿En qué ficha registras una noticia del periódico?',o:['a) En la hemerográfica','b) En la bibliográfica','c) En la de préstamo','d) En la médica'],c:0},
  {q:'Un resumen parafraseado se escribe…',o:['a) copiando el primer párrafo','b) con las palabras del autor, sin cambiar nada','c) con tus propias palabras','d) más largo que el texto'],c:2},
  {q:'¿Qué lleva una cita textual?',o:['a) Las palabras exactas del autor, entre comillas','b) Tu opinión sobre el autor','c) Un dibujo del libro','d) El precio de la obra'],c:0},
  {q:'¿Dónde buscas en qué departamento queda un río?',o:['a) En un diccionario de sinónimos','b) En un glosario','c) En un recibo','d) En un atlas'],c:3},
  {q:'«Creo que el texto es claro, porque pone ejemplos». Esa oración es…',o:['a) un resumen','b) una ficha','c) un comentario','d) un índice'],c:2},
  {q:'¿Qué idea no se puede quitar de un párrafo sin que deje de entenderse?',o:['a) Una secundaria','b) La principal','c) La más larga','d) La última'],c:1},
  {q:'¿Para qué anotas la fuente de cada dato?',o:['a) Para que el trabajo se vea más largo','b) Para adornar la portada','c) Para poder decir de dónde salió','d) Para no tener que leer'],c:2},
];

// ===================== CLASIFICA =====================
const classGroups=[
  {label:['Ficha bibliográfica','Ficha hemerográfica'],headA:'📚 Va en ficha bibliográfica',headB:'📰 Va en ficha hemerográfica',colA:'bib',colB:'hem',
   words:[{w:'Un libro de Ciencias',t:'bib'},{w:'El periódico de hoy',t:'hem'},{w:'Una novela',t:'bib'},{w:'Una revista de deportes',t:'hem'},{w:'Un atlas',t:'bib'},{w:'Una noticia del domingo',t:'hem'},{w:'Una enciclopedia',t:'bib'},{w:'Un artículo de revista',t:'hem'},{w:'Un diccionario',t:'bib'},{w:'El periódico escolar',t:'hem'}]},
  {label:['Resumen','Comentario'],headA:'✂️ Resumen: lo que dice el texto',headB:'💬 Comentario: lo que tú opinas',colA:'res',colB:'com',
   words:[{w:'«El texto cuenta cómo se descubrió la célula»',t:'res'},{w:'«Me parece claro, porque va paso a paso»',t:'com'},{w:'«Hooke miró un trozo de corcho»',t:'res'},{w:'«Creo que le faltan dibujos»',t:'com'},{w:'«Colón hizo cuatro viajes»',t:'res'},{w:'«No estoy de acuerdo con el final»',t:'com'},{w:'«El autor nombra tres alertas»',t:'res'},{w:'«Opino que el título confunde»',t:'com'},{w:'«El capítulo explica qué es un glosario»',t:'res'},{w:'«A mi juicio, exagera»',t:'com'}]},
  {label:['Diccionario','Atlas'],headA:'🔤 Lo buscas en un diccionario',headB:'🗺️ Lo buscas en un atlas',colA:'dic',colB:'atl',
   words:[{w:'Qué significa «prólogo»',t:'dic'},{w:'Dónde queda La Mosquitia',t:'atl'},{w:'Cómo se escribe «hemerográfica»',t:'dic'},{w:'Qué países rodean a Honduras',t:'atl'},{w:'Qué quiere decir «sinopsis»',t:'dic'},{w:'Por dónde pasa un río',t:'atl'},{w:'Si «apéndice» lleva tilde',t:'dic'},{w:'En qué departamento está un municipio',t:'atl'},{w:'Qué es un «folleto»',t:'dic'},{w:'Qué mar baña la costa norte',t:'atl'}]},
  {label:['Cita textual','Con tus palabras'],headA:'❝ Cita textual',headB:'🗣️ Dicho con tus palabras',colA:'cit',colB:'par',
   words:[{w:'Según el libro, «toda célula proviene de otra célula»',t:'cit'},{w:'El libro explica que las células nacen de otras células',t:'par'},{w:'La autora escribe: «Hooke las llamó celdas»',t:'cit'},{w:'La autora cuenta que Hooke les puso celdas',t:'par'},{w:'El texto dice: «Colón hizo cuatro viajes»',t:'cit'},{w:'El texto recuerda que Colón viajó cuatro veces',t:'par'},{w:'Dice el autor: «el rojo manda evacuar»',t:'cit'},{w:'El autor explica que con el rojo hay que salir',t:'par'},{w:'En la página 9 se lee: «Así se descubrió la célula»',t:'cit'},{w:'En la página 9 se cuenta cómo se descubrió la célula',t:'par'}]},
];

// ===================== IDENTIFICA =====================
const idData=[
  {s:['Busqué','la','palabra','en','el','glosario','del','libro.'],c:5,busca:'la parte que explica las palabras difíciles'},
  {s:['El','índice','dice','que','el','capítulo','empieza','en','la','página','21.'],c:1,busca:'la parte que dice en qué página está cada cosa'},
  {s:['En','la','portada','leí','el','nombre','de','la','autora.'],c:2,busca:'la parte donde va el título y quién lo escribió'},
  {s:['La','bibliografía','nombra','los','libros','que','la','autora','consultó.'],c:1,busca:'la lista de obras consultadas'},
  {s:['Una','maestra','presenta','la','obra','en','el','prólogo.'],c:7,busca:'el texto que presenta la obra antes de que empiece'},
  {s:['Los','mapas','del','libro','van','en','el','anexo.'],c:7,busca:'la parte que guarda lo que amplía el contenido'},
  {s:['Leí','el','capítulo','dos','y','lo','resumí.'],c:2,busca:'cada división numerada del cuerpo del libro'},
  {s:['Detrás,','en','la','contraportada,','viene','un','comentario','breve.'],c:3,busca:'la cara de atrás del libro'},
];

// ===================== COMPLETA =====================
// Los ocho datos son de un mismo libro inventado para la misión (el del
// laboratorio): por eso se repiten la autora y la editorial.
const cmpData=[
  {s:'En la ficha bibliográfica, «Zelaya, Marta Lidia» es el dato de la ___.',opts:['autora','editorial','ciudad'],c:0},
  {s:'En la ficha bibliográfica, «Un mundo que no se ve» es el ___ del libro.',opts:['año','título','lugar'],c:1},
  {s:'En la ficha bibliográfica, «Ediciones Pupitre» es la ___ que publicó el libro.',opts:['autora','página','editorial'],c:2},
  {s:'En la ficha bibliográfica, «Tegucigalpa» es el ___ donde se publicó.',opts:['lugar','título','capítulo'],c:0},
  {s:'En la ficha bibliográfica, «2024» es el ___ de publicación.',opts:['precio','año','tomo'],c:1},
  {s:'Como es un libro, lo registras en una ficha ___.',opts:['hemerográfica','médica','bibliográfica'],c:2},
  {s:'Todos esos datos los copias de la ___ del libro.',opts:['portada','última página del cuerpo','bibliografía'],c:0},
  {s:'Al final de tu trabajo, con todas tus fichas armas la ___.',opts:['portada','bibliografía','sinopsis'],c:1},
];

// ===================== WIDGETS =====================
// Widget 1: ordenar los pasos
const ordenaData=[
  {label:'Leer un libro para investigar',steps:['Miras la portada y el índice','Lees el capítulo que te sirve','Subrayas las ideas fundamentales','Las redactas con tus propias palabras','Das tu juicio, con razones']},
  {label:'Hacer un resumen parafraseado',steps:['Lees el texto completo','Lo relees hasta entenderlo','Subrayas las ideas fundamentales','Ordenas lo subrayado','Lo redactas con tus propias palabras']},
  {label:'Investigar un asunto',steps:['Decides qué quieres saber','Buscas libros, revistas y periódicos','Registras cada fuente en su ficha','Lees y tomas notas en fichas de trabajo','Ordenas la información en un esquema']},
];
// Widget 2: de la descripción al nombre
const describeData=[
  {desc:'Dice el título de la obra, quién la escribió y quién la publicó',ans:'Portada',opts:['Portada','Índice','Glosario','Bibliografía']},
  {desc:'Dice en qué página empieza cada parte del libro',ans:'Índice',opts:['Portada','Índice','Glosario','Bibliografía']},
  {desc:'Explica las palabras difíciles que usa el libro',ans:'Glosario',opts:['Portada','Índice','Glosario','Bibliografía']},
  {desc:'Nombra los libros y demás obras que se consultaron',ans:'Bibliografía',opts:['Portada','Índice','Glosario','Bibliografía']},
  {desc:'Da el significado de las palabras, en orden alfabético',ans:'Diccionario',opts:['Diccionario','Enciclopedia','Atlas','Diccionario de sinónimos y antónimos']},
  {desc:'Reúne artículos sobre muchos asuntos distintos',ans:'Enciclopedia',opts:['Diccionario','Enciclopedia','Atlas','Diccionario de sinónimos y antónimos']},
  {desc:'Es un libro de mapas',ans:'Atlas',opts:['Diccionario','Enciclopedia','Atlas','Diccionario de sinónimos y antónimos']},
  {desc:'Te da otras palabras que dicen lo mismo, y las que dicen lo contrario',ans:'Diccionario de sinónimos y antónimos',opts:['Diccionario','Enciclopedia','Atlas','Diccionario de sinónimos y antónimos']},
];
// Widget 3: de la nota a la clase de ficha de trabajo
const emparejaData=[
  {term:'«Toda célula proviene de otra célula» (Zelaya, página 12)',resp:'Ficha de cita textual',opts:['Ficha de cita textual','Ficha de resumen parafraseado','Ficha de comentario personal','Ficha hemerográfica']},
  {term:'El capítulo cuenta que Hooke vio en el corcho unos cuartitos y los llamó celdas',resp:'Ficha de resumen parafraseado',opts:['Ficha de cita textual','Ficha de resumen parafraseado','Ficha de comentario personal','Ficha hemerográfica']},
  {term:'Me parece que el capítulo se entiende bien, porque compara el corcho con un panal',resp:'Ficha de comentario personal',opts:['Ficha de cita textual','Ficha de resumen parafraseado','Ficha de comentario personal','Ficha hemerográfica']},
  {term:'Periódico escolar, 14 de marzo, «La feria del libro», página 3',resp:'Ficha hemerográfica',opts:['Ficha de cita textual','Ficha de resumen parafraseado','Ficha de comentario personal','Ficha hemerográfica']},
  {term:'«Así se descubrió la célula» (Zelaya, página 9)',resp:'Ficha de cita textual',opts:['Ficha de cita textual','Ficha de resumen parafraseado','Ficha de comentario personal','Ficha hemerográfica']},
];
// Widget 4: «¿cuál es la idea principal?»
const situacionData=[
  {term:'«La feria del libro duró tres días. El viernes llegaron las editoriales, el sábado hubo cuentacuentos y el domingo se premió al mejor lector».',resp:'La feria del libro duró tres días',opts:['La feria del libro duró tres días','El sábado hubo cuentacuentos','El domingo se premió al mejor lector','El viernes llegaron las editoriales']},
  {term:'«El atlas del aula está muy usado. Tiene la pasta rota, le faltan dos hojas y varios mapas están rayados».',resp:'El atlas del aula está muy usado',opts:['El atlas del aula está muy usado','Le faltan dos hojas','Varios mapas están rayados','Tiene la pasta rota']},
  {term:'«Colón hizo cuatro viajes. Salió en 1492, en 1493, en 1498 y en 1502. Solo en el último llegó a Honduras».',resp:'Colón hizo cuatro viajes',opts:['Colón hizo cuatro viajes','Salió en 1492','Solo en el último llegó a Honduras','Salió en 1498']},
  {term:'«Dania pidió prestados tres libros. Uno era de Ciencias, otro era un diccionario y el tercero, una novela».',resp:'Dania pidió prestados tres libros',opts:['Dania pidió prestados tres libros','Uno era de Ciencias','Otro era un diccionario','El tercero era una novela']},
  {term:'«Las alertas se avisan con colores. El verde dice que todo está normal, el amarillo pide atención y el rojo manda evacuar».',resp:'Las alertas se avisan con colores',opts:['Las alertas se avisan con colores','El verde dice que todo está normal','El rojo manda evacuar','El amarillo pide atención']},
  {term:'«El equipo repartió el trabajo. Josué buscó en la biblioteca, Keyla hizo las fichas y Marlon escribió el resumen».',resp:'El equipo repartió el trabajo',opts:['El equipo repartió el trabajo','Keyla hizo las fichas','Marlon escribió el resumen','Josué buscó en la biblioteca']},
];

// ===================== RETO =====================
const retoPairs=[
  {label:['Libro','Periódico o revista'],btnA:'📚 Ficha bibliográfica',btnB:'📰 Ficha hemerográfica',colA:'bib',colB:'hem',
   words:[{w:'Una novela',t:'bib'},{w:'El periódico de ayer',t:'hem'},{w:'Un atlas',t:'bib'},{w:'Una revista de ciencia',t:'hem'},{w:'Un diccionario',t:'bib'},{w:'Una noticia',t:'hem'},{w:'Una enciclopedia',t:'bib'},{w:'El periódico escolar',t:'hem'},{w:'Un libro de cuentos',t:'bib'},{w:'Un artículo de revista',t:'hem'}]},
  {label:['Resume','Opina'],btnA:'✂️ Resume',btnB:'💬 Opina',colA:'res',colB:'opi',
   words:[{w:'«El texto dice que…»',t:'res'},{w:'«Me parece que…»',t:'opi'},{w:'«El autor cuenta que…»',t:'res'},{w:'«Creo que…»',t:'opi'},{w:'«El capítulo explica…»',t:'res'},{w:'«No estoy de acuerdo…»',t:'opi'},{w:'«La lectura trata de…»',t:'res'},{w:'«A mi juicio…»',t:'opi'},{w:'«Según la autora…»',t:'res'},{w:'«Opino que…»',t:'opi'}]},
  {label:['Parte del libro','Texto de consulta'],btnA:'📕 Parte del libro',btnB:'🔎 Texto de consulta',colA:'par',colB:'con',
   words:[{w:'Portada',t:'par'},{w:'Diccionario',t:'con'},{w:'Índice',t:'par'},{w:'Atlas',t:'con'},{w:'Glosario',t:'par'},{w:'Enciclopedia',t:'con'},{w:'Prólogo',t:'par'},{w:'Diccionario de sinónimos',t:'con'},{w:'Bibliografía',t:'par'},{w:'Diccionario especializado',t:'con'}]},
];

// ===================== GENERADOR DE TAREAS =====================
const identifyTaskDB=[
  {s:'Antes de leer el libro, Dania revisó el índice para ver si hablaba de los volcanes.',type:'Parte del libro: índice (dice en qué página está cada cosa)'},
  {s:'Kevin no entendió «postulado» y fue al glosario, al final del libro.',type:'Parte del libro: glosario (explica las palabras difíciles)'},
  {s:'Keyla anotó en una ficha bibliográfica el autor, el título y la editorial.',type:'Ficha bibliográfica (registra un libro)'},
  {s:'Marlon registró la noticia del domingo en una ficha hemerográfica.',type:'Ficha hemerográfica (registra un periódico o una revista)'},
  {s:'Óscar ordenó los cuatro viajes de Colón en una sinopsis, con una llave.',type:'Técnica de síntesis: sinopsis'},
  {s:'Josué escribió con sus propias palabras lo que decía el capítulo: hizo un resumen parafraseado.',type:'Técnica de síntesis: resumen parafraseado'},
  {s:'Sara copió entre comillas una frase de la autora: hizo una cita textual.',type:'Cita textual (palabras exactas, entre comillas)'},
  {s:'Para saber dónde queda el río, el equipo abrió el atlas de la biblioteca.',type:'Texto de consulta: atlas (libro de mapas)'},
  {s:'En la portada del libro leyeron el nombre de la autora.',type:'Parte del libro: portada (título y autor)'},
  {s:'Al final de su informe, Génesis puso la bibliografía.',type:'Bibliografía (lista de las obras consultadas)'},
];
const classifyTaskDB=[
  {w:'Un libro de Ciencias Naturales',gen:'Libro',n:'Bibliográfica',g:'Para leer a fondo un asunto',t:'Autor, título, editorial, lugar y año'},
  {w:'La noticia de un periódico',gen:'Periódico',n:'Hemerográfica',g:'Para saber qué pasó hace poco',t:'Nombre del periódico, fecha, título, autor y página'},
  {w:'Un artículo de una revista',gen:'Revista',n:'Hemerográfica',g:'Para leer sobre un asunto con fotos y detalle',t:'Nombre de la revista, fecha, título, autor y página'},
  {w:'Un diccionario',gen:'Texto de consulta',n:'Bibliográfica',g:'Para saber qué significa una palabra',t:'Autor o institución, título, editorial, lugar y año'},
  {w:'Un atlas',gen:'Texto de consulta',n:'Bibliográfica',g:'Para saber dónde queda un lugar',t:'Título, editorial, lugar y año'},
  {w:'Una enciclopedia',gen:'Texto de consulta',n:'Bibliográfica',g:'Para hallar información general de muchos asuntos',t:'Título, editorial, lugar y año'},
  {w:'Un folleto del centro de salud',gen:'Folleto',n:'Bibliográfica',g:'Para leer rápido sobre un solo asunto',t:'Quién lo publicó, título, lugar y año'},
  {w:'El periódico escolar',gen:'Periódico',n:'Hemerográfica',g:'Para saber qué pasa en tu centro',t:'Nombre del periódico, fecha, título, autor y página'},
];
const completeTaskDB=[
  {s:'La primera etapa de la lectura es la estructural o ___.',opts:['analítica','final','rápida'],ans:'analítica'},
  {s:'La lista de palabras difíciles con su significado es el ___.',opts:['índice','glosario','prólogo'],ans:'glosario'},
  {s:'Un libro se registra en una ficha ___.',opts:['hemerográfica','bibliográfica','de préstamo'],ans:'bibliográfica'},
  {s:'Un artículo de periódico se registra en una ficha ___.',opts:['hemerográfica','bibliográfica','de trabajo'],ans:'hemerográfica'},
  {s:'El resumen que redactas con tus propias palabras es el resumen ___.',opts:['textual','parafraseado','copiado'],ans:'parafraseado'},
  {s:'Las palabras exactas de un autor van entre ___.',opts:['paréntesis','comillas','puntos'],ans:'comillas'},
  {s:'El libro de mapas se llama ___.',opts:['glosario','atlas','folleto'],ans:'atlas'},
  {s:'Un comentario crítico da una opinión y la sostiene con ___.',opts:['gritos','razones','dibujos'],ans:'razones'},
];
const explainQuestions=[
  {q:'Elige un libro de tu casa o de la biblioteca y haz su ficha bibliográfica. Después explica de qué parte del libro sacaste cada dato.',ans:'Respuesta abierta. Se valora que la ficha traiga el autor, el título, la editorial, el lugar y el año, y que diga que los tomó de la portada y de las primeras páginas del libro.'},
  {q:'Explica con tus palabras la diferencia entre un resumen y un comentario. Da un ejemplo de cada uno sobre el mismo texto.',ans:'El resumen dice, en pocas palabras, lo que dice el texto, sin opinar. El comentario da una opinión sobre el texto y la sostiene con razones. Ejemplo: «El texto cuenta cómo Hooke descubrió la célula» (resumen) y «Me parece claro, porque lo cuenta paso a paso» (comentario).'},
  {q:'¿Por qué no basta con copiar y pegar lo que encuentras? ¿Qué debes hacer con las palabras de otro autor?',ans:'Porque esas palabras son de otra persona: copiarlas sin decirlo es presentar como propio un trabajo ajeno. Lo que se hace es resumir con palabras propias o copiar entre comillas lo necesario (cita textual), y decir siempre de quién es y de dónde salió.'},
  {q:'Ordena en una tabla los cuatro viajes de Colón: número de viaje, año y adónde llegó. ¿Qué ventaja tiene la tabla sobre un párrafo?',ans:'Viaje 1, 1492, unas islas del Caribe; viaje 2, 1493, las islas del Caribe; viaje 3, 1498, la costa de Sudamérica; viaje 4, 1502, las Islas de la Bahía y la costa norte de Honduras. La tabla deja comparar los datos de un vistazo: es una técnica de síntesis.'},
  {q:'Encuentras en internet un dato que nadie firma. Explica qué harías antes de usarlo en un trabajo.',ans:'Fijarse en quién lo dice, dónde y cuándo se publicó; buscar el mismo dato en otra fuente (un libro, una enciclopedia, una institución) y compararlo. Si no se puede comprobar, no se usa o se dice que no está comprobado.'},
];

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['P','Z','K','D','F','V','P','F','Z','Z'],
    ['G','R','R','E','S','U','M','E','N','P'],
    ['L','L','O','I','F','R','Q','C','T','G'],
    ['O','N','V','L','N','A','T','L','A','S'],
    ['S','K','T','T','O','D','R','Q','X','G'],
    ['A','M','V','N','V','G','I','L','R','X'],
    ['R','B','Z','Y','G','M','O','C','T','M'],
    ['I','F','I','C','H','A','F','L','E','Y'],
    ['O','M','F','L','M','R','G','G','T','T'],
    ['P','P','O','R','T','A','D','A','X','M']
  ],words:[
    {w:'PORTADA',cells:[[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7]]},
    {w:'INDICE',cells:[[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]]},
    {w:'PROLOGO',cells:[[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]]},
    {w:'GLOSARIO',cells:[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0]]},
    {w:'FICHA',cells:[[7,1],[7,2],[7,3],[7,4],[7,5]]},
    {w:'RESUMEN',cells:[[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8]]},
    {w:'ATLAS',cells:[[3,5],[3,6],[3,7],[3,8],[3,9]]}
  ]},
  {size:10,grid:[
    ['V','R','F','T','R','X','P','Q','T','N'],
    ['C','S','M','U','B','J','D','M','D','T'],
    ['A','A','I','L','E','Z','D','Y','L','I'],
    ['X','N','P','N','Y','N','M','X','B','T'],
    ['M','P','E','I','O','A','T','Y','Y','U'],
    ['F','J','L','X','T','P','U','E','D','L'],
    ['K','C','X','G','O','U','S','T','M','O'],
    ['H','M','I','J','R','Q','L','I','O','P'],
    ['M','Z','P','T','Q','Q','V','O','S','R'],
    ['R','L','L','L','A','M','T','Q','L','V']
  ],words:[
    {w:'SINOPSIS',cells:[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8]]},
    {w:'CITA',cells:[[6,1],[7,2],[8,3],[9,4]]},
    {w:'AUTOR',cells:[[4,5],[5,6],[6,7],[7,8],[8,9]]},
    {w:'TITULO',cells:[[1,9],[2,9],[3,9],[4,9],[5,9],[6,9]]},
    {w:'CAPITULO',cells:[[1,0],[2,1],[3,2],[4,3],[5,4],[6,5],[7,6],[8,7]]},
    {w:'FUENTE',cells:[[0,2],[1,3],[2,4],[3,5],[4,6],[5,7]]},
    {w:'ANEXO',cells:[[2,0],[3,1],[4,2],[5,3],[6,4]]}
  ]}
];

// ===================== EXAMEN CONCEPTUAL =====================
// UN DATO, UNA PREGUNTA. Cada forma saca cinco de cada banco y pueden caer
// juntas cualesquiera, así que ninguna pregunta pide un dato que otra ya pide
// (su `k` no se repite) y ninguna respuesta aparece escrita en otra pregunta,
// tampoco como opción equivocada. Lo comprueba
// `_dev/verifica-examen-sin-pistas.js`.
//
// ⚠️ Por eso las opciones equivocadas de la selección no son partes del
// libro ni textos de consulta que otra pregunta pide escribir (nadie ofrece
// «el glosario» o «el atlas» como distractor): son cosas de otro mundo (un
// recibo, un horario). Y los términos de los pareados no salen en el
// enunciado de ninguna otra pregunta.
//
// ⚠️ Y ninguna la contesta la historia de Génesis (la tarjeta con que abre
// la misión).
//
// ⚠️ El examen no pregunta nada que sea solo de Media: una forma le puede
// tocar a un alumno de 7.º. Lo de Media va en su tarjeta y en la ficha.
const evalTFBank=[
  {q:'El índice de un libro indica en qué página empieza cada una de sus partes.',a:true,k:'tf-indice',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (partes del libro y su función: índice) · pp. 90 y 123 (revisan índices, títulos y subtítulos) · la función es redacción nuestra'},
  {q:'Para investigar un asunto solo sirven los libros: los periódicos y las revistas no cuentan.',a:false,k:'tf-solo-libros',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (la investigación fuera del libro: periódicos, revistas, otros) · DCNB pp. 90, 123 y 164'},
  {q:'En el resumen textual se subrayan las ideas fundamentales después de haberlas entendido.',a:true,k:'tf-resumen-textual',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (resúmenes) · DCNB pp. 89, 122 y 163 (resumen textual)'},
  {q:'La idea principal de un párrafo es un detalle que se puede quitar sin que cambie el sentido.',a:false,k:'tf-idea-quitar',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (ideas globales, principales y secundarias) · DCNB p. 123 (el párrafo: idea principal)'},
  {q:'Un comentario crítico da una opinión sobre lo leído y la sostiene con razones.',a:true,k:'tf-comentario',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el comentario crítico) · DCNB p. 122 (emiten juicios con argumentos sólidos) · la explicación es redacción nuestra'},
  {q:'Un diccionario ordena sus palabras por tamaño, de la más corta a la más larga.',a:false,k:'tf-diccionario-orden',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF p. 7 (uso del diccionario) · DCNB p. 91 (textos de consulta: el diccionario) · p. 93 (se orientan por el orden alfabético)'},
  {q:'En la portada de un libro se lee su título y el nombre de su autor.',a:true,k:'tf-portada',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (partes del libro: portada) · la función es redacción nuestra'},
  {q:'Copiar un párrafo de un libro sin decir de quién es respeta el trabajo de su autor.',a:false,k:'tf-copiar-sin-citar',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (citas bibliográficas) · DCNB pp. 95, 131 y 171'},
  {q:'En la etapa interpretativa de la lectura se busca entender el contenido del texto.',a:true,k:'tf-interpretativa',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (etapa interpretativa: entender el contenido) · Prog. 7-9, PDF p. 23'},
  {q:'Una tabla puede servir para resumir la información de un texto.',a:true,k:'tf-tabla',grado:'7.º a 9.º',curriculo:'DCNB pp. 89, 90, 123 y 164 (otras técnicas de síntesis: gráficas, tablas y mapas conceptuales)'}
];
const evalMCBank=[
  {q:'¿Dónde van, en un libro, los cuadros, los mapas o los documentos que amplían lo que dice?',o:['a) En el lomo','b) En el anexo o apéndice','c) En la dedicatoria','d) En el separador'],a:1,k:'mc-anexo',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (partes del libro: anexo o apéndice) · la función es redacción nuestra'},
  {q:'¿Cuál de estas cosas se anota al registrar un libro en su ficha?',o:['a) El precio que costó','b) El color de la pasta','c) El año en que se publicó','d) Lo que pesa'],a:2,k:'mc-ficha-anio',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (fichas bibliográficas) · DCNB pp. 90, 123 y 164 · los datos de la ficha son redacción nuestra'},
  {q:'Buscas información general sobre los volcanes, la Luna y los mayas. ¿Qué texto de consulta reúne artículos sobre muchos asuntos distintos?',o:['a) La enciclopedia','b) El horario de clases','c) El directorio telefónico','d) El calendario'],a:0,k:'mc-enciclopedia',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (textos de consulta: diccionarios, atlas y enciclopedias) · DCNB pp. 91, 124 y 165 · la explicación es redacción nuestra'},
  {q:'Terminaste de leer y ahora dices, con razones, si estás de acuerdo o no con el autor. ¿En qué etapa de la lectura estás?',o:['a) En la de hojear','b) En la de copiar','c) En la de buscar el libro','d) En la crítica o evaluativa'],a:3,k:'mc-evaluativa',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 122 y 163 (etapa crítica o evaluativa: emisión de juicios sobre lo leído) · Prog. 7-9, PDF p. 23'},
  {q:'Escribiste «bonito» cinco veces en tu texto y quieres cambiar algunas. ¿Qué te ayuda a encontrar otras palabras?',o:['a) Un mapa','b) Un diccionario de sinónimos y antónimos','c) Un recibo','d) Una agenda'],a:1,k:'mc-sinonimos',grado:'7.º a 9.º',curriculo:'DCNB pp. 91, 124 y 165 (textos de consulta: diccionario de sinónimos y antónimos) · Prog. 7-9, PDF pp. 7, 15 y 23'},
  {q:'En internet hallas un dato que te sirve, pero la página no dice quién lo escribió ni de dónde lo tomó. ¿Qué conviene hacer?',o:['a) Buscarlo en otra parte donde sí se diga quién lo afirma','b) Copiarlo rápido antes de que lo borren','c) Usarlo sin decir de dónde salió','d) Cambiarle unas palabras para que parezca tuyo'],a:0,k:'mc-fuente-dudosa',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (la investigación fuera del libro) · DCNB p. 166 (guían su lectura a partir del título, autor, fuente y contenido) · el consejo es redacción nuestra'},
  {q:'Lee: «El equipo de Daniela preparó su exposición en tres días. El lunes buscó información, el martes hizo el cartel y el miércoles ensayó». ¿Cuál es la idea principal?',o:['a) El martes hizo el cartel','b) El miércoles ensayó','c) El lunes buscó información','d) El equipo preparó su exposición en tres días'],a:3,k:'mc-idea-principal',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (comprensión de las ideas principales y secundarias) · DCNB p. 123 · el párrafo se escribió para la misión'},
  {q:'¿Dónde se puede poner una cita bibliográfica en un trabajo escrito?',o:['a) Solo en la pasta','b) En una hoja aparte que no se entrega','c) Al pie de la página o dentro del texto','d) En ningún lado'],a:2,k:'mc-cita-pie',grado:'8.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (citas bibliográficas) · DCNB pp. 131 y 171 (incorporan citas bibliográficas al pie de página y/o en el contexto)'},
  {q:'Vas a investigar sobre el río de tu comunidad. ¿Qué te ayuda a orientar la búsqueda antes de empezar a leer?',o:['a) Hacerte preguntas: ¿qué?, ¿dónde?, ¿cuándo?, ¿cómo? y ¿por qué?','b) Elegir el libro más grueso','c) Copiar lo primero que aparezca','d) Esperar a que otro lo haga'],a:0,k:'mc-preguntas',grado:'7.º a 9.º',curriculo:'DCNB pp. 89 y 123 (se orientan basados en respuestas a preguntas como ¿qué?, ¿dónde?, ¿cuándo?, ¿cómo?, ¿por qué?)'},
  {q:'Un libro largo suele dividirse en secciones numeradas, cada una con su nombre. ¿Cómo se llaman?',o:['a) Los renglones','b) Las sangrías','c) Los capítulos','d) Los márgenes'],a:2,k:'mc-capitulos',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (partes del libro: glosario, capítulos, bibliografía) · DCNB p. 121'}
];
const evalCPBank=[
  {q:'La lista de palabras difíciles con su significado, que algunos libros traen al final, se llama ___.',a:'glosario',acc:['glosario'],k:'cp-glosario',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (partes del libro: glosario, capítulos, bibliografía) · DCNB pp. 88 y 121 · la función es redacción nuestra'},
  {q:'La ficha que registra un artículo de periódico o de revista es la ficha ___.',a:'hemerográfica',acc:['hemerográfica','hemerografica'],k:'cp-hemerografica',grado:'8.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 15 y 23 (fichas bibliográficas y hemerográficas) · DCNB pp. 90, 123 y 164 (hemerográficas: revistas o periódicos)'},
  {q:'La primera etapa de la lectura, en la que conoces el libro por sus partes, es la estructural o ___.',a:'analítica',acc:['analítica','analitica'],k:'cp-analitica',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (etapa estructural o analítica de la lectura) · Prog. 7-9, PDF p. 23 (etapa analítica, interpretativa y evaluativa)'},
  {q:'En un párrafo, las ideas que explican o amplían la idea principal son las ideas ___.',a:'secundarias',acc:['secundarias','secundaria'],k:'cp-secundarias',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (ideas globales, principales y secundarias) · DCNB p. 123 (el párrafo: ideas secundarias)'},
  {q:'El texto que presenta la obra antes de que empiece su contenido, escrito a veces por otra persona, es el ___.',a:'prólogo',acc:['prólogo','prologo'],k:'cp-prologo',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (partes del libro: prólogo) · la función es redacción nuestra'},
  {q:'El resumen que redactas con tus propias palabras se llama resumen ___.',a:'parafraseado',acc:['parafraseado'],k:'cp-parafraseado',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (resúmenes) · DCNB pp. 89, 122 y 163 (resumen parafraseado: lo redactan con sus propias palabras)'},
  {q:'El libro de mapas que consultas para saber dónde queda un país, un río o una montaña es el ___.',a:'atlas',acc:['atlas'],k:'cp-atlas',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (textos de consulta: diccionarios, atlas y enciclopedias) · DCNB pp. 91, 124 y 165 · la explicación es redacción nuestra'},
  {q:'Copiar tal cual las palabras de un autor, diciendo de quién son, es hacer una cita ___.',a:'textual',acc:['textual'],k:'cp-textual',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (citas bibliográficas) · DCNB pp. 90, 123 y 164 (fichas de cita textual) · la explicación es redacción nuestra'},
  {q:'La lista de los libros y demás obras que se consultaron para escribir un trabajo es la ___.',a:'bibliografía',acc:['bibliografía','bibliografia'],k:'cp-bibliografia',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (partes del libro: bibliografía) · DCNB pp. 91, 124 y 165 (registran las fuentes para organizar la bibliografía del informe)'},
  {q:'La técnica de síntesis que ordena las ideas con llaves, para verlas de un vistazo, es la ___.',a:'sinopsis',acc:['sinopsis'],k:'cp-sinopsis',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (síntesis: resúmenes, sinopsis) · DCNB pp. 89, 122 y 163 (sinopsis en llaves)'}
];
const evalPRBank=[
  {term:'Contraportada',def:'La cara de atrás del libro',k:'pr-contraportada',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (reproducen la portada y la contraportada) · la explicación es redacción nuestra'},
  {term:'Introducción',def:'Páginas del comienzo donde se anuncia de qué tratará la obra',k:'pr-introduccion',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (partes del libro: introducción) · la función es redacción nuestra'},
  {term:'Epílogo',def:'Texto que cierra la obra, después de su última parte',k:'pr-epilogo',grado:'9.º',curriculo:'DCNB p. 162 (portada, índice, introducción, epílogo, prólogo, glosario, capítulos y bibliografía) · la función es redacción nuestra'},
  {term:'Subrayado',def:'Línea que marca en el texto lo que más importa',k:'pr-subrayado',grado:'7.º a 9.º',curriculo:'DCNB pp. 88 y 89 (formas para destacar lo relevante; subrayan las ideas fundamentales)'},
  {term:'Gráfica',def:'Dibujo de barras o de líneas que deja comparar cantidades',k:'pr-grafica',grado:'7.º a 9.º',curriculo:'DCNB pp. 89, 90, 123 y 164 (otras técnicas de síntesis: gráficas) · la explicación es redacción nuestra'},
  {term:'Editorial',def:'Empresa que publica el libro',k:'pr-editorial',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (fichas bibliográficas) · los datos de la ficha son redacción nuestra'},
  {term:'Predicción',def:'Lo que supones que dirá un libro antes de abrirlo',k:'pr-prediccion',grado:'7.º a 9.º',curriculo:'DCNB pp. 90 y 123 (estrategias de prelectura: elaborar predicciones)'},
  {term:'Juicio',def:'Opinión razonada sobre lo que se leyó',k:'pr-juicio',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 122 y 163 (etapa crítica o evaluativa: emisión de juicios sobre lo leído)'},
  {term:'Esquema',def:'Plan que ordena los temas y subtemas antes de escribir',k:'pr-esquema',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (esquemas y planes) · DCNB pp. 95 y 131 (esquemas: marcan párrafos, temas y subtemas)'},
  {term:'Biblioteca',def:'Lugar donde los libros se guardan en orden y se prestan',k:'pr-biblioteca',grado:'7.º a 9.º',curriculo:'DCNB pp. 91, 124 y 165 (la biblioteca del aula, de la escuela o de la comunidad)'}
];

// ══════════ Formas deterministas v1 ══════════
// Las formas 1 a 30 salen de los cuatro bancos de arriba. No se sube este
// número para ofrecer más formas: las 31 a 50 salen del banco grande de abajo.
const EVAL_FORMAS = 30;

// ===================== EXAMEN CONCEPTUAL · BANCO GRANDE =====================
// Preguntas para las formas 31 a 50. Cada una de esas formas lleva, por
// sección, tres de aquí y dos del banco de arriba; las reparte el motor
// (js/motor-misiones.js) sin que dos formas lleven el mismo conjunto.
// Valen las mismas reglas de arriba, y contra los dos bancos a la vez.
//
// Cada pregunta lleva dos anotaciones. `fuente` dice dónde lo enseña la
// misión (la ficha por su hoja, la guía o una actividad): es la que pide
// `_dev/verifica-conceptual-banco-grande.js`, y si una sección de la ficha
// cambia de hoja hay que corregirla aquí. `curriculo` dice de qué página de
// la programación o del DCNB sale el contenido.
// ⚠️ El orden del verdadero o falso está puesto para que ninguna forma
// nueva salga con las cinco respuestas iguales.
const evalTFBankNuevo=[
  {q:'Un resumen debe quedar más largo que el texto original.',a:false,k:'tf-resumen-largo',fuente:'Ficha, página 3 (5. Técnicas de síntesis) · Guía (Aprende): Técnicas de síntesis',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (resúmenes) · DCNB pp. 89, 122 y 163 (subrayan las ideas fundamentales)'},
  {q:'Anotar cada obra consultada en su ficha te permite decir después de dónde tomaste la información.',a:true,k:'tf-registrar',fuente:'Ficha, página 2 (4. Las fichas: de dónde salió cada dato) · Actividad Tarjetas: Ficha bibliográfica',grado:'7.º a 9.º',curriculo:'DCNB pp. 90, 91, 123 y 124 (registran los libros que consultan; registran las fuentes para organizar la bibliografía)'},
  {q:'Al resumir se puede cambiar lo que dijo el autor, con tal de que suene mejor.',a:false,k:'tf-resumen-sentido',fuente:'Ficha, página 3 (5. Técnicas de síntesis: truco) · Actividad Laboratorio: el resumen',grado:'7.º a 9.º',curriculo:'DCNB pp. 89, 122 y 163 (subrayan las ideas fundamentales después de haberlas entendido)'},
  {q:'Se puede estar en desacuerdo con el autor de un texto, siempre que se den razones.',a:true,k:'tf-desacuerdo',fuente:'Ficha, página 3 (6. El comentario crítico) · Actividad Tarjetas: Comentario crítico',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el comentario crítico) · DCNB pp. 89, 122 y 163 (juicios con argumentos sólidos sobre los aspectos con los que están de acuerdo o en desacuerdo)'},
  {q:'Para saber si un libro te sirve basta con mirar el color de su pasta.',a:false,k:'tf-elegir-libro',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura) · Actividad Secuencia: Leer un libro para investigar',grado:'7.º a 9.º',curriculo:'DCNB pp. 90, 123 y 164 (lectura estructural para seleccionar los libros: revisan índices, títulos y subtítulos)'},
  {q:'Una entrevista a una persona que conoce el asunto también puede servir para una investigación.',a:true,k:'tf-entrevista',fuente:'Ficha, página 3 (7. Textos de consulta e investigación fuera del libro) · Guía (Aprende): Investigar fuera del libro',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (la investigación fuera del libro) · DCNB pp. 90, 124 y 165 (otras formas de recabar información: entrevistas)'},
  {q:'Leer un texto una sola vez y de prisa basta para investigar bien.',a:false,k:'tf-una-vez',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura: para leer mejor) · Actividad Secuencia: Hacer un resumen parafraseado',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (la lectura general y una segunda lectura por párrafos)'},
  {q:'Antes de escribir un trabajo conviene ordenar en un plan lo que se va a decir.',a:true,k:'tf-plan',fuente:'Ficha, página 3 (5. Técnicas de síntesis: esquemas y planes) · Actividad Secuencia: Investigar un asunto',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (esquemas y planes) · DCNB pp. 95, 131 y 171'},
  {q:'Los títulos y subtítulos de un libro ayudan a suponer de qué tratará.',a:true,k:'tf-titulos',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura) · Guía (Aprende): Las tres etapas de la lectura',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 90 y 123 (prelectura; revisan índices y, en estos, los títulos y subtítulos)'},
  {q:'En una ficha de comentario personal anotas lo que tú piensas sobre lo leído.',a:true,k:'tf-comentario-personal',fuente:'Ficha, página 2 (4. Las fichas: fichas de trabajo) · Actividad «¿Qué ficha de trabajo es?» 3',grado:'7.º a 9.º',curriculo:'DCNB pp. 90, 123 y 164 (fichas de trabajo: de comentario personal)'}
];
const evalMCBankNuevo=[
  {q:'El texto dice: «Robert Hooke observó un trozo de corcho con un microscopio y vio unos cuartitos que llamó celdas». ¿Cuál de estas versiones lo dice con otras palabras, sin copiar y sin opinar?',o:['a) «Robert Hooke observó un trozo de corcho con un microscopio y vio unos cuartitos»','b) «Con un microscopio, Hooke miró un pedazo de corcho y a los huequitos que encontró les puso celdas»','c) «Creo que Hooke fue muy listo»','d) «Hooke, corcho, microscopio»'],a:1,k:'mc-parafrasis',fuente:'Ficha, página 3 (5. Técnicas de síntesis) · Actividad Clasifica: Cita textual o Con tus palabras · Actividad Laboratorio: el resumen',grado:'7.º a 9.º',curriculo:'DCNB pp. 89, 122 y 163 (resumen parafraseado) · el dato, de la misión La Célula'},
  {q:'Vas a registrar una noticia que leíste. Además del título, ¿qué no puede faltar?',o:['a) El precio del ejemplar','b) El nombre de quien te lo prestó','c) El tamaño de las letras','d) La fecha en que salió el periódico'],a:3,k:'mc-fecha-periodico',fuente:'Ficha, página 2 (4. Las fichas: de dónde salió cada dato) · Actividad Tarjetas: Ficha hemerográfica',grado:'8.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 15 y 23 (fichas hemerográficas) · DCNB pp. 90, 123 y 164 · los datos de la ficha son redacción nuestra'},
  {q:'No sabes qué quiere decir un término que leíste. ¿Qué texto de consulta lo explica?',o:['a) El diccionario de la lengua','b) El calendario','c) El recibo de la luz','d) El horario de clases'],a:0,k:'mc-diccionario',fuente:'Ficha, página 3 (7. Textos de consulta e investigación fuera del libro) · Actividad «¿De qué se habla?» 5',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF p. 7 (uso del diccionario) · DCNB pp. 88 y 91 (hacen uso del diccionario; textos de consulta)'},
  {q:'Quieres mostrar los cuatro viajes de Colón, con su año y el lugar adonde llegó cada uno, para compararlos de un vistazo. ¿Qué conviene hacer?',o:['a) Un cuento','b) Una carta','c) Una tabla','d) Un poema'],a:2,k:'mc-tabla-viajes',fuente:'Ficha, página 3 (5. Técnicas de síntesis: la tabla de los viajes) · Guía (Aprende): Una tabla también resume',grado:'7.º a 9.º',curriculo:'DCNB pp. 89, 90, 123 y 164 (otras técnicas de síntesis: tablas) · los viajes, de js/data/viajes-colon.js'},
  {q:'¿Cuál de estas es una fuente «fuera del libro» para una investigación?',o:['a) La pasta del libro','b) El separador de hojas','c) Una revista','d) El forro'],a:2,k:'mc-fuera-libro',fuente:'Ficha, página 3 (7. Textos de consulta e investigación fuera del libro) · Guía (Aprende): Investigar fuera del libro',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (la investigación fuera del libro: periódicos, revistas, otros) · DCNB pp. 90 y 164'},
  {q:'¿Cuál de estas oraciones es un comentario y no un resumen?',o:['a) «El texto explica cómo se siembra el maíz»','b) «El autor cuenta su viaje en dos partes»','c) «La lectura habla de un río y de un puente»','d) «Creo que el autor exagera, porque no da ningún ejemplo»'],a:3,k:'mc-comentario-ejemplo',fuente:'Ficha, página 3 (6. El comentario crítico) · Actividad Clasifica: Resumen o Comentario · Actividad Reto: Resume u Opina',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el comentario crítico, resúmenes) · DCNB p. 122'},
  {q:'Hallas una palabra desconocida y no tienes a mano dónde buscarla. ¿Qué te sirve para entenderla?',o:['a) Fijarte en la frase donde aparece','b) Saltarte la página','c) Contar sus letras','d) Cerrar el libro'],a:0,k:'mc-contexto',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura: para leer mejor) · Guía (Aprende): Las tres etapas de la lectura',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (observan el contexto lingüístico, es decir, el sentido de la frase en que está ubicada la palabra)'},
  {q:'Una ficha dice: «Zelaya, Marta Lidia». ¿Qué dato es ese?',o:['a) El lugar donde se imprimió','b) El nombre de la autora','c) El número de páginas','d) El precio'],a:1,k:'mc-autora',fuente:'Ficha, página 2 (4. Las fichas: la ficha de un libro inventado) · Actividad Completa 1 · Actividad Laboratorio: la ficha',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (fichas bibliográficas) · el libro y su autora se inventaron para la misión'},
  {q:'Lee: «Las alertas se avisan con colores: el verde dice que todo está normal, el amarillo pide atención y el rojo manda evacuar». ¿De qué trata este texto?',o:['a) De cómo se pinta una casa','b) De los colores de la bandera','c) De las frutas maduras','d) De lo que significa cada color de las alertas'],a:3,k:'mc-tema',fuente:'Ficha, página 2 (3. Idea principal e ideas secundarias) · Actividad «¿Cuál es la idea principal?» 5',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 123 y 162 (identifican ideas centrales y secundarias y el tema del texto) · los colores, de la misión Desastres Naturales'},
  {q:'¿Cuándo conviene anotar en su ficha los datos de un libro?',o:['a) En el momento en que lo consultas','b) Un mes después','c) Cuando ya lo devolviste','d) Nunca: se recuerdan solos'],a:0,k:'mc-cuando-ficha',fuente:'Ficha, página 2 (4. Las fichas: de dónde salió cada dato) · Guía (Aprende): El trabajo de Génesis',grado:'7.º a 9.º',curriculo:'DCNB pp. 90, 123 y 164 (registran los libros que consultan en fichas bibliográficas) · el consejo es redacción nuestra'}
];
const evalCPBankNuevo=[
  {q:'La ficha en la que anotas los datos de un libro que consultaste es la ficha ___.',a:'bibliográfica',acc:['bibliográfica','bibliografica'],k:'cp-bibliografica',fuente:'Ficha, página 2 (4. Las fichas: de dónde salió cada dato) · Actividad Tarjetas: Ficha bibliográfica',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (fichas bibliográficas) · DCNB pp. 90, 123 y 164 (bibliográficas: libros)'},
  {q:'Las palabras que copias de un autor, tal como él las escribió, se encierran entre ___.',a:'comillas',acc:['comillas'],k:'cp-comillas',fuente:'Ficha, página 2 (4. Las fichas: fichas de trabajo) · Actividad Tarjetas: Cita textual',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (citas bibliográficas) · DCNB pp. 90 y 123 (fichas de cita textual) · la explicación es redacción nuestra'},
  {q:'Lo que pasó y se puede comprobar es un ___; lo que alguien piensa sobre eso es una opinión.',a:'hecho',acc:['hecho'],k:'cp-hecho',fuente:'Ficha, página 3 (6. El comentario crítico) · Guía (Aprende): El comentario crítico',grado:'7.º a 9.º',curriculo:'DCNB pp. 92 y 166 (diferencian entre un hecho y una opinión)'},
  {q:'Un autor que solo presenta datos, sin dar su parecer, escribe con una actitud ___.',a:'objetiva',acc:['objetiva'],k:'cp-objetiva',fuente:'Ficha, página 3 (6. El comentario crítico) · Guía (Aprende): El comentario crítico',grado:'7.º a 9.º',curriculo:'DCNB pp. 89 y 122 (identifican la actitud objetiva o subjetiva del autor)'},
  {q:'Suponer de qué tratará un libro mirando su portada y su índice, antes de leerlo, es parte de la ___.',a:'prelectura',acc:['prelectura','pre-lectura','pre lectura'],k:'cp-prelectura',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura) · Guía (Aprende): Las tres etapas de la lectura',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (desarrollan la prelectura al conjeturar a partir de las partes externas del libro)'},
  {q:'Mientras lees para investigar conviene tomar ___ de lo que más importa.',a:'notas',acc:['notas','nota','apuntes'],k:'cp-notas',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura: para leer mejor) · Actividad Secuencia: Investigar un asunto',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (formas para destacar lo relevante y toma de notas)'},
  {q:'Volver a leer un texto para entenderlo mejor es ___.',a:'releer',acc:['releer','releerlo','relectura'],k:'cp-releer',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura: para leer mejor) · Actividad Secuencia: Hacer un resumen parafraseado',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (releen el texto para desentrañar y entender las ideas)'},
  {q:'Un diccionario de medicina o uno de computación, que reúne solo el vocabulario de un campo, es un diccionario ___.',a:'especializado',acc:['especializado'],k:'cp-especializado',fuente:'Ficha, página 3 (7. Textos de consulta e investigación fuera del libro) · Actividad Reto: Texto de consulta',grado:'8.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 15 y 23 (uso de diccionarios especializados) · DCNB p. 124 · la explicación es redacción nuestra'},
  {q:'La parte más extensa de un libro, donde se desarrolla todo su contenido, es el ___.',a:'cuerpo',acc:['cuerpo'],k:'cp-cuerpo',fuente:'Ficha, página 1 (2. Las partes del libro) · Guía (Aprende): Las partes del libro',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (partes del libro: cuerpo) · la función es redacción nuestra'},
  {q:'El dibujo que une conceptos con líneas y palabras de enlace es el mapa ___.',a:'conceptual',acc:['conceptual'],k:'cp-conceptual',fuente:'Ficha, página 3 (5. Técnicas de síntesis) · Guía (Aprende): Técnicas de síntesis',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 89 y 90 (síntesis: mapas conceptuales) · la explicación es redacción nuestra'}
];
const evalPRBankNuevo=[
  {term:'Fichero',def:'Caja o mueble donde se guardan las fichas en orden',k:'pr-fichero',fuente:'Ficha, página 2 (4. Las fichas: de dónde salió cada dato) · Guía (Aprende): Las fichas: de dónde salió cada dato',grado:'7.º a 9.º',curriculo:'DCNB p. 93 (se orientan por el orden alfabético para ubicar en el fichero de la biblioteca textos dado un dato)'},
  {term:'Folleto',def:'Publicación de pocas hojas sobre un solo asunto',k:'pr-folleto',fuente:'Ficha, página 3 (7. Textos de consulta e investigación fuera del libro) · Guía (Aprende): Investigar fuera del libro',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (la investigación fuera del libro) · DCNB pp. 90, 124 y 164 (libros, folletos, periódicos, revistas) · la explicación es redacción nuestra'},
  {term:'Argumento',def:'Razón con que se sostiene lo que se opina',k:'pr-argumento',fuente:'Ficha, página 3 (6. El comentario crítico) · Guía (Aprende): El comentario crítico',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el comentario crítico) · DCNB pp. 89 y 122 (juicios con argumentos sólidos)'},
  {term:'Concentración',def:'Mantener la atención en la lectura, sin distraerse',k:'pr-concentracion',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura: para leer mejor) · Guía (Aprende): Para leer mejor',grado:'7.º a 9.º',curriculo:'DCNB pp. 89, 122 y 163 (habilidades para una lectura eficiente: atención, concentración y comprensión)'},
  {term:'Memoria',def:'Retener las ideas para recordarlas al terminar de leer',k:'pr-memoria',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura: para leer mejor) · Guía (Aprende): Para leer mejor',grado:'7.º a 9.º',curriculo:'DCNB pp. 89, 122 y 163 (la memoria para retener las ideas y poder recordarlas cuando terminen la lectura)'},
  {term:'Observación',def:'Leer con cuidado, fijándose en los detalles',k:'pr-observacion',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura: para leer mejor) · Guía (Aprende): Para leer mejor',grado:'7.º a 9.º',curriculo:'DCNB pp. 89 y 122 (la observación: lee cuidadosamente el texto)'},
  {term:'Jerarquizar',def:'Ordenar las ideas de la más importante a la menos importante',k:'pr-jerarquizar',fuente:'Ficha, página 2 (4. Las fichas: fichas de trabajo) · Guía (Aprende): Las fichas: de dónde salió cada dato',grado:'7.º a 9.º',curriculo:'DCNB pp. 90, 123 y 164 (fichas de trabajo: jerarquización de la información)'},
  {term:'Seleccionar',def:'Escoger, entre todo lo leído, lo que de verdad sirve',k:'pr-seleccionar',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura) · Actividad Tarjetas: Etapa interpretativa',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (etapa interpretativa: seleccionar ideas) · pp. 90 y 123 (búsqueda y selección de la información)'},
  {term:'Reflexionar',def:'Pensar con calma en lo que se acaba de entender',k:'pr-reflexionar',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura) · Actividad Tarjetas: Etapa interpretativa',grado:'7.º a 9.º',curriculo:'DCNB pp. 88, 121 y 162 (etapa interpretativa: reflexionar sobre lo leído)'},
  {term:'Propósito',def:'Para qué se va a leer: lo que se quiere lograr',k:'pr-proposito',fuente:'Ficha, página 1 (1. Las tres etapas de la lectura: para leer mejor) · Guía (Aprende): Para leer mejor',grado:'7.º a 9.º',curriculo:'DCNB pp. 90 y 123 (determinar de antemano el propósito de las lecturas que realizarán)'}
];

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
// Los casos son los del plan: copiar sin decir de dónde, una fuente dudosa y
// un resumen que cambia el sentido. La pauta del caso es la misma para los
// dos casos del banco: por eso los dos tienen la misma forma (alguien busca
// en una fuente, copia tal cual, no anota de dónde y no puede decirlo).
const critTextos={
  caso:'Caso de análisis: un trabajo copiado sin decir de dónde',
  decision:'Toma de decisiones: una fuente dudosa',
  decisionPregunta:'¿Qué harías tú y qué le propondrías a tu equipo? Explica por qué, pensando en cómo se sabe si una fuente merece confianza y en por qué se anota de dónde sale cada dato.',
  decisionPreguntaHoja:'¿Qué harías tú y qué le propondrías a tu equipo? Explica por qué, pensando en cómo se sabe si una fuente merece confianza.',
  comparacionPregunta:'1. ¿Cuál de los dos es un resumen y cuál es un comentario? 2. ¿En qué lo notas? 3. ¿Para qué sirve cada uno en una investigación?'
};
const critCaseBank=[
  {k:'ca-libro',txt:'Para su trabajo de Ciencias, Kevin copió dos páginas de un libro de la biblioteca, palabra por palabra, y las entregó con su nombre. No anotó el título ni el autor. Cuando la profesora le preguntó de dónde había sacado la información, no supo decirlo.'},
  {k:'ca-internet',txt:'Dania tenía que investigar sobre los ríos de su departamento. Copió y pegó tres párrafos de una página de internet y los presentó como suyos. No guardó la dirección ni el nombre de quien los escribió. Cuando el profesor le pidió la fuente, ya no la encontró.'},
];
const critCaseQuestions=[
  '1. ¿Qué hizo bien y qué hizo mal esta persona al investigar?',
  '2. ¿Qué datos de la fuente debió anotar, y para qué le habrían servido?',
  '3. ¿Cómo debió usar las palabras del autor para que el trabajo fuera suyo?',
  '4. ¿Qué le aconsejarías para su próxima investigación?',
];
const critCaseGuides=[
  'Hizo bien en buscar información en una fuente. Hizo mal en copiarla tal cual, presentarla como propia y no anotar de dónde la tomó.',
  'Quién lo escribió, cómo se llama la obra o la página, y dónde y cuándo se publicó. Con eso habría podido decir de dónde salió cada dato y volver a encontrarlo.',
  'Resumiendo con sus propias palabras (resumen parafraseado) o copiando entre comillas solo lo necesario (cita textual), y diciendo siempre de quién es.',
  'Respuesta abierta: anotar la fuente en su ficha en cuanto la consulta, leer hasta entender, subrayar lo fundamental, resumir con palabras propias y citar.',
];
const critErrorBank=[
  {k:'er-resumen',txt:'"Un resumen es copiar el primer párrafo del texto, y mientras más largo quede, mejor".',
   g1:'un resumen recoge las ideas fundamentales de todo el texto, no solo las del COMIENZO.',
   g2:'un resumen queda más BREVE que el original: deja lo esencial.'},
  {k:'er-fichas',txt:'"La ficha bibliográfica es para los periódicos, y la bibliografía es la lista de las palabras difíciles de un libro".',
   g1:'la ficha bibliográfica registra libros; los periódicos y las revistas van en la HEMEROGRÁFICA.',
   g2:'la lista de las palabras difíciles con su significado es el GLOSARIO; la bibliografía nombra las obras consultadas.'},
];
const critDecisionBank=[
  'Tu equipo investiga sobre una enfermedad. Un compañero trae un mensaje reenviado por teléfono que dice que cierta planta «lo cura todo». El mensaje no dice quién lo escribió ni de dónde salió, y el equipo quiere ponerlo en el trabajo porque «suena bien».',
  'Para un trabajo de Ciencias Sociales, tu equipo halla una página de internet sin autor ni fecha que da una cifra muy distinta de la del libro de texto. Dos compañeros quieren usar la de la página porque «ha de ser más nueva», aunque no saben de cuándo es.',
];
const critDecisionGuide='Una fuente merece confianza cuando dice quién la escribió, dónde y cuándo se publicó y de dónde tomó sus datos. Se recomienda no usar el dato tal como viene, buscarlo en otras fuentes (un libro, una enciclopedia, una institución), compararlas y anotar en una ficha la que se use. Si no se puede comprobar, no entra en el trabajo, o se dice que no está comprobado. Que algo «suene bien» o parezca nuevo no lo vuelve cierto.';
const critCompareBank=[
  {k:'co-hooke',a:'«El texto cuenta que Robert Hooke observó un trozo de corcho con un microscopio y llamó celdas a los cuartitos que vio».',b:'«Me parece que el texto explica bien el descubrimiento, porque lo cuenta paso a paso; pero le falta decir para qué sirvió».',
   ga:'es un resumen: repite, en pocas palabras, lo que dice el texto, sin opinar.',
   gb:'es un comentario: da una opinión sobre el texto y la sostiene con razones.',
   gr:'El resumen sirve para recordar y usar la información; el comentario, para valorarla. En una investigación hacen falta los dos, pero no se confunden: primero se entiende y se resume, después se opina.'},
  {k:'co-colon',a:'«Según el texto, Colón hizo cuatro viajes entre 1492 y 1502, y solo en el cuarto llegó a la costa norte de Honduras».',b:'«Creo que al texto le hace falta un mapa, porque sin él cuesta imaginar por dónde pasó cada viaje».',
   ga:'es un resumen: recoge los datos del texto y no añade ningún parecer.',
   gb:'es un comentario: valora el texto, dice qué le falta y por qué.',
   gr:'Uno informa de lo que el texto dice y el otro lo juzga. Se nota en las fórmulas: «según el texto» anuncia un resumen; «creo que» y «porque» anuncian una opinión con su razón.'},
];
const critCauseBank=[
  {k:'cau-sin-ficha',cause:'Consultas cinco libros para tu trabajo y no anotas los datos de ninguno.',guide:'Al final no puedes armar la bibliografía ni decir de qué obra tomaste cada cosa.'},
  {k:'cau-copiar',cause:'Copias un párrafo de una enciclopedia y lo entregas sin comillas y sin nombrarla.',guide:'Presentas como tuyas las palabras de otra persona: el trabajo deja de ser honrado y pierde valor.'},
  {k:'cau-sin-indice',cause:'Buscas un asunto en un libro grueso pasando hoja por hoja, sin mirar el índice.',guide:'Pierdes mucho tiempo y puede que ni des con la parte que te servía.'},
  {k:'cau-una-fuente',cause:'Haces toda tu investigación con una sola página de internet.',guide:'Si esa página se equivoca, repites su error, porque no la comparaste con nada.'},
  {k:'cau-subrayar-todo',cause:'Subrayas casi todos los renglones del texto que vas a resumir.',guide:'Ya no se distingue lo fundamental de lo demás, y lo que escribes sale casi tan extenso como el original.'},
];
const critEffectBank=[
  {k:'ef-volcanes',effect:'Marlon halló en dos minutos dónde habla de los volcanes su libro de Ciencias.',guide:'Revisó primero el índice.'},
  {k:'ef-comprobar',effect:'La profesora pudo comprobar un dato del informe de Keyla.',guide:'Keyla puso al final la lista de las obras que consultó.'},
  {k:'ef-al-reves',effect:'Lo que escribió Óscar dice lo contrario de lo que decía la lectura.',guide:'Lo redactó sin haberla entendido, juntando frases sueltas.'},
  {k:'ef-termino',effect:'Josué entendió una palabra técnica sin soltar el libro que leía.',guide:'La buscó en el glosario, que venía en las últimas páginas.'},
  {k:'ef-rio',effect:'El equipo supo en qué departamento queda el río sobre el que investigaba.',guide:'Consultó un atlas.'},
  {k:'ef-tabla',effect:'En la exposición, todo el grado comparó de un vistazo las cifras de cuatro años.',guide:'El equipo las ordenó en una tabla en vez de leerlas de corrido.'},
  {k:'ef-convencio',effect:'La opinión de Sara convenció al grado, aunque no todos pensaban como ella.',guide:'La sostuvo con razones y con ejemplos tomados de la lectura.'},
];

// ===================== LABORATORIO =====================
// «El libro desarmado». Un libro INVENTADO para la misión (su autora, su
// editorial, su prólogo y su bibliografía no existen, y la pantalla lo
// dice), abierto en seis partes. Lo que cuenta de la célula sí es cierto:
// sale de la misión La Célula (Hooke, 1665, el corcho, las celdas; lo que
// vio eran las cubiertas de células ya muertas; la teoría celular, de
// varios científicos).
//
// Tiene tres pasos, y cada uno enseña una cosa del plan:
//   1. `busquedas`: una pregunta que solo contesta UNA parte del libro.
//   2. `ficha`: los cinco datos de la ficha bibliográfica, que salen de la
//      portada. En cada dato se elige entre tres.
//   3. `resumen`: el alumno escribe su resumen del capítulo y el
//      laboratorio le señala si copió frases enteras. `claves` son las
//      ideas que un buen resumen no deja fuera (basta una palabra de cada
//      lista, ya sin tildes y en minúscula).
const libroDesarmado={
  aviso:'Este libro no existe: se inventó para practicar, con su autora, su editorial y su bibliografía. Lo que cuenta de la célula sí es cierto.',
  partes:[
    {id:'portada',emoji:'📕',nombre:'Portada',sirve:'Dice cómo se llama la obra, quién la escribió y quién la publicó.',
     pagina:'<div class="ld-portada"><div class="ld-p-titulo">Un mundo que no se ve</div><div class="ld-p-sub">La célula explicada a quien empieza</div><div class="ld-p-autor">Marta Lidia Zelaya</div><div class="ld-p-pie">Ediciones Pupitre · Tegucigalpa · 2024</div></div>'},
    {id:'indice',emoji:'🧭',nombre:'Índice',sirve:'Dice en qué página empieza cada parte del libro.',
     pagina:'<ul class="ld-indice"><li><span>Prólogo</span><span>5</span></li><li><span>Capítulo 1. El día que se vio la primera celda</span><span>9</span></li><li><span>Capítulo 2. Las partes de la célula</span><span>21</span></li><li><span>Capítulo 3. Células de plantas y de animales</span><span>35</span></li><li><span>Glosario</span><span>47</span></li><li><span>Bibliografía</span><span>51</span></li></ul>'},
    {id:'prologo',emoji:'🚪',nombre:'Prólogo',sirve:'Presenta la obra antes de que empiece: quién la escribió y por qué.',
     pagina:'<p><strong>Prólogo</strong></p><p>Marta Lidia Zelaya escribió este libro para sus alumnos de séptimo grado. Un día le preguntaron de qué estamos hechos, y como la respuesta no cabía en una clase, la convirtió en estas páginas. Lo recomiendo a quien quiera empezar a mirar lo que no se ve.</p><p class="ld-firma">Una colega de la autora</p>'},
    {id:'capitulo',emoji:'📖',nombre:'Capítulo 1',sirve:'Es parte del cuerpo del libro: aquí se desarrolla el contenido.',
     pagina:'<p><strong>Capítulo 1. El día que se vio la primera celda</strong></p><p>En 1665, Robert Hooke observó un trozo de corcho con un microscopio. Vio que estaba formado por muchos cuartitos, como los de un panal, y los llamó celdas. Así se descubrió la célula. Lo que Hooke tenía delante eran las cubiertas de células que ya habían muerto. Después, varios científicos construyeron la teoría celular, que afirma que todos los seres vivos están formados por células.</p>'},
    {id:'glosario',emoji:'🔤',nombre:'Glosario',sirve:'Explica las palabras difíciles que usa el libro.',
     pagina:'<p><strong>Glosario</strong></p><p><strong>célula:</strong> unidad estructural y funcional de todos los seres vivos.</p><p><strong>teoría celular:</strong> explicación, construida por varios científicos, que dice que todos los seres vivos están formados por células y que toda célula proviene de otra.</p>'},
    {id:'bibliografia',emoji:'📚',nombre:'Bibliografía',sirve:'Nombra las obras que la autora consultó para escribir la suya.',
     pagina:'<p><strong>Bibliografía</strong> (obras inventadas, como todo el libro)</p><p>Rivera, Tomás. <em>Los seres vivos de cerca</em>. Editorial Cuaderno Azul, San Pedro Sula, 2019.</p><p>Mejía, Sara. <em>Pequeña historia del microscopio</em>. Ediciones Pupitre, Tegucigalpa, 2021.</p>'}
  ],
  busquedas:[
    {q:'¿Quién escribió este libro?',parte:'portada',por:'El nombre de la autora va en la portada, junto al título.'},
    {q:'¿En qué página empieza el capítulo sobre las células de plantas y de animales?',parte:'indice',por:'El índice dice en qué página empieza cada parte: ese capítulo empieza en la 35.'},
    {q:'¿Qué quiere decir «teoría celular»?',parte:'glosario',por:'El glosario explica las palabras difíciles sin que tengas que salir del libro.'},
    {q:'¿Qué vio Robert Hooke en el trozo de corcho?',parte:'capitulo',por:'El contenido se desarrolla en el cuerpo del libro, que está dividido en capítulos.'},
    {q:'¿Qué otras obras consultó la autora para escribir la suya?',parte:'bibliografia',por:'La bibliografía es la lista de las obras consultadas.'},
    {q:'¿Por qué la autora decidió escribir este libro?',parte:'prologo',por:'El prólogo presenta la obra: cuenta quién la escribió y por qué.'}
  ],
  ficha:[
    {id:'autor',dato:'Autor o autora',ok:'Zelaya, Marta Lidia',opciones:['Ediciones Pupitre','Zelaya, Marta Lidia','Un mundo que no se ve'],por:'Es quien escribió el libro. En muchas fichas se pone primero el apellido.'},
    {id:'titulo',dato:'Título',ok:'Un mundo que no se ve',opciones:['Un mundo que no se ve','Tegucigalpa','Capítulo 1'],por:'Es el nombre de la obra entera, no el de un capítulo.'},
    {id:'editorial',dato:'Editorial',ok:'Ediciones Pupitre',opciones:['Marta Lidia Zelaya','2024','Ediciones Pupitre'],por:'Es la empresa que publicó el libro.'},
    {id:'lugar',dato:'Lugar',ok:'Tegucigalpa',opciones:['Tegucigalpa','Séptimo grado','Página 9'],por:'Es la ciudad donde se publicó.'},
    {id:'anio',dato:'Año',ok:'2024',opciones:['1665','2024','51'],por:'Es el año en que se publicó el libro. 1665 es el año del que habla el capítulo, no el del libro.'}
  ],
  resumen:{
    titulo:'Capítulo 1. El día que se vio la primera celda',
    texto:'En 1665, Robert Hooke observó un trozo de corcho con un microscopio. Vio que estaba formado por muchos cuartitos, como los de un panal, y los llamó celdas. Así se descubrió la célula. Lo que Hooke tenía delante eran las cubiertas de células que ya habían muerto. Después, varios científicos construyeron la teoría celular, que afirma que todos los seres vivos están formados por células.',
    claves:[
      {idea:'quién lo hizo',palabras:['hooke']},
      {idea:'qué miró',palabras:['corcho']},
      {idea:'qué descubrió',palabras:['celda','celdas','celula','celulas','cuartitos']}
    ]
  }
};
