/* ============================================================
   M.E.T.A.S · Numeración y Calendario Mayas · Leer la piedra
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de la
   piedra que casi nadie lee: en Copán hay estelas talladas con
   puntos, barras y conchas, y el visitante que no sabe leerlas ve
   una piedra bonita. La historia termina diciendo que con esos tres
   símbolos se escribía cualquier número, y que la concha es un cero.
   El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   A la izquierda, una piedra con tres signos tallados: cuatro puntos,
   dos barras y una concha. A la derecha, la mesa donde se explica
   cada uno. Lo que enseña, en el orden en que se aprende:

     0  la piedra tiene tres signos: ¿qué número dice cada uno? Se
        decide antes de tocar;
     1  el punto vale 1: el primer signo tiene cuatro puntos, dice 4;
     2  un quinto punto no se deja: cinco puntos se juntan y se vuelven
        una barra. Por eso la barra vale 5;
     3  otros cinco puntos, otra barra, encima de la primera: dos barras
        son 10, y eso dice el segundo signo;
     4  la concha vale 0: dice que ahí no hay nada. La piedra ya se lee:
        4, 10 y 0;
     5  ¿y un punto encima de una concha? Ahí empieza otro nivel, y
        cuánto vale ese punto se adivina abajo, en el Predice.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que va debajo NO se regala, y aquí manda más que en
      ninguna otra.** El «Predice» pregunta cómo se escribe el 13,
      cuánto vale un punto del nivel de arriba y cuántos días tiene el
      tun. La segunda ES el valor posicional de base 20, así que la
      animación no lo enseña: llega hasta la puerta (un punto encima de
      una concha) y le deja la pregunta al alumno. Ni un 13, ni un 20, ni
      un tun, en ningún paso.
   2. ⚠️ **Los ejemplos no pueden ser preguntas de la prueba.** La prueba
      pide leer casi todos los números del 0 al 19 (el 6, el 7, el 8, el
      9, el 12, el 13, el 14, el 17…). Los tres signos de la piedra son
      los que no pregunta: cuatro puntos, dos barras y la concha. Las dos
      formas de la operativa que pedían leer «2 barras» se corrieron a
      otro número (en numeracion-maya.js, _fueraDeLaAnimacion).
   3. **Cinco puntos se vuelven una barra a la vista.** Es la regla que
      hace corto el sistema, y se ve pasar: llega el quinto punto, los
      cinco se juntan y queda una barra. Los segundos cinco puntos se
      juntan encima de la primera: así se ve también que las barras se
      apilan.
   4. **La piedra es la del widget de la misión** (Lee la Estela): el
      mismo color de piedra y la misma talla café, y en la pantalla
      oscura, lo mismo al revés. El alumno reconoce la piedra cuando la
      vuelve a ver más abajo.
   5. **Lo que se dibuja es lo que se cuenta.** La sonda
      `verifica-animacion-mision` cuenta los puntos, las barras y las
      conchas de cada signo y de la mesa, y los compara con lo que dicen
      el rótulo de cada signo y el marcador, en cada paso.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPiedra')) return;

  var ANCHO = 320, ALTO = 200, FIN = 5;

  /* La piedra y sus tres signos. Los colores salen del CSS de la misión
     (--ma-piedra, --ma-talla…), que los cambia en la pantalla oscura. */
  var PIEDRA = 'var(--ma-piedra, #d7ccc8)', BORDE = 'var(--ma-piedra-borde, #a1887f)', TALLA = 'var(--ma-talla, #4e342e)';
  var SIGNOS = [
    { clave: 'a', y: 20, vale: 4 },
    { clave: 'b', y: 76, vale: 10 },
    { clave: 'c', y: 132, vale: 0 }
  ];
  var X_CART = 28, W_CART = 76, H_CART = 48;

  /* La mesa, donde se explica cada signo. */
  var MX = 236, MY = 96, DX = 20, R_PUNTO = 8, W_BARRA = 96, H_BARRA = 16;
  var X_PUNTOS = [MX - 2 * DX, MX - DX, MX, MX + DX, MX + 2 * DX];
  var Y_BARRA_ABAJO = 114, Y_BARRA_ARRIBA = 90;

  /* Una concha, de frente: la forma y tres rayas. Mide 36 × 22. */
  var CONCHA = 'M -18 4 Q -16 -11 0 -11 Q 16 -11 18 4 Q 10 11 0 11 Q -10 11 -18 4 Z';
  var RAYAS = 'M -9 8 Q -8 -2 -4 -9 M 0 10 V -10 M 9 8 Q 8 -2 4 -9';

  var TEXTOS = [
    'La piedra tiene tres signos: unos puntos, dos barras y una concha. ¿Qué número dice cada uno? Decídelo antes de tocar.',
    'El punto vale 1. El primer signo tiene cuatro puntos: uno, dos, tres, cuatro. Dice 4.',
    '¿Y si llega un quinto punto? Cinco puntos no se dejan juntos: se cambian por una barra. Por eso la barra vale 5.',
    'Otros cinco puntos, otra barra, encima de la primera. Dos barras son 10: eso dice el segundo signo.',
    'La concha vale 0: dice que ahí no hay nada. Ya sabes leer la piedra: 4, 10 y 0.',
    '¿Y un punto encima de una concha? Ahí empieza otro nivel. ¿Cuánto vale ese punto? Adivínalo abajo.'
  ];

  var A;
  var marcos = {}, valores = {};
  var puntos = [], cuentas = [], puntos2 = [], barra1, barra2, concha, rotCero, nivel = {};

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Un punto de la mesa, en cuatro capas, porque en un mismo paso hace
     cuatro cosas con su propio momento: dónde está (g), cuánto se corre al
     juntarse con los otros (c), cuándo se enciende al llegar (w) y cuándo
     se apaga al volverse barra (d). Con una sola capa, la última orden
     pisaría a las otras. */
  function punto(x, y) {
    var el = A.el;
    var g = el('g', null, A.svg), c = el('g', null, g), w = el('g', null, c), d = el('g', null, w);
    el('circle', { class: 'ma-punto', cx: 0, cy: 0, r: R_PUNTO, style: 'fill:var(--am-pri)' }, d);
    A.mover(g, x, y, 0, 1, 0);
    return { g: g, c: c, w: w, d: d, x: x, y: y };
  }
  /* Lo mismo para lo que solo se enciende y se apaga (la cuenta de un
     punto): w se enciende y d se apaga. */
  function capas(padre) {
    var w = A.el('g', null, padre), d = A.el('g', null, w);
    return { w: w, d: d };
  }

  function dibujaConcha(padre, relleno, trazo, ancho) {
    A.el('path', { d: CONCHA, style: 'fill:' + relleno + ';stroke:' + trazo + ';stroke-width:' + ancho + ';stroke-linejoin:round' }, padre);
    A.el('path', { d: RAYAS, style: 'fill:none;stroke:' + trazo + ';stroke-width:' + ancho + ';stroke-linecap:round' }, padre);
  }

  function barra(y) {
    var el = A.el, g = el('g', null, A.svg), d = el('g', null, g);
    el('rect', { class: 'ma-barra', x: -W_BARRA / 2, y: -H_BARRA / 2, width: W_BARRA, height: H_BARRA, rx: 6, style: 'fill:var(--am-pri)' }, d);
    /* Lo que vale la barra, a su derecha: va con ella cuando se mueve. */
    var t = texto(g, { class: 'am-letra ma-vale-barra am-fuera', x: W_BARRA / 2 + 10, y: 5, 'font-size': 14 }, '5');
    A.mover(g, MX, y, 0, 0.3, 0);
    return { g: g, d: d, t: t };
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── La piedra ── */
    el('path', { class: 'ma-piedra', d: 'M 16 192 V 30 Q 16 8 38 8 H 94 Q 116 8 116 30 V 192 Z',
      style: 'fill:' + PIEDRA + ';stroke:' + BORDE + ';stroke-width:2' }, svg);
    SIGNOS.forEach(function (s) {
      var g = el('g', { class: 'ma-signo', 'data-signo': s.clave }, svg);
      el('rect', { x: X_CART, y: s.y, width: W_CART, height: H_CART, rx: 8, style: 'fill:var(--ma-cartucho, rgba(78,52,46,0.08));stroke:' + BORDE + ';stroke-width:1.2' }, g);
      var cy = s.y + H_CART / 2;
      if (s.clave === 'a') {
        [45, 59, 73, 87].forEach(function (x) { el('circle', { class: 'ma-talla-punto', cx: x, cy: cy, r: 5, style: 'fill:' + TALLA }, g); });
      } else if (s.clave === 'b') {
        [cy - 10, cy + 2].forEach(function (y) { el('rect', { class: 'ma-talla-barra', x: 38, y: y, width: 56, height: 8, rx: 3, style: 'fill:' + TALLA }, g); });
      } else {
        var c = el('g', { class: 'ma-talla-concha', transform: 'translate(66 ' + cy + ')' }, g);
        dibujaConcha(c, 'none', TALLA, 2);
      }
      marcos[s.clave] = el('rect', { class: 'am-trazo ma-marco am-fuera', 'data-signo': s.clave, x: X_CART - 4, y: s.y - 4, width: W_CART + 8, height: H_CART + 8, rx: 11, style: 'stroke-width:2.4' }, svg);
      valores[s.clave] = texto(svg, { class: 'am-digito ma-valor am-fuera', 'data-signo': s.clave, x: 124, y: cy + 6, 'font-size': 17 }, '= ' + s.vale);
    });

    /* ── La mesa ── */
    /* Los primeros cinco puntos, con su cuenta debajo. El quinto llega de la
       derecha. */
    X_PUNTOS.forEach(function (x, i) {
      puntos.push(punto(x, MY));
      var k = capas(svg);
      texto(k.d, { class: 'am-letra ma-cuenta', x: x, y: MY + 30, 'text-anchor': 'middle', 'font-size': 14 }, String(i + 1));
      cuentas.push(k);
    });
    /* Los otros cinco, que se juntan en la segunda barra. Sin cuenta: la
       cuenta de un número entre 6 y 9 sería una pregunta de la prueba. */
    X_PUNTOS.forEach(function (x) { puntos2.push(punto(x, Y_BARRA_ARRIBA)); });
    barra1 = barra(MY);
    barra2 = barra(Y_BARRA_ARRIBA);

    /* La concha de la mesa, y su 0. */
    concha = { g: el('g', null, svg) };
    concha.d = el('g', { class: 'ma-concha' }, concha.g);
    dibujaConcha(concha.d, 'var(--card,#fff)', 'var(--am-pri)', 1.6);
    A.mover(concha.g, MX, MY, 0, 1.6, 0);
    rotCero = texto(svg, { class: 'am-digito ma-cero am-fuera', x: MX, y: MY + 50, 'text-anchor': 'middle', 'font-size': 20 }, '0');

    /* Otro nivel: la raya que separa los pisos, un punto arriba y su «?». */
    /* La raya va tenue con stroke-opacity y no con opacity: una opacidad
       menor que 1 en el elemento es lo que .am-fuera usa para decir «no
       está», y la raya tiene que estar. */
    nivel.raya = el('path', { class: 'ma-nivel-raya am-fuera', d: 'M ' + (MX - 50) + ' 106 H ' + (MX + 50),
      style: 'fill:none;stroke:var(--gray,#636e72);stroke-width:1.2;stroke-dasharray:4 3;stroke-opacity:0.8' }, svg);
    nivel.punto = punto(MX, 74);
    nivel.punto.g.setAttribute('class', 'ma-arriba');
    nivel.pregunta = texto(svg, { class: 'am-letra ma-pregunta am-fuera', x: MX + 22, y: 81, 'font-size': 20 }, '?');
  }

  function pintar(n, antes) {
    var adelante = n > antes;
    function d(ms) { return adelante ? ms : 0; }
    var llega1 = adelante && n === 1, llega2 = adelante && n === 2, llega3 = adelante && n === 3, llega4 = adelante && n === 4, llega5 = adelante && n === 5;

    /* ── La piedra: cada signo se marca cuando se lee, y su valor queda ── */
    A.ver(marcos.a, n === 1, 0);
    A.ver(marcos.b, n === 3, d(llega3 ? 300 : 0));
    A.ver(marcos.c, n === 4, 0);
    A.ver(valores.a, n >= 1, d(llega1 ? 1300 : 0));
    A.ver(valores.b, n >= 3, d(llega3 ? 2900 : 0));
    A.ver(valores.c, n >= 4, d(llega4 ? 1100 : 0));

    /* ── Los primeros cinco puntos: cuatro llegan en el paso 1; en el 2
       llega el quinto, los cinco se juntan en el centro y se apagan justo
       cuando nace la barra ── */
    puntos.forEach(function (p, i) {
      var quinto = i === 4;
      if (quinto) A.mover(p.g, p.x + (n >= 2 ? 0 : 40), p.y, 0, 1, llega2 ? 250 : 0);
      A.mover(p.c, n >= 2 ? MX - p.x : 0, 0, 0, n >= 2 ? 0.5 : 1, llega2 ? 2000 : 0);
      A.ver(p.w, quinto ? n >= 2 : n >= 1, d(llega1 ? 150 + 180 * i : llega2 && quinto ? 200 : 0));
      A.ver(p.d, n < 2, d(llega2 ? 2300 : 0));
    });
    cuentas.forEach(function (k, i) {
      var quinto = i === 4;
      A.ver(k.w, quinto ? n >= 2 : n >= 1, d(llega1 ? 300 + 180 * i : llega2 && quinto ? 900 : 0));
      A.ver(k.d, n < 2, d(llega2 ? 1900 : 0));
    });

    /* ── Las barras: la primera nace del paso 2 y baja en el 3; la segunda
       nace de los otros cinco puntos, encima de la primera ── */
    A.mover(barra1.g, MX, n >= 3 ? Y_BARRA_ABAJO : MY, 0, n >= 2 ? 1 : 0.3, llega2 ? 2300 : 0);
    A.ver(barra1.d, n === 2 || n === 3, d(llega2 ? 2300 : 0));
    A.ver(barra1.t, n === 2 || n === 3, d(llega2 ? 3000 : llega3 ? 2900 : 0));
    puntos2.forEach(function (p, i) {
      A.mover(p.c, n >= 3 ? MX - p.x : 0, 0, 0, n >= 3 ? 0.5 : 1, llega3 ? 2000 : 0);
      A.ver(p.w, n >= 3, d(llega3 ? 500 + 200 * i : 0));
      A.ver(p.d, n < 3, d(llega3 ? 2250 : 0));
    });
    A.mover(barra2.g, MX, Y_BARRA_ARRIBA, 0, n >= 3 ? 1 : 0.3, llega3 ? 2250 : 0);
    A.ver(barra2.d, n === 3, d(llega3 ? 2250 : 0));
    A.ver(barra2.t, n === 3, d(llega3 ? 2900 : 0));

    /* ── La concha: grande en el paso 4, y abajo, en su nivel, en el 5 ── */
    A.mover(concha.g, MX, n === 5 ? 138 : MY, 0, n === 5 ? 1.1 : 1.6, 0);
    A.ver(concha.d, n >= 4, d(llega4 ? 500 : 0));
    A.ver(rotCero, n === 4, d(llega4 ? 900 : 0));

    /* ── Otro nivel: un punto arriba, y la pregunta ── */
    A.ver(nivel.raya, n === 5, d(llega5 ? 500 : 0));
    A.ver(nivel.punto.w, n === 5, d(llega5 ? 700 : 0));
    A.ver(nivel.pregunta, n === 5, d(llega5 ? 1100 : 0));
  }

  function marcador(n) {
    return [
      { cifra: '3 signos', palabras: '¿qué número dice cada uno?' },
      { cifra: '4', palabras: 'cuatro puntos' },
      { cifra: '5', palabras: 'cinco puntos, una barra' },
      { cifra: '10', palabras: 'dos barras' },
      { cifra: '0', palabras: 'la concha: no hay nada' },
      { cifra: '?', palabras: 'un punto encima de una concha' }
    ][n];
  }

  AnimacionMision.montar('#amPiedra', {
    vista: [ANCHO, ALTO],
    describe: 'Una piedra con tres signos tallados (cuatro puntos, dos barras y una concha) y, al lado, una mesa donde los puntos se cuentan y cinco puntos se juntan en una barra.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🔵 Los puntos', '➕ Un punto más', '➕ Cinco puntos más', '🐚 ¿Y la concha?', '⬆️ ¿Y encima?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
