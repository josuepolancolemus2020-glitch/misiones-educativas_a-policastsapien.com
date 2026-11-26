/* ============================================================
   M.E.T.A.S · Misión El periódico y los textos de todos los días · el bloque de su ficha
   ------------------------------------------------------------
   De aquí saldrá `fichas/ficha-n3-periodico.html`. La arma
   `node _dev/arma-ficha.js 3ciclo-n3-periodico`; la ficha no se
   edita a mano. La forma del bloque está en `_privado/PLANTILLA-FICHAS.md`.

   ► TODAVÍA NO ESTÁ ARMADA, y es a propósito: la ficha impresa, su QR
     (`img/qr-mision-n3-periodico.png`) y el enlace desde la misión se
     hacen cuando la misión entra al catálogo. Mientras tanto las sondas
     la arman en la memoria y le exigen lo mismo que a una armada.

   ► La página de la misión NO carga este archivo: el alumno no lo
     descarga. Solo lo lee el armador.

   ► LA PRÁCTICA NO ES EL EXAMEN. Cada pregunta de «Ponte a Prueba»
     ensaya un dato que el examen pregunta (`ensaya` es la `k` de ese
     dato en `contenido.js`), pero con otra pregunta:
       · otro ejemplo para la misma idea (otra noticia, otra carta);
       · el verdadero o falso vuelto del revés;
       · pareados de aplicar: el término se une con lo que pasa en una
         escena corta (el domingo de Marlon), no con su definición.
     Lo vigila `_dev/verifica-ficha-no-copia-examen.js`.
     Las 40 ensayan, una por una, las 40 del banco de las formas 1 a 30
     (los cuatro bancos de siempre de `contenido.js`), que son las que el
     alumno tiene más cerca: ninguna se queda sin su práctica.

   ► De dónde sale lo que afirma: de las mismas fuentes que la misión
     (la programación de 7.º a 9.º, PDF pp. 7, 15 y 23, y el DCNB, pp. 92,
     93, 96 a 98, 116, 125 a 127, 132, 133, 135, 166, 168, 169 y 172;
     para Media, los programas de 11.º). Lo que es redacción nuestra
     (qué es un periódico, una noticia, un titular, una sección, un
     hecho, una fuente, un editorial, un reglamento, y qué nombra una
     carta de venta) está anotado en la cabecera de `contenido.js`.

   ► Todo ejemplo (noticias, cartas, actas, nombres, cifras de la
     tabla) es inventado para la misión, menos los datos de la Reserva
     del Río Plátano, la alerta temprana y COPECO, que salen de las
     misiones que los acreditan.

   ► Cada tema dice para qué grado es, igual que en la misión.
   ============================================================ */
