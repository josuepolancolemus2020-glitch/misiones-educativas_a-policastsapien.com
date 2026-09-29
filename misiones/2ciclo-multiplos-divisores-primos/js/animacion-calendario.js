/* ============================================================
   M.E.T.A.S · Múltiplos, Divisores y Primos · El bus y el camión
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de doña
   Nely: a la aldea el bus sube cada 6 días y el camión del agua cada
   8; hoy coincidieron, y ella quiere bajar al pueblo el día en que
   vuelvan a coincidir, porque si no le toca pagar dos viajes y perder
   dos días de trabajo. La historia termina pidiendo que se adivine
   ese día «aquí abajo», y aquí se ve.
   El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  la fila de los días, que empieza hoy con los dos, y la
        pregunta de la historia: se adivina ANTES de tocar;
     1  los días del bus, de 6 en 6: los múltiplos de 6;
     2  los del camión, de 8 en 8: los múltiplos de 8;
     3  el primer día que está en las dos filas: el 24, el primer
        múltiplo común;
     4  la primera trampa: sumar, 6 + 8 = 14, y ese día no sube
        ninguno;
     5  hacerlo sin dibujar: contar de 8 en 8 hasta dar con uno de la
        tabla del 6;
     6  la segunda trampa: multiplicar, 6 × 8 = 48, que sí es de los
        dos pero es la segunda vez;
     7  desde hoy coinciden cada 24 días (24, 48, 72…), y el más
        pequeño se llama mínimo común múltiplo.

   Tres decisiones, y ninguna es de adorno:

   1. ⚠️ **La fila se aleja en la segunda trampa.** Hasta el paso 5 la
      fila llega al día 26 y cada día mide 10,8: así cabe el 14 de la
      primera trampa entre el 12 del bus y el 16 del camión sin pisar a
      ninguno (con la fila entera hasta el 48 los tres quedaban uno
      encima del otro). En el 6 la fila se aleja al doble hasta el día
      52, y el 24 se corre a la mitad para que aparezca el 48 donde él
      estaba: lo lejos que queda el 48 se VE, que es justo lo que
      cuesta esperar hasta él.
   2. ⚠️ **Lo que se dibuja es lo que se cuenta.** Cada ficha cae en la
      rayita de su día, cada salto va de un día de su fila al
      siguiente, y cada banda que junta las dos filas cae en un día que
      está en las dos. La sonda `verifica-animacion-mision` lo lee
      sobre el dibujo y hace las cuentas aparte.
   3. **No se usa lo que pregunta el «Predice» de abajo**: si 247 es
      par, cuántos divisores tiene 12, ni si 51 es primo. Aquí no se
      habla de pares, de divisores ni de primos: solo de los días del
      bus y del camión.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCalendario')) return;

  var ANCHO = 320, ALTO = 224, FIN = 7;
  var BUS = 6, CAMION = 8;
  /* El día 0 (hoy) y cuánto mide un día: de cerca hasta el paso 5 y de
     lejos desde el 6. De lejos mide la mitad, así que el día 48 cae
     donde de cerca caía el 24. */
  var X0 = 30, CERCA = 10.8, LEJOS = 5.4;
  var VE = { cerca: 26, lejos: 52 };   // hasta qué día se ve la fila
  var LINEA = 120;                      // la fila de los días
  var FILA = { bus: 98, camion: 142 };  // el centro de las fichas de cada uno
  var FICHA = { ancho: 24, alto: 20 };
  var ARRIBA = FILA.bus - FICHA.alto / 2 - 1;    // de aquí salen los saltos del bus
  var ABAJO = FILA.camion + FICHA.alto / 2 + 1;  // y de aquí los del camión
  var COLOR = { bus: 'var(--am-pri,#1565c0)', camion: 'var(--am-sec,#00838f)', comun: 'var(--dark,#1b2838)' };

  function multiplos(n, hasta) { var l = []; for (var v = n; v <= hasta; v += n) l.push(v); return l; }
  var DIAS = { bus: multiplos(BUS, VE.lejos), camion: multiplos(CAMION, VE.lejos) };
  var COMUNES = DIAS.bus.filter(function (v) { return DIAS.camion.indexOf(v) >= 0; });
  var PRIMERO = COMUNES[0];                  // 24
  var SUMA = BUS + CAMION;                   // 14: la primera trampa
  var PRODUCTO = BUS * CAMION;               // 48: la segunda
  /* Sin dibujar: se cuenta de 8 en 8 hasta dar con uno de la tabla del 6. */
  var PRUEBAS = [];
  for (var p = CAMION; ; p += CAMION) { PRUEBAS.push(p); if (p % BUS === 0) break; }

  function lejos(n) { return n >= 6; }
  function xDia(d, n) { return X0 + (lejos(n) ? LEJOS : CERCA) * d; }
  function seVe(d, n) { return d <= (lejos(n) ? VE.lejos : VE.cerca); }

  /* Las cuentas van con espacios que no se parten (\u00a0): en un teléfono
     «6 + 8 = 14» se cortaba entre renglones y se leía como dos cosas. */
  var TEXTOS = [
    'Hoy subieron a la aldea el bus y el camión del agua. El bus vuelve cada 6 días y el camión, cada 8. ¿Qué día vuelven a coincidir? Adivínalo antes de tocar.',
    'El bus sube los días 6, 12, 18, 24… Es contar de 6 en 6, como en la tabla del 6. Son los múltiplos de 6.',
    'El camión sube los días 8, 16, 24… Es contar de 8 en 8. Son los múltiplos de 8.',
    'El primer día que está en las dos filas es el 24. Es el primer múltiplo común de 6 y 8. Ese día, doña Nely hace un solo viaje.',
    'Muchos suman: 6\u00a0+\u00a08\u00a0=\u00a014. Pero el día 14 no sube ninguno de los dos, y doña Nely esperaría en vano.',
    'Sin dibujar: cuenta de 8 en 8 hasta encontrar uno que esté en la tabla del 6. El 8 no, el 16 no, el 24 sí: 6\u00a0×\u00a04\u00a0=\u00a024.',
    'Otros multiplican: 6\u00a0×\u00a08\u00a0=\u00a048. Ese día sí suben los dos, pero ya es la segunda vez. La primera fue el 24.',
    'Desde hoy, coinciden cada 24 días: el 24, el 48, el 72… Son los múltiplos comunes. El más pequeño, el 24, se llama mínimo común múltiplo.'
  ];

  var A;
  var dias = [], filaG = {}, fichas = { bus: [], camion: [] }, saltos = { bus: [], camion: [] };
  var bandas = {}, rotulos = {}, hueco, pruebas = [], comunes = [], sigue;

  /* La punta de una flecha que llega a (x, y) viniendo en la dirección
     (dx, dy): dos rayitas. Va en su propio trazo, aparte de la curva, para
     que la curva empiece y acabe justo en sus dos días (la sonda los mide
     ahí) y la punta aparezca cuando el salto ya llegó. */
  function punta(x, y, dx, dy) {
    var l = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / l, uy = dy / l;
    var px = -uy, py = ux, L = 6, W = 3.5;
    return 'M ' + (x - ux * L + px * W).toFixed(2) + ' ' + (y - uy * L + py * W).toFixed(2) + ' L ' + x + ' ' + y +
      ' L ' + (x - ux * L - px * W).toFixed(2) + ' ' + (y - uy * L - py * W).toFixed(2);
  }

  /* Un salto de un día a otro: el del bus va por arriba, el del camión por
     abajo, y el de los dos (paso 7) por encima de todo. Los saltos no se
     mueven con la fila: hay uno para la fila de cerca y otro para la de
     lejos. Se guarda de qué día a qué día va (data-de, data-a) para que la
     sonda compare con lo que mide. */
  function salto(padre, fila, de, a, n, rotulo) {
    var el = A.el;
    var porArriba = fila !== 'camion';
    var y = porArriba ? ARRIBA : ABAJO;
    var alto = fila === 'comun' ? 106 : 44;
    var x0 = xDia(de, n), x1 = xDia(a, n), xm = (x0 + x1) / 2;
    var yc = porArriba ? y - alto : y + alto;
    var g = el('g', { class: 'md-arco am-fuera', 'data-fila': fila, 'data-de': de, 'data-a': a }, padre);
    /* Un salto dura 0,3 s y no los 0,8 de siempre: salen uno detrás de
       otro (cada 330 ms el del bus y cada 380 el del camión), y con 0,8 s
       se dibujaban tres a la vez, como una ola, en vez de saltar. */
    var camino = el('path', {
      class: 'am-trazo md-camino', d: 'M ' + x0 + ' ' + y + ' Q ' + xm + ' ' + yc + ' ' + x1 + ' ' + y,
      style: 'stroke:' + COLOR[fila] + ';stroke-width:1.6;stroke-linecap:round;' +
        'transition:stroke-dashoffset 0.3s linear var(--d,0s),opacity 0.25s ease var(--d,0s)'
    }, g);
    var flecha = el('path', {
      class: 'am-fuera', d: punta(x1, y, x1 - xm, y - yc),
      style: 'fill:none;stroke:' + COLOR[fila] + ';stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round'
    }, g);
    if (rotulo) {
      var yr = porArriba ? (y + yc) / 2 - 4 : (y + yc) / 2 + 13;
      var t = el('text', { class: 'am-rotulo md-arco-num', x: xm, y: yr, 'text-anchor': 'middle', 'font-size': 13, style: 'fill:' + COLOR[fila] }, g);
      t.textContent = rotulo;
    }
    return { g: g, camino: camino, flecha: flecha, de: de, a: a };
  }
  function verSalto(s, si, demora) {
    A.ver(s.g, si, demora);
    A.trazar(s.camino, si, demora);
    A.ver(s.flecha, si, si && demora != null ? demora + 280 : demora);
  }

  /* La ficha de un día: el número dentro, y un palito hasta su rayita en la
     fila. La del bus es cuadrada y la del camión redonda, y cada una va de
     su lado de la fila: se distinguen sin distinguir colores. */
  function ficha(padre, fila, v) {
    var el = A.el, bus = fila === 'bus';
    var g = el('g', { class: 'md-ficha am-fuera', 'data-fila': fila, 'data-v': v }, padre);
    el('line', {
      x1: 0, y1: bus ? FICHA.alto / 2 : -FICHA.alto / 2,
      x2: 0, y2: bus ? LINEA - 3 - FILA.bus : -(FILA.camion - LINEA - 3),
      style: 'stroke:' + COLOR[fila] + ';stroke-width:1.2;stroke-dasharray:2 2'
    }, g);
    el('rect', {
      class: 'am-ficha', x: -FICHA.ancho / 2, y: -FICHA.alto / 2, width: FICHA.ancho, height: FICHA.alto,
      rx: bus ? 4 : 10, style: 'stroke:' + COLOR[fila]
    }, g);
    var t = el('text', { class: 'am-digito md-num', x: 0, y: 5, 'text-anchor': 'middle', 'font-size': 14, style: 'fill:' + COLOR[fila] }, g);
    t.textContent = v;
    return { g: g, v: v };
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── Las bandas: los días en que suben los dos (detrás de todo) ── */
    [0].concat(COMUNES).forEach(function (d) {
      bandas[d] = el('rect', {
        class: 'md-banda am-fuera', 'data-v': d, x: -16, y: FILA.bus - 15, width: 32, height: FILA.camion - FILA.bus + 30, rx: 9,
        style: 'fill:var(--am-pri,#1565c0);fill-opacity:0.1;stroke:var(--dark,#1b2838);stroke-width:1.8'
      }, svg);
    });

    /* ── La fila de los días, que empieza hoy y sigue ── */
    var linea = el('g', null, svg);
    var fin = X0 + CERCA * VE.cerca;
    el('path', { d: 'M ' + (X0 - 3) + ' ' + LINEA + ' L ' + (fin + 3) + ' ' + LINEA, style: 'fill:none;stroke:var(--gray,#636e72);stroke-width:1.4' }, linea);
    el('path', {
      d: 'M ' + (fin + 1.5) + ' ' + (LINEA - 3.5) + ' L ' + (fin + 7) + ' ' + LINEA + ' L ' + (fin + 1.5) + ' ' + (LINEA + 3.5),
      style: 'fill:none;stroke:var(--gray,#636e72);stroke-width:1.4;stroke-linejoin:round;stroke-linecap:round'
    }, linea);
    for (var d = 0; d <= VE.lejos; d++) {
      var gd = el('g', { class: 'md-dia am-fuera', 'data-d': d }, linea);
      el('line', { x1: 0, y1: LINEA - 2.5, x2: 0, y2: LINEA + 2.5, style: 'stroke:var(--gray,#636e72);stroke-width:0.9' }, gd);
      dias.push({ g: gd, d: d });
    }
    /* «hoy» va escrito sobre la fila, en el día 0, entre el bus y el camión:
       es el día en que coincidieron, y de ahí se cuenta. */
    var hoy = el('text', { class: 'am-rotulo', x: X0, y: LINEA + 4, 'text-anchor': 'middle', 'font-size': 12 }, linea);
    hoy.textContent = 'hoy';

    /* ── La primera trampa: el día 14, vacío ── */
    hueco = el('g', { class: 'md-hueco am-fuera', 'data-v': SUMA }, svg);
    var xh = xDia(SUMA, 0);
    /* La raya sube hasta su rótulo: si no, el «14» quedaba flotando arriba
       y no se sabía de qué día hablaba. */
    el('line', { class: 'am-linea', x1: xh, y1: 61, x2: xh, y2: FILA.camion + 18, style: 'opacity:1' }, hueco);
    el('circle', { class: 'am-hueco', cx: xh, cy: LINEA, r: 4.5, style: 'fill:var(--card,#fff)' }, hueco);
    var th = el('text', { class: 'am-rotulo', x: xh, y: 56, 'text-anchor': 'middle', 'font-size': 13 }, hueco);
    th.textContent = SUMA + ': ninguno';

    /* ── Las dos filas: el bus arriba y el camión abajo ── */
    ['bus', 'camion'].forEach(function (f) {
      var g = el('g', { class: 'md-fila', 'data-fila': f }, svg);
      filaG[f] = g;
      var icono = el('text', { x: X0, y: FILA[f] + 6, 'text-anchor': 'middle', 'font-size': 17 }, g);
      icono.textContent = f === 'bus' ? '🚌' : '🚚';
      var paso = f === 'bus' ? BUS : CAMION;
      var cerca = [0].concat(multiplos(paso, VE.cerca));
      for (var i = 1; i < cerca.length; i++) saltos[f].push(salto(g, f, cerca[i - 1], cerca[i], 0, i === 1 ? '+' + paso : ''));
      DIAS[f].forEach(function (v) { fichas[f].push(ficha(g, f, v)); });
    });

    /* ── Los saltos de los dos, cada 24 días (paso 7) ── */
    [0].concat(COMUNES).forEach(function (d, i, l) {
      if (i) comunes.push(salto(svg, 'comun', l[i - 1], d, 7, '+' + PRIMERO));
    });
    /* Y el que sigue hacia el 72, que se sale del dibujo: los múltiplos
       comunes tampoco se acaban. Va con raya cortada y sin punta, porque
       no llega a ninguna parte que se vea. */
    sigue = el('g', { class: 'am-fuera' }, svg);
    var xs = xDia(COMUNES[COMUNES.length - 1], 7), ancho = LEJOS * PRIMERO;
    el('path', {
      d: 'M ' + xs + ' ' + ARRIBA + ' Q ' + (xs + ancho / 2) + ' ' + (ARRIBA - 106) + ' ' + (xs + ancho) + ' ' + ARRIBA,
      style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:1.6;stroke-dasharray:4 3'
    }, sigue);
    var t72 = el('text', { class: 'am-rotulo', x: ANCHO - 6, y: 40, 'text-anchor': 'end', 'font-size': 13 }, sigue);
    t72.textContent = (COMUNES[COMUNES.length - 1] + PRIMERO) + '…';

    /* ── Lo que se dice encima de una banda ── */
    /* El de la fila de cerca va por encima de los saltos del bus; los de la
       fila de lejos, que ya no tiene saltos, van pegados a su banda. */
    function rotulo(clave, texto, y) {
      var t = el('text', { class: 'am-rotulo md-rotulo-banda am-fuera', x: 0, y: y, 'text-anchor': 'middle', 'font-size': 13 }, svg);
      t.textContent = texto;
      rotulos[clave] = t;
    }
    rotulo('losdos', '¡los dos!', 56);
    rotulo('primera', '1.ª vez', 76);
    rotulo('segunda', '2.ª vez', 76);

    /* ── Sin dibujar: 8 no, 16 no, 24 sí (paso 5) ── */
    PRUEBAS.forEach(function (v) {
      var bien = v % BUS === 0;
      var t = el('text', {
        class: 'am-rotulo md-prueba am-fuera', 'data-v': v, 'data-ok': bien ? 'si' : 'no',
        x: xDia(v, 5), y: 200, 'text-anchor': 'middle', 'font-size': 14
      }, svg);
      t.textContent = bien ? '✓ ' + BUS + '\u00a0×\u00a0' + (v / BUS) : '✗';
      pruebas.push(t);
    });
  }

  function pintar(n, antes) {
    var adelante = n > antes;
    /* Al alejarse la fila (del 5 al 6), lo que ya estaba se corre y lo nuevo
       llega después, desde la derecha. */
    var alejando = adelante && n === 6 && antes < 6;
    var tarde = alejando ? 750 : 0;

    dias.forEach(function (t) {
      var ve = seVe(t.d, n);
      A.mover(t.g, xDia(t.d, n), 0, 0, 1, ve && t.d > VE.cerca ? tarde : 0);
      A.ver(t.g, ve, ve && t.d > VE.cerca ? tarde : 0);
    });

    /* Las bandas: hoy siempre; el 24 desde que se encuentra; el 48 en la
       segunda trampa y al final. */
    Object.keys(bandas).forEach(function (k) {
      var d = +k;
      var ve = d === 0 || (d === PRIMERO && n >= 3) || (d === PRODUCTO && n >= 6);
      var dm = 0;
      if (adelante && ve && d === PRIMERO && n === 3) dm = 150;
      if (alejando && d === PRODUCTO) dm = tarde + 300;
      A.mover(bandas[k], xDia(d, n), 0, 0, 1, dm);
      A.ver(bandas[k], ve, dm);
    });

    /* Las dos filas. En el paso 5 la del bus se aparta (queda tenue): «sin
       dibujar» quiere decir que la tabla del 6 no hace falta escrita. */
    filaG.bus.style.opacity = n === 5 ? '0.22' : '';
    ['bus', 'camion'].forEach(function (f) {
      var desde = f === 'bus' ? 1 : 2;
      var ritmo = f === 'bus' ? 330 : 380;
      var llega = adelante && n === desde;
      saltos[f].forEach(function (s, i) {
        verSalto(s, n >= desde && !lejos(n), llega ? 120 + i * ritmo : 0);
      });
      fichas[f].forEach(function (c, i) {
        var ve = n >= desde && seVe(c.v, n);
        var dm = 0;
        if (llega) dm = 120 + i * ritmo + 260;
        else if (alejando && c.v > VE.cerca) dm = tarde + (i - 3) * 90;
        A.mover(c.g, xDia(c.v, n), FILA[f], 0, ve ? 1 : 0.6, dm);
        A.ver(c.g, ve, dm);
      });
    });

    /* La primera trampa: el 14 vacío. */
    A.ver(hueco, n === 4, adelante && n === 4 ? 150 : 0);

    /* Sin dibujar: 8 no, 16 no, 24 sí, uno detrás de otro. */
    pruebas.forEach(function (t, i) { A.ver(t, n === 5, adelante && n === 5 ? 300 + i * 550 : 0); });

    /* Los rótulos encima de las bandas. */
    function ponRotulo(clave, d, si, dm) {
      A.mover(rotulos[clave], xDia(d, n), 0, 0, 1, dm);
      A.ver(rotulos[clave], si, dm);
    }
    ponRotulo('losdos', PRIMERO, n === 3, adelante && n === 3 ? 450 : 0);
    ponRotulo('primera', PRIMERO, n === 6, alejando ? tarde + 600 : 0);
    ponRotulo('segunda', PRODUCTO, n === 6, alejando ? tarde + 800 : 0);

    /* Cada 24 días, los dos (paso 7). */
    comunes.forEach(function (s, i) { verSalto(s, n === 7, adelante && n === 7 ? 150 + i * 600 : 0); });
    A.ver(sigue, n === 7, adelante && n === 7 ? 150 + comunes.length * 600 : 0);
  }

  function marcador(n, antes) {
    var adelante = n > antes;
    return [
      { cifra: '6 y 8', palabras: 'cada cuántos días suben' },
      { cifra: '6, 12, 18…', palabras: 'los días del bus', salto: adelante ? '+6' : '' },
      { cifra: '8, 16, 24…', palabras: 'los días del camión', salto: adelante ? '+8' : '' },
      { cifra: '24', palabras: 'el primer múltiplo común' },
      { cifra: '14', palabras: '6 + 8: no sube ninguno' },
      { cifra: '24', palabras: '6 × 4 = 8 × 3 = 24' },
      { cifra: '48', palabras: '6 × 8: la segunda vez' },
      { cifra: '24, 48, 72…', palabras: 'los múltiplos comunes de 6 y 8', salto: adelante ? '+24' : '' }
    ][n];
  }

  AnimacionMision.montar('#amCalendario', {
    vista: [ANCHO, ALTO],
    describe: 'La fila de los días, que empieza hoy: arriba, los días en que sube el bus; abajo, los días en que sube el camión del agua.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🚌 Los días del bus', '🚚 Los del camión', '🔍 Buscar el primero', '🤔 ¿Y si sumo 6 + 8?',
        '🧮 Hacerlo sin dibujar', '🤔 ¿Y si multiplico?', '🔁 ¿Y después?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
