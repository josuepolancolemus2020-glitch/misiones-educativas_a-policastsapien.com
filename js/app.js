'use strict';

/* ─────────────────────────────────────────────
   MISSIONS
───────────────────────────────────────────── */

const MISSIONS = [
  { id:  1, title: 'Los Adjetivos',                             subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '📝', url: '2y3ciclo-adjetivos/adjetivos-II-IIICiclo.html' },
  { id:  2, title: 'Los Verbos',                                subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '✍️', url: '2y3ciclo-verbos/verbos-II-III-ciclo-basica.html' },
  { id:  3, title: 'Los Sustantivos',                           subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '📖', url: '2y3ciclo-sustantivos/sustantivos-II-III-ciclo-basica.html' },
  { id:  4, title: 'Los Pronombres',                            subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '💬', url: '2y3ciclo-pronombres/pronombres-II-III-ciclo-basica.html' },
  { id:  5, title: 'El Adjetivo Avanzado',                      subject: 'español',     color: 'bach', grade: 'Bachillerato',   cycle: 'bach',     xp: 40, icon: '🎓', url: 'bach-uni-adjetivos/adjetivos-avanzado.html' },
  { id:  6, title: 'Números de Tres Cifras',                    subject: 'matemáticas', color: 'mat',  grade: '2° Grado',       cycle: '1ciclo',   xp: 20, icon: '🔢', url: '1ciclo-2º-grado/numeros-hasta-999.html' },
  { id:  7, title: 'Ángulos y Bisectriz',                       subject: 'matemáticas', color: 'mat',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '📐', url: '2y3ciclo-angulo-bisectriz/angulos-bisectriz_II y III-Ciclo_Básica.html' },
  { id:  8, title: 'Números Decimales',                         subject: 'matemáticas', color: 'mat',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '🔢', url: '2y3ciclo-numeros-decimales/2y3ciclo-numeros-decimales.html' },
  { id:  9, title: 'Las Eras Geológicas',                       subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 35, icon: '🦕', url: '2y3ciclo-eras-geológicas/eras_geológicas.html' },
  { id: 10, title: 'Áreas Protegidas de Honduras',              subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '🌿', url: '2y3ciclo-áreas-protegidas-de-honduras/2y3ciclo-áreas-protegidas-de-Honduras.html' },
  { id: 11, title: 'Geografía y Coordenadas',                   subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '🗺️', url: '2y3ciclo-geografía-coordenadas/2y3ciclo_geografia-coordenadas.html' },
  { id: 12, title: 'Continentes: Europa, Asia y África',        subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '🌍', url: '2y3ciclo-los-Continentes-Europa-Asia-y-Africa/2y3ciclo_geografia-continentes-eas.html' },
  { id: 13, title: 'Continentes: América, Oceanía y Antártida', subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '🌎', url: '2y3ciclo-los-continentes-América-Oceanía-Antártida/2y3ciclo-los-continentes-América-Oceanía-Antártida.html' },
];

const PROCERES_DATA = {
  MX: [
    { nombre: 'Miguel Hidalgo y Costilla', fecha: '1753 – 1811', desc: '«El Padre de la Patria». Sacerdote y líder que dio el famoso Grito de Dolores.', cita: 'El indulto es para los criminales, no para los defensores de la patria.', img: 'img/mexico_img/Miguel Idalgo.png' },
    { nombre: 'Benito Juárez', fecha: '1806 – 1872', desc: '«El Benemérito de las Américas». De origen zapoteca, estableció las bases de un Estado laico y moderno.', cita: 'Entre los individuos, como entre las naciones, el respeto al derecho ajeno es la paz.', img: 'img/mexico_img/Benito_juarez.png' },
    { nombre: 'Sor Juana Inés de la Cruz', fecha: '1648 – 1695', desc: '«La Décima Musa». Brillante escritora y filósofa que defendió el derecho a la educación.', cita: 'No estudio para saber más, sino para ignorar menos.', img: 'img/mexico_img/Sor_Juana_Inés de la Cruz.png' },
    { nombre: 'José María Morelos y Pavón', fecha: '1765 – 1815', desc: '«El Siervo de la Nación». Genio militar que sentó las bases de la igualdad social.', cita: 'Que la esclavitud se proscriba para siempre y lo mismo la distinción de castas.', img: 'img/mexico_img/josé_María Morelos.png' },
    { nombre: 'José Vasconcelos', fecha: '1882 – 1959', desc: '«El Maestro de la Juventud de América». Impulsó bibliotecas, escuelas y el muralismo.', cita: 'Por mi raza hablará el espíritu.', img: 'img/mexico_img/José_Vasconcelos.png' },
  ],
};

const SUBJECT_LABELS = {
  'español':     'Español',
  'matemáticas': 'Matemáticas',
  'naturales':   'C. Naturales',
  'sociales':    'C. Sociales',
};

const LEVELS = [
  { n: 1, min:   0, max:  99,       label: 'Explorador', emoji: '🌱' },
  { n: 2, min: 100, max: 249,       label: 'Aprendiz',   emoji: '📚' },
  { n: 3, min: 250, max: 499,       label: 'Estudioso',  emoji: '🔍' },
  { n: 4, min: 500, max: 799,       label: 'Académico',  emoji: '⚡' },
  { n: 5, min: 800, max: Infinity,  label: 'Sabio',      emoji: '🏆' },
];

/* ─────────────────────────────────────────────
   FRASES MOTIVACIONALES (50)
───────────────────────────────────────────── */

