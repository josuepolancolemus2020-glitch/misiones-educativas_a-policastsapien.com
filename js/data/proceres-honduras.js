/* ════════════════════════════════════════════════════════════════════
   HÉROES Y PRÓCERES DE HONDURAS · quiénes son y qué hicieron
   ────────────────────────────────────────────────────────────────────
   Esto NO es contenido de una misión: es un DATO del país, y por eso vive
   aquí y no dentro de la misión que lo usa. La razón es la del Himno: el
   mismo texto acaba en dos sitios que una persona lee —la pantalla y la
   ficha que se fotocopia— y si se separan, el alumno estudia una fecha y
   el examen le pide otra. `_dev/verifica-proceres.js` compara las dos.

   ⚠️ DE DÓNDE SALIÓ CADA COSA. Ninguna línea de aquí se buscó en internet:
   todo está en el repositorio, que es la regla de este proyecto —«buscar no
   es leer»—.

   · A QUIÉNES se nombra lo decide el DCNB, no el gusto de nadie. La
     expectativa está en `_dev/dcnb/dcneb-basica-i-ciclo-45-ciencias-
     sociales-tercer-grado-1de2.md`, con estas palabras: «Identifican la
     participación de algunos personajes como: Francisco Morazán, Dionisio
     de Herrera, José Trinidad Reyes, Marco Aurelio Soto, Ramón Rosa, en la
     historia de Honduras». El mismo documento nombra a José Cecilio del
     Valle y a José Trinidad Cabañas, y a Lempira lo nombra 51 veces.
   · Las FECHAS DE NACIMIENTO salen de
     `_dev/dcnb/dcnb-prebasica-2015-07-comunicacion-3de7.md`, que las trae
     escritas una por una.
   · Lo demás —lo que hizo cada uno— ya estaba verificado en este
     repositorio, en la misión de Aspectos Cívicos (id 67) y en las misiones
     del maestro. Las dos misiones de la Ruta de la Patria tienen que decir
     lo mismo: un alumno que las abre seguidas no puede leer dos versiones.

   ⚠️ LO QUE NO SE ESCRIBE, Y A PROPÓSITO: la fecha de nacimiento de José
   Trinidad Reyes. El DCNB lo nombra pero no la trae, y un dato sacado de un
   extracto de buscador no acredita nada. Es la misma lección de los números
   de decreto de la flor y del árbol nacionales. El día que entre la fuente,
   se pone.

   ⚠️ Y «HÉROE» Y «PRÓCER» NO SON UNA CASILLA LIMPIA PARA TODOS. Un héroe
   defiende a su pueblo; un prócer ayuda a fundar la nación. Lempira es el
   Héroe Nacional y eso no lo discute nadie; pero a Morazán se le llama las
   dos cosas con razón, y preguntárselo al alumno como si tuviera una sola
   respuesta sería calificarle mal una respuesta buena. Por eso cada uno
   lleva su `clase` y, cuando se le llama de las dos formas, su `nota` — y
   las actividades de clasificar usan solo lo que no se discute.
   ════════════════════════════════════════════════════════════════════ */

