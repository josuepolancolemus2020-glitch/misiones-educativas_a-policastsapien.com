/* ============================================================
   M.E.T.A.S · Misión La Célula · CONTENIDO
   ------------------------------------------------------------
   Aquí solo hay datos: lo que la misión dice, pregunta y guarda. Ni
   una función. Quien pinta las pantallas, lleva el XP y arma el examen
   es el motor compartido (js/motor-mision.js), que es el mismo para
   todas las misiones que usan esta plantilla.

   Para corregir un dato de La Célula se toca ESTE archivo y nada más.

   ⚠️ El orden de cada banco del examen (evalTFBank, evalMCBank,
   evalCPBank, evalPRBank) no se cambia y no se le añaden preguntas en
   medio: el orden decide qué preguntas caen en cada forma, y hay
   claves impresas. Lo vigila _dev/verifica-formas-oro.js. Las
   preguntas nuevas van en el banco grande (los mismos nombres con
   «Nuevo» detrás), que es de donde salen las formas 31 a 50.

   Va como declaraciones de JavaScript y no como un archivo .json por
   dos razones medidas: los guiones de la página leen SAVE_KEY, xp y
   done en cuanto carga, así que el dato tiene que estar ANTES y no
   llegar después por la red; y Campeonísimo lee el banco de selección
   múltiple de cada misión buscando su declaración en los archivos de
   js/ de la misión. Por eso mismo, en estos comentarios no se escribe
   una declaración de ejemplo: el lector la tomaría por la de verdad.
   ============================================================ */

// ===================== TEXTOS PROPIOS DE LA MISIÓN =====================
// Lo que el motor escribe con el nombre o el color de esta misión.
const TEXTOS={
  titulo:'La Célula',
  emoji:'🔬',
  materia:'Ciencias Naturales',
  confeti:['#16a34a','#4ade80','#0d9488','#5eead4','#00b894'],
  impresion:{acento:'#27ae60',fondo:'#e8f8f5'},
  rutaEtiqueta:'Secuencia',
  widgetIdentifica:{paso:'Organelo',fin:'🎉 ¡Todos los organelos identificados!'},
  tareaIdentifica:['Copia en tu cuaderno; subraya, colorea o encierra el concepto de la célula indicado en cada oración. Escribe al lado qué tipo de elemento es.','<strong>Ejemplo:</strong> La mitocondria produce energía. → <span style="color:var(--jade);font-weight:700;">Organelo energético</span>'],
  tareaClasifica:{instruccion:'Copia la siguiente tabla en tu cuaderno. Para cada estructura de la célula, completa su tipo, características, ubicación y función.',columnas:['Estructura','Tipo','Características','Ubicación','Función']},
  diploma:['¡Sigue aprendiendo!','¡Muy buen trabajo!','¡Excelente citólogo!','¡Eres un experto en la célula!','¡Maestro de la Célula!']
};

// ===================== IDENTIDAD Y GUARDADO =====================
const SAVE_KEY='la_celula_v1';
const MXP=200;
const TOTAL_SECTIONS=13;

// ===================== LOGROS =====================
const ACHIEVEMENTS={
  primer_quiz:{icon:'🔬',label:'Primera prueba de la célula superada'},
  flash_master:{icon:'🃏',label:'Todas las flashcards de la célula exploradas'},
  clasif_pro:{icon:'🗂️',label:'Clasificador de organelos experto'},
  id_master:{icon:'🔍',label:'Identificador de estructuras celulares maestro'},
  reto_hero:{icon:'🏆',label:'Héroe del reto de clasificación celular'},
  nivel3:{icon:'🧫',label:'¡Citólogo! Nivel 3'},
  nivel5:{icon:'🥇',label:'¡Maestro de la Célula! Nivel 6'},
  widgets_master:{icon:'🧩',label:'Widgets de la célula dominados'}
};

// ===================== NIVELES =====================
const lvls=[{t:0,n:'Aprendiz 🌱'},{t:25,n:'Explorador 🔬'},{t:55,n:'Citólogo 🧫'},{t:90,n:'Biólogo 🧬'},{t:130,n:'Investigador 🔭'},{t:165,n:'Microbiólogo 🏅'},{t:190,n:'Maestro de la Célula 🏆'}];

// ===================== TARJETAS =====================
const fcData=[
  {w:'Célula',a:'🔬 <strong>Unidad estructural y funcional</strong> de todos los seres vivos. Es la porción más pequeña con vida propia: nace, se nutre, respira, se reproduce y muere. Todo organismo está formado por una o muchas células.'},
  {w:'Teoría Celular',a:'📜 Sus tres postulados: <strong>1)</strong> todos los seres vivos están formados por células; <strong>2)</strong> la célula es la unidad de vida; <strong>3)</strong> toda célula proviene de otra célula preexistente (Virchow).'},
  {w:'Membrana celular',a:'🧴 Capa delgada que <strong>rodea la célula</strong> y controla lo que entra y sale (permeabilidad selectiva). Formada por una <strong>bicapa de lípidos</strong> y proteínas. Presente en TODAS las células.'},
  {w:'Citoplasma',a:'💧 Medio gelatinoso (<strong>citosol</strong>) entre la membrana y el núcleo. Contiene agua, sales y los <strong>organelos</strong>. Allí ocurren muchas reacciones químicas de la célula.'},
  {w:'Núcleo',a:'🧠 Organelo que <strong>dirige la célula</strong> y guarda el <strong>ADN</strong>. Está rodeado por la envoltura nuclear. Solo lo tienen las células <strong>eucariotas</strong>. En su interior está el nucléolo.'},
  {w:'Célula procariota',a:'🦠 Célula <strong>sin núcleo definido</strong>: su ADN está libre en el citoplasma (nucleoide). Es pequeña y sencilla. Ejemplo: las <strong>bacterias</strong>. Fue la primera forma de vida en la Tierra.'},
  {w:'Célula eucariota',a:'🧬 Célula <strong>con núcleo definido</strong> y organelos rodeados de membrana. Más grande y compleja. Forma a los <strong>protistas, hongos, plantas y animales</strong> (incluido el ser humano).'},
  {w:'Mitocondria',a:'🔋 Organelo que produce <strong>energía (ATP)</strong> mediante la respiración celular. Se le llama la <strong>"central energética"</strong> de la célula. Abunda en células muy activas como las musculares.'},
  {w:'Cloroplasto',a:'🌿 Organelo <strong>exclusivo de la célula vegetal</strong>. Contiene <strong>clorofila</strong> (pigmento verde) y realiza la <strong>fotosíntesis</strong>: fabrica alimento a partir de luz, agua y CO₂.'},
  {w:'Pared celular',a:'🧱 Cubierta <strong>rígida</strong> por fuera de la membrana en células <strong>vegetales, hongos y bacterias</strong>. Da forma y protección. En las plantas está hecha de <strong>celulosa</strong>. La célula animal NO la tiene.'},
  {w:'Ribosoma',a:'⚙️ Organelo diminuto que <strong>fabrica las proteínas</strong> siguiendo las instrucciones del ADN. Puede estar libre en el citoplasma o pegado al retículo endoplasmático.'},
  {w:'Vacuola',a:'🫧 Bolsa que <strong>almacena</strong> agua, alimentos o desechos. En la <strong>célula vegetal</strong> es una sola, grande y central; en la animal son pequeñas y varias.'},
  {w:'ADN',a:'🧬 Molécula que guarda la <strong>información genética</strong> (los "planos" del ser vivo). Se encuentra en el núcleo, enrollado formando los <strong>cromosomas</strong>. Determina los caracteres hereditarios.'},
  {w:'Fotosíntesis',a:'☀️ Proceso por el cual la célula vegetal transforma <strong>luz solar + agua + CO₂</strong> en <strong>glucosa (alimento) y oxígeno</strong>. Ocurre en los cloroplastos. Base de casi todas las cadenas alimenticias.'},
];

