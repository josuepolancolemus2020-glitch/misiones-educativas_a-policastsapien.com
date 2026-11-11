/* ============================================================
   M.E.T.A.S · Suma y Resta de Fracciones Heterogéneas
   · Las dos bandejas de quesadilla
   ------------------------------------------------------------
   La escena de la animación que va después del «Predice»: en una
   bandeja queda 1/2 de quesadilla y en la otra 1/3. El aparato
   (botones, frase, marcador) vive en js/animacion-mision.js; aquí
   solo está el dibujo y dónde va cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  las dos bandejas: 1/2 y 1/3. ¿Cuánto hay entre las dos?;
     1  lo que se hace mal: sumar arriba y abajo da 2/5, y una raya
        enseña que 2/5 no llega ni a la mitad de una bandeja;
     2  los pedazos no son del mismo tamaño: las dos se parten en
        sextos (6 está en la tabla del 2 y en la del 3). 1/2 son 3
        sextos y 1/3 son 2 sextos;
     3  ahora sí se juntan: los 2 sextos de la segunda bandeja pasan a
        la primera, y entre las dos hay 5/6.

   Tres decisiones, y ninguna es de adorno:

   1. ⚠️ **Antes era un objeto con `titulo` y `pasos` de SVG fijos**,
      dentro del JS de la misión. El aparato no sabe de esa forma: no la
      montaba nunca, y el alumno veía solo la frase de reserva. La sonda
      de navegador lo decía: «escena.construir is not a function».
   2. ⚠️ **La quesadilla no aparece ni desaparece.** Los sextos que se
      iluminan al partir son los MISMOS pedazos que ya estaban llenos
      (3 de 6 ocupan lo mismo que 1 de 2), y al juntar se mueven, no se
      crean. La sonda cuenta lo lleno de cada bandeja contra la fracción
      que tiene al lado.
   3. **Nada se dice solo con color**: cada bandeja lleva su nombre y su
      fracción escrita, y la raya de la mitad es de raya cortada.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amQuesadilla')) return;

  var ANCHO = 320, ALTO = 226, FIN = 3;
  var X0 = 22, W = 180, H = 38, SEXTO = W / 6, QUINTO = W / 5;
  var Y = [40, 104, 168];                 // bandeja 1, bandeja 2 y la de «arriba y abajo»
  var FR_X = 262;                         // dónde va la fracción de cada bandeja

  /* Lo que dice cada bandeja en cada paso, [numerador, denominador]. */
  var DICE = [
    [[1, 2], [1, 3], null],
    [[1, 2], [1, 3], [2, 5]],
    [[3, 6], [2, 6], null],
    [[5, 6], [0, 6], null]
  ];
  var MARCADOR = [
    { cifra: '?', palabras: 'de quesadilla entre las dos' },
    { cifra: '2/5', palabras: 'no llega ni a la mitad' },
    { cifra: '6', palabras: 'sextos en cada bandeja' },
    { cifra: '5/6', palabras: 'de quesadilla: 3/6 + 2/6' }
  ];
  var TEXTOS = [
    'En una bandeja queda media quesadilla: 1/2. En la otra queda un tercio: 1/3. ¿Cuánta quesadilla hay entre las dos? Piénsalo antes de tocar.',
    'Sumar arriba y abajo da 2/5. Pero mira la raya de la mitad: 2/5 no llega ni a la mitad, y la primera bandeja sola ya tenía 1/2.',
    'Los pedazos no son del mismo tamaño. Por eso las dos bandejas se parten en sextos, porque 6 está en la tabla del 2 y en la del 3. Así, 1/2 son 3 sextos y 1/3 son 2 sextos.',
    'Ahora los pedazos son iguales y se cuentan juntos: 3 sextos y 2 sextos son 5 sextos. Entre las dos bandejas hay 5/6 de quesadilla.'
  ];
  var BOTONES = ['➕ ¿Arriba y abajo?', '🔪 Partir en sextos', '🍕 Juntarlos', '↺ Empezar otra vez'];
  var NOMBRES = ['bandeja 1', 'bandeja 2', 'sumando arriba y abajo'];

  var A, sextosA = [], sextosB = [], quintos = [], rayasA = [], rayasB = [], rayasC = [];
  var bandejas = [], nombres = [], fracs = [], mitad, mitadTxt;

  function r2(v) { return Math.round(v * 100) / 100; }

  /* Una fracción como en el cuaderno: número, raya y número, cada uno su
     pieza. Una por cada fracción que se dice; se enciende la que toca. */
  function fraccion(c, a, b, y) {
    var el = A.el, tam = 17;
    var g = el('g', { class: 'qh-fr am-fuera', 'data-b': c, 'data-dice': a + '/' + b }, A.svg);
    var n = el('text', { class: 'am-digito qh-num', x: FR_X, y: y - tam * 0.2, 'text-anchor': 'middle', 'font-size': tam }, g);
    n.textContent = a;
    el('line', { class: 'qh-barra', x1: FR_X - 9, y1: y, x2: FR_X + 9, y2: y, style: 'stroke:var(--am-pri,#5b21b6);stroke-width:1.6;stroke-linecap:round' }, g);
    var d = el('text', { class: 'am-digito qh-den', x: FR_X, y: y + tam * 0.86, 'text-anchor': 'middle', 'font-size': tam }, g);
    d.textContent = b;
    return { g: g, c: c, a: a, b: b };
  }

  function pieza(color, x, ancho, clase, datos) {
    var g = A.el('g', Object.assign({ class: clase }, datos), A.svg);
    A.el('rect', { x: 0, y: 0, width: r2(ancho), height: H, style: 'fill:' + color + ';shape-rendering:crispEdges' }, g);   // sin borde: los cortes los dibujan las rayas, y una costura blanca enseñaba los sextos antes de partir
    return g;
  }

  function raya(x, y, clase) {
    return A.el('line', { class: clase, x1: r2(x), y1: y + 1, x2: r2(x), y2: y + H - 1, style: 'stroke:var(--dark,#2d3436);stroke-width:1.6' }, A.svg);
  }

  function construir(svg, ayuda) {
    A = ayuda; A.svg = svg;
    var el = A.el;
    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── Las tres bandejas, vacías ── */
    Y.forEach(function (y, c) {
      bandejas.push(el('rect', {
        class: 'qh-bandeja', 'data-b': c, x: X0, y: y, width: W, height: H, rx: 4,
        style: 'fill:var(--frac-empty,#eef1f4);stroke:var(--dark,#2d3436);stroke-width:2'
      }, svg));
      var t = el('text', { class: 'am-letra qh-nombre', 'data-b': c, x: X0, y: y - 7, 'font-size': 12 }, svg);
      t.textContent = NOMBRES[c];
      nombres.push(t);
    });

    /* ── Lo lleno: 3 sextos en la primera (1/2), 2 en la segunda (1/3) y
       2 quintos en la de «arriba y abajo» ── */
    for (var i = 0; i < 3; i++) sextosA.push(pieza('var(--gold,#e0a800)', 0, SEXTO, 'qh-sexto qh-a', { 'data-i': i }));
    for (i = 0; i < 2; i++) sextosB.push(pieza('var(--teal,#0d9488)', 0, SEXTO, 'qh-sexto qh-b', { 'data-i': i }));
    for (i = 0; i < 2; i++) quintos.push(pieza('var(--purple,#7c3aed)', 0, QUINTO, 'qh-quinto', { 'data-i': i }));

    /* ── Los cortes. La mitad de la primera y los tercios de la segunda
       siempre; los sextos que faltan, desde que se parte. ── */
    for (var k = 1; k < 6; k++) {
      rayasA.push({ el: raya(X0 + k * SEXTO, Y[0], 'qh-raya'), siempre: k === 3 });
      rayasB.push({ el: raya(X0 + k * SEXTO, Y[1], 'qh-raya'), siempre: k % 2 === 0 });
    }
    for (k = 1; k < 5; k++) rayasC.push(raya(X0 + k * QUINTO, Y[2], 'qh-raya qh-raya-c'));

    /* ── La raya de la mitad, de la primera bandeja a la de abajo ── */
    mitad = el('line', {
      class: 'qh-mitad am-fuera', x1: X0 + W / 2, y1: Y[0] - 2, x2: X0 + W / 2, y2: Y[2] + H + 4,
      style: 'stroke:var(--am-pri,#5b21b6);stroke-width:2;stroke-dasharray:5 4'
    }, svg);
    mitadTxt = el('text', { class: 'am-letra qh-mitad-txt am-fuera', x: X0 + W / 2 + 4, y: Y[2] + H + 16, 'font-size': 12 }, svg);
    mitadTxt.textContent = 'la mitad';

    var vistos = {};
    DICE.forEach(function (fila) {
      fila.forEach(function (v, c) {
        if (!v) return;
        var clave = c + ':' + v[0] + '/' + v[1];
        if (vistos[clave]) return;
        vistos[clave] = true;
        fracs.push(fraccion(c, v[0], v[1], Y[c] + H / 2 - 2));
      });
    });
  }

  function pintar(n, antes) {
    var sigue = antes === n - 1;
    var llega = sigue && n === 3 ? 1000 : (sigue ? 450 : 0);

    sextosA.forEach(function (g, i) { A.mover(g, X0 + i * SEXTO, Y[0], 0, 1, 0); });
    /* Al juntar, los sextos de la segunda pasan a los huecos de la primera,
       uno detrás de otro. */
    sextosB.forEach(function (g, i) {
      var junto = n === 3;
      A.mover(g, X0 + (junto ? 3 + i : i) * SEXTO, junto ? Y[0] : Y[1], 0, 1, junto && sigue ? 250 + i * 300 : 0);
    });
    var conC = n === 1;
    quintos.forEach(function (g, i) {
      A.mover(g, X0 + i * QUINTO, Y[2], 0, 1, 0);
      A.ver(g, conC, conC && sigue ? 300 + i * 200 : 0);
    });
    A.ver(bandejas[2], conC, conC && sigue ? 150 : 0);
    A.ver(nombres[2], conC, conC && sigue ? 150 : 0);
    rayasC.forEach(function (r) { A.ver(r, conC, conC && sigue ? 150 : 0); });
    A.ver(mitad, conC, conC && sigue ? 800 : 0);
    A.ver(mitadTxt, conC, conC && sigue ? 800 : 0);

    var partidas = n >= 2;
    rayasA.concat(rayasB).forEach(function (r, j) {
      A.ver(r.el, r.siempre || partidas, partidas && !r.siempre && sigue && n === 2 ? 200 + (j % 5) * 120 : 0);
    });

    fracs.forEach(function (f) {
      var dice = DICE[n][f.c], era = DICE[antes] ? DICE[antes][f.c] : null;
      var si = !!dice && dice[0] === f.a && dice[1] === f.b;
      var estaba = !!era && era[0] === f.a && era[1] === f.b;
      A.ver(f.g, si, si && !estaba ? llega : 0);
    });
  }

  AnimacionMision.montar('#amQuesadilla', {
    vista: [ANCHO, ALTO],
    describe: 'Dos bandejas de quesadilla: en una queda un medio y en la otra un tercio. Se parten las dos en sextos y se juntan: cinco sextos.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return MARCADOR[n]; }
  });
})();
