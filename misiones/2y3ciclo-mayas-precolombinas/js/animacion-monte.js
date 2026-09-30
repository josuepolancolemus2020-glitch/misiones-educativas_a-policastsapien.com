/* ============================================================
   M.E.T.A.S · Los Mayas y las Culturas Precolombinas · «Nada, monte»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Kenia: le
   preguntaron qué había en América antes de que llegara Colón y contestó
   «nada, monte». En su casa, su bisabuela habla una lengua que ya se
   hablaba aquí mucho antes de 1492: Kenia dijo, sin saberlo, que su propia
   familia no estaba. La historia dice que «precolombino» no quiere decir
   «antes de la historia», sino antes de que llegaran otros. Eso es lo que
   se ve aquí. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza en
   cada paso.

   Una línea del tiempo con una raya en cada siglo, de más atrás a hoy, y
   1492 marcado con el barco. Todo lo de antes de 1492 está cubierto de
   monte, que es lo que dijo Kenia:

     0  Kenia y su globo: «nada, monte». ¿Tendrá razón?;
     1  la lengua de su bisabuela: ya se hablaba mucho antes de 1492, cruza
        esa fecha sin cortarse y llega a ella;
     2  siglos antes de 1492 se abre el monte: una gran ciudad maya, con
        escritura y calendario;
     3  esa ciudad ya estaba abandonada cuando llegó Colón: todo lo que ha
        pasado de Colón a hoy cabe entre ella y Colón, y sobra;
     4  se abre todo el monte y el globo de Kenia se tacha: «precolombino»
        quiere decir antes de que llegaran otros;
     5  la pregunta es del alumno: de dónde venía su familia, y su propia
        línea del tiempo.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Un siglo mide lo mismo en toda la línea.** La escala es una sola,
      de un borde al otro, y hoy es el año de hoy (se cuenta, no se
      escribe). Sin eso no se podría decir lo que asombra en el paso 3: la
      barra «de Colón a hoy» se toma de su sitio, se pone detrás de la
      ciudad y no alcanza a llegar a Colón. La sonda saca la escala de las
      rayas de los siglos y lo mide con ella.
   2. ⚠️ **La ciudad va del siglo V al IX, que es lo que enseña la misión**
      («Siglo V: Yax K'uk' Mo' funda la dinastía… hacia el siglo IX la
      ciudad decae y es abandonada»). Se toma el final del siglo IX, que es
      lo más tarde que dice la misión: así lo del paso 3 es verdad aunque
      la ciudad se haya vaciado antes. No se escriben los siglos ni se
      nombra la ciudad: eso lo pregunta la prueba.
   3. ⚠️ **La lengua va entera desde tres siglos antes de 1492, y cortada
      más atrás.** Que ya se hablaba aquí mucho antes de 1492 lo dice la
      historia; desde cuándo, no, porque la historia no dice cuál es. Lo de
      más atrás va con raya cortada y un «¿desde cuándo?», que es lo que no
      se sabe, y no toca a la ciudad: decir que era su lengua sería
      afirmar lo que nadie ha dicho.
   4. ⚠️ **Kenia y su bisabuela están fuera de la línea, donde se acaba en
      «hoy».** En una línea del tiempo cada punto es una fecha: paradas
      sobre ella, estarían en 1700 y en 1900.
   5. ⚠️ **Lo que pregunta la prueba no se dice**: ni el nombre de la
      ciudad, ni los siglos, ni qué construían, ni qué pueblos vivían aquí,
      ni cómo contaban, ni qué comían. Tampoco qué lengua habla la
      bisabuela: la historia no lo dice.
   6. **Nada se dice solo con color**: el monte lleva sus matas, lo que no
      se sabe va con raya cortada, lo que sobra en el paso 3 es el hueco de
      una caja de raya cortada, y el globo de Kenia se tacha con una raya.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amMonte')) return;

  var ANCHO = 320, ALTO = 194;
  function r2(v) { return Math.round(v * 100) / 100; }

  /* La línea del tiempo: una sola escala, del año 300 (X0) a hoy (X1). */
  var EJE = 132, X0 = 22, X1 = 252, A0 = 300;
  var HOY = Math.max(2026, new Date().getFullYear());
  function xa(anio) { return r2(X0 + (anio - A0) * (X1 - X0) / (HOY - A0)); }
  var COLON = 1492, XC = xa(COLON);
  /* La ciudad, del siglo V al IX, que es lo que enseña la misión. */
  var CIUDAD = [400, 900];
  /* La lengua de la bisabuela, entera desde tres siglos antes de 1492. */
  var LENGUA_DESDE = 1200;
  var MONTE_ARRIBA = 84, PIE = EJE - 2;
  var LY = 147;                       /* la lengua, por debajo de la línea */
  var FILA = [64, 12];                /* la fila de las cajas del paso 3 */
  var X_ABUELA = 276, X_KENIA = 302;

  var TEXTOS = [
    'Le preguntaron a Kenia qué había antes de que llegara Colón, en 1492. Contestó: «nada, monte». ¿Tendrá razón?',
    'La lengua de su bisabuela ya se hablaba aquí mucho antes de 1492, y cruza esa fecha sin cortarse hasta hoy.',
    'Y siglos antes de 1492, aquí hubo una gran ciudad maya, con escritura y calendario.',
    'Esa ciudad ya estaba abandonada cuando llegó Colón. Todo lo que ha pasado de Colón a hoy cabe entre ella y Colón, y sobra.',
    '«Precolombino» no quiere decir «antes de la historia»: quiere decir antes de que llegaran otros. Aquí ya había mucha historia.',
    '¿Y tú? Pregunta en tu casa de dónde venía tu familia, y dibuja su línea del tiempo hasta donde te sepan contar.'
  ];

  var A;
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  var P = {};

  /* Una persona de pie, de frente: (x) donde pisa. */
  var K = 1.25;
  function persona(svg, x, abuela) {
    var el = A.el, g = el('g', { class: 'mp-persona' }, svg);
    function X(v) { return r2(x + v * K); }
    function Y(v) { return r2(PIE - v * K); }
    if (abuela) {
      /* El bastón, del lado de afuera, y el moño. */
      el('path', { class: 'mp-baston', d: 'M ' + X(-9) + ' ' + PIE + ' L ' + X(-7) + ' ' + Y(14) }, g);
      el('circle', { class: 'mp-pelo', cx: X(3.5), cy: Y(27), r: r2(3 * K) }, g);
    } else {
      el('circle', { class: 'mp-pelo', cx: X(-6), cy: Y(24), r: r2(2.4 * K) }, g);
      el('circle', { class: 'mp-pelo', cx: X(6), cy: Y(24), r: r2(2.4 * K) }, g);
    }
    el('path', { class: abuela ? 'mp-ropa-abuela' : 'mp-ropa', d: 'M ' + X(-7) + ' ' + Y(4) + ' L ' + X(-4) + ' ' + Y(18) + ' L ' + X(4) + ' ' + Y(18) + ' L ' + X(7) + ' ' + Y(4) + ' Z' }, g);
    el('path', { class: 'mp-pierna', d: 'M ' + X(-2.5) + ' ' + Y(4) + ' L ' + X(-2.5) + ' ' + PIE + ' M ' + X(2.5) + ' ' + Y(4) + ' L ' + X(2.5) + ' ' + PIE }, g);
    el('circle', { class: 'mp-cara', cx: x, cy: Y(23), r: r2(5.5 * K) }, g);
    return g;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El monte que dijo Kenia: un tramo por siglo hasta 1492, y uno de
       más atrás, con sus matas. Se abre por tramos. ── */
    P.monte = [];
    var cortes = [-1];
    for (var s = CIUDAD[0]; s < COLON; s += 100) cortes.push(s);
    cortes.push(COLON);
    for (var i = 0; i < cortes.length - 1; i++) {
      var desde = cortes[i], hasta = cortes[i + 1];
      var xd = desde < 0 ? 6 : xa(desde), xh = xa(hasta);
      var g = el('g', { 'data-monte': i, 'data-desde': desde, 'data-hasta': hasta }, svg);
      /* Cada tramo pisa medio punto el siguiente: juntos, sin costura. */
      var pisa = hasta < COLON ? 0.6 : 0;
      el('rect', { class: 'mp-monte', x: xd, y: MONTE_ARRIBA, width: r2(xh - xd + pisa), height: PIE - MONTE_ARRIBA }, g);
      var matas = desde < 0 ? [0.3, 0.75] : [0.5];
      matas.forEach(function (t, j) {
        var mx = r2(xd + (xh - xd) * t), grande = (i + j) % 2 === 0;
        el('circle', { class: 'mp-mata', cx: mx, cy: MONTE_ARRIBA + (grande ? 1 : 2), r: grande ? 5.2 : 4.2 }, g);
        el('path', { class: 'mp-zacate', d: 'M ' + r2(mx - 3) + ' ' + PIE + ' L ' + r2(mx - 4) + ' ' + (PIE - 7) + ' M ' + mx + ' ' + PIE + ' L ' + mx + ' ' + (PIE - 9) + ' M ' + r2(mx + 3) + ' ' + PIE + ' L ' + r2(mx + 4) + ' ' + (PIE - 7) }, g);
      });
      P.monte.push({ g: g, desde: desde, hasta: hasta });
    }

    /* ── La ciudad maya: la pirámide sobre la línea, su escritura y su
       calendario encima, y su nombre de siempre en esta escena. ── */
    var c0 = xa(CIUDAD[0]), c1 = xa(CIUDAD[1]), cm = r2((c0 + c1) / 2);
    P.ciudad = el('g', { class: 'am-fuera', 'data-cosa': 'ciudad' }, svg);
    [28, 22, 16, 10].forEach(function (m, k) {
      el('rect', { class: 'mp-piedra', x: r2(cm - m), y: PIE - 8.5 * (k + 1), width: m * 2, height: 8.5 }, P.ciudad);
    });
    el('rect', { class: 'mp-templo', x: r2(cm - 6), y: PIE - 43, width: 12, height: 9 }, P.ciudad);
    el('rect', { class: 'mp-puerta', x: r2(cm - 2), y: PIE - 40, width: 4, height: 6 }, P.ciudad);
    el('path', { class: 'mp-escalera', d: 'M ' + r2(cm - 3.5) + ' ' + PIE + ' L ' + r2(cm - 3.5) + ' ' + (PIE - 34) + ' M ' + r2(cm + 3.5) + ' ' + PIE + ' L ' + r2(cm + 3.5) + ' ' + (PIE - 34) }, P.ciudad);

    /* Abandonada: las ramas que la cubren (paso 3). */
    P.ramas = el('g', { class: 'am-fuera', 'data-abandonada': '' }, svg);
    el('path', { class: 'mp-rama', d: 'M ' + r2(cm - 27) + ' ' + PIE + ' Q ' + r2(cm - 22) + ' ' + (PIE - 14) + ' ' + r2(cm - 12) + ' ' + (PIE - 19) + ' Q ' + r2(cm - 6) + ' ' + (PIE - 24) + ' ' + r2(cm - 8) + ' ' + (PIE - 33) }, P.ramas);
    el('path', { class: 'mp-rama', d: 'M ' + r2(cm + 27) + ' ' + PIE + ' Q ' + r2(cm + 19) + ' ' + (PIE - 11) + ' ' + r2(cm + 15) + ' ' + (PIE - 21) }, P.ramas);
    [[cm - 12, PIE - 19], [cm - 8, PIE - 33], [cm + 15, PIE - 21], [cm - 20, PIE - 9], [cm + 21, PIE - 7]].forEach(function (p) {
      el('ellipse', { class: 'mp-hoja', cx: r2(p[0]), cy: p[1], rx: 3, ry: 1.8 }, P.ramas);
    });

    P.rotCiudad = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'ciudad', x: cm, y: 50, 'font-size': 12, 'text-anchor': 'middle' }, 'ciudad maya');

    /* La escritura: una tabla de piedra con sus glifos en cuadritos. */
    P.escritura = el('g', { class: 'am-fuera', 'data-cosa': 'escritura' }, svg);
    var ex = r2(cm - 26), ey = 60;
    el('rect', { class: 'mp-tabla', x: ex, y: ey, width: 17, height: 21, rx: 2.5 }, P.escritura);
    for (var f = 0; f < 3; f++) {
      for (var c = 0; c < 2; c++) {
        var gx = r2(ex + 2.5 + c * 6.5), gy = ey + 2.5 + f * 6;
        el('rect', { class: 'mp-glifo', x: gx, y: gy, width: 5.5, height: 5, rx: 1.4 }, P.escritura);
        el('circle', { class: 'mp-glifo-ojo', cx: r2(gx + 2.8), cy: gy + 2.5, r: 1 }, P.escritura);
      }
    }
    /* El calendario: una rueda de piedra con sus veinte días. */
    P.calendario = el('g', { class: 'am-fuera', 'data-cosa': 'calendario' }, svg);
    var kx = r2(cm + 17), ky = 70.5;
    el('circle', { class: 'mp-rueda', cx: kx, cy: ky, r: 10.5 }, P.calendario);
    el('circle', { class: 'mp-rueda-dentro', cx: kx, cy: ky, r: 6.5 }, P.calendario);
    for (var d = 0; d < 20; d++) {
      var a = d * Math.PI / 10;
      el('line', { class: 'mp-rueda-raya', x1: r2(kx + Math.cos(a) * 6.5), y1: r2(ky + Math.sin(a) * 6.5), x2: r2(kx + Math.cos(a) * 10.5), y2: r2(ky + Math.sin(a) * 10.5) }, P.calendario);
    }
    el('circle', { class: 'mp-rueda-centro', cx: kx, cy: ky, r: 2.4 }, P.calendario);

    /* ── Paso 3: la caja de lo que llevaba abandonada cuando llegó Colón
       (de raya cortada) y la barra «de Colón a hoy», que se pone detrás de
       la ciudad y no la llena. ── */
    P.cajaA = el('g', { class: 'am-fuera', 'data-caja': 'abandonada' }, svg);
    el('rect', { class: 'mp-caja-a', x: c1, y: FILA[0], width: r2(XC - c1), height: FILA[1] }, P.cajaA);
    texto(P.cajaA, { class: 'am-rotulo', 'data-rotulo': 'abandonada', x: r2((c1 + XC) / 2), y: FILA[0] - 5, 'font-size': 11, 'text-anchor': 'middle' }, 'ya abandonada');
    P.cajaB = el('g', { class: 'am-fuera', 'data-caja': 'colon-hoy' }, svg);
    P.bA = el('g', {}, P.cajaB);
    P.bB = el('g', {}, P.bA);
    el('rect', { class: 'mp-caja-b', 'data-barra-hoy': '', x: XC, y: FILA[0], width: r2(X1 - XC), height: FILA[1] }, P.bB);
    texto(P.bB, { class: 'am-rotulo', 'data-rotulo': 'colon-hoy', x: r2((XC + X1) / 2), y: FILA[0] + FILA[1] + 11, 'font-size': 11, 'text-anchor': 'middle' }, 'de Colón a hoy');

    /* ── La línea del tiempo: más atrás (cortada), una raya en cada siglo,
       la ciudad sobre ella, 1492 con su barco, y hoy. ── */
    el('path', { class: 'mp-eje-antes', 'data-antes': '', d: 'M 10 ' + EJE + ' L ' + X0 + ' ' + EJE }, svg);
    el('path', { class: 'mp-eje', d: 'M 6 ' + EJE + ' L 11 ' + (EJE - 3.5) + ' M 6 ' + EJE + ' L 11 ' + (EJE + 3.5) }, svg);
    el('path', { class: 'mp-eje', 'data-eje': '', d: 'M ' + X0 + ' ' + EJE + ' L ' + X1 + ' ' + EJE }, svg);
    for (var sg = CIUDAD[0]; sg < HOY; sg += 100) {
      var sx = xa(sg);
      el('line', { class: 'mp-siglo', 'data-siglo': sg, x1: sx, y1: EJE - 4, x2: sx, y2: EJE + 4 }, svg);
    }
    el('line', { class: 'mp-siglo', 'data-hoy': HOY, x1: X1, y1: EJE - 5, x2: X1, y2: EJE + 5 }, svg);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'hoy', x: X1, y: EJE - 8, 'font-size': 12, 'text-anchor': 'middle' }, 'hoy');
    P.barra = el('path', { class: 'mp-barra am-fuera', 'data-barra': '', d: 'M ' + c0 + ' ' + EJE + ' L ' + c1 + ' ' + EJE }, svg);

    el('path', { class: 'mp-colon', 'data-colon': COLON, d: 'M ' + XC + ' 36 L ' + XC + ' ' + (LY + 6) }, svg);
    var barco = el('g', { 'data-barco': '' }, svg);
    el('path', { class: 'mp-casco', d: 'M ' + r2(XC - 12) + ' 27 L ' + r2(XC + 12) + ' 27 L ' + r2(XC + 8) + ' 33 L ' + r2(XC - 9) + ' 33 Z' }, barco);
    el('path', { class: 'mp-mastil', d: 'M ' + XC + ' 27 L ' + XC + ' 10' }, barco);
    el('path', { class: 'mp-vela', d: 'M ' + r2(XC + 1) + ' 11 Q ' + r2(XC + 10) + ' 17 ' + r2(XC + 1) + ' 25 Z' }, barco);
    el('path', { class: 'mp-vela', d: 'M ' + r2(XC - 1) + ' 13 Q ' + r2(XC - 8) + ' 18 ' + r2(XC - 1) + ' 24 Z' }, barco);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': '1492', x: r2(XC + 16), y: 20, 'font-size': 13, 'font-weight': 700 }, '1492');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'colón', x: r2(XC + 16), y: 35, 'font-size': 11.5 }, 'llega Colón');

    /* ── La lengua: cortada más atrás, entera desde tres siglos antes de
       1492, y llega a los pies de la bisabuela. Una pieza para verse y
       otra para dibujarse. ── */
    var xl = xa(LENGUA_DESDE);
    P.lengua = el('g', { class: 'am-fuera', 'data-lengua': '' }, svg);
    el('path', { class: 'mp-lengua-antes', 'data-lengua-antes': '', d: 'M 8 ' + LY + ' L ' + xl + ' ' + LY }, P.lengua);
    P.lenguaLinea = el('path', { class: 'mp-lengua', 'data-lengua-linea': '', d: 'M ' + xl + ' ' + LY + ' L ' + (X_ABUELA - 14) + ' ' + LY + ' Q ' + X_ABUELA + ' ' + LY + ' ' + X_ABUELA + ' ' + (PIE + 3) }, P.lengua);
    P.rotDesde = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'desde', x: 8, y: LY + 13, 'font-size': 11 }, '¿desde cuándo?');
    P.rotLengua = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'lengua', x: r2((xl + X_ABUELA) / 2), y: LY + 13, 'font-size': 11, 'text-anchor': 'middle' }, 'la lengua de su bisabuela');

    /* ── La bisabuela y Kenia, donde la línea llega a hoy ── */
    P.abuela = persona(svg, X_ABUELA, true);
    P.abuela.setAttribute('data-bisabuela', '');
    P.kenia = persona(svg, X_KENIA, false);
    P.kenia.setAttribute('data-kenia', '');

    /* ── El globo de Kenia, en dos renglones, y la raya que lo tacha ── */
    var gl = el('g', { 'data-globo': '' }, svg);
    el('path', { class: 'mp-globo', d: 'M 268 46 L 316 46 L 316 75 L 306 75 L ' + X_KENIA + ' 90 L 297 75 L 268 75 Z' }, gl);
    var tg = el('text', { class: 'mp-globo-letra', 'data-rotulo': 'globo', x: 292, y: 58, 'font-size': 11, 'text-anchor': 'middle' }, gl);
    var g1 = el('tspan', { x: 292, y: 58 }, tg); g1.textContent = '«nada,';
    var g2 = el('tspan', { x: 292, y: 70.5 }, tg); g2.textContent = 'monte»';
    P.tachado = el('path', { class: 'mp-tachado am-fuera', 'data-tachado': '', d: 'M 273 72 L 311 50' }, svg);

    /* ── Precolombino (paso 4): todo lo de antes de 1492 ── */
    P.pre = el('g', { class: 'am-fuera', 'data-precolombino': '' }, svg);
    el('path', { class: 'mp-llave', 'data-llave': '', d: 'M 6 ' + (LY + 19) + ' L 6 ' + (LY + 23) + ' L ' + XC + ' ' + (LY + 23) + ' L ' + XC + ' ' + (LY + 19) }, P.pre);
    texto(P.pre, { class: 'am-rotulo', 'data-rotulo': 'precolombino', x: 8, y: LY + 37, 'font-size': 11.5 }, 'precolombino: antes de que llegaran otros');
  }

  function pintar(n, antes) {
    var entra = function (k) { return n === k && antes !== k; };

    /* La lengua (1): se dibuja de más atrás a los pies de la bisabuela. */
    A.ver(P.lengua, n >= 1, 0);
    A.trazar(P.lenguaLinea, n >= 1, entra(1) ? 300 : 0);
    A.ver(P.rotDesde, n >= 1, entra(1) ? 200 : 0);
    A.ver(P.rotLengua, n >= 1, entra(1) ? 1100 : 0);

    /* El monte: se abre donde estuvo la ciudad (2) y después todo (4), de
       izquierda a derecha. */
    P.monte.forEach(function (m, i) {
      var enCiudad = m.desde >= CIUDAD[0] && m.hasta <= CIUDAD[1];
      var abierto = n >= 4 || (n >= 2 && enCiudad);
      A.ver(m.g, !abierto, entra(4) ? i * 60 : 0);
    });

    /* La ciudad, su escritura y su calendario (2). */
    A.ver(P.ciudad, n >= 2, entra(2) ? 400 : 0);
    A.ver(P.barra, n >= 2, entra(2) ? 400 : 0);
    A.ver(P.rotCiudad, n >= 2, entra(2) ? 600 : 0);
    A.ver(P.escritura, n >= 2, entra(2) ? 900 : 0);
    A.ver(P.calendario, n >= 2, entra(2) ? 1300 : 0);

    /* Abandonada (3 en adelante), y las dos cajas (solo en el 3). La barra
       «de Colón a hoy» sale en su sitio y se corre hasta la ciudad. Va en
       dos piezas para que, volviendo del paso 4, salga otra vez de su
       sitio y se vuelva a correr, y para que al irse no se vea volver. */
    A.ver(P.ramas, n >= 3, entra(3) ? 200 : 0);
    A.ver(P.cajaA, n === 3, entra(3) ? 600 : 0);
    A.ver(P.cajaB, n === 3, entra(3) ? 1100 : 0);
    var corre = r2(xa(CIUDAD[1]) - XC);
    if (n === 3) {
      A.mover(P.bA, 0, 0, 0, 1, 0);
      A.mover(P.bB, corre, 0, 0, 1, entra(3) ? 1900 : 0);
    } else if (n > 3) {
      A.mover(P.bA, corre, 0, 0, 1, 0);
      A.mover(P.bB, 0, 0, 0, 1, 0);
    } else {
      A.mover(P.bA, 0, 0, 0, 1, 0);
      A.mover(P.bB, 0, 0, 0, 1, antes === 3 ? 500 : 0);
    }

    /* Precolombino (4): el globo de Kenia se tacha. */
    A.ver(P.tachado, n >= 4, entra(4) ? 900 : 0);
    A.ver(P.pre, n >= 4, entra(4) ? 1300 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '?', palabras: '¿qué había aquí antes de 1492?' },
      { cifra: '1', palabras: 'lengua que cruza 1492 sin cortarse' },
      { cifra: '3', palabras: 'cosas que ya había: una ciudad, escritura y calendario' },
      { cifra: 'más', palabras: 'tiempo abandonada que de Colón a hoy' },
      { cifra: '✗', palabras: '«nada, monte»: antes de 1492 ya había historia' },
      { cifra: '?', palabras: '¿hasta dónde llega la línea de tu familia?' }
    ][n];
  }

  AnimacionMision.montar('#amMonte', {
    vista: [ANCHO, ALTO],
    describe: 'Una línea del tiempo con una raya por siglo, de más atrás a hoy, y 1492 marcado con un barco. Kenia dijo que antes de 1492 había «nada, monte». La lengua de su bisabuela ya se hablaba mucho antes de 1492 y cruza esa fecha sin cortarse. Siglos antes hubo una gran ciudad maya, con escritura y calendario, que ya estaba abandonada cuando llegó Colón: lo que ha pasado de Colón a hoy cabe entre ella y Colón, y sobra.',
    pasos: TEXTOS.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🗣️ La bisabuela', '🏛️ ¿Y siglos antes?', '⛵ ¿Y en 1492?', '🕰️ ¿Precolombino?', '💡 ¿Y tú?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
