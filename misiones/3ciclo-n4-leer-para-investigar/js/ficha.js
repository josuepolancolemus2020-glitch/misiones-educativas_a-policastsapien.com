/* ============================================================
   M.E.T.A.S · Misión Leer para investigar · el bloque de su ficha
   ------------------------------------------------------------
   De aquí saldrá `fichas/ficha-n4-leer-para-investigar.html`. La arma
   `node _dev/arma-ficha.js 3ciclo-n4-leer-para-investigar`; la ficha no
   se edita a mano. La forma del bloque está en
   `_privado/PLANTILLA-FICHAS.md`.

   ► TODAVÍA NO ESTÁ ARMADA, y es a propósito: la ficha impresa, su QR
     (`img/qr-mision-n4-leer-para-investigar.png`) y el enlace desde la
     misión se hacen cuando la misión entra al catálogo (tanda 4).
     Mientras tanto las sondas la arman en la memoria y le exigen lo
     mismo que a una armada.

   ► La página de la misión NO carga este archivo: el alumno no lo
     descarga. Solo lo lee el armador.

   ► LA PRÁCTICA NO ES EL EXAMEN. Cada pregunta de «Ponte a Prueba»
     ensaya un dato que el examen pregunta (`ensaya` es la `k` de ese
     dato en `contenido.js`), pero con otra pregunta:
       · otro ejemplo para la misma idea (el examen define el glosario;
         la ficha lo pone en manos de Dania, al final de su libro);
       · el verdadero o falso vuelto del revés;
       · pareados de aplicar: el término se une con lo que pasa en una
         escena corta (Sara en la biblioteca), no con su definición.
     Lo vigila `_dev/verifica-ficha-no-copia-examen.js`.
     Las 40 ensayan, una por una, las 40 del banco de las formas 1 a 30
     (los cuatro bancos de siempre de `contenido.js`), que son las que el
     alumno tiene más cerca: ninguna se queda sin su práctica.

   ► De dónde sale lo que afirma: de las mismas fuentes que la misión
     (la programación de 7.º a 9.º, PDF pp. 7, 15 y 23, y el DCNB, pp. 88
     a 91, 93, 121 a 124, 131 y 162 a 166; para Media, los programas de
     10.º y de 11.º). Lo que es redacción nuestra está anotado en la
     cabecera de `contenido.js`: para qué sirve cada parte del libro, qué
     datos lleva cada ficha (sin orden obligatorio) y qué es cada texto
     de consulta.

   ► El libro de la ficha modelo («Un mundo que no se ve») no existe: se
     inventó para la misión, y la ficha lo dice. Los datos de la célula
     salen de la misión La Célula; los viajes de Colón, de
     `js/data/viajes-colon.js`; que los departamentos son dieciocho, de la
     misión Geografía de Honduras.

   ► Cada tema dice para qué grado es, igual que en la misión.

   ► Si una sección cambia de hoja, hay que corregir la `fuente` de las
     preguntas del banco nuevo de `contenido.js`, que cita la ficha por
     su página.
   ============================================================ */
