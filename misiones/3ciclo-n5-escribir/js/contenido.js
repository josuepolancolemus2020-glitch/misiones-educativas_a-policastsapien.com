/* ============================================================
   M.E.T.A.S · Misión Escribir por etapas · CONTENIDO
   ------------------------------------------------------------
   Aquí solo hay datos: lo que la misión dice, pregunta y guarda. Ni
   una función. Quien pinta las pantallas, lleva el XP y arma el examen
   es el motor compartido (js/motor-mision.js).

   Para corregir un dato de esta misión se toca ESTE archivo y nada más.
   La ficha imprimible tiene su bloque aparte, en js/ficha.js.

   ► PARA QUÉ GRADOS. Español, primer parcial (febrero y marzo), de 7.º
     a 9.º, y un apartado para Media. De dónde sale cada cosa:

     · Los tres grados: «Planeación de textos: selección del tema,
       búsqueda y organización de la información» y «Producción de
       textos: borrador, revisión y versión final» [Programación de
       Español de 7.º a 9.º, _dev/dcnb-pdf/programacion-espanol-7-9.pdf,
       PDF pp. 7, 15 y 23]. Lo que se hace en cada etapa (la situación
       de escritura, el esquema, releer, comparar con el plan, que otro
       lo lea, el diccionario, la versión final) es del DCNB de III
       ciclo [_dev/dcnb-pdf/dcneb-basica-iii-ciclo.pdf, pp. 95, 131 y 171].
     · 7.º: «Concordancia, claridad, corrección, coherencia en el
       texto» y «Párrafos: descriptivos, narrativos y expositivos»
       [Prog., p. 7; DCNB p. 101].
     · 8.º: «El párrafo», «La oración gramatical: sujeto, verbo,
       complemento» y los párrafos persuasivos [Prog., p. 15]. La idea
       principal y las secundarias, DCNB p. 123. La oración simple y la
       compuesta, las clases de sujeto, los complementos y la
       concordancia («acuerdo recíproco de género y número»), DCNB
       p. 151. El DCNB llama «argumentativos» a los párrafos que la
       programación llama «persuasivos» [p. 136]: aquí se dice
       persuasivos.
     · 9.º: «Oraciones compuestas. Coordinación: copulativas,
       disyuntivas, adversativas y explicativas» y «el ensayo» [Prog.,
       p. 23]. Las conjunciones de cada clase y la yuxtaposición, DCNB
       p. 189. El ensayo (tema libre, opinión propia, esquema de
       presentación, desarrollo y conclusión), DCNB pp. 176 y 177.
     · Para Media: «la escritura como proceso: planificación, ejecución
       y revisión» [CNB de 10.º, CE2.5: _dev/dcnb/programa-espanol-10.md].

     Cada pregunta del examen anota su grado (`grado`) y de qué página
     del currículo sale (`curriculo`). «Prog.» es la programación; el
     número de página es el del visor del PDF. Las del banco nuevo
     anotan además dónde lo enseña la misión (`fuente`: la guía, la
     ficha o una actividad), que es lo que les pide
     `_dev/verifica-conceptual-banco-grande.js`.

   ► LO QUE SE DICE CON PALABRAS PROPIAS, Y POR QUÉ.
     · Qué es el sujeto y qué es el predicado se dice con las dos
       preguntas con que el DCNB los enseña desde el II ciclo: «¿de
       quién o de qué se habla?» y «¿qué se dice?».
     · El DCNB nombra el párrafo, su idea principal y su punto y aparte,
       pero no lo define. «Un grupo de oraciones que tratan una misma
       idea» es la definición de siempre de la escuela; no se pregunta en
       el examen como dato.
     · Qué es el complemento circunstancial. El DCNB lo nombra entre
       los modificadores del predicado (p. 151: «complemento
       circunstancial de tiempo y de modo»; la programación de 1.º a 6.º
       nombra también el de lugar) y no lo define. La definición de la
       guía y de la ficha («la palabra o el grupo de palabras que
       acompaña al verbo y dice en qué circunstancias pasa lo que el
       verbo cuenta: cuándo, dónde o cómo») es REDACCIÓN NUESTRA, pedida
       por Josué al revisar el PR 60. No se dice que se pueda quitar sin
       que la oración cambie, porque no siempre es así («Vive cerca»).
     · El objeto directo y el indirecto se nombran (DCNB p. 151) y no
       se definen ni se preguntan: en `_dev/` no hay gramática que los
       defina. El predicado verbal y el nominal, igual: quedan fuera.
     · El DCNB escribe «más» entre las adversativas; la conjunción es
       «mas», sin tilde, y casi no se usa al hablar. No se pregunta.
     · Las perífrasis verbales de la programación de 8.º y 9.º no entran:
       el plan las deja pendientes de confirmar con Josué.

   ► LOS TEXTOS DE OTRAS MATERIAS. Los ejemplos y los borradores del
     laboratorio hablan de otras materias, con datos que ya están en
     misiones publicadas:
       · los estados de la materia y sus cambios (fusión, evaporación):
         misiones/2y3ciclo-la-materia/;
       · la célula (la mitocondria produce la energía, el núcleo guarda
         el ADN, la membrana controla lo que entra y sale):
         misiones/2y3ciclo-la-celula/js/contenido.js;
       · la división de decimales (mover el punto los mismos espacios en
         el divisor y en el dividendo; 1.5 ÷ 0.3 = 15 ÷ 3 = 5):
         misiones/2y3ciclo-division-decimales/;
       · Copán (ciudad maya de Honduras, hoy parque arqueológico; las
         estelas de piedra tallada; la numeración de 20 en 20 con puntos
         y barras): misiones/2y3ciclo-mayas-precolombinas/. NO se usan
         las tres valoraciones que el plan del motor anota como sin
         fuente («la más desarrollada», «el más numeroso», «el más
         famoso»).
     Lo que se pregunta es siempre de Español: el dato de la otra materia
     es solo de qué habla el texto. Las personas y las situaciones (la
     nota de Keila, la carta a la alcaldía) son inventadas.

   ⚠️ El orden de cada banco del examen no se cambia una vez aprobado:
   decide qué preguntas caen en cada forma. Esta misión nació con sus 50
   formas y todavía no tiene nada congelado (está en la lista de nacidas,
   _dev/misiones-nacidas.json): hasta que Josué apruebe las preguntas se
   pueden corregir.

   Va como declaraciones de JavaScript y no como un archivo .json porque
   los guiones de la página leen SAVE_KEY en cuanto carga y Campeonísimo
   lee el banco de selección múltiple buscando su declaración. Por eso en
   estos comentarios no se escribe una declaración de ejemplo.
   ============================================================ */

// ===================== TEXTOS PROPIOS DE LA MISIÓN =====================
const TEXTOS={
  titulo:'Escribir por etapas',
  emoji:'📝',
  materia:'Español',
  confeti:['#0f766e','#4ba89f','#d97706','#f59e0b','#fde68a'],
  impresion:{acento:'#c49000',fondo:'#fef9e7'},
  rutaEtiqueta:'Secuencia',
  widgetIdentifica:{paso:'Caso',fin:'🎉 ¡Reconociste todas las etapas!'},
  tareaIdentifica:['Copia cada oración en tu cuaderno. Subraya el sujeto con una línea y el predicado con dos, y encierra el verbo. Escribe al lado lo que se te pide.','<strong>Ejemplo:</strong> La mitocondria produce la energía. → sujeto: <span style="color:var(--jade);font-weight:700;">La mitocondria</span> · verbo: <span style="color:var(--jade);font-weight:700;">produce</span>'],
  tareaClasifica:{instruccion:'Copia la tabla en tu cuaderno. Vas a planear cada texto antes de escribirlo: completa para qué lo escribes, quién lo va a leer, qué tipo de párrafo usarás más y qué revisarás primero.',columnas:['Texto que vas a escribir','Propósito','Destinatario','Párrafo que más usarás','Qué revisar primero']},
  diploma:['¡Sigue escribiendo!','¡Buen borrador!','¡Ya revisas como escritor!','¡Tus párrafos se entienden a la primera!','¡Escritor por etapas!']
};

// ===================== IDENTIDAD Y GUARDADO =====================
const SAVE_KEY='n5_escribir_v1';
const MXP=200;
const TOTAL_SECTIONS=13;

// ===================== LOGROS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'📝',label:'Primer quiz de escritura superado'},
  flash_master:{icon:'🃏',label:'Todas las tarjetas de escritura exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de párrafos y oraciones'},
  id_master:{icon:'🔍',label:'Detector de sujetos y verbos'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de la oración'},
  nivel3:{icon:'✏️',label:'¡Redactor! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Escritor por etapas! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de escritura dominados'}
};

// ===================== NIVELES =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Apuntador ✏️'},{t:55,n:'Redactor 📝'},{t:90,n:'Revisor 🔍'},{t:130,n:'Corrector 🖊️'},{t:165,n:'Editor 📚'},{t:190,n:'Escritor por etapas 🏆'}];

