'use strict';

/* ─────────────────────────────────────────────
   MISSIONS
───────────────────────────────────────────── */

const MISSIONS = [
  { id:  1, title: 'Los Adjetivos',                             subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '📝', url: 'misiones/2y3ciclo-adjetivos/adjetivos-II-IIICiclo.html' },
  { id:  2, title: 'Los Verbos',                                subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '✍️', url: 'misiones/2y3ciclo-verbos/verbos-II-III-ciclo-basica.html' },
  { id:  3, title: 'Los Sustantivos',                           subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '📖', url: 'misiones/2y3ciclo-sustantivos/sustantivos-II-III-ciclo-basica.html' },
  { id:  4, title: 'Los Pronombres',                            subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '💬', url: 'misiones/2y3ciclo-pronombres/pronombres-II-III-ciclo-basica.html' },
  { id:  5, title: 'El Adjetivo Avanzado',                      subject: 'español',     color: 'bach', grade: 'Bachillerato',   cycle: 'bach',     xp: 40, icon: '🎓', url: 'misiones/bach-uni-adjetivos/adjetivos-avanzado.html' },
  { id:  6, title: 'Números de Tres Cifras',                    subject: 'matemáticas', color: 'mat',  grade: '2° Grado',       cycle: '1ciclo',   xp: 20, icon: '🔢', url: 'misiones/1ciclo-2º-grado/numeros-hasta-999.html' },
  { id:  7, title: 'Ángulos y Bisectriz',                       subject: 'matemáticas', color: 'mat',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '📐', url: 'misiones/2y3ciclo-angulo-bisectriz/angulos-bisectriz_II y III-Ciclo_Básica.html' },
  { id:  8, title: 'Números Decimales',                         subject: 'matemáticas', color: 'mat',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '🔢', url: 'misiones/2y3ciclo-numeros-decimales/2y3ciclo-numeros-decimales.html' },
  { id:  9, title: 'Las Eras Geológicas',                       subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 35, icon: '🦕', url: 'misiones/2y3ciclo-eras-geológicas/eras_geológicas.html' },
  { id: 10, title: 'Áreas Protegidas de Honduras',              subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '🌿', url: 'misiones/2y3ciclo-áreas-protegidas-de-honduras/2y3ciclo-áreas-protegidas-de-Honduras.html' },
  { id: 11, title: 'Geografía y Coordenadas',                   subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '🗺️', url: 'misiones/2y3ciclo-geografía-coordenadas/2y3ciclo_geografia-coordenadas.html' },
  { id: 12, title: 'Continentes: Europa, Asia y África',        subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '🌍', url: 'misiones/2y3ciclo-los-Continentes-Europa-Asia-y-Africa/2y3ciclo_geografia-continentes-eas.html' },
  { id: 13, title: 'Continentes: América, Oceanía y Antártida', subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '🌎', url: 'misiones/2y3ciclo-los-continentes-América-Oceanía-Antártida/2y3ciclo-los-continentes-América-Oceanía-Antártida.html' },
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
      { emoji: '🇭🇳', nombre: 'La Bandera', tipo: 'Símbolo patrio', img: 'img/honduras_img/simbolos/bandera.webp',
        info: 'Tres franjas horizontales: azul, blanca y azul. Las cinco estrellas azules del centro representan a los países que formaron la República Federal de Centroamérica. Adoptada oficialmente el 16 de septiembre de 1825.' },
      { emoji: '🛡️', nombre: 'El Escudo', tipo: 'Símbolo patrio', img: 'img/honduras_img/simbolos/escudo.webp',
        info: 'Muestra un óvalo central con volcanes, el sol naciente, un arco iris y dos torres que representan las fortalezas del país. A los lados, dos cornucopias simbolizan la abundancia natural. Pinos enmarcan la escena. El texto reza: "República de Honduras, Libre, Soberana e Independiente — 15 de septiembre de 1821".' },
      { emoji: '🎵', nombre: 'El Himno Nacional', tipo: 'Símbolo patrio', img: 'img/honduras_img/simbolos/himno.webp',
        info: 'Letra de Augusto C. Coello y música del compositor alemán Carlos Hartling. Adoptado oficialmente el 15 de noviembre de 1915. Su coro comienza: "Tu bandera es un lampo de cielo, por un bloque de nieve cruzado…"' },
    ],
    simbolos: [
      { emoji: '🌺', nombre: 'La Flor Nacional', tipo: 'Orquídea', img: 'img/honduras_img/simbolos/orquidea.webp',
        info: 'Rhyncholaelia digbyana. Declarada flor nacional en 1969. De color blanco-verdoso con bordes en flecos. Reconocida por su exquisita fragancia nocturna y considerada una de las más bellas del continente.' },
      { emoji: '🦜', nombre: 'El Ave Nacional', tipo: 'Guara Roja', img: 'img/honduras_img/simbolos/guacamaya.webp',
        info: 'Ara macao. Declarada ave nacional en 1993. Habita en los bosques tropicales de la Mosquitia hondureña. Su plumaje rojo, azul y amarillo la convierte en una de las aves más coloridas del mundo.' },
      { emoji: '🦌', nombre: 'El Mamífero Nacional', tipo: 'Venado Cola Blanca', img: 'img/honduras_img/simbolos/venado.webp',
        info: 'Odocoileus virginianus. Habita en bosques, sabanas y zonas rurales de Honduras. Conocido por su elegancia y velocidad, ha sido parte de la cultura y tradición hondureña por siglos.' },
      { emoji: '🌲', nombre: 'El Árbol Nacional', tipo: 'Pino', img: 'img/honduras_img/simbolos/pino.webp',
        info: 'Honduras posee la mayor cobertura de bosques de pino de toda Centroamérica. El pino cubre gran parte de las montañas y es fuente de vida para miles de familias y ecosistemas del país.' },
      { emoji: '🗺️', nombre: 'El Mapa Nacional', tipo: 'Mapa político', img: 'img/honduras_img/simbolos/mapa.webp',
        info: 'Honduras está dividida en 18 departamentos. Limita al norte con el Mar Caribe, al sur con El Salvador y el Golfo de Fonseca, al este con Nicaragua y al oeste con Guatemala. Las Islas de la Bahía forman parte del territorio nacional en el Caribe.' },
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
      { emoji: '🇸🇻', nombre: 'Bandera Nacional', tipo: 'Símbolo patrio', img: 'img/salvador_img/bandera.webp',
        info: 'Tres franjas horizontales: azul, blanca y azul. El azul representa los dos océanos que bañan Centroamérica; el blanco simboliza la paz. El Escudo Nacional aparece en el centro de la franja blanca. Su diseño actual ha sido utilizado desde 1912.' },
      { emoji: '🛡️', nombre: 'Escudo de Armas', tipo: 'Símbolo patrio', img: 'img/salvador_img/escudo.webp',
        info: 'Presenta un triángulo equilátero que simboliza la igualdad. Dentro se representan cinco volcanes, el océano Pacífico, el sol naciente y un arco iris. En la base del triángulo se lee el lema nacional: "DIOS UNIÓN LIBERTAD". El texto exterior reza: "REPÚBLICA DE EL SALVADOR EN LA AMERICA CENTRAL". Está enmarcado por ramas de laurel.' },
      { emoji: '🎵', nombre: 'Himno Nacional', tipo: 'Símbolo patrio',
        info: 'Letra del general Juan José Cañas y música del compositor italiano Juan Aberle. Fue adoptado oficialmente el 15 de septiembre de 1879. Su coro comienza: "Saludemos la Patria orgullosos…"' },
    ],
    simbolos: [
      { emoji: '🦜', nombre: 'Torogoz', tipo: 'Ave nacional', img: 'img/salvador_img/ave.webp',
        info: 'Eumomota superciliosa. Declarado ave nacional en 1999. Se distingue por su plumaje verde esmeralda en el cuerpo, pecho naranja, marcas azul turquesa en la cabeza y sus características plumas caudales alargadas con extremos en forma de raqueta. Habita en zonas boscosas y quebradas.' },
      { emoji: '🌿', nombre: 'Flor de Izote', tipo: 'Flor nacional', img: 'img/salvador_img/flor.webp',
        info: 'Yucca elephantipes. Declarada flor nacional en 1995. Planta de hojas largas y rígidas de color verde oscuro, con una espiga central que produce racimos de flores blancas acampanadas. Sus pétalos son comestibles y forman parte de la gastronomía tradicional salvadoreña.' },
      { emoji: '🌳', nombre: 'Maquilishuat', tipo: 'Árbol nacional', img: 'img/salvador_img/arbol.webp',
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
        ? `<img src="${s.img}" alt="${s.nombre}" class="cc-sim-img">`
        : `<span class="cc-sim-emoji">${s.emoji}</span>`;
      return `<div class="cc-sim-item cc-sim-clickable" onclick="openSimModal('${key}')">${visual}<span class="cc-sim-nombre">${s.nombre}</span><span class="cc-sim-tipo">${s.tipo}</span></div>`;
    };

    let html = '';
    if (data.simbolosMayores && data.simbolosMayores.length) {
      html += `<div class="cc-sim-section"><div class="cc-sim-label">🏅 Símbolos Mayores</div><div class="cc-sim-grid">${data.simbolosMayores.map(buildItem).join('')}</div></div>`;
    }
    if (data.simbolos && data.simbolos.length) {
      html += `<div class="cc-sim-section"><div class="cc-sim-label">🌿 Símbolos Menores</div><div class="cc-sim-grid">${data.simbolos.map(buildItem).join('')}</div></div>`;
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
  // Los elementos de estudiante fueron removidos del perfil; sección solo muestra herramientas del docente
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
  document.querySelectorAll('.drawer-item').forEach(b => b.classList.remove('active'));
  const view = document.getElementById(id);
  if (view) view.classList.add('active');
  const item = document.querySelector(`.drawer-item[data-view="${id}"]`);
  if (item) item.classList.add('active');

  if (id === 'view-inicio')   renderHome();
  if (id === 'view-misiones') renderMissions(currentFilter, currentQuery);
  if (id === 'view-progreso') renderProgress();
  if (id === 'view-perfil')   renderProfile();
  if (id === 'view-gobierno')       renderGobiernoEscolar();
  if (id === 'view-plan-accion')    paInit();
  if (id === 'view-parte-mensual')  { /* la UI se recalcula en tiempo real con inputs */ }

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
      scheduleNextTick();

      // Actualizar chips de materia (Próximamente vs conteo real)
      document.querySelectorAll('.subj-chip').forEach(chip => {
        const em = chip.querySelector('em');
        if (!em) return;
        if (s.country === 'HN') {
          const count = MISSIONS.filter(m => m.subject === chip.dataset.subject).length;
          em.textContent = `${count} misión${count !== 1 ? 'es' : ''}`;
        } else {
          em.textContent = 'Próximamente';
        }
      });

      // Mostrar u ocultar sección Misión destacada
      const featuredSection = document.getElementById('featured-section');
      if (featuredSection) featuredSection.hidden = (s.country !== 'HN');

      const d = COUNTRY_DATA[s.country];
      if (d) toast(`${d.bandera} ¡Explorando ${d.nombre}!`);

      // Quitar foco del select para que el scroll listener no quede bloqueado,
      // y restaurar el header si estaba oculto por el scroll.
      countryEl.blur();
      const header = document.querySelector('#view-inicio .app-header');
      if (header) { header.style.transform = ''; header.style.marginBottom = ''; }
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

  // ── Drawer / Hamburguesa ──
  function openDrawer() {
    document.getElementById('app-drawer').classList.add('open');
    document.getElementById('drawer-overlay').classList.add('open');
  }
  function closeDrawer() {
    document.getElementById('app-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('open');
  }

  document.querySelectorAll('.hamburger-btn').forEach(btn => {
    btn.addEventListener('click', openDrawer);
  });
  document.getElementById('drawer-close-btn')?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay')?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-item').forEach(item => {
    item.addEventListener('click', () => {
      switchView(item.dataset.view);
      closeDrawer();
    });
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

  // ── Header oculto al hacer scroll (acumulador anti-tembladera) ──
  document.querySelectorAll('.view-scroll').forEach(scroll => {
    let lastY = 0;
    let accumulated = 0;
    let ticking = false;
    const HIDE_THRESHOLD = 22;

    scroll.addEventListener('scroll', () => {
      if (ticking) return;
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;
      ticking = true;
      requestAnimationFrame(() => {
        const header = scroll.closest('.view') && scroll.closest('.view').querySelector('.app-header');
        // Solo ocultar header en vistas principales (hamburguesa), nunca en vistas secundarias (botón atrás)
        if (!header || !header.querySelector('.hamburger-btn')) { ticking = false; return; }
        const y = Math.max(0, scroll.scrollTop);

        if (y <= 4) {
          header.style.transform = '';
          header.style.marginBottom = '';
          lastY = 0; accumulated = 0;
          ticking = false;
          return;
        }

        const delta = y - lastY;
        lastY = y;
        accumulated += delta;

        if (accumulated > HIDE_THRESHOLD && y > 56) {
          const h = header.offsetHeight;
          header.style.transform = `translateY(-${h}px)`;
          header.style.marginBottom = `-${h}px`;
          accumulated = 0;
        } else if (accumulated < -HIDE_THRESHOLD) {
          header.style.transform = '';
          header.style.marginBottom = '';
          accumulated = 0;
        }
        ticking = false;
      });
    }, { passive: true });
  });

  // Navegación: Gobierno Escolar desde Perfil
  document.getElementById('goto-gobierno-btn')?.addEventListener('click', () => {
    switchView('view-gobierno');
  });

  // Botón volver desde Gobierno Escolar
  document.getElementById('gobierno-back-btn')?.addEventListener('click', () => {
    switchView('view-perfil');
  });
});

/* ─────────────────────────────────────────────
   GOBIERNO ESCOLAR 2026 LOGIC
───────────────────────────────────────────── */

const KEY_GE = 'meta_ge_v2';

/* Estado en memoria — no depende de localStorage para la UI */
let _GE = {
  mode: 'config',
  p1: { planilla: '', name: '', img: '', votes: 0 },
  p2: { planilla: '', name: '', img: '', votes: 0 },
  usedCodes: []
};
let _geCurrentCode = null;

function geLoadFromStorage() {
  try {
    const raw = localStorage.getItem(KEY_GE);
    if (raw) _GE = JSON.parse(raw);
  } catch (_) {}
  if (!_GE.usedCodes) _GE.usedCodes = [];
  if (!_GE.p1) _GE.p1 = { planilla: '', name: '', img: '', votes: 0 };
  if (!_GE.p2) _GE.p2 = { planilla: '', name: '', img: '', votes: 0 };
}

function geSave() {
  try { localStorage.setItem(KEY_GE, JSON.stringify(_GE)); } catch (_) {}
}

/* Mostrar un panel y ocultar los demás */
function geShowPanel(panelId) {
  ['ge-config-view','ge-code-view','ge-voting-view','ge-results-view'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === panelId) {
      el.removeAttribute('hidden');
      el.style.display = '';
    } else {
      el.style.display = 'none';
    }
  });
}

