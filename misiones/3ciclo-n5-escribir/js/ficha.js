/* ============================================================
   M.E.T.A.S · Misión Escribir por etapas · el bloque de su ficha
   ------------------------------------------------------------
   De aquí saldrá `fichas/ficha-n5-escribir.html`. La arma
   `node _dev/arma-ficha.js 3ciclo-n5-escribir`; la ficha no se edita a
   mano. La forma del bloque está en `_privado/PLANTILLA-FICHAS.md`.

   ► TODAVÍA NO ESTÁ ARMADA. La ficha impresa se arma cuando la misión
     entre al catálogo y tenga su QR (`img/qr-mision-n5-escribir.png`,
     que hoy no existe: se genera con `_dev/genera-qr-mision.py`).
     Mientras tanto las sondas la arman en la memoria y le exigen lo
     mismo que a una armada (`_dev/verifica-ficha-no-copia-examen.js`,
     `_dev/verifica-examen-sin-pistas.js`). Las hojas se midieron con
     ese borrador el 26 de noviembre de 2026: las siete caben, y la que
     más ocupa (la 4, donde empieza la práctica) llega a 246 mm de 248.
     El 27 se añadió la definición de complemento circunstancial y el
     recuadro «Para Media» pasó de la hoja 3 a la 2, junto a la revisión. Al
     armarla de verdad hay que volver a medirlas con
     `node _dev/verifica-ficha-paginas.js ficha-n5-escribir`.

   ► La página de la misión NO carga este archivo: el alumno no lo
     descarga. Solo lo lee el armador.

   ► LA PRÁCTICA NO ES EL EXAMEN. Cada pregunta de «Ponte a Prueba»
     ensaya un dato que el examen pregunta (`ensaya` es la `k` de ese
     dato en `contenido.js`), pero con otra pregunta:
       · otro ejemplo para la misma idea (otra oración, otro párrafo);
       · el verdadero o falso vuelto del revés;
       · pareados de aplicar: el término se une con un ejemplo, no con
         su definición.
     Los ejemplos de la práctica son NUEVOS a propósito: no se usan los
     del examen (las niñas, mi tía cocina, mi hermana y las tajadas, los
     alumnos y el cuento, las gallinas, el perro del vecino…) ni las
     oraciones del laboratorio.

   ► De dónde sale lo que la ficha enseña: la misma cabecera de
     `contenido.js` (programación de 7.º a 9.º, PDF pp. 7, 15 y 23; DCNB
     de III ciclo; CNB de 10.º). Lo que allí se anota como dicho con
     palabras propias (qué es un párrafo, qué es el sujeto) vale aquí.
   ============================================================ */
