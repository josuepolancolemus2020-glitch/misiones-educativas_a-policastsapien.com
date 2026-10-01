/* ============================================================
   Animación de «El Himno Nacional de Honduras» (Ruta de la Patria)
   ------------------------------------------------------------
   La historia: en el examen le pidieron a Kenia escribir el coro, y lo
   escribió tal como lo canta desde primer grado: «Tu bandera, tu bandera
   es un lampo de cielo». Se lo marcaron mal. Tenía razón en lo que oyó:
   esa repetición la pide la música, no el poema.

   Lo que se dibuja: arriba, «lo que pide la música», con Kenia cantando;
   abajo, su examen. La repetición del primer verso se marca con su línea
   de recorte, se recorta y sube a la música, y el verso se cierra: queda
   escrito una sola vez. Después pasa lo mismo con los otros tres arranques
   que el coro repite al cantarse, y al final se cuentan las palabras que
   sobraban: las que se cantan y no se escriben.

   ⚠️ LA LETRA NO SE ESCRIBE AQUÍ: se saca de js/data/himno.js (HIMNO y
   HIMNO_CORO_CANTADO), que es el único original. La repetición tampoco se
   escribe: es lo que el verso cantado tiene de más que el escrito. Si un
   día se corrige una coma en himno.js, la animación la recoge sola.

   ⚠️ Lo que NO se enseña, y a propósito: los versos 2, 7 y 8 salen solo
   hasta su repetición («por un bloque…»). Enteros darían las respuestas del
   completar de la prueba (la nieve, la cima desnuda). Tampoco se nombra
   ninguna estrofa, ni cuántos versos tiene el coro, ni la medida del verso
   (la prueba pregunta por «enseñastes»), ni quién hizo la música o la letra.
   Entre el segundo verso y el séptimo va «· · ·»: ahí hay otros versos.

   ⚠️ El ancho de cada pedazo se sabe ANTES de que llegue la letra: sale de
   la tabla de avances de la Fredoka y se le impone al texto (textLength).
   Así el verso se cierra justo donde estaba la repetición, con la letra
   del sistema o con la nuestra, y la sonda puede medirlo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCoro')) return;
  if (typeof HIMNO === 'undefined' || typeof HIMNO_CORO_CANTADO === 'undefined') return;

  var ANCHO = 320, ALTO = 236;

  /* ── el texto: medido con la Fredoka 600 ───────────────────────
     Avance de cada letra por cada 100 px, medido en el navegador con la
     letra de la misión. Sin la letra cargada, el texto se estira o se
     encoge hasta este ancho; con ella, casi no se nota el ajuste. */
  var AV = {
    a: 56.3, b: 56.3, c: 50.5, d: 56.5, e: 53.7, f: 40.5, g: 55.2, h: 55.4, i: 24.2, j: 23.6, k: 50.4, l: 30.1, m: 80.3,
    n: 56.3, o: 55.9, p: 55.2, q: 55.1, r: 42.3, s: 45.8, t: 41.1, u: 56, v: 56.4, w: 74.6, x: 52.3, y: 55.9, z: 54,
    A: 70.9, B: 61.9, C: 64.3, D: 66.7, E: 61, F: 61.9, G: 71.5, H: 66.2, I: 23.2, J: 53.6, K: 59.5, L: 56.5, M: 81.4,
    N: 68.3, O: 72.5, P: 59.7, Q: 79.2, R: 61.1, S: 54.6, T: 64.8, U: 68.8, V: 72.7, W: 95.3, X: 69.1, Y: 63.8, Z: 59,
    'á': 56.3, 'é': 53.7, 'í': 22.5, 'ó': 55.9, 'ú': 56, 'ü': 56, 'ñ': 56.3, 'Á': 70.9, 'É': 61, 'Í': 23.2, 'Ó': 72.5,
    'Ú': 68.8, 'Ñ': 68.3, ' ': 24.1, ',': 22.4, '.': 21.7, ';': 21.8, ':': 22.5, '…': 73.9, '¡': 24.3, '!': 24.2
  };
  var TAM = 11.5;
  function ancho(t) {
    var s = 0;
    for (var i = 0; i < t.length; i++) s += AV[t.charAt(i)] != null ? AV[t.charAt(i)] : 55;
    return Math.round(s * TAM) / 100;
  }
  var ESPACIO = ancho(' ');

  /* ── el coro, de himno.js ──────────────────────────────────────
     Cada verso que al cantarse repite su arranque: el cantado es
     «arranque, arranque…resto», y el escrito, «arranque…resto». La
     repetición se busca, no se escribe: es el arranque que el cantado
     dice dos veces. */
  var CORO = HIMNO.filter(function (e) { return e.clave === 'coro'; })[0];
  function partir(cantado, escrito) {
    var palabras = escrito.split(' ');
    for (var k = 1; k < palabras.length; k++) {
      var a = palabras.slice(0, k).join(' ');
      var resto = escrito.slice(a.length);
      var b = a.charAt(0).toLowerCase() + a.slice(1);
      if (cantado === a + ', ' + b + resto) return { a: a, b: b, resto: resto.replace(/^ /, '') };
    }
    return null;
  }
  var VERSOS = [];
  CORO.versos.forEach(function (escrito, i) {
    var p = partir(HIMNO_CORO_CANTADO[i] || '', escrito);
    if (p) { p.i = i; VERSOS.push(p); }
  });
  if (VERSOS.length < 2) return;
  /* El primero va entero (es el de la historia); los otros, solo hasta su
     repetición, con «…»: el resto del verso es lo que pregunta el examen. */
  VERSOS.forEach(function (v, k) { v.resto = k === 0 ? v.resto : '…'; v.pegado = k > 0; });
  var PALABRAS_DE_MAS = VERSOS.reduce(function (s, v) { return s + v.b.split(' ').length; }, 0);

  /* ── el dibujo ─────────────────────────────────────────────── */
  var BANDA = { x: 6, y: 6, ancho: 308, alto: 82 };
  var PAPEL = { x: 6, y: 96, ancho: 308, alto: 134 };
  var MARGEN = 30, X0 = 38;
  /* el aire a cada lado de la repetición copiada, y el margen de su recorte */
  var HOLGURA = 6, PAD = 2.5;
  /* las filas del papel, y dónde va «· · ·» (entre el segundo y el resto) */
  var FILAS = [132, 154, 186, 208];
  var SEP = 170;
  /* donde caen los recortes en la música: dos filas de dos */
  var HUECOS = [[62, 50], [180, 50], [62, 74], [180, 74]];
  var KENIA = { x: 26, y: 46 };

  var T1 = { borde: 250, arco: 700, rotulo: 1400 };
  var T2 = { vuela: 150, coma: 500, cierra: 900, mal: 1500, bien: 1750 };
  var T3 = { fila: 250, paso: 450, sep: 300 };
  var T4 = { vuela: 150, paso: 450, coma: 350, cierra: 750, mal: 1300, bien: 1550 };
  var T5 = { insignia: 250, paso: 300 };

  var P = { filas: [] };

  function texto(A, padre, x, y, clase, tam, ancla, contenido, ajustar) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    if (ajustar && contenido.length > 1) {
      n.setAttribute('textLength', ancho(contenido));
      n.setAttribute('lengthAdjust', 'spacing');
    }
    return n;
  }

  /* Kenia, cantando: la boca abierta y una nota que le sale */
  function kenia(A, padre) {
    var g = A.el('g', { 'data-kenia': '' }, padre);
    var x = KENIA.x, y = KENIA.y;
    A.el('path', { d: 'M' + (x - 9) + ' ' + (y + 13) + ' L' + (x - 13) + ' ' + (y + 28), 'class': 'hc-brazo' }, g);
    A.el('path', { d: 'M' + (x + 9) + ' ' + (y + 13) + ' L' + (x + 13) + ' ' + (y + 28), 'class': 'hc-brazo' }, g);
    A.el('rect', { x: x - 10, y: y + 9, width: 20, height: BANDA.y + BANDA.alto - y - 11, rx: 4, 'class': 'hc-blusa' }, g);
    A.el('path', { d: 'M' + (x - 4) + ' ' + (y + 9.5) + ' L' + x + ' ' + (y + 14) + ' L' + (x + 4) + ' ' + (y + 9.5), 'class': 'hc-cuello' }, g);
    A.el('circle', { cx: x - 10.5, cy: y + 1, r: 3.2, 'class': 'hc-pelo' }, g);
    A.el('circle', { cx: x + 10.5, cy: y + 1, r: 3.2, 'class': 'hc-pelo' }, g);
    A.el('circle', { cx: x, cy: y, r: 8.5, 'class': 'hc-piel', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 8.5) + ' ' + (y - 1) + ' Q' + (x - 8) + ' ' + (y - 11) + ' ' + x + ' ' + (y - 10) +
      ' Q' + (x + 8) + ' ' + (y - 11) + ' ' + (x + 8.5) + ' ' + (y - 1) + ' Q' + x + ' ' + (y - 6) + ' ' + (x - 8.5) + ' ' + (y - 1) + ' Z', 'class': 'hc-pelo' }, g);
    A.el('circle', { cx: x - 3, cy: y - 0.5, r: 1.1, 'class': 'hc-ojo' }, g);
    A.el('circle', { cx: x + 3, cy: y - 0.5, r: 1.1, 'class': 'hc-ojo' }, g);
    A.el('ellipse', { cx: x, cy: y + 4, rx: 1.8, ry: 2.2, 'class': 'hc-boca' }, g);
    /* una nota de música: la cabeza y la plica */
    var nx = x + 15, ny = y - 4;
    A.el('ellipse', { cx: nx, cy: ny, rx: 2.4, ry: 1.8, transform: 'rotate(-20 ' + nx + ' ' + ny + ')', 'class': 'hc-nota' }, g);
    A.el('path', { d: 'M' + (nx + 2.1) + ' ' + (ny - 0.6) + ' L' + (nx + 2.1) + ' ' + (ny - 9) + ' Q' + (nx + 5.5) + ' ' + (ny - 6.5) + ' ' + (nx + 5) + ' ' + (ny - 3.5), 'class': 'hc-plica' }, g);
    return g;
  }

  /* La marca del maestro, en el margen: ✗ con dos rayas, ✓ con una */
  function marcas(A, padre, y) {
    var cx = 18, cy = y - 4;
    var mal = A.el('path', { d: 'M' + (cx - 4) + ' ' + (cy - 4) + ' L' + (cx + 4) + ' ' + (cy + 4) + ' M' + (cx + 4) + ' ' + (cy - 4) + ' L' + (cx - 4) + ' ' + (cy + 4),
      'class': 'hc-mal', 'data-marca': 'mal' }, padre);
    var bien = A.el('path', { d: 'M' + (cx - 5) + ' ' + cy + ' L' + (cx - 1.5) + ' ' + (cy + 4) + ' L' + (cx + 5) + ' ' + (cy - 5),
      'class': 'hc-bien', 'data-marca': 'bien' }, padre);
    return { mal: mal, bien: bien };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── la música ── */
    A.el('rect', { x: BANDA.x, y: BANDA.y, width: BANDA.ancho, height: BANDA.alto, rx: 10, 'class': 'hc-banda', 'data-banda': '' }, svg);
    texto(A, svg, 52, 21, 'am-rotulo', 10, 'start', '🎵 Lo que pide la música').setAttribute('data-rotulo', 'musica');
    kenia(A, svg);

    /* ── el examen ── */
    A.el('rect', { x: PAPEL.x, y: PAPEL.y, width: PAPEL.ancho, height: PAPEL.alto, rx: 4, 'class': 'hc-papel', 'data-papel': '' }, svg);
    FILAS.forEach(function (y) { A.el('path', { d: 'M' + (PAPEL.x + 4) + ' ' + (y + 4) + ' L' + (PAPEL.x + PAPEL.ancho - 4) + ' ' + (y + 4), 'class': 'hc-renglon' }, svg); });
    A.el('path', { d: 'M' + MARGEN + ' ' + (PAPEL.y + 2) + ' L' + MARGEN + ' ' + (PAPEL.y + PAPEL.alto - 2), 'class': 'hc-margen' }, svg);
    texto(A, svg, PAPEL.x + PAPEL.ancho - 6, PAPEL.y + 14, 'hc-nota-papel', 9.5, 'end', 'examen de Kenia').setAttribute('data-rotulo', 'papel');
    P.sep = texto(A, svg, X0 + 2, SEP, 'hc-sep', 11, 'start', '· · ·');
    P.sep.setAttribute('data-sep', '');

    /* ── cada verso: el arranque, la coma, la repetición y el resto ── */
    VERSOS.forEach(function (v, k) {
      var y = FILAS[k];
      var fila = A.el('g', { 'data-fila': k, 'data-verso': v.i }, svg);
      var wA = ancho(v.a), wC = ancho(','), wB = ancho(v.b);
      /* Copiado, la repetición lleva un poco más de aire a los lados que un
         espacio: ahí va su línea de recorte, y sin ese aire la raya se comía
         la coma de antes y los puntos de después. */
      var xComa = X0 + wA, xB = xComa + wC + HOLGURA, xResto = xB + wB + HOLGURA;
      var ta = texto(A, fila, X0, y, 'hc-letra', TAM, 'start', v.a, true);
      ta.setAttribute('data-pieza', 'arranque');
      var coma = texto(A, fila, xComa, y, 'hc-letra', TAM, 'start', ',');
      coma.setAttribute('data-pieza', 'coma');
      var corre = A.el('g', { 'data-corre': '' }, fila);
      var tr = texto(A, corre, xResto, y, 'hc-letra', TAM, 'start', v.resto, true);
      tr.setAttribute('data-pieza', 'resto');
      var m = marcas(A, fila, y);

      /* la repetición es un recorte de papel: sube a la música */
      var vuela = A.el('g', { 'data-recorte': k }, svg);
      var ve = A.el('g', {}, vuela);
      /* El recorte acaba ANTES del renglón (y + 4): si lo tapara, la raya del
         cuaderno se cortaba debajo de la repetición desde el primer paso. */
      A.el('rect', { x: xB - PAD, y: y - 11, width: wB + 2 * PAD, height: 14, rx: 3, 'class': 'hc-recorte' }, ve);
      var borde = A.el('rect', { x: xB - PAD, y: y - 11, width: wB + 2 * PAD, height: 14, rx: 3, 'class': 'hc-corte', 'data-corte': '' }, ve);
      var tb = texto(A, ve, xB, y, 'hc-letra', TAM, 'start', v.b, true);
      tb.setAttribute('data-pieza', 'repeticion');

      var h = HUECOS[k];
      P.filas.push({
        fila: fila, coma: coma, corre: corre, mal: m.mal, bien: m.bien, vuela: vuela, ve: ve, borde: borde,
        /* escrito, el resto se pega al arranque: con un espacio si sigue
           el verso, y sin él si son los puntos */
        cierra: X0 + wA + (v.pegado ? 0 : ESPACIO) - xResto,
        sube: [h[0] + PAD - xB, h[1] - y]
      });

      /* cuántas palabras de más trae: va en la música, junto al recorte */
      var ins = A.el('g', { 'data-insignia': k }, svg);
      var ix = h[0] + wB + 2 * PAD + 10, iy = h[1] - 4;
      A.el('circle', { cx: ix, cy: iy, r: 7, 'class': 'hc-insignia' }, ins);
      texto(A, ins, ix, iy + 3.6, 'hc-insignia-num', 10, 'middle', String(v.b.split(' ').length)).setAttribute('data-palabras', v.b.split(' ').length);
      P.filas[k].insignia = ins;
    });

    /* «otra vez»: del primer arranque a su repetición, debajo del verso */
    var v0 = VERSOS[0];
    var ax = X0 + ancho(v0.a) / 2, bx = X0 + ancho(v0.a) + ancho(',') + HOLGURA + ancho(v0.b) / 2, ay = FILAS[0] + 6;
    var mx = (ax + bx) / 2, my = ay + 15;
    P.arco = A.el('g', { 'data-arco': '' }, svg);
    P.arcoTrazo = A.el('path', { d: 'M' + r2(ax) + ' ' + ay + ' Q' + r2(mx) + ' ' + my + ' ' + r2(bx) + ' ' + ay, 'class': 'hc-arco', 'data-arco-trazo': '' }, P.arco);
    /* la punta, a lo largo de la curva al llegar: dos rayas a 30° */
    var tx = bx - mx, ty = ay - my, tl = Math.hypot(tx, ty);
    tx /= tl; ty /= tl;
    var punta = [30, -30].map(function (g) {
      var a = g * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
      return [r2(bx - 6 * (tx * c - ty * s)), r2(ay - 6 * (tx * s + ty * c))];
    });
    A.el('path', { d: 'M' + punta[0][0] + ' ' + punta[0][1] + ' L' + r2(bx) + ' ' + ay + ' L' + punta[1][0] + ' ' + punta[1][1], 'class': 'hc-arco', 'data-arco-punta': '' }, P.arco);
    texto(A, P.arco, r2(mx), ay + 19, 'hc-nota-papel', 9.5, 'middle', 'otra vez').setAttribute('data-arco-txt', '');
  }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* ── los estados ───────────────────────────────────────────── */
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function todo() {
    var l = [P.sep, P.arco, P.arcoTrazo];
    P.filas.forEach(function (f) { l.push(f.fila, f.coma, f.corre, f.mal, f.bien, f.vuela, f.ve, f.borde, f.insignia); });
    return l;
  }

  /* El estado al TERMINAR cada paso: cuántos versos se ven, cuántos ya
     están escritos bien (la repetición en la música), si se ve la línea de
     recorte, si está el «otra vez» y si se cuentan las palabras. */
  var ESTADOS = [
    { filas: 1, bien: 0, corte: 0, arco: false, cuenta: false },
    { filas: 1, bien: 0, corte: 1, arco: true, cuenta: false },
    { filas: 1, bien: 1, corte: 1, arco: false, cuenta: false },
    { filas: 4, bien: 1, corte: 4, arco: false, cuenta: false },
    { filas: 4, bien: 4, corte: 4, arco: false, cuenta: false },
    { filas: 4, bien: 4, corte: 4, arco: false, cuenta: true }
  ];

  function ponFila(A, k, s, d) {
    var f = P.filas[k], ve = k < s.filas, bien = k < s.bien;
    A.ver(f.fila, ve, d);
    A.ver(f.ve, ve, d);
    A.ver(f.borde, k < s.corte, d);
    A.ver(f.coma, !bien, d);
    A.mover(f.corre, bien ? f.cierra : 0, 0, 0, 1, d);
    A.mover(f.vuela, bien ? f.sube[0] : 0, bien ? f.sube[1] : 0, 0, 1, d);
    A.ver(f.mal, ve && !bien, d);
    A.ver(f.bien, ve && bien, d);
    A.ver(f.insignia, s.cuenta && k < s.filas, d);
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      P.filas.forEach(function (f, k) { ponFila(A, k, s, 0); });
      A.ver(P.sep, s.filas > 2, 0);
      A.ver(P.arco, s.arco, 0);
      A.trazar(P.arcoTrazo, s.arco, 0);
    });
  }
  /* El verso k se escribe bien: el recorte sube a la música, la coma se
     va y el resto del verso se cierra donde estaba la repetición. */
  function escribir(A, k, t, d0) {
    var f = P.filas[k];
    A.mover(f.vuela, f.sube[0], f.sube[1], 0, 1, d0 + t.vuela);
    A.ver(f.coma, false, d0 + t.coma);
    A.mover(f.corre, f.cierra, 0, 0, 1, d0 + t.cierra);
    A.ver(f.mal, false, d0 + t.mal);
    A.ver(f.bien, true, d0 + t.bien);
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo se cuentan cada vez que se ENTRA en ellos,
       también volviendo con «Atrás»; el 0 se pinta siempre. */
    if (n >= 1 && !entra(n)) return;
    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 1) {
      base(A, ESTADOS[0]);
      A.ver(P.filas[0].borde, true, T1.borde);
      A.ver(P.arco, true, T1.arco);
      A.trazar(P.arcoTrazo, true, T1.arco);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      A.ver(P.arco, false, 0);
      escribir(A, 0, T2, 0);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      for (var k = 1; k < P.filas.length; k++) {
        var d = T3.fila + (k - 1) * T3.paso, f = P.filas[k];
        A.ver(f.fila, true, d);
        A.ver(f.ve, true, d);
        A.ver(f.borde, true, d);
        A.ver(f.mal, true, d);
      }
      A.ver(P.sep, true, T3.fila + T3.paso + T3.sep);
      return;
    }
    if (n === 4) {
      base(A, ESTADOS[3]);
      for (var j = 1; j < P.filas.length; j++) escribir(A, j, T4, (j - 1) * T4.paso);
      return;
    }
    base(A, ESTADOS[4]);
    P.filas.forEach(function (f, i) { A.ver(f.insignia, true, T5.insignia + i * T5.paso); });
  }

  var R1 = VERSOS[0].b;
  var FRASES = [
    'Así copió Kenia el primer verso del coro, igual que lo canta cada lunes. Se lo marcaron mal. Antes de tocar, piensa: ¿qué le sobra?',
    'Al cantar, «' + R1 + '» suena dos veces seguidas. La segunda vez no es del poema: la pide la música.',
    'En el examen, el verso va una sola vez: la repetición y su coma se quedan en la música. Cantarlo así sigue estando bien.',
    'Y no es el único: al cantar, otros ' + (VERSOS.length - 1 === 3 ? 'tres' : String(VERSOS.length - 1)) + ' versos del coro repiten su arranque. Kenia los copió igual.',
    'En el examen, cada arranque va una sola vez. Las repeticiones se quedan en la música: ahí sí se cantan.',
    'Copiado como se canta, a Kenia le sobraban ' + PALABRAS_DE_MAS + ' palabras. Canta el coro bajito y levanta un dedo cada vez que repitas un arranque.'
  ];
  var BOTONES = ['🎤 Cantarlo', '✍️ Escribirlo', '🔎 ¿Hay más?', '✍️ Escribirlos', '🔢 Contar', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['2', 'veces dice «' + R1 + '» su verso'],
    ['2', 'veces suena «' + R1 + '» al cantar'],
    ['1', 'vez en el examen'],
    [String(VERSOS.length), 'arranques que se repiten al cantar'],
    [String(VERSOS.length), 'repeticiones en la música, ninguna en el examen'],
    [String(PALABRAS_DE_MAS), 'palabras que se cantan y no se escriben']
  ];

  AnimacionMision.montar('#amCoro', {
    vista: [ANCHO, ALTO],
    describe: 'Arriba, lo que pide la música, con Kenia cantando; abajo, su examen. El primer verso del coro está copiado como se canta, con la repetición. La repetición se recorta y sube a la música, y el verso queda escrito una sola vez. Lo mismo pasa con otros arranques del coro, y al final se cuentan las palabras que sobraban.',
    pasos: 6,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
