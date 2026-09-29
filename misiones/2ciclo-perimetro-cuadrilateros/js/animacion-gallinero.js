/* ============================================================
   M.E.T.A.S · Perímetro y Área de Cuadriláteros · El gallinero de Don Chele
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Don Chele:
   fue a comprar malla para cercar el gallinero, midió lo de adentro en
   vez de la orilla, le faltó malla, tapó el hueco con unas tablas y esa
   noche se le salieron las gallinas. El aparato (botones, frase,
   marcador) vive en js/animacion-mision.js; aquí solo está el dibujo y
   dónde va cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  el gallinero, de 4 m por 2 m y visto desde arriba: ¿cuántos
        metros de malla hay que comprar? Se decide antes de tocar;
     1  lo que midió Don Chele: lo de adentro, 8 cuadritos de un metro
        por lado (2 filas de 4). Pidió 8 metros de malla;
     2  la malla va por la orilla, metro a metro, y con 8 metros no
        alcanza: faltan 4. Por las tablas se sale una gallina;
     3  la orilla se mide sumando sus cuatro lados: 4 + 2 + 4 + 2 = 12
        metros. Eso es el perímetro;
     4  por qué no dan lo mismo: un metro de malla es una raya, y un
        metro cuadrado es un cuadrito;
     5  con 12 metros de malla, el gallinero cierra. El área va en
        metros cuadrados y la orilla, en metros.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que va debajo NO se regala.** El «Predice» pregunta el
      perímetro de un cuadrado de 5 cm, el área de un rectángulo de 6 × 4
      y qué se calcula para poner una cerca. La tercera ya la contesta la
      historia; de las otras dos, aquí no sale ni un número (ni 5, ni 6, ni
      10, ni 20, ni 24, ni 25). Se enseña el concepto con otro terreno.
   2. **Un gallinero donde la orilla da MÁS que lo de adentro**, que es lo
      que le pasó a Don Chele: 12 m de orilla y 8 m² de adentro. Las
      cuentas del Aprende y del «Predice» van todas al revés (lo de adentro
      da más), y sin este caso el alumno se queda con la regla falsa de que
      el área siempre es el número grande. Es la regla de los juegos 3D de
      esta misma misión.
   3. **La malla se pone metro a metro, poste por poste**, y se ve dónde se
      acaba: el hueco es lo que faltó, no una frase. La sonda mide cada
      tramo en el dibujo y cuenta los metros.
   4. ⚠️ **La cuenta del gallinero no cae en la prueba.** Se buscaron el
      4 × 2, sus 8 m², sus 12 m y el lado que falta sabiendo uno de ellos en
      los bancos de la conceptual, en la ficha y en las treinta formas de la
      operativa: no sale en ninguna. Con un gallinero de 4 × 3 caía en
      nueve formas.
   5. **Nada se dice solo con color.** Los cuadritos de adentro llevan su
      número, la malla lleva sus postes, lo que falta va en raya cortada y
      las tablas son tablas. La gallina que se sale se sale de verdad: pasa
      por la rendija de la esquina y queda afuera.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amGallinero')) return;

  var ANCHO = 320, ALTO = 206, FIN = 5;

  /* El gallinero: 4 m por 2 m, a S píxeles por metro, con la esquina de
     arriba a la izquierda en (X0, Y0). */
  var LARGO = 4, ANCHO_G = 2, S = 58, X0 = 44, Y0 = 46;
  var COMPRO = LARGO * ANCHO_G;               // lo de adentro: lo que pidió
  var ORILLA = 2 * (LARGO + ANCHO_G);         // la orilla: lo que hacía falta
  /* Dónde está la gallina que se sale: adentro, o afuera después de salirse
     por la rendija que dejan las tablas en la esquina. El camino de una a
     otra pasa justo por esa rendija. */
  var ADENTRO = [1, 1], AFUERA = [-0.45, 2.5];

  var TEXTOS = [
    'El gallinero, visto desde arriba. ¿Cuántos metros de malla hacen falta para cercarlo? Decídelo antes de tocar.',
    'Don Chele midió lo de adentro: caben 8 cuadritos de un metro por lado, 2 filas de 4. Pidió 8 metros de malla.',
    'La malla va por la orilla, metro a metro. Con 8 metros no alcanza: faltan 4, y por las tablas se salió una gallina.',
    'La orilla se mide sumando sus cuatro lados: 4 + 2 + 4 + 2 = 12 metros. Eso es el perímetro.',
    'Un metro de malla es una raya de un metro. Un metro cuadrado es un cuadrito de un metro por lado.',
    'Con 12 metros de malla el gallinero cierra. Lo de adentro, el área, va en metros cuadrados; la orilla, el perímetro, en metros.'
  ];

  var A;
  var cuadros = [], numeros = [], rejilla, postes = [], tramos = [], hueco, tablas, orilla = [], lados = [];
  var unidad = {}, gallinas = [];

  function r2(v) { return Math.round(v * 100) / 100; }
  /* Un punto del gallinero, en metros desde la esquina de arriba a la
     izquierda, puesto en el dibujo. */
  function pt(x, y) { return [r2(X0 + x * S), r2(Y0 + y * S)]; }
  /* Los postes de la orilla, uno por metro, en el orden en que se pone la
     malla: desde la esquina de arriba a la izquierda y en el sentido del
     reloj. El último es otra vez el primero. */
  function recorrido() {
    var p = [], i;
    for (i = 0; i <= LARGO; i++) p.push([i, 0]);
    for (i = 1; i <= ANCHO_G; i++) p.push([LARGO, i]);
    for (i = LARGO - 1; i >= 0; i--) p.push([i, ANCHO_G]);
    for (i = ANCHO_G - 1; i >= 0; i--) p.push([0, i]);
    return p;                                 // 13 puntos: 12 tramos
  }

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una gallina vista de lado, mirando a la izquierda: cuerpo, cola, cabeza
     con su cresta y su pico, y las patas. Va en dos capas: la de fuera camina
     y la de dentro no se toca. */
  function gallina(padre, x, y) {
    var g = A.el('g', { class: 'gl-gallina' }, padre);
    var c = A.el('g', null, g);
    A.el('line', { class: 'gl-pata', x1: -2, y1: 5, x2: -2, y2: 10 }, c);
    A.el('line', { class: 'gl-pata', x1: 2.5, y1: 5, x2: 2.5, y2: 10 }, c);
    A.el('polygon', { class: 'gl-pluma', points: '7,-3 14,-10 13,1' }, c);
    A.el('ellipse', { class: 'gl-pluma', cx: 0, cy: 0, rx: 9, ry: 6.5 }, c);
    A.el('circle', { class: 'gl-cresta', cx: -9.5, cy: -12, r: 2 }, c);
    A.el('circle', { class: 'gl-cresta', cx: -7, cy: -12.6, r: 2 }, c);
    A.el('circle', { class: 'gl-pluma', cx: -8, cy: -7.5, r: 4.5 }, c);
    A.el('polygon', { class: 'gl-pico', points: '-12.2,-8.4 -16,-7 -12.2,-5.8' }, c);
    A.el('circle', { class: 'gl-ojo', cx: -9.3, cy: -8.4, r: 0.9 }, c);
    A.mover(g, x, y, 0, 1, 0);
    return g;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    /* El alambre de la malla: un rombo que se repite. Con él la malla se
       reconoce como malla y no como una raya gris, y se distingue de las
       tablas sin tener que distinguir colores. */
    var defs = el('defs', null, svg);
    var alambre = el('pattern', { id: 'amGallineroMalla', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('rect', { class: 'gl-malla-fondo', width: 6, height: 6 }, alambre);
    el('path', { class: 'gl-alambre', d: 'M 0 0 H 6 M 0 0 V 6' }, alambre);

    el('rect', { class: 'gl-pasto', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);
    var a = pt(0, 0), b = pt(LARGO, ANCHO_G);
    el('rect', { class: 'gl-piso', x: a[0], y: a[1], width: b[0] - a[0], height: b[1] - a[1] }, svg);

    /* ── Lo de adentro: los cuadritos de un metro por lado, con su número. ── */
    for (var f = 0; f < ANCHO_G; f++) {
      for (var c = 0; c < LARGO; c++) {
        var q = pt(c, f), k = f * LARGO + c + 1;
        cuadros.push(el('rect', { class: 'gl-cuadro am-fuera', 'data-n': k, x: q[0], y: q[1], width: S, height: S }, svg));
        numeros.push(texto(svg, { class: 'am-digito gl-num am-fuera', x: r2(q[0] + S / 2), y: r2(q[1] + S / 2),
          'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': 17 }, String(k)));
      }
    }
    var d = '';
    for (var i = 1; i < LARGO; i++) { var v = pt(i, 0); d += 'M ' + v[0] + ' ' + a[1] + ' V ' + b[1] + ' '; }
    for (var j = 1; j < ANCHO_G; j++) { var h = pt(0, j); d += 'M ' + a[0] + ' ' + h[1] + ' H ' + b[0] + ' '; }
    rejilla = el('path', { class: 'gl-rejilla am-fuera', d: d.trim() }, svg);

    /* El borde del terreno, en raya cortada: por ahí va la malla. */
    el('rect', { class: 'gl-borde', x: a[0], y: a[1], width: b[0] - a[0], height: b[1] - a[1] }, svg);

    /* ── Lo que faltó: los tramos de la orilla que la malla no alcanzó, y las
       tablas con que Don Chele tapó el hueco. Las tablas dejan una rendija en
       la esquina, y por ahí se sale la gallina. ── */
    var p = recorrido();
    var desde = pt.apply(null, p[COMPRO]), esquina = pt(0, ANCHO_G), fin = pt(0, 0);
    tablas = el('g', { class: 'gl-tablas am-fuera' }, svg);
    el('line', { class: 'gl-tabla', x1: desde[0], y1: desde[1], x2: r2(esquina[0] + 0.3 * S), y2: esquina[1] }, tablas);
    el('line', { class: 'gl-tabla', x1: esquina[0], y1: r2(esquina[1] - 0.3 * S), x2: fin[0], y2: fin[1] }, tablas);
    /* Lo que faltó va ENCIMA de las tablas: son 4 metros sin malla, y las
       tablas no los cambian. En la rendija de la esquina queda solo. */
    hueco = el('path', { class: 'am-hueco gl-hueco am-fuera', d: 'M ' + desde.join(' ') + ' L ' + esquina.join(' ') + ' L ' + fin.join(' ') }, svg);

    /* ── La malla: un tramo por metro, entre poste y poste. ── */
    for (var m = 0; m < ORILLA; m++) {
      var u = pt.apply(null, p[m]), w = pt.apply(null, p[m + 1]);
      tramos.push(el('line', { class: 'gl-malla', 'data-m': m + 1, x1: u[0], y1: u[1], x2: w[0], y2: w[1], stroke: 'url(#amGallineroMalla)' }, svg));
    }
    for (var n = 0; n < ORILLA; n++) {
      var o = pt.apply(null, p[n]);
      postes.push(el('circle', { class: 'gl-poste am-fuera', 'data-m': n, cx: o[0], cy: o[1], r: 3.6 }, svg));
    }

    /* ── La orilla, lado por lado, para contarla. ── */
    var esq = [[0, 0], [LARGO, 0], [LARGO, ANCHO_G], [0, ANCHO_G], [0, 0]];
    for (var s = 0; s < 4; s++) {
      var e0 = pt.apply(null, esq[s]), e1 = pt.apply(null, esq[s + 1]);
      orilla.push(el('line', { class: 'gl-orilla', 'data-lado': s, x1: e0[0], y1: e0[1], x2: e1[0], y2: e1[1] }, svg));
    }
    /* Las medidas de los lados: están desde el principio, porque sin ellas
       no se puede decidir nada. */
    lados = [
      texto(svg, { class: 'am-rotulo gl-lado', 'data-lado': 0, x: r2((a[0] + b[0]) / 2), y: r2(a[1] - 10), 'text-anchor': 'middle', 'font-size': 14 }, LARGO + ' m'),
      texto(svg, { class: 'am-rotulo gl-lado', 'data-lado': 1, x: r2(b[0] + 12), y: r2((a[1] + b[1]) / 2 + 5), 'text-anchor': 'start', 'font-size': 14 }, ANCHO_G + ' m'),
      texto(svg, { class: 'am-rotulo gl-lado', 'data-lado': 2, x: r2((a[0] + b[0]) / 2), y: r2(b[1] + 20), 'text-anchor': 'middle', 'font-size': 14 }, LARGO + ' m'),
      texto(svg, { class: 'am-rotulo gl-lado', 'data-lado': 3, x: r2(a[0] - 12), y: r2((a[1] + b[1]) / 2 + 5), 'text-anchor': 'end', 'font-size': 14 }, ANCHO_G + ' m')
    ];

    /* ── Un metro y un metro cuadrado, uno al lado del otro. ── */
    var qc = pt(2, 0);
    unidad.cuadro = el('rect', { class: 'gl-un-cuadro am-fuera', x: qc[0], y: qc[1], width: S, height: S }, svg);
    unidad.cuadroDice = texto(svg, { class: 'am-rotulo gl-unidad am-fuera', x: r2(qc[0] + S / 2), y: r2(qc[1] + S / 2 + 5), 'text-anchor': 'middle', 'font-size': 14 }, '1 m²');
    /* El metro es el borde de arriba de ese mismo cuadrito: la raya es un
       lado, y el cuadrito entero es lo que encierran sus cuatro lados. */
    var r0 = pt(2, 0), r1 = pt(3, 0);
    unidad.raya = el('line', { class: 'gl-una-raya am-fuera', x1: r0[0], y1: r0[1], x2: r1[0], y2: r1[1] }, svg);
    unidad.rayaDice = texto(svg, { class: 'am-rotulo gl-unidad am-fuera', x: r2((r0[0] + r1[0]) / 2), y: r2(r0[1] - 10), 'text-anchor': 'middle', 'font-size': 14 }, '1 m');

    /* ── Las gallinas: tres adentro, paradas en los cruces de la rejilla para
       no tapar el número de ningún cuadrito; la de la izquierda es la que se
       sale. ── */
    gallinas = [ADENTRO, [2, 1.05], [3.05, 0.95]].map(function (g) { var q = pt(g[0], g[1]); return gallina(svg, q[0], q[1]); });
  }


  function pintar(n, antes) {
    var atras = antes != null && antes > n;
    var ida = !atras;

    /* Lo de adentro: los cuadritos se cuentan uno por uno. */
    cuadros.forEach(function (q, i) { A.ver(q, n === 1 || n === 5, n === 1 && ida ? 150 + 150 * i : 0); });
    numeros.forEach(function (t, i) { A.ver(t, n === 1, n === 1 && ida ? 150 + 150 * i : 0); });
    A.ver(rejilla, n >= 1, n === 1 && ida ? 100 : 0);

    /* La malla: los 8 metros que compró, tramo por tramo, desde el paso 2;
       los 4 que faltaban, al cerrar. */
    tramos.forEach(function (t, i) {
      var puesto = i < COMPRO ? n >= 2 : n >= 5;
      var d = 0;
      if (ida && n === 2 && i < COMPRO) d = 150 + 150 * i;
      if (ida && n === 5 && i >= COMPRO) d = 900 + 150 * (i - COMPRO);
      A.trazar(t, puesto, d);
    });
    postes.forEach(function (p, i) {
      var puesto = i <= COMPRO ? n >= 2 : n >= 5;
      var d = 0;
      if (ida && n === 2 && i <= COMPRO) d = 150 * i;
      if (ida && n === 5 && i > COMPRO) d = 900 + 150 * (i - COMPRO - 1);
      A.ver(p, puesto, d);
    });

    /* Lo que faltó y las tablas: desde que se acaba la malla hasta que se
       cierra. */
    A.ver(hueco, n >= 2 && n <= 4, n === 2 && ida ? 1500 : 0);
    A.ver(tablas, n >= 2 && n <= 4, n === 2 && ida ? 2000 : (n === 5 && ida ? 700 : 0));

    /* La gallina de la esquina: se sale después de que ponen las tablas, y
       vuelve antes de que se cierre la malla. */
    var fuera = n >= 2 && n <= 4;
    var g = fuera ? AFUERA : ADENTRO, dg = 0;
    if (ida && n === 2) dg = 2400;
    var q = pt(g[0], g[1]);
    A.mover(gallinas[0], q[0], q[1], 0, 1, dg);

    /* La orilla, lado por lado. */
    orilla.forEach(function (o, i) { A.trazar(o, n === 3, n === 3 && ida ? 200 + 700 * i : 0); });
    /* En el paso 4 las medidas de los lados se apagan: el «1 m» va encima
       del lado de arriba y no puede quedar al lado de un «4 m». */
    lados.forEach(function (t) { t.classList.toggle('gl-lado-cuenta', n === 3); A.ver(t, n !== 4, 0); });

    /* Un metro y un metro cuadrado. */
    ['cuadro', 'cuadroDice', 'raya', 'rayaDice'].forEach(function (k, i) {
      A.ver(unidad[k], n === 4, n === 4 && ida ? 200 + 350 * i : 0);
    });
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: 'metros de malla' },
      { cifra: COMPRO + ' m²', palabras: 'lo de adentro: 2 filas de 4' },
      { cifra: (ORILLA - COMPRO) + ' m', palabras: 'de malla que faltaron' },
      { cifra: ORILLA + ' m', palabras: '4 + 2 + 4 + 2: el perímetro' },
      { cifra: 'm y m²', palabras: 'una raya y un cuadrito' },
      { cifra: ORILLA + ' m', palabras: 'de malla: el gallinero cierra' }
    ][n];
  }

  AnimacionMision.montar('#amGallinero', {
    vista: [ANCHO, ALTO],
    describe: 'El gallinero de Don Chele visto desde arriba, de 4 m por 2 m: por dentro caben 8 cuadritos de un metro por lado, y la orilla mide 4 + 2 + 4 + 2 = 12 metros. Con 8 metros de malla no alcanza, faltan 4, y una gallina se sale por las tablas. Con 12 metros, cierra.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🟩 Lo de adentro', '🔗 Poner la malla', '📏 La orilla', '🔍 ¿Por qué?', '✅ Cerrarlo', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
