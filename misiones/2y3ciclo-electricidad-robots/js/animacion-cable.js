/* ============================================================
   Animación de «Electricidad para Robots» (Ruta de los Robots, etapa 4)
   ------------------------------------------------------------
   La historia: la víspera de la feria el robot del grupo dejó de
   encender. Cambiaron la pila, el motor y otra vez la pila. Nada. Era un
   cable suelto del tamaño de una uña, en un punto donde nadie miró, y se
   les fue la tarde y el dinero de dos pilas buenas.

   Lo que se dibuja: el robot por dentro, con su pila, su motor y el
   camino de cables que va de la pila a la pila, con seis uniones. La
   corriente son los puntitos que van por el camino. Con el cable suelto
   no se mueve ninguno; cambiar la pila y el motor no mueve ninguno; se
   sigue el camino unión por unión y en la quinta está el cable suelto.
   Al unirlo arrancan TODOS los puntitos en el mismo instante, también
   los de junto a la pila. Y si se corta en otro punto, se paran todos en
   el mismo instante, también los que están lejos del corte.

   ⚠️ Lo que asombra es eso último, y es verdad: con el camino cortado la
   corriente no circula en ninguna parte. No llega hasta el corte y se
   queda esperando ahí. Por eso los puntitos son UNA sola raya punteada
   que se corre entera: no pueden moverse unos y otros no.

   ⚠️ Lo que NO se dice, y a propósito. La prueba pregunta qué es un
   circuito, qué hace la pila, qué parte aprovecha la electricidad, en qué
   se transforma, cómo se llama la compuerta, qué conduce, qué aísla y de
   cuántos voltios son las pilas. Aquí no se escribe circuito, ni
   interruptor, ni fuente, ni carga, ni energía; la pila no lleva sus
   signos, y no sale ningún número de voltios.

   ⚠️ Una pieza tiene una sola demora. Cada pila que se cambia aparece en
   una capa y se va al montón en otra; el puntito de la corriente se mueve
   con su propia transición, que dura lo que dura la corriente.

   ⚠️ La misión es bilingüe, y la animación también: la escena trae sus dos
   idiomas escritos, y `idioma()` cambia los rótulos del dibujo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCable')) return;

  var ANCHO = 320, ALTO = 300;
  var lang = 'es';

  /* ── el dibujo ─────────────────────────────────────────────── */
  /* El camino, de la pila a la pila, en el sentido de la corriente: sale
     por arriba de la pila, va por arriba, baja por el motor, vuelve por
     abajo y entra por abajo de la pila. Las esquinas no son uniones. */
  var IZQ = 60, DER = 260, ARR = 70, ABA = 230;
  var PILA = { x0: 49, x1: 71, y0: 120, y1: 184, nube: 113, base: 186 };
  var MOTOR = { x: 260, y: 150, r: 22 };
  /* Las seis uniones, en el orden en que las va encontrando la corriente.
     La 2 y la 5 son empalmes a media raya; las otras, donde el cable toca
     la pila o el motor. */
  var U = [
    { x: IZQ, y: PILA.nube },                    // 1: arriba de la pila
    { x: 160, y: ARR },                          // 2: empalme de arriba
    { x: DER, y: MOTOR.y - MOTOR.r - 2 },        // 3: arriba del motor
    { x: DER, y: MOTOR.y + MOTOR.r + 2 },        // 4: abajo del motor
    { x: 160, y: ABA },                          // 5: empalme de abajo
    { x: IZQ, y: PILA.base }                     // 6: abajo de la pila
  ];
  var SUELTA = 4;                                // la quinta: el cable suelto
  var CORTE = 1;                                 // la segunda: el corte del paso 4
  var MEDIO = 6;                                 // medio largo de un empalme
  /* Los puntitos de la corriente: un puntito cada ESPACIO del camino. El
     camino mide 720 y caben 24 justos, así que el dibujo se cierra sin
     costura. */
  var ESPACIO = 30;
  var VEL = 60;                                  // lo que avanzan por segundo
  /* Dónde quedan quietos: ningún puntito cae en el hueco de un empalme
     suelto (va del 13 al 1 de cada 30, contado desde el empalme). */
  var QUIETO = 23;                               // el corrimiento de los pasos 0 a 2
  var CORRE3 = 360;                              // lo que avanzan en el paso 3 (seis segundos)
  var CORRE4 = 60;                               // lo que avanzan en el paso 4 hasta el corte
  /* El montón de lo que cambiaron, debajo del robot */
  var MONTON = [{ x: 52, y: 272 }, { x: 112, y: 272 }, { x: 172, y: 272 }];
  var MONTON_MOTOR = { x: 238, y: 272 };
  var CHICO = 0.8;

  /* ── el reloj de la escena ──────────────────────────────────── */
  var CAMBIO = 1100;                             // paso 1: lo que dura cada cambio
  var LEG = 1200;                                // paso 2: de unión a unión
  var UNE = 400;                                 // paso 3: el cable se une
  var ARRANCA = UNE + 800;                       // paso 3: y en ese instante arranca todo
  var EMPIEZA4 = 200;                            // paso 4: la corriente corre…
  var CORTA = EMPIEZA4 + 1000 * CORRE4 / VEL;    // …hasta que se corta

  var RS = {
    titulo: { es: 'el robot, por dentro', en: 'the robot, inside' },
    corriente: { es: 'la corriente', en: 'the current' },
    pila: { es: 'pila', en: 'battery' },
    motor: { es: 'motor', en: 'motor' },
    suelto: { es: 'cable suelto', en: 'loose wire' },
    corte: { es: 'corte', en: 'cut' },
    monton: { es: 'lo que cambiaron', en: 'what they changed' }
  };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }
  function origen(n, x, y) { n.style.transformOrigin = x + 'px ' + y + 'px'; }
  function dura(n, ms) { n.style.setProperty('--el-t', Math.round(ms) + 'ms'); }
  function f2(v) { return (Math.round(v * 100) / 100).toString(); }

  /* El camino entero, de la unión 1 a la 1, pasando por las esquinas */
  function camino() {
    return 'M' + IZQ + ' ' + PILA.nube + ' L' + IZQ + ' ' + ARR + ' L' + DER + ' ' + ARR + ' L' + DER + ' ' + ABA +
      ' L' + IZQ + ' ' + ABA + ' L' + IZQ + ' ' + PILA.nube;
  }
  /* Un tramo del camino entre dos uniones, para seguirlo con el dedo */
  function tramo(k) {
    var a = U[k], b = U[k + 1];
    if (k === 0) return 'M' + a.x + ' ' + a.y + ' L' + IZQ + ' ' + ARR + ' L' + b.x + ' ' + b.y;
    if (k === 1) return 'M' + a.x + ' ' + a.y + ' L' + DER + ' ' + ARR + ' L' + b.x + ' ' + b.y;
    if (k === 2) return 'M' + a.x + ' ' + a.y + ' L' + b.x + ' ' + b.y;
    return 'M' + a.x + ' ' + a.y + ' L' + DER + ' ' + ABA + ' L' + b.x + ' ' + b.y;
  }

  /* Una pila parada en su lugar: el cuerpo, su franja y su botón de arriba */
  function pila(A, padre) {
    var g = A.el('g', {}, padre);
    A.el('rect', { x: PILA.x0 + 6, y: PILA.nube, width: PILA.x1 - PILA.x0 - 12, height: PILA.y0 - PILA.nube, rx: 1.5, 'class': 'el-boton', 'data-pila-nube': '' }, g);
    A.el('rect', { x: PILA.x0, y: PILA.y0, width: PILA.x1 - PILA.x0, height: PILA.y1 - PILA.y0, rx: 3, 'class': 'el-pila', 'data-pila-cuerpo': '' }, g);
    A.el('rect', { x: PILA.x0, y: PILA.y0, width: PILA.x1 - PILA.x0, height: 14, rx: 3, 'class': 'el-franja' }, g);
    A.el('rect', { x: PILA.x0 + 6, y: PILA.y1, width: PILA.x1 - PILA.x0 - 12, height: PILA.base - PILA.y1, rx: 1, 'class': 'el-boton', 'data-pila-base': '' }, g);
    return g;
  }
  /* El motor visto de frente, con su rotor que gira */
  function motor(A, padre) {
    var g = A.el('g', {}, padre);
    A.el('rect', { x: MOTOR.x - 4, y: MOTOR.y - MOTOR.r - 3, width: 8, height: 5, rx: 1, 'class': 'el-boton', 'data-terminal': 'arriba' }, g);
    A.el('rect', { x: MOTOR.x - 4, y: MOTOR.y + MOTOR.r - 2, width: 8, height: 5, rx: 1, 'class': 'el-boton', 'data-terminal': 'abajo' }, g);
    A.el('circle', { cx: MOTOR.x, cy: MOTOR.y, r: MOTOR.r, 'class': 'el-motor', 'data-motor-cuerpo': '' }, g);
    var rotor = A.el('g', { 'class': 'el-gira', 'data-rotor': '' }, g);
    origen(rotor, MOTOR.x, MOTOR.y);
    A.el('circle', { cx: MOTOR.x, cy: MOTOR.y, r: 13, 'class': 'el-rotor' }, rotor);
    A.el('path', { d: 'M' + (MOTOR.x - 11) + ' ' + MOTOR.y + ' L' + (MOTOR.x + 11) + ' ' + MOTOR.y, 'class': 'el-aspa' }, rotor);
    A.el('path', { d: 'M' + MOTOR.x + ' ' + (MOTOR.y - 11) + ' L' + MOTOR.x + ' ' + (MOTOR.y + 11), 'class': 'el-aspa' }, rotor);
    A.el('circle', { cx: MOTOR.x + 8, cy: MOTOR.y - 8, r: 2.6, 'class': 'el-marca', 'data-marca': '' }, rotor);
    return { g: g, rotor: rotor };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    P.titulo = texto(A, svg, 28, 36, 'am-rotulo', 10, 'start', '');
    /* la leyenda: un puntito es la corriente */
    A.el('circle', { cx: 214, cy: 32.5, r: 3.6, 'class': 'el-punto-ley', 'data-ley-punto': '' }, svg);
    P.ley = texto(A, svg, 222, 36, 'am-rotulo', 10, 'start', '');
    P.ley.setAttribute('data-ley', '');
    A.el('rect', { x: 26, y: 48, width: 268, height: 198, rx: 10, 'class': 'el-tabla', 'data-tabla': '' }, svg);

    /* lo que se va siguiendo con el dedo, debajo de los cables */
    P.sigue = [0, 1, 2, 3].map(function (k) {
      return A.el('path', { d: tramo(k), 'class': 'el-sigue', 'data-sigue': k }, svg);
    });

    /* los cables: rojo de la pila al motor por arriba, negro de vuelta por
       abajo; cada empalme es un pedacito que se puede soltar */
    var r1 = U[1], r4 = U[4];
    A.el('path', { d: 'M' + IZQ + ' ' + PILA.nube + ' L' + IZQ + ' ' + ARR + ' L' + (r1.x - MEDIO) + ' ' + ARR, 'class': 'el-cable el-rojo', 'data-cable': 'a' }, svg);
    A.el('path', { d: 'M' + (r1.x + MEDIO) + ' ' + ARR + ' L' + DER + ' ' + ARR + ' L' + DER + ' ' + U[2].y, 'class': 'el-cable el-rojo', 'data-cable': 'b' }, svg);
    A.el('path', { d: 'M' + DER + ' ' + U[3].y + ' L' + DER + ' ' + ABA + ' L' + (r4.x + MEDIO) + ' ' + ABA, 'class': 'el-cable el-negro', 'data-cable': 'c' }, svg);
    A.el('path', { d: 'M' + (r4.x - MEDIO) + ' ' + ABA + ' L' + IZQ + ' ' + ABA + ' L' + IZQ + ' ' + PILA.base, 'class': 'el-cable el-negro', 'data-cable': 'd' }, svg);
    /* el pedacito suelto cuelga de su punta izquierda */
    P.empalme = {};
    [[CORTE, 'el-rojo'], [SUELTA, 'el-negro']].forEach(function (q) {
      var j = U[q[0]];
      var g = A.el('g', { 'data-empalme': q[0] + 1 }, svg);
      origen(g, j.x - MEDIO, j.y);
      A.el('path', { d: 'M' + (j.x - MEDIO) + ' ' + j.y + ' L' + (j.x + MEDIO) + ' ' + j.y, 'class': 'el-cable ' + q[1], 'data-pedazo': q[0] + 1 }, g);
      A.el('path', { d: 'M' + (j.x + MEDIO - 1.5) + ' ' + j.y + ' L' + (j.x + MEDIO + 0.5) + ' ' + j.y, 'class': 'el-punta' }, g);
      P.empalme[q[0]] = g;
    });

    /* la corriente: una sola raya punteada, con su borde oscuro. Por
       dentro de la pila y del motor no se dibuja: ahí la tapan sus cuerpos,
       y cuando la pila o el motor se sacan para cambiarlos, en su lugar
       queda el hueco, sin puntitos flotando en el aire. */
    var defs = A.el('defs', null, svg);
    var mascara = A.el('mask', { id: A.id + '-dentro', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: ANCHO, height: ALTO }, defs);
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, fill: '#fff' }, mascara);
    A.el('rect', { x: PILA.x0 - 2, y: PILA.nube, width: PILA.x1 - PILA.x0 + 4, height: PILA.base - PILA.nube, fill: '#000', 'data-sin-puntos': 'pila' }, mascara);
    A.el('rect', { x: MOTOR.x - 6, y: U[2].y, width: 12, height: U[3].y - U[2].y, fill: '#000', 'data-sin-puntos': 'motor' }, mascara);
    P.puntos = ['el-punto-borde', 'el-punto'].map(function (c) {
      var p = A.el('path', { d: camino(), 'class': 'el-corre ' + c, 'data-corriente': c === 'el-punto' ? 'si' : 'borde',
        mask: 'url(#' + A.id + '-dentro)' }, svg);
      p.style.strokeDasharray = '0 ' + ESPACIO;
      return p;
    });
    /* las flechitas del camino: solo cuando la corriente circula */
    P.flechas = A.el('g', { 'data-flechas': '' }, svg);
    [[104, ARR, 0], [DER, 98, 90], [214, ABA, 180], [IZQ, 209, 270]].forEach(function (q) {
      var g = A.el('g', { transform: 'translate(' + q[0] + ' ' + q[1] + ') rotate(' + q[2] + ')' }, P.flechas);
      A.el('path', { d: 'M-4 -5 L3 0 L-4 5', 'class': 'el-flecha', 'data-flecha': q[2] }, g);
    });

    /* las cuatro pilas (la de antes y las tres nuevas) y los dos motores:
       cada una en dos capas, una para aparecer y otra para irse al montón */
    P.pilas = [0, 1, 2, 3].map(function (k) {
      var va = A.el('g', { 'class': 'el-anda', 'data-pila': k }, svg);
      origen(va, (PILA.x0 + PILA.x1) / 2, (PILA.nube + PILA.base) / 2);
      var ve = A.el('g', { 'data-pila-ve': k }, va);
      pila(A, ve);
      return { va: va, ve: ve };
    });
    P.motores = [0, 1].map(function (k) {
      var va = A.el('g', { 'class': 'el-anda', 'data-motor': k }, svg);
      origen(va, MOTOR.x, MOTOR.y);
      var ve = A.el('g', { 'data-motor-ve': k }, va);
      var m = motor(A, ve);
      return { va: va, ve: ve, rotor: m.rotor };
    });
    /* el zumbido del motor que gira */
    P.zumba = A.el('g', { 'data-zumba': '' }, svg);
    [26, 31].forEach(function (rr) {
      var a1 = 140 * Math.PI / 180, a2 = 220 * Math.PI / 180;
      A.el('path', { d: 'M' + f2(MOTOR.x + Math.cos(a1) * rr) + ' ' + f2(MOTOR.y + Math.sin(a1) * rr) + ' A' + rr + ' ' + rr + ' 0 0 1 ' +
        f2(MOTOR.x + Math.cos(a2) * rr) + ' ' + f2(MOTOR.y + Math.sin(a2) * rr), 'class': 'el-zumbido' }, P.zumba);
    });

    P.pilaNombre = texto(A, svg, 78, 153, 'el-letra', 10, 'start', '');
    P.pilaNombre.setAttribute('data-nombre', 'pila');
    P.motorNombre = texto(A, svg, 223, 154, 'el-letra', 10, 'end', '');
    P.motorNombre.setAttribute('data-nombre', 'motor');

    /* el montón de lo que cambiaron */
    P.monton = texto(A, svg, 140, 257, 'am-rotulo', 9.5, 'middle', '');
    P.monton.setAttribute('data-monton', '');

    /* la revisión, unión por unión: el aro, el número y la marca */
    var NUM = [[74, 108], [160, 89], [246, 120], [246, 189], [160, 217], [74, 199]];
    var MARCA = [[-10, -9], [9, -10], [11, -9], [11, 9], [9, 10], [-10, 9]];
    P.aros = U.map(function (j, k) {
      return A.el('circle', { cx: j.x, cy: j.y, r: 9, 'class': 'el-aro', 'data-aro': k + 1 }, svg);
    });
    P.numeros = U.map(function (j, k) {
      var t = texto(A, svg, NUM[k][0], NUM[k][1], 'el-letra el-numero', 10, 'middle', String(k + 1));
      t.setAttribute('data-numero', k + 1);
      return t;
    });
    P.marcas = U.map(function (j, k) {
      var mx = j.x + MARCA[k][0], my = j.y + MARCA[k][1];
      var g = A.el('g', { 'data-marca-union': k + 1, 'data-bien': k === SUELTA ? 'no' : 'si' }, svg);
      A.el('circle', { cx: mx, cy: my, r: 6.5, 'class': k === SUELTA ? 'el-mal' : 'el-bien' }, g);
      if (k === SUELTA) {
        A.el('path', { d: 'M' + (mx - 2.8) + ' ' + (my - 2.8) + ' L' + (mx + 2.8) + ' ' + (my + 2.8) + ' M' + (mx + 2.8) + ' ' + (my - 2.8) + ' L' + (mx - 2.8) + ' ' + (my + 2.8),
          'class': 'el-signo', 'data-signo': 'x' }, g);
      } else {
        A.el('path', { d: 'M' + (mx - 3) + ' ' + my + ' L' + (mx - 0.8) + ' ' + (my + 2.4) + ' L' + (mx + 3.2) + ' ' + (my - 2.6), 'class': 'el-signo', 'data-signo': 'v' }, g);
      }
      return g;
    });
    /* lo que se encuentra: el hueco del cable suelto y el del corte */
    P.hueco = {};
    [[SUELTA, 'suelto', 200], [CORTE, 'corte', 59]].forEach(function (q) {
      var j = U[q[0]];
      var g = A.el('g', { 'data-hueco': q[1] }, svg);
      A.el('ellipse', { cx: j.x, cy: j.y, rx: 14, ry: 9, 'class': 'el-anillo', 'data-anillo': q[1] }, g);
      var t = texto(A, g, j.x, q[2], 'el-letra', 10, 'middle', '');
      t.setAttribute('data-nombre', q[1]);
      P.hueco[q[1]] = { g: g, t: t };
    });
    /* en el paso 4, dos puntitos lejos del corte, quietos también */
    P.lejos = [577, 367].map(function (s) {
      var p = sobre(s);
      return A.el('circle', { cx: p.x, cy: p.y, r: 7, 'class': 'el-lejos', 'data-lejos': s }, svg);
    });
  }

  /* Dónde queda un punto del camino, contado desde la unión 1 */
  function sobre(s) {
    var tramos = [[IZQ, PILA.nube, IZQ, ARR], [IZQ, ARR, DER, ARR], [DER, ARR, DER, ABA], [DER, ABA, IZQ, ABA], [IZQ, ABA, IZQ, PILA.nube]];
    var L = 0;
    tramos.forEach(function (t) { L += Math.abs(t[2] - t[0]) + Math.abs(t[3] - t[1]); });
    s = ((s % L) + L) % L;
    for (var i = 0; i < tramos.length; i++) {
      var t = tramos[i], l = Math.abs(t[2] - t[0]) + Math.abs(t[3] - t[1]);
      if (s <= l) return { x: t[0] + (t[2] - t[0]) * s / l, y: t[1] + (t[3] - t[1]) * s / l };
      s -= l;
    }
    return { x: IZQ, y: PILA.nube };
  }

  function idioma(l) {
    lang = l === 'en' ? 'en' : 'es';
    P.titulo.textContent = RS.titulo[lang];
    P.ley.textContent = RS.corriente[lang];
    P.pilaNombre.textContent = RS.pila[lang];
    P.motorNombre.textContent = RS.motor[lang];
    P.monton.textContent = RS.monton[lang];
    P.hueco.suelto.t.textContent = RS.suelto[lang];
    P.hueco.corte.t.textContent = RS.corte[lang];
  }

  /* ── los estados ───────────────────────────────────────────── */

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    var lista = [P.flechas, P.zumba, P.monton, P.hueco.suelto.g, P.hueco.corte.g, P.empalme[CORTE], P.empalme[SUELTA]];
    P.puntos.forEach(function (p) { lista.push(p); });
    P.sigue.forEach(function (p) { lista.push(p); });
    P.pilas.forEach(function (p) { lista.push(p.va, p.ve); });
    P.motores.forEach(function (m) { lista.push(m.va, m.ve, m.rotor); });
    P.aros.concat(P.numeros, P.marcas, P.lejos).forEach(function (p) { lista.push(p); });
    return lista;
  }

  /* El estado al TERMINAR cada paso. cambios: cuántas cosas ya se
     cambiaron (0 a 4); suelta / cortada: cada empalme; corre: cuánto ha
     avanzado la corriente; revisa: hasta qué unión se revisó. */
  var ESTADOS = [
    { cambios: 0, suelta: true, cortada: false, corre: 0, circula: false, revisa: 0, numeros: false, lejos: false },
    { cambios: 4, suelta: true, cortada: false, corre: 0, circula: false, revisa: 0, numeros: false, lejos: false },
    { cambios: 4, suelta: true, cortada: false, corre: 0, circula: false, revisa: 5, numeros: false, lejos: false },
    { cambios: 4, suelta: false, cortada: false, corre: CORRE3, circula: true, revisa: 0, numeros: false, lejos: false },
    { cambios: 4, suelta: false, cortada: true, corre: CORRE3 + CORRE4, circula: false, revisa: 0, numeros: false, lejos: true },
    { cambios: 4, suelta: false, cortada: true, corre: CORRE3 + CORRE4, circula: false, revisa: 0, numeros: true, lejos: false }
  ];
  /* Qué pila y qué motor están en su lugar después de cada cambio: la pila,
     el motor, la pila y la pila otra vez. */
  var ORDEN = ['pila', 'motor', 'pila', 'pila'];

  function suelto(A, k, si, demora) {
    /* el pedacito sigue pegado por su punta izquierda y la otra se le
       cae: ahí queda el hueco */
    A.mover(P.empalme[k], 0, 0, si ? 40 : 0, 1, demora);
  }

  function corriente(A, s, demora) {
    P.puntos.forEach(function (p) {
      p.style.setProperty('--d', Math.round(demora || 0) + 'ms');
      p.style.strokeDashoffset = String(QUIETO - s);
    });
  }

  function giro(s) { return s / VEL * 360; }   // una vuelta del rotor por segundo de corriente

  function enSuLugar(A, cambios, demora) {
    /* la pila que está en su lugar es la del último cambio de pila; las
       demás, en el montón, en el orden en que salieron */
    var pilas = 0, motores = 0;
    for (var c = 0; c < cambios; c++) { if (ORDEN[c] === 'pila') pilas++; else motores++; }
    P.pilas.forEach(function (p, k) {
      A.ver(p.ve, k <= pilas, demora);
      if (k < pilas) {
        var m = MONTON[k];
        A.mover(p.va, m.x - (PILA.x0 + PILA.x1) / 2, m.y - (PILA.nube + PILA.base) / 2, 90, CHICO, demora);
      } else A.mover(p.va, 0, 0, 0, 1, demora);
    });
    P.motores.forEach(function (m, k) {
      A.ver(m.ve, k <= motores, demora);
      if (k < motores) A.mover(m.va, MONTON_MOTOR.x - MOTOR.x, MONTON_MOTOR.y - MOTOR.y, 0, CHICO, demora);
      else A.mover(m.va, 0, 0, 0, 1, demora);
    });
  }

  function base(A, s) {
    deGolpe(A, todo(), function () {
      enSuLugar(A, s.cambios, 0);
      A.ver(P.monton, s.cambios > 0, 0);
      suelto(A, SUELTA, s.suelta, 0);
      suelto(A, CORTE, s.cortada, 0);
      corriente(A, s.corre, 0);
      /* el motor viejo, en el montón, no ha girado nunca */
      A.mover(P.motores[0].rotor, 0, 0, 0, 1, 0);
      A.mover(P.motores[1].rotor, 0, 0, giro(s.corre), 1, 0);
      A.ver(P.flechas, s.circula, 0);
      A.ver(P.zumba, s.circula, 0);
      P.sigue.forEach(function (p, k) { A.trazar(p, k < s.revisa - 1, 0); A.ver(p, k < s.revisa - 1, 0); });
      P.aros.forEach(function (p, k) { A.ver(p, k < s.revisa, 0); });
      P.marcas.forEach(function (p, k) { A.ver(p, k < s.revisa, 0); });
      P.numeros.forEach(function (p, k) { A.ver(p, k < s.revisa || s.numeros, 0); });
      A.ver(P.hueco.suelto.g, s.revisa >= 5, 0);
      A.ver(P.hueco.corte.g, s.lejos || s.numeros, 0);
      P.lejos.forEach(function (p) { A.ver(p, s.lejos, 0); });
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan solo al ENTRAR; el 0 y
       el 5 se pintan siempre, también en el primer pintado. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0 || n === 5) { base(A, ESTADOS[n]); return; }
    if (n === 1) {
      base(A, ESTADOS[0]);
      /* la pila, el motor, la pila y la pila otra vez: cada cosa vieja se
         va al montón y en su lugar aparece la nueva. Nada se mueve. */
      A.ver(P.monton, true, 400);
      var pilas = 0, motores = 0;
      ORDEN.forEach(function (que, c) {
        var t = 300 + c * CAMBIO;
        if (que === 'pila') {
          var vieja = P.pilas[pilas], m = MONTON[pilas];
          A.mover(vieja.va, m.x - (PILA.x0 + PILA.x1) / 2, m.y - (PILA.nube + PILA.base) / 2, 90, CHICO, t);
          pilas++;
          A.ver(P.pilas[pilas].ve, true, t + 500);
        } else {
          A.mover(P.motores[0].va, MONTON_MOTOR.x - MOTOR.x, MONTON_MOTOR.y - MOTOR.y, 0, CHICO, t);
          motores++;
          A.ver(P.motores[1].ve, true, t + 500);
        }
      });
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      /* se sigue el camino desde la pila: la unión, su aro y su marca, y
         el tramo hasta la siguiente */
      for (var k = 0; k < 5; k++) {
        var t0 = 200 + k * LEG;
        A.ver(P.aros[k], true, t0);
        A.ver(P.numeros[k], true, t0);
        A.ver(P.marcas[k], true, t0 + 300);
        if (k < 4) { A.ver(P.sigue[k], true, t0 + 400); A.trazar(P.sigue[k], true, t0 + 400); }
      }
      A.ver(P.hueco.suelto.g, true, 200 + 4 * LEG + 600);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      P.sigue.forEach(function (p) { A.ver(p, false, 0); });
      P.aros.concat(P.marcas, P.numeros).forEach(function (p) { A.ver(p, false, 0); });
      A.ver(P.hueco.suelto.g, false, 0);
      /* el cable se une, y en ese mismo instante arranca todo */
      suelto(A, SUELTA, false, UNE);
      P.puntos.forEach(function (p) { dura(p, 1000 * CORRE3 / VEL); });
      corriente(A, CORRE3, ARRANCA);
      var mt = P.motores[1].rotor;
      dura(mt, 1000 * CORRE3 / VEL);
      A.mover(mt, 0, 0, giro(CORRE3), 1, ARRANCA);
      A.ver(P.flechas, true, ARRANCA);
      A.ver(P.zumba, true, ARRANCA);
      return;
    }
    /* el 4: corre un poco y se corta en otro punto: se para todo a la vez */
    base(A, ESTADOS[3]);
    P.puntos.forEach(function (p) { dura(p, CORTA - EMPIEZA4); });
    corriente(A, CORRE3 + CORRE4, EMPIEZA4);
    var mr = P.motores[1].rotor;
    dura(mr, CORTA - EMPIEZA4);
    A.mover(mr, 0, 0, giro(CORRE3 + CORRE4), 1, EMPIEZA4);
    suelto(A, CORTE, true, CORTA);
    A.ver(P.flechas, false, CORTA);
    A.ver(P.zumba, false, CORTA);
    A.ver(P.hueco.corte.g, true, CORTA + 900);
    P.lejos.forEach(function (p) { A.ver(p, true, CORTA + 1300); });
  }

  var FRASES = {
    es: [
      'El robot no enciende: la pila y el motor están en su lugar, y por fuera no se ve nada roto. ¿Dónde buscarías la falla?',
      'Cambiaron la pila, después el motor y la pila dos veces más. Nada se movió, y se fueron la tarde y el dinero de dos pilas buenas.',
      'Siguieron el camino de la corriente desde la pila, unión por unión. Las cuatro primeras estaban bien; en la quinta, un cable suelto del tamaño de una uña.',
      'Unieron el cable y el camino quedó completo. En ese mismo instante arrancan todos los puntitos, también los de junto a la pila, y el motor gira.',
      'Si el camino se corta en otro punto, pasa lo mismo: todo se para en el mismo instante, también lo que está lejos del corte.',
      'Tu turno: dibuja el camino de un aparato de pilas de tu casa, de la pila hasta que vuelve a ella, y numera sus uniones. ¿Cuál revisarías primero?'
    ],
    en: [
      'The robot will not turn on: the battery and the motor are in place, and from the outside nothing looks broken. Where would you look for the fault?',
      'They changed the battery, then the motor, and the battery two more times. Nothing moved, and they lost the afternoon and the money for two good batteries.',
      'They followed the path of the current from the battery, joint by joint. The first four were fine; at the fifth, a loose wire the size of a fingernail.',
      'They joined the wire and the path was complete. At that very moment all the dots start moving, even the ones next to the battery, and the motor turns.',
      'If the path is cut at another point, the same thing happens: everything stops at the same moment, even what is far from the cut.',
      'Your turn: draw the path of a battery-powered device at home, from the battery until it comes back to it, and number its joints. Which one would you check first?'
    ]
  };
  var BOTONES = {
    es: ['🔋 Cambiar la pila', '🔍 Seguir el camino', '🔗 Unir el cable', '✂️ Otro corte', '📝 Tu turno', '↺ Empezar otra vez'],
    en: ['🔋 Change the battery', '🔍 Follow the path', '🔗 Join the wire', '✂️ Cut it elsewhere', '📝 Your turn', '↺ Start over']
  };
  var MARCADOR = {
    es: [['0', 'puntitos que se mueven'], ['4', 'cambios, y no se mueve nada'], ['5', 'uniones revisadas: la quinta, suelta'],
      ['todos', 'los puntitos arrancan a la vez'], ['0', 'puntitos que se mueven, con un solo corte'], ['6', 'uniones en el camino']],
    en: [['0', 'dots moving'], ['4', 'changes, and nothing moves'], ['5', 'joints checked: the fifth, loose'],
      ['all', 'the dots start at once'], ['0', 'dots moving, with a single cut'], ['6', 'joints along the path']]
  };

  AnimacionMision.montar('#amCable', {
    vista: [ANCHO, ALTO],
    bilingue: true,
    describe: {
      es: 'El robot por dentro: la pila, el motor y el camino de cables con seis uniones, y la corriente como puntitos. Con un cable suelto no se mueve ninguno, aunque cambien la pila y el motor; al unirlo arrancan todos a la vez, y con un corte en otro punto se paran todos a la vez.',
      en: 'The robot inside: the battery, the motor and the path of wires with six joints, and the current as dots. With a loose wire none of them moves, even after changing the battery and the motor; once it is joined they all start at once, and with a cut somewhere else they all stop at once.'
    },
    pasos: 6,
    construir: construir,
    idioma: idioma,
    pintar: pintar,
    texto: function (n) { return FRASES[lang][n]; },
    boton: function (n) { return BOTONES[lang][n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[lang][n][0], palabras: MARCADOR[lang][n][1] }; }
  });
})();
