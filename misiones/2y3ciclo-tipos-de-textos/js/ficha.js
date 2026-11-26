/* ============================================================
   M.E.T.A.S · Misión Los Tipos de Textos · el bloque de su ficha
   ------------------------------------------------------------
   De aquí sale `fichas/ficha-tipos-de-textos.html`. La arma
   `node _dev/arma-ficha.js 2y3ciclo-tipos-de-textos`; la ficha no se
   edita a mano. La forma del bloque está en `_privado/PLANTILLA-FICHAS.md`.

   ► La página de la misión NO carga este archivo: el alumno no lo
     descarga. Solo lo lee el armador.

   ► LA PRÁCTICA NO ES EL EXAMEN. Antes, las 40 preguntas de «Ponte a
     Prueba» eran las 40 del banco del examen, palabra por palabra, y la
     rúbrica manda resolverlas la víspera. Ahora cada pregunta ensaya un
     dato que el examen pregunta (`ensaya` es la `k` de ese dato en
     `tipos-de-textos.js`), pero con otra pregunta:
       · otro ejemplo para la misma idea (otro fragmento, otra oración);
       · el verdadero o falso vuelto del revés, para que no sirva
         acordarse de «esa era falsa»;
       · pareados de aplicar: el término se une con un ejemplo, no con su
         definición.
     Lo vigila `_dev/verifica-ficha-no-copia-examen.js`.

   ► Los fragmentos de la práctica son NUEVOS a propósito. No se usan los
     del examen (el arroz, el zorro, el colibrí, Rex, el barrilete…) ni
     los de la Minidemostración, que el banco nuevo ya pregunta.

   ► Tres datos que se cambiaron respecto a la ficha de antes (eran los
     dudosos anotados en el PR 53):
       · El nudo ya no es «el momento de mayor tensión»: la actividad
         Ordena llama así al clímax. Queda lo que dice el DCNB, que
         nombra tres partes (exposición, nudo y desenlace).
       · La noticia ya no sale entre los ejemplos del texto narrativo.
         Se queda donde no hay duda: es un texto no literario, que informa.
       · (El catálogo y el anuncio como textos descriptivos estaban en el
         Laboratorio de la misión, no en la ficha.)
   ============================================================ */
