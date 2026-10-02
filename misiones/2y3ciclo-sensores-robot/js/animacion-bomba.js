/* ============================================================
   Animación de «Sensores: los Sentidos del Robot» (Ruta de los Robots,
   etapa 2)
   ------------------------------------------------------------
   La historia: en la escuela, la bomba llena el tanque del agua, y don
   Chico la apaga cuando se acuerda. El martes se le olvidó: la bomba echó
   agua toda la tarde, el tanque se derramó y el miércoles no hubo agua en
   los baños. A la bomba no le faltaba fuerza: le faltaba enterarse.

   Lo que se dibuja: el tanque visto de lado y abierto por delante, la
   bomba en el suelo con su tubo, y un reloj. El martes el reloj corre de
   la una a las seis, el agua llega al borde y se derrama, y el charco
   crece. Después se le pone un sensor en la raya de lleno, un cable a una
   cajita con su regla, y otro cable de la cajita a la bomba. Al encenderla
   se ven los avisos del sensor viajar por el cable, uno por uno: «seco»
   mientras el agua no lo toca, «agua» cuando lo toca. La cajita va
   anotando lo que le llega, su regla se cumple y le manda «apaga» a la
   bomba.

   ⚠️ El agua se apaga a tiempo, pero no en el instante. Entre que el agua
   toca el sensor y que la bomba se para, el aviso tiene que viajar y la
   regla decidir, así que el agua sube un poco más y cubre el sensor: eso
   es lo que pasa con un sensor de verdad. Lo que nunca hace es llegar al
   borde, y la sonda lo mide. Por eso el reloj solo corre el martes: en el
   día del sensor los avisos van en cámara lenta, y un reloj marcaría en
   horas lo que de verdad dura un instante.

   ⚠️ Cada aviso dice lo que había: la palabra sale de la altura del agua
   en el momento en que el sensor midió. La escena calcula esa altura con
   la misma subida que dibuja, y la sonda la vuelve a calcular aparte.

   ⚠️ Lo que NO se dice, y a propósito. La prueba pregunta cómo se llaman
   las partes (controlador, actuador, receptor, efector), qué es la señal y
   de qué tipo es cada sensor. Aquí la cajita es «una cajita con su regla»
   y la bomba es la bomba; el sensor se llama sensor porque es el tema de
   la misión, y no se dice de qué tipo es.

   ⚠️ Una pieza tiene una sola demora. Cada aviso lleva cuatro: la que lo
   enciende al salir, la que lo lleva por el cable de lado, la que lo baja
   a la cajita y la que lo apaga al llegar.

   ⚠️ La misión es bilingüe, y la animación también: la escena trae sus dos
   idiomas escritos, y `idioma()` cambia los rótulos del dibujo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amBomba')) return;

  var ANCHO = 320, ALTO = 300;
  var lang = 'es';

  /* ── el dibujo ─────────────────────────────────────────────── */
  var SUELO = 272;
  /* El tanque: las paredes van por x0 y x1, el borde de arriba en y0 y el
     fondo en y1. Por dentro, el agua va de 188 a 274 y llega hasta 144. */
  var TQ = { x0: 186, x1: 276, y0: 56, y1: 146 };
  var DENTRO = { x0: 188, x1: 274, fondo: 144 };
  var BORDE = 56;                                  // hasta aquí puede subir el agua
  var LLENO = 72;                                  // la raya de lleno
  var SENSOR = { x0: 188, x1: 197, y0: 67, y1: 77 };  // pegado a la pared, en la raya
  var NIVEL0 = 118;                                // el agua al empezar cada día
  var NIVEL_PARA = 64;                             // donde queda cuando la bomba se para
  var SALIDA = { x: 210, y: 50 };                  // por donde cae el agua al tanque
  var BOMBA = { x0: 16, x1: 64, y0: 236, y1: 272 };
  var TUBO = 'M28 ' + BOMBA.y0 + ' L28 34 L' + SALIDA.x + ' 34 L' + SALIDA.x + ' ' + SALIDA.y;
  var RELOJ = { x: 298, y: 26, r: 14 };
  /* El derrame cae por la pared de la derecha y llega al suelo, y el charco
     se abre donde cae. */
  var DERRAME = 'M271 57 Q278 49 280 58 L280 ' + TQ.y1 + ' L281 ' + (SUELO - 1);
  var CHARCO = { x: 292, y: 273.5, rx: 25, ry: 5 };
  /* La cajita de la regla, y los dos cables: del sensor a la cajita, y de
     la cajita a la bomba. */
  var CAJA = { x0: 40, x1: 160, y0: 150, y1: 220 };
  var CX = 100;                                    // por aquí bajan los dos cables
  var CABLE1 = 'M' + TQ.x0 + ' ' + LLENO + ' L' + CX + ' ' + LLENO + ' L' + CX + ' ' + CAJA.y0;
  var CABLE2_Y = 256;
  var CABLE2 = 'M' + CX + ' ' + CAJA.y1 + ' L' + CX + ' ' + CABLE2_Y + ' L' + BOMBA.x1 + ' ' + CABLE2_Y;
  /* Los avisos: una pastilla que sale junto al tanque, va de lado hasta
     donde el cable baja y baja hasta la cajita. El de «apaga» baja de la
     cajita y va de lado hasta la bomba. */
  var PASTILLA = { w: 36, h: 15 };
  var AVISO_SALE = { x: 166, y: LLENO };
  var AVISO_LLEGA = { x: CX, y: CAJA.y0 - 12 };
  var APAGA_SALE = { x: CX, y: CAJA.y1 + 9 };
  var APAGA_LLEGA = { x: BOMBA.x1 + 14, y: CABLE2_Y };
  /* Lo que la cajita va anotando: tres por renglón. */
  var ANOTA = { xs: [70, 100, 130], ys: [166, 179] };
  var DIVIDE = 189;
  var REGLA = { x: 54, ys: [202, 215], marca: 45 };
  /* Las tres pestañas: la del sensor debajo de su cable, la de la cajita
     en su esquina de arriba y la de la bomba a su lado, debajo del cable. */
  var PESTANAS = [
    { k: 'percibe', x: 143, y: LLENO + 14, w: 82 },
    { k: 'decide', x: 134, y: CAJA.y0, w: 46 },
    { k: 'actua', x: 84, y: 265.5, w: 36 }
  ];

  /* ── el reloj de la escena ──────────────────────────────────── */
  /* El martes: de la una a las seis. El agua llega al borde a las tres y
     media, y desde ahí se derrama hasta las seis. */
  var MARTES = { empieza: 300, borde: 3300, fin: 6300 };
  var HORA0 = 30, HORA_FIN = 180;                  // la aguja corta: la una y las seis
  /* El día del sensor: la bomba se enciende al empezar y el agua sube
     pareja hasta que la bomba se para. */
  var T0 = 200, T_PARA = 6500;
  var VIAJE = 300;                                 // cada tramo del cable
  var ENTRE = 800;                                 // entre una medida y la siguiente
  function nivelEn(t) { return NIVEL0 - (NIVEL0 - NIVEL_PARA) * (t - T0) / (T_PARA - T0); }
  /* El sensor avisa «agua» cuando el agua llega a su borde de abajo: ese
     momento sale de la misma subida que se dibuja. Las cinco medidas de
     antes van cada ENTRE milisegundos. ⚠️ Se redondea HACIA ARRIBA: con el
     redondeo de siempre la medida caía una milésima antes de que el agua
     tocara, y el aviso que tenía que decir «agua» decía «seco». */
  var T_TOCA = Math.ceil(T0 + (NIVEL0 - SENSOR.y1) * (T_PARA - T0) / (NIVEL0 - NIVEL_PARA));
  var MEDIDAS = [5, 4, 3, 2, 1, 0].map(function (k) { return T_TOCA - k * ENTRE; });
  var T_REGLA1 = T_TOCA + 2 * VIAJE;               // llega «agua»: se cumple el «si»
  var T_REGLA2 = T_REGLA1 + 270;                   // y entonces la orden
  var T_APAGA = T_PARA - 2 * VIAJE;                // el «apaga» sale y llega justo al parar

  var RS = {
    bomba: { es: 'bomba', en: 'pump' },
    chico: { es: 'don Chico', en: 'Mr. Chico' },
    lleno: { es: 'lleno', en: 'full' },
    sensor: { es: 'sensor', en: 'sensor' },
    regla: { es: ['si avisa «agua»:', 'apaga la bomba'], en: ['if it says «water»:', 'switch the pump off'] },
    seco: { es: 'seco', en: 'dry' },
    agua: { es: 'agua', en: 'water' },
    apaga: { es: 'apaga', en: 'off' },
    percibe: { es: 'percibe y avisa', en: 'senses and tells' },
    decide: { es: 'decide', en: 'decides' },
    actua: { es: 'actúa', en: 'acts' },
    martes: { es: 'el martes', en: 'on Tuesday' }
  };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }
  function origen(n, x, y) { n.style.transformOrigin = x + 'px ' + y + 'px'; }
  /* La duración de las transiciones largas va en una variable de cada
     pieza: el agua tarda una cosa el martes y otra el día del sensor. */
  function dura(n, ms) { n.style.setProperty('--bo-t', Math.round(ms) + 'ms'); }

  /* Una pastilla con su palabra, en cuatro piezas: aparece, va de lado,
     baja (o sube), y se apaga al llegar. Aparece y se apaga de golpe
     (.bo-rapido): con el apagado de siempre, de medio segundo, hacía medio
     camino transparente y parecía un fantasma. */
  function pastilla(A, padre, clase, x, y, dato) {
    var sale = A.el('g', { 'class': 'bo-rapido', 'data-aviso': dato }, padre);
    var lado = A.el('g', { 'class': 'bo-pulso', 'data-lado': '' }, sale);
    var vert = A.el('g', { 'class': 'bo-pulso', 'data-vert': '' }, lado);
    var llega = A.el('g', { 'class': 'bo-rapido', 'data-llega': '' }, vert);
    A.el('rect', { x: x - PASTILLA.w / 2, y: y - PASTILLA.h / 2, width: PASTILLA.w, height: PASTILLA.h, rx: PASTILLA.h / 2,
      'class': 'bo-pastilla ' + clase, 'data-pastilla': '' }, llega);
    var t = texto(A, llega, x, y + 3.4, 'bo-pastilla-letra', 9.5, 'middle', '');
    return { sale: sale, lado: lado, vert: vert, llega: llega, letra: t };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    A.el('rect', { x: 0, y: SUELO, width: ANCHO, height: ALTO - SUELO, 'class': 'bo-suelo', 'data-suelo': '' }, svg);

    /* el reloj, arriba a la derecha: solo el martes */
    P.reloj = A.el('g', { 'data-reloj': '' }, svg);
    A.el('circle', { cx: RELOJ.x, cy: RELOJ.y, r: RELOJ.r, 'class': 'bo-reloj', 'data-esfera': '' }, P.reloj);
    for (var h = 0; h < 12; h++) {
      var a = h * Math.PI / 6, l = h % 3 === 0 ? 3.2 : 1.8;
      A.el('path', { d: 'M' + (RELOJ.x + Math.sin(a) * (RELOJ.r - 1.5)).toFixed(2) + ' ' + (RELOJ.y - Math.cos(a) * (RELOJ.r - 1.5)).toFixed(2) +
        ' L' + (RELOJ.x + Math.sin(a) * (RELOJ.r - 1.5 - l)).toFixed(2) + ' ' + (RELOJ.y - Math.cos(a) * (RELOJ.r - 1.5 - l)).toFixed(2),
        'class': 'bo-marca-hora' }, P.reloj);
    }
    P.minutos = A.el('g', { 'class': 'bo-gira', 'data-minutos': '' }, P.reloj);
    origen(P.minutos, RELOJ.x, RELOJ.y);
    A.el('path', { d: 'M' + RELOJ.x + ' ' + RELOJ.y + ' L' + RELOJ.x + ' ' + (RELOJ.y - 10.5), 'class': 'bo-aguja-larga', 'data-aguja': 'min' }, P.minutos);
    P.horas = A.el('g', { 'class': 'bo-gira', 'data-horas': '' }, P.reloj);
    origen(P.horas, RELOJ.x, RELOJ.y);
    A.el('path', { d: 'M' + RELOJ.x + ' ' + RELOJ.y + ' L' + RELOJ.x + ' ' + (RELOJ.y - 7), 'class': 'bo-aguja-corta', 'data-aguja': 'hora' }, P.horas);
    A.el('circle', { cx: RELOJ.x, cy: RELOJ.y, r: 1.4, 'class': 'bo-eje' }, P.reloj);

    /* las patas del tanque */
    A.el('path', { d: 'M194 ' + TQ.y1 + ' L190 ' + SUELO + ' M268 ' + TQ.y1 + ' L272 ' + SUELO +
      ' M192 200 L270 250 M270 200 L192 250', 'class': 'bo-pata', 'data-patas': '' }, svg);

    /* el chorro que cae al tanque va DETRÁS del agua: se ve encima de ella */
    /* el chorro se enciende y se corta en el mismo paso: dos piezas */
    P.chorro = A.el('g', { 'data-chorro-g': '' }, svg);
    P.chorroCorta = A.el('g', { 'data-chorro-corta': '' }, P.chorro);
    A.el('rect', { x: SALIDA.x - 2.5, y: SALIDA.y, width: 5, height: DENTRO.fondo - SALIDA.y, 'class': 'bo-chorro', 'data-chorro': '' }, P.chorroCorta);
    var clip = A.el('clipPath', { id: 'boDentro' }, A.el('defs', {}, svg));
    A.el('rect', { x: DENTRO.x0, y: 30, width: DENTRO.x1 - DENTRO.x0, height: DENTRO.fondo - 30 }, clip);
    var cuba = A.el('g', { 'clip-path': 'url(#boDentro)' }, svg);
    P.agua = A.el('g', { 'class': 'bo-lento', 'data-agua-g': '' }, cuba);
    A.el('rect', { x: DENTRO.x0, y: BORDE, width: DENTRO.x1 - DENTRO.x0, height: DENTRO.fondo - BORDE, 'class': 'bo-agua', 'data-agua': '' }, P.agua);
    A.el('path', { d: 'M' + TQ.x0 + ' ' + TQ.y0 + ' L' + TQ.x0 + ' ' + TQ.y1 + ' L' + TQ.x1 + ' ' + TQ.y1 + ' L' + TQ.x1 + ' ' + TQ.y0,
      'class': 'bo-tanque', 'data-tanque': '' }, svg);

    /* el derrame y el charco: solo el martes */
    P.derrame = A.el('path', { d: DERRAME, 'class': 'bo-derrame', 'data-derrame': '' }, svg);
    P.charcoVe = A.el('g', { 'data-charco-g': '' }, svg);
    P.charco = A.el('g', { 'class': 'bo-lento', 'data-charco-crece': '' }, P.charcoVe);
    origen(P.charco, CHARCO.x, CHARCO.y);
    A.el('ellipse', { cx: CHARCO.x, cy: CHARCO.y, rx: CHARCO.rx, ry: CHARCO.ry, 'class': 'bo-charco', 'data-charco': '' }, P.charco);
    /* el del martes, cuando ya no está: con raya cortada */
    P.fantasma = A.el('g', { 'data-fantasma': '' }, svg);
    A.el('ellipse', { cx: CHARCO.x, cy: CHARCO.y, rx: CHARCO.rx, ry: CHARCO.ry, 'class': 'bo-charco-ya', 'data-charco-ya': '' }, P.fantasma);
    P.martes = texto(A, P.fantasma, CHARCO.x, 291, 'am-rotulo', 9.5, 'middle', '');
    P.martes.setAttribute('data-martes', '');

    /* la raya de lleno, el sensor en ella y sus nombres */
    P.raya = A.el('g', { 'data-raya-g': '' }, svg);
    A.el('path', { d: 'M' + SENSOR.x1 + ' ' + LLENO + ' L' + DENTRO.x1 + ' ' + LLENO, 'class': 'bo-raya', 'data-raya': '' }, P.raya);
    P.lleno = texto(A, P.raya, TQ.x1 + 4, LLENO + 3.3, 'am-rotulo', 9.5, 'start', '');
    P.lleno.setAttribute('data-lleno', '');
    P.sensor = A.el('g', { 'data-sensor-g': '' }, svg);
    A.el('rect', { x: SENSOR.x0, y: SENSOR.y0, width: SENSOR.x1 - SENSOR.x0, height: SENSOR.y1 - SENSOR.y0, rx: 1.6, 'class': 'bo-sensor', 'data-sensor': '' }, P.sensor);
    A.el('circle', { cx: SENSOR.x1 - 2.6, cy: LLENO, r: 1.4, 'class': 'bo-sensor-ojo' }, P.sensor);
    P.sensorNombre = texto(A, svg, TQ.x0 - 6, LLENO - 12, 'am-rotulo', 10, 'end', '');
    P.sensorNombre.setAttribute('data-nombre', 'sensor');

    /* los dos cables, que se trazan */
    P.cable1 = A.el('path', { d: CABLE1, 'class': 'bo-cable', 'data-cable': '1' }, svg);
    P.cable2 = A.el('path', { d: CABLE2, 'class': 'bo-cable', 'data-cable': '2' }, svg);

    /* la cajita: arriba lo que le va llegando; abajo, su regla */
    P.caja = A.el('g', { 'data-caja-g': '' }, svg);
    A.el('rect', { x: CAJA.x0, y: CAJA.y0, width: CAJA.x1 - CAJA.x0, height: CAJA.y1 - CAJA.y0, rx: 6, 'class': 'bo-caja', 'data-caja': '' }, P.caja);
    A.el('path', { d: 'M' + (CAJA.x0 + 6) + ' ' + DIVIDE + ' L' + (CAJA.x1 - 6) + ' ' + DIVIDE, 'class': 'bo-divide' }, P.caja);
    P.anota = [];
    for (var k = 0; k < 6; k++) {
      var t = texto(A, svg, ANOTA.xs[k % 3], ANOTA.ys[Math.floor(k / 3)], 'bo-anota', 9.5, 'middle', '');
      t.setAttribute('data-anota', k);
      P.anota.push(t);
    }
    P.regla = REGLA.ys.map(function (y, i) {
      var t = texto(A, svg, REGLA.x, y, 'am-letra', 10, 'start', '');
      t.setAttribute('data-regla', i);
      return t;
    });
    /* el ✓ de cada renglón de la regla, cuando se cumple */
    P.cumple = REGLA.ys.map(function (y, i) {
      var mx = REGLA.marca, my = y - 3.5;
      return A.el('path', { d: 'M' + (mx - 3) + ' ' + my + ' L' + (mx - 0.8) + ' ' + (my + 2.6) + ' L' + (mx + 3.4) + ' ' + (my - 3),
        'class': 'bo-bien', 'data-cumple': i }, svg);
    });

    /* la bomba en el suelo, su tubo y su temblor cuando está encendida */
    A.el('path', { d: TUBO, 'class': 'bo-tubo', 'data-tubo': '' }, svg);
    A.el('rect', { x: BOMBA.x0, y: BOMBA.y0, width: BOMBA.x1 - BOMBA.x0, height: BOMBA.y1 - BOMBA.y0, rx: 5, 'class': 'bo-bomba', 'data-bomba': '' }, svg);
    A.el('circle', { cx: 42, cy: 254, r: 9, 'class': 'bo-motor' }, svg);
    A.el('circle', { cx: 42, cy: 254, r: 2.4, 'class': 'bo-eje' }, svg);
    /* el temblor también se enciende y se apaga en el mismo paso */
    P.tiembla = A.el('g', { 'data-tiembla-g': '' }, svg);
    P.tiemblaPara = A.el('g', { 'data-tiembla': '' }, P.tiembla);
    [5, 9, 13].forEach(function (rr) {
      var a1 = -0.75, a2 = 0.75, cx0 = BOMBA.x1, cy0 = 246;
      A.el('path', { d: 'M' + (cx0 + Math.cos(a1) * rr).toFixed(2) + ' ' + (cy0 + Math.sin(a1) * rr).toFixed(2) +
        ' A' + rr + ' ' + rr + ' 0 0 1 ' + (cx0 + Math.cos(a2) * rr).toFixed(2) + ' ' + (cy0 + Math.sin(a2) * rr).toFixed(2),
        'class': 'bo-temblor' }, P.tiemblaPara);
    });
    P.bombaNombre = texto(A, svg, (BOMBA.x0 + BOMBA.x1) / 2, 290, 'am-rotulo', 10, 'middle', '');
    P.bombaNombre.setAttribute('data-nombre', 'bomba');

    /* don Chico, junto a la bomba: se va el martes */
    P.chicoVe = A.el('g', { 'data-chico': '' }, svg);
    P.chico = A.el('g', { 'data-chico-anda': '' }, P.chicoVe);
    A.el('rect', { x: 80, y: 246, width: 12, height: SUELO - 246, rx: 3, 'class': 'bo-persona', 'data-cuerpo-chico': '' }, P.chico);
    A.el('circle', { cx: 86, cy: 239, r: 6, 'class': 'bo-cara' }, P.chico);
    P.chicoNombre = texto(A, P.chico, 86, 226, 'am-rotulo', 9.5, 'middle', '');

    /* los avisos: cinco «seco» y un «agua», y el «apaga» */
    P.avisos = MEDIDAS.map(function (t, i) {
      var dice = nivelEn(t) > SENSOR.y1 ? 'seco' : 'agua';
      var p = pastilla(A, svg, dice === 'seco' ? 'bo-p-seco' : 'bo-p-agua', AVISO_SALE.x, AVISO_SALE.y, dice);
      p.dice = dice; p.t = t;
      /* lo que la cajita anota va con la misma palabra, y «agua» resaltada */
      P.anota[i].setAttribute('data-dice', dice);
      if (dice === 'agua') P.anota[i].classList.add('bo-anota-agua');
      return p;
    });
    P.apaga = pastilla(A, svg, 'bo-p-apaga', APAGA_SALE.x, APAGA_SALE.y, 'apaga');

    /* lo que hace cada una, en una pestaña pegada a ella: se ponen al
       final, una detrás de otra */
    P.pestanas = PESTANAS.map(function (pe) {
      var g = A.el('g', { 'data-pestana': pe.k }, svg);
      A.el('rect', { x: pe.x - pe.w / 2, y: pe.y - 6.75, width: pe.w, height: 13.5, rx: 4.5, 'class': 'bo-pestana', 'data-pestana-caja': '' }, g);
      var t = texto(A, g, pe.x, pe.y + 3.3, 'bo-pestana-letra', 9.5, 'middle', '');
      t.setAttribute('data-hace', pe.k);
      return { g: g, letra: t, k: pe.k };
    });
  }

  function idioma(l) {
    lang = l === 'en' ? 'en' : 'es';
    P.bombaNombre.textContent = RS.bomba[lang];
    P.chicoNombre.textContent = RS.chico[lang];
    P.lleno.textContent = RS.lleno[lang];
    P.sensorNombre.textContent = RS.sensor[lang];
    P.regla.forEach(function (t, i) { t.textContent = RS.regla[lang][i]; });
    P.avisos.forEach(function (p, i) {
      p.letra.textContent = RS[p.dice][lang];
      P.anota[i].textContent = RS[p.dice][lang];
    });
    P.apaga.letra.textContent = RS.apaga[lang];
    P.pestanas.forEach(function (pe) { pe.letra.textContent = RS[pe.k][lang]; });
    P.martes.textContent = RS.martes[lang];
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
    var lista = [P.reloj, P.minutos, P.horas, P.chorro, P.chorroCorta, P.agua, P.derrame, P.charcoVe, P.charco, P.fantasma, P.raya,
      P.sensor, P.sensorNombre, P.cable1, P.cable2, P.caja, P.tiembla, P.tiemblaPara, P.chicoVe, P.chico];
    P.pestanas.forEach(function (pe) { lista.push(pe.g); });
    P.anota.forEach(function (t) { lista.push(t); });
    P.regla.forEach(function (t) { lista.push(t); });
    P.cumple.forEach(function (t) { lista.push(t); });
    P.avisos.concat([P.apaga]).forEach(function (p) { lista.push(p.sale, p.lado, p.vert, p.llega); });
    return lista;
  }

  /* El estado al EMPEZAR un paso. */
  var ESTADOS = [
    /* 0: un día cualquiera: don Chico junto a la bomba encendida */
    { nivel: NIVEL0, bomba: true, chico: true, reloj: true, hora: HORA0, derrame: false, charco: 0, cajita: false, anota: 0, regla: 0, etiquetas: false },
    /* 1: el martes, a las seis */
    { nivel: BORDE, bomba: true, chico: false, reloj: true, hora: HORA_FIN, derrame: true, charco: 1, cajita: false, anota: 0, regla: 0, etiquetas: false },
    /* 2: otro día, con su sensor y su cajita, y la bomba apagada */
    { nivel: NIVEL0, bomba: false, chico: false, reloj: false, hora: HORA0, derrame: false, charco: 0, cajita: true, anota: 0, regla: 0, etiquetas: false },
    /* 3: la bomba ya se apagó sola */
    { nivel: NIVEL_PARA, bomba: false, chico: false, reloj: false, hora: HORA0, derrame: false, charco: 0, cajita: true, anota: 6, regla: 2, etiquetas: false },
    /* 4 y 5: con sus tres nombres y el charco del martes */
    { nivel: NIVEL_PARA, bomba: false, chico: false, reloj: false, hora: HORA0, derrame: false, charco: 0, cajita: true, anota: 6, regla: 2, etiquetas: true },
    { nivel: NIVEL_PARA, bomba: false, chico: false, reloj: false, hora: HORA0, derrame: false, charco: 0, cajita: true, anota: 6, regla: 2, etiquetas: true }
  ];

  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.mover(P.agua, 0, s.nivel - BORDE, 0, 1, 0);
      A.ver(P.chorro, s.bomba, 0); A.ver(P.chorroCorta, true, 0);
      A.ver(P.tiembla, s.bomba, 0); A.ver(P.tiemblaPara, true, 0);
      A.ver(P.chicoVe, s.chico, 0);
      A.mover(P.chico, 0, 0, 0, 1, 0);
      A.ver(P.reloj, s.reloj, 0);
      A.mover(P.horas, 0, 0, s.hora, 1, 0);
      A.mover(P.minutos, 0, 0, (s.hora - HORA0) * 12, 1, 0);
      A.trazar(P.derrame, s.derrame, 0);
      A.ver(P.derrame, s.derrame, 0);
      A.ver(P.charcoVe, s.charco > 0, 0);
      A.mover(P.charco, 0, 0, 0, s.charco > 0 ? 1 : 0.05, 0);
      [P.raya, P.sensor, P.sensorNombre, P.caja].forEach(function (p) { A.ver(p, s.cajita, 0); });
      A.trazar(P.cable1, s.cajita, 0); A.ver(P.cable1, s.cajita, 0);
      A.trazar(P.cable2, s.cajita, 0); A.ver(P.cable2, s.cajita, 0);
      P.regla.forEach(function (t) { A.ver(t, s.cajita, 0); });
      P.anota.forEach(function (t, k) { A.ver(t, k < s.anota, 0); });
      P.cumple.forEach(function (t, k) { A.ver(t, k < s.regla, 0); });
      /* los avisos: cada uno en la salida, apagado */
      P.avisos.concat([P.apaga]).forEach(function (p) {
        A.ver(p.sale, false, 0); A.ver(p.llega, true, 0);
        A.mover(p.lado, 0, 0, 0, 1, 0); A.mover(p.vert, 0, 0, 0, 1, 0);
      });
      P.pestanas.forEach(function (pe) { A.ver(pe.g, s.etiquetas, 0); });
      A.ver(P.fantasma, s.etiquetas, 0);
    });
  }

  /* Un aviso que viaja por su cable en dos tramos: sale, hace el primero,
     después el segundo, y se apaga al llegar. El del sensor va primero de
     lado y después baja; el «apaga», primero baja y después va de lado. */
  function viaja(A, p, t, dx, dy, deLadoPrimero) {
    A.ver(p.sale, true, t);
    A.mover(p.lado, dx, 0, 0, 1, deLadoPrimero ? t : t + VIAJE);
    A.mover(p.vert, 0, dy, 0, 1, deLadoPrimero ? t + VIAJE : t);
    A.ver(p.llega, false, t + 2 * VIAJE);
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
      /* don Chico se va, y la tarde pasa: el agua llega al borde y se
         derrama hasta las seis */
      A.mover(P.chico, 34, 0, 0, 1, 0);
      A.ver(P.chicoVe, false, 250);
      var largo = MARTES.fin - MARTES.empieza;
      dura(P.horas, largo); dura(P.minutos, largo);
      A.mover(P.horas, 0, 0, HORA_FIN, 1, MARTES.empieza);
      A.mover(P.minutos, 0, 0, (HORA_FIN - HORA0) * 12, 1, MARTES.empieza);
      dura(P.agua, MARTES.borde - MARTES.empieza);
      A.mover(P.agua, 0, 0, 0, 1, MARTES.empieza);
      A.ver(P.derrame, true, MARTES.borde);
      A.trazar(P.derrame, true, MARTES.borde);
      /* el charco se abre cuando el derrame llega al suelo, y crece hasta
         las seis */
      A.ver(P.charcoVe, true, MARTES.borde + 800);
      dura(P.charco, MARTES.fin - MARTES.borde - 800);
      A.mover(P.charco, 0, 0, 0, 1, MARTES.borde + 800);
      return;
    }
    if (n === 2) {
      /* otro día: el agua donde empieza, la bomba apagada y nada más */
      base(A, { nivel: NIVEL0, bomba: false, chico: false, reloj: false, hora: HORA0, derrame: false, charco: 0, cajita: false, anota: 0, regla: 0, etiquetas: false });
      A.ver(P.raya, true, 200);
      A.ver(P.sensor, true, 700);
      A.ver(P.sensorNombre, true, 900);
      A.ver(P.cable1, true, 1200); A.trazar(P.cable1, true, 1200);
      A.ver(P.caja, true, 1900);
      A.ver(P.regla[0], true, 2200);
      A.ver(P.regla[1], true, 2500);
      A.ver(P.cable2, true, 2800); A.trazar(P.cable2, true, 2800);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      /* se enciende la bomba y el agua sube pareja hasta que se para */
      A.ver(P.chorro, true, 0);
      A.ver(P.tiembla, true, 0);
      dura(P.agua, T_PARA - T0);
      A.mover(P.agua, 0, NIVEL_PARA - BORDE, 0, 1, T0);
      /* cada medida: el aviso viaja por el cable y la cajita lo anota */
      P.avisos.forEach(function (p, k) {
        viaja(A, p, p.t, AVISO_LLEGA.x - AVISO_SALE.x, AVISO_LLEGA.y - AVISO_SALE.y, true);
        A.ver(P.anota[k], true, p.t + 2 * VIAJE);
      });
      /* llega «agua»: se cumple la regla, y la cajita manda «apaga» */
      A.ver(P.cumple[0], true, T_REGLA1);
      A.ver(P.cumple[1], true, T_REGLA2);
      viaja(A, P.apaga, T_APAGA, APAGA_LLEGA.x - APAGA_SALE.x, APAGA_LLEGA.y - APAGA_SALE.y, false);
      /* la bomba se para justo cuando le llega: se va el temblor y se
         corta el chorro */
      A.ver(P.tiemblaPara, false, T_PARA);
      A.ver(P.chorroCorta, false, T_PARA);
      return;
    }
    /* el 4: sus tres nombres, y el charco del martes */
    base(A, ESTADOS[3]);
    P.pestanas.forEach(function (pe, i) { A.ver(pe.g, true, 200 + i * 500); });
    A.ver(P.fantasma, true, 1800);
  }

  var FRASES = {
    es: [
      'La bomba llena el tanque de la escuela, y don Chico la apaga cuando se acuerda. ¿Quién le avisa a la bomba que el tanque ya se llenó?',
      'El martes, don Chico se fue y nadie le avisó a la bomba. Siguió echando agua toda la tarde, y el agua terminó en el suelo.',
      'Después le ponen un sensor en la raya de lleno. Abajo, una cajita con su regla: si el sensor avisa «agua», apaga la bomba.',
      'El sensor mide una y otra vez, y avisa «seco». Cuando el agua lo toca, avisa «agua»: la regla decide y la bomba se apaga.',
      'La bomba es la misma del martes. Lo que cambió es que ahora alguien le avisa: el sensor percibe y avisa, la regla decide y la bomba actúa.',
      'Tu turno: busca en tu escuela algo que se queda encendido hasta que alguien se acuerda. ¿Qué tendría que percibir su sensor? ¿Qué diría su regla?'
    ],
    en: [
      'The pump fills the school tank, and Mr. Chico switches it off when he remembers. Who tells the pump that the tank is already full?',
      'On Tuesday, Mr. Chico left and nobody told the pump. It kept pouring water all afternoon, and the water ended up on the ground.',
      'Later they put a sensor on the full line. Below it, a little box with its rule: if the sensor says «water», switch the pump off.',
      'The sensor measures again and again, and it says «dry». When the water reaches it, it says «water»: the rule decides and the pump switches off.',
      'The pump is the same one as on Tuesday. What changed is that now someone tells it: the sensor senses and tells, the rule decides and the pump acts.',
      'Your turn: find something at your school that stays on until someone remembers. What would its sensor have to sense? What would its rule say?'
    ]
  };
  /* Los rótulos del botón caben en un renglón en un teléfono de 360 px con
     la letra grande. */
  var BOTONES = {
    es: ['💧 Llega el martes', '📡 Ponerle un sensor', '▶️ Encender la bomba', '🔍 ¿Qué cambió?', '📝 Tu turno', '↺ Empezar otra vez'],
    en: ['💧 Tuesday comes', '📡 Give it a sensor', '▶️ Turn the pump on', '🔍 What changed?', '📝 Your turn', '↺ Start over']
  };
  var MARCADOR = {
    es: [['0', 'avisos a la bomba'], ['0', 'avisos en toda la tarde'], ['1', 'sensor, en la raya de lleno'],
      ['6', 'avisos: 5 «seco» y 1 «agua»'], ['3', 'partes: percibe, decide y actúa'], ['2', 'preguntas para ti']],
    en: [['0', 'messages to the pump'], ['0', 'messages all afternoon'], ['1', 'sensor, on the full line'],
      ['6', 'messages: 5 «dry» and 1 «water»'], ['3', 'parts: senses, decides and acts'], ['2', 'questions for you']]
  };

  AnimacionMision.montar('#amBomba', {
    vista: [ANCHO, ALTO],
    bilingue: true,
    describe: {
      es: 'El tanque de la escuela visto de lado, con la bomba en el suelo y un reloj. El martes el agua se derrama toda la tarde; después, un sensor en la raya de lleno le avisa a una cajita con su regla, y la cajita apaga la bomba.',
      en: 'The school tank seen from the side, with the pump on the ground and a clock. On Tuesday the water overflows all afternoon; later, a sensor on the full line tells a little box with its rule, and the box switches the pump off.'
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
