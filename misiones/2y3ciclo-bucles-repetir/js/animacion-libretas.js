/* ============================================================
   M.E.T.A.S · Bucles: Repetir sin Cansarse · El aviso en 43 libretas
   ------------------------------------------------------------
   La escena de la animación que va después de la historia: el maestro
   tenía que dejar el mismo aviso en las 43 libretas de su grado, empezó
   en el recreo, desde la libreta 31 lo escribió más corto y con otra
   letra, en tres se saltó la fecha, y se le fue el recreo. La historia
   dice que escribir lo mismo muchas veces cansa, se tarda y sale
   distinto, y que la otra forma es escribirlo UNA vez y decir cuántas
   veces va. Eso es lo que se ve aquí. El aparato (botones, frase,
   marcador) vive en js/animacion-mision.js; aquí solo está el dibujo y
   dónde va cada pieza en cada paso.

   Arriba, el aviso escrito en su tarjeta, el reloj del recreo y el lugar
   del robot; abajo, las 43 libretas, de diez en diez, con el número de
   la primera de cada fila.

     0  el aviso, las 43 libretas en blanco y el recreo entero: ¿saldrá
        igual en todas?;
     1  el lápiz lo copia a mano, libreta por libreta: las primeras 30
        salen iguales al aviso, y el recreo se va;
     2  desde la 31 sale más corto y con otra letra, y en tres falta la
        fecha. Se acabó el recreo;
     3  otra forma, desde el principio: el aviso se queda escrito una sola
        vez, en su tarjeta, y al lado dice «43 veces»;
     4  el robot copia la tarjeta en cada libreta, de la 1 a la 43: todas
        iguales y todas con fecha, y el recreo sigue entero;
     5  y la pregunta es del alumno: algo que hace muchas veces igual,
        escrito una vez y al lado el número de veces.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que dice el marcador se cuenta en las libretas.** Cada una
      lleva su copia en miniatura: la del aviso (el título, la fecha y
      tres renglones derechos, cada uno del largo del suyo en la tarjeta)
      o la que sale apurada (dos renglones más cortos y torcidos). La
      sonda mide cada renglón contra el ancho de la letra de la tarjeta y
      cuenta cuántas salen iguales, cuántas distintas y cuántas sin fecha.
   2. ⚠️ **La fecha que falta se ve faltar**: donde iba, una ✗ dentro de
      un círculo, no solo otro color. Y cae en tres de las trece que salen
      apuradas: «las primeras 30 salen iguales» sigue siendo verdad.
   3. **El reloj del recreo cuenta libretas escritas a mano.** Cada una
      se lleva lo mismo: con 30, va en 30 de 43; con las 43, se acabó. Y
      se mueve MIENTRAS el lápiz escribe, no después. Con la tarjeta, el
      maestro no copia ninguna: el reloj se queda entero mientras copia
      el robot.
   4. **Cada libreta se llena cuando llega quien la escribe**: el lápiz o
      el robot pasan de libreta en libreta a paso parejo, fila por fila,
      y la sonda calcula dónde está cada uno en el momento en que se llena
      cada libreta.
   5. ⚠️ **Lo que pregunta la prueba no se dice.** La animación no nombra
      el bucle, ni la vuelta, ni el cuerpo, ni la N, ni ninguna palabra del
      robot de la misión (AVANZA, GIRA, REPETIR): el maestro escribe «43
      veces» como lo escribe cualquiera. El nombre de lo que se ve lo da
      la tarjeta de abajo.
   6. **Cada paso que cuenta una historia la cuenta cada vez que se entra
      en él**, también volviendo con «Atrás»: el lápiz o el robot vuelven
      a empezar y las libretas se vuelven a llenar.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amLibretas')) return;

  var ANCHO = 320, ALTO = 272;

  /* ── las libretas ───────────────────────────────────────── */
  var TOTAL = 43, POR_FILA = 10;
  var X0 = 22, PASO_X = 29.4, Y0 = 103, PASO_Y = 34;
  var LW = 26, LH = 31;          // el tamaño de una libreta
  var IGUALES = 30;              // las que salen iguales a mano
  var SIN_FECHA = [34, 38, 42];  // en tres de las apuradas falta la fecha

  /* ── la tarjeta del aviso ───────────────────────────────── */
  var TARJETA = { x: 6, y: 8, w: 104, h: 74 };
  var T_IZQ = 12, T_DER = 104;   // donde empieza y acaba lo escrito
  var AVISO = {
    titulo: 'Aviso',
    fecha: '30/9',
    renglones: ['Mañana hay reunión', 'de madres y padres', 'en la escuela.']
  };
  /* Lo que mide cada cosa escrita en la tarjeta, con la letra de la
     misión (Fredoka), medido en el navegador. La copia de la libreta es
     la tarjeta en chico: cada renglón, del largo del suyo. */
  var ANCHO_TXT = { titulo: 24.3, fecha: 19.5, renglones: [82.4, 78.7, 55] };

  /* ── el reloj y el robot ───────────────────────────────── */
  var RELOJ = { x: 206, y: 42, r: 25 };
  var CASA_ROBOT = { x: 289, y: 88 };
  var ESC_CASA = 1.25, ESC_ROBOT = 0.72;   // en su lugar arriba, y copiando

  /* ── el tiempo ─────────────────────────────────────────── */
  var POR_LIBRETA = 80;          // de una libreta a la de al lado
  var SALTO_FILA = 280;          // de la última de una fila a la primera de la otra

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }

  /* Dónde está la libreta k (1 … 43): su esquina de arriba a la izquierda. */
  function lugar(k) {
    var i = k - 1, fila = Math.floor(i / POR_FILA), col = i % POR_FILA;
    return { x: X0 + col * PASO_X, y: Y0 + fila * PASO_Y, fila: fila, col: col };
  }

  /* La copia en chico de la tarjeta: la tarjeta tiene su letra entre T_IZQ
     y T_DER; en la libreta, entre 7 y 24. Cada renglón mide lo mismo, a
     esa escala, que el suyo en la tarjeta. */
  var C_IZQ = 7, C_DER = 24;
  var ESCALA = (C_DER - C_IZQ) / (T_DER - T_IZQ);
  var C_Y = { titulo: 6.8, renglones: [14, 19.6, 25.2] };

  function copiaIgual(A, padre) {
    var g = A.el('g', { 'data-copia': 'igual' }, padre);
    A.el('path', { d: 'M' + C_IZQ + ' ' + C_Y.titulo + ' H' + r2(C_IZQ + ANCHO_TXT.titulo * ESCALA),
      'class': 'bl-tinta bl-titulo', 'data-parte': 'titulo' }, g);
    A.el('path', { d: 'M' + r2(C_DER - ANCHO_TXT.fecha * ESCALA) + ' ' + C_Y.titulo + ' H' + C_DER,
      'class': 'bl-tinta bl-fecha', 'data-parte': 'fecha' }, g);
    ANCHO_TXT.renglones.forEach(function (w, i) {
      A.el('path', { d: 'M' + C_IZQ + ' ' + C_Y.renglones[i] + ' H' + r2(C_IZQ + w * ESCALA),
        'class': 'bl-tinta', 'data-parte': 'renglon' }, g);
    });
    return g;
  }

  /* Un renglón torcido, del largo que se le pida: la letra apurada. */
  function torcido(x, y, largo) {
    var d = 'M' + x + ' ' + y, paso = 1.7, n = Math.max(2, Math.round(largo / paso)), s = largo / n;
    for (var j = 0; j < n; j++) d += ' l' + r2(s) + ' ' + (j % 2 ? 1.1 : -1.1);
    return d;
  }

  /* La que sale apurada: el título, la fecha (o su falta) y dos renglones
     más cortos que cualquiera de la tarjeta, con otra letra. */
  var APURADA = [9.4, 6.2];
  function copiaDistinta(A, padre, sinFecha) {
    var g = A.el('g', { 'data-copia': 'distinta' }, padre);
    A.el('path', { d: torcido(C_IZQ, C_Y.titulo, ANCHO_TXT.titulo * ESCALA * 0.9), 'class': 'bl-tinta bl-titulo-apurado',
      'data-parte': 'titulo' }, g);
    if (sinFecha) {
      var fx = r2(C_DER - ANCHO_TXT.fecha * ESCALA / 2), fy = C_Y.titulo;
      var falta = A.el('g', { 'data-falta': 'fecha' }, g);
      A.el('circle', { cx: fx, cy: fy, r: 3.6, 'class': 'bl-falta' }, falta);
      A.el('path', { d: 'M' + r2(fx - 1.8) + ' ' + r2(fy - 1.8) + ' l3.6 3.6 M' + r2(fx + 1.8) + ' ' + r2(fy - 1.8) + ' l-3.6 3.6',
        'class': 'bl-falta-x', 'data-equis': '' }, falta);
    } else {
      A.el('path', { d: 'M' + r2(C_DER - ANCHO_TXT.fecha * ESCALA) + ' ' + C_Y.titulo + ' H' + C_DER,
        'class': 'bl-tinta bl-fecha', 'data-parte': 'fecha' }, g);
    }
    APURADA.forEach(function (largo, i) {
      A.el('path', { d: torcido(C_IZQ, C_Y.renglones[i], largo), 'class': 'bl-tinta', 'data-parte': 'renglon' }, g);
    });
    return g;
  }

  function r2(v) { return Math.round(v * 100) / 100; }

  /* Una libreta: la hoja, el lomo, y sus dos copias posibles (apagadas). */
  function libreta(A, padre, k) {
    var l = lugar(k);
    var g = A.el('g', { 'data-libreta': k, transform: 'translate(' + r2(l.x) + ' ' + l.y + ')' }, padre);
    A.el('rect', { x: 0, y: 0, width: LW, height: LH, rx: 2, 'class': 'bl-hoja' }, g);
    A.el('rect', { x: 0, y: 0, width: 4, height: LH, rx: 1.5, 'class': 'bl-lomo' }, g);
    var igual = copiaIgual(A, g);
    var distinta = k > IGUALES ? copiaDistinta(A, g, SIN_FECHA.indexOf(k) >= 0) : null;
    return { g: g, igual: igual, distinta: distinta, x: l.x, y: l.y };
  }

  /* El lápiz, con la punta en (0, 0) y el cuerpo hacia arriba a la
     derecha. */
  function lapiz(A, padre) {
    var g = A.el('g', { 'data-lapiz': '' }, padre);
    var cuerpo = A.el('g', { transform: 'rotate(-45)' }, g);
    A.el('path', { d: 'M0 0 L4.6 -2.4 L4.6 2.4 Z', 'class': 'bl-lapiz-punta' }, cuerpo);
    A.el('path', { d: 'M0 0 L1.8 -0.95 L1.8 0.95 Z', 'class': 'bl-lapiz-mina' }, cuerpo);
    A.el('rect', { x: 4.6, y: -2.4, width: 13, height: 4.8, 'class': 'bl-lapiz' }, cuerpo);
    A.el('rect', { x: 17.6, y: -2.4, width: 3.2, height: 4.8, rx: 1.2, 'class': 'bl-lapiz-goma' }, cuerpo);
    return g;
  }

  /* El robot de la misión, visto de lado: ruedas, cuerpo, cabeza y
     antena, con los pies en (0, 0). */
  function robot(A, padre) {
    var g = A.el('g', { 'data-robot': '' }, padre);
    A.el('circle', { cx: -4.4, cy: -2.8, r: 2.8, 'class': 'bl-rueda' }, g);
    A.el('circle', { cx: 4.4, cy: -2.8, r: 2.8, 'class': 'bl-rueda' }, g);
    A.el('rect', { x: -7.5, y: -17, width: 15, height: 12, rx: 2.6, 'class': 'bl-robot' }, g);
    A.el('rect', { x: -6, y: -27, width: 12, height: 9, rx: 2.2, 'class': 'bl-robot' }, g);
    A.el('circle', { cx: -2.4, cy: -22.5, r: 1.4, 'class': 'bl-ojo' }, g);
    A.el('circle', { cx: 2.4, cy: -22.5, r: 1.4, 'class': 'bl-ojo' }, g);
    A.el('path', { d: 'M0 -27 V-31', 'class': 'bl-antena' }, g);
    A.el('circle', { cx: 0, cy: -32.5, r: 1.7, 'class': 'bl-antena-bola' }, g);
    return g;
  }

  /* ── el camino de quien escribe (el lápiz o el robot) ─────
     Va por tramos, uno dentro del otro: hasta la primera libreta, a lo
     largo de cada fila y de la última de una fila a la primera de la otra.
     Cada tramo se mueve a paso parejo y empieza cuando acabó el anterior.
     El punto que escribe, en cada libreta, es PUNTO (relativo a la
     esquina de la libreta). */
  function tramos(A, padre, n, dato) {
    var lista = [], p = padre;
    for (var i = 0; i < n; i++) {
      p = A.el('g', { 'class': 'bl-tramo', 'data-tramo': i + 1, 'data-quien': dato }, p);
      lista.push(p);
    }
    return lista;
  }

  /* El recorrido de una libreta a otra, fila por fila: devuelve los
     tramos [dx, dy, dur] y cuándo llega a cada libreta. */
  function recorrido(desde, hasta, primero) {
    var t = [], llega = {}, reloj = 0;
    if (primero) {
      t.push(primero);
      reloj += primero[2];
    }
    for (var k = desde; k <= hasta; k++) {
      llega[k] = reloj;
      if (k === hasta) break;
      var a = lugar(k), b = lugar(k + 1);
      if (a.fila === b.fila) {
        /* se junta la fila entera en un solo tramo */
        var fin = k;
        while (fin < hasta && lugar(fin + 1).fila === a.fila) fin++;
        var dur = (fin - k) * POR_LIBRETA;
        t.push([lugar(fin).x - a.x, 0, dur]);
        for (var j = k + 1; j <= fin; j++) llega[j] = reloj + (j - k) * POR_LIBRETA;
        reloj += dur;
        k = fin - 1;
      } else {
        t.push([b.x - a.x, b.y - a.y, SALTO_FILA]);
        reloj += SALTO_FILA;
      }
    }
    return { tramos: t, llega: llega, dura: reloj };
  }

  /* El lápiz: de la libreta 1 a la 30 (paso 1) y de la 31 a la 43
     (paso 2). Al acabar cada paso se aparta a donde ya no tapa nada
     escrito: la 31, que está en blanco, y el hueco que sigue a la 43. */
  var PUNTA = { x: 15, y: 19 };
  var R1 = recorrido(1, IGUALES, null);
  R1.tramos.push([lugar(IGUALES + 1).x - lugar(IGUALES).x, lugar(IGUALES + 1).y - lugar(IGUALES).y, SALTO_FILA]);
  var R2 = recorrido(IGUALES + 1, TOTAL, null);
  R2.tramos.push([PASO_X, 0, POR_LIBRETA * 2]);

  /* El robot: de su lugar arriba a la libreta 1, y de ahí a la 43; al
     acabar se baja al hueco que sigue a la 43. Se para con los pies en el
     borde de abajo de la libreta, en medio. */
  var PIE = { x: LW / 2, y: LH - 1 };
  var LLEGA_ROBOT = 700;
  var R4 = recorrido(1, TOTAL, [lugar(1).x + PIE.x - CASA_ROBOT.x, lugar(1).y + PIE.y - CASA_ROBOT.y, LLEGA_ROBOT]);
  R4.tramos.push([PASO_X, 0, POR_LIBRETA * 2]);

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── la tarjeta del aviso ─────────────────────────────── */
    P.tarjeta = A.el('g', { 'data-tarjeta': '' }, svg);
    A.el('rect', { x: TARJETA.x, y: TARJETA.y, width: TARJETA.w, height: TARJETA.h, rx: 4, 'class': 'bl-aviso' }, P.tarjeta);
    P.titulo = texto(A, P.tarjeta, T_IZQ, 24, 'bl-aviso-tit', 10, 'start', AVISO.titulo);
    P.titulo.setAttribute('data-escrito', 'titulo');
    P.fecha = texto(A, P.tarjeta, T_DER, 24, 'bl-aviso-fecha', 9, 'end', AVISO.fecha);
    P.fecha.setAttribute('data-escrito', 'fecha');
    A.el('path', { d: 'M' + T_IZQ + ' 30 H' + T_DER, 'class': 'bl-aviso-raya' }, P.tarjeta);
    P.renglones = AVISO.renglones.map(function (r, i) {
      var t = texto(A, P.tarjeta, T_IZQ, 43 + i * 14, 'bl-aviso-txt', 9, 'start', r);
      t.setAttribute('data-escrito', 'renglon');
      return t;
    });

    /* ── «43 veces», al lado de la tarjeta ───────────────── */
    P.veces = A.el('g', { 'data-veces': '' }, svg);
    A.el('path', { d: 'M110 47 H119', 'class': 'bl-veces-union' }, P.veces);
    A.el('rect', { x: 119, y: 35, width: 52, height: 24, rx: 4, 'class': 'bl-veces' }, P.veces);
    P.vecesTxt = texto(A, P.veces, 145, 51, 'bl-veces-txt', 10.5, 'middle', TOTAL + ' veces');

    /* ── el reloj del recreo ──────────────────────────────── */
    var reloj = A.el('g', { 'data-reloj': '' }, svg);
    A.el('circle', { cx: RELOJ.x, cy: RELOJ.y, r: RELOJ.r, 'class': 'bl-reloj' }, reloj);
    /* lo que ya se fue del recreo: un trazo del ancho del radio, que se
       dibuja desde las doce en el sentido de las agujas */
    var ru = RELOJ.r / 2;
    P.uso = A.el('circle', { cx: RELOJ.x, cy: RELOJ.y, r: ru, 'class': 'bl-uso', 'stroke-width': RELOJ.r,
      transform: 'rotate(-90 ' + RELOJ.x + ' ' + RELOJ.y + ')', 'data-uso': '' }, reloj);
    P.largoUso = 2 * Math.PI * ru;
    P.uso.style.strokeDasharray = r2(P.largoUso) + ' ' + r2(P.largoUso);
    P.uso.style.strokeDashoffset = String(r2(P.largoUso));
    for (var h = 0; h < 12; h++) {
      var a = h * Math.PI / 6, c = Math.cos(a), s = Math.sin(a), r0 = RELOJ.r - (h % 3 ? 3 : 5);
      A.el('path', { d: 'M' + r2(RELOJ.x + s * r0) + ' ' + r2(RELOJ.y - c * r0) + ' L' + r2(RELOJ.x + s * RELOJ.r) + ' ' + r2(RELOJ.y - c * RELOJ.r),
        'class': 'bl-reloj-marca' }, reloj);
    }
    A.el('circle', { cx: RELOJ.x, cy: RELOJ.y, r: RELOJ.r, 'class': 'bl-reloj-borde' }, reloj);
    P.rotReloj = texto(A, svg, RELOJ.x, RELOJ.y + RELOJ.r + 13, 'am-rotulo', 9.5, 'middle', 'recreo');
    P.rotReloj.setAttribute('data-rotulo', 'recreo');

    /* ── las libretas ─────────────────────────────────────── */
    P.filas = [];
    for (var f = 0; f * POR_FILA < TOTAL; f++) {
      var rot = texto(A, svg, 18, Y0 + f * PASO_Y + 19, 'am-rotulo', 9, 'end', String(f * POR_FILA + 1));
      rot.setAttribute('data-fila', f + 1);
      P.filas.push(rot);
    }
    P.grilla = A.el('g', { 'data-libretas': '' }, svg);
    P.libretas = [];
    for (var k = 1; k <= TOTAL; k++) P.libretas.push(libreta(A, P.grilla, k));

    /* ── el lápiz ─────────────────────────────────────────── */
    P.lapizVe = A.el('g', { 'data-lapiz-ve': '' }, svg);
    var base = A.el('g', { 'data-lapiz-base': '', transform: 'translate(' + r2(lugar(1).x + PUNTA.x) + ' ' + (lugar(1).y + PUNTA.y) + ')' }, P.lapizVe);
    P.lapiz1 = tramos(A, base, R1.tramos.length, 'lapiz-1');
    P.lapiz2 = tramos(A, P.lapiz1[P.lapiz1.length - 1], R2.tramos.length, 'lapiz-2');
    lapiz(A, P.lapiz2[P.lapiz2.length - 1]);

    /* ── el robot ─────────────────────────────────────────── */
    P.robotVe = A.el('g', { 'data-robot-ve': '' }, svg);
    var rb = A.el('g', { 'data-robot-base': '', transform: 'translate(' + CASA_ROBOT.x + ' ' + CASA_ROBOT.y + ')' }, P.robotVe);
    P.robotT = tramos(A, rb, R4.tramos.length, 'robot');
    P.robotEsc = A.el('g', { 'data-robot-esc': '' }, P.robotT[P.robotT.length - 1]);
    robot(A, P.robotEsc);

    /* ── lo que se marca al final ────────────────────────── */
    P.aroTarjeta = A.el('rect', { x: TARJETA.x - 3.5, y: TARJETA.y - 3.5, width: TARJETA.w + 7, height: TARJETA.h + 7, rx: 7,
      'class': 'bl-aro', 'data-aro': 'tarjeta' }, svg);
    P.aroVeces = A.el('rect', { x: 115.5, y: 31.5, width: 59, height: 31, rx: 7, 'class': 'bl-aro', 'data-aro': 'veces' }, svg);
    P.rotUnaVez = texto(A, svg, TARJETA.x + TARJETA.w / 2, 97, 'am-rotulo', 9.5, 'middle', 'escrito una vez');
    P.rotUnaVez.setAttribute('data-rotulo', 'una vez');
  }

  /* ── dónde va cada pieza ────────────────────────────────── */

  function mueve(A, g, dx, dy, d, dur) {
    g.style.setProperty('--dur', Math.round(dur) + 'ms');
    A.mover(g, dx, dy, 0, 1, d);
  }
  function quietos(A, lista) { lista.forEach(function (g) { mueve(A, g, 0, 0, 0, 0); }); }
  function hasta(A, lista, rec, d0, cuantos) {
    var t = d0;
    lista.forEach(function (g, i) {
      var v = rec.tramos[i];
      if (i < cuantos) { mueve(A, g, v[0], v[1], t, v[2]); t += v[2]; }
      else mueve(A, g, 0, 0, 0, 0);
    });
  }
  function alFinal(A, lista, rec) {
    lista.forEach(function (g, i) { var v = rec.tramos[i]; mueve(A, g, v[0], v[1], 0, 0); });
  }

  /* De golpe, sin movimiento: así la escena se vuelve a ver entera cada
     vez que se entra en su paso, también volviendo con «Atrás». */
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  /* Cómo está cada libreta: en blanco, igual al aviso o apurada. */
  function libretas(A, estado, demora) {
    P.libretas.forEach(function (l, i) {
      var k = i + 1, e = estado(k), d = demora ? demora(k) : 0;
      A.ver(l.igual, e === 'igual', e === 'igual' ? d : 0);
      if (l.distinta) A.ver(l.distinta, e === 'distinta', e === 'distinta' ? d : 0);
    });
  }
  function enBlanco() { return null; }
  function aMano(hastaK) {
    return function (k) { return k > hastaK ? null : (k <= IGUALES ? 'igual' : 'distinta'); };
  }
  function todasIguales() { return 'igual'; }

  /* El reloj: lo que va del recreo, en libretas escritas a mano. */
  function reloj(A, libretasAMano, d, dur) {
    var f = libretasAMano / TOTAL;
    P.uso.style.setProperty('--dur', Math.round(dur || 0) + 'ms');
    P.uso.style.setProperty('--d', Math.round(d || 0) + 'ms');
    P.uso.style.strokeDashoffset = String(r2(P.largoUso * (1 - f)));
    P.uso.setAttribute('data-libretas', libretasAMano);
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    var lapices = P.lapiz1.concat(P.lapiz2);

    A.ver(P.lapizVe, n === 1 || n === 2, 0);
    A.ver(P.robotVe, n >= 3, n >= 3 && antes < 3 ? 500 : 0);
    A.ver(P.veces, n >= 3, n >= 3 && antes < 3 ? 400 : 0);
    A.ver(P.aroTarjeta, n === 5, n === 5 ? 200 : 0);
    A.ver(P.aroVeces, n === 5, n === 5 ? 450 : 0);
    A.ver(P.rotUnaVez, n === 5, n === 5 ? 200 : 0);

    if (n === 0) {
      deGolpe(A, lapices.concat(P.robotT, [P.robotEsc]), function () {
        quietos(A, lapices); quietos(A, P.robotT);
        A.mover(P.robotEsc, 0, 0, 0, ESC_CASA, 0);
      });
      libretas(A, enBlanco);
      reloj(A, 0, 0, 500);
      return;
    }

    if (n === 1) {
      /* A mano, desde la primera, cada vez que se entra. */
      if (entra(1)) {
        deGolpe(A, lapices.concat([P.grilla, P.uso]), function () {
          quietos(A, lapices);
          libretas(A, enBlanco);
          reloj(A, 0, 0, 0);
        });
        var d1 = 300;
        hasta(A, P.lapiz1, R1, d1, R1.tramos.length);
        libretas(A, aMano(IGUALES), function (k) { return d1 + R1.llega[k]; });
        reloj(A, IGUALES, d1, R1.llega[IGUALES] + POR_LIBRETA);
      }
      return;
    }

    if (n === 2) {
      if (entra(2)) {
        /* sigue donde quedó el lápiz: las 30 escritas y el recreo en 30 */
        deGolpe(A, lapices.concat([P.grilla, P.uso]), function () {
          alFinal(A, P.lapiz1, R1);
          quietos(A, P.lapiz2);
          libretas(A, aMano(IGUALES));
          reloj(A, IGUALES, 0, 0);
        });
        var d2 = 300;
        hasta(A, P.lapiz2, R2, d2, R2.tramos.length);
        libretas(A, aMano(TOTAL), function (k) { return k > IGUALES ? d2 + R2.llega[k] : 0; });
        reloj(A, TOTAL, d2, R2.llega[TOTAL] + POR_LIBRETA);
      }
      return;
    }

    /* 3, 4 y 5: la tarjeta con «43 veces» */
    if (entra(3)) {
      deGolpe(A, P.robotT.concat([P.robotEsc]), function () {
        quietos(A, P.robotT);
        A.mover(P.robotEsc, 0, 0, 0, ESC_CASA, 0);
      });
      /* desde el principio: libretas nuevas y el recreo entero */
      libretas(A, enBlanco);
      reloj(A, 0, 0, antes < 3 ? 600 : 0);
      return;
    }

    if (n === 4) {
      if (entra(4)) {
        deGolpe(A, P.robotT.concat([P.robotEsc, P.grilla, P.uso]), function () {
          quietos(A, P.robotT);
          A.mover(P.robotEsc, 0, 0, 0, ESC_CASA, 0);
          libretas(A, enBlanco);
          reloj(A, 0, 0, 0);
        });
        var d4 = 300;
        hasta(A, P.robotT, R4, d4, R4.tramos.length);
        A.mover(P.robotEsc, 0, 0, 0, ESC_ROBOT, d4);
        libretas(A, todasIguales, function (k) { return d4 + R4.llega[k]; });
      }
      return;
    }

    /* 5: todo copiado, y se marca lo que se escribió */
    if (antes !== 4) {
      deGolpe(A, P.robotT.concat([P.robotEsc, P.grilla]), function () {
        alFinal(A, P.robotT, R4);
        A.mover(P.robotEsc, 0, 0, 0, ESC_ROBOT, 0);
        libretas(A, todasIguales);
      });
    }
  }

  var FRASES = [
    'El maestro tiene que dejar este aviso en las 43 libretas, y tiene el recreo. ¿Saldrá igual en todas?',
    'Lo escribe a mano, libreta por libreta, entero cada vez. Las primeras 30 salen iguales al aviso, y el recreo se va.',
    'Desde la 31 le sale más corto y con otra letra, y en tres se salta la fecha. Se acabó el recreo.',
    'Otra forma, desde el principio: el aviso se queda escrito una sola vez, en su tarjeta, y el maestro le pone al lado «43 veces».',
    'El robot copia la tarjeta en cada libreta, de la 1 a la 43: todas iguales y todas con fecha. Y el recreo sigue entero.',
    'Escrito una vez, sale igual todas las veces. ¿Qué haces tú muchas veces igual? Escríbelo una vez en tu cuaderno y, al lado, el número de veces.'
  ];
  var BOTONES = ['✍️ A mano', '✍️ Las que faltan', '🗂️ Otra forma', '🤖 Que copie el robot', '📝 Tu turno', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['0', 'libretas con el aviso'],
    ['30', 'iguales al aviso'],
    ['13', 'distintas, y 3 sin fecha'],
    ['1', 'vez escrito: la tarjeta'],
    ['43', 'iguales al aviso, todas con fecha'],
    ['43', 'de 43 iguales, escrito una vez']
  ];

  AnimacionMision.montar('#amLibretas', {
    vista: [ANCHO, ALTO],
    describe: 'Arriba, un aviso escrito en una tarjeta y el reloj del recreo; abajo, 43 libretas en filas, que se llenan con el aviso.',
    pasos: 6,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
