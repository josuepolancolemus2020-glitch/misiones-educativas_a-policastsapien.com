/* ============================================================
   M.E.T.A.S · Ángulos y Bisectriz · El marco de la pizarra
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de don
   Tulio, que armó el marco de la pizarra nueva con cuatro listones y
   cortó cada punta «a ojo, como a la mitad»: le quedó un hueco en cada
   esquina, volvió a cortar, el marco salió más chico y se quedó sin un
   listón. La historia termina diciendo que cada corte tiene que ir por
   la mitad exacta del ángulo, y que esa línea se llama bisectriz. El
   aparato (botones, frase, marcador) vive en js/animacion-mision.js;
   aquí solo está el dibujo y dónde va cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  la esquina del marco mide 90°: ¿por dónde se corta cada
        listón para que casen? Se decide antes de tocar;
     1  a ojo, digamos a 40° cada una: las dos puntas suman 80°, a la
        esquina le faltan 10° y queda un hueco;
     2  la mitad exacta de la esquina es la bisectriz: parte los 90° en
        dos ángulos iguales, 90° ÷ 2 = 45°;
     3  con cada punta cortada por la bisectriz, a 45°, las dos suman
        90° y casan sin hueco;
     4  el marco entero: cuatro esquinas, ocho cortes, todos por la
        bisectriz;
     5  y sin transportador: se dobla la esquina de una hoja hasta que
        un borde caiga sobre el otro, y el doblez es la bisectriz.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **El hueco se ve y se mide.** «A ojo» no es un error vago: con
      cada punta a 40°, las dos suman 80° y a la esquina le faltan 10°,
      y esos 10° son una cuña oscura entre los dos listones. El 40° es un
      ejemplo (la historia no dice cuánto cortó don Tulio) y la frase lo
      dice con un «digamos».
   2. **Los cortes se miden en el dibujo, no se escriben.** El ángulo de
      cada punta sale de dónde está su esquina de madera, y la sonda lo
      mide ahí: que diga 40° lo que está cortado a 40° y que la cuña sea
      lo que le falta a la esquina.
   3. **Lo que el alumno puede hacer hoy, con lo que tiene.** Un
      transportador no lo hay en todas las casas; una hoja de cuaderno sí.
      Doblar la esquina hasta que un borde caiga sobre el otro da la
      bisectriz exacta de los 90°, y eso es verdad geométrica, no un truco:
      el doblez es el eje de simetría de la esquina.
   4. ⚠️ **La cuenta de la historia no puede caer en la prueba.** La
      conceptual preguntaba si dos ángulos de 45° suman 180° y partía un
      ángulo de 90° dos veces con la bisectriz; se cambiaron (en la misión
      y en la ficha). Y la forma de la operativa que ordenaba «cada mitad
      de la bisectriz de 90°» se corrió a otro ángulo (en angulos.js,
      _fueraDeLaAnimacion).
   5. **La madera es madera en las dos pantallas.** Los listones, la
      pizarra y la hoja llevan su color siempre; lo que se escribe encima
      va en tinta oscura fija, porque la tinta de la pantalla oscura es
      clara y sobre la madera no se leería.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amMarco')) return;

  var ANCHO = 320, ALTO = 220, FIN = 5;
  var RAD = Math.PI / 180;

  /* La esquina, de cerca: la punta de afuera de la esquina en (OX, OY),
     los listones de W de ancho, uno hacia la derecha y otro hacia abajo.
     Apartados, cada uno queda a SEP de la esquina: más que el ancho del
     listón, o los dos se enciman en la esquina y no se ven «apartados». */
  var OX = 40, OY = 20, W = 60, LH = 300, LV = 220, SEP = 72;
  var MADERA = '#e2b47c', VETA = '#c38e52', CANTO = '#94622e', TINTA = '#3b2a17';
  var A_OJO = 40, BISECTRIZ = 45;

  var TEXTOS = [
    'La esquina del marco mide 90°. ¿Por dónde se corta cada listón para que casen? Decídelo antes de tocar.',
    'Cortadas a ojo, digamos a 40° cada una, las dos puntas suman 80°. A la esquina le faltan 10° y queda un hueco.',
    'La mitad exacta de la esquina es la bisectriz: parte los 90° en dos ángulos iguales. 90° ÷ 2 = 45°.',
    'Con cada punta cortada por la bisectriz, a 45°, las dos suman 90° y casan sin hueco.',
    'El marco tiene cuatro esquinas: son ocho cortes, y todos van por la bisectriz. Así cierra y no se pierde listón.',
    '¿Sin transportador? Dobla la esquina de una hoja hasta que un borde caiga sobre el otro: el doblez es la bisectriz.'
  ];

  var A;
  var esquina, juegos = {}, hueco = {}, bis = {}, marco = {}, hoja = {};

  function r1(v) { return Math.round(v * 10) / 10; }
  function vertices(lista) { return lista.map(function (p) { return r1(p[0]) + ',' + r1(p[1]); }).join(' '); }
  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  function tinta(padre, x, y, t, fz, clase) {
    return texto(padre, { class: clase || 'bm-rotulo', x: r1(x), y: r1(y), 'text-anchor': 'middle', 'font-size': fz || 14,
      style: 'fill:' + TINTA + ';font-family:Fredoka,sans-serif;font-weight:700' }, t);
  }

  /* Un listón cortado a t grados, medido desde su canto de afuera. El
     cuerpo es lo que queda; la sobra, el triángulo que se va con el corte.
     El borde de la madera (el canto) va aparte y NO pasa por la raya del
     corte: antes de cortar, el listón está entero y ahí no hay nada que
     ver. Con el borde puesto en el cuerpo y en la sobra, el listón sin
     cortar ya enseñaba por dónde se iba a cortar, que es justo lo que el
     paso 0 le pregunta al alumno. Esa raya la pinta la sierra al cortar.
     ⚠️ Y la sobra MONTA un pelo (1.5) sobre el cuerpo: dos piezas del mismo
     color que solo se tocan dejan en la juntura una costura tenue (el
     suavizado del borde de cada una deja ver el fondo), y esa costura
     también enseñaba el corte. Montadas, no hay juntura que ver; al caerse,
     la sobra se lleva su pelo y el cuerpo queda con su corte exacto. */
  var MONTA = 1.5;
  function geometria(lado, t) {
    var k = r1(W / Math.tan(t * RAD));
    if (lado === 'h') return {
      cuerpo: [[0, 0], [LH, 0], [LH, W], [k, W]], cantoCuerpo: 'M 0 0 H ' + LH + ' V ' + W + ' H ' + k,
      sobra: [[0, 0], [MONTA, 0], [k + MONTA, W], [0, W]], cantoSobra: 'M ' + k + ' ' + W + ' H 0 V 0',
      corte: [0, 0, k, W], rotulo: [44 * Math.cos(t / 2 * RAD), 44 * Math.sin(t / 2 * RAD) + 5] };
    return {
      cuerpo: [[0, 0], [W, k], [W, LV], [0, LV]], cantoCuerpo: 'M ' + W + ' ' + k + ' V ' + LV + ' H 0 V 0',
      sobra: [[0, 0], [W, 0], [W, k + MONTA], [0, MONTA]], cantoSobra: 'M 0 0 H ' + W + ' V ' + k,
      corte: [0, 0, W, k], rotulo: [44 * Math.sin(t / 2 * RAD), 44 * Math.cos(t / 2 * RAD) + 5] };
  }

  var CANTO_ESTILO = 'fill:none;stroke:' + CANTO + ';stroke-width:1.5;stroke-linejoin:round;stroke-linecap:round';

  /* Un listón entero, con todo lo suyo dentro de una capa (v) que se
     enciende y se apaga: su cuerpo, su sobra, la sierra y su rótulo. Cada
     pieza de dentro tiene además su propia capa, porque en el paso del
     corte cada una se mueve o se apaga a su hora. */
  function liston(juego, lado, t) {
    var el = A.el, gm = geometria(lado, t);
    var g = el('g', { class: 'bm-liston-g' }, esquina);
    var v = el('g', null, g);
    el('polygon', { class: 'bm-liston', 'data-juego': juego, 'data-lado': lado, points: vertices(gm.cuerpo), style: 'fill:' + MADERA }, v);
    /* Las vetas, lejos de la punta: así no cruzan el corte. */
    var vetas = '';
    [15, 30, 45].forEach(function (d) { vetas += lado === 'h' ? 'M 84 ' + d + ' H ' + (LH - 4) + ' ' : 'M ' + d + ' 84 V ' + (LV - 4) + ' '; });
    el('path', { d: vetas.trim(), style: 'fill:none;stroke:' + VETA + ';stroke-width:1.2;stroke-linecap:round' }, v);
    el('path', { class: 'bm-canto', d: gm.cantoCuerpo, style: CANTO_ESTILO }, v);
    var r = { g: g, v: v, lado: lado, t: t };
    r.sobra = el('g', null, v);
    r.sobraV = el('g', null, r.sobra);
    el('polygon', { class: 'bm-sobra', points: vertices(gm.sobra), style: 'fill:' + MADERA }, r.sobraV);
    el('path', { class: 'bm-canto', d: gm.cantoSobra, style: CANTO_ESTILO }, r.sobraV);
    var c = gm.corte;
    /* La raya de la sierra se dibuja (A.trazar) dentro de una capa que se
       enciende y se apaga (A.ver): las dos cosas usan la demora del
       elemento, y en una sola pieza una pisaría a la otra. */
    r.sierraG = el('g', null, v);
    r.sierra = el('path', { class: 'bm-sierra', d: 'M ' + r1(c[0]) + ' ' + r1(c[1]) + ' L ' + r1(c[2]) + ' ' + r1(c[3]),
      style: 'fill:none;stroke:' + TINTA + ';stroke-width:2;stroke-linecap:round' }, r.sierraG);
    r.rotulo = tinta(v, gm.rotulo[0], gm.rotulo[1], t + '°');
    return r;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── La esquina, de cerca ── */
    esquina = el('g', { class: 'bm-esquina' }, svg);
    A.mover(esquina, OX, OY, 0, 1, 0);

    /* Dónde va la esquina, mientras los listones están apartados: sus dos
       lados en raya cortada, la marca del ángulo recto y sus 90°. */
    bis.guia = el('g', { class: 'bm-guia' }, esquina);
    el('path', { d: 'M 0 0 H 110 M 0 0 V 110', style: 'fill:none;stroke:var(--gray,#636e72);stroke-width:1.5;stroke-dasharray:5 4' }, bis.guia);
    el('path', { d: 'M 16 0 V 16 H 0', style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:1.5' }, bis.guia);
    texto(bis.guia, { class: 'am-letra bm-rotulo', x: 34, y: 38, 'text-anchor': 'middle', 'font-size': 15 }, '90°');

    /* El hueco que dejan dos puntas a 40°: la cuña entre los dos cortes. */
    var k = W / Math.tan(A_OJO * RAD);
    hueco.cuna = el('polygon', { class: 'bm-hueco am-fuera', points: vertices([[0, 0], [k, W], [W, W], [W, k]]),
      style: 'fill:' + TINTA + ';fill-opacity:0.85' }, esquina);

    juegos.ojo = { h: liston('ojo', 'h', A_OJO), v: liston('ojo', 'v', A_OJO) };
    juegos.bis = { h: liston('bis', 'h', BISECTRIZ), v: liston('bis', 'v', BISECTRIZ) };

    /* La raya del rótulo entra en la cuña: señala lo que falta, no el
       hueco del marco, que es la pizarra. */
    hueco.raya = el('path', { class: 'bm-flecha am-fuera', d: 'M 94 96 L 57 57', style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:1.5;stroke-linecap:round' }, esquina);
    hueco.rotulo = texto(esquina, { class: 'am-letra bm-rotulo am-fuera', x: 98, y: 110, 'font-size': 15 }, 'hueco');

    /* La esquina sola: sus dos lados, la marca del ángulo recto, la
       bisectriz y las dos mitades. */
    bis.lados = el('path', { class: 'bm-rayo am-fuera', d: 'M 0 0 H 262 M 0 0 V 192', style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:2.2;stroke-linecap:round' }, esquina);
    bis.recto = el('path', { class: 'bm-recto am-fuera', d: 'M 16 0 V 16 H 0', style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:1.5' }, esquina);
    bis.rayoG = el('g', null, esquina);
    bis.rayo = el('path', { class: 'am-trazo bm-bisectriz', d: 'M 0 0 L 170 170', style: 'stroke-width:2.6;stroke-linecap:round' }, bis.rayoG);
    var c45 = r1(48 * Math.cos(45 * RAD));
    bis.arcos = el('path', { class: 'am-trazo bm-arco am-fuera', d: 'M 48 0 A 48 48 0 0 1 ' + c45 + ' ' + c45 + ' M ' + c45 + ' ' + c45 + ' A 48 48 0 0 1 0 48', style: 'stroke-width:2' }, esquina);
    bis.mitades = [22.5, 67.5].map(function (a) {
      return texto(esquina, { class: 'am-letra bm-rotulo bm-mitad am-fuera', x: r1(70 * Math.cos(a * RAD)), y: r1(70 * Math.sin(a * RAD) + 5), 'text-anchor': 'middle', 'font-size': 15 }, '45°');
    });
    bis.nombre = texto(esquina, { class: 'am-letra bm-rotulo am-fuera', x: 142, y: 128, 'font-size': 15 }, 'bisectriz');

    /* ── El marco entero, con la pizarra ── */
    marco.g = el('g', { class: 'bm-marco-g' }, svg);
    var X0 = 50, Y0 = 22, X1 = 270, Y1 = 196, G = 22;
    marco.pizarra = el('rect', { class: 'bm-pizarra am-fuera', x: X0 + G, y: Y0 + G, width: X1 - X0 - 2 * G, height: Y1 - Y0 - 2 * G, style: 'fill:#2e4a3a' }, marco.g);
    marco.listones = [
      [[X0, Y0], [X1, Y0], [X1 - G, Y0 + G], [X0 + G, Y0 + G]],
      [[X1, Y0], [X1, Y1], [X1 - G, Y1 - G], [X1 - G, Y0 + G]],
      [[X1, Y1], [X0, Y1], [X0 + G, Y1 - G], [X1 - G, Y1 - G]],
      [[X0, Y1], [X0, Y0], [X0 + G, Y0 + G], [X0 + G, Y1 - G]]
    ].map(function (p, i) {
      /* Cada listón entra desde afuera de su lado (g) y se enciende a la
         vez (v); la capa de dentro no lleva demora, así la de fuera manda. */
      var g = el('g', null, marco.g), v = el('g', null, g);
      el('polygon', { class: 'bm-marco-liston', points: vertices(p), style: 'fill:' + MADERA + ';stroke:' + CANTO + ';stroke-width:1.5;stroke-linejoin:round' }, v);
      var fuera = [[0, -24], [24, 0], [0, 24], [-24, 0]][i];
      return { g: g, v: v, fuera: fuera };
    });

    /* ── La hoja que se dobla ── */
    hoja.g = el('g', { class: 'bm-hoja-g' }, svg);
    var HX = 85, HY = 35, L = 150;
    hoja.base = el('polygon', { class: 'bm-hoja', points: vertices([[HX, HY], [HX + L, HY + L], [HX, HY + L]]), style: 'fill:#fbfaf5;stroke:#b9b4a6;stroke-width:1.2' }, hoja.g);
    var rayas = '';
    for (var y = HY + 16; y < HY + L; y += 16) rayas += 'M ' + HX + ' ' + y + ' H ' + (HX + (y - HY)) + ' ';
    el('path', { d: rayas.trim(), style: 'fill:none;stroke:#9cc3e6;stroke-width:1' }, hoja.g);
    /* La solapa (la mitad de arriba) se dobla sobre la otra y se vuelve a
       abrir: dos capas, porque son dos vueltas en el mismo paso. */
    hoja.dobla = el('g', null, hoja.g);
    hoja.abre = el('g', null, hoja.dobla);
    var rayasS = '';
    for (var y2 = HY + 16; y2 < HY + L; y2 += 16) rayasS += 'M ' + (HX + (y2 - HY)) + ' ' + y2 + ' H ' + (HX + L) + ' ';
    hoja.solapa = el('polygon', { class: 'bm-solapa', points: vertices([[HX, HY], [HX + L, HY], [HX + L, HY + L]]), style: 'fill:#f4f1e6;stroke:#b9b4a6;stroke-width:1.2' }, hoja.abre);
    el('path', { d: rayasS.trim(), style: 'fill:none;stroke:#9cc3e6;stroke-width:1' }, hoja.abre);
    hoja.origen = [HX, HY];
    hoja.pliegue = el('path', { class: 'bm-pliegue am-fuera', d: 'M ' + HX + ' ' + HY + ' L ' + (HX + L) + ' ' + (HY + L),
      style: 'fill:none;stroke:#3b2a17;stroke-width:1.6;stroke-dasharray:6 4' }, hoja.g);
    var c36 = r1(40 * Math.cos(45 * RAD));
    hoja.arcos = el('path', { class: 'bm-arco-hoja am-fuera', d: 'M ' + (HX + 40) + ' ' + HY + ' A 40 40 0 0 1 ' + (HX + c36) + ' ' + (HY + c36) + ' M ' + (HX + c36) + ' ' + (HY + c36) + ' A 40 40 0 0 1 ' + HX + ' ' + (HY + 40),
      style: 'fill:none;stroke:var(--am-pri);stroke-width:2' }, hoja.g);
    hoja.mitades = [22.5, 67.5].map(function (a) {
      var t = tinta(hoja.g, HX + 60 * Math.cos(a * RAD), HY + 60 * Math.sin(a * RAD) + 5, '45°', 15, 'bm-rotulo bm-mitad-hoja');
      t.classList.add('am-fuera');
      return t;
    });
  }

  /* La solapa se refleja sobre el doblez (la diagonal que sale de la
     esquina a 45°): girar, aplastar al revés y desgirar. Con scaleY de 1 a
     −1 la solapa se ve bajar hasta el doblez y caer del otro lado. */
  function doblar(n, cerrada, demora) {
    var o = hoja.origen;
    n.style.setProperty('--d', Math.round(demora) + 'ms');
    n.style.transform = 'translate(' + o[0] + 'px,' + o[1] + 'px) rotate(45deg) scaleY(' + (cerrada ? -1 : 1) + ') rotate(-45deg) translate(' + (-o[0]) + 'px,' + (-o[1]) + 'px)';
  }

  /* Un par de listones: apartados y enteros hasta su paso; en su paso la
     sierra corta los dos, la sobra se cae y se apaga, y los dos llegan a la
     esquina. Los de a ojo se cortan en el paso 1 y los de la bisectriz en
     el 3, con la misma sierra y al mismo ritmo: el alumno compara dos
     cortes hechos igual, y lo único distinto es por dónde. */
  function cortarYJuntar(par, n, paso, llega, t0) {
    var cortado = n >= paso;
    function d(ms) { return llega ? t0 + ms : 0; }
    ['h', 'v'].forEach(function (lado) {
      /* Cada sobra cae hacia SU lado (la del listón acostado hacia abajo y
         la del parado hacia afuera): las dos puntas miran a la esquina, y
         cayendo hacia ella se cruzaban en el aire. */
      var p = par[lado], fuera = lado === 'h' ? [SEP, 0] : [0, SEP], cae = lado === 'h' ? [-2, 16, 14] : [-18, 8, -16];
      A.trazar(p.sierra, cortado, d(0));
      A.ver(p.sierraG, n === paso, 0);
      A.mover(p.sobra, cortado ? cae[0] : 0, cortado ? cae[1] : 0, cortado ? cae[2] : 0, 1, d(900));
      A.ver(p.sobraV, !cortado, d(1050));
      A.mover(p.g, cortado ? 0 : fuera[0], cortado ? 0 : fuera[1], 0, 1, d(1500));
      A.ver(p.rotulo, n === paso, d(2400));
    });
  }

  function pintar(n, antes) {
    var adelante = n > antes;
    function d(ms) { return adelante ? ms : 0; }
    var llega1 = adelante && n === 1, llega2 = adelante && n === 2, llega3 = adelante && n === 3, llega4 = adelante && n === 4, llega5 = adelante && n === 5;
    var cerca = n <= 3;

    /* ── Los listones cortados a ojo ── */
    A.ver(juegos.ojo.h.v, n <= 1, 0);
    A.ver(juegos.ojo.v.v, n <= 1, 0);
    cortarYJuntar(juegos.ojo, n, 1, llega1, 200);
    A.ver(bis.guia, n === 0, 0);
    A.ver(hueco.cuna, n === 1, d(llega1 ? 2400 : 0));
    A.ver(hueco.raya, n === 1, d(llega1 ? 2800 : 0));
    A.ver(hueco.rotulo, n === 1, d(llega1 ? 2800 : 0));

    /* ── La esquina sola, y su bisectriz ── */
    A.ver(bis.lados, n === 2, d(llega2 ? 300 : 0));
    A.ver(bis.recto, n === 2, d(llega2 ? 300 : 0));
    A.trazar(bis.rayo, n === 2 || n === 3, llega2 ? 700 : 0);
    A.ver(bis.rayoG, n === 2 || n === 3, 0);
    A.ver(bis.arcos, n === 2, d(llega2 ? 1500 : 0));
    bis.mitades.forEach(function (t) { A.ver(t, n === 2, d(llega2 ? 1700 : 0)); });
    A.ver(bis.nombre, n === 2, d(llega2 ? 1300 : 0));

    /* ── Los listones cortados por la bisectriz: llegan enteros y
       apartados, y la sierra los corta a 45° ── */
    A.ver(juegos.bis.h.v, n === 3, d(llega3 ? 250 : 0));
    A.ver(juegos.bis.v.v, n === 3, d(llega3 ? 250 : 0));
    cortarYJuntar(juegos.bis, n, 3, llega3, 700);

    /* La esquina de cerca se va cuando se ve el marco entero. */
    A.ver(esquina, cerca, 0);

    /* ── El marco entero ── */
    A.ver(marco.pizarra, n === 4, d(llega4 ? 300 : 0));
    marco.listones.forEach(function (l, i) {
      A.mover(l.g, n === 4 ? 0 : l.fuera[0], n === 4 ? 0 : l.fuera[1], 0, 1, llega4 ? 500 + 250 * i : 0);
      A.ver(l.v, n === 4, d(llega4 ? 450 + 250 * i : 0));
    });

    /* ── La hoja: se dobla, se abre, y queda el doblez ── */
    A.ver(hoja.g, n === 5, d(llega5 ? 200 : 0));
    doblar(hoja.dobla, n === 5, llega5 ? 700 : 0);
    doblar(hoja.abre, n === 5, llega5 ? 1900 : 0);
    A.ver(hoja.pliegue, n === 5, d(llega5 ? 2700 : 0));
    A.ver(hoja.arcos, n === 5, d(llega5 ? 2900 : 0));
    hoja.mitades.forEach(function (t) { A.ver(t, n === 5, d(llega5 ? 3000 : 0)); });
  }

  function marcador(n) {
    return [
      { cifra: '90°', palabras: 'la esquina del marco' },
      { cifra: '40° + 40° = 80°', palabras: 'faltan 10°: queda un hueco' },
      { cifra: '90° ÷ 2 = 45°', palabras: 'la bisectriz' },
      { cifra: '45° + 45° = 90°', palabras: 'la esquina cierra' },
      { cifra: '8 cortes', palabras: 'todos a 45°' },
      { cifra: '45° y 45°', palabras: 'el doblez es la bisectriz' }
    ][n];
  }

  AnimacionMision.montar('#amMarco', {
    vista: [ANCHO, ALTO],
    describe: 'La esquina del marco de una pizarra con dos listones de madera: cortados a ojo dejan un hueco, y cortados por la bisectriz, a 45°, casan. Al final, el marco entero y una hoja que se dobla por la bisectriz de su esquina.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🪚 Cortar a ojo', '✂️ La mitad exacta', '🪚 Cortar a 45°', '🖼️ El marco entero', '📄 Con una hoja', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
