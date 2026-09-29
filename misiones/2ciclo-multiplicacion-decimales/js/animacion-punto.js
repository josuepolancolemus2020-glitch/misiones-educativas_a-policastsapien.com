/* ============================================================
   M.E.T.A.S · Multiplicación de Decimales · El punto que se cuenta
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de
   doña Chepa, que despachó 3.5 libras de frijol a L 12.50 la
   libra, hizo la cuenta sin el punto (35 × 125 = 4375) y por poco
   le cobra L 4,375 a la señora. El aparato (botones, frase,
   marcador) vive en js/animacion-mision.js; aquí solo está el
   dibujo y dónde va cada pieza en cada paso.

   Arriba va la compra de verdad (3.5 × 12.50 = ?) y abajo la
   cuenta de doña Chepa (35 × 125 = 4375), en cuadrícula, como en
   el cuaderno: una cifra por cuadro, y el punto en la raya. Lo que
   enseña, en el orden en que se aprende:

     0  la cuenta está bien hecha: ¿dónde va el punto?
     1  quitarle el punto a 3.5 es correrlo un lugar a la derecha:
        35 es diez veces 3.5;
     2  el 0 del final de 12.50 no cambia nada (12.50 es 12.5), y
        sin el punto queda 125: otra vez diez veces;
     3  35 × 125 es la cuenta de otra compra, 35 libras a L 125:
        cien veces la de verdad;
     4  para volver se divide dos veces entre 10: el punto del total
        salta dos lugares a la izquierda, 43.75;
     5  por eso el punto no se adivina, se cuenta: una cifra decimal
        de 3.5 y una de 12.5 son dos, y el total lleva dos;
     6  y se comprueba: tres barras de L 12.50 y media llegan en la
        regla justo a 43.75.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Aquí el punto salta, y las cifras se quedan quietas.** Es
      el idioma de esta misión («por 10, por 100 y por 1,000 el
      punto salta»), no el de la tabla de valor posicional de las
      dos misiones anteriores. Cada salto a la derecha es × 10 y
      cada salto a la izquierda es ÷ 10: los dos saltos de abajo
      (uno por factor) son los dos de arriba, y eso es la regla.
   2. ⚠️ **Los saltos van POR DEBAJO de las cifras.** Dibujados por
      encima, la curva cruzaba la cifra y «35» se leía «3/5»: en una
      ruta llena de fracciones, eso enseña otra cosa. Por debajo es
      además como se dibujan en el cuaderno.
   3. ⚠️ **El 0 de 12.50 se aparta a la vista, no se calla.** Con
      los números de la historia hay una trampa: 12.50 trae dos
      cifras decimales, pero doña Chepa multiplicó 125, o sea 12.5.
      Quien cuente tres (una de 3.5 y dos de 12.50) sobre 4375 pone
      4.375, y eso no paga ni una libra. Se cuentan las cifras de lo
      que se multiplicó, y el 0 queda pálido y en su cuadro de raya
      cortada para que se vea que no entra.
   4. ⚠️ **Lo que va debajo NO se regala.** El «Predice» pregunta dónde
      va el punto en 2.5 × 1.3, cuánto es 0.2 × 0.3 y si tres libras
      a L 42.50 pasan de L 100. Aquí no sale ninguno de esos números,
      ni un cero de relleno, ni una estimación redondeada: se enseña
      por qué el punto cae donde cae, y la pregunta la contesta él.
   5. **Lo que se dibuja es lo que se cuenta.** La sonda
      `verifica-animacion-mision` lee cada número mirando en qué
      cuadro quedó cada cifra y en qué raya quedó el punto, rehace la
      cuenta, cuenta las cifras marcadas y mide las barras sobre la
      regla, en cada paso.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPunto')) return;

  var ANCHO = 320, ALTO = 182, FIN = 6;

  /* La cuadrícula: un cuadro por cifra, P de ancho. Las cifras de abajo
     caen debajo de las de arriba: la misma cifra, el mismo cuadro, y solo
     cambia en qué raya está el punto. */
  var P = 22, ALTO_CUADRO = 30;
  var BORDE = { a: 26, b: 94, c: 206 };               // dónde empieza cada número
  var CUADROS = { a: 2, b: 4, c: 4 };
  var X_POR = 82, X_IGUAL = 194;
  var Y1 = 50, Y2 = 138, R = 2.8;                      // los dos renglones, y el radio del punto

  function xc(g, k) { return BORDE[g] + P * k + P / 2; }   // el centro del cuadro k
  function raya(g, k) { return BORDE[g] + P * k; }          // la raya de antes del cuadro k
  function medio(g) { return BORDE[g] + P * CUADROS[g] / 2; }

  var COMPRA = { a: '35', b: '1250' };                 // 3.5 × 12.50 = ?
  var CUENTA = { a: '35', b: '125', c: '4375' };       // 35 × 125 = 4375

  /* La regla de la comprobación: de L 0 a L 50. */
  var R0 = 24, R1 = 296, RY = 150, POR_L = (R1 - R0) / 50;

  var TEXTOS = [
    'Doña Chepa multiplicó 35 × 125 y le dio 4375: la cuenta está bien. ¿Dónde va el punto? Decídelo antes de tocar.',
    'Para multiplicar, le quitó el punto a 3.5. Quitarlo es correrlo un lugar a la derecha: 35 es diez veces 3.5.',
    'Al precio le hizo lo mismo. El 0 del final no cambia nada: 12.50 es 12.5. Sin el punto queda 125, otra vez diez veces más.',
    'Así, 35 × 125 es la cuenta de otra compra: 35 libras a L 125. Diez veces más frijol y diez veces más caro: cien veces más.',
    'Para volver a la compra, se divide dos veces entre 10. Cada vez, el punto salta un lugar a la izquierda: 43.75.',
    'Por eso el punto no se adivina: se cuenta. 3.5 trae una cifra decimal y 12.5 trae otra. Son dos, y el total lleva dos.',
    '¿Tiene sentido? Cada libra es una barra de L 12.50. Tres barras y media llegan justo a 43.75.'
  ];

  var A;
  var ceroAparte = null, ceroCaja = null, hueco = [], vuelan = [], puntoTotal = null;
  var cuenta = null, fantasmas = {}, arcos = {}, x100 = [], d10 = [], resaltes = [], rotCuenta = null, rotOtra = null;
  var regla = null, barras = [], marca = [];

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una fila de cuadros de cuaderno. */
  function cuadros(padre, x0, n, y) {
    var el = A.el, g = el('g', { class: 'mp-cuadros' }, padre), d = '';
    for (var k = 0; k <= n; k++) d += 'M ' + (x0 + P * k) + ' ' + (y - 23) + ' V ' + (y - 23 + ALTO_CUADRO);
    d += 'M ' + x0 + ' ' + (y - 23) + ' H ' + (x0 + P * n) + 'M ' + x0 + ' ' + (y - 23 + ALTO_CUADRO) + ' H ' + (x0 + P * n);
    el('rect', { x: x0, y: y - 23, width: P * n, height: ALTO_CUADRO, style: 'fill:var(--card,#fff)' }, g);
    el('path', { d: d, style: 'fill:none;stroke:var(--gray,#636e72);stroke-opacity:0.45;stroke-width:1' }, g);
    return g;
  }

  /* Una cifra escrita. Arriba, del color de la misión (la compra); abajo,
     de lápiz (el cuaderno de doña Chepa). */
  function cifra(padre, fila, grupo, k, c, x, y) {
    return texto(padre, {
      class: (fila === 1 ? 'am-digito' : 'am-letra') + ' mp-cifra',
      'data-fila': fila, 'data-grupo': grupo, 'data-k': k,
      x: x, y: y, 'text-anchor': 'middle', 'font-size': 26
    }, c);
  }

  function punto(padre, fila, grupo, x, y) {
    return A.el('circle', { class: 'mp-punto', 'data-fila': fila, 'data-grupo': grupo, cx: x, cy: y, r: R, style: 'fill:var(--am-pri)' }, padre);
  }

  /* La punta de una flecha que llega a (x, y): dos rayitas a cada lado de
     la dirección de la que viene la raya (hx, hy). */
  function punta(x, y, hx, hy) {
    var l = Math.sqrt(hx * hx + hy * hy), c = Math.cos(0.5), s = Math.sin(0.5), L = 6.5;
    hx /= l; hy /= l;
    function r1(v) { return Math.round(v * 10) / 10; }
    return 'M ' + r1(x + L * (hx * c - hy * s)) + ' ' + r1(y + L * (hx * s + hy * c)) +
      ' L ' + x + ' ' + y + ' L ' + r1(x + L * (hx * c + hy * s)) + ' ' + r1(y + L * (-hx * s + hy * c));
  }

  /* Un salto por debajo de las cifras: la curva por donde pasa el punto,
     con su punta de flecha y su rótulo. Baja 24, que es lo que brinca el
     punto (.am-salta, puesto de cabeza): así el punto va por la curva.
     La raya se corta un poco antes de llegar (en t = 0.84 de la curva):
     con la punta encima del punto que aterriza, los dos juntos se leían
     como un asterisco. */
  function arco(clase, x0, x1, y, rotulo) {
    var el = A.el, g = el('g', { class: clase, 'data-de': x0, 'data-a': x1 }, A.svg);
    var cx = (x0 + x1) / 2, cy = y + 48, t = 0.84;
    function r1(v) { return Math.round(v * 100) / 100; }
    var qx = x0 + t * (cx - x0), qy = y + t * (cy - y);
    var ex = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
    var ey = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * cy + t * t * y;
    var curva = el('path', { class: 'am-trazo mp-curva', d: 'M ' + x0 + ' ' + y + ' Q ' + r1(qx) + ' ' + r1(qy) + ' ' + r1(ex) + ' ' + r1(ey), style: 'stroke-width:1.6;stroke-linecap:round' }, g);
    var pt = el('path', { class: 'am-trazo am-fuera', d: punta(r1(ex), r1(ey), qx - ex, qy - ey), style: 'stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round' }, g);
    var tx = texto(g, { class: 'am-letra mp-salto-txt am-fuera', x: cx, y: y + 38, 'text-anchor': 'middle', 'font-size': 11.5 }, rotulo);
    return { g: g, curva: curva, punta: pt, t: tx };
  }

  /* Un punto que salta: el grupo de fuera va de una raya a otra a paso
     parejo (.am-viaja) y el de dentro brinca (.am-salta). El brinco de
     siempre es hacia arriba; aquí va puesto de cabeza (scale(1,-1)) para
     que baje por la curva, por debajo de las cifras. */
  function saltarin(padre, x, y, anillo) {
    var el = A.el;
    var g = el('g', { class: 'am-viaja' }, padre);
    var f = el('g', { transform: 'scale(1,-1)' }, g);
    var b = el('g', null, f);
    var c = anillo
      ? el('circle', { class: 'mp-fantasma am-fuera', cx: 0, cy: 0, r: R + 0.6, style: 'fill:none;stroke:var(--am-pri);stroke-width:1.3;stroke-dasharray:2 1.6' }, b)
      : el('circle', { class: 'mp-punto am-fuera', 'data-fila': 1, 'data-grupo': 'c', cx: 0, cy: 0, r: R, style: 'fill:var(--am-pri)' }, b);
    A.mover(g, x, y, 0, 1, 0);
    return { g: g, b: b, c: c, x: x, y: y };
  }

  function brincar(b, si, demora) {
    b.classList.remove('am-salta');
    if (si && !A.quieto()) {
      b.style.setProperty('--d', Math.round(demora) + 'ms');
      A.asentar();
      b.classList.add('am-salta');
    }
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── La compra de verdad: 3.5 × 12.50 = ? ── */
    texto(svg, { class: 'am-letra mp-rotulo', x: BORDE.a, y: 13, 'font-size': 12, style: 'fill:var(--gray,#636e72)' }, 'La compra de verdad');
    cuadros(svg, BORDE.a, 2, Y1);
    cuadros(svg, BORDE.b, 4, Y1);
    cuadros(svg, BORDE.c, 4, Y1);

    /* Las cifras decimales que se cuentan (paso 5): resaltadas por DETRÁS
       de las cifras, y cuántas son en un círculo debajo. */
    [['a', 1, 1, '1'], ['b', 2, 2, '1'], ['c', 2, 3, '2']].forEach(function (d) {
      var x0 = raya(d[0], d[1]) + 1.5, x1 = raya(d[0], d[2] + 1) - 1.5, xm = (x0 + x1) / 2;
      var g = el('g', { class: 'mp-cuenta am-fuera', 'data-grupo': d[0], 'data-cuantas': d[3], 'data-x0': x0, 'data-x1': x1 }, svg);
      el('rect', { class: 'am-relleno-2 mp-resalte', x: x0, y: Y1 - 21.5, width: x1 - x0, height: ALTO_CUADRO - 3, rx: 3, style: 'fill-opacity:0.28' }, g);
      el('circle', { cx: xm, cy: Y1 + 21, r: 8, style: 'fill:var(--card,#fff);stroke:var(--am-sec);stroke-width:1.6' }, g);
      texto(g, { class: 'am-letra mp-cuantas', x: xm, y: Y1 + 25.2, 'text-anchor': 'middle', 'font-size': 12 }, d[3]);
      resaltes.push(g);
    });

    texto(svg, { class: 'am-letra', x: X_POR, y: Y1 - 1, 'text-anchor': 'middle', 'font-size': 22 }, '×');
    texto(svg, { class: 'am-letra', x: X_IGUAL, y: Y1 - 1, 'text-anchor': 'middle', 'font-size': 22 }, '=');
    COMPRA.a.split('').forEach(function (c, k) { cifra(svg, 1, 'a', k, c, xc('a', k), Y1); });
    COMPRA.b.split('').forEach(function (c, k) {
      var t = cifra(svg, 1, 'b', k, c, xc('b', k), Y1);
      if (k === 3) ceroAparte = t;
    });
    punto(svg, 1, 'a', raya('a', 1), Y1 - R);
    punto(svg, 1, 'b', raya('b', 2), Y1 - R);
    /* El 0 del final, apartado en su cuadro de raya cortada: vale lo mismo
       con él y sin él. */
    ceroCaja = el('rect', { class: 'am-hueco mp-aparte am-fuera', x: raya('b', 3) + 1.5, y: Y1 - 21.5, width: P - 3, height: ALTO_CUADRO - 3, rx: 3, style: 'stroke:var(--am-pri)' }, svg);

    /* El total: primero un hueco con su signo de pregunta. */
    hueco.push(el('rect', { class: 'am-hueco mp-hueco', x: BORDE.c - 1, y: Y1 - 24, width: P * 4 + 2, height: ALTO_CUADRO + 2, rx: 4, style: 'fill:var(--card,#fff)' }, svg));
    hueco.push(texto(svg, { class: 'am-letra mp-hueco', x: medio('c'), y: Y1 - 1, 'text-anchor': 'middle', 'font-size': 24 }, '?'));

    /* ── La cuenta de doña Chepa: 35 × 125 = 4375, sin un solo punto ── */
    cuenta = el('g', { class: 'mp-renglon2 am-capa' }, svg);
    rotCuenta = texto(cuenta, { class: 'am-letra mp-rotulo', x: BORDE.a, y: Y2 - 33, 'font-size': 12, style: 'fill:var(--gray,#636e72)' }, 'La cuenta de doña Chepa, sin punto');
    rotOtra = texto(cuenta, { class: 'am-letra mp-rotulo am-fuera', x: BORDE.a, y: Y2 - 33, 'font-size': 12, style: 'fill:var(--gray,#636e72)' }, 'Otra compra: 35 libras a L 125');
    cuadros(cuenta, BORDE.a, 2, Y2);
    cuadros(cuenta, BORDE.b, 3, Y2);
    cuadros(cuenta, BORDE.c, 4, Y2);
    texto(cuenta, { class: 'am-letra', x: X_POR, y: Y2 - 1, 'text-anchor': 'middle', 'font-size': 22 }, '×');
    texto(cuenta, { class: 'am-letra', x: X_IGUAL, y: Y2 - 1, 'text-anchor': 'middle', 'font-size': 22 }, '=');
    CUENTA.a.split('').forEach(function (c, k) { cifra(cuenta, 2, 'a', k, c, xc('a', k), Y2); });
    CUENTA.b.split('').forEach(function (c, k) { cifra(cuenta, 2, 'b', k, c, xc('b', k), Y2); });
    CUENTA.c.split('').forEach(function (c, k) { cifra(cuenta, 2, 'c', k, c, xc('c', k), Y2); });

    /* Por dónde se fue el punto de cada factor: un salto a la derecha,
       × 10, y el punto queda con raya cortada al final (ya no se ve). */
    arcos.a = arco('mp-x10', raya('a', 1), raya('a', 2), Y2 - R, '×10');
    arcos.b = arco('mp-x10', raya('b', 2), raya('b', 3), Y2 - R, '×10');
    cuenta.appendChild(arcos.a.g);
    cuenta.appendChild(arcos.b.g);
    fantasmas.a = saltarin(cuenta, raya('a', 1), Y2 - R, true);
    fantasmas.b = saltarin(cuenta, raya('b', 2), Y2 - R, true);

    /* Cien veces: la flecha que baja de la compra a la cuenta. */
    x100.push(el('path', { class: 'am-trazo mp-x100', d: 'M ' + medio('c') + ' ' + (Y1 + 13) + ' L ' + medio('c') + ' ' + (Y2 - 26), style: 'stroke-width:1.6;stroke-linecap:round' }, svg));
    x100.push(el('path', { class: 'am-trazo mp-x100 am-fuera', d: punta(medio('c'), Y2 - 26, 0, -1), style: 'stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round' }, svg));
    x100.push(texto(svg, { class: 'am-letra mp-x100 am-fuera', x: medio('c') + 8, y: (Y1 + Y2) / 2 - 2, 'font-size': 13 }, '×100'));

    /* El total de verdad: las cifras de doña Chepa suben al renglón de la
       compra, y el punto entra por la raya del final y salta dos veces. */
    CUENTA.c.split('').forEach(function (c, k) {
      var g = el('g', { class: 'mp-sube' }, svg);
      cifra(g, 1, 'c', k, c, 0, 0);
      A.mover(g, xc('c', k), Y2, 0, 1, 0);
      A.ver(g, false);
      vuelan.push(g);
    });
    d10.push(arco('mp-d10', raya('c', 4), raya('c', 3), Y1 - R, '÷10'));
    d10.push(arco('mp-d10', raya('c', 3), raya('c', 2), Y1 - R, '÷10'));
    var g1 = el('g', { class: 'am-viaja' }, svg);
    A.mover(g1, raya('c', 4), Y1 - R, 0, 1, 0);
    var f1 = el('g', { transform: 'scale(1,-1)' }, g1);
    var b1 = el('g', null, f1);
    var g2 = el('g', { class: 'am-viaja' }, b1);
    A.mover(g2, 0, 0, 0, 1, 0);
    var b2 = el('g', null, g2);
    var pt = el('circle', { class: 'mp-punto am-fuera', 'data-fila': 1, 'data-grupo': 'c', cx: 0, cy: 0, r: R, style: 'fill:var(--am-pri)' }, b2);
    puntoTotal = { g1: g1, b1: b1, g2: g2, b2: b2, c: pt };

    /* ── La regla de la comprobación ──
       De L 0 a L 50, y encima una barra de L 12.50 por libra. Sale en el
       paso 6 en el lugar de la cuenta de doña Chepa. */
    regla = el('g', { class: 'mp-regla am-capa am-fuera' }, svg);
    el('path', { class: 'mp-linea', d: 'M ' + R0 + ' ' + RY + ' H ' + R1, style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:1.4' }, regla);
    for (var v = 0; v <= 50; v += 5) {
      var xv = R0 + v * POR_L, larga = v % 10 === 0;
      el('path', { d: 'M ' + xv + ' ' + RY + ' V ' + (RY + (larga ? 7 : 4)), style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:1.2' }, regla);
      if (larga) texto(regla, { class: 'am-letra mp-tick', 'data-v': v, x: xv, y: RY + 20, 'text-anchor': 'middle', 'font-size': 11.5 }, 'L ' + v);
    }
    [1, 1, 1, 0.5].forEach(function (lb, i) {
      var x0 = R0 + i * 12.5 * POR_L, w = lb * 12.5 * POR_L;
      var g = el('g', { class: 'mp-barra am-fuera', 'data-libras': lb }, regla);
      el('rect', { class: 'am-relleno mp-barra-r', x: x0, y: RY - 30, width: w, height: 22, rx: 3, style: 'fill-opacity:0.22;stroke:var(--am-pri);stroke-width:1.3' }, g);
      texto(g, { class: 'am-letra', x: x0 + w / 2, y: RY - 15, 'text-anchor': 'middle', 'font-size': lb === 1 ? 11.5 : 13 }, lb === 1 ? '1 libra' : '½');
      barras.push(g);
    });
    var xFin = R0 + 43.75 * POR_L;
    marca.push(el('path', { class: 'mp-marca am-fuera', d: 'M ' + xFin + ' ' + (RY - 38) + ' V ' + (RY + 2), style: 'fill:none;stroke:var(--am-sec);stroke-width:1.6;stroke-dasharray:3 2' }, regla));
    marca.push(texto(regla, { class: 'am-digito mp-marca am-fuera', x: xFin, y: RY - 42, 'text-anchor': 'middle', 'font-size': 15 }, '43.75'));
  }

  function pintar(n, antes) {
    var adelante = n > antes;
    function d(ms) { return adelante ? ms : 0; }

    /* El renglón de doña Chepa se lee de otra forma en el paso 3, y en el
       paso 6 le deja su sitio a la regla. */
    /* Un rótulo se enciende cuando el otro ya se apagó (medio segundo):
       encimados a media luz se leían como una sola línea revuelta. */
    A.ver(cuenta, n < 6);
    A.ver(rotCuenta, n !== 3, n !== 3 ? 500 : 0);
    A.ver(rotOtra, n === 3, n === 3 ? (adelante ? 700 : 500) : 0);

    /* El 0 de 12.50 se aparta desde el paso 2. */
    var aparte = n >= 2;
    ceroAparte.style.opacity = aparte ? '0.35' : '';
    A.ver(ceroCaja, aparte, d(150));

    /* Los dos saltos de abajo: uno por factor, cada uno × 10. */
    [['a', 1, 700], ['b', 2, 800]].forEach(function (s) {
      var f = fantasmas[s[0]], dentro = n >= s[1], llega = adelante && n === s[1];
      A.ver(f.c, dentro, llega ? s[2] - 450 : 0);
      A.mover(f.g, f.x + (dentro ? P : 0), f.y, 0, 1, llega ? s[2] : 0);
      brincar(f.b, llega, s[2]);
      A.trazar(arcos[s[0]].curva, dentro, llega ? s[2] : 0);
      A.ver(arcos[s[0]].punta, dentro, llega ? s[2] + 700 : 0);
      A.ver(arcos[s[0]].t, dentro, llega ? s[2] + 600 : 0);
    });

    /* Cien veces. */
    A.trazar(x100[0], n === 3, d(n === 3 ? 250 : 0));
    A.ver(x100[1], n === 3, d(n === 3 ? 950 : 0));
    A.ver(x100[2], n === 3, d(n === 3 ? 950 : 0));

    /* El total de verdad: el hueco se va, las cifras suben y el punto salta. */
    var total = n >= 4, llega4 = adelante && n === 4;
    hueco.forEach(function (h) { A.ver(h, !total); });
    vuelan.forEach(function (g, k) {
      var dem = llega4 ? 150 + k * 90 : 0;
      A.mover(g, xc('c', k), total ? Y1 : Y2, 0, 1, dem);
      A.ver(g, total, dem);
    });
    var pt = puntoTotal;
    A.ver(pt.c, total, llega4 ? 950 : 0);
    A.mover(pt.g1, raya('c', 4) + (total ? -P : 0), Y1 - R, 0, 1, llega4 ? 1250 : 0);
    A.mover(pt.g2, total ? -P : 0, 0, 0, 1, llega4 ? 2150 : 0);
    brincar(pt.b1, llega4, 1250);
    brincar(pt.b2, llega4, 2150);
    d10.forEach(function (s, i) {
      var dem = llega4 ? 1250 + i * 900 : 0;
      A.trazar(s.curva, n === 4, dem);
      A.ver(s.punta, n === 4, llega4 ? dem + 700 : 0);
      A.ver(s.t, n === 4, llega4 ? dem + 500 : 0);
    });

    /* Se cuenta: una, una, y dos. */
    resaltes.forEach(function (g, i) { A.ver(g, n === 5, d(n === 5 ? 250 + i * 450 : 0)); });

    /* La regla: tres barras y media. */
    A.ver(regla, n === 6, d(250));
    barras.forEach(function (g, i) { A.ver(g, n === 6, d(n === 6 ? 600 + i * 330 : 0)); });
    marca.forEach(function (m) { A.ver(m, n === 6, d(n === 6 ? 2050 : 0)); });
  }

  function marcador(n, antes) {
    var adelante = n > antes;
    return [
      { cifra: '4375', palabras: '¿L 4,375 por 3.5 libras?' },
      { cifra: '35', palabras: '3.5 sin punto: diez veces más', salto: adelante ? '×10' : '' },
      { cifra: '125', palabras: '12.5 sin punto: diez veces más', salto: adelante ? '×10' : '' },
      { cifra: '4375', palabras: 'cien veces la compra' },
      { cifra: '43.75', palabras: 'el precio de verdad', salto: adelante ? '÷100' : '' },
      { cifra: '1 + 1 = 2', palabras: 'cifras decimales' },
      { cifra: 'L 43.75', palabras: 'L 4,375 ni cabe en la regla' }
    ][n];
  }

  AnimacionMision.montar('#amPunto', {
    vista: [ANCHO, ALTO],
    describe: 'Arriba, la compra de 3.5 libras a L 12.50; abajo, la cuenta de doña Chepa, 35 × 125 = 4375, en cuadrícula. El punto salta de una raya a otra, y al final una regla en lempiras con tres barras y media.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['✂️ ¿Por qué 35?', '🏷️ ¿Y el 125?', '🧮 ¿Qué cuenta hizo?',
        '↩️ Volver a la compra', '🔢 ¿Hay un atajo?', '📏 ¿Tiene sentido?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
