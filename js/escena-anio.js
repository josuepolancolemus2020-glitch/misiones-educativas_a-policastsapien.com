/* ============================================================
   Animación de las Pruebas de Fin de Grado (Ruta de la Meta)
   ------------------------------------------------------------
   La historia es la misma en 4º, 5º, 6º y 7º: la prueba llega en un
   solo día y pregunta lo de todo el año. Kenia repasó la semana antes:
   lo de octubre le salió bien y lo de marzo, mal. No es que no lo
   hubiera aprendido: lo vio una vez, hace ocho meses, y no lo volvió a
   tocar. La historia dice que repasar dos días antes no alcanza para un
   año, que estudiar la misma prueba dos veces tampoco, y que aquí hay
   veinte formas distintas.

   Lo que se dibuja: el año de clases en una fila, de febrero a octubre,
   una hoja por mes con lo que Kenia aprende, y en noviembre la hoja de la
   prueba. Kenia camina por debajo, mes a mes.

   ⚠️ La escena es UNA para los cuatro grados, y vive aquí, no copiada en
   cuatro carpetas: un arreglo hecho en una copia se queda roto en las
   otras tres. Cada misión trae un archivo de dos líneas
   (`js/animacion-anio.js`) que la monta en SU bloque, con su grado y su
   id propio (#amAnio4 … #amAnio7): la sonda del navegador guarda lo que
   mide cada escena por su id, y dos misiones con el mismo id se pisan.

   ⚠️ Lo que se afirma y de dónde sale:
   - el año de clases va de febrero a noviembre (en Honduras las aulas
     están cerradas de noviembre a febrero) y la prueba es al final; de
     marzo a noviembre van los ocho meses que dice la historia;
   - lo que no se vuelve a tocar se va borrando: lo dice la historia, y
     aquí se dibuja como un esquema, sin una sola cifra de memoria. Las
     hojas se borran todas al mismo paso, y nada más;
   - «dos días» se dibuja a la escala de la raya del año (cada mes, unos
     treinta días), que es una cuenta y no una opinión;
   - cada forma de la prueba pregunta de todo el año (la misión lo dice
     así), y el botón de la evaluación da la forma siguiente cada vez:
     F1, F2, F3… Cuántas formas hay NO se escribe: se lee de la misión
     (EVAL_FORMAS).

   ⚠️ Lo que NO se dice: ni un tema de Matemáticas ni de Español. La prueba
   de la misión pregunta eso, y la escena no regala nada: enseña cuándo se
   estudia, no qué.

   Lo escrito lleva su ancho medido con la Fredoka (AV, por cada 100 px) y
   `textLength`. Una pieza tiene una sola demora: lo que aparece y se va en
   el mismo paso son dos piezas.
   ============================================================ */