// ===================== QUIZ =====================
const qzData=[
  {q:'¿Cuál es la unidad estructural y funcional de todos los seres vivos?',o:['a) El átomo','b) El órgano','c) El tejido','d) La célula'],c:3},
  {q:'¿Qué organelo produce la energía (ATP) de la célula mediante la respiración celular?',o:['a) Mitocondria','b) Ribosoma','c) Vacuola','d) Núcleo'],c:0},
  {q:'¿Qué tipo de célula NO tiene núcleo definido?',o:['a) Eucariota','b) Vegetal','c) Animal','d) Procariota'],c:3},
  {q:'¿Qué organelo, exclusivo de la célula vegetal, realiza la fotosíntesis?',o:['a) Mitocondria','b) Cloroplasto','c) Lisosoma','d) Ribosoma'],c:1},
  {q:'¿Qué estructura rígida rodea a la célula vegetal por fuera de la membrana?',o:['a) Citoplasma','b) Membrana nuclear','c) Pared celular','d) Vacuola'],c:2},
  {q:'¿Dónde se guarda el ADN en una célula eucariota?',o:['a) En el núcleo','b) En la mitocondria','c) En el citoplasma libre','d) En la membrana'],c:0},
  {q:'¿Qué organelo se encarga de fabricar las proteínas?',o:['a) Cloroplasto','b) Vacuola','c) Ribosoma','d) Lisosoma'],c:2},
  {q:'¿Qué diferencia principal tiene la célula animal respecto a la vegetal?',o:['a) Tiene núcleo','b) No tiene pared celular ni cloroplastos','c) No tiene membrana','d) No tiene mitocondrias'],c:1},
  {q:'Según la teoría celular, ¿de dónde proviene toda célula?',o:['a) De otra célula preexistente','b) De materia sin vida','c) Del aire','d) Del agua'],c:0},
];

// ===================== CLASIFICA =====================
const classGroups=[
  {label:['Célula Animal','Célula Vegetal'],headA:'🐾 Solo Célula Animal',headB:'🌿 Solo Célula Vegetal',colA:'ani',colB:'veg',
   words:[{w:'Centriolos',t:'ani'},{w:'Cloroplastos',t:'veg'},{w:'Pared celular',t:'veg'},{w:'Vacuola grande central',t:'veg'},{w:'Muchas vacuolas pequeñas',t:'ani'},{w:'Clorofila',t:'veg'},{w:'Forma irregular',t:'ani'},{w:'Forma rectangular fija',t:'veg'},{w:'Lisosomas abundantes',t:'ani'},{w:'Celulosa',t:'veg'}]},
  {label:['Procariota','Eucariota'],headA:'🦠 Célula Procariota',headB:'🧬 Célula Eucariota',colA:'pro',colB:'euc',
   words:[{w:'Sin núcleo definido',t:'pro'},{w:'Con núcleo definido',t:'euc'},{w:'ADN libre (nucleoide)',t:'pro'},{w:'ADN en el núcleo',t:'euc'},{w:'Bacterias',t:'pro'},{w:'Plantas y animales',t:'euc'},{w:'Sin organelos con membrana',t:'pro'},{w:'Con mitocondrias',t:'euc'},{w:'Muy pequeña y simple',t:'pro'},{w:'Grande y compleja',t:'euc'}]},
  {label:['Da energía','Fabrica/Almacena'],headA:'🔋 Relacionado con Energía',headB:'🏭 Fabrica o Almacena',colA:'ene',colB:'fab',
   words:[{w:'Mitocondria',t:'ene'},{w:'Ribosoma (proteínas)',t:'fab'},{w:'Cloroplasto',t:'ene'},{w:'Vacuola (almacena)',t:'fab'},{w:'Respiración celular',t:'ene'},{w:'Retículo endoplasmático',t:'fab'},{w:'ATP',t:'ene'},{w:'Aparato de Golgi',t:'fab'},{w:'Fotosíntesis',t:'ene'},{w:'Síntesis de proteínas',t:'fab'}]},
  {label:['Membrana/Cubierta','Interior'],headA:'🧴 Cubiertas de la célula',headB:'⚙️ Organelos internos',colA:'cub',colB:'org',
   words:[{w:'Membrana celular',t:'cub'},{w:'Núcleo',t:'org'},{w:'Pared celular',t:'cub'},{w:'Mitocondria',t:'org'},{w:'Envoltura nuclear',t:'cub'},{w:'Ribosoma',t:'org'},{w:'Bicapa de lípidos',t:'cub'},{w:'Aparato de Golgi',t:'org'},{w:'Cápsula bacteriana',t:'cub'},{w:'Vacuola',t:'org'}]},
];

// ===================== IDENTIFICA =====================
const idData=[
  {s:['La','mitocondria','produce','la','energía','de','la','célula.'],c:1,art:'Organelo que produce energía (ATP)'},
  {s:['El','núcleo','guarda','el','ADN','y','dirige','la','célula.'],c:1,art:'Organelo que dirige la célula y guarda el ADN'},
  {s:['El','cloroplasto','realiza','la','fotosíntesis','en','la','planta.'],c:1,art:'Organelo verde exclusivo de la célula vegetal'},
  {s:['La','membrana','controla','lo','que','entra','y','sale.'],c:1,art:'Cubierta que rodea la célula y regula el paso'},
  {s:['La','pared','celular','da','rigidez','a','la','planta.'],c:1,art:'Cubierta rígida ausente en la célula animal'},
  {s:['El','ribosoma','fabrica','las','proteínas','celulares.'],c:1,art:'Organelo que fabrica proteínas'},
  {s:['La','vacuola','almacena','agua','y','sustancias.'],c:1,art:'Bolsa de almacenamiento de la célula'},
  {s:['El','citoplasma','contiene','los','organelos','de','la','célula.'],c:1,art:'Medio gelatinoso donde flotan los organelos'},
];

// ===================== COMPLETA =====================
const cmpData=[
  {s:'La ___ es la unidad estructural y funcional de los seres vivos.',opts:['célula','molécula','pared'],c:0},
  {s:'La ___ produce la energía de la célula (ATP).',opts:['vacuola','mitocondria','membrana'],c:1},
  {s:'El ___ guarda el ADN y dirige la célula eucariota.',opts:['citoplasma','ribosoma','núcleo'],c:2},
  {s:'El ___ realiza la fotosíntesis en la célula vegetal.',opts:['cloroplasto','lisosoma','centriolo'],c:0},
  {s:'La célula ___ no tiene núcleo definido, como las bacterias.',opts:['eucariota','procariota','vegetal'],c:1},
  {s:'La ___ celular controla lo que entra y sale de la célula.',opts:['pared','vacuola','membrana'],c:2},
  {s:'Los ___ se encargan de fabricar las proteínas.',opts:['ribosomas','cloroplastos','lisosomas'],c:0},
  {s:'La pared celular de las plantas está hecha de ___.',opts:['quitina','celulosa','proteína'],c:1},
];

