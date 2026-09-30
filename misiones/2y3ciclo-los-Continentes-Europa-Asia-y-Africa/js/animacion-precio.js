/* ============================================================
   M.E.T.A.S · Los Continentes: Europa, Asia y África ·
   «El precio que no se pone aquí»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de don
   Chele: corta el mismo café todos los años, y unos años le pagan bien
   por el quintal y otros, por el mismo quintal, mucho menos, sin que él
   haya cambiado nada. La historia dice que ese precio se decide donde
   están los que lo compran y los que también lo venden, del otro lado
   del mundo. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Arriba va el mapa (DÓNDE) y abajo la mesa del precio (QUÉ PASA):

     0  el quintal de don Chele, y su precio todavía con un «?»;
     1  el café cruza el océano hasta Europa: allá lo compran;
     2  en Asia también compran café de Honduras, y a ellos les llega café
        de muchas partes;
     3  un año llega poco café de otras partes: tres quintales para
        cuatro que compran, no alcanza, y a don Chele le pagan bien;
     4  otro año llega mucho: ocho quintales para los mismos cuatro, sobra
        café, y por el mismo quintal le pagan mucho menos;
     5  don Chele no cambió nada: cambió cuánto café llegó allá. Y la
        pregunta es del alumno: qué hay en su casa que vino de Europa, de
        Asia o de África.

   Ocho decisiones, y ninguna es de adorno:

   1. ⚠️ **La misión no enseña por qué cambia el precio, y la historia lo
      promete.** Es lo que pasó con la hora en la misión de América,
      Oceanía y Antártida: la historia lo pedía y la animación lo cumple.
      Es la ley de la oferta y la demanda, contada con un caso y SIN UNA
      SOLA CIFRA DE PRECIO: el dinero es una pila de monedas que crece y
      baja, y lo que falta se dibuja con raya cortada. Los quintales y las
      tazas son dibujo, no datos: nadie dice cuántos se venden de verdad.
   2. ⚠️ **Quién compra, solo lo que la misión acredita.** «Honduras
      exporta café a la UE» y «café a Japón y Corea del Sur» están en la
      misión; por eso se iluminan Europa y Asia. De dónde viene el OTRO
      café no lo dice ningún documento de este repositorio, así que los
      quintales llegan «de otras partes» y no se pone a nadie en el mapa.
   3. ⚠️ **Lo que pregunta la prueba no se dice.** Ni tamaños, ni países,
      ni los productos de la prueba (banano, textiles, ropa, tecnología),
      ni el acuerdo con Europa, ni la agencia de Corea, ni el mar entre
      Europa y África. Las frases dicen «el océano», y el mapa enseña
      dónde está cada cosa. Y la pregunta de selección que pedía qué vende
      Honduras a Europa ahora pide lo de ADEMÁS del café: el café ya lo
      contaba la historia.
   4. **Solo hay flecha hasta Europa.** El café que va a Asia sale por el
      otro océano, y en un mapa con el Atlántico en medio esa flecha se
      saldría por una orilla para entrar por la otra. Asia se ilumina sin
      flecha, que no afirma ningún camino.
   5. **El mapa tiene el Atlántico en medio y la costura en el estrecho
      de Bering** (el meridiano del centro es el 10° E): Honduras, Europa,
      África y Asia quedan enteras y de un solo lado. Es de áreas
      verdaderas (Equal Earth), como el de la misión anterior.
   6. **Europa y Asia se separan por su línea de siempre**: los Urales, el
      río Ural, el Caspio, el Cáucaso, el mar Negro y los estrechos. La
      partición vive en js/data/contornos-mundo.js, y el agua se pinta
      encima de las luces: el mar Negro no se ilumina.
   7. **El quintal de don Chele es el mismo en los dos años**: el mismo
      dibujo, en el mismo sitio y vendido las dos veces. Lo que cambia son
      los otros. Es la frase de la historia, «él no cambió nada», puesta
      donde se puede comprobar.
   8. **Nada se dice solo con color.** Cada continente lleva su nombre; la
      taza sin café lleva raya cortada y «falta» debajo; lo que sobra va en
      un recuadro de raya cortada que dice «sobran»; las monedas que ya no
      están, con raya cortada. El mapa y la mesa son papel: se quedan como
      son en las dos pantallas.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !window.CONTORNOS_MUNDO || !document.getElementById('amPrecio')) return;

  var ANCHO = 304, ALTO = 256, FIN = 5;
  var MUNDO = window.CONTORNOS_MUNDO;

  /* ── La proyección: Equal Earth (Šavrič, Patterson y Jenny, 2018) ──
     El meridiano del centro es L0; la costura, L0 − 180: el 170° O, en el
     estrecho de Bering, entre el cabo del este de Asia (180° en los
     contornos) y el oeste de Alaska (168° O). */
  var L0 = 10, ESCALA = 54, CX = 152, CY = 76;
  var A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, R3 = Math.sqrt(3);
  function r2(v) { return Math.round(v * 100) / 100; }
  function norm(d) { while (d > 180) d -= 360; while (d <= -180) d += 360; return d; }
  function proyD(dl, lat) {
    var l = dl * Math.PI / 180, f = lat * Math.PI / 180;
    var t = Math.asin(R3 / 2 * Math.sin(f)), t2 = t * t, t6 = t2 * t2 * t2;
    var x = 2 * R3 * l * Math.cos(t) / (3 * (9 * A4 * t6 * t2 + 7 * A3 * t6 + 3 * A2 * t2 + A1));
    var y = t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2));
    return [CX + ESCALA * x, CY - ESCALA * y];
  }
  function proy(lon, lat) { return proyD(norm(lon - L0), lat); }

  /* ── La costura: un anillo que la cruza se parte en dos ──
     Con esta costura solo la cruza la Antártida, que da la vuelta entera:
     empieza en una orilla y acaba en la otra, y se cierra por el polo. */
  function cruce(a, b) {
    var lado = a[0] > 0 ? 180 : -180;
    var bd = b[0] + (lado === 180 ? 360 : -360);
    var t = (lado - a[0]) / (bd - a[0]);
    return [lado, a[1] + t * (b[1] - a[1])];
  }
  function orilla(lado, desde, hasta) {
    var fuera = [], pasos = Math.max(1, Math.ceil(Math.abs(hasta - desde) / 3));
    for (var i = 1; i <= pasos; i++) fuera.push([lado, desde + (hasta - desde) * i / pasos]);
    return fuera;
  }
  function cerrar(tr) {
    var ini = tr[0], fin = tr[tr.length - 1];
    if (ini[0] === fin[0]) return tr.concat(orilla(fin[0], fin[1], ini[1]));
    var polo = ini[1] + fin[1] < 0 ? -90 : 90;
    return tr.concat(orilla(fin[0], fin[1], polo), orilla(ini[0], polo, ini[1]));
  }
  function partir(c) {
    var P = [], i, n;
    for (i = 0; i < c.length; i += 2) if (c[i + 1] > -89.9) P.push([norm(c[i] - L0), c[i + 1]]);
    n = P.length;
    var primero = -1;
    for (i = 0; i < n; i++) if (Math.abs(P[(i + 1) % n][0] - P[i][0]) > 180) { primero = i; break; }
    if (primero < 0) return [P];
    var c0 = cruce(P[primero], P[(primero + 1) % n]);
    var actual = [[-c0[0], c0[1]], P[(primero + 1) % n]], trozos = [];
    for (var k = 1; k <= n; k++) {
      var a = P[(primero + k) % n], b = P[(primero + k + 1) % n];
      if (Math.abs(b[0] - a[0]) > 180) {
        var c1 = cruce(a, b);
        actual.push(c1);
        trozos.push(cerrar(actual));
        actual = [[-c1[0], c1[1]], b];
      } else if (k < n) actual.push(b);
    }
    return trozos;
  }
  function camino(puntos) {
    var d = '';
    for (var i = 0; i < puntos.length; i++) {
      var p = proyD(puntos[i][0], puntos[i][1]);
      d += (i ? ' L ' : 'M ') + r2(p[0]) + ' ' + r2(p[1]);
    }
    return d + ' Z';
  }
  function contorno(c) { return partir(c).map(camino).join(' '); }
  function borde() {
    return camino([[-180, 90]].concat(orilla(-180, 90, -90), [[180, -90]], orilla(180, -90, 90)));
  }

  /* ── Lo que se ve en el mapa ── */
  var CASA = [-87.2, 14.6];                       // Honduras: la aldea de don Chele
  var DESTINO = [-1, 47.2];                       // Europa, del otro lado del océano
  var ORDEN = ['europa', 'asia', 'africa'];
  var NOMBRE = { europa: 'Europa', asia: 'Asia', africa: 'África' };
  var LUGAR_NOMBRE = { europa: [32, 58], asia: [92, 47], africa: [21, 8] };

  /* ── La mesa del precio ──
     Las tazas son los que compran; los quintales, los que venden. Una taza
     con un quintal debajo es un quintal vendido. El de don Chele es el
     primero, con su precio colgado a la izquierda, y los que no tienen
     taza encima se amontonan a la derecha: esos sobran. */
  var MESA = { x: 4, y: 157, w: 296, h: 95 };
  var FILA_TAZAS = 177, FILA_ROTULOS = 247;
  var TAZAS = 4;
  /* Dónde va cada quintal: los cuatro primeros, debajo de su taza; los
     otros cuatro, en el montón (tres abajo y uno encima). */
  var LUGAR = [[66, 217], [102, 217], [138, 217], [174, 217], [222, 223], [250, 223], [278, 223], [236, 199]];
  var SACOS_ANIO = { 3: 3, 4: 8 };                       // quintales en la mesa, por paso
  var ENTRA = 70;                                        // de dónde llegan: fuera, a la derecha
  /* Cuándo llega cada quintal (ms): uno detrás de otro, y el de encima del
     montón al final, cuando los de abajo ya están. El café de una taza se
     sirve cuando su quintal ya llegó debajo. */
  var LLEGA = { 1: 150, 2: 350, 3: 150, 4: 300, 5: 420, 6: 540, 7: 850 };
  var CAFE = { 3: [500, 1000, 1200, 0], 4: [0, 0, 0, 1000] };
  var ETIQ = { x: 8, y: 190, w: 34, h: 50 };
  var MONEDAS = [233, 225.5, 218];                       // la pila, de abajo arriba

  var TEXTOS = [
    'Este es el quintal de don Chele. Su precio no se pone en su aldea ni en Tegucigalpa. ¿Dónde se pone?',
    'El café cruza el océano hasta Europa. Allá hay quienes lo compran.',
    'En Asia también compran café de Honduras. Y no solo el de don Chele: allá llega café de muchas partes.',
    'Un año llega poco café de otras partes. No alcanza para todos, y a don Chele le pagan bien.',
    'Otro año llega mucho café de otras partes. Sobra café, y por el mismo quintal le pagan mucho menos.',
    'Don Chele no cambió nada: cambió cuánto café llegó allá. ¿Qué hay en tu casa que vino de Europa, de Asia o de África?'
  ];

  var A;
  var luces = {}, nombres = {}, ruta = {}, burbuja;
  var tazas = [], sacos = [], monedas = [], fantasmas = [];
  var falta, sobran, dudaPrecio, rotulos = {};

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* La casa de Honduras, chiquita: el pie de la pared sobre su punto. */
  function casa(padre, p) {
    var el = A.el;
    var g = el('g', { 'data-casa': '', 'data-lon': CASA[0], 'data-lat': CASA[1],
      transform: 'translate(' + r2(p[0]) + ' ' + r2(p[1]) + ')' }, padre);
    el('rect', { class: 'pc-pared', x: -3.6, y: -5.4, width: 7.2, height: 5.4 }, g);
    el('path', { class: 'pc-techo', d: 'M -4.8 -5.2 L 0 -9.4 L 4.8 -5.2 Z' }, g);
    el('rect', { class: 'pc-puerta', x: -0.9, y: -3, width: 1.8, height: 3 }, g);
    return g;
  }

  /* El camino del café, en curva sobre el océano: la raya acaba donde
     empieza la punta, y sale a 7 de la casa para no taparla. */
  function flecha(padre, desde, hasta, curva) {
    var el = A.el;
    var dx = hasta[0] - desde[0], dy = hasta[1] - desde[1], L = Math.sqrt(dx * dx + dy * dy);
    var cx = (desde[0] + hasta[0]) / 2 - dy * curva, cy = (desde[1] + hasta[1]) / 2 + dx * curva;
    var ux = hasta[0] - cx, uy = hasta[1] - cy, lu = Math.sqrt(ux * ux + uy * uy);
    ux /= lu; uy /= lu;
    var sx = desde[0] + (cx - desde[0]) / L * 7, sy = desde[1] + (cy - desde[1]) / L * 7;
    var g = el('g', { 'data-ruta': '', 'data-destino-lon': DESTINO[0], 'data-destino-lat': DESTINO[1] }, padre);
    ruta.raya = el('path', { class: 'pc-flecha', 'data-raya': '',
      d: 'M ' + r2(sx) + ' ' + r2(sy) + ' Q ' + r2(cx) + ' ' + r2(cy) + ' ' + r2(hasta[0] - ux * 3) + ' ' + r2(hasta[1] - uy * 3) }, g);
    var bx = hasta[0] - ux * 4.4, by = hasta[1] - uy * 4.4, px = -uy * 2.6, py = ux * 2.6;
    ruta.punta = el('path', { class: 'pc-punta am-fuera', 'data-punta': '',
      d: 'M ' + r2(bx + px) + ' ' + r2(by + py) + ' L ' + r2(hasta[0]) + ' ' + r2(hasta[1]) + ' L ' + r2(bx - px) + ' ' + r2(by - py) + ' Z' }, g);
  }

  /* Una taza: el cuerpo, el asa, el café de dentro y el vapor. Sin café
     queda la taza sola: la que no alcanzó a comprar. */
  function taza(padre, i, x, y) {
    var el = A.el;
    var g = el('g', { class: 'am-fuera', 'data-taza': i, 'data-x': x, 'data-y': y }, padre);
    var cuerpo = el('path', { class: 'pc-taza', 'data-cuerpo': '',
      d: 'M ' + r2(x - 9) + ' ' + r2(y - 8) + ' L ' + r2(x + 8) + ' ' + r2(y - 8) + ' L ' + r2(x + 6.6) + ' ' + r2(y + 5) +
        ' Q ' + r2(x - 0.5) + ' ' + r2(y + 10.5) + ' ' + r2(x - 7.6) + ' ' + r2(y + 5) + ' Z' }, g);
    el('path', { class: 'pc-asa', d: 'M ' + r2(x + 7.4) + ' ' + r2(y - 4.6) + ' Q ' + r2(x + 13.8) + ' ' + r2(y - 3.3) + ' ' + r2(x + 6.8) + ' ' + r2(y + 2.6) }, g);
    var cafe = el('path', { class: 'pc-cafe am-fuera', 'data-cafe': '',
      d: 'M ' + r2(x - 8) + ' ' + r2(y - 4.7) + ' L ' + r2(x + 6.9) + ' ' + r2(y - 4.7) + ' L ' + r2(x + 5.9) + ' ' + r2(y + 4.7) +
        ' Q ' + r2(x - 0.5) + ' ' + r2(y + 8.9) + ' ' + r2(x - 7) + ' ' + r2(y + 4.7) + ' Z' }, g);
    var vapor = el('g', { class: 'am-fuera', 'data-vapor': '' }, g);
    el('path', { class: 'pc-vapor', d: 'M ' + r2(x - 3.2) + ' ' + r2(y - 10.5) + ' q -2 -2.4 0 -4.8 q 2 -2.4 0 -4.8' }, vapor);
    el('path', { class: 'pc-vapor', d: 'M ' + r2(x + 2.4) + ' ' + r2(y - 10.5) + ' q -2 -2.4 0 -4.8 q 2 -2.4 0 -4.8' }, vapor);
    return { g: g, cuerpo: cuerpo, cafe: cafe, vapor: vapor };
  }

  /* Un quintal: el saco de manta con su cuello amarrado. */
  function forma(x, y) {
    return 'M ' + r2(x - 10) + ' ' + r2(y + 15) + ' Q ' + r2(x - 15) + ' ' + r2(y + 1) + ' ' + r2(x - 8) + ' ' + r2(y - 9) +
      ' L ' + r2(x - 4) + ' ' + r2(y - 12) + ' L ' + r2(x - 5.8) + ' ' + r2(y - 16) + ' L ' + r2(x + 5.8) + ' ' + r2(y - 16) +
      ' L ' + r2(x + 4) + ' ' + r2(y - 12) + ' L ' + r2(x + 8) + ' ' + r2(y - 9) + ' Q ' + r2(x + 15) + ' ' + r2(y + 1) + ' ' +
      r2(x + 10) + ' ' + r2(y + 15) + ' Z';
  }
  function saco(padre, k, x, y) {
    var el = A.el;
    var attrs = { 'data-saco': k, 'data-x': x, 'data-y': y };
    if (k === 0) attrs['data-chele'] = '';
    else attrs.class = 'am-fuera';
    var g = el('g', attrs, padre);
    el('path', { class: 'pc-saco', d: forma(x, y) }, g);
    el('rect', { class: 'pc-amarre', x: r2(x - 5), y: r2(y - 13), width: 10, height: 2, rx: 1 }, g);
    return g;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── El mapa ── */
    var mapa = el('g', { 'data-mundo': '', 'data-l0': L0 }, svg);
    el('path', { class: 'pc-mar', 'data-mar': '', d: borde() }, mapa);
    MUNDO.tierra.forEach(function (c, i) {
      el('path', { class: 'pc-tierra', 'data-tierra': MUNDO.continente[i], 'data-anillo': i, d: contorno(c) }, mapa);
    });

    /* Cada continente, iluminado encima del mapa gris. Europa y Asia salen
       de la partición del anillo grande más sus islas. */
    ORDEN.forEach(function (k) {
      var g = el('g', { class: 'am-fuera pc-luz pc-luz-' + k, 'data-luz': k }, mapa);
      if (k !== 'africa') el('path', { 'data-anillo': '12-' + k, d: contorno(MUNDO.eurasia[k]) }, g);
      MUNDO.tierra.forEach(function (c, i) {
        if (MUNDO.continente[i] === k) el('path', { 'data-anillo': i, d: contorno(c) }, g);
      });
      luces[k] = g;
    });

    /* El agua de dentro de la tierra va ENCIMA de las luces: si no, el mar
       Negro y el Caspio se iluminarían con Europa y con Asia. */
    MUNDO.agua.forEach(function (c) { el('path', { class: 'pc-agua', 'data-agua': '', d: contorno(c) }, mapa); });

    var pc = proy(CASA[0], CASA[1]);
    var pd = proy(DESTINO[0], DESTINO[1]);
    flecha(svg, [pc[0], pc[1] - 4.5], pd, -0.3);
    casa(svg, pc);
    texto(svg, { class: 'pc-lugar', 'data-honduras': '', x: r2(pc[0] - 6.5), y: r2(pc[1] + 3.5), 'font-size': 10, 'text-anchor': 'end' }, 'Honduras');

    ORDEN.forEach(function (k) {
      var p = proy(LUGAR_NOMBRE[k][0], LUGAR_NOMBRE[k][1]);
      nombres[k] = texto(svg, { class: 'pc-nombre am-fuera', 'data-nombre': k,
        x: r2(p[0]), y: r2(p[1]), 'font-size': 11.5 }, NOMBRE[k]);
    });

    /* La pregunta del final, sobre la casa: lo que vino de allá. */
    burbuja = el('g', { class: 'am-fuera', 'data-burbuja': '',
      transform: 'translate(' + r2(pc[0] - 9) + ' ' + r2(pc[1] - 15) + ')' }, svg);
    el('circle', { class: 'pc-duda', cx: 0, cy: 0, r: 5.6 }, burbuja);
    texto(burbuja, { class: 'pc-signo', x: 0, y: 3.2, 'font-size': 8.5 }, '?');

    /* ── La mesa ── */
    var mesa = el('g', { 'data-mesa': '' }, svg);
    el('rect', { class: 'pc-mesa', x: MESA.x, y: MESA.y, width: MESA.w, height: MESA.h, rx: 8 }, mesa);

    rotulos.compran = texto(mesa, { class: 'pc-rotulo am-fuera', 'data-rotulo': 'compran',
      x: 51, y: FILA_TAZAS + 3.5, 'font-size': 10, 'text-anchor': 'end' }, 'compran');
    rotulos.chele = texto(mesa, { class: 'pc-rotulo', 'data-rotulo': 'chele',
      x: LUGAR[0][0], y: FILA_ROTULOS, 'font-size': 9.5, 'text-anchor': 'middle' }, 'don Chele');

    /* Lo que falta en el año de poco café: el lugar vacío debajo de la
       última taza, con raya cortada. */
    falta = el('g', { class: 'am-fuera', 'data-falta': '', 'data-x': LUGAR[3][0] }, mesa);
    el('path', { class: 'pc-falta', d: forma(LUGAR[3][0], LUGAR[3][1]) }, falta);
    texto(falta, { class: 'pc-rotulo', 'data-rotulo': 'falta', x: LUGAR[3][0], y: FILA_ROTULOS, 'font-size': 9.5, 'text-anchor': 'middle' }, 'falta');

    /* Lo que sobra en el año de mucho café: el montón de los quintales que
       no tienen taza encima, en un recuadro de raya cortada. */
    sobran = el('g', { class: 'am-fuera', 'data-sobran': '' }, mesa);
    el('rect', { class: 'pc-sobran', x: 204, y: 178, width: 92, height: 62, rx: 6 }, sobran);
    texto(sobran, { class: 'pc-rotulo', 'data-rotulo': 'sobran', x: 250, y: FILA_ROTULOS + 2, 'font-size': 9.5, 'text-anchor': 'middle' }, 'sobran');

    for (var k = 0; k < LUGAR.length; k++) sacos.push(saco(mesa, k, LUGAR[k][0], LUGAR[k][1]));
    for (var i = 0; i < TAZAS; i++) tazas.push(taza(mesa, i, LUGAR[i][0], FILA_TAZAS));

    /* El precio del quintal de don Chele: una etiqueta colgada de su
       cuello, con la pila de monedas que le pagan. */
    var precio = el('g', { 'data-precio': '' }, mesa);
    var ox = ETIQ.x + ETIQ.w / 2, oy = ETIQ.y + 5.5;
    el('path', { class: 'pc-hilo', d: 'M ' + ox + ' ' + oy + ' Q 50 186 ' + r2(LUGAR[0][0] - 4.5) + ' ' + r2(LUGAR[0][1] - 12) }, precio);
    el('rect', { class: 'pc-etiqueta', x: ETIQ.x, y: ETIQ.y, width: ETIQ.w, height: ETIQ.h, rx: 4 }, precio);
    el('circle', { class: 'pc-ojal', cx: ox, cy: oy, r: 2 }, precio);
    dudaPrecio = texto(precio, { class: 'pc-signo', 'data-precio-duda': '', x: ox, y: ETIQ.y + 35, 'font-size': 19 }, '?');
    MONEDAS.forEach(function (y, j) {
      fantasmas.push(el('ellipse', { class: 'pc-fantasma am-fuera', 'data-fantasma': j, cx: ox, cy: y, rx: 11.5, ry: 3.8 }, precio));
      monedas.push(el('ellipse', { class: 'pc-moneda am-fuera', 'data-moneda': j, cx: ox, cy: y, rx: 11.5, ry: 3.8 }, precio));
    });
  }

  function pintar(n, antes) {
    var i;
    /* Volviendo del año de mucho café al de poco, los quintales de más se
       van enseguida, y el precio tiene que volver con ellos: si las monedas
       esperaran lo que esperan al llegar, la etiqueta diría un momento
       «le pagan menos» en el año en que le pagan bien. */
    var vuelve = n === 3 && antes === 4;
    /* ── El mapa ── */
    A.trazar(ruta.raya, n >= 1, 100);
    A.ver(ruta.punta, n >= 1, n >= 1 ? 800 : 0);
    ORDEN.forEach(function (k) {
      var paso = k === 'europa' ? 1 : k === 'asia' ? 2 : 5;
      var si = n >= paso;
      A.ver(luces[k], si, si ? (k === 'europa' ? 700 : 200) : 0);
      A.ver(nombres[k], si, si ? (k === 'europa' ? 1000 : 500) : 0);
    });
    A.ver(burbuja, n === FIN, n === FIN ? 900 : 0);

    /* ── La mesa ── */
    A.ver(rotulos.compran, n >= 1, n >= 1 ? 1000 : 0);
    for (i = 0; i < TAZAS; i++) {
      var sale = i < 2 ? n >= 1 : n >= 2;
      A.ver(tazas[i].g, sale, sale ? (i < 2 ? 1100 + i * 150 : 600 + (i - 2) * 150) : 0);
    }
    var enMesa = SACOS_ANIO[n] || (n > 4 ? SACOS_ANIO[4] : 1);
    for (var k = 1; k < sacos.length; k++) {
      var esta = k < enMesa;
      /* Llegan de fuera, por la derecha, uno detrás de otro; los del año
         de poco café ya estaban. */
      var demora = esta ? LLEGA[k] : 0;
      A.mover(sacos[k], esta ? 0 : ENTRA, 0, 0, 1, demora);
      A.ver(sacos[k], esta, demora);
    }
    /* Una taza tiene café si hay un quintal debajo de ella. */
    for (i = 0; i < TAZAS; i++) {
      var llena = n >= 3 && i < enMesa;
      var d = llena && CAFE[n] ? CAFE[n][i] : 0;
      A.ver(tazas[i].cafe, llena, d);
      A.ver(tazas[i].vapor, llena, d + (llena ? 200 : 0));
    }
    A.ver(falta, n === 3, n === 3 ? (vuelve ? 300 : 1250) : 0);
    A.ver(sobran, n >= 4, n >= 4 ? 1500 : 0);

    /* El precio: «?» hasta que hay quien compre y quien venda; tres
       monedas el año de poco café, una el de mucho, y las dos que se
       fueron con raya cortada. */
    var pila = n === 3 ? 3 : n >= 4 ? 1 : 0;
    A.ver(dudaPrecio, pila === 0, pila === 0 ? 300 : 0);
    for (i = 0; i < MONEDAS.length; i++) {
      var hay = i < pila;
      A.ver(monedas[i], hay, hay ? (vuelve ? 150 + i * 120 : 1300 + i * 150) : (n >= 4 ? 1500 : 0));
      A.ver(fantasmas[i], n >= 4 && !hay, n >= 4 && !hay ? 1650 : 0);
    }
  }

  function marcador(n) {
    if (n === 0) return { cifra: '?', palabras: 'el precio de su quintal' };
    if (n === 1) return { cifra: '1', palabras: 'continente que lo compra' };
    if (n === 2) return { cifra: '2', palabras: 'continentes que lo compran' };
    if (n === 3) return { cifra: '3', palabras: 'quintales para 4 que compran' };
    if (n === 4) return { cifra: '8', palabras: 'quintales para 4 que compran' };
    return { cifra: '?', palabras: 'lo que vino a tu casa' };
  }

  AnimacionMision.montar('#amPrecio', {
    vista: [ANCHO, ALTO],
    describe: 'Arriba, un mapa del mundo con Honduras a la izquierda y, del otro lado del océano, Europa, Asia y África; abajo, una mesa con las tazas de los que compran café y los quintales de los que lo venden.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🚢 Que salga el café', '☕ ¿Quién más?', '⚖️ ¿Y el precio?', '📦 Otro año', '🗺️ ¿Qué cambió?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
