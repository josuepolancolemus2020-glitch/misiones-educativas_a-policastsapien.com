/* ============================================================
   Animación de «Pensar con Orden: cuándo una razón es buena»
   (Ruta de la Raíz, Filosofía, etapa 2)
   ------------------------------------------------------------
   La historia: en la pulpería le dijeron a Wilmer que el abono caro es el
   bueno, «porque todo el mundo lo compra». Compró ocho sacos y ahí se fue
   la mitad del dinero de la siembra. La milpa salió igual que la del
   vecino, que compró el barato. Nadie le mintió: cuánta gente lo compra no
   dice nada del abono, y él no supo pedir otra razón.

   Lo que se dibuja: la pulpería. A la izquierda, el que vende detrás del
   mostrador, con los dos sacos encima; en medio, Wilmer; a la derecha, la
   fila de los que compran. Lo que le dicen sale en un globo, y el globo se
   parte en sus dos pedazos: el primero cae encima de los sacos (habla del
   abono) y el segundo encima de la fila (habla de la gente). Abajo, lo que
   le cuesta: la mitad de sus monedas y ocho sacos; después, las dos milpas,
   iguales. Y al final, la pregunta que le faltó, que va al abono.

   ⚠️ No se nombra ninguna falacia, ni el color del semáforo, ni las piezas
   de un argumento: «apelación a la mayoría» es la respuesta de la selección
   múltiple, los colores son el Clasifica y la evaluación, y «razón» y
   «conclusión» son pareados. La escena dice lo que dice la historia: de qué
   habla cada parte.

   ⚠️ Los dos pedazos llevan el ancho medido con la Fredoka (textLength): la
   coma se queda pegada al primero aunque la letra tarde en llegar, y cada
   pedazo cae centrado encima de lo suyo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPulperia')) return;

  var ANCHO = 320, ALTO = 240;

  /* ── lo que le dicen, en sus dos pedazos (Fredoka 600 a 9.5) ── */
  var LETRA = 9.5;
  var PEDAZOS = [
    { k: 'dice', txt: 'El abono caro es el bueno', ancho: 109.6 },
    { k: 'porque', txt: 'porque todo el mundo lo compra.', ancho: 140.2 }
  ];
  var GLOBO = { x0: 38, x1: 196, y0: 8, y1: 44, r: 8, x: 46, renglones: [22, 36], cola: [52, 66], punta: [30, 95] };

  /* ── la pulpería ── */
  var SUELO = 152;
  var MOSTRADOR = { x0: 10, x1: 124, tabla: 115, y0: 120, y1: SUELO };
  var VENDE = { x: 26, y: 116, tam: 20 };
  var SACO = { w: 26, h: 30 };
  var SACOS = [{ k: 'barato', cx: 60 }, { k: 'caro', cx: 98 }];
  var WILMER = { x: 140, y: 150, tam: 22, nombre: 164 };
  var COLA = { xs: [190, 216, 242, 268, 294], y: 150, tam: 20, quienes: ['👩', '🧑', '👴', '👨', '👵'] };
  /* Dónde cae cada pedazo: el primero encima de los dos sacos, el segundo
     encima de la fila, justo arriba de las cabezas. */
  var CAE = [{ cx: (SACOS[0].cx + SACOS[1].cx) / 2, y: 78 }, { cx: (COLA.xs[0] + COLA.xs[COLA.xs.length - 1]) / 2, y: 118 }];

  /* ── lo que le cuesta: las monedas y los ocho sacos ── */
  var MONEDAS = { n: 8, x0: 22, paso: 17, y: 184, r: 7, dice: 204 };
  var VAN = 4;                       /* las que se van: la mitad */
  var CAJA_PAGO = { x: 30, y: 134 }; /* adonde van: al mostrador */
  var MIOS = { xs: [196, 220, 244, 268], bases: [186, 210], w: 16, h: 18, dice: 224 };

  /* ── las dos milpas ── */
  var TIERRA = { y0: 214, y1: 221 };
  var PARCELAS = [
    { k: 'wilmer', x0: 14, x1: 150, dice: 'la de Wilmer: el caro' },
    { k: 'vecino', x0: 170, x1: 306, dice: 'la del vecino: el barato' }
  ];
  var MATAS = 5, TOPE = 170, CRECE = 52;
  var IGUAL = { y: 168, dice: 181 };

  /* ── la pregunta que le faltó, el velo y el cuaderno ── */
  var TARJETA = { cx: CAE[0].cx, x0: CAE[0].cx - 54, x1: CAE[0].cx + 54, y0: 10, y1: 44 };
  var FLECHA = { y0: 44, y1: 67 };
  var VELO = { x0: 164, x1: 318, y0: 104, y1: 157, dice: 99 };
  var CUADERNO = { x0: 14, x1: 306, y0: 168, y1: 236 };

  /* ── el reloj de la escena ── */
  var VIAJE = 800, APAGA = 500;
  var T1 = { coma: 0, parte: 500 };
  var T2 = { moneda: 200, entre: 150, sacos: 1700, saco: 120 };
  var T3 = { tierra: 500, crece: 900, igual: 1900 };
  var T4 = { velo: 300, pregunta: 1000, flecha: 1600 };
  var T5 = { cuaderno: 500 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }
  /* Un saco de abono lleno, con la manta recogida y amarrada arriba. Es la
     forma del saco bueno de Los Adjetivos, a otra escala: un cuerpo ancho y
     redondeado abajo, y la TRAMA de la manta a lo ancho y a lo alto, que es
     lo que dice que esto es tela. Sin ella, un saco liso se lee como una
     tinaja. h va de la base a lo alto de la manta recogida. */
  function saco(A, padre, cx, base, w, h, clase) {
    var cuerpo = h * 0.8, cuello = base - cuerpo, sx = w / 66, sy = cuerpo / 70, alto = base - h;
    function X(d) { return r2(cx + d * sx); }
    function Y(d) { return r2(cuello + d * sy); }
    var g = A.el('g', { 'data-saco-cuerpo': '' }, padre);
    A.el('path', { d: 'M' + X(-9) + ' ' + Y(0) + ' C' + X(-20) + ' ' + Y(4) + ' ' + X(-31) + ' ' + Y(12) + ' ' + X(-32) + ' ' + Y(26) +
                   ' L' + X(-33) + ' ' + Y(62) + ' Q' + X(-33) + ' ' + Y(70) + ' ' + X(-25) + ' ' + Y(70) + ' L' + X(25) + ' ' + Y(70) +
                   ' Q' + X(33) + ' ' + Y(70) + ' ' + X(33) + ' ' + Y(62) + ' L' + X(32) + ' ' + Y(26) +
                   ' C' + X(31) + ' ' + Y(12) + ' ' + X(20) + ' ' + Y(4) + ' ' + X(9) + ' ' + Y(0) + ' Z', 'class': clase, 'data-saco-manta': '' }, g);
    A.el('path', { d: 'M' + X(-30) + ' ' + Y(34) + ' L' + X(30) + ' ' + Y(34) + ' M' + X(-32) + ' ' + Y(48) + ' L' + X(32) + ' ' + Y(48) +
                   ' M' + X(-32) + ' ' + Y(60) + ' L' + X(32) + ' ' + Y(60) + ' M' + X(-18) + ' ' + Y(14) + ' L' + X(-18) + ' ' + Y(67) +
                   ' M' + X(0) + ' ' + Y(6) + ' L' + X(0) + ' ' + Y(67) + ' M' + X(18) + ' ' + Y(14) + ' L' + X(18) + ' ' + Y(67), 'class': 'pu-trama' }, g);
    var recogida = function (k) { return r2(alto + (cuello - alto) * k); };
    A.el('path', { d: 'M' + X(-8) + ' ' + r2(cuello + 0.5) + ' L' + X(-12) + ' ' + recogida(0.25) + ' Q' + X(-6) + ' ' + r2(alto) + ' ' + X(0) + ' ' + recogida(0.18) +
                   ' Q' + X(6) + ' ' + r2(alto) + ' ' + X(12) + ' ' + recogida(0.25) + ' L' + X(8) + ' ' + r2(cuello + 0.5) + ' Z', 'class': clase }, g);
    A.el('path', { d: 'M' + X(-11) + ' ' + r2(cuello) + ' L' + X(11) + ' ' + r2(cuello), 'class': 'pu-amarra' }, g);
    return g;
  }
  /* El globo del que vende, con su cola hasta la cabeza: un solo trazo. */
  function globo(G) {
    var x0 = G.x0, x1 = G.x1, y0 = G.y0, y1 = G.y1, r = G.r;
    return 'M' + (x0 + r) + ' ' + y0 + ' L' + (x1 - r) + ' ' + y0 + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + r) +
      ' L' + x1 + ' ' + (y1 - r) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - r) + ' ' + y1 +
      ' L' + G.cola[1] + ' ' + y1 + ' L' + G.punta[0] + ' ' + G.punta[1] + ' L' + G.cola[0] + ' ' + y1 +
      ' L' + (x0 + r) + ' ' + y1 + ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - r) + ' L' + x0 + ' ' + (y0 + r) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + r) + ' ' + y0 + ' Z';
  }
  /* Una mata de maíz, con la raíz en la tierra y la espiga arriba. */
  function mata(A, padre, x) {
    var g = A.el('g', { 'data-mata': '' }, padre);
    var b = TIERRA.y0;
    A.el('path', { d: 'M' + x + ' ' + b + ' L' + x + ' ' + (TOPE + 6), 'class': 'pu-tallo' }, g);
    A.el('path', { d: 'M' + x + ' ' + (b - 10) + ' Q' + (x - 9) + ' ' + (b - 15) + ' ' + (x - 13) + ' ' + (b - 12) +
                   ' M' + x + ' ' + (b - 18) + ' Q' + (x + 9) + ' ' + (b - 23) + ' ' + (x + 13) + ' ' + (b - 20) +
                   ' M' + x + ' ' + (b - 27) + ' Q' + (x - 7) + ' ' + (b - 31) + ' ' + (x - 10) + ' ' + (b - 29), 'class': 'pu-hoja' }, g);
    A.el('ellipse', { cx: x + 3, cy: b - 16, rx: 2.2, ry: 4.5, 'class': 'pu-elote' }, g);
    A.el('path', { d: 'M' + x + ' ' + (TOPE + 6) + ' L' + (x - 3) + ' ' + TOPE + ' M' + x + ' ' + (TOPE + 6) + ' L' + x + ' ' + TOPE +
                   ' M' + x + ' ' + (TOPE + 6) + ' L' + (x + 3) + ' ' + TOPE, 'class': 'pu-espiga' }, g);
    return g;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    var defs = A.el('defs', null, svg);
    var cp = A.el('clipPath', { id: 'pu-tierra' }, defs);
    A.el('rect', { x: 0, y: 150, width: ANCHO, height: TIERRA.y0 - 150, 'data-recorte': '' }, cp);

    /* ── el suelo de la pulpería y el que vende, detrás del mostrador ── */
    A.el('path', { d: 'M' + MOSTRADOR.x1 + ' ' + SUELO + ' L' + ANCHO + ' ' + SUELO, 'class': 'pu-suelo', 'data-suelo': '' }, svg);
    P.vende = texto(A, svg, VENDE.x, VENDE.y, 'pu-emoji', VENDE.tam, 'middle', '🧔');
    P.vende.setAttribute('data-vende', '');
    var mos = A.el('g', { 'data-mostrador': '' }, svg);
    A.el('rect', { x: MOSTRADOR.x0, y: MOSTRADOR.y0, width: MOSTRADOR.x1 - MOSTRADOR.x0, height: MOSTRADOR.y1 - MOSTRADOR.y0,
                   'class': 'pu-madera', 'data-mostrador-frente': '' }, mos);
    A.el('rect', { x: MOSTRADOR.x0 - 3, y: MOSTRADOR.tabla, width: MOSTRADOR.x1 - MOSTRADOR.x0 + 6, height: MOSTRADOR.y0 - MOSTRADOR.tabla,
                   rx: 1.5, 'class': 'pu-tabla', 'data-mostrador-tabla': '' }, mos);
    P.sacos = SACOS.map(function (s) {
      var g = A.el('g', { 'data-saco': s.k }, svg);
      saco(A, g, s.cx, MOSTRADOR.tabla, SACO.w, SACO.h, s.k === 'caro' ? 'pu-saco-caro' : 'pu-saco');
      texto(A, g, s.cx, 139, 'pu-tinta', 8.5, 'middle', s.k).setAttribute('data-saco-dice', '');
      return g;
    });

    /* ── Wilmer y la fila ── */
    var w = A.el('g', { 'data-wilmer': '' }, svg);
    texto(A, w, WILMER.x, WILMER.y, 'pu-emoji', WILMER.tam, 'middle', '👨‍🌾').setAttribute('data-wilmer-cara', '');
    texto(A, w, WILMER.x, WILMER.nombre, 'am-rotulo', 8.5, 'middle', 'Wilmer').setAttribute('data-wilmer-nombre', '');
    P.cola = COLA.xs.map(function (x, i) {
      var g = A.el('g', { 'data-fila': String(i) }, svg);
      texto(A, g, x, COLA.y, 'pu-emoji', COLA.tam, 'middle', COLA.quienes[i]).setAttribute('data-fila-cara', '');
      return g;
    });

    /* ── lo que le cuesta: sus monedas ── */
    P.dinero = A.el('g', { 'data-dinero': '' }, svg);
    P.fantasmas = []; P.monedas = [];
    for (var i = 0; i < MONEDAS.n; i++) {
      var x = MONEDAS.x0 + MONEDAS.paso * i;
      P.fantasmas.push(A.el('circle', { cx: x, cy: MONEDAS.y, r: MONEDAS.r, 'class': 'pu-fantasma', 'data-fantasma': String(i) }, P.dinero));
      /* La que viaja y la que se apaga son dos piezas: una pieza tiene una
         sola demora. */
      var va = A.el('g', { 'data-moneda': String(i) }, P.dinero);
      var se = A.el('g', { 'data-moneda-ve': '' }, va);
      A.el('circle', { cx: x, cy: MONEDAS.y, r: MONEDAS.r, 'class': 'pu-moneda' }, se);
      A.el('circle', { cx: x, cy: MONEDAS.y, r: MONEDAS.r - 2.6, 'class': 'pu-moneda-borde' }, se);
      P.monedas.push({ va: va, se: se, x: x });
    }
    var mitad = MONEDAS.x0 + MONEDAS.paso * (MONEDAS.n - 1) / 2;
    texto(A, P.dinero, mitad, MONEDAS.dice, 'am-rotulo', 8.5, 'middle', 'el dinero de la siembra').setAttribute('data-dinero-dice', '');

    /* ── sus ocho sacos ── */
    P.mios = A.el('g', { 'data-mios': '' }, svg);
    P.miosUno = [];
    MIOS.bases.forEach(function (b) {
      MIOS.xs.forEach(function (x) {
        var g = A.el('g', { 'data-mio': '' }, P.mios);
        saco(A, g, x, b, MIOS.w, MIOS.h, 'pu-saco-caro');
        P.miosUno.push(g);
      });
    });
    P.miosDice = texto(A, P.mios, (MIOS.xs[0] + MIOS.xs[MIOS.xs.length - 1]) / 2, MIOS.dice, 'am-rotulo', 8.5, 'middle', 'sus ocho sacos');
    P.miosDice.setAttribute('data-mios-dice', '');

    /* ── las dos milpas: la tierra, las matas que salen de ella y lo igual ── */
    P.milpa = A.el('g', { 'data-milpa': '' }, svg);
    P.tierras = PARCELAS.map(function (p) {
      var g = A.el('g', { 'data-parcela': p.k }, P.milpa);
      A.el('rect', { x: p.x0, y: TIERRA.y0, width: p.x1 - p.x0, height: TIERRA.y1 - TIERRA.y0, rx: 2, 'class': 'pu-tierra', 'data-tierra': '' }, g);
      texto(A, g, (p.x0 + p.x1) / 2, 233, 'am-rotulo', 8.5, 'middle', p.dice).setAttribute('data-parcela-dice', '');
      return g;
    });
    P.brotan = A.el('g', { 'clip-path': 'url(#pu-tierra)', 'data-brotan': '' }, P.milpa);
    P.matas = PARCELAS.map(function (p) {
      var g = A.el('g', { 'data-matas': p.k }, P.brotan);
      var paso = (p.x1 - p.x0) / MATAS;
      for (var j = 0; j < MATAS; j++) mata(A, g, r2(p.x0 + paso * (j + 0.5)));
      return g;
    });
    P.igual = A.el('g', { 'data-igual': '' }, P.milpa);
    A.el('path', { d: 'M' + PARCELAS[0].x0 + ' ' + IGUAL.y + ' L' + PARCELAS[1].x1 + ' ' + IGUAL.y, 'class': 'pu-igual', 'data-igual-raya': '' }, P.igual);
    texto(A, P.igual, (PARCELAS[0].x1 + PARCELAS[1].x0) / 2, IGUAL.dice, 'am-rotulo', 8.5, 'middle', 'igual').setAttribute('data-igual-dice', '');

    /* ── el velo sobre lo que habla de la gente ── */
    P.velo = A.el('rect', { x: VELO.x0, y: VELO.y0, width: VELO.x1 - VELO.x0, height: VELO.y1 - VELO.y0, rx: 6, 'class': 'pu-velo', 'data-velo': '' }, svg);
    P.veloDice = texto(A, svg, (VELO.x0 + VELO.x1) / 2, VELO.dice, 'am-rotulo', 8.5, 'middle', 'no dice nada del abono');
    P.veloDice.setAttribute('data-velo-dice', '');

    /* ── el globo del que vende ── */
    P.globo = A.el('path', { d: globo(GLOBO), 'class': 'pu-globo', 'data-globo': '' }, svg);
    /* Cada pedazo viaja con su papel: dentro del globo no se ve, y al caer
       es lo que deja leerlo encima de cualquier fondo. */
    P.pedazos = PEDAZOS.map(function (p, j) {
      var g = A.el('g', { 'data-pedazo': p.k }, svg);
      var y = GLOBO.renglones[j];
      A.el('rect', { x: GLOBO.x - 4, y: y - 10, width: p.ancho + 8, height: 14, rx: 3, 'class': 'pu-papel', 'data-papel': '' }, g);
      var marco = A.el('rect', { x: GLOBO.x - 4, y: y - 10, width: p.ancho + 8, height: 14, rx: 3, 'class': 'pu-marco', 'data-marco': '' }, g);
      var t = texto(A, g, GLOBO.x, y, 'pu-tinta', LETRA, 'start', p.txt);
      t.setAttribute('textLength', p.ancho);
      t.setAttribute('lengthAdjust', 'spacing');
      t.setAttribute('data-pedazo-dice', '');
      return { g: g, marco: marco, dx: r2(CAE[j].cx - p.ancho / 2 - GLOBO.x), dy: CAE[j].y - y };
    });
    /* La coma, pegada al primer pedazo. La «o» de la Fredoka se sale casi un
       punto de su ancho, así que la coma va ese punto más allá. */
    P.coma = texto(A, svg, GLOBO.x + PEDAZOS[0].ancho + 0.8, GLOBO.renglones[0], 'pu-tinta', LETRA, 'start', ',');
    P.coma.setAttribute('data-coma', '');

    /* ── la pregunta que le faltó, con su flecha al abono ── */
    P.pregunta = A.el('g', { 'data-pregunta': '' }, svg);
    A.el('rect', { x: TARJETA.x0, y: TARJETA.y0, width: TARJETA.x1 - TARJETA.x0, height: TARJETA.y1 - TARJETA.y0, rx: 6,
                   'class': 'pu-tarjeta', 'data-pregunta-caja': '' }, P.pregunta);
    texto(A, P.pregunta, TARJETA.cx, TARJETA.y0 + 12, 'pu-suave', 8.5, 'middle', 'le faltó preguntar:').setAttribute('data-pregunta-dice', '');
    texto(A, P.pregunta, TARJETA.cx, TARJETA.y0 + 27, 'pu-fuerte', 10, 'middle', '¿Y en qué es mejor?').setAttribute('data-pregunta-dice', '');
    P.flecha = A.el('path', { d: 'M' + TARJETA.cx + ' ' + FLECHA.y0 + ' L' + TARJETA.cx + ' ' + FLECHA.y1 +
                              ' M' + (TARJETA.cx - 4) + ' ' + (FLECHA.y1 - 5) + ' L' + TARJETA.cx + ' ' + FLECHA.y1 + ' L' + (TARJETA.cx + 4) + ' ' + (FLECHA.y1 - 5),
                              'class': 'pu-flecha', 'data-flecha': '' }, svg);

    /* ── el cuaderno del final, abajo ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUADERNO.x0, y: CUADERNO.y0, width: CUADERNO.x1 - CUADERNO.x0, height: CUADERNO.y1 - CUADERNO.y0, rx: 5,
                   'class': 'pu-cuaderno', 'data-cuaderno-caja': '' }, P.cuaderno);
    texto(A, P.cuaderno, CUADERNO.x0 + 8, 185, 'pu-tinta', 9, 'start', 'Me dijeron:');
    A.el('path', { d: 'M70 186 L' + (CUADERNO.x1 - 8) + ' 186', 'class': 'pu-renglon', 'data-raya-escribir': '' }, P.cuaderno);
    texto(A, P.cuaderno, CUADERNO.x0 + 8, 207, 'pu-tinta', 9, 'start', '¿Habla de la cosa?');
    texto(A, P.cuaderno, 104, 207, 'pu-tinta', 9, 'start', 'sí · no');
    texto(A, P.cuaderno, CUADERNO.x0 + 8, 229, 'pu-tinta', 9, 'start', 'Mi pregunta:');
    A.el('path', { d: 'M78 230 L' + (CUADERNO.x1 - 8) + ' 230', 'class': 'pu-renglon', 'data-raya-escribir': '' }, P.cuaderno);
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso. cola: si está la fila; partida: si
     lo que le dicen ya se partió y cada pedazo cayó encima de lo suyo;
     dinero: sus monedas enteras, pagadas (la mitad en el mostrador) o ya
     fuera del dibujo; mios: si se ven sus ocho sacos; milpa: si se ven las
     dos milpas; velo: si ya va el velo sobre lo de la gente, con la pregunta
     que le faltó; cuaderno: si sale el cuaderno del final, abajo. */
  var ESTADOS = [
    { cola: true, partida: false, dinero: 'entero', mios: false, milpa: false, velo: false, cuaderno: false },
    { cola: true, partida: true, dinero: 'entero', mios: false, milpa: false, velo: false, cuaderno: false },
    { cola: true, partida: true, dinero: 'pagado', mios: true, milpa: false, velo: false, cuaderno: false },
    { cola: true, partida: true, dinero: 'fuera', mios: false, milpa: true, velo: false, cuaderno: false },
    { cola: true, partida: true, dinero: 'fuera', mios: false, milpa: true, velo: true, cuaderno: false },
    { cola: true, partida: true, dinero: 'fuera', mios: false, milpa: false, velo: true, cuaderno: true }
  ];

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function todo() {
    var lista = [P.globo, P.coma, P.dinero, P.mios, P.miosDice, P.milpa, P.brotan, P.igual, P.velo, P.veloDice, P.pregunta, P.flecha, P.cuaderno]
      .concat(P.cola, P.fantasmas, P.miosUno, P.tierras, P.matas);
    P.pedazos.forEach(function (p) { lista.push(p.g, p.marco); });
    P.monedas.forEach(function (m) { lista.push(m.va, m.se); });
    return lista;
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      P.cola.forEach(function (g) { A.ver(g, s.cola, 0); });
      A.ver(P.globo, !s.partida, 0);
      A.ver(P.coma, !s.partida, 0);
      P.pedazos.forEach(function (p) {
        A.mover(p.g, s.partida ? p.dx : 0, s.partida ? p.dy : 0, 0, 1, 0);
        A.ver(p.marco, s.partida, 0);
      });
      A.ver(P.dinero, s.dinero !== 'fuera', 0);
      P.monedas.forEach(function (m, i) {
        var se = i >= MONEDAS.n - VAN && s.dinero !== 'entero';
        A.mover(m.va, se ? CAJA_PAGO.x - m.x : 0, se ? CAJA_PAGO.y - MONEDAS.y : 0, 0, 1, 0);
        A.ver(m.se, !se, 0);
        A.ver(P.fantasmas[i], se, 0);
      });
      A.ver(P.mios, s.mios, 0);
      A.ver(P.miosDice, s.mios, 0);
      P.miosUno.forEach(function (g) { A.ver(g, s.mios, 0); });
      A.ver(P.milpa, s.milpa, 0);
      P.tierras.forEach(function (g) { A.ver(g, s.milpa, 0); });
      A.ver(P.brotan, s.milpa, 0);
      P.matas.forEach(function (g) { A.mover(g, 0, s.milpa ? 0 : CRECE, 0, 1, 0); });
      A.ver(P.igual, s.milpa, 0);
      A.ver(P.velo, s.velo, 0);
      A.ver(P.veloDice, s.velo, 0);
      A.ver(P.pregunta, s.velo, 0);
      A.ver(P.flecha, s.velo, 0);
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan cada vez que se ENTRA en
       ellos, también volviendo con «Atrás»; el 0 y el 5 se pintan siempre. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 5) {
      if (antes !== 4) { base(A, ESTADOS[5]); return; }
      base(A, ESTADOS[4]);
      A.ver(P.milpa, false, 0);
      A.ver(P.cuaderno, true, T5.cuaderno);
      return;
    }
    if (n === 1) {
      /* Lo que le dicen se parte: primero se va la coma, y cuando ya se fue
         cada pedazo cae encima de lo suyo. */
      base(A, ESTADOS[0]);
      A.ver(P.coma, false, T1.coma);
      A.ver(P.globo, false, T1.parte);
      P.pedazos.forEach(function (p) {
        A.mover(p.g, p.dx, p.dy, 0, 1, T1.parte);
        A.ver(p.marco, true, T1.parte + VIAJE);
      });
      return;
    }
    if (n === 2) {
      /* La mitad de sus monedas se va al mostrador, una por una; donde
         estaban queda su hueco. Cuando ya pagó, salen sus ocho sacos. */
      base(A, ESTADOS[1]);
      P.monedas.forEach(function (m, i) {
        var k = i - (MONEDAS.n - VAN);
        if (k < 0) return;
        var sale = T2.moneda + T2.entre * k;
        A.mover(m.va, CAJA_PAGO.x - m.x, CAJA_PAGO.y - MONEDAS.y, 0, 1, sale);
        A.ver(m.se, false, sale + VIAJE);
        A.ver(P.fantasmas[i], true, sale);
      });
      A.ver(P.mios, true, 0);
      A.ver(P.miosDice, true, T2.sacos);
      P.miosUno.forEach(function (g, j) { A.ver(g, true, T2.sacos + T2.saco * j); });
      return;
    }
    if (n === 3) {
      /* Lo del dinero se va, y cuando ya se fue sale la tierra de las dos
         milpas; de ella, al mismo tiempo, las matas. Cuando ya crecieron, la
         raya de lo igual. */
      base(A, ESTADOS[2]);
      A.ver(P.dinero, false, 0);
      A.ver(P.mios, false, 0);
      A.ver(P.milpa, true, 0);
      P.tierras.forEach(function (g) { A.ver(g, true, T3.tierra); });
      A.ver(P.brotan, true, T3.crece);
      P.matas.forEach(function (g) { A.mover(g, 0, 0, 0, 1, T3.crece); });
      A.ver(P.igual, true, T3.igual);
      return;
    }
    base(A, ESTADOS[3]);
    A.ver(P.velo, true, T4.velo);
    A.ver(P.veloDice, true, T4.velo);
    A.ver(P.pregunta, true, T4.pregunta);
    A.ver(P.flecha, true, T4.flecha);
  }

  var FRASES = [
    'En la pulpería le dicen a Wilmer cuál abono es el bueno, y por qué. ¿De qué habla cada parte?',
    'La primera parte habla del abono. La segunda habla de la gente: de cuánta lo compra.',
    'Con eso, Wilmer compra ocho sacos del caro. Ahí se va la mitad del dinero de la siembra.',
    'Llega la cosecha. Su milpa sale igual que la del vecino, que compró el barato.',
    'Nadie le mintió. Lo de la gente no dice nada del abono. Le faltó preguntar: «¿Y en qué es mejor?».',
    'Ahora tú: escribe algo que te dijeron esta semana, y su porqué. ¿Habla de la cosa? Si no, escribe tu pregunta.'
  ];
  var BOTONES = ['✂️ Separar las partes', '🛒 Que compre', '🌽 La cosecha', '❓ ¿Qué le faltó?', '✍️ ¿Y tú?', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['2', 'partes en lo que le dicen'],
    ['1', 'parte habla del abono; la otra, de la gente'],
    ['8', 'sacos, y se fue la mitad del dinero'],
    ['2', 'milpas, y salen iguales'],
    ['1', 'pregunta que va al abono'],
    ['3', 'renglones en tu cuaderno']
  ];

  AnimacionMision.montar('#amPulperia', {
    vista: [ANCHO, ALTO],
    describe: 'En la pulpería le dicen a Wilmer que el abono caro es el bueno, porque todo el mundo lo compra. ' +
      'La primera parte habla del abono y la segunda, de la gente. Wilmer compra ocho sacos con la mitad del dinero de la siembra, ' +
      'y su milpa sale igual que la del vecino. Le faltó preguntar en qué es mejor.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
