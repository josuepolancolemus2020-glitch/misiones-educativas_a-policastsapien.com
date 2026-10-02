/* ============================================================
   Animación de «IA Generativa: úsala bien y no le creas todo»
   (Ruta de la Máquina que Aprende, etapa 4)
   ------------------------------------------------------------
   La historia: Kenia le preguntó a un chat cuántas estrofas tiene el
   Himno Nacional. Le contestó «cinco», sin dudar, y lo copió en su tarea.
   Son siete. La historia dice por qué: la máquina eligió la palabra que
   más veces vio venir detrás, y «cinco» lo vio más que «siete».

   Lo que se dibuja: una máquina de JUGUETE que leyó tres frases, las tres
   verdaderas: «La mano tiene cinco dedos», «La Bandera tiene cinco
   estrellas» y «El Himno tiene siete estrofas». Cuenta con palitos qué
   palabra vino después de «tiene» en cada una: «cinco» junta dos y
   «siete», uno. Kenia le pregunta por el Himno, y para escribir no mira
   las frases: mira los palitos. Escribe «cinco», y son siete. Después lee
   dos frases más, también verdaderas, que no hablan del Himno (la semana
   y Centroamérica): «siete» pasa a tener más palitos y escribe «siete».
   Acertó por la semana y por Centroamérica, no por el Himno.

   ⚠️ Lo que asombra, y es verdad: leyó SOLO frases verdaderas y escribió
   una falsa. Y la frase del Himno estaba entre lo que leyó. Cada frase
   lleva su ✓ para que se vea sin leerla: lo que entra es verdad y lo que
   sale no.

   ⚠️ Las cuentas no se escriben: salen de las frases (LEYO). La palabra
   que escribe es la que más palitos tiene, y la sonda la vuelve a contar
   en el dibujo, frase por frase.

   ⚠️ Es una máquina de juguete y se dice: solo mira la palabra «tiene».
   Las de verdad leen muchísimo más y miran muchas palabras de antes, pero
   eligen de la misma manera. Lo dice la frase del paso 5.

   ⚠️ Lo que NO se dice, y a propósito: ni el nombre de lo que pasa ni el
   de la máquina (son los pareados de la prueba), ni nada de lo que la
   prueba pregunta (verificar, la fuente, lo bien escrito, el centro de
   salud, el mapa, la persona grande), ni que la máquina piensa, sabe,
   entiende o siente. Y no se escribe «probable»: el porcentaje es lo que
   el alumno toca en el predictor de abajo.

   Las siete estrofas son las de js/data/himno.js; este archivo no lo
   carga (sería bajarse la letra entera por un número), y la sonda
   comprueba que digan lo mismo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPalitos')) return;

  var ANCHO = 320, ALTO = 258;

  /* ── lo que leyó, en su orden ──────────────────────────────── */
  /* Las cinco son verdad: la mano tiene cinco dedos; la Bandera, cinco
     estrellas (js/data/paises.js); el Himno, siete estrofas
     (js/data/himno.js); la semana, siete días; y Centroamérica, siete
     países, como dice la misión de las áreas protegidas («de México y de
     los siete países de Centroamérica»). Las tres primeras las lee de
     entrada; las otras dos, en el paso 4. */
  var LEYO = [
    { antes: 'La mano', palabra: 'cinco', despues: 'dedos.' },
    { antes: 'La Bandera', palabra: 'cinco', despues: 'estrellas.' },
    { antes: 'El Himno', palabra: 'siete', despues: 'estrofas.', himno: true },
    { antes: 'La semana', palabra: 'siete', despues: 'días.' },
    { antes: 'Centroamérica', palabra: 'siete', despues: 'países.' }
  ];
  var PRIMERAS = 3;
  var ESTROFAS = 7;
  var CUENTA = ['cinco', 'siete'];

  /* El hueco que le toca a cada palito en su columna: el primero que
     llega va a la izquierda. */
  var HUECO = LEYO.map(function (f, i) {
    var k = 0;
    for (var j = 0; j < i; j++) if (LEYO[j].palabra === f.palabra) k++;
    return k;
  });
  /* La que tiene más palitos, contando las primeras `hasta` frases */
  function gana(hasta) {
    var c = { cinco: 0, siete: 0 };
    for (var i = 0; i < hasta; i++) c[LEYO[i].palabra]++;
    return c.cinco > c.siete ? 'cinco' : 'siete';
  }

  /* ── las medidas de la letra ───────────────────────────────── */
  /* Avance de cada letra de la Fredoka 600, por cada 100 px, medido en el
     navegador. Cada pedazo de frase va en su sitio y se le impone ese
     ancho (textLength): así el subrayado cae debajo de su palabra aunque
     la letra todavía no haya llegado. */
  var AV = {
    a: 56.3, b: 56.3, c: 50.5, d: 56.5, e: 53.7, f: 40.5, g: 55.2, h: 55.4, i: 24.2, j: 23.6, k: 50.4, l: 30.1, m: 80.3,
    n: 56.3, o: 55.9, p: 55.2, q: 55.1, r: 42.3, s: 45.8, t: 41.1, u: 56, v: 56.4, w: 74.6, x: 52.3, y: 55.9, z: 54,
    A: 70.9, B: 61.9, C: 64.3, D: 66.7, E: 61, F: 61.9, G: 71.5, H: 66.2, I: 23.2, J: 53.6, K: 59.5, L: 56.5, M: 81.4,
    N: 68.3, O: 72.5, P: 59.7, Q: 79.2, R: 61.1, S: 54.6, T: 64.8, U: 68.8, V: 72.7, W: 95.3, X: 69.1, Y: 63.8, Z: 59,
    'á': 56.3, 'é': 53.7, 'í': 22.5, 'ó': 55.9, 'ú': 56, 'ñ': 56.3, ' ': 24.1, ',': 22.4, '.': 21.7, ':': 22.5,
    '¿': 47.5, '?': 48.1, '«': 61.6, '»': 61, '1': 55, '2': 55, '3': 55
  };
  function ancho(t, tam) {
    var s = 0;
    for (var i = 0; i < t.length; i++) s += AV[t.charAt(i)] != null ? AV[t.charAt(i)] : 55;
    return Math.round(s * tam) / 100;
  }

  /* ── el dibujo ─────────────────────────────────────────────── */
  var TITULO = { x: 8, base: 12, tam: 10, texto: 'Lo que leyó la máquina de juguete' };
  /* Cada frase en su tira de papel, una debajo de otra */
  var TIRA = { x0: 8, x1: 210, y0: 18, alto: 19, paso: 24, tam: 11.5, pad: 6, base: 13.6, aire: 2.5 };
  function tiraY(i) { return TIRA.y0 + TIRA.paso * i; }
  /* La cuenta: una columna por palabra, a la derecha */
  var TABLA = { titulo: { x: 263, base: 12, tam: 10, texto: 'Después de «tiene»' }, y0: 19, y1: 72, tam: 12.5, base: 35,
    palo: { y0: 44, y1: 64, x: 12, dx: 8 } };
  var COL = { cinco: { x0: 216, x1: 260 }, siete: { x0: 266, x1: 310 } };
  /* Lo que pregunta Kenia, el teléfono y lo que escribe */
  var PREGUNTA = { rotulo: { x: 8, base: 145, tam: 10, texto: 'Kenia pregunta:' }, x0: 8, x1: 112, y0: 150, y1: 180, tam: 10.5,
    lineas: [['¿Cuántas estrofas', 163.5], ['tiene el Himno?', 175.5]] };
  var TEL = { x0: 126, x1: 148, y0: 145, y1: 183 };
  var GLOBO = { x0: 156, x1: 312, y0: 148, y1: 178, tam: 13, cola: [[156, 158], [149, 164], [156, 166]] };
  var CAJA = { x0: 257, x1: 303, y0: 152, y1: 172 };
  var DICE = { texto: 'El Himno tiene', base: 167.7 };
  var MARCA = { cx: 280, cy: 187 };
  /* Las siete estrofas del Himno */
  var ESTROFA = { rotulo: { x: 8, base: 201, tam: 10, texto: 'Las estrofas del Himno' }, x0: 9, paso: 44, ancho: 38, y0: 206, y1: 234, tam: 14, base: 225 };
  /* La llave del paso 5, junto a las dos frases nuevas */
  var LLAVE = { x: 212, y0: tiraY(3), y1: tiraY(4) + TIRA.alto, rotulo: [['acertó por', 222, 108], ['estas dos', 222, 121]], tam: 10 };
  /* El cuaderno del final */
  var CUADERNO = { x0: 8, x1: 312, y0: 196, y1: 256, titulo: ['Mis tres frases verdaderas:', 16, 209, 10.5], renglon0: 224, paso: 13 };

  /* ── el reloj de la escena ──────────────────────────────────── */
  /* Contar una frase: se marca «tiene», se subraya la palabra de después y
     sale su palito. La siguiente empieza cuando el palito de la anterior
     ya salió. */
  var CUENTO = { tiene: 0, sub: 250, palo: 700, cada: 1100 };
  var T2 = { tenue: 0, aro: 400, flecha: 900, punta: 1600, duda: 1700, palabra: 2250 };
  var T3 = { claro: 0, rotulo: 300, estrofa: 500, cada: 350, marca: 3100, himno: 3500 };
  var T4 = { himno: 0, tira: 0, otra: 250, cuenta: 700, tenue: 2900, sale: 2900, aro: 3200, flecha: 3500, punta: 4200, palabra: 4500, marca: 5000 };
  var T5 = { claro: 0, llave: 400, rotulo: 800 };
  var T6 = { sale: 0, cuaderno: 500 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }

  function texto(A, padre, x, y, clase, tam, ancla, contenido, largo) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    if (largo) n.setAttribute('textLength', largo);
    return n;
  }

  /* Una punta de flecha en (x, y), mirando hacia (dx, dy) */
  function punta(A, padre, x, y, dx, dy, clase, dato) {
    var l = Math.sqrt(dx * dx + dy * dy), ux = dx / l, uy = dy / l, a = 6, b = 3.6;
    var at = { points: [[x, y], [x - ux * a - uy * b, y - uy * a + ux * b], [x - ux * a + uy * b, y - uy * a - ux * b]]
      .map(function (q) { return r2(q[0]) + ',' + r2(q[1]); }).join(' '), 'class': clase };
    at[dato] = '';
    return A.el('polygon', at, padre);
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── lo que leyó: cada frase en su tira, con su ✓ ── */
    texto(A, svg, TITULO.x, TITULO.base, 'am-rotulo', TITULO.tam, 'start', TITULO.texto).setAttribute('data-titulo', '');
    P.tira = []; P.velo = []; P.tiene = []; P.sub = []; P.palo = [];
    LEYO.forEach(function (f, i) {
      var y = tiraY(i), x = TIRA.x0 + TIRA.pad, b = r2(y + TIRA.base);
      var g = A.el('g', { 'data-tira': String(i) }, svg), t = g;
      A.el('rect', { x: TIRA.x0, y: y, width: TIRA.x1 - TIRA.x0, height: TIRA.alto, rx: 4, 'class': 'pa-papel', 'data-tira-caja': '' }, t);
      /* «tiene» lleva un poco más de aire a cada lado: con un espacio
         solo, su recuadro quedaba pegado a la palabra de antes y a la de
         después, y se leía «mano[tiene]cinco». */
      var xTiene = r2(x + ancho(f.antes + ' ', TIRA.tam) + TIRA.aire);
      var xPal = r2(xTiene + ancho('tiene ', TIRA.tam) + TIRA.aire);
      var xDes = r2(xPal + ancho(f.palabra + ' ', TIRA.tam));
      /* lo que la máquina mira: «tiene», con su recuadro de raya cortada */
      var caja = A.el('rect', { x: r2(xTiene - 2), y: r2(y + 3), width: r2(ancho('tiene', TIRA.tam) + 4), height: 14, rx: 3,
        'class': 'pa-mira', 'data-tiene-caja': '' }, t);
      texto(A, t, x, b, 'pa-letra', TIRA.tam, 'start', f.antes, ancho(f.antes, TIRA.tam)).setAttribute('data-antes', '');
      texto(A, t, xTiene, b, 'pa-letra', TIRA.tam, 'start', 'tiene', ancho('tiene', TIRA.tam)).setAttribute('data-tiene', '');
      texto(A, t, xPal, b, 'pa-letra', TIRA.tam, 'start', f.palabra, ancho(f.palabra, TIRA.tam)).setAttribute('data-palabra', '');
      texto(A, t, xDes, b, 'pa-letra', TIRA.tam, 'start', f.despues, ancho(f.despues, TIRA.tam)).setAttribute('data-despues', '');
      /* la palabra que vino después, subrayada con el color de su columna */
      var sub = A.el('path', { d: 'M' + xPal + ' ' + r2(y + 17) + ' L' + r2(xPal + ancho(f.palabra, TIRA.tam)) + ' ' + r2(y + 17),
        'class': 'pa-sub pa-' + f.palabra, 'data-sub': '' }, t);
      /* el ✓: lo que leyó es verdad */
      A.el('path', { d: 'M' + (TIRA.x1 - 14) + ' ' + r2(y + 10) + ' L' + (TIRA.x1 - 10.5) + ' ' + r2(y + 13.5) + ' L' + (TIRA.x1 - 4) + ' ' + r2(y + 5.5),
        'class': 'pa-bien-papel', 'data-tira-bien': '' }, t);
      /* el velo: mientras escribe, las frases quedan detrás, apagadas. Es
         una pieza aparte y no la opacidad de la tira, porque la tira tiene
         su propia demora (aparece) y una pieza tiene una sola. */
      var velo = A.el('rect', { x: TIRA.x0 - 1, y: y - 1, width: TIRA.x1 - TIRA.x0 + 2, height: TIRA.alto + 2, rx: 5, 'class': 'pa-velo', 'data-velo': '' }, g);
      P.tira.push(g); P.velo.push(velo); P.tiene.push(caja); P.sub.push(sub);
    });

    /* ── la cuenta: una columna por palabra, con sus palitos ── */
    texto(A, svg, TABLA.titulo.x, TABLA.titulo.base, 'am-rotulo', TABLA.titulo.tam, 'middle', TABLA.titulo.texto).setAttribute('data-tabla-titulo', '');
    P.aro = {};
    CUENTA.forEach(function (w) {
      var c = COL[w];
      var g = A.el('g', { 'data-columna': w }, svg);
      A.el('rect', { x: c.x0, y: TABLA.y0, width: c.x1 - c.x0, height: TABLA.y1 - TABLA.y0, rx: 5, 'class': 'pa-columna', 'data-columna-caja': '' }, g);
      texto(A, g, (c.x0 + c.x1) / 2, TABLA.base, 'pa-cuenta pa-letra-' + w, TABLA.tam, 'middle', w).setAttribute('data-columna-dice', '');
      P.aro[w] = A.el('rect', { x: c.x0 - 3, y: TABLA.y0 - 3, width: c.x1 - c.x0 + 6, height: TABLA.y1 - TABLA.y0 + 6, rx: 7,
        'class': 'pa-aro pa-aro-' + w, 'data-aro': w }, svg);
    });
    LEYO.forEach(function (f, i) {
      var c = COL[f.palabra], x = c.x0 + TABLA.palo.x + TABLA.palo.dx * HUECO[i];
      P.palo.push(A.el('path', { d: 'M' + x + ' ' + TABLA.palo.y0 + ' L' + x + ' ' + TABLA.palo.y1, 'class': 'pa-palo pa-' + f.palabra,
        'data-palo': String(i) }, svg));
    });

    /* ── lo que pregunta Kenia ── */
    texto(A, svg, PREGUNTA.rotulo.x, PREGUNTA.rotulo.base, 'am-rotulo', PREGUNTA.rotulo.tam, 'start', PREGUNTA.rotulo.texto).setAttribute('data-pregunta-rotulo', '');
    var pg = A.el('g', { 'data-pregunta': '' }, svg);
    A.el('rect', { x: PREGUNTA.x0, y: PREGUNTA.y0, width: PREGUNTA.x1 - PREGUNTA.x0, height: PREGUNTA.y1 - PREGUNTA.y0, rx: 5, 'class': 'pa-papel', 'data-pregunta-caja': '' }, pg);
    PREGUNTA.lineas.forEach(function (l) { texto(A, pg, PREGUNTA.x0 + 6, l[1], 'pa-letra', PREGUNTA.tam, 'start', l[0]).setAttribute('data-pregunta-dice', ''); });
    A.el('path', { d: 'M' + (PREGUNTA.x1 + 2) + ' 165 L' + (TEL.x0 - 4) + ' 165', 'class': 'pa-flechita', 'data-pregunta-flecha': '' }, svg);
    punta(A, svg, TEL.x0 - 2, 165, 1, 0, 'pa-flechita-punta', 'data-pregunta-punta');

    /* ── el teléfono, con su borde claro para la pantalla oscura ── */
    var tel = A.el('g', { 'data-telefono': '' }, svg);
    A.el('rect', { x: TEL.x0, y: TEL.y0, width: TEL.x1 - TEL.x0, height: TEL.y1 - TEL.y0, rx: 4, 'class': 'pa-tel', 'data-telefono-caja': '' }, tel);
    A.el('rect', { x: TEL.x0 + 2.5, y: TEL.y0 + 5, width: TEL.x1 - TEL.x0 - 5, height: TEL.y1 - TEL.y0 - 12, rx: 1.5, 'class': 'pa-pantalla' }, tel);
    A.el('circle', { cx: (TEL.x0 + TEL.x1) / 2, cy: TEL.y1 - 3.5, r: 1.6, 'class': 'pa-pantalla' }, tel);

    /* ── lo que escribe: el globo, la frase y la caja de la palabra ── */
    var gl = A.el('g', { 'data-globo': '' }, svg);
    var c = GLOBO.cola;
    A.el('path', { d: 'M' + (GLOBO.x0 + 8) + ' ' + GLOBO.y0 + ' L' + (GLOBO.x1 - 8) + ' ' + GLOBO.y0 + ' Q' + GLOBO.x1 + ' ' + GLOBO.y0 + ' ' + GLOBO.x1 + ' ' + (GLOBO.y0 + 8) +
      ' L' + GLOBO.x1 + ' ' + (GLOBO.y1 - 8) + ' Q' + GLOBO.x1 + ' ' + GLOBO.y1 + ' ' + (GLOBO.x1 - 8) + ' ' + GLOBO.y1 + ' L' + (GLOBO.x0 + 8) + ' ' + GLOBO.y1 +
      ' Q' + GLOBO.x0 + ' ' + GLOBO.y1 + ' ' + GLOBO.x0 + ' ' + (GLOBO.y1 - 8) + ' L' + c[2][0] + ' ' + c[2][1] + ' L' + c[1][0] + ' ' + c[1][1] + ' L' + c[0][0] + ' ' + c[0][1] +
      ' L' + GLOBO.x0 + ' ' + (GLOBO.y0 + 8) + ' Q' + GLOBO.x0 + ' ' + GLOBO.y0 + ' ' + (GLOBO.x0 + 8) + ' ' + GLOBO.y0 + ' Z',
      'class': 'pa-globo', 'data-globo-caja': '', 'data-punta-globo': c[1][0] + ' ' + c[1][1] }, gl);
    var anchoDice = ancho(DICE.texto, GLOBO.tam);
    texto(A, gl, r2(CAJA.x0 - 4 - anchoDice), DICE.base, 'pa-letra', GLOBO.tam, 'start', DICE.texto, anchoDice).setAttribute('data-escribe', '');
    A.el('rect', { x: CAJA.x0, y: CAJA.y0, width: CAJA.x1 - CAJA.x0, height: CAJA.y1 - CAJA.y0, rx: 3, 'class': 'pa-hueco', 'data-caja': '' }, gl);
    P.dice = {};
    ['?', 'cinco', 'siete'].forEach(function (w) {
      P.dice[w] = texto(A, svg, (CAJA.x0 + CAJA.x1) / 2, DICE.base, w === '?' ? 'pa-duda' : 'pa-letra pa-fuerte', GLOBO.tam, 'middle', w,
        w === '?' ? null : ancho(w, GLOBO.tam));
      P.dice[w].setAttribute('data-dice', w);
    });

    /* ── la flecha: de la columna que gana a la caja ── */
    P.flecha = {};
    CUENTA.forEach(function (w) {
      var cx = (COL[w].x0 + COL[w].x1) / 2, x1 = Math.min(Math.max(cx, CAJA.x0 + 9), CAJA.x1 - 9), y0 = TABLA.y1 + 4, y1 = CAJA.y0 - 2;
      var g = A.el('g', { 'data-flecha': w }, svg);
      var linea = A.el('path', { d: 'M' + cx + ' ' + y0 + ' L' + x1 + ' ' + (y1 - 2), 'class': 'pa-flecha pa-flecha-' + w, 'data-flecha-linea': '' }, g);
      var cab = punta(A, g, x1, y1, x1 - cx, y1 - y0, 'pa-flecha-punta pa-flecha-punta-' + w, 'data-flecha-punta');
      P.flecha[w] = { g: g, linea: linea, cab: cab };
    });

    /* ── la marca de lo que escribió: ✗ (dos rayas) o ✓ (una) ── */
    P.mal = A.el('path', { d: 'M' + (MARCA.cx - 6) + ' ' + (MARCA.cy - 6) + ' L' + (MARCA.cx + 6) + ' ' + (MARCA.cy + 6) +
      ' M' + (MARCA.cx + 6) + ' ' + (MARCA.cy - 6) + ' L' + (MARCA.cx - 6) + ' ' + (MARCA.cy + 6), 'class': 'pa-mal', 'data-marca': 'mal' }, svg);
    P.bien = A.el('path', { d: 'M' + (MARCA.cx - 7) + ' ' + MARCA.cy + ' L' + (MARCA.cx - 2) + ' ' + (MARCA.cy + 5) + ' L' + (MARCA.cx + 8) + ' ' + (MARCA.cy - 6),
      'class': 'pa-bien', 'data-marca': 'bien' }, svg);

    /* ── el aro de la frase del Himno: lo decía ── */
    var yh = tiraY(2);
    P.aroHimno = A.el('rect', { x: TIRA.x0 - 3, y: yh - 3, width: TIRA.x1 - TIRA.x0 + 6, height: TIRA.alto + 6, rx: 6, 'class': 'pa-aro pa-aro-siete', 'data-aro-himno': '' }, svg);

    /* ── las siete estrofas del Himno ── */
    P.rotuloEstrofas = texto(A, svg, ESTROFA.rotulo.x, ESTROFA.rotulo.base, 'am-rotulo', ESTROFA.rotulo.tam, 'start', ESTROFA.rotulo.texto);
    P.rotuloEstrofas.setAttribute('data-estrofas-rotulo', '');
    P.estrofa = [];
    for (var k = 0; k < ESTROFAS; k++) {
      var x = ESTROFA.x0 + ESTROFA.paso * k;
      var ge = A.el('g', { 'data-estrofa': String(k + 1) }, svg);
      A.el('rect', { x: x, y: ESTROFA.y0, width: ESTROFA.ancho, height: ESTROFA.y1 - ESTROFA.y0, rx: 3, 'class': 'pa-estrofa', 'data-estrofa-caja': '' }, ge);
      texto(A, ge, x + ESTROFA.ancho / 2, ESTROFA.base, 'pa-letra pa-fuerte', ESTROFA.tam, 'middle', String(k + 1)).setAttribute('data-estrofa-dice', '');
      P.estrofa.push(ge);
    }

    /* ── la llave del paso 5: acertó por las dos frases nuevas ── */
    P.llave = A.el('g', { 'data-llave': '' }, svg);
    var lm = (LLAVE.y0 + LLAVE.y1) / 2;
    A.el('path', { d: 'M' + LLAVE.x + ' ' + LLAVE.y0 + ' Q' + (LLAVE.x + 3) + ' ' + LLAVE.y0 + ' ' + (LLAVE.x + 3) + ' ' + (LLAVE.y0 + 4) +
      ' L' + (LLAVE.x + 3) + ' ' + (lm - 4) + ' Q' + (LLAVE.x + 3) + ' ' + lm + ' ' + (LLAVE.x + 6) + ' ' + lm +
      ' Q' + (LLAVE.x + 3) + ' ' + lm + ' ' + (LLAVE.x + 3) + ' ' + (lm + 4) + ' L' + (LLAVE.x + 3) + ' ' + (LLAVE.y1 - 4) +
      ' Q' + (LLAVE.x + 3) + ' ' + LLAVE.y1 + ' ' + LLAVE.x + ' ' + LLAVE.y1, 'class': 'pa-llave', 'data-llave-trazo': '' }, P.llave);
    LLAVE.rotulo.forEach(function (l) { texto(A, P.llave, l[1], l[2], 'am-rotulo', LLAVE.tam, 'start', l[0]).setAttribute('data-llave-dice', ''); });

    /* ── el cuaderno del final ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUADERNO.x0, y: CUADERNO.y0, width: CUADERNO.x1 - CUADERNO.x0, height: CUADERNO.y1 - CUADERNO.y0, rx: 6, 'class': 'pa-papel', 'data-cuaderno-caja': '' }, P.cuaderno);
    texto(A, P.cuaderno, CUADERNO.titulo[1], CUADERNO.titulo[2], 'pa-letra', CUADERNO.titulo[3], 'start', CUADERNO.titulo[0]);
    for (var j = 0; j < 3; j++) {
      var yr = CUADERNO.renglon0 + CUADERNO.paso * j;
      texto(A, P.cuaderno, 16, yr - 2, 'pa-letra', 10, 'start', (j + 1) + '.');
      A.el('path', { d: 'M28 ' + yr + ' L138 ' + yr, 'class': 'pa-renglon', 'data-raya-escribir': '' }, P.cuaderno);
      texto(A, P.cuaderno, 143, yr - 2, 'pa-letra', 10.5, 'start', 'tiene', ancho('tiene', 10.5));
      A.el('path', { d: 'M172 ' + yr + ' L302 ' + yr, 'class': 'pa-renglon', 'data-raya-escribir': '' }, P.cuaderno);
    }
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso. tiras: cuántas frases leyó; contadas:
     cuántas ya contó; tenue: si las frases se apagan mientras escribe;
     escribe: qué hay en la caja; marca: ✗ o ✓ debajo de la caja. */
  var ESTADOS = [
    { tiras: 3, contadas: 0, tenue: false, gana: null, escribe: '?', marca: null, estrofas: false, aroHimno: false, llave: false, cuaderno: false },
    { tiras: 3, contadas: 3, tenue: false, gana: null, escribe: '?', marca: null, estrofas: false, aroHimno: false, llave: false, cuaderno: false },
    { tiras: 3, contadas: 3, tenue: true, gana: gana(3), escribe: gana(3), marca: null, estrofas: false, aroHimno: false, llave: false, cuaderno: false },
    { tiras: 3, contadas: 3, tenue: false, gana: gana(3), escribe: gana(3), marca: 'mal', estrofas: true, aroHimno: true, llave: false, cuaderno: false },
    { tiras: 5, contadas: 5, tenue: true, gana: gana(5), escribe: gana(5), marca: 'bien', estrofas: true, aroHimno: false, llave: false, cuaderno: false },
    { tiras: 5, contadas: 5, tenue: false, gana: gana(5), escribe: gana(5), marca: 'bien', estrofas: true, aroHimno: false, llave: true, cuaderno: false },
    { tiras: 5, contadas: 5, tenue: false, gana: gana(5), escribe: gana(5), marca: 'bien', estrofas: false, aroHimno: false, llave: false, cuaderno: true }
  ];
  function con(s, cambios) { var o = {}, k; for (k in s) o[k] = s[k]; for (k in cambios) o[k] = cambios[k]; return o; }

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    var l = [P.mal, P.bien, P.aroHimno, P.rotuloEstrofas, P.llave, P.cuaderno, P.dice['?'], P.dice.cinco, P.dice.siete]
      .concat(P.tira, P.velo, P.tiene, P.sub, P.palo, P.estrofa);
    CUENTA.forEach(function (w) { l.push(P.aro[w], P.flecha[w].g, P.flecha[w].linea, P.flecha[w].cab); });
    return l;
  }

  function base(A, s) {
    deGolpe(A, todo(), function () {
      LEYO.forEach(function (f, i) {
        var hecha = i < s.contadas;
        A.ver(P.tira[i], i < s.tiras, 0);
        A.ver(P.velo[i], s.tenue, 0);
        A.ver(P.tiene[i], hecha, 0);
        A.ver(P.sub[i], hecha, 0); A.trazar(P.sub[i], hecha, 0);
        A.ver(P.palo[i], hecha, 0); A.trazar(P.palo[i], hecha, 0);
      });
      CUENTA.forEach(function (w) {
        var si = s.gana === w, fl = P.flecha[w];
        A.ver(P.aro[w], si, 0);
        A.ver(fl.g, si, 0); A.ver(fl.linea, si, 0); A.trazar(fl.linea, si, 0); A.ver(fl.cab, si, 0);
      });
      ['?', 'cinco', 'siete'].forEach(function (w) { A.ver(P.dice[w], s.escribe === w, 0); });
      A.ver(P.mal, s.marca === 'mal', 0);
      A.ver(P.bien, s.marca === 'bien', 0);
      A.ver(P.aroHimno, s.aroHimno, 0);
      A.ver(P.rotuloEstrofas, s.estrofas, 0);
      P.estrofa.forEach(function (e) { A.ver(e, s.estrofas, 0); });
      A.ver(P.llave, s.llave, 0);
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }

  /* Contar la frase i: se marca «tiene», se subraya la palabra de después
     y sale su palito en la columna de esa palabra. */
  function contar(A, i, d0) {
    A.ver(P.tiene[i], true, d0 + CUENTO.tiene);
    A.ver(P.sub[i], true, d0 + CUENTO.sub); A.trazar(P.sub[i], true, d0 + CUENTO.sub);
    A.ver(P.palo[i], true, d0 + CUENTO.palo); A.trazar(P.palo[i], true, d0 + CUENTO.palo);
  }

  /* La columna que gana: su aro, la flecha hasta la caja y la palabra */
  function escribir(A, w, t) {
    A.ver(P.aro[w], true, t.aro);
    var fl = P.flecha[w];
    A.ver(fl.g, true, t.flecha); A.ver(fl.linea, true, t.flecha); A.trazar(fl.linea, true, t.flecha);
    A.ver(fl.cab, true, t.punta);
    A.ver(P.dice[w], true, t.palabra);
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 5) se cuentan cada vez que se ENTRA
       en ellos, también volviendo con «Atrás»; el 0 y el 6 se pintan
       siempre, también en el primer pintado. */
    if (n >= 1 && n <= 5 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 6) {
      if (antes !== 5) { base(A, ESTADOS[6]); return; }
      base(A, ESTADOS[5]);
      A.ver(P.llave, false, T6.sale);
      A.ver(P.rotuloEstrofas, false, T6.sale);
      P.estrofa.forEach(function (e) { A.ver(e, false, T6.sale); });
      A.ver(P.cuaderno, true, T6.cuaderno);
      return;
    }
    if (n === 1) {
      base(A, ESTADOS[0]);
      for (var i = 0; i < PRIMERAS; i++) contar(A, i, i * CUENTO.cada);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      P.velo.forEach(function (v) { A.ver(v, true, T2.tenue); });
      A.ver(P.dice['?'], false, T2.duda);
      escribir(A, gana(PRIMERAS), T2);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      P.velo.forEach(function (v) { A.ver(v, false, T3.claro); });
      A.ver(P.rotuloEstrofas, true, T3.rotulo);
      P.estrofa.forEach(function (e, k) { A.ver(e, true, T3.estrofa + k * T3.cada); });
      A.ver(P.mal, true, T3.marca);
      A.ver(P.aroHimno, true, T3.himno);
      return;
    }
    if (n === 4) {
      base(A, ESTADOS[3]);
      A.ver(P.aroHimno, false, T4.himno);
      A.ver(P.tira[3], true, T4.tira);
      A.ver(P.tira[4], true, T4.otra);
      contar(A, 3, T4.cuenta);
      contar(A, 4, T4.cuenta + CUENTO.cada);
      /* escribe otra vez: las frases se apagan, se va lo de antes y la
         columna que gana ahora lleva su aro y su flecha */
      P.velo.forEach(function (v) { A.ver(v, true, T4.tenue); });
      var antesGana = gana(PRIMERAS), ahora = gana(LEYO.length);
      A.ver(P.mal, false, T4.sale);
      A.ver(P.dice[antesGana], false, T4.sale);
      A.ver(P.aro[antesGana], false, T4.sale);
      A.ver(P.flecha[antesGana].g, false, T4.sale);
      escribir(A, ahora, T4);
      A.ver(P.bien, true, T4.marca);
      return;
    }
    /* el 5: las frases se encienden y la llave marca las dos nuevas */
    base(A, ESTADOS[4]);
    P.velo.forEach(function (v) { A.ver(v, false, T5.claro); });
    A.ver(P.llave, true, T5.llave);
  }

  var FRASES = [
    'Una máquina de juguete leyó estas tres frases, todas verdad. Kenia le pregunta por el Himno. ¿Cómo elegirá la palabra?',
    'En cada frase mira qué palabra vino después de «tiene», y le pone un palito. «Cinco» junta dos; «siete», uno.',
    'Para escribir no mira las frases: mira los palitos. Escribe la que tiene más, «cinco», sin dudar.',
    'Son siete, y la frase del Himno lo decía. Pero esa frase le dio un solo palito, y «cinco» tenía dos.',
    'Ahora lee dos frases más, también verdad, que no hablan del Himno. «Siete» ya tiene más palitos, y escribe «siete».',
    'Acertó por la semana y Centroamérica, no por el Himno. Las máquinas de verdad leen muchísimo más, pero eligen de la misma manera.',
    'Ahora tú: escribe tres frases verdaderas con «tiene» que hagan equivocarse a esta máquina con otra pregunta.'
  ];
  var BOTONES = ['🔍 Que cuente', '✍️ Que escriba', '📖 ¿Cuántas son?', '📚 Dos frases más', '🤔 ¿Por qué acertó?', '✍️ ¿Y tú?', '↺ Empezar otra vez'];
  var MARCADOR = [['3', 'frases que leyó, todas verdad'], ['2\u00a0a\u00a01', 'palitos de «cinco» y de «siete»'], ['«cinco»', 'la que tiene más palitos'],
    ['7', 'estrofas tiene el Himno'], ['3\u00a0a\u00a02', 'palitos de «siete» y de «cinco»'], ['0', 'frases nuevas que hablan del Himno'],
    ['3', 'frases tuyas, todas verdad']];

  AnimacionMision.montar('#amPalitos', {
    vista: [ANCHO, ALTO],
    describe: 'Una máquina de juguete leyó tres frases verdaderas. La mano tiene cinco dedos, la Bandera tiene cinco estrellas y el Himno tiene siete estrofas. ' +
      'Contó qué palabra vino después de «tiene»: «cinco», dos veces, y «siete», una. Por eso escribió que el Himno tiene cinco, y son siete. ' +
      'Después leyó dos frases más con «siete», que no hablan del Himno, y escribió «siete».',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
