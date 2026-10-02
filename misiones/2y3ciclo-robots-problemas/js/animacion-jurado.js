/* ============================================================
   Animación de «Robots que Resuelven Problemas» (Ruta de los Robots,
   etapa 6)
   ------------------------------------------------------------
   La historia: en la feria, el grupo de Kenia presentó un robot que
   bailaba, y bailaba muy bien: les llevó tres semanas. Al lado, otro
   grupo presentó una caja que avisa cuando el tanque del agua se llena,
   con la mitad de las piezas y en una semana. El jurado les hizo a los
   dos la misma pregunta, y solo uno la pudo contestar.

   Lo que se dibuja: las dos mesas de la feria, el robot que baila en una
   y el tanque con su caja en la otra; arriba, la pregunta del jurado;
   abajo, lo que costó cada proyecto (semanas y piezas) y a quién le
   sirve. Un listón señala al que gana según con qué se mida: medido por
   lo difícil, el robot; medido por a quién le sirve, la caja. El mismo
   par de proyectos, dos reglas, dos ganadores. Eso es lo que dice la
   historia: un robot no se juzga por lo difícil que fue hacerlo, sino
   por a quién le sirve.

   ⚠️ La caja AVISA, no cierra nada: así lo dice la historia. Por eso el
   agua sube hasta la marca y la caja enciende su luz y suena; la llave la
   cierra quien llena el tanque, y por eso ella es a quien le sirve.
   Mientras la cierra, el agua sigue subiendo un poco y se queda debajo
   del borde: a tiempo. El chorro y el agua se paran JUNTOS: un chorro que
   sigue cayendo en un tanque que ya no sube sería mentira.

   ⚠️ Lo que NO se dice, y a propósito. La prueba pregunta las siete
   etapas del ciclo de diseño, el criterio, la restricción, la ética del
   diseño, los sensores de cada proyecto y lo que hace cada parte. Aquí
   no se escribe ninguno de esos nombres: «lo difícil», «a quién le
   sirve» y «el problema».

   ⚠️ Una pieza tiene una sola demora. El robot baila con cuatro capas
   de vaivén, una dentro de otra, y cada brazo lleva dos (subir y bajar);
   el chorro lleva dos (abrirse y cerrarse).

   ⚠️ La misión es bilingüe, y la animación también: la escena trae sus dos
   idiomas escritos, y `idioma()` cambia los rótulos del dibujo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amJurado')) return;

  var ANCHO = 320, ALTO = 258;
  var lang = 'es';

  /* ── el dibujo ─────────────────────────────────────────────── */
  /* La pregunta del jurado, arriba y encima de los dos proyectos */
  var JUR = { x: 44, y: 4, ancho: 232, alto: 26 };
  /* Los globos de lo que contesta cada grupo, encima de su proyecto */
  var GLOBO = { y: 36, alto: 22, punta: 64 };
  var CX_A = 82, CX_B = 234;
  var GLOBO_A = 46, GLOBO_B = 156;
  /* Las dos mesas: la tabla de arriba está en MESA_Y */
  var MESA_Y = 150;
  var MESA_A = { x: 12, ancho: 140 }, MESA_B = { x: 168, ancho: 122 };
  var SUELO = 168;
  /* El tanque, su marca de lleno y la caja que avisa */
  var TQ = { x: 180, y: 96, ancho: 48, alto: 54 };
  var MARCA = 106;
  var BAJO = 9;                                 // el agua al principio: 9 de alto
  var LLENO = MESA_Y - MARCA;                   // hasta la marca: 44
  var TOPE = LLENO + 6;                         // y hasta donde llega mientras cierran la llave: a 4 del borde
  var CAJA = { x: 240, y: 124, ancho: 32, alto: 26 };
  var LUZ = { x: 264, y: 119 };
  /* El caño que llena el tanque */
  var CHORRO_X = 193.5;
  /* Las filas de abajo: semanas, piezas y a quién le sirve */
  var FILA_SEM = 184, FILA_PZ = 216, FILA_SIRVE = 242;
  var CAL = 16;
  var SEM_A = [16, 36, 56], SEM_B = [172];
  var PZ_PASO = 11.5;
  var PZ_A = 8, PZ_B = 4;
  /* El listón: en el frente de la mesa del que gana */
  var LISTON = { x: 36, y: 163 };
  var LISTON_B = 192 - 36;                       // lo que se corre a la otra mesa

  /* ── el reloj de la escena ──────────────────────────────────── */
  var T1 = { semA: [300, 500, 700], semB: 900, rotSem: [800, 1000], pzA: 1300, pzB: 1600, rotPz: [1400, 1700], liston: 2200 };
  var T2 = { jurado: 100, baila: [900, 1250, 1600, 1950], brazosArriba: 900, brazosAbajo: 2100, globo: 2700 };
  /* El agua sube parejo: lo que tarda en llegar a la marca sale de lo que
     tarda en subir entera (SUBE, que el CSS dice igual), y ahí se enciende
     la luz. El chorro se corta cuando el agua deja de subir. */
  var SUBE = 2600;
  var LLEGA = Math.round(SUBE * (LLENO - BAJO) / (TOPE - BAJO));
  var T3 = { chorro: 300, agua: 600, globo: 3700 };
  T3.luz = T3.agua + LLEGA;
  T3.ondas = T3.luz + 100;
  T3.cierra = T3.agua + SUBE;
  var T4 = { tenue: 300, nadie: 700, ella: 1000, liston: 1600 };
  var T5 = { problemaB: 400, cajaB: 900, robotA: 1400, problemaA: 1900 };

  var RS = {
    jurado: { es: '¿Y esto qué problema resuelve?', en: 'And what problem does this solve?' },
    globoA: { es: '…', en: '…' },
    globoB: { es: 'Avisa cuando se llena', en: 'It warns when it is full' },
    semA: { es: '3 semanas', en: '3 weeks' },
    semB: { es: '1 semana', en: '1 week' },
    pzA: { es: '8 piezas', en: '8 parts' },
    pzB: { es: '4 piezas', en: '4 parts' },
    lleno: { es: 'lleno', en: 'full' },
    nadie: { es: '¿a quién?', en: 'who?' },
    ella: { es: 'a quien llena el tanque', en: 'whoever fills the tank' },
    ordenA: { es: ['1.º el robot', '2.º ¿el problema?'], en: ['1st the robot', '2nd the problem?'] },
    ordenB: { es: ['1.º el problema', '2.º la caja'], en: ['1st the problem', '2nd the box'] }
  };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }
  function origen(n, x, y) { n.style.transformOrigin = x + 'px ' + y + 'px'; }
  function r2(v) { return Math.round(v * 100) / 100; }
  /* El agua sube con una escala vertical desde el fondo del tanque. Con la
     misma lista de funciones que usa el aparato, para que el navegador las
     interpole una por una. */
  function escalaY(n, s, demora) {
    var d = Math.round(demora || 0) + 'ms';
    n._amD = d;
    n.style.setProperty('--d', d);
    n.style.transform = 'translate(0px,0px) rotate(0deg) scale(1,' + (Math.round(s * 10000) / 10000) + ')';
  }
  /* Lo que se queda pero ya no cuenta, tenue: con fill-opacity y
     stroke-opacity, NUNCA con opacity, que es lo que dice «ya no está». */
  function tenue(n, si, demora) {
    n.style.setProperty('--d', Math.round(demora || 0) + 'ms');
    n.classList.toggle('rp-tenue', !!si);
  }

  /* Un globo con su punta hacia abajo, centrado en cx */
  function globo(A, cx, ancho, nombre) {
    var g = A.el('g', { 'data-globo': nombre }, P.capaGlobos);
    var x0 = cx - ancho / 2, x1 = cx + ancho / 2, y0 = GLOBO.y, y1 = GLOBO.y + GLOBO.alto;
    A.el('path', { d: 'M' + (x0 + 5) + ' ' + y0 + ' L' + (x1 - 5) + ' ' + y0 + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + 5) +
      ' L' + x1 + ' ' + (y1 - 5) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - 5) + ' ' + y1 + ' L' + (cx + 5) + ' ' + y1 +
      ' L' + cx + ' ' + GLOBO.punta + ' L' + (cx - 5) + ' ' + y1 + ' L' + (x0 + 5) + ' ' + y1 + ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - 5) +
      ' L' + x0 + ' ' + (y0 + 5) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + 5) + ' ' + y0 + ' Z', 'class': 'rp-globo', 'data-globo-caja': nombre }, g);
    var t = texto(A, g, cx, y0 + 15.5, 'rp-letra', 11.5, 'middle', '');
    t.setAttribute('data-globo-texto', nombre);
    return { g: g, t: t };
  }

  /* Una mesa de la feria, con su mantel y sus patas */
  function mesa(A, m, nombre) {
    var g = A.el('g', { 'data-mesa': nombre }, P.capaMesas);
    [m.x + 6, m.x + m.ancho - 10].forEach(function (x) {
      A.el('rect', { x: x, y: MESA_Y + 6, width: 4, height: SUELO - MESA_Y - 6, 'class': 'rp-pata' }, g);
    });
    A.el('rect', { x: m.x, y: MESA_Y, width: m.ancho, height: 6, rx: 1.5, 'class': 'rp-tabla', 'data-tabla': nombre }, g);
    return g;
  }

  /* El robot que baila: cuatro capas de vaivén (una dentro de otra, cada
     una con su demora) y dos por brazo */
  function robot(A) {
    var K = 1.2;                                // el robot, un poco más grande que el de la etapa 5
    var y = function (v) { return MESA_Y - v * K; };
    var x = function (v) { return CX_A + v * K; };
    var ve = A.el('g', { 'data-robot': '' }, P.capaProyectos);
    var capas = [];
    var padre = ve;
    for (var i = 0; i < 4; i++) {
      var c = A.el('g', { 'class': 'rp-baila', 'data-baila': i }, padre);
      origen(c, CX_A, MESA_Y);
      capas.push(c);
      padre = c;
    }
    var g = A.el('g', { 'data-robot-cuerpo': '' }, padre);
    A.el('rect', { x: x(-8), y: y(14), width: 5 * K, height: 14 * K, rx: 1.5, 'class': 'rp-pierna', 'data-pie': '' }, g);
    A.el('rect', { x: x(3), y: y(14), width: 5 * K, height: 14 * K, rx: 1.5, 'class': 'rp-pierna', 'data-pie': '' }, g);
    A.el('rect', { x: x(-14), y: y(42), width: 28 * K, height: 28 * K, rx: 4, 'class': 'rp-cuerpo', 'data-torso': '' }, g);
    A.el('rect', { x: x(-8), y: y(36), width: 16 * K, height: 11 * K, rx: 2, 'class': 'rp-panel' }, g);
    A.el('circle', { cx: x(-3.5), cy: y(30.5), r: 1.9, 'class': 'rp-foco' }, g);
    A.el('circle', { cx: x(3.5), cy: y(30.5), r: 1.9, 'class': 'rp-foco' }, g);
    A.el('path', { d: 'M' + CX_A + ' ' + y(58) + ' L' + CX_A + ' ' + y(66), 'class': 'rp-antena' }, g);
    A.el('circle', { cx: CX_A, cy: y(67.5), r: 2.6, 'class': 'rp-antena-bola', 'data-antena': '' }, g);
    A.el('rect', { x: x(-10), y: y(58), width: 20 * K, height: 15 * K, rx: 3, 'class': 'rp-cuerpo', 'data-cabeza': '' }, g);
    A.el('circle', { cx: x(-4), cy: y(51), r: 2.1, 'class': 'rp-ojo' }, g);
    A.el('circle', { cx: x(4), cy: y(51), r: 2.1, 'class': 'rp-ojo' }, g);
    /* los brazos, desde los hombros: suben juntos al empezar el baile y
       bajan al terminar */
    var brazo = function (hx, fx, lado) {
      var b1 = A.el('g', { 'class': 'rp-baila', 'data-brazo': lado }, g);
      origen(b1, hx, y(38));
      var b2 = A.el('g', { 'class': 'rp-baila' }, b1);
      origen(b2, hx, y(38));
      A.el('path', { d: 'M' + hx + ' ' + y(38) + ' L' + fx + ' ' + y(22), 'class': 'rp-brazo', 'data-brazo-linea': lado }, b2);
      return { b1: b1, b2: b2 };
    };
    var bi = brazo(x(-14), x(-24), 'izq');
    var bd = brazo(x(14), x(24), 'der');
    return { ve: ve, capas: capas, bi: bi, bd: bd };
  }

  /* La hoja de calendario de una semana */
  function semana(A, padre, x, nombre) {
    var g = A.el('g', { 'data-semana': nombre }, padre);
    A.el('rect', { x: x, y: FILA_SEM, width: CAL, height: CAL, rx: 2, 'class': 'rp-hoja', 'data-hoja': '' }, g);
    A.el('rect', { x: x, y: FILA_SEM, width: CAL, height: 4, rx: 1.5, 'class': 'rp-hoja-tira' }, g);
    A.el('path', { d: 'M' + (x + 3) + ' ' + (FILA_SEM + 8) + ' L' + (x + CAL - 3) + ' ' + (FILA_SEM + 8) +
      ' M' + (x + 3) + ' ' + (FILA_SEM + 11) + ' L' + (x + CAL - 3) + ' ' + (FILA_SEM + 11), 'class': 'rp-hoja-raya' }, g);
    return g;
  }

  /* Una pieza: un engranaje chico de ocho dientes */
  function pieza(A, padre, cx, nombre) {
    var d = '';
    for (var s = 0; s < 16; s++) {
      var ang = s * Math.PI / 8, rr = s % 2 ? 3.5 : 5.3;
      d += (s ? ' L' : 'M') + r2(cx + Math.cos(ang) * rr) + ' ' + r2(FILA_PZ + Math.sin(ang) * rr);
    }
    var g = A.el('g', { 'data-pieza': nombre }, padre);
    A.el('path', { d: d + ' Z', 'class': 'rp-pieza' }, g);
    A.el('circle', { cx: cx, cy: FILA_PZ, r: 1.3, 'class': 'rp-pieza-eje' }, g);
    return g;
  }

  /* Una persona chica, para la fila de a quién le sirve. La de raya
     cortada es la que nadie supo nombrar. */
  function persona(A, padre, cx, clase, nombre) {
    var g = A.el('g', { 'data-persona': nombre }, padre);
    var y = FILA_SIRVE;
    A.el('circle', { cx: cx, cy: y - 7, r: 4.2, 'class': clase, 'data-persona-cabeza': nombre }, g);
    A.el('path', { d: 'M' + (cx - 6.5) + ' ' + (y + 9) + ' L' + (cx - 6.5) + ' ' + (y + 1.5) +
      ' Q' + (cx - 6.5) + ' ' + (y - 2) + ' ' + (cx - 2.5) + ' ' + (y - 2) + ' L' + (cx + 2.5) + ' ' + (y - 2) +
      ' Q' + (cx + 6.5) + ' ' + (y - 2) + ' ' + (cx + 6.5) + ' ' + (y + 1.5) + ' L' + (cx + 6.5) + ' ' + (y + 9) + ' Z', 'class': clase }, g);
    return g;
  }

  /* Una etiqueta del orden: papel con su texto; la que nadie tuvo, de raya
     cortada */
  function etiqueta(A, cx, y, ancho, clase, nombre, k) {
    var g = A.el('g', { 'data-orden': nombre, 'data-orden-k': k }, P.capaOrden);
    A.el('rect', { x: cx - ancho / 2, y: y, width: ancho, height: 14, rx: 3, 'class': 'rp-tarjeta ' + clase, 'data-orden-caja': nombre }, g);
    var t = texto(A, g, cx, y + 10.6, 'rp-letra', 10.5, 'middle', '');
    t.setAttribute('data-orden-texto', nombre);
    return { g: g, t: t };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    A.el('path', { d: 'M0 ' + SUELO + ' L' + ANCHO + ' ' + SUELO, 'class': 'rp-suelo', 'data-suelo': '' }, svg);

    /* ── la pregunta del jurado, encima de los dos ── */
    P.jurado = A.el('g', { 'data-jurado': '' }, svg);
    A.el('rect', { x: JUR.x, y: JUR.y, width: JUR.ancho, height: JUR.alto, rx: 5, 'class': 'rp-tarjeta', 'data-jurado-caja': '' }, P.jurado);
    P.juradoTxt = texto(A, P.jurado, JUR.x + JUR.ancho / 2, JUR.y + 17.5, 'rp-letra rp-pregunta', 12, 'middle', '');
    P.juradoTxt.setAttribute('data-jurado-texto', '');

    /* ── las dos mesas y lo que hay encima ── */
    P.capaMesas = A.el('g', {}, svg);
    mesa(A, MESA_A, 'A');
    mesa(A, MESA_B, 'B');
    P.capaProyectos = A.el('g', {}, svg);
    P.robot = robot(A);

    /* el caño, el chorro y el tanque: el chorro va DETRÁS del agua */
    var tq = A.el('g', { 'data-tanque': '' }, P.capaProyectos);
    A.el('rect', { x: 189, y: 76, width: ANCHO - 189, height: 6, 'class': 'rp-cano' }, tq);
    A.el('rect', { x: 189, y: 76, width: 9, height: 14, rx: 1, 'class': 'rp-cano', 'data-boca': '' }, tq);
    P.chorro = { apaga: A.el('g', { 'class': 'rp-llave', 'data-chorro-apaga': '' }, tq) };
    P.chorro.prende = A.el('g', { 'data-chorro-prende': '' }, P.chorro.apaga);
    A.el('rect', { x: CHORRO_X - 1.4, y: 90, width: 2.8, height: MESA_Y - 90, 'class': 'rp-chorro', 'data-chorro': '' }, P.chorro.prende);
    A.el('rect', { x: TQ.x, y: TQ.y, width: TQ.ancho, height: TQ.alto, 'class': 'rp-vidrio' }, tq);
    P.agua = A.el('rect', { x: TQ.x + 1.5, y: MESA_Y - TOPE, width: TQ.ancho - 3, height: TOPE, 'class': 'rp-agua rp-agua-sube', 'data-agua': '' }, tq);
    origen(P.agua, TQ.x, MESA_Y);
    A.el('path', { d: 'M' + TQ.x + ' ' + TQ.y + ' L' + TQ.x + ' ' + MESA_Y + ' L' + (TQ.x + TQ.ancho) + ' ' + MESA_Y + ' L' + (TQ.x + TQ.ancho) + ' ' + TQ.y,
      'class': 'rp-tanque', 'data-tanque-borde': '' }, tq);
    A.el('path', { d: 'M' + (TQ.x - 3) + ' ' + MARCA + ' L' + (TQ.x + TQ.ancho + 3) + ' ' + MARCA, 'class': 'rp-marca', 'data-marca': '' }, tq);
    P.llenoTxt = texto(A, tq, TQ.x - 6, MARCA + 4, 'am-rotulo', 11, 'end', '');
    P.llenoTxt.setAttribute('data-lleno', '');
    /* la caja que avisa, con el cable hasta su punto en la marca */
    var cj = A.el('g', { 'data-caja': '' }, P.capaProyectos);
    A.el('path', { d: 'M' + (TQ.x + TQ.ancho - 6) + ' ' + MARCA + ' L' + (TQ.x + TQ.ancho - 6) + ' 92 L249 92 L249 ' + CAJA.y, 'class': 'rp-cable' }, cj);
    A.el('circle', { cx: TQ.x + TQ.ancho - 6, cy: MARCA, r: 2.6, 'class': 'rp-punto', 'data-punto': '' }, cj);
    A.el('rect', { x: CAJA.x, y: CAJA.y, width: CAJA.ancho, height: CAJA.alto, rx: 3, 'class': 'rp-caja', 'data-caja-cuerpo': '' }, cj);
    A.el('path', { d: 'M246 131 L266 131 M246 136 L266 136 M246 141 L266 141', 'class': 'rp-rejilla' }, cj);
    A.el('circle', { cx: LUZ.x, cy: LUZ.y, r: 4.2, 'class': 'rp-luz-off' }, cj);
    P.luz = A.el('g', { 'data-luz': '' }, cj);
    A.el('circle', { cx: LUZ.x, cy: LUZ.y, r: 8.5, 'class': 'rp-halo', 'data-halo': '' }, P.luz);
    A.el('circle', { cx: LUZ.x, cy: LUZ.y, r: 4.2, 'class': 'rp-luz-on', 'data-luz-on': '' }, P.luz);
    P.ondas = A.el('g', { 'data-ondas': '' }, cj);
    [6, 10.5, 15].forEach(function (rr) {
      var a0 = -Math.PI / 4, a1 = Math.PI / 4, cx = CAJA.x + CAJA.ancho, cy = CAJA.y + 11;
      A.el('path', { d: 'M' + r2(cx + Math.cos(a0) * rr) + ' ' + r2(cy + Math.sin(a0) * rr) + ' A' + rr + ' ' + rr + ' 0 0 1 ' +
        r2(cx + Math.cos(a1) * rr) + ' ' + r2(cy + Math.sin(a1) * rr), 'class': 'rp-onda' }, P.ondas);
    });

    /* ── lo que costó cada uno, y a quién le sirve ── */
    P.capaFilas = A.el('g', { 'class': 'rp-atenua', 'data-filas': '' }, svg);
    P.semA = SEM_A.map(function (x, k) { return semana(A, P.capaFilas, x, 'A' + k); });
    P.semB = SEM_B.map(function (x, k) { return semana(A, P.capaFilas, x, 'B' + k); });
    P.semTxtA = texto(A, P.capaFilas, 78, FILA_SEM + 12, 'am-rotulo', 11, 'start', '');
    P.semTxtA.setAttribute('data-rotulo-sem', 'A');
    P.semTxtB = texto(A, P.capaFilas, 194, FILA_SEM + 12, 'am-rotulo', 11, 'start', '');
    P.semTxtB.setAttribute('data-rotulo-sem', 'B');
    P.pzA = A.el('g', { 'data-piezas': 'A' }, P.capaFilas);
    for (var i = 0; i < PZ_A; i++) pieza(A, P.pzA, 21 + i * PZ_PASO, 'A' + i);
    P.pzB = A.el('g', { 'data-piezas': 'B' }, P.capaFilas);
    for (var j = 0; j < PZ_B; j++) pieza(A, P.pzB, 176 + j * PZ_PASO, 'B' + j);
    P.pzTxtA = texto(A, P.capaFilas, 110, FILA_PZ + 4, 'am-rotulo', 11, 'start', '');
    P.pzTxtA.setAttribute('data-rotulo-pz', 'A');
    P.pzTxtB = texto(A, P.capaFilas, 222, FILA_PZ + 4, 'am-rotulo', 11, 'start', '');
    P.pzTxtB.setAttribute('data-rotulo-pz', 'B');
    /* las dos primeras filas van en un grupo, que se pone tenue cuando ya no
       es lo que se mide */

    P.nadie = A.el('g', { 'data-sirve': 'A' }, svg);
    persona(A, P.nadie, 24, 'rp-nadie', 'A');
    P.nadieTxt = texto(A, P.nadie, 37, FILA_SIRVE + 4, 'am-rotulo', 11, 'start', '');
    P.nadieTxt.setAttribute('data-rotulo-sirve', 'A');
    P.ella = A.el('g', { 'data-sirve': 'B' }, svg);
    persona(A, P.ella, 172, 'rp-ella', 'B');
    A.el('path', { d: 'M181 ' + (FILA_SIRVE + 1) + ' L184.5 ' + (FILA_SIRVE + 5) + ' L191 ' + (FILA_SIRVE - 4), 'class': 'rp-visto', 'data-visto': '' }, P.ella);
    P.ellaTxt = texto(A, P.ella, 195, FILA_SIRVE + 4, 'am-rotulo', 10.5, 'start', '');
    P.ellaTxt.setAttribute('data-rotulo-sirve', 'B');

    /* ── el listón del que gana ── */
    P.liston = A.el('g', { 'data-liston': '' }, svg);
    A.el('path', { d: 'M' + (LISTON.x - 7) + ' ' + LISTON.y + ' L' + (LISTON.x - 10) + ' ' + (LISTON.y + 17) + ' L' + (LISTON.x - 6) + ' ' + (LISTON.y + 14) +
      ' L' + (LISTON.x - 2) + ' ' + (LISTON.y + 18) + ' L' + (LISTON.x - 1) + ' ' + LISTON.y + ' Z' +
      ' M' + (LISTON.x + 1) + ' ' + LISTON.y + ' L' + (LISTON.x + 2) + ' ' + (LISTON.y + 18) + ' L' + (LISTON.x + 6) + ' ' + (LISTON.y + 14) +
      ' L' + (LISTON.x + 10) + ' ' + (LISTON.y + 17) + ' L' + (LISTON.x + 7) + ' ' + LISTON.y + ' Z', 'class': 'rp-liston-cola' }, P.liston);
    A.el('circle', { cx: LISTON.x, cy: LISTON.y, r: 8.5, 'class': 'rp-liston', 'data-liston-centro': '' }, P.liston);
    texto(A, P.liston, LISTON.x, LISTON.y + 4, 'rp-estrella', 11, 'middle', '★');

    /* ── lo que contesta cada grupo, y el orden de cada uno ── */
    P.capaGlobos = A.el('g', {}, svg);
    P.globoA = globo(A, CX_A, GLOBO_A, 'A');
    P.globoB = globo(A, CX_B, GLOBO_B, 'B');
    P.capaOrden = A.el('g', {}, svg);
    P.ordenA = [etiqueta(A, CX_A, 32, 112, '', 'A', 1), etiqueta(A, CX_A, 48, 112, 'rp-falta', 'A', 2)];
    P.ordenB = [etiqueta(A, CX_B, 32, 112, '', 'B', 1), etiqueta(A, CX_B, 48, 112, '', 'B', 2)];
  }

  function idioma(l) {
    lang = l === 'en' ? 'en' : 'es';
    P.juradoTxt.textContent = RS.jurado[lang];
    P.globoA.t.textContent = RS.globoA[lang];
    P.globoB.t.textContent = RS.globoB[lang];
    P.semTxtA.textContent = RS.semA[lang];
    P.semTxtB.textContent = RS.semB[lang];
    P.pzTxtA.textContent = RS.pzA[lang];
    P.pzTxtB.textContent = RS.pzB[lang];
    P.llenoTxt.textContent = RS.lleno[lang];
    P.nadieTxt.textContent = RS.nadie[lang];
    P.ellaTxt.textContent = RS.ella[lang];
    P.ordenA.forEach(function (e, k) { e.t.textContent = RS.ordenA[lang][k]; });
    P.ordenB.forEach(function (e, k) { e.t.textContent = RS.ordenB[lang][k]; });
  }

  /* ── los estados ───────────────────────────────────────────── */

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    var lista = [P.jurado, P.liston, P.agua, P.luz, P.ondas, P.nadie, P.ella, P.globoA.g, P.globoB.g, P.semTxtA, P.semTxtB,
      P.pzA, P.pzB, P.pzTxtA, P.pzTxtB, P.chorro.apaga, P.chorro.prende, P.capaFilas];
    P.semA.concat(P.semB, P.robot.capas).forEach(function (p) { lista.push(p); });
    [P.robot.bi, P.robot.bd].forEach(function (b) { lista.push(b.b1, b.b2); });
    P.ordenA.concat(P.ordenB).forEach(function (e) { lista.push(e.g); });
    return lista;
  }

  /* El estado al TERMINAR cada paso. filas: semanas y piezas a la vista;
     tenue: ya no son lo que se mide; liston: a qué mesa señala; jurado: la
     pregunta; globoA / globoB: lo que contesta cada grupo;
     lleno: el agua ya pasó la marca; chorro: el caño abierto; luz / ondas: la
     caja avisando; sirve: la fila de a quién le sirve; orden: lo que hizo
     primero cada grupo. */
  var ESTADOS = [
    { filas: false, tenue: false, liston: null, jurado: false, globoA: false, globoB: false, lleno: false, chorro: false, luz: false, ondas: false, sirve: false, orden: false },
    { filas: true, tenue: false, liston: 'A', jurado: false, globoA: false, globoB: false, lleno: false, chorro: false, luz: false, ondas: false, sirve: false, orden: false },
    { filas: true, tenue: false, liston: 'A', jurado: true, globoA: true, globoB: false, lleno: false, chorro: false, luz: false, ondas: false, sirve: false, orden: false },
    { filas: true, tenue: false, liston: 'A', jurado: true, globoA: true, globoB: true, lleno: true, chorro: false, luz: true, ondas: true, sirve: false, orden: false },
    { filas: true, tenue: true, liston: 'B', jurado: true, globoA: true, globoB: true, lleno: true, chorro: false, luz: true, ondas: false, sirve: true, orden: false },
    { filas: true, tenue: true, liston: 'B', jurado: true, globoA: false, globoB: false, lleno: true, chorro: false, luz: true, ondas: false, sirve: true, orden: true }
  ];

  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.ver(P.jurado, s.jurado, 0);
      A.ver(P.globoA.g, s.globoA, 0);
      A.ver(P.globoB.g, s.globoB, 0);
      P.semA.concat(P.semB).forEach(function (p) { A.ver(p, s.filas, 0); });
      [P.semTxtA, P.semTxtB, P.pzA, P.pzB, P.pzTxtA, P.pzTxtB].forEach(function (p) { A.ver(p, s.filas, 0); });
      tenue(P.capaFilas, s.tenue, 0);
      A.ver(P.liston, !!s.liston, 0);
      A.mover(P.liston, s.liston === 'B' ? LISTON_B : 0, 0, 0, 1, 0);
      /* el robot, derecho y con los brazos abajo */
      P.robot.capas.forEach(function (c) { A.mover(c, 0, 0, 0, 1, 0); });
      [P.robot.bi, P.robot.bd].forEach(function (b) { A.mover(b.b1, 0, 0, 0, 1, 0); A.mover(b.b2, 0, 0, 0, 1, 0); });
      /* el tanque y la caja */
      escalaY(P.agua, s.lleno ? 1 : BAJO / TOPE, 0);
      A.ver(P.chorro.prende, s.chorro, 0);
      A.ver(P.chorro.apaga, true, 0);
      A.ver(P.luz, s.luz, 0);
      A.ver(P.ondas, s.ondas, 0);
      A.ver(P.nadie, s.sirve, 0);
      A.ver(P.ella, s.sirve, 0);
      P.ordenA.concat(P.ordenB).forEach(function (e) { A.ver(e.g, s.orden, 0); });
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan cada vez que se ENTRA
       en ellos, también volviendo con «Atrás»; el 0 y el 5 se pintan
       siempre, también en el primer pintado. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 5) {
      if (antes !== 4) { base(A, ESTADOS[5]); return; }
      base(A, ESTADOS[4]);
      /* lo que contestó cada grupo se va, y llega el orden: primero el
         problema y después la caja; primero el robot, y el problema nunca */
      A.ver(P.globoA.g, false, 0);
      A.ver(P.globoB.g, false, 0);
      A.ver(P.ordenB[0].g, true, T5.problemaB);
      A.ver(P.ordenB[1].g, true, T5.cajaB);
      A.ver(P.ordenA[0].g, true, T5.robotA);
      A.ver(P.ordenA[1].g, true, T5.problemaA);
      return;
    }
    if (n === 1) {
      base(A, ESTADOS[0]);
      /* lo difícil: las semanas, una por una, y las piezas; el listón va al
         que costó más */
      P.semA.forEach(function (p, k) { A.ver(p, true, T1.semA[k]); });
      A.ver(P.semB[0], true, T1.semB);
      A.ver(P.semTxtA, true, T1.rotSem[0]);
      A.ver(P.semTxtB, true, T1.rotSem[1]);
      A.ver(P.pzA, true, T1.pzA);
      A.ver(P.pzTxtA, true, T1.rotPz[0]);
      A.ver(P.pzB, true, T1.pzB);
      A.ver(P.pzTxtB, true, T1.rotPz[1]);
      A.ver(P.liston, true, T1.liston);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      /* la misma pregunta a los dos; el robot baila, y su grupo no sabe qué
         contestar */
      A.ver(P.jurado, true, T2.jurado);
      var vaiven = [10, -20, 20, -10];
      P.robot.capas.forEach(function (c, k) { A.mover(c, 0, 0, vaiven[k], 1, T2.baila[k]); });
      A.mover(P.robot.bi.b1, 0, 0, 120, 1, T2.brazosArriba);
      A.mover(P.robot.bd.b1, 0, 0, -120, 1, T2.brazosArriba);
      A.mover(P.robot.bi.b2, 0, 0, -120, 1, T2.brazosAbajo);
      A.mover(P.robot.bd.b2, 0, 0, 120, 1, T2.brazosAbajo);
      A.ver(P.globoA.g, true, T2.globo);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      /* la caja se muestra: el agua sube, llega a la marca y la caja avisa;
         quien llena el tanque cierra la llave, y el agua se para con el
         chorro, antes del borde */
      A.ver(P.chorro.prende, true, T3.chorro);
      escalaY(P.agua, 1, T3.agua);
      A.ver(P.luz, true, T3.luz);
      A.ver(P.ondas, true, T3.ondas);
      A.ver(P.chorro.apaga, false, T3.cierra);
      A.ver(P.globoB.g, true, T3.globo);
      return;
    }
    /* el 4: lo difícil queda tenue y se mide a quién le sirve; el listón
       se pasa a la otra mesa */
    base(A, ESTADOS[3]);
    A.ver(P.ondas, false, 0);
    tenue(P.capaFilas, true, T4.tenue);
    A.ver(P.nadie, true, T4.nadie);
    A.ver(P.ella, true, T4.ella);
    A.mover(P.liston, LISTON_B, 0, 0, 1, T4.liston);
  }

  var FRASES = {
    es: [
      'Dos proyectos en la feria: el robot que baila y la caja del tanque. ¿Cuál es mejor? Antes de tocar, piensa con qué lo medirías.',
      'Medido por lo difícil, gana el robot que baila: tres semanas contra una, y el doble de piezas.',
      'El jurado les hace a los dos la misma pregunta: ¿y esto qué problema resuelve? El robot baila muy bien, pero su grupo no sabe qué contestar.',
      'El otro grupo lo muestra: el agua sube, llega a la marca y la caja avisa. Quien llena el tanque cierra la llave a tiempo, antes de que se derrame.',
      'Medido por a quién le sirve, gana la caja, con la mitad de las piezas y en una semana. Eso es lo que midió el jurado.',
      'El otro grupo empezó por el problema, y la caja vino después. ¿Qué problema hay en tu escuela, y a quién le pasa? Escríbelo antes de pensar en el robot.'
    ],
    en: [
      'Two projects at the fair: the robot that dances and the tank box. Which one is better? Before you tap, think about how you would measure it.',
      'Measured by how hard it was, the dancing robot wins: three weeks against one, and twice as many parts.',
      'The judges ask both groups the same question: and what problem does this solve? The robot dances very well, but its group does not know what to answer.',
      'The other group shows it: the water rises, reaches the mark and the box warns. Whoever fills the tank closes the tap in time, before it overflows.',
      'Measured by who it is useful to, the box wins, with half the parts and in one week. That is what the judges measured.',
      'The other group started with the problem, and the box came after. What problem is there at your school, and who does it happen to? Write it down before thinking about the robot.'
    ]
  };
  var BOTONES = {
    es: ['📏 Medir lo difícil', '❓ El jurado pregunta', '💧 Mostrar la caja', '⚖️ ¿A quién le sirve?', '🔍 ¿Qué fue primero?', '↺ Empezar otra vez'],
    en: ['📏 Measure how hard', '❓ The judges ask', '💧 Show the box', '⚖️ Who does it serve?', '🔍 What came first?', '↺ Start over']
  };
  var MARCADOR = {
    es: [['2', 'proyectos en la feria'], ['3', 'semanas contra 1'], ['1', 'pregunta para los dos'],
      ['1', 'problema que resuelve la caja'], ['1', 'persona a la que le sirve la caja'], ['?', 'el problema de tu escuela']],
    en: [['2', 'projects at the fair'], ['3', 'weeks against 1'], ['1', 'question for both'],
      ['1', 'problem the box solves'], ['1', 'person the box is useful to'], ['?', 'the problem at your school']]
  };

  AnimacionMision.montar('#amJurado', {
    vista: [ANCHO, ALTO],
    bilingue: true,
    describe: {
      es: 'Dos mesas de la feria: en una, el robot que baila; en la otra, un tanque con la caja que avisa cuando se llena. Arriba, la pregunta del jurado; abajo, las semanas y las piezas de cada proyecto, y a quién le sirve. Un listón señala al que gana: medido por lo difícil, el robot; medido por a quién le sirve, la caja.',
      en: 'Two tables at the fair: on one, the robot that dances; on the other, a tank with the box that warns when it is full. At the top, the judges’ question; at the bottom, the weeks and the parts of each project, and who it is useful to. A ribbon marks the winner: measured by how hard it was, the robot; measured by who it is useful to, the box.'
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