// ===================== WIDGETS =====================
// Widget 1: Ordenar procesos celulares
const routeSets=[
  {label:'Niveles de organización de la vida',steps:['Célula','Tejido','Órgano','Sistema de órganos','Organismo']},
  {label:'La fotosíntesis paso a paso',steps:['La clorofila capta la luz solar','La planta absorbe agua y CO₂','La energía se procesa en el cloroplasto','Se produce glucosa (alimento)','Se libera oxígeno al ambiente']},
  {label:'Ciclo celular (mitosis)',steps:['Interfase: la célula crece y duplica su ADN','Profase: se condensan los cromosomas','Metafase: los cromosomas se alinean al centro','Anafase: los cromosomas se separan','Telofase: se forman dos células hijas']},
];
// Widget 2: Identifica el organelo (IDs neuron* reutilizados)
const neuronPartes=[
  {desc:'Guarda el ADN y dirige todas las funciones de la célula',ans:'Núcleo',opts:['Núcleo','Mitocondria','Ribosoma','Vacuola']},
  {desc:'Produce la energía (ATP) mediante la respiración celular',ans:'Mitocondria',opts:['Núcleo','Mitocondria','Cloroplasto','Membrana']},
  {desc:'Realiza la fotosíntesis; solo está en la célula vegetal',ans:'Cloroplasto',opts:['Mitocondria','Cloroplasto','Vacuola','Ribosoma']},
  {desc:'Fabrica las proteínas de la célula',ans:'Ribosoma',opts:['Ribosoma','Cloroplasto','Núcleo','Vacuola']},
  {desc:'Rodea la célula y controla lo que entra y sale',ans:'Membrana celular',opts:['Pared celular','Membrana celular','Núcleo','Citoplasma']},
  {desc:'Cubierta rígida de celulosa; da forma a la célula vegetal',ans:'Pared celular',opts:['Membrana celular','Pared celular','Vacuola','Ribosoma']},
  {desc:'Bolsa que almacena agua, alimentos o desechos',ans:'Vacuola',opts:['Vacuola','Mitocondria','Núcleo','Ribosoma']},
  {desc:'Medio gelatinoso donde flotan los organelos',ans:'Citoplasma',opts:['Citoplasma','Membrana','Núcleo','Cloroplasto']},
];
// Widget 3: Organelo → Función (IDs neuro* reutilizados)
const neuroPairs=[
  {trans:'Núcleo',func:'Guarda el ADN y dirige la célula',opts:['Guarda el ADN y dirige la célula','Produce energía (ATP)','Fabrica proteínas','Realiza la fotosíntesis']},
  {trans:'Mitocondria',func:'Produce energía (ATP)',opts:['Guarda el ADN y dirige la célula','Produce energía (ATP)','Almacena agua y desechos','Da rigidez a la célula']},
  {trans:'Cloroplasto',func:'Realiza la fotosíntesis',opts:['Realiza la fotosíntesis','Produce energía (ATP)','Guarda el ADN y dirige la célula','Fabrica proteínas']},
  {trans:'Ribosoma',func:'Fabrica proteínas',opts:['Fabrica proteínas','Realiza la fotosíntesis','Almacena agua y desechos','Guarda el ADN y dirige la célula']},
  {trans:'Vacuola',func:'Almacena agua, alimentos o desechos',opts:['Almacena agua, alimentos o desechos','Produce energía (ATP)','Realiza la fotosíntesis','Fabrica proteínas']},
];
// Widget 4: Estructura → ¿En qué célula se encuentra? (IDs enfer* reutilizados)
const enfermedadData=[
  {disease:'Cloroplasto',characteristic:'Solo en la célula vegetal',opts:['Solo en la célula vegetal','Solo en la célula animal','En ambas células','En ninguna célula']},
  {disease:'Pared celular',characteristic:'En vegetales, hongos y bacterias (no en animales)',opts:['En vegetales, hongos y bacterias (no en animales)','Solo en la célula animal','Solo en células procariotas','En ninguna célula']},
  {disease:'Mitocondria',characteristic:'En ambas células (animal y vegetal)',opts:['Solo en la célula vegetal','Solo en la célula animal','En ambas células (animal y vegetal)','Solo en bacterias']},
  {disease:'Centriolos',characteristic:'Principalmente en la célula animal',opts:['Principalmente en la célula animal','Solo en la célula vegetal','Solo en bacterias','En ninguna célula']},
  {disease:'Núcleo definido',characteristic:'En células eucariotas (no en bacterias)',opts:['En células eucariotas (no en bacterias)','Solo en procariotas','En todas las células','En ninguna célula']},
  {disease:'Vacuola central grande',characteristic:'Característica de la célula vegetal',opts:['Característica de la célula vegetal','Característica de la célula animal','Solo en bacterias','En ninguna célula']},
];

// ===================== RETO =====================
const retoPairs=[
  {label:['Animal','Vegetal'],btnA:'🐾 Animal',btnB:'🌿 Vegetal',colA:'ani',colB:'veg',
   words:[{w:'Cloroplastos',t:'veg'},{w:'Centriolos',t:'ani'},{w:'Pared celular',t:'veg'},{w:'Sin pared celular',t:'ani'},{w:'Vacuola central grande',t:'veg'},{w:'Muchas vacuolas pequeñas',t:'ani'},{w:'Clorofila',t:'veg'},{w:'Forma irregular',t:'ani'},{w:'Celulosa',t:'veg'},{w:'Lisosomas abundantes',t:'ani'}]},
  {label:['Procariota','Eucariota'],btnA:'🦠 Procariota',btnB:'🧬 Eucariota',colA:'pro',colB:'euc',
   words:[{w:'Bacteria',t:'pro'},{w:'Planta',t:'euc'},{w:'Sin núcleo',t:'pro'},{w:'Con núcleo',t:'euc'},{w:'ADN libre',t:'pro'},{w:'ADN en el núcleo',t:'euc'},{w:'Animal',t:'euc'},{w:'Nucleoide',t:'pro'},{w:'Con mitocondrias',t:'euc'},{w:'Muy pequeña',t:'pro'}]},
  {label:['Cubierta','Organelo'],btnA:'🧴 Cubierta',btnB:'⚙️ Organelo',colA:'cub',colB:'org',
   words:[{w:'Membrana celular',t:'cub'},{w:'Núcleo',t:'org'},{w:'Pared celular',t:'cub'},{w:'Mitocondria',t:'org'},{w:'Cápsula bacteriana',t:'cub'},{w:'Ribosoma',t:'org'},{w:'Bicapa de lípidos',t:'cub'},{w:'Vacuola',t:'org'},{w:'Envoltura nuclear',t:'cub'},{w:'Cloroplasto',t:'org'}]},
];

