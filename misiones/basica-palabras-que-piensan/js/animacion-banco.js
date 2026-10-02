/* ============================================================
   Animación de «Palabras que piensan»
   (Ruta de la Raíz, Filosofía, etapa 5)
   ------------------------------------------------------------
   La historia: a Marlon le llegó un mensaje, «Te espero en el banco a las
   tres». Él fue al banco de la plaza, a hacer el trámite; el otro lo
   esperaba en la banca del parque. Los dos se fueron a las cuatro sin
   verse, y el trámite se pasó para otro día. Nadie escribió mal: la frase
   decía dos cosas, y faltaba una pregunta de cinco palabras.

   Lo que se dibuja: arriba, el chat; abajo, el pueblo, con el banco de la
   plaza a la izquierda y la banca del parque a la derecha. La palabra
   «banco» sale del mensaje y se posa en los DOS lugares: es lo que hace
   que la frase diga dos cosas sin estar mal escrita. Cada uno piensa en
   uno sin darse cuenta, camina al suyo y espera; el reloj da una hora
   entera mientras nadie llega. Después, la misma tarde otra vez: con
   «¿En cuál de los dos?» la palabra se queda en un solo lugar, y se
   encuentran a las tres.

   ⚠️ La sonda saca de la historia cuántas palabras tiene la pregunta y las
   cuenta en el dibujo. Así se encontró que la historia decía «cuatro»: son
   cinco (en · cuál · de · los · dos), y se cambió el cuento.

   ⚠️ No se nombra cómo se llama una frase así, ni lo que hace una frase
   (las cuatro clases), ni ningún pareado de la prueba: el Clasifica, la
   prueba y el bloque de «La misma frase, dos cosas» los preguntan. Tampoco
   sale ninguno de los otros tres ejemplos de esa tarjeta (la vaca, la
   bolsa, el pan): la prueba pregunta por ellos.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amBanco')) return;

  var ANCHO = 320, ALTO = 240;

  /* ── el chat: lo que se escribieron (Fredoka 600 a 12) ──
     Los anchos están medidos con la letra de la misión y se imponen con
     textLength: así la palabra «banco» está donde dice el dibujo aunque la
     Fredoka tarde en llegar, y de ahí salen las etiquetas. */
  var LETRA = 12, ESPACIO = 2.85;
  var AVATAR = { tam: 16, baja: 5.5, nombre: 8, bajaNombre: 20 };
  var GLOBO = { alto: 11, r: 6, cola: 6, boca: 4, pad: 8 };
  var MENSAJES = [
    { k: 'a', de: 'otro', y: 20, x: 40, lado: 'izq',
      pedazos: [{ k: 'te', txt: 'Te espero en el', ancho: 81.2 }, { k: 'banco', txt: 'banco', ancho: 33.0 }, { k: 'tres', txt: 'a las tres', ancho: 49.9 }] },
    { k: 'b', de: 'marlon', y: 46, x: 172.9, lado: 'der',
      pedazos: [{ k: 'en', txt: '¿En', ancho: 19.8 }, { k: 'cual', txt: 'cuál', ancho: 23.2 }, { k: 'de', txt: 'de', ancho: 13.2 },
                { k: 'los', txt: 'los', ancho: 15.8 }, { k: 'dos', txt: 'dos?', ancho: 24.7 }] },
    { k: 'c', de: 'otro', y: 72, x: 40, lado: 'izq',
      pedazos: [{ k: 'resp', txt: 'En la banca del parque.', ancho: 126.4 }] }
  ];
  var CARAS = { otro: { cara: '🧑', nombre: 'el otro', x: 14 }, marlon: { cara: '👦', nombre: 'Marlon', x: 306 } };

  /* ── el pueblo ── */
  var LUGARES = {
    plaza: { x: 62, y: 150, tag: { x: 62, y: 110 } },
    parque: { x: 252, y: 152, tag: { x: 252, y: 126 } }
  };
  var TAG = { ancho: 40.9, alto: 16, tam: 10.5 };
  var RELOJ = { x: 160, y: 106, r: 12, hora: 6.5, minuto: 9.5, texto: 131 };
  /* Dónde está cada uno: en su casa, o al lado del lugar al que fue. Cada
     casa queda justo debajo del lugar al que va ese día: así sube derecho,
     y lo que piensa (la nube) no pasa por encima del nombre de un lugar.
     Cuando tiene que ir a lo ancho, va primero a lo ancho y después hacia
     arriba: así no pasa por encima del banco, de la banca ni del reloj. */
  var CASA = { marlon: { x: 112, y: 210 }, otro: { x: 208, y: 210 } };
  /* En el parque, Marlon se para lejos del otro lo que hace falta para que
     sus dos nombres no se lean como uno («Marlon el otro»). */
  var VA = { marlon: { plaza: { x: 112, y: 152 }, parque: { x: 166, y: 152 } }, otro: { parque: { x: 208, y: 152 } } };
  var PERSONA = { tam: 22, baja: 7, nombre: 20.5, tamNombre: 9 };
  var NUBE = { sube: 27, rx: 13, ry: 9.5 };
  var CUADERNO = { x0: 14, x1: 306, y0: 190, y1: 237 };

  /* ── el reloj de la escena ── */
  var APAGA = 500, VIAJE = 800, GIRA = 1600;
  var T1 = { subraya: 0, sale: 300, vuela: 800 };
  var T2 = { piensa: 0, camina: 600, reloj: 1900 };
  var T3 = { vuelve: 0 };
  var T4 = { pregunta: 0, contesta: 900, queda: 1800 };
  var T5 = { otro: 0, marlon: 300, cuaderno: 2400 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }
  /* Un globo de chat con su cola hacia quien lo escribió: un solo trazo. */
  function globo(x0, x1, y, lado) {
    var y0 = y - GLOBO.alto, y1 = y + GLOBO.alto, r = GLOBO.r, b = GLOBO.boca, c = GLOBO.cola;
    var izq = lado === 'izq'
      ? ' L' + x0 + ' ' + (y + b) + ' L' + (x0 - c) + ' ' + y + ' L' + x0 + ' ' + (y - b)
      : '';
    var der = lado === 'der'
      ? ' L' + x1 + ' ' + (y - b) + ' L' + (x1 + c) + ' ' + y + ' L' + x1 + ' ' + (y + b)
      : '';
    return 'M' + (x0 + r) + ' ' + y0 + ' L' + (x1 - r) + ' ' + y0 + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + r) +
      der + ' L' + x1 + ' ' + (y1 - r) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - r) + ' ' + y1 +
      ' L' + (x0 + r) + ' ' + y1 + ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - r) +
      izq + ' L' + x0 + ' ' + (y0 + r) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + r) + ' ' + y0 + ' Z';
  }
  /* La banca, dibujada: el respaldo de dos tablas, el asiento y las patas. */
  function banca(A, padre, cx, y, k) {
    var g = A.el('g', { transform: 'translate(' + r2(cx) + ' ' + r2(y) + ') scale(' + k + ')' }, padre);
    A.el('rect', { x: -19, y: -12, width: 3, height: 22, 'class': 'bb-madera-2' }, g);
    A.el('rect', { x: 16, y: -12, width: 3, height: 22, 'class': 'bb-madera-2' }, g);
    A.el('rect', { x: -22, y: -10, width: 44, height: 3, rx: 1, 'class': 'bb-madera' }, g);
    A.el('rect', { x: -22, y: -3, width: 44, height: 3, rx: 1, 'class': 'bb-madera' }, g);
    A.el('rect', { x: -26, y: 6, width: 52, height: 4, rx: 1, 'class': 'bb-madera' }, g);
    A.el('rect', { x: -21, y: 10, width: 3, height: 12, 'class': 'bb-madera-2' }, g);
    A.el('rect', { x: 18, y: 10, width: 3, height: 12, 'class': 'bb-madera-2' }, g);
    return g;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── el chat ── */
    P.mensajes = {};
    MENSAJES.forEach(function (m) {
      var g = A.el('g', { 'data-mensaje': m.k, 'data-de': m.de }, svg);
      var ancho = m.pedazos.reduce(function (s, p) { return s + p.ancho; }, 0) + ESPACIO * (m.pedazos.length - 1);
      var x0 = m.x - GLOBO.pad, x1 = m.x + ancho + GLOBO.pad;
      A.el('path', { d: globo(r2(x0), r2(x1), m.y, m.lado), 'class': m.de === 'marlon' ? 'bb-globo bb-globo-yo' : 'bb-globo', 'data-globo': '' }, g);
      var x = m.x;
      m.pedazos.forEach(function (p) {
        var t = texto(A, g, x, m.y + 4.2, 'bb-tinta', LETRA, 'start', p.txt);
        t.setAttribute('textLength', p.ancho);
        t.setAttribute('lengthAdjust', 'spacing');
        t.setAttribute('data-pedazo', p.k);
        p.x0 = x; p.x1 = x + p.ancho;
        x += p.ancho + ESPACIO;
      });
      var c = CARAS[m.de];
      texto(A, g, c.x, m.y + AVATAR.baja, 'bb-emoji', AVATAR.tam, 'middle', c.cara).setAttribute('data-avatar', '');
      /* El nombre va una vez por persona, debajo de su primer mensaje. */
      if (m.k !== 'c') texto(A, g, c.x, m.y + AVATAR.bajaNombre, 'am-rotulo', AVATAR.nombre, 'middle', c.nombre).setAttribute('data-avatar-nombre', '');
      P.mensajes[m.k] = g;
    });
    var banco = MENSAJES[0].pedazos[1];
    P.subraya = A.el('path', { d: 'M' + r2(banco.x0) + ' 27.2 L' + r2(banco.x1) + ' 27.2', 'class': 'bb-subraya', 'data-subraya': '' }, svg);
    P.palabra = { x: (banco.x0 + banco.x1) / 2, y: MENSAJES[0].y };

    /* ── los dos lugares: el banco de la plaza y la banca del parque ── */
    var plaza = A.el('g', { 'data-lugar': 'plaza' }, svg);
    texto(A, plaza, LUGARES.plaza.x, LUGARES.plaza.y + 13.6, 'bb-emoji', 40, 'middle', '🏦').setAttribute('data-lugar-dibujo', '');
    var parque = A.el('g', { 'data-lugar': 'parque' }, svg);
    banca(A, parque, LUGARES.parque.x, LUGARES.parque.y, 1).setAttribute('data-lugar-dibujo', '');
    texto(A, parque, 299, 156, 'bb-emoji', 30, 'middle', '🌳').setAttribute('data-arbol', '');
    /* Y el nombre de cada lugar debajo: con la etiqueta «banco» encima se lee
       «el banco de la plaza» y «la banca del parque». */
    texto(A, plaza, LUGARES.plaza.x, 184, 'am-rotulo', 9, 'middle', 'la plaza').setAttribute('data-lugar-nombre', '');
    texto(A, parque, LUGARES.parque.x, 184, 'am-rotulo', 9, 'middle', 'el parque').setAttribute('data-lugar-nombre', '');

    /* ── el reloj: la hora que pasa mientras esperan ── */
    /* Las agujas giran sobre el centro del reloj, puesto a mano: el giro de
       una pieza del dibujo se hace sobre el punto que se le diga. */
    var X = RELOJ.x, Y = RELOJ.y;
    P.reloj = A.el('g', { 'data-reloj': '' }, svg);
    A.el('circle', { cx: X, cy: Y, r: RELOJ.r, 'class': 'bb-reloj', 'data-reloj-cara': '' }, P.reloj);
    [0, 90, 180, 270].forEach(function (g) {
      var a = g * Math.PI / 180, s = Math.sin(a), c = Math.cos(a);
      A.el('path', { d: 'M' + r2(X + s * (RELOJ.r - 3)) + ' ' + r2(Y - c * (RELOJ.r - 3)) + ' L' + r2(X + s * (RELOJ.r - 1)) + ' ' + r2(Y - c * (RELOJ.r - 1)), 'class': 'bb-marca' }, P.reloj);
    });
    P.horas = A.el('path', { d: 'M' + X + ' ' + Y + ' L' + X + ' ' + (Y - RELOJ.hora), 'class': 'bb-aguja bb-gira', 'data-aguja': 'hora' }, P.reloj);
    P.minutos = A.el('path', { d: 'M' + X + ' ' + Y + ' L' + X + ' ' + (Y - RELOJ.minuto), 'class': 'bb-aguja bb-gira', 'data-aguja': 'minuto' }, P.reloj);
    [P.horas, P.minutos].forEach(function (n) { n.style.transformOrigin = X + 'px ' + Y + 'px'; });
    A.el('circle', { cx: X, cy: Y, r: 1.6, 'class': 'bb-centro' }, P.reloj);
    P.tres = texto(A, svg, RELOJ.x, RELOJ.texto, 'am-rotulo', 11, 'middle', '3:00');
    P.tres.setAttribute('data-hora', '3');
    P.cuatro = texto(A, svg, RELOJ.x, RELOJ.texto, 'am-rotulo', 11, 'middle', '4:00');
    P.cuatro.setAttribute('data-hora', '4');

    /* ── las dos personas, cada una en su casa ── */
    P.personas = {};
    ['marlon', 'otro'].forEach(function (k) {
      var c = CASA[k], f = CARAS[k];
      var ancho = A.el('g', { 'data-persona': k, 'class': 'am-viaja' }, svg);
      var alto = A.el('g', { 'data-alto': '', 'class': 'am-viaja' }, ancho);
      var nube = A.el('g', { 'data-nube': k }, alto);
      A.el('ellipse', { cx: c.x, cy: c.y - NUBE.sube, rx: NUBE.rx, ry: NUBE.ry, 'class': 'bb-nube' }, nube);
      A.el('circle', { cx: c.x + 6, cy: c.y - 15.5, r: 1.5, 'class': 'bb-nube' }, nube);
      if (k === 'marlon') texto(A, nube, c.x, c.y - NUBE.sube + 4.3, 'bb-emoji', 12.5, 'middle', '🏦').setAttribute('data-piensa', 'plaza');
      else banca(A, nube, c.x, c.y - NUBE.sube - 1, 0.36).setAttribute('data-piensa', 'parque');
      texto(A, alto, c.x, c.y + PERSONA.baja, 'bb-emoji', PERSONA.tam, 'middle', f.cara).setAttribute('data-cara', '');
      texto(A, alto, c.x, c.y + PERSONA.nombre, 'am-rotulo', PERSONA.tamNombre, 'middle', f.nombre).setAttribute('data-nombre', '');
      P.personas[k] = { ancho: ancho, alto: alto, nube: nube };
    });

    /* ── la palabra «banco», que sale del mensaje y se posa en los dos
          lugares. La de fuera la lleva; la de dentro aparece y se apaga. ── */
    P.tags = {};
    ['plaza', 'parque'].forEach(function (k) {
      var t = LUGARES[k].tag;
      var lleva = A.el('g', { 'data-etiqueta': k }, svg);
      var ve = A.el('g', { 'data-etiqueta-ve': '' }, lleva);
      var dibujo = A.el('g', { 'class': 'bb-etiqueta bb-atenua', 'data-etiqueta-dibujo': '' }, ve);
      var x0 = r2(t.x - TAG.ancho / 2), y0 = r2(t.y - TAG.alto / 2);
      var abierta = A.el('rect', { x: x0, y: y0, width: TAG.ancho, height: TAG.alto, rx: 4, 'class': 'bb-cortada', 'data-borde': 'cortada' }, dibujo);
      var cerrada = A.el('rect', { x: x0, y: y0, width: TAG.ancho, height: TAG.alto, rx: 4, 'class': 'bb-entera', 'data-borde': 'entera' }, dibujo);
      texto(A, dibujo, t.x, t.y + 3.7, 'bb-etiqueta-txt', TAG.tam, 'middle', 'banco');
      P.tags[k] = { lleva: lleva, ve: ve, dibujo: dibujo, abierta: abierta, cerrada: cerrada,
        desde: { x: P.palabra.x - t.x, y: P.palabra.y - t.y } };
    });

    /* ── el cuaderno del final ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUADERNO.x0, y: CUADERNO.y0, width: CUADERNO.x1 - CUADERNO.x0, height: CUADERNO.y1 - CUADERNO.y0, rx: 5,
                   'class': 'bb-papel', 'data-cuaderno-caja': '' }, P.cuaderno);
    texto(A, P.cuaderno, CUADERNO.x0 + 10, 207, 'bb-tinta', 9.5, 'start', 'Una frase que dice dos cosas:');
    A.el('path', { d: 'M155 208 L' + (CUADERNO.x1 - 10) + ' 208', 'class': 'bb-renglon', 'data-raya-escribir': '' }, P.cuaderno);
    texto(A, P.cuaderno, CUADERNO.x0 + 10, 227, 'bb-tinta', 9.5, 'start', 'La pregunta que la arregla:');
    A.el('path', { d: 'M146 228 L' + (CUADERNO.x1 - 10) + ' 228', 'class': 'bb-renglon', 'data-raya-escribir': '' }, P.cuaderno);
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso: si salieron las dos «banco», el
     subrayado, qué piensa cada uno, dónde está cada uno, qué hora marca el
     reloj, la pregunta y la respuesta, cómo queda cada «banco» y el
     cuaderno del final. */
  var ESTADOS = [
    { tags: false, subraya: false, nubes: false, marlon: 'casa', otro: 'casa', hora: 3, pregunta: false, contesta: false, queda: false, cuaderno: false },
    { tags: true, subraya: true, nubes: false, marlon: 'casa', otro: 'casa', hora: 3, pregunta: false, contesta: false, queda: false, cuaderno: false },
    { tags: true, subraya: true, nubes: true, marlon: 'plaza', otro: 'parque', hora: 4, pregunta: false, contesta: false, queda: false, cuaderno: false },
    { tags: true, subraya: true, nubes: true, marlon: 'casa', otro: 'casa', hora: 4, pregunta: false, contesta: false, queda: false, cuaderno: false },
    { tags: true, subraya: true, nubes: false, marlon: 'casa', otro: 'casa', hora: 3, pregunta: true, contesta: true, queda: true, cuaderno: false },
    { tags: true, subraya: true, nubes: false, marlon: 'parque', otro: 'parque', hora: 3, pregunta: true, contesta: true, queda: true, cuaderno: true }
  ];

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function todo() {
    var out = [P.subraya, P.reloj, P.tres, P.cuatro, P.cuaderno];
    Object.keys(P.mensajes).forEach(function (k) { out.push(P.mensajes[k]); });
    Object.keys(P.personas).forEach(function (k) { var p = P.personas[k]; out.push(p.ancho); });
    Object.keys(P.tags).forEach(function (k) { out.push(P.tags[k].lleva); });
    return out;
  }
  /* Dónde va cada uno: el corrimiento a lo ancho y el de hacia arriba. */
  function lugar(k, donde) {
    if (donde === 'casa') return { x: 0, y: 0 };
    var v = VA[k][donde], c = CASA[k];
    return { x: v.x - c.x, y: v.y - c.y };
  }
  /* Si no hay que ir a lo ancho, sube de una vez: un tramo quieto sería una
     pausa sin motivo. */
  function ir(A, k, donde, demora) {
    var l = lugar(k, donde), p = P.personas[k];
    A.mover(p.ancho, l.x, 0, 0, 1, demora);
    A.mover(p.alto, 0, l.y, 0, 1, demora + (l.x ? VIAJE : 0));
  }
  /* De vuelta: primero baja y después va a lo ancho, el mismo camino al revés. */
  function volver(A, k, donde, demora) {
    var l = lugar(k, donde), p = P.personas[k];
    A.mover(p.alto, 0, 0, 0, 1, demora);
    A.mover(p.ancho, 0, 0, 0, 1, demora + (l.x ? VIAJE : 0));
  }
  function hora(A, h, demora) {
    A.mover(P.horas, 0, 0, h === 4 ? 120 : 90, 1, demora);
    A.mover(P.minutos, 0, 0, h === 4 ? 360 : 0, 1, demora);
  }
  function queda(A, si, demora) {
    var pl = P.tags.plaza.dibujo, pa = P.tags.parque;
    pl.style.setProperty('--d', Math.round(demora) + 'ms');
    pl.classList.toggle('bb-tenue', si);
    A.ver(pa.abierta, !si, demora);
    A.ver(pa.cerrada, si, demora);
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      Object.keys(P.tags).forEach(function (k) {
        var t = P.tags[k];
        A.ver(t.ve, s.tags, 0);
        A.mover(t.lleva, s.tags ? 0 : t.desde.x, s.tags ? 0 : t.desde.y, 0, 1, 0);
        A.ver(t.abierta, true, 0);
        A.ver(t.cerrada, false, 0);
      });
      queda(A, s.queda, 0);
      A.ver(P.subraya, s.subraya, 0);
      ['marlon', 'otro'].forEach(function (k) {
        var l = lugar(k, s[k]), p = P.personas[k];
        A.mover(p.ancho, l.x, 0, 0, 1, 0);
        A.mover(p.alto, 0, l.y, 0, 1, 0);
        A.ver(p.nube, s.nubes, 0);
      });
      hora(A, s.hora, 0);
      A.ver(P.tres, s.hora === 3, 0);
      A.ver(P.cuatro, s.hora === 4, 0);
      A.ver(P.mensajes.b, s.pregunta, 0);
      A.ver(P.mensajes.c, s.contesta, 0);
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
      ir(A, 'otro', 'parque', T5.otro);
      ir(A, 'marlon', 'parque', T5.marlon);
      A.ver(P.cuaderno, true, T5.cuaderno);
      return;
    }
    if (n === 1) {
      /* La palabra se subraya; de ella salen las dos «banco», y vuelan. */
      base(A, ESTADOS[0]);
      A.ver(P.subraya, true, T1.subraya);
      Object.keys(P.tags).forEach(function (k) {
        A.ver(P.tags[k].ve, true, T1.sale);
        A.mover(P.tags[k].lleva, 0, 0, 0, 1, T1.vuela);
      });
      return;
    }
    if (n === 2) {
      /* Cada uno piensa en un lugar, camina al suyo y espera una hora. */
      base(A, ESTADOS[1]);
      A.ver(P.personas.marlon.nube, true, T2.piensa);
      A.ver(P.personas.otro.nube, true, T2.piensa);
      ir(A, 'marlon', 'plaza', T2.camina);
      ir(A, 'otro', 'parque', T2.camina);
      hora(A, 4, T2.reloj);
      A.ver(P.tres, false, T2.reloj + GIRA);
      A.ver(P.cuatro, true, T2.reloj + GIRA + APAGA);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      volver(A, 'marlon', ESTADOS[2].marlon, T3.vuelve);
      volver(A, 'otro', ESTADOS[2].otro, T3.vuelve);
      return;
    }
    /* n === 4: la misma tarde otra vez, desde el mensaje. Lo que pensaron y
       la hora vuelven de golpe; después, la pregunta y la respuesta. */
    var s = {};
    Object.keys(ESTADOS[3]).forEach(function (k) { s[k] = ESTADOS[3][k]; });
    s.nubes = false; s.hora = 3;
    base(A, s);
    A.ver(P.mensajes.b, true, T4.pregunta);
    A.ver(P.mensajes.c, true, T4.contesta);
    queda(A, true, T4.queda);
  }

  var FRASES = [
    'A Marlon le llegó este mensaje: «Te espero en el banco a las tres». ¿Adónde tiene que ir?',
    'La frase está bien escrita. Pero «banco» sirve para dos lugares: el banco de la plaza y la banca del parque.',
    'Marlon pensó en el banco de la plaza, y el otro, en la banca. Cada uno eligió sin darse cuenta.',
    'A las cuatro se fueron sin verse: una hora esperando cada uno. Y el trámite se pasó para otro día.',
    'Otra vez, desde el mensaje. Faltaba una pregunta de cinco palabras: «¿En cuál de los dos?». Y la respuesta deja un solo lugar.',
    'Se encuentran a las tres. Nadie escribió mal: la frase decía dos cosas. Ahora vos: escribí una frase así y la pregunta que la arregla.'
  ];
  var BOTONES = ['🔍 Mirar la palabra', '🚶 ¿Adónde fue cada uno?', '🕓 ¿Y a las cuatro?', '💬 La pregunta que faltó', '🚶 ¿Y ahora?', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['8', 'palabras tiene el mensaje'],
    ['2', 'lugares para «banco»'],
    ['2', 'personas, cada una en su lugar'],
    ['1', 'hora esperó cada uno'],
    ['5', 'palabras tiene la pregunta'],
    ['2', 'renglones en tu cuaderno']
  ];

  AnimacionMision.montar('#amBanco', {
    vista: [ANCHO, ALTO],
    describe: 'A Marlon le llegó «Te espero en el banco a las tres». La palabra «banco» sirve para dos lugares: ' +
      'el banco de la plaza y la banca del parque. Cada uno fue a uno, esperaron una hora sin verse y el trámite se pasó para otro día. ' +
      'Lo arreglaba una pregunta de cinco palabras: «¿En cuál de los dos?».',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
