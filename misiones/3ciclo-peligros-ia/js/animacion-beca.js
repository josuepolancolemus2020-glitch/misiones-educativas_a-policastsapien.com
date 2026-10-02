/* ============================================================
   Animación de «Los Peligros de la Inteligencia Artificial»
   (Ruta de la Máquina que Aprende, etapa 5)
   ------------------------------------------------------------
   La historia: a Yoselin le rechazaron la solicitud de la beca en cuatro
   segundos. La leyó un programa que «acierta el 92 %», y por eso lo
   compraron. Nadie preguntó a quién le cae el 8 % que falla: cae siempre
   sobre las escuelas chiquitas. A Yoselin le costó el año.

   Lo que se dibuja: 100 solicitudes de beca, una por cuadrito, en el orden
   en que llegaron. Las de escuela grande son cuadradas y las de escuela de
   aldea tienen techo de casa: se distinguen por la forma, no por el color.
   El programa las decide una por una y acierta 92 (✓) y se equivoca en 8
   (✗): es el 92 % por el que lo compraron. Después se separan las de aldea,
   y los 8 errores se van con ellas: en las grandes no queda ninguno. Tres
   barras dicen cuánto acierta con todas, con las grandes y con las de
   aldea, y una de esas es la de Yoselin.

   ⚠️ Lo que asombra, y es verdad: el 92 % no miente. Las 100 están ahí y se
   pueden contar. Lo que pasa es que no dice A QUIÉN le cae el error, que es
   la pregunta que desarma este peligro en js/data/ia-peligros.js.

   ⚠️ Las cuentas no se escriben: salen de las 100 solicitudes (SOLICITUDES),
   y la sonda las vuelve a contar en el dibujo, una por una.

   ⚠️ Los números son inventados, y se dice en el dibujo. De las de aldea
   acierta 12 de 20, y no la mitad, a propósito: «echar una moneda al aire»
   es lo que el alumno descubre al final, en «El promedio que esconde», y la
   animación no le adelanta ese número.

   ⚠️ Lo que NO se dice, y a propósito: ni el nombre de lo que pasa ni lo
   que dicen sus definiciones (son pareados de la prueba), ni con qué se
   entrenó el programa (es la actividad de repartir los ejemplos, y una
   pregunta de la prueba), ni que una persona revise la decisión (es la
   defensa, y otra pregunta). Esta misión habla de vos: la escena también.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amBeca')) return;

  var ANCHO = 320, ALTO = 262;

  /* ── las 100 solicitudes, en el orden en que llegaron ──────── */
  /* En qué lugar de la cuadrícula cae cada solicitud de aldea, y cuáles de
     ellas decide mal (por su orden entre las de aldea). La de Yoselin es una
     de las que decide mal. */
  var ALDEA = [2, 11, 16, 18, 23, 28, 34, 39, 41, 47, 55, 60, 63, 69, 74, 77, 81, 87, 92, 96];
  var MAL = [1, 4, 7, 8, 11, 13, 17, 18];
  var YOSELIN = 18;
  var SOLICITUDES = [];
  for (var i = 0; i < 100; i++) {
    var k = ALDEA.indexOf(i);
    SOLICITUDES.push({ aldea: k >= 0, k: k, bien: k < 0 || MAL.indexOf(k) < 0 });
  }
  function cuenta(filtro) {
    var l = SOLICITUDES.filter(filtro);
    return { bien: l.filter(function (s) { return s.bien; }).length, total: l.length };
  }
  var TODAS = cuenta(function () { return true; });
  var GRANDES = cuenta(function (s) { return !s.aldea; });
  var DE_ALDEA = cuenta(function (s) { return s.aldea; });

  /* ── el dibujo ─────────────────────────────────────────────── */
  var TITULO = { x: 8, base: 12, tam: 10 };
  /* La cuadrícula: diez por fila, en el orden en que llegaron */
  var CUAD = { x0: 8, y0: 20, paso: 17, lado: 14 };
  /* Las de aldea, separadas: cinco por fila, a la derecha */
  var BLOQUE = { x0: 196, y0: 34, paso: 17, cols: 5, rotulo: { x: 196, base: 27, tam: 9.5 } };
  /* Lo que acierta con cada una: una barra por grupo */
  var BARRA = { x: 200, ancho: 100, alto: 7, filas: [128, 154, 180], tam: 10 };
  var LEYENDA = { y: 201, tam: 10, nota: { x: 312, base: 211, tam: 8.5 } };
  var CUADERNO = { x0: 8, x1: 312, y0: 222, y1: 258, tam: 10, renglones: [237, 252] };

  /* ── el reloj de la escena ──────────────────────────────────── */
  var T1 = { fila: 150, primera: 200 };
  var T2 = { cada: 60, vuela: 800 };
  var T3 = { cada: 500 };
  var T4 = { aro: 0, nombre: 300 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }
  /* Dónde va cada cuadrito: su esquina de arriba a la izquierda */
  function enCuadricula(i) { return { x: CUAD.x0 + CUAD.paso * (i % 10), y: CUAD.y0 + CUAD.paso * Math.floor(i / 10) }; }
  function enBloque(k) { return { x: BLOQUE.x0 + BLOQUE.paso * (k % BLOQUE.cols), y: BLOQUE.y0 + BLOQUE.paso * Math.floor(k / BLOQUE.cols) }; }

  /* La forma de cada una, dibujada desde su esquina: cuadrada la de escuela
     grande; con techo de casa la de aldea. Y el centro de la marca: en la de
     casa va más abajo, debajo del techo. */
  function forma(A, padre, aldea, clase) {
    var l = CUAD.lado;
    if (aldea) return A.el('polygon', { points: '0,5 ' + l / 2 + ',0 ' + l + ',5 ' + l + ',' + l + ' 0,' + l, 'class': clase }, padre);
    return A.el('rect', { x: 0, y: 0, width: l, height: l, rx: 2, 'class': clase }, padre);
  }
  function centroMarca(aldea) { return { x: CUAD.lado / 2, y: aldea ? 10 : 7 }; }
  /* ✓ una raya quebrada; ✗ dos rayas */
  function marca(A, padre, aldea, bien) {
    var c = centroMarca(aldea);
    var d = bien
      ? 'M' + (c.x - 3) + ' ' + (c.y + 0.2) + ' L' + (c.x - 0.8) + ' ' + (c.y + 2.4) + ' L' + (c.x + 3) + ' ' + (c.y - 2.4)
      : 'M' + (c.x - 2.3) + ' ' + (c.y - 2.3) + ' L' + (c.x + 2.3) + ' ' + (c.y + 2.3) + ' M' + (c.x + 2.3) + ' ' + (c.y - 2.3) + ' L' + (c.x - 2.3) + ' ' + (c.y + 2.3);
    return A.el('path', { d: d, 'class': bien ? 'be-bien' : 'be-mal', 'data-marca': bien ? 'bien' : 'mal' }, padre);
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    texto(A, svg, TITULO.x, TITULO.base, 'am-rotulo', TITULO.tam, 'start', TODAS.total + ' solicitudes de beca').setAttribute('data-titulo', '');

    /* ── los huecos que dejan las de aldea al salir ── */
    P.hueco = [];
    SOLICITUDES.forEach(function (s, i) {
      if (!s.aldea) return;
      var p = enCuadricula(i);
      var g = A.el('g', { transform: 'translate(' + p.x + ' ' + p.y + ')' }, svg);
      var h = forma(A, g, true, 'be-hueco');
      h.setAttribute('data-hueco', String(i));
      P.hueco[s.k] = h;
    });

    /* ── las 100, cada una en su sitio; las de aldea, encima, porque vuelan ── */
    P.marca = []; P.vuela = []; P.carta = [];
    var orden = SOLICITUDES.map(function (s, i) { return i; }).filter(function (i) { return !SOLICITUDES[i].aldea; })
      .concat(ALDEA);
    orden.forEach(function (i) {
      var s = SOLICITUDES[i], p = enCuadricula(i);
      var lugar = A.el('g', { transform: 'translate(' + p.x + ' ' + p.y + ')' }, svg);
      /* lo que vuela: una envoltura propia, dentro de la que la pone en su sitio */
      var vuela = A.el('g', { 'data-solicitud': String(i) }, lugar);
      forma(A, vuela, s.aldea, 'be-carta').setAttribute('data-carta', s.aldea ? 'aldea' : 'grande');
      P.marca[i] = marca(A, vuela, s.aldea, s.bien);
      P.vuela[i] = vuela;
    });

    /* ── la leyenda: qué forma es cada escuela ── */
    var lg = A.el('g', { 'data-leyenda': '' }, svg);
    var g1 = A.el('g', { transform: 'translate(8 ' + LEYENDA.y + ')' }, lg);
    forma(A, g1, false, 'be-carta').setAttribute('data-leyenda-forma', 'grande');
    texto(A, lg, 26, LEYENDA.y + 11, 'am-rotulo', LEYENDA.tam, 'start', 'escuela grande').setAttribute('data-leyenda-dice', 'grande');
    var g2 = A.el('g', { transform: 'translate(104 ' + LEYENDA.y + ')' }, lg);
    forma(A, g2, true, 'be-carta').setAttribute('data-leyenda-forma', 'aldea');
    texto(A, lg, 122, LEYENDA.y + 11, 'am-rotulo', LEYENDA.tam, 'start', 'escuela de aldea').setAttribute('data-leyenda-dice', 'aldea');
    texto(A, svg, LEYENDA.nota.x, LEYENDA.nota.base, 'be-nota', LEYENDA.nota.tam, 'end', 'Números inventados').setAttribute('data-nota', '');

    /* ── el rótulo de las que se separan ── */
    P.rotuloBloque = texto(A, svg, BLOQUE.rotulo.x, BLOQUE.rotulo.base, 'am-rotulo', BLOQUE.rotulo.tam, 'start', 'las ' + DE_ALDEA.total + ' de aldea');
    P.rotuloBloque.setAttribute('data-bloque-rotulo', '');

    /* ── las tres barras ── */
    P.barra = [];
    [['todas', TODAS], ['grandes', GRANDES], ['de aldea', DE_ALDEA]].forEach(function (b, j) {
      var y = BARRA.filas[j];
      var g = A.el('g', { 'data-barra': b[0] }, svg);
      texto(A, g, BARRA.x, y, 'am-rotulo', BARRA.tam, 'start', b[0] + ' · ' + b[1].bien + ' de ' + b[1].total).setAttribute('data-barra-dice', '');
      A.el('rect', { x: BARRA.x, y: y + 4, width: BARRA.ancho, height: BARRA.alto, 'class': 'be-pista', 'data-barra-pista': '' }, g);
      A.el('rect', { x: BARRA.x, y: y + 4, width: r2(BARRA.ancho * b[1].bien / b[1].total), height: BARRA.alto, 'class': 'be-lleno', 'data-barra-lleno': '' }, g);
      P.barra.push(g);
    });

    /* ── la de Yoselin ── */
    var py = enBloque(YOSELIN);
    P.aro = A.el('rect', { x: py.x - 3, y: py.y - 3, width: CUAD.lado + 6, height: CUAD.lado + 6, rx: 4, 'class': 'be-aro', 'data-aro': '' }, svg);
    P.nombre = texto(A, svg, py.x + CUAD.lado / 2, py.y + CUAD.lado + 13, 'be-nombre', 10, 'middle', 'Yoselin');
    P.nombre.setAttribute('data-nombre', '');

    /* ── el cuaderno del final ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUADERNO.x0, y: CUADERNO.y0, width: CUADERNO.x1 - CUADERNO.x0, height: CUADERNO.y1 - CUADERNO.y0, rx: 6, 'class': 'be-papel', 'data-cuaderno-caja': '' }, P.cuaderno);
    [['Algo que decide sobre personas:', 194], ['¿Con quiénes se equivocaría más?', 194]].forEach(function (l, j) {
      var y = CUADERNO.renglones[j];
      texto(A, P.cuaderno, 16, y, 'be-letra', CUADERNO.tam, 'start', l[0]);
      A.el('path', { d: 'M' + l[1] + ' ' + (y + 1) + ' L302 ' + (y + 1), 'class': 'be-renglon', 'data-raya-escribir': '' }, P.cuaderno);
    });
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso. marcas: si ya decidió; separadas: si
     las de aldea están en su bloque; barras: cuántas barras se ven. */
  var ESTADOS = [
    { marcas: false, separadas: false, barras: 0, yoselin: false, cuaderno: false },
    { marcas: true, separadas: false, barras: 0, yoselin: false, cuaderno: false },
    { marcas: true, separadas: true, barras: 0, yoselin: false, cuaderno: false },
    { marcas: true, separadas: true, barras: 3, yoselin: false, cuaderno: false },
    { marcas: true, separadas: true, barras: 3, yoselin: true, cuaderno: false },
    { marcas: true, separadas: true, barras: 3, yoselin: true, cuaderno: true }
  ];

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function todo() {
    return [P.rotuloBloque, P.aro, P.nombre, P.cuaderno].concat(P.marca, P.vuela, P.hueco, P.barra);
  }
  /* A dónde vuela la de aldea k: de su lugar en la cuadrícula a su lugar en
     el bloque */
  function destino(i) {
    var s = SOLICITUDES[i], de = enCuadricula(i), a = enBloque(s.k);
    return { dx: a.x - de.x, dy: a.y - de.y };
  }
  function separar(A, si, demora) {
    ALDEA.forEach(function (i, k) {
      var d = destino(i), t = demora(k);
      if (si) A.mover(P.vuela[i], d.dx, d.dy, 0, 1, t); else A.mover(P.vuela[i], 0, 0, 0, 1, t);
      A.ver(P.hueco[k], si, t);
    });
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      SOLICITUDES.forEach(function (x, i) { A.ver(P.marca[i], s.marcas, 0); });
      separar(A, s.separadas, function () { return 0; });
      A.ver(P.rotuloBloque, s.separadas, 0);
      P.barra.forEach(function (b, j) { A.ver(b, j < s.barras, 0); });
      A.ver(P.aro, s.yoselin, 0);
      A.ver(P.nombre, s.yoselin, 0);
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan cada vez que se ENTRA en
       ellos, también volviendo con «Atrás»; el 0 y el 5 se pintan siempre. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 5) {
      if (antes !== 4) { base(A, ESTADOS[5]); return; }
      base(A, ESTADOS[4]);
      A.ver(P.cuaderno, true, 0);
      return;
    }
    if (n === 1) {
      /* decide una por una: fila por fila, en el orden en que llegaron */
      base(A, ESTADOS[0]);
      SOLICITUDES.forEach(function (x, i) { A.ver(P.marca[i], true, T1.primera + T1.fila * Math.floor(i / 10)); });
      return;
    }
    if (n === 2) {
      /* se separan las de aldea: cada una vuela a su lugar, en su orden, y
         deja su hueco; el rótulo llega con la primera */
      base(A, ESTADOS[1]);
      separar(A, true, function (k) { return k * T2.cada; });
      A.ver(P.rotuloBloque, true, T2.vuela);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      P.barra.forEach(function (b, j) { A.ver(b, true, j * T3.cada); });
      return;
    }
    base(A, ESTADOS[3]);
    A.ver(P.aro, true, T4.aro);
    A.ver(P.nombre, true, T4.nombre);
  }

  var FRASES = [
    'Un programa decide 100 solicitudes de beca, de escuelas grandes y de aldea. ¿Cuántas decide bien?',
    'Las decide una por una. Acierta ' + TODAS.bien + ' y se equivoca en ' + (TODAS.total - TODAS.bien) + ': ese es el ' + TODAS.bien + ' % por el que lo compraron.',
    'Se separan las ' + DE_ALDEA.total + ' de aldea, y los ' + (TODAS.total - TODAS.bien) + ' errores se van con ellas. En las escuelas grandes no queda ninguno.',
    'Con las grandes acierta ' + GRANDES.bien + ' de ' + GRANDES.total + '. Con las de aldea, ' + DE_ALDEA.bien + ' de ' + DE_ALDEA.total + '. Las dos cosas caben en el mismo ' + TODAS.bien + ' %.',
    'La de Yoselin era una de esas ' + DE_ALDEA.total + '. Con escuelas como la suya, el programa se equivoca en ' + (DE_ALDEA.total - DE_ALDEA.bien) + ' de cada ' + DE_ALDEA.total + '.',
    'Ahora vos: pensá en algo que decide sobre personas. Escribí con quiénes se podría equivocar más.'
  ];
  var BOTONES = ['📄 Que decida', '🏠 Las de aldea', '📊 ¿Y con cada una?', '🔍 ¿Y Yoselin?', '✍️ ¿Y vos?', '↺ Empezar otra vez'];
  var MARCADOR = [
    [String(TODAS.total), 'solicitudes de beca'],
    [TODAS.bien + ' %', 'decididas bien'],
    [(TODAS.total - TODAS.bien) + ' de ' + (TODAS.total - TODAS.bien), 'errores, en las de aldea'],
    [DE_ALDEA.bien + ' de ' + DE_ALDEA.total, 'las de aldea, decididas bien'],
    [String(DE_ALDEA.total), 'solicitudes como la de Yoselin'],
    ['?', 'en tu cuaderno']
  ];

  AnimacionMision.montar('#amBeca', {
    vista: [ANCHO, ALTO],
    describe: 'Un programa decide 100 solicitudes de beca y acierta 92. Al separar las 20 de escuelas de aldea, los 8 errores se van con ellas. ' +
      'Con las escuelas grandes acierta 80 de 80; con las de aldea, 12 de 20. La de Yoselin era una de esas 20.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
