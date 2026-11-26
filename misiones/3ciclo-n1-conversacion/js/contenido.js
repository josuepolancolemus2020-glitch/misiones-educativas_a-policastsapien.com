/* ============================================================
   M.E.T.A.S · Misión Conversar en lengua estándar · CONTENIDO
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
       PDF, 8.º en la p. 15 y 9.º en la p. 23. De ahí salen los temas: la
       conversación en lengua estándar, lo verbal y lo no verbal; la
       entonación, el énfasis y las pausas (8.º); las fórmulas sociales
       de intercambio (9.º); charlas, trabajo de equipo, diálogos y
       asambleas escolares; el lenguaje científico-técnico, el popular,
       el regional, el familiar y el culto; y el estándar del lenguaje
       libre de discriminación.
     · DCNB = `_dev/dcnb-pdf/dcneb-basica-iii-ciclo.pdf` (página del
       visor). pp. 84, 116 y 157: las fórmulas sociales (saludar,
       despedirse, dar las gracias, respetar el uso de la palabra) y los
       indicadores de la intención (entonación, énfasis, expresiones
       particulares, fórmulas de cortesía, gestos y expresiones del
       rostro); el circuito del habla (hablante, oyente, mensaje, código
       y contexto); la charla y la conferencia como comunicación de una
       sola dirección. p. 85: la asamblea («reúne a personas vinculadas
       por un propósito común, para llegar… a conclusiones determinadas
       en torno a un problema»), sus responsables (coordinador,
       organizadores y comité de planeamiento), los temas, fechas y
       responsables, y los materiales de apoyo (tarjetas, láminas,
       afiches, carteles). pp. 86, 118 y 160: los niveles de uso de la
       lengua (formas orales: popular, familiar, vulgar, regionalismos y,
       en 9.º, modismos y jergas; formas escritas: culto,
       científico-técnico y literario; formas mixtas: publicitario y
       periodístico), las cualidades de quien habla (claridad, concisión,
       coherencia, sencillez y naturalidad) y el respeto a las formas de
       hablar de la comunidad. p. 149: las lenguas de la comunidad
       nacional (chortí, tol, tawaka, miskito, pech, garífuna e inglés
       criollo).
     · Para Media: `_dev/dcnb/programa-espanol-10.md`, CE1.2 (los seis
       elementos de la comunicación y los nombres de las seis funciones
       del lenguaje), y `_dev/dcnb/programa-espanol-11-bch.md` (los
       estereotipos discriminatorios).

   ► LOS CRUCES CON OTRAS MATERIAS, y de dónde sale su dato:
     · Ciencias Naturales: «ecosistema», «productores» y «fotosíntesis»,
       de la misión Los Ecosistemas (misiones/2y3ciclo-ecosistemas/).
     · Matemáticas: «dividendo», «cociente» y «residuo», de la misión
       División de decimales (misiones/2y3ciclo-division-decimales/).
     · Ciencias Sociales: los nombres de las lenguas, del DCNB p. 149.
     · Cívica: el artículo 162 de la Constitución, con las palabras que
       cita `js/data/constitucion-honduras.js` (el único texto acreditado).

   ► LO QUE SE SUAVIZÓ O SE DEJÓ FUERA POR NO TENER FUENTE EN `_dev/`:
     · El DCNB nombra los niveles de la lengua y manda que el alumno
       «construya sus propios conceptos»: no los define. Aquí cada nivel
       se explica solo por lo que dice su nombre y con ejemplos, y el
       examen pregunta la clasificación que sí trae el DCNB (oral,
       escrita o mixta) y casos de aplicar, no definiciones de diccionario.
     · «Lengua estándar» tampoco tiene definición en `_dev/`. Se describe
       como «la forma de hablar que se entiende en todo el país y que se
       usa en la escuela, en un trámite o ante un grupo». Es una
       descripción de trabajo, no una cita.
     · Modismos y jergas (9.º) solo se nombran: no se definen ni se
       preguntan. Dónde se habla cada lengua de Honduras y cuántas
       personas la hablan, tampoco: solo van sus nombres.
     · Las funciones del lenguaje (Media) van con su nombre y nada más:
       sus definiciones están pendientes de una fuente. El examen no
       pregunta nada que sea solo de Media, porque una forma le puede
       tocar a un alumno de 7.º.
     · Qué hace el coordinador de una asamblea no lo describe el DCNB: lo
       nombra. Aquí «coordina y da la palabra», que es lo que dice su
       nombre; el examen solo pregunta la lista de responsables.
     · Las frases de habla popular, familiar o regional («pisto»,
       «cipote», «chunche», «¡qué onda!»…) son EJEMPLOS escritos para la
       misión, no datos: no se afirma de dónde es cada palabra.
     · La oratoria (voz, respiración, dicción), el debate, el panel, la
       mesa redonda y el foro son de abril: no entran.

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
  titulo:'Conversar en lengua estándar',
  emoji:'🗣️',
  materia:'Español',
  confeti:['#0f766e','#4ba89f','#d97706','#f59e0b','#fde68a'],
  impresion:{acento:'#c49000',fondo:'#fef9e7'},
  rutaEtiqueta:'Secuencia',
  widgetIdentifica:{paso:'Pista',fin:'🎉 ¡Todas las pistas resueltas!'},
  tareaIdentifica:['Copia cada oración en tu cuaderno y subraya la fórmula social, la señal no verbal o la palabra que se indica. Escribe al lado qué es.','<strong>Ejemplo:</strong> Marta dijo «con permiso» antes de pasar. → <span style="color:var(--jade);font-weight:700;">Fórmula de cortesía</span>'],
  tareaClasifica:{instruccion:'Copia la siguiente tabla en tu cuaderno. Para cada frase, escribe su nivel, si es más propia de lo oral o de lo escrito, con quién la usarías y cómo la dirías en lengua estándar.',columnas:['Frase','Nivel','¿Oral o escrita?','¿Con quién la usarías?','En lengua estándar']},
  diploma:['¡Sigue conversando y aprendiendo!','¡Muy buen trabajo!','¡Hablas y escuchas con respeto!','¡Ya eliges cómo hablar según la situación!','¡Maestro de la palabra!']
};

// ===================== IDENTIDAD Y GUARDADO =====================
const SAVE_KEY='n1_conversacion_v1';
const MXP=200;
const TOTAL_SECTIONS=13;

// ===================== LOGROS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'🗣️',label:'Primer quiz de la conversación superado'},
  flash_master:{icon:'🃏',label:'Todas las tarjetas de la conversación exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de niveles de la lengua'},
  id_master:{icon:'🔍',label:'Cazador de señales y fórmulas sociales'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de la palabra'},
  nivel3:{icon:'👂',label:'¡Buen oyente! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Expositor! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de la conversación dominados'}
};

// ===================== NIVELES =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Conversador 💬'},{t:55,n:'Buen oyente 👂'},{t:90,n:'Vocero 📣'},{t:130,n:'Mediador 🤝'},{t:165,n:'Expositor 🎤'},{t:190,n:'Maestro de la palabra 🏆'}];

// ===================== TARJETAS =====================
const fcData=[
  {w:'Lengua estándar',a:'🗣️ La forma de hablar que <strong>se entiende en todo el país</strong> y que se usa en la escuela, en un trámite o ante un grupo. No borra tu manera de hablar en casa: se suma a ella, para cuando la situación la pide.'},
  {w:'Lenguaje verbal',a:'💬 El que comunica <strong>con palabras</strong>, habladas o escritas: una conversación, una charla, una carta, un mensaje de texto.'},
  {w:'Lenguaje no verbal',a:'🙌 El que comunica <strong>sin palabras</strong>: los gestos, las expresiones del rostro, las señales, los íconos y los símbolos. Acompaña a lo que dices y a veces dice más.'},
  {w:'Fórmulas sociales de intercambio',a:'🤝 Las frases de trato que todos esperan: <strong>saludar, despedirse, dar las gracias y respetar el uso de la palabra</strong>. Abren la puerta a que te escuchen.'},
  {w:'Entonación',a:'🎵 La voz que <strong>sube o baja</strong> al hablar. Con las mismas palabras, una frase puede sonar a pregunta, a orden, a broma o a regaño.'},
  {w:'Énfasis',a:'🔊 Decir <strong>con más fuerza</strong> la palabra que más importa. «MAÑANA es el examen» no avisa lo mismo que «mañana es el EXAMEN».'},
  {w:'Pausas',a:'⏸️ Los <strong>silencios breves</strong> entre una idea y otra. Le dan tiempo al que escucha para entender y a ti para respirar.'},
  {w:'Charla',a:'🎤 Una persona <strong>expone un tema</strong> ante un grupo. La comunicación va casi siempre en una sola dirección, igual que en una conferencia.'},
  {w:'Asamblea escolar',a:'🏫 Reúne a personas con <strong>un propósito común</strong> para llegar, exponiendo ideas de forma democrática, a <strong>conclusiones</strong> sobre un problema importante. La preparan el coordinador, los organizadores y el comité de planeamiento.'},
  {w:'Circuito del habla',a:'🔁 Lo que hace falta para que haya comunicación: <strong>hablante, oyente, mensaje, código y contexto</strong>. Si falla una pieza, el mensaje no llega bien.'},
  {w:'Niveles de uso de la lengua',a:'📶 Las distintas maneras de usar el mismo idioma. <strong>Formas orales:</strong> popular, familiar, vulgar, regionalismos. <strong>Formas escritas:</strong> culto, científico-técnico, literario. <strong>Formas mixtas:</strong> publicitario y periodístico.'},
  {w:'Lenguaje científico-técnico',a:'🔬 El de las ciencias y los oficios: usa <strong>términos exactos</strong>. «Cociente», «ecosistema» y «fotosíntesis» son palabras de este nivel.'},
  {w:'Cualidades de quien habla bien',a:'⭐ <strong>Claridad</strong>, <strong>concisión</strong> (las palabras justas), <strong>coherencia</strong> (las ideas en orden lógico), <strong>sencillez</strong> y <strong>naturalidad</strong>.'},
  {w:'Lenguaje libre de discriminación',a:'🕊️ El que <strong>no se burla ni rebaja</strong> a nadie por su origen, por ser niña o niño o por su forma de hablar. Hablar distinto no es hablar mal.'},
];

// ===================== QUIZ =====================
const qzData=[
  {q:'¿Cuál de estas es una fórmula social de intercambio?',o:['a) Bostezar fuerte','b) Dar las gracias','c) Hablar de espaldas','d) Cortar la llamada'],c:1},
  {q:'¿Qué comunica sin usar palabras?',o:['a) Una carta','b) Un poema','c) Una charla','d) Un gesto'],c:3},
  {q:'La voz que sube o baja y hace que una frase suene a pregunta o a orden es…',o:['a) la entonación','b) el código','c) el regionalismo','d) el comité'],c:0},
  {q:'¿Qué piezas forman el circuito del habla?',o:['a) Tema, fecha y lugar','b) Saludo, cuerpo y despedida','c) Hablante, oyente, mensaje, código y contexto','d) Popular, familiar y culto'],c:2},
  {q:'«Los productores fabrican su alimento por fotosíntesis» está dicho en lenguaje…',o:['a) científico-técnico','b) familiar','c) vulgar','d) publicitario'],c:0},
  {q:'¿Para qué se reúne una asamblea?',o:['a) Para oír a un solo experto','b) Para repartir las notas','c) Para que gane quien grite más','d) Para llegar entre todos a conclusiones sobre un problema'],c:3},
  {q:'¿Con quién conviene más usar la lengua estándar?',o:['a) Con tu hermano menor, jugando','b) Con tu mejor amigo, en el recreo','c) Con la directora, al pedir una constancia','d) Con tu mascota'],c:2},
  {q:'¿Cuáles de estos niveles son formas orales de la lengua?',o:['a) Culto y literario','b) Popular y familiar','c) Científico-técnico y culto','d) Literario y periodístico'],c:1},
  {q:'Un compañero pronuncia distinto porque viene de otra zona. ¿Qué es lo correcto?',o:['a) Imitarlo para que el grupo se ría','b) Corregirlo delante de todos','c) Respetar su forma de hablar','d) Dejar de hablarle'],c:2},
];

// ===================== CLASIFICA =====================
const classGroups=[
  {label:['Verbal','No verbal'],headA:'💬 Lenguaje verbal',headB:'🙌 Lenguaje no verbal',colA:'ver',colB:'nov',
   words:[{w:'Una carta',t:'ver'},{w:'Un saludo de mano',t:'nov'},{w:'Un aviso por radio',t:'ver'},{w:'Una sonrisa',t:'nov'},{w:'Un mensaje de texto',t:'ver'},{w:'Un semáforo',t:'nov'},{w:'Una charla',t:'ver'},{w:'Encogerse de hombros',t:'nov'},{w:'Una conversación',t:'ver'},{w:'El ceño fruncido',t:'nov'}]},
  {label:['De todos los días','Científico-técnico'],headA:'🏠 Popular o familiar',headB:'🔬 Científico-técnico',colA:'pop',colB:'tec',
   words:[{w:'«Se fue la luz»',t:'pop'},{w:'«Se interrumpió el servicio eléctrico»',t:'tec'},{w:'«Lo que le toca a cada uno»',t:'pop'},{w:'«El cociente»',t:'tec'},{w:'«Lo que sobra»',t:'pop'},{w:'«El residuo»',t:'tec'},{w:'«El monte con sus animales»',t:'pop'},{w:'«El ecosistema»',t:'tec'},{w:'«Las plantas hacen su comida con el sol»',t:'pop'},{w:'«Los productores realizan la fotosíntesis»',t:'tec'}]},
  {label:['Fórmula social','No lo es'],headA:'🤝 Es una fórmula social',headB:'🚫 No lo es',colA:'si',colB:'no',
   words:[{w:'«Buenos días»',t:'si'},{w:'«Quítese»',t:'no'},{w:'«Muchas gracias»',t:'si'},{w:'«¡Apúrese!»',t:'no'},{w:'«Con permiso»',t:'si'},{w:'«¿Y a usted qué?»',t:'no'},{w:'«Hasta luego»',t:'si'},{w:'«Deme eso»',t:'no'},{w:'«Disculpe»',t:'si'},{w:'«Ya cállese»',t:'no'}]},
  {label:['Con un amigo','Con el director'],headA:'🧢 Se lo dirías a un amigo',headB:'🏫 Se lo dirías al director',colA:'ami',colB:'dir',
   words:[{w:'«¡Qué onda!»',t:'ami'},{w:'«Buenos días, director»',t:'dir'},{w:'«Pasame la pelota»',t:'ami'},{w:'«¿Sería tan amable de recibirme?»',t:'dir'},{w:'«Va, pues, nos vemos»',t:'ami'},{w:'«Le agradezco su tiempo»',t:'dir'},{w:'«¿Jugamos en el recreo?»',t:'ami'},{w:'«Solicito una constancia de estudios»',t:'dir'},{w:'«¡Qué cheque te quedó!»',t:'ami'},{w:'«Con su permiso, me retiro»',t:'dir'}]},
];

// ===================== IDENTIFICA =====================
const idData=[
  {s:['Marta','saluda','con','una','sonrisa','al','entrar.'],c:4,busca:'la señal no verbal'},
  {s:['El','abuelo','frunce','el','ceño','cuando','hay','ruido.'],c:4,busca:'la expresión del rostro'},
  {s:['Kevin','levanta','el','pulgar','para','decir','que','sí.'],c:3,busca:'el gesto'},
  {s:['Dania','dijo','gracias','al','recibir','el','cuaderno.'],c:2,busca:'la fórmula social'},
  {s:['El','semáforo','en','rojo','nos','manda','parar.'],c:1,busca:'la señal que comunica sin palabras'},
  {s:['La','maestra','hizo','una','pausa','antes','del','aviso.'],c:4,busca:'lo que separa dos ideas al hablar'},
  {s:['Óscar','pidió','permiso','antes','de','pasar.'],c:2,busca:'la fórmula de cortesía'},
  {s:['El','coordinador','le','dio','la','palabra','a','Josué.'],c:1,busca:'quien coordina la asamblea'},
];

// ===================== COMPLETA =====================
const cmpData=[
  {s:'Al llegar al aula: «___, profesora. ¿Puedo pasar?»',opts:['Buenos días','Hasta luego','De nada'],c:0},
  {s:'Al recibir un favor: «Muchas ___ por ayudarme».',opts:['prisas','veces','gracias'],c:2},
  {s:'Para pedir algo prestado: «¿Me presta su regla, por ___?»',opts:['fin','favor','gusto'],c:1},
  {s:'Al irte de la casa de tu tía: «___, tía. Que pase buena tarde».',opts:['Buenos días','Hasta luego','Bienvenida'],c:1},
  {s:'Si pisas a alguien sin querer: «___, no lo vi».',opts:['Perdone','Felicidades','Salud'],c:0},
  {s:'Para pasar entre dos personas que conversan: «Con ___».',opts:['gusto','cuidado','permiso'],c:2},
  {s:'Cuando te dan las gracias, respondes: «De ___».',opts:['prisa','lejos','nada'],c:2},
  {s:'Para preguntar con respeto a una persona mayor: «¿___ decirme la hora, por favor?»',opts:['Tenés que','Me podría','Vas a'],c:1},
];

// ===================== WIDGETS =====================
// Widget 1: ordenar los pasos
const ordenaData=[
  {label:'Una conversación con cortesía',steps:['Saludas al llegar','Dices para qué vienes','Escuchas la respuesta sin interrumpir','Das las gracias','Te despides']},
  {label:'Preparar una charla',steps:['Eliges el tema','Fijas la fecha y los responsables','Preparas los materiales de apoyo','Das la charla ante el grupo','Respondes las preguntas del público']},
  {label:'Una asamblea escolar',steps:['El coordinador presenta el problema','Quien quiere hablar pide la palabra','Cada participante da su opinión con razones','El grupo negocia y busca un acuerdo','Se anotan las conclusiones']},
];
// Widget 2: de la descripción al nombre
const describeData=[
  {desc:'Una persona expone un tema y las demás escuchan',ans:'Charla',opts:['Charla','Diálogo','Asamblea escolar','Trabajo de equipo']},
  {desc:'Dos o más personas se alternan para hablar y responderse',ans:'Diálogo',opts:['Charla','Diálogo','Asamblea escolar','Trabajo de equipo']},
  {desc:'Personas con un propósito común se reúnen para llegar a conclusiones sobre un problema',ans:'Asamblea escolar',opts:['Charla','Diálogo','Asamblea escolar','Trabajo de equipo']},
  {desc:'Varios compañeros se reparten las tareas para lograr una misma meta',ans:'Trabajo de equipo',opts:['Charla','Diálogo','Asamblea escolar','Trabajo de equipo']},
  {desc:'La voz sube o baja, y con eso la frase suena a pregunta, a orden o a broma',ans:'Entonación',opts:['Entonación','Énfasis','Pausa','Gesto']},
  {desc:'Decir con más fuerza la palabra que más importa',ans:'Énfasis',opts:['Entonación','Énfasis','Pausa','Gesto']},
  {desc:'Silencio breve que separa una idea de la siguiente',ans:'Pausa',opts:['Entonación','Énfasis','Pausa','Gesto']},
  {desc:'Movimiento de las manos o de la cabeza que comunica algo',ans:'Gesto',opts:['Entonación','Énfasis','Pausa','Gesto']},
];
// Widget 3: del término técnico a cómo se dice todos los días
const emparejaData=[
  {term:'Cociente',resp:'Lo que le toca a cada uno',opts:['Lo que le toca a cada uno','Lo que se va a repartir','El que reparte','Lo que sobra']},
  {term:'Dividendo',resp:'Lo que se va a repartir',opts:['Lo que le toca a cada uno','Lo que se va a repartir','El que reparte','Lo que sobra']},
  {term:'Residuo',resp:'Lo que sobra',opts:['Lo que le toca a cada uno','Lo que se va a repartir','El que reparte','Lo que sobra']},
  {term:'Ecosistema',resp:'Un lugar con sus seres vivos y todo lo que los rodea',opts:['Un lugar con sus seres vivos y todo lo que los rodea','Solo los animales del monte','Un jardín con flores','El agua de un río']},
  {term:'Productores',resp:'Las plantas y las algas, que fabrican su propio alimento',opts:['Las plantas y las algas, que fabrican su propio alimento','Los animales que comen plantas','Los hongos que pudren la madera','Las personas que siembran']},
];
// Widget 4: «dilo en lengua estándar»
const situacionData=[
  {term:'«¡Ey, vos! ¿La dirección?»',resp:'«Disculpe, ¿me puede indicar dónde queda la dirección?»',opts:['«Disculpe, ¿me puede indicar dónde queda la dirección?»','«Oiga, la dirección, pues»','«¿Y la dirección qué?»','«La dirección, rápido»']},
  {term:'«Deme un papel de esos»',resp:'«Buenos días. ¿Me podría dar una constancia de estudios, por favor?»',opts:['«Buenos días. ¿Me podría dar una constancia de estudios, por favor?»','«El papel ese, pues»','«Quiero mi papel ya»','«¿Y mi papel?»']},
  {term:'«Profe, no vine ayer»',resp:'«Profesora, disculpe: ayer falté porque estuve enfermo»',opts:['«Profesora, disculpe: ayer falté porque estuve enfermo»','«Ayer no vine y ya»','«Es que no pude, pues»','«No vine, ¿y qué?»']},
  {term:'«Pasame eso»',resp:'«¿Me alcanza ese cuaderno, por favor?»',opts:['«¿Me alcanza ese cuaderno, por favor?»','«Eso, démelo»','«Ese, el de ahí, rápido»','«Páseme eso, pues»']},
  {term:'«¿Qué?» (no oíste lo que te dijeron)',resp:'«Perdón, ¿me lo puede repetir?»',opts:['«Perdón, ¿me lo puede repetir?»','«¿Ah?»','«Hable más fuerte»','«No le oigo nada»']},
  {term:'«Ya me voy»',resp:'«Con su permiso, me retiro. Muchas gracias»',opts:['«Con su permiso, me retiro. Muchas gracias»','«Me voy, pues»','«Ahí se quedan»','«Ya estuvo»']},
];

// ===================== RETO =====================
const retoPairs=[
  {label:['Verbal','No verbal'],btnA:'💬 Verbal',btnB:'🙌 No verbal',colA:'ver',colB:'nov',
   words:[{w:'Una carta',t:'ver'},{w:'Una sonrisa',t:'nov'},{w:'Un discurso',t:'ver'},{w:'Un abrazo',t:'nov'},{w:'Una llamada',t:'ver'},{w:'Un guiño',t:'nov'},{w:'Un chiste contado',t:'ver'},{w:'Cruzar los brazos',t:'nov'},{w:'Un poema',t:'ver'},{w:'Levantar el pulgar',t:'nov'}]},
  {label:['Forma oral','Forma escrita'],btnA:'👄 Forma oral',btnB:'✍️ Forma escrita',colA:'ora',colB:'esc',
   words:[{w:'Popular',t:'ora'},{w:'Culto',t:'esc'},{w:'Familiar',t:'ora'},{w:'Literario',t:'esc'},{w:'Vulgar',t:'ora'},{w:'Científico-técnico',t:'esc'},{w:'Regionalismos',t:'ora'},{w:'Modismos',t:'ora'},{w:'Jergas',t:'ora'}]},
  {label:['Cortés','Descortés'],btnA:'🤝 Cortés',btnB:'🚫 Descortés',colA:'cor',colB:'des',
   words:[{w:'«Por favor»',t:'cor'},{w:'«¡Quítese!»',t:'des'},{w:'«Gracias»',t:'cor'},{w:'«¿Qué le importa?»',t:'des'},{w:'«Disculpe»',t:'cor'},{w:'«Deme eso ya»',t:'des'},{w:'«Con permiso»',t:'cor'},{w:'«Cállese»',t:'des'},{w:'«Buenas tardes»',t:'cor'},{w:'«Apúrese, pues»',t:'des'}]},
];

// ===================== GENERADOR DE TAREAS =====================
const identifyTaskDB=[
  {s:'Al entrar a la pulpería, Dania dijo «buenas tardes» a don Beto.',type:'Fórmula social: saludar'},
  {s:'Óscar levantó la mano y esperó a que le dieran la palabra.',type:'Fórmula social: respetar el uso de la palabra'},
  {s:'La maestra arrugó la frente cuando oyó el ruido del pasillo.',type:'Señal no verbal: expresión del rostro'},
  {s:'Kevin dijo «¿vienes MAÑANA?» marcando fuerte la última palabra.',type:'Énfasis'},
  {s:'Antes de dar el aviso, la directora guardó silencio dos segundos.',type:'Pausa'},
  {s:'El niño movió la cabeza de lado a lado para decir que no.',type:'Señal no verbal: gesto'},
  {s:'Al recibir el vuelto, Marlon dijo «muchas gracias».',type:'Fórmula social: dar las gracias'},
  {s:'En el informe de Ciencias, Keyla escribió «los productores realizan la fotosíntesis».',type:'Lenguaje científico-técnico'},
  {s:'Al salir de la reunión, el papá dijo «con permiso, hasta luego».',type:'Fórmula social: despedirse'},
  {s:'La voz de Josué subió al final de «¿ya terminaste?».',type:'Entonación'},
];
const classifyTaskDB=[
  {w:'«¡Qué onda, vos!»',gen:'Familiar',n:'Oral',g:'Con un amigo',t:'«Hola, ¿cómo estás?»'},
  {w:'«El cociente de 15 entre 3 es 5»',gen:'Científico-técnico',n:'Escrita',g:'En la clase de Matemáticas',t:'Ya está en lengua estándar'},
  {w:'«No tengo pisto»',gen:'Popular',n:'Oral',g:'En la casa o con amigos',t:'«No tengo dinero»'},
  {w:'«Solicito una constancia de estudios»',gen:'Culto',n:'Escrita',g:'Con la directora',t:'Ya está en lengua estándar'},
  {w:'«Ese cipote es bien vivo»',gen:'Popular',n:'Oral',g:'En la casa o con vecinos',t:'«Ese niño es muy listo»'},
  {w:'«El ecosistema incluye a los seres vivos y su medio físico»',gen:'Científico-técnico',n:'Escrita',g:'En un informe de Ciencias',t:'Ya está en lengua estándar'},
  {w:'«Pasame ese chunche»',gen:'Familiar',n:'Oral',g:'Con tu hermano',t:'«¿Me alcanzas esa cosa, por favor?»'},
  {w:'«¡Llévese dos y pague uno!»',gen:'Publicitario',n:'Mixta',g:'En un anuncio',t:'«Hay una oferta: dos por el precio de uno»'},
];
const completeTaskDB=[
  {s:'El lenguaje que comunica con palabras se llama ___.',opts:['verbal','no verbal','mixto'],ans:'verbal'},
  {s:'Saludar, despedirse y dar las gracias son fórmulas ___ de intercambio.',opts:['secretas','sociales','técnicas'],ans:'sociales'},
  {s:'La voz que sube o baja al hablar es la ___.',opts:['pausa','entonación','postura'],ans:'entonación'},
  {s:'Hablante, oyente, mensaje, código y contexto forman el ___ del habla.',opts:['circuito','comité','nivel'],ans:'circuito'},
  {s:'El popular y el familiar son formas ___ de la lengua.',opts:['escritas','mixtas','orales'],ans:'orales'},
  {s:'El culto, el literario y el científico-técnico son formas ___ de la lengua.',opts:['escritas','orales','vulgares'],ans:'escritas'},
  {s:'Una asamblea se reúne para llegar a ___ sobre un problema común.',opts:['gritos','conclusiones','castigos'],ans:'conclusiones'},
  {s:'Burlarse de cómo habla otra persona es una forma de ___.',opts:['cortesía','discriminación','claridad'],ans:'discriminación'},
];
const explainQuestions=[
  {q:'Pregunta en tu casa por tres palabras o expresiones que se usen en tu comunidad y que quizá no se entiendan en otra zona. Escribe qué significan y cómo las dirías en lengua estándar.',ans:'Respuesta abierta. Se valora que anote tres expresiones reales de su casa o barrio, que explique su significado y que proponga una versión en lengua estándar, sin burlarse de ninguna.'},
  {q:'Explica con un ejemplo cómo el tono puede cambiar lo que dice una frase.',ans:'La misma frase («qué bonito te quedó») suena a felicitación con voz alegre y a burla con voz seca o risa: la entonación y los gestos cambian el mensaje aunque las palabras sean las mismas.'},
  {q:'¿Por qué no hablas igual con tu mejor amigo que con la directora? ¿Cambia tu forma de ser?',ans:'Porque cada situación pide un nivel distinto de formalidad: con el amigo sirve el lenguaje familiar y con la directora, la lengua estándar. No cambia quién eres: cambia cómo adecúas tu lenguaje a quien te escucha.'},
  {q:'Tu grado tiene que decidir a dónde ir de excursión. Describe cómo organizarías una asamblea para decidirlo.',ans:'Se nombra un coordinador, se presenta el asunto, cada quien pide la palabra y da su opinión con razones, se respetan los turnos, se negocia y se anota la conclusión a la que llega el grupo.'},
  {q:'Di lo mismo de dos maneras: explica qué es un ecosistema con palabras de la clase de Ciencias y con palabras para un niño de seis años.',ans:'Científico-técnico: «Un ecosistema es el conjunto de los seres vivos de un lugar, su medio físico y sus relaciones». Para un niño: «Es un lugar, como el bosque, con sus plantas, sus animales, el agua y la tierra, y todos se necesitan».'},
];

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['N','Z','C','B','Z','R','B','P','M','C'],
    ['G','J','H','R','S','N','V','P','E','O'],
    ['G','X','A','G','S','K','G','Y','N','D'],
    ['F','Z','R','S','E','F','X','X','S','I'],
    ['T','Y','L','P','A','S','M','F','A','G'],
    ['R','U','A','T','A','L','T','N','J','O'],
    ['M','F','R','R','R','U','U','O','E','K'],
    ['P','H','T','N','J','T','S','D','F','X'],
    ['M','J','X','L','O','V','P','A','O','N'],
    ['V','Y','M','M','Y','P','Y','B','D','Q']
  ],words:[
    {w:'SALUDO',cells:[[3,3],[4,4],[5,5],[6,6],[7,7],[8,8]]},
    {w:'GESTO',cells:[[2,3],[3,4],[4,5],[5,6],[6,7]]},
    {w:'PAUSA',cells:[[4,3],[5,4],[6,5],[7,6],[8,7]]},
    {w:'CHARLA',cells:[[0,2],[1,2],[2,2],[3,2],[4,2],[5,2]]},
    {w:'TURNO',cells:[[4,0],[5,1],[6,2],[7,3],[8,4]]},
    {w:'CODIGO',cells:[[0,9],[1,9],[2,9],[3,9],[4,9],[5,9]]},
    {w:'MENSAJE',cells:[[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8]]}
  ]},
  {size:10,grid:[
    ['Q','C','U','L','T','O','D','D','M','Q'],
    ['M','P','M','F','P','K','B','R','A','F'],
    ['Y','O','V','O','L','K','S','E','S','R'],
    ['D','P','F','N','Y','D','K','S','A','D'],
    ['S','U','M','T','M','E','B','P','M','I'],
    ['V','L','F','V','G','D','N','E','B','A'],
    ['Y','A','P','G','M','Z','P','T','L','L'],
    ['M','R','Z','B','T','H','K','O','E','O'],
    ['H','R','S','S','L','N','D','J','A','G'],
    ['R','S','J','L','M','L','D','Q','R','O']
  ],words:[
    {w:'OYENTE',cells:[[2,3],[3,4],[4,5],[5,6],[6,7],[7,8]]},
    {w:'ASAMBLEA',cells:[[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8]]},
    {w:'CULTO',cells:[[0,1],[0,2],[0,3],[0,4],[0,5]]},
    {w:'POPULAR',cells:[[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]]},
    {w:'RESPETO',cells:[[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]]},
    {w:'DIALOGO',cells:[[3,9],[4,9],[5,9],[6,9],[7,9],[8,9],[9,9]]}
  ]}
];

// ===================== EXAMEN CONCEPTUAL =====================
// UN DATO, UNA PREGUNTA. Cada forma saca cinco de cada banco y pueden caer
// juntas cualesquiera, así que ninguna pregunta pide un dato que otra ya pide
// (su `k` no se repite) y ninguna respuesta aparece escrita en otra pregunta,
// tampoco como opción equivocada. Lo comprueba
// `_dev/verifica-examen-sin-pistas.js`.
//
// ⚠️ Y ninguna la contesta la historia de Brayan y la constancia (la tarjeta
// con que abre la misión): por eso aquí nadie le pide una constancia al
// director, y la frase «¿Sería tan amable…?» no es respuesta de nada.
//
// ⚠️ El examen no pregunta nada que sea solo de Media: una forma le puede
// tocar a un alumno de 7.º. Lo de Media va en su tarjeta y en la ficha.
const evalTFBank=[
  {q:'Lo único que comunica en una conversación son las palabras.',a:false,k:'tf-solo-palabras',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (lenguaje verbal y no verbal) · DCNB p. 84'},
  {q:'Una misma frase puede sonar a broma o a regaño según el tono.',a:true,k:'tf-tono',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (entonación, énfasis y pausas) · DCNB p. 116'},
  {q:'En una conferencia, la comunicación va casi siempre en una sola dirección.',a:true,k:'tf-conferencia',grado:'7.º a 9.º',curriculo:'DCNB p. 84 (charla y conferencia: unilateralidad en la comunicación)'},
  {q:'En una asamblea escolar decide una sola persona y los demás callan.',a:false,k:'tf-asamblea-decide',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (asambleas escolares) · DCNB p. 85'},
  {q:'Respetar la forma de hablar de otra comunidad es parte de saber conversar.',a:true,k:'tf-respeto-comunidad',grado:'7.º a 9.º',curriculo:'DCNB pp. 86 y 118 (respeto hacia las formas de lengua de la comunidad)'},
  {q:'El contexto forma parte del circuito del habla.',a:true,k:'tf-contexto',grado:'7.º a 9.º',curriculo:'DCNB pp. 84, 117 y 157 (circuito del habla)'},
  {q:'Hablar con naturalidad es imitar la voz de un locutor.',a:false,k:'tf-naturalidad',grado:'7.º a 9.º',curriculo:'DCNB pp. 86, 118 y 158 (cualidades comunicativas del hablante)'},
  {q:'El lenguaje periodístico se cuenta entre las formas mixtas de la lengua.',a:true,k:'tf-periodistico',grado:'7.º a 9.º',curriculo:'DCNB pp. 86 y 118 (niveles de uso: formas mixtas)'},
  {q:'Con el director de tu centro conviene hablar igual que con tu mejor amigo en el recreo.',a:false,k:'tf-director',grado:'7.º a 9.º',curriculo:'DCNB p. 84 (adecuar el nivel de formalidad a la situación)'},
  {q:'El lenguaje culto es una forma oral, como el popular.',a:false,k:'tf-culto',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (lenguaje popular, culto) · DCNB p. 160'}
];
const evalMCBank=[
  {q:'Llegas con tu mamá a una reunión que ya empezó. ¿Qué corresponde primero?',o:['a) Sentarte sin ver a nadie','b) Pedir la merienda','c) Saludar a los presentes','d) Revisar tu teléfono'],a:2,k:'mc-llegar',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (fórmulas sociales de intercambio) · DCNB pp. 84 y 157'},
  {q:'¿Cuál de estos mensajes es no verbal?',o:['a) Un semáforo en rojo','b) Una carta','c) Un aviso por radio','d) Un cuento leído en voz alta'],a:0,k:'mc-no-verbal',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 · DCNB pp. 84 y 157 (íconos, señales, símbolos)'},
  {q:'Buscas la biblioteca y solo hay una señora que no conoces. ¿Cómo se lo preguntas en lengua estándar?',o:['a) «¡Ey! ¿La biblioteca?»','b) «Disculpe, ¿me puede indicar dónde queda la biblioteca?»','c) «Oiga, la biblioteca, pues»','d) «¿Y la biblioteca qué?»'],a:1,k:'mc-biblioteca',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (la conversación en lengua estándar) · DCNB p. 84'},
  {q:'¿Cuál de estos es un material de apoyo para una charla?',o:['a) Un afiche con dibujos','b) Un bostezo','c) Un chisme','d) Un regaño'],a:0,k:'mc-material',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (charlas) · DCNB p. 85 (materiales de apoyo gráficos)'},
  {q:'«Los productores fabrican su alimento por fotosíntesis». Esta oración usa el lenguaje…',o:['a) vulgar','b) periodístico','c) científico-técnico','d) publicitario'],a:2,k:'mc-tecnico',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (lenguaje científico-técnico) · la oración, de la misión Los Ecosistemas'},
  {q:'Explicar algo difícil con palabras fáciles es hablar con…',o:['a) enojo','b) prisa','c) timidez','d) sencillez'],a:3,k:'mc-sencillez',grado:'7.º a 9.º',curriculo:'DCNB pp. 86, 118 y 158 (cualidades comunicativas del hablante)'},
  {q:'En clase de Matemáticas dices «cociente». ¿Cómo lo dirías en lenguaje popular?',o:['a) «Lo que se reparte»','b) «El que reparte»','c) «Lo que le toca a cada uno»','d) «Lo que sobra»'],a:2,k:'mc-cociente',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (lenguaje científico-técnico y popular) · el término, de la misión División de decimales'},
  {q:'Además del español, Honduras tiene otras lenguas propias. ¿Cuál de estas es una de ellas?',o:['a) El japonés','b) El pech','c) El ruso','d) El latín'],a:1,k:'mc-pech',grado:'8.º',curriculo:'DCNB p. 149 (códigos lingüísticos de la comunidad nacional)'},
  {q:'Tu compañera expone y no entendiste una parte. ¿Qué es lo correcto?',o:['a) Reírte','b) Interrumpirla a gritos','c) Hablar con el de al lado','d) Esperar a que termine y preguntar'],a:3,k:'mc-esperar',grado:'7.º a 9.º',curriculo:'DCNB pp. 84 y 85 (uso correcto de los turnos de intercambio)'},
  {q:'«En el monte todo va amarrado: sin agua se secan las plantas y se van los animales». ¿Cómo se llama esa manera de hablar, la de todos los días?',o:['a) La popular','b) La literaria','c) La publicitaria','d) La periodística'],a:0,k:'mc-popular',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (lenguaje popular) · DCNB p. 86'}
];
const evalCPBank=[
  {q:'Una sonrisa o un ceño fruncido son expresiones del ___.',a:'rostro',acc:['rostro','cara'],k:'cp-rostro',grado:'7.º a 9.º',curriculo:'DCNB pp. 84, 116 y 157 (signos paralingüísticos: gestos, expresiones del rostro)'},
  {q:'El subir y bajar de la voz al hablar se llama ___.',a:'entonación',acc:['entonación','entonacion'],k:'cp-entonacion',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (entonación, énfasis y pausas) · DCNB p. 116'},
  {q:'Los responsables de una asamblea son el coordinador, los organizadores y el comité de ___.',a:'planeamiento',acc:['planeamiento','planeación','planeacion'],k:'cp-planeamiento',grado:'9.º',curriculo:'DCNB p. 85 (coordinador, organizadores, comité de planeamiento)'},
  {q:'En el circuito del habla, lo que una persona le dice a otra es el ___.',a:'mensaje',acc:['mensaje'],k:'cp-mensaje',grado:'7.º a 9.º',curriculo:'DCNB pp. 84, 117 y 157 (circuito del habla)'},
  {q:'Decir mucho con las palabras justas, sin rodeos, es la cualidad llamada ___.',a:'concisión',acc:['concisión','concision'],k:'cp-concision',grado:'7.º a 9.º',curriculo:'DCNB p. 86 (concisión: uso de palabras indispensables, justas y significativas)'},
  {q:'Una palabra que se usa en una zona del país y no en todas es un ___.',a:'regionalismo',acc:['regionalismo'],k:'cp-regionalismo',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (lenguaje popular, regional) · DCNB p. 86 (regionalismos)'},
  {q:'Antes de irte de una reunión, la fórmula social que corresponde es ___.',a:'despedirse',acc:['despedirse','despedirte','despedirme','despedir'],k:'cp-despedirse',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (fórmulas sociales de intercambio) · DCNB pp. 84 y 157'},
  {q:'En una charla, casi siempre habla una sola persona y los demás ___.',a:'escuchan',acc:['escuchan','oyen','atienden'],k:'cp-escuchan',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (charlas) · DCNB p. 84'},
  {q:'Detenerse un momento entre dos ideas al hablar es hacer una ___.',a:'pausa',acc:['pausa'],k:'cp-pausa',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (entonación, énfasis y pausas)'},
  {q:'Levantar la mano antes de hablar es respetar el ___ de palabra.',a:'turno',acc:['turno','uso'],k:'cp-turno',grado:'7.º a 9.º',curriculo:'DCNB pp. 84 y 157 (respetar el uso o turno de palabra)'}
];
const evalPRBank=[
  {term:'Código',def:'El idioma que comparten quienes conversan',k:'pr-codigo',grado:'7.º a 9.º',curriculo:'DCNB pp. 84, 117 y 157 (circuito del habla)'},
  {term:'Diálogo',def:'Dos o más personas se alternan para hablar y responderse',k:'pr-dialogo',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (diálogos) · DCNB p. 117'},
  {term:'Saludo',def:'«Buenas tardes, ¿cómo ha estado?»',k:'pr-saludo',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (fórmulas sociales de intercambio) · DCNB p. 84'},
  {term:'Despedida',def:'«Hasta luego, que le vaya bien»',k:'pr-despedida',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 · DCNB p. 84'},
  {term:'Agradecimiento',def:'«Muy amable, se lo agradezco»',k:'pr-agradecimiento',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 · DCNB p. 84'},
  {term:'Disculpa',def:'«Perdone, no lo vi venir»',k:'pr-disculpa',grado:'7.º a 9.º',curriculo:'DCNB pp. 84 y 116 (fórmulas de cortesía)'},
  {term:'Mirada',def:'Ver a los ojos a quien conversa contigo',k:'pr-mirada',grado:'7.º a 9.º',curriculo:'DCNB pp. 84 y 116 (signos paralingüísticos)'},
  {term:'Postura',def:'Sentarse de frente y derecho ante quien expone',k:'pr-postura',grado:'7.º a 9.º',curriculo:'DCNB pp. 84 y 116 (signos paralingüísticos)'},
  {term:'Literario',def:'«La luna bordaba de plata el río»',k:'pr-literario',grado:'7.º a 9.º',curriculo:'DCNB pp. 86 y 118 (formas escritas: literario) · el ejemplo se escribió para la misión'},
  {term:'Publicitario',def:'«¡Llévese dos y pague uno, solo hoy!»',k:'pr-publicitario',grado:'7.º a 9.º',curriculo:'DCNB pp. 86 y 118 (formas mixtas: publicitario) · el ejemplo se escribió para la misión'}
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
  {q:'En un trabajo de equipo solo debe hablar quien saca mejores notas.',a:false,k:'tf-equipo',fuente:'Ficha, página 2 (4. Hablar ante otros: trabajo de equipo)',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (charlas y trabajo de equipo) · DCNB p. 85'},
  {q:'Interrumpir a quien habla es una fórmula social de intercambio.',a:false,k:'tf-interrumpir',fuente:'Guía (Aprende): Las fórmulas sociales de intercambio · Ficha, página 1 (1. Conversar en lengua estándar)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 · DCNB pp. 84 y 157'},
  {q:'Una charla se prepara: se define el tema, la fecha y quién la da.',a:true,k:'tf-charla-prepara',fuente:'Ficha, página 2 (4. Hablar ante otros) · Actividad Secuencia: Preparar una charla',grado:'7.º a 9.º',curriculo:'DCNB p. 85 (definen los temas a tratar, fechas de realización, responsables)'},
  {q:'El nivel vulgar está entre las formas orales de la lengua.',a:true,k:'tf-vulgar',fuente:'Ficha, página 3 (5. Los niveles de uso de la lengua) · Actividad Reto: Forma oral',grado:'7.º a 9.º',curriculo:'DCNB pp. 86, 118 y 160 (formas orales: vulgar)'},
  {q:'Para ser claro hay que usar las palabras más raras que conozcas.',a:false,k:'tf-claridad-raras',fuente:'Ficha, página 2 (4. Hablar ante otros: cinco cualidades) · Actividad Tarjetas: Cualidades de quien habla bien',grado:'7.º a 9.º',curriculo:'DCNB pp. 86 y 118 (claridad, sencillez)'},
  {q:'Burlarse de cómo pronuncia un compañero ayuda a que hable mejor.',a:false,k:'tf-burla',fuente:'Ficha, página 3 (6. Un lenguaje libre de discriminación) · Actividad Tarjetas: Lenguaje libre de discriminación',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (lenguaje libre de discriminación) · DCNB p. 86'},
  {q:'Decir «porque sí» basta para defender lo que piensas.',a:false,k:'tf-porque-si',fuente:'Ficha, página 3 (6. Un lenguaje libre de discriminación) · Actividad Secuencia: Una asamblea escolar',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (expresan y fundamentan sus opiniones)'},
  {q:'Mirar el teléfono mientras alguien te habla también le comunica algo.',a:true,k:'tf-telefono',fuente:'Guía (Aprende): Lo verbal y lo no verbal · Ficha, página 2 (2. Lo verbal y lo no verbal)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (lenguaje no verbal) · DCNB p. 84'},
  {q:'Callar y mirar a quien habla es una señal de que escuchas.',a:true,k:'tf-escucha',fuente:'Guía (Aprende): Lo verbal y lo no verbal · Actividad Secuencia: Una conversación con cortesía',grado:'7.º a 9.º',curriculo:'DCNB p. 84 (el esfuerzo para escuchar con atención) · p. 116 (signos paralingüísticos)'},
  {q:'Con solo levantar la mano de lejos ya le dices «hola» a un vecino.',a:true,k:'tf-hola-mano',fuente:'Guía (Aprende): Lo verbal y lo no verbal · Actividad Clasifica: Lenguaje no verbal',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (lenguaje no verbal) · DCNB p. 84 (gestos)'}
];
const evalMCBankNuevo=[
  {q:'Tu amiga dice «estoy bien», pero cruza los brazos y no te mira. ¿Qué te hace dudar de sus palabras?',o:['a) Su apellido','b) Lo que hace con el cuerpo','c) Su letra','d) Su edad'],a:1,k:'mc-cuerpo',fuente:'Guía (Aprende): Lo verbal y lo no verbal · Ficha, página 2 (2. Lo verbal y lo no verbal)',grado:'7.º a 9.º',curriculo:'DCNB pp. 84 y 116 (signos paralingüísticos, signos no verbales)'},
  {q:'Le cuentas a tu abuela cómo te fue en la escuela. ¿Qué manera de hablar encaja mejor?',o:['a) La de un noticiero','b) La de un libro de ciencias','c) La de confianza, con cariño y respeto','d) La de un anuncio'],a:2,k:'mc-abuela',fuente:'Actividad Laboratorio: A tu abuela · Ficha, página 3 (5. Los niveles de uso de la lengua)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (lenguaje popular y familiar) · DCNB p. 84 (adecuar el registro a la situación)'},
  {q:'El artículo 162 de la Constitución habla de las «responsabilidades científicas y morales» del educador. ¿Qué manera de hablar es esa?',o:['a) La lengua culta de una ley','b) El habla de la calle','c) Un chiste','d) Una adivinanza'],a:0,k:'mc-ley-culta',fuente:'Ficha, página 3 (6. Un lenguaje libre de discriminación: En Honduras) · Ficha, página 3 (5. Los niveles de uso de la lengua)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (lenguaje popular, culto) · la cita, de js/data/constitucion-honduras.js'},
  {q:'¿Cuál es la manera técnica de decir «lo que se va a repartir» en una división?',o:['a) El cociente','b) El dividendo','c) El punto','d) El sobrante'],a:1,k:'mc-dividendo',fuente:'Ficha, página 3 (5. Los niveles de uso de la lengua: lo mismo, dicho de dos maneras) · Actividad «Del término técnico al de todos los días» 2',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (lenguaje científico-técnico) · el término, de la misión División de decimales'},
  {q:'¿Cuál de estas frases respeta a todas las personas?',o:['a) «Los de la aldea no saben hablar»','b) «Las niñas no entienden de fútbol»','c) «Ese habla raro, no le hagan caso»','d) «Aquí hablamos distinto y nos entendemos»'],a:3,k:'mc-respeta',fuente:'Ficha, página 3 (6. Un lenguaje libre de discriminación)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (lenguaje libre de discriminación sociocultural, étnica y de género)'},
  {q:'En una llamada, tu tía te cuenta que ya llegó a La Ceiba. En el circuito del habla, tu tía es…',o:['a) la hablante','b) el contexto','c) la señal','d) el idioma'],a:0,k:'mc-hablante',fuente:'Ficha, página 2 (4. Hablar ante otros: el circuito del habla) · Actividad Tarjetas: Circuito del habla',grado:'7.º a 9.º',curriculo:'DCNB pp. 84, 117 y 157 (circuito del habla)'},
  {q:'Tu equipo discute qué tema exponer y nadie cede. ¿Qué conviene?',o:['a) Que decida el más fuerte','b) Dejar de hablarse','c) Oír las razones de todos y negociar','d) Copiar el tema de otro grupo'],a:2,k:'mc-negociar',fuente:'Ficha, página 3 (6. Un lenguaje libre de discriminación) · Actividad Secuencia: Una asamblea escolar',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (negociar y consensuar ideas) · DCNB p. 158'},
  {q:'Los íconos, las señales y los símbolos sirven para…',o:['a) medir la voz','b) corregir la ortografía','c) saludar por carta','d) comunicar sin palabras'],a:3,k:'mc-senales',fuente:'Ficha, página 2 (2. Lo verbal y lo no verbal) · Actividad Tarjetas: Lenguaje no verbal',grado:'7.º a 9.º',curriculo:'DCNB pp. 84 y 157 (otras formas de comunicación: íconos, señales, símbolos)'},
  {q:'Das una dirección: «Siga recto dos cuadras y doble a la derecha en la pulpería». Esa indicación destaca por su…',o:['a) claridad','b) misterio','c) enojo','d) timidez'],a:0,k:'mc-claridad',fuente:'Ficha, página 2 (4. Hablar ante otros: cinco cualidades)',grado:'7.º a 9.º',curriculo:'DCNB pp. 86, 118 y 158 (cualidades comunicativas: claridad)'},
  {q:'El mismo aviso se dice distinto en el recreo y en un acto cívico. ¿Qué es lo que hace cambiar la manera de decirlo?',o:['a) El color del uniforme','b) La situación en que se habla','c) El precio de la merienda','d) El día de la semana'],a:1,k:'mc-situacion',fuente:'Ficha, página 3 (Truco para recordar) · Actividad Laboratorio: la misma noticia, cuatro bocas',grado:'7.º a 9.º',curriculo:'DCNB p. 84 (adecuar el nivel de formalidad del registro a las situaciones de comunicación)'}
];
const evalCPBankNuevo=[
  {q:'Mover la cabeza de arriba abajo para decir «sí» es un ___.',a:'gesto',acc:['gesto','gestos'],k:'cp-gesto',fuente:'Ficha, página 2 (2. Lo verbal y lo no verbal) · Actividad Identifica 3',grado:'7.º a 9.º',curriculo:'DCNB pp. 84, 116 y 157 (signos paralingüísticos: gestos)'},
  {q:'Al recibir un favor, la fórmula social que corresponde es dar las ___.',a:'gracias',acc:['gracias'],k:'cp-gracias',fuente:'Ficha, página 1 (1. Conversar en lengua estándar: tabla de fórmulas) · Guía (Aprende): Las fórmulas sociales de intercambio',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (fórmulas sociales de intercambio) · DCNB pp. 84 y 157'},
  {q:'Decir con más fuerza la palabra más importante de la oración es ponerle ___.',a:'énfasis',acc:['énfasis','enfasis'],k:'cp-enfasis',fuente:'Ficha, página 2 (3. La voz también habla) · Guía (Aprende): La voz también habla',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (entonación, énfasis y pausas) · DCNB p. 116'},
  {q:'En el circuito del habla, quien recibe lo que se dice es el ___.',a:'oyente',acc:['oyente'],k:'cp-oyente',fuente:'Ficha, página 2 (4. Hablar ante otros: el circuito del habla) · Actividad Tarjetas: Circuito del habla',grado:'7.º a 9.º',curriculo:'DCNB pp. 84, 117 y 157 (circuito del habla)'},
  {q:'Presentar las ideas en un orden lógico es hablar con ___.',a:'coherencia',acc:['coherencia'],k:'cp-coherencia',fuente:'Ficha, página 2 (4. Hablar ante otros: cinco cualidades) · Actividad Tarjetas: Cualidades de quien habla bien',grado:'7.º a 9.º',curriculo:'DCNB p. 86 (coherencia: orden lógico de ideas)'},
  {q:'El lenguaje que usas en tu casa, con confianza, es el nivel ___.',a:'familiar',acc:['familiar'],k:'cp-familiar',fuente:'Ficha, página 3 (5. Los niveles de uso de la lengua) · Actividad Laboratorio: A tu abuela',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (lenguaje popular y familiar) · DCNB p. 118'},
  {q:'Cuando dices «por favor» y «con permiso» usas fórmulas de ___.',a:'cortesía',acc:['cortesía','cortesia'],k:'cp-cortesia',fuente:'Ficha, página 1 (1. Conversar en lengua estándar: las fórmulas de cortesía) · Guía (Aprende): Las fórmulas sociales de intercambio',grado:'7.º a 9.º',curriculo:'DCNB pp. 84, 116 y 157 (fórmulas de cortesía)'},
  {q:'En una asamblea, las personas llegan a ___ sobre un problema que les importa a todas.',a:'conclusiones',acc:['conclusiones','conclusión','conclusion'],k:'cp-conclusiones',fuente:'Ficha, página 2 (4. Hablar ante otros: asamblea escolar) · Actividad Tarjetas: Asamblea escolar',grado:'9.º',curriculo:'DCNB p. 85 (asamblea: llegar a conclusiones determinadas en torno a un problema)'},
  {q:'Decidir entre todos algo que el grupo entero acepta es llegar a un ___.',a:'acuerdo',acc:['acuerdo','consenso'],k:'cp-acuerdo',fuente:'Ficha, página 3 (6. Un lenguaje libre de discriminación) · Actividad Secuencia: Una asamblea escolar',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (negociar y consensuar ideas)'},
  {q:'La forma de hablar del lugar donde creciste merece ___, igual que la de los demás.',a:'respeto',acc:['respeto'],k:'cp-respeto',fuente:'Ficha, página 3 (6. Un lenguaje libre de discriminación) · Actividad Tarjetas: Lenguaje libre de discriminación',grado:'7.º a 9.º',curriculo:'DCNB pp. 86 y 118 (respeto hacia las diferentes formas de lengua de la comunidad)'}
];
const evalPRBankNuevo=[
  {term:'Malentendido',def:'Quien escucha entiende otra cosa que la que se quiso decir',k:'pr-malentendido',fuente:'Guía (Aprende): Lo verbal y lo no verbal · Ficha, página 2 (2. Lo verbal y lo no verbal)',grado:'7.º a 9.º',curriculo:'DCNB p. 86 (contradicciones y desviaciones en el discurso)'},
  {term:'Negociar',def:'Ceder un poco cada parte hasta hallar algo que acepten las dos',k:'pr-negociar',fuente:'Ficha, página 3 (6. Un lenguaje libre de discriminación) · Actividad Secuencia: Una asamblea escolar',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (negociar y consensuar ideas)'},
  {term:'Opinión',def:'Lo que una persona piensa sobre un asunto',k:'pr-opinion',fuente:'Ficha, página 3 (6. Un lenguaje libre de discriminación)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (expresan y fundamentan sus opiniones)'},
  {term:'Lámina',def:'Dibujo grande que ayuda a explicar un tema ante el grupo',k:'pr-lamina',fuente:'Ficha, página 2 (4. Hablar ante otros: charla, materiales de apoyo)',grado:'7.º',curriculo:'DCNB p. 85 (materiales de apoyo gráficos: tarjetas, láminas, afiches, carteles)'},
  {term:'Tarjetas',def:'Papelitos con las ideas clave que guían a quien expone',k:'pr-tarjetas',fuente:'Ficha, página 2 (4. Hablar ante otros: charla, materiales de apoyo)',grado:'7.º',curriculo:'DCNB p. 85 (materiales de apoyo gráficos: tarjetas)'},
  {term:'Interlocutor',def:'Cada una de las personas que toman parte en una conversación',k:'pr-interlocutor',fuente:'Guía (Aprende): ¿Qué es conversar en lengua estándar? · Ficha, página 2 (4. Hablar ante otros: el circuito del habla)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (según el contexto discursivo de los interlocutores)'},
  {term:'Intención',def:'Lo que se busca al decir algo: pedir, avisar, bromear o regañar',k:'pr-intencion',fuente:'Guía (Aprende): La voz también habla · Ficha, página 2 (3. La voz también habla)',grado:'7.º a 9.º',curriculo:'DCNB pp. 84, 116 y 157 (indicadores de la intención comunicativa)'},
  {term:'Discriminación',def:'Tratar peor a alguien por su origen o por ser niña o niño',k:'pr-discriminacion',fuente:'Ficha, página 3 (6. Un lenguaje libre de discriminación) · Actividad Tarjetas: Lenguaje libre de discriminación',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (discriminación sociocultural, étnica y de género)'},
  {term:'Formalidad',def:'Seriedad que pide un acto cívico y que no pide el recreo',k:'pr-formalidad',fuente:'Ficha, página 3 (Truco para recordar) · Actividad Laboratorio: la misma noticia, cuatro bocas',grado:'7.º a 9.º',curriculo:'DCNB p. 84 (nivel de formalidad del registro)'},
  {term:'Público',def:'Las personas reunidas para oír una exposición',k:'pr-publico',fuente:'Ficha, página 2 (4. Hablar ante otros: charla) · Actividad Secuencia: Preparar una charla',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (charlas) · DCNB p. 84'}
];

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
// Los casos son de la vida diaria del aula: malentendidos por el tono y
// burlas por la forma de hablar. Ninguno repite la historia de Brayan.
// La pauta del caso es la misma para todos los casos del banco: por eso los
// dos casos tienen la misma forma (palabras amables, tono y gestos que dicen
// otra cosa, y alguien que reacciona a eso).
const critTextos={
  caso:'Caso de análisis: un malentendido por el tono',
  decision:'Toma de decisiones: una burla por la forma de hablar',
  decisionPregunta:'¿Qué harías tú y qué le propondrías al grupo? Explica por qué, relacionándolo con el respeto a las formas de hablar y con el lenguaje libre de discriminación.',
  decisionPreguntaHoja:'¿Qué harías tú y qué le propondrías al grupo? Explica por qué, pensando en el respeto a las formas de hablar.',
  comparacionPregunta:'1. ¿Qué nivel de la lengua usa cada caso? 2. ¿En qué situación sirve cada uno? 3. ¿Por qué ninguno es «mejor» que el otro?'
};
const critCaseBank=[
  {k:'ca-gracias',txt:'Dania le presta su cuaderno a Kevin. Él lo recibe sin mirarla y dice «gracias» entre dientes, ya de espaldas. Dania decide no prestarle nada más.'},
  {k:'ca-felicidades',txt:'El equipo de Óscar gana el torneo. Su primo le dice «qué bien, felicidades» con la voz apagada, los brazos cruzados y la vista en el suelo. Óscar se queda pensando que a su primo le molestó.'},
];
const critCaseQuestions=[
  '1. ¿Qué dijo la persona con sus palabras y qué dijo con el tono y los gestos?',
  '2. ¿A cuál de los dos mensajes le creyó quien escuchaba? ¿En qué se nota?',
  '3. ¿Qué indicadores de la intención no acompañaron a las palabras?',
  '4. ¿Cómo lo dirías tú para que se entienda lo que de verdad se quería decir?',
];
const critCaseGuides=[
  'Con las palabras dijo algo amable (agradecer o felicitar); con el tono y los gestos dijo otra cosa: desinterés o molestia.',
  'Le creyó al tono y a los gestos, no a las palabras: se nota en cómo reaccionó después.',
  'La entonación y los signos paralingüísticos: la voz, la mirada, los gestos y la postura.',
  'Respuesta abierta: las mismas palabras, mirando a la persona, con voz clara y un gesto que acompañe (una sonrisa, por ejemplo).',
];
const critErrorBank=[
  {k:'er-no-verbal',txt:'"La comunicación no verbal es la que se hace por escrito, y un gesto nunca cambia lo que dicen las palabras".',
   g1:'lo no verbal no usa palabras: son gestos, expresiones de la cara, señales y símbolos. Lo escrito es verbal.',
   g2:'un gesto sí puede cambiar el mensaje: una frase amable dicha con mala cara ya no suena amable.'},
  {k:'er-estandar',txt:'"La lengua estándar solo sirve para escribir, y quien usa regionalismos habla mal".',
   g1:'la lengua estándar también se habla: en la escuela, en una charla o al hacer un trámite.',
   g2:'un regionalismo no es un error: es la forma de hablar de una región y merece respeto.'},
];
const critDecisionBank=[
  'A tu grado llega una compañera que viene de otra zona del país. Usa palabras que aquí no se usan y algunos se ríen cada vez que participa. Ella ya casi no levanta la mano.',
  'En tu equipo de trabajo, un compañero imita con burla la manera de pronunciar de otro cada vez que este opina. El compañero imitado dejó de dar ideas.',
];
const critDecisionGuide='La burla por la forma de hablar es discriminación: hace que la persona calle y el grupo pierde sus ideas. Se recomienda pedir que pare la burla, hablar con quien se burla sin humillarlo, invitar a participar a la persona afectada y acordar en el grupo que toda forma de hablar se respeta. Hablar distinto no es hablar mal: cada quien habla como aprendió en su comunidad.';
const critCompareBank=[
  {k:'co-ecosistema',a:'«Un ecosistema es el conjunto de los seres vivos de un lugar, su medio físico y las relaciones entre ellos».',b:'«En el monte todo va amarrado: las plantas, los animales, el agua y la tierra se necesitan».',
   ga:'nivel científico-técnico: sirve en un informe o en una exposición escolar.',
   gb:'nivel popular: sirve para explicárselo a un vecino o a un hermano pequeño.',
   gr:'Dicen lo mismo con distinto nivel. Se elige según quién escucha y para qué: eso es adecuar el lenguaje a la situación.'},
  {k:'co-division',a:'«El cociente de 15 entre 3 es 5».',b:'«Si repartimos 15 mangos entre 3, a cada quien le tocan 5».',
   ga:'nivel científico-técnico: es el de la pizarra y el cuaderno de la materia.',
   gb:'nivel popular o familiar: es el de la casa y el mercado.',
   gr:'Dicen lo mismo con distinto nivel. El término exacto ahorra palabras entre quienes lo conocen; el de todos los días lo entiende cualquiera.'},
];
const critCauseBank=[
  {k:'cau-sin-saludo',cause:'Entras a la secretaría y pides un favor sin saludar.',guide:'La otra persona puede sentirse tratada con descortesía y atender de mala gana.'},
  {k:'cau-de-corrido',cause:'Das un aviso largo de corrido, sin detenerte ni una vez.',guide:'Quien oye se pierde: no distingue dónde termina una idea y dónde empieza la otra.'},
  {k:'cau-libro',cause:'Le explicas la fotosíntesis a tu hermano de seis años con las frases del libro.',guide:'No entiende: ese vocabulario no es el de su edad y hay que decirlo más sencillo.'},
  {k:'cau-todos-hablan',cause:'En la asamblea del grado, todos hablan al mismo tiempo.',guide:'Nadie se entera de nada y no se llega a ninguna decisión.'},
  {k:'cau-grito',cause:'Pides prestado un lápiz a gritos y con el ceño fruncido.',guide:'Suena a orden o a pleito, y lo más probable es que te lo nieguen.'},
];
const critEffectBank=[
  {k:'ef-acento',effect:'Una alumna recién llegada dejó de opinar en clase.',guide:'Se burlaron de su acento los primeros días.'},
  {k:'ef-marlon',effect:'La bibliotecaria entendió a la primera lo que buscaba Marlon.',guide:'Marlon saludó, explicó qué necesitaba y habló claro.'},
  {k:'ef-celular',effect:'La abuela no entendió la explicación de su nieto sobre el celular.',guide:'El nieto usó puros términos técnicos, sin ponerle ejemplos de la vida diaria.'},
  {k:'ef-charla',effect:'A mitad de la charla, medio grado estaba distraído.',guide:'El expositor habló con voz plana, igual de principio a fin.'},
  {k:'ef-tema',effect:'El equipo eligió el tema de su exposición sin pelear.',guide:'Cada integrante dio sus razones, los demás oyeron y al final cedieron un poco.'},
  {k:'ef-broma',effect:'Una broma entre amigos terminó en disgusto.',guide:'Se dijo con cara dura y sonó a insulto.'},
  {k:'ef-vecina',effect:'Doña Marta le sonrió al muchacho que casi nunca le habla.',guide:'Esa mañana él le dijo «buenos días» mirándola a los ojos.'},
];

// ===================== LABORATORIO =====================
// «La misma noticia, cuatro bocas». Un hecho inventado para la misión (la
// tubería rota y el día sin clases) se le cuenta a cuatro personas. En cada
// paso el alumno elige una opción; `sirve` dice, para cada persona, si esa
// opción encaja (si), encaja a medias (medio) o no encaja (no), y `por`, el
// porqué que se le enseña. El nivel que queda lo da el paso «palabras».
const cuatroBocas={
  hecho:'Mañana no hay clases: se rompió la tubería y la escuela está sin agua. (Es un aviso inventado para practicar.)',
  bocas:[
    {id:'amigo',emoji:'🧢',nombre:'A tu mejor amigo',donde:'en el recreo'},
    {id:'abuela',emoji:'👵',nombre:'A tu abuela',donde:'en la casa'},
    {id:'director',emoji:'🏫',nombre:'Al director',donde:'en la dirección'},
    {id:'charla',emoji:'🎤',nombre:'A todo el grado',donde:'en una charla'}
  ],
  pasos:[
    {id:'saludo',titulo:'👋 Cómo empiezas',opciones:[
      {id:'confianza',txt:'«¡Qué onda!»',
       sirve:{amigo:'si',abuela:'medio',director:'no',charla:'no'},
       por:{amigo:'Entre amigos, ese saludo de confianza encaja.',abuela:'Te va a entender, pero a tu abuela le gustará más un saludo con cariño y respeto.',director:'Es un saludo de confianza: con el director se espera uno formal.',charla:'Ante un grupo que te escucha, conviene un saludo para todos y más formal.'}},
      {id:'carino',txt:'«Hola, ¿cómo amaneció?»',
       sirve:{amigo:'medio',abuela:'si',director:'medio',charla:'no'},
       por:{amigo:'Sirve, aunque con tu amigo sonarías más natural con un saludo de confianza.',abuela:'Saludas con cariño y con respeto: justo lo que pide la situación.',director:'Es amable, pero en la dirección queda mejor «buenos días» y pedir permiso.',charla:'Es un saludo para una sola persona, no para un grupo.'}},
      {id:'formal',txt:'«Buenos días. ¿Me permite un momento?»',
       sirve:{amigo:'medio',abuela:'medio',director:'si',charla:'si'},
       por:{amigo:'Está bien dicho, pero con tu amigo suena demasiado serio.',abuela:'Está bien dicho, pero en la casa suena distante.',director:'Saludas y pides permiso: es la fórmula social que la situación pide.',charla:'Saludas a todos y pides su atención: así se empieza una charla.'}},
      {id:'nada',txt:'Sin saludar: vas directo al aviso',
       sirve:{amigo:'medio',abuela:'no',director:'no',charla:'no'},
       por:{amigo:'Entre amigos pasa, pero un saludo nunca sobra.',abuela:'Sin saludo, el aviso suena seco. Saludar es la primera fórmula social.',director:'Entrar sin saludar es una descortesía: puede que ni te escuche.',charla:'Un grupo necesita un saludo para saber que empiezas y ponerte atención.'}}
    ]},
    {id:'palabras',titulo:'💬 Con qué palabras lo dices',opciones:[
      {id:'popular',nivel:'popular o familiar',txt:'«Mañana no hay clases: se reventó el tubo y no hay ni gota de agua»',
       sirve:{amigo:'si',abuela:'si',director:'no',charla:'medio'},
       por:{amigo:'Es el lenguaje de todos los días: con tu amigo encaja.',abuela:'Es el lenguaje de la casa: tu abuela lo entiende a la primera.',director:'En la dirección se espera la lengua estándar, no la del recreo.',charla:'Te entienden, pero ante un grupo conviene la lengua estándar.'}},
      {id:'estandar',nivel:'lengua estándar',txt:'«Mañana no habrá clases porque se rompió la tubería y la escuela está sin agua»',
       sirve:{amigo:'si',abuela:'si',director:'si',charla:'si'},
       por:{amigo:'La lengua estándar se entiende en todas partes: también con tu amigo.',abuela:'Claro y completo: tu abuela lo entiende sin problema.',director:'Dices qué pasa y por qué, con palabras que cualquiera entiende.',charla:'Todo el grado te entiende: es el lenguaje que pide una charla.'}},
      {id:'tecnico',nivel:'científico-técnico',txt:'«Se suspenden las clases por una falla en el sistema de abastecimiento de agua potable»',
       sirve:{amigo:'no',abuela:'no',director:'medio',charla:'medio'},
       por:{amigo:'Suena a informe: con tu amigo no hace falta tanto término técnico.',abuela:'Son términos de un informe: tu abuela tendría que pedirte que se lo expliques.',director:'El director lo entiende, aunque no hacía falta tanto término: bastaba la lengua estándar.',charla:'Sirve si explicas los términos; si no, parte del grado se queda sin entender.'}}
    ]},
    {id:'voz',titulo:'🎵 Con qué voz',opciones:[
      {id:'clara',txt:'Tranquila y clara, marcando «mañana» y «no habrá clases»',
       sirve:{amigo:'si',abuela:'si',director:'si',charla:'si'},
       por:{amigo:'Con buena entonación y énfasis en lo importante, el aviso se entiende.',abuela:'Con buena entonación y énfasis en lo importante, el aviso se entiende.',director:'Con buena entonación y énfasis en lo importante, el aviso se entiende.',charla:'Con buena entonación y énfasis en lo importante, el aviso llega a todo el grupo.'}},
      {id:'gritos',txt:'A gritos y de prisa',
       sirve:{amigo:'medio',abuela:'no',director:'no',charla:'no'},
       por:{amigo:'En el recreo hay ruido, pero a gritos suena a pleito y no a aviso.',abuela:'A gritos suena a regaño o a susto, no a aviso.',director:'A gritos suena a falta de respeto, aunque las palabras sean correctas.',charla:'A gritos y de prisa el grupo se altera y no retiene el aviso.'}},
      {id:'baja',txt:'En voz muy baja, mirando al suelo',
       sirve:{amigo:'no',abuela:'no',director:'no',charla:'no'},
       por:{amigo:'Si no te oye ni lo miras, tu amigo creerá que no es en serio.',abuela:'Tu abuela no alcanzará a oírte, y la mirada baja le dirá que algo anda mal.',director:'Sin mirarlo y sin que te oiga, el mensaje no llega.',charla:'Ante un grupo, la voz baja y la mirada al suelo dejan a la mitad sin enterarse.'}}
    ]},
    {id:'pausas',titulo:'⏸️ Con qué pausas',opciones:[
      {id:'con',txt:'Una pausa después de cada idea',
       sirve:{amigo:'si',abuela:'si',director:'si',charla:'si'},
       por:{amigo:'Las pausas separan las ideas: qué pasa, y por qué.',abuela:'Las pausas le dan tiempo de entender cada parte del aviso.',director:'Las pausas ordenan el aviso: primero el hecho, luego la causa.',charla:'Ante un grupo, las pausas son las que dejan que todos te sigan.'}},
      {id:'sin',txt:'Todo de corrido, sin respirar',
       sirve:{amigo:'medio',abuela:'no',director:'medio',charla:'no'},
       por:{amigo:'Tu amigo quizá te siga, pero de corrido se pierde la mitad.',abuela:'De corrido, tu abuela no distingue dónde termina una idea y empieza la otra.',director:'Te entenderá con esfuerzo: de corrido el aviso suena atropellado.',charla:'Sin pausas, un grupo grande se pierde a la primera frase.'}}
    ]}
  ]
};