// ===================== GENERADOR DE TAREAS =====================
const identifyTaskDB=[
  {s:'La célula es la unidad estructural y funcional de todos los seres vivos: la porción más pequeña con vida propia.',type:'Unidad estructural y funcional de la vida'},
  {s:'El núcleo guarda el ADN y dirige todas las actividades de la célula eucariota.',type:'Núcleo: dirección y ADN'},
  {s:'La mitocondria produce la energía (ATP) mediante la respiración celular; es la "central energética".',type:'Mitocondria: producción de energía'},
  {s:'El cloroplasto, con su clorofila, realiza la fotosíntesis; solo existe en la célula vegetal.',type:'Cloroplasto: fotosíntesis'},
  {s:'La membrana celular rodea la célula y controla, de forma selectiva, lo que entra y sale.',type:'Membrana celular: permeabilidad selectiva'},
  {s:'La pared celular es una cubierta rígida de celulosa que da forma y protección a la célula vegetal.',type:'Pared celular: rigidez vegetal'},
  {s:'Los ribosomas son organelos diminutos que fabrican las proteínas siguiendo las instrucciones del ADN.',type:'Ribosoma: síntesis de proteínas'},
  {s:'La célula procariota no tiene núcleo definido; su ADN está libre en el citoplasma. Ejemplo: las bacterias.',type:'Célula procariota (sin núcleo)'},
  {s:'La célula eucariota tiene núcleo definido y organelos con membrana. Forma a protistas, hongos, plantas y animales.',type:'Célula eucariota (con núcleo)'},
  {s:'La teoría celular afirma que toda célula proviene de otra célula preexistente.',type:'Teoría celular (postulado de Virchow)'},
];
const classifyTaskDB=[
  {w:'Núcleo',gen:'Organelo de control',n:'Contiene el ADN',g:'Solo eucariotas',t:'Dirige la célula y guarda la información genética'},
  {w:'Mitocondria',gen:'Organelo energético',n:'Membrana doble',g:'Animal y vegetal',t:'Produce energía (ATP) por respiración celular'},
  {w:'Cloroplasto',gen:'Organelo energético',n:'Contiene clorofila',g:'Solo vegetal',t:'Realiza la fotosíntesis'},
  {w:'Membrana celular',gen:'Cubierta',n:'Bicapa de lípidos',g:'Todas las células',t:'Controla lo que entra y sale (permeabilidad selectiva)'},
  {w:'Pared celular',gen:'Cubierta rígida',n:'De celulosa',g:'Vegetal, hongos, bacterias',t:'Da forma y protección'},
  {w:'Ribosoma',gen:'Organelo fabricante',n:'Muy pequeño',g:'Todas las células',t:'Fabrica las proteínas'},
  {w:'Vacuola',gen:'Organelo de almacén',n:'Grande y central en plantas',g:'Animal y vegetal',t:'Almacena agua, alimentos o desechos'},
  {w:'Citoplasma',gen:'Medio interno',n:'Gelatinoso (citosol)',g:'Todas las células',t:'Contiene los organelos; allí ocurren reacciones químicas'},
];
const completeTaskDB=[
  {s:'La ___ es la unidad estructural y funcional de los seres vivos.',opts:['pared','célula','molécula'],ans:'célula'},
  {s:'La ___ produce la energía (ATP) de la célula.',opts:['vacuola','mitocondria','membrana'],ans:'mitocondria'},
  {s:'El ___ guarda el ADN y dirige la célula.',opts:['núcleo','ribosoma','citoplasma'],ans:'núcleo'},
  {s:'El ___ realiza la fotosíntesis en la célula vegetal.',opts:['cloroplasto','lisosoma','centriolo'],ans:'cloroplasto'},
  {s:'La célula ___ no tiene núcleo definido.',opts:['eucariota','procariota','animal'],ans:'procariota'},
  {s:'La ___ celular controla lo que entra y sale.',opts:['pared','membrana','vacuola'],ans:'membrana'},
  {s:'Los ___ fabrican las proteínas de la célula.',opts:['ribosomas','cloroplastos','lisosomas'],ans:'ribosomas'},
  {s:'La pared celular vegetal está hecha de ___.',opts:['quitina','celulosa','proteína'],ans:'celulosa'},
];
const explainQuestions=[
  {q:'¿Qué es la célula y por qué se dice que es la unidad de la vida?',ans:'La célula es la porción más pequeña de un ser vivo con vida propia: se nutre, respira, crece, se reproduce y muere. Todos los organismos están formados por una o muchas células.'},
  {q:'Menciona y explica los tres postulados de la teoría celular.',ans:'1) Todos los seres vivos están formados por células; 2) la célula es la unidad estructural y funcional de la vida; 3) toda célula proviene de otra célula preexistente.'},
  {q:'¿Cuáles son las principales diferencias entre la célula animal y la vegetal?',ans:'La vegetal tiene pared celular (celulosa), cloroplastos y una vacuola central grande. La animal no tiene pared ni cloroplastos, tiene vacuolas pequeñas y centriolos, y forma irregular.'},
  {q:'¿Qué diferencia hay entre una célula procariota y una eucariota?',ans:'La procariota no tiene núcleo definido (ADN libre en el citoplasma) ni organelos con membrana; ej. bacterias. La eucariota tiene núcleo definido y organelos con membrana; ej. plantas y animales.'},
  {q:'Explica la función de la mitocondria y del cloroplasto. ¿En qué se parecen y en qué se diferencian?',ans:'Ambos manejan energía. La mitocondria libera energía (ATP) de los nutrientes (respiración) y está en células animales y vegetales. El cloroplasto fabrica alimento con luz (fotosíntesis) y solo está en la vegetal.'},
];

// ===================== SOPA DE LETRAS =====================
const sopaSets=[
  {size:10,grid:[
    ['C','E','L','U','L','A','X','Y','Z','A'],
    ['P','Q','R','S','T','U','V','W','Z','D'],
    ['N','U','C','L','E','O','H','I','J','N'],
    ['B','C','D','E','F','G','H','I','J','K'],
    ['M','E','M','B','R','A','N','A','U','V'],
    ['M','N','O','P','Q','R','S','T','U','V'],
    ['R','I','B','O','S','O','M','A','G','H'],
    ['K','L','M','N','O','P','Q','R','S','T'],
    ['V','A','C','U','O','L','A','U','V','W'],
    ['A','B','C','D','E','F','G','H','I','J']
  ],words:[
    {w:'CELULA',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]]},
    {w:'ADN',cells:[[0,9],[1,9],[2,9]]},
    {w:'NUCLEO',cells:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]]},
    {w:'MEMBRANA',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7]]},
    {w:'RIBOSOMA',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[6,6],[6,7]]},
    {w:'VACUOLA',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5],[8,6]]}
  ]},
  {size:10,grid:[
    ['C','I','T','O','P','L','A','S','M','A'],
    ['B','C','D','E','F','G','H','I','J','K'],
    ['P','A','R','E','D','L','M','N','O','P'],
    ['Q','R','S','T','U','V','W','X','Y','Z'],
    ['M','I','T','O','S','I','S','A','B','C'],
    ['D','E','F','G','H','I','J','K','L','M'],
    ['E','N','Z','I','M','A','N','O','P','Q'],
    ['R','S','T','U','V','W','X','Y','Z','A'],
    ['C','E','L','U','L','A','B','C','D','E'],
    ['G','E','N','F','H','I','J','K','L','M']
  ],words:[
    {w:'CITOPLASMA',cells:[[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],[0,8],[0,9]]},
    {w:'PARED',cells:[[2,0],[2,1],[2,2],[2,3],[2,4]]},
    {w:'MITOSIS',cells:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6]]},
    {w:'ENZIMA',cells:[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5]]},
    {w:'CELULA',cells:[[8,0],[8,1],[8,2],[8,3],[8,4],[8,5]]},
    {w:'GEN',cells:[[9,0],[9,1],[9,2]]}
  ]}
];

