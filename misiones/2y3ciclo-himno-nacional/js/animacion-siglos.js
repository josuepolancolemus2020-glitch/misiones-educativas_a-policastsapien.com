/* ============================================================
   Animación de «El Himno Nacional de Honduras» · la película del Himno
   ------------------------------------------------------------
   La misión lo dice con estas palabras: «las seis primeras cuentan la
   historia en orden, como una película». Esta escena es esa película: los
   siete cuadros arriba, en su orden, y abajo la línea de los años. De cada
   cuadro baja un hilo al año en que pasa lo que cuenta:

     0  los siete cuadros y la línea vacía: ¿en qué año pasa cada uno?;
     1  la primera y la segunda caen en el MISMO año, 1502: cuentan la misma
        llegada;
     2  la tercera, hacia 1537: Lempira;
     3  la cuarta no cae en un año: es una cadena que va de 1502 a 1821. Tres
        veces cien años, y sobran diecinueve;
     4  la quinta salta al otro lado del Atlante: 1789, y su rugido;
     5  la sexta, en 1821: la cadena se rompe y un pájaro negro se va;
     6  la séptima no tiene hilo: no cuenta el pasado, promete.

   Lo que asombra se ve sin decirlo: los seis cuadros están a la misma
   distancia uno del otro, y sus hilos NO. Tres se amontonan al principio,
   dos al final, y en medio caben trescientos años que cuenta uno solo.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Los años no se escriben aquí**: salen del campo `cuando` de cada
      estrofa en js/data/himno.js, y verifica-himno comprueba que cada año
      siga escrito en la explicación o en el dato de su estrofa. Si los
      años dejan de cuadrar (la colonia no termina el año de la
      Independencia, o la segunda no cae con la primera), la escena NO se
      monta y queda la frase de reserva.
   2. **Lo que no se sabe con exactitud se dice**: Lempira es «hacia 1537»,
      y su punto en la línea va hueco.
   3. ⚠️ **La letra no se cita**: lo que dice cada cuadro lo dice la frase
      con palabras de la explicación («un pájaro negro»), no con versos.
      verifica-himno busca en este archivo cualquier tirada de cuatro
      palabras del Himno y se pone roja si la encuentra.
   4. **La película es un objeto**: la cinta, los cuadros y la cadena son del
      mismo color en las dos pantallas; la línea de los años y lo que va
      escrito sobre la tarjeta llevan la tinta de la pantalla.
   5. **Nada se dice solo con color**: cada cuadro lleva su número, cada año
      va escrito y los siglos llevan su llave y su cuenta.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amSiglos')) return;
  if (typeof HIMNO === 'undefined') return;

  var ANCHO = 320, ALTO = 150;
  var EST = HIMNO.filter(function (e) { return /^e\d$/.test(e.clave); });
  if (EST.length !== 7) return;
  function de(c) { return EST.filter(function (e) { return e.clave === c; })[0]; }

  /* ⚠️ Los años, de himno.js, y que cuadren entre sí. */
  var C = {}; EST.forEach(function (e) { C[e.clave] = e.cuando; });
  var bien = EST.slice(0, 6).every(function (e) { return e.cuando && typeof e.cuando.anio === 'number'; }) &&
    C.e7 === null && C.e2.comoLa === 'e1' && C.e2.anio === C.e1.anio &&
    typeof C.e4.hasta === 'number' && C.e4.anio === C.e1.anio && C.e6.anio === C.e4.hasta &&
    C.e3.hacia === true && C.e5.lejos === true &&
    C.e1.anio < C.e3.anio && C.e3.anio < C.e5.anio && C.e5.anio < C.e6.anio;
  if (!bien) return;
  var SIGLOS = Math.floor((C.e4.hasta - C.e4.anio) / 100);
  var SOBRAN = C.e4.hasta - C.e4.anio - SIGLOS * 100;
  if (SIGLOS < 1) return;

  /* ── La línea de los años ── */
  var A0 = C.e1.anio - 7, A1 = C.e6.anio + 9;
  var X0 = 14, X1 = 306, Y_EJE = 108, Y_CADENA = 100;
  function xa(anio) { return X0 + (anio - A0) * (X1 - X0) / (A1 - A0); }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* ── La cinta: siete cuadros a la misma distancia ── */
  var CUADRO = { w: 34, h: 28, y: 9 }, PASO = 42, X_PRIMERO = 34;
  function xc(k) { return X_PRIMERO + k * PASO; }
  var ICONO = ['⛵', '🚩', '🏹', null, '🦁', null, '✋'];

  var P = { cuadros: [], aros: [], hilos: {}, puntos: {}, anios: {}, eslabones: [], llaves: [] };

  function texto(A, padre, x, y, clase, tam, ancla, contenido, extra) {
    var a = { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'middle' };
    for (var k in extra) a[k] = extra[k];
    var n = A.el('text', a, padre);
    n.textContent = contenido;
    return n;
  }
  /* Un eslabón: de frente (óvalo ancho) o de canto (raya corta), uno y uno. */
  function eslabon(A, padre, x, y, deCanto, clase) {
    return deCanto
      ? A.el('path', { d: 'M' + r2(x - 2.4) + ' ' + y + ' L' + r2(x + 2.4) + ' ' + y, 'class': clase + ' vs-canto' }, padre)
      : A.el('ellipse', { cx: r2(x), cy: y, rx: 3.3, ry: 2, 'class': clase }, padre);
  }
  /* El dibujo de la cadena dentro de un cuadro: tres eslabones, o rota. */
  function cadenita(A, padre, rota) {
    if (!rota) {
      eslabon(A, padre, -6, 0, false, 'vs-eslabon-mini');
      eslabon(A, padre, 0, 0, true, 'vs-eslabon-mini');
      eslabon(A, padre, 6, 0, false, 'vs-eslabon-mini');
    } else {
      eslabon(A, padre, -7, 1.5, false, 'vs-eslabon-mini');
      A.el('path', { d: 'M-2.5 -1.6 Q-0.6 -2.6 -0.2 0.2', 'class': 'vs-eslabon-mini vs-roto' }, padre);
      A.el('path', { d: 'M1.6 -1 Q2.2 1.8 4 1.8', 'class': 'vs-eslabon-mini vs-roto' }, padre);
      eslabon(A, padre, 8, -1.5, false, 'vs-eslabon-mini');
    }
  }

  function construir(svg, A) {
    /* la cinta */
    A.el('rect', { x: 8, y: 2, width: 304, height: 42, rx: 3, 'class': 'vs-cinta' }, svg);
    var agujeros = [];
    for (var hx = 13; hx < 310; hx += 8) {
      agujeros.push('M' + hx + ' 4.2 h3.4 v2.4 h-3.4 Z M' + hx + ' 39.4 h3.4 v2.4 h-3.4 Z');
    }
    A.el('path', { d: agujeros.join(' '), 'class': 'vs-agujero' }, svg);

    EST.forEach(function (e, k) {
      var g = A.el('g', { 'data-cuadro': k + 1 }, svg);
      g.setAttribute('transform', 'translate(' + xc(k) + ' ' + (CUADRO.y + CUADRO.h / 2) + ')');
      A.el('rect', { x: -CUADRO.w / 2, y: -CUADRO.h / 2, width: CUADRO.w, height: CUADRO.h, rx: 2, 'class': 'vs-cuadro' }, g);
      texto(A, g, -CUADRO.w / 2 + 3, -CUADRO.h / 2 + 8, 'vs-num', 8, 'start', String(k + 1));
      var dib = A.el('g', { 'data-icono': '' }, g);
      if (ICONO[k]) texto(A, dib, 2, 6.5, 'vs-emoji', 14, 'middle', ICONO[k]);
      else { dib.setAttribute('transform', 'translate(2 2) scale(1.3)'); cadenita(A, dib, k === 5); }
      /* el aro del cuadro que se cuenta ahora */
      P.aros.push(A.el('rect', { x: -CUADRO.w / 2 - 2, y: -CUADRO.h / 2 - 2, width: CUADRO.w + 4, height: CUADRO.h + 4, rx: 3.5,
        'class': 'vs-aro', 'data-aro': k + 1 }, g));
      P.cuadros.push(g);
    });

    /* la línea de los años, con una rayita por siglo y la flecha de lo que viene */
    var marcas = [];
    for (var s = Math.ceil(A0 / 100) * 100; s <= A1; s += 100) marcas.push('M' + r2(xa(s)) + ' ' + (Y_EJE - 2.5) + ' v5');
    A.el('path', { d: 'M' + X0 + ' ' + Y_EJE + ' L' + (X1 + 6) + ' ' + Y_EJE + ' ' + marcas.join(' '), 'class': 'vs-eje', 'data-eje': '' }, svg);
    A.el('path', { d: 'M' + (X1 + 2) + ' ' + (Y_EJE - 3) + ' L' + (X1 + 7) + ' ' + Y_EJE + ' L' + (X1 + 2) + ' ' + (Y_EJE + 3), 'class': 'vs-eje' }, svg);

    /* la cadena de la colonia, de su primer año al último */
    var cad = A.el('g', { 'data-cadena': '' }, svg);
    var x = xa(C.e4.anio), xf = xa(C.e4.hasta), i = 0;
    while (x <= xf - 2.4) {
      P.eslabones.push(eslabon(A, cad, x + 3.2, Y_CADENA, i % 2 === 1, 'vs-eslabon'));
      x += 5.4; i++;
    }
    /* el último eslabón, el que se rompe: dos mitades que se separan */
    P.rotoA = A.el('path', { d: 'M' + r2(xf - 3.4) + ' ' + (Y_CADENA - 2) + ' Q' + r2(xf - 0.6) + ' ' + (Y_CADENA - 2.6) + ' ' + r2(xf) + ' ' + Y_CADENA, 'class': 'vs-eslabon vs-roto', 'data-roto': 'a' }, svg);
    P.rotoB = A.el('path', { d: 'M' + r2(xf) + ' ' + Y_CADENA + ' Q' + r2(xf - 0.6) + ' ' + (Y_CADENA + 2.6) + ' ' + r2(xf - 3.4) + ' ' + (Y_CADENA + 2), 'class': 'vs-eslabon vs-roto', 'data-roto': 'b' }, svg);

    /* las llaves de los siglos, debajo de los años */
    for (var q = 0; q < SIGLOS; q++) {
      var a0 = C.e4.anio + q * 100, a1 = a0 + 100;
      var gl = A.el('g', { 'data-llave': q + 1, 'data-desde': a0, 'data-hasta': a1 }, svg);
      A.el('path', { d: 'M' + r2(xa(a0) + 0.8) + ' 125 v4 H' + r2(xa(a1) - 0.8) + ' v-4', 'class': 'vs-llave' }, gl);
      texto(A, gl, (xa(a0) + xa(a1)) / 2, 139, 'vs-rotulo', 7.5, 'middle', '100 años');
      P.llaves.push(gl);
    }
    var gs = P.sobran = A.el('g', { 'data-llave': 'sobran', 'data-desde': C.e4.anio + SIGLOS * 100, 'data-hasta': C.e4.hasta }, svg);
    A.el('path', { d: 'M' + r2(xa(C.e4.anio + SIGLOS * 100) + 0.8) + ' 125 v4 H' + r2(xa(C.e4.hasta) - 0.8) + ' v-4', 'class': 'vs-llave vs-llave-sobra' }, gs);
    texto(A, gs, (xa(C.e4.anio + SIGLOS * 100) + xa(C.e4.hasta)) / 2, 139, 'vs-rotulo', 7.5, 'middle', '+' + SOBRAN);

    /* los hilos: de cada cuadro a su año (la cuarta, al medio de su cadena) */
    EST.slice(0, 6).forEach(function (e, k) {
      var c = e.cuando, dx, dy;
      if (c.hasta) { dx = (xa(c.anio) + xa(c.hasta)) / 2; dy = Y_CADENA - 2.5; }
      else { dx = xa(c.anio); dy = Y_EJE; }
      P.hilos[e.clave] = A.el('path', { d: 'M' + xc(k) + ' ' + (CUADRO.y + CUADRO.h + 1) + ' L' + r2(dx) + ' ' + r2(dy),
        'class': 'vs-hilo', 'data-hilo': k + 1, 'data-anio': c.hasta ? '' : c.anio }, svg);
    });

    /* los años: un punto en la línea y su nombre debajo (uno por año) */
    [C.e1.anio, C.e3.anio, C.e5.anio, C.e6.anio].forEach(function (anio) {
      var hueco = anio === C.e3.anio;
      P.puntos[anio] = A.el('circle', { cx: r2(xa(anio)), cy: Y_EJE, r: 2.4, 'class': 'vs-punto' + (hueco ? ' vs-punto-hueco' : ''), 'data-punto': anio }, svg);
      var ga = P.anios[anio] = A.el('g', { 'data-ficha-anio': anio }, svg);
      A.el('rect', { x: r2(xa(anio) - 10.5), y: 111.5, width: 21, height: 9.5, rx: 4.75, 'class': 'vs-ficha' }, ga);
      texto(A, ga, xa(anio), 119, 'vs-ficha-txt', 7, 'middle', String(anio));
    });

    /* el rugido del León: tres arcos que salen hacia acá */
    var x5 = xa(C.e5.anio);
    P.rugido = A.el('g', { 'data-rugido': '' }, svg);
    P.ondas = [0, 1, 2].map(function (k) {
      var r = 5 + k * 4.5;
      return A.el('path', { d: 'M' + r2(x5 - 8 - r * 0.45) + ' ' + r2(88 - r) + ' Q' + r2(x5 - 8 - r * 1.25) + ' 88 ' + r2(x5 - 8 - r * 0.45) + ' ' + r2(88 + r * 0.6),
        'class': 'vs-onda', 'data-onda': k + 1 }, P.rugido);
    });

    /* el pájaro negro: sale de la punta rota de la cadena, sube, y se
       pierde detrás de los montes (la explicación de la sexta lo dice así:
       «escondiéndose detrás de las montañas boscosas»). Dos tramos, cada
       uno en su envoltura: una pieza tiene una sola demora. Los montes van
       DESPUÉS en el documento, para que el pájaro pase por detrás. */
    var xb = xa(C.e6.anio);
    P.ave = A.el('g', { 'data-ave': '' }, svg);
    P.ave.setAttribute('transform', 'translate(' + r2(xb + 1) + ' ' + (Y_CADENA - 6) + ')');
    P.aveSube = A.el('g', {}, P.ave);
    P.aveVuela = A.el('g', {}, P.aveSube);
    P.aveSeVa = A.el('g', {}, P.aveVuela);
    A.el('path', { d: 'M-7 -2 Q-3.6 -5 0 0 Q3.6 -5 7 -2 Q3.4 -1.6 0 2.2 Q-3.4 -1.6 -7 -2 Z', 'class': 'vs-ave' }, P.aveSeVa);
    P.montes = A.el('path', { d: 'M296 93 L301 80 L305 84 L311 70 L316 79 L320 75 L320 93 Z', 'class': 'vs-monte', 'data-montes': '' }, svg);

    /* la séptima: un aro y lo que hace */
    P.promete = A.el('g', { 'data-promete': '' }, svg);
    texto(A, P.promete, xc(6), 53, 'vs-rotulo vs-rotulo-fuerte', 8.5, 'middle', 'promete');
  }

  /* ── Los estados ───────────────────────────────────────────── */
  /* Al TERMINAR cada paso: qué hilos se ven, si está la cadena, etc. */
  var ESTADOS = [
    { hilos: [], cadena: false, rugido: false, rota: false, aro: [], promete: false },
    { hilos: ['e1', 'e2'], cadena: false, rugido: false, rota: false, aro: [0, 1], promete: false },
    { hilos: ['e1', 'e2', 'e3'], cadena: false, rugido: false, rota: false, aro: [2], promete: false },
    { hilos: ['e1', 'e2', 'e3', 'e4'], cadena: true, rugido: false, rota: false, aro: [3], promete: false },
    { hilos: ['e1', 'e2', 'e3', 'e4', 'e5'], cadena: true, rugido: true, rota: false, aro: [4], promete: false },
    { hilos: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'], cadena: true, rugido: false, rota: true, aro: [5], promete: false },
    { hilos: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6'], cadena: true, rugido: false, rota: true, aro: [6], promete: true }
  ];
  function tiene(E, c) { return E.hilos.indexOf(c) >= 0; }
  /* Qué años se ven: el de cada hilo que cae en un año, y los dos extremos de
     la cadena cuando está. */
  function aniosDe(E) {
    var v = {};
    E.hilos.forEach(function (c) { if (!C[c].hasta) v[C[c].anio] = true; });
    if (E.cadena) { v[C.e4.anio] = true; v[C.e4.hasta] = true; }
    return v;
  }

  function base(A, E) {
    var yaQuieto = A.quieto();
    if (!yaQuieto) A.svg.classList.add('am-quieto');
    EST.slice(0, 6).forEach(function (e) { A.trazar(P.hilos[e.clave], tiene(E, e.clave), 0); A.ver(P.hilos[e.clave], tiene(E, e.clave), 0); });
    var v = aniosDe(E);
    Object.keys(P.puntos).forEach(function (a) { A.ver(P.puntos[a], !!v[a], 0); A.ver(P.anios[a], !!v[a], 0); });
    P.eslabones.forEach(function (n) { A.ver(n, E.cadena, 0); });
    P.llaves.forEach(function (n) { A.ver(n, E.cadena, 0); });
    A.ver(P.sobran, E.cadena, 0);
    A.ver(P.rotoA, E.cadena, 0); A.ver(P.rotoB, E.cadena, 0);
    A.mover(P.rotoA, E.rota ? 4 : 0, E.rota ? -3.6 : 0, E.rota ? -40 : 0, 1, 0);
    A.mover(P.rotoB, E.rota ? 5.5 : 0, E.rota ? 3.8 : 0, E.rota ? 35 : 0, 1, 0);
    A.ver(P.rugido, E.rugido, 0);
    P.ondas.forEach(function (o) { A.ver(o, E.rugido, 0); A.mover(o, 0, 0, 0, 1, 0); });
    A.ver(P.ave, false, 0); A.mover(P.aveSube, 0, 0, 0, 1, 0); A.mover(P.aveVuela, 0, 0, 0, 1, 0); A.ver(P.aveSeVa, true, 0);
    A.ver(P.montes, E.rota, 0);
    P.aros.forEach(function (n, k) { A.ver(n, E.aro.indexOf(k) >= 0, 0); });
    A.ver(P.promete, E.promete, 0);
    A.asentar();
    if (!yaQuieto) A.svg.classList.remove('am-quieto');
  }
  /* Un hilo que baja ahora: se enciende el aro de su cuadro, se dibuja el
     hilo y, al llegar, sale el año. */
  function baja(A, c, d) {
    A.ver(P.hilos[c], true, d);
    A.trazar(P.hilos[c], true, d);
    if (!C[c].hasta) {
      A.ver(P.puntos[C[c].anio], true, d + 700);
      A.ver(P.anios[C[c].anio], true, d + 800);
    }
    return d + 900;
  }

  function pintar(n, antes, A) {
    var E = ESTADOS[n];
    /* Cada paso se cuenta cada vez que se ENTRA en él, también volviendo
       con «Atrás»; el primer pintado solo pone cada cosa en su sitio. */
    if (n === antes || n === 0) { base(A, E); return; }
    base(A, ESTADOS[n - 1]);
    P.aros.forEach(function (a, k) { A.ver(a, E.aro.indexOf(k) >= 0, 150); });
    if (n === 1) { baja(A, 'e1', 300); baja(A, 'e2', 700); return; }
    if (n === 2) { baja(A, 'e3', 300); return; }
    if (n === 3) {
      /* la cadena crece de su primer año al último, y después los siglos */
      A.ver(P.puntos[C.e4.anio], true, 200);
      P.eslabones.forEach(function (e, k) { A.ver(e, true, 300 + k * 26); });
      var tf = 300 + P.eslabones.length * 26;
      A.ver(P.rotoA, true, tf); A.ver(P.rotoB, true, tf);
      A.ver(P.puntos[C.e4.hasta], true, tf + 100);
      A.ver(P.anios[C.e4.hasta], true, tf + 200);
      var tb = baja(A, 'e4', tf + 300);
      P.llaves.forEach(function (l, k) { A.ver(l, true, tb + k * 450); });
      A.ver(P.sobran, true, tb + P.llaves.length * 450);
      return;
    }
    if (n === 4) {
      var t4 = baja(A, 'e5', 300);
      A.ver(P.rugido, true, t4);
      P.ondas.forEach(function (o, k) {
        A.mover(o, -3, 0, 0, 0.6, 0);
        A.ver(o, false, 0);
        A.ver(o, true, t4 + k * 300);
        A.mover(o, 0, 0, 0, 1, t4 + k * 300);
      });
      return;
    }
    if (n === 5) {
      A.ver(P.rugido, false, 0);
      var t5 = baja(A, 'e6', 300);
      A.mover(P.rotoA, 4, -3.6, -40, 1, t5);
      A.mover(P.rotoB, 5.5, 3.8, 35, 1, t5);
      /* el pájaro sale de la punta rota y se pierde de vista */
      A.ver(P.montes, true, t5);
      A.ver(P.ave, true, t5 + 300);
      A.mover(P.aveSube, -4, -14, 0, 1, t5 + 600);
      A.mover(P.aveVuela, 16, -1, 0, 0.8, t5 + 1400);
      A.ver(P.aveSeVa, false, t5 + 1900);
      return;
    }
    /* n === 6 */
    A.ver(P.promete, true, 700);
  }

  var Y1 = C.e1.anio, Y3 = C.e3.anio, Y5 = C.e5.anio, Y6 = C.e6.anio;
  var FRASES = [
    'Las seis primeras estrofas cuentan la historia en orden, como una película. Aquí están los siete cuadros. ¿En qué año pasa cada uno?',
    'La primera y la segunda cuentan la misma llegada: Colón, en ' + Y1 + '. Por eso las dos caen en el mismo año.',
    'La tercera, hacia ' + Y3 + ': Lempira dirige la resistencia contra la conquista, y cae.',
    'La cuarta no cuenta un momento: cuenta la colonia, de ' + C.e4.anio + ' a ' + C.e4.hasta + '. Tres veces cien años, y sobran ' + SOBRAN + '.',
    'La quinta salta al otro lado del Atlante: la Revolución Francesa, en ' + Y5 + '. Sus ideas de libertad llegaron hasta acá.',
    'La sexta, en ' + Y6 + ': la Independencia. La cadena se rompe, y la colonia se va como un pájaro negro.',
    'Seis estrofas cuentan de dónde venimos. La séptima no tiene año: promete. Por eso es la que se canta en los actos.'
  ];
  var BOTONES = ['⛵ Las dos primeras', '🏹 La tercera', '⛓️ La cuarta', '🦁 La quinta', '🕊️ La sexta', '✋ La séptima', '↺ Empezar otra vez'];
  var MARCADOR = [
    { cifra: '7', palabras: 'estrofas: siete cuadros de una película' },
    { cifra: String(Y1), palabras: 'la primera y la segunda: la misma llegada' },
    { cifra: String(Y3), palabras: 'hacia ese año: Lempira' },
    { cifra: String(SIGLOS), palabras: 'siglos en una sola estrofa: la colonia' },
    { cifra: String(Y5), palabras: 'del otro lado del Atlante' },
    { cifra: String(Y6), palabras: 'la Independencia: la cadena rota' },
    { cifra: '6', palabras: 'estrofas cuentan el pasado; la séptima promete' }
  ];

  AnimacionMision.montar('#amSiglos', {
    vista: [ANCHO, ALTO],
    describe: 'Una cinta de película con los siete cuadros del Himno, y debajo una línea de años. La primera y la segunda caen en ' + Y1 +
      '; la tercera, hacia ' + Y3 + '; la cuarta es una cadena de ' + C.e4.anio + ' a ' + C.e4.hasta + ', tres siglos; la quinta, en ' + Y5 +
      '; la sexta, en ' + Y6 + ', cuando la cadena se rompe. La séptima no tiene año: promete.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return MARCADOR[n]; }
  });
})();