// ===================== TARJETAS =====================
const fcData=[
  {w:'Planeación',a:'🧭 La primera etapa. Antes de escribir decides el <strong>tema</strong>, el <strong>propósito</strong>, el <strong>destinatario</strong> y el <strong>formato</strong>, y buscas y ordenas la información.'},
  {w:'Propósito',a:'🎯 <strong>Para qué</strong> escribes: informar, contar, pedir algo, convencer. Con otro propósito, el mismo tema da otro texto.'},
  {w:'Destinatario',a:'👤 <strong>Para quién</strong> escribes. No se le escribe igual a una amiga que al director: cambian las palabras y el trato.'},
  {w:'Esquema',a:'🗂️ El <strong>plan</strong> del texto: tus ideas puestas en orden, con sus temas y subtemas, antes de redactar.'},
  {w:'Borrador',a:'✏️ La <strong>primera escritura</strong>. Sale con errores y no importa: es para cambiarla. Mientras lo escribes, relee lo que llevas.'},
  {w:'Revisión',a:'🔍 <strong>Leer lo escrito para mejorarlo</strong>: lo comparas con tu plan, corriges la concordancia, quitas lo repetido, consultas el diccionario y pides que otro lo lea.'},
  {w:'Versión final',a:'📄 El texto <strong>ya corregido y pasado en limpio</strong>, con el formato que elegiste. Puede ir a mano o en computadora.'},
  {w:'Párrafo',a:'📦 Grupo de oraciones que tratan <strong>una misma idea</strong>. Termina con <strong>punto y aparte</strong>. Tiene una idea principal y otras secundarias que la apoyan.'},
  {w:'Tipos de párrafo',a:'🧱 Por su forma: <strong>descriptivo</strong> (dice cómo es), <strong>narrativo</strong> (cuenta qué pasó), <strong>expositivo</strong> (explica un tema) y <strong>persuasivo</strong> (busca convencer).'},
  {w:'Concordancia',a:'🤝 Las palabras <strong>van de acuerdo</strong> en género y número: «las casas blancas», no «las casas blanco»; «los niños corren», no «los niños corre».'},
  {w:'Coherencia',a:'🧵 Las ideas siguen un <strong>orden lógico</strong> y todas tienen que ver con el tema. Una oración que habla de otra cosa la rompe.'},
  {w:'Oración',a:'🔤 Tiene <strong>sujeto</strong> (de quién o de qué se habla) y <strong>predicado</strong> (qué se dice). El <strong>verbo</strong> es el centro del predicado y sus <strong>complementos</strong> lo completan.'},
  {w:'Coordinación',a:'🔗 Une oraciones del mismo nivel con una conjunción: <strong>copulativa</strong> (y, e, ni), <strong>disyuntiva</strong> (o, u), <strong>adversativa</strong> (pero, sin embargo) y <strong>explicativa</strong> (es decir, o sea).'},
  {w:'Ensayo',a:'💭 Texto en que el autor <strong>da su opinión</strong> sobre un tema que elige. Su esquema: <strong>presentación, desarrollo y conclusión</strong>.'},
];

// ===================== QUIZ =====================
const qzData=[
  {q:'¿Qué decides en la planeación de un texto?',o:['a) El tema, el propósito y el destinatario','b) La nota que te pondrán','c) El color del lapicero','d) Cuántas tildes llevará'],c:0},
  {q:'¿Para qué sirve el borrador?',o:['a) Para entregarlo sin leerlo','b) Para adornar el cuaderno','c) Para tener una primera escritura que se puede cambiar','d) Para copiar el texto de otro'],c:2},
  {q:'Al revisar, ¿con qué comparas tu texto?',o:['a) Con el horario de clases','b) Con el plan que hiciste','c) Con la lista de asistencia','d) Con el recibo de la luz'],c:1},
  {q:'«La casa de mi abuela es de adobe, tiene techo de teja y un corredor fresco». ¿Qué tipo de párrafo es?',o:['a) Persuasivo','b) Narrativo','c) Expositivo','d) Descriptivo'],c:3},
  {q:'¿Cuál de estas oraciones tiene un error de concordancia?',o:['a) Las maestras llegaron temprano','b) El perro ladra en la noche','c) Los libros está en la mesa','d) Mi hermana canta bien'],c:2},
  {q:'En «La membrana controla lo que entra a la célula», ¿cuál es el verbo?',o:['a) membrana','b) controla','c) célula','d) La'],c:1},
  {q:'¿Qué conjunción une dos ideas que se oponen?',o:['a) y','b) o','c) ni','d) pero'],c:3},
  {q:'¿Qué partes tiene el esquema de un ensayo?',o:['a) Presentación, desarrollo y conclusión','b) Saludo, firma y fecha','c) Título, dibujo y portada','d) Pregunta, respuesta y nota'],c:0},
  {q:'¿Qué hace un párrafo persuasivo?',o:['a) Cuenta una historia','b) Busca convencer con razones','c) Describe un paisaje','d) Da los pasos de una receta'],c:1},
];

// ===================== CLASIFICA =====================
const classGroups=[
  {label:['Planear','Revisar'],headA:'🧭 Es de planear (antes de escribir)',headB:'🔍 Es de revisar (después del borrador)',colA:'plan',colB:'rev',
   words:[{w:'Elegir el tema',t:'plan'},{w:'Corregir una tilde',t:'rev'},{w:'Pensar para quién escribo',t:'plan'},{w:'Quitar una idea repetida',t:'rev'},{w:'Buscar información',t:'plan'},{w:'Comparar el texto con el plan',t:'rev'},{w:'Ordenar las ideas en un esquema',t:'plan'},{w:'Arreglar «los niño»',t:'rev'},{w:'Decidir si será carta o afiche',t:'plan'},{w:'Pedir que otro lo lea',t:'rev'}]},
  {label:['Descriptivo','Narrativo'],headA:'🖼️ Describe: dice cómo es',headB:'📖 Narra: cuenta qué pasó',colA:'des',colB:'nar',
   words:[{w:'La casa es blanca y fresca',t:'des'},{w:'Ayer llovió y se fue la luz',t:'nar'},{w:'El cerro es alto y verde',t:'des'},{w:'Salimos temprano y volvimos de noche',t:'nar'},{w:'Mi abuela tiene manos fuertes',t:'des'},{w:'El bus se detuvo y bajamos',t:'nar'},{w:'El patio es ancho, con un mango',t:'des'},{w:'Primero sembramos, luego regamos',t:'nar'},{w:'La laguna es honda y quieta',t:'des'},{w:'Tocaron la campana y entramos',t:'nar'}]},
  {label:['Sujeto','Predicado'],headA:'👤 Sujeto: de quién se habla',headB:'💬 Predicado: qué se dice',colA:'suj',colB:'pre',
   words:[{w:'La mitocondria',t:'suj'},{w:'produce la energía',t:'pre'},{w:'Mis primos',t:'suj'},{w:'juegan en la cancha',t:'pre'},{w:'El núcleo de la célula',t:'suj'},{w:'guarda el ADN',t:'pre'},{w:'Doña Marta',t:'suj'},{w:'vende tortillas',t:'pre'},{w:'Los estudiantes de noveno',t:'suj'},{w:'escribieron un ensayo',t:'pre'}]},
  {label:['Oración simple','Oración compuesta'],headA:'1️⃣ Simple: una sola oración',headB:'🔗 Compuesta: dos oraciones unidas',colA:'sim',colB:'com',
   words:[{w:'El hielo se derrite',t:'sim'},{w:'Llovió y se mojó la ropa',t:'com'},{w:'Mi tío maneja un bus',t:'sim'},{w:'Quise ir, pero no pude',t:'com'},{w:'El agua hierve',t:'sim'},{w:'Estudias o descansas',t:'com'},{w:'Las estelas son de piedra',t:'sim'},{w:'No vino ni avisó',t:'com'},{w:'Copán está en Honduras',t:'sim'},{w:'Es tarde, es decir, ya cerraron',t:'com'}]},
];

// ===================== IDENTIFICA =====================
// Se toca UNA palabra: el verbo, el núcleo del sujeto o el complemento
// que dice cuándo, dónde o cómo. Las oraciones de la célula salen de la
// misión La Célula.
const idData=[
  {s:['La','mitocondria','produce','la','energía','de','la','célula.'],c:2,busca:'el verbo'},
  {s:['El','núcleo','guarda','el','ADN.'],c:1,busca:'el núcleo del sujeto (la palabra principal de quien se habla)'},
  {s:['Ayer','mis','primos','pintaron','la','escuela.'],c:0,busca:'la palabra que dice cuándo'},
  {s:['Los','ribosomas','fabrican','las','proteínas.'],c:2,busca:'el verbo'},
  {s:['Mi','hermana','escribe','despacio.'],c:3,busca:'la palabra que dice cómo'},
  {s:['La','maestra','de','Español','revisó','los','borradores.'],c:1,busca:'el núcleo del sujeto (la palabra principal de quien se habla)'},
  {s:['Los','vecinos','se','reunieron','aquí.'],c:4,busca:'la palabra que dice dónde'},
  {s:['La','membrana','controla','el','paso','de','sustancias.'],c:2,busca:'el verbo'},
];

// ===================== COMPLETA =====================
// La conjunción que coordina. La correcta va repartida entre las tres.
const cmpData=[
  {s:'Quería salir a jugar, ___ empezó a llover.',opts:['pero','ni','o'],c:0},
  {s:'¿Vienes con nosotros ___ te quedas en casa?',opts:['y','o','es decir'],c:1},
  {s:'Compré tortillas ___ frijoles para la cena.',opts:['pero','o sea','y'],c:2},
  {s:'El agua pasó de líquido a gas, ___, se evaporó.',opts:['es decir','ni','o'],c:0},
  {s:'No hizo la tarea ___ estudió para el examen.',opts:['o sea','ni','pero'],c:1},
  {s:'Estudió toda la tarde; ___, no terminó el resumen.',opts:['y','o','sin embargo'],c:2},
  {s:'Llegaron Marta ___ Inés a la reunión.',opts:['e','ni','pero'],c:0},
  {s:'¿Prefieres siete ___ ocho páginas para tu informe?',opts:['e','u','ni'],c:1},
];

