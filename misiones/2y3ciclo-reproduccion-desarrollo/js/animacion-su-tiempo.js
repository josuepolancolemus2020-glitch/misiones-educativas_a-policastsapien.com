/* ============================================================
   M.E.T.A.S · La Reproducción y el Desarrollo Humano · «A cada uno, a su tiempo»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Kenia: le
   llegó su primera menstruación en la escuela, creyó que estaba enferma y
   se aguantó hasta llegar a su casa. No le faltaba valentía: nadie le
   había explicado nada. La historia dice que los cambios le pasan a todo
   el mundo, que se pueden nombrar con palabras exactas, y que saber qué
   le está pasando a uno es lo que quita el miedo y deja pedir ayuda a
   tiempo. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza
   en cada paso.

   Primero, seis compañeros de grado de Kenia, cada uno con su línea del
   tiempo, y una raya que avanza. Después, el día de Kenia dos veces, de
   la escuela a su casa, con la maestra en el camino: como fue, sin saber
   qué era, y como pudo ser, sabiéndolo.

     0  los compañeros de grado: ¿les llegan a todos el mismo día?;
     1  pasa el tiempo: a todos les llegan, pero cada brote sale en otro
        punto de la línea. A cada uno, a su tiempo;
     2  el día de Kenia: le llega en la escuela y piensa «¿estoy
        enferma?»; ese pensamiento se va con ella, pasa junto a la maestra
        sin decir nada y llora al llegar a su casa;
     3  el mismo día, sabiéndolo: piensa «ya sé qué es», va donde la
        maestra, le dice la palabra exacta y le pide ayuda, y la ayudan
        ahí mismo;
     4  su cuerpo hizo lo mismo los dos días: le llega en el mismo momento
        del día. Lo que cambió fue saber cómo se llama y a quién preguntar;
     5  la pregunta es del alumno: a qué adulto de confianza le puede
        preguntar él.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Nada del cuerpo se dibuja.** Los cambios son un brote en la
      línea del tiempo, y la menstruación, una palabra en un globo. La
      historia pide nombrar con palabras exactas, y eso se hace
      nombrando, no dibujando.
   2. ⚠️ **Nadie va primero por ser niña o niño.** Los brotes salen
      mezclados: la misión enseña que cada persona cambia a su propio
      ritmo, y una regla de quién va antes no la enseña ni la acredita.
   3. ⚠️ **Lo que pregunta la prueba no se dice**: ni qué cambios trae la
      pubertad, ni quién los dirige, ni a qué edad empiezan, ni que sean
      «normales», ni una etapa de la vida. Donde la historia o esta
      animación ya contestaban, la prueba se cambió.
   4. **El paso que cuenta una historia la cuenta cada vez que se entra
      en él**, también volviendo con «Atrás». Por eso Kenia está dos
      veces en cada fila: la que camina (solo en su paso) y la que ya
      llegó (en los pasos de después), y lo mismo sus globos.
   5. **Nada se dice solo con color**: el brote se cuenta, lo que Kenia
      piensa o dice lo dice su globo con palabras, y la cara lo repite.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amSuTiempo')) return;

  var ANCHO = 320, ALTO = 240, FIN = 5;

  /* ── La clase: seis compañeros, cada uno con su línea del tiempo ── */
  var FILAS = [30, 57, 84, 111, 138, 165];
  var PISTA = [86, 302], EJE = 186;
  /* Cuándo le llegan a cada uno: en qué punto de su línea sale su brote.
     Mezclados a propósito, niñas y niños. */
  var CLASE = [
    { nombre: 'Kenia', es: 'nina', pelo: 'trenzas', piel: '#e0ac69', x: 150 },
    { nombre: 'Marvin', es: 'nino', pelo: 'corto', piel: '#c68642', x: 272 },
    { nombre: 'Yeimy', es: 'nina', pelo: 'largo', piel: '#f1c27d', x: 108 },
    { nombre: 'Selvin', es: 'nino', pelo: 'corto', piel: '#8d5524', x: 128 },
    { nombre: 'Dania', es: 'nina', pelo: 'largo', piel: '#c68642', x: 238 },
    { nombre: 'Wilmer', es: 'nino', pelo: 'corto', piel: '#e0ac69', x: 196 }
  ];
  /* La raya del tiempo avanza en cinco tramos iguales, a paso parejo. */
  var TRAMOS = 5, LARGO = (PISTA[1] - PISTA[0]) / TRAMOS;

  /* ── El día de Kenia, dos veces ── */
  var FILA = { a: 96, b: 212 };
  var ESCUELA = 20, LLEGA = 54, MAESTRA = 228, PARA = 200, CASA = 296, EN_CASA = 268;
  var KENIA = 1.2, SENORA = 1.15;
  /* Por dónde camina Kenia: en la primera fila, de donde le llegó a su
     casa; en la segunda, de ahí a donde la maestra. Tramos iguales. */
  var CAMINO = {
    a: [LLEGA, LLEGA + (EN_CASA - LLEGA) / 4, LLEGA + (EN_CASA - LLEGA) / 2, LLEGA + 3 * (EN_CASA - LLEGA) / 4, EN_CASA],
    b: [LLEGA, LLEGA + (PARA - LLEGA) / 3, LLEGA + 2 * (PARA - LLEGA) / 3, PARA]
  };
  /* Cuándo pasa cada cosa, contado desde que arranca el paso. */
  var PIENSA = 200, CAMINA = 1200, TRAMO = 800;
  /* Donde la maestra, lo que pensaba se apaga y después lo dice: cuando
     cambia lo que dice alguien, cambia el globo entero, y los dos globos
     no se enciman mientras uno se va. */
  var LLEGA_CASA = CAMINA + 4 * TRAMO, LLEGA_MAESTRA = CAMINA + 3 * TRAMO;
  var LO_DICE = LLEGA_MAESTRA + 500, LA_AYUDA = LLEGA_MAESTRA + 1300;

  var TEXTOS = [
    'Estos son compañeros de grado de Kenia. ¿Les llegan a todos los cambios del cuerpo el mismo día?',
    'Les llegan a todos, pero no el mismo día: a cada uno, a su tiempo.',
    'A Kenia le llegó su primera menstruación en la escuela. Como nadie le había explicado nada, creyó que estaba enferma y se lo guardó todo el día.',
    'Ahora, el mismo día, pero con alguien que se lo explicó antes: Kenia sabe qué es y le pide ayuda a la maestra.',
    'Su cuerpo hizo lo mismo los dos días. Lo que cambió fue saber cómo se llama y a quién preguntar.',
    '¿Y tú? Piensa en un adulto de confianza al que le puedas preguntar, y escribe su nombre en tu cuaderno.'
  ];

  var A;
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una cara de la clase: el pelo, la cara, los ojos y una sonrisa. */
  function cara(padre, cx, cy, r, piel, pelo) {
    var el = A.el;
    if (pelo === 'largo') el('path', { class: 'rd-pelo', d: 'M ' + (cx - r - 1.8) + ' ' + (cy + r + 1) + ' Q ' + (cx - r - 3) + ' ' + (cy - r - 2.5) + ' ' + cx + ' ' + (cy - r - 2.5) + ' Q ' + (cx + r + 3) + ' ' + (cy - r - 2.5) + ' ' + (cx + r + 1.8) + ' ' + (cy + r + 1) + ' Z' }, padre);
    if (pelo === 'trenzas') {
      el('circle', { class: 'rd-pelo', cx: cx - r - 1.2, cy: cy + 2.5, r: 2.9 }, padre);
      el('circle', { class: 'rd-pelo', cx: cx + r + 1.2, cy: cy + 2.5, r: 2.9 }, padre);
    }
    el('circle', { class: 'rd-piel', 'data-cara': '', cx: cx, cy: cy, r: r, style: 'fill:' + piel }, padre);
    var alto = pelo === 'corto' ? 2.2 : 3;
    el('path', { class: 'rd-pelo', d: 'M ' + (cx - r) + ' ' + (cy - 1) + ' Q ' + (cx - r) + ' ' + (cy - r - 2) + ' ' + cx + ' ' + (cy - r - 1.6) + ' Q ' + (cx + r) + ' ' + (cy - r - 2) + ' ' + (cx + r) + ' ' + (cy - 1) + ' Q ' + cx + ' ' + (cy - r + alto + 1.5) + ' ' + (cx - r) + ' ' + (cy - 1) + ' Z' }, padre);
    el('circle', { class: 'rd-ojo', cx: cx - r * 0.34, cy: cy + 0.4, r: 1.1 }, padre);
    el('circle', { class: 'rd-ojo', cx: cx + r * 0.34, cy: cy + 0.4, r: 1.1 }, padre);
    el('path', { class: 'rd-boca', d: 'M ' + (cx - 2.6) + ' ' + (cy + 3.8) + ' Q ' + cx + ' ' + (cy + 5.6) + ' ' + (cx + 2.6) + ' ' + (cy + 3.8) }, padre);
  }

  /* Un brote: el tallo y dos hojas, parado en (x, y). */
  function brote(padre, x, y, e) {
    var el = A.el, s = e || 1;
    function p(dx, dy) { return (x + dx * s).toFixed(2) + ' ' + (y + dy * s).toFixed(2); }
    el('path', { class: 'rd-tallo', d: 'M ' + p(0, 0) + ' L ' + p(0, -9) }, padre);
    el('path', { class: 'rd-hoja', d: 'M ' + p(0, -5) + ' Q ' + p(-6.5, -9.5) + ' ' + p(-7.5, -4.2) + ' Q ' + p(-3.2, -3) + ' ' + p(0, -5) + ' Z' }, padre);
    el('path', { class: 'rd-hoja', d: 'M ' + p(0, -7) + ' Q ' + p(6.5, -12) + ' ' + p(8, -6.6) + ' Q ' + p(3.6, -4.8) + ' ' + p(0, -7) + ' Z' }, padre);
    el('circle', { class: 'rd-base', cx: x, cy: y, r: 2.1 * s }, padre);
  }

  /* Kenia de cuerpo entero, parada en (0, 0): el uniforme, la cara, sus
     tres bocas (tranquila, triste y contenta) y la lágrima. */
  function kenia(padre) {
    var el = A.el, k = {};
    var g = el('g', { transform: 'scale(' + KENIA + ')' }, padre);
    el('path', { class: 'rd-falda', d: 'M -6.5 -6 L 6.5 -6 L 8 0 L -8 0 Z' }, g);
    el('path', { class: 'rd-camisa', d: 'M -6 -13 Q 0 -15 6 -13 L 6.5 -6 L -6.5 -6 Z' }, g);
    el('circle', { class: 'rd-pelo', cx: -8.2, cy: -17.5, r: 2.6 }, g);
    el('circle', { class: 'rd-pelo', cx: 8.2, cy: -17.5, r: 2.6 }, g);
    k.cabeza = el('circle', { class: 'rd-piel', 'data-cabeza': '', cx: 0, cy: -20, r: 7, style: 'fill:#e0ac69' }, g);
    el('path', { class: 'rd-pelo', d: 'M -7 -21 Q -7 -29 0 -28.6 Q 7 -29 7 -21 Q 0 -24.5 -7 -21 Z' }, g);
    el('circle', { class: 'rd-ojo', cx: -2.5, cy: -20.2, r: 0.95 }, g);
    el('circle', { class: 'rd-ojo', cx: 2.5, cy: -20.2, r: 0.95 }, g);
    k.tranquila = el('path', { class: 'rd-boca', 'data-boca': 'tranquila', d: 'M -2.2 -16.4 L 2.2 -16.4' }, g);
    k.triste = el('path', { class: 'rd-boca am-fuera', 'data-boca': 'triste', d: 'M -2.5 -15.4 Q 0 -17.6 2.5 -15.4' }, g);
    k.contenta = el('path', { class: 'rd-boca am-fuera', 'data-boca': 'contenta', d: 'M -2.6 -17 Q 0 -14.4 2.6 -17' }, g);
    k.lagrima = el('path', { class: 'rd-lagrima am-fuera', 'data-lagrima': '', d: 'M 3.4 -19.2 Q 5.1 -16.4 3.4 -15.1 Q 1.7 -16.4 3.4 -19.2 Z' }, g);
    return k;
  }

  /* La maestra, parada en (x, línea). */
  function maestra(padre, x, y) {
    var el = A.el, g = el('g', { 'data-maestra': '', transform: 'translate(' + x + ' ' + y + ') scale(' + SENORA + ')' }, padre);
    el('path', { class: 'rd-vestido', d: 'M -7 -24 Q 0 -26 7 -24 L 9.5 0 L -9.5 0 Z' }, g);
    el('circle', { class: 'rd-pelo', cx: 0, cy: -38.6, r: 3.4 }, g);
    el('circle', { class: 'rd-piel', 'data-cabeza-maestra': '', cx: 0, cy: -31, r: 7.2, style: 'fill:#c68642' }, g);
    el('path', { class: 'rd-pelo', d: 'M -7.2 -32 Q -7.2 -39.6 0 -39.2 Q 7.2 -39.6 7.2 -32 Q 0 -35.2 -7.2 -32 Z' }, g);
    el('circle', { class: 'rd-ojo', cx: -2.5, cy: -31.2, r: 0.95 }, g);
    el('circle', { class: 'rd-ojo', cx: 2.5, cy: -31.2, r: 0.95 }, g);
    el('path', { class: 'rd-boca', d: 'M -2.4 -27.6 Q 0 -25.8 2.4 -27.6' }, g);
    return g;
  }

  /* Un globo. El de PENSAR lleva de cola dos bolitas; el de DECIR, un
     pico. El texto es de papel: tinta oscura en las dos pantallas. Se
     dibuja en (0, 0) de su grupo: el grupo lo pone en su sitio. */
  function globo(padre, clave, cuando, caja, lineas, cola) {
    var el = A.el, g = el('g', { class: 'am-fuera', 'data-globo': clave, 'data-cuando': cuando }, padre);
    if (cola.pico) el('path', { class: 'rd-globo', d: 'M ' + cola.pico.join(' L ') + ' Z' }, g);
    el('rect', { class: 'rd-globo', 'data-caja': '', x: caja[0], y: caja[1], width: caja[2], height: caja[3], rx: 6 }, g);
    if (cola.bolitas) cola.bolitas.forEach(function (b) { el('circle', { class: 'rd-globo', cx: b[0], cy: b[1], r: b[2] }, g); });
    lineas.forEach(function (t, i) {
      texto(g, { class: 'rd-globo-texto', 'data-dice': '', x: caja[0] + caja[2] / 2, y: caja[1] + 12.6 + i * 13.5, 'font-size': 11.5, 'text-anchor': 'middle' }, t);
    });
    g.setAttribute('data-punta', cola.punta.join(' '));
    return g;
  }
  /* Los dos globos de pensar, puestos sobre la cabeza de Kenia (0, 0 es
     donde ella pisa). */
  function piensa(padre, clave, cuando, dice, ancho) {
    return globo(padre, clave, cuando, [-ancho / 2, -63, ancho, 18], [dice],
      { bolitas: [[-3, -41.5, 2.1], [-5.2, -37.6, 1.3]], punta: [-5.2, -37.6] });
  }

  /* La escuela y la casa, paradas en (x, línea). Sin bandera: un símbolo
     patrio se muestra completo o no se muestra. */
  function escuela(padre, x, y) {
    var el = A.el, g = el('g', { 'data-lugar': 'escuela' }, padre);
    el('rect', { class: 'rd-escuela', x: x - 12, y: y - 19, width: 24, height: 19 }, g);
    el('path', { class: 'rd-techo', d: 'M ' + (x - 14.5) + ' ' + (y - 19) + ' L ' + x + ' ' + (y - 30) + ' L ' + (x + 14.5) + ' ' + (y - 19) + ' Z' }, g);
    el('rect', { class: 'rd-puerta', x: x - 3.2, y: y - 9.5, width: 6.4, height: 9.5 }, g);
    el('rect', { class: 'rd-ventana', x: x - 10, y: y - 16, width: 5, height: 4.4 }, g);
    el('rect', { class: 'rd-ventana', x: x + 5, y: y - 16, width: 5, height: 4.4 }, g);
    return g;
  }
  function casa(padre, x, y) {
    var el = A.el, g = el('g', { 'data-lugar': 'casa' }, padre);
    el('rect', { class: 'rd-casa', x: x - 12, y: y - 16, width: 24, height: 16 }, g);
    el('path', { class: 'rd-techo-casa', d: 'M ' + (x - 14.5) + ' ' + (y - 16) + ' L ' + x + ' ' + (y - 28) + ' L ' + (x + 14.5) + ' ' + (y - 16) + ' Z' }, g);
    el('rect', { class: 'rd-puerta', x: x - 3, y: y - 9, width: 6, height: 9 }, g);
    el('rect', { class: 'rd-ventana', x: x + 4.4, y: y - 12.8, width: 5, height: 4.4 }, g);
    return g;
  }

  /* El momento en que le llega: una estrella debajo de la línea. */
  function estrella(padre, x, y) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var r = i % 2 ? 2.4 : 5.6, a = -Math.PI / 2 + i * Math.PI / 5;
      pts.push((x + r * Math.cos(a)).toFixed(2) + ' ' + (y + r * Math.sin(a)).toFixed(2));
    }
    return A.el('path', { class: 'rd-estrella', 'data-llega': '', d: 'M ' + pts.join(' L ') + ' Z' }, padre);
  }

  /* Una Kenia que camina: cada tramo es una envoltura, y la de fuera solo
     se enciende y se apaga, para que pueda volver a donde empezó sin que
     se la vea caminar hacia atrás. */
  function caminante(padre, fila, tramos, clave) {
    var el = A.el;
    var g0 = el('g', { class: 'am-fuera', 'data-kenia': clave, 'data-cual': 'camina' }, padre);
    var gs = [], dentro = g0;
    for (var t = 1; t <= tramos; t++) { dentro = el('g', { class: 'am-viaja', 'data-tramo': String(t) }, dentro); gs.push(dentro); }
    var cuerpo = el('g', { 'data-pisa': '', transform: 'translate(' + LLEGA + ' ' + FILA[fila] + ')' }, dentro);
    var k = kenia(cuerpo);
    k.cuerpo = cuerpo; k.ver = g0; k.g = gs;
    return k;
  }
  /* La Kenia que ya llegó: quieta, para los pasos de después. */
  function llegada(padre, fila, x, clave, boca) {
    var g = A.el('g', { class: 'am-fuera', 'data-kenia': clave, 'data-cual': 'quieta' }, padre);
    var cuerpo = A.el('g', { 'data-pisa': '', transform: 'translate(' + x + ' ' + FILA[fila] + ')' }, g);
    var k = kenia(cuerpo);
    A.ver(k.tranquila, false, 0);
    A.ver(k[boca], true, 0);
    if (boca === 'triste') A.ver(k.lagrima, true, 0);
    k.cuerpo = cuerpo; k.ver = g;
    return k;
  }

  var P = {};

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ══ La clase ══ */
    P.clase = el('g', { class: 'am-capa', 'data-clase': '' }, svg);
    CLASE.forEach(function (c, i) {
      var y = FILAS[i];
      el('line', { class: 'rd-pista', 'data-pista': c.nombre, x1: PISTA[0], y1: y, x2: PISTA[1], y2: y }, P.clase);
      var g = el('g', { 'data-alumno': c.nombre, 'data-es': c.es }, P.clase);
      cara(g, 14, y, 9, c.piel, c.pelo);
      texto(g, { class: 'am-rotulo', 'data-rotulo': 'nombre', x: 28, y: y + 4.2, 'font-size': 11.5 }, c.nombre);
    });
    el('line', { class: 'rd-eje', 'data-eje': '', x1: PISTA[0], y1: EJE, x2: PISTA[1] + 2, y2: EJE }, P.clase);
    el('path', { class: 'rd-eje-punta', d: 'M ' + (PISTA[1] + 8) + ' ' + EJE + ' L ' + (PISTA[1] + 1) + ' ' + (EJE - 3.8) + ' L ' + (PISTA[1] + 1) + ' ' + (EJE + 3.8) + ' Z' }, P.clase);
    texto(P.clase, { class: 'am-rotulo', 'data-rotulo': 'tiempo', x: PISTA[1] + 8, y: EJE + 15, 'font-size': 11, 'text-anchor': 'end' }, 'el tiempo');
    /* Lo que es un brote, escrito: nada se dice solo con color. */
    var ley = el('g', { 'data-leyenda': '' }, P.clase);
    brote(ley, 18, 227, 1.2);
    texto(ley, { class: 'am-rotulo', 'data-rotulo': 'leyenda', x: 32, y: 226, 'font-size': 11 }, 'le llegaron sus cambios');

    /* Los brotes, uno por compañero, en su punto de la línea. Crecen desde
       la línea. */
    P.brotes = CLASE.map(function (c, i) {
      var g = el('g', { class: 'am-fuera', 'data-brote': c.nombre }, P.clase);
      g.style.transformOrigin = c.x + 'px ' + FILAS[i] + 'px';
      brote(g, c.x, FILAS[i], 1.3);
      return { g: g, x: c.x };
    });

    /* La raya del tiempo, que avanza tramo por tramo. */
    P.raya = [];
    var dentro = el('g', { 'data-raya-tiempo': '' }, P.clase);
    for (var t = 1; t <= TRAMOS; t++) { dentro = el('g', { class: 'am-viaja', 'data-tramo': String(t) }, dentro); P.raya.push(dentro); }
    el('line', { class: 'rd-ahora', 'data-ahora': '', x1: PISTA[0], y1: 16, x2: PISTA[0], y2: EJE - 1 }, dentro);
    el('path', { class: 'rd-ahora-punta', d: 'M ' + PISTA[0] + ' ' + (EJE - 1) + ' L ' + (PISTA[0] - 4.4) + ' ' + (EJE - 9) + ' L ' + (PISTA[0] + 4.4) + ' ' + (EJE - 9) + ' Z' }, dentro);

    /* ══ El día de Kenia, dos veces ══ */
    P.dia = el('g', { class: 'am-capa am-fuera', 'data-dia': '' }, svg);

    /* Lo que se compara en el paso 4: los dos momentos, uno encima del
       otro. Va primero, debajo de todo. */
    P.comparar = el('g', { class: 'am-fuera', 'data-comparar': '' }, P.dia);
    el('line', { class: 'rd-union', 'data-union': '', x1: LLEGA, y1: FILA.a + 8, x2: LLEGA, y2: FILA.b + 8 }, P.comparar);
    el('circle', { class: 'rd-anillo', 'data-anillo': 'a', cx: LLEGA, cy: FILA.a + 8, r: 9 }, P.comparar);
    el('circle', { class: 'rd-anillo', 'data-anillo': 'b', cx: LLEGA, cy: FILA.b + 8, r: 9 }, P.comparar);
    texto(P.comparar, { class: 'am-rotulo', 'data-rotulo': 'mismo', x: LLEGA + 7, y: 134, 'font-size': 11 }, 'el mismo momento');

    P.fila = {};
    [['a', 'Sin saber qué era'], ['b', 'Sabiendo qué era']].forEach(function (f) {
      var y = FILA[f[0]];
      var g = el('g', { 'data-fila': f[0] }, P.dia);
      if (f[0] === 'b') g.setAttribute('class', 'am-fuera');
      texto(g, { class: 'am-rotulo rd-titulo', 'data-rotulo': 'fila-' + f[0], x: 312, y: y - 82, 'font-size': 12.5, 'text-anchor': 'end' }, f[1]);
      el('line', { class: 'rd-camino', 'data-camino': f[0], x1: 38, y1: y, x2: CASA - 16, y2: y }, g);
      escuela(g, ESCUELA, y);
      casa(g, CASA, y);
      maestra(g, MAESTRA, y);
      estrella(g, LLEGA, y + 8);
      texto(g, { class: 'am-rotulo', 'data-rotulo': 'escuela', x: ESCUELA, y: y + 15, 'font-size': 11, 'text-anchor': 'middle' }, 'escuela');
      texto(g, { class: 'am-rotulo', 'data-rotulo': 'casa', x: CASA, y: y + 15, 'font-size': 11, 'text-anchor': 'middle' }, 'casa');
      texto(g, { class: 'am-rotulo', 'data-rotulo': 'maestra', x: MAESTRA, y: y + 15, 'font-size': 11, 'text-anchor': 'middle' }, 'maestra');
      texto(g, { class: 'am-rotulo', 'data-rotulo': 'llega', x: LLEGA + 12, y: y + 12.5, 'font-size': 11 }, 'le llega');
      P.fila[f[0]] = { g: g, y: y };
    });

    /* ── Primera fila: el pensamiento «¿estoy enferma?» se va con ella ── */
    var fa = P.fila.a.g;
    var a = P.a = {};
    a.camina = caminante(fa, 'a', 4, 'a');
    a.camina.piensa = piensa(a.camina.cuerpo, 'enferma', 'camina', '¿Estoy enferma?', 98);
    a.quieta = llegada(fa, 'a', EN_CASA, 'a', 'triste');
    a.quieta.piensa = piensa(a.quieta.cuerpo, 'enferma', 'quieta', '¿Estoy enferma?', 98);
    A.ver(a.quieta.piensa, true, 0);

    /* ── Segunda fila: «ya sé qué es», y donde la maestra le dice la
       palabra exacta y le pide ayuda ── */
    var fb = P.fila.b.g, yb = FILA.b;
    var b = P.b = {};
    b.camina = caminante(fb, 'b', 3, 'b');
    /* «Ya sé qué es» se enciende al llegarle y se apaga donde la maestra,
       cuando lo que piensa pasa a decirlo: dos envolturas, una para cada
       cosa, porque cada pieza tiene una sola demora. */
    b.camina.sabe = el('g', { class: 'am-fuera', 'data-envoltura': 'sabe' }, b.camina.cuerpo);
    b.camina.piensa = piensa(b.camina.sabe, 'sabe', 'camina', 'Ya sé qué es.', 88);
    A.ver(b.camina.piensa, true, 0);
    b.quieta = llegada(fb, 'b', PARA, 'b', 'contenta');
    /* Lo que le dice a la maestra, a la izquierda de su cabeza (a la
       derecha está la maestra). */
    function dice(cuando) {
      return globo(fb, 'dice', cuando, [PARA - 132, yb - 66, 124, 32], ['Es mi menstruación.', '¿Me ayuda?'],
        { pico: [[PARA - 14, yb - 42], [PARA - 7.5, yb - 31], [PARA - 14, yb - 36]], punta: [PARA - 7.5, yb - 31] });
    }
    b.dice = [dice('camina'), dice('quieta')];
    function visto(cuando) {
      var g = el('g', { class: 'am-fuera', 'data-ayuda': '', 'data-cuando': cuando }, fb);
      el('circle', { class: 'rd-visto', 'data-visto': '', cx: MAESTRA + 19, cy: yb - 38, r: 7 }, g);
      el('path', { class: 'rd-visto-marca', d: 'M ' + (MAESTRA + 15.4) + ' ' + (yb - 38) + ' L ' + (MAESTRA + 18) + ' ' + (yb - 35.2) + ' L ' + (MAESTRA + 22.8) + ' ' + (yb - 41) }, g);
      return g;
    }
    b.ayuda = [visto('camina'), visto('quieta')];

    /* ══ La pregunta del final ══ */
    P.tarjeta = el('g', { class: 'am-fuera', 'data-tarjeta': '' }, svg);
    el('rect', { class: 'rd-tarjeta', 'data-hoja': '', x: 60, y: 80, width: 200, height: 80, rx: 7 }, P.tarjeta);
    texto(P.tarjeta, { class: 'rd-globo-texto', 'data-rotulo': 'tarjeta', x: 160, y: 110, 'font-size': 13.5, 'text-anchor': 'middle' }, 'Le puedo preguntar a:');
    el('line', { class: 'rd-raya-escribir', 'data-escribir': '', x1: 86, y1: 142, x2: 234, y2: 142 }, P.tarjeta);
  }

  function caminar(k, fila, en, base, deja) {
    var xs = CAMINO[fila];
    for (var t = 1; t < xs.length; t++) {
      A.mover(k.g[t - 1], en ? xs[t] - xs[t - 1] : 0, 0, 0, 1, en ? base + CAMINA + (t - 1) * TRAMO : deja);
    }
  }

  function pintar(n, antes) {
    var entra = function (k) { return n === k && antes !== k; };
    var sale = function (k) { return antes === k && n !== k; };

    /* ── La clase ── */
    var claseDemora = n <= 1 && antes != null && antes >= 2 ? 400 : 0;
    A.ver(P.clase, n <= 1, claseDemora);
    var arranca = claseDemora + 300;
    P.raya.forEach(function (g, i) {
      var d = entra(1) ? arranca + i * TRAMO : sale(1) && n >= 2 ? 600 : 0;
      A.mover(g, n === 1 ? LARGO : 0, 0, 0, 1, d);
    });
    P.brotes.forEach(function (b) {
      var d = entra(1) ? arranca + (b.x - PISTA[0]) / LARGO * TRAMO : 0;
      A.ver(b.g, n === 1, d);
      A.mover(b.g, 0, 0, 0, n === 1 ? 1 : 0.25, d);
    });

    /* ── El día ── */
    var diaVe = n >= 2 && n <= 4;
    var diaDemora = diaVe && (antes == null || antes <= 1 || antes === 5) ? 400 : 0;
    A.ver(P.dia, diaVe, diaDemora);
    A.ver(P.fila.b.g, n === 3 || n === 4, 0);

    /* Primera fila: Kenia camina en el paso 2; en el 3 y el 4 ya está en
       su casa. Si se sale del paso, la que camina se apaga y vuelve a
       donde empezó cuando ya no se la ve. */
    var a = P.a, baseA = diaDemora + 300, ya = n === 2, deja = sale(2) ? 600 : 0;
    A.ver(a.camina.ver, ya, 0);
    caminar(a.camina, 'a', ya, baseA, deja);
    A.ver(a.camina.piensa, ya, ya ? baseA + PIENSA : 0);
    A.ver(a.camina.tranquila, !ya, ya ? baseA + PIENSA : deja);
    A.ver(a.camina.triste, ya, ya ? baseA + PIENSA : deja);
    A.ver(a.camina.lagrima, ya, ya ? baseA + LLEGA_CASA : deja);
    A.ver(a.quieta.ver, n === 3 || n === 4, 0);

    /* Segunda fila: Kenia camina en el paso 3; en el 4 ya está con la
       maestra. */
    var b = P.b, baseB = 300, yb = n === 3, dejaB = sale(3) ? 600 : 0;
    A.ver(b.camina.ver, yb, 0);
    caminar(b.camina, 'b', yb, baseB, dejaB);
    A.ver(b.camina.sabe, yb, yb ? baseB + PIENSA : 0);
    A.ver(b.camina.piensa, !yb, yb ? baseB + LLEGA_MAESTRA : dejaB);
    A.ver(b.camina.tranquila, !yb, yb ? baseB + LA_AYUDA : dejaB);
    A.ver(b.camina.contenta, yb, yb ? baseB + LA_AYUDA : dejaB);
    A.ver(b.dice[0], yb, yb ? baseB + LO_DICE : 0);
    A.ver(b.ayuda[0], yb, yb ? baseB + LA_AYUDA : 0);
    [b.dice[1], b.ayuda[1], b.quieta.ver].forEach(function (p) { A.ver(p, n === 4, 0); });

    /* Lo que se compara, y la pregunta del final. */
    A.ver(P.comparar, n === 4, entra(4) ? 300 : 0);
    A.ver(P.tarjeta, n === 5, entra(5) ? 400 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '?', palabras: '¿el mismo día?' },
      { cifra: CLASE.length + ' de ' + CLASE.length, palabras: 'cada uno a su tiempo' },
      { cifra: 'sola', palabras: 'todo el día' },
      { cifra: 'ayuda', palabras: 'ahí mismo' },
      { cifra: 'saber', palabras: 'lo que cambió' },
      { cifra: '?', palabras: '¿a quién le preguntas?' }
    ][n];
  }

  AnimacionMision.montar('#amSuTiempo', {
    vista: [ANCHO, ALTO],
    describe: 'Primero, seis compañeros de grado de Kenia, cada uno con su línea del tiempo, y una raya que avanza: a cada uno le sale un brote cuando le llegan sus cambios. Después, el día de Kenia dos veces, de la escuela a su casa con la maestra en el camino: sin saber qué era y sabiendo qué era.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['⏳ Pasa el tiempo', '🏫 El día de Kenia', '💬 ¿Y si ya sabía?', '🔍 ¿Qué cambió?', '💡 ¿Y tú?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
