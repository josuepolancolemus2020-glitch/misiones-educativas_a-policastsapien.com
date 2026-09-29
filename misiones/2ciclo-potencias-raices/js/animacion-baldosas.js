/* ============================================================
   M.E.T.A.S · Potencias y Raíces Cuadradas · Las baldosas de doña Nely
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de doña
   Nely: le regalaron 144 baldosas, justas para un cuarto cuadrado, y
   el albañil le preguntó cuántas iban por fila para empezar derecho.
   Ella no supo, él empezó a ojo y a la tercera fila ya iba torcido.
   La historia dice que ese número sale de la raíz cuadrada y que se
   sabe ANTES de pegar la primera; aquí se ve por qué.
   El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  el cuarto vacío, la pila de 144 y la pregunta: ¿qué número,
        multiplicado por sí mismo, da 144?;
     1  se prueba con 10 por fila: 10 × 10 = 100, sobran 44 y el piso
        no llega a las paredes;
     2  con 12 por fila: 12 × 12 = 144, las 44 que sobraban cierran el
        cuadrado y no sobra ninguna;
     3  eso se escribe 12²: el 12 es la base (lo que va por lado) y el
        2, el exponente (cuántas veces se repite);
     4  la trampa: 12² no es 12 × 2, que son solo dos filas;
     5  al revés, la raíz cuadrada: √144 = 12, del total saca el lado;
     6  por eso el albañil marca 12 en cada pared antes de empezar, y
        las filas salen derechas desde la primera.

   Cuatro decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que se dibuja es lo que se cuenta.** Las baldosas que se
      ven en el piso son las que dice el marcador y forman un
      rectángulo de tantas por fila como dice el corchete de arriba y
      tantas filas como dice el de la izquierda; la pila dice cuántas
      quedan fuera, y las dos cosas siempre suman 144. La sonda
      `verifica-animacion-mision` lo cuenta baldosa por baldosa.
   2. **Las baldosas viajan por filas**: doce grupos de doce que salen
      de la pila y vuelven a ella. Se mueven doce piezas y no ciento
      cuarenta y cuatro, y así es además como se pega un piso.
   3. **No se usa lo que pregunta el «Predice» de abajo**: cuánto es 5²,
      la raíz de 81, ni si 50 es un cuadrado perfecto. Aquí solo salen
      los números de la historia (144 y 12) y el primer intento, 10.
   4. ⚠️ **No hay letra ámbar.** El ámbar de esta misión (--sec) se lee
      a 2,15:1 sobre la tarjeta clara: va en las baldosas, que son
      dibujo, y nunca en una cifra. Por eso tampoco hay un «+44» que
      suba al lado del marcador, que el aparato pinta con ese color.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amBaldosas')) return;

  var ANCHO = 320, ALTO = 254, FIN = 6;
  var N = 12;                   // baldosas por lado del cuarto: √144
  var TOTAL = N * N;            // 144
  var PRUEBA = 10;              // el primer intento
  var CELDA = 18, BALD = 16;    // lo que ocupa una baldosa con su junta, y la baldosa
  var RX = 30, RY = 26;         // la esquina de arriba a la izquierda del piso
  var LADO = N * CELDA;         // 216
  var TY = 13, LX = 14;         // dónde van los corchetes de arriba y de la izquierda
  /* La pila, en el patio: doce capas, una por cada fila de doce. De su
     tapa salen las filas encogidas al ancho de la pila, y a ella vuelven. */
  var PX = 262, PANCHO = 48, CAPA = 6, PASO_CAPA = 7, PBASE = 128;
  var PTAPA = PBASE - (N - 1) * PASO_CAPA - CAPA;   // 45
  var PESC = PANCHO / LADO;
  /* La puerta, en la pared de la derecha, que da al patio de la pila: sin
     ella el dibujo es un cuadrado y no un cuarto. */
  var PUERTA = [RY + LADO - 64, RY + LADO - 28];
  /* El cartel de las cuentas, en el centro del piso (en el paso 4 cae en
     la parte que quedó vacía). */
  var CX = RX + LADO / 2, CY = RY + 120;

  /* Cuántas por fila y cuántas filas hay pegadas en cada paso. */
  var PISO = [[0, 0], [PRUEBA, PRUEBA], [N, N], [N, N], [N, 2], [N, N], [N, 1]];
  /* Qué corchetes se ven. En el paso 6 son las marcas de las paredes: van
     de lado a lado aunque solo esté pegada la primera fila. */
  var CORCHETES = [[], ['c10', 'f10'], ['c12', 'f12'], ['c12', 'f12'], ['c12', 'f2'], ['c12', 'f12'], ['c12', 'f12']];
  var CARTEL = [null, null, null, 'potencia', 'doble', 'raiz', null];
  var PILA = ['baldosas', 'sobran', 'sobran', 'sobran', 'sin usar', 'sobran', 'quedan'];

  /* Las cuentas van con espacios que no se parten (\u00a0): en un teléfono
     «10 × 10 = 100» se cortaba entre renglones y se leía como dos cosas. */
  var TEXTOS = [
    'Doña Nely tiene 144 baldosas para un cuarto cuadrado. Antes de pegar la primera, hay que saber cuántas van en cada fila. ¿Qué número, multiplicado por sí mismo, da 144?',
    'Probemos con 10 por fila. Salen 10 filas: 10\u00a0×\u00a010\u00a0=\u00a0100 baldosas. Sobran 44 y el piso no llega a las paredes: van más de 10 por fila.',
    'Con 12 por fila salen 12 filas: 12\u00a0×\u00a012\u00a0=\u00a0144. Las 44 que sobraban cierran el cuadrado. No sobra ni falta ninguna.',
    '12\u00a0×\u00a012 se escribe 12² y se lee «doce al cuadrado». El 12 es la base: las baldosas de un lado. El 2 es el exponente: el 12 se repite dos veces.',
    'Cuidado: 12² no es 12\u00a0×\u00a02. Eso son solo dos filas, 24 baldosas, y el cuarto queda casi vacío. El exponente no multiplica: dice cuántas veces se repite la base.',
    'Al revés se usa la raíz cuadrada: √144\u00a0=\u00a012. Le das el total de baldosas y te dice cuántas van por lado. Deshace lo que hizo la potencia.',
    'Por eso el albañil saca la raíz antes de empezar. Marca 12 en cada pared, tiende los hilos y cada fila sale derecha desde la primera.'
  ];
  var BOTONES = [
    '🧱 Probar con 10',
    '🧱 Probar con 12',
    '✏️ ¿Cómo se escribe?',
    '🤔 ¿Y si fuera 12\u00a0×\u00a02?',
    '↩️ Ahora, al revés',
    '📏 ¿Y el albañil?',
    '↺ Empezar otra vez'
  ];
  var MARCADOR = [
    { cifra: '144', palabras: 'baldosas en la pila' },
    { cifra: '100', palabras: '10\u00a0×\u00a010: sobran 44' },
    { cifra: '144', palabras: '12\u00a0×\u00a012: no sobra ninguna' },
    { cifra: '12²', palabras: 'se lee «doce al cuadrado»' },
    { cifra: '24', palabras: '12\u00a0×\u00a02: solo dos filas' },
    { cifra: '12', palabras: '√144: las que van por lado' },
    { cifra: '12', palabras: 'marcas en cada pared' }
  ];

  var A;
  var filas = [], capas = [], corchetes = {}, carteles = {}, hilos = [];
  var pilaN, pilaQue, pilaVacia, velo;

  /* La baldosa: dibujada con su centro en (0, 0), para que al aparecer
     crezca desde el medio y no desde una esquina. El ámbar es el de la
     misión y la raya del borde, un tostado que se ve en las dos pantallas. */
  var BORDE = 'rgba(120,53,15,0.55)';
  function baldosa(padre, f, c) {
    return A.el('rect', {
      class: 'pr-baldosa', 'data-f': f, 'data-c': c,
      x: -BALD / 2, y: -BALD / 2, width: BALD, height: BALD, rx: 2,
      style: 'fill:var(--am-sec,#f59e0b);stroke:' + BORDE + ';stroke-width:0.8'
    }, padre);
  }

  /* Un corchete que dice cuántas van: el de arriba mide las baldosas de una
     fila y el de la izquierda, las filas. Guarda qué mide (data-eje) y cuánto
     dice su número, para que la sonda compare con el piso. */
  function corchete(padre, eje, n) {
    var el = A.el, largo = n * CELDA, d, tx, ty;
    if (eje === 'c') {
      d = 'M ' + RX + ' ' + (TY + 5) + ' V ' + TY + ' H ' + (RX + largo) + ' V ' + (TY + 5);
      tx = RX + largo / 2; ty = TY + 5;
    } else {
      d = 'M ' + (LX + 5) + ' ' + RY + ' H ' + LX + ' V ' + (RY + largo) + ' H ' + (LX + 5);
      tx = LX; ty = RY + largo / 2 + 5;
    }
    var g = el('g', { class: 'pr-corchete am-fuera', 'data-eje': eje === 'c' ? 'col' : 'fila', 'data-n': n }, padre);
    el('path', { class: 'am-trazo', d: d, style: 'stroke-linejoin:round;stroke-linecap:round' }, g);
    /* El número va encima de la raya, con un halo del color de la tarjeta
       que la corta: se lee sin que la raya le pase por el medio. */
    var t = el('text', {
      class: 'am-digito pr-corchete-n', x: tx, y: ty, 'text-anchor': 'middle', 'font-size': 14,
      style: 'stroke:var(--card,#fff);stroke-width:4px;stroke-linejoin:round;paint-order:stroke'
    }, g);
    t.textContent = n;
    return g;
  }

  function cartel(padre, clave, texto) {
    var el = A.el;
    var g = el('g', { class: 'pr-cartel am-fuera', 'data-clave': clave }, padre);
    el('rect', {
      x: CX - 78, y: CY - 21, width: 156, height: 42, rx: 10,
      style: 'fill:var(--card,#fff);stroke:var(--am-pri,#7c3aed);stroke-width:1.6'
    }, g);
    var t = el('text', { class: 'am-digito pr-cartel-t', x: CX, y: CY + 7.5, 'text-anchor': 'middle', 'font-size': 21 }, g);
    t.textContent = texto;
    return g;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El cuarto, visto desde arriba: el piso, los hilos y las paredes ── */
    el('rect', { class: 'pr-sala', x: RX, y: RY, width: LADO, height: LADO, style: 'fill:var(--card,#fff)' }, svg);
    /* Los hilos del albañil (paso 6): de pared a pared, en cada junta. Van
       con la raya en stroke-opacity y no en opacity, para que «se ve» sea
       lo mismo para el alumno que para la sonda. */
    var gh = el('g', null, svg);
    for (var i = 1; i < N; i++) {
      hilos.push(el('line', {
        class: 'pr-hilo am-fuera', 'data-eje': 'col', x1: RX + i * CELDA, y1: RY, x2: RX + i * CELDA, y2: RY + LADO,
        style: 'stroke:var(--gray,#636e72);stroke-width:1;stroke-dasharray:3 3;stroke-opacity:0.7'
      }, gh));
      hilos.push(el('line', {
        class: 'pr-hilo am-fuera', 'data-eje': 'fila', x1: RX, y1: RY + i * CELDA, x2: RX + LADO, y2: RY + i * CELDA,
        style: 'stroke:var(--gray,#636e72);stroke-width:1;stroke-dasharray:3 3;stroke-opacity:0.7'
      }, gh));
    }
    var L = RX - 2.5, R = RX + LADO + 2.5, T = RY - 2.5, B = RY + LADO + 2.5;
    el('path', {
      class: 'pr-pared',
      d: 'M ' + R + ' ' + PUERTA[0] + ' L ' + R + ' ' + T + ' L ' + L + ' ' + T + ' L ' + L + ' ' + B + ' L ' + R + ' ' + B + ' L ' + R + ' ' + PUERTA[1],
      style: 'fill:none;stroke:var(--dark,#1b2838);stroke-opacity:0.75;stroke-width:5;stroke-linejoin:miter'
    }, svg);
    /* La puerta abierta hacia el patio, como en un plano: la hoja con raya
       llena y su vuelta con raya fina. */
    var ancho = PUERTA[1] - PUERTA[0];
    el('path', {
      d: 'M ' + R + ' ' + PUERTA[1] + ' L ' + (R + ancho) + ' ' + PUERTA[1],
      style: 'fill:none;stroke:var(--gray,#636e72);stroke-width:2;stroke-linecap:round'
    }, svg);
    el('path', {
      d: 'M ' + R + ' ' + PUERTA[0] + ' A ' + ancho + ' ' + ancho + ' 0 0 1 ' + (R + ancho) + ' ' + PUERTA[1],
      style: 'fill:none;stroke:var(--gray,#636e72);stroke-width:1;stroke-dasharray:3 3'
    }, svg);

    /* ── La pila, en el patio ── */
    for (var k = 0; k < N; k++) {
      capas.push(el('rect', {
        class: 'pr-capa', x: PX, y: PBASE - k * PASO_CAPA - CAPA, width: PANCHO, height: CAPA, rx: 1.5,
        style: 'fill:var(--am-sec,#f59e0b);stroke:' + BORDE + ';stroke-width:0.8'
      }, svg));
    }
    /* Sin baldosas, la pila deja su hueco con raya cortada: lo que ya no está
       se dibuja así, no solo más pálido. */
    pilaVacia = el('rect', {
      class: 'am-hueco pr-pila-vacia am-fuera', x: PX - 1, y: PTAPA - 1, width: PANCHO + 2, height: PBASE - PTAPA + 2, rx: 3
    }, svg);
    pilaN = el('text', { class: 'am-digito pr-pila-n', x: PX + PANCHO / 2, y: PBASE + 24, 'text-anchor': 'middle', 'font-size': 20 }, svg);
    pilaQue = el('text', { class: 'am-letra pr-pila-que', x: PX + PANCHO / 2, y: PBASE + 41, 'text-anchor': 'middle', 'font-size': 14 }, svg);

    /* ── Las filas: doce grupos de doce baldosas ── */
    var gf = el('g', null, svg);
    for (var f = 0; f < N; f++) {
      var g = el('g', { class: 'pr-fila am-fuera', 'data-f': f }, gf);
      var t = [];
      for (var c = 0; c < N; c++) t.push(baldosa(g, f, c));
      filas.push({ g: g, t: t });
    }

    /* El velo de la raíz (paso 5): tapa todas las filas menos la de arriba,
       del color de la tarjeta, y las deja a media luz. Es UNA pieza: apagar
       las 132 baldosas una por una eran 132 transiciones a la vez, y un
       teléfono barato se ahogaba. */
    velo = el('rect', {
      class: 'pr-velo am-fuera', x: RX, y: RY + CELDA, width: LADO, height: LADO - CELDA,
      style: 'fill:var(--card,#fff);fill-opacity:0.72'
    }, svg);

    /* ── Los corchetes, los carteles de las cuentas ── */
    var gc = el('g', null, svg);
    corchetes.c10 = corchete(gc, 'c', PRUEBA);
    corchetes.f10 = corchete(gc, 'f', PRUEBA);
    corchetes.c12 = corchete(gc, 'c', N);
    corchetes.f12 = corchete(gc, 'f', N);
    corchetes.f2 = corchete(gc, 'f', 2);
    carteles.potencia = cartel(svg, 'potencia', '12²\u00a0=\u00a012\u00a0×\u00a012');
    carteles.doble = cartel(svg, 'doble', '12\u00a0×\u00a02\u00a0=\u00a024');
    carteles.raiz = cartel(svg, 'raiz', '√144\u00a0=\u00a012');
  }

  /* Dónde va una baldosa dentro de su fila, y si está: la que no está se
     encoge, para que al llegar crezca desde el medio. */
  function baldosaEn(t, c, esta, demora) {
    A.mover(t, c * CELDA + CELDA / 2, CELDA / 2, 0, esta ? 1 : 0.35, demora);
    A.ver(t, esta, demora);
  }
  /* Cambia unas piezas sin transición: se apaga la transición, se asienta el
     estilo y se devuelve. Solo para lo que en ese momento no se ve. */
  function quietas(lista, fn) {
    var i;
    for (i = 0; i < lista.length; i++) lista[i].style.transition = 'none';
    for (i = 0; i < lista.length; i++) fn(lista[i], i);
    A.asentar();
    for (i = 0; i < lista.length; i++) lista[i].style.transition = '';
  }

  function capasDe(n) { var p = PISO[n]; return Math.round((TOTAL - p[0] * p[1]) / N); }

  function pintar(n, antes) {
    var ahora = PISO[n], prev = PISO[antes] || PISO[0];
    var cols = ahora[0], rows = ahora[1], pc = prev[0], pr = prev[1];
    /* Si a las filas que ya estaban se les suman baldosas (de 10 a 12 por
       fila), las filas nuevas esperan a que esas terminen de caer. */
    var crecen = pr > 0 && cols > pc;
    var mueve = cols * rows !== pc * pr;

    for (var f = 0; f < N; f++) {
      var fila = filas[f];
      var dentro = f < rows, estaba = f < pr, demora = 0;
      if (dentro && !estaba) demora = (crecen ? 450 : 0) + (f - pr) * 70;
      else if (!dentro && estaba) demora = (pr - 1 - f) * 60;
      if (dentro) A.mover(fila.g, RX, RY + f * CELDA, 0, 1, demora);
      else A.mover(fila.g, PX, PTAPA, 0, PESC, demora);
      A.ver(fila.g, dentro, demora);
      /* ⚠️ Las baldosas solo se mueven por su cuenta cuando de verdad
         cambian: las dos del final de cada fila en el intento de 10, que no
         están, y que caen en su sitio al pasar a 12. La fila que vuela a la
         pila o vuelve de ella se mueve ENTERA; si sus doce baldosas hicieran
         además lo suyo, serían 144 transiciones a la vez, y con la CPU frenada
         seis veces (un teléfono barato) el dibujo bajaba a 28 cuadros por
         segundo. Por eso, a la fila que sale de la pila se le dejan las
         baldosas como van a quedar ANTES de que se vea: ahí nadie las mira. */
      if (dentro && !estaba) quietas(fila.t, function (t, c) { baldosaEn(t, c, c < cols, 0); });
      else if (dentro) {
        for (var c = 0; c < N; c++) baldosaEn(fila.t[c], c, c < cols, c >= pc ? 60 + f * 40 : 0);
      }
    }
    /* En la raíz (paso 5) queda encendida solo la fila de arriba: de las 144
       la raíz saca las 12 de un lado. Las demás siguen pegadas, a media luz. */
    A.ver(velo, n === 5, n === 5 ? (mueve ? 900 : 150) : 0);

    /* La pila: una capa por cada fila de doce que queda fuera. Se va
       vaciando desde arriba mientras salen las filas, y se llena al revés. */
    var hay = capasDe(n), habia = capasDe(antes);
    for (var k = 0; k < N; k++) {
      var dk = k >= hay && k < habia ? (habia - 1 - k) * 70 : k >= habia && k < hay ? 300 + (k - habia) * 60 : 0;
      A.ver(capas[k], k < hay, dk);
    }
    A.ver(pilaVacia, hay === 0, hay === 0 ? 700 : 0);
    pilaN.textContent = TOTAL - cols * rows;
    pilaQue.textContent = PILA[n];

    /* Los corchetes, cuando ya cayó lo que miden. */
    var dc = n === 6 ? 250 : mueve ? 900 : 150;
    for (var cl in corchetes) {
      var si = CORCHETES[n].indexOf(cl) >= 0;
      A.ver(corchetes[cl], si, si ? dc : 0);
    }
    for (var ca in carteles) {
      var sc = CARTEL[n] === ca;
      A.ver(carteles[ca], sc, sc ? (mueve ? 800 : 150) : 0);
    }
    for (var h = 0; h < hilos.length; h++) A.ver(hilos[h], n === 6, n === 6 ? 400 + (h >> 1) * 40 : 0);
  }

  AnimacionMision.montar('#amBaldosas', {
    vista: [ANCHO, ALTO],
    describe: 'Un cuarto cuadrado visto desde arriba y, en el patio, la pila de 144 baldosas. Las baldosas pasan de la pila al piso por filas: primero 10 por fila y después 12.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return MARCADOR[n]; }
  });
})();
