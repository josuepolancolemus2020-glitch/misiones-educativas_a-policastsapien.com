/* ============================================================
   M.E.T.A.S · El Adjetivo Avanzado · Las dos comas del acta
   ------------------------------------------------------------
   La escena de la animación que va después de la historia del acta:
   «Los alumnos, que reprobaron Matemáticas, repetirán el año». Con esas
   dos comas la frase dice que reprobaron todos; sin ellas, que solo
   algunos. Se firmó así, y hubo que citar a treinta familias para
   desmentirlo. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza
   en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  el acta como se firmó, con sus dos comas, y el aula: 35 alumnos,
        5 con la ✗ de Matemáticas. ¿Quiénes repiten, según el acta?
     1  entre las dos comas, «que reprobaron Matemáticas» no escoge a
        nadie: el acta habla de los 35. Se encierra a los 35;
     2  pero 30 aprobaron: hubo que citar a sus 30 familias. Un sobre por
        familia;
     3  sin las comas, la oración va pegada a «alumnos» y escoge: se quedan
        encerrados solo los 5 que reprobaron;
     4  sin comas, la oración delimita el grupo: es restrictiva;
     5  con las comas otra vez, es explicativa: describe a todos, y eso
        solo sirve si es verdad de todos.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Ninguna palabra del acta cambia.** «Los alumnos», «que
      reprobaron Matemáticas» y «repetirán el año.» son las mismas en los
      seis pasos: lo único que entra y sale son las dos comas. Es lo que
      dice la historia, «no cambió ninguna palabra». Al irse las comas, la
      oración se corre lo que medía la coma y queda pegada a «alumnos»,
      con un espacio, como se escribe.
   2. ⚠️ **De quiénes habla el acta no se le cree a la escena.** El aro
      alrededor de un alumno quiere decir «de este habla el acta, este
      repite». La sonda lee el acta que se ve, saca de ahí si lleva las
      comas, y con eso calcula a quiénes nombra: a todos, o solo a los de
      la ✗. Lo compara con los aros, con los sobres, con el subrayado, con
      la etiqueta y con el marcador.
   3. ⚠️ **El precio se cuenta.** Hay 35 alumnos y 5 reprobaron: el acta
      con comas dice que repiten los 35, y a los 30 que aprobaron hubo que
      desmentirlo. Son los treinta de la historia, y los 30 sobres caen
      justo en los 30 de la ✓.
   4. ⚠️ **Las comas no son el error.** El último paso las vuelve a poner
      y dice cuándo sirven: la oración explicativa describe a todos, y eso
      está bien si es verdad de todos. Aquí no lo era. Una lección donde
      las comas solo causan desastres enseña a quitarlas siempre, que es
      otra forma de escribir mal.
   5. ⚠️ **Lo que va debajo no se regala.** Esta misión no trae «Predice»,
      pero sí una prueba: la animación no nombra ninguna otra clase de
      adjetivo ni ninguna función, ni una palabra de las respuestas. La
      selección múltiple traía «Los alumnos aplicados aprobaron», que es
      el acta con otra ropa: se cambió (js/app.js y la ficha).
   6. **Nada se dice solo con color.** La ✗ y la ✓ son dos dibujos
      distintos; lo que escoge va subrayado con raya entera y lo que va
      aparte, entre comas, con raya cortada, igual que su etiqueta. El
      acta, las notas y los sobres son papel y se quedan como son en las
      dos pantallas; los aros y la leyenda llevan la tinta de la pantalla.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amActa')) return;

  var ANCHO = 304, ALTO = 278, FIN = 5;

  /* El acta, medida con la Fredoka de la misión a 13,5 (peso 600): «Los
     alumnos» 75,87; la coma 3,02; el espacio 3,25; «que reprobaron
     Matemáticas» 176,31. Con las comas, el renglón acaba en 277,46 y la
     hoja en 300: cabe. Sin ellas, la oración se corre 3,02 a la izquierda
     y deja un solo espacio después de «alumnos». */
  var X0 = 16, Y1 = 41, Y2 = 67, FZ = 13.5;
  var W_SUJ = 75.87, W_COMA = 3.02, W_ESP = 3.25, W_INC = 176.31;
  var X_COMA1 = X0 + W_SUJ;                          // 91.87
  var X_INC = X_COMA1 + W_COMA + W_ESP;              // 98.14, con las comas
  var X_COMA2 = X_INC + W_INC;                       // 274.45
  var Y_SUB = Y1 + 5;                                // el subrayado
  function r2(v) { return Math.round(v * 100) / 100; }

  /* El aula: siete columnas y cinco filas, 35 alumnos. Cinco reprobaron
     Matemáticas, uno en cada fila y regados como caen en una lista de
     verdad. */
  var COLS = 7, FILAS = 5, CX0 = 26, PX = 42, CY0 = 100, PY = 32;
  var REPROBARON = [4, 8, 20, 24, 28];
  var PIELES = ['aa-piel-1', 'aa-piel-2', 'aa-piel-3'];
  var PELOS = ['corto', 'largo', 'cola'];

  var TEXTOS = [
    'El acta se firmó con estas dos comas. En el aula hay 35 alumnos: 5 reprobaron Matemáticas. ¿Quiénes repiten, según el acta?',
    'Entre las dos comas, «que reprobaron Matemáticas» no escoge a nadie. El acta dice que los 35 reprobaron y que los 35 repiten.',
    'Pero 30 aprobaron. El acta decía que repetían el año, y hubo que citar a sus 30 familias para desmentirlo.',
    'Sin las comas, «que reprobaron Matemáticas» va pegado a «alumnos» y escoge: repiten solo los 5 que reprobaron.',
    'Sin comas, la oración delimita el grupo: de todos los alumnos, deja solo a los que reprobaron. Es restrictiva.',
    'Entre comas, la oración es explicativa: no escoge, describe a todos. Solo sirve si es verdad de todos, y aquí no lo era.'
  ];

  var A;
  var inciso, comas = [], marcas = [], subSujeto, subInciso, subTodo;
  var etiquetas = {}, hilosEtq = {}, arosP = [], arosF = [], sobres = [], leyAro, leySobre;

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* La ✗ son dos rayas que se cruzan; la ✓, una sola que quiebra. Van
     dibujadas, no escritas: así se ven iguales en cualquier teléfono, y la
     sonda puede contar las rayas. */
  function nota(padre, reprobo, x, y) {
    var el = A.el;
    var g = el('g', { 'data-nota': reprobo ? 'reprobo' : 'aprobo', transform: 'translate(' + x + ' ' + y + ')' }, padre);
    el('rect', { class: 'aa-nota ' + (reprobo ? 'aa-nota-no' : 'aa-nota-si'), x: -4.6, y: -4.1, width: 9.2, height: 8.2, rx: 1.2 }, g);
    el('path', { class: 'aa-marca ' + (reprobo ? 'aa-marca-no' : 'aa-marca-si'), 'data-marca': '',
      d: reprobo ? 'M -2.3 -2.3 L 2.3 2.3 M 2.3 -2.3 L -2.3 2.3' : 'M -2.6 0 L -0.7 2.1 L 2.8 -2.4' }, g);
    return g;
  }

  /* Un alumno de medio cuerpo, con la camisa del uniforme y su nota de
     Matemáticas en el pecho. (0, 0) es el centro de su lugar. */
  function alumno(padre, i) {
    var el = A.el;
    var f = Math.floor(i / COLS), c = i % COLS, reprobo = REPROBARON.indexOf(i) >= 0;
    var cx = CX0 + PX * c, cy = CY0 + PY * f;
    var g = el('g', { 'data-alumno': String(i + 1), 'data-fila': String(f), transform: 'translate(' + cx + ' ' + cy + ')' }, padre);
    var piel = PIELES[(i * 5 + f) % 3], pelo = PELOS[(i * 7 + c) % 3];
    if (pelo === 'largo') el('path', { class: 'aa-pelo', d: 'M -6.4 -8 Q -7.4 -1.4 -5.6 3.4 L 5.6 3.4 Q 7.4 -1.4 6.4 -8 Z' }, g);
    if (pelo === 'cola') el('path', { class: 'aa-pelo', d: 'M 4.8 -11.4 Q 10.4 -9.6 8.6 -2.6 Q 7.4 -6.6 4.2 -8.8 Z' }, g);
    el('path', { class: 'aa-camisa', d: 'M -10 13 Q -10 1.2 -3.2 -0.2 L 3.2 -0.2 Q 10 1.2 10 13 Z' }, g);
    el('path', { class: 'aa-cuello', d: 'M -3.2 -0.2 L 0 3.2 L 3.2 -0.2' }, g);
    el('rect', { class: piel, x: -1.6, y: -2.8, width: 3.2, height: 3 }, g);
    el('circle', { class: piel, cx: 0, cy: -7.4, r: 5.6 }, g);
    el('path', { class: 'aa-pelo', d: pelo === 'corto'
      ? 'M -5.8 -7.8 Q -6.2 -13.6 0 -13.7 Q 6.2 -13.6 5.8 -7.8 Q 4.6 -11 0 -11.1 Q -4.6 -11 -5.8 -7.8 Z'
      : 'M -6.1 -6.6 Q -6.8 -13.8 0 -13.9 Q 6.8 -13.8 6.1 -6.6 Q 5 -10.2 0.6 -10.8 Q -3.6 -9.6 -6.1 -6.6 Z' }, g);
    el('circle', { class: 'aa-ojo', cx: -2, cy: -7, r: 0.65 }, g);
    el('circle', { class: 'aa-ojo', cx: 2, cy: -7, r: 0.65 }, g);
    nota(g, reprobo, 0, 7.4);
    return { g: g, cx: cx, cy: cy, fila: f, reprobo: reprobo };
  }

  /* Un sobre de citación, en la esquina de arriba del alumno. */
  function sobre(padre, x, y) {
    var el = A.el;
    el('rect', { class: 'aa-sobre', x: x, y: y, width: 12, height: 8, rx: 0.8 }, padre);
    el('path', { class: 'aa-sobre-solapa', d: 'M ' + x + ' ' + y + ' L ' + (x + 6) + ' ' + (y + 4.6) + ' L ' + (x + 12) + ' ' + y }, padre);
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El acta ── */
    el('rect', { class: 'aa-papel', 'data-papel': '', x: 4, y: 4, width: 296, height: 72, rx: 3 }, svg);
    texto(svg, { class: 'aa-titulo', x: X0, y: 19, 'font-size': 11 }, 'Acta de la reunión');
    el('path', { class: 'aa-regla', d: 'M ' + X0 + ' 24.5 H 288' }, svg);

    /* El subrayado va debajo de las letras: lo que nombra al grupo, con
       raya entera; lo que va aparte entre comas, con raya cortada. */
    subSujeto = el('path', { class: 'aa-subraya am-fuera', 'data-subraya': 'sujeto', d: 'M ' + X0 + ' ' + Y_SUB + ' H ' + r2(X_COMA1) }, svg);
    subInciso = el('path', { class: 'aa-subraya aa-aparte am-fuera', 'data-subraya': 'inciso', d: 'M ' + r2(X_INC) + ' ' + Y_SUB + ' H ' + r2(X_COMA2) }, svg);
    subTodo = el('path', { class: 'aa-subraya am-fuera', 'data-subraya': 'todo', d: 'M ' + X0 + ' ' + Y_SUB + ' H ' + r2(X_COMA1 + W_ESP + W_INC) }, svg);

    texto(svg, { class: 'aa-tinta', 'data-acta': 'sujeto', 'data-renglon': '1', x: X0, y: Y1, 'font-size': FZ }, 'Los alumnos');
    comas.push(texto(svg, { class: 'aa-tinta', 'data-acta': 'coma', 'data-renglon': '1', x: r2(X_COMA1), y: Y1, 'font-size': FZ }, ','));
    inciso = texto(svg, { class: 'aa-tinta', 'data-acta': 'inciso', 'data-renglon': '1', x: r2(X_INC), y: Y1, 'font-size': FZ }, 'que reprobaron Matemáticas');
    comas.push(texto(svg, { class: 'aa-tinta', 'data-acta': 'coma', 'data-renglon': '1', x: r2(X_COMA2), y: Y1, 'font-size': FZ }, ','));
    texto(svg, { class: 'aa-tinta', 'data-acta': 'predicado', 'data-renglon': '2', x: X0, y: Y2, 'font-size': FZ }, 'repetirán el año.');

    /* Una marquita debajo de cada coma en el paso 0, el que pide mirarlas,
       apuntándola como la de un corrector: es la de las comas de Marcadores
       Textuales. Pegada a la coma, y por eso el renglón de abajo va más
       lejos de lo normal: a la distancia de siempre, la marca de la primera
       coma se leía como un acento en la «a» de «año», y la de la segunda
       como un trazo de la firma. Encima de la coma tampoco sirve: se leía
       como una «v» pegada a la palabra («alumnosᵛ»). Y en los pasos
       siguientes no va: el subrayado ya parte en dos donde está cada coma,
       y marca y subrayado juntos eran un enredo. Todo se vio en las
       capturas. */
    comas.forEach(function (c, i) {
      var cx = r2((i ? X_COMA2 : X_COMA1) + W_COMA / 2);
      marcas.push(el('path', { class: 'aa-marca-coma', 'data-marca-coma': String(i + 1), d: 'M ' + r2(cx - 3) + ' ' + (Y1 + 8.5) + ' L ' + cx + ' ' + (Y1 + 3.5) + ' L ' + r2(cx + 3) + ' ' + (Y1 + 8.5) }, svg));
    });

    /* La firma, abajo a la derecha: se firmó así. */
    el('path', { class: 'aa-firma-raya', d: 'M 250 73 H 292' }, svg);
    el('path', { class: 'aa-firma', d: 'M 254 71 C 256 63, 261 62, 261 68 C 261 73, 266 66, 270 64.5 C 273.5 63, 274 70, 278 68.5 C 281 67.4, 284 65, 289 65.5' }, svg);

    /* Las etiquetas de los pasos 4 y 5, colgadas de la oración: la de la
       oración pegada con raya entera, la de la oración entre comas con raya
       cortada, igual que su subrayado. */
    [['restrictiva', 'restrictiva: delimita', false], ['explicativa', 'explicativa: describe', true]].forEach(function (d) {
      var g = el('g', { class: 'aa-etiqueta am-fuera' + (d[2] ? ' aa-etiqueta-aparte' : ''), 'data-etiqueta': d[0] }, svg);
      el('rect', { 'data-etiqueta-marco': '', x: 128, y: 57, width: 118, height: 16, rx: 5 }, g);
      texto(g, { 'data-etiqueta-dice': '', x: 134, y: 68.8, 'font-size': 11 }, d[1]);
      etiquetas[d[0]] = g;
      hilosEtq[d[0]] = el('path', { class: 'aa-hilo-etq am-fuera', 'data-hilo-etiqueta': d[0], d: 'M 187 ' + (Y_SUB + 1) + ' V 57' }, svg);
    });

    /* ── El aula ── */
    var aula = el('g', { 'data-aula': '' }, svg);
    var alumnos = [];
    for (var i = 0; i < COLS * FILAS; i++) alumnos.push(alumno(aula, i));

    /* Los aros: los de los que aprobaron, en una capa por fila (se prenden y
       se apagan juntos); los de los que reprobaron, uno por uno. */
    for (var f = 0; f < FILAS; f++) {
      arosP.push(el('g', { class: 'am-fuera', 'data-aros-fila': String(f) }, svg));
      sobres.push(el('g', { class: 'am-fuera', 'data-sobres-fila': String(f) }, svg));
    }
    alumnos.forEach(function (a, k) {
      var aro = el('circle', { class: 'aa-aro', 'data-aro': String(k + 1), cx: a.cx, cy: a.cy - 0.5, r: 14.5 },
        a.reprobo ? svg : arosP[a.fila]);
      if (a.reprobo) { aro.classList.add('am-fuera'); arosF.push({ n: aro, fila: a.fila }); }
      else {
        var s = el('g', { 'data-sobre': String(k + 1) }, sobres[a.fila]);
        sobre(s, a.cx + 6, a.cy - 17);
      }
    });

    /* ── La leyenda ── */
    var ley = el('g', { 'data-leyenda': '' }, svg);
    nota(ley, true, 18.6, 251.6);
    texto(ley, { class: 'aa-ley', 'data-ley': 'reprobo', x: 27, y: 255.4, 'font-size': 10.5 }, 'reprobó Matemáticas');
    nota(ley, false, 152.6, 251.6);
    texto(ley, { class: 'aa-ley', 'data-ley': 'aprobo', x: 161, y: 255.4, 'font-size': 10.5 }, 'la aprobó');
    leyAro = el('g', { class: 'am-fuera', 'data-ley-aro': '' }, svg);
    el('circle', { class: 'aa-aro', cx: 18.6, cy: 267.8, r: 4.8 }, leyAro);
    texto(leyAro, { class: 'aa-ley', x: 27, y: 271.6, 'font-size': 10.5 }, 'repite, según el acta');
    leySobre = el('g', { class: 'am-fuera', 'data-ley-sobre': '' }, svg);
    sobre(leySobre, 146.6, 263.8);
    texto(leySobre, { class: 'aa-ley', x: 161, y: 271.6, 'font-size': 10.5 }, 'familia citada');
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);
    var fue = function (k) { return ida && n === k; };
    var vuelve = function (k) { return !ida && antes === k; };

    var conComas = !(n === 3 || n === 4);
    var leida = n >= 1;
    var todos = leida && conComas;
    /* Quitar las comas (ir al 3, o volver del 5 al 4) y volver a ponerlas
       (ir al 5, o volver del 3 al 2): cada cosa a su tiempo, para que se
       vea qué hace la coma. */
    var quita = fue(3) || (vuelve(5) && n === 4);
    var pone = fue(5) || (vuelve(3) && n === 2);

    /* ── Las comas, su marquita y la oración, que se pega a «alumnos». ── */
    comas.forEach(function (c) { A.ver(c, conComas, pone ? 700 : (quita ? 300 : 0)); });
    marcas.forEach(function (m) { A.ver(m, n === 0, 0); });
    A.mover(inciso, conComas ? 0 : -W_COMA, 0, 0, 1, quita ? 700 : (pone ? 200 : 0));

    /* ── Los subrayados: de quiénes habla el acta. ── */
    var dSub = fue(1) ? 200 : (pone ? 1150 : 0);
    A.ver(subSujeto, todos, todos ? dSub : 0);
    A.trazar(subSujeto, todos, todos ? dSub : 0);
    A.ver(subInciso, todos, todos ? dSub + 250 : 0);
    var sinComasLeida = leida && !conComas;
    A.ver(subTodo, sinComasLeida, sinComasLeida ? (quita ? 1200 : 0) : 0);
    A.trazar(subTodo, sinComasLeida, sinComasLeida ? (quita ? 1200 : 0) : 0);

    /* ── Los aros: a los 35 con las comas, a los 5 sin ellas. ── */
    arosF.forEach(function (a) { A.ver(a.n, leida, leida ? (fue(1) ? 650 + 130 * a.fila : 0) : 0); });
    arosP.forEach(function (g, f) {
      var d = 0;
      if (todos && fue(1)) d = 650 + 130 * f;
      else if (todos && pone) d = 1450 + 110 * f;
      else if (!todos && quita) d = 1500 + 110 * f;
      A.ver(g, todos, d);
    });

    /* ── Los sobres: solo en el 2, uno por familia a desmentir. ── */
    sobres.forEach(function (g, f) { A.ver(g, n === 2, n === 2 ? (fue(2) ? 250 + 130 * f : 2000 + 110 * f) : 0); });

    /* ── Las etiquetas: restrictiva en el 4, explicativa en el 5. ── */
    var dR = fue(4) ? 300 : (vuelve(5) ? 1700 : 0), dE = fue(5) ? 2100 : 0;
    A.ver(etiquetas.restrictiva, n === 4, n === 4 ? dR : 0);
    A.ver(hilosEtq.restrictiva, n === 4, n === 4 ? dR : 0);
    A.ver(etiquetas.explicativa, n === 5, n === 5 ? dE : 0);
    A.ver(hilosEtq.explicativa, n === 5, n === 5 ? dE : 0);

    /* ── La leyenda de lo que se va dibujando. ── */
    A.ver(leyAro, leida, leida && fue(1) ? 650 : 0);
    A.ver(leySobre, n === 2, n === 2 ? (fue(2) ? 250 : 2000) : 0);
  }

  function marcador(n) {
    var repiten = 'repiten el año, según el acta';
    return [
      { cifra: '¿?', palabras: repiten },
      { cifra: '35', palabras: repiten },
      { cifra: '30', palabras: 'familias citadas' },
      { cifra: '5', palabras: repiten },
      { cifra: '5', palabras: repiten },
      { cifra: '35', palabras: repiten }
    ][n];
  }

  AnimacionMision.montar('#amActa', {
    vista: [ANCHO, ALTO],
    describe: 'El acta dice «Los alumnos, que reprobaron Matemáticas, repetirán el año». Con las dos comas habla de los 35 alumnos del aula, aunque solo 5 reprobaron; sin ellas, habla solo de esos 5.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['📜 Leer el acta', '📩 ¿Y las familias?', '✂️ Quitar las comas', '🏷️ Ponerle nombre', '✒️ Volver a ponerlas', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
