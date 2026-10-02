/* ============================================================
   M.E.T.A.S · Números Grandes · Los huevos de doña Chepa
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de
   Kenia, que contó los huevos de uno en uno, se perdió en el
   sesenta y dijo «ciento tres» donde eran ciento treinta. El
   aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0       los 130 huevos revueltos, como los tenía Kenia;
     1 a 13  el alumno los junta de diez en diez: cada toque es una
             decena, y el marcador cuenta 10, 20, 30… (el paso 6 se
             para en el sesenta, que es donde ella se perdió);
     14      diez decenas se juntan en UNA centena;
     15      la tabla C D U dice 1 3 0: ciento treinta;
     16      el error de Kenia, hecho a la vista: el 3 se muda de las
             decenas a las unidades y se van 27 huevos. Son las
             mismas cifras en otro lugar;
     17 a 20 y el mismo truco sigue: diez centenas, un millar… hasta
             el millón, que es a donde va la misión.

   Cuatro decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que el marcador dice, el dibujo lo tiene.** En cada
      paso, los huevos que se ven enteros son exactamente la cifra
      del marcador (130, y 103 en el paso del error). La sonda
      `verifica-animacion-mision` los cuenta uno por uno: un dibujo
      que dice un número y enseña otro enseña a no creerle a la
      pantalla.
   2. **El millón se dibuja de verdad, no se nombra.** Cada cuadro
      nuevo es diez del anterior, puesto a la vista con su espacio en
      medio para que se cuenten: una fila de 10 centenas, 10 filas de
      mil, 10 cuadros de diez mil, 10 filas de cien mil. Cuando un
      huevo ya no cabe en un punto de la pantalla se dibuja la
      centena entera como un cuadrito, y la frase lo dice («cada
      cuadrito ya es una centena de huevos»): se cambia el dibujo, no
      la cuenta.
   3. **Un «cartón» aquí no es de diez.** En Honduras el cartón de
      huevos es de 30, así que las decenas se llaman «fila» y la
      centena «cuadro»: es como se acomodan en la mesa para contar, y
      no le enseña al niño un empaque que no existe.
   4. **El montón sale revuelto, pero siempre igual** (azar con
      semilla): el maestro puede señalar «ese huevo café de la
      esquina» y en el teléfono del alumno está en el mismo sitio.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amHuevos')) return;

  var ANCHO = 320, ALTO = 210, TOTAL = 130;
  var FIN = 20;   // el último paso

  /* Las cámaras del final: cuánto se aleja el dibujo para que quepa la
     cosa nueva. El «mundo» se mide en huevos: una centena es un cuadro
     de 10 × 10, y cada grupo nuevo es diez del anterior con un espacio
     en medio (1.2 entre centenas, 8 entre cuadros de diez mil) para que
     se vea que son diez y no una sola mancha. */
  var PASO_C = 11.2;                 // de una centena a la siguiente
  var LADO_D = 10 * PASO_C - 1.2;    // un cuadro de diez mil: 110.8
  var PASO_D = LADO_D + 8;           // de un cuadro de diez mil al siguiente
  var LADO_M = 10 * PASO_D - 8;      // la fila de cien mil y el millón: 1180
  var CAM = {
    16: { s: 9.5, tx: 12.5, ty: 16.5 },                                  // la centena, en la columna C
    17: { s: 280 / LADO_D, tx: 20, ty: 105 - 5 * (280 / LADO_D) },       // 10 centenas en fila: mil
    18: { s: 180 / LADO_D, tx: 70, ty: 15 },                             // 10 filas: diez mil
    19: { s: 280 / LADO_M, tx: 20, ty: 105 - (LADO_D / 2) * (280 / LADO_M) }, // 10 cuadros: cien mil
    20: { s: 180 / LADO_M, tx: 70, ty: 15 }                              // 10 filas: un millón
  };
  /* El huevo se dibuja de 8.6 × 10.4 para una fila de paso 11: en el
     mundo, donde el paso es 1, va a escala 0.088 de la cámara. */
  var HUEVO = 0.088;

  var DECENAS = ['diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta',
    'ochenta', 'noventa', 'cien', 'ciento diez', 'ciento veinte', 'ciento treinta'];
  var CUANTAS = ['Una', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Siete', 'Ocho', 'Nueve',
    'Diez', 'Once', 'Doce', 'Trece'];

  var TEXTOS = [];
  TEXTOS[0] = 'Así estaban los huevos: revueltos. Contados de uno en uno es fácil perderse, como le pasó a Kenia. Júntalos de diez en diez.';
  TEXTOS[1] = 'Diez huevos en una fila: eso es una decena. Llevas 10.';
  for (var k = 2; k <= 12; k++) TEXTOS[k] = CUANTAS[k - 1] + ' decenas: ' + (10 * k) + ' huevos.';
  TEXTOS[2] += ' Cada fila nueva suma 10.';
  TEXTOS[3] += ' Cuenta en voz alta: 10, 20, 30.';
  TEXTOS[6] += ' Aquí se perdió Kenia contando de uno en uno. Tú no te pierdes: cada fila es 10.';
  TEXTOS[10] = 'Diez decenas: 100 huevos, cien. Ya casi terminas.';
  TEXTOS[13] = '¡Trece decenas y no sobró ninguno! De diez en diez son 130 huevos, y no te perdiste ni una vez.';
  TEXTOS[14] = 'Diez decenas juntas hacen una centena: 100 huevos en un solo cuadro. Afuera quedan 3 decenas: 30 huevos.';
  TEXTOS[15] = 'En la tabla: 1 centena, 3 decenas y 0 huevos sueltos. Se escribe 130 y se lee ciento treinta. El 0 dice que no sobró ninguno.';
  TEXTOS[16] = 'Kenia dijo «ciento tres»: 1 centena, 0 decenas y 3 sueltos. Son las mismas cifras, pero el 3 cambió de lugar y faltan 27 huevos.';
  TEXTOS[17] = 'Sigue juntando de diez en diez. Diez centenas hacen un millar: 1,000 huevos. Es la unidad de millar.';
  TEXTOS[18] = 'Diez millares hacen 10,000, diez mil: una decena de millar. El marco te muestra el millar de antes.';
  TEXTOS[19] = 'Diez cuadros de diez mil hacen 100,000, cien mil: una centena de millar. Cada cuadrito ya es una centena de huevos.';
  TEXTOS[20] = 'Y diez filas de cien mil hacen 1,000,000: ¡un millón! Desde un huevo fueron seis saltos de diez en diez. Así sube la escalera.';

  function miles(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  var A;                 // la ayuda del aparato
  var huevos = [];       // { nodo, s, j, esparcido, pila, demora }
  var marcosD = [];      // el marco de cada decena
  var centena, tabla = {}, zoom = null;

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el, id = A.id;
    var rnd = A.azar(20260928);

    /* Dos huevos: crema y café, con brillo. Un degradado por color, no
       por huevo: 130 degradados serían 130 cosas que pintar. */
    var defs = el('defs', null, svg);
    function degradado(nombre, luz, cuerpo, borde) {
      var g = el('radialGradient', { id: id + '-' + nombre, cx: '36%', cy: '30%', r: '78%' }, defs);
      el('stop', { offset: '0', 'stop-color': luz }, g);
      el('stop', { offset: '0.45', 'stop-color': cuerpo }, g);
      el('stop', { offset: '1', 'stop-color': borde }, g);
    }
    degradado('crema', '#ffffff', '#f7e9d0', '#e0c49a');
    degradado('cafe', '#f5d6b3', '#d9a36c', '#b47a45');

    /* Una centena por baldosa, para cuando el huevo ya es más chico que un
       punto de la pantalla (paso 19 en adelante). El cuadrito va con su
       espacio alrededor: la frase dice «cada cuadrito es una centena», y
       sin espacio no hay cuadritos, hay una mancha. */
    var pc = el('pattern', { id: id + '-pc', width: PASO_C, height: PASO_C, patternUnits: 'userSpaceOnUse' }, defs);
    el('rect', { x: 0.7, y: 0.7, width: 8.6, height: 8.6, rx: 1, fill: '#ddb57f' }, pc);

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* La tabla va DEBAJO de los huevos: las rayas de las columnas pasan
       por detrás del cuadro, como en un tablero de valor posicional. */
    var gTabla = el('g', null, svg);
    tabla.rayas = [112, 212].map(function (x) {
      return el('line', { class: 'am-linea am-fuera', x1: x, y1: 10, x2: x, y2: 202 }, gTabla);
    });
    tabla.bajo = el('line', { class: 'am-linea am-fuera', x1: 10, y1: 151, x2: 310, y2: 151 }, gTabla);
    tabla.letras = [['C', 60], ['D', 162], ['U', 262]].map(function (p) {
      var t = el('text', { class: 'am-letra am-fuera', x: p[1], y: 145, 'text-anchor': 'middle', 'font-size': 17 }, gTabla);
      t.textContent = p[0];
      return t;
    });
    function digito(txt) {
      var t = el('text', { class: 'am-digito am-fuera', x: 0, y: 0, 'text-anchor': 'middle', 'font-size': 36 }, gTabla);
      t.textContent = txt;
      return t;
    }
    tabla.uno = digito('1');
    tabla.tres = digito('3');
    tabla.ceroU = digito('0');
    tabla.ceroD = digito('0');
    tabla.huecoU = el('rect', { class: 'am-hueco am-fuera', x: 222, y: 18, width: 80, height: 92, rx: 10 }, gTabla);

    centena = el('rect', { class: 'am-trazo am-fuera', x: 9.5, y: 13.5, width: 101, height: 101, rx: 8 }, svg);

    var gMarcos = el('g', null, svg);
    for (var s = 0; s < 13; s++) {
      var m = el('rect', { class: 'am-trazo am-fuera', x: -7.5, y: -56, width: 15, height: 112, rx: 7.5 }, gMarcos);
      marcosD.push(m);
    }

    /* La capa del camino al millón va DEBAJO de los huevos: la centena que
       el alumno armó a mano se queda encima, y es la que se ve encogerse. */
    var gZoom = el('g', null, svg);

    var gHuevos = el('g', null, svg);

    /* El montón revuelto (paso 0). No es una rejilla corrida, que se ve
       ordenada aunque tiemble: cada huevo prueba varios sitios al azar y se
       queda con el más apartado de los demás. Así salen revueltos pero sin
       montarse uno encima de otro, que haría imposible contarlos. */
    var revueltos = [];
    for (var e = 0; e < TOTAL; e++) {
      var mejor = null, lejos = -1;
      for (var t = 0; t < 40; t++) {
        var cx = 16 + rnd() * 288, cy = 18 + rnd() * 176, cerca = Infinity;
        for (var q = 0; q < revueltos.length; q++) {
          var dx = revueltos[q].x - cx, dy = (revueltos[q].y - cy) * 0.85;
          cerca = Math.min(cerca, dx * dx + dy * dy);
        }
        if (cerca > lejos) { lejos = cerca; mejor = { x: cx, y: cy }; }
        if (cerca >= 225) break;
      }
      revueltos.push(mejor);
    }
    /* El montón de lo que falta por juntar (pasos 1 a 12): abajo, 20 × 6.
       Los huevos se van de sitios salteados, como se sacan de una
       canasta, y no en orden de izquierda a derecha. */
    var slots = A.barajar(Array.from({ length: TOTAL - 10 }, function (_, i) { return i; }), rnd);
    var cafes = [];
    for (var i = 0; i < TOTAL; i++) {
      var cafe = rnd() < 0.4;
      cafes.push(cafe);
      var nodo = el('ellipse', {
        rx: 4.3, ry: 5.2,
        fill: 'url(#' + id + (cafe ? '-cafe' : '-crema') + ')',
        stroke: cafe ? '#9b6535' : '#c9a574',
        'stroke-width': 0.8,
        class: 'hv'
      }, gHuevos);
      var h = {
        nodo: nodo, s: Math.floor(i / 10), j: i % 10,
        esparcido: { x: revueltos[i].x, y: revueltos[i].y, g: (rnd() - 0.5) * 100 },
        pila: null,
        demora: rnd()
      };
      if (i >= 10) {
        var sl = slots[i - 10];
        h.pila = {
          x: 12 + ((sl % 20) + 0.5) * 14.8 + (rnd() - 0.5) * 5,
          y: 136 + (Math.floor(sl / 20) + 0.5) * 11.3 + (rnd() - 0.5) * 3,
          g: (rnd() - 0.5) * 60
        };
      }
      huevos.push(h);
    }

    /* La centena que ya no se dibuja huevo por huevo (paso 17 en adelante)
       es un patrón de 10 × 10 con los MISMOS colores que la de verdad: las
       otras nueve centenas del millar se ven iguales a la que el alumno
       armó con sus manos, y no más pálidas, que haría pensar que son otra
       cosa. Van sin brillo: a ese tamaño no se ve, y en cada cuadro de la
       transición el navegador vuelve a pintar la baldosa entera. */
    var ph = el('pattern', { id: id + '-ph', width: 10, height: 10, patternUnits: 'userSpaceOnUse' }, defs);
    for (var b = 0; b < 100; b++) {
      el('ellipse', {
        cx: Math.floor(b / 10) + 0.5, cy: (b % 10) + 0.5, rx: 4.3 * HUEVO, ry: 5.2 * HUEVO,
        fill: cafes[b] ? '#d49a5f' : '#f5e5c8',
        stroke: cafes[b] ? '#9b6535' : '#c9a574', 'stroke-width': 0.8 * HUEVO
      }, ph);
    }
    /* Y dos patrones hechos de patrones: una FILA de diez centenas y una
       FILA de diez cuadros de diez mil, cada una con su espacio en medio.
       Así una fila entera es un solo rectángulo y no diez: el camino al
       millón son unos cuarenta elementos y no doscientos, que en un
       teléfono lento eran un tirón de medio segundo al tocar el botón. */
    var pfc = el('pattern', { id: id + '-pfc', width: PASO_C, height: 10, patternUnits: 'userSpaceOnUse' }, defs);
    el('rect', { x: 0, y: 0, width: 10, height: 10, fill: 'url(#' + id + '-ph)' }, pfc);
    var pfd = el('pattern', { id: id + '-pfd', width: PASO_D, height: LADO_D, patternUnits: 'userSpaceOnUse' }, defs);
    el('rect', { x: 0, y: 0, width: LADO_D, height: LADO_D, fill: 'url(#' + id + '-pc)' }, pfd);

    armarZoom(gZoom);
  }

  /* ── Dónde va cada cosa ─────────────────────────────────────────── */

  function enFila(s, j) { return { x: 23 + 22.8 * s, y: 16 + 11 * j, g: 0, k: 1 }; }
  function enCamara(n, col, fil) {
    var c = CAM[n];
    return { x: c.tx + c.s * (col + 0.5), y: c.ty + c.s * (fil + 0.5), g: 0, k: c.s * HUEVO };
  }
  function enD(s, j) { return { x: 162 + (s - 11) * 15, y: CAM[16].ty + CAM[16].s * (j + 0.5), g: 0, k: CAM[16].s * HUEVO }; }
  function enU(s) { return { x: 262 + (s - 11) * 12, y: 64, g: 0, k: 0.95 }; }

  /* El camino al millón. Se arma al cargar, apagado: son unos cuarenta
     elementos y así el toque que lleva al millar no tiene que crear nada.
     La capa entera lleva .am-capa, que además de apagarse se ESCONDE
     (visibility) al terminar de apagarse: lo que no se ve no se pinta en
     cada cuadro de las transiciones de antes. */
  function armarZoom(padre) {
    var el = A.el, id = A.id;
    zoom = { g: el('g', { class: 'am-capa am-fuera' }, padre) };
    var c = CAM[16];
    A.mover(zoom.g, c.tx, c.ty, 0, c.s);

    /* El cuadro se corre con transform y no con x/y: así la baldosa del
       patrón empieza en su esquina y cada centena sale entera, no partida
       por donde caiga la cuadrícula del mundo. Y dice cuántos huevos vale
       (data-vale): la sonda suma lo que se ve y lo compara con el
       marcador. */
    function cuadro(padre2, x, y, ancho, alto, relleno, vale) {
      return el('rect', {
        x: 0, y: 0, width: ancho, height: alto, transform: 'translate(' + x + ',' + y + ')',
        fill: 'url(#' + id + relleno + ')', class: 'am-fuera', 'data-vale': vale
      }, padre2);
    }
    var FILA_C = 10 * PASO_C - 1.2;   // diez centenas en fila, sin el espacio del final

    /* Detalle: huevo por huevo (pasos 17 y 18). Las centenas del millar
       llegan una por una; las filas del diez mil, fila por fila. */
    zoom.detalle = el('g', null, zoom.g);
    zoom.m0 = [];
    for (var i = 1; i < 10; i++) zoom.m0.push(cuadro(zoom.detalle, i * PASO_C, 0, 10, 10, '-ph', 100));
    zoom.d0 = [];
    for (var j = 1; j < 10; j++) zoom.d0.push(cuadro(zoom.detalle, 0, j * PASO_C, FILA_C, 10, '-pfc', 1000));

    /* Grueso: la centena entera como un cuadrito (pasos 19 y 20). */
    zoom.grueso = el('g', null, zoom.g);
    zoom.D0 = cuadro(zoom.grueso, 0, 0, LADO_D, LADO_D, '-pc', 10000);
    zoom.cm0 = [];
    for (var k = 1; k < 10; k++) zoom.cm0.push(cuadro(zoom.grueso, k * PASO_D, 0, LADO_D, LADO_D, '-pc', 10000));
    zoom.u6 = [];
    for (var f = 1; f < 10; f++) zoom.u6.push(cuadro(zoom.grueso, 0, f * PASO_D, LADO_M, LADO_D, '-pfd', 100000));

    /* El marco de «lo de antes», con la raya del mismo grueso a cualquier
       distancia (non-scaling-stroke): si no, al alejarse se haría un
       hilo invisible. */
    function marco(x, y, w, h) {
      return el('rect', { class: 'am-trazo am-fuera', x: x, y: y, width: w, height: h, rx: 0.2, 'vector-effect': 'non-scaling-stroke' }, zoom.g);
    }
    zoom.marcos = {
      17: marco(-0.7, -0.7, 11.4, 11.4),
      18: marco(-0.7, -0.7, FILA_C + 1.4, 11.4),
      19: marco(-2, -2, LADO_D + 4, LADO_D + 4),
      20: marco(-5, -5, LADO_M + 10, LADO_D + 10)
    };
  }

  function pintar(n, antes) {
    var adelante = n > antes;

    /* Los huevos */
    for (var i = 0; i < TOTAL; i++) {
      var h = huevos[i], s = h.s, j = h.j;
      var p, visible = true, roto = false, d = 0;
      if (n === 0) {
        p = { x: h.esparcido.x, y: h.esparcido.y, g: h.esparcido.g, k: 1 };
        if (antes > 0) d = h.demora * 300;
      } else if (n <= 13) {
        if (s < n) {
          p = enFila(s, j);
          if (adelante && s >= antes) d = (s - antes) * 90 + j * 26;
        } else {
          p = { x: h.pila.x, y: h.pila.y, g: h.pila.g, k: 1 };
          if (antes === 0) d = h.demora * 160;
        }
      } else if (n <= 16) {
        if (s < 10) {
          p = enCamara(16, s, j);
          if (adelante && antes <= 13) d = s * 30 + j * 6;
        } else if (n === 16 && j === 0) {
          p = enU(s);
          if (adelante) d = 200 + (s - 10) * 120;
        } else {
          p = enD(s, j);
          roto = n === 16;
          if (adelante && antes <= 13) d = 320 + (s - 10) * 50 + j * 6;
        }
      } else {
        if (s < 10) {
          p = enCamara(n, s, j);
          visible = n <= 18;
        } else {
          p = j === 0 ? enU(s) : enD(s, j);   // se apagan donde estaban
          visible = false;
        }
      }
      A.mover(h.nodo, p.x, p.y, p.g, p.k, d);
      h.nodo.classList.toggle('am-fuera', !visible);
      h.nodo.classList.toggle('am-roto', roto);
    }

    /* El marco de cada decena. En la tabla va a escala 0.86: las filas de
       la tabla van a paso 9.5 y no a 11 como cuando se forman. */
    for (var m = 0; m < 13; m++) {
      var mk = marcosD[m], pm, vm = false, dm = 0;
      var enTabla = { x: 162 + (m - 11) * 15, y: 64, k: 0.86 };
      if (n >= 1 && n <= 13) {
        pm = { x: 23 + 22.8 * m, y: 65.5, k: 1 };
        vm = m < n;
        if (adelante && m >= antes) dm = (m - antes) * 90 + 330;
      } else if (n >= 14 && n <= 16 && m < 10) {
        /* Las diez que se vuelven centena: viajan con sus huevos y se
           apagan por el camino, que el marco de la centena las recoge. */
        pm = { x: CAM[16].tx + CAM[16].s * (m + 0.5), y: 64, k: 0.86 };
      } else if (n >= 14 && m >= 10) {
        pm = enTabla;
        vm = n <= 16;
        if (adelante && n === 14 && antes <= 13) dm = 450;
      } else {
        pm = n === 0 ? { x: 23 + 22.8 * m, y: 65.5, k: 1 } : enTabla;
      }
      A.mover(mk, pm.x, pm.y, 0, pm.k, dm);
      mk.classList.toggle('am-fuera', !vm);
      mk.classList.toggle('am-roto', n === 16 && m >= 10);
    }

    /* La centena y la tabla */
    A.ver(centena, n >= 14 && n <= 16, adelante && n === 14 ? 520 : 0);
    var conTabla = n === 15 || n === 16;
    var dt = adelante && n === 15 ? 150 : 0;
    tabla.rayas.forEach(function (r) { A.ver(r, conTabla, dt); });
    A.ver(tabla.bajo, conTabla, dt);
    tabla.letras.forEach(function (t, x) { A.ver(t, conTabla, dt + x * 90); });
    A.mover(tabla.uno, 60, 193, 0, 1, adelante && n === 15 ? 420 : 0);
    A.ver(tabla.uno, conTabla);
    A.mover(tabla.tres, n === 16 ? 262 : 162, 193, 0, 1, adelante && n === 15 ? 510 : (adelante && n === 16 ? 250 : 0));
    A.ver(tabla.tres, conTabla);
    A.mover(tabla.ceroU, 262, 193, 0, 1, adelante && n === 15 ? 600 : 0);
    A.ver(tabla.ceroU, n === 15);
    A.mover(tabla.ceroD, 162, 193, 0, 1, adelante && n === 16 ? 600 : 0);
    A.ver(tabla.ceroD, n === 16);
    A.ver(tabla.huecoU, n === 15, adelante && n === 15 ? 700 : 0);

    /* El camino al millón */
    {
      var cam = CAM[n >= 17 ? n : 16];
      A.mover(zoom.g, cam.tx, cam.ty, 0, cam.s, 0);
      A.ver(zoom.g, n >= 17);
      var llega = function (paso, base, x) { return adelante && n === paso ? base + x * 60 : 0; };
      zoom.m0.forEach(function (q, x) { A.ver(q, n === 17 || n === 18, llega(17, 380, x)); });
      zoom.d0.forEach(function (q, x) { A.ver(q, n === 18, llega(18, 380, x)); });
      A.ver(zoom.detalle, n <= 18);
      A.ver(zoom.D0, n >= 19);
      zoom.cm0.forEach(function (q, x) { A.ver(q, n >= 19, llega(19, 420, x)); });
      zoom.u6.forEach(function (q, x) { A.ver(q, n === 20, llega(20, 420, x)); });
      [17, 18, 19, 20].forEach(function (p) { A.ver(zoom.marcos[p], n === p, adelante && n === p ? 1000 : 0); });
    }
  }

  function marcador(n, antes) {
    var adelante = n > antes;
    if (n === 0) return { cifra: '?', palabras: '¿cuántos hay?' };
    if (n <= 13) return { cifra: String(10 * n), palabras: DECENAS[n - 1], salto: adelante ? '+' + (10 * (n - antes)) : '' };
    if (n <= 15) return { cifra: '130', palabras: 'ciento treinta' };
    if (n === 16) return { cifra: '103', palabras: 'ciento tres', salto: adelante ? '−27' : '' };
    var cifras = { 17: 1000, 18: 10000, 19: 100000, 20: 1000000 };
    var nombres = { 17: 'mil', 18: 'diez mil', 19: 'cien mil', 20: 'un millón' };
    return { cifra: miles(cifras[n]), palabras: nombres[n], salto: adelante && n > 17 ? '×10' : '' };
  }

  AnimacionMision.montar('#amHuevos', {
    vista: [ANCHO, ALTO],
    describe: 'Los 130 huevos de doña Chepa, que se juntan de diez en diez.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      if (n <= 12) return '➕ Juntar 10 huevos';
      if (n === 13) return '📦 Juntar 10 decenas';
      if (n === 14) return '🔢 A la tabla';
      if (n === 15) return '🤔 ¿Y «ciento tres»?';
      if (n === 16) return '⬆️ De diez en diez';
      if (n < FIN) return '⬆️ Juntar 10 de estos';
      return '↺ Empezar otra vez';
    },
    /* Trece toques seguidos se hacen largos en el proyector: después de
       juntar dos a mano, el resto se puede juntar de una vez. Los dos
       primeros no, porque juntar con la mano es lo que se aprende. */
    atajo: function (n) {
      return n >= 2 && n <= 12 ? { rotulo: '⏩ Juntar los que faltan', a: 13 } : null;
    },
    marcador: marcador
  });
})();
