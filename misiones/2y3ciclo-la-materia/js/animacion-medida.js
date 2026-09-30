/* ============================================================
   M.E.T.A.S · La Materia · «Dónde se metió el agua»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de doña Chepa:
   compra el maíz por libra y lo vende por medida, un día le llegó húmedo,
   al comprarlo pesaba más y al venderlo llenaba las mismas medidas. Pagó
   libras de agua y vendió el maíz de siempre. La historia dice que confundió
   dos cosas que no son lo mismo: cuánto pesa y cuánto ocupa. Eso es lo que se
   ve aquí. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza en
   cada paso.

   Dos medidas de maíz, llenas hasta el borde, cada una en su balanza de
   reloj, sobre la mesa:

     0  las dos iguales, y las dos agujas marcan lo mismo: ¿qué pasa si una
        se moja?;
     1  a la de la derecha le cae agua, y su aguja marca más;
     2  pero la medida no se llenó más: el agua se metió entre grano y grano,
        y el maíz sigue hasta el mismo borde;
     3  compra por libra: la mojada le cuesta una moneda más, la del agua;
     4  vende por medida: por las dos cobra lo mismo, y esa moneda no vuelve;
     5  la balanza dice cuánto pesa y la medida, cuánto ocupa: el agua cambió
        lo primero y no lo segundo;
     6  la pregunta es del alumno: una taza llena de frijoles hasta el borde,
        y cuánta agua le cabe sin que se derrame.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **El agua no «deja de ocupar».** Toda cosa ocupa, también el agua; lo
      que pasa es que entre grano y grano hay huecos, y el agua se mete ahí.
      Por eso se ve azul solo ENTRE los granos, que no se mueven de su sitio:
      la sonda compara cada grano con el del paso 0.
   2. ⚠️ **La aguja y las monedas dicen lo mismo.** Lo que se paga por libra va
      con lo que marca la balanza: la mojada marca un cuarto más desde el cero
      y cuesta una moneda más sobre cuatro. La sonda saca las dos cuentas del
      dibujo y las compara. Un cuarto más es lo que gana de peso un maíz que
      pasa de seco a bien húmedo; el dibujo no dice cuántas libras son.
   3. ⚠️ **Lo que pregunta la prueba no se dice**: ni cómo se llaman las dos
      cosas que se confunden, ni en qué se miden, ni de qué está hecho el
      agua. Se dice «cuánto pesa» y «cuánto ocupa», que son las palabras de la
      historia, y la tarjeta de abajo les pone el nombre.
   4. **Los precios no se escriben, se cuentan en monedas**, y la frase habla
      de «una moneda más», no de lempiras: un precio del maíz escrito aquí
      sería inventado y envejecería.
   5. **La pregunta final se hace con lo que hay en una cocina**: una taza y
      unos frijoles. El alumno descubre él mismo que en una taza «llena»
      todavía cabe agua.
   6. **Nada se dice solo con color**: lo que es del agua lleva además su
      gota dibujada, y el borde, una raya.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amMedida')) return;

  var ANCHO = 320, ALTO = 250, FIN = 6, MESA = 226;
  /* Las dos balanzas: dónde está el centro de cada una. */
  var BAL = [84, 236];
  var CUERPO = 176, DIAL_Y = 201, DIAL_R = 20, AGUJA = 16;
  /* La medida: la caja de madera, abierta arriba; su borde está en BORDE. */
  var PLATO = 168, BORDE = 84, PARED = 3, MEDIO = 42;
  /* Los granos, acomodados como caen: filas de cinco y de cuatro. */
  var PASO_X = 13.8, PASO_Y = 11.35, GRX = 5.4, GRY = 6.2;
  /* La aguja: el cero a -90° (acostada), la seca a 80° del cero y la mojada
     a un cuarto más (100°). Las monedas van igual: cuatro y cinco. */
  var CERO = -90, SECA = 80, MOJADA = 100;
  var PAGA = [4, 5], COBRA = 5;

  var TEXTOS = [
    'Doña Chepa compra el maíz por libra y lo vende por medida. Aquí hay dos medidas llenas hasta el borde. ¿Qué pasa si una se moja?',
    'A la de la derecha le cae agua, y su balanza marca más: el agua también pesa.',
    'Pero la medida no se llenó más. El agua se metió entre grano y grano, y el maíz sigue hasta el mismo borde.',
    'Doña Chepa compra por libra: la medida mojada le cuesta una moneda más. Esa moneda pagó el agua.',
    'Pero vende por medida, y por las dos cobra lo mismo. Lo que pagó por el agua ya no vuelve.',
    'La balanza dice cuánto pesa; la medida, cuánto ocupa. El agua cambió lo primero y no lo segundo.',
    '¿Y tú? Llena una taza con frijoles hasta el borde y échale agua despacito. ¿Cuánta cabe sin que se derrame?'
  ];

  var A;
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  function f(v) { return Math.round(v * 100) / 100; }
  function rad(g) { return g * Math.PI / 180; }

  /* Los granos de una medida, de abajo hacia arriba: la fila de abajo pisa el
     fondo y la de arriba llega al borde. */
  function granos(cx) {
    var fondo = PLATO - PARED, lista = [];
    for (var fila = 0; fila < 7; fila++) {
      var y = fondo - GRY - fila * PASO_Y;
      var xs = fila % 2 ? [-1.5, -0.5, 0.5, 1.5] : [-2, -1, 0, 1, 2];
      xs.forEach(function (k) { lista.push({ x: cx + k * PASO_X, y: y }); });
    }
    return lista;
  }

  var P = {};

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);
    /* ── La mesa ── */
    el('rect', { class: 'mt-pata', x: 14, y: MESA + 8, width: 8, height: ALTO - MESA - 8 }, svg);
    el('rect', { class: 'mt-pata', x: 298, y: MESA + 8, width: 8, height: ALTO - MESA - 8 }, svg);
    el('rect', { class: 'mt-mesa', 'data-mesa': '', x: 0, y: MESA, width: ANCHO, height: 8 }, svg);

    P.agujas = []; P.medidas = []; P.agua = [];
    BAL.forEach(function (cx, i) {
      /* ── La balanza de reloj: el cuerpo, la carátula, la aguja y el plato ── */
      el('rect', { class: 'mt-balanza', 'data-balanza': i, x: cx - 46, y: CUERPO, width: 92, height: MESA - CUERPO, rx: 6 }, svg);
      el('circle', { class: 'mt-dial', cx: cx, cy: DIAL_Y, r: DIAL_R }, svg);
      for (var t = 0; t <= 9; t++) {
        var g = CERO + t * 20, s = Math.sin(rad(g)), c = Math.cos(rad(g));
        el('path', { class: 'mt-raya', 'data-marca': g, d: 'M ' + f(cx + s * (DIAL_R - 5)) + ' ' + f(DIAL_Y - c * (DIAL_R - 5)) + ' L ' + f(cx + s * (DIAL_R - 1.5)) + ' ' + f(DIAL_Y - c * (DIAL_R - 1.5)) }, svg);
      }
      var ag = el('g', { 'data-aguja': i }, svg);
      ag.style.transformOrigin = cx + 'px ' + DIAL_Y + 'px';
      el('path', { class: 'mt-aguja', d: 'M ' + cx + ' ' + DIAL_Y + ' L ' + cx + ' ' + (DIAL_Y - AGUJA) }, ag);
      el('circle', { class: 'mt-punta', 'data-punta': '', cx: cx, cy: DIAL_Y - AGUJA, r: 0.6 }, ag);
      el('circle', { class: 'mt-eje', cx: cx, cy: DIAL_Y, r: 2.4 }, svg);
      P.agujas.push(ag);
      el('rect', { class: 'mt-balanza', x: cx - 6, y: PLATO + 4, width: 12, height: CUERPO - PLATO - 4 }, svg);
      el('rect', { class: 'mt-plato', 'data-plato': i, x: cx - 50, y: PLATO, width: 100, height: 4, rx: 2 }, svg);

      /* ── La medida: la caja, lo de adentro (los huecos), el agua y los
         granos. El agua va DETRÁS de los granos: se ve solo entre ellos. ── */
      el('rect', { class: 'mt-medida', 'data-medida': i, x: cx - MEDIO, y: BORDE, width: MEDIO * 2, height: PLATO - BORDE }, svg);
      el('rect', { class: 'mt-dentro', 'data-dentro': i, x: cx - MEDIO + PARED, y: BORDE, width: (MEDIO - PARED) * 2, height: PLATO - PARED - BORDE }, svg);
      var agua = [];
      if (i === 1) {
        /* El agua baja entre los granos: se pinta en cuatro franjas, de
           arriba hacia abajo, y cubre lo de adentro hasta el borde, nunca
           más arriba. */
        var alto = (PLATO - PARED - BORDE) / 4;
        for (var k = 0; k < 4; k++) {
          agua.push(el('rect', { class: 'mt-agua am-fuera', 'data-agua': k, x: cx - MEDIO + PARED, y: f(BORDE + k * alto), width: (MEDIO - PARED) * 2, height: f(alto + 0.3) }, svg));
        }
      }
      P.agua = P.agua.concat(agua);
      granos(cx).forEach(function (q) {
        /* Un grano de maíz: ancho arriba, angosto abajo, con su germen. */
        var g = el('g', { 'data-grano': i, 'data-x': f(q.x), 'data-y': f(q.y) }, svg);
        var x = q.x, y = q.y, w = GRX, h = GRY;
        el('path', { class: 'mt-grano', d: 'M ' + f(x - w) + ' ' + f(y - h + 2.2) + ' Q ' + f(x - w) + ' ' + f(y - h) + ' ' + f(x - w + 2.2) + ' ' + f(y - h) +
          ' L ' + f(x + w - 2.2) + ' ' + f(y - h) + ' Q ' + f(x + w) + ' ' + f(y - h) + ' ' + f(x + w) + ' ' + f(y - h + 2.2) +
          ' L ' + f(x + w * 0.62) + ' ' + f(y + h - 2.4) + ' Q ' + f(x) + ' ' + f(y + h + 1.2) + ' ' + f(x - w * 0.62) + ' ' + f(y + h - 2.4) + ' Z' }, g);
        el('ellipse', { class: 'mt-germen', cx: f(x), cy: f(y + 1.6), rx: 1.7, ry: 2.6 }, g);
      });
      P.medidas.push(cx);
    });

    /* ── Lo que dice de quién es cada medida, a su lado ── */
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'seco', x: 21, y: 128, 'font-size': 12, 'text-anchor': 'middle' }, 'seco');
    P.mojado = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'mojado', x: 299, y: 128, 'font-size': 12, 'text-anchor': 'middle' }, 'mojado');
    /* La gota que dice «esto es agua» sin depender del color. */
    P.gotaMedida = el('path', { class: 'mt-gota am-fuera', 'data-gota': 'medida', d: gota(299, 146, 1.1) }, svg);

    /* ── La jarra que echa el agua (solo mientras cae, en el paso 1): una
       envoltura para aparecer y otra para irse ── */
    P.jarraVa = el('g', null, svg);
    P.jarraVe = el('g', { class: 'am-fuera', 'data-jarra': '' }, P.jarraVa);
    var jarra = el('g', { transform: 'translate(276 34) rotate(-35)' }, P.jarraVe);
    el('path', { class: 'mt-jarra', d: 'M -11 -14 L 11 -14 L 9 14 L -9 14 Z' }, jarra);
    el('path', { class: 'mt-jarra', d: 'M -11 -14 L -17 -18 L -11 -8' }, jarra);
    el('path', { class: 'mt-asa', d: 'M 11 -8 Q 20 -4 11 6' }, jarra);
    P.chorroVa = el('g', null, svg);
    P.chorroVe = el('g', { class: 'am-fuera', 'data-chorro': '' }, P.chorroVa);
    el('path', { class: 'mt-chorro', d: 'M 255 36 Q 248 58 242 ' + (BORDE + 2) }, P.chorroVe);

    /* ── El borde: una raya de una medida a la otra ── */
    P.borde = el('g', { class: 'am-fuera', 'data-borde': '' }, svg);
    el('path', { class: 'mt-borde', 'data-raya-borde': '', d: 'M ' + (BAL[0] - MEDIO - 4) + ' ' + BORDE + ' L ' + (BAL[1] + MEDIO + 4) + ' ' + BORDE }, P.borde);
    P.mismoBorde = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'borde', x: 160, y: 76, 'font-size': 11.5, 'text-anchor': 'middle' }, 'hasta el mismo borde');

    /* ── Las monedas: lo que pagó (por libra) y lo que cobra (por medida) ── */
    P.filas = { paga: [], cobra: [] };
    function fila(k, y, i, cuantas) {
      var g = el('g', { class: 'am-fuera', 'data-fila': k, 'data-de': i }, svg);
      for (var m = 0; m < cuantas; m++) {
        var x = BAL[i] + (m - (cuantas - 1) / 2) * 15;
        var moneda = el('g', { 'data-moneda': '' }, g);
        el('circle', { class: 'mt-moneda', cx: f(x), cy: y, r: 6.2 }, moneda);
        el('circle', { class: 'mt-moneda-aro', cx: f(x), cy: y, r: 4 }, moneda);
        /* La moneda del agua lleva su gota. */
        if (k === 'paga' && m >= PAGA[0]) {
          moneda.setAttribute('data-del-agua', '');
          el('path', { class: 'mt-gota', d: gota(x, y + 1, 0.75) }, moneda);
        }
      }
      return g;
    }
    [0, 1].forEach(function (i) {
      P.filas.paga.push(fila('paga', 24, i, PAGA[i]));
      P.filas.cobra.push(fila('cobra', 48, i, COBRA));
    });
    P.pago = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'pago', x: 160, y: 28, 'font-size': 12, 'text-anchor': 'middle' }, 'pagó');
    P.cobra = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'cobra', x: 160, y: 52, 'font-size': 12, 'text-anchor': 'middle' }, 'cobra');

    /* ── Cuánto pesa y cuánto ocupa (paso 5) ── */
    P.ocupa = el('g', { class: 'am-fuera', 'data-que': 'ocupa' }, svg);
    var to = el('text', { class: 'am-rotulo', 'data-rotulo': 'ocupa', x: 160, y: 100, 'font-size': 12, 'text-anchor': 'middle' }, P.ocupa);
    var o1 = el('tspan', { x: 160, y: 100 }, to); o1.textContent = 'cuánto ';
    var o2 = el('tspan', { x: 160, y: 114 }, to); o2.textContent = 'ocupa';
    P.pesa = el('g', { class: 'am-fuera', 'data-que': 'pesa' }, svg);
    /* Las rayas pasan por el fondo y por el cuerpo de la balanza: van sobre
       un halo del color de la tarjeta para leerse en los dos. */
    var g0 = 'M 141 ' + DIAL_Y + ' L ' + (BAL[0] + DIAL_R + 2) + ' ' + DIAL_Y, g1 = 'M 179 ' + DIAL_Y + ' L ' + (BAL[1] - DIAL_R - 2) + ' ' + DIAL_Y;
    el('path', { class: 'mt-halo', d: g0 }, P.pesa);
    el('path', { class: 'mt-halo', d: g1 }, P.pesa);
    el('path', { class: 'mt-guia', 'data-guia': 0, d: g0 }, P.pesa);
    el('path', { class: 'mt-guia', 'data-guia': 1, d: g1 }, P.pesa);
    var tp = el('text', { class: 'am-rotulo', 'data-rotulo': 'pesa', x: 160, y: DIAL_Y - 3, 'font-size': 12, 'text-anchor': 'middle' }, P.pesa);
    var p1 = el('tspan', { x: 160, y: DIAL_Y - 3 }, tp); p1.textContent = 'cuánto ';
    var p2 = el('tspan', { x: 160, y: DIAL_Y + 11 }, tp); p2.textContent = 'pesa';
  }

  /* Una gota de agua, con la punta hacia arriba; (x, y) es su centro. */
  function gota(x, y, k) {
    return 'M ' + f(x) + ' ' + f(y - 7 * k) + ' Q ' + f(x + 5 * k) + ' ' + f(y) + ' ' + f(x) + ' ' + f(y + 4 * k) +
      ' Q ' + f(x - 5 * k) + ' ' + f(y) + ' ' + f(x) + ' ' + f(y - 7 * k) + ' Z';
  }

  function pintar(n, antes) {
    var entra = function (k) { return n === k && antes !== k; };

    /* La jarra aparece, echa el agua y se va; el chorro cae mientras tanto.
       Cada una con dos envolturas: una para aparecer y otra para irse. */
    /* Al volver con «Atrás», la envoltura que vuelve a encenderse espera a
       que la otra se apague: si las dos cambian a la vez, la jarra asoma un
       momento como un fantasma. */
    var vuelve = n < 1 && antes >= 1 ? 600 : 0;
    A.ver(P.jarraVe, n >= 1, 0);
    A.ver(P.jarraVa, n < 1, entra(1) ? 2300 : vuelve);
    A.ver(P.chorroVe, n >= 1, entra(1) ? 400 : 0);
    A.ver(P.chorroVa, n < 1, entra(1) ? 1900 : vuelve);

    /* El agua baja entre los granos, franja por franja. */
    P.agua.forEach(function (b, k) { A.ver(b, n >= 1, entra(1) ? 700 + k * 300 : 0); });
    A.ver(P.mojado, n >= 1, entra(1) ? 700 : 0);
    A.ver(P.gotaMedida, n >= 1, entra(1) ? 700 : 0);

    /* Las agujas: la de la seca, siempre igual; la de la mojada marca más en
       cuanto le cae el agua. */
    A.mover(P.agujas[0], 0, 0, CERO + SECA, 1, 0);
    A.mover(P.agujas[1], 0, 0, CERO + (n >= 1 ? MOJADA : SECA), 1, entra(1) ? 900 : 0);

    /* El borde, y lo que dice. */
    A.ver(P.borde, n >= 2, entra(2) ? 300 : 0);
    A.ver(P.mismoBorde, n >= 2 && n < 5, entra(2) ? 600 : 0);

    /* Las monedas: lo que pagó (3) y lo que cobra (4). */
    P.filas.paga.forEach(function (g, i) { A.ver(g, n >= 3, entra(3) ? 200 + i * 700 : 0); });
    A.ver(P.pago, n >= 3, entra(3) ? 200 : 0);
    P.filas.cobra.forEach(function (g, i) { A.ver(g, n >= 4, entra(4) ? 200 + i * 500 : 0); });
    A.ver(P.cobra, n >= 4, entra(4) ? 200 : 0);

    /* Cuánto pesa y cuánto ocupa. */
    A.ver(P.ocupa, n >= 5, entra(5) ? 200 : 0);
    A.ver(P.pesa, n >= 5, entra(5) ? 700 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '2', palabras: 'medidas, llenas hasta el borde' },
      { cifra: 'más', palabras: 'marca la balanza de la mojada' },
      { cifra: '=', palabras: 'el borde: la medida no se llenó más' },
      { cifra: '+1', palabras: 'moneda: la pagó por el agua' },
      { cifra: '=', palabras: 'lo que cobra por cada medida' },
      { cifra: '2', palabras: 'cosas distintas: cuánto pesa y cuánto ocupa' },
      { cifra: '?', palabras: '¿cuánta agua cabe en la taza?' }
    ][n];
  }

  AnimacionMision.montar('#amMedida', {
    vista: [ANCHO, ALTO],
    describe: 'Dos medidas de maíz llenas hasta el borde, cada una en una balanza. A la de la derecha le cae agua: su balanza marca más, pero el maíz sigue hasta el mismo borde, porque el agua se mete entre los granos. Comprada por libra, la mojada cuesta una moneda más; vendida por medida, las dos se cobran igual.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['💧 Mojar una', '📏 ¿Se llenó más?', '🪙 Comprar por libra', '🌽 Vender por medida', '⚖️ ¿Qué cambió?', '💡 ¿Y tú?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
