/* ============================================================
   M.E.T.A.S · Valor Posicional · El cero que se cayó de la libreta
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de
   Marvin, que copió el total de la colecta, 45,280, como 4,528:
   el mismo 4, el mismo 5, el mismo 2 y el mismo 8, en el mismo
   orden, cada uno un lugar más a la derecha. El aparato (botones,
   frase, marcador) vive en js/animacion-mision.js; aquí solo está
   el dibujo y dónde va cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  el total en la tabla de valor posicional, cada cifra en su
        lugar, y la pregunta: ¿cuánto vale el 4 ahí?
     1  lo que vale cada cifra según su lugar (la forma expandida);
     2  lo que hizo Marvin, hecho a la vista: el 0 se cae de la
        tabla y las otras cuatro se corren un lugar a la derecha.
        Cada una pasa a valer diez veces menos;
     3  las dos barras: la de Marvin cabe diez veces en la de
        verdad, y a la libreta le faltan 40,752;
     4  devolverle el cero, y todo vuelve a su lugar;
     5  la regla: cada lugar vale diez veces el de su derecha;
     6  el lugar que sigue: la unidad de millón, un 1 con seis
        ceros de relleno.

   Y debajo del tablero, en cada paso, la forma expandida (el
   Bloque 3 de la misión): con signos de pregunta al principio,
   que es donde la historia le pide al alumno adivinar.

   Tres decisiones, y ninguna es de adorno:

   1. ⚠️ **La coma se queda quieta y las cifras pasan por
      delante.** La coma es del lugar, no de la cifra: va siempre
      entre las unidades de millar y las centenas. Por eso en el
      paso 2 se ve al 4 cruzarla y quedarse solo del otro lado, y
      eso es exactamente lo que diferencia 45,280 de 4,528 en la
      libreta.
   2. ⚠️ **Lo que se dibuja es lo que se cuenta.** Cada ficha dice
      qué cifra es, cada columna cuánto vale su lugar, y cada
      valor de debajo tiene que ser la cifra por su lugar. La sonda
      `verifica-animacion-mision` arma el número mirando dónde cayó
      cada ficha y lo compara con el marcador, en todos los pasos.
   3. **No se usa el 5 en las decenas de millar.** Es la pregunta
      del «Predice» que el alumno contesta justo debajo (el 5 de
      452,318): enseñarla aquí sería regalarle la respuesta. En el
      45,280 de la historia el 5 está en las unidades de millar.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amLibreta')) return;

  var ANCHO = 320, ALTO = 216, FIN = 6;

  /* Los lugares, de izquierda a derecha. El 0 es la unidad de millón,
     que solo aparece en el último paso; hasta ahí la tabla tiene seis
     columnas, como la del Bloque 5 de la misión. */
  var LUGARES = [
    { abrev: 'U.Mi', vale: 1000000 },
    { abrev: 'C.M', vale: 100000 },
    { abrev: 'D.M', vale: 10000 },
    { abrev: 'U.M', vale: 1000 },
    { abrev: 'C', vale: 100 },
    { abrev: 'D', vale: 10 },
    { abrev: 'U', vale: 1 }
  ];
  function xCol(p, siete) { return siete ? 31 + 43 * p : 40 + 48 * (p - 1); }
  function xComa(entre, siete) { return (xCol(entre, siete) + xCol(entre + 1, siete)) / 2; }

  var CIFRAS = [4, 5, 2, 8, 0];   // 45,280
  var LUGAR0 = [2, 3, 4, 5, 6];   // D.M, U.M, C, D, U
  var Y_FICHA = 81;

  var TEXTOS = [
    'Este es el total de la colecta: 45,280. Cada cifra ocupa un lugar en la tabla. ¿Cuánto crees que vale el 4 ahí?',
    'Cada cifra vale según su lugar. El 4 está en las decenas de millar y vale 40,000; el 5 vale 5,000. El 0 vale 0, pero ocupa las unidades.',
    'Marvin no copió el 0, y las otras cuatro cifras se corrieron un lugar a la derecha. Ahora el 4 vale 4,000: cada cifra vale diez veces menos.',
    'El número de Marvin cabe diez veces en el de verdad. Nadie cambió una cifra, y a la libreta le faltan 40,752.',
    'Con el 0 de vuelta, cada cifra regresa a su lugar y vale diez veces más. El 0 no vale nada, pero sin él todo se corre.',
    'Esa es la regla: cada lugar vale diez veces el de su derecha. Por eso, si una cifra se corre un lugar, vale diez veces más o diez veces menos.',
    'Después de las centenas de millar viene la unidad de millón: 1,000,000. Se escribe con un 1 y seis ceros de relleno. Si se cae uno, queda 100,000.'
  ];

  function miles(v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  /* La forma expandida, abajo del tablero (Bloque 3 de la misión). Una
     línea por paso y no una que se reescribe: así una se apaga mientras
     la otra se enciende. En el paso 0 va con signos de pregunta, que es
     la pregunta de la historia («prueba a adivinarla aquí abajo»). */
  var SUMAS = {
    0: '? + ? + ? + ? + ? = 45,280',
    1: '40,000 + 5,000 + 200 + 80 + 0 = 45,280',
    2: '4,000 + 500 + 20 + 8 = 4,528',
    6: '10 × 100,000 = 1,000,000'
  };
  function sumaDe(n) { return n === 4 || n === 5 ? 1 : n; }

  var A;
  var cols = [], lugarVal = [], flechas = [], cartas = [], millon = [], comas = [];
  var barras = null, sumas = {};

  /* Una ficha: la cifra en su cuadro, y debajo lo que vale. */
  function ficha(padre, cifra, valores) {
    var el = A.el;
    var g = el('g', { class: 'vp-carta', 'data-cifra': cifra }, padre);
    var r = el('rect', { class: 'am-ficha', x: -19, y: -23, width: 38, height: 46, rx: 8 }, g);
    var t = el('text', { class: 'am-digito', x: 0, y: 11, 'text-anchor': 'middle', 'font-size': 30 }, g);
    t.textContent = cifra;
    var v = (valores || []).map(function (valor) {
      var n = el('text', { class: 'am-valor vp-valor am-fuera', x: 0, y: 41, 'text-anchor': 'middle', 'font-size': 12.5, 'data-valor': valor }, g);
      n.textContent = miles(valor);
      return n;
    });
    return { g: g, rect: r, valores: v };
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* Las columnas: su nombre, y debajo cuánto vale el lugar (paso 5). */
    LUGARES.forEach(function (l, p) {
      var c = el('text', { class: 'am-letra vp-col am-fuera', x: 0, y: 0, 'text-anchor': 'middle', 'font-size': 13, 'data-lugar': l.vale }, svg);
      c.textContent = l.abrev;
      cols.push(c);
      var v = el('text', { class: 'am-letra vp-lugarval am-fuera', x: 0, y: 0, 'text-anchor': 'middle', 'font-size': 11, 'data-lugar': l.vale }, svg);
      v.textContent = miles(l.vale);
      lugarVal.push(v);
    });

    /* Las flechas del ×10, una entre cada dos columnas, apuntando a la
       izquierda: el lugar de la izquierda es el que vale diez veces más. */
    for (var i = 0; i < 6; i++) {
      var g = el('g', { class: 'vp-flecha am-fuera' }, svg);
      el('path', { class: 'am-trazo', d: 'M 14 4 Q 0 -4 -14 4 M -14 4 l 5.5 -3.4 M -14 4 l 5.8 1.6', style: 'stroke-width:1.2;stroke-linecap:round' }, g);
      var x10 = el('text', { class: 'am-valor', x: 0, y: -5, 'text-anchor': 'middle', 'font-size': 9.5 }, g);
      x10.textContent = '×10';
      flechas.push(g);
    }

    /* La coma va entre las unidades de millar y las centenas, y en el
       millón también entre la unidad de millón y las centenas de millar.
       Es del LUGAR y no se mueve con las cifras. */
    for (var k = 0; k < 2; k++) {
      var cm = el('text', { class: 'am-letra vp-coma am-fuera', x: 0, y: 0, 'text-anchor': 'middle', 'font-size': 26 }, svg);
      cm.textContent = ',';
      comas.push(cm);
    }

    Object.keys(SUMAS).forEach(function (k) {
      var t = el('text', { class: 'am-valor vp-suma am-fuera', x: 160, y: 150, 'text-anchor': 'middle', 'font-size': 13 }, svg);
      t.textContent = SUMAS[k];
      sumas[k] = t;
    });

    /* Las dos barras del paso 3. La larga no es una barra: son DIEZ
       barras iguales a la de Marvin, del mismo color, puestas en fila y
       llegando una por una. Diez veces más grande, contado y no dicho. */
    barras = { g: el('g', { class: 'am-capa am-fuera' }, svg), tramos: [] };
    var t1 = el('text', { class: 'am-letra', x: 16, y: 137, 'font-size': 11 }, barras.g);
    t1.textContent = 'El total de verdad: 45,280';
    var ANCHO_M = 24;
    for (var s = 0; s < 10; s++) {
      barras.tramos.push(el('rect', {
        class: 'am-relleno vp-tramo am-fuera', x: 16 + s * ANCHO_M, y: 142, width: ANCHO_M, height: 16,
        style: 'stroke:var(--card,#fff);stroke-width:1'
      }, barras.g));
    }
    var t2 = el('text', { class: 'am-letra', x: 16, y: 175, 'font-size': 11 }, barras.g);
    t2.textContent = 'Lo que copió Marvin: 4,528';
    barras.marvin = el('rect', { class: 'am-relleno vp-marvin', x: 16, y: 180, width: ANCHO_M, height: 16, 'data-barra': 4528 }, barras.g);

    /* Las fichas del 45,280. Cada una trae lo que vale en su lugar y lo
       que vale corrida un lugar a la derecha (el 0 no se corre: se cae). */
    var gCartas = el('g', null, svg);
    CIFRAS.forEach(function (c, k) {
      var p = LUGAR0[k];
      var valores = [c * LUGARES[p].vale];
      if (k < 4) valores.push(c * LUGARES[p + 1].vale);
      cartas.push(ficha(gCartas, c, valores));
    });

    /* Y las siete del millón, para el último paso. */
    var gMillon = el('g', null, svg);
    for (var m = 0; m < 7; m++) millon.push(ficha(gMillon, m === 0 ? 1 : 0, null));
  }

  function pintar(n, antes) {
    var adelante = n > antes;
    var siete = n === FIN;
    var corrido = n === 2 || n === 3;

    /* Las columnas, su valor y las flechas. */
    cols.forEach(function (c, p) {
      A.mover(c, xCol(p, siete), 16, 0, 1, adelante && siete && p === 0 ? 350 : 0);
      A.ver(c, p >= 1 || siete);
    });
    lugarVal.forEach(function (v, p) {
      A.mover(v, xCol(p, siete), 31, 0, siete ? 0.92 : 1, 0);
      A.ver(v, n >= 5 && (p >= 1 || siete), adelante && n === 5 ? 80 * (6 - p) : (adelante && siete && p === 0 ? 400 : 0));
    });
    flechas.forEach(function (f, i) {
      A.mover(f, (xCol(i, siete) + xCol(i + 1, siete)) / 2, 50, 0, siete ? 0.9 : 1, 0);
      var d = 0;
      if (adelante && n === 5) d = 250 + (5 - i) * 120;      // de derecha a izquierda, como se sube
      if (adelante && siete && i === 0) d = 550;
      A.ver(f, (n === 5 && i >= 1) || siete, d);
    });

    /* La coma: siempre entre U.M y C; la segunda, solo en el millón. */
    A.mover(comas[0], xComa(3, siete), 105, 0, 1, 0);
    A.ver(comas[0], true);
    A.mover(comas[1], xComa(0, true), 105, 0, 1, 0);
    A.ver(comas[1], siete, adelante && siete ? 450 : 0);

    /* Las fichas del 45,280 */
    cartas.forEach(function (c, k) {
      var cero = k === 4;
      var x, y = Y_FICHA, giro = 0, d = 0;
      if (cero && corrido) {
        /* El 0 se cae de la tabla: queda tirado abajo, con raya cortada. */
        x = 288; y = 184; giro = 24;
      } else {
        x = xCol(LUGAR0[k] + (corrido && !cero ? 1 : 0), false);
      }
      if (adelante && n === 2) d = cero ? 0 : 380 + (3 - k) * 70;   // primero cae el 0, después se corren
      if (adelante && n === 4) d = cero ? 420 : k * 70;              // primero se hacen a un lado, después vuelve
      A.mover(c.g, x, y, giro, 1, d);
      A.ver(c.g, !siete, adelante && siete ? 0 : (n === 5 && antes === 6 ? 300 : null));
      c.rect.classList.toggle('am-roto', cero && corrido);
      var vOrig = c.valores[0], vCorr = c.valores[1];
      var dv = adelante && (n === 1 || n === 4) ? (n === 4 ? 800 : 150 + k * 110) : 0;
      A.ver(vOrig, n === 1 || n === 4 || n === 5, dv);
      if (vCorr) A.ver(vCorr, corrido, adelante && n === 2 ? 950 : 0);
    });

    /* La forma expandida, y las barras en su lugar en el paso 3 */
    Object.keys(sumas).forEach(function (k) {
      var d = 0;
      if (adelante && +k === sumaDe(n)) d = n === 1 ? 700 : (n === 2 ? 1100 : (n === 6 ? 800 : 0));
      A.ver(sumas[k], n !== 3 && +k === sumaDe(n), d);
    });
    A.ver(barras.g, n === 3);
    barras.tramos.forEach(function (t, s) { A.ver(t, n === 3, adelante && n === 3 ? 350 + s * 110 : 0); });

    /* El millón */
    millon.forEach(function (c, p) {
      A.mover(c.g, xCol(p, true), Y_FICHA, 0, 0.92, adelante && siete ? 250 + p * 80 : 0);
      A.ver(c.g, siete);
    });
  }

  function marcador(n, antes) {
    var adelante = n > antes;
    if (n === FIN) return { cifra: '1,000,000', palabras: 'un millón' };
    if (n === 2 || n === 3) {
      return {
        cifra: '4,528', palabras: 'cuatro mil quinientos veintiocho',
        salto: adelante ? (n === 2 ? '÷10' : '−40,752') : ''
      };
    }
    return {
      cifra: '45,280', palabras: 'cuarenta y cinco mil doscientos ochenta',
      salto: adelante && n === 4 ? '×10' : ''
    };
  }

  AnimacionMision.montar('#amLibreta', {
    vista: [ANCHO, ALTO],
    describe: 'La tabla de valor posicional con el total de la colecta, 45,280, cifra por cifra.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🔍 ¿Cuánto vale cada cifra?', '✏️ Copiarlo como Marvin', '📏 Comparar los dos',
        '↩️ Devolverle el cero', '🪜 ¿Por qué diez veces?', '⬆️ ¿Qué lugar sigue?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
