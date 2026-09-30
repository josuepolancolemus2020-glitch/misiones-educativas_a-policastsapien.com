/* ============================================================
   M.E.T.A.S · El Sistema Nervioso · «El atajo de la médula»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Marvin: se
   le fue la mano al comal caliente y la retiró antes de darse cuenta;
   primero la mano ya estaba afuera, y luego vino el susto y el dolor. La
   historia termina diciendo que esa orden no la dio el cerebro: la dio un
   atajo que vive más abajo, y por eso llegó antes que el pensamiento. El
   aparato (botones, frase, marcador) vive en js/animacion-mision.js;
   aquí solo está el dibujo y dónde va cada pieza en cada paso.

   Es Marvin de lado, con el cerebro en la cabeza y la médula espinal en
   la espalda, y el brazo estirado hacia el comal del fogón. Por dentro
   del brazo van dos nervios: uno que sube de la mano a la médula y otro
   que baja de la médula al músculo del brazo.

     0  la mano se acerca al comal: ¿quién da la orden de quitarla?;
     1  la mano toca el comal: un aviso sube por el brazo hasta la médula;
     2  en la médula salen dos caminos a la vez: la orden baja al músculo y
        la mano se quita, y el aviso sigue subiendo al cerebro;
     3  el cerebro se da cuenta: ahí llegan el susto y el dolor, y la mano
        ya estaba afuera;
     4  si la orden tuviera que salir del cerebro, el camino sería más
        largo: subir, pensarlo y volver a bajar;
     5  el atajo vive en la médula y cuida el cuerpo sin que uno lo piense.
        Y la pregunta es del alumno: ¿qué más hace tu cuerpo sin decidirlo?

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **El aviso y la orden van a la misma velocidad.** Cada camino se
      dibuja en tramos del mismo largo, uno detrás de otro, así que lo que
      tarda cada uno lo decide su largo. La sonda mide los caminos en el
      dibujo: el atajo (de la mano a la médula y de vuelta al músculo) es
      más corto que el que pasaría por el cerebro.
   2. ⚠️ **El cerebro no llega tarde por la distancia, sino porque tiene que
      darse cuenta.** Desde la médula, el camino al cerebro y el camino al
      músculo miden casi lo mismo, y en el paso 2 salen a la vez y llegan a
      la vez: lo que el cerebro necesita es tiempo para notar lo que pasó.
      Por eso el «¡Ay!» sale en el paso siguiente, con la mano ya afuera.
      En la primera versión el aviso subía en un solo tramo y llegaba a la
      cabeza antes de que la mano se moviera: parecía que el cerebro sí
      había tenido tiempo, que es lo contrario de la historia. Se vio en las
      fotos a medio viaje, con la sonda en verde; ahora la sonda lo mide.
   3. ⚠️ **Va en cámara lenta, y se dice.** De verdad todo esto pasa en
      mucho menos de un segundo. No se escribe cuánto: la prueba pregunta
      a qué velocidad viajan los impulsos.
   4. ⚠️ **Lo que pregunta la prueba no se dice.** Ni el nombre del atajo,
      ni qué tipo de neurona lleva el aviso o la orden, ni «estímulo», ni el
      nombre de los sistemas, ni una medida. El cerebro y la médula
      espinal sí se nombran: la historia los nombra y la animación es de
      ellos. Y la prueba se cambió donde la historia o esta animación ya
      contestaban: el verdadero o falso del comal de Marvin y, en
      pensamiento crítico, los casos de la mano que toca algo caliente (una
      taza, una plancha, una olla), que eran la historia con otra ropa.
   5. **El brazo gira desde el hombro, y el nervio no se despega.** Lo que
      va por dentro del brazo gira con él; lo que va del hombro a la
      médula se queda en el cuerpo. Los dos se juntan en el hombro, que es
      el punto donde gira el brazo.
   6. **Nada se dice solo con color.** El aviso y la orden llevan su punta
      de flecha, que dice hacia dónde van, y el camino del cerebro va con
      raya cortada. Marvin, el fogón y el comal son como son en la pantalla
      clara y en la oscura.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amAtajo')) return;

  var ANCHO = 320, ALTO = 240, FIN = 5;
  var HOMBRO = [80, 96];                          // donde gira el brazo
  var CODO = [148, 116];                          // donde gira el antebrazo
  var MEDULA = [54, 66, 176];                     // x, arriba y abajo
  var JUNTA = 100;                                // donde los nervios del brazo entran a la médula
  var CEREBRO = [55, 42];
  var TRAMO = 46;
  /* Cuánto gira el brazo (desde el hombro) y el antebrazo (desde el codo)
     en cada paso: acercándose, tocando el comal y ya quitado. */
  var GIRO = [0, 3, -8, -8, -8, -8];
  var GIRO_CODO = [0, 1, -35, -35, -35, -35];

  var TEXTOS = [
    'Marvin acerca la mano al comal caliente. ¿Quién da la orden de quitarla, cuando la toca?',
    'La mano toca el comal. Un aviso sale de los dedos y sube por un nervio del brazo hasta la médula espinal, en la espalda.',
    'En la médula salen dos caminos a la vez. La orden baja por otro nervio al músculo, y la mano se quita; el aviso sigue al cerebro.',
    'El cerebro necesita un momento para darse cuenta. Cuando se da cuenta, llegan el susto y el dolor: la mano ya estaba afuera.',
    'Si la orden tuviera que salir del cerebro, el camino sería más largo: subir a la cabeza, pensarlo y volver a bajar. La mano seguiría en el comal.',
    'El atajo vive en la médula, más abajo que el cerebro, y cuida el cuerpo sin que lo pienses. ¿Qué más hace tu cuerpo sin que lo decidas?'
  ];

  var A;
  function r2(v) { return Math.round(v * 100) / 100; }
  function largo(pts) {
    var L = 0;
    for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return L;
  }
  /* Parte un camino en tramos del mismo largo: cada tramo se dibuja
     entero en su turno, así todo corre a paso parejo. */
  function tramos(pts, cuantos) {
    var L = largo(pts), n = cuantos || Math.max(1, Math.round(L / TRAMO)), cada = L / n, out = [], actual = [pts[0]], hecho = 0, meta = cada;
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]), usado = 0;
      while (hecho + (d - usado) >= meta - 1e-6 && out.length < n - 1) {
        var t = (usado + (meta - hecho)) / d, c = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
        actual.push(c); out.push(actual); actual = [c];
        usado += meta - hecho; hecho = meta; meta += cada;
      }
      hecho += d - usado; actual.push(b);
    }
    out.push(actual);
    return out;
  }
  function d(pts) { return pts.map(function (p, i) { return (i ? 'L ' : 'M ') + r2(p[0]) + ' ' + r2(p[1]); }).join(' '); }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  /* Un camino de señal: sus tramos se encienden uno detrás de otro, y la
     punta de flecha sale al final. */
  function senal(padre, pts, attrs, clase, conPunta, cuantos) {
    var g = A.el('g', attrs, padre), trozos = [];
    tramos(pts, cuantos).forEach(function (t, k) {
      trozos.push(A.el('path', { class: clase, 'data-tramo': k, d: d(t) }, g));
    });
    var punta = null;
    if (conPunta) {
      var a = pts[pts.length - 2], b = pts[pts.length - 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      punta = A.el('path', { class: 'sn-punta am-fuera', 'data-punta': '', d: 'M ' + r2(b[0] - 6 * Math.cos(ang - 0.55)) + ' ' + r2(b[1] - 6 * Math.sin(ang - 0.55)) +
        ' L ' + r2(b[0]) + ' ' + r2(b[1]) + ' L ' + r2(b[0] - 6 * Math.cos(ang + 0.55)) + ' ' + r2(b[1] - 6 * Math.sin(ang + 0.55)) }, g);
    }
    return { g: g, trozos: trozos, punta: punta, n: trozos.length };
  }
  function correr(s, si, desde) {
    s.trozos.forEach(function (t, k) { A.trazar(t, si, si ? desde + k * 800 : 0); });
    if (s.punta) A.ver(s.punta, si, si ? desde + s.n * 800 : 0);
    return desde + s.n * 800;
  }

  var P = {};

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El fogón y el comal, con su calor ── */
    el('path', { class: 'sn-fogon', d: 'M 182 200 L 184 166 L 268 166 L 270 200 Z' }, svg);
    el('path', { class: 'sn-boca', d: 'M 210 200 L 210 184 Q 226 174 242 184 L 242 200 Z' }, svg);
    [[218, 196], [226, 192], [234, 196]].forEach(function (f) {
      el('path', { class: 'sn-fuego', d: 'M ' + (f[0] - 4) + ' 200 Q ' + (f[0] - 5) + ' ' + (f[1] - 4) + ' ' + f[0] + ' ' + (f[1] - 10) + ' Q ' + (f[0] + 5) + ' ' + (f[1] - 4) + ' ' + (f[0] + 4) + ' 200 Z' }, svg);
    });
    el('ellipse', { class: 'sn-comal', 'data-comal': '', cx: 226, cy: 162, rx: 40, ry: 5 }, svg);
    [206, 226, 246].forEach(function (x) {
      el('path', { class: 'sn-calor', d: 'M ' + x + ' 154 q 3 -4 0 -8 q -3 -4 0 -8' }, svg);
    });
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'comal', x: 226, y: 214, 'font-size': 10.5, 'text-anchor': 'middle' }, 'el comal caliente');

    /* ── Marvin, de lado ── */
    el('rect', { class: 'sn-pantalon', x: 42, y: 170, width: 40, height: 40, rx: 4 }, svg);
    el('rect', { class: 'sn-camisa', 'data-cuerpo': '', x: 38, y: 76, width: 48, height: 100, rx: 12 }, svg);
    el('rect', { class: 'sn-piel', x: 52, y: 66, width: 12, height: 14 }, svg);
    el('circle', { class: 'sn-piel', 'data-cabeza': '', cx: 60, cy: 46, r: 25 }, svg);
    el('path', { class: 'sn-pelo', d: 'M 36 44 Q 38 18 62 20 Q 84 22 85 40 Q 74 30 60 32 Q 46 32 36 44 Z' }, svg);
    el('ellipse', { class: 'sn-cerebro', 'data-cerebro': '', cx: CEREBRO[0], cy: CEREBRO[1], rx: 13, ry: 9 }, svg);
    el('path', { class: 'sn-pliegue', d: 'M 46 40 q 3 -3 6 0 q 3 3 6 0 q 3 -3 6 0 M 48 45 q 4 -2 8 0 q 4 2 8 0' }, svg);
    el('circle', { class: 'sn-ojo', cx: 77, cy: 50, r: 2 }, svg);
    el('path', { class: 'sn-boca-m', d: 'M 74 60 q 4 2 8 0' }, svg);
    /* La médula espinal, por dentro de la espalda, desde el cerebro. */
    el('line', { class: 'sn-medula', 'data-medula': '', x1: MEDULA[0], y1: MEDULA[1], x2: MEDULA[0], y2: MEDULA[2] }, svg);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'cerebro', x: 94, y: 28, 'font-size': 10.5 }, 'el cerebro');
    el('line', { class: 'sn-hilo', x1: 93, y1: 26, x2: 72, y2: 40 }, svg);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'medula', x: 4, y: 132, 'font-size': 10.5 }, 'la médula');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'medula2', x: 4, y: 144, 'font-size': 10.5 }, 'espinal');
    el('line', { class: 'sn-hilo', x1: 40, y1: 134, x2: 52, y2: 134 }, svg);

    /* ── Los caminos que no giran: del hombro a la médula, y de la médula
       al cerebro ── */
    var alHombro = [[HOMBRO[0], HOMBRO[1] + 2], [MEDULA[0], JUNTA]];
    var delHombro = [[MEDULA[0], JUNTA + 4], [HOMBRO[0], HOMBRO[1] + 6]];

    /* ── El brazo: gira desde el hombro, y el antebrazo, desde el codo, uno
       dentro del otro. Por dentro, sus dos nervios ── */
    P.brazo = el('g', { class: 'am-viaja', 'data-brazo': '' }, svg);
    P.brazo.style.transformOrigin = HOMBRO[0] + 'px ' + HOMBRO[1] + 'px';
    el('path', { class: 'sn-manga', d: 'M 74 88 L 152 108 L 146 124 L 72 106 Z' }, P.brazo);
    P.antebrazo = el('g', { class: 'am-viaja', 'data-antebrazo': '' }, P.brazo);
    P.antebrazo.style.transformOrigin = CODO[0] + 'px ' + CODO[1] + 'px';
    el('path', { class: 'sn-piel', d: 'M 146 108 L 206 128 L 202 142 L 144 124 Z' }, P.antebrazo);
    el('path', { class: 'sn-piel', 'data-mano': '', d: 'M 202 126 Q 214 124 224 132 Q 228 140 222 146 Q 212 150 202 142 Z' }, P.antebrazo);
    el('circle', { class: 'sn-piel', cx: CODO[0], cy: CODO[1], r: 8 }, P.brazo);
    P.musculo = el('ellipse', { class: 'sn-musculo', 'data-musculo': '', cx: 112, cy: 104, rx: 16, ry: 5.5, transform: 'rotate(15 112 104)' }, P.brazo);
    var dedos = [222, 144];
    el('path', { class: 'sn-nervio', d: d([dedos, [204, 136], CODO]) }, P.antebrazo);
    el('path', { class: 'sn-nervio', d: d([CODO, [HOMBRO[0], HOMBRO[1] + 2]]) }, P.brazo);
    el('path', { class: 'sn-nervio', d: d([[HOMBRO[0], HOMBRO[1] + 6], [112, 108]]) }, P.brazo);
    /* Los nervios del cuerpo, del hombro a la médula. */
    el('path', { class: 'sn-nervio', d: d(alHombro) }, svg);
    el('path', { class: 'sn-nervio', d: d(delHombro) }, svg);

    /* ── Las señales ── */
    /* El aviso: de los dedos al codo (gira con el antebrazo), del codo al
       hombro (gira con el brazo) y del hombro a la médula (se queda). */
    P.avisoMano = senal(P.antebrazo, [dedos, [204, 136], CODO], { 'data-senal': 'aviso-mano' }, 'sn-aviso', false);
    P.avisoBrazo = senal(P.brazo, [CODO, [HOMBRO[0], HOMBRO[1] + 2]], { 'data-senal': 'aviso-brazo' }, 'sn-aviso', false);
    P.avisoCuerpo = senal(svg, alHombro, { 'data-senal': 'aviso-cuerpo' }, 'sn-aviso', true);
    /* La orden: de la médula al hombro y del hombro al músculo. */
    P.ordenCuerpo = senal(svg, delHombro, { 'data-senal': 'orden-cuerpo' }, 'sn-orden', false);
    P.ordenBrazo = senal(P.brazo, [[HOMBRO[0], HOMBRO[1] + 6], [112, 108]], { 'data-senal': 'orden-brazo' }, 'sn-orden', true);
    /* El aviso que sigue al cerebro. ⚠️ Va en dos tramos, como la orden,
       para que llegue arriba cuando la orden llega al músculo. Con uno solo
       llegaba antes de que la mano se moviera, y el que mira concluye que
       el cerebro sí tuvo tiempo: justo lo contrario de la historia. De
       verdad los dos llegan casi a la vez; lo que tarda es darse cuenta,
       que es el paso 3. */
    P.alCerebro = senal(svg, [[MEDULA[0], JUNTA], [MEDULA[0], MEDULA[1]], [CEREBRO[0], CEREBRO[1] + 4]], { 'data-senal': 'cerebro' }, 'sn-aviso', true, 2);
    /* El camino largo del paso 4: subir al cerebro y volver a bajar. */
    P.largo = senal(svg, [[MEDULA[0] + 8, JUNTA], [MEDULA[0] + 8, MEDULA[1] + 2], [CEREBRO[0] + 8, CEREBRO[1] + 6], [MEDULA[0] + 16, MEDULA[1] + 4],
      [MEDULA[0] + 16, JUNTA + 8], [HOMBRO[0], HOMBRO[1] + 10]], { 'data-senal': 'largo' }, 'sn-largo', true);

    /* ── El cerebro se da cuenta: los puntos y el «¡Ay!» ── */
    P.piensa = el('g', { class: 'am-fuera', 'data-piensa': '' }, svg);
    [46, 55, 64].forEach(function (x) { el('circle', { class: 'sn-punto', cx: x, cy: 12, r: 2.2 }, P.piensa); });
    P.ay = el('g', { class: 'am-fuera', 'data-ay': '' }, svg);
    el('path', { class: 'sn-globo', d: 'M 96 44 Q 96 34 106 34 L 136 34 Q 146 34 146 44 Q 146 54 136 54 L 108 54 L 98 60 L 100 52 Q 96 50 96 44 Z' }, P.ay);
    texto(P.ay, { class: 'sn-ay', 'data-dice': 'ay', x: 121, y: 49, 'font-size': 13, 'text-anchor': 'middle' }, '¡Ay!');

    /* ── Los nombres de los dos caminos (paso 4) ── */
    P.nombres = el('g', { class: 'am-fuera', 'data-nombres': '' }, svg);
    texto(P.nombres, { class: 'am-rotulo', 'data-rotulo': 'atajo', x: 100, y: 146, 'font-size': 10.5 }, 'el atajo');
    el('line', { class: 'sn-hilo', x1: 98, y1: 143, x2: 60, y2: 104 }, P.nombres);
    texto(P.nombres, { class: 'am-rotulo', 'data-rotulo': 'largo', x: 158, y: 72, 'font-size': 10.5 }, 'si esperara al cerebro');
    el('line', { class: 'sn-hilo', x1: 156, y1: 69, x2: 70, y2: 66 }, P.nombres);

    /* ⚠️ De verdad todo esto pasa en mucho menos de un segundo. Se avisa
       sin dar la cuenta: la prueba pregunta a qué velocidad viaja. */
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'lento', x: ANCHO - 4, y: 14, 'font-size': 9.5, 'text-anchor': 'end' }, 'Aquí va en cámara lenta:');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'lento', x: ANCHO - 4, y: 26, 'font-size': 9.5, 'text-anchor': 'end' }, 'de verdad es un instante.');
  }

  function pintar(n, antes) {
    var sigue = antes != null && antes === n - 1;
    function si(k) { return sigue ? k : 0; }

    /* El brazo: acercándose, tocando y quitado. Se quita cuando la orden
       llega al músculo. */
    var llegaOrden = correr(P.ordenCuerpo, n >= 2, si(0));
    llegaOrden = correr(P.ordenBrazo, n >= 2, n === 2 ? si(llegaOrden) : 0);
    var mueve = n === 2 ? si(llegaOrden) : n === 1 ? si(0) : 0;
    A.mover(P.brazo, 0, 0, GIRO[n], 1, mueve);
    A.mover(P.antebrazo, 0, 0, GIRO_CODO[n], 1, mueve);
    A.mover(P.musculo, 0, 0, 0, n >= 2 ? 1.18 : 1, n === 2 ? si(llegaOrden - 400) : 0);

    /* El aviso: de los dedos a la médula. */
    var enCodo = correr(P.avisoMano, n >= 1, n === 1 ? si(800) : 0);
    var enMedula = correr(P.avisoBrazo, n >= 1, n === 1 ? si(enCodo) : 0);
    correr(P.avisoCuerpo, n >= 1, n === 1 ? si(enMedula) : 0);
    /* Y sigue al cerebro, a la vez que la orden. */
    correr(P.alCerebro, n >= 2, si(0));
    /* El cerebro se da cuenta: los puntos, y después el «¡Ay!». */
    A.ver(P.piensa, n === 3, n === 3 ? si(0) : 0);
    A.ver(P.ay, n >= 3, n === 3 ? si(1400) : 0);
    /* El camino largo y los nombres (paso 4). */
    correr(P.largo, n === 4, si(0));
    A.ver(P.nombres, n === 4, n === 4 ? si(800) : 0);
  }

  function marcador(n) {
    return [
      { cifra: '?', palabras: 'quién da la orden de quitar la mano' },
      { cifra: '1', palabras: 'camino: de la mano a la médula' },
      { cifra: '2', palabras: 'caminos salen de la médula: al músculo y al cerebro' },
      { cifra: '¡Ay!', palabras: 'el dolor llega con la mano ya afuera' },
      { cifra: 'más largo', palabras: 'el camino si esperara al cerebro' },
      { cifra: '?', palabras: 'qué más hace tu cuerpo sin que lo decidas' }
    ][n];
  }

  AnimacionMision.montar('#amAtajo', {
    vista: [ANCHO, ALTO],
    describe: 'Marvin de lado, con el cerebro en la cabeza y la médula espinal en la espalda, y el brazo estirado hacia un comal caliente. Por dentro del brazo van dos nervios: uno sube de la mano a la médula y otro baja de la médula al músculo.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['✋ La toca', '⚡ ¿Y en la médula?', '🧠 ¿Y el cerebro?', '🐢 ¿Y sin atajo?', '💡 ¿Dónde vive?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
