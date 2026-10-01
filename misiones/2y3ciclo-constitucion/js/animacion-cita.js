/* ============================================================
   Animación de «La Constitución: mi Ley Fundamental» (Ruta de la Patria)
   ------------------------------------------------------------
   La historia: en el mercado, un muchacho de doce años carga bultos desde
   antes de que abran. Uno dice «es que en su casa lo necesitan»; otro dice
   «eso no se puede». La conversación se acaba ahí, porque ninguno de los
   dos puede decir dónde está escrito, y todo sigue igual mañana. La
   historia promete que aquí se aprende a señalar el artículo, que es lo
   único que cambia esa conversación.

   Lo que se dibuja: arriba, el mercado, con las dos personas, sus globos y
   el muchacho con su saco. Abajo, cuando alguien dice «¡Lo dice el artículo
   128!», dos libros abiertos en su artículo 128: el Código de la Niñez y la
   Constitución de la República. La cita entera, pieza por pieza, deja uno
   solo y dice qué punto de él; al final las dos personas preguntan lo
   mismo.

   ⚠️ Lo que asombra es de verdad, y se leyó en el PDF el 1 de octubre de
   2026: el MISMO Código de la Niñez que cita el «artículo 128 numeral 7 de
   la Constitución» tiene su propio artículo 128, y también habla de niños
   que trabajan (la Secretaría de Trabajo revisa los lugares de trabajo por
   si hay niños). Dos artículos 128 sobre lo mismo: el número solo no dice
   cuál. Por eso la escena NO lleva la cita ni el otro libro escritos aquí:
   los saca de `CONST_COMO_SE_LEE` (las piezas de la cita y `otro`), y la
   tarjeta de abajo, que pinta ese mismo archivo, dice lo mismo con
   palabras. `_dev/verifica-constitucion.js` comprueba que el libro de `otro`
   tenga su PDF en `_dev/leyes/`.

   ⚠️ Lo que NO se dice, y a propósito. Ni quién da el permiso para que un
   niño trabaje, ni quién lo pide, ni desde qué edad, ni que el 128 numeral 7
   «diga» algo: el texto de la Constitución no está en el repositorio, y la
   prueba pregunta lo demás. La escena no resuelve quién tenía razón: enseña
   cómo se llega a un papel que los dos pueden leer, que es lo que promete la
   historia.

   ⚠️ Lo escrito lleva su ancho medido con la Fredoka (AV, por cada 100 px)
   y `textLength`. Y una pieza tiene una sola demora: lo que cambia de
   globo cambia el globo entero, y el «Día 1» y el «Día 2» son dos piezas.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCita')) return;
  if (typeof CONST_COMO_SE_LEE === 'undefined' || typeof constPorClave !== 'function') return;

  var ANCHO = 320, ALTO = 250;

  /* ── las medidas de la letra ───────────────────────────────── */
  var AV = {
    a: 56.3, b: 56.3, c: 50.5, d: 56.5, e: 53.7, f: 40.5, g: 55.2, h: 55.4, i: 24.2, j: 23.6, k: 50.4, l: 30.1, m: 80.3,
    n: 56.3, o: 55.9, p: 55.2, q: 55.1, r: 42.3, s: 45.8, t: 41.1, u: 56, v: 56.4, w: 74.6, x: 52.3, y: 55.9, z: 54,
    A: 70.9, B: 61.9, C: 64.3, D: 66.7, E: 61, F: 61.9, G: 71.5, H: 66.2, I: 23.2, J: 53.6, K: 59.5, L: 56.5, M: 81.4,
    N: 68.3, O: 72.5, P: 59.7, Q: 79.2, R: 61.1, S: 54.6, T: 64.8, U: 68.8, V: 72.7, W: 95.3, X: 69.1, Y: 63.8, Z: 59,
    'á': 56.3, 'é': 53.7, 'í': 22.5, 'ó': 55.9, 'ú': 56, 'ñ': 56.3, 'Ñ': 68.3, ' ': 24.1, ',': 22.4, '.': 21.7, ':': 22.5,
    '¿': 47.5, '?': 48.1, '¡': 24.3, '!': 24.2, '«': 61.6, '»': 61,
    '0': 57.2, '1': 38.3, '2': 57.7, '3': 57.2, '4': 54.9, '5': 50.1, '6': 52.6, '7': 53.3, '8': 54.7, '9': 52.6
  };
  function ancho(t, tam) {
    var s = 0;
    for (var i = 0; i < t.length; i++) s += AV[t.charAt(i)] != null ? AV[t.charAt(i)] : 55;
    return Math.round(s * tam) / 100;
  }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* ── lo que dice el archivo de datos ───────────────────────── */
  var PIEZAS = CONST_COMO_SE_LEE.piezas.map(function (p) { return p.parte; });   // artículo 128 · numeral 7 · de la Constitución…
  var OTRO = CONST_COMO_SE_LEE.otro;                                              // el otro libro con su artículo 128
  var NUMERAL = PIEZAS[1].split(' ').pop();                                       // «7»
  var TEMA7 = constPorClave('a128').tema;                                         // de qué trata ese numeral
  var LEY = PIEZAS[2].replace(/^de la /, '');                                     // Constitución de la República
  var TITULO_LEY = [LEY.split(' de la ')[0], 'de la ' + LEY.split(' de la ').slice(1).join(' de la ')];
  var ARTICULO = PIEZAS[0].charAt(0).toUpperCase() + PIEZAS[0].slice(1);          // Artículo 128

  /* ── el dibujo ─────────────────────────────────────────────── */
  /* El mercado: el suelo, las dos personas en las puntas y el muchacho en
     medio, con su saco a la espalda. */
  var SUELO = { y: 102, x0: 6, x1: 314 };
  var GENTE = [{ x: 36, camisa: 'ct-camisa-a', hacia: 1 }, { x: 284, camisa: 'ct-camisa-b', hacia: -1 }];
  var NINO = { x: 160 };
  /* Lo que dice cada uno, en su globo. La cola baja hasta encima de su pelo.
     Los renglones van a 10,5: la caja de la Fredoka mide 1,27 veces eso. */
  var GLOBO = { y0: 6, y1: 30, tam: 10.5, base: 22, colaY: 51 };
  var LADOS = [{ x0: 4, x1: 140, cola: 36 }, { x0: 186, x1: 316, cola: 284 }];
  var DICHOS = [
    ['En su casa lo necesitan.', '¿Qué dice el ' + PIEZAS[1] + '?'],
    ['Eso no se puede.', '¡Lo dice el ' + PIEZAS[0] + '!', '¿Qué dice el ' + PIEZAS[1] + '?']
  ];
  /* El calendario, entre los dos globos: el día que pasa sin que cambie nada */
  var CAL = { x0: 147, x1: 179, y0: 6, y1: 30, banda: 5, tam: 9.5, base: 25 };
  /* Opinión contra opinión: dos flechas que se miran, debajo de los globos y
     por encima de la cabeza del muchacho */
  var FLECHA = { y: 56, a: [50, 142, 149], b: [270, 178, 171] };
  var ETIQUETA = { x: 160, base: 48, tam: 10, textos: ['opinión contra opinión', 'la misma pregunta'] };
  /* La cita, en la fila de en medio: sus tres piezas separadas un poco, para
     que cada una se pueda señalar sola */
  var CITA = { base: 120, tam: 10.5, hueco: 8, subraya: 124, aro: [106, 128] };
  var CUAL = { x: 160, base: 121, tam: 11, texto: '¿Cuál de los dos?' };
  /* Los dos libros, abiertos en su artículo 128 */
  var LIBROS = [
    { x0: 14, x1: 146, y0: 132, y1: 246, banda: 18, cx: 80 },
    { x0: 174, x1: 306, y0: 132, y1: 246, banda: 30, cx: 240 }
  ];
  var TIT = { tam: 10, base0: 144.8, base1: [145.3, 157.8] };
  var ENCAB = { tam: 11, base: [168, 180] };
  var TRATA = { tam: 9.5, base: [186, 198] };
  var CHIP = { x0: 182, paso: 17, ancho: 14, y0: 188, y1: 202, tam: 9.5 };
  var ROT7 = { tam: 9.5, base: 216 };
  var GRIS = [[[26, 212, 134], [26, 222, 120], [26, 232, 128]], [[186, 228, 294], [186, 238, 270]]];
  /* Donde van a llegar los libros: mientras nadie dice dónde está escrito,
     un papel vacío de raya cortada */
  var VACIO = { x0: 14, x1: 306, y0: 132, y1: 246, duda: { base: 200, tam: 28 }, dice: { base: 228, tam: 11, texto: '¿dónde está escrito?' } };

  /* ── el reloj de la escena ──────────────────────────────────── */
  var T1 = { flechas: 0, etiqueta: 400, vacio: 900, sale: 1200, entra: 1700 };
  var T2 = { sale: 0, entra: 500, vacio: 500, libros: 1100, cual: 1700 };
  var T3 = { sale: 0, cita: 500, sub: [1000, 2900, 1900], titulos: 1300, tenue: 2200, banda: 2200, siete: 3200 };
  var T4 = { sale: 0, entra: 500, etiqueta: 900 };
  var T5 = { aro: [0, 250, 500] };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido, medido) {
    var at = { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' };
    if (medido) { at.textLength = ancho(contenido, tam); at.lengthAdjust = 'spacing'; }
    var n = A.el('text', at, padre);
    n.textContent = contenido || '';
    return n;
  }

  /* Una persona del mercado: pantalón, camisa, brazos, cabeza y pelo. Los
     brazos abiertos hacia el otro: están discutiendo. */
  function persona(A, padre, k) {
    var G = GENTE[k], x = G.x, s = SUELO.y, h = G.hacia;
    var g = A.el('g', { 'data-persona': String(k) }, padre);
    A.el('rect', { x: x - 6, y: s - 13, width: 5, height: 13, rx: 1.5, 'class': 'ct-pantalon' }, g);
    A.el('rect', { x: x + 1, y: s - 13, width: 5, height: 13, rx: 1.5, 'class': 'ct-pantalon' }, g);
    A.el('rect', { x: x - 9.5, y: s - 30, width: 19, height: 19, rx: 3.5, 'class': G.camisa }, g);
    A.el('path', { d: 'M' + (x + 8 * h) + ' ' + (s - 26) + ' L' + (x + 15 * h) + ' ' + (s - 33), 'class': 'ct-brazo' }, g);
    A.el('path', { d: 'M' + (x - 8 * h) + ' ' + (s - 26) + ' L' + (x - 11 * h) + ' ' + (s - 14), 'class': 'ct-brazo' }, g);
    A.el('circle', { cx: x, cy: s - 38, r: 8, 'class': 'ct-piel', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 8) + ' ' + (s - 39) + ' Q' + (x - 7) + ' ' + (s - 48) + ' ' + x + ' ' + (s - 47) +
      ' Q' + (x + 7) + ' ' + (s - 48) + ' ' + (x + 8) + ' ' + (s - 39) + ' Q' + x + ' ' + (s - 43) + ' ' + (x - 8) + ' ' + (s - 39) + ' Z',
      'class': 'ct-pelo' }, g);
    return g;
  }

  /* El muchacho, más bajo, con el saco a la espalda y la mano agarrándolo */
  function nino(A, padre) {
    var x = NINO.x, s = SUELO.y;
    var g = A.el('g', { 'data-nino': '' }, padre);
    /* el saco: cuello amarrado arriba y la panza abajo, detrás de la camisa */
    A.el('path', { d: 'M' + (x - 13) + ' ' + (s - 31) + ' Q' + (x - 19) + ' ' + (s - 26) + ' ' + (x - 18) + ' ' + (s - 19) +
      ' Q' + (x - 17.5) + ' ' + (s - 12) + ' ' + (x - 11) + ' ' + (s - 12) + ' Q' + (x - 4.5) + ' ' + (s - 12) + ' ' + (x - 4) + ' ' + (s - 19) +
      ' Q' + (x - 3) + ' ' + (s - 26) + ' ' + (x - 9) + ' ' + (s - 31) + ' Z', 'class': 'ct-saco', 'data-saco': '' }, g);
    A.el('path', { d: 'M' + (x - 14) + ' ' + (s - 33.5) + ' L' + (x - 11) + ' ' + (s - 31) + ' L' + (x - 8) + ' ' + (s - 33.5), 'class': 'ct-amarre' }, g);
    A.el('rect', { x: x - 5, y: s - 10, width: 4, height: 10, rx: 1.2, 'class': 'ct-pantalon' }, g);
    A.el('rect', { x: x + 1, y: s - 10, width: 4, height: 10, rx: 1.2, 'class': 'ct-pantalon' }, g);
    A.el('rect', { x: x - 7.5, y: s - 25, width: 15, height: 15, rx: 3, 'class': 'ct-camisa-n' }, g);
    A.el('path', { d: 'M' + (x - 5.5) + ' ' + (s - 21) + ' L' + (x - 9.5) + ' ' + (s - 29), 'class': 'ct-brazo ct-brazo-n' }, g);
    A.el('circle', { cx: x, cy: s - 31.5, r: 6.5, 'class': 'ct-piel', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 6.5) + ' ' + (s - 32) + ' Q' + (x - 5.7) + ' ' + (s - 39.5) + ' ' + x + ' ' + (s - 38.6) +
      ' Q' + (x + 5.7) + ' ' + (s - 39.5) + ' ' + (x + 6.5) + ' ' + (s - 32) + ' Q' + x + ' ' + (s - 35.5) + ' ' + (x - 6.5) + ' ' + (s - 32) + ' Z',
      'class': 'ct-pelo' }, g);
    return g;
  }

  /* Un globo entero, con su cola hasta encima de la cabeza de quien habla.
     Cuando cambia lo que dice, se va el globo entero y llega otro. */
  function globo(A, padre, k, j) {
    var L = LADOS[k], G = GLOBO, pt = L.cola, x0 = L.x0, x1 = L.x1, y0 = G.y0, y1 = G.y1;
    var g = A.el('g', { 'data-globo': k + '-' + j }, padre);
    A.el('path', { d: 'M' + (x0 + 7) + ' ' + y0 + ' L' + (x1 - 7) + ' ' + y0 + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + 7) +
      ' L' + x1 + ' ' + (y1 - 7) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - 7) + ' ' + y1 + ' L' + (pt + 5) + ' ' + y1 +
      ' L' + pt + ' ' + G.colaY + ' L' + (pt - 4) + ' ' + y1 + ' L' + (x0 + 7) + ' ' + y1 +
      ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - 7) + ' L' + x0 + ' ' + (y0 + 7) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + 7) + ' ' + y0 + ' Z',
      'class': 'ct-globo', 'data-globo-caja': '', 'data-punta-globo': pt + ' ' + G.colaY }, g);
    texto(A, g, (x0 + x1) / 2, G.base, 'ct-letra', G.tam, 'middle', DICHOS[k][j], true).setAttribute('data-dice', '');
    return g;
  }

  /* Un libro abierto: su banda con el nombre de la ley, su artículo 128 y lo
     de dentro */
  function libro(A, padre, k) {
    var L = LIBROS[k];
    var g = A.el('g', { 'data-libro': String(k) }, padre);
    A.el('rect', { x: L.x0, y: L.y0, width: L.x1 - L.x0, height: L.y1 - L.y0, rx: 4, 'class': 'ct-libro', 'data-libro-caja': '' }, g);
    A.el('rect', { x: L.x0, y: L.y0, width: L.x1 - L.x0, height: L.banda, rx: 4, 'class': k === 0 ? 'ct-banda-otro' : 'ct-banda-ley', 'data-banda': String(k) }, g);
    var tit = A.el('g', { 'data-titulo': '' }, g);
    if (k === 0) texto(A, tit, L.cx, TIT.base0, 'ct-blanca', TIT.tam, 'middle', OTRO.ley, true);
    else TITULO_LEY.forEach(function (t, i) { texto(A, tit, L.cx, TIT.base1[i], 'ct-blanca', TIT.tam, 'middle', t, true); });
    texto(A, g, L.cx, ENCAB.base[k], 'ct-letra', ENCAB.tam, 'middle', ARTICULO, true).setAttribute('data-encabezado', '');
    if (k === 0) {
      /* lo que trata el 128 del Código, en dos renglones */
      var pal = OTRO.trata.split(' '), parte = [pal.slice(0, 3).join(' '), pal.slice(3).join(' ')];
      var tr = A.el('g', { 'data-trata': '' }, g);
      parte.forEach(function (t, i) { texto(A, tr, L.cx, TRATA.base[i], 'ct-letra ct-suave', TRATA.tam, 'middle', t, true); });
    } else {
      /* los numerales del 128 de la Constitución: sus puntos, en fila */
      P.chips = [];
      for (var i = 0; i < Number(NUMERAL); i++) {
        var c = A.el('g', { 'data-chip': String(i + 1) }, g);
        var cx = CHIP.x0 + i * CHIP.paso;
        A.el('rect', { x: cx, y: CHIP.y0, width: CHIP.ancho, height: CHIP.y1 - CHIP.y0, rx: 2.5, 'class': 'ct-chip', 'data-chip-caja': '' }, c);
        texto(A, c, cx + CHIP.ancho / 2, (CHIP.y0 + CHIP.y1) / 2 + 0.382 * CHIP.tam, 'ct-letra', CHIP.tam, 'middle', String(i + 1));
        P.chips.push(c);
      }
    }
    GRIS[k].forEach(function (r) {
      A.el('path', { d: 'M' + r[0] + ' ' + r[1] + ' L' + r[2] + ' ' + r[1], 'class': 'ct-gris' }, g);
    });
    return g;
  }

  /* Un aro alrededor de lo que una pieza de la cita señala */
  function aro(A, padre, x0, y0, x1, y1, clase, dato) {
    var at = { x: r2(x0), y: r2(y0), width: r2(x1 - x0), height: r2(y1 - y0), rx: 5, 'class': clase };
    at[dato[0]] = dato[1];
    return A.el('rect', at, padre);
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── el mercado ── */
    A.el('path', { d: 'M' + SUELO.x0 + ' ' + SUELO.y + ' L' + SUELO.x1 + ' ' + SUELO.y, 'class': 'ct-suelo', 'data-suelo': '' }, svg);
    persona(A, svg, 0);
    persona(A, svg, 1);
    nino(A, svg);

    /* ── el calendario: el «Día 1» y el «Día 2» son dos piezas ── */
    A.el('rect', { x: CAL.x0, y: CAL.y0, width: CAL.x1 - CAL.x0, height: CAL.y1 - CAL.y0, rx: 3, 'class': 'ct-cal', 'data-cal': '' }, svg);
    A.el('rect', { x: CAL.x0, y: CAL.y0, width: CAL.x1 - CAL.x0, height: CAL.banda, rx: 2, 'class': 'ct-cal-banda' }, svg);
    P.dia = ['Día 1', 'Día 2'].map(function (t, i) {
      var n = texto(A, svg, (CAL.x0 + CAL.x1) / 2, CAL.base, 'ct-letra', CAL.tam, 'middle', t, true);
      n.setAttribute('data-dia', String(i + 1));
      return n;
    });

    /* ── los globos: un globo entero por cada cosa que se dice ── */
    P.globos = DICHOS.map(function (lista, k) { return lista.map(function (t, j) { return globo(A, svg, k, j); }); });

    /* ── opinión contra opinión: dos flechas que se miran ── */
    P.flechas = A.el('g', { 'data-flechas': '' }, svg);
    [FLECHA.a, FLECHA.b].forEach(function (f, i) {
      var d = f[2] > f[1] ? 1 : -1, y = FLECHA.y;
      var g = A.el('g', { 'data-flecha': String(i) }, P.flechas);
      A.el('path', { d: 'M' + f[0] + ' ' + y + ' L' + f[1] + ' ' + y, 'class': 'ct-flecha', 'data-flecha-linea': '' }, g);
      A.el('path', { d: 'M' + f[1] + ' ' + (y - 4.5) + ' L' + f[2] + ' ' + y + ' L' + f[1] + ' ' + (y + 4.5) + ' Z', 'class': 'ct-punta',
        'data-flecha-punta': f[2] + ' ' + y, 'data-hacia': String(d) }, g);
    });
    P.etq = ETIQUETA.textos.map(function (t, i) {
      var n = texto(A, svg, ETIQUETA.x, ETIQUETA.base, 'am-rotulo', ETIQUETA.tam, 'middle', t, true);
      n.setAttribute('data-etiqueta', String(i));
      return n;
    });

    /* ── el papel vacío: nadie dice dónde está escrito ── */
    P.vacio = A.el('g', { 'data-vacio': '' }, svg);
    A.el('rect', { x: VACIO.x0, y: VACIO.y0, width: VACIO.x1 - VACIO.x0, height: VACIO.y1 - VACIO.y0, rx: 6, 'class': 'ct-vacio', 'data-vacio-caja': '' }, P.vacio);
    texto(A, P.vacio, (VACIO.x0 + VACIO.x1) / 2, VACIO.duda.base, 'am-rotulo', VACIO.duda.tam, 'middle', '?').setAttribute('data-vacio-duda', '');
    texto(A, P.vacio, (VACIO.x0 + VACIO.x1) / 2, VACIO.dice.base, 'am-rotulo', VACIO.dice.tam, 'middle', VACIO.dice.texto, true).setAttribute('data-vacio-dice', '');

    /* ── la pregunta de cuál de los dos, en la fila de la cita ── */
    P.cual = texto(A, svg, CUAL.x, CUAL.base, 'am-rotulo', CUAL.tam, 'middle', CUAL.texto, true);
    P.cual.setAttribute('data-cual', '');

    /* ── la cita, pieza por pieza, con su raya debajo ── */
    var anchos = PIEZAS.map(function (t) { return ancho(t, CITA.tam); });
    var total = anchos.reduce(function (s, w) { return s + w; }, 0) + CITA.hueco * (PIEZAS.length - 1);
    var x = r2((ANCHO - total) / 2);
    P.pieza = []; P.sub = []; P.aroPieza = [];
    PIEZAS.forEach(function (t, i) {
      var n = texto(A, svg, x, CITA.base, 'am-rotulo', CITA.tam, 'start', t, true);
      n.setAttribute('data-pieza', String(i));
      P.pieza.push(n);
      P.sub.push(A.el('path', { d: 'M' + x + ' ' + CITA.subraya + ' L' + r2(x + anchos[i]) + ' ' + CITA.subraya, 'class': 'ct-subraya', 'data-subraya': String(i) }, svg));
      P.aroPieza.push(aro(A, svg, x - 3, CITA.aro[0], x + anchos[i] + 3, CITA.aro[1], 'ct-aro-cita', ['data-aro-pieza', String(i)]));
      x = r2(x + anchos[i] + CITA.hueco);
    });

    /* ── los dos libros ── */
    P.libros = A.el('g', { 'data-libros': '' }, svg);
    libro(A, P.libros, 0);
    libro(A, P.libros, 1);
    /* El Código queda tenue y con raya cortada cuando la cita dice de qué
       ley es: no está mal, solo que no es el que se cita. */
    var L0 = LIBROS[0], L1 = LIBROS[1];
    /* lo que señala cada pieza, con un aro del mismo trazo. El del Código va
       ANTES de lo tenue en el documento: cuando la cita deja ese libro fuera,
       su aro se apaga con él. Encima, se veía un aro vivo sobre un libro
       apagado, que no se sabe qué quiere decir. */
    function aroTitulo(k) {
      var L = LIBROS[k], w = ancho(ARTICULO, ENCAB.tam), b = ENCAB.base[k];
      return aro(A, svg, L.cx - w / 2 - 4, b - 1.017 * ENCAB.tam - 2.5, L.cx + w / 2 + 4, b + 0.253 * ENCAB.tam + 2.5, 'ct-aro-papel', ['data-aro-titulo', String(k)]);
    }
    P.aroTit = [aroTitulo(0)];
    P.tenue = A.el('rect', { x: L0.x0, y: L0.y0, width: L0.x1 - L0.x0, height: L0.y1 - L0.y0, rx: 4, 'class': 'ct-tenue', 'data-tenue': '' }, svg);
    P.aroTit.push(aroTitulo(1));
    P.aroBanda = aro(A, svg, L1.x0 - 2, L1.y0 - 2, L1.x1 + 2, L1.y0 + L1.banda + 2, 'ct-aro-papel', ['data-aro-banda', '']);
    var c7 = CHIP.x0 + (Number(NUMERAL) - 1) * CHIP.paso;
    P.aro7 = aro(A, svg, c7 - 3, CHIP.y0 - 3, c7 + CHIP.ancho + 3, CHIP.y1 + 3, 'ct-aro-papel', ['data-aro-numeral', NUMERAL]);
    P.rot7 = texto(A, svg, L1.cx, ROT7.base, 'ct-letra', ROT7.tam, 'middle', 'el ' + NUMERAL + ': ' + TEMA7.charAt(0).toLowerCase() + TEMA7.slice(1), true);
    P.rot7.setAttribute('data-rotulo-numeral', '');
  }

  /* ── los estados ───────────────────────────────────────────── */

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    return [P.flechas, P.vacio, P.cual, P.libros, P.tenue, P.aroBanda, P.aro7, P.rot7]
      .concat(P.dia, P.etq, P.pieza, P.sub, P.aroPieza, P.aroTit, P.globos[0], P.globos[1]);
  }

  /* El estado al TERMINAR cada paso. A y B: qué globo tiene cada persona;
     dia: 0 o 1; etq: qué etiqueta va entre ellos (−1 ninguna). */
  var ESTADOS = [
    { dia: 0, flechas: false, etq: -1, A: 0, B: 0, vacio: false, libros: false, cual: false, cita: false, sub: [false, false, false], titulos: false, banda: false, tenue: false, siete: false, aros: false },
    { dia: 1, flechas: true, etq: 0, A: 0, B: 0, vacio: true, libros: false, cual: false, cita: false, sub: [false, false, false], titulos: false, banda: false, tenue: false, siete: false, aros: false },
    { dia: 1, flechas: true, etq: 0, A: 0, B: 1, vacio: false, libros: true, cual: true, cita: false, sub: [false, false, false], titulos: false, banda: false, tenue: false, siete: false, aros: false },
    { dia: 1, flechas: true, etq: 0, A: 0, B: 1, vacio: false, libros: true, cual: false, cita: true, sub: [true, true, true], titulos: true, banda: true, tenue: true, siete: true, aros: false },
    { dia: 1, flechas: false, etq: 1, A: 1, B: 2, vacio: false, libros: true, cual: false, cita: true, sub: [true, true, true], titulos: true, banda: true, tenue: true, siete: true, aros: false },
    { dia: 1, flechas: false, etq: 1, A: 1, B: 2, vacio: false, libros: true, cual: false, cita: true, sub: [true, true, true], titulos: true, banda: true, tenue: true, siete: true, aros: true }
  ];

  function base(A, s) {
    deGolpe(A, todo(), function () {
      P.dia.forEach(function (n, i) { A.ver(n, s.dia === i, 0); });
      A.ver(P.flechas, s.flechas, 0);
      P.etq.forEach(function (n, i) { A.ver(n, s.etq === i, 0); });
      P.globos[0].forEach(function (g, j) { A.ver(g, s.A === j, 0); });
      P.globos[1].forEach(function (g, j) { A.ver(g, s.B === j, 0); });
      A.ver(P.vacio, s.vacio, 0);
      A.ver(P.libros, s.libros, 0);
      A.ver(P.cual, s.cual, 0);
      P.pieza.forEach(function (n) { A.ver(n, s.cita, 0); });
      P.sub.forEach(function (n, i) { A.ver(n, s.sub[i], 0); A.trazar(n, s.sub[i], 0); });
      P.aroTit.forEach(function (n) { A.ver(n, s.titulos, 0); });
      A.ver(P.aroBanda, s.banda, 0);
      A.ver(P.tenue, s.tenue, 0);
      A.ver(P.aro7, s.siete, 0);
      A.ver(P.rot7, s.siete, 0);
      P.aroPieza.forEach(function (n) { A.ver(n, s.aros, 0); });
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan cada vez que se ENTRA
       en ellos, también volviendo con «Atrás»; el 0 y el 5 se pintan
       siempre, también en el primer pintado. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 5) {
      if (antes !== 4) { base(A, ESTADOS[5]); return; }
      base(A, ESTADOS[4]);
      P.aroPieza.forEach(function (a, k) { A.ver(a, true, T5.aro[k]); });
      return;
    }
    if (n === 1) {
      base(A, ESTADOS[0]);
      /* opinión contra opinión, y al otro día todo igual */
      A.ver(P.flechas, true, T1.flechas);
      A.ver(P.etq[0], true, T1.etiqueta);
      A.ver(P.vacio, true, T1.vacio);
      A.ver(P.dia[0], false, T1.sale);
      A.ver(P.dia[1], true, T1.entra);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      /* una dice un número, y hay dos libros con ese número */
      A.ver(P.globos[1][0], false, T2.sale);
      A.ver(P.globos[1][1], true, T2.entra);
      A.ver(P.vacio, false, T2.vacio);
      A.ver(P.libros, true, T2.libros);
      A.ver(P.cual, true, T2.cual);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      /* la cita entera: el número sirve para los dos, la ley deja uno y el
         numeral dice qué punto. Llega cuando ya se fue el «¿Cuál…?», que va
         en la misma fila. */
      A.ver(P.cual, false, T3.sale);
      P.pieza.forEach(function (p) { A.ver(p, true, T3.cita); });
      P.sub.forEach(function (sb, i) { A.ver(sb, true, T3.sub[i]); A.trazar(sb, true, T3.sub[i]); });
      P.aroTit.forEach(function (a) { A.ver(a, true, T3.titulos); });
      A.ver(P.tenue, true, T3.tenue);
      A.ver(P.aroBanda, true, T3.banda);
      A.ver(P.aro7, true, T3.siete);
      A.ver(P.rot7, true, T3.siete);
      return;
    }
    /* el 4: las dos preguntan lo mismo */
    base(A, ESTADOS[3]);
    A.ver(P.globos[0][0], false, T4.sale);
    A.ver(P.globos[1][1], false, T4.sale);
    A.ver(P.flechas, false, T4.sale);
    A.ver(P.etq[0], false, T4.sale);
    A.ver(P.globos[0][1], true, T4.entra);
    A.ver(P.globos[1][2], true, T4.entra);
    A.ver(P.etq[1], true, T4.etiqueta);
  }

  function mayus(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
  var FRASES = [
    'Dos personas ven al mismo muchacho cargando bultos, y cada una dice lo contrario. ¿Qué haría falta para saber cuál tiene razón? Piénsalo antes de tocar.',
    'Cada una repite lo suyo, y ninguna puede decir dónde está escrito. Al otro día, todo sigue igual.',
    'Una dice: «¡Lo dice el ' + PIEZAS[0] + '!». Pero el ' + OTRO.ley + ' también tiene su propio ' + PIEZAS[0] + '. ¿Cuál de los dos?',
    'La cita entera dice cuál. «' + mayus(PIEZAS[0]) + '» les sirve a los dos; «' + PIEZAS[2] + '» deja uno, y «' + PIEZAS[1] + '» dice qué punto.',
    'Ahora las dos preguntan lo mismo: qué dice ese numeral. Ya no es opinión contra opinión: hay un papel que las dos pueden leer.',
    'Así se señala un artículo. ¿Cómo se lo dirías tú a esas dos personas? Escríbelo en tu cuaderno, con la cita entera.'
  ];
  var BOTONES = ['💬 Que hablen', '🔢 Un número', '📌 La cita entera', '👀 ¿Y ahora?', '✍️ ¿Y tú?', '↺ Empezar otra vez'];
  var MARCADOR = [['2', 'personas, y dicen lo contrario'], ['0', 'artículos señalados'], ['2', 'artículos ' + PIEZAS[0].split(' ').pop() + ': ¿cuál de los dos?'],
    ['1', 'artículo: el de la cita entera'], ['1', 'pregunta, la misma para las dos'], ['3', 'partes tiene la cita entera']];

  AnimacionMision.montar('#amCita', {
    vista: [ANCHO, ALTO],
    describe: 'En un mercado, dos personas discuten por un muchacho que carga bultos, y ninguna puede decir dónde está escrito. Una dice «el ' +
      PIEZAS[0] + '» y aparecen dos libros con su ' + PIEZAS[0] + ': el ' + OTRO.ley + ' y la ' + LEY + '. La cita entera, «' + CONST_COMO_SE_LEE.ejemplo +
      '», señala uno solo, y al final las dos preguntan lo mismo.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
