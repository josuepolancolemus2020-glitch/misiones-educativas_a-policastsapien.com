/* ============================================================
   Animación de «¿Qué es un Robot?» (Ruta de los Robots, etapa 1)
   ------------------------------------------------------------
   La historia: en la feria pusieron un muñeco que mueve el brazo
   saludando, igual con gente delante que sin nadie, de día y de noche.
   Los niños decían «es un robot»; Marvin dijo que no, y se quedó callado
   cuando le preguntaron por qué. Aquí se ve el porqué, y se ve con el
   mismo día puesto dos veces.

   Lo que se dibuja: dos columnas con los mismos cuatro momentos (de día
   con niños, de día sin nadie, de noche con niños, de noche sin nadie).
   A la izquierda, el muñeco de la feria: saluda igual en los cuatro. A
   la derecha, el mismo muñeco con lo que le faltaba: algo para percibir
   si hay alguien enfrente (un lente con su zona) y una regla para
   decidir. Ese saluda solo cuando hay alguien. Debajo de cada columna,
   las tres cosas que hace un robot (percibe, decide, actúa) con su ✓ o
   su ✗, y la regla de cada uno escrita.

   ⚠️ Lo que NO se dice, y a propósito. La prueba pregunta cómo se llaman
   las partes del robot y con qué parte del cuerpo se comparan, así que
   aquí no sale ni sensor, ni controlador, ni actuador, ni ojos, ni
   cerebro, ni músculos: lo que percibe es un lente con su zona, y lo que
   decide, una regla escrita. Y el muñeco no lleva ojos pintados: unos
   ojos dibujados dirían que ve, que es justo lo que no hace.

   ⚠️ Una pieza tiene una sola demora. Cada momento lleva su celda (que
   aparece), su zona (que se enciende cuando el lente mira) y su brazo
   (que sube), cada uno con la suya: así se ve percibir antes de actuar.

   ⚠️ La misión es bilingüe, y la animación también. El motor de idioma
   no traduce lo que la escena arma; la escena trae sus dos idiomas
   escritos, y `idioma()` cambia los rótulos del dibujo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amFeria')) return;

  var ANCHO = 320, ALTO = 334;
  var lang = 'es';

  /* ── las dos columnas y los cuatro momentos ─────────────────── */
  var COL = { A: 6, B: 164 }, CW = 150, CH = 58;
  function filaY(k) { return 22 + k * 62; }
  /* Los cuatro momentos del mismo día, en las dos columnas iguales. */
  var MOMENTOS = [{ dia: true, ninos: 2 }, { dia: true, ninos: 0 }, { dia: false, ninos: 2 }, { dia: false, ninos: 0 }];
  /* Lo que hace cada uno: el de la feria saluda siempre; el otro, solo si
     hay alguien enfrente. Es lo mismo que dice la regla escrita debajo. */
  function saluda(col, mom) { return col === 'A' ? true : mom.ninos > 0; }

  /* Dentro de cada celda, medido desde su esquina de arriba: el suelo
     empieza en SUELO, y el muñeco y los niños se paran ahí. */
  var SUELO = 48;
  var HOMBRO = { x: 40, y: 25.5 }, MANO = { x: 45, y: 36.75 };
  var GIRO = -121;                       // el brazo sube hacia la derecha, hacia los niños
  var NINOS_X = [88, 108];
  var ASTRO = { x: 133, y: 11 };
  var LENTE = { x: 44, y: 43.75 };

  /* ── abajo: lo que hace cada uno ────────────────────────────── */
  var BARRA_Y = 276, CAJA_W = 44, CAJA_H = 22;
  function cajaX(col, i) { return COL[col] + i * 53; }
  /* percibe, decide, actúa: ✓ o ✗ de cada columna */
  var MARCAS = { A: [false, false, true], B: [true, true, true] };

  /* ── el reloj ───────────────────────────────────────────────── */
  var CELDA_A = 1000, CELDA_B = 1200;    // de un momento al siguiente
  var SUBE = 800;                         // lo que tarda el brazo en subir

  var RS = {
    encA: { es: 'El muñeco de la feria', en: 'The doll at the fair' },
    encB: { es: 'Con lo que le faltaba', en: 'With what it was missing' },
    hace: { es: ['percibe', 'decide', 'actúa'], en: ['senses', 'decides', 'acts'] },
    tarA: { es: ['hace siempre:', 'saluda'], en: ['always does:', 'wave'] },
    tarB: { es: ['si hay alguien: saluda', 'si no: se queda quieto'], en: ['if someone is there: wave', 'if not: stay still'] }
  };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }
  function f2(v) { return Math.round(v * 100) / 100; }

  /* Un momento: el cielo, el suelo, el sol o la luna, el muñeco en su
     pedestal y los niños, si los hay. Todo en coordenadas del dibujo. */
  function celda(A, svg, col, k) {
    var mom = MOMENTOS[k], x = COL[col], y = filaY(k);
    function X(v) { return f2(x + v); }
    function Y(v) { return f2(y + v); }
    var g = A.el('g', { 'data-celda': col + k, 'data-col': col, 'data-fila': k }, svg);
    A.el('rect', { x: x, y: y, width: CW, height: CH, rx: 5, 'class': mom.dia ? 'fr-suelo-dia' : 'fr-suelo-noche', 'data-suelo': '' }, g);
    A.el('path', { d: 'M' + x + ' ' + Y(SUELO) + ' L' + x + ' ' + Y(5) + ' Q' + x + ' ' + y + ' ' + X(5) + ' ' + y +
      ' L' + X(CW - 5) + ' ' + y + ' Q' + X(CW) + ' ' + y + ' ' + X(CW) + ' ' + Y(5) + ' L' + X(CW) + ' ' + Y(SUELO) + ' Z',
      'class': mom.dia ? 'fr-cielo-dia' : 'fr-cielo-noche', 'data-cielo': '' }, g);
    if (mom.dia) {
      var sol = A.el('g', { 'data-sol': '' }, g);
      for (var r = 0; r < 8; r++) {
        var a = r * Math.PI / 4, ax = x + ASTRO.x, ay = y + ASTRO.y;
        A.el('path', { d: 'M' + f2(ax + Math.cos(a) * 6.8) + ' ' + f2(ay + Math.sin(a) * 6.8) +
          ' L' + f2(ax + Math.cos(a) * 9.6) + ' ' + f2(ay + Math.sin(a) * 9.6), 'class': 'fr-rayo', 'data-rayo': '' }, sol);
      }
      A.el('circle', { cx: X(ASTRO.x), cy: Y(ASTRO.y), r: 4.8, 'class': 'fr-sol' }, sol);
    } else {
      var lx = x + ASTRO.x, ly = y + ASTRO.y, lr = 5.4;
      var cx = f2(lx + 0.61 * lr), arriba = f2(ly - 0.792 * lr), abajo = f2(ly + 0.792 * lr);
      A.el('path', { d: 'M' + cx + ' ' + arriba + ' A' + lr + ' ' + lr + ' 0 1 0 ' + cx + ' ' + abajo +
        ' A' + f2(0.8 * lr) + ' ' + f2(0.8 * lr) + ' 0 1 1 ' + cx + ' ' + arriba + ' Z', 'class': 'fr-luna', 'data-luna': '' }, g);
      [[104, 9], [116, 19], [121, 6]].forEach(function (s) {
        A.el('circle', { cx: X(s[0]), cy: Y(s[1]), r: 1, 'class': 'fr-estrella' }, g);
      });
    }
    /* la zona del lente va DEBAJO de los niños: se ve que les llega */
    var zona = null, lente = null;
    if (col === 'B') {
      zona = A.el('path', { d: 'M' + X(LENTE.x + 3.2) + ' ' + Y(LENTE.y) + ' L' + X(132) + ' ' + Y(22) + ' L' + X(132) + ' ' + Y(50) + ' Z',
        'class': 'fr-zona ' + (mom.dia ? 'fr-zona-dia' : 'fr-zona-noche'), 'data-zona': '' }, g);
    }
    A.el('rect', { x: X(17.5), y: Y(39.5), width: 30, height: SUELO - 39.5, rx: 1.8, 'class': 'fr-pedestal', 'data-pedestal': '' }, g);
    if (col === 'B') lente = A.el('circle', { cx: X(LENTE.x), cy: Y(LENTE.y), r: 2.8, 'class': 'fr-lente', 'data-lente': '' }, g);
    /* cada brazo lleva un borde oscuro debajo: levantado, el brazo queda
       en el cielo, y tiene que verse en el claro del día y en la noche */
    var quieto = 'M' + X(25) + ' ' + Y(25.5) + ' L' + X(20.6) + ' ' + Y(36);
    A.el('path', { d: quieto, 'class': 'fr-brazo-borde' }, g);
    A.el('path', { d: quieto, 'class': 'fr-brazo' }, g);
    A.el('rect', { x: X(25), y: Y(23), width: 15, height: 16.5, rx: 3.5, 'class': 'fr-cuerpo', 'data-cuerpo': '' }, g);
    A.el('circle', { cx: X(32.5), cy: Y(16.5), r: 6.8, 'class': 'fr-cabeza', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + X(29.4) + ' ' + Y(18.3) + ' Q' + X(32.5) + ' ' + Y(21.3) + ' ' + X(35.6) + ' ' + Y(18.3), 'class': 'fr-boca' }, g);
    /* el brazo que saluda: gira en el hombro */
    var brazo = A.el('g', { 'class': 'fr-gira', 'data-brazo-g': '' }, g);
    brazo.style.transformOrigin = X(HOMBRO.x) + 'px ' + Y(HOMBRO.y) + 'px';
    var sube = 'M' + X(HOMBRO.x) + ' ' + Y(HOMBRO.y) + ' L' + X(MANO.x) + ' ' + Y(MANO.y);
    A.el('path', { d: sube, 'class': 'fr-brazo-borde' }, brazo);
    A.el('path', { d: sube, 'class': 'fr-brazo', 'data-brazo': '' }, brazo);
    /* las rayitas del saludo, junto a la mano levantada */
    var arcos = A.el('g', { 'data-arcos': '' }, g);
    var tono = 'fr-arco ' + (mom.dia ? 'fr-arco-dia' : 'fr-arco-noche');
    A.el('path', { d: 'M' + X(51) + ' ' + Y(10.5) + ' A6 6 0 0 1 ' + X(51) + ' ' + Y(20.5), 'class': tono }, arcos);
    A.el('path', { d: 'M' + X(55.5) + ' ' + Y(7) + ' A9.5 9.5 0 0 1 ' + X(55.5) + ' ' + Y(24), 'class': tono }, arcos);
    /* los niños, parados en el suelo y mirando al muñeco */
    for (var n = 0; n < mom.ninos; n++) {
      var nx = NINOS_X[n];
      var nino = A.el('g', { 'data-nino': n + 1 }, g);
      A.el('rect', { x: X(nx - 4.4), y: Y(35), width: 8.8, height: SUELO - 35, rx: 2.4, 'class': 'fr-nino-' + (n + 1) }, nino);
      A.el('circle', { cx: X(nx), cy: Y(30.2), r: 4.75, 'class': 'fr-nino-cara' }, nino);
    }
    A.el('rect', { x: x, y: y, width: CW, height: CH, rx: 5, 'class': 'fr-marco', 'data-marco': '' }, g);
    return { g: g, mom: mom, brazo: brazo, arcos: arcos, zona: zona, lente: lente };
  }

  /* Debajo de cada columna: percibe → decide → actúa, con su ✓ o su ✗. */
  function barra(A, svg, col) {
    var g = A.el('g', { 'data-barra': col }, svg);
    var etiquetas = [], marcas = [];
    for (var i = 0; i < 3; i++) {
      var bx = cajaX(col, i);
      A.el('rect', { x: bx, y: BARRA_Y, width: CAJA_W, height: CAJA_H, rx: 5, 'class': 'fr-caja', 'data-caja': col + i }, g);
      etiquetas.push(texto(A, g, bx + CAJA_W / 2, BARRA_Y + 15.5, 'am-letra', 10.5, 'middle', ''));
      etiquetas[i].setAttribute('data-hace', i);
      if (i < 2) {
        var ax = bx + CAJA_W + 1.5, ay = BARRA_Y + CAJA_H / 2;
        A.el('path', { d: 'M' + ax + ' ' + ay + ' L' + (ax + 6.5) + ' ' + ay + ' M' + (ax + 4) + ' ' + (ay - 2.5) + ' L' + (ax + 7) + ' ' + ay +
          ' L' + (ax + 4) + ' ' + (ay + 2.5), 'class': 'fr-flecha', 'data-flecha': col + i }, g);
      }
    }
    /* la marca va en la esquina de arriba de cada caja: una por pieza,
       para que aparezcan una detrás de otra */
    for (var j = 0; j < 3; j++) {
      var mx = cajaX(col, j) + CAJA_W - 1, my = BARRA_Y + 1;
      var mg = A.el('g', { 'data-marca': col + j }, svg);
      A.el('circle', { cx: mx, cy: my, r: 6, 'class': 'fr-insignia' }, mg);
      var bien = MARCAS[col][j];
      A.el('path', { d: bien
        ? 'M' + (mx - 3) + ' ' + (my + 0.2) + ' L' + (mx - 0.8) + ' ' + (my + 2.6) + ' L' + (mx + 3.2) + ' ' + (my - 2.6)
        : 'M' + (mx - 2.5) + ' ' + (my - 2.5) + ' L' + (mx + 2.5) + ' ' + (my + 2.5) + ' M' + (mx + 2.5) + ' ' + (my - 2.5) + ' L' + (mx - 2.5) + ' ' + (my + 2.5),
        'class': bien ? 'fr-bien' : 'fr-mal', 'data-signo': bien ? 'si' : 'no' }, mg);
      marcas.push(mg);
    }
    /* y la regla de cada uno, escrita */
    var t = A.el('g', { 'data-tarjeta': col }, svg);
    var l1 = texto(A, t, COL[col] + 2, 315, 'am-letra', 10.5, 'start', '');
    var l2 = texto(A, t, COL[col] + 2, 328, 'am-letra', 10.5, 'start', '');
    l1.setAttribute('data-linea', 1); l2.setAttribute('data-linea', 2);
    return { g: g, etiquetas: etiquetas, marcas: marcas, tarjeta: t, lineas: [l1, l2] };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    P.enc = {
      A: texto(A, svg, COL.A + CW / 2, 15, 'am-letra', 11.5, 'middle', ''),
      B: texto(A, svg, COL.B + CW / 2, 15, 'am-letra', 11.5, 'middle', '')
    };
    P.enc.A.setAttribute('data-encabezado', 'A');
    P.enc.B.setAttribute('data-encabezado', 'B');
    P.celdas = { A: [], B: [] };
    for (var k = 0; k < 4; k++) {
      P.celdas.A.push(celda(A, svg, 'A', k));
      P.celdas.B.push(celda(A, svg, 'B', k));
    }
    P.barras = { A: barra(A, svg, 'A'), B: barra(A, svg, 'B') };
  }

  function idioma(l) {
    lang = l === 'en' ? 'en' : 'es';
    P.enc.A.textContent = RS.encA[lang];
    P.enc.B.textContent = RS.encB[lang];
    ['A', 'B'].forEach(function (col) {
      var b = P.barras[col];
      b.etiquetas.forEach(function (t, i) { t.textContent = RS.hace[lang][i]; });
      var tar = col === 'A' ? RS.tarA : RS.tarB;
      b.lineas[0].textContent = tar[lang][0];
      b.lineas[1].textContent = tar[lang][1];
    });
  }

  /* ── los estados ───────────────────────────────────────────── */

  /* Pone de golpe, sin movimiento: así cada paso se vuelve a ver entero
     cada vez que se entra en él, también volviendo con «Atrás». */
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    var lista = [P.enc.A, P.enc.B];
    ['A', 'B'].forEach(function (col) {
      P.celdas[col].forEach(function (c) { lista.push(c.g, c.brazo, c.arcos); if (c.zona) lista.push(c.zona); });
      var b = P.barras[col];
      lista.push(b.g, b.tarjeta);
      b.marcas.forEach(function (m) { lista.push(m); });
    });
    return lista;
  }

  /* El estado al EMPEZAR un paso: cuántos momentos se ven de cada
     columna, y si ya están sus tres cosas debajo. */
  function base(A, s) {
    deGolpe(A, todo(), function () {
      ['A', 'B'].forEach(function (col) {
        var cuantos = col === 'A' ? s.a : s.b;
        P.celdas[col].forEach(function (c, k) {
          var ve = k < cuantos, sube = ve && saluda(col, c.mom);
          A.ver(c.g, ve, 0);
          if (c.zona) A.ver(c.zona, ve, 0);
          A.mover(c.brazo, 0, 0, sube ? GIRO : 0, 1, 0);
          A.ver(c.arcos, sube, 0);
        });
        var conBarra = col === 'A' ? s.barA : s.barB, b = P.barras[col];
        A.ver(b.g, conBarra, 0);
        A.ver(b.tarjeta, conBarra, 0);
        b.marcas.forEach(function (m) { A.ver(m, conBarra, 0); });
      });
      A.ver(P.enc.A, true, 0);
      A.ver(P.enc.B, s.b > 0, 0);
    });
  }

  /* Un momento que aparece: la celda, y en la columna de la derecha el
     lente que mira (la zona); después, si toca, el brazo que sube. */
  function aparece(A, col, k, t, tBrazo) {
    var c = P.celdas[col][k];
    A.ver(c.g, true, t);
    var tb = tBrazo != null ? tBrazo : t + 500;
    if (c.zona) {
      A.ver(c.zona, true, t + 500);
      if (tBrazo == null) tb = t + 1000;
    }
    if (saluda(col, c.mom)) {
      A.mover(c.brazo, 0, 0, GIRO, 1, tb);
      A.ver(c.arcos, true, tb + SUBE);
    }
  }

  function barraAparece(A, col, t) {
    var b = P.barras[col];
    A.ver(b.g, true, t);
    b.marcas.forEach(function (m, i) { A.ver(m, true, t + 400 + i * 300); });
  }

  var ESTADOS = [
    { a: 1, b: 0, barA: false, barB: false },
    { a: 4, b: 0, barA: false, barB: false },
    { a: 4, b: 0, barA: true, barB: false },
    { a: 4, b: 1, barA: true, barB: true },
    { a: 4, b: 4, barA: true, barB: true },
    { a: 4, b: 4, barA: true, barB: true }
  ];

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan solo al ENTRAR; el 0
       y el 5 se pintan siempre, también en el primer pintado, que llega
       con antes === n. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0 || n === 5) { base(A, ESTADOS[n]); return; }
    base(A, ESTADOS[n - 1]);
    if (n === 1) {
      /* el mismo día pasa: tres momentos más, uno detrás de otro */
      for (var k = 1; k < 4; k++) aparece(A, 'A', k, 300 + (k - 1) * CELDA_A);
      return;
    }
    if (n === 2) {
      barraAparece(A, 'A', 150);
      A.ver(P.barras.A.tarjeta, true, 1500);
      return;
    }
    if (n === 3) {
      /* se le pone lo que faltaba: primero mira, después decide con su
         regla, y entonces actúa */
      A.ver(P.enc.B, true, 150);
      aparece(A, 'B', 0, 400, 2000);
      A.ver(P.barras.B.tarjeta, true, 1400);
      barraAparece(A, 'B', 2800);
      return;
    }
    /* el 4: el mismo día, otra vez, a la derecha */
    for (var j = 1; j < 4; j++) aparece(A, 'B', j, 300 + (j - 1) * CELDA_B);
  }

  var FRASES = {
    es: [
      'En la feria, el muñeco saluda. Los niños dicen que es un robot, y Marvin dice que no. ¿Quién tiene razón?',
      'De día o de noche, con niños enfrente o sin nadie, el muñeco saluda igual. Pase lo que pase enfrente, le da lo mismo.',
      'Un robot percibe lo que pasa, decide qué hacer y actúa. El muñeco solo actúa: mueve el brazo, y hasta ahí. Eso quería decir Marvin.',
      'Se le pone lo que le faltaba: algo para percibir si hay alguien enfrente, y una regla para decidir qué hacer.',
      'El mismo día, otra vez: ahora saluda solo cuando hay alguien, de día o de noche. Percibe, decide y actúa: ahora sí es un robot.',
      'Tu turno: busca una máquina en tu casa y hazle tres preguntas. ¿Percibe algo? ¿Decide qué hacer? ¿Actúa?'
    ],
    en: [
      'At the fair, the doll waves. The kids say it is a robot, and Marvin says it is not. Who is right?',
      'By day or by night, with kids in front or with nobody, the doll waves the same. Whatever happens in front of it, it does not care.',
      'A robot senses what happens, decides what to do and acts. The doll only acts: it moves its arm, and that is all. That is what Marvin meant.',
      'It gets what it was missing: something to sense whether anyone is in front, and a rule to decide what to do.',
      'The same day again: now it waves only when someone is there, by day or by night. It senses, decides and acts: now it really is a robot.',
      'Your turn: find a machine at home and ask it three questions. Does it sense anything? Does it decide what to do? Does it act?'
    ]
  };
  /* Los rótulos del botón caben en un renglón en un teléfono de 360 px con
     la letra grande. */
  var BOTONES = {
    es: ['🌗 Mirarlo todo el día', '🔍 ¿Qué le falta?', '🔧 Completarlo', '🌗 Otra vez el día', '📝 Tu turno', '↺ Empezar otra vez'],
    en: ['🌗 Watch it all day', '🔍 What is missing?', '🔧 Complete it', '🌗 The day again', '📝 Your turn', '↺ Start over']
  };
  var MARCADOR = {
    es: [['1', 'momento visto'], ['4 de 4', 'momentos en que saluda igual'], ['1 de 3', 'cosas que hace el muñeco'],
      ['3 de 3', 'cosas que hace ahora'], ['2 de 4', 'momentos en que saluda'], ['3', 'preguntas para cada máquina']],
    en: [['1', 'moment seen'], ['4 of 4', 'moments it waves the same'], ['1 of 3', 'things the doll does'],
      ['3 of 3', 'things it does now'], ['2 of 4', 'moments it waves'], ['3', 'questions for each machine']]
  };

  AnimacionMision.montar('#amFeria', {
    vista: [ANCHO, ALTO],
    bilingue: true,
    describe: {
      es: 'Dos columnas con los mismos cuatro momentos de la feria, de día y de noche, con niños y sin nadie: a la izquierda el muñeco, a la derecha el muñeco con lo que le faltaba. Debajo, lo que hace cada uno.',
      en: 'Two columns with the same four moments at the fair, by day and by night, with kids and with nobody: on the left the doll, on the right the doll with what it was missing. Below, what each one does.'
    },
    pasos: 6,
    construir: construir,
    idioma: idioma,
    pintar: pintar,
    texto: function (n) { return FRASES[lang][n]; },
    boton: function (n) { return BOTONES[lang][n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[lang][n][0], palabras: MARCADOR[lang][n][1] }; }
  });
})();
