/* ============================================================
   M.E.T.A.S · Sólidos Geométricos · El molde de la caja de Kenia
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Kenia:
   recortó en cartulina el molde de una caja para el regalo del Día de
   la Madre, dobló por las rayas y le quedó una cara de sobra por un
   lado y un hueco por el otro. Era la única cartulina de la casa, y el
   regalo fue sin envolver. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza
   en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  el molde de Kenia sobre la mesa: los lados en tira y las dos
        tapas. ¿Cierra la caja? Se decide antes de tocar;
     1  se dobla por las rayas: los lados dan la vuelta y se juntan, y la
        caja queda abierta arriba y abajo;
     2  las dos tapas iban abajo: una cierra el fondo y a la otra no le
        queda lugar, así que cuelga; arriba queda el hueco;
     3  esa tapa se pega arriba en el molde, y al doblarla cierra la caja
        por arriba;
     4  ahora cierra, y el regalo va envuelto: cada cara pegada donde va.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que va debajo NO se regala.** El «Predice» pregunta si una
      caja de zapatos y un dado tienen las mismas caras, qué sale al girar
      un triángulo y si una cruz de seis cuadrados se dobla en un cubo. La
      tercera ya la contesta la historia («pegadas donde van»); de las
      otras dos aquí no sale nada: no se cuentan caras, ni aristas, ni
      vértices, no hay dado ni cubo y nada gira.
   2. ⚠️ **Y la prueba tampoco: por eso la caja no se nombra ni se cuenta.**
      La prueba pregunta cuántas caras, aristas y vértices tiene casi cada
      cuerpo, y de qué figuras son sus caras. La caja de Kenia es la de
      siempre, un prisma rectangular, que la prueba conceptual no pregunta, y
      la animación no dice cuántas caras tiene: enseña dónde va cada una. La
      operativa sí la preguntaba contada por su forma (un prisma de base de 4
      lados), y ahí el 4 se corre al 5: ver _fueraDeLaCaja.
   3. **Lo que cambia es UNA tapa, y se ve pasar.** Del borde de abajo del
      lado derecho al de arriba del mismo lado, dándose la vuelta como se
      da la vuelta una solapa. En la caja, la que colgaba deja de colgar y
      tapa el hueco.
   4. **El molde y la caja dicen lo mismo, y la sonda lo mide.** Cada pieza
      del molde tiene su cara en la caja, del mismo tamaño en otra escala;
      y de dónde está pegada cada tapa en el molde sale qué boca cierra, si
      sobra y si queda hueco.
   5. **Nada se dice solo con color.** Las tapas son las piezas que salen de
      la tira, la que cuelga lleva «sobra» y el hueco lleva «hueco». La
      tapa que se cambia de lugar va con el borde del color de la misión en
      los dos dibujos.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amMolde')) return;

  var ANCHO = 320, ALTO = 200, FIN = 4;

  /* La caja: LARGO a lo largo, HONDO hacia el fondo y ALTO hacia arriba,
     contados en unidades de cartulina. */
  var LARGO = 4, HONDO = 2, ALTOC = 3;
  /* El molde, a SN píxeles por unidad, con su esquina de arriba a la
     izquierda en (NX, NY). La tira de los lados empieza HONDO + 2 unidades
     más abajo, para que quepa la tapa cuando se pega arriba. */
  var SN = 12.5, NX = 6, NY = 30, TIRA = LARGO;   // la tira empieza a 4 unidades del borde de arriba
  /* La caja, a SB píxeles por unidad, en perspectiva: lo hondo se dibuja en
     diagonal, KX a la derecha y KY hacia arriba por unidad. Su esquina de
     adelante, abajo y a la izquierda está en (BX, BY). */
  var SB = 17, KX = 0.55, KY = 0.45, BX = 202, BY = 108;

  var TEXTOS = [
    'El molde que recortó Kenia, sobre la mesa: los lados en tira y las dos tapas. ¿Cierra la caja? Decídelo antes de tocar.',
    'Se dobla por las rayas: los lados dan la vuelta y se juntan. La caja queda abierta arriba y abajo.',
    'Las dos tapas iban abajo. Una cierra el fondo; a la otra no le queda lugar, y arriba queda el hueco.',
    'Si esa tapa se pega arriba en el molde, al doblarla cierra la caja por arriba.',
    'Ahora sí cierra: cada cara pegada donde va. Eso se revisa en el molde, antes de gastar la cartulina.'
  ];

  var A;
  var tapa2, caja, flecha, hueco, dHueco, tapaArriba, cuelga, dSobra, lazo;

  function r2(v) { return Math.round(v * 100) / 100; }
  function lista(l) { return l.map(function (p) { return r2(p[0]) + ',' + r2(p[1]); }).join(' '); }
  function seg(a, b) { return 'M ' + r2(a[0]) + ' ' + r2(a[1]) + ' L ' + r2(b[0]) + ' ' + r2(b[1]) + ' '; }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  /* Un punto del molde (u a lo ancho, v hacia abajo, en unidades). */
  function N(u, v) { return [NX + u * SN, NY + v * SN]; }
  /* Un punto de la caja (x a lo largo, y hacia arriba, z hacia el fondo). */
  function C(x, y, z) { return [BX + x * SB + z * SB * KX, BY - y * SB - z * SB * KY]; }

  /* Un rectángulo del molde: de (u, v) a (u + an, v + al). */
  function pieza(padre, u, v, an, al, clase, nombre) {
    return A.el('polygon', { class: clase, 'data-pieza': nombre, points: lista([N(u, v), N(u + an, v), N(u + an, v + al), N(u, v + al)]) }, padre);
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El molde. La tira de los lados, de izquierda a derecha: el lado
       izquierdo, el frente, el lado derecho y el de atrás. ── */
    var molde = el('g', { class: 'sg-molde' }, svg);
    pieza(molde, 0, TIRA, HONDO, ALTOC, 'sg-cara sg-lado', 'izquierdo');
    pieza(molde, HONDO, TIRA, LARGO, ALTOC, 'sg-cara sg-lado', 'frente');
    pieza(molde, HONDO + LARGO, TIRA, HONDO, ALTOC, 'sg-cara sg-lado', 'derecho');
    pieza(molde, 2 * HONDO + LARGO, TIRA, LARGO, ALTOC, 'sg-cara sg-lado', 'atras');
    /* La tapa que se queda: pegada abajo del frente, por su lado largo. */
    pieza(molde, HONDO, TIRA + ALTOC, LARGO, HONDO, 'sg-cara sg-tapa', 'tapa-fija').setAttribute('data-pegada', 'frente abajo');
    /* Las rayas por donde se dobla: entre los lados y donde se pega la tapa. */
    var rayas = '';
    [HONDO, HONDO + LARGO, 2 * HONDO + LARGO].forEach(function (u) { rayas += seg(N(u, TIRA), N(u, TIRA + ALTOC)); });
    rayas += seg(N(HONDO, TIRA + ALTOC), N(HONDO + LARGO, TIRA + ALTOC));
    el('path', { class: 'sg-raya', d: rayas }, molde);

    /* La tapa que se cambia de lugar: dibujada desde el borde por donde se
       pega (su lado corto, que mide lo que el lado derecho de ancho) y
       colgando hacia abajo. Pegada arriba es la misma pieza dada vuelta:
       por eso va con giro y no solo movida, y su raya de doblar la acompaña. */
    tapa2 = el('g', { class: 'sg-movil' }, svg);
    A.el('polygon', { class: 'sg-cara sg-tapa sg-movida', 'data-pieza': 'tapa-movil',
      points: lista([[-HONDO * SN / 2, 0], [HONDO * SN / 2, 0], [HONDO * SN / 2, LARGO * SN], [-HONDO * SN / 2, LARGO * SN]]) }, tapa2);
    el('path', { class: 'sg-raya', d: seg([-HONDO * SN / 2, 0], [HONDO * SN / 2, 0]) }, tapa2);

    /* ── La flecha del molde a la caja. ── */
    flecha = el('g', { class: 'am-fuera' }, svg);
    el('path', { class: 'sg-flecha', d: 'M 162 84 Q 177 72 192 84' }, flecha);
    el('path', { class: 'sg-punta', d: 'M 186 78 L 193 85 L 184 87 Z' }, flecha);

    /* ── La caja, en perspectiva. ── */
    caja = el('g', { class: 'am-fuera' }, svg);
    /* Lo que cuelga va detrás de la caja: sale de su borde de abajo. */
    cuelga = el('polygon', { class: 'sg-cara sg-tapa sg-movida am-fuera', 'data-cara': 'tapa-cuelga',
      points: lista([C(LARGO, 0, 0), C(LARGO, 0, HONDO), C(LARGO, -LARGO, HONDO), C(LARGO, -LARGO, 0)]) }, caja);
    el('polygon', { class: 'sg-cara sg-lado', 'data-cara': 'frente',
      points: lista([C(0, 0, 0), C(LARGO, 0, 0), C(LARGO, ALTOC, 0), C(0, ALTOC, 0)]) }, caja);
    el('polygon', { class: 'sg-cara sg-lado sg-sombra', 'data-cara': 'derecho',
      points: lista([C(LARGO, 0, 0), C(LARGO, 0, HONDO), C(LARGO, ALTOC, HONDO), C(LARGO, ALTOC, 0)]) }, caja);
    var arriba = [C(0, ALTOC, 0), C(LARGO, ALTOC, 0), C(LARGO, ALTOC, HONDO), C(0, ALTOC, HONDO)];
    hueco = el('polygon', { class: 'sg-hueco am-fuera', 'data-cara': 'hueco', points: lista(arriba) }, caja);
    tapaArriba = el('polygon', { class: 'sg-cara sg-tapa sg-movida am-fuera', 'data-cara': 'tapa-arriba', points: lista(arriba) }, caja);

    /* El lazo del regalo: una cinta por el frente y por arriba, y el moño. */
    lazo = el('g', { class: 'am-fuera' }, caja);
    var m = LARGO / 2, w = 0.28;
    el('polygon', { class: 'sg-lazo', points: lista([C(m - w, 0, 0), C(m + w, 0, 0), C(m + w, ALTOC, 0), C(m - w, ALTOC, 0)]) }, lazo);
    el('polygon', { class: 'sg-lazo', points: lista([C(m - w, ALTOC, 0), C(m + w, ALTOC, 0), C(m + w, ALTOC, HONDO), C(m - w, ALTOC, HONDO)]) }, lazo);
    var c = C(m, ALTOC, HONDO / 2);
    el('path', { class: 'sg-lazo', d: 'M ' + r2(c[0]) + ' ' + r2(c[1]) + ' c -14 -12 -20 2 0 0 c 14 -12 20 2 0 0 Z' }, lazo);

    /* Los rótulos de la caja. */
    var h = C(LARGO / 2, ALTOC, HONDO);
    dHueco = texto(caja, { class: 'am-rotulo sg-dice am-fuera', 'data-dice': 'hueco', x: r2(h[0]), y: r2(h[1] - 6), 'text-anchor': 'middle', 'font-size': 12 }, 'hueco');
    var s = C(LARGO, -LARGO / 2, 0);
    dSobra = texto(caja, { class: 'am-rotulo sg-dice am-fuera', 'data-dice': 'sobra', x: r2(s[0] - 5), y: r2(s[1] + 4), 'text-anchor': 'end', 'font-size': 12 }, 'sobra');

    /* Las aristas de la caja, encima. */
    el('path', {
      class: 'sg-borde',
      d: 'M ' + lista([C(0, 0, 0), C(LARGO, 0, 0), C(LARGO, 0, HONDO), C(LARGO, ALTOC, HONDO), C(0, ALTOC, HONDO), C(0, ALTOC, 0)]).split(' ').join(' L ') + ' Z ' +
        seg(C(0, ALTOC, 0), C(LARGO, ALTOC, 0)) + seg(C(LARGO, ALTOC, 0), C(LARGO, 0, 0)) + seg(C(LARGO, ALTOC, 0), C(LARGO, ALTOC, HONDO))
    }, caja);
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);

    /* La tapa que se cambia: abajo del lado derecho hasta el paso 2, arriba
       desde el 3, dada vuelta. */
    var abajo = N(HONDO + LARGO + HONDO / 2, TIRA + ALTOC), arriba = N(HONDO + LARGO + HONDO / 2, TIRA);
    if (n >= 3) A.mover(tapa2, arriba[0], arriba[1], 180, 1, n === 3 && ida ? 200 : 0);
    else A.mover(tapa2, abajo[0], abajo[1], 0, 1, 0);

    A.ver(flecha, n >= 1, n === 1 && ida ? 100 : 0);
    A.ver(caja, n >= 1, n === 1 && ida ? 400 : 0);
    /* Arriba: hueco mientras ninguna tapa llega, tapa desde el paso 3. Al
       llegar la tapa, el hueco se va cuando ya quedó tapado: si se fuera
       antes, arriba de la caja no habría ni hueco ni tapa, que no es nada. */
    var tapando = n === 3 && ida;
    A.ver(hueco, n === 1 || n === 2, tapando ? 1400 : 0);
    A.ver(dHueco, n === 1 || n === 2, n === 2 && ida ? 900 : tapando ? 900 : 0);
    A.ver(tapaArriba, n >= 3, tapando ? 900 : 0);
    /* La que no tiene lugar cuelga, solo en el paso 2. */
    A.ver(cuelga, n === 2, n === 2 && ida ? 400 : 0);
    A.ver(dSobra, n === 2, n === 2 && ida ? 900 : 0);
    A.ver(lazo, n === 4, n === 4 && ida ? 300 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: '¿cierra la caja?' },
      { cifra: '2 bocas', palabras: 'abiertas: arriba y abajo' },
      { cifra: '1 boca', palabras: 'abierta, y una tapa de sobra' },
      { cifra: '0 bocas', palabras: 'la caja cierra' },
      { cifra: '0 bocas', palabras: 'cada cara donde va' }
    ][n];
  }

  AnimacionMision.montar('#amMolde', {
    vista: [ANCHO, ALTO],
    describe: 'El molde de la caja de Kenia, con los lados en tira y las dos tapas pegadas abajo: al doblarlo, una tapa cierra el fondo, la otra cuelga porque no le queda lugar y arriba queda un hueco. Pegada arriba en el molde, la segunda tapa cierra la caja.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['📐 Doblar los lados', '📦 Doblar las tapas', '✂️ Cambiar la tapa', '🎁 Cerrar la caja', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
