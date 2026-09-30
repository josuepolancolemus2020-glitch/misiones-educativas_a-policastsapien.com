/* ============================================================
   M.E.T.A.S · Las Eras Geológicas · «El caracol que apareció en la milpa»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de don Tulio:
   arando en lo alto del cerro, sacó una piedra con la forma exacta de un
   caracol de mar, lejísimos de la costa y muy por encima del mar, y la
   tiró al montón: «Es una piedra rara». La historia dice que no era rara,
   que era la prueba de que ese cerro estuvo debajo del agua. La animación
   cuenta CÓMO. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza
   en cada paso.

   Es un corte del cerro visto de lado, con sus capas de roca a la vista,
   y a la derecha el mar:

     0  hoy: la milpa de don Tulio en lo alto del cerro, y la piedra con
        forma de caracol: ¿cómo llegó hasta aquí arriba?;
     1  hace muchísimo tiempo: este lugar era el fondo del mar, y el
        caracol vivía ahí, sobre el lodo;
     2  el caracol murió y el lodo que bajaba al fondo lo fue tapando:
        una capa, encima otra, y otra más;
     3  con muchísimo tiempo, el lodo se volvió roca y la concha se volvió
        piedra, con la forma del caracol;
     4  el fondo del mar se fue levantando, con todas sus capas, hasta
        quedar muy por encima del agua;
     5  la lluvia fue gastando las capas de arriba, hasta que el arado de
        don Tulio llegó al caracol y lo sacó;
     6  las capas se fueron poniendo de abajo hacia arriba: las de abajo
        son las más viejas. Y la pregunta es del alumno: ¿qué guardarán
        las de más abajo?

   Siete decisiones, y ninguna es de adorno:

   1. ⚠️ **El caracol no se mueve de su capa hasta que lo saca el arado.**
      Muere, lo tapan, se vuelve piedra y sube con el cerro, y siempre está
      en el mismo sitio de la misma capa: lo que sube es todo el suelo, no
      el caracol. La sonda lo mide paso por paso.
   2. ⚠️ **El mar no se mueve nunca.** El nivel del agua es el mismo en los
      siete pasos; lo que sube es el fondo. Si bajara el agua, el alumno
      entendería que el mar se secó, y no es lo que pasó.
   3. **Las capas se ponen de abajo hacia arriba, y se ve.** La primera en
      caer tapa al caracol y las otras caen encima, una después de otra.
      Por eso, al final, las de abajo son las más viejas: no se dice,
      primero se ve caer.
   4. ⚠️ **Lo que pregunta la prueba no se dice.** La animación no nombra
      lo que es esa piedra (es un pareado), ni cómo se llaman las capas
      (otro), ni ninguna de las cinco eras, ni un solo animal de los que la
      prueba pregunta, ni un número. La tarjeta de abajo les pone el
      nombre. Y la prueba se cambió donde la historia ya contestaba: la
      pregunta de «¿qué prueba un caracol de mar convertido en piedra en lo
      alto de una montaña?», que era la historia palabra por palabra.
   5. ⚠️ **Cruzar el tiempo se hace detrás de un telón.** Del paso 0 (hoy)
      al 1 (hace muchísimo tiempo) todo cambia a la vez: el cerro vuelve al
      fondo del mar, la milpa no existe y el caracol está vivo. Visto
      moviéndose parecía que el cerro se hundía; detrás del telón, con su
      letrero, se entiende que es otro tiempo. Sin movimiento, no hay telón:
      el paso llega de golpe, como todos.
   6. **La lluvia del paso 5 pasa y se va.** Gasta las capas de arriba y
      deja el cerro como está hoy: con sol, la milpa y don Tulio. Si se
      quedara, el paso 5 no sería hoy.
   7. **Nada se dice solo con color.** El lodo es liso y la roca lleva sus
      vetas; el caracol vivo tiene su cuerpo y el de piedra no; el mar, el
      tiempo de cada paso y cada cosa llevan su rótulo. El cerro, el agua,
      la milpa y el caracol son como son: se quedan iguales en la pantalla
      clara y en la oscura.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCaracol')) return;

  var ANCHO = 320, ALTO = 260, FIN = 6;
  var A;

  /* ── El mar y el cerro ──
     El nivel del mar no se mueve nunca. El cerro es un bloque de capas que
     se dibuja una vez, con el fondo donde vivía el caracol en el 0 de su
     propia cuenta: en el pasado ese 0 está en PASADO, bajo el agua, y hoy
     en HOY, muy por encima de ella. */
  var MAR = 124;
  var PASADO = 226, HOY = 80;

  /* Las capas, de la más nueva a la más vieja, medidas desde el fondo
     donde vivía el caracol. Las tres primeras son el lodo que lo tapó;
     `c1` es el lodo donde vivía; las `v` son la roca vieja de debajo. */
  var CAPAS = [
    { k: 'c4', y0: -56, y1: -38, lodo: true },
    { k: 'c3', y0: -38, y1: -20, lodo: true },
    { k: 'c2', y0: -20, y1: 0, lodo: true },
    { k: 'c1', y0: 0, y1: 26, lodo: true },
    { k: 'v1', y0: 26, y1: 66 },
    { k: 'v2', y0: 66, y1: 106 },
    { k: 'v3', y0: 106, y1: 146 },
    { k: 'v4', y0: 146, y1: 360 }
  ];
  var SUPERFICIE = -20;                 // hoy el suelo es el techo de c2
  var IZQ = -8;                         // el corte sigue por la izquierda
  /* El lado del cerro que da al mar: una sola recta, la misma para todas
     las capas. */
  function borde(y) { return 238 + (y + 60) * 62 / 260; }

  /* El caracol, sobre el lodo del fondo. Hoy, sacado por el arado, queda
     encima del suelo un poco más allá, al final del surco. */
  var XS = 205, SACADO = { dx: 10, giro: -15 };

  /* La milpa, don Tulio y su arado: sobre el suelo de hoy. */
  var MATAS = [28, 62, 96, 130];
  var TULIO = 170;

  var TELON_D = 280;                    // lo que se cambia detrás del telón

  var TEXTOS = [
    'Don Tulio sacó esta piedra con forma de caracol de mar, arando en lo alto del cerro. ¿Cómo llegó hasta aquí arriba?',
    'Hace muchísimo tiempo, este lugar era el fondo del mar. Ahí vivía el caracol, sobre el lodo del fondo.',
    'El caracol murió, y el lodo que bajaba al fondo lo fue tapando: una capa, encima otra, y otra más.',
    'Con muchísimo tiempo, el lodo se volvió roca. Y la concha se volvió piedra, con la forma del caracol.',
    'Muy despacio, el fondo del mar se fue levantando con todas sus capas, hasta quedar muy por encima del agua.',
    'La lluvia fue gastando las capas de arriba, hasta que el arado de don Tulio llegó al caracol y lo sacó.',
    'Las capas se fueron poniendo de abajo hacia arriba: por eso las de abajo son las más viejas. ¿Qué guardarán las de más abajo?'
  ];

  function r2(v) { return Math.round(v * 100) / 100; }

  var bloque, capas = {}, caracol = {}, mar, matas = [], tulio, arado, surco, suelo, globo, flecha;
  var nube, telonG, telonLetra, reloj = {}, rot = {};

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una capa: la roca, con sus vetas, y encima el lodo liso que se apaga
     cuando el lodo se vuelve roca. */
  function capa(padre, c, orden) {
    var el = A.el;
    var g = el('g', { 'data-capa': c.k, 'data-orden': orden }, padre);
    var yb = Math.min(c.y1, 200);       // lo de más abajo ya no se ve
    var pts = [[IZQ, c.y0], [borde(c.y0), c.y0], [borde(yb), yb], [IZQ, yb]]
      .map(function (p) { return r2(p[0]) + ',' + r2(p[1]); }).join(' ');
    el('polygon', { class: 'er-roca er-roca-' + c.k, 'data-roca': '', points: pts }, g);
    /* Las vetas: unas rayas cortadas a lo largo de la capa. Se ven también
       sin distinguir colores y fotocopiado. */
    for (var y = c.y0 + 6; y < yb - 3; y += 12) {
      el('line', { class: 'er-veta', x1: IZQ + 6, y1: y, x2: r2(borde(y) - 6), y2: y }, g);
    }
    if (c.lodo) el('polygon', { class: 'er-lodo er-lodo-' + c.k, 'data-lodo': '', points: pts }, g);
    return g;
  }

  /* El caracol, dibujado alrededor de su base (el punto donde toca el
     fondo), para que al sacarlo gire sobre sí mismo. */
  function dibujaCaracol(padre) {
    var el = A.el;
    var g = el('g', { 'data-caracol': '' }, padre);
    caracol.g = g;
    caracol.cuerpo = el('g', { 'data-cuerpo': '' }, g);
    el('path', { class: 'er-cuerpo', d: 'M -11 0 Q -11 -3.4 -6 -3.6 L 9 -3.6 Q 12.5 -3.4 13 0 Z' }, caracol.cuerpo);
    el('path', { class: 'er-antena', d: 'M 10.5 -3.2 L 13.5 -8.5 M 12 -3 L 16.5 -7' }, caracol.cuerpo);
    function concha(clase, espiral, dato) {
      var c = el('g', {}, g);
      c.setAttribute(dato, '');
      el('circle', { class: clase, cx: -1, cy: -7.2, r: 7 }, c);
      el('path', { class: espiral, d: 'M -1 -7.2 m 0 -1.2 a 1.4 1.4 0 1 1 -1.4 1.6 a 3 3 0 1 1 3.8 2.8 a 4.9 4.9 0 1 1 -6.3 -5.6' }, c);
      return c;
    }
    caracol.concha = concha('er-concha', 'er-espiral', 'data-concha');
    caracol.piedra = concha('er-piedra', 'er-espiral-piedra', 'data-piedra');
    return g;
  }

  /* Una mata de maíz, dibujada desde su base: crece desde el suelo. */
  function mata(padre, x) {
    var el = A.el;
    var g = el('g', { 'data-mata': '', 'data-x': x }, padre);
    el('line', { class: 'er-tallo', x1: 0, y1: 0, x2: 0, y2: -28 }, g);
    el('path', { class: 'er-hoja', d: 'M 0 -8 Q 7 -12 10 -6' }, g);
    el('path', { class: 'er-hoja', d: 'M 0 -14 Q -7 -18 -10 -12' }, g);
    el('path', { class: 'er-hoja', d: 'M 0 -21 Q 6 -25 9 -20' }, g);
    el('ellipse', { class: 'er-mazorca', cx: 2.6, cy: -16, rx: 1.8, ry: 3.6 }, g);
    return g;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;
    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* El sol, que está en los siete pasos. */
    var sol = el('g', { 'data-sol': '' }, svg);
    el('circle', { class: 'er-sol', cx: 296, cy: 22, r: 9 }, sol);

    /* ── El mar: detrás del cerro. Donde el cerro está, lo tapa; donde no,
       se ve. Su nivel no se mueve nunca. ── */
    mar = el('g', { 'data-mar': '' }, svg);
    el('rect', { class: 'er-agua', 'data-agua': '', x: -8, y: MAR, width: ANCHO + 16, height: ALTO - MAR + 10 }, mar);
    var ola = 'M -8 ' + MAR;
    for (var x = -8; x < ANCHO + 8; x += 16) ola += ' q 4 -2.2 8 0 q 4 2.2 8 0';
    el('path', { class: 'er-ola', 'data-ola': '', 'data-y': MAR, d: ola }, mar);

    /* ── El cerro: todas sus capas en un solo bloque, que sube entero ── */
    bloque = el('g', { 'data-bloque': '' }, svg);
    CAPAS.slice().reverse().forEach(function (c, i) { capas[c.k] = capa(bloque, c, CAPAS.length - 1 - i); });
    dibujaCaracol(bloque);

    /* El suelo de hoy: la tierra de la milpa sobre el techo de c2. */
    suelo = el('line', { class: 'er-suelo am-fuera', 'data-suelo': '', x1: IZQ, y1: HOY + SUPERFICIE, x2: r2(borde(SUPERFICIE)), y2: HOY + SUPERFICIE }, svg);
    /* El surco que abrió el arado, al lado de donde salió el caracol. */
    surco = el('path', { class: 'er-surco am-fuera', 'data-surco': '',
      d: 'M 186 ' + (HOY + SUPERFICIE) + ' q 5 2.6 10 0 q 5 2.6 10 0 q 5 2.6 10 0' }, svg);

    /* ── La milpa ── */
    MATAS.forEach(function (mx) { matas.push(mata(svg, mx)); });

    /* ── Don Tulio y su arado ── */
    var s = HOY + SUPERFICIE, t = TULIO;
    tulio = el('g', { class: 'am-fuera', 'data-tulio': '' }, svg);
    el('path', { class: 'er-persona', d: 'M ' + (t - 4.2) + ' ' + (s - 29) + ' L ' + (t + 4.2) + ' ' + (s - 29) + ' L ' + (t + 3.5) + ' ' + (s - 17) + ' L ' + (t - 3.5) + ' ' + (s - 17) + ' Z' }, tulio);
    el('path', { class: 'er-persona', d: 'M ' + (t - 3.3) + ' ' + (s - 17.2) + ' L ' + (t - 1.2) + ' ' + (s - 17.2) + ' L ' + (t - 1.1) + ' ' + s + ' L ' + (t - 3.4) + ' ' + s + ' Z' }, tulio);
    el('path', { class: 'er-persona', d: 'M ' + (t + 1.2) + ' ' + (s - 17.2) + ' L ' + (t + 3.3) + ' ' + (s - 17.2) + ' L ' + (t + 3.4) + ' ' + s + ' L ' + (t + 1.1) + ' ' + s + ' Z' }, tulio);
    el('circle', { class: 'er-persona', cx: t, cy: s - 33, r: 3.6 }, tulio);
    el('path', { class: 'er-sombrero', d: 'M ' + (t - 7.5) + ' ' + (s - 35.5) + ' L ' + (t + 7.5) + ' ' + (s - 35.5) + ' L ' + (t + 3.6) + ' ' + (s - 37.2) +
      ' Q ' + t + ' ' + (s - 43) + ' ' + (t - 3.6) + ' ' + (s - 37.2) + ' Z' }, tulio);
    /* El brazo que agarra la mancera del arado. */
    el('path', { class: 'er-brazo', d: 'M ' + (t + 3) + ' ' + (s - 26) + ' L ' + (t + 10) + ' ' + (s - 20) }, tulio);
    arado = el('g', { class: 'am-fuera', 'data-arado': '' }, svg);
    el('path', { class: 'er-madera', d: 'M ' + (t + 10) + ' ' + (s - 21) + ' L ' + (t + 20) + ' ' + (s - 2) }, arado);
    el('path', { class: 'er-reja', 'data-reja': '', d: 'M ' + (t + 17) + ' ' + (s - 4) + ' L ' + (t + 24) + ' ' + (s - 1) + ' L ' + (t + 19) + ' ' + (s + 1) + ' Z' }, arado);

    /* ── La pregunta del paso 0, al lado del caracol ── */
    globo = el('g', { class: 'am-fuera', 'data-globo': '' }, svg);
    el('path', { class: 'er-globo', d: 'M 229 38 L 219 52 L 235 40 Z' }, globo);
    el('circle', { class: 'er-globo', cx: 240, cy: 30, r: 10 }, globo);
    texto(globo, { class: 'er-globo-letra', x: 240, y: 34.5, 'font-size': 13, 'text-anchor': 'middle' }, '?');
    el('circle', { 'data-punta-globo': '', cx: 219, cy: 52, r: 0.1, style: 'fill:none' }, globo);

    /* ── Lo que dicen los rótulos ── */
    rot.marAntes = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'mar-antes', x: 70, y: 151, 'font-size': 10, 'text-anchor': 'middle' }, 'el mar');
    rot.marHoy = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'mar-hoy', x: 294, y: 152, 'font-size': 10, 'text-anchor': 'middle' }, 'el mar');
    rot.fondo = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'fondo', x: 118, y: PASADO - 8, 'font-size': 9, 'text-anchor': 'middle' }, 'el fondo del mar');
    /* La llave de las capas nuevas, en el agua a la derecha del corte:
       primero dice «lodo» y después «roca». */
    var ya = PASADO + CAPAS[0].y0, yb = PASADO;
    rot.llave = el('path', { class: 'er-llave am-fuera', 'data-llave': '', 'data-y0': ya, 'data-y1': yb,
      d: 'M 262 ' + ya + ' q 4 0 4 4 L 266 ' + (ya + yb) / 2 + ' l 3 0 m -3 0 L 266 ' + (yb - 4) + ' q 0 4 -4 4' }, svg);
    rot.lodo = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'lodo', x: 272, y: (ya + yb) / 2 + 3.5, 'font-size': 10 }, 'lodo');
    rot.roca = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'roca', x: 272, y: (ya + yb) / 2 + 3.5, 'font-size': 10 }, 'roca');

    /* La flecha del último paso, sobre el corte: de la capa de arriba a
       las de más abajo. */
    flecha = el('g', { class: 'am-fuera', 'data-flecha': '' }, svg);
    var fy0 = HOY + SUPERFICIE + 16, fy1 = 238;
    el('line', { class: 'er-flecha-halo', x1: 14, y1: fy0, x2: 14, y2: fy1 - 4 }, flecha);
    el('line', { class: 'er-flecha', 'data-raya': '', x1: 14, y1: fy0, x2: 14, y2: fy1 - 4 }, flecha);
    el('path', { class: 'er-flecha-punta', 'data-punta': '', d: 'M 9 ' + (fy1 - 6) + ' L 19 ' + (fy1 - 6) + ' L 14 ' + fy1 + ' Z' }, flecha);
    rot.nuevas = texto(flecha, { class: 'am-rotulo', 'data-rotulo': 'nuevas', x: 22, y: fy0 + 3, 'font-size': 9.5 }, 'más nuevas');
    rot.viejas = texto(flecha, { class: 'am-rotulo', 'data-rotulo': 'viejas', x: 22, y: fy1, 'font-size': 9.5 }, 'más viejas');

    /* El reloj de arriba: en qué tiempo estamos. */
    reloj.hoy = texto(svg, { class: 'am-rotulo er-reloj am-fuera', 'data-reloj': 'hoy', x: 6, y: 14, 'font-size': 10 }, '📍 hoy');
    reloj.antes = texto(svg, { class: 'am-rotulo er-reloj am-fuera', 'data-reloj': 'antes', x: 6, y: 14, 'font-size': 10 }, '⏪ hace muchísimo tiempo');
    reloj.despues = texto(svg, { class: 'am-rotulo er-reloj am-fuera', 'data-reloj': 'despues', x: 6, y: 14, 'font-size': 10 }, '⏳ muchísimo tiempo después');

    /* ── La lluvia del paso 5: pasa y se va ──
       Va a la derecha, sobre el borde del cerro: a la izquierda está el
       letrero del tiempo, y la nube lo tapaba mientras se apagaba. */
    nube = el('g', { class: 'er-nube-g', 'data-nube': '' }, svg);
    [[158, 10, 16], [184, 6, 18], [210, 9, 17], [234, 6, 16]].forEach(function (c) {
      el('ellipse', { class: 'er-nube', cx: c[0], cy: c[1] + 4, rx: c[2], ry: 8 }, nube);
    });
    for (var gx = 150; gx <= 244; gx += 11) {
      el('line', { class: 'er-gota', x1: gx, y1: 16, x2: gx - 3, y2: 44 }, nube);
    }

    /* ── El telón para cruzar el tiempo ── */
    telonG = el('g', { class: 'er-telon-g', 'data-telon': '' }, svg);
    el('rect', { class: 'er-telon', x: 0, y: 0, width: ANCHO, height: ALTO }, telonG);
    telonLetra = texto(telonG, { class: 'er-telon-letra', x: ANCHO / 2, y: ALTO / 2 + 5, 'font-size': 15, 'text-anchor': 'middle' }, '');
  }

  /* Un paso que cruza el tiempo: el telón cae, se cambia todo detrás, y se
     levanta. Es una animación con fotogramas propios, así que se le
     pregunta al aparato si hay movimiento: sin movimiento no hay telón. */
  function telon(letrero) {
    telonLetra.textContent = letrero;
    telonG.classList.remove('er-cae');
    void telonG.getBoundingClientRect();
    telonG.classList.add('er-cae');
  }
  function lluvia() {
    nube.classList.remove('er-pasa');
    void nube.getBoundingClientRect();
    nube.classList.add('er-pasa');
  }

  function pintar(n, antes) {
    var atras = antes > n;
    var salto = (n === 1 && antes === 0) || (n === 0 && antes === 1);
    var hoy = n === 0 || n >= 5;         // la milpa, don Tulio, el suelo de hoy
    var arriba = n === 0 || n >= 4;      // el cerro ya subió
    var roca = n === 0 || n >= 3;        // el lodo ya es roca
    /* La demora de cada cosa: detrás del telón, todas a la vez; volviendo
       con «Atrás», enseguida; hacia adelante, la de su turno. */
    function d(ms) { return salto ? TELON_D : (atras ? 0 : ms); }
    var entra = function (k) { return n === k && antes !== k && !atras; };
    var quieto = A.quieto();

    if (salto && !quieto) telon(n === 1 ? '⏪ hace muchísimo tiempo' : '⏩ hoy');
    if (entra(5) && !quieto) lluvia();

    /* ── El cerro: abajo en el pasado, arriba desde el paso 4 ── */
    A.mover(bloque, 0, arriba ? HOY : PASADO, 0, 1, d(n === 4 ? 200 : 0));

    /* ── Las capas ── */
    var hayC2 = n === 0 || n >= 2, hayC34 = n >= 2 && n <= 4;
    /* Las que todavía no cayeron esperan un poco más arriba, para caer; las
       que se llevó la lluvia se van hacia el mar. */
    function lugar(g, hay, idaLluvia) {
      if (hay) return [0, 0];
      return idaLluvia ? [26, 20] : [0, -10];
    }
    var ida = n === 0 || n >= 5;
    [['c2', hayC2, 300], ['c3', hayC34, 1000], ['c4', hayC34, 1700]].forEach(function (q, i) {
      var g = capas[q[0]], p = lugar(g, q[1], ida && q[0] !== 'c2');
      var dm;
      if (salto) dm = TELON_D;
      else if (atras) dm = 0;
      else if (n === 2) dm = q[2];
      else if (n === 5) dm = q[0] === 'c4' ? 300 : 900;
      else dm = 0;
      A.mover(g, p[0], p[1], 0, 1, dm);
      A.ver(g, q[1], dm);
    });
    /* El lodo se vuelve roca: se apaga el lodo, de la capa de abajo a la de
       arriba. */
    ['c1', 'c2', 'c3', 'c4'].forEach(function (k, i) {
      var l = capas[k].querySelector('[data-lodo]');
      A.ver(l, !roca, d(n === 3 ? 200 + i * 250 : 0));
    });

    /* ── El caracol ── */
    var sacado = n === 0 || n >= 5;
    A.mover(caracol.g, XS + (sacado ? SACADO.dx : 0), sacado ? SUPERFICIE : 0, sacado ? SACADO.giro : 0, 1, d(n === 5 ? 2500 : 0));
    A.ver(caracol.cuerpo, n === 1, d(0));
    A.ver(caracol.concha, !roca, d(n === 3 ? 1300 : 0));
    A.ver(caracol.piedra, roca, d(n === 3 ? 1300 : 0));

    /* ── Lo de hoy: el suelo, la milpa, don Tulio y su arado ── */
    A.ver(suelo, hoy, d(n === 5 ? 1500 : 0));
    matas.forEach(function (g, i) {
      var x = MATAS[i], dm = d(n === 5 ? 1600 + i * 150 : 0);
      A.mover(g, x, HOY + SUPERFICIE, 0, hoy ? 1 : 0.2, dm);
      A.ver(g, hoy, dm);
    });
    A.ver(tulio, hoy, d(n === 5 ? 2200 : 0));
    A.ver(arado, hoy, d(n === 5 ? 2200 : 0));
    A.ver(surco, hoy, d(n === 5 ? 2400 : 0));
    A.ver(globo, n === 0, d(n === 0 && antes === FIN ? 300 : 0));

    /* ── Los rótulos ── */
    A.ver(rot.marAntes, n >= 1 && n <= 3, d(0));
    A.ver(rot.marHoy, arriba, d(n === 4 ? 900 : 0));
    A.ver(rot.fondo, n === 1, d(0));
    A.ver(rot.llave, n === 2 || n === 3, d(n === 2 ? 2300 : 0));
    A.ver(rot.lodo, n === 2, d(n === 2 ? 2300 : 0));
    A.ver(rot.roca, n === 3, d(n === 3 ? 1100 : 0));
    A.ver(flecha, n === FIN, d(n === FIN ? 200 : 0));
    A.ver(reloj.hoy, hoy, d(n === 5 ? 2500 : 0));
    A.ver(reloj.antes, n >= 1 && n <= 3, d(0));
    A.ver(reloj.despues, n === 4, d(0));
  }

  function marcador(n) {
    if (n === 0) return { cifra: '?', palabras: 'un caracol de mar en lo alto del cerro' };
    if (n === 1) return { cifra: '0', palabras: 'capas encima del caracol' };
    if (n === 2) return { cifra: '3', palabras: 'capas de lodo encima del caracol' };
    if (n === 3) return { cifra: '3', palabras: 'capas de roca encima del caracol' };
    if (n === 4) return { cifra: '↑', palabras: 'el fondo del mar, arriba del agua' };
    if (n === 5) return { cifra: '0', palabras: 'capas encima: lo sacó el arado' };
    return { cifra: '↓', palabras: 'más abajo, más viejo' };
  }

  AnimacionMision.montar('#amCaracol', {
    vista: [ANCHO, ALTO],
    describe: 'Un corte del cerro de don Tulio, visto de lado: sus capas de roca, la milpa arriba y la piedra con forma de caracol; a la derecha, el mar, mucho más abajo.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['⏪ ¿Qué había antes?', '⏬ ¿Qué le pasó?', '⏳ Y pasó el tiempo', '⬆️ ¿Y el cerro?', '🌧️ ¿Y hasta hoy?', '💡 ¿Y las capas?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
