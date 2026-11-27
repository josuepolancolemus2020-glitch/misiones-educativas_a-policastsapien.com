/* ============================================================
   M.E.T.A.S · Misión Las palabras y sus significados · CONTENIDO
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
     (decisión de Josué; la página dice «III Ciclo»). Pasarán a Recursos
     en la tanda 4.

   ► DE DÓNDE SALE CADA COSA (todo está en `_dev/`):
     · Prog. 7-9 = `_dev/dcnb-pdf/programacion-espanol-7-9.pdf`, la
       programación mensual de SEDUC. Febrero y marzo:
       7.º, p. 7 del PDF: «Sinónimos y antónimos» (lengua oral y
       escritura); «Relación léxica: sinónimos, antónimos. Uso del
       diccionario. Vocabulario técnico. Regionalismos»; «Diferencias
       entre lenguaje literario y no literario. Usos. Denotación y
       connotación».
       8.º, p. 15: «El contexto: sinónimos, antónimos»; «Uso de
       diccionarios especializados»; «Vocabulario técnico y científico»;
       «Denotación y connotación. Diferencias entre lenguaje literario y
       no literario. Usos».
       9.º, p. 23: «Prefijos, sufijos»; «El contexto. Uso de diccionarios
       especializados. Sinónimos y antónimos»; «Lenguaje técnico.
       Neologismos. Polisemia. Siglas y acrónimos»; «Denotación y
       connotación. Importancia. Uso».
       El estándar de lectura de 7.º y de 8.º ya pide interpretar
       «términos técnicos, lenguaje no-estándar, palabras con múltiples
       significados, acrónimos y siglas» (pp. 7 y 15): por eso la
       polisemia y las siglas no son ajenas a esos grados, aunque el
       contenido con ese nombre esté en la página de 9.º.
     · DCNB = `_dev/dcnb-pdf/dcneb-basica-iii-ciclo.pdf` (página del
       visor). p. 86 (y 118 y 160): niveles de uso de la lengua, con los
       regionalismos entre las formas orales y lo científico/técnico y lo
       literario entre las escritas; «Respeto hacia las diferentes formas
       de lengua utilizadas por los miembros de la comunidad». pp. 88, 121
       y 162: para entender un texto «hacen uso del diccionario» u
       observan «el contexto lingüístico, es decir, el sentido de la frase
       en que está ubicada la palabra». pp. 91, 124 y 165: textos de
       consulta (el diccionario, el diccionario de sinónimos y antónimos,
       la enciclopedia; en la p. 124, los diccionarios especializados)
       «para asegurarse del uso apropiado de los términos desconocidos».
       pp. 106, 143 y 180: en los textos líricos predomina el valor
       connotativo del lenguaje. pp. 108, 146 y 183: «Identifican el valor
       denotativo de la lengua en los textos expositivos y su valor
       connotativo en los textos literarios»; «Reconocen el valor
       connotativo de algunas expresiones en la comunicación cotidiana».
       p. 113 (7.º): proceso en la formación de palabras (lexema y
       morfema, derivación, composición, prefijos latinos, sufijos), «la
       función de modificar el significado de las palabras» y «Comprueban
       la existencia y adecuación de las palabras creadas consultando el
       diccionario». pp. 153 y 154 (8.º): «el elemento que no varía,
       manteniéndose siempre fijo (lexema o raíz) y el elemento que
       modifica su función o significado (morfema)»; prefijos griegos.
       p. 191 (9.º): prefijos latinos, sufijos «(on, ona, ito, ante)» y
       prefijos griegos.
     · Para Media: `_dev/dcnb/programa-espanol-10.md` (prefijos y sufijos
       grecolatinos; sinónimos, antónimos, parónimos, homónimos,
       homófonas), el CNB de 10.º (relaciones semánticas; formación de
       palabras) y `_dev/dcnb/programa-espanol-11-bch.md` (lenguaje
       denotativo; neologismos: acrónimos y abreviaturas; arcaísmos,
       americanismos, regionalismos). Solo nombres.

   ► LOS CRUCES CON OTRAS MATERIAS, y de dónde sale su dato:
     · Ciencias Naturales: «ecosistema», «abiótico» (sin vida),
       «productores» y «fotosíntesis» como vocabulario técnico; el
       manglar («bosque costero» de mangles que viven con las raíces en
       agua salada) y la frase «las guarderías del mar», con su porqué
       (muchos peces nacen y crecen protegidos entre sus raíces). Todo,
       de la misión de los ecosistemas (misiones/2y3ciclo-ecosistemas/).
     · Matemáticas: «raíz» como palabra con varios significados; que la
       raíz cuadrada de 196 es 14 lo acredita la misión de las potencias
       (misiones/2ciclo-potencias-raices/). «Cociente» y «residuo» son
       los términos de la división que ya usa la misión de la
       conversación (misiones/3ciclo-n1-conversacion/).
     · Cívica y Ciencias Naturales: la sigla COPECO, Comisión Permanente
       de Contingencias, y los colores de la alerta, de la misión de los
       desastres naturales (misiones/2y3ciclo-desastres-naturales/).
     · Tecnología: «red neuronal» («muchas cuentas pequeñas en capas… No
       es un cerebro») y «alucinación», de `js/data/ia-conceptos.js`.
     · Cívica: el verso «Tu bandera es un lampo de cielo» y el
       significado de «lampo» (resplandor, destello de luz), de
       `js/data/himno.js`.
     · Las demás siglas: ONU, Organización de las Naciones Unidas (así
       la escribe el DCNB de II ciclo, Ciencias Sociales de 6.º); UNAH,
       Universidad Nacional Autónoma de Honduras
       (misiones/docente-ley-fundamental-aula/); IHSS, Instituto
       Hondureño de Seguridad Social (misiones/docente-estatuto-derechos/);
       IA, inteligencia artificial (`js/data/ia-conceptos.js`).

   ► REDACCIÓN NUESTRA (no hay definición en `_dev/`; se escribió clara
     para III Ciclo y no es cita de nadie). La programación y el DCNB
     NOMBRAN casi todo lo de esta misión y no lo definen; y en `_dev/` no
     hay diccionario ni ortografía de la RAE. Cada pregunta que se apoya
     en una de estas definiciones lo dice en su `curriculo`:
     · «Sinónimos»: palabras distintas que significan lo mismo o casi lo
       mismo. «Antónimos»: palabras que significan lo contrario una de la
       otra. Que un sinónimo sirve o no según la oración es nuestra
       lectura de «El contexto: sinónimos, antónimos» (8.º).
     · «Contexto»: las palabras que rodean a otra en la oración
       (adaptación de «el sentido de la frase en que está ubicada la
       palabra», DCNB pp. 88, 121 y 162).
     · Cómo se usa el diccionario: el orden alfabético, buscar el verbo
       en infinitivo y elegir, entre varios significados, el que encaja.
       Qué es un diccionario especializado («el que explica los términos
       de una sola materia») y para qué sirve el de sinónimos.
     · «Vocabulario técnico»: las palabras exactas de una ciencia o de
       un oficio. «Regionalismo»: palabra que se usa en una región y no
       en todos los lugares donde se habla español (la misma idea de la
       misión de la conversación).
     · «Denotación»: el significado directo de una palabra.
       «Connotación»: lo que la palabra sugiere además. El DCNB solo dice
       dónde predomina cada valor (expositivos y literarios) y, de un
       videoclip, «significados denotativos (lo que se ve a simple vista)
       y connotativos (insinuados)» (p. 170).
     · «Lenguaje literario»: el de cuentos y poemas, que busca la
       belleza; «no literario»: el que busca informar con exactitud.
     · «Raíz» de la palabra: adaptación del DCNB p. 153. «Prefijo»: la
       pieza que va delante de la raíz; «sufijo»: la que va detrás. El
       DCNB nombra las dos y dice que modifican el significado; dónde va
       cada una es redacción nuestra.
     · EL SIGNIFICADO DE CADA PREFIJO Y DE CADA SUFIJO. El DCNB da listas
       («ab, ad, amb, bene…», «on, ona, ito, ante», «a, an, di, cata,
       meta…») sin significados. Aquí solo van piezas de uso común, con
       el significado que tienen en las palabras de ejemplo: re- (volver
       a), des- (lo contrario), in- o im- (no), pre- (antes), sub-
       (debajo), anti- (contra), bi- (dos), tri- (tres), multi- (muchos);
       -ero (oficio), -ería (lugar donde se hace o se vende), -dor (el
       que hace la acción), -ante (el que hace la acción), -ito
       (pequeño), -ón y -ona (grande), -oso (que tiene mucho), -able (que
       se puede), -mente (de manera), -al (terreno sembrado), -idad
       (cualidad) y -ear (forma un verbo). PENDIENTE DE VERIFICAR CON LA
       RAE: muchos de estos tienen otros significados en otras palabras;
       la misión no dice que sea el único.
     · bio- (vida), geo- (tierra), tele- (lejos), micro- (muy pequeño),
       foto- (luz) y eco- (casa, ambiente) se enseñan aquí como
       «prefijos que vienen del griego», que es como los llama el DCNB
       (pp. 153, 154 y 191). El diccionario de la RAE (DLE) llama a bio-,
       geo-, tele-, micro- y foto- «elementos compositivos», no prefijos:
       lo dijo Josué al revisar el PR 62 (la fuente sigue sin estar en
       `_dev/`). Se mantiene la forma del DCNB, y la guía y la ficha
       llevan una nota breve con el nombre que les da el diccionario.
       «eco-» solo va en la guía, no en el examen, y su nombre y su
       significado siguen pendientes de verificar.
     · «Neologismo»: palabra nueva, o significado nuevo de una palabra
       de siempre, que entra a la lengua para nombrar algo nuevo. Los
       ejemplos («chatear», «escanear»; la «nube» donde se guardan archivos,
       «navegar» por internet). No va el «ratón» de la computadora: en
       Honduras se le dice «mouse» son de uso común. NO SE AFIRMA
       qué diccionario los recoge ni cuáles acepta la RAE: queda
       pendiente de verificar.
     · «Polisemia»: que una sola palabra tenga varios significados.
     · «Sigla»: abreviación formada con las iniciales de un nombre
       (COPECO toma las dos primeras letras de cada palabra, y la guía lo
       dice). La misión no dice que la sigla sea una palabra: la RAE la
       define como «abreviación gráfica» (dato de Josué, revisión del
       PR 62). De un acrónimo solo se dice que se LEE como una palabra.
       «Acrónimo»: la sigla que se lee de corrido, como una palabra.
       PENDIENTE DE VERIFICAR CON LA RAE: el término «acrónimo» tiene
       además otro uso (palabra formada con trozos de otras) que aquí no
       se enseña. Que IHSS se deletrea y que ONU, COPECO y UNAH se leen
       de corrido es como se dicen en Honduras.

   ► LO QUE SE DEJÓ FUERA:
     · La homonimia (abril en 8.º y 9.º) y los parónimos (no están en
       ningún mes de la programación de 7.º a 9.º). Los parónimos y los
       homónimos solo se nombran en «Para Media».
     · Las perífrasis verbales: la línea «Perífrasis verbales: sinónimos
       y antónimos» de 8.º y 9.º se trata como sinónimos y antónimos; las
       perífrasis siguen pendientes de la respuesta de Josué.
     · Los extranjerismos, los arcaísmos y los americanismos son de otros
       meses.
     · Lexema y morfema como términos: se dice «raíz» y «piezas».
     · Ningún prefijo ni sufijo raro, y ninguna afirmación sobre qué
       palabras «existen» según la RAE: el laboratorio dice si la
       palabra está en SU lista de palabras comunes y manda al
       diccionario para lo demás (DCNB p. 113).
     · El examen no pregunta nada que sea solo de Media, porque una
       forma le puede tocar a un alumno de 7.º.

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
  titulo:'Las palabras y sus significados',
  emoji:'🔤',
  materia:'Español',
  confeti:['#0f766e','#4ba89f','#d97706','#f59e0b','#fde68a'],
  impresion:{acento:'#c49000',fondo:'#fef9e7'},
  rutaEtiqueta:'Secuencia',
  widgetIdentifica:{paso:'Pista',fin:'🎉 ¡Todas las pistas resueltas!'},
  tareaIdentifica:['Copia cada oración en tu cuaderno, subraya lo que va entre comillas y escribe al lado qué es.','<strong>Ejemplo:</strong> Hay que «releer» el cuento. → <span style="color:var(--jade);font-weight:700;">Palabra con prefijo: re- (volver a)</span>'],
  tareaClasifica:{instruccion:'Copia la siguiente tabla en tu cuaderno. Parte cada palabra en sus piezas y escribe qué significa.',columnas:['Palabra','Prefijo','Raíz','Sufijo','¿Qué significa?']},
  diploma:['¡Sigue jugando con las palabras!','¡Muy buen trabajo!','¡Ya lees cada palabra por su contexto!','¡Sabes armar y desarmar palabras!','¡Las palabras ya no te engañan!']
};

// ===================== IDENTIDAD Y GUARDADO =====================
const SAVE_KEY='n6_palabras_v1';
const MXP=200;
const TOTAL_SECTIONS=13;

// ===================== LOGROS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'🔤',label:'Primer quiz de las palabras superado'},
  flash_master:{icon:'🃏',label:'Todas las tarjetas de las palabras exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de significados'},
  id_master:{icon:'🔍',label:'Cazador de prefijos y sufijos'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de las palabras'},
  nivel3:{icon:'🔎',label:'¡Buscapalabras! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Diccionarista! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de las palabras dominados'}
};

// ===================== NIVELES =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Lector 👓'},{t:55,n:'Buscapalabras 🔎'},{t:90,n:'Armador 🧩'},{t:130,n:'Intérprete 🎭'},{t:165,n:'Diccionarista 📖'},{t:190,n:'Dueño de las palabras 🏆'}];

// ===================== TARJETAS =====================
const fcData=[
  {w:'Sinónimos',a:'🔁 Palabras distintas que <strong>significan lo mismo o casi lo mismo</strong>: «contento» y «alegre». Sirven para no repetir, pero no siempre se pueden cambiar una por otra: <strong>depende de la oración</strong>.'},
  {w:'Antónimos',a:'↔️ Palabras que <strong>significan lo contrario</strong> una de la otra: «frío» y «caliente», «subir» y «bajar». Algunos se forman con un prefijo: «útil» e «inútil».'},
  {w:'El contexto',a:'🧭 Las <strong>palabras que rodean a otra</strong> en la oración. Te dicen cuál de sus significados vale ahí: «me duele la muñeca» no habla de un juguete.'},
  {w:'El diccionario',a:'📖 Libro de consulta que explica <strong>qué significan las palabras</strong>. Van en <strong>orden alfabético</strong>; los verbos se buscan en infinitivo («correr») y, si hay varios significados, eliges <strong>el que encaja en tu oración</strong>.'},
  {w:'Diccionario especializado',a:'🔬 El que reúne y explica <strong>los términos de una sola materia</strong>: de Matemáticas, de Medicina, de Música. Otro muy útil es el <strong>de sinónimos y antónimos</strong>.'},
  {w:'Vocabulario técnico',a:'⚙️ Las palabras <strong>exactas de una ciencia o de un oficio</strong>: «cociente» en Matemáticas, «ecosistema» en Ciencias Naturales. A quien no conoce la materia hay que explicárselas.'},
  {w:'Regionalismo',a:'🗺️ Palabra que se usa <strong>en una región y no en todos los lugares</strong> donde se habla español: «pulpería», «pisto», «cipote». No es un error: es la forma de hablar de un lugar.'},
  {w:'Denotación y connotación',a:'🎭 <strong>Denotación</strong>: el significado directo de una palabra («estrella»: astro que brilla). <strong>Connotación</strong>: lo que además sugiere («eres una estrella»: alguien que destaca).'},
  {w:'Lenguaje literario y no literario',a:'✨ El <strong>literario</strong> (cuentos, poemas) busca la belleza y usa mucho la connotación. El <strong>no literario</strong> (un informe, una receta, un libro de Ciencias) busca informar con exactitud: en él predomina la denotación.'},
  {w:'Prefijo',a:'⬅️ Pieza que se pone <strong>delante</strong> de la raíz y le cambia el significado: <strong>re-</strong> (volver a) en «releer»; <strong>des-</strong> (lo contrario) en «deshacer»; <strong>sub-</strong> (debajo) en «subsuelo».'},
  {w:'Sufijo',a:'➡️ Pieza que se pone <strong>detrás</strong> de la raíz: <strong>-ero</strong> (oficio) en «panadero»; <strong>-ería</strong> (lugar) en «zapatería»; <strong>-ito</strong> (pequeño) en «perrito».'},
  {w:'Neologismo',a:'🆕 <strong>Palabra nueva</strong>, o significado nuevo de una palabra de siempre, que entra a la lengua para nombrar algo nuevo: «chatear», «escanear», la «nube» donde se guardan archivos.'},
  {w:'Polisemia',a:'🔀 Que <strong>una sola palabra tenga varios significados</strong>: «raíz» (la de la planta, la de un número y la de una palabra). El contexto dice cuál es.'},
  {w:'Siglas y acrónimos',a:'🔠 La <strong>sigla</strong> se forma con las iniciales de un nombre: IHSS, Instituto Hondureño de Seguridad Social. Si se lee de corrido, como una palabra, es un <strong>acrónimo</strong>: ONU, COPECO.'},
];

// ===================== QUIZ =====================
const qzData=[
  {q:'¿Cuál de estas parejas es de sinónimos?',o:['a) alto y bajo','b) contento y alegre','c) día y noche','d) abrir y cerrar'],c:1},
  {q:'¿Cuál de estas parejas es de antónimos?',o:['a) veloz y rápido','b) casa y hogar','c) bonito y lindo','d) entrar y salir'],c:3},
  {q:'«Me duele la muñeca». ¿Qué te dice que no se habla de un juguete?',o:['a) El contexto: «me duele»','b) El tamaño de la letra','c) El sufijo de la palabra','d) El orden alfabético'],c:0},
  {q:'¿En qué orden van las palabras en un diccionario?',o:['a) De la más corta a la más larga','b) De la más usada a la menos usada','c) En orden alfabético','d) En el orden en que se inventaron'],c:2},
  {q:'«Cociente» y «residuo» son vocabulario técnico de…',o:['a) la Música','b) las Matemáticas','c) la Cocina','d) el Deporte'],c:1},
  {q:'«Tienes un corazón de oro» usa las palabras con…',o:['a) denotación','b) orden alfabético','c) vocabulario técnico','d) connotación'],c:3},
  {q:'En «releer», la pieza «re-» es un…',o:['a) prefijo','b) sufijo','c) sinónimo','d) acrónimo'],c:0},
  {q:'¿Cuál de estas palabras lleva un sufijo que indica oficio?',o:['a) casita','b) lluvioso','c) zapatero','d) subsuelo'],c:2},
  {q:'«COPECO» es la sigla de…',o:['a) Comité Pesquero de la Costa','b) Colegio Pedagógico de Comayagua','c) Comisión Permanente de Contingencias','d) Corporación Petrolera de Copán'],c:2},
];

// ===================== CLASIFICA =====================
// Cuatro parejas que el alumno suele confundir. La primera es la del
// plan: denotación o connotación.
const classGroups=[
  {label:['Denotación','Connotación'],headA:'📘 Significado directo (denotación)',headB:'🎭 Sugiere algo más (connotación)',colA:'den',colB:'con',
   words:[{w:'«La estrella brilla en el cielo»',t:'den'},{w:'«Eres la estrella del equipo»',t:'con'},{w:'«El corazón bombea sangre»',t:'den'},{w:'«Tiene un corazón de oro»',t:'con'},{w:'«El sol sale por el este»',t:'den'},{w:'«Mi hija es mi sol»',t:'con'},{w:'«La piedra pesa dos libras»',t:'den'},{w:'«Tiene el corazón de piedra»',t:'con'},{w:'«El zorro vive en el monte»',t:'den'},{w:'«Ese vendedor es un zorro»',t:'con'}]},
  {label:['Sinónimos','Antónimos'],headA:'🔁 Son sinónimos',headB:'↔️ Son antónimos',colA:'sin',colB:'ant',
   words:[{w:'contento · alegre',t:'sin'},{w:'frío · caliente',t:'ant'},{w:'iniciar · comenzar',t:'sin'},{w:'subir · bajar',t:'ant'},{w:'veloz · rápido',t:'sin'},{w:'abrir · cerrar',t:'ant'},{w:'enorme · gigantesco',t:'sin'},{w:'ganar · perder',t:'ant'},{w:'casa · hogar',t:'sin'},{w:'entrar · salir',t:'ant'}]},
  {label:['Prefijo','Sufijo'],headA:'⬅️ Lleva prefijo (pieza delante)',headB:'➡️ Lleva sufijo (pieza detrás)',colA:'pre',colB:'suf',
   words:[{w:'releer',t:'pre'},{w:'zapatero',t:'suf'},{w:'deshacer',t:'pre'},{w:'librería',t:'suf'},{w:'subsuelo',t:'pre'},{w:'casita',t:'suf'},{w:'incompleto',t:'pre'},{w:'lluvioso',t:'suf'},{w:'tricolor',t:'pre'},{w:'lavable',t:'suf'}]},
  {label:['Técnico','Regional'],headA:'⚙️ Vocabulario técnico',headB:'🗺️ Habla regional o popular',colA:'tec',colB:'reg',
   words:[{w:'cociente',t:'tec'},{w:'pisto',t:'reg'},{w:'ecosistema',t:'tec'},{w:'cipote',t:'reg'},{w:'fotosíntesis',t:'tec'},{w:'pulpería',t:'reg'},{w:'hipotenusa',t:'tec'},{w:'chunche',t:'reg'},{w:'abiótico',t:'tec'},{w:'catracho',t:'reg'}]},
];

// ===================== IDENTIFICA =====================
// «Identifica el prefijo» (y el sufijo). En cada oración hay una sola
// palabra con la pieza que se pide.
const idData=[
  {s:['Hay','que','releer','el','cuento.'],c:2,busca:'la palabra que lleva el prefijo re-'},
  {s:['El','agua','corre','por','el','subsuelo.'],c:5,busca:'la palabra que lleva el prefijo sub-'},
  {s:['Dejó','el','dibujo','incompleto.'],c:3,busca:'la palabra que lleva el prefijo in-'},
  {s:['El','gato','logró','deshacer','el','nudo.'],c:3,busca:'la palabra que lleva el prefijo des-'},
  {s:['Hizo','una','pulsera','tricolor','para','su','prima.'],c:3,busca:'la palabra que lleva el prefijo tri-'},
  {s:['Mi','tío','es','el','zapatero','del','barrio.'],c:4,busca:'la palabra que lleva el sufijo -ero'},
  {s:['Compramos','un','cuaderno','en','la','librería.'],c:5,busca:'la palabra que lleva el sufijo -ería'},
  {s:['Fue','un','fin','de','semana','lluvioso.'],c:5,busca:'la palabra que lleva el sufijo -oso'},
];

// ===================== COMPLETA =====================
// «Completa con el sinónimo según el contexto»: la misma palabra, de dos
// en dos, pide un sinónimo distinto en cada oración.
const cmpData=[
  {s:'El agua está clara: se ve el fondo. Aquí, «clara» quiere decir ___.',opts:['transparente','evidente','rubia'],c:0},
  {s:'La explicación fue clara: todos la entendieron. Aquí, «clara» quiere decir ___.',opts:['transparente','fácil de entender','de color pálido'],c:1},
  {s:'Es un examen pesado: tiene cuarenta preguntas. Aquí, «pesado» quiere decir ___.',opts:['de muchas libras','gordo','largo y cansado'],c:2},
  {s:'No puedo cargar ese saco tan pesado. Aquí, «pesado» quiere decir ___.',opts:['aburrido','de mucho peso','molesto'],c:1},
  {s:'Dania es una alumna muy viva: capta todo al instante. Aquí, «viva» quiere decir ___.',opts:['lista','que respira','de color fuerte'],c:0},
  {s:'Pintó la pared de un rojo vivo. Aquí, «vivo» quiere decir ___.',opts:['despierto','que tiene vida','intenso'],c:2},
  {s:'El café está fuerte: le pusiste mucho. Aquí, «fuerte» quiere decir ___.',opts:['musculoso','cargado','ruidoso'],c:1},
  {s:'Se oyó un trueno fuerte. Aquí, «fuerte» quiere decir ___.',opts:['intenso','robusto','valiente'],c:0},
];

// ===================== WIDGETS =====================
// Widget 1: ordenar
const ordenaData=[
  {label:'Buscar una palabra en el diccionario',steps:['Te fijas en la primera letra de la palabra','Abres el diccionario por esa letra','Sigues el orden alfabético con las letras siguientes','Lees todos los significados que trae','Eliges el que encaja en tu oración']},
  {label:'Como en el diccionario: orden alfabético',steps:['antónimo','contexto','diccionario','prefijo','sufijo']},
  {label:'Orden alfabético, todas con p',steps:['palabra','polisemia','prefijo','pregunta','primero']},
  {label:'Las piezas de «recargable»',steps:['re- (prefijo: volver a)','carg- (raíz)','-able (sufijo: que se puede)']},
];
// Widget 2: «¿qué significa aquí?» (polisemia). Cuatro oraciones con
// «raíz» y cuatro con «planta»; la oración trae la pista.
const describeData=[
  {desc:'«El mangle vive con las raíces en agua salada»',ans:'Parte de una planta',opts:['Parte de una planta','Operación de Matemáticas','Parte de una palabra','Origen de algo']},
  {desc:'«La raíz cuadrada de 196 es 14»',ans:'Operación de Matemáticas',opts:['Parte de una planta','Operación de Matemáticas','Parte de una palabra','Origen de algo']},
  {desc:'«La raíz de "zapatero" y de "zapatería" es la misma»',ans:'Parte de una palabra',opts:['Parte de una planta','Operación de Matemáticas','Parte de una palabra','Origen de algo']},
  {desc:'«Hay que ir a la raíz del problema»',ans:'Origen de algo',opts:['Parte de una planta','Operación de Matemáticas','Parte de una palabra','Origen de algo']},
  {desc:'«Regó la planta del corredor»',ans:'Ser vivo que crece en la tierra',opts:['Ser vivo que crece en la tierra','Parte de abajo del pie','Piso de un edificio','Fábrica']},
  {desc:'«Se clavó una espina en la planta del pie»',ans:'Parte de abajo del pie',opts:['Ser vivo que crece en la tierra','Parte de abajo del pie','Piso de un edificio','Fábrica']},
  {desc:'«La biblioteca está en la segunda planta»',ans:'Piso de un edificio',opts:['Ser vivo que crece en la tierra','Parte de abajo del pie','Piso de un edificio','Fábrica']},
  {desc:'«Trabaja en una planta que embotella agua»',ans:'Fábrica',opts:['Ser vivo que crece en la tierra','Parte de abajo del pie','Piso de un edificio','Fábrica']},
];
// Widget 3: «desarrolla la sigla». Las cinco son reales; de dónde sale
// cada nombre está en la cabecera.
const emparejaData=[
  {term:'COPECO',resp:'Comisión Permanente de Contingencias',opts:['Comisión Permanente de Contingencias','Organización de las Naciones Unidas','Universidad Nacional Autónoma de Honduras','Instituto Hondureño de Seguridad Social']},
  {term:'ONU',resp:'Organización de las Naciones Unidas',opts:['Organización de las Naciones Unidas','Comisión Permanente de Contingencias','Inteligencia artificial','Universidad Nacional Autónoma de Honduras']},
  {term:'UNAH',resp:'Universidad Nacional Autónoma de Honduras',opts:['Universidad Nacional Autónoma de Honduras','Instituto Hondureño de Seguridad Social','Organización de las Naciones Unidas','Comisión Permanente de Contingencias']},
  {term:'IHSS',resp:'Instituto Hondureño de Seguridad Social',opts:['Instituto Hondureño de Seguridad Social','Inteligencia artificial','Universidad Nacional Autónoma de Honduras','Organización de las Naciones Unidas']},
  {term:'IA',resp:'Inteligencia artificial',opts:['Inteligencia artificial','Comisión Permanente de Contingencias','Instituto Hondureño de Seguridad Social','Universidad Nacional Autónoma de Honduras']},
];
// Widget 4: «¿dónde lo buscas?»
const situacionData=[
  {term:'Escribiste «bonito» cuatro veces en tu cuento y quieres otra palabra que diga lo mismo.',resp:'Un diccionario de sinónimos y antónimos',opts:['Un diccionario de sinónimos y antónimos','El diccionario de la lengua','Un diccionario especializado','El contexto: las palabras de alrededor']},
  {term:'En tu libro de Matemáticas aparece «hipotenusa» y quieres la explicación de alguien que sabe de la materia.',resp:'Un diccionario especializado',opts:['Un diccionario especializado','El diccionario de la lengua','Un diccionario de sinónimos y antónimos','El contexto: las palabras de alrededor']},
  {term:'No sabes qué significa «efímero» y tienes los libros de la biblioteca a mano.',resp:'El diccionario de la lengua',opts:['El diccionario de la lengua','Un diccionario de sinónimos y antónimos','Un diccionario especializado','El contexto: las palabras de alrededor']},
  {term:'Estás en un examen, sin libros, y lees: «El río venía crecido, tan caudaloso que nadie pudo cruzarlo». No conoces «caudaloso».',resp:'El contexto: las palabras de alrededor',opts:['El contexto: las palabras de alrededor','El diccionario de la lengua','Un diccionario de sinónimos y antónimos','Un diccionario especializado']},
  {term:'Necesitas una palabra que signifique lo contrario de «generoso» para describir a un personaje.',resp:'Un diccionario de sinónimos y antónimos',opts:['Un diccionario de sinónimos y antónimos','El diccionario de la lengua','Un diccionario especializado','El contexto: las palabras de alrededor']},
  {term:'Dudas si «exhausto» se escribe con h y tienes los libros de la biblioteca a mano.',resp:'El diccionario de la lengua',opts:['El diccionario de la lengua','Un diccionario de sinónimos y antónimos','Un diccionario especializado','El contexto: las palabras de alrededor']},
];

// ===================== RETO =====================
const retoPairs=[
  {label:['Sinónimos','Antónimos'],btnA:'🔁 Sinónimos',btnB:'↔️ Antónimos',colA:'sin',colB:'ant',
   words:[{w:'lindo · bonito',t:'sin'},{w:'día · noche',t:'ant'},{w:'empezar · iniciar',t:'sin'},{w:'alto · bajo',t:'ant'},{w:'feliz · dichoso',t:'sin'},{w:'lleno · vacío',t:'ant'},{w:'andar · caminar',t:'sin'},{w:'dulce · amargo',t:'ant'},{w:'auto · carro',t:'sin'},{w:'reír · llorar',t:'ant'}]},
  {label:['Prefijo','Sufijo'],btnA:'⬅️ Prefijo',btnB:'➡️ Sufijo',colA:'pre',colB:'suf',
   words:[{w:'rehacer',t:'pre'},{w:'librería',t:'suf'},{w:'desordenar',t:'pre'},{w:'florero',t:'suf'},{w:'submarino',t:'pre'},{w:'perrito',t:'suf'},{w:'inútil',t:'pre'},{w:'pescador',t:'suf'},{w:'bicolor',t:'pre'},{w:'casona',t:'suf'}]},
  {label:['Denotación','Connotación'],btnA:'📘 Denotación',btnB:'🎭 Connotación',colA:'den',colB:'con',
   words:[{w:'«El hielo es agua sólida»',t:'den'},{w:'«La noticia me dejó helado»',t:'con'},{w:'«La mesa tiene cuatro patas»',t:'den'},{w:'«Metí la pata»',t:'con'},{w:'«El perro ladra»',t:'den'},{w:'«Llueve a cántaros»',t:'con'},{w:'«El río lleva agua»',t:'den'},{w:'«Lloró un río de lágrimas»',t:'con'},{w:'«La nube tapa el sol»',t:'den'},{w:'«Anda en las nubes»',t:'con'}]},
];

// ===================== GENERADOR DE TAREAS =====================
const identifyTaskDB=[
  {s:'En el recibo decía «IHSS», en letras mayúsculas.',type:'Sigla (Instituto Hondureño de Seguridad Social)'},
  {s:'El locutor dijo «COPECO» de corrido, como una palabra.',type:'Acrónimo (Comisión Permanente de Contingencias)'},
  {s:'Mi abuela siempre dice «pisto» en vez de «dinero».',type:'Regionalismo'},
  {s:'El libro de Ciencias dice «factores abióticos».',type:'Vocabulario técnico'},
  {s:'Keyla escribió «rehacer» en su tarea.',type:'Palabra con prefijo: re- (volver a)'},
  {s:'En la esquina hay una «zapatería».',type:'Palabra con sufijo: -ería (lugar)'},
  {s:'El poema dice que la luna es «una moneda de plata».',type:'Connotación (lenguaje literario)'},
  {s:'En la misma página leí «hoja de papel» y «hoja de mango».',type:'Polisemia: una palabra con varios significados'},
  {s:'Cambié «bonito» por «hermoso» para no repetir.',type:'Sinónimos'},
  {s:'Mi prima me pidió «chatear» un rato por la tarde.',type:'Neologismo'},
];
const classifyTaskDB=[
  {w:'recargable',gen:'re- (volver a)',n:'carg-',g:'-able (que se puede)',t:'Que se puede volver a cargar'},
  {w:'incontable',gen:'in- (no)',n:'cont-',g:'-able (que se puede)',t:'Que no se puede contar'},
  {w:'zapatero',gen:'No tiene',n:'zapat-',g:'-ero (oficio)',t:'Persona que hace o arregla zapatos'},
  {w:'deshacer',gen:'des- (lo contrario)',n:'hacer',g:'No tiene',t:'Desbaratar lo que estaba hecho'},
  {w:'subsuelo',gen:'sub- (debajo)',n:'suelo',g:'No tiene',t:'Lo que está debajo del suelo'},
  {w:'librería',gen:'No tiene',n:'libr-',g:'-ería (lugar)',t:'Lugar donde se venden libros'},
  {w:'lluvioso',gen:'No tiene',n:'lluvi-',g:'-oso (que tiene mucho)',t:'Con mucha lluvia'},
  {w:'inútilmente',gen:'in- (no)',n:'útil',g:'-mente (de manera)',t:'De manera inútil: en vano'},
];
const completeTaskDB=[
  {s:'Dos palabras que significan lo mismo o casi lo mismo son ___.',opts:['sinónimos','antónimos','siglas'],ans:'sinónimos'},
  {s:'Dos palabras que significan lo contrario son ___.',opts:['prefijos','antónimos','neologismos'],ans:'antónimos'},
  {s:'Las palabras que rodean a otra y aclaran su significado forman su ___.',opts:['sufijo','glosario','contexto'],ans:'contexto'},
  {s:'La pieza que va delante de la raíz es el ___.',opts:['prefijo','sufijo','acrónimo'],ans:'prefijo'},
  {s:'La pieza que va detrás de la raíz es el ___.',opts:['contexto','sufijo','prefijo'],ans:'sufijo'},
  {s:'Que una palabra tenga varios significados se llama ___.',opts:['denotación','connotación','polisemia'],ans:'polisemia'},
  {s:'Una palabra nueva para nombrar algo nuevo es un ___.',opts:['neologismo','regionalismo','antónimo'],ans:'neologismo'},
  {s:'Una sigla que se lee de corrido, como una palabra, es un ___.',opts:['sufijo','acrónimo','sinónimo'],ans:'acrónimo'},
];
const explainQuestions=[
  {q:'Recoge en tu casa tres palabras que se usen en tu región y escribe cómo se dirían en lengua estándar.',ans:'Respuesta abierta. Ejemplo: «pisto» (dinero), «cipote» (niño), «pulpería» (tienda pequeña del barrio). Se valora que cada regionalismo lleve su equivalente y que se trate con respeto: no es un error.'},
  {q:'Escribe dos oraciones con la palabra «hoja», cada una con un significado distinto, y subraya las palabras del contexto que aclaran cuál es.',ans:'Respuesta abierta. Ejemplo: «Cayó una hoja del árbol de mango» y «Escribe tu nombre en la hoja del cuaderno». Las pistas son «del árbol» y «del cuaderno».'},
  {q:'Explica con tus palabras la diferencia entre denotación y connotación, y da un ejemplo de cada una con la palabra «sol».',ans:'La denotación es el significado directo: «El sol sale por el este». La connotación es lo que la palabra sugiere además: «Mi hija es mi sol» (es lo que más quiero).'},
  {q:'Arma tres palabras con el prefijo «re-» y tres con el sufijo «-ero». Comprueba en el diccionario que existen y escribe qué significan.',ans:'Respuesta abierta. Ejemplos: releer, rehacer, recargar (volver a leer, a hacer, a cargar); zapatero, panadero, lechero (oficios). Se valora que las haya comprobado.'},
  {q:'¿Por qué un sinónimo no siempre sirve? Explícalo con la palabra «clara».',ans:'Porque depende del contexto. «Agua clara» se puede cambiar por «agua transparente», pero «explicación clara» no: ahí el sinónimo es «fácil de entender».'},
  {q:'Busca en un recibo, en un rótulo o en una noticia dos siglas. Cópialas y escribe el nombre completo de cada una.',ans:'Respuesta abierta. Ejemplo: IHSS, Instituto Hondureño de Seguridad Social; COPECO, Comisión Permanente de Contingencias. Se valora que el nombre completo esté bien escrito y que diga si la sigla se deletrea o se lee de corrido.'},
  {q:'Escribe sobre la lluvia una oración en lenguaje no literario y otra en lenguaje literario.',ans:'Respuesta abierta. Ejemplo: «Hoy llovió durante dos horas» (no literario: informa) y «La lluvia tocaba el techo con dedos de cristal» (literario: sugiere).'},
  {q:'Nombra dos palabras que tus abuelos no usaban cuando eran niños y explica qué cosa nueva nombran.',ans:'Respuesta abierta. Ejemplos: «chatear» (conversar por escrito con un aparato) y «escanear» (pasar un papel a la computadora). Son neologismos: palabras nuevas para cosas nuevas.'},
];

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['G','Z','L','D','G','G','C','A','P','F'],
    ['G','H','T','D','S','R','O','N','L','R'],
    ['K','R','S','Z','U','R','N','T','S','P'],
    ['Q','V','D','C','F','A','T','O','I','R'],
    ['G','V','N','T','I','I','E','N','N','E'],
    ['J','V','S','G','J','Z','X','I','O','F'],
    ['Z','C','C','I','O','T','T','M','N','I'],
    ['P','S','N','X','G','L','O','O','I','J'],
    ['T','M','G','X','L','L','X','G','M','O'],
    ['P','M','H','Z','H','L','A','Z','O','R']
  ],words:[
    {w:'SINONIMO',cells:[[2,8],[3,8],[4,8],[5,8],[6,8],[7,8],[8,8],[9,8]]},
    {w:'ANTONIMO',cells:[[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]]},
    {w:'CONTEXTO',cells:[[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6]]},
    {w:'PREFIJO',cells:[[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],[8,9]]},
    {w:'SUFIJO',cells:[[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]]},
    {w:'RAIZ',cells:[[2,5],[3,5],[4,5],[5,5]]},
    {w:'SIGLA',cells:[[5,2],[6,3],[7,4],[8,5],[9,6]]}
  ]},
  {size:10,grid:[
    ['P','D','P','K','G','D','N','F','R','G'],
    ['F','P','O','P','G','E','E','G','E','X'],
    ['A','L','L','A','L','N','O','T','G','T'],
    ['C','L','I','L','V','O','L','L','I','E'],
    ['R','D','S','A','J','T','O','M','O','C'],
    ['O','L','E','B','F','A','G','V','N','N'],
    ['N','G','M','R','N','C','I','K','A','I'],
    ['I','X','I','A','V','I','S','R','L','C'],
    ['M','X','A','B','M','O','M','D','C','O'],
    ['O','B','L','Q','F','N','O','K','Q','M']
  ],words:[
    {w:'POLISEMIA',cells:[[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[7,2],[8,2]]},
    {w:'NEOLOGISMO',cells:[[0,6],[1,6],[2,6],[3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6]]},
    {w:'ACRONIMO',cells:[[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],[8,0],[9,0]]},
    {w:'DENOTACION',cells:[[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5]]},
    {w:'TECNICO',cells:[[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],[8,9]]},
    {w:'REGIONAL',cells:[[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,8],[7,8]]},
    {w:'PALABRA',cells:[[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[7,3]]}
  ]}
];

// ===================== EXAMEN CONCEPTUAL =====================
// UN DATO, UNA PREGUNTA. Cada forma saca cinco de cada banco y pueden caer
// juntas cualesquiera, así que ninguna pregunta pide un dato que otra ya pide
// (su `k` no se repite) y ninguna respuesta aparece escrita en otra pregunta,
// tampoco como opción equivocada. Lo comprueba
// `_dev/verifica-examen-sin-pistas.js`.
//
// ⚠️ TRES REGLAS MÁS, de la revisión de la tanda 2:
//  · La respuesta de un completar no está escrita en NINGÚN otro enunciado
//    de los dos bancos (ni en una opción ni en un pareado). Por eso aquí se
//    dice «lo contrario» y no el nombre técnico, «en esa oración» y no el
//    término que la nombra, y los ejemplos no repiten esas palabras.
//  · Cada completar tiene UNA sola respuesta válida: o es el nombre que se
//    enseñó, o es la palabra que sale de armar las piezas que da el
//    enunciado. `acc` solo guarda maneras de escribir esa misma respuesta.
//  · En la selección, la correcta no es la opción más larga ni la más corta
//    más que alguna vez (se miden las dos; ver el PR).
//
// ⚠️ Y ninguna la contesta la historia de la muñeca (la tarjeta con que
// abre la misión) ni usa las palabras base del laboratorio: los ejemplos
// del examen son otros.
//
// ⚠️ El examen no pregunta nada que sea solo de Media: una forma le puede
// tocar a un alumno de 7.º. Lo de Media va en su tarjeta y en la ficha.
const evalTFBank=[
  {q:'Dos sinónimos se pueden cambiar uno por otro en cualquier oración, sin fijarse en lo que dice.',a:false,k:'tf-sinonimos-siempre',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el contexto: sinónimos, antónimos) · que un sinónimo sirve o no según la oración es redacción nuestra'},
  {q:'Un diccionario puede dar varios significados para una misma palabra.',a:true,k:'tf-diccionario-varios',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (uso del diccionario) · DCNB pp. 91 y 165 (textos de consulta: el diccionario) · cómo se usa el diccionario es redacción nuestra'},
  {q:'El vocabulario técnico de una ciencia sirve para nombrar las cosas con exactitud.',a:true,k:'tf-tecnico-exacto',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (vocabulario técnico; vocabulario técnico y científico; lenguaje técnico) · DCNB pp. 86, 118 y 160 (científico/técnico) · para qué sirve es redacción nuestra'},
  {q:'Decir «pulpería» en vez de «tienda» es hablar mal.',a:false,k:'tf-pulperia',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (regionalismos; lenguaje popular, regional) · DCNB p. 86 (respeto hacia las diferentes formas de lengua utilizadas por los miembros de la comunidad) · la definición de regionalismo es redacción nuestra'},
  {q:'En los poemas abundan las palabras usadas con valor connotativo.',a:true,k:'tf-poema-connotativo',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (denotación y connotación) · DCNB pp. 106, 143 y 180 (predominio del valor connotativo del lenguaje en los textos líricos)'},
  {q:'En el texto de un libro de Ciencias predominan las palabras usadas con valor connotativo.',a:false,k:'tf-ciencias-denotativo',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (denotación y connotación) · DCNB pp. 108, 146 y 183 (el valor denotativo de la lengua en los textos expositivos)'},
  {q:'Una palabra puede llevar un prefijo o un sufijo, pero nunca los dos a la vez.',a:false,k:'tf-dos-piezas',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 153 (analizan palabras compuestas o derivadas para identificar sus componentes) · que una palabra puede llevar las dos piezas es redacción nuestra'},
  {q:'«Fotosíntesis» es una palabra del habla popular.',a:false,k:'tf-fotosintesis',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (vocabulario técnico y científico; lenguaje científico-técnico; lenguaje popular) · DCNB pp. 86 y 118 (formas orales: popular; formas escritas: científico/técnico) · el término, de la misión de los ecosistemas (misiones/2y3ciclo-ecosistemas/) · qué es vocabulario técnico es redacción nuestra'},
  {q:'«UNAH» se forma con las iniciales de «Universidad Nacional Autónoma de Honduras».',a:true,k:'tf-unah',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (siglas y acrónimos); pp. 7 y 15 (acrónimos y siglas, en el estándar de lectura) · el nombre, como lo escribe la misión de la Ley Fundamental de Educación (misiones/docente-ley-fundamental-aula/) · que la sigla se forma con las iniciales es redacción nuestra'},
  {q:'El diccionario especializado de una materia explica los términos propios de esa materia.',a:true,k:'tf-especializado',grado:'8.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 15 y 23 (uso de diccionarios especializados) · DCNB p. 124 (diccionarios especializados) · la explicación es redacción nuestra'}
];
const evalMCBank=[
  {q:'«El examen fue sencillo». ¿Qué palabra puede ocupar el lugar de «sencillo» sin cambiar lo que dice la oración?',o:['a) extenso','b) reciente','c) fácil','d) extraño'],a:2,k:'mc-sencillo',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (sinónimos y antónimos) · la definición de sinónimo es redacción nuestra'},
  {q:'¿Qué palabra significa lo contrario de «abundante»?',o:['a) numeroso','b) escaso','c) sobrante','d) lejano'],a:1,k:'mc-abundante',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (sinónimos y antónimos) · la definición de antónimo es redacción nuestra'},
  {q:'«Nos sentamos en el banco del parque». En esa oración, «banco» nombra…',o:['a) un asiento para varias personas','b) un grupo de peces','c) una oficina donde se guarda dinero','d) un montón de arena'],a:0,k:'mc-banco',grado:'8.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 15 y 23 (el contexto) y p. 23 (polisemia); pp. 7 y 15 (palabras con múltiples significados, en el estándar de lectura) · DCNB pp. 88, 121 y 162 (el sentido de la frase en que está ubicada la palabra) · la definición de polisemia es redacción nuestra'},
  {q:'Quieres una explicación completa de la palabra «hipotenusa». ¿Dónde conviene buscarla?',o:['a) En un diccionario de Música','b) En un diccionario de Medicina','c) En un diccionario de sinónimos','d) En un diccionario de Matemáticas'],a:3,k:'mc-hipotenusa',grado:'8.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 15 y 23 (uso de diccionarios especializados) · DCNB p. 124 (diccionarios especializados… para asegurarse del uso apropiado de los términos desconocidos) · qué es un diccionario especializado es redacción nuestra'},
  {q:'«Mi abuela tiene un corazón de oro». Con esa expresión se quiere decir que la abuela…',o:['a) guarda una joya','b) tiene mucho dinero','c) es muy bondadosa','d) está enferma del corazón'],a:2,k:'mc-corazon-oro',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (denotación y connotación) · DCNB pp. 108, 146 y 183 (el valor connotativo de algunas expresiones en la comunicación cotidiana) · la definición de connotación es redacción nuestra'},
  {q:'En «prehistoria» y «precalentar», el prefijo «pre-» significa…',o:['a) contra','b) antes','c) debajo','d) otra vez'],a:1,k:'mc-pre',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (los prefijos, sus significados y la función de modificar el significado de las palabras) · el significado de este prefijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'En «panadero», «lechero» y «cartero», el sufijo «-ero» indica…',o:['a) un oficio','b) un lugar','c) un tamaño','d) una cantidad'],a:0,k:'mc-ero',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (sufijos) · el significado de este sufijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'¿Cuál de estas oraciones usa vocabulario técnico de las Ciencias Naturales?',o:['a) «Ese monte junto al mar es bonito»','b) «Donde hay mangle hay camarones»','c) «Qué calor hace en la costa»','d) «El manglar es un ecosistema costero»'],a:3,k:'mc-tecnico',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (vocabulario técnico; vocabulario técnico y científico) · DCNB pp. 86 y 118 (científico/técnico) · la oración técnica, de la misión de los ecosistemas (misiones/2y3ciclo-ecosistemas/) · qué es vocabulario técnico es redacción nuestra'},
  {q:'¿Cuál de estos textos está escrito en lenguaje literario?',o:['a) El recibo de la energía eléctrica','b) La etiqueta de un jarabe para la tos','c) Un poema sobre la lluvia de mayo','d) El horario de clases del grado'],a:2,k:'mc-literario',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (diferencias entre lenguaje literario y no literario) · DCNB pp. 86 y 118 (literario) · la explicación de los dos lenguajes es redacción nuestra'},
  {q:'«IHSS» se escribe con las iniciales de…',o:['a) Instituto Hondureño de Seguridad Social','b) Instituto de Historia y Sociedad del Sur','c) Inspección de Hospitales y Servicios de Salud','d) Instituto Hondureño de Salud y Saneamiento'],a:0,k:'mc-ihss',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (siglas y acrónimos); pp. 7 y 15 (acrónimos y siglas, en el estándar de lectura) · el nombre, como lo escribe la misión del Estatuto del Docente (misiones/docente-estatuto-derechos/) · los otros tres nombres son inventados · que la sigla se forma con las iniciales es redacción nuestra'}
];
const evalCPBank=[
  {q:'Las palabras que significan lo contrario una de la otra, como «frío» y «caliente», se llaman ___.',a:'antónimos',acc:['antónimos','antonimos','antónimo','antonimo'],k:'cp-antonimos',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (sinónimos y antónimos) · la definición es redacción nuestra'},
  {q:'Que una sola palabra tenga varios significados, como «hoja» (la del árbol y la del cuaderno), se llama ___.',a:'polisemia',acc:['polisemia'],k:'cp-polisemia',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (polisemia); pp. 7 y 15 (palabras con múltiples significados, en el estándar de lectura) · la definición es redacción nuestra'},
  {q:'Una palabra nueva, que entra a la lengua para nombrar algo que antes no existía, es un ___.',a:'neologismo',acc:['neologismo','neologismos'],k:'cp-neologismo',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (neologismos) · la definición es redacción nuestra'},
  {q:'Con el verbo «hacer» y el prefijo «des-» se forma el verbo ___.',a:'deshacer',acc:['deshacer'],k:'cp-deshacer',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (prefijos; analizan palabras derivadas para identificar sus componentes) · el significado de este prefijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'Con «fruta» y el sufijo «-ería» se forma ___, el lugar donde se vende fruta.',a:'frutería',acc:['frutería','fruteria'],k:'cp-fruteria',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (sufijos) · el significado de este sufijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'La sigla de «Organización de las Naciones Unidas» se escribe con sus tres iniciales: ___.',a:'ONU',acc:['ONU','onu','O.N.U.'],k:'cp-onu',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (siglas y acrónimos); pp. 7 y 15 (acrónimos y siglas, en el estándar de lectura) · el nombre, como lo escribe el DCNB de II ciclo (Ciencias Sociales de 6.º) · que la sigla se forma con las iniciales es redacción nuestra'},
  {q:'«Florero», «florista» y «florecer» comparten una parte que no cambia, su raíz: ___.',a:'flor',acc:['flor','flor-'],k:'cp-flor',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB p. 153 (el elemento que no varía, manteniéndose siempre fijo: lexema o raíz) y p. 113 (lexema, morfema) · llamar raíz a «la parte que no cambia» es una adaptación de esa frase: redacción nuestra'},
  {q:'En el diccionario, las palabras van en orden ___: primero las que empiezan con a, luego las que empiezan con b, y así.',a:'alfabético',acc:['alfabético','alfabetico'],k:'cp-alfabetico',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (uso del diccionario) · DCNB p. 91 (textos de consulta: el diccionario) · cómo se usa el diccionario es redacción nuestra'},
  {q:'Lo contrario de «encender» es ___.',a:'apagar',acc:['apagar'],k:'cp-apagar',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (sinónimos y antónimos) · la definición de antónimo es redacción nuestra'},
  {q:'Las palabras que rodean a otra en la oración, y que ayudan a entender qué significa, forman su ___.',a:'contexto',acc:['contexto'],k:'cp-contexto',grado:'8.º y 9.º',curriculo:'Prog. 7-9, PDF pp. 15 y 23 (el contexto) · DCNB pp. 88, 121 y 162 (el contexto lingüístico, es decir, el sentido de la frase en que está ubicada la palabra) · la definición es una adaptación nuestra de esa frase'}
];
const evalPRBank=[
  {term:'re-',def:'Volver a hacer algo',k:'pr-re',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (prefijos latinos y sus significados) · el significado de este prefijo es redacción nuestra, pendiente de verificar con la RAE'},
  {term:'anti-',def:'Contra; que se opone a algo',k:'pr-anti',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 153, 154 y 191 (prefijos griegos y sus significados) · el significado de este prefijo es redacción nuestra, pendiente de verificar con la RAE'},
  {term:'multi-',def:'Muchos, varios',k:'pr-multi',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (prefijos latinos y sus significados) · el significado de este prefijo es redacción nuestra, pendiente de verificar con la RAE'},
  {term:'-al',def:'Terreno sembrado de una planta',k:'pr-al',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (sufijos) · el significado de este sufijo (el de «maizal» y «arrozal») es redacción nuestra, pendiente de verificar con la RAE'},
  {term:'-mente',def:'De cierta manera',k:'pr-mente',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (sufijos) · el significado de este sufijo es redacción nuestra, pendiente de verificar con la RAE'},
  {term:'Iniciar',def:'Significa lo mismo que «comenzar»',k:'pr-iniciar',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (sinónimos y antónimos) · la definición de sinónimo es redacción nuestra'},
  {term:'Ascender',def:'Significa lo contrario de «bajar»',k:'pr-ascender',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (sinónimos y antónimos) · la definición de antónimo es redacción nuestra'},
  {term:'Abiótico',def:'Término de las Ciencias Naturales: sin vida',k:'pr-abiotico',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (vocabulario técnico; vocabulario técnico y científico) · el término, de la misión de los ecosistemas (misiones/2y3ciclo-ecosistemas/) · qué es vocabulario técnico es redacción nuestra'},
  {term:'Cociente',def:'Término de las Matemáticas: resultado de una división',k:'pr-cociente',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (vocabulario técnico; vocabulario técnico y científico) · el término, el mismo de la misión de la conversación (misiones/3ciclo-n1-conversacion/) · qué es vocabulario técnico es redacción nuestra'},
  {term:'Pisto',def:'Palabra del habla popular de Honduras: dinero',k:'pr-pisto',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (regionalismos; lenguaje popular, regional) · DCNB p. 86 (formas orales: popular, regionalismos) · el ejemplo, el mismo de la misión de la conversación (misiones/3ciclo-n1-conversacion/) · el significado es el de uso común; la definición de regionalismo es redacción nuestra'}
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
  {q:'En «perrito», el sufijo «-ito» indica que el perro es muy grande.',a:false,k:'tf-ito',fuente:'Guía (Aprende): Sufijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB p. 191 (sufijos: on, ona, ito, ante) · el significado de este sufijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'Algunas palabras forman su contrario con un prefijo: de «ordenar» sale «desordenar».',a:true,k:'tf-desordenar',fuente:'Guía (Aprende): Prefijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (la función de modificar el significado de las palabras) · el significado de este prefijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'«IHSS» es un acrónimo, porque se lee de corrido.',a:false,k:'tf-ihss-acronimo',fuente:'Guía (Aprende): Siglas y acrónimos · Ficha, página 4 (8. Siglas y acrónimos)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (siglas y acrónimos); pp. 7 y 15 (acrónimos y siglas, en el estándar de lectura) · que el acrónimo es la sigla que se lee de corrido, y que IHSS se deletrea, es redacción nuestra'},
  {q:'Si armas una palabra con un prefijo, conviene comprobar en el diccionario que existe.',a:true,k:'tf-comprobar',fuente:'Actividad Laboratorio: la fábrica de palabras · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 154 (comprueban la existencia y adecuación de las palabras creadas consultando el diccionario)'},
  {q:'Los sinónimos ayudan a no repetir la misma palabra muchas veces en un texto.',a:true,k:'tf-no-repetir',fuente:'Guía (Aprende): Sinónimos y antónimos · Ficha, página 1 (1. Sinónimos y antónimos)',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (escritura: sinónimos, antónimos; utilizan una variedad de palabras y sus relaciones semánticas en la producción de sus textos) · para qué sirven es redacción nuestra'},
  {q:'«Tiene un corazón de piedra» quiere decir que esa persona lleva una roca en el pecho.',a:false,k:'tf-corazon-piedra',fuente:'Guía (Aprende): Denotación y connotación · Actividad Clasifica: Sugiere algo más (connotación)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (denotación y connotación) · DCNB pp. 108, 146 y 183 (el valor connotativo de algunas expresiones en la comunicación cotidiana) · la definición de connotación es redacción nuestra'},
  {q:'Las instrucciones para armar una silla están escritas en lenguaje literario.',a:false,k:'tf-instrucciones',fuente:'Guía (Aprende): Denotación y connotación · Ficha, página 2 (4. Denotación y connotación)',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (diferencias entre lenguaje literario y no literario) · la explicación de los dos lenguajes es redacción nuestra'},
  {q:'«Librero», «librería» y «librito» son palabras de la misma familia.',a:true,k:'tf-familia',fuente:'Guía (Aprende): La palabra por dentro · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 153 (palabras derivadas; el lexema o raíz) · «familia de palabras» es redacción nuestra'},
  {q:'Las palabras técnicas de un oficio las entiende cualquier persona sin que nadie se las explique.',a:false,k:'tf-tecnico-todos',fuente:'Guía (Aprende): Palabras técnicas y palabras de aquí · Ficha, página 2 (3. Vocabulario técnico y regionalismos)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (vocabulario técnico; lenguaje técnico) · que hay que explicarlas a quien no conoce la materia es redacción nuestra'},
  {q:'«Chatear» y «escanear» son palabras que el español recibió con la tecnología.',a:true,k:'tf-chatear',fuente:'Guía (Aprende): Neologismos · Ficha, página 4 (6. Neologismos)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (neologismos) · los ejemplos son de uso común; no se afirma qué diccionario los recoge (pendiente de verificar con la RAE) · la definición de neologismo es redacción nuestra'}
];
const evalMCBankNuevo=[
  {q:'«El agua del río está tan clara que se ven las piedras». En esa oración, «clara» se puede cambiar por…',o:['a) comprensible','b) cristalina','c) blanquecina','d) evidente'],a:1,k:'mc-clara',fuente:'Guía (Aprende): Sinónimos y antónimos · Actividad Completa 1 y 2',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el contexto: sinónimos, antónimos) · que un sinónimo sirve o no según la oración es redacción nuestra'},
  {q:'«Este puente es seguro: puedes pasar sin miedo». ¿Qué palabra dice lo contrario de «seguro» en esa oración?',o:['a) indeciso','b) peligroso','c) desconfiado','d) asegurado'],a:1,k:'mc-seguro',fuente:'Guía (Aprende): Sinónimos y antónimos · Ficha, página 1 (1. Sinónimos y antónimos)',grado:'8.º',curriculo:'Prog. 7-9, PDF p. 15 (el contexto: sinónimos, antónimos) · que un antónimo sirve o no según la oración es redacción nuestra'},
  {q:'«La raíz cuadrada de 196 es 14». En esa oración, «raíz» es una palabra de…',o:['a) las Ciencias Naturales','b) la Gramática','c) las Matemáticas','d) la Odontología'],a:2,k:'mc-raiz-196',fuente:'Guía (Aprende): Polisemia · Actividad «¿Qué significa aquí?» 2',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (polisemia; lenguaje técnico); pp. 7 y 15 (palabras con múltiples significados, en el estándar de lectura) · el dato, de la misión de las potencias (misiones/2ciclo-potencias-raices/) · la definición de polisemia es redacción nuestra'},
  {q:'¿En cuál de estas oraciones se usa «estrella» con su significado directo, sin sugerir nada más?',o:['a) «Mi hermana es la estrella del equipo»','b) «Dicen que naciste con muy buena estrella»','c) «Anoche brillaba una estrella cerca de la Luna»','d) «Ese cantante ya es una estrella de la radio»'],a:2,k:'mc-estrella',fuente:'Guía (Aprende): Denotación y connotación · Actividad Clasifica: Significado directo (denotación)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (denotación y connotación) · la definición de denotación es redacción nuestra'},
  {q:'El Himno Nacional dice: «Tu bandera es un lampo de cielo». Un «lampo» es un resplandor. Con esa imagen, el verso sugiere…',o:['a) que la bandera brilla como el cielo','b) que la bandera está hecha de vidrio','c) que la bandera cayó de una nube gris','d) que la bandera alumbra por la noche'],a:0,k:'mc-himno',fuente:'Guía (Aprende): Denotación y connotación · Ficha, página 2 (4. Denotación y connotación)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (denotación y connotación) · DCNB pp. 106, 143 y 180 (predominio del valor connotativo del lenguaje en los textos líricos; comentan las connotaciones de comparaciones y metáforas) · el verso y el significado de «lampo», de js/data/himno.js · qué sugiere el verso es lectura nuestra'},
  {q:'Un diccionario «bilingüe» trae las palabras en…',o:['a) un idioma','b) tres idiomas','c) muchos idiomas','d) dos idiomas'],a:3,k:'mc-bilingue',fuente:'Guía (Aprende): Prefijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (prefijos latinos y sus significados) · el significado de este prefijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'¿Cuál de estas palabras nombra una casa grande?',o:['a) casita','b) casero','c) caserío','d) casona'],a:3,k:'mc-casona',fuente:'Guía (Aprende): Sufijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB p. 191 (sufijos: on, ona, ito, ante) · el significado de este sufijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'Con la tecnología, algunas palabras de siempre ganaron un significado nuevo. ¿En cuál oración tiene «nube» ese significado nuevo?',o:['a) «Una nube tapó el sol toda la tarde»','b) «Subí la tarea de hoy a la nube»','c) «Esa nube trae bastante agua»','d) «Vimos una nube con forma de pez»'],a:1,k:'mc-nube',fuente:'Guía (Aprende): Neologismos · Ficha, página 4 (6. Neologismos)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (neologismos; polisemia) · que una palabra de siempre gana un significado nuevo es redacción nuestra; el ejemplo es de uso común (pendiente de verificar con la RAE)'},
  {q:'En un cuento lees «Los niños corrían». ¿Con qué palabra buscas ese verbo en el diccionario?',o:['a) corrían','b) corro','c) correr','d) corrida'],a:2,k:'mc-correr',fuente:'Guía (Aprende): El diccionario y sus parientes · Ficha, página 1 (2. El diccionario)',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (uso del diccionario) · DCNB p. 91 (textos de consulta: el diccionario) · cómo se usa el diccionario es redacción nuestra'},
  {q:'«Dame una mano con estas cajas». En esa oración, «dar una mano» quiere decir…',o:['a) ayudar','b) saludar','c) aplaudir','d) empujar'],a:0,k:'mc-dar-mano',fuente:'Guía (Aprende): Denotación y connotación · Ficha, página 2 (4. Denotación y connotación)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (denotación y connotación) · DCNB pp. 108, 146 y 183 (el valor connotativo de algunas expresiones en la comunicación cotidiana) · la definición de connotación es redacción nuestra'}
];
const evalCPBankNuevo=[
  {q:'La sigla de «inteligencia artificial» se escribe con sus dos iniciales: ___.',a:'IA',acc:['IA','ia','I.A.'],k:'cp-ia',fuente:'Actividad «Desarrolla la sigla» 5 · Ficha, página 4 (8. Siglas y acrónimos)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (siglas y acrónimos); pp. 7 y 15 (acrónimos y siglas, en el estándar de lectura) · la sigla, como la usa js/data/ia-conceptos.js · que la sigla se forma con las iniciales es redacción nuestra'},
  {q:'«COPECO», la institución que coordina la prevención y la respuesta ante los desastres, es la Comisión Permanente de ___.',a:'Contingencias',acc:['Contingencias','contingencias','Contingencia','contingencia'],k:'cp-contingencias',fuente:'Guía (Aprende): Siglas y acrónimos · Actividad «Desarrolla la sigla» 1',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (siglas y acrónimos); pp. 7 y 15 (acrónimos y siglas, en el estándar de lectura) · el nombre y lo que hace la institución, de la misión de los desastres naturales (misiones/2y3ciclo-desastres-naturales/) · COPECO toma las dos primeras letras de cada palabra de su nombre (CO, PE, CO), no solo las iniciales'},
  {q:'Lo contrario de «posible» se forma con el prefijo «im-»: ___.',a:'imposible',acc:['imposible'],k:'cp-imposible',fuente:'Guía (Aprende): Prefijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (prefijos latinos y sus significados) · el significado de este prefijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'Con el prefijo «sub-» y la palabra «marino» se nombra el barco que navega bajo el agua: ___.',a:'submarino',acc:['submarino'],k:'cp-submarino',fuente:'Guía (Aprende): Prefijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (prefijos latinos y sus significados) · el significado de este prefijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'Con el verbo «pescar» y el sufijo «-dor» se nombra a quien vive de la pesca: ___.',a:'pescador',acc:['pescador','pescadora'],k:'cp-pescador',fuente:'Guía (Aprende): Sufijos de todos los días · Actividad Reto: Sufijo',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (sufijos) · el significado de este sufijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'Una palabra que se usa en una región y no en todos los lugares donde se habla español, como «cipote» por «niño», es un ___.',a:'regionalismo',acc:['regionalismo','regionalismos'],k:'cp-regionalismo',fuente:'Guía (Aprende): Palabras técnicas y palabras de aquí · Ficha, página 2 (3. Vocabulario técnico y regionalismos)',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (regionalismos; lenguaje popular, regional) · DCNB p. 86 (formas orales: regionalismos) · la definición es redacción nuestra; «cipote» es un ejemplo del habla popular, el mismo de la misión de la conversación'},
  {q:'Se llama ___ al uso de una palabra con su significado directo, sin sugerir nada más.',a:'denotación',acc:['denotación','denotacion'],k:'cp-denotacion',fuente:'Guía (Aprende): Denotación y connotación · Ficha, página 2 (4. Denotación y connotación)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (denotación y connotación) · DCNB pp. 108, 146 y 183 (valor denotativo) · la definición es redacción nuestra'},
  {q:'La ropa que se puede lavar es ropa ___.',a:'lavable',acc:['lavable'],k:'cp-lavable',fuente:'Guía (Aprende): Sufijos de todos los días · Actividad Clasifica: Lleva sufijo (pieza detrás)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 113 y 191 (sufijos) · el significado de este sufijo es redacción nuestra, pendiente de verificar con la RAE'},
  {q:'Lo contrario de «reír» es ___.',a:'llorar',acc:['llorar'],k:'cp-llorar',fuente:'Guía (Aprende): Sinónimos y antónimos · Actividad Reto: Antónimos',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (sinónimos y antónimos) · la definición de antónimo es redacción nuestra'},
  {q:'Lo contrario de «ganar» es ___.',a:'perder',acc:['perder'],k:'cp-perder',fuente:'Guía (Aprende): Sinónimos y antónimos · Actividad Clasifica: Son antónimos',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (sinónimos y antónimos) · la definición de antónimo es redacción nuestra'}
];
const evalPRBankNuevo=[
  {term:'bio-',def:'Vida',k:'pr-bio',fuente:'Guía (Aprende): Prefijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 153, 154 y 191 (prefijos griegos y sus significados) · el significado es redacción nuestra; se le llama prefijo como hace el DCNB, aunque el diccionario de la RAE (DLE) lo llama elemento compositivo'},
  {term:'geo-',def:'Tierra',k:'pr-geo',fuente:'Guía (Aprende): Prefijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 153, 154 y 191 (prefijos griegos y sus significados) · el significado es redacción nuestra; se le llama prefijo como hace el DCNB, aunque el diccionario de la RAE (DLE) lo llama elemento compositivo'},
  {term:'tele-',def:'Lejos, a distancia',k:'pr-tele',fuente:'Guía (Aprende): Prefijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 153, 154 y 191 (prefijos griegos y sus significados) · el significado es redacción nuestra; se le llama prefijo como hace el DCNB, aunque el diccionario de la RAE (DLE) lo llama elemento compositivo'},
  {term:'micro-',def:'Muy pequeño',k:'pr-micro',fuente:'Guía (Aprende): Prefijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 153, 154 y 191 (prefijos griegos y sus significados) · el significado es redacción nuestra; se le llama prefijo como hace el DCNB, aunque el diccionario de la RAE (DLE) lo llama elemento compositivo'},
  {term:'foto-',def:'Luz',k:'pr-foto',fuente:'Guía (Aprende): Prefijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB pp. 153, 154 y 191 (prefijos griegos y sus significados) · el significado es redacción nuestra; se le llama prefijo como hace el DCNB, aunque el diccionario de la RAE (DLE) lo llama elemento compositivo'},
  {term:'-ante',def:'El que hace la acción',k:'pr-ante',fuente:'Guía (Aprende): Sufijos de todos los días · Ficha, página 3 (5. La palabra por dentro)',grado:'9.º',curriculo:'Prog. 7-9, PDF p. 23 (prefijos, sufijos) · DCNB p. 191 (sufijos: on, ona, ito, ante) · el significado de este sufijo (el de «cantante» y «estudiante») es redacción nuestra, pendiente de verificar con la RAE'},
  {term:'Enorme',def:'Significa lo mismo que «gigantesco»',k:'pr-enorme',fuente:'Guía (Aprende): Sinónimos y antónimos · Actividad Clasifica: Son sinónimos',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (sinónimos y antónimos) · la definición de sinónimo es redacción nuestra'},
  {term:'Ausente',def:'Significa lo contrario de «presente»',k:'pr-ausente',fuente:'Guía (Aprende): Sinónimos y antónimos · Ficha, página 1 (1. Sinónimos y antónimos)',grado:'7.º a 9.º',curriculo:'Prog. 7-9, PDF pp. 7, 15 y 23 (sinónimos y antónimos) · la definición de antónimo es redacción nuestra'},
  {term:'Chunche',def:'Palabra del habla popular de Honduras: cosa, objeto',k:'pr-chunche',fuente:'Guía (Aprende): Palabras técnicas y palabras de aquí · Actividad Clasifica: Habla regional o popular',grado:'7.º',curriculo:'Prog. 7-9, PDF p. 7 (regionalismos; lenguaje popular, regional) · DCNB p. 86 (formas orales: popular, regionalismos) · el ejemplo, el mismo de la misión de la conversación (misiones/3ciclo-n1-conversacion/) · el significado es el de uso común; la definición de regionalismo es redacción nuestra'},
  {term:'Residuo',def:'Término de las Matemáticas: lo que sobra de una división',k:'pr-residuo',fuente:'Guía (Aprende): Palabras técnicas y palabras de aquí · Ficha, página 2 (3. Vocabulario técnico y regionalismos)',grado:'7.º y 8.º',curriculo:'Prog. 7-9, PDF pp. 7 y 15 (vocabulario técnico; vocabulario técnico y científico) · el término, el mismo de la misión de la conversación (misiones/3ciclo-n1-conversacion/) · qué es vocabulario técnico es redacción nuestra'}
];

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
// Los casos son malentendidos de verdad: una palabra con dos significados
// en un mensaje sin contexto, una sigla o un término técnico que el lector
// no conoce. Todas las situaciones son inventadas, también la nota de la
// alerta amarilla. La pauta del caso es la
// misma para los dos casos del banco: por eso tienen la misma forma (un
// mensaje corto, dos personas que entienden dos cosas y un tropiezo).
const critTextos={
  caso:'Caso de análisis: una palabra, dos significados',
  decision:'Toma de decisiones: una palabra que el lector no conoce',
  decisionPregunta:'¿Qué harías tú con esa palabra o con esa oración? Explica por qué, pensando en quién va a leer o a escuchar.',
  decisionPreguntaHoja:'¿Qué harías tú con esa palabra? Explica por qué, pensando en quien la va a leer.',
  comparacionPregunta:'1. ¿Cuál de los dos casos usa las palabras con su significado directo y cuál sugiere algo más? 2. ¿Para qué sirve cada uno? 3. ¿En qué palabras se nota la diferencia?'
};
const critCaseBank=[
  {k:'ca-banco',txt:'Marlon le escribe a su prima: «Te espero a las tres en el banco». Él pensaba en el banco de madera del parque; ella fue al banco donde su mamá cobra el sueldo. Estuvieron una hora esperándose en lugares distintos.'},
  {k:'ca-llave',txt:'Don Beto, con las manos ocupadas debajo del lavamanos, le grita a su nieto: «¡Tráeme la llave!». Él pensaba en la llave de tuercas; el nieto corrió y le llevó la llave del portón. Mientras tanto, el agua siguió saliendo.'},
];
const critCaseQuestions=[
  '1. ¿Qué palabra se entendió de dos maneras y cuáles son sus dos significados?',
  '2. ¿Por qué cada persona entendió algo distinto?',
  '3. ¿Qué pasó por ese malentendido?',
  '4. Escribe el mensaje otra vez, de modo que solo se pueda entender de una manera.',
];
const critCaseGuides=[
  'Es una palabra con varios significados (polisemia): la misma palabra nombra dos cosas distintas.',
  'Al mensaje le faltó contexto: ninguna otra palabra decía cuál de los dos significados valía, y cada quien pensó en el que tenía más cerca.',
  'Se perdió tiempo y no se hizo lo que se necesitaba.',
  'Respuesta abierta: basta agregar las palabras que aclaran (el lugar exacto, o para qué sirve la herramienta).',
];
const critErrorBank=[
  {k:'er-sinonimos',txt:'"Los sinónimos significan exactamente lo mismo, así que cualquiera sirve en cualquier oración. Y un antónimo es una palabra que suena parecido a otra".',
   g1:'los sinónimos significan lo mismo o casi lo mismo, pero no siempre se pueden cambiar: depende del contexto.',
   g2:'un antónimo es la palabra que significa lo contrario, no la que suena parecido.'},
  {k:'er-prefijo',txt:'"El prefijo va al final de la palabra y el sufijo al principio. Además, cualquier prefijo se le puede pegar a cualquier palabra y siempre sale una palabra que existe".',
   g1:'es al revés: el prefijo va delante de la raíz y el sufijo, detrás.',
   g2:'no toda combinación forma una palabra: la que uno arma se comprueba en el diccionario antes de usarla.'},
];
const critDecisionBank=[
  'Escribes para el periódico mural una nota sobre la temporada de lluvias y pones: «COPECO declaró alerta amarilla». Un compañero de séptimo grado la lee y te dice que no sabe qué es COPECO.',
  'Tu equipo va a exponer sobre el manglar ante los padres de familia. El borrador dice: «Los factores abióticos del ecosistema condicionan a los productores». Tu abuela, que irá a la exposición, lo leyó y no entendió la oración.',
];
const critDecisionGuide='Las siglas y las palabras técnicas son exactas, pero solo sirven si quien lee las entiende. Se recomienda no quitarlas, sino explicarlas la primera vez que aparecen: escribir el nombre completo junto a la sigla (Comisión Permanente de Contingencias) y poner al lado de cada término técnico una explicación con palabras de todos los días o un ejemplo. Así el texto sigue siendo exacto y lo entiende también quien no conoce el tema.';
const critCompareBank=[
  {k:'co-lluvia',a:'«La lluvia es agua que cae de las nubes en forma de gotas».',b:'«La lluvia tocaba el techo con sus dedos de cristal».',
   ga:'usa las palabras con su significado directo (denotación): es lenguaje no literario y sirve para informar.',
   gb:'usa las palabras para sugerir algo más (connotación): es lenguaje literario y busca la belleza.',
   gr:'Los dos hablan de lo mismo. El primero lo explica; el segundo lo hace sentir. Se nota en «dedos de cristal»: la lluvia no tiene dedos.'},
  {k:'co-manglar',a:'«El manglar es un bosque costero de árboles que viven con las raíces en agua salada».',b:'«Los manglares son las guarderías del mar».',
   ga:'dice lo que el manglar es, con palabras exactas: su valor es denotativo.',
   gb:'no habla de un lugar con niños: sugiere que allí nacen y crecen protegidos muchos peces. Su valor es connotativo.',
   gr:'Los dos son verdad y sirven para cosas distintas: el primero define; el segundo ayuda a imaginar y a recordar. Se nota en «guarderías».'},
];
const critCauseBank=[
  {k:'cau-siglas',cause:'Un aviso de la escuela trae tres siglas sin su nombre completo.',guide:'Quien no las conoce no entiende el aviso, o lo entiende mal.'},
  {k:'cau-repetir',cause:'En un párrafo de cinco renglones, un alumno escribe siete veces «bonito».',guide:'El texto se vuelve pesado y pobre; con sinónimos diría lo mismo sin repetirse.'},
  {k:'cau-inventa',cause:'Alguien arma una palabra con un prefijo y la pone en su informe sin comprobar si existe.',guide:'Puede estar usando una palabra que nadie más emplea: el lector no la entiende o duda de todo el trabajo.'},
  {k:'cau-primera',cause:'Una alumna busca una palabra en el diccionario y copia la primera definición, sin leer las demás.',guide:'Puede quedarse con un significado que no es el de su oración y entender al revés lo que leía.'},
  {k:'cau-hambre',cause:'Un niño pequeño oye a su tía decir «me muero de hambre» y lo toma al pie de la letra.',guide:'Se asusta, porque entiende el significado directo y no lo que la frase sugiere: que ella tiene muchas ganas de comer.'},
];
const critEffectBank=[
  {k:'ef-exposicion',effect:'Toda la clase siguió sin tropiezos la exposición sobre los ecosistemas.',guide:'El equipo explicó cada término técnico la primera vez que lo dijo.'},
  {k:'ef-medicina',effect:'Dania pudo leer completo un folleto de salud lleno de palabras difíciles.',guide:'Tenía a mano un diccionario especializado y consultó cada término que no conocía.'},
  {k:'ef-pulperia',effect:'Un visitante de otro país preguntó qué era una «pulpería».',guide:'Es un regionalismo: en su país esa tienda tiene otro nombre.'},
  {k:'ef-poema',effect:'El poema de Keyla conmovió a todo el grado.',guide:'Escogió palabras que sugieren más de lo que dicen: comparó el aguacero con un llanto.'},
  {k:'ef-sierra',effect:'Nadie se confundió con el recado «La sierra está en la bodega, junto al martillo».',guide:'Las palabras «bodega» y «martillo» dejaron claro que se hablaba de la herramienta y no de las montañas.'},
  {k:'ef-chatear',effect:'Hoy mucha gente dice «chatear», una palabra que sus abuelos no usaron de niños.',guide:'Apareció una cosa nueva (conversar por escrito con un aparato) y la lengua necesitó un nombre para ella: un neologismo.'},
  {k:'ef-subterraneo',effect:'Óscar entendió la palabra «subterráneo» sin haberla visto nunca.',guide:'Reconoció una pieza: el prefijo «sub-», que significa «debajo».'},
];

// ===================== LABORATORIO =====================
// «La fábrica de palabras». Dos paneles.
//
// PANEL 1, armar. El alumno elige una palabra base y le pone, con botones,
// un prefijo, un sufijo o los dos. `salen` son las palabras de uso común
// que de verdad salen de esa base, con su significado y un ejemplo; la
// llave es «prefijo|sufijo». Toda otra combinación NO está en la lista, y
// el laboratorio lo dice así: «no está en la lista de este laboratorio».
// No dice «no existe»: en `_dev/` no hay diccionario de la RAE con qué
// acreditarlo, y el DCNB (p. 113) manda justamente a comprobar en el
// diccionario la palabra que uno crea. `conSufijo` es cómo queda escrita
// la base con cada sufijo (para poder mostrar también la combinación que
// no está); `prefijoComo`, cómo se escribe un prefijo delante de esa base
// (in- pasa a im- delante de b).
//
// PANEL 2, una palabra y varios significados: la misma palabra en tres
// oraciones. `sentido` es lo que significa ahí y `pista`, las palabras del
// contexto que lo dicen.
const fabricaPalabras={
  prefijos:{
    re:{txt:'re-',sig:'volver a'},
    des:{txt:'des-',sig:'lo contrario'},
    in:{txt:'in-',sig:'no'},
    sub:{txt:'sub-',sig:'debajo'},
    bi:{txt:'bi-',sig:'dos'},
    tri:{txt:'tri-',sig:'tres'},
    multi:{txt:'multi-',sig:'muchos'}
  },
  sufijos:{
    dor:{txt:'-dor',sig:'el que hace la acción'},
    ble:{txt:'-able',sig:'que se puede'},
    mente:{txt:'-mente',sig:'de manera'},
    idad:{txt:'-idad',sig:'cualidad'},
    ero:{txt:'-ero',sig:'oficio'},
    eria:{txt:'-ería',sig:'lugar donde se hace o se vende'},
    ito:{txt:'-ito',sig:'pequeño'},
    on:{txt:'-ón',sig:'grande'},
    ear:{txt:'-ear',sig:'forma un verbo'}
  },
  bases:[
    {id:'cargar',palabra:'cargar',prefijos:['re','des','sub'],sufijos:['dor','ble'],conSufijo:{dor:'cargador',ble:'cargable'},
     salen:{
       're|':{s:'Volver a cargar.',ej:'Hay que recargar la lámpara.'},
       'des|':{s:'Lo contrario de cargar: quitar la carga.',ej:'Ayúdame a descargar el camión.'},
       '|dor':{s:'La persona o el aparato que carga.',ej:'Préstame el cargador del teléfono.'},
       're|ble':{s:'Que se puede volver a cargar.',ej:'Compré una lámpara recargable.'},
       'des|ble':{s:'Que se puede descargar. Se dice de lo que se baja de internet a un aparato.',ej:'La guía trae un mapa descargable.'}
     }},
    {id:'contar',palabra:'contar',prefijos:['re','des','in'],sufijos:['dor','ble'],conSufijo:{dor:'contador',ble:'contable'},
     salen:{
       're|':{s:'Volver a contar.',ej:'Hubo que recontar los votos del grado.'},
       'des|':{s:'Quitar una parte de la cuenta: rebajar.',ej:'Me van a descontar diez lempiras.'},
       '|dor':{s:'La persona o el aparato que cuenta.',ej:'El contador de la luz marca lo que se gastó.'},
       '|ble':{s:'Que se puede contar.',ej:'Las sillas del aula son contables.'},
       'in|ble':{s:'Que no se puede contar.',ej:'Las estrellas son incontables.'}
     }},
    {id:'borrar',palabra:'borrar',prefijos:['in','re','des'],sufijos:['dor','ble'],conSufijo:{dor:'borrador',ble:'borrable'},prefijoComo:{in:'im'},
     salen:{
       '|dor':{s:'Lo que sirve para borrar. Tiene otro significado: la primera versión de un texto.',ej:'Pásame el borrador de la pizarra.'},
       '|ble':{s:'Que se puede borrar.',ej:'Usa un marcador borrable.'},
       'in|ble':{s:'Que no se puede borrar. Delante de b, el prefijo in- se escribe im-.',ej:'Fue un día imborrable.'}
     }},
    {id:'correcto',palabra:'correcto',prefijos:['in','re','sub'],sufijos:['mente','ito'],conSufijo:{mente:'correctamente',ito:'correctito'},
     salen:{
       'in|':{s:'Que no es correcto: que tiene errores.',ej:'El resultado de la suma es incorrecto.'},
       '|mente':{s:'De manera correcta.',ej:'Escribió correctamente su nombre.'},
       'in|mente':{s:'De manera incorrecta.',ej:'Midió incorrectamente la mesa.'}
     }},
    {id:'zapato',palabra:'zapato',prefijos:['re','sub'],sufijos:['ero','eria','ito','on'],conSufijo:{ero:'zapatero',eria:'zapatería',ito:'zapatito',on:'zapatón'},
     salen:{
       '|ero':{s:'Persona que hace o arregla zapatos.',ej:'El zapatero le cambió la suela.'},
       '|eria':{s:'Lugar donde se hacen o se venden zapatos.',ej:'Hay una zapatería frente al parque.'},
       '|ito':{s:'Zapato pequeño.',ej:'El bebé estrenó sus zapatitos.'},
       '|on':{s:'Zapato grande.',ej:'El payaso lleva unos zapatones rojos.'}
     }},
    {id:'color',palabra:'color',prefijos:['bi','tri','multi'],sufijos:['ear','ero'],conSufijo:{ear:'colorear',ero:'colorero'},
     salen:{
       'bi|':{s:'De dos colores.',ej:'El equipo usa una camiseta bicolor.'},
       'tri|':{s:'De tres colores.',ej:'Hizo una pulsera tricolor.'},
       'multi|':{s:'De muchos colores.',ej:'Colgaron una piñata multicolor.'},
       '|ear':{s:'Dar color: pintar. Con este mismo sufijo se formó «chatear».',ej:'Hay que colorear el mapa.'}
     }}
  ],
  sentidos:[
    {palabra:'raíz',oraciones:[
      {txt:'El mangle vive con las raíces en agua salada.',sentido:'La parte de la planta que crece hacia abajo y la sostiene.',pista:'«mangle» y «agua salada»: se habla de un árbol.'},
      {txt:'La raíz cuadrada de 196 es 14.',sentido:'Una operación de Matemáticas: 14 por 14 da 196.',pista:'«cuadrada» y los números: se habla de Matemáticas.'},
      {txt:'La raíz de «zapatero» y de «zapatería» es la misma.',sentido:'La parte de la palabra que no cambia.',pista:'«zapatero» y «zapatería»: se habla de palabras.'}
    ]},
    {palabra:'hoja',oraciones:[
      {txt:'Cayó una hoja del árbol de mango.',sentido:'La parte verde y plana de una planta.',pista:'«del árbol de mango».'},
      {txt:'Escribe tu nombre en la primera hoja del cuaderno.',sentido:'Cada una de las láminas de papel de un cuaderno o de un libro.',pista:'«escribe» y «del cuaderno».'},
      {txt:'La hoja del cuchillo está muy afilada.',sentido:'La parte de metal que corta.',pista:'«del cuchillo» y «afilada».'}
    ]},
    {palabra:'red',oraciones:[
      {txt:'El pescador lanzó la red al agua.',sentido:'Tejido de hilos para atrapar peces.',pista:'«pescador» y «al agua».'},
      {txt:'La escuela ya tiene red de internet.',sentido:'Conjunto de aparatos conectados entre sí.',pista:'«de internet».'},
      {txt:'Con una red neuronal, la máquina reconoce caras y voces.',sentido:'En Inteligencia Artificial: muchas cuentas pequeñas conectadas en capas. No es un cerebro.',pista:'«neuronal» y «la máquina»: se habla de tecnología.'}
    ]},
    {palabra:'nube',oraciones:[
      {txt:'Una nube gris tapó el sol.',sentido:'Lo que vemos en el cielo, de donde cae la lluvia.',pista:'«gris» y «tapó el sol».'},
      {txt:'Guardé las fotos en la nube.',sentido:'Lugar de internet donde se guardan archivos. Es un significado nuevo de una palabra de siempre.',pista:'«guardé las fotos».'},
      {txt:'Anda en las nubes: no oyó la pregunta.',sentido:'Distraído. Aquí la palabra no nombra nada del cielo: es connotación.',pista:'«no oyó la pregunta».'}
    ]}
  ]
};
