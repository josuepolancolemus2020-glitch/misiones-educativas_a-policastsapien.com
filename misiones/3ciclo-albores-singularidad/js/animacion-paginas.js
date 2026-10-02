/* ============================================================
   Animación de «En los Albores de la Singularidad»
   (Ruta de la Máquina que Aprende, etapa 6)
   ------------------------------------------------------------
   La historia: a Marvin, que quería estudiar computación, le reenviaron en
   el grupo del colegio «no vale la pena, en dos años la Inteligencia
   Artificial lo va a hacer todo». La leyó en tres páginas, todas decían lo
   mismo, y ninguna decía quién lo había dicho. Solo traía el plazo. Dejó la
   inscripción para después, y con eso decidió su año.

   Lo que se dibuja: arriba, el mensaje reenviado. Debajo, las tres páginas,
   cerradas. Se miran una por una: las tres traen la frase entera y la firma
   en blanco. Después se ponen una encima de otra, como papel de calcar, y
   coinciden letra por letra: tres páginas pueden ser una sola voz. Se marca
   lo único que trae (el plazo) y la firma que no está, y abajo se cuentan los
   doce meses que Marvin dejó para después.

   ⚠️ Lo que asombra, y es verdad: ver una frase en tres sitios parece tres
   confirmaciones, y encimadas no se distinguen. Es la misma frase, y ni una
   de las tres dice quién la escribió. La sonda lo comprueba línea por línea:
   que cada página diga la frase de la historia, palabra por palabra, y que
   encimadas caigan en el mismo sitio.

   ⚠️ Lo que NO se dice, y a propósito: ni el nombre de lo que pasa ni su
   definición (son pareados de la prueba), ni las cuatro preguntas del
   termómetro (las enseña la tarjeta de abajo, y el alumno las aplica él en
   «El termómetro de la promesa»), ni que la frase sea falsa: nadie sabe si
   el mundo va a cambiar en dos años, y la misión no lo dice.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPaginas')) return;

  var ANCHO = 320, ALTO = 260;

  /* La frase, tal como la reenviaron. Se escribe igual en el mensaje y en
     las tres páginas: lo que cambia es dónde se parte el renglón. */
  var GLOBO_LINEAS = ['No vale la pena, en dos años la Inteligencia', 'Artificial lo va a hacer todo.'];
  var PAGINA_LINEAS = ['No vale la pena,', 'en dos años', 'la Inteligencia', 'Artificial lo va', 'a hacer todo.'];
  /* El renglón del plazo va con su ancho fijo (textLength): así su recuadro
     se sabe antes de que llegue la letra. */
  var PLAZO = { linea: 1, ancho: 50 };

  /* ── el dibujo ─────────────────────────────────────────────── */
  var GLOBO = { x0: 8, y0: 6, x1: 312, y1: 48, tam: 10, cab: 8.5 };
  /* La pestaña de cada página sale POR ARRIBA del papel, como en una
     carpeta: encimadas, el papel de una no tapa la pestaña de otra, y se
     siguen contando tres. */
  var PAG = { y0: 64, ancho: 94, alto: 108, xs: [8, 113, 218], tam: 9, renglon0: 26, paso: 11,
              pesta: { ancho: 24, alto: 12, sale: 10 } };
  var CENTRO = 1;                     /* la página del medio no se mueve */
  var MESES = { y0: 182, alto: 22, ancho: 22, x0: 8.75, paso: 25.5, tam: 8.5,
    nombres: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'] };
  var CUADERNO = { x0: 8, x1: 312, y0: 222, y1: 258, tam: 10, renglones: [237, 252] };

  /* ── el reloj de la escena ──────────────────────────────────── */
  var T1 = { primera: 300, cada: 600 };
  var T2 = { calco: 0, viaje: 500 };
  var T3 = { caja: 0, plazo: 300, aro: 700, firma: 1000 };
  var T4 = { cada: 80, dice: 1100 };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── el mensaje reenviado ── */
    /* Sin cola, a propósito: un globo apunta a quien habla, y el mensaje
       reenviado no dice quién lo dijo. */
    var g = A.el('g', { 'data-globo': '' }, svg);
    A.el('rect', { x: GLOBO.x0, y: GLOBO.y0, width: GLOBO.x1 - GLOBO.x0, height: GLOBO.y1 - GLOBO.y0, rx: 8, 'class': 'pg-globo', 'data-globo-caja': '' }, g);
    texto(A, g, GLOBO.x0 + 8, GLOBO.y0 + 11, 'pg-cab', GLOBO.cab, 'start', '↪ Reenviado en el grupo del colegio').setAttribute('data-reenviado', '');
    GLOBO_LINEAS.forEach(function (l, j) {
      texto(A, g, GLOBO.x0 + 8, GLOBO.y0 + 24 + 12 * j, 'pg-letra', GLOBO.tam, 'start', l).setAttribute('data-globo-linea', String(j));
    });

    /* ── las tres páginas: primero la del medio, que no se mueve, y encima
       las otras dos, que vienen a calcarse sobre ella ── */
    P.vuela = []; P.papel = []; P.tapa = [];
    [CENTRO, 0, 2].forEach(function (k) {
      var lugar = A.el('g', { transform: 'translate(' + PAG.xs[k] + ' ' + PAG.y0 + ')' }, svg);
      var v = A.el('g', { 'data-pagina': String(k) }, lugar);
      /* la pestaña con su número, cada una en otro sitio: encimadas se ven
         las tres, una al lado de la otra. Va antes que el papel, que le tapa
         el pie y la deja pegada a su hoja. */
      var px = 4 + 28 * k, pe = PAG.pesta;
      A.el('rect', { x: px, y: -pe.sale, width: pe.ancho, height: pe.alto, rx: 2.5, 'class': 'pg-pesta', 'data-pesta': '' }, v);
      texto(A, v, px + pe.ancho / 2, -2.5, 'pg-pesta-n', 8, 'middle', String(k + 1)).setAttribute('data-pesta-n', '');
      P.papel[k] = A.el('rect', { x: 0, y: 0, width: PAG.ancho, height: PAG.alto, rx: 4, 'class': 'pg-papel', 'data-papel': '' }, v);
      PAGINA_LINEAS.forEach(function (l, j) {
        var t = texto(A, v, 6, PAG.renglon0 + PAG.paso * j, 'pg-letra', PAG.tam, 'start', l);
        t.setAttribute('data-pag-linea', String(j));
        if (j === PLAZO.linea) { t.setAttribute('textLength', PLAZO.ancho); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); }
      });
      texto(A, v, 6, 94, 'pg-letra', PAG.tam, 'start', 'Firma:').setAttribute('data-firma-dice', '');
      A.el('path', { d: 'M41 95 L87 95', 'class': 'pg-firma', 'data-firma-raya': '' }, v);
      /* la tapa de la página cerrada, con su «?» */
      var tp = A.el('g', { 'data-tapa': '' }, v);
      A.el('rect', { x: 3, y: 3, width: PAG.ancho - 6, height: PAG.alto - 6, rx: 3, 'class': 'pg-tapa', 'data-tapa-caja': '' }, tp);
      texto(A, tp, PAG.ancho / 2, 62, 'pg-tapa-q', 26, 'middle', '?').setAttribute('data-tapa-q', '');
      P.vuela[k] = v; P.tapa[k] = tp;
    });

    /* ── lo único que trae, y la firma que no está (sobre la del medio) ── */
    var cx = PAG.xs[CENTRO], ly = PAG.y0 + PAG.renglon0 + PAG.paso * PLAZO.linea;
    P.caja = A.el('rect', { x: cx + 3, y: ly - 8.5, width: PLAZO.ancho + 6, height: 11.5, rx: 3, 'class': 'pg-caja', 'data-plazo-caja': '' }, svg);
    P.plazo = texto(A, svg, cx - 5, ly, 'am-rotulo', 9.5, 'end', 'el plazo');
    P.plazo.setAttribute('data-plazo-dice', '');
    P.aro = A.el('rect', { x: cx + 37.5, y: PAG.y0 + 88, width: 53, height: 11, rx: 4, 'class': 'pg-aro', 'data-firma-aro': '' }, svg);
    P.firma = texto(A, svg, cx + PAG.ancho + 5, PAG.y0 + 96.5, 'am-rotulo', 9.5, 'start', 'nadie la firma');
    P.firma.setAttribute('data-firma-nadie', '');

    /* ── el año que dejó para después ──
       ⚠️ Cada mes lleva `data-pg-mes`, no `data-mes`: la misión escribe el
       mes del dosier en todo lo que lleva `data-mes`, y con ese nombre le
       borraba a cada mes su cuadro y su letra. Los doce salían en blanco y no
       daba ningún error. */
    P.mes = MESES.nombres.map(function (m, i) {
      var gm = A.el('g', { 'data-pg-mes': '' }, svg);
      var x = MESES.x0 + MESES.paso * i;
      A.el('rect', { x: x, y: MESES.y0, width: MESES.ancho, height: MESES.alto, rx: 3, 'class': 'pg-mes', 'data-pg-mes-caja': '' }, gm);
      texto(A, gm, x + MESES.ancho / 2, MESES.y0 + 14.5, 'pg-mes-n', MESES.tam, 'middle', m).setAttribute('data-pg-mes-dice', '');
      return gm;
    });
    P.anio = texto(A, svg, ANCHO / 2, MESES.y0 + MESES.alto + 13, 'am-rotulo', 9.5, 'middle', 'el año que dejó para después');
    P.anio.setAttribute('data-anio-dice', '');

    /* ── el cuaderno del final ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUADERNO.x0, y: CUADERNO.y0, width: CUADERNO.x1 - CUADERNO.x0, height: CUADERNO.y1 - CUADERNO.y0, rx: 6, 'class': 'pg-cuaderno', 'data-cuaderno-caja': '' }, P.cuaderno);
    var r0 = CUADERNO.renglones[0], r1 = CUADERNO.renglones[1];
    texto(A, P.cuaderno, 16, r0, 'pg-letra-q', CUADERNO.tam, 'start', 'Una frase que te reenviaron:');
    A.el('path', { d: 'M166 ' + (r0 + 1) + ' L302 ' + (r0 + 1), 'class': 'pg-renglon', 'data-raya-escribir': '' }, P.cuaderno);
    texto(A, P.cuaderno, 16, r1, 'pg-letra-q', CUADERNO.tam, 'start', 'La viste en');
    A.el('path', { d: 'M80 ' + (r1 + 1) + ' L104 ' + (r1 + 1), 'class': 'pg-renglon', 'data-raya-escribir': '' }, P.cuaderno);
    texto(A, P.cuaderno, 109, r1, 'pg-letra-q', CUADERNO.tam, 'start', 'lugares. Con firma:');
    A.el('path', { d: 'M218 ' + (r1 + 1) + ' L244 ' + (r1 + 1), 'class': 'pg-renglon', 'data-raya-escribir': '' }, P.cuaderno);
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso. abiertas: si ya se miraron las páginas;
     encimadas: si ya están una encima de otra; plazo: si se marcó lo que
     trae y la firma que falta; meses: si se ve el año; cuaderno: si sale el
     cuaderno. */
  var ESTADOS = [
    { abiertas: false, encimadas: false, plazo: false, meses: false, cuaderno: false },
    { abiertas: true, encimadas: false, plazo: false, meses: false, cuaderno: false },
    { abiertas: true, encimadas: true, plazo: false, meses: false, cuaderno: false },
    { abiertas: true, encimadas: true, plazo: true, meses: false, cuaderno: false },
    { abiertas: true, encimadas: true, plazo: true, meses: true, cuaderno: false },
    { abiertas: true, encimadas: true, plazo: true, meses: true, cuaderno: true }
  ];

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function todo() {
    return [P.caja, P.plazo, P.aro, P.firma, P.anio, P.cuaderno].concat(P.vuela.filter(Boolean), P.papel.filter(Boolean), P.tapa.filter(Boolean), P.mes);
  }
  /* El papel de calcar: la página se vuelve transparente y deja ver lo de
     abajo, pero su borde y su letra siguen ahí. */
  function calco(el, si, demora) {
    el.style.setProperty('--d', Math.round(demora || 0) + 'ms');
    el.classList.toggle('pg-calco', !!si);
  }
  function encimar(A, si, demora) {
    [0, 2].forEach(function (k) {
      calco(P.papel[k], si, si ? demora.calco : 0);
      A.mover(P.vuela[k], si ? PAG.xs[CENTRO] - PAG.xs[k] : 0, 0, 0, 1, si ? demora.viaje : 0);
    });
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      [0, 1, 2].forEach(function (k) { A.ver(P.tapa[k], !s.abiertas, 0); });
      encimar(A, s.encimadas, { calco: 0, viaje: 0 });
      [P.caja, P.plazo, P.aro, P.firma].forEach(function (p) { A.ver(p, s.plazo, 0); });
      P.mes.forEach(function (m) { A.ver(m, s.meses, 0); });
      A.ver(P.anio, s.meses, 0);
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan cada vez que se ENTRA en
       ellos, también volviendo con «Atrás»; el 0 y el 5 se pintan siempre. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 5) {
      if (antes !== 4) { base(A, ESTADOS[5]); return; }
      base(A, ESTADOS[4]);
      A.ver(P.cuaderno, true, 0);
      return;
    }
    if (n === 1) {
      /* se miran una por una, de izquierda a derecha */
      base(A, ESTADOS[0]);
      [0, 1, 2].forEach(function (k) { A.ver(P.tapa[k], false, T1.primera + T1.cada * k); });
      return;
    }
    if (n === 2) {
      /* se vuelven de calcar y después se ponen encima de la del medio */
      base(A, ESTADOS[1]);
      encimar(A, true, T2);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      A.ver(P.caja, true, T3.caja);
      A.ver(P.plazo, true, T3.plazo);
      A.ver(P.aro, true, T3.aro);
      A.ver(P.firma, true, T3.firma);
      return;
    }
    base(A, ESTADOS[3]);
    P.mes.forEach(function (m, i) { A.ver(m, true, T4.cada * i); });
    A.ver(P.anio, true, T4.dice);
  }

  var FRASES = [
    'A Marvin le reenviaron esta frase, y la leyó en tres páginas. ¿Cuántas personas la dijeron?',
    'Las tres páginas traen la frase entera. Y en ninguna dice quién la escribió.',
    'Encimadas, coinciden letra por letra. Pueden ser tres páginas y una sola voz.',
    'Lo único que trae es un plazo: «en dos años». Y nadie la firma.',
    'Con eso, Marvin dejó la inscripción para después. Se jugó un año entero por una frase que nadie firma.',
    'Ahora vos: buscá una frase que te reenviaron. Contá en cuántos lugares la viste, y en cuántos tenía firma.'
  ];
  var BOTONES = ['📄 Mirar las páginas', '🗂️ Encimarlas', '⏳ ¿Qué trae?', '📅 ¿Y Marvin?', '✍️ ¿Y vos?', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['3', 'páginas con la frase'],
    ['0', 'firmas en las 3 páginas'],
    ['1', 'frase, aunque sean 3 páginas'],
    ['1', 'plazo: lo único que trae'],
    ['12', 'meses en juego'],
    ['?', 'en tu cuaderno']
  ];

  AnimacionMision.montar('#amPaginas', {
    vista: [ANCHO, ALTO],
    describe: 'A Marvin le reenviaron una frase y la leyó en tres páginas. Las tres la traen entera, y ninguna dice quién la escribió. ' +
      'Encimadas, coinciden letra por letra. Lo único que trae es un plazo, y con eso Marvin dejó un año para después.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
