/* ============================================================
   Animación de «La Ley Fundamental de Educación en el aula»
   (misión del maestro, sección «Aprende», detrás de las cuatro cosas
   que la ley pone en sus manos)
   ------------------------------------------------------------
   Lo que enseña: la tercera de esas cuatro cosas, la evaluación, como
   pasa en el aula. La mamá de Marvin pregunta por qué le puso 2 y no 3.
   La nota se contesta con el criterio: tres cosas, y una no está. Y lo
   que asombra: el MISMO criterio, con la MISMA nota, defiende la nota
   si estaba escrito antes de la tarea, en el cuaderno del alumno, y la
   hace parecer inventada si se escribe después de que ella preguntó.

   De dónde sale: de la propia misión, que lo dice con estas palabras en
   «Aprende»: «con qué criterio, escrito dónde, avisado cuándo» y «Un
   criterio escrito de antemano defiende su nota; uno explicado después
   parece inventado, aunque sea justo». La escena las busca en la página
   antes de montarse: si dejaran de estar, queda la frase de reserva.

   ⚠️ Lo que NO se dice, y a propósito: casi todo lo demás de esta misión
   lo preguntan el quiz, el completar y el simulacro (los artículos y sus
   números, los doscientos días, la gratuidad, los niveles, los ciclos y
   sus edades, de dónde salen los criterios y qué define el currículo, el
   Proyecto Educativo de Centro, la rendición de cuentas). Por eso la
   escena no nombra ninguno: enseña CUÁNDO se escribe un criterio, que no
   lo pregunta nadie.

   ⚠️ Nada se dice solo con color: lo que está lleva ✓ (una raya) y lo
   que falta ✗ (dos), y lo que dice la mamá va escrito.

   La oración de Marvin lleva su ancho medido con la Fredoka (AV, por cada
   100 px) y `textLength`: cada flecha señala su letra antes de que llegue
   la letra.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCriterio')) return;

  var ANCHO = 320, ALTO = 340;

  /* ── lo que dice la misión, y sin lo que no se monta ── */
  var aprende = document.getElementById('sec-aprende');
  var dice = aprende ? aprende.textContent.replace(/\s+/g, ' ') : '';
  if (!/con qué criterio, escrito dónde, avisado cuándo/.test(dice) ||
      !/escrito de antemano defiende su nota/.test(dice) ||
      !/parece inventado, aunque sea justo/.test(dice)) return;

  /* ── las medidas de la letra (Fredoka 600, por cada 100 px) ── */
  var AV = {
    a: 56.3, b: 56.3, c: 50.5, d: 56.5, e: 53.7, f: 40.5, g: 55.2, h: 55.4, i: 24.2, j: 23.6, k: 50.4, l: 30.1, m: 80.3,
    n: 56.3, o: 55.9, p: 55.2, q: 55.1, r: 42.3, s: 45.8, t: 41.1, u: 56, v: 56.4, w: 74.6, x: 52.3, y: 55.9, z: 54,
    A: 70.9, E: 61, M: 81.4, T: 64.8, 'á': 56.3, 'é': 53.7, 'í': 22.5, 'ó': 55.9, 'ú': 56, ' ': 24.1, ',': 22.4,
    '.': 21.7, ':': 22.5, '¿': 47.5, '?': 48.1, '2': 55.6, '3': 55.6
  };
  function ancho(t, tam) {
    var s = 0;
    for (var i = 0; i < t.length; i++) s += AV[t.charAt(i)] != null ? AV[t.charAt(i)] : 56;
    return Math.round(s * tam) / 100;
  }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* ── la tarea de Marvin: la oración, en trozos ──
     Cada trozo: [texto, lo que señala]. ⚠️ Ningún trozo acaba ni empieza
     en espacio: el SVG se come el espacio del borde de un texto. El
     espacio va en su propio trozo, que no pinta nada y solo corre el
     siguiente (es la lección de la escena del patio). */
  var ORACION = 'mi escuela es grande.';
  var TROZOS = [['m', 'mayuscula'], ['i'], [' '], ['escuela', 'escuela'], [' '], ['es'], [' '], ['grande'], ['.', 'punto']];
  if (TROZOS.map(function (t) { return t[0]; }).join('') !== ORACION) return;
  var TAM = 16, X0 = 20, BASE = 44;

  /* ── el criterio: tres cosas, y cada una se busca en la oración ──
     Lo que está o no está NO se escribe a mano: se mira la oración. */
  var CRITERIO = [
    { lineas: ['Empieza con', 'mayúscula'], busca: 'mayuscula', esta: function (o) { return o.charAt(0) !== o.charAt(0).toLowerCase(); } },
    { lineas: ['Habla de', 'su escuela'], busca: 'escuela', esta: function (o) { return /\bescuela\b/.test(o); } },
    { lineas: ['Termina', 'con punto'], busca: 'punto', esta: function (o) { return /\.$/.test(o); } }
  ];
  var ESTAN = CRITERIO.filter(function (c) { return c.esta(ORACION); }).length;
  var NOTA = ESTAN + '\u00a0de\u00a0' + CRITERIO.length;   /* con espacios que no se parten */
  var CX = [100, 180, 260];            /* el centro de cada cosa del criterio */
  var CAJA_Y = 88;                     /* donde empieza la casilla de cada una */

  /* ── la semana ──
     Los días van en su orden y a la misma distancia: lo que cuenta aquí es
     qué pasó antes y qué después, no cuántos días hay entre una cosa y otra.
     El criterio va en su propio carril, encima de lo que pasa cada día, para
     moverse sin pasar por encima de nada. «Después» es el mismo día de la
     pregunta, más tarde. */
  var DIAS = [['lunes', 36], ['miércoles', 108], ['viernes', 180], ['el otro lunes', 252]];
  var PASA = [['la tarea', 1], ['la nota', 2], ['la pregunta', 3]];
  var DESPUES = 288;
  var EJE = 194, CHIP = { y0: 146, alto: 18, ancho: 50 }, PASA_Y = 170;
  var SITIO = { lunes: DIAS[0][1], despues: DESPUES };

  /* ── la mamá, lo que dice, y el cuaderno de Marvin que ella abre ── */
  var MAMA = { x: 290, pies: 322 };
  var CABEZA = { x: MAMA.x, y: MAMA.pies - 47, r: 8 };
  var GLOBO = { x1: 272, y0: 224, y1: 248, tam: 11 };
  var VEREDICTO = { x: 156, y: 272 };
  var CUADERNO = { x0: 12, x1: 138, y0: 254, y1: 334, dia: 270, renglon: [287, 301, 315] };
  var DICHOS = ['¿Por qué ' + ESTAN + ' y no ' + CRITERIO.length + '?', 'Ah, estaba en su cuaderno.', 'Eso lo escribió hoy.'];

  /* ── el reloj de la escena ── */
  var T1 = { hueco: 0, tarjeta: 500, linea: 1100, cada: 1300, punta: 800, marca: 1000 };
  var T2 = { apaga: 0, chip: 600, tapa: 600, abre: 1100, globoSale: 1400, globo: 1900, veredicto: 2400 };
  var T3 = { sale: 0, mueve: 500, borra: 500, llega: 1300, globo: 1800, veredicto: 2300 };
  var T4 = { sale: 0, cuaderno: 500, chip: 900 };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido, medido) {
    var at = { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' };
    if (medido) { at.textLength = ancho(contenido, tam); at.lengthAdjust = 'spacing'; }
    var n = A.el('text', at, padre);
    n.textContent = contenido;
    return n;
  }
  /* ✓ es una raya quebrada; ✗, dos rayas que se cruzan */
  function marca(A, padre, x, y, bien, tam) {
    var t = tam || 5, g = A.el('g', { 'data-marca': bien ? 'bien' : 'mal' }, padre);
    if (bien) {
      A.el('path', { d: 'M' + r2(x - t) + ' ' + r2(y) + ' L' + r2(x - t * 0.2) + ' ' + r2(y + t * 0.8) + ' L' + r2(x + t) + ' ' + r2(y - t * 0.9), 'class': 'cr-bien' }, g);
    } else {
      A.el('path', { d: 'M' + r2(x - t * 0.8) + ' ' + r2(y - t * 0.8) + ' L' + r2(x + t * 0.8) + ' ' + r2(y + t * 0.8), 'class': 'cr-mal' }, g);
      A.el('path', { d: 'M' + r2(x + t * 0.8) + ' ' + r2(y - t * 0.8) + ' L' + r2(x - t * 0.8) + ' ' + r2(y + t * 0.8), 'class': 'cr-mal' }, g);
    }
    return g;
  }
  /* El globo de lo que dice la mamá, del ancho de lo que dice, con la
     punta en su cabeza. Cada cosa que dice lleva su propio globo: uno que
     se queda y solo cambia la letra se ve vacío entre una frase y otra. */
  function globo(A, padre, dicho, i) {
    var w = ancho(dicho, GLOBO.tam) + 22, x1 = GLOBO.x1, x0 = x1 - w, y0 = GLOBO.y0, y1 = GLOBO.y1;
    var px = CABEZA.x - 6.5, py = CABEZA.y - 5.5;
    var g = A.el('g', { 'data-globo': i }, padre);
    A.el('path', { d: 'M' + r2(x0 + 6) + ' ' + y0 + ' L' + r2(x1 - 6) + ' ' + y0 + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + 6) +
      ' L' + x1 + ' ' + (y1 - 6) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - 6) + ' ' + y1 + ' L' + r2(px) + ' ' + r2(py) +
      ' L' + (x1 - 18) + ' ' + y1 + ' L' + r2(x0 + 6) + ' ' + y1 + ' Q' + r2(x0) + ' ' + y1 + ' ' + r2(x0) + ' ' + (y1 - 6) +
      ' L' + r2(x0) + ' ' + (y0 + 6) + ' Q' + r2(x0) + ' ' + y0 + ' ' + r2(x0 + 6) + ' ' + y0 + ' Z', 'class': 'cr-globo', 'data-globo-caja': '' }, g);
    texto(A, g, (x0 + x1) / 2, y1 - 8, 'cr-tinta', GLOBO.tam, 'middle', dicho).setAttribute('data-globo-txt', '');
    return g;
  }
  /* La mamá de Marvin: piernas, falda, blusa, brazos, cabeza y pelo con
     su moño. */
  function mama(A, padre) {
    var x = MAMA.x, s = MAMA.pies, c = CABEZA;
    var g = A.el('g', { 'data-mama': '' }, padre);
    A.el('rect', { x: x - 5, y: s - 11, width: 3.5, height: 11, rx: 1.2, 'class': 'cr-piel', 'data-pie': '' }, g);
    A.el('rect', { x: x + 1.5, y: s - 11, width: 3.5, height: 11, rx: 1.2, 'class': 'cr-piel', 'data-pie': '' }, g);
    A.el('path', { d: 'M' + (x - 7) + ' ' + (s - 27) + ' L' + (x + 7) + ' ' + (s - 27) + ' L' + (x + 10) + ' ' + (s - 10) + ' L' + (x - 10) + ' ' + (s - 10) + ' Z', 'class': 'cr-falda' }, g);
    A.el('rect', { x: x - 7.5, y: s - 41, width: 15, height: 16, rx: 4, 'class': 'cr-blusa' }, g);
    A.el('path', { d: 'M' + (x - 6.5) + ' ' + (s - 37) + ' L' + (x - 11) + ' ' + (s - 24), 'class': 'cr-brazo' }, g);
    A.el('path', { d: 'M' + (x + 6.5) + ' ' + (s - 37) + ' L' + (x + 11) + ' ' + (s - 24), 'class': 'cr-brazo' }, g);
    A.el('circle', { cx: c.x, cy: c.y, r: c.r, 'class': 'cr-piel', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 8) + ' ' + (c.y - 0.5) + ' Q' + (x - 7) + ' ' + (c.y - 9.5) + ' ' + x + ' ' + (c.y - 8.6) +
      ' Q' + (x + 7) + ' ' + (c.y - 9.5) + ' ' + (x + 8) + ' ' + (c.y - 0.5) + ' Q' + x + ' ' + (c.y - 4.5) + ' ' + (x - 8) + ' ' + (c.y - 0.5) + ' Z', 'class': 'cr-pelo' }, g);
    A.el('circle', { cx: x + 8.5, cy: c.y - 6, r: 3.6, 'class': 'cr-pelo' }, g);
    return g;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── la tarea de Marvin, con su nota ── */
    P.tarea = A.el('g', { 'data-tarea': '' }, svg);
    A.el('rect', { x: 8, y: 6, width: 304, height: 52, rx: 6, 'class': 'cr-papel', 'data-tarea-papel': '' }, P.tarea);
    texto(A, P.tarea, 18, 20, 'cr-tinta-suave', 10, 'start', 'Tarea de Marvin').setAttribute('data-de', '');
    P.blanco = {};
    var x = X0;
    TROZOS.forEach(function (t, i) {
      var w = ancho(t[0], TAM);
      if (t[0].trim()) {
        var n = texto(A, P.tarea, x, BASE, 'cr-tinta', TAM, 'start', t[0], true);
        n.setAttribute('data-trozo', i);
        if (t[1]) { n.setAttribute('data-blanco', t[1]); P.blanco[t[1]] = { x0: x, x1: x + w }; }
      }
      x += w;
    });
    A.el('rect', { x: 238, y: 20, width: 64, height: 32, rx: 8, 'class': 'cr-nota-caja', 'data-nota-caja': '' }, P.tarea);
    texto(A, P.tarea, 270, 42, 'cr-nota', 16, 'middle', NOTA).setAttribute('data-nota', '');

    /* ── antes de contestar, el sitio del criterio, vacío: es la pregunta
       de la misión, «con qué criterio» ── */
    P.hueco = A.el('g', { 'data-hueco': '' }, svg);
    A.el('rect', { x: 8, y: 66, width: 304, height: 70, rx: 6, 'class': 'am-hueco', 'data-hueco-caja': '' }, P.hueco);
    texto(A, P.hueco, 160, 105, 'am-rotulo', 12, 'middle', '¿Con qué criterio?').setAttribute('data-hueco-txt', '');

    /* ── el criterio ── */
    P.tarjeta = A.el('g', { 'data-criterio': '' }, svg);
    A.el('rect', { x: 8, y: 66, width: 304, height: 70, rx: 6, 'class': 'cr-tarjeta', 'data-criterio-papel': '' }, P.tarjeta);
    texto(A, P.tarjeta, 18, 82, 'cr-tinta', 11, 'start', 'Criterio').setAttribute('data-criterio-titulo', '');
    P.marca = []; P.linea = []; P.punta = [];
    CRITERIO.forEach(function (c, k) {
      var cx = CX[k];
      A.el('rect', { x: cx - 7, y: CAJA_Y, width: 14, height: 14, rx: 2, 'class': 'cr-casilla', 'data-casilla': k }, P.tarjeta);
      c.lineas.forEach(function (l, j) {
        texto(A, P.tarjeta, cx, 118 + 12 * j, 'cr-tinta', 10.5, 'middle', l).setAttribute('data-cosa', k);
      });
      var m = marca(A, P.tarjeta, cx, CAJA_Y + 7, c.esta(ORACION), 4.6);
      m.setAttribute('data-de-cosa', k);
      P.marca.push(m);
    });
    /* ── cada cosa del criterio señala su sitio en la oración: una flecha
       de su casilla a la letra, que llega por debajo de la línea ── */
    CRITERIO.forEach(function (c, k) {
      var b = P.blanco[c.busca], tx = (b.x0 + b.x1) / 2, ty = BASE + 6;
      var sx = CX[k], sy = CAJA_Y, dx = tx - sx, dy = ty - sy, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
      var bx = tx - ux * 5.5, by = ty - uy * 5.5, px = -uy, py = ux;
      var ln = A.el('path', { d: 'M' + sx + ' ' + sy + ' L' + r2(bx) + ' ' + r2(by), 'class': 'cr-flecha', 'data-flecha': k }, svg);
      var pu = A.el('path', { d: 'M' + r2(tx) + ' ' + r2(ty) + ' L' + r2(bx + px * 3.2) + ' ' + r2(by + py * 3.2) + ' L' + r2(bx - px * 3.2) + ' ' + r2(by - py * 3.2) + ' Z',
        'class': 'cr-punta', 'data-punta': k }, svg);
      P.linea.push(ln); P.punta.push(pu);
    });

    /* ── la semana ── */
    P.semana = A.el('g', { 'data-semana': '' }, svg);
    A.el('path', { d: 'M14 ' + EJE + ' L306 ' + EJE, 'class': 'cr-eje', 'data-eje': '' }, P.semana);
    DIAS.forEach(function (d) {
      A.el('path', { d: 'M' + d[1] + ' ' + (EJE - 4) + ' L' + d[1] + ' ' + (EJE + 4), 'class': 'cr-eje', 'data-dia-raya': d[0] }, P.semana);
      texto(A, P.semana, d[1], EJE + 16, 'am-rotulo', 9.5, 'middle', d[0]).setAttribute('data-dia', d[0]);
    });
    PASA.forEach(function (p) {
      var x = DIAS[p[1]][1], w = ancho(p[0], 9.5) + 12;
      var g = A.el('g', { 'data-pasa': p[0] }, P.semana);
      A.el('rect', { x: r2(x - w / 2), y: PASA_Y, width: r2(w), height: 16, rx: 4, 'class': 'cr-dia', 'data-pasa-caja': '' }, g);
      texto(A, g, x, PASA_Y + 11.5, 'cr-tinta', 9.5, 'middle', p[0]);
    });
    /* lo que baja del criterio a su día: una por cada sitio, y se apaga
       mientras el criterio se mueve (si fuera con él, pasaría por encima
       de lo que pasa cada día) */
    P.baja = {};
    Object.keys(SITIO).forEach(function (k) {
      P.baja[k] = A.el('path', { d: 'M' + SITIO[k] + ' ' + (CHIP.y0 + CHIP.alto) + ' L' + SITIO[k] + ' ' + EJE, 'class': 'cr-baja', 'data-baja': k }, svg);
    });
    /* el criterio en su día: un sobre que lo lleva y otro que lo enciende */
    P.chip = A.el('g', { 'data-chip': '' }, svg);
    P.chipVe = A.el('g', { 'data-chip-ve': '' }, P.chip);
    A.el('rect', { x: -CHIP.ancho / 2, y: CHIP.y0, width: CHIP.ancho, height: CHIP.alto, rx: 4, 'class': 'cr-tarjeta', 'data-chip-caja': '' }, P.chipVe);
    texto(A, P.chipVe, 0, CHIP.y0 + 12.5, 'cr-tinta', 10, 'middle', 'criterio').setAttribute('data-chip-txt', '');

    /* ── la mamá, lo que dice y lo que piensa de la nota ── */
    P.mama = mama(A, svg);
    P.globo = DICHOS.map(function (d, i) { return globo(A, svg, d, i); });
    P.veredicto = {};
    [['bien', 'la nota se defiende'], ['mal', 'parece inventado']].forEach(function (v) {
      var g = A.el('g', { 'data-veredicto': v[0] }, svg);
      marca(A, g, VEREDICTO.x, VEREDICTO.y, v[0] === 'bien', 5.2);
      texto(A, g, VEREDICTO.x + 14, VEREDICTO.y + 4.5, 'am-rotulo', 11, 'start', v[1]).setAttribute('data-veredicto-txt', '');
      P.veredicto[v[0]] = g;
    });

    /* ── el cuaderno de Marvin, abierto en el lunes: ahí está el criterio
       si se dio antes, y no está si se escribió después. «Escrito dónde,
       avisado cuándo», que es lo que dice la misión. ── */
    var C = CUADERNO;
    /* cerrado, mientras nadie lo abre: es lo primero que la mamá va a mirar */
    P.tapa = A.el('g', { 'data-cuaderno-tapa': '' }, svg);
    A.el('rect', { x: C.x0, y: C.y0, width: C.x1 - C.x0, height: C.y1 - C.y0, rx: 4, 'class': 'cr-tapa', 'data-tapa-papel': '' }, P.tapa);
    A.el('rect', { x: C.x0, y: C.y0, width: 10, height: C.y1 - C.y0, rx: 3, 'class': 'cr-lomo' }, P.tapa);
    A.el('rect', { x: 43, y: 276, width: 76, height: 30, rx: 3, 'class': 'cr-papel', 'data-tapa-etiqueta': '' }, P.tapa);
    texto(A, P.tapa, 81, 288, 'cr-tinta-suave', 8.5, 'middle', 'cuaderno de');
    texto(A, P.tapa, 81, 301, 'cr-tinta', 11, 'middle', 'Marvin').setAttribute('data-tapa-de', '');
    P.suyo = A.el('g', { 'data-cuaderno-marvin': '' }, svg);
    A.el('rect', { x: C.x0, y: C.y0, width: C.x1 - C.x0, height: C.y1 - C.y0, rx: 4, 'class': 'cr-papel', 'data-cuaderno-marvin-papel': '' }, P.suyo);
    A.el('path', { d: 'M' + (C.x0 + 9) + ' ' + (C.y0 + 3) + ' L' + (C.x0 + 9) + ' ' + (C.y1 - 3), 'class': 'cr-margen' }, P.suyo);
    texto(A, P.suyo, C.x0 + 14, C.dia, 'cr-tinta', 10, 'start', 'lunes').setAttribute('data-cuaderno-dia', '');
    texto(A, P.suyo, C.x1 - 6, C.dia, 'cr-tinta-suave', 8.5, 'end', 'de Marvin').setAttribute('data-cuaderno-de', '');
    C.renglon.forEach(function (y) {
      A.el('path', { d: 'M' + (C.x0 + 12) + ' ' + (y + 3) + ' L' + (C.x1 - 6) + ' ' + (y + 3), 'class': 'cr-renglon', 'data-renglon': '' }, P.suyo);
    });
    P.copia = A.el('g', { 'data-copia': '' }, P.suyo);
    CRITERIO.forEach(function (c, k) {
      texto(A, P.copia, C.x0 + 14, C.renglon[k], 'cr-tinta', 9.5, 'start', c.lineas.join(' ')).setAttribute('data-copia-cosa', k);
    });

    /* ── el cuaderno del maestro: sale donde estaba la mamá ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: 8, y: 222, width: 304, height: 112, rx: 6, 'class': 'cr-papel', 'data-cuaderno-papel': '' }, P.cuaderno);
    texto(A, P.cuaderno, 20, 248, 'cr-tinta', 12, 'start', 'El criterio de mi próxima evaluación:').setAttribute('data-pide', '');
    A.el('path', { d: 'M20 266 L300 266', 'class': 'cr-raya', 'data-raya': '' }, P.cuaderno);
    texto(A, P.cuaderno, 20, 292, 'cr-tinta', 12, 'start', 'Mis alumnos lo verán el día:').setAttribute('data-pide', '');
    A.el('path', { d: 'M20 310 L300 310', 'class': 'cr-raya', 'data-raya': '' }, P.cuaderno);
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* Al TERMINAR cada paso: si se ve el criterio, si señala (las flechas),
     dónde está el criterio en la semana, qué dice la mamá y qué piensa. */
  var ESTADOS = [
    { tarjeta: false, flechas: false, chip: null, globo: 0, veredicto: null, tapa: true, suyo: false, copia: false, cuaderno: false },
    { tarjeta: true, flechas: true, chip: null, globo: 0, veredicto: null, tapa: true, suyo: false, copia: false, cuaderno: false },
    { tarjeta: true, flechas: false, chip: 'lunes', globo: 1, veredicto: 'bien', tapa: false, suyo: true, copia: true, cuaderno: false },
    { tarjeta: true, flechas: false, chip: 'despues', globo: 2, veredicto: 'mal', tapa: false, suyo: true, copia: false, cuaderno: false },
    { tarjeta: true, flechas: false, chip: 'lunes', globo: null, veredicto: null, tapa: false, suyo: false, copia: false, cuaderno: true }
  ];

  function todo() {
    var l = [P.hueco, P.tarjeta, P.chip, P.chipVe, P.mama, P.tapa, P.suyo, P.copia, P.cuaderno].concat(P.marca, P.linea, P.punta, P.globo);
    Object.keys(P.baja).forEach(function (k) { l.push(P.baja[k]); });
    Object.keys(P.veredicto).forEach(function (k) { l.push(P.veredicto[k]); });
    return l;
  }
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.ver(P.hueco, !s.tarjeta, 0);
      A.ver(P.tarjeta, s.tarjeta, 0);
      P.marca.forEach(function (m) { A.ver(m, s.tarjeta, 0); });
      P.linea.forEach(function (l) { A.ver(l, s.flechas, 0); A.trazar(l, s.flechas, 0); });
      P.punta.forEach(function (p) { A.ver(p, s.flechas, 0); });
      var x = SITIO[s.chip || 'lunes'];
      A.mover(P.chip, x, 0, 0, 1, 0);
      A.ver(P.chipVe, !!s.chip, 0);
      Object.keys(P.baja).forEach(function (k) { A.ver(P.baja[k], s.chip === k, 0); });
      P.globo.forEach(function (g, i) { A.ver(g, s.globo === i, 0); });
      Object.keys(P.veredicto).forEach(function (k) { A.ver(P.veredicto[k], s.veredicto === k, 0); });
      A.ver(P.mama, !s.cuaderno, 0);
      A.ver(P.tapa, s.tapa, 0);
      A.ver(P.suyo, s.suyo, 0);
      A.ver(P.copia, s.copia, 0);
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo se cuentan cada vez que se ENTRA en ellos,
       también volviendo con «Atrás»; el 0 se pinta siempre. */
    if (n >= 1 && !entra(n)) return;
    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 1) {
      /* el criterio, y cada cosa señala su sitio en la oración, una por una:
         la flecha, su punta y, al llegar, lo que está o no está */
      base(A, ESTADOS[0]);
      A.ver(P.hueco, false, T1.hueco);
      A.ver(P.tarjeta, true, T1.tarjeta);
      P.marca.forEach(function (m) { A.ver(m, false, 0); });
      CRITERIO.forEach(function (c, k) {
        var d = T1.linea + T1.cada * k;
        A.ver(P.linea[k], true, d);
        A.trazar(P.linea[k], true, d);
        A.ver(P.punta[k], true, d + T1.punta);
        A.ver(P.marca[k], true, d + T1.marca);
      });
      return;
    }
    if (n === 2) {
      /* el criterio estaba desde el lunes, antes de la tarea: se abre el
         cuaderno de Marvin, y ahí está, escrito ese día. La página sale
         cuando la tapa ya se fue: lo que aparece donde estaba otra cosa
         espera a que se haya ido. */
      base(A, ESTADOS[1]);
      P.linea.forEach(function (l) { A.ver(l, false, T2.apaga); });
      P.punta.forEach(function (p) { A.ver(p, false, T2.apaga); });
      A.ver(P.chipVe, true, T2.chip);
      A.ver(P.baja.lunes, true, T2.chip);
      A.ver(P.tapa, false, T2.tapa);
      A.ver(P.suyo, true, T2.abre);
      A.ver(P.copia, true, T2.abre);
      A.ver(P.globo[0], false, T2.globoSale);
      A.ver(P.globo[1], true, T2.globo);
      A.ver(P.veredicto.bien, true, T2.veredicto);
      return;
    }
    if (n === 3) {
      /* el mismo criterio, escrito después de que ella preguntó. Lo que
         ella decía se va ANTES de que se borre el cuaderno: un «Ah, estaba
         en su cuaderno» encima de una página vacía dice lo contrario de lo
         que se ve. */
      base(A, ESTADOS[2]);
      A.ver(P.globo[1], false, T3.sale);
      A.ver(P.veredicto.bien, false, T3.sale);
      A.ver(P.baja.lunes, false, T3.sale);
      A.mover(P.chip, SITIO.despues, 0, 0, 1, T3.mueve);
      A.ver(P.copia, false, T3.borra);
      A.ver(P.baja.despues, true, T3.llega);
      A.ver(P.globo[2], true, T3.globo);
      A.ver(P.veredicto.mal, true, T3.veredicto);
      return;
    }
    /* el 4: el cuaderno, donde estaba la mamá; y el criterio, de vuelta a
       su sitio, antes de la tarea */
    base(A, ESTADOS[3]);
    A.ver(P.mama, false, T4.sale);
    A.ver(P.suyo, false, T4.sale);
    A.ver(P.globo[2], false, T4.sale);
    A.ver(P.veredicto.mal, false, T4.sale);
    A.ver(P.cuaderno, true, T4.cuaderno);
    A.ver(P.baja.despues, false, T4.sale);
    A.mover(P.chip, SITIO.lunes, 0, 0, 1, T4.chip);
    A.ver(P.baja.lunes, true, T4.chip + 900);
  }

  var FRASES = [
    'La mamá de Marvin pregunta por qué le puso ' + ESTAN + ' y no ' + CRITERIO.length + '. ¿Con qué le contesta usted?',
    'Con el criterio: tres cosas, y cada una se busca en la oración. Dos están, y la mayúscula no.',
    'Así: el criterio estaba en el cuaderno de Marvin desde el lunes, antes de la tarea. Ella lo lee, y la nota se defiende sola.',
    'O así: el mismo criterio, escrito después de que ella preguntó. La nota es la misma y es justa, pero parece inventada.',
    'Escriba el criterio de su próxima evaluación y el día en que sus alumnos lo van a ver: antes de la tarea.'
  ];
  var BOTONES = ['📋 El criterio', '📓 Si fue antes', '🕓 Si fue después', '📝 Ahora usted', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['?', 'con qué le contesta'],
    [NOTA, 'cosas del criterio que están'],
    ['antes', 'de la tarea: la nota se defiende'],
    ['después', 'de la pregunta: parece inventado'],
    ['?', 'cuándo lo verán sus alumnos']
  ];

  AnimacionMision.montar('#amCriterio', {
    vista: [ANCHO, ALTO],
    describe: 'La tarea de Marvin, con su nota, ' + ESTAN + ' de ' + CRITERIO.length + ', y el criterio con que se calificó: tres cosas, y le faltó la mayúscula. ' +
      'Si el criterio estaba en su cuaderno desde el lunes, antes de la tarea, su mamá lo lee y la nota se defiende sola. ' +
      'Si se escribe después de que ella preguntó, la misma nota parece inventada, aunque sea justa.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
