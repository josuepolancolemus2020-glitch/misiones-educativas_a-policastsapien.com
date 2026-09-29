/* ============================================================
   M.E.T.A.S · Los Tipos de Textos · La carta de Kenia
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de la carta
   que no pedía nada: Kenia quería la cancha en el recreo, le escribió al
   director una carta preciosa contando lo bonito que es jugar, él dijo
   «¡qué bonito!», la guardó, y la cancha siguió cerrada. El aparato
   (botones, frase, marcador) vive en js/animacion-mision.js; aquí solo
   está el dibujo y dónde va cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  la carta, el director y la cancha con candado. Se busca, antes de
        tocar, el renglón donde Kenia pide la cancha: no está;
     1  el director busca dos cosas, qué le piden y por qué, y no encuentra
        ninguna. Dice «¡qué bonito!» y la cancha sigue cerrada;
     2  la MISMA carta, para su prima: ella quiere saber cómo le va, y la
        carta se lo cuenta. Ahí «¡qué bonito!» sí basta: no le falta nada;
     3  de vuelta al director, Kenia escribe lo que pide. Él pregunta:
        «¿Por qué?»;
     4  Kenia escribe la razón, con «porque». El director ya sabe qué le
        piden y por qué, dice que sí, y la cancha se abre;
     5  «Le pido» y «porque» son las pistas de la carta que pide: contar y
        pedir se escriben distinto, y por eso hay tipos de textos.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Ni una palabra de Kenia cambia.** Sus cuatro renglones son los
      mismos en los seis pasos, con las mismas letras: es lo que dice la
      historia, «no tenía ni una falta de ortografía». Lo que le faltaba no
      era escribir mejor: era pedir y decir por qué.
   2. ⚠️ **Lo que contesta el director no se le cree a la escena.** Cada
      lector busca algo (el director, qué le piden y por qué; su prima,
      cómo le va) y cada pregunta se contesta con un renglón de la carta. La
      sonda lee la carta que se ve, saca de ahí qué preguntas tienen
      respuesta, y lo compara con las etiquetas, con los hilos, con lo que
      dice el globo, con el marcador y con el candado de la cancha.
   3. ⚠️ **La carta de Kenia no estaba mal escrita, y se ve.** Es el paso de
      la prima: la misma carta, sin cambiarle nada, le sirve tal cual a
      quien solo quiere saber cómo le va. Sin ese paso el alumno saldría
      creyendo que contar está mal, y lo que está mal es contar cuando lo
      que se quiere es la cancha. Es la regla del mensaje sin señales de los
      peligros de la IA: una lección donde todo es error enseña a desconfiar
      de todo.
   4. ⚠️ **Lo que va debajo no se regala.** No se nombra ningún tipo de
      texto (son las respuestas de la selección múltiple) ni ninguna pieza
      de los pareados: ni la opinión que se defiende, ni la razón que la
      apoya con su nombre, ni la palabra que une ideas, ni «para qué se
      escribe» con su nombre de pareado. La selección múltiple traía «Pienso
      que el recreo debería durar más, porque jugar ayuda a aprender», que
      es la carta arreglada con otra ropa: se cambió (tipos-de-textos.js y
      la ficha).
   5. **El director dice que sí esta vez, no siempre.** La carta no obliga
      a nadie: pedir y dar una razón le da al director algo que contestar.
      La frase lo dice así, para no prometer lo que una carta no puede.
   6. **Lo que es papel y lo que es dibujo lleva su color en las dos
      pantallas**: la carta y el globo son de papel, con tinta oscura fija;
      la cancha, la malla y las personas son como son. Lo que va sobre el
      escenario (las preguntas del lector y sus hilos) lleva la tinta de la
      pantalla. Y nada se dice solo con color: una pregunta sin respuesta va
      con raya cortada, la contestada con raya entera y su ✓.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCarta')) return;

  var ANCHO = 304, ALTO = 276, FIN = 5;

  /* La carta: medida con la Fredoka de la misión a 13 (peso 600). «Jugar
     con mis compañeras» 155,65; «Le pido» 42,36; «que nos deje usar» 101,79;
     «la cancha en el recreo» 129,12; el punto 2,82; la coma 2,91; «porque»
     40,98; «a esa hora está vacía.» 126,05. El renglón más largo, el de la
     razón, acaba en 185,2 y la llave va en 189: cabe. Después de «Le pido»
     y de «porque» el espacio es un poco más ancho (SPM): en el paso 5 las
     dos llevan su aro, y con el espacio de siempre el aro se pegaba a la
     palabra de al lado (la lección de los aros de Marcadores Textuales). */
  var X0 = 13, SPM = 5.2;
  var W = {
    'Le pido': 42.36, 'que nos deje usar': 101.79, 'la cancha en el recreo': 129.12,
    '.': 2.82, ',': 2.91, porque: 40.98, 'a esa hora está vacía.': 126.05
  };
  function r2(v) { return Math.round(v * 100) / 100; }
  var Y_SALUDO = 24, Y_K = [44, 60, 76, 92], Y_P = [112, 128], Y_R = 144;
  /* La firma baja cuando crece la carta: siempre 22 debajo del último
     renglón. */
  var FIRMA_X = 182, FIRMA_Y = [114, 150, 166];

  /* Las llaves de la derecha: abarcan la tinta de los renglones que
     contestan cada pregunta, y de su mitad sale el hilo hasta la pregunta.
     La de lo que pide y la de la razón quedan a la altura de su pregunta,
     así el hilo va derecho. */
  var LLAVE = { cuenta: [32, 96], pide: [101, 131], razon: [133, 149] };
  var LX0 = 186, LX1 = 189;

  /* Las preguntas de cada lector: el director busca qué le piden y por
     qué; su prima, cómo le va. */
  var PX = 201, PW = 101, PH = 20;
  var PREG = {
    pide: { dice: '¿Qué me pide?', y: 106, hilo: 'M 201 116 H 189' },
    razon: { dice: '¿Por qué?', y: 131, hilo: 'M 201 141 H 189' },
    cuenta: { dice: '¿Cómo te va?', y: 106, hilo: 'M 201 116 H 195 V 64 H 189' }
  };

  /* El globo de lo que dice el lector, con la punta hacia su cabeza. */
  var GLOBO = 'M 210 4 H 293 Q 302 4 302 13 V 33 Q 302 42 293 42 H 257 L 251.5 48.5 L 246 42 H 210 Q 201 42 201 33 V 13 Q 201 4 210 4 Z';

  /* La cancha: de frente, con la malla, la puerta (su bisagra en x = 135) y
     el candado. Las niñas esperan afuera y entran cuando se abre. */
  var BISAGRA = 135;
  var NINAS = [
    { fuera: 22, dentro: 166, vestido: 'tt-vestido-1', pelo: 'cola' },
    { fuera: 46, dentro: 200, vestido: 'tt-vestido-2', pelo: 'trenzas' },
    { fuera: 70, dentro: 234, vestido: 'tt-vestido-3', pelo: 'corto' }
  ];

  var TEXTOS = [
    'Kenia quiere que el director les deje usar la cancha en el recreo. ¿En qué renglón se lo pide? Búscalo antes de tocar.',
    'El director busca qué le piden y por qué, y no lo encuentra. Dice «¡qué bonito!», y la cancha sigue cerrada.',
    'La misma carta, para su prima: ella quiere saber cómo le va, y la carta se lo cuenta. Aquí «¡qué bonito!» sí basta.',
    'De vuelta al director, Kenia escribe lo que pide: «Le pido que nos deje usar la cancha en el recreo». Él pregunta: «¿Por qué?»',
    'Kenia escribe la razón: «porque a esa hora está vacía». Ahora el director sabe qué le piden y por qué. Dice que sí.',
    '«Le pido» y «porque» son las pistas de la carta que pide. Contar y pedir se escriben distinto: por eso hay tipos de textos.'
  ];

  var A;
  var saludoD, saludoP, pide1, pide2, punto, coma, razon, firma, barrido;
  var llaves = {}, hilos = {}, preguntas = {}, dicen = {}, lectores = {};
  var puerta, candado, grilleteC, grilleteA, ninas = [], aros = {}, leyenda;

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Un pedazo de un renglón de la carta, con su tinta: la de Kenia desde
     el principio, o la de lo que escribe ahora. */
  function tinta(padre, dice, x, y, rol, clase) {
    return texto(padre, { class: (clase || 'tt-tinta'), 'data-linea': rol, x: r2(x), y: y, 'font-size': 13 }, dice);
  }

  /* La malla de alambre: rayas en diagonal que se cruzan, recortadas a su
     rectángulo, en un solo camino (un solo elemento que pintar). */
  function malla(padre, x0, y0, x1, y1, paso, clase) {
    var h = y1 - y0, d = [];
    for (var c = x0 - h; c < x1; c += paso) {
      /* «\»: baja hacia la derecha. */
      var ax = c, ay = y0, bx = c + h, by = y1;
      if (ax < x0) { ay += x0 - ax; ax = x0; }
      if (bx > x1) { by -= bx - x1; bx = x1; }
      if (bx - ax > 0.5) d.push('M' + r2(ax) + ' ' + r2(ay) + 'L' + r2(bx) + ' ' + r2(by));
      /* «/»: sube hacia la derecha. */
      ax = c; ay = y1; bx = c + h; by = y0;
      if (ax < x0) { ay -= x0 - ax; ax = x0; }
      if (bx > x1) { by += bx - x1; bx = x1; }
      if (bx - ax > 0.5) d.push('M' + r2(ax) + ' ' + r2(ay) + 'L' + r2(bx) + ' ' + r2(by));
    }
    return A.el('path', { class: clase, d: d.join('') }, padre);
  }

  /* Una niña de frente, con los pies en (0, 0): así se mueve y se achica
     desde donde pisa. */
  function nina(padre, datos, i) {
    var el = A.el;
    var g = el('g', { 'data-nina': String(i + 1) }, padre);
    el('rect', { class: 'tt-piel', x: -4, y: -11, width: 2.6, height: 10 }, g);
    el('rect', { class: 'tt-piel', x: 1.4, y: -11, width: 2.6, height: 10 }, g);
    el('rect', { class: 'tt-zapato', x: -4.6, y: -2, width: 3.8, height: 2, rx: 0.8 }, g);
    el('rect', { class: 'tt-zapato', x: 0.8, y: -2, width: 3.8, height: 2, rx: 0.8 }, g);
    el('path', { class: 'tt-brazo', d: 'M -5 -24 L -9 -15 M 5 -24 L 9 -15' }, g);
    el('path', { class: datos.vestido, d: 'M -9 -10 L -5.5 -26 Q 0 -28 5.5 -26 L 9 -10 Z' }, g);
    el('rect', { class: 'tt-piel', x: -1.6, y: -29, width: 3.2, height: 3.4 }, g);
    if (datos.pelo === 'cola') el('path', { class: 'tt-pelo', d: 'M 5 -38 Q 10.5 -35 8.4 -27.5 Q 6.6 -32 4.6 -35 Z' }, g);
    if (datos.pelo === 'trenzas') {
      el('path', { class: 'tt-pelo', d: 'M -6.4 -35 Q -8.2 -30 -6.6 -25.5 Q -5.6 -30 -4.6 -33 Z' }, g);
      el('path', { class: 'tt-pelo', d: 'M 6.4 -35 Q 8.2 -30 6.6 -25.5 Q 5.6 -30 4.6 -33 Z' }, g);
    }
    el('circle', { class: 'tt-piel', cx: 0, cy: -34, r: 6 }, g);
    el('path', { class: 'tt-pelo', d: 'M -6.3 -33 Q -6.6 -41 0 -41.3 Q 6.6 -41 6.3 -33 Q 5 -37.2 0 -37.4 Q -5 -37.2 -6.3 -33 Z' }, g);
    el('circle', { class: 'tt-ojo', cx: -2.1, cy: -34, r: 0.8 }, g);
    el('circle', { class: 'tt-ojo', cx: 2.1, cy: -34, r: 0.8 }, g);
    el('path', { class: 'tt-boca', d: 'M -1.8 -31.2 Q 0 -29.8 1.8 -31.2' }, g);
    return g;
  }

  /* El director y la prima, de medio cuerpo, con la cabeza en (0, 0). */
  function director(padre) {
    var el = A.el;
    var g = el('g', { 'data-lector': 'director' }, padre);
    el('rect', { class: 'tt-piel', x: -4, y: 8, width: 8, height: 7 }, g);
    el('path', { class: 'tt-saco', d: 'M -19 41 L -17 20 Q -15 14 0 13 Q 15 14 17 20 L 19 41 Z' }, g);
    el('path', { class: 'tt-camisa', d: 'M -5.5 14 L 0 25 L 5.5 14 Z' }, g);
    el('path', { class: 'tt-corbata', d: 'M -1.4 15 L 1.4 15 L 2.6 26 L 0 29.5 L -2.6 26 Z' }, g);
    el('circle', { class: 'tt-piel-2', cx: 0, cy: 0, r: 10 }, g);
    el('path', { class: 'tt-canas', d: 'M -10 -2 Q -9.5 -10.5 0 -11 Q 9.5 -10.5 10 -2 Q 8 -6.5 0 -6.6 Q -8 -6.5 -10 -2 Z' }, g);
    el('circle', { class: 'tt-ojo', cx: -4, cy: 0.8, r: 0.9 }, g);
    el('circle', { class: 'tt-ojo', cx: 4, cy: 0.8, r: 0.9 }, g);
    el('path', { class: 'tt-lentes', d: 'M -7 0.6 A 3 3 0 1 0 -1 0.6 A 3 3 0 1 0 -7 0.6 M 1 0.6 A 3 3 0 1 0 7 0.6 A 3 3 0 1 0 1 0.6 M -1 0.2 H 1' }, g);
    el('path', { class: 'tt-bigote', d: 'M -4 5 Q 0 3 4 5 Q 0 6.6 -4 5 Z' }, g);
    el('path', { class: 'tt-boca', d: 'M -2.5 7.6 Q 0 8.8 2.5 7.6' }, g);
    return g;
  }
  function prima(padre) {
    var el = A.el;
    var g = el('g', { 'data-lector': 'prima' }, padre);
    el('rect', { class: 'tt-piel', x: -4, y: 8, width: 8, height: 7 }, g);
    el('path', { class: 'tt-blusa', d: 'M -18 41 L -16 21 Q -14 14 0 13.5 Q 14 14 16 21 L 18 41 Z' }, g);
    el('path', { class: 'tt-pelo', d: 'M 8.6 -6 Q 17 -3 14 11 Q 12 3 8 -1.6 Z' }, g);
    el('circle', { class: 'tt-piel', cx: 0, cy: 0, r: 10 }, g);
    el('path', { class: 'tt-pelo', d: 'M -10.5 1 Q -11 -11 0 -11.5 Q 11 -11 10.5 1 Q 9 -5 3 -6 Q -2 -3 -9 -3.2 Q -10 -1 -10.5 1 Z' }, g);
    el('path', { class: 'tt-lazo', d: 'M 8 -6 L 12.6 -9.2 L 12.2 -3.2 Z M 8 -6 L 5.8 -10.6 L 3.8 -6.6 Z' }, g);
    el('circle', { class: 'tt-ojo', cx: -3.6, cy: 1, r: 1 }, g);
    el('circle', { class: 'tt-ojo', cx: 3.6, cy: 1, r: 1 }, g);
    el('path', { class: 'tt-boca', d: 'M -3 5 Q 0 7.6 3 5' }, g);
    return g;
  }

  /* Una pregunta del lector: su etiqueta con raya cortada mientras no tiene
     respuesta en la carta, y con raya entera y su ✓ cuando la tiene. */
  function pregunta(padre, de) {
    var p = PREG[de], el = A.el;
    var g = el('g', { class: 'am-fuera', 'data-pregunta': p.dice, 'data-de': de }, padre);
    var abierta = el('rect', { class: 'tt-preg-abierta', 'data-abierta': '', x: PX, y: p.y, width: PW, height: PH, rx: 6 }, g);
    var hecha = el('rect', { class: 'tt-preg-hecha am-fuera', 'data-hecha': '', x: PX, y: p.y, width: PW, height: PH, rx: 6 }, g);
    texto(g, { class: 'tt-preg-dice', 'data-pregunta-dice': '', x: PX + 6, y: p.y + 14, 'font-size': 11.5 }, p.dice);
    var visto = texto(g, { class: 'tt-visto am-fuera', 'data-visto': '', x: PX + PW - 6, y: p.y + 14.5, 'text-anchor': 'end', 'font-size': 11.5 }, '✓');
    return { g: g, abierta: abierta, hecha: hecha, visto: visto };
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── La cancha, de frente. Lo de atrás primero: el piso, la canasta y
       las niñas, que cuando entran quedan detrás de la malla. ── */
    el('rect', { class: 'tt-suelo', x: 0, y: 268, width: ANCHO, height: 8 }, svg);
    el('rect', { class: 'tt-piso', 'data-cancha': '', x: 94, y: 238, width: 207, height: 30 }, svg);
    el('path', { class: 'tt-raya-cancha', d: 'M 104 254 H 296' }, svg);
    el('rect', { class: 'tt-poste', x: 280.5, y: 200, width: 3, height: 68 }, svg);
    el('rect', { class: 'tt-tablero', x: 264, y: 184, width: 36, height: 20, rx: 1.5 }, svg);
    el('rect', { class: 'tt-cuadro', x: 276, y: 192, width: 12, height: 9 }, svg);
    el('path', { class: 'tt-red', d: 'M 276 207 L 278 215 L 282 209 L 286 215 L 288 207' }, svg);
    el('path', { class: 'tt-canasta', d: 'M 275 207 H 289' }, svg);
    NINAS.forEach(function (d, i) { ninas.push(nina(svg, d, i)); });

    /* La malla fija, sus postes y la puerta, que gira sobre su bisagra. */
    el('rect', { class: 'tt-cerca', 'data-cerca': '', x: 91, y: 204, width: 213, height: 64 }, svg);
    malla(svg, BISAGRA + 3, 206, 301, 268, 9, 'tt-malla');
    el('rect', { class: 'tt-poste', x: BISAGRA + 3, y: 204, width: 163, height: 2.5 }, svg);
    puerta = el('g', { 'data-puerta': '' }, svg);
    malla(puerta, 95, 206, BISAGRA, 266, 9, 'tt-malla');
    el('rect', { class: 'tt-marco', 'data-puerta-marco': '', x: 95, y: 206, width: BISAGRA - 95, height: 60 }, puerta);
    [91, BISAGRA, 301].forEach(function (x) { el('rect', { class: 'tt-poste', x: x, y: 204, width: 3, height: 64 }, svg); });

    /* El candado, en la orilla de la puerta. Abierto, se le sale el gancho;
       después se quita y la puerta se abre. */
    candado = el('g', { 'data-candado': '' }, svg);
    grilleteC = el('path', { class: 'tt-grillete', 'data-grillete': 'cerrado', d: 'M 99 236.5 V 233 A 2.5 2.5 0 0 1 104 233 V 236.5' }, candado);
    grilleteA = el('path', { class: 'tt-grillete am-fuera', 'data-grillete': 'abierto', d: 'M 99 236.5 V 230.2 A 2.5 2.5 0 0 1 104 230.2 V 231.4' }, candado);
    el('rect', { class: 'tt-candado', x: 97.5, y: 236, width: 8, height: 7, rx: 1.2 }, candado);
    el('circle', { class: 'tt-cerradura', cx: 101.5, cy: 239.5, r: 1 }, candado);

    /* ── La carta: la hoja, el resaltador con que el director la lee, y los
       renglones. ── */
    el('rect', { class: 'tt-papel', 'data-papel': '', x: 4, y: 4, width: 190, height: 172, rx: 3 }, svg);
    barrido = el('rect', { class: 'tt-barrido am-fuera', 'data-barrido': '', x: 9, y: 32, width: 180, height: 16, rx: 3 }, svg);

    saludoD = tinta(svg, 'Señor director:', X0, Y_SALUDO, 'saludo');
    saludoP = tinta(svg, 'Querida prima:', X0, Y_SALUDO, 'saludo');
    saludoP.classList.add('am-fuera');
    ['Jugar con mis compañeras', 'es lo más bonito del día.', 'Corremos, saltamos y nos', 'reímos. ¡Nadie se aburre!']
      .forEach(function (t, i) { tinta(svg, t, X0, Y_K[i], 'cuenta'); });

    /* Lo que Kenia escribe después, con la tinta de ahora. */
    pide1 = el('g', { class: 'am-fuera' }, svg);
    tinta(pide1, 'Le pido', X0, Y_P[0], 'pide', 'tt-tinta-nueva');
    tinta(pide1, 'que nos deje usar', X0 + W['Le pido'] + SPM, Y_P[0], 'pide', 'tt-tinta-nueva');
    pide2 = tinta(svg, 'la cancha en el recreo', X0, Y_P[1], 'pide', 'tt-tinta-nueva am-fuera');
    punto = tinta(svg, '.', X0 + W['la cancha en el recreo'], Y_P[1], 'pide', 'tt-tinta-nueva am-fuera');
    coma = tinta(svg, ',', X0 + W['la cancha en el recreo'], Y_P[1], 'pide', 'tt-tinta-nueva am-fuera');
    razon = el('g', { class: 'am-fuera' }, svg);
    tinta(razon, 'porque', X0, Y_R, 'razon', 'tt-tinta-nueva');
    tinta(razon, 'a esa hora está vacía.', X0 + W.porque + SPM, Y_R, 'razon', 'tt-tinta-nueva');
    firma = texto(svg, { class: 'tt-tinta', 'data-linea': 'firma', x: FIRMA_X, y: 0, 'text-anchor': 'end', 'font-size': 13 }, 'Kenia');

    /* Las llaves de lo que contesta cada pregunta. */
    ['cuenta', 'pide', 'razon'].forEach(function (de) {
      var y = LLAVE[de];
      llaves[de] = el('path', { class: 'tt-llave am-fuera', 'data-llave': de, d: 'M ' + LX0 + ' ' + y[0] + ' H ' + LX1 + ' V ' + y[1] + ' H ' + LX0 }, svg);
    });

    /* Paso 5: un aro alrededor de cada pista. */
    [['Le pido', Y_P[0]], ['porque', Y_R]].forEach(function (m) {
      aros[m[0]] = el('rect', { class: 'tt-aro am-fuera', 'data-aro': m[0], x: r2(X0 - 2.2), y: m[1] - 12.5, width: r2(W[m[0]] + 4.4), height: 17, rx: 6 }, svg);
    });

    /* ── El lector: lo que dice, su figura y lo que busca en la carta.
       Cada cosa que dice lleva su propio globo: si el globo se quedara
       puesto, entre una frase y la siguiente se veía vacío casi dos
       segundos, como si el lector se hubiera quedado sin palabras. ── */
    function dice(de, lineas) {
      var g = el('g', { class: 'am-fuera', 'data-dice': de }, svg);
      el('path', { class: 'tt-globo', 'data-globo': '', d: GLOBO }, g);
      lineas.forEach(function (t, i) {
        texto(g, { class: 'tt-globo-dice', x: 251.5, y: lineas.length === 1 ? 27.5 : 19 + 15 * i, 'text-anchor': 'middle', 'font-size': 12.5 }, t);
      });
      return g;
    }
    dicen.bonitoD = dice('director', ['¡Qué bonito!']);
    dicen.bonitoP = dice('prima', ['¡Qué bonito!']);
    dicen.porque = dice('director', ['¿Y por qué?']);
    dicen.si = dice('director', ['¡Sí! Úsenla', 'desde el lunes.']);

    var lugar = el('g', { transform: 'translate(251.5 59)' }, svg);
    lectores.director = director(lugar);
    lectores.prima = prima(lugar);
    lectores.prima.classList.add('am-fuera');

    ['cuenta', 'pide', 'razon'].forEach(function (de) {
      preguntas[de] = pregunta(svg, de);
      hilos[de] = el('path', { class: 'tt-hilo', 'data-hilo': de, d: PREG[de].hilo }, svg);
    });

    /* La leyenda del paso 5, en un pedazo de papel. */
    leyenda = el('g', { class: 'am-fuera', 'data-leyenda': '' }, svg);
    el('rect', { class: 'tt-papel', x: PX, y: 157, width: PW, height: 22, rx: 5 }, leyenda);
    el('rect', { class: 'tt-aro', 'data-leyenda-aro': '', x: PX + 6, y: 162, width: 20, height: 12, rx: 5 }, leyenda);
    texto(leyenda, { class: 'tt-tinta', 'data-leyenda-dice': '', x: PX + 32, y: 172.3, 'font-size': 12 }, 'las pistas');
  }

  /* La puerta gira sobre su bisagra: de frente, eso es angostarse hacia
     ella. Misma lista de funciones en los dos extremos, para que el
     navegador interpole cada una por su lado. */
  function girarPuerta(abierta, demora) {
    puerta.style.setProperty('--d', Math.round(demora || 0) + 'ms');
    puerta.style.transform = 'translate(' + BISAGRA + 'px, 0px) scale(' + (abierta ? 0.18 : 1) + ', 1) translate(-' + BISAGRA + 'px, 0px)';
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);
    var fue = function (k) { return ida && n === k; };
    var vuelve = function (k) { return !ida && antes === k; };

    /* Qué hay en cada paso: quién lee, qué dice la carta, qué contesta. */
    var lector = n === 2 ? 'prima' : 'director';
    var conPide = n >= 3, conRazon = n >= 4;
    var abierta = conPide && conRazon;

    /* ── El lector. Al ir a la prima, primero se apaga lo del director; al
       volver, al revés. ── */
    var dSale = 200, dEntra = 600;
    A.ver(lectores.director, lector === 'director', lector === 'director' ? ((fue(3) || vuelve(2)) ? dEntra : 0) : dSale);
    A.ver(saludoD, lector === 'director', lector === 'director' ? ((fue(3) || vuelve(2)) ? dEntra : 0) : dSale);
    A.ver(lectores.prima, lector === 'prima', lector === 'prima' ? dEntra : dSale);
    A.ver(saludoP, lector === 'prima', lector === 'prima' ? dEntra : dSale);

    /* ── Lo que Kenia escribe: lo que pide (paso 3) y la razón (paso 4). La
       firma baja antes de que aparezcan, y sube después de que se van. ── */
    A.ver(pide1, conPide, fue(3) ? 1200 : (vuelve(3) ? 200 : 0));
    A.ver(pide2, conPide, fue(3) ? 1400 : (vuelve(3) ? 200 : 0));
    A.ver(punto, n === 3, fue(3) ? 1400 : (vuelve(4) ? 600 : 0));
    A.ver(coma, conRazon, fue(4) ? 300 : (vuelve(4) ? 200 : 0));
    A.ver(razon, conRazon, fue(4) ? 600 : (vuelve(4) ? 200 : 0));
    var fy = conRazon ? FIRMA_Y[2] : (conPide ? FIRMA_Y[1] : FIRMA_Y[0]);
    /* De vuelta, la firma espera a que se apaguen los renglones: si subía
       enseguida, pasaba por encima de ellos. */
    A.mover(firma, 0, fy, 0, 1, ida ? (fue(3) ? 900 : (fue(4) ? 200 : 0)) : 500);

    /* ── El resaltador del director, solo al ir al paso 1 y con
       movimiento: recorre los cuatro renglones de Kenia buscando. ── */
    barrido.classList.remove('tt-lee');
    if (fue(1) && !A.quieto()) {
      barrido.style.setProperty('--d', '500ms');
      A.asentar();
      barrido.classList.add('tt-lee');
    }

    /* ── Las preguntas del lector y lo que las contesta. ── */
    var hay = { cuenta: true, pide: conPide, razon: conRazon };
    var busca = n === 0 ? [] : (lector === 'prima' ? ['cuenta'] : ['pide', 'razon']);
    ['cuenta', 'pide', 'razon'].forEach(function (de) {
      var p = preguntas[de], si = busca.indexOf(de) >= 0, contestada = si && hay[de];
      /* Cuándo sale la etiqueta, y cuándo se ve contestada. */
      var dVer = 0, dHecha = 0;
      if (si) {
        if (de === 'cuenta') { dVer = 900; dHecha = 1500; }
        else if (fue(1)) dVer = de === 'pide' ? 200 : 350;
        else if (fue(3) || vuelve(2)) dVer = de === 'pide' ? 800 : 950;
        if (de === 'pide') dHecha = fue(3) ? 2100 : 0;
        if (de === 'razon') dHecha = fue(4) ? 1300 : (vuelve(4) ? 300 : 0);
      }
      A.ver(p.g, si, si ? dVer : 0);
      A.ver(p.abierta, !contestada, contestada ? dHecha : dHecha);
      A.ver(p.hecha, contestada, dHecha);
      A.ver(p.visto, contestada, dHecha);
      var dLlave = de === 'cuenta' ? 1300 : (de === 'pide' ? (fue(3) ? 1800 : 0) : (fue(4) ? 1000 : 0));
      A.ver(llaves[de], contestada, contestada ? dLlave : 0);
      /* El hilo se dibuja poco a poco, y además se apaga: un camino con el
         trazo corrido no se ve, pero sigue «encendido» para quien lo mire
         por su opacidad, y la sonda lo mira así. */
      A.ver(hilos[de], contestada, contestada ? dLlave + 100 : 0);
      A.trazar(hilos[de], contestada, contestada ? dLlave + 100 : 0);
    });

    /* ── Lo que dice el lector. Cada frase es su propio texto: el
       «¡qué bonito!» de la prima no es el del director, y se dice otra
       vez. ── */
    var quien = n === 0 ? null : (lector === 'prima' ? 'bonitoP' : (abierta ? 'si' : (conPide ? 'porque' : 'bonitoD')));
    var dDice = { bonitoD: fue(1) ? 2300 : (vuelve(2) ? 1100 : 0), bonitoP: 1900, porque: fue(3) ? 2400 : (vuelve(4) ? 700 : 0), si: fue(4) ? 1600 : 0 };
    Object.keys(dicen).forEach(function (k) { A.ver(dicen[k], quien === k, quien === k ? dDice[k] : 0); });

    /* ── La cancha: el candado se abre, se quita, la puerta gira y entran
       las niñas, primero la que está más cerca de la puerta. Si arrancaba
       la de atrás, alcanzaba a las otras y entraban amontonadas: solo se
       vio fotografiando el paso a medio camino. De vuelta, al revés. ── */
    A.ver(grilleteC, !abierta, abierta ? (fue(4) ? 2000 : 0) : ((vuelve(4) || vuelve(5)) ? 1600 : 0));
    A.ver(grilleteA, abierta, abierta ? (fue(4) ? 2000 : 0) : 0);
    A.ver(candado, !abierta, abierta ? (fue(4) ? 2400 : 0) : ((vuelve(4) || (!ida && antes >= 4)) ? 1600 : 0));
    girarPuerta(abierta, abierta ? (fue(4) ? 2500 : 0) : ((!ida && antes >= 4) ? 1300 : 0));
    ninas.forEach(function (g, i) {
      var d = NINAS[i];
      g.classList.add('tt-camina');
      A.mover(g, abierta ? d.dentro : d.fuera, abierta ? 265 : 268, 0, abierta ? 0.94 : 1,
        abierta ? (fue(4) ? 2700 + 150 * (NINAS.length - 1 - i) : 0) : 0);
    });

    /* ── 5 · Las pistas: un aro alrededor de «Le pido» y de «porque». ── */
    A.ver(aros['Le pido'], n === 5, fue(5) ? 300 : 0);
    A.ver(aros.porque, n === 5, fue(5) ? 500 : 0);
    A.ver(leyenda, n === 5, fue(5) ? 900 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: 'lo que busca el director' },
      { cifra: '2', palabras: 'preguntas sin respuesta' },
      { cifra: '0', palabras: 'preguntas sin respuesta' },
      { cifra: '1', palabras: 'pregunta sin respuesta' },
      { cifra: '0', palabras: 'preguntas sin respuesta' },
      { cifra: '2', palabras: 'pistas de la carta que pide' }
    ][n];
  }

  AnimacionMision.montar('#amCarta', {
    vista: [ANCHO, ALTO],
    describe: 'La carta de Kenia al director cuenta lo bonito que es jugar con sus compañeras, pero no pide nada: la cancha sigue cerrada. A su prima, esa misma carta le basta. Cuando Kenia escribe lo que pide y la razón, el director dice que sí y la cancha se abre.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['📨 Entregar la carta', '💌 ¿Y para su prima?', '✍️ Escribir lo que pide', '✍️ Escribir la razón', '🔎 Las pistas', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