const FICHA = {
  archivo: 'ficha-tipos-de-textos',
  mision: 'Los Tipos de Textos',
  asignatura: 'Español',
  nivel: 'Educación Básica',
  tema: 'Los tipos de textos según su propósito comunicativo, la estructura narrativa, las marcas lingüísticas y los textos literarios y no literarios',
  qr: 'qr-mision-tipos-de-textos.png',

  /* Los colores con significado de este tema: azul = narrativo (contar),
     verde = expositivo (informar), naranja = argumentativo (convencer). */
  estilos: `
  :root { --nar: #1e40af; --exp: #15803d; --arg: #c2410c; }
  /* Un mismo tema en cuatro textos (minidemostración) */
  .cuatro { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; text-align: left; }
  .cuatro > div { border-radius: 8px; padding: 8px 10px; font-size: 9pt; border: 1.5px solid var(--linea); background: #fff; }
  .cuatro b { display: block; font-size: 9.5pt; margin-bottom: 2px; }
  .cuatro .c-nar { border-color: #b6d4fb; background: #dbeafe; } .cuatro .c-nar b { color: var(--nar); }
  .cuatro .c-des { border-color: #f0dca6; background: #fff8e6; } .cuatro .c-des b { color: #b07d00; }
  .cuatro .c-exp { border-color: #b9e6c6; background: #dcfce7; } .cuatro .c-exp b { color: var(--exp); }
  .cuatro .c-ins { border-color: #f3c99a; background: #ffedd5; } .cuatro .c-ins b { color: var(--arg); }
  .tri .tnar { background: #dbeafe; border: 1px solid #b6d4fb; }
  .tri .texp { background: #dcfce7; border: 1px solid #b9e6c6; }
  .tri .targ { background: #ffedd5; border: 1px solid #f3c99a; }
  .tri .tnar b { color: var(--nar); } .tri .texp b { color: var(--exp); } .tri .targ b { color: var(--arg); }
  /* La historia corta de los pareados */
  .historia { background: var(--papel); border: 1.5px dashed var(--linea); border-radius: 9px; padding: 7px 12px; margin: 6px 0; font-size: 10.5pt; break-inside: avoid; }
  .historia b { color: var(--materia-osc); }
  @media print { .cuatro > div, .historia { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,

  objetivos: [
    'Reconocer el <strong>propósito comunicativo</strong> como el criterio que determina el tipo de un texto.',
    'Identificar los principales tipos: <strong>narrativo, descriptivo, expositivo, argumentativo, instructivo, dialogado y poético</strong>.',
    'Describir la <strong>estructura narrativa</strong> (inicio, nudo y desenlace) y el papel del <strong>narrador</strong>.',
    'Distinguir el texto <strong>expositivo</strong> (informa con objetividad) del <strong>argumentativo</strong> (convence con una tesis).',
    'Reconocer las <strong>marcas lingüísticas</strong> que delatan a cada tipo de texto.',
    'Clasificar los textos en <strong>literarios</strong> y <strong>no literarios</strong> según su intención.'
  ],

  /* Cada arreglo es una hoja carta. El corte lo decide quien escribe el
     bloque y lo comprueba `verifica-ficha-paginas.js`. ⚠️ Las preguntas
     del banco nuevo del examen citan estas secciones por su hoja («Ficha,
     página 2 (3. La estructura narrativa y el narrador)»): si una sección
     cambia de hoja, hay que corregir esa `fuente` en tipos-de-textos.js. */
  hojas: [
    /* ───────── Hoja 1 ───────── */
    [
      { objetivos: true },
      { h2: '📚 1. ¿Qué son los tipos de textos?' },
      { p: 'Los <strong>tipos de textos</strong> son las distintas clases de textos que existen según su <strong>propósito comunicativo</strong>, es decir, según <strong>para qué se escriben</strong>. No es lo mismo un texto para <strong>contar</strong> una historia que uno para <strong>explicar</strong> un tema, <strong>convencer</strong> de una idea o <strong>indicar</strong> cómo hacer algo.' },
      { caja: 'regla', html: '⚡ <b>El propósito manda:</b> el tipo de texto NO depende del tema, ni del tamaño, ni del autor: depende de la <strong>intención</strong> con la que se escribe. Esa intención se llama <strong>propósito comunicativo</strong>.' },
      { caja: 'idea', html: '💡 <b>Idea clave:</b> conocer los tipos de texto te ayuda a <strong>comprender mejor</strong> lo que lees y a <strong>escribir</strong> el texto adecuado en cada situación: una carta no se escribe como una receta, ni una noticia como un poema.' },
      { caja: 'truco', html: '🧠 <b>Truco para recordar:</b> pregúntale al texto «¿<b>para qué naciste</b>?»: ¿para contar? narrativo · ¿para decir cómo es? descriptivo · ¿para informar? expositivo · ¿para convencer? argumentativo · ¿para dar pasos? instructivo.' },
      { h3: '🔬 Minidemostración' },
      { html: `<div class="ilus">
      <div class="ilus-t">Un mismo tema («el perro»), cuatro textos distintos: ¡lo que cambia es el propósito!</div>
      <div class="cuatro">
        <div class="c-nar"><b>📖 Narrativo: cuenta</b>«Ayer mi perro Rex se escapó del patio y todos salimos a buscarlo…»</div>
        <div class="c-des"><b>🖼️ Descriptivo: describe</b>«Rex es grande, de pelo café, orejas caídas y mirada juguetona».</div>
        <div class="c-exp"><b>📊 Expositivo: informa</b>«El perro es un mamífero doméstico que convive con el ser humano».</div>
        <div class="c-ins"><b>📋 Instructivo: indica pasos</b>«1. Baña a tu perro. 2. Cepilla su pelo. 3. Dale su alimento».</div>
      </div>
    </div>` }
    ],

    /* ───────── Hoja 2 ───────── */
    [
      { h2: '🗺️ 2. Los principales tipos de textos' },
      { tabla: { cab: ['Tipo', 'Propósito', 'Ejemplos'], filas: [
        ['📖 Narrativo', 'CONTAR hechos que les pasan a unos personajes en un tiempo y lugar.', 'cuento, fábula, leyenda, novela'],
        ['🖼️ Descriptivo', 'DESCRIBIR cómo son personas, animales, lugares u objetos, con muchos adjetivos.', 'el retrato, un paisaje'],
        ['📊 Expositivo', 'INFORMAR y explicar un tema con claridad y objetividad, sin opinar.', 'enciclopedia, texto de ciencias, informe'],
        ['⚖️ Argumentativo', 'CONVENCER al lector defendiendo una opinión (tesis) con razones.', 'ensayo, artículo de opinión, reseña'],
        ['📋 Instructivo', 'INDICAR los pasos para hacer algo, con verbos en imperativo o infinitivo.', 'receta, manual, reglas de un juego'],
        ['💬 Dialogado', 'REPRODUCIR una conversación, con rayas de diálogo.', 'obra de teatro, entrevista, guion'],
        ['🎭 Poético', 'EXPRESAR sentimientos con lenguaje bello, casi siempre en verso.', 'el poema']
      ] } },
      { h2: '🧩 3. La estructura narrativa y el narrador' },
      { p: 'El texto narrativo es el más conocido y sigue <strong>tres momentos</strong> en orden:' },
      { html: `<div class="pasos">
      <div><span class="pn">1</span><b>🌅 Inicio</b>Se presentan los personajes y el lugar de la historia.</div>
      <div><span class="pn">2</span><b>⚡ Nudo</b>Surge el conflicto o problema que complica la historia.</div>
      <div><span class="pn">3</span><b>🎯 Desenlace</b>Se resuelve la historia y la situación queda cerrada.</div>
    </div>` },
      { caja: 'idea', html: '💡 <b>El narrador:</b> es la <strong>voz que cuenta</strong> la historia (¡no es lo mismo que el autor!). Puede ser <strong>protagonista</strong> (cuenta en 1.ª persona: «yo caminé…») u <strong>omnisciente</strong> (lo sabe todo y cuenta en 3.ª persona: «ella caminó…»).' },
      { h3: '🧱 Cada texto tiene su propia estructura' },
      { html: `<div class="tri">
      <div class="tnar"><b>📖 Narrativo</b>Inicio → nudo → desenlace. Responde a «¿qué pasó?».</div>
      <div class="texp"><b>📊 Expositivo</b>Introducción → desarrollo → conclusión. Responde a «¿qué es?, ¿por qué?».</div>
      <div class="targ"><b>⚖️ Argumentativo</b>Tesis → argumentos → conclusión. Responde a «¿qué opinas y por qué?».</div>
    </div>` },
      { caja: 'regla', html: '⚡ <b>Y el instructivo:</b> va de <strong>materiales → pasos numerados → resultado</strong>. Si una receta desordena sus pasos, ¡el pastel se hornea antes de batirlo!' },
      { caja: 'truco', html: '🧠 <b>Truco:</b> «<b>Tesis</b>» suena a «<b>tú opinas</b>»: si el texto presenta una opinión y la defiende con razones (porque, por lo tanto), es argumentativo. Si solo explica datos sin opinar, es expositivo.' }
    ],

    /* ───────── Hoja 3 ───────── */
    [
      { h2: '🔎 4. Las marcas lingüísticas: pistas para reconocerlos', pegado: true },
      { tabla: { k: 'normal', cab: ['Si el texto tiene…', 'Seguramente es…', 'Ejemplo'], filas: [
        ['Muchos adjetivos', 'Descriptivo', '«La casa es antigua, blanca y espaciosa».'],
        ['Verbos de acción en pasado', 'Narrativo', '«Corrió, saltó la cerca y se escondió».'],
        ['Verbos en imperativo o infinitivo', 'Instructivo', '«Mezcla la harina. Hornear 20 minutos».'],
        ['Conectores lógicos y opiniones', 'Argumentativo', '«Creo que… porque… por lo tanto…»'],
        ['Datos objetivos en presente', 'Expositivo', '«El agua hierve a 100 °C».'],
        ['Rayas de diálogo (—)', 'Dialogado', '«—¿Vienes? —Sí, ya voy».']
      ] } },
      { caja: 'idea', html: '💡 <b>Los conectores</b> unen las ideas de un texto y también son pistas: de <strong>tiempo</strong> (después, luego), de <strong>orden</strong> (primero, finalmente) y de <strong>causa</strong> (porque, ya que). Guían al lector como flechas en el camino.' },
      { h2: '📕 5. Textos literarios y no literarios' },
      { tabla: { cab: ['Grupo', 'Intención', 'Ejemplos'], filas: [
        ['📕 Literarios', 'Crear BELLEZA y despertar emociones con el lenguaje.', 'cuento, poema, novela, fábula, obra de teatro'],
        ['📰 No literarios', 'Cumplir una FUNCIÓN PRÁCTICA: informar, enseñar o servir en la vida diaria.', 'noticia, receta, afiche, manual, informe']
      ] } },
      { h2: '⚠️ 6. Errores comunes: ¡no caigas en ellos!' },
      { tabla: { k: 'normal', cab: ['Error', 'Por qué está mal', 'Lo correcto'], filas: [
        ['Confundir expositivo con argumentativo', '«El texto de la enciclopedia opina». El expositivo NO opina: solo informa.', 'Informa = expositivo · Convence = argumentativo ✔'],
        ['Confundir narrar con describir', '«Rex es café y juguetón» no cuenta ninguna historia: dice cómo es.', 'Cuenta qué pasó = narrativo · Dice cómo es = descriptivo ✔'],
        ['Clasificar por el tema y no por el propósito', 'Sobre «el perro» puede haber cuento, retrato, artículo o manual.', 'El propósito comunicativo decide el tipo ✔'],
        ['Creer que la noticia es literaria', 'La noticia informa un hecho real: tiene función práctica.', 'Noticia, receta e informe = no literarios ✔'],
        ['Confundir autor con narrador', 'El autor escribe el libro; el narrador es la voz DENTRO del texto.', 'Narrador = voz que cuenta la historia ✔']
      ] } },
      { caja: 'hn', html: '🇭🇳 <b>En Honduras:</b> nuestras <strong>leyendas</strong> de La Sucia y El Cadejo son textos narrativos literarios; la <strong>receta de las baleadas</strong> es un texto instructivo; la <strong>noticia</strong> del periódico sobre un huracán es un texto no literario que informa; y los versos de <strong>Juan Ramón Molina</strong>, nuestro gran poeta, son textos poéticos. ¡Todos los tipos de texto viven en nuestra cultura catracha!' }
    ],

    /* ───────── Hoja 4: la práctica ───────── */
    [
      { h2: '✍️ 7. ¡Ponte a Prueba! Actividades' },
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
      { q: '«Corrió, saltó la cerca y se escondió» cuenta hechos en tiempo ___.', a: 'pasado', ensaya: 'cp-pasado' },
      { q: 'En «Pela los plátanos y fríelos», los verbos dan órdenes: están en modo ___.', a: 'imperativo', ensaya: 'cp-imperativo' },
      { q: '«Antigua», «blanca» y «espaciosa» dicen cómo es una casa: son ___.', a: 'adjetivos', ensaya: 'cp-adjetivos' },
      { q: 'Una novela y una obra de teatro se escriben para crear belleza: son textos ___.', a: 'literarios', ensaya: 'cp-literarios' },
      { q: 'En «—¿Vienes? —Sí, ya voy», el signo que abre lo que dice cada persona se llama ___.', a: 'raya', ensaya: 'cp-raya' },
      { q: 'Para hacer baleadas, la receta dice primero qué ___ hay que tener a mano.', a: 'ingredientes', ensaya: 'cp-ingredientes' },
      { q: '«Las abejas fabrican miel» da un dato con el verbo en tiempo ___.', a: 'presente', ensaya: 'cp-presente' },
      { q: 'El libro que explica muchos temas en orden alfabético, sin dar opiniones, es la ___.', a: 'enciclopedia', ensaya: 'cp-enciclopedia' },
      { q: 'En «Los niños subieron al cerro», quien cuenta habla de otros: usa la ___ persona.', a: 'tercera', ensaya: 'cp-tercera' },
      { q: 'Un informe de ciencias da los datos sin exagerar ni opinar: su lenguaje es ___.', a: 'objetivo', ensaya: 'cp-objetivo' }
    ],
    vf: [
      { q: 'Un texto corto y uno largo pueden ser del mismo tipo.', a: true, ensaya: 'tf-tamano' },
      { q: 'Sobre el maíz solo se puede escribir un tipo de texto.', a: false, ensaya: 'tf-mismo-tema' },
      { q: 'La leyenda de El Cadejo narra una historia.', a: true, ensaya: 'tf-leyendas' },
      { q: 'Se puede describir un lugar, un animal o un objeto, no solo a una persona.', a: true, ensaya: 'tf-descripcion' },
      { q: 'El manual de un teléfono se escribe para contar una aventura.', a: false, ensaya: 'tf-manual' },
      { q: 'Quien escribe un poema quiere, antes que nada, informar.', a: false, ensaya: 'tf-poema' },
      { q: 'Si se cambian de lugar los pasos de un instructivo, el resultado puede salir mal.', a: true, ensaya: 'tf-orden-pasos' },
      { q: 'En un informe se pueden inventar datos para que quede más bonito.', a: false, ensaya: 'tf-informe' },
      { q: 'La fábula cuenta una historia, igual que el cuento.', a: true, ensaya: 'tf-fabula' },
      { q: 'Una noticia puede contar algo que nunca pasó.', a: false, ensaya: 'tf-noticia' }
    ],
    seleccion: [
      { q: '«Dobla la hoja por la mitad. Después, recorta por la línea». Es un texto…', o: ['descriptivo', 'narrativo', 'instructivo', 'poético'], a: 2, ensaya: 'mc-arroz' },
      { q: '«Anoche se fue la luz en el barrio y mi abuela nos contó historias hasta que volvió». Es un texto…', o: ['narrativo', 'expositivo', 'instructivo', 'argumentativo'], a: 0, ensaya: 'mc-zorro' },
      { q: '«La iguana es verde, de cola larga y piel áspera». Es un texto…', o: ['dialogado', 'descriptivo', 'narrativo', 'argumentativo'], a: 1, ensaya: 'mc-colibri' },
      { q: '«Opino que debemos sembrar árboles, porque dan sombra y aire limpio». Es un texto…', o: ['instructivo', 'descriptivo', 'poético', 'argumentativo'], a: 3, ensaya: 'mc-desayuno' },
      { q: '«—¿Trajiste el cuaderno? —Sí, aquí está». Es un texto…', o: ['dialogado', 'expositivo', 'poético', 'narrativo'], a: 0, ensaya: 'mc-futbol' },
      { q: '«El corazón bombea la sangre a todo el cuerpo». Es un texto…', o: ['poético', 'narrativo', 'expositivo', 'dialogado'], a: 2, ensaya: 'mc-tierra' },
      { q: '«Río que cantas de noche, / llévate mi pena al mar». Es un texto…', o: ['expositivo', 'instructivo', 'argumentativo', 'poético'], a: 3, ensaya: 'mc-luna' },
      { q: 'Un afiche que dice «¡Vacuna hoy a tu perro!» se escribió para…', o: ['contar una leyenda', 'lograr que el lector haga algo', 'describir a un animal', 'dar una receta'], a: 1, ensaya: 'mc-anuncio' },
      { q: 'Antes de leer un texto completo, ¿qué conviene mirar para saber de qué trata?', o: ['el título', 'el número de página', 'la última palabra', 'el tamaño de la letra'], a: 0, ensaya: 'mc-titulo' },
      { q: 'En la parada, tu mamá quiere saber a qué hora pasa el bus. ¿Qué texto le sirve?', o: ['una fábula', 'un poema', 'un horario', 'una adivinanza'], a: 2, ensaya: 'mc-recibo' }
    ],
    /* Pareados de aplicar: el término se une con un EJEMPLO. El examen lo
       une con su definición. */
    pareados: {
      intro: '<div class="historia"><b>Lee esta historia corta:</b> «Marta vivía con su abuela cerca del río. Una noche, la crecida se llevó el puente. Los vecinos hicieron un puente nuevo y Marta volvió a la escuela».</div>',
      columnaA: 'Columna A',
      columnaB: 'Columna B: el ejemplo',
      anchoA: '36%',
      pares: [
        { term: 'Inicio', def: '«Marta vivía con su abuela cerca del río»', ensaya: 'pr-inicio' },
        { term: 'Nudo', def: '«Una noche, la crecida se llevó el puente»', ensaya: 'pr-nudo' },
        { term: 'Desenlace', def: '«Los vecinos hicieron un puente nuevo y Marta volvió a la escuela»', ensaya: 'pr-desenlace' },
        { term: 'Personaje', def: 'Marta', ensaya: 'pr-personaje' },
        { term: 'Narrador', def: 'Quien nos relata lo que le pasó a Marta, sin ser ella', ensaya: 'pr-narrador' },
        { term: 'Tesis', def: '«El recreo debería durar más»', ensaya: 'pr-tesis' },
        { term: 'Argumento', def: '«…porque jugar ayuda a aprender mejor»', ensaya: 'pr-argumento' },
        { term: 'Conector', def: '«luego», «finalmente»', ensaya: 'pr-conector' },
        { term: 'Verso', def: '«Tierra de pinos y maizales»', ensaya: 'pr-verso' },
        { term: 'Propósito comunicativo', def: 'Invitar a la feria: para eso se hizo el aviso', ensaya: 'pr-proposito' }
      ]
    }
  },

  felicitacion: '🏅 <b>¡Felicidades! Has completado la Misión Los Tipos de Textos.</b> Ahora sabes que el propósito comunicativo manda: reconoces al narrativo que cuenta, al descriptivo que pinta con adjetivos, al expositivo que informa sin opinar, al argumentativo que convence con su tesis, al instructivo que ordena sus pasos, al dialogado con sus rayas y al poético que emociona en verso. ¡De las leyendas de La Sucia a la receta de las baleadas, ningún texto tiene secretos para ti! 📚✨',

  rubrica: {
    filas: [
      ['Copió los contenidos de este material en su cuaderno de Español.', 'Tarea en el hogar'],
      ['Resolvió la sección «Ponte a Prueba» directamente en esta ficha.', 'Tarea en el aula, un día antes del examen'],
      ['Escribió y clasificó ejemplos de cada tipo de texto en su cuaderno.', 'Tarea en el aula'],
      ['Prueba impresa realizada en el aula.', 'Evaluación en el aula']
    ],
    nota: 'Recuerde que ya aprendió a sacar el promedio: sume el total del valor obtenido y divídalo entre cuatro. El resultado será su nota final. Perderá puntos si no completa el trabajo, si su letra no es legible o si escribe con faltas de ortografía.'
  },

  notaDocente: 'esta ficha está basada en el contenido interactivo de la plataforma M.E.T.A.S «Misión Los Tipos de Textos» (Educación Básica). Puede utilizarse como guía de estudio impresa o digital antes de la evaluación final. La sección «Ponte a Prueba» ensaya los mismos datos que la prueba de la plataforma (completar, verdadero o falso, selección múltiple y pareados), pero con otras preguntas y otros ejemplos: no es la hoja del examen. Si tiene impresa una versión anterior de esta ficha, use la pauta de esta misma impresión, porque las preguntas cambiaron en noviembre de 2026. Puede complementarse con el juego «¿Qué texto usarías?» (dar una situación y elegir el tipo adecuado), la escritura de un mismo tema en cuatro textos distintos y la caza de tipos de texto en periódicos, recetarios y libros del rincón de lectura. Etapa 8 de la Ruta de la Palabra, después de «Marcadores Textuales». La misión interactiva (código QR de la portada) permite al estudiante practicar con retroalimentación inmediata antes de resolver esta ficha.'
};
