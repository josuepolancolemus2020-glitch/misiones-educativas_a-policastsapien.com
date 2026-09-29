/* ============================================================
   M.E.T.A.S · División de Decimales · A cómo le pagan el galón
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de
   don Chele, que entregó 4.5 galones de leche por L 315 y en la
   otra ruta le ofrecen L 68 el galón. Para decidir si se cambia
   tiene que dividir 315 entre 4.5. El aparato (botones, frase,
   marcador) vive en js/animacion-mision.js; aquí solo está el
   dibujo y dónde va cada pieza en cada paso.

   Arriba van los galones (cuatro llenos y uno a la mitad) y abajo
   la división, en cuadrícula como en el cuaderno. Lo que enseña,
   en el orden en que se aprende:

     0  4.5 galones por L 315, y allá pagan L 68 el galón: ¿se
        cambia? Se decide antes de tocar;
     1  diez entregas iguales son 45 galones y L 3,150, y el galón
        sale al mismo precio: 315 ÷ 4.5 da lo mismo que 3150 ÷ 45;
     2  eso es correr el punto un lugar en los dos: 4.5 se vuelve
        45, y a 315 le falta una cifra, así que se le pone un 0;
     3  ya es una división de siempre: 3150 entre 45 da 70;
     4  el punto vuelve a su lugar y el resultado es el mismo, y se
        comprueba con la entrega: cuatro galones a L 70 y medio a
        L 35 suman L 315;
     5  allá, los mismos 4.5 galones serían L 306: nueve lempiras
        menos en cada entrega, así que le conviene quedarse.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Primero por qué, después cómo.** Diez entregas iguales es
      diez veces la leche y diez veces la plata, y el galón sale al
      mismo precio: eso es lo que deja correr el punto en los DOS
      números sin cambiar el resultado. Correr el punto sin saber
      eso es un truco, y un truco se olvida al mes.
   2. **El punto salta y las cifras se quedan quietas**, en
      cuadrícula y con los saltos por debajo de las cifras, igual que
      en la animación de la misión anterior (Multiplicación de
      Decimales): la misma idea se dibuja igual en toda la ruta.
   3. ⚠️ **315 no tiene punto a la vista, y aun así lo tiene.** Se
      dibuja con raya cortada detrás del 5, salta un lugar, y en el
      cuadro que queda libre entra el 0: es el Bloque 2 de la misión
      («agregar ceros cuando faltan cifras») hecho con la historia.
   4. ⚠️ **Lo que va debajo NO se regala.** El «Predice» pregunta si
      el resultado sale mayor o menor que el dividendo según el
      divisor (10 ÷ 0.50, 8 ÷ 0.2 y 15 ÷ 2.5). Aquí no se habla de
      eso, ni se usa ninguno de esos números: la animación enseña a
      convertir la división, y el tamaño del cociente lo adivina él.
   5. **Lo que se dibuja es lo que se cuenta.** La sonda
      `verifica-animacion-mision` cuenta los galones llenos y los de
      a mitad, lee cada número de la división por sus cifras y su
      punto, rehace las cuentas y suma los precios de cada galón, en
      cada paso.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amLeche')) return;

  var ANCHO = 320, ALTO = 248, FIN = 5;

  /* Los galones: una fila grande (la entrega) o una rejilla de diez
     filas chicas (diez entregas). Cuatro llenos y uno a la mitad. */
  var X_FILA = [30, 76, 122, 168, 214];
  /* La fila de la entrega va al centro cuando está sola (pasos 0 y 4) y
     sube en el paso 5, para dejarle sitio a la de la otra ruta. */
  var Y_AQUI_SOLA = 84, Y_AQUI = 62, Y_ALLA = 138, ESC_GRANDE = 1.4;
  var ESC_REJ = 0.42, X_REJ = 26, DX_REJ = 19, Y_REJ = 16, DY_REJ = 15.5;
  /* La leche va color crema y el galón con raya firme: blanco sobre el
     fondo celeste de la tarjeta, con la raya gris clara, el galón casi no
     se veía. */
  var LECHE = '#fff3d6', TRAZO = '#5b6770';

  /* La división, en una tira de cuadrícula como la hoja del cuaderno: un
     cuadro por cifra y por signo, y el punto en la raya. El 0 que se le
     agrega a 315 cae en un cuadro que ya estaba en la hoja. */
  var P = 22, ALTO_CUADRO = 30, Y_DIV = 206, R = 2.8, X_TIRA = 50, CUADROS_TIRA = 10;
  var BORDE = { dividendo: 50, divisor: 160, cociente: 226 };
  var X_ENTRE = 149, X_IGUAL = 215;
  function xc(g, k) { return BORDE[g] + P * k + P / 2; }
  function raya(g, k) { return BORDE[g] + P * k; }

  var TEXTOS = [
    'Don Chele entregó 4.5 galones por L 315. En la otra ruta pagan L 68 el galón. ¿Se cambia? Decídelo antes de tocar.',
    'Diez entregas iguales son 45 galones y L 3,150. El galón sale al mismo precio: 315 ÷ 4.5 da lo mismo que 3150 ÷ 45.',
    'Eso es correr el punto un lugar en los dos: 4.5 se vuelve 45. A 315 le falta una cifra, y se le pone un 0: 3150.',
    'Ahora es una división de siempre: 3150 entre 45 da 70. A don Chele le pagan L 70 el galón.',
    'El punto vuelve a su lugar y el resultado es el mismo: 315 ÷ 4.5 = 70. Cuatro galones a L 70 y medio a L 35 suman L 315.',
    'Allá, por los mismos 4.5 galones, le darían L 306: nueve lempiras menos en cada entrega. Le conviene quedarse.'
  ];

  var A;
  var aqui = [], alla = [], rejilla = [], filasRej = [], precios = { aqui: [], alla: [] }, totales = {}, rotulos = {}, filaAqui = null;
  var div = { cifras: {}, cero: null, punto: null, fantasmas: {}, arcos: {}, hueco: [] };

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Un galón de leche: el cuerpo con su cuello y su tapa, y el hueco del
     asa. Lleno, la leche lo ocupa entero; a la mitad, solo la mitad de
     abajo, y lo de arriba queda vacío (se ve el fondo). */
  var CUERPO = 'M -11 -6 Q -11 -11 -6 -11 H -3 V -14 H 3 V -11 H 6 Q 11 -11 11 -6 V 13 Q 11 17 7 17 H -7 Q -11 17 -11 13 Z';
  function galon(padre, medio, fila, k) {
    var el = A.el;
    var g = el('g', { class: 'dl-galon', 'data-tipo': medio ? 'medio' : 'lleno', 'data-fila': fila, 'data-k': k }, padre);
    if (medio) {
      /* La leche de la mitad de abajo se dibuja con su propia forma (los
         lados del galón son rectos ahí abajo) y no recortando un rectángulo:
         un recorte se vuelve a calcular en cada cuadro mientras la rejilla
         se mueve, y en un teléfono barato se notaba. */
      el('path', { d: 'M -11 3 H 11 V 13 Q 11 17 7 17 H -7 Q -11 17 -11 13 Z', style: 'fill:' + LECHE }, g);
      el('path', { class: 'dl-cuerpo', d: CUERPO, style: 'fill:none;stroke:' + TRAZO + ';stroke-width:1.7' }, g);
      el('path', { d: 'M -11 3 H 11', style: 'stroke:' + TRAZO + ';stroke-width:1.1;stroke-dasharray:2 1.6' }, g);
    } else {
      el('path', { class: 'dl-cuerpo', d: CUERPO, style: 'fill:' + LECHE + ';stroke:' + TRAZO + ';stroke-width:1.7' }, g);
    }
    el('rect', { x: 3, y: -8, width: 5, height: 6, rx: 2, style: 'fill:none;stroke:' + TRAZO + ';stroke-width:1.3' }, g);
    el('rect', { x: -4, y: -17.5, width: 8, height: 4, rx: 1.2, style: 'fill:var(--am-pri)' }, g);
    return g;
  }

  /* La punta de una flecha que llega a (x, y), viniendo de (hx, hy). */
  function punta(x, y, hx, hy) {
    var l = Math.sqrt(hx * hx + hy * hy), c = Math.cos(0.5), s = Math.sin(0.5), L = 6.5;
    hx /= l; hy /= l;
    function r1(v) { return Math.round(v * 10) / 10; }
    return 'M ' + r1(x + L * (hx * c - hy * s)) + ' ' + r1(y + L * (hx * s + hy * c)) +
      ' L ' + x + ' ' + y + ' L ' + r1(x + L * (hx * c + hy * s)) + ' ' + r1(y + L * (-hx * s + hy * c));
  }

  /* Un salto por debajo de las cifras, como en la animación de la
     multiplicación: la raya se corta un poco antes de llegar, para que la
     punta no quede encima del punto que aterriza. */
  function arco(grupo, x0, x1, y) {
    var el = A.el, g = el('g', { class: 'dl-x10', 'data-grupo': grupo, 'data-de': x0, 'data-a': x1 }, A.svg);
    var cx = (x0 + x1) / 2, cy = y + 48, t = 0.84;
    function r1(v) { return Math.round(v * 100) / 100; }
    var qx = x0 + t * (cx - x0), qy = y + t * (cy - y);
    var ex = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
    var ey = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * cy + t * t * y;
    var curva = el('path', { class: 'am-trazo dl-curva', d: 'M ' + x0 + ' ' + y + ' Q ' + r1(qx) + ' ' + r1(qy) + ' ' + r1(ex) + ' ' + r1(ey), style: 'stroke-width:1.6;stroke-linecap:round' }, g);
    var pt = el('path', { class: 'am-trazo am-fuera', d: punta(r1(ex), r1(ey), qx - ex, qy - ey), style: 'stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round' }, g);
    var tx = texto(g, { class: 'am-letra dl-salto-txt am-fuera', x: cx, y: y + 38, 'text-anchor': 'middle', 'font-size': 11.5 }, '×10');
    return { g: g, curva: curva, punta: pt, t: tx };
  }

  /* Un punto que salta por debajo: el grupo de fuera va a paso parejo y
     el de dentro brinca (.am-salta), puesto de cabeza para que baje. */
  function saltarin(grupo, x, y) {
    var el = A.el;
    var g = el('g', { class: 'am-viaja' }, A.svg);
    var f = el('g', { transform: 'scale(1,-1)' }, g);
    var b = el('g', null, f);
    var c = el('circle', { class: 'dl-fantasma am-fuera', 'data-grupo': grupo, cx: 0, cy: 0, r: R + 0.6, style: 'fill:none;stroke:var(--am-pri);stroke-width:1.3;stroke-dasharray:2 1.6' }, b);
    A.mover(g, x, y, 0, 1, 0);
    return { g: g, b: b, c: c, x: x, y: y };
  }

  function brincar(b, si, demora) {
    b.classList.remove('am-salta');
    if (si && !A.quieto()) {
      b.style.setProperty('--d', Math.round(demora) + 'ms');
      A.asentar();
      b.classList.add('am-salta');
    }
  }

  function cuadros(x0, n, y, clase) {
    var el = A.el, g = el('g', { class: clase || 'dl-cuadros' }, A.svg), d = '';
    for (var k = 0; k <= n; k++) d += 'M ' + (x0 + P * k) + ' ' + (y - 23) + ' V ' + (y - 23 + ALTO_CUADRO);
    d += 'M ' + x0 + ' ' + (y - 23) + ' H ' + (x0 + P * n) + 'M ' + x0 + ' ' + (y - 23 + ALTO_CUADRO) + ' H ' + (x0 + P * n);
    el('rect', { x: x0, y: y - 23, width: P * n, height: ALTO_CUADRO, style: 'fill:var(--card,#fff)' }, g);
    el('path', { d: d, style: 'fill:none;stroke:var(--gray,#636e72);stroke-opacity:0.45;stroke-width:1' }, g);
    return g;
  }

  function cifra(grupo, k, c) {
    return texto(A.svg, { class: 'am-digito dl-cifra', 'data-grupo': grupo, 'data-k': k, x: xc(grupo, k), y: Y_DIV, 'text-anchor': 'middle', 'font-size': 26 }, c);
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* El letrero de la otra ruta: está desde el principio, porque es la
       otra mitad de la pregunta. */
    rotulos.otra = texto(svg, { class: 'am-letra dl-etq', x: 312, y: 13, 'text-anchor': 'end', 'font-size': 12, style: 'fill:var(--gray,#636e72)' }, 'Otra ruta: L 68 el galón');

    /* ── Los galones ──
       La primera fila es la entrega: cada galón se mueve por su cuenta. Las
       otras nueve son capas enteras (.am-capa): se encienden fila por fila y,
       apagadas, se esconden. Encender y apagar 45 galones uno por uno bajaba
       un teléfono barato a 183 ms por cuadro. */
    for (var r = 0; r < 10; r++) {
      var fila = [], padre = svg;
      if (r > 0) { padre = el('g', { class: 'dl-fila-rejilla am-capa am-fuera' }, svg); filasRej.push(padre); }
      for (var k = 0; k < 5; k++) {
        var gk = galon(padre, k === 4, 'rejilla', r * 5 + k);
        if (r > 0) A.mover(gk, X_REJ + DX_REJ * k, Y_REJ + DY_REJ * r, 0, ESC_REJ, 0);
        fila.push(gk);
      }
      rejilla.push(fila);
    }
    aqui = rejilla[0];                                   // la primera fila de la rejilla ES la entrega
    for (var j = 0; j < 5; j++) alla.push(galon(svg, j === 4, 'alla', j));
    aqui.forEach(function (g) { g.setAttribute('data-fila', 'aqui'); });

    /* Lo que le pagan por cada galón, encima de cada uno, y lo que suman.
       Los de la entrega van en un grupo que sube y baja con su fila (y = 0
       es la altura de los galones). */
    filaAqui = el('g', { class: 'dl-fila-aqui' }, svg);
    A.mover(filaAqui, 0, Y_AQUI_SOLA, 0, 1, 0);
    ['aqui', 'alla'].forEach(function (f) {
      var padre = f === 'aqui' ? filaAqui : svg, y0 = f === 'aqui' ? 0 : Y_ALLA, vale = f === 'aqui' ? 70 : 68;
      X_FILA.forEach(function (x, i) {
        precios[f].push(texto(padre, { class: 'am-digito dl-precio am-fuera', 'data-fila': f, 'data-k': i, x: x, y: y0 - 30, 'text-anchor': 'middle', 'font-size': 14 },
          'L ' + (i === 4 ? vale / 2 : vale)));
      });
    });
    totales.aqui = texto(filaAqui, { class: 'am-digito dl-total am-fuera', 'data-fila': 'aqui', x: 240, y: 7, 'font-size': 19 }, 'L 315');
    totales.alla = texto(svg, { class: 'am-digito dl-total am-fuera', 'data-fila': 'alla', x: 240, y: Y_ALLA + 7, 'font-size': 19 }, 'L 306');
    rotulos.aqui = texto(filaAqui, { class: 'am-letra dl-etq am-fuera', x: 240, y: 24, 'font-size': 12, style: 'fill:var(--gray,#636e72)' }, 'aquí');
    rotulos.alla = texto(svg, { class: 'am-letra dl-etq am-fuera', x: 240, y: Y_ALLA + 24, 'font-size': 12, style: 'fill:var(--gray,#636e72)' }, 'en la otra ruta');

    /* La entrega, y las diez entregas: se cambian de sitio y de número. */
    rotulos.galones = texto(filaAqui, { class: 'am-letra dl-etq am-fuera', x: X_FILA[2], y: 58, 'text-anchor': 'middle', 'font-size': 18 }, '4.5 galones');
    rotulos.diez = texto(svg, { class: 'am-letra dl-etq am-fuera', x: 132, y: 50, 'font-size': 13, style: 'fill:var(--gray,#636e72)' }, 'diez entregas iguales');
    rotulos.galones45 = texto(svg, { class: 'am-letra dl-etq am-fuera', x: 132, y: 86, 'font-size': 19 }, '45 galones');
    rotulos.pago3150 = texto(svg, { class: 'am-digito dl-total dl-diez am-fuera', 'data-fila': 'rejilla', x: 132, y: 122, 'font-size': 22 }, 'L 3,150');

    /* ── La división: 315 ÷ 4.5 = ?, en una tira de cuadrícula ── */
    cuadros(X_TIRA, CUADROS_TIRA, Y_DIV);
    texto(svg, { class: 'am-letra', x: X_ENTRE, y: Y_DIV - 1, 'text-anchor': 'middle', 'font-size': 22 }, '÷');
    texto(svg, { class: 'am-letra', x: X_IGUAL, y: Y_DIV - 1, 'text-anchor': 'middle', 'font-size': 22 }, '=');
    ['3', '1', '5'].forEach(function (c, k) { cifra('dividendo', k, c); });
    div.cero = cifra('dividendo', 3, '0');
    ['4', '5'].forEach(function (c, k) { cifra('divisor', k, c); });
    div.punto = A.el('circle', { class: 'dl-punto', 'data-grupo': 'divisor', cx: raya('divisor', 1), cy: Y_DIV - R, r: R, style: 'fill:var(--am-pri)' }, svg);
    /* El cociente: primero un hueco con su signo de pregunta. */
    div.hueco.push(el('rect', { class: 'am-hueco dl-hueco', x: BORDE.cociente + 1.5, y: Y_DIV - 21.5, width: 2 * P - 3, height: ALTO_CUADRO - 3, rx: 3, style: 'fill:var(--card,#fff)' }, svg));
    div.hueco.push(texto(svg, { class: 'am-letra dl-hueco', x: BORDE.cociente + P, y: Y_DIV - 1, 'text-anchor': 'middle', 'font-size': 22 }, '?'));
    div.cifras.cociente = ['7', '0'].map(function (c, k) { return cifra('cociente', k, c); });

    /* Los saltos: el punto de 315 (que no se ve: va con raya cortada) y el
       de 4.5, un lugar a la derecha cada uno. */
    div.arcos.dividendo = arco('dividendo', raya('dividendo', 3), raya('dividendo', 4), Y_DIV - R);
    div.arcos.divisor = arco('divisor', raya('divisor', 1), raya('divisor', 2), Y_DIV - R);
    div.fantasmas.dividendo = saltarin('dividendo', raya('dividendo', 3), Y_DIV - R);
    div.fantasmas.divisor = saltarin('divisor', raya('divisor', 1), Y_DIV - R);
  }

  function pintar(n, antes) {
    var adelante = n > antes;
    function d(ms) { return adelante ? ms : 0; }

    /* ── Los galones ── */
    var diez = n >= 1 && n <= 3, llega1 = adelante && n === 1, vuelve4 = adelante && n === 4;
    var yAqui = n === 5 ? Y_AQUI : Y_AQUI_SOLA;
    A.mover(filaAqui, 0, yAqui, 0, 1, 0);
    aqui.forEach(function (g, k) {
      /* La entrega: grande en su fila, o la primera fila de la rejilla. */
      if (diez) A.mover(g, X_REJ + DX_REJ * k, Y_REJ, 0, ESC_REJ, llega1 ? k * 60 : 0);
      else A.mover(g, X_FILA[k], yAqui, 0, ESC_GRANDE, vuelve4 ? 300 + k * 60 : 0);
    });
    filasRej.forEach(function (capa, i) { A.ver(capa, diez, llega1 ? 450 + i * 110 : 0); });
    alla.forEach(function (g, k) {
      A.mover(g, X_FILA[k], Y_ALLA, 0, ESC_GRANDE, 0);
      A.ver(g, n === 5, d(n === 5 ? 200 + k * 90 : 0));
    });

    /* Lo que le pagan por cada galón (pasos 4 y 5) y lo que suman. */
    precios.aqui.forEach(function (t, i) { A.ver(t, n >= 4, d(n === 4 ? 900 + i * 120 : 0)); });
    precios.alla.forEach(function (t, i) { A.ver(t, n === 5, d(n === 5 ? 700 + i * 120 : 0)); });
    A.ver(totales.aqui, n === 0 || n >= 4, d(n === 4 ? 1600 : 0));
    A.ver(totales.alla, n === 5, d(n === 5 ? 1400 : 0));
    A.ver(rotulos.aqui, n === 5, d(n === 5 ? 1400 : 0));
    A.ver(rotulos.alla, n === 5, d(n === 5 ? 1400 : 0));
    A.ver(rotulos.galones, n === 0);
    A.ver(rotulos.diez, diez, d(llega1 ? 1300 : 0));
    A.ver(rotulos.galones45, diez, d(llega1 ? 1500 : 0));
    A.ver(rotulos.pago3150, diez, d(llega1 ? 1700 : 0));

    /* ── La división ── */
    var corrido = n === 2 || n === 3, llega2 = adelante && n === 2;
    A.ver(div.cero, corrido, d(llega2 ? 1500 : 0));
    A.ver(div.punto, !corrido, corrido ? d(700) : 0);
    [['dividendo', 700], ['divisor', 700]].forEach(function (s) {
      var f = div.fantasmas[s[0]], a = div.arcos[s[0]];
      A.ver(f.c, corrido, llega2 ? s[1] - 450 : 0);
      A.mover(f.g, f.x + (corrido ? P : 0), f.y, 0, 1, llega2 ? s[1] : 0);
      brincar(f.b, llega2, s[1]);
      A.trazar(a.curva, corrido, llega2 ? s[1] : 0);
      A.ver(a.punta, corrido, llega2 ? s[1] + 700 : 0);
      A.ver(a.t, corrido, llega2 ? s[1] + 600 : 0);
    });
    var sabido = n >= 3;
    div.hueco.forEach(function (h) { A.ver(h, !sabido); });
    div.cifras.cociente.forEach(function (t, k) { A.ver(t, sabido, d(n === 3 ? 350 + k * 250 : 0)); });
  }

  function marcador(n, antes) {
    var adelante = n > antes;
    return [
      { cifra: '315 ÷ 4.5', palabras: '¿a cómo le pagan el galón?' },
      { cifra: 'L 3,150', palabras: '45 galones, al mismo precio', salto: adelante ? '×10' : '' },
      { cifra: '3150 ÷ 45', palabras: 'el punto, un lugar en los dos' },
      { cifra: 'L 70', palabras: 'el galón, aquí' },
      { cifra: 'L 315', palabras: 'cuatro de 70 y medio de 35' },
      { cifra: '70 > 68', palabras: 'le conviene quedarse' }
    ][n];
  }

  AnimacionMision.montar('#amLeche', {
    vista: [ANCHO, ALTO],
    describe: 'Los galones de leche de don Chele, cuatro llenos y uno a la mitad, y la división 315 ÷ 4.5 en cuadrícula, con el punto que salta un lugar en los dos números.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['📦 Diez entregas', '✂️ ¿Y el punto?', '➗ ¿Cuánto da?', '↩️ Comprobar', '🥛 ¿Y en la otra ruta?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
