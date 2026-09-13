/* ════════════════════════════════════════════════════════════════════
   LOS TRES PODERES DEL ESTADO · qué hace cada uno y cómo se ven trabajando
   ────────────────────────────────────────────────────────────────────
   Esto NO es contenido de una misión: es un DATO del país, y por eso vive
   aquí y no dentro de la misión que lo usa. La razón es la del Himno y la
   de los próceres: el mismo texto acaba en dos sitios que una persona lee
   —la pantalla y la ficha que se fotocopia— y si se separan, el alumno
   estudia una cosa y el examen le pide otra. `_dev/verifica-poderes.js`
   compara las dos.

   ⚠️ DE DÓNDE SALIÓ CADA COSA. Ninguna línea de aquí se buscó en internet:
   todo está en el repositorio, que es la regla de este proyecto —«buscar no
   es leer»—.

   · LA EXPECTATIVA es del DCNB, Ciencias Sociales de OCTAVO GRADO, Bloque 1
     (`_dev/dcnb/dcneb-basica-iii-ciclo-56-ciencias-sociales-octavo-grado-
     1de2.md`, confirmada en `_dev/dcnb-pdf/dcneb-basica-iii-ciclo.pdf`,
     página 348 del archivo — «Secretaría de Educación 355» en el pie
     impreso). Dice, con estas palabras: «Reconocen la Constitución de la
     República como ley fundamental para comprender las características y
     funcionamiento de un Estado de Derecho», y entre sus contenidos:
     «Conformación de un Estado de Derecho: Poder Ejecutivo, Legislativo y
     Judicial» y «Funciones, atribuciones y relación entre los diferentes
     poderes».

   · CÓMO TRABAJA CADA PODER no se cuenta en abstracto: se enseña sobre UNA
     ley de verdad, el Estatuto del Docente —la que rige al maestro de quien
     está leyendo—, cuyo PDF está en `_dev/leyes/`. Ahí se ve el recorrido
     entero y cada paso se puede señalar con el dedo. Eso es lo que pide el
     DCNB con «Investigan y representan creativamente las funciones y
     atribuciones de los poderes del Estado».

   · QUE LA CONSTITUCIÓN ES LA LEY FUNDAMENTAL —que es la expectativa
     literal— no se afirma de memoria: lo dice una ley hondureña que está
     aquí. El Código de la Niñez y la Adolescencia (Decreto 73-96) ordena
     las normas por rango y pone la Constitución en el número 1.

   ⚠️ LO QUE NO SE ESCRIBE, Y A PROPÓSITO: cuántos diputados tiene el
   Congreso, cuántos magistrados la Corte Suprema, cuánto duran en el cargo
   y cómo se eligen. **La Constitución de la República NO está en
   `_dev/leyes/`**, y esos números solo los acredita ella. Un dato sacado de
   un extracto de buscador no acredita nada —es la lección de
   `INVESTIGACION-ESTATUTO-DOCENTE.md` y la misma que dejó fuera los números
   de decreto de la flor y del árbol nacionales—. Y aquí duele el doble,
   porque son justo los que pregunta el Cuestionario Cívico.

   No es un agujero tapado con silencio: el propio DCNB pide que eso se
   INVESTIGUE («Investigan acerca de quiénes sustentan la autoridad en cada
   uno de los poderes, y comparan entre las condiciones establecidas en la
   Constitución y la realidad»), así que va en `PODERES_INVESTIGA`, que es
   una actividad y no un dato. El día que el PDF de la Constitución entre a
   `_dev/leyes/`, se escriben aquí y la actividad se queda igual: comparar
   lo que dice la Constitución con lo que pasa NO se resuelve leyendo un
   número.
   ════════════════════════════════════════════════════════════════════ */

