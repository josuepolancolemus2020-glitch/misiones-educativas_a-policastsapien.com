/* ============================================================
   Animación de «¿Cómo sé que sé?»
   (Ruta de la Raíz, Filosofía, etapa 4)
   ------------------------------------------------------------
   La historia: en el recreo alguien le dijo a Yeimy que el examen de
   Matemáticas se había pasado para el jueves. Esa noche no estudió; el
   martes el examen estaba ahí y sacó 40. Nadie le mintió a propósito: se
   lo dijeron de oídas, y le faltó la única pregunta que hacía falta, «¿y
   vos cómo lo sabés?».

   Lo que se dibuja: la frase que le llegó, y el camino que tenía detrás.
   Una fila por persona, de arriba abajo en el orden en que se la fueron
   diciendo: Dania, Josué, Kevin y, al final, Yeimy. Al principio solo se
   ve lo que le dijo Kevin; con la pregunta de la historia aparece quién se
   lo dijo a él, y quién a ese. Y lo que asombra: el camino no llega a
   nadie que lo viera. Empieza en una PREGUNTA, «¿y si lo pasan para el
   jueves?», que de boca en boca se volvió noticia.

   ⚠️ Las tres frases van alineadas por lo que no cambió («lo pasan», «para
   el jueves»), así se ve lo que sí cambió: delante de cada una se cayó una
   duda. Los anchos están medidos con la Fredoka (textLength), y por eso
   la columna se sostiene aunque la letra tarde en llegar.

   ⚠️ No se nombra ninguna de las maneras de estar con una idea, ni la
   palabra con que la prueba llama a «de dónde salió», ni un paso de
   comprobar, ni al maestro: el Clasifica, la prueba y la actividad de
   ordenar los preguntan. La escena hace la pregunta de la historia y
   enseña lo que encuentra. Y termina diciendo que preguntarla no es
   desconfiar de nadie: una unidad donde todo engaña fabrica un alumno que
   no le cree a nada.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amOidas')) return;

  var ANCHO = 320, ALTO = 240;

  /* ── las cuatro personas, en el orden en que se dijeron la frase ── */
  var FILAS = [
    { k: 'dania', nombre: 'Dania', cara: '👧', y: 26 },
    { k: 'josue', nombre: 'Josué', cara: '👦', y: 72 },
    { k: 'kevin', nombre: 'Kevin', cara: '🧒', y: 118 },
    { k: 'yeimy', nombre: 'Yeimy', cara: '👧', y: 164 }
  ];
  var CARA = { x: 20, baja: 7, tam: 22, nombre: 19 };

  /* ── lo que dijo cada uno, en pedazos (Fredoka 600 a 12) ──
     La columna X_P es donde empieza «para el jueves» en las tres; lo de
     delante se arrima a ella desde la izquierda. */
  var LETRA = 12, ESPACIO = 2.9, MARGEN = 52;
  var ANCHOS = { yisi: 24.7, pasan: 45.6, jueves: 74.6, preg: 5.8, punto: 2.6, parece: 60.3, examen: 99.2 };
  var X_P = MARGEN + ANCHOS.parece + ESPACIO + ANCHOS.pasan + ESPACIO;
  var X_PASAN = X_P - ESPACIO - ANCHOS.pasan;
  var DIJO = {
    dania: [{ k: 'yisi', txt: '¿Y si', fin: X_PASAN - ESPACIO, duda: true },
            { k: 'pasan', txt: 'lo pasan', x: X_PASAN },
            { k: 'jueves', txt: 'para el jueves', x: X_P },
            { k: 'preg', txt: '?', x: X_P + ANCHOS.jueves, duda: true }],
    josue: [{ k: 'parece', txt: 'Parece que', fin: X_PASAN - ESPACIO, duda: true },
            { k: 'pasan', txt: 'lo pasan', x: X_PASAN },
            { k: 'jueves', txt: 'para el jueves', x: X_P },
            { k: 'punto', txt: '.', x: X_P + ANCHOS.jueves }],
    kevin: [{ k: 'examen', txt: 'El examen se pasó', fin: X_P - ESPACIO },
            { k: 'jueves', txt: 'para el jueves', x: X_P },
            { k: 'punto', txt: '.', x: X_P + ANCHOS.jueves }]
  };
  var GLOBO = { x0: 42, x1: 252, alto: 12, r: 6, cola: 6, boca: 4 };
  var PREGUNTA = { txt: '¿Y vos cómo lo sabés?', ancho: 119.4 };

  /* ── lo que contesta cada uno a la pregunta de la historia ── */
  var TAG = { tam: 9.5, x: 57, baja: 25, flecha: 50 };
  var CONTESTA = {
    kevin: { txt: 'Me lo dijo Josué.', ancho: 70.3, sube: true },
    josue: { txt: 'Me lo dijo Dania.', ancho: 69.8, sube: true },
    dania: { txt: 'Yo solo pregunté.', ancho: 73.4, sube: false }
  };

  /* ── lo que le costó: el examen del martes ── */
  var HOJA = { x0: 266, x1: 306, y0: 148, y1: 190, nota: '40', cuando: 'el martes' };

  /* ── lo que se cayó por el camino, y el cuaderno del final ── */
  /* La duda que se cayó va SUBRAYADA, no encerrada: el «?» va pegado a
     «jueves» y entre los dos no cabe la raya de una caja, que tocaba la «s»
     (y la de «Parece que», la «l» de «lo»). El subrayado va debajo de lo que
     baja la «q» y el «¿», y encima del borde del globo. */
  var MARCA = { baja: 4.6 };
  var CAYO = { x: 260, txt: 'se cayó' };
  var CUADERNO = { x0: 14, x1: 306, y0: 194, y1: 236 };

  /* ── el reloj de la escena ── */
  var APAGA = 500;
  var T1 = { hoja: 300 };
  var T2 = { pregunta: 0, contesta: 800, hueco: 1500 };
  var T3 = { contesta: 0, hueco: 700, dania: 1900 };
  var T4 = { marca: 300, cayo: 400, entre: 1000 };
  var T5 = { cuaderno: 500 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }
  /* Un globo con su cola hacia la cara, a la izquierda: un solo trazo. */
  function globo(x0, x1, y) {
    var y0 = y - GLOBO.alto, y1 = y + GLOBO.alto, r = GLOBO.r;
    return 'M' + (x0 + r) + ' ' + y0 + ' L' + (x1 - r) + ' ' + y0 + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + r) +
      ' L' + x1 + ' ' + (y1 - r) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - r) + ' ' + y1 +
      ' L' + (x0 + r) + ' ' + y1 + ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - r) +
      ' L' + x0 + ' ' + (y + GLOBO.boca) + ' L' + (x0 - GLOBO.cola) + ' ' + y + ' L' + x0 + ' ' + (y - GLOBO.boca) +
      ' L' + x0 + ' ' + (y0 + r) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + r) + ' ' + y0 + ' Z';
  }
  /* Un pedazo de la frase, con su ancho medido: la columna no se corre
     aunque la Fredoka todavía no haya llegado. */
  function pedazo(A, padre, y, p) {
    var ancho = ANCHOS[p.k];
    var x = p.fin !== undefined ? p.fin - ancho : p.x;
    var t = texto(A, padre, x, y + 4.2, 'od-tinta', LETRA, 'start', p.txt);
    t.setAttribute('textLength', ancho);
    t.setAttribute('lengthAdjust', 'spacing');
    t.setAttribute('data-pedazo', p.k);
    if (p.duda) t.setAttribute('data-duda', '');
    return { el: t, x0: x, x1: x + ancho, duda: !!p.duda };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── el hueco de quien todavía no se sabe: arriba de Kevin ── */
    P.huecos = {};
    ['dania', 'josue'].forEach(function (q) {
      var y = FILAS.filter(function (f) { return f.k === q; })[0].y;
      var h = A.el('g', { 'data-hueco': q }, svg);
      A.el('circle', { cx: CARA.x, cy: y - 4, r: 11, 'class': 'am-hueco' }, h);
      A.el('rect', { x: GLOBO.x0, y: y - GLOBO.alto, width: GLOBO.x1 - GLOBO.x0, height: GLOBO.alto * 2, rx: GLOBO.r, 'class': 'am-hueco' }, h);
      texto(A, h, (GLOBO.x0 + GLOBO.x1) / 2, y + 4.5, 'am-rotulo', 12, 'middle', '?');
      P.huecos[q] = h;
    });

    /* ── cada persona con lo que dijo ── */
    P.filas = {};
    FILAS.forEach(function (f) {
      var g = A.el('g', { 'data-fila': f.k }, svg);
      texto(A, g, CARA.x, f.y + CARA.baja, 'od-emoji', CARA.tam, 'middle', f.cara).setAttribute('data-cara', '');
      texto(A, g, CARA.x, f.y + CARA.nombre, 'am-rotulo', 8.5, 'middle', f.nombre).setAttribute('data-nombre', '');
      var dijo = null;
      if (DIJO[f.k]) {
        dijo = A.el('g', { 'data-dijo': '' }, g);
        A.el('path', { d: globo(GLOBO.x0, GLOBO.x1, f.y), 'class': 'od-globo', 'data-globo': '' }, dijo);
        dijo.pedazos = DIJO[f.k].map(function (p) { return pedazo(A, dijo, f.y, p); });
      }
      P.filas[f.k] = { g: g, y: f.y, dijo: dijo };
    });

    /* ── la pregunta de la historia, en el globo de Yeimy ── */
    var yY = P.filas.yeimy.y;
    P.pregunta = A.el('g', { 'data-pregunta': '' }, svg);
    A.el('path', { d: globo(GLOBO.x0, r2(MARGEN + PREGUNTA.ancho + 10), yY), 'class': 'od-globo', 'data-globo': '' }, P.pregunta);
    var tp = texto(A, P.pregunta, MARGEN, yY + 4.2, 'od-tinta', LETRA, 'start', PREGUNTA.txt);
    tp.setAttribute('textLength', PREGUNTA.ancho);
    tp.setAttribute('lengthAdjust', 'spacing');

    /* ── lo que contesta cada uno: con una flecha hacia quien se lo dijo ── */
    P.contesta = {};
    Object.keys(CONTESTA).forEach(function (q) {
      var c = CONTESTA[q], y = P.filas[q].y + TAG.baja;
      var g = A.el('g', { 'data-contesta': q }, svg);
      if (c.sube) {
        A.el('path', { d: 'M' + TAG.flecha + ' ' + (y + 1) + ' L' + TAG.flecha + ' ' + (y - 8) +
                       ' M' + (TAG.flecha - 2.6) + ' ' + (y - 5.2) + ' L' + TAG.flecha + ' ' + (y - 8) + ' L' + (TAG.flecha + 2.6) + ' ' + (y - 5.2),
                       'class': 'od-flecha', 'data-sube': '' }, g);
      }
      var t = texto(A, g, TAG.x, y, 'am-rotulo', TAG.tam, 'start', c.txt);
      t.setAttribute('textLength', c.ancho);
      t.setAttribute('lengthAdjust', 'spacing');
      t.setAttribute('data-contesta-dice', '');
      P.contesta[q] = g;
    });

    /* ── el examen del martes, junto a Yeimy ── */
    P.hoja = A.el('g', { 'data-hoja': '' }, svg);
    texto(A, P.hoja, (HOJA.x0 + HOJA.x1) / 2, HOJA.y0 - 6, 'am-rotulo', 9, 'middle', HOJA.cuando).setAttribute('data-hoja-cuando', '');
    A.el('rect', { x: HOJA.x0, y: HOJA.y0, width: HOJA.x1 - HOJA.x0, height: HOJA.y1 - HOJA.y0, rx: 3, 'class': 'od-papel', 'data-hoja-papel': '' }, P.hoja);
    [178, 184].forEach(function (y) {
      A.el('path', { d: 'M' + (HOJA.x0 + 6) + ' ' + y + ' L' + (HOJA.x1 - 6) + ' ' + y, 'class': 'od-renglon' }, P.hoja);
    });
    A.el('circle', { cx: (HOJA.x0 + HOJA.x1) / 2, cy: 162, r: 12, 'class': 'od-circulo', 'data-hoja-circulo': '' }, P.hoja);
    texto(A, P.hoja, (HOJA.x0 + HOJA.x1) / 2, 168, 'od-nota', 17, 'middle', HOJA.nota).setAttribute('data-hoja-nota', '');

    /* ── lo que se cayó por el camino: cada duda, con su marca ── */
    P.marcas = ['dania', 'josue'].map(function (q) {
      var f = P.filas[q], g = A.el('g', { 'data-marca': q }, svg);
      var y = r2(f.y + 4.2 + MARCA.baja);
      f.dijo.pedazos.filter(function (p) { return p.duda; }).forEach(function (p) {
        A.el('path', { d: 'M' + r2(p.x0) + ' ' + y + ' L' + r2(p.x1) + ' ' + y, 'class': 'od-marca', 'data-marca-raya': '' }, g);
      });
      var cayo = A.el('g', { 'data-cayo': '' }, g);
      texto(A, cayo, CAYO.x, f.y + 3.5, 'am-rotulo', 9, 'start', CAYO.txt);
      return { g: g, cayo: cayo };
    });

    /* ── el cuaderno del final ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUADERNO.x0, y: CUADERNO.y0, width: CUADERNO.x1 - CUADERNO.x0, height: CUADERNO.y1 - CUADERNO.y0, rx: 5,
                   'class': 'od-papel', 'data-cuaderno-caja': '' }, P.cuaderno);
    texto(A, P.cuaderno, CUADERNO.x0 + 10, 210, 'od-tinta', 9.5, 'start', 'Me dijeron:');
    A.el('path', { d: 'M77 211 L' + (CUADERNO.x1 - 10) + ' 211', 'class': 'od-renglon', 'data-raya-escribir': '' }, P.cuaderno);
    texto(A, P.cuaderno, CUADERNO.x0 + 10, 228, 'od-tinta', 9.5, 'start', 'Le pregunto a:');
    A.el('path', { d: 'M92 229 L' + (CUADERNO.x1 - 10) + ' 229', 'class': 'od-renglon', 'data-raya-escribir': '' }, P.cuaderno);
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso: qué filas se ven (las de arriba de
     Kevin aparecen con la pregunta), si está el examen del martes, la
     pregunta de Yeimy, qué contestó cada uno, las marcas de lo que se cayó
     y el cuaderno del final. */
  var ESTADOS = [
    { dania: false, josue: false, hoja: false, pregunta: false, contesta: [], marcas: false, cuaderno: false },
    { dania: false, josue: false, hoja: true, pregunta: false, contesta: [], marcas: false, cuaderno: false },
    { dania: false, josue: true, hoja: true, pregunta: true, contesta: ['kevin'], marcas: false, cuaderno: false },
    { dania: true, josue: true, hoja: true, pregunta: true, contesta: ['kevin', 'josue', 'dania'], marcas: false, cuaderno: false },
    { dania: true, josue: true, hoja: true, pregunta: true, contesta: ['kevin', 'josue', 'dania'], marcas: true, cuaderno: false },
    { dania: true, josue: true, hoja: false, pregunta: true, contesta: ['kevin', 'josue', 'dania'], marcas: true, cuaderno: true }
  ];

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function todo() {
    return [P.filas.dania.g, P.filas.josue.g, P.huecos.dania, P.huecos.josue, P.hoja, P.pregunta, P.cuaderno]
      .concat(Object.keys(P.contesta).map(function (q) { return P.contesta[q]; }))
      .concat(P.marcas.map(function (m) { return m.g; }), P.marcas.map(function (m) { return m.cayo; }));
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      ['dania', 'josue'].forEach(function (q) {
        A.ver(P.filas[q].g, s[q], 0);
        A.ver(P.huecos[q], !s[q], 0);
      });
      A.ver(P.hoja, s.hoja, 0);
      A.ver(P.pregunta, s.pregunta, 0);
      Object.keys(P.contesta).forEach(function (q) { A.ver(P.contesta[q], s.contesta.indexOf(q) >= 0, 0); });
      P.marcas.forEach(function (m) { A.ver(m.g, s.marcas, 0); A.ver(m.cayo, s.marcas, 0); });
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }

  function pintar(n, antes, A) {
    /* Los pasos que cuentan algo (1 a 4) se cuentan cada vez que se ENTRA en
       ellos, también volviendo con «Atrás»; el 0 y el 5 se pintan siempre. */
    if (n >= 1 && n <= 4 && antes === n) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 5) {
      if (antes !== 4) { base(A, ESTADOS[5]); return; }
      base(A, ESTADOS[4]);
      A.ver(P.hoja, false, 0);
      A.ver(P.cuaderno, true, T5.cuaderno);
      return;
    }
    base(A, ESTADOS[n - 1]);
    if (n === 1) { A.ver(P.hoja, true, T1.hoja); return; }
    if (n === 2) {
      /* La pregunta, lo que contesta Kevin y, cuando ya se fue el hueco,
         quien se lo dijo. */
      A.ver(P.pregunta, true, T2.pregunta);
      A.ver(P.contesta.kevin, true, T2.contesta);
      A.ver(P.huecos.josue, false, T2.hueco);
      A.ver(P.filas.josue.g, true, T2.hueco + APAGA);
      return;
    }
    if (n === 3) {
      A.ver(P.contesta.josue, true, T3.contesta);
      A.ver(P.huecos.dania, false, T3.hueco);
      A.ver(P.filas.dania.g, true, T3.hueco + APAGA);
      A.ver(P.contesta.dania, true, T3.dania);
      return;
    }
    P.marcas.forEach(function (m, i) {
      A.ver(m.g, true, T4.marca + T4.entre * i);
      A.ver(m.cayo, true, T4.marca + T4.cayo + T4.entre * i);
    });
  }

  var FRASES = [
    'En el recreo, Kevin le dijo a Yeimy: «El examen se pasó para el jueves». ¿Y Kevin cómo lo sabía?',
    'Esa noche Yeimy no estudió. El martes el examen estaba ahí: sacó 40 y se quedó fuera del cuadro de honor.',
    'Le faltó una pregunta: «¿Y vos cómo lo sabés?». Kevin no lo vio. Se lo dijo Josué, y Josué dijo otra cosa.',
    'Josué tampoco lo vio: se lo dijo Dania. Y Dania no lo dijo. Lo preguntó.',
    'Nadie mintió a propósito. Cada uno lo dijo un poco más seguro, y se cayeron el «¿y si…?» y el «parece que».',
    'Preguntar «¿cómo lo sabés?» no es desconfiar de nadie. Ahora vos: escribí algo que te dijeron hoy y a quién se lo preguntarías.'
  ];
  var BOTONES = ['📅 ¿Y el martes?', '❓ La pregunta que faltó', '❓ ¿Y Josué?', '🔍 ¿Qué cambió?', '✍️ ¿Y vos?', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['1', 'frase le llegó a Yeimy'],
    ['40', 'su nota del martes'],
    ['2', 'personas en el camino'],
    ['3', 'personas, y ninguna lo vio'],
    ['2', 'dudas que se cayeron'],
    ['2', 'renglones en tu cuaderno']
  ];

  AnimacionMision.montar('#amOidas', {
    vista: [ANCHO, ALTO],
    describe: 'En el recreo le dijeron a Yeimy que el examen se pasó para el jueves. No estudió y sacó 40. ' +
      'Con la pregunta que le faltó, «¿y vos cómo lo sabés?», aparece el camino: Kevin lo oyó de Josué, y Josué, de Dania. ' +
      'Y Dania solo había preguntado. Nadie mintió a propósito: cada uno lo dijo un poco más seguro.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
