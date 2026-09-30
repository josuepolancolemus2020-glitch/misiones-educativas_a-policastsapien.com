/* ============================================================
   M.E.T.A.S · El Sistema Digestivo · «Llena no es lo mismo que nutrida»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de Kenia:
   llega a la escuela con la panza llena y a media mañana ya no puede con
   los ojos. En su casa se come todos los días, pero lo que hay en el plato
   casi siempre es tortilla, arroz y un fresco, y de lo que el cuerpo usa
   para crecer y repararse (el frijol, el huevo, la leche) no le entra casi
   nada. La historia dice que Kenia se está alimentando, pero no se está
   nutriendo. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza en
   cada paso.

   A la izquierda, arriba, el plato; abajo, Kenia de frente, con su panza
   dibujada por dentro. A la derecha, cuatro frascos, cada uno con los
   alimentos que le tocan escritos debajo. Cada bocado es una bolita del
   color de su alimento.

     0  el plato de Kenia: tortilla, arroz, un fresco y un poquito de
        frijol. ¿Le llegó de todo lo que su cuerpo usa?;
     1  todo baja a la panza, y la panza se llena: no se queda con hambre;
     2  cada bocado va a su frasco: casi todo al mismo, uno solo al del
        frijol, y dos frascos quedan vacíos;
     3  otro plato, con los mismos bocados: la panza se llena igual;
     4  pero ahora le llega de los cuatro frascos: lo que cambió no fue
        cuánto comió, sino qué comió;
     5  llenarse no es lo mismo que nutrirse. Y la pregunta es del alumno:
        ¿qué frasco te quedó vacío hoy?

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Los dos platos dan los mismos ocho bocados.** Así la panza se
      llena igual con los dos y lo único que cambia es a qué frasco va cada
      uno. La sonda cuenta los bocados en la panza y en cada frasco, y
      comprueba que la raya de «llena» esté a la misma altura las dos veces.
   2. ⚠️ **Cada bocado va al frasco que dice su etiqueta, y eso no se le cree
      a la escena.** La sonda lleva su propia tabla de qué alimento va a qué
      frasco y la compara con lo escrito debajo de cada uno. El fresco va al
      primero por su azúcar, y lo dice la etiqueta.
   3. ⚠️ **«Casi nada», y no «nada».** La historia dice que del frijol, el
      huevo y la leche no le entra casi nada, y por eso en el plato de Kenia
      hay un poquito de frijol: un bocado, en su frasco. Dibujarlo vacío
      habría dicho más que la historia.
   4. ⚠️ **El otro plato sigue lo que la misión enseña**: muchas frutas y
      verduras, suficiente tortilla y frijol, y poca grasa. Por eso su
      frasco más lleno es el de las frutas y verduras, y el del aguacate
      lleva uno solo.
   5. ⚠️ **Lo que pregunta la prueba no se dice.** Los frascos llevan
      alimentos escritos, no el nombre del nutriente ni para qué sirve: eso
      lo pregunta el examen. Solo se dice lo que ya dice la historia, que el
      frijol, el huevo y la leche sirven para crecer y repararse. Y no se
      nombra ningún órgano: es la panza, como en la historia. La prueba se
      cambió donde la historia o esta animación ya contestaban.
   6. **Nada se dice solo con color.** Cada frasco lleva su etiqueta escrita
      y el vacío dice «vacío»; los bocados se cuentan. El plato, la panza y
      los frascos son como son en la pantalla clara y en la oscura.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amFrascos')) return;

  var ANCHO = 320, ALTO = 240, FIN = 5;
  var PLATO = [62, 40], BOCA = [62, 94];
  /* Los cuatro frascos: x de la izquierda, arriba, ancho y alto. */
  var FRASCO = { x: 140, y: 42, ancho: 40, alto: 108, paso: 44 };
  var ETIQUETAS = [['tortilla,', 'arroz,', 'azúcar'], ['frijol,', 'huevo,', 'leche'], ['aguacate,', 'aceite'], ['frutas,', 'verduras']];
  /* Los bocados de cada plato: de qué alimento son y a qué frasco van. */
  var BOCADOS_A = [['tortilla', 0], ['tortilla', 0], ['tortilla', 0], ['arroz', 0], ['arroz', 0], ['arroz', 0], ['fresco', 0], ['frijol', 1]];
  var BOCADOS_B = [['tortilla', 0], ['tortilla', 0], ['frijol', 1], ['huevo', 1], ['aguacate', 2], ['naranja', 3], ['tomate', 3], ['repollo', 3]];
  /* De dónde sale cada bocado: de su alimento, en SU plato. Van en dos
     tablas porque los dos platos no ponen las cosas en el mismo sitio (el
     frijol del otro plato está donde en el de Kenia estaba el arroz): con
     una sola, un bocado de frijol saldría del aguacate. */
  var SALE = {
    kenia: { tortilla: [36, 35], arroz: [62, 33], fresco: [110, 32], frijol: [84, 40] },
    otro: { tortilla: [32, 35], frijol: [58, 33], huevo: [76, 32], aguacate: [92, 40], naranja: [111, 35], tomate: [44, 45], repollo: [56, 46] }
  };

  var TEXTOS = [
    'Kenia se llena con tortilla, arroz, un fresco y un poquito de frijol. ¿Le llegó de todo lo que su cuerpo usa?',
    'Todo baja a la panza, y la panza se llena: Kenia no se queda con hambre.',
    'Pero casi todo va al mismo frasco. Del frijol, el huevo y la leche, que sirven para crecer y repararse, casi nada.',
    'Otro plato: tortilla, frijol, huevo, aguacate, ensalada y una naranja. La panza se llena igual, ni más ni menos.',
    'Pero ahora le llega de los cuatro frascos. Lo que cambió no fue cuánto comió, sino qué comió.',
    'Llenarse no es lo mismo que nutrirse. Mira tu comida de hoy: ¿qué frasco te quedó vacío?'
  ];

  var A;
  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  /* Dónde queda el bocado k en la panza (dos columnas, de abajo arriba) y
     el bocado que hace n en su frasco. ⚠️ La panza no es una caja: su lado
     derecho baja, y un bocado arriba a la derecha se salía de la raya del
     dibujo. Las dos columnas van corridas a la izquierda, donde la panza es
     más alta, y la sonda mira que cada bocado quede dentro de lo pintado. */
  function enPanza(k) { return [54 + (k % 2) * 14, 167 - Math.floor(k / 2) * 11]; }
  function enFrasco(f, n) {
    return [FRASCO.x + f * FRASCO.paso + 11 + (n % 2) * 18, FRASCO.y + FRASCO.alto - 9 - Math.floor(n / 2) * 11];
  }

  var P = {};

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El plato ── */
    el('ellipse', { class: 'sd-plato', 'data-plato': '', cx: PLATO[0], cy: PLATO[1] + 3, rx: 50, ry: 17 }, svg);
    el('ellipse', { class: 'sd-plato-in', cx: PLATO[0], cy: PLATO[1] + 3, rx: 38, ry: 11.5 }, svg);

    /* Lo que hay en cada plato. El de Kenia se va al comérselo (paso 1); el
       otro aparece y se va en el mismo paso (3), así que lleva dos
       envolturas, una dentro de la otra. */
    P.comidaA = el('g', { 'data-comida': 'kenia' }, svg);
    P.comidaBsale = el('g', { class: 'am-fuera', 'data-comida': 'otro' }, svg);
    P.comidaB = el('g', { 'data-comida-va': '' }, P.comidaBsale);
    function tortilla(g, x, y) {
      [4, 0].forEach(function (dy) { el('ellipse', { class: 'sd-tortilla', cx: x, cy: y + dy, rx: 14, ry: 5 }, g); });
    }
    function frijol(g, x, y, r) {
      el('ellipse', { class: 'sd-frijol', cx: x, cy: y, rx: r, ry: r * 0.55 }, g);
    }
    tortilla(P.comidaA, 36, 33);
    [[55, 34], [62, 31], [69, 34], [58, 37], [66, 37]].forEach(function (p) { el('ellipse', { class: 'sd-arroz', cx: p[0], cy: p[1], rx: 4.5, ry: 3 }, P.comidaA); });
    frijol(P.comidaA, 84, 40, 4);
    /* El fresco, en su vaso junto al plato. */
    el('path', { class: 'sd-vaso', d: 'M 102 18 L 118 18 L 116 46 L 104 46 Z' }, P.comidaA);
    el('path', { class: 'sd-fresco', d: 'M 102.8 25 L 117.2 25 L 115.8 45 L 104.2 45 Z' }, P.comidaA);
    tortilla(P.comidaB, 32, 33);
    frijol(P.comidaB, 58, 33, 8);
    el('ellipse', { class: 'sd-clara', cx: 76, cy: 32, rx: 9, ry: 5 }, P.comidaB);
    el('circle', { class: 'sd-yema', cx: 76, cy: 31.5, r: 3 }, P.comidaB);
    el('path', { class: 'sd-aguacate', d: 'M 86 40 Q 92 32 99 39 Q 92 45 86 40 Z' }, P.comidaB);
    el('circle', { class: 'sd-tomate', cx: 44, cy: 45, r: 3.6 }, P.comidaB);
    el('ellipse', { class: 'sd-repollo', cx: 56, cy: 46, rx: 6, ry: 3.2 }, P.comidaB);
    el('circle', { class: 'sd-naranja', cx: 111, cy: 34, r: 8 }, P.comidaB);
    el('path', { class: 'sd-hoja', d: 'M 111 26 Q 115 21 119 23 Q 115 27 111 26 Z' }, P.comidaB);

    /* ── Kenia, de frente, con su panza por dentro ── */
    el('rect', { class: 'sd-pierna', x: 48, y: 196, width: 11, height: 26 }, svg);
    el('rect', { class: 'sd-pierna', x: 65, y: 196, width: 11, height: 26 }, svg);
    el('ellipse', { class: 'sd-zapato', cx: 53, cy: 223, rx: 8, ry: 3.2 }, svg);
    el('ellipse', { class: 'sd-zapato', cx: 71, cy: 223, rx: 8, ry: 3.2 }, svg);
    el('path', { class: 'sd-falda', d: 'M 40 170 L 84 170 L 90 198 L 34 198 Z' }, svg);
    el('path', { class: 'sd-brazo', d: 'M 40 112 L 30 162' }, svg);
    el('path', { class: 'sd-brazo', d: 'M 84 112 L 94 162' }, svg);
    el('path', { class: 'sd-camisa', 'data-kenia': '', d: 'M 40 106 Q 62 100 84 106 L 86 172 L 38 172 Z' }, svg);
    el('rect', { class: 'sd-piel', x: 56, y: 96, width: 12, height: 10 }, svg);
    el('circle', { class: 'sd-piel', 'data-cabeza': '', cx: 62, cy: 86, r: 14 }, svg);
    el('path', { class: 'sd-pelo', d: 'M 48 86 Q 47 70 62 70 Q 77 70 76 86 Q 72 77 62 77 Q 52 77 48 86 Z' }, svg);
    el('path', { class: 'sd-pelo', d: 'M 48 84 Q 43 96 46 104 Q 50 96 50 86 Z M 76 84 Q 81 96 78 104 Q 74 96 74 86 Z' }, svg);
    el('circle', { class: 'sd-ojo', cx: 57, cy: 87, r: 1.6 }, svg);
    el('circle', { class: 'sd-ojo', cx: 67, cy: 87, r: 1.6 }, svg);
    el('path', { class: 'sd-boca', 'data-boca': '', d: 'M 58 93 Q 62 96 66 93' }, svg);
    /* La panza, dibujada por dentro. */
    el('path', { class: 'sd-panza', 'data-panza': '', d: 'M 50 124 Q 44 124 44 132 L 44 164 Q 44 174 56 174 L 70 174 Q 82 174 82 162 L 82 142 Q 82 132 74 130 L 68 128 Q 64 126 64 120 L 58 120 Q 56 124 50 124 Z' }, svg);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'panza', x: 3, y: 146, 'font-size': 10.5 }, 'su');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'panza', x: 3, y: 158, 'font-size': 10.5 }, 'panza');
    el('line', { class: 'sd-hilo', x1: 31, y1: 150, x2: 45, y2: 150 }, svg);
    P.llena = el('g', { class: 'am-fuera', 'data-llena': '' }, svg);
    el('line', { class: 'sd-raya', 'data-raya-llena': '', x1: 46, y1: 127, x2: 80, y2: 127 }, P.llena);
    texto(P.llena, { class: 'am-rotulo', 'data-rotulo': 'llena', x: 96, y: 130, 'font-size': 10 }, 'llena');

    /* ── Los cuatro frascos, con sus alimentos escritos debajo ── */
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'frascos', x: FRASCO.x + (FRASCO.paso * 3 + FRASCO.ancho) / 2, y: FRASCO.y - 12, 'font-size': 10.5, 'text-anchor': 'middle' }, 'cada bocado va a su frasco');
    P.vacio = [];
    for (var f = 0; f < 4; f++) {
      var x = FRASCO.x + f * FRASCO.paso;
      el('rect', { class: 'sd-frasco', 'data-frasco': f, x: x, y: FRASCO.y, width: FRASCO.ancho, height: FRASCO.alto, rx: 6 }, svg);
      el('rect', { class: 'sd-tapa', x: x - 2, y: FRASCO.y - 5, width: FRASCO.ancho + 4, height: 6, rx: 2 }, svg);
      ETIQUETAS[f].forEach(function (t, i) {
        texto(svg, { class: 'am-rotulo', 'data-etiqueta': f, x: x + FRASCO.ancho / 2, y: FRASCO.y + FRASCO.alto + 12 + i * 10, 'font-size': 9, 'text-anchor': 'middle' }, t);
      });
      P.vacio[f] = texto(svg, { class: 'sd-vacio am-fuera', 'data-vacio': f, x: x + FRASCO.ancho / 2, y: FRASCO.y + FRASCO.alto / 2, 'font-size': 9.5, 'text-anchor': 'middle' }, 'vacío');
    }

    /* ── Los bocados ──
       Cada uno en dos envolturas: la de fuera lo lleva a la boca y la de
       dentro, después, a la panza (una pieza solo tiene una demora). */
    function bocados(lista, cual) {
      return lista.map(function (b, k) {
        var g = el('g', { class: 'am-viaja am-fuera', 'data-bocado': cual, 'data-de': b[0] }, svg);
        var h = el('g', { class: 'am-viaja', 'data-baja': '' }, g);
        var s = SALE[cual][b[0]];
        el('circle', { class: 'sd-bocado sd-b-' + b[0], cx: s[0], cy: s[1], r: 4.4 }, h);
        return { g: g, h: h, de: b[0], frasco: b[1], sale: s, k: k };
      });
    }
    P.bA = bocados(BOCADOS_A, 'kenia');
    P.bB = bocados(BOCADOS_B, 'otro');
  }

  /* Pone cada bocado donde le toca: en el plato, en la panza o en su
     frasco. En la panza van en el orden en que salen del plato; en cada
     frasco, uno encima de otro en el orden en que llegan.
     ⚠️ Del plato a la panza se pasa POR LA BOCA: primero sube la envoltura
     de fuera y, cuando llega, baja la de dentro. En línea recta la bolita
     cruzaba la cara de Kenia a la altura de los ojos, y eso se vio en las
     fotos a medio viaje. Para todo lo demás (a los frascos, o de vuelta)
     las dos se mueven a la vez, y la suma va en línea recta. */
  function colocar(lista, donde, visible, demoraDe, porLaBoca) {
    var cuenta = [0, 0, 0, 0];
    lista.forEach(function (b, k) {
      var p = donde === 'plato' ? b.sale : donde === 'panza' ? enPanza(k) : enFrasco(b.frasco, cuenta[b.frasco]++);
      var dem = demoraDe(k);
      var fuera = porLaBoca ? [BOCA[0] - b.sale[0], BOCA[1] - b.sale[1]] : [p[0] - b.sale[0], p[1] - b.sale[1]];
      A.mover(b.g, fuera[0], fuera[1], 0, 1, dem);
      A.mover(b.h, p[0] - b.sale[0] - fuera[0], p[1] - b.sale[1] - fuera[1], 0, 1, porLaBoca ? dem + 800 : dem);
      A.ver(b.g, visible, dem);
    });
  }

  function pintar(n, antes) {
    var sigue = antes != null && antes === n - 1;
    function si(k) { return sigue ? k : 0; }
    function cada(ms, desde) { return function (k) { return sigue ? (desde || 0) + k * ms : 0; }; }

    /* El plato de Kenia: se lo come en el paso 1. */
    A.ver(P.comidaA, n === 0, n === 1 ? si(600) : 0);
    /* Sus bocados: en el plato (0), en la panza (1), en sus frascos (2);
       desde el 3, otro día, ya no están. */
    colocar(P.bA, n === 0 ? 'plato' : n === 1 ? 'panza' : 'frasco', n >= 1 && n <= 2,
      n === 1 ? cada(150) : n === 2 ? cada(200) : function () { return 0; }, sigue && n === 1);
    /* El otro plato: aparece en el paso 3 y se lo come en ese mismo paso. */
    A.ver(P.comidaBsale, n >= 3, 0);
    A.ver(P.comidaB, n < 3, n === 3 ? si(1400) : 0);
    colocar(P.bB, n <= 2 ? 'plato' : n === 3 ? 'panza' : 'frasco', n >= 3,
      n === 3 ? cada(150, 800) : n === 4 ? cada(200) : function () { return 0; }, sigue && n === 3);
    /* La raya de «llena», cuando el último bocado ya va bajando. */
    A.ver(P.llena, n === 1 || n === 3, n === 1 ? si(2500) : n === 3 ? si(3300) : 0);
    /* Los frascos que quedan vacíos, cuando ya llegó todo. */
    var lleno = [0, 0, 0, 0];
    (n === 2 ? BOCADOS_A : n >= 4 ? BOCADOS_B : []).forEach(function (b) { lleno[b[1]]++; });
    for (var f = 0; f < 4; f++) {
      A.ver(P.vacio[f], (n === 2 || n >= 4) && lleno[f] === 0, n === 2 ? si(1800) : 0);
    }
  }

  function marcador(n) {
    return [
      { cifra: '?', palabras: 'si le llegó de todo' },
      { cifra: 'llena', palabras: 'la panza de Kenia' },
      { cifra: '2', palabras: 'frascos vacíos' },
      { cifra: 'llena', palabras: 'igual que con el plato de Kenia' },
      { cifra: '0', palabras: 'frascos vacíos' },
      { cifra: '?', palabras: 'qué frasco te quedó vacío' }
    ][n];
  }

  AnimacionMision.montar('#amFrascos', {
    vista: [ANCHO, ALTO],
    describe: 'Arriba a la izquierda, el plato de Kenia con tortilla, arroz, un poquito de frijol y un fresco; abajo, su panza. A la derecha, cuatro frascos: el de la tortilla, el arroz y el azúcar; el del frijol, el huevo y la leche; el del aguacate y el aceite; y el de las frutas y las verduras. Cada bocado es una bolita del color de su alimento.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🍽️ Que coma', '🫙 ¿Y adónde va?', '🥗 ¿Y otro plato?', '🫙 ¿Y ahora?', '💡 ¿Y tú?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
