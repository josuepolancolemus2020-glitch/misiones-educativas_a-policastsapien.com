/* ============================================================
   Animación de «Héroes y Próceres de Honduras» (Ruta de la Patria)
   ------------------------------------------------------------
   La historia: antes del desfile del 15, a Marvin le preguntaron quién
   fue Francisco Morazán y contestó «un héroe». Su compañera dijo «un
   prócer», y se pasaron el recreo discutiendo. Ninguno de los dos se
   equivocó, y eso era justo lo que ninguno de los dos sabía.

   Lo que se dibuja: los dos abajo, cada uno con lo que dijo, y Morazán
   en medio. Cada palabra sube y se vuelve un círculo con su pregunta:
   «héroe», ¿arriesgó la vida?; «prócer», ¿construyó lo que no existía?
   Dos cosas que hizo Morazán caen cada una en su círculo, y él cae donde
   los dos círculos se cruzan: los dos tenían razón.

   ⚠️ Las preguntas de los círculos NO son la definición del pareado.
   Salen de la SEGUNDA frase de PROCERES_DIFERENCIA («Arriesga la vida
   por la gente que ya está aquí»; «Construye lo que todavía no existe»),
   que es la misma de Aspectos Cívicos. El pareado de la prueba pide la
   primera, y esa no se escribe aquí. `_dev/verifica-proceres.js`
   comprueba que las dos preguntas y las dos obras sigan diciendo lo que
   dicen los datos.

   ⚠️ Lo que NO se dice, y a propósito: qué países unía la república que
   presidió (lo pregunta la prueba), ni si lo consiguió, ni sus fechas,
   ni dónde nació, ni nada de los otros siete. Tampoco se nombra a
   Lempira: la prueba pregunta quién es el Héroe Nacional.

   ⚠️ Lo escrito lleva su ancho medido con la Fredoka (AV, por cada 100
   px) y `textLength`: así cabe igual antes y después de que llegue la
   letra. Y una pieza tiene una sola demora: lo que vuela y además
   aparece va en dos envolturas.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amRecreo')) return;

  var ANCHO = 320, ALTO = 262;

  /* ── las medidas de la letra ───────────────────────────────── */
  var AV = {
    a: 56.3, b: 56.3, c: 50.5, d: 56.5, e: 53.7, f: 40.5, g: 55.2, h: 55.4, i: 24.2, j: 23.6, k: 50.4, l: 30.1, m: 80.3,
    n: 56.3, o: 55.9, p: 55.2, q: 55.1, r: 42.3, s: 45.8, t: 41.1, u: 56, v: 56.4, w: 74.6, x: 52.3, y: 55.9, z: 54,
    A: 70.9, B: 61.9, C: 64.3, D: 66.7, E: 61, F: 61.9, G: 71.5, H: 66.2, I: 23.2, J: 53.6, K: 59.5, L: 56.5, M: 81.4,
    N: 68.3, O: 72.5, P: 59.7, Q: 79.2, R: 61.1, S: 54.6, T: 64.8, U: 68.8, V: 72.7, W: 95.3, X: 69.1, Y: 63.8, Z: 59,
    'á': 56.3, 'é': 53.7, 'í': 22.5, 'ó': 55.9, 'ú': 56, 'ñ': 56.3, ' ': 24.1, ',': 22.4, '.': 21.7, ':': 22.5,
    '¿': 47.5, '?': 48.1, '¡': 24.3, '!': 24.2, '«': 61.6, '»': 61
  };
  function ancho(t, tam) {
    var s = 0;
    for (var i = 0; i < t.length; i++) s += AV[t.charAt(i)] != null ? AV[t.charAt(i)] : 55;
    return Math.round(s * tam) / 100;
  }

  /* ── el dibujo ─────────────────────────────────────────────── */
  var SUELO = 256;
  /* Los dos círculos: el mismo tamaño, a la misma altura, y se cruzan */
  var R = 74, CY = 124;
  var CX = { heroe: 116, procer: 204 };
  /* Donde se cruzan: la lente, de punta a punta en x = 160 */
  var MEDIO = (CX.heroe + CX.procer) / 2;
  var LENTE_ALTO = Math.sqrt(R * R - Math.pow(MEDIO - CX.heroe, 2));
  /* La tarjeta de Morazán: arriba, o en medio (donde se cruzan) */
  var TARJETA = { cx: MEDIO, cy: 26, ancho: 48, alto: 48, nombre: ['Francisco', 'Morazán'] };
  var BAJA = CY - TARJETA.cy;
  /* Cada uno con lo que dijo: los niños abajo y su globo al lado */
  var NINOS = {
    heroe: { x: 26, cabeza: SUELO - 37, globo: { x: 44, ancho: 60 }, dice: '¡Un héroe!', palabra: 'héroe', emoji: '🏹' },
    procer: { x: 294, cabeza: SUELO - 39, globo: { x: 212, ancho: 64 }, dice: '¡Un prócer!', palabra: 'prócer', emoji: '📜' }
  };
  var GLOBO = { y: 204, alto: 20, letra: 218, tam: 11 };
  /* La palabra y la pregunta de cada círculo van AFUERA, en su esquina
     de arriba: lo que hizo Morazán sale de su tarjeta y baja a su
     círculo, y así no pasa por encima de nada escrito. Adentro, en el
     lado donde no se cruzan, solo cae lo que hizo. */
  var EMOJI = 13;
  var ROTULO = { y: 17, tam: 12, heroe: 60, procer: 258 };
  var PRUEBA = {
    tam: 9, y: [29, 40],
    heroe: { x: 60, lineas: ['¿Arriesgó', 'la vida?'] },
    procer: { x: 258, lineas: ['¿Construyó lo que', 'no existía?'] }
  };
  var HECHO = {
    ancho: 80, alto: 28, cy: CY, tam: 9,
    heroe: { cx: 87, lineas: ['Peleó por su idea', 'hasta morir'] },
    procer: { cx: 233, lineas: ['Presidió una', 'república nueva'] }
  };
  var BIEN_GLOBO = { y: 239, r: 7 };

  /* ── el reloj de la escena ──────────────────────────────────── */
  var T1 = { sube: 0, circulos: 350, zona: 650, heroe: 1000, procer: 1300, emoji: 800, prueba: 1000 };
  var T2 = { sale: 200, bien: 1100 };
  var T4 = { baja: 200, lente: 900, marvin: 1300, ella: 1600 };
  var T5 = { otra: 300 };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido, medido) {
    var at = { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' };
    if (medido) { at.textLength = ancho(contenido, tam); at.lengthAdjust = 'spacing'; }
    var n = A.el('text', at, padre);
    n.textContent = contenido || '';
    return n;
  }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* Una paloma de «sí» dentro de su ficha blanca: se lee igual en las dos
     pantallas, y es una forma, no solo un color. */
  function bien(A, padre, cx, cy, r, atributos) {
    var g = A.el('g', atributos, padre);
    A.el('circle', { cx: cx, cy: cy, r: r, 'class': 'rc-ficha-bien' }, g);
    A.el('path', { d: 'M' + r2(cx - r * 0.48) + ' ' + r2(cy + r * 0.02) + ' L' + r2(cx - r * 0.12) + ' ' + r2(cy + r * 0.4) +
      ' L' + r2(cx + r * 0.52) + ' ' + r2(cy - r * 0.42), 'class': 'rc-bien', 'data-paloma': '' }, g);
    return g;
  }

  /* Un círculo como camino (dos medias vueltas), para poder trazarlo */
  function circulo(cx) {
    return 'M' + (cx - R) + ' ' + CY + ' A' + R + ' ' + R + ' 0 1 1 ' + (cx + R) + ' ' + CY +
      ' A' + R + ' ' + R + ' 0 1 1 ' + (cx - R) + ' ' + CY;
  }

  /* Marvin: camisa blanca y pantalón azul, como el uniforme */
  function marvin(A, padre) {
    var g = A.el('g', { 'data-nino': 'heroe' }, padre), x = NINOS.heroe.x;
    A.el('rect', { x: x - 6, y: SUELO - 13, width: 5, height: 13, rx: 1.5, 'class': 'rc-azul' }, g);
    A.el('rect', { x: x + 1, y: SUELO - 13, width: 5, height: 13, rx: 1.5, 'class': 'rc-azul' }, g);
    A.el('rect', { x: x - 9.5, y: SUELO - 29, width: 19, height: 19, rx: 3.5, 'class': 'rc-blanco' }, g);
    A.el('path', { d: 'M' + (x - 8) + ' ' + (SUELO - 26) + ' L' + (x - 11) + ' ' + (SUELO - 13), 'class': 'rc-brazo-m' }, g);
    A.el('path', { d: 'M' + (x + 8) + ' ' + (SUELO - 26) + ' L' + (x + 11) + ' ' + (SUELO - 13), 'class': 'rc-brazo-m' }, g);
    A.el('circle', { cx: x, cy: NINOS.heroe.cabeza, r: 9, 'class': 'rc-piel-m', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 9) + ' ' + (SUELO - 38) + ' Q' + (x - 8) + ' ' + (SUELO - 48) + ' ' + x + ' ' + (SUELO - 47) +
      ' Q' + (x + 8) + ' ' + (SUELO - 48) + ' ' + (x + 9) + ' ' + (SUELO - 38) + ' Q' + x + ' ' + (SUELO - 43) + ' ' + (x - 9) + ' ' + (SUELO - 38) + ' Z', 'class': 'rc-pelo' }, g);
    A.el('circle', { cx: x - 3.2, cy: SUELO - 36, r: 1.2, 'class': 'rc-ojo' }, g);
    A.el('circle', { cx: x + 3.2, cy: SUELO - 36, r: 1.2, 'class': 'rc-ojo' }, g);
    return g;
  }

  /* Su compañera: blusa blanca, falda azul y la cola de caballo */
  function companera(A, padre) {
    var g = A.el('g', { 'data-nino': 'procer' }, padre), x = NINOS.procer.x, cab = NINOS.procer.cabeza;
    A.el('rect', { x: x - 5, y: SUELO - 11, width: 3.5, height: 11, rx: 1.5, 'class': 'rc-piel-f' }, g);
    A.el('rect', { x: x + 1.5, y: SUELO - 11, width: 3.5, height: 11, rx: 1.5, 'class': 'rc-piel-f' }, g);
    A.el('path', { d: 'M' + (x - 9) + ' ' + (SUELO - 21) + ' L' + (x + 9) + ' ' + (SUELO - 21) + ' L' + (x + 11.5) + ' ' + (SUELO - 9) +
      ' L' + (x - 11.5) + ' ' + (SUELO - 9) + ' Z', 'class': 'rc-azul' }, g);
    A.el('rect', { x: x - 9, y: SUELO - 31, width: 18, height: 12, rx: 3.5, 'class': 'rc-blanco' }, g);
    A.el('path', { d: 'M' + (x - 8) + ' ' + (SUELO - 28) + ' L' + (x - 11) + ' ' + (SUELO - 16), 'class': 'rc-brazo-f' }, g);
    A.el('path', { d: 'M' + (x + 8) + ' ' + (SUELO - 28) + ' L' + (x + 11) + ' ' + (SUELO - 16), 'class': 'rc-brazo-f' }, g);
    /* la cola de caballo, detrás de la cabeza */
    A.el('path', { d: 'M' + (x + 6) + ' ' + (cab - 6) + ' Q' + (x + 16) + ' ' + (cab - 4) + ' ' + (x + 13) + ' ' + (cab + 9) +
      ' Q' + (x + 9) + ' ' + (cab + 3) + ' ' + (x + 6) + ' ' + (cab - 1) + ' Z', 'class': 'rc-pelo' }, g);
    A.el('circle', { cx: x, cy: cab, r: 9, 'class': 'rc-piel-f', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 9) + ' ' + (cab - 1) + ' Q' + (x - 8) + ' ' + (cab - 11) + ' ' + x + ' ' + (cab - 10) +
      ' Q' + (x + 8) + ' ' + (cab - 11) + ' ' + (x + 9) + ' ' + (cab - 1) + ' Q' + x + ' ' + (cab - 6) + ' ' + (x - 9) + ' ' + (cab - 1) + ' Z', 'class': 'rc-pelo' }, g);
    A.el('circle', { cx: x - 3.2, cy: cab + 1, r: 1.2, 'class': 'rc-ojo' }, g);
    A.el('circle', { cx: x + 3.2, cy: cab + 1, r: 1.2, 'class': 'rc-ojo' }, g);
    return g;
  }

  /* El globo de lo que dice, con la punta hacia su cabeza */
  function globo(A, padre, k) {
    var N = NINOS[k], x0 = N.globo.x, x1 = x0 + N.globo.ancho, y0 = GLOBO.y, y1 = y0 + GLOBO.alto;
    var izq = k === 'heroe';
    var lado = izq ? x0 : x1, punta = izq ? N.x + 11 : N.x - 11, py = N.cabeza - 2;
    var g = A.el('g', { 'data-globo': k }, padre);
    var d = 'M' + (x0 + 5) + ' ' + y0 + ' L' + (x1 - 5) + ' ' + y0 + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + 5);
    if (!izq) d += ' L' + x1 + ' ' + (py - 4) + ' L' + punta + ' ' + py + ' L' + x1 + ' ' + (py + 2);
    d += ' L' + x1 + ' ' + (y1 - 5) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - 5) + ' ' + y1 + ' L' + (x0 + 5) + ' ' + y1 +
      ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - 5);
    if (izq) d += ' L' + x0 + ' ' + (py + 2) + ' L' + punta + ' ' + py + ' L' + x0 + ' ' + (py - 4);
    d += ' L' + x0 + ' ' + (y0 + 5) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + 5) + ' ' + y0 + ' Z';
    A.el('path', { d: d, 'class': 'rc-globo', 'data-globo-caja': '', 'data-punta': punta + ' ' + py }, g);
    var w = ancho(N.dice, GLOBO.tam), xt = x0 + (N.globo.ancho - w) / 2;
    texto(A, g, xt, GLOBO.letra, 'rc-letra', GLOBO.tam, 'start', N.dice, true).setAttribute('data-dice', '');
    /* dónde empieza la palabra dentro de lo que dice: de ahí sale volando */
    return { x: xt + ancho(N.dice.slice(0, N.dice.indexOf(N.palabra)), GLOBO.tam), y: GLOBO.letra };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    A.el('path', { d: 'M0 ' + SUELO + ' L' + ANCHO + ' ' + SUELO, 'class': 'rc-suelo', 'data-suelo': '' }, svg);

    /* ── los dos círculos: primero el color de adentro, después la raya ── */
    P.zona = {}; P.circulo = {};
    ['heroe', 'procer'].forEach(function (k) {
      P.zona[k] = A.el('circle', { cx: CX[k], cy: CY, r: R, 'class': 'rc-zona rc-zona-' + k, 'data-zona': k }, svg);
    });
    /* donde se cruzan: se enciende cuando Morazán cae ahí */
    var arriba = r2(CY - LENTE_ALTO), abajo = r2(CY + LENTE_ALTO);
    P.lente = A.el('path', { d: 'M' + MEDIO + ' ' + arriba + ' A' + R + ' ' + R + ' 0 0 1 ' + MEDIO + ' ' + abajo +
      ' A' + R + ' ' + R + ' 0 0 1 ' + MEDIO + ' ' + arriba + ' Z', 'class': 'rc-lente', 'data-lente': '' }, svg);
    ['heroe', 'procer'].forEach(function (k) {
      P.circulo[k] = A.el('path', { d: circulo(CX[k]), 'class': 'rc-circulo rc-circulo-' + k, 'data-circulo': k,
        'data-centro': CX[k] + ' ' + CY, 'data-radio': R }, svg);
    });

    /* ── lo que hizo Morazán: debajo de su tarjeta, de donde sale ── */
    P.hecho = {};
    ['heroe', 'procer'].forEach(function (k) {
      var H = HECHO[k];
      var g = A.el('g', { 'data-hecho': k }, svg);
      A.el('rect', { x: H.cx - HECHO.ancho / 2, y: HECHO.cy - HECHO.alto / 2, width: HECHO.ancho, height: HECHO.alto, rx: 5,
        'class': 'rc-papel', 'data-hecho-caja': '' }, g);
      H.lineas.forEach(function (l, i) {
        texto(A, g, H.cx, HECHO.cy - 2.5 + i * 12, 'rc-letra', HECHO.tam, 'middle', l, true).setAttribute('data-hecho-linea', i);
      });
      P.hecho[k] = g;
    });

    /* ── la tarjeta de Morazán (se dibuja arriba; en medio, baja) ── */
    var T = TARJETA;
    P.tarjeta = A.el('g', { 'data-tarjeta': '' }, svg);
    A.el('rect', { x: T.cx - T.ancho / 2, y: T.cy - T.alto / 2, width: T.ancho, height: T.alto, rx: 6, 'class': 'rc-papel rc-tarjeta',
      'data-tarjeta-caja': '' }, P.tarjeta);
    /* Los renglones van a 12 de distancia: la caja de la Fredoka de 9 mide
       11,4 de alto, y con menos se montan una en otra. */
    texto(A, P.tarjeta, T.cx, T.cy - 8, 'rc-emoji', 12, 'middle', '⚔️').setAttribute('aria-hidden', 'true');
    T.nombre.forEach(function (t, i) {
      texto(A, P.tarjeta, T.cx, T.cy + 6.5 + i * 12, 'rc-letra', 9, 'middle', t, true).setAttribute('data-nombre', String(i));
    });

    /* ── el lugar para otro de los ocho, al final ── */
    P.otra = A.el('g', { 'data-otra': '' }, svg);
    A.el('rect', { x: T.cx - T.ancho / 2, y: T.cy - T.alto / 2, width: T.ancho, height: T.alto, rx: 6, 'class': 'rc-otra',
      'data-otra-caja': '' }, P.otra);
    texto(A, P.otra, T.cx, T.cy + 6, 'am-rotulo', 16, 'middle', '?').setAttribute('data-otra-txt', '');

    /* ── los dos, cada uno con lo que dijo ── */
    marvin(A, svg);
    companera(A, svg);
    P.sale = { heroe: globo(A, svg, 'heroe'), procer: globo(A, svg, 'procer') };
    P.bienGlobo = {
      heroe: bien(A, svg, NINOS.heroe.globo.x + NINOS.heroe.globo.ancho / 2, BIEN_GLOBO.y, BIEN_GLOBO.r, { 'data-bien-globo': 'heroe' }),
      procer: bien(A, svg, NINOS.procer.globo.x + NINOS.procer.globo.ancho / 2, BIEN_GLOBO.y, BIEN_GLOBO.r, { 'data-bien-globo': 'procer' })
    };

    /* ── lo de cada círculo: su palabra, su pregunta y su «sí» ── */
    P.vuela = {}; P.palabra = {}; P.emoji = {}; P.prueba = {}; P.bienPrueba = {};
    ['heroe', 'procer'].forEach(function (k) {
      var N = NINOS[k];
      /* el emoji y la palabra, juntos y centrados sobre su pregunta */
      var x = ROTULO[k] - (EMOJI + 2 + ancho(N.palabra, ROTULO.tam)) / 2 + EMOJI + 2;
      P.x = P.x || {};
      P.x[k] = x;
      P.emoji[k] = texto(A, svg, x - 2, ROTULO.y, 'rc-emoji', 11, 'end', N.emoji);
      P.emoji[k].setAttribute('aria-hidden', 'true');
      P.emoji[k].setAttribute('data-emoji', k);
      P.vuela[k] = A.el('g', { 'data-vuela': k }, svg);
      P.palabra[k] = texto(A, P.vuela[k], x, ROTULO.y, 'am-rotulo rc-rot-' + k, ROTULO.tam, 'start', N.palabra, true);
      P.palabra[k].setAttribute('data-rotulo', k);
      var Q = PRUEBA[k], g = A.el('g', { 'data-prueba': k }, svg);
      Q.lineas.forEach(function (l, i) {
        texto(A, g, Q.x, PRUEBA.y[i], 'am-rotulo', PRUEBA.tam, 'middle', l, true).setAttribute('data-prueba-linea', i);
      });
      P.prueba[k] = g;
      var ultima = Q.lineas[Q.lineas.length - 1];
      P.bienPrueba[k] = bien(A, svg, Q.x + ancho(ultima, PRUEBA.tam) / 2 + 9, PRUEBA.y[1] - 3.5, 5.5, { 'data-bien-prueba': k });
    });

    /* ── la pregunta del principio ── */
    P.pregunta = texto(A, svg, MEDIO, CY + 44, 'am-rotulo', 10, 'middle', '¿héroe o prócer?', true);
    P.pregunta.setAttribute('data-pregunta', '');
  }

  /* ── los estados ───────────────────────────────────────────── */

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    var lista = [P.lente, P.tarjeta, P.otra, P.pregunta];
    ['heroe', 'procer'].forEach(function (k) {
      lista.push(P.zona[k], P.circulo[k], P.hecho[k], P.emoji[k], P.vuela[k], P.palabra[k], P.prueba[k], P.bienPrueba[k], P.bienGlobo[k]);
    });
    return lista;
  }

  /* El estado al TERMINAR cada paso. tarjeta: arriba o en medio;
     circulos: se ven los dos con su palabra y su pregunta; hecho / sí:
     qué cosa de Morazán ya cayó en su círculo; lente y globos: Morazán
     cae en los dos, y los dos tenían razón. */
  var ESTADOS = [
    { tarjeta: 'medio', circulos: false, hecho: { heroe: false, procer: false }, lente: false, globos: false, otra: false, pregunta: true },
    { tarjeta: 'arriba', circulos: true, hecho: { heroe: false, procer: false }, lente: false, globos: false, otra: false, pregunta: false },
    { tarjeta: 'arriba', circulos: true, hecho: { heroe: false, procer: true }, lente: false, globos: false, otra: false, pregunta: false },
    { tarjeta: 'arriba', circulos: true, hecho: { heroe: true, procer: true }, lente: false, globos: false, otra: false, pregunta: false },
    { tarjeta: 'medio', circulos: true, hecho: { heroe: true, procer: true }, lente: true, globos: true, otra: false, pregunta: false },
    { tarjeta: 'medio', circulos: true, hecho: { heroe: true, procer: true }, lente: true, globos: true, otra: true, pregunta: false }
  ];

  /* De dónde sale cada cosa que vuela: la palabra, de lo que dijo cada
     uno; lo que hizo Morazán, de su tarjeta (que en esos pasos está
     arriba). */
  function desdeGlobo(k) { return { x: P.sale[k].x - P.x[k], y: P.sale[k].y - ROTULO.y }; }
  function desdeTarjeta(k) { return { x: TARJETA.cx - HECHO[k].cx, y: TARJETA.cy - HECHO.cy }; }

  function hecho(A, k, si, demora) {
    var d = desdeTarjeta(k);
    A.ver(P.hecho[k], si, demora);
    A.mover(P.hecho[k], si ? 0 : d.x, si ? 0 : d.y, 0, 1, demora);
    A.ver(P.bienPrueba[k], si, demora);
  }

  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.mover(P.tarjeta, 0, s.tarjeta === 'medio' ? BAJA : 0, 0, 1, 0);
      A.ver(P.pregunta, s.pregunta, 0);
      A.ver(P.lente, s.lente, 0);
      A.ver(P.otra, s.otra, 0);
      ['heroe', 'procer'].forEach(function (k) {
        A.ver(P.zona[k], s.circulos, 0);
        A.ver(P.circulo[k], s.circulos, 0);
        A.trazar(P.circulo[k], s.circulos, 0);
        var d = desdeGlobo(k);
        A.mover(P.vuela[k], s.circulos ? 0 : d.x, s.circulos ? 0 : d.y, 0, 1, 0);
        A.ver(P.palabra[k], s.circulos, 0);
        A.ver(P.emoji[k], s.circulos, 0);
        A.ver(P.prueba[k], s.circulos, 0);
        hecho(A, k, s.hecho[k], 0);
        A.ver(P.bienGlobo[k], s.globos, 0);
      });
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan cada vez que se ENTRA
       en ellos, también volviendo con «Atrás»; el 0 y el 5 se pintan
       siempre, también en el primer pintado. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 5) {
      if (antes !== 4) { base(A, ESTADOS[5]); return; }
      base(A, ESTADOS[4]);
      A.ver(P.otra, true, T5.otra);
      return;
    }
    if (n === 1) {
      base(A, ESTADOS[0]);
      /* Morazán sube para hacer sitio; cada palabra sube de lo que dijo
         cada uno y se vuelve un círculo, con su pregunta */
      A.ver(P.pregunta, false, 0);
      A.mover(P.tarjeta, 0, 0, 0, 1, T1.sube);
      ['heroe', 'procer'].forEach(function (k, i) {
        A.ver(P.circulo[k], true, T1.circulos);
        A.trazar(P.circulo[k], true, T1.circulos);
        A.ver(P.zona[k], true, T1.zona);
        A.mover(P.vuela[k], 0, 0, 0, 1, T1[k]);
        A.ver(P.palabra[k], true, T1[k]);
        A.ver(P.emoji[k], true, T1[k] + T1.emoji);
        A.ver(P.prueba[k], true, T1[k] + T1.prueba);
      });
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      /* lo que construyó cae en el círculo del prócer, y ahí dice que sí */
      hecho(A, 'procer', true, T2.sale);
      A.ver(P.bienPrueba.procer, true, T2.bien);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      /* lo que arriesgó cae en el círculo del héroe, y ahí también */
      hecho(A, 'heroe', true, T2.sale);
      A.ver(P.bienPrueba.heroe, true, T2.bien);
      return;
    }
    /* el 4: Morazán baja a donde se cruzan los dos círculos, y los dos
       que discutían tenían razón */
    base(A, ESTADOS[3]);
    A.mover(P.tarjeta, 0, BAJA, 0, 1, T4.baja);
    A.ver(P.lente, true, T4.lente);
    A.ver(P.bienGlobo.heroe, true, T4.marvin);
    A.ver(P.bienGlobo.procer, true, T4.ella);
  }

  var FRASES = [
    'Marvin dice que Francisco Morazán fue un héroe. Su compañera dice que fue un prócer. Antes de tocar, piensa: ¿quién tiene razón?',
    'Cada palabra es una pregunta sobre lo que alguien hizo. Héroe: ¿arriesgó la vida? Prócer: ¿construyó lo que no existía?',
    'Morazán presidió una república nueva: eso no existía antes. A la pregunta del prócer, sí.',
    'Y peleó por su idea hasta morir: arriesgó la vida. A la pregunta del héroe, también sí.',
    'Morazán pasa las dos preguntas: cae en los dos círculos a la vez. Marvin y su compañera tenían razón.',
    'Elige a otro de los ocho y hazle las dos preguntas. ¿En qué círculo cae? Explícalo en tu cuaderno.'
  ];
  var BOTONES = ['❓ Las dos preguntas', '🏛️ Lo que construyó', '⚔️ Lo que arriesgó', '⭕ ¿Dónde cae?', '✍️ Tu turno', '↺ Empezar otra vez'];
  var MARCADOR = [['2', 'respuestas: «héroe» y «prócer»'], ['2', 'preguntas, una por palabra'], ['1', 'de las 2 preguntas: sí'],
    ['2', 'de las 2 preguntas: sí'], ['2', 'tenían razón'], ['?', 'otro de los ocho']];

  AnimacionMision.montar('#amRecreo', {
    vista: [ANCHO, ALTO],
    describe: 'Dos círculos que se cruzan. Uno dice «héroe» y pregunta si alguien arriesgó la vida; el otro dice «prócer» y pregunta si construyó lo que no existía. Francisco Morazán presidió una república nueva y peleó por su idea hasta morir: pasa las dos preguntas y cae donde los círculos se cruzan.',
    pasos: 6,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
