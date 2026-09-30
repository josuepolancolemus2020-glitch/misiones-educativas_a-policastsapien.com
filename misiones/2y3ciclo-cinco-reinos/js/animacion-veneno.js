/* ============================================================
   M.E.T.A.S · Los Cinco Reinos · «El veneno que no servía»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de don Tulio: a
   su milpa le cayeron unas manchas que se comían la hoja, compró veneno
   para insectos y no le hizo nada, porque no era un insecto: era un hongo.
   La historia dice que un hongo no es una planta ni un animal, que es otro
   reino con su propia manera de vivir, y que saber en cuál cae lo que uno
   tiene delante decide qué se hace con ello. Eso es lo que se ve aquí.
   El aparato (botones, frase, marcador) vive en js/animacion-mision.js;
   aquí solo está el dibujo y dónde va cada pieza en cada paso.

   Dos hojas de milpa, la misma hoja en dos sitios, y las dos comidas. Abajo,
   una etiqueta por cada reino que se va descubriendo:

     0  la de arriba tiene mordidas y la de abajo, la de don Tulio,
        manchas: ¿se las come lo mismo?;
     1  lo que tienen igual: son de una planta, y con la luz del sol hacen
        su propia comida (los granitos);
     2  en la de arriba, un chapulín llega y se come la hoja a mordidas,
        con granitos y todo: es un animal;
     3  en la de abajo nadie muerde: la mancha no tiene boca ni patas, mete
        hilitos en la hoja y por ahí le saca la comida: es un hongo;
     4  llega el veneno para insectos: al chapulín sí le hace, y al hongo
        no le hace nada: la mancha sigue creciendo hasta media hoja;
     5  son tres reinos: el veneno para insectos es para un animal, y el
        hongo es de otro reino (la bomba se va a la etiqueta del animal);
     6  la pregunta es del alumno: qué plagas ha tenido la milpa o el
        huerto de alguien que siembre, y cuáles eran animales.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Las dos hojas son la MISMA hoja**, y la luz les da a las dos
      igual. Lo único que cambia es quién se las come y cómo: así lo que
      se compara es la manera de comer, que es lo que separa los reinos.
   2. ⚠️ **El hongo no se reconoce por el color.** La prueba de la misión
      pregunta cuál de las tres preguntas NO sirve para clasificar, y la
      respuesta es «¿de qué color es?». Aquí el hongo se reconoce por cómo
      come: sin boca y sin patas, con hilitos metidos en la hoja.
   3. ⚠️ **No se enseña a adivinar una plaga por la forma del daño.** Una
      mancha puede ser de un hongo o de otra cosa, y un insecto no siempre
      deja mordidas: afirmarlo sería enseñar una regla falsa. La escena
      cuenta ESTE caso, que es el de la historia, y termina en algo que el
      alumno averigua en su casa.
   4. ⚠️ **Lo que pregunta la prueba no se dice**: ni los nombres de los
      reinos en latín, ni cómo se llaman los que hacen su comida o los que
      no, ni la pared de la célula, ni con qué hace la planta su comida por
      dentro. Donde la historia o esta animación ya contestaban, la prueba
      se cambió.
   5. **Nada se dice solo con color**: las mordidas y las manchas se
      cuentan, y lo perdido se mide (media hoja).
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amVeneno')) return;

  var ANCHO = 320, ALTO = 250, FIN = 6;

  /* La hoja de milpa: angosta en la base, ancha a un tercio y en punta.
     La de arriba y la de abajo son la misma, corrida hacia abajo. */
  var X0 = 44, X1 = 306, YA = 68, YB = 146;
  function medio(x) {
    var t = (x - X0) / (X1 - X0);
    if (t <= 0) return 7;
    if (t >= 1) return 0;
    if (t < 0.3) return 7 + 13 * Math.sin(t / 0.3 * Math.PI / 2);
    return 20 * Math.pow(Math.cos((t - 0.3) / 0.7 * Math.PI / 2), 0.8);
  }
  function r2(v) { return Math.round(v * 100) / 100; }
  function contorno(y) {
    var arriba = [], abajo = [];
    for (var i = 0; i <= 64; i++) {
      var x = X0 + (X1 - X0) * i / 64;
      arriba.push(r2(x) + ' ' + r2(y - medio(x)));
      abajo.push(r2(x) + ' ' + r2(y + medio(x)));
    }
    return 'M ' + arriba.join(' L ') + ' L ' + abajo.reverse().join(' L ') + ' Z';
  }
  /* La orilla de arriba de la hoja de arriba, donde come el chapulín. */
  function orilla(x) { return YA - medio(x); }

  /* Las mordidas. Dos viejas, que ya estaban, y tres que hace el chapulín
     delante de su boca mientras avanza. Cada una va encima de la orilla:
     una parte dentro de la hoja y otra fuera. */
  var VIEJAS = [{ x: 240, r: 6.5 }, { x: 254, r: 6 }];
  var NUEVAS = [{ x: 129, h: 0, r: 6.5, d: 850 }, { x: 122, h: 1.8, r: 7, d: 1350 }, { x: 115, h: 3.6, r: 7.5, d: 1800 }];
  /* El chapulín: su boca llega a esta orilla y avanza quince hacia la
     izquierda mientras muerde. Va un poco inclinado, porque la orilla baja
     hacia la punta y las tres patas tienen que pisarla. */
  var BOCA = [136, orilla(136)], AVANZA = 15, CAMINA = 900, CH_ESC = 1.3, CH_GIRO = 2;

  /* Los granitos: la comida que la hoja hace con la luz. En la de arriba,
     tres quedan donde muerde el chapulín y se van a su boca. */
  var GRANOS_A = [[129.5, 51, 0], [122, 53.2, 1], [114.5, 55.5, 2],
    [62, 68], [82, 76], [94, 60], [142, 76], [160, 62], [188, 72], [212, 62], [232, 72], [270, 68]];
  /* Las manchas de la hoja de don Tulio: su centro y cuánto crecen. Con el
     veneno crecen hasta cubrir media hoja (se midió: 52 %). */
  var MANCHAS = [{ x: 130, y: 146, r4: 24 }, { x: 190, y: 144, r4: 22 }, { x: 246, y: 147, r4: 20 }];
  var R0 = 5, R3 = 8;
  /* En la de abajo, los granitos que quedan cerca de una mancha se van a
     ella: tres cuando la mancha mete los hilitos y tres cuando crece. */
  var GRANOS_B = [[64, 146], [86, 154], [98, 136], [139, 150, 0, 3], [150, 134, 0, 4], [166, 160],
    [183, 138, 1, 3], [206, 153, 1, 4], [222, 137], [238, 152, 2, 3], [264, 144, 2, 4], [284, 146]];
  /* Las gotas del veneno: salen de la boquilla y caen en las dos hojas, y
     tres justo encima de las manchas. */
  var BOQUILLA = [284, 10.5];
  var GOTAS = [[66, 66], [100, 72], [152, 66], [196, 70], [226, 64], [272, 67],
    [80, 148], [130, 146], [162, 150], [190, 144], [216, 146], [246, 147]];

  var TEXTOS = [
    'Estas dos hojas de milpa están comidas. A la de abajo le pasó lo de don Tulio. ¿Se las come lo mismo?',
    'Primero, lo que tienen igual: son de una planta, y con la luz del sol hacen su propia comida. En el dibujo, esa comida son los granitos.',
    'En la de arriba, un chapulín llega y se come la hoja a mordidas, con granitos y todo. El chapulín es un animal.',
    'En la de abajo nadie muerde: la mancha no tiene boca ni patas. Mete hilitos en la hoja y por ahí le saca la comida. Es un hongo.',
    'Llega el veneno para insectos. Al chapulín sí le hace: deja de comer y se cae. Al hongo no le hace nada, y la mancha sigue creciendo.',
    'Son tres reinos distintos, y cada uno consigue su comida a su manera. El veneno para insectos es para un animal: el hongo es de otro reino.',
    '¿Y tú? Pregúntale a alguien que siembre qué plagas ha tenido su milpa o su huerto. Anota en tu cuaderno cuáles eran animales.'
  ];

  var A;
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* El chapulín, de lado y mirando a la izquierda. Su origen es la boca,
     que toca la orilla de la hoja; las patas pisan la orilla (y = 0). Los
     puntos sin tinta dicen dónde pisa y dónde muerde, para medirlos. */
  function chapulin(padre, x, y, esc, giro, marcas) {
    var g = A.el('g', { transform: 'translate(' + x + ' ' + y + ') rotate(' + (giro || 0) + ') scale(' + (esc || 1) + ')' }, padre);
    var el = A.el;
    el('path', { class: 'vn-ch-antena', d: 'M 3 -9.5 Q 0 -17 -7 -19.5 M 5 -9.8 Q 4 -18.5 -1.5 -22' }, g);
    el('path', { class: 'vn-ch-pata', d: 'M 7 -3.5 L 6 1.2 M 12 -3.5 L 14 1.2' }, g);
    el('ellipse', { class: 'vn-ch-cuerpo', cx: 22, cy: -7, rx: 10.5, ry: 4, transform: 'rotate(-6 22 -7)' }, g);
    el('ellipse', { class: 'vn-ch-cuerpo', cx: 10, cy: -6.5, rx: 5.4, ry: 4.6 }, g);
    el('circle', { class: 'vn-ch-cuerpo', cx: 4, cy: -6, r: 4.3 }, g);
    el('ellipse', { class: 'vn-ch-muslo', cx: 19.5, cy: -10.5, rx: 7.5, ry: 2.7, transform: 'rotate(-38 19.5 -10.5)' }, g);
    el('path', { class: 'vn-ch-pata', d: 'M 25 -15 L 29 1.2' }, g);
    el('circle', { class: 'vn-ch-ojo', cx: 3, cy: -7.2, r: 1.3 }, g);
    el('path', { class: 'vn-ch-pata', d: 'M 0.6 -4.2 L -0.4 -1.8' }, g);
    if (marcas) {
      [6, 14, 29].forEach(function (dx) { el('circle', { class: 'vn-punto', 'data-pata': '', cx: dx, cy: 0, r: 0.5 }, g); });
      el('circle', { class: 'vn-punto', 'data-boca': '', cx: 0, cy: -1.5, r: 0.5 }, g);
    }
    return g;
  }
  /* Una mancha de hongo: el halo amarillo, la parte muerta y sus anillos. */
  function mancha(padre, m) {
    var g = A.el('g', { 'data-mancha': '' }, padre);
    g.style.transformOrigin = m.x + 'px ' + m.y + 'px';
    A.el('circle', { class: 'vn-mancha-halo', cx: m.x, cy: m.y, r: R0 * 1.24 }, g);
    A.el('circle', { class: 'vn-mancha', 'data-mancha-cuerpo': '', cx: m.x, cy: m.y, r: R0 }, g);
    A.el('circle', { class: 'vn-mancha-anillo', cx: m.x, cy: m.y, r: R0 * 0.62 }, g);
    A.el('circle', { class: 'vn-mancha-centro', cx: m.x, cy: m.y, r: R0 * 0.3 }, g);
    return g;
  }
  /* Un hilito que sale de una mancha hacia un lado de la hoja: siempre por
     dentro, a media altura entre la vena y la orilla. */
  function hilo(padre, m, lado, arriba, largo) {
    var xf = m.x + lado * largo, xm = m.x + lado * largo * 0.55;
    var yf = YB + arriba * medio(xf) * 0.5, ym = YB + arriba * medio(xm) * 0.25 - arriba * 1.5;
    return A.el('path', { class: 'vn-hilo am-fuera', 'data-hilo': '', d: 'M ' + m.x + ' ' + m.y + ' Q ' + r2(xm) + ' ' + r2(ym) + ' ' + r2(xf) + ' ' + r2(yf) }, padre);
  }

  var P = {};

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* Las mordidas son huecos de verdad en la hoja de arriba: una máscara,
       para que por donde falta hoja se vea el fondo, en la pantalla clara y
       en la oscura. */
    var defs = el('defs', null, svg);
    var mascara = el('mask', { id: A.id + '-mordidas', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: ANCHO, height: ALTO }, defs);
    el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, fill: '#fff' }, mascara);
    VIEJAS.forEach(function (b) {
      el('circle', { 'data-mordida': 'vieja', cx: b.x, cy: r2(orilla(b.x)), r: b.r, fill: '#000' }, mascara);
    });
    P.nuevas = NUEVAS.map(function (b) {
      return el('circle', { class: 'am-fuera', 'data-mordida': 'nueva', cx: b.x, cy: r2(orilla(b.x) + b.h), r: b.r, fill: '#000' }, mascara);
    });
    /* La hoja de abajo recorta lo que crece dentro: las manchas y sus
       hilitos no se salen de la hoja. */
    var recorte = el('clipPath', { id: A.id + '-hojab' }, defs);
    el('path', { d: contorno(YB) }, recorte);

    /* ── El sol, y la luz que les llega a las dos hojas ── */
    var sol = el('g', { 'data-sol': '' }, svg);
    for (var k = 0; k < 8; k++) {
      var a = k * Math.PI / 4;
      el('line', { class: 'vn-sol-punta', x1: r2(24 + 12 * Math.cos(a)), y1: r2(22 + 12 * Math.sin(a)), x2: r2(24 + 16 * Math.cos(a)), y2: r2(22 + 16 * Math.sin(a)) }, sol);
    }
    el('circle', { class: 'vn-sol', cx: 24, cy: 22, r: 9 }, sol);
    P.rayos = [[80, 60], [58, 138]].map(function (p) {
      var dx = p[0] - 24, dy = p[1] - 22, L = Math.hypot(dx, dy);
      return el('line', { class: 'vn-rayo am-fuera', 'data-rayo': '', x1: r2(24 + dx / L * 11), y1: r2(22 + dy / L * 11), x2: p[0], y2: p[1] }, svg);
    });

    /* ── Las dos hojas ── */
    var hojaA = el('g', { mask: 'url(#' + A.id + '-mordidas)' }, svg);
    el('path', { class: 'vn-hoja', 'data-hoja': 'a', d: contorno(YA) }, hojaA);
    el('path', { class: 'vn-vena', d: 'M ' + X0 + ' ' + YA + ' L ' + (X1 - 8) + ' ' + YA }, hojaA);
    var hojaB = el('g', null, svg);
    el('path', { class: 'vn-hoja', 'data-hoja': 'b', d: contorno(YB) }, hojaB);
    el('path', { class: 'vn-vena', d: 'M ' + X0 + ' ' + YB + ' L ' + (X1 - 8) + ' ' + YB }, hojaB);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'tulio', x: 264, y: 179, 'font-size': 11.5, 'text-anchor': 'middle' }, 'la de don Tulio');

    /* Lo de dentro de la hoja de don Tulio: los hilitos, debajo, y las
       manchas encima. */
    var dentro = el('g', { 'clip-path': 'url(#' + A.id + '-hojab)' }, svg);
    P.hilosCortos = []; P.hilosLargos = [];
    MANCHAS.forEach(function (m) {
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (s) { P.hilosCortos.push(hilo(dentro, m, s[0], s[1], R3 + 11)); });
    });
    MANCHAS.forEach(function (m) {
      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(function (s) { P.hilosLargos.push(hilo(dentro, m, s[0], s[1], m.r4 + 8)); });
    });
    P.manchas = MANCHAS.map(function (m) { return mancha(dentro, m); });

    /* ── Los granitos: aparecen con la luz ── */
    P.granosA = GRANOS_A.map(function (p) {
      return { g: el('circle', { class: 'vn-granito am-fuera', 'data-granito': 'a', cx: p[0], cy: p[1], r: 2.4 }, svg), p: p };
    });
    P.granosB = GRANOS_B.map(function (p) {
      return { g: el('circle', { class: 'vn-granito am-fuera', 'data-granito': 'b', cx: p[0], cy: p[1], r: 2.4 }, svg), p: p };
    });

    /* ── El chapulín: una envoltura para verse y tres para moverse (llega,
       avanza mientras muerde, y se cae con el veneno). ⚠️ Verse va aparte:
       cada pieza tiene una sola demora, y con el veneno el chapulín tiene
       que seguir a la vista mientras llegan las gotas y apagarse al caer.
       En la misma pieza que llega, la demora de llegar (0) le ganaba y
       desaparecía al instante. ── */
    P.chVer = el('g', { class: 'am-fuera', 'data-chapulin': '' }, svg);
    P.chLlega = el('g', null, P.chVer);
    P.chAvanza = el('g', { class: 'am-viaja' }, P.chLlega);
    P.chCae = el('g', { 'data-cae': '' }, P.chAvanza);
    P.chCae.style.transformOrigin = (BOCA[0] + 18) + 'px ' + (BOCA[1] - 8) + 'px';
    chapulin(P.chCae, BOCA[0], BOCA[1], CH_ESC, CH_GIRO, true);

    /* ── Las etiquetas de los reinos: una por cada uno que se descubre ── */
    P.etiquetas = [
      { k: 'planta', t: 'planta', s: 'hace su comida', x: 8 },
      { k: 'animal', t: 'animal', s: 'come a mordidas', x: 112 },
      { k: 'hongo', t: 'hongo', s: 'le saca la comida', x: 216 }
    ].map(function (e) {
      var g = el('g', { class: 'am-fuera', 'data-etiqueta': e.k }, svg);
      el('rect', { class: 'vn-etiqueta', 'data-caja': '', x: e.x, y: 194, width: 96, height: 52, rx: 9 }, g);
      var cx = e.x + 48;
      if (e.k === 'planta') {
        el('path', { class: 'vn-hoja', d: 'M ' + (cx - 17) + ' 208 Q ' + (cx - 4) + ' 199 ' + (cx + 17) + ' 205 Q ' + (cx - 2) + ' 213 ' + (cx - 17) + ' 208 Z' }, g);
      } else if (e.k === 'animal') {
        chapulin(g, cx - 10, 212, 0.62, 0, false);
      } else {
        el('circle', { class: 'vn-mancha-halo', cx: cx, cy: 206, r: 7.4 }, g);
        el('circle', { class: 'vn-mancha', cx: cx, cy: 206, r: 6 }, g);
        el('circle', { class: 'vn-mancha-anillo', cx: cx, cy: 206, r: 3.7 }, g);
        el('circle', { class: 'vn-mancha-centro', cx: cx, cy: 206, r: 1.8 }, g);
      }
      texto(g, { class: 'am-letra', x: cx, y: 228, 'font-size': 12, 'text-anchor': 'middle', 'font-weight': 700 }, e.t);
      texto(g, { class: 'am-letra', x: cx, y: 240, 'font-size': 10, 'text-anchor': 'middle' }, e.s);
      return g;
    });

    /* ── La bomba del veneno, y sus gotas. El rótulo va a la izquierda de
       la boquilla y ARRIBA de por donde salen las gotas: debajo, las gotas
       lo cruzaban al salir. Con los tres reinos, la bomba se va a la
       etiqueta del animal: es para él. ── */
    P.rotuloVeneno = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'veneno', x: 281, y: 9.5, 'font-size': 10.5, 'text-anchor': 'end' }, 'veneno para insectos');
    P.bomba = el('g', { class: 'am-fuera', 'data-bomba': '' }, svg);
    P.bomba.style.transformOrigin = '301px 24px';
    el('path', { class: 'vn-bomba', d: 'M 296 13 L 296 6 L 307 6 L 307 13 Z M 296 8 L 285 9 L 285 12 L 296 12 Z' }, P.bomba);
    el('rect', { class: 'vn-bomba', x: 298, y: 13, width: 7, height: 5 }, P.bomba);
    el('path', { class: 'vn-bomba-gatillo', d: 'M 297 13 Q 292 16 294.5 21' }, P.bomba);
    el('rect', { class: 'vn-bomba', x: 293, y: 18, width: 17, height: 24, rx: 3 }, P.bomba);
    el('rect', { class: 'vn-bomba-banda', x: 293, y: 26, width: 17, height: 8 }, P.bomba);
    P.gotas = GOTAS.map(function (p) {
      var g = el('circle', { class: 'vn-gota am-fuera', 'data-gota': '', cx: BOQUILLA[0], cy: BOQUILLA[1], r: 2.2 }, svg);
      return { g: g, dx: p[0] - BOQUILLA[0], dy: p[1] - BOQUILLA[1] };
    });
  }

  function pintar(n, antes) {
    var entra = function (k) { return n === k && antes !== k; };

    /* La luz: desde el paso 1. */
    P.rayos.forEach(function (r) { A.ver(r, n >= 1, entra(1) ? 100 : 0); });

    /* Los granitos de la hoja de arriba: aparecen con la luz; los tres de
       las mordidas se van a la boca del chapulín cuando muerde. */
    var boca = [BOCA[0] - AVANZA, BOCA[1] - 1.5];
    P.granosA.forEach(function (q, i) {
      var comido = q.p[2] != null && n >= 2;
      var d = entra(1) ? 400 + i * 60 : entra(2) && comido ? NUEVAS[q.p[2]].d : 0;
      A.ver(q.g, n >= 1 && !comido, d);
      A.mover(q.g, comido ? boca[0] - q.p[0] : 0, comido ? boca[1] - q.p[1] : 0, 0, 1, d);
    });

    /* Los de la hoja de abajo: los que están cerca de una mancha se van a
       ella, en el paso en que la mancha mete los hilitos o crece. */
    P.granosB.forEach(function (q, i) {
      var se = q.p[3] != null && n >= q.p[3], m = se ? MANCHAS[q.p[2]] : null;
      var d = entra(1) ? 400 + i * 60 : entra(3) && q.p[3] === 3 ? 900 + i * 60 : entra(4) && q.p[3] === 4 ? 2000 + i * 60 : 0;
      A.ver(q.g, n >= 1 && !se, d);
      A.mover(q.g, se ? m.x - q.p[0] : 0, se ? m.y - q.p[1] : 0, 0, 1, d);
    });

    /* Las mordidas del chapulín, cuando muerde. Las viejas ya estaban. */
    P.nuevas.forEach(function (c, i) { A.ver(c, n >= 2, entra(2) ? NUEVAS[i].d : 0); });

    /* El chapulín: llega en el 2, avanza mientras muerde, y con el veneno
       se cae. */
    var esta = n >= 2;
    A.ver(P.chVer, n === 2 || n === 3, entra(4) ? 1300 : 0);
    A.mover(P.chLlega, esta ? 0 : 60, esta ? 0 : -80, 0, 1, 0);
    A.mover(P.chAvanza, esta ? -AVANZA : 0, 0, 0, 1, entra(2) ? CAMINA : 0);
    A.mover(P.chCae, n >= 4 ? 8 : 0, n >= 4 ? 60 : 0, n >= 4 ? 150 : 0, 1, entra(4) ? 1300 : 0);

    /* Las manchas: chicas hasta el 2; en el 3 meten los hilitos y crecen
       un poco; con el veneno siguen creciendo hasta media hoja. Los hilitos
       crecen desde la mancha hacia afuera (se trazan), y se apagan cuando no
       están: la sonda mira si se ven. */
    P.manchas.forEach(function (g, i) {
      var r = n >= 4 ? MANCHAS[i].r4 : n >= 3 ? R3 : R0;
      A.mover(g, 0, 0, 0, r / R0, entra(3) ? 300 : entra(4) ? 1600 : 0);
    });
    P.hilosCortos.forEach(function (h, i) {
      var d = entra(3) ? 200 + (i % 4) * 90 : 0;
      A.trazar(h, n >= 3, d); A.ver(h, n >= 3, d);
    });
    P.hilosLargos.forEach(function (h, i) {
      var d = entra(4) ? 1500 + (i % 4) * 90 : 0;
      A.trazar(h, n >= 4, d); A.ver(h, n >= 4, d);
    });

    /* Las etiquetas de los reinos: cada una en el paso en que se descubre. */
    P.etiquetas.forEach(function (g, i) { A.ver(g, n >= i + 1, entra(i + 1) ? (i === 0 ? 1200 : 2400) : 0); });

    /* El veneno: la bomba y sus gotas en el 4; en el 5, la bomba se achica
       y se va a la etiqueta del animal. */
    A.ver(P.rotuloVeneno, n === 4, 0);
    A.ver(P.bomba, n >= 4, 0);
    A.mover(P.bomba, n >= 5 ? -108 : 0, n >= 5 ? 185 : 0, 0, n >= 5 ? 0.55 : 1, entra(5) ? 300 : 0);
    P.gotas.forEach(function (q, i) {
      var d = entra(4) ? 300 + i * 45 : 0;
      A.ver(q.g, n === 4, d);
      A.mover(q.g, n >= 4 ? q.dx : 0, n >= 4 ? q.dy : 0, 0, 1, d);
    });
  }

  function marcador(n) {
    return [
      { cifra: '2', palabras: 'hojas comidas: ¿por lo mismo?' },
      { cifra: String(GRANOS_A.length), palabras: 'granitos de comida en cada hoja' },
      { cifra: String(VIEJAS.length + NUEVAS.length), palabras: 'mordidas del chapulín' },
      { cifra: String(MANCHAS.length), palabras: 'manchas, sin boca y sin patas' },
      { cifra: '½', palabras: 'de la hoja, perdida' },
      { cifra: '3', palabras: 'reinos distintos' },
      { cifra: '?', palabras: '¿qué plagas hay donde vives?' }
    ][n];
  }

  AnimacionMision.montar('#amVeneno', {
    vista: [ANCHO, ALTO],
    describe: 'Dos hojas de milpa, una encima de otra. A la de arriba se la come un chapulín a mordidas; a la de abajo, la de don Tulio, unas manchas de hongo que le meten hilitos. Llega el veneno para insectos: el chapulín se cae y las manchas siguen creciendo.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['☀️ ¿Qué tienen igual?', '🦗 ¿Y la de arriba?', '🍂 ¿Y la de don Tulio?', '🧴 Echarle el veneno', '🌳 ¿De qué reino son?', '💡 ¿Y tú?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