const FRASES = [
  { texto: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", autor: "Robert Collier" },
  { texto: "La educación es el arma más poderosa que puedes usar para cambiar el mundo.", autor: "Nelson Mandela" },
  { texto: "No importa cuán despacio vayas, siempre que no te detengas.", autor: "Confucio" },
  { texto: "El conocimiento es el único bien que crece cuanto más se comparte.", autor: "Proverbio" },
  { texto: "Nunca es demasiado tarde para aprender algo nuevo.", autor: "Anónimo" },
  { texto: "La perseverancia es el camino al éxito.", autor: "Charles Chaplin" },
  { texto: "Cada libro que lees es un mundo nuevo que descubres.", autor: "Anónimo" },
  { texto: "Un día sin aprender algo nuevo es un día perdido.", autor: "Albert Einstein" },
  { texto: "La constancia convierte lo ordinario en extraordinario.", autor: "Anónimo" },
  { texto: "Tu futuro se construye con lo que haces hoy.", autor: "Robert Kiyosaki" },
  { texto: "Primero aprende las reglas; luego juega mejor que nadie.", autor: "Albert Einstein" },
  { texto: "La mente que se abre a una nueva idea jamás volverá a su tamaño original.", autor: "Albert Einstein" },
  { texto: "El aprendizaje es un tesoro que te acompañará a todas partes.", autor: "Proverbio chino" },
  { texto: "Estudia, no para saber más, sino para saber mejor.", autor: "Séneca" },
  { texto: "Invertir en conocimiento siempre paga el mejor interés.", autor: "Benjamin Franklin" },
  { texto: "Los sueños no funcionan a menos que tú también lo hagas.", autor: "John C. Maxwell" },
  { texto: "El único límite a tu aprendizaje es el que tú mismo te pongas.", autor: "Anónimo" },
  { texto: "Cada pequeño avance de hoy es la gran diferencia de mañana.", autor: "Anónimo" },
  { texto: "La perseverancia convierte lo imposible en posible.", autor: "Anónimo" },
  { texto: "No hay atajos hacia el conocimiento verdadero.", autor: "Anónimo" },
  { texto: "Un buen estudiante nunca deja de aprender, incluso fuera del aula.", autor: "Anónimo" },
  { texto: "El esfuerzo de hoy es el orgullo de mañana.", autor: "Anónimo" },
  { texto: "Cada vez que estudias, te conviertes en una versión mejor de ti mismo.", autor: "Anónimo" },
  { texto: "La disciplina es el puente entre las metas y los logros.", autor: "Jim Rohn" },
  { texto: "El que estudia con constancia, cosecha con abundancia.", autor: "Proverbio" },
  { texto: "No te compares con otros; compárate con quien eras ayer.", autor: "Anónimo" },
  { texto: "Aprender es el regalo más valioso que te haces a ti mismo.", autor: "Anónimo" },
  { texto: "La educación no es llenar un balde, sino encender un fuego.", autor: "W.B. Yeats" },
  { texto: "Con dedicación y paciencia, cualquier meta es alcanzable.", autor: "Anónimo" },
  { texto: "Los grandes logros requieren tiempo. Dale tiempo a tu aprendizaje.", autor: "Anónimo" },
  { texto: "El conocimiento que no se usa es como una semilla que no se siembra.", autor: "Anónimo" },
  { texto: "Estudiar hoy es construir el puente hacia el futuro que sueñas.", autor: "Anónimo" },
  { texto: "Cada pregunta que haces hoy es una respuesta que tendrás mañana.", autor: "Anónimo" },
  { texto: "La inteligencia no es un don, es una habilidad que se desarrolla con práctica.", autor: "Carol Dweck" },
  { texto: "Los que no saben, aprenden. Los que aprenden, crecen. Los que crecen, triunfan.", autor: "Anónimo" },
  { texto: "Lee, aprende, cuestiona. Ese es el camino de los grandes.", autor: "Anónimo" },
  { texto: "La perseverancia no es una carrera larga; son muchas carreras cortas seguidas una tras otra.", autor: "Walter Elliot" },
  { texto: "El único fracaso verdadero es aquel del que no aprendemos nada.", autor: "John Powell" },
  { texto: "Aprende de ayer, vive para hoy, espera del mañana.", autor: "Albert Einstein" },
  { texto: "No te rindas. El principio siempre es la parte más difícil.", autor: "Anónimo" },
  { texto: "El esfuerzo constante da resultados que el talento solo no puede lograr.", autor: "Anónimo" },
  { texto: "Cada momento de estudio es una inversión que tu futuro yo agradecerá.", autor: "Anónimo" },
  { texto: "Sé curioso, no crítico. La curiosidad abre puertas que la duda cierra.", autor: "Walt Whitman" },
  { texto: "La educación es el pasaporte hacia el futuro, porque el mañana pertenece a quienes se preparan hoy.", autor: "Malcolm X" },
  { texto: "Nunca dejes de aprender, porque la vida nunca deja de enseñar.", autor: "Anónimo" },
  { texto: "Los grandes logros no son resultado de la suerte, sino de la constancia y la determinación.", autor: "Anónimo" },
  { texto: "Hoy es un buen día para aprender algo que no sabías ayer.", autor: "Anónimo" },
  { texto: "Un libro abierto es un cerebro que habla; cerrado, un amigo que espera.", autor: "Anónimo" },
  { texto: "El secreto de comenzar es dividir las tareas complejas en pequeñas acciones manejables.", autor: "Mark Twain" },
  { texto: "La curiosidad es el motor más poderoso del aprendizaje. Aliméntala cada día.", autor: "Anónimo" },
];

/* ─────────────────────────────────────────────
   DATOS POR PAÍS
───────────────────────────────────────────── */

const COUNTRY_DATA = {
  HN: {
    nombre: 'Honduras',
    bandera: '🇭🇳',
    lema: 'Libre, Soberana e Independiente',
    flagBg: 'linear-gradient(180deg,#0073CF 33.3%,#fff 33.3% 66.6%,#0073CF 66.6%)',
    simbolosMayores: [
      { emoji: '🇭🇳', nombre: 'Bandera Nacional', tipo: 'Símbolo patrio', img: 'img/honduras_img/simbolos/bandera.webp',
        info: 'Tres franjas horizontales azul-blanca-azul. Las cinco estrellas del centro representan a los países que formaron la República Federal de Centroamérica. Adoptada el 16 de septiembre de 1825.' },
      { emoji: '🛡️', nombre: 'Escudo de Armas', tipo: 'Símbolo patrio', img: 'img/honduras_img/simbolos/escudo.webp',
        info: 'Muestra un óvalo central con volcanes, el sol naciente, un arco iris y dos torres que representan las fortalezas del país. A los lados, dos cornucopias simbolizan la abundancia natural. Pinos enmarcan la escena. El texto reza: "República de Honduras, Libre, Soberana e Independiente — 15 de septiembre de 1821".' },
      { emoji: '🎵', nombre: 'Himno Nacional', tipo: 'Símbolo patrio',
        info: 'Letra de Augusto C. Coello y música del compositor alemán Carlos Hartling. Adoptado oficialmente el 15 de noviembre de 1915. Su coro comienza: "Tu bandera es un lampo de cielo…"' },
    ],
    simbolos: [
      { emoji: '🦜', nombre: 'Guara Roja', tipo: 'Ave nacional', img: 'img/honduras_img/simbolos/guacamaya.webp',
        info: 'Ara macao. Declarada ave nacional en 1993. Habita en los bosques tropicales de la Mosquitia hondureña. Su plumaje rojo, azul y amarillo la convierte en una de las aves más coloridas del mundo.' },
      { emoji: '🌺', nombre: 'Orquídea', tipo: 'Flor nacional', img: 'img/honduras_img/simbolos/orquidea.webp',
        info: 'Rhyncholaelia digbyana. Declarada flor nacional en 1969. De color blanco-verdoso con bordes en flecos. Reconocida por su exquisita fragancia nocturna y considerada una de las más bellas del continente.' },
      { emoji: '🌲', nombre: 'Pino', tipo: 'Árbol nacional', img: 'img/honduras_img/simbolos/pino.webp',
        info: 'Honduras posee la mayor cobertura de bosques de pino de toda Centroamérica. Cubre gran parte de las montañas y es fuente de vida para miles de familias y ecosistemas del país.' },
      { emoji: '🦌', nombre: 'Venado Cola Blanca', tipo: 'Mamífero nacional', img: 'img/honduras_img/simbolos/venado.webp',
        info: 'Odocoileus virginianus. Mamífero nacional de Honduras. Habita en bosques, sabanas y zonas rurales. Conocido por su elegancia y velocidad, ha sido parte de la cultura y tradición hondureña por siglos.' },
    ],
    tema: { brand: '#0F4C96', brandMid: '#1A6AC7', brandLight: '#4D9FD4' },
    curiosidades: [
      { texto: 'Las Ruinas de Copán contienen la "Escalinata Jeroglífica" más larga del mundo maya, con más de 2,500 bloques inscritos que narran la historia de la dinastía real.', categoria: 'Historia' },
      { texto: 'Honduras alberga la segunda barrera de coral más grande del mundo en su costa caribeña: el Sistema Arrecifal Mesoamericano, con miles de especies marinas.', categoria: 'Naturaleza' },
      { texto: 'El nombre "Honduras" proviene de una exclamación de Cristóbal Colón: "¡Gracias a Dios que hemos salido de estas honduras!", refiriéndose a las profundas aguas del Caribe.', categoria: 'Historia' },
      { texto: 'La moneda de Honduras se llama "Lempira", en honor al valiente cacique indígena que resistió la conquista española en el siglo XVI.', categoria: 'Civismo' },
      { texto: 'Honduras celebra su independencia el 15 de septiembre junto a Guatemala, El Salvador, Nicaragua y Costa Rica, pues estos cinco países se independizaron juntos en 1821.', categoria: 'Civismo' },
      { texto: 'La Biósfera del Río Plátano es la reserva tropical más grande de Centroamérica y fue declarada Patrimonio Natural de la Humanidad por la UNESCO.', categoria: 'Naturaleza' },
      { texto: 'La guara roja (macaw escarlata) es el ave nacional de Honduras. Habita en la Mosquitia y es símbolo de libertad y la rica biodiversidad hondureña.', categoria: 'Naturaleza' },
      { texto: 'Honduras tiene 18 departamentos. Su capital, Tegucigalpa, es una de las pocas capitales del mundo sin un sistema ferroviario dentro de la ciudad.', categoria: 'Geografía' },
      { texto: 'El pino es el árbol nacional de Honduras. El país tiene la mayor cobertura de bosques de pino de toda Centroamérica, cubriendo gran parte de sus montañas.', categoria: 'Naturaleza' },
      { texto: 'El Golfo de Fonseca es compartido por Honduras, El Salvador y Nicaragua, y fue históricamente una ruta estratégica de comercio en el Pacífico centroamericano.', categoria: 'Geografía' },
      { texto: 'La orquídea Rhyncholaelia digbyana es la flor nacional de Honduras, reconocida internacionalmente por su exquisita fragancia nocturna.', categoria: 'Naturaleza' },
      { texto: 'La ciudad de Copán Ruinas fue el centro cultural maya más importante del sur de Mesoamérica y alcanzó su apogeo entre los años 400 y 800 d.C.', categoria: 'Historia' },
    ],
  },
  MX: {
    nombre: 'México',
    bandera: '🇲🇽',
    lema: 'La Patria es Primero',
    flagBg: 'linear-gradient(90deg,#006847 33.3%,#fff 33.3% 66.6%,#CE1126 66.6%)',
    simbolosMayores: [
      { emoji: '🇲🇽', nombre: 'Bandera',  tipo: 'Símbolo patrio' },
      { emoji: '🛡️',  nombre: 'Escudo',   tipo: 'Símbolo patrio' },
      { emoji: '🎵',  nombre: 'Himno',    tipo: 'Símbolo patrio' },
    ],
    simbolos: [
      { emoji: '🦅', nombre: 'Águila Real',  tipo: 'Ave nacional'       },
      { emoji: '🌺', nombre: 'Dalia',        tipo: 'Flor nacional'      },
      { emoji: '🌳', nombre: 'Ahuehuete',    tipo: 'Árbol nacional'     },
      { emoji: '🐆', nombre: 'Jaguar',       tipo: 'Fauna emblemática'  },
    ],
    tema: { brand: '#006847', brandMid: '#008A5E', brandLight: '#3DAF72' },
    curiosidades: [
      { texto: 'El chocolate, el aguacate, el chile, el maíz y el tomate son originarios de México y fueron dados al mundo gracias a las civilizaciones mesoamericanas.', categoria: 'Cultura' },
      { texto: 'México tiene 35 sitios Patrimonio de la Humanidad reconocidos por la UNESCO, más que cualquier otro país de América Latina.', categoria: 'Cultura' },
      { texto: 'La Pirámide del Sol en Teotihuacán mide 65 metros de altura y fue, en su apogeo (siglo II d.C.), la tercera ciudad más grande del mundo.', categoria: 'Historia' },
      { texto: 'El "Día de Muertos" es una tradición declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO. Las familias honran a sus difuntos con altares y ofrendas coloridas.', categoria: 'Cultura' },
      { texto: 'El ajolote es una especie que solo existe naturalmente en el lago Xochimilco en Ciudad de México. Es famoso por su capacidad de regenerar extremidades y órganos completos.', categoria: 'Naturaleza' },
      { texto: 'La mariposa monarca realiza una migración de más de 4,500 km desde Canadá hasta los bosques de Michoacán, México, cada año sin fallar.', categoria: 'Naturaleza' },
      { texto: 'México tiene 68 lenguas indígenas nacionales reconocidas oficialmente por el gobierno, además del español, reflejando su enorme riqueza cultural.', categoria: 'Cultura' },
      { texto: 'La Ciudad de México fue construida sobre el antiguo lago Texcoco por los aztecas. Actualmente la ciudad se hunde varios centímetros cada año por el peso de sus edificios.', categoria: 'Historia' },
      { texto: 'El mariachi, la música emblemática de México, fue declarado Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en el año 2011.', categoria: 'Cultura' },
      { texto: 'México produce más del 50% del aguacate que se consume en todo el mundo, siendo el estado de Michoacán el principal productor mundial.', categoria: 'Economía' },
      { texto: 'La Universidad Nacional Autónoma de México (UNAM), fundada en 1551, es una de las universidades más antiguas y más grandes de toda América.', categoria: 'Educación' },
      { texto: 'El escudo de la bandera mexicana representa la leyenda azteca: un águila parada sobre un nopal devorando una serpiente, que marcó el lugar donde se fundó Tenochtitlán.', categoria: 'Civismo' },
    ],
  },
  GT: {
    nombre: 'Guatemala',
    bandera: '🇬🇹',
    lema: 'El País de la Eterna Primavera',
    flagBg: 'linear-gradient(90deg,#4997D0 33.3%,#fff 33.3% 66.6%,#4997D0 66.6%)',
    simbolosMayores: [
      { emoji: '🇬🇹', nombre: 'Bandera',  tipo: 'Símbolo patrio' },
      { emoji: '🛡️',  nombre: 'Escudo',   tipo: 'Símbolo patrio' },
      { emoji: '🎵',  nombre: 'Himno',    tipo: 'Símbolo patrio' },
    ],
    simbolos: [
      { emoji: '🦅', nombre: 'Quetzal',     tipo: 'Ave nacional'      },
      { emoji: '🌿', nombre: 'Monja Blanca', tipo: 'Flor nacional'    },
      { emoji: '🌳', nombre: 'Ceiba',       tipo: 'Árbol nacional'    },
      { emoji: '🏛️', nombre: 'Tikal',       tipo: 'Patrimonio UNESCO' },
    ],
    tema: { brand: '#1B5E9E', brandMid: '#2878C8', brandLight: '#5BA0E0' },
    curiosidades: [
      { texto: 'Guatemala es conocida como "El País de la Eterna Primavera" debido a su clima templado y agradable durante todo el año en gran parte de su territorio.', categoria: 'Geografía' },
      { texto: 'Tikal, en el Petén guatemalteco, fue una de las ciudades más poderosas del mundo maya. Sus pirámides superan los 70 metros de altura y dominaron la selva por siglos.', categoria: 'Historia' },
      { texto: 'El quetzal es el ave nacional de Guatemala y también el nombre de su moneda. Esta ave era sagrada para los mayas y simbolizaba la libertad, pues muere en cautiverio.', categoria: 'Cultura' },
      { texto: 'Guatemala tiene 33 volcanes, de los cuales 3 están activos. El volcán Santiaguito es uno de los más activos del mundo, en erupción casi continua desde 1922.', categoria: 'Naturaleza' },
      { texto: 'El lago Atitlán, rodeado de volcanes y pueblos indígenas mayas, fue considerado por el explorador Alexander von Humboldt como el lago más hermoso del mundo.', categoria: 'Naturaleza' },
      { texto: 'La Semana Santa en Antigua Guatemala es una de las celebraciones religiosas más coloridas del mundo, con impresionantes alfombras de aserrín y flores en las calles.', categoria: 'Cultura' },
      { texto: 'El Libro Sagrado Maya "Popol Vuh", que narra la creación del mundo según la cosmovisión maya-quiché, fue escrito originalmente en Guatemala en el siglo XVI.', categoria: 'Historia' },
      { texto: 'Guatemala tiene 22 grupos étnicos mayas diferentes que representan el 60% de la población, manteniendo vivas sus lenguas, trajes y tradiciones ancestrales.', categoria: 'Cultura' },
      { texto: 'Guatemala fue el primer país de Centroamérica en abolir la esclavitud, en el año 1824, apenas tres años después de su independencia en 1821.', categoria: 'Civismo' },
      { texto: 'Guatemala es el mayor productor y exportador de cardamomo a nivel mundial. Su cardamomo es considerado el más aromático y de mayor calidad del planeta.', categoria: 'Economía' },
      { texto: 'La biodiversidad de Guatemala incluye más de 8,000 especies de plantas, más de 900 especies de aves y unas 1,200 especies de mariposas registradas.', categoria: 'Naturaleza' },
      { texto: 'Antigua Guatemala, la antigua capital colonial, es Patrimonio de la Humanidad por la UNESCO y conserva una de las mejores arquitecturas barrocas de América.', categoria: 'Historia' },
    ],
  },
  SV: {
    nombre: 'El Salvador',
    bandera: '🇸🇻',
    lema: 'Dios, Unión, Libertad',
    flagBg: 'linear-gradient(180deg,#0F47AF 33.3%,#fff 33.3% 66.6%,#0F47AF 66.6%)',
    simbolosMayores: [
      { emoji: '🇸🇻', nombre: 'Bandera Nacional', tipo: 'Símbolo patrio', img: 'img/salvador_img/bandera_edit.webp',
        info: 'Tres franjas horizontales: azul, blanca y azul. El azul representa los dos océanos que bañan Centroamérica; el blanco simboliza la paz. El Escudo Nacional aparece en el centro de la franja blanca. Su diseño actual ha sido utilizado desde 1912.' },
      { emoji: '🛡️', nombre: 'Escudo de Armas', tipo: 'Símbolo patrio', img: 'img/salvador_img/escudo_edit.webp',
        info: 'Presenta un triángulo equilátero que simboliza la igualdad. Dentro se representan cinco volcanes, el océano Pacífico, el sol naciente y un arco iris. En la base del triángulo se lee el lema nacional: "DIOS UNIÓN LIBERTAD". El texto exterior reza: "REPÚBLICA DE EL SALVADOR EN LA AMERICA CENTRAL". Está enmarcado por ramas de laurel.' },
      { emoji: '🎵', nombre: 'Himno Nacional', tipo: 'Símbolo patrio',
        info: 'Letra del general Juan José Cañas y música del compositor italiano Juan Aberle. Fue adoptado oficialmente el 15 de septiembre de 1879. Su coro comienza: "Saludemos la Patria orgullosos…"' },
    ],
    simbolos: [
      { emoji: '🦜', nombre: 'Torogoz', tipo: 'Ave nacional', img: 'img/salvador_img/ave_edit.webp',
        info: 'Eumomota superciliosa. Declarado ave nacional en 1999. Se distingue por su plumaje verde esmeralda en el cuerpo, pecho naranja, marcas azul turquesa en la cabeza y sus características plumas caudales alargadas con extremos en forma de raqueta. Habita en zonas boscosas y quebradas.' },
      { emoji: '🌿', nombre: 'Flor de Izote', tipo: 'Flor nacional', img: 'img/salvador_img/flor_edit.webp',
        info: 'Yucca elephantipes. Declarada flor nacional en 1995. Planta de hojas largas y rígidas de color verde oscuro, con una espiga central que produce racimos de flores blancas acampanadas. Sus pétalos son comestibles y forman parte de la gastronomía tradicional salvadoreña.' },
      { emoji: '🌳', nombre: 'Maquilishuat', tipo: 'Árbol nacional', img: 'img/salvador_img/arbol_edit.webp',
        info: 'Tabebuia rosea. Declarado árbol nacional en 1939. Se caracteriza por su llamativa floración rosada o violeta que cubre toda la copa. Florece principalmente al inicio de la época seca, cuando el árbol pierde la mayoría de sus hojas, creando un espectacular manto de color.' },
      { emoji: '🌊', nombre: 'Costa Pacífica', tipo: 'Orgullo natural',
        info: 'El Salvador es el único país de Centroamérica con costa exclusivamente en el Océano Pacífico, sin acceso al Mar Caribe. Su litoral se extiende por aproximadamente 321 km y alberga importantes ecosistemas marinos, playas de arena volcánica y sitios de anidación de tortugas marinas.' },
    ],
    tema: { brand: '#1B3A8F', brandMid: '#2455CC', brandLight: '#5B8DEF' },
    curiosidades: [
      { texto: 'El Salvador es el país más pequeño de Centroamérica pero el más densamente poblado, con cerca de 300 personas por kilómetro cuadrado.', categoria: 'Geografía' },
      { texto: 'La pupusa es el plato nacional de El Salvador: una tortilla gruesa rellena de queso, frijoles o chicharrón. Tiene su propio día de celebración cada segundo domingo de noviembre.', categoria: 'Cultura' },
      { texto: 'El Salvador es el único país de Centroamérica sin costa en el Mar Caribe. Todo su litoral da al Océano Pacífico, con bellas playas de arena negra volcánica.', categoria: 'Geografía' },
      { texto: 'El volcán Izalco fue conocido históricamente como el "Faro del Pacífico". Estuvo en erupción casi continua por más de 200 años y servía de guía a los marineros.', categoria: 'Naturaleza' },
      { texto: 'El añil (índigo) producido en El Salvador durante la época colonial fue uno de los más cotizados del mundo y fue la principal fuente de riqueza del país antes del café.', categoria: 'Historia' },
      { texto: 'El Lago de Coatepeque es un cráter volcánico inundado con aguas de tonos turquesa, considerado uno de los cuerpos de agua más hermosos de Centroamérica.', categoria: 'Naturaleza' },
      { texto: 'El Cipitío y La Siguanaba son las figuras más famosas del folclore salvadoreño, leyendas que se transmiten de generación en generación en todo el país.', categoria: 'Cultura' },
      { texto: 'El Salvador celebra su independencia el 15 de septiembre de 1821, fecha que comparte con Guatemala, Honduras, Nicaragua y Costa Rica como hermanos centroamericanos.', categoria: 'Civismo' },
      { texto: 'El Parque Nacional El Imposible es el bosque más extenso y mejor conservado de El Salvador, protegiendo una diversidad extraordinaria de flora y fauna nativa.', categoria: 'Naturaleza' },
      { texto: 'El Salvador posee más de 20 volcanes. El de Santa Ana (Ilamatepec) es el más alto del país con 2,381 metros sobre el nivel del mar y un cráter espectacular.', categoria: 'Naturaleza' },
      { texto: 'El Salvador fue el primer país de América Latina en incluir el derecho al agua potable como un derecho fundamental en su Constitución Nacional.', categoria: 'Civismo' },
      { texto: 'La flor nacional de El Salvador es la Flor de Izote (Yucca elephantipes). Sus pétalos son un alimento tradicional muy apreciado en la gastronomía salvadoreña.', categoria: 'Cultura' },
    ],
  },
  NI: {
    nombre: 'Nicaragua',
    bandera: '🇳🇮',
    lema: 'Tierra de Poetas y Volcanes',
    flagBg: 'linear-gradient(180deg,#003893 33.3%,#fff 33.3% 66.6%,#003893 66.6%)',
    simbolosMayores: [
      { emoji: '🇳🇮', nombre: 'Bandera',  tipo: 'Símbolo patrio' },
      { emoji: '🛡️',  nombre: 'Escudo',   tipo: 'Símbolo patrio' },
      { emoji: '🎵',  nombre: 'Himno',    tipo: 'Símbolo patrio' },
    ],
    simbolos: [
      { emoji: '🐦', nombre: 'Guardabarranco', tipo: 'Ave nacional'      },
      { emoji: '🌸', nombre: 'Sacuanjoche',    tipo: 'Flor nacional'     },
      { emoji: '🌳', nombre: 'Madroño',        tipo: 'Árbol nacional'    },
      { emoji: '🌊', nombre: 'Lago Cocibolca', tipo: 'Maravilla natural' },
    ],
    tema: { brand: '#003893', brandMid: '#0050D9', brandLight: '#4D7FE8' },
    curiosidades: [
      { texto: 'Nicaragua es el país más grande de Centroamérica, con aproximadamente 130,000 km² de territorio. Sus dos grandes lagos representan una parte importante de esa superficie.', categoria: 'Geografía' },
      { texto: 'El lago de Nicaragua (Cocibolca) es el lago más grande de Centroamérica y el único lago de agua dulce del mundo donde históricamente habitaron tiburones de río.', categoria: 'Naturaleza' },
      { texto: 'La ciudad de Granada, fundada en 1524, es considerada la primera ciudad colonial de América continental que fue fundada y se mantiene en el mismo lugar original.', categoria: 'Historia' },
      { texto: 'Rubén Darío, nacido en Nicaragua en 1867, es el padre del Modernismo literario en lengua española, uno de los movimientos más influyentes de la poesía universal.', categoria: 'Cultura' },
      { texto: 'El volcán Masaya es uno de los pocos volcanes del mundo con un lago de lava visible a simple vista. Los españoles lo llamaron "La Boca del Infierno" por su impresionante aspecto.', categoria: 'Naturaleza' },
      { texto: 'La Reserva de Biosfera BOSAWAS es la reserva de selva tropical más grande de Centroamérica y la segunda más grande de América Latina, después del Amazonas.', categoria: 'Naturaleza' },
      { texto: 'Nicaragua posee más de 40 volcanes distribuidos en su territorio, siendo una de las cadenas volcánicas más activas y espectaculares de toda Centroamérica.', categoria: 'Naturaleza' },
      { texto: 'El gallo pinto (arroz mezclado con frijoles) es el plato más representativo de Nicaragua. Se consume en desayuno, almuerzo y cena, siendo parte del alma culinaria del país.', categoria: 'Cultura' },
      { texto: 'Las isletas de Granada son 365 pequeñas islas e islotes formados por la antigua erupción del volcán Mombacho en el lago de Nicaragua, un paisaje único en el mundo.', categoria: 'Naturaleza' },
      { texto: 'Nicaragua fue el primer país latinoamericano en incluir los derechos de las comunidades indígenas y afrodescendientes en su constitución, reconociendo su autonomía regional.', categoria: 'Civismo' },
      { texto: 'El café nicaragüense, cultivado en las montañas del norte del país, es reconocido internacionalmente como uno de los mejores cafés del mundo por su sabor suave y aromático.', categoria: 'Economía' },
      { texto: 'La bahía de San Juan del Sur es un importante hábitat de tortugas marinas que anidan en sus costas cada año. El Pacífico nicaragüense es hogar de la tortuga paslama.', categoria: 'Naturaleza' },
    ],
  },
  CR: {
    nombre: 'Costa Rica',
    bandera: '🇨🇷',
    lema: '¡Vivan siempre el trabajo y la paz!',
    flagBg: 'linear-gradient(180deg,#002B7F 16.7%,#fff 16.7% 33.3%,#CE1126 33.3% 66.7%,#fff 66.7% 83.3%,#002B7F 83.3%)',
    simbolosMayores: [
      { emoji: '🇨🇷', nombre: 'Bandera',  tipo: 'Símbolo patrio' },
      { emoji: '🛡️',  nombre: 'Escudo',   tipo: 'Símbolo patrio' },
      { emoji: '🎵',  nombre: 'Himno',    tipo: 'Símbolo patrio' },
    ],
    simbolos: [
      { emoji: '🐦', nombre: 'Yigüirro',      tipo: 'Ave nacional'          },
      { emoji: '🌸', nombre: 'Guaria Morada', tipo: 'Flor nacional'         },
      { emoji: '🌳', nombre: 'Guanacaste',    tipo: 'Árbol nacional'        },
      { emoji: '🦥', nombre: 'Perezoso',      tipo: 'Símbolo del ecoturismo'},
    ],
    tema: { brand: '#B22234', brandMid: '#D42941', brandLight: '#E87080' },
    curiosidades: [
      { texto: 'Costa Rica abolió su ejército en 1948 mediante su Constitución. Es uno de los pocos países del mundo sin fuerzas militares. El dinero invertido se destina a educación y salud.', categoria: 'Civismo' },
      { texto: 'Costa Rica alberga el 5% de la biodiversidad mundial en solo el 0.03% del territorio del planeta, incluyendo más de 500,000 especies de animales y plantas.', categoria: 'Naturaleza' },
      { texto: 'El 99% de la electricidad de Costa Rica proviene de fuentes renovables: hidroeléctrica, geotérmica, eólica y solar. Es líder mundial reconocido en energías limpias.', categoria: 'Medio Ambiente' },
      { texto: '"Pura Vida" es mucho más que una frase en Costa Rica: es una filosofía de vida que expresa gratitud y tranquilidad. Se usa como saludo, despedida y respuesta a todo.', categoria: 'Cultura' },
      { texto: 'Costa Rica fue el primer país tropical en revertir la deforestación: pasó de tener solo el 21% de bosques en 1987 al 57% de cobertura forestal que tiene hoy.', categoria: 'Medio Ambiente' },
      { texto: 'El sistema de parques nacionales de Costa Rica protege más del 25% del territorio nacional, siendo uno de los sistemas de conservación más completos del mundo.', categoria: 'Naturaleza' },
      { texto: 'El quetzal, ave sagrada de los mayas, habita en los bosques nebulosos de Costa Rica, especialmente en el Parque Nacional Los Quetzales y en la reserva de Monteverde.', categoria: 'Naturaleza' },
      { texto: 'Costa Rica tiene el mayor Índice de Desarrollo Humano de Centroamérica según el PNUD, con alta esperanza de vida, educación accesible y calidad de vida reconocida.', categoria: 'Civismo' },
      { texto: 'El Parque Nacional Corcovado, en la Península de Osa, es considerado por la revista National Geographic como "el lugar biológicamente más intenso de la Tierra".', categoria: 'Naturaleza' },
      { texto: 'Costa Rica recibe cada año cerca de 3 millones de turistas. El ecoturismo es su principal fuente de ingresos y un modelo que otros países buscan imitar.', categoria: 'Economía' },
      { texto: 'La tasa de alfabetización de Costa Rica supera el 97%, resultado de décadas de inversión en educación pública gratuita y obligatoria desde el siglo XIX.', categoria: 'Educación' },
      { texto: 'La tortuga baula, la tortuga marina más grande del mundo, anida en las playas del Caribe costarricense. El Parque Nacional Tortuguero es clave para su conservación.', categoria: 'Naturaleza' },
    ],
  },
  PA: {
    nombre: 'Panamá',
    bandera: '🇵🇦',
    lema: 'Pro Mundi Beneficio',
    flagBg: 'linear-gradient(to right,#fff 50%,#D21034 50%) top/100% 50% no-repeat,linear-gradient(to right,#002B7F 50%,#fff 50%) bottom/100% 50% no-repeat',
    simbolosMayores: [
      { emoji: '🇵🇦', nombre: 'Bandera',  tipo: 'Símbolo patrio' },
      { emoji: '🛡️',  nombre: 'Escudo',   tipo: 'Símbolo patrio' },
      { emoji: '🎵',  nombre: 'Himno',    tipo: 'Símbolo patrio' },
    ],
    simbolos: [
      { emoji: '🦅', nombre: 'Águila Harpía',     tipo: 'Ave nacional'      },
      { emoji: '🌸', nombre: 'Espíritu Santo',    tipo: 'Flor nacional'     },
      { emoji: '🌳', nombre: 'Árbol Panamá',      tipo: 'Árbol nacional'    },
      { emoji: '⚓', nombre: 'Canal de Panamá',   tipo: 'Maravilla mundial' },
    ],
    tema: { brand: '#005293', brandMid: '#0070C5', brandLight: '#4DA8E8' },
    curiosidades: [
      { texto: 'El Canal de Panamá, inaugurado en 1914, conecta el Océano Atlántico con el Pacífico y es una de las maravillas de la ingeniería moderna. Por él transita el 5% del comercio mundial.', categoria: 'Historia' },
      { texto: 'Panamá es el único lugar del mundo donde puedes ver el sol salir en el Océano Pacífico y ponerse en el Atlántico, todo desde un mismo punto del territorio nacional.', categoria: 'Geografía' },
      { texto: 'La Ciudad de Panamá es la única capital de América Latina que tiene una selva tropical dentro de sus límites urbanos: el Parque Natural Metropolitano.', categoria: 'Naturaleza' },
      { texto: 'Panamá tiene más de 900 especies de aves registradas, más que toda América del Norte y Europa juntas. Por eso es el paraíso mundial para los observadores de aves.', categoria: 'Naturaleza' },
      { texto: 'El famoso sombrero "Panamá" es en realidad de origen ecuatoriano. Recibió ese nombre porque se distribuía desde el istmo hacia el mundo durante la construcción del canal.', categoria: 'Cultura' },
      { texto: 'La mola es el arte textil del pueblo Kuna (Guna) de Panamá: intrincados diseños geométricos multicolores que representan su cosmovisión y son reconocidos mundialmente.', categoria: 'Cultura' },
      { texto: 'El Parque Nacional Darién, en la frontera con Colombia, es Patrimonio de la Humanidad por la UNESCO y alberga una de las selvas más biodiversas e inexploradas del planeta.', categoria: 'Naturaleza' },
      { texto: 'Panamá usa el dólar estadounidense como moneda de curso legal junto al Balboa panameño, manteniendo una paridad 1:1 desde 1904, lo que da estabilidad económica al país.', categoria: 'Economía' },
      { texto: 'El Archipiélago de San Blás (Guna Yala) está formado por más de 365 islas e islotes turquesas. Es administrado de forma autónoma por el pueblo indígena Guna.', categoria: 'Cultura' },
      { texto: 'El 40% del territorio panameño está cubierto por bosques tropicales. Panamá es uno de los países con mayor cobertura forestal en relación a su tamaño en toda América.', categoria: 'Naturaleza' },
      { texto: 'El Festival Nacional de la Pollera en Las Tablas celebra el traje típico panameño, considerado uno de los trajes folclóricos más elaborados y hermosos del mundo entero.', categoria: 'Cultura' },
      { texto: 'La biodiversidad marina de Panamá es excepcional. Las costas panameñas del Pacífico y el Caribe concentran algunas de las mayores densidades de vida marina del planeta.', categoria: 'Naturaleza' },
    ],
  },
};

/* ─────────────────────────────────────────────
   STATE
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   MODAL SÍMBOLOS
───────────────────────────────────────────── */

const _simRegistry = new Map();

function openSimModal(key) {
  const s = _simRegistry.get(key);
  if (!s) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'sim-modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  const imgHTML = s.img
    ? `<img src="${s.img}" alt="${s.nombre}" class="sim-modal-img">`
    : `<div class="sim-modal-emoji">${s.emoji}</div>`;

  backdrop.innerHTML = `
    <div class="sim-modal">
      ${imgHTML}
      <span class="sim-modal-badge">${s.tipo}</span>
      <div class="sim-modal-title">${s.nombre}</div>
      ${s.info ? `<p class="sim-modal-info">${s.info}</p>` : ''}
      <button class="sim-modal-close" aria-label="Cerrar">Cerrar ✕</button>
    </div>`;

  backdrop.querySelector('.sim-modal-close').addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.remove(); });
  document.body.appendChild(backdrop);
}
window.openSimModal = openSimModal;

