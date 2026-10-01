/* ============================================================
   Animación de «Aspectos Cívicos de Honduras» (Ruta de la Patria)
   ------------------------------------------------------------
   La historia: en el acto del lunes le tocó a Marvin decir qué son las
   cinco estrellas de la Bandera, y dijo «los cinco departamentos», con
   toda seguridad. Nadie lo corrigió, y el grado entero se lo repitió así
   hasta el examen de septiembre. Las estrellas no cuentan departamentos:
   cuentan países.

   Lo que se dibuja: la Bandera en su asta, con Marvin al lado, y las
   cinco estrellas en fila. Cada estrella va a uno de los cinco países;
   los cinco se juntan en la antigua Federación de Centroamérica, después
   se separan, y las estrellas vuelven juntas a la Bandera.

   ⚠️ La Bandera es el emoji 🇭🇳, que la trae completa. Aquí no se dibuja
   una bandera: un símbolo patrio se muestra completo o no se muestra.
   Las cinco estrellas van en FILA, como se cuentan, y no en X como en la
   Bandera: la misión dice que son los cinco países, no cuál estrella es
   de cuál, y una estrella del centro que cayera en Honduras lo afirmaría.

   ⚠️ Lo que NO se dice, y a propósito: cuántos departamentos tiene
   Honduras (lo pregunta la prueba), ni nada de los colores, las franjas,
   el Escudo, el Himno o las fechas. Tampoco la palabra «unión»: la prueba
   pide completar «Paladín de la ___ Centroamericana».

   ⚠️ Una pieza tiene una sola demora. Cada tarjeta va en dos envolturas
   (aparecer y moverse), y cada estrella en la suya.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amEstrellas')) return;

  var ANCHO = 320, ALTO = 204;

  /* ── el dibujo ─────────────────────────────────────────────── */
  var SUELO = 192, SUELO_FIN = 176;
  /* El asta y la Bandera en lo alto */
  var ASTA = { x: 22, y: 20, ancho: 3.5 };
  var BANDERA = { x: ASTA.x + ASTA.ancho + 1, y: 56, tam: 38 };
  /* Las cinco estrellas, en fila al lado de la Bandera */
  var FILA = { x: 100, paso: 15, y: 40 };
  var R_EST = 6.2, R_INT = 2.6;
  /* Marvin */
  var MX = 86;
  /* Los globos: la punta, justo encima de la cabeza de Marvin */
  var GLOBO = { cx: MX, abajo: 134, punta: 140 };
  var RENGLON = 14;
  /* Los cinco países: tarjetas en columna, separadas o juntas */
  var PAISES = ['Guatemala', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica'];
  var CARTA = { x: 196, ancho: 110, alto: 24 };
  var SEPARADAS = [22, 55, 88, 121, 154];
  var JUNTAS = [40, 64, 88, 112, 136];
  var MARCO = { x: 190, y: 34, ancho: 122, alto: 132 };

  /* ── el reloj de la escena ──────────────────────────────────── */
  var T1 = { tacha: 200, carta: 700, paso: 450, vuela: 250, aro: 3400 };
  var T2 = { junta: 300, marco: 1300 };
  var T3 = { separa: 500 };
  var T4 = { vuelve: 300, paso: 180, rotulo: 1600 };
  var T5 = { dice: 300 };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* Una estrella de cinco puntas, con la punta hacia arriba */
  function estrella(A, padre, cx, cy, atributos) {
    var pts = [];
    for (var k = 0; k < 10; k++) {
      var r = k % 2 ? R_INT : R_EST, a = k * Math.PI / 5;
      pts.push(r2(cx + Math.sin(a) * r) + ' ' + r2(cy - Math.cos(a) * r));
    }
    var at = { d: 'M' + pts.join(' L') + ' Z', 'class': 'et-estrella' };
    for (var c in atributos) at[c] = atributos[c];
    return A.el('path', at, padre);
  }

  /* Un globo con la punta hacia abajo, hacia la cabeza de Marvin */
  function globo(A, padre, ancho, lineas, k) {
    var alto = 8 + lineas.length * RENGLON;
    var cx = GLOBO.cx, x0 = cx - ancho / 2, x1 = cx + ancho / 2, y1 = GLOBO.abajo, y0 = y1 - alto;
    A.el('path', { d: 'M' + (x0 + 5) + ' ' + y0 + ' L' + (x1 - 5) + ' ' + y0 + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + 5) +
      ' L' + x1 + ' ' + (y1 - 5) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - 5) + ' ' + y1 + ' L' + (cx + 5) + ' ' + y1 +
      ' L' + cx + ' ' + GLOBO.punta + ' L' + (cx - 5) + ' ' + y1 + ' L' + (x0 + 5) + ' ' + y1 + ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - 5) +
      ' L' + x0 + ' ' + (y0 + 5) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + 5) + ' ' + y0 + ' Z',
      'class': 'et-globo', 'data-globo-caja': k }, padre);
    return lineas.map(function (l, i) {
      var t = texto(A, padre, cx, y0 + 14 + i * RENGLON, 'et-letra', 11, 'middle', l);
      t.setAttribute('data-linea', i);
      return t;
    });
  }

  /* Marvin: uniforme de la escuela, camisa blanca y pantalón azul */
  function marvin(A, padre) {
    var g = A.el('g', { 'data-persona': 'M' }, padre);
    var x = MX;
    A.el('rect', { x: x - 6, y: SUELO - 13, width: 5, height: 13, rx: 1.5, 'class': 'et-pantalon' }, g);
    A.el('rect', { x: x + 1, y: SUELO - 13, width: 5, height: 13, rx: 1.5, 'class': 'et-pantalon' }, g);
    A.el('rect', { x: x - 9.5, y: SUELO - 29, width: 19, height: 19, rx: 3.5, 'class': 'et-camisa', 'data-torso': '' }, g);
    A.el('path', { d: 'M' + (x - 8) + ' ' + (SUELO - 26) + ' L' + (x - 11) + ' ' + (SUELO - 13), 'class': 'et-brazo' }, g);
    A.el('path', { d: 'M' + (x + 8) + ' ' + (SUELO - 26) + ' L' + (x + 11) + ' ' + (SUELO - 13), 'class': 'et-brazo' }, g);
    A.el('circle', { cx: x, cy: SUELO - 37, r: 9, 'class': 'et-piel', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 9) + ' ' + (SUELO - 38) + ' Q' + (x - 8) + ' ' + (SUELO - 48) + ' ' + x + ' ' + (SUELO - 47) +
      ' Q' + (x + 8) + ' ' + (SUELO - 48) + ' ' + (x + 9) + ' ' + (SUELO - 38) + ' Q' + x + ' ' + (SUELO - 43) + ' ' + (x - 9) + ' ' + (SUELO - 38) + ' Z', 'class': 'et-pelo' }, g);
    A.el('circle', { cx: x - 3.2, cy: SUELO - 36, r: 1.2, 'class': 'et-ojo' }, g);
    A.el('circle', { cx: x + 3.2, cy: SUELO - 36, r: 1.2, 'class': 'et-ojo' }, g);
    return g;
  }

  /* Dónde queda la estrella k sobre la tarjeta de su país. La de la
     punta derecha va al de arriba, y así hacia la izquierda: al salir en
     ese orden, ninguna estrella pasa por encima de las que esperan en la
     fila, y la última (la de más a la izquierda) baja al de abajo por
     fuera del globo de Marvin. */
  function paisDe(k) { return PAISES.length - 1 - k; }
  function sobreCarta(k, juntas) {
    var y = (juntas ? JUNTAS : SEPARADAS)[paisDe(k)];
    return { dx: CARTA.x + 10.5 - (FILA.x + k * FILA.paso), dy: y + CARTA.alto / 2 - FILA.y };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    A.el('path', { d: 'M0 ' + SUELO + ' L' + SUELO_FIN + ' ' + SUELO, 'class': 'et-suelo', 'data-suelo': '' }, svg);

    /* ── el asta y la Bandera ── */
    var asta = A.el('g', { 'data-asta': '' }, svg);
    A.el('rect', { x: ASTA.x, y: ASTA.y, width: ASTA.ancho, height: SUELO - ASTA.y, 'class': 'et-asta', 'data-asta-palo': '' }, asta);
    A.el('circle', { cx: ASTA.x + ASTA.ancho / 2, cy: ASTA.y - 3, r: 3, 'class': 'et-perilla' }, asta);
    A.el('rect', { x: ASTA.x - 7, y: SUELO - 5, width: ASTA.ancho + 14, height: 5, rx: 1, 'class': 'et-asta' }, asta);
    var b = texto(A, svg, BANDERA.x, BANDERA.y, 'et-bandera', BANDERA.tam, 'start', '🇭🇳');
    b.setAttribute('data-bandera', '');
    b.setAttribute('aria-hidden', 'true');

    /* ── Marvin, y lo que dice ── */
    P.marvin = marvin(A, svg);
    P.mal = A.el('g', { 'data-dicho': 'mal' }, svg);
    var malLineas = globo(A, P.mal, 100, ['Por los cinco', 'departamentos'], 'mal');
    /* la palabra que estaba mal, tachada encima de la otra */
    P.malBien = malLineas[1];
    P.tachada = texto(A, P.mal, GLOBO.cx, Number(malLineas[1].getAttribute('y')), 'et-letra et-tachada', 11, 'middle', 'departamentos');
    P.tachada.setAttribute('data-tachada', '');
    P.bien = A.el('g', { 'data-dicho': 'bien' }, svg);
    globo(A, P.bien, 112, ['Por las cinco', 'naciones de la', 'antigua Federación'], 'bien');

    /* ── el marco de la Federación, detrás de las tarjetas ── */
    P.marco = A.el('g', { 'data-marco': '' }, svg);
    A.el('rect', { x: MARCO.x, y: MARCO.y, width: MARCO.ancho, height: MARCO.alto, rx: 7, 'class': 'et-marco', 'data-marco-caja': '' }, P.marco);
    texto(A, P.marco, MARCO.x + MARCO.ancho / 2, 15, 'am-rotulo', 10, 'middle', 'la antigua Federación').setAttribute('data-marco-txt', '0');
    texto(A, P.marco, MARCO.x + MARCO.ancho / 2, 27, 'am-rotulo', 10, 'middle', 'de Centroamérica').setAttribute('data-marco-txt', '1');

    /* ── los cinco países ── */
    P.cartas = PAISES.map(function (nombre, i) {
      var va = A.el('g', { 'data-pais': nombre }, svg);
      var mueve = A.el('g', { 'data-pais-mueve': '' }, va);
      var y = SEPARADAS[i];
      A.el('rect', { x: CARTA.x, y: y, width: CARTA.ancho, height: CARTA.alto, rx: 4, 'class': 'et-carta', 'data-pais-caja': '' }, mueve);
      texto(A, mueve, CARTA.x + 22, y + 16.5, 'et-letra', 11, 'start', nombre).setAttribute('data-pais-nombre', '');
      return { va: va, mueve: mueve };
    });
    /* el aro de Honduras: una de las cinco es ella */
    var h = PAISES.indexOf('Honduras');
    P.aro = A.el('rect', { x: CARTA.x - 5, y: SEPARADAS[h] - 5, width: CARTA.ancho + 10, height: CARTA.alto + 10, rx: 8, 'class': 'et-aro', 'data-aro': '' }, svg);

    /* ── las cinco estrellas, en fila ── */
    P.estrellas = PAISES.map(function (nombre, i) {
      var vuela = A.el('g', { 'data-estrella': i }, svg);
      estrella(A, vuela, FILA.x + i * FILA.paso, FILA.y, { 'data-estrella-forma': '' });
      return vuela;
    });
    P.rotulo = texto(A, svg, FILA.x + 2 * FILA.paso, FILA.y + 22, 'am-rotulo', 9.5, 'middle', 'las cinco estrellas');
    P.rotulo.setAttribute('data-fila-txt', '');
  }

  /* ── los estados ───────────────────────────────────────────── */

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    var lista = [P.mal, P.malBien, P.tachada, P.bien, P.marco, P.aro, P.rotulo];
    P.cartas.forEach(function (c) { lista.push(c.va, c.mueve); });
    return lista.concat(P.estrellas);
  }

  /* El estado al TERMINAR cada paso. cartas: se ven los países; juntas:
     las tarjetas pegadas, dentro del marco; estrellas: en la fila de la
     Bandera («casa») o una sobre cada país; globo: el que dice Marvin. */
  var ESTADOS = [
    { cartas: false, juntas: false, estrellas: 'casa', marco: false, aro: false, globo: 'mal', tacha: false },
    { cartas: true, juntas: false, estrellas: 'cartas', marco: false, aro: true, globo: 'mal', tacha: true },
    { cartas: true, juntas: true, estrellas: 'cartas', marco: true, aro: false, globo: null, tacha: false },
    { cartas: true, juntas: false, estrellas: 'cartas', marco: false, aro: false, globo: null, tacha: false },
    { cartas: true, juntas: false, estrellas: 'casa', marco: false, aro: false, globo: null, tacha: false },
    { cartas: true, juntas: false, estrellas: 'casa', marco: false, aro: false, globo: 'bien', tacha: false }
  ];

  function aCarta(A, i, juntas, demora) {
    var p = sobreCarta(i, juntas);
    A.mover(P.estrellas[i], p.dx, p.dy, 0, 1, demora);
  }
  function mueveCarta(A, i, juntas, demora) {
    A.mover(P.cartas[i].mueve, 0, juntas ? JUNTAS[i] - SEPARADAS[i] : 0, 0, 1, demora);
  }

  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.ver(P.mal, s.globo === 'mal', 0);
      A.ver(P.malBien, !s.tacha, 0);
      A.ver(P.tachada, s.tacha, 0);
      A.ver(P.bien, s.globo === 'bien', 0);
      A.ver(P.marco, s.marco, 0);
      A.ver(P.aro, s.aro, 0);
      A.ver(P.rotulo, s.estrellas === 'casa', 0);
      P.cartas.forEach(function (c, i) { A.ver(c.va, s.cartas, 0); mueveCarta(A, i, s.juntas, 0); });
      P.estrellas.forEach(function (e, i) {
        A.ver(e, true, 0);
        if (s.estrellas === 'casa') A.mover(e, 0, 0, 0, 1, 0); else aCarta(A, i, s.juntas, 0);
      });
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
      A.ver(P.bien, true, T5.dice);
      return;
    }
    if (n === 1) {
      base(A, ESTADOS[0]);
      /* la palabra que estaba mal se tacha, y cada estrella va a su país */
      A.ver(P.malBien, false, T1.tacha);
      A.ver(P.tachada, true, T1.tacha);
      A.ver(P.rotulo, false, T1.carta + T1.vuela);
      P.cartas.forEach(function (c, i) {
        A.ver(c.va, true, T1.carta + i * T1.paso);
        aCarta(A, paisDe(i), false, T1.carta + i * T1.paso + T1.vuela);
      });
      A.ver(P.aro, true, T1.aro);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      /* los cinco se juntan, cada uno con su estrella, y el marco los
         encierra: eran un solo país */
      A.ver(P.mal, false, 0);
      A.ver(P.aro, false, 0);
      P.cartas.forEach(function (c, i) { mueveCarta(A, i, true, T2.junta); aCarta(A, paisDe(i), true, T2.junta); });
      A.ver(P.marco, true, T2.marco);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      /* el marco se va y cada uno queda por su lado */
      A.ver(P.marco, false, 0);
      P.cartas.forEach(function (c, i) { mueveCarta(A, i, false, T3.separa); aCarta(A, paisDe(i), false, T3.separa); });
      return;
    }
    /* el 4: las estrellas vuelven juntas a la Bandera. Llega primero la
       de la izquierda, así la siguiente nunca pasa por encima de la que
       ya llegó. */
    base(A, ESTADOS[3]);
    P.estrellas.forEach(function (e, i) { A.mover(e, 0, 0, 0, 1, T4.vuelve + i * T4.paso); });
    A.ver(P.rotulo, true, T4.rotulo);
  }

  var FRASES = [
    'Marvin dijo que las cinco estrellas son «los cinco departamentos». No son departamentos: son países. Antes de tocar, piensa: ¿cuáles cinco?',
    'Una estrella por cada país: Guatemala, El Salvador, Honduras, Nicaragua y Costa Rica. Y una de las cinco es Honduras.',
    'Los cinco formaron juntos la antigua Federación de Centroamérica: eran un solo país.',
    'Después se separaron, y hoy son cinco países, cada uno por su lado.',
    'La Bandera de Honduras lleva las cinco estrellas juntas: es el deseo de que vuelvan a ser un solo país.',
    'Así lo puede decir Marvin el próximo lunes. ¿Y tú qué le dirías a quien diga «departamentos», sin hacerlo quedar mal?'
  ];
  var BOTONES = ['⭐ ¿Cuáles cinco?', '🤝 Juntos', '↔️ Se separaron', '🇭🇳 A la Bandera', '🗣️ Bien dicho', '↺ Empezar otra vez'];
  var MARCADOR = [['5', 'estrellas en la Bandera'], ['5', 'países, una estrella cada uno'], ['1', 'Federación con los cinco'],
    ['5', 'países, cada uno por su lado'], ['5', 'estrellas juntas en la Bandera'], ['5', 'naciones, no departamentos']];

  AnimacionMision.montar('#amEstrellas', {
    vista: [ANCHO, ALTO],
    describe: 'La Bandera de Honduras en su asta, con Marvin al lado, y las cinco estrellas en fila. Cada estrella va a uno de los cinco países: Guatemala, El Salvador, Honduras, Nicaragua y Costa Rica. Juntos formaron la antigua Federación de Centroamérica, después se separaron, y la Bandera lleva las cinco estrellas juntas.',
    pasos: 6,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
