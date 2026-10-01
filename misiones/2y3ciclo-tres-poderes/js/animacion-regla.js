/* ============================================================
   Animación de «Los Tres Poderes del Estado» (Ruta de la Patria)
   ------------------------------------------------------------
   La historia: a la mamá de Marvin le dijeron en la escuela que sin
   cierto papel no podían matricularlo. Preguntó dónde estaba escrito, le
   contestaron «así se ha hecho siempre», nadie pudo enseñarle el papel y
   Marvin perdió dos semanas de clase. Una regla de verdad está escrita, y
   quién la escribe, quién la pone a funcionar y quién decide cuando hay
   pleito son tres poderes distintos.

   Lo que se dibuja: arriba, tres tarjetas, cada una con su dibujo (📜, 🏛️
   y ⚖️, los mismos de la tarjeta de los tres poderes de la misión). Abajo,
   UNA hoja que pasa por las tres: la primera mano la escribe, la segunda
   la pone a funcionar y la tercera señala lo que dice y decide un pleito.
   Al final, la regla de la escuela de Marvin: un papel vacío, de raya
   cortada, que nadie pudo señalar.

   ⚠️ Las manos NO llevan el nombre de su poder, y a propósito. La prueba
   pregunta qué poder hace cada cosa («¿Qué poder del Estado HACE las
   leyes?», el pleito del cerco, el de los dos vecinos) y quién lo ejerce;
   si la animación lo dijera, esas preguntas se contestarían sin estudiar.
   Es lo que hizo La Materia con «cuánto pesa» y «cuánto ocupa»: el trabajo
   se ve, y el nombre lo busca el alumno por su dibujo en la tarjeta de más
   abajo, y lo escribe en su cuaderno. `_dev/verifica-poderes.js` comprueba
   que los dibujos sean los de los datos, en su orden, y que lo que dice
   cada tarjeta salga de lo que el archivo dice de ese poder.

   ⚠️ Tampoco se dice «ley» ni «cumplir»: la prueba pregunta qué es una ley
   y si es un consejo. Es una «regla», como en la historia, y la segunda
   mano «la pone a funcionar», que es lo que dicen los datos.

   ⚠️ Lo escrito lleva su ancho medido con la Fredoka (AV, por cada 100
   px) y `textLength`: así cabe igual antes y después de que llegue la
   letra. Y una pieza tiene una sola demora: lo que aparece y además se
   mueve va en dos envolturas.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amRegla')) return;

  var ANCHO = 320, ALTO = 244;

  /* ── las medidas de la letra ───────────────────────────────── */
  var AV = {
    a: 56.3, b: 56.3, c: 50.5, d: 56.5, e: 53.7, f: 40.5, g: 55.2, h: 55.4, i: 24.2, j: 23.6, k: 50.4, l: 30.1, m: 80.3,
    n: 56.3, o: 55.9, p: 55.2, q: 55.1, r: 42.3, s: 45.8, t: 41.1, u: 56, v: 56.4, w: 74.6, x: 52.3, y: 55.9, z: 54,
    A: 70.9, B: 61.9, C: 64.3, D: 66.7, E: 61, F: 61.9, G: 71.5, H: 66.2, I: 23.2, J: 53.6, K: 59.5, L: 56.5, M: 81.4,
    N: 68.3, O: 72.5, P: 59.7, Q: 79.2, R: 61.1, S: 54.6, T: 64.8, U: 68.8, V: 72.7, W: 95.3, X: 69.1, Y: 63.8, Z: 59,
    'á': 56.3, 'é': 53.7, 'í': 22.5, 'ó': 55.9, 'ú': 56, 'ñ': 56.3, ' ': 24.1, ',': 22.4, '.': 21.7, ':': 22.5,
    '¿': 47.5, '?': 48.1, '¡': 24.3, '!': 24.2, '«': 61.6, '»': 61
  };
  function ancho(t, tam) {
    var s = 0;
    for (var i = 0; i < t.length; i++) s += AV[t.charAt(i)] != null ? AV[t.charAt(i)] : 55;
    return Math.round(s * tam) / 100;
  }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* ── el dibujo ─────────────────────────────────────────────── */
  /* Tres columnas, una por mano; la hoja pasa de una a otra */
  var COL = [56, 160, 264], PASO = COL[1] - COL[0];
  /* Cada mano tiene su puesto: una tarjeta alta con el mismo dibujo que
     la tarjeta de los tres poderes, lo que hace esa mano (un «?» hasta
     que trabaja) y, debajo, su mesa, adonde llega la hoja. La mano se
     queda en su mesa cuando la hoja se va: si quedara flotando en el
     aire, no se sabría de quién es. Los renglones van a 12 de distancia:
     la caja de la Fredoka de 10 mide 12,7 de alto. */
  var PUESTO = { y: 4, alto: 130, ancho: 92, emoji: 18, emojiY: 27, tam: 10, uno: 48, dos: [42, 54] };
  var PUESTOS = [
    { emoji: '📜', lineas: ['la escribe'] },
    { emoji: '🏛️', lineas: ['la pone a', 'funcionar'] },
    { emoji: '⚖️', lineas: ['decide cuando', 'hay pleito'] }
  ];
  /* La hoja, dibujada en la primera columna: un renglón grueso arriba y
     cuatro de texto. El que señala la tercera mano es el 3. */
  var PAPEL = { x: 36, y: 68, ancho: 40, alto: 58 };
  var RENGLONES = [
    { y: 78, x0: 41, x1: 71, titulo: true },
    { y: 90, x0: 41, x1: 71 }, { y: 100, x0: 41, x1: 71 }, { y: 110, x0: 41, x1: 71 }, { y: 120, x0: 41, x1: 62 }
  ];
  var SENALADO = 3;
  /* La mano que escribe: la punta de la pluma sigue cada renglón mientras
     se dibuja, salta al principio del siguiente y, al terminar, se aparta a
     la orilla de la hoja para no taparla. La punta del ✍️ está abajo a la
     izquierda del dibujo: un punto adentro de su orilla izquierda y tres
     más arriba que su borde de abajo (el emoji de tamaño s baja 0,262 s
     de la línea de base). Cada movimiento va en su propia envoltura,
     porque una pieza tiene una sola demora. */
  var PLUMA = { tam: 18, reposo: { x: 77, y: 117 } };
  var PLUMA_PASOS = (function () {
    var pasos = [], R = RENGLONES, u = R[R.length - 1];
    R.forEach(function (r, k) {
      if (k > 0) pasos.push({ tipo: 'salta', dx: r.x0 - R[k - 1].x1, dy: r.y - R[k - 1].y, renglon: k });
      pasos.push({ tipo: 'desliza', dx: r.x1 - r.x0, dy: 0, renglon: k });
    });
    pasos.push({ tipo: 'levanta', dx: PLUMA.reposo.x - u.x1, dy: PLUMA.reposo.y - u.y });
    return pasos;
  })();
  /* El engrane de la segunda mano, a la derecha de la hoja cuando la hoja
     ya está en la segunda columna */
  var ENGRANE = { cx: 193, cy: 97, fuera: 10, dentro: 7, hueco: 3, dientes: 8 };
  /* La tercera mano: el dedo, a la derecha de la hoja (en la tercera
     columna), a la altura del renglón que señala */
  var DEDO = { x: 286, tam: 16 };
  /* El pleito: dos personas en el suelo, con su duda entre ellas, y la
     flecha que baja de la hoja a la duda */
  var SUELO = { y: 238, x0: 220, x1: 308 };
  var GENTE = [{ x: 238, camisa: 'rg-camisa-a' }, { x: 290, camisa: 'rg-camisa-b' }];
  var DUDA = { cx: 264, cy: 172, r: 9 };
  var FLECHA = { x: 264, y0: 129, y1: 157 };
  /* La regla de la escuela de Marvin: la escuela, lo que le dijeron y el
     papel que nadie pudo enseñar, con otro dedo que no tiene dónde señalar */
  var ESCUELA = { x: 15, base: 200, tam: 18 };
  var GLOBO = { x0: 4, x1: 100, y0: 140, y1: 172, lineas: ['«Así se ha', 'hecho siempre»'], base: [152.5, 165.5], tam: 10 };
  var VACIA = { x: 36, y: 178, ancho: 40, alto: 58 };

  /* ── el reloj de la escena ──────────────────────────────────── */
  /* Cada renglón se dibuja en un cuarto de segundo (el CSS de la misión),
     uno detrás de otro; la pluma salta al siguiente en la décima de
     segundo de antes. */
  var T1 = { renglon: [150, 500, 850, 1200, 1550], salto: 100, levanta: 1850, puesto: 2200 };
  var T2 = { engrane: 900, gira: 1000, puesto: 1900 };
  var T3 = { gente: 600, dedo: 1100, marca: 1400, flecha: 1600, punta: 2400, bien: 2500, puesto: 2900 };
  var T4 = { escuela: 0, vacia: 500, duda: 900, dedo: 1300 };
  var T5 = { aro: [0, 250, 500] };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido, medido) {
    var at = { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' };
    if (medido) { at.textLength = ancho(contenido, tam); at.lengthAdjust = 'spacing'; }
    var n = A.el('text', at, padre);
    n.textContent = contenido || '';
    return n;
  }

  /* Una paloma de «decidido» dentro de su ficha blanca: se lee igual en las
     dos pantallas, y es una forma, no solo un color. */
  function bien(A, padre, cx, cy, r, atributos) {
    var g = A.el('g', atributos, padre);
    A.el('circle', { cx: cx, cy: cy, r: r, 'class': 'rg-ficha-bien' }, g);
    A.el('path', { d: 'M' + r2(cx - r * 0.48) + ' ' + r2(cy + r * 0.02) + ' L' + r2(cx - r * 0.12) + ' ' + r2(cy + r * 0.4) +
      ' L' + r2(cx + r * 0.52) + ' ' + r2(cy - r * 0.42), 'class': 'rg-bien', 'data-paloma': '' }, g);
    return g;
  }

  /* El engrane: ocho dientes alrededor de un círculo, con su hueco */
  function engrane(A, padre) {
    var E = ENGRANE, d = '', paso = 360 / E.dientes;
    for (var i = 0; i < E.dientes; i++) {
      var b = i * paso;
      [[b - 13.5, E.dentro], [b - 8, E.fuera], [b + 8, E.fuera], [b + 13.5, E.dentro]].forEach(function (q, j) {
        var a = q[0] * Math.PI / 180;
        d += (i === 0 && j === 0 ? 'M' : ' L') + r2(E.cx + q[1] * Math.cos(a)) + ' ' + r2(E.cy + q[1] * Math.sin(a));
      });
    }
    A.el('path', { d: d + ' Z', 'class': 'rg-engrane', 'data-engrane-dientes': '' }, padre);
    A.el('circle', { cx: E.cx, cy: E.cy, r: E.hueco, 'class': 'rg-hueco' }, padre);
  }

  /* Una persona del pleito: pantalón, camisa, brazos, cabeza y pelo */
  function persona(A, padre, k) {
    var G = GENTE[k], x = G.x, s = SUELO.y;
    var g = A.el('g', { 'data-persona': String(k) }, padre);
    A.el('rect', { x: x - 6, y: s - 13, width: 5, height: 13, rx: 1.5, 'class': 'rg-pantalon' }, g);
    A.el('rect', { x: x + 1, y: s - 13, width: 5, height: 13, rx: 1.5, 'class': 'rg-pantalon' }, g);
    A.el('rect', { x: x - 9.5, y: s - 30, width: 19, height: 19, rx: 3.5, 'class': G.camisa }, g);
    /* los brazos abiertos hacia el otro: están discutiendo */
    var hacia = k === 0 ? 1 : -1;
    A.el('path', { d: 'M' + (x + 8 * hacia) + ' ' + (s - 26) + ' L' + (x + 15 * hacia) + ' ' + (s - 33), 'class': 'rg-brazo' }, g);
    A.el('path', { d: 'M' + (x - 8 * hacia) + ' ' + (s - 26) + ' L' + (x - 11 * hacia) + ' ' + (s - 14), 'class': 'rg-brazo' }, g);
    A.el('circle', { cx: x, cy: s - 38, r: 8, 'class': 'rg-piel', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 8) + ' ' + (s - 39) + ' Q' + (x - 7) + ' ' + (s - 48) + ' ' + x + ' ' + (s - 47) +
      ' Q' + (x + 7) + ' ' + (s - 48) + ' ' + (x + 8) + ' ' + (s - 39) + ' Q' + x + ' ' + (s - 43) + ' ' + (x - 8) + ' ' + (s - 39) + ' Z',
      'class': 'rg-pelo' }, g);
    return g;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── las tres tarjetas, con su dibujo y lo que hace cada mano ── */
    P.puesto = []; P.puestoTxt = []; P.puestoDuda = []; P.aro = [];
    PUESTOS.forEach(function (Q, k) {
      var cx = COL[k], g = A.el('g', { 'data-puesto': String(k) }, svg);
      A.el('rect', { x: cx - PUESTO.ancho / 2, y: PUESTO.y, width: PUESTO.ancho, height: PUESTO.alto, rx: 8,
        'class': 'rg-puesto rg-puesto-' + k, 'data-puesto-caja': '' }, g);
      var em = texto(A, g, cx, PUESTO.emojiY, 'rg-emoji', PUESTO.emoji, 'middle', Q.emoji);
      em.setAttribute('aria-hidden', 'true');
      em.setAttribute('data-puesto-emoji', '');
      var t = A.el('g', { 'data-puesto-txt': '' }, g);
      Q.lineas.forEach(function (l, i) {
        var y = Q.lineas.length === 1 ? PUESTO.uno : PUESTO.dos[i];
        texto(A, t, cx, y, 'am-rotulo', PUESTO.tam, 'middle', l, true).setAttribute('data-linea', String(i));
      });
      P.puestoTxt.push(t);
      var duda = texto(A, g, cx, 53, 'am-rotulo', 16, 'middle', '?');
      duda.setAttribute('data-puesto-duda', '');
      P.puestoDuda.push(duda);
      P.puesto.push(g);
      P.aro.push(A.el('rect', { x: cx - 49, y: 1, width: 98, height: PUESTO.alto + 6, rx: 10, 'class': 'rg-aro rg-aro-' + k, 'data-aro': String(k) }, svg));
    });

    /* ── el engrane de la segunda mano: aparece y da una vuelta ── */
    P.engrane = A.el('g', { 'data-mano': 'funciona' }, svg);
    P.engraneGira = A.el('g', { 'data-gira': '' }, P.engrane);
    P.engraneGira.style.transformOrigin = ENGRANE.cx + 'px ' + ENGRANE.cy + 'px';
    engrane(A, P.engraneGira);

    /* ── la hoja: la misma en las tres columnas ── */
    P.papel = A.el('g', { 'data-papel': '' }, svg);
    A.el('rect', { x: PAPEL.x, y: PAPEL.y, width: PAPEL.ancho, height: PAPEL.alto, rx: 3, 'class': 'rg-papel', 'data-papel-caja': '' }, P.papel);
    var R = RENGLONES[SENALADO];
    P.marca = A.el('rect', { x: R.x0 - 2, y: R.y - 5, width: R.x1 - R.x0 + 4, height: 10, rx: 2, 'class': 'rg-marca', 'data-marca': '' }, P.papel);
    P.renglones = RENGLONES.map(function (r, i) {
      return A.el('path', { d: 'M' + r.x0 + ' ' + r.y + ' L' + r.x1 + ' ' + r.y, 'class': 'rg-renglon' + (r.titulo ? ' rg-titulo' : ''),
        'data-renglon': String(i) }, P.papel);
    });

    /* ── la mano que escribe: se queda en su columna. Va DESPUÉS de la hoja
       en el documento, porque escribe encima de ella ── */
    P.pluma = A.el('g', { 'data-mano': 'escribe' }, svg);
    var dentro = P.pluma;
    P.plumaPasos = PLUMA_PASOS.map(function (q) {
      dentro = A.el('g', { 'class': 'rg-' + q.tipo, 'data-paso-pluma': q.tipo }, dentro);
      return dentro;
    });
    var r0 = RENGLONES[0];
    var pl = texto(A, dentro, r0.x0 - 1, r2(r0.y + 3 - 0.262 * PLUMA.tam), 'rg-emoji', PLUMA.tam, 'start', '✍️');
    pl.setAttribute('aria-hidden', 'true');
    pl.setAttribute('data-pluma', '');

    /* ── el pleito, debajo de la tercera columna ── */
    P.gente = A.el('g', { 'data-gente': '' }, svg);
    A.el('path', { d: 'M' + SUELO.x0 + ' ' + SUELO.y + ' L' + SUELO.x1 + ' ' + SUELO.y, 'class': 'rg-suelo', 'data-suelo': '' }, P.gente);
    persona(A, P.gente, 0);
    persona(A, P.gente, 1);
    /* La duda aparece con el pleito y se va cuando se decide, en el mismo
       paso: son dos envolturas, porque una pieza tiene una sola demora. */
    P.duda = A.el('g', { 'data-duda': '' }, svg);
    P.dudaSeVa = A.el('g', { 'data-duda-se-va': '' }, P.duda);
    A.el('circle', { cx: DUDA.cx, cy: DUDA.cy, r: DUDA.r, 'class': 'rg-duda', 'data-duda-caja': '' }, P.dudaSeVa);
    texto(A, P.dudaSeVa, DUDA.cx, DUDA.cy + 4.3, 'rg-letra', 12, 'middle', '?');
    P.bien = bien(A, svg, DUDA.cx, DUDA.cy, DUDA.r, { 'data-bien': '' });
    P.flecha = A.el('path', { d: 'M' + FLECHA.x + ' ' + FLECHA.y0 + ' L' + FLECHA.x + ' ' + FLECHA.y1, 'class': 'rg-flecha', 'data-flecha': '' }, svg);
    P.punta = A.el('path', { d: 'M' + (FLECHA.x - 4.5) + ' ' + (FLECHA.y1 - 5) + ' L' + FLECHA.x + ' ' + (FLECHA.y1 + 3) +
      ' L' + (FLECHA.x + 4.5) + ' ' + (FLECHA.y1 - 5) + ' Z', 'class': 'rg-punta', 'data-punta': '' }, svg);

    /* ── la tercera mano: el dedo que señala el renglón ── */
    P.dedo = texto(A, svg, DEDO.x, RENGLONES[SENALADO].y + 0.353 * DEDO.tam, 'rg-emoji', DEDO.tam, 'start', '👈');
    P.dedo.setAttribute('aria-hidden', 'true');
    P.dedo.setAttribute('data-mano', 'decide');

    /* ── la regla de la escuela de Marvin ── */
    P.escuela = texto(A, svg, ESCUELA.x, ESCUELA.base, 'rg-emoji', ESCUELA.tam, 'middle', '🏫');
    P.escuela.setAttribute('aria-hidden', 'true');
    P.escuela.setAttribute('data-escuela', '');
    P.globo = A.el('g', { 'data-globo': '' }, svg);
    var G = GLOBO, pt = ESCUELA.x, py = ESCUELA.base - 0.968 * ESCUELA.tam;
    A.el('path', { d: 'M' + (G.x0 + 8) + ' ' + G.y0 + ' L' + (G.x1 - 8) + ' ' + G.y0 + ' Q' + G.x1 + ' ' + G.y0 + ' ' + G.x1 + ' ' + (G.y0 + 8) +
      ' L' + G.x1 + ' ' + (G.y1 - 8) + ' Q' + G.x1 + ' ' + G.y1 + ' ' + (G.x1 - 8) + ' ' + G.y1 + ' L' + (pt + 7) + ' ' + G.y1 +
      ' L' + pt + ' ' + r2(py) + ' L' + (pt - 1) + ' ' + G.y1 + ' L' + (G.x0 + 8) + ' ' + G.y1 +
      ' Q' + G.x0 + ' ' + G.y1 + ' ' + G.x0 + ' ' + (G.y1 - 8) + ' L' + G.x0 + ' ' + (G.y0 + 8) + ' Q' + G.x0 + ' ' + G.y0 + ' ' + (G.x0 + 8) + ' ' + G.y0 + ' Z',
      'class': 'rg-globo', 'data-globo-caja': '', 'data-punta-globo': pt + ' ' + r2(py) }, P.globo);
    G.lineas.forEach(function (l, i) {
      texto(A, P.globo, (G.x0 + G.x1) / 2, G.base[i], 'rg-letra', G.tam, 'middle', l, true).setAttribute('data-dice', String(i));
    });
    P.vacia = A.el('g', { 'data-vacia': '' }, svg);
    A.el('rect', { x: VACIA.x, y: VACIA.y, width: VACIA.ancho, height: VACIA.alto, rx: 3, 'class': 'rg-vacia', 'data-vacia-caja': '' }, P.vacia);
    P.vaciaDuda = texto(A, P.vacia, VACIA.x + VACIA.ancho / 2, VACIA.y + VACIA.alto / 2 + 0.382 * 18, 'rg-letra', 18, 'middle', '?');
    P.vaciaDuda.setAttribute('data-vacia-duda', '');
    P.dedo2 = texto(A, svg, VACIA.x + VACIA.ancho + 2, VACIA.y + VACIA.alto / 2 + 0.353 * DEDO.tam, 'rg-emoji', DEDO.tam, 'start', '👈');
    P.dedo2.setAttribute('aria-hidden', 'true');
    P.dedo2.setAttribute('data-mano', 'marvin');
  }

  /* ── los estados ───────────────────────────────────────────── */

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    return [P.papel, P.marca, P.pluma, P.engrane, P.engraneGira, P.dedo, P.gente, P.duda, P.dudaSeVa, P.bien, P.flecha, P.punta,
      P.escuela, P.globo, P.vacia, P.vaciaDuda, P.dedo2]
      .concat(P.renglones, P.plumaPasos, P.puestoTxt, P.puestoDuda, P.aro);
  }

  /* El estado al TERMINAR cada paso. col: en qué columna está la hoja;
     escrita: sus renglones; puestos: qué tarjetas ya dicen lo que hacen;
     lo demás, qué se ve. */
  var ESTADOS = [
    { col: 0, escrita: false, puestos: [false, false, false], pluma: false, engrane: false, pleito: false, decidido: false, marvin: false, aros: false },
    { col: 0, escrita: true, puestos: [true, false, false], pluma: true, engrane: false, pleito: false, decidido: false, marvin: false, aros: false },
    { col: 1, escrita: true, puestos: [true, true, false], pluma: true, engrane: true, pleito: false, decidido: false, marvin: false, aros: false },
    { col: 2, escrita: true, puestos: [true, true, true], pluma: true, engrane: true, pleito: true, decidido: true, marvin: false, aros: false },
    { col: 2, escrita: true, puestos: [true, true, true], pluma: true, engrane: true, pleito: true, decidido: true, marvin: true, aros: false },
    { col: 2, escrita: true, puestos: [true, true, true], pluma: true, engrane: true, pleito: true, decidido: true, marvin: true, aros: true }
  ];

  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.mover(P.papel, s.col * PASO, 0, 0, 1, 0);
      P.renglones.forEach(function (r) { A.trazar(r, s.escrita, 0); });
      A.ver(P.pluma, s.pluma, 0);
      P.plumaPasos.forEach(function (w, i) {
        var q = PLUMA_PASOS[i];
        A.mover(w, s.escrita ? q.dx : 0, s.escrita ? q.dy : 0, 0, 1, 0);
      });
      A.ver(P.engrane, s.engrane, 0);
      A.mover(P.engraneGira, 0, 0, s.engrane ? 360 : 0, 1, 0);
      A.ver(P.marca, s.decidido, 0);
      A.ver(P.dedo, s.decidido, 0);
      A.ver(P.flecha, s.decidido, 0);
      A.trazar(P.flecha, s.decidido, 0);
      A.ver(P.punta, s.decidido, 0);
      A.ver(P.gente, s.pleito, 0);
      A.ver(P.duda, s.pleito, 0);
      A.ver(P.dudaSeVa, !s.decidido, 0);
      A.ver(P.bien, s.decidido, 0);
      A.ver(P.escuela, s.marvin, 0);
      A.ver(P.globo, s.marvin, 0);
      A.ver(P.vacia, s.marvin, 0);
      A.ver(P.vaciaDuda, s.marvin, 0);
      A.ver(P.dedo2, s.marvin, 0);
      s.puestos.forEach(function (si, k) {
        A.ver(P.puestoTxt[k], si, 0);
        A.ver(P.puestoDuda[k], !si, 0);
        A.ver(P.aro[k], s.aros, 0);
      });
    });
  }

  /* Lo que hace una tarjeta cuando su mano ya trabajó: se va el «?» y sale
     lo que hace */
  function puesto(A, k, demora) {
    A.ver(P.puestoDuda[k], false, demora);
    A.ver(P.puestoTxt[k], true, demora);
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
      P.aro.forEach(function (a, k) { A.ver(a, true, T5.aro[k]); });
      return;
    }
    if (n === 1) {
      base(A, ESTADOS[0]);
      /* la primera mano escribe la hoja, renglón por renglón */
      A.ver(P.pluma, true, 0);
      P.renglones.forEach(function (r, k) { A.trazar(r, true, T1.renglon[k]); });
      P.plumaPasos.forEach(function (w, i) {
        var q = PLUMA_PASOS[i];
        var d = q.tipo === 'levanta' ? T1.levanta : q.tipo === 'salta' ? T1.renglon[q.renglon] - T1.salto : T1.renglon[q.renglon];
        A.mover(w, q.dx, q.dy, 0, 1, d);
      });
      puesto(A, 0, T1.puesto);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      /* la hoja pasa a la segunda mano, que la pone a funcionar */
      A.mover(P.papel, PASO, 0, 0, 1, 0);
      A.ver(P.engrane, true, T2.engrane);
      A.mover(P.engraneGira, 0, 0, 360, 1, T2.gira);
      puesto(A, 1, T2.puesto);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      /* la hoja pasa a la tercera: hay un pleito, y la mano señala lo que
         dice el papel y decide */
      A.mover(P.papel, 2 * PASO, 0, 0, 1, 0);
      A.ver(P.gente, true, T3.gente);
      A.ver(P.duda, true, T3.gente);
      A.ver(P.dedo, true, T3.dedo);
      A.ver(P.marca, true, T3.marca);
      A.ver(P.flecha, true, T3.flecha);
      A.trazar(P.flecha, true, T3.flecha);
      A.ver(P.punta, true, T3.punta);
      A.ver(P.dudaSeVa, false, T3.bien);
      A.ver(P.bien, true, T3.bien);
      puesto(A, 2, T3.puesto);
      return;
    }
    /* el 4: la regla de la escuela de Marvin, que nadie pudo señalar */
    base(A, ESTADOS[3]);
    A.ver(P.escuela, true, T4.escuela);
    A.ver(P.globo, true, T4.escuela);
    A.ver(P.vacia, true, T4.vacia);
    A.ver(P.vaciaDuda, true, T4.duda);
    A.ver(P.dedo2, true, T4.dedo);
  }

  var FRASES = [
    'Una regla de verdad está escrita, y con ella trabajan tres manos distintas. ¿Qué hace cada una? Piénsalo antes de tocar.',
    'La primera mano la escribe. Ahora la regla está en un papel: lo que dice se puede leer y señalar con el dedo.',
    'El papel pasa a la segunda mano. Ella no la escribió: la pone a funcionar, con lo que el papel dice.',
    'Si dos discuten por la regla, la tercera mano señala lo que dice el papel y decide en ese caso.',
    'A la mamá de Marvin le dijeron «así se ha hecho siempre», y nadie pudo enseñarle el papel donde estuviera escrito.',
    'Cada mano es un poder del Estado. Búscala por su dibujo más abajo y escribe en tu cuaderno cómo se llama.'
  ];
  var BOTONES = ['✍️ La primera mano', '⚙️ La segunda', '👈 La tercera', '📄 ¿Y la de Marvin?', '🔍 ¿Cómo se llaman?', '↺ Empezar otra vez'];
  var MARCADOR = [['3', 'manos, y una sola regla'], ['1', 'de 3 manos ya trabajó'], ['2', 'de 3 manos ya trabajaron'],
    ['3', 'manos, y un solo papel'], ['?', '¿dónde está escrita?'], ['3', 'poderes: búscalos más abajo']];

  AnimacionMision.montar('#amRegla', {
    vista: [ANCHO, ALTO],
    describe: 'Tres tarjetas con un dibujo cada una y una hoja que pasa por las tres. La primera mano escribe la regla; la segunda, que no la escribió, la pone a funcionar; la tercera señala un renglón de la hoja y decide un pleito entre dos personas. Al final, la regla de la escuela de Marvin es un papel vacío que nadie pudo señalar.',
    pasos: 6,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