/* ─────────────────────────────────────────────
   STATE
───────────────────────────────────────────── */

const KEY = 'meta_v2';

function blank() {
  return { name: '', grade: '2y3ciclo', country: 'HN', xp: 0, visited: [], lastVisited: [] };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return Object.assign(blank(), JSON.parse(raw));
  } catch (_) {}
  return blank();
}

function save(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (_) {}
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];
}

function xpPct(xp) {
  const lv = getLevel(xp);
  if (lv.n === 5) return 100;
  return Math.round(((xp - lv.min) / (lv.max - lv.min + 1)) * 100);
}

function displayName(s) {
  return s.name.trim() || 'Estudiante';
}

function featuredMission(s) {
  const unvisited = MISSIONS.filter(m => !s.visited.includes(m.id));
  if (unvisited.length) {
    const idx = Math.floor(Date.now() / 86400000) % unvisited.length;
    return unvisited[idx];
  }
  return MISSIONS.reduce((a, b) => a.xp > b.xp ? a : b);
}

/* ─────────────────────────────────────────────
   ROTACIÓN AUTOMÁTICA (tiempo basado en lectura)
───────────────────────────────────────────── */

// Velocidad de lectura promedio en español: ~200 palabras/minuto
// Buffer 1.8× para dar tiempo de comprensión
const WPM        = 200;
const READ_BUF   = 1.8;
const MIN_DELAY  = 14000;  // mínimo 14 s (textos muy cortos)
const MAX_DELAY  = 95000;  // máximo 95 s (textos muy largos)