const PROCERES = [
  {
    clave: 'lempira', nombre: 'Lempira', apodo: 'Héroe Nacional', emoji: '🏹',
    clase: 'héroe',
    epoca: 'La conquista, hacia 1537',
    papel: 'Cacique lenca que dirigió la resistencia contra la conquista española',
    hizo: [
      'Unió a los pueblos lencas para defender su tierra de los conquistadores.',
      'Resistió desde el Peñol de Cerquín, un cerro que le servía de fortaleza.',
      'Murió peleando, hacia 1537, y nunca se supo dónde quedó enterrado.'
    ],
    porque: 'Es el Héroe Nacional porque defendió a su pueblo cuando nadie más podía hacerlo. No fundó un país ni firmó un papel: peleó por la gente que ya vivía aquí, y por eso su nombre está en la moneda y en un departamento entero.',
    dato: 'Es el único hondureño que se nombra en el Himno Nacional, en la tercera estrofa.',
    fecha: { dia: '20 de julio', que: 'Día de Lempira' }
  },
  {
    clave: 'valle', nombre: 'José Cecilio del Valle', apodo: 'el Sabio Valle', emoji: '📜',
    clase: 'prócer',
    epoca: 'La Independencia, 1821',
    nacio: 'Nació el 22 de noviembre de 1777',
    papel: 'Pensador y político que redactó el Acta de Independencia de Centroamérica',
    hizo: [
      'Escribió el Acta de Independencia que se firmó el 15 de septiembre de 1821.',
      'Fue de los hombres más leídos de su tiempo: por eso le decían «el Sabio».',
      'Defendió que la Independencia se hiciera con leyes y no con sangre.'
    ],
    porque: 'La Independencia de Centroamérica no se ganó en una batalla: se escribió. Y el que la escribió fue él. Sin ese documento, el 15 de septiembre no tendría nada que celebrar.',
    dato: 'Su firma está en el papel que separó a cinco países de España, el mismo día y de una sola vez.',
    fecha: null
  },
  {
    clave: 'morazan', nombre: 'Francisco Morazán', apodo: 'Paladín de la Unión Centroamericana', emoji: '⚔️',
    clase: 'prócer',
    nota: 'También se le llama héroe, y con razón: peleó por su idea hasta morir. Las dos formas son correctas.',
    epoca: 'La República Federal, 1824-1842',
    nacio: 'Nació en Tegucigalpa el 3 de octubre de 1792',
    papel: 'Presidente de la República Federal de Centro América',
    hizo: [
      'Gobernó la Federación que unía a Guatemala, El Salvador, Honduras, Nicaragua y Costa Rica.',
      'Impulsó la educación pública y quitarle privilegios a unos pocos.',
      'Peleó hasta el final por mantener unidas a las cinco naciones. No lo consiguió.'
    ],
    porque: 'Es el hondureño más conocido fuera de Honduras, y no por ganar: por no rendirse. Su idea —que Centroamérica valía más junta que repartida— sigue discutiéndose hoy.',
    dato: 'Nació un 3 de octubre y murió un 15 de septiembre, el día de la Independencia, en 1842.',
    fecha: { dia: '3 de octubre', que: 'Natalicio de Francisco Morazán' }
  },
  {
    clave: 'herrera', nombre: 'Dionisio de Herrera', apodo: 'el primer Jefe de Estado', emoji: '🏛️',
    clase: 'prócer',
    epoca: 'El nacimiento del Estado, 1824',
    nacio: 'Nació en Choluteca el 9 de octubre de 1781',
    papel: 'Primer Jefe de Estado de Honduras, en 1824',
    hizo: [
      'Fue el primero en gobernar Honduras como Estado, después de la Independencia.',
      'Bajo su gobierno se creó el Escudo Nacional, en 1825.',
      'Organizó lo que no existía: las primeras leyes y las primeras cuentas del país.'
    ],
    porque: 'Alguien tuvo que gobernar el primer día, cuando no había nada hecho. Le tocó a él, y de ahí salen el Escudo que hoy va en los documentos y las primeras leyes del país.',
    dato: 'El Escudo Nacional, que es el símbolo patrio más antiguo, nació durante su gobierno.',
    fecha: null
  },
  {
    clave: 'cabanas', nombre: 'José Trinidad Cabañas', apodo: 'el caballero sin tacha y sin miedo', emoji: '🎖️',
    clase: 'prócer',
    epoca: 'Mediados del siglo XIX',
    nacio: 'Nació en Tegucigalpa el 9 de junio de 1805',
    papel: 'Militar y presidente de Honduras, famoso por su honradez',
    hizo: [
      'Fue presidente de Honduras y peleó al lado de Morazán por la unión centroamericana.',
      'Salió del gobierno tan pobre como entró: no se quedó con nada.',
      'Por eso se le quedó el nombre de «el caballero sin tacha y sin miedo».'
    ],
    porque: 'Se le recuerda por algo que no se ve en un monumento: fue honrado. En un cargo donde era fácil enriquecerse, no lo hizo, y ese es el ejemplo que el país le guardó.',
    dato: 'Su apodo tiene dos mitades y las dos importan: «sin tacha» es que no robó; «sin miedo», que no se echó atrás.',
    fecha: null
  },
  {
    clave: 'reyes', nombre: 'José Trinidad Reyes', apodo: 'el Padre Reyes', emoji: '📚',
    clase: 'prócer',
    epoca: 'Mediados del siglo XIX',
    papel: 'Sacerdote que fundó la primera universidad del país',
    hizo: [
      'Fundó la primera universidad de Honduras, de donde salió la UNAH.',
      'Enseñó, escribió y abrió las puertas del estudio a quien no las tenía.',
      'Fue sacerdote, músico y poeta además de maestro.'
    ],
    porque: 'Casi todos los próceres hicieron país con leyes o con armas. Él lo hizo con una escuela, y esa escuela sigue abierta: es la razón de que el Día del Maestro Hondureño sea el día de su nacimiento.',
    dato: 'El 17 de septiembre, Día del Maestro Hondureño, se celebra por él.',
    fecha: { dia: '17 de septiembre', que: 'Día del Maestro Hondureño' }
  },
  {
    clave: 'soto', nombre: 'Marco Aurelio Soto', apodo: 'el presidente de la Reforma', emoji: '🏗️',
    clase: 'prócer',
    epoca: 'La Reforma Liberal, desde 1876',
    papel: 'Presidente que impulsó la Reforma Liberal',
    hizo: [
      'Encabezó la Reforma Liberal, que cambió cómo se gobernaba el país.',
      'Puso a Ramón Rosa de ministro, y juntos rehicieron la educación y las leyes.',
      'Modernizó el Estado: correos, telégrafo y las primeras escuelas públicas de verdad.'
    ],
    porque: 'La escuela pública y gratuita a la que va hoy el alumno hondureño empieza a construirse en su gobierno. No es historia lejana: es el edificio donde está sentado.',
    dato: 'El DCNB lo nombra por su nombre entre los personajes que el alumno tiene que conocer.',
    fecha: null
  },
  {
    clave: 'rosa', nombre: 'Ramón Rosa', apodo: 'el ministro de la Reforma', emoji: '✒️',
    clase: 'prócer',
    epoca: 'La Reforma Liberal, desde 1876',
    papel: 'Ministro de Marco Aurelio Soto y pensador de la Reforma',
    hizo: [
      'Impulsó el Código de Instrucción Pública de 1882.',
      'Fue el que puso por escrito las ideas de la Reforma Liberal.',
      'Trabajó para que la educación fuera obligación del Estado y no favor de nadie.'
    ],
    porque: 'Fue el que escribió la ley que hizo de la educación un deber del Estado. Que hoy un niño de un pueblo tenga derecho a una escuela viene, en parte, de ese papel.',
    dato: 'Soto ponía el gobierno y Rosa las ideas: se les estudia juntos porque trabajaron juntos.',
    fecha: null
  }
];

