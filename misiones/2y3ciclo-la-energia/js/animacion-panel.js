/* ============================================================
   M.E.T.A.S · La Energía · «El panel no estaba malo»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia del panel de la
   escuela: funcionó una semana y el primer día bien nublado no encendió
   nada. «Salió malo», dijeron, y no estaba malo: ese día casi no había de
   dónde sacar la energía. La historia dice que el panel no la fabrica, la
   convierte. Eso es lo que se ve aquí. El aparato (botones, frase,
   marcador) vive en js/animacion-mision.js; aquí solo está el dibujo y
   dónde va cada pieza en cada paso.

   La escuela con su panel en el techo, abierta por delante para ver la
   computadora de adentro, y el sol arriba a la izquierda:

     0  el panel y la computadora apagada: ¿de dónde saca el panel lo que
        la enciende?;
     1  sale el sol, y seis rayos de luz llegan al panel, uno por uno;
     2  el panel convierte esa luz en electricidad, que baja por el cable,
        y la computadora enciende;
     3  en la pantalla la electricidad se convierte en luz: la luz de la
        pantalla empezó siendo luz del sol;
     4  otro día, bien nublado: la nube tapa el sol, al panel le llega un
        rayo débil, por el cable baja poca electricidad y no enciende;
     5  «salió malo», dijeron: con raya cortada, la luz que no llegó; el
        panel convierte la que le llega, y la que falta no la fabrica;
     6  al día siguiente la nube se va, los seis rayos vuelven y el mismo
        panel la enciende;
     7  la pregunta es del alumno: algo que se encienda en su casa, y de
        dónde le llega la energía, hacia atrás.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo que baja por el cable va con lo que llega al panel.** El
      ancho de la banda del cable es uno por cada rayo que llega: seis
      rayos dan la banda gruesa y uno, la fina. La sonda cuenta los rayos
      que tocan el panel y mide la banda. Con poca luz, poca electricidad:
      eso es lo verdadero, y no se dice más (ni cuánta luz se vuelve
      electricidad, que no es toda).
   2. ⚠️ **Bien nublado no es de noche.** Por la nube pasa luz, poca, y el
      dibujo lo dice con un rayo débil que sale de la nube. La historia
      decía que «no había de dónde sacar la energía»; se cambió a «casi no
      había», porque un día nublado el panel algo recibe, y eso es lo que
      aquí se ve.
   3. ⚠️ **Lo que falta se ve, y no se fabrica.** En el paso 5 la luz que
      no llegó va con raya cortada, del borde de la nube al panel: es la
      que habría hecho falta, y la sonda comprueba que sean justo los cinco
      rayos que no pasaron.
   4. **La luz de la pantalla empezó siendo luz del sol.** Es lo que
      asombra, y es verdad: la energía se convirtió dos veces, en el panel
      y en la pantalla, y la sonda cuenta los dos aros.
   5. ⚠️ **Lo que pregunta la prueba no se dice**: ni el nombre de una
      forma de energía, ni si una fuente se agota, ni un aparato de la
      casa, ni cómo se ahorra. Tampoco que la energía «se transforma»: se
      dice «se convierte», que es la palabra de la historia.
   6. **Nada se dice solo con color**: lo que falta va con raya cortada, la
      banda del cable cambia de ancho y la pantalla apagada es oscura.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPanel')) return;

  var ANCHO = 320, ALTO = 236, FIN = 7, SUELO = 212;
  var SOL = [40, 42], SOL_R = 17;
  /* La escuela: el techo de dos aguas y el cuarto abierto por delante. */
  var ALERO_I = [130, 128], CUMBRE = [222, 78], ALERO_D = [314, 128];
  var PARED_I = 136, PARED_D = 308, TECHO_Y = 128;
  /* El panel, sobre el agua izquierda del techo, la que mira al sol. */
  var PAN_DESDE = 18, PAN_HASTA = 80, PAN_ALTO = 9;
  /* Seis rayos cuando hay sol; el día nublado pasa uno solo, débil. */
  var RAYOS = 6, PASA = 2;
  /* Lo que baja por el cable: 1 de ancho por cada rayo que llega. */
  var POR_RAYO = 1;
  /* La nube, delante del sol: círculos que lo tapan entero. */
  var NUBE = [[30, 42, 17], [46, 30, 15], [62, 36, 17], [80, 46, 15], [94, 58, 11]];
  var NUBE_BASE = { cx: 58, cy: 56, rx: 40, ry: 12 };
  var NUBE_FUERA = -150, NUBE_SE_VA = 330;

  var TEXTOS = [
    'En la escuela hay un panel en el techo y una computadora. ¿De dónde saca el panel lo que la enciende?',
    'Sale el sol, y su luz llega al panel.',
    'El panel convierte esa luz en electricidad, que baja por el cable. Alcanza, y la computadora enciende.',
    'En la pantalla, la electricidad se convierte en luz. La luz de la pantalla empezó siendo luz del sol.',
    'Otro día, bien nublado. Al panel le llega muy poca luz, da poca electricidad, y la computadora no enciende.',
    '«Salió malo», dijeron. Pero el panel convierte la luz que le llega, y la que falta no la puede fabricar.',
    'Al día siguiente salió el sol. El mismo panel volvió a encender la computadora: no estaba malo.',
    '¿Y tú? Busca algo que se encienda en tu casa y dibuja de dónde le llega la energía, hasta donde puedas.'
  ];

  var A;
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  function f(v) { return Math.round(v * 100) / 100; }

  /* El agua izquierda del techo: U corre por ella hacia la cumbre y N sale
     de ella hacia afuera (arriba y a la izquierda, hacia el sol). */
  var LARGO = Math.hypot(CUMBRE[0] - ALERO_I[0], CUMBRE[1] - ALERO_I[1]);
  var U = [(CUMBRE[0] - ALERO_I[0]) / LARGO, (CUMBRE[1] - ALERO_I[1]) / LARGO];
  var N = [U[1], -U[0]];
  function sobre(s, h) { return [f(ALERO_I[0] + U[0] * s + N[0] * h), f(ALERO_I[1] + U[1] * s + N[1] * h)]; }
  var BASE0 = sobre(PAN_DESDE, 2), BASE1 = sobre(PAN_HASTA, 2);
  var TOPE0 = sobre(PAN_DESDE, 2 + PAN_ALTO), TOPE1 = sobre(PAN_HASTA, 2 + PAN_ALTO);
  /* El cable sale del medio del panel y baja derecho a la computadora. */
  var CABLE_X = f((BASE0[0] + BASE1[0]) / 2), CABLE_Y0 = f((BASE0[1] + BASE1[1]) / 2);
  var MON = { x: f(CABLE_X - 22), y: 150, w: 44, h: 30 };

  /* A dónde llega cada rayo: repartidos por el borde de arriba del panel. */
  function blanco(k) {
    var t = (2 * k + 1) / (2 * RAYOS);
    return [f(TOPE0[0] + (TOPE1[0] - TOPE0[0]) * t), f(TOPE0[1] + (TOPE1[1] - TOPE0[1]) * t)];
  }
  function dentroNube(x, y) {
    for (var i = 0; i < NUBE.length; i++) {
      var c = NUBE[i];
      if (Math.hypot(x - c[0], y - c[1]) <= c[2]) return true;
    }
    var dx = (x - NUBE_BASE.cx) / NUBE_BASE.rx, dy = (y - NUBE_BASE.cy) / NUBE_BASE.ry;
    return dx * dx + dy * dy <= 1;
  }
  /* Por dónde sale de la nube el camino del sol a un punto del panel. */
  function salida(b) {
    var ultimo = SOL;
    for (var i = 0; i <= 600; i++) {
      var t = i / 600, x = SOL[0] + (b[0] - SOL[0]) * t, y = SOL[1] + (b[1] - SOL[1]) * t;
      if (dentroNube(x, y)) ultimo = [x, y];
    }
    return [f(ultimo[0]), f(ultimo[1])];
  }

  var P = {};

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El sol, con sus rayitos alrededor ── */
    P.halo = el('g', { 'data-halo': '' }, svg);
    for (var h = 0; h < 8; h++) {
      var a = h * Math.PI / 4;
      el('line', { class: 'en-halo', x1: f(SOL[0] + Math.cos(a) * (SOL_R + 4)), y1: f(SOL[1] + Math.sin(a) * (SOL_R + 4)),
        x2: f(SOL[0] + Math.cos(a) * (SOL_R + 10)), y2: f(SOL[1] + Math.sin(a) * (SOL_R + 10)) }, P.halo);
    }
    el('circle', { class: 'en-sol', 'data-sol': '', cx: SOL[0], cy: SOL[1], r: SOL_R }, svg);

    /* ── El suelo y la escuela: el cuarto, las paredes y el techo ── */
    el('rect', { class: 'en-suelo', 'data-suelo': '', x: 0, y: SUELO, width: ANCHO, height: ALTO - SUELO }, svg);
    el('rect', { class: 'en-cuarto', 'data-cuarto': '', x: PARED_I + 4, y: TECHO_Y + 4, width: PARED_D - PARED_I - 8, height: SUELO - TECHO_Y - 4 }, svg);
    el('rect', { class: 'en-pared', x: PARED_I, y: TECHO_Y, width: 4, height: SUELO - TECHO_Y }, svg);
    el('rect', { class: 'en-pared', x: PARED_D - 4, y: TECHO_Y, width: 4, height: SUELO - TECHO_Y }, svg);
    el('rect', { class: 'en-pared', x: PARED_I, y: TECHO_Y, width: PARED_D - PARED_I, height: 4 }, svg);
    el('polygon', { class: 'en-teja', 'data-techo': '', points: ALERO_I.join(',') + ' ' + CUMBRE.join(',') + ' ' + ALERO_D.join(',') }, svg);

    /* ── La mesa y la computadora ── */
    var MESA = MON.y + MON.h + 9;
    el('rect', { class: 'en-mesa', 'data-mesa': '', x: f(MON.x - 8), y: MESA, width: 72, height: 3 }, svg);
    el('rect', { class: 'en-pata', x: f(MON.x - 4), y: MESA + 3, width: 3, height: SUELO - MESA - 3 }, svg);
    el('rect', { class: 'en-pata', x: f(MON.x + 59), y: MESA + 3, width: 3, height: SUELO - MESA - 3 }, svg);
    el('rect', { class: 'en-marco', x: f(CABLE_X - 3), y: MON.y + MON.h + 2, width: 6, height: 5 }, svg);
    el('rect', { class: 'en-marco', x: f(CABLE_X - 10), y: MESA - 2, width: 20, height: 2 }, svg);
    el('rect', { class: 'en-marco', 'data-marco': '', x: MON.x - 2, y: MON.y - 2, width: MON.w + 4, height: MON.h + 4, rx: 2 }, svg);
    el('rect', { class: 'en-apagada', 'data-pantalla': 'apagada', x: MON.x, y: MON.y, width: MON.w, height: MON.h, rx: 1 }, svg);
    P.pantalla = el('rect', { class: 'en-encendida am-fuera', 'data-pantalla': 'encendida', x: MON.x, y: MON.y, width: MON.w, height: MON.h, rx: 1 }, svg);
    /* La luz de la pantalla: tres rayitas que salen de ella. */
    P.brillo = el('g', { class: 'am-fuera', 'data-brillo': '' }, svg);
    el('line', { class: 'en-brillo', x1: MON.x - 3, y1: MON.y + 12, x2: MON.x - 10, y2: MON.y + 12 }, P.brillo);
    el('line', { class: 'en-brillo', x1: MON.x - 2, y1: MON.y - 3, x2: MON.x - 8, y2: MON.y - 9 }, P.brillo);
    el('line', { class: 'en-brillo', x1: MON.x + MON.w + 2, y1: MON.y - 3, x2: MON.x + MON.w + 8, y2: MON.y - 9 }, P.brillo);

    /* ── El cable, y lo que baja por él: una banda del ancho de la luz que
       llega. Cada banda con dos piezas: la de fuera se enciende y la de
       dentro se dibuja de arriba hacia abajo. ── */
    var cable = 'M ' + CABLE_X + ' ' + CABLE_Y0 + ' L ' + CABLE_X + ' ' + MON.y;
    el('path', { class: 'en-cable', 'data-cable': '', d: cable }, svg);
    P.bandas = {};
    [['gruesa', RAYOS], ['fina', 1]].forEach(function (b) {
      var g = el('g', { class: 'am-fuera', 'data-banda': b[0] }, svg);
      var p = el('path', { class: 'en-banda', d: cable, 'stroke-width': f(POR_RAYO * b[1]) }, g);
      P.bandas[b[0]] = { g: g, p: p };
    });

    /* ── El panel, sobre el techo, con sus celdas ── */
    el('polygon', { class: 'en-panel', 'data-panel': '', points: [BASE0, BASE1, TOPE1, TOPE0].map(function (p) { return p.join(','); }).join(' ') }, svg);
    [1, 2].forEach(function (i) {
      var s = PAN_DESDE + (PAN_HASTA - PAN_DESDE) * i / 3, a0 = sobre(s, 2), a1 = sobre(s, 2 + PAN_ALTO);
      el('line', { class: 'en-celda', x1: a0[0], y1: a0[1], x2: a1[0], y2: a1[1] }, svg);
    });

    /* ── Los rayos del sol: del borde del sol a su punto del panel ── */
    P.rayos = [];
    for (var k = 0; k < RAYOS; k++) {
      var b = blanco(k), d = Math.hypot(b[0] - SOL[0], b[1] - SOL[1]);
      var ini = [f(SOL[0] + (b[0] - SOL[0]) / d * (SOL_R + 5)), f(SOL[1] + (b[1] - SOL[1]) / d * (SOL_R + 5))];
      var g = el('g', { class: 'am-fuera', 'data-rayo': k }, svg);
      var l = el('line', { class: 'en-rayo', x1: ini[0], y1: ini[1], x2: b[0], y2: b[1] }, g);
      P.rayos.push({ g: g, l: l });
    }
    /* El rayo débil que pasa por la nube, y la luz que no llegó. */
    var bp = blanco(PASA), sp = salida(bp);
    P.debil = el('g', { class: 'am-fuera', 'data-debil': '' }, svg);
    P.debilLinea = el('line', { class: 'en-rayo en-debil', x1: sp[0], y1: sp[1], x2: bp[0], y2: bp[1] }, P.debil);
    P.falta = el('g', { class: 'am-fuera', 'data-faltan': '' }, svg);
    for (var j = 0; j < RAYOS; j++) {
      if (j === PASA) continue;
      var bj = blanco(j), sj = salida(bj);
      el('line', { class: 'en-falta', 'data-falta': j, x1: sj[0], y1: sj[1], x2: bj[0], y2: bj[1] }, P.falta);
    }

    /* ── La nube: una envoltura para verse y otra para moverse ── */
    P.nube = el('g', { class: 'am-fuera', 'data-nube': '' }, svg);
    P.nubeMov = el('g', null, P.nube);
    el('ellipse', { class: 'en-nube', 'data-parte': '', cx: NUBE_BASE.cx, cy: NUBE_BASE.cy, rx: NUBE_BASE.rx, ry: NUBE_BASE.ry }, P.nubeMov);
    NUBE.forEach(function (c) { el('circle', { class: 'en-nube', 'data-parte': '', cx: c[0], cy: c[1], r: c[2] }, P.nubeMov); });
    /* Sin el borde de adentro: la nube se lee como una sola. Las mismas
       piezas otra vez, del mismo tamaño y sin borde, tapan la mitad de
       adentro de cada borde; queda solo la de afuera de la nube entera. */
    el('ellipse', { class: 'en-nube-dentro', cx: NUBE_BASE.cx, cy: NUBE_BASE.cy, rx: NUBE_BASE.rx, ry: NUBE_BASE.ry }, P.nubeMov);
    NUBE.forEach(function (c) { el('circle', { class: 'en-nube-dentro', cx: c[0], cy: c[1], r: c[2] }, P.nubeMov); });

    /* ── Dónde se convierte (paso 3): el panel y la pantalla ── */
    var mid = [f((BASE0[0] + TOPE1[0]) / 2), f((BASE0[1] + TOPE1[1]) / 2)];
    var giro = f(Math.atan2(U[1], U[0]) * 180 / Math.PI);
    P.aroPanel = el('ellipse', { class: 'en-aro am-fuera', 'data-aro': 'panel', cx: mid[0], cy: mid[1], rx: 39, ry: 13,
      transform: 'rotate(' + giro + ' ' + mid[0] + ' ' + mid[1] + ')' }, svg);
    P.aroPantalla = el('ellipse', { class: 'en-aro am-fuera', 'data-aro': 'pantalla', cx: CABLE_X, cy: MON.y + MON.h / 2, rx: 32, ry: 22 }, svg);
    P.rotPanel = el('g', { class: 'am-fuera', 'data-rotulo': 'panel' }, svg);
    var tq = el('text', { class: 'am-rotulo', x: 126, y: 112, 'font-size': 12, 'text-anchor': 'end' }, P.rotPanel);
    var q1 = el('tspan', { x: 126, y: 112 }, tq); q1.textContent = 'de luz a';
    var q2 = el('tspan', { x: 126, y: 126 }, tq); q2.textContent = 'electricidad';
    P.rotPantalla = el('g', { class: 'am-fuera', 'data-rotulo': 'pantalla' }, svg);
    /* Los rótulos de adentro van sobre la pared crema, que es una cosa:
       llevan su tinta fija, en la pantalla clara y en la oscura. */
    var tp = el('text', { class: 'en-rotulo-dentro', x: 208, y: 162, 'font-size': 12 }, P.rotPantalla);
    var t1 = el('tspan', { x: 208, y: 162 }, tp); t1.textContent = 'de electricidad';
    var t2 = el('tspan', { x: 208, y: 176 }, tp); t2.textContent = 'a luz';

    /* ── El día nublado ── */
    P.noAlcanza = texto(svg, { class: 'en-rotulo-dentro am-fuera', 'data-rotulo': 'no alcanza', x: 208, y: 169, 'font-size': 12.5 }, 'no alcanza');
    P.rotFalta = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'falta', x: 72, y: 104, 'font-size': 12, 'text-anchor': 'middle' }, 'la que falta');
  }

  function pintar(n, antes) {
    var entra = function (k) { return n === k && antes !== k; };
    var nublado = n === 4 || n === 5;
    var sol = !nublado && n >= 1;
    var luz = n === 2 || n === 3 || n >= 6;
    /* Del día nublado al de sol: al día siguiente (6, hacia adelante) la
       luz vuelve rayo por rayo; con «Atrás» al paso 3 vuelve de una vez.
       En los dos casos espera a que la nube se aparte. */
    var vuelve3 = n === 3 && (antes === 4 || antes === 5);
    var dia6 = entra(6) && antes === 5;

    /* La nube: entra por la izquierda y tapa el sol; al día siguiente se
       va por la derecha, apagándose. Ya está puesta (fuera del dibujo) en
       el paso 3, así entra entera y no a medio aparecer; escondida viaja
       a donde haga falta. */
    A.ver(P.nube, n >= 3 && n <= 5, n >= 6 ? 400 : 0);
    A.mover(P.nubeMov, nublado ? 0 : (n >= 6 ? NUBE_SE_VA : NUBE_FUERA), 0, 0, 1, 0);
    A.ver(P.halo, !nublado, vuelve3 || dia6 ? 400 : 0);

    /* Los seis rayos: se dibujan uno por uno, del sol al panel. Cada uno
       con dos piezas: la de fuera se enciende y la de dentro se dibuja. */
    P.rayos.forEach(function (r, k) {
      var dVer = 0, dTraza = 0;
      if (sol) {
        if (entra(1)) { dTraza = k * 150; }
        else if (dia6) { dVer = 600; dTraza = 700 + k * 120; }
        else if (vuelve3) { dVer = 400; dTraza = 500; }
      } else if (entra(4)) { dVer = 400; dTraza = 1000; }
      else { dTraza = 400; }
      A.ver(r.g, sol, dVer);
      A.trazar(r.l, sol, dTraza);
    });

    /* El día nublado: el rayo débil sale de la nube, y lo que falta. */
    A.ver(P.debil, nublado, entra(4) && antes === 3 ? 900 : 0);
    A.trazar(P.debilLinea, nublado, entra(4) && antes === 3 ? 900 : (nublado ? 0 : 500));
    A.ver(P.falta, n === 5, entra(5) ? 200 : 0);
    A.ver(P.rotFalta, n === 5, entra(5) ? 500 : 0);

    /* Lo que baja por el cable: la banda gruesa con sol, la fina nublado. */
    var gruesa = P.bandas.gruesa, fina = P.bandas.fina;
    var dG = entra(2) ? 200 : (dia6 ? 1600 : (vuelve3 ? 1200 : 0));
    var aNublado = entra(4) && antes === 3;
    A.ver(gruesa.g, luz, luz ? dG : (aNublado ? 900 : 0));
    A.trazar(gruesa.p, luz, luz ? dG : (aNublado ? 1500 : 400));
    A.ver(fina.g, nublado, aNublado ? 900 : 0);
    A.trazar(fina.p, nublado, aNublado ? 900 : (nublado ? 0 : 500));

    /* La pantalla se enciende cuando la electricidad ya bajó. */
    var dP = entra(2) ? 1000 : (dia6 ? 2400 : (vuelve3 ? 2000 : (aNublado ? 1500 : 0)));
    A.ver(P.pantalla, luz, dP);
    A.ver(P.brillo, luz, luz ? dP + 100 : dP);

    /* Dónde se convierte (3): cada aro cuando ya pasó por ahí la luz. */
    var dAro = vuelve3 ? 1300 : (entra(3) ? 200 : 0), dAro2 = vuelve3 ? 2100 : (entra(3) ? 700 : 0);
    A.ver(P.aroPanel, n === 3, dAro);
    A.ver(P.rotPanel, n === 3, dAro);
    A.ver(P.aroPantalla, n === 3, dAro2);
    A.ver(P.rotPantalla, n === 3, dAro2);

    /* No alcanza (4 y 5). */
    A.ver(P.noAlcanza, nublado, aNublado ? 1800 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '?', palabras: 'de dónde saca el panel lo que la enciende' },
      { cifra: '6', palabras: 'rayos de luz llegan al panel' },
      { cifra: '✓', palabras: 'alcanza: la computadora enciende' },
      { cifra: '2', palabras: 'veces se convirtió: en el panel y en la pantalla' },
      { cifra: '1', palabras: 'de 6 rayos llega al panel' },
      { cifra: '5', palabras: 'rayos faltan, y el panel no los fabrica' },
      { cifra: '6', palabras: 'rayos otra vez: el mismo panel la enciende' },
      { cifra: '?', palabras: '¿de dónde le llega la energía?' }
    ][n];
  }

  AnimacionMision.montar('#amPanel', {
    vista: [ANCHO, ALTO],
    describe: 'Una escuela con un panel en el techo y una computadora. Con sol, seis rayos de luz llegan al panel, que los convierte en electricidad; baja por el cable y la computadora enciende. Un día nublado la nube tapa el sol, llega un solo rayo débil, baja poca electricidad y no enciende: el panel no puede fabricar la luz que falta.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['☀️ Que salga el sol', '🔌 ¿Qué hace el panel?', '🖥️ ¿Y en la pantalla?', '☁️ Un día nublado', '🤔 ¿Salió malo?', '☀️ Al día siguiente', '💡 ¿Y tú?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
