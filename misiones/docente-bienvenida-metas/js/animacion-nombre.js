/* ============================================================
   Animación de «Bienvenido: qué es M.E.T.A.S y por qué existe»
   (misión del maestro, sección «El recorrido», detrás del mapa de las
   cuatro piezas)
   ------------------------------------------------------------
   Lo que enseña: las flechas del mapa, con un dato de verdad. El nombre
   de un alumno se escribe una sola vez, en la lista de Mi aula, y sale
   en cuatro sitios: la asistencia, las notas, la boleta y la tira de la
   clave de familia. Y lo que asombra: escrito mal, sale mal en los
   cuatro; corregido una vez en la lista, las dos pantallas se corrigen
   solas, y los dos papeles que ya se entregaron, no.

   De dónde sale: del código de la plataforma, no de una promesa. Los
   chips de la asistencia y la fila de las notas pintan el PRIMER nombre
   de la lista cada vez que se abren (adPrimerNombre, en
   js/tools/registros-admin.js), y la boleta y la tira imprimen el nombre
   entero el día que se imprimen. La sonda lo busca en ese archivo. Y la
   misión lo dice con estas palabras en la parada de las flechas: «Un
   nombre mal escrito al inicio se arrastra a la boleta, al recibo y a la
   tira de la clave». La escena lo busca antes de montarse: si dejara de
   estar, queda la frase de reserva.

   ⚠️ Lo que NO se dice, y a propósito: cómo se arma la clave de familia,
   el código de aula, el Plan de Acción y sus categorías, SACE, la
   sincronización y el botón «Actualizar». Lo preguntan el quiz, el
   completar y el diagnóstico. Por lo mismo, la tira lleva su clave TAPADA,
   y se llama «de la clave», nunca «de la clave de familia»: «familia» es la
   respuesta de un completar («con su clave de ____»).

   ⚠️ Nada se dice solo con color: donde falta la letra va una marca de
   inserción (‸) debajo del nombre, lo corregido lleva ✓ (una raya
   quebrada), y qué es pantalla y qué es papel va escrito en cada sitio.

   Los nombres van en trozos con su ancho medido con la Fredoka (AV, por
   cada 100 px) y `textLength`: la efe que falta entra justo donde falta,
   y lo de después se corre lo que mide una efe.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amNombre')) return;

  var ANCHO = 320, ALTO = 340;

  /* ── lo que dice la misión, y sin lo que no se monta ── */
  var dice = '';
  try {
    dice = PARADAS.map(function (p) { return [p.txt].concat(p.nohacer || []).join(' '); }).join(' ');
  } catch (e) { return; }
  if (!/se arrastra a la boleta, al recibo y a la tira de la clave/.test(dice) ||
      !/pone cada nombre en la <b>asistencia<\/b>/.test(dice)) return;

  /* ── las medidas de la letra (Fredoka 600, por cada 100 px) ── */
  var AV = {
    a: 56.3, b: 56.3, c: 50.5, d: 56.5, e: 53.7, f: 40.5, g: 55.2, h: 55.4, i: 24.2, j: 23.6, k: 50.4, l: 30.1, m: 80.3,
    n: 56.3, o: 55.9, p: 55.2, q: 55.1, r: 42.3, s: 45.8, t: 41.1, u: 56, v: 56.4, w: 74.6, x: 52.3, y: 55.9, z: 54,
    A: 70.9, B: 61.9, D: 66.7, E: 61, J: 53.6, K: 59.5, L: 56.5, M: 81.4, N: 68.3, O: 72.5, R: 61.1, S: 54.6, T: 64.8,
    'á': 56.3, 'é': 53.7, 'í': 22.5, 'ó': 55.9, 'ú': 56, ' ': 24.1, ',': 22.4, '.': 21.7, ':': 22.5, '·': 20.7, '#': 73,
    '(': 36.4, ')': 36.4, '0': 57.2, '1': 38.3, '3': 57.2, '4': 54.9, '5': 50.1, '6': 52.6, '7': 53.3, '8': 54.7, '9': 52.6
  };
  function ancho(t, tam) {
    var s = 0;
    for (var i = 0; i < t.length; i++) s += AV[t.charAt(i)] != null ? AV[t.charAt(i)] : 56;
    return Math.round(s * tam) / 100;
  }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* ── el nombre: como se escribió y como es ──
     La letra que falta va después de «Je»: «Je» + «f» + «ferson» es
     Jefferson. Si alguien cambiara un nombre y no el otro, la escena no se
     monta. */
  var BIEN = 'Jefferson Mejía', MAL = 'Jeferson Mejía', CORTE = 2, FALTA = 'f';
  if (MAL.slice(0, CORTE) + FALTA + MAL.slice(CORTE) !== BIEN) return;
  function primero(n) { return n.split(' ')[0]; }
  var TAM = 10.5, W_JE = ancho(MAL.slice(0, CORTE), TAM), W_F = ancho(FALTA, TAM), BAJA_F = -9;

  /* ── la lista de Mi aula ── */
  var LISTA = { x0: 8, x1: 140, y0: 66, y1: 192, titulo: 84, x: 16 };
  var FILAS = [[13, 'Brayan Ortiz', 104], [14, 'Dania López', 122], [15, null, 140], [16, 'Kevin Ramos', 158], [17, 'Lesly Mendoza', 176]];
  var NUM = 15;
  var ROTULO = { x: 74, y: 212 };

  /* ── los cuatro sitios donde sale ──
     Qué es pantalla y qué es papel no se escribe aquí a ciegas: es lo que
     hace el código de la plataforma, y lo comprueba la sonda. `entero`:
     si sale el nombre entero o solo el primero. */
  var SX0 = 166, SX1 = 312, ALTO_S = 58, TRONCO = 152, SALE = { x: 142, y: 137 };
  var SITIOS = [
    { k: 'asistencia', y0: 8, titulo: 'Asistencia · pantalla', entero: false },
    { k: 'notas', y0: 74, titulo: 'Notas · pantalla', entero: false },
    { k: 'boleta', y0: 140, titulo: 'Boleta · papel', entero: true },
    { k: 'tira', y0: 206, titulo: 'Tira de la clave · papel', entero: true }
  ];
  SITIOS.forEach(function (s) { s.yc = s.y0 + ALTO_S / 2; s.papel = /papel$/.test(s.titulo); });

  /* ── la mamá, lo que dice, y el cuaderno ── */
  /* El globo va en dos renglones y a la izquierda del tronco de las
     flechas: en uno solo llegaba encima de la flecha que baja a la tira. */
  var MAMA = { x: 40, pies: 330 };
  var CABEZA = { x: MAMA.x, y: MAMA.pies - 47, r: 8 };
  var GLOBO = { x0: 8, y0: 224, y1: 260, tam: 11, dice: ['Es ' + primero(BIEN) + ',', 'con dos efes.'] };
  var CUADERNO = { y0: 272, y1: 334 };

  /* ── el reloj de la escena ── */
  var T1 = { hueco: 0, rotulo: 400, flecha: 600, cada: 800, dura: 800 };
  var T2 = { mama: 0, globo: 500, lista: 1100, sitio: 1400, cada: 300 };
  var T3 = { sale: 0, f: 500, rotulo: 600, corrige: 1300, cada: 300, dura: 800, marca: 800, entregada: 3700 };
  var T4 = { flecha: 300, dura: 800, vieja: 1100, nueva: 1700, marca: 2100 };
  var T5 = { sale: 0, cuaderno: 600 };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido, medido) {
    var at = { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' };
    if (medido) { at.textLength = ancho(contenido, tam); at.lengthAdjust = 'spacing'; }
    var n = A.el('text', at, padre);
    n.textContent = contenido;
    return n;
  }
  /* ✓ es una raya quebrada */
  function bien(A, padre, x, y) {
    var t = 4.5, g = A.el('g', { 'data-marca': 'bien' }, padre);
    A.el('path', { d: 'M' + r2(x - t) + ' ' + r2(y) + ' L' + r2(x - t * 0.2) + ' ' + r2(y + t * 0.8) + ' L' + r2(x + t) + ' ' + r2(y - t * 0.9), 'class': 'bv-bien' }, g);
    return g;
  }
  /* El nombre en trozos: lo de antes (el número), «Je», la efe que falta
     (en su sobre, que la baja desde arriba) y el resto (que se corre lo
     que mide una efe). Devuelve dónde va la marca de lo que falta. */
  function nombre(A, padre, x, y, pre, entero, k, corregido) {
    var g = A.el('g', { 'data-nombre': k }, padre), o = { g: g };
    if (pre) {
      texto(A, g, x, y, 'bv-tinta', TAM, 'start', pre, true).setAttribute('data-pieza', 'pre');
      x += ancho(pre + ' ', TAM);
    }
    var resto = entero ? MAL.slice(CORTE) : primero(MAL).slice(CORTE);
    texto(A, g, x, y, 'bv-tinta', TAM, 'start', MAL.slice(0, CORTE), true).setAttribute('data-pieza', 'je');
    o.fSobre = A.el('g', { 'data-f-sobre': '' }, g);
    texto(A, o.fSobre, x + W_JE, y, 'bv-tinta', TAM, 'start', FALTA, true).setAttribute('data-pieza', 'f');
    o.resto = texto(A, g, x + W_JE, y, 'bv-tinta', TAM, 'start', resto, true);
    o.resto.setAttribute('data-pieza', 'resto');
    o.fin = x + W_JE + ancho(resto, TAM) + W_F;     /* donde acaba ya corregido */
    if (corregido) { A.mover(o.fSobre, 0, 0, 0, 1, 0); A.mover(o.resto, W_F, 0, 0, 1, 0); }
    /* la marca de inserción: debajo del renglón, entre la «e» y la «f» */
    var bx = x + W_JE;
    o.falta = A.el('path', { d: 'M' + r2(bx - 2.6) + ' ' + r2(y + 5.2) + ' L' + r2(bx) + ' ' + r2(y + 1.6) + ' L' + r2(bx + 2.6) + ' ' + r2(y + 5.2),
      'class': 'bv-falta', 'data-falta': k }, padre);
    return o;
  }
  /* una flecha de la fila de la lista a un sitio, y su punta */
  function flecha(A, padre, s, clase, dato) {
    var tip = SX0 - 0.5, bx = tip - 5.5;
    var p = A.el('path', { d: 'M' + SALE.x + ' ' + SALE.y + ' L' + TRONCO + ' ' + SALE.y + ' L' + TRONCO + ' ' + r2(s.yc) + ' L' + r2(bx) + ' ' + r2(s.yc), 'class': clase }, padre);
    p.setAttribute(dato, s.k);
    var pu = A.el('path', { d: 'M' + r2(tip) + ' ' + r2(s.yc) + ' L' + r2(bx) + ' ' + r2(s.yc - 3.2) + ' L' + r2(bx) + ' ' + r2(s.yc + 3.2) + ' Z', 'class': clase + '-punta' }, padre);
    pu.setAttribute(dato + '-punta', s.k);
    return { linea: p, punta: pu };
  }
  /* El globo de lo que dice la mamá, del ancho de lo que dice, con la punta
     hacia su cabeza. */
  function globo(A, padre) {
    var w = Math.max.apply(null, GLOBO.dice.map(function (l) { return ancho(l, GLOBO.tam); })) + 20;
    var x0 = GLOBO.x0, x1 = x0 + w, y0 = GLOBO.y0, y1 = GLOBO.y1;
    var px = CABEZA.x - 6.5, py = CABEZA.y - 5.5, b0 = CABEZA.x - 4, b1 = CABEZA.x + 8;
    var g = A.el('g', { 'data-globo': '' }, padre);
    A.el('path', { d: 'M' + r2(x0 + 6) + ' ' + y0 + ' L' + r2(x1 - 6) + ' ' + y0 + ' Q' + r2(x1) + ' ' + y0 + ' ' + r2(x1) + ' ' + (y0 + 6) +
      ' L' + r2(x1) + ' ' + (y1 - 6) + ' Q' + r2(x1) + ' ' + y1 + ' ' + r2(x1 - 6) + ' ' + y1 + ' L' + r2(b1) + ' ' + y1 + ' L' + r2(px) + ' ' + r2(py) +
      ' L' + r2(b0) + ' ' + y1 + ' L' + r2(x0 + 6) + ' ' + y1 + ' Q' + r2(x0) + ' ' + y1 + ' ' + r2(x0) + ' ' + (y1 - 6) +
      ' L' + r2(x0) + ' ' + (y0 + 6) + ' Q' + r2(x0) + ' ' + y0 + ' ' + r2(x0 + 6) + ' ' + y0 + ' Z', 'class': 'bv-globo', 'data-globo-caja': '' }, g);
    GLOBO.dice.forEach(function (l, i) {
      texto(A, g, (x0 + x1) / 2, y0 + 15 + 14 * i, 'bv-tinta', GLOBO.tam, 'middle', l).setAttribute('data-globo-txt', i);
    });
    return g;
  }
  /* La mamá de Jefferson: piernas, falda, blusa, brazos, cabeza y pelo con
     su moño. */
  function mama(A, padre) {
    var x = MAMA.x, s = MAMA.pies, c = CABEZA;
    var g = A.el('g', { 'data-mama': '' }, padre);
    A.el('rect', { x: x - 5, y: s - 11, width: 3.5, height: 11, rx: 1.2, 'class': 'bv-piel', 'data-pie': '' }, g);
    A.el('rect', { x: x + 1.5, y: s - 11, width: 3.5, height: 11, rx: 1.2, 'class': 'bv-piel', 'data-pie': '' }, g);
    A.el('path', { d: 'M' + (x - 7) + ' ' + (s - 27) + ' L' + (x + 7) + ' ' + (s - 27) + ' L' + (x + 10) + ' ' + (s - 10) + ' L' + (x - 10) + ' ' + (s - 10) + ' Z', 'class': 'bv-falda' }, g);
    A.el('rect', { x: x - 7.5, y: s - 41, width: 15, height: 16, rx: 4, 'class': 'bv-blusa' }, g);
    A.el('path', { d: 'M' + (x - 6.5) + ' ' + (s - 37) + ' L' + (x - 11) + ' ' + (s - 24), 'class': 'bv-brazo' }, g);
    A.el('path', { d: 'M' + (x + 6.5) + ' ' + (s - 37) + ' L' + (x + 11) + ' ' + (s - 24), 'class': 'bv-brazo' }, g);
    A.el('circle', { cx: c.x, cy: c.y, r: c.r, 'class': 'bv-piel', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 8) + ' ' + (c.y - 0.5) + ' Q' + (x - 7) + ' ' + (c.y - 9.5) + ' ' + x + ' ' + (c.y - 8.6) +
      ' Q' + (x + 7) + ' ' + (c.y - 9.5) + ' ' + (x + 8) + ' ' + (c.y - 0.5) + ' Q' + x + ' ' + (c.y - 4.5) + ' ' + (x - 8) + ' ' + (c.y - 0.5) + ' Z', 'class': 'bv-pelo' }, g);
    A.el('circle', { cx: x + 8.5, cy: c.y - 6, r: 3.6, 'class': 'bv-pelo' }, g);
    return g;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── la lista de Mi aula ── */
    var L = LISTA;
    P.lista = A.el('g', { 'data-lista': '' }, svg);
    A.el('rect', { x: L.x0, y: L.y0, width: L.x1 - L.x0, height: L.y1 - L.y0, rx: 6, 'class': 'bv-papel', 'data-lista-papel': '' }, P.lista);
    texto(A, P.lista, L.x, L.titulo, 'bv-tinta-suave', 9.5, 'start', 'Mi aula · lista').setAttribute('data-lista-titulo', '');
    A.el('rect', { x: L.x0 + 3, y: 128.5, width: L.x1 - L.x0 - 6, height: 17, rx: 3, 'class': 'bv-fila', 'data-fila-marca': '' }, P.lista);
    FILAS.forEach(function (f) {
      if (f[1]) { texto(A, P.lista, L.x, f[2], 'bv-tinta', TAM, 'start', f[0] + ' · ' + f[1], true).setAttribute('data-fila', f[0]); return; }
      P.fila = nombre(A, P.lista, L.x, f[2], f[0] + ' ·', true, 'lista');
      P.fila.g.setAttribute('data-fila', f[0]);
    });
    P.rotulo = {};
    [['una', 'escrito una vez'], ['corrige', 'corregido una vez']].forEach(function (r) {
      P.rotulo[r[0]] = texto(A, svg, ROTULO.x, ROTULO.y, 'am-rotulo', 10.5, 'middle', r[1]);
      P.rotulo[r[0]].setAttribute('data-rotulo', r[0]);
    });

    /* ── antes de contestar, el sitio de los sitios, vacío ── */
    P.hueco = A.el('g', { 'data-hueco': '' }, svg);
    A.el('rect', { x: SX0, y: SITIOS[0].y0, width: SX1 - SX0, height: SITIOS[3].y0 + ALTO_S - SITIOS[0].y0, rx: 6, 'class': 'am-hueco', 'data-hueco-caja': '' }, P.hueco);
    texto(A, P.hueco, (SX0 + SX1) / 2, 140, 'am-rotulo', 12, 'middle', '¿Dónde más sale?').setAttribute('data-hueco-txt', '');

    /* ── las flechas: de la fila de la lista a cada sitio ── */
    P.flecha = {}; P.corrige = {};
    SITIOS.forEach(function (s) { P.flecha[s.k] = flecha(A, svg, s, 'bv-flecha', 'data-flecha'); });
    SITIOS.filter(function (s) { return s.k !== 'tira'; }).forEach(function (s) { P.corrige[s.k] = flecha(A, svg, s, 'bv-corrige', 'data-corrige'); });

    /* ── los cuatro sitios ── */
    P.sitio = {};
    SITIOS.forEach(function (s) {
      var g = A.el('g', { 'data-sitio': s.k }, svg), y0 = s.y0, o = { g: g };
      A.el('rect', { x: SX0, y: y0, width: SX1 - SX0, height: ALTO_S, rx: s.papel ? 3 : 7,
        'class': s.k === 'tira' ? 'bv-tira' : s.papel ? 'bv-papel' : 'bv-pantalla', 'data-sitio-caja': '' }, g);
      if (s.k === 'boleta') A.el('path', { d: 'M' + (SX1 - 10) + ' ' + y0 + ' L' + SX1 + ' ' + (y0 + 10) + ' L' + (SX1 - 10) + ' ' + (y0 + 10) + ' Z', 'class': 'bv-doblez' }, g);
      texto(A, g, SX0 + 8, y0 + 15, 'bv-tinta-suave', 9.5, 'start', s.titulo).setAttribute('data-sitio-titulo', '');
      if (s.k === 'asistencia') {
        A.el('rect', { x: 174, y: y0 + 21, width: 70, height: 31, rx: 6, 'class': 'bv-chip', 'data-chip': '' }, g);
        texto(A, g, 180, y0 + 32, 'bv-tinta-suave', 8.5, 'start', '#' + NUM).setAttribute('data-num', '');
        o.n = nombre(A, g, 180, y0 + 45, null, false, s.k);
        o.marca = bien(A, g, 256, y0 + 40);
      } else if (s.k === 'notas') {
        A.el('rect', { x: 174, y: y0 + 22, width: 130, height: 26, rx: 2, 'class': 'bv-celda', 'data-fila-notas': '' }, g);
        [194, 282].forEach(function (x) { A.el('path', { d: 'M' + x + ' ' + (y0 + 22) + ' L' + x + ' ' + (y0 + 48), 'class': 'bv-reja' }, g); });
        texto(A, g, 179, y0 + 39, 'bv-tinta-suave', 8.5, 'start', '#' + NUM).setAttribute('data-num', '');
        o.n = nombre(A, g, 199, y0 + 39, null, false, s.k);
        o.marca = bien(A, g, 264, y0 + 35);
        texto(A, g, 293, y0 + 39, 'bv-tinta', 9.5, 'middle', '85');
      } else if (s.k === 'boleta') {
        /* la de antes y la que se imprime otra vez: cada una con su nombre */
        o.vieja = A.el('g', { 'data-version': 'vieja' }, g);
        texto(A, o.vieja, 174, y0 + 28, 'bv-tinta-suave', 8, 'start', 'Alumno(a)').setAttribute('data-etiqueta', '');
        o.n = nombre(A, o.vieja, 174, y0 + 42, null, true, s.k);
        o.tag = texto(A, o.vieja, SX1 - 8, y0 + 53, 'bv-tinta-suave', 8, 'end', 'entregada');
        o.tag.setAttribute('data-tag', 'entregada');
        o.nueva = A.el('g', { 'data-version': 'nueva' }, g);
        texto(A, o.nueva, 174, y0 + 28, 'bv-tinta-suave', 8, 'start', 'Alumno(a)').setAttribute('data-etiqueta', '');
        o.n2 = nombre(A, o.nueva, 174, y0 + 42, null, true, 'boleta-nueva', true);
        o.n2.falta.parentNode.removeChild(o.n2.falta);
        o.marca = bien(A, o.nueva, 258, y0 + 38);
        texto(A, o.nueva, SX1 - 8, y0 + 53, 'bv-tinta-suave', 8, 'end', 'otra vez').setAttribute('data-tag', 'otra vez');
      } else {
        o.n = nombre(A, g, 174, y0 + 31, '#' + NUM + ' ·', true, s.k);
        A.el('rect', { x: 174, y: y0 + 38, width: 64, height: 9, rx: 3, 'class': 'bv-tapada', 'data-tapada': '' }, g);
        o.tag = texto(A, g, SX1 - 8, y0 + 53, 'bv-tinta-suave', 8, 'end', 'entregada');
        o.tag.setAttribute('data-tag', 'entregada');
      }
      P.sitio[s.k] = o;
    });

    /* ── la mamá y lo que dice ── */
    P.mama = mama(A, svg);
    P.globo = globo(A, svg);

    /* ── el cuaderno del maestro: sale donde estaba la mamá ── */
    var C = CUADERNO;
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: 8, y: C.y0, width: 304, height: C.y1 - C.y0, rx: 6, 'class': 'bv-papel', 'data-cuaderno-papel': '' }, P.cuaderno);
    texto(A, P.cuaderno, 20, C.y0 + 19, 'bv-tinta', 11.5, 'start', 'Antes de imprimir, reviso estos nombres:').setAttribute('data-pide', '');
    A.el('path', { d: 'M20 ' + (C.y0 + 32) + ' L300 ' + (C.y0 + 32), 'class': 'bv-raya', 'data-raya': '' }, P.cuaderno);
    texto(A, P.cuaderno, 20, C.y0 + 52, 'bv-tinta', 11.5, 'start', 'Los confirmo con:').setAttribute('data-pide', '');
    A.el('path', { d: 'M124 ' + (C.y0 + 54) + ' L300 ' + (C.y0 + 54), 'class': 'bv-raya', 'data-raya': '' }, P.cuaderno);
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* Al TERMINAR cada paso: qué se ve, cómo dice el nombre la lista y cada
     pantalla, qué flechas llevan la corrección y cuál boleta está. */
  var ESTADOS = [
    { hueco: true, sitios: false, flechas: false, rotulo: null, falta: [], lista: false, pantallas: false, corrige: [], nueva: false, entregada: false, mama: false, globo: false, cuaderno: false },
    { hueco: false, sitios: true, flechas: true, rotulo: 'una', falta: [], lista: false, pantallas: false, corrige: [], nueva: false, entregada: false, mama: false, globo: false, cuaderno: false },
    { hueco: false, sitios: true, flechas: true, rotulo: 'una', falta: ['lista', 'asistencia', 'notas', 'boleta', 'tira'], lista: false, pantallas: false, corrige: [], nueva: false, entregada: false, mama: true, globo: true, cuaderno: false },
    { hueco: false, sitios: true, flechas: false, rotulo: 'corrige', falta: ['boleta', 'tira'], lista: true, pantallas: true, corrige: ['asistencia', 'notas'], nueva: false, entregada: true, mama: true, globo: false, cuaderno: false },
    { hueco: false, sitios: true, flechas: false, rotulo: 'corrige', falta: ['tira'], lista: true, pantallas: true, corrige: ['asistencia', 'notas', 'boleta'], nueva: true, entregada: true, mama: true, globo: false, cuaderno: false },
    { hueco: false, sitios: true, flechas: false, rotulo: 'corrige', falta: ['tira'], lista: true, pantallas: true, corrige: ['asistencia', 'notas', 'boleta'], nueva: true, entregada: true, mama: false, globo: false, cuaderno: true }
  ];

  function nombres() { return [P.fila, P.sitio.asistencia.n, P.sitio.notas.n, P.sitio.boleta.n, P.sitio.tira.n]; }
  function todo() {
    var l = [P.hueco, P.mama, P.globo, P.cuaderno, P.rotulo.una, P.rotulo.corrige, P.sitio.boleta.vieja, P.sitio.boleta.nueva, P.sitio.boleta.tag, P.sitio.tira.tag];
    nombres().forEach(function (o) { l.push(o.fSobre, o.resto, o.falta); });
    Object.keys(P.flecha).forEach(function (k) { l.push(P.flecha[k].linea, P.flecha[k].punta); });
    Object.keys(P.corrige).forEach(function (k) { l.push(P.corrige[k].linea, P.corrige[k].punta); });
    Object.keys(P.sitio).forEach(function (k) { l.push(P.sitio[k].g); if (P.sitio[k].marca) l.push(P.sitio[k].marca); });
    return l;
  }
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  /* la efe en su sitio (o arriba, escondida) y el resto corrido (o no) */
  function efe(A, o, si, d) {
    A.mover(o.fSobre, 0, si ? 0 : BAJA_F, 0, 1, d);
    A.ver(o.fSobre, si, d);
    A.mover(o.resto, si ? W_F : 0, 0, 0, 1, d);
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.ver(P.hueco, s.hueco, 0);
      A.ver(P.rotulo.una, s.rotulo === 'una', 0);
      A.ver(P.rotulo.corrige, s.rotulo === 'corrige', 0);
      SITIOS.forEach(function (x) {
        A.ver(P.sitio[x.k].g, s.sitios, 0);
        A.ver(P.flecha[x.k].linea, s.flechas, 0); A.trazar(P.flecha[x.k].linea, s.flechas, 0);
        A.ver(P.flecha[x.k].punta, s.flechas, 0);
        if (P.corrige[x.k]) {
          var c = s.corrige.indexOf(x.k) >= 0;
          A.ver(P.corrige[x.k].linea, c, 0); A.trazar(P.corrige[x.k].linea, c, 0);
          A.ver(P.corrige[x.k].punta, c, 0);
        }
      });
      efe(A, P.fila, s.lista, 0);
      ['asistencia', 'notas'].forEach(function (k) {
        efe(A, P.sitio[k].n, s.pantallas, 0);
        A.ver(P.sitio[k].marca, s.pantallas, 0);
      });
      efe(A, P.sitio.boleta.n, false, 0);
      efe(A, P.sitio.tira.n, false, 0);
      A.ver(P.fila.falta, s.falta.indexOf('lista') >= 0, 0);
      SITIOS.forEach(function (x) { A.ver(P.sitio[x.k].n.falta, s.falta.indexOf(x.k) >= 0, 0); });
      A.ver(P.sitio.boleta.vieja, !s.nueva, 0);
      A.ver(P.sitio.boleta.nueva, s.nueva, 0);
      A.ver(P.sitio.boleta.marca, s.nueva, 0);
      A.ver(P.sitio.boleta.tag, s.entregada, 0);
      A.ver(P.sitio.tira.tag, s.entregada, 0);
      A.ver(P.mama, s.mama, 0);
      A.ver(P.globo, s.globo, 0);
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo se cuentan cada vez que se ENTRA en ellos,
       también volviendo con «Atrás»; el 0 se pinta siempre. */
    if (n >= 1 && !entra(n)) return;
    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 1) {
      /* el nombre baja por cada flecha, una por una, y cada sitio aparece
         cuando su flecha llega */
      base(A, ESTADOS[0]);
      A.ver(P.hueco, false, T1.hueco);
      A.ver(P.rotulo.una, true, T1.rotulo);
      SITIOS.forEach(function (s, i) {
        var d = T1.flecha + T1.cada * i;
        A.ver(P.flecha[s.k].linea, true, d);
        A.trazar(P.flecha[s.k].linea, true, d);
        A.ver(P.flecha[s.k].punta, true, d + T1.dura);
        A.ver(P.sitio[s.k].g, true, d + T1.dura);
      });
      return;
    }
    if (n === 2) {
      /* la mamá lee la boleta; y la letra que falta, en la lista y en los
         cuatro */
      base(A, ESTADOS[1]);
      A.ver(P.mama, true, T2.mama);
      A.ver(P.globo, true, T2.globo);
      A.ver(P.fila.falta, true, T2.lista);
      SITIOS.forEach(function (s, i) { A.ver(P.sitio[s.k].n.falta, true, T2.sitio + T2.cada * i); });
      return;
    }
    if (n === 3) {
      /* Lo que ella decía se va primero. La efe entra en la lista; las
         flechas de antes se van y la corrección baja SOLO a las pantallas,
         que la pintan al llegar. Los papeles se quedan como estaban. */
      base(A, ESTADOS[2]);
      A.ver(P.globo, false, T3.sale);
      A.ver(P.fila.falta, false, T3.sale);
      A.ver(P.rotulo.una, false, T3.sale);
      SITIOS.forEach(function (s) { A.ver(P.flecha[s.k].linea, false, T3.sale); A.ver(P.flecha[s.k].punta, false, T3.sale); });
      efe(A, P.fila, true, T3.f);
      A.ver(P.rotulo.corrige, true, T3.rotulo);
      ['asistencia', 'notas'].forEach(function (k, i) {
        var d = T3.corrige + T3.cada * i, llega = d + T3.dura;
        A.ver(P.corrige[k].linea, true, d);
        A.trazar(P.corrige[k].linea, true, d);
        A.ver(P.corrige[k].punta, true, llega);
        A.ver(P.sitio[k].n.falta, false, llega);
        efe(A, P.sitio[k].n, true, llega);
        A.ver(P.sitio[k].marca, true, llega + T3.marca);
      });
      A.ver(P.sitio.boleta.tag, true, T3.entregada);
      A.ver(P.sitio.tira.tag, true, T3.entregada);
      return;
    }
    if (n === 4) {
      /* la boleta se imprime otra vez, de la lista corregida: la de antes
         se va y sale la nueva. La tira se queda como estaba. */
      base(A, ESTADOS[3]);
      var c = P.corrige.boleta, B = P.sitio.boleta;
      A.ver(c.linea, true, T4.flecha);
      A.trazar(c.linea, true, T4.flecha);
      A.ver(c.punta, true, T4.flecha + T4.dura);
      A.ver(B.vieja, false, T4.vieja);
      A.ver(B.nueva, true, T4.nueva);
      A.ver(B.marca, true, T4.marca);
      return;
    }
    /* el 5: el cuaderno, donde estaba la mamá */
    base(A, ESTADOS[4]);
    A.ver(P.mama, false, T5.sale);
    A.ver(P.cuaderno, true, T5.cuaderno);
  }

  var FRASES = [
    'Usted escribe el nombre de cada alumno una sola vez, en la lista de Mi aula. ¿Dónde más va a salir ese nombre?',
    'En cuatro sitios, sin volver a escribirlo: la asistencia, las notas, la boleta y la tira de la clave.',
    'En la reunión, la mamá lee la boleta: su hijo se llama ' + primero(BIEN) + ', con dos efes. Falta una efe en la lista, y por eso falta en los cuatro.',
    'Usted lo corrige una sola vez, en la lista. La asistencia y las notas se corrigen solas; la boleta y la tira ya estaban entregadas.',
    'Lo impreso no se corrige solo: la boleta se imprime y se entrega otra vez. La tira ya está en la casa, y sigue diciendo ' + primero(MAL) + '.',
    'Por eso la lista se revisa el primer día, antes de imprimir nada. Revise hoy la suya: nombres a medias, abreviados o sin tilde.'
  ];
  var BOTONES = ['🔀 ¿Dónde sale?', '👩 La reunión', '✏️ Corregirlo', '🖨️ Lo impreso', '📝 Ahora usted', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['?', 'sitios donde va a salir'],
    ['4', 'sitios, y se escribió una vez'],
    ['4', 'sitios con el mismo error'],
    ['2', 'de 4 se corrigieron solos'],
    ['+1', 'hoja, y otra entrega en mano'],
    ['?', 'nombres por revisar en su lista']
  ];

  AnimacionMision.montar('#amNombre', {
    vista: [ANCHO, ALTO],
    describe: 'La lista de Mi aula, con el nombre de ' + primero(BIEN) + ' escrito ' + primero(MAL) + '. ' +
      'El nombre sale solo en cuatro sitios: la asistencia, las notas, la boleta y la tira de la clave. ' +
      'La mamá ve el error en la boleta. Usted lo corrige una vez en la lista, y la asistencia y las notas se corrigen solas. ' +
      'La boleta hay que imprimirla otra vez, y la tira que ya está en la casa sigue mal escrita.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
