/* ════════════════════════════════════════════════════════════════════
   LA CONSTITUCIÓN DE LA REPÚBLICA · vista trabajando dentro de otras leyes
   ────────────────────────────────────────────────────────────────────
   Esto NO es contenido de una misión: es un DATO del país, y por eso vive
   aquí y no dentro de la misión que lo usa. La razón es la del Himno, la de
   los próceres y la de los poderes: el mismo texto acaba en dos sitios que
   una persona lee —la pantalla y la ficha que se fotocopia— y si se separan,
   el alumno estudia un número de artículo y el examen le pide otro.
   `_dev/verifica-constitucion.js` compara las dos.

   ⚠️ ESTA MISIÓN NO REPITE LA DE LOS TRES PODERES (id 70). Aquella enseña
   DÓNDE ESTÁ la Constitución —arriba de todas las normas— y quién hace qué
   con una ley. Esta enseña a USARLA: leer una cita, verla trabajando dentro
   de leyes de verdad y reconocer cuándo se está violando. Es el reparto que
   hace el propio DCNB.

   ⚠️ DE DÓNDE SALIÓ CADA COSA. Ninguna línea de aquí se buscó en internet.

   · LA EXPECTATIVA es del DCNB, Ciencias Sociales de QUINTO GRADO, II Ciclo
     (`_dev/dcnb/dcneb-basica-ii-ciclo-52-ciencias-sociales-quinto-grado.md`,
     confirmada en `_dev/dcnb-pdf/dcneb-basica-ii-ciclo.pdf`, página 286 del
     archivo — «Secretaría de Educación 292» en el pie impreso). Dice, con
     estas palabras: «Argumentan sobre la democracia participativa, por medio
     del estudio y análisis de artículos específicos de la Constitución de la
     República de Honduras, acuerdos, convenios internacionales y otras
     leyes», y entre sus procesos: «Seleccionan artículos de la Constitución
     de la República que permitan establecer relaciones con normativa
     internacional…» y «Ejemplifican un caso de violación de los artículos de
     la Constitución y elaboran un análisis crítico».

   · LOS ARTÍCULOS de abajo NO se sacaron de la Constitución —que no está
     aquí— sino de las CUATRO LEYES que sí están en `_dev/leyes/` y que la
     citan por número. De cada uno se escribe lo único que esas leyes
     acreditan: QUÉ ARTÍCULO es y PARA QUÉ lo invocan. Uno solo, el 162,
     aparece citado palabra por palabra, y por eso es el único cuyo TEXTO se
     puede enseñar.

   ⚠️ LO QUE NO SE ESCRIBE, Y A PROPÓSITO: el contenido de los demás
   artículos, cuántos artículos tiene la Constitución, en qué año se aprobó y
   cómo se reforma. **La Constitución de la República NO está en
   `_dev/leyes/`**, y el entorno no la alcanza —el README de esa carpeta ya
   deja escrito que los portales del Estado contestan 403 a través del
   proxy—. Un dato así, sacado de un extracto de buscador, no acredita nada:
   es la lección de `INVESTIGACION-ESTATUTO-DOCENTE.md`, la misma que dejó
   fuera los números de decreto de la flor y del árbol nacionales.

   Y no se tapa con silencio: el propio DCNB pide SELECCIONAR artículos y
   analizarlos, o sea ir al texto. Por eso va en `CONST_INVESTIGA`, que es una
   actividad. El día que el PDF entre a `_dev/leyes/`, se escriben.
   ════════════════════════════════════════════════════════════════════ */

/* Cómo se lee una cita. Es la destreza de la misión y no la trae ningún
   libro: el alumno ve «artículo 128 numeral 7» y no sabe que son dos cosas
   dentro de otra. Sin esto, todo lo demás es una lista de números. */
