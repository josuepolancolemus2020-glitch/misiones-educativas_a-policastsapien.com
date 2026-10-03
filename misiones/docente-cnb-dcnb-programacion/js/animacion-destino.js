/* ============================================================
   Animación de «CNB, DCNB y programación: quién manda sobre qué»
   (misión del maestro, sección de los ocho peldaños)
   ------------------------------------------------------------
   Lo que enseña: la línea entre lo que el maestro decide y lo que no.
   A dónde tiene que llegar cada año lo fija el documento; el camino
   (otra actividad, más tiempo, otro material, un apoyo) es suyo, y
   cualquiera de los cuatro llega al mismo sitio. Y lo que cuesta
   cruzar esa línea: a Brayan le sugieren bajarle la exigencia «para que
   no repruebe», su destino baja, llega y aprueba… y el año que viene le
   toca subir lo que le faltó, y además lo nuevo.

   De dónde sale: de la propia misión. Los cuatro caminos son los del
   octavo peldaño (PELDANOS, en js/cnb-dcnb-programacion.js): «Lo que se
   ajusta es el camino: la actividad, el tiempo, el material, el apoyo»;
   la regla es la del mismo peldaño («adecuar es cambiar el camino, no el
   destino») y «el cómo es suyo» sale de su recuadro del aula. La escena
   los lee de ahí ANTES de montarse: si la misión dejara de decirlo, no se
   monta y queda la frase de reserva. «Para que no repruebe» es la frase
   del tercer caso de la misión.

   El dibujo es una escalera de tres años (el año pasado, este año y el
   año que viene) con un destino en cada uno. Lo que baja es el destino
   de Brayan, medio año de subida: el año que viene, el del grado
   siguiente está donde siempre, y entre los dos queda año y medio de
   subida en un solo año. Lo dice el dibujo y lo mide la sonda.

   ⚠️ Lo que NO se dice, y a propósito: cómo se llaman el destino de un
   grado y la meta del sistema (lo preguntan el quiz, el completar y el
   memorama), que el documento es «normativo» y «de carácter nacional»
   (es la primera pregunta del quiz y del simulacro), los niveles, los
   ciclos, las áreas, los ejes, las columnas de la tabla, el proyecto del
   centro, la adecuación curricular y sus componentes, las semanas del
   año ni el libro de texto. Tampoco se habla de un alumno con
   necesidades educativas especiales: lo que se le adecúa a él lo decide
   el centro por escrito, y eso es el tercer caso de la misión, para
   pensarlo. Aquí es cualquier alumno al que le cuesta.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amDestino')) return;
  if (typeof PELDANOS === 'undefined' || !Array.isArray(PELDANOS)) return;

  var ANCHO = 320, ALTO = 310;

  /* ── lo que dice la misión ─────────────────────────────────── */
  var PEL = null;
  PELDANOS.forEach(function (p) {
    if (!PEL && (p.pasos || []).some(function (s) { return /^Lo que se ajusta es el camino:/.test(s); })) PEL = p;
  });
  if (!PEL) return;
  var lista = PEL.pasos.filter(function (s) { return /^Lo que se ajusta es el camino:/.test(s); })[0]
    .replace(/^Lo que se ajusta es el camino:\s*/, '').replace(/\.\s*$/, '').split(/\s*,\s*/)
    .map(function (s) { return s.replace(/^(la|el|los|las)\s+/, ''); });
  /* cómo se dice cada camino en el dibujo: «otra» actividad, «más» tiempo… */
  var DICHO = { actividad: 'otra actividad', tiempo: 'más tiempo', material: 'otro material', apoyo: 'un apoyo' };
  if (lista.length !== 4 || lista.some(function (s) { return !DICHO[s]; })) return;
  if (!(PEL.nohacer || []).some(function (s) { return s.indexOf('cambiar el camino, no el destino') >= 0; })) return;
  if (String(PEL.aula || '').indexOf('el cómo es suyo') < 0) return;
  var CAMINOS = lista.map(function (s) { return DICHO[s]; });

  /* ── la escalera ── */
  var A_ = { x0: 8, x1: 100, y: 258 }, B_ = { x0: 100, x1: 208, y: 186 }, C_ = { x0: 208, x1: 312, y: 114 };
  var H = A_.y - B_.y;                 /* lo que se sube en un año */
  var BAJA = H / 2;                    /* lo que le bajan a Brayan: medio año de subida */
  var FONDO = 330;                     /* los bloques siguen por debajo del dibujo */
  var CARA_Y = 292;                    /* el rótulo de cada año, en su cara */
  var POSTE = 34;                      /* alto del asta de la bandera */
  var BAND_B = { x: 162 }, BAND_C = { x: 262 };
  var TELA = { ancho: 38, alto: 15 };

  /* ── Brayan ──
     Sube como se sube un escalón: camina hasta la pared, sube y pasa
     encima. Subiendo en el aire, lejos de la pared, parecía que flotaba. */
  var BR = { x: 32, pared: 88, enB: 113 }; /* en el año pasado, junto a la pared y en este año */

  /* ── los cuatro caminos: salen todos de Brayan y llegan al pie de la
     bandera de este año. Cada uno por su carril, a su altura, y los cuatro
     por ENCIMA de donde Brayan se para en este año: en el paso 5 vuelven,
     tenues, y él queda debajo de ellos, no metido entre sus nombres. ── */
  var SAL = { x: 58, y: 246 };
  var LLEGA = { x: 150, y: B_.y };
  var CARRIL = { x0: 76, x1: 148, y: [52, 76, 100, 124] };

  /* ── el documento ── */
  var DOC = { x0: 196, x1: 308, y0: 8, y1: 30 };
  var DOC_B = { x: 210, y: 30 }, DOC_C = { x: 262, y: 30 };

  /* ── lo demás ──
     La llave va del lado del año que viene, pegada a su borde, con lo que
     dice encima de su cara: del lado de este año está la bandera, y en los
     pasos 5 y 6 se habrían montado. */
  var NOTA = { x0: 8, x1: 176, y0: 40, y1: 82 };
  var BOLETA = { x0: 54, x1: 96, y0: 186, y1: 204 };
  var LLAVE = { x: 214, tic: 5.5, txt: 220 };
  var CUAD = { x0: 8, x1: 178, y0: 36, y1: 100 };

  /* ── el reloj de la escena ── */
  var T1 = { doc: 0, lineaB: 400, lineaC: 700 };
  var T2 = { primero: 0, cada: 650, rotulo: 450 };
  T2.flecha = T2.primero + T2.cada * 3 + 800;
  var PASO = 500;                      /* cada tramo de Brayan (en el CSS, .dc-paso) */
  /* La nota y el cuaderno salen donde estaban los caminos: esperan a que
     se hayan ido (se apagan en medio segundo). */
  var T3 = { sale: 0, nota: 500, baja: 1000, caja: 1300, camina: 1900, boleta: 3500 };
  var T4 = { sale: 0, falta: 500, nuevo: 1000 };
  /* En el 5 Brayan vuelve a empezar el año: se apaga, vuelve al año pasado
     sin que se le vea y se enciende otra vez (OTRA_VEZ, en el CSS de la
     misión: 2,2 s, apagado del 30 % al 70 %). Lo que vuelve tiene que caber
     en ese apagado: de 680 a 1480 ms, dentro de 660 a 1540. */
  var OTRA_VEZ = 2200;
  var T5 = { sale: 0, vuelve: 680, caminos: 1600, lineaB: 1700, camina: 2300, llave: 3900 };
  var T6 = { sale: 0, cuaderno: 500 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }

  /* Un camino: sube de Brayan a su carril, lo recorre y baja al pie de la
     bandera. Todos salen del mismo punto y llegan al mismo punto. */
  function camino(y) {
    return 'M' + SAL.x + ' ' + SAL.y +
      ' C' + (SAL.x + 10) + ' ' + SAL.y + ' ' + (CARRIL.x0 - 10) + ' ' + y + ' ' + CARRIL.x0 + ' ' + y +
      ' L' + CARRIL.x1 + ' ' + y +
      ' C' + LLEGA.x + ' ' + y + ' ' + LLEGA.x + ' ' + (LLEGA.y - 10) + ' ' + LLEGA.x + ' ' + LLEGA.y;
  }

  /* Una bandera: el asta sobre el año y la tela con «destino». */
  function bandera(A, padre, x, y, cual) {
    var g = A.el('g', { 'data-bandera': cual }, padre);
    A.el('path', { d: 'M' + x + ' ' + y + ' L' + x + ' ' + (y - POSTE), 'class': 'dc-asta', 'data-asta': '' }, g);
    A.el('rect', { x: x, y: y - POSTE, width: TELA.ancho, height: TELA.alto, rx: 2, 'class': 'dc-tela', 'data-tela': '' }, g);
    texto(A, g, x + TELA.ancho / 2, y - POSTE + 11, 'dc-tela-txt', 9.5, 'middle', 'destino').setAttribute('data-tela-txt', '');
    return g;
  }

  /* Brayan: pantalón, camisa del uniforme, brazos, cabeza y pelo, con su
     nombre encima. Se dibuja parado en el año pasado; lo mueven sus
     envolturas. */
  function brayan(A, padre) {
    var x = BR.x, s = A_.y;
    var g = A.el('g', { 'data-brayan': '' }, padre);
    A.el('rect', { x: x - 5, y: s - 10, width: 4, height: 10, rx: 1.2, 'class': 'dc-pantalon' }, g);
    A.el('rect', { x: x + 1, y: s - 10, width: 4, height: 10, rx: 1.2, 'class': 'dc-pantalon' }, g);
    A.el('rect', { x: x - 7.5, y: s - 25, width: 15, height: 15, rx: 3, 'class': 'dc-camisa' }, g);
    A.el('path', { d: 'M' + (x - 6) + ' ' + (s - 21) + ' L' + (x - 9) + ' ' + (s - 12), 'class': 'dc-brazo' }, g);
    A.el('path', { d: 'M' + (x + 6) + ' ' + (s - 21) + ' L' + (x + 9) + ' ' + (s - 12), 'class': 'dc-brazo' }, g);
    A.el('circle', { cx: x, cy: s - 31.5, r: 6.5, 'class': 'dc-piel', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 6.5) + ' ' + (s - 32) + ' Q' + (x - 5.7) + ' ' + (s - 39.5) + ' ' + x + ' ' + (s - 38.6) +
      ' Q' + (x + 5.7) + ' ' + (s - 39.5) + ' ' + (x + 6.5) + ' ' + (s - 32) + ' Q' + x + ' ' + (s - 35.5) + ' ' + (x - 6.5) + ' ' + (s - 32) + ' Z',
      'class': 'dc-pelo' }, g);
    texto(A, g, x, s - 45, 'am-rotulo', 11, 'middle', 'Brayan').setAttribute('data-nombre', '');
    return g;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── el documento y sus dos hilos ── */
    P.doc = A.el('g', { 'data-doc': '' }, svg);
    A.el('rect', { x: DOC.x0, y: DOC.y0, width: DOC.x1 - DOC.x0, height: DOC.y1 - DOC.y0, rx: 5, 'class': 'dc-doc' }, P.doc);
    texto(A, P.doc, (DOC.x0 + DOC.x1) / 2, DOC.y0 + 15.5, 'dc-doc-txt', 11, 'middle', '📘 el documento').setAttribute('data-doc-txt', '');
    P.lineaC = A.el('path', { d: 'M' + DOC_C.x + ' ' + DOC_C.y + ' L' + BAND_C.x + ' ' + (C_.y - POSTE), 'class': 'dc-hilo', 'data-hilo': 'C' }, svg);
    P.lineaB = A.el('path', { d: 'M' + DOC_B.x + ' ' + DOC_B.y + ' L' + BAND_B.x + ' ' + (B_.y - POSTE), 'class': 'dc-hilo', 'data-hilo': 'B' }, svg);

    /* ── la escalera: el año pasado, este año y el que viene ── */
    A.el('rect', { x: A_.x0, y: A_.y, width: A_.x1 - A_.x0, height: FONDO - A_.y, 'class': 'dc-bloque', 'data-bloque': 'A' }, svg);
    A.el('rect', { x: C_.x0, y: C_.y, width: C_.x1 - C_.x0, height: FONDO - C_.y, 'class': 'dc-bloque', 'data-bloque': 'C' }, svg);
    /* donde estaba el destino de Brayan, cuando se lo bajan */
    P.caja = A.el('rect', { x: B_.x0, y: B_.y, width: B_.x1 - B_.x0, height: BAJA, 'class': 'dc-caja', 'data-caja': '' }, svg);
    P.bajaB = A.el('g', { 'data-baja': '' }, svg);
    A.el('rect', { x: B_.x0, y: B_.y, width: B_.x1 - B_.x0, height: FONDO - B_.y, 'class': 'dc-bloque', 'data-bloque': 'B' }, P.bajaB);
    P.banderaB = bandera(A, P.bajaB, BAND_B.x, B_.y, 'B');
    P.banderaC = bandera(A, svg, BAND_C.x, C_.y, 'C');
    [['el año pasado', A_], ['este año', B_], ['el año que viene', C_]].forEach(function (c, i) {
      texto(A, svg, (c[1].x0 + c[1].x1) / 2, CARA_Y, 'dc-cara', 11, 'middle', c[0]).setAttribute('data-cara', 'ABC'[i]);
    });

    /* ── los cuatro caminos ── */
    P.caminos = A.el('g', { 'data-caminos': '' }, svg);
    P.camino = CAMINOS.map(function (c, i) {
      var y = CARRIL.y[i];
      var g = A.el('g', { 'data-camino': c }, P.caminos);
      var linea = A.el('path', { d: camino(y), 'class': 'dc-camino', 'data-linea': '', 'data-carril': y }, g);
      var t = texto(A, g, CARRIL.x0 + 2, y - 4, 'dc-camino-txt', 10.5, 'start', c);
      t.setAttribute('data-camino-txt', '');
      return { g: g, linea: linea, t: t };
    });
    P.flecha = A.el('path', { d: 'M' + (LLEGA.x - 4) + ' ' + (LLEGA.y - 7) + ' L' + LLEGA.x + ' ' + (LLEGA.y - 1.5) + ' L' + (LLEGA.x + 4) + ' ' + (LLEGA.y - 7),
      'class': 'dc-flecha', 'data-flecha': '' }, P.caminos);

    /* ── «bájele la exigencia» ── */
    P.nota = A.el('g', { 'data-nota': '' }, svg);
    A.el('rect', { x: NOTA.x0, y: NOTA.y0, width: NOTA.x1 - NOTA.x0, height: NOTA.y1 - NOTA.y0, rx: 4, 'class': 'dc-papel' }, P.nota);
    texto(A, P.nota, NOTA.x0 + 9, NOTA.y0 + 17, 'dc-tinta', 11, 'start', '«Bájele la exigencia,');
    texto(A, P.nota, NOTA.x0 + 9, NOTA.y0 + 33, 'dc-tinta', 11, 'start', 'para que no repruebe»');

    /* ── la boleta ── */
    P.boleta = A.el('g', { 'data-boleta': '' }, svg);
    A.el('rect', { x: BOLETA.x0, y: BOLETA.y0, width: BOLETA.x1 - BOLETA.x0, height: BOLETA.y1 - BOLETA.y0, rx: 3, 'class': 'dc-papel' }, P.boleta);
    texto(A, P.boleta, (BOLETA.x0 + BOLETA.x1) / 2, BOLETA.y0 + 13, 'dc-tinta dc-negrita', 11, 'middle', 'aprobó');

    /* ── las llaves del año que viene ── */
    var ab = B_.y + BAJA;
    P.llave2 = A.el('g', { 'data-llave': '2' }, svg);
    A.el('path', { d: 'M' + (LLAVE.x - LLAVE.tic) + ' ' + ab + ' L' + LLAVE.x + ' ' + ab + ' L' + LLAVE.x + ' ' + C_.y + ' L' + (LLAVE.x - LLAVE.tic) + ' ' + C_.y +
      ' M' + (LLAVE.x - LLAVE.tic) + ' ' + B_.y + ' L' + LLAVE.x + ' ' + B_.y, 'class': 'dc-llave', 'data-llave-trazo': '' }, P.llave2);
    P.falta = texto(A, P.llave2, LLAVE.txt, (ab + B_.y) / 2 + 4, 'am-rotulo', 10.5, 'start', 'lo que le faltó');
    P.falta.setAttribute('data-tramo', 'falta');
    P.nuevo2 = texto(A, P.llave2, LLAVE.txt, (B_.y + C_.y) / 2 + 4, 'am-rotulo', 10.5, 'start', 'lo nuevo');
    P.nuevo2.setAttribute('data-tramo', 'nuevo');
    P.llave1 = A.el('g', { 'data-llave': '1' }, svg);
    A.el('path', { d: 'M' + (LLAVE.x - LLAVE.tic) + ' ' + B_.y + ' L' + LLAVE.x + ' ' + B_.y + ' L' + LLAVE.x + ' ' + C_.y + ' L' + (LLAVE.x - LLAVE.tic) + ' ' + C_.y,
      'class': 'dc-llave', 'data-llave-trazo': '' }, P.llave1);
    texto(A, P.llave1, LLAVE.txt, (B_.y + C_.y) / 2 + 4, 'am-rotulo', 10.5, 'start', 'lo nuevo').setAttribute('data-tramo', 'nuevo');

    /* ── Brayan: una envoltura para verse y dos juegos para moverse, uno
       para el lado y otro para subir (una pieza tiene una sola demora). El
       primer juego lo sube al destino bajado y, en el paso 5, lo devuelve al
       año pasado sin que se le vea; el segundo lo sube al destino de verdad. ── */
    P.ve = A.el('g', { 'data-brayan-ve': '' }, svg);
    P.ve.style.setProperty('--otra-vez', OTRA_VEZ + 'ms');
    /* tres tramos por juego: hasta la pared, arriba y encima del año */
    P.tramo = { a: [], b: [] };
    var padre = P.ve;
    ['a', 'b'].forEach(function (j) {
      ['pared', 'sube', 'encima'].forEach(function (k) {
        padre = A.el('g', { 'class': 'dc-paso', 'data-brayan-tramo': j + '-' + k }, padre);
        P.tramo[j].push(padre);
      });
    });
    brayan(A, padre);

    /* ── el cuaderno ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUAD.x0, y: CUAD.y0, width: CUAD.x1 - CUAD.x0, height: CUAD.y1 - CUAD.y0, rx: 5, 'class': 'dc-papel' }, P.cuaderno);
    texto(A, P.cuaderno, CUAD.x0 + 9, CUAD.y0 + 16, 'dc-tinta', 10.5, 'start', 'Un alumno al que le cuesta:').setAttribute('data-pide', '');
    A.el('path', { d: 'M' + (CUAD.x0 + 9) + ' ' + (CUAD.y0 + 27) + ' L' + (CUAD.x1 - 9) + ' ' + (CUAD.y0 + 27), 'class': 'dc-raya', 'data-raya': '' }, P.cuaderno);
    texto(A, P.cuaderno, CUAD.x0 + 9, CUAD.y0 + 44, 'dc-tinta', 10.5, 'start', 'El camino que le cambio:').setAttribute('data-pide', '');
    A.el('path', { d: 'M' + (CUAD.x0 + 9) + ' ' + (CUAD.y0 + 55) + ' L' + (CUAD.x1 - 9) + ' ' + (CUAD.y0 + 55), 'class': 'dc-raya', 'data-raya': '' }, P.cuaderno);
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* Al TERMINAR cada paso. */
  var ESTADOS = [
    { doc: false, hiloB: false, caminos: 'no', nota: false, bajo: false, banderaB: true, caja: false, brayan: 'A', boleta: false, llave2: false, llave1: false, cuaderno: false },
    { doc: true, hiloB: true, caminos: 'no', nota: false, bajo: false, banderaB: true, caja: false, brayan: 'A', boleta: false, llave2: false, llave1: false, cuaderno: false },
    { doc: true, hiloB: true, caminos: 'si', nota: false, bajo: false, banderaB: true, caja: false, brayan: 'A', boleta: false, llave2: false, llave1: false, cuaderno: false },
    { doc: true, hiloB: false, caminos: 'no', nota: true, bajo: true, banderaB: true, caja: true, brayan: 'bajo', boleta: true, llave2: false, llave1: false, cuaderno: false },
    { doc: true, hiloB: false, caminos: 'no', nota: false, bajo: true, banderaB: false, caja: true, brayan: 'bajo', boleta: false, llave2: true, llave1: false, cuaderno: false },
    { doc: true, hiloB: true, caminos: 'tenue', nota: false, bajo: false, banderaB: true, caja: false, brayan: 'B', boleta: false, llave2: false, llave1: true, cuaderno: false },
    { doc: true, hiloB: true, caminos: 'no', nota: false, bajo: false, banderaB: true, caja: false, brayan: 'B', boleta: false, llave2: false, llave1: true, cuaderno: true }
  ];

  /* Dónde está Brayan: en el año pasado, en su destino bajado o en el de
     verdad. Sube primero y después se corre: así se sube un escalón. */
  /* Lo que se corre cada tramo: [hasta la pared, arriba, encima del año]. */
  function tramos(alto) { return [BR.pared - BR.x, -alto, BR.enB - BR.pared]; }
  var QUIETO = [0, 0, 0];
  function donde(cual) {
    if (cual === 'bajo') return { a: tramos(BAJA), b: QUIETO };
    if (cual === 'B') return { a: QUIETO, b: tramos(H) };
    return { a: QUIETO, b: QUIETO };
  }
  /* dA y dB: cuándo arranca cada juego; sus tres tramos van uno tras otro,
     salvo el juego que se pide «junto»: ese mueve los tres a la vez (la
     vuelta a oscuras del paso 5, y lo que se pone de golpe). */
  function brayanEn(A, cual, dA, dB, juntos) {
    var p = donde(cual);
    ['a', 'b'].forEach(function (j) {
      var d0 = j === 'a' ? dA : dB, todos = juntos === true || juntos === j;
      P.tramo[j].forEach(function (n, i) {
        var v = p[j][i];
        A.mover(n, i === 1 ? 0 : v, i === 1 ? v : 0, 0, 1, todos ? d0 : d0 + PASO * i);
      });
    });
  }
  function todo() {
    var l = [P.doc, P.lineaB, P.lineaC, P.caja, P.bajaB, P.banderaB, P.caminos, P.flecha, P.nota, P.boleta, P.llave2, P.llave1,
      P.ve, P.cuaderno, P.falta, P.nuevo2].concat(P.tramo.a).concat(P.tramo.b);
    P.camino.forEach(function (c) { l.push(c.g, c.linea, c.t); });
    return l;
  }
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.ver(P.doc, s.doc, 0);
      A.ver(P.lineaC, s.doc, 0);
      A.trazar(P.lineaC, s.doc, 0);
      A.ver(P.lineaB, s.hiloB, 0);
      A.trazar(P.lineaB, s.hiloB, 0);
      P.caminos.classList.toggle('dc-tenue', s.caminos === 'tenue');
      A.ver(P.caminos, s.caminos !== 'no', 0);
      P.camino.forEach(function (c) {
        A.ver(c.g, s.caminos !== 'no', 0);
        A.ver(c.linea, s.caminos !== 'no', 0);
        A.trazar(c.linea, s.caminos !== 'no', 0);
        A.ver(c.t, s.caminos !== 'no', 0);
      });
      A.ver(P.flecha, s.caminos !== 'no', 0);
      A.ver(P.nota, s.nota, 0);
      A.mover(P.bajaB, 0, s.bajo ? BAJA : 0, 0, 1, 0);
      A.ver(P.banderaB, s.banderaB, 0);
      A.ver(P.caja, s.caja, 0);
      brayanEn(A, s.brayan, 0, 0, true);
      A.ver(P.ve, true, 0);
      P.ve.classList.remove('dc-otra-vez');
      A.ver(P.boleta, s.boleta, 0);
      A.ver(P.llave2, s.llave2, 0);
      A.ver(P.falta, s.llave2, 0);
      A.ver(P.nuevo2, s.llave2, 0);
      A.ver(P.llave1, s.llave1, 0);
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo se cuentan cada vez que se ENTRA en ellos,
       también volviendo con «Atrás»; el 0 se pinta siempre. */
    if (n >= 1 && !entra(n)) return;
    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 1) {
      /* el documento, y un hilo de él a cada destino */
      base(A, ESTADOS[0]);
      A.ver(P.doc, true, T1.doc);
      A.ver(P.lineaB, true, T1.lineaB);
      A.trazar(P.lineaB, true, T1.lineaB);
      A.ver(P.lineaC, true, T1.lineaC);
      A.trazar(P.lineaC, true, T1.lineaC);
      return;
    }
    if (n === 2) {
      /* los cuatro caminos, uno tras otro, todos al mismo destino */
      base(A, ESTADOS[1]);
      A.ver(P.caminos, true, T2.primero);
      P.camino.forEach(function (c, i) {
        var t = T2.primero + T2.cada * i;
        A.ver(c.g, true, t);
        A.ver(c.linea, true, t);
        A.trazar(c.linea, true, t);
        A.ver(c.t, true, t + T2.rotulo);
      });
      A.ver(P.flecha, true, T2.flecha);
      return;
    }
    if (n === 3) {
      /* le bajan el destino: se suelta del documento, baja medio año y
         Brayan llega sin subirlo entero */
      base(A, ESTADOS[2]);
      A.ver(P.caminos, false, T3.sale);
      P.camino.forEach(function (c) { A.ver(c.g, false, T3.sale); });
      A.ver(P.flecha, false, T3.sale);
      A.ver(P.lineaB, false, T3.sale);
      A.ver(P.nota, true, T3.nota);
      A.mover(P.bajaB, 0, BAJA, 0, 1, T3.baja);
      A.ver(P.caja, true, T3.caja);
      brayanEn(A, 'bajo', T3.camina, 0);
      A.ver(P.boleta, true, T3.boleta);
      return;
    }
    if (n === 4) {
      /* el año que viene: el destino de arriba está donde siempre */
      base(A, ESTADOS[3]);
      A.ver(P.nota, false, T4.sale);
      A.ver(P.boleta, false, T4.sale);
      A.ver(P.banderaB, false, T4.sale);
      A.ver(P.llave2, true, T4.falta);
      A.ver(P.falta, true, T4.falta);
      A.ver(P.nuevo2, true, T4.nuevo);
      return;
    }
    if (n === 5) {
      /* otra vez el mismo año, sin bajarle nada: el destino vuelve a su
         sitio, Brayan vuelve a empezar y sube el año entero */
      base(A, ESTADOS[4]);
      A.ver(P.llave2, false, T5.sale);
      A.ver(P.caja, false, T5.sale);
      /* se apaga y se vuelve a encender (con «reducir movimiento», no: llega) */
      if (!A.quieto()) {
        P.ve.style.setProperty('--d', T5.sale + 'ms');
        P.ve.getBoundingClientRect();
        P.ve.classList.add('dc-otra-vez');
      }
      A.mover(P.bajaB, 0, 0, 0, 1, T5.vuelve);
      A.ver(P.banderaB, true, T5.vuelve);
      deGolpe(A, P.camino.map(function (c) { return c.linea; }), function () {
        P.caminos.classList.add('dc-tenue');
        P.camino.forEach(function (c) { A.trazar(c.linea, true, 0); });
      });
      A.ver(P.caminos, true, T5.caminos);
      P.camino.forEach(function (c) {
        A.ver(c.g, true, T5.caminos);
        A.ver(c.linea, true, T5.caminos);
        A.ver(c.t, true, T5.caminos);
      });
      A.ver(P.flecha, true, T5.caminos);
      A.ver(P.lineaB, true, T5.lineaB);
      A.trazar(P.lineaB, true, T5.lineaB);
      /* el primer juego vuelve de golpe, a oscuras; el segundo sube */
      brayanEn(A, 'B', T5.vuelve, T5.camina, 'a');
      A.ver(P.llave1, true, T5.llave);
      return;
    }
    /* el 6: el cuaderno */
    base(A, ESTADOS[5]);
    A.ver(P.caminos, false, T6.sale);
    P.camino.forEach(function (c) { A.ver(c.g, false, T6.sale); });
    A.ver(P.flecha, false, T6.sale);
    A.ver(P.cuaderno, true, T6.cuaderno);
  }

  var FRASES = [
    'Brayan está aquí. Este año tiene que llegar hasta allá, y el que viene, más arriba. ¿Qué parte de ese viaje decide usted?',
    'A dónde tiene que llegar cada año no lo decide usted: lo fija el documento. Y el maestro del año que viene, tampoco.',
    'El camino sí es suyo: ' + CAMINOS.slice(0, 3).join(', ') + ', ' + CAMINOS[3] + '. Los cuatro llegan al mismo destino.',
    'Le sugieren bajarle la exigencia, «para que no repruebe». Su destino baja, Brayan llega y la boleta dice que aprobó.',
    'El año que viene, su destino está donde siempre. Le toca subir lo que le faltó, y además lo nuevo.',
    'Con otro camino, el destino no se mueve y Brayan llega. El año que viene sube lo nuevo, como los demás.',
    'Cambie el camino, nunca el destino. Piense en un alumno al que le cuesta, y anote qué camino le cambiaría.'
  ];
  var BOTONES = ['📘 ¿Quién lo fija?', '🧭 ¿Y el camino?', '⬇️ Si se lo bajan', '🗓️ El año que viene', '🔁 Otro camino', '📝 Su alumno', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['?', 'qué parte del viaje decide usted'],
    ['2', 'destinos: los fija el documento'],
    ['4', 'caminos, un solo destino'],
    ['½', 'del camino subió, y aprobó'],
    ['1½', 'años de camino en uno solo'],
    ['1', 'año de camino, como los demás'],
    ['?', 'qué camino le cambiaría']
  ];

  AnimacionMision.montar('#amDestino', {
    vista: [ANCHO, ALTO],
    describe: 'Una escalera de tres años: el año pasado, este año y el año que viene. A dónde llega cada año lo fija el documento; ' +
      'el camino lo elige el maestro: ' + CAMINOS.join(', ') + '. A Brayan le bajan el destino, llega y aprueba, ' +
      'pero el año que viene le toca subir lo que le faltó y lo nuevo. Con otro camino, sube lo de un año, como los demás.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