// ===================== WIDGETS =====================
// Widget 1: ordenar una secuencia
const ordenaData=[
  {label:'Las etapas de escribir un texto',steps:['Planear: tema, propósito y destinatario','Buscar la información y ordenarla en un esquema','Escribir el borrador','Revisar y corregir','Pasar la versión final']},
  {label:'Cómo se escribe un ensayo corto',steps:['Elegir y delimitar el tema','Hacer el esquema: presentación, desarrollo y conclusión','Redactar el ensayo siguiendo el esquema','Revisar el escrito y corregirlo','Elaborar la versión final']},
  {label:'El informe de un experimento, párrafo por párrafo',steps:['Qué queríamos averiguar','Qué materiales usamos','Qué hicimos, paso a paso','Qué observamos','Qué concluimos']},
];
// Widget 2: de la descripción a la etapa
const describeData=[
  {desc:'Keila decide que su nota será para las familias y que debe decir el día, la hora y el aula.',ans:'Planeación',opts:['Planeación','Borrador','Revisión','Versión final']},
  {desc:'Marlon escribe de corrido todo lo que quiere decir, sabiendo que después lo va a cambiar.',ans:'Borrador',opts:['Planeación','Borrador','Revisión','Versión final']},
  {desc:'Dania relee su texto y cambia «los cubo» por «los cubos».',ans:'Revisión',opts:['Planeación','Borrador','Revisión','Versión final']},
  {desc:'Elmer pasa su texto en limpio, con título, márgenes y buena letra.',ans:'Versión final',opts:['Planeación','Borrador','Revisión','Versión final']},
  {desc:'Génesis busca datos sobre el reciclaje y los ordena en un esquema.',ans:'Planeación',opts:['Planeación','Borrador','Revisión','Versión final']},
  {desc:'Un compañero lee el texto de Ana y le dice qué parte no se entiende.',ans:'Revisión',opts:['Planeación','Borrador','Revisión','Versión final']},
  {desc:'Luis compara lo que escribió con el plan que había hecho.',ans:'Revisión',opts:['Planeación','Borrador','Revisión','Versión final']},
  {desc:'Sara se pregunta: «¿para qué voy a escribir esta carta?».',ans:'Planeación',opts:['Planeación','Borrador','Revisión','Versión final']},
];
// Widget 3: de la conjunción a su clase de coordinación
const emparejaData=[
  {term:'y, e, ni',resp:'Copulativa: suma',opts:['Copulativa: suma','Disyuntiva: da a elegir','Adversativa: opone','Explicativa: aclara']},
  {term:'o, u',resp:'Disyuntiva: da a elegir',opts:['Copulativa: suma','Disyuntiva: da a elegir','Adversativa: opone','Explicativa: aclara']},
  {term:'pero, sin embargo, no obstante',resp:'Adversativa: opone',opts:['Copulativa: suma','Disyuntiva: da a elegir','Adversativa: opone','Explicativa: aclara']},
  {term:'es decir, esto es, o sea',resp:'Explicativa: aclara',opts:['Copulativa: suma','Disyuntiva: da a elegir','Adversativa: opone','Explicativa: aclara']},
  {term:'Solo una coma, sin conjunción',resp:'Yuxtaposición: unión directa',opts:['Yuxtaposición: unión directa','Copulativa: suma','Adversativa: opone','Disyuntiva: da a elegir']},
];
// Widget 4: de una oración con una falla a lo que le falla
const situacionData=[
  {term:'«Las flores del patio está secas».',resp:'Concordancia: el verbo va en plural',opts:['Concordancia: el verbo va en plural','Coherencia: habla de otra cosa','Claridad: no se entiende qué es','Nada: está bien escrita']},
  {term:'«Pon eso en la cosa esa de allá».',resp:'Claridad: no se entiende qué es',opts:['Concordancia: el verbo va en plural','Coherencia: habla de otra cosa','Claridad: no se entiende qué es','Nada: está bien escrita']},
  {term:'«El agua hierve y pasa a gas. Mi perro se llama Canelo».',resp:'Coherencia: habla de otra cosa',opts:['Concordancia: el verbo va en plural','Coherencia: habla de otra cosa','Claridad: no se entiende qué es','Nada: está bien escrita']},
  {term:'«Los estudiantes entregaron sus borradores».',resp:'Nada: está bien escrita',opts:['Concordancia: el verbo va en plural','Coherencia: habla de otra cosa','Claridad: no se entiende qué es','Nada: está bien escrita']},
  {term:'«Mis tías llegó de Copán ayer».',resp:'Concordancia: el verbo va en plural',opts:['Concordancia: el verbo va en plural','Coherencia: habla de otra cosa','Claridad: no se entiende qué es','Nada: está bien escrita']},
  {term:'«El que dijo lo del otro día ya hizo aquello».',resp:'Claridad: no se entiende qué es',opts:['Concordancia: el verbo va en plural','Coherencia: habla de otra cosa','Claridad: no se entiende qué es','Nada: está bien escrita']},
];

// ===================== RETO =====================
const retoPairs=[
  {label:['Simple','Compuesta'],btnA:'1️⃣ Simple',btnB:'🔗 Compuesta',colA:'sim',colB:'com',
   words:[{w:'El hielo se derrite',t:'sim'},{w:'Llovió y nos mojamos',t:'com'},{w:'Mi tío maneja un bus',t:'sim'},{w:'Quise ir, pero no pude',t:'com'},{w:'El agua hierve',t:'sim'},{w:'Estudias o descansas',t:'com'},{w:'Copán está en Honduras',t:'sim'},{w:'No vino ni avisó',t:'com'},{w:'La maestra revisó el texto',t:'sim'},{w:'Canta bien, es decir, afina',t:'com'}]},
  {label:['Sujeto','Predicado'],btnA:'👤 Sujeto',btnB:'💬 Predicado',colA:'suj',colB:'pre',
   words:[{w:'La mitocondria',t:'suj'},{w:'produce energía',t:'pre'},{w:'Mis primos',t:'suj'},{w:'juegan pelota',t:'pre'},{w:'El núcleo',t:'suj'},{w:'guarda el ADN',t:'pre'},{w:'Doña Marta',t:'suj'},{w:'vende tortillas',t:'pre'},{w:'Los alumnos',t:'suj'},{w:'escribieron un ensayo',t:'pre'}]},
  {label:['Planear','Revisar'],btnA:'🧭 Planear',btnB:'🔍 Revisar',colA:'plan',colB:'rev',
   words:[{w:'Elegir el tema',t:'plan'},{w:'Corregir una tilde',t:'rev'},{w:'Pensar en el lector',t:'plan'},{w:'Quitar lo repetido',t:'rev'},{w:'Buscar información',t:'plan'},{w:'Comparar con el plan',t:'rev'},{w:'Hacer el esquema',t:'plan'},{w:'Arreglar la concordancia',t:'rev'},{w:'Decidir el formato',t:'plan'},{w:'Consultar el diccionario',t:'rev'}]},
];

