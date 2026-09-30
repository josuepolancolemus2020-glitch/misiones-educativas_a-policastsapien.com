/* ============================================================
   M.E.T.A.S · El Sistema Endocrino · «Por qué la hora importa»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de doña Nely:
   tiene que tomar su medicina a la misma hora todos los días, y el día
   que se le pasa no le pasa nada en el momento, sino horas después. Su
   nieto no entiende tanto pleito con el reloj. La historia termina
   diciendo que el cuerpo da órdenes de dos maneras, por cable (llega al
   instante) y por la sangre (tarda), y que por tardar, las fallas de la
   segunda se sienten mucho después. El aparato (botones, frase,
   marcador) vive en js/animacion-mision.js; aquí solo está el dibujo y
   dónde va cada pieza en cada paso.

   Es doña Nely de frente. Por dentro lleva un cable, de la cabeza a una
   mano, y la sangre: un camino que baja de la cabeza al corazón y del
   corazón sale a los dos brazos y a las dos piernas. En la cabeza, una
   glándula. A la derecha, desde el paso 3, un reloj con su hora de la
   medicina marcada y una barra con lo que le queda en la sangre.

     0  de la cabeza salen dos órdenes a la vez: ¿cuál llega primero?;
     1  la del cable llega enseguida, y a un solo lugar: la mano se
        mueve. La de la sangre tarda, pero llega a todo el cuerpo;
     2  la cabeza deja de mandar: la del cable se acaba al instante, y la
        de la sangre se queda un buen rato;
     3  la medicina también va por la sangre: se gasta durante el día, y
        la de cada mañana llega antes de que se acabe;
     4  el día que se le pasa, todavía le queda de ayer: no siente nada.
        Horas después ya no alcanza, y ahí lo siente;
     5  por eso la hora importa. Y la pregunta es del alumno: ¿qué le
        dirías a su nieto?

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Las dos órdenes salen a la vez y del mismo sitio, y llegan a la
      misma mano.** Así la única diferencia que se ve es el camino: el
      cable va derecho y rápido, y la sangre baja al corazón y de ahí sale
      a todo el cuerpo. La sonda mide cuándo llega cada una a esa mano,
      con la demora de cada tramo.
   2. ⚠️ **La hora se ve pasar, y la barra baja con ella.** La aguja da
      una vuelta cada doce horas, y la barra pierde un cuadro cada seis:
      las dos cosas van con el mismo reloj, así que lo que la barra dice
      a las ocho de la noche es lo que se ve a las ocho de la noche. Es un
      esquema, y se dice: ninguna medicina se gasta así de parejo.
   3. ⚠️ **«No siente nada» y «ahí lo siente» se miden en la barra.** La
      raya de lo que hace falta está a tres cuadros. A la hora en que se
      le pasa la toma, todavía tiene cuatro; la cara cambia justo cuando
      la barra baja de la raya, doce horas después. La sonda lo cuenta.
   4. ⚠️ **Lo que pregunta la prueba no se dice.** Ni «hormona», ni
      «mensajero», ni «químico» ni «eléctrico» (es la pregunta de qué es
      una hormona), ni el nombre de ninguna glándula ni de ninguna
      hormona, ni la llave y la cerradura, ni si llega lejos. La glándula
      es «una glándula», sin nombre. Y la prueba se cambió donde la
      historia o esta animación ya contestaban: que las hormonas viajan
      por la sangre, que las glándulas las vierten directo a la sangre,
      que actúan lejos de donde salieron, qué sistema es más lento y más
      duradero, y en pensamiento crítico, el error de los «mensajes
      eléctricos» y la pregunta de por qué el efecto es lento.
   5. **No se dice qué medicina es.** La historia no lo dice, y todo lo
      que se afirma de ella vale para cualquiera que se tome por la boca
      una vez al día: que va por la sangre, que se gasta, que el olvido se
      siente después.
   6. **Nada se dice solo con color.** La orden del cable va gruesa y
      amarilla y la de la sangre, verde y por dentro de los vasos; la
      toma que se le pasó lleva una ✗, y la raya de lo que hace falta va
      cortada. Doña Nely, el reloj y la barra son como son en la pantalla
      clara y en la oscura.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amReloj')) return;

  var ANCHO = 320, ALTO = 240, FIN = 5;
  var HOMBRO = [58, 80];                          // donde gira el brazo del cable
  var GLANDULA = [93, 44];
  var CENTRADA = 70;                              // cuánto se corre doña Nely hasta el paso 2
  var CORAZON = [92, 100];
  var BOCA = [80, 58];
  var RELOJ = [190, 64, 30];                      // centro y radio
  var HORA_TOMA = 8;                              // las ocho: su hora
  var TUBO = [262, 58, 28, 138];                  // x, y, ancho, alto
  var CELDAS = 8, FALTA = 3;                      // con menos de 3, se siente
  var TRAMO = 36;
  var MS_HORA = 100;                              // la aguja: 2,4 s por día
  var GIRO_BRAZO = [0, 20, 0, 0, 0, 0];

  var TEXTOS = [
    'De la cabeza de doña Nely salen dos órdenes a la vez: una por un cable y otra por la sangre. ¿Cuál llega primero?',
    'La del cable llega enseguida, y a un solo lugar: la mano. La de la sangre tarda, pero da la vuelta a todo el cuerpo.',
    'Cuando la cabeza deja de mandar, la orden del cable se acaba al instante. La de la sangre se queda un buen rato.',
    'La medicina de doña Nely también va por la sangre. Se gasta durante el día, y la de cada mañana llega antes de que se acabe.',
    'El día que se le pasa, todavía le queda de ayer y no siente nada. Horas después ya no alcanza, y ahí lo siente.',
    'Por eso la hora importa: lo que va por la sangre se nota tarde, también cuando falta. ¿Qué le dirías a su nieto?'
  ];

  var A;
  function r2(v) { return Math.round(v * 100) / 100; }
  function largo(pts) {
    var L = 0;
    for (var i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return L;
  }
  /* Parte un camino en tramos del mismo largo: cada tramo se dibuja
     entero en su turno, así todo corre a paso parejo. */
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
  /* Una orden que corre por un camino: sus tramos se encienden uno detrás
     de otro. La del cable corre al doble (se-rapido: 0,4 s por tramo). */
  function senal(padre, pts, attrs, clase, uno) {
    var g = A.el('g', attrs, padre), trozos = [];
    (uno ? [pts] : tramos(pts)).forEach(function (t, k) {
      trozos.push(A.el('path', { class: clase, 'data-tramo': k, d: d(t) }, g));
    });
    return { g: g, trozos: trozos, n: trozos.length, ms: clase.indexOf('se-rapido') >= 0 ? 400 : 800 };
  }
  function correr(s, si, desde) {
    s.trozos.forEach(function (t, k) { A.trazar(t, si, si ? desde + k * s.ms : 0); });
    return desde + s.n * s.ms;
  }
  /* Dónde cae una hora en el borde del reloj (las 12 arriba). */
  function enReloj(hora, r) {
    var a = hora / 12 * 2 * Math.PI;
    return [RELOJ[0] + r * Math.sin(a), RELOJ[1] - r * Math.cos(a)];
  }
  /* La cápsula de la medicina, centrada en (0, 0). */
  function capsula(padre) {
    var g = A.el('g', {}, padre);
    A.el('path', { class: 'se-cap-a', d: 'M 0 -3.6 L -5 -3.6 A 3.6 3.6 0 0 0 -5 3.6 L 0 3.6 Z' }, g);
    A.el('path', { class: 'se-cap-b', d: 'M 0 -3.6 L 5 -3.6 A 3.6 3.6 0 0 1 5 3.6 L 0 3.6 Z' }, g);
    A.el('path', { class: 'se-cap-borde', d: 'M -5 -3.6 L 5 -3.6 A 3.6 3.6 0 0 1 5 3.6 L -5 3.6 A 3.6 3.6 0 0 1 -5 -3.6 Z M 0 -3.6 L 0 3.6' }, g);
    return g;
  }

  var P = {};

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── Doña Nely, de frente ── */
    /* Del paso 0 al 2 va en el centro; en el paso 3 se corre a la izquierda
       para hacerles sitio al reloj y a la barra. Todo lo suyo va adentro:
       el cuerpo, los caminos, las órdenes y sus nombres. */
    P.cuerpo = el('g', { class: 'am-viaja', 'data-nely': '' }, svg);
    var cu = P.cuerpo;
    el('rect', { class: 'se-pierna', x: 62, y: 194, width: 14, height: 28 }, cu);
    el('rect', { class: 'se-pierna', x: 84, y: 194, width: 14, height: 28 }, cu);
    el('ellipse', { class: 'se-zapato', cx: 69, cy: 223, rx: 9, ry: 3.5 }, cu);
    el('ellipse', { class: 'se-zapato', cx: 91, cy: 223, rx: 9, ry: 3.5 }, cu);
    /* El brazo de la derecha (el izquierdo de ella), quieto. */
    el('path', { class: 'se-brazo-borde', d: 'M 102 80 L 120 150' }, cu);
    el('path', { class: 'se-brazo', d: 'M 102 80 L 120 150' }, cu);
    el('circle', { class: 'se-piel', 'data-mano2': '', cx: 121, cy: 155, r: 6.5 }, cu);
    el('path', { class: 'se-vestido', 'data-cuerpo': '', d: 'M 54 74 L 106 74 L 116 196 L 44 196 Z' }, cu);
    el('rect', { class: 'se-piel', x: 71, y: 64, width: 18, height: 11 }, cu);
    el('circle', { class: 'se-pelo', cx: 80, cy: 22, r: 9 }, cu);
    el('circle', { class: 'se-piel', 'data-cabeza': '', cx: 80, cy: 46, r: 21 }, cu);
    el('path', { class: 'se-pelo', d: 'M 59 45 Q 59 25 80 25 Q 101 25 101 45 Q 95 35 80 35 Q 65 35 59 45 Z' }, cu);
    el('circle', { class: 'se-ojo', cx: 75, cy: 49, r: 1.9 }, cu);
    el('circle', { class: 'se-ojo', cx: 85, cy: 49, r: 1.9 }, cu);
    /* Cómo se siente: la sonrisa, o la boca caída con la gota de sudor. */
    P.feliz = el('g', { 'data-cara': 'bien' }, cu);
    el('path', { class: 'se-boca', d: 'M 76 57 Q 80 60.5 84 57' }, P.feliz);
    P.triste = el('g', { class: 'am-fuera', 'data-cara': 'mal' }, cu);
    el('path', { class: 'se-boca', d: 'M 76 60 Q 80 56.5 84 60' }, P.triste);
    el('path', { class: 'se-gota', d: 'M 64 39 Q 61 45 64 47 Q 67 45 64 39 Z' }, P.triste);

    /* ── La glándula, dentro de la cabeza, con su brillo cuando manda ── */
    P.brillo = el('circle', { class: 'se-brillo am-fuera', 'data-brillo': '', cx: GLANDULA[0], cy: GLANDULA[1], r: 7 }, cu);
    el('ellipse', { class: 'se-glandula', 'data-glandula': '', cx: GLANDULA[0], cy: GLANDULA[1], rx: 4, ry: 3.2 }, cu);

    /* ── Los caminos: la sangre (pálida) y el cable (pálido) ──
       Salen por los lados de la cabeza, no por la cara: el cable por la
       izquierda y la sangre por la derecha, y los dos bajan por el cuello. */
    var V0 = [[GLANDULA[0], GLANDULA[1] + 3.2], [89, 64], [91, 82], [CORAZON[0], CORAZON[1] - 5]];
    var V1 = [[CORAZON[0], CORAZON[1]], [101, 84], [119.5, 150]];
    var V2a = [[CORAZON[0], CORAZON[1]], [74, 90], [60.1, 81]];
    var V2b = [[60.1, 81], [42.2, 150.5]];
    var V3 = [[CORAZON[0], CORAZON[1] + 4], [94, 150], [91, 194], [91, 218]];
    var V4 = [[CORAZON[0], CORAZON[1] + 4], [78, 122], [69, 160], [69, 194], [69, 218]];
    var C1 = [[68, 46], [70, 64], [64, 76], [55.9, 79.5]];
    var C2 = [[55.9, 79.5], [37.9, 149.5]];
    [V0, V1, V2a, V3, V4].forEach(function (v) { el('path', { class: 'se-vaso', d: d(v) }, cu); });
    el('path', { class: 'se-nervio', d: d(C1) }, cu);

    /* El brazo del cable: gira desde el hombro, y lo que va por dentro gira
       con él (el cable y el vaso). */
    P.brazo = el('g', { class: 'am-viaja', 'data-brazo': '' }, cu);
    P.brazo.style.transformOrigin = HOMBRO[0] + 'px ' + HOMBRO[1] + 'px';
    el('path', { class: 'se-brazo-borde', d: 'M 58 80 L 40 150' }, P.brazo);
    el('path', { class: 'se-brazo', d: 'M 58 80 L 40 150' }, P.brazo);
    el('circle', { class: 'se-piel', 'data-mano': '', cx: 39, cy: 155, r: 6.5 }, P.brazo);
    el('path', { class: 'se-vaso', d: d(V2b) }, P.brazo);
    el('path', { class: 'se-nervio', d: d(C2) }, P.brazo);

    /* ── Las dos órdenes ── */
    P.o0 = senal(cu, V0, { 'data-orden': 'cabeza-corazon' }, 'se-orden');
    P.o1 = senal(cu, V1, { 'data-orden': 'brazo-quieto' }, 'se-orden');
    P.o2a = senal(cu, V2a, { 'data-orden': 'al-hombro' }, 'se-orden');
    P.o2b = senal(P.brazo, V2b, { 'data-orden': 'brazo-cable' }, 'se-orden');
    P.o3 = senal(cu, V3, { 'data-orden': 'pierna-der' }, 'se-orden');
    P.o4 = senal(cu, V4, { 'data-orden': 'pierna-izq' }, 'se-orden');
    P.c1 = senal(cu, C1, { 'data-cable': 'cuello' }, 'se-cable se-rapido', true);
    P.c2 = senal(P.brazo, C2, { 'data-cable': 'brazo' }, 'se-cable se-rapido', true);
    el('path', { class: 'se-corazon', 'data-corazon': '', d: 'M 92 104 C 84 98 84 92 88 91 C 90 90.5 91.5 92 92 93.5 C 92.5 92 94 90.5 96 91 C 100 92 100 98 92 104 Z' }, cu);

    /* ── Los nombres del paso 0 al 2 ── */
    P.nombres = el('g', { 'data-nombres': '' }, cu);
    texto(P.nombres, { class: 'am-rotulo', 'data-rotulo': 'glandula', x: 108, y: 19, 'font-size': 10.5 }, 'una glándula');
    el('line', { class: 'se-hilo', x1: 106, y1: 17, x2: 95.5, y2: 40.5 }, P.nombres);
    texto(P.nombres, { class: 'am-rotulo', 'data-rotulo': 'cable', x: 4, y: 69, 'font-size': 10.5 }, 'el cable');
    el('line', { class: 'se-hilo', x1: 44, y1: 67, x2: 63, y2: 77 }, P.nombres);
    texto(P.nombres, { class: 'am-rotulo', 'data-rotulo': 'sangre', x: 127, y: 113, 'font-size': 10.5 }, 'la sangre');
    el('line', { class: 'se-hilo', x1: 125, y1: 111, x2: 111.5, y2: 115.5 }, P.nombres);

    /* ── El reloj, con su hora marcada ── */
    P.reloj = el('g', { class: 'am-fuera', 'data-reloj': '' }, svg);
    el('circle', { class: 'se-reloj', 'data-esfera': '', cx: RELOJ[0], cy: RELOJ[1], r: RELOJ[2] }, P.reloj);
    for (var h = 0; h < 12; h++) {
      var a = enReloj(h, RELOJ[2] - (h % 3 ? 4 : 7)), b = enReloj(h, RELOJ[2] - 1.5);
      el('line', { class: 'se-marca', x1: r2(a[0]), y1: r2(a[1]), x2: r2(b[0]), y2: r2(b[1]) }, P.reloj);
    }
    var cm = enReloj(HORA_TOMA, RELOJ[2] + 9);
    P.cm = cm;
    P.marca = el('g', { 'data-marca': '', transform: 'translate(' + r2(cm[0]) + ' ' + r2(cm[1]) + ')' }, P.reloj);
    capsula(P.marca);
    /* La aguja va en dos giros, uno dentro del otro: el de afuera cuenta los
       días enteros (2,4 s cada uno) y el de adentro, las doce horas del
       último paso (1,2 s). Así hay pausa entre los dos, que un solo giro
       no puede hacer. */
    P.aguja = el('g', { class: 'se-dia', 'data-aguja': '' }, P.reloj);
    P.aguja.style.transformOrigin = RELOJ[0] + 'px ' + RELOJ[1] + 'px';
    P.aguja2 = el('g', { class: 'se-medio', 'data-aguja2': '' }, P.aguja);
    P.aguja2.style.transformOrigin = RELOJ[0] + 'px ' + RELOJ[1] + 'px';
    el('line', { class: 'se-aguja', 'data-punta-aguja': '', x1: RELOJ[0], y1: RELOJ[1], x2: RELOJ[0], y2: RELOJ[1] - 18 }, P.aguja2);
    el('circle', { class: 'se-eje', cx: RELOJ[0], cy: RELOJ[1], r: 2.6 }, P.reloj);
    texto(P.reloj, { class: 'am-rotulo', 'data-rotulo': 'hora', x: cm[0] - 9, y: cm[1] + 16, 'font-size': 9.5 }, 'su hora');

    /* ── Lo que le queda en la sangre: una barra de ocho cuadros ── */
    P.barra = el('g', { class: 'am-fuera', 'data-barra': '' }, svg);
    texto(P.barra, { class: 'am-rotulo', 'data-rotulo': 'barra', x: TUBO[0] + TUBO[2] / 2, y: TUBO[1] - 8, 'font-size': 10.5, 'text-anchor': 'middle' }, 'en su sangre');
    el('rect', { class: 'se-tubo', 'data-tubo': '', x: TUBO[0], y: TUBO[1], width: TUBO[2], height: TUBO[3], rx: 5 }, P.barra);
    P.celdaA = []; P.celdaB = [];
    var alto = (TUBO[3] - 4) / CELDAS;
    for (var k = 1; k <= CELDAS; k++) {
      var y = TUBO[1] + TUBO[3] - 2 - k * alto;
      var at = { class: 'se-celda', 'data-celda': k, x: TUBO[0] + 3, y: r2(y + 0.75), width: TUBO[2] - 6, height: r2(alto - 1.5), rx: 2.5 };
      P.celdaA[k] = el('rect', at, P.barra);
      /* Los cuadros de arriba se vacían y se vuelven a llenar en el mismo
         paso: la segunda vez es otra pieza, encima de la primera. */
      if (k > CELDAS / 2) {
        at.class = 'se-celda am-fuera';
        P.celdaB[k] = el('rect', at, P.barra);
      }
    }
    var yRaya = TUBO[1] + TUBO[3] - 2 - FALTA * alto;
    el('line', { class: 'se-raya', 'data-raya': '', x1: TUBO[0] + 1, y1: r2(yRaya), x2: TUBO[0] + TUBO[2] - 1, y2: r2(yRaya) }, P.barra);
    texto(P.barra, { class: 'am-rotulo', 'data-rotulo': 'falta', x: TUBO[0] - 5, y: r2(yRaya - 2), 'font-size': 9.5, 'text-anchor': 'end' }, 'lo que');
    texto(P.barra, { class: 'am-rotulo', 'data-rotulo': 'falta', x: TUBO[0] - 5, y: r2(yRaya + 9), 'font-size': 9.5, 'text-anchor': 'end' }, 'hace falta');

    /* ── Las tomas ── */
    /* La de la mañana siguiente (paso 3): sale de su marca en el reloj,
       viaja a la boca y se va. Aparecer y irse en el mismo paso piden dos
       piezas, una dentro de la otra. */
    P.tomaSale = el('g', { class: 'am-fuera', 'data-toma': 'sale' }, svg);
    P.tomaVa = el('g', { 'data-toma-va': '' }, P.tomaSale);
    P.tomaViaja = el('g', { class: 'am-viaja', 'data-toma-viaja': '' }, P.tomaVa);
    var cap = capsula(P.tomaViaja);
    cap.setAttribute('transform', 'translate(' + r2(cm[0]) + ' ' + r2(cm[1]) + ')');
    /* La que se le pasa (paso 4): se queda en su marca, con su ✗. */
    P.olvido = el('g', { class: 'am-fuera', 'data-olvido': '', transform: 'translate(' + r2(cm[0]) + ' ' + r2(cm[1]) + ')' }, svg);
    el('path', { class: 'se-tache', d: 'M -7 -7 L 7 7 M 7 -7 L -7 7' }, P.olvido);

    /* ⚠️ Los tiempos no son los de verdad, y se dice: la orden del cable
       tarda mucho menos, la de la sangre mucho más, y ninguna medicina
       se gasta así de parejo. */
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'esquema', x: ANCHO - 4, y: 222, 'font-size': 9.5, 'text-anchor': 'end' }, 'Es un esquema: los tiempos');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'esquema', x: ANCHO - 4, y: 234, 'font-size': 9.5, 'text-anchor': 'end' }, 'no son los de verdad.');
  }

  function pintar(n, antes) {
    var sigue = antes != null && antes === n - 1;
    function si(k) { return sigue ? k : 0; }

    /* ── Las dos órdenes (pasos 1 y 2) ──
       Se dibujan al llegar al paso 1 y se quedan dibujadas; lo que las
       apaga es su opacidad. Así, al volver con «Atrás», aparecen enteras
       en vez de volver a correr. */
    var llega = correr(P.c1, n >= 1, n === 1 ? si(0) : 0);
    llega = correr(P.c2, n >= 1, n === 1 ? si(llega) : 0);
    A.ver(P.c1.g, n === 1, 0);
    A.ver(P.c2.g, n === 1, 0);
    A.mover(P.brazo, 0, 0, GIRO_BRAZO[n], 1, n === 1 ? si(llega) : 0);
    A.ver(P.brillo, n === 1, 0);
    var enCorazon = correr(P.o0, n >= 1, n === 1 ? si(0) : 0);
    [P.o1, P.o2a, P.o3, P.o4].forEach(function (o) { correr(o, n >= 1, n === 1 ? si(enCorazon) : 0); });
    correr(P.o2b, n >= 1, n === 1 ? si(enCorazon + P.o2a.n * 800) : 0);
    [P.o0, P.o1, P.o2a, P.o2b, P.o3, P.o4].forEach(function (o) { A.ver(o.g, n >= 1 && n <= 2, 0); });
    A.ver(P.nombres, n <= 2, 0);
    A.mover(P.cuerpo, n <= 2 ? CENTRADA : 0, 0, 0, 1, 0);

    /* ── El reloj y la barra (pasos 3 a 5) ── */
    A.ver(P.reloj, n >= 3, 0);
    A.ver(P.barra, n >= 3, 0);
    /* Paso 3: arranca a las ocho, con la barra llena de la toma de esa
       mañana. Pasa un día: la barra pierde un cuadro cada seis horas, y a
       las ocho del día siguiente llega la otra toma y la vuelve a llenar. */
    var dia3 = 800, fin3 = dia3 + 24 * MS_HORA;
    /* Paso 4: pasa otro día igual; a las ocho se le pasa la toma; doce
       horas después, la barra baja de la raya. */
    var fin4a = 24 * MS_HORA, sigue4 = fin4a + 800, fin4 = sigue4 + 12 * MS_HORA;
    var dias = n >= 4 ? 2 : n >= 3 ? 1 : 0;
    /* Al volver con «Atrás», la aguja salta: la barra y la cara ya vuelven
       de golpe, y una aguja girando dos segundos hacia atrás diría una hora
       que la barra no tiene. */
    P.aguja.classList.toggle('se-salta', !sigue);
    P.aguja2.classList.toggle('se-salta', !sigue);
    A.mover(P.aguja, 0, 0, HORA_TOMA * 30 + dias * 720, 1, n === 3 ? si(dia3) : 0);
    A.mover(P.aguja2, 0, 0, n >= 4 ? 360 : 0, 1, n === 4 ? si(sigue4) : 0);
    for (var k = 1; k <= CELDAS; k++) {
      if (k > CELDAS / 2) {
        /* Cuándo se vacía el cuadro k dentro de un día: el 8 a las seis
           horas, el 7 a las doce, el 6 a las dieciocho y el 5 a las
           veinticuatro. La primera pieza se vacía en el paso 3; la
           segunda se llena con la toma del día siguiente y se vacía en el
           paso 4. */
        var sale = (CELDAS - k + 1) * 6 * MS_HORA;
        A.ver(P.celdaA[k], n <= 2, n === 3 ? si(dia3 + sale) : 0);
        A.ver(P.celdaB[k], n === 3, n === 3 ? si(fin3 + 1200 + (k - 5) * 200) : n === 4 ? si(sale) : 0);
      } else {
        /* Los de abajo no se vacían en un día normal. El 4 se va seis
           horas después de la toma que se le pasó (las dos de la tarde) y
           el 3, doce horas después (las ocho de la noche). */
        A.ver(P.celdaA[k], k < FALTA || n <= 3, n === 4 && k >= FALTA ? si(sigue4 + (5 - k) * 6 * MS_HORA) : 0);
      }
    }
    /* La toma del paso 3: aparece a las ocho, viaja a la boca y se va. */
    A.ver(P.tomaSale, n >= 3, n === 3 ? si(fin3) : 0);
    A.ver(P.tomaVa, n < 3, n === 3 ? si(fin3 + 1000) : 0);
    A.mover(P.tomaViaja, n >= 3 ? BOCA[0] - P.cm[0] : 0, n >= 3 ? BOCA[1] - P.cm[1] : 0, 0, 1, n === 3 ? si(fin3 + 200) : 0);
    /* La que se le pasa, y la cara: cambia justo cuando la barra baja de
       la raya. */
    A.ver(P.olvido, n >= 4, n === 4 ? si(fin4a + 200) : 0);
    A.ver(P.feliz, n < 4, n === 4 ? si(fin4) : 0);
    A.ver(P.triste, n >= 4, n === 4 ? si(fin4) : 0);
  }

  function marcador(n) {
    return [
      { cifra: '?', palabras: 'qué orden llega primero' },
      { cifra: 'el cable', palabras: 'llega primero, y a un solo lugar' },
      { cifra: 'la sangre', palabras: 'se queda un buen rato' },
      { cifra: 'alcanza', palabras: 'la de cada mañana llega a tiempo' },
      { cifra: 'horas después', palabras: 'se siente la toma que se le pasó' },
      { cifra: '?', palabras: 'qué le dirías a su nieto' }
    ][n];
  }

  AnimacionMision.montar('#amReloj', {
    vista: [ANCHO, ALTO],
    describe: 'Doña Nely de frente. Por dentro lleva un cable que baja de la cabeza a una mano, y la sangre, que baja de la cabeza al corazón y de ahí sale a los brazos y a las piernas. En la cabeza tiene una glándula. Desde el paso 3, a la derecha, un reloj con la hora de su medicina y una barra con lo que le queda de ella en la sangre.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🏁 Que salgan', '⏳ ¿Y después?', '💊 ¿Y su medicina?', '🤔 ¿Y si se le pasa?', '💡 ¿Y la hora?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
