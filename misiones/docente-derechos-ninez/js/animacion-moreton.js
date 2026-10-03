/* ============================================================
   Animación de «Derechos de la niñez en la escuela»
   (misión del maestro, sección de las nueve situaciones)
   ------------------------------------------------------------
   Lo que enseña: cuánto dura de verdad el plazo para informar. El
   maestro que ve un moretón casi siempre piensa «mañana veo si sigue»,
   y no se da cuenta de que esperar a mañana es gastarse el plazo entero:
   veinticuatro horas después de verlo, a la entrada del día siguiente,
   ya se acabó.

   De dónde sale, leído en el PDF de _dev/leyes/ (el Código de la Niñez,
   con la reforma del Decreto 35-2013, La Gaceta n.º 33,222):
   - artículo 168: se informa «en un plazo máximo de veinticuatro (24)
     horas» sobre los niños «que muestren signos evidentes de agresión»;
     «en la misma obligación incurrirán los Directores de Centros
     Educativos […] así como los responsables directos de los niños y
     niñas, en esos centros»; y «la omisión de estos informes se
     sancionará con multa […] sin perjuicio del cumplimiento de la
     obligación».

   Lo que se dibuja: una línea del tiempo del lunes de madrugada al martes
   por la mañana, con el día y la noche. Kenia entra con un moretón el
   lunes a las 7:00; el plazo se cuenta desde ahí y se acaba el martes a
   las 7:00, a la entrada del día siguiente. Las horas no se escriben a
   mano en la escena: salen de la escala (horaX), y el mediodía y la
   medianoche están rotulados para que se pueda leer.

   ⚠️ No se nombra a quién se reporta: el Código dice el IHNFA y el
   mapa institucional cambió después de 2013 (la misión lo matiza y
   manda a confirmarlo en el centro). Por eso la animación termina
   pidiéndole al maestro que lo anote. Tampoco se escriben la cifra de
   la multa ni el número del artículo: los preguntan el quiz, el
   completar y los pareados.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amMoreton')) return;

  var ANCHO = 320, ALTO = 266;

  /* ── el tiempo: de las 3:00 del lunes a las 9:00 del martes ──
     Las horas se cuentan desde la medianoche del domingo al lunes: las
     7:00 del martes son la hora 31. */
  var H0 = 3, H1 = 33, X0 = 16, X1 = 304;
  function horaX(h) { return X0 + (h - H0) * (X1 - X0) / (H1 - H0); }
  var VE = 7, PLAZO = 24, VENCE = VE + PLAZO;
  var NOCHE = [18, 30];
  var HACER = [7.5, 9.5, 11.5];

  var Y = { rotulo: 12, llave: 28, pico: 17, cielo0: 30, cielo1: 64, eje: 66, hora: 81,
            cara: 110, curita: 113, nombre: 127, flecha: 103, piensa: 95,
            mal: 142, acabo: 164, precio: 178, lista0: 136, lista1: 212, abajo0: 218, abajo1: 260 };

  /* ── el reloj de la escena ── */
  var APAGA = 500;
  var T1 = { barrido: 0, dura: 2400, vence: 2400, llave: 2700, rotulo: 3100 };
  var T2 = { piensa: 0, espera: 500, dura: 2000, vuelve: 2500, mal: 3000, acabo: 3300, precio: 3800 };
  var T3 = { sale: 0, lista: 600, hacer: [900, 1300, 1700] };
  var T4 = { usted: 0, aro: 500, cuaderno: 1000 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }
  /* La hora, como se lee: «lunes 7:00», «martes 7:00». */
  function dicho(h) {
    var dia = h < 24 ? 'lunes' : 'martes', hh = h % 24, m = Math.round((hh - Math.floor(hh)) * 60);
    return dia + ' ' + Math.floor(hh) + ':' + (m < 10 ? '0' : '') + m;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    var xs = horaX(VE), xe = horaX(VENCE), medio = (xs + xe) / 2;

    /* ── el cielo: el día y la noche ── */
    P.cielo = A.el('g', { 'data-cielo': '' }, svg);
    A.el('rect', { x: X0, y: Y.cielo0, width: r2(horaX(NOCHE[0]) - X0), height: Y.cielo1 - Y.cielo0, 'class': 'rl-dia', 'data-dia': '' }, P.cielo);
    A.el('rect', { x: r2(horaX(NOCHE[0])), y: Y.cielo0, width: r2(horaX(NOCHE[1]) - horaX(NOCHE[0])), height: Y.cielo1 - Y.cielo0, 'class': 'rl-noche', 'data-noche': '' }, P.cielo);
    A.el('rect', { x: r2(horaX(NOCHE[1])), y: Y.cielo0, width: r2(X1 - horaX(NOCHE[1])), height: Y.cielo1 - Y.cielo0, 'class': 'rl-dia', 'data-dia': '' }, P.cielo);
    texto(A, P.cielo, horaX(14.5), 46, 'rl-emoji', 13, 'middle', '☀️').setAttribute('data-sol', '');
    texto(A, P.cielo, horaX(24), 46, 'rl-emoji', 13, 'middle', '🌙').setAttribute('data-luna', '');
    texto(A, P.cielo, horaX(12), 60, 'rl-dia-txt', 9.5, 'middle', 'mediodía').setAttribute('data-hora-rotulo', '12');
    texto(A, P.cielo, horaX(24), 60, 'rl-noche-txt', 9.5, 'middle', 'medianoche').setAttribute('data-hora-rotulo', '24');

    /* ── el eje, con una rayita cada tres horas ── */
    A.el('line', { x1: X0, y1: Y.eje, x2: X1, y2: Y.eje, 'class': 'rl-eje', 'data-eje': '' }, svg);
    for (var h = H0; h <= H1; h += 3) {
      A.el('line', { x1: r2(horaX(h)), y1: Y.eje, x2: r2(horaX(h)), y2: Y.eje + 5, 'class': 'rl-eje', 'data-rayita': h }, svg);
    }

    /* ── el plazo: la barra que corre, la mano que la empuja y la llave ── */
    P.barra = A.el('path', { d: 'M' + r2(xs) + ' ' + Y.eje + ' L' + r2(xe) + ' ' + Y.eje, 'class': 'rl-barra', 'data-barra': '' }, svg);
    P.mano = A.el('path', { d: 'M' + r2(xs - 5) + ' ' + (Y.eje - 11) + ' L' + r2(xs + 5) + ' ' + (Y.eje - 11) + ' L' + r2(xs) + ' ' + (Y.eje - 3) + ' Z',
                            'class': 'rl-mano am-viaja', 'data-mano': '' }, svg);
    P.marca0 = A.el('line', { x1: r2(xs), y1: Y.eje - 4, x2: r2(xs), y2: Y.eje + 8, 'class': 'rl-marca', 'data-marca': String(VE) }, svg);
    P.marca1 = A.el('line', { x1: r2(xe), y1: Y.eje - 4, x2: r2(xe), y2: Y.eje + 8, 'class': 'rl-marca', 'data-marca': String(VENCE) }, svg);
    P.hora0 = texto(A, svg, xs, Y.hora, 'am-rotulo', 10.5, 'middle', dicho(VE));
    P.hora0.setAttribute('data-hora', String(VE));
    P.hora1 = texto(A, svg, xe, Y.hora, 'am-rotulo', 10.5, 'middle', dicho(VENCE));
    P.hora1.setAttribute('data-hora', String(VENCE));
    P.llave = A.el('path', { d: 'M' + r2(xs) + ' ' + Y.llave + ' Q' + r2(xs) + ' ' + (Y.llave - 6) + ' ' + r2(xs + 6) + ' ' + (Y.llave - 6) +
      ' L' + r2(medio - 6) + ' ' + (Y.llave - 6) + ' Q' + r2(medio) + ' ' + (Y.llave - 6) + ' ' + r2(medio) + ' ' + Y.pico +
      ' Q' + r2(medio) + ' ' + (Y.llave - 6) + ' ' + r2(medio + 6) + ' ' + (Y.llave - 6) +
      ' L' + r2(xe - 6) + ' ' + (Y.llave - 6) + ' Q' + r2(xe) + ' ' + (Y.llave - 6) + ' ' + r2(xe) + ' ' + Y.llave,
      'class': 'rl-llave', 'data-llave': '' }, svg);
    P.plazo = texto(A, svg, medio, Y.rotulo, 'am-rotulo', 12, 'middle', PLAZO + ' horas');
    P.plazo.setAttribute('data-plazo', '');

    /* ── Kenia: el lunes, y otra vez el martes ── */
    P.kenia = [VE, VENCE].map(function (h, i) {
      var g = A.el('g', { 'data-kenia': String(h) }, svg);
      texto(A, g, horaX(h), Y.cara, 'rl-emoji', 22, 'middle', '👧').setAttribute('data-cara', '');
      texto(A, g, horaX(h) + 22, Y.curita, 'rl-emoji', 11, 'middle', '🩹').setAttribute('data-curita', '');
      texto(A, g, horaX(h), Y.nombre, 'am-rotulo', 11, 'middle', 'Kenia').setAttribute('data-nombre', '');
      return g;
    });

    /* ── «mañana veo si sigue»: la espera ── */
    P.piensa = texto(A, svg, medio, Y.piensa, 'am-rotulo', 10.5, 'middle', '«mañana veo si sigue»');
    P.piensa.setAttribute('data-piensa', '');
    P.espera = A.el('path', { d: 'M' + r2(xs + 20) + ' ' + Y.flecha + ' L' + r2(xe - 22) + ' ' + Y.flecha, 'class': 'rl-espera', 'data-espera': '' }, svg);
    P.punta = A.el('path', { d: 'M' + r2(xe - 28) + ' ' + (Y.flecha - 5) + ' L' + r2(xe - 21) + ' ' + Y.flecha + ' L' + r2(xe - 28) + ' ' + (Y.flecha + 5),
                             'class': 'rl-punta', 'data-punta': '' }, svg);
    P.mal = A.el('path', { d: 'M' + r2(xe - 8) + ' ' + (Y.mal - 8) + ' L' + r2(xe + 8) + ' ' + (Y.mal + 8) + ' M' + r2(xe + 8) + ' ' + (Y.mal - 8) + ' L' + r2(xe - 8) + ' ' + (Y.mal + 8),
                           'class': 'rl-mal', 'data-mal': '' }, svg);
    P.acabo = texto(A, svg, ANCHO - 6, Y.acabo, 'am-rotulo', 11, 'end', 'se acabó el plazo');
    P.acabo.setAttribute('data-acabo', '');
    P.precio = texto(A, svg, ANCHO - 6, Y.precio, 'am-rotulo', 10.5, 'end', 'multa, y el informe se debe igual');
    P.precio.setAttribute('data-precio', '');

    /* ── lo que sí: tres cosas, el mismo lunes ── */
    var LO_QUE_SI = ['Anota lo que vio, con fecha y hora.', 'Avisa a la dirección y deja constancia.', 'El informe sale dentro del plazo.'];
    P.lista = A.el('g', { 'data-lista': '' }, svg);
    A.el('rect', { x: 12, y: Y.lista0, width: ANCHO - 24, height: Y.lista1 - Y.lista0, rx: 8, 'class': 'rl-papel', 'data-lista-caja': '' }, P.lista);
    texto(A, P.lista, 24, Y.lista0 + 16, 'rl-tinta', 11.5, 'start', 'Lo que sí, el mismo lunes').setAttribute('data-lista-titulo', '');
    P.hacer = HACER.map(function (h, i) {
      var punto = A.el('g', { 'class': 'rl-punto', 'data-punto': String(i + 1), 'data-punto-hora': String(h) }, svg);
      A.el('circle', { cx: r2(horaX(h)), cy: 41, r: 6 }, punto);
      texto(A, punto, horaX(h), 44.6, 'rl-punto-txt', 9.5, 'middle', String(i + 1));
      var renglon = A.el('g', { 'data-renglon': String(i + 1) }, P.lista);
      var y = Y.lista0 + 34 + i * 16;
      A.el('circle', { cx: 30, cy: y - 3.6, r: 6, 'class': 'rl-num' }, renglon);
      texto(A, renglon, 30, y, 'rl-num-txt', 9.5, 'middle', String(i + 1));
      texto(A, renglon, 42, y, 'rl-tinta-fina', 11, 'start', LO_QUE_SI[i]).setAttribute('data-renglon-txt', '');
      return { punto: punto, renglon: renglon };
    });

    /* ── y el deber es suyo: usted, y a quién se reporta ── */
    P.usted = A.el('g', { 'data-usted': '' }, svg);
    A.el('rect', { x: 12, y: Y.abajo0, width: 52, height: Y.abajo1 - Y.abajo0, rx: 8, 'class': 'rl-papel', 'data-usted-caja': '' }, P.usted);
    texto(A, P.usted, 38, Y.abajo0 + 24, 'rl-emoji', 20, 'middle', '🧑‍🏫').setAttribute('data-cara', '');
    texto(A, P.usted, 38, Y.abajo1 - 6, 'rl-tinta', 10.5, 'middle', 'usted').setAttribute('data-nombre', '');
    P.aro = A.el('rect', { x: 8, y: Y.abajo0 - 4, width: 60, height: Y.abajo1 - Y.abajo0 + 8, rx: 10, 'class': 'rl-aro', 'data-aro': '' }, svg);
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: 76, y: Y.abajo0, width: ANCHO - 88, height: Y.abajo1 - Y.abajo0, rx: 8, 'class': 'rl-papel', 'data-cuaderno-caja': '' }, P.cuaderno);
    texto(A, P.cuaderno, 88, Y.abajo0 + 18, 'rl-tinta', 11, 'start', 'En mi centro se reporta a:').setAttribute('data-cuaderno-txt', '');
    A.el('line', { x1: 88, y1: Y.abajo1 - 10, x2: ANCHO - 24, y2: Y.abajo1 - 10, 'class': 'rl-raya', 'data-raya-escribir': '' }, P.cuaderno);
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso. */
  var ESTADOS = [
    { plazo: false, espera: false, hacer: false, deber: false },
    { plazo: true, espera: false, hacer: false, deber: false },
    { plazo: true, espera: true, hacer: false, deber: false },
    { plazo: true, espera: false, hacer: true, deber: false },
    { plazo: true, espera: false, hacer: true, deber: true }
  ];

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function todo() {
    var out = [P.barra, P.mano, P.marca1, P.hora1, P.llave, P.plazo, P.piensa, P.espera, P.punta, P.mal, P.acabo, P.precio, P.lista, P.usted, P.aro, P.cuaderno];
    P.kenia.forEach(function (k) { out.push(k); });
    P.hacer.forEach(function (o) { out.push(o.punto, o.renglon); });
    return out;
  }
  var CORRE = horaX(VENCE) - horaX(VE);
  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.trazar(P.barra, s.plazo, 0);
      A.ver(P.mano, false, 0);
      A.mover(P.mano, s.plazo ? CORRE : 0, 0, 0, 1, 0);
      A.ver(P.marca1, s.plazo, 0);
      A.ver(P.hora1, s.plazo, 0);
      A.trazar(P.llave, s.plazo, 0);
      A.ver(P.plazo, s.plazo, 0);
      A.ver(P.kenia[1], s.espera, 0);
      A.ver(P.piensa, s.espera, 0);
      A.ver(P.espera, s.espera, 0);
      A.trazar(P.espera, s.espera, 0);
      A.ver(P.punta, s.espera, 0);
      A.ver(P.mal, s.espera, 0);
      A.ver(P.acabo, s.espera, 0);
      A.ver(P.precio, s.espera, 0);
      A.ver(P.lista, s.hacer, 0);
      P.hacer.forEach(function (o) { A.ver(o.punto, s.hacer, 0); A.ver(o.renglon, s.hacer, 0); });
      A.ver(P.usted, s.deber, 0);
      A.ver(P.aro, s.deber, 0);
      A.ver(P.cuaderno, s.deber, 0);
    });
  }

  function pintar(n, antes, A) {
    /* Los pasos que cuentan algo se cuentan cada vez que se ENTRA en ellos,
       también volviendo con «Atrás»; el 0 se pinta siempre. */
    if (n >= 1 && antes === n) return;
    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 1) {
      /* El plazo corre: la barra se llena y la mano la empuja a paso parejo,
         del lunes a las 7:00 hasta la misma hora del martes. Cuando llega,
         sale el martes y se cierra la llave de las veinticuatro horas. */
      base(A, ESTADOS[0]);
      A.ver(P.mano, true, T1.barrido);
      A.trazar(P.barra, true, T1.barrido);
      A.mover(P.mano, CORRE, 0, 0, 1, T1.barrido);
      A.ver(P.marca1, true, T1.vence);
      A.ver(P.hora1, true, T1.vence);
      A.trazar(P.llave, true, T1.llave);
      A.ver(P.plazo, true, T1.rotulo);
      return;
    }
    if (n === 2) {
      /* La espera: se piensa «mañana veo si sigue», la flecha cruza la noche
         entera y Kenia vuelve a entrar justo cuando se acaba el plazo. */
      base(A, ESTADOS[1]);
      A.ver(P.piensa, true, T2.piensa);
      A.ver(P.espera, true, T2.espera);
      A.trazar(P.espera, true, T2.espera);
      A.ver(P.punta, true, T2.vuelve);
      A.ver(P.kenia[1], true, T2.vuelve);
      A.ver(P.mal, true, T2.mal);
      A.ver(P.acabo, true, T2.acabo);
      A.ver(P.precio, true, T2.precio);
      return;
    }
    if (n === 3) {
      /* Lo que sí: se va la espera, y salen las tres cosas del mismo lunes,
         cada una en su hora y en su renglón. */
      base(A, ESTADOS[2]);
      [P.piensa, P.espera, P.punta, P.mal, P.acabo, P.precio, P.kenia[1]].forEach(function (p) { A.ver(p, false, T3.sale); });
      A.ver(P.lista, true, T3.lista);
      P.hacer.forEach(function (o, i) { A.ver(o.punto, true, T3.hacer[i]); A.ver(o.renglon, true, T3.hacer[i]); });
      return;
    }
    /* 4: el deber también es suyo, y a quién se reporta lo anota usted. */
    base(A, ESTADOS[3]);
    A.ver(P.usted, true, T4.usted);
    A.ver(P.aro, true, T4.aro);
    A.ver(P.cuaderno, true, T4.cuaderno);
  }

  var FRASES = [
    'Lunes, 7:00. Kenia entra al aula con un moretón en el brazo, y usted lo ve. ¿Hasta cuándo tiene para informar?',
    'Veinticuatro horas, como máximo. Si lo vio el lunes a las 7:00, el plazo se acaba el martes a la misma hora.',
    'Si espera a mañana «para ver si sigue», el martes a las 7:00 la vuelve a ver, y el plazo ya se acabó. La ley pone multa por no informar, y el informe se debe igual.',
    'Lo que sí, el mismo lunes: anotar lo que vio, con fecha y hora, y avisar a la dirección dejando constancia. Y que el informe salga a tiempo.',
    'La ley no deja el deber solo en el director: nombra también a los responsables directos de los niños en el centro. ¿A quién se reporta hoy en el suyo?'
  ];
  var BOTONES = ['⏳ Contar el plazo', '🤔 ¿Y si espera?', '✅ ¿Qué se hace?', '🧑‍🏫 ¿De quién es?', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['7:00', 'del lunes: usted ve el moretón'],
    [String(PLAZO), 'horas, como máximo'],
    ['0', 'horas le quedan cuando la vuelve a ver'],
    [String(HACER.length), 'cosas, el mismo lunes'],
    ['?', 'a quién se reporta hoy en su centro']
  ];

  AnimacionMision.montar('#amMoreton', {
    vista: [ANCHO, ALTO],
    describe: 'Una línea del tiempo del lunes al martes, con el día y la noche. Kenia entra con un moretón el lunes a las 7:00. ' +
      'El plazo para informar es de veinticuatro horas como máximo, y se acaba el martes a las 7:00. Si se espera a mañana ' +
      'para ver si sigue, el plazo se gasta entero. Lo que sí: anotar, avisar a la dirección y que el informe salga a tiempo.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