// ===================== GENERADOR DE TAREAS =====================
const identifyTaskDB=[
  {s:'La mitocondria produce la energía de la célula.',type:'Sujeto: La mitocondria · Verbo: produce'},
  {s:'Los estudiantes de octavo escribieron un informe.',type:'Sujeto: Los estudiantes de octavo · Verbo: escribieron'},
  {s:'El hielo se derrite con el calor.',type:'Sujeto: El hielo · Verbo: se derrite'},
  {s:'Mañana entregaremos la versión final.',type:'Sujeto tácito (nosotros) · Verbo: entregaremos'},
  {s:'Mi abuela y mi tía venden tortillas en el mercado.',type:'Sujeto compuesto: Mi abuela y mi tía · Verbo: venden'},
  {s:'El núcleo guarda el ADN.',type:'Sujeto: El núcleo · Verbo: guarda'},
  {s:'Las estelas de Copán son de piedra tallada.',type:'Sujeto: Las estelas de Copán · Verbo: son'},
  {s:'Revisé mi borrador con cuidado.',type:'Sujeto tácito (yo) · Verbo: Revisé'},
  {s:'El agua hierve y se evapora.',type:'Sujeto: El agua · Verbos: hierve, se evapora (oración compuesta)'},
  {s:'La maestra leyó nuestros ensayos ayer.',type:'Sujeto: La maestra · Verbo: leyó'},
];
// Las cuatro celdas van en gen, n, g y t porque así las pinta el motor:
// propósito, destinatario, párrafo que más se usa y qué revisar primero.
const classifyTaskDB=[
  {w:'Una nota para avisar a las familias de una reunión',gen:'Informar el día, la hora y el lugar',n:'Las familias del grado',g:'Expositivo',t:'Que no falte ningún dato y que se entienda a la primera'},
  {w:'Un cuento para el periódico mural',gen:'Contar una historia',n:'Los compañeros de la escuela',g:'Narrativo',t:'Que los hechos sigan un orden'},
  {w:'El informe de un experimento de Ciencias',gen:'Explicar qué se hizo y qué se observó',n:'La maestra de Ciencias',g:'Expositivo',t:'El orden de los pasos y la concordancia'},
  {w:'Una carta a la alcaldía para pedir que arreglen la cancha',gen:'Convencer de que hace falta',n:'El alcalde o la alcaldesa',g:'Persuasivo',t:'El trato de usted y que las razones estén claras'},
  {w:'El retrato escrito de tu abuela',gen:'Decir cómo es',n:'Tu familia',g:'Descriptivo',t:'Que los adjetivos concuerden con los sustantivos'},
  {w:'Un afiche para la campaña de limpieza',gen:'Lograr que la gente participe',n:'Los vecinos de la colonia',g:'Persuasivo',t:'Que sea corto y claro'},
  {w:'El procedimiento de una división de decimales',gen:'Explicar los pasos',n:'Un compañero que faltó a clase',g:'Expositivo',t:'Que los pasos estén en orden'},
  {w:'Un ensayo corto sobre una norma del aula',gen:'Dar tu opinión con razones',n:'Tus compañeros y tu maestro',g:'Persuasivo',t:'Que tenga presentación, desarrollo y conclusión'},
];
const completeTaskDB=[
  {s:'Antes de escribir se hace la ___ del texto.',opts:['planeación','versión final','firma'],ans:'planeación'},
  {s:'La primera escritura, que todavía se cambia, es el ___.',opts:['título','borrador','diccionario'],ans:'borrador'},
  {s:'Las ideas que apoyan a la principal son las ideas ___.',opts:['repetidas','finales','secundarias'],ans:'secundarias'},
  {s:'En «Los niños corren» hay ___ entre el sujeto y el verbo.',opts:['concordancia','conjunción','coma'],ans:'concordancia'},
  {s:'«Fui a la tienda ___ compré pan» (las dos ideas se suman).',opts:['pero','y','o'],ans:'y'},
  {s:'«Quiso venir, ___ se enfermó» (las dos ideas se oponen).',opts:['y','ni','pero'],ans:'pero'},
  {s:'El párrafo que busca convencer es el ___.',opts:['persuasivo','narrativo','descriptivo'],ans:'persuasivo'},
  {s:'Un ensayo termina con la ___.',opts:['presentación','conclusión','portada'],ans:'conclusión'},
];
const explainQuestions=[
  {q:'Escribe un párrafo de cinco oraciones sobre algo que sepas hacer bien. Antes, anota tu plan: tema, propósito y destinatario. Después revísalo con esta lista: ¿concuerdan las palabras?, ¿se entiende?, ¿todas las oraciones hablan del tema?, ¿hay algo repetido?',ans:'Se valora que haya plan escrito, un párrafo con una idea principal, y señales de revisión (tachones, cambios). La lista de revisión se marca punto por punto.'},
  {q:'Explica con tus palabras por qué un texto no se escribe «de un tirón». Nombra las etapas.',ans:'Porque primero se planea (tema, propósito, destinatario), luego se escribe un borrador, después se revisa y se corrige, y al final se pasa la versión final. Sin esas etapas el texto sale desordenado y con errores.'},
  {q:'Escribe una oración simple sobre tu comunidad. Luego conviértela en compuesta agregándole otra con «pero» y otra con «y».',ans:'Ejemplo: «Mi colonia es tranquila». Con «pero»: «Mi colonia es tranquila, pero le falta una cancha». Con «y»: «Mi colonia es tranquila y tiene muchos árboles».'},
  {q:'Escoge una norma de convivencia de tu aula y escribe el esquema de un ensayo corto sobre ella: presentación, desarrollo y conclusión.',ans:'Presentación: cuál es la norma y qué opinas de ella. Desarrollo: dos o tres razones con ejemplos. Conclusión: lo que propones.'},
  {q:'Pide a alguien de tu casa que te cuente cómo se hace una comida. Escribe los pasos en un párrafo, revísalo y pásalo en limpio.',ans:'Se valora que los pasos estén en orden, que haya concordancia y que la versión final esté corregida respecto al borrador.'},
];

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['B','O','R','R','A','D','O','R','M','K'],
    ['X','P','L','A','N','Q','W','Z','T','S'],
    ['R','E','V','I','S','I','O','N','E','U'],
    ['H','J','K','L','M','N','B','V','M','J'],
    ['P','A','R','R','A','F','O','C','A','E'],
    ['Z','X','C','V','B','N','M','Q','W','T'],
    ['O','R','A','C','I','O','N','R','T','O'],
    ['Y','U','I','O','P','A','S','D','F','G'],
    ['V','E','R','B','O','H','J','K','L','Z'],
    ['X','C','V','B','N','M','Q','W','E','R']
  ],words:[
    {w:'BORRADOR',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7]]},
    {w:'PLAN',cells:[[1,1],[1,2],[1,3],[1,4]]},
    {w:'REVISION',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]]},
    {w:'TEMA',cells:[[1,8],[2,8],[3,8],[4,8]]},
    {w:'PARRAFO',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]]},
    {w:'SUJETO',cells:[[1,9],[2,9],[3,9],[4,9],[5,9],[6,9]]},
    {w:'ORACION',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6]]},
    {w:'VERBO',cells:[[8,0],[8,1],[8,2],[8,3],[8,4]]}
  ]},
  {size:10,grid:[
    ['C','O','H','E','R','E','N','C','I','A'],
    ['Q','W','Z','R','T','Y','U','P','S','D'],
    ['E','N','S','A','Y','O','F','G','H','I'],
    ['J','K','L','Z','X','C','V','B','N','D'],
    ['E','S','Q','U','E','M','A','M','Q','E'],
    ['W','R','T','Y','P','S','D','F','G','A'],
    ['L','E','C','T','O','R','H','J','K','L'],
    ['Z','X','C','V','B','N','M','Q','W','R'],
    ['F','I','N','A','L','T','Y','P','S','D'],
    ['G','H','J','N','E','X','O','K','L','Z']
  ],words:[
    {w:'COHERENCIA',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
    {w:'ENSAYO',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]]},
    {w:'IDEA',cells:[[2,9],[3,9],[4,9],[5,9]]},
    {w:'ESQUEMA',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]]},
    {w:'LECTOR',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5]]},
    {w:'FINAL',cells:[[8,0],[8,1],[8,2],[8,3],[8,4]]},
    {w:'NEXO',cells:[[9,3],[9,4],[9,5],[9,6]]}
  ]}
];