const PODERES = [
  {
    clave: 'legislativo', nombre: 'Poder Legislativo', emoji: '📜',
    verbo: 'HACE las leyes',
    quien: 'El Congreso Nacional',
    queHace: 'Discute y aprueba las leyes que rigen a todo el país. Una ley suya se llama DECRETO y lleva su número y su año.',
    ejemplo: 'El Estatuto del Docente es el Decreto 136-97: lo aprobó el Congreso Nacional en su Salón de Sesiones, en Tegucigalpa, el 11 de septiembre de 1997.',
    pista: 'Si una hoja dice «PODER LEGISLATIVO · DECRETO No …», la hizo el Congreso.',
    fuente: 'Estatuto del Docente Hondureño, Decreto 136-97, encabezado y Artículo 101 (`_dev/leyes/estatuto-docente-decreto-136-97.pdf`).'
  },
  {
    clave: 'ejecutivo', nombre: 'Poder Ejecutivo', emoji: '🏛️',
    verbo: 'CUMPLE y hace cumplir las leyes',
    quien: 'El Presidente de la República, con las Secretarías de Estado',
    queHace: 'Pone las leyes a funcionar: manda ejecutarlas y dicta los reglamentos que dicen CÓMO se aplican. Una norma suya se llama ACUERDO.',
    ejemplo: 'Al pie del mismo Estatuto se lee «Al Poder Ejecutivo. Por Tanto: Ejecútese», firmado el 29 de septiembre de 1997 por Carlos Roberto Reina Idiaquez, Presidente Constitucional de la República. Y como el Artículo 93 del Estatuto mandaba reglamentarlo, la Secretaría de Educación dictó el Acuerdo 0760-SE-99.',
    pista: 'Si una hoja dice «Por Tanto: Ejecútese» o «ACUERDA», es del Ejecutivo.',
    fuente: 'Estatuto del Docente, cierre y Artículo 93; Reglamento General del Estatuto, Acuerdo 0760-SE-99 (`_dev/leyes/`).'
  },
  {
    clave: 'judicial', nombre: 'Poder Judicial', emoji: '⚖️',
    verbo: 'APLICA la ley a los casos',
    quien: 'La Corte Suprema de Justicia, con los juzgados y tribunales',
    queHace: 'Cuando dos personas no se ponen de acuerdo, o alguien incumple una ley, decide qué dice la ley en ESE caso. Lo que resuelve la Corte Suprema una y otra vez se llama JURISPRUDENCIA, y también es fuente de derecho.',
    ejemplo: 'El Código de la Niñez pone entre las fuentes del derecho aplicable a los niños «la jurisprudencia establecida por la Corte Suprema de Justicia relacionada con los niños». Y las copias oficiales de las leyes que se usaron para escribir esta misión llevan al pie www.poderjudicial.gob.hn.',
    pista: 'El Legislativo la escribe, el Ejecutivo la aplica a todos, y el Judicial la aplica a TU caso.',
    fuente: 'Código de la Niñez y la Adolescencia, Decreto 73-96, Artículo 4 numeral 7 (`_dev/leyes/codigo-ninez-adolescencia-decreto-73-96.pdf`).'
  }
];

/* La expectativa literal del DCNB es que la Constitución se reconozca como
   LEY FUNDAMENTAL. No se afirma de memoria: una ley hondureña que está en
   este repositorio ordena las normas por rango y la pone de primera. Se
   copia el orden tal como lo trae el Código, sin añadir ni quitar. */
const PODERES_JERARQUIA = {
  titulo: 'Por qué se dice que la Constitución es la ley FUNDAMENTAL',
  intro: 'Cuando dos normas dicen cosas distintas, no manda la más nueva ni la más larga: manda la que está más arriba. Así lo ordena el Código de la Niñez y la Adolescencia para los asuntos de la niñez:',
  escalones: [
    'La Constitución de la República',
    'Los tratados o convenios de los que Honduras forma parte',
    'El Código de la Niñez y la Adolescencia',
    'El Código de Familia',
    'Las demás leyes generales o especiales',
    'Los reglamentos de esas leyes',
    'La jurisprudencia de la Corte Suprema de Justicia',
    'Los principios generales del derecho'
  ],
  remate: 'La Constitución va de primera. Por eso ninguna ley puede decir lo contrario de lo que ella dice — y por eso el Estatuto del Docente empieza citándola.',
  fijate: 'Y fíjate en el escalón 6 y en el 7: ahí están los reglamentos, que los dicta el Ejecutivo, y la jurisprudencia, que la hace el Judicial. Los tres poderes salen en la misma lista, cada uno en su altura.',
  fuente: 'Código de la Niñez y la Adolescencia, Decreto 73-96, Artículo 4. Se copian los ocho escalones completos, en su orden: recortar la lista sería enseñar una jerarquía que no es la que dice la ley.'
};

