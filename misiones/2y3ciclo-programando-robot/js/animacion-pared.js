/* ============================================================
   Animación de «Programando un Robot» (Ruta de los Robots, etapa 5)
   ------------------------------------------------------------
   La historia: al robot le escribieron «si hay pared, parate; avanzá
   diez pasos», una sola vez y al principio. Miró, no había pared, y
   avanzó los diez pasos seguidos: chocó en el tercero, con el sensor por
   delante, y quedó inservible para la feria del día siguiente.

   Lo que se dibuja: arriba, lo que le escribieron, en dos tarjetas, y el
   recuadro de «diez veces»; a la derecha, la cuenta de las veces que miró
   y de los pasos que dio; abajo, el pasillo en baldosas, el robot de lado
   y la pared. «avanzá diez pasos» es lo mismo que «diez veces: avanzá un
   paso», así que la primera tarjeta queda FUERA del recuadro: se lee una
   vez. El robot mira, avanza, avanza y en el tercero choca.

   El arreglo no trae ninguna orden nueva: la primera tarjeta baja y entra
   en el recuadro, que crece para recibirla. Con eso el robot mira antes de
   cada paso, y a la tercera vez que mira ve la pared y se para sin tocarla.
   Es lo que dice la historia: no estaba mal la orden, estaba mal CUÁNTAS
   VECES se da.

   ⚠️ El sensor ve solo la baldosa de adelante, como enseña la misión
   («mira la casilla de adelante»). Por eso al mirar desde el principio no
   hay pared, y la historia dice la verdad: miró y no había.

   ⚠️ Lo que NO se dice, y a propósito. La prueba pregunta qué es un
   bucle, un condicional, un programa, una variable, el pseudocódigo,
   depurar, un bug, un actuador, DETENTE, SINO y un contador. Aquí no se
   escribe ninguno de esos nombres: «lo que le escribieron», «órdenes» y
   «diez veces». Y el último paso termina en una pregunta cuya respuesta
   no aparece en el dibujo.

   ⚠️ Una pieza tiene una sola demora. El robot avanza con una capa por
   paso, una dentro de otra; la flecha que señala la tarjeta que se cumple
   va en cinco capas, y cada haz de mirar lleva dos (una para encenderse y
   otra para apagarse).

   ⚠️ La misión es bilingüe, y la animación también: la escena trae sus dos
   idiomas escritos, y `idioma()` cambia los rótulos del dibujo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPared')) return;

  var ANCHO = 320, ALTO = 212;
  var lang = 'es';

  /* ── el dibujo ─────────────────────────────────────────────── */
  /* Las tarjetas y el recuadro de «diez veces». La primera tarjeta está
     fuera del recuadro y, en el arreglo, entra en él: baja ENTRA_Y y se
     corre ENTRA_X a la derecha, y el recuadro crece CRECE hacia arriba. */
  var CARTA = { ancho: 164, alto: 24 };
  var CARTA_A = { x: 28, y: 22 };
  var CARTA_B = { x: 40, y: 74 };
  var ENTRA_X = 12, ENTRA_Y = 18;
  var MARCO = { x: 30, y: 56, ancho: 188, alto: 50 };
  var CRECE = 36;
  var ESCALA = (MARCO.alto + CRECE) / MARCO.alto;
  var BAJO = MARCO.y + MARCO.alto;
  /* Dónde señala la flecha: el centro de cada tarjeta */
  var Y_A1 = CARTA_A.y + CARTA.alto / 2;
  var Y_B = CARTA_B.y + CARTA.alto / 2;
  var Y_A2 = Y_A1 + ENTRA_Y;
  /* El pasillo: siete baldosas de un paso cada una */
  var PISO = 196;
  var X0 = 20, PASO = 40, BALDOSAS = 7;
  /* El robot de lado, mirando a la derecha: su centro en la baldosa 0 y
     la punta del sensor a 19 de él */
  var CX = X0 + PASO / 2;
  var PUNTA = 19;
  var OJO = PISO - 25;                      // la altura del sensor
  /* La pared: en la baldosa 3, a 15 de la punta del sensor del robot que
     está en la baldosa 2. En el último paso se corre a la baldosa 6. */
  var PARED = { x: 154, ancho: 18, alto: 56 };
  var CORRE = 3 * PASO;
  var ALCANCE = 34;                         // lo que ve el sensor si no hay pared: la baldosa de adelante
  var CHOQUE = PARED.x - (CX + 2 * PASO + PUNTA);   // lo que avanza el tercer paso antes de tocar

  /* La cuenta: rayitas a la derecha */
  var RAYA_X = 274, RAYA_PASO = 8;

  /* ── el reloj de la escena ──────────────────────────────────── */
  var T1 = { flecha: 200, mira: 600, cuenta: 900, apaga: 1500 };
  var T2 = { flecha: 200, pasos: [700, 1500], choca: 2300, golpe: 2520, cuenta: [1100, 1900, 2700] };
  var T3 = { entra: 600, viejo: 400, nuevo: 1300 };
  var CICLO = 1900;                         // paso 4: mirar y avanzar
  var T5 = { vuelve: 300, duda: 1300 };

  var RS = {
    titulo: { es: 'lo que le escribieron', en: 'what they wrote' },
    cartaA: { es: 'si hay pared, parate', en: 'if there is a wall, stop' },
    cartaB: { es: 'avanzá un paso', en: 'move forward one step' },
    veces: { es: 'diez veces', en: 'ten times' },
    miro: { es: 'miró', en: 'looked' },
    pasos: { es: 'pasos', en: 'steps' },
    pared: { es: 'pared', en: 'wall' }
  };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }
  function origen(n, x, y) { n.style.transformOrigin = x + 'px ' + y + 'px'; }
  /* El recuadro crece solo hacia arriba: una escala vertical desde su
     borde de abajo. Con la misma lista de funciones que usa el aparato,
     para que el navegador las interpole una por una. */
  function escalaY(n, s, demora) {
    var d = Math.round(demora || 0) + 'ms';
    n._amD = d;
    n.style.setProperty('--d', d);
    n.style.transform = 'translate(0px,0px) rotate(0deg) scale(1,' + (Math.round(s * 10000) / 10000) + ')';
  }

  /* El robot de lado, con su sensor por delante. k: 0 el de la historia,
     1 el del arreglo. Cada capa de movimiento es un paso: así cada paso
     lleva su propia demora. */
  function robot(A, k) {
    var ve = A.el('g', { 'data-robot': k }, P.capaRobots);
    var m1 = A.el('g', { 'data-robot-paso': 1 }, ve);
    var m2 = A.el('g', { 'data-robot-paso': 2 }, m1);
    var m3 = A.el('g', { 'class': k === 0 ? 'pr-choca' : '', 'data-robot-paso': 3 }, m2);
    var tumbo = A.el('g', { 'class': 'pr-tumbo', 'data-robot-tumbo': '' }, m3);
    origen(tumbo, CX - 14, PISO);
    var g = A.el('g', { 'data-robot-cuerpo': '' }, tumbo);
    A.el('path', { d: 'M' + (CX - 6) + ' ' + (PISO - 38) + ' L' + (CX - 6) + ' ' + (PISO - 46), 'class': 'pr-antena' }, g);
    A.el('circle', { cx: CX - 6, cy: PISO - 47.5, r: 2.2, 'class': 'pr-antena-bola' }, g);
    A.el('rect', { x: CX - 14, y: PISO - 38, width: 28, height: 26, rx: 4, 'class': 'pr-cuerpo', 'data-cuerpo': '' }, g);
    A.el('rect', { x: CX - 10, y: PISO - 33, width: 15, height: 10, rx: 2, 'class': 'pr-panel' }, g);
    A.el('circle', { cx: CX - 6, cy: PISO - 28, r: 1.6, 'class': 'pr-luz' }, g);
    A.el('circle', { cx: CX - 1, cy: PISO - 28, r: 1.6, 'class': 'pr-luz' }, g);
    A.el('rect', { x: CX + 13, y: PISO - 31, width: 4, height: 12, rx: 1.2, 'class': 'pr-sensor' }, g);
    A.el('rect', { x: CX + 17, y: OJO - 3.5, width: PUNTA - 17, height: 7, rx: 1, 'class': 'pr-lente', 'data-lente': '' }, g);
    A.el('circle', { cx: CX - 8, cy: PISO - 6, r: 6, 'class': 'pr-rueda', 'data-rueda': '' }, g);
    A.el('circle', { cx: CX + 8, cy: PISO - 6, r: 6, 'class': 'pr-rueda', 'data-rueda': '' }, g);
    A.el('circle', { cx: CX - 8, cy: PISO - 6, r: 2, 'class': 'pr-eje' }, g);
    A.el('circle', { cx: CX + 8, cy: PISO - 6, r: 2, 'class': 'pr-eje' }, g);
    var grieta = null;
    if (k === 0) {
      grieta = A.el('path', { d: 'M' + (CX + 14) + ' ' + (PISO - 30) + ' L' + (CX + 17.5) + ' ' + (OJO - 2) +
        ' L' + (CX + 15) + ' ' + (OJO + 1) + ' L' + (CX + 18.5) + ' ' + (PISO - 20), 'class': 'pr-grieta', 'data-grieta': '' }, g);
    }
    return { ve: ve, m1: m1, m2: m2, m3: m3, tumbo: tumbo, grieta: grieta };
  }

  /* El haz de mirar, desde la punta del sensor del robot que está en la
     baldosa k: llega hasta la pared si la tiene adelante; si no, ve un
     trecho y nada más. Dos capas: una para encenderse y otra para
     apagarse. */
  function haz(A, k, choca, nombre) {
    var x0 = CX + k * PASO + PUNTA;
    var largo = choca ? PARED.x - x0 : ALCANCE;
    var apaga = A.el('g', { 'data-haz-apaga': nombre }, P.capaHaces);
    var prende = A.el('g', { 'data-haz-prende': nombre }, apaga);
    A.el('path', { d: 'M' + x0 + ' ' + OJO + ' L' + (x0 + largo) + ' ' + (OJO - 7) + ' L' + (x0 + largo) + ' ' + (OJO + 7) + ' Z',
      'class': 'pr-haz', 'data-haz': nombre, 'data-baldosa': k, 'data-hasta-pared': choca ? 'si' : 'no' }, prende);
    return { apaga: apaga, prende: prende };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── lo que le escribieron ── */
    P.titulo = texto(A, svg, CARTA_A.x, 12, 'am-rotulo', 10.5, 'start', '');
    P.titulo.setAttribute('data-titulo', '');
    P.marco = A.el('rect', { x: MARCO.x, y: MARCO.y, width: MARCO.ancho, height: MARCO.alto, rx: 4, 'class': 'pr-marco', 'data-marco': '' }, svg);
    origen(P.marco, MARCO.x, BAJO);
    /* el nombre del recuadro, uno para cada alto: si viajara con el borde de
       arriba, se cruzaría con la primera tarjeta, que baja mientras él sube */
    P.veces = [MARCO.y + 12, MARCO.y + 12 - CRECE].map(function (y, k) {
      var t = texto(A, svg, MARCO.x + 7, y, 'am-rotulo pr-veces', 10.5, 'start', '');
      t.setAttribute('data-veces', k);
      return t;
    });
    /* la flecha de volver a empezar, por dentro del recuadro: una para cada
       alto del recuadro */
    P.vuelta = [MARCO.y + 9, MARCO.y + 9 - CRECE].map(function (arriba, k) {
      var x = MARCO.x + MARCO.ancho - 7, abajo = BAJO - 5;
      var g = A.el('g', { 'data-vuelta': k }, svg);
      A.el('path', { d: 'M' + (x - 6) + ' ' + abajo + ' L' + x + ' ' + abajo + ' L' + x + ' ' + arriba +
        ' M' + (x - 3) + ' ' + (arriba + 4) + ' L' + x + ' ' + arriba + ' L' + (x + 3) + ' ' + (arriba + 4), 'class': 'pr-vuelta' }, g);
      return g;
    });
    var carta = function (x, y, nombre) {
      var g = A.el('g', { 'data-carta': nombre }, svg);
      A.el('rect', { x: x, y: y, width: CARTA.ancho, height: CARTA.alto, rx: 4, 'class': 'pr-carta', 'data-carta-caja': nombre }, g);
      var t = texto(A, g, x + 8, y + 16, 'pr-letra', 11, 'start', '');
      t.setAttribute('data-carta-texto', nombre);
      return { g: g, t: t };
    };
    P.cartaA = carta(CARTA_A.x, CARTA_A.y, 'a');
    P.cartaB = carta(CARTA_B.x, CARTA_B.y, 'b');

    /* la flecha que señala la orden que se está cumpliendo: cinco capas,
       una por cada vez que salta de tarjeta */
    P.flecha = { ve: A.el('g', { 'data-flecha': '' }, svg) };
    var padre = P.flecha.ve;
    P.flecha.q = [0, 1, 2, 3, 4].map(function (i) {
      var q = A.el('g', { 'data-flecha-capa': i }, padre);
      padre = q;
      return q;
    });
    A.el('path', { d: 'M8 ' + (Y_A1 - 5) + ' L17 ' + Y_A1 + ' L8 ' + (Y_A1 + 5) + ' Z', 'class': 'pr-flecha', 'data-flecha-punta': '' }, padre);

    /* ── la cuenta ── */
    P.miroTxt = texto(A, svg, 228, 35, 'am-rotulo', 11, 'start', '');
    P.miroTxt.setAttribute('data-cuenta-nombre', 'miro');
    P.pasosTxt = texto(A, svg, 228, 65, 'am-rotulo', 11, 'start', '');
    P.pasosTxt.setAttribute('data-cuenta-nombre', 'pasos');
    P.miro = [0, 1, 2].map(function (k) {
      return A.el('path', { d: 'M' + (RAYA_X + k * RAYA_PASO) + ' 24 L' + (RAYA_X + k * RAYA_PASO) + ' 37', 'class': 'pr-raya', 'data-raya': 'miro' }, svg);
    });
    P.pasos = [0, 1, 2].map(function (k) {
      return A.el('path', { d: 'M' + (RAYA_X + k * RAYA_PASO) + ' 54 L' + (RAYA_X + k * RAYA_PASO) + ' 67', 'class': 'pr-raya', 'data-raya': 'pasos' }, svg);
    });

    /* ── el pasillo ── */
    for (var i = 0; i < BALDOSAS; i++) {
      A.el('rect', { x: X0 + i * PASO, y: PISO, width: PASO, height: 7, 'class': 'pr-baldosa' + (i % 2 ? ' pr-baldosa-b' : ''), 'data-baldosa': i }, svg);
    }
    A.el('path', { d: 'M' + (X0 - 6) + ' ' + PISO + ' L' + (X0 + BALDOSAS * PASO + 6) + ' ' + PISO, 'class': 'pr-piso', 'data-piso': '' }, svg);

    /* la pared, con sus ladrillos y su nombre */
    P.pared = A.el('g', { 'data-pared': '' }, svg);
    var arriba = PISO - PARED.alto;
    A.el('rect', { x: PARED.x, y: arriba, width: PARED.ancho, height: PARED.alto, 'class': 'pr-muro', 'data-muro': '' }, P.pared);
    var juntas = '';
    for (var f = 0; f * 9 < PARED.alto; f++) {
      var y0 = arriba + f * 9, y1 = Math.min(PISO, y0 + 9);
      if (f > 0) juntas += 'M' + PARED.x + ' ' + y0 + ' L' + (PARED.x + PARED.ancho) + ' ' + y0 + ' ';
      var xs = f % 2 ? [PARED.x + 4.5, PARED.x + 13.5] : [PARED.x + 9];
      xs.forEach(function (x) { juntas += 'M' + x + ' ' + y0 + ' L' + x + ' ' + y1 + ' '; });
    }
    A.el('path', { d: juntas, 'class': 'pr-junta' }, P.pared);
    P.paredTxt = texto(A, P.pared, PARED.x + PARED.ancho / 2, arriba - 7, 'am-rotulo', 10.5, 'middle', '');
    P.paredTxt.setAttribute('data-pared-nombre', '');

    /* los haces de mirar: el de la historia (una sola vez, desde el
       principio) y los tres del arreglo */
    P.capaHaces = A.el('g', {}, svg);
    P.haz1 = haz(A, 0, false, 'historia');
    P.haz2 = [0, 1, 2].map(function (k) { return haz(A, k, k === 2, 'arreglo-' + k); });

    /* los dos robots: el de la historia y el del arreglo, el mismo robot */
    P.capaRobots = A.el('g', {}, svg);
    P.r1 = robot(A, 0);
    P.r2 = robot(A, 1);

    /* lo que pasa en la pared: el golpe y, en el arreglo, lo que ve el sensor */
    var cxG = PARED.x, cyG = OJO;
    var puntas = '';
    for (var s = 0; s < 16; s++) {
      var ang = s * Math.PI / 8 - Math.PI / 2, rr = s % 2 ? 4.5 : 10;
      puntas += (s ? ' L' : 'M') + (Math.round((cxG + Math.cos(ang) * rr) * 100) / 100) + ' ' + (Math.round((cyG + Math.sin(ang) * rr) * 100) / 100);
    }
    P.choque = A.el('path', { d: puntas + ' Z', 'class': 'pr-choque', 'data-choque': '' }, svg);
    P.toca = A.el('circle', { cx: PARED.x, cy: OJO, r: 7, 'class': 'pr-toca', 'data-toca': '' }, svg);

    /* la pregunta del final, encima del robot */
    P.duda = texto(A, svg, CX, PISO - 56, 'am-rotulo pr-duda', 18, 'middle', '?');
    P.duda.setAttribute('data-duda', '');
  }

  function idioma(l) {
    lang = l === 'en' ? 'en' : 'es';
    P.titulo.textContent = RS.titulo[lang];
    P.cartaA.t.textContent = RS.cartaA[lang];
    P.cartaB.t.textContent = RS.cartaB[lang];
    P.veces.forEach(function (t) { t.textContent = RS.veces[lang]; });
    P.miroTxt.textContent = RS.miro[lang];
    P.pasosTxt.textContent = RS.pasos[lang];
    P.paredTxt.textContent = RS.pared[lang];
  }

  /* ── los estados ───────────────────────────────────────────── */

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    var lista = [P.marco, P.cartaA.g, P.flecha.ve, P.choque, P.toca, P.duda, P.pared];
    P.vuelta.concat(P.veces).forEach(function (p) { lista.push(p); });
    P.flecha.q.forEach(function (p) { lista.push(p); });
    P.miro.concat(P.pasos).forEach(function (p) { lista.push(p); });
    [P.haz1].concat(P.haz2).forEach(function (h) { lista.push(h.apaga, h.prende); });
    [P.r1, P.r2].forEach(function (r) { lista.push(r.ve, r.m1, r.m2, r.m3, r.tumbo); if (r.grieta) lista.push(r.grieta); });
    return lista;
  }

  /* El estado al TERMINAR cada paso. arreglo: la primera tarjeta ya entró
     en el recuadro; flecha: dónde quedó (null si no se ve); r1 / r2: cuántos
     pasos dio cada robot (r1 3 es el choque); haces: cuáles miraron;
     miro / pasos: las rayitas de la cuenta. */
  var ESTADOS = [
    { arreglo: false, flecha: null, r1: 0, r2: null, haz1: false, haces: 0, final: false, miro: 0, pasos: 0, lejos: false },
    { arreglo: false, flecha: 'A', r1: 0, r2: null, haz1: true, haces: 0, final: false, miro: 1, pasos: 0, lejos: false },
    { arreglo: false, flecha: 'B', r1: 3, r2: null, haz1: true, haces: 0, final: false, miro: 1, pasos: 3, lejos: false },
    { arreglo: true, flecha: null, r1: null, r2: 0, haz1: true, haces: 0, final: false, miro: 0, pasos: 0, lejos: false },
    { arreglo: true, flecha: 'A', r1: null, r2: 2, haz1: true, haces: 3, final: true, miro: 3, pasos: 2, lejos: false },
    { arreglo: true, flecha: null, r1: null, r2: 0, haz1: true, haces: 3, final: false, miro: 0, pasos: 0, lejos: true }
  ];

  function tarjetas(A, arreglo, demora) {
    A.mover(P.cartaA.g, arreglo ? ENTRA_X : 0, arreglo ? ENTRA_Y : 0, 0, 1, demora);
    escalaY(P.marco, arreglo ? ESCALA : 1, demora);
  }

  /* Dónde está la flecha según las cinco capas: q0 la baja de la primera
     tarjeta cuando entra al recuadro; q1…q4 son los saltos de tarjeta. */
  function flecha(A, s) {
    var q = [0, 0, 0, 0, 0];
    if (s.arreglo) q[0] = Y_A2 - Y_A1;
    if (!s.arreglo && s.flecha === 'B') q[1] = Y_B - Y_A1;
    if (s.arreglo && s.haces === 3) { q[1] = Y_B - Y_A2; q[2] = Y_A2 - Y_B; q[3] = Y_B - Y_A2; q[4] = Y_A2 - Y_B; }
    P.flecha.q.forEach(function (g, i) { A.mover(g, 0, q[i], 0, 1, 0); });
    A.ver(P.flecha.ve, !!s.flecha, 0);
  }

  function base(A, s) {
    deGolpe(A, todo(), function () {
      tarjetas(A, s.arreglo, 0);
      [0, 1].forEach(function (k) {
        A.ver(P.vuelta[k], s.arreglo === (k === 1), 0);
        A.ver(P.veces[k], s.arreglo === (k === 1), 0);
      });
      flecha(A, s);
      /* el robot de la historia */
      A.ver(P.r1.ve, s.r1 != null, 0);
      var n1 = s.r1 || 0;
      A.mover(P.r1.m1, n1 >= 1 ? PASO : 0, 0, 0, 1, 0);
      A.mover(P.r1.m2, n1 >= 2 ? PASO : 0, 0, 0, 1, 0);
      A.mover(P.r1.m3, n1 >= 3 ? CHOQUE : 0, 0, 0, 1, 0);
      A.mover(P.r1.tumbo, 0, 0, n1 >= 3 ? -7 : 0, 1, 0);
      A.ver(P.r1.grieta, n1 >= 3, 0);
      A.ver(P.choque, n1 >= 3, 0);
      /* el del arreglo */
      A.ver(P.r2.ve, s.r2 != null, 0);
      var n2 = s.r2 || 0;
      A.mover(P.r2.m1, n2 >= 1 || s.lejos ? PASO : 0, 0, 0, 1, 0);
      A.mover(P.r2.m2, n2 >= 2 || s.lejos ? PASO : 0, 0, 0, 1, 0);
      A.mover(P.r2.m3, s.lejos ? -2 * PASO : 0, 0, 0, 1, 0);
      A.mover(P.r2.tumbo, 0, 0, 0, 1, 0);
      /* los haces: el de la historia ya se apagó al terminar su paso */
      A.ver(P.haz1.prende, s.haz1, 0);
      A.ver(P.haz1.apaga, !s.haz1, 0);
      P.haz2.forEach(function (h, k) {
        var mira = k < s.haces;
        A.ver(h.prende, mira, 0);
        A.ver(h.apaga, !mira || (k === 2 && s.final), 0);
      });
      A.ver(P.toca, s.final, 0);
      P.miro.forEach(function (p, k) { A.ver(p, k < s.miro, 0); });
      P.pasos.forEach(function (p, k) { A.ver(p, k < s.pasos, 0); });
      A.mover(P.pared, s.lejos ? CORRE : 0, 0, 0, 1, 0);
      A.ver(P.duda, s.lejos, 0);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan solo al ENTRAR; el 0 y
       el 5 se pintan siempre, también en el primer pintado. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 5) {
      if (antes !== 4) { base(A, ESTADOS[5]); return; }
      base(A, ESTADOS[4]);
      /* la pared se corre más lejos y el robot vuelve al principio */
      A.ver(P.haz2[2].apaga, false, 0);
      A.ver(P.toca, false, 0);
      A.ver(P.flecha.ve, false, 0);
      P.miro.concat(P.pasos).forEach(function (p) { A.ver(p, false, 0); });
      A.mover(P.r2.m3, -2 * PASO, 0, 0, 1, T5.vuelve);
      A.mover(P.pared, CORRE, 0, 0, 1, T5.vuelve);
      A.ver(P.duda, true, T5.duda);
      return;
    }
    if (n === 1) {
      base(A, ESTADOS[0]);
      /* lee la primera orden y mira, una sola vez */
      A.ver(P.flecha.ve, true, T1.flecha);
      A.ver(P.haz1.prende, true, T1.mira);
      A.ver(P.miro[0], true, T1.cuenta);
      A.ver(P.haz1.apaga, false, T1.apaga);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      /* pasa a la segunda tarjeta y ya no vuelve: avanza, avanza y en el
         tercero choca */
      A.mover(P.flecha.q[1], 0, Y_B - Y_A1, 0, 1, T2.flecha);
      A.mover(P.r1.m1, PASO, 0, 0, 1, T2.pasos[0]);
      A.mover(P.r1.m2, PASO, 0, 0, 1, T2.pasos[1]);
      A.mover(P.r1.m3, CHOQUE, 0, 0, 1, T2.choca);
      A.ver(P.choque, true, T2.golpe);
      A.ver(P.r1.grieta, true, T2.golpe);
      A.mover(P.r1.tumbo, 0, 0, -7, 1, T2.golpe);
      P.pasos.forEach(function (p, k) { A.ver(p, true, T2.cuenta[k]); });
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      /* si se lo hubieran escrito así: la primera tarjeta entra en el
         recuadro, que crece para recibirla. Ninguna orden nueva. */
      A.ver(P.flecha.ve, false, 0);
      A.ver(P.r1.ve, false, 0);
      A.ver(P.choque, false, 0);
      P.miro.concat(P.pasos).forEach(function (p) { A.ver(p, false, 0); });
      tarjetas(A, true, T3.entra);
      A.mover(P.flecha.q[0], 0, Y_A2 - Y_A1, 0, 1, T3.entra);
      A.mover(P.flecha.q[1], 0, 0, 0, 1, T3.entra);
      A.ver(P.vuelta[0], false, T3.viejo);
      A.ver(P.vuelta[1], true, T3.nuevo);
      A.ver(P.veces[0], false, T3.viejo);
      A.ver(P.veces[1], true, T3.nuevo);
      A.ver(P.r2.ve, true, T3.nuevo);
      return;
    }
    /* el 4: mira antes de cada paso; a la tercera ve la pared y se para */
    base(A, ESTADOS[3]);
    A.ver(P.flecha.ve, true, 200);
    for (var k = 0; k < 3; k++) {
      var t0 = 400 + k * CICLO;
      A.ver(P.haz2[k].prende, true, t0);
      A.ver(P.miro[k], true, t0 + 300);
      if (k === 2) { A.ver(P.toca, true, t0 + 400); break; }
      A.ver(P.haz2[k].apaga, false, t0 + 700);
      A.mover(P.flecha.q[1 + 2 * k], 0, Y_B - Y_A2, 0, 1, t0 + 700);
      A.mover(k === 0 ? P.r2.m1 : P.r2.m2, PASO, 0, 0, 1, t0 + 900);
      A.ver(P.pasos[k], true, t0 + 1400);
      A.mover(P.flecha.q[2 + 2 * k], 0, Y_A2 - Y_B, 0, 1, t0 + 1700);
    }
  }

  var FRASES = {
    es: [
      'Al robot le escribieron dos órdenes: «si hay pared, parate» y «avanzá diez pasos», que es avanzar un paso diez veces. ¿Cuántas veces va a mirar si hay pared?',
      'Primero mira hacia adelante, una sola vez: enfrente no hay pared. Esa orden ya se cumplió, y el robot no vuelve a ella.',
      'Ahora avanza un paso, y otro, y otro, sin volver a mirar. En el tercero choca con la pared, con el sensor por delante.',
      'Si se lo hubieran escrito así: las mismas dos órdenes, pero «si hay pared, parate» va dentro de «diez veces». No hace falta ninguna orden nueva.',
      'Ahora mira antes de cada paso: mira y avanza, mira y avanza. A la tercera vez que mira ve la pared, y se para sin tocarla.',
      'Ahora la pared está más lejos. Si el robot sale otra vez desde aquí, ¿cuántas veces miraría antes de pararse? Cuéntalo paso por paso.'
    ],
    en: [
      'They wrote the robot two orders: «if there is a wall, stop» and «move forward ten steps», which is moving one step ten times. How many times will it look for a wall?',
      'First it looks ahead, only once: there is no wall in front. That order is done, and the robot does not go back to it.',
      'Now it moves one step, and another, and another, without looking again. On the third one it crashes into the wall, sensor first.',
      'If they had written it like this: the same two orders, but «if there is a wall, stop» goes inside «ten times». No new order is needed.',
      'Now it looks before every step: look and move, look and move. The third time it looks it sees the wall, and it stops without touching it.',
      'Now the wall is farther away. If the robot starts again from here, how many times would it look before stopping? Count it step by step.'
    ]
  };
  var BOTONES = {
    es: ['👀 Que mire', '👣 Que avance', '✏️ Escribirlo bien', '▶ Que lo intente', '🧱 Correr la pared', '↺ Empezar otra vez'],
    en: ['👀 Let it look', '👣 Let it move', '✏️ Write it well', '▶ Let it try', '🧱 Move the wall', '↺ Start over']
  };
  var MARCADOR = {
    es: [['1', 'orden dentro de «diez veces»'], ['1', 'vez que miró'], ['3', 'pasos sin volver a mirar'],
      ['2', 'órdenes dentro de «diez veces»'], ['3', 'veces que miró, y no chocó'], ['?', 'veces que miraría']],
    en: [['1', 'order inside «ten times»'], ['1', 'time it looked'], ['3', 'steps without looking again'],
      ['2', 'orders inside «ten times»'], ['3', 'times it looked: no crash'], ['?', 'times it would look']]
  };

  AnimacionMision.montar('#amPared', {
    vista: [ANCHO, ALTO],
    bilingue: true,
    describe: {
      es: 'Arriba, las dos órdenes que le escribieron al robot y el recuadro de «diez veces»; abajo, el pasillo en baldosas, el robot de lado y la pared. Con la orden de mirar fuera del recuadro mira una sola vez y choca en el tercer paso; con la misma orden dentro, mira antes de cada paso y se para frente a la pared.',
      en: 'At the top, the two orders written for the robot and the «ten times» box; below, the hallway in tiles, the robot seen from the side and the wall. With the order to look outside the box it looks just once and crashes on the third step; with the same order inside, it looks before every step and stops in front of the wall.'
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
