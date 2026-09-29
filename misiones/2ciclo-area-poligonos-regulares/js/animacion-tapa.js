/* ============================================================
   M.E.T.A.S · Área de Polígonos Regulares · La tapa de hexágono
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Don
   Tulio: en el taller de la escuela hacen tapas de concreto en forma
   de hexágono y las cobran por el material. Él midió el lado (30 cm),
   lo multiplicó por seis y le dio el contorno, no la tapa: cobró por
   una cosa y gastó concreto de otra. El aparato (botones, frase,
   marcador) vive en js/animacion-mision.js; aquí solo está el dibujo y
   dónde va cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  la tapa, vista desde arriba, con sus lados de 30 cm: ¿cuánto
        concreto lleva? Se decide antes de tocar;
     1  lo que contó Don Tulio: la orilla, 6 × 30 = 180 cm. Eso es el
        contorno, lo que mide el molde de madera;
     2  por dentro, la tapa se parte en 6 triángulos iguales, con sus
        tres lados de 30 cm;
     3  una tapa de triángulo de 60 cm por lado tiene la misma orilla:
        3 × 60 = 180 cm;
     4  pero por dentro le caben solo 4 de esos triángulos, no 6: un
        triángulo del hexágono se pasa encima de uno de ella y es igual;
     5  la orilla no dice cuánto concreto lleva la tapa: falta una medida
        que va del centro al lado, y cómo se usa se adivina abajo.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que va debajo NO se regala, y aquí manda más que nunca.**
      El «Predice» pregunta el perímetro de un hexágono de lado 5, el
      área de un pentágono con P = 20 y apotema 4, y si la fórmula usa el
      lado o la apotema. Las dos últimas son la fórmula de la misión. Por
      eso la animación no la da: no dice «apotema», no divide entre 2 y no
      calcula ningún área. Llega hasta la puerta, como la de la numeración
      maya: termina en la medida que falta, con un «?».
   2. **Lo que sí enseña es lo que la historia pide: la orilla no mide la
      tapa.** Con la misma orilla de 180 cm, al hexágono le caben 6
      triángulos de 30 cm por lado y al triángulo de 60 cm, solo 4. Se
      cuentan pedazos iguales, sin fórmula y sin redondear nada: el
      hexágono se parte en 6 triángulos equiláteros desde su centro, y el
      triángulo grande en 4 uniendo los puntos medios de sus lados.
   3. **Los dos pedazos son iguales, y se ve.** Un triángulo del hexágono
      se pasa encima del de en medio de la otra tapa y cae justo encima:
      mismo tamaño, misma forma. Sin eso, «6 contra 4» serían pedazos de
      tamaños distintos, y no probaría nada.
   4. ⚠️ **La cuenta de la animación no cae en la prueba.** La operativa
      usa hexágonos y pentágonos de 2 a 10 cm de lado y nunca un
      triángulo, y la conceptual y la ficha no preguntan ni un hexágono de
      30 cm ni un triángulo de 60 cm ni un contorno de 180 cm. Se buscó en
      los bancos y en las treinta formas.
   5. **El concreto es concreto en las dos pantallas**, y lo que se
      marca encima lleva el color de la misión con su rótulo al lado: nada
      se dice solo con color.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amTapa')) return;

  var ANCHO = 320, ALTO = 172, FIN = 5;

  /* Los centímetros, a S píxeles cada uno. El hexágono de lado LADO y el
     triángulo de lado 2 · LADO ocupan la misma caja: el mismo ancho (dos
     lados) y el mismo alto (dos apotemas del hexágono). */
  var S = 2.4, LADO = 30;
  var L = LADO * S, H = L * Math.sqrt(3) / 2;
  /* Dónde va cada tapa: el hexágono en medio mientras está solo, a la
     izquierda cuando llega la otra. */
  var SOLO = [160, 80], IZQ = [80, 80], DER = [240, 80];

  var TEXTOS = [
    'La tapa de hexágono, vista desde arriba: cada lado mide 30 cm. ¿Cuánto concreto lleva? Decídelo antes de tocar.',
    'Don Tulio contó la orilla: 6 × 30 = 180 cm. Eso es el contorno, lo que mide el molde de madera.',
    'Por dentro, la tapa se parte en 6 triángulos iguales. Cada uno tiene sus tres lados de 30 cm.',
    'Una tapa de triángulo, de 60 cm por lado, tiene la misma orilla: 3 × 60 = 180 cm.',
    'Pero por dentro le caben solo 4 de esos triángulos, no 6. La misma orilla guarda menos concreto.',
    'La orilla no dice cuánto concreto lleva la tapa. Falta una medida que va del centro al lado: adivina abajo cómo se usa.'
  ];

  var A;
  var hex = {}, tri = {}, fantasma, fantasmaCapa, falta = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function puntos(l) { return l.map(function (p) { return r2(p[0]) + ',' + r2(p[1]); }).join(' '); }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Los seis vértices del hexágono, con el centro en el origen: uno a la
     derecha, uno a la izquierda, y los lados de arriba y de abajo acostados. */
  function verticesHex() {
    var v = [];
    for (var k = 0; k < 6; k++) { var g = k * Math.PI / 3; v.push([L * Math.cos(g), L * Math.sin(g)]); }
    return v;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── La tapa de hexágono: entera, sus 6 triángulos, su orilla y los
       cortes. Todo en un grupo que se corre a la izquierda en el paso 3. ── */
    hex.g = el('g', { class: 'tp-hex' }, svg);
    var v = verticesHex();
    hex.tapa = el('polygon', { class: 'tp-tapa', 'data-tapa': 'hex', points: puntos(v) }, hex.g);
    hex.piezas = v.map(function (p, k) {
      return el('polygon', { class: 'tp-pieza am-fuera', 'data-tapa': 'hex', 'data-k': k, points: puntos([[0, 0], p, v[(k + 1) % 6]]) }, hex.g);
    });
    var d = 'M ' + r2(v[0][0]) + ' ' + r2(v[0][1]) + ' L ' + r2(v[3][0]) + ' ' + r2(v[3][1]) +
      ' M ' + r2(v[1][0]) + ' ' + r2(v[1][1]) + ' L ' + r2(v[4][0]) + ' ' + r2(v[4][1]) +
      ' M ' + r2(v[2][0]) + ' ' + r2(v[2][1]) + ' L ' + r2(v[5][0]) + ' ' + r2(v[5][1]);
    hex.cortes = el('path', { class: 'tp-corte', d: d }, hex.g);
    hex.orilla = el('path', { class: 'tp-orilla', 'data-tapa': 'hex', d: 'M ' + puntos(v).split(' ').join(' L ') + ' Z' }, hex.g);
    hex.lado = texto(hex.g, { class: 'am-rotulo tp-medida', x: 0, y: r2(H + 17), 'text-anchor': 'middle', 'font-size': 14 }, LADO + ' cm');

    /* ── La tapa de triángulo, de lado 2 · LADO: la misma caja. ── */
    tri.g = el('g', { class: 'tp-tri am-fuera' }, svg);
    var t = [[-L, H], [L, H], [0, -H]];
    var m = [[0, H], [L / 2, 0], [-L / 2, 0]];     // los puntos medios: abajo, derecha, izquierda
    tri.tapa = el('polygon', { class: 'tp-tapa', 'data-tapa': 'tri', points: puntos(t) }, tri.g);
    tri.piezas = [
      [t[0], m[0], m[2]], [m[0], t[1], m[1]], [m[2], m[1], t[2]], [m[2], m[1], m[0]]
    ].map(function (q, k) { return el('polygon', { class: 'tp-pieza am-fuera', 'data-tapa': 'tri', 'data-k': k, points: puntos(q) }, tri.g); });
    tri.cortes = el('path', { class: 'tp-corte', d: 'M ' + puntos([m[2], m[1], m[0]]).split(' ').join(' L ') + ' Z' }, tri.g);
    tri.orilla = el('path', { class: 'tp-orilla', 'data-tapa': 'tri', d: 'M ' + puntos(t).split(' ').join(' L ') + ' Z' }, tri.g);
    tri.lado = texto(tri.g, { class: 'am-rotulo tp-medida', x: 0, y: r2(H + 17), 'text-anchor': 'middle', 'font-size': 14 }, (2 * LADO) + ' cm');

    /* ── El triángulo que se pasa de una tapa a la otra: es el de arriba del
       hexágono, y cae justo encima del de en medio del triángulo. Va en dos
       piezas: la de fuera se enciende y la de dentro viaja. Con una sola, las
       dos cosas comparten la demora (--d) y el triángulo viajaba mientras
       todavía estaba apareciendo: llegaba sin que se le viera salir. ── */
    fantasmaCapa = el('g', { class: 'am-fuera' }, svg);
    fantasma = el('polygon', { class: 'tp-fantasma', points: puntos([[0, 0], v[4], v[5]]) }, fantasmaCapa);

    /* ── La medida que falta: del centro del hexágono a la mitad de su lado
       de abajo, con su «?». ── */
    falta.raya = el('line', { class: 'am-hueco tp-falta am-fuera', x1: 0, y1: 0, x2: 0, y2: r2(H) }, hex.g);
    falta.dice = texto(hex.g, { class: 'am-rotulo tp-pregunta am-fuera', x: 9, y: r2(H / 2 + 7), 'font-size': 20 }, '?');
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);

    /* El hexágono se corre a la izquierda cuando llega la otra tapa. */
    var lugar = n >= 3 ? IZQ : SOLO;
    A.mover(hex.g, lugar[0], lugar[1], 0, 1, 0);
    A.mover(tri.g, DER[0], DER[1], 0, 1, 0);
    A.ver(tri.g, n >= 3, n === 3 && ida ? 700 : 0);

    /* La orilla: la del hexágono desde el paso 1 y la del triángulo desde el
       3, y se quedan: son las dos que se comparan. */
    A.trazar(hex.orilla, n >= 1, n === 1 && ida ? 200 : 0);
    A.trazar(tri.orilla, n >= 3, n === 3 && ida ? 900 : 0);

    /* Los cortes y los pedazos. */
    A.trazar(hex.cortes, n >= 2, n === 2 && ida ? 200 : 0);
    hex.piezas.forEach(function (p) { A.ver(p, n >= 2, n === 2 && ida ? 1000 : 0); });
    A.trazar(tri.cortes, n >= 4, n === 4 && ida ? 200 : 0);
    tri.piezas.forEach(function (p) { A.ver(p, n >= 4, n === 4 && ida ? 1000 : 0); });

    /* El triángulo que se pasa: se enciende encima del de arriba del hexágono,
       se queda ahí un momento para que se vea de dónde sale, y cae en el de en
       medio del triángulo. En el paso 5 se apaga donde llegó. */
    var enTri = n >= 4;
    A.ver(fantasmaCapa, n === 4, n === 4 && ida ? 1300 : 0);
    A.mover(fantasma, enTri ? DER[0] : lugar[0], enTri ? DER[1] + H : lugar[1], 0, 1, n === 4 && ida ? 2100 : 0);

    /* La medida que falta, en raya cortada: todavía no se sabe cuánto mide. */
    A.ver(falta.raya, n === 5, n === 5 && ida ? 300 : 0);
    A.ver(falta.dice, n === 5, n === 5 && ida ? 700 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: 'cuánto concreto' },
      { cifra: '180 cm', palabras: '6 × 30: la orilla' },
      { cifra: '6', palabras: 'triángulos por dentro' },
      { cifra: '180 cm', palabras: '3 × 60: la misma orilla' },
      { cifra: '6 y 4', palabras: 'triángulos: la misma orilla' },
      { cifra: '¿?', palabras: 'la medida del centro al lado' }
    ][n];
  }

  AnimacionMision.montar('#amTapa', {
    vista: [ANCHO, ALTO],
    describe: 'La tapa de hexágono vista desde arriba, de 30 cm por lado: su orilla mide 6 × 30 = 180 cm y por dentro se parte en 6 triángulos iguales. Una tapa de triángulo de 60 cm por lado tiene la misma orilla, pero por dentro le caben solo 4 de esos triángulos.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['📏 La orilla', '✂️ Por dentro', '🔺 Otra tapa', '✂️ Partirla', '❓ ¿Y entonces?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
