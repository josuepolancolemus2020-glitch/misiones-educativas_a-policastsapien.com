/* ============================================================
   M.E.T.A.S · Secuencias: el Robot Mensajero · El mandado de Marvin
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Marvin: lo
   mandaron a la pulpería con dos encargos, hizo los dos en el orden que no
   era y le tocó volver. La historia termina diciendo que un robot no tiene
   cómo darse cuenta de eso, y que se va a venir sin azúcar todas las
   veces. Eso es lo que se ve aquí, con el robot de la misión. El aparato
   (botones, frase, marcador) vive en js/animacion-mision.js; aquí solo está
   el dibujo y dónde va cada pieza en cada paso.

   A la izquierda, la lista del robot: cinco instrucciones, con el número de
   su lugar. A la derecha, la aldea en casillas: la casa de Marvin, la casa
   del vecino y la pulpería. El robot lleva el recado.

     0  el robot, su recado y su lista: ¿en qué casa lo va a dejar?;
     1  la lista se hace de arriba abajo, una a una: el robot dobla antes de
        tiempo y deja el recado en la casa del vecino;
     2  otra vez, con la misma lista: el mismo camino y la misma casa. El
        robot no tiene cómo saber que esa no era;
     3  con el camino a la pulpería al lado, la lista se hace otra vez hasta
        donde se tuerce: en la 2 dobla y el camino sigue derecho;
     4  las mismas cinco, y la 2 y la 3 cambian de lugar;
     5  la lista arreglada: el recado llega a la pulpería;
     6  los dos resultados a la vista, y la pregunta es del alumno.

   Siete decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que hace el robot sale de la lista, instrucción por
      instrucción.** La escena no escribe a qué casilla llega: simula la
      lista que está en el dibujo (AVANZA mueve una casilla hacia donde
      mira, GIRA IZQUIERDA lo voltea sin moverlo, ENTREGA deja el recado
      donde está) y el robot hace eso. La sonda vuelve a simular la lista
      por su cuenta, leyendo el orden de las tarjetas en el dibujo.
   2. ⚠️ **Cada instrucción empieza donde la dejó la anterior.** Por eso el
      mismo AVANZA lleva a otra casilla según hacia dónde quedó mirando el
      robot, y por eso cambiar dos de lugar cambia la casa. El robot se
      mueve con una pieza por instrucción, una dentro de otra, y se voltea
      con otras tantas, dentro de las que lo mueven: así cada vuelta es
      alrededor de su centro y cada paso va hacia donde mira en ese momento.
   3. ⚠️ **Las dos listas son las MISMAS cinco tarjetas, y el número va con
      el LUGAR.** Es la decisión de la baleada de la misión anterior: las
      dos que cambian de lugar se ven moverse, y los números se quedan.
   4. **La misma lista da la misma casa, todas las veces.** Es lo que dice
      la historia («se va a venir sin azúcar todas las veces»), y se ve: la
      segunda vez el robot hace el mismo camino y el recado queda al lado
      del primero.
   5. ⚠️ **Lo que la prueba pregunta no se dice ni se dibuja**: ni los
      puntos cardinales (no hay rosa de los vientos: el Norte arriba, el Sur
      abajo y el Oeste a la izquierda son preguntas), ni «secuencia»,
      «algoritmo», «bug», «depurar», «trazar», «estado», ni cuántos grados
      gira. Tampoco hay árboles ni borde que choque. El nombre de lo que se
      ve lo dan las tarjetas de abajo.
   6. **Nada se dice solo con color**: el camino a la pulpería va con raya
      cortada, cada casa donde quedó el recado lleva su ✗ o su ✓, lo hecho
      lleva un ✓ en su lugar, y hacia dónde mira el robot lo dice su nariz.
   7. **El robot se mueve a paso parejo** (`.am-viaja`), porque su rastro se
      dibuja mientras camina: con la curva de siempre, el robot llegaba
      antes que su propia raya.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amMandado')) return;

  var ANCHO = 320, ALTO = 216;

  /* Las cinco tarjetas. Hay tres AVANZA, así que cada tarjeta tiene su
     clave: la lista se lee por claves, y lo que hace cada una por su
     instrucción. Las dos listas usan las MISMAS cinco: solo cambian dos de
     lugar. */
  var CLAVES = ['a1', 'gi', 'a2', 'a3', 'en'];
  var TEXTO = { a1: 'AVANZA', gi: 'GIRA IZQUIERDA', a2: 'AVANZA', a3: 'AVANZA', en: 'ENTREGA' };
  var HACE = { a1: 'av', gi: 'gi', a2: 'av', a3: 'av', en: 'en' };
  var CON_ERROR = ['a1', 'gi', 'a2', 'a3', 'en'];
  var ARREGLADA = ['a1', 'a2', 'gi', 'a3', 'en'];

  /* La lista: el número de cada lugar a la izquierda, la flecha que va de
     instrucción en instrucción y la tarjeta. */
  var FILA0 = 36, PASO_Y = 34;
  function filaY(i) { return FILA0 + i * PASO_Y; }
  var NUM_X = 12, FLECHA_X = 25, T0 = 31, T1 = 140;

  /* La aldea: tres casillas por tres. */
  var C = 52, GX = 160, GY = 30;
  function cx(c) { return GX + c * C + C / 2; }
  function cy(r) { return GY + r * C + C / 2; }
  var CASA = { c: 0, r: 2 }, VECINO = { c: 1, r: 0 }, PULPERIA = { c: 2, r: 1 };

  /* Hacia dónde mira el robot: 0 derecha, 1 arriba, 2 izquierda, 3 abajo.
     GIRA IZQUIERDA suma uno. En pantalla, girar a la izquierda es girar al
     revés de las agujas del reloj: −90°. */
  var PASO_DIR = [[1, 0], [0, -1], [-1, 0], [0, 1]];
  var MIRA_AL_EMPEZAR = 0;

  /* Cuánto dura cada instrucción en la corrida. ENTREGA dura un poco más:
     es cuando se ve dónde quedó el recado. */
  var DURA = { av: 900, gi: 900, en: 1100 };
  var INICIO = 300;
  function horario(orden) {
    var h = [INICIO];
    for (var i = 0; i < orden.length; i++) h.push(h[i] + DURA[HACE[orden[i]]]);
    return h;
  }

  /* Lo que hace la lista, instrucción por instrucción, desde la casa. */
  function simular(orden) {
    var s = { c: CASA.c, r: CASA.r, d: MIRA_AL_EMPEZAR }, pasos = [];
    orden.forEach(function (k) {
      var antes = { c: s.c, r: s.r, d: s.d };
      if (HACE[k] === 'av') { s.c += PASO_DIR[s.d][0]; s.r += PASO_DIR[s.d][1]; }
      else if (HACE[k] === 'gi') { s.d = (s.d + 1) % 4; }
      pasos.push({ k: k, hace: HACE[k], antes: antes, despues: { c: s.c, r: s.r, d: s.d } });
    });
    return pasos;
  }

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }

  /* Una casa vista de frente, dibujada alrededor del centro de su
     casilla: el robot se para delante de la puerta. */
  function casa(A, svg, lugar, clase, cual) {
    var x = cx(lugar.c), y = cy(lugar.r);
    var g = A.el('g', { 'data-casa': cual }, svg);
    A.el('rect', { x: x - 16, y: y - 11, width: 32, height: 24, 'class': 'rb-pared ' + clase }, g);
    A.el('path', { d: 'M' + (x - 20) + ' ' + (y - 10) + ' L' + x + ' ' + (y - 24) + ' L' + (x + 20) + ' ' + (y - 10) + ' Z', 'class': 'rb-techo' }, g);
    A.el('rect', { x: x - 13, y: y - 6, width: 6, height: 5, 'class': 'rb-ventana' }, g);
    A.el('rect', { x: x + 7, y: y - 6, width: 6, height: 5, 'class': 'rb-ventana' }, g);
    A.el('rect', { x: x - 4, y: y + 1, width: 8, height: 12, 'class': 'rb-puerta' }, g);
    return g;
  }

  /* La pulpería: su pared, su toldo a rayas, su mostrador y su puerta. */
  function pulperia(A, svg) {
    var x = cx(PULPERIA.c), y = cy(PULPERIA.r);
    var g = A.el('g', { 'data-casa': 'pulperia' }, svg);
    A.el('rect', { x: x - 17, y: y - 12, width: 34, height: 25, 'class': 'rb-pared rb-pared-pulperia' }, g);
    A.el('rect', { x: x - 15, y: y - 24, width: 30, height: 7, rx: 1.5, 'class': 'rb-rotulo-tienda' }, g);
    for (var i = 0; i < 6; i++) {
      A.el('rect', { x: x - 21 + i * 7, y: y - 17, width: 7, height: 7, 'class': i % 2 ? 'rb-toldo-b' : 'rb-toldo-a' }, g);
    }
    A.el('rect', { x: x - 13, y: y - 4, width: 26, height: 7, 'class': 'rb-mostrador' }, g);
    A.el('rect', { x: x - 4, y: y + 3, width: 8, height: 10, 'class': 'rb-puerta' }, g);
    return g;
  }

  /* Un recado: un sobre, dibujado alrededor de (0, 0). */
  function sobre(A, padre, x, y, cual) {
    var g = A.el('g', { 'data-sobre': cual, transform: 'translate(' + x + ' ' + y + ')' }, padre);
    A.el('rect', { x: -6.5, y: -4.5, width: 13, height: 9, rx: 1, 'class': 'rb-sobre' }, g);
    A.el('path', { d: 'M-6.5 -4.5 L0 0.8 L6.5 -4.5', 'class': 'rb-sobre-v' }, g);
    return g;
  }

  /* Un tramo del rastro, de centro a centro de dos casillas vecinas. */
  function tramo(A, svg, clase, de, a, cual, n) {
    return A.el('path', { d: 'M' + cx(de.c) + ' ' + cy(de.r) + ' L' + cx(a.c) + ' ' + cy(a.r),
      'class': clase, 'data-rastro': cual, 'data-tramo-rastro': n }, svg);
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── la lista ─────────────────────────────────────────── */
    P.titulo = texto(A, svg, 4, 13, 'am-letra', 11, 'start', 'La lista del robot:');
    P.titulo.setAttribute('data-titulo', '');

    P.hechos = [];
    for (var i = 0; i < 5; i++) {
      var y = filaY(i);
      A.el('circle', { cx: NUM_X, cy: y, r: 8, 'class': 'am-ficha', 'data-lugar': i + 1 }, svg);
      var d = texto(A, svg, NUM_X, y + 3.6, 'am-digito', 10, 'middle', String(i + 1));
      d.setAttribute('data-numero', i + 1);
      /* lo hecho: un ✓ en su lugar, donde estuvo la flecha */
      P.hechos.push(A.el('path', { d: 'M' + (FLECHA_X - 4) + ' ' + y + ' l2.6 2.8 l4.8 -5.6', 'class': 'rb-hecho', 'data-hecho': i + 1 }, svg));
    }

    /* Las tarjetas: una por instrucción, cada una en su lugar. La que baja
       al cambiar de orden se aparta un poco a la derecha para pasar por
       delante de la otra, como en la baleada. */
    P.tarjetas = {};
    CLAVES.forEach(function (k) {
      var g = A.el('g', { 'data-instruccion': k }, svg);
      var ida = A.el('g', null, g);
      var vuelta = A.el('g', null, ida);
      var marco = A.el('rect', { x: T0, y: -13, width: T1 - T0, height: 26, rx: 7, 'class': 'rb-tarjeta' }, vuelta);
      var resalte = A.el('rect', { x: T0 - 1.5, y: -14.5, width: T1 - T0 + 3, height: 29, rx: 8, 'class': 'rb-resalte' }, vuelta);
      var txt = texto(A, vuelta, T0 + 7, 4, 'am-letra rb-orden', 11, 'start', TEXTO[k]);
      P.tarjetas[k] = { g: g, ida: ida, vuelta: vuelta, marco: marco, resalte: resalte, txt: txt, bailes: 0 };
    });

    /* La flecha que va haciendo la lista: una pieza por cada lugar que
       baja, una dentro de otra, y cada una con su demora. */
    P.flecha = A.el('g', { 'data-flecha': '' }, svg);
    P.flechaFin = A.el('g', { 'data-flecha-fin': '' }, P.flecha);
    var paso = P.flechaFin;
    P.flechaPasos = [];
    for (var j = 1; j < 5; j++) {
      paso = A.el('g', { 'data-flecha-baja': j }, paso);
      P.flechaPasos.push(paso);
    }
    A.el('path', { d: 'M' + (FLECHA_X - 5) + ' ' + (FILA0 - 5.5) + ' L' + (FLECHA_X + 3) + ' ' + FILA0 +
      ' L' + (FLECHA_X - 5) + ' ' + (FILA0 + 5.5) + ' Z', 'class': 'rb-flecha' }, paso);

    /* La llave del paso 4: las dos que cambiaron de lugar. Sin rótulo: a su
       derecha empieza la aldea, y la frase lo dice. */
    P.llave = A.el('g', { 'data-llave': '' }, svg);
    A.el('path', { d: 'M' + (T1 + 2) + ' ' + (filaY(1) - 12) + ' h3 V' + (filaY(2) + 12) + ' h-3', 'class': 'rb-llave' }, P.llave);

    /* ── la aldea ─────────────────────────────────────────── */
    A.el('rect', { x: GX, y: GY, width: 3 * C, height: 3 * C, rx: 4, 'class': 'rb-suelo', 'data-aldea': '' }, svg);
    for (var q = 1; q < 3; q++) {
      A.el('path', { d: 'M' + (GX + q * C) + ' ' + GY + ' V' + (GY + 3 * C), 'class': 'rb-raya', 'data-raya': 'v' }, svg);
      A.el('path', { d: 'M' + GX + ' ' + (GY + q * C) + ' H' + (GX + 3 * C), 'class': 'rb-raya', 'data-raya': 'h' }, svg);
    }

    /* El camino que TENÍA que hacer: de la casa de Marvin a la pulpería,
       con raya cortada y su punta. */
    P.ruta = A.el('g', { 'data-ruta': '' }, svg);
    A.el('path', { d: 'M' + cx(CASA.c) + ' ' + cy(CASA.r) + ' L' + cx(PULPERIA.c) + ' ' + cy(CASA.r) + ' L' + cx(PULPERIA.c) + ' ' + (cy(PULPERIA.r) + 13),
      'class': 'rb-ruta', 'data-ruta-linea': '' }, P.ruta);
    A.el('path', { d: 'M' + (cx(PULPERIA.c) - 5) + ' ' + (cy(PULPERIA.r) + 19) + ' L' + cx(PULPERIA.c) + ' ' + (cy(PULPERIA.r) + 12) +
      ' L' + (cx(PULPERIA.c) + 5) + ' ' + (cy(PULPERIA.r) + 19), 'class': 'rb-ruta-punta' }, P.ruta);

    /* El rastro de cada lista: un tramo por cada AVANZA, que se dibuja
       mientras el robot camina. */
    P.rastro = { error: [], arreglada: [] };
    simular(CON_ERROR).filter(function (s) { return s.hace === 'av'; }).forEach(function (s, n) {
      P.rastro.error.push(tramo(A, svg, 'rb-rastro rb-rastro-error', s.antes, s.despues, 'error', n + 1));
    });
    simular(ARREGLADA).filter(function (s) { return s.hace === 'av'; }).forEach(function (s, n) {
      P.rastro.arreglada.push(tramo(A, svg, 'rb-rastro rb-rastro-bien', s.antes, s.despues, 'arreglada', n + 1));
    });

    /* las casas */
    casa(A, svg, CASA, 'rb-pared-marvin', 'marvin');
    casa(A, svg, VECINO, 'rb-pared-vecino', 'vecino');
    pulperia(A, svg);
    P.rotMarvin = texto(A, svg, cx(CASA.c), GY + 3 * C + 13, 'am-rotulo', 9.5, 'middle', 'Marvin');
    P.rotVecino = texto(A, svg, cx(VECINO.c), GY - 8, 'am-rotulo', 9.5, 'middle', 'vecino');
    P.rotPulperia = texto(A, svg, cx(PULPERIA.c), GY + PULPERIA.r * C - 5, 'am-rotulo', 9.5, 'middle', 'pulpería');
    P.rotMarvin.setAttribute('data-rotulo', 'marvin');
    P.rotVecino.setAttribute('data-rotulo', 'vecino');
    P.rotPulperia.setAttribute('data-rotulo', 'pulperia');

    /* Los recados que se dejan: dos en la casa del vecino (uno por cada vez
       que se hace la lista con el error) y uno en la pulpería. Van al lado
       de la puerta, donde el robot no los tapa. */
    P.sobres = {
      vecino1: sobre(A, svg, cx(VECINO.c) + 19, cy(VECINO.r) + 5, 'vecino1'),
      vecino2: sobre(A, svg, cx(VECINO.c) + 19, cy(VECINO.r) + 16, 'vecino2'),
      pulperia: sobre(A, svg, cx(PULPERIA.c) + 19, cy(PULPERIA.r) + 16, 'pulperia')
    };

    /* lo que dice cada casa donde quedó el recado */
    var xm = cx(VECINO.c) + 20, ym = GY - 16;
    P.mal = A.el('path', { d: 'M' + xm + ' ' + (ym - 4.5) + ' l9 9 m0 -9 l-9 9', 'class': 'rb-mal', 'data-marca': 'mal' }, svg);
    var xb = cx(PULPERIA.c) - 6, yb = GY + 20;
    P.bien = A.el('path', { d: 'M' + xb + ' ' + yb + ' l3.6 4 l7 -9', 'class': 'rb-bien', 'data-marca': 'bien' }, svg);

    /* El anillo del paso 3: donde el robot se tuerce y el camino no. */
    var torcida = simular(CON_ERROR)[1].despues;
    P.anillo = A.el('circle', { cx: cx(torcida.c), cy: cy(torcida.r), r: 17, 'class': 'rb-anillo', 'data-anillo': '' }, svg);

    /* ── el robot ─────────────────────────────────────────── */
    /* Visto desde arriba: el cuerpo, los ojos y la nariz que dice hacia
       dónde mira. Una pieza por instrucción lo mueve (las de fuera) y otra
       por instrucción lo voltea (las de dentro, alrededor de su centro). */
    P.robot = A.el('g', { 'data-robot': '' }, svg);
    P.robotBase = A.el('g', { 'data-robot-base': '' }, P.robot);
    var g = P.robotBase;
    P.mueve = [];
    for (var m = 0; m < 5; m++) { g = A.el('g', { 'class': 'am-viaja', 'data-mueve': m + 1 }, g); P.mueve.push(g); }
    P.voltea = [];
    for (var v = 0; v < 5; v++) { g = A.el('g', { 'data-voltea': v + 1 }, g); P.voltea.push(g); }
    A.el('path', { d: 'M11 -6 L20 0 L11 6 Z', 'class': 'rb-nariz', 'data-nariz': '' }, g);
    A.el('circle', { cx: 0, cy: 0, r: 12, 'class': 'rb-cuerpo', 'data-cuerpo': '' }, g);
    A.el('circle', { cx: 5.5, cy: -4.5, r: 2, 'class': 'rb-ojo' }, g);
    A.el('circle', { cx: 5.5, cy: 4.5, r: 2, 'class': 'rb-ojo' }, g);
    P.carga = A.el('g', { 'data-carga': '' }, g);
    A.el('rect', { x: -10, y: -4, width: 10, height: 8, rx: 1, 'class': 'rb-sobre' }, P.carga);
    A.el('path', { d: 'M-10 -4 L-5 0.5 L0 -4', 'class': 'rb-sobre-v' }, P.carga);
  }

  /* Pone de golpe, sin movimiento: así una corrida se vuelve a ver entera
     cada vez que se entra en su paso, también volviendo con «Atrás». */
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  /* El robot quieto donde lo dejan las primeras `hechas` instrucciones de
     la lista, con o sin su recado. */
  function robotEn(A, orden, hechas, conRecado) {
    var sim = simular(orden);
    A.mover(P.robotBase, cx(CASA.c), cy(CASA.r), 0, 1, 0);
    for (var i = 0; i < 5; i++) {
      var s = sim[i], mueve = i < hechas && s.hace === 'av', voltea = i < hechas && s.hace === 'gi';
      A.mover(P.mueve[i], mueve ? PASO_DIR[s.antes.d][0] * C : 0, mueve ? PASO_DIR[s.antes.d][1] * C : 0, 0, 1, 0);
      A.mover(P.voltea[i], 0, 0, voltea ? -90 : 0, 1, 0);
    }
    A.ver(P.carga, conRecado, 0);
  }

  function rastroVisto(A, lista, si) {
    lista.forEach(function (t) { A.ver(t, si, 0); A.trazar(t, si, 0); });
  }

  /* La corrida: la flecha va de lugar en lugar y el robot hace lo que dice
     la tarjeta que hay en ese lugar. El robot no sabe el orden: lo lee de
     la lista, instrucción por instrucción, y por eso la misma función hace
     todas las corridas. `hasta` es cuántas se hacen (la del paso 3 se
     detiene en la 2). Devuelve cuándo termina. */
  function correr(A, orden, hasta, rastro, sobreQueda) {
    var h = horario(orden), sim = simular(orden), avanzadas = 0;
    A.ver(P.flecha, true, h[0] - 200);
    P.flechaPasos.forEach(function (g, i) { A.mover(g, 0, i + 1 < hasta ? PASO_Y : 0, 0, 1, h[i + 1]); });
    A.ver(P.flechaFin, hasta < 5, hasta < 5 ? 0 : h[5]);
    /* ✓ en lo hecho. Si la corrida se detiene, la flecha se queda en la
       última que hizo y esa no lleva ✓: quedaría escondido debajo. */
    P.hechos.forEach(function (hecho, i) {
      var si = i < hasta && (hasta === 5 || i < hasta - 1);
      A.ver(hecho, si, si ? h[i + 1] : 0);
    });
    for (var i = 0; i < hasta; i++) {
      var s = sim[i], ti = h[i];
      if (s.hace === 'av') {
        A.mover(P.mueve[i], PASO_DIR[s.antes.d][0] * C, PASO_DIR[s.antes.d][1] * C, 0, 1, ti + 50);
        /* su tramo de rastro, si la corrida deja uno (la del paso 3 camina
           por el que ya está) */
        var t = rastro[avanzadas++];
        if (t) { A.ver(t, true, ti + 50); A.trazar(t, true, ti + 50); }
      } else if (s.hace === 'gi') {
        A.mover(P.voltea[i], 0, 0, -90, 1, ti + 50);
      } else if (s.hace === 'en') {
        A.ver(P.carga, false, ti + 250);
        A.ver(sobreQueda, true, ti + 350);
      }
    }
    return h[hasta];
  }

  /* Todo lo que una corrida pone de nuevo, apagado y quieto antes de
     empezar. */
  function empezarCorrida(A, orden, extra) {
    var piezas = [P.robot, P.flecha, P.mal, P.bien, P.anillo].concat(P.hechos, P.rastro.error, P.rastro.arreglada,
      [P.sobres.vecino1, P.sobres.vecino2, P.sobres.pulperia]);
    deGolpe(A, piezas, function () {
      robotEn(A, orden, 0, true);
      A.ver(P.flecha, false, 0);
      A.ver(P.flechaFin, true, 0);
      P.flechaPasos.forEach(function (g) { A.mover(g, 0, 0, 0, 1, 0); });
      P.hechos.forEach(function (h) { A.ver(h, false, 0); });
      A.ver(P.anillo, false, 0);
      extra();
    });
  }

  function ordenDe(n) { return n >= 4 ? ARREGLADA : CON_ERROR; }

  /* `dMarca`: cuándo se enciende el resalte. En el paso 3 espera a que el
     robot se tuerza: marcar la 2 antes de que la flecha llegue a ella
     sería decir la respuesta antes de enseñarla. */
  function ponerTarjetas(A, n, antes, dMarca) {
    var orden = ordenDe(n), cambia = antes != null && (n >= 4) !== (antes >= 4);
    CLAVES.forEach(function (k) {
      var c = P.tarjetas[k];
      A.mover(c.g, 0, filaY(orden.indexOf(k)), 0, 1, cambia ? 300 : 0);
      if (cambia) {
        var baja = orden.indexOf(k) > ordenDe(antes).indexOf(k);
        if (baja) {
          c.bailes++;
          A.mover(c.ida, 16 * c.bailes, 0, 0, 1, 0);
          A.mover(c.vuelta, -16 * c.bailes, 0, 0, 1, 900);
        }
      }
      var marcada = (n === 4 && (k === 'gi' || k === 'a2')) || (n === 3 && k === 'gi');
      A.ver(c.resalte, marcada, marcada ? (dMarca || 0) : 0);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };

    ponerTarjetas(A, n, antes, n === 3 ? horario(CON_ERROR)[2] - 300 : 300);
    A.ver(P.llave, n === 4, n === 4 ? 500 : 0);
    A.ver(P.ruta, n >= 3, 0);

    if (entra(1) || entra(2)) {
      var segunda = n === 2;
      empezarCorrida(A, CON_ERROR, function () {
        A.ver(P.sobres.vecino1, segunda, 0);
        A.ver(P.sobres.vecino2, false, 0);
        A.ver(P.sobres.pulperia, false, 0);
        A.ver(P.mal, segunda, 0);
        A.ver(P.bien, false, 0);
        rastroVisto(A, P.rastro.error, false);
        rastroVisto(A, P.rastro.arreglada, false);
      });
      var fin = correr(A, CON_ERROR, 5, P.rastro.error, segunda ? P.sobres.vecino2 : P.sobres.vecino1);
      A.ver(P.mal, true, segunda ? 0 : fin - 600);
      return;
    }
    if (entra(3)) {
      empezarCorrida(A, CON_ERROR, function () {
        A.ver(P.sobres.vecino1, true, 0);
        A.ver(P.sobres.vecino2, true, 0);
        A.ver(P.sobres.pulperia, false, 0);
        A.ver(P.mal, true, 0);
        A.ver(P.bien, false, 0);
        rastroVisto(A, P.rastro.error, true);
        rastroVisto(A, P.rastro.arreglada, false);
      });
      var finT = correr(A, CON_ERROR, 2, [], null);
      A.ver(P.anillo, true, finT - 300);
      return;
    }
    if (entra(5)) {
      empezarCorrida(A, ARREGLADA, function () {
        A.ver(P.sobres.vecino1, true, 0);
        A.ver(P.sobres.vecino2, true, 0);
        A.ver(P.sobres.pulperia, false, 0);
        A.ver(P.mal, true, 0);
        A.ver(P.bien, false, 0);
        rastroVisto(A, P.rastro.error, true);
        rastroVisto(A, P.rastro.arreglada, false);
      });
      var finB = correr(A, ARREGLADA, 5, P.rastro.arreglada, P.sobres.pulperia);
      A.ver(P.bien, true, finB - 600);
      return;
    }
    if (n === 1 || n === 2 || n === 3 || n === 5) return;     // el mismo paso otra vez: nada cambia

    /* Los pasos que no corren: todo quieto en su sitio. */
    var hechoTodo = n === 6;
    deGolpe(A, [P.robot], function () { robotEn(A, ordenDe(n), n === 6 ? 5 : 0, n !== 6); });
    P.hechos.forEach(function (h) { A.ver(h, hechoTodo, 0); });
    A.ver(P.flecha, false, 0);
    A.ver(P.anillo, false, 0);
    A.ver(P.sobres.vecino1, n >= 4, 0);
    A.ver(P.sobres.vecino2, n >= 4, 0);
    A.ver(P.sobres.pulperia, n === 6, 0);
    A.ver(P.mal, n >= 4, 0);
    A.ver(P.bien, n === 6, 0);
    rastroVisto(A, P.rastro.error, n >= 4);
    rastroVisto(A, P.rastro.arreglada, n === 6);
  }

  var FRASES = [
    'El robot tiene que dejar el recado en la pulpería, y esta es su lista. ¿En qué casa lo va a dejar?',
    'Hizo las cinco, una por una, y dejó el recado en la casa del vecino. No se saltó ninguna: dobló antes de tiempo.',
    'Con la misma lista, hace lo mismo todas las veces. El robot no tiene cómo saber que esa no era la casa.',
    'Con el camino a la pulpería al lado, se ve dónde se tuerce: en la 2 dobla, y el camino todavía sigue derecho.',
    'Son las mismas cinco. Solo la 2 y la 3 cambian de lugar: primero avanza otra vez, y después dobla.',
    'Ahora dobla en la esquina, y el recado llega a la pulpería.',
    'Las mismas cinco, en otro orden, llevan a otra casa. Escribe la lista para que el robot vuelva a la casa de Marvin.'
  ];
  /* Los rótulos del botón caben en un renglón en un teléfono de 360 px con
     la letra grande. */
  var BOTONES = ['▶ Que siga la lista', '🔁 Otra vez', '🔍 ¿Dónde se tuerce?', '🔀 Cambiar el orden',
    '▶ Que siga la lista', '📝 Tu turno', '↺ Empezar otra vez'];
  var MARCADOR = [['5', 'instrucciones en la lista'], ['0', 'recados en la pulpería'], ['2', 'veces, y las dos en la otra casa'],
    ['2', 'es donde se tuerce'], ['2', 'cambian de lugar'], ['1', 'recado en la pulpería'], ['5', 'instrucciones, en otro orden']];

  AnimacionMision.montar('#amMandado', {
    vista: [ANCHO, ALTO],
    describe: 'A la izquierda, la lista del robot con sus cinco instrucciones; a la derecha, la aldea en casillas, con la casa de Marvin, la casa del vecino y la pulpería.',
    pasos: 7,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