(function () {
  'use strict';

  var ANCHO = 320, ALTO = 260;

  /* ── las medidas de la letra ───────────────────────────────── */
  var AV = {
    a: 56.3, b: 56.3, c: 50.5, d: 56.5, e: 53.7, f: 40.5, g: 55.2, h: 55.4, i: 24.2, j: 23.6, k: 50.4, l: 30.1, m: 80.3,
    n: 56.3, o: 55.9, p: 55.2, q: 55.1, r: 42.3, s: 45.8, t: 41.1, u: 56, v: 56.4, w: 74.6, x: 52.3, y: 55.9, z: 54,
    A: 70.9, B: 61.9, C: 64.3, D: 66.7, E: 61, F: 61.9, G: 71.5, H: 66.2, I: 23.2, J: 53.6, K: 59.5, L: 56.5, M: 81.4,
    N: 68.3, O: 72.5, P: 59.7, Q: 79.2, R: 61.1, S: 54.6, T: 64.8, U: 68.8, V: 72.7, W: 95.3, X: 69.1, Y: 63.8, Z: 59,
    'á': 56.3, 'é': 53.7, 'í': 22.5, 'ó': 55.9, 'ú': 56, 'ñ': 56.3, 'Ñ': 68.3, ' ': 24.1, ',': 22.4, '.': 21.7, ':': 22.5,
    '¿': 47.5, '?': 48.1, '¡': 24.3, '!': 24.2, 'º': 34,
    '0': 57.2, '1': 38.3, '2': 57.7, '3': 57.2, '4': 54.9, '5': 50.1, '6': 52.6, '7': 53.3, '8': 54.7, '9': 52.6
  };
  function ancho(t, tam) {
    var s = 0;
    for (var i = 0; i < t.length; i++) s += AV[t.charAt(i)] != null ? AV[t.charAt(i)] : 55;
    return Math.round(s * tam) / 100;
  }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* ── el dibujo ─────────────────────────────────────────────── */
  /* La fila del año: diez columnas iguales, de febrero a noviembre. La
     última es la de la prueba. */
  var MESES = ['FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV'];
  var COL = { x0: 10, w: 30 };
  function cx(c) { return COL.x0 + COL.w * c + COL.w / 2; }
  var DIAS_MES = 30;                       // la escala de la raya: cada mes, unos treinta días
  var MARZO = 1, OCTUBRE = 8, PRUEBA = 9;  // columnas
  /* Una hoja por mes: el papel, sus renglones escritos, el velo que los va
     borrando y, abajo, un puntito por cada vez que se volvió a ella */
  var HOJA = { w: 24, y0: 32, y1: 104 };
  var RENGLON = { y: [44, 53, 62, 71], largo: [16, 13, 16, 10] };
  var VELO = { y0: 38, y1: 77, medio: 10 };
  var PUNTO = { r: 1.8, dx: 4.6, y: [84, 89, 94, 99] };
  var BORRA = 0.1;                         // cuánto se borra una hoja por cada mes sin tocarla
  /* La hoja de la prueba, en noviembre: su grado, y una fila para lo de
     marzo y otra para lo de octubre */
  var PRU = { x0: 282, x1: 308, banda: 43, filas: [74, 90], burbuja: 288, r: 3, letra: 292, prueba: 58 };
  var RAYA = { y: 112, tic: 3 };
  var MES_TXT = { tam: 9.5, base: 126 };
  var KENIA = { pies: 180 };              // el lazo queda a dos puntos de los meses
  var NOMBRE = { tam: 9, base: 191 };
  /* Arriba: la barra del año a escala, o las formas de cada mes */
  var BARRA = { y0: 12, y1: 22 };
  var FICHA = { y0: 8, y1: 24, medio: 11, tam: 9 };
  /* Abajo, según el paso */
  var LLAVE = { y: 204, tic: 5, tam: 9.5, base: 218 };
  var ZOOM = { x0: 22, celda: 9.2, y0: 213, y1: 226, titulo: 206, rotulo: 240, tam: 9.5 };
  var TIRA = { x0: 22, paso: 28, w: 24, filas: [[209, 224], [227, 242]], titulo: 204, pie: 256, tam: 9 };
  var NOTA = { x0: 30, x1: 290, y0: 196, y1: 257, titulo: 209, l1: 223, raya1: 236, l2: 250, tam: 9 };
  /* Lo que quiere decir el dibujo, en los dos primeros pasos: qué es una
     hoja, y qué es una hoja más clara */
  var LEYENDA = { y0: 206, y1: 232, w: 16, base: 223, tam: 9.5, x: [[64], [40, 168]] };

  /* ── el reloj de la escena ──────────────────────────────────── */
  /* Kenia llega a cada mes a paso parejo: a[c] es cuándo llega a la
     columna c. Cada salto dura un mes de la escena. */
  var MES_MS = 400, SALIDA = 200;
  function llega(c) { return SALIDA + c * MES_MS; }
  var T2 = { burbujas: 200, marzo: 700, octubre: 1000, llave: 1400 };
  var T3 = { barra: 200, raya: 700, zoom: 1100, dias: 1500 };
  var T4 = { ficha: 100, puntos: 220, tira: 100, marcas: 450 };
  var T5 = { nota: 0, aro: 300 };

  function texto(A, padre, x, y, clase, tam, ancla, contenido, medido, estilo) {
    var at = { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' };
    if (medido) { at.textLength = ancho(contenido, tam); at.lengthAdjust = 'spacing'; }
    if (estilo) at.style = estilo;
    var n = A.el('text', at, padre);
    n.textContent = contenido || '';
    return n;
  }

  /* Una paloma (una raya quebrada) o una equis (dos rayas que se cruzan):
     se distinguen sin distinguir colores */
  function paloma(A, padre, x, y, clase) {
    return A.el('path', { d: 'M' + (x - 8) + ' ' + (y + 1) + ' L' + (x - 2) + ' ' + (y + 8) + ' L' + (x + 9) + ' ' + (y - 9),
      fill: 'none', stroke: '#15803d', 'stroke-width': 3, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'class': clase || '' }, padre);
  }
  function equis(A, padre, x, y) {
    return A.el('path', { d: 'M' + (x - 8) + ' ' + (y - 8) + ' L' + (x + 8) + ' ' + (y + 8) + ' M' + (x + 8) + ' ' + (y - 8) + ' L' + (x - 8) + ' ' + (y + 8),
      fill: 'none', stroke: '#b91c1c', 'stroke-width': 3, 'stroke-linecap': 'round' }, padre);
  }

  window.EscenaAnio = function (opciones) {
    var GRADO = opciones.grado;
    var FORMAS = typeof EVAL_FORMAS === 'number' ? EVAL_FORMAS : 0;   // las formas de ESTA misión
    /* Sin una forma distinta para cada mes, lo que dice el paso 4 sería mentira */
    if (FORMAS < OCTUBRE) return null;
    var P = {};

    /* Kenia: vestido, piernas, cabeza, pelo y su lazo */
    function kenia(A, padre) {
      var x = cx(0), s = KENIA.pies;
      var g = A.el('g', { 'data-kenia': '' }, padre);
      /* las piernas del color de su piel: oscuras, se perdían en la pantalla oscura */
      A.el('rect', { x: x - 5, y: s - 14, width: 4, height: 14, rx: 1.6, fill: '#a86a32' }, g);
      A.el('rect', { x: x + 1, y: s - 14, width: 4, height: 14, rx: 1.6, fill: '#a86a32' }, g);
      A.el('path', { d: 'M' + (x - 7) + ' ' + (s - 31) + ' L' + (x + 7) + ' ' + (s - 31) + ' L' + (x + 11) + ' ' + (s - 12) + ' L' + (x - 11) + ' ' + (s - 12) + ' Z', fill: '#db2777' }, g);
      A.el('circle', { cx: x, cy: s - 38, r: 7, fill: '#c68642', 'data-cabeza': '' }, g);
      A.el('path', { d: 'M' + (x - 7) + ' ' + (s - 38) + ' Q' + (x - 7) + ' ' + (s - 47.5) + ' ' + x + ' ' + (s - 46.5) + ' Q' + (x + 7) + ' ' + (s - 47.5) + ' ' + (x + 7) + ' ' + (s - 38) +
        ' Q' + x + ' ' + (s - 42.5) + ' ' + (x - 7) + ' ' + (s - 38) + ' Z', fill: '#3b2a1a' }, g);
      A.el('path', { d: 'M' + (x + 4) + ' ' + (s - 46) + ' l4 -3.5 l0 7 Z', fill: '#f59e0b' }, g);
      texto(A, g, x, NOMBRE.base, 'am-rotulo', NOMBRE.tam, 'middle', 'Kenia', true).setAttribute('data-nombre', '');
      return g;
    }

    /* Una hoja del año: el papel siempre está; lo escrito sale cuando Kenia
       llega a ese mes; el velo lo va borrando; los puntitos son las veces
       que volvió a ella. */
    function hoja(A, padre, c) {
      var x = cx(c);
      var g = A.el('g', { 'data-hoja': String(c) }, padre);
      A.el('rect', { x: x - HOJA.w / 2, y: HOJA.y0, width: HOJA.w, height: HOJA.y1 - HOJA.y0, rx: 2.5, fill: '#fffdf8', stroke: '#c8bfae', 'stroke-width': 1, 'data-papel': '' }, g);
      var tinta = A.el('g', { 'data-tinta': '' }, g);
      RENGLON.y.forEach(function (y, i) {
        A.el('path', { d: 'M' + (x - 8) + ' ' + y + ' L' + (x - 8 + RENGLON.largo[i]) + ' ' + y, stroke: '#374151', 'stroke-width': 2, 'stroke-linecap': 'round', fill: 'none', 'data-renglon': '' }, tinta);
      });
      var velo = A.el('rect', { x: x - VELO.medio, y: VELO.y0, width: VELO.medio * 2, height: VELO.y1 - VELO.y0, fill: '#fffdf8', 'data-velo': '' }, g);
      velo.style.fillOpacity = '0';
      /* solo los puntitos que puede llegar a tener: uno por cada forma de
         los meses que vienen después */
      var puntos = [];
      for (var k = 0; k < OCTUBRE - c; k++) {
        puntos.push(A.el('circle', { cx: x + (k % 2 ? PUNTO.dx : -PUNTO.dx), cy: PUNTO.y[Math.floor(k / 2)], r: PUNTO.r, fill: '#6d28d9', 'data-punto': '' }, g));
      }
      return { g: g, tinta: tinta, velo: velo, puntos: puntos };
    }

    function construir(svg, A) {
      A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

      /* ── la fila del año ── */
      P.hojas = [];
      for (var c = 0; c < PRUEBA; c++) P.hojas.push(hoja(A, svg, c));

      /* la hoja de la prueba */
      var pr = A.el('g', { 'data-prueba': '' }, svg);
      A.el('rect', { x: PRU.x0, y: HOJA.y0, width: PRU.x1 - PRU.x0, height: HOJA.y1 - HOJA.y0, rx: 2.5, fill: '#fffdf8', stroke: '#c8bfae', 'stroke-width': 1, 'data-prueba-caja': '' }, pr);
      A.el('rect', { x: PRU.x0, y: HOJA.y0, width: PRU.x1 - PRU.x0, height: PRU.banda - HOJA.y0, rx: 2.5, fill: '#6d28d9' }, pr);
      texto(A, pr, cx(PRUEBA), PRU.banda - 2.6, '', 8.5, 'middle', GRADO, false, 'fill:#fff;font-family:Fredoka,sans-serif;font-weight:700').setAttribute('data-grado', '');
      texto(A, pr, cx(PRUEBA), PRU.prueba, '', 7.5, 'middle', 'Prueba', true, 'fill:#374151;font-family:Fredoka,sans-serif;font-weight:600');
      P.burbujas = [];
      ['mar', 'oct'].forEach(function (t, i) {
        var y = PRU.filas[i];
        A.el('circle', { cx: PRU.burbuja, cy: y, r: PRU.r, fill: 'none', stroke: '#374151', 'stroke-width': 1 }, pr);
        P.burbujas.push(A.el('circle', { cx: PRU.burbuja, cy: y, r: PRU.r - 0.9, fill: '#374151', 'data-burbuja': String(i) }, pr));
        texto(A, pr, PRU.letra, y + 2.9, '', 8, 'start', t, true, 'fill:#374151;font-family:Fredoka,sans-serif;font-weight:600').setAttribute('data-fila', t);
      });

      /* las marcas de la prueba: la de un año y la del otro, cada una su pieza */
      var ym = (RENGLON.y[0] + RENGLON.y[RENGLON.y.length - 1]) / 2;
      P.marcaA = { mar: equis(A, svg, cx(MARZO), ym), oct: paloma(A, svg, cx(OCTUBRE), ym) };
      P.marcaB = { mar: paloma(A, svg, cx(MARZO), ym), oct: paloma(A, svg, cx(OCTUBRE), ym) };
      P.marcaA.mar.setAttribute('data-marca', 'A-mar'); P.marcaA.oct.setAttribute('data-marca', 'A-oct');
      P.marcaB.mar.setAttribute('data-marca', 'B-mar'); P.marcaB.oct.setAttribute('data-marca', 'B-oct');

      /* ── la raya del año y sus meses ── */
      A.el('path', { d: 'M' + COL.x0 + ' ' + RAYA.y + ' L' + (COL.x0 + COL.w * MESES.length) + ' ' + RAYA.y, fill: 'none', style: 'stroke:var(--gray,#636e72)', 'stroke-width': 1.2, 'data-raya': '' }, svg);
      for (var t = 0; t <= MESES.length; t++) {
        var xt = COL.x0 + COL.w * t;
        A.el('path', { d: 'M' + xt + ' ' + (RAYA.y - RAYA.tic) + ' L' + xt + ' ' + (RAYA.y + RAYA.tic), fill: 'none', style: 'stroke:var(--gray,#636e72)', 'stroke-width': 1, 'data-tic': String(t) }, svg);
      }
      MESES.forEach(function (m, i) {
        texto(A, svg, cx(i), MES_TXT.base, 'am-letra', MES_TXT.tam, 'middle', m, true).setAttribute('data-mes', String(i));
      });

      /* ── Kenia, mes a mes: un salto por mes, uno dentro del otro ── */
      P.saltos = [];
      var padre = svg;
      for (var s = 1; s <= PRUEBA; s++) {
        var sg = A.el('g', { 'data-salto': String(s) }, padre);
        sg.style.transitionTimingFunction = 'linear';
        sg.style.transitionDuration = MES_MS + 'ms';
        P.saltos.push(sg);
        padre = sg;
      }
      P.kenia = kenia(A, padre);

      /* ── arriba: la barra del año a escala, con sus dos días ── */
      P.barra = A.el('g', { 'data-barra': '' }, svg);
      var xNov = COL.x0 + COL.w * PRUEBA, dosDias = r2(COL.w * 2 / DIAS_MES);
      A.el('rect', { x: COL.x0, y: BARRA.y0, width: xNov - COL.x0, height: BARRA.y1 - BARRA.y0, rx: 2, fill: '#1565c0', 'data-clases': '' }, P.barra);
      texto(A, P.barra, (COL.x0 + xNov) / 2, BARRA.y1 - 2.6, '', 9, 'middle', PRUEBA + ' meses de clases', true, 'fill:#fff;font-family:Fredoka,sans-serif;font-weight:700').setAttribute('data-barra-txt', '');
      P.raya2 = A.el('g', { 'data-dos-dias': '' }, svg);
      /* los dos días, a la misma escala, justo antes de la prueba */
      A.el('rect', { x: xNov, y: BARRA.y0 - 2, width: dosDias, height: BARRA.y1 - BARRA.y0 + 4, fill: '#d97706', 'data-rayita': '' }, P.raya2);
      A.el('circle', { cx: r2(xNov + dosDias / 2), cy: (BARRA.y0 + BARRA.y1) / 2, r: 7.5, fill: 'none', style: 'stroke:var(--am-pri)', 'stroke-width': 1.6, 'data-aro-dias': '' }, P.raya2);
      texto(A, P.raya2, xNov + 12, BARRA.y1 - 1.5, 'am-rotulo', 9, 'start', '2 días', true).setAttribute('data-dias-txt', '');

      /* ── arriba: la forma de cada mes, del segundo año ── */
      P.fichas = [];
      for (var f = 1; f <= OCTUBRE; f++) {
        var fg = A.el('g', { 'data-ficha': String(f) }, svg);
        A.el('rect', { x: cx(f) - FICHA.medio, y: FICHA.y0, width: FICHA.medio * 2, height: FICHA.y1 - FICHA.y0, rx: 3, fill: '#7c3aed', 'data-ficha-caja': '' }, fg);
        texto(A, fg, cx(f), FICHA.y1 - 3.9, '', FICHA.tam, 'middle', 'F' + f, true, 'fill:#fff;font-family:Fredoka,sans-serif;font-weight:700');
        P.fichas.push(fg);
      }

      /* ── abajo: los ocho meses sin tocar lo de marzo ── */
      P.llave = A.el('g', { 'data-llave': '' }, svg);
      A.el('path', { d: 'M' + cx(MARZO) + ' ' + (LLAVE.y - LLAVE.tic) + ' L' + cx(MARZO) + ' ' + LLAVE.y + ' L' + cx(PRUEBA) + ' ' + LLAVE.y + ' L' + cx(PRUEBA) + ' ' + (LLAVE.y - LLAVE.tic),
        fill: 'none', style: 'stroke:var(--am-pri)', 'stroke-width': 1.6, 'data-llave-raya': '' }, P.llave);
      texto(A, P.llave, (cx(MARZO) + cx(PRUEBA)) / 2, LLAVE.base, 'am-rotulo', LLAVE.tam, 'middle', (PRUEBA - MARZO) + ' meses sin volver a tocarlo', true).setAttribute('data-llave-txt', '');

      /* ── abajo: un mes de cerca, día por día ── */
      P.zoom = A.el('g', { 'data-zoom': '' }, svg);
      texto(A, P.zoom, ANCHO / 2, ZOOM.titulo, 'am-rotulo', ZOOM.tam, 'middle', 'un mes de clases: unos ' + DIAS_MES + ' días', true).setAttribute('data-zoom-txt', '');
      P.celdas = [];
      for (var d = 0; d < DIAS_MES; d++) {
        P.celdas.push(A.el('rect', { x: r2(ZOOM.x0 + d * ZOOM.celda), y: ZOOM.y0, width: ZOOM.celda, height: ZOOM.y1 - ZOOM.y0,
          style: 'fill:var(--card,#fff);stroke:var(--gray,#636e72)', 'stroke-width': 0.8, 'data-celda': String(d) }, P.zoom));
      }
      P.dosCeldas = A.el('g', { 'data-dos-celdas': '' }, svg);
      for (var e = DIAS_MES - 2; e < DIAS_MES; e++) {
        A.el('rect', { x: r2(ZOOM.x0 + e * ZOOM.celda), y: ZOOM.y0, width: ZOOM.celda, height: ZOOM.y1 - ZOOM.y0, fill: '#d97706', 'data-repaso': String(e) }, P.dosCeldas);
      }
      texto(A, P.dosCeldas, r2(ZOOM.x0 + (DIAS_MES - 1) * ZOOM.celda), ZOOM.rotulo, 'am-rotulo', 9, 'middle', '2 días', true).setAttribute('data-zoom-dias', '');

      /* ── abajo: las formas de esta misión ── */
      P.tira = A.el('g', { 'data-tira': '' }, svg);
      texto(A, P.tira, ANCHO / 2, TIRA.titulo, 'am-rotulo', 9.5, 'middle', 'las ' + FORMAS + ' formas de esta misión', true).setAttribute('data-tira-txt', '');
      P.usadas = [];
      for (var u = 0; u < FORMAS; u++) {
        var fila = TIRA.filas[Math.floor(u / 10)] || TIRA.filas[1];
        var x0 = TIRA.x0 + (u % 10) * TIRA.paso;
        var cg = A.el('g', { 'data-forma': String(u + 1) }, P.tira);
        A.el('rect', { x: x0, y: fila[0], width: TIRA.w, height: fila[1] - fila[0], rx: 3, style: 'fill:var(--card,#fff);stroke:var(--gray,#636e72)', 'stroke-width': 1, 'data-forma-caja': '' }, cg);
        texto(A, cg, x0 + TIRA.w / 2, fila[1] - 5, 'am-letra', TIRA.tam, 'middle', String(u + 1), true);
        var lit = A.el('g', { 'data-usada': String(u + 1) }, cg);
        A.el('rect', { x: x0, y: fila[0], width: TIRA.w, height: fila[1] - fila[0], rx: 3, fill: '#7c3aed' }, lit);
        texto(A, lit, x0 + TIRA.w / 2, fila[1] - 5, '', TIRA.tam, 'middle', String(u + 1), true, 'fill:#fff;font-family:Fredoka,sans-serif;font-weight:700');
        P.usadas.push(lit);
      }
      texto(A, P.tira, ANCHO / 2, TIRA.pie, 'am-rotulo', 9.5, 'middle', 'una distinta cada mes: ' + OCTUBRE + ' de ' + FORMAS, true).setAttribute('data-tira-pie', '');

      /* ── abajo: lo que escribe el alumno ── */
      P.nota = A.el('g', { 'data-nota': '' }, svg);
      A.el('rect', { x: NOTA.x0, y: NOTA.y0, width: NOTA.x1 - NOTA.x0, height: NOTA.y1 - NOTA.y0, rx: 5, fill: '#fffdf8', stroke: '#c8bfae', 'stroke-width': 1, 'data-nota-caja': '' }, P.nota);
      var tinta = 'fill:#374151;font-family:Fredoka,sans-serif;font-weight:600';
      texto(A, P.nota, NOTA.x0 + 12, NOTA.titulo, '', 9.5, 'start', 'En tu cuaderno:', true, 'fill:#6d28d9;font-family:Fredoka,sans-serif;font-weight:700');
      texto(A, P.nota, NOTA.x0 + 12, NOTA.l1, '', NOTA.tam, 'start', 'Algo de marzo que no he vuelto a tocar:', true, tinta).setAttribute('data-nota-l1', '');
      A.el('path', { d: 'M' + (NOTA.x0 + 12) + ' ' + NOTA.raya1 + ' L' + (NOTA.x1 - 12) + ' ' + NOTA.raya1, stroke: '#9ca3af', 'stroke-width': 1, fill: 'none', 'data-nota-raya': '1' }, P.nota);
      var l2 = 'Lo repaso el día:';
      texto(A, P.nota, NOTA.x0 + 12, NOTA.l2, '', NOTA.tam, 'start', l2, true, tinta).setAttribute('data-nota-l2', '');
      var x2 = r2(NOTA.x0 + 12 + ancho(l2, NOTA.tam) + 6);
      A.el('path', { d: 'M' + x2 + ' ' + (NOTA.l2 + 1) + ' L' + (NOTA.x1 - 12) + ' ' + (NOTA.l2 + 1), stroke: '#9ca3af', 'stroke-width': 1, fill: 'none', 'data-nota-raya': '2' }, P.nota);

      /* ── abajo, en los dos primeros pasos: qué quiere decir el dibujo ── */
      function mini(padre, x, claro) {
        A.el('rect', { x: x, y: LEYENDA.y0, width: LEYENDA.w, height: LEYENDA.y1 - LEYENDA.y0, rx: 2, fill: '#fffdf8', stroke: '#c8bfae', 'stroke-width': 1, 'data-mini': claro == null ? 'blanca' : (claro ? 'clara' : 'fresca') }, padre);
        if (claro == null) return;
        [0, 1, 2].forEach(function (i) {
          A.el('path', { d: 'M' + (x + 3) + ' ' + (LEYENDA.y0 + 7 + i * 6) + ' L' + (x + LEYENDA.w - 3 - (i === 1 ? 3 : 0)) + ' ' + (LEYENDA.y0 + 7 + i * 6),
            stroke: claro ? '#d1d5db' : '#374151', 'stroke-width': 1.8, 'stroke-linecap': 'round', fill: 'none' }, padre);
        });
      }
      P.leyenda = [A.el('g', { 'data-leyenda': '0' }, svg), A.el('g', { 'data-leyenda': '1' }, svg)];
      mini(P.leyenda[0], LEYENDA.x[0][0], null);
      texto(A, P.leyenda[0], LEYENDA.x[0][0] + LEYENDA.w + 8, LEYENDA.base, 'am-rotulo', LEYENDA.tam, 'start', 'una hoja por mes: lo que ve en clase', true);
      mini(P.leyenda[1], LEYENDA.x[1][0], false);
      texto(A, P.leyenda[1], LEYENDA.x[1][0] + LEYENDA.w + 8, LEYENDA.base, 'am-rotulo', LEYENDA.tam, 'start', 'lo tiene fresco', true);
      mini(P.leyenda[1], LEYENDA.x[1][1], true);
      texto(A, P.leyenda[1], LEYENDA.x[1][1] + LEYENDA.w + 8, LEYENDA.base, 'am-rotulo', LEYENDA.tam, 'start', 'se le está borrando', true);

      /* el aro de marzo, para el último paso */
      P.aroMarzo = A.el('rect', { x: cx(MARZO) - HOJA.w / 2 - 3, y: HOJA.y0 - 3, width: HOJA.w + 6, height: HOJA.y1 - HOJA.y0 + 6, rx: 5, fill: 'none',
        style: 'stroke:var(--am-pri)', 'stroke-width': 1.8, 'data-aro-marzo': '' }, svg);
    }

    /* ── los estados ───────────────────────────────────────────── */

    /* Un estado de la lista con algo cambiado, sin tocar la lista */
    function con(s, cambios) {
      var o = {}, k;
      for (k in s) o[k] = s[k];
      for (k in cambios) o[k] = cambios[k];
      return o;
    }

    function deGolpe(A, piezas, hazlo) {
      piezas.forEach(function (p) { p.classList.add('am-quieto'); });
      hazlo();
      A.asentar();
      piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
    }

    function todo() {
      var l = [P.barra, P.raya2, P.llave, P.zoom, P.dosCeldas, P.tira, P.nota, P.aroMarzo, P.kenia, P.leyenda[0], P.leyenda[1]]
        .concat(P.saltos, P.fichas, P.usadas, P.burbujas, [P.marcaA.mar, P.marcaA.oct, P.marcaB.mar, P.marcaB.oct]);
      P.hojas.forEach(function (h) { l.push(h.g); });
      return l;
    }

    /* Cuántos meses lleva cada hoja sin tocarse al llegar la prueba, en el
       año en que solo la ve una vez */
    function borrado(c) { return r2(BORRA * (PRUEBA - c)); }

    /* El estado al TERMINAR cada paso. kenia: en qué columna está;
       anio: 0 nada escrito, 'A' el año de una sola vez, 'B' el de una
       forma cada mes. */
    var ESTADOS = [
      { kenia: 0, anio: 0, respondida: false, marcas: '', llave: false, barra: false, zoom: false, tira: false, nota: false, aro: false, leyenda: 0 },
      { kenia: PRUEBA, anio: 'A', respondida: false, marcas: '', llave: false, barra: false, zoom: false, tira: false, nota: false, aro: false, leyenda: 1 },
      { kenia: PRUEBA, anio: 'A', respondida: true, marcas: 'A', llave: true, barra: false, zoom: false, tira: false, nota: false, aro: false },
      { kenia: PRUEBA, anio: 'A', respondida: true, marcas: 'A', llave: false, barra: true, zoom: true, tira: false, nota: false, aro: false },
      { kenia: PRUEBA, anio: 'B', respondida: true, marcas: 'B', llave: false, barra: false, zoom: false, tira: true, nota: false, aro: false },
      { kenia: PRUEBA, anio: 'B', respondida: true, marcas: 'B', llave: false, barra: false, zoom: false, tira: false, nota: true, aro: true }
    ];

    function base(A, s) {
      deGolpe(A, todo(), function () {
        P.saltos.forEach(function (g, i) { A.mover(g, i + 1 <= s.kenia ? COL.w : 0, 0, 0, 1, 0); });
        P.hojas.forEach(function (h, c) {
          A.ver(h.tinta, !!s.anio, 0);
          h.velo.style.transition = '';
          h.velo.style.fillOpacity = s.anio === 'A' ? String(borrado(c)) : '0';
          /* en el año de una forma cada mes, la hoja c tiene un puntito por
             cada forma de los meses que vinieron después de ella */
          h.puntos.forEach(function (p, k) { A.ver(p, s.anio === 'B' && k < OCTUBRE - c, 0); });
        });
        P.fichas.forEach(function (f) { A.ver(f, s.anio === 'B', 0); });
        P.usadas.forEach(function (u, i) { A.ver(u, s.tira && i < OCTUBRE, 0); });
        P.burbujas.forEach(function (b) { A.ver(b, s.respondida, 0); });
        A.ver(P.marcaA.mar, s.marcas === 'A', 0); A.ver(P.marcaA.oct, s.marcas === 'A', 0);
        A.ver(P.marcaB.mar, s.marcas === 'B', 0); A.ver(P.marcaB.oct, s.marcas === 'B', 0);
        A.ver(P.llave, s.llave, 0);
        A.ver(P.barra, s.barra, 0); A.ver(P.raya2, s.barra, 0);
        A.ver(P.zoom, s.zoom, 0); A.ver(P.dosCeldas, s.zoom, 0);
        A.ver(P.tira, s.tira, 0);
        A.ver(P.nota, s.nota, 0);
        A.ver(P.aroMarzo, s.aro, 0);
        A.ver(P.leyenda[0], s.leyenda === 0, 0);
        A.ver(P.leyenda[1], s.leyenda === 1, 0);
      });
    }

    /* Kenia camina el año: un salto por mes, a paso parejo */
    function caminar(A) {
      P.saltos.forEach(function (g, i) { A.mover(g, COL.w, 0, 0, 1, llega(i)); });
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
        A.ver(P.tira, false, T5.nota);
        P.usadas.forEach(function (u) { A.ver(u, false, T5.nota); });
        A.ver(P.nota, true, T5.nota + 400);
        A.ver(P.aroMarzo, true, T5.aro + 400);
        return;
      }
      if (n === 1 || n === 4) {
        var anio = n === 1 ? 'A' : 'B';
        base(A, ESTADOS[0]);
        caminar(A);
        P.hojas.forEach(function (h, c) {
          A.ver(h.tinta, true, llega(c));
          if (anio === 'A') {
            /* se va borrando desde que la escribe hasta que llega la prueba,
               todas al mismo paso */
            h.velo.style.transition = 'fill-opacity ' + (llega(PRUEBA) - llega(c)) + 'ms linear ' + llega(c) + 'ms';
            h.velo.style.fillOpacity = String(borrado(c));
          }
        });
        if (anio === 'A') {
          A.ver(P.leyenda[0], false, 0);
          A.ver(P.leyenda[1], true, llega(3));
        } else A.ver(P.leyenda[0], false, 0);
        if (anio === 'B') {
          A.ver(P.tira, true, 0);
          for (var f = 1; f <= OCTUBRE; f++) {
            A.ver(P.fichas[f - 1], true, llega(f) + T4.ficha);
            A.ver(P.usadas[f - 1], true, llega(f) + T4.tira);
            /* la forma de este mes vuelve a todo lo de antes: un puntito en
               cada hoja anterior */
            for (var c = 0; c < f; c++) A.ver(P.hojas[c].puntos[f - 1 - c], true, llega(f) + T4.puntos);
          }
          P.burbujas.forEach(function (b) { A.ver(b, true, llega(PRUEBA) + T4.marcas - 250); });
          A.ver(P.marcaB.mar, true, llega(PRUEBA) + T4.marcas);
          A.ver(P.marcaB.oct, true, llega(PRUEBA) + T4.marcas + 300);
        }
        return;
      }
      if (n === 2) {
        /* la leyenda deja su sitio a la llave de los ocho meses. Volviendo
           desde el 3 no estaba, y no se asoma */
        base(A, antes === 1 ? ESTADOS[1] : con(ESTADOS[1], { leyenda: -1 }));
        A.ver(P.leyenda[1], false, 0);
        P.burbujas.forEach(function (b, i) { A.ver(b, true, T2.burbujas + i * 150); });
        A.ver(P.marcaA.mar, true, T2.marzo);
        A.ver(P.marcaA.oct, true, T2.octubre);
        A.ver(P.llave, true, T2.llave);
        return;
      }
      /* el 3: dos días, a la escala del año. La llave se va si estaba;
         volviendo desde el 4 no estaba, y no se asoma */
      base(A, antes === 2 ? ESTADOS[2] : con(ESTADOS[2], { llave: false }));
      A.ver(P.llave, false, 0);
      A.ver(P.barra, true, T3.barra);
      A.ver(P.raya2, true, T3.raya);
      A.ver(P.zoom, true, T3.zoom);
      A.ver(P.dosCeldas, true, T3.dias);
    }

    var FRASES = [
      'Kenia aprende algo nuevo cada mes, de febrero a octubre, y en noviembre viene la prueba. ¿Qué le quedará de marzo?',
      'Lo ve una vez y sigue con lo nuevo. Lo que no vuelve a tocar se va borrando, mes a mes.',
      'En la prueba, lo de octubre le sale bien: lo tiene fresco. Lo de marzo, mal: lo vio una vez, hace ocho meses.',
      '¿Y si repasa dos días antes? En la raya del año, dos días son esta rayita. Nueve meses de clases no caben ahí.',
      'Otro año: desde marzo, cada mes hace una forma distinta de la prueba, y cada forma pregunta de todo el año. Así vuelve siete veces a lo de marzo, y en noviembre le sale bien.',
      '¿Qué viste en marzo y no has vuelto a tocar? Escríbelo en tu cuaderno, con el día en que lo vas a repasar.'
    ];
    var BOTONES = ['📅 Que pase el año', '📝 La prueba', '⏳ ¿Y dos días antes?', '🔁 Otro año', '✍️ ¿Y tú?', '↺ Empezar otra vez'];
    var MARCADOR = [[String(PRUEBA), 'meses de clases, y después la prueba'], [String(PRUEBA), 'cosas aprendidas, una vez cada una'], ['1', 'de 2 preguntas bien: la de octubre'],
      ['2', 'días de repaso, contra ' + PRUEBA + ' meses de clases'], [String(OCTUBRE - MARZO), 'veces volvió a lo de marzo'], ['?', 'el día en que vuelves a lo de marzo']];

    return {
      vista: [ANCHO, ALTO],
      describe: 'El año de clases de Kenia, de febrero a octubre, con una hoja por mes y la prueba en noviembre. Lo que ve una sola vez se va borrando: ' +
        'en la prueba, lo de octubre le sale bien y lo de marzo, mal. Dos días de repaso, a la escala del año, son una rayita. ' +
        'Otro año hace cada mes una forma distinta de la prueba, vuelve a lo de antes, y en noviembre le sale todo bien.',
      pasos: FRASES.length,
      construir: construir,
      pintar: pintar,
      texto: function (n) { return FRASES[n]; },
      boton: function (n) { return BOTONES[n]; },
      atajo: function () { return null; },
      marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
    };
  };
})();
