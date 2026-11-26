/* ============================================================
   M.E.T.A.S · Misión El periódico y los textos de todos los días · CONTENIDO
   ------------------------------------------------------------
   Aquí solo hay datos: lo que la misión dice, pregunta y guarda. Ni
   una función. Quien pinta las pantallas, lleva el XP y arma el examen
   es el motor compartido (js/motor-mision.js).

   Para corregir un dato de esta misión se toca ESTE archivo y nada más.

   ► PARA QUIÉN ES. Español, primer parcial (febrero y marzo), de 7.º a
     9.º grado, con un apartado «Para Media» (11.º). Cada pregunta del
     examen dice su `grado` y, en `curriculo`, la página de la
     programación o del DCNB de donde sale.

   ► DE DÓNDE SALE CADA COSA (todo está en `_dev/`):
     · Prog. 7-9 = `_dev/dcnb-pdf/programacion-espanol-7-9.pdf`, la
       programación mensual de SEDUC. Febrero y marzo: 7.º en la p. 7 del
       PDF (el periódico; cartas personales; informe interpretativo), 8.º
       en la p. 15 (el periódico; cartas de lector; acta; carta personal;
       carta de venta; la noticia) y 9.º en la p. 23 (el periódico:
       postura, línea editorial, titulares, secciones, tipo de lectores;
       el reglamento).
     · DCNB = `_dev/dcnb-pdf/dcneb-basica-iii-ciclo.pdf` (página del
       visor). p. 92: titulares, secciones, postura y línea editorial y
       tipos de lectores; diferenciar un hecho de una opinión. p. 93: en
       una carta, el remitente, el destinatario y el asunto. p. 96: las
       marcas de todo texto enunciativo (quién escribe y a quién, la
       fecha y el lugar), la estructura de la carta (saludo, cuerpo,
       despedida y firma) y el estilo de la carta personal (destinatario
       ligado afectivamente al remitente, estilo espontáneo y natural,
       lenguaje sincero, afectivo y sencillo). p. 97: la carta de venta
       «como un documento legal», con vendedores y compradores de ganado;
       las preguntas ¿quién?, ¿qué?, ¿cuándo?, ¿dónde?, ¿cómo? y ¿por
       qué?, y la estructura «titular, encabezado y cuerpo» (las dos
       cosas las dice de la crónica). p. 98: el informe interpretativo
       (su cronograma con el rastreo bibliográfico; su estructura:
       carátula, índice, introducción, cuerpo, conclusiones,
       recomendaciones y bibliografía; «no sólo se narran hechos, sino
       que se interpreta y analiza… para obtener conclusiones y dar
       recomendaciones»). pp. 116 y 135: el periódico mural y el
       periódico escolar «con el aporte de todos los integrantes de la
       clase»; comparar noticias de diferentes periódicos e inferir su
       estructura. pp. 125 y 126: los géneros (reportaje, crónica,
       entrevista) y, otra vez, hecho y opinión. p. 127: los pies de foto
       (paratexto); la carta de lector (valoración, puntos de vista,
       crítica y sugerencias sobre una obra o una publicación, con
       actitudes democráticas y de tolerancia); el acta («documento en el
       que se registra todo lo sucedido, tratado y acordado en una
       reunión») y sus características (fidelidad, objetividad,
       exactitud, concisión, claridad, sencillez, corrección). p. 132: la
       carta personal va «a amigos o familiares» y la de lector, a un
       autor o a un periódico, con tono más formal y argumentativo.
       p. 133: el acta se redacta «a medida que se desarrolla la sesión»
       y lleva número, lugar, hora y fecha, local, lista de asistentes y
       de ausentes, orden del día, relato fiel, acuerdos y cierre (hora
       de terminación y firmas del secretario y de quien presidió).
       p. 166: la línea editorial («línea política del periódico a través
       de puntos de vista razonados y opiniones, no los firma nadie»).
       pp. 168 y 169: comparar posturas y líneas editoriales de
       diferentes periódicos; el tipo de público según la sección
       (noticias, reportajes, artículo de opinión, entrevista, deportes,
       cultural, clasificados). p. 172: el reglamento interno del grado,
       apegado al reglamento de toda la escuela (el DCNB lo llama
       «general»; aquí se escribe «de toda la escuela» porque la sonda de
       nombres propios lee esas dos palabras juntas como el título de una
       norma), y los cambios que se
       proponen «para un mejor funcionamiento de la institución».
     · Para Media: `_dev/dcnb/programa-espanol-11-btp.md` (género
       periodístico: la prensa en Honduras; la carta comercial, el acta,
       el comunicado, el aviso, la circular) y
       `_dev/dcnb/programa-espanol-11-bch.md` (la prensa; comunicados,
       avisos y correspondencia; documentos comerciales). Solo nombres.

   ► LOS CRUCES CON OTRAS MATERIAS, y de dónde sale su dato:
     · Ciencias Naturales y Sociales: la Reserva de la Biosfera del Río
       Plátano, con lo único que acredita la misión de las áreas
       protegidas (misiones/2y3ciclo-areas-protegidas-de-honduras/):
       Patrimonio de la Humanidad por la UNESCO en 1982, 832,000
       hectáreas en La Mosquitia y los pueblos pech, miskitu, tawahka y
       garífuna. La exposición escolar que da pie a esa noticia es
       INVENTADA y se dice inventada.
     · Ciencias Naturales: la carta de lector sobre la temporada de
       lluvias, con lo que acredita la misión de los desastres naturales
       (misiones/2y3ciclo-desastres-naturales/): la alerta temprana con
       sus colores verde, amarillo y rojo, y COPECO, que coordina la
       prevención y la respuesta.
     · Cívica: el reglamento del aula, escrito por artículos numerados,
       que es como se citan las leyes en `js/data/constitucion-honduras.js`
       («artículo 162»). De la Constitución no se afirma nada más.
     · Matemáticas: la tabla de una noticia. Sus números son inventados y
       se dicen inventados.

   ► REDACCIÓN NUESTRA (no hay definición en `_dev/`; se escribió clara
     para 7.º a 9.º y no es cita de nadie):
     · «Periódico»: publicación que sale cada cierto tiempo (cada día o
       cada semana) con noticias y otros textos.
     · «Noticia»: texto que informa de un hecho reciente. Que responde
       qué, quién, cuándo, dónde, cómo y por qué se apoya en el DCNB
       p. 97, que da esas preguntas para la crónica (y añade ¿para qué?).
     · «Titular»: el título de la noticia, en letras grandes, que tiene
       que decir lo mismo que el texto (el DCNB solo pide hacer
       predicciones a partir de los titulares). Que la
       noticia se arma con «titular, encabezado y cuerpo» es lo que el
       DCNB p. 97 dice de la crónica; aquí se aplica a la noticia. Del
       encabezado solo se enseña que es el primer párrafo, con lo más
       importante, y el examen no pregunta esa definición: pregunta el
       orden de las tres piezas.
     · Los nombres de las secciones: el DCNB p. 169 nombra «noticias»,
       «artículo de opinión», «deportes», «cultural» y «clasificados»;
       aquí van como Noticias, Opinión, Deportes, Cultura y Clasificados.
       Que las cartas de los lectores salen en Opinión es un ejemplo, no
       un dato.
     · «Sección», «hecho» (lo que pasó y se puede comprobar), «opinión»
       (lo que alguien piensa), «fuente» (la persona o el documento de
       donde sale un dato) y «tipo de lectores» (para quién se escribe
       cada parte del periódico).
     · «Editorial»: el texto en que el periódico da su opinión y que no
       lleva firma. Es nuestra lectura del paréntesis del DCNB p. 166.
     · «Postura» y «línea editorial»: la programación y el DCNB las
       nombran juntas y no las separan. Aquí la postura es la posición del
       periódico ante UN asunto concreto (a favor o en contra) y la línea
       editorial, las ideas que defiende SIEMPRE, sea cual sea la noticia
       del día (adaptación de «línea política del periódico», DCNB
       p. 166). El examen pregunta las dos con esa diferencia, para que
       no sean dos nombres de lo mismo.
     · «Carta de venta»: el DCNB solo dice que es un documento legal y la
       ejemplifica con ganado. Que nombra a quien vende, a quien compra y
       lo que se vende, y que la firman, es redacción nuestra.
     · «Reglamento»: conjunto ordenado de reglas que un grupo se da para
       funcionar; «artículo», cada regla numerada; «norma», regla que el
       grupo se compromete a cumplir.
     · Para qué sirve cada parte del informe (carátula, índice,
       introducción, bibliografía), qué hace el secretario («redacta el
       acta») y qué es un periodista o una entrevista: el DCNB los nombra
       y aquí se explican por lo que dice su nombre.

   ► LO QUE SE DEJÓ FUERA:
     · Ningún periódico real se nombra, y de ninguno se dice qué línea
       editorial tiene.
     · La carta comercial, el telegrama, la excusa, el vale y el recibo
       están en el DCNB de 7.º, pero no en febrero y marzo: no entran.
     · El artículo de opinión y la argumentación son de abril: aquí solo
       se distingue el hecho de la opinión.
     · La volanta, la bajada y el copete (DCNB p. 127) no se enseñan: del
       paratexto solo va el pie de foto.
     · Todas las noticias, cartas, actas y nombres de personas de los
       ejemplos son inventados para la misión.
     · El examen no pregunta nada que sea solo de Media, porque una forma
       le puede tocar a un alumno de 7.º.

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
  titulo:'El periódico y los textos de todos los días',
  emoji:'📰',
  materia:'Español',
  confeti:['#0f766e','#4ba89f','#d97706','#f59e0b','#fde68a'],
  impresion:{acento:'#c49000',fondo:'#fef9e7'},
  rutaEtiqueta:'Secuencia',
  widgetIdentifica:{paso:'Pista',fin:'🎉 ¡Todas las pistas resueltas!'},
  tareaIdentifica:['Copia cada oración en tu cuaderno y subraya la parte del periódico, de la carta o del acta que se indica. Escribe al lado qué es.','<strong>Ejemplo:</strong> Keyla escribió «Querida tía:» al empezar. → <span style="color:var(--jade);font-weight:700;">Saludo de una carta personal</span>'],
  tareaClasifica:{instruccion:'Copia la siguiente tabla en tu cuaderno. Para cada trozo de texto, escribe de qué clase de texto es, quién lo escribe, para quién y para qué sirve.',columnas:['Trozo de texto','¿Qué texto es?','¿Quién lo escribe?','¿Para quién?','¿Para qué sirve?']},
  diploma:['¡Sigue leyendo y escribiendo!','¡Muy buen trabajo!','¡Ya distingues un hecho de una opinión!','¡Sabes qué texto pide cada situación!','¡Jefe de redacción!']
};

// ===================== IDENTIDAD Y GUARDADO =====================
const SAVE_KEY='n3_periodico_v1';
const MXP=200;
const TOTAL_SECTIONS=13;

// ===================== LOGROS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'📰',label:'Primer quiz del periódico superado'},
  flash_master:{icon:'🃏',label:'Todas las tarjetas del periódico exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de textos de todos los días'},
  id_master:{icon:'🔍',label:'Cazador de secciones y titulares'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de la redacción'},
  nivel3:{icon:'✉️',label:'¡Corresponsal! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Editor! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de la redacción dominados'}
};

// ===================== NIVELES =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Lector 👓'},{t:55,n:'Corresponsal ✉️'},{t:90,n:'Reportero 🎙️'},{t:130,n:'Redactor ⌨️'},{t:165,n:'Editor 📰'},{t:190,n:'Jefe de redacción 🏆'}];

// ===================== TARJETAS =====================
const fcData=[
  {w:'Periódico',a:'📰 Publicación que <strong>sale cada cierto tiempo</strong> (cada día o cada semana) con noticias y otros textos. Sus textos van ordenados en <strong>secciones</strong> y encabezados por <strong>titulares</strong>.'},
  {w:'Noticia',a:'🗞️ Texto que <strong>informa de un hecho reciente</strong>. Cuenta lo que pasó, no lo que opina quien la escribe, y dice de dónde salió la información.'},
  {w:'Las seis preguntas',a:'❓ Una noticia completa responde: <strong>¿qué?, ¿quién?, ¿cuándo?, ¿dónde?, ¿cómo? y ¿por qué?</strong> Si falta una, al lector le queda una duda.'},
  {w:'Titular',a:'🔠 El <strong>título de la noticia</strong>, en letras grandes. Tiene que decir lo mismo que la noticia: no puede prometer algo que el texto no cuenta.'},
  {w:'Hecho y opinión',a:'⚖️ Un <strong>hecho</strong> es algo que pasó y se puede comprobar: «llovió tres días». Una <strong>opinión</strong> es lo que alguien piensa: «fue la peor lluvia del año».'},
  {w:'Secciones',a:'🗂️ Las partes en que el periódico <strong>agrupa sus textos según el tema</strong>: Noticias, Opinión, Deportes, Cultura, Clasificados.'},
  {w:'Línea editorial',a:'🧭 Las <strong>ideas que un periódico defiende siempre</strong>, sea cual sea la noticia del día. No es lo mismo que su <strong>postura</strong>, que es su posición ante un asunto concreto. Las dos se leen en su <strong>editorial</strong>, un texto de opinión razonada que no lleva firma: habla el periódico.'},
  {w:'Tipo de lectores',a:'👥 Cada periódico, y cada sección, se escribe <strong>pensando en quién lo va a leer</strong>: niños, jóvenes, aficionados al deporte, comerciantes.'},
  {w:'Carta personal',a:'💌 La que escribes a <strong>alguien cercano</strong>, un familiar o un amigo, con lenguaje sincero, afectivo y sencillo. Lleva lugar y fecha, <strong>saludo, cuerpo, despedida y firma</strong>.'},
  {w:'Carta de lector',a:'📮 La que un lector envía a un <strong>periódico, a una revista o a un autor</strong> para dar su valoración, su punto de vista, una crítica o una sugerencia. Con razones y con respeto.'},
  {w:'Carta de venta',a:'🐄 <strong>Documento legal</strong> que deja constancia de una venta, por ejemplo de ganado: dice quién vende (el vendedor), quién compra (el comprador) y qué se vende.'},
  {w:'Acta',a:'📝 Documento que <strong>registra todo lo sucedido, tratado y acordado en una reunión</strong>. Se redacta mientras la reunión ocurre y la firman el secretario y quien la presidió.'},
  {w:'Reglamento',a:'📜 Conjunto ordenado de <strong>reglas que un grupo se da para funcionar mejor</strong>. Cada regla va numerada y se llama <strong>artículo</strong>. El del grado se apega al de la escuela.'},
  {w:'Informe interpretativo',a:'📊 Texto que no solo narra hechos: los <strong>interpreta y analiza</strong> para sacar <strong>conclusiones</strong> y dar <strong>recomendaciones</strong>.'},
];

// ===================== QUIZ =====================
const qzData=[
  {q:'¿Qué texto informa de un hecho reciente?',o:['a) El reglamento','b) La noticia','c) La carta de venta','d) El acta'],c:1},
  {q:'El título de una noticia, en letras grandes, se llama…',o:['a) saludo','b) asunto','c) artículo','d) titular'],c:3},
  {q:'«Ayer llovió 40 milímetros» (dato inventado) es…',o:['a) un hecho','b) una opinión','c) un saludo','d) un acuerdo'],c:0},
  {q:'¿Qué partes lleva una carta personal, además del lugar y la fecha?',o:['a) Titular, encabezado y cuerpo','b) Carátula, índice y bibliografía','c) Saludo, cuerpo, despedida y firma','d) Orden del día y acuerdos'],c:2},
  {q:'¿Qué documento registra lo tratado y acordado en una reunión?',o:['a) El acta','b) La noticia','c) La carta personal','d) El clasificado'],c:0},
  {q:'¿A quién se le envía una carta de lector?',o:['a) A un familiar que vive lejos','b) Al comprador de una vaca','c) Al secretario de la asamblea','d) A un periódico, a una revista o a un autor'],c:3},
  {q:'En un reglamento, cada regla numerada se llama…',o:['a) titular','b) sección','c) artículo','d) despedida'],c:2},
  {q:'¿Qué hace un informe interpretativo, además de narrar los hechos?',o:['a) Los adorna con rimas','b) Los interpreta y saca conclusiones','c) Los convierte en titulares','d) Los guarda en secreto'],c:1},
  {q:'Las ideas que un periódico defiende una y otra vez forman su…',o:['a) orden del día','b) pie de foto','c) línea editorial','d) carta de venta'],c:2},
];

// ===================== CLASIFICA =====================
// «Clasifica textos por su función»: cada grupo enfrenta dos textos que
// el alumno suele confundir, y lo que los separa es para qué se escriben.
const classGroups=[
  {label:['Hecho','Opinión'],headA:'📰 Informa de un hecho',headB:'💬 Da una opinión',colA:'hec',colB:'opi',
   words:[{w:'«El partido terminó 2 a 1»',t:'hec'},{w:'«Fue el mejor partido del año»',t:'opi'},{w:'«La feria abre a las ocho»',t:'hec'},{w:'«La feria estuvo aburrida»',t:'opi'},{w:'«Sembraron 40 árboles»',t:'hec'},{w:'«Sembrar árboles es lo más bonito»',t:'opi'},{w:'«El río creció un metro»',t:'hec'},{w:'«Ese río da miedo»',t:'opi'},{w:'«Asistieron 30 alumnos»',t:'hec'},{w:'«Deberían venir más alumnos»',t:'opi'}]},
  {label:['Carta personal','Carta de lector'],headA:'💌 Carta personal',headB:'📮 Carta de lector',colA:'per',colB:'lec',
   words:[{w:'«Querida abuela:»',t:'per'},{w:'«Señores del periódico:»',t:'lec'},{w:'«Te extraño mucho»',t:'per'},{w:'«Opino que la nota fue incompleta»',t:'lec'},{w:'«Con cariño, tu nieta»',t:'per'},{w:'«Atentamente, un lector de octavo grado»',t:'lec'},{w:'«¿Cómo sigue el perro?»',t:'per'},{w:'«Sugiero publicar el horario de la biblioteca»',t:'lec'},{w:'«Un abrazo para mis primos»',t:'per'},{w:'«Felicito al periódico por su reportaje»',t:'lec'}]},
  {label:['Acta','Noticia'],headA:'📝 Es de un acta',headB:'🗞️ Es de una noticia',colA:'act',colB:'not',
   words:[{w:'«Se abrió la sesión a las 9:00 a. m.»',t:'act'},{w:'«Lluvias dañan el puente de la aldea»',t:'not'},{w:'«Lista de asistentes»',t:'act'},{w:'«El hecho ocurrió ayer por la tarde»',t:'not'},{w:'«Orden del día»',t:'act'},{w:'«Según informó la alcaldía»',t:'not'},{w:'«Se acordó por mayoría»',t:'act'},{w:'«Foto: vecinos reparan el camino»',t:'not'},{w:'«Firman la secretaria y el presidente»',t:'act'},{w:'«Octavo grado gana la feria de ciencias»',t:'not'}]},
  {label:['Reglamento','Informe'],headA:'📜 Es de un reglamento',headB:'📊 Es de un informe interpretativo',colA:'reg',colB:'inf',
   words:[{w:'«Artículo 1. Llegamos puntuales»',t:'reg'},{w:'«Conclusiones»',t:'inf'},{w:'«Artículo 2. Pedimos la palabra»',t:'reg'},{w:'«Recomendaciones»',t:'inf'},{w:'«Está permitido usar la biblioteca del aula»',t:'reg'},{w:'«Carátula»',t:'inf'},{w:'«Artículo 5. Cuidamos los pupitres»',t:'reg'},{w:'«Bibliografía»',t:'inf'},{w:'«No se permite comer durante la clase»',t:'reg'},{w:'«Los datos indican que el agua bajó»',t:'inf'}]},
];

// ===================== IDENTIFICA =====================
const idData=[
  {s:['El','marcador','del','partido','salió','en','Deportes.'],c:6,busca:'la sección del periódico'},
  {s:['En','Clasificados','ofrecen','una','bicicleta','usada.'],c:1,busca:'la sección del periódico'},
  {s:['Las','lluvias','de','ayer','salen','en','Noticias.'],c:6,busca:'la sección del periódico'},
  {s:['Cultura','anuncia','el','festival','de','danza.'],c:0,busca:'la sección del periódico'},
  {s:['La','carta','de','Keyla','salió','en','Opinión.'],c:6,busca:'la sección del periódico'},
  {s:['El','titular','ocupa','media','página','del','periódico.'],c:1,busca:'el título de la noticia'},
  {s:['El','editorial','comenta','el','problema','del','agua.'],c:1,busca:'el texto que da la postura del periódico'},
  {s:['Debajo','de','la','foto','se','lee','su','pie.'],c:7,busca:'el texto breve que explica una foto'},
];

// ===================== COMPLETA =====================
// «Completa un acta»: las ocho oraciones son, en orden, las partes de un
// acta (DCNB p. 133). El acta es inventada.
const cmpData=[
  {s:'Acta ___ 4 de la asamblea de octavo grado.',opts:['capítulo','número','página'],c:1},
  {s:'En el ___ de octavo grado, a las 10:00 a. m. del lunes 9 de marzo, se abrió la sesión.',opts:['aula','titular','saludo'],c:0},
  {s:'Lista de ___: 30 alumnos presentes y la profesora guía.',opts:['lectores','vendedores','asistentes'],c:2},
  {s:'Lista de ___: Kevin Mejía, por enfermedad.',opts:['titulares','ausentes','artículos'],c:1},
  {s:'___ del día: 1. La falta de sombra en el patio. 2. Asuntos varios.',opts:['Sección','Firma','Orden'],c:2},
  {s:'Después de oír tres propuestas, se ___ por mayoría sembrar 40 árboles.',opts:['acordó','opinó','vendió'],c:0},
  {s:'Se cerró la sesión a las 10:40 a. m. ___ la secretaria y el presidente.',opts:['Venden','Firman','Titulan'],c:1},
  {s:'Esta acta cuenta lo que pasó con ___: tal como fue, sin cambiar nada.',opts:['exageración','cariño','fidelidad'],c:2},
];

// ===================== WIDGETS =====================
// Widget 1: ordenar los pasos
const ordenaData=[
  {label:'Escribir una noticia',steps:['Averiguas qué pasó y a quién preguntarle','Respondes qué, quién, cuándo, dónde, cómo y por qué','Escribes el encabezado con lo más importante','Agregas los detalles en el cuerpo','Pones un titular que diga lo mismo que la noticia']},
  {label:'Las partes de una carta personal',steps:['Lugar y fecha','Saludo','Cuerpo de la carta','Despedida','Firma']},
  {label:'Las partes de un acta',steps:['Número del acta, lugar, hora y fecha','Lista de asistentes y de ausentes','Orden del día','Relato de lo tratado y acuerdos','Hora de cierre y firmas']},
  {label:'Las partes de un informe interpretativo',steps:['Carátula','Índice','Introducción','Cuerpo','Conclusiones','Recomendaciones','Bibliografía']},
];
// Widget 2: de la descripción al nombre. Las cuatro primeras, «¿en qué
// sección sale?»; las otras cuatro, «¿qué texto es?».
const describeData=[
  {desc:'«La selección juvenil ganó ayer su segundo partido» (noticia inventada)',ans:'Deportes',opts:['Noticias','Deportes','Cultura','Clasificados']},
  {desc:'«Se vende refrigeradora en buen estado. Llamar por las tardes»',ans:'Clasificados',opts:['Noticias','Deportes','Cultura','Clasificados']},
  {desc:'«El grupo de teatro del instituto estrena su obra este viernes»',ans:'Cultura',opts:['Noticias','Deportes','Cultura','Clasificados']},
  {desc:'«Reparan el puente que une las dos aldeas» (noticia inventada)',ans:'Noticias',opts:['Noticias','Deportes','Cultura','Clasificados']},
  {desc:'Registra lo sucedido, tratado y acordado en una reunión',ans:'Acta',opts:['Acta','Reglamento','Carta de venta','Informe interpretativo']},
  {desc:'Reglas numeradas que un grupo se da para funcionar mejor',ans:'Reglamento',opts:['Acta','Reglamento','Carta de venta','Informe interpretativo']},
  {desc:'Documento legal que deja constancia de quién le vendió qué a quién',ans:'Carta de venta',opts:['Acta','Reglamento','Carta de venta','Informe interpretativo']},
  {desc:'Presenta datos, los analiza y termina con conclusiones y recomendaciones',ans:'Informe interpretativo',opts:['Acta','Reglamento','Carta de venta','Informe interpretativo']},
];
// Widget 3: «ponle titular». Los hechos son inventados. El titular bueno
// dice lo mismo que la noticia; los otros exageran, opinan o hablan de
// otra cosa.
const emparejaData=[
  {term:'La biblioteca de la escuela cerrará este viernes, solo por un día, para limpieza.',resp:'La biblioteca cierra el viernes por limpieza',opts:['La biblioteca cierra el viernes por limpieza','¡Cierran la biblioteca!','La biblioteca es el lugar más aburrido','Llegan libros nuevos a la dirección']},
  {term:'El equipo de noveno y el de octavo empataron 1 a 1 en la final del torneo.',resp:'Noveno y octavo empatan 1 a 1 en la final',opts:['Noveno y octavo empatan 1 a 1 en la final','¡Paliza histórica de noveno!','El peor partido que se ha visto','Se suspende el torneo']},
  {term:'Treinta y dos alumnos de octavo grado sembraron 40 árboles en el predio de la escuela.',resp:'Octavo grado siembra 40 árboles en la escuela',opts:['Octavo grado siembra 40 árboles en la escuela','La escuela ya es un bosque','Sembrar árboles es lo máximo','Octavo grado gana el torneo']},
  {term:'La dirección informó que el lunes habrá clases normales, a pesar del rumor.',resp:'El lunes hay clases normales, informa la dirección',opts:['El lunes hay clases normales, informa la dirección','Dicen que el lunes no hay clases','¡Semana de vacaciones!','La dirección no dice nada']},
  {term:'Alumnos de noveno expusieron sobre la Reserva de la Biosfera del Río Plátano.',resp:'Noveno expone sobre la Biosfera del Río Plátano',opts:['Noveno expone sobre la Biosfera del Río Plátano','Descubren un río nuevo','La exposición más bonita del mundo','Noveno viaja a La Mosquitia']},
];
// Widget 4: «¿qué texto necesitas?»
const situacionData=[
  {term:'Tu grado se reunió y decidió hacer una rifa. Hay que dejar constancia de lo acordado.',resp:'Un acta',opts:['Un acta','Una noticia','Una carta personal','Un reglamento']},
  {term:'Quieres contarle a tu tío, que vive en otra ciudad, cómo va tu año escolar.',resp:'Una carta personal',opts:['Una carta personal','Un acta','Un informe interpretativo','Una carta de venta']},
  {term:'Leíste una nota del periódico escolar y no estás de acuerdo. Quieres decirlo ahí mismo.',resp:'Una carta de lector',opts:['Una carta de lector','Un reglamento','Un acta','Una carta de venta']},
  {term:'El grado quiere tener por escrito lo que se vale y lo que no se vale en el aula.',resp:'Un reglamento',opts:['Un reglamento','Una noticia','Una carta personal','Un informe interpretativo']},
  {term:'Tu equipo midió cuánta basura se recoge en el recreo y tiene que explicar qué significan los datos.',resp:'Un informe interpretativo',opts:['Un informe interpretativo','Una carta de lector','Un acta','Una carta de venta']},
  {term:'Toda la escuela debe enterarse de que el sábado hubo una jornada de siembra.',resp:'Una noticia',opts:['Una noticia','Un reglamento','Una carta de venta','Una carta personal']},
];

// ===================== RETO =====================
const retoPairs=[
  {label:['Hecho','Opinión'],btnA:'📰 Hecho',btnB:'💬 Opinión',colA:'hec',colB:'opi',
   words:[{w:'«Llovió toda la noche»',t:'hec'},{w:'«Qué lluvia tan fea»',t:'opi'},{w:'«El acto empezó a las 8»',t:'hec'},{w:'«El acto estuvo largo»',t:'opi'},{w:'«Ganó noveno grado»',t:'hec'},{w:'«Noveno no merecía ganar»',t:'opi'},{w:'«Hay 12 aulas»',t:'hec'},{w:'«Las aulas son feas»',t:'opi'},{w:'«Faltaron 3 alumnos»',t:'hec'},{w:'«Faltar es de vagos»',t:'opi'}]},
  {label:['Del periódico','De una carta'],btnA:'📰 Del periódico',btnB:'✉️ De una carta',colA:'per',colB:'car',
   words:[{w:'Titular',t:'per'},{w:'Saludo',t:'car'},{w:'Sección',t:'per'},{w:'Despedida',t:'car'},{w:'Editorial',t:'per'},{w:'Firma',t:'car'},{w:'Pie de foto',t:'per'},{w:'Remitente',t:'car'},{w:'Clasificados',t:'per'},{w:'Destinatario',t:'car'}]},
  {label:['De un acta','De un informe'],btnA:'📝 De un acta',btnB:'📊 De un informe',colA:'act',colB:'inf',
   words:[{w:'Orden del día',t:'act'},{w:'Carátula',t:'inf'},{w:'Lista de asistentes',t:'act'},{w:'Índice',t:'inf'},{w:'Acuerdos',t:'act'},{w:'Conclusiones',t:'inf'},{w:'Lista de ausentes',t:'act'},{w:'Recomendaciones',t:'inf'},{w:'Hora de cierre',t:'act'},{w:'Bibliografía',t:'inf'}]},
];

// ===================== GENERADOR DE TAREAS =====================
const identifyTaskDB=[
  {s:'Arriba de la noticia, en letras grandes, decía: «Reparan el puente de la aldea».',type:'Titular'},
  {s:'La carta de Marlon empezaba así: «Querido primo:».',type:'Saludo de una carta personal'},
  {s:'Al final de la reunión se anotó: «Se cerró la sesión a las 11:00 a. m.».',type:'Cierre de un acta'},
  {s:'En la hoja del grado se lee: «Artículo 3. Pedimos la palabra antes de hablar».',type:'Artículo de un reglamento'},
  {s:'«El sábado, 32 alumnos sembraron 40 árboles en la escuela».',type:'Hecho (responde cuándo, quién, qué y dónde)'},
  {s:'«Me parece que la nota sobre el torneo fue injusta con octavo grado».',type:'Opinión, propia de una carta de lector'},
  {s:'Debajo de la fotografía decía: «Alumnos de octavo riegan los árboles».',type:'Pie de foto'},
  {s:'La última parte del trabajo se titulaba «Recomendaciones».',type:'Parte de un informe interpretativo'},
  {s:'El papel decía quién vendía la vaca, quién la compraba y llevaba las dos firmas.',type:'Carta de venta'},
  {s:'La carta terminaba con «Un abrazo fuerte, tu sobrina Dania».',type:'Despedida y firma de una carta personal'},
];
const classifyTaskDB=[
  {w:'«Lluvias dañan el puente de la aldea»',gen:'Noticia (su titular)',n:'Un periodista',g:'Los lectores del periódico',t:'Informar de un hecho'},
  {w:'«Querida abuela: ¿cómo sigue de la rodilla?»',gen:'Carta personal',n:'Una nieta',g:'Su abuela',t:'Comunicarse con alguien cercano'},
  {w:'«Señores del periódico: sugiero publicar el horario de la biblioteca»',gen:'Carta de lector',n:'Un lector',g:'El periódico',t:'Dar una opinión o una sugerencia'},
  {w:'«Se acordó por mayoría hacer la rifa el viernes»',gen:'Acta',n:'El secretario',g:'El grupo que se reunió',t:'Dejar constancia de lo acordado'},
  {w:'«Artículo 4. Cuidamos los libros del aula»',gen:'Reglamento',n:'El grado, entre todos',g:'Todo el grado',t:'Ordenar la convivencia'},
  {w:'«Conclusiones: el consumo de agua bajó en marzo» (dato inventado)',gen:'Informe interpretativo',n:'Un equipo que investigó',g:'La clase o la dirección',t:'Explicar lo que significan los datos'},
  {w:'«Vendo a don Julián una vaca de color negro»',gen:'Carta de venta',n:'El vendedor',g:'El comprador',t:'Dejar constancia legal de una venta'},
  {w:'«Se vende bicicleta en buen estado»',gen:'Clasificado',n:'Quien vende',g:'Los lectores del periódico',t:'Anunciar algo que se ofrece'},
];
const completeTaskDB=[
  {s:'El texto del periódico que informa de un hecho reciente es la ___.',opts:['noticia','despedida','carátula'],ans:'noticia'},
  {s:'El título de una noticia se llama ___.',opts:['saludo','titular','artículo'],ans:'titular'},
  {s:'Lo que alguien piensa sobre un hecho es una ___.',opts:['sección','firma','opinión'],ans:'opinión'},
  {s:'La persona que recibe una carta es el ___.',opts:['destinatario','secretario','vendedor'],ans:'destinatario'},
  {s:'El documento que registra lo acordado en una reunión es el ___.',opts:['titular','acta','clasificado'],ans:'acta'},
  {s:'En un reglamento, cada regla numerada es un ___.',opts:['párrafo','saludo','artículo'],ans:'artículo'},
  {s:'Un informe interpretativo termina con conclusiones, recomendaciones y ___.',opts:['bibliografía','despedida','titulares'],ans:'bibliografía'},
  {s:'La carta de venta es un documento ___.',opts:['secreto','legal','literario'],ans:'legal'},
];
// Aquí va el «generador de titulares»: las cuatro primeras tareas piden
// escribir un titular para un hecho inventado.
const explainQuestions=[
  {q:'Escribe un titular de no más de ocho palabras para este hecho (inventado): «El sábado por la mañana, los padres de familia pintaron las seis aulas del segundo piso».',ans:'Respuesta abierta. Ejemplo: «Padres de familia pintan seis aulas de la escuela». Se valora que diga lo mismo que el hecho, sin exagerar ni opinar.'},
  {q:'Escribe un titular para este hecho (inventado): «La feria de ciencias se pasó del jueves al viernes porque el jueves no habrá energía eléctrica».',ans:'Respuesta abierta. Ejemplo: «La feria de ciencias se pasa al viernes». Un titular como «Cancelan la feria» engañaría al lector.'},
  {q:'Este titular engaña: «¡Se acabó el recreo!». La nota dice que el recreo del martes durará diez minutos menos por un acto cívico. Escribe un titular que diga la verdad.',ans:'Respuesta abierta. Ejemplo: «El recreo del martes será más corto por un acto cívico».'},
  {q:'Escribe un titular y responde las seis preguntas (qué, quién, cuándo, dónde, cómo y por qué) para una noticia de tu grado. Si inventas algún dato, dilo.',ans:'Respuesta abierta. Se valora que el titular diga lo mismo que la noticia y que las seis preguntas tengan respuesta.'},
  {q:'Escribe dos oraciones sobre tu escuela: una que sea un hecho y otra que sea una opinión. Explica cómo se comprueba el hecho.',ans:'Respuesta abierta. El hecho se puede comprobar (contando, midiendo o preguntando); la opinión dice lo que la persona piensa.'},
  {q:'¿En qué se parecen y en qué se diferencian una carta personal y una carta de lector?',ans:'Las dos llevan saludo, cuerpo, despedida y firma. La personal va a alguien cercano y usa un lenguaje afectivo y espontáneo; la de lector va a un periódico, a una revista o a un autor, y da una opinión con razones y un tono más formal.'},
  {q:'¿Por qué el acta se redacta mientras ocurre la reunión y no una semana después?',ans:'Porque debe ser fiel y exacta: registra todo lo sucedido, tratado y acordado. De memoria se olvidan o se cambian los acuerdos.'},
  {q:'Redacta tres artículos para el reglamento de tu aula.',ans:'Respuesta abierta. Cada regla va numerada («Artículo 1…»), es clara y no contradice el reglamento de toda la escuela.'},
];

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['S','N','L','T','I','T','U','L','A','R'],
    ['N','E','J','J','S','M','F','M','B','F'],
    ['O','R','C','M','V','Q','M','D','H','X'],
    ['T','P','S','C','Q','H','R','S','P','P'],
    ['I','R','F','D','I','N','X','D','Q','M'],
    ['C','P','E','R','I','O','D','I','C','O'],
    ['I','D','G','X','F','X','N','T','Q','C'],
    ['A','L','E','C','T','O','R','J','J','N'],
    ['O','P','I','N','I','O','N','X','K','X'],
    ['V','C','C','P','L','H','E','C','H','O']
  ],words:[
    {w:'TITULAR',cells:[[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
    {w:'NOTICIA',cells:[[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]},
    {w:'SECCION',cells:[[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]]},
    {w:'LECTOR',cells:[[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]]},
    {w:'HECHO',cells:[[9,5],[9,6],[9,7],[9,8],[9,9]]},
    {w:'OPINION',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6]]},
    {w:'PERIODICO',cells:[[5,1],[5,2],[5,3],[5,4],[5,5],[5,6],[5,7],[5,8],[5,9]]}
  ]},
  {size:10,grid:[
    ['A','T','R','X','A','G','B','S','C','P'],
    ['C','G','E','K','C','K','I','A','D','V'],
    ['U','K','G','T','T','P','N','L','Y','N'],
    ['E','K','L','J','A','F','F','U','C','M'],
    ['R','Y','A','F','K','I','O','D','A','J'],
    ['D','K','M','X','D','R','R','O','R','J'],
    ['O','V','E','D','F','M','M','F','T','K'],
    ['T','L','N','P','G','A','E','J','A','Z'],
    ['C','Q','T','B','D','N','C','D','J','B'],
    ['Z','Q','O','T','G','Z','S','Q','L','T']
  ],words:[
    {w:'CARTA',cells:[[3,8],[4,8],[5,8],[6,8],[7,8]]},
    {w:'ACTA',cells:[[0,4],[1,4],[2,4],[3,4]]},
    {w:'FIRMA',cells:[[3,5],[4,5],[5,5],[6,5],[7,5]]},
    {w:'SALUDO',cells:[[0,7],[1,7],[2,7],[3,7],[4,7],[5,7]]},
    {w:'REGLAMENTO',cells:[[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2],[9,2]]},
    {w:'INFORME',cells:[[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]]},
    {w:'ACUERDO',cells:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0]]}
  ]}
];

// ===================== EXAMEN CONCEPTUAL =====================
// UN DATO, UNA PREGUNTA. Cada forma saca cinco de cada banco y pueden caer
// juntas cualesquiera, así que ninguna pregunta pide un dato que otra ya pide
// (su `k` no se repite) y ninguna respuesta aparece escrita en otra pregunta,
// tampoco como opción equivocada. Lo comprueba
// `_dev/verifica-examen-sin-pistas.js`.
//
// ⚠️ Y ninguna la contesta la historia del rumor del viernes (la tarjeta con
// que abre la misión) ni usa los hechos del laboratorio (la siembra de los
// 40 árboles): los ejemplos del examen son otros.
//
// ⚠️ El examen no pregunta nada que sea solo de Media: una forma le puede
// tocar a un alumno de 7.º. Lo de Media va en su tarjeta y en la ficha.
const evalTFBank=[
  {q:'En una noticia, quien la escribe debe dar su opinión en cada párrafo.',a:false,k:'tf-noticia-opina',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (textos expositivos: la noticia) · DCNB p. 126 (diferencian entre un hecho y una opinión)'},
  {q:'El acta se redacta a medida que se desarrolla la reunión.',a:true,k:'tf-acta-durante',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (acta) · DCNB p. 133 (redactarla a medida que se desarrolla la sesión)'},
  {q:'En una carta personal se usa un lenguaje sincero, afectivo y sencillo.',a:true,k:'tf-personal-lenguaje',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (cartas personales) · DCNB pp. 96 y 132 (lenguaje sincero, afectivo y sencillo)'},
  {q:'Dos periódicos pueden comentar el mismo suceso de maneras distintas.',a:true,k:'tf-dos-periodicos',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (postura, línea editorial) · DCNB p. 168 (comparan posturas y líneas editoriales en diferentes periódicos)'},
  {q:'La carta de venta es un documento legal.',a:true,k:'tf-venta-legal',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (carta de venta) · DCNB p. 97 (la carta de venta como un documento legal)'},
  {q:'«La escuela tiene doce aulas» es una opinión: no hay manera de comprobarlo.',a:false,k:'tf-doce-aulas',grado:'7.º a 9.º',curriculo:'DCNB pp. 92, 126 y 166 (diferencian entre un hecho y una opinión)'},
  {q:'Un informe interpretativo se limita a narrar lo sucedido, sin analizarlo.',a:false,k:'tf-informe-narra',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (informe interpretativo) · DCNB p. 98 (no sólo se narran hechos, sino que se interpreta y analiza)'},
  {q:'El reglamento interno de un grado puede contradecir el reglamento de toda la escuela.',a:false,k:'tf-reglamento-escuela',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el reglamento) · DCNB p. 172 (reglamento interno del grado, apegado al reglamento de toda la escuela)'},
  {q:'En un periódico, los textos van revueltos: no se agrupan por temas.',a:false,k:'tf-revueltos',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el periódico: secciones) · DCNB pp. 92, 125 y 166'},
  {q:'Una carta de lector puede dirigirse a un periódico o a una revista.',a:true,k:'tf-lector-destino',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (cartas de lector) · DCNB p. 127 (a una publicación: periódico, revista)'}
];
const evalMCBank=[
  {q:'«Octavo grado gana la feria de ciencias», escrito en letras grandes sobre una noticia, es…',o:['a) el cartel','b) el titular','c) el lema','d) el sello'],a:1,k:'mc-titular',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (el periódico; titulares, en 9.º) · DCNB pp. 92, 125 y 166 (titulares) · la definición es redacción nuestra'},
  {q:'«Ayer, los bomberos apagaron un incendio en el mercado». ¿Qué pregunta de la noticia responde «en el mercado»?',o:['a) ¿Quién?','b) ¿Cuándo?','c) ¿Por qué?','d) ¿Dónde?'],a:3,k:'mc-donde',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (la noticia) · DCNB p. 97 (¿quién?, ¿qué?, ¿cuándo?, ¿dónde?, ¿cómo?, ¿por qué?) · el DCNB da esas preguntas para la crónica; aplicarlas a la noticia es redacción nuestra'},
  {q:'¿En qué parte del periódico buscas el resultado del partido de fútbol del domingo?',o:['a) En Deportes','b) En Clasificados','c) En Cultura','d) En Opinión'],a:0,k:'mc-deportes',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el periódico: secciones) · DCNB p. 169 (sección del periódico: deportes, cultural, clasificados) · el nombre de la sección, tal como se escribe aquí, es redacción nuestra'},
  {q:'¿Para qué sirve un acta?',o:['a) Para vender un animal','b) Para felicitar a un familiar','c) Para que conste lo que se trató en una reunión','d) Para anunciar un producto'],a:2,k:'mc-acta-sirve',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (acta) · DCNB p. 127 (se registra todo lo sucedido, tratado y acordado en una reunión)'},
  {q:'Quieres contarle a tu prima, que vive lejos, cómo te fue en tu cumpleaños. ¿Qué texto le escribes?',o:['a) Un reglamento','b) Una carta personal','c) Un acta','d) Un informe'],a:1,k:'mc-carta-personal',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (cartas personales) · DCNB p. 132 (dirigidas a amigos o familiares)'},
  {q:'¿Cuál de estas oraciones es una opinión?',o:['a) «El desfile empezó a las ocho»','b) «Desfilaron seis escuelas»','c) «El desfile pasó por el parque»','d) «Fue el desfile más bonito de todos»'],a:3,k:'mc-opinion',grado:'7.º a 9.º',curriculo:'DCNB pp. 92, 126 y 166 (diferencian entre un hecho y una opinión)'},
  {q:'El texto en que un periódico da su propio punto de vista, sin el nombre de quien lo escribió, es…',o:['a) el editorial','b) el clasificado','c) el crucigrama','d) el horóscopo'],a:0,k:'mc-editorial',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (postura, línea editorial) · DCNB p. 166 (puntos de vista razonados y opiniones, no los firma nadie) · que el editorial es ese texto sin firma es nuestra lectura del paréntesis: redacción nuestra'},
  {q:'Los alumnos de noveno quieren dejar por escrito, punto por punto, lo que se vale y lo que no se vale en el aula. ¿Qué texto necesitan?',o:['a) Una noticia','b) Una carta de lector','c) Un reglamento','d) Un acta'],a:2,k:'mc-reglamento',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (texto funcional: el reglamento) · DCNB p. 172 (reglamento interno del grado) · la definición es redacción nuestra'},
  {q:'En una carta, la persona que la recibe es…',o:['a) el cartero','b) el testigo','c) el destinatario','d) el editor'],a:2,k:'mc-destinatario',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (cartas personales) · DCNB p. 93 (remitente, destinatario y asunto)'},
  {q:'¿Qué va primero en un informe interpretativo?',o:['a) La carátula','b) La bibliografía','c) Las recomendaciones','d) El cuerpo'],a:0,k:'mc-caratula',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (informe interpretativo) · DCNB p. 98 (carátula, índice, introducción, cuerpo, conclusiones, recomendaciones y bibliografía)'}
];
const evalCPBank=[
  {q:'La persona que escribe y envía una carta es el ___.',a:'remitente',acc:['remitente'],k:'cp-remitente',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (cartas personales) · DCNB p. 93 (remitente, destinatario y asunto)'},
  {q:'Lo que una persona piensa sobre algo que pasó es una ___.',a:'opinión',acc:['opinión','opinion'],k:'cp-opinion',grado:'7.º a 9.º',curriculo:'DCNB pp. 92, 126 y 166 (diferencian entre un hecho y una opinión) · la definición es redacción nuestra'},
  {q:'El acta lleva la lista de ___, con los nombres de quienes llegaron a la reunión.',a:'asistentes',acc:['asistentes','presentes'],k:'cp-asistentes',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (acta) · DCNB p. 133 (lista de asistentes)'},
  {q:'Lo que un grupo decide entre todos, y que queda anotado en el acta, son los ___.',a:'acuerdos',acc:['acuerdos','acuerdo'],k:'cp-acuerdos',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (acta) · DCNB pp. 127 y 133 (acuerdos tomados)'},
  {q:'Las partes en que un periódico agrupa sus textos según el tema se llaman ___.',a:'secciones',acc:['secciones','sección','seccion'],k:'cp-secciones',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el periódico: secciones) · DCNB pp. 92, 125 y 166 · la definición es redacción nuestra'},
  {q:'Al final de una investigación, lo que se saca en claro después de analizar los datos son las ___.',a:'conclusiones',acc:['conclusiones','conclusión','conclusion'],k:'cp-conclusiones',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (informe interpretativo) · DCNB p. 98 (para obtener conclusiones)'},
  {q:'El texto del periódico que informa de un suceso reciente es la ___.',a:'noticia',acc:['noticia'],k:'cp-noticia',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (textos expositivos: la noticia) · DCNB p. 135 (comparan las noticias de diferentes periódicos) · la definición es redacción nuestra'},
  {q:'La posición que un periódico toma frente a un asunto concreto, a favor o en contra, es su ___.',a:'postura',acc:['postura'],k:'cp-postura',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el periódico: postura) · DCNB pp. 92 y 166 (postura y línea editorial) · la definición es redacción nuestra'},
  {q:'En una carta, la parte donde va el mensaje, entre el inicio y el cierre, es el ___.',a:'cuerpo',acc:['cuerpo'],k:'cp-cuerpo',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (cartas personales) · DCNB pp. 96 y 132 (saludo, cuerpo de la carta, despedida y firma)'},
  {q:'El periódico que se pega en una pared de la escuela para que todos lo lean es un periódico ___.',a:'mural',acc:['mural'],k:'cp-mural',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el periódico) · DCNB p. 116 (elaboran un periódico mural)'}
];
const evalPRBank=[
  {term:'Saludo',def:'«Querida abuela:»',k:'pr-saludo',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (cartas personales) · DCNB pp. 96 y 132 (saludo)'},
  {term:'Despedida',def:'«Con cariño, hasta pronto»',k:'pr-despedida',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 · DCNB pp. 96 y 132 (despedida)'},
  {term:'Firma',def:'Tu nombre, escrito al final de la carta',k:'pr-firma',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 · DCNB pp. 96 y 132 (firma)'},
  {term:'Lugar y fecha',def:'«La Esperanza, 3 de marzo de 2027»',k:'pr-lugar-fecha',grado:'7.º y 8.º',curriculo:'DCNB pp. 96 y 132 (referencias al tiempo, la fecha, y al espacio, el lugar) · el ejemplo se escribió para la misión'},
  {term:'Clasificados',def:'«Se vende bicicleta usada en buen estado»',k:'pr-clasificados',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (secciones) · DCNB p. 169 (clasificados) · el ejemplo se escribió para la misión · el nombre de la sección, tal como se escribe aquí, es redacción nuestra'},
  {term:'Cultura',def:'«El grupo de danza se presenta hoy en el parque»',k:'pr-cultura',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (secciones) · DCNB p. 169 (cultural) · el ejemplo se escribió para la misión · el nombre de la sección, tal como se escribe aquí, es redacción nuestra'},
  {term:'Pie de foto',def:'Texto breve que explica una imagen',k:'pr-pie-foto',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el periódico) · DCNB p. 127 (paratexto: pies de foto)'},
  {term:'Orden del día',def:'Lista de los puntos que se van a tratar',k:'pr-orden-dia',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (acta) · DCNB p. 133 (orden del día)'},
  {term:'Secretario',def:'Redacta el acta durante la sesión',k:'pr-secretario',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (acta) · DCNB p. 133 (firmas del secretario y de quien presidió) · lo que hace el secretario es redacción nuestra'},
  {term:'Comprador',def:'Paga y se queda con el animal',k:'pr-comprador',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (carta de venta) · DCNB p. 97 (vendedores de ganado y compradores) · quién vende y quién compra en la carta es redacción nuestra'}
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
  {q:'Un titular puede prometer algo que el texto no cuenta, con tal de llamar la atención.',a:false,k:'tf-titular-promete',fuente:'Guía (Aprende): La noticia y sus seis preguntas · Actividad «Ponle titular»',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el periódico: titulares) · DCNB p. 166 (predicciones a partir de los titulares) · que el titular debe decir lo mismo que el texto es redacción nuestra'},
  {q:'Una noticia completa dice qué pasó, quién lo hizo, cuándo y dónde.',a:true,k:'tf-noticia-completa',fuente:'Guía (Aprende): La noticia y sus seis preguntas · Ficha, página 1 (2. La noticia y sus seis preguntas)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (la noticia) · DCNB p. 97 (¿quién?, ¿qué?, ¿cuándo?, ¿dónde?) · el DCNB da esas preguntas para la crónica; aplicarlas a la noticia es redacción nuestra'},
  {q:'Quien redacta un acta anota lo que pasó, aunque a él no le guste lo que se decidió.',a:true,k:'tf-acta-fiel',fuente:'Ficha, página 3 (5. El acta) · Actividad Completa 8',grado:'8.º',curriculo:'DCNB pp. 127 y 133 (características del acta: fidelidad, objetividad)'},
  {q:'«El río creció dos metros» es una opinión.',a:false,k:'tf-rio',fuente:'Guía (Aprende): Hecho y opinión · Actividad Clasifica: Informa de un hecho',grado:'7.º a 9.º',curriculo:'DCNB pp. 92, 126 y 166 (diferencian entre un hecho y una opinión)'},
  {q:'Un reglamento se escribe para que el grupo funcione mejor.',a:true,k:'tf-reglamento-funciona',fuente:'Ficha, página 3 (6. El reglamento) · Actividad Tarjetas: Reglamento',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el reglamento) · DCNB p. 172 (para un mejor funcionamiento de la institución)'},
  {q:'Un informe se escribe sin buscar antes información sobre el tema.',a:false,k:'tf-informe-buscar',fuente:'Ficha, página 3 (7. El informe interpretativo)',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (informe interpretativo) · DCNB p. 98 (rastreo bibliográfico: búsqueda y registro de material)'},
  {q:'La carta personal va dirigida a alguien cercano, como un familiar o un amigo.',a:true,k:'tf-personal-cercano',fuente:'Ficha, página 2 (4. Tres cartas distintas) · Actividad Tarjetas: Carta personal',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (cartas personales) · DCNB p. 132 (dirigidas a amigos o familiares)'},
  {q:'Un periódico escolar solo lo pueden escribir personas adultas.',a:false,k:'tf-escolar-adultos',fuente:'Guía (Aprende): ¿Qué es un periódico? · Ficha, página 1 (1. El periódico)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el periódico) · DCNB p. 135 (un periódico escolar con el aporte de todos los integrantes de la clase)'},
  {q:'La fotografía que acompaña a una noticia también da información.',a:true,k:'tf-foto-informa',fuente:'Guía (Aprende): ¿Qué es un periódico? · Ficha, página 1 (1. El periódico)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (incluyendo contenido lingüístico y gráfico; interpretación de imágenes visuales)'},
  {q:'En una carta de lector basta con escribir «no me gustó», sin dar razones.',a:false,k:'tf-lector-razones',fuente:'Ficha, página 2 (4. Tres cartas distintas) · Actividad Tarjetas: Carta de lector',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (cartas de lector) · DCNB p. 132 (tono más formal y argumentativo)'}
];
const evalMCBankNuevo=[
  {q:'«Se dice por ahí que van a subir el pasaje del bus». Para ser una noticia confiable, a ese aviso le falta…',o:['a) más signos de admiración','b) aclarar quién lo informó','c) letras más grandes','d) un dibujo'],a:1,k:'mc-quien-informo',fuente:'Guía (Aprende): Dicen que el viernes no hay clases · Ficha, página 1 (2. La noticia y sus seis preguntas)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (la noticia) · Prog. 7-9, PDF pp. 7, 15 y 23 (interpretan información explícita e implícita… con sentido crítico)'},
  {q:'«La alcaldesa inauguró el lunes el puente de la aldea». En esa noticia, «la alcaldesa» responde a la pregunta…',o:['a) ¿cómo?','b) ¿cuándo?','c) ¿dónde?','d) ¿quién?'],a:3,k:'mc-quien',fuente:'Guía (Aprende): La noticia y sus seis preguntas · Ficha, página 1 (2. La noticia y sus seis preguntas)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (la noticia) · DCNB p. 97 (¿quién?, ¿qué?, ¿cuándo?, ¿dónde?, ¿cómo?, ¿por qué?) · el DCNB da esas preguntas para la crónica; aplicarlas a la noticia es redacción nuestra'},
  {q:'Un acta termina con…',o:['a) un titular llamativo','b) una lista de precios','c) la hora de cierre y las firmas','d) un abrazo cariñoso'],a:2,k:'mc-acta-cierre',fuente:'Ficha, página 3 (5. El acta) · Actividad Completa 7',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (acta) · DCNB p. 133 (cierre: hora de terminación de la reunión y firmas)'},
  {q:'Leíste en el periódico una nota sobre la basura de tu barrio y quieres opinar en ese mismo periódico. Lo que escribes es…',o:['a) un acta','b) una carta de venta','c) un reglamento','d) una carta de lector'],a:3,k:'mc-carta-lector',fuente:'Ficha, página 2 (4. Tres cartas distintas) · Actividad «¿Qué texto necesitas?» 3',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (cartas de lector) · DCNB pp. 127 y 132'},
  {q:'Una noticia se arma con tres piezas. Leídas de principio a fin, van así:',o:['a) cuerpo, titular y encabezado','b) encabezado, cuerpo y titular','c) titular, encabezado y cuerpo','d) titular, cuerpo y encabezado'],a:2,k:'mc-tres-piezas',fuente:'Guía (Aprende): La noticia y sus seis preguntas · Ficha, página 1 (2. La noticia y sus seis preguntas)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (la noticia) · DCNB p. 97 (titular, encabezado y cuerpo: lo dice de la crónica) · p. 135 (infieren la estructura de las noticias) · aplicarlo a la noticia es redacción nuestra'},
  {q:'Una noticia trae esta tabla (los datos son inventados): lunes, 12 milímetros de lluvia; martes, 30; miércoles, 8. Según la tabla, el día más lluvioso fue…',o:['a) el martes','b) el lunes','c) el miércoles','d) el domingo'],a:0,k:'mc-tabla',fuente:'Ficha, página 2 (3. Hecho y opinión: la tabla de una noticia) · Guía (Aprende): Los números de una noticia',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (textos… incluyendo contenido lingüístico y gráfico)'},
  {q:'Una página con adivinanzas, cuentos cortos y dibujos para colorear está pensada para lectores que son…',o:['a) niños','b) comerciantes','c) abogados','d) ganaderos'],a:0,k:'mc-lectores-ninos',fuente:'Ficha, página 2 (3. Hecho y opinión: tipo de lectores) · Actividad Tarjetas: Tipo de lectores',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el periódico: tipo de lectores) · DCNB p. 169 (analizan el tipo de público de acuerdo con los temas y la sección) · qué es un tipo de lectores es redacción nuestra'},
  {q:'En un reglamento, cada regla va numerada y recibe el nombre de…',o:['a) estrofa','b) artículo','c) párrafo','d) capítulo'],a:1,k:'mc-articulo',fuente:'Ficha, página 3 (6. El reglamento) · Actividad Tarjetas: Reglamento',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el reglamento) · DCNB p. 172 · así se citan las leyes en js/data/constitucion-honduras.js · que cada regla numerada se llama artículo es redacción nuestra'},
  {q:'Tu equipo investigó por qué se seca la quebrada. Debe presentar los datos, explicar lo que significan y proponer qué hacer. El texto que le toca escribir es…',o:['a) una carta personal','b) un clasificado','c) un acta','d) un informe interpretativo'],a:3,k:'mc-informe',fuente:'Ficha, página 3 (7. El informe interpretativo) · Actividad «¿Qué texto necesitas?» 5',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (textos expositivos: informe interpretativo) · DCNB p. 98'},
  {q:'En una carta de lector, aquello de lo que tratas se llama…',o:['a) la posdata','b) el asunto','c) el cierre','d) el sobre'],a:1,k:'mc-asunto',fuente:'Ficha, página 2 (4. Tres cartas distintas)',grado:'7.º y 8.º',curriculo:'DCNB p. 93 (remitente, destinatario y asunto o propósito principal)'}
];
const evalCPBankNuevo=[
  {q:'En una carta de venta, quien entrega el animal y recibe el dinero es el ___.',a:'vendedor',acc:['vendedor','vendedora'],k:'cp-vendedor',fuente:'Ficha, página 2 (4. Tres cartas distintas) · Actividad Tarjetas: Carta de venta',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (carta de venta) · DCNB p. 97 (vendedores de ganado) · quién vende y quién compra en la carta es redacción nuestra'},
  {q:'En un acta, quienes no llegaron a la reunión se anotan en la lista de ___.',a:'ausentes',acc:['ausentes'],k:'cp-ausentes',fuente:'Ficha, página 3 (5. El acta) · Actividad Completa 4',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (acta) · DCNB p. 133 (lista de ausentes)'},
  {q:'La parte de un informe que presenta el tema, al principio, es la ___.',a:'introducción',acc:['introducción','introduccion'],k:'cp-introduccion',fuente:'Ficha, página 3 (7. El informe interpretativo) · Actividad Secuencia: Las partes de un informe interpretativo',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (informe interpretativo) · DCNB p. 98 (carátula, índice, introducción…) · para qué sirve esa parte del informe es redacción nuestra'},
  {q:'Lo que pasó de verdad y se puede comprobar es un ___.',a:'hecho',acc:['hecho'],k:'cp-hecho',fuente:'Ficha, página 2 (3. Hecho y opinión) · Actividad Tarjetas: Hecho y opinión',grado:'7.º a 9.º',curriculo:'DCNB pp. 92, 126 y 166 (diferencian entre un hecho y una opinión) · la definición es redacción nuestra'},
  {q:'Además de la fecha, cada acta lleva su ___, que dice si es la primera, la segunda o la tercera del grupo.',a:'número',acc:['número','numero'],k:'cp-numero',fuente:'Ficha, página 3 (5. El acta) · Actividad Completa 1',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (acta) · DCNB p. 133 (número del acta)'},
  {q:'La persona o el documento de donde sale un dato de la noticia es la ___.',a:'fuente',acc:['fuente'],k:'cp-fuente',fuente:'Guía (Aprende): La noticia y sus seis preguntas · Ficha, página 1 (2. La noticia y sus seis preguntas)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (la noticia) · DCNB p. 166 (a partir del título, autor/a, fuente y contenido) · la definición es redacción nuestra'},
  {q:'Contar lo que pasó tal como fue, sin inclinarse por nadie, es escribir con ___.',a:'objetividad',acc:['objetividad'],k:'cp-objetividad',fuente:'Ficha, página 3 (5. El acta) · Actividad Laboratorio: Cómo lo cuentas',grado:'8.º',curriculo:'DCNB pp. 127 y 133 (características del acta: objetividad) · p. 125 (lenguaje objetivo)'},
  {q:'Si en tu carta de lector propones una idea para mejorar el periódico, das una ___.',a:'sugerencia',acc:['sugerencia','propuesta'],k:'cp-sugerencia',fuente:'Ficha, página 2 (4. Tres cartas distintas) · Actividad Tarjetas: Carta de lector',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (cartas de lector) · DCNB p. 127 (crítica, sugerencias sobre una obra o una publicación)'},
  {q:'Lo que un informe aconseja hacer, después de analizar los datos, son sus ___.',a:'recomendaciones',acc:['recomendaciones','recomendación','recomendacion'],k:'cp-recomendaciones',fuente:'Ficha, página 3 (7. El informe interpretativo) · Actividad Tarjetas: Informe interpretativo',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (informe interpretativo) · DCNB p. 98 (dar recomendaciones)'},
  {q:'Las ideas que un periódico defiende siempre, sea cual sea la noticia del día, forman su ___ editorial.',a:'línea',acc:['línea','linea'],k:'cp-linea',fuente:'Ficha, página 2 (3. Hecho y opinión: la línea editorial) · Actividad Tarjetas: Línea editorial',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el periódico: línea editorial) · DCNB pp. 92 y 166 («línea política del periódico a través de puntos de vista razonados y opiniones») · la definición es una adaptación nuestra de esa frase'}
];
const evalPRBankNuevo=[
  {term:'Entrevista',def:'Alguien pregunta y una persona invitada responde',k:'pr-entrevista',fuente:'Guía (Aprende): ¿Qué es un periódico? · Ficha, página 1 (1. El periódico)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el periódico) · DCNB pp. 125 y 126 (la entrevista: preguntas del entrevistador y comentarios del entrevistado) · la explicación es redacción nuestra'},
  {term:'Periodista',def:'Busca la información y redacta las noticias',k:'pr-periodista',fuente:'Guía (Aprende): ¿Qué es un periódico? · Ficha, página 1 (1. El periódico)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (el periódico) · DCNB p. 125 (géneros periodísticos) · la definición es redacción nuestra'},
  {term:'Exactitud',def:'Las horas, los días y los nombres van sin equivocaciones',k:'pr-exactitud',fuente:'Ficha, página 3 (5. El acta)',grado:'8.º',curriculo:'DCNB pp. 127 y 133 (características del acta: exactitud)'},
  {term:'Valoración',def:'Decir si te pareció bien o mal lo que leíste',k:'pr-valoracion',fuente:'Ficha, página 2 (4. Tres cartas distintas) · Actividad Tarjetas: Carta de lector',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (cartas de lector) · DCNB p. 127 (dar su valoración: aprobación o desaprobación)'},
  {term:'Norma',def:'Regla que todo el grupo se compromete a cumplir',k:'pr-norma',fuente:'Ficha, página 3 (6. El reglamento)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el reglamento) · DCNB p. 172 · la definición es redacción nuestra'},
  {term:'Bibliografía',def:'Lista de los libros consultados para un trabajo',k:'pr-bibliografia',fuente:'Ficha, página 3 (7. El informe interpretativo) · Actividad Secuencia: Las partes de un informe interpretativo',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (informe interpretativo) · DCNB p. 98 (bibliografía) · para qué sirve esa parte del informe es redacción nuestra'},
  {term:'Cronograma',def:'Calendario con las etapas de una investigación',k:'pr-cronograma',fuente:'Ficha, página 3 (7. El informe interpretativo)',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (informe interpretativo) · DCNB p. 98 (elaborando un cronograma que comprenda las etapas)'},
  {term:'Índice',def:'Dice en qué página empieza cada apartado',k:'pr-indice',fuente:'Ficha, página 3 (7. El informe interpretativo) · Actividad Secuencia: Las partes de un informe interpretativo',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (informe interpretativo) · DCNB p. 98 (índice) · para qué sirve esa parte del informe es redacción nuestra'},
  {term:'¿Cuándo?',def:'«Ayer por la tarde»',k:'pr-cuando',fuente:'Guía (Aprende): La noticia y sus seis preguntas · Ficha, página 1 (2. La noticia y sus seis preguntas)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (la noticia) · DCNB p. 97 (¿cuándo?) · el DCNB da esa pregunta para la crónica; aplicarla a la noticia es redacción nuestra'},
  {term:'¿Por qué?',def:'«Debido a que llovió toda la noche»',k:'pr-por-que',fuente:'Guía (Aprende): La noticia y sus seis preguntas · Ficha, página 1 (2. La noticia y sus seis preguntas)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (la noticia) · DCNB p. 97 (¿por qué?) · el DCNB da esa pregunta para la crónica; aplicarla a la noticia es redacción nuestra'}
];

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
// Los casos son los del plan: la noticia sin fuente y el titular que engaña.
// Todos los hechos son inventados. La pauta del caso es la misma para los
// dos casos del banco: por eso tienen la misma forma (un aviso que corre de
// boca en boca sin decir quién lo informó, y gente que actúa por creerlo).
const critTextos={
  caso:'Caso de análisis: un aviso sin fuente',
  decision:'Toma de decisiones: un titular que engaña',
  decisionPregunta:'¿Qué harías tú y qué titular propondrías? Explica por qué, pensando en lo que entiende el lector que solo lee el titular.',
  decisionPreguntaHoja:'¿Qué harías tú y qué titular propondrías? Explica por qué, pensando en quien solo lee el titular.',
  comparacionPregunta:'1. ¿Qué clase de texto es cada caso? 2. ¿Para qué sirve cada uno? 3. ¿En qué palabras se nota la diferencia?'
};
const critCaseBank=[
  {k:'ca-utiles',txt:'En el grupo de mensajes del grado circula esto: «Urgente: dicen que el sábado regalan útiles escolares en el parque. Pásalo». No dice quién lo informó. El sábado llegan varias familias desde lejos, y en el parque no había nada.'},
  {k:'ca-agua',txt:'En la pulpería alguien comenta: «Dicen que van a cortar el agua toda la semana». Nadie sabe de dónde salió. Varias familias gastan en agua embotellada de más, y al final no hubo corte.'},
];
const critCaseQuestions=[
  '1. ¿Qué le falta a ese aviso para ser una noticia confiable?',
  '2. ¿Qué pasó por creerlo sin comprobarlo?',
  '3. ¿Cómo se podía comprobar antes de pasarlo a otros?',
  '4. Escríbelo como una noticia confiable. Si inventas un dato, dilo.',
];
const critCaseGuides=[
  'No dice la fuente (quién lo informó) y deja preguntas sin responder: «dicen» no es nadie.',
  'La gente actuó con un dato falso y salió perjudicada: hizo un viaje en vano o gastó sin necesidad.',
  'Preguntando a quien le corresponde informar (la alcaldía, la oficina del agua) o buscando un aviso con nombre y fecha.',
  'Respuesta abierta: debe decir qué pasa, quién lo informa, cuándo y dónde, sin «dicen que».',
];
const critErrorBank=[
  {k:'er-noticia',txt:'"La noticia es el texto donde el periodista cuenta lo que opina, y su titular puede exagerar lo que pasó para que la lean más".',
   g1:'la noticia informa de hechos; la opinión va en otros textos, como el editorial o la carta de lector.',
   g2:'el titular tiene que decir lo mismo que la noticia: si exagera, engaña a quien solo lee el titular.'},
  {k:'er-acta',txt:'"El acta la puede escribir cualquiera unos días después de la reunión, y basta con anotar lo que al que escribe le pareció importante".',
   g1:'el acta se redacta a medida que se desarrolla la reunión, y la firman el secretario y quien presidió.',
   g2:'registra todo lo sucedido, tratado y acordado, con fidelidad: no solo lo que le interesa a quien escribe.'},
];
const critDecisionBank=[
  'Formas parte del periódico escolar. El partido entre noveno y octavo quedó 1 a 1, y un compañero propone este titular: «¡Paliza histórica de noveno!». Dice que así lo leerá más gente.',
  'En el periódico mural hay una nota que dice que la biblioteca cerrará el viernes, solo ese día, por limpieza. Una compañera quiere ponerle este titular: «Cierran la biblioteca».',
];
const critDecisionGuide='Un titular tiene que decir lo mismo que la noticia. Muchos lectores solo leen el titular: si exagera o calla una parte, se quedan con una idea falsa y el periódico pierde su confianza. Se recomienda decirle al compañero, con respeto, por qué ese titular engaña, y proponer uno exacto que también llame la atención (por ejemplo, con el resultado o con el día del cierre).';
const critCompareBank=[
  {k:'co-cancha',a:'«El sábado, los alumnos de séptimo limpiaron la cancha y pintaron las gradas».',b:'«Me parece que limpiar la cancha fue una gran idea, y pido que la cuidemos entre todos».',
   ga:'es un hecho, propio de una noticia: informa y se puede comprobar.',
   gb:'es una opinión con una petición, propia de una carta de lector.',
   gr:'El primero dice lo que pasó; el segundo, lo que alguien piensa y pide. Se nota en «me parece» y «pido».'},
  {k:'co-excursion',a:'«Se acordó por mayoría hacer la excursión el viernes 20. Se cerró la sesión a las 10:40 a. m.»',b:'«Querida tía: te cuento que el viernes 20 nos vamos de excursión. ¡Estoy feliz!»',
   ga:'es de un acta: registra con exactitud lo acordado en una reunión.',
   gb:'es de una carta personal: cuenta lo mismo con lenguaje afectivo y espontáneo.',
   gr:'Los dos traen el mismo dato. El acta lo deja como constancia para el grupo; la carta lo comparte con alguien cercano. Se nota en «se acordó» frente a «querida tía» y «estoy feliz».'},
];
const critCauseBank=[
  {k:'cau-sin-fuente',cause:'Un periódico escolar publica un dato sin decir de dónde lo sacó.',guide:'Los lectores no pueden comprobarlo y empiezan a desconfiar de lo que publica.'},
  {k:'cau-acta-tarde',cause:'El secretario escribe el acta de memoria, una semana después de la reunión.',guide:'Olvida o cambia lo que se decidió, y el grupo termina discutiéndolo otra vez.'},
  {k:'cau-insultos',cause:'Un lector manda al periódico una carta con insultos y sin una sola razón.',guide:'Nadie toma en serio su reclamo y lo más probable es que no se la publiquen.'},
  {k:'cau-sin-reglas',cause:'Un grado empieza el año sin poner por escrito sus reglas.',guide:'Cada quien las entiende a su manera y surgen pleitos que no se sabe cómo resolver.'},
  {k:'cau-solo-datos',cause:'Un equipo entrega un informe con muchas tablas y ninguna conclusión.',guide:'Quien lo lee no sabe qué significan los números ni qué conviene hacer.'},
];
const critEffectBank=[
  {k:'ef-torneo',effect:'Medio instituto creyó que el torneo se había cancelado.',guide:'El titular decía «Se acabó el torneo» y la nota explicaba que solo había terminado la primera ronda.'},
  {k:'ef-ternero',effect:'Dos vecinos discuten de quién es un ternero.',guide:'Lo vendieron de palabra, sin carta de venta.'},
  {k:'ef-dania',effect:'El periódico escolar publicó la carta de Dania.',guide:'Dio su opinión con respeto, con razones y con una propuesta clara.'},
  {k:'ef-abuelo',effect:'El abuelo guardó la carta de su nieto junto a sus fotos.',guide:'El nieto le escribió con cariño y con palabras sencillas, como se le habla a él.'},
  {k:'ef-fecha',effect:'El grado resolvió en un minuto la duda sobre el día de la rifa.',guide:'Leyeron el acta, donde ese acuerdo había quedado escrito.'},
  {k:'ef-marcador',effect:'Marlon encontró en segundos el marcador del partido.',guide:'Fue directo a la sección de deportes.'},
  {k:'ef-reciclaje',effect:'La directora aceptó la propuesta del equipo de reciclaje.',guide:'Su informe mostraba los datos, lo que significaban y recomendaciones claras.'},
];

// ===================== LABORATORIO =====================
// «La redacción del periódico escolar». Con los mismos hechos (inventados
// para la misión) el alumno arma una noticia, una carta de lector o un
// acta. En cada paso elige una opción; `sirve` dice, para cada texto, si
// esa opción encaja (si), encaja a medias (medio) o no encaja (no), y
// `por`, el porqué que se le enseña. `linea` es lo que esa opción pone en
// el texto que va quedando (el paso «cómo lo cuentas» no pone ninguna).
// `compara` es el cuadro de «qué cambia en cada una».
const redaccionEscolar={
  hechos:'El lunes 9 de marzo, la asamblea de octavo grado acordó sembrar árboles porque el patio no tiene sombra. El sábado 14, 32 alumnos sembraron 40 árboles en el predio de la escuela. Keyla, una alumna, teme que se sequen si nadie los riega. (Todo es inventado, para practicar.)',
  textos:[
    {id:'noticia',emoji:'📰',nombre:'Una noticia',para:'para informar a toda la escuela'},
    {id:'carta',emoji:'📮',nombre:'Una carta de lector',para:'para opinar en el periódico escolar'},
    {id:'acta',emoji:'📝',nombre:'Un acta',para:'para dejar constancia de la asamblea'}
  ],
  pasos:[
    {id:'inicio',titulo:'🖊️ Cómo empieza',opciones:[
      {id:'titular',txt:'Con un titular: «Octavo grado siembra 40 árboles en la escuela»',linea:'<strong>Octavo grado siembra 40 árboles en la escuela</strong>',
       sirve:{noticia:'si',carta:'no',acta:'no'},
       por:{noticia:'La noticia empieza con un titular que dice lo mismo que el texto.',carta:'Una carta no lleva titular: empieza con el saludo a quien va dirigida.',acta:'Un acta no lleva titular: empieza con su número, el lugar, la hora y la fecha.'}},
      {id:'senores',txt:'Con un saludo formal: «Señores del periódico escolar:»',linea:'Señores del periódico escolar:',
       sirve:{noticia:'no',carta:'si',acta:'no'},
       por:{noticia:'La noticia no saluda a nadie: va directo al hecho, bajo su titular.',carta:'La carta de lector se dirige al periódico con un saludo respetuoso.',acta:'El acta no saluda: registra la reunión desde su número, lugar, hora y fecha.'}},
      {id:'numero',txt:'Con los datos de la reunión: «Acta número 3. En el aula de octavo grado, a las 10:00 a. m. del lunes 9 de marzo…»',linea:'Acta número 3. En el aula de octavo grado, a las 10:00 a. m. del lunes 9 de marzo, se abrió la sesión con 30 asistentes y 2 ausentes.',
       sirve:{noticia:'no',carta:'no',acta:'si'},
       por:{noticia:'Eso es el comienzo de un acta. La noticia empieza con su titular.',carta:'Eso es el comienzo de un acta. La carta empieza con un saludo.',acta:'Así empieza un acta: número, lugar, hora y fecha, y quiénes asistieron.'}},
      {id:'hola',txt:'Con un saludo de confianza: «¡Hola! ¿Cómo están todos?»',linea:'¡Hola! ¿Cómo están todos?',
       sirve:{noticia:'no',carta:'medio',acta:'no'},
       por:{noticia:'La noticia no saluda a nadie: empieza con su titular.',carta:'Es un saludo, pero de carta personal. Al periódico se le escribe con un tono más formal.',acta:'El acta no saluda: es un documento que registra la reunión.'}}
    ]},
    {id:'cuerpo',titulo:'📄 Qué pones en el cuerpo',opciones:[
      {id:'hecho',txt:'El hecho, con sus datos: «El sábado 14 de marzo, 32 alumnos de octavo grado sembraron 40 árboles en el predio de la escuela, para dar sombra al patio»',linea:'El sábado 14 de marzo, 32 alumnos de octavo grado sembraron 40 árboles en el predio de la escuela, para dar sombra al patio, según informó la profesora guía.',
       sirve:{noticia:'si',carta:'medio',acta:'no'},
       por:{noticia:'Responde qué, quién, cuándo, dónde y por qué: eso es una noticia.',carta:'Sirve para recordar de qué hablas, pero a tu carta le falta lo principal: tu opinión y lo que propones.',acta:'El acta registra la reunión del lunes 9, no lo que pasó el sábado.'}},
      {id:'opinion',txt:'Tu opinión y una propuesta: «Me alegra que mi grado haya sembrado árboles, pero si nadie los riega se van a secar. Propongo que cada grado los riegue una semana»',linea:'Me alegra que mi grado haya sembrado árboles, pero si nadie los riega se van a secar. Propongo que cada grado los riegue una semana.',
       sirve:{noticia:'no',carta:'si',acta:'no'},
       por:{noticia:'La noticia informa de hechos. La opinión de quien escribe no va ahí.',carta:'Das tu valoración, una razón y una sugerencia: para eso es la carta de lector.',acta:'El acta no recoge la opinión de quien la redacta: registra lo tratado y lo acordado.'}},
      {id:'acuerdos',txt:'Lo tratado y lo acordado: «Se discutió la falta de sombra en el patio. Se acordó por mayoría sembrar 40 árboles el sábado 14 de marzo»',linea:'Orden del día: la falta de sombra en el patio. Se discutió el punto y se acordó por mayoría sembrar 40 árboles el sábado 14 de marzo.',
       sirve:{noticia:'medio',carta:'no',acta:'si'},
       por:{noticia:'Cuenta la reunión, pero la noticia es que los árboles ya se sembraron: falta ese hecho.',carta:'Eso es de un acta. En tu carta va lo que tú opinas y propones.',acta:'El acta registra lo que se trató y lo que se acordó, con exactitud.'}}
    ]},
    {id:'voz',titulo:'🗣️ Cómo lo cuentas',opciones:[
      {id:'objetiva',txt:'Sin opinar: cuentas lo que pasó tal como fue («los alumnos sembraron», «se acordó»)',
       sirve:{noticia:'si',carta:'medio',acta:'si'},
       por:{noticia:'La noticia se escribe con objetividad: hechos, sin la opinión de quien escribe.',carta:'Puedes recordar el hecho así, pero la carta de lector existe para dar tu punto de vista.',acta:'El acta pide objetividad y fidelidad: lo que pasó, tal como pasó.'}},
      {id:'razones',txt:'Opinando con razones y con respeto («opino que… porque…», «propongo…»)',
       sirve:{noticia:'no',carta:'si',acta:'no'},
       por:{noticia:'Si opinas, deja de ser una noticia. La opinión va en otros textos.',carta:'La carta de lector da un punto de vista razonado, con tono respetuoso.',acta:'Quien redacta el acta no opina: anota lo que se trató, le guste o no.'}},
      {id:'exagerada',txt:'Exagerando para que se lea más («¡la siembra más grandiosa de la historia!»)',
       sirve:{noticia:'no',carta:'no',acta:'no'},
       por:{noticia:'Exagerar engaña al lector: la noticia tiene que decir lo que pasó.',carta:'Una exageración no es una razón: le quita seriedad a tu carta.',acta:'El acta pide exactitud. Una exageración la vuelve falsa.'}}
    ]},
    {id:'cierre',titulo:'🏁 Cómo termina',opciones:[
      {id:'dato',txt:'Con el último dato, sin despedida ni firma: «El comité de riego empieza el lunes»',linea:'El comité de riego empieza a trabajar el lunes.',
       sirve:{noticia:'si',carta:'no',acta:'no'},
       por:{noticia:'La noticia termina cuando se acaban los datos: no se despide.',carta:'A tu carta le falta la despedida y tu firma: sin nombre, no se sabe quién opina.',acta:'Al acta le falta el cierre: la hora en que terminó la sesión y las firmas.'}},
      {id:'atentamente',txt:'Con despedida y firma: «Atentamente, Keyla Mejía, alumna de octavo grado»',linea:'Atentamente,<br>Keyla Mejía, alumna de octavo grado',
       sirve:{noticia:'no',carta:'si',acta:'no'},
       por:{noticia:'La noticia no lleva despedida.',carta:'Te despides y firmas con tu nombre: así se sabe quién opina.',acta:'El acta no se despide: cierra con la hora y con las firmas del secretario y de quien presidió.'}},
      {id:'firmas',txt:'Con la hora de cierre y las firmas: «Se cerró la sesión a las 10:40 a. m. Firman la secretaria y el presidente»',linea:'Se cerró la sesión a las 10:40 a. m. Firman la secretaria y el presidente de la asamblea.',
       sirve:{noticia:'no',carta:'no',acta:'si'},
       por:{noticia:'Eso es el cierre de un acta, no de una noticia.',carta:'Eso es el cierre de un acta. Tu carta termina con despedida y firma.',acta:'Así cierra un acta: hora de terminación y firmas del secretario y de quien presidió.'}}
    ]}
  ],
  compara:[
    {que:'¿Para qué se escribe?',noticia:'Para informar de un hecho.',carta:'Para dar una opinión o una sugerencia.',acta:'Para dejar constancia de una reunión.'},
    {que:'¿Quién la escribe?',noticia:'Un periodista o un reportero escolar.',carta:'Un lector, con su nombre.',acta:'El secretario del grupo.'},
    {que:'¿Cómo empieza?',noticia:'Con un titular.',carta:'Con un saludo.',acta:'Con su número, lugar, hora y fecha.'},
    {que:'¿Cómo cuenta?',noticia:'Hechos, sin opinar.',carta:'Opina con razones y respeto.',acta:'Lo tratado y acordado, con fidelidad.'},
    {que:'¿Cómo termina?',noticia:'Con el último dato.',carta:'Con despedida y firma.',acta:'Con la hora de cierre y las firmas.'}
  ]
};
