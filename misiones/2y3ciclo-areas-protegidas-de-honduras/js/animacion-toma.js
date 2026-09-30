/* ============================================================
   M.E.T.A.S · Áreas Protegidas de Honduras ·
   «El agua que el monte guarda»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de don
   Tulio: en su aldea el agua bajaba por tubo desde la montaña y nunca
   faltó, hasta el año en que la toma se secó en marzo y hubo que
   acarrearla en bidones hasta que volvieron las lluvias. La historia
   termina diciendo que el agua no salía de la tubería: salía del monte
   que está arriba. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada pieza
   en cada paso.

   Son dos cerros iguales, vistos de lado y cortados para ver lo de
   adentro: el de la izquierda con monte y el de la derecha pelado, con
   los tocones de los árboles que tuvo. Al pie de cada uno, la toma de
   una aldea y su pila. Abajo, en dos tiras, los meses sin lluvia.

     0  los dos cerros y sus tomas: ¿cuál aguanta más sin lluvia?;
     1  cae la misma lluvia en los dos: en el monte se mete en la tierra;
        en el pelado corre cuesta abajo y se va;
     2  adentro: el cerro con monte guardó mucha agua, el pelado, poca;
     3  en noviembre se acaban las lluvias: cada toma vive de lo que su
        cerro guardó, y los dos lo sueltan igual de despacio;
     4  pasan diciembre, enero y febrero: en marzo el cerro pelado se
        queda sin agua adentro y su toma se seca; la del monte sigue;
     5  abril, y en mayo vuelven las lluvias: la aldea del cerro pelado
        pasó dos meses con bidones; la toma del monte nunca se secó;
     6  el monte guarda la lluvia (con la lluvia de mayo vuelven las
        flechas: en el monte, adentro; en el pelado, cuesta abajo) y la
        suelta cuando ya no llueve (las tiras: seis meses con agua y
        cuatro). Y la pregunta es del alumno: ¿qué le pasó al monte de don
        Tulio?

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **Los dos cerros son IGUALES, y la lluvia también.** La misma
      curva, del mismo alto y el mismo ancho, con la toma en el mismo
      sitio; las gotas caen a la misma distancia sobre los dos. Así lo
      único que cambia es el monte, que es lo que dice la historia. La
      sonda lo mide punto por punto.
   2. ⚠️ **Las dos tomas dan la MISMA agua cada mes mientras tienen.** El
      agua guardada es un área adentro del cerro, y cada mes se va la
      misma área de los dos: el nivel se calcula con esa cuenta, no se
      escribe. Si la toma del monte diera más, el alumno podría pensar que
      aguantó por eso. Lo que cambia es cuánto guardó cada cerro: el monte,
      el doble. La sonda vuelve a medir las áreas.
   3. **Los meses son lo único que se cuenta.** Ni litros ni porcentajes:
      esos números no se pueden acreditar para un cerro que no existe. Lo
      que sí es de verdad es el calendario: las lluvias de mayo a octubre y
      los meses sin lluvia de noviembre a abril, como enseña la misión de
      Geografía de Honduras. El marcador cuenta en las tiras.
   4. ⚠️ **Lo que pregunta la prueba no se dice.** Esta animación no dice
      erosión, ni inundación, ni neblina, ni especies, ni aire, ni clima,
      ni el nombre de un área protegida: son respuestas de la prueba. Y la
      prueba se cambió donde la historia o esta animación ya contestaban:
      el completar del monte de don Tulio, el bosque que «no tiene nada
      que ver» con el agua de la aldea, las quebradas que se secan donde se
      tala, las inundaciones y, en pensamiento crítico, las dos causas del
      agua, el argumento del bosque que asegura el agua y la ficha de
      «Ríos que se secan».
   5. **Nadie tiene la culpa en el dibujo.** El cerro pelado no lleva a
      nadie cortando; la historia no dice quién cortó el monte de don
      Tulio, y la animación tampoco. Termina en una pregunta: qué le pasó
      a ese monte, que es lo que el alumno descubre solo.
   6. **Nada se dice solo con color.** El monte y el pelado se distinguen
      por los árboles y los tocones, y llevan su nombre; en las tiras, el
      mes con agua lleva una gota y el seco una ✗; la toma seca, sin chorro
      y con su ✗. El cerro, el agua y el monte son como son: se quedan
      iguales en la pantalla clara y en la oscura.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amToma')) return;

  var ANCHO = 320, ALTO = 252, FIN = 6;
  var BASE = 170;                               // donde los cerros tocan el suelo
  var CERROS = { monte: 80, pelado: 240 };      // el centro de cada cerro
  var LADOS = ['monte', 'pelado'];

  /* El cerro: del pie izquierdo a la cumbre y de la cumbre al pie derecho,
     medido desde su centro. Los dos cerros son esta misma curva. */
  var FORMA = [[-64, BASE], [-44, BASE], [-34, 72], [0, 72], [34, 72], [44, BASE], [64, BASE]];
  /* Lo de adentro, donde se guarda el agua: la misma forma, más adentro,
     con su tierra encima. */
  var DENTRO = [[-50, BASE], [-35, BASE], [-27, 98], [0, 98], [27, 98], [35, BASE], [50, BASE]];
  /* Los árboles del monte, y en el pelado sus tocones, en el mismo sitio. */
  var ARBOLES = [-40, -24, -8, 8, 24, 40];

  /* ── El agua guardada ──
     El monte se llena hasta LLENO. Esa agua alcanza para ocho meses de
     toma; la del pelado, para cuatro. Cada mes sin lluvia las dos tomas se
     llevan lo mismo. */
  var LLENO = 112;
  var GUARDA = { monte: 8, pelado: 4 };
  var MESES = ['N', 'D', 'E', 'F', 'M', 'A'];               // de noviembre a abril
  var PASO_MES = [3, 4, 4, 4, 4, 5];                        // en qué paso llega cada mes
  var D_MES = [900, 300, 1100, 1900, 2700, 300];            // y cuándo, dentro de su paso

  /* Las tiras de los meses, debajo de cada cerro. */
  var CELDA = 17, HUECO = 3, TIRA_Y = 201;

  var TEXTOS = [
    'Dos cerros iguales, cada uno con la toma de agua de una aldea. Uno tiene monte y el otro está pelado. ¿Cuál toma aguanta más sin lluvia?',
    'Llueve lo mismo en los dos cerros, de mayo a octubre. En el monte, el agua se mete en la tierra. En el pelado, corre cuesta abajo y se va.',
    'Las hojas frenan la lluvia y las raíces le abren camino. Por eso el cerro con monte guardó mucha agua adentro, y el pelado, poca.',
    'En noviembre se acaban las lluvias. Ahora cada toma solo tiene el agua que su cerro guardó, y el cerro la va soltando despacio.',
    'Pasan diciembre, enero y febrero. En marzo, al cerro pelado ya no le queda agua adentro, y su toma se seca. La del monte sigue.',
    'Hasta mayo, cuando volvieron las lluvias, la aldea del cerro pelado acarreó el agua en bidones. La toma del monte nunca se secó.',
    'El monte guarda la lluvia y la suelta cuando ya no llueve. ¿Qué le pasó al monte de arriba de la toma de don Tulio?'
  ];

  var A;
  function r2(v) { return Math.round(v * 100) / 100; }

  /* ── Las cuentas de la curva ── */
  function cubica(p, t, k) {
    var u = 1 - t;
    return u * u * u * p[0][k] + 3 * u * u * t * p[1][k] + 3 * u * t * t * p[2][k] + t * t * t * p[3][k];
  }
  function mitad(f, dx) { return dx <= 0 ? [f[0], f[1], f[2], f[3]] : [f[3], f[4], f[5], f[6]]; }
  /* La altura de una curva en una x (medida desde el centro): se busca su
     punto por mitades. */
  function altura(f, dx) {
    var s = mitad(f, dx), a = 0, b = 1;
    for (var i = 0; i < 40; i++) { var m = (a + b) / 2; if (cubica(s, m, 0) < dx) a = m; else b = m; }
    return cubica(s, (a + b) / 2, 1);
  }
  /* La mitad del ancho de una curva a una altura. */
  function medioAncho(f, y) {
    var s = mitad(f, -1), a = 0, b = 1;
    for (var i = 0; i < 40; i++) { var m = (a + b) / 2; if (cubica(s, m, 1) > y) a = m; else b = m; }
    return -cubica(s, (a + b) / 2, 0);
  }
  /* El área que queda adentro, debajo de un nivel. Se arma una tabla una
     sola vez, de cuarto en cuarto de unidad, y se lee de ahí. */
  var TABLA = null;
  function tabla() {
    if (TABLA) return TABLA;
    var ys = [], as = [], s = 0, paso = 0.25, top = DENTRO[3][1];
    ys.push(BASE); as.push(0);
    for (var y = BASE; y > top; y -= paso) {
      var y1 = Math.max(top, y - paso);
      s += 2 * medioAncho(DENTRO, (y + y1) / 2) * (y - y1);
      ys.push(y1); as.push(s);
    }
    TABLA = { ys: ys, as: as };
    return TABLA;
  }
  function nivelDe(area) {
    var t = tabla();
    if (area <= 0) return BASE;
    for (var i = 1; i < t.ys.length; i++) {
      if (t.as[i] >= area) {
        var f = (area - t.as[i - 1]) / (t.as[i] - t.as[i - 1]);
        return t.ys[i - 1] + (t.ys[i] - t.ys[i - 1]) * f;
      }
    }
    return t.ys[t.ys.length - 1];
  }
  function areaBajo(nivel) {
    var t = tabla();
    for (var i = 1; i < t.ys.length; i++) {
      if (t.ys[i] <= nivel) {
        var f = (t.ys[i - 1] - nivel) / (t.ys[i - 1] - t.ys[i]);
        return t.as[i - 1] + (t.as[i] - t.as[i - 1]) * f;
      }
    }
    return t.as[t.as.length - 1];
  }

  /* El nivel del agua guardada al empezar y al acabar cada mes. */
  var NIVELES = {};
  function niveles() {
    var mes = areaBajo(LLENO) / GUARDA.monte;
    LADOS.forEach(function (k) {
      var v = [], a = GUARDA[k] * mes;
      v.push(nivelDe(a));
      for (var i = 0; i < MESES.length; i++) { a = Math.max(0, a - mes); v.push(a > 1e-6 ? nivelDe(a) : BASE); }
      NIVELES[k] = v;
    });
  }
  /* ¿La toma dio agua ese mes? Si el cerro tenía algo guardado al empezarlo. */
  function conAgua(k, i) { return NIVELES[k][i] < BASE - 0.01; }

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }
  function trazo(f, cx) {
    return 'M ' + (cx + f[0][0]) + ' ' + f[0][1] +
      ' C ' + (cx + f[1][0]) + ' ' + f[1][1] + ' ' + (cx + f[2][0]) + ' ' + f[2][1] + ' ' + (cx + f[3][0]) + ' ' + f[3][1] +
      ' C ' + (cx + f[4][0]) + ' ' + f[4][1] + ' ' + (cx + f[5][0]) + ' ' + f[5][1] + ' ' + (cx + f[6][0]) + ' ' + f[6][1];
  }
  /* Una ✗ con halo, para la toma seca y para el mes sin agua. */
  function equis(padre, cx, cy, r, attrs) {
    var el = A.el;
    var g = el('g', attrs, padre);
    var d = 'M ' + r2(cx - r) + ' ' + r2(cy - r) + ' L ' + r2(cx + r) + ' ' + r2(cy + r) +
      ' M ' + r2(cx + r) + ' ' + r2(cy - r) + ' L ' + r2(cx - r) + ' ' + r2(cy + r);
    el('path', { class: 'ap-halo', d: d }, g);
    el('path', { class: 'ap-mal', d: d }, g);
    return g;
  }
  /* Una gota: la del mes con agua. */
  function gota(padre, cx, cy, s, attrs) {
    var d = 'M ' + r2(cx) + ' ' + r2(cy - 6 * s) + ' C ' + r2(cx + 1.6 * s) + ' ' + r2(cy - 3 * s) + ' ' + r2(cx + 4.4 * s) + ' ' + r2(cy - 0.2 * s) +
      ' ' + r2(cx + 4.4 * s) + ' ' + r2(cy + 2 * s) + ' C ' + r2(cx + 4.4 * s) + ' ' + r2(cy + 4.6 * s) + ' ' + r2(cx + 2.4 * s) + ' ' + r2(cy + 6 * s) +
      ' ' + r2(cx) + ' ' + r2(cy + 6 * s) + ' C ' + r2(cx - 2.4 * s) + ' ' + r2(cy + 6 * s) + ' ' + r2(cx - 4.4 * s) + ' ' + r2(cy + 4.6 * s) +
      ' ' + r2(cx - 4.4 * s) + ' ' + r2(cy + 2 * s) + ' C ' + r2(cx - 4.4 * s) + ' ' + r2(cy - 0.2 * s) + ' ' + r2(cx - 1.6 * s) + ' ' + r2(cy - 3 * s) +
      ' ' + r2(cx) + ' ' + r2(cy - 6 * s) + ' Z';
    attrs = attrs || {};
    attrs.d = d;
    return A.el('path', attrs, padre);
  }
  /* Una flecha con su halo: una raya por puntos y su punta. */
  function flecha(padre, pts, attrs) {
    var el = A.el;
    var g = el('g', attrs, padre);
    var n = pts.length, fin = pts[n - 1], antes = pts[n - 2];
    var ux = fin[0] - antes[0], uy = fin[1] - antes[1], lu = Math.sqrt(ux * ux + uy * uy);
    ux /= lu; uy /= lu;
    var corta = pts.slice(0, n - 1).concat([[fin[0] - ux * 3.5, fin[1] - uy * 3.5]]);
    var d = corta.map(function (p, i) { return (i ? 'L ' : 'M ') + r2(p[0]) + ' ' + r2(p[1]); }).join(' ');
    el('path', { class: 'ap-flecha-halo', d: d }, g);
    el('path', { class: 'ap-flecha', 'data-raya': '', d: d }, g);
    var bx = fin[0] - ux * 5, by = fin[1] - uy * 5, px = -uy * 3, py = ux * 3;
    el('path', { class: 'ap-punta', 'data-punta': '',
      d: 'M ' + r2(bx + px) + ' ' + r2(by + py) + ' L ' + r2(fin[0]) + ' ' + r2(fin[1]) + ' L ' + r2(bx - px) + ' ' + r2(by - py) + ' Z' }, g);
    return g;
  }

  var nube, lluvia, sol, flechas, rotuloGuardada, tiras;
  var P = {};     // las piezas de cada cerro

  /* ── Un cerro, con todo lo suyo ── */
  function cerro(svg, k) {
    var el = A.el, cx = CERROS[k], monte = k === 'monte';
    var p = P[k] = { meses: [], celdas: [] };
    var g = el('g', { 'data-cerro': k, 'data-cx': cx }, svg);

    /* La tierra del cerro, cortada. */
    el('path', { class: 'ap-tierra', 'data-forma': k, d: trazo(FORMA, cx) + ' Z' }, g);

    /* El agua guardada: un recorte con la forma de lo de adentro, y dentro,
       el agua, metida en una capa por mes. Cada mes baja lo suyo; bajan una
       dentro de la otra y se suman. El recorte no se mueve. */
    var id = 'apDentro-' + k + '-' + (A.id || 'amToma');
    var defs = el('defs', null, g), cp = el('clipPath', { id: id }, defs);
    el('path', { 'data-dentro': k, d: trazo(DENTRO, cx) + ' Z' }, cp);
    p.reserva = el('g', { class: 'am-fuera', 'data-reserva': k, 'clip-path': 'url(#' + id + ')' }, g);
    var capa = p.reserva;
    for (var i = 0; i < MESES.length; i++) { capa = el('g', { 'data-mes-nivel': i }, capa); p.meses.push(capa); }
    var y0 = NIVELES[k][0];
    p.agua = el('rect', { class: 'ap-agua', 'data-agua': k, 'data-nivel': r2(y0), x: cx - 60, y: r2(y0), width: 120, height: r2(BASE + 30 - y0) }, capa);
    el('line', { class: 'ap-agua-borde', x1: cx - 60, y1: r2(y0), x2: cx + 60, y2: r2(y0) }, capa);

    /* La superficie: hojarasca en el monte, tierra suelta en el pelado. */
    el('path', { class: monte ? 'ap-hojarasca' : 'ap-pelada', 'data-superficie': k, d: trazo(FORMA, cx) }, g);

    /* Las raíces del monte, en la tierra cortada. */
    if (monte) {
      ARBOLES.forEach(function (dx) {
        var x = cx + dx, y = altura(FORMA, dx);
        el('path', { class: 'ap-raiz', 'data-raiz': '',
          d: 'M ' + r2(x) + ' ' + r2(y) + ' L ' + r2(x - 4) + ' ' + r2(y + 7) + ' M ' + r2(x) + ' ' + r2(y) + ' L ' + r2(x + 0.5) + ' ' + r2(y + 10) +
            ' M ' + r2(x) + ' ' + r2(y) + ' L ' + r2(x + 4.5) + ' ' + r2(y + 7.5) }, g);
      });
    }
    return g;
  }

  /* Lo que va delante de la lluvia: árboles o tocones, la toma, la pila. */
  function frente(svg, k) {
    var el = A.el, cx = CERROS[k], monte = k === 'monte', p = P[k];
    var g = el('g', { 'data-frente': k }, svg);
    ARBOLES.forEach(function (dx) {
      var x = cx + dx, y = altura(FORMA, dx);
      if (monte) {
        var a = el('g', { 'data-arbol': '', 'data-x': r2(x), 'data-y': r2(y) }, g);
        el('rect', { class: 'ap-tronco', x: r2(x - 1.3), y: r2(y - 7.5), width: 2.6, height: 8 }, a);
        el('circle', { class: 'ap-copa', cx: r2(x), cy: r2(y - 12.5), r: 7.5 }, a);
      } else {
        var t = el('g', { 'data-tocon': '', 'data-x': r2(x), 'data-y': r2(y) }, g);
        el('rect', { class: 'ap-tocon', x: r2(x - 2.6), y: r2(y - 4.5), width: 5.2, height: 5 }, t);
        el('ellipse', { class: 'ap-corte', cx: r2(x), cy: r2(y - 4.5), rx: 2.6, ry: 1.1 }, t);
      }
    });
    /* La toma: una caja de cemento metida en el pie del cerro, con su tubo,
       el chorro y la pila de la aldea. */
    el('rect', { class: 'ap-cemento', 'data-toma': k, x: cx - 54, y: 146, width: 16, height: 16, rx: 1.5 }, g);
    el('rect', { class: 'ap-cemento', 'data-tubo': k, x: cx - 65, y: 148.5, width: 11, height: 3.4 }, g);
    p.pilaAgua = el('rect', { class: 'ap-pila-agua', 'data-pila-agua': k, x: cx - 73, y: 164.5, width: 18, height: 5 }, g);
    p.chorro = el('line', { class: 'ap-chorro', 'data-chorro': k, x1: cx - 62.5, y1: 152, x2: cx - 62.5, y2: 165 }, g);
    el('path', { class: 'ap-pila', 'data-pila': k, d: 'M ' + (cx - 74) + ' 160 L ' + (cx - 74) + ' 170 L ' + (cx - 54) + ' 170 L ' + (cx - 54) + ' 160' }, g);
    p.seca = equis(g, cx - 64, 165, 3.4, { class: 'am-fuera', 'data-seca': k });
    return g;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;
    niveles();

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El cielo: el sol de los meses sin lluvia y la nube de las lluvias ── */
    sol = el('g', { class: 'am-fuera', 'data-sol': '' }, svg);
    for (var r = 0; r < 8; r++) {
      var a = r * Math.PI / 4;
      el('line', { class: 'ap-rayo', x1: r2(296 + Math.cos(a) * 11), y1: r2(22 + Math.sin(a) * 11), x2: r2(296 + Math.cos(a) * 15), y2: r2(22 + Math.sin(a) * 15) }, sol);
    }
    el('circle', { class: 'ap-sol', cx: 296, cy: 22, r: 8 }, sol);

    /* ── El suelo, y los dos cerros ── */
    el('rect', { class: 'ap-tierra', 'data-suelo': '', x: -6, y: BASE, width: ANCHO + 12, height: 12 }, svg);
    el('line', { class: 'ap-suelo-borde', x1: -6, y1: BASE, x2: ANCHO + 6, y2: BASE }, svg);
    LADOS.forEach(function (k) { cerro(svg, k); });

    /* ── Adónde se va la lluvia: en el monte, adentro; en el pelado, casi
       toda cuesta abajo, y un poco adentro. ── */
    flechas = el('g', { class: 'am-fuera', 'data-flechas': '' }, svg);
    [-16, 0, 16].forEach(function (dx) {
      var y = altura(FORMA, dx), x = CERROS.monte + dx;
      flecha(flechas, [[x, y + 3], [x, y + 26]], { 'data-entra': 'monte' });
    });
    var yp = altura(FORMA, 0);
    flecha(flechas, [[CERROS.pelado, yp + 3], [CERROS.pelado, yp + 11]], { 'data-entra': 'pelado' });
    var corre = [];
    for (var dx = 8; dx <= 64; dx += 4) corre.push([CERROS.pelado + dx, altura(FORMA, dx) - 2.5]);
    corre.push([ANCHO - 3, BASE - 2.5]);
    flecha(flechas, corre, { 'data-corre': 'pelado' });

    /* ── La lluvia: las mismas gotas, a la misma distancia, sobre los dos
       cerros. Cada una termina en el suelo que tiene debajo. ── */
    lluvia = el('g', { class: 'am-fuera', 'data-lluvia': '' }, svg);
    /* Cada 16: la distancia entre los dos cerros (160) es un número entero
       de gotas, así que sobre cada cerro caen las gotas en los mismos
       puntos, medidos desde su centro. Y no más juntas: cada raya cortada
       se vuelve a pintar en cada cuadro mientras la lluvia aparece. */
    for (var x = 8; x <= ANCHO - 8; x += 16) {
      var sup = BASE;
      LADOS.forEach(function (k) { var d = x - CERROS[k]; if (d > -64 && d < 64) sup = altura(FORMA, d); });
      el('line', { class: 'ap-gota', 'data-gota': '', x1: x, y1: 38, x2: x, y2: r2(sup - 2) }, lluvia);
    }
    nube = el('g', { class: 'am-fuera', 'data-nube': '' }, svg);
    [[26, 24, 11], [58, 17, 15], [94, 21, 12], [128, 14, 16], [164, 19, 14], [200, 13, 16], [236, 20, 13], [268, 16, 14], [296, 24, 10]]
      .forEach(function (b) { el('circle', { class: 'ap-nube', cx: b[0], cy: b[1], r: b[2] }, nube); });
    el('rect', { class: 'ap-nube', x: 6, y: 22, width: 308, height: 16, rx: 8 }, nube);

    /* ── Lo de delante: el monte, los tocones, las tomas ── */
    LADOS.forEach(function (k) { frente(svg, k); });

    /* Los bidones de la aldea del cerro pelado, cuando su toma se seca. */
    P.pelado.bidones = el('g', { class: 'am-fuera', 'data-bidones': '' }, svg);
    [147, 156].forEach(function (bx) {
      var b = el('g', { 'data-bidon': '' }, P.pelado.bidones);
      el('rect', { class: 'ap-bidon', x: bx, y: 158, width: 7, height: 11.5, rx: 1.6 }, b);
      el('rect', { class: 'ap-bidon-tapa', x: bx + 1, y: 156.4, width: 2.6, height: 1.8 }, b);
      el('path', { class: 'ap-bidon-asa', d: 'M ' + (bx + 4.2) + ' 158 L ' + (bx + 6) + ' 156.6' }, b);
    });

    rotuloGuardada = texto(svg, { class: 'am-rotulo am-fuera', 'data-rotulo': 'guardada', x: CERROS.monte, y: 150, 'font-size': 10, 'text-anchor': 'middle' }, 'agua guardada');

    /* ── Los nombres de los cerros ── */
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'monte', x: CERROS.monte, y: 195, 'font-size': 11.5, 'text-anchor': 'middle' }, 'con monte');
    texto(svg, { class: 'am-rotulo', 'data-rotulo': 'pelado', x: CERROS.pelado, y: 195, 'font-size': 11.5, 'text-anchor': 'middle' }, 'pelado');

    /* ── Las tiras de los meses sin lluvia: una celda por mes, con una gota
       si la toma dio agua y una ✗ si no. ── */
    tiras = el('g', { class: 'am-fuera', 'data-tiras': '' }, svg);
    LADOS.forEach(function (k) {
      var cx = CERROS[k], x0 = cx - (MESES.length * CELDA + (MESES.length - 1) * HUECO) / 2;
      MESES.forEach(function (m, i) {
        var x = r2(x0 + i * (CELDA + HUECO)), mx = x + CELDA / 2, my = TIRA_Y + CELDA / 2;
        el('rect', { class: 'ap-celda', 'data-celda': k + '-' + i, x: x, y: TIRA_Y, width: CELDA, height: CELDA, rx: 3 }, tiras);
        texto(tiras, { class: 'am-rotulo', 'data-mes': k + '-' + i, x: r2(mx), y: TIRA_Y + CELDA + 12, 'font-size': 11, 'text-anchor': 'middle' }, m);
        var hay = conAgua(k, i);
        var c = hay
          ? gota(tiras, mx, my, 0.95, { class: 'ap-gota-mes am-fuera', 'data-contenido': k + '-' + i, 'data-tipo': 'gota' })
          : equis(tiras, mx, my, 4, { class: 'am-fuera', 'data-contenido': k + '-' + i, 'data-tipo': 'x' });
        P[k].celdas.push(c);
      });
    });
    texto(tiras, { class: 'am-rotulo', 'data-rotulo': 'meses', x: ANCHO / 2, y: ALTO - 5, 'font-size': 10.5, 'text-anchor': 'middle' }, 'de noviembre a abril, sin lluvia');
  }

  function pintar(n, antes) {
    var atras = antes > n;
    function d(v) { return atras ? 0 : v; }

    /* El cielo. */
    var llueve = n === 1 || n >= 5;
    var dNube = n === 5 ? d(1400) : 0;
    A.ver(nube, llueve, dNube);
    A.ver(lluvia, llueve, dNube);
    A.ver(sol, n === 3 || n === 4, n === 3 ? d(200) : n === 5 ? d(1200) : 0);

    /* Adónde se va la lluvia. */
    A.ver(flechas, n === 1 || n === 2 || n === FIN, n === 1 ? d(600) : n === FIN ? d(300) : 0);

    /* El agua guardada, que se ve desde el paso 2, y baja mes por mes. */
    LADOS.forEach(function (k) {
      var p = P[k];
      A.ver(p.reserva, n >= 2, n === 2 ? d(200) : 0);
      p.meses.forEach(function (g, i) {
        var baja = n >= PASO_MES[i] ? NIVELES[k][i + 1] - NIVELES[k][i] : 0;
        A.mover(g, 0, baja, 0, 1, n === PASO_MES[i] ? d(D_MES[i]) : 0);
      });
      /* Las tiras: cada mes sale cuando llega. */
      p.celdas.forEach(function (c, i) { A.ver(c, n >= PASO_MES[i], n === PASO_MES[i] ? d(D_MES[i]) : 0); });
    });
    A.ver(rotuloGuardada, n === 2, n === 2 ? d(700) : 0);
    A.ver(tiras, n >= 3, n === 3 ? d(300) : 0);

    /* La toma del pelado se seca en marzo; desde ahí, bidones. */
    var marzo = 4, seco = n >= PASO_MES[marzo];
    var dSeco = n === PASO_MES[marzo] ? d(D_MES[marzo]) : 0;
    A.ver(P.pelado.chorro, !seco, dSeco);
    A.ver(P.pelado.pilaAgua, !seco, dSeco);
    A.ver(P.pelado.seca, seco, dSeco);
    A.ver(P.pelado.bidones, seco, n === PASO_MES[marzo] ? d(D_MES[marzo] + 300) : 0);
    A.ver(P.monte.chorro, true, 0);
    A.ver(P.monte.pilaAgua, true, 0);
    A.ver(P.monte.seca, false, 0);
  }

  function marcador(n) {
    return [
      { cifra: '?', palabras: 'cuál toma aguanta más sin lluvia' },
      { cifra: '=', palabras: 'la misma lluvia en los dos cerros' },
      { cifra: '↓', palabras: 'el agua que cada cerro guardó' },
      { cifra: 'noviembre', palabras: 'se acabaron las lluvias' },
      { cifra: 'marzo', palabras: 'se secó la toma del cerro pelado' },
      { cifra: '2 meses', palabras: 'sin agua en la toma del cerro pelado' },
      { cifra: '6 y 4', palabras: 'meses con agua sin lluvia: monte y pelado' }
    ][n];
  }

  AnimacionMision.montar('#amToma', {
    vista: [ANCHO, ALTO],
    describe: 'Dos cerros iguales, uno al lado del otro y cortados para ver lo de adentro: el de la izquierda con monte y el de la derecha pelado. Al pie de cada uno, la toma de agua de una aldea. Abajo, los meses sin lluvia.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🌧️ Que llueva', '💧 ¿Y adentro?', '☀️ Llega noviembre', '📅 Pasan los meses', '🌧️ ¿Y en mayo?', '💡 ¿Y don Tulio?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
