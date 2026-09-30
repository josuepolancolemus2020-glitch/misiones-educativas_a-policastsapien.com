/* ============================================================
   M.E.T.A.S · Geografía y Coordenadas · Los dos números de un punto
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de doña
   Nely: su casa «es la de la mata de mango, pasando el puente», y la
   noche que necesitó la ambulancia el chofer dio vueltas cuarenta
   minutos preguntando de casa en casa. La historia promete que
   cualquier punto de la Tierra tiene dos números que no dependen de
   ninguna mata de mango. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  la aldea: pasando el puente hay TRES casas con mata de mango.
        ¿Cuál es la de doña Nely?
     1  el chofer pregunta en una, en otra… la tercera es la suya:
        cuarenta minutos;
     2  un punto lejos de la aldea, en el mapa del mundo. Su primer
        número se cuenta desde la línea del medio: 30° hacia arriba;
     3  el segundo, desde la línea de partida, que va de arriba abajo:
        105° hacia la izquierda;
     4  pero hacia abajo también hay 30°, y hacia la derecha, 105°: por
        eso cada número lleva la letra de su lado. 30° N, 105° O;
     5  un número sin el otro es una línea entera; los dos juntos se
        cruzan en un solo punto;
     6  por la casa de doña Nely también pasan sus dos líneas: con sus
        dos números, el chofer no habría tenido que preguntar.

   Siete decisiones, y ninguna es de adorno:

   1. ⚠️ **El punto del mapa NO es Honduras, y a propósito.** La prueba
      de esta misión pregunta qué coordenadas pueden ser de un lugar de
      Honduras, si Honduras queda al norte o al sur, y la de pensamiento
      crítico trae un barco frente a La Ceiba: una animación que leyera
      los números de la aldea contestaría esas preguntas de memoria. El
      punto es otro, en otro país, con números que no salen en ninguna
      pregunta (30 y 105), y la aldea NUNCA se ubica en el mapa.
   2. ⚠️ **Y sus letras son la N y la O, las mismas de Honduras.** El
      alumno lee justo debajo, en la tarjeta que sigue, «15° N y 87° O»:
      con un ejemplo del mismo lado del mundo lo lee a la primera.
   3. ⚠️ **Lo que va en la prueba no se nombra.** Ni «ecuador» ni
      «Greenwich» (son los pareados), ni «paralelos», «meridianos»,
      «polos», «grados» u «oeste» (son respuestas del completar y de la
      selección múltiple), ni el 0°, 0°, ni el 90° ni el 180°. Las dos
      líneas de referencia se llaman como las llama la propia prueba
      cuando no quiere nombrarlas: «la línea del medio»; y la otra, «la
      línea de partida», que es lo que es. La tarjeta de abajo les pone
      el nombre.
   4. ⚠️ **La letra se entiende VIÉNDOLA faltar.** Un número sin letra
      son dos: hacia abajo también hay 30°, y hacia la derecha también
      hay 105°. Se dibujan con raya cortada y sin letra. No se marca
      nunca el punto con las dos letras cambiadas: eso se parece al
      antípoda, que la prueba de pensamiento crítico pide calcular (y no
      se calcula así).
   5. **Un número solo es una línea entera.** Es lo que la historia
      dice con la seña: «la de la mata de mango» le queda a tres casas.
      En el paso 5 cada número se vuelve su línea, de un borde al otro
      del mapa, y el único punto que está en las dos es el nuestro. En
      el 6 pasa lo mismo en la aldea: por la casa de doña Nely pasa una
      línea que toca también otras casas, y otra que toca otra; en las
      dos, solo la suya.
   6. **El mapa es un mapa de verdad.** Los contornos son simplificados
      pero están puestos con sus coordenadas, y el punto cae en tierra.
      Proyección de rejilla: cada grado mide lo mismo de ancho que de
      alto, y la red va de 15° en 15°, así que el punto está en un cruce
      y se puede contar.
   7. **Nada se dice solo con color.** La casa que no es lleva una ✗ y
      la que sí, una ✓; la duda, un «?» con el aro de raya cortada; lo
      que el número sin letra podría ser, raya cortada. El mapa, las
      casas y la ambulancia son dibujos y se quedan como son en las dos
      pantallas.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !window.CONTORNOS_MUNDO || !document.getElementById('amCruce')) return;

  var ANCHO = 304, ALTO = 190, FIN = 6;

  /* ── El mapa: rejilla de 0,8 por grado, de −180 a 180 y de 90 a −90 ── */
  var MX = 8, MY = 23, K = 0.8;
  function gx(lon) { return MX + (lon + 180) * K; }
  function gy(lat) { return MY + (90 - lat) * K; }
  var Y_MEDIO = gy(0), X_PARTIDA = gx(0);      // 95 y 152
  var LAT = 30, LON = -105;                    // el punto: 30° N, 105° O
  var PX = gx(LON), PY = gy(LAT);              // 68 y 71
  function r2(v) { return Math.round(v * 100) / 100; }

  /* Los contornos del mundo viven en js/data/contornos-mundo.js: el mapa
     de los continentes usa los mismos, y dos copias se separan con la
     primera costa que alguien corrija. Son simplificados y están puestos
     con sus coordenadas: no son para medir distancias, son para que el
     punto caiga donde dicen sus números. */
  var TIERRA = window.CONTORNOS_MUNDO.tierra, AGUA = window.CONTORNOS_MUNDO.agua;
  function contorno(c) {
    var d = '';
    for (var i = 0; i < c.length; i += 2) d += (i ? ' L ' : 'M ') + r2(gx(c[i])) + ' ' + r2(gy(c[i + 1]));
    return d + ' Z';
  }

  /* ── La aldea: el río baja de arriba abajo y el camino lo cruza por el
     puente. La ambulancia entra por la izquierda, así que «pasando el
     puente» es la orilla de la derecha. ── */
  var Y_CAMINO = 100;
  var X_PUENTE = 88;
  /* Las casas y las matas se dibujan a 1,3: a 1 quedaban chicas en el
     teléfono, con aire de sobra arriba y abajo de la aldea. */
  var S = 1.3;
  var ARRIBA = 70, ABAJO = 130;          // el centro de las paredes, a cada lado del camino
  /* [x, y, x de la mata de mango o null]; la de doña Nely es la 5. La mata
     va al lado de su casa, con el pie a la altura del de la casa. */
  var CASAS = [
    [42, ARRIBA, 17],
    [58, ABAJO, null],
    [132, ARRIBA, 107],
    [160, ABAJO, 185],
    [200, ARRIBA, null],
    [264, ARRIBA, 239],
    [264, ABAJO, null]
  ];
  var NELY = 5;
  /* Las tres de la seña, en el orden en que las encuentra la ambulancia
     por el camino. */
  var VISITAS = [2, 3, 5];
  var X_SALIDA = 16;

  var TEXTOS = [
    '«La de la mata de mango, pasando el puente.» Pasando el puente hay tres casas con mata de mango. ¿Cuál es la de doña Nely?',
    'El chofer pregunta en una casa, después en otra. La tercera es la de doña Nely, y ya pasaron cuarenta minutos.',
    'Ahora, un punto lejos de la aldea. Su primer número se cuenta desde la línea del medio: está 30° hacia arriba.',
    'Su segundo número se cuenta desde la línea de partida, que va de arriba abajo: está 105° hacia la izquierda.',
    'Pero hacia abajo también hay 30°, y hacia la derecha, 105°. Cada número lleva la letra de su lado: 30° N, 105° O.',
    'Un número sin el otro es una línea entera. Los dos juntos se cruzan en un solo punto: este.',
    'Por la casa de doña Nely también pasan sus dos líneas. Con sus dos números, el chofer no habría tenido que preguntar.'
  ];

  var A;
  var aldea, mapa;
  var dudas = [], noes = [], sies = [], tramos = [], lineasCasa = [], rotulosCasa = [], aroCasa;
  var refMedio, refPartida, rotMedio, rotPartida, pin, pinCae;
  var flechas = {}, puntas = {}, numeros = {}, letras = {}, enteras = {}, aro, lectura;

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una casa del campo: paredes de adobe, techo de teja y su puerta.
     (x, y) es el centro de las paredes; se dibuja a escala S. */
  function casa(padre, x, y, i) {
    var el = A.el;
    var g = el('g', { 'data-casa': String(i), transform: 'translate(' + x + ' ' + y + ') scale(' + S + ')' }, padre);
    el('rect', { class: 'co-pared', 'data-cuerpo': '', x: -8, y: -6, width: 16, height: 12 }, g);
    el('path', { class: 'co-techo', d: 'M -10 -6 L 0 -14 L 10 -6 Z' }, g);
    el('rect', { class: 'co-puerta', x: -2, y: -1, width: 4, height: 7 }, g);
    return g;
  }

  /* Una mata de mango: la copa redonda con sus mangos, y el tronco. (x, pie)
     es el pie del tronco, a la altura del de su casa. */
  function mata(padre, x, pie) {
    var el = A.el;
    var g = el('g', { 'data-mata': '', transform: 'translate(' + x + ' ' + r2(pie) + ') scale(' + S + ')' }, padre);
    el('rect', { class: 'co-tronco', x: -1.3, y: -8, width: 2.6, height: 8 }, g);
    el('circle', { class: 'co-copa', 'data-copa': '', cx: 0, cy: -12, r: 8.5 }, g);
    [[-3.6, 0.6], [2.4, -4.2], [3.9, 1.8], [-1.2, -5], [0.4, 3.4]].forEach(function (m) {
      el('circle', { class: 'co-mango', cx: m[0], cy: -12 + m[1], r: 1.5 }, g);
    });
  }

  /* La marca que se pone sobre una casa: «?» la duda (aro de raya
     cortada), ✗ la que no es (dos rayas), ✓ la que sí (una raya). */
  function marca(padre, tipo, x, y) {
    var el = A.el;
    var g = el('g', { class: 'am-fuera co-marca' + (tipo === 'duda' ? ' co-duda' : ''), 'data-marca': tipo }, padre);
    var h = el('g', { transform: 'translate(' + x + ' ' + y + ') scale(1.2)' }, g);
    el('circle', { class: 'co-marca-fondo', 'data-marca-aro': '', cx: 0, cy: 0, r: 6.5 }, h);
    if (tipo === 'duda') texto(h, { class: 'co-signo', x: 0, y: 3.6, 'font-size': 10 }, '?');
    else el('path', { class: 'co-marca-trazo', 'data-marca-trazo': '',
      d: tipo === 'no' ? 'M -2.6 -2.6 L 2.6 2.6 M 2.6 -2.6 L -2.6 2.6' : 'M -3 0 L -0.8 2.4 L 3.2 -2.6' }, h);
    return g;
  }

  /* La ambulancia, de lado, mirando al frente del camino. (0, 0) es su
     centro, y va en tres tramos encadenados: cada tramo la lleva de una
     casa a la siguiente, y los tres juntos la dejan en la de doña Nely. */
  function ambulancia(padre) {
    var el = A.el;
    var base = el('g', { transform: 'translate(' + X_SALIDA + ' ' + Y_CAMINO + ')' }, padre);
    var t1 = el('g', { class: 'co-tramo' }, base);
    var t2 = el('g', { class: 'co-tramo' }, t1);
    var t3 = el('g', { class: 'co-tramo' }, t2);
    tramos = [t1, t2, t3];
    var g = el('g', { 'data-ambulancia': '', transform: 'scale(' + S + ')' }, t3);
    el('path', { class: 'co-ambu', d: 'M -11 4 L -11 -5 L 4 -5 L 8 -1 L 11 0 L 11 4 Z' }, g);
    el('path', { class: 'co-vidrio', d: 'M 4.6 -4 L 7.4 -1.2 L 4.6 -1.2 Z' }, g);
    el('rect', { class: 'co-cruz', x: -6.2, y: -3.9, width: 1.6, height: 5.2 }, g);
    el('rect', { class: 'co-cruz', x: -8, y: -2.1, width: 5.2, height: 1.6 }, g);
    el('circle', { class: 'co-llanta', cx: -6, cy: 4.4, r: 2.2 }, g);
    el('circle', { class: 'co-llanta', cx: 6, cy: 4.4, r: 2.2 }, g);
  }

  /* Una flecha que cuenta: la raya desde la línea de referencia hasta el
     punto, y su punta. */
  function flecha(padre, nombre, clase, x1, y1, x2, y2, espejo) {
    var el = A.el;
    var g = el('g', { class: 'am-fuera', 'data-flecha': nombre }, padre);
    var dx = x2 - x1, dy = y2 - y1, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
    /* La raya acaba donde empieza la punta. */
    var raya = el('path', { class: clase + (espejo ? ' co-espejo' : ''), 'data-raya': '',
      d: 'M ' + r2(x1) + ' ' + r2(y1) + ' L ' + r2(x2 - ux * 3.6) + ' ' + r2(y2 - uy * 3.6) }, g);
    var bx = x2 - ux * 4.2, by = y2 - uy * 4.2, px = -uy * 2.6, py = ux * 2.6;
    var punta = el('path', { class: 'co-punta ' + clase, 'data-punta': '',
      d: 'M ' + r2(bx + px) + ' ' + r2(by + py) + ' L ' + r2(x2) + ' ' + r2(y2) + ' L ' + r2(bx - px) + ' ' + r2(by - py) + ' Z' }, g);
    flechas[nombre] = g;
    puntas[nombre] = { raya: raya, punta: punta };
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ════════ La aldea ════════ */
    aldea = el('g', { class: 'am-capa', 'data-aldea': '' }, svg);
    el('rect', { class: 'co-grama', x: 4, y: 4, width: 296, height: 182, rx: 8 }, aldea);
    el('path', { class: 'co-rio', 'data-rio': '', d: 'M 86 6 C 94 40, 76 64, 88 100 C 98 130, 80 160, 92 184' }, aldea);
    el('path', { class: 'co-rio-brillo', d: 'M 86 6 C 94 40, 76 64, 88 100 C 98 130, 80 160, 92 184' }, aldea);
    el('rect', { class: 'co-camino', x: 4, y: Y_CAMINO - 7, width: 296, height: 14 }, aldea);
    /* El puente: tablas sobre el río, con su baranda a cada lado. */
    var puente = el('g', { 'data-puente': '' }, aldea);
    el('rect', { class: 'co-puente', 'data-tablero': '', x: X_PUENTE - 14, y: Y_CAMINO - 8.5, width: 28, height: 17, rx: 1 }, puente);
    for (var t = -10; t <= 10; t += 5) el('path', { class: 'co-tabla', d: 'M ' + (X_PUENTE + t) + ' ' + (Y_CAMINO - 8.5) + ' V ' + (Y_CAMINO + 8.5) }, puente);
    el('path', { class: 'co-baranda', d: 'M ' + (X_PUENTE - 14) + ' ' + (Y_CAMINO - 8.5) + ' H ' + (X_PUENTE + 14) }, puente);
    el('path', { class: 'co-baranda', d: 'M ' + (X_PUENTE - 14) + ' ' + (Y_CAMINO + 8.5) + ' H ' + (X_PUENTE + 14) }, puente);

    /* Las dos líneas que pasan por la casa de doña Nely (paso 6): una
       acostada y otra de arriba abajo, de un borde al otro de la aldea. */
    var nx = CASAS[NELY][0], ny = CASAS[NELY][1];
    lineasCasa.push(el('path', { class: 'co-lat am-fuera', 'data-linea-casa': 'lat', d: 'M 4 ' + ny + ' H 300' }, aldea));
    lineasCasa.push(el('path', { class: 'co-lon am-fuera', 'data-linea-casa': 'lon', d: 'M ' + nx + ' 4 V 186' }, aldea));

    CASAS.forEach(function (c, i) {
      if (c[2] != null) mata(aldea, c[2], c[1] + 6 * S);
      var g = casa(aldea, c[0], c[1], i);
      if (i === NELY) g.setAttribute('data-nely', '');
    });

    rotulosCasa.push(texto(aldea, { class: 'co-rotulo am-fuera', 'data-rotulo-casa': 'lat', x: 150, y: ny - 4.5, 'font-size': 10.5 }, 'latitud'));
    rotulosCasa.push(texto(aldea, { class: 'co-rotulo am-fuera', 'data-rotulo-casa': 'lon', x: nx - 4, y: 16, 'font-size': 10.5, 'text-anchor': 'end' }, 'longitud'));
    aroCasa = el('circle', { class: 'co-aro am-fuera', 'data-aro-casa': '', cx: nx, cy: ny - 4, r: 17 }, aldea);

    ambulancia(aldea);

    /* Las marcas: encima de las casas de arriba del camino, debajo de las
       de abajo. */
    VISITAS.forEach(function (k) {
      var c = CASAS[k], my = c[1] === ARRIBA ? c[1] - 30 : c[1] + 19;
      dudas.push(marca(aldea, 'duda', c[0], my));
      if (k === NELY) sies.push(marca(aldea, 'si', c[0], my));
      else noes.push(marca(aldea, 'no', c[0], my));
    });

    /* ════════ El mapa del mundo ════════ */
    mapa = el('g', { class: 'am-capa am-fuera', 'data-mundo': '' }, svg);
    el('rect', { class: 'co-mar', 'data-mapa': '', x: MX, y: MY, width: 360 * K, height: 180 * K, rx: 2 }, mapa);
    var malla = el('g', { 'data-malla': '' }, mapa);
    var lat, lon;
    for (lat = -75; lat <= 75; lat += 15) el('path', { class: 'co-malla', 'data-malla-lat': String(lat), d: 'M ' + MX + ' ' + r2(gy(lat)) + ' H ' + r2(gx(180)) }, malla);
    for (lon = -165; lon <= 165; lon += 15) el('path', { class: 'co-malla', 'data-malla-lon': String(lon), d: 'M ' + r2(gx(lon)) + ' ' + MY + ' V ' + r2(gy(-90)) }, malla);
    TIERRA.forEach(function (c) { el('path', { class: 'co-tierra', 'data-tierra': '', d: contorno(c) }, mapa); });
    AGUA.forEach(function (c) { el('path', { class: 'co-agua', 'data-agua': '', d: contorno(c) }, mapa); });

    /* Las dos líneas de referencia, que se trazan cuando les toca. */
    refMedio = el('path', { class: 'co-ref', 'data-ref': 'medio', d: 'M ' + MX + ' ' + Y_MEDIO + ' H ' + r2(gx(180)) }, mapa);
    /* A la derecha: a la izquierda se montaba sobre el «30°» de la flecha. */
    rotMedio = texto(mapa, { class: 'co-rotulo am-fuera', 'data-ref-rotulo': 'medio', x: 292, y: Y_MEDIO - 3.5, 'font-size': 10.5, 'text-anchor': 'end' }, 'línea del medio');
    refPartida = el('path', { class: 'co-ref', 'data-ref': 'partida', d: 'M ' + X_PARTIDA + ' ' + MY + ' V ' + r2(gy(-90)) }, mapa);
    rotPartida = texto(mapa, { class: 'co-rotulo am-fuera', 'data-ref-rotulo': 'partida', x: X_PARTIDA + 4, y: 141, 'font-size': 10.5 }, 'línea de partida');

    /* Cada número, una línea entera (paso 5). */
    enteras.lat = el('path', { class: 'co-lat', 'data-entera': 'lat', d: 'M ' + MX + ' ' + PY + ' H ' + r2(gx(180)) }, mapa);
    enteras.lon = el('path', { class: 'co-lon', 'data-entera': 'lon', d: 'M ' + PX + ' ' + MY + ' V ' + r2(gy(-90)) }, mapa);

    /* Las flechas que cuentan, y las del número sin letra. */
    flecha(mapa, 'lat', 'co-lat', PX, Y_MEDIO, PX, PY, false);
    flecha(mapa, 'lat-espejo', 'co-lat', PX, Y_MEDIO, PX, Y_MEDIO + (Y_MEDIO - PY), true);
    flecha(mapa, 'lon', 'co-lon', X_PARTIDA, PY, PX, PY, false);
    flecha(mapa, 'lon-espejo', 'co-lon', X_PARTIDA, PY, X_PARTIDA + (X_PARTIDA - PX), PY, true);

    /* Los números, y la letra que se les pega en el paso 4. Medidos con la
       Fredoka de la misión a 11 (peso 600): «30°» 16,58; «105°» 20,01; el
       espacio 2,65. */
    numeros.lat = texto(mapa, { class: 'co-rotulo co-num am-fuera', 'data-num': 'lat', x: 36, y: 87, 'font-size': 11 }, '30°');
    numeros['lat-espejo'] = texto(mapa, { class: 'co-rotulo co-num am-fuera', 'data-num': 'lat-espejo', x: 36, y: 111, 'font-size': 11 }, '30°');
    numeros.lon = texto(mapa, { class: 'co-rotulo co-num am-fuera', 'data-num': 'lon', x: 99, y: 66, 'font-size': 11 }, '105°');
    numeros['lon-espejo'] = texto(mapa, { class: 'co-rotulo co-num am-fuera', 'data-num': 'lon-espejo', x: 184, y: 66, 'font-size': 11 }, '105°');
    letras.lat = texto(mapa, { class: 'co-rotulo co-letra am-fuera', 'data-letra': 'lat', x: r2(36 + 16.58 + 2.65), y: 87, 'font-size': 11 }, 'N');
    letras.lon = texto(mapa, { class: 'co-rotulo co-letra am-fuera', 'data-letra': 'lon', x: r2(99 + 20.01 + 2.65), y: 66, 'font-size': 11 }, 'O');

    /* El punto: una chincheta clavada en su sitio (la punta es el punto). */
    pin = el('g', { class: 'am-fuera', 'data-pin': '', transform: 'translate(' + PX + ' ' + PY + ')' }, mapa);
    pinCae = el('g', {}, pin);
    el('path', { class: 'co-pin', d: 'M 0 0 C -1.6 -3, -4.4 -5.2, -4.4 -8.6 A 4.4 4.4 0 1 1 4.4 -8.6 C 4.4 -5.2, 1.6 -3, 0 0 Z' }, pinCae);
    el('circle', { class: 'co-pin-ojo', cx: 0, cy: -8.6, r: 1.7 }, pinCae);

    aro = el('circle', { class: 'co-aro am-fuera', 'data-aro': '', cx: PX, cy: PY, r: 7.5 }, mapa);
    lectura = texto(mapa, { class: 'co-rotulo co-num am-fuera', 'data-lectura': '', x: PX + 6, y: 56, 'font-size': 10.5 }, '30° N, 105° O');
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);
    var fue = function (k) { return ida && n === k; };
    var vuelve = function (k) { return !ida && antes === k; };
    /* El paso 1 se cuenta entero venga de donde venga: al volver del mapa,
       la ambulancia sale otra vez de la entrada y cada marca aparece cuando
       llega a su casa. Con fue(1) volvía a recorrer el camino de golpe con
       las ✗ y la ✓ ya puestas, que es contar el final antes que el viaje. */
    var entra = function (k) { return n === k && antes !== k; };

    /* ── Qué se ve: la aldea en 0, 1 y 6; el mapa del 2 al 5. ── */
    var enAldea = n <= 1 || n === 6;
    A.ver(aldea, enAldea, enAldea ? ((fue(6) || vuelve(2)) ? 300 : 0) : 0);
    A.ver(mapa, !enAldea, !enAldea ? ((fue(2) || vuelve(6)) ? 300 : 0) : 0);

    /* ── La aldea ── */
    /* La ambulancia: en el 1, de casa en casa; en el 6, derecho a la de
       doña Nely; en los demás, esperando a la entrada. */
    var xs = VISITAS.map(function (k) { return CASAS[k][0]; });
    var d1 = 0, d2 = 0, d3 = 0;
    if (n === 1) { d1 = xs[0] - X_SALIDA; d2 = xs[1] - xs[0]; d3 = xs[2] - xs[1]; }
    else if (n === 6) d1 = xs[2] - X_SALIDA;
    A.mover(tramos[0], d1, 0, 0, 1, entra(1) ? 250 : (fue(6) ? 1700 : 0));
    A.mover(tramos[1], d2, 0, 0, 1, entra(1) ? 1500 : 0);
    A.mover(tramos[2], d3, 0, 0, 1, entra(1) ? 2750 : 0);

    /* Las marcas: la duda en el 0; en el 1, cada una se vuelve ✗ o ✓
       cuando la ambulancia llega; en el 6, solo la ✓ de doña Nely. */
    var llega = [1300, 2550, 3800];
    dudas.forEach(function (g, i) { A.ver(g, n === 0, fue(1) ? llega[i] : 0); });
    noes.forEach(function (g, i) { A.ver(g, n === 1, entra(1) ? llega[i] : 0); });
    sies.forEach(function (g) { A.ver(g, n === 1 || n === 6, entra(1) ? llega[2] : (fue(6) ? 2800 : 0)); });

    /* Las dos líneas de la casa de doña Nely, en el 6. */
    lineasCasa.forEach(function (p, i) {
      A.ver(p, n === 6, n === 6 && fue(6) ? 800 + 500 * i : 0);
      A.trazar(p, n === 6, n === 6 && fue(6) ? 800 + 500 * i : 0);
    });
    rotulosCasa.forEach(function (t, i) { A.ver(t, n === 6, n === 6 && fue(6) ? 1100 + 500 * i : 0); });
    A.ver(aroCasa, n === 6, n === 6 && fue(6) ? 2800 : 0);

    /* ── El mapa ── */
    A.ver(pin, n >= 2 && n <= 5, fue(2) ? 700 : 0);
    A.mover(pinCae, 0, (n >= 2 && n <= 5) ? 0 : -12, 0, 1, fue(2) ? 700 : 0);

    var conMedio = n >= 2 && n <= 5, conPartida = n >= 3 && n <= 5;
    A.trazar(refMedio, conMedio, fue(2) ? 1100 : 0);
    A.ver(rotMedio, conMedio, fue(2) ? 1400 : 0);
    A.trazar(refPartida, conPartida, fue(3) ? 200 : 0);
    A.ver(rotPartida, conPartida, fue(3) ? 500 : 0);

    /* Las flechas que cuentan: la del primer número del 2 al 4, la del
       segundo del 3 al 4. En el 5 se vuelven su línea entera. */
    var conLat = n >= 2 && n <= 4, conLon = n >= 3 && n <= 4;
    A.ver(flechas.lat, conLat, fue(2) ? 1900 : 0);
    A.trazar(puntas.lat.raya, conLat, fue(2) ? 1900 : 0);
    A.ver(numeros.lat, conLat, fue(2) ? 2500 : 0);
    A.ver(flechas.lon, conLon, fue(3) ? 1000 : 0);
    A.trazar(puntas.lon.raya, conLon, fue(3) ? 1000 : 0);
    A.ver(numeros.lon, conLon, fue(3) ? 1600 : 0);

    /* El número sin letra, del otro lado (raya cortada), y la letra. */
    var conEspejo = n === 4;
    A.ver(flechas['lat-espejo'], conEspejo, fue(4) ? 200 : 0);
    A.ver(numeros['lat-espejo'], conEspejo, fue(4) ? 400 : 0);
    A.ver(flechas['lon-espejo'], conEspejo, fue(4) ? 800 : 0);
    A.ver(numeros['lon-espejo'], conEspejo, fue(4) ? 1000 : 0);
    A.ver(letras.lat, conEspejo, fue(4) ? 1600 : 0);
    A.ver(letras.lon, conEspejo, fue(4) ? 1900 : 0);

    /* Cada número, su línea entera; y el único punto que está en las dos. */
    var cruce = n === 5;
    A.ver(enteras.lat, cruce, 0);
    A.trazar(enteras.lat, cruce, fue(5) ? 300 : 0);
    A.ver(enteras.lon, cruce, 0);
    A.trazar(enteras.lon, cruce, fue(5) ? 1000 : 0);
    A.ver(aro, cruce, fue(5) ? 1800 : 0);
    A.ver(lectura, cruce, fue(5) ? 1800 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '3', palabras: 'casas con esa seña' },
      { cifra: '40', palabras: 'minutos preguntando' },
      { cifra: '30°', palabras: 'la latitud' },
      { cifra: '105°', palabras: 'la longitud' },
      { cifra: '30° N, 105° O', palabras: 'cada número con su letra' },
      { cifra: '1', palabras: 'punto con esos dos números' },
      { cifra: '0', palabras: 'minutos preguntando' }
    ][n];
  }

  AnimacionMision.montar('#amCruce', {
    vista: [ANCHO, ALTO],
    describe: 'Una aldea con un río, un puente y tres casas con mata de mango pasando el puente. Después, un mapa del mundo: un punto a 30° hacia arriba de la línea del medio y a 105° a la izquierda de la línea de partida, 30° N, 105° O.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🚑 La ambulancia', '🌎 Mirar el mundo', '↔️ El otro número', '🔤 ¿Y las letras?', '✚ Juntar los dos', '🏡 Volver a la aldea', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
