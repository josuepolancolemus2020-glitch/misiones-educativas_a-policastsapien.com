/* ============================================================
   Animación de «Leer una expectativa de logro sin marearse»
   (misión del maestro, sección «Aprende», detrás de la expectativa
   leída en voz alta)
   ------------------------------------------------------------
   Lo que enseña: una expectativa ya trae la clase. La de Ciencias
   Naturales de primero se parte en sus pedazos, y cada pedazo se vuelve
   algo que se ve en el patio: lo que hace la niña (agrupar), con qué
   (diez cosas que se pueden señalar), en qué montones (seres no vivos y
   seres vivos, y los vivos en plantas y animales) y lo que tiene que
   quedar al final (que hay muchas clases distintas de seres vivos).

   Y lo que cuesta no leerla entera: nombra DOS tipos de seres vivos, los
   más evidentes. Kenia encuentra un hongo, que no es ninguno de los dos.
   Si el examen de primero lo pregunta, pierde un punto por algo que
   todavía no le toca: los hongos llegan en tercero.

   De dónde sale: la expectativa es la cita del primer peldaño de la
   misión (PELDANOS[0].cita, en js/leer-expectativa.js), y la escena la
   lee de ahí: si dejara de tener sus pedazos, no se monta y queda la
   frase de reserva. Las diez cosas y los dos montones son el plan que la
   tarjeta de arriba escribe. Que el hongo no es planta ni animal lo dice
   el propio DCNB (los seis reinos, dcneb-basica-i-ciclo.pdf, pág. 377 del
   archivo), y que llega en tercero, la tabla de Tercer Grado (pág. 424):
   la sonda lo comprueba en _dev/dcnb, no aquí.

   ⚠️ No es una FILA de la tabla: es de la lista del grado («Al finalizar
   el Primer Grado…», pág. 394 del archivo), y la última sección de la
   misión la pone de ejemplo justo de eso. Por eso la escena dice
   «expectativa» y nunca «fila», y la sonda lo vigila.

   ⚠️ Lo que NO se dice, y a propósito: cómo se llaman los pedazos de una
   expectativa ni lo que dice cada uno en general (son el quiz, el
   completar y el memorama), dónde está en el documento, ni cómo se
   evalúa. Se ve el caso; el nombre lo pone la tarjeta de arriba.

   Lo escrito en el papel lleva su ancho medido con la Fredoka (AV, por
   cada 100 px) y `textLength`: el subrayado de cada pedazo se pone antes
   de que llegue la letra.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPatio')) return;
  if (typeof PELDANOS === 'undefined' || !Array.isArray(PELDANOS) || !PELDANOS[0]) return;

  var ANCHO = 320, ALTO = 348;

  /* ── lo que dice la misión ─────────────────────────────────── */
  var CITA = String(PELDANOS[0].cita || '');
  var M = /^(Clasifican) (los elementos ambientales) (en (seres no vivos) y (seres vivos),) (y éstos en (los dos tipos más evidentes), (plantas) y (animales),) (con énfasis en el componente (diversidad)\.)$/.exec(CITA);
  if (!M) return;
  var aprende = document.getElementById('sec-aprende');
  if (!aprende || !/diez cosas/.test(aprende.textContent)) return;
  var NV = M[4], VI = M[5], PL = M[8], AN = M[9];

  /* ── las medidas de la letra (Fredoka 600, por cada 100 px) ── */
  var AV = {
    a: 56.3, b: 56.3, c: 50.5, d: 56.5, e: 53.7, f: 40.5, g: 55.2, h: 55.4, i: 24.2, j: 23.6, k: 50.4, l: 30.1, m: 80.3,
    n: 56.3, o: 55.9, p: 55.2, q: 55.1, r: 42.3, s: 45.8, t: 41.1, u: 56, v: 56.4, w: 74.6, x: 52.3, y: 55.9, z: 54,
    A: 70.9, B: 61.9, C: 64.3, D: 66.7, E: 61, F: 61.9, G: 71.5, H: 66.2, I: 23.2, J: 53.6, K: 59.5, L: 56.5, M: 81.4,
    N: 68.3, O: 72.5, P: 59.7, Q: 79.2, R: 61.1, S: 54.6, T: 64.8, U: 68.8, V: 72.7, W: 95.3, X: 69.1, Y: 63.8, Z: 59,
    'á': 56.3, 'é': 53.7, 'í': 22.5, 'ó': 55.9, 'ú': 56, 'ñ': 56.3, 'Ñ': 68.3, ' ': 24.1, ',': 22.4, '.': 21.7, ':': 22.5,
    '¿': 47.5, '?': 48.1, '¡': 24.3, '!': 24.2, '«': 61.6, '»': 61
  };
  function ancho(t, tam) {
    var s = 0;
    for (var i = 0; i < t.length; i++) s += AV[t.charAt(i)] != null ? AV[t.charAt(i)] : 55;
    return Math.round(s * tam) / 100;
  }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* ── el papel de la expectativa: cada pedazo en su renglón ── */
  var HOJA = { x0: 8, x1: 312, y0: 6, y1: 100 };
  var TAM = 12, X0 = 18, RENGLON = [24, 40.5, 57, 73.5, 90], BAJO = 4.4;
  /* cada trozo: [texto, renglón, pedazo (1 a 5, o 0 si no es de ninguno), el límite].
     ⚠️ Ningún trozo acaba en espacio: el SVG se come el espacio del final de
     un texto y «en los» salía «enlos». El espacio va en su propio trozo,
     que no pinta nada y solo corre el siguiente. */
  var TROZOS = [
    ['«', 0, 0], [M[1], 0, 1], [' ', 0, 0], [M[2], 0, 2],
    [M[3], 1, 3],
    ['y éstos en', 2, 4], [' ', 2, 4], [M[7], 2, 4, true], [',', 2, 4],
    [M[8] + ' y ' + M[9] + ',', 3, 4],
    [M[10], 4, 5], ['»', 4, 0]
  ];
  /* el papel, leído de corrido, es la cita tal cual */
  var leida = RENGLON.map(function (y, r) {
    return TROZOS.filter(function (t) { return t[1] === r; }).map(function (t) { return t[0]; }).join('');
  }).join(' ');
  if (leida !== '«' + CITA + '»') return;

  /* ── el patio: diez cosas revueltas, y dónde quedan en cada reparto ──
     Cada una: [nombre, emoji, de qué es, en el patio, en los dos montones,
     en los cuatro]. Las de abajo salen primero (están más cerca), y por eso
     ninguna pasa por encima de otra que espera: lo mide la sonda. */
  var EMOJI = 18;
  var COSAS = [
    ['árbol', '🌳', 'planta', [34, 128], [150, 252], [142, 270]],
    ['lata', '🥫', 'no', [82, 128], [76, 252]],
    ['gallina', '🐔', 'animal', [130, 128], [212, 252], [240, 270]],
    ['agua', '💧', 'no', [178, 128], [76, 298]],
    ['perro', '🐕', 'animal', [226, 128], [274, 252], [282, 270]],
    ['piedra', '🪨', 'no', [58, 164], [36, 298]],
    ['flor', '🌻', 'planta', [106, 164], [150, 298], [163, 310]],
    ['pelota', '⚽', 'no', [154, 164], [36, 252]],
    ['zacate', '🌿', 'planta', [202, 164], [212, 298], [184, 270]],
    ['mariposa', '🦋', 'animal', [250, 164], [274, 298], [261, 310]]
  ];
  function sitio(i, reparto) {
    var c = COSAS[i];
    if (reparto === 'patio') return c[3];
    if (reparto === 'dos' || c[2] === 'no') return c[4];
    return c[5];
  }
  var TODAS = COSAS.map(function (c, i) { return i; });
  /* el orden en que se mueven: primero la fila de abajo del patio, de
     izquierda a derecha, y después la de arriba */
  var ORDEN_DOS = TODAS.slice().sort(function (a, b) { return COSAS[b][3][1] - COSAS[a][3][1] || COSAS[a][3][0] - COSAS[b][3][0]; });
  var VIVAS = TODAS.filter(function (i) { return COSAS[i][2] !== 'no'; });
  var ORDEN_CUATRO = VIVAS.slice().sort(function (a, b) { return COSAS[a][4][0] - COSAS[b][4][0] || COSAS[a][4][1] - COSAS[b][4][1]; });
  /* y al señalarlas, como se lee: renglón por renglón */
  var ORDEN_LEE = TODAS.slice().sort(function (a, b) { return COSAS[a][3][1] - COSAS[b][3][1] || COSAS[a][3][0] - COSAS[b][3][0]; });

  /* los montones, dibujados en el suelo: el de los no vivos primero, como
     los nombra la expectativa; los de las plantas y los animales, dentro
     del de los vivos */
  var MONTON = {
    no: { x0: 8, x1: 104, y0: 210, y1: 342, rot: 204, tam: 10.5, clase: 'pt-monton', txt: NV },
    vi: { x0: 112, x1: 312, y0: 210, y1: 342, rot: 204, tam: 10.5, clase: 'pt-monton', txt: VI },
    pl: { x0: 120, x1: 206, y0: 226, y1: 336, rot: 244, tam: 10, clase: 'pt-monton2', txt: PL },
    an: { x0: 218, x1: 304, y0: 226, y1: 336, rot: 244, tam: 10, clase: 'pt-monton2', txt: AN }
  };
  var NOMBRE_BAJA = 18;               /* el nombre de cada ser vivo, debajo de él */

  /* Kenia, parada a la derecha del patio, y el hongo que encuentra */
  var KENIA = { x: 292, pies: 184 };
  var HONGO = { sale: [270, 174], llega: [108, 146], r: 14 };
  var GLOBO = { x0: 220, x1: 274, y0: 110, y1: 130 };

  /* ── el reloj de la escena ── */
  var MUEVE = 800;                    /* lo que tarda una cosa en ir a su montón */
  var T1 = { p1: 0, p2: 500, senal: 1000, cada: 140 };
  var T2 = { p3: 0, monton: 400, mueve: 900, cada: 150 };
  T2.rotulo = T2.mueve + T2.cada * (ORDEN_DOS.length - 1) + MUEVE + 100;
  var T3 = { p4: 0, mueve: 500, cada: 180 };
  T3.monton = T3.mueve + T3.cada * (ORDEN_CUATRO.length - 1) + MUEVE + 100;
  T3.rotulo = T3.monton + 400;
  var T4 = { caja: 0, globo: 500, hongo: 500, vuela: 1300, aro: 2200, ni: 2500, tercero: 2900 };
  var T5 = { p5: 0, nombre: 500, cada: 220 };
  var T6 = { sale: 0, cuaderno: 500 };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido, medido) {
    var at = { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' };
    if (medido) { at.textLength = ancho(contenido, tam); at.lengthAdjust = 'spacing'; }
    var n = A.el('text', at, padre);
    n.textContent = contenido;
    return n;
  }
  /* un rectángulo de esquinas redondas hecho camino: así se dibuja poco a
     poco, como se marca un montón con un palo en el suelo */
  function caja(x0, y0, x1, y1, r) {
    return 'M' + (x0 + r) + ' ' + y0 + ' H' + (x1 - r) + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + r) +
      ' V' + (y1 - r) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - r) + ' ' + y1 + ' H' + (x0 + r) +
      ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - r) + ' V' + (y0 + r) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + r) + ' ' + y0 + ' Z';
  }

  /* Kenia: piernas, falda del uniforme, blusa, brazos, cabeza y pelo, con
     su nombre encima. */
  function kenia(A, padre) {
    var x = KENIA.x, s = KENIA.pies;
    var g = A.el('g', { 'data-kenia': '' }, padre);
    A.el('rect', { x: x - 4, y: s - 9, width: 3, height: 9, rx: 1, 'class': 'pt-piel', 'data-pie': '' }, g);
    A.el('rect', { x: x + 1, y: s - 9, width: 3, height: 9, rx: 1, 'class': 'pt-piel', 'data-pie': '' }, g);
    A.el('path', { d: 'M' + (x - 5) + ' ' + (s - 20) + ' L' + (x + 5) + ' ' + (s - 20) + ' L' + (x + 8) + ' ' + (s - 8) + ' L' + (x - 8) + ' ' + (s - 8) + ' Z', 'class': 'pt-falda' }, g);
    A.el('rect', { x: x - 6, y: s - 32, width: 12, height: 13, rx: 3, 'class': 'pt-blusa' }, g);
    A.el('path', { d: 'M' + (x - 5) + ' ' + (s - 29) + ' L' + (x - 9) + ' ' + (s - 19), 'class': 'pt-brazo' }, g);
    A.el('path', { d: 'M' + (x + 5) + ' ' + (s - 29) + ' L' + (x + 9) + ' ' + (s - 19), 'class': 'pt-brazo' }, g);
    A.el('circle', { cx: x, cy: s - 38.5, r: 6.5, 'class': 'pt-piel', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 6.5) + ' ' + (s - 39) + ' Q' + (x - 5.7) + ' ' + (s - 46.5) + ' ' + x + ' ' + (s - 45.6) +
      ' Q' + (x + 5.7) + ' ' + (s - 46.5) + ' ' + (x + 6.5) + ' ' + (s - 39) + ' Q' + x + ' ' + (s - 42.5) + ' ' + (x - 6.5) + ' ' + (s - 39) + ' Z',
      'class': 'pt-pelo' }, g);
    A.el('circle', { cx: x + 7.5, cy: s - 42, r: 2.6, 'class': 'pt-pelo' }, g);
    texto(A, g, x, s - 52, 'am-rotulo', 10.5, 'middle', 'Kenia').setAttribute('data-nombre', '');
    return g;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── la expectativa, escrita en su papel ── */
    P.hoja = A.el('g', { 'data-hoja': '' }, svg);
    A.el('rect', { x: HOJA.x0, y: HOJA.y0, width: HOJA.x1 - HOJA.x0, height: HOJA.y1 - HOJA.y0, rx: 6, 'class': 'pt-papel', 'data-hoja-papel': '' }, P.hoja);
    P.subraya = {};
    var x = X0, r = 0, tramos = [], puestos = [];
    TROZOS.forEach(function (t, i) {
      if (t[1] !== r) { r = t[1]; x = X0; }
      var w = ancho(t[0], TAM), y = RENGLON[t[1]];
      if (t[0].trim()) {
        puestos.push({ i: i, t: t, x: x, y: y });
        if (t[3]) P.limite = { x0: x, x1: x + w, y: y };
        /* los trozos seguidos de un mismo pedazo, en un mismo renglón, van
           bajo UNA raya: de la primera letra a la última */
        var u = tramos[tramos.length - 1];
        if (t[2] && u && u.pedazo === t[2] && u.renglon === t[1]) u.x1 = x + w;
        else if (t[2]) tramos.push({ pedazo: t[2], renglon: t[1], x0: x, x1: x + w, y: y });
      }
      x += w;
    });
    /* «los dos tipos más evidentes», con resaltador: va DEBAJO de la letra.
       Un recuadro necesitaba aire a los dos lados y se montaba en «en» y en
       la coma, que van a un espacio de ella. Y termina donde termina la
       palabra: la coma va pegada, y un resaltador medio punto más largo ya
       la cubría. */
    P.limiteCaja = A.el('rect', { x: r2(P.limite.x0 - 0.5), y: r2(P.limite.y - 10), width: r2(P.limite.x1 - P.limite.x0 + 0.5), height: 13.5, rx: 2,
      'class': 'pt-limite', 'data-limite-caja': '' }, P.hoja);
    puestos.forEach(function (p) {
      var n = texto(A, P.hoja, p.x, p.y, 'pt-tinta', TAM, 'start', p.t[0], true);
      n.setAttribute('data-trozo', p.i);
      if (p.t[2]) n.setAttribute('data-pedazo', p.t[2]);
      if (p.t[3]) n.setAttribute('data-limite', '');
    });
    /* el subrayado va debajo de lo que bajan las letras */
    tramos.forEach(function (u) {
      var s = A.el('path', { d: 'M' + r2(u.x0) + ' ' + r2(u.y + BAJO) + ' L' + r2(u.x1) + ' ' + r2(u.y + BAJO), 'class': 'pt-subraya', 'data-subraya': u.pedazo }, P.hoja);
      (P.subraya[u.pedazo] = P.subraya[u.pedazo] || []).push(s);
    });

    /* ── los montones ── */
    P.monton = {}; P.montonTxt = {};
    Object.keys(MONTON).forEach(function (k) {
      var m = MONTON[k];
      P.monton[k] = A.el('path', { d: caja(m.x0, m.y0, m.x1, m.y1, 14), 'class': m.clase, 'data-monton': m.txt }, svg);
      var t = texto(A, svg, (m.x0 + m.x1) / 2, m.rot, 'am-rotulo', m.tam, 'middle', m.txt);
      t.setAttribute('data-monton-txt', m.txt);
      P.montonTxt[k] = t;
    });

    /* ── las diez cosas: cada una en su sobre, que la lleva de un sitio a
       otro, y su aro de «se puede señalar» ── */
    P.senal = []; P.cosa = []; P.nombre = {};
    COSAS.forEach(function (c) {
      P.senal.push(A.el('circle', { cx: c[3][0], cy: c[3][1], r: 13, 'class': 'pt-senal', 'data-senal': c[0] }, svg));
    });
    COSAS.forEach(function (c, i) {
      var g = A.el('g', { 'data-cosa': c[0], 'data-es': c[2] }, svg);
      texto(A, g, 0, EMOJI / 3, 'pt-emoji', EMOJI, 'middle', c[1]).setAttribute('data-emoji', '');
      P.cosa.push(g);
      if (c[2] !== 'no') {
        var nm = texto(A, g, 0, NOMBRE_BAJA, 'am-rotulo', 9.5, 'middle', c[0]);
        nm.setAttribute('data-nombre-de', c[0]);
        P.nombre[i] = nm;
      }
    });

    /* ── Kenia, su pregunta y el hongo ── */
    P.kenia = kenia(A, svg);
    P.globo = A.el('g', { 'data-globo': '' }, svg);
    A.el('path', { d: 'M' + (GLOBO.x0 + 4) + ' ' + GLOBO.y0 + ' L' + (GLOBO.x1 - 4) + ' ' + GLOBO.y0 + ' Q' + GLOBO.x1 + ' ' + GLOBO.y0 + ' ' + GLOBO.x1 + ' ' + (GLOBO.y0 + 4) +
      ' L' + GLOBO.x1 + ' ' + (GLOBO.y1 - 6) + ' L' + (KENIA.x - 8) + ' ' + (KENIA.pies - 40) + ' L' + (GLOBO.x1 - 6) + ' ' + GLOBO.y1 +
      ' L' + (GLOBO.x0 + 4) + ' ' + GLOBO.y1 + ' Q' + GLOBO.x0 + ' ' + GLOBO.y1 + ' ' + GLOBO.x0 + ' ' + (GLOBO.y1 - 4) +
      ' L' + GLOBO.x0 + ' ' + (GLOBO.y0 + 4) + ' Q' + GLOBO.x0 + ' ' + GLOBO.y0 + ' ' + (GLOBO.x0 + 4) + ' ' + GLOBO.y0 + ' Z',
      'class': 'pt-globo', 'data-globo-caja': '' }, P.globo);
    texto(A, P.globo, (GLOBO.x0 + GLOBO.x1) / 2, GLOBO.y0 + 14, 'pt-tinta', 10.5, 'middle', '¿Y este?').setAttribute('data-globo-txt', '');
    /* el hongo: un sobre que lo lleva y otro que lo enciende (una pieza
       tiene una sola demora) */
    P.hongo = A.el('g', { 'data-hongo': '' }, svg);
    P.hongoVe = A.el('g', { 'data-hongo-ve': '' }, P.hongo);
    texto(A, P.hongoVe, 0, EMOJI / 3, 'pt-emoji', EMOJI, 'middle', '🍄').setAttribute('data-emoji', '');
    P.aro = A.el('circle', { cx: HONGO.llega[0], cy: HONGO.llega[1], r: HONGO.r, 'class': 'pt-aro', 'data-hongo-aro': '' }, svg);
    P.ni = texto(A, svg, HONGO.llega[0], HONGO.llega[1] + HONGO.r + 12, 'am-rotulo', 9.5, 'middle', 'ni planta ni animal');
    P.ni.setAttribute('data-hongo-txt', 'ni');
    P.tercero = texto(A, svg, HONGO.llega[0], HONGO.llega[1] + HONGO.r + 25, 'am-rotulo', 9.5, 'middle', 'llega en tercero');
    P.tercero.setAttribute('data-hongo-txt', 'tercero');

    /* ── el cuaderno: sale donde estaba la expectativa ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: HOJA.x0, y: HOJA.y0, width: HOJA.x1 - HOJA.x0, height: HOJA.y1 - HOJA.y0, rx: 6, 'class': 'pt-papel', 'data-cuaderno-papel': '' }, P.cuaderno);
    texto(A, P.cuaderno, HOJA.x0 + 10, HOJA.y0 + 22, 'pt-tinta', 12, 'start', 'La expectativa:').setAttribute('data-pide', '');
    A.el('path', { d: 'M' + (HOJA.x0 + 10) + ' ' + (HOJA.y0 + 40) + ' L' + (HOJA.x1 - 10) + ' ' + (HOJA.y0 + 40), 'class': 'pt-raya', 'data-raya': '' }, P.cuaderno);
    texto(A, P.cuaderno, HOJA.x0 + 10, HOJA.y0 + 62, 'pt-tinta', 12, 'start', 'Lo que voy a ver hacer:').setAttribute('data-pide', '');
    A.el('path', { d: 'M' + (HOJA.x0 + 10) + ' ' + (HOJA.y0 + 80) + ' L' + (HOJA.x1 - 10) + ' ' + (HOJA.y0 + 80), 'class': 'pt-raya', 'data-raya': '' }, P.cuaderno);
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* Al TERMINAR cada paso: qué pedazos van subrayados (y cuáles quedan
     tenues), dónde están las cosas, qué montones se ven y qué más. */
  var ESTADOS = [
    { subraya: [], tenue: [], limite: false, senal: false, reparto: 'patio', montones: 0, hongo: false, globo: false, nombres: false, hoja: true, cuaderno: false },
    { subraya: [1, 2], tenue: [], limite: false, senal: true, reparto: 'patio', montones: 0, hongo: false, globo: false, nombres: false, hoja: true, cuaderno: false },
    { subraya: [3], tenue: [1, 2], limite: false, senal: false, reparto: 'dos', montones: 1, hongo: false, globo: false, nombres: false, hoja: true, cuaderno: false },
    { subraya: [4], tenue: [1, 2, 3], limite: false, senal: false, reparto: 'cuatro', montones: 2, hongo: false, globo: false, nombres: false, hoja: true, cuaderno: false },
    { subraya: [], tenue: [1, 2, 3, 4], limite: true, senal: false, reparto: 'cuatro', montones: 2, hongo: true, globo: true, nombres: false, hoja: true, cuaderno: false },
    { subraya: [5], tenue: [1, 2, 3, 4], limite: false, senal: false, reparto: 'cuatro', montones: 2, hongo: true, globo: false, nombres: true, hoja: true, cuaderno: false },
    { subraya: [5], tenue: [1, 2, 3, 4], limite: false, senal: false, reparto: 'cuatro', montones: 2, hongo: true, globo: false, nombres: true, hoja: false, cuaderno: true }
  ];

  function todo() {
    var l = [P.limiteCaja, P.globo, P.hongo, P.hongoVe, P.aro, P.ni, P.tercero, P.cuaderno, P.hoja].concat(P.senal).concat(P.cosa);
    Object.keys(P.nombre).forEach(function (k) { l.push(P.nombre[k]); });
    Object.keys(P.subraya).forEach(function (k) { l = l.concat(P.subraya[k]); });
    Object.keys(P.monton).forEach(function (k) { l.push(P.monton[k], P.montonTxt[k]); });
    return l;
  }
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function subrayar(A, s, d) {
    Object.keys(P.subraya).forEach(function (k) {
      var n = +k, ve = s.subraya.indexOf(n) >= 0 || s.tenue.indexOf(n) >= 0;
      P.subraya[k].forEach(function (p) {
        A.ver(p, ve, d);
        A.trazar(p, ve, d);
        p.classList.toggle('pt-tenue', s.tenue.indexOf(n) >= 0);
      });
    });
  }
  function montones(A, k, si, demora, rotulo) {
    A.ver(P.monton[k], si, demora);
    A.trazar(P.monton[k], si, demora);
    A.ver(P.montonTxt[k], si, rotulo == null ? demora : rotulo);
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.ver(P.hoja, s.hoja, 0);
      subrayar(A, s, 0);
      A.ver(P.limiteCaja, s.limite, 0);
      P.senal.forEach(function (n) { A.ver(n, s.senal, 0); });
      COSAS.forEach(function (c, i) { var p = sitio(i, s.reparto); A.mover(P.cosa[i], p[0], p[1], 0, 1, 0); });
      montones(A, 'no', s.montones >= 1, 0); montones(A, 'vi', s.montones >= 1, 0);
      montones(A, 'pl', s.montones >= 2, 0); montones(A, 'an', s.montones >= 2, 0);
      var h = s.hongo ? HONGO.llega : HONGO.sale;
      A.mover(P.hongo, h[0], h[1], 0, 1, 0);
      A.ver(P.hongoVe, s.hongo, 0);
      A.ver(P.aro, s.hongo, 0);
      A.ver(P.ni, s.hongo, 0);
      A.ver(P.tercero, s.hongo, 0);
      A.ver(P.globo, s.globo, 0);
      Object.keys(P.nombre).forEach(function (k) { A.ver(P.nombre[k], s.nombres, 0); });
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }
  function tenue(n) { P.subraya[n].forEach(function (p) { p.classList.add('pt-tenue'); }); }
  function raya(A, n, d) { P.subraya[n].forEach(function (p) { A.ver(p, true, d); A.trazar(p, true, d); }); }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo se cuentan cada vez que se ENTRA en ellos,
       también volviendo con «Atrás»; el 0 se pinta siempre. */
    if (n >= 1 && !entra(n)) return;
    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 1) {
      /* lo que hace Kenia, y con qué: las diez cosas, una por una */
      base(A, ESTADOS[0]);
      raya(A, 1, T1.p1);
      raya(A, 2, T1.p2);
      ORDEN_LEE.forEach(function (i, k) { A.ver(P.senal[i], true, T1.senal + T1.cada * k); });
      return;
    }
    if (n === 2) {
      /* los dos montones, y cada cosa al suyo; el nombre del montón, cuando
         ya llegaron todas */
      base(A, ESTADOS[1]);
      P.senal.forEach(function (s) { A.ver(s, false, 0); });
      tenue(1); tenue(2);
      raya(A, 3, T2.p3);
      montones(A, 'no', true, T2.monton, T2.rotulo);
      montones(A, 'vi', true, T2.monton, T2.rotulo);
      ORDEN_DOS.forEach(function (i, k) { var p = sitio(i, 'dos'); A.mover(P.cosa[i], p[0], p[1], 0, 1, T2.mueve + T2.cada * k); });
      return;
    }
    if (n === 3) {
      /* los vivos se separan en los dos tipos que nombra, y después se
         marca cada montón alrededor de los suyos: dibujado antes, la raya
         pasaría por encima de los que todavía no se movieron */
      base(A, ESTADOS[2]);
      tenue(3);
      raya(A, 4, T3.p4);
      ORDEN_CUATRO.forEach(function (i, k) { var p = sitio(i, 'cuatro'); A.mover(P.cosa[i], p[0], p[1], 0, 1, T3.mueve + T3.cada * k); });
      montones(A, 'pl', true, T3.monton, T3.rotulo);
      montones(A, 'an', true, T3.monton, T3.rotulo);
      return;
    }
    if (n === 4) {
      /* el hongo: la expectativa nombra dos tipos, y él no es ninguno */
      base(A, ESTADOS[3]);
      tenue(4);
      A.ver(P.limiteCaja, true, T4.caja);
      A.ver(P.globo, true, T4.globo);
      A.ver(P.hongoVe, true, T4.hongo);
      A.mover(P.hongo, HONGO.llega[0], HONGO.llega[1], 0, 1, T4.vuela);
      A.ver(P.aro, true, T4.aro);
      A.ver(P.ni, true, T4.ni);
      A.ver(P.tercero, true, T4.tercero);
      return;
    }
    if (n === 5) {
      /* lo que tiene que quedar al final: muchas clases distintas de
         seres vivos, cada una con su nombre */
      base(A, ESTADOS[4]);
      A.ver(P.limiteCaja, false, 0);
      A.ver(P.globo, false, 0);
      raya(A, 5, T5.p5);
      ORDEN_CUATRO.forEach(function (i, k) { A.ver(P.nombre[i], true, T5.nombre + T5.cada * k); });
      return;
    }
    /* el 6: el cuaderno, donde estaba la expectativa */
    base(A, ESTADOS[5]);
    A.ver(P.hoja, false, T6.sale);
    A.ver(P.cuaderno, true, T6.cuaderno);
  }

  var FRASES = [
    'Esta expectativa es de Ciencias Naturales, de primero. En el patio hay diez cosas. ¿Qué tiene que hacer Kenia con ellas?',
    '«' + M[1] + '»: Kenia tiene que agrupar, no basta con nombrar. ¿Agrupar qué? Lo que dice la expectativa, «' + M[2] + '»: diez cosas que se pueden señalar.',
    'Primero, dos montones: ' + NV + ' y ' + VI + ', como dice la expectativa. Quedan cuatro y seis.',
    'Después, los vivos en los dos tipos que la expectativa nombra: ' + PL + ' y ' + AN + '. Tres y tres.',
    'Kenia encuentra un hongo: no es planta ni animal. La expectativa de primero nombra solo esos dos. Si el examen lo pregunta, Kenia pierde un punto por algo que todavía no le toca.',
    'Y lo que tiene que quedar al final, la ' + M[11] + ': en un solo patio hay muchas clases distintas de seres vivos.',
    'Copie una expectativa de su planificación y escriba, en una frase, qué va a ver hacer a sus alumnos.'
  ];
  var BOTONES = ['👆 ¿Qué hace?', '🧺 A los montones', '🌳 Y los vivos', '🍄 ¿Y el hongo?', '✨ Lo que queda', '📝 Ahora usted', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['?', 'qué hace Kenia con las diez'],
    ['10', 'cosas que se pueden señalar'],
    ['4 y 6', NV + ' y ' + VI],
    ['3 y 3', PL + ' y ' + AN],
    ['1', 'punto por algo que no le toca'],
    ['6', 'clases distintas de seres vivos'],
    ['?', 'qué va a ver hacer a sus alumnos']
  ];

  AnimacionMision.montar('#amPatio', {
    vista: [ANCHO, ALTO],
    describe: 'Una expectativa de Ciencias Naturales de primero, partida en sus pedazos, y un patio con diez cosas. Kenia las agrupa como pide: ' +
      'primero en ' + NV + ' y ' + VI + ', y después los vivos en ' + PL + ' y ' + AN + '. Un hongo no es planta ni animal: ' +
      'la expectativa de primero no lo pide, y llega en tercero. Lo que queda es que hay muchas clases distintas de seres vivos.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