function geVal(id) {
  return (document.getElementById(id) || {}).value || '';
}

function handleImageUpload(e, previewId) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    const b64 = ev.target.result;
    // Miniatura junto al botón
    const thumb = document.getElementById(previewId);
    if (thumb) { thumb.src = b64; thumb.style.display = ''; thumb._b64 = b64; }
    // Vista previa grande
    const num = previewId === 'ge-preview-1' ? '1' : '2';
    const bigImg  = document.getElementById('ge-big-preview-' + num);
    const bigCard = document.getElementById('ge-prev-' + num);
    if (bigImg)  bigImg.src = b64;
    if (bigCard) bigCard.style.display = '';
    // Nombre en la vista previa (planilla o candidato)
    const nameEl = document.getElementById('ge-big-name-' + num);
    if (nameEl) {
      const label = (document.getElementById('ge-planilla-' + num) || {}).value
                 || (document.getElementById('ge-name-' + num)     || {}).value
                 || ('Planilla ' + num);
      nameEl.textContent = label;
    }
    // Mostrar sección previa
    const section = document.getElementById('ge-preview-section');
    if (section) section.style.display = '';
  };
  reader.readAsDataURL(file);
}

/* Llamada desde renderHome() */
function renderGobiernoEscolar() {
  geLoadFromStorage();
  if (_GE.mode === 'config') {
    geShowPanel('ge-config-view');
    const el = id => document.getElementById(id);
    if (el('ge-planilla-1')) el('ge-planilla-1').value = _GE.p1.planilla || '';
    if (el('ge-planilla-2')) el('ge-planilla-2').value = _GE.p2.planilla || '';
    if (el('ge-name-1'))     el('ge-name-1').value     = _GE.p1.name || '';
    if (el('ge-name-2'))     el('ge-name-2').value     = _GE.p2.name || '';
    const p1 = el('ge-preview-1'), p2 = el('ge-preview-2');
    if (_GE.p1.img && p1) { p1.src = _GE.p1.img; p1.style.display = ''; p1._b64 = _GE.p1.img; }
    if (_GE.p2.img && p2) { p2.src = _GE.p2.img; p2.style.display = ''; p2._b64 = _GE.p2.img; }

  } else if (_GE.mode === 'voting') {
    _geCurrentCode = null;
    geShowPanel('ge-code-view');
    const ci = document.getElementById('ge-code-input');
    const ce = document.getElementById('ge-code-error');
    if (ci) ci.value = '';
    if (ce) ce.style.display = 'none';

  } else if (_GE.mode === 'results') {
    geShowPanel('ge-results-view');
    const n1 = _GE.p1.planilla || _GE.p1.name || 'Planilla 1';
    const n2 = _GE.p2.planilla || _GE.p2.name || 'Planilla 2';
    const el = id => document.getElementById(id);
    if (el('ge-res-name-1'))  el('ge-res-name-1').textContent  = n1;
    if (el('ge-res-votes-1')) el('ge-res-votes-1').textContent = _GE.p1.votes + ' votos (esta urna)';
    if (el('ge-res-name-2'))  el('ge-res-name-2').textContent  = n2;
    if (el('ge-res-votes-2')) el('ge-res-votes-2').textContent = _GE.p2.votes + ' votos (esta urna)';
    if (el('ge-total-label-1')) el('ge-total-label-1').textContent = 'Total ' + n1;
    if (el('ge-total-label-2')) el('ge-total-label-2').textContent = 'Total ' + n2;
    if (el('ge-urna-lbl-p1'))   el('ge-urna-lbl-p1').textContent  = n1.substring(0, 10);
    if (el('ge-urna-lbl-p2'))   el('ge-urna-lbl-p2').textContent  = n2.substring(0, 10);
    calcTotalGE();
  }
}