const CONST_COMO_SE_LEE = {
  ejemplo: 'artículo 128 numeral 7 de la Constitución de la República',
  piezas: [
    { parte: 'artículo 128', que: 'El ARTÍCULO es la unidad de una ley: un tema, numerado. La Constitución se lee y se cita por artículos.' },
    { parte: 'numeral 7', que: 'Dentro de un artículo largo, los NUMERALES son sus puntos numerados. El 7 es uno de los puntos del artículo 128.' },
    { parte: 'de la Constitución de la República', que: 'Dice de QUÉ norma se habla. El artículo 128 de la Constitución no es el artículo 128 de otra ley: el número solo no basta nunca.' }
  ],
  aviso: 'Cuando copies una cita, cópiala entera. «El artículo 128» a secas no lleva a ninguna parte: hay un artículo 128 en casi todas las leyes del país.'
};

/* Los artículos que las leyes de `_dev/leyes/` citan por número. De cada uno,
   lo único que esas leyes acreditan: cuál es y para qué lo invocan. */
const CONST_ARTICULOS = [
  {
    art: 'Artículo 162', clave: 'a162', emoji: '🍎',
    tema: 'Lo que la Constitución dice de tu maestro',
    /* ⚠️ El ÚNICO con texto, y no es un resumen: el Estatuto lo cita
       palabra por palabra, precedido de «establece que:». */
    citaLiteral: 'Por su carácter informativo y formativo la docencia tiene formación social y humana que determina para el educador responsabilidades científicas y morales frente a sus discípulos, frente a la institución en que labora y ante la sociedad.',
    paraQue: 'Con este artículo empieza el Estatuto del Docente: es la razón por la que el magisterio tiene una ley propia y no las reglas de cualquier otro empleo.',
    donde: 'Estatuto del Docente Hondureño, Decreto 136-97, considerandos.',
    porQueImporta: 'Fíjate en a quién nombra primero: «frente a sus discípulos». Antes que a la institución y antes que a la sociedad. La Constitución pone al alumno delante — y ese alumno eres tú.'
  },
  {
    art: 'Artículo 165', clave: 'a165', emoji: '📜',
    tema: 'La Constitución no solo prohíbe: MANDA hacer leyes',
    paraQue: 'El Estatuto del Docente existe porque este artículo lo ordenó. El Congreso lo llama «un mandato impostergable instituido en el Artículo 165 de la Constitución de la República».',
    donde: 'Estatuto del Docente Hondureño, Decreto 136-97, considerandos.',
    porQueImporta: 'Casi todo el mundo cree que una Constitución sirve para prohibir. También ENCARGA: hay leyes que existen porque ella mandó que se escribieran, y mientras no se escriben, ese mandato está sin cumplir.'
  },
  {
    art: 'Artículos 34 y 168', clave: 'a34', emoji: '🌎',
    tema: 'Los maestros de otros países',
    paraQue: 'Un docente extranjero puede entrar a la carrera docente hondureña, y el Estatuto lo sujeta a lo que dicen estos artículos de la Constitución además de al Código del Trabajo.',
    donde: 'Estatuto del Docente Hondureño, Decreto 136-97, Artículo 8.',
    porQueImporta: 'Una ley no decide sola: dice «sujeto a lo prevenido en los Artículos 34, 168 y demás relacionados de la Constitución». Escribe encima de un piso que ya estaba puesto.'
  },
  {
    art: 'Artículos 245 numeral 11, 157 y 163', clave: 'a245', emoji: '🏛️',
    tema: 'De dónde saca el Ejecutivo el permiso para reglamentar',
    paraQue: 'Con estos artículos, la Secretaría de Educación dictó el Reglamento del Estatuto. Los cita «en uso de las facultades establecidas» en ellos.',
    donde: 'Reglamento General del Estatuto del Docente, Acuerdo 0760-SE-99, encabezado.',
    porQueImporta: 'Nadie en el Estado manda «porque sí». Antes de firmar tiene que decir de dónde saca el permiso, y ese permiso está en la Constitución. Si no lo tiene, lo que firmó no vale.'
  },
  {
    art: 'Artículo 128 numeral 7', clave: 'a128', emoji: '🧒',
    tema: 'El trabajo de los niños',
    paraQue: 'El Código de la Niñez sujeta a este artículo el empleo de un niño en cualquier actividad retribuida, y además exige el permiso previo de la Secretaría de Trabajo, pedido por los padres o el representante legal.',
    donde: 'Código de la Niñez y la Adolescencia, Decreto 73-96, Artículo 119.',
    porQueImporta: 'Es el artículo de esta lista que más cerca te toca, y el que más se incumple. Dos leyes lo protegen a la vez —la Constitución y el Código— y aun así hay niños trabajando sin ningún permiso.'
  },
  {
    art: 'Las libertades, todas juntas', clave: 'libertades', emoji: '🕊️',
    tema: 'Lo que un niño tiene por ser persona',
    paraQue: 'El Código de la Niñez lo dice en una sola línea: «Los niños gozan de las libertades consignadas en la Constitución de la República, en los convenios internacionales de que Honduras forme parte y en el presente Código».',
    donde: 'Código de la Niñez y la Adolescencia, Decreto 73-96, Artículo 27.',
    porQueImporta: 'No dice que el Código le DA libertades al niño: dice que el niño YA las tiene por la Constitución, y que el Código se suma. Un derecho que viene de la Constitución no se lo puede quitar una ley menor.'
  }
];

