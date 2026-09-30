/* ============================================================
   M.E.T.A.S · El Universo y el Sistema Solar ·
   «La vuelta que trae las lluvias»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de don
   Tulio: él siembra cuando entran las lluvias; si se adelanta, la
   semilla se le queda en la tierra seca, y si se atrasa, la mata no
   alcanza a crecer. La historia termina diciendo que lo que hace que el
   año se repita (que las lluvias entren más o menos en las mismas
   fechas, año con año) está allá arriba, y que es un movimiento que se
   puede nombrar. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Es el Sol visto desde arriba, con el camino de la Tierra alrededor y
   los doce meses marcados en él. A la derecha, la parcela de don Tulio.

     0  el Sol, la Tierra en enero y la parcela seca: ¿cuándo le llueve?;
     1  pasan febrero, marzo y abril sin lluvia; en mayo la Tierra llega a
        otra parte de su camino, entran las lluvias y don Tulio siembra;
     2  de mayo a octubre llueve y la milpa crece; en noviembre la Tierra
        sale de ese tramo y se acaban las lluvias;
     3  diciembre y enero, sin lluvia: la Tierra ya dio la vuelta entera,
        doce meses, un año;
     4  al año siguiente pasa por el mismo camino, y en mayo, en el mismo
        lugar, las lluvias vuelven a entrar;
     5  por eso vuelven cada año en las mismas fechas. Y la pregunta es del
        alumno: ¿en qué mes llueve donde vive?

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **La Tierra avanza de mes en mes por el camino, a paso parejo.**
      Cada mes es una capa que gira un doceavo de vuelta alrededor del
      Sol, una dentro de otra y cada una con su demora, así que la Tierra
      va por el camino y no en línea recta. La sonda la mide en cada paso:
      sobre el camino, y en el mes que dice la frase.
   2. ⚠️ **Las lluvias las marca el camino, no el calendario.** Cada mes
      que la Tierra pasa deja su marca: una gota si llovió, un sol si no.
      Al año siguiente, las lluvias vuelven a entrar justo en la primera
      gota. Eso es lo que la historia prometía: que se repiten porque la
      Tierra vuelve a pasar por el mismo lugar.
   3. ⚠️ **El camino es redondo, y no se dice que la Tierra esté más cerca
      del Sol cuando llueve.** Es el error más común sobre las estaciones,
      y un camino alargado lo enseñaría sin decirlo. Tampoco se explica
      por qué llueve en esa parte del camino: eso la misión no lo enseña,
      y lo que la historia pide es por qué se repite.
   4. ⚠️ **Lo que pregunta la prueba no se dice.** Ni el nombre del
      movimiento, ni cuántos días tiene el año, ni cuántas horas el día,
      ni qué hay en el centro del sistema solar, ni que la Tierra es un
      planeta que no tiene luz propia. La Tierra va sin su lado de noche:
      dibujarla medio oscura contestaría el verdadero o falso del día y la
      noche. Y la prueba se cambió donde la historia o esta animación ya
      contestaban: la milpa que se siembra antes de las lluvias, qué hace
      que las lluvias entren en las mismas fechas, los planetas que giran
      alrededor del Sol, qué hay en el centro y, en pensamiento crítico, el
      caso de la época seca y la lluviosa y el error de las estaciones.
   5. **Los meses son lo único que se cuenta.** El marcador cuenta las
      gotas y las marcas del camino, y la parcela se moja solo cuando la
      Tierra está en el tramo de las lluvias.
   6. **Nada se dice solo con color.** El mes con lluvia lleva una gota y el
      seco un sol; la parcela, su nube con sus gotas; la milpa, su tamaño.
      El Sol, la Tierra y la parcela son como son: se quedan iguales en la
      pantalla clara y en la oscura.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amVuelta')) return;

  var ANCHO = 320, ALTO = 240, FIN = 5;
  var CX = 112, CY = 118, R = 78;               // el Sol y el camino de la Tierra
  var RT = 8;                                    // el tamaño de la Tierra
  /* Con tres letras: con una sola, marzo y mayo serían las dos «M», y el
     alumno tendría que contar para saber cuál es cuál. */
  var MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  var LLUVIA = [4, 5, 6, 7, 8, 9];               // de mayo a octubre
  /* Cuántos meses ha avanzado la Tierra al terminar cada paso. */
  var AVANCE = [0, 4, 10, 12, 16, 16];
  var PASO_MES = 800;                            // lo que tarda en pasar un mes

  var TEXTOS = [
    'El Sol, y la Tierra en enero. Mes a mes, la Tierra le da la vuelta al Sol. A la derecha, la parcela de don Tulio: ¿cuándo le llueve?',
    'Pasan febrero, marzo y abril, sin lluvia. En mayo, la Tierra llega a esta parte de su camino y entran las lluvias: don Tulio siembra.',
    'De mayo a octubre llueve, y la milpa crece. En noviembre, la Tierra sale de ese tramo del camino y se acaban las lluvias.',
    'Don Tulio cosechó, y en diciembre y en enero no llueve. En enero, la Tierra ya dio la vuelta entera al Sol: doce meses, un año.',
    'Al año siguiente, la Tierra vuelve a pasar por el mismo camino. En mayo llega al mismo lugar, y las lluvias vuelven a entrar.',
    'Por eso las lluvias entran cada año más o menos por las mismas fechas: la Tierra vuelve a pasar por el mismo lugar. ¿En qué mes llueve donde vives?'
  ];

  var A;
  function r2(v) { return Math.round(v * 100) / 100; }
  /* El ángulo de cada mes en la pantalla: enero abajo, y los meses van
     contra las agujas del reloj, que es como se mueve la Tierra vista
     desde arriba. */
  function angulo(i) { return (90 - 30 * i) * Math.PI / 180; }
  function punto(i, radio) { var a = angulo(i); return [CX + Math.cos(a) * radio, CY + Math.sin(a) * radio]; }
  function llueve(i) { return LLUVIA.indexOf(((i % 12) + 12) % 12) >= 0; }
  /* Qué tan afuera va el nombre de cada mes. No a la misma distancia:
     un nombre es más ancho que alto, así que a los lados necesita más
     espacio que arriba y abajo para no quedar debajo de la Tierra cuando
     ella está en ese mes. Se busca la distancia más corta con la que la
     caja del nombre (medida: 22 de ancho y 12,3 de alto el más grande)
     queda a 1,5 de la Tierra. */
  function afuera(i) {
    var a = angulo(i), c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a));
    var w = 11.2, h = 6.2, libre = RT + 1.5;
    for (var d = 6; d < 40; d += 0.25) {
      var dx = Math.max(0, c * d - w), dy = Math.max(0, s * d - h);
      if (Math.sqrt(dx * dx + dy * dy) >= libre) return d;
    }
    return 40;
  }

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  /* Una gota y un sol pequeños: la marca de un mes. */
  function gota(padre, cx, cy, s, attrs) {
    attrs.d = 'M ' + r2(cx) + ' ' + r2(cy - 6 * s) + ' C ' + r2(cx + 1.6 * s) + ' ' + r2(cy - 3 * s) + ' ' + r2(cx + 4.4 * s) + ' ' + r2(cy - 0.2 * s) +
      ' ' + r2(cx + 4.4 * s) + ' ' + r2(cy + 2 * s) + ' C ' + r2(cx + 4.4 * s) + ' ' + r2(cy + 4.6 * s) + ' ' + r2(cx + 2.4 * s) + ' ' + r2(cy + 6 * s) +
      ' ' + r2(cx) + ' ' + r2(cy + 6 * s) + ' C ' + r2(cx - 2.4 * s) + ' ' + r2(cy + 6 * s) + ' ' + r2(cx - 4.4 * s) + ' ' + r2(cy + 4.6 * s) +
      ' ' + r2(cx - 4.4 * s) + ' ' + r2(cy + 2 * s) + ' C ' + r2(cx - 4.4 * s) + ' ' + r2(cy - 0.2 * s) + ' ' + r2(cx - 1.6 * s) + ' ' + r2(cy - 3 * s) +
      ' ' + r2(cx) + ' ' + r2(cy - 6 * s) + ' Z';
    return A.el('path', attrs, padre);
  }
  function solito(padre, cx, cy, attrs) {
    var g = A.el('g', attrs, padre);
    for (var k = 0; k < 8; k++) {
      var a = k * Math.PI / 4;
      A.el('line', { class: 'uv-rayito', x1: r2(cx + Math.cos(a) * 4.2), y1: r2(cy + Math.sin(a) * 4.2), x2: r2(cx + Math.cos(a) * 6.4), y2: r2(cy + Math.sin(a) * 6.4) }, g);
    }
    A.el('circle', { class: 'uv-solito', cx: r2(cx), cy: r2(cy), r: 3 }, g);
    return g;
  }

  var capas = [], marcas = [], rotuloTierra, nube, gotas, brotes, milpa;

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El camino de la Tierra, con sus doce meses ── */
    el('circle', { class: 'uv-camino', 'data-camino': '', cx: CX, cy: CY, r: R }, svg);
    MESES.forEach(function (m, i) {
      var a = punto(i, R - 4), b = punto(i, R + 4), t = punto(i, R + afuera(i));
      el('line', { class: 'uv-raya-mes', 'data-raya-mes': i, x1: r2(a[0]), y1: r2(a[1]), x2: r2(b[0]), y2: r2(b[1]) }, svg);
      texto(svg, { class: 'am-rotulo', 'data-mes': i, x: r2(t[0]), y: r2(t[1] + 3.5), 'font-size': 10, 'text-anchor': 'middle' }, m);
    });

    /* ── Las marcas: una por mes, adentro del camino. Gota si llovió, sol
       si no. Salen cuando la Tierra pasa por ese mes. ── */
    MESES.forEach(function (m, i) {
      var p = punto(i, R - 19);
      marcas.push(llueve(i)
        ? gota(svg, p[0], p[1], 0.85, { class: 'uv-gota am-fuera', 'data-marca': i, 'data-tipo': 'gota' })
        : solito(svg, p[0], p[1], { class: 'am-fuera', 'data-marca': i, 'data-tipo': 'sol' }));
    });

    /* ── El Sol ── */
    var sol = el('g', { 'data-sol': '' }, svg);
    for (var k = 0; k < 12; k++) {
      var a = k * Math.PI / 6;
      el('line', { class: 'uv-rayo', x1: r2(CX + Math.cos(a) * 19), y1: r2(CY + Math.sin(a) * 19), x2: r2(CX + Math.cos(a) * 25), y2: r2(CY + Math.sin(a) * 25) }, sol);
    }
    el('circle', { class: 'uv-sol', 'data-sol-bola': '', cx: CX, cy: CY, r: 15 }, sol);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'sol', x: CX, y: CY + 40, 'font-size': 11, 'text-anchor': 'middle' }, 'el Sol');

    /* ── La Tierra: una capa por mes, una dentro de otra, que gira un
       doceavo de vuelta alrededor del Sol. Dentro de todas, un círculo
       invisible del tamaño del camino, para que cada capa tenga su centro
       en el Sol, y la Tierra, en enero. ── */
    var padre = svg;
    for (var i = 0; i < AVANCE[AVANCE.length - 1]; i++) {
      var c = el('g', { class: 'am-viaja', 'data-capa-mes': i }, padre);
      c.style.transformOrigin = CX + 'px ' + CY + 'px';
      capas.push(c);
      padre = c;
    }
    var e = punto(0, R);
    var tierra = el('g', { 'data-tierra': '' }, padre);
    el('circle', { class: 'uv-tierra', 'data-tierra-bola': '', cx: r2(e[0]), cy: r2(e[1]), r: RT }, tierra);
    el('path', { class: 'uv-tierra-verde', d: 'M ' + r2(e[0] - 4) + ' ' + r2(e[1] - 3) + ' q 3 -3 6 0 q -1 3 -4 3 z M ' + r2(e[0] + 1) + ' ' + r2(e[1] + 2) + ' q 3 0 4 3 q -3 1 -5 -1 z' }, tierra);
    /* Su nombre va adentro del camino, encima de ella: a los lados están
       los nombres de diciembre y de febrero. Solo sale en el paso 0, y
       ahí la marca de enero todavía no está. */
    rotuloTierra = texto(svg, { class: 'am-rotulo', 'data-rotulo': 'tierra', x: r2(e[0]), y: r2(e[1] - RT - 6), 'font-size': 11, 'text-anchor': 'middle' }, 'la Tierra');

    /* ── La parcela de don Tulio ── */
    var px = 224, pw = 90, py = 62, ph = 112, suelo = py + 78;
    var parcela = el('g', { 'data-parcela': '' }, svg);
    el('rect', { class: 'uv-marco', 'data-marco': '', x: px, y: py, width: pw, height: ph, rx: 8 }, parcela);
    el('rect', { class: 'uv-tierra-parcela', 'data-suelo-parcela': '', x: px + 1, y: suelo, width: pw - 2, height: py + ph - suelo - 1 }, parcela);
    el('line', { class: 'uv-surco', x1: px + 6, y1: suelo + 9, x2: px + pw - 6, y2: suelo + 9 }, parcela);
    el('line', { class: 'uv-surco', x1: px + 6, y1: suelo + 20, x2: px + pw - 6, y2: suelo + 20 }, parcela);
    nube = el('g', { class: 'am-fuera', 'data-nube': '' }, parcela);
    [[px + 30, py + 20, 9], [px + 44, py + 15, 11], [px + 58, py + 21, 8]].forEach(function (b) {
      el('circle', { class: 'uv-nube', cx: b[0], cy: b[1], r: b[2] }, nube);
    });
    el('rect', { class: 'uv-nube', x: px + 22, y: py + 19, width: 45, height: 10, rx: 5 }, nube);
    gotas = el('g', { class: 'am-fuera', 'data-gotas': '' }, parcela);
    for (var gx = px + 26; gx <= px + 64; gx += 8) {
      el('line', { class: 'uv-lluvia', 'data-gota': '', x1: gx, y1: py + 33, x2: gx - 3, y2: suelo - 3 }, gotas);
    }
    /* La milpa: brotes cuando siembra, y la milpa crecida. */
    brotes = el('g', { class: 'am-fuera', 'data-brotes': '' }, parcela);
    milpa = el('g', { class: 'am-fuera', 'data-milpa': '' }, parcela);
    [px + 20, px + 45, px + 70].forEach(function (x) {
      el('path', { class: 'uv-hoja', d: 'M ' + x + ' ' + suelo + ' l 0 -6 M ' + x + ' ' + (suelo - 4) + ' q -4 -2 -5 -5 M ' + x + ' ' + (suelo - 4) + ' q 4 -2 5 -5' }, brotes);
      el('path', { class: 'uv-tallo', d: 'M ' + x + ' ' + suelo + ' l 0 -34' }, milpa);
      el('path', { class: 'uv-hoja', d: 'M ' + x + ' ' + (suelo - 10) + ' q -8 -3 -10 -10 M ' + x + ' ' + (suelo - 18) + ' q 8 -3 10 -10 M ' + x + ' ' + (suelo - 26) + ' q -7 -2 -9 -8' }, milpa);
      el('ellipse', { class: 'uv-mazorca', cx: x + 3, cy: suelo - 20, rx: 2.4, ry: 5 }, milpa);
    });
    /* ⚠️ El dibujo no va a su tamaño: el Sol mide menos del doble que la
       Tierra, y de verdad cabrían más de un millón de Tierras dentro de él.
       Sin decirlo, el alumno se lleva la medida del dibujo, y la prueba le
       pregunta justo eso. Se avisa sin dar la cuenta. */
    ['Los tamaños y las', 'distancias no son', 'los de verdad.'].forEach(function (t, k) {
      texto(svg, { class: 'am-rotulo', 'data-rotulo': 'escala', x: px + pw / 2, y: 18 + k * 12, 'font-size': 9.5, 'text-anchor': 'middle' }, t);
    });
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'parcela', x: px + pw / 2, y: py + ph + 16, 'font-size': 10.5, 'text-anchor': 'middle' }, 'la parcela');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'parcela2', x: px + pw / 2, y: py + ph + 29, 'font-size': 10.5, 'text-anchor': 'middle' }, 'de don Tulio');
  }

  function pintar(n, antes) {
    var atras = antes != null && antes > n;
    /* Desde qué mes arranca este paso: si se viene del paso anterior, la
       Tierra sale de donde estaba; si se salta (volver, empezar otra vez,
       el primer pintado), llega de golpe y nada espera. */
    var desde = antes != null && antes < n ? AVANCE[antes] : AVANCE[n];
    /* Cuándo llega la Tierra al mes k (contando meses desde el principio). */
    function llega(k) { return Math.max(0, (k - desde) * PASO_MES); }

    /* La Tierra: la capa k la lleva del mes k al k + 1. */
    capas.forEach(function (c, k) {
      var hecho = k < AVANCE[n];
      A.mover(c, 0, 0, hecho ? -30 : 0, 1, hecho && k >= desde ? llega(k) : 0);
    });
    /* Volviendo al paso 0, el nombre espera a que la Tierra llegue a enero:
       si saliera antes, quedaría escrito sobre un lugar donde no hay nadie. */
    A.ver(rotuloTierra, n === 0, atras && n === 0 ? 800 : 0);

    /* Las marcas: cada mes deja la suya cuando la Tierra llega a él la
       primera vez (enero, cuando arranca). La segunda vuelta ya las
       encuentra puestas. */
    marcas.forEach(function (m, i) {
      var llegoYa = i === 0 ? AVANCE[n] > 0 : i <= AVANCE[n];
      var nueva = llegoYa && !(i === 0 ? desde > 0 : i <= desde);
      A.ver(m, llegoYa, nueva ? (i === 0 ? 0 : llega(i)) : 0);
    });

    /* La parcela: llueve si la Tierra está en el tramo de las lluvias, y
       cambia cuando la Tierra entra en él o sale de él. */
    var mojada = llueve(AVANCE[n]);
    var dLluvia = 0;
    for (var k = desde + 1; k <= AVANCE[n]; k++) {
      if (llueve(k) !== llueve(k - 1)) dLluvia = llega(k);
    }
    A.ver(nube, mojada, dLluvia);
    A.ver(gotas, mojada, dLluvia);
    /* Don Tulio siembra con las lluvias: brotes al entrar; a media
       temporada, la milpa crecida, que se queda hasta noviembre; en enero
       ya está cosechada. */
    var siembra = n === 1 || n === 4 || n === 5, crecida = n === 2, avanza = desde < AVANCE[n];
    var dCrece = llega(desde + 3);
    A.ver(brotes, siembra, !avanza ? 0 : siembra ? dLluvia + 600 : n === 2 ? dCrece : 0);
    A.ver(milpa, crecida, !avanza ? 0 : crecida ? dCrece : n === 3 ? llega(desde + 1) : 0);
  }

  function marcador(n) {
    return [
      { cifra: '?', palabras: 'cuándo le llueve a la parcela' },
      { cifra: 'mayo', palabras: 'entran las lluvias' },
      { cifra: '6', palabras: 'meses de lluvia: de mayo a octubre' },
      { cifra: '12', palabras: 'meses: una vuelta entera al Sol' },
      { cifra: 'mayo', palabras: 'otra vez entran las lluvias' },
      { cifra: '↻', palabras: 'cada vuelta, las mismas lluvias' }
    ][n];
  }

  AnimacionMision.montar('#amVuelta', {
    vista: [ANCHO, ALTO],
    describe: 'El Sol visto desde arriba, con el camino de la Tierra alrededor y los doce meses marcados en él. A la derecha, la parcela de don Tulio.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['📅 Pasan los meses', '🌧️ ¿Hasta cuándo?', '☀️ ¿Y después?', '🔁 Otro año', '💡 ¿Por qué?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
