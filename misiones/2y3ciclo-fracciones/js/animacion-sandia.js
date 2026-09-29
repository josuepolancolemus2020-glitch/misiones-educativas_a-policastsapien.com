/* ============================================================
   M.E.T.A.S · Las Fracciones · La sandía de Kenia
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Kenia:
   le tocó repartir la sandía entre los cinco de la casa, cortó cinco
   pedazos «más o menos iguales» y el suyo salió la mitad del de su
   hermano. En su casa eso acabó en pleito, y con razón: cinco pedazos
   no son quintos si no son iguales.
   El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  la sandía entera y los cinco de la casa: ¿cómo se corta para
        que a todos les toque lo mismo?;
     1  el corte de Kenia, a ojo: cinco pedazos, el suyo chiquito y el
        de su hermano grande;
     2  el de Kenia cabe dos veces en el de su hermano: le tocó la
        mitad. Son cinco pedazos, pero no son quintos;
     3  los cortes se corren hasta quedar a la misma distancia: cinco
        partes iguales, quintos;
     4  cada parte es un quinto, 1/5: abajo el denominador (en cuántas
        partes iguales) y arriba el numerador (cuántas se toman);
     5  Kenia y su hermano juntos: 2/5, y el 5 no cambia;
     6  los cinco quintos juntos son la sandía entera: 5/5.

   Cuatro decisiones, y ninguna es de adorno:

   1. ⚠️ **Una sandía REDONDA, partida desde el centro.** Una sandía
      larga partida en rodajas de igual ancho da pedazos distintos,
      porque las puntas son más angostas: el dibujo habría enseñado lo
      contrario de lo que dice. Partida desde el centro, cortes a la
      misma distancia dan partes iguales de verdad, como el pastel del
      bloque de abajo y el círculo de la prueba.
   2. ⚠️ **Lo que se dibuja es lo que se cuenta.** La sonda
      `verifica-animacion-mision` mide el ángulo de cada corte sobre el
      dibujo: que el pedazo de Kenia sea la mitad del de su hermano y
      que ninguno de los cinco sea un quinto, que las dos copias llenen
      justo el de su hermano, que después los cinco midan lo mismo, y
      que las partes marcadas sean las que dice la fracción.
   3. ⚠️ **Las fracciones del dibujo se escriben apiladas y a mano.** La
      misión apila «3/4» en toda la página al cargar (Fr.barrer), y ese
      barrido metería HTML dentro del texto del dibujo, donde no se
      pinta. El aparato le cierra la puerta (data-sinfr) y el dibujo
      escribe cada fracción con su número arriba, su raya y su número
      abajo. La frase la dice con palabras («un quinto»), que es como
      la oye quien usa lector de pantalla.
   4. **Ninguna cuenta de la prueba.** La prueba preguntaba si 5/5 es
      menos que un entero, que es justo el último paso: ahora pregunta
      por 6/6. Aquí no se suma ni se resta: eso es de su sección.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amSandia')) return;

  var ANCHO = 320, ALTO = 236, FIN = 6;
  var R = 92;                               // el radio de la sandía
  var CENTRO = { solo: [160, 118], con: [112, 118] };   // sola, o con la fracción al lado
  var PANEL = 266;                          // el centro de la fracción escrita, a la derecha
  /* Los cortes, en grados desde las doce y con el reloj. El de Kenia (44°)
     es la mitad del de su hermano (88°), y ninguno de los cinco mide 72°:
     ninguno es un quinto, ni por casualidad. */
  var CORTES = { kenia: [0, 44, 132, 196, 280], quintos: [0, 72, 144, 216, 288] };
  var PARTES = 5;
  var COLOR = { cascara: '#2e7d32', blanco: '#c5e1a5', pulpa: '#e53935', semilla: '#2b1a14', corte: '#4a0d0d' };

  /* Qué quintos van marcados en cada paso (los demás, a media luz). */
  var MARCADOS = [null, null, null, null, 1, 2, 5];
  var MARCADOR = [
    { cifra: '1', palabras: 'sandía para los cinco de la casa' },
    { cifra: '5', palabras: 'pedazos, pero no iguales' },
    { cifra: '2', palabras: 'veces cabe el pedazo de Kenia' },
    { cifra: '5', palabras: 'partes iguales: quintos' },
    { cifra: '1/5', palabras: 'un quinto: el de Kenia' },
    { cifra: '2/5', palabras: 'dos quintos' },
    { cifra: '5/5', palabras: 'la sandía entera' }
  ];
  var TEXTOS = [
    'Kenia tiene que repartir una sandía entre los cinco de la casa. ¿Cómo se corta para que a todos les toque lo mismo? Piénsalo antes de tocar.',
    'Kenia cortó a ojo cinco pedazos «más o menos iguales». El suyo salió chiquito y el de su hermano, grande.',
    'El pedazo de Kenia cabe dos veces en el de su hermano: le tocó la mitad. Son cinco pedazos, pero no son quintos.',
    'Para que sean quintos, las cinco partes tienen que ser iguales: cada corte, a la misma distancia del otro. Ahora nadie sale ganando.',
    'Cada parte es un quinto. Abajo va el 5, el denominador: en cuántas partes iguales se partió. Arriba va el 1, el numerador: las que se toman.',
    'Kenia y su hermano juntos se llevan dos de las cinco partes: dos quintos. El 5 de abajo no cambia, porque la sandía sigue partida en cinco.',
    'Los cinco quintos juntos son la sandía entera: cinco quintos son un entero. Así a cada uno le toca lo mismo, corte quien corte.'
  ];
  var BOTONES = [
    '🍉 Cortar como Kenia',
    '📐 Comparar pedazos',
    '🍉 Partes iguales',
    '✏️ ¿Cómo se escribe?',
    '👫 Con su hermano',
    '🏠 Toda la casa',
    '↺ Empezar otra vez'
  ];

  var A;
  var sandia, cortes = [], marcas = {}, copias = [], copiaN = [], quintos = [], velos = [], etiquetas = [];
  var nombres = {}, panel = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  /* Un punto a la distancia r del centro, en el ángulo a (grados desde las
     doce, con el reloj). */
  function punto(r, a) {
    var t = (a - 90) * Math.PI / 180;
    return [r2(r * Math.cos(t)), r2(r * Math.sin(t))];
  }
  /* Un pedazo de la sandía entre dos cortes, con el centro en (0, 0). */
  function sector(r, a0, a1) {
    var p0 = punto(r, a0), p1 = punto(r, a1);
    return 'M 0 0 L ' + p0[0] + ' ' + p0[1] + ' A ' + r + ' ' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + p1[0] + ' ' + p1[1] + ' Z';
  }
  function limites(cual) {
    var c = CORTES[cual], l = [];
    for (var i = 0; i < PARTES; i++) l.push([c[i], i + 1 < PARTES ? c[i + 1] : 360]);
    return l;
  }
  function medio(a0, a1) { return (a0 + a1) / 2; }

  /* Una fracción escrita como en el cuaderno: el número de arriba, la
     raya y el de abajo, cada uno su pieza. Nunca «1/5» en un solo texto:
     el barrido de la misión lo apilaría con HTML, que dentro de un SVG no
     se pinta. */
  function fraccion(padre, clase, x, y, tam, num, den) {
    var el = A.el;
    var g = el('g', { class: clase + ' am-fuera' }, padre);
    var n = el('text', { class: 'am-digito fr-num', x: x, y: y - tam * 0.18, 'text-anchor': 'middle', 'font-size': tam }, g);
    n.textContent = num;
    el('line', { x1: x - tam * 0.42, y1: y, x2: x + tam * 0.42, y2: y, style: 'stroke:var(--am-pri,#c2255c);stroke-width:' + r2(tam / 12) + ';stroke-linecap:round' }, g);
    var d = el('text', { class: 'am-digito fr-den', x: x, y: y + tam * 0.86, 'text-anchor': 'middle', 'font-size': tam }, g);
    d.textContent = den;
    return { g: g, num: n, den: d };
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── La sandía, vista desde arriba: la cáscara, lo blanco, la pulpa y
       las semillas. Es un solo dibujo; los pedazos los dicen los cortes. ── */
    sandia = el('g', { class: 'fr-sandia' }, svg);
    el('circle', { class: 'fr-cascara', cx: 0, cy: 0, r: R, style: 'fill:' + COLOR.cascara }, sandia);
    el('circle', { cx: 0, cy: 0, r: R - 7, style: 'fill:' + COLOR.blanco }, sandia);
    el('circle', { cx: 0, cy: 0, r: R - 11, style: 'fill:' + COLOR.pulpa }, sandia);
    for (var s = 0; s < 30; s++) {
      /* Dos anillos de semillas, corridos uno del otro, apuntando al centro.
         Van lejos de los cortes para que ninguna tape uno. */
      var anillo = s < 15 ? 0.52 : 0.76, ang = (s % 15) * 24 + (s < 15 ? 7 : 19);
      var p = punto(R * anillo, ang);
      el('ellipse', {
        cx: 0, cy: 0, rx: 2.3, ry: 3.8, transform: 'translate(' + p[0] + ' ' + p[1] + ') rotate(' + ang + ')',
        style: 'fill:' + COLOR.semilla
      }, sandia);
    }

    /* ── A media luz: lo que no se toma (pasos 4 y 5) ── */
    limites('quintos').forEach(function (l, i) {
      velos.push(el('path', {
        class: 'fr-velo am-fuera', 'data-i': i, 'data-a0': l[0], 'data-a1': l[1], d: sector(R + 1, l[0], l[1]),
        style: 'fill:var(--card,#fff);fill-opacity:0.72'
      }, sandia));
    });

    /* ── Los cortes: cinco rayas del centro a la cáscara, que se corren
       del corte de Kenia al de partes iguales ── */
    for (var i = 0; i < PARTES; i++) {
      var g = el('g', { class: 'fr-corte am-fuera' }, sandia);
      el('line', { class: 'fr-raya', x1: 0, y1: 0, x2: 0, y2: -(R + 1), style: 'stroke:' + COLOR.corte + ';stroke-width:2.4;stroke-linecap:round' }, g);
      cortes.push(g);
    }

    /* ── El pedazo de Kenia y el de su hermano, con su raya gruesa ── */
    var lk = limites('kenia');
    ['kenia', 'hermano'].forEach(function (quien, i) {
      marcas[quien] = el('path', {
        class: 'fr-marca am-fuera', 'data-quien': quien, 'data-a0': lk[i][0], 'data-a1': lk[i][1], d: sector(R, lk[i][0], lk[i][1]),
        style: 'fill:none;stroke:var(--dark,#16211f);stroke-width:3;stroke-linejoin:round'
      }, sandia);
    });

    /* ── Las dos copias del pedazo de Kenia, que se van a llenar el de su
       hermano. Cada una es el pedazo de Kenia (0° a 44°) girado. ── */
    for (var k = 0; k < 2; k++) {
      var gc = el('g', { class: 'fr-copia am-fuera', 'data-a0': 0, 'data-a1': lk[0][1] }, sandia);
      el('path', {
        d: sector(R, 0, lk[0][1]),
        style: 'fill:var(--card,#fff);fill-opacity:0.45;stroke:var(--dark,#16211f);stroke-width:2.2;stroke-dasharray:5 3;stroke-linejoin:round'
      }, gc);
      copias.push(gc);
      /* El número de cada copia va aparte y no dentro de ella: la copia gira
         para llegar al pedazo del hermano, y con ella el «2» salía acostado. */
      var tc = el('text', { class: 'am-rotulo fr-copia-n am-fuera', x: 0, y: 5, 'text-anchor': 'middle', 'font-size': 15 }, sandia);
      tc.textContent = k + 1;
      copiaN.push(tc);
    }

    /* ── Los quintos marcados, y el 1/5 de cada uno (paso 6) ── */
    limites('quintos').forEach(function (l, i) {
      quintos.push(el('path', {
        class: 'fr-quinto am-fuera', 'data-i': i, 'data-a0': l[0], 'data-a1': l[1], d: sector(R, l[0], l[1]),
        style: 'fill:none;stroke:var(--dark,#16211f);stroke-width:3;stroke-linejoin:round'
      }, sandia));
      var pe = punto(R * 0.6, medio(l[0], l[1]));
      var e = fraccion(sandia, 'fr-etq', pe[0], pe[1] + 1, 15, 1, PARTES);
      /* Encima de la pulpa roja, cada 1/5 va en su tarjetita del color de la
         tarjeta: el número y la raya se leen en las dos pantallas. */
      e.g.insertBefore(el('rect', {
        x: pe[0] - 11, y: pe[1] - 19, width: 22, height: 37, rx: 6,
        style: 'fill:var(--card,#fff);fill-opacity:0.94;stroke:var(--dark,#16211f);stroke-width:1'
      }), e.g.firstChild);
      e.g.setAttribute('data-i', i);
      etiquetas.push(e.g);
    });

    /* ── Los nombres, dentro de su pedazo ── */
    ['kenia', 'hermano'].forEach(function (quien) {
      var t = el('text', { class: 'am-rotulo fr-nombre am-fuera', 'data-quien': quien, x: 0, y: 5, 'text-anchor': 'middle', 'font-size': 13 }, sandia);
      t.textContent = quien === 'kenia' ? 'Kenia' : 'hermano';
      nombres[quien] = t;
    });

    /* ── La fracción escrita, a la derecha ── */
    var gp = el('g', { class: 'fr-panel am-fuera' }, svg);
    panel.g = gp;
    panel.arriba = el('text', { class: 'am-letra fr-rotulo-num am-fuera', x: PANEL, y: 50, 'text-anchor': 'middle', 'font-size': 13, style: 'fill:var(--gray,#636e72)' }, gp);
    panel.arriba.textContent = 'numerador';
    var f = fraccion(gp, 'fr-grande', PANEL, 108, 40, '?', PARTES);
    f.g.classList.remove('am-fuera');
    panel.num = f.num; panel.den = f.den;
    panel.abajo = el('text', { class: 'am-letra fr-rotulo-den', x: PANEL, y: 170, 'text-anchor': 'middle', 'font-size': 13, style: 'fill:var(--gray,#636e72)' }, gp);
    panel.abajo.textContent = 'denominador';
    panel.entero = el('text', { class: 'am-digito fr-entero am-fuera', x: PANEL, y: 206, 'text-anchor': 'middle', 'font-size': 18 }, gp);
    panel.entero.textContent = '= 1 entero';
  }

  function pintar(n) {
    var conPanel = n >= 3, iguales = n >= 3;
    var c = conPanel ? CENTRO.con : CENTRO.solo;
    var tarde = conPanel ? 600 : 0;           // primero se corre la sandía, después los cortes
    A.mover(sandia, c[0], c[1], 0, 1);

    var ang = CORTES[iguales ? 'quintos' : 'kenia'];
    for (var i = 0; i < PARTES; i++) {
      A.mover(cortes[i], 0, 0, ang[i], 1, n === 3 ? tarde : 0);
      /* Al cortar como Kenia, las rayas salen una tras otra, como el
         cuchillo. */
      A.ver(cortes[i], n >= 1, n === 1 ? 150 + i * 220 : 0);
    }

    var lk = limites('kenia'), lq = limites('quintos');
    A.ver(marcas.kenia, n === 1 || n === 2, n === 1 ? 1300 : 0);
    A.ver(marcas.hermano, n === 1 || n === 2, n === 1 ? 1300 : 0);

    /* Las copias salen del pedazo de Kenia y giran hasta el de su hermano. */
    for (var k = 0; k < copias.length; k++) {
      var aqui = n === 2, giro = lk[1][0] + k * lk[0][1];
      A.mover(copias[k], 0, 0, aqui ? giro : 0, 1, aqui ? 250 + k * 500 : 0);
      A.ver(copias[k], aqui, aqui ? k * 500 : 0);
      var pn = punto(R * 0.62, giro + lk[0][1] / 2);
      A.mover(copiaN[k], pn[0], pn[1], 0, 1);
      A.ver(copiaN[k], aqui, aqui ? 1100 + k * 500 : 0);
    }

    /* Los nombres van en medio de su pedazo: el de Kenia o el quinto. */
    ['kenia', 'hermano'].forEach(function (quien, j) {
      var l = iguales ? lq[j] : lk[j];
      /* En el paso 2 «hermano» sale a la cáscara: la raya entre las dos copias
         pasa justo por el medio de su pedazo, que es donde iba. */
      var p = punto(n === 2 && quien === 'hermano' ? R + 30 : R * 0.62, medio(l[0], l[1]));
      A.mover(nombres[quien], p[0], p[1], 0, 1, n === 3 ? tarde : 0);
      var se = (n >= 1 && n <= 3) || (n === 4 && j === 0) || (n === 5);
      A.ver(nombres[quien], se, n === 1 ? 1300 : 0);
    });

    var marcados = MARCADOS[n];
    for (var q = 0; q < PARTES; q++) {
      var si = marcados !== null && q < marcados;
      A.ver(quintos[q], si, si ? 150 + q * 90 : 0);
      A.ver(velos[q], marcados !== null && !si, 0);
      A.ver(etiquetas[q], n === 6, n === 6 ? 300 + q * 120 : 0);
    }

    A.ver(panel.g, conPanel, conPanel ? 900 : 0);
    panel.num.textContent = marcados !== null ? marcados : '?';
    panel.num.style.opacity = marcados !== null ? '' : '0.45';
    A.ver(panel.arriba, marcados !== null, 0);
    A.ver(panel.entero, n === 6, n === 6 ? 900 : 0);
  }

  AnimacionMision.montar('#amSandia', {
    vista: [ANCHO, ALTO],
    describe: 'Una sandía redonda vista desde arriba, partida en cinco pedazos: primero como la cortó Kenia, a ojo, y después en cinco partes iguales, que son quintos.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return MARCADOR[n]; }
  });
})();