let _motivIdx       = Math.floor(Math.random() * FRASES.length);
let _factIdx        = 0;
let _currentCountry = 'HN';
let _rotTimeout     = null;

function calcReadingDelay() {
  const frase = FRASES[_motivIdx];
  const data  = COUNTRY_DATA[_currentCountry];
  const fact  = data ? data.curiosidades[_factIdx % data.curiosidades.length] : null;
  // Contar palabras del texto visible actualmente
  const combined = [frase.texto, fact ? fact.texto : ''].join(' ');
  const words    = combined.trim().split(/\s+/).filter(Boolean).length;
  const ms       = Math.round((words / WPM) * 60 * READ_BUF * 1000);
  return Math.min(MAX_DELAY, Math.max(MIN_DELAY, ms));
}

function fadeUpdate(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(6px)';
  setTimeout(() => {
    el.textContent = text;
    el.style.opacity = '';
    el.style.transform = '';
  }, 280);
}

function renderFactDots() {
  const dotsEl = document.getElementById('cc-dots');
  const data   = COUNTRY_DATA[_currentCountry];
  if (!dotsEl || !data) return;
  const total   = data.curiosidades.length;
  const visible = Math.min(total, 10);
  const active  = _factIdx % visible;
  dotsEl.innerHTML = Array.from({ length: visible }, (_, i) =>
    `<span class="cc-dot${i === active ? ' active' : ''}"></span>`
  ).join('');
}

