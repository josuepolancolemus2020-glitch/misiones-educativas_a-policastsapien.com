/* ============================================================
   M.E.T.A.S · Geografía de Honduras · «¿A qué mar baja el río?»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de la
   escuela de la aldea: con el temporal encima, la radio fue nombrando
   los departamentos en alerta y pidió que la gente de las riberas se
   moviera, y en la escuela nadie supo contestar dos cosas: en qué
   departamento quedaban, y si el río que tenían al lado bajaba al
   Caribe o al Pacífico. Esperaron a ver qué pasaba. El aparato
   (botones, frase, marcador) vive en js/animacion-mision.js; aquí solo
   está el dibujo y dónde va cada pieza en cada paso.

   Es Honduras cortada de norte a sur y vista de lado: el mar Caribe a la
   izquierda, las montañas en medio y el océano Pacífico a la derecha.
   La escuela está en la ladera del norte, junto a su río.

     0  la escuela y el pedazo de río que tiene al lado: ¿baja al Caribe
        o al Pacífico?;
     1  llueve en lo más alto: dos gotas caen juntas, una a cada lado, y
        terminan en mares distintos;
     2  lo más alto parte el país en dos lados, y cada lado es una
        vertiente: la del Caribe y la del Pacífico;
     3  la escuela está del lado norte: su río baja hasta el Caribe;
     4  lo más alto queda cerca del Pacífico: los ríos del Caribe son
        largos y los del Pacífico, cortos;
     5  con el temporal llueve río arriba, y esa agua baja por el río y
        pasa por la escuela;
     6  saber de qué lado estás te dice adónde baja tu río. Y la pregunta
        es del alumno: ¿en qué departamento está su escuela?

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **El agua siempre baja, y el dibujo no la deja atrapada.** La
      tierra sube sin parar desde cada mar hasta lo más alto, así que
      toda gota que cae baja por su lado hasta su mar. Un hoyo en el
      perfil guardaría agua que en un corte no tiene por dónde salir, y la
      frase «el agua siempre baja» quedaría mintiendo. La sonda lo mide
      punto por punto.
   2. ⚠️ **El agua corre pegada al suelo, y a paso parejo.** Cada camino
      de agua va por la ladera, un poco encima de la tierra, partido en
      tramos del mismo largo que se dibujan uno detrás de otro: el que
      baja al Caribe tarda más porque es más largo, que es lo que enseña
      el paso 4.
   3. ⚠️ **Lo más alto queda cerca del Pacífico, y es de verdad.** La
      vertiente del Pacífico es la franja angosta del sur que llega al
      golfo de Fonseca, y la del Caribe, casi todo el resto del país; por
      eso sus ríos son largos y los del Pacífico, cortos, como enseña la
      misión. El corte es un esquema y lo dice: las montañas no van a su
      tamaño.
   4. ⚠️ **Lo que pregunta la prueba no se dice.** Ni el nombre de un río,
      ni del golfo, ni de un país vecino, ni de una montaña, ni llanuras ni
      valles, ni el clima, ni un mes, ni un número de más. Y la prueba se
      cambió donde la historia o esta animación ya contestaban: las costas
      en dos mares, con qué mar limita por el norte y cuál costa es más
      larga; en pensamiento crítico, el caso de la escuela que busca hacia
      qué mar corren sus ríos, el error del norte y el sur cambiados, la
      comparación de las dos costas y el efecto de los ríos largos del
      norte.
   5. **El departamento no se dibuja.** El repositorio no tiene con qué
      trazar los dieciocho, y un mapa inventado enseñaría fronteras que no
      existen. Por eso la primera pregunta de la historia termina siendo
      la actividad: buscar su escuela en el mapa.
   6. **Nada se dice solo con color.** Cada lado lleva su nombre escrito y
      lo más alto, su raya; el agua lleva su flecha. La tierra, el mar y el
      cielo son como son en la pantalla clara y en la oscura.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCorte')) return;

  var ANCHO = 320, ALTO = 240, FIN = 6;
  var MAR = 176;                                  // el nivel del mar
  var FONDO = 200;                                // donde se corta la tierra
  /* El perfil de la tierra, del Caribe (izquierda, norte) al Pacífico
     (derecha, sur). Sube sin parar hasta lo más alto y baja sin parar. */
  var PERFIL = [[34, 176], [48, 172], [62, 169], [76, 164], [88, 157], [100, 152], [112, 144], [124, 138], [136, 128],
    [148, 120], [160, 110], [172, 100], [184, 88], [196, 78], [206, 68], [214, 62],
    [222, 70], [232, 86], [242, 104], [252, 124], [262, 142], [272, 158], [280, 169], [286, 176]];
  var CUMBRE = 214, CAR = 34, PAC = 286;
  var ESCUELA = 124;                              // la escuela, en la ladera del norte
  var ENCIMA = 2.6;                               // el agua corre un poco encima del suelo
  var TRAMO = 44;                                 // el largo de cada tramo de agua

  var TEXTOS = [
    'Así se ve Honduras cortada de norte a sur. La escuela está junto a un río. ¿Ese río baja al Caribe o al Pacífico?',
    'El agua siempre baja. Dos gotas caen juntas en lo más alto: una baja al Caribe y la otra, al Pacífico.',
    'Lo más alto parte el país en dos lados. Lo que llueve del lado norte baja al Caribe, y lo del sur, al Pacífico. Cada lado es una vertiente.',
    'La escuela está del lado norte de lo más alto. Su río baja cuesta abajo hasta el Caribe.',
    'Lo más alto queda cerca del Pacífico. Por eso los ríos que bajan al Caribe son largos y los que bajan al Pacífico, cortos.',
    'Con el temporal llueve río arriba. Esa agua baja por el río y pasa por la escuela: por eso la radio pide que se mueva la gente de las riberas.',
    'Saber de qué lado estás te dice adónde baja tu río. Y la radio nombra departamentos: ¿en cuál está tu escuela? Búscalo en el mapa.'
  ];

  var A;
  function r2(v) { return Math.round(v * 100) / 100; }
  /* La altura del suelo en x, entre dos puntos del perfil. */
  function suelo(x) {
    for (var i = 1; i < PERFIL.length; i++) {
      var p = PERFIL[i - 1], q = PERFIL[i];
      if (x >= p[0] && x <= q[0]) return p[1] + (q[1] - p[1]) * (x - p[0]) / (q[0] - p[0]);
    }
    return MAR;
  }
  /* Un camino de agua de x0 a x1 pegado al suelo, y su entrada al mar. */
  function camino(x0, x1, alMar) {
    var pts = [[x0, suelo(x0) - ENCIMA]];
    var paso = x1 > x0 ? 1 : -1;
    PERFIL.forEach(function (p) { if ((p[0] - x0) * paso > 0 && (x1 - p[0]) * paso > 0) pts.push([p[0], p[1] - ENCIMA]); });
    if (paso < 0) pts.sort(function (a, b) { return b[0] - a[0]; }); else pts.sort(function (a, b) { return a[0] - b[0]; });
    pts.push([x1, suelo(x1) - ENCIMA]);
    if (alMar) pts.push([x1 + paso * 12, MAR + 3]);
    return pts;
  }
  function largo(pts) {
    var L = 0;
    for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return L;
  }
  /* Parte un camino en tramos del mismo largo: cada tramo se dibuja
     entero en su turno, así el agua baja a paso parejo. */
  function tramos(pts) {
    var L = largo(pts), n = Math.max(1, Math.round(L / TRAMO)), cada = L / n, out = [], actual = [pts[0]], hecho = 0, meta = cada;
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]), usado = 0;
      while (hecho + (d - usado) >= meta - 1e-6 && out.length < n - 1) {
        var t = (usado + (meta - hecho)) / d, c = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
        actual.push(c); out.push(actual); actual = [c];
        usado += meta - hecho; hecho = meta; meta += cada;
      }
      hecho += d - usado; actual.push(b);
    }
    out.push(actual);
    return out;
  }
  function d(pts) { return pts.map(function (p, i) { return (i ? 'L ' : 'M ') + r2(p[0]) + ' ' + r2(p[1]); }).join(' '); }

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  function gota(padre, cx, cy, s, attrs) {
    attrs.d = 'M ' + r2(cx) + ' ' + r2(cy - 6 * s) + ' C ' + r2(cx + 1.6 * s) + ' ' + r2(cy - 3 * s) + ' ' + r2(cx + 4.4 * s) + ' ' + r2(cy - 0.2 * s) +
      ' ' + r2(cx + 4.4 * s) + ' ' + r2(cy + 2 * s) + ' C ' + r2(cx + 4.4 * s) + ' ' + r2(cy + 4.6 * s) + ' ' + r2(cx + 2.4 * s) + ' ' + r2(cy + 6 * s) +
      ' ' + r2(cx) + ' ' + r2(cy + 6 * s) + ' C ' + r2(cx - 2.4 * s) + ' ' + r2(cy + 6 * s) + ' ' + r2(cx - 4.4 * s) + ' ' + r2(cy + 4.6 * s) +
      ' ' + r2(cx - 4.4 * s) + ' ' + r2(cy + 2 * s) + ' C ' + r2(cx - 4.4 * s) + ' ' + r2(cy - 0.2 * s) + ' ' + r2(cx - 1.6 * s) + ' ' + r2(cy - 3 * s) +
      ' ' + r2(cx) + ' ' + r2(cy - 6 * s) + ' Z';
    return A.el('path', attrs, padre);
  }
  function nube(padre, cx, cy, s, attrs) {
    var g = A.el('g', attrs, padre);
    [[-12, 3, 8], [0, -2, 10], [12, 3, 7]].forEach(function (b) {
      A.el('circle', { class: 'gh-nube', cx: r2(cx + b[0] * s), cy: r2(cy + b[1] * s), r: r2(b[2] * s) }, g);
    });
    A.el('rect', { class: 'gh-nube', x: r2(cx - 18 * s), y: r2(cy + 1 * s), width: r2(36 * s), height: r2(9 * s), rx: r2(4.5 * s) }, g);
    return g;
  }
  /* Un camino de agua hecho de tramos que se dibujan uno detrás de otro,
     con su punta de flecha al final. */
  function agua(padre, pts, attrs, clase) {
    var g = A.el('g', attrs, padre), trozos = [];
    tramos(pts).forEach(function (t, k) {
      trozos.push(A.el('path', { class: clase || 'gh-agua', 'data-tramo': k, d: d(t) }, g));
    });
    var a = pts[pts.length - 2], b = pts[pts.length - 1], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
    var punta = A.el('path', { class: 'gh-punta am-fuera', 'data-punta': '', d: 'M ' + r2(b[0] - 6 * Math.cos(ang - 0.5)) + ' ' + r2(b[1] - 6 * Math.sin(ang - 0.5)) +
      ' L ' + r2(b[0]) + ' ' + r2(b[1]) + ' L ' + r2(b[0] - 6 * Math.cos(ang + 0.5)) + ' ' + r2(b[1] - 6 * Math.sin(ang + 0.5)) }, g);
    return { g: g, trozos: trozos, punta: punta };
  }

  var P = {};

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);
    el('rect', { class: 'gh-cielo', x: 0, y: 0, width: ANCHO, height: MAR }, svg);

    /* ── Los dos mares ── */
    el('rect', { class: 'gh-mar', 'data-mar': 'caribe', x: 0, y: MAR, width: CAR + 6, height: FONDO - MAR }, svg);
    el('rect', { class: 'gh-mar', 'data-mar': 'pacifico', x: PAC - 6, y: MAR, width: ANCHO - PAC + 6, height: FONDO - MAR }, svg);
    [[4, CAR - 2], [PAC + 2, ANCHO - 4]].forEach(function (o) {
      el('path', { class: 'gh-ola', d: 'M ' + o[0] + ' ' + (MAR + 6) + ' q 4 -3 8 0 q 4 3 8 0 q 4 -3 8 0' }, svg);
    });

    /* ── La tierra ── */
    var tierra = 'M ' + CAR + ' ' + FONDO + ' ' + PERFIL.map(function (p) { return 'L ' + p[0] + ' ' + p[1]; }).join(' ') + ' L ' + PAC + ' ' + FONDO + ' Z';
    el('path', { class: 'gh-tierra', d: tierra }, svg);
    /* Los dos lados, cada uno con su color y su nombre (paso 2). */
    var iC = PERFIL.findIndex(function (p) { return p[0] === CUMBRE; });
    P.ladoN = el('path', { class: 'gh-lado-n am-fuera', 'data-lado': 'caribe', d: 'M ' + CAR + ' ' + FONDO + ' ' + PERFIL.slice(0, iC + 1).map(function (p) { return 'L ' + p[0] + ' ' + p[1]; }).join(' ') + ' L ' + CUMBRE + ' ' + FONDO + ' Z' }, svg);
    P.ladoS = el('path', { class: 'gh-lado-s am-fuera', 'data-lado': 'pacifico', d: 'M ' + CUMBRE + ' ' + FONDO + ' ' + PERFIL.slice(iC).map(function (p) { return 'L ' + p[0] + ' ' + p[1]; }).join(' ') + ' L ' + PAC + ' ' + FONDO + ' Z' }, svg);
    el('path', { class: 'gh-suelo', 'data-superficie': '', d: 'M ' + PERFIL.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L ') }, svg);

    /* ── Lo más alto: su raya, que sale en el paso 2 ── */
    P.cumbre = el('g', { class: 'am-fuera', 'data-cumbre': '' }, svg);
    el('line', { class: 'gh-raya-cumbre', 'data-raya-cumbre': '', x1: CUMBRE, y1: 24, x2: CUMBRE, y2: 60 }, P.cumbre);
    texto(P.cumbre, { class: 'am-rotulo', 'data-rotulo': 'cumbre', x: CUMBRE, y: 18, 'font-size': 10, 'text-anchor': 'middle' }, 'lo más alto');

    /* ── Los nombres de los lados (paso 2), cada uno adentro del suyo ── */
    P.nombres = el('g', { class: 'am-fuera', 'data-nombres': '' }, svg);
    texto(P.nombres, { class: 'am-rotulo', 'data-rotulo': 'vertiente-caribe', x: 116, y: 176, 'font-size': 10, 'text-anchor': 'middle' }, 'vertiente');
    texto(P.nombres, { class: 'am-rotulo', 'data-rotulo': 'vertiente-caribe2', x: 116, y: 188, 'font-size': 10, 'text-anchor': 'middle' }, 'del Caribe');
    texto(P.nombres, { class: 'am-rotulo', 'data-rotulo': 'vertiente-pacifico', x: 250, y: 176, 'font-size': 10, 'text-anchor': 'middle' }, 'vertiente');
    texto(P.nombres, { class: 'am-rotulo', 'data-rotulo': 'vertiente-pacifico2', x: 250, y: 188, 'font-size': 10, 'text-anchor': 'middle' }, 'del Pacífico');

    /* ── El agua ── */
    /* El río de la escuela: de cerca de lo más alto hasta el Caribe. Al
       principio solo se ve el pedazo que la escuela tiene al lado. */
    P.rio = agua(svg, camino(CUMBRE - 8, CAR, true), { 'data-rio': 'caribe' });
    P.trozo = el('path', { class: 'gh-agua', 'data-trozo': '', d: d(camino(ESCUELA + 22, ESCUELA - 22, false)) }, svg);
    P.nombreRio = texto(svg, { class: 'am-rotulo', 'data-rotulo': 'rio', x: ESCUELA - 26, y: r2(suelo(ESCUELA - 26) + 13), 'font-size': 10, 'text-anchor': 'middle' }, 'su río');
    /* El río del sur, que se ve en el paso 4. */
    P.rioSur = agua(svg, camino(CUMBRE + 8, PAC, true), { 'data-rio': 'pacifico' });
    /* Las dos gotas del paso 1: caen juntas, una a cada lado de lo más
       alto, y cada una baja por su lado hasta su mar. */
    P.nubeArriba = nube(svg, CUMBRE, 34, 0.8, { class: 'am-fuera', 'data-nube': 'arriba' });
    P.caida = [];
    P.bajan = [];
    /* Cada gota va en tres piezas: la que cae (se mueve), la que se apaga
       cuando la gota ya se volvió agua que corre, y la gota misma, que se
       enciende al salir de la nube. Una sola pieza no puede encenderse y
       apagarse en el mismo paso: tiene una sola demora. */
    [[CUMBRE - 5, CAR, 'caribe'], [CUMBRE + 5, PAC, 'pacifico']].forEach(function (q) {
      var cae = el('g', { class: 'am-viaja', 'data-cae': q[2] }, svg);
      var sale = el('g', { 'data-sale': q[2] }, cae);
      gota(sale, q[0], 40, 0.7, { class: 'gh-gota am-fuera', 'data-gota-cae': q[2] });
      P.caida.push(cae);
      P.bajan.push(agua(svg, camino(q[0], q[1], true), { 'data-baja': q[2] }));
    });
    /* La tormenta del paso 5: llueve río arriba, entre la escuela y lo
       más alto. */
    P.tormenta = el('g', { class: 'am-fuera', 'data-tormenta': '' }, svg);
    nube(P.tormenta, 174, 30, 1.05, {});
    for (var x = 160; x <= 196; x += 9) {
      el('line', { class: 'gh-lluvia', 'data-lluvia': '', x1: x, y1: 46, x2: x - 4, y2: r2(suelo(x - 4) - 3) }, P.tormenta);
    }
    /* El río crecido: el mismo camino, más ancho, desde donde llueve. */
    P.crecido = agua(svg, camino(192, CAR, true), { 'data-crecido': '' }, 'gh-crecido');

    /* ── La escuela, con su radio ── */
    var ex = ESCUELA, ey = suelo(ESCUELA);
    P.escuela = el('g', { 'data-escuela': '' }, svg);
    el('rect', { class: 'gh-pared', x: ex - 8, y: r2(ey - 13), width: 16, height: 13 }, P.escuela);
    el('path', { class: 'gh-techo', d: 'M ' + (ex - 10) + ' ' + r2(ey - 12) + ' L ' + ex + ' ' + r2(ey - 21) + ' L ' + (ex + 10) + ' ' + r2(ey - 12) + ' Z' }, P.escuela);
    el('rect', { class: 'gh-puerta', x: ex - 2, y: r2(ey - 7), width: 4, height: 7 }, P.escuela);
    el('line', { class: 'gh-asta', x1: ex + 6, y1: r2(ey - 16), x2: ex + 6, y2: r2(ey - 28) }, P.escuela);
    el('path', { class: 'gh-bandera', d: 'M ' + (ex + 6) + ' ' + r2(ey - 28) + ' l 7 2 l -7 2 z' }, P.escuela);
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'escuela', x: ex - 16, y: r2(ey - 22), 'font-size': 10, 'text-anchor': 'end' }, 'la escuela');
    P.radio = el('g', { class: 'am-fuera', 'data-radio': '' }, svg);
    el('rect', { class: 'gh-radio', x: ex - 30, y: r2(ey - 9), width: 11, height: 7, rx: 1.5 }, P.radio);
    el('line', { class: 'gh-asta', x1: ex - 21, y1: r2(ey - 9), x2: ex - 18, y2: r2(ey - 15) }, P.radio);
    [5, 9].forEach(function (r) {
      el('path', { class: 'gh-onda', d: 'M ' + (ex - 31) + ' ' + r2(ey - 5 - r) + ' a ' + r + ' ' + r + ' 0 0 0 0 ' + (2 * r) }, P.radio);
    });
    /* La pregunta del final, junto a la escuela. */
    P.depto = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'departamento', x: ex + 18, y: r2(ey + 16), 'font-size': 10.5 }, '¿qué departamento?');

    /* ── Los rótulos de los ríos (paso 4) ── */
    P.largos = el('g', { class: 'am-fuera', 'data-largos': '' }, svg);
    texto(P.largos, { class: 'am-rotulo', 'data-rotulo': 'rio-largo', x: 88, y: 186, 'font-size': 10.5, 'text-anchor': 'middle' }, 'río largo');
    texto(P.largos, { class: 'am-rotulo', 'data-rotulo': 'rio-corto', x: 262, y: 186, 'font-size': 10.5, 'text-anchor': 'middle' }, 'río corto');

    /* ── Las preguntas del paso 0: ¿para qué lado? ── */
    P.dudas = el('g', { 'data-dudas': '' }, svg);
    texto(P.dudas, { class: 'am-rotulo', 'data-duda': 'caribe', x: 18, y: 164, 'font-size': 13, 'text-anchor': 'middle' }, '?');
    texto(P.dudas, { class: 'am-rotulo', 'data-duda': 'pacifico', x: 302, y: 164, 'font-size': 13, 'text-anchor': 'middle' }, '?');

    /* ── Los nombres de los mares y del norte y el sur ── */
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'caribe', x: 4, y: 214, 'font-size': 10.5 }, 'mar Caribe');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'norte', x: 4, y: 228, 'font-size': 10 }, '← norte');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'pacifico', x: ANCHO - 4, y: 214, 'font-size': 10.5, 'text-anchor': 'end' }, 'océano Pacífico');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'sur', x: ANCHO - 4, y: 228, 'font-size': 10, 'text-anchor': 'end' }, 'sur →');
    /* ⚠️ Las montañas no van a su tamaño: de verdad, en lo que mide el
       país de un mar al otro, apenas asomarían. Se avisa sin dar cuentas. */
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'escala', x: 4, y: 14, 'font-size': 9.5 }, 'Las montañas no');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'escala', x: 4, y: 26, 'font-size': 9.5 }, 'van a su tamaño.');
  }

  /* Dibuja o borra un camino de agua: tramo por tramo, cada uno en su
     turno, y la punta cuando llega. */
  function correr(rio, si, desde) {
    var n = rio.trozos.length;
    rio.trozos.forEach(function (t, k) { A.trazar(t, si, si ? desde + k * 800 : 0); });
    A.ver(rio.punta, si, si ? desde + n * 800 : 0);
    return desde + n * 800;
  }

  function pintar(n, antes) {
    var sigue = antes != null && antes === n - 1;
    function si(k) { return sigue ? k : 0; }

    /* Paso 0: el pedazo de río junto a la escuela y las dos preguntas. */
    A.ver(P.dudas, n === 0, 0);
    A.ver(P.nombreRio, n === 0, 0);
    A.ver(P.radio, n === 0 || n >= 5, 0);

    /* Paso 1: la nube, las dos gotas que caen y bajan. */
    var gotas = n === 1;
    A.ver(P.nubeArriba, gotas, 0);
    P.caida.forEach(function (c, k) {
      var g = c.querySelector('[data-gota-cae]'), sale = c.querySelector('[data-sale]');
      A.ver(g, gotas, gotas ? si(300) : 0);
      /* Al llegar al suelo, la gota se vuelve el agua que baja. */
      A.ver(sale, !gotas, gotas ? si(1300) : 0);
      A.mover(c, 0, gotas ? (k === 0 ? suelo(CUMBRE - 5) : suelo(CUMBRE + 5)) - 40 - 5 : 0, 0, 1, gotas ? si(500) : 0);
    });
    P.bajan.forEach(function (b) { correr(b, gotas, si(1300)); });

    /* Paso 2: los dos lados y lo más alto. */
    var lados = n === 2;
    A.ver(P.ladoN, lados, 0);
    A.ver(P.ladoS, lados, 0);
    A.ver(P.nombres, lados, lados ? si(400) : 0);
    A.ver(P.cumbre, n >= 2, 0);

    /* Paso 3 en adelante: el río de la escuela, entero hasta el Caribe. */
    correr(P.rio, n >= 3, n === 3 ? si(0) : 0);
    /* Paso 4: el del sur, para comparar; y sus nombres. */
    correr(P.rioSur, n === 4, si(0));
    A.ver(P.largos, n === 4, n === 4 ? si(1600) : 0);
    /* Paso 5 en adelante: el temporal río arriba y el río crecido. */
    A.ver(P.tormenta, n === 5, 0);
    correr(P.crecido, n >= 5, n === 5 ? si(800) : 0);
    A.ver(P.depto, n === 6, n === 6 ? si(300) : 0);
  }

  function marcador(n) {
    return [
      { cifra: '?', palabras: 'adónde baja el río de la escuela' },
      { cifra: '2', palabras: 'mares para dos gotas que cayeron juntas' },
      { cifra: '2', palabras: 'lados: la vertiente del Caribe y la del Pacífico' },
      { cifra: 'Caribe', palabras: 'adonde baja el río de la escuela' },
      { cifra: 'largos', palabras: 'los ríos del Caribe; los del Pacífico, cortos' },
      { cifra: '↓', palabras: 'la lluvia de río arriba pasa por la escuela' },
      { cifra: '?', palabras: 'en qué departamento está tu escuela' }
    ][n];
  }

  AnimacionMision.montar('#amCorte', {
    vista: [ANCHO, ALTO],
    describe: 'Honduras cortada de norte a sur y vista de lado: el mar Caribe a la izquierda, las montañas en medio y el océano Pacífico a la derecha. La escuela está en la ladera del norte, junto a su río.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🌧️ Llueve arriba', '⛰️ ¿Qué las parte?', '🏫 ¿Y la escuela?', '📏 ¿Por qué largos?', '⛈️ El temporal', '📻 ¿Y el aviso?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
