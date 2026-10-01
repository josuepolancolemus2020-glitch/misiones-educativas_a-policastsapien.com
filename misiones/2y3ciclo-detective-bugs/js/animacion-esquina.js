/* ============================================================
   M.E.T.A.S · Detective de Bugs: la Depuración · Tres veces la misma esquina
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Kenia: su
   robot llegaba siempre a la esquina equivocada, ella borró el programa y
   lo escribió otra vez, tres tardes, y el error estaba en una sola línea
   que venía copiando cada vez. La historia termina diciendo que depurar es
   lo contrario de volver a escribirlo todo: buscar la línea. Eso es lo que
   se ve aquí. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza
   en cada paso.

   A la izquierda, el programa de Kenia: seis líneas, con el número de su
   lugar. A la derecha, un mapa de calles visto desde arriba: el robot sale
   de una esquina y tiene que llegar a la esquina de la bandera.

     0  el robot, la bandera y el programa: ¿a qué esquina va a llegar?;
     1  el programa se hace de arriba abajo, una línea a la vez: el robot
        llega a la esquina de al lado, la equivocada;
     2  Kenia lo borra y lo escribe otra vez, dos tardes más: las palabras
        se borran y vuelven a salir iguales, también la línea que estaba
        mal, y el robot llega a la misma esquina;
     3  con el camino bueno al lado, se hace otra vez mirando cada línea: la
        1 y la 2 van por el camino; en la 3 el robot sigue derecho y el
        camino dobla;
     4  se quita solo la 3, y las otras cinco suben un lugar;
     5  el programa sin la 3: el robot llega a la esquina de la bandera;
     6  los dos resultados a la vista, y la pregunta es del alumno.

   Ocho decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que hace el robot sale del programa, línea por línea.** La
      escena no escribe a qué esquina llega: simula el programa que está en
      el dibujo (AVANZA lo lleva a la esquina siguiente, hacia donde mira;
      GIRA IZQUIERDA lo voltea sin moverlo) y el robot hace eso. La sonda
      vuelve a simular el programa por su cuenta, leyendo el orden de las
      tarjetas en el dibujo.
   2. ⚠️ **El error es una línea DE MÁS, y a propósito.** Las otras formas
      de equivocarse ya están tomadas: GIRA IZQUIERDA donde iba GIRA
      DERECHA es la pregunta de selección del examen, dos líneas cambiadas
      de lugar es la animación del Robot Mensajero, y un REPITE que cuenta
      mal es otra pregunta. Y la animación no NOMBRA el tipo: eso lo enseña
      la tabla de abajo y lo pregunta la prueba.
   3. ⚠️ **Volver a escribirlo todo lo COPIA, y se ve copiarse.** En el paso
      2 las palabras de cada tarjeta se borran y vuelven a salir de arriba
      abajo, iguales: también la 3. Por eso el robot llega a la misma
      esquina, y cada vez queda una ✗ con su tarde al lado.
   4. ⚠️ **La línea se busca con el camino bueno al lado, no se adivina.**
      Se hace el programa otra vez y se mira cada línea: la primera que saca
      al robot del camino es la 3. Cualquiera de los tres AVANZA de arriba
      sobra igual (son iguales), y por eso la frase no dice «la 3 es el
      error»: dice que es la que lo saca del camino.
   5. **Se quita SOLO esa línea, y las otras no se tocan**: suben un lugar,
      como estaban. El número va con el LUGAR, como en la baleada y en el
      recado: el lugar 6 se apaga porque ya no hay sexta línea.
   6. ⚠️ **Lo que la prueba pregunta no se dice ni se dibuja**: ni «bug»,
      ni «depurar», ni los pasos del método por su nombre (observar, leer
      con lupa, señalar, comprobar, ejecutar), ni cuántos son, ni «pista»,
      ni el tipo de error, ni nada que el robot no pueda atravesar: aquí no
      hay árboles, y el robot nunca se sale del mapa.
   7. **Nada se dice solo con color**: el camino bueno va con raya cortada,
      lo que se quita lleva su tachadura, cada esquina donde llegó el robot
      lleva su ✗ o su ✓, lo hecho lleva un ✓ en su lugar, y hacia dónde
      mira el robot lo dice su nariz.
   8. ⚠️ **Dos tardes más son dos robots más.** Una pieza tiene una sola
      demora: el robot que ya llegó a la esquina no puede volver a la salida
      y salir otra vez en el mismo paso. Por eso cada tarde del paso 2 tiene
      su robot, que aparece en la salida y corre más rápido, y las palabras
      de cada tarjeta tienen tres copias: la de la primera tarde, la de la
      segunda y la de la tercera.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amEsquina')) return;

  var ANCHO = 320, ALTO = 216;

  /* Las seis tarjetas de Kenia. Hay cinco AVANZA, así que cada tarjeta
     tiene su clave: el programa se lee por claves, y lo que hace cada una
     por su instrucción. El programa sin la 3 usa las MISMAS tarjetas. */
  var KENIA = ['a1', 'a2', 'a3', 'gi', 'a4', 'a5'];
  var SIN_LA_3 = ['a1', 'a2', 'gi', 'a4', 'a5'];
  var QUITADA = 'a3';
  var TEXTO = { a1: 'AVANZA', a2: 'AVANZA', a3: 'AVANZA', gi: 'GIRA IZQUIERDA', a4: 'AVANZA', a5: 'AVANZA' };
  var HACE = { a1: 'av', a2: 'av', a3: 'av', gi: 'gi', a4: 'av', a5: 'av' };

  /* El programa: el número de cada lugar a la izquierda, la flecha que va
     de línea en línea y la tarjeta. */
  var FILA0 = 34, PASO_Y = 30;
  function filaY(i) { return FILA0 + i * PASO_Y; }
  var NUM_X = 12, FLECHA_X = 25, T0 = 31, T1 = 126;

  /* El mapa: cuatro esquinas por tres, una cuadra entre esquina y esquina.
     El robot camina por las calles y se para en las esquinas. */
  var C = 50, MX = 148, MY = 84;
  function ex(c) { return MX + c * C; }
  function ey(r) { return MY + r * C; }
  var SALIDA = { c: 0, r: 2 }, BANDERA = { c: 2, r: 0 };

  /* Hacia dónde mira el robot: 0 derecha, 1 arriba, 2 izquierda, 3 abajo.
     GIRA IZQUIERDA suma uno. En pantalla, girar a la izquierda es girar al
     revés de las agujas del reloj: −90°. */
  var PASO_DIR = [[1, 0], [0, -1], [-1, 0], [0, 1]];

  /* Lo que hace el programa, línea por línea, desde la salida. */
  function simular(orden) {
    var s = { c: SALIDA.c, r: SALIDA.r, d: 0 }, pasos = [];
    orden.forEach(function (k) {
      var antes = { c: s.c, r: s.r, d: s.d };
      if (HACE[k] === 'av') { s.c += PASO_DIR[s.d][0]; s.r += PASO_DIR[s.d][1]; }
      else if (HACE[k] === 'gi') { s.d = (s.d + 1) % 4; }
      pasos.push({ k: k, hace: HACE[k], antes: antes, despues: { c: s.c, r: s.r, d: s.d } });
    });
    return pasos;
  }
  var FIN_KENIA = simular(KENIA)[KENIA.length - 1].despues;

  /* Cuánto dura cada línea en la corrida. Las dos tardes del paso 2 corren
     más rápido: ya se vio el camino, lo que importa es que es el mismo. */
  var LENTO = 850, RAPIDO = 380, INICIO = 300;
  function horario(cuantas, inicio, dura) {
    var h = [inicio];
    for (var i = 0; i < cuantas; i++) h.push(h[i] + dura);
    return h;
  }
  /* El paso 2, en el reloj: se borra, se escribe línea por línea, corre;
     y otra vez. */
  var T2 = { borra1: 100, escribe2: 450, entra2: 1250, corre2: 1400, sale2: 4100, borra2: 4100, escribe3: 4550, entra3: 5350, corre3: 5500 };
  var LETRA = 100;
  var FIN_CORRE2 = horario(KENIA.length, T2.corre2, RAPIDO)[KENIA.length];
  var FIN_CORRE3 = horario(KENIA.length, T2.corre3, RAPIDO)[KENIA.length];

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }

  /* Un tramo del rastro, de esquina a esquina. */
  function tramo(A, svg, clase, de, a, cual, n) {
    return A.el('path', { d: 'M' + ex(de.c) + ' ' + ey(de.r) + ' L' + ex(a.c) + ' ' + ey(a.r),
      'class': clase, 'data-rastro': cual, 'data-tramo-rastro': n }, svg);
  }

  /* El robot visto desde arriba: el cuerpo, los ojos y la nariz que dice
     hacia dónde mira. Una pieza por línea lo mueve (las de fuera) y otra
     por línea lo voltea (las de dentro, alrededor de su centro). Las dos
     de más afuera solo lo enseñan (al llegar) y lo esconden (al irse): son
     dos piezas porque el robot de la segunda tarde hace las dos cosas en
     el mismo paso. */
  function hacerRobot(A, svg, cual, rapido) {
    var R = { g: A.el('g', { 'data-robot': cual }, svg) };
    R.sale = A.el('g', { 'data-robot-sale': '' }, R.g);
    R.base = A.el('g', { 'data-robot-base': '' }, R.sale);
    var g = R.base;
    R.mueve = [];
    for (var m = 0; m < 6; m++) { g = A.el('g', { 'class': 'am-viaja' + (rapido ? ' db-rapido' : ''), 'data-mueve': m + 1 }, g); R.mueve.push(g); }
    R.voltea = [];
    for (var v = 0; v < 6; v++) { g = A.el('g', { 'class': rapido ? 'db-rapido-gira' : null, 'data-voltea': v + 1 }, g); R.voltea.push(g); }
    A.el('path', { d: 'M9 -5 L17 0 L9 5 Z', 'class': 'db-nariz', 'data-nariz': '' }, g);
    A.el('circle', { cx: 0, cy: 0, r: 10, 'class': 'db-cuerpo', 'data-cuerpo': '' }, g);
    A.el('circle', { cx: 4.6, cy: -3.8, r: 1.7, 'class': 'db-ojo' }, g);
    A.el('circle', { cx: 4.6, cy: 3.8, r: 1.7, 'class': 'db-ojo' }, g);
    return R;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── el programa ──────────────────────────────────────── */
    P.titulo = texto(A, svg, 4, 13, 'am-letra', 11, 'start', 'El programa de Kenia:');
    P.titulo.setAttribute('data-titulo', '');

    P.lugares = [];
    P.hechos = [];
    for (var i = 0; i < 6; i++) {
      var y = filaY(i);
      var gl = A.el('g', { 'data-lugar': i + 1 }, svg);
      A.el('circle', { cx: NUM_X, cy: y, r: 8, 'class': 'am-ficha' }, gl);
      var d = texto(A, gl, NUM_X, y + 3.6, 'am-digito', 10, 'middle', String(i + 1));
      d.setAttribute('data-numero', i + 1);
      P.lugares.push(gl);
      /* lo hecho: un ✓ en su lugar, donde estuvo la flecha */
      P.hechos.push(A.el('path', { d: 'M' + (FLECHA_X - 4) + ' ' + y + ' l2.6 2.8 l4.8 -5.6', 'class': 'db-hecho', 'data-hecho': i + 1 }, svg));
    }

    /* Las tarjetas. Cada una lleva tres copias de sus palabras (la de cada
       tarde) y la tachadura con que se quita la de más. */
    P.tarjetas = {};
    KENIA.forEach(function (k) {
      var g = A.el('g', { 'data-instruccion': k }, svg);
      var quita = A.el('g', { 'data-quita': '' }, g);
      var marco = A.el('rect', { x: T0, y: -12, width: T1 - T0, height: 24, rx: 6, 'class': 'db-tarjeta' }, quita);
      var resalte = A.el('rect', { x: T0 - 1.5, y: -13.5, width: T1 - T0 + 3, height: 27, rx: 7, 'class': 'db-resalte' }, quita);
      var t1 = texto(A, quita, T0 + 7, 4, 'am-letra db-orden', 11, 'start', TEXTO[k]);
      var t2fuera = A.el('g', null, quita);
      var t2 = texto(A, t2fuera, T0 + 7, 4, 'am-letra db-orden', 11, 'start', TEXTO[k]);
      var t3 = texto(A, quita, T0 + 7, 4, 'am-letra db-orden', 11, 'start', TEXTO[k]);
      t1.setAttribute('data-copia', 1);
      t2.setAttribute('data-copia', 2);
      t3.setAttribute('data-copia', 3);
      var tacha = A.el('path', { d: 'M' + (T0 + 4) + ' 0 L' + (T1 - 4) + ' 0', 'class': 'db-tacha', 'data-tacha': '' }, quita);
      P.tarjetas[k] = { g: g, quita: quita, marco: marco, resalte: resalte, t1: t1, t2fuera: t2fuera, t2: t2, t3: t3, tacha: tacha };
    });

    /* La flecha que va haciendo el programa: una pieza por cada lugar que
       baja, una dentro de otra, y cada una con su demora. */
    P.flecha = A.el('g', { 'data-flecha': '' }, svg);
    P.flechaFin = A.el('g', { 'data-flecha-fin': '' }, P.flecha);
    var paso = P.flechaFin;
    P.flechaPasos = [];
    for (var j = 1; j < 6; j++) {
      paso = A.el('g', { 'data-flecha-baja': j }, paso);
      P.flechaPasos.push(paso);
    }
    A.el('path', { d: 'M' + (FLECHA_X - 5) + ' ' + (FILA0 - 5.5) + ' L' + (FLECHA_X + 3) + ' ' + FILA0 +
      ' L' + (FLECHA_X - 5) + ' ' + (FILA0 + 5.5) + ' Z', 'class': 'db-flecha' }, paso);

    /* ── el mapa ──────────────────────────────────────────── */
    A.el('rect', { x: ex(0) - 8, y: ey(0) - 8, width: 3 * C + 16, height: 2 * C + 16, rx: 6, 'class': 'db-calles', 'data-mapa': '' }, svg);
    for (var bc = 0; bc < 3; bc++) {
      for (var br = 0; br < 2; br++) {
        A.el('rect', { x: ex(bc) + 8, y: ey(br) + 8, width: C - 16, height: C - 16, rx: 4, 'class': 'db-manzana', 'data-manzana': bc + ',' + br }, svg);
      }
    }
    for (var ec = 0; ec < 4; ec++) {
      for (var er = 0; er < 3; er++) {
        A.el('circle', { cx: ex(ec), cy: ey(er), r: 2.2, 'class': 'db-esquina', 'data-esquina': ec + ',' + er }, svg);
      }
    }

    /* El camino que TENÍA que hacer: de la salida a la esquina de la
       bandera, con raya cortada y su punta. */
    P.ruta = A.el('g', { 'data-ruta': '' }, svg);
    A.el('path', { d: 'M' + ex(SALIDA.c) + ' ' + ey(SALIDA.r) + ' L' + ex(BANDERA.c) + ' ' + ey(SALIDA.r) + ' L' + ex(BANDERA.c) + ' ' + (ey(BANDERA.r) + 14),
      'class': 'db-ruta', 'data-ruta-linea': '' }, P.ruta);
    A.el('path', { d: 'M' + (ex(BANDERA.c) - 5) + ' ' + (ey(BANDERA.r) + 20) + ' L' + ex(BANDERA.c) + ' ' + (ey(BANDERA.r) + 13) +
      ' L' + (ex(BANDERA.c) + 5) + ' ' + (ey(BANDERA.r) + 20), 'class': 'db-ruta-punta' }, P.ruta);

    /* El rastro de cada programa: un tramo por cada AVANZA. */
    P.rastro = { kenia: [], bien: [] };
    simular(KENIA).filter(function (s) { return s.hace === 'av'; }).forEach(function (s, n) {
      P.rastro.kenia.push(tramo(A, svg, 'db-rastro db-rastro-kenia', s.antes, s.despues, 'kenia', n + 1));
    });
    simular(SIN_LA_3).filter(function (s) { return s.hace === 'av'; }).forEach(function (s, n) {
      P.rastro.bien.push(tramo(A, svg, 'db-rastro db-rastro-bien', s.antes, s.despues, 'bien', n + 1));
    });

    /* La bandera, plantada en la acera de su esquina, del lado donde el
       robot no la tapa. */
    var fx = ex(BANDERA.c) - 12, fy = ey(BANDERA.r) - 10;
    P.bandera = A.el('g', { 'data-bandera': '' }, svg);
    A.el('path', { d: 'M' + fx + ' ' + fy + ' L' + fx + ' ' + (fy - 28), 'class': 'db-asta', 'data-asta': '' }, P.bandera);
    A.el('path', { d: 'M' + fx + ' ' + (fy - 28) + ' L' + (fx - 16) + ' ' + (fy - 22) + ' L' + fx + ' ' + (fy - 16) + ' Z', 'class': 'db-tela' }, P.bandera);

    /* Lo que dice cada esquina: una ✗ por cada tarde en la equivocada, con
       su tarde al lado, y el ✓ junto a la bandera. */
    P.males = [0, 1, 2].map(function (q) {
      var x = ex(FIN_KENIA.c), y = ey(FIN_KENIA.r) - 26 - q * 12;
      var g = A.el('g', { 'data-mal': q + 1 }, svg);
      A.el('path', { d: 'M' + (x - 4) + ' ' + (y - 4) + ' l8 8 m0 -8 l-8 8', 'class': 'db-mal', 'data-cruz': '' }, g);
      texto(A, g, x - 8, y + 3.3, 'am-rotulo', 9.5, 'end', 'tarde ' + (q + 1)).setAttribute('data-tarde', q + 1);
      return g;
    });
    P.bien = A.el('path', { d: 'M' + (fx - 30) + ' ' + (fy - 18) + ' l3.6 4 l7 -9', 'class': 'db-bien', 'data-marca': 'bien' }, svg);

    /* El anillo del paso 3: donde el robot sigue derecho y el camino dobla. */
    var sale = simular(KENIA)[2].despues;
    P.anillo = A.el('circle', { cx: ex(sale.c), cy: ey(sale.r), r: 14, 'class': 'db-anillo', 'data-anillo': '' }, svg);

    /* ── los robots: el de siempre y uno por cada tarde de más ── */
    P.r1 = hacerRobot(A, svg, '1', false);
    P.r2 = hacerRobot(A, svg, '2', true);
    P.r3 = hacerRobot(A, svg, '3', true);
  }

  /* Pone de golpe, sin movimiento: así una corrida se vuelve a ver entera
     cada vez que se entra en su paso, también volviendo con «Atrás». */
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  /* El robot quieto donde lo dejan las primeras `hechas` líneas. */
  function robotEn(A, R, orden, hechas) {
    var sim = simular(orden);
    A.mover(R.base, ex(SALIDA.c), ey(SALIDA.r), 0, 1, 0);
    for (var i = 0; i < 6; i++) {
      var s = sim[i];
      var mueve = !!s && i < hechas && s.hace === 'av', voltea = !!s && i < hechas && s.hace === 'gi';
      A.mover(R.mueve[i], mueve ? PASO_DIR[s.antes.d][0] * C : 0, mueve ? PASO_DIR[s.antes.d][1] * C : 0, 0, 1, 0);
      A.mover(R.voltea[i], 0, 0, voltea ? -90 : 0, 1, 0);
    }
  }

  /* La corrida: la flecha va de lugar en lugar y el robot hace lo que dice
     la tarjeta que hay en ese lugar. El robot no sabe el orden: lo lee del
     programa, línea por línea, y por eso la misma función hace todas las
     corridas. `hasta` es cuántas se hacen (la del paso 3 se detiene en la
     3). Devuelve cuándo termina. */
  function correr(A, R, orden, hasta, o) {
    var h = horario(orden.length, o.inicio, o.dura), sim = simular(orden), av = 0;
    if (o.flecha) {
      A.ver(P.flecha, true, h[0] - 200);
      P.flechaPasos.forEach(function (g, i) { A.mover(g, 0, i + 1 < hasta ? PASO_Y : 0, 0, 1, h[i + 1]); });
      A.ver(P.flechaFin, hasta < orden.length, hasta < orden.length ? 0 : h[orden.length]);
      /* ✓ en lo hecho. Si la corrida se detiene, la flecha se queda en la
         última que hizo y esa no lleva ✓: quedaría escondido debajo. */
      P.hechos.forEach(function (hecho, i) {
        var si = i < hasta && (hasta === orden.length || i < hasta - 1);
        A.ver(hecho, si, si ? h[i + 1] : 0);
      });
    }
    for (var i = 0; i < hasta; i++) {
      var s = sim[i], ti = h[i] + 50;
      if (s.hace === 'av') {
        A.mover(R.mueve[i], PASO_DIR[s.antes.d][0] * C, PASO_DIR[s.antes.d][1] * C, 0, 1, ti);
        var t = o.rastro && o.rastro[av];
        av++;
        if (t) { A.ver(t, true, ti); A.trazar(t, true, ti); }
      } else if (s.hace === 'gi') {
        A.mover(R.voltea[i], 0, 0, -90, 1, ti);
      }
    }
    return h[hasta];
  }

  function rastroVisto(A, lista, si) {
    lista.forEach(function (t) { A.ver(t, si, 0); A.trazar(t, si, 0); });
  }

  /* Qué copia de las palabras se ve: 1 la de la primera tarde, 3 la de la
     tercera. La de la segunda solo se ve a mitad del paso 2. */
  function copias(A, cual) {
    KENIA.forEach(function (k) {
      var c = P.tarjetas[k];
      A.ver(c.t1, cual === 1, 0);
      A.ver(c.t2fuera, true, 0);
      A.ver(c.t2, false, 0);
      A.ver(c.t3, cual === 3, 0);
    });
  }

  function ordenDe(n) { return n >= 4 ? SIN_LA_3 : KENIA; }

  /* Las tarjetas en su lugar. La que se quita se queda en el suyo mientras
     se apaga; las de abajo suben cuando ella ya se fue. */
  var T4 = { tacha: 250, quita: 1000, suben: 1400 };
  function ponerTarjetas(A, n, antes, quieto) {
    var orden = ordenDe(n), sube = !quieto && n === 4 && antes === 3;
    KENIA.forEach(function (k) {
      var c = P.tarjetas[k], i = orden.indexOf(k);
      if (i < 0) i = KENIA.indexOf(k);
      A.mover(c.g, 0, filaY(i), 0, 1, sube ? T4.suben : (quieto ? 0 : 300));
      if (k !== QUITADA) A.ver(c.tacha, false, 0);
    });
    var qt = P.tarjetas[QUITADA];
    var fuera = n >= 4;
    A.ver(qt.quita, !fuera, sube ? T4.quita : 0);
    A.trazar(qt.tacha, fuera, sube ? T4.tacha : 0);
    A.ver(qt.tacha, fuera, sube ? T4.tacha : 0);
    A.ver(P.lugares[5], !fuera, sube ? T4.suben : 0);
  }

  /* Todo lo que cambia de un paso a otro, puesto de golpe: así se entra en
     cada paso desde cualquier lado y la corrida empieza limpia. */
  function todo() {
    var lista = [P.r1.g, P.r2.g, P.r3.g, P.flecha, P.anillo, P.bien, P.ruta]
      .concat(P.hechos, P.lugares, P.males, P.rastro.kenia, P.rastro.bien);
    KENIA.forEach(function (k) { lista.push(P.tarjetas[k].g); });
    return lista;
  }

  function base(A, s) {
    deGolpe(A, todo(), function () {
      ponerTarjetas(A, s.n, s.n, true);
      copias(A, s.copia);
      KENIA.forEach(function (k) { A.ver(P.tarjetas[k].resalte, k === s.resalte, 0); });
      robotEn(A, P.r1, s.orden, s.hechas);
      A.ver(P.r1.g, s.r1, 0);
      robotEn(A, P.r2, KENIA, 0);
      robotEn(A, P.r3, KENIA, s.r3 ? KENIA.length : 0);
      A.ver(P.r2.g, false, 0);
      A.ver(P.r3.g, !!s.r3, 0);
      [P.r1, P.r2, P.r3].forEach(function (R) { A.ver(R.sale, true, 0); });
      A.ver(P.flecha, false, 0);
      A.ver(P.flechaFin, true, 0);
      P.flechaPasos.forEach(function (g) { A.mover(g, 0, 0, 0, 1, 0); });
      P.hechos.forEach(function (h, i) { A.ver(h, i < s.tics, 0); });
      P.males.forEach(function (g, i) { A.ver(g, i < s.males, 0); });
      A.ver(P.bien, s.bien, 0);
      A.ver(P.anillo, false, 0);
      A.ver(P.ruta, s.ruta, 0);
      rastroVisto(A, P.rastro.kenia, s.kenia);
      rastroVisto(A, P.rastro.bien, s.conBien);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Las corridas se cuentan solo al ENTRAR en su paso; los pasos quietos
       (0, 4 y 6) se pintan siempre, también el primer pintado, que llega
       con antes === n. */
    if ((n === 1 || n === 2 || n === 3 || n === 5) && !entra(n)) return;

    if (n === 0) {
      base(A, { n: 0, copia: 1, orden: KENIA, hechas: 0, r1: true, tics: 0, males: 0, bien: false, ruta: false, kenia: false, conBien: false });
      return;
    }
    if (n === 1) {
      base(A, { n: 1, copia: 1, orden: KENIA, hechas: 0, r1: true, tics: 0, males: 0, bien: false, ruta: false, kenia: false, conBien: false });
      var fin = correr(A, P.r1, KENIA, KENIA.length, { inicio: INICIO, dura: LENTO, flecha: true, rastro: P.rastro.kenia });
      A.ver(P.males[0], true, fin);
      return;
    }
    if (n === 2) {
      /* Arranca donde terminó la primera tarde, y el robot de esa tarde se
         va antes de que se borre nada. */
      base(A, { n: 2, copia: 1, orden: KENIA, hechas: KENIA.length, r1: true, tics: 0, males: 1, bien: false, ruta: false, kenia: true, conBien: false });
      A.ver(P.r1.g, false, 0);
      KENIA.forEach(function (k, i) {
        var c = P.tarjetas[k];
        A.ver(c.t1, false, T2.borra1);
        A.ver(c.t2, true, T2.escribe2 + i * LETRA);
        A.ver(c.t2fuera, false, T2.borra2);
        A.ver(c.t3, true, T2.escribe3 + i * LETRA);
      });
      A.ver(P.r2.g, true, T2.entra2);
      correr(A, P.r2, KENIA, KENIA.length, { inicio: T2.corre2, dura: RAPIDO, flecha: false });
      A.ver(P.males[1], true, FIN_CORRE2 + 20);
      A.ver(P.r3.g, true, T2.entra3);
      correr(A, P.r3, KENIA, KENIA.length, { inicio: T2.corre3, dura: RAPIDO, flecha: false });
      A.ver(P.males[2], true, FIN_CORRE3 + 20);
      /* el de la segunda tarde se va cuando se borra otra vez */
      A.ver(P.r2.sale, false, T2.sale2);
      return;
    }
    if (n === 3) {
      base(A, { n: 3, copia: 3, orden: KENIA, hechas: 0, r1: true, tics: 0, males: 3, bien: false, ruta: true, kenia: false, conBien: false });
      var finT = correr(A, P.r1, KENIA, 3, { inicio: INICIO + 400, dura: LENTO, flecha: true, rastro: null });
      A.ver(P.anillo, true, finT - 300);
      var h3 = horario(KENIA.length, INICIO + 400, LENTO);
      A.ver(P.tarjetas[QUITADA].resalte, true, h3[2] + 400);
      return;
    }
    if (n === 4) {
      base(A, { n: antes === 3 ? 3 : 4, copia: 3, orden: KENIA, hechas: 0, r1: true, tics: 0, males: 3, bien: false, ruta: true, kenia: false, conBien: false, resalte: QUITADA });
      ponerTarjetas(A, 4, antes, false);
      return;
    }
    if (n === 5) {
      base(A, { n: 5, copia: 3, orden: SIN_LA_3, hechas: 0, r1: true, tics: 0, males: 3, bien: false, ruta: true, kenia: false, conBien: false });
      var finB = correr(A, P.r1, SIN_LA_3, SIN_LA_3.length, { inicio: INICIO, dura: LENTO, flecha: true, rastro: P.rastro.bien });
      A.ver(P.bien, true, finB);
      return;
    }
    /* el 6: los dos resultados a la vista */
    base(A, { n: 6, copia: 3, orden: SIN_LA_3, hechas: SIN_LA_3.length, r1: true, tics: SIN_LA_3.length, males: 3, bien: true, ruta: true, kenia: true, conBien: true });
  }

  var FRASES = [
    'El robot de Kenia tiene que llegar a la esquina de la bandera, y este es su programa. ¿A qué esquina va a llegar?',
    'Hizo las seis líneas, una por una, y llegó a la esquina de al lado. Esa no era.',
    'Kenia lo borró y lo escribió otra vez. Y otra vez. Copió también la línea mala, y el robot volvió a la misma esquina.',
    'Con el camino bueno al lado, se mira cada línea: en la 3, el robot sigue derecho, y el camino dobla.',
    'Se quita solo la 3. Las otras cinco no se tocan: suben un lugar, tal como estaban.',
    'Ahora el robot sí llega a la esquina de la bandera. El error estaba en una sola línea.',
    'Escribe los pasos para ir de tu pupitre a la puerta, y que un compañero los siga. Si se pierde, busquen la línea.'
  ];
  /* Los rótulos del botón caben en un renglón en un teléfono de 360 px con
     la letra grande. */
  var BOTONES = ['▶ Que arranque', '📝 Escribirlo otra vez', '🔍 ¿Dónde se sale?', '✂️ Quitar la 3',
    '▶ Que arranque', '📝 Tu turno', '↺ Empezar otra vez'];
  var MARCADOR = [['6', 'líneas en el programa'], ['1', 'vez en la esquina equivocada'], ['3', 'veces en la misma esquina'],
    ['3', 'es la que lo saca del camino'], ['5', 'líneas: se quitó una'], ['1', 'vez en la esquina de la bandera'],
    ['3', 'tardes por una sola línea']];

  AnimacionMision.montar('#amEsquina', {
    vista: [ANCHO, ALTO],
    describe: 'A la izquierda, el programa de Kenia con sus seis líneas; a la derecha, un mapa de calles con el robot en una esquina y una bandera en la esquina adonde tiene que llegar.',
    pasos: 7,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