const FICHA = {
  archivo: 'ficha-n4-leer-para-investigar',
  mision: 'Leer para investigar',
  asignatura: 'Español',
  nivel: 'III Ciclo y Bachillerato',
  tema: 'Las etapas de la lectura, las partes del libro, las fichas bibliográficas y hemerográficas, las técnicas de síntesis, el comentario crítico y los textos de consulta',
  qr: 'qr-mision-n4-leer-para-investigar.png',

  estilos: `
  /* La etiqueta del grado: lleva texto, no solo color. */
  .gr { display: inline-block; font-size: 8pt; font-weight: 700; padding: 0 6px; border-radius: 9px; border: 1px solid var(--materia); color: var(--materia-osc); background: #fff; margin-left: 4px; vertical-align: middle; white-space: nowrap; }
  h2 .gr { border-color: #fff; }
  /* Dos textos uno al lado del otro */
  .dos { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; text-align: left; }
  .dos > div { border-radius: 8px; padding: 7px 10px; font-size: 9.5pt; border: 1.5px solid var(--linea); background: #fff; }
  .dos b { display: block; font-size: 9.5pt; margin-bottom: 2px; color: var(--materia-osc); }
  /* La ficha modelo: una tarjeta con sus cinco datos */
  .tarjeta { border: 1.5px solid var(--materia); border-radius: 6px; padding: 6px 12px; margin: 6px 0; font-size: 10pt; background: #fff; break-inside: avoid; }
  .tarjeta b { color: var(--materia-osc); }
  /* La sinopsis: el título, la llave y lo que abarca */
  .llave { display: flex; align-items: center; gap: 6px; font-size: 9.5pt; text-align: left; }
  .llave .ll-t { font-weight: 800; color: var(--materia-osc); flex: 0 0 auto; }
  .llave .ll-s { font-size: 46pt; line-height: 1; font-weight: 300; color: var(--materia); flex: 0 0 auto; }
  /* El recuadro de Media */
  .media { border: 1.5px solid var(--materia); border-radius: 9px; padding: 7px 12px; margin: 6px 0; font-size: 10pt; background: var(--papel); break-inside: avoid; }
  .media b { color: var(--materia-osc); }
  /* La escena de los pareados */
  .historia { background: var(--papel); border: 1.5px dashed var(--linea); border-radius: 9px; padding: 7px 12px; margin: 6px 0; font-size: 10.5pt; break-inside: avoid; }
  .historia b { color: var(--materia-osc); }
  @media print { .dos > div, .tarjeta, .media, .historia, .gr { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,

  objetivos: [
    'Aplicar las <strong>tres etapas de la lectura</strong>: estructural o analítica, interpretativa y crítica o evaluativa.',
    'Reconocer las <strong>partes del libro</strong> y usar cada una para lo que sirve.',
    'Registrar las fuentes en <strong>fichas bibliográficas y hemerográficas</strong>, y decir de dónde salió cada dato.',
    'Sintetizar un texto con un <strong>resumen</strong>, una <strong>sinopsis</strong>, una tabla o un mapa conceptual, sin copiarlo.',
    'Escribir un <strong>comentario crítico</strong> (una opinión con razones) y usar los <strong>textos de consulta</strong>.'
  ],

  hojas: [
    /* ───────── Hoja 1 ───────── */
    [
      { objetivos: true },
      { h2: '🔎 1. Las tres etapas de la lectura <span class="gr">7.º</span><span class="gr">8.º</span><span class="gr">9.º</span>' },
      { html: `<div class="pasos">
      <div><span class="pn">1</span><b>🧱 Estructural o analítica</b>Conoces el libro por sus partes: portada, índice, títulos y subtítulos. Supones de qué tratará (prelectura): esa es tu predicción.</div>
      <div><span class="pn">2</span><b>💡 Interpretativa</b>Entiendes el contenido: lees, relees, desentrañas las ideas, seleccionas las que sirven y reflexionas.</div>
      <div><span class="pn">3</span><b>⚖️ Crítica o evaluativa</b>Haces la síntesis, evalúas lo leído y das tu juicio: una opinión razonada.</div>
    </div>` },
      { caja: 'idea', html: '💡 <b>Para leer mejor:</b> ten claro tu <strong>propósito</strong> (para qué lees). Usa la <strong>concentración</strong> (atención sin distraerte), la <strong>observación</strong> (leer con cuidado) y la <strong>memoria</strong> (retener las ideas). <strong>Relee</strong> por párrafos, subraya y <strong>toma notas</strong>. Si no conoces una palabra, búscala en el diccionario o fíjate en la frase donde aparece.' },
      { h2: '📕 2. Las partes del libro <span class="gr">7.º</span><span class="gr">8.º</span><span class="gr">9.º</span>' },
      { tabla: { cab: ['Parte', 'Para qué sirve'], filas: [
        ['📕 Portada', 'Dice el título, el autor y la editorial (la empresa que publica el libro). La contraportada es la cara de atrás.'],
        ['🧭 Índice', 'Dice en qué página empieza cada parte. Es lo primero que se revisa.'],
        ['🚪 Prólogo e introducción', 'Van antes del contenido. El prólogo presenta la obra (a veces lo escribe otra persona); la introducción anuncia de qué tratará.'],
        ['📖 Cuerpo', 'La parte más extensa: ahí se desarrolla el contenido, en capítulos numerados (8.º).'],
        ['🔤 Glosario', 'Lista de palabras difíciles con su significado, casi siempre al final (8.º).'],
        ['📚 Bibliografía', 'Lista de los libros y demás obras que se consultaron (8.º).'],
        ['📎 Anexo o apéndice', 'Guarda los cuadros, mapas o documentos que amplían lo que el libro dice.'],
        ['🏁 Epílogo', 'Texto que cierra la obra, después de su última parte (9.º).']
      ] } }
    ],

    /* ───────── Hoja 2 ───────── */
    [
      { h2: '🎯 3. Idea principal e ideas secundarias <span class="gr">7.º</span><span class="gr">8.º</span><span class="gr">9.º</span>', pegado: true },
      { p: 'Cada párrafo tiene una <strong>idea principal</strong>: la que dice lo más importante. Si la quitas, el párrafo deja de entenderse. Las <strong>ideas secundarias</strong> la explican o la amplían. Aquello de lo que trata todo el texto es su <strong>tema</strong>.' },
      { html: `<div class="ilus">
      <div class="ilus-t">Un párrafo, con su idea principal y sus ideas secundarias</div>
      <div class="dos">
        <div><b>🎯 Idea principal</b>«La feria del libro duró tres días».</div>
        <div><b>➕ Ideas secundarias</b>«El viernes llegaron las editoriales, el sábado hubo cuentacuentos y el domingo se premió al mejor lector».</div>
      </div>
    </div>` },
      { h2: '🗃️ 4. Las fichas: de dónde salió cada dato <span class="gr">7.º</span><span class="gr">8.º</span><span class="gr">9.º</span>' },
      { p: 'Quien investiga anota cada fuente <strong>en el momento en que la consulta</strong>. Así puede decir después de dónde tomó la información y, al final, armar la <strong>bibliografía</strong> de su trabajo. Las fichas se guardan en orden en un <strong>fichero</strong> (una caja o un mueble).' },
      { tabla: { k: 'normal', cab: ['Ficha', 'Qué registra', 'Qué datos lleva'], filas: [
        ['📚 Bibliográfica (7.º)', 'Un libro.', 'Autor, título, editorial, lugar y año de publicación.'],
        ['📰 Hemerográfica (8.º y 9.º)', 'Un artículo de periódico o de revista.', 'Nombre del periódico o de la revista, fecha, título del artículo, autor y página.']
      ] } },
      { html: '<div class="tarjeta">🗃️ <b>La ficha de un libro inventado</b> (este libro no existe: es un ejemplo). <b>Autora:</b> Zelaya, Marta Lidia. <b>Título:</b> Un mundo que no se ve. <b>Editorial:</b> Ediciones Pupitre. <b>Lugar:</b> Tegucigalpa. <b>Año:</b> 2024. El orden de los datos y los signos entre uno y otro te los indicará tu docente.</div>' },
      { h3: '🗂️ Fichas de trabajo: lo que sacas de la lectura' },
      { tabla: { k: 'normal', cab: ['Ficha de…', 'Qué anotas', 'Ejemplo'], filas: [
        ['❝ Cita textual', 'Las palabras exactas del autor, entre comillas y diciendo de quién son.', '«Así se descubrió la célula» (Zelaya, página 9).'],
        ['🖍️ Resumen textual', 'Las ideas fundamentales, subrayadas después de entenderlas.', 'Hooke observó un trozo de corcho. Los llamó celdas.'],
        ['🗣️ Resumen parafraseado', 'Lo subrayado, ordenado y dicho con tus propias palabras.', 'Hooke miró corcho con un microscopio y a los huequitos que halló les puso celdas.'],
        ['💬 Comentario personal', 'Lo que tú piensas sobre lo leído.', 'Me parece claro, porque compara el corcho con un panal.']
      ] } },
      { caja: 'regla', html: '⚡ <b>Citar es decir de quién es.</b> La cita bibliográfica puede ir <strong>al pie de la página o dentro del texto</strong>. Copiar un párrafo sin decir de quién es no es investigar: es presentar como tuyo el trabajo de otra persona. Las fichas de trabajo sirven para <strong>jerarquizar</strong> la información: ordenar las ideas de la más importante a la menos importante.' }
    ],

    /* ───────── Hoja 3 ───────── */
    [
      { h2: '✂️ 5. Técnicas de síntesis <span class="gr">7.º</span><span class="gr">8.º</span><span class="gr">9.º</span>', pegado: true },
      { p: 'Sintetizar es quedarte con <strong>lo fundamental</strong> de un texto. Además del resumen están la <strong>sinopsis</strong>, que ordena las ideas con llaves; el <strong>mapa conceptual</strong>, que une conceptos con líneas y palabras de enlace; la <strong>tabla</strong>, y la <strong>gráfica</strong>, que con barras o líneas deja comparar cantidades.' },
      { html: `<div class="ilus">
      <div class="ilus-t">Los mismos datos, en una tabla y en una sinopsis (la tabla de los viajes)</div>
      <div class="dos">
        <div><b>🔢 Tabla</b>1.º · 1492 · unas islas del Caribe<br>2.º · 1493 · las islas del Caribe<br>3.º · 1498 · la costa de Sudamérica<br>4.º · 1502 · las Islas de la Bahía y la costa norte de Honduras</div>
        <div><b>🗝️ Sinopsis</b><span class="llave"><span class="ll-t">Viajes<br>de Colón</span><span class="ll-s">{</span><span>1492<br>1493<br>1498<br>1502</span></span></div>
      </div>
    </div>` },
      { caja: 'truco', html: '🧠 <b>Truco para resumir:</b> un resumen queda <strong>más corto</strong> que el texto y <strong>no cambia</strong> lo que dijo el autor. Si al releerlo dice otra cosa que el original, no es un resumen. <b>Esquemas y planes:</b> antes de escribir tu trabajo, ordena en un <strong>esquema</strong> los temas y subtemas.' },
      { h2: '💬 6. El comentario crítico <span class="gr">8.º</span>' },
      { p: 'Un <strong>comentario crítico</strong> da tu opinión sobre lo leído y la sostiene con razones: cada razón es un <strong>argumento</strong>. Puedes estar de acuerdo o <strong>en desacuerdo</strong> con el autor, pero dices por qué. Separa el <strong>hecho</strong> (lo que pasó y se puede comprobar) de la opinión (lo que alguien piensa sobre eso), y fíjate en la actitud del autor: es <strong>objetiva</strong> si solo presenta datos, y subjetiva si da su parecer.' },
      { caja: 'idea', html: '💡 <b>Resumen:</b> «El texto cuenta cómo Hooke descubrió la célula». <b>Comentario:</b> «Me parece claro, porque compara el corcho con un panal; pero le falta un dibujo».' },
      { h2: '📗 7. Textos de consulta e investigación fuera del libro <span class="gr">9.º</span>' },
      { tabla: { k: 'normal', cab: ['Texto de consulta', 'Qué te da'], filas: [
        ['🔤 Diccionario', 'El significado de las palabras, en orden alfabético. El de sinónimos y antónimos da palabras que dicen lo mismo o lo contrario. El especializado (8.º), solo el vocabulario de un campo.'],
        ['📚 Enciclopedia', 'Artículos sobre muchos asuntos distintos.'],
        ['🗺️ Atlas', 'Mapas: te dice dónde queda cada lugar.']
      ] } },
      { caja: 'hn', html: '🌐 <b>Fuera del libro</b> también se investiga: en <strong>periódicos</strong>, <strong>revistas</strong>, <strong>folletos</strong> (pocas hojas sobre un solo asunto), en internet y con una <strong>entrevista</strong>. Oriéntate con cinco preguntas: ¿qué?, ¿dónde?, ¿cuándo?, ¿cómo? y ¿por qué? Si un dato no dice quién lo afirma, búscalo donde sí se diga.' },
      { html: '<div class="media">🎓 <b>Para Media (10.º y 11.º):</b> en 10.º se estudian la lectura y sus técnicas y se cita con las <strong>Normas APA</strong> (7.ª edición). En 11.º se escriben <strong>reportes de lectura</strong>, comentarios y síntesis. El formato de esas normas te lo dará tu docente.</div>' }
    ],

    /* ───────── Hoja 4: la práctica ───────── */
    [
      { h2: '✍️ 8. ¡Ponte a Prueba! Actividades' },
      { practica: 'completar' },
      { practica: 'vf' },
      { practica: 'seleccion', hasta: 2 }
    ],

    /* ───────── Hoja 5 ───────── */
    [
      { practica: 'seleccion', desde: 3 }
    ],

    /* ───────── Hoja 6 ───────── */
    [
      { practica: 'pareados' },
      { felicitacion: true },
      { rubrica: true }
    ]
  ],

  practica: {
    completar: [
      { q: 'En las últimas páginas de su libro, Dania halló una lista que explica «tejido» y «órgano»: es el ___.', a: 'glosario', ensaya: 'cp-glosario' },
      { q: 'Kevin leyó una noticia el domingo y la registró en una ficha ___.', a: 'hemerográfica', ensaya: 'cp-hemerografica' },
      { q: 'Hojear un libro para ver cómo está armado es la etapa estructural o ___.', a: 'analítica', ensaya: 'cp-analitica' },
      { q: 'En «El río creció. Llovió toda la noche y el agua tapó el puente», las dos últimas oraciones dan detalles: son ideas ___.', a: 'secundarias', ensaya: 'cp-secundarias' },
      { q: 'Antes del primer capítulo, una maestra presenta la obra en dos páginas: eso es el ___.', a: 'prólogo', ensaya: 'cp-prologo' },
      { q: 'Leíste un capítulo y lo contaste en cinco renglones, a tu manera: hiciste un resumen ___.', a: 'parafraseado', ensaya: 'cp-parafraseado' },
      { q: 'En el aula hay un libro grande que trae, uno por página, los mapas de los dieciocho departamentos: es un ___.', a: 'atlas', ensaya: 'cp-atlas' },
      { q: 'Si escribes: Según Zelaya, «toda célula proviene de otra célula», hiciste una cita ___.', a: 'textual', ensaya: 'cp-textual' },
      { q: 'Al terminar su informe, Keyla puso la lista de los libros que consultó: es la ___.', a: 'bibliografía', ensaya: 'cp-bibliografia' },
      { q: 'Marlon escribió «Viajes de Colón», abrió una llave y dentro puso los cuatro años: hizo una ___.', a: 'sinopsis', ensaya: 'cp-sinopsis' }
    ],
    vf: [
      { q: 'Para saber en qué página empieza el capítulo 3 hay que leer el libro entero.', a: false, ensaya: 'tf-indice' },
      { q: 'Un periódico o una revista también pueden servir de fuente para una investigación.', a: true, ensaya: 'tf-solo-libros' },
      { q: 'En el resumen textual se subraya todo el texto, renglón por renglón.', a: false, ensaya: 'tf-resumen-textual' },
      { q: 'Si a un párrafo le quitas su idea principal, deja de entenderse de qué trata.', a: true, ensaya: 'tf-idea-quitar' },
      { q: '«No me gustó», y nada más, ya es un buen comentario crítico.', a: false, ensaya: 'tf-comentario' },
      { q: 'En un diccionario, «casa» va antes que «cielo»: el orden es alfabético.', a: true, ensaya: 'tf-diccionario-orden' },
      { q: 'Quién escribió un libro es algo que suele verse en su portada.', a: true, ensaya: 'tf-portada' },
      { q: 'Cuando usas las palabras de un autor, lo honrado es decir de quién son.', a: true, ensaya: 'tf-copiar-sin-citar' },
      { q: 'En la etapa interpretativa basta con mirar los dibujos, sin entender el texto.', a: false, ensaya: 'tf-interpretativa' },
      { q: 'Una tabla solo sirve en Matemáticas: nunca ayuda a resumir un texto.', a: false, ensaya: 'tf-tabla' }
    ],
    seleccion: [
      { q: 'Al final de un libro de Historia hay copias de cartas antiguas y dos planos que amplían lo explicado. ¿Cómo se llama esa parte?', o: ['la dedicatoria del autor', 'el lomo', 'el anexo o apéndice', 'el forro de plástico'], a: 2, ensaya: 'mc-anexo' },
      { q: 'En la ficha de un libro lees «Tegucigalpa, 2024». ¿Qué datos son esos?', o: ['el lugar y el año de publicación', 'el precio de venta y el peso del libro', 'el número de páginas', 'el color de la pasta'], a: 0, ensaya: 'mc-ficha-anio' },
      { q: 'Josué quiere leer un artículo corto sobre los mayas y otro sobre los planetas, los dos en la misma obra. ¿Dónde los busca?', o: ['en un directorio telefónico', 'en una enciclopedia', 'en un calendario de pared', 'en un recibo'], a: 1, ensaya: 'mc-enciclopedia' },
      { q: 'Dania terminó el libro y escribió: «No estoy de acuerdo con el final, porque…». ¿En qué etapa de la lectura está?', o: ['en la de hojear', 'en la de buscar el libro en el estante', 'en ninguna', 'en la crítica o evaluativa'], a: 3, ensaya: 'mc-evaluativa' },
      { q: 'En tu resumen repetiste «importante» seis veces. ¿Qué te da otras palabras que digan lo mismo?', o: ['el horario de clases de todo el instituto', 'el directorio', 'el diccionario de sinónimos y antónimos', 'la agenda'], a: 2, ensaya: 'mc-sinonimos' },
      { q: 'Un video dice que «los científicos» descubrieron algo, pero no dice cuáles ni dónde se publicó. ¿Qué haces antes de usar ese dato?', o: ['lo copio tal cual', 'lo pongo en mi trabajo sin decir a nadie de dónde salió', 'le cambio dos palabras', 'lo busco en otra fuente que diga quién lo afirma'], a: 3, ensaya: 'mc-fuente-dudosa' },
      { q: 'Lee: «El huerto del grado dio su primera cosecha. Salieron rábanos, cilantro y unos tomates pequeños». ¿Cuál es la idea principal?', o: ['salieron rábanos', 'el huerto del grado dio su primera cosecha', 'los tomates eran pequeños', 'también salió cilantro'], a: 1, ensaya: 'mc-idea-principal' },
      { q: 'En un libro ves un numerito junto a una frase y, abajo de la hoja, el autor y la obra de donde se tomó. ¿Qué es eso?', o: ['una cita bibliográfica al pie de página', 'un adorno que la imprenta puso para llenar el espacio', 'una errata', 'el precio'], a: 0, ensaya: 'mc-cita-pie' },
      { q: 'Tu equipo va a investigar sobre el mercado de tu comunidad. ¿Con qué conviene empezar?', o: ['con el dibujo de la carátula', 'con pasar todo el trabajo en limpio y ponerle su carátula', 'con hacerse preguntas como ¿qué?, ¿dónde? y ¿por qué?', 'con el título en colores'], a: 2, ensaya: 'mc-preguntas' },
      { q: 'El índice de una novela dice: «1. La llegada · 2. El viaje · 3. El regreso». ¿Qué son esas tres divisiones?', o: ['tres ilustradores', 'tres capítulos', 'tres dedicatorias', 'tres forros'], a: 1, ensaya: 'mc-capitulos' }
    ],
    /* Pareados de aplicar: el término se une con lo que pasa en la escena.
       El examen lo une con su definición. */
    pareados: {
      intro: '<div class="historia"><b>Lee esta escena:</b> Sara entra a la sala donde su centro guarda y presta los libros, y toma uno. Antes de abrirlo dice: «Seguro trata de volcanes». Le da vuelta y lee lo que trae por detrás. En la primera hoja ve «Ediciones Pupitre». Empieza por las páginas donde la autora anuncia de qué hablará. En el capítulo 2 hay un dibujo de barras que compara la altura de cuatro volcanes. Sara pasa su lápiz por debajo de lo que más importa. Antes de escribir su trabajo anota: «1. Qué es un volcán. 2. Sus partes. 3. Volcanes de Centroamérica». Lee el texto con que la autora cierra la obra. Y al terminar escribe: «El libro es claro, porque trae ejemplos, pero le faltan fotos».</div>',
      columnaA: 'Columna A',
      columnaB: 'Columna B: lo que se ve o se hace en la escena',
      anchoA: '30%',
      pares: [
        { term: 'Biblioteca', def: 'La sala donde Sara toma el libro', ensaya: 'pr-biblioteca' },
        { term: 'Predicción', def: '«Seguro trata de volcanes»', ensaya: 'pr-prediccion' },
        { term: 'Contraportada', def: 'Lo que Sara lee al darle vuelta al libro', ensaya: 'pr-contraportada' },
        { term: 'Editorial', def: '«Ediciones Pupitre»', ensaya: 'pr-editorial' },
        { term: 'Introducción', def: 'Las páginas donde la autora anuncia de qué hablará', ensaya: 'pr-introduccion' },
        { term: 'Gráfica', def: 'El dibujo de barras del capítulo 2', ensaya: 'pr-grafica' },
        { term: 'Subrayado', def: 'Lo que deja el lápiz de Sara bajo lo que más importa', ensaya: 'pr-subrayado' },
        { term: 'Esquema', def: '«1. Qué es un volcán. 2. Sus partes. 3. Volcanes de Centroamérica»', ensaya: 'pr-esquema' },
        { term: 'Epílogo', def: 'El texto con que la autora cierra la obra', ensaya: 'pr-epilogo' },
        { term: 'Juicio', def: '«El libro es claro, porque trae ejemplos, pero le faltan fotos»', ensaya: 'pr-juicio' }
      ]
    }
  },

  felicitacion: '🏅 <b>¡Felicidades! Has completado la Misión Leer para investigar.</b> Ahora sabes que un libro se conoce por sus partes antes de leerlo, que cada dato se busca en su lugar y que una fuente se anota en su ficha en cuanto se consulta. Sabes resumir con tus propias palabras, ordenar las ideas en una sinopsis o en una tabla y dar tu opinión con razones. Y sabes lo más importante: investigar no es copiar, es entender, decirlo a tu manera y decir siempre de dónde salió.',

  rubrica: {
    filas: [
      ['Copió los contenidos de este material en su cuaderno de Español.', 'Tarea en el hogar'],
      ['Resolvió la sección «Ponte a Prueba» directamente en esta ficha.', 'Tarea en el aula, un día antes del examen'],
      ['Hizo la ficha de un libro de su casa, con un resumen de cinco renglones y su comentario.', 'Tarea en el hogar'],
      ['Prueba impresa realizada en el aula.', 'Evaluación en el aula']
    ],
    nota: 'Recuerde que ya aprendió a sacar el promedio: sume el total del valor obtenido y divídalo entre cuatro. El resultado será su nota final. Perderá puntos si no completa el trabajo, si su letra no es legible o si escribe con faltas de ortografía.'
  },

  notaDocente: 'esta ficha está basada en el contenido interactivo de la plataforma M.E.T.A.S «Misión Leer para investigar» (III Ciclo y Bachillerato; primer parcial, febrero y marzo). Cada tema lleva señalado su grado según la programación mensual de Español de 7.º a 9.º; el recuadro «Para Media» es para 10.º y 11.º. La sección «Ponte a Prueba» <strong>no es el examen</strong>: ensaya los mismos datos que la prueba de la plataforma (completar, verdadero o falso, selección múltiple y pareados) con otras preguntas, para que el alumno practique sin haber visto la hoja que se le va a evaluar. El libro de la ficha modelo no existe: se inventó como ejemplo. La ficha enseña qué datos lleva cada ficha, no un orden obligatorio: use el formato que usted pide en su clase. Para la evaluación final imprima la prueba desde la plataforma, que genera formas distintas con su pauta.'
};
