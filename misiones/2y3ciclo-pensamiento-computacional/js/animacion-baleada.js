/* ============================================================
   M.E.T.A.S · El Pensamiento Computacional · Las baleadas de Kenia
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Kenia: la
   dejaron haciendo las baleadas, hizo todos los pasos que había visto
   hacer, sin saltarse ni uno, pero untó los frijoles primero y echó la
   tortilla al comal después. Los frijoles se quemaron en el comal, la masa
   quedó cruda y ese día no hubo almuerzo. La historia dice que no le faltó
   ningún paso: se le cambiaron de orden dos. Eso es lo que se ve aquí. El
   aparato (botones, frase, marcador) vive en js/animacion-mision.js; aquí
   solo está el dibujo y dónde va cada pieza en cada paso.

   A la izquierda, los cinco pasos en una lista, con el número de su lugar;
   a la derecha, la cocina: la mesa, el comal en su fogón y dos platos.

     0  los pasos de Kenia, en su orden: son cinco y no falta ninguno;
     1  la lista se hace paso a paso (una flecha va de uno en uno y deja un
        ✓): los frijoles quedan abajo y se queman, la masa queda cruda y el
        plato se queda con una ✗;
     2  los mismos cinco pasos, y dos cambian de lugar;
     3  la lista se hace otra vez: la tortilla se cuece sola y los frijoles
        van encima de la tortilla ya cocida; el otro plato lleva un ✓;
     4  los dos platos, uno al lado del otro: los mismos pasos, en otro
        orden, dan otra cosa. Y la pregunta es del alumno.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Las dos listas son las MISMAS cinco tarjetas.** No se escribe una
      lista nueva: las dos que cambian de lugar se ven moverse, y la sonda
      lee las tarjetas del dibujo y comprueba que sean las mismas cinco, que
      no falte ni sobre ninguna y que solo dos cambien de sitio. Si la
      segunda lista se escribiera aparte, bastaría una errata para que la
      pantalla dijera «los mismos pasos» con pasos distintos.
   2. ⚠️ **El número va con el LUGAR, no con la tarjeta.** Los números 1 a 5
      se quedan quietos y las tarjetas se mueven: así «cambiar el orden» es
      cambiar de lugar, que es lo que la historia dice.
   3. ⚠️ **Los frijoles quedan ABAJO, contra el comal.** La historia dice que
      se quemaron en el comal y que la masa quedó cruda, y eso solo pasa si
      los frijoles quedaron entre el comal y la masa. Por eso la tortilla se
      voltea al caer en el comal, que es como se echa una tortilla, en las
      DOS corridas: el paso «cocerla en el comal» es el mismo en las dos, y
      lo único distinto es lo que la tortilla lleva encima cuando llega.
   4. **La lista se hace de arriba abajo, una a una.** La flecha va por los
      pasos en el orden en que están y deja un ✓ en cada uno: es lo que hace
      quien sigue una lista, y lo que hace una máquina con un programa.
   5. ⚠️ **Lo que pregunta la prueba no se dice**: ni «algoritmo», ni qué es
      una instrucción, ni verbos, ni patrones. El nombre de lo que se ve lo
      da la tarjeta de abajo, que lo explica.
   6. **Nada se dice solo con color**: la masa cruda es lisa y la cocida
      lleva sus manchas tostadas, lo quemado echa humo, cada plato lleva su
      ✗ o su ✓ y su rótulo, y lo hecho lleva un ✓ en su lugar.

   ⚠️ **La misión es bilingüe, y la animación también.** El motor de idioma
   no la traduce (js/animacion-mision.js lo cuenta): aquí están escritos los
   dos idiomas, y `idioma()` cambia los rótulos del dibujo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amBaleada')) return;

  var ANCHO = 320, ALTO = 216;
  var lang = 'es';

  /* Los cinco pasos, con su nombre en los dos idiomas. Las dos listas usan
     los MISMOS cinco: solo cambian dos de lugar. */
  var PASOS = {
    amasar: { es: 'Amasar la harina', en: 'Knead the flour' },
    hacer: { es: 'Hacer la tortilla', en: 'Shape the tortilla' },
    cocer: { es: 'Cocerla en el comal', en: 'Cook it on the griddle' },
    untar: { es: 'Untar los frijoles', en: 'Spread the beans' },
    doblar: { es: 'Doblarla', en: 'Fold it' }
  };
  var DE_KENIA = ['amasar', 'hacer', 'untar', 'cocer', 'doblar'];
  var DE_RECETA = ['amasar', 'hacer', 'cocer', 'untar', 'doblar'];
  var CLAVES = ['amasar', 'hacer', 'cocer', 'untar', 'doblar'];

  var RS = {
    tituloK: { es: 'Así lo hizo Kenia:', en: 'How Kenia did it:' },
    tituloR: { es: 'Con los mismos pasos:', en: 'With the same steps:' },
    capK: { es: 'cruda y quemada', en: 'raw and burned' },
    capR: { es: '¡baleada!', en: 'baleada!' },
    cambian: { es: 'cambiaron de lugar', en: 'swapped places' },
    comal: { es: 'comal', en: 'griddle' }
  };

  /* La lista: el número de cada lugar a la izquierda, la flecha que va de
     paso en paso y la tarjeta. */
  var FILA0 = 36, PASO_Y = 34;
  function filaY(i) { return FILA0 + i * PASO_Y; }
  var NUM_X = 12, FLECHA_X = 25, T0 = 31, T1 = 167;

  /* La cocina. */
  var TAZON = { x: 194, y: 83 };
  var MESA = { x: 266, y: 84 };
  var COMAL = { x: 246, y: 150 };
  var PLATO_K = { x: 212, y: 33 }, PLATO_R = { x: 282, y: 33 };

  /* Cuánto dura cada paso en la corrida, y a qué hora empieza cada lugar
     de la lista. No duran lo mismo a propósito: en el comal es donde pasa
     lo que importa, y con el mismo tiempo para todos la tortilla de Kenia
     salía del comal apenas llegaba y el humo duraba un tercio de segundo. */
  var DURA = { amasar: 800, hacer: 1000, untar: 1000, cocer: 1500, doblar: 1100 };
  var INICIO = 250;
  function horario(orden) {
    var h = [INICIO];
    for (var i = 0; i < orden.length; i++) h.push(h[i] + DURA[orden[i]]);
    return h;
  }

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── la lista ─────────────────────────────────────────── */
    P.tituloK = texto(A, svg, 4, 13, 'am-letra', 11, 'start', '');
    P.tituloR = texto(A, svg, 4, 13, 'am-letra', 11, 'start', '');
    P.tituloK.setAttribute('data-titulo', 'kenia');
    P.tituloR.setAttribute('data-titulo', 'receta');

    P.hechos = [];
    for (var i = 0; i < 5; i++) {
      var y = filaY(i);
      A.el('circle', { cx: NUM_X, cy: y, r: 8, 'class': 'am-ficha', 'data-lugar': i + 1 }, svg);
      var d = texto(A, svg, NUM_X, y + 3.6, 'am-digito', 10, 'middle', String(i + 1));
      d.setAttribute('data-numero', i + 1);
      /* lo hecho: un ✓ en su lugar, donde estuvo la flecha */
      var h = A.el('path', { d: 'M' + (FLECHA_X - 4) + ' ' + y + ' l2.6 2.8 l4.8 -5.6', 'class': 'pc-hecho', 'data-hecho': i + 1 }, svg);
      P.hechos.push(h);
    }

    /* Las tarjetas: una por paso, y cada una en su lugar. La que baja al
       cambiar de orden se aparta un poco a la derecha para pasar por
       delante de la otra: si bajaran las dos por el mismo sitio, a medio
       camino una taparía a la otra entera. */
    P.tarjetas = {};
    CLAVES.forEach(function (k) {
      var g = A.el('g', { 'data-paso': k }, svg);
      var ida = A.el('g', null, g);
      var vuelta = A.el('g', null, ida);
      var marco = A.el('rect', { x: T0, y: -13, width: T1 - T0, height: 26, rx: 7, 'class': 'pc-tarjeta' }, vuelta);
      var resalte = A.el('rect', { x: T0 - 1.5, y: -14.5, width: T1 - T0 + 3, height: 29, rx: 8, 'class': 'pc-resalte' }, vuelta);
      var txt = texto(A, vuelta, T0 + 7, 4, 'am-letra pc-paso', 11.5, 'start', '');
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
      ' L' + (FLECHA_X - 5) + ' ' + (FILA0 + 5.5) + ' Z', 'class': 'pc-flecha' }, paso);

    /* La llave del paso 4: los dos que cambiaron de lugar. */
    P.llave = A.el('g', { 'data-llave': '' }, svg);
    A.el('path', { d: 'M' + (T1 + 2) + ' ' + (filaY(2) - 12) + ' h3 V' + (filaY(3) + 12) + ' h-3', 'class': 'pc-llave' }, P.llave);
    P.cambian = texto(A, P.llave, T1 + 8, (filaY(2) + filaY(3)) / 2 + 3, 'am-rotulo', 9, 'start', '');
    P.cambian.setAttribute('data-rotulo', 'cambian');

    /* ── la cocina ────────────────────────────────────────── */
    /* los dos platos */
    [PLATO_K, PLATO_R].forEach(function (p, i) {
      A.el('ellipse', { cx: p.x, cy: p.y + 5, rx: 32, ry: 9, 'class': 'pc-plato', 'data-plato': i === 0 ? 'kenia' : 'receta' }, svg);
      A.el('ellipse', { cx: p.x, cy: p.y + 5, rx: 23, ry: 6, 'class': 'pc-plato-fondo' }, svg);
    });
    /* la mesa */
    A.el('path', { d: 'M176 70 L314 70 L312 102 L178 102 Z', 'class': 'pc-mesa', 'data-mesa': '' }, svg);
    A.el('path', { d: 'M178 102 L312 102 L312 107 L178 107 Z', 'class': 'pc-mesa-canto' }, svg);
    /* el tazón, con la harina y después la masa */
    A.el('path', { d: 'M' + (TAZON.x - 16) + ' ' + TAZON.y + ' A16 12 0 0 0 ' + (TAZON.x + 16) + ' ' + TAZON.y + ' Z', 'class': 'pc-tazon', 'data-tazon': '' }, svg);
    P.harina = A.el('path', { d: 'M' + (TAZON.x - 12) + ' ' + TAZON.y + ' Q' + TAZON.x + ' ' + (TAZON.y - 12) + ' ' + (TAZON.x + 12) + ' ' + TAZON.y + ' Z',
      'class': 'pc-harina', 'data-harina': '' }, svg);
    A.el('ellipse', { cx: TAZON.x, cy: TAZON.y, rx: 16, ry: 3.4, 'class': 'pc-tazon-boca' }, svg);
    /* La masa aparece en el tazón y se va a la mesa: dos piezas, una que se
       enciende y otra que se apaga, porque en la corrida pasan las dos. */
    P.masa = A.el('g', { 'data-masa': '' }, svg);
    P.masaSe = A.el('g', null, P.masa);
    P.masaVa = A.el('g', null, P.masaSe);
    A.el('ellipse', { cx: 0, cy: -3, rx: 8, ry: 6.5, 'class': 'pc-masa' }, P.masaVa);

    /* el fogón y el comal */
    A.el('path', { d: 'M190 158 L302 158 L298 208 L194 208 Z', 'class': 'pc-fogon' }, svg);
    A.el('path', { d: 'M214 174 Q246 162 278 174 L278 200 L214 200 Z', 'class': 'pc-boca' }, svg);
    A.el('path', { d: 'M226 200 Q230 184 236 190 Q240 176 246 188 Q252 178 256 191 Q262 184 266 200 Z', 'class': 'pc-fuego' }, svg);
    A.el('path', { d: 'M236 200 Q240 191 244 195 Q247 187 250 195 Q254 190 256 200 Z', 'class': 'pc-fuego-2' }, svg);
    A.el('ellipse', { cx: COMAL.x, cy: COMAL.y + 4, rx: 52, ry: 12, 'class': 'pc-comal', 'data-comal': '' }, svg);
    /* El nombre va arriba de la orilla DERECHA del comal. A la izquierda,
       en el paso 4 quedaba justo debajo de «cambiaron de lugar» y los dos
       se leían como un solo rótulo de dos renglones. */
    P.comalRot = texto(A, svg, 312, 137, 'am-rotulo', 9, 'end', '');
    P.comalRot.setAttribute('data-rotulo', 'comal');

    /* el humo de lo quemado: se enciende y se apaga en la misma corrida */
    P.humo = A.el('g', { 'data-humo': '' }, svg);
    P.humoSe = A.el('g', null, P.humo);
    [[-14, -6, 4], [0, -14, 5], [14, -7, 4.2], [-6, -24, 3.6], [8, -28, 3.2]].forEach(function (c) {
      A.el('circle', { cx: COMAL.x + c[0], cy: COMAL.y + c[1], r: c[2], 'class': 'pc-humo' }, P.humoSe);
    });

    /* ── las dos tortillas: la de Kenia y la de la receta ── */
    P.K = tortilla(A, svg, 'kenia');
    P.R = tortilla(A, svg, 'receta');

    /* lo que dice cada plato */
    P.mal = A.el('path', { d: 'M' + (PLATO_K.x + 24) + ' 8 l9 9 m0 -9 l-9 9', 'class': 'pc-mal', 'data-marca': 'mal' }, svg);
    P.bien = A.el('path', { d: 'M' + (PLATO_R.x + 22) + ' 13 l3.6 4 l7 -9', 'class': 'pc-bien', 'data-marca': 'bien' }, svg);
    P.capK = texto(A, svg, PLATO_K.x, 60, 'am-rotulo', 9.5, 'middle', '');
    P.capR = texto(A, svg, PLATO_R.x, 60, 'am-rotulo', 9.5, 'middle', '');
    P.capK.setAttribute('data-rotulo', 'kenia');
    P.capR.setAttribute('data-rotulo', 'receta');
    /* los rótulos, en el idioma de la página (en una bilingüe el aparato lo
       vuelve a pedir cada vez que se cambia) */
    idioma(A.idioma ? A.idioma() : 'es');
  }

  /* Una tortilla, dibujada alrededor de (0, 0). Lleva todo lo que puede
     llegar a ser: la masa cruda, la cocida (con sus manchas tostadas), los
     frijoles encima, los frijoles quemados debajo y la baleada doblada.

     ⚠️ Cada cosa que pasa en la corrida va en su PROPIA pieza, porque una
     pieza tiene una sola demora: si la misma tortilla apareciera en la mesa
     y viajara al comal, las dos cosas esperarían lo mismo y la tortilla
     saldría de la nada ya en el comal. Por eso la tortilla aparece con una
     pieza y viaja con otras tres, una dentro de otra (al comal, de vuelta a
     la mesa y al plato), y lo que en la misma corrida se enciende y se
     apaga (los frijoles, la masa cocida, lo quemado) va en dos: una que se
     enciende y otra, dentro, que se apaga. Es la lección de las capas de
     la numeración maya. */
  function tortilla(A, svg, cual) {
    var t = {};
    t.g = A.el('g', { 'data-tortilla': cual }, svg);
    t.base = A.el('g', null, t.g);
    t.alComal = A.el('g', { 'data-viaje': 'comal' }, t.base);
    t.aLaMesa = A.el('g', { 'data-viaje': 'mesa' }, t.alComal);
    t.alPlato = A.el('g', { 'data-viaje': 'plato' }, t.aLaMesa);
    function dos(capa) {
      var se = A.el('g', { 'data-capa': capa }, t.alPlato);
      var va = A.el('g', null, se);
      return { se: se, va: va };
    }
    t.quemado = dos('quemados');
    A.el('ellipse', { cx: 0, cy: 2.6, rx: 24, ry: 7.5, 'class': 'pc-quemado' }, t.quemado.va);
    t.vuelta = A.el('g', { 'class': 'pc-vuelta', 'data-vuelta': '' }, t.alPlato);
    t.cruda = A.el('ellipse', { cx: 0, cy: 0, rx: 24, ry: 7.5, 'class': 'pc-cruda', 'data-capa': 'cruda' }, t.vuelta);
    t.cocida = dos('cocida');
    t.vuelta.appendChild(t.cocida.se);
    A.el('ellipse', { cx: 0, cy: 0, rx: 24, ry: 7.5, 'class': 'pc-cocida' }, t.cocida.va);
    [[-11, -1.6, 3, 1.3], [5, -3, 2.4, 1.1], [12, 1.8, 2.8, 1.2], [-3, 3, 2.2, 1], [-16, 2.4, 1.8, 0.9]].forEach(function (m) {
      A.el('ellipse', { cx: m[0], cy: m[1], rx: m[2], ry: m[3], 'class': 'pc-tostado' }, t.cocida.va);
    });
    t.frijoles = dos('frijoles');
    A.el('ellipse', { cx: 0, cy: -0.6, rx: 17, ry: 4.8, 'class': 'pc-frijol' }, t.frijoles.va);
    /* doblada: la baleada vista de lado, con lo de dentro asomando abajo,
       por donde se abre. De lado y no desde arriba: doblada y vista desde
       arriba es media tortilla de ocho puntos de alto, y en un teléfono no
       se distinguía la cruda de la cocida. */
    t.doblada = A.el('g', { 'data-capa': 'doblada' }, t.alPlato);
    A.el('path', { d: 'M-22 3 A22 13 0 0 1 22 3 Z', 'class': cual === 'kenia' ? 'pc-cruda' : 'pc-cocida',
      'data-masa': cual === 'kenia' ? 'cruda' : 'cocida' }, t.doblada);
    if (cual === 'receta') {
      [[-10, -3, 2.8, 1.6], [5, -6.5, 2.4, 1.4], [13, -1, 2.2, 1.3], [-2, 0, 2, 1.1], [-15, 0.5, 1.6, 1]].forEach(function (m) {
        A.el('ellipse', { cx: m[0], cy: m[1], rx: m[2], ry: m[3], 'class': 'pc-tostado' }, t.doblada);
      });
    }
    A.el('path', { d: 'M-19 3.2 L19 3.2', 'class': cual === 'kenia' ? 'pc-borde-quemado' : 'pc-borde-frijol',
      'data-borde': cual === 'kenia' ? 'quemados' : 'frijoles' }, t.doblada);
    return t;
  }

  function voltear(el, si, demora) {
    var d = Math.round(demora || 0) + 'ms', tr = si ? 'scale(1,-1)' : 'scale(1,1)';
    if (el._pcT === tr && el._pcD === d) return;
    el._pcT = tr; el._pcD = d;
    el.style.setProperty('--d', d);
    el.style.transform = tr;
  }

  /* Pone de golpe, sin movimiento, lo que tiene que estar al empezar una
     corrida: así la corrida se vuelve a ver entera cada vez que se entra en
     su paso, también volviendo con «Atrás». */
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  /* Las piezas de una tortilla, quietas en su estado: `donde` es su sitio y
     `capas` lo que se ve de ella.
     ⚠️ Al volver a empezar una corrida (de golpe), la pieza de dentro de
     cada capa doble se vuelve a encender; en un paso que NO corre, no se
     toca. Encenderla ahí, mientras la de fuera se apaga, deja ver un
     fantasma de lo quemado a media transición: una se apaga y la otra se
     prende a la vez, y a la mitad las dos están a medias. */
  function tortillaEn(A, tor, donde, capas, reiniciar) {
    A.mover(tor.base, donde.x, donde.y, 0, 1, 0);
    A.mover(tor.alComal, 0, 0, 0, 1, 0);
    A.mover(tor.aLaMesa, 0, 0, 0, 1, 0);
    A.mover(tor.alPlato, 0, 0, 0, 1, 0);
    A.ver(tor.cruda, !!capas.cruda, 0);
    ['cocida', 'frijoles', 'quemado'].forEach(function (c) {
      A.ver(tor[c].se, !!capas[c], 0);
      if (reiniciar) A.ver(tor[c].va, true, 0);
    });
    A.ver(tor.doblada, !!capas.doblada, 0);
  }

  function empezarCorrida(A, tor) {
    var piezas = [tor.g, P.masa, P.harina, P.humo, P.flecha, P.mal, P.bien, P.capK, P.capR].concat(P.hechos);
    deGolpe(A, piezas, function () {
      A.ver(tor.g, false, 0);
      tortillaEn(A, tor, MESA, { cruda: true }, true);
      voltear(tor.vuelta, false, 0);
      A.ver(P.harina, true, 0);
      A.ver(P.masa, false, 0);
      A.ver(P.masaSe, true, 0);
      A.mover(P.masa, TAZON.x, TAZON.y, 0, 1, 0);
      A.mover(P.masaVa, 0, 0, 0, 1, 0);
      A.ver(P.humo, false, 0);
      A.ver(P.humoSe, true, 0);
      A.ver(P.flecha, false, 0);
      A.ver(P.flechaFin, true, 0);
      P.flechaPasos.forEach(function (g) { A.mover(g, 0, 0, 0, 1, 0); });
      P.hechos.forEach(function (h) { A.ver(h, false, 0); });
      if (tor === P.K) { A.ver(P.mal, false, 0); A.ver(P.capK, false, 0); }
      else { A.ver(P.bien, false, 0); A.ver(P.capR, false, 0); }
    });
  }

  /* La corrida: la flecha va de lugar en lugar y la cocina hace lo que dice
     la tarjeta que hay en ese lugar. La cocina no sabe el orden: lo lee de
     la lista, paso por paso, y por eso la misma función hace las dos. */
  function correr(A, orden, tor, plato) {
    var h = horario(orden);
    A.ver(P.flecha, true, h[0] - 200);
    P.flechaPasos.forEach(function (g, i) { A.mover(g, 0, PASO_Y, 0, 1, h[i + 1]); });
    A.ver(P.flechaFin, false, h[5]);
    P.hechos.forEach(function (hecho, i) { A.ver(hecho, true, h[i + 1]); });

    /* Lo que se ve de la tortilla en cada momento de la corrida.
       ⚠️ Cada capa se apaga UNA vez: una pieza tiene una sola demora, y
       volver a pedirle que se apague más tarde le cambia la demora de la
       primera vez. Así estuvo: al doblar se volvían a apagar los frijoles,
       y los de Kenia reaparecían encima de la tortilla camino del plato. */
    var hay = { cruda: true, cocida: false, frijoles: false, quemado: false };
    var enComal = false, donde = MESA;
    orden.forEach(function (paso, i) {
      var ti = h[i];
      if (paso === 'amasar') {
        A.ver(P.harina, false, ti + 300);
        A.ver(P.masa, true, ti + 300);
      } else if (paso === 'hacer') {
        A.mover(P.masaVa, MESA.x - TAZON.x, MESA.y - TAZON.y, 0, 1, ti + 100);
        A.ver(P.masaSe, false, ti + 600);
        A.ver(tor.g, true, ti + 600);
      } else if (paso === 'untar') {
        if (enComal) {
          A.mover(tor.aLaMesa, MESA.x - COMAL.x, MESA.y - COMAL.y, 0, 1, ti + 100);
          enComal = false; donde = MESA;
        }
        A.ver(tor.frijoles.se, true, ti + 700);
        hay.frijoles = true;
      } else if (paso === 'cocer') {
        /* se echa al comal y cae volteada, como se echa una tortilla */
        A.mover(tor.alComal, COMAL.x - MESA.x, COMAL.y - MESA.y, 0, 1, ti + 100);
        voltear(tor.vuelta, true, ti + 300);
        enComal = true; donde = COMAL;
        if (hay.frijoles) {
          /* los frijoles quedan abajo, contra el comal, y se queman; la
             masa, arriba, no toca el comal y queda cruda */
          A.ver(tor.frijoles.va, false, ti + 350);
          A.ver(tor.quemado.se, true, ti + 600);
          A.ver(P.humo, true, ti + 800);
          hay.frijoles = false; hay.quemado = true;
        } else {
          A.ver(tor.cruda, false, ti + 700);
          A.ver(tor.cocida.se, true, ti + 700);
          hay.cruda = false; hay.cocida = true;
        }
      } else if (paso === 'doblar') {
        A.mover(tor.alPlato, plato.x - donde.x, plato.y - donde.y, 0, 1, ti + 300);
        if (enComal && hay.quemado) A.ver(P.humoSe, false, ti + 400);
        if (hay.cruda) A.ver(tor.cruda, false, ti + 1000);
        if (hay.cocida) A.ver(tor.cocida.va, false, ti + 1000);
        if (hay.frijoles) A.ver(tor.frijoles.va, false, ti + 1000);
        if (hay.quemado) A.ver(tor.quemado.va, false, ti + 1000);
        A.ver(tor.doblada, true, ti + 1000);
      }
    });
    return h[5] + 200;
  }

  /* Lo que debe estar al final de cada paso que NO corre: quieto. */
  function asiQueda(A, tor, visto, plato) {
    A.ver(tor.g, visto, 0);
    if (visto) tortillaEn(A, tor, plato, { doblada: true }, false);
  }

  function ordenDe(n) { return n >= 2 ? DE_RECETA : DE_KENIA; }

  function ponerTarjetas(A, n, antes) {
    var orden = ordenDe(n), cambia = antes != null && (n >= 2) !== (antes >= 2);
    CLAVES.forEach(function (k) {
      var c = P.tarjetas[k];
      A.mover(c.g, 0, filaY(orden.indexOf(k)), 0, 1, cambia ? 300 : 0);
      /* la que baja se aparta a la derecha y vuelve: dos piezas, una que
         sale y otra que regresa, y al final queda donde estaba */
      if (cambia) {
        var baja = orden.indexOf(k) > ordenDe(antes).indexOf(k);
        if (baja) {
          c.bailes++;
          A.mover(c.ida, 16 * c.bailes, 0, 0, 1, 0);
          A.mover(c.vuelta, -16 * c.bailes, 0, 0, 1, 900);
        }
      }
      A.ver(c.resalte, n === 4 && (k === 'cocer' || k === 'untar'), n === 4 ? 300 : 0);
    });
  }

  function idioma(l) {
    lang = l === 'en' ? 'en' : 'es';
    P.tituloK.textContent = RS.tituloK[lang];
    P.tituloR.textContent = RS.tituloR[lang];
    CLAVES.forEach(function (k) { P.tarjetas[k].txt.textContent = PASOS[k][lang]; });
    P.capK.textContent = RS.capK[lang];
    P.capR.textContent = RS.capR[lang];
    P.cambian.textContent = RS.cambian[lang];
    P.comalRot.textContent = RS.comal[lang];
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };

    A.ver(P.tituloK, n <= 1, 0);
    A.ver(P.tituloR, n >= 2, n >= 2 && antes < 2 ? 300 : 0);
    ponerTarjetas(A, n, antes);
    A.ver(P.llave, n === 4, n === 4 ? 500 : 0);

    if (entra(1)) {
      empezarCorrida(A, P.K);
      var finK = correr(A, DE_KENIA, P.K, PLATO_K);
      A.ver(P.mal, true, finK);
      A.ver(P.capK, true, finK);
      asiQueda(A, P.R, false);
      A.ver(P.bien, false, 0);
      A.ver(P.capR, false, 0);
      return;
    }
    if (entra(3)) {
      empezarCorrida(A, P.R);
      var finR = correr(A, DE_RECETA, P.R, PLATO_R);
      A.ver(P.bien, true, finR);
      A.ver(P.capR, true, finR);
      asiQueda(A, P.K, true, PLATO_K);
      A.ver(P.mal, true, 0);
      A.ver(P.capK, true, 0);
      return;
    }
    if (n === 1 || n === 3) return;     // el mismo paso otra vez: nada cambia

    /* Los pasos que no corren: todo quieto en su sitio. */
    var hechos = n === 4;
    P.hechos.forEach(function (h) { A.ver(h, hechos, 0); });
    A.ver(P.flecha, false, 0);
    A.ver(P.humo, false, 0);
    A.ver(P.harina, n === 0 || n === 2, 0);
    A.ver(P.masa, false, 0);
    asiQueda(A, P.K, n >= 1, PLATO_K);
    asiQueda(A, P.R, n >= 3, PLATO_R);
    A.ver(P.mal, n >= 1, 0);
    A.ver(P.capK, n >= 1, 0);
    A.ver(P.bien, n >= 3, 0);
    A.ver(P.capR, n >= 3, 0);
  }

  var FRASES = {
    es: [
      'Estos son los pasos de Kenia, en su orden. Son cinco y no falta ninguno. ¿Qué salió mal?',
      'Kenia untó los frijoles antes de cocer la tortilla. Quedaron abajo, contra el comal, y se quemaron; la masa quedó cruda.',
      'Son los mismos cinco pasos, y solo dos cambian de lugar: primero se cuece la tortilla, después se untan los frijoles.',
      'Ahora la tortilla se cuece sola, y los frijoles van encima de la tortilla ya cocida. Sale la baleada.',
      'Mismos pasos, otro orden, otra cosa. Escribí los pasos de algo que hacés y cambiá dos de lugar: ¿qué sale?'
    ],
    en: [
      'These are Kenia’s steps, in her order. There are five and none is missing. What went wrong?',
      'Kenia spread the beans before cooking the tortilla. They ended up underneath, against the griddle, and burned; the dough stayed raw.',
      'They are the same five steps, and only two swap places: first the tortilla is cooked, then the beans are spread.',
      'Now the tortilla cooks on its own, and the beans go on top of the cooked tortilla. Out comes the baleada.',
      'Same steps, another order, another result. Write the steps of something you do and swap two of them: what happens?'
    ]
  };
  /* Los rótulos del botón caben en un renglón en un teléfono de 360 px con
     la letra grande: «Hacer los pasos de Kenia» se partía en dos. */
  var BOTONES = {
    es: ['▶ Hacer sus pasos', '🔀 Cambiar el orden', '▶ Hacer los pasos', '⚖️ Comparar', '↺ Empezar otra vez'],
    en: ['▶ Do her steps', '🔀 Change the order', '▶ Do the steps', '⚖️ Compare', '↺ Start over']
  };
  var MARCADOR = {
    es: [['5', 'pasos, y no falta ninguno'], ['0', 'baleadas buenas'], ['2', 'pasos cambian de lugar'],
      ['1', 'baleada buena'], ['5', 'pasos iguales, otro orden']],
    en: [['5', 'steps, and none is missing'], ['0', 'good baleadas'], ['2', 'steps swap places'],
      ['1', 'good baleada'], ['5', 'same steps, new order']]
  };

  AnimacionMision.montar('#amBaleada', {
    vista: [ANCHO, ALTO],
    bilingue: true,
    describe: {
      es: 'A la izquierda, los cinco pasos de la baleada en una lista; a la derecha, la cocina, con la mesa, el comal y dos platos.',
      en: 'On the left, the five steps of the baleada in a list; on the right, the kitchen, with the table, the griddle and two plates.'
    },
    pasos: 5,
    construir: construir,
    idioma: idioma,
    pintar: pintar,
    texto: function (n) { return FRASES[lang][n]; },
    boton: function (n) { return BOTONES[lang][n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[lang][n][0], palabras: MARCADOR[lang][n][1] }; }
  });
})();