function tickRotation() {
  _motivIdx = (_motivIdx + 1) % FRASES.length;
  _factIdx++;

  const frase = FRASES[_motivIdx];
  fadeUpdate('motiv-text',  frase.texto);
  fadeUpdate('motiv-autor', '— ' + frase.autor);

  const data = COUNTRY_DATA[_currentCountry];
  if (data) {
    const fact = data.curiosidades[_factIdx % data.curiosidades.length];
    fadeUpdate('cc-text',     fact.texto);
    fadeUpdate('cc-category', fact.categoria);
    setTimeout(renderFactDots, 290);
  }

  scheduleNextTick();
}

function scheduleNextTick() {
  clearTimeout(_rotTimeout);
  _rotTimeout = setTimeout(tickRotation, calcReadingDelay());
}

/* ─────────────────────────────────────────────
   TEMA POR PAÍS
───────────────────────────────────────────── */

function applyCountryTheme(code) {
  const data = COUNTRY_DATA[code];
  if (!data) return;
  const r = document.documentElement.style;
  r.setProperty('--brand',       data.tema.brand);
  r.setProperty('--brand-mid',   data.tema.brandMid);
  r.setProperty('--brand-light', data.tema.brandLight);
}

function renderCountryCard(code) {
  const data = COUNTRY_DATA[code];
  if (!data) return;

  const idx  = _factIdx % data.curiosidades.length;
  const fact = data.curiosidades[idx];

  // Emoji + nombre + lema
  const flagEl = document.getElementById('cc-flag');
  const nameEl = document.getElementById('cc-country-name');
  const lemaEl = document.getElementById('cc-lema');
  const textEl = document.getElementById('cc-text');
  const catEl  = document.getElementById('cc-category');

  if (flagEl) flagEl.textContent = data.bandera;
  if (nameEl) nameEl.textContent = data.nombre;
  if (lemaEl) lemaEl.textContent = data.lema || '';
  if (textEl) textEl.textContent = fact.texto;
  if (catEl)  catEl.textContent  = fact.categoria;

  // Símbolos patrios — dos secciones con imágenes y modal
  const simEl = document.getElementById('cc-simbolos');
  if (simEl) {
    _simRegistry.clear();

    const buildItem = s => {
      const key = 'sim_' + Math.random().toString(36).slice(2);
      _simRegistry.set(key, s);
      const visual = s.img
        ? `<img src="${s.img}" alt="${s.nombre}" class="cc-sim-img" loading="lazy">`
        : `<span class="cc-sim-emoji">${s.emoji}</span>`;
      return `<div class="cc-sim-item cc-sim-clickable" onclick="openSimModal('${key}')">${visual}<span class="cc-sim-nombre">${s.nombre}</span><span class="cc-sim-tipo">${s.tipo}</span></div>`;
    };

    let html = '';
    if (data.simbolosMayores && data.simbolosMayores.length) {
      html += `<div class="cc-sim-section"><div class="cc-sim-label">🏅 Símbolos Patrios</div><div class="cc-sim-grid">${data.simbolosMayores.map(buildItem).join('')}</div></div>`;
    }
    if (data.simbolos && data.simbolos.length) {
      html += `<div class="cc-sim-section"><div class="cc-sim-label">🌿 Símbolos Nacionales</div><div class="cc-sim-grid">${data.simbolos.map(buildItem).join('')}</div></div>`;
    }
    simEl.innerHTML = html;
  }

  renderFactDots();
}

