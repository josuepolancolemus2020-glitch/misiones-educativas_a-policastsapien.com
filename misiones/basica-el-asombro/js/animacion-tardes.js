/* ============================================================
   Animación de «El Asombro: por qué preguntamos»
   (Ruta de la Raíz, Filosofía, etapa 1)
   ------------------------------------------------------------
   La historia: el viernes la maestra dejó una pregunta para el lunes.
   A Yensi le tocó «¿Está bien copiar en un examen?», la buscó tres tardes
   (en el libro de Español, en el diccionario de su hermano y en el
   teléfono de su tía), no la encontró y entregó la hoja en blanco. A
   Denis le tocó «¿cuántos departamentos tiene Honduras?» y tardó dos
   minutos. Ninguno se portó mal: las dos preguntas no eran de la misma
   clase.

   Lo que se dibuja: una tabla. Arriba, los tres lugares donde buscó
   Yensi; a la izquierda, las dos preguntas. La lupa de cada uno va de
   lugar en lugar y deja lo que encontró: Denis, la misma respuesta en el
   libro y en el teléfono; Yensi, que no está, qué es copiar y lo que
   opinan otros. Abajo, la hoja del lunes, en blanco, y lo que tenía que
   traer: lo que ella piensa, y su porqué.

   ⚠️ No se nombra ninguna de las tres clases de pregunta: «de hechos», «de
   significado» y «de valor» son las respuestas de la selección múltiple,
   y las enseña la tarjeta de abajo. La escena dice lo que dice la
   historia: una se responde buscando, la otra pensando.

   ⚠️ El 18 no se inventa: es el número de departamentos que trae
   js/data/paises.js («Honduras está dividida en 18 departamentos»), y la
   sonda lo compara con ese archivo. Y del diccionario no se cita ninguna
   definición: una definición escrita de memoria no se publica aquí. Se
   dibuja su renglón y se dice lo único seguro, que dice qué es copiar.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amTardes')) return;

  var ANCHO = 320, ALTO = 240;
  var DEPARTAMENTOS = '18';

  /* ── los tres lugares donde buscó Yensi, en el orden de la historia ── */
  var LUGARES = [
    { k: 'libro', e: '📕', dice: 'el libro', cx: 152 },
    { k: 'dicc', e: '📖', dice: 'el diccionario', cx: 216 },
    { k: 'tel', e: '📱', dice: 'el teléfono', cx: 280 }
  ];
  var CELDA = { medio: 28, alto: 46 };
  var TEJA = { y0: 4, y1: 30, medio: 16 };

  /* ── las dos preguntas, cada una en su renglón ── */
  var FILAS = [
    { k: 'denis', quien: 'Denis', e: '🧒', y0: 56,
      lineas: ['¿Cuántos', 'departamentos', 'tiene Honduras?'], insignia: '🔎 se busca' },
    { k: 'yensi', quien: 'Yensi', e: '👧', y0: 120,
      lineas: ['¿Está bien copiar', 'en un examen?'], insignia: '💭 se piensa' }
  ];
  var CARTA = { x0: 26, x1: 114, tam: 9, renglon: 11 };
  /* Dónde visita la lupa de cada uno, en orden: Denis lo encuentra en el
     libro y lo vuelve a ver igual en el teléfono; Yensi pasa por los tres. */
  var VISITA = { denis: ['libro', 'tel'], yensi: ['libro', 'dicc', 'tel'] };
  var LUPA = { x: 118 };

  /* ── las hojas del lunes y el cuaderno, abajo ──
     La de Denis va debajo de las preguntas y la de Yensi, debajo de donde
     buscó: es la que después tiene que traer lo que ella piensa, y necesita
     el ancho. */
  var HOJA_D = { x0: 26, x1: 114, y0: 180, y1: 236, renglon: 226 };
  var HOJA = { x0: 124, x1: 308, y0: 180, y1: 236, renglones: [210, 228] };
  var CUADERNO = { x0: 26, x1: 308, y0: 180, y1: 236, renglones: [201, 225] };

  /* ── el reloj de la escena ──
     Cada tramo de la lupa dura lo que dura un movimiento (0.8 s) y en cada
     lugar se queda mirando un momento. Lo que encontró aparece cuando la lupa
     se va: encima de la lupa no se lee. En el último lugar no tiene adónde
     seguir, así que se apaga y después aparece lo de ese lugar. */
  var VIAJE = 800, APAGA = 500;
  var T = { arranca: 200, mira: 300 };
  var T2 = { hoja: 400, blanco: 800 };
  var T3 = { denis: 200, yensi: 800, velo: 800 };
  var T4 = { pienso: 300, porque: 800, aro: 1800 };
  var T5 = { cuaderno: 500 };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }
  function lugar(k) { return LUGARES.filter(function (l) { return l.k === k; })[0]; }

  /* Lo que se encuentra en cada celda: un papel del tamaño de la celda,
     con lo suyo encima. Se apaga entero. */
  function papel(A, svg, fila, l) {
    var g = A.el('g', { 'data-hallazgo': fila.k + '-' + l.k }, svg);
    A.el('rect', { x: l.cx - CELDA.medio, y: fila.y0, width: 2 * CELDA.medio, height: CELDA.alto, rx: 5,
                   'class': 'as-papel', 'data-hallazgo-papel': '' }, g);
    return g;
  }
  function tarde(A, g, l, fila, k) {
    texto(A, g, l.cx, fila.y0 + 10, 'as-tarde', 7.5, 'middle', 'tarde ' + k).setAttribute('data-tarde', String(k));
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── los lugares ── */
    P.lugares = LUGARES.map(function (l) {
      var g = A.el('g', { 'data-lugar': l.k }, svg);
      A.el('rect', { x: l.cx - TEJA.medio, y: TEJA.y0, width: 2 * TEJA.medio, height: TEJA.y1 - TEJA.y0, rx: 6,
                     'class': 'as-teja', 'data-teja': '' }, g);
      texto(A, g, l.cx, 23, 'as-icono', 15, 'middle', l.e);
      texto(A, g, l.cx, 40, 'am-rotulo', 8.5, 'middle', l.dice).setAttribute('data-lugar-dice', '');
      return g;
    });

    /* ── las dos preguntas, con quién la tiene ── */
    FILAS.forEach(function (f) {
      var g = A.el('g', { 'data-fila': f.k }, svg);
      texto(A, g, 12, f.y0 + 20, 'as-icono', 15, 'middle', f.e);
      texto(A, g, 12, f.y0 + 34, 'am-rotulo', 8, 'middle', f.quien).setAttribute('data-quien', '');
      A.el('rect', { x: CARTA.x0, y: f.y0, width: CARTA.x1 - CARTA.x0, height: CELDA.alto, rx: 5,
                     'class': 'as-carta', 'data-carta': '' }, g);
      /* Los renglones van centrados en la tarjeta: tres o dos, según la pregunta. */
      var y = f.y0 + CELDA.alto / 2 + 3.2 - CARTA.renglon * (f.lineas.length - 1) / 2;
      f.lineas.forEach(function (r, j) {
        texto(A, g, CARTA.x0 + 6, y + CARTA.renglon * j, 'as-letra', CARTA.tam, 'start', r).setAttribute('data-carta-dice', '');
      });
      /* el hueco de cada lugar en su renglón */
      LUGARES.forEach(function (l) {
        A.el('rect', { x: l.cx - CELDA.medio, y: f.y0, width: 2 * CELDA.medio, height: CELDA.alto, rx: 5,
                       'class': 'as-celda', 'data-celda': l.k }, g);
      });
    });

    /* ── lo que encuentra Denis: el mismo número en el libro y en el teléfono ── */
    var fd = FILAS[0];
    P.halla = {};
    VISITA.denis.forEach(function (k) {
      var l = lugar(k), g = papel(A, svg, fd, l);
      texto(A, g, l.cx, fd.y0 + 30, 'as-dato', 17, 'middle', DEPARTAMENTOS).setAttribute('data-dato', '');
      A.el('path', { d: 'M' + (l.cx + 12) + ' ' + (fd.y0 + 11) + ' L' + (l.cx + 15.5) + ' ' + (fd.y0 + 14.5) +
                     ' L' + (l.cx + 22) + ' ' + (fd.y0 + 7), 'class': 'as-bien', 'data-bien': '' }, g);
      P.halla['denis-' + k] = g;
    });

    /* ── lo que encuentra Yensi, una tarde en cada lugar ── */
    var fy = FILAS[1];
    var gl = papel(A, svg, fy, lugar('libro'));
    tarde(A, gl, lugar('libro'), fy, 1);
    A.el('path', { d: 'M' + (lugar('libro').cx - 10) + ' ' + (fy.y0 + 25) + ' L' + (lugar('libro').cx + 10) + ' ' + (fy.y0 + 25),
                   'class': 'as-nada', 'data-nada': '' }, gl);
    texto(A, gl, lugar('libro').cx, fy.y0 + 40, 'as-letra', 8, 'middle', 'no está').setAttribute('data-hallazgo-dice', '');
    P.halla['yensi-libro'] = gl;

    var ld = lugar('dicc'), gd = papel(A, svg, fy, ld);
    tarde(A, gd, ld, fy, 2);
    texto(A, gd, ld.cx - 22, fy.y0 + 23, 'as-entrada', 8.5, 'start', 'copiar:').setAttribute('data-entrada', '');
    A.el('path', { d: 'M' + (ld.cx - 22) + ' ' + (fy.y0 + 28) + ' L' + (ld.cx + 22) + ' ' + (fy.y0 + 28) +
                   ' M' + (ld.cx - 22) + ' ' + (fy.y0 + 32) + ' L' + (ld.cx + 8) + ' ' + (fy.y0 + 32),
                   'class': 'as-gris', 'data-definicion': '' }, gd);
    texto(A, gd, ld.cx, fy.y0 + 42, 'as-letra', 7.5, 'middle', 'dice qué es').setAttribute('data-hallazgo-dice', '');
    P.halla['yensi-dicc'] = gd;

    var lt = lugar('tel'), gt = papel(A, svg, fy, lt);
    tarde(A, gt, lt, fy, 3);
    /* Tres globos de tres personas, de tres tamaños: cada uno opina lo suyo. */
    [[-14, 21, 8, 5.5], [1, 27, 6.5, 5], [16, 20, 7.5, 5.5]].forEach(function (b) {
      var bg = A.el('g', { 'data-opina': '' }, gt);
      A.el('ellipse', { cx: lt.cx + b[0], cy: fy.y0 + b[1], rx: b[2], ry: b[3], 'class': 'as-globo' }, bg);
      A.el('path', { d: 'M' + (lt.cx + b[0] - 2) + ' ' + (fy.y0 + b[1] + b[3] - 1) + ' L' + (lt.cx + b[0] - 4) + ' ' +
                     (fy.y0 + b[1] + b[3] + 3) + ' L' + (lt.cx + b[0] + 1) + ' ' + (fy.y0 + b[1] + b[3] - 0.5),
                     'class': 'as-globo' }, bg);
      texto(A, bg, lt.cx + b[0], fy.y0 + b[1] + 1.6, 'as-letra', 7, 'middle', '…');
    });
    texto(A, gt, lt.cx, fy.y0 + 42, 'as-letra', 7.5, 'middle', 'otros opinan').setAttribute('data-hallazgo-dice', '');
    P.halla['yensi-tel'] = gt;

    /* ── la lupa de cada uno: un tramo por lugar, uno dentro de otro ── */
    P.lupas = {};
    FILAS.forEach(function (f) {
      var g = A.el('g', { transform: 'translate(' + LUPA.x + ' ' + (f.y0 + CELDA.alto / 2) + ')', 'data-lupa': f.k }, svg);
      var padre = g, tramos = [];
      VISITA[f.k].forEach(function () {
        var t = A.el('g', { 'class': 'am-viaja', 'data-tramo': '' }, padre);
        tramos.push(t);
        padre = t;
      });
      /* Aparece al salir y se va al terminar, en el mismo paso: son dos
         piezas, porque una pieza tiene una sola demora. */
      var ver = A.el('g', { 'data-lupa-ver': '' }, padre);
      var va = A.el('g', { 'data-lupa-va': '' }, ver);
      texto(A, va, 0, 4.5, 'as-icono', 13, 'middle', '🔎');
      P.lupas[f.k] = { tramos: tramos, ver: ver, va: va };
    });

    /* ── lo que no estaba en ninguna parte: un velo sobre lo de Yensi ── */
    P.velo = A.el('rect', { x: LUGARES[0].cx - CELDA.medio - 2, y: fy.y0 - 2, width: LUGARES[2].cx - LUGARES[0].cx + 2 * CELDA.medio + 4,
                            height: CELDA.alto + 4, rx: 6, 'class': 'as-velo', 'data-velo': '' }, svg);

    /* ── cómo se responde cada una: una insignia encima de su tarjeta ── */
    P.insignias = FILAS.map(function (f) {
      var g = A.el('g', { 'data-insignia': f.k }, svg);
      var w = f.k === 'denis' ? 50 : 54;
      A.el('rect', { x: CARTA.x1 - w, y: f.y0 - 13, width: w, height: 11, rx: 5.5, 'class': 'as-insignia', 'data-insignia-caja': '' }, g);
      texto(A, g, CARTA.x1 - w / 2, f.y0 - 4.6, 'as-insignia-letra', 8, 'middle', f.insignia).setAttribute('data-insignia-dice', '');
      return g;
    });

    /* ── la hoja que entrega Denis el lunes ── */
    P.hojaD = A.el('g', { 'data-hoja-denis': '' }, svg);
    A.el('rect', { x: HOJA_D.x0, y: HOJA_D.y0, width: HOJA_D.x1 - HOJA_D.x0, height: HOJA_D.y1 - HOJA_D.y0, rx: 4,
                   'class': 'as-hoja', 'data-hoja-caja': '' }, P.hojaD);
    texto(A, P.hojaD, HOJA_D.x0 + 6, HOJA_D.y0 + 12, 'as-tarde', 8, 'start', 'Denis, el lunes').setAttribute('data-hoja-dia', '');
    A.el('path', { d: 'M' + (HOJA_D.x0 + 8) + ' ' + HOJA_D.renglon + ' L' + (HOJA_D.x1 - 8) + ' ' + HOJA_D.renglon,
                   'class': 'as-renglon', 'data-renglon': '' }, P.hojaD);
    texto(A, P.hojaD, (HOJA_D.x0 + HOJA_D.x1) / 2, HOJA_D.renglon - 3, 'as-dato', 17, 'middle', DEPARTAMENTOS).setAttribute('data-dato', '');

    /* ── la hoja de Yensi ── */
    P.hoja = A.el('g', { 'data-hoja': '' }, svg);
    A.el('rect', { x: HOJA.x0, y: HOJA.y0, width: HOJA.x1 - HOJA.x0, height: HOJA.y1 - HOJA.y0, rx: 4,
                   'class': 'as-hoja', 'data-hoja-caja': '' }, P.hoja);
    texto(A, P.hoja, HOJA.x0 + 6, HOJA.y0 + 12, 'as-tarde', 8, 'start', 'Yensi, el lunes').setAttribute('data-hoja-dia', '');
    /* En blanco, cada renglón es una raya cortada de punta a punta; con lo
       que ella piensa, la raya entera empieza después de su palabra. */
    P.blancos = HOJA.renglones.map(function (y) {
      return A.el('path', { d: 'M' + (HOJA.x0 + 6) + ' ' + y + ' L' + (HOJA.x1 - 8) + ' ' + y, 'class': 'as-blanco', 'data-renglon-blanco': '' }, P.hoja);
    });
    P.piensa = [['Pienso que', 49.4], ['porque', 34.4]].map(function (r, j) {
      var g = A.el('g', { 'data-piensa': String(j) }, P.hoja);
      var y = HOJA.renglones[j];
      texto(A, g, HOJA.x0 + 6, y - 2, 'as-letra', 9, 'start', r[0]).setAttribute('data-piensa-dice', '');
      A.el('path', { d: 'M' + (HOJA.x0 + 6 + r[1]) + ' ' + y + ' L' + (HOJA.x1 - 8) + ' ' + y, 'class': 'as-renglon', 'data-renglon': '' }, g);
      return g;
    });
    P.aro = A.el('rect', { x: HOJA.x0 + 3, y: HOJA.renglones[1] - 13, width: 34.4, height: 15, rx: 7,
                           'class': 'as-aro', 'data-aro': '' }, P.hoja);
    P.blanco = texto(A, P.hoja, HOJA.x1 - 6, HOJA.y0 + 12, 'as-tarde', 8, 'end', 'en blanco');
    P.blanco.setAttribute('data-en-blanco', '');

    /* ── el cuaderno del final, en el lugar de la hoja ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUADERNO.x0, y: CUADERNO.y0, width: CUADERNO.x1 - CUADERNO.x0, height: CUADERNO.y1 - CUADERNO.y0, rx: 5,
                   'class': 'as-cuaderno', 'data-cuaderno-caja': '' }, P.cuaderno);
    CUADERNO.renglones.forEach(function (y) {
      texto(A, P.cuaderno, CUADERNO.x0 + 6, y, 'as-letra', 9, 'start', 'Mi pregunta:');
      A.el('path', { d: 'M' + (CUADERNO.x0 + 62) + ' ' + (y + 1) + ' L' + (CUADERNO.x1 - 64) + ' ' + (y + 1),
                     'class': 'as-renglon', 'data-raya-escribir': '' }, P.cuaderno);
      texto(A, P.cuaderno, CUADERNO.x1 - 6, y, 'as-letra', 9, 'end', '¿🔎 o 💭?');
    });
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso. denis y yensi: si ya buscó cada uno;
     hojaD y hoja: si se ve la hoja del lunes de cada uno; insignias: si ya se
     dice cómo se responde cada una (y el velo sobre lo de Yensi); piensa: si
     la hoja de Yensi ya trae lo que ella piensa; cuaderno: si sale el
     cuaderno del final, que va en el lugar de las dos hojas. */
  var ESTADOS = [
    { denis: false, yensi: false, hojaD: false, hoja: false, insignias: false, piensa: false, cuaderno: false },
    { denis: true, yensi: false, hojaD: true, hoja: false, insignias: false, piensa: false, cuaderno: false },
    { denis: true, yensi: true, hojaD: true, hoja: true, insignias: false, piensa: false, cuaderno: false },
    { denis: true, yensi: true, hojaD: true, hoja: true, insignias: true, piensa: false, cuaderno: false },
    { denis: true, yensi: true, hojaD: true, hoja: true, insignias: true, piensa: true, cuaderno: false },
    { denis: true, yensi: true, hojaD: false, hoja: false, insignias: true, piensa: true, cuaderno: true }
  ];

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function todo() {
    var lista = [P.velo, P.hojaD, P.hoja, P.blanco, P.aro, P.cuaderno].concat(P.insignias, P.blancos, P.piensa);
    Object.keys(P.halla).forEach(function (k) { lista.push(P.halla[k]); });
    Object.keys(P.lupas).forEach(function (k) { lista = lista.concat(P.lupas[k].tramos, [P.lupas[k].ver, P.lupas[k].va]); });
    return lista;
  }
  /* La lupa de una fila: cuántos tramos lleva hechos. */
  function lupa(A, k, hechos, demoras) {
    var l = P.lupas[k], x = LUPA.x;
    l.tramos.forEach(function (t, j) {
      var destino = lugar(VISITA[k][j]).cx, dx = j < hechos ? destino - x : 0;
      if (j < hechos) x = destino;
      A.mover(t, dx, 0, 0, 1, demoras ? demoras[j] : 0);
    });
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      ['denis', 'yensi'].forEach(function (k) {
        lupa(A, k, s[k] ? VISITA[k].length : 0);
        A.ver(P.lupas[k].ver, false, 0);
        A.ver(P.lupas[k].va, true, 0);
        VISITA[k].forEach(function (v) { A.ver(P.halla[k + '-' + v], s[k], 0); });
      });
      P.insignias.forEach(function (g) { A.ver(g, s.insignias, 0); });
      A.ver(P.velo, s.insignias, 0);
      A.ver(P.hojaD, s.hojaD, 0);
      A.ver(P.hoja, s.hoja, 0);
      P.blancos.forEach(function (b) { A.ver(b, !s.piensa, 0); });
      P.piensa.forEach(function (g) { A.ver(g, s.piensa, 0); });
      A.ver(P.aro, s.piensa, 0);
      A.ver(P.blanco, !s.piensa, 0);
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }
  /* La lupa sale de su tarjeta, va de lugar en lugar y deja lo que
     encontró al irse. Devuelve cuándo empieza a verse lo del último lugar. */
  function busca(A, k) {
    var demoras = [], t = T.arranca, n = VISITA[k].length;
    A.ver(P.lupas[k].ver, true, 0);
    VISITA[k].forEach(function (v, j) {
      demoras.push(t);
      t += VIAJE + T.mira;
      A.ver(P.halla[k + '-' + v], true, j < n - 1 ? t : t + APAGA);
    });
    lupa(A, k, n, demoras);
    A.ver(P.lupas[k].va, false, t);
    return t + APAGA;
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
      A.ver(P.hojaD, false, 0);
      A.ver(P.hoja, false, 0);
      A.ver(P.cuaderno, true, T5.cuaderno);
      return;
    }
    if (n === 1) {
      base(A, ESTADOS[0]);
      A.ver(P.hojaD, true, busca(A, 'denis') + T2.hoja);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      A.ver(P.blanco, false, 0);
      var fin = busca(A, 'yensi');
      A.ver(P.hoja, true, fin + T2.hoja);
      A.ver(P.blanco, true, fin + T2.blanco);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      A.ver(P.insignias[0], true, T3.denis);
      A.ver(P.insignias[1], true, T3.yensi);
      A.ver(P.velo, true, T3.velo);
      return;
    }
    base(A, ESTADOS[3]);
    A.ver(P.blanco, false, 0);
    P.blancos.forEach(function (b, j) { A.ver(b, false, j ? T4.porque : T4.pienso); });
    /* Cada renglón se escribe cuando su raya en blanco ya se fue. */
    A.ver(P.piensa[0], true, T4.pienso + APAGA);
    A.ver(P.piensa[1], true, T4.porque + APAGA);
    A.ver(P.aro, true, T4.aro);
  }

  var FRASES = [
    'El viernes dejaron dos preguntas para el lunes. Denis tardó dos minutos, y Yensi, tres tardes. ¿Por qué?',
    'Denis la busca en el libro: dice ' + DEPARTAMENTOS + '. En el teléfono, también: la misma respuesta. El lunes la entrega.',
    'Yensi la busca tres tardes. El libro no la trae. El diccionario dice qué es copiar, no si está bien. En el teléfono, cada uno opina otra cosa.',
    'Ninguno se portó mal. La de Denis se responde buscando. La de Yensi no estaba en ninguna parte: se responde pensando.',
    'Su hoja no tenía que traer algo encontrado. Tenía que traer lo que ella piensa, y su porqué.',
    'Ahora tú: escribe dos preguntas tuyas. Antes de buscar, decide: ¿se responde buscando o pensando?'
  ];
  var BOTONES = ['🔎 Que busque Denis', '🔎 Que busque Yensi', '❓ ¿Qué cambió?', '💭 ¿Y su hoja?', '✍️ ¿Y tú?', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['2', 'preguntas para el lunes'],
    [DEPARTAMENTOS, 'en el libro y en el teléfono'],
    ['3', 'tardes, y la hoja en blanco'],
    ['2', 'maneras de responder'],
    ['2', 'rayas: lo que piensa y su porqué'],
    ['2', 'preguntas tuyas, en tu cuaderno']
  ];

  AnimacionMision.montar('#amTardes', {
    vista: [ANCHO, ALTO],
    describe: 'Denis y Yensi tienen una pregunta cada uno. La de Denis está en el libro y en el teléfono, y el lunes la entrega. ' +
      'La de Yensi no está en ninguna parte, y entrega la hoja en blanco. Una se responde buscando, y la otra, pensando.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