const FICHA = {
  archivo: 'ficha-n5-escribir',
  mision: 'Escribir por etapas',
  asignatura: 'Español',
  nivel: 'III Ciclo y Bachillerato (7.º a 11.º)',
  tema: 'Las etapas de la escritura (planear, borrador, revisión y versión final), el párrafo y sus tipos, la oración (sujeto, verbo y complemento), la coordinación y el ensayo corto',
  qr: 'qr-mision-n5-escribir.png',

  estilos: `
  /* La etiqueta del grado: con borde y texto, no solo color. */
  .grado { display: inline-block; font-size: 8pt; font-weight: 800; padding: 0 6px; border: 1.2px solid var(--materia); border-radius: 999px; color: var(--materia-osc); background: #fff; white-space: nowrap; vertical-align: 1px; }
  /* La oración partida en sus piezas */
  .partes { display: flex; gap: 6px; margin: 5px 0; break-inside: avoid; }
  .partes > div { border: 1.5px solid var(--linea); border-radius: 8px; padding: 4px 9px; background: #fff; font-weight: 700; text-align: center; }
  .partes small { display: block; font-weight: 600; font-size: 8.5pt; color: var(--gris); }
  @media print { .grado, .partes > div { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,

  objetivos: [
    'Escribir por <strong>etapas</strong>: planear, hacer el borrador, revisar y pasar la versión final.',
    'Planear un texto definiendo su <strong>tema, propósito, destinatario y formato</strong>.',
    'Revisar un texto mirando su <strong>concordancia, claridad, corrección y coherencia</strong>.',
    'Reconocer en un <strong>párrafo</strong> la idea principal y las secundarias, y distinguir sus tipos.',
    'Identificar en la <strong>oración</strong> el sujeto, el verbo y el complemento.',
    'Unir oraciones por <strong>coordinación</strong> y armar el esquema de un <strong>ensayo corto</strong>.'
  ],

  hojas: [
    /* ───────── Hoja 1 ───────── */
    [
      { objetivos: true },
      { h2: '✏️ 1. Escribir tiene etapas' },
      { p: '<span class="grado">7.º</span> <span class="grado">8.º</span> <span class="grado">9.º</span> Un texto no sale bien a la primera, y no es porque escribas mal: <strong>escribir se hace por etapas</strong>. Quien las sigue se equivoca menos delante del lector.' },
      { html: `<div class="pasos">
      <div><span class="pn">1</span><b>🧭 Planear</b>Decides de qué, para qué y para quién escribes, y ordenas tus ideas.</div>
      <div><span class="pn">2</span><b>✏️ Borrador</b>Escribes siguiendo tu plan. Saldrá con errores: para eso es.</div>
      <div><span class="pn">3</span><b>🔍 Revisar</b>Lees lo escrito, lo comparas con tu plan y lo corriges.</div>
    </div>` },
      { caja: 'regla', html: '⚡ <b>Y la cuarta etapa, la versión final:</b> el texto ya corregido y pasado en limpio, con el formato que elegiste. Puede ir a mano o en computadora. El borrador no es un texto malo: es un texto <strong>sin terminar</strong>.' },
      { h2: '🧭 2. Antes de escribir: planear' },
      { tabla: { cab: ['Pregunta', 'Se llama…', 'Ejemplo'], filas: [
        ['¿De qué voy a escribir?', 'El <strong>tema</strong> o asunto', 'Por qué se evapora el agua'],
        ['¿Para qué?', 'El <strong>propósito</strong>', 'Explicar, contar, pedir, convencer'],
        ['¿Para quién?', 'El <strong>destinatario</strong>', 'Un amigo, la maestra, el alcalde'],
        ['¿Con qué forma?', 'El tipo y el <strong>formato</strong>', 'Carta, afiche, informe, cuento']
      ] } },
      { caja: 'idea', html: '💡 <b>Después de las preguntas, el esquema:</b> buscas la información que te falta y la ordenas en un <strong>esquema</strong> o plan, con tus ideas en fila, por temas y subtemas. Mientras redactas, <strong>relee</strong> lo que llevas para no perder el hilo.' }
    ],

    /* ───────── Hoja 2 ───────── */
    [
      { caja: 'truco', html: '🧠 <b>Truco para planear:</b> antes de la primera línea, completa esta oración: «Voy a escribir un(a) ______ sobre ______, para ______, y lo va a leer ______». Si no puedes completarla, todavía no has planeado.' },
      { h2: '🔍 3. Después del borrador: revisar' },
      { p: '<span class="grado">7.º</span> <span class="grado">8.º</span> Revisar no es buscar tildes y ya. Es leer tu texto como si fuera de otro y hacerle estas preguntas:' },
      { tabla: { cab: ['Se revisa…', 'La pregunta', 'Así no → así sí'], filas: [
        ['🤝 Concordancia', '¿Las palabras van de acuerdo en género y número?', '«los niño corre» → «los niños corren»'],
        ['💡 Claridad', '¿Se entiende a la primera?', '«pon eso ahí» → «pon el libro en la mesa»'],
        ['✅ Corrección', '¿Ortografía, tildes y puntuación?', '«ayer llovio» → «ayer llovió»'],
        ['🧵 Coherencia', '¿Todo habla del tema y va en orden?', 'Se quita la oración que habla de otra cosa'],
        ['🔗 Cohesión', '¿Las ideas van enlazadas con conectores?', '«Llovió. Llegué tarde» → «Llovió; por eso, llegué tarde»']
      ] } },
      { caja: 'idea', html: '💡 <b>Tres ayudas para revisar:</b> compara el texto con <strong>tu plan</strong> (¿dijiste lo que querías?, ¿hay algo repetido?); pide que <strong>otra persona</strong> lo lea y te diga qué no entiende; y ten el <strong>diccionario</strong> a la mano. Si una frase se burla de alguien por cómo habla o de dónde es, se cambia por una que respete.' },
      { caja: 'hn', html: '🎓 <b>Para Media:</b> el programa de 10.º llama a todo esto <strong>la escritura como proceso</strong> y nombra tres pasos: <strong>planificación, ejecución y revisión</strong>. Son las mismas etapas: la ejecución es escribir el borrador.' },
      { h2: '📦 4. El párrafo' },
      { p: '<span class="grado">8.º</span> Un <strong>párrafo</strong> es un grupo de oraciones que tratan una misma idea. Se cierra con <strong>punto y aparte</strong>. Tiene una <strong>idea principal</strong>, la que dice lo más importante, y varias <strong>ideas secundarias</strong> que la apoyan o la explican.' },
      { tabla: { cab: ['Tipo de párrafo', 'Qué hace', 'Ejemplo'], filas: [
        ['🖼️ Descriptivo <span class="grado">7.º</span>', 'Dice cómo es algo. Lleva muchos adjetivos.', '«El volcán es alto, de laderas verdes y cumbre nublada».'],
        ['📖 Narrativo <span class="grado">7.º</span>', 'Cuenta hechos, uno después de otro.', '«Subimos al volcán, nos llovió y bajamos de noche».'],
        ['📊 Expositivo <span class="grado">7.º</span>', 'Explica un tema con datos, sin opinar.', '«Al hervir, el agua pasa de líquido a gas».'],
        ['📣 Persuasivo <span class="grado">8.º</span>', 'Busca convencer: pide algo y da razones.', '«Cuidemos la quebrada, porque de ella bebe la aldea».']
      ] } }
    ],

    /* ───────── Hoja 3 ───────── */
    [
      { h2: '🔤 5. La oración: sujeto, verbo y complemento', pegado: true },
      { p: '<span class="grado">8.º</span> Toda oración contesta dos preguntas: <strong>¿de quién o de qué se habla?</strong> (el <strong>sujeto</strong>) y <strong>¿qué se dice?</strong> (el <strong>predicado</strong>). El centro del predicado es el <strong>verbo</strong>; lo que lo acompaña son sus <strong>complementos</strong>.' },
      { html: `<div class="partes">
      <div>La mitocondria<small>sujeto</small></div>
      <div>produce<small>verbo</small></div>
      <div>la energía de la célula<small>complemento</small></div>
    </div>` },
      { caja: 'idea', html: '💡 <b>Tres cosas del sujeto:</b> si está escrito es <strong>expreso</strong> («<em>Carlos</em> madrugó»); si no lo está, es <strong>tácito</strong> («Llegamos tarde»: nosotros); y es <strong>compuesto</strong> cuando son dos o más («Ana y Luis estudian»).' },
      { caja: 'regla', html: '⚡ <b>El complemento circunstancial</b> es la palabra o el grupo de palabras que acompaña al verbo y dice <strong>en qué circunstancias</strong> pasa lo que el verbo cuenta: <strong>cuándo</strong> (de tiempo), <strong>dónde</strong> (de lugar) o <strong>cómo</strong> (de modo). Lo encuentras preguntándole al verbo: «¿cuándo llegaron?» → «Llegaron <em>ayer</em>».' },
      { h2: '🔗 6. Dos oraciones en una: la coordinación' },
      { p: '<span class="grado">9.º</span> Una <strong>oración simple</strong> es un sujeto con su predicado. Una <strong>compuesta</strong> junta dos o más. Si las une una conjunción y las dos valen lo mismo, están <strong>coordinadas</strong>:' },
      { tabla: { cab: ['Clase', 'Conjunciones', 'Qué hace', 'Ejemplo'], filas: [
        ['Copulativa', 'y, e, ni', 'Suma', '«Llovió <b>y</b> se fue la luz».'],
        ['Disyuntiva', 'o, u', 'Da a elegir', '«¿Estudias <b>o</b> descansas?».'],
        ['Adversativa', 'pero, sin embargo, no obstante', 'Opone', '«Quise ir, <b>pero</b> no pude».'],
        ['Explicativa', 'es decir, esto es, o sea', 'Aclara', '«Se evaporó, <b>es decir</b>, pasó a gas».']
      ] } },
      { caja: 'truco', html: '🧠 <b>Sin conjunción:</b> dos oraciones pegadas solo con una coma están <strong>yuxtapuestas</strong>: «Llegué, vi la nota».' },
      { h2: '💭 7. El ensayo corto' },
      { p: '<span class="grado">9.º</span> En el <strong>ensayo</strong> el autor da <strong>su opinión</strong> sobre un tema que él mismo elige, con libertad pero con razones. Se prepara por etapas: se elige y se delimita el tema, se hace el esquema (<strong>presentación, desarrollo y conclusión</strong>), se redacta, se revisa y se elabora la versión final.' },
      { h2: '⚠️ 8. Errores comunes: ¡no caigas en ellos!' },
      { tabla: { k: 'normal', cab: ['Error', 'Por qué está mal', 'Lo correcto'], filas: [
        ['Entregar el borrador', 'Lleva las fallas que una lectura más habría quitado.', 'Revisar y pasar la versión final ✔'],
        ['Creer que revisar es solo poner tildes', 'También se mira si se entiende y si todo habla del tema.', 'Concordancia, claridad, corrección y coherencia ✔'],
        ['Poner «pero» entre dos ideas que se suman', '«Pero» opone: el lector espera un contraste que no llega.', 'Para sumar, «y»; para oponer, «pero» ✔']
      ] } }
    ],

    /* ───────── Hoja 4: la práctica ───────── */
    [
      { h2: '✍️ 9. ¡Ponte a Prueba! Actividades' },
      { practica: 'completar' },
      { practica: 'vf' },
      { practica: 'seleccion', hasta: 3 }
    ],

    /* ───────── Hoja 5 ───────── */
    [
      { practica: 'seleccion', desde: 4 },
      { practica: 'pareados' }
    ],

    /* ───────── Hoja 6 ───────── */
    [
      { felicitacion: true },
      { rubrica: true }
    ]
  ],

  practica: {
    completar: [
      { q: 'Antes de redactar, Marta anota sus ideas en fila, por temas y subtemas: hizo un ___.', a: 'esquema', ensaya: 'cp-esquema' },
      { q: 'En «El río creció anoche», lo que se dice del río («creció anoche») es el ___.', a: 'predicado', ensaya: 'cp-predicado' },
      { q: 'En «Compramos pan» nadie escribió quiénes compraron: el sujeto está ___.', a: 'tácito', ensaya: 'cp-tacito' },
      { q: '«Los niños corren» está bien: las dos palabras van en plural. A eso se le llama ___.', a: 'concordancia', ensaya: 'cp-concordancia' },
      { q: 'Los ejemplos del hielo y del vapor apoyan a la idea principal de un párrafo: son ideas ___.', a: 'secundarias', ensaya: 'cp-secundarias' },
      { q: '«Llovió y se fue la luz» suma dos oraciones con «y»: es una coordinada ___.', a: 'copulativa', ensaya: 'cp-copulativas' },
      { q: 'Dudas si «exhibir» lleva hache. Para salir de la duda abres el ___.', a: 'diccionario', ensaya: 'cp-diccionario' },
      { q: 'La última de las tres partes de un ensayo, la que cierra, es la ___.', a: 'conclusión', ensaya: 'cp-conclusion' },
      { q: 'Una carta para la alcaldesa se redacta pensando en ella: la alcaldesa es la ___.', a: 'destinataria', ensaya: 'cp-destinatario' },
      { q: '«Ayer subimos al cerro, almorzamos arriba y bajamos de noche» cuenta hechos: es un párrafo ___.', a: 'narrativo', ensaya: 'cp-narrativo' }
    ],
    vf: [
      { q: 'Para escribir bien no hace falta saber quién va a leer.', a: false, ensaya: 'tf-para-quien' },
      { q: 'Leer de nuevo lo que escribiste, antes de entregarlo, lo mejora.', a: true, ensaya: 'tf-primera-escritura' },
      { q: '«Alta», «verde» y «nublada» son adjetivos, y sirven para describir.', a: true, ensaya: 'tf-adjetivos' },
      { q: 'En un párrafo hay una idea que manda y otras que la acompañan.', a: true, ensaya: 'tf-ideas-iguales' },
      { q: '«Los gatos duermen» tiene un error: el verbo debería ir en singular.', a: false, ensaya: 'tf-ninas-llego' },
      { q: 'En «El gallo canta», la palabra «gallo» es el verbo.', a: false, ensaya: 'tf-cocina' },
      { q: 'Para convencer a alguien sirve más un párrafo persuasivo que uno que solo cuenta.', a: true, ensaya: 'tf-narrativo-convence' },
      { q: '«Pero» sirve para sumar dos ideas que van en la misma dirección.', a: false, ensaya: 'tf-pero' },
      { q: 'Al revisar también se mira si todas las oraciones hablan del tema.', a: true, ensaya: 'tf-solo-tildes' },
      { q: 'Da igual poner las ideas en cualquier orden: el lector las acomoda solo.', a: false, ensaya: 'tf-ordenar-antes' }
    ],
    seleccion: [
      { q: 'Tu maestra pide un informe para el viernes. ¿Qué haces primero?', o: ['pasarlo en limpio', 'pedir que lo califiquen', 'decidir de qué tratará y para quién', 'ponerle la portada'], a: 2, ensaya: 'mc-primero' },
      { q: 'Escribiste tu cuento de corrido y todavía le vas a cambiar cosas. Lo que tienes en la mano es…', o: ['un borrador', 'una versión final', 'un afiche', 'una portada'], a: 0, ensaya: 'mc-borrador' },
      { q: 'Habías anotado «tres razones» y en tu texto solo hay dos. ¿Cómo te diste cuenta?', o: ['adivinando', 'comparando el texto con el plan', 'contando las tildes', 'mirando el reloj'], a: 1, ensaya: 'mc-compara-plan' },
      { q: '«Mi abuela es la mejor cocinera de la aldea. Hace tortillas, tamales y atol». ¿Cuál es la idea principal?', o: ['Hace tamales', 'Hace atol', 'Las tortillas son ricas', 'Mi abuela es la mejor cocinera de la aldea'], a: 3, ensaya: 'mc-idea-principal' },
      { q: '«La mitocondria produce la energía de la célula. El núcleo guarda el ADN». Este párrafo es…', o: ['persuasivo', 'descriptivo de un paisaje', 'un cuento', 'expositivo'], a: 3, ensaya: 'mc-expositivo' },
      { q: 'En «Mi tío repara bicicletas», ¿cuál es el verbo?', o: ['tío', 'repara', 'bicicletas', 'Mi'], a: 1, ensaya: 'mc-verbo' },
      { q: 'En «Los vecinos limpiaron la quebrada», ¿de quién se habla?', o: ['de los vecinos', 'de la quebrada', 'de la limpieza', 'del agua'], a: 0, ensaya: 'mc-sujeto' },
      { q: '«El agua hierve. Mi primo juega fútbol. El vapor sube». ¿Qué le falla a este párrafo?', o: ['la letra', 'el título', 'la coherencia', 'la fecha'], a: 2, ensaya: 'mc-coherencia' },
      { q: '«¿Quieres café ___ fresco?». Para dar a elegir se escribe…', o: ['o', 'y', 'pero', 'ni'], a: 0, ensaya: 'mc-o' },
      { q: 'En tu borrador pusiste un apodo que se burla de un compañero. Al revisar…', o: ['lo subrayas', 'lo dejas igual', 'lo pones en mayúsculas', 'lo quitas'], a: 3, ensaya: 'mc-sin-burla' }
    ],
    /* Pareados de aplicar: cada término se une con un EJEMPLO. El examen
       lo une con su definición. */
    pareados: {
      columnaA: 'Columna A',
      columnaB: 'Columna B: el ejemplo',
      anchoA: '34%',
      pares: [
        { term: 'La planeación', def: '«Será una carta, para el director, para pedir una cancha»', ensaya: 'pr-planeacion' },
        { term: 'La revisión', def: 'Cambiar «las flor» por «las flores»', ensaya: 'pr-revision' },
        { term: 'El párrafo descriptivo', def: '«La laguna es honda, quieta y azul»', ensaya: 'pr-descriptivo' },
        { term: 'El párrafo persuasivo', def: '«Vacunemos a los perros: así nos cuidamos todos»', ensaya: 'pr-persuasivo' },
        { term: 'La oración simple', def: '«La campana sonó»', ensaya: 'pr-simple' },
        { term: 'La oración compuesta', def: '«Tocaron el timbre y entramos al aula»', ensaya: 'pr-compuesta' },
        { term: 'La disyuntiva', def: '«¿Subes o bajas?»', ensaya: 'pr-disyuntiva' },
        { term: 'La explicativa', def: '«Es bilingüe, es decir, habla dos lenguas»', ensaya: 'pr-explicativa' },
        { term: 'El ensayo', def: 'Tu opinión, con razones, sobre si debe haber tarea los viernes', ensaya: 'pr-ensayo' },
        { term: 'La cohesión', def: '«Se enfermó; por eso, faltó a clases»', ensaya: 'pr-cohesion' }
      ]
    }
  },

  felicitacion: '🏅 <b>¡Felicidades! Has completado la Misión Escribir por etapas.</b> Ahora sabes que un texto se planea, se escribe en borrador, se revisa y se pasa en limpio; que un párrafo tiene una idea principal; que la oración tiene sujeto, verbo y complemento; y que dos oraciones se pueden unir con la conjunción justa. <b>La próxima vez que escribas, no entregues el borrador.</b>',

  rubrica: {
    filas: [
      ['Copió los contenidos de este material en su cuaderno de Español.', 'Tarea en el hogar'],
      ['Resolvió la sección «Ponte a Prueba» directamente en esta ficha.', 'Tarea en el aula, un día antes del examen'],
      ['Escribió un párrafo por etapas y entregó el plan, el borrador y la versión final.', 'Tarea en el aula'],
      ['Prueba impresa realizada en el aula.', 'Evaluación en el aula']
    ],
    nota: 'Recuerde que ya aprendió a sacar el promedio: sume el total del valor obtenido y divídalo entre cuatro. El resultado será su nota final. Perderá puntos si no completa el trabajo, si su letra no es legible o si escribe con faltas de ortografía.'
  },

  notaDocente: 'esta ficha está basada en el contenido interactivo de la plataforma M.E.T.A.S «Misión Escribir por etapas» (Español, primer parcial de 7.º a 9.º, con un apartado para Media). Cada contenido lleva la etiqueta de su grado según la programación de febrero y marzo: use los que correspondan al suyo. La sección «Ponte a Prueba» ensaya los mismos datos que la prueba de la plataforma, pero <strong>con otras preguntas</strong>: resolverla la víspera prepara al alumno sin enseñarle la hoja del examen. En la tarea de escritura, los tachones del borrador no bajan puntos: son la evidencia de que el alumno revisó.'
};