const FICHA = {
  archivo: 'ficha-n3-periodico',
  mision: 'El periódico y los textos de todos los días',
  asignatura: 'Español',
  nivel: 'III Ciclo y Bachillerato',
  tema: 'El periódico y la noticia, el hecho y la opinión, las cartas (personal, de lector y de venta), el acta, el reglamento y el informe interpretativo',
  qr: 'qr-mision-n3-periodico.png',

  estilos: `
  /* La etiqueta del grado: lleva texto, no solo color. */
  .gr { display: inline-block; font-size: 8pt; font-weight: 700; padding: 0 6px; border-radius: 9px; border: 1px solid var(--materia); color: var(--materia-osc); background: #fff; margin-left: 4px; vertical-align: middle; white-space: nowrap; }
  h2 .gr { border-color: #fff; }
  /* Dos textos, uno al lado del otro */
  .dos { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; text-align: left; }
  .dos > div { border-radius: 8px; padding: 7px 10px; font-size: 9.5pt; border: 1.5px solid var(--linea); background: #fff; }
  .dos b { display: block; font-size: 9.5pt; margin-bottom: 2px; color: var(--materia-osc); }
  /* El recuadro de Media */
  .media { border: 1.5px solid var(--materia); border-radius: 9px; padding: 7px 12px; margin: 6px 0; font-size: 10pt; background: var(--papel); break-inside: avoid; }
  .media b { color: var(--materia-osc); }
  /* La escena de los pareados */
  .historia { background: var(--papel); border: 1.5px dashed var(--linea); border-radius: 9px; padding: 7px 12px; margin: 6px 0; font-size: 10.5pt; break-inside: avoid; }
  .historia b { color: var(--materia-osc); }
  @media print { .dos > div, .media, .historia, .gr { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`,

  objetivos: [
    'Reconocer el <strong>periódico</strong>, sus <strong>secciones</strong> y sus <strong>titulares</strong>, y leer una <strong>noticia</strong> con sus seis preguntas.',
    'Distinguir un <strong>hecho</strong> de una <strong>opinión</strong> y reconocer la <strong>postura</strong> y la <strong>línea editorial</strong> de un periódico.',
    'Escribir una <strong>carta personal</strong> y una <strong>carta de lector</strong>, y reconocer la <strong>carta de venta</strong>.',
    'Redactar un <strong>acta</strong> con sus partes y un <strong>reglamento</strong> por artículos.',
    'Reconocer las partes de un <strong>informe interpretativo</strong> y para qué sirve cada una.'
  ],

  hojas: [
    /* ───────── Hoja 1 ───────── */
    [
      { objetivos: true },
      { h2: '📰 1. El periódico <span class="gr">7.º</span><span class="gr">8.º</span><span class="gr">9.º</span>' },
      { p: 'Un <strong>periódico</strong> es una publicación que <strong>sale cada cierto tiempo</strong>, cada día o cada semana, con noticias y otros textos. Lo escriben los <strong>periodistas</strong>, que buscan la información y redactan las noticias. También lo pueden hacer los alumnos: el <strong>periódico escolar</strong>, con el aporte de toda la clase, y el <strong>periódico mural</strong>, que se pega en una pared de la escuela. Trae además <strong>entrevistas</strong> (alguien pregunta y una persona invitada responde) y <strong>fotografías</strong>, que también informan; debajo de cada una va su <strong>pie de foto</strong>, un texto breve que explica la imagen.' },
      { tabla: { cab: ['Sección <span class="gr">9.º</span>', 'Qué trae'], filas: [
        ['🗞️ Noticias', 'Lo que acaba de pasar.'],
        ['💬 Opinión', 'El editorial y las cartas de los lectores.'],
        ['⚽ Deportes', 'Partidos, torneos y marcadores.'],
        ['🎭 Cultura', 'Música, teatro, danza, libros y fiestas.'],
        ['📋 Clasificados', 'Anuncios breves de quien vende, compra o busca algo.']
      ] } },
      { h2: '🗞️ 2. La noticia y sus seis preguntas <span class="gr">8.º</span>' },
      { caja: 'regla', html: '⚡ <b>La noticia</b> informa de un hecho reciente y responde seis preguntas: <strong>¿qué?</strong> (lo que pasó), <strong>¿quién?</strong>, <strong>¿cuándo?</strong>, <strong>¿dónde?</strong>, <strong>¿cómo?</strong> y <strong>¿por qué?</strong> Se arma con tres piezas, en este orden: <strong>titular</strong> (el título, en letras grandes), <strong>encabezado</strong> (el primer párrafo, con lo más importante) y <strong>cuerpo</strong> (los detalles).' },
      { caja: 'idea', html: '💡 <b>Dos cuidados:</b> una buena noticia dice de dónde salió la información, es decir, su <strong>fuente</strong> («informó la dirección»). Y su titular dice lo mismo que el texto: no promete lo que la noticia no cuenta.' }
    ],

    /* ───────── Hoja 2 ───────── */
    /* La minidemostración de la noticia abre esta hoja: en la primera no
       cabía sin pasarse del alto del papel. */
    [
      { h3: '🔬 Minidemostración: el rumor y la noticia (viene de la sección 2)' },
      { html: `<div class="ilus">
      <div class="ilus-t">En el instituto corre una frase. Al día siguiente, el periódico mural publica otra. Hablan de lo mismo: lo que cambia es lo que cada una deja saber. (La historia es inventada.)</div>
      <div class="dos">
        <div><b>🗣️ El rumor</b>«Dicen que el viernes no hay clases». Nadie sabe quién lo dijo primero.</div>
        <div><b>🗞️ La noticia</b>«El viernes habrá clases normales, informó ayer la dirección». Dice qué, cuándo y quién lo informa.</div>
      </div>
    </div>` },
      { h2: '⚖️ 3. Hecho y opinión <span class="gr">7.º</span><span class="gr">8.º</span><span class="gr">9.º</span>' },
      { tabla: { cab: ['', 'Qué es', 'Ejemplo'], filas: [
        ['📰 Hecho', 'Algo que PASÓ y se puede comprobar: contando, midiendo o preguntando.', '«Llovió tres días seguidos».'],
        ['💬 Opinión', 'Lo que UNA PERSONA PIENSA sobre algo que pasó.', '«Fue el peor invierno que recuerdo».']
      ] } },
      { caja: 'idea', html: '💡 <b>Cada cosa en su lugar:</b> en la noticia van los hechos, contados con <strong>objetividad</strong> (tal como fueron, sin inclinarse por nadie). La opinión va en otros textos, como el editorial y la carta de lector.' },
      { caja: 'regla', html: '⚡ <b>La línea editorial</b> <span class="gr">9.º</span> Dos periódicos pueden contar el mismo hecho y comentarlo distinto. La posición de un periódico ante un problema es su <strong>postura</strong>, y las ideas que defiende una y otra vez forman su <strong>línea editorial</strong>. Se lee en el <strong>editorial</strong>, un texto de opinión razonada que no lleva firma: habla el periódico.' },
      { caja: 'truco', html: '🧠 <b>Tipo de lectores</b> <span class="gr">9.º</span> Cada periódico, y cada sección, se escribe pensando en quién lo va a leer: una página de adivinanzas y dibujos para colorear es para niños; los Clasificados, para quien quiere comprar o vender.' },
      { caja: 'idea', html: '🔢 <b>La tabla de una noticia también se lee.</b> Árboles sembrados (datos inventados): séptimo, 25; octavo, 40; noveno, 35. ¿Quién sembró más? Octavo. ¿Cuántos entre los tres? 25 + 40 + 35 = 100.' },
      { h2: '✉️ 4. Tres cartas distintas' },
      { caja: 'regla', html: '⚡ <b>En toda carta</b> hay un <strong>remitente</strong> (quien la escribe y la envía), un <strong>destinatario</strong> (quien la recibe) y un <strong>asunto</strong> (aquello de lo que trata). Sus partes: <strong>lugar y fecha, saludo, cuerpo</strong> (donde va el mensaje), <strong>despedida y firma</strong>.' },
      { tabla: { k: 'normal', cab: ['Carta', 'A quién va y cómo es', 'Grado'], filas: [
        ['💌 Personal', 'A alguien cercano: un familiar o un amigo. Estilo espontáneo; lenguaje sincero, afectivo y sencillo.', '7.º y 8.º'],
        ['📮 De lector', 'A un periódico, a una revista o a un autor. Das tu valoración (si te pareció bien o mal lo que leíste), tu punto de vista, una crítica o una sugerencia, con razones, con respeto y con un tono más formal.', '8.º'],
        ['🐄 De venta', 'Documento legal que deja constancia de una venta, por ejemplo de ganado. Nombra al vendedor (entrega el animal y recibe el dinero), al comprador (paga y se queda con él) y lo que se vende, y lleva las firmas.', '8.º']
      ] } }
    ],

    /* ───────── Hoja 3 ───────── */
    [
      { h2: '📝 5. El acta <span class="gr">8.º</span>', pegado: true },
      { p: 'El <strong>acta</strong> es el documento que <strong>registra todo lo sucedido, tratado y acordado en una reunión</strong>. La redacta el <strong>secretario</strong> a medida que la reunión se desarrolla, no después.' },
      { tabla: { cab: ['Parte', 'Qué dice'], filas: [
        ['1. Número', 'Cada acta lleva el suyo, para saber cuál fue primero.'],
        ['2. Lugar, hora y fecha', 'Dónde y cuándo se reunieron.'],
        ['3. Asistentes y ausentes', 'La lista de quienes llegaron y la de quienes no.'],
        ['4. Orden del día', 'La lista de los puntos que se van a tratar.'],
        ['5. Relato y acuerdos', 'Lo que se trató y lo que el grupo decidió.'],
        ['6. Cierre', 'La hora en que terminó y las firmas del secretario y de quien presidió.']
      ] } },
      { caja: 'idea', html: '💡 <b>Cómo se escribe:</b> con <strong>fidelidad</strong> (lo que pasó, tal como pasó, le guste o no a quien escribe), <strong>objetividad</strong> y <strong>exactitud</strong> (las horas, los días y los nombres, sin equivocaciones).' },
      { h2: '📜 6. El reglamento <span class="gr">9.º</span>' },
      { p: 'Un <strong>reglamento</strong> es un conjunto ordenado de reglas que un grupo se da <strong>para funcionar mejor</strong>. Cada regla es una <strong>norma</strong> que todo el grupo se compromete a cumplir; va numerada y se llama <strong>artículo</strong>. El reglamento de tu grado se apega al reglamento de toda la escuela: no lo puede contradecir.' },
      { caja: 'hn', html: '🇭🇳 <b>Como las leyes:</b> la Constitución de la República también se cita por artículos («artículo 162»). En tu aula: <strong>Artículo 1.</strong> Llegamos puntuales. <strong>Artículo 2.</strong> Pedimos la palabra antes de hablar.' },
      { h2: '📊 7. El informe interpretativo <span class="gr">7.º</span>' },
      { p: 'No solo narra hechos: los <strong>interpreta y analiza</strong> para sacar conclusiones y dar recomendaciones. Antes de escribirlo se hace un <strong>cronograma</strong> (un calendario con las etapas de la investigación) y se busca información sobre el tema.' },
      { tabla: { cab: ['Parte', 'Para qué sirve'], filas: [
        ['1. Carátula', 'La primera hoja: título y autores.'],
        ['2. Índice', 'Dice en qué página empieza cada apartado.'],
        ['3. Introducción', 'Presenta el tema.'],
        ['4. Cuerpo', 'Los datos y su análisis.'],
        ['5. Conclusiones y 6. Recomendaciones', 'Lo que se saca en claro y lo que el informe aconseja hacer.'],
        ['7. Bibliografía', 'Lista de los libros consultados.']
      ] } },
      { html: '<div class="media">🎓 <b>Para Media (11.º):</b> el programa del Bachillerato Técnico Profesional estudia el <strong>género periodístico</strong> (la prensa en Honduras) y los documentos comerciales: <strong>la carta comercial, el acta, el comunicado, el aviso y la circular</strong>. El del Bachillerato en Ciencias y Humanidades, <strong>la prensa</strong> y la redacción de comunicados, avisos y correspondencia (tu docente te dará el formato de cada uno).</div>' }
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
      { q: 'Dania le escribe a su tío y lleva la carta al correo: en esa carta, Dania es la ___.', a: 'remitente', ensaya: 'cp-remitente' },
      { q: '«Ese desfile estuvo aburrido» no se puede comprobar: es una ___.', a: 'opinión', ensaya: 'cp-opinion' },
      { q: 'Al empezar la reunión se pasó lista y se anotaron en el acta los 28 ___ que estaban en el aula.', a: 'asistentes', ensaya: 'cp-asistentes' },
      { q: 'La asamblea votó y decidió hacer la rifa el viernes: ese y los demás ___ quedaron en el acta.', a: 'acuerdos', ensaya: 'cp-acuerdos' },
      { q: 'En el periódico de Kevin, los marcadores van en unas páginas y los anuncios en otras: son dos ___ distintas.', a: 'secciones', ensaya: 'cp-secciones' },
      { q: 'El equipo analizó sus datos y, al final del informe, escribió lo que sacó en claro: sus ___.', a: 'conclusiones', ensaya: 'cp-conclusiones' },
      { q: '«Reparan el puente de la aldea» encabeza un texto que informa de algo que acaba de pasar: una ___.', a: 'noticia', ensaya: 'cp-noticia' },
      { q: 'Un periódico dio su opinión sobre la tala: está en contra. Esa posición ante un solo problema es su ___.', a: 'postura', ensaya: 'cp-postura' },
      { q: 'En la carta de Óscar, la parte más larga, donde cuenta todo lo que quiere decir, es el ___.', a: 'cuerpo', ensaya: 'cp-cuerpo' },
      { q: 'Los alumnos de séptimo pegaron sus textos en la pared del pasillo: hicieron un periódico ___.', a: 'mural', ensaya: 'cp-mural' }
    ],
    vf: [
      { q: 'La noticia cuenta lo que pasó; lo que piensa quien la escribe no va en ella.', a: true, ensaya: 'tf-noticia-opina' },
      { q: 'El acta se puede redactar de memoria, varios días después de la reunión.', a: false, ensaya: 'tf-acta-durante' },
      { q: 'Una carta personal se escribe con palabras frías y distantes, como un trámite.', a: false, ensaya: 'tf-personal-lenguaje' },
      { q: 'Todos los periódicos comentan un mismo suceso exactamente igual.', a: false, ensaya: 'tf-dos-periodicos' },
      { q: 'Una carta de venta no tiene ningún valor ante la ley.', a: false, ensaya: 'tf-venta-legal' },
      { q: '«El aula tiene treinta pupitres» es un hecho: basta contarlos para comprobarlo.', a: true, ensaya: 'tf-doce-aulas' },
      { q: 'En un informe interpretativo, además de contar lo sucedido, se analiza.', a: true, ensaya: 'tf-informe-narra' },
      { q: 'El reglamento de un grado tiene que respetar el reglamento de toda la escuela.', a: true, ensaya: 'tf-reglamento-escuela' },
      { q: 'El periódico ordena sus textos por temas para que el lector encuentre lo que busca.', a: true, ensaya: 'tf-revueltos' },
      { q: 'La carta de lector solo se le puede mandar a un familiar.', a: false, ensaya: 'tf-lector-destino' }
    ],
    seleccion: [
      { q: '«Lluvias dejan sin paso el camino a la aldea», en letras grandes y encima del texto, es…', o: ['la despedida', 'el titular', 'el asunto', 'el índice'], a: 1, ensaya: 'mc-titular' },
      { q: '«La feria de ciencias se hizo el martes en el salón de actos». ¿Qué pregunta responde «en el salón de actos»?', o: ['¿dónde?', '¿quién?', '¿cuándo?', '¿por qué?'], a: 0, ensaya: 'mc-donde' },
      { q: 'Quieres saber cómo quedó el partido de baloncesto de anoche. En el periódico lo buscas en…', o: ['Cultura', 'Opinión', 'Deportes', 'Clasificados'], a: 2, ensaya: 'mc-deportes' },
      { q: 'La directiva de padres se reunió anoche y quiere que quede constancia de todo lo tratado. Para eso sirve…', o: ['un reportaje', 'un clasificado', 'un titular', 'un acta'], a: 3, ensaya: 'mc-acta-sirve' },
      { q: 'Tu mejor amigo se mudó a otra ciudad y quieres contarle cómo va el huerto de la escuela. Le escribes…', o: ['un editorial', 'una receta', 'una carta personal', 'un informe'], a: 2, ensaya: 'mc-carta-personal' },
      { q: '¿Cuál de estas frases es una opinión?', o: ['«La cancha mide 28 metros»', '«La cancha es la más fea del barrio»', '«La cancha se pintó en marzo»', '«La cancha tiene dos aros»'], a: 1, ensaya: 'mc-opinion' },
      { q: 'En un periódico hay un texto sin nombre de autor que dice lo que ese periódico piensa sobre la falta de agua. Ese texto es…', o: ['el horóscopo', 'la carta de venta', 'el crucigrama', 'el editorial'], a: 3, ensaya: 'mc-editorial' },
      { q: 'El equipo de fútbol del instituto quiere dejar claro, regla por regla, cómo se entrena y qué pasa si alguien falta. Necesita…', o: ['un reglamento', 'un reportaje', 'un clasificado', 'un pie de foto'], a: 0, ensaya: 'mc-reglamento' },
      { q: 'Keyla le manda una carta a su abuelo. El abuelo, que la va a recibir, es…', o: ['el testigo', 'el cartero', 'el destinatario', 'el vendedor'], a: 2, ensaya: 'mc-destinatario' },
      { q: 'Abres el informe de un equipo. La hoja de adelante, con el título y los nombres de los autores, es…', o: ['la bibliografía', 'las recomendaciones', 'el índice', 'la carátula'], a: 3, ensaya: 'mc-caratula' }
    ],
    /* Pareados de aplicar: el término se une con lo que pasa en la escena.
       El examen lo une con su definición o con otro ejemplo. */
    pareados: {
      intro: '<div class="historia"><b>Lee esta escena:</b> Marlon abre el periódico del domingo. Bajo una fotografía lee: «Vecinos de la aldea reparan el camino». Más adelante hay un anuncio, «Vendo guitarra casi nueva», y un aviso: «Esta noche, concierto de marimba en el parque central». Entre las hojas encuentra una carta vieja de su mamá. Arriba dice «Comayagua, 12 de enero de 2027»; empieza con «Querido hijo:» y termina con «Te abraza con todo su amor» y, debajo, «Tu mamá, Rosa». Por la tarde, Marlon va a la asamblea del patronato. Doña Marta lee los tres puntos que se van a tratar y don Beto va anotando todo en el acta. Al final, don Julián le paga a un vecino por un ternero y se lo lleva.</div>',
      columnaA: 'Columna A',
      columnaB: 'Columna B: lo que se lee o se ve en la escena',
      anchoA: '26%',
      pares: [
        { term: 'Saludo', def: '«Querido hijo:»', ensaya: 'pr-saludo' },
        { term: 'Despedida', def: '«Te abraza con todo su amor»', ensaya: 'pr-despedida' },
        { term: 'Firma', def: '«Tu mamá, Rosa»', ensaya: 'pr-firma' },
        { term: 'Lugar y fecha', def: '«Comayagua, 12 de enero de 2027»', ensaya: 'pr-lugar-fecha' },
        { term: 'Clasificados', def: '«Vendo guitarra casi nueva»', ensaya: 'pr-clasificados' },
        { term: 'Cultura', def: '«Esta noche, concierto de marimba en el parque central»', ensaya: 'pr-cultura' },
        { term: 'Pie de foto', def: '«Vecinos de la aldea reparan el camino»', ensaya: 'pr-pie-foto' },
        { term: 'Orden del día', def: 'Los tres puntos que lee doña Marta', ensaya: 'pr-orden-dia' },
        { term: 'Secretario', def: 'Don Beto, que va anotando todo en el acta', ensaya: 'pr-secretario' },
        { term: 'Comprador', def: 'Don Julián, que paga por el ternero', ensaya: 'pr-comprador' }
      ]
    }
  },

  felicitacion: '🏅 <b>¡Felicidades! Has completado la Misión El periódico y los textos de todos los días.</b> Ahora sabes leer un periódico con cabeza propia: buscas en sus secciones, le haces a cada noticia sus seis preguntas y separas el hecho de la opinión. Sabes a quién se le escribe una carta personal y a quién una carta de lector, para qué sirve una carta de venta, cómo se levanta un acta, cómo se escribe un reglamento por artículos y qué partes lleva un informe. Y sabes lo más importante: antes de repetir algo, preguntas quién lo informó.',

  rubrica: {
    filas: [
      ['Copió los contenidos de este material en su cuaderno de Español.', 'Tarea en el hogar'],
      ['Resolvió la sección «Ponte a Prueba» directamente en esta ficha.', 'Tarea en el aula, un día antes del examen'],
      ['Anotó tres secciones, un titular, un hecho y una opinión de un periódico o del periódico mural.', 'Tarea en el hogar'],
      ['Prueba impresa realizada en el aula.', 'Evaluación en el aula']
    ],
    nota: 'Recuerde que ya aprendió a sacar el promedio: sume el total del valor obtenido y divídalo entre cuatro. El resultado será su nota final. Perderá puntos si no completa el trabajo, si su letra no es legible o si escribe con faltas de ortografía.'
  },

  notaDocente: 'esta ficha está basada en el contenido interactivo de la plataforma M.E.T.A.S «Misión El periódico y los textos de todos los días» (III Ciclo y Bachillerato; primer parcial, febrero y marzo). Cada tema lleva señalado su grado según la programación mensual de Español de 7.º a 9.º; el recuadro «Para Media» es para 11.º. La sección «Ponte a Prueba» <strong>no es el examen</strong>: ensaya los mismos datos que la prueba de la plataforma (completar, verdadero o falso, selección múltiple y pareados) con otras preguntas, para que el alumno practique sin haber visto la hoja que se le va a evaluar. Las noticias, las cartas, las actas y las cifras de los ejemplos son inventadas: puede cambiarlas por las de su comunidad o por las de un periódico que tenga a mano. Para la evaluación final imprima la prueba desde la plataforma, que genera formas distintas con su pauta.'
};