/* La relación entre los textos, que es lo que el DCNB pide ver en sexto
   grado con estas palabras: «tratan de ver las relaciones que existen entre
   ambos textos, como la presencia de uno fortalece al otro». */
const CONST_SE_APOYAN = {
  titulo: 'Una ley sola es débil; con la Constitución detrás, no',
  texto: 'Mira lo que hacen las cuatro leyes de arriba: ninguna se sostiene sola. Cada una nombra el artículo de la Constitución en el que se apoya, y encima se apoya también en convenios internacionales que Honduras firmó. Tres textos sosteniendo lo mismo, cada uno desde su altura.',
  ejemplo: 'El trabajo de un niño está protegido por la Constitución (artículo 128 numeral 7), por el Código de la Niñez (que exige permiso previo) y por los convenios internacionales que el propio Código nombra entre sus fuentes. Quien quiera saltárselo tiene que saltarse los tres.',
  fuente: 'Es una expectativa del DCNB de sexto grado: ver «las relaciones que existen entre ambos textos, como la presencia de uno fortalece al otro».'
};

/* ⚠️ «Ejemplifican un caso de violación de los artículos de la Constitución y
   elaboran un análisis crítico» es un proceso del DCNB, textual. Los casos se
   escriben SIN nombres y SIN acusar a nadie: son situaciones para analizar en
   clase, no denuncias. Y ninguno tiene una sola respuesta buena. */
const CONST_CASOS = {
  titulo: 'Cuando un artículo no se cumple',
  intro: 'Que algo esté escrito en la Constitución no significa que pase. Estos cinco casos son para analizarlos, no para contestarlos rápido: en cada uno, di qué artículo de los que viste no se está cumpliendo y qué se podría hacer.',
  casos: [
    { caso: 'Un niño de diez años vende en el mercado todo el día y no va a la escuela. Nadie pidió permiso a ninguna Secretaría.', pista: 'Mira el artículo 128 numeral 7 y el Artículo 119 del Código de la Niñez: el permiso previo no es un trámite, es la condición.' },
    { caso: 'En una escuela nombran de maestro a alguien sin título docente, saltándose el concurso.', pista: 'El Estatuto del Docente existe por mandato del Artículo 165. Saltárselo no es un descuido administrativo: es incumplir lo que la Constitución mandó ordenar.' },
    { caso: 'Una autoridad dicta una regla nueva y, cuando le preguntan de dónde saca el permiso, no contesta.', pista: 'El Reglamento del Estatuto empieza diciendo en qué artículos se apoya. El que no puede decirlo, no tiene el permiso.' },
    { caso: 'A un grupo de alumnos no se les deja opinar en la elección del Gobierno Escolar porque «son muy chicos».', pista: 'El Código dice que los niños gozan de las libertades de la Constitución. La edad regula CÓMO se ejerce un derecho, no si existe.' },
    { caso: 'Un maestro dice que su horario y su salario los decide el director, y que el Estatuto «no aplica aquí».', pista: 'Una regla de un centro no puede decir lo contrario de una ley nacional, y una ley no puede decir lo contrario de la Constitución. Es la jerarquía de las normas.' }
  ],
  comoSeAnaliza: [
    '1. ¿Qué artículo NO se está cumpliendo? Nómbralo entero.',
    '2. ¿Quién tenía que cumplirlo? Una persona, una autoridad o una institución.',
    '3. ¿A quién le cuesta? Ponle nombre al daño: qué pierde esa persona.',
    '4. ¿A dónde se reclama? Recuerda cuál de los tres poderes resuelve un caso concreto.',
    '5. ¿Qué harías tú? Una cosa que esté a tu alcance, no un deseo.'
  ],
  aviso: 'Estos casos NO señalan a nadie de tu comunidad. Son situaciones inventadas para pensar. Si uno se parece a algo que conoces, eso es lo que hay que hablar en clase — con respeto y sin nombres.'
};

