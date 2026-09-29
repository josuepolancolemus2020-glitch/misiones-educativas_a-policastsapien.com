/* ============================================================
   M.E.T.A.S · Ángulos: Tipos y Transportador · La rampa de Kenia
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Kenia: a
   la entrada de la escuela le hicieron una rampa y quedó muy parada.
   La historia termina diciendo que lo que quedó mal es el ÁNGULO, y que
   un ángulo no se pone a ojo: se mide, con un transportador. El
   aparato (botones, frase, marcador) vive en js/animacion-mision.js;
   aquí solo está el dibujo y dónde va cada pieza en cada paso.

   Lo que enseña, con los cuatro pasos de la ficha y en su orden:

     0  la rampa vista de lado: ¿cuántos grados mide su ángulo con el
        suelo? Se decide a ojo antes de tocar;
     1  el ángulo: el vértice, donde la rampa sale del suelo, y sus dos
        lados, la rampa y el suelo;
     2  paso 1: el centro del transportador, sobre el vértice. Llega
        torcido, y por eso todavía no se lee;
     3  paso 2: se gira sobre el vértice hasta que la base quede sobre
        el suelo;
     4  paso 3: de las dos filas de números se sigue la que empieza en el
        cero que queda bajo la rampa;
     5  paso 4: se cuenta 0, 10, 20 hasta la rampa, y mide 20°. En el
        mismo sitio la otra fila dice 160, porque cuenta del otro lado;
     6  de lejos: un transportador chiquito mide la rampa entera, porque
        el ángulo no depende del largo de los lados.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que va debajo NO se regala.** El «Predice» pregunta si
      130° es agudo, recto u obtuso, cuál es el complemento de 25° y el
      tercer ángulo de un triángulo. Por eso aquí no se nombra ningún tipo
      de ángulo, no se completa nada hasta 90 ni hasta 180 y la cuña de la
      rampa no dice cuánto miden sus otras dos esquinas. Se enseña a MEDIR,
      que es lo que pide la historia. Hasta la base del transportador se
      llama «base» y no «borde recto».
   2. **Los cuatro pasos son los de la ficha**, en su orden: centra,
      alinea el cero, sigue la escala, lee. Y la trampa de la doble
      escala, que la ficha nombra («así nunca confundirás 60° con 120°»),
      se ve pasar: en el mismo sitio una fila dice 20 y la otra 160.
   3. **El transportador es un transportador de verdad.** Sus 37 rayas y
      sus 38 números están donde van: los de la fila de dentro, a sus
      grados desde el cero de la derecha, y los de la de fuera, desde el
      cero de la izquierda. La sonda los mide todos y mide el ángulo de la
      rampa en el dibujo: lo que se lee tiene que ser lo que está dibujado.
   4. **De cerca y de lejos, el mismo transportador.** Para leerlo, la
      vista se acerca cinco veces al pie de la rampa; al final se aleja y
      el transportador queda chiquito en la esquina de una rampa grande.
      Es lo que dice la historia («lo que quedó mal no es el largo»): el
      ángulo no depende del largo de los lados. La vista y el
      transportador se mueven con la misma curva y la misma demora, y su
      tamaño guarda la misma proporción en cada cuadro: el centro no se
      despega del vértice ni a medio camino.
   5. ⚠️ **La cuenta de la animación no cae en la prueba.** La operativa
      pide leer ángulos dibujados igual que este, con un lado acostado a
      la derecha y el otro subiendo. Las formas que dibujaban uno de 20° se
      corren a 30°, y el suplemento de 20° o de 160° (que son las dos filas
      de este mismo dibujo) se corre un grado. Está en angulos-basicos.js,
      _fueraDeLaRampa.
   6. **Nada se dice solo con color.** Los dos lados llevan su rótulo, la
      fila que se sigue va en letra gruesa y con un anillo en su cero, lo
      leído se agranda y se encierra, y el 160 se tacha con una raya.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amRampa')) return;

  var ANCHO = 320, ALTO = 200, FIN = 6;
  var RAD = Math.PI / 180;

  /* La rampa, en coordenadas del mundo: el vértice (el pie de la rampa) en
     el origen, el suelo en y = 0 y la rampa subiendo a la derecha hasta el
     andén de la entrada. */
  var ANGULO = 20, TRAMO = 140, SUBE = TRAMO * Math.tan(ANGULO * RAD);

  /* De lejos, el pie de la rampa queda en LEJOS y a escala 1; de cerca, en
     CERCA y Z veces más grande. */
  var LEJOS = [100, 166], CERCA = [160, 148], Z = 5;

  /* El transportador se dibuja a su tamaño de cerca: radio R. Llega torcido
     INCLINA grados, que es lo que el paso 2 endereza: con 21° la rampa le
     pasa por el 41, entre dos números, así que no invita a leerlo. Y con
     más no cabe: la punta que baja se saldría del dibujo. */
  var R = 140, INCLINA = 21;
  var R_DENTRO = 96, R_FUERA = 119, R_CUENTA = 84;

  var TEXTOS = [
    'La rampa de Kenia, vista de lado. ¿Cuántos grados mide el ángulo que forma con el suelo? Decídelo a ojo antes de tocar.',
    'El ángulo nace donde la rampa sale del suelo: ese punto es el vértice. Sus dos lados son la rampa y el suelo.',
    'Paso 1: el centro del transportador va justo sobre el vértice. Todavía no se lee: el transportador está torcido.',
    'Paso 2: se gira sobre el vértice hasta que la base del transportador quede encima del suelo.',
    'Paso 3: hay dos filas de números. Se sigue la que empieza en el cero que queda bajo la rampa.',
    'Paso 4: se cuenta 0, 10, 20 hasta la rampa: mide 20°. La otra fila marca 160 porque cuenta desde el otro lado.',
    'Un transportador chiquito mide la rampa entera, porque el ángulo no depende del largo de los lados. ¿Le atinaste a ojo?'
  ];

  var A;
  var mundo, arriba, plastico, escala, punto;
  var lado = {}, rotulos = [], arco, pregunta, grados;
  var nums = { dentro: {}, fuera: {} }, anilloCero, cuenta, marcasCuenta = [], lectura, tachado;

  function r2(v) { return Math.round(v * 100) / 100; }
  /* Un punto a r de distancia y a g grados, contados desde la derecha y
     hacia arriba, como cuenta la fila de dentro del transportador. */
  function polar(r, g) { return [r2(r * Math.cos(g * RAD)), r2(-r * Math.sin(g * RAD))]; }

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Kenia en su silla, al pie de la rampa y mirando hacia ella. Es un
     dibujo de rayas, como el símbolo de la silla de ruedas. */
  function silla(padre) {
    var g = A.el('g', { class: 'tr-silla' }, padre);
    A.el('circle', { class: 'tr-rueda', cx: -80, cy: -13, r: 13 }, g);
    A.el('circle', { class: 'tr-lleno', cx: -80, cy: -13, r: 2.2 }, g);
    A.el('circle', { class: 'tr-lleno', cx: -62, cy: -3.5, r: 3.5 }, g);
    A.el('path', { d: 'M -97 -46 L -91 -46 L -89 -25 L -66 -25 L -63 -8' }, g);
    A.el('circle', { class: 'tr-lleno', cx: -79, cy: -57, r: 6 }, g);
    A.el('path', { d: 'M -81 -50 L -83 -30 L -67 -30 L -65 -15 L -59 -15 M -81 -45 L -73 -35' }, g);
  }

  /* Un número del transportador: su fila, lo que vale y a cuántos grados
     va. Los de las puntas (0 y 180) van justo encima de la base, como en
     los de verdad: sobre la raya no se leerían, y subidos por el arco se
     pegaban al 10 y al 170. */
  function numero(fila, valor, g, r, tam) {
    var p = g < 5 ? [r, r2(-tam * 0.62)] : g > 175 ? [-r, r2(-tam * 0.62)] : polar(r, g);
    var t = texto(escala, { class: 'tr-num tr-' + fila, 'data-fila': fila, 'data-valor': valor,
      'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': tam }, String(valor));
    A.mover(t, p[0], p[1], 0, 1, 0);
    nums[fila][valor] = { t: t, pos: p };
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El mundo: la tierra, la rampa, la entrada de la escuela y Kenia ──
       Todo en una capa que se acerca y se aleja entera. Las rayas no
       engordan al acercarse (vector-effect, en el CSS de la misión). */
    mundo = el('g', { class: 'tr-mundo' }, svg);
    el('rect', { class: 'tr-tierra', x: -220, y: 0, width: 640, height: 80 }, mundo);
    el('polygon', { class: 'tr-cemento', points: '0,0 ' + TRAMO + ',' + r2(-SUBE) + ' ' + TRAMO + ',0' }, mundo);
    el('rect', { class: 'tr-anden', x: TRAMO, y: r2(-SUBE), width: 200, height: r2(SUBE) }, mundo);
    el('rect', { class: 'tr-pared', x: TRAMO + 8, y: -260, width: 200, height: r2(260 - SUBE) }, mundo);
    el('rect', { class: 'tr-puerta', x: TRAMO + 30, y: -230, width: 36, height: r2(230 - SUBE) }, mundo);
    el('circle', { class: 'tr-pomo', cx: TRAMO + 58, cy: r2(-SUBE - 50), r: 2 }, mundo);
    el('line', { class: 'tr-suelo', x1: -220, y1: 0, x2: 420, y2: 0 }, mundo);
    el('line', { class: 'tr-rampa', x1: 0, y1: 0, x2: TRAMO, y2: r2(-SUBE) }, mundo);
    silla(mundo);

    /* ── El plástico del transportador, DEBAJO de los lados del ángulo: se
       ven a través de él, como a través de uno de verdad. ── */
    plastico = el('g', { class: 'tr-transportador' }, svg);
    el('path', { class: 'tr-plastico', d: 'M ' + (-R) + ' 0 A ' + R + ' ' + R + ' 0 0 1 ' + R + ' 0 Z' }, plastico);

    /* ── Lo que se marca encima del mundo: los dos lados, el arco del
       ángulo y los rótulos. Se acerca y se aleja con el mundo. ── */
    arriba = el('g', { class: 'tr-mundo tr-arriba' }, svg);
    lado.suelo = el('line', { class: 'tr-lado tr-lado-suelo am-fuera', x1: 0, y1: 0, x2: TRAMO, y2: 0 }, arriba);
    lado.rampa = el('line', { class: 'tr-lado tr-lado-rampa am-fuera', x1: 0, y1: 0, x2: TRAMO, y2: r2(-SUBE) }, arriba);
    arco = el('path', { class: 'tr-arco', d: 'M 40 0 A 40 40 0 0 0 ' + polar(40, ANGULO).join(' ') }, arriba);
    var pq = polar(57, ANGULO / 2);
    pregunta = texto(arriba, { class: 'am-rotulo tr-pregunta', x: pq[0], y: pq[1], 'text-anchor': 'middle',
      'dominant-baseline': 'central', 'font-size': 16 }, '?');
    grados = texto(arriba, { class: 'am-digito tr-grados am-fuera', x: pq[0], y: pq[1], 'text-anchor': 'middle',
      'dominant-baseline': 'central', 'font-size': 14 }, ANGULO + '°');
    rotulos = [
      texto(arriba, { class: 'am-rotulo tr-rotulo am-fuera', x: -12, y: -13, 'text-anchor': 'end', 'font-size': 12 }, 'vértice'),
      texto(arriba, { class: 'am-rotulo tr-rotulo am-fuera', x: 64, y: -40, 'text-anchor': 'middle', 'font-size': 12 }, 'lado'),
      texto(arriba, { class: 'am-rotulo tr-rotulo am-fuera', x: 64, y: 17, 'text-anchor': 'middle', 'font-size': 12 }, 'lado')
    ];

    /* ── La escala del transportador: rayas cada 5°, números cada 10° en
       dos filas, la base y la marca del centro. Encima de todo, porque es
       lo que se lee. ── */
    escala = el('g', { class: 'tr-transportador' }, svg);
    for (var g = 0; g <= 180; g += 5) {
      var largo = g % 10 === 0 ? 10 : 5.5, a = polar(R, g), b = polar(R - largo, g);
      el('line', { class: 'tr-marca', 'data-grados': g, x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, escala);
    }
    el('line', { class: 'tr-base', x1: -R, y1: 0, x2: R, y2: 0 }, escala);
    for (var k = 0; k <= 180; k += 10) {
      numero('dentro', k, k, R_DENTRO, 8.5);
      numero('fuera', k, 180 - k, R_FUERA, 9.5);
    }
    el('line', { class: 'tr-centro-raya', x1: 0, y1: 0, x2: 0, y2: -12 }, escala);
    el('circle', { class: 'tr-centro', cx: 0, cy: 0, r: 5.5 }, escala);

    /* Lo que se marca al leer: el anillo del cero de donde se cuenta, la
       cuenta hasta la rampa con sus dos paradas, lo leído y la raya que
       tacha el número de la otra fila. */
    var c0 = nums.dentro[0].pos;
    anilloCero = el('circle', { class: 'tr-anillo am-fuera', cx: c0[0], cy: c0[1], r: 6 }, escala);
    cuenta = el('path', { class: 'tr-cuenta', d: 'M ' + R_CUENTA + ' 0 A ' + R_CUENTA + ' ' + R_CUENTA + ' 0 0 0 ' + polar(R_CUENTA, ANGULO).join(' ') }, escala);
    [10, 20].forEach(function (gr) {
      var p = polar(R_CUENTA, gr);
      marcasCuenta.push(el('circle', { class: 'tr-paso am-fuera', 'data-grados': gr, cx: p[0], cy: p[1], r: 2.6 }, escala));
    });
    var l = polar(R, ANGULO);
    lectura = el('circle', { class: 'tr-lectura am-fuera', cx: l[0], cy: l[1], r: 6 }, escala);
    /* La raya que tacha baja hacia la derecha, al revés de la rampa, que
       sube y pasa por ahí mismo: inclinada como ella parecía un pedazo de
       la rampa, y acostada se leía como un «−160−». */
    var f = nums.fuera[180 - ANGULO].pos;
    tachado = el('line', { class: 'tr-tachado am-fuera', 'data-valor': 180 - ANGULO,
      x1: r2(f[0] - 9), y1: r2(f[1] - 5), x2: r2(f[0] + 9), y2: r2(f[1] + 5) }, escala);

    /* El vértice va aparte y encima de todo: sigue a la vista cuando se
       acerca, pero no crece con ella. El anillo del centro del transportador
       lo rodea cuando está bien puesto. */
    punto = el('circle', { class: 'tr-vertice am-fuera', cx: 0, cy: 0, r: 3.4 }, svg);
  }

  function pintar(n, antes) {
    var atras = antes != null && antes > n;
    var cerca = n >= 2 && n <= 5;
    var veniaCerca = antes != null && antes >= 2 && antes <= 5;

    /* La vista: al acercarse desde el paso 1, después de que se apaguen los
       rótulos de lejos; al volver del final, enseguida. Al alejarse, casi
       enseguida. */
    var dz = 0;
    if (cerca && !veniaCerca && antes != null) dz = antes === 1 ? 350 : 0;
    else if (!cerca && veniaCerca) dz = atras ? 200 : 300;
    var pose = cerca ? [CERCA[0], CERCA[1], Z] : [LEJOS[0], LEJOS[1], 1];
    A.mover(mundo, pose[0], pose[1], 0, pose[2], dz);
    A.mover(arriba, pose[0], pose[1], 0, pose[2], dz);
    /* Lo que solo se ve de lejos llega cuando la vista ya se alejó. */
    var trasAlejar = !cerca && veniaCerca ? dz + 900 : 0;

    var dv = n === 1 && !atras ? 800 : dz;
    A.mover(punto, pose[0], pose[1], 0, 1, dv);
    A.ver(punto, n >= 1, dv);

    A.ver(lado.suelo, n >= 1, n === 1 && !atras ? 200 : 0);
    A.ver(lado.rampa, n >= 1, n === 1 && !atras ? 550 : 0);
    A.ver(arco, !cerca, trasAlejar);
    A.ver(pregunta, n <= 1, trasAlejar);
    A.ver(grados, n === 6, n === 6 ? trasAlejar + 150 : 0);
    rotulos.forEach(function (r, i) {
      A.ver(r, n === 1, n === 1 ? (atras ? trasAlejar : 900 + 200 * i) : 0);
    });

    /* El transportador, en sus dos capas (el plástico y la escala), con la
       misma pose y la misma demora. Escondido, espera arriba y a la izquierda
       para bajar hasta el vértice; al final se queda en el vértice, del
       tamaño que tiene de verdad junto a la rampa. */
    var t;
    if (n === 0) t = [LEJOS[0], LEJOS[1], 0, 1 / Z, false, 0];
    else if (n === 1) t = [CERCA[0] - 30, CERCA[1] - 80, INCLINA, 1, false, 0];
    else if (n === 2) t = [CERCA[0], CERCA[1], INCLINA, 1, true, atras ? 0 : 1150];
    else if (n <= 5) t = [CERCA[0], CERCA[1], 0, 1, true, n === 3 && !atras ? 200 : dz];
    else t = [LEJOS[0], LEJOS[1], 0, 1 / Z, true, dz];
    [plastico, escala].forEach(function (capa) {
      A.mover(capa, t[0], t[1], t[2], t[3], t[5]);
      A.ver(capa, t[4], t[5]);
    });

    /* La fila que se sigue es la de dentro: su cero queda bajo la rampa. */
    Object.keys(nums.dentro).forEach(function (v) { nums.dentro[v].t.classList.toggle('tr-fila', n >= 4); });
    A.ver(anilloCero, n === 4 || n === 5, n === 4 && !atras ? 300 : 0);
    A.trazar(cuenta, n >= 5, n === 5 && !atras ? 250 : 0);
    marcasCuenta.forEach(function (m, i) { A.ver(m, n >= 5, n === 5 && !atras ? 450 + 350 * i : 0); });
    A.ver(lectura, n >= 5, n === 5 && !atras ? 1050 : 0);
    var leido = nums.dentro[ANGULO];
    A.mover(leido.t, leido.pos[0], leido.pos[1], 0, n >= 5 ? 1.4 : 1, n === 5 && !atras ? 1050 : 0);
    leido.t.classList.toggle('tr-leido', n >= 5);
    A.ver(tachado, n === 5, n === 5 && !atras ? 1500 : 0);
    nums.fuera[180 - ANGULO].t.classList.toggle('tr-mal', n === 5);
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: 'grados, a ojo' },
      { cifra: '¿?', palabras: 'la abertura entre la rampa y el suelo' },
      { cifra: '¿?', palabras: 'paso 1: el centro sobre el vértice' },
      { cifra: '¿?', palabras: 'paso 2: la base sobre el suelo' },
      { cifra: '0°', palabras: 'paso 3: se cuenta desde este cero' },
      { cifra: ANGULO + '°', palabras: 'paso 4: donde pasa la rampa' },
      { cifra: ANGULO + '°', palabras: 'medido, no a ojo' }
    ][n];
  }

  AnimacionMision.montar('#amRampa', {
    vista: [ANCHO, ALTO],
    describe: 'La rampa de la escuela vista de lado, con su ángulo en la esquina de abajo. Un transportador se centra en el vértice, se gira hasta que su base quede sobre el suelo y se lee: la rampa mide 20°. Al alejarse, el transportador chiquito mide la rampa entera.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['📐 Ver el ángulo', '📍 Transportador', '🔄 Girarlo', '🔢 ¿Cuál fila?', '👀 Leer', '🔭 Alejarse', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