/* Los conceptos que el DCNB pide aclarar, con sus palabras: «Aclaran
   conceptos básicos como: Ley, Estado de Derecho, Constitución, Deberes,
   Derechos». Se definen cortos a propósito: esto se copia en el cuaderno. */
const PODERES_CONCEPTOS = [
  { palabra: 'Ley', emoji: '📄', definicion: 'Una regla escrita que vale para todo el país y que el Estado puede hacer cumplir. No es un consejo: se cumple.' },
  { palabra: 'Constitución', emoji: '📕', definicion: 'La ley fundamental: la que está por encima de todas las demás y dice cómo se organiza el Estado y qué derechos tiene cada persona.' },
  { palabra: 'Estado de Derecho', emoji: '⚖️', definicion: 'Cuando manda la ley y no la voluntad de quien tiene el poder — y la ley vale igual para el que gobierna que para cualquiera.' },
  { palabra: 'Deberes', emoji: '🤝', definicion: 'Lo que a cada persona le toca cumplir para que la convivencia funcione.' },
  { palabra: 'Derechos', emoji: '🛡️', definicion: 'Lo que nadie te puede quitar y el Estado tiene que respetarte y hacerte respetar.' }
];

/* El recorrido de UNA ley por los tres poderes. Es el corazón de la misión:
   no se explica la separación de poderes con un dibujo abstracto, se sigue
   una ley de verdad —la que rige al maestro del alumno— y en cada paso se
   puede señalar el documento. Todos los pasos están en `_dev/leyes/`. */
const PODERES_RECORRIDO = {
  ley: 'El Estatuto del Docente Hondureño',
  porque: 'Se escogió esta y no otra porque es la ley que rige al maestro que tiene el alumno delante: dice cómo entra a su plaza, qué le deben pagar y qué derechos tiene.',
  pasos: [
    { n: 1, poder: 'legislativo', titulo: 'El Congreso la aprueba',
      texto: 'El 11 de septiembre de 1997, en el Salón de Sesiones del Congreso Nacional, en Tegucigalpa, se aprueba el Decreto 136-97. La hoja lleva arriba «PODER LEGISLATIVO».' },
    { n: 2, poder: 'legislativo', titulo: 'Y dice desde cuándo vale',
      texto: 'Su Artículo 101 manda que entre en vigencia al publicarse en el Diario Oficial La Gaceta. Antes de eso, todavía no obliga a nadie.' },
    { n: 3, poder: 'ejecutivo', titulo: 'El Presidente manda ejecutarla',
      texto: 'El 29 de septiembre de 1997 se lee al pie: «Al Poder Ejecutivo. Por Tanto: Ejecútese», con la firma de Carlos Roberto Reina Idiaquez, Presidente Constitucional de la República.' },
    { n: 4, poder: 'ejecutivo', titulo: 'Y una Secretaría dice cómo se aplica',
      texto: 'El Artículo 93 del Estatuto mandaba reglamentarlo. La Secretaría de Educación dicta el Acuerdo 0760-SE-99 «en uso de las facultades establecidas en los artículos 245 numeral 11, 157 y 163 de la Constitución de la República».' },
    { n: 5, poder: 'judicial', titulo: 'Y si hay pleito, lo resuelven los tribunales',
      texto: 'Un maestro al que no le respetan lo que el Estatuto le da no va al Congreso ni a la Presidencia: va a los juzgados. Lo que la Corte Suprema resuelve una y otra vez se vuelve jurisprudencia, y también es fuente de derecho.' }
  ]
};

/* Por qué están separados. Esto no necesita ninguna fuente externa: sale de
   imaginar que NO lo estuvieran, que es como se entiende de verdad. El DCNB
   lo pide como «Funciones, atribuciones y relación entre los diferentes
   poderes». */
