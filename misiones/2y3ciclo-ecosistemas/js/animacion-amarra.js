/* ============================================================
   M.E.T.A.S · Los Ecosistemas · «La amarra que no se ve»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de los
   gavilanes: en la aldea se llevaban pollos, la gente los espantó, y al año
   siguiente ya no había quien se comiera a las ratas; las ratas se metieron
   en las trojas y lo que se perdió de maíz fue bastante más que los pollos.
   La historia dice que no se quitó un animal, sino una amarra que no se ve
   hasta que se corta. Eso es lo que se ve aquí.
   El aparato (botones, frase, marcador) vive en js/animacion-mision.js;
   aquí solo está el dibujo y dónde va cada pieza en cada paso.

   El patio de la aldea: la troja con su maíz a la izquierda, las ratas en
   medio, los pollos a la derecha y el gavilán arriba:

     0  pollos, ratas y maíz en la troja; arriba, un gavilán: ¿qué tendrá
        que ver con el maíz?;
     1  el gavilán baja y se lleva un pollo: eso lo ve todo el mundo;
     2  lo que nadie ve: baja otra vez y se lleva una rata. Aparecen las
        amarras: el gavilán con los pollos, el gavilán con las ratas, y las
        ratas con el maíz;
     3  la gente espanta al gavilán, y con él se van sus dos amarras;
     4  al año siguiente las ratas se multiplican, se meten en la troja y se
        comen tres cuartos del maíz;
     5  lo que costaba el gavilán (un pollo) y lo que costó espantarlo (tres
        cuartos de la troja): no se quitó un animal, se cortó una amarra;
     6  la pregunta es del alumno: un animal que donde vive quieren espantar,
        a quién se come, y sus amarras dibujadas en el cuaderno.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Lo perdido no se cuenta en plata, porque no se puede.** Comparar
      un pollo con unas mazorcas pide un precio, y un precio escrito aquí
      sería inventado. Se dibuja lo que se perdió con raya cortada donde
      estaba (el pollo, y tres cuartos de la troja), y la troja es el maíz
      del año de una casa: eso sí se ve que es bastante más.
   2. ⚠️ **El gavilán lleva lo que se lleva.** El pollo y la rata suben con
      él, por el mismo camino y al mismo tiempo, y se apagan cuando ya
      llegaron arriba; la sonda lo comprueba en el dibujo y en las demoras.
   3. ⚠️ **Lo que pregunta la prueba no se dice**: ni cómo se llama el que
      caza ni el que es cazado, ni los niveles de la cadena, ni de dónde
      viene la energía, ni cómo se llama el conjunto de cadenas. Se dice
      «se come» y «amarra», que son las palabras de la historia.
   4. ⚠️ **No se afirma nada del gavilán que la historia no diga.** Ni qué
      especie es, ni cuántas ratas se come al día. Las ratas pasan de dos a
      diez en el dibujo, y la frase dice solo que se multiplican.
   5. **Nada se dice solo con color**: los pollos, las ratas y las mazorcas
      se cuentan, y lo que ya no está lleva raya cortada.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amAmarra')) return;

  var ANCHO = 320, ALTO = 250, FIN = 6;
  /* El patio se ve un poco desde arriba: su orilla de atrás es FONDO, y cada
     animal pisa a su propia altura, más atrás o más adelante. Así caben a un
     tamaño que se ve en un teléfono sin encimarse. */
  var FONDO = 180, PIE = 196;
  var SR = 1.3, SP = 1.3, SG = 1.25, SH = 1.15, SM = 1.1;

  /* La troja: el cajón de las mazorcas, sobre tres postes que pisan en PIE. */
  var TROJA = { x: 14, y: 100, w: 100, h: 60 };
  /* Las mazorcas, en dos columnas y cuatro filas. Las ratas se comen las de
     las tres filas de arriba: seis de ocho, tres cuartos de la troja. */
  var MAZORCAS = [];
  [111, 124.5, 138, 151.5].forEach(function (y, fila) {
    [38, 86].forEach(function (x) { MAZORCAS.push({ x: x, y: y, comida: fila < 3 }); });
  });
  /* Las ratas, por dónde pisan: tres al principio (el gavilán se lleva la
     tercera) y al año siguiente diez: las dos que quedaron y ocho más, en el
     patio, debajo de la troja y adentro. La primera está amarrada al maíz, y
     la segunda, al gavilán. */
  var RATAS = [
    { x: 134, y: 206, desde: 0 }, { x: 176, y: 214, desde: 0 }, { x: 152, y: 234, desde: 0, presa: true },
    { x: 116, y: 236, desde: 4 }, { x: 40, y: 208, desde: 4 }, { x: 84, y: 216, desde: 4 },
    { x: 26, y: 117, desde: 4, dentro: true }, { x: 72, y: 117, desde: 4, dentro: true },
    { x: 26, y: 130.5, desde: 4, dentro: true }, { x: 72, y: 130.5, desde: 4, dentro: true }, { x: 48, y: 144, desde: 4, dentro: true }
  ];
  /* Los pollos: cuatro; el gavilán se lleva el de adelante a la derecha, y
     está amarrado al segundo. */
  var POLLOS = [{ x: 232, y: 196 }, { x: 266, y: 204 }, { x: 248, y: 234 }, { x: 284, y: 232, presa: true }];
  /* El gavilán: dónde tiene las patas cuando vuela arriba. */
  var GAV = [204, 58];
  /* La persona que lo espanta, por dónde pisa. */
  var PERSONA = [309, 200];
  function lomoPollo(p) { return [p.x + 3 * SP, p.y - 15 * SP]; }
  function lomoRata(r) { return [r.x + 6 * SR, r.y - 8 * SR]; }
  function bocaRata(r) { return [r.x - 4.4 * SR, r.y - 5 * SR]; }

  var TEXTOS = [
    'En la aldea hay pollos, ratas y maíz en la troja. Arriba anda un gavilán. ¿Qué tendrá que ver el gavilán con el maíz?',
    'El gavilán se lanza y se lleva un pollo. Eso sí lo ve todo el mundo, y a nadie le gusta.',
    'Lo que nadie ve: el gavilán también se come a las ratas, y las ratas se comen el maíz. Están amarrados.',
    'La gente se cansa y espanta al gavilán. Con él se va la amarra que tenía con las ratas, aunque nadie la vea.',
    'Al año siguiente, ya nadie se come a las ratas. Se multiplican, se meten en la troja y se comen el maíz.',
    'Con el gavilán se perdían pollos; sin él, tres cuartos de la troja. No se quitó un animal: se cortó una amarra.',
    '¿Y tú? Piensa en un animal que donde vives quieren espantar. Averigua a quién se come y dibuja sus amarras en tu cuaderno.'
  ];

  var A;
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  function f(v) { return Math.round(v * 100) / 100; }
  function pt(x, y) { return f(x) + ' ' + f(y); }

  /* Una rata de lado, mirando a la izquierda; (x, y) es donde pisa. */
  function rata(padre, x, y) {
    var el = A.el, s = SR, g = el('g', null, padre);
    el('path', { class: 'ec-rata-cola', d: 'M ' + pt(x + 13 * s, y - 4 * s) + ' Q ' + pt(x + 20 * s, y - 11 * s) + ' ' + pt(x + 24 * s, y - 3 * s) }, g);
    el('ellipse', { class: 'ec-rata', cx: f(x + 6 * s), cy: f(y - 4.2 * s), rx: f(7.6 * s), ry: f(4.2 * s) }, g);
    el('ellipse', { class: 'ec-rata', cx: f(x - s), cy: f(y - 5 * s), rx: f(3.9 * s), ry: f(3 * s) }, g);
    el('circle', { class: 'ec-rata-oreja', cx: f(x + s), cy: f(y - 8.4 * s), r: f(2 * s) }, g);
    el('circle', { class: 'ec-ojo', cx: f(x - 1.8 * s), cy: f(y - 5.8 * s), r: f(0.8 * s) }, g);
    el('path', { class: 'ec-rata-pata', d: 'M ' + pt(x + 2 * s, y - s) + ' L ' + pt(x + 2 * s, y) + ' M ' + pt(x + 10 * s, y - s) + ' L ' + pt(x + 10 * s, y) }, g);
    el('circle', { class: 'ec-punto', 'data-pisa': '', cx: f(x + 6 * s), cy: y, r: 0.5 }, g);
    el('circle', { class: 'ec-punto', 'data-lomo': '', cx: f(x + 6 * s), cy: f(y - 8 * s), r: 0.5 }, g);
    el('circle', { class: 'ec-punto', 'data-boca': '', cx: f(x - 4.4 * s), cy: f(y - 5 * s), r: 0.5 }, g);
    return g;
  }
  /* Un pollo de lado, mirando a la izquierda; (x, y) es donde pisa. */
  function pollo(padre, x, y, clase) {
    var el = A.el, s = SP, g = el('g', { class: clase || '' }, padre);
    el('path', { class: 'ec-pollo-pata', d: 'M ' + pt(x + s, y - 2 * s) + ' L ' + pt(x, y) + ' M ' + pt(x + 5 * s, y - 2 * s) + ' L ' + pt(x + 6 * s, y) }, g);
    el('path', { class: 'ec-pollo', d: 'M ' + pt(x + 9 * s, y - 12 * s) + ' L ' + pt(x + 14 * s, y - 17 * s) + ' L ' + pt(x + 12 * s, y - 7 * s) + ' Z' }, g);
    el('ellipse', { class: 'ec-pollo', cx: f(x + 3 * s), cy: f(y - 8 * s), rx: f(8.5 * s), ry: f(6.5 * s) }, g);
    el('circle', { class: 'ec-pollo', cx: f(x - 5 * s), cy: f(y - 15 * s), r: f(3.8 * s) }, g);
    el('path', { class: 'ec-cresta', d: 'M ' + pt(x - 7.5 * s, y - 18 * s) + ' Q ' + pt(x - 6 * s, y - 22 * s) + ' ' + pt(x - 4.5 * s, y - 19 * s) + ' Q ' + pt(x - 3 * s, y - 22 * s) + ' ' + pt(x - 2 * s, y - 18 * s) + ' Z' }, g);
    el('path', { class: 'ec-pico', d: 'M ' + pt(x - 8.5 * s, y - 16 * s) + ' L ' + pt(x - 11.5 * s, y - 14.8 * s) + ' L ' + pt(x - 8.5 * s, y - 13.8 * s) + ' Z' }, g);
    el('circle', { class: 'ec-ojo', cx: f(x - 5.8 * s), cy: f(y - 15.6 * s), r: f(0.8 * s) }, g);
    el('circle', { class: 'ec-punto', 'data-pisa': '', cx: f(x + 3 * s), cy: y, r: 0.5 }, g);
    el('circle', { class: 'ec-punto', 'data-lomo': '', cx: f(x + 3 * s), cy: f(y - 15 * s), r: 0.5 }, g);
    return g;
  }
  /* El gavilán con las alas abiertas; su origen son las patas. */
  function gavilan(padre, x, y) {
    var el = A.el, g = el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + SG + ')' }, padre);
    el('path', { class: 'ec-gav-ala', d: 'M -4 -11 Q -14 -26 -24 -24 Q -12 -16 2 -9 Z' }, g);
    el('path', { class: 'ec-gav-ala', d: 'M 3 -11 Q 13 -28 25 -27 Q 13 -17 7 -9 Z' }, g);
    el('path', { class: 'ec-gav', d: 'M 9 -8 L 17 -12 L 18 -4 Z' }, g);
    el('ellipse', { class: 'ec-gav', cx: 0, cy: -8, rx: 10, ry: 4.5 }, g);
    el('circle', { class: 'ec-gav', cx: -9, cy: -10, r: 3.6 }, g);
    el('path', { class: 'ec-gav-pico', d: 'M -12.2 -11 Q -15 -10.5 -13.5 -8 L -12 -9 Z' }, g);
    el('circle', { class: 'ec-ojo', cx: -9.8, cy: -11, r: 0.8 }, g);
    el('path', { class: 'ec-gav-pata', d: 'M -2 -4.5 L -1 0 M 2 -4.5 L 3 0' }, g);
    return g;
  }
  /* La persona que espanta al gavilán, con su vara; su origen son los pies. */
  function persona(padre, x, y) {
    var el = A.el, g = el('g', { transform: 'translate(' + x + ' ' + y + ') scale(' + SH + ')' }, padre);
    el('path', { class: 'ec-persona-pierna', d: 'M -2.5 0 L -1.5 -14 M 2.5 0 L 1.5 -14' }, g);
    el('rect', { class: 'ec-camisa', x: -6.5, y: -28, width: 12, height: 15, rx: 3 }, g);
    el('path', { class: 'ec-persona-brazo', d: 'M -5.5 -25 L -12.5 -37 M 4.5 -25 L 9.5 -38' }, g);
    el('path', { class: 'ec-vara', d: 'M -11.5 -34 L -18.5 -56' }, g);
    el('circle', { class: 'ec-cara', cx: -0.5, cy: -34, r: 5 }, g);
    el('ellipse', { class: 'ec-sombrero', cx: -0.5, cy: -38, rx: 8.5, ry: 2 }, g);
    el('rect', { class: 'ec-sombrero', x: -5, y: -44, width: 9, height: 6, rx: 2 }, g);
    el('circle', { class: 'ec-punto', 'data-punta-vara': '', cx: -18.5, cy: -56, r: 0.5 }, g);
    el('circle', { class: 'ec-punto', 'data-pisa': '', cx: 0, cy: 0, r: 0.5 }, g);
    return g;
  }

  var P = {};

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);
    el('rect', { class: 'ec-tierra', 'data-patio': '', x: 0, y: FONDO, width: ANCHO, height: ALTO - FONDO }, svg);
    el('path', { class: 'ec-zacate', d: 'M 0 ' + FONDO + ' L ' + ANCHO + ' ' + FONDO }, svg);

    /* ── La troja: postes, el cajón, las mazorcas, las tablas y el techo ── */
    [18, 61, 104].forEach(function (x) { el('rect', { class: 'ec-poste', 'data-poste': '', x: x, y: TROJA.y + TROJA.h, width: 6, height: PIE - TROJA.y - TROJA.h }, svg); });
    el('rect', { class: 'ec-troja-fondo', 'data-troja': '', x: TROJA.x, y: TROJA.y, width: TROJA.w, height: TROJA.h }, svg);
    P.mazorcas = MAZORCAS.map(function (m) {
      var s = SM;
      var hueco = el('ellipse', { class: 'ec-mazorca-hueco am-fuera', 'data-mazorca-hueco': '', cx: m.x, cy: m.y, rx: f(17 * s), ry: f(5.6 * s) }, svg);
      var g = el('g', { 'data-mazorca': '' }, svg);
      el('ellipse', { class: 'ec-mazorca', cx: m.x, cy: m.y, rx: f(17 * s), ry: f(5.6 * s) }, g);
      el('path', { class: 'ec-granos', d: 'M ' + pt(m.x - 12 * s, m.y) + ' L ' + pt(m.x + 11 * s, m.y) }, g);
      el('path', { class: 'ec-tusa', d: 'M ' + pt(m.x + 14 * s, m.y - 3 * s) + ' Q ' + pt(m.x + 22 * s, m.y - 7 * s) + ' ' + pt(m.x + 20 * s, m.y) + ' Q ' + pt(m.x + 22 * s, m.y + 6 * s) + ' ' + pt(m.x + 14 * s, m.y + 3 * s) + ' Z' }, g);
      return { g: g, hueco: hueco, m: m };
    });
    /* Las ratas de adentro van detrás de las tablas: están en la troja. */
    P.ratas = [];
    var dentro = el('g', null, svg);
    for (var t = TROJA.x + 7; t < TROJA.x + TROJA.w; t += 11) el('path', { class: 'ec-tabla', d: 'M ' + t + ' ' + TROJA.y + ' L ' + t + ' ' + (TROJA.y + TROJA.h) }, svg);
    el('rect', { class: 'ec-troja-marco', x: TROJA.x, y: TROJA.y, width: TROJA.w, height: TROJA.h }, svg);
    el('path', { class: 'ec-techo', d: 'M 6 102 L 64 70 L 122 102 Z' }, svg);

    /* ── Los animales del patio, de atrás hacia adelante: el que pisa más
       abajo tapa al de atrás ── */
    var patio = [];
    RATAS.forEach(function (r, i) { if (!r.dentro) patio.push({ y: r.y, rata: i }); });
    POLLOS.forEach(function (p, i) { patio.push({ y: p.y, pollo: i }); });
    patio.sort(function (a, b) { return a.y - b.y; });
    P.pollos = [];
    RATAS.forEach(function (r, i) {
      if (!r.dentro) return;
      var ver = el('g', { class: 'am-fuera', 'data-rata': 'dentro' }, dentro);
      var mueve = el('g', null, ver);
      rata(mueve, r.x, r.y);
      P.ratas[i] = { ver: ver, mueve: mueve, r: r };
    });
    patio.forEach(function (c) {
      if (c.rata !== undefined) {
        var r = RATAS[c.rata];
        var ver = el('g', { class: r.desde ? 'am-fuera' : '', 'data-rata': 'fuera' }, svg);
        var mueve = el('g', null, ver);
        rata(mueve, r.x, r.y);
        P.ratas[c.rata] = { ver: ver, mueve: mueve, r: r };
      } else {
        var p = POLLOS[c.pollo];
        /* El que se lleva el gavilán deja su silueta, de raya cortada. */
        var hueco = p.presa ? pollo(svg, p.x, p.y, 'ec-hueco am-fuera') : null;
        if (hueco) hueco.setAttribute('data-pollo-hueco', '');
        var verP = el('g', { 'data-pollo': '' }, svg);
        var mueveP = el('g', null, verP);
        pollo(mueveP, p.x, p.y);
        P.pollos[c.pollo] = { ver: verP, mueve: mueveP, hueco: hueco, p: p };
      }
    });

    /* ── La persona que espanta al gavilán (solo en el 3) ── */
    P.persona = el('g', { class: 'am-fuera', 'data-persona': '' }, svg);
    persona(P.persona, PERSONA[0], PERSONA[1]);
    P.fuera = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'fuera', x: 283, y: 150, 'font-size': 13, 'text-anchor': 'end' }, '¡Fuera!');

    /* ── Las amarras: dos del gavilán y una de las ratas con el maíz. La del
       maíz sale de la boca de la rata; las del gavilán, de sus patas ── */
    function amarra(k, a, b) {
      var g = el('g', { class: 'am-fuera', 'data-amarra': k }, svg);
      el('path', { class: 'ec-halo', d: 'M ' + pt(a[0], a[1]) + ' L ' + pt(b[0], b[1]) }, g);
      el('path', { class: 'ec-amarra', 'data-soga': '', d: 'M ' + pt(a[0], a[1]) + ' L ' + pt(b[0], b[1]) }, g);
      el('circle', { class: 'ec-nudo', cx: f(a[0]), cy: f(a[1]), r: 2.2 }, g);
      el('circle', { class: 'ec-nudo', cx: f(b[0]), cy: f(b[1]), r: 2.2 }, g);
      return g;
    }
    var lp = lomoPollo(POLLOS[1]), lr = lomoRata(RATAS[1]), bm = bocaRata(RATAS[0]);
    P.amarras = {
      pollos: amarra('pollos', [GAV[0] + 6, GAV[1] + 3], [lp[0], lp[1] - 3]),
      ratas: amarra('ratas', [GAV[0] - 6, GAV[1] + 3], [lr[0], lr[1] - 3]),
      maiz: amarra('maiz', bm, [TROJA.x + TROJA.w + 1, TROJA.y + 50])
    };
    texto(P.amarras.pollos, { class: 'am-rotulo', 'data-rotulo': 'amarra-pollos', x: 230, y: 50, 'font-size': 11.5, 'text-anchor': 'start' }, 'se lleva pollos');
    texto(P.amarras.ratas, { class: 'am-rotulo', 'data-rotulo': 'amarra-ratas', x: 176, y: 50, 'font-size': 11.5, 'text-anchor': 'end' }, 'se come ratas');
    var tm = el('text', { class: 'am-rotulo', 'data-rotulo': 'amarra-maiz', x: 128, y: 158, 'font-size': 11.5 }, P.amarras.maiz);
    var t1 = el('tspan', { x: 128, y: 158 }, tm); t1.textContent = 'se comen ';
    var t2 = el('tspan', { x: 128, y: 171 }, tm); t2.textContent = 'el maíz';

    /* ── El gavilán: una envoltura para verse y una por cada vuelo (baja
       por el pollo y sube, baja por la rata y sube, y se va). ── */
    P.gavVer = el('g', { 'data-gavilan': '' }, svg);
    P.gavVa = el('g', null, P.gavVer);
    P.baja1 = el('g', { 'data-vuelo': 'pollo-baja' }, P.gavVa);
    P.sube1 = el('g', { 'data-vuelo': 'pollo-sube' }, P.baja1);
    P.baja2 = el('g', { 'data-vuelo': 'rata-baja' }, P.sube1);
    P.sube2 = el('g', { 'data-vuelo': 'rata-sube' }, P.baja2);
    gavilan(P.sube2, GAV[0], GAV[1]);
    el('circle', { class: 'ec-punto', 'data-patas': '', cx: GAV[0], cy: GAV[1], r: 0.5 }, P.sube2);

    /* ── Los rótulos del tiempo y de lo que se perdió ── */
    P.anio = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'anio', x: 8, y: 18, 'font-size': 12.5 }, 'al año siguiente');
    P.sin = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'sin', x: 64, y: 58, 'font-size': 12.5, 'text-anchor': 'middle' }, 'sin el gavilán');
    P.con = el('g', { class: 'am-fuera', 'data-con': '' }, svg);
    el('path', { class: 'ec-halo', d: 'M 300 170 L 289 209' }, P.con);
    el('path', { class: 'ec-guia', 'data-guia': '', d: 'M 300 170 L 289 209' }, P.con);
    texto(P.con, { class: 'am-rotulo', 'data-rotulo': 'con', x: 318, y: 164, 'font-size': 12.5, 'text-anchor': 'end' }, 'con el gavilán');
  }

  var BAJA = 850, ARRIBA = 1700;

  function pintar(n, antes) {
    var entra = function (k) { return n === k && antes !== k; };
    var presaP = POLLOS[3], presaR = RATAS[2];
    var dP = [lomoPollo(presaP)[0] - GAV[0], lomoPollo(presaP)[1] - GAV[1]];
    var dR = [lomoRata(presaR)[0] - GAV[0], lomoRata(presaR)[1] - GAV[1]];

    /* El gavilán baja por el pollo en el 1 y por la rata en el 2, y sube
       con lo que se lleva. Bajar y subir son dos piezas, una dentro de otra:
       al final del paso vuelve a su sitio. */
    A.mover(P.baja1, n >= 1 ? dP[0] : 0, n >= 1 ? dP[1] : 0, 0, 1, 0);
    A.mover(P.sube1, n >= 1 ? -dP[0] : 0, n >= 1 ? -dP[1] : 0, 0, 1, entra(1) ? BAJA : 0);
    A.mover(P.baja2, n >= 2 ? dR[0] : 0, n >= 2 ? dR[1] : 0, 0, 1, 0);
    A.mover(P.sube2, n >= 2 ? -dR[0] : 0, n >= 2 ? -dR[1] : 0, 0, 1, entra(2) ? BAJA : 0);
    /* Con la gente, se va; y para verse, su propia envoltura. */
    A.mover(P.gavVa, n >= 3 ? 130 : 0, n >= 3 ? -95 : 0, 0, 1, entra(3) ? 400 : 0);
    A.ver(P.gavVer, n <= 2, entra(3) ? 800 : 0);

    /* Lo que se lleva sube con él, por el mismo camino y al mismo tiempo, y
       se apaga arriba. De vuelta con «Atrás» baja sin verse y aparece en su
       sitio: nadie lo ve volar solo. */
    P.pollos.forEach(function (q) {
      if (!q.p.presa) return;
      A.mover(q.mueve, n >= 1 ? -dP[0] : 0, n >= 1 ? -dP[1] : 0, 0, 1, entra(1) ? BAJA : 0);
      A.ver(q.ver, n < 1, entra(1) ? ARRIBA : antes >= 1 && n < 1 ? 800 : 0);
      A.ver(q.hueco, n >= 1, entra(1) ? BAJA : 0);
    });
    var nuevas = 0;
    P.ratas.forEach(function (q) {
      var r = q.r;
      if (r.presa) {
        A.mover(q.mueve, n >= 2 ? -dR[0] : 0, n >= 2 ? -dR[1] : 0, 0, 1, entra(2) ? BAJA : 0);
        A.ver(q.ver, n < 2, entra(2) ? ARRIBA : antes >= 2 && n < 2 ? 800 : 0);
      } else if (r.desde) {
        A.ver(q.ver, n >= r.desde, entra(4) ? 300 + (nuevas++) * 150 : 0);
      }
    });

    /* Las amarras: aparecen cuando el gavilán vuelve con la rata; las dos
       suyas se van con él. */
    A.ver(P.amarras.pollos, n === 2, entra(2) ? 2500 : entra(3) ? 400 : 0);
    A.ver(P.amarras.ratas, n === 2, entra(2) ? 2500 : entra(3) ? 400 : 0);
    A.ver(P.amarras.maiz, n >= 2, entra(2) ? 2500 : 0);

    A.ver(P.persona, n === 3, 0);
    A.ver(P.fuera, n === 3, entra(3) ? 200 : 0);

    /* Al año siguiente: las ratas se comen tres cuartos de la troja. */
    A.ver(P.anio, n >= 4, 0);
    var k = 0;
    P.mazorcas.forEach(function (q) {
      var comida = q.m.comida && n >= 4, d = entra(4) && q.m.comida ? 1500 + (k++) * 200 : 0;
      A.ver(q.g, !comida, d);
      A.ver(q.hueco, comida, d);
    });

    /* Lo que se perdió, con su rótulo. */
    A.ver(P.con, n >= 5, entra(5) ? 300 : 0);
    A.ver(P.sin, n >= 5, entra(5) ? 700 : 0);
  }

  function marcador(n) {
    return [
      { cifra: String(POLLOS.length), palabras: 'pollos, y un gavilán encima' },
      { cifra: String(POLLOS.length - 1), palabras: 'pollos: el gavilán se llevó uno' },
      { cifra: '2', palabras: 'ratas, pocas' },
      { cifra: '0', palabras: 'gavilanes: nadie se come a las ratas' },
      { cifra: String(RATAS.length - 1), palabras: 'ratas, al año siguiente' },
      { cifra: '¾', palabras: 'de la troja, perdido' },
      { cifra: '?', palabras: '¿a quién se come?' }
    ][n];
  }

  AnimacionMision.montar('#amAmarra', {
    vista: [ANCHO, ALTO],
    describe: 'El patio de una aldea: una troja con maíz, ratas, pollos y un gavilán arriba. El gavilán se lleva un pollo y una rata. La gente lo espanta, y al año siguiente las ratas se multiplican y se comen tres cuartos del maíz de la troja.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🦅 Mirar al gavilán', '🔍 ¿Y lo que no se ve?', '👋 Espantarlo', '📅 Al año siguiente', '⚖️ ¿Qué se perdió?', '💡 ¿Y tú?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
