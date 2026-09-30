/* ============================================================
   M.E.T.A.S · Desastres Naturales y el Huracán Mitch ·
   «Adónde se va el agua del aguacero»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Kenia:
   sobre su casa y sobre la del vecino cayó exactamente el mismo
   aguacero. La de ellos, a la orilla de la quebrada, se llenó de agua
   hasta la cintura y perdieron los colchones y los cuadernos; la del
   vecino, en la loma, amaneció mojada y nada más. La historia termina
   diciendo que lo que cambió fue dónde estaba cada casa, y que hay
   cosas que sí se pueden decidir antes de que llueva. El aparato
   (botones, frase, marcador) vive en js/animacion-mision.js; aquí solo
   está el dibujo y dónde va cada pieza en cada paso.

   Es un corte del terreno, visto de lado: a la izquierda la casa de
   Kenia, en lo bajo; en medio la quebrada; a la derecha la loma, con la
   casa del vecino arriba. Las dos casas están abiertas por delante, y
   adentro se ven los colchones y los cuadernos.

     0  las dos casas y la nube: ¿cuál se va a llenar de agua?;
     1  cae el mismo aguacero sobre las dos, gota por gota;
     2  el agua que cae en la loma no se queda arriba: corre cerro abajo
        hasta la quebrada, y la quebrada sube;
     3  la quebrada se sale y entra en la casa de Kenia hasta la
        cintura: los colchones y los cuadernos quedan debajo;
     4  al otro día la marca del agua queda a la cintura, y la casa de la
        loma está mojada y nada más: la lluvia fue la misma, lo que cambió
        fue dónde estaba cada casa;
     5  la casa no se muda en una noche, pero los colchones y los
        cuadernos sí se suben antes de que llueva: con la misma agua,
        quedan secos. Y la pregunta es del alumno: ¿qué subirías tú?

   Siete decisiones, y ninguna es de adorno:

   1. ⚠️ **Las dos casas son IGUALES: la misma casa, con lo mismo
      adentro, en dos lugares.** Si la de la loma fuera distinta, más
      grande o de otro material, el alumno podría pensar que se salvó por
      eso. Así lo único que cambia es dónde está cada una, que es lo que
      dice la historia. La sonda lo mide pieza por pieza.
   2. ⚠️ **La lluvia es la misma de verdad**: las gotas caen a la misma
      distancia en toda la escena, sobre la loma y sobre la orilla. La
      sonda mide que el paso sea parejo.
   3. **Lo que asombra es adónde se va el agua.** La que cae en la loma,
      en el techo del vecino y en el cerro, no se queda ahí: baja a la
      quebrada. Por eso con la misma lluvia la casa de abajo recibe
      mucha más agua que la de arriba. La flecha sale del alero del
      vecino y termina en la quebrada, pegada al cerro y siempre hacia
      abajo.
   4. ⚠️ **Lo que se pierde se cuenta en el dibujo.** Lo que queda debajo
      del agua lleva una ✗, y el marcador cuenta esas ✗. «Hasta la
      cintura» se mide: al otro día la marca del agua queda en la pared a
      la altura de la cintura de una persona parada junto a la casa.
   5. ⚠️ **Lo que pregunta la prueba no se dice.** Esta animación no
      nombra ni la amenaza, ni la vulnerabilidad, ni el riesgo, ni la
      prevención: son los pareados, y la tarjeta de abajo les pone el
      nombre. Tampoco dice «inundación», ni «crecida», ni «evacuar», ni
      «alerta», que son respuestas de la prueba. Y la prueba se cambió
      donde la historia ya contestaba: la pregunta de la loma, el aguacero
      que «siempre es un desastre», la casa a la orilla de la quebrada,
      las lluvias que hacen subir los ríos y, en pensamiento crítico, las
      dos comparaciones que decían «fue lo mismo; lo que cambió fue…».
   6. ⚠️ **Nadie se queda adentro con el agua.** La historia no dice
      dónde estaba la familia, y la animación no pone a nadie en el agua:
      la persona sale al otro día, cuando el agua ya bajó. Y lo que se
      decide al final no culpa a nadie: la casa no se muda en una noche;
      los colchones y los cuadernos, sí.
   7. **Nada se dice solo con color.** Lo perdido lleva ✗ y lo seco ✓,
      con un halo blanco que se lee encima del agua; la marca del agua es
      una raya con su nombre; cada casa, la quebrada y la loma llevan su
      rótulo. El terreno, el agua y las casas son como son: se quedan
      iguales en la pantalla clara y en la oscura.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amAguacero')) return;

  var ANCHO = 304, ALTO = 256, FIN = 5, INCLINA = 0.06;
  var A;

  /* ── El terreno ──
     A la izquierda, lo bajo donde está la casa de Kenia; la quebrada en
     su cauce; y la loma, que sube de la orilla derecha de la quebrada
     hasta arriba, donde está la casa del vecino. */
  var BAJO = 222;                          // el suelo de la orilla
  var CAUCE = { x0: 114, x1: 146, fondo: 246, b0: 120, b1: 140 };
  var LOMA = { x0: 146, x1: 206, y: 156 };  // de la orilla derecha a lo alto
  var CERRO = [[146, 222], [166, 222], [184, 156], [206, 156]];

  /* El agua de la quebrada, a tres alturas: en su cauce, subiendo sin
     salirse, y la que entra en la casa de Kenia hasta la cintura. */
  var NORMAL = 238, ALTA = 226, LLENA = 201;

  /* ── Las dos casas: la misma casa, en dos lugares ── */
  var W = 90, PARED = 44, TEJA = 22;
  var CASAS = { kenia: { x: 10, suelo: BAJO }, vecino: { x: 208, suelo: LOMA.y } };

  /* Lo de adentro, medido desde la esquina de abajo a la izquierda de la
     casa. Dos colchones (uno en el catre y otro en el suelo) y dos
     cuadernos parados sobre una tabla baja. */
  var COSAS = [
    { tipo: 'colchon',  i: 0, x: 5,    y: -15, w: 29, h: 7 },
    { tipo: 'colchon',  i: 1, x: 37,   y: -7,  w: 24, h: 7 },
    { tipo: 'cuaderno', i: 0, x: 65.5, y: -17, w: 8,  h: 11 },
    { tipo: 'cuaderno', i: 1, x: 76.5, y: -17, w: 8,  h: 11 }
  ];
  /* Adónde van en el último paso: arriba, sobre la repisa, antes de que
     llueva. La repisa tiene su tabla a 31 del suelo, lejos del agua. */
  var REPISA = -31;
  var ARRIBA = [
    { dx: 0,  dy: REPISA - (-15 + 7) },
    { dx: -1, dy: REPISA - (-7 + 7) },
    { dx: -1, dy: REPISA - (-17 + 11) },
    { dx: -1, dy: REPISA - (-17 + 11) }
  ];

  /* La persona que mide la marca al otro día: parada en el patio, entre
     la casa y la quebrada. Su cintura queda a la altura del agua. */
  var PERSONA_X = 107;

  var TEXTOS = [
    'Va a caer un aguacero sobre dos casas: la de Kenia, a la orilla de la quebrada, y la del vecino, en la loma. ¿Cuál se va a llenar de agua?',
    'Cae el mismo aguacero sobre las dos: las gotas caen igual de juntas en la loma y en la orilla.',
    'El agua que cae en la loma no se queda arriba: corre cerro abajo hasta la quebrada. Y la quebrada recibe el agua de todo el cerro.',
    'La quebrada se sale y el agua entra en la casa de Kenia hasta la cintura. Los colchones y los cuadernos quedan debajo.',
    'Amaneció: la marca del agua quedó a la cintura, y la casa de la loma, mojada y nada más. Lo que cambió fue dónde estaba cada casa.',
    'La casa no se muda en una noche. Los colchones y los cuadernos, sí: arriba, el agua no los alcanza. ¿Qué subirías tú antes de que llueva?'
  ];

  function r2(v) { return Math.round(v * 100) / 100; }

  /* El cerro es una curva: para saber a qué altura queda en una x se
     busca su punto por mitades. Lo usan las gotas (dónde terminan) y el
     agua (hasta dónde llega). */
  function bez(t, k) {
    var u = 1 - t;
    return u * u * u * CERRO[0][k] + 3 * u * u * t * CERRO[1][k] + 3 * u * t * t * CERRO[2][k] + t * t * t * CERRO[3][k];
  }
  function tDeX(x) {
    var a = 0, b = 1;
    for (var i = 0; i < 40; i++) { var m = (a + b) / 2; if (bez(m, 0) < x) a = m; else b = m; }
    return (a + b) / 2;
  }
  function tDeY(y) {
    var a = 0, b = 1;
    for (var i = 0; i < 40; i++) { var m = (a + b) / 2; if (bez(m, 1) > y) a = m; else b = m; }
    return (a + b) / 2;
  }
  /* Dónde está la superficie en una x: el techo si hay casa, el agua de la
     quebrada en su cauce, y si no, el suelo. */
  function techo(c, x) {
    var x0 = c.x - 5, xm = c.x + W / 2, x1 = c.x + W + 5, alero = c.suelo - PARED + 2, cumbre = alero - TEJA;
    if (x < x0 || x > x1) return null;
    return x <= xm ? alero + (x - x0) * (cumbre - alero) / (xm - x0) : cumbre + (x - xm) * (alero - cumbre) / (x1 - xm);
  }
  function superficie(x) {
    for (var k in CASAS) { var t = techo(CASAS[k], x); if (t != null) return t; }
    if (x > CAUCE.x0 && x < CAUCE.x1) return NORMAL;
    if (x <= CAUCE.x0) return BAJO;
    if (x < LOMA.x1) return bez(tDeX(x), 1);
    return LOMA.y;
  }

  var nube, letraNube, lluvia, sol, agua, flecha = {}, repisa, lodo = {}, persona, rotuloCintura, mojada;
  var cosas = [], marcas = [];

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una X y una palomita con halo blanco: se leen encima del agua, de la
     pared y del colchón, en las dos pantallas. */
  function marca(padre, tipo, de, cx, cy, r) {
    var el = A.el;
    var g = el('g', { class: 'am-fuera', 'data-marca': tipo, 'data-de': de, 'data-cx': cx, 'data-cy': cy }, padre);
    var d = tipo === 'x'
      ? 'M ' + r2(cx - r) + ' ' + r2(cy - r) + ' L ' + r2(cx + r) + ' ' + r2(cy + r) + ' M ' + r2(cx + r) + ' ' + r2(cy - r) + ' L ' + r2(cx - r) + ' ' + r2(cy + r)
      : 'M ' + r2(cx - r) + ' ' + r2(cy) + ' L ' + r2(cx - r * 0.3) + ' ' + r2(cy + r * 0.75) + ' L ' + r2(cx + r) + ' ' + r2(cy - r * 0.8);
    el('path', { class: 'ag-halo', d: d }, g);
    el('path', { class: tipo === 'x' ? 'ag-mal' : 'ag-bien', d: d }, g);
    return g;
  }

  /* La casa en dos capas: la pared de atrás y lo de adentro van detrás del
     agua (el agua los tapa a medias, como se ve en el agua turbia), y los
     muros, el piso y el tejado van delante. */
  function casaFondo(padre, k) {
    var el = A.el, c = CASAS[k];
    var g = el('g', { 'data-casa-fondo': k }, padre);
    el('rect', { class: 'ag-pared-fondo', 'data-fondo': k, x: c.x + 3, y: c.suelo - PARED, width: W - 6, height: PARED }, g);
    if (k === 'kenia') {
      /* La mancha y la marca del agua, que salen al otro día. */
      lodo.mancha = el('rect', { class: 'ag-mancha am-fuera', 'data-mancha': '', x: c.x + 3, y: LLENA, width: W - 6, height: c.suelo - LLENA }, g);
      lodo.raya = el('rect', { class: 'ag-lodo am-fuera', 'data-marca-agua': '', x: c.x + 3, y: LLENA - 0.9, width: W - 6, height: 1.8 }, g);
      /* La repisa del último paso, pegada a los muros. */
      repisa = el('g', { class: 'am-fuera', 'data-repisa': '' }, g);
      el('rect', { class: 'ag-madera', 'data-tabla': '', x: c.x + 4, y: c.suelo + REPISA, width: W - 8, height: 2 }, repisa);
      el('path', { class: 'ag-madera', d: 'M ' + (c.x + 3) + ' ' + (c.suelo + REPISA + 2) + ' l 5 0 l -5 5 z' }, repisa);
      el('path', { class: 'ag-madera', d: 'M ' + (c.x + W - 3) + ' ' + (c.suelo + REPISA + 2) + ' l -5 0 l 5 5 z' }, repisa);
    }
    /* El catre y la tabla se quedan donde están; lo que se sube es lo que
       se puede cargar. */
    el('rect', { class: 'ag-madera', x: c.x + 6, y: c.suelo - 7, width: 2, height: 7 }, g);
    el('rect', { class: 'ag-madera', x: c.x + 31, y: c.suelo - 7, width: 2, height: 7 }, g);
    el('rect', { class: 'ag-madera', x: c.x + 5, y: c.suelo - 8, width: 29, height: 1.6 }, g);
    el('rect', { class: 'ag-madera', x: c.x + 64, y: c.suelo - 6, width: 22, height: 1.8 }, g);
    el('rect', { class: 'ag-madera', x: c.x + 65, y: c.suelo - 4.2, width: 3, height: 4.2 }, g);
    el('rect', { class: 'ag-madera', x: c.x + 82, y: c.suelo - 4.2, width: 3, height: 4.2 }, g);
    COSAS.forEach(function (q) {
      var x = c.x + q.x, y = c.suelo + q.y;
      var cosa = el('g', { 'data-cosa': k + '-' + q.tipo + '-' + q.i, 'data-casa': k, 'data-tipo': q.tipo }, g);
      if (q.tipo === 'colchon') {
        el('rect', { class: 'ag-colchon', 'data-cuerpo': '', x: x, y: y, width: q.w, height: q.h, rx: 2.5 }, cosa);
        el('line', { class: 'ag-raya-colchon', x1: x + 11, y1: y + 1.2, x2: x + 11, y2: y + q.h - 1.2 }, cosa);
        el('line', { class: 'ag-raya-colchon', x1: x + q.w - 7, y1: y + 1.2, x2: x + q.w - 7, y2: y + q.h - 1.2 }, cosa);
        el('rect', { class: 'ag-almohada', x: x + 2, y: y + 1.2, width: 6.5, height: q.h - 2.4, rx: 1.8 }, cosa);
      } else {
        el('rect', { class: 'ag-cuaderno-' + (q.i + 1), 'data-cuerpo': '', x: x, y: y, width: q.w, height: q.h, rx: 0.8 }, cosa);
        el('rect', { class: 'ag-lomo', x: x + 0.6, y: y, width: 1.1, height: q.h }, cosa);
        el('rect', { class: 'ag-etiqueta', x: x + 2.6, y: y + 2.4, width: 4, height: 2.6, rx: 0.5 }, cosa);
      }
      cosas.push({ k: k, q: q, g: cosa, cx: x + q.w / 2, cy: y + q.h / 2 });
    });
    return g;
  }

  function casaFrente(padre, k) {
    var el = A.el, c = CASAS[k];
    var g = el('g', { 'data-casa': k }, padre);
    var muros = el('g', { 'data-muros': k }, g);
    el('rect', { class: 'ag-muro', x: c.x, y: c.suelo - PARED, width: 3, height: PARED }, muros);
    el('rect', { class: 'ag-muro', x: c.x + W - 3, y: c.suelo - PARED, width: 3, height: PARED }, muros);
    el('line', { class: 'ag-piso', 'data-piso': k, x1: c.x, y1: c.suelo, x2: c.x + W, y2: c.suelo }, g);
    var alero = c.suelo - PARED + 2;
    el('path', { class: 'ag-tejado', 'data-tejado': k,
      d: 'M ' + (c.x - 5) + ' ' + alero + ' L ' + (c.x + W / 2) + ' ' + (alero - TEJA) + ' L ' + (c.x + W + 5) + ' ' + alero + ' Z' }, g);
    return g;
  }

  /* La flecha del agua que baja: sale del alero del vecino, baja por la
     pared, corre pegada al cerro y termina en la quebrada. */
  function escurre(padre) {
    var el = A.el, c = CASAS.vecino;
    var alero = c.suelo - PARED + 2, ex = c.x - 5;
    var fin = [137, 234], antes = [146, 218];
    var d = 'M ' + ex + ' ' + (alero + 2) + ' L ' + (LOMA.x1) + ' ' + (LOMA.y - 4) +
      ' C ' + CERRO[2][0] + ' ' + (CERRO[2][1] - 4) + ' ' + CERRO[1][0] + ' ' + (CERRO[1][1] - 4) + ' ' + antes[0] + ' ' + antes[1] +
      ' L ' + fin[0] + ' ' + fin[1];
    var g = el('g', { 'data-escurre': '' }, padre);
    /* La raya acaba donde empieza la punta: si no, asoma por delante. */
    var ux = fin[0] - antes[0], uy = fin[1] - antes[1], lu = Math.sqrt(ux * ux + uy * uy);
    ux /= lu; uy /= lu;
    var bx = fin[0] - ux * 5, by = fin[1] - uy * 5, px = -uy * 3, py = ux * 3;
    flecha.raya = el('path', { class: 'ag-flecha', 'data-raya': '', d: d.replace(/L 137 234$/, 'L ' + r2(fin[0] - ux * 3.5) + ' ' + r2(fin[1] - uy * 3.5)) }, g);
    flecha.punta = el('path', { class: 'ag-punta am-fuera', 'data-punta': '',
      d: 'M ' + r2(bx + px) + ' ' + r2(by + py) + ' L ' + fin[0] + ' ' + fin[1] + ' L ' + r2(bx - px) + ' ' + r2(by - py) + ' Z' }, g);
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El cielo: la nube de las dos casas y el sol del otro día ── */
    sol = el('g', { class: 'am-fuera', 'data-sol': '' }, svg);
    for (var r = 0; r < 8; r++) {
      var a = r * Math.PI / 4;
      el('line', { class: 'ag-rayo', x1: r2(40 + Math.cos(a) * 12.5), y1: r2(24 + Math.sin(a) * 12.5), x2: r2(40 + Math.cos(a) * 16.5), y2: r2(24 + Math.sin(a) * 16.5) }, sol);
    }
    el('circle', { class: 'ag-sol', cx: 40, cy: 24, r: 9.5 }, sol);

    /* Una sola nube larga, encima de las dos casas: el aguacero es uno. */
    nube = el('g', { 'data-nube': '' }, svg);
    [[30, 25, 12], [60, 17, 16], [96, 21, 13], [130, 13, 17], [166, 19, 15], [202, 13, 17], [238, 20, 14], [270, 17, 15], [292, 26, 10]]
      .forEach(function (b) { el('circle', { class: 'ag-nube', cx: b[0], cy: b[1], r: b[2] }, nube); });
    el('rect', { class: 'ag-nube', x: 4, y: 24, width: 296, height: 18, rx: 9 }, nube);
    el('rect', { class: 'ag-nube-baja', x: 4, y: 33, width: 296, height: 9, rx: 4.5 }, nube);
    letraNube = texto(nube, { class: 'ag-letra-nube am-fuera', 'data-rotulo': 'aguacero', x: 152, y: 34, 'font-size': 11, 'text-anchor': 'middle' }, 'el mismo aguacero');

    /* ── La lluvia: las mismas gotas, a la misma distancia, en toda la
       escena. Cada columna termina justo encima de lo que tiene debajo. */
    /* ⚠️ Sin .am-capa, a propósito: la capa se enciende sin demora, y en el
       último paso la lluvia tiene que empezar DESPUÉS de que subieron los
       colchones y los cuadernos. Con la capa, llovía mientras los subían,
       que es contar al revés «antes de que llueva». */
    lluvia = el('g', { class: 'am-fuera', 'data-lluvia': '' }, svg);
    for (var x = 9; x <= ANCHO; x += 14) {
      /* La gota cae un poco inclinada, así que termina más a la izquierda de
         donde empezó: se busca dónde toca, dando unas vueltas. */
      var y1 = 200;
      for (var v = 0; v < 4; v++) y1 = superficie(x - (y1 - 46) * INCLINA) - 3.5;
      el('line', { class: 'ag-gota', 'data-gota': '', x1: x, y1: 46, x2: r2(x - (y1 - 46) * INCLINA), y2: r2(y1) }, lluvia);
    }

    /* ── Lo de atrás de las casas, y lo de adentro ── */
    casaFondo(svg, 'kenia');
    casaFondo(svg, 'vecino');

    /* ── El agua: una sola pieza que sube y baja. Va detrás del terreno,
       así que en su cauce solo se ve en la quebrada; cuando se sale, tapa
       la orilla y entra en la casa de Kenia. Llega por la derecha hasta
       donde el cerro sube a su altura, ni un paso más. */
    var xh = r2(bez(tDeY(LLENA), 0));
    agua = el('g', { 'data-agua': '', 'data-xh': xh }, svg);
    el('rect', { class: 'ag-agua', 'data-agua-cuerpo': '', x: -6, y: LLENA, width: xh + 6, height: ALTO - LLENA + 60 }, agua);
    el('line', { class: 'ag-agua-borde', x1: -6, y1: LLENA, x2: xh, y2: LLENA }, agua);

    /* ── El terreno, con el cauce de la quebrada ── */
    el('path', { class: 'ag-tierra', 'data-terreno': '',
      d: 'M -6 ' + BAJO + ' L ' + CAUCE.x0 + ' ' + BAJO + ' L ' + CAUCE.b0 + ' ' + CAUCE.fondo + ' L ' + CAUCE.b1 + ' ' + CAUCE.fondo +
        ' L ' + CAUCE.x1 + ' ' + BAJO + ' C ' + CERRO[1].join(' ') + ' ' + CERRO[2].join(' ') + ' ' + CERRO[3].join(' ') +
        ' L ' + (ANCHO + 6) + ' ' + LOMA.y + ' L ' + (ANCHO + 6) + ' ' + (ALTO + 6) + ' L -6 ' + (ALTO + 6) + ' Z' }, svg);
    el('path', { class: 'ag-cauce', 'data-cauce': '',
      d: 'M ' + CAUCE.x0 + ' ' + BAJO + ' L ' + CAUCE.b0 + ' ' + CAUCE.fondo + ' L ' + CAUCE.b1 + ' ' + CAUCE.fondo + ' L ' + CAUCE.x1 + ' ' + BAJO }, svg);
    el('path', { class: 'ag-pasto', d: 'M -6 ' + BAJO + ' L ' + CAUCE.x0 + ' ' + BAJO }, svg);
    el('path', { class: 'ag-pasto', d: 'M ' + CAUCE.x1 + ' ' + BAJO + ' C ' + CERRO[1].join(' ') + ' ' + CERRO[2].join(' ') + ' ' + CERRO[3].join(' ') + ' L ' + (ANCHO + 6) + ' ' + LOMA.y }, svg);

    /* ── Lo de delante de las casas ── */
    casaFrente(svg, 'kenia');
    casaFrente(svg, 'vecino');

    /* El techo del vecino, mojado al otro día: unas gotas que escurren del
       alero. Mojada y nada más. */
    var cv = CASAS.vecino, alv = cv.suelo - PARED + 2;
    mojada = el('g', { class: 'am-fuera', 'data-mojada': '' }, svg);
    [[cv.x - 3, alv + 5], [cv.x + W + 3, alv + 5], [cv.x + 16, alv - 5], [cv.x + 38, alv - 15], [cv.x + 66, alv - 9]].forEach(function (p) {
      el('path', { class: 'ag-gotita', 'data-gotita': '',
        d: 'M ' + r2(p[0]) + ' ' + r2(p[1] - 5) + ' Q ' + r2(p[0] + 3.6) + ' ' + r2(p[1] + 0.6) + ' ' + r2(p[0]) + ' ' + r2(p[1] + 2.4) +
          ' Q ' + r2(p[0] - 3.6) + ' ' + r2(p[1] + 0.6) + ' ' + r2(p[0]) + ' ' + r2(p[1] - 5) + ' Z' }, mojada);
    });

    escurre(svg);

    /* ── La persona que mide la marca, al otro día ── */
    var s = CASAS.kenia.suelo;
    persona = el('g', { class: 'am-fuera', 'data-persona': '' }, svg);
    el('circle', { class: 'ag-persona', cx: PERSONA_X, cy: s - 30.5, r: 3.2 }, persona);
    el('path', { class: 'ag-persona', d: 'M ' + (PERSONA_X - 3.6) + ' ' + (s - 27) + ' L ' + (PERSONA_X + 3.6) + ' ' + (s - 27) +
      ' L ' + (PERSONA_X + 3) + ' ' + (s - 18.5) + ' L ' + (PERSONA_X - 3) + ' ' + (s - 18.5) + ' Z' }, persona);
    el('path', { class: 'ag-persona', d: 'M ' + (PERSONA_X - 2.8) + ' ' + (s - 18.6) + ' L ' + (PERSONA_X - 1.1) + ' ' + (s - 18.6) +
      ' L ' + (PERSONA_X - 1) + ' ' + s + ' L ' + (PERSONA_X - 2.9) + ' ' + s + ' Z' }, persona);
    el('path', { class: 'ag-persona', d: 'M ' + (PERSONA_X + 1.1) + ' ' + (s - 18.6) + ' L ' + (PERSONA_X + 2.8) + ' ' + (s - 18.6) +
      ' L ' + (PERSONA_X + 2.9) + ' ' + s + ' L ' + (PERSONA_X + 1) + ' ' + s + ' Z' }, persona);
    el('rect', { class: 'ag-cinturon', 'data-cintura': '', x: PERSONA_X - 3.3, y: LLENA - 0.9, width: 6.6, height: 1.8 }, persona);
    rotuloCintura = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'cintura', x: PERSONA_X + 8, y: LLENA + 3, 'font-size': 8.5 }, 'cintura');
    lodo.rotulo = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'marca', x: CASAS.kenia.x + W / 2, y: LLENA - 4.5, 'font-size': 8.5, 'text-anchor': 'middle' }, 'la marca del agua');

    /* ── Las marcas: una ✗ o una ✓ por cada cosa, encima de todo ── */
    var capa = el('g', { 'data-marcas': '' }, svg);
    cosas.forEach(function (c) {
      var de = c.k + '-' + c.q.tipo + '-' + c.q.i, r = c.q.tipo === 'colchon' ? 3 : 2.8;
      marcas.push({ c: c, x: marca(capa, 'x', de, c.cx, c.cy, r), v: marca(capa, 'v', de, c.cx, c.cy, r) });
    });

    /* ── Los rótulos ── */
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'kenia', x: CASAS.kenia.x + W / 2, y: BAJO + 17, 'font-size': 10, 'text-anchor': 'middle' }, 'Kenia');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'vecino', x: CASAS.vecino.x + W / 2, y: LOMA.y + 17, 'font-size': 10, 'text-anchor': 'middle' }, 'el vecino');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'quebrada', x: (CAUCE.x0 + CAUCE.x1) / 2, y: ALTO - 3, 'font-size': 9, 'text-anchor': 'middle' }, 'la quebrada');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'loma', x: 190, y: 205, 'font-size': 9.5, 'text-anchor': 'middle' }, 'la loma');
  }

  function pintar(n, antes) {
    var llueve = n >= 1 && n !== 4;
    var atras = antes > n;
    /* ¿Hasta dónde sube el agua? */
    var nivel = n === 3 || n === FIN ? LLENA : n === 2 ? ALTA : NORMAL;
    var dAgua = 0;
    if (!atras) dAgua = n === 2 ? 700 : n === 4 ? 200 : n === FIN ? 1700 : 0;
    A.mover(agua, 0, nivel - LLENA, 0, 1, dAgua);

    A.ver(nube, n !== 4, n !== 4 && !atras && n === FIN ? 1000 : 0);
    A.ver(lluvia, llueve, llueve && !atras ? (n === FIN ? 1100 : 0) : 0);
    A.ver(letraNube, llueve, llueve && !atras ? (n === FIN ? 1300 : 200) : 0);
    A.ver(sol, n === 4, n === 4 ? (atras ? 300 : 400) : 0);

    /* La flecha del agua que baja: en los pasos en que llueve fuerte. */
    var baja = n === 2 || n === 3 || n === FIN;
    var dF = baja && !atras ? (n === FIN ? 1300 : n === 2 ? 0 : 0) : 0;
    A.trazar(flecha.raya, baja, dF);
    A.ver(flecha.punta, baja, baja ? dF + (atras ? 0 : 800) : 0);

    /* La marca del agua, la persona y el techo mojado: al otro día. */
    var dia = n === 4;
    A.ver(lodo.mancha, dia, dia ? (atras ? 800 : 1000) : 0);
    A.ver(lodo.raya, dia, dia ? (atras ? 800 : 1000) : 0);
    A.ver(lodo.rotulo, dia, dia ? (atras ? 900 : 1100) : 0);
    A.ver(persona, dia, dia ? (atras ? 900 : 1200) : 0);
    A.ver(rotuloCintura, dia, dia ? (atras ? 1000 : 1300) : 0);
    A.ver(mojada, dia, dia ? (atras ? 500 : 1300) : 0);

    /* La repisa y lo que se sube, en el último paso. */
    A.ver(repisa, n === FIN, n === FIN ? 200 : (atras && antes === FIN ? 600 : 0));
    var j = 0;
    cosas.forEach(function (c, idx) {
      var sube = n === FIN && c.k === 'kenia';
      var p = ARRIBA[COSAS.indexOf(c.q)];
      var dm = sube ? 500 + j * 120 : 0;
      if (c.k === 'kenia') j++;
      A.mover(c.g, sube ? p.dx : 0, sube ? p.dy : 0, 0, 1, dm);
      var m = marcas[idx];
      A.mover(m.x, sube ? p.dx : 0, sube ? p.dy : 0, 0, 1, dm);
      A.mover(m.v, sube ? p.dx : 0, sube ? p.dy : 0, 0, 1, dm);
      /* ✗ lo que el agua alcanzó; ✓ lo que quedó seco cuando ya se ve
         cómo terminó. */
      var mal = c.k === 'kenia' && (n === 3 || n === 4);
      var bien = (c.k === 'vecino' && (n === 4 || n === FIN)) || (c.k === 'kenia' && n === FIN);
      var dMal = 0, dBien = 0;
      if (mal) dMal = n === 3 ? (atras ? 0 : 900 + j * 120) : (atras ? 900 : 0);
      if (bien) dBien = c.k === 'kenia' ? 2600 + j * 100 : (n === 4 && !atras ? 1400 + idx * 60 : 0);
      A.ver(m.x, mal, dMal);
      A.ver(m.v, bien, dBien);
    });
  }

  function marcador(n) {
    if (n === 0) return { cifra: '?', palabras: 'cuál casa se va a llenar de agua' };
    if (n === 1) return { cifra: '=', palabras: 'la misma lluvia en las dos casas' };
    if (n === 2) return { cifra: '↓', palabras: 'el agua de la loma baja a la quebrada' };
    if (n === 3) return { cifra: '4', palabras: 'colchones y cuadernos bajo el agua' };
    if (n === 4) return { cifra: '4 y 0', palabras: 'perdidos: abajo y en la loma' };
    return { cifra: '0', palabras: 'perdidos, con la misma agua' };
  }

  AnimacionMision.montar('#amAguacero', {
    vista: [ANCHO, ALTO],
    describe: 'Un corte del terreno: a la izquierda, la casa de Kenia a la orilla de la quebrada; a la derecha, la misma casa arriba de la loma, la del vecino; encima, una nube sobre las dos.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🌧️ Que llueva', '💧 ¿Y el agua?', '🌊 ¿Qué pasa abajo?', '🌅 Al otro día', '💡 ¿Qué se decide?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