const PODERES_SEPARACION = {
  titulo: '¿Y por qué no lo hace todo uno solo? Sería más rápido',
  texto: 'Sería más rápido, y por eso mismo no se hace. Si el mismo que escribe la ley es el que decide si la rompiste y el que te castiga, no hay a quién reclamarle: eres tú solo contra alguien que no puede equivocarse. Separarlos es más lento a propósito, porque cada uno puede pararle la mano a los otros dos.',
  casos: [
    { situacion: 'El Congreso aprueba una ley que va contra la Constitución.', quien: 'judicial', quePasa: 'Los tribunales pueden dejarla sin aplicar: la Constitución está por encima.' },
    { situacion: 'Un funcionario del Ejecutivo aplica una ley a su manera.', quien: 'judicial', quePasa: 'La persona afectada puede llevarlo ante un juez, que decide qué dice la ley de verdad.' },
    { situacion: 'El Ejecutivo quiere una regla nueva que la ley no le permite.', quien: 'legislativo', quePasa: 'Tiene que ir al Congreso: el reglamento no puede decir más de lo que dice la ley.' }
  ]
};

/* «La rendición de cuentas de servidores públicos ante la ciudadanía» es un
   contenido del DCNB, textual. Va aquí porque es lo que convierte los tres
   poderes en algo que le toca al alumno y no en un organigrama. */
const PODERES_RENDICION = {
  titulo: 'Rendir cuentas: el poder es prestado',
  texto: 'Quien trabaja para el Estado no maneja su propio dinero: maneja el de todos. Por eso tiene que poder explicar en qué lo gastó y qué hizo con el cargo, y cualquier ciudadano puede preguntárselo. Eso se llama rendición de cuentas, y no es un favor que hace: es parte del trabajo.',
  enTuEscuela: 'Pasa igual y en pequeño en tu centro: la merienda escolar, la matrícula gratis y los fondos que llegan al comité de padres se rinden en asamblea. Si alguien no quiere explicar en qué se gastó, ahí hay un problema.',
  fuente: 'Es un contenido del DCNB: «La rendición de cuentas de servidores públicos ante la ciudadanía».'
};

/* ⚠️ ESTO ES UNA ACTIVIDAD, NO UN DATO, y está así a propósito.
   Cuántos diputados, cuántos magistrados y cuánto duran los acredita la
   Constitución, que NO está en `_dev/leyes/`. Escribirlos de memoria sería
   justo lo que este proyecto tiene prohibido. Y el DCNB, que lo sabía
   antes que nosotros, no los pide memorizados: los pide investigados y
   COMPARADOS con la realidad, que es lo único que un número no enseña. */
const PODERES_INVESTIGA = {
  titulo: 'Lo que no te vamos a decir: averígualo tú',
  intro: 'Estas respuestas cambian y están en la Constitución de la República. Búscalas en tu libro de Ciencias Sociales, en la biblioteca o pregúntale a tu maestro — y después haz la segunda pregunta, que es la que de verdad importa.',
  preguntas: [
    { q: '¿Cuántos diputados tiene el Congreso Nacional, y cuántos son de tu departamento?', luego: '¿Sabes el nombre de uno solo? ¿Cómo le harías llegar un problema de tu comunidad?' },
    { q: '¿Cuánto dura en el cargo el Presidente de la República?', luego: '¿Qué pasa cuando se acaba ese tiempo? ¿Quién lo decide?' },
    { q: '¿Cuántos magistrados tiene la Corte Suprema de Justicia y quién los elige?', luego: 'Si los elige otro poder, ¿sigue siendo independiente? Discútelo en clase: no hay una sola respuesta.' },
    { q: '¿Cuál es el juzgado más cercano a tu comunidad?', luego: '¿Cuánto se tarda en llegar? Para alguien sin transporte, ¿el Poder Judicial le queda cerca o lejos?' }
  ],
  nota: 'La última no se contesta con un número, y es la más importante de las cuatro: el DCNB pide comparar «las condiciones establecidas en la Constitución y la realidad».'
};

/* Helpers: nadie cuenta a mano cuántos hay. */
function poderesTodos()        { return PODERES; }
function poderPorClave(c)      { return PODERES.find(p => p.clave === c) || null; }
function poderesPasosDe(c)     { return PODERES_RECORRIDO.pasos.filter(p => p.poder === c); }