// ===================== EXAMEN CONCEPTUAL =====================
// UN DATO, UNA PREGUNTA. Cada forma saca cinco de cada banco y pueden caer
// juntas cualesquiera, así que ninguna pregunta pide un dato que otra ya pide
// (su `k` no se repite) y ninguna respuesta aparece escrita en otra pregunta,
// tampoco como opción equivocada: en números la pista se cuela como NÚMERO.
// Lo comprueba `_dev/verifica-examen-sin-pistas.js`.
//
// ⚠️ Y ninguna la contesta la historia de don Tulio ni su animación
// (js/animacion-herida.js). La historia dice que la carne nueva salió de
// «algo que ya estaba vivo ahí», que es «la cosa más pequeña que puede estar
// viva»; la animación enseña la piel de cerca y cómo las células se dividen,
// de una salen dos, hasta cerrar la herida. Por eso se fueron «la célula es
// la porción más pequeña que tiene vida propia», «toda célula nueva sale de
// otra», «para formar piel nueva en la herida de don Tulio, sus células se
// ___» y «la célula nace, se nutre, crece, se ___ y muere»: ahí la animación
// deja escrito «se divide», y el alumno que lo copiaba salía marcado mal
// habiendo entendido. Las que entraron preguntan otra cosa de la misión,
// sacada de su Aprende y de su Laboratorio.
const evalTFBank=[
  {q:'Robert Hooke llamó «celdas» a los cuartitos que vio.',a:true,k:'tf-hooke'},
  {q:'Todos los organismos, desde el más pequeño hasta un árbol, están formados por células.',a:true,k:'tf-todos'},
  {q:'Las células no necesitan alimento.',a:false,k:'tf-alimento'},
  {q:'La teoría celular la construyeron varios científicos.',a:true,k:'tf-varios'},
  {q:'La célula animal y la vegetal tienen la misma forma.',a:false,k:'tf-misma-forma'},
  {q:'La célula se descubrió hace muy poco, cuando ya había computadoras.',a:false,k:'tf-reciente'},
  {q:'Solo algunas células tienen una capa que las separa de lo de afuera.',a:false,k:'tf-capa'},
  {q:'Las primeras formas de vida en la Tierra fueron células sencillas.',a:true,k:'tf-primeras'},
  {q:'Una ameba está formada por una sola célula.',a:true,k:'tf-ameba'},
  {q:'Dentro de la célula ocurren reacciones químicas.',a:true,k:'tf-reacciones'}
];
const evalMCBank=[
  {q:'¿Qué instrumento hace falta para ver casi todas las células?',o:['a) El telescopio','b) El microscopio','c) El termómetro','d) La brújula'],a:1,k:'mc-microscopio'},
  {q:'¿Qué tipo de célula forma el cuerpo humano?',o:['a) Procariota','b) Mineral','c) Eucariota','d) Sin vida'],a:2,k:'mc-eucariota'},
  {q:'¿Qué clase de célula es una bacteria?',o:['a) Procariota','b) Eucariota','c) Vegetal','d) Animal'],a:0,k:'mc-procariota'},
  {q:'¿Qué pigmento verde capta la luz en las plantas?',o:['a) La hemoglobina','b) La melanina','c) La clorofila','d) El caroteno'],a:2,k:'mc-clorofila'},
  {q:'¿Qué gas libera una planta cuando fabrica su alimento?',o:['a) Dióxido de carbono','b) Nitrógeno','c) Humo','d) Oxígeno'],a:3,k:'mc-oxigeno'},
  {q:'¿Qué forma tiene la célula vegetal?',o:['a) Redonda y blanda','b) Rectangular y fija','c) De estrella','d) Cambia cada día'],a:1,k:'mc-forma-vegetal'},
  {q:'¿Cuántas células tiene, más o menos, el cuerpo humano?',o:['a) 37','b) 37 mil','c) 37 millones','d) 37 billones'],a:3,k:'mc-37-billones'},
  {q:'¿Cuántos postulados tiene la teoría celular?',o:['a) Tres','b) Dos','c) Cinco','d) Diez'],a:0,k:'mc-postulados'},
  {q:'¿Quién enunció «omnis cellula e cellula»?',o:['a) Robert Hooke','b) Isaac Newton','c) Rudolf Virchow','d) Charles Darwin'],a:2,k:'mc-virchow'},
  {q:'¿En qué unidad se mide el tamaño de una célula?',o:['a) En metros','b) En micrómetros','c) En kilogramos','d) En litros'],a:1,k:'mc-micrometros'}
];
const evalCPBank=[
  {q:'La célula de un músculo y la de un nervio son distintas porque están ___.',a:'especializadas',acc:['especializadas'],k:'cp-especializadas'},
  {q:'La información hereditaria de la célula se guarda en el ___.',a:'ADN',acc:['ADN'],k:'cp-adn'},
  {q:'Las plantas fabrican su alimento con la luz por medio de la ___.',a:'fotosíntesis',acc:['fotosíntesis','fotosintesis'],k:'cp-fotosintesis'},
  {q:'Un ser formado por muchas células se llama ___.',a:'pluricelular',acc:['pluricelular','multicelular'],k:'cp-pluricelular'},
  {q:'La energía que usa la célula se guarda en una molécula llamada ___.',a:'ATP',acc:['ATP'],k:'cp-atp'},
  {q:'La cubierta de la célula vegetal está hecha de ___.',a:'celulosa',acc:['celulosa'],k:'cp-celulosa'},
  {q:'Robert Hooke vio las primeras células en un trozo de ___.',a:'corcho',acc:['corcho'],k:'cp-corcho'},
  {q:'El alimento que fabrica la planta con la luz es un azúcar llamado ___.',a:'glucosa',acc:['glucosa'],k:'cp-glucosa'},
  {q:'Como cualquier ser vivo, la célula nace, crece y al final ___.',a:'muere',acc:['muere'],k:'cp-muere'},
  {q:'Los organelos son pequeñas ___ con funciones específicas.',a:'máquinas',acc:['máquinas','maquinas'],k:'cp-maquinas'}
];
const evalPRBank=[
  {term:'Membrana celular',def:'Controla lo que entra y sale',k:'pr-membrana'},
  {term:'Mitocondria',def:'Central energética de la célula',k:'pr-mitocondria'},
  {term:'Ribosoma',def:'Fabrica las proteínas',k:'pr-ribosoma'},
  {term:'Vacuola',def:'Almacén de agua, alimento o desechos',k:'pr-vacuola'},
  {term:'Núcleo',def:'Centro de mando de la célula',k:'pr-nucleo'},
  {term:'Citoplasma',def:'Medio gelatinoso donde flotan los organelos',k:'pr-citoplasma'},
  {term:'Cloroplasto',def:'Donde la planta fabrica su alimento',k:'pr-cloroplasto'},
  {term:'Pared celular',def:'Protege por fuera a la célula de la planta',k:'pr-pared'},
  {term:'Centriolo',def:'Lo tiene la célula animal y no la vegetal',k:'pr-centriolo'},
  {term:'Unicelular',def:'Ser formado por una sola célula',k:'pr-unicelular'}
];

// ══════════ Formas deterministas v1 (M.E.T.A.S, jul 2026) ══════════
// Las formas de antes, las que tienen clave impresa. No se sube este
// número para ofrecer más formas: las nuevas salen del banco grande de abajo.
const EVAL_FORMAS = 30;

