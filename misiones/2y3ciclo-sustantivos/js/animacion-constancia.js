/* ============================================================
   M.E.T.A.S · Los Sustantivos · La constancia de Kenia
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de don Ramón:
   caminó una hora hasta la escuela por la constancia de su hija, y en la
   libreta de esa semana decía «la niña de primero». En primero había
   varias niñas, sin el nombre no se podía extender nada, y se devolvió
   con las manos vacías. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza
   en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  la libreta dice «la niña de primero», y debajo está la clase de
        primero. ¿Para cuál de las niñas es? Se decide antes de tocar;
     1  la palabra «niña» sale de la libreta y se posa sobre CADA una de
        las cinco niñas: nombra a cualquiera, y con ella no se sabe cuál;
     2  se escribe su nombre, «Kenia Ramírez», y se posa sobre una sola:
        la distingue de las otras cuatro;
     3  lo que nombra es un sustantivo: «niña» es común, y «Kenia Ramírez»
        son sustantivos propios;
     4  con el nombre en la libreta, la constancia sale ese mismo día.

   Cinco decisiones, y ninguna es de adorno:

   1. **La palabra se PRUEBA sobre la gente.** La tarjeta de abajo dice
      que el común nombra «sin distinguirlo» de los demás y que el propio
      nombra a uno «específico»; aquí se ve pasar: la misma palabra,
      copiada, les queda a las cinco niñas, y el nombre, a una. En la
      clase también hay dos niños, y «niña» no se posa sobre ellos: el
      sustantivo común nombra a cualquiera de SU clase, no a cualquiera.
   2. ⚠️ **Kenia también es «niña», y se ve.** Sobre su cabeza quedan las
      dos etiquetas, una encima de la otra: el nombre no le quita la
      palabra común, le añade lo que la distingue. Si «niña» se le borrara
      al escribir su nombre, la pantalla enseñaría que una palabra
      excluye a la otra.
   3. ⚠️ **«Kenia Ramírez» son DOS sustantivos propios**, el nombre y el
      apellido, y así se dice: la etiqueta lleva «sustantivos propios», en
      plural, y la frase nombra los dos, «Kenia» y «Ramírez». Contarlo como
      uno sería falso, y es el tipo de error que un alumno copia.
   4. ⚠️ **Y la prueba no se regala.** Pregunta con Honduras, Copán, perro,
      ciudad, cerro, mesa… y completa «Los nombres de personas, como
      Carlos, empiezan con letra ___». Aquí no sale ninguna de esas
      palabras, ni la que va en esa raya: el nombre va escrito como se
      escribe, y lo que la animación enseña es a quién nombra, no cómo se
      escribe. La tarea «La niña canta hermoso», que pedía decir de qué
      clase es «niña», pasó a «La vecina canta hermoso» (sustantivos.js).
   5. **Lo que es papel es papel en las dos pantallas.** La libreta, las
      etiquetas copiadas de ella y el sello llevan su color siempre, con
      tinta oscura fija; los aros, que van sobre el escenario, llevan el
      color de la misión en cada pantalla. Y nada se dice solo con color:
      lo que le queda a cualquiera va con raya cortada (la etiqueta
      «niña», su recuadro en la libreta y sus aros) y lo que nombra a una
      sola, con raya entera.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amConstancia')) return;

  var ANCHO = 320, ALTO = 236, FIN = 4;

  /* La clase de primero: siete, a 44 de distancia. Cinco niñas y dos
     niños, revueltos como se sientan; Kenia es la sexta. */
  var CLASE = ['nina', 'nino', 'nina', 'nina', 'nino', 'nina', 'nina'];
  var KENIA = 5;
  function xDe(i) { return 28 + 44 * i; }
  var Y_CABEZA = 158;

  /* La libreta: el renglón de arriba y el de abajo, y dónde están las dos
     palabras que salen de ella. */
  var R1 = 29, R2 = 56;
  var X_NINA = 172, X_KENIA = 250;
  /* Dónde se posan las etiquetas: la de «niña» justo encima de la cabeza,
     y la del nombre encima de esa. */
  var Y_ETQ_NINA = 131, Y_ETQ_KENIA = 106;
  /* El sello, en el hueco del renglón de abajo. */
  var SELLO_X = 70, SELLO_Y = 48;

  var PIEL = ['#c68642', '#8d5524', '#e0ac69', '#a1665e', '#7b4a32', '#b07a4f', '#d49a6a'];
  var LAZO = ['#e84393', '#fdcb6e', '#0984e3', '#00b894', '#e17055'];

  var TEXTOS = [
    'La libreta dice «la niña de primero», y esta es la clase de primero. ¿Para cuál de las niñas es? Decídelo antes de tocar.',
    'La palabra «niña» nombra a cualquiera de las cinco niñas de la clase: con ella no se sabe cuál es.',
    '«Kenia Ramírez» nombra a una sola: la distingue de las otras cuatro. Ahora sí se sabe para quién es la constancia.',
    '«Niña» es un sustantivo común: nombra a cualquiera. «Kenia» y «Ramírez» son sustantivos propios: nombran a una sola.',
    'Con el nombre en la libreta, la constancia sale ese mismo día: don Ramón ya no tiene que volver.'
  ];

  var A;
  var cajaNina, filaKenia, cajaKenia, etiquetas = [], etKenia, anilloKenia;
  var conectorC, conectorP, rotuloC, rotuloP, sello;

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una etiqueta copiada de la libreta: un papelito con la palabra. Va en
     dos piezas, porque aparece Y viaja: si la misma pieza hiciera las dos
     cosas, las dos llevarían la misma demora y saldría volando antes de
     verse (es la regla de las capas de la numeración maya). */
  function etiqueta(padre, palabra, ancho, alto, clase, de) {
    var fuera = A.el('g', { class: 'am-fuera su-etiqueta ' + clase, 'data-etiqueta': de }, padre);
    var dentro = A.el('g', null, fuera);
    A.el('rect', { x: r2(-ancho / 2), y: r2(-alto / 2), width: ancho, height: alto, rx: r2(alto / 2) }, dentro);
    texto(dentro, { class: 'su-tinta', x: 0, y: r2(alto * 0.22), 'text-anchor': 'middle', 'font-size': alto > 20 ? 14 : 13 }, palabra);
    return { fuera: fuera, dentro: dentro };
  }

  /* Un alumno de primero, con el uniforme de la escuela: blusa o camisa
     blanca, y falda o pantalón azul. Se distinguen por la silueta (la falda
     que se abre, las dos piernas del pantalón, las colitas del pelo), no
     por el color. */
  function alumno(padre, i) {
    var el = A.el, x = xDe(i), es = CLASE[i], y = Y_CABEZA;
    var g = el('g', { class: 'su-alumno', 'data-alumno': i, 'data-es': es }, padre);
    if (i === KENIA) g.setAttribute('data-nombre', 'Kenia Ramírez');
    var piel = PIEL[i % PIEL.length];
    /* Las piernas y los zapatos. */
    el('path', { class: 'su-pierna', stroke: piel, d: 'M ' + r2(x - 4) + ' ' + (y + 40) + ' V ' + (y + 51) + ' M ' + r2(x + 4) + ' ' + (y + 40) + ' V ' + (y + 51) }, g);
    el('ellipse', { class: 'su-zapato', cx: x - 4.6, cy: y + 52.5, rx: 3.8, ry: 2 }, g);
    el('ellipse', { class: 'su-zapato', cx: x + 4.6, cy: y + 52.5, rx: 3.8, ry: 2 }, g);
    if (es === 'nina') {
      el('path', { class: 'su-azul', d: 'M ' + (x - 8) + ' ' + (y + 30) + ' H ' + (x + 8) + ' L ' + (x + 12) + ' ' + (y + 43) + ' H ' + (x - 12) + ' Z' }, g);
    } else {
      el('path', { class: 'su-azul', d: 'M ' + (x - 8) + ' ' + (y + 30) + ' H ' + (x + 8) + ' V ' + (y + 50) + ' H ' + r2(x + 1.2) + ' V ' + (y + 38) + ' H ' + r2(x - 1.2) + ' V ' + (y + 50) + ' H ' + (x - 8) + ' Z' }, g);
    }
    /* La blusa o la camisa, con sus mangas. */
    el('path', { class: 'su-blusa', d: 'M ' + (x - 8) + ' ' + (y + 11) + ' Q ' + x + ' ' + (y + 7) + ' ' + (x + 8) + ' ' + (y + 11) +
      ' L ' + (x + 11.5) + ' ' + (y + 25) + ' L ' + (x + 8) + ' ' + (y + 26) + ' V ' + (y + 32) + ' H ' + (x - 8) + ' V ' + (y + 26) +
      ' L ' + (x - 11.5) + ' ' + (y + 25) + ' Z' }, g);
    /* Las colitas van detrás de la cabeza. */
    if (es === 'nina') {
      var lazo = LAZO[[0, 2, 3, 5, 6].indexOf(i) % LAZO.length];
      el('circle', { class: 'su-pelo', cx: x - 11, cy: y + 2, r: 3.8 }, g);
      el('circle', { class: 'su-pelo', cx: x + 11, cy: y + 2, r: 3.8 }, g);
      el('circle', { class: 'su-lazo', fill: lazo, cx: x - 9.2, cy: y - 2.4, r: 2 }, g);
      el('circle', { class: 'su-lazo', fill: lazo, cx: x + 9.2, cy: y - 2.4, r: 2 }, g);
    }
    el('circle', { class: 'su-cabeza', fill: piel, cx: x, cy: y, r: 9 }, g);
    /* El pelo de arriba: la niña con su raya en medio, el niño corto. */
    el('path', { class: 'su-pelo', d: es === 'nina'
      ? 'M ' + r2(x - 9.3) + ' ' + (y + 1) + ' C ' + r2(x - 10) + ' ' + (y - 12) + ' ' + r2(x + 10) + ' ' + (y - 12) + ' ' + r2(x + 9.3) + ' ' + (y + 1) +
        ' C ' + r2(x + 6) + ' ' + (y - 5) + ' ' + r2(x + 1) + ' ' + (y - 6) + ' ' + x + ' ' + (y - 4) + ' C ' + r2(x - 1) + ' ' + (y - 6) + ' ' + r2(x - 6) + ' ' + (y - 5) + ' ' + r2(x - 9.3) + ' ' + (y + 1) + ' Z'
      : 'M ' + r2(x - 9.2) + ' ' + (y - 1) + ' C ' + r2(x - 9.5) + ' ' + (y - 12) + ' ' + r2(x + 9.5) + ' ' + (y - 12) + ' ' + r2(x + 9.2) + ' ' + (y - 1) +
        ' C ' + r2(x + 5) + ' ' + (y - 5.5) + ' ' + r2(x - 5) + ' ' + (y - 5.5) + ' ' + r2(x - 9.2) + ' ' + (y - 1) + ' Z' }, g);
    el('circle', { class: 'su-ojo', cx: x - 3, cy: y + 1, r: 1.1 }, g);
    el('circle', { class: 'su-ojo', cx: x + 3, cy: y + 1, r: 1.1 }, g);
    el('path', { class: 'su-boca', d: 'M ' + r2(x - 2.6) + ' ' + (y + 4.2) + ' Q ' + x + ' ' + (y + 6.4) + ' ' + r2(x + 2.6) + ' ' + (y + 4.2) }, g);
    return g;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── La libreta de esa semana. ── */
    var libreta = el('g', { class: 'su-libreta' }, svg);
    el('rect', { class: 'su-papel', x: 6, y: 4, width: 308, height: 62, rx: 3 }, libreta);
    el('path', { class: 'su-renglon', d: 'M 6 33 H 314 M 6 60 H 314' }, libreta);
    el('path', { class: 'su-margen', d: 'M 26 4 V 66' }, libreta);
    texto(libreta, { class: 'su-gris', 'data-renglon': 1, x: 31, y: R1, 'font-size': 11 }, 'Constancia para:');
    texto(libreta, { class: 'su-tinta', 'data-renglon': 1, x: X_NINA - 22, y: R1, 'text-anchor': 'end', 'font-size': 15 }, 'la');
    texto(libreta, { class: 'su-tinta', 'data-renglon': 1, 'data-palabra': 'nina', x: X_NINA, y: R1, 'text-anchor': 'middle', 'font-size': 15 }, 'niña');
    texto(libreta, { class: 'su-tinta', 'data-renglon': 1, x: X_NINA + 22, y: R1, 'font-size': 15 }, 'de primero');
    /* El recuadro de la palabra que se prueba: con raya cortada, como la
       etiqueta que sale de ella. */
    cajaNina = el('rect', { class: 'su-caja su-caja-cualquiera am-fuera', 'data-caja': 'nina', x: X_NINA - 20, y: R1 - 15, width: 40, height: 20, rx: 6 }, libreta);
    /* El renglón de abajo: su nombre, que se escribe en el paso 2. */
    filaKenia = texto(libreta, { class: 'su-tinta-azul am-fuera', 'data-renglon': 2, 'data-palabra': 'kenia', x: X_KENIA, y: R2, 'text-anchor': 'middle', 'font-size': 15 }, 'Kenia Ramírez');
    cajaKenia = el('rect', { class: 'su-caja', 'data-caja': 'kenia', x: X_KENIA - 60, y: R2 - 15, width: 120, height: 20, rx: 6 }, libreta);

    /* El sello, que cae en el paso 4. */
    sello = { fuera: el('g', { class: 'am-fuera su-sello', 'data-sello': '' }, svg) };
    sello.dentro = el('g', null, sello.fuera);
    el('rect', { x: -44, y: -11, width: 88, height: 22, rx: 4 }, sello.dentro);
    texto(sello.dentro, { x: 0, y: 4.5, 'text-anchor': 'middle', 'font-size': 12 }, 'ENTREGADA');

    /* ── Las dos clases, en el paso 3: un rótulo con su hilo hasta la
       palabra de la libreta. ── */
    conectorC = el('path', { class: 'su-conector', 'data-conector': 'comun', d: 'M 160 35 L 112 69' }, svg);
    conectorP = el('path', { class: 'su-conector', 'data-conector': 'propio', d: 'M ' + X_KENIA + ' 62 V 69' }, svg);
    rotuloC = el('g', { class: 'am-fuera su-rotulo', 'data-rotulo': 'comun' }, svg);
    el('rect', { class: 'am-ficha', x: 20, y: 70, width: 120, height: 20, rx: 10 }, rotuloC);
    texto(rotuloC, { class: 'su-rotulo-txt', x: 80, y: 84.5, 'text-anchor': 'middle', 'font-size': 12 }, 'sustantivo común');
    rotuloP = el('g', { class: 'am-fuera su-rotulo', 'data-rotulo': 'propio' }, svg);
    el('rect', { class: 'am-ficha', x: X_KENIA - 68, y: 70, width: 136, height: 20, rx: 10 }, rotuloP);
    texto(rotuloP, { class: 'su-rotulo-txt', x: X_KENIA, y: 84.5, 'text-anchor': 'middle', 'font-size': 12 }, 'sustantivos propios');

    /* ── La clase de primero. ── */
    el('path', { class: 'su-piso', d: 'M 6 214 H 314' }, svg);
    texto(svg, { class: 'am-rotulo', x: ANCHO / 2, y: 230, 'text-anchor': 'middle', 'font-size': 12 }, 'la clase de primero');
    var clase = el('g', { class: 'su-clase' }, svg);
    for (var i = 0; i < CLASE.length; i++) alumno(clase, i);

    /* Los aros: con raya cortada alrededor de cada niña a la que le queda
       «niña», y uno entero alrededor de Kenia. */
    var aros = el('g', null, svg);
    etiquetas = [];
    CLASE.forEach(function (es, i) {
      if (es !== 'nina') return;
      var a = el('circle', { class: 'su-anillo su-atenua am-fuera', 'data-anillo': 'nina', cx: xDe(i), cy: Y_CABEZA, r: 13.5 }, aros);
      etiquetas.push({ i: i, anillo: a });
    });
    anilloKenia = el('circle', { class: 'su-anillo-k', 'data-anillo': 'kenia', cx: xDe(KENIA), cy: Y_CABEZA, r: 15.5 }, aros);

    /* Las etiquetas, encima de todo: salen de la libreta. */
    var capa = el('g', null, svg);
    etiquetas.forEach(function (et) {
      var e = etiqueta(capa, 'niña', 40, 18, 'su-cualquiera su-atenua', 'nina');
      et.fuera = e.fuera; et.dentro = e.dentro;
    });
    etKenia = etiqueta(capa, 'Kenia Ramírez', 108, 22, 'su-una', 'kenia');
  }

  function pintar(n, antes) {
    var ida = !(antes != null && antes > n);

    /* 1 · La palabra «niña» se prueba sobre cada niña, de izquierda a
       derecha: aparece sobre la libreta, vuela y se posa; al posarse sale
       su aro. */
    A.ver(cajaNina, n >= 1, 0);
    etiquetas.forEach(function (et, k) {
      var d = n === 1 && ida ? 300 + k * 170 : 0;
      A.ver(et.fuera, n >= 1, d);
      if (n >= 1) A.mover(et.dentro, xDe(et.i), Y_ETQ_NINA, 0, 1, n === 1 && ida ? d + 150 : 0);
      else A.mover(et.dentro, X_NINA, R1 - 5, 0, 1, 0);
      A.ver(et.anillo, n >= 1, n === 1 && ida ? d + 850 : 0);
      /* Con el nombre escrito, lo que le queda a cualquiera se queda,
         pero tenue: el ojo va a la que nombra a una sola. */
      et.fuera.classList.toggle('su-tenue', n >= 2);
      et.anillo.classList.toggle('su-tenue', n >= 2);
    });

    /* 2 · Su nombre se escribe, y la etiqueta se posa sobre una sola. */
    var nombre = n === 2 && ida;
    A.ver(filaKenia, n >= 2, 0);
    A.trazar(cajaKenia, n >= 2, nombre ? 400 : 0);
    A.ver(etKenia.fuera, n >= 2, nombre ? 900 : 0);
    if (n >= 2) A.mover(etKenia.dentro, xDe(KENIA), Y_ETQ_KENIA, 0, 1, nombre ? 1050 : 0);
    else A.mover(etKenia.dentro, X_KENIA, R2 - 5, 0, 1, 0);
    A.trazar(anilloKenia, n >= 2, nombre ? 1800 : 0);

    /* 3 · Las dos clases, cada una con su hilo hasta su palabra. */
    var clases = n === 3 && ida;
    A.trazar(conectorC, n >= 3, 0);
    A.ver(rotuloC, n >= 3, clases ? 500 : 0);
    A.trazar(conectorP, n >= 3, clases ? 300 : 0);
    A.ver(rotuloP, n >= 3, clases ? 800 : 0);

    /* 4 · El sello: cae de más grande, como cae un sello. */
    A.ver(sello.fuera, n >= 4, 0);
    A.mover(sello.dentro, SELLO_X, SELLO_Y, -8, n >= 4 ? 1 : 1.7, 0);
  }

  function marcador(n) {
    return [
      { cifra: '¿?', palabras: '¿para cuál de las niñas es?' },
      { cifra: '5', palabras: 'niñas a las que nombra «niña»' },
      { cifra: '1', palabras: 'niña: Kenia Ramírez' },
      { cifra: '2', palabras: 'clases: común y propio' },
      { cifra: '✓', palabras: 'constancia para Kenia Ramírez' }
    ][n];
  }

  AnimacionMision.montar('#amConstancia', {
    vista: [ANCHO, ALTO],
    describe: 'La libreta de la escuela dice «la niña de primero», y debajo está la clase de primero: cinco niñas y dos niños. La palabra «niña» se posa sobre las cinco niñas; el nombre «Kenia Ramírez», sobre una sola.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['👧 Probar con «niña»', '✏️ Escribir su nombre', '🏷️ Común y propio', '📜 La constancia', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
