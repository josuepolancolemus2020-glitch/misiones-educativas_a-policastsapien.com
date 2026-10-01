/* ============================================================
   M.E.T.A.S · Mi Primer Programa Completo · Los votos de la urna
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Kenia: se
   sabía las piezas, le pidieron un programa que contara los votos del
   Gobierno Escolar, y se quedó mirando la hoja en blanco. Sabía todas las
   partes y no sabía por dónde empezar la cosa entera. Lo que se ve aquí es
   por dónde: primero se hace a mano, y cada cosa que hizo la mano se
   vuelve una línea de la hoja. El aparato (botones, frase, marcador) vive
   en js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Arriba, la urna con siete papeletas, la mesa donde se mira cada una, la
   fila de las ya contadas y la tabla donde Kenia hace sus rayas. Abajo, la
   hoja de Kenia, con sus renglones y las dos cajitas.

     0  la urna llena y la hoja en blanco: ¿por dónde se empieza?;
     1  a mano: saca una papeleta, mira dónde está la X y hace una raya en
        esa planilla; siete veces. Quedan Sol 4, Luna 3;
     2  lo que hizo siete veces se escribe una vez: REPETIR 7 VECES, y
        adentro, SACA UNA PAPELETA;
     3  las rayas eran para no olvidar cuántos llevaba cada planilla: dos
        cajitas que empiezan en 0;
     4  lo que miró antes de cada raya decide en qué cajita va el voto: SI…
        SINO;
     5  arriba, cuándo se cuenta; abajo, mostrar y terminar;
     6  ahora lo hace el programa, con las mismas siete papeletas: la flecha
        va línea por línea y las cajitas terminan en Sol 4, Luna 3;
     7  la pregunta es del alumno.

   Siete decisiones, y ninguna es de adorno:

   1. ⚠️ **El programa sale de lo que hizo la mano, y se ve salir.** Cada
      paso marca a la vez lo que hizo Kenia (las siete papeletas, la tabla,
      la X) y las líneas que eso escribe en la hoja. Las líneas no aparecen
      de arriba abajo: aparecen en el orden en que se descubren, cada una en
      su renglón, y la hoja queda leyéndose de arriba abajo al final.
   2. ⚠️ **Lo que cuenta el programa no se escribe: se cuenta.** Las
      papeletas dicen su voto con la X en una casilla, la tabla lleva una
      raya por papeleta y las cajitas suben cuando la flecha pasa por la
      línea que les suma. La sonda lee la X de cada papeleta en el dibujo,
      corre ella misma el programa que está escrito en la hoja y compara.
   3. ⚠️ **Lo que va debajo no se regala.** No se nombra ninguna pieza (ni
      bucle, ni condicional, ni variable, ni evento): eso lo enseñan las
      tarjetas de abajo y lo pregunta la prueba. Tampoco se dice para qué
      sirve la línea de arriba ni la de TERMINA: se ven en su sitio, como en
      el pseudocódigo de la misión.
   4. **El programa es completo, como lo pide la misión**: empieza con
      CUANDO, prepara sus cajitas en 0, repite con su corchete que abre y
      su corchete que cierra, decide dentro, muestra y termina. Una hoja sin
      esas líneas enseñaría uno de los errores comunes de la ficha.
   5. **Dos números que cambian en el mismo sitio no se cruzan**: en las
      cajitas, el número de antes se va antes de que llegue el nuevo.
   6. **Nada se dice solo con color**: el voto es una X sobre un dibujo
      (un sol o una luna), lo marcado lleva su recuadro de raya cortada, y
      lo que ya leyó el programa, su aro.
   7. ⚠️ **Una pieza tiene una sola demora.** La papeleta va de la urna a
      la mesa y de la mesa a la fila, y crece y se achica: son cuatro
      piezas, una dentro de otra. La flecha de la hoja baja y sube muchas
      veces: una pieza por cada movimiento. Y cada número de una cajita
      que aparece y se va lleva dos.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amUrna')) return;

  var ANCHO = 320, ALTO = 288;

  /* Los votos, en el orden en que salen de la urna. S es Sol y L es Luna. */
  var VOTOS = ['S', 'L', 'S', 'S', 'L', 'S', 'L'];
  var NOMBRE = { S: 'SOL', L: 'LUNA' };

  /* ── arriba: la urna, la mesa, la fila y la tabla ─────────────── */
  var URNA = { x: 32, y: 44 };          // la boca de la urna
  var MESA = { x: 100, y: 66 };         // donde se mira la papeleta
  var FILA_Y = 16;
  function filaX(i) { return 110 + i * 31; }
  var CHICA = 0.46;                      // la papeleta en la urna y en la fila
  var CASILLA = { S: -13, L: 13 };       // dónde va cada casilla en la papeleta
  var TABLA = { x0: 150, x1: 312, y0: 36, y1: 92, medio: 231, cabeza: 52 };
  function rayaX(voto, k) { return (voto === 'S' ? 168 : 249) + k * 9; }

  /* ── abajo: la hoja ───────────────────────────────────────────── */
  var HOJA = { x: 6, y: 112, w: 308, h: 170 };
  function filaHoja(k) { return 143 + k * 14; }   // la línea de base del renglón k
  var COD_X = 30, SANGRIA = 14, FLECHA_X = 24;
  var LETRA_COD = 10.5, ANCHO_LETRA = 6.3;
  /* El programa, renglón por renglón, y en qué paso aparece cada uno. */
  var LINEAS = [
    { t: 'CUANDO SE CIERRE LA URNA', s: 0, paso: 5 },
    { t: 'GUARDA 0 EN SOL', s: 0, paso: 3 },
    { t: 'GUARDA 0 EN LUNA', s: 0, paso: 3 },
    { t: 'REPETIR 7 VECES [', s: 0, paso: 2 },
    { t: 'SACA UNA PAPELETA', s: 1, paso: 2 },
    { t: 'SI DICE SOL → SUMA 1 A SOL', s: 1, paso: 4 },
    { t: 'SINO → SUMA 1 A LUNA', s: 1, paso: 4 },
    { t: ']', s: 0, paso: 2 },
    { t: 'MUESTRA SOL Y LUNA', s: 0, paso: 5 },
    { t: 'TERMINA', s: 0, paso: 5 }
  ];
  var CAJA = { x: 228, w: 78, h: 22, S: 134, L: 162 };   // las dos cajitas

  /* ── el reloj ─────────────────────────────────────────────────── */
  /* Paso 1, a mano: una papeleta por segundo. */
  var P0 = 300, PER = 1000, LLEGA = 600, RAYA = 650, SALE = 950;
  function tSale(i) { return P0 + i * PER; }
  /* Pasos 2 a 5: los renglones se escriben uno detrás de otro. */
  var ESCRIBE = 350, ENTRE = 220;
  /* Paso 6: la flecha cambia de renglón cada MARCHA ms. */
  var MARCHA = 360, ARRANCA = 300;

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }

  /* Un sol y una luna: las dos planillas. Se distinguen por la forma. */
  function sol(A, padre, x, y, r) {
    var g = A.el('g', { 'class': 'mp-sol', 'data-icono': 'S' }, padre);
    for (var k = 0; k < 8; k++) {
      var a = k * Math.PI / 4;
      A.el('path', { d: 'M' + (x + Math.cos(a) * r * 1.35).toFixed(2) + ' ' + (y + Math.sin(a) * r * 1.35).toFixed(2) +
        ' L' + (x + Math.cos(a) * r * 1.9).toFixed(2) + ' ' + (y + Math.sin(a) * r * 1.9).toFixed(2), 'class': 'mp-rayo' }, g);
    }
    A.el('circle', { cx: x, cy: y, r: r, 'class': 'mp-disco' }, g);
    return g;
  }
  /* La luna es el círculo de afuera menos uno de adentro corrido a la
     derecha: los dos arcos van de un punto donde se cruzan al otro. Con el
     de adentro chico, la media luna sale gruesa y no se confunde con un
     paréntesis. */
  function luna(A, padre, x, y, r) {
    var g = A.el('g', { 'class': 'mp-luna', 'data-icono': 'L' }, padre);
    var cx = (x + 0.61 * r).toFixed(2), arriba = (y - 0.792 * r).toFixed(2), abajo = (y + 0.792 * r).toFixed(2);
    A.el('path', { d: 'M' + cx + ' ' + arriba + ' A' + r + ' ' + r + ' 0 1 0 ' + cx + ' ' + abajo +
      ' A' + (0.8 * r).toFixed(2) + ' ' + (0.8 * r).toFixed(2) + ' 0 1 1 ' + cx + ' ' + arriba + ' Z', 'class': 'mp-medialuna' }, g);
    return g;
  }

  /* Una papeleta, dibujada con su centro en (0, 0): dos casillas, el sol a
     la izquierda y la luna a la derecha, y la X en la que se votó. */
  function papeleta(A, padre, voto) {
    A.el('rect', { x: -28, y: -19, width: 56, height: 38, rx: 3, 'class': 'mp-papel' }, padre);
    A.el('rect', { x: -24, y: -12, width: 22, height: 22, rx: 2, 'class': 'mp-casilla', 'data-casilla': 'S' }, padre);
    A.el('rect', { x: 2, y: -12, width: 22, height: 22, rx: 2, 'class': 'mp-casilla', 'data-casilla': 'L' }, padre);
    sol(A, padre, CASILLA.S, -1, 4.2);
    luna(A, padre, CASILLA.L, -1, 5.2);
    var cx = CASILLA[voto];
    A.el('path', { d: 'M' + (cx - 7) + ' -8 L' + (cx + 7) + ' 6 M' + (cx + 7) + ' -8 L' + (cx - 7) + ' 6', 'class': 'mp-x', 'data-x': '' }, padre);
  }

  /* Un recuadro de raya cortada: lo que se marca en cada paso. */
  function marca(A, padre, x, y, w, h, que) {
    return A.el('rect', { x: x, y: y, width: w, height: h, rx: 4, 'class': 'mp-resalte', 'data-marca': que }, padre);
  }
  function anchoLinea(k) { return LINEAS[k].t.length * ANCHO_LETRA; }
  function xLinea(k) { return COD_X + LINEAS[k].s * SANGRIA; }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── la tabla de las rayas ─────────────────────────────── */
    P.tabla = A.el('g', { 'data-tabla': '' }, svg);
    A.el('rect', { x: TABLA.x0, y: TABLA.y0, width: TABLA.x1 - TABLA.x0, height: TABLA.y1 - TABLA.y0, rx: 6, 'class': 'mp-tabla' }, P.tabla);
    A.el('path', { d: 'M' + TABLA.medio + ' ' + TABLA.y0 + ' L' + TABLA.medio + ' ' + TABLA.y1 +
      ' M' + TABLA.x0 + ' ' + TABLA.cabeza + ' L' + TABLA.x1 + ' ' + TABLA.cabeza, 'class': 'mp-reja' }, P.tabla);
    sol(A, P.tabla, 166, 44, 3.4).setAttribute('data-cabeza', 'S');
    texto(A, P.tabla, 176, 48, 'am-letra', 10, 'start', 'Sol').setAttribute('data-columna', 'S');
    luna(A, P.tabla, 247, 44, 4.2).setAttribute('data-cabeza', 'L');
    texto(A, P.tabla, 257, 48, 'am-letra', 10, 'start', 'Luna').setAttribute('data-columna', 'L');
    P.rayas = [];
    var cuenta = { S: 0, L: 0 };
    VOTOS.forEach(function (v, i) {
      var k = cuenta[v]++;
      P.rayas.push(A.el('path', { d: 'M' + rayaX(v, k) + ' 60 L' + rayaX(v, k) + ' 85', 'class': 'mp-raya', 'data-raya': v, 'data-de': i + 1 }, svg));
    });

    /* ── la urna ───────────────────────────────────────────── */
    P.urna = A.el('g', { 'data-urna': '' }, svg);
    A.el('rect', { x: 8, y: 44, width: 48, height: 44, rx: 4, 'class': 'mp-urna' }, P.urna);
    A.el('rect', { x: 20, y: 43, width: 24, height: 3.4, rx: 1.2, 'class': 'mp-boca' }, P.urna);
    texto(A, P.urna, 32, 72, 'mp-urna-letra', 9, 'middle', 'URNA');

    /* lo que hace la mano, debajo de cada sitio */
    P.titulo = texto(A, svg, 6, 19, 'am-letra', 10, 'start', 'A mano:');
    P.titulo.setAttribute('data-titulo', 'mano');
    P.verbos = {
      saca: texto(A, svg, URNA.x, 106, 'am-rotulo', 10, 'middle', 'saca'),
      mira: texto(A, svg, MESA.x, 106, 'am-rotulo', 10, 'middle', 'mira la X'),
      raya: texto(A, svg, TABLA.medio, 106, 'am-rotulo', 10, 'middle', 'hace la raya')
    };
    Object.keys(P.verbos).forEach(function (k) { P.verbos[k].setAttribute('data-verbo', k); });

    /* ── las siete papeletas ───────────────────────────────── */
    P.papeletas = VOTOS.map(function (v, i) {
      var g = A.el('g', { 'data-papeleta': i + 1, 'data-voto': v }, svg);
      var base = A.el('g', { 'data-base': '' }, g);
      var ida = A.el('g', { 'class': 'mp-mueve', 'data-ida': '' }, base);
      var fila = A.el('g', { 'class': 'mp-mueve', 'data-a-fila': '' }, ida);
      var crece = A.el('g', { 'class': 'mp-mueve', 'data-crece': '' }, fila);
      var achica = A.el('g', { 'class': 'mp-mueve', 'data-achica': '' }, crece);
      papeleta(A, achica, v);
      return { g: g, base: base, ida: ida, fila: fila, crece: crece, achica: achica };
    });

    /* lo que el programa ya leyó: un aro alrededor de cada papeleta */
    P.leidas = VOTOS.map(function (v, i) {
      return A.el('rect', { x: filaX(i) - 14.5, y: FILA_Y - 11, width: 29, height: 22, rx: 5, 'class': 'mp-aro', 'data-leida': i + 1 }, svg);
    });

    /* ── la hoja ───────────────────────────────────────────── */
    A.el('rect', { x: HOJA.x, y: HOJA.y, width: HOJA.w, height: HOJA.h, rx: 6, 'class': 'mp-hoja', 'data-hoja': '' }, svg);
    texto(A, svg, 14, 127, 'am-letra', 10, 'start', 'La hoja de Kenia:').setAttribute('data-titulo', 'hoja');
    for (var r = 0; r < LINEAS.length; r++) {
      A.el('path', { d: 'M14 ' + (filaHoja(r) + 4) + ' L220 ' + (filaHoja(r) + 4), 'class': 'mp-renglon', 'data-renglon': r }, svg);
    }
    P.lineas = LINEAS.map(function (l, k) {
      var t = texto(A, svg, xLinea(k), filaHoja(k), 'mp-codigo', LETRA_COD, 'start', l.t);
      t.setAttribute('data-linea', k);
      return t;
    });

    /* las dos cajitas, con un número por cada valor que van a tener */
    P.cajitas = A.el('g', { 'data-cajitas': '' }, svg);
    P.valores = { S: [], L: [] };
    ['S', 'L'].forEach(function (v) {
      var y = CAJA[v];
      var g = A.el('g', { 'data-cajita': v }, P.cajitas);
      A.el('rect', { x: CAJA.x, y: y, width: CAJA.w, height: CAJA.h, rx: 5, 'class': 'mp-cajita' }, g);
      texto(A, g, CAJA.x + 8, y + 15, 'mp-codigo', LETRA_COD, 'start', NOMBRE[v]).setAttribute('data-nombre', '');
      var total = VOTOS.filter(function (x) { return x === v; }).length;
      for (var n = 0; n <= total; n++) {
        var llega = A.el('g', { 'class': 'mp-cifra', 'data-llega': n }, g);
        var t = texto(A, llega, CAJA.x + CAJA.w - 14, y + 16, 'am-digito mp-cifra', 13, 'middle', String(n));
        t.setAttribute('data-valor', n);
        P.valores[v].push({ llega: llega, t: t });
      }
    });

    /* ── lo que se marca en cada paso ───────────────────────── */
    P.marcas = {};
    var m2 = A.el('g', { 'data-paso-marca': 2 }, svg);
    marca(A, m2, filaX(0) - 18, 2, filaX(6) - filaX(0) + 36, 28, 'fila');
    marca(A, m2, URNA.x - 18, 95, 36, 15, 'saca');
    [3, 4, 7].forEach(function (k) { marca(A, m2, xLinea(k) - 5, filaHoja(k) - 10.5, anchoLinea(k) + 10, 14, 'linea-' + k); });
    P.marcas[2] = m2;
    var m3 = A.el('g', { 'data-paso-marca': 3 }, svg);
    marca(A, m3, TABLA.x0 - 4, TABLA.y0 - 4, TABLA.x1 - TABLA.x0 + 8, TABLA.y1 - TABLA.y0 + 7, 'tabla');
    marca(A, m3, CAJA.x - 4, CAJA.S - 4, CAJA.w + 8, CAJA.L - CAJA.S + CAJA.h + 8, 'cajitas');
    [1, 2].forEach(function (k) { marca(A, m3, xLinea(k) - 5, filaHoja(k) - 10.5, anchoLinea(k) + 10, 14, 'linea-' + k); });
    P.marcas[3] = m3;
    var m4 = A.el('g', { 'data-paso-marca': 4 }, svg);
    marca(A, m4, MESA.x - 29, 95, 58, 15, 'mira');
    VOTOS.forEach(function (v, i) {
      A.el('circle', { cx: filaX(i) + CASILLA[v] * CHICA, cy: FILA_Y - 0.5, r: 5.6, 'class': 'mp-resalte', 'data-marca': 'x-' + (i + 1) }, m4);
    });
    [5, 6].forEach(function (k) { marca(A, m4, xLinea(k) - 5, filaHoja(k) - 10.5, anchoLinea(k) + 10, 14, 'linea-' + k); });
    P.marcas[4] = m4;
    var m5 = A.el('g', { 'data-paso-marca': 5 }, svg);
    marca(A, m5, 4, 40, 56, 52, 'urna');
    [0, 8, 9].forEach(function (k) { marca(A, m5, xLinea(k) - 5, filaHoja(k) - 10.5, anchoLinea(k) + 10, 14, 'linea-' + k); });
    P.marcas[5] = m5;

    /* ── la flecha del programa: una pieza por cada vez que cambia de
       renglón, una dentro de otra ─────────────────────────────── */
    P.recorrido = recorrido();
    P.flecha = A.el('g', { 'data-flecha': '' }, svg);
    var paso = P.flecha;
    P.flechaPasos = [];
    for (var j = 1; j < P.recorrido.length; j++) {
      paso = A.el('g', { 'class': 'mp-flecha-paso', 'data-flecha-paso': j }, paso);
      P.flechaPasos.push(paso);
    }
    var fy = filaHoja(0) - 3.5;
    A.el('path', { d: 'M' + (FLECHA_X - 9) + ' ' + (fy - 5) + ' L' + FLECHA_X + ' ' + fy + ' L' + (FLECHA_X - 9) + ' ' + (fy + 5) + ' Z',
      'class': 'mp-flecha' }, paso);
  }

  /* Lo que hace el programa de la hoja, renglón por renglón: la lista de
     renglones por donde pasa la flecha, qué papeleta saca y a qué cajita le
     suma. Lo lee de LINEAS y de VOTOS: el mismo dibujo que se ve. */
  function recorrido() {
    var r = [{ k: 0 }, { k: 1 }, { k: 2 }, { k: 3 }];
    VOTOS.forEach(function (v, i) {
      r.push({ k: 4, saca: i });
      r.push({ k: 5 });
      if (v === 'S') r[r.length - 1].suma = 'S';
      else r.push({ k: 6, suma: 'L' });
    });
    r.push({ k: 7 }, { k: 8, muestra: true }, { k: 9 });
    return r;
  }
  function tFlecha(j) { return ARRANCA + j * MARCHA; }

  /* Pone de golpe, sin movimiento: así cada paso se vuelve a ver entero
     cada vez que se entra en él, también volviendo con «Atrás». */
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  /* Cada papeleta: en la urna (escondida) o ya en su sitio de la fila. */
  function papeletaEn(A, p, i, enFila) {
    A.mover(p.base, URNA.x, URNA.y, 0, 1, 0);
    A.mover(p.ida, enFila ? MESA.x - URNA.x : 0, enFila ? MESA.y - URNA.y : 0, 0, 1, 0);
    A.mover(p.fila, enFila ? filaX(i) - MESA.x : 0, enFila ? FILA_Y - MESA.y : 0, 0, 1, 0);
    A.mover(p.crece, 0, 0, 0, enFila ? 1 : CHICA, 0);
    A.mover(p.achica, 0, 0, 0, enFila ? CHICA : 1, 0);
    A.ver(p.g, enFila, 0);
  }

  /* Cuántos votos de cada planilla hay en las primeras `n` papeletas. */
  function cuentaHasta(n) {
    var c = { S: 0, L: 0 };
    for (var i = 0; i < n; i++) c[VOTOS[i]]++;
    return c;
  }

  function cajitasEn(A, c) {
    ['S', 'L'].forEach(function (v) {
      P.valores[v].forEach(function (o, n) {
        A.ver(o.llega, n === c[v], 0);
        A.ver(o.t, true, 0);
      });
    });
  }

  function todo() {
    var lista = [P.tabla, P.urna, P.titulo, P.cajitas, P.flecha]
      .concat(P.rayas, P.lineas, P.leidas, P.flechaPasos);
    Object.keys(P.verbos).forEach(function (k) { lista.push(P.verbos[k]); });
    Object.keys(P.marcas).forEach(function (k) { lista.push(P.marcas[k]); });
    P.papeletas.forEach(function (p) { lista.push(p.g, p.base, p.ida, p.fila, p.crece, p.achica); });
    ['S', 'L'].forEach(function (v) { P.valores[v].forEach(function (o) { lista.push(o.llega, o.t); }); });
    return lista;
  }

  /* El estado al EMPEZAR un paso: lo que dejó el anterior. */
  function base(A, s) {
    deGolpe(A, todo(), function () {
      var hecho = s.mano;
      A.ver(P.tabla, hecho, 0);
      A.ver(P.titulo, hecho, 0);
      Object.keys(P.verbos).forEach(function (k) { A.ver(P.verbos[k], hecho, 0); });
      P.papeletas.forEach(function (p, i) { papeletaEn(A, p, i, hecho); });
      P.rayas.forEach(function (r) { A.ver(r, hecho, 0); });
      P.lineas.forEach(function (t, k) { A.ver(t, LINEAS[k].paso <= s.hasta, 0); });
      A.ver(P.cajitas, s.hasta >= 3, 0);
      cajitasEn(A, s.cajitas || { S: 0, L: 0 });
      P.leidas.forEach(function (a) { A.ver(a, !!s.leidas, 0); });
      Object.keys(P.marcas).forEach(function (k) { A.ver(P.marcas[k], false, 0); });
      A.ver(P.flecha, false, 0);
      P.flechaPasos.forEach(function (g) { A.mover(g, 0, 0, 0, 1, 0); });
    });
  }

  /* Paso 1: a mano, una papeleta por vez. */
  function aMano(A) {
    A.ver(P.titulo, true, P0);
    A.ver(P.tabla, true, P0);
    A.ver(P.verbos.saca, true, P0);
    A.ver(P.verbos.mira, true, P0 + LLEGA);
    A.ver(P.verbos.raya, true, P0 + RAYA);
    P.papeletas.forEach(function (p, i) {
      var t = tSale(i);
      A.ver(p.g, true, t);
      A.mover(p.ida, MESA.x - URNA.x, MESA.y - URNA.y, 0, 1, t);
      A.mover(p.crece, 0, 0, 0, 1, t);
      A.ver(P.rayas[i], true, t + RAYA);
      A.mover(p.fila, filaX(i) - MESA.x, FILA_Y - MESA.y, 0, 1, t + SALE);
      A.mover(p.achica, 0, 0, 0, CHICA, t + SALE);
    });
  }

  /* Pasos 2 a 5: se marca lo de la mano y se escriben sus renglones. */
  function escribir(A, n) {
    A.ver(P.marcas[n], true, 150);
    var nuevas = [];
    LINEAS.forEach(function (l, k) { if (l.paso === n) nuevas.push(k); });
    nuevas.forEach(function (k, j) { A.ver(P.lineas[k], true, ESCRIBE + j * ENTRE); });
    if (n === 3) A.ver(P.cajitas, true, ESCRIBE + nuevas.length * ENTRE);
  }

  /* Paso 6: el programa, renglón por renglón. */
  function correr(A) {
    var R = P.recorrido, c = { S: 0, L: 0 };
    A.ver(P.flecha, true, ARRANCA - 200);
    P.flechaPasos.forEach(function (g, j) {
      A.mover(g, 0, (R[j + 1].k - R[j].k) * 14, 0, 1, tFlecha(j + 1));
    });
    R.forEach(function (paso, j) {
      var t = tFlecha(j);
      if (paso.saca != null) A.ver(P.leidas[paso.saca], true, t);
      if (paso.suma) {
        var v = paso.suma, antes = c[v];
        c[v]++;
        /* el de antes se va (con su pieza de irse), y el nuevo llega (con
           la de llegar) cuando ya se fue */
        A.ver(P.valores[v][antes].t, false, t);
        A.ver(P.valores[v][c[v]].llega, true, t + 200);
      }
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 6) se cuentan solo al ENTRAR; el 0 y
       el 7 se pintan siempre, también en el primer pintado, que llega con
       antes === n. */
    if (n >= 1 && n <= 6 && !entra(n)) return;
    var final = cuentaHasta(VOTOS.length);

    if (n === 0) { base(A, { mano: false, hasta: 0 }); return; }
    if (n === 1) { base(A, { mano: false, hasta: 0 }); aMano(A); return; }
    if (n >= 2 && n <= 5) { base(A, { mano: true, hasta: n - 1 }); escribir(A, n); return; }
    if (n === 6) { base(A, { mano: true, hasta: 5 }); correr(A); return; }
    /* el 7: todo a la vista, con las cajitas como las dejó el programa */
    base(A, { mano: true, hasta: 5, cajitas: final, leidas: true });
  }

  var FRASES = [
    'Kenia tiene que contar los votos de la urna, y la hoja está en blanco. ¿Por dónde se empieza?',
    'Primero los cuenta a mano: saca una papeleta, mira dónde está la X y hace una raya. Siete veces.',
    'Lo que hizo siete veces se escribe una vez, dentro de REPETIR. Lo primero es sacar la papeleta.',
    'Las rayas eran para no olvidar cuántos votos llevaba cada planilla. En la hoja, son dos cajitas que empiezan en 0.',
    'Y antes de cada raya miró dónde estaba la X: eso decide en qué cajita va el voto.',
    'Arriba, cuándo se cuenta: cuando se cierre la urna. Abajo, mostrar las dos cajitas y terminar.',
    'Ahora lo hace el programa, con las mismas siete papeletas, y da lo mismo que a mano: Sol 4, Luna 3.',
    'Tu turno: cuenta a mano los lápices de tu mesa por color. ¿Qué hiciste una y otra vez, qué miraste y qué anotaste?'
  ];
  /* Los rótulos del botón caben en un renglón en un teléfono de 360 px con
     la letra grande. */
  var BOTONES = ['✋ Contarlos a mano', '📝 Lo de siete veces', '📝 ¿Y las rayas?', '📝 ¿Y la X?',
    '📝 Arriba y abajo', '▶ Ahora el programa', '📝 Tu turno', '↺ Empezar otra vez'];
  var MARCADOR = [['0', 'líneas en la hoja'], ['4 a 3', 'contado a mano'], ['3', 'líneas en la hoja'],
    ['5', 'líneas en la hoja'], ['7', 'líneas en la hoja'], ['10', 'líneas en la hoja'],
    ['4 a 3', 'contado por el programa'], ['3', 'preguntas para empezar']];

  AnimacionMision.montar('#amUrna', {
    vista: [ANCHO, ALTO],
    describe: 'Arriba, una urna con siete papeletas, la mesa donde Kenia mira cada una y la tabla de sus rayas; abajo, la hoja de Kenia, todavía en blanco.',
    pasos: 8,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