// ===================== EXAMEN CONCEPTUAL =====================
// UN DATO, UNA PREGUNTA. Cada forma saca cinco de cada banco y pueden caer
// juntas cualesquiera, así que ninguna pregunta pide un dato que otra ya
// pide (su `k` no se repite) y ninguna respuesta aparece escrita en otra
// pregunta, tampoco como opción equivocada. Lo comprueba
// `_dev/verifica-examen-sin-pistas.js`.
//
// ⚠️ Y ninguna la contesta la historia de la nota de Keila, que solo dice
// que a la nota le faltó «lo que hace un escritor antes y después de
// escribir». Por eso ninguna pregunta usa esa nota como ejemplo.
//
// Los términos de los pareados llevan artículo («La revisión») a propósito:
// así la palabra puede usarse en otra pregunta sin que el pareado quede
// contestado. Lo que no se hace es juntar, en otra pregunta, el término con
// las palabras de su definición.
const evalTFBank=[
  {q:'Ordenar las ideas antes de redactar ayuda a que el texto se entienda.',a:true,k:'tf-ordenar-antes',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (esquemas y planes)'},
  {q:'En un párrafo descriptivo abundan los adjetivos.',a:true,k:'tf-adjetivos',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (párrafos descriptivos) · misión Los Tipos de Textos (marcas del texto descriptivo)'},
  {q:'«Las niñas llegó temprano» está bien escrita.',a:false,k:'tf-ninas-llego',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (concordancia) · DCNB p. 151'},
  {q:'Un buen escritor entrega lo primero que le sale, sin volver a leerlo.',a:false,k:'tf-primera-escritura',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (borrador, revisión y versión final)'},
  {q:'Todas las ideas de un párrafo tienen la misma importancia.',a:false,k:'tf-ideas-iguales',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el párrafo) · DCNB p. 123 (idea principal, ideas secundarias)'},
  {q:'Revisar un texto es solo ponerle las tildes que faltan.',a:false,k:'tf-solo-tildes',grado:'7.º a 9.º',curriculo:'DCNB pp. 95, 131 y 171 (revisión: progresión temática, coherencia y cohesión, léxico)'},
  {q:'Un párrafo narrativo sirve, antes que nada, para convencer al lector.',a:false,k:'tf-narrativo-convence',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (párrafos narrativos y persuasivos)'},
  {q:'En «Mi tía cocina», la palabra «cocina» es el verbo.',a:true,k:'tf-cocina',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (la oración gramatical: sujeto, verbo, complemento)'},
  {q:'Antes de escribir conviene pensar para quién será el texto.',a:true,k:'tf-para-quien',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (estándar de escritura: propósito, tema, destinatario)'},
  {q:'La conjunción «pero» une dos oraciones que se oponen.',a:true,k:'tf-pero',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (coordinación adversativa) · DCNB p. 189'}
];
const evalMCBank=[
  {q:'¿Qué se hace primero al escribir un texto?',o:['a) Revisarlo','b) Planearlo','c) Pasarlo en limpio','d) Entregarlo'],a:1,k:'mc-primero',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (planeación de textos)'},
  {q:'¿Cómo se llama la primera escritura de un texto, la que todavía se puede cambiar?',o:['a) El borrador','b) El título','c) El recibo','d) El dictado'],a:0,k:'mc-borrador',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (producción de textos: borrador)'},
  {q:'Al revisar, ¿con qué comparas lo que escribiste para saber si dijiste lo que querías?',o:['a) Con el cuaderno de un compañero','b) Con el periódico de hoy','c) Con el plan que hiciste','d) Con la portada'],a:2,k:'mc-compara-plan',grado:'7.º a 9.º',curriculo:'DCNB pp. 95, 131 y 171 («comparan el texto producido con los planes previos»)'},
  {q:'En un párrafo, ¿cuál es la idea principal?',o:['a) La más larga','b) La que va siempre al final','c) La que lleva más comas','d) La que dice lo más importante'],a:3,k:'mc-idea-principal',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el párrafo; ideas principales y secundarias) · DCNB p. 123'},
  {q:'«El agua puede estar en tres estados: sólido, líquido y gaseoso. Cuando el hielo se derrite, pasa de sólido a líquido». Este párrafo es…',o:['a) expositivo','b) narrativo','c) persuasivo','d) descriptivo'],a:0,k:'mc-expositivo',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (párrafos expositivos) · el dato es de la misión La Materia'},
  {q:'En «Los alumnos escribieron un cuento», ¿cuál es el verbo?',o:['a) alumnos','b) cuento','c) escribieron','d) Los'],a:2,k:'mc-verbo',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (sujeto, verbo, complemento)'},
  {q:'En «Mi hermana vende tajadas en el mercado», ¿de quién se habla?',o:['a) de las tajadas','b) de mi hermana','c) del mercado','d) de quien compra'],a:1,k:'mc-sujeto',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el sujeto) · DCNB p. 151'},
  {q:'Un texto tiene coherencia cuando sus ideas…',o:['a) son muy largas','b) riman entre sí','c) se repiten mucho','d) siguen un orden lógico'],a:3,k:'mc-coherencia',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (coherencia) · DCNB p. 86 («coherencia: orden lógico de ideas»)'},
  {q:'«¿Vas a pie ___ en bus?». ¿Qué conjunción va en el espacio para dar a elegir?',o:['a) o','b) y','c) pero','d) ni'],a:0,k:'mc-o',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (coordinación disyuntiva) · DCNB p. 189'},
  {q:'Al revisar encuentras una frase que se burla de la forma de hablar de un pueblo. ¿Qué haces?',o:['a) La dejas, porque da risa','b) La pones más grande','c) La cambias por una que respete','d) La repites al final'],a:2,k:'mc-sin-burla',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (lenguaje libre de discriminación) · DCNB p. 95'}
];
const evalCPBank=[
  {q:'El plan de un texto, con sus ideas en orden, también se llama ___.',a:'esquema',acc:['esquema'],k:'cp-esquema',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (esquemas y planes)'},
  {q:'En una oración, lo que se dice del sujeto es el ___.',a:'predicado',acc:['predicado'],k:'cp-predicado',grado:'8.º',curriculo:'DCNB p. 151 (oración simple: sujeto y predicado)'},
  {q:'En «Llegamos tarde» no está escrito quién llegó: el sujeto es ___.',a:'tácito',acc:['tácito','tacito'],k:'cp-tacito',grado:'8.º',curriculo:'DCNB p. 151 (sujeto expreso y tácito)'},
  {q:'Cuando el sujeto y el verbo van los dos en singular o los dos en plural, hay ___ entre ellos.',a:'concordancia',acc:['concordancia'],k:'cp-concordancia',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 · DCNB p. 151 (concordancia entre sujeto y predicado)'},
  {q:'Las ideas que apoyan o explican a la idea principal se llaman ideas ___.',a:'secundarias',acc:['secundarias'],k:'cp-secundarias',grado:'8.º',curriculo:'DCNB p. 123 (el párrafo: idea principal, ideas secundarias)'},
  {q:'Las conjunciones «y», «e» y «ni» suman: forman oraciones coordinadas ___.',a:'copulativas',acc:['copulativas'],k:'cp-copulativas',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 · DCNB p. 189 (copulativas: y, e, ni)'},
  {q:'Para comprobar el significado de una palabra mientras revisas, consultas el ___.',a:'diccionario',acc:['diccionario'],k:'cp-diccionario',grado:'7.º a 9.º',curriculo:'DCNB pp. 95, 131 y 171 (revisión: léxico, uso del diccionario)'},
  {q:'Un ensayo se organiza en tres partes: presentación, desarrollo y ___.',a:'conclusión',acc:['conclusión','conclusion'],k:'cp-conclusion',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (el ensayo) · DCNB p. 177 («presentación, desarrollo y conclusión»)'},
  {q:'La persona para quien se escribe un texto es su ___.',a:'destinatario',acc:['destinatario','destinataria'],k:'cp-destinatario',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (estándar: «definiendo el propósito, tema, destinatario»)'},
  {q:'El párrafo que cuenta hechos, uno después de otro, es un párrafo ___.',a:'narrativo',acc:['narrativo'],k:'cp-narrativo',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (párrafos narrativos)'}
];
const evalPRBank=[
  {term:'La planeación',def:'Decidir el tema y pensar en el lector antes de redactar',k:'pr-planeacion',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23'},
  {term:'La revisión',def:'Leer lo escrito para mejorarlo',k:'pr-revision',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 · DCNB p. 95'},
  {term:'El párrafo descriptivo',def:'Dice cómo es una persona, un lugar o una cosa',k:'pr-descriptivo',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7'},
  {term:'El párrafo persuasivo',def:'Da razones para que el lector piense o haga algo',k:'pr-persuasivo',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (persuasivos; el DCNB p. 136 los llama argumentativos)'},
  {term:'La oración simple',def:'Un sujeto con su predicado',k:'pr-simple',grado:'8.º',curriculo:'DCNB p. 151 («oración simple: sujeto y predicado»)'},
  {term:'La oración compuesta',def:'Dos o más oraciones unidas en una',k:'pr-compuesta',grado:'8.º y 9.º',curriculo:'DCNB p. 151 («yuxtaposición o coordinación de dos o más oraciones») · Prog. 7-9, PDF p. 23'},
  {term:'La disyuntiva',def:'«o», «u»: una cosa o la otra',k:'pr-disyuntiva',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 · DCNB p. 189'},
  {term:'La explicativa',def:'«es decir», «o sea»: aclara lo anterior',k:'pr-explicativa',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 · DCNB p. 189'},
  {term:'El ensayo',def:'Escrito libre donde alguien defiende su parecer',k:'pr-ensayo',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 · DCNB p. 176 (tema libre, subjetivismo, «informar sobre una opinión libre»)'},
  {term:'La cohesión',def:'Las partes van enlazadas con conectores',k:'pr-cohesion',grado:'7.º',curriculo:'DCNB p. 111 (condiciones de un texto: cohesión, coherencia; uso de conectores)'}
];

// ══════════ Formas deterministas v1 ══════════
// Las formas 1 a 30 salen de los cuatro bancos de arriba. No se sube este
// número para ofrecer más formas: las 31 a 50 salen del banco grande.
const EVAL_FORMAS = 30;

// ===================== EXAMEN CONCEPTUAL · BANCO GRANDE =====================
// Cuarenta preguntas más, para las formas 31 a 50. Cada una de esas formas
// lleva, por sección, tres de aquí y dos del banco de arriba; las reparte
// el motor (js/motor-misiones.js). Las mismas reglas, y contra los dos
// bancos a la vez: ninguna `k` de aquí repite una de arriba y ninguna
// respuesta, de aquí o de arriba, aparece escrita en otra pregunta.
// ⚠️ Van en arreglos APARTE a propósito: añadir una pregunta a un banco de
// arriba cambiaría las formas 1 a 30.
const evalTFBankNuevo=[
  {q:'Pedir a un compañero que lea tu borrador ayuda a mejorarlo.',a:true,k:'tf-otro-lector',fuente:'Guía (Aprende): Después del borrador: revisar · Ficha, página 2 (3. Después del borrador: revisar)',grado:'7.º a 9.º',curriculo:'DCNB pp. 95, 131 y 171 («incorporan los cambios sugeridos por otros lectores»)'},
  {q:'La versión final solo vale si se escribe a mano.',a:false,k:'tf-a-mano',fuente:'Ficha, página 1 (1. Escribir tiene etapas) · Actividad Tarjetas: Versión final',grado:'7.º a 9.º',curriculo:'DCNB pp. 95, 132 y 171 («la versión final… preferiblemente en computador»)'},
  {q:'En «Las gallinas come maíz» el verbo debería ir en plural.',a:true,k:'tf-gallinas-come',fuente:'Guía (Aprende): La oración (la concordancia) · Ficha, página 2 (3. Después del borrador: revisar)',grado:'8.º',curriculo:'DCNB p. 151 (concordancia entre sujeto y predicado)'},
  {q:'Una nota para tu abuela y un informe para el director se escriben con las mismas palabras.',a:false,k:'tf-mismas-palabras',fuente:'Guía (Aprende): Antes de escribir: planear · Actividad Tarjetas: Destinatario',grado:'7.º a 9.º',curriculo:'DCNB p. 95 (adecuar el léxico al tema, al receptor y al propósito)'},
  {q:'Un ensayo se escribe sin esquema, como vaya saliendo.',a:false,k:'tf-ensayo-sin-esquema',fuente:'Guía (Aprende): El ensayo corto · Ficha, página 3 (7. El ensayo corto)',grado:'9.º',curriculo:'DCNB p. 177 («planifican previamente el escrito… y elaboran el esquema»)'},
  {q:'Un párrafo expositivo explica un tema con datos.',a:true,k:'tf-expositivo-datos',fuente:'Guía (Aprende): Cuatro tipos de párrafo · Ficha, página 2 (4. El párrafo)',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (párrafos expositivos)'},
  {q:'Una carta y un afiche sobre el mismo asunto pueden decir lo mismo con distinta forma.',a:true,k:'tf-carta-afiche',fuente:'Guía (Aprende): Antes de escribir: planear · Ficha, página 1 (2. Antes de escribir: planear)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (estándar: tipo y formato del texto)'},
  {q:'Mientras escribes conviene releer lo que llevas para no perder el hilo.',a:true,k:'tf-releer',fuente:'Ficha, página 1 (2. Antes de escribir: planear) · Actividad Tarjetas: Borrador',grado:'7.º a 9.º',curriculo:'DCNB pp. 95, 131 y 171 (control del sentido «a través de la lectura y la relectura»)'},
  {q:'«Sin embargo» sirve para sumar una idea parecida a la anterior.',a:false,k:'tf-sin-embargo',fuente:'Guía (Aprende): Dos oraciones en una: la coordinación · Actividad Completa 6',grado:'9.º',curriculo:'DCNB p. 189 (adversativas: pero, sin embargo, no obstante)'},
  {q:'En «Ana canta y Luis baila» hay una sola oración simple.',a:false,k:'tf-ana-luis',fuente:'Guía (Aprende): Dos oraciones en una: la coordinación · Ficha, página 3 (6. Dos oraciones en una: la coordinación)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (oraciones compuestas por coordinación)'}
];
const evalMCBankNuevo=[
  {q:'«Estudié mucho, ___ no pude terminar el examen». ¿Qué va en el espacio?',o:['a) o','b) ni','c) pero','d) es decir'],a:2,k:'mc-pero-examen',fuente:'Guía (Aprende): Dos oraciones en una: la coordinación · Actividad Completa 1',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (coordinación adversativa)'},
  {q:'El programa de 10.º dice que escribir es un proceso de tres pasos: planificación, ejecución y…',o:['a) impresión','b) dictado','c) portada','d) revisión'],a:3,k:'mc-media-proceso',fuente:'Guía (Aprende): Después del borrador: revisar (Para Media) · Ficha, página 2 (Para Media)',grado:'Media',curriculo:'CNB de 10.º, CE2.5 («la escritura como proceso: planificación, ejecución y revisión»)'},
  {q:'En «El perro negro de mi vecino ladra toda la noche», ¿cuál es la palabra principal del sujeto?',o:['a) negro','b) vecino','c) noche','d) perro'],a:3,k:'mc-nucleo',fuente:'Actividad Identifica 2 y 6',grado:'9.º',curriculo:'DCNB p. 189 (núcleo del sujeto)'},
  {q:'En «Mañana entregaremos el informe», ¿qué palabra dice cuándo?',o:['a) Mañana','b) entregaremos','c) el','d) informe'],a:0,k:'mc-cuando',fuente:'Guía (Aprende): La oración: sujeto, verbo y complemento · Actividad Identifica 3',grado:'8.º',curriculo:'DCNB p. 151 (complemento circunstancial de tiempo)'},
  {q:'Notas que dos oraciones de tu párrafo dicen exactamente lo mismo. ¿Qué haces?',o:['a) Dejas las dos','b) Las copias otra vez','c) Quitas una','d) Agregas una tercera igual'],a:2,k:'mc-repetida',fuente:'Guía (Aprende): Después del borrador: revisar · Actividad Laboratorio: El experimento, falla 2',grado:'7.º a 9.º',curriculo:'DCNB p. 95 (revisión del texto: progresión temática)'},
  {q:'Un párrafo habla de los ríos de Honduras y de pronto dice «mi comida favorita es el pollo». ¿Qué le falla?',o:['a) La letra','b) La coherencia','c) El título','d) La fecha'],a:1,k:'mc-rios-pollo',fuente:'Guía (Aprende): El párrafo y su idea principal · Actividad Laboratorio: Copán, falla 2',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (coherencia) · DCNB p. 95 (progresión temática)'},
  {q:'¿Con qué se empieza a preparar un ensayo?',o:['a) Con la firma','b) Se elige y se delimita el tema','c) Con el dibujo de la portada','d) Se pasa en limpio'],a:1,k:'mc-ensayo-empieza',fuente:'Guía (Aprende): El ensayo corto · Actividad Secuencia: Cómo se escribe un ensayo corto',grado:'9.º',curriculo:'DCNB p. 177 («eligen y delimitan un tema»)'},
  {q:'«Pon eso en la cosa esa». A esta oración le falta…',o:['a) rima','b) mayúsculas','c) tamaño','d) claridad'],a:3,k:'mc-claridad',fuente:'Actividad «¿Qué le falla a esta oración?» 2 · Ficha, página 2 (3. Después del borrador: revisar)',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (claridad)'},
  {q:'Antes de escribir sobre Copán tienes muchos datos sueltos. ¿Qué haces con ellos?',o:['a) Los juntas en grupos parecidos','b) Los copias como vengan','c) Los escondes','d) Los escribes todos en una sola oración'],a:0,k:'mc-datos-sueltos',fuente:'Guía (Aprende): Antes de escribir: planear · Ficha, página 1 (2. Antes de escribir: planear)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (organización de la información) · DCNB p. 95 («temas y subtemas»)'},
  {q:'¿Cuál de estas oraciones es compuesta?',o:['a) El bus llegó tarde','b) Llovió toda la noche y el río creció','c) Mi abuela cocina frijoles','d) Las estelas son de piedra'],a:1,k:'mc-cual-compuesta',fuente:'Actividad Clasifica: Oración compuesta · Actividad Reto: Compuesta',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (oraciones compuestas por coordinación)'}
];
const evalCPBankNuevo=[
  {q:'Dos oraciones unidas solo por una coma, sin conjunción, están ___.',a:'yuxtapuestas',acc:['yuxtapuestas'],k:'cp-yuxtapuestas',fuente:'Guía (Aprende): Dos oraciones en una: la coordinación · Ficha, página 3 (6. Dos oraciones en una: la coordinación)',grado:'9.º',curriculo:'DCNB p. 189 (yuxtaposición: «unión directa»)'},
  {q:'«Pero» y «no obstante» forman oraciones coordinadas ___.',a:'adversativas',acc:['adversativas'],k:'cp-adversativas',fuente:'Guía (Aprende): Dos oraciones en una: la coordinación · Actividad «Empareja: conjunción y clase de coordinación» 3',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 · DCNB p. 189'},
  {q:'En «Llegaron ayer», la palabra «ayer» es un complemento ___ de tiempo.',a:'circunstancial',acc:['circunstancial'],k:'cp-circunstancial',fuente:'Guía (Aprende): La oración: sujeto, verbo y complemento · Ficha, página 3 (5. La oración)',grado:'8.º',curriculo:'DCNB p. 151 (modificadores del predicado: complemento circunstancial)'},
  {q:'En «los libro» el artículo y el sustantivo no van de acuerdo en ___.',a:'número',acc:['número','numero'],k:'cp-numero',fuente:'Guía (Aprende): La oración (la concordancia) · Actividad Tarjetas: Concordancia',grado:'8.º',curriculo:'DCNB p. 151 (concordancia entre sustantivo y artículo: género y número)'},
  {q:'En «Carlos madrugó» sí está escrito de quién se habla: el sujeto es ___.',a:'expreso',acc:['expreso'],k:'cp-expreso',fuente:'Guía (Aprende): La oración: sujeto, verbo y complemento · Ficha, página 3 (5. La oración)',grado:'8.º',curriculo:'DCNB p. 151 (sujeto expreso y tácito)'},
  {q:'En «la casa blanco» el adjetivo no va de acuerdo con el sustantivo en ___.',a:'género',acc:['género','genero'],k:'cp-genero',fuente:'Guía (Aprende): La oración (la concordancia) · Ficha, página 2 (3. Después del borrador: revisar)',grado:'8.º',curriculo:'DCNB p. 151 (concordancia entre sustantivo y adjetivo: género y número)'},
  {q:'«Ana y Luis estudian» habla de dos personas: su sujeto es ___.',a:'compuesto',acc:['compuesto'],k:'cp-compuesto',fuente:'Guía (Aprende): La oración: sujeto, verbo y complemento · Actividad Tareas: Identificar 5',grado:'8.º',curriculo:'DCNB p. 151 (sujeto simple y compuesto)'},
  {q:'Después de elegir de qué vas a escribir, buscas y organizas la ___.',a:'información',acc:['información','informacion'],k:'cp-informacion',fuente:'Guía (Aprende): Antes de escribir: planear · Actividad Tarjetas: Planeación',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 («búsqueda y organización de la información»)'},
  {q:'Un párrafo se cierra con punto y ___.',a:'aparte',acc:['aparte'],k:'cp-aparte',fuente:'Guía (Aprende): El párrafo y su idea principal · Ficha, página 2 (4. El párrafo)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el párrafo) · programación de 1.º a 6.º («la demarcación gráfica del párrafo: el punto y aparte»)'},
  {q:'En «Vive cerca», la palabra «cerca» responde a la pregunta «¿ ___ ?».',a:'dónde',acc:['dónde','donde'],k:'cp-donde',fuente:'Guía (Aprende): La oración: sujeto, verbo y complemento · Actividad Identifica 7',grado:'8.º',curriculo:'DCNB p. 151 (complemento circunstancial) · programación de 1.º a 6.º (circunstancial de lugar, tiempo y modo)'}
];
const evalPRBankNuevo=[
  {term:'El propósito',def:'Para qué se escribe',k:'pr-proposito',fuente:'Guía (Aprende): Antes de escribir: planear · Actividad Tarjetas: Propósito',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (estándar de escritura)'},
  {term:'El formato',def:'La forma que tendrá: carta, afiche, informe',k:'pr-formato',fuente:'Guía (Aprende): Antes de escribir: planear · Ficha, página 1 (2. Antes de escribir: planear)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (estándar: tipo y formato del texto)'},
  {term:'La claridad',def:'Se entiende a la primera lectura',k:'pr-claridad',fuente:'Guía (Aprende): Después del borrador: revisar · Ficha, página 2 (3. Después del borrador: revisar)',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 · DCNB p. 86'},
  {term:'La corrección',def:'Respeta la ortografía y la gramática',k:'pr-correccion',fuente:'Guía (Aprende): Después del borrador: revisar · Ficha, página 2 (3. Después del borrador: revisar)',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (corrección; normas de la gramática, caligrafía y puntuación)'},
  {term:'La versión final',def:'Lo escrito ya corregido y pasado en limpio',k:'pr-version-final',fuente:'Guía (Aprende): Escribir tiene etapas · Actividad Tarjetas: Versión final',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23'},
  {term:'El sujeto',def:'De quién o de qué se habla',k:'pr-sujeto',fuente:'Guía (Aprende): La oración: sujeto, verbo y complemento · Ficha, página 3 (5. La oración)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 · DCNB de II ciclo («¿de quién o de qué se habla?»)'},
  {term:'El verbo',def:'El centro del predicado',k:'pr-verbo',fuente:'Guía (Aprende): La oración: sujeto, verbo y complemento · Actividad Tarjetas: Oración',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 · DCNB p. 189 (núcleo del predicado)'},
  {term:'El complemento',def:'Acompaña al verbo y completa lo que dice',k:'pr-complemento',fuente:'Guía (Aprende): La oración: sujeto, verbo y complemento · Ficha, página 3 (5. La oración)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (sujeto, verbo, complemento) · DCNB p. 151 (modificadores del predicado)'},
  {term:'La coordinación',def:'Une oraciones del mismo nivel con una conjunción',k:'pr-coordinacion',fuente:'Guía (Aprende): Dos oraciones en una: la coordinación · Actividad Tarjetas: Coordinación',grado:'9.º',curriculo:'DCNB p. 189 («oraciones coordinadas (con el mismo nivel sintáctico)»)'},
  {term:'El asunto',def:'De qué trata lo que se escribe',k:'pr-asunto',fuente:'Guía (Aprende): Antes de escribir: planear · Ficha, página 1 (2. Antes de escribir: planear)',grado:'7.º a 9.º',curriculo:'DCNB pp. 95, 131 y 171 («¿qué? (asunto)»)'}
];

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
// Veinte casos, con los apartados de la plantilla: caso 2, error 2,
// decisión 2, comparación 2, causa 5 (saca 2) y efecto 7 (saca 3).
// Las mismas cuatro preguntas del caso valen para los dos borradores: por
// eso los dos tienen la misma hechura (un error de concordancia, una
// oración que habla de otra cosa y ninguna señal de plan).
// Las pautas van sin palabras en MAYÚSCULAS y sin números a propósito: la
// sonda de pistas toma por respuesta lo que la pauta escribe así.
const critTextos={
  caso:'Caso de análisis: un borrador',
  decision:'Toma de decisiones: antes y después de escribir',
  decisionPregunta:'¿Qué le recomendarías hacer antes de escribir y después de terminar? Explica por qué, nombrando las etapas de la escritura.',
  decisionPreguntaHoja:'¿Qué le recomendarías hacer antes de escribir y después de terminar? Nombra las etapas.',
  comparacionPregunta:'1. ¿Qué tipo de párrafo es cada uno? 2. ¿En qué lo notas? 3. ¿Para qué sirve cada uno?'
};
const critCaseBank=[
  {k:'ca-hielo',txt:'Dania escribió esto sobre su experimento y lo va a entregar así: «El hielo son sólido. Al calentarlo se derrite y pasa a líquido. Mi primo tiene una bicicleta roja. Después el agua hierve y se evapora».'},
  {k:'ca-copan',txt:'Elmer escribió esto para Ciencias Sociales y lo va a entregar así: «Copán fue una ciudad maya de Honduras. Sus estelas es de piedra tallada. Anoche cené baleadas. Hoy Copán es un parque arqueológico».'},
];
const critCaseQuestions=[
  '1. ¿En qué etapa de la escritura está este texto? ¿En qué lo notas?',
  '2. Señala el error de concordancia y corrígelo.',
  '3. ¿Qué oración no pertenece al párrafo? ¿Por qué?',
  '4. ¿Qué debe hacer quien lo escribió antes de entregarlo?',
];
const critCaseGuides=[
  'Es un borrador: todavía tiene errores y nadie lo ha revisado.',
  'El verbo está en un número y su sujeto en otro: se corrige poniendo los dos en singular o los dos en plural.',
  'La que habla de algo que no tiene que ver con el tema: rompe la coherencia del párrafo.',
  'Revisarlo: corregir la concordancia, quitar lo que no va y pasar la versión final.',
];
const critErrorBank=[
  {k:'er-etapas',txt:'"Para escribir bien hay que empezar por pasarlo en limpio y dejar el plan para lo último. Revisar un texto es solo ponerle tildes".',
   g1:'se empieza por el plan; pasarlo en limpio es lo último.',
   g2:'revisar es también mirar la concordancia, la claridad y la coherencia.'},
  {k:'er-oracion',txt:'"En «Los niños juegan en el patio», el sujeto es «juegan» y el verbo es «patio». Además, «y» sirve para oponer dos ideas".',
   g1:'se habla de «los niños»: ese es el sujeto, y el verbo es «juegan».',
   g2:'«y» suma; la que opone es «pero».'},
];
const critDecisionBank=[
  'Marlon tiene que escribir para mañana un informe sobre el reciclaje en su colonia. Piensa sentarse y escribirlo de un tirón, sin apuntes, y entregarlo tal como salga.',
  'Génesis va a escribir una carta para pedir a la alcaldía que arreglen la cancha. Dice que no hace falta pensar a quién va dirigida ni leerla después de escribirla.',
];
const critDecisionGuide='Antes: planear (tema, propósito, destinatario y formato), buscar la información y ordenarla en un esquema. Después del borrador: revisar la concordancia, la claridad y la coherencia, corregir y pasar la versión final. Un texto escrito de un tirón suele salir desordenado y con errores, y si no se piensa en quien lo va a leer, el trato y las palabras no le quedan.';
const critCompareBank=[
  {k:'co-volcan',a:'«El volcán es alto, de laderas verdes y cumbre nublada».',b:'«Ayer subimos al volcán, nos llovió en el camino y bajamos de noche».',
   ga:'descriptivo: dice cómo es, con adjetivos.',
   gb:'narrativo: cuenta lo que pasó, en orden.',
   gr:'No son lo mismo: el primero pinta algo quieto y el segundo cuenta hechos, uno después de otro.'},
  {k:'co-quebrada',a:'«Al hervir, el agua pasa de líquido a gas: eso se llama evaporación».',b:'«Cuidemos la quebrada, porque de ella bebe toda la aldea».',
   ga:'expositivo: explica un dato sin opinar.',
   gb:'persuasivo: pide algo y da una razón.',
   gr:'No son lo mismo: el primero informa y el segundo quiere convencer.'},
];
const critCauseBank=[
  {k:'cau-sin-leer',cause:'Un alumno entrega lo que escribió sin leerlo ni una vez.',guide:'Llega con fallas que una revisión habría quitado.'},
  {k:'cau-sin-destinatario',cause:'Alguien redacta una solicitud sin pensar en quién la recibirá.',guide:'El trato no le queda al destinatario: demasiado confianzudo o demasiado difícil.'},
  {k:'cau-tres-temas',cause:'En un mismo párrafo se mezclan tres asuntos distintos.',guide:'Pierde la coherencia y no se sabe cuál es su idea principal.'},
  {k:'cau-pero-suma',cause:'Se pone «pero» entre dos ideas que en realidad se suman.',guide:'Quien lee espera un contraste que no existe y se confunde.'},
  {k:'cau-esquema',cause:'Una autora ordena sus datos en un esquema antes de redactar.',guide:'Le sale un escrito ordenado y le cuesta menos hacerlo.'},
];
const critEffectBank=[
  {k:'ef-aviso',effect:'Nadie entendió el aviso pegado en la pulpería.',guide:'Se escribió sin claridad: frases enredadas o palabras que no dicen nada.'},
  {k:'ef-arboles',effect:'La maestra marcó «Los árboles es altos».',guide:'Falla la concordancia: «árboles» va en plural y «es», en singular.'},
  {k:'ef-sin-cierre',effect:'Un ensayo termina de golpe, sin cierre.',guide:'Le falta la conclusión, la última parte de su esquema.'},
  {k:'ef-dos-en-una',effect:'Dos oraciones cortas quedaron unidas en una sola con «y».',guide:'Se coordinaron: la conjunción las sumó en una oración compuesta.'},
  {k:'ef-segunda',effect:'El informe salió mucho mejor la segunda vez que se escribió.',guide:'Entre una y otra hubo revisión: se releyó y se corrigió.'},
  {k:'ef-abuelo',effect:'El abuelo no pudo leer la nota: letra apretada, sin puntos ni espacios.',guide:'No se cuidó la presentación al pasarla en limpio.'},
  {k:'ef-dos-veces',effect:'La misma idea aparece escrita dos veces seguidas.',guide:'Al releer se habría notado y quitado la repetida.'},
];

// ===================== LABORATORIO: LA MESA DE REVISIÓN =====================
// Tres borradores con tres fallas cada uno: una de concordancia, una idea
// que no va o que se repite, y dos oraciones que piden coordinarse. El
// alumno arregla cada falla eligiendo entre tres opciones y al final ve el
// texto rehecho. `antes` es el trozo con la falla, tal como se ve en el
// borrador; la opción con `ok` es la que lo arregla, y `por` es lo que se
// le dice al elegirla. Los datos de cada texto salen de las misiones que
// nombra la cabecera de este archivo; los minutos del primer borrador son
// inventados para el ejercicio, y el texto lo dice.
const mesaRevision=[
  {id:'hielo',icono:'🧊',titulo:'Informe de un experimento',materia:'Ciencias Naturales',
   contexto:'Dania escribió el borrador de su informe sobre los estados de la materia. Va a entregarlo mañana. (Los minutos son inventados para el ejercicio.)',
   fallas:[
     {tipo:'Concordancia',antes:'Los cubos de hielo se derritió en doce minutos.',pregunta:'El sujeto está en plural. ¿Cómo queda bien?',
      opciones:[
        {t:'Los cubos de hielo se derritieron en doce minutos.',ok:true,por:'Sujeto y verbo en plural: «los cubos… se derritieron».'},
        {t:'Los cubo de hielo se derritió en doce minutos.',ok:false,por:'Ahora no concuerdan «los» y «cubo»: el artículo va en plural y el sustantivo en singular.'},
        {t:'Los cubos de hielo se derrite en doce minutos.',ok:false,por:'El verbo sigue en singular y el sujeto en plural.'}]},
     {tipo:'Idea repetida',antes:'El hielo pasó de sólido a líquido. El hielo, que era sólido, se hizo líquido.',pregunta:'Las dos oraciones dicen lo mismo. ¿Qué haces?',
      opciones:[
        {t:'Dejo las dos, para que se entienda mejor.',ok:false,por:'Repetir la misma idea no la explica mejor: alarga el párrafo y cansa a quien lee.'},
        {t:'Dejo una sola: «El hielo pasó de sólido a líquido: eso se llama fusión».',ok:true,por:'Una sola oración dice la idea, y además le pones su nombre: fusión.'},
        {t:'Agrego una tercera: «O sea, se derritió el hielo sólido».',ok:false,por:'Ya serían tres veces la misma idea.'}]},
     {tipo:'Coordinación',antes:'Después calentamos el agua. El agua empezó a evaporarse.',pregunta:'Son dos oraciones cortas que van juntas. ¿Con qué las unes?',
      opciones:[
        {t:'Después calentamos el agua, pero empezó a evaporarse.',ok:false,por:'«Pero» opone, y aquí la segunda idea no contradice a la primera: es lo que sigue.'},
        {t:'Después calentamos el agua o empezó a evaporarse.',ok:false,por:'«O» da a elegir entre dos cosas, y aquí pasaron las dos.'},
        {t:'Después calentamos el agua y empezó a evaporarse.',ok:true,por:'«Y» suma: es una coordinación copulativa.'}]}
   ],
   final:'Los cubos de hielo se derritieron en doce minutos. El hielo pasó de sólido a líquido: eso se llama fusión. Después calentamos el agua y empezó a evaporarse.'},
  {id:'division',icono:'➗',titulo:'Explicar una división',materia:'Matemáticas',
   contexto:'Luis le explica por escrito a un compañero que faltó cómo se divide 1.5 entre 0.3.',
   fallas:[
     {tipo:'Claridad',antes:'Primero se mueve la cosa esa para la derecha.',pregunta:'«La cosa esa» no dice nada. ¿Cómo queda claro?',
      opciones:[
        {t:'Primero se mueve el punto decimal del divisor un espacio a la derecha.',ok:true,por:'Ahora dice qué se mueve, de cuál número y cuánto.'},
        {t:'Primero se mueve aquello que ya sabes.',ok:false,por:'Sigue sin decir qué se mueve: el compañero faltó, no lo sabe.'},
        {t:'Primero se mueve eso, lo de siempre.',ok:false,por:'«Eso» y «lo de siempre» son tan vagos como «la cosa esa».'}]},
     {tipo:'Coherencia (el orden)',antes:'Al final da 5. Luego se mueve también el punto del dividendo. Entonces queda 15 entre 3.',pregunta:'Los pasos están revueltos. ¿Cuál es el orden?',
      opciones:[
        {t:'Entonces queda 15 entre 3. Al final da 5. Luego se mueve el punto del dividendo.',ok:false,por:'No puede quedar 15 entre 3 antes de mover el punto del dividendo.'},
        {t:'Luego se mueve también el punto del dividendo. Entonces queda 15 entre 3. Al final da 5.',ok:true,por:'Primero se mueve el punto, después queda la división nueva y al final se da el resultado.'},
        {t:'Al final da 5. Entonces queda 15 entre 3. Luego se mueve el punto del dividendo.',ok:false,por:'El resultado no va al principio: es lo último.'}]},
     {tipo:'Coordinación',antes:'Mover el punto parece trampa. No cambia el resultado.',pregunta:'La segunda idea se opone a la primera. ¿Con qué las unes?',
      opciones:[
        {t:'Mover el punto parece trampa y no cambia el resultado.',ok:false,por:'«Y» suma, y aquí la segunda idea le lleva la contraria a la primera.'},
        {t:'Mover el punto parece trampa, pero no cambia el resultado.',ok:true,por:'«Pero» opone: es una coordinación adversativa.'},
        {t:'Mover el punto parece trampa o no cambia el resultado.',ok:false,por:'«O» da a elegir, y aquí las dos cosas son ciertas a la vez.'}]}
   ],
   final:'Primero se mueve el punto decimal del divisor un espacio a la derecha. Luego se mueve también el punto del dividendo. Entonces queda 15 entre 3. Al final da 5. Mover el punto parece trampa, pero no cambia el resultado.'},
  {id:'copan',icono:'🗿',titulo:'Un párrafo sobre Copán',materia:'Ciencias Sociales',
   contexto:'Elmer escribió un párrafo expositivo sobre Copán para el periódico mural.',
   fallas:[
     {tipo:'Concordancia',antes:'Las estelas de Copán es monumentos de piedra tallado.',pregunta:'Hay dos palabras que no van de acuerdo con las demás. ¿Cómo queda bien?',
      opciones:[
        {t:'Las estelas de Copán es monumentos de piedra tallada.',ok:false,por:'Arreglaste «tallada», pero el verbo sigue en singular.'},
        {t:'Las estelas de Copán son monumentos de piedra tallado.',ok:false,por:'Arreglaste el verbo, pero «tallado» no concuerda con «piedra».'},
        {t:'Las estelas de Copán son monumentos de piedra tallada.',ok:true,por:'«Las estelas… son» (plural) y «piedra tallada» (femenino).'}]},
     {tipo:'Coherencia (la idea que no va)',antes:'Los mayas contaban de veinte en veinte, con puntos y barras. A mi hermano le gusta el fútbol. Hoy Copán es un parque arqueológico.',pregunta:'Una oración no tiene que ver con el tema. ¿Cuál quitas?',
      opciones:[
        {t:'«A mi hermano le gusta el fútbol».',ok:true,por:'No habla de Copán ni de los mayas: rompe la coherencia del párrafo.'},
        {t:'«Los mayas contaban de veinte en veinte, con puntos y barras».',ok:false,por:'Esa sí habla del tema: es un dato de los mayas.'},
        {t:'«Hoy Copán es un parque arqueológico».',ok:false,por:'Esa sí habla del tema: dice qué es Copán hoy.'}]},
     {tipo:'Coordinación',antes:'Quiero conocer Copán. Quiero ver sus estelas de cerca.',pregunta:'Quieres unir las dos oraciones para que la lectura corra. ¿Cuál sirve?',
      opciones:[
        {t:'Quiero conocer Copán, o sea, ver sus estelas de cerca.',ok:false,por:'«O sea» aclara lo anterior, y aquí la segunda idea no aclara la primera: le agrega otra cosa.'},
        {t:'Quiero conocer Copán y ver sus estelas de cerca.',ok:true,por:'«Y» suma una cosa a la otra: coordinación copulativa.'},
        {t:'Quiero conocer Copán ni ver sus estelas de cerca.',ok:false,por:'«Ni» suma dos negaciones, y aquí no se niega nada.'}]}
   ],
   final:'Las estelas de Copán son monumentos de piedra tallada. Los mayas contaban de veinte en veinte, con puntos y barras. Hoy Copán es un parque arqueológico. Quiero conocer Copán y ver sus estelas de cerca.'}
];
