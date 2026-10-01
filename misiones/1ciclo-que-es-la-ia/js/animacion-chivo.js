/* ============================================================
   Animación de «¿Qué es la Inteligencia Artificial?»
   (Ruta de la Máquina que Aprende, etapa 1)
   ------------------------------------------------------------
   La historia: a Selvin le pidieron de tarea la foto de un animal y su
   nombre. Le tomó la foto al chivo de su abuelo y el teléfono contestó
   «perro», bien seguro. Lo copió tal cual, la tarea le salió mala y la
   repitió de noche. La historia dice por qué: esa máquina nunca vio un
   chivo, le puso el nombre de lo que más se le parecía de lo que sí vio, y
   contestó segura porque «no sé» no es una de las cosas que puede decir.

   Lo que se dibuja: arriba, lo que vio el teléfono: tres fotos (un perro,
   un gato y una gallina), cada una con su nombre. Abajo, la foto del chivo
   de Selvin y el teléfono con su globo. El teléfono pone el chivo encima de
   cada foto: lo que coincide queda marcado, y una barra dice cuánto. La
   barra más larga es la del perro, y eso contesta. Después, la tarea mala.
   Al final se le enseña la foto de OTRO chivo, compara otra vez y contesta
   «chivo».

   ⚠️ Cuánto coincide NO se escribe: se cuenta. Las siluetas son polígonos
   (FORMAS, abajo) y la escena mide, punto por punto, qué parte de los dos
   dibujos cae en el mismo sitio, entre todo lo que ocupan los dos juntos.
   Cada barra mide eso, y la sonda lo vuelve a medir aparte, con el
   navegador. Es la idea de la máquina de los puntitos de esta misma misión:
   compara dibujo contra dibujo, sin saber qué es un chivo.

   ⚠️ Las siluetas están hechas para que la historia sea verdad, y eso se
   dice aquí: el chivo se parece más al perro (cuatro patas, el mismo
   cuerpo) que al gato y a la gallina, y mucho más a otro chivo. Quien las
   cambie tiene que volver a medir: la sonda se pone roja si el perro deja
   de ganar, o si el otro chivo no le gana al perro.

   ⚠️ Lo que NO se dice, y a propósito: ni «ejemplo», ni «etiqueta», ni
   «dato», ni «predecir», ni «comprobar», que son los pareados de la prueba;
   ni nada de la máquina de los puntitos ni del adivinador de animales, que
   la prueba pregunta; ni que la máquina piensa, sabe o entiende. Y la barra
   se llama barra: «raya» es la respuesta de una pregunta.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amChivo')) return;

  var ANCHO = 320, ALTO = 250;

  /* ── las siluetas ──────────────────────────────────────────── */
  /* En una caja de 100 x 80, mirando a la izquierda, con las patas en el
     suelo (y = 78). Cada una es UN solo contorno, sin cruces: así «dentro»
     quiere decir lo mismo para la escena y para el navegador. Lo que va
     encima (el ojo, la oreja del perro, la cresta de la gallina) es adorno
     y cae dentro de la silueta: no cambia lo que se mide. */
  var FORMAS = {
    chivo: [[5, 30], [7, 34], [12, 35], [13, 45], [17, 36], [22, 40], [27, 48], [29, 55], [29, 78], [34, 78], [34, 59], [38, 59], [38, 78], [43, 78], [43, 57],
      [66, 57], [66, 78], [71, 78], [71, 59], [75, 59], [75, 78], [80, 78], [80, 55], [84, 48], [85, 38], [88, 33], [92, 25], [86, 31], [80, 31], [40, 31], [32, 29],
      [28, 23], [29, 19], [34, 24], [30, 17], [34, 10], [38, 4], [33, 7], [27, 13], [24, 12], [16, 15], [10, 21]],
    perro: [[2, 33], [3, 37], [13, 37], [19, 40], [24, 47], [25, 55], [25, 78], [31, 78], [31, 58], [34, 58], [34, 78], [40, 78], [40, 57], [67, 57], [67, 78],
      [73, 78], [73, 58], [76, 58], [76, 78], [82, 78], [82, 55], [86, 47], [87, 40], [96, 23], [94, 20], [84, 35], [80, 34], [40, 34], [30, 32], [27, 27],
      [28, 21], [21, 17], [14, 19], [11, 26], [3, 28]],
    gato: [[11, 37], [13, 41], [19, 43], [26, 49], [30, 58], [30, 78], [34, 78], [34, 63], [37, 63], [37, 78], [41, 78], [41, 61], [64, 61], [64, 78], [68, 78],
      [68, 63], [71, 63], [71, 78], [75, 78], [75, 58], [79, 52], [81, 46], [92, 22], [89, 20], [78, 41], [40, 41], [32, 38], [28, 32], [27, 26], [29, 15],
      [23, 22], [19, 22], [15, 15], [14, 24], [11, 30]],
    gallina: [[13.8, 28.9], [19.2, 26.2], [21, 20.8], [22.8, 15.4], [25.5, 18.1], [27.3, 13.6], [30, 18.1], [32.7, 16.3], [32.7, 23.5], [35.4, 30.7],
      [46.2, 34.3], [60.6, 34.3], [66.9, 28.9], [70.5, 17.2], [75, 23.5], [78.6, 16.3], [81.3, 28.9], [78.6, 38.8], [75.9, 47.8], [69.6, 55.9], [58.8, 60.4],
      [58, 73], [62, 78], [53, 78], [55, 73], [54.3, 61.3], [50.7, 61.3], [49, 73], [53, 78], [44, 78], [46, 73], [47.1, 60.4], [39, 57.7], [32.7, 51.4],
      [29.1, 43.3], [27.3, 37], [23.7, 33.4], [21, 35.2], [19.2, 31.6]],
    /* el otro chivo: el mismo cuerpo de chivo, la cabeza más arriba y otros
       cuernos. No es el del abuelo: es otro chivo. */
    otro: [[5, 27], [7, 31], [12, 32], [13, 42], [17, 33], [22, 38], [27, 47], [29, 55], [29, 78], [34, 78], [34, 59], [38, 59], [38, 78], [43, 78], [43, 57],
      [66, 57], [66, 78], [71, 78], [71, 59], [75, 59], [75, 78], [80, 78], [80, 55], [84, 48], [85, 38], [87, 33], [90, 26], [85, 31], [80, 31], [40, 31], [32, 28],
      [28, 21], [29, 16], [34, 21], [30, 14], [33, 7], [39, 2], [32, 4], [27, 10], [24, 9], [16, 12], [10, 18]]
  };
  var ADORNOS = {
    chivo: { ojo: [15, 21] },
    perro: { ojo: [16, 25], oreja: [[24, 20], [28, 29], [25.5, 30], [22.5, 23]] },
    gato: { ojo: [18, 29] },
    gallina: { ojo: [25.5, 24], cresta: [[21.5, 21], [22.8, 15.4], [25.5, 18.1], [27.3, 13.6], [30, 18.1], [32.7, 16.3], [32.5, 21.5]],
      pico: [[13.8, 28.9], [19.2, 26.2], [19.8, 30]] },
    otro: { ojo: [15, 18], claro: true }
  };

  /* Lo que vio el teléfono, en su orden, y el que se le enseña al final */
  var VISTOS = [
    { k: 'perro', nombre: 'perro' },
    { k: 'gato', nombre: 'gato' },
    { k: 'gallina', nombre: 'gallina' },
    { k: 'otro', nombre: 'chivo' }
  ];

  /* ── cuánto coinciden dos siluetas ─────────────────────────── */
  function dentro(p, x, y) {
    var c = false;
    for (var i = 0, j = p.length - 1; i < p.length; j = i++) {
      var xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
    }
    return c;
  }
  /* Lo que cae en el mismo sitio, entre todo lo que ocupan las dos: 1 es
     el mismo dibujo, 0 es que no se tocan. Se cuenta cada punto de una
     rejilla de un paso; más fino no cambia la barra ni un píxel. */
  function coincide(a, b) {
    var i = 0, u = 0;
    for (var y = 0.5; y < 80; y += 1) {
      for (var x = 0.5; x < 100; x += 1) {
        var p = dentro(a, x, y), q = dentro(b, x, y);
        if (p && q) i++;
        if (p || q) u++;
      }
    }
    return u ? i / u : 0;
  }
  var CUANTO = VISTOS.map(function (v) { return coincide(FORMAS.chivo, FORMAS[v.k]); });
  function mejor(hasta) {
    var m = 0;
    for (var i = 1; i < hasta; i++) if (CUANTO[i] > CUANTO[m]) m = i;
    return m;
  }
  var GANA3 = mejor(3), GANA4 = mejor(4);

  /* ── las medidas de la letra ───────────────────────────────── */
  /* El ancho de cada letra de la Fredoka, por cada 100 px: las fichas de
     lo que puede decir se miden con esto y no con el navegador, porque
     cuando se arma el dibujo la letra todavía puede no haber llegado. */
  var AV = {
    a: 56.3, b: 56.3, c: 50.5, d: 56.5, e: 53.7, f: 40.5, g: 55.2, h: 55.4, i: 24.2, j: 23.6, k: 50.4, l: 30.1, m: 80.3,
    n: 56.3, o: 55.9, p: 55.2, q: 55.1, r: 42.3, s: 45.8, t: 41.1, u: 56, v: 56.4, w: 74.6, x: 52.3, y: 55.9, z: 54,
    N: 68.3, P: 59.7, 'á': 56.3, 'é': 53.7, 'í': 22.5, 'ó': 55.9, 'ú': 56, 'ñ': 56.3, ' ': 24.1, ':': 22.5
  };
  function ancho(t, tam) {
    var s = 0;
    for (var i = 0; i < t.length; i++) s += AV[t.charAt(i)] != null ? AV[t.charAt(i)] : 55;
    return Math.round(s * tam) / 100;
  }

  /* ── el dibujo ─────────────────────────────────────────────── */
  /* Los cuatro huecos de lo que vio, cada foto a 0,7 de su tamaño: 70 x 56 */
  var HUECO = { x0: 12, paso: 76, y: 18, esc: 0.7 };
  function huecoX(i) { return HUECO.x0 + HUECO.paso * i; }
  var ANCHO_FOTO = 100 * HUECO.esc, ALTO_FOTO = 80 * HUECO.esc;
  var TITULO = { x: 12, base: 12, tam: 10, texto: 'Lo que vio el teléfono' };
  var NOMBRE = { base: 85, tam: 11 };
  var BARRA = { y: 96, grueso: 5 };
  var ARO = { y0: 90.5, y1: 101.5 };
  /* La foto de Selvin, a su tamaño, y lo que dice debajo */
  var SELVIN = { x: 12, y: 116, rotulo: { base: 209, tam: 10, texto: 'la foto de Selvin' } };
  /* El teléfono y su globo */
  var TEL = { x0: 124, x1: 148, y0: 124, y1: 172 };
  var GLOBO = { x0: 156, x1: 308, y0: 113, y1: 145, tam: 14, base: 134.5, cola: [[156, 124], [149, 133], [156, 131]] };
  /* Las dos hojas de la tarea y la noche */
  var HOJA1 = { x0: 158, x1: 232, y0: 155, y1: 241 };
  var NOCHE = { x0: 238, x1: 308, y0: 155, y1: 241 };
  var HOJA2 = { x0: 246, x1: 300, y0: 178, y1: 236 };
  var CUADERNO = { x0: 158, x1: 308, y0: 155, y1: 243 };
  /* Lo que puede decir: una ficha por nombre de lo que vio. Debajo, lo que
     no puede decir, con su borde de raya cortada. */
  var DECIR = { x0: 126, tit: { base: 194, tam: 10, texto: 'Puede decir:' }, ficha: { y0: 199, y1: 215, tam: 10, pad: 4, hueco: 4 },
    no: { base: 233.5, texto: 'No puede decir:', y0: 222, y1: 238, nombres: ['chivo', 'no sé'] } };

  /* ── el reloj de la escena ──────────────────────────────────── */
  /* Cada comparación: aparece la copia del chivo, vuela hasta la foto, se
     marca lo que coincide y crece su barra. La siguiente sale cuando la de
     antes ya llegó. */
  var VUELO = { aparece: 0, sale: 200, llega: 1000, barra: 1100, cada: 1100 };
  var T1 = { aro: 4200 };
  var T2 = { duda: 0, flecha: 0, globo: 800, vacio: 1400, noDecir: 1900 };
  var T3 = { decir: 0, hoja: 500, equis: 1100, noche: 1700, lapiz: 2200 };
  var T4 = { sale: 0, foto: 300, decir: 500, nombre: 600, duda: 600, ficha: 800 };
  var T6 = { decir: 0, cuaderno: 500 };
  var T5 = { aro: 2000, flecha: 2300, duda: 2300, globo: 3100 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function puntos(lista, x, y, e) {
    return lista.map(function (q) { return r2(x + q[0] * e) + ',' + r2(y + q[1] * e); }).join(' ');
  }
  function camino(lista, x, y, e) { return 'M' + puntos(lista, x, y, e).split(' ').join(' L') + ' Z'; }

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }

  /* Una foto: el cielo, el pasto, el animal con sus adornos y el borde.
     Las medidas salen de la caja de 100 x 80 a la escala de esa foto. Lo
     que coincide (`capa`) va entre la silueta y los adornos: si fuera
     encima, el ojo y la oreja del perro quedarían tapados. */
  function foto(A, padre, k, x, y, e, dato, capa) {
    var g = A.el('g', dato || {}, padre);
    A.el('rect', { x: x, y: y, width: r2(100 * e), height: r2(80 * e), 'class': 'ch-cielo' }, g);
    A.el('rect', { x: x, y: r2(y + 72 * e), width: r2(100 * e), height: r2(8 * e), 'class': 'ch-pasto' }, g);
    A.el('path', { d: camino(FORMAS[k], x, y, e), 'class': 'ch-' + k, 'data-silueta': k }, g);
    if (capa) capa(g);
    var ad = ADORNOS[k];
    if (ad.oreja) A.el('polygon', { points: puntos(ad.oreja, x, y, e), 'class': 'ch-oreja' }, g);
    if (ad.cresta) A.el('polygon', { points: puntos(ad.cresta, x, y, e), 'class': 'ch-cresta' }, g);
    if (ad.pico) A.el('polygon', { points: puntos(ad.pico, x, y, e), 'class': 'ch-pico' }, g);
    A.el('circle', { cx: r2(x + ad.ojo[0] * e), cy: r2(y + ad.ojo[1] * e), r: r2(1.9 * e), 'class': ad.claro ? 'ch-ojo-claro' : 'ch-ojo' }, g);
    A.el('rect', { x: x, y: y, width: r2(100 * e), height: r2(80 * e), rx: 2, 'class': 'ch-borde', 'data-foto-caja': '' }, g);
    return g;
  }

  /* Una punta de flecha en (x, y), mirando hacia (dx, dy) */
  function punta(A, padre, x, y, dx, dy, dato) {
    var l = Math.sqrt(dx * dx + dy * dy), ux = dx / l, uy = dy / l, a = 6, b = 3.6;
    var at = { points: [[x, y], [x - ux * a - uy * b, y - uy * a + ux * b], [x - ux * a + uy * b, y - uy * a - ux * b]]
      .map(function (q) { return r2(q[0]) + ',' + r2(q[1]); }).join(' '), 'class': 'ch-punta' };
    at[dato] = '';
    return A.el('polygon', at, padre);
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* lo marcado: amarillo con rayitas, para que se distinga sin distinguir
       colores y también fotocopiado */
    var defs = A.el('defs', null, svg);
    var pat = A.el('pattern', { id: 'amChivo-marca', width: 4, height: 4, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    A.el('rect', { width: 1.8, height: 4, 'class': 'ch-marca-raya' }, pat);
    A.el('rect', { x: 1.8, width: 0.6, height: 4, 'class': 'ch-marca-borde' }, pat);

    /* ── lo que vio el teléfono ── */
    texto(A, svg, TITULO.x, TITULO.base, 'am-rotulo', TITULO.tam, 'start', TITULO.texto).setAttribute('data-titulo', '');
    P.marco = []; P.nombre = []; P.coincide = []; P.riel = []; P.barra = []; P.aro = [];
    VISTOS.forEach(function (v, i) {
      var x = huecoX(i), y = HUECO.y;
      /* lo que coincide con el chivo: esta silueta, recortada por la del
         chivo puesta en esta misma foto */
      var rec = A.el('clipPath', { id: 'amChivo-recorte-' + i }, defs);
      A.el('path', { d: camino(FORMAS.chivo, x, y, HUECO.esc), 'data-recorte': String(i) }, rec);
      var co;
      var g = foto(A, svg, v.k, x, y, HUECO.esc, { 'data-marco': String(i), 'data-animal': v.k }, function (padre) {
        co = A.el('g', { 'clip-path': 'url(#amChivo-recorte-' + i + ')', 'data-coincide': String(i) }, padre);
        A.el('path', { d: camino(FORMAS[v.k], x, y, HUECO.esc), 'class': 'ch-marca' }, co);
      });
      P.coincide.push(co);
      P.marco.push(g);
      var nom = texto(A, svg, r2(x + ANCHO_FOTO / 2), NOMBRE.base, 'am-rotulo', NOMBRE.tam, 'middle', v.nombre);
      nom.setAttribute('data-nombre', String(i));
      P.nombre.push(nom);
      /* la barra: cuánto coinciden, sobre el largo de la foto */
      var riel = A.el('path', { d: 'M' + x + ' ' + BARRA.y + ' L' + r2(x + ANCHO_FOTO) + ' ' + BARRA.y, 'class': 'ch-riel', 'data-riel': String(i) }, svg);
      var barra = A.el('path', { d: 'M' + x + ' ' + BARRA.y + ' L' + r2(x + ANCHO_FOTO * CUANTO[i]) + ' ' + BARRA.y, 'class': 'ch-barra',
        'data-barra': String(i), 'data-cuanto': String(Math.round(CUANTO[i] * 1000) / 1000) }, svg);
      P.riel.push(riel); P.barra.push(barra);
      P.aro.push(A.el('rect', { x: x - 3, y: ARO.y0, width: r2(ANCHO_FOTO + 6), height: ARO.y1 - ARO.y0, rx: 5, 'class': 'ch-aro', 'data-aro': String(i) }, svg));
    });

    /* el hueco de lo que nunca vio: ningún chivo */
    var x3 = huecoX(3);
    P.vacio = A.el('g', { 'data-vacio': '' }, svg);
    A.el('rect', { x: x3, y: HUECO.y, width: ANCHO_FOTO, height: ALTO_FOTO, rx: 2, 'class': 'ch-vacio', 'data-vacio-caja': '' }, P.vacio);
    texto(A, P.vacio, r2(x3 + ANCHO_FOTO / 2), r2(HUECO.y + ALTO_FOTO / 2 + 8.5), 'am-rotulo', 24, 'middle', '?');
    texto(A, P.vacio, r2(x3 + ANCHO_FOTO / 2), NOMBRE.base, 'am-rotulo', 10, 'middle', 'ningún chivo').setAttribute('data-vacio-dice', '');

    /* ── la foto de Selvin ── */
    foto(A, svg, 'chivo', SELVIN.x, SELVIN.y, 1, { 'data-selvin': '' });
    texto(A, svg, SELVIN.x + 50, SELVIN.rotulo.base, 'am-rotulo', SELVIN.rotulo.tam, 'middle', SELVIN.rotulo.texto).setAttribute('data-selvin-dice', '');

    /* ── el teléfono ── */
    var tel = A.el('g', { 'data-telefono': '' }, svg);
    /* con su borde claro: negro sobre la tarjeta oscura no se veía */
    A.el('rect', { x: TEL.x0, y: TEL.y0, width: TEL.x1 - TEL.x0, height: TEL.y1 - TEL.y0, rx: 4, 'class': 'ch-tel', 'data-telefono-caja': '' }, tel);
    A.el('rect', { x: TEL.x0 + 2.5, y: TEL.y0 + 5, width: TEL.x1 - TEL.x0 - 5, height: TEL.y1 - TEL.y0 - 12, rx: 1.5, 'class': 'ch-pantalla' }, tel);
    A.el('circle', { cx: (TEL.x0 + TEL.x1) / 2, cy: TEL.y1 - 3.5, r: 1.6, 'class': 'ch-pantalla' }, tel);

    /* ── las flechas: de la barra más larga al globo ── */
    P.flecha = {};
    [GANA3, GANA4].forEach(function (i) {
      if (P.flecha[i]) return;
      var cx = r2(huecoX(i) + ANCHO_FOTO / 2), y0 = ARO.y1 + 1, x1, y1, d;
      if (cx < GLOBO.x0) {
        /* desde abajo de la barra, por encima de la foto de Selvin */
        x1 = GLOBO.x0 + 16; y1 = GLOBO.y0 - 1.5;
        d = 'M' + cx + ' ' + y0 + ' C' + cx + ' ' + (y0 + 8) + ' ' + (x1 - 40) + ' ' + (y1 - 6) + ' ' + x1 + ' ' + y1;
      } else {
        x1 = cx; y1 = GLOBO.y0 - 1.5;
        d = 'M' + cx + ' ' + y0 + ' L' + x1 + ' ' + y1;
      }
      var g = A.el('g', { 'data-flecha': String(i) }, svg);
      var linea = A.el('path', { d: d, 'class': 'ch-flecha', 'data-flecha-linea': '' }, g);
      var dx = cx < GLOBO.x0 ? 40 : 0, dy = cx < GLOBO.x0 ? 6 : 1;
      var cab = punta(A, g, x1, y1 + 1.5, dx, dy, 'data-flecha-punta');
      P.flecha[i] = { g: g, linea: linea, cab: cab };
    });

    /* ── el globo: una pieza por cada cosa que dice ── */
    function globo(clave, dice, bien) {
      var g = A.el('g', { 'data-globo': clave }, svg);
      var c = GLOBO.cola;
      A.el('path', { d: 'M' + (GLOBO.x0 + 8) + ' ' + GLOBO.y0 + ' L' + (GLOBO.x1 - 8) + ' ' + GLOBO.y0 + ' Q' + GLOBO.x1 + ' ' + GLOBO.y0 + ' ' + GLOBO.x1 + ' ' + (GLOBO.y0 + 8) +
        ' L' + GLOBO.x1 + ' ' + (GLOBO.y1 - 8) + ' Q' + GLOBO.x1 + ' ' + GLOBO.y1 + ' ' + (GLOBO.x1 - 8) + ' ' + GLOBO.y1 + ' L' + (GLOBO.x0 + 8) + ' ' + GLOBO.y1 +
        ' Q' + GLOBO.x0 + ' ' + GLOBO.y1 + ' ' + GLOBO.x0 + ' ' + (GLOBO.y1 - 8) + ' L' + c[2][0] + ' ' + c[2][1] + ' L' + c[1][0] + ' ' + c[1][1] + ' L' + c[0][0] + ' ' + c[0][1] +
        ' L' + GLOBO.x0 + ' ' + (GLOBO.y0 + 8) + ' Q' + GLOBO.x0 + ' ' + GLOBO.y0 + ' ' + (GLOBO.x0 + 8) + ' ' + GLOBO.y0 + ' Z',
        'class': clave === 'duda' ? 'ch-globo ch-globo-duda' : 'ch-globo', 'data-globo-caja': '', 'data-punta-globo': c[1][0] + ' ' + c[1][1] }, g);
      var cx = (GLOBO.x0 + GLOBO.x1) / 2;
      if (bien) cx -= 8;
      texto(A, g, cx, GLOBO.base, 'ch-letra', clave === 'duda' ? 18 : GLOBO.tam, 'middle', dice).setAttribute('data-dice', '');
      if (bien) {
        A.el('path', { d: 'M282 127 L287 133 L298 120', 'class': 'ch-bien', 'data-bien': '' }, g);
      }
      return g;
    }
    P.globo = { duda: globo('duda', '?'), perro: globo('perro', '¡Es un ' + VISTOS[GANA3].nombre + '!'), chivo: globo('chivo', '¡Es un ' + VISTOS[GANA4].nombre + '!', true) };

    /* ── lo que puede decir, y lo que no ── */
    function ficha(padre, x, y0, y1, dice, dato, clase, letra) {
      var w = r2(ancho(dice, DECIR.ficha.tam) + 2 * DECIR.ficha.pad);
      var g = A.el('g', dato, padre);
      A.el('rect', { x: x, y: y0, width: w, height: y1 - y0, rx: 4, 'class': clase, 'data-ficha-caja': '' }, g);
      texto(A, g, r2(x + w / 2), r2((y0 + y1) / 2 + 0.36 * DECIR.ficha.tam), letra || 'ch-letra', DECIR.ficha.tam, 'middle', dice).setAttribute('data-ficha-dice', '');
      return { g: g, w: w };
    }
    P.decir = A.el('g', { 'data-decir': '' }, svg);
    texto(A, P.decir, DECIR.x0, DECIR.tit.base, 'am-rotulo', DECIR.tit.tam, 'start', DECIR.tit.texto).setAttribute('data-decir-titulo', '');
    P.ficha = [];
    var fx = DECIR.x0;
    VISTOS.forEach(function (v, i) {
      var fi = ficha(P.decir, fx, DECIR.ficha.y0, DECIR.ficha.y1, v.nombre, { 'data-ficha': String(i) }, 'ch-ficha');
      P.ficha.push(fi.g);
      fx = r2(fx + fi.w + DECIR.ficha.hueco);
    });
    P.noDecir = A.el('g', { 'data-no-decir': '' }, svg);
    texto(A, P.noDecir, DECIR.x0, DECIR.no.base, 'am-rotulo', DECIR.tit.tam, 'start', DECIR.no.texto).setAttribute('data-no-decir-titulo', '');
    fx = r2(DECIR.x0 + ancho(DECIR.no.texto, DECIR.tit.tam) + 6);
    DECIR.no.nombres.forEach(function (t) {
      /* sobre la tarjeta y sin papel: su letra es la de la pantalla */
      var fi = ficha(P.noDecir, fx, DECIR.no.y0, DECIR.no.y1, t, { 'data-no-ficha': t }, 'ch-ficha ch-ficha-no', 'am-rotulo');
      fx = r2(fx + fi.w + DECIR.ficha.hueco);
    });

    /* ── la tarea: la primera, mala, y la de la noche ── */
    P.tarea = A.el('g', { 'data-tarea': '1' }, svg);
    A.el('rect', { x: HOJA1.x0, y: HOJA1.y0, width: HOJA1.x1 - HOJA1.x0, height: HOJA1.y1 - HOJA1.y0, rx: 3, 'class': 'ch-hoja', 'data-hoja-caja': '' }, P.tarea);
    texto(A, P.tarea, (HOJA1.x0 + HOJA1.x1) / 2, 167, 'ch-letra', 9.5, 'middle', 'Mi tarea');
    foto(A, P.tarea, 'chivo', 180, 173, 0.3);
    texto(A, P.tarea, 164, 211, 'ch-letra', 9.5, 'start', 'Es un ' + VISTOS[GANA3].nombre).setAttribute('data-escribio', '');
    A.el('path', { d: 'M164 214.5 L226 214.5', 'class': 'ch-renglon' }, P.tarea);
    A.el('path', { d: 'M164 228 L226 228', 'class': 'ch-renglon' }, P.tarea);
    P.equis = A.el('g', { 'data-equis': '' }, svg);
    A.el('path', { d: 'M216 201 L228 213 M228 201 L216 213', 'class': 'ch-mal' }, P.equis);

    P.noche = A.el('g', { 'data-noche': '' }, svg);
    A.el('rect', { x: NOCHE.x0, y: NOCHE.y0, width: NOCHE.x1 - NOCHE.x0, height: NOCHE.y1 - NOCHE.y0, rx: 5, 'class': 'ch-noche', 'data-noche-caja': '' }, P.noche);
    A.el('circle', { cx: 295, cy: 166, r: 6.5, 'class': 'ch-luna', 'data-luna': '' }, P.noche);
    A.el('circle', { cx: 298, cy: 163.5, r: 5.5, 'class': 'ch-noche' }, P.noche);
    [[250, 164, 1.1], [262, 160, 0.9], [276, 170, 0.8]].forEach(function (q) { A.el('circle', { cx: q[0], cy: q[1], r: q[2], 'class': 'ch-luna' }, P.noche); });
    var h2 = A.el('g', { 'data-tarea': '2' }, P.noche);
    A.el('rect', { x: HOJA2.x0, y: HOJA2.y0, width: HOJA2.x1 - HOJA2.x0, height: HOJA2.y1 - HOJA2.y0, rx: 2.5, 'class': 'ch-hoja', 'data-hoja-caja': '' }, h2);
    texto(A, h2, (HOJA2.x0 + HOJA2.x1) / 2, 188, 'ch-letra', 9, 'middle', 'Mi tarea');
    foto(A, h2, 'chivo', 262, 192, 0.22);
    texto(A, h2, 251, 223, 'ch-letra', 9, 'start', 'Es un');
    A.el('path', { d: 'M251 227 L294 227', 'class': 'ch-renglon' }, h2);
    P.lapiz = A.el('g', { 'data-lapiz': '' }, svg);
    A.el('path', { d: 'M281 219 L293 207', 'class': 'ch-lapiz' }, P.lapiz);
    A.el('polygon', { points: '277,224 279.4,219.6 281.4,221.6', 'class': 'ch-lapiz-punta', 'data-lapiz-punta': '' }, P.lapiz);

    /* ── lo que escribe el alumno ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUADERNO.x0, y: CUADERNO.y0, width: CUADERNO.x1 - CUADERNO.x0, height: CUADERNO.y1 - CUADERNO.y0, rx: 6, 'class': 'ch-hoja', 'data-cuaderno-caja': '' }, P.cuaderno);
    texto(A, P.cuaderno, 166, 172, 'ch-letra', 10, 'start', 'En tu cuaderno:');
    texto(A, P.cuaderno, 166, 192, 'ch-letra', 9.5, 'start', 'Un animal de tu casa:');
    A.el('path', { d: 'M166 205 L300 205', 'class': 'ch-renglon ch-renglon-escribir', 'data-raya-escribir': '' }, P.cuaderno);
    texto(A, P.cuaderno, 166, 222, 'ch-letra', 9.5, 'start', 'Lo que diría el teléfono:');
    A.el('path', { d: 'M166 235 L300 235', 'class': 'ch-renglon ch-renglon-escribir', 'data-raya-escribir': '' }, P.cuaderno);

    /* ── las copias del chivo que vuelan: van al final, encima de todo.
       Cada una en dos envolturas: la de fuera la lleva, la de dentro la
       enciende. Una pieza tiene una sola demora, y aquí hay dos cosas. ── */
    P.copia = []; P.copiaVer = [];
    VISTOS.forEach(function (v, i) {
      var g = A.el('g', { 'data-copia': String(i) }, svg);
      var adentro = A.el('g', { 'data-copia-ver': '' }, g);
      A.el('path', { d: camino(FORMAS.chivo, 0, 0, 1), 'class': 'ch-copia', 'data-copia-silueta': '' }, adentro);
      P.copia.push(g); P.copiaVer.push(adentro);
    });
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso. vistos: cuántas fotos tiene el
     teléfono; comp: cuántas ya comparó; aro y flecha: cuál gana (−1
     ninguna); globo: qué dice. */
  var ESTADOS = [
    { vistos: 3, comp: 0, aro: -1, flecha: -1, globo: 'duda', vacio: false, decir: true, noDecir: false, tarea: false, cuaderno: false },
    { vistos: 3, comp: 3, aro: GANA3, flecha: -1, globo: 'duda', vacio: false, decir: true, noDecir: false, tarea: false, cuaderno: false },
    { vistos: 3, comp: 3, aro: GANA3, flecha: GANA3, globo: 'perro', vacio: true, decir: true, noDecir: true, tarea: false, cuaderno: false },
    { vistos: 3, comp: 3, aro: GANA3, flecha: GANA3, globo: 'perro', vacio: true, decir: false, noDecir: false, tarea: true, cuaderno: false },
    { vistos: 4, comp: 3, aro: -1, flecha: -1, globo: 'duda', vacio: false, decir: true, noDecir: false, tarea: false, cuaderno: false },
    { vistos: 4, comp: 4, aro: GANA4, flecha: GANA4, globo: 'chivo', vacio: false, decir: true, noDecir: false, tarea: false, cuaderno: false },
    { vistos: 4, comp: 4, aro: GANA4, flecha: GANA4, globo: 'chivo', vacio: false, decir: false, noDecir: false, tarea: false, cuaderno: true }
  ];
  function con(s, cambios) { var o = {}, k; for (k in s) o[k] = s[k]; for (k in cambios) o[k] = cambios[k]; return o; }

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function flechas() { return Object.keys(P.flecha).map(function (k) { return P.flecha[k]; }); }

  function todo() {
    var l = [P.vacio, P.decir, P.noDecir, P.tarea, P.equis, P.noche, P.lapiz, P.cuaderno, P.globo.duda, P.globo.perro, P.globo.chivo]
      .concat(P.marco, P.nombre, P.ficha, P.coincide, P.riel, P.barra, P.aro, P.copia, P.copiaVer);
    flechas().forEach(function (f) { l.push(f.g, f.linea, f.cab); });
    return l;
  }

  function ponerCopia(A, i, llego, demora) {
    if (llego) A.mover(P.copia[i], huecoX(i), HUECO.y, 0, HUECO.esc, demora);
    else A.mover(P.copia[i], SELVIN.x, SELVIN.y, 0, 1, demora);
  }

  function base(A, s) {
    deGolpe(A, todo(), function () {
      VISTOS.forEach(function (v, i) {
        A.ver(P.marco[i], i < s.vistos, 0);
        A.ver(P.nombre[i], i < s.vistos, 0);
        A.ver(P.ficha[i], i < s.vistos, 0);
        var hecho = i < s.comp;
        ponerCopia(A, i, hecho, 0);
        A.ver(P.copiaVer[i], hecho, 0);
        A.ver(P.coincide[i], hecho, 0);
        A.ver(P.riel[i], hecho, 0);
        A.ver(P.barra[i], hecho, 0);
        A.trazar(P.barra[i], hecho, 0);
        A.ver(P.aro[i], s.aro === i, 0);
      });
      flechas().forEach(function (f) {
        var si = P.flecha[s.flecha] === f;
        A.ver(f.g, si, 0); A.ver(f.linea, si, 0); A.trazar(f.linea, si, 0); A.ver(f.cab, si, 0);
      });
      A.ver(P.globo.duda, s.globo === 'duda', 0);
      A.ver(P.globo.perro, s.globo === 'perro', 0);
      A.ver(P.globo.chivo, s.globo === 'chivo', 0);
      A.ver(P.vacio, s.vacio, 0);
      A.ver(P.decir, s.decir, 0);
      A.ver(P.noDecir, s.noDecir, 0);
      A.ver(P.tarea, s.tarea, 0);
      A.ver(P.equis, s.tarea, 0);
      A.ver(P.noche, s.tarea, 0);
      A.ver(P.lapiz, s.tarea, 0);
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }

  /* La copia del chivo vuela hasta la foto i, se marca lo que coincide y
     crece la barra. */
  function comparar(A, i, d0) {
    A.ver(P.copiaVer[i], true, d0 + VUELO.aparece);
    ponerCopia(A, i, true, d0 + VUELO.sale);
    A.ver(P.coincide[i], true, d0 + VUELO.llega);
    A.ver(P.riel[i], true, d0 + VUELO.barra);
    A.ver(P.barra[i], true, d0 + VUELO.barra);
    A.trazar(P.barra[i], true, d0 + VUELO.barra);
  }

  function senalar(A, i, demora) {
    var f = P.flecha[i];
    A.ver(f.g, true, demora); A.ver(f.linea, true, demora); A.trazar(f.linea, true, demora);
    A.ver(f.cab, true, demora + 700);
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 5) se cuentan cada vez que se ENTRA
       en ellos, también volviendo con «Atrás»; el 0 y el 6 se pintan
       siempre, también en el primer pintado. Lo que arranca de golpe no
       puede traer piezas que se van en ese mismo paso: aparecerían un
       instante y se irían (por eso el `con`). */
    if (n >= 1 && n <= 5 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 6) {
      if (antes !== 5) { base(A, ESTADOS[6]); return; }
      base(A, ESTADOS[5]);
      A.ver(P.decir, false, T6.decir);
      A.ver(P.cuaderno, true, T6.cuaderno);
      return;
    }
    if (n === 1) {
      base(A, ESTADOS[0]);
      for (var i = 0; i < 3; i++) comparar(A, i, i * VUELO.cada);
      A.ver(P.aro[GANA3], true, T1.aro);
      return;
    }
    if (n === 2) {
      base(A, antes === 1 ? ESTADOS[1] : con(ESTADOS[1], { globo: null }));
      A.ver(P.globo.duda, false, T2.duda);
      senalar(A, GANA3, T2.flecha);
      A.ver(P.globo.perro, true, T2.globo);
      A.ver(P.vacio, true, T2.vacio);
      A.ver(P.noDecir, true, T2.noDecir);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      A.ver(P.decir, false, T3.decir);
      A.ver(P.noDecir, false, T3.decir);
      A.ver(P.tarea, true, T3.hoja);
      A.ver(P.equis, true, T3.equis);
      A.ver(P.noche, true, T3.noche);
      A.ver(P.lapiz, true, T3.lapiz);
      return;
    }
    if (n === 4) {
      base(A, antes === 3 ? ESTADOS[3] : con(ESTADOS[3], { tarea: false, globo: null, aro: -1, flecha: -1, vacio: false }));
      [P.tarea, P.equis, P.noche, P.lapiz, P.globo.perro, P.vacio, P.aro[GANA3]].forEach(function (p) { A.ver(p, false, T4.sale); });
      flechas().forEach(function (f) { A.ver(f.g, false, T4.sale); });
      A.ver(P.marco[3], true, T4.foto);
      A.ver(P.nombre[3], true, T4.nombre);
      A.ver(P.globo.duda, true, T4.duda);
      A.ver(P.decir, true, T4.decir);
      A.ver(P.ficha[3], true, T4.ficha);
      return;
    }
    /* el 5: compara la foto nueva */
    base(A, ESTADOS[4]);
    comparar(A, 3, 0);
    A.ver(P.aro[GANA4], true, T5.aro);
    senalar(A, GANA4, T5.flecha);
    A.ver(P.globo.duda, false, T5.duda);
    A.ver(P.globo.chivo, true, T5.globo);
  }

  var FRASES = [
    'El teléfono vio fotos de tres animales, cada una con su nombre. Ahora le llega la foto del chivo de Selvin. ¿Qué nombre le pondrá?',
    'El teléfono pone el chivo encima de cada foto. Lo marcado es lo que coincide, y la barra dice cuánto. La barra más larga es la del perro.',
    'Contesta «perro», sin dudar. Solo puede decir uno de los nombres que vio, y nunca vio un chivo. Tampoco puede decir «no sé».',
    'Selvin lo copió tal cual. La tarea le salió mala, y la repitió de noche.',
    'Ahora le enseñamos la foto de otro chivo, con su nombre. Ya puede decir cuatro nombres.',
    'Compara otra vez la foto de Selvin. Ahora la barra más larga es la del chivo, y contesta «chivo». Le faltaba una foto de chivo.',
    '¿Qué animal de tu casa no ha visto este teléfono? ¿Qué nombre le pondría? Escríbelo en tu cuaderno.'
  ];
  var BOTONES = ['🔍 Que compare', '💬 ¿Qué contesta?', '📝 ¿Y la tarea?', '📷 Enseñarle un chivo', '🔍 Otra vez', '✍️ ¿Y tú?', '↺ Empezar otra vez'];
  var MARCADOR = [['3', 'nombres que puede decir'], ['3', 'fotos comparadas con la del chivo'], ['0', 'fotos de chivo en lo que vio'],
    ['2', 'veces hizo Selvin la misma tarea'], ['4', 'nombres que puede decir'], ['4', 'fotos comparadas con la del chivo'], ['4', 'nombres para elegir']];

  AnimacionMision.montar('#amChivo', {
    vista: [ANCHO, ALTO],
    describe: 'El teléfono vio fotos de un perro, un gato y una gallina, cada una con su nombre. Pone la foto del chivo de Selvin encima de cada una. ' +
      'La que más coincide es la del perro, y contesta «perro». Selvin lo copia y repite la tarea de noche. Con la foto de otro chivo, contesta «chivo».',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