function calcTotalGE() {
  const v = id => parseInt((document.getElementById(id) || {}).value) || 0;
  const t1 = _GE.p1.votes + v('ge-u2-p1') + v('ge-u3-p1') + v('ge-u4-p1');
  const t2 = _GE.p2.votes + v('ge-u2-p2') + v('ge-u3-p2') + v('ge-u4-p2');
  const el = id => document.getElementById(id);
  if (el('ge-total-1')) el('ge-total-1').textContent = t1;
  if (el('ge-total-2')) el('ge-total-2').textContent = t2;
  const wrap = el('ge-winner-wrap');
  if (wrap) {
    const n1 = _GE.p1.planilla || _GE.p1.name || 'Planilla 1';
    const n2 = _GE.p2.planilla || _GE.p2.name || 'Planilla 2';
    if (t1 + t2 > 0) {
      const msg = t1 > t2 ? `🏆 Ganador: <strong>${n1}</strong>`
                : t2 > t1 ? `🏆 Ganador: <strong>${n2}</strong>`
                : '🤝 Empate técnico';
      wrap.innerHTML = `<div class="ge-winner">${msg}</div>`;
    } else {
      wrap.innerHTML = '';
    }
  }
  const vc = el('ge-votes-count');
  if (vc) vc.textContent = `Estudiantes que votaron: ${_GE.usedCodes.length}  ·  Votos contados: ${t1 + t2}`;
}

