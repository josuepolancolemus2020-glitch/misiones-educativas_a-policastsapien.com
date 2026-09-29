/* ============================================================
   M.E.T.A.S · Multiplicación y División de Fracciones
   · La manteca de doña Chepa
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de doña
   Chepa: este año hizo media receta de tamales y partió todo a la
   mitad, menos la manteca. «3/4 entre 2 no me sale», dijo, le echó
   los 3/4 enteros, los tamales salieron pesados y se perdió la masa
   de veinte.
   El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  la receta entera lleva 3/4 de taza: ¿cuánto es la mitad, y es
        más o menos que 3/4?;
     1  lo que intentó doña Chepa: repartir los cuartos enteros en dos
        montones. No se puede: uno se queda con 2 y el otro con 1;
     2  pero cada cuarto sí se parte por la mitad: la taza queda en
        octavos, y 6/8 es la misma manteca que 3/4;
     3  seis octavos sí se reparten: tres y tres. La media receta lleva
        3/8 de taza;
     4  la regla, en un renglón: 3/4 ÷ 2 = 3/8. El 3 de arriba se queda
        (siguen siendo tres pedazos) y el 4 de abajo se multiplica por 2
        (cada pedazo es un octavo);
     5  ¿más o menos? Menos: 3/8 llega a la mitad de donde llegaba 3/4.
        El 8 es más que el 4, pero un octavo es más chico que un cuarto;
     6  la prueba: las dos mitades juntas son 6/8, o sea 3/4.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **No se parte el 3: se parten los pedazos.** Es justo donde se
      trabó doña Chepa: buscaba la mitad de 3, que no sale entera. Con
      cuartos enteros los dos montones nunca quedan iguales, y en cuanto
      cada cuarto se parte en dos, sí. La regla sale de ahí, no se dicta.
   2. ⚠️ **Lo que va debajo NO se regala.** El «Predice» pregunta si
      12 × 3/4 es más o menos que 12, cuántos medios caben en 6 tortillas
      y si 2/3 × 4/5 pide denominador común. Por eso aquí no se
      multiplica una fracción por otra, ni se divide entre un medio, ni
      sale el 12: la regla es la de dividir entre un número natural, que
      la prueba de la misión pregunta con otros números. Y la cuenta de
      la historia (3/4 ÷ 2) se sacó de la prueba operativa, que la
      armaba en una de sus formas.
   3. ⚠️ **Lo que se dibuja es lo que se cuenta.** La sonda
      `verifica-animacion-mision` mide la manteca de cada taza sobre el
      dibujo (cuántos pedazos, de qué alto y apilados desde el fondo) y
      la compara con la fracción de al lado, con lo escrito a la derecha
      y con el marcador; vuelve a hacer cada cuenta escrita, y comprueba
      que entre las dos tazas haya siempre 3/4: la manteca no aparece ni
      desaparece.
   4. **La taza y la manteca son de su color en las dos pantallas**, y
      lo que va encima de ellas (las rayas, los números de los pedazos)
      va en tinta oscura fija: encima de la manteca, el azul de la misión
      se leería mal en la pantalla oscura. Lo que va sobre la tarjeta
      (las fracciones de al lado, lo escrito) lleva los colores de la
      misión, que ya se aclaran solos en la pantalla oscura.
   5. **La misión escribe las fracciones en línea («3/4»)**, en toda la
      página, y así va también el marcador. Las del dibujo sí van
      apiladas, como en el cuaderno: es donde se ve que el 3 de arriba
      se queda y el 4 de abajo se hace 8.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amManteca')) return;

  var ANCHO = 320, ALTO = 240, FIN = 6;
  /* La taza por dentro: ancho, alto de una taza entera y dónde está el
     fondo. Un octavo son 20 de alto y un cuarto, 40. */
  var W = 56, H = 160, FONDO = 208;
  var OCTAVO = H / 8, CUARTO = H / 4;
  var TAZA = [16, 108];                     // dónde empieza cada taza por dentro
  var NIVEL_X = [90, 182];                  // la fracción que dice hasta dónde llega cada una
  var PANEL = 258;                          // el centro de lo escrito, a la derecha
  var COLOR = { manteca: '#f6e6bb', borde: '#8f6f2e', cuenta: '#4f3608', vidrio: '#eaf1f6', tinta: '#3d4a56', antes: '#1565c0' };

  /* ── Lo que dice cada paso ── */
  var MARCADOR = [
    { cifra: '3/4', palabras: 'de taza: la receta entera' },
    { cifra: '2 y 1', palabras: 'cuartos: no son mitades' },
    { cifra: '6/8', palabras: 'es la misma manteca que 3/4' },
    { cifra: '3/8', palabras: 'de taza en cada montón' },
    { cifra: '3/8', palabras: 'el 3 se queda y 4 × 2 = 8' },
    { cifra: '3/8', palabras: 'es menos que 3/4' },
    { cifra: '3/4', palabras: 'las dos mitades juntas' }
  ];
  var TEXTOS = [
    'La receta entera lleva tres cuartos de taza de manteca, y doña Chepa quiere la mitad. ¿Es más o menos que tres cuartos? Decídelo antes de tocar.',
    'Doña Chepa quiso repartir los cuartos en dos montones iguales. Con cuartos enteros no se puede: un montón se queda con dos y el otro con uno.',
    'Pero cada cuarto sí se parte por la mitad. Ahora la taza tiene ocho partes iguales, octavos, y la manteca llena seis. Seis octavos son la misma manteca que tres cuartos.',
    'Seis octavos sí se reparten en dos montones iguales: tres y tres. La media receta lleva tres octavos de taza.',
    'Esa es la regla: para partir entre 2, el 3 de arriba se queda y el 4 de abajo se multiplica por 2. Siguen siendo tres pedazos, pero de octavo.',
    '¿Más o menos? Menos: tres octavos llegan a la mitad de donde llegaban tres cuartos. El 8 es más que el 4, pero un octavo es más chico que un cuarto.',
    'Para comprobar, se juntan las dos mitades: tres octavos y tres octavos son seis octavos, o sea tres cuartos. Con tres octavos, los tamales de media receta salen bien.'
  ];
  var BOTONES = [
    '👐 Repartir los cuartos',
    '🥄 Partir cada cuarto',
    '⚖️ Dos montones iguales',
    '✏️ ¿Cuál es la regla?',
    '🤔 ¿Es más o menos?',
    '✅ Comprobar',
    '↺ Empezar otra vez'
  ];

  /* ── Dónde va la manteca ──
     Son seis octavos: el 2q y el 2q + 1 son las dos mitades del cuarto q.
     Mientras los cuartos están enteros (pasos 0 y 1), una tapa del alto de
     un cuarto va encima de sus dos mitades y las junta: se ve un solo
     pedazo. Al partir, la tapa se va y quedan las dos mitades. */
  function lugarOctavo(e, n) {
    if (n === 1 && e >= 4) return [1, e - 4];              // el tercer cuarto, a la otra taza
    if (n >= 3 && n <= 5 && e >= 3) return [1, 5 - e];    // de arriba, uno por uno, a la media receta
    return [0, e];
  }
  function lugarCuarto(q, n) { return n === 1 && q === 2 ? [1, 0] : [0, q]; }

  /* Lo que dice cada taza en cada paso, [numerador, denominador]. */
  var NIVEL = [
    [[3, 4], null],
    [[2, 4], [1, 4]],
    [[6, 8], null],
    [[3, 8], [3, 8]],
    [[3, 8], [3, 8]],
    [[3, 8], [3, 8]],
    [[6, 8], null]
  ];
  /* El nombre debajo de cada taza (la de la izquierda cambia de nombre,
     porque cambia lo que guarda). */
  var NOMBRES = [
    { taza: 0, t: 'receta entera', pasos: [0, 2, 6] },
    { taza: 0, t: 'la otra mitad', pasos: [3, 4, 5] },
    { taza: 1, t: 'media receta', pasos: [0, 1, 2, 3, 4, 5] }
  ];

  /* Lo escrito a la derecha, como en el cuaderno. Una fila que empieza
     con «=» sigue a la de arriba, debajo de su último «=». */
  function F(a, b) { return { tipo: 'fr', a: a, b: b }; }
  function O(t) { return { tipo: 'op', t: t }; }
  function N(t) { return { tipo: 'n', t: t }; }
  var DUDA = { tipo: 'duda' };
  var ESCRITO = [
    [[F(3, 4), O('÷'), N('2'), O('='), DUDA]],
    [[F(2, 4), O('≠'), F(1, 4)]],
    [[F(3, 4), O('='), F(6, 8)]],
    [[F(6, 8), O('÷'), N('2'), O('='), F(3, 8)]],
    [[F(3, 4), O('÷'), N('2'), O('='), F(3, 8)]],
    [[F(3, 8), O('<'), F(3, 4)]],
    [[F(3, 8), O('+'), F(3, 8), O('='), F(6, 8)], [O('='), F(3, 4)]]
  ];
  var TAM = 24, HUECO = 7, ANCHO_T = { fr: 20, op: 14, n: 14, duda: 18 };

  /* Cuándo llega cada cosa al avanzar: primero se mueve la manteca, y lo
     escrito y las fracciones de al lado llegan cuando ya se asentó. */
  var CORTE0 = 850, CORTE_PASO = 280, SACA = 380;
  var LLEGA = [0, 850, 2150, 1550, 0, 250, 1550];

  var A;
  var octavos = [], cuartos = [], tapas = [], rayas = [], cuchillos = [], cuentas = [];
  var niveles = [], nombres = [], escritos = [], duda, antesRaya, antesNivel, regla = {};

  function r2(v) { return Math.round(v * 100) / 100; }

  /* Una fracción escrita como en el cuaderno: el número de arriba, la
     raya y el de abajo, cada uno su pieza. */
  function fraccion(padre, clase, x, y, tam, num, den, gris) {
    var el = A.el;
    var g = el('g', { class: clase }, padre);
    var tinta = gris ? 'var(--gray,#636e72)' : 'var(--am-pri,#1565c0)';
    var cls = gris ? 'am-letra' : 'am-digito';
    var n = el('text', { class: cls + ' mt-num', x: x, y: y - tam * 0.2, 'text-anchor': 'middle', 'font-size': tam, style: gris ? 'fill:' + tinta : null }, g);
    n.textContent = num;
    el('line', { class: 'mt-barra', x1: x - tam * 0.42, y1: y, x2: x + tam * 0.42, y2: y, style: 'stroke:' + tinta + ';stroke-width:' + r2(tam / 12) + ';stroke-linecap:round' }, g);
    var d = el('text', { class: cls + ' mt-den', x: x, y: y + tam * 0.86, 'text-anchor': 'middle', 'font-size': tam, style: gris ? 'fill:' + tinta : null }, g);
    d.textContent = den;
    return g;
  }

  /* La punta de una flecha en (x, y), mirando hacia (dx, dy). */
  function punta(x, y, dx, dy, tam) {
    var l = Math.sqrt(dx * dx + dy * dy); dx /= l; dy /= l;
    var bx = x - dx * tam, by = y - dy * tam, px = -dy * tam * 0.55, py = dx * tam * 0.55;
    return 'M ' + r2(x) + ' ' + r2(y) + ' L ' + r2(bx + px) + ' ' + r2(by + py) + ' L ' + r2(bx - px) + ' ' + r2(by - py) + ' Z';
  }

  function ponToken(g, tk, x, y) {
    var el = A.el, t;
    if (tk.tipo === 'fr') {
      t = fraccion(g, 'mt-tok', x, y, TAM, tk.a, tk.b);
      t.setAttribute('data-tipo', 'fr');
      return;
    }
    if (tk.tipo === 'duda') {
      t = el('text', { class: 'am-letra mt-tok', 'data-tipo': 'duda', x: x, y: y + TAM * 0.42, 'text-anchor': 'middle', 'font-size': r2(TAM * 1.25), style: 'fill:var(--gray,#636e72)' }, g);
      t.textContent = '?';
      return;
    }
    t = el('text', { class: (tk.tipo === 'n' ? 'am-digito' : 'am-letra') + ' mt-tok', 'data-tipo': tk.tipo, x: x, y: y + TAM * 0.35, 'text-anchor': 'middle', 'font-size': TAM }, g);
    t.textContent = tk.t;
  }

  /* Una fila de lo escrito, centrada en el panel (o en las x que se le
     den). Devuelve dónde quedó cada pieza. */
  function fila(g, tokens, y, xs) {
    var ancho = tokens.reduce(function (s, t) { return s + ANCHO_T[t.tipo]; }, 0) + HUECO * (tokens.length - 1);
    var x = PANEL - ancho / 2, pos = [];
    tokens.forEach(function (t, i) {
      var cx = xs ? xs[i] : x + ANCHO_T[t.tipo] / 2;
      pos.push(cx);
      ponToken(g, t, cx, y);
      x += ANCHO_T[t.tipo] + HUECO;
    });
    return pos;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── Las dos tazas medidoras: de vidrio, abiertas arriba ── */
    TAZA.forEach(function (x0, c) {
      var g = el('g', { class: 'mt-taza', 'data-taza': c, 'data-x0': x0, 'data-x1': x0 + W, 'data-fondo': FONDO, 'data-alto': H }, svg);
      var iz = x0 - 3, de = x0 + W + 3, arriba = FONDO - H - 4, abajo = FONDO + 3, r = 6;
      el('path', {
        d: 'M ' + (iz - 4) + ' ' + (arriba - 4) + ' L ' + iz + ' ' + arriba + ' L ' + iz + ' ' + (abajo - r) +
           ' Q ' + iz + ' ' + abajo + ' ' + (iz + r) + ' ' + abajo + ' L ' + (de - r) + ' ' + abajo +
           ' Q ' + de + ' ' + abajo + ' ' + de + ' ' + (abajo - r) + ' L ' + de + ' ' + arriba + ' L ' + (de + 4) + ' ' + (arriba - 4),
        style: 'fill:' + COLOR.vidrio + ';stroke:' + COLOR.tinta + ';stroke-width:2.4;stroke-linejoin:round;stroke-linecap:round'
      }, g);
    });

    /* ── La manteca: seis octavos y, encima, las tapas que juntan cada
       par en un cuarto. Por fuera se mueve y por dentro se apaga: son dos
       piezas para que el cuarto pueda viajar primero y partirse después. ── */
    var estilo = 'fill:' + COLOR.manteca + ';stroke:' + COLOR.borde + ';stroke-width:1.2';
    for (var e = 0; e < 6; e++) {
      var go = el('g', { class: 'mt-octavo', 'data-e': e }, svg);
      el('rect', { x: 0, y: 0, width: W, height: OCTAVO, rx: 2.5, style: estilo }, go);
      octavos.push(go);
    }
    for (var q = 0; q < 3; q++) {
      var gq = el('g', { class: 'mt-cuarto-lugar', 'data-q': q }, svg);
      var tapa = el('g', { class: 'mt-cuarto' }, gq);
      el('rect', { x: 0, y: 0, width: W, height: CUARTO, rx: 2.5, style: estilo }, tapa);
      cuartos.push(gq);
      tapas.push(tapa);
    }

    /* ── Las rayas de cada taza: los cuartos siempre, los octavos desde que
       se parte. Por dentro, en tinta oscura fija: pasan por encima de la
       manteca y del vidrio, que son claros en las dos pantallas. ── */
    TAZA.forEach(function (x0, c) {
      for (var k = 1; k < 8; k++) {
        var y = FONDO - k * OCTAVO;
        rayas.push(el('line', {
          class: 'mt-raya', 'data-taza': c, 'data-k': k, x1: x0, y1: y, x2: x0 + (k % 2 ? 7 : 12), y2: y,
          style: 'stroke:' + COLOR.tinta + ';stroke-width:' + (k % 2 ? 1.3 : 1.8) + ';stroke-linecap:round'
        }, svg));
      }
    });

    /* ── El cuchillo: una raya por la mitad de cada cuarto (paso 2). Va de
       pared a pared por dentro, y no más: una raya que se sale del vidrio
       parece un corte de la taza y no de la manteca. ── */
    for (q = 0; q < 3; q++) {
      var yc = FONDO - CUARTO * q - OCTAVO;
      cuchillos.push(el('line', {
        class: 'mt-cuchillo am-fuera', x1: TAZA[0] + 1, y1: yc, x2: TAZA[0] + W - 1, y2: yc,
        style: 'stroke:' + COLOR.tinta + ';stroke-width:2;stroke-linecap:round'
      }, svg));
    }

    /* ── Los tres pedazos de la media receta, contados (paso 4) ── */
    for (var s = 0; s < 3; s++) {
      var tc = el('text', {
        class: 'am-letra mt-cuenta am-fuera', x: TAZA[1] + W / 2, y: FONDO - OCTAVO * (s + 0.5) + 5, 'text-anchor': 'middle', 'font-size': 14,
        style: 'fill:' + COLOR.cuenta
      }, svg);
      tc.textContent = s + 1;
      cuentas.push(tc);
    }

    /* ── Hasta dónde llegaba 3/4, en la taza de la media receta (paso 5) ── */
    var ya = FONDO - H * 3 / 4;
    antesRaya = el('line', {
      class: 'mt-antes-raya am-fuera', x1: TAZA[1] + 2, y1: ya, x2: TAZA[1] + W - 2, y2: ya,
      style: 'stroke:' + COLOR.antes + ';stroke-width:2;stroke-dasharray:5 4'
    }, svg);

    /* ── La pregunta, dentro de la taza vacía (paso 0), entre las rayas de
       2/4 y 3/4: pegada a una raya se leía «–?». ── */
    duda = el('text', {
      class: 'am-letra mt-duda-taza am-fuera', x: TAZA[1] + W / 2, y: FONDO - H * 5 / 8 + 12, 'text-anchor': 'middle', 'font-size': 34,
      style: 'fill:' + COLOR.tinta
    }, svg);
    duda.textContent = '?';

    /* ── La fracción de al lado de cada taza, a la altura de la manteca.
       Una por fracción que se dice, y se enciende la que toca. ── */
    function nivel(c, a, b, antes) {
      var y = FONDO - H * a / b, x = NIVEL_X[c], pared = TAZA[c] + W + 4;
      var g = el('g', { class: 'mt-nivel am-fuera' + (antes ? ' mt-antes' : ''), 'data-taza': c }, svg);
      el('line', {
        x1: pared, y1: y, x2: x - 8, y2: y,
        style: 'stroke:' + (antes ? 'var(--gray,#636e72)' : 'var(--am-pri,#1565c0)') + ';stroke-width:1.4' + (antes ? ';stroke-dasharray:2 2' : '')
      }, g);
      fraccion(g, 'mt-fr', x, y, 16, a, b, antes);
      return { g: g, taza: c, a: a, b: b };
    }
    var vistos = {};
    NIVEL.forEach(function (par) {
      par.forEach(function (v, c) {
        if (!v) return;
        var clave = c + ':' + v[0] + '/' + v[1];
        if (!vistos[clave]) { vistos[clave] = true; niveles.push(nivel(c, v[0], v[1], false)); }
      });
    });
    antesNivel = nivel(1, 3, 4, true);

    /* ── Los nombres, debajo de cada taza ── */
    NOMBRES.forEach(function (nm) {
      var t = el('text', { class: 'am-letra mt-nombre am-fuera', x: TAZA[nm.taza] + W / 2, y: 230, 'text-anchor': 'middle', 'font-size': 12 }, svg);
      t.textContent = nm.t;
      nombres.push({ el: t, pasos: nm.pasos });
    });

    /* ── Lo escrito a la derecha, un grupo por paso ── */
    ESCRITO.forEach(function (filas, paso) {
      var g = el('g', { class: 'mt-escrito am-fuera', 'data-paso': paso }, svg);
      var ys = filas.length === 1 ? [124] : [98, 162];
      var antes = null;
      filas.forEach(function (tk, i) {
        var xs = null;
        if (i > 0 && antes && tk[0].tipo === 'op' && tk[0].t === '=') {
          /* La segunda fila empieza debajo del último «=» de la primera. */
          var arriba = filas[i - 1], j = arriba.length - 2;
          xs = [antes[j], antes[j + 1]];
        }
        antes = fila(g, tk, ys[i], xs);
        if (paso === 4 && i === 0) regla.pos = antes;
      });
      escritos.push(g);
    });

    /* ── La regla (paso 4): el 3 de arriba se queda y el 4 de abajo se
       multiplica por 2. Dos flechas, cada una con lo que dice escrito. ── */
    var p = regla.pos, xl = p[0], xr = p[p.length - 1], xm = (xl + xr) / 2;
    var g4 = escritos[4];
    var yA = 124 - TAM * 0.9 - 6, yB = 124 + TAM * 0.86 + 6;
    regla.arriba = el('path', { class: 'mt-arco', d: 'M ' + r2(xl) + ' ' + r2(yA) + ' Q ' + r2(xm) + ' 58 ' + r2(xr) + ' ' + r2(yA), style: 'fill:none;stroke:var(--am-pri,#1565c0);stroke-width:1.8;stroke-linecap:round' }, g4);
    regla.abajo = el('path', { class: 'mt-arco', d: 'M ' + r2(xl) + ' ' + r2(yB) + ' Q ' + r2(xm) + ' 190 ' + r2(xr) + ' ' + r2(yB), style: 'fill:none;stroke:var(--am-sec,#00838f);stroke-width:1.8;stroke-linecap:round' }, g4);
    regla.puntas = el('g', { class: 'am-fuera' }, g4);
    el('path', { d: punta(xr, yA, xr - xm, yA - 58, 7), style: 'fill:var(--am-pri,#1565c0)' }, regla.puntas);
    el('path', { d: punta(xr, yB, xr - xm, yB - 190, 7), style: 'fill:var(--am-sec,#00838f)' }, regla.puntas);
    regla.notas = el('g', { class: 'am-fuera' }, g4);
    var na = el('text', { class: 'am-letra mt-nota', x: xm, y: 70, 'text-anchor': 'middle', 'font-size': 12.5 }, regla.notas);
    na.textContent = 'se queda';
    var nb = el('text', { class: 'am-digito mt-nota', x: xm, y: 193, 'text-anchor': 'middle', 'font-size': 17 }, regla.notas);
    nb.textContent = '× 2';
  }

  function pintar(n, antes) {
    var sigue = antes === n - 1;             // avanzó un paso: con su coreografía
    var juntos = n <= 1;

    for (var q = 0; q < 3; q++) {
      var lq = lugarCuarto(q, n);
      A.mover(cuartos[q], TAZA[lq[0]], FONDO - CUARTO * (lq[1] + 1), 0, 1, 0);
      /* Se parten uno tras otro, cuando el cuchillo ya pasó. */
      A.ver(tapas[q], juntos, n === 2 && sigue ? CORTE0 + q * CORTE_PASO + 500 : 0);
      var corta = n === 2, dc = corta && sigue ? CORTE0 + q * CORTE_PASO : 0;
      A.trazar(cuchillos[q], corta, dc);
      A.ver(cuchillos[q], corta, dc);
    }

    for (var e = 0; e < 6; e++) {
      var l = lugarOctavo(e, n), d = 0;
      if (sigue && n === 3 && e >= 3) d = (5 - e) * SACA;      // se sacan de arriba, uno por uno
      if (sigue && n === 6 && e >= 3) d = (e - 3) * SACA;      // y vuelven
      A.mover(octavos[e], TAZA[l[0]], FONDO - OCTAVO * (l[1] + 1), 0, 1, d);
    }

    var llega = sigue ? LLEGA[n] : 0;
    rayas.forEach(function (r) {
      var octavo = +r.getAttribute('data-k') % 2 === 1;
      A.ver(r, !octavo || n >= 2, octavo && n === 2 && sigue ? llega - 150 : 0);
    });

    for (var s = 0; s < 3; s++) A.ver(cuentas[s], n === 4, n === 4 && sigue ? 300 + s * 250 : 0);
    A.ver(antesRaya, n === 5, n === 5 && sigue ? 150 : 0);
    A.ver(antesNivel.g, n === 5, n === 5 && sigue ? llega : 0);
    A.ver(duda, n === 0, 0);

    /* La fracción que se va y la que llega cambian a la vez, cuando la
       manteca ya se asentó: así nunca dice algo que todavía no se ve. */
    niveles.forEach(function (v) {
      var dice = NIVEL[n][v.taza], era = NIVEL[antes] ? NIVEL[antes][v.taza] : null;
      var si = !!dice && dice[0] === v.a && dice[1] === v.b;
      var estaba = !!era && era[0] === v.a && era[1] === v.b;
      A.ver(v.g, si, si || estaba ? llega : 0);
    });
    nombres.forEach(function (nm) {
      var si = nm.pasos.indexOf(n) >= 0, estaba = nm.pasos.indexOf(antes) >= 0;
      A.ver(nm.el, si, si !== estaba ? llega : 0);
    });
    escritos.forEach(function (g, k) { A.ver(g, k === n, k === n || k === antes ? llega : 0); });

    var enRegla = n === 4;
    A.trazar(regla.arriba, enRegla, enRegla && sigue ? 350 : 0);
    A.trazar(regla.abajo, enRegla, enRegla && sigue ? 750 : 0);
    A.ver(regla.puntas, enRegla, enRegla && sigue ? 1150 : 0);
    A.ver(regla.notas, enRegla, enRegla && sigue ? 1150 : 0);
  }

  AnimacionMision.montar('#amManteca', {
    vista: [ANCHO, ALTO],
    describe: 'Dos tazas medidoras. En la de la izquierda hay tres cuartos de taza de manteca; se parte cada cuarto en dos y tres octavos pasan a la taza de la media receta.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return MARCADOR[n]; }
  });
})();