/* La democracia participativa es la expectativa literal, y el DCNB nombra el
   Gobierno Escolar como su ejercicio en el mismo bloque. Aquí va nombrado y
   con lo suyo; la misión del Gobierno Escolar es otra. */
const CONST_DEMOCRACIA = {
  titulo: 'Para qué sirve todo esto: la democracia participativa',
  texto: 'Democracia no es solo votar cada cuatro años. Participativa quiere decir que entre elección y elección la gente también decide, pregunta y reclama. Y para poder reclamar hace falta saber QUÉ dice la norma: quien no sabe qué le toca, no puede pedirlo.',
  porEso: 'Por eso esta misión no te pide memorizar artículos: te pide saber leerlos, saber dónde buscarlos y notar cuándo no se cumplen. Eso es lo que convierte un derecho escrito en un derecho que sirve.',
  enTuEscuela: 'El DCNB pone el ejemplo en tu propio centro: participar en la elección del Gobierno Escolar y hacer un análisis crítico de cómo se hizo. Ahí se practica en pequeño lo mismo que pasa en el país.',
  fuente: 'Expectativa del DCNB, Quinto Grado: «Respetan, valoran y practican positivamente la Democracia participativa como forma de Vida y Gobierno».'
};

/* ⚠️ ACTIVIDAD, NO DATO. El texto de la Constitución no está en el
   repositorio, así que lo que no se puede escribir se le pide al alumno que
   lo busque — que además es lo que el DCNB pide: SELECCIONAR artículos. */
const CONST_INVESTIGA = {
  titulo: 'Lo que no te vamos a decir: búscalo en la Constitución',
  intro: 'Todo lo de arriba sale de leyes que citan a la Constitución. Para lo que sigue hace falta el texto de la Constitución misma: búscalo en tu libro de Ciencias Sociales, en la biblioteca de tu centro o pídeselo a tu maestro.',
  preguntas: [
    { q: 'Busca el artículo 128 y lee su numeral 7 completo. ¿Qué dice exactamente sobre el trabajo de los menores?', luego: '¿Coincide con lo que ves en tu comunidad? Esa distancia es lo que el currículo llama «déficit y vigencia» de un derecho.' },
    { q: 'Busca el artículo 165 y escribe qué le manda al Estado sobre la educación.', luego: '¿Se está cumpliendo en tu centro? Di en qué sí y en qué no, con un ejemplo de cada uno.' },
    { q: 'Escoge TÚ un artículo de la Constitución que te parezca importante y cópialo.', luego: '¿Por qué ese? Explícalo en tres renglones. El currículo pide justo esto: seleccionar artículos y argumentar.' },
    { q: '¿Qué convenio internacional sobre los derechos del niño ha firmado Honduras?', luego: 'El Código de la Niñez lo nombra entre sus fuentes. ¿Qué añade a lo que ya dice la Constitución?' }
  ],
  nota: 'Ninguna de estas cuatro se contesta copiando de esta pantalla, y es a propósito: el DCNB pide «estudio y análisis de artículos específicos», y eso empieza por tener el texto delante.'
};

/* Helpers: nadie cuenta a mano cuántos hay. */
function constArticulos()      { return CONST_ARTICULOS; }
function constPorClave(c)      { return CONST_ARTICULOS.find(a => a.clave === c) || null; }
function constConTexto()       { return CONST_ARTICULOS.filter(a => a.citaLiteral); }