// ===================== EXAMEN CONCEPTUAL · BANCO GRANDE =====================
// Los cuatro bancos de arriba son de diez, y cada forma saca cinco: el alumno
// que se aprende las primeras formas se sabe el banco entero. Estos cuatro
// son preguntas NUEVAS para las formas 31 a 50. Cada una de esas formas lleva,
// por sección, tres de aquí y dos del banco de antes; las reparte el motor
// (js/motor-misiones.js) sin que dos formas lleven el mismo conjunto.
//
// ⚠️ Van en arreglos APARTE a propósito. Añadir una pregunta a un banco de
// arriba cambiaría las formas 1 a 30, que tienen clave impresa.
// ⚠️ Y el orden de estos tampoco se cambia una vez aprobados: decide qué
// preguntas caen en cada forma nueva.
//
// De dónde salen. De lo que la misión ya enseña: la ficha imprimible, la guía
// (la sección Aprende) y las actividades. Cada pregunta lo anota en `fuente`.
// Antes de escribirlas se contó qué preguntaban la ficha y las actividades:
// las 75 preguntas de las actividades piden 17 datos, y diez de ellos ya los
// pide el examen (la mitocondria, diez veces entre todo). Un dato repetido
// cuenta UNA vez: el que ya está arriba no vuelve a entrar aquí, y el que
// sale en varias actividades entra una sola vez, con todas sus fuentes.
//
// Las mismas reglas de arriba, y contra los dos bancos a la vez, porque en
// una forma nueva caen juntas preguntas de los dos:
// · UN DATO, UNA PREGUNTA: ninguna `k` de aquí repite una de arriba.
// · Ninguna respuesta, de aquí o de arriba, aparece escrita en otra pregunta.
//   Por eso aquí no se nombra al ADN, al ATP ni a los organelos de los
//   pareados de arriba fuera de un pareado: se dice «centrales energéticas»,
//   «material hereditario», «la capa que controla lo que entra y sale».
// · Ninguna la contesta la historia de don Tulio ni su animación.
// Lo comprueba `_dev/verifica-examen-sin-pistas.js`, y cuántas formas hay y
// cuánto de cada forma nueva sale de aquí, `_dev/verifica-conceptual-banco-grande.js`.
const evalTFBankNuevo=[
  {q:'La célula animal fabrica su propio alimento con la luz del sol.',a:false,k:'tf-animal-luz',fuente:'Ficha, página 3 (6. Errores comunes) · Ficha, página 2 (tabla Animal vs. Vegetal)'},
  {q:'Una lechuga marchita se pone firme en agua porque el agua entra en sus células.',a:true,k:'tf-lechuga',fuente:'Actividad Laboratorio: Membrana, Dato curioso y Función (ósmosis)'},
  {q:'Casi todas las células de tu cuerpo guardan la misma información hereditaria.',a:true,k:'tf-misma-informacion',fuente:'Actividad Laboratorio: Núcleo, Dato curioso'},
  {q:'En la célula vegetal, las bolsas de almacén son muchas y pequeñas.',a:false,k:'tf-bolsas',fuente:'Ficha, página 2 (tabla Animal vs. Vegetal) · Actividad «¿En qué célula se encuentra?» 6'},
  {q:'Una bacteria es más grande y compleja que una célula de tu cuerpo.',a:false,k:'tf-bacteria-grande',fuente:'Ficha, página 2 (2. Procariota vs. Eucariota)'},
  {q:'Un perro y una planta son seres formados por una sola célula.',a:false,k:'tf-perro',fuente:'Ficha, página 1 (Idea clave) · Guía (Aprende): Organismos unicelulares y pluricelulares'},
  {q:'Se cree que algunos organelos fueron, hace muchísimo tiempo, bacterias que empezaron a vivir dentro de otras células.',a:true,k:'tf-bacterias-antiguas',fuente:'Ficha, página 3 (Dato curioso) · Actividad Laboratorio: Mitocondria, Dato curioso'},
  {q:'Las células de las plantas también tienen «centrales energéticas».',a:true,k:'tf-plantas-centrales',fuente:'Ficha, página 3 (4. Los organelos y sus funciones) · Actividad «¿En qué célula se encuentra?» 3'},
  {q:'Solo las células de los animales fabrican proteínas.',a:false,k:'tf-proteinas-todas',fuente:'Ficha, página 3 (4. Los organelos y sus funciones)'},
  {q:'Los hongos fabrican su alimento con la luz, igual que las plantas.',a:false,k:'tf-hongos-luz',fuente:'Ficha, página 3 (5. La fotosíntesis)'}
];
const evalMCBankNuevo=[
  {q:'¿En qué año se descubrió la célula?',o:['a) 1492','b) 1665','c) 1821','d) 1969'],a:1,k:'mc-1665',fuente:'Ficha, página 1 (Dato clave) · Guía (Aprende): ¿Qué es la Célula?'},
  {q:'¿Qué células tienen más «centrales energéticas»?',o:['a) Las que no gastan energía','b) Las que gastan poca energía','c) Las que guardan su energía','d) Las que gastan mucha energía'],a:3,k:'mc-mas-centrales',fuente:'Actividad Laboratorio: Mitocondria, Función · Actividad Tarjetas: Mitocondria'},
  {q:'Si se estirara todo el material hereditario de una sola de tus células, ¿cuánto mediría?',o:['a) Menos que una pestaña','b) Lo que mide tu dedo','c) Más que la altura de una persona','d) Lo que mide una cancha de fútbol'],a:2,k:'mc-dos-metros',fuente:'Actividad Laboratorio: Núcleo, Dato curioso'},
  {q:'¿Cuál de estas células NO tiene una cubierta rígida por fuera?',o:['a) La de un animal','b) La de una planta','c) La de un hongo','d) La de una bacteria'],a:0,k:'mc-sin-cubierta',fuente:'Actividad Tarjetas: Pared celular · Actividad Quiz 8 · Actividad «¿En qué célula se encuentra?» 2'},
  {q:'En un ser formado por muchas células, ¿cómo trabajan estas?',o:['a) Cada una por su lado','b) Todas juntas','c) Solo de noche','d) Una sola a la vez'],a:1,k:'mc-juntas',fuente:'Ficha, página 1 (Idea clave) · Guía (Aprende): Organismos unicelulares y pluricelulares'},
  {q:'Los frijoles, el maíz y el café que se cultivan en Honduras, ¿de qué están formados?',o:['a) De minerales sin vida','b) De células animales','c) De células vegetales','d) De bacterias'],a:2,k:'mc-frijoles',fuente:'Ficha, página 4 (En Honduras)'},
  {q:'¿Cuál de estas cosas NO está formada por células?',o:['a) Una flor','b) Un zancudo','c) Un pez','d) Una piedra'],a:3,k:'mc-piedra',fuente:'Ficha, página 5 (Ponte a prueba, III.5; con otras opciones)'},
  {q:'¿Qué forma tiene la célula animal?',o:['a) Irregular','b) De cubo','c) De ladrillo','d) De triángulo'],a:0,k:'mc-forma-animal',fuente:'Ficha, página 2 (tabla Animal vs. Vegetal) · Actividad Clasifica: Célula Animal'},
  {q:'¿Con qué proceso obtiene la célula su energía?',o:['a) La división celular','b) La respiración celular','c) La teoría celular','d) La pared celular'],a:1,k:'mc-respiracion',fuente:'Ficha, página 3 (4. Los organelos y sus funciones) · Actividad Laboratorio: Mitocondria, Función'},
  {q:'¿Qué hace una célula justo antes de dividirse?',o:['a) Se agranda y duplica su contenido','b) Se encoge y se arruga','c) Expulsa su agua y se seca','d) Se queda sin energía'],a:0,k:'mc-antes-de-dividirse',fuente:'Actividad Secuencia: Ciclo celular (mitosis), primer paso'}
];
const evalCPBankNuevo=[
  {q:'En la capa que rodea a la célula hay proteínas que funcionan como canales y como ___.',a:'puertas',acc:['puertas'],k:'cp-puertas',fuente:'Actividad Laboratorio: Membrana, Estructura'},
  {q:'El ___ fértil está lleno de seres vivos de una sola célula.',a:'suelo',acc:['suelo'],k:'cp-suelo',fuente:'Ficha, página 4 (En Honduras)'},
  {q:'Las «centrales energéticas» de tus células las heredaste solo de tu ___.',a:'madre',acc:['madre','mamá','mama'],k:'cp-madre',fuente:'Actividad Laboratorio: Mitocondria, Dato curioso'},
  {q:'Las dos células que salen de una división se llaman células ___.',a:'hijas',acc:['hijas'],k:'cp-hijas',fuente:'Actividad Secuencia: Ciclo celular (mitosis), último paso'},
  {q:'La capa que controla lo que entra y sale de la célula no es rígida: es delgada y ___.',a:'flexible',acc:['flexible','elástica','elastica'],k:'cp-flexible',fuente:'Ficha, página 3 (6. Errores comunes) · Actividad Laboratorio: Membrana, Estructura'},
  {q:'Tus células producen energía todo el tiempo, incluso mientras tú ___.',a:'duermes',acc:['duermes'],k:'cp-duermes',fuente:'Actividad Laboratorio: Mitocondria, Dato curioso'},
  {q:'Las proteínas se arman siguiendo las ___ que da el material hereditario.',a:'instrucciones',acc:['instrucciones'],k:'cp-instrucciones',fuente:'Guía (Aprende): Los Organelos y sus funciones · Actividad Tarjetas: Ribosoma'},
  {q:'En una planta, las células que fabrican alimento abundan en las ___, que es donde llega más luz.',a:'hojas',acc:['hojas'],k:'cp-hojas',fuente:'Actividad Laboratorio: Cloroplasto, ¿En qué célula?'},
  {q:'En los niveles de organización de la vida, después de la célula sigue el ___.',a:'tejido',acc:['tejido'],k:'cp-tejido',fuente:'Actividad Secuencia: Niveles de organización de la vida'},
  {q:'La teoría celular es uno de los pilares de una ciencia: la ___.',a:'biología',acc:['biología','biologia'],k:'cp-biologia',fuente:'Guía (Aprende): La Teoría Celular'}
];
const evalPRBankNuevo=[
  {term:'Envoltura nuclear',def:'Cubierta que rodea al centro de mando',k:'pr-envoltura',fuente:'Actividad Clasifica: Cubiertas de la célula · Actividad Tarjetas: Núcleo · Actividad Laboratorio: Núcleo, Estructura'},
  {term:'Nucleoide',def:'Zona donde queda suelto el material hereditario cuando no hay núcleo',k:'pr-nucleoide',fuente:'Ficha, página 2 (2. Procariota vs. Eucariota) · Actividad Clasifica: Célula Procariota · Actividad Reto: Procariota'},
  {term:'Mitosis',def:'División con la que una célula se reproduce',k:'pr-mitosis',fuente:'Actividad Secuencia: Ciclo celular (mitosis) · Actividad Laboratorio: Núcleo, Función'},
  {term:'Glóbulo rojo',def:'Célula que al madurar pierde su centro de mando',k:'pr-globulo-rojo',fuente:'Actividad Laboratorio: Núcleo, Dato curioso'},
  {term:'Procariota',def:'Célula sin núcleo definido',k:'pr-sin-nucleo',fuente:'Ficha, página 2 (2. Procariota vs. Eucariota) · Actividad Quiz 3 · Actividad Completa 5'},
  {term:'Eucariota',def:'Célula con núcleo definido',k:'pr-con-nucleo',fuente:'Ficha, página 2 (2. Procariota vs. Eucariota) · Actividad «¿En qué célula se encuentra?» 5'},
  {term:'Cápsula',def:'Cubierta que llevan por fuera algunas bacterias',k:'pr-capsula',fuente:'Actividad Clasifica: Cubiertas de la célula · Actividad Reto: Cubierta'},
  {term:'Sistema de órganos',def:'Nivel de organización que va justo antes del organismo completo',k:'pr-sistema',fuente:'Actividad Secuencia: Niveles de organización de la vida'},
  {term:'Lípidos',def:'Grasas que forman la capa que rodea a la célula',k:'pr-lipidos',fuente:'Guía (Aprende): Membrana celular · Actividad Laboratorio: Membrana, Estructura'},
  {term:'Alga',def:'No es una planta, pero también fabrica su alimento con la luz',k:'pr-alga',fuente:'Ficha, página 3 (5. La fotosíntesis) · Actividad Laboratorio: Cloroplasto, ¿En qué célula?'}
];

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
// ⚠️ Pensamiento crítico, con la misma regla: «las células no están vivas»,
// «la célula aparece de la nada» y «nadie ve las células de su piel a simple
// vista» los contestaba la historia de don Tulio o su animación, que enseña
// la piel de muy cerca. Los que entraron salen de otra parte de la misión: la
// membrana y la mitocondria, que están en la célula animal y en la vegetal, y
// la piedra, que no está hecha de células. Ninguno nombra la pared ni los
// cloroplastos, que son lo que el caso I pide reconocer.
// Lo que la hoja de la prueba crítica dice con el tema de esta misión: el
// rótulo del caso y de la decisión, y lo que se pregunta en la decisión y en
// la comparación. Lo demás de la hoja (corrige el error, causas y efectos, el
// encabezado) es igual en todas las misiones y lo escribe el motor. La
// pregunta de la decisión va más corta en papel, para que quepa en la hoja.
const critTextos={
  caso:'Caso de análisis: observando una célula',
  decision:'Toma de decisiones: la fotosíntesis',
  decisionPregunta:'¿Qué recomendarías para que la planta recupere su salud? Explica por qué, relacionándolo con la fotosíntesis y los cloroplastos.',
  decisionPreguntaHoja:'¿Qué recomendarías para que la planta recupere su salud? Explica por qué, relacionándolo con la fotosíntesis.',
  comparacionPregunta:'1. ¿Qué tipo de célula u organelo corresponde a cada caso? 2. ¿Qué función cumple cada uno? 3. ¿Por qué no son lo mismo?'
};
const critCaseBank=[
  {k:'ca-ana',txt:'Ana observa al microscopio una célula que tiene pared celular, varios cloroplastos verdes y una gran vacuola central que ocupa casi todo su interior.'},
  {k:'ca-dibujo',txt:'Un estudiante dibuja una célula que presenta una cubierta rígida por fuera, cloroplastos con clorofila y una vacuola central muy grande.'},
  {k:'ca-hoja',txt:'En una muestra de una hoja se ve, al microscopio, una célula con forma rectangular fija, pared celular y muchos cloroplastos.'},
  {k:'ca-verde',txt:'Bajo el microscopio aparece una célula verde, con pared de celulosa y una vacuola central enorme que empuja al núcleo hacia un lado.'},
  {k:'ca-maria',txt:'María examina una célula de una planta y anota que tiene pared celular, cloroplastos y una vacuola central que ocupa gran parte del espacio.'},
  {k:'ca-forma',txt:'Se observa una célula con forma fija, cubierta rígida externa, pigmentos verdes en su interior y una sola vacuola grande y central.'},
];
const critCaseQuestions=[
  '1. ¿Es una célula animal o vegetal? Justifica con dos estructuras observadas.',
  '2. ¿A qué reino podría pertenecer el organismo? ¿Por qué?',
  '3. ¿Cómo obtiene su alimento esta célula?',
  '4. ¿Qué le pasaría a la célula si le quitáramos los cloroplastos?',
];
const critCaseGuides=[
  'Es una célula VEGETAL: tiene pared celular y cloroplastos, estructuras ausentes en la célula animal, además de una vacuola central grande.',
  'Pertenece al reino Plantae (o a un alga del reino Protista): son organismos eucariotas con cloroplastos y pared de celulosa.',
  'Fabrica su propio alimento mediante la fotosíntesis, usando la luz solar captada por la clorofila de los cloroplastos.',
  'Sin cloroplastos no podría hacer fotosíntesis: dejaría de producir su propio alimento y se debilitaría por falta de energía.',
];
const critErrorBank=[
  {k:'er-nucleo-mitocondria',txt:'"El núcleo produce la energía de la célula, mientras que la mitocondria guarda el ADN y dirige todas sus funciones".',
   g1:'la mitocondria es la que produce la energía (ATP) por respiración celular, no el núcleo.',
   g2:'el núcleo es el que guarda el ADN y dirige la célula, no la mitocondria.'},
  {k:'er-membrana',txt:'"La membrana solo la tiene la célula animal: la de la planta no la necesita".',
   g1:'la membrana está en todas las células, también en la de la planta.',
   g2:'la necesita: es la que controla lo que entra y sale de la célula.'},
  {k:'er-mitocondria',txt:'"Las mitocondrias solo están en las células de los animales: las plantas no las necesitan".',
   g1:'la célula de la planta también tiene mitocondrias.',
   g2:'las necesita: en las dos, la mitocondria produce la energía de la célula.'},
  {k:'er-todas-iguales',txt:'"En un perro todas las células son iguales y hacen el mismo trabajo".',
   g1:'en un ser de muchas células, las células están especializadas.',
   g2:'cada tipo hace un trabajo distinto y todas trabajan juntas.'},
];
const critDecisionBank=[
  'Un agricultor coloca sus plantas en un cuarto oscuro y nota que se ponen amarillas, débiles y dejan de crecer.',
  'Una estudiante deja una planta dentro de un clóset sin ventanas durante dos semanas y observa que sus hojas pierden el color verde.',
  'Un jardinero riega mucho una planta, pero la mantiene siempre alejada de toda luz; la planta se marchita poco a poco.',
  'En una casa colocan una maceta en un rincón sin luz; con los días, las hojas se ponen pálidas y la planta se debilita.',
  'Una familia guarda sus plantas en un sótano oscuro para protegerlas del frío, pero estas empiezan a perder su color verde.',
];
const critDecisionGuide='Las plantas necesitan LUZ para la fotosíntesis: sin luz, los cloroplastos no producen alimento ni clorofila, por eso las hojas pierden el color verde y la planta se debilita. Se recomienda ubicarlas donde reciban luz solar, no excederse en el riego y asegurar buen suelo; así la célula vegetal puede fabricar su energía y mantenerse sana.';
const critCompareBank=[
  {k:'co-pro-eu',a:'Una célula sin núcleo definido, con su material hereditario suelto, muy pequeña y sencilla.',b:'Una célula con núcleo definido y organelos rodeados de membrana, más grande y compleja.',
   ga:'Célula procariota (ejemplo: una bacteria).',
   gb:'Célula eucariota (ejemplo: una planta o un animal).',
   gr:'No son el mismo tipo: la diferencia clave es la presencia de un núcleo definido y de organelos con membrana.'},
];
const critCauseBank=[
  {k:'cau-sin-alimento',cause:'Una célula se queda sin alimento por mucho tiempo.',guide:'Se queda sin energía y muere, como cualquier ser vivo.'},
  {k:'cau-ameba',cause:'La única célula de una ameba muere.',guide:'Muere la ameba entera, porque era un ser unicelular.'},
];
const critEffectBank=[
  {k:'ef-piedra',effect:'Una piedra no crece ni se reproduce.',guide:'No está formada por células: no es un ser vivo.'},
  {k:'ef-proteinas',effect:'Una célula deja de producir proteínas.',guide:'Fallan sus ribosomas, que son los que las fabrican.'},
  {k:'ef-corcho',effect:'Un trozo de corcho, visto con aumento, parece un panal de cuartitos.',guide:'Son las cubiertas de células que ya murieron; así se descubrió la célula.'},
];