function geValidateCode(raw) {
  const code = raw.trim().toUpperCase();
  if (!code) return { ok: false, msg: 'Escribe tu código de votación.' };
  // Formato: [1-6][A|B][1-99]  ej: 4B26
  if (!/^[1-6][AB]\d{1,2}$/.test(code))
    return { ok: false, msg: 'Código inválido. Formato: Grado(1-6) + Sección(A/B) + NºLista(1-99). Ej: 4B26' };
  const lista = parseInt(code.slice(2));
  if (lista < 1 || lista > 99)
    return { ok: false, msg: 'El número de lista debe estar entre 1 y 99.' };
  if (_GE.usedCodes.includes(code))
    return { ok: false, msg: '⚠️ Código ya usado. Cada estudiante solo vota una vez.' };
  return { ok: true, code };
}

function geShowBallot(code) {
  _geCurrentCode = code;
  const n1 = _GE.p1.planilla || _GE.p1.name || 'Planilla 1';
  const n2 = _GE.p2.planilla || _GE.p2.name || 'Planilla 2';
  const el = id => document.getElementById(id);

  const voterEl = el('ge-ballot-voter-code');
  if (voterEl) { voterEl.textContent = `Votante: ${code}`; voterEl.style.display = 'block'; }

  const img1 = el('ge-vote-img-1'), em1 = el('ge-vote-emoji-1');
  const img2 = el('ge-vote-img-2'), em2 = el('ge-vote-emoji-2');

  if (_GE.p1.img) {
    if (img1) { img1.src = _GE.p1.img; img1.style.display = 'block'; }
    if (em1) em1.style.display = 'none';
  } else {
    if (img1) img1.style.display = 'none';
    if (em1) em1.style.display = '';
  }
  if (_GE.p2.img) {
    if (img2) { img2.src = _GE.p2.img; img2.style.display = 'block'; }
    if (em2) em2.style.display = 'none';
  } else {
    if (img2) img2.style.display = 'none';
    if (em2) em2.style.display = '';
  }

  if (el('ge-vote-planilla-1')) el('ge-vote-planilla-1').textContent = n1;
  if (el('ge-vote-planilla-2')) el('ge-vote-planilla-2').textContent = n2;
  if (el('ge-vote-name-1'))     el('ge-vote-name-1').textContent     = _GE.p1.name || '';
  if (el('ge-vote-name-2'))     el('ge-vote-name-2').textContent     = _GE.p2.name || '';

  const fb = el('ge-vote-feedback');
  if (fb) fb.style.display = 'none';

  geShowPanel('ge-voting-view');
}

function geRecordVote(planilla) {
  if (!_geCurrentCode) return;
  if (planilla === 1) _GE.p1.votes++; else _GE.p2.votes++;
  _GE.usedCodes.push(_geCurrentCode);
  geSave();
  _geCurrentCode = null;

  const fb = document.getElementById('ge-vote-feedback');
  if (fb) { fb.style.display = 'block'; }

  setTimeout(() => {
    if (fb) fb.style.display = 'none';
    const ci = document.getElementById('ge-code-input');
    const ce = document.getElementById('ge-code-error');
    if (ci) { ci.value = ''; try { ci.focus(); } catch(_){} }
    if (ce) ce.style.display = 'none';
    geShowPanel('ge-code-view');
  }, 2200);
}

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('ge-img-1')?.addEventListener('change', e => handleImageUpload(e, 'ge-preview-1'));
  document.getElementById('ge-img-2')?.addEventListener('change', e => handleImageUpload(e, 'ge-preview-2'));

  /* ── GUARDAR Y HABILITAR URNA ── */
  const saveBtn = document.getElementById('ge-save-config-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const raw1  = geVal('ge-planilla-1');
      const raw2  = geVal('ge-planilla-2');
      const cand1 = geVal('ge-name-1');
      const cand2 = geVal('ge-name-2');
      _GE.p1.planilla = raw1 || cand1 || 'Planilla 1';
      _GE.p2.planilla = raw2 || cand2 || 'Planilla 2';
      _GE.p1.name     = cand1;
      _GE.p2.name     = cand2;
      _GE.p1.votes    = 0;
      _GE.p2.votes    = 0;
      _GE.usedCodes   = [];
      _GE.mode        = 'voting';
      const p1img = document.getElementById('ge-preview-1');
      const p2img = document.getElementById('ge-preview-2');
      if (p1img && p1img._b64) _GE.p1.img = p1img._b64;
      if (p2img && p2img._b64) _GE.p2.img = p2img._b64;
      geSave();
      /* Transición directa al panel de código */
      _geCurrentCode = null;
      const ci = document.getElementById('ge-code-input');
      const ce = document.getElementById('ge-code-error');
      if (ci) ci.value = '';
      if (ce) ce.style.display = 'none';
      geShowPanel('ge-code-view');
      toast('✅ ¡Urna habilitada! Ingresa el código para votar.');
    });
  }

  /* ── VALIDAR CÓDIGO ── */
  const validateBtn = document.getElementById('ge-validate-code-btn');
  if (validateBtn) {
    validateBtn.addEventListener('click', () => {
      const input   = document.getElementById('ge-code-input');
      const errorEl = document.getElementById('ge-code-error');
      const result  = geValidateCode(input ? input.value : '');
      if (result.ok) {
        if (errorEl) errorEl.style.display = 'none';
        geShowBallot(result.code);
      } else {
        if (errorEl) { errorEl.textContent = result.msg; errorEl.style.display = 'block'; }
        else toast(result.msg);
      }
    });
  }

  document.getElementById('ge-code-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('ge-validate-code-btn')?.click();
  });

  /* ── FINALIZAR VOTACIÓN (secretario) ── */
  document.getElementById('ge-end-voting-btn')?.addEventListener('click', () => {
    const pin = prompt('PIN del secretario de mesa para cerrar la urna (por defecto: 1234):');
    if (pin === '1234') {
      _GE.mode = 'results';
      geSave();
      renderGobiernoEscolar();
    } else if (pin !== null) {
      toast('PIN incorrecto');
    }
  });

  /* ── VOTAR ── */
  document.getElementById('ge-vote-1')?.addEventListener('click', () => geRecordVote(1));
  document.getElementById('ge-vote-2')?.addEventListener('click', () => geRecordVote(2));

  /* ── REINICIAR ── */
  document.getElementById('ge-reset-btn')?.addEventListener('click', () => {
    if (confirm('¿Reiniciar la elección? Se borrarán todos los votos y la configuración.')) {
      localStorage.removeItem(KEY_GE);
      _GE = { mode: 'config', p1: { planilla:'', name:'', img:'', votes:0 }, p2: { planilla:'', name:'', img:'', votes:0 }, usedCodes:[] };
      renderGobiernoEscolar();
      toast('Elección reiniciada');
    }
  });

  /* ── SUMAR URNAS ── */
  ['ge-u2-p1','ge-u2-p2','ge-u3-p1','ge-u3-p2','ge-u4-p1','ge-u4-p2'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', calcTotalGE);
  });
});