function nextFact() {
  const data = COUNTRY_DATA[_currentCountry];
  if (!data) return;
  _factIdx = (_factIdx + 1) % data.curiosidades.length;
  const fact = data.curiosidades[_factIdx];
  fadeUpdate('cc-text',     fact.texto);
  fadeUpdate('cc-category', fact.categoria);
  setTimeout(renderFactDots, 290);
  scheduleNextTick();
}

function prevFact() {
  const data = COUNTRY_DATA[_currentCountry];
  if (!data) return;
  _factIdx = (_factIdx - 1 + data.curiosidades.length) % data.curiosidades.length;
  const fact = data.curiosidades[_factIdx];
  fadeUpdate('cc-text',     fact.texto);
  fadeUpdate('cc-category', fact.categoria);
  setTimeout(renderFactDots, 290);
  scheduleNextTick();
}

/* ─────────────────────────────────────────────
   RENDER — HOME
───────────────────────────────────────────── */

function renderHome() {
  const s       = load();
  const country = s.country || 'HN';

  // Saludo
  document.getElementById('home-name').textContent = displayName(s) + '!';

  // Frase motivacional (índice global de rotación)
  const frase = FRASES[_motivIdx];
  document.getElementById('motiv-text').textContent  = frase.texto;
  document.getElementById('motiv-autor').textContent = '— ' + frase.autor;

  // Tema y datos del país
  _currentCountry = country;
  applyCountryTheme(country);
  renderCountryCard(country);

  // Chips de materia: misiones o "Próximamente" según país
  document.querySelectorAll('.subj-chip').forEach(chip => {
    const em = chip.querySelector('em');
    if (!em) return;
    if (country === 'HN') {
      const count = MISSIONS.filter(m => m.subject === chip.dataset.subject).length;
      em.textContent = `${count} misión${count !== 1 ? 'es' : ''}`;
    } else {
      em.textContent = 'Próximamente';
    }
  });

  // Sección Misión destacada + Recientes: solo Honduras
  const featuredSection = document.getElementById('featured-section');
  if (featuredSection) featuredSection.hidden = (country !== 'HN');

  if (country !== 'HN') return;

  const m    = featuredMission(s);
  const done = s.visited.includes(m.id);
  const card = document.getElementById('featured-card');
  card.innerHTML = `
    <div class="feat-label">★ Misión destacada</div>
    <div class="feat-subj">${m.icon} ${SUBJECT_LABELS[m.subject] || m.subject}</div>
    <div class="feat-title">${m.title}</div>
    <div class="feat-grade">${m.grade}</div>
    <div class="feat-actions">
      <div class="feat-xp">
        <i class="fa-solid fa-star"></i>
        ${done ? 'Ya visitada' : `+${m.xp} XP`}
      </div>
      <button class="feat-btn">
        ${done ? 'Repetir' : 'Iniciar'} <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  `;
  card.onclick = () => visitMission(m.id);

  const wrap   = document.getElementById('recent-wrap');
  const list   = document.getElementById('recent-list');
  const recent = (s.lastVisited || [])
    .slice(0, 3)
    .map(id => MISSIONS.find(m => m.id === id))
    .filter(Boolean);

  if (recent.length === 0) {
    wrap.hidden = true;
  } else {
    wrap.hidden = false;
    list.innerHTML = recent.map(m => `
      <a class="small-item" onclick="visitMission(${m.id}); return false;" href="${m.url}">
        <div class="small-icon ${m.color}">${m.icon}</div>
        <div class="small-info">
          <div class="small-title">${m.title}</div>
          <div class="small-meta">${SUBJECT_LABELS[m.subject] || m.subject} · ${m.grade}</div>
        </div>
        <i class="fa-solid fa-chevron-right small-arrow"></i>
      </a>
    `).join('');
  }
}

