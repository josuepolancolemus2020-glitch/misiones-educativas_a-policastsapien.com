/* ════════════════════════════════════════════════════════════════════
   EL HIMNO NACIONAL DE HONDURAS · el texto y su explicación
   ────────────────────────────────────────────────────────────────────
   Esto NO es contenido de una misión: es un DATO del país, y por eso vive
   aquí y no dentro de la misión que lo usa. La razón es la de siempre en
   este proyecto: en septiembre el maestro le pregunta al alumno de 6º y de
   9º «escriba la cuarta estrofa y explíquela», y ese texto está en dos
   sitios a la vez —la pantalla y la ficha que se fotocopia—. Si los dos se
   separan por una palabra, el niño estudia una cosa y el papel dice otra, y
   el que pierde el punto es él.

   `_dev/verifica-himno.js` compara la ficha impresa contra ESTE archivo,
   verso por verso. Si cambia algo aquí, la ficha se corrige o la sonda se
   pone roja.

   ⚠️ DOS PALABRAS QUE PARECEN ERRATAS Y NO LO SON:

   · «enseñastes» (VI). Suena a falta de ortografía y hay ediciones que lo
     «corrigen» a «enseñaste». No se toca: los versos del Himno son
     DECASÍLABOS, y «tú también enseñaste al mundo» solo da nueve sílabas
     (te-al se une en sinalefa). Con la -s da diez, que es lo que se canta.
   · «tan sólo» (III) va con tilde: así se escribió en 1915 y así se imprime
     el Himno, aunque hoy la norma ya no la pida.

   ⚠️ Y EL CORO SE ESCRIBE DISTINTO DE COMO SE CANTA. Cantando se repiten
   cuatro arranques («Tu bandera, tu bandera…»), porque así lo pide la
   música de Hartling. El poema escrito no las lleva: son ocho versos
   decasílabos como los de cualquier estrofa. Los dos se enseñan, porque el
   alumno canta una versión y escribe la otra.

   Fuentes: el texto se contrastó verso por verso con varias ediciones
   hondureñas y se comprobó con la MÉTRICA, que es la que de verdad decide
   —un verso al que le falta o le sobra una sílaba delata la errata—.
   ════════════════════════════════════════════════════════════════════ */

const HIMNO_AUTORES = {
  letra:  { nombre: 'Augusto C. Coello',  detalle: 'Escritor y político hondureño (1883-1941). Escribió la letra en 1903.' },
  musica: { nombre: 'Carlos Hartling',    detalle: 'Músico alemán (1869-1920). Vivió en Honduras y compuso la música.' },
  /* Va el AÑO y el gobierno, y NO el número del decreto. Es la misma regla y
     la misma razón que en la misión de símbolos patrios con la flor y el
     árbol nacionales: las fuentes de segunda mano no se ponen de acuerdo en
     el número, y un número de decreto sacado de un extracto de buscador no
     acredita nada. El año es lo que el cuestionario cívico pregunta y lo que
     nadie discute. El día que entre a _dev/leyes/ el PDF de La Gaceta con ese
     decreto, se pone. */
  oficial: 'Lo declaró oficial el gobierno de Alberto de Jesús Membreño en 1915, once años después de su estreno.',
  estreno: 'Se compuso en 1903 con el nombre «Canto a Honduras» y se cantó por primera vez el 15 de septiembre de 1904.'
};

/* El coro tal como se CANTA, con las repeticiones que pide la música. */
const HIMNO_CORO_CANTADO = [
  'Tu bandera, tu bandera es un lampo de cielo',
  'por un bloque, por un bloque de nieve cruzado;',
  'y se ven en su fondo sagrado',
  'cinco estrellas de pálido azul;',
  'en tu emblema, que un mar rumoroso',
  'con sus ondas bravías escuda,',
  'de un volcán, de un volcán tras la cima desnuda',
  'hay un astro, hay un astro de nítida luz.'
];

