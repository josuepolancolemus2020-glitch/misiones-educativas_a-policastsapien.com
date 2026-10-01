/* ============================================================
   Animación de «Motores y Mecanismos» (Ruta de los Robots, etapa 3)
   ------------------------------------------------------------
   La historia: Marvin le pegó el motor directo a las ruedas de su
   carrito. En el aire giraban rapidísimo; en el suelo, con un librito
   encima para la feria, no se movió ni un centímetro. El motor estaba
   bueno y la pila estaba llena.

   Lo que se dibuja: el carrito visto de lado, con la pila y el motor.
   En el aire, cada vuelta del motor es una vuelta de la rueda, y dos
   rayitas por vuelta las van contando arriba. En el suelo, con el
   librito encima, dos flechas debajo del suelo comparan lo que empuja la
   rueda con lo que hace falta para moverlo: no alcanza, y el carrito se
   queda donde está. Después el motor mueve un engranaje de 12 dientes, y
   ese mueve uno de 24 pegado a la rueda: en el aire la rueda da una
   vuelta por cada dos del motor, y en el suelo empuja el doble que
   antes, más de lo que hace falta. El carrito avanza, despacio, con el
   mismo motor y la misma pila.

   ⚠️ Lo que se cuenta es lo que se puede contar. Las vueltas salen de
   los dientes (24 entre 12 son dos) y la sonda las vuelve a calcular; el
   carrito avanza lo que la rueda gira por su orilla, sin resbalar. El
   empuje se dibuja con la flecha del doble, que es lo que da un
   engranaje sin pérdidas; la frase no dice «el doble», dice «más de lo
   que hace falta», que es verdad también con un engranaje de juguete.

   ⚠️ Lo que NO se dice, y a propósito. La prueba pregunta cómo se llaman
   las piezas (motorreductor, motor DC, actuador, mecanismo), hacia dónde
   gira cada engranaje y cuántas veces más fuerza da un tren de dientes.
   Aquí no se nombra ninguna pieza fuera del motor, la pila y los dos
   engranajes, no se habla del sentido del giro y no se escribe «veces».
   Y los números de la escena (12 y 24) no son los de ninguna pregunta.

   ⚠️ Una pieza tiene una sola demora. El carrito baja y avanza en dos
   capas, una por eje; el librito aparece y cae en una sola, porque las
   dos cosas pasan a la vez.

   ⚠️ La misión es bilingüe, y la animación también: la escena trae sus dos
   idiomas escritos, y `idioma()` cambia los rótulos del dibujo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCarrito')) return;

  var ANCHO = 320, ALTO = 300;
  var lang = 'es';

  /* ── el dibujo ─────────────────────────────────────────────── */
  var SUELO = 236;
  var R = 38;                                     // el radio de las dos ruedas
  var R1 = { x: 80, y: 198 };                     // la rueda del motor
  var R2 = { x: 234, y: 198 };                    // la de adelante
  var PLATA = { x0: 40, x1: 276, y0: 140, y1: 150 };   // la plataforma del carrito
  var ALZA = 24;                                  // cuánto sube el carrito para estar en el aire
  var AVANZA = 40;                                // lo que avanza con el librito encima
  /* Los engranajes: el grande, de 24 dientes, pegado a la rueda; el
     pequeño, de 12, en el motor. Cada diente ocupa lo mismo en los dos
     (el radio va en proporción al número de dientes), así que encajan, y
     por cada vuelta del grande el pequeño da dos. */
  var DIENTES_G = 24, DIENTES_P = 12;
  var PASO = 1.125;                               // el radio de un engranaje, por diente
  var RG = DIENTES_G * PASO, RP = DIENTES_P * PASO;
  var HACIA = 0;                                  // hacia dónde queda el motor, visto desde la rueda
  var MR = 22;                                    // el motor visto de frente: un tarro redondo
  var M0 = { x: R1.x, y: R1.y };                  // el motor pegado directo a la rueda
  var M1 = {                                      // el motor con su engranaje
    x: R1.x + (RG + RP) * Math.cos(HACIA * Math.PI / 180),
    y: R1.y + (RG + RP) * Math.sin(HACIA * Math.PI / 180)
  };
  var PILA = { x0: 44, x1: 88, y0: 130, y1: 140 };
  var LIBRO = { x0: 100, x1: 184, y0: 124, y1: 140 };
  var CAE = 40;                                   // de qué altura cae el librito
  /* Las dos flechas, debajo del suelo y desde donde la rueda toca el
     suelo: la de rayitas es lo que hace falta para moverlo con el librito;
     la entera, lo que empuja la rueda. Con el engranaje empuja el doble. */
  var FALTA = 60;
  var EMPUJE = [42, 84];
  var Y_FALTA = 256, Y_EMPUJE = 274;
  /* Las rayitas que cuentan las vueltas, arriba */
  var FILAS = { motor: 40, rueda: 62 };
  var RAYA0 = 152, ENTRE_RAYAS = 12;

  /* ── el reloj de la escena ──────────────────────────────────── */
  var GIRO_T = 3000;                              // seis vueltas del motor en el aire
  var VUELTAS = 6;
  var T1 = 400;                                   // paso 1: empieza a girar
  var T3 = 3600;                                  // paso 3: empieza a girar
  var T4 = 3100;                                  // paso 4: empieza a avanzar
  var AVANZA_T = 2500;
  /* Lo que gira la rueda al avanzar: el carrito avanza lo que la rueda
     gira por su orilla. */
  var THETA = AVANZA / R * 180 / Math.PI;

  var RS = {
    motor: { es: 'motor', en: 'motor' },
    pila: { es: 'pila', en: 'battery' },
    libro: { es: 'librito', en: 'book' },
    aire: { es: 'en el aire', en: 'in the air' },
    filaMotor: { es: 'vueltas del motor', en: 'motor turns' },
    filaRueda: { es: 'vueltas de la rueda', en: 'wheel turns' },
    nota: { es: 'Las vueltas van en cámara lenta.', en: 'The turns are in slow motion.' },
    falta: { es: 'lo que hace falta con el librito', en: 'what it takes with the book' },
    empuja: { es: 'lo que empuja la rueda', en: 'what the wheel pushes' }
  };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }
  function origen(n, x, y) { n.style.transformOrigin = x + 'px ' + y + 'px'; }
  /* Lo que gira o avanza más de un paso corriente dice cuánto tarda */
  function dura(n, ms) { n.style.setProperty('--mo-t', Math.round(ms) + 'ms'); }
  function f2(v) { return (Math.round(v * 100) / 100).toString(); }

  /* Un engranaje: n dientes alrededor de su radio. Cada diente es un
     trapecio: ancho abajo, angosto arriba. */
  function engranaje(cx, cy, r, n, fase) {
    var p = 2 * Math.PI / n, a0 = fase * Math.PI / 180, d = '';
    for (var k = 0; k < n; k++) {
      var a = a0 + k * p;
      [[-0.30, r - 1.6], [-0.15, r + 1.8], [0.15, r + 1.8], [0.30, r - 1.6]].forEach(function (q, i) {
        var x = cx + Math.cos(a + q[0] * p) * q[1], y = cy + Math.sin(a + q[0] * p) * q[1];
        d += (k === 0 && i === 0 ? 'M' : ' L') + f2(x) + ' ' + f2(y);
      });
    }
    return d + ' Z';
  }

  function rueda(A, padre, c, conPunto) {
    var g = A.el('g', { 'class': 'mo-gira', 'data-gira': conPunto ? 'rueda1' : 'rueda2' }, padre);
    origen(g, c.x, c.y);
    return g;
  }
  function llanta(A, g, c, conPunto, cual) {
    A.el('circle', { cx: c.x, cy: c.y, r: R - 3.5, 'class': 'mo-llanta', 'data-llanta': cual }, g);
    /* el canto de la llanta: en la pantalla oscura es lo que la separa del fondo */
    A.el('circle', { cx: c.x, cy: c.y, r: R, 'class': 'mo-canto', 'data-borde': cual }, g);
    A.el('circle', { cx: c.x, cy: c.y, r: R - 7, 'class': 'mo-canto' }, g);
    for (var k = 0; k < 4; k++) {
      var a = (45 + k * 90) * Math.PI / 180;
      A.el('path', { d: 'M' + f2(c.x + Math.cos(a) * 6) + ' ' + f2(c.y + Math.sin(a) * 6) + ' L' + f2(c.x + Math.cos(a) * (R - 8)) + ' ' + f2(c.y + Math.sin(a) * (R - 8)),
        'class': 'mo-rayo' }, g);
    }
    A.el('circle', { cx: c.x, cy: c.y, r: 5, 'class': 'mo-cubo' }, g);
    if (conPunto) A.el('circle', { cx: c.x, cy: c.y - (R - 3.5), r: 3.2, 'class': 'mo-punto', 'data-punto': '' }, g);
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    A.el('rect', { x: 0, y: SUELO, width: ANCHO, height: ALTO - SUELO, 'class': 'mo-suelo', 'data-suelo': '' }, svg);

    /* la nota de la cámara lenta, y las rayitas que cuentan las vueltas */
    P.nota = texto(A, svg, ANCHO / 2, 15, 'am-rotulo', 9.5, 'middle', '');
    P.nota.setAttribute('data-nota', '');
    P.panel = A.el('g', { 'data-panel': '' }, svg);
    A.el('circle', { cx: 19, cy: FILAS.motor - 1.5, r: 5.5, 'class': 'mo-motor' }, P.panel);
    A.el('circle', { cx: 19, cy: FILAS.rueda - 1.5, r: 5, 'class': 'mo-llanta-icono' }, P.panel);
    A.el('circle', { cx: 19, cy: FILAS.rueda - 5, r: 1.8, 'class': 'mo-punto' }, P.panel);
    P.filaMotor = texto(A, P.panel, 32, FILAS.motor + 2, 'am-rotulo', 10, 'start', '');
    P.filaMotor.setAttribute('data-fila', 'motor');
    P.filaRueda = texto(A, P.panel, 32, FILAS.rueda + 2, 'am-rotulo', 10, 'start', '');
    P.filaRueda.setAttribute('data-fila', 'rueda');
    P.rayas = { motor: [], rueda: [] };
    ['motor', 'rueda'].forEach(function (fila) {
      for (var k = 0; k < VUELTAS; k++) {
        var x = RAYA0 + k * ENTRE_RAYAS, y = FILAS[fila];
        P.rayas[fila].push(A.el('path', { d: 'M' + x + ' ' + (y - 8) + ' L' + x + ' ' + (y + 3), 'class': 'mo-raya mo-rapido',
          'data-cuenta': fila, 'data-k': k }, P.panel));
      }
    });

    /* en el aire: la sombra de cada rueda en el suelo, y su rótulo */
    P.sombra = A.el('g', { 'data-sombra-g': '' }, svg);
    [R1, R2].forEach(function (c, i) {
      A.el('ellipse', { cx: c.x, cy: SUELO, rx: 26, ry: 3.5, 'class': 'mo-sombra', 'data-sombra': i + 1 }, P.sombra);
    });
    P.aire = texto(A, P.sombra, (R1.x + R2.x) / 2, SUELO - 8, 'am-rotulo', 9.5, 'middle', '');
    P.aire.setAttribute('data-aire', '');

    /* donde estaba la rueda cuando arrancó: con raya cortada, para ver
       cuánto avanzó */
    P.salida = A.el('circle', { cx: R1.x, cy: R1.y, r: R - 0.5, 'class': 'mo-salida', 'data-salida': '' }, svg);

    /* las dos flechas, debajo del suelo: avanzan con el carrito */
    P.flechas = A.el('g', { 'class': 'mo-anda', 'data-flechas': '' }, svg);
    P.falta = A.el('g', { 'data-falta-g': '' }, P.flechas);
    A.el('path', { d: 'M' + R1.x + ' ' + SUELO + ' L' + R1.x + ' ' + (Y_EMPUJE + 4), 'class': 'mo-guia', 'data-guia': '' }, P.falta);
    A.el('path', { d: 'M' + R1.x + ' ' + Y_FALTA + ' L' + (R1.x + FALTA) + ' ' + Y_FALTA, 'class': 'mo-falta', 'data-falta': '' }, P.falta);
    A.el('path', { d: 'M' + (R1.x + FALTA - 6) + ' ' + (Y_FALTA - 4.5) + ' L' + (R1.x + FALTA) + ' ' + Y_FALTA + ' L' + (R1.x + FALTA - 6) + ' ' + (Y_FALTA + 4.5),
      'class': 'mo-falta-punta' }, P.falta);
    P.faltaNombre = texto(A, P.falta, R1.x, Y_FALTA - 6, 'am-rotulo', 9.5, 'start', '');
    P.faltaNombre.setAttribute('data-nombre', 'falta');
    P.empuje = EMPUJE.map(function (l, i) {
      var cual = i === 0 ? 'corto' : 'largo';
      var g = A.el('g', { 'data-empuje-g': cual }, P.flechas);
      var raya = A.el('path', { d: 'M' + R1.x + ' ' + Y_EMPUJE + ' L' + (R1.x + l - 5) + ' ' + Y_EMPUJE, 'class': 'mo-empuje', 'data-empuje': cual }, g);
      var punta = A.el('path', { d: 'M' + (R1.x + l - 7) + ' ' + (Y_EMPUJE - 5) + ' L' + (R1.x + l) + ' ' + Y_EMPUJE + ' L' + (R1.x + l - 7) + ' ' + (Y_EMPUJE + 5) + ' Z',
        'class': 'mo-empuje-punta', 'data-punta': cual }, g);
      return { g: g, raya: raya, punta: punta, largo: l };
    });
    P.empujaVe = A.el('g', { 'data-empuja-g': '' }, P.flechas);
    P.empujaNombre = texto(A, P.empujaVe, R1.x, Y_EMPUJE + 17, 'am-rotulo', 9.5, 'start', '');
    P.empujaNombre.setAttribute('data-nombre', 'empuja');

    /* el carrito: una capa para avanzar y otra para subir y bajar */
    P.carX = A.el('g', { 'class': 'mo-anda', 'data-carrito-x': '' }, svg);
    P.carY = A.el('g', { 'data-carrito-y': '' }, P.carX);

    /* El motor, visto de frente: un tarro redondo DETRÁS de la rueda,
       como va de verdad. Pegado directo, su eje es el de la rueda; con
       engranajes, se corre a un lado. Va en dos capas que se mueven juntas:
       el tarro detrás de la rueda, y su engranaje y su nombre delante. */
    P.motorFondo = A.el('g', { 'data-motor-fondo': '' }, P.carY);
    A.el('circle', { cx: M0.x, cy: M0.y, r: MR, 'class': 'mo-motor', 'data-motor-caja': '' }, P.motorFondo);
    A.el('circle', { cx: M0.x, cy: M0.y, r: MR - 5, 'class': 'mo-motor-tapa' }, P.motorFondo);

    /* las dos ruedas; el engranaje grande va pegado a la de atrás, detrás
       de sus rayos */
    P.rueda1 = rueda(A, P.carY, R1, true);
    P.grande = A.el('g', { 'data-engranaje-g': 'grande' }, P.rueda1);
    A.el('path', { d: engranaje(R1.x, R1.y, RG, DIENTES_G, HACIA), 'class': 'mo-engranaje-g', 'data-engranaje': 'grande', 'data-dientes': DIENTES_G }, P.grande);
    llanta(A, P.rueda1, R1, true, '1');
    P.rueda2 = rueda(A, P.carY, R2, false);
    llanta(A, P.rueda2, R2, false, '2');

    /* el engranaje pequeño, en el eje del motor, y el nombre del motor */
    P.motor = A.el('g', { 'data-motor': '' }, P.carY);
    P.pequeno = A.el('g', { 'data-engranaje-g': 'pequeno' }, P.motor);
    P.giraP = A.el('g', { 'class': 'mo-gira', 'data-gira': 'pequeno' }, P.pequeno);
    origen(P.giraP, M0.x, M0.y);
    A.el('path', { d: engranaje(M0.x, M0.y, RP, DIENTES_P, HACIA + 180 + 15), 'class': 'mo-engranaje-p', 'data-engranaje': 'pequeno', 'data-dientes': DIENTES_P }, P.giraP);
    A.el('circle', { cx: M0.x, cy: M0.y, r: 3, 'class': 'mo-cubo', 'data-eje': 'pequeno' }, P.pequeno);
    A.el('path', { d: 'M' + (M0.x + MR + 2) + ' ' + (M0.y + 1) + ' L' + (M0.x + 38) + ' ' + (M0.y + 1), 'class': 'mo-hilo', 'data-hilo': 'motor' }, P.motor);
    P.motorNombre = texto(A, P.motor, M0.x + 40, M0.y + 4.5, 'am-rotulo', 10, 'start', '');
    P.motorNombre.setAttribute('data-nombre', 'motor');
    /* el zumbido del motor que empuja y no avanza */
    P.zumba = A.el('g', { 'data-zumba': '' }, P.motor);
    [-1, 1].forEach(function (lado) {
      [4, 8].forEach(function (rr) {
        var cx0 = M0.x + lado * (MR + 1), a1 = -0.7, a2 = 0.7;
        var p1x = cx0 + lado * Math.cos(a1) * rr, p1y = M0.y + Math.sin(a1) * rr;
        var p2x = cx0 + lado * Math.cos(a2) * rr, p2y = M0.y + Math.sin(a2) * rr;
        A.el('path', { d: 'M' + f2(p1x) + ' ' + f2(p1y) + ' A' + rr + ' ' + rr + ' 0 0 ' + (lado > 0 ? 1 : 0) + ' ' + f2(p2x) + ' ' + f2(p2y),
          'class': 'mo-zumbido' }, P.zumba);
      });
    });

    /* la plataforma, la pila con su carga, y el librito que cae encima */
    A.el('rect', { x: PLATA.x0, y: PLATA.y0, width: PLATA.x1 - PLATA.x0, height: PLATA.y1 - PLATA.y0, rx: 4, 'class': 'mo-plataforma', 'data-plataforma': '' }, P.carY);
    A.el('rect', { x: PILA.x0, y: PILA.y0, width: PILA.x1 - PILA.x0, height: PILA.y1 - PILA.y0, rx: 2, 'class': 'mo-pila', 'data-pila': '' }, P.carY);
    A.el('rect', { x: PILA.x1, y: PILA.y0 + 3, width: 3, height: 4, 'class': 'mo-pila' }, P.carY);
    for (var b = 0; b < 3; b++) {
      A.el('rect', { x: PILA.x0 + 4 + b * 13, y: PILA.y0 + 2.5, width: 10, height: 5, rx: 1, 'class': 'mo-carga', 'data-carga': b }, P.carY);
    }
    P.pilaNombre = texto(A, P.carY, (PILA.x0 + PILA.x1) / 2, PILA.y0 - 5, 'am-rotulo', 9.5, 'middle', '');
    P.pilaNombre.setAttribute('data-nombre', 'pila');
    P.libro = A.el('g', { 'data-libro': '' }, P.carY);
    A.el('rect', { x: LIBRO.x0, y: LIBRO.y0, width: LIBRO.x1 - LIBRO.x0, height: LIBRO.y1 - LIBRO.y0, rx: 2, 'class': 'mo-libro', 'data-libro-caja': '' }, P.libro);
    A.el('rect', { x: LIBRO.x1 - 6, y: LIBRO.y0 + 2, width: 4, height: LIBRO.y1 - LIBRO.y0 - 4, 'class': 'mo-hojas' }, P.libro);
    P.libroNombre = texto(A, P.libro, (LIBRO.x0 + LIBRO.x1 - 6) / 2, LIBRO.y0 + 11.5, 'mo-libro-letra', 10, 'middle', '');
    P.libroNombre.setAttribute('data-nombre', 'libro');
  }

  function idioma(l) {
    lang = l === 'en' ? 'en' : 'es';
    P.nota.textContent = RS.nota[lang];
    P.filaMotor.textContent = RS.filaMotor[lang];
    P.filaRueda.textContent = RS.filaRueda[lang];
    P.aire.textContent = RS.aire[lang];
    P.faltaNombre.textContent = RS.falta[lang];
    P.empujaNombre.textContent = RS.empuja[lang];
    P.motorNombre.textContent = RS.motor[lang];
    P.pilaNombre.textContent = RS.pila[lang];
    P.libroNombre.textContent = RS.libro[lang];
  }

  /* ── los estados ───────────────────────────────────────────── */

  /* Pone de golpe, sin movimiento: así cada paso se vuelve a ver entero
     cada vez que se entra en él, también volviendo con «Atrás». */
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    var lista = [P.nota, P.panel, P.sombra, P.salida, P.flechas, P.falta, P.empujaVe, P.carX, P.carY, P.motorFondo, P.rueda1, P.grande,
      P.rueda2, P.motor, P.pequeno, P.giraP, P.zumba, P.libro];
    P.empuje.forEach(function (e) { lista.push(e.g, e.raya, e.punta); });
    P.rayas.motor.concat(P.rayas.rueda).forEach(function (r) { lista.push(r); });
    return lista;
  }

  /* El estado al TERMINAR cada paso. */
  var ESTADOS = [
    /* 0: en el aire, con el motor pegado a la rueda */
    { aire: true, eng: false, libro: false, zumba: false, falta: false, empuje: -1, avanza: false, panel: false, cuenta: [0, 0], nota: false },
    /* 1: ya giró: seis vueltas del motor y seis de la rueda */
    { aire: true, eng: false, libro: false, zumba: false, falta: false, empuje: -1, avanza: false, panel: true, cuenta: [6, 6], nota: true },
    /* 2: en el suelo, con el librito, y no alcanza */
    { aire: false, eng: false, libro: true, zumba: true, falta: true, empuje: 0, avanza: false, panel: false, cuenta: [0, 0], nota: false },
    /* 3: en el aire con los engranajes: seis vueltas del motor y tres de la rueda */
    { aire: true, eng: true, libro: false, zumba: false, falta: false, empuje: -1, avanza: false, panel: true, cuenta: [6, 3], nota: true },
    /* 4 y 5: en el suelo, con el librito: alcanza, y avanza */
    { aire: false, eng: true, libro: true, zumba: false, falta: true, empuje: 1, avanza: true, panel: false, cuenta: [0, 0], nota: false },
    { aire: false, eng: true, libro: true, zumba: false, falta: true, empuje: 1, avanza: true, panel: false, cuenta: [0, 0], nota: false }
  ];

  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.mover(P.carY, 0, s.aire ? -ALZA : 0, 0, 1, 0);
      A.mover(P.carX, s.avanza ? AVANZA : 0, 0, 0, 1, 0);
      A.mover(P.flechas, s.avanza ? AVANZA : 0, 0, 0, 1, 0);
      A.ver(P.sombra, s.aire, 0);
      A.ver(P.salida, s.avanza, 0);
      [P.motorFondo, P.motor].forEach(function (m) { A.mover(m, s.eng ? M1.x - M0.x : 0, s.eng ? M1.y - M0.y : 0, 0, 1, 0); });
      A.ver(P.grande, s.eng, 0); A.ver(P.pequeno, s.eng, 0);
      /* las ruedas quedan en una vuelta entera, salvo cuando avanzó */
      A.mover(P.rueda1, 0, 0, s.avanza ? THETA : 0, 1, 0);
      A.mover(P.rueda2, 0, 0, s.avanza ? THETA : 0, 1, 0);
      A.mover(P.giraP, 0, 0, s.avanza ? -THETA * DIENTES_G / DIENTES_P : 0, 1, 0);
      A.ver(P.zumba, s.zumba, 0);
      A.ver(P.libro, s.libro, 0);
      A.mover(P.libro, 0, s.libro ? 0 : -CAE, 0, 1, 0);
      A.ver(P.falta, s.falta, 0);
      P.empuje.forEach(function (e, i) {
        var si = s.empuje === i;
        A.ver(e.g, si, 0); A.trazar(e.raya, si, 0); A.ver(e.punta, si, 0);
      });
      A.ver(P.empujaVe, s.empuje >= 0, 0);
      A.ver(P.panel, s.panel, 0);
      P.rayas.motor.forEach(function (r, k) { A.ver(r, k < s.cuenta[0], 0); });
      P.rayas.rueda.forEach(function (r, k) { A.ver(r, k < s.cuenta[1], 0); });
      A.ver(P.nota, s.nota, 0);
    });
  }

  /* Las rayitas: una cada vez que el motor completa una vuelta, y una
     cada vez que la completa la rueda. */
  function cuenta(A, t0, vueltasRueda) {
    var porVuelta = GIRO_T / VUELTAS;
    P.rayas.motor.forEach(function (r, k) { A.ver(r, true, t0 + (k + 1) * porVuelta); });
    var cadaR = GIRO_T / vueltasRueda;
    P.rayas.rueda.forEach(function (r, k) { if (k < vueltasRueda) A.ver(r, true, t0 + (k + 1) * cadaR); });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan solo al ENTRAR; el 0 y
       el 5 se pintan siempre, también en el primer pintado, que llega con
       antes === n. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0 || n === 5) { base(A, ESTADOS[n]); return; }
    if (n === 1) {
      base(A, ESTADOS[0]);
      /* en el aire: el motor es la rueda, y gira seis vueltas */
      A.ver(P.panel, true, 0);
      A.ver(P.nota, true, T1);
      dura(P.rueda1, GIRO_T);
      A.mover(P.rueda1, 0, 0, VUELTAS * 360, 1, T1);
      cuenta(A, T1, VUELTAS);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      /* al suelo: baja el carrito y le cae el librito */
      A.ver(P.panel, false, 0); A.ver(P.nota, false, 0);
      A.ver(P.sombra, false, 0);
      A.mover(P.carY, 0, 0, 0, 1, 0);
      A.ver(P.libro, true, 900);
      A.mover(P.libro, 0, 0, 0, 1, 900);
      /* el motor zumba y empuja con todo lo que tiene: no alcanza */
      A.ver(P.zumba, true, 1600);
      A.ver(P.falta, true, 1900);
      var e = P.empuje[0];
      A.ver(e.g, true, 2300); A.trazar(e.raya, true, 2300); A.ver(P.empujaVe, true, 2300);
      A.ver(e.punta, true, 3100);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      /* se quita el librito y vuelve al aire */
      A.ver(P.libro, false, 0);
      A.ver(P.zumba, false, 0);
      A.ver(P.falta, false, 0);
      A.ver(P.empuje[0].g, false, 0); A.ver(P.empujaVe, false, 0);
      A.mover(P.carY, 0, -ALZA, 0, 1, 600);
      A.ver(P.sombra, true, 900);
      /* el motor se corre, y aparecen sus dos engranajes */
      [P.motorFondo, P.motor].forEach(function (m) { A.mover(m, M1.x - M0.x, M1.y - M0.y, 0, 1, 1600); });
      A.ver(P.grande, true, 2500);
      A.ver(P.pequeno, true, 2800);
      /* y gira: seis vueltas del motor, tres de la rueda */
      A.ver(P.panel, true, 3300);
      A.ver(P.nota, true, T3);
      dura(P.giraP, GIRO_T); dura(P.rueda1, GIRO_T);
      A.mover(P.giraP, 0, 0, -VUELTAS * 360, 1, T3);
      A.mover(P.rueda1, 0, 0, VUELTAS * 360 * DIENTES_P / DIENTES_G, 1, T3);
      cuenta(A, T3, VUELTAS * DIENTES_P / DIENTES_G);
      return;
    }
    /* el 4: al suelo con el mismo librito, y ahora alcanza */
    base(A, ESTADOS[3]);
    A.ver(P.panel, false, 0); A.ver(P.nota, false, 0);
    A.ver(P.sombra, false, 0);
    A.mover(P.carY, 0, 0, 0, 1, 0);
    A.ver(P.libro, true, 900);
    A.mover(P.libro, 0, 0, 0, 1, 900);
    A.ver(P.falta, true, 1700);
    var e2 = P.empuje[1];
    A.ver(e2.g, true, 2100); A.trazar(e2.raya, true, 2100); A.ver(P.empujaVe, true, 2100);
    A.ver(e2.punta, true, 2900);
    /* avanza: la rueda gira lo que el carrito avanza, y el motor el doble */
    [P.carX, P.flechas, P.rueda1, P.rueda2, P.giraP].forEach(function (p) { dura(p, AVANZA_T); });
    A.ver(P.salida, true, T4);
    A.mover(P.carX, AVANZA, 0, 0, 1, T4);
    A.mover(P.flechas, AVANZA, 0, 0, 1, T4);
    A.mover(P.rueda1, 0, 0, THETA, 1, T4);
    A.mover(P.rueda2, 0, 0, THETA, 1, T4);
    A.mover(P.giraP, 0, 0, -THETA * DIENTES_G / DIENTES_P, 1, T4);
  }

  var FRASES = {
    es: [
      'Marvin le pegó el motor directo a la rueda de su carrito. ¿Cómo gira en el aire? ¿Y en el suelo, con un librito encima?',
      'En el aire, cada vuelta del motor es una vuelta de la rueda. La rueda no tiene nada que empujar, y gira rapidísimo.',
      'En el suelo, con el librito encima, el motor empuja con todo lo que tiene, y no alcanza. El carrito no avanza ni un centímetro.',
      'Ahora el motor mueve un engranaje de 12 dientes, y ese mueve uno de 24, pegado a la rueda. Por cada dos vueltas del motor, la rueda da una.',
      'Con el mismo librito, ahora la rueda empuja más de lo que hace falta. El carrito avanza despacio, con el mismo motor y la misma pila.',
      'Tu turno: recorta dos ruedas de cartón con dientes, una de 8 y otra de 16. ¿Cuántas vueltas da la pequeña mientras la grande da una? ¿Y si la grande tuviera 24?'
    ],
    en: [
      'Marvin hooked the motor straight onto the wheel of his little car. How does it turn in the air? And on the floor, with a small book on top?',
      'In the air, every turn of the motor is one turn of the wheel. The wheel has nothing to push, so it spins blazing fast.',
      'On the floor, with the book on top, the motor pushes with all it has, and it is not enough. The car does not move a single inch.',
      'Now the motor turns a 12-tooth gear, and that one turns a 24-tooth gear fixed to the wheel. For every two turns of the motor, the wheel makes one.',
      'With the same book, the wheel now pushes more than it takes. The car moves slowly, with the same motor and the same battery.',
      'Your turn: cut two toothed wheels out of cardboard, one with 8 teeth and one with 16. How many turns does the small one make while the big one makes one? And if the big one had 24?'
    ]
  };
  /* Los rótulos del botón caben en un renglón en un teléfono de 360 px con
     la letra grande. */
  var BOTONES = {
    es: ['🔋 Encenderlo', '📚 Ponerlo en el suelo', '⚙️ Ponerle engranajes', '📚 Otra vez al suelo', '📝 Tu turno', '↺ Empezar otra vez'],
    en: ['🔋 Switch it on', '📚 Put it on the floor', '⚙️ Add gears', '📚 Back on the floor', '📝 Your turn', '↺ Start over']
  };
  var MARCADOR = {
    es: [['1', 'motor, pegado directo a la rueda'], ['6 y 6', 'vueltas del motor y de la rueda'], ['0', 'centímetros con el librito encima'],
      ['6 y 3', 'vueltas del motor y de la rueda'], ['avanza', 'con el mismo librito encima'], ['2', 'preguntas para ti']],
    en: [['1', 'motor, hooked straight onto the wheel'], ['6 and 6', 'turns of the motor and of the wheel'], ['0', 'inches with the book on top'],
      ['6 and 3', 'turns of the motor and of the wheel'], ['moves', 'with the same book on top'], ['2', 'questions for you']]
  };

  AnimacionMision.montar('#amCarrito', {
    vista: [ANCHO, ALTO],
    bilingue: true,
    describe: {
      es: 'El carrito de Marvin visto de lado, con su pila y su motor. En el aire la rueda gira rapidísimo; en el suelo, con un librito encima, no alcanza a moverlo. Con un engranaje pequeño en el motor y uno grande en la rueda, la rueda gira más despacio, empuja más y el carrito avanza.',
      en: 'Marvin’s little car seen from the side, with its battery and its motor. In the air the wheel spins blazing fast; on the floor, with a small book on top, it cannot move the car. With a small gear on the motor and a big one on the wheel, the wheel turns slower, pushes harder and the car moves.'
    },
    pasos: 6,
    construir: construir,
    idioma: idioma,
    pintar: pintar,
    texto: function (n) { return FRASES[lang][n]; },
    boton: function (n) { return BOTONES[lang][n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[lang][n][0], palabras: MARCADOR[lang][n][1] }; }
  });
})();
