/* ============================================================
   M.E.T.A.S · El Sistema Respiratorio y Circulatorio · «La cuesta de la pila»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Marvin: lo
   mandaron por agua, cuesta arriba, con sus baldes, y llegó sin poder
   hablar, con el corazón golpeándole y respirando como si hubiera corrido.
   La historia dice que a sus piernas les faltaba oxígeno, y que el oxígeno
   no se lo llevan hasta allá los pulmones: se lo lleva la sangre. El
   aparato (botones, frase, marcador) vive en js/animacion-mision.js; aquí
   solo está el dibujo y dónde va cada pieza en cada paso.

   A la izquierda, afuera, el aire, con el oxígeno en bolitas. Al lado,
   Marvin de frente con sus baldes, y por dentro sus pulmones, su corazón y
   el camino de la sangre: de ida, de los pulmones al corazón y del corazón
   a las piernas; de vuelta, de las piernas al corazón y del corazón a los
   pulmones. A la derecha, dos relojes de aguja, «respira» y «el corazón»,
   de despacio a rápido.

     0  las piernas gastan oxígeno, y el oxígeno está afuera, en el aire.
        ¿Cómo les llega?;
     1  al respirar, el oxígeno entra por la boca y llega a los pulmones;
        pero las piernas están lejos de ahí;
     2  la sangre pasa por los pulmones y se lo lleva; el corazón la empuja
        hasta las piernas;
     3  allá se gasta, y la sangre vuelve por más. Sentado, alcanza con
        respirar despacio y un corazón tranquilo;
     4  cuesta arriba las piernas gastan más: entra más oxígeno, llega más a
        las piernas, y las dos agujas se van a «rápido»;
     5  por eso llegó sin aire y con el corazón golpeando. Y la pregunta es
        del alumno: contar sus respiraciones sentado, y después de subir
        unas gradas.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Cada bolita hace el viaje entero, tramo por tramo**: del aire a
      la boca, de la boca a un pulmón, del pulmón al corazón y del corazón
      a una pierna. Va en cuatro envolturas, una por tramo, y cada una
      espera a que acabe la de fuera (una pieza tiene una sola demora). La
      sonda sigue los cuatro tramos y comprueba dónde acaba cada uno.
   2. ⚠️ **La sangre pasa por el corazón en los dos sentidos.** De vuelta,
      la de las piernas llega al corazón y de ahí a los pulmones. Dibujarla
      subiendo derecho de las piernas a los pulmones enseñaría un camino
      que no existe, y la prueba pregunta justo eso: qué vasos salen del
      corazón y cuáles regresan a él.
   3. ⚠️ **Cuesta arriba llegan más bolitas, y las agujas lo dicen sin
      números.** Cuántas veces se respira en un minuto lo cuenta el alumno:
      es la actividad con que termina la historia, y un número escrito aquí
      se la daría hecha.
   4. ⚠️ **Lo que pregunta la prueba no se dice**: ni el nombre de un tramo
      del camino del aire, ni de un vaso, ni de una parte de la sangre, ni
      «pecho», ni «pulso». Y la sangre no trae nada de vuelta en el dibujo:
      qué es lo que se suelta con el aire lo pregunta el examen. La prueba
      se cambió donde la historia o esta animación ya contestaban.
   5. **Nada se dice solo con color**: el oxígeno son bolitas que se
      cuentan, cada camino lleva sus flechas, y las agujas dicen «despacio»
      o «rápido» con su posición.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCuesta')) return;

  var ANCHO = 320, ALTO = 240, FIN = 5;
  var BOCA = [74, 35], CORAZON = [80, 126];
  /* Por dónde sale cada bolita de su pulmón, y dónde se queda en su pierna. */
  var PULMON = { izq: [66, 100], der: [82, 100] };
  var PIERNA = { izq: [[64, 184], [67.6, 170]], der: [[83.7, 184], [82.8, 170]] };
  /* Los dos relojes: su centro y adónde apunta la aguja (girada desde
     arriba: a la izquierda es despacio, a la derecha, rápido). */
  var RELOJ = { respira: [252, 94], corazon: [252, 174] }, RADIO = 28;
  var DESPACIO = -60, RAPIDO = 60;

  /* Las bolitas: de dónde salen en el aire, a qué pulmón van y en qué
     lugar de qué pierna se quedan. Las del paso 1 son dos; las de cuesta
     arriba, cuatro. */
  var SENTADO = [[[16, 28], 'izq', 0], [[30, 36], 'der', 0]];
  var CUESTA = [[[12, 36], 'izq', 1], [[24, 22], 'der', 1], [[36, 28], 'izq', 0], [[26, 40], 'der', 0]];

  var TEXTOS = [
    'Para caminar, las piernas de Marvin gastan oxígeno. Y el oxígeno está afuera, en el aire. ¿Cómo les llega hasta allá?',
    'Al respirar, el oxígeno entra por la boca y llega a los pulmones. Pero las piernas están lejos de los pulmones.',
    'La sangre pasa por los pulmones y se lo lleva. El corazón la empuja hasta las piernas.',
    'Allá se gasta, y la sangre vuelve por más. Sentado, alcanza con respirar despacio y con un corazón tranquilo.',
    'Cuesta arriba, las piernas gastan más. Para que les llegue, se respira más rápido y el corazón late más rápido.',
    'Por eso Marvin llegó sin aire y con el corazón golpeando. Cuenta tus respiraciones sentado, y otra vez después de subir unas gradas.'
  ];

  var A;
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  /* Una flecha pequeña a media raya (del primer tramo, si la raya tiene
     varios), apuntando hacia donde va la sangre. */
  function flecha(padre, a, b, clase) {
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    var L = 5.6, W = 3.6;
    function p(dx, dy) { return [mx + dx * Math.cos(ang) - dy * Math.sin(ang), my + dx * Math.sin(ang) + dy * Math.cos(ang)]; }
    var q = [p(L / 2, 0), p(-L / 2, -W), p(-L / 2, W)];
    A.el('path', { class: clase, d: 'M ' + q.map(function (v) { return v[0].toFixed(2) + ' ' + v[1].toFixed(2); }).join(' L ') + ' Z' }, padre);
  }
  /* Un camino de la sangre: la raya pasa por los puntos en orden, de
     donde sale a donde llega. */
  function vaso(padre, pts, cual, clase, flechaClase) {
    var g = A.el('g', { 'data-vaso': cual }, padre);
    A.el('path', { class: clase, 'data-raya': '', d: 'M ' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L ') }, g);
    flecha(g, pts[0], pts[1], flechaClase);
    return g;
  }

  var P = {};

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El aire, afuera ── */
    el('ellipse', { class: 'rc-aire', 'data-aire': '', cx: 24, cy: 31, rx: 21, ry: 16 }, svg);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'aire', x: 24, y: 60, 'font-size': 10, 'text-anchor': 'middle' }, 'aire');
    /* Lo que es cada bolita, escrito: nada se dice solo con color. */
    el('circle', { class: 'rc-oxi', cx: 8, cy: 229, r: 3.6 }, svg);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'oxigeno', x: 15, y: 232.5, 'font-size': 9.5 }, 'oxígeno');

    /* ── Marvin, de frente, con sus baldes ── */
    el('rect', { class: 'rc-pierna', 'data-pierna': 'izq', x: 56, y: 150, width: 16, height: 62 }, svg);
    el('rect', { class: 'rc-pierna', 'data-pierna': 'der', x: 76, y: 150, width: 16, height: 62 }, svg);
    el('ellipse', { class: 'rc-zapato', cx: 63, cy: 214, rx: 10, ry: 3.6 }, svg);
    el('ellipse', { class: 'rc-zapato', cx: 85, cy: 214, rx: 10, ry: 3.6 }, svg);
    el('path', { class: 'rc-brazo', d: 'M 45 58 L 30 128' }, svg);
    el('path', { class: 'rc-brazo', d: 'M 103 58 L 118 128' }, svg);
    [[21, 'izq'], [109, 'der']].forEach(function (b) {
      var x = b[0];
      el('path', { class: 'rc-asa', d: 'M ' + (x + 1) + ' 131 Q ' + (x + 9) + ' 119 ' + (x + 17) + ' 131' }, svg);
      el('path', { class: 'rc-balde', 'data-balde': b[1], d: 'M ' + x + ' 131 L ' + (x + 18) + ' 131 L ' + (x + 16) + ' 150 L ' + (x + 2) + ' 150 Z' }, svg);
      el('path', { class: 'rc-agua', d: 'M ' + (x + 0.9) + ' 135 L ' + (x + 17.1) + ' 135 L ' + (x + 15.8) + ' 149 L ' + (x + 2.2) + ' 149 Z' }, svg);
    });
    el('path', { class: 'rc-camisa', 'data-marvin': '', d: 'M 44 52 Q 74 44 104 52 L 108 150 L 40 150 Z' }, svg);
    el('rect', { class: 'rc-piel', x: 68, y: 40, width: 12, height: 10 }, svg);
    el('circle', { class: 'rc-piel', 'data-cabeza': '', cx: 74, cy: 26, r: 16 }, svg);
    el('path', { class: 'rc-pelo', d: 'M 58 25 Q 57 8 74 8 Q 91 8 90 25 Q 85 15 74 15 Q 63 15 58 25 Z' }, svg);
    el('circle', { class: 'rc-ojo', cx: 68, cy: 25, r: 1.7 }, svg);
    el('circle', { class: 'rc-ojo', cx: 80, cy: 25, r: 1.7 }, svg);
    /* La boca, abierta: viene jadeando. */
    el('ellipse', { class: 'rc-boca', 'data-boca': '', cx: BOCA[0], cy: BOCA[1], rx: 3.6, ry: 2.7 }, svg);

    /* Por dentro: por dónde baja el aire, los pulmones y el corazón. */
    el('path', { class: 'rc-via', d: 'M 74 39 L 74 62 M 74 62 L 65 71 M 74 62 L 83 71' }, svg);
    el('ellipse', { class: 'rc-pulmon', 'data-pulmon': 'izq', cx: 59, cy: 86, rx: 13.5, ry: 22 }, svg);
    el('ellipse', { class: 'rc-pulmon', 'data-pulmon': 'der', cx: 89, cy: 86, rx: 13.5, ry: 22 }, svg);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'pulmones', x: 132, y: 82, 'font-size': 10 }, 'pulmones');
    el('line', { class: 'rc-hilo', 'data-hilo': 'pulmones', x1: 130, y1: 79, x2: 98, y2: 84 }, svg);

    /* El camino de la sangre. La ida (de los pulmones al corazón, y del
       corazón a las piernas) va con su color y sus flechas; la vuelta, al
       lado, con el suyo y sus flechas hacia el otro lado. Cada raya se
       dibuja de donde sale a donde llega, y la flecha apunta hacia allá. */
    P.vasos = el('g', { 'data-vasos': '' }, svg);
    /* La vuelta de las piernas sube por la orilla de afuera de cada una:
       por el medio tapaba las bolitas que llegan. */
    vaso(P.vasos, [[71, 120], [58, 100]], 'vuelta-pulmon-izq', 'rc-vuelta', 'rc-punta-vuelta');
    vaso(P.vasos, [[89, 120], [92, 102]], 'vuelta-pulmon-der', 'rc-vuelta', 'rc-punta-vuelta');
    vaso(P.vasos, [[57.5, 198], [57.5, 152], [73, 128]], 'vuelta-pierna-izq', 'rc-vuelta', 'rc-punta-vuelta');
    vaso(P.vasos, [[90.5, 198], [90.5, 152], [87, 128]], 'vuelta-pierna-der', 'rc-vuelta', 'rc-punta-vuelta');
    vaso(P.vasos, [PULMON.izq, [75, 117]], 'ida-pulmon-izq', 'rc-ida', 'rc-punta-ida');
    vaso(P.vasos, [PULMON.der, [81, 117]], 'ida-pulmon-der', 'rc-ida', 'rc-punta-ida');
    vaso(P.vasos, [[77, 133], [63, 188]], 'ida-pierna-izq', 'rc-ida', 'rc-punta-ida');
    vaso(P.vasos, [[80.5, 134], [84, 188]], 'ida-pierna-der', 'rc-ida', 'rc-punta-ida');
    el('path', { class: 'rc-corazon', 'data-corazon': '', d: 'M 80 135 C 68 127 69 117 75 117 C 78 117 79.5 119 80 121 C 80.5 119 82 117 85 117 C 91 117 92 127 80 135 Z' }, svg);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'corazon', x: 132, y: 114, 'font-size': 10 }, 'corazón');
    el('line', { class: 'rc-hilo', 'data-hilo': 'corazon', x1: 130, y1: 111, x2: 88, y2: 124 }, svg);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'piernas', x: 132, y: 182, 'font-size': 10 }, 'piernas');
    el('line', { class: 'rc-hilo', 'data-hilo': 'piernas', x1: 130, y1: 179, x2: 90, y2: 178 }, svg);

    /* ── Los dos relojes: respira y el corazón, de despacio a rápido ── */
    P.relojes = el('g', { class: 'am-fuera', 'data-relojes': '' }, svg);
    P.sentado = texto(P.relojes, { class: 'am-rotulo', 'data-rotulo': 'sentado', x: 252, y: 32, 'font-size': 11.5, 'text-anchor': 'middle' }, 'sentado');
    P.cuesta = texto(P.relojes, { class: 'am-rotulo am-fuera', 'data-rotulo': 'cuesta', x: 252, y: 32, 'font-size': 11.5, 'text-anchor': 'middle' }, 'cuesta arriba');
    P.agujas = {};
    [['respira', 'respira'], ['corazon', 'el corazón']].forEach(function (r) {
      var c = RELOJ[r[0]];
      var g = el('g', { 'data-reloj': r[0] }, P.relojes);
      el('path', { class: 'rc-esfera', d: 'M ' + (c[0] - RADIO) + ' ' + c[1] + ' A ' + RADIO + ' ' + RADIO + ' 0 0 1 ' + (c[0] + RADIO) + ' ' + c[1] }, g);
      el('line', { class: 'rc-marca', x1: c[0] - RADIO, y1: c[1], x2: c[0] - RADIO + 6, y2: c[1] }, g);
      el('line', { class: 'rc-marca', x1: c[0] + RADIO, y1: c[1], x2: c[0] + RADIO - 6, y2: c[1] }, g);
      texto(g, { class: 'am-rotulo', 'data-rotulo': 'despacio', x: c[0] - RADIO - 4, y: c[1] + 3.5, 'font-size': 9.5, 'text-anchor': 'end' }, 'despacio');
      texto(g, { class: 'am-rotulo', 'data-rotulo': 'rapido', x: c[0] + RADIO + 4, y: c[1] + 3.5, 'font-size': 9.5 }, 'rápido');
      texto(g, { class: 'am-rotulo', 'data-rotulo': 'nombre-' + r[0], x: c[0], y: c[1] + 16, 'font-size': 10.5, 'text-anchor': 'middle' }, r[1]);
      /* La aguja se dibuja apuntando hacia arriba y se gira desde el
         centro del reloj. */
      var a = el('line', { class: 'rc-aguja', 'data-aguja': r[0], x1: c[0], y1: c[1], x2: c[0], y2: c[1] - RADIO + 5 }, g);
      a.style.transformOrigin = c[0] + 'px ' + c[1] + 'px';
      P.agujas[r[0]] = a;
      el('circle', { class: 'rc-eje', cx: c[0], cy: c[1], r: 2.6 }, g);
    });

    /* ── Las bolitas de oxígeno ──
       Cinco envolturas: la de fuera solo se enciende y se apaga, y cada
       una de las otras cuatro hace un tramo. Así la bolita que se gastó
       puede volver al aire sin que se la vea volar hacia atrás. */
    function bolitas(lista, cual) {
      return lista.map(function (b, k) {
        var g0 = el('g', { class: 'am-fuera', 'data-oxigeno': cual, 'data-lado': b[1] }, svg);
        var g1 = el('g', { class: 'am-viaja', 'data-tramo': '1' }, g0);
        var g2 = el('g', { class: 'am-viaja', 'data-tramo': '2' }, g1);
        var g3 = el('g', { class: 'am-viaja', 'data-tramo': '3' }, g2);
        var g4 = el('g', { class: 'am-viaja', 'data-tramo': '4' }, g3);
        el('circle', { class: 'rc-oxi', cx: b[0][0], cy: b[0][1], r: 3.6 }, g4);
        return { ver: g0, g: [g1, g2, g3, g4], sale: b[0], lado: b[1], pierna: PIERNA[b[1]][b[2]], k: k };
      });
    }
    P.sentado2 = bolitas(SENTADO, 'sentado');
    P.cuesta4 = bolitas(CUESTA, 'cuesta');
  }

  /* Lleva cada bolita hasta el tramo `hasta` (0: en el aire; 1: la boca;
     2: su pulmón; 3: el corazón; 4: su pierna), con la demora que diga
     `demDe` para cada tramo. */
  function llevar(b, hasta, demDe) {
    var pts = [b.sale, BOCA, PULMON[b.lado], CORAZON, b.pierna];
    for (var t = 1; t <= 4; t++) {
      var dx = t <= hasta ? pts[t][0] - pts[t - 1][0] : 0, dy = t <= hasta ? pts[t][1] - pts[t - 1][1] : 0;
      A.mover(b.g[t - 1], dx, dy, 0, 1, demDe(t));
    }
  }
  /* Tramo por tramo: hacia adelante, cada tramo que falta arranca cuando
     acabó el anterior; hacia atrás, se deshacen en el orden contrario, así
     la bolita vuelve por donde vino y no atraviesa a Marvin. Los tramos
     que no viajan se ponen en su sitio con la demora `quieto`. */
  function demoras(desde, hasta, d0, quieto) {
    return function (t) {
      if (hasta > desde && t > desde && t <= hasta) return d0 + (t - desde - 1) * 800;
      if (hasta < desde && t > hasta && t <= desde) return d0 + (desde - t) * 800;
      return quieto || 0;
    };
  }

  function pintar(n, antes) {
    var sigue = antes != null && antes === n - 1;
    /* Las dos de cuando está sentado: al pulmón en el paso 1, a la pierna
       en el 2; en el 3 se gastan. Si vuelven a empezar después de
       gastarse, van al aire apagadas y se encienden al llegar. */
    var HASTA_S = [0, 2, 4, 4, 4, 4];
    P.sentado2.forEach(function (b, k) {
      var hasta = HASTA_S[n], antesH = antes == null ? hasta : HASTA_S[antes];
      var unPaso = antes != null && Math.abs(antes - n) === 1 && antes <= 2 && n <= 2;
      llevar(b, hasta, demoras(unPaso ? antesH : hasta, hasta, unPaso && sigue ? k * 300 : 0, 0));
      var gastada = antes != null && antes >= 3 && n <= 2 && hasta !== 4;
      A.ver(b.ver, n <= 2, gastada ? 900 : sigue && n === 3 ? 300 : 0);
    });
    /* Las cuatro de cuesta arriba: hacen el viaje entero en el paso 4. Si
       se vuelve atrás, se apagan en su pierna y regresan al aire apagadas. */
    P.cuesta4.forEach(function (b, k) {
      var hasta = n >= 4 ? 4 : 0, sube = sigue && n === 4;
      llevar(b, hasta, demoras(sube ? 0 : hasta, hasta, sube ? k * 250 : 0, n < 4 && antes != null && antes >= 4 ? 500 : 0));
      A.ver(b.ver, n >= 4, sube ? k * 250 : 0);
    });
    /* Los relojes: aparecen sentado, y cuesta arriba las agujas se van a
       «rápido». */
    A.ver(P.relojes, n >= 3, n === 3 && sigue ? 700 : 0);
    A.ver(P.sentado, n === 3, 0);
    A.ver(P.cuesta, n >= 4, 0);
    var giro = n >= 4 ? RAPIDO : DESPACIO, dg = n === 4 && sigue ? 200 : 0;
    A.mover(P.agujas.respira, 0, 0, giro, 1, dg);
    A.mover(P.agujas.corazon, 0, 0, giro, 1, dg);
  }

  function marcador(n) {
    return [
      { cifra: '?', palabras: 'cómo llega el oxígeno a las piernas' },
      { cifra: 'pulmones', palabras: 'hasta ahí llega el aire' },
      { cifra: 'sangre', palabras: 'lo lleva a las piernas' },
      { cifra: 'despacio', palabras: 'sentado' },
      { cifra: 'rápido', palabras: 'cuesta arriba' },
      { cifra: '?', palabras: 'cuántas veces respiras' }
    ][n];
  }

  AnimacionMision.montar('#amCuesta', {
    vista: [ANCHO, ALTO],
    describe: 'A la izquierda, el aire con el oxígeno en bolitas. Al lado, Marvin de frente con sus baldes, y por dentro sus pulmones, su corazón y el camino de la sangre, de ida y de vuelta. A la derecha, dos relojes de aguja, «respira» y «el corazón», de despacio a rápido.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🌬️ Que respire', '🩸 ¿Y a las piernas?', '🪑 ¿Y sentado?', '⛰️ ¿Y cuesta arriba?', '💡 ¿Y tú?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