const HIMNO = [
  {
    n: 0, clave: 'coro', titulo: 'Coro',
    versos: [
      'Tu bandera es un lampo de cielo',
      'por un bloque de nieve cruzado;',
      'y se ven en su fondo sagrado',
      'cinco estrellas de pálido azul;',
      'en tu emblema, que un mar rumoroso',
      'con sus ondas bravías escuda,',
      'de un volcán tras la cima desnuda',
      'hay un astro de nítida luz.'
    ],
    tema: 'La Bandera y el Escudo',
    resumen: 'Describe los dos símbolos que se ven: la Bandera y, dentro del Escudo, el volcán con el sol naciente.',
    explicacion: 'El coro no cuenta historia: PINTA la Bandera Nacional. El azul del cielo cruzado por un bloque de nieve son las tres franjas; las cinco estrellas, las cinco naciones de la antigua Federación de Centroamérica. Después pasa al Escudo: el mar que lo rodea con sus olas, el volcán entre las torres y, sobre la cima, el sol naciente, que es «el astro de nítida luz».',
    dato: 'Es la única parte que canta TODO el mundo, y la que se repite antes y después de la estrofa.',
    palabras: [
      { p: 'lampo',     s: 'Resplandor, destello de luz' },
      { p: 'rumoroso',  s: 'Que suena con un rumor suave y continuo' },
      { p: 'bravías',   s: 'Bravas, fuertes, indomables' },
      { p: 'escuda',    s: 'Protege, defiende como un escudo' },
      { p: 'astro',     s: 'Cuerpo del cielo que da luz; aquí, el sol del Escudo' }
    ]
  },
  {
    n: 1, clave: 'e1', titulo: 'Primera estrofa',
    versos: [
      'India virgen y hermosa dormías',
      'de tus mares al canto sonoro,',
      'cuando echada en tus cuencas de oro',
      'el audaz navegante te halló;',
      'y al mirar tu belleza extasiado,',
      'al influjo ideal de tu encanto,',
      'la orla azul de tu espléndido manto',
      'con su beso de amor consagró.'
    ],
    tema: 'La llegada de Cristóbal Colón',
    resumen: 'Honduras antes de 1502, y el día en que Colón llegó a sus costas.',
    explicacion: 'Le habla a Honduras como a una mujer indígena dormida junto al mar. «El audaz navegante» es Cristóbal Colón, que llegó a estas costas en 1502, en su cuarto viaje. Quedó tan admirado de lo que vio que besó la orilla del mar, «la orla azul de su manto», como quien saluda con respeto.',
    dato: 'Honduras es el único país de América donde Colón puso pie en tierra firme del continente.',
    palabras: [
      { p: 'India virgen',   s: 'La tierra hondureña antes de la llegada de los europeos' },
      { p: 'cuencas de oro', s: 'Las bahías y ensenadas doradas de la costa' },
      { p: 'audaz',          s: 'Atrevido, que no tiene miedo' },
      { p: 'extasiado',      s: 'Admirado, embelesado por algo hermoso' },
      { p: 'orla',           s: 'El borde o la orilla de una tela; aquí, la orilla del mar' },
      { p: 'consagró',       s: 'Dedicó con respeto, hizo sagrado' }
    ]
  },
  {
    n: 2, clave: 'e2', titulo: 'Segunda estrofa',
    versos: [
      'De un país donde el sol se levanta,',
      'más allá del Atlante azulado,',
      'aquel hombre te había soñado',
      'y en tu busca a la mar se lanzó.',
      'Cuando erguiste la pálida frente,',
      'en la viva ansiedad de tu anhelo,',
      'bajo el dombo gentil de tu cielo',
      'ya flotaba un extraño pendón.'
    ],
    tema: 'De dónde vino Colón, y la bandera extranjera',
    resumen: 'Colón salió de España soñando con estas tierras; cuando Honduras despertó, ya ondeaba una bandera ajena.',
    explicacion: 'Cuenta de dónde venía: de España, que queda al oriente, «donde el sol se levanta», cruzando el Atlántico. Él ya había soñado con estas tierras y se lanzó al mar a buscarlas. El final es el momento amargo: cuando Honduras levanta la cabeza para ver qué pasa, sobre su cielo ya ondea «un extraño pendón», la bandera de otro país. Ahí empieza la conquista.',
    dato: '«Atlante» es el nombre poético del océano Atlántico, y aparece dos veces en el Himno: aquí y en la cuarta estrofa.',
    palabras: [
      { p: 'Atlante',  s: 'El océano Atlántico' },
      { p: 'erguiste', s: 'Levantaste, alzaste' },
      { p: 'ansiedad', s: 'Inquietud, desasosiego por algo que se espera' },
      { p: 'anhelo',   s: 'Deseo grande' },
      { p: 'dombo',    s: 'La bóveda, la cúpula; aquí, el cielo' },
      { p: 'pendón',   s: 'Bandera o estandarte' }
    ]
  },
  {
    n: 3, clave: 'e3', titulo: 'Tercera estrofa',
    versos: [
      'Era inútil que el indio, tu amado,',
      'se aprestara a la lucha con ira,',
      'porque envuelto en su sangre Lempira,',
      'en la noche profunda se hundió;',
      'y de la épica hazaña, en memoria,',
      'la leyenda tan sólo ha guardado',
      'de un sepulcro el lugar ignorado',
      'y el severo perfil de un peñón.'
    ],
    tema: 'La resistencia y la muerte de Lempira',
    resumen: 'Los indígenas pelearon, pero Lempira cayó; de aquella gesta solo quedan la leyenda y un peñón.',
    explicacion: 'Es la estrofa de Lempira, el cacique lenca que dirigió la resistencia contra la conquista, hacia 1537. El poema dice que la lucha fue inútil porque él cayó cubierto de su propia sangre. Y termina con algo muy cierto: de aquella hazaña no quedó ni la tumba. Nadie sabe dónde está enterrado; solo quedan la leyenda y la silueta de un cerro, el Peñol de Cerquín.',
    dato: 'Es la única estrofa que nombra a una persona de Honduras, y es un héroe indígena.',
    palabras: [
      { p: 'se aprestara', s: 'Se preparara, se dispusiera' },
      { p: 'épica',        s: 'Heroica, digna de contarse' },
      { p: 'hazaña',       s: 'Hecho grande y valiente' },
      { p: 'sepulcro',     s: 'Tumba' },
      { p: 'ignorado',     s: 'Que no se sabe, desconocido' },
      { p: 'peñón',        s: 'Monte de piedra; aquí, el Peñol de Cerquín' }
    ]
  },
  {
    n: 4, clave: 'e4', titulo: 'Cuarta estrofa',
    versos: [
      'Por tres siglos tus hijos oyeron',
      'el mandato imperioso del amo;',
      'por tres siglos tu inútil reclamo',
      'en la atmósfera azul se perdió;',
      'pero un día gloria tu oído',
      'percibió, poderoso y distante,',
      'que allá lejos, por sobre el Atlante,',
      'indignado rugía un León.'
    ],
    tema: 'Los tres siglos de colonia',
    resumen: 'Trescientos años obedeciendo, hasta que del otro lado del mar llegó un rugido de libertad.',
    explicacion: 'Resume la época colonial: trescientos años oyendo órdenes y reclamando sin que nadie escuchara. Pero un día llega un ruido de esperanza desde muy lejos, del otro lado del Atlántico: un León que ruge indignado. Ese León es Francia, y la estrofa siguiente lo dice con su nombre.',
    dato: 'La colonia duró de 1502 a 1821: son los «tres siglos» de los que habla dos veces.',
    palabras: [
      { p: 'imperioso', s: 'Que manda con autoridad y sin discutir' },
      { p: 'amo',       s: 'El dueño, el que manda; aquí, el poder colonial' },
      { p: 'reclamo',   s: 'Queja, protesta, petición' },
      { p: 'percibió',  s: 'Notó, escuchó' },
      { p: 'indignado', s: 'Enojado por una injusticia' },
      { p: 'León',      s: 'Figura poética de Francia, que despertó a la libertad' }
    ]
  },
  {
    n: 5, clave: 'e5', titulo: 'Quinta estrofa',
    versos: [
      'Era Francia, la libre, la heroica,',
      'que en su sueño de siglos dormida',
      'despertaba iracunda a la vida',
      'al reclamo viril de Dantón;',
      'era Francia que enviaba a la muerte',
      'la cabeza del rey consagrado,',
      'y que alzaba, soberbia a su lado,',
      'el altar de la diosa Razón.'
    ],
    tema: 'La Revolución Francesa',
    resumen: 'Explica quién era el León: Francia, que se levantó contra su rey y encendió el ejemplo de libertad.',
    explicacion: 'Aquí el poema contesta la pregunta que dejó la estrofa anterior: el León era Francia. Cuenta la Revolución Francesa de 1789, cuando el pueblo despertó furioso llamado por Dantón, uno de sus oradores; mandó a la muerte al rey y puso en su lugar el culto a la Razón. De ahí salieron las ideas de libertad e igualdad que llegaron a América y empujaron la Independencia.',
    dato: 'Es la única estrofa que habla de un país que no es Honduras ni España.',
    palabras: [
      { p: 'iracunda',  s: 'Llena de ira, furiosa' },
      { p: 'viril',     s: 'Enérgico, valiente' },
      { p: 'Dantón',    s: 'Georges Jacques Danton, orador de la Revolución Francesa' },
      { p: 'consagrado', s: 'Dedicado a Dios; el rey se creía puesto por Dios' },
      { p: 'soberbia',  s: 'Orgullosa, altiva' },
      { p: 'diosa Razón', s: 'El culto a la razón que la Revolución puso en lugar de la religión' }
    ]
  },
  {
    n: 6, clave: 'e6', titulo: 'Sexta estrofa',
    versos: [
      'Tú también, ¡oh mi patria!, te alzaste',
      'de tu sueño servil y profundo;',
      'tú también enseñastes al mundo',
      'destrozado el infame eslabón.',
      'Y en tu suelo bendito, tras la alta',
      'cabellera de monte salvaje,',
      'como un ave de negro plumaje,',
      'la colonia fugaz se perdió.'
    ],
    tema: 'La Independencia de Centroamérica',
    resumen: 'Honduras también se levantó, rompió la cadena y vio marcharse a la colonia.',
    explicacion: 'Es la estrofa de la Independencia. Honduras despierta de su «sueño servil», el sueño de quien vive sometido, y le enseña al mundo la cadena rota: ese es el «infame eslabón». Y la colonia se va, escondiéndose detrás de las montañas boscosas, como un pájaro negro que se pierde de vista. Ocurrió el 15 de septiembre de 1821.',
    dato: '«Enseñastes» con -s no es una falta: los versos son de diez sílabas y sin la -s le faltaría una.',
    palabras: [
      { p: 'te alzaste',  s: 'Te levantaste, te pusiste de pie' },
      { p: 'servil',      s: 'Propio de un esclavo, sometido' },
      { p: 'infame',      s: 'Vil, despreciable' },
      { p: 'eslabón',     s: 'Cada anillo de una cadena; aquí, la cadena de la opresión' },
      { p: 'cabellera de monte', s: 'Los bosques de las montañas, vistos como cabello' },
      { p: 'fugaz',       s: 'Que dura poco y se va deprisa' }
    ]
  },
  {
    n: 7, clave: 'e7', titulo: 'Séptima estrofa',
    versos: [
      'Por guardar ese emblema divino',
      'marcharemos, ¡oh patria!, a la muerte;',
      'generosa será nuestra suerte',
      'si morimos pensando en tu amor.',
      'Defendiendo tu santa bandera,',
      'y en tus pliegues gloriosos cubiertos,',
      'serán muchos, Honduras, tus muertos,',
      'pero todos caerán con honor.'
    ],
    tema: 'El juramento de defender la patria',
    resumen: 'La promesa de defender la Bandera hasta el final, con honor.',
    explicacion: 'Es la única estrofa que no cuenta el pasado: promete. Dice que por guardar la Bandera («ese emblema divino») los hondureños marcharían hasta la muerte, y que esa muerte sería honrada. Por eso es la que se canta en los actos: las otras seis cuentan de dónde venimos, y esta dice qué estamos dispuestos a hacer.',
    dato: 'Es la estrofa que se canta en las escuelas y en los partidos, junto con el coro.',
    palabras: [
      { p: 'emblema',   s: 'Símbolo que representa algo; aquí, la Bandera' },
      { p: 'divino',    s: 'Sagrado, digno del mayor respeto' },
      { p: 'generosa',  s: 'Noble, digna' },
      { p: 'suerte',    s: 'Destino, lo que a uno le toca' },
      { p: 'pliegues',  s: 'Los dobleces de la tela de la bandera' },
      { p: 'honor',     s: 'Dignidad, buena fama por obrar bien' }
    ]
  }
];

/* Helpers: nadie cuenta a mano cuántas estrofas o versos hay. */
function himnoEstrofas() { return HIMNO.filter(e => e.n > 0); }
function himnoVersos()   { return HIMNO.reduce((n, e) => n + e.versos.length, 0); }
function himnoPorClave(c) { return HIMNO.find(e => e.clave === c) || null; }
/* El texto de una estrofa en un solo bloque, para imprimir o comparar. */
function himnoTexto(c) { const e = himnoPorClave(c); return e ? e.versos.join('\n') : ''; }