/* ─────────────────────────────────────────────
   PLAN DE ACCIÓN — ANÁLISIS DE CALIFICACIONES
───────────────────────────────────────────── */

const PA_CATS = [
  { key:'avanzado',       label:'Avanzado',       min:95,  max:100, color:'#16a34a', bg:'#dcfce7' },
  { key:'muyBueno',       label:'Muy Bueno',      min:80,  max:94,  color:'#0891b2', bg:'#cffafe' },
  { key:'satisfactorio',  label:'Satisfactorio',  min:70,  max:79,  color:'#a16207', bg:'#fef9c3' },
  { key:'debeMejorar',    label:'Debe Mejorar',   min:60,  max:69,  color:'#b45309', bg:'#fef3c7' },
  { key:'insatisfactorio',label:'Insatisfactorio',min:0,   max:59,  color:'#dc2626', bg:'#fee2e2' },
];
const PA_SUGS = {
  avanzado:       'Excelente comprensión. Retarlos con ejercicios de nivel superior y tutorías entre pares.',
  muyBueno:       'Dominan el tema teóricamente. Proporcionarles actividades de aplicación práctica.',
  satisfactorio:  'Comprensión básica. Usar recursos visuales y reglas mnemotécnicas para afianzar.',
  debeMejorar:    'Confunden conceptos. Actividades lúdicas y trabajo con pares más avanzados.',
  insatisfactorio:'ALERTA: Atención inmediata. Regresar a conceptos fundamentales con material simplificado.',
};

let _paInitDone = false;

function paGradeColors(g) {
  if (typeof g !== 'number') return { bg:'#e5e7eb', txt:'#374151' };
  if (g >= 95) return { bg:'#22c55e', txt:'#fff' };
  if (g >= 80) return { bg:'#22d3ee', txt:'#000' };
  if (g >= 70) return { bg:'#fef08a', txt:'#000' };
  if (g >= 60) return { bg:'#facc15', txt:'#000' };
  return { bg:'#ef4444', txt:'#fff' };
}

function paAddRow(num, name = '', grade = '') {
  const list = document.getElementById('pa-students-list');
  if (!list) return;
  const row = document.createElement('div');
  row.className = 'pa-student-row';
  row.innerHTML = `
    <span class="pa-row-num">${num}</span>
    <input type="text" class="pa-inp-field pa-inp-name" placeholder="Nombre…" value="${name}">
    <input type="text" class="pa-inp-grade-cell" placeholder="0-100 / NSP" value="${grade}" maxlength="3">
    <button class="pa-del-row" title="Eliminar"><i class="fa-solid fa-xmark"></i></button>`;
  row.querySelector('.pa-del-row').addEventListener('click', () => {
    row.remove();
    document.querySelectorAll('.pa-student-row').forEach((r, i) => {
      const n = r.querySelector('.pa-row-num'); if (n) n.textContent = i + 1;
    });
  });
  list.appendChild(row);
}

function paCollect() {
  return Array.from(document.querySelectorAll('.pa-student-row')).map((row, i) => {
    const name  = row.querySelector('.pa-inp-name')?.value.trim() || `#${i + 1}`;
    const raw   = row.querySelector('.pa-inp-grade-cell')?.value.trim().toUpperCase() || '';
    const grade = raw === 'NSP' ? 'NSP' : (raw === '' ? null : (parseFloat(raw) || 0));
    return { id: i + 1, name, grade };
  }).filter(s => s.grade !== null);
}

