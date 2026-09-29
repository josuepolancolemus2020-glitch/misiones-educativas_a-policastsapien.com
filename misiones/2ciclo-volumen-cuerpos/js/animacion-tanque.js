/* ============================================================
   M.E.T.A.S · Volumen de Cuerpos · El tanque de mil litros
   ------------------------------------------------------------
   La escena de la animación que va después de la historia del tanque
   de la escuela: se fue el agua, el tanque estaba lleno, un metro de
   cada lado, y el conserje calculó «como cien litros». Racionaron dos
   días con un vaso por niño, y había mil: alcanzaba para la semana. El
   aparato (botones, frase, marcador) vive en js/animacion-mision.js;
   aquí solo está el dibujo y dónde va cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  el tanque lleno, un metro de cada lado: ¿cuántos litros tiene?
        Se decide antes de tocar;
     1  un litro de agua llena justo un cubito de 10 cm de cada lado. El
        de muestra se queda a un lado, y uno igual entra en la esquina;
     2  en un metro caben 10 cubitos en fila (10 × 10 cm = 100 cm): esa
        fila son 10 litros;
     3  diez filas cubren el fondo: 100 cubitos. Los 100 litros del
        conserje llenan solo el fondo, que queda de otro color;
     4  el tanque también mide un metro de alto: caben 10 capas como esa,
        una encima de otra, y cada una suma 100 litros;
     5  diez de largo, diez de ancho y diez de alto: 10 × 10 × 10 = 1,000
        litros.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que va debajo NO se regala.** El «Predice» pregunta cuántos
      cubitos caben en una caja de 4 × 3 × 2, cuántos litros tiene un
      tanque de 1 m³ y qué le pasa al volumen de un cubo si se duplica su
      arista. La segunda ya la contesta la historia, con esas palabras; de
      las otras dos no sale aquí ni un número (ni 2, ni 3, ni 4, ni 8, ni
      12, ni 24) ni se habla de duplicar. Se cuenta por capas, que es la
      idea, con los números de la historia.
   2. **El litro es un cubito que se ve.** Un decímetro cúbico es un litro
      por definición: un cubito de 10 cm de cada lado. El de muestra se
      queda a la izquierda, grande, todo el tiempo, para que cada cubito
      del tanque se lea como un litro sin tener que acordarse.
   3. **Los 100 litros del conserje son una capa, y se ve cuál.** El fondo
      se pinta de otro color mientras las otras nueve capas suben encima,
      y al lado de cada capa va cuánto se lleva contado: 100 L, 200 L…
      1,000 L. La sonda cuenta los cubitos en el dibujo, bloque por bloque,
      y los compara con el marcador y con esos rótulos.
   4. ⚠️ **La cuenta del tanque no cae en la prueba.** Estaba en tres
      sitios: el verdadero o falso «un tanque de 1 m³ guarda 100 litros»,
      que es la historia palabra por palabra; la selección «si un cubo
      tiene 1,000 cm³, su arista mide…», que es 10 × 10 × 10 al revés; y en
      la operativa, el cubo de 10 cm, pasar 1 m³ a litros o a dm³ y el
      tanque de 1 m³ cuyos litros alcanzan tantos días. Se cambiaron, y el
      tanque de 1 × 1 m del Generador de Tareas también.
   5. **Nada se dice solo con color.** El fondo del conserje lleva su
      rótulo y la frase lo nombra; las aristas del final llevan el «1 m»
      de siempre al lado.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amTanque')) return;

  var ANCHO = 320, ALTO = 216, FIN = 5;

  /* El tanque: N cubitos por lado. Cada cubito mide U píxeles de frente, y
     la hondura se dibuja en diagonal: DX a la derecha y DY hacia arriba por
     cada cubito. La esquina de adelante, abajo y a la izquierda está en
     (X0, Y0). */
  var N = 10, U = 12, DX = 6.6, DY = 5.4, X0 = 66, Y0 = 196;
  /* El litro de muestra: arriba a la izquierda, LE veces más grande. */
  var LX = 10, LY = 76, LE = 2.5;
  /* Lo que cae un bloque al llegar: entra desde un poco más arriba. */
  var CAE = 10;

  var TEXTOS = [
    'El tanque de la escuela, lleno: un metro de cada lado. ¿Cuántos litros de agua tiene? Decídelo antes de tocar.',
    'Un litro de agua llena justo un cubito de 10 cm de cada lado. Con cubitos así se cuenta el agua.',
    'En un metro caben 10 cubitos en fila, porque 10 × 10 cm son 100 cm. Esa fila son 10 litros.',
    'Diez filas cubren el fondo: 10 × 10 = 100 cubitos. Los 100 litros del conserje llenan solo el fondo.',
    'Pero el tanque también mide un metro de alto: le caben 10 capas como esa, una encima de otra.',
    'Diez de largo, diez de ancho y diez de alto: 10 × 10 × 10 = 1,000 litros. Alcanzaba para la semana.'
  ];

  var A;
  var agua = [], muestra, uno = {}, fila = [], filas = [], capas = [], fondo = [], rotulos = [], aristas = [];

  function r2(v) { return Math.round(v * 100) / 100; }
  /* Dónde cae, en el dibujo, el punto (x, y, z) del tanque: x a lo largo, y
     hacia arriba y z hacia el fondo, contados en cubitos. */
  function P(x, y, z) { return [X0 + x * U + z * DX, Y0 - y * U - z * DY]; }
  /* Lo mismo, desde la esquina de un bloque: así un bloque se dibuja una vez
     y se pone donde va con un solo movimiento. */
  function Q(x, y, z) { return [x * U + z * DX, -y * U - z * DY]; }
  function lista(l) { return l.map(function (p) { return r2(p[0]) + ',' + r2(p[1]); }).join(' '); }
  function seg(a, b) { return 'M ' + r2(a[0]) + ' ' + r2(a[1]) + ' L ' + r2(b[0]) + ' ' + r2(b[1]) + ' '; }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Un bloque de l cubitos de largo, h de alto y p de hondo: sus tres caras
     que se ven (el frente, arriba y el lado derecho) y las rayas entre
     cubito y cubito, para que se puedan contar. */
  function bloque(padre, l, h, p) {
    var g = A.el('g', null, padre);
    A.el('polygon', { class: 'tq-cara tq-frente', points: lista([Q(0, 0, 0), Q(l, 0, 0), Q(l, h, 0), Q(0, h, 0)]) }, g);
    A.el('polygon', { class: 'tq-cara tq-arriba', points: lista([Q(0, h, 0), Q(l, h, 0), Q(l, h, p), Q(0, h, p)]) }, g);
    A.el('polygon', { class: 'tq-cara tq-lado', points: lista([Q(l, 0, 0), Q(l, 0, p), Q(l, h, p), Q(l, h, 0)]) }, g);
    var d = '', i;
    for (i = 1; i < l; i++) d += seg(Q(i, 0, 0), Q(i, h, 0)) + seg(Q(i, h, 0), Q(i, h, p));
    for (i = 1; i < p; i++) d += seg(Q(0, h, i), Q(l, h, i)) + seg(Q(l, 0, i), Q(l, h, i));
    for (i = 1; i < h; i++) d += seg(Q(0, i, 0), Q(l, i, 0)) + seg(Q(l, i, 0), Q(l, i, p));
    if (d) A.el('path', { class: 'tq-raya', d: d }, g);
    return g;
  }

  /* Un bloque con su sitio en el tanque, dicho en sus datos: la sonda mide
     que el dibujo esté donde el bloque dice que está. */
  function bloqueEn(padre, x, y, z, l, h, p) {
    var b = { x: x, y: y, z: z };
    b.g = bloque(padre, l, h, p);
    b.g.setAttribute('class', 'tq-bloque');
    b.g.setAttribute('data-x', x); b.g.setAttribute('data-y', y); b.g.setAttribute('data-z', z);
    b.g.setAttribute('data-l', l); b.g.setAttribute('data-h', h); b.g.setAttribute('data-p', p);
    return b;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el, k;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── Lo de atrás del tanque: las tres aristas que no se ven, en raya
       cortada, y el agua. El agua va detrás de los cubitos: los cubitos la
       cuentan, y lo que falta por contar se sigue viendo, más tenue. ── */
    el('path', { class: 'am-linea', d: seg(P(0, 0, 0), P(0, 0, N)) + seg(P(0, 0, N), P(N, 0, N)) + seg(P(0, 0, N), P(0, N, N)) }, svg);
    var gAgua = el('g', { class: 'tq-agua-g' }, svg);
    [[P(0, 0, 0), P(N, 0, 0), P(N, N, 0), P(0, N, 0)],
      [P(0, N, 0), P(N, N, 0), P(N, N, N), P(0, N, N)],
      [P(N, 0, 0), P(N, 0, N), P(N, N, N), P(N, N, 0)]].forEach(function (c) {
      agua.push(el('polygon', { class: 'tq-agua', points: lista(c) }, gAgua));
    });

    /* ── El fondo, fila por fila, de atrás hacia adelante: lo de adelante se
       pinta encima de lo de atrás. ── */
    var gFondo = el('g', null, svg);
    for (k = N - 1; k >= 1; k--) filas.push(bloqueEn(gFondo, 0, 0, k, N, 1, 1));
    filas.reverse();   // queda en orden: la fila 1, la 2… la 9

    /* La primera fila, cubito por cubito, de izquierda a derecha. El primero
       es el que entra desde la muestra: va en dos piezas, la de fuera se
       enciende y la de dentro viaja, porque las dos cosas comparten la
       demora (--d) y con una sola pieza viajaría mientras aparece. */
    uno.capa = el('g', { class: 'am-fuera' }, gFondo);
    uno.pieza = bloque(uno.capa, 1, 1, 1);
    uno.pieza.setAttribute('class', 'tq-bloque');
    uno.pieza.setAttribute('data-x', 0); uno.pieza.setAttribute('data-y', 0); uno.pieza.setAttribute('data-z', 0);
    uno.pieza.setAttribute('data-l', 1); uno.pieza.setAttribute('data-h', 1); uno.pieza.setAttribute('data-p', 1);
    for (k = 1; k < N; k++) fila.push(bloqueEn(gFondo, k, 0, 0, 1, 1, 1));
    fondo = [uno.pieza].concat(fila.map(function (b) { return b.g; }), filas.map(function (b) { return b.g; }));

    /* ── Las capas de encima, de abajo hacia arriba. ── */
    for (k = 1; k < N; k++) capas.push(bloqueEn(svg, 0, k, 0, N, 1, N));

    /* ── El tanque: sus aristas que se ven, encima de todo. ── */
    el('path', {
      class: 'tq-tanque',
      d: 'M ' + lista([P(0, 0, 0), P(N, 0, 0), P(N, 0, N), P(N, N, N), P(0, N, N), P(0, N, 0)]).split(' ').join(' L ') + ' Z ' +
        seg(P(0, N, 0), P(N, N, 0)) + seg(P(N, N, 0), P(N, 0, 0)) + seg(P(N, N, 0), P(N, N, N))
    }, svg);

    /* Las tres aristas del final: largo, alto y ancho, las mismas que llevan
       su «1 m». */
    [[P(0, 0, 0), P(N, 0, 0), 'largo'], [P(0, 0, 0), P(0, N, 0), 'alto'], [P(N, 0, 0), P(N, 0, N), 'ancho']].forEach(function (a) {
      aristas.push(el('path', { class: 'tq-arista', 'data-arista': a[2], d: seg(a[0], a[1]) }, svg));
    });

    /* ── Los rótulos: el metro de cada arista y lo que se lleva contado al
       lado de cada capa. ── */
    var m = P(N / 2, 0, 0);
    texto(svg, { class: 'am-rotulo tq-metro', 'data-arista': 'largo', x: r2(m[0]), y: r2(m[1] + 15), 'text-anchor': 'middle', 'font-size': 12.5 }, '1 m');
    m = P(0, N / 2, 0);
    texto(svg, { class: 'am-rotulo tq-metro', 'data-arista': 'alto', x: r2(m[0] - 5), y: r2(m[1] + 4), 'text-anchor': 'end', 'font-size': 12.5 }, '1 m');
    m = P(N, 0, N / 2);
    texto(svg, { class: 'am-rotulo tq-metro', 'data-arista': 'ancho', x: r2(m[0] + 8), y: r2(m[1] + 14), 'font-size': 12.5 }, '1 m');
    for (k = 0; k < N; k++) {
      var q = P(N, k + 0.5, N);
      rotulos.push(texto(svg, { class: 'am-rotulo tq-cuenta am-fuera', 'data-capa': k, x: r2(q[0] + 5), y: r2(q[1] + 3.5), 'font-size': 10.5 },
        (100 * (k + 1)).toLocaleString('en-US') + ' L'));
    }

    /* ── El litro de muestra: el mismo cubito, más grande, con su medida. ── */
    muestra = el('g', { class: 'am-fuera' }, svg);
    var gm = bloque(muestra, 1, 1, 1);
    gm.setAttribute('class', 'tq-muestra');
    gm.setAttribute('transform', 'translate(' + LX + ' ' + LY + ') scale(' + LE + ')');
    texto(muestra, { class: 'am-rotulo tq-litro', x: r2(LX + (U + DX) * LE / 2), y: r2(LY - (U + DY) * LE - 6), 'text-anchor': 'middle', 'font-size': 12 }, '1 litro');
    texto(muestra, { class: 'am-rotulo tq-diez', x: r2(LX + U * LE / 2), y: r2(LY + 14), 'text-anchor': 'middle', 'font-size': 11.5 }, '10 cm');
  }

  function ponBloque(b, si, demora) {
    var p = P(b.x, b.y, b.z);
    A.mover(b.g, p[0], p[1] - (si ? 0 : CAE), 0, 1, demora);
    A.ver(b.g, si, demora);
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);

    /* El agua: llena al principio, y tenue mientras se cuenta. */
    agua.forEach(function (c) { c.style.fillOpacity = n === 0 ? 0.5 : 0.14; });

    /* El litro de muestra, y el primer cubito que sale de ella: se enciende
       encima de la muestra y después baja a su esquina. */
    A.ver(muestra, n >= 1, n === 1 && ida ? 200 : 0);
    A.ver(uno.capa, n >= 1, n === 1 && ida ? 800 : 0);
    var p0 = P(0, 0, 0);
    if (n >= 1) A.mover(uno.pieza, p0[0], p0[1], 0, 1, n === 1 && ida ? 1300 : 0);
    else A.mover(uno.pieza, LX, LY, 0, LE, 0);

    /* La primera fila, el fondo y las capas. */
    fila.forEach(function (b, i) { ponBloque(b, n >= 2, n === 2 && ida ? 150 * (i + 1) : 0); });
    filas.forEach(function (b, i) { ponBloque(b, n >= 3, n === 3 && ida ? 100 + 140 * i : 0); });
    capas.forEach(function (b, i) { ponBloque(b, n >= 4, n === 4 && ida ? 100 + 150 * i : 0); });

    /* El fondo del conserje, de otro color mientras se compara con lo demás. */
    var contado = n === 3 || n === 4;
    fondo.forEach(function (g) { g.classList.toggle('tq-contado', contado); });

    /* Lo que se lleva contado: el fondo al llenarse y cada capa al llegar. */
    rotulos.forEach(function (t, k) {
      if (k === 0) A.ver(t, n >= 3, n === 3 && ida ? 1500 : 0);
      else A.ver(t, n >= 4, n === 4 && ida ? 100 + 150 * (k - 1) + 400 : 0);
    });

    /* Las tres aristas: largo, alto y ancho. */
    aristas.forEach(function (a, i) { A.trazar(a, n === 5, n === 5 && ida ? 200 + 450 * i : 0); });
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: 'litros en el tanque' },
      { cifra: '1 L', palabras: 'un cubito de 10 cm' },
      { cifra: '10 L', palabras: 'una fila: 10 cubitos' },
      { cifra: '100 L', palabras: 'el fondo: 10 filas de 10' },
      { cifra: '1,000 L', palabras: '10 capas de 100' },
      { cifra: '1,000 L', palabras: '10 × 10 × 10 cubitos' }
    ][n];
  }

  AnimacionMision.montar('#amTanque', {
    vista: [ANCHO, ALTO],
    describe: 'El tanque de la escuela, de un metro de cada lado, se cuenta con cubitos de un litro, de 10 cm de cada lado: 10 en una fila, 100 en el fondo y 10 capas de 100 hasta arriba, que son 1,000 litros.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🧊 Un litro', '➡️ Una fila', '🟦 El fondo', '⬆️ Las capas', '🔢 La cuenta', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