// ===================== LABORATORIO =====================
const parteData={
  nucleo:{
    nombre:'Núcleo',icon:'🧬',
    estructura:{title:'Estructura',info:'• <strong>Envoltura nuclear</strong>: doble membrana con poros que controlan el paso de sustancias<br>• <strong>Nucleoplasma</strong>: medio interno del núcleo<br>• <strong>Cromatina</strong>: ADN enrollado con proteínas; al dividirse forma los <strong>cromosomas</strong><br>• <strong>Nucléolo</strong>: cuerpo denso que fabrica los ribosomas<br>• Solo lo tienen las células <strong>eucariotas</strong>'},
    funcion:{title:'Función',info:'• <strong>Guarda el ADN</strong>, que contiene toda la información genética<br>• <strong>Dirige</strong> las actividades de la célula (nutrición, crecimiento, reproducción)<br>• Controla la <strong>síntesis de proteínas</strong> enviando instrucciones a los ribosomas<br>• Interviene en la <strong>división celular</strong> (mitosis y meiosis)<br>• El nucléolo produce las piezas de los ribosomas'},
    ubicacion:{title:'¿En qué célula?',info:'• Presente en <strong>TODAS las células eucariotas</strong>: protistas, hongos, plantas y animales<br>• <strong>Ausente</strong> en las células procariotas (bacterias), que tienen su ADN libre en el citoplasma (nucleoide)<br>• Suele ser el organelo más <strong>visible</strong> al microscopio óptico'},
    dato:{title:'Dato curioso',info:'• Si desenrolláramos todo el ADN de un solo núcleo humano, mediría cerca de <strong>2 metros</strong> de largo, ¡y cabe en algo microscópico!<br>• Casi todas tus células tienen el mismo ADN, pero cada tipo "lee" solo la parte que necesita<br>• Los glóbulos rojos maduros pierden el núcleo para transportar más oxígeno'}
  },
  mitocondria:{
    nombre:'Mitocondria',icon:'🔋',
    estructura:{title:'Estructura',info:'• <strong>Doble membrana</strong>: una externa lisa y una interna con pliegues (<strong>crestas</strong>)<br>• Las crestas aumentan la superficie para producir más energía<br>• <strong>Matriz mitocondrial</strong>: espacio interno con enzimas<br>• Tiene su <strong>propio ADN</strong> (¡diferente al del núcleo!)<br>• Forma alargada, como una "salchicha" microscópica'},
    funcion:{title:'Función',info:'• Realiza la <strong>respiración celular</strong>: combina nutrientes con oxígeno<br>• Produce <strong>energía en forma de ATP</strong>, el "combustible" de la célula<br>• Se le llama la <strong>"central energética"</strong> de la célula<br>• Cuanta más energía necesita una célula, <strong>más mitocondrias</strong> tiene (ej. células musculares)'},
    ubicacion:{title:'¿En qué célula?',info:'• Presente en <strong>ambas células eucariotas</strong>: animal y vegetal<br>• Una célula puede tener desde <strong>cientos hasta miles</strong> de mitocondrias<br>• Las células muy activas (músculo, hígado) tienen muchísimas<br>• Las bacterias NO tienen mitocondrias'},
    dato:{title:'Dato curioso',info:'• Las mitocondrias tienen su propio ADN y se cree que fueron <strong>bacterias antiguas</strong> que empezaron a vivir dentro de otras células (teoría endosimbiótica)<br>• Heredas tus mitocondrias <strong>solo de tu madre</strong><br>• ¡Producen energía todo el tiempo, incluso mientras duermes!'}
  },
  cloroplasto:{
    nombre:'Cloroplasto',icon:'🌿',
    estructura:{title:'Estructura',info:'• <strong>Doble membrana</strong> que lo rodea<br>• <strong>Tilacoides</strong>: sacos apilados en forma de "monedas" (grana)<br>• <strong>Clorofila</strong>: pigmento verde que capta la luz, dentro de los tilacoides<br>• <strong>Estroma</strong>: líquido interno donde se fabrica la glucosa<br>• Tiene su <strong>propio ADN</strong>, como la mitocondria'},
    funcion:{title:'Función',info:'• Realiza la <strong>fotosíntesis</strong>: transforma luz + agua + CO₂ en <strong>glucosa y oxígeno</strong><br>• La <strong>clorofila</strong> capta la energía de la luz solar<br>• Fabrica el <strong>alimento</strong> de la planta<br>• Da el <strong>color verde</strong> a hojas y tallos<br>• Base de casi todas las cadenas alimenticias del planeta'},
    ubicacion:{title:'¿En qué célula?',info:'• <strong>Exclusivo de la célula vegetal</strong> y de las algas<br>• La célula animal <strong>NO</strong> tiene cloroplastos (por eso no hace fotosíntesis)<br>• Abundan en las células de las <strong>hojas</strong>, donde llega más luz'},
    dato:{title:'Dato curioso',info:'• ¡El <strong>oxígeno que respiras</strong> proviene en gran parte de la fotosíntesis de las plantas y algas!<br>• Una sola célula de hoja puede tener <strong>decenas de cloroplastos</strong><br>• En otoño, la clorofila se degrada y aparecen otros colores (amarillo, rojo) en las hojas'}
  },
  membrana:{
    nombre:'Membrana celular',icon:'🧴',
    estructura:{title:'Estructura',info:'• <strong>Bicapa de lípidos</strong> (grasas) con proteínas incrustadas<br>• Es <strong>delgada, flexible y elástica</strong><br>• Las proteínas funcionan como "puertas" y "canales"<br>• Modelo del <strong>mosaico fluido</strong>: sus componentes se mueven<br>• Presente en <strong>TODAS las células</strong>'},
    funcion:{title:'Función',info:'• <strong>Rodea y delimita</strong> la célula, separándola del exterior<br>• Controla lo que entra y sale: <strong>permeabilidad selectiva</strong><br>• Deja pasar nutrientes y oxígeno; expulsa desechos<br>• Procesos de transporte: <strong>ósmosis</strong> (agua) y <strong>difusión</strong><br>• Protege el interior y recibe señales del ambiente'},
    ubicacion:{title:'¿En qué célula?',info:'• Presente en <strong>TODAS las células</strong>: procariotas y eucariotas, animales y vegetales<br>• En la célula vegetal está <strong>por dentro</strong> de la pared celular<br>• En la célula animal es la <strong>capa más externa</strong>'},
    dato:{title:'Dato curioso',info:'• La membrana es tan delgada que harían falta <strong>miles apiladas</strong> para igualar el grosor de una hoja de papel<br>• Cuando pones una lechuga marchita en agua, recupera su firmeza porque el agua entra por las membranas (ósmosis)<br>• Decide, molécula por molécula, qué entra a tu célula'}
  }
};