function paGenerate() {
  const students = paCollect();
  if (!students.length) { toast('Agrega al menos un estudiante con nombre'); return; }

  const numeric   = students.filter(s => typeof s.grade === 'number');
  const nsp       = students.filter(s => s.grade === 'NSP');
  const total     = students.length;
  const avg       = numeric.length ? (numeric.reduce((a, s) => a + s.grade, 0) / numeric.length) : 0;
  const passing   = numeric.filter(s => s.grade >= 70).length;
  const pRate     = numeric.length ? Math.round((passing / numeric.length) * 100) : 0;
  const toRecover = numeric.filter(s => s.grade <= 65);

  const cats = {};
  PA_CATS.forEach(c => { cats[c.key] = numeric.filter(s => s.grade >= c.min && s.grade <= c.max).length; });
  const maxCat = Math.max(...Object.values(cats), 1);

  const grado     = document.getElementById('pa-grado')?.value    || '—';
  const seccion   = document.getElementById('pa-seccion')?.value  || '—';
  const docente   = document.getElementById('pa-docente')?.value  || '—';
  const evaluacion= document.getElementById('pa-evaluacion')?.value || 'Evaluación';

  const avgColor = avg >= 70 ? '#16a34a' : avg >= 60 ? '#d97706' : '#dc2626';

  const dash = document.getElementById('pa-dashboard');
  if (!dash) return;

  dash.innerHTML = `
    <div class="pa-dash-head">
      <div>
        <div class="pa-dash-title">ANÁLISIS Y PLAN DE ACCIÓN</div>
        <div class="pa-dash-sub">📌 ${evaluacion}</div>
      </div>
      <div class="pa-dash-meta">
        <span><b>Grado:</b> ${grado}</span>
        <span><b>Sección:</b> ${seccion}</span>
        <span><b>Docente:</b> ${docente}</span>
      </div>
    </div>

    <div class="pa-tabs-out">
      <button class="pa-otab pa-otab-active" data-otab="overview">📊 Dashboard</button>
      <button class="pa-otab" data-otab="planilla">📋 Planilla</button>
    </div>

    <div id="pa-out-overview">
      <div class="pa-stats-grid">
        <div class="pa-stat-card"><div class="pa-stat-ic" style="background:#3b82f6">👥</div><div class="pa-stat-info"><div class="pa-stat-lbl">En Lista</div><div class="pa-stat-val">${total}</div></div></div>
        <div class="pa-stat-card"><div class="pa-stat-ic" style="background:#8b5cf6">📈</div><div class="pa-stat-info"><div class="pa-stat-lbl">Promedio</div><div class="pa-stat-val" style="color:${avgColor}">${avg.toFixed(1)}</div></div></div>
        <div class="pa-stat-card"><div class="pa-stat-ic" style="background:#22c55e">🏆</div><div class="pa-stat-info"><div class="pa-stat-lbl">Aprobación</div><div class="pa-stat-val">${pRate}%</div><div class="pa-stat-sub">≥ 70%</div></div></div>
        <div class="pa-stat-card"><div class="pa-stat-ic" style="background:#ef4444">⚠️</div><div class="pa-stat-info"><div class="pa-stat-lbl">Recuperación</div><div class="pa-stat-val">${toRecover.length}</div><div class="pa-stat-sub">nota ≤ 65</div></div></div>
      </div>

      <div class="pa-two-col">
        <div class="pa-card">
          <div class="pa-card-title">📊 Distribución</div>
          ${PA_CATS.map(c => `
            <div class="pa-dist-row">
              <div class="pa-dist-info"><span class="pa-dist-lbl">${c.label}</span><span class="pa-dist-cnt">${cats[c.key]}</span></div>
              <div class="pa-dist-track"><div class="pa-dist-fill" style="width:${Math.round((cats[c.key]/maxCat)*100)}%;background:${c.color}"></div></div>
            </div>`).join('')}
        </div>
        <div class="pa-card">
          <div class="pa-card-title">💡 Sugerencias</div>
          ${PA_CATS.filter(c => cats[c.key] > 0).map(c => `
            <div class="pa-sug-item" style="border-left:4px solid ${c.color};background:${c.bg}">
              <div class="pa-sug-head"><span class="pa-sug-title" style="color:${c.color}">${c.label}</span><span class="pa-sug-cnt">${cats[c.key]}</span></div>
              <p class="pa-sug-text">${PA_SUGS[c.key]}</p>
            </div>`).join('')}
        </div>
      </div>

      <div class="pa-card pa-plan-card">
        <div class="pa-card-title">📅 Plan de Acción — Recuperación y NSP</div>
        <div class="pa-plan-grid">
          <div>
            <div class="pa-plan-sub">⚠️ Lista de Recuperación (${toRecover.length} alumnos)</div>
            <p class="pa-plan-note">Irán a recuperación una semana después de la entrega del primer examen.</p>
            <ul class="pa-recup-list">
              ${toRecover.length ? toRecover.map(s => `
                <li class="pa-recup-item">
                  <span class="pa-recup-name">#${s.id} ${s.name}</span>
                  <span class="pa-grade-chip" style="background:${s.grade<=55?'#ef4444':'#facc15'};color:${s.grade<=55?'#fff':'#000'}">${s.grade}</span>
                </li>`).join('') : '<li class="pa-empty-msg">Sin alumnos a recuperación ✅</li>'}
            </ul>
          </div>
          <div>
            <div class="pa-plan-sub">📋 Prueba Pendiente — NSP (${nsp.length})</div>
            <p class="pa-plan-note">Harán la prueba el mismo día que los alumnos en recuperación.</p>
            <ul class="pa-recup-list">
              ${nsp.length ? nsp.map(s => `
                <li class="pa-recup-item">
                  <span class="pa-recup-name">#${s.id} ${s.name}</span>
                  <span class="pa-grade-chip" style="background:#d1d5db;color:#374151">NSP</span>
                </li>`).join('') : '<li class="pa-empty-msg">Sin alumnos NSP ✅</li>'}
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div id="pa-out-planilla" style="display:none;">
      <div class="pa-card" style="padding:0;overflow:hidden;">
        <table class="pa-table">
          <thead><tr><th>#</th><th>Nombre</th><th>${evaluacion}</th></tr></thead>
          <tbody>
            ${students.map(s => {
              const c = paGradeColors(s.grade);
              return `<tr><td class="pa-td-n">${s.id}</td><td class="pa-td-name">${s.name}</td><td class="pa-td-g" style="background:${c.bg};color:${c.txt}">${s.grade ?? '—'}</td></tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <button onclick="paPrint()" class="pa-print-btn">
      <i class="fa-solid fa-print"></i> Imprimir / Guardar PDF
    </button>`;

  // Tab switching
  dash.querySelectorAll('.pa-otab').forEach(tab => {
    tab.addEventListener('click', () => {
      dash.querySelectorAll('.pa-otab').forEach(t => t.classList.remove('pa-otab-active'));
      tab.classList.add('pa-otab-active');
      document.getElementById('pa-out-overview').style.display  = tab.dataset.otab === 'overview'  ? '' : 'none';
      document.getElementById('pa-out-planilla').style.display  = tab.dataset.otab === 'planilla'  ? '' : 'none';
    });
  });

  dash.style.display = '';
  dash.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function paPrint() {
  const students = _paStudents;
  if (!students || !students.length) { toast('Genera el análisis primero'); return; }

  const numeric    = students.filter(s => typeof s.grade === 'number');
  const nsp        = students.filter(s => s.grade === 'NSP');
  const avg        = numeric.length ? (numeric.reduce((a,s) => a + s.grade, 0) / numeric.length) : 0;
  const passing    = numeric.filter(s => s.grade >= 70).length;
  const pRate      = numeric.length ? Math.round((passing / numeric.length) * 100) : 0;
  const toRecover  = numeric.filter(s => s.grade <= 65);
  const cats       = {};
  PA_CATS.forEach(c => { cats[c.key] = numeric.filter(s => s.grade >= c.min && s.grade <= c.max).length; });
  const maxCatV    = Math.max(...Object.values(cats), 1);

  const grado      = document.getElementById('pa-grado')?.value     || '—';
  const seccion    = document.getElementById('pa-seccion')?.value   || '—';
  const docente    = document.getElementById('pa-docente')?.value   || '—';
  const evaluacion = document.getElementById('pa-evaluacion')?.value || 'Evaluación';
  const fecha      = new Date().toLocaleDateString('es-HN', { year:'numeric', month:'long', day:'numeric' });

  const avgColor   = avg >= 70 ? '#16a34a' : avg >= 60 ? '#d97706' : '#dc2626';

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Plan de Acción — ${evaluacion}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:Arial,sans-serif;font-size:12px;color:#111;background:#fff;}
.page{max-width:190mm;margin:0 auto;padding:12mm 15mm;}
.head{background:#1e3a7c;color:#fff;padding:14px 18px;border-radius:8px;margin-bottom:14px;}
.head-title{font-size:16px;font-weight:900;letter-spacing:.8px;}
.head-sub{font-size:11px;opacity:.85;margin-top:3px;}
.head-meta{display:flex;flex-wrap:wrap;gap:14px;margin-top:8px;font-size:10px;background:rgba(255,255,255,.15);padding:7px 10px;border-radius:6px;}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px;page-break-inside:avoid;}
.stat{border:1px solid #e2e8f0;border-radius:7px;padding:10px;text-align:center;}
.stat-lbl{font-size:9px;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:.4px;}
.stat-val{font-size:22px;font-weight:900;color:#1e3a7c;margin:3px 0;}
.stat-sub{font-size:9px;color:#94a3b8;}
.sec-title{font-size:12px;font-weight:800;color:#1e3a7c;border-bottom:2px solid #e2e8f0;padding-bottom:5px;margin-bottom:10px;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;page-break-inside:avoid;}
.card{border:1px solid #e2e8f0;border-radius:7px;padding:12px;page-break-inside:avoid;}
.dist-row{margin-bottom:7px;}
.dist-info{display:flex;justify-content:space-between;font-size:10px;margin-bottom:2px;}
.dist-bar{height:6px;background:#f1f5f9;border-radius:4px;overflow:hidden;}
.dist-fill{height:100%;border-radius:4px;}
.sug-item{border-left:4px solid;padding:7px 9px;border-radius:4px;margin-bottom:7px;page-break-inside:avoid;}
.sug-head{display:flex;justify-content:space-between;margin-bottom:3px;}
.sug-title{font-size:10px;font-weight:800;}
.sug-cnt{font-size:9px;background:rgba(0,0,0,.12);padding:1px 6px;border-radius:6px;}
.sug-text{font-size:10px;color:#374151;line-height:1.4;}
.plan-box{border:1px solid #fecaca;border-left:4px solid #ef4444;border-radius:7px;padding:12px;margin-bottom:14px;}
.plan-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:10px;}
.plan-sub{font-size:11px;font-weight:800;margin-bottom:5px;}
.plan-note{font-size:9px;color:#64748b;background:#f8fafc;padding:5px 7px;border-radius:5px;margin-bottom:6px;line-height:1.4;}
.rlist{list-style:none;}
.ritem{display:flex;justify-content:space-between;align-items:center;padding:3px 7px;border:1px solid #e2e8f0;border-radius:5px;margin-bottom:3px;font-size:10px;page-break-inside:avoid;}
.chip{font-weight:700;padding:2px 7px;border-radius:5px;font-size:9px;}
table{width:100%;border-collapse:collapse;font-size:11px;}
thead tr{background:#eff6ff;page-break-inside:avoid;}
th{color:#1e3a7c;font-weight:700;padding:7px 10px;text-align:left;border:1px solid #e2e8f0;font-size:9px;text-transform:uppercase;letter-spacing:.4px;}
td{padding:5px 10px;border:1px solid #e2e8f0;}
tr{page-break-inside:avoid;}
tbody tr:nth-child(even){background:#f8fafc;}
.td-n{text-align:center;font-weight:700;color:#94a3b8;width:30px;}
.td-g{text-align:center;font-weight:800;width:80px;}
.footer{font-size:9px;color:#94a3b8;text-align:center;border-top:1px solid #e2e8f0;padding-top:8px;margin-top:14px;}
.pb{page-break-before:always;}
@media print{body{padding:0;}.page{padding:8mm 12mm;}}
</style></head><body><div class="page">

<div class="head">
  <div class="head-title">ANÁLISIS Y PLAN DE ACCIÓN</div>
  <div class="head-sub">📌 ${evaluacion}</div>
  <div class="head-meta">
    <span><b>Grado:</b> ${grado}</span><span><b>Sección:</b> ${seccion}</span>
    <span><b>Docente:</b> ${docente}</span><span><b>Fecha:</b> ${fecha}</span>
  </div>
</div>

<div class="stats">
  <div class="stat"><div class="stat-lbl">En Lista</div><div class="stat-val">${students.length}</div></div>
  <div class="stat"><div class="stat-lbl">Promedio</div><div class="stat-val" style="color:${avgColor}">${avg.toFixed(1)}</div></div>
  <div class="stat"><div class="stat-lbl">Aprobación</div><div class="stat-val">${pRate}%</div><div class="stat-sub">≥ 70%</div></div>
  <div class="stat"><div class="stat-lbl">Recuperación</div><div class="stat-val">${toRecover.length}</div><div class="stat-sub">nota ≤ 65</div></div>
</div>

<div class="two-col">
  <div class="card">
    <div class="sec-title">Distribución</div>
    ${PA_CATS.map(c => `<div class="dist-row"><div class="dist-info"><span>${c.label}</span><span>${cats[c.key]} alum.</span></div><div class="dist-bar"><div class="dist-fill" style="width:${Math.round((cats[c.key]/maxCatV)*100)}%;background:${c.color}"></div></div></div>`).join('')}
  </div>
  <div class="card">
    <div class="sec-title">Sugerencias Pedagógicas</div>
    ${PA_CATS.filter(c => cats[c.key] > 0).map(c => `<div class="sug-item" style="border-left-color:${c.color};background:${c.bg}"><div class="sug-head"><span class="sug-title" style="color:${c.color}">${c.label}</span><span class="sug-cnt">${cats[c.key]}</span></div><p class="sug-text">${PA_SUGS[c.key]}</p></div>`).join('')}
  </div>
</div>

<div class="plan-box">
  <div class="sec-title">Plan de Acción — Recuperación y NSP</div>
  <div class="plan-grid">
    <div>
      <div class="plan-sub">⚠️ Lista de Recuperación (${toRecover.length})</div>
      <div class="plan-note">Irán a recuperación una semana después de la entrega del primer examen.</div>
      <ul class="rlist">${toRecover.length ? toRecover.map(s => `<li class="ritem"><span>#${s.id} ${s.name}</span><span class="chip" style="background:${s.grade<=55?'#ef4444':'#facc15'};color:${s.grade<=55?'#fff':'#000'}">${s.grade}</span></li>`).join('') : '<li style="font-size:10px;color:#64748b;font-style:italic">Sin alumnos ✅</li>'}</ul>
    </div>
    <div>
      <div class="plan-sub">📋 NSP — Prueba Pendiente (${nsp.length})</div>
      <div class="plan-note">Harán la prueba el mismo día que los alumnos en recuperación.</div>
      <ul class="rlist">${nsp.length ? nsp.map(s => `<li class="ritem"><span>#${s.id} ${s.name}</span><span class="chip" style="background:#d1d5db;color:#374151">NSP</span></li>`).join('') : '<li style="font-size:10px;color:#64748b;font-style:italic">Sin alumnos ✅</li>'}</ul>
    </div>
  </div>
</div>

<div class="pb"></div>
<div class="sec-title" style="margin-bottom:10px;">Planilla de Calificaciones</div>
<table>
  <thead><tr><th class="td-n">#</th><th>Nombre del Estudiante</th><th class="td-g">${evaluacion}</th></tr></thead>
  <tbody>
    ${students.map(s => { const c = paGradeColors(s.grade); return `<tr><td class="td-n">${s.id}</td><td>${s.name}</td><td class="td-g" style="background:${c.bg};color:${c.txt}">${s.grade ?? '—'}</td></tr>`; }).join('')}
  </tbody>
</table>

<div class="footer">Generado con M.E.T.A.S. — Misiones Educativas Tecnológicas Asincrónicas y Sincrónicas · ${fecha}</div>
</div>
</body></html>`;

  const printWin = window.open('', '_blank');
  if (!printWin) {
    toast('Activa las ventanas emergentes para imprimir');
    return;
  }
  printWin.document.open();
  printWin.document.write(html);
  printWin.document.close();
  printWin.focus();
  setTimeout(() => printWin.print(), 700);
}
window.paPrint = paPrint;

function paInit() {
  if (_paInitDone) return;
  _paInitDone = true;
  for (let i = 1; i <= 5; i++) paAddRow(i);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('goto-plan-btn')?.addEventListener('click', () => { switchView('view-plan-accion'); paInit(); });
  document.getElementById('plan-back-btn')?.addEventListener('click', () => switchView('view-perfil'));

  document.getElementById('pa-add-student-btn')?.addEventListener('click', () => {
    paAddRow(document.querySelectorAll('.pa-student-row').length + 1);
  });

  document.getElementById('pa-generate-btn')?.addEventListener('click', paGenerate);

  // Entry tab switching
  document.querySelectorAll('.pa-etab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.pa-etab').forEach(t => t.classList.remove('pa-etab-active'));
      tab.classList.add('pa-etab-active');
      document.getElementById('pa-entry-manual').style.display = tab.dataset.etab === 'manual' ? '' : 'none';
      document.getElementById('pa-entry-pegar').style.display  = tab.dataset.etab === 'pegar'  ? '' : 'none';
    });
  });

  // Import from paste
  document.getElementById('pa-import-btn')?.addEventListener('click', () => {
    const text = document.getElementById('pa-paste-area')?.value.trim();
    if (!text) return;
    const lines = text.split('\n').filter(l => l.trim());
    const list = document.getElementById('pa-students-list');
    if (list) list.innerHTML = '';
    lines.forEach((line, i) => {
      const parts = line.split(',');
      const name  = (parts[0] || '').trim();
      const grade = (parts[1] || '').trim();
      if (name) paAddRow(i + 1, name, grade);
    });
    // switch to manual tab to show
    document.querySelectorAll('.pa-etab').forEach(t => t.classList.remove('pa-etab-active'));
    document.querySelector('.pa-etab[data-etab="manual"]')?.classList.add('pa-etab-active');
    document.getElementById('pa-entry-manual').style.display = '';
    document.getElementById('pa-entry-pegar').style.display  = 'none';
    toast(`✅ ${lines.length} estudiantes importados`);
  });
});

/* ─────────────────────────────────────────────
   PARTE MENSUAL — LÓGICA SEDUC HONDURAS
   Fórmulas:
   Asistencia Media = Matrícula Actual − (Total Inasistencias ÷ Días Trabajados)
   Tanto por Ciento = (Asistencia Media ÷ Matrícula Actual) × 100
───────────────────────────────────────────── */

let _pmSeccion = 'A';

function pmN(id) { return parseInt(document.getElementById(id)?.value) || 0; }
function pmSet(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }

function pmActualizar() {
  // Matrícula Actual = Anterior + Ingresos − Desertores ± Traslados (por género)
  const antH = pmN('pm-ant-h'), antM = pmN('pm-ant-m');
  const ingH = pmN('pm-ing-h'), ingM = pmN('pm-ing-m');
  const desH = pmN('pm-des-h'), desM = pmN('pm-des-m');
  const traH = pmN('pm-tra-h'), traM = pmN('pm-tra-m');

  const actH = antH + ingH - desH + traH;
  const actM = antM + ingM - desM + traM;
  const actTot = actH + actM;

  pmSet('pm-ant-tot', antH + antM);
  pmSet('pm-ing-tot', ingH + ingM);
  pmSet('pm-des-tot', desH + desM);
  pmSet('pm-tra-tot', traH + traM);
  pmSet('pm-act-h',   Math.max(0, actH));
  pmSet('pm-act-m',   Math.max(0, actM));
  pmSet('pm-act-tot', Math.max(0, actTot));

  // Inasistencias
  const inasH = pmN('pm-inas-h'), inasM = pmN('pm-inas-m');
  pmSet('pm-inas-tot', inasH + inasM);
  const inasTot = inasH + inasM;

  const dias = pmN('pm-dias');
  const matricula = Math.max(0, actTot);

  // Calcular resultados
  const mediaEl = document.getElementById('pm-asist-media');
  const pctEl   = document.getElementById('pm-pct-asist');
  const barEl   = document.getElementById('pm-bar-fill');
  const semaEl  = document.getElementById('pm-semaforo');

  if (!matricula || !dias) {
    if (mediaEl) mediaEl.textContent = '—';
    if (pctEl)   pctEl.textContent   = '—';
    if (barEl)   barEl.style.width   = '0%';
    if (semaEl)  semaEl.innerHTML    = '';
    return;
  }

  const media = matricula - (inasTot / dias);
  const pct   = (media / matricula) * 100;

  if (mediaEl) mediaEl.textContent = media.toFixed(2);
  if (pctEl) {
    pctEl.textContent = pct.toFixed(1) + '%';
    pctEl.style.color = pct >= 90 ? '#16a34a' : pct >= 75 ? '#d97706' : '#dc2626';
  }
  if (barEl) {
    barEl.style.width = Math.min(100, Math.max(0, pct)).toFixed(1) + '%';
    barEl.style.background = pct >= 90
      ? 'linear-gradient(90deg,#22c55e,#16a34a)'
      : pct >= 75 ? 'linear-gradient(90deg,#f59e0b,#d97706)'
      : 'linear-gradient(90deg,#ef4444,#dc2626)';
  }
  if (semaEl) {
    const icon = pct >= 90 ? '✅' : pct >= 75 ? '⚠️' : '🔴';
    const msg  = pct >= 90 ? 'Asistencia satisfactoria'
               : pct >= 75 ? 'Asistencia regular — requiere seguimiento'
               : 'Asistencia crítica — acción inmediata';
    semaEl.innerHTML = `<span class="pm-semaforo-text">${icon} ${msg}</span>`;
  }
}

document.addEventListener('DOMContentLoaded', () => {

  // Navegación
  document.getElementById('goto-parte-btn')?.addEventListener('click', () => switchView('view-parte-mensual'));
  document.getElementById('parte-back-btn')?.addEventListener('click', () => switchView('view-perfil'));

  // Sección
  document.querySelectorAll('.pm-sec-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pm-sec-btn').forEach(b => b.classList.remove('pm-sec-active'));
      btn.classList.add('pm-sec-active');
      _pmSeccion = btn.dataset.sec;
    });
  });

  // Recalcular en cualquier cambio
  const pmIds = [
    'pm-ant-h','pm-ant-m','pm-ing-h','pm-ing-m',
    'pm-des-h','pm-des-m','pm-tra-h','pm-tra-m',
    'pm-inas-h','pm-inas-m','pm-dias'
  ];
  pmIds.forEach(id => document.getElementById(id)?.addEventListener('input', pmActualizar));

});