/* ─────────────────────────────────────────────
   RENDER — PRÓCERES CAROUSEL
───────────────────────────────────────────── */

let _proceresIdx = 0;

function renderProceres(country) {
  const section = document.getElementById('proceres-section');
  if (!section) return;
  const data = PROCERES_DATA[country];
  if (!data || !data.length) { section.innerHTML = ''; return; }
  _proceresIdx = 0;
  _buildProceresHTML(country, data);
}

function _buildProceresHTML(country, data) {
  const section = document.getElementById('proceres-section');
  if (!section) return;
  const cd = COUNTRY_DATA[country];
  const item = data[_proceresIdx];
  const dots = data.map((_, i) =>
    `<span class="cc-dot${i === _proceresIdx ? ' active' : ''}"></span>`
  ).join('');

  section.innerHTML = `
    <div class="proc-card">
      <div class="proc-card-header">
        <span class="proc-flag">${cd ? cd.bandera : ''}</span>
        <span class="proc-card-title">Próceres de ${cd ? cd.nombre : country}</span>
      </div>
      <div class="proc-body" id="proc-swipe">
        <img src="${item.img}" alt="${item.nombre}" class="proc-foto">
        <div class="proc-info">
          <div class="proc-nombre">${item.nombre}</div>
          <div class="proc-fecha">${item.fecha}</div>
          <p class="proc-desc">${item.desc}</p>
          <p class="proc-cita">"${item.cita}"</p>
        </div>
      </div>
      <div class="proc-footer">
        <button class="cc-nav-btn" id="proc-prev" aria-label="Anterior">‹</button>
        <div class="cc-dots">${dots}</div>
        <button class="cc-nav-btn" id="proc-next" aria-label="Siguiente">›</button>
      </div>
    </div>`;

  document.getElementById('proc-prev').addEventListener('click', () => {
    _proceresIdx = (_proceresIdx - 1 + data.length) % data.length;
    _buildProceresHTML(country, data);
  });
  document.getElementById('proc-next').addEventListener('click', () => {
    _proceresIdx = (_proceresIdx + 1) % data.length;
    _buildProceresHTML(country, data);
  });

  const swipe = document.getElementById('proc-swipe');
  if (swipe) {
    let _tx = 0;
    swipe.addEventListener('touchstart', e => { _tx = e.touches[0].clientX; }, { passive: true });
    swipe.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - _tx;
      if (Math.abs(dx) > 38) {
        _proceresIdx = dx < 0
          ? (_proceresIdx + 1) % data.length
          : (_proceresIdx - 1 + data.length) % data.length;
        _buildProceresHTML(country, data);
      }
    }, { passive: true });
  }
}

/* ─────────────────────────────────────────────
   RENDER — MISSIONS
───────────────────────────────────────────── */

