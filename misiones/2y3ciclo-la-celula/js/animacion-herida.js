/* ============================================================
   M.E.T.A.S · La Célula · «El brazo de don Tulio»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de don Tulio: se
   abrió el brazo con el machete, estuvo dos semanas sin trabajar y a la
   tercera la herida estaba cerrada y la piel completa otra vez. Nadie le
   puso carne nueva: la puso su propio cuerpo. La historia pregunta de dónde
   salió, y contesta que cada pedacito salió de algo que ya estaba vivo ahí.
   El aparato (botones, frase, marcador) vive en js/animacion-mision.js;
   aquí solo está el dibujo y dónde va cada pieza en cada paso.

   Arriba, el brazo de don Tulio, y un recuadro sobre la herida que se abre
   abajo: su piel vista de muy cerca, hecha de células pegadas unas con
   otras.

     0  la piel, entera: ¿de dónde va a salir la piel nueva?;
     1  el machete se lleva nueve células: queda un hueco en forma de V;
     2  una célula de la orilla se divide: de una salen dos iguales, y la
        nueva ocupa un lugar del hueco;
     3  las de la orilla se siguen dividiendo, y la nueva también: el hueco
        se llena de abajo hacia arriba;
     4  la herida está cerrada: nueve células nuevas, y cada una unida a la
        que la hizo. Ninguna apareció de la nada;
     5  la pregunta es del alumno: un raspón suyo que ya sanó, dibujado en
        su cuaderno.

   Cuatro decisiones, y ninguna es de adorno:

   1. ⚠️ **Cada célula nueva sale de una que ya estaba, y se ve salir.** La
      nueva nace encima de su madre, igual a ella, y de ahí se corre a su
      lugar. Lleva escrito cuál es su madre, y la sonda comprueba que sea
      vecina, que ya estuviera ahí cuando la nueva nació y que la nueva
      arranque justo de encima de ella.
   2. ⚠️ **Las nuevas también se dividen.** La V se llena de abajo hacia
      arriba, y de la segunda tanda en adelante algunas madres son células
      que acaban de nacer. Una nueva se divide solo cuando ya llegó a su
      lugar.
   3. ⚠️ **Lo que pregunta la prueba no se dice**: ni el nombre de una parte
      de la célula, ni con qué se ve, ni cuánto mide, ni cuántas tiene el
      cuerpo, ni quién escribió la regla de que toda célula sale de otra.
      Donde la historia o esta animación ya contestaban, la prueba se
      cambió.
   4. **Nada se dice solo con color**: las células se cuentan, y en el paso
      4 cada nueva lleva su flecha desde la que la hizo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amHerida')) return;

  var ANCHO = 320, ALTO = 240, FIN = 5;

  /* La piel de cerca: cinco filas de nueve células. La de arriba es la
     superficie. */
  var COLS = 9, FILAS = 5, PASO = 33, X0 = 28, Y0 = 88, LADO = 30;
  function cx(c) { return X0 + c * PASO; }
  function cy(f) { return Y0 + f * PASO; }
  /* El hueco que deja el machete: una V desde la superficie. */
  var HUECO = [[0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [1, 3], [1, 4], [1, 5], [2, 4]];
  function enHueco(f, c) { return HUECO.some(function (h) { return h[0] === f && h[1] === c; }); }
  /* Cada célula nueva: dónde queda, de quién sale y en qué tanda (el paso
     en que nace). La madre es una célula que ya estaba ahí, o una nueva de
     una tanda anterior. En cada tanda, primero las de la orilla y después
     las nuevas. */
  var NUEVAS = [
    { f: 2, c: 4, madre: [3, 4], paso: 2, orden: 0 },
    { f: 1, c: 3, madre: [1, 2], paso: 3, orden: 0 },
    { f: 1, c: 5, madre: [1, 6], paso: 3, orden: 0 },
    { f: 1, c: 4, madre: [2, 4], paso: 3, orden: 1 },
    { f: 0, c: 2, madre: [0, 1], paso: 4, orden: 0 },
    { f: 0, c: 6, madre: [0, 7], paso: 4, orden: 0 },
    { f: 0, c: 3, madre: [1, 3], paso: 4, orden: 1 },
    { f: 0, c: 5, madre: [1, 5], paso: 4, orden: 1 },
    { f: 0, c: 4, madre: [1, 4], paso: 4, orden: 1 }
  ];
  /* Cuándo nace cada tanda, contado desde que arranca el paso: la segunda
     vuelta espera a que las nuevas de la primera hayan llegado. */
  var TANDA = [300, 1500];

  var TEXTOS = [
    'Así se ve de muy cerca la piel del brazo de don Tulio: células pegadas unas con otras. ¿De dónde saldrá la piel nueva?',
    'El machete se llevó estas nueve. Nadie le va a poner piel nueva: la tiene que hacer su propio cuerpo.',
    'Una célula de la orilla se divide: de una salen dos, iguales. La nueva ocupa un lugar del hueco.',
    'Las de la orilla se siguen dividiendo, y la nueva también. Así el hueco se va llenando de abajo hacia arriba.',
    'A la tercera semana, la herida está cerrada. Cada célula nueva salió de otra que ya estaba viva ahí: ninguna apareció de la nada.',
    '¿Y tú? Busca en tu piel un raspón que ya sanó, y dibuja en tu cuaderno cómo se fue cerrando.'
  ];

  var A;
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  /* Una célula de la piel, con su centro en (x, y). */
  function celula(padre, x, y, attrs) {
    var g = A.el('g', attrs, padre);
    A.el('rect', { class: 'ce-celula', 'data-cuerpo': '', x: x - LADO / 2, y: y - LADO / 2, width: LADO, height: LADO, rx: 8 }, g);
    A.el('circle', { class: 'ce-centro', cx: x + 1.5, cy: y - 1, r: 5.4 }, g);
    return g;
  }

  var P = {};

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El brazo de don Tulio, y el recuadro sobre la herida ── */
    el('path', { class: 'ce-brazo', 'data-brazo': '', d: 'M 14 22 Q 60 14 118 20 L 120 42 Q 60 48 14 40 Z' }, svg);
    /* La mano, con su pulgar y la raya de los dedos; y la manga de la
       camisa, que dice que el brazo sigue: sin ellas, el brazo solo parece
       un palo. */
    el('path', { class: 'ce-mano', d: 'M 117 20 Q 124 17 128 19 L 130 12.5 Q 134 10.5 135.5 14 L 134.5 21 Q 142 22 145 26.5 Q 146.5 31 142 34 Q 135 39.5 119 42.5 Z' }, svg);
    el('path', { class: 'ce-dedos', d: 'M 135 28.5 L 144 28 M 133.5 33.5 L 141 33' }, svg);
    el('path', { class: 'ce-manga', d: 'M -2 12 L 30 15 Q 35 31 30 48 L -2 50 Z' }, svg);
    el('path', { class: 'ce-puno', d: 'M 26 15.4 Q 30.6 31 26 47.6' }, svg);
    P.corte = el('path', { class: 'ce-corte am-fuera', 'data-corte': '', d: 'M 58 24 L 74 36' }, svg);
    el('rect', { class: 'ce-lupa', 'data-lupa': '', x: 52, y: 20, width: 28, height: 20, rx: 3 }, svg);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'brazo', x: 153, y: 25, 'font-size': 11 }, 'el brazo de don Tulio');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'cerca', x: 153, y: 39, 'font-size': 11 }, 'y abajo, su piel de muy cerca');
    /* Del recuadro a la piel de cerca: dos rayas cortadas. */
    el('line', { class: 'ce-lupa-raya', 'data-lupa-raya': 'a', x1: 52, y1: 40, x2: 8, y2: 66 }, svg);
    el('line', { class: 'ce-lupa-raya', 'data-lupa-raya': 'b', x1: 80, y1: 40, x2: 312, y2: 66 }, svg);
    el('rect', { class: 'ce-piel', 'data-piel': '', x: 8, y: 66, width: 304, height: 172, rx: 8 }, svg);

    /* ── Las células que ya estaban ── */
    P.viejas = {};
    for (var f = 0; f < FILAS; f++) {
      for (var c = 0; c < COLS; c++) {
        var g = celula(svg, cx(c), cy(f), { class: 'am-viaja', 'data-celula': f + '-' + c, 'data-vieja': '' });
        g.style.transformOrigin = cx(c) + 'px ' + cy(f) + 'px';
        P.viejas[f + '-' + c] = g;
      }
    }

    /* ── Las nuevas: nacen encima de su madre, iguales a ella, y de ahí se
       corren a su lugar. ── */
    P.nuevas = NUEVAS.map(function (n) {
      var mx = cx(n.madre[1]), my = cy(n.madre[0]);
      var g = celula(svg, mx, my, { class: 'am-viaja am-fuera', 'data-nueva': n.f + '-' + n.c, 'data-madre': n.madre[0] + '-' + n.madre[1] });
      return { g: g, n: n, dx: cx(n.c) - mx, dy: cy(n.f) - my };
    });

    /* ── Las flechas del paso 4: de cada madre a su hija. Van encima de
       las células, que si no las tapan. ── */
    P.flechas = el('g', { class: 'am-fuera', 'data-flechas': '' }, svg);
    NUEVAS.forEach(function (n) {
      var a = [cx(n.madre[1]), cy(n.madre[0])], b = [cx(n.c), cy(n.f)];
      var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      var p0 = [a[0] + ux * 6, a[1] + uy * 6], p1 = [b[0] - ux * 8, b[1] - uy * 8];
      var g = el('g', { 'data-flecha': n.f + '-' + n.c }, P.flechas);
      el('line', { class: 'ce-flecha', x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1] }, g);
      var w = 3.4, t = [p1[0] + ux * 4, p1[1] + uy * 4];
      el('path', { class: 'ce-flecha-punta', d: 'M ' + t[0] + ' ' + t[1] + ' L ' + (p1[0] - uy * w) + ' ' + (p1[1] + ux * w) + ' L ' + (p1[0] + uy * w) + ' ' + (p1[1] - ux * w) + ' Z' }, g);
    });
  }

  /* Cuándo nace cada nueva en su paso. */
  function nace(n) { return TANDA[n.orden]; }

  function pintar(n, antes) {
    var entra = function (k) { return n === k && antes !== k; };

    /* El corte en el brazo: abierto mientras no se cierra la herida. */
    A.ver(P.corte, n >= 1 && n <= 3, entra(1) ? 200 : 0);

    /* Las nueve del hueco se van con el machete: caen hacia afuera. */
    HUECO.forEach(function (h, i) {
      var g = P.viejas[h[0] + '-' + h[1]], fuera = n >= 1;
      var lado = h[1] < 4 ? -1 : h[1] > 4 ? 1 : 0;
      A.ver(g, !fuera, entra(1) ? 300 + i * 40 : 0);
      A.mover(g, fuera ? lado * 18 : 0, fuera ? -46 : 0, fuera ? lado * 25 : 0, fuera ? 0.7 : 1, entra(1) ? 300 + i * 40 : 0);
    });

    /* Las nuevas: cada una en su paso, y en los de después, quieta en su
       lugar. */
    P.nuevas.forEach(function (q) {
      var ya = n >= q.n.paso, d = entra(q.n.paso) ? nace(q.n) : 0;
      A.ver(q.g, ya, d);
      A.mover(q.g, ya ? q.dx : 0, ya ? q.dy : 0, 0, 1, d);
    });

    /* Las flechas, cuando la herida ya se cerró. */
    A.ver(P.flechas, n >= 4, entra(4) ? TANDA[1] + 1000 : 0);
  }

  function marcador(n) {
    var nuevas = function (k) { return NUEVAS.filter(function (q) { return q.paso <= k; }).length; };
    return [
      { cifra: '?', palabras: '¿de dónde sale la piel nueva?' },
      { cifra: String(HUECO.length), palabras: 'se fueron con el corte' },
      { cifra: String(nuevas(2)), palabras: 'nueva, salida de otra' },
      { cifra: String(nuevas(3)), palabras: 'nuevas, faltan ' + (HUECO.length - nuevas(3)) },
      { cifra: String(nuevas(4)), palabras: 'nuevas: la herida se cerró' },
      { cifra: '?', palabras: '¿cómo se cerró la tuya?' }
    ][n];
  }

  AnimacionMision.montar('#amHerida', {
    vista: [ANCHO, ALTO],
    describe: 'Arriba, el brazo de don Tulio con un recuadro sobre la herida. Abajo, su piel vista de muy cerca: células pegadas unas con otras. El machete se lleva nueve, y las de la orilla se dividen, y las nuevas también, hasta cerrar el hueco.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🪓 El machete', '⏳ ¿Y ahora?', '➕ ¿Y después?', '🩹 ¿Y al final?', '💡 ¿Y tú?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
