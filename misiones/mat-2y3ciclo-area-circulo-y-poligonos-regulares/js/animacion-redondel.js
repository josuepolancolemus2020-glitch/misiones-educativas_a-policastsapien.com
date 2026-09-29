/* ============================================================
   M.E.T.A.S · Área del Círculo y Polígonos · El redondel del patio
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de la grama
   del redondel: mide 6 metros de lado a lado, el director encargó 36
   metros cuadrados («seis por seis») y solo cabían algo más de 28. La
   historia termina diciendo que un círculo no ocupa lo que el cuadrado
   que lo encierra, y que cuánto menos se puede calcular exacto. El
   aparato (botones, frase, marcador) vive en js/animacion-mision.js;
   aquí solo está el dibujo y dónde va cada pieza en cada paso.

   Un metro son 24 puntos del dibujo. Lo que enseña, en el orden en que
   se aprende:

     0  seis por seis son 36 m² de grama: ¿cabe toda en el redondel?
        Se decide antes de tocar;
     1  el redondel no llega a las esquinas del cuadrado: esa grama
        sobra, y con la cuadrícula encima se ve que cada esquina tapa
        casi dos cuadritos;
     2  se parte el redondel en 16 tajadas iguales, como una pizza;
     3  una arriba y otra abajo, las tajadas forman casi un rectángulo, y
        de alto mide el radio: 3 m;
     4  de largo mide media vuelta: la vuelta entera es 3.14 veces lo
        ancho, y la media, 3.14 veces la mitad: 3.14 × 3 = 9.42 m;
     5  el área es largo por alto: 9.42 × 3 = 28.26 m², que es
        3.14 × 3 × 3, pi por el radio por el radio;
     6  cabían 28.26 m²: de los 36 que se pagaron sobraron 7.74.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Primero de dónde sale, después la fórmula.** «Pi por radio al
      cuadrado» se memoriza y se olvida; ver el redondel convertido en
      un rectángulo de alto el radio y de largo media vuelta es de dónde
      sale. Las tajadas se mueven de verdad: las mismas dieciséis, sin
      que se pierda ni se agregue grama.
   2. ⚠️ **El redondel está entero hasta que se parte.** Dieciséis tajadas
      del mismo verde, puestas una junto a otra, dejan ver sus juntas
      aunque no lleven borde (el suavizado de cada orilla deja ver el
      fondo), y el redondel «entero» ya enseñaba los cortes. Por eso hay
      un disco entero encima mientras no se ha partido; al partirlo se
      trazan los cortes y el disco se va.
   3. **Se usa 3.14**, el de la prueba de la misión, que se lo pide al
      alumno con esas palabras («usa π = 3.14»). Con 3.14, 28.26 es
      exacto; «algo más de 28», como dice la historia.
   4. **La grama que sobra se ve rayada**, no solo de otro color: se
      distingue sin distinguir colores y fotocopiada. Y la cuadrícula va
      encima: cada esquina tapa casi dos cuadritos, y cuatro esquinas,
      casi ocho, que es lo que dice la historia antes de hacer la cuenta.
   5. ⚠️ **La cuenta de la historia no puede caer en la prueba.** El área
      del círculo de radio 3 salía en la conceptual, en la ficha y en
      muchas formas de la operativa; se cambiaron (en la misión y en la
      ficha, y en la operativa con _fueraDeLaAnimacion).
   6. **La grama es grama en las dos pantallas.** El verde, el cordón y
      lo rayado llevan su color siempre; lo que se escribe fuera del
      dibujo va en la tinta de la pantalla.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amRedondel')) return;

  var ANCHO = 320, ALTO = 180, FIN = 6;
  var RAD = Math.PI / 180;

  /* El cuadrado de grama que se pidió (6 × 6 metros, a 24 puntos el
     metro) y el redondel dentro. */
  var M = 24, LADO = 6, SX = (ANCHO - LADO * M) / 2, SY = 12, R = LADO * M / 2, CX = SX + R, CY = SY + R;
  var N = 16, MEDIO = 180 / N;                        // 16 tajadas de 22.5°
  var CUERDA = 2 * R * Math.sin(MEDIO * RAD);         // lo que mide cada tajada de punta a punta de su arco
  /* La tira: las puntas de las que miran arriba van en Y_BASE y las otras
     en Y_BASE − R. Va un poco a la derecha del centro, porque a su
     izquierda va la cota del alto con su «3 m». */
  var Y_BASE = 112, X0 = ANCHO / 2 + 12 - (N - 1) * CUERDA / 4;

  var GRAMA = '#6dbb67', JUNTA = '#3f8a3c', PEDIDA = '#dcefcf', REJILLA = '#8fbf7f', CORDON = '#8a5a2b';

  var TEXTOS = [
    'El director pidió 36 m² de grama: seis por seis. ¿Cabe toda en el redondel? Decídelo antes de tocar.',
    'El redondel mide 6 m de lado a lado, pero no llega a las esquinas del cuadrado. Esa grama sobra.',
    'Para medir el redondel, se parte en 16 tajadas iguales, como una pizza.',
    'Una arriba y otra abajo, las tajadas forman casi un rectángulo. De alto mide el radio: 3 m.',
    'La vuelta entera mide 3.14 veces lo ancho del redondel. Media vuelta mide 3.14 veces la mitad: 3.14 × 3 = 9.42 m.',
    'El área es largo por alto: 9.42 × 3 = 28.26 m². Es 3.14 × 3 × 3: pi por el radio por el radio.',
    'En el redondel cabían 28.26 m². De los 36 que se pagaron, sobraron 7.74: casi ocho metros cuadrados tirados.'
  ];

  var A;
  var cuadro = {}, disco, cortes = {}, cordon, rejilla, esquinas, sobra = {}, tajadas = [], tira = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Dónde va cada tajada. En el redondel, la j tiene la mitad de su arco
     en la dirección 180° + (j + ½)·22.5°: las ocho primeras son la mitad
     de arriba, de izquierda a derecha, y las ocho últimas la de abajo, de
     derecha a izquierda. En la tira, las de arriba van en los lugares
     pares con el arco arriba y las de abajo en los impares con el arco
     abajo, cada una girando lo menos posible. */
  function enRedondel(j) { return [CX, CY, (j + 0.5) * 2 * MEDIO - 90]; }
  function lugar(j) { return j < N / 2 ? 2 * j : 2 * (N - 1 - j) + 1; }
  function enTira(j) {
    var i = lugar(j), x = X0 + i * CUERDA / 2;
    return i % 2 === 0 ? [x, Y_BASE, 0] : [x, Y_BASE - R, 180];
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* La grama que sobra se raya: se ve sin distinguir colores. */
    var defs = el('defs', null, svg);
    var pat = el('pattern', { id: 'amRedondelRaya', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' }, defs);
    el('rect', { width: 6, height: 6, style: 'fill:' + PEDIDA }, pat);
    el('path', { d: 'M 1.5 0 V 6', style: 'stroke:' + CORDON + ';stroke-width:2' }, pat);

    /* ── El cuadrado de grama que se pidió: 6 × 6 metros ── */
    cuadro.g = el('g', null, svg);
    el('rect', { class: 'rd-pedido', x: SX, y: SY, width: LADO * M, height: LADO * M, style: 'fill:' + PEDIDA }, cuadro.g);

    /* Las cuatro esquinas: el cuadrado menos el redondel. */
    var e = '';
    [[SX, SY, 1, 1], [SX + 2 * R, SY, -1, 1], [SX + 2 * R, SY + 2 * R, -1, -1], [SX, SY + 2 * R, 1, -1]].forEach(function (c) {
      var x = c[0], y = c[1], sx = c[2], sy = c[3];
      e += 'M ' + x + ' ' + y + ' H ' + (x + sx * R) + ' A ' + R + ' ' + R + ' 0 0 ' + (sx * sy > 0 ? 0 : 1) + ' ' + x + ' ' + (y + sy * R) + ' Z ';
    });
    esquinas = el('path', { class: 'rd-sobra am-fuera', d: e.trim(), style: 'fill:url(#amRedondelRaya)' }, svg);

    /* ── Las 16 tajadas del redondel: cada una con su punta en (0, 0) y su
       arco arriba; se giran a su lugar en el redondel o en la tira. ── */
    var sx = r2(R * Math.sin(MEDIO * RAD)), sy = r2(-R * Math.cos(MEDIO * RAD));
    var forma = 'M 0 0 L ' + (-sx) + ' ' + sy + ' A ' + R + ' ' + R + ' 0 0 1 ' + sx + ' ' + sy + ' Z';
    for (var j = 0; j < N; j++) {
      var g = el('g', null, svg), v = el('g', null, g);
      el('path', { class: 'rd-tajada', 'data-j': j, d: forma, style: 'fill:' + GRAMA + ';stroke:' + JUNTA + ';stroke-width:0.9;stroke-linejoin:round' }, v);
      tajadas.push({ g: g, v: v });
    }

    /* El redondel entero, encima de las tajadas mientras no se ha partido. */
    disco = el('circle', { class: 'rd-disco am-fuera', cx: CX, cy: CY, r: R, style: 'fill:' + GRAMA }, svg);
    /* Los cortes, del centro al borde: se trazan uno detrás de otro (la
       raya entera es un solo camino, así A.trazar los dibuja en orden). La
       raya va dentro de una capa que se enciende y se apaga: trazar y
       encender usan la demora del elemento, y en una sola pieza una
       pisaría a la otra. */
    var d = '';
    for (var k = 0; k < N; k++) {
      var a = (180 + k * 2 * MEDIO) * RAD;
      d += 'M ' + CX + ' ' + CY + ' L ' + r2(CX + R * Math.cos(a)) + ' ' + r2(CY + R * Math.sin(a)) + ' ';
    }
    cortes.g = el('g', null, svg);
    cortes.raya = el('path', { class: 'rd-cortes', d: d.trim(), style: 'fill:none;stroke:' + JUNTA + ';stroke-width:1.4;stroke-linecap:round' }, cortes.g);

    /* El cordón del redondel, en raya cortada, y la cuadrícula encima de
       todo: cada cuadrito es un metro cuadrado. */
    cordon = el('circle', { class: 'rd-cordon', cx: CX, cy: CY, r: R, style: 'fill:none;stroke:' + CORDON + ';stroke-width:2;stroke-dasharray:6 4' }, svg);
    var rj = '';
    for (var q = 0; q <= LADO; q++) rj += 'M ' + (SX + q * M) + ' ' + SY + ' V ' + (SY + LADO * M) + ' M ' + SX + ' ' + (SY + q * M) + ' H ' + (SX + LADO * M) + ' ';
    rejilla = el('path', { class: 'rd-rejilla', d: rj.trim(), style: 'fill:none;stroke:' + REJILLA + ';stroke-width:1' }, svg);
    cuadro.lados = el('g', null, svg);
    texto(cuadro.lados, { class: 'am-letra rd-medida rd-lado', x: CX, y: SY + LADO * M + 17, 'text-anchor': 'middle', 'font-size': 15 }, '6 m');
    texto(cuadro.lados, { class: 'am-letra rd-medida rd-lado', x: SX - 8, y: CY + 4, 'text-anchor': 'end', 'font-size': 15 }, '6 m');

    /* Lo que sobró, al lado del cuadrado. */
    sobra.g = el('g', { class: 'am-fuera' }, svg);
    texto(sobra.g, { class: 'am-letra rd-rotulo', x: SX + 2 * R + 10, y: CY - 5, 'font-size': 15 }, 'sobran');
    texto(sobra.g, { class: 'am-letra rd-rotulo rd-sobran', x: SX + 2 * R + 10, y: CY + 15, 'font-size': 15 }, '7.74 m²');

    /* ── Las medidas de la tira: el alto (el radio) y el largo (media
       vuelta) ── */
    var izq = X0 - CUERDA / 2, fin = X0 + N / 2 * CUERDA;
    tira.alto = el('g', { class: 'am-fuera' }, svg);
    el('path', { class: 'rd-cota-alto', d: 'M ' + r2(izq - 10) + ' ' + (Y_BASE - R) + ' V ' + Y_BASE, style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:1.4' }, tira.alto);
    el('path', { d: 'M ' + r2(izq - 14) + ' ' + (Y_BASE - R) + ' H ' + r2(izq - 6) + ' M ' + r2(izq - 14) + ' ' + Y_BASE + ' H ' + r2(izq - 6),
      style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:1.4' }, tira.alto);
    texto(tira.alto, { class: 'am-letra rd-medida rd-radio', x: r2(izq - 18), y: Y_BASE - R / 2 + 5, 'text-anchor': 'end', 'font-size': 15 }, '3 m');
    tira.largo = el('g', { class: 'am-fuera' }, svg);
    el('path', { class: 'rd-cota-largo', d: 'M ' + r2(X0) + ' ' + (Y_BASE + 12) + ' H ' + r2(fin), style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:1.4' }, tira.largo);
    el('path', { d: 'M ' + r2(X0) + ' ' + (Y_BASE + 8) + ' V ' + (Y_BASE + 16) + ' M ' + r2(fin) + ' ' + (Y_BASE + 8) + ' V ' + (Y_BASE + 16),
      style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:1.4' }, tira.largo);
    texto(tira.largo, { class: 'am-letra rd-medida rd-largo', x: r2((X0 + fin) / 2), y: Y_BASE + 32, 'text-anchor': 'middle', 'font-size': 15 }, 'media vuelta = 9.42 m');
    tira.area = texto(svg, { class: 'am-digito rd-area am-fuera', x: ANCHO / 2, y: Y_BASE - R / 2 + 7, 'text-anchor': 'middle', 'font-size': 20,
      style: 'paint-order:stroke;stroke:var(--card,#fff);stroke-width:5px;stroke-linejoin:round' }, '28.26 m²');
  }

  function pintar(n, antes) {
    var adelante = n > antes;
    function d(ms) { return adelante ? ms : 0; }
    var llega1 = adelante && n === 1, llega2 = adelante && n === 2, llega3 = adelante && n === 3,
      llega4 = adelante && n === 4, llega5 = adelante && n === 5, llega6 = adelante && n === 6;
    var enLaTira = n >= 3 && n <= 5, enCuadro = !enLaTira;

    /* ── El cuadrado pedido, la cuadrícula y el cordón. Al final vuelven
       cuando las tajadas ya llegaron a su sitio. ── */
    A.ver(cuadro.g, enCuadro, d(llega6 ? 1300 : 0));
    A.ver(cuadro.lados, enCuadro, d(llega6 ? 1300 : 0));
    A.ver(cordon, enCuadro, d(llega6 ? 1300 : 0));
    A.ver(rejilla, n <= 1 || n === 6, d(llega6 ? 1300 : 0));
    A.ver(esquinas, n === 1 || n === 2 || n === 6, d(llega1 ? 700 : llega6 ? 1900 : 0));
    A.ver(sobra.g, n === 6, d(llega6 ? 2500 : 0));

    /* ── El redondel entero: encima de las tajadas hasta que se parte, y
       otra vez al final, cuando vuelven a su sitio ── */
    A.ver(disco, n === 1 || n === 6, d(llega1 ? 300 : llega2 ? 1500 : llega6 ? 1900 : 0));
    A.trazar(cortes.raya, n === 2, llega2 ? 300 : 0);
    A.ver(cortes.g, n === 2, 0);

    /* ── Las tajadas: la grama del redondel. A la tira van de a una, en
       orden de izquierda a derecha; de vuelta al redondel, todas juntas.
       Se ven desde que se parte el redondel hasta que vuelve a estar
       entero: al final, el disco se pone encima y ellas se apagan. ── */
    tajadas.forEach(function (t, j) {
      var p = enLaTira ? enTira(j) : enRedondel(j);
      A.mover(t.g, p[0], p[1], p[2], 1, llega3 ? 300 + 70 * lugar(j) : llega6 ? 200 : 0);
      A.ver(t.v, n >= 2 && n <= 5, llega6 ? 2500 : 0);
    });

    /* ── Las medidas de la tira ── */
    A.ver(tira.alto, enLaTira, d(llega3 ? 2200 : 0));
    A.ver(tira.largo, n === 4 || n === 5, d(llega4 ? 300 : 0));
    A.ver(tira.area, n === 5, d(llega5 ? 300 : 0));
  }

  function marcador(n) {
    return [
      { cifra: '36 m²', palabras: 'seis por seis: la grama que se pidió' },
      { cifra: '< 36 m²', palabras: 'las esquinas se quedan fuera' },
      { cifra: '16 tajadas', palabras: 'iguales, como una pizza' },
      { cifra: '3 m', palabras: 'de alto: el radio' },
      { cifra: '3.14 × 3 = 9.42', palabras: 'metros de largo: media vuelta' },
      { cifra: '9.42 × 3 = 28.26', palabras: 'm²: pi por el radio por el radio' },
      /* La cuenta entera no cabe en el número grande de un teléfono de
         360 px: «36 − 28.26 =» quedaba arriba y «7.74» abajo. El número
         grande dice lo que sobró y las palabras, de dónde sale. */
      { cifra: '7.74 m²', palabras: 'sobraron: 36 − 28.26' }
    ][n];
  }

  AnimacionMision.montar('#amRedondel', {
    vista: [ANCHO, ALTO],
    describe: 'El cuadrado de grama de 6 por 6 metros con el redondel dentro; el redondel se parte en 16 tajadas que se acomodan en casi un rectángulo, de alto el radio y de largo media vuelta, y al final se ve la grama que sobró en las esquinas.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🌱 Sembrar', '🍕 Partirlo', '↔️ Acomodar', '📏 El largo', '🟩 El área', '🧾 ¿Y lo que sobró?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