function renderMissions(filter, query) {
  const s = load();
  const country = s.country || 'HN';

  renderProceres(country);

  const container = document.getElementById('missions-container');

  if (country !== 'HN') {
    const cd = COUNTRY_DATA[country];
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🚀</div>
        <h3>¡Próximamente!</h3>
        <p>Las misiones para <strong>${cd ? cd.nombre : 'este país'}</strong> están en camino.<br>
           Cambia a <strong>🇭🇳 Honduras</strong> para explorar las misiones disponibles.</p>
      </div>`;
    return;
  }

  let list = [...MISSIONS];

  if (filter && filter !== 'all') {
    list = list.filter(m => m.subject === filter);
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (SUBJECT_LABELS[m.subject] || '').toLowerCase().includes(q) ||
      m.grade.toLowerCase().includes(q)
    );
  }

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Sin resultados</h3>
        <p>Intenta con otro término o cambia el filtro.</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map(m => {
    const visited = s.visited.includes(m.id);
    return `
      <a class="mission-card ${visited ? 'visited' : ''}"
         onclick="visitMission(${m.id}); return false;"
         href="${m.url}">
        <div class="mc-icon ${m.color}">${m.icon}</div>
        <div class="mc-info">
          <div class="mc-title">${m.title}</div>
          <div class="mc-meta">
            <span class="mc-subj ${m.color}">${SUBJECT_LABELS[m.subject] || m.subject}</span>
            <span class="mc-grade">${m.grade}</span>
            ${visited
              ? `<span class="mc-done"><i class="fa-solid fa-check"></i> Visitada</span>`
              : `<span class="mc-xp"><i class="fa-solid fa-star"></i> +${m.xp} XP</span>`}
          </div>
        </div>
        <i class="fa-solid fa-chevron-right mc-arrow"></i>
      </a>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   RENDER — PROGRESS
───────────────────────────────────────────── */

function renderProgress() {
  const s   = load();
  const lv  = getLevel(s.xp);
  const pct = xpPct(s.xp);

  document.getElementById('progress-overview').innerHTML = `
    <div class="progress-overview">
      <div class="po-emoji">${lv.emoji}</div>
      <div class="po-level">Nivel ${lv.n}</div>
      <div class="po-rank">${lv.label}</div>
      <div class="po-xp">${s.xp}</div>
      <div class="po-xp-label">Puntos XP</div>
      <div class="po-bar-wrap">
        <div class="po-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="po-bar-lbls">
        <span>${lv.min} XP</span>
        <span>${lv.n < 5 ? (lv.max + 1) + ' XP' : 'Nivel máx.'}</span>
      </div>
    </div>`;

  const subjects = [
    { key: 'español',     label: 'Español',     color: 'var(--esp)'  },
    { key: 'matemáticas', label: 'Matemáticas',  color: 'var(--mat)'  },
    { key: 'naturales',   label: 'C. Naturales', color: 'var(--cnat)' },
    { key: 'sociales',    label: 'C. Sociales',  color: 'var(--csoc)' },
  ];

  document.getElementById('progress-subjects').innerHTML = `
    <h2 class="section-title" style="margin-bottom:12px;">Por materia</h2>
    ${subjects.map(sub => {
      const total = MISSIONS.filter(m => m.subject === sub.key).length;
      const done  = MISSIONS.filter(m => m.subject === sub.key && s.visited.includes(m.id)).length;
      const p = total ? Math.round((done / total) * 100) : 0;
      return `
        <div class="sp-item">
          <div class="sp-top">
            <span class="sp-name">${sub.label}</span>
            <span class="sp-cnt">${done} / ${total}</span>
          </div>
          <div class="sp-track">
            <div class="sp-fill" style="width:${p}%; background:${sub.color};"></div>
          </div>
        </div>`;
    }).join('')}`;

  const visitedList = MISSIONS.filter(m => s.visited.includes(m.id));
  document.getElementById('visited-missions').innerHTML = !visitedList.length
    ? `<div class="empty-state" style="margin-top:8px;">
        <div class="empty-icon">🚀</div>
        <h3>¡Empieza tu viaje!</h3>
        <p>Las misiones que visites aparecerán aquí.</p>
       </div>`
    : `<h2 class="section-title" style="margin:20px 0 12px;">
         Visitadas (${visitedList.length})
       </h2>
       <div class="missions-list">
         ${visitedList.map(m => `
           <a class="mission-card visited"
              onclick="visitMission(${m.id}); return false;"
              href="${m.url}">
             <div class="mc-icon ${m.color}">${m.icon}</div>
             <div class="mc-info">
               <div class="mc-title">${m.title}</div>
               <div class="mc-meta">
                 <span class="mc-subj ${m.color}">${SUBJECT_LABELS[m.subject] || m.subject}</span>
                 <span class="mc-grade">${m.grade}</span>
                 <span class="mc-done"><i class="fa-solid fa-check"></i> Visitada</span>
               </div>
             </div>
             <i class="fa-solid fa-chevron-right mc-arrow"></i>
           </a>`).join('')}
       </div>`;
}

/* ─────────────────────────────────────────────
   RENDER — PROFILE
───────────────────────────────────────────── */

function renderProfile() {
  const s  = load();
  const lv = getLevel(s.xp);

  document.getElementById('prf-avatar').textContent = lv.emoji;
  document.getElementById('prf-name').textContent   = displayName(s);
  document.getElementById('prf-rank').textContent   = `Nivel ${lv.n} · ${lv.label} · ${s.xp} XP`;
  document.getElementById('name-input').value       = s.name;

  document.querySelectorAll('.grade-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.grade === s.grade)
  );

  document.getElementById('prf-visited').textContent = `${s.visited.length} / ${MISSIONS.length}`;
  document.getElementById('prf-xp').textContent      = `${s.xp} XP`;
  document.getElementById('prf-level').textContent   = `Nivel ${lv.n}`;
  document.getElementById('prf-badge').textContent   = lv.label;
}

/* ─────────────────────────────────────────────
   VISIT MISSION
───────────────────────────────────────────── */

function visitMission(id) {
  const s = load();
  const m = MISSIONS.find(m => m.id === id);
  if (!m) return;

  if (!s.visited.includes(id)) {
    s.xp += m.xp;
    s.visited.push(id);
  }
  s.lastVisited = [id, ...(s.lastVisited || []).filter(x => x !== id)].slice(0, 5);
  save(s);

  window.location.href = m.url;
}

window.visitMission = visitMission;

/* ─────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────── */

let currentFilter = 'all';
let currentQuery  = '';

function switchView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const btn = document.querySelector(`.nav-btn[data-view="${id}"]`);
  if (btn) btn.classList.add('active');

  if (id === 'view-inicio')   renderHome();
  if (id === 'view-misiones') renderMissions(currentFilter, currentQuery);
  if (id === 'view-progreso') renderProgress();
  if (id === 'view-perfil')   renderProfile();

  const scroll = document.querySelector(`#${id} .view-scroll`);
  if (scroll) scroll.scrollTop = 0;
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */

function toast(msg) {
  let el = document.getElementById('meta-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'meta-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = '0'; }, 2000);
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // Aplicar tema del país guardado antes de renderizar
  const s0      = load();
  const country0 = s0.country || 'HN';
  _currentCountry = country0;
  applyCountryTheme(country0);

  // Sincronizar selector de país con el estado guardado
  const countryEl = document.getElementById('country-select');
  if (countryEl) countryEl.value = country0;

  // Render inicial
  renderHome();

  // Iniciar rotación automática con tiempo adaptado a la lectura
  scheduleNextTick();

  // Cambio de país
  if (countryEl) {
    countryEl.addEventListener('change', () => {
      const s = load();
      s.country = countryEl.value;
      save(s);
      _currentCountry = s.country;
      _factIdx = 0;
      applyCountryTheme(s.country);
      renderCountryCard(s.country);
      scheduleNextTick(); // reinicia el temporizador con el texto nuevo
      const d = COUNTRY_DATA[s.country];
      if (d) toast(`${d.bandera} ¡Explorando ${d.nombre}!`);
    });
  }

  // Botones prev/next de curiosidades
  const prevBtn = document.getElementById('cc-prev');
  const nextBtn = document.getElementById('cc-next');
  if (prevBtn) prevBtn.addEventListener('click', prevFact);
  if (nextBtn) nextBtn.addEventListener('click', nextFact);

  // Swipe táctil en la tarjeta de curiosidades
  const swipeArea = document.getElementById('cc-swipe-area');
  if (swipeArea) {
    let touchX = 0, touchY = 0;
    swipeArea.addEventListener('touchstart', e => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }, { passive: true });
    swipeArea.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 38) {
        dx < 0 ? nextFact() : prevFact();
      }
    }, { passive: true });
  }

  // Navegación
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // Chips de materias → misiones filtradas
  document.querySelectorAll('.subj-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentFilter = chip.dataset.subject;
      currentQuery  = '';

      document.querySelectorAll('.pill').forEach(p =>
        p.classList.toggle('active', p.dataset.filter === currentFilter)
      );

      const si = document.getElementById('search-input');
      if (si) si.value = '';

      switchView('view-misiones');
    });
  });

  // Búsqueda
  const searchEl = document.getElementById('search-input');
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      currentQuery = searchEl.value;
      renderMissions(currentFilter, currentQuery);
    });
  }

  // Pills de filtro
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderMissions(currentFilter, currentQuery);
    });
  });

  // Notificaciones
  document.getElementById('notif-btn').addEventListener('click', () => {
    toast('Sin notificaciones nuevas por ahora');
  });

  // Guardar nombre
  document.getElementById('save-name-btn').addEventListener('click', () => {
    const s = load();
    s.name = document.getElementById('name-input').value.trim();
    save(s);
    renderProfile();
    renderHome();
    toast('¡Nombre guardado!');
  });

  document.getElementById('name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('save-name-btn').click();
  });

  // Botones de grado
  document.querySelectorAll('.grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = load();
      s.grade = btn.dataset.grade;
      save(s);
      document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      toast('Nivel de estudios actualizado');
    });
  });

  // Reiniciar
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('¿Reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
      localStorage.removeItem(KEY);
      renderProfile();
      renderHome();
      toast('Progreso reiniciado');
    }
  });
});