/* ⚠️ El DCNB pide una segunda cosa, y no es un añadido: «Explican la
   contribución y el costo pagado por las mujeres, los indígenas y los
   afrocaribeños en la historia del país». Está en el mismo archivo que la
   lista de personajes.

   Va aparte y SIN NOMBRES a propósito. Nombrar a alguien aquí obligaría a
   verificarlo, y este repositorio todavía no tiene con qué: inventar una
   biografía para cumplir el currículo sería justo lo que la normativa
   prohíbe. Lo que sí se puede hacer —y es lo que el DCNB pide de verdad, con
   su «investigación explicativa»— es plantearlo y mandar al alumno a
   averiguarlo en SU municipio, que es donde están los nombres que ningún
   libro trae. */
const PROCERES_QUIENES_FALTAN = {
  titulo: 'Los que hicieron el país y casi nunca salen en la lista',
  texto: 'Las estatuas son de ocho o diez hombres, pero el país no lo levantaron ocho o diez personas. Los pueblos indígenas y lencas defendieron su tierra mucho después de Lempira. Los garífunas llegaron a la costa en 1797 y levantaron pueblos enteros. Y las mujeres sostuvieron las casas, las escuelas y los hospitales de cada época sin que su nombre quedara escrito casi en ningún lado.',
  pregunta: '¿Quién de tu municipio merecería una estatua y no la tiene? Pregúntale a una persona mayor de tu comunidad y escribe su historia.',
  fuente: 'Es una expectativa del DCNB: «Explican la contribución y el costo pagado por las mujeres, los indígenas y los afrocaribeños en la historia del país».'
};

/* La diferencia que la misión tiene que dejar clara, y que ya enseña la
   misión de Aspectos Cívicos con estas mismas palabras: las dos tienen que
   decir lo mismo o el alumno lee dos definiciones distintas. */
const PROCERES_DIFERENCIA = {
  heroe: 'Un HÉROE defiende a su pueblo. Arriesga la vida por la gente que ya está aquí.',
  procer: 'Un PRÓCER ayuda a fundar la nación. Construye lo que todavía no existe: leyes, escuelas, un Estado.'
};

/* Helpers: nadie cuenta a mano cuántos hay. */
function proceresTodos()      { return PROCERES; }
function proceresPorClase(c)  { return PROCERES.filter(p => p.clase === c); }
function procerPorClave(c)    { return PROCERES.find(p => p.clave === c) || null; }
/* Los que tienen su fecha en el calendario cívico, en el orden del año. */
function proceresConFecha()   { return PROCERES.filter(p => p.fecha); }
