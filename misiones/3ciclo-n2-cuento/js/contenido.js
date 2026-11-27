/* ============================================================
   M.E.T.A.S · Misión El cuento · CONTENIDO
   ------------------------------------------------------------
   Aquí solo hay datos: lo que la misión dice, pregunta y guarda. Ni
   una función. Quien pinta las pantallas, lleva el XP y arma el examen
   es el motor compartido (js/motor-mision.js).

   Para corregir un dato de esta misión se toca ESTE archivo y nada más.

   ► PARA QUIÉN ES. Español, primer parcial (febrero y marzo), III Ciclo
     (7.º a 9.º grado), con un apartado «Para Media». Cada pregunta del
     examen dice su `grado` y, en `curriculo`, la página de la
     programación o del DCNB de donde sale. ⚠️ Esos grados son para el
     docente: la pantalla del alumno NO los muestra como etiquetas
     (decisión de Josué; la página dice «III Ciclo»). El reparto por
     grado va en la tarjeta «Para el docente» de Recursos y en la nota
     del docente de la ficha.

   ► DE DÓNDE SALE CADA COSA (todo está en `_dev/`):
     · Prog. 7-9 = `_dev/dcnb-pdf/programacion-espanol-7-9.pdf`, la
       programación mensual de SEDUC. Febrero y marzo:
       7.º, p. 7 del PDF: «La narración: el cuento de tradición oral»;
       «La descripción: personajes»; «Textos literarios: Narrativos: el
       cuento. Descriptivos: descripción de personajes»; «Producción de
       textos: borrador, revisión y versión final. Texto literario: el
       cuento».
       8.º, p. 15: «Esquema estructural de la narración: inicio,
       desarrollo y cierre»; «Cuento de autores nacionales e
       hispanoamericanos»; «Reconoce la lectura como medio de
       comunicación y de transmisión de cultura de los pueblos»; «Textos
       narrativos: el cuento en Honduras. Descriptivos: biografía»;
       «Textos literarios: cuento».
       9.º, p. 23: «Textos narrativos: el cuento de tradición oral.
       Esquema estructural: punto de vista (quien narra)»; «Textos
       literarios: Narrativos».
     · DCNB = `_dev/dcnb-pdf/dcneb-basica-iii-ciclo.pdf` (página del
       visor). p. 86 (7.º): «Escuchan y narran en equipo un cuento de
       tradición oral: leyenda o mito», «Identifican los personajes
       descritos en la narración de cuentos», semejanzas y diferencias
       entre la descripción y la narración, «Respeto por las normas de
       interacción verbal». pp. 103 y 139: las «normas para narrar un
       relato (brevedad, mantener concordancia o hilo de la trama y
       poseer un inicio, un desarrollo y un desenlace)» y el cuento de
       tradición oral entre las manifestaciones de la literatura oral.
       pp. 104, 142 y 179: esquema estructural «Iniciación. Desarrollo.
       Cierre» y la «ordenación canónica en exposición, nudo y
       desenlace»; describir personajes por lo físico y por lo
       psicológico. p. 105, 141 y 179: la descripción y el diálogo como
       recursos de la narración; redactar cuentos de invención propia y
       revisarlos. p. 119 (8.º): «Recopilan cuentos de autore(a)s
       nacionales», «planteamiento, nudo y desenlace», «el uso de
       palabras que indican tiempo». p. 140 (8.º): «personajes
       principales y secundarios, ambiente, espacio, tiempo». p. 179
       (9.º): «Punto de vista (quien narra): del protagonista (1.° persona),
       del personaje testigo (1.° persona), narrador objetivo (3.°
       persona), narrador omnisciente (3.° persona), segunda persona».
       p. 177 (9.º): el propósito y la estructura (narrativa) de
       testimonios y biografías; la autobiografía «es el testimonio de
       la vida del mismo autor». pp. 89, 122 y 163: «Reconoce la lectura
       como medio de comunicación y de transmisión de cultura de los
       pueblos» (contenido actitudinal).
     · Para Media: `_dev/dcnb/programa-espanol-10.md` (CE2.6, organización
       textual de los textos narrativos, descriptivos, argumentativos y
       expositivos; «la narración, descripción, argumentación,
       explicación, diálogo») y `_dev/dcnb/programa-espanol-11-bch.md`
       (CE3.1, géneros narrativos). Solo nombres.

   ► LOS TEXTOS. No hay en `_dev/` ningún cuento de autor ni ninguna
     recopilación de tradición oral, y desde esta sesión no se pudo
     consultar ninguna fuente externa (se intentó con un cuento de
     Froylán Turcios, en dominio público, y no se pudo verificar ni el
     texto ni sus datos de edición). Por eso, como pidió Josué:
     · NO HAY NINGÚN TEXTO DE AUTOR, ni se nombra a ningún autor ni
       ninguna obra. Del «cuento de autores nacionales» (8.º) la misión
       enseña en qué se diferencia de uno de tradición oral y manda a
       buscar uno a la biblioteca del centro. La lista de autores queda
       pendiente de fuentes (ver el plan, sección 6).
     · El Cadejo, la Sucia y el Sisimite son relatos de la tradición
       oral hondureña CONTADOS DE NUEVO CON PALABRAS NUESTRAS. No son
       cita de ningún libro. La guía lo dice («esta versión la
       escribimos para la misión; en tu casa quizá lo cuentan distinto»).
       Lo que se da por sabido de cada uno es lo que se cuenta
       comúnmente: el Cadejo, un perro que se aparece de noche en los
       caminos (el blanco acompaña, el negro asusta); la Sucia, una
       mujer de blanco que se aparece de noche junto a ríos y quebradas;
       el Sisimite, un ser peludo de la montaña del que se dice que
       tiene los pies al revés. El Cadejo blanco y la Sucia ya estaban
       contados así en `js/data/lectura-textos.js`. PENDIENTE DE
       VERIFICAR con una recopilación escrita cuando haya una en `_dev/`:
       los detalles cambian de un pueblo a otro, y la misión enseña
       justamente eso.
     · El DCNB de 7.º (p. 86) pide «un cuento de tradición oral: leyenda
       o mito». La leyenda COMO GÉNERO es de abril (Prog. 7-9, PDF pp. 8
       y 16): aquí no se define ni se pregunta; los tres relatos se
       tratan como cuentos de tradición oral.
     · «La noche que subió el río» es un relato INVENTADO para la
       misión. Lo que no es inventado (el huracán Mitch, octubre y
       noviembre de 1998, varios días de lluvia, ríos crecidos que
       arrasaron casas) sale de la misión de los desastres naturales
       (misiones/2y3ciclo-desastres-naturales/).
     · Los demás fragmentos (el zapatero, el leñador, doña Lola, don
       Chico, Lucía) son inventados para la misión.

   ► LOS CRUCES CON OTRAS MATERIAS, y de dónde sale su dato:
     · Ciencias Naturales: el relato del río, con los datos del Mitch
       de la misión de los desastres naturales.
     · Ciencias Sociales: la biografía de Francisco Morazán y los datos
       sueltos de Dionisio de Herrera y de José Trinidad Cabañas, de
       `js/data/proceres-honduras.js` y solo lo que ese archivo da:
       Morazán nació en Tegucigalpa el 3 de octubre de 1792, fue
       presidente de la República Federal de Centro América, impulsó la
       educación pública, peleó por mantener unidas a las cinco naciones
       y murió el 15 de septiembre de 1842; Herrera nació en Choluteca
       el 9 de octubre de 1781 y fue el primer jefe de Estado de
       Honduras, en 1824; Cabañas nació en Tegucigalpa el 9 de junio de
       1805, fue presidente de Honduras y salió del gobierno tan pobre
       como entró (de Cabañas el examen no pregunta nada; su año de
       nacimiento sale en la práctica de la ficha).
     · Matemáticas: la línea de tiempo de una biografía (cuántos años
       hay entre dos fechas). Entre 1792 y 1842 hay 50 años; entre 1781
       y 1824, 43. ⚠️ No se dice «vivió 50 años»: Morazán murió unos
       días antes de cumplirlos (15 de septiembre; cumplía el 3 de
       octubre). Se pregunta por los años que hay entre un año y otro.
     · Cívica: quién habla en el Himno Nacional. El verso «India virgen
       y hermosa dormías» y que «India virgen» es la tierra hondureña,
       de `js/data/himno.js`. Que la voz le habla a Honduras de «tú» es
       lectura nuestra del verbo («dormías», «tus mares»).

   ► REDACCIÓN NUESTRA (no hay definición en `_dev/`; se escribió clara
     para III Ciclo y no es cita de nadie). La programación y el DCNB
     NOMBRAN casi todo lo de esta misión y no lo definen. Cada pregunta
     que se apoya en una de estas definiciones lo dice en su `curriculo`:
     · «Tradición oral»: los cuentos y saberes que pasan de boca en
       boca, de una generación a otra, sin estar escritos. Que el cuento
       de tradición oral es anónimo y que cambia con cada persona que lo
       cuenta (versiones).
     · «Cuento»: narración corta, inventada, con pocos personajes (la
       brevedad está en las normas para narrar del DCNB, p. 103).
     · Qué hace cada parte: el inicio presenta a los personajes, el
       lugar y el tiempo; en el desarrollo aparece el problema; el cierre
       lo resuelve. Los nombres (inicio, desarrollo y cierre;
       planteamiento, nudo y desenlace) son del currículo; qué pasa en
       cada una es redacción nuestra.
     · «Personaje», «personaje principal o protagonista», «personajes
       secundarios», «ambiente» (el lugar y el tiempo): el DCNB los
       nombra (pp. 140 y 179).
     · Describir «por fuera» (lo que se ve) y «por dentro» (la manera
       de ser): es nuestra forma de decir lo que el DCNB llama
       descripción física y psicológica (pp. 104, 141 y 179). Los
       nombres técnicos (prosopografía, etopeya, retrato) NO se enseñan
       aquí: la programación los pone en abril (PDF p. 8).
     · «Narrador»: la voz que cuenta; no es lo mismo que el autor. Los
       cuatro narradores llevan el nombre del DCNB (p. 179); qué sabe y
       qué no sabe cada uno es redacción nuestra.
     · «Biografía»: texto que cuenta la vida de una persona real,
       escrito por otra persona, con los hechos en el orden en que
       pasaron. La programación la pone entre los textos descriptivos
       (PDF p. 15) y el DCNB dice que su estructura es narrativa
       (p. 177): la misión dice que cuenta una vida y describe a la
       persona.
     · Los pasos para escribir un cuento (planear, borrador, revisar,
       versión final) son los de la programación (PDF p. 7); el detalle
       de cada paso es el de la misión Escribir por etapas (N5).
     · LA LECTURA COMO TRANSMISIÓN DE CULTURA. El DCNB la nombra como
       contenido actitudinal y no la explica. La tarjeta «Leer también
       es heredar» es redacción nuestra entera: que un pueblo pasa a
       los que vienen lo que sabe, lo que cree y cómo habla cuando
       cuenta sus historias, y que al escribirlas la lectura las lleva
       más lejos en el espacio y en el tiempo. Lleva dos preguntas en el
       examen, una de verdadero o falso y una de selección (decisión del
       PR 61).

   ► LO QUE SE DEJÓ FUERA:
     · La leyenda, el mito, la fábula y la anécdota como géneros (abril
       y después), y la topografía, la prosopografía y la etopeya.
     · La segunda persona como punto de vista: el DCNB la nombra
       (p. 179); la misión solo la muestra en el verso del Himno, y el
       examen le dedica una pregunta de lectura de ese verso.
     · La autobiografía y el testimonio (más adelante en 8.º y 9.º):
       solo se nombra la autobiografía para distinguirla.
     · Ningún nombre de autor, ningún título de libro, ninguna fecha de
       publicación.
     · El examen no pregunta nada que sea solo de Media.

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
  titulo:'El cuento',
  emoji:'🌙',
  materia:'Español',
  confeti:['#0f766e','#4ba89f','#d97706','#f59e0b','#fde68a'],
  impresion:{acento:'#c49000',fondo:'#fef9e7'},
  rutaEtiqueta:'Secuencia',
  widgetIdentifica:{paso:'Fragmento',fin:'🎉 ¡Reconociste a todos los narradores!'},
  tareaIdentifica:['Copia cada fragmento en tu cuaderno y escribe al lado qué es o quién narra.','<strong>Ejemplo:</strong> «Yo cerré la puerta y me escondí». → <span style="color:var(--jade);font-weight:700;">Narra el protagonista (primera persona)</span>'],
  tareaClasifica:{instruccion:'Copia la siguiente tabla en tu cuaderno. Lee cada fragmento y completa lo que se pide.',columnas:['Fragmento','¿Quién narra?','¿En qué persona?','¿Parte del cuento?','¿Cómo lo sabes?']},
  diploma:['¡Sigue escuchando y contando cuentos!','¡Muy buen trabajo!','¡Ya reconoces las partes de un cuento!','¡Sabes quién narra y qué sabe!','¡Ya puedes contar y escribir tu propio cuento!']
};

// ===================== IDENTIDAD Y GUARDADO =====================
const SAVE_KEY='n2_cuento_v1';
const MXP=200;
const TOTAL_SECTIONS=13;

// ===================== LOGROS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'🌙',label:'Primer quiz del cuento superado'},
  flash_master:{icon:'🃏',label:'Todas las tarjetas del cuento exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de personajes y narradores'},
  id_master:{icon:'🔍',label:'Cazador de palabras clave'},
  reto_hero:{icon:'🏆',label:'Héroe del reto del cuento'},
  nivel3:{icon:'👂',label:'¡Buen oyente! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Cuentacuentos! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets del cuento dominados'}
};

// ===================== NIVELES =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Curioso 👀'},{t:55,n:'Buen oyente 👂'},{t:90,n:'Lector 📖'},{t:130,n:'Narrador 🎙️'},{t:165,n:'Cuentacuentos 🌙'},{t:190,n:'Guardián de los cuentos 🏆'}];

// ===================== TARJETAS =====================
const fcData=[
  {w:'Tradición oral',a:'🗣️ Los cuentos y saberes que <strong>pasan de boca en boca</strong>, de una generación a otra, sin estar escritos. Tus abuelos los oyeron de los suyos.'},
  {w:'Cuento de tradición oral',a:'🌙 Es <strong>anónimo</strong> (nadie sabe quién lo inventó) y <strong>cambia</strong> con cada persona que lo cuenta: por eso hay varias versiones. En Honduras se cuentan el del Cadejo, el de la Sucia y el del Sisimite.'},
  {w:'Cuento de autor',a:'✍️ Tiene un <strong>autor conocido</strong> que lo escribió y lo firmó. Su texto <strong>no cambia</strong>: está escrito. En la biblioteca de tu centro hay cuentos de escritores de Honduras.'},
  {w:'Las tres partes del cuento',a:'🧱 <strong>Inicio</strong>, <strong>desarrollo</strong> y <strong>cierre</strong>, en ese orden. También se llaman planteamiento, nudo y desenlace.'},
  {w:'Inicio',a:'🚪 <strong>Presenta</strong> a los personajes y dice dónde y cuándo pasa la historia. «En una aldea vivía…».'},
  {w:'Desarrollo',a:'🌀 Aparece el <strong>problema</strong> y los personajes hacen algo para enfrentarlo. Es la parte más larga. «De pronto…».'},
  {w:'Cierre',a:'🏁 El problema <strong>se resuelve</strong>, para bien o para mal, y la historia termina. «Desde ese día…».'},
  {w:'Personajes',a:'👤 Los seres que <strong>actúan</strong> en el cuento: personas, animales o seres imaginarios. El <strong>principal</strong> (protagonista) vive la historia; los <strong>secundarios</strong> lo acompañan.'},
  {w:'Describir a un personaje',a:'🪞 <strong>Por fuera</strong>: lo que se ve (alto, canoso, de trenzas). <strong>Por dentro</strong>: su manera de ser (terco, generoso, miedoso). Una buena descripción dice las dos cosas.'},
  {w:'Ambiente',a:'🌄 El <strong>lugar</strong> y el <strong>tiempo</strong> en que pasa el cuento: «una noche de lluvia, en una aldea de Lempira».'},
  {w:'Narrador',a:'🎙️ La <strong>voz que cuenta</strong> el cuento. No es lo mismo que el autor: el autor escribe; el narrador es la voz que el autor eligió para contar.'},
  {w:'Punto de vista: quién narra',a:'🎥 En <strong>primera persona</strong> («yo»): narra el <strong>protagonista</strong> o un <strong>testigo</strong>. En <strong>tercera persona</strong> («él», «ella»): narra alguien de fuera, el narrador <strong>objetivo</strong> (solo lo que se ve) o el <strong>omnisciente</strong> (lo sabe todo).'},
  {w:'Biografía',a:'📜 Texto que cuenta <strong>la vida de una persona real</strong>. La escribe <strong>otra persona</strong>, con los hechos en el orden en que pasaron, y da fechas y lugares.'},
  {w:'La lectura transmite cultura',a:'🌎 En sus cuentos, un pueblo guarda <strong>lo que sabe, lo que cree y cómo habla</strong>. Quien los lee recibe esa herencia, aunque viva lejos o haya nacido mucho después.'},
];

// ===================== QUIZ =====================
const qzData=[
  {q:'¿Cómo llega hasta ti un cuento de tradición oral?',o:['a) Porque alguien te lo cuenta','b) Porque sale en el periódico','c) Porque viene en el libro de texto','d) Porque lo firma quien lo escribió'],c:0},
  {q:'¿Cuál es el orden de las partes de un cuento?',o:['a) Cierre, inicio y desarrollo','b) Desarrollo, cierre e inicio','c) Inicio, desarrollo y cierre','d) Inicio, cierre y desarrollo'],c:2},
  {q:'¿En qué parte del cuento aparece el problema?',o:['a) En el título','b) En el desarrollo','c) En el cierre','d) En el inicio'],c:1},
  {q:'«Era flaco y de bigote blanco». Esa oración describe al personaje…',o:['a) por dentro','b) por su nombre','c) por su oficio','d) por fuera'],c:3},
  {q:'«Yo iba solo con mi mula cuando vi los dos ojos rojos». ¿Quién narra?',o:['a) El protagonista','b) Un narrador que lo sabe todo','c) El autor del libro','d) Un narrador que solo mira desde fuera'],c:0},
  {q:'El narrador que sabe lo que piensan y sienten todos los personajes es el…',o:['a) testigo','b) objetivo','c) omnisciente','d) protagonista'],c:2},
  {q:'¿Qué texto cuenta la vida de una persona real?',o:['a) El cuento','b) La biografía','c) La noticia','d) La carta'],c:1},
  {q:'¿Por qué se dice que la lectura transmite cultura?',o:['a) Porque quien lee mucho habla más rápido','b) Porque los libros viejos valen más dinero','c) Porque todos los pueblos cuentan lo mismo','d) Porque lo escrito guarda lo que un pueblo sabe'],c:3},
  {q:'Antes de pasar tu cuento en limpio conviene…',o:['a) cambiarle el título','b) revisarlo y corregirlo','c) contarlo en voz alta','d) leer otro cuento'],c:1},
];

// ===================== CLASIFICA =====================
// Cuatro parejas que el alumno suele confundir. La primera es la del
// plan: cómo es el personaje por fuera y cómo es por dentro.
const classGroups=[
  {label:['Por fuera','Por dentro'],headA:'👀 Por fuera (lo que se ve)',headB:'💭 Por dentro (su manera de ser)',colA:'fue',colB:'den',
   words:[{w:'alto',t:'fue'},{w:'generoso',t:'den'},{w:'canoso',t:'fue'},{w:'terco',t:'den'},{w:'de bigote blanco',t:'fue'},{w:'miedoso',t:'den'},{w:'con trenzas largas',t:'fue'},{w:'trabajador',t:'den'},{w:'flaco',t:'fue'},{w:'callado',t:'den'}]},
  {label:['Primera persona','Tercera persona'],headA:'🙋 Primera persona (narra «yo»)',headB:'👉 Tercera persona (narra «él» o «ella»)',colA:'pri',colB:'ter',
   words:[{w:'«Yo cerré la puerta»',t:'pri'},{w:'«Él cerró la puerta»',t:'ter'},{w:'«Nosotros subimos al cerro»',t:'pri'},{w:'«Ellos subieron al cerro»',t:'ter'},{w:'«Me temblaban las manos»',t:'pri'},{w:'«Le temblaban las manos»',t:'ter'},{w:'«Vi una luz en el río»',t:'pri'},{w:'«Vio una luz en el río»',t:'ter'},{w:'«Mi mula no quiso seguir»',t:'pri'},{w:'«Su mula no quiso seguir»',t:'ter'}]},
  {label:['Narra','Describe'],headA:'🏃 Narra (cuenta lo que pasa)',headB:'🖼️ Describe (dice cómo es)',colA:'nar',colB:'des',
   words:[{w:'«La mula se paró en seco»',t:'nar'},{w:'«La mula era vieja y mansa»',t:'des'},{w:'«El perro salió del monte»',t:'nar'},{w:'«El perro era blanco y grande»',t:'des'},{w:'«Don Chema corrió hasta el pueblo»',t:'nar'},{w:'«Don Chema era flaco y callado»',t:'des'},{w:'«El río se llevó el puente»',t:'nar'},{w:'«El río era ancho y turbio»',t:'des'},{w:'«La abuela encendió una vela»',t:'nar'},{w:'«La casa era de adobe y teja»',t:'des'}]},
  {label:['Cuento','Biografía'],headA:'🌙 Es propio de un cuento',headB:'📜 Es propio de una biografía',colA:'cue',colB:'bio',
   words:[{w:'Puede ser inventado',t:'cue'},{w:'Cuenta la vida de una persona real',t:'bio'},{w:'Un animal puede hablar',t:'cue'},{w:'Da fechas y lugares que se pueden comprobar',t:'bio'},{w:'«Había una vez…»',t:'cue'},{w:'«Nació en Tegucigalpa en 1792»',t:'bio'},{w:'Puede narrarlo un personaje',t:'cue'},{w:'La escribe otra persona, después de averiguar',t:'bio'},{w:'Tiene un problema que se resuelve',t:'cue'},{w:'Sigue el orden de una vida',t:'bio'}]},
];

// ===================== IDENTIFICA =====================
// «Identifica la palabra clave»: la que dice cuándo pasa algo (las
// palabras que indican tiempo, DCNB p. 119) o la que describe al
// personaje. En cada oración hay una sola palabra que cumple lo pedido.
const idData=[
  {s:['Anoche','la','quebrada','sonaba','distinto.'],c:0,busca:'la palabra que dice cuándo pasó'},
  {s:['La','mula','se','paró','y','entonces','salió','el','perro.'],c:5,busca:'la palabra que dice en qué momento pasó'},
  {s:['Después','todos','subieron','a','la','escuela.'],c:0,busca:'la palabra que dice en qué momento pasó'},
  {s:['El','arriero','llegó','finalmente','al','pueblo.'],c:3,busca:'la palabra que dice en qué momento pasó'},
  {s:['Don','Chema','era','un','hombre','flaco.'],c:5,busca:'la palabra que describe al personaje por fuera'},
  {s:['La','abuela','de','Nahomy','es','generosa.'],c:5,busca:'la palabra que describe al personaje por dentro'},
  {s:['Por','el','camino','venía','una','mujer','altísima.'],c:6,busca:'la palabra que describe al personaje por fuera'},
  {s:['Toño','siempre','fue','un','muchacho','miedoso.'],c:5,busca:'la palabra que describe al personaje por dentro'},
];

// ===================== COMPLETA =====================
// «¿Quién narra?»: cada fragmento se completa con el narrador que le
// corresponde. Las pistas están en el fragmento («yo», «vi», «pensaba»).
const cmpData=[
  {s:'«Yo venía de la fiesta cuando vi a la mujer de blanco». Narra ___.',opts:['el protagonista','un narrador que lo sabe todo','un narrador que solo mira'],c:0},
  {s:'«Desde mi corredor vi pasar a Toño, pálido y sin habla». Narra ___.',opts:['el protagonista','un personaje testigo','un narrador que lo sabe todo'],c:1},
  {s:'«Toño iba silbando, aunque se moría de miedo; su primo, atrás, pensaba en su novia». Narra ___.',opts:['un personaje testigo','el protagonista','un narrador que lo sabe todo'],c:2},
  {s:'«Un muchacho bajó a la quebrada. Dijo unas palabras. Luego gritó y corrió». Narra ___.',opts:['un narrador que solo cuenta lo que se ve','el protagonista','un personaje testigo'],c:0},
  {s:'«Yo no solté la mano de mi hermano en toda la noche». Narra en ___ persona.',opts:['segunda','primera','tercera'],c:1},
  {s:'«Ella no soltó la mano de su hermano en toda la noche». Narra en ___ persona.',opts:['primera','segunda','tercera'],c:2},
  {s:'En «Había una vez un arriero que vivía en Olancho», el cuento está en su ___.',opts:['inicio','desarrollo','cierre'],c:0},
  {s:'En «Desde esa noche, el arriero nunca volvió tarde», el cuento está en su ___.',opts:['inicio','desarrollo','cierre'],c:2},
];

// ===================== WIDGETS =====================
// Widget 1: ordenar. «Ordena las partes de un cuento» (plan). Los dos
// cuentos son versiones nuestras; la biografía, con lo que acredita
// js/data/proceres-honduras.js.
const ordenaData=[
  {label:'El cuento del arriero y los dos perros',steps:['Un arriero vuelve de noche por el camino viejo','Un perro negro de ojos rojos le cierra el paso','Un perro blanco sale del monte y lo defiende','El perro negro se pierde en la oscuridad','El perro blanco lo acompaña hasta el pueblo y desaparece']},
  {label:'El cuento de la mujer de la quebrada',steps:['Un muchacho vuelve solo de una fiesta, a medianoche','Junto a la quebrada ve a una mujer de blanco, de espaldas','La mujer se vuelve y le muestra una cara de espanto','El muchacho corre sin parar hasta su casa','Desde esa noche no vuelve a pasar solo por la quebrada']},
  {label:'Los pasos para escribir un cuento',steps:['Planeas: personajes, lugar y problema','Escribes el borrador','Revisas y corriges','Pasas el cuento en limpio: la versión final']},
  {label:'La vida de Francisco Morazán, en orden',steps:['Nace en Tegucigalpa, en 1792','Llega a ser presidente de la República Federal de Centro América','Pelea por mantener unidas a las cinco naciones','Muere el 15 de septiembre de 1842']},
];
// Widget 2: «¿quién narra aquí?». Ocho fragmentos, dos de cada narrador.
const describeData=[
  {desc:'«Yo agarré a mi hermanito de la mano y salimos de la casa»',ans:'El protagonista',opts:['El protagonista','Un personaje testigo','El narrador objetivo','El narrador omnisciente']},
  {desc:'«Desde mi corredor vi salir a la familia con un candil»',ans:'Un personaje testigo',opts:['El protagonista','Un personaje testigo','El narrador objetivo','El narrador omnisciente']},
  {desc:'«Una familia salió de la casa con un candil y subió hacia la escuela»',ans:'El narrador objetivo',opts:['El protagonista','Un personaje testigo','El narrador objetivo','El narrador omnisciente']},
  {desc:'«Chela temblaba; su papá contaba los pasos para no pensar en la casa»',ans:'El narrador omnisciente',opts:['El protagonista','Un personaje testigo','El narrador objetivo','El narrador omnisciente']},
  {desc:'«Me quedé sin voz cuando la mujer volvió la cara hacia mí»',ans:'El protagonista',opts:['El protagonista','Un personaje testigo','El narrador objetivo','El narrador omnisciente']},
  {desc:'«Yo venía atrás de mi primo Toño: lo vi pararse junto a la quebrada y hablarle a alguien»',ans:'Un personaje testigo',opts:['El protagonista','Un personaje testigo','El narrador objetivo','El narrador omnisciente']},
  {desc:'«El muchacho se detuvo junto al agua. Después gritó y corrió»',ans:'El narrador objetivo',opts:['El protagonista','Un personaje testigo','El narrador objetivo','El narrador omnisciente']},
  {desc:'«Toño creyó que era una vecina; ella llevaba años esperándolo»',ans:'El narrador omnisciente',opts:['El protagonista','Un personaje testigo','El narrador objetivo','El narrador omnisciente']},
];
// Widget 3: «¿en qué parte del cuento va?»
const emparejaData=[
  {term:'«En lo alto de la montaña vivía una familia de leñadores»',resp:'Inicio',opts:['Inicio','Desarrollo','Cierre']},
  {term:'«Una mañana encontraron huellas enormes, con los dedos hacia atrás»',resp:'Desarrollo',opts:['Inicio','Desarrollo','Cierre']},
  {term:'«Y nunca más volvieron a cortar leña cerca de la cueva»',resp:'Cierre',opts:['Inicio','Desarrollo','Cierre']},
  {term:'«Doña Lola era la costurera del pueblo, bajita y de trenzas largas»',resp:'Inicio',opts:['Inicio','Desarrollo','Cierre']},
  {term:'«De pronto, la máquina de coser empezó a andar sola»',resp:'Desarrollo',opts:['Inicio','Desarrollo','Cierre']},
  {term:'«Desde ese día, doña Lola cose con la ventana abierta»',resp:'Cierre',opts:['Inicio','Desarrollo','Cierre']},
];
// Widget 4: «¿qué le pasa a este cuento?»
const situacionData=[
  {term:'El cuento de Wilmer empieza así: «El perro la perseguía por todo el potrero». Nunca dice quién es ella ni dónde está.',resp:'Le falta el inicio',opts:['Le falta el inicio','Le falta el problema','Le falta el cierre','Cambió de narrador']},
  {term:'El cuento de Suyapa presenta a una niña y su gato, describe su casa y termina: «Y vivieron tranquilos». No pasa nada más.',resp:'Le falta el problema',opts:['Le falta el inicio','Le falta el problema','Le falta el cierre','Cambió de narrador']},
  {term:'El cuento de Elmer llega a la parte en que el niño queda encerrado en la cueva… y ahí se acaba la hoja.',resp:'Le falta el cierre',opts:['Le falta el inicio','Le falta el problema','Le falta el cierre','Cambió de narrador']},
  {term:'El cuento de Nahomy empieza «Yo me llamo Rosa y vivo junto al río» y más abajo dice «Rosa pensó que nadie la veía».',resp:'Cambió de narrador',opts:['Le falta el inicio','Le falta el problema','Le falta el cierre','Cambió de narrador']},
  {term:'En el cuento de Óscar hay un perro, una tormenta y un final feliz, pero el lector nunca sabe cómo es el niño que lo vive.',resp:'Le falta describir al personaje',opts:['Le falta describir al personaje','Le falta el problema','Le falta el cierre','Cambió de narrador']},
  {term:'El cuento de Keyla tiene inicio y desarrollo, y termina: «Entonces se despertó». El problema del puente roto quedó sin resolver.',resp:'Le falta el cierre',opts:['Le falta el inicio','Le falta el problema','Le falta el cierre','Cambió de narrador']},
];

// ===================== RETO =====================
const retoPairs=[
  {label:['Primera persona','Tercera persona'],btnA:'🙋 Primera («yo»)',btnB:'👉 Tercera («él», «ella»)',colA:'pri',colB:'ter',
   words:[{w:'«Yo abrí la puerta»',t:'pri'},{w:'«Ella abrió la puerta»',t:'ter'},{w:'«Tuve mucho miedo»',t:'pri'},{w:'«Tuvo mucho miedo»',t:'ter'},{w:'«Nos escondimos»',t:'pri'},{w:'«Se escondieron»',t:'ter'},{w:'«Mi abuela me llamó»',t:'pri'},{w:'«Su abuela la llamó»',t:'ter'},{w:'«Corrí sin parar»',t:'pri'},{w:'«Corrió sin parar»',t:'ter'}]},
  {label:['Por fuera','Por dentro'],btnA:'👀 Por fuera',btnB:'💭 Por dentro',colA:'fue',colB:'den',
   words:[{w:'bajita',t:'fue'},{w:'bondadosa',t:'den'},{w:'pecoso',t:'fue'},{w:'valiente',t:'den'},{w:'de ojos negros',t:'fue'},{w:'desconfiado',t:'den'},{w:'barbudo',t:'fue'},{w:'paciente',t:'den'},{w:'de manos grandes',t:'fue'},{w:'honrada',t:'den'}]},
  {label:['Inicio','Cierre'],btnA:'🚪 Inicio',btnB:'🏁 Cierre',colA:'ini',colB:'cie',
   words:[{w:'«Había una vez un zapatero»',t:'ini'},{w:'«Y colorín colorado»',t:'cie'},{w:'«En una aldea vivía una niña»',t:'ini'},{w:'«Desde ese día nadie se burló»',t:'cie'},{w:'«Hace muchos años, en Olancho»',t:'ini'},{w:'«Así fue como hallaron la vaca»',t:'cie'},{w:'«Cuentan que un arriero»',t:'ini'},{w:'«Y nunca más volvió tarde»',t:'cie'},{w:'«Vivía junto al río una familia»',t:'ini'},{w:'«Por eso hoy nadie pasa de noche»',t:'cie'}]},
];

// ===================== GENERADOR DE TAREAS =====================
const identifyTaskDB=[
  {s:'«Yo cerré la puerta y me escondí debajo de la cama».',type:'Narra el protagonista (primera persona)'},
  {s:'«Desde la pulpería vi pasar al arriero, blanco como un papel».',type:'Narra un personaje testigo (primera persona)'},
  {s:'«El hombre se detuvo. Miró hacia los pinos. No se movió».',type:'Narrador objetivo (tercera persona): solo lo que se ve'},
  {s:'«Don Chema quería correr, pero pensó en su mula y se quedó».',type:'Narrador omnisciente (tercera persona): sabe lo que piensa'},
  {s:'«En una aldea de Olancho vivía un arriero llamado Chema».',type:'Inicio del cuento: presenta al personaje y el lugar'},
  {s:'«De pronto, la mula se paró en seco».',type:'Desarrollo del cuento: aparece el problema'},
  {s:'«Desde esa noche dejaba un guacal de agua en la cerca».',type:'Cierre del cuento'},
  {s:'«Era un hombre flaco, de bigote blanco».',type:'Descripción del personaje por fuera'},
  {s:'«Era callado y muy trabajador».',type:'Descripción del personaje por dentro'},
  {s:'«Nació en Tegucigalpa el 3 de octubre de 1792».',type:'Dato de una biografía (la de Francisco Morazán)'},
];
const classifyTaskDB=[
  {w:'«Yo venía de la fiesta cuando vi a una mujer de blanco»',gen:'El protagonista',n:'Primera',g:'Desarrollo',t:'Dice «yo» y le pasa a él'},
  {w:'«Desde mi corredor vi salir a la familia con un candil»',gen:'Un testigo',n:'Primera',g:'Desarrollo',t:'Dice «vi», pero la historia es de otros'},
  {w:'«En lo alto de la montaña vivía una familia de leñadores»',gen:'Narrador de fuera',n:'Tercera',g:'Inicio',t:'Presenta a los personajes y el lugar'},
  {w:'«Chela iba muerta de miedo y pensaba en su casa, pero no soltó la mano de su hermano»',gen:'Narrador omnisciente',n:'Tercera',g:'Desarrollo',t:'Sabe lo que ella siente y piensa'},
  {w:'«El muchacho gritó, dio media vuelta y corrió»',gen:'Narrador objetivo',n:'Tercera',g:'Desarrollo',t:'Solo cuenta lo que se ve y se oye'},
  {w:'«Desde ese día nunca volví a pasar solo por la quebrada»',gen:'El protagonista',n:'Primera',g:'Cierre',t:'Dice «volví» y cierra la historia'},
  {w:'«Y nunca más cortaron leña cerca de la cueva»',gen:'Narrador de fuera',n:'Tercera',g:'Cierre',t:'Dice «cortaron» y cuenta cómo terminó'},
  {w:'«Había una vez un zapatero muy pobre y muy alegre»',gen:'Narrador de fuera',n:'Tercera',g:'Inicio',t:'Fórmula para empezar y descripción'},
];
const completeTaskDB=[
  {s:'Los cuentos que pasan de boca en boca, sin estar escritos, son de tradición ___.',opts:['oral','escrita','impresa'],ans:'oral'},
  {s:'Las tres partes del cuento son inicio, ___ y cierre.',opts:['título','desarrollo','portada'],ans:'desarrollo'},
  {s:'El problema del cuento se resuelve en el ___.',opts:['inicio','ambiente','cierre'],ans:'cierre'},
  {s:'El personaje principal de un cuento se llama ___.',opts:['protagonista','narrador','autor'],ans:'protagonista'},
  {s:'La voz que cuenta el cuento es el ___.',opts:['personaje','narrador','lector'],ans:'narrador'},
  {s:'El narrador que lo sabe todo se llama ___.',opts:['testigo','objetivo','omnisciente'],ans:'omnisciente'},
  {s:'El texto que cuenta la vida de una persona real es una ___.',opts:['biografía','receta','fábula'],ans:'biografía'},
  {s:'El lugar y el tiempo en que pasa un cuento forman su ___.',opts:['cierre','ambiente','borrador'],ans:'ambiente'},
];
const explainQuestions=[
  {q:'Cuenta lo que te contaron en tu casa: pídele a una persona mayor un cuento que haya oído de niña y escríbelo con tus palabras. Anota quién te lo contó y de quién lo oyó.',ans:'Respuesta abierta. Se valora que el cuento tenga inicio, desarrollo y cierre, que diga quién lo contó y de quién lo aprendió, y que respete la versión de esa persona aunque sea distinta de otras.'},
  {q:'Escribe con tus palabras el cuento del arriero y los dos perros y marca dónde empieza el desarrollo y dónde empieza el cierre.',ans:'Respuesta abierta. El desarrollo empieza cuando aparece el problema (la mula se para y sale el perro negro). El cierre empieza cuando el problema se resuelve (el perro negro retrocede y se pierde en la oscuridad) y cuenta cómo termina todo.'},
  {q:'Describe a una persona de tu familia: tres rasgos de cómo es por fuera y tres de cómo es por dentro.',ans:'Respuesta abierta. Ejemplo: por fuera, «bajita, de pelo canoso y manos pequeñas»; por dentro, «paciente, risueña y muy trabajadora». Se valora que no mezcle las dos listas.'},
  {q:'Cuenta en primera persona, como si fueras el arriero, el momento en que apareció el perro negro. Después cuéntalo en tercera persona.',ans:'Respuesta abierta. Ejemplo: «Yo sentí que las piernas no me obedecían» (primera persona, protagonista) y «El arriero sintió que las piernas no le obedecían» (tercera persona). Se valora que no cambie de narrador a medio texto.'},
  {q:'¿En qué se diferencia un cuento de tradición oral de un cuento de autor? Da dos diferencias.',ans:'El de tradición oral es anónimo, pasa de boca en boca y cambia con cada persona que lo cuenta (tiene versiones). El de autor tiene un autor conocido, está escrito y su texto no cambia.'},
  {q:'Busca en la biblioteca de tu centro un cuento de un escritor o una escritora de Honduras. Anota el título, quién lo escribió y, en una oración cada una, su inicio, su desarrollo y su cierre.',ans:'Respuesta abierta. Se valora que el título y el nombre de quien lo escribió estén copiados tal como aparecen en el libro, y que cada parte esté resumida con palabras propias, sin copiar párrafos.'},
  {q:'Escribe la biografía corta de una persona mayor de tu comunidad: pregúntale dónde y cuándo nació, a qué se ha dedicado y qué recuerda con más cariño.',ans:'Respuesta abierta. Se valora que los hechos sean reales (preguntados, no inventados), que vayan en el orden en que pasaron, que estén escritos en tercera persona y que den al menos una fecha y un lugar.'},
  {q:'Explica con tus palabras por qué se dice que la lectura transmite la cultura de un pueblo. Da un ejemplo con un cuento que conozcas.',ans:'Porque en sus cuentos un pueblo guarda lo que sabe, lo que cree, sus costumbres y su manera de hablar, y quien los lee lo recibe aunque viva lejos o haya nacido después. Ejemplo: en el cuento del Cadejo aparecen los arrieros, las mulas y los caminos de antes.'},
];

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['D','X','Z','N','N','O','R','A','L','P'],
    ['N','A','R','R','A','D','O','R','T','Z'],
    ['S','P','E','R','S','O','N','A','J','E'],
    ['T','C','D','D','L','T','D','C','M','Z'],
    ['E','I','I','C','S','M','Q','P','B','S'],
    ['S','P','N','E','U','H','F','T','C','J'],
    ['T','M','G','I','R','E','K','Q','Q','T'],
    ['I','D','H','S','C','R','N','Q','X','L'],
    ['G','G','R','X','L','I','E','T','R','P'],
    ['O','Q','K','G','D','H','O','G','O','K']
  ],words:[
    {w:'NARRADOR',cells:[[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]]},
    {w:'PERSONAJE',cells:[[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8],[2,9]]},
    {w:'CUENTO',cells:[[4,3],[5,4],[6,5],[7,6],[8,7],[9,8]]},
    {w:'INICIO',cells:[[4,1],[5,2],[6,3],[7,4],[8,5],[9,6]]},
    {w:'CIERRE',cells:[[3,1],[4,2],[5,3],[6,4],[7,5],[8,6]]},
    {w:'TESTIGO',cells:[[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]]},
    {w:'ORAL',cells:[[0,5],[0,6],[0,7],[0,8]]}
  ]},
  {size:10,grid:[
    ['N','M','S','I','S','I','M','I','T','E'],
    ['Q','C','U','L','T','U','R','A','D','D'],
    ['B','I','O','G','R','A','F','I','A','D'],
    ['J','Z','K','B','P','P','S','G','Z','T'],
    ['C','A','D','E','J','O','Z','G','Q','H'],
    ['G','M','K','K','J','H','X','J','Q','T'],
    ['D','R','C','L','E','C','T','U','R','A'],
    ['F','F','C','V','L','K','Q','L','R','T'],
    ['D','E','S','A','R','R','O','L','L','O'],
    ['T','R','A','D','I','C','I','O','N','M']
  ],words:[
    {w:'BIOGRAFIA',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7],[2,8]]},
    {w:'TRADICION',cells:[[9,0],[9,1],[9,2],[9,3],[9,4],[9,5],[9,6],[9,7],[9,8]]},
    {w:'DESARROLLO',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6],[8,7],[8,8],[8,9]]},
    {w:'CADEJO',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]]},
    {w:'SISIMITE',cells:[[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
    {w:'LECTURA',cells:[[6,3],[6,4],[6,5],[6,6],[6,7],[6,8],[6,9]]},
    {w:'CULTURA',cells:[[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]]}
  ]}
];

// ===================== EXAMEN CONCEPTUAL =====================
// UN DATO, UNA PREGUNTA. Cada forma saca cinco de cada banco y pueden caer
// juntas cualesquiera, así que ninguna pregunta pide un dato que otra ya pide
// (su `k` no se repite) y ninguna respuesta aparece escrita en otra pregunta,
// tampoco como opción equivocada. Lo comprueba
// `_dev/verifica-examen-sin-pistas.js`.
//
// ⚠️ TRES REGLAS MÁS, de la revisión de las tandas 2 y 3:
//  · La respuesta de un completar no está escrita en NINGÚN otro enunciado
//    de los dos bancos (ni en una opción ni en un pareado). Por eso fuera
//    de su completar no se escribe el nombre de tres de los narradores ni
//    el del personaje principal: se dice «el personaje al que le pasa»,
//    «alguien que lo sabe todo», «alguien de fuera».
//  · Cada completar tiene UNA sola respuesta válida: o es el nombre que se
//    enseñó, o es la palabra que sale de lo que da el enunciado (una
//    cuenta, un verbo cambiado de persona). `acc` solo guarda maneras de
//    escribir esa misma respuesta. La única excepción es `cp-objetivo`,
//    que acepta también «observador» (decisión de Josué, PR 63).
//  · En la selección, la correcta no es la opción más larga ni la más corta
//    más que alguna vez (se miden las dos; ver el PR).
//
// ⚠️ Y ninguna la contesta el cuento del arriero (el que la guía trae
// entero) ni las escenas del laboratorio: los fragmentos del examen son
// otros (el zapatero, el leñador, doña Lola, don Chico, Lucía).
//
// ⚠️ La lectura como transmisión de cultura lleva DOS preguntas y no más
// (decisión del PR 61): `tf-cultura` y `mc-cultura`, las dos en el banco de
// las formas 1 a 30. Preguntan cosas distintas (leer a otro pueblo; leer lo
// que dejó escrito el propio) para que una no conteste la otra.
//
// ⚠️ El examen no pregunta nada que sea solo de Media: una forma le puede
// tocar a un alumno de 7.º. Lo de Media va en su tarjeta y en la ficha.
const evalTFBank=[
  {q:'Al leer un cuento de otro país puedes conocer costumbres y maneras de hablar de un pueblo en el que nunca has estado.',a:true,k:'tf-cultura',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (reconoce la lectura como medio de comunicación y de transmisión de cultura de los pueblos) · DCNB pp. 89, 122 y 163 (el mismo contenido actitudinal) · el DCNB la nombra y no la explica: la explicación es redacción nuestra'},
  {q:'Los cuentos de tradición oral se aprenden leyéndolos en los libros de la escuela.',a:false,k:'tf-oral-libro',grado:'7.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 23 (el cuento de tradición oral) · DCNB pp. 86 y 103 (escuchan y narran un cuento de tradición oral; manifestaciones de la literatura oral) · la definición de tradición oral es redacción nuestra'},
  {q:'Quien cuenta un cuento de tradición oral lo repite sin cambiarle nada, tal como se lo contaron.',a:false,k:'tf-oral-cambia',grado:'7.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 23 (el cuento de tradición oral) · DCNB pp. 105 y 142 (redactan versiones propias de cuentos) · que el cuento de tradición oral cambia con quien lo cuenta es redacción nuestra'},
  {q:'En el desarrollo de un cuento aparece el problema que hay que enfrentar.',a:true,k:'tf-desarrollo-problema',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración: inicio, desarrollo y cierre) · DCNB pp. 104 y 142 (iniciación, desarrollo, cierre) · qué pasa en cada parte es redacción nuestra'},
  {q:'El narrador de un cuento y la persona que lo escribió son lo mismo.',a:false,k:'tf-narrador-escritor',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (punto de vista o narrador: del protagonista, del personaje testigo…) · la diferencia entre narrador y autor es redacción nuestra'},
  {q:'Para describir bien a un personaje conviene decir cómo se ve y también cómo es su manera de ser.',a:true,k:'tf-describir-dos',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (la descripción: personajes; descripción de personajes) · DCNB pp. 104 y 106 (la descripción física, psicológica o ambas de los personajes) · decirlo «por fuera» y «por dentro» es redacción nuestra'},
  {q:'Un personaje que narra diciendo «yo» puede saber con seguridad lo que los demás piensan en secreto.',a:false,k:'tf-yo-pensamientos',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (del protagonista, 1.° persona; del personaje testigo, 1.° persona) · qué sabe y qué no sabe cada narrador es redacción nuestra'},
  {q:'En un cuento pueden pasar cosas que en la vida real no pasan, como que un animal hable.',a:true,k:'tf-inventado',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (textos literarios: el cuento) · DCNB p. 105 (redactan cuentos de su propia invención) · que el cuento es una narración inventada es redacción nuestra'},
  {q:'Una biografía la escribe la misma persona de la que habla.',a:false,k:'tf-biografia-quien',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (descriptivos: biografía) · DCNB p. 177 (la autobiografía es el testimonio de la vida del mismo autor de la obra) · la definición de biografía es redacción nuestra'},
  {q:'En Honduras hay cuentos de tradición oral y también cuentos escritos y firmados por escritores del país.',a:true,k:'tf-cuento-honduras',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (cuento de autores nacionales e hispanoamericanos; el cuento en Honduras) · DCNB p. 119 (recopilan cuentos de autore(a)s nacionales) · no se nombra a ningún autor: en _dev/ no hay fuente con qué acreditarlo'}
];
const evalMCBank=[
  {q:'Los abuelos de una aldea ya murieron, pero alguien copió en un cuaderno los cuentos que ellos contaban. ¿Qué logran los jóvenes que hoy leen ese cuaderno?',o:['a) Recibir lo que su comunidad sabía y creía','b) Conocer al autor que inventó cada cuento','c) Aprender cuentos que solo sirven para asustar','d) Probar que cada cuento pasó de verdad'],a:0,k:'mc-cultura',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (reconoce la lectura como medio de comunicación y de transmisión de cultura de los pueblos) · DCNB pp. 89, 122 y 163 (el mismo contenido actitudinal) · el DCNB la nombra y no la explica: la explicación es redacción nuestra'},
  {q:'¿Cuál de estos cuentos es de tradición oral?',o:['a) El que una escritora publicó hace poco en su libro','b) El que tu bisabuela oyó de niña y hoy te cuenta','c) El que un compañero escribió ayer para la clase','d) El que sale firmado en el periódico del domingo'],a:1,k:'mc-oral-cual',grado:'7.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 23 (el cuento de tradición oral) · DCNB pp. 86 y 103 (cuento de tradición oral; literatura oral) · la definición de tradición oral es redacción nuestra'},
  {q:'Un cuento empieza contando cómo se salvó el niño y solo al final dice quién era ese niño y dónde vivía. ¿Qué tiene mal?',o:['a) Le falta contar el problema','b) Le falta nombrar al personaje','c) Sus partes van en desorden','d) No tiene ningún narrador'],a:2,k:'mc-orden-partes',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración: inicio, desarrollo y cierre) · DCNB pp. 104, 142 y 179 (iniciación, desarrollo, cierre)'},
  {q:'«Yo iba por la vereda cuando alguien me llamó por mi nombre». ¿Quién cuenta esta historia?',o:['a) El personaje que lo vivió','b) Una señora que miraba de lejos','c) Alguien que no estuvo en el lugar','d) La persona que publicó el libro'],a:0,k:'mc-yo-vereda',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (del protagonista, 1.° persona) · el fragmento es inventado; cómo se reconoce a cada narrador es redacción nuestra'},
  {q:'¿Cuál de estas palabras dice cómo es un personaje por dentro?',o:['a) barbudo','b) pecoso','c) bajito','d) honrado'],a:3,k:'mc-por-dentro',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (descripción de personajes) · DCNB pp. 104 y 106 (la descripción física y la psicológica de los personajes) · decirlo «por dentro» es redacción nuestra'},
  {q:'¿Cuál de estas oraciones sirve mejor como inicio de un cuento?',o:['a) «Y nunca más volvieron a burlarse de ese niño»','b) «En una aldea vivía una niña llamada Suyapa»','c) «De repente, la puerta se cerró de un golpe»','d) «Así fue como recuperaron la vaca perdida»'],a:1,k:'mc-es-inicio',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración: inicio, desarrollo y cierre) · DCNB pp. 104 y 142 (iniciación) · las oraciones son inventadas; qué pasa en cada parte es redacción nuestra'},
  {q:'Para escribir una biografía hace falta, antes que nada…',o:['a) imaginar un final que sorprenda','b) investigar cómo fue esa vida','c) elegir un lugar inventado','d) buscar un personaje que la narre'],a:1,k:'mc-biografia-antes',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (descriptivos: biografía) · DCNB p. 141 (la investigación para informarse sobre la vida de los autores) · que la biografía cuenta hechos reales y averiguados es redacción nuestra'},
  {q:'¿Cuál de estas oraciones describe a un personaje, en lugar de narrar lo que hace?',o:['a) «Don Chico ensilló la mula y salió»','b) «Don Chico vendió el maíz en el mercado»','c) «Don Chico era bajito, risueño y hablador»','d) «Don Chico regresó cuando ya era de noche»'],a:2,k:'mc-describe',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (la narración; la descripción: personajes) · DCNB p. 86 (semejanzas y diferencias entre la descripción y la narración) · las oraciones son inventadas; la explicación es redacción nuestra'},
  {q:'Vas a escribir un cuento. ¿Qué haces de último?',o:['a) Pensar de qué va a tratar el cuento','b) Escribir todo el texto de prueba','c) Dejar en limpio el cuento completo','d) Corregir lo que no se entiende'],a:2,k:'mc-pasos-ultimo',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (planeación de textos; producción de textos: borrador, revisión y versión final; texto literario: el cuento) · DCNB p. 105 (planifican, redactan y revisan el cuento producido)'},
  {q:'«Lucía sonrió, pero tenía ganas de llorar; su hermano solo pensaba en el almuerzo». ¿Cómo es este narrador?',o:['a) Es Lucía, que cuenta su día','b) Es su hermano, que la está observando','c) Solo cuenta lo que se ve desde lejos','d) Conoce los pensamientos de ambos'],a:3,k:'mc-sabe-todo',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (narrador omnisciente, 3.° persona) · el fragmento es inventado; qué sabe cada narrador es redacción nuestra'}
];
const evalCPBank=[
  {q:'Abuelos, padres e hijos son tres escalones de una familia. A cada escalón se le llama una ___, y los cuentos de la casa pasan de una a otra.',a:'generación',acc:['generación','generacion'],k:'cp-generacion',grado:'7.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 23 (el cuento de tradición oral) · DCNB p. 103 (textos de tradición oral) · la definición de tradición oral es redacción nuestra'},
  {q:'Las tres partes del cuento tienen también otros nombres: planteamiento, nudo y ___.',a:'desenlace',acc:['desenlace'],k:'cp-desenlace',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración: inicio, desarrollo y cierre) · DCNB p. 119 (características de las narraciones: planteamiento, nudo y desenlace)'},
  {q:'Al personaje principal de un cuento, el que vive la historia de principio a fin, se le llama ___.',a:'protagonista',acc:['protagonista','el protagonista','la protagonista'],k:'cp-protagonista',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF p. 7 (descripción de personajes) · DCNB p. 140 (personajes principales y secundarios) y p. 179 (del protagonista) · la definición es redacción nuestra'},
  {q:'«Yo abrí la puerta y vi al perro». Quien narra así, diciendo «yo», narra en ___ persona.',a:'primera',acc:['primera','1.ª','1ª','1a'],k:'cp-primera',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (del protagonista, 1.° persona) y p. 112 (primera persona: la acción la realiza el hablante)'},
  {q:'Una biografía de Francisco Morazán da dos años: 1792, el de su nacimiento, y 1842, el de su muerte. Entre uno y otro pasaron ___ años.',a:'50',acc:['50','cincuenta'],k:'cp-morazan',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (descriptivos: biografía) · los dos años, de js/data/proceres-honduras.js · cruce con Matemáticas: la línea de tiempo de una biografía. No se pregunta la edad: murió unos días antes de cumplir años'},
  {q:'De un cuento del que nadie sabe quién lo inventó se dice que es un cuento ___, es decir, sin nombre de quien lo creó.',a:'anónimo',acc:['anónimo','anonimo'],k:'cp-anonimo',grado:'7.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 23 (el cuento de tradición oral) · DCNB p. 103 (textos de tradición oral) · que el cuento de tradición oral es anónimo es redacción nuestra'},
  {q:'Cuéntalo con otra voz. «Yo crucé el río con miedo» se convierte en «Ella ___ el río con miedo».',a:'cruzó',acc:['cruzó','cruzo'],k:'cp-cruzo',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (redactan versiones de cuentos transformando puntos de vista) · el ejemplo es inventado'},
  {q:'Al texto de prueba de un cuento, lleno de tachones y flechas, se le llama ___.',a:'borrador',acc:['borrador','el borrador'],k:'cp-borrador',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (producción de textos: borrador, revisión y versión final; texto literario: el cuento) · la explicación es redacción nuestra'},
  {q:'Los personajes que acompañan al principal, pero no son el centro de la historia, se llaman personajes ___.',a:'secundarios',acc:['secundarios','secundario'],k:'cp-secundarios',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (textos narrativos: el cuento en Honduras) · DCNB p. 140 (personajes principales y secundarios) · la definición es redacción nuestra'},
  {q:'Un personaje que no es el principal cuenta, diciendo «yo», lo que le vio pasar a otro. Es un narrador ___.',a:'testigo',acc:['testigo'],k:'cp-testigo',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (del personaje testigo, 1.° persona) · la definición es redacción nuestra'}
];
const evalPRBank=[
  {term:'El inicio',def:'Parte del cuento que presenta a los personajes y el lugar',k:'pr-inicio',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración: inicio, desarrollo y cierre) · DCNB pp. 104 y 142 (iniciación) · qué pasa en cada parte es redacción nuestra'},
  {term:'El cierre',def:'Parte del cuento donde el problema queda resuelto',k:'pr-cierre',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración: inicio, desarrollo y cierre) · DCNB pp. 104 y 142 (cierre) · qué pasa en cada parte es redacción nuestra'},
  {term:'El personaje',def:'Cada uno de los seres que actúan en un cuento',k:'pr-personaje',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (la descripción: personajes) · DCNB p. 86 (identifican los personajes descritos en la narración de cuentos) · la definición es redacción nuestra'},
  {term:'El narrador',def:'La voz que cuenta lo que pasa en el cuento',k:'pr-narrador',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (punto de vista o narrador) · la definición es redacción nuestra'},
  {term:'La biografía',def:'Texto que cuenta la vida de una persona real',k:'pr-biografia',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (descriptivos: biografía) · DCNB p. 177 (biografías) · la definición es redacción nuestra'},
  {term:'La descripción',def:'Dice cómo es una persona, un animal o un lugar',k:'pr-descripcion',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (la descripción: personajes) · DCNB p. 86 (la descripción y la narración: semejanzas y diferencias) · la definición es redacción nuestra'},
  {term:'La narración',def:'Cuenta hechos que pasan uno después de otro',k:'pr-narracion',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (la narración: el cuento de tradición oral) · DCNB p. 86 (la descripción y la narración: semejanzas y diferencias) · la definición es redacción nuestra'},
  {term:'El ambiente',def:'El lugar y el tiempo en que pasa la historia',k:'pr-ambiente',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (textos narrativos: el cuento en Honduras) · DCNB p. 140 (ambiente, espacio, tiempo) · la definición es redacción nuestra'},
  {term:'La tercera persona',def:'Se narra con «él», «ella» o «ellos»',k:'pr-tercera',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (narrador objetivo y narrador omnisciente, 3.° persona) y p. 112 (tercera persona: la acción la realiza una persona distinta al oyente y al hablante)'},
  {term:'El autor',def:'Persona que crea y firma un cuento escrito',k:'pr-autor',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (cuento de autores nacionales e hispanoamericanos) · DCNB p. 119 (cuentos de autore(a)s nacionales) · la definición es redacción nuestra'}
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
  {q:'Un cuento es una narración muy larga, que no se alcanza a contar en una noche.',a:false,k:'tf-cuento-largo',fuente:'Guía (Aprende): La tradición oral · Ficha, página 1 (1. La tradición oral y el cuento)',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (textos literarios: el cuento) · DCNB p. 103 (normas para narrar un relato: brevedad) · que el cuento es una narración corta es redacción nuestra'},
  {q:'Palabras como «de pronto» y «al rato» sirven en un cuento para describir cómo es un personaje.',a:false,k:'tf-de-pronto',fuente:'Guía (Aprende): Las tres partes del cuento · Ficha, página 2 (2. Las tres partes del cuento)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración) · DCNB p. 119 (identifican el uso de palabras que indican tiempo) · los ejemplos son de uso común'},
  {q:'Un narrador que no es personaje del cuento narra con «él», «ella» o «ellos».',a:true,k:'tf-tercera-fuera',fuente:'Guía (Aprende): ¿Quién narra? El punto de vista · Ficha, página 3 (5. ¿Quién narra? El punto de vista)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (narrador objetivo y narrador omnisciente, 3.° persona) · la explicación es redacción nuestra'},
  {q:'Todo cuento, por corto que sea, tiene siempre inicio, desarrollo y cierre.',a:true,k:'tf-tres-partes-corto',fuente:'Guía (Aprende): Las tres partes del cuento · Ficha, página 2 (2. Las tres partes del cuento)',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración: inicio, desarrollo y cierre) · DCNB pp. 103 y 139 (normas para narrar un relato: poseer un inicio, un desarrollo y un desenlace)'},
  {q:'Si cambia quien narra un suceso, el lector se entera de las mismas cosas.',a:false,k:'tf-cambia-narrador',fuente:'Actividad Laboratorio: la cámara del narrador · Ficha, página 3 (5. ¿Quién narra? El punto de vista)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (redactan versiones de cuentos transformando puntos de vista) · qué sabe y qué no sabe cada narrador es redacción nuestra'},
  {q:'Lo que hace valioso a un cuento de tradición oral es que se pueda comprobar que pasó de verdad.',a:false,k:'tf-vale-comprobar',fuente:'Guía (Aprende): La tradición oral · Ficha, página 1 (1. La tradición oral y el cuento)',grado:'7.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 23 (el cuento de tradición oral) · DCNB p. 103 (textos literarios narrativos de la tradición oral) · que el cuento es literatura y no una noticia es redacción nuestra'},
  {q:'En un mismo cuento hay partes que narran y partes que describen.',a:true,k:'tf-narra-describe',fuente:'Guía (Aprende): Los personajes y el ambiente · Actividad Clasifica: Narra (cuenta lo que pasa)',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (la narración; la descripción) · DCNB p. 119 (identifican en cada cuento las muestras de descripción y la narración) y p. 105 (la descripción como recurso de la narración)'},
  {q:'Mientras un compañero narra su cuento ante el grado, se le puede interrumpir cada vez que uno recuerda algo.',a:false,k:'tf-escuchar',fuente:'Guía (Aprende): La tradición oral · Ficha, página 4 (7. Escribe y cuenta tu cuento)',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (lengua oral: la narración, el cuento de tradición oral) · DCNB p. 86 (escuchan y narran en equipo un cuento de tradición oral; respeto por las normas de interacción verbal)'},
  {q:'Se puede escribir la biografía de una persona que todavía vive.',a:true,k:'tf-biografia-vivo',fuente:'Guía (Aprende): La biografía · Ficha, página 4 (6. La biografía)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (descriptivos: biografía) · la definición de biografía es redacción nuestra; no pide que la persona haya muerto'},
  {q:'Hay cuentos inventados que pasan en lugares que existen de verdad, como una aldea de Olancho.',a:true,k:'tf-lugar-real',fuente:'Guía (Aprende): Los personajes y el ambiente · Ficha, página 2 (3. Los personajes y el ambiente)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (textos narrativos: el cuento en Honduras) · DCNB p. 140 (ambiente, espacio, tiempo) · la explicación es redacción nuestra'}
];
const evalMCBankNuevo=[
  {q:'¿Con cuál de estas oraciones terminarías un cuento?',o:['a) «En un pueblo lejano había un zapatero muy pobre»','b) «Una mañana, el zapatero halló la puerta abierta»','c) «Desde aquel día, al zapatero no le faltó trabajo»','d) «El zapatero era delgado y de manos muy grandes»'],a:2,k:'mc-es-cierre',fuente:'Guía (Aprende): Las tres partes del cuento · Actividad «¿En qué parte del cuento va?» 3 y 6',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración: inicio, desarrollo y cierre) · DCNB pp. 104 y 142 (cierre) · las oraciones son inventadas; qué pasa en cada parte es redacción nuestra'},
  {q:'¿Cuál de estas palabras sirve en un cuento para decir cuándo pasa algo?',o:['a) anoche','b) terco','c) quebrada','d) despacio'],a:0,k:'mc-palabra-tiempo',fuente:'Guía (Aprende): Las tres partes del cuento · Actividad Identifica 1',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración) · DCNB p. 119 (identifican el uso de palabras que indican tiempo)'},
  {q:'«Desde mi ventana vi a mi vecino cavar junto al pozo; nunca supe qué buscaba». ¿Quién narra?',o:['a) El vecino, que cuenta lo que hizo','b) Un personaje que solo lo vio','c) Una voz que está en todas partes','d) Una persona que no estuvo ese día'],a:1,k:'mc-vecino-pozo',fuente:'Guía (Aprende): ¿Quién narra? El punto de vista · Actividad «¿Quién narra aquí?» 2 y 6',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (del personaje testigo, 1.° persona) · el fragmento es inventado; cómo se reconoce a cada narrador es redacción nuestra'},
  {q:'¿Cuál de estas oraciones describe a un personaje por fuera?',o:['a) «Doña Lola desconfiaba de todo el mundo»','b) «Doña Lola nunca mentía»','c) «Doña Lola perdonaba fácil»','d) «Doña Lola usaba trenzas largas»'],a:3,k:'mc-por-fuera',fuente:'Guía (Aprende): Los personajes y el ambiente · Actividad Clasifica: Por fuera (lo que se ve)',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (descripción de personajes) · DCNB pp. 104 y 106 (la descripción física y la psicológica de los personajes) · decirlo «por fuera» es redacción nuestra'},
  {q:'¿Cuál de estas oraciones pertenece al desarrollo de un cuento?',o:['a) «En el cerro había un leñador con su hija»','b) «Una tarde, el hacha se le cayó al río»','c) «Y nunca más volvió a perder nada»','d) «El leñador era un hombre muy callado»'],a:1,k:'mc-desarrollo-cual',fuente:'Guía (Aprende): Las tres partes del cuento · Actividad «¿En qué parte del cuento va?» 2 y 5',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración: inicio, desarrollo y cierre) · DCNB pp. 104 y 142 (desarrollo) · las oraciones son inventadas; qué pasa en cada parte es redacción nuestra'},
  {q:'Al planear un cuento, ¿qué se decide?',o:['a) El título, la portada y las ilustraciones','b) Los personajes, el lugar y el problema','c) El número de páginas y de palabras','d) Quién lo va a leer, cuándo y dónde'],a:1,k:'mc-planear',fuente:'Guía (Aprende): Escribe y cuenta tu cuento · Actividad Laboratorio: el esqueleto de tu cuento',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (planeación de textos; texto literario: el cuento) · DCNB p. 105 (planifican el escrito elaborando el esquema que responda a la estructura de la obra narrativa) · qué se decide al planear un cuento es redacción nuestra'},
  {q:'Un cuento empieza: «Yo me llamo Elmer y esa noche no pude dormir». Más abajo dice: «Elmer se levantó sin saber por qué». ¿Qué falla?',o:['a) Le falta el inicio','b) No describe al personaje','c) Cambió de narrador','d) Le falta el problema'],a:2,k:'mc-cambio-narrador',fuente:'Guía (Aprende): ¿Quién narra? El punto de vista · Actividad «¿Qué le pasa a este cuento?» 4',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (cuidando de usar adecuadamente el punto de vista o narrador) · el ejemplo es inventado'},
  {q:'«India virgen y hermosa dormías»: en ese verso del Himno Nacional, la voz le habla a Honduras. ¿Cómo la trata?',o:['a) De «tú»','b) De «usted»','c) De «vosotros»','d) De «ustedes»'],a:0,k:'mc-himno',fuente:'Guía (Aprende): ¿Quién habla en el Himno? · Ficha, página 3 (5. ¿Quién narra? El punto de vista)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (punto de vista: segunda persona) · el verso, de js/data/himno.js · que la voz le habla de «tú» es lectura nuestra del verbo «dormías»'},
  {q:'«Era un domingo de feria en el parque de Gracias». ¿Qué dos cosas dice esa oración?',o:['a) Quién es el personaje y qué quiere','b) Cuál es el problema y cómo termina','c) Quién narra y qué sabe de todos','d) Dónde y cuándo ocurre lo contado'],a:3,k:'mc-ambiente-cual',fuente:'Guía (Aprende): Los personajes y el ambiente · Ficha, página 2 (3. Los personajes y el ambiente)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (textos narrativos: el cuento en Honduras) · DCNB p. 140 (ambiente, espacio, tiempo) · la oración es inventada'},
  {q:'Vas a narrar un cuento ante tus compañeros. ¿Qué te ayuda más?',o:['a) Decirlo palabra por palabra, como lo leíste','b) Contar el final al principio, para que nadie se pierda','c) Hacer pausas en los momentos de suspenso','d) Cambiar de narrador para que suene más variado'],a:2,k:'mc-narrar-bien',fuente:'Guía (Aprende): Escribe y cuenta tu cuento · Ficha, página 4 (7. Escribe y cuenta tu cuento)',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF p. 7 (lengua oral: la narración) y p. 15 (entonación, énfasis y pausas) · DCNB p. 86 (escuchan y narran en equipo un cuento de tradición oral) · el consejo es redacción nuestra'}
];
const evalCPBankNuevo=[
  {q:'El narrador que lo sabe todo, hasta lo que cada personaje piensa y siente, se llama narrador ___.',a:'omnisciente',acc:['omnisciente'],k:'cp-omnisciente',fuente:'Guía (Aprende): ¿Quién narra? El punto de vista · Actividad Laboratorio: la cámara del narrador',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (narrador omnisciente, 3.° persona) · la definición es redacción nuestra'},
  {q:'Cuéntalo con otra voz. «Él oyó pasos en el corredor» se convierte en «Yo ___ pasos en el corredor».',a:'oí',acc:['oí','oi'],k:'cp-oi',fuente:'Guía (Aprende): ¿Quién narra? El punto de vista · Actividad Clasifica: Primera persona (narra «yo»)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (redactan versiones de cuentos transformando puntos de vista) · el ejemplo es inventado'},
  {q:'Una biografía ordena los hechos de una vida como pasaron. De «murió», «estudió» y «nació», el que va al comienzo es ___.',a:'nació',acc:['nació','nacio'],k:'cp-nacio',fuente:'Guía (Aprende): La biografía · Actividad «Ponlo en orden» 4',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (descriptivos: biografía) · DCNB p. 177 (estructura narrativa de las biografías) · que la biografía sigue el orden de una vida es redacción nuestra'},
  {q:'Una biografía de Dionisio de Herrera da dos años: 1781, el de su nacimiento, y 1824, cuando llegó a ser el primer jefe de Estado de Honduras. Entre uno y otro pasaron ___ años.',a:'43',acc:['43','cuarenta y tres'],k:'cp-herrera',fuente:'Guía (Aprende): La biografía · Ficha, página 4 (6. La biografía)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (descriptivos: biografía) · los dos años, de js/data/proceres-honduras.js · cruce con Matemáticas: la línea de tiempo de una biografía'},
  {q:'El narrador que cuenta desde fuera solo lo que se ve y se oye, como una cámara, sin decir lo que nadie piensa, se llama narrador ___.',a:'objetivo',acc:['objetivo','observador'],k:'cp-objetivo',fuente:'Guía (Aprende): ¿Quién narra? El punto de vista · Actividad Laboratorio: la cámara del narrador',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (narrador objetivo, 3.° persona) · la definición es redacción nuestra · también se acepta «observador», que es como lo llaman algunos libros (decisión de Josué, revisión del PR 63)'},
  {q:'En la tradición oral de Honduras se habla de un perro que se aparece de noche en los caminos: dicen que el blanco acompaña al caminante y que el negro lo asusta. Se llama el ___.',a:'Cadejo',acc:['Cadejo','cadejo','el Cadejo'],k:'cp-cadejo',fuente:'Guía (Aprende): La tradición oral · Guía (Aprende): Un cuento completo: el arriero y los dos perros',grado:'7.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 23 (el cuento de tradición oral) y p. 15 (el cuento en Honduras) · DCNB p. 86 (un cuento de tradición oral: leyenda o mito) · lo que se cuenta del Cadejo es tradición oral, dicha con palabras nuestras; no es cita de ningún libro'},
  {q:'En «Entonces la mula se paró en seco», la palabra que dice en qué momento pasó es ___.',a:'entonces',acc:['entonces','Entonces'],k:'cp-entonces',fuente:'Guía (Aprende): Las tres partes del cuento · Actividad Identifica 2',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (esquema estructural de la narración) · DCNB p. 119 (identifican el uso de palabras que indican tiempo)'},
  {q:'Cuéntalo con otra voz. «Mi hermano y yo corrimos hasta la casa» se convierte en «Los dos hermanos ___ hasta la casa».',a:'corrieron',acc:['corrieron'],k:'cp-corrieron',fuente:'Guía (Aprende): ¿Quién narra? El punto de vista · Actividad Clasifica: Tercera persona (narra «él» o «ella»)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (punto de vista: quien narra) · DCNB p. 179 (redactan versiones de cuentos transformando puntos de vista) · el ejemplo es inventado'},
  {q:'De quien narra sin saltar de un asunto a otro se dice que «no pierde el ___» de la historia: la misma palabra que nombra lo que se mete en el ojo de la aguja.',a:'hilo',acc:['hilo'],k:'cp-hilo',fuente:'Guía (Aprende): Escribe y cuenta tu cuento · Ficha, página 4 (7. Escribe y cuenta tu cuento)',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF p. 7 (lengua oral: la narración, el cuento de tradición oral) · DCNB pp. 103 y 139 (normas para narrar un relato: mantener concordancia o hilo de la trama)'},
  {q:'Muchos cuentos de tradición oral se despiden con una fórmula: «Y colorín colorado, este cuento se ha ___» (la palabra que falta rima con «colorado»).',a:'acabado',acc:['acabado'],k:'cp-acabado',fuente:'Guía (Aprende): Las tres partes del cuento · Actividad Reto: Cierre',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (la narración: el cuento de tradición oral) · DCNB p. 103 (textos de tradición oral) · la fórmula es de uso común en la tradición oral en español; no es cita de ningún libro'}
];
const evalPRBankNuevo=[
  {term:'La Sucia',def:'Mujer de blanco que se aparece de noche junto a una quebrada',k:'pr-sucia',fuente:'Guía (Aprende): La tradición oral · Actividad Laboratorio: la cámara del narrador',grado:'7.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 23 (el cuento de tradición oral) y p. 15 (el cuento en Honduras) · DCNB p. 86 (un cuento de tradición oral: leyenda o mito) · lo que se cuenta de la Sucia es tradición oral, dicha con palabras nuestras; no es cita de ningún libro'},
  {term:'El Sisimite',def:'Ser peludo de la montaña; dicen que tiene los pies al revés',k:'pr-sisimite',fuente:'Guía (Aprende): La tradición oral · Ficha, página 1 (1. La tradición oral y el cuento)',grado:'7.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 23 (el cuento de tradición oral) y p. 15 (el cuento en Honduras) · DCNB p. 86 (un cuento de tradición oral: leyenda o mito) · lo que se cuenta del Sisimite es tradición oral, dicha con palabras nuestras; no es cita de ningún libro y queda pendiente de verificar con una recopilación escrita · PENDIENTE (pedido por Josué al revisar el PR 63): citar aquí la definición del diccionario de la RAE; no se pudo leer desde la sesión (el sitio del diccionario rechaza las consultas automáticas) y no se escribe de memoria'},
  {term:'El lector',def:'Quien recibe un cuento leyéndolo',k:'pr-lector',fuente:'Guía (Aprende): La tradición oral · Guía (Aprende): ¿Quién narra? El punto de vista',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (lectura: textos narrativos, el cuento en Honduras) · DCNB p. 140 (estrategias de comprensión lectora de cuentos) · la definición es redacción nuestra'},
  {term:'El tema',def:'El asunto del que trata un cuento',k:'pr-tema',fuente:'Guía (Aprende): Un cuento completo: el arriero y los dos perros · Ficha, página 2 (2. Las tres partes del cuento)',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (textos literarios: el cuento) · DCNB pp. 103 y 139 (sintetizan el argumento de los cuentos de tradición oral e identifican el tema) · la definición es redacción nuestra'},
  {term:'El título',def:'Nombre del cuento; se escribe arriba del texto',k:'pr-titulo',fuente:'Guía (Aprende): Escribe y cuenta tu cuento · Ficha, página 4 (7. Escribe y cuenta tu cuento)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (textos literarios: cuento) · DCNB p. 140 (anticipan el contenido de la obra a partir de la lectura y observación del título) · la definición es redacción nuestra'},
  {term:'La línea de tiempo',def:'Raya con fechas que ordena los hechos de una vida',k:'pr-linea-tiempo',fuente:'Guía (Aprende): La biografía · Ficha, página 4 (6. La biografía)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (descriptivos: biografía) · cruce con Matemáticas y Ciencias Sociales: la línea de tiempo de una biografía · la definición es redacción nuestra'},
  {term:'«Había una vez»',def:'Fórmula para empezar un cuento',k:'pr-habia-una-vez',fuente:'Guía (Aprende): Las tres partes del cuento · Actividad Reto: Inicio',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (la narración: el cuento de tradición oral) · DCNB p. 103 (textos de tradición oral) · la fórmula es de uso común; no es cita de ningún libro'},
  {term:'Revisar',def:'Leer lo escrito para corregirlo',k:'pr-revision',fuente:'Guía (Aprende): Escribe y cuenta tu cuento · Actividad «Ponlo en orden» 3',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (producción de textos: borrador, revisión y versión final; texto literario: el cuento) · DCNB p. 105 (revisión y mejora del cuento producido) · la definición («Revisar: leer lo escrito para corregirlo») es redacción nuestra'},
  {term:'El diálogo',def:'Lo que los personajes se dicen unos a otros',k:'pr-dialogo',fuente:'Guía (Aprende): Los personajes y el ambiente · Ficha, página 2 (3. Los personajes y el ambiente)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (textos narrativos) · DCNB pp. 105, 141 y 179 (recursos estilísticos de la narración: la descripción, el diálogo) · la definición es redacción nuestra'},
  {term:'El oyente',def:'Quien recibe un cuento escuchándolo',k:'pr-oyente',fuente:'Guía (Aprende): La tradición oral · Ficha, página 1 (1. La tradición oral y el cuento)',grado:'7.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 7 y 23 (lengua oral: el cuento de tradición oral) · DCNB p. 86 (escuchan y narran en equipo un cuento de tradición oral) · la definición es redacción nuestra'}
];

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
// Los casos son de verdad de aula: dos alumnos que discuten cuál versión
// de un cuento es «la buena», un cuento que cambia de narrador, una
// biografía con hechos inventados. Todas las situaciones son inventadas.
// La pauta del caso es la misma para los dos casos del banco: por eso
// tienen la misma forma (un mismo cuento de tradición oral contado de dos
// maneras y un tropiezo por creer que una de las dos tiene que estar mal).
const critTextos={
  caso:'Caso de análisis: un cuento, dos versiones',
  decision:'Toma de decisiones: ¿quién va a narrar?',
  decisionPregunta:'¿Qué narrador elegirías tú? Explica qué puede contar ese narrador y qué no puede contar.',
  decisionPreguntaHoja:'¿Qué narrador elegirías tú? Di qué puede contar y qué no.',
  comparacionPregunta:'1. ¿Quién narra en cada texto? 2. ¿Qué sabe cada narrador y qué no sabe? 3. ¿En qué palabras se nota la diferencia?'
};
const critCaseBank=[
  {k:'ca-sisimite',txt:'En el recreo, Nahomy contó el cuento del Sisimite como se lo cuenta su abuelo: el Sisimite vive en una cueva. Elmer la interrumpió: «Así no es. Mi tía dice que vive en lo alto de un árbol». Discutieron hasta que sonó el timbre, cada uno seguro de que el otro mentía.'},
  {k:'ca-antologia',txt:'Para el libro de cuentos del grado, Wilmer escribió el cuento del Cadejo que cuenta su papá, con un perro blanco que cuida al caminante. Suyapa escribió el que oyó de su vecina, con un perro negro que lo asusta. El equipo quiso botar uno de los dos, «porque uno tiene que estar malo».'},
];
const critCaseQuestions=[
  '1. ¿Qué cuento se contó de dos maneras y en qué se diferencian?',
  '2. ¿Por qué existen dos maneras de contar el mismo cuento?',
  '3. ¿Qué problema hubo por no saberlo?',
  '4. ¿Qué les propondrías hacer a los dos compañeros?',
];
const critCaseGuides=[
  'Es un mismo cuento de tradición oral contado en dos versiones: cambia un detalle (dónde vive, de qué color es, qué hace), pero el personaje y la historia se reconocen.',
  'Porque el cuento de tradición oral no tiene un texto fijo: pasa de boca en boca y cada persona lo cuenta con sus palabras y con los detalles que recuerda. Ninguno de los dos miente.',
  'Pelearon o estuvieron a punto de botar un cuento, creyendo que solo una versión podía ser la verdadera.',
  'Respuesta abierta: escuchar las dos versiones con respeto y anotar las dos, diciendo quién contó cada una y de quién la aprendió.',
];
const critErrorBank=[
  {k:'er-partes',txt:'"El cuento empieza por el cierre, que es donde se presenta a los personajes. Y el narrador es siempre el autor del libro".',
   g1:'es al revés: los personajes se presentan en el inicio; en el cierre se resuelve el problema.',
   g2:'el narrador es la voz que cuenta la historia: puede ser un personaje o alguien de fuera. El autor es la persona que escribió el cuento.'},
  {k:'er-biografia',txt:'"Una biografía es un cuento inventado sobre alguien famoso, y la escribe siempre la misma persona de la que habla".',
   g1:'la biografía cuenta hechos reales de la vida de una persona, averiguados y no inventados; y esa persona no tiene que ser famosa.',
   g2:'la escribe otra persona. Cuando alguien escribe su propia vida, el texto se llama autobiografía.'},
];
const critDecisionBank=[
  'Vas a escribir un cuento sobre la noche en que se perdió la perra de tu hermana. Dudas entre contarlo tú, como el hermano que lo vio todo, o con un narrador de fuera que sepa lo que sentían tu hermana y la perra.',
  'Vas a contar ante el grado la inundación que vivió tu abuelo cuando era joven. Puedes contarla con «yo», como si fueras él, o con «él», mirándolo desde fuera.',
];
const critDecisionGuide='No hay una sola respuesta buena: se valora que la elección tenga razones. Quien narra con «yo» hace sentir la historia de cerca, pero solo puede contar lo que ese personaje vio, pensó y sintió. Quien narra desde fuera, con «él» o «ella», puede contar lo que pasa en varios lugares y, si es un narrador que lo sabe todo, lo que siente cada personaje. Se espera que el alumno diga qué gana y qué pierde con el narrador que escogió, y que no lo cambie a medio cuento.';
const critCompareBank=[
  {k:'co-pinos',a:'«Yo sentí que las piernas no me obedecían cuando vi aquellos ojos entre los pinos».',b:'«El arriero se detuvo. Entre los pinos brillaban dos ojos. El hombre no se movió».',
   ga:'narra el protagonista, en primera persona: sabe lo que él mismo vio y sintió, y nada más.',
   gb:'narra alguien de fuera, en tercera persona, que solo cuenta lo que se ve: no dice si el hombre tenía miedo.',
   gr:'El suceso es el mismo. Se nota en «yo sentí» y «me obedecían», frente a «el arriero» y «el hombre».'},
  {k:'co-rio',a:'«Yo temblaba, pero no solté la mano de mi hermano».',b:'«Chela temblaba, pero no soltó la mano de su hermano; su papá, adelante, contaba los pasos para no pensar en la casa que dejaban».',
   ga:'narra la protagonista, en primera persona: solo puede contar lo que ella sintió e hizo.',
   gb:'narra alguien de fuera que lo sabe todo, en tercera persona: cuenta lo que siente Chela y también lo que piensa su papá.',
   gr:'El suceso es el mismo. Se nota en «yo temblaba» y «mi hermano», frente a «Chela temblaba» y «para no pensar», que es algo que solo sabe quien conoce el pensamiento del papá.'},
];
const critCauseBank=[
  {k:'cau-sin-inicio',cause:'Un alumno empieza su cuento directamente con la persecución, sin decir quién es el personaje ni dónde está.',guide:'El lector se pierde: no sabe a quién le pasa ni dónde, porque al cuento le falta el inicio.'},
  {k:'cau-nadie-cuenta',cause:'En una comunidad, los abuelos dejan de contar sus cuentos y nadie los escribe.',guide:'Los cuentos se olvidan, y con ellos se pierde parte de lo que esa comunidad sabía, creía y contaba.'},
  {k:'cau-mezcla-narrador',cause:'Una alumna escribe media página con «yo» y la otra media con «ella», hablando del mismo personaje.',guide:'El lector se confunde: no sabe quién cuenta, porque el cuento cambió de narrador a medio camino.'},
  {k:'cau-solo-fuera',cause:'Un alumno describe a su personaje solo por fuera: alto, moreno, de camisa azul.',guide:'El lector lo puede imaginar, pero no sabe cómo es por dentro ni por qué hace lo que hace.'},
  {k:'cau-biografia-inventa',cause:'Para que quede más emocionante, alguien le agrega a una biografía hazañas que nunca pasaron.',guide:'El texto deja de ser una biografía, porque ya no cuenta hechos reales; quien lo lea aprenderá cosas falsas de esa persona.'},
];
const critEffectBank=[
  {k:'ef-atencion',effect:'Todo el grado escuchó en silencio, sin moverse, el cuento que narró Keyla.',guide:'Mantuvo el hilo de la historia, cambió la voz según el personaje e hizo pausas en los momentos de suspenso.'},
  {k:'ef-abuela',effect:'Los nietos de doña Chela saben qué hacer cuando el río suena distinto.',guide:'Ella les ha contado muchas veces aquella noche del río: lo que le pasa a una familia llega de una generación a otra cuando se cuenta.'},
  {k:'ef-versiones',effect:'El libro de cuentos del grado trae tres cuentos distintos de la Sucia.',guide:'Es un cuento de tradición oral: cada familia lo cuenta a su manera, y el grado respetó las tres versiones.'},
  {k:'ef-miedo',effect:'Al leer el cuento, los lectores sintieron el mismo miedo que el muchacho.',guide:'Lo narra el propio personaje, con «yo»: cuenta de cerca lo que vio y lo que sintió.'},
  {k:'ef-claro',effect:'El cuento de Óscar se entendió a la primera, de principio a fin.',guide:'Tenía sus tres partes y en su orden: primero dice quién y dónde, después llega el problema y al final se resuelve.'},
  {k:'ef-biografia-confiable',effect:'La maestra aceptó como fuente la biografía que escribió Dania sobre su abuelo.',guide:'Dania averiguó los hechos preguntándole a él y a la familia, los ordenó en el tiempo y anotó fechas y lugares.'},
  {k:'ef-lejos',effect:'Una niña que vive en otro país conoce las mulas, los arrieros y los caminos de Honduras sin haber venido nunca.',guide:'Leyó cuentos de aquí: la lectura le transmitió parte de la cultura de este pueblo.'},
];

// ===================== LABORATORIO =====================
// «La cámara del narrador». Dos paneles.
//
// PANEL 1, la cámara. Un mismo suceso contado por los cuatro narradores
// que nombra el DCNB (p. 179). El alumno elige una escena y quién narra, y
// el laboratorio le muestra el texto, lo que ese narrador sabe, lo que no
// sabe y en qué palabras se nota. Las dos escenas son nuestras: la de la
// quebrada es una versión propia del cuento de la Sucia; la del río es un
// relato inventado, con los datos del Mitch de la misión de los desastres
// naturales.
//
// PANEL 2, el esqueleto de tu cuento. El alumno elige un personaje, un
// ambiente, un problema y quién narra, y el laboratorio le arma el plan en
// tres partes y la oración con que puede empezar. El cierre no se lo da:
// lo decide él. `yo` y `el` son esa oración según quién narre.
const camaraNarrador={
  narradores:{
    protagonista:{nombre:'El protagonista',persona:'1.ª persona: «yo»'},
    testigo:{nombre:'Un testigo',persona:'1.ª persona: «yo vi»'},
    objetivo:{nombre:'Narrador objetivo',persona:'3.ª persona: solo lo que se ve'},
    omnisciente:{nombre:'Narrador omnisciente',persona:'3.ª persona: lo sabe todo'}
  },
  escenas:[
    {id:'quebrada',titulo:'🌙 La mujer de la quebrada',suceso:'Toño vuelve de una fiesta a medianoche. Su primo Lito viene unos pasos atrás. Junto a la quebrada, Toño ve a una mujer de blanco.',
     voces:{
       protagonista:{txt:'Yo venía de la fiesta, silbando para no sentir miedo. Junto a la quebrada vi a una mujer de blanco, de espaldas, y pensé que era una vecina. Cuando se volvió, sentí que el corazón se me salía del pecho. No sé cómo llegué a mi casa.',
         sabe:'Lo que él mismo vio, pensó y sintió.',noSabe:'Quién era la mujer, ni lo que vio o pensó su primo.',pista:'«yo venía», «pensé», «sentí».'},
       testigo:{txt:'Yo venía unos pasos atrás de mi primo Toño. Lo vi pararse junto a la quebrada y hablarle a alguien. Yo no vi a nadie. De repente pegó un grito y pasó corriendo a mi lado, blanco como un papel.',
         sabe:'Lo que vio y oyó desde donde estaba.',noSabe:'Lo que Toño vio de cerca, ni lo que sintió.',pista:'«yo venía atrás», «lo vi», «yo no vi a nadie».'},
       objetivo:{txt:'Un muchacho bajó por el camino de la quebrada a medianoche. Se detuvo junto al agua y dijo unas palabras. Después gritó, dio media vuelta y corrió hacia el pueblo. Otro muchacho lo siguió.',
         sabe:'Lo que se puede ver y oír desde fuera, como una cámara.',noSabe:'No dice lo que nadie piensa ni siente. Aquí ni siquiera da los nombres, aunque podría darlos.',pista:'«un muchacho», «se detuvo», «gritó»: solo acciones.'},
       omnisciente:{txt:'Toño bajaba silbando, aunque por dentro iba muerto de miedo. Creyó que la mujer de blanco era una vecina y quiso saludarla. Ella, que llevaba muchos años esperando en esa quebrada, sonrió antes de volverse. Atrás, Lito pensaba que su primo hablaba solo.',
         sabe:'Todo: lo que siente Toño, lo que piensa Lito y hasta lo que hacía la mujer antes de que llegaran.',noSabe:'Nada se le escapa. Por eso el lector sabe más que los personajes.',pista:'«por dentro iba», «creyó», «pensaba».'}
     }},
    {id:'rio',titulo:'🌧️ La noche que subió el río',suceso:'En 1998, con las lluvias del huracán Mitch, el río crece de noche. La familia de Chela sale de su casa. El vecino, don Lencho, los ve desde su corredor.',
     voces:{
       protagonista:{txt:'Yo estaba dormida cuando mi papá me sacudió el hombro. «Levántese, que el río viene», me dijo. Agarré a mi hermanito de la mano y salimos. Tenía tanto miedo que no sentía la lluvia.',
         sabe:'Lo que ella vivió, oyó y sintió esa noche.',noSabe:'Lo que pensaba su papá, ni lo que pasaba en las otras casas.',pista:'«yo estaba», «me dijo», «tenía tanto miedo».'},
       testigo:{txt:'Desde mi corredor vi salir a la familia de Chela con un candil. El papá iba adelante y la muchacha llevaba de la mano al niño. Les grité que subieran a la escuela. No sé si me oyeron, con aquel ruido.',
         sabe:'Lo que vio y lo que hizo desde su corredor.',noSabe:'Lo que sentían ellos, ni si lo oyeron.',pista:'«desde mi corredor vi», «no sé si me oyeron».'},
       objetivo:{txt:'A medianoche, una familia salió de la última casa de la calle. Llevaban un candil. Subieron hacia la escuela bajo la lluvia. Una hora después, el agua cubría el patio de la casa.',
         sabe:'Lo que se puede ver desde fuera: quién sale, hacia dónde va, qué pasa con la casa.',noSabe:'No dice lo que nadie piensa ni siente.',pista:'«una familia salió», «subieron», «el agua cubría».'},
       omnisciente:{txt:'Chela iba temblando, pero no soltó la mano de su hermano. Su papá, adelante, contaba los pasos para no pensar en la casa que dejaban. En el corredor de enfrente, don Lencho temía por ellos, sin saber que el río ya había entrado en su propia cocina.',
         sabe:'Todo: lo que sienten Chela y su papá, lo que teme don Lencho y lo que él todavía no sabe.',noSabe:'Nada se le escapa: está en todas partes a la vez.',pista:'«para no pensar», «temía», «sin saber que».'}
     }}
  ],
  esqueleto:{
    personajes:[
      {id:'nina',txt:'una niña que no le teme a nada',yo:'Yo era una niña que no le temía a nada',el:'Había una vez una niña que no le temía a nada'},
      {id:'arriero',txt:'un arriero viejo y callado',yo:'Yo era un arriero viejo y callado',el:'Había una vez un arriero viejo y callado'},
      {id:'maestra',txt:'una maestra recién llegada a la aldea',yo:'Yo era una maestra recién llegada a la aldea',el:'Había una vez una maestra recién llegada a la aldea'},
      {id:'perro',txt:'un perro flaco que nadie quería',yo:'Yo era un perro flaco que nadie quería',el:'Había una vez un perro flaco que nadie quería'}
    ],
    ambientes:[
      {id:'aldea',txt:'en una aldea de la montaña, una noche sin luna'},
      {id:'rio',txt:'junto al río, en plena temporada de lluvias'},
      {id:'escuela',txt:'en la escuela, el día de la feria'},
      {id:'camino',txt:'en el camino viejo, al caer la tarde'}
    ],
    problemas:[
      {id:'ruido',txt:'Se oye un ruido extraño que nadie se atreve a averiguar'},
      {id:'perdido',txt:'Alguien muy querido no regresa a la hora de siempre'},
      {id:'puente',txt:'El único puente amanece roto y hay que cruzar'},
      {id:'secreto',txt:'Descubre un secreto que no sabe si debe contar'}
    ],
    narradores:[
      {id:'yo',txt:'El propio personaje («yo»)'},
      {id:'el',txt:'Alguien de fuera («él» o «ella»)'}
    ]
  }
};
