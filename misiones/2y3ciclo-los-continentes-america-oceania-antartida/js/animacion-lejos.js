/* ============================================================
   M.E.T.A.S · Los Continentes: América, Oceanía y Antártida ·
   «¿Y eso queda lejos?»
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de doña
   Nely: cuando su hijo se fue a trabajar afuera, en la pulpería le
   dijeron que eso quedaba lejos, y eso fue todo lo que supo durante un
   año. La historia promete que un mapa convierte «lejos» en un sitio
   con nombre, con clima y con hora. El aparato (botones, frase,
   marcador) vive en js/animacion-mision.js; aquí solo está el dibujo y
   dónde va cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  doña Nely vive aquí, y «lejos» le queda a cualquiera de tres
        lugares: tres flechas, y un «?» al final de cada una;
     1  la primera no sale de América: queda lejos, pero es el mismo
        continente;
     2  la segunda cruza el océano hacia donde se pone el sol y llega a
        otro continente, Oceanía;
     3  la tercera llega a la Antártida, el continente más frío;
     4  a las 8 de la noche de doña Nely, en casi toda América también es
        de noche; en Sídney ya es mediodía del día siguiente;
     5  «lejos» no decía dónde; con el nombre del continente, doña Nely lo
        encuentra en el mapa, y en el mapa se ve si allá es de día.

   Ocho decisiones, y ninguna es de adorno:

   1. ⚠️ **El mapa tiene el océano en medio, y a propósito.** Los tres
      continentes de esta misión rodean el mismo océano. En el mapa de
      siempre, con Europa en el centro, América queda en una orilla del
      dibujo y Oceanía en la otra, y la flecha que cruza el océano se
      saldría por un lado para entrar por el otro. Aquí el meridiano del
      centro es el 166° E, y la costura queda en el 14° O, en medio del
      mar: solo la parten Islandia, la punta de África y la Antártida,
      que da la vuelta entera. Groenlandia y América quedan enteras. Con
      el 150° E, que es el centro de los mapas de Australia, la costura
      partía Groenlandia, y un pedazo de América se iluminaba en la otra
      orilla del mapa.
   2. ⚠️ **Y es un mapa de áreas verdaderas (Equal Earth).** La prueba
      pregunta si la Antártida es más grande que Oceanía, y el mapa de
      cuadrícula la estira hasta parecer más grande que Asia. Aquí cada
      continente ocupa en el dibujo lo que ocupa en la Tierra. El precio
      es que la Antártida sale como una franja delgada abajo, y por eso
      se ilumina entera y lleva su nombre encima.
   3. ⚠️ **Lo que pregunta la prueba no se dice.** Ni «Pacífico» (es la
      respuesta de un completar), ni «polo sur» (es un verdadero o falso
      de la ficha: «la Antártida está alrededor del polo sur»), ni
      tamaños, ni países, ni hielo, ni quién vive allá. Las frases dicen
      «el océano», y el mapa enseña dónde está cada cosa. Ni el botón se
      libra: un 🧊 en «la tercera» decía «hielo», que es otra respuesta.
   4. **La hora es de verdad, y sale del sol del dibujo.** Una noche de
      septiembre, a las 8 de doña Nely (UTC−6) son las 2:00 en el
      meridiano de Greenwich, y el sol está sobre el meridiano 150° E, que
      es el de Sídney: allá es mediodía (en septiembre, Sídney va con
      UTC+10; su horario de verano empieza en octubre). La frontera entre
      el día y la noche es la de los días de fines de septiembre, cuando
      corre de polo a polo: los meridianos 60° E y 120° O.
   5. ⚠️ **«Casi toda América», no toda.** A esa hora, Alaska y la costa
      de California todavía tienen sol. La frase lo dice así, y el dibujo
      también.
   6. **La historia no dice adónde se fue el hijo, y aquí tampoco.** Las
      tres flechas son lugares lejanos cualquiera; lo que se enseña es que
      «lejos» no distingue entre el mismo continente y otro.
   7. **Nada se dice solo con color.** Cada continente lleva su nombre
      escrito; la noche, además de oscura, lleva su luna y el sol está
      dibujado; el lugar sin nombre lleva un «?» con el aro de raya
      cortada. El mapa y las etiquetas son papel: se quedan como son en
      las dos pantallas.
   8. **Los contornos no son de esta misión**: viven en
      js/data/contornos-mundo.js, con los de Geografía y Coordenadas.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !window.CONTORNOS_MUNDO || !document.getElementById('amLejos')) return;

  var ANCHO = 304, ALTO = 158, FIN = 5;
  var MUNDO = window.CONTORNOS_MUNDO;

  /* ── La proyección: Equal Earth (Šavrič, Patterson y Jenny, 2018) ──
     El meridiano del centro es L0; la costura, L0 − 180. */
  var L0 = 166, ESCALA = 54, CX = 152, CY = 76;
  var A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, R3 = Math.sqrt(3);
  function r2(v) { return Math.round(v * 100) / 100; }
  function norm(d) { while (d > 180) d -= 360; while (d <= -180) d += 360; return d; }
  /* dl: grados desde el meridiano del centro. */
  function proyD(dl, lat) {
    var l = dl * Math.PI / 180, f = lat * Math.PI / 180;
    var t = Math.asin(R3 / 2 * Math.sin(f)), t2 = t * t, t6 = t2 * t2 * t2;
    var x = 2 * R3 * l * Math.cos(t) / (3 * (9 * A4 * t6 * t2 + 7 * A3 * t6 + 3 * A2 * t2 + A1));
    var y = t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2));
    return [CX + ESCALA * x, CY - ESCALA * y];
  }
  function proy(lon, lat) { return proyD(norm(lon - L0), lat); }

  /* ── La costura: un anillo que la cruza se parte en dos ──
     Se trabaja en grados desde el centro (−180 … 180). Donde un tramo
     salta de una orilla a la otra, se corta en la orilla, y cada pedazo
     se cierra por su orilla. El que da la vuelta entera (la Antártida)
     empieza en una orilla y acaba en la otra: se cierra por el polo. */
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
    /* Los puntos del polo (la Antártida los trae para el mapa de
       cuadrícula) no son costa: el cierre por el polo lo pone cerrar(). */
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

  /* El borde del mapa: la orilla izquierda, el polo sur, la derecha y el
     polo norte (en esta proyección los polos son rectas). */
  function borde() {
    return camino([[-180, 90]].concat(orilla(-180, 90, -90), [[180, -90]], orilla(180, -90, 90)));
  }

  /* ── Lo que se ve ── */
  var CASA = [-87.2, 14.1];                        // Tegucigalpa: la casa de doña Nely
  var SOL = [150, 0];                              // el sol, a las 8 p. m. de Honduras
  var SIDNEY = [151.2, -33.9];
  /* Adónde llega cada flecha, en el orden en que se nombran. */
  var ORDEN = ['america', 'oceania', 'antartida'];
  var DESTINO = { america: [-90, 39], oceania: SIDNEY, antartida: [-95, -79] };
  var NOMBRE = { america: 'América', oceania: 'Oceanía', antartida: 'Antártida' };
  var LUGAR_NOMBRE = { america: [-98, 48], oceania: [132, -18], antartida: [-160, -69] };
  var CURVA = { america: -0.25, oceania: 0.32, antartida: 0.2 };
  /* Las dos lunas, una en cada lado de la noche, sobre el mar. */
  var LUNAS = [[-106, -32], [-6, -31]];

  var TEXTOS = [
    'Doña Nely vive aquí. «Lejos» puede ser cualquiera de estos tres lugares, y esa palabra no dice cuál.',
    'La primera flecha no sale de América, el continente donde vive doña Nely. Queda lejos, pero es el mismo continente.',
    'La segunda cruza el océano hacia donde se pone el sol y llega a otro continente: Oceanía.',
    'La tercera llega a la Antártida, el continente más frío de la Tierra.',
    'A las 8 de la noche de doña Nely, en casi toda América también es de noche. En Sídney ya es mediodía del día siguiente.',
    '«Lejos» no decía dónde. Con el nombre del continente, doña Nely lo encuentra en el mapa, y en el mapa se ve si allá es de día.'
  ];

  var A;
  var luces = {}, flechas = {}, dudas = {}, nombres = {};
  var noche, sol, sidney, lunas = [], relojes = [];

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* La casa de doña Nely, chiquita: el pie de la pared sobre su punto. */
  function casa(padre, p) {
    var el = A.el;
    var g = el('g', { 'data-casa': '', 'data-lon': CASA[0], 'data-lat': CASA[1],
      transform: 'translate(' + r2(p[0]) + ' ' + r2(p[1]) + ')' }, padre);
    el('rect', { class: 'ln-pared', x: -3.6, y: -5.4, width: 7.2, height: 5.4 }, g);
    el('path', { class: 'ln-techo', d: 'M -4.8 -5.2 L 0 -9.4 L 4.8 -5.2 Z' }, g);
    el('rect', { class: 'ln-puerta', x: -0.9, y: -3, width: 1.8, height: 3 }, g);
    return g;
  }

  /* El lugar sin nombre: un «?» en un aro de raya cortada. */
  function duda(padre, nombre, p) {
    var el = A.el;
    var g = el('g', { class: 'am-fuera', 'data-duda': nombre, 'data-lon': DESTINO[nombre][0], 'data-lat': DESTINO[nombre][1],
      transform: 'translate(' + r2(p[0]) + ' ' + r2(p[1]) + ')' }, padre);
    el('circle', { class: 'ln-duda', cx: 0, cy: 0, r: 5.6 }, g);
    texto(g, { class: 'ln-signo', x: 0, y: 3.2, 'font-size': 8.5 }, '?');
    return g;
  }

  /* Una flecha de la casa a su destino, en curva: la raya acaba donde
     empieza la punta, y la punta se queda fuera del aro del «?». */
  function flecha(padre, nombre, desde, hasta, curva) {
    var el = A.el;
    var dx = hasta[0] - desde[0], dy = hasta[1] - desde[1], L = Math.sqrt(dx * dx + dy * dy);
    var cx = (desde[0] + hasta[0]) / 2 - dy * curva, cy = (desde[1] + hasta[1]) / 2 + dx * curva;
    /* La dirección con que llega la curva es la de su punto de control
       al final; la punta se para a 7 del destino, fuera del aro. */
    var ux = hasta[0] - cx, uy = hasta[1] - cy, lu = Math.sqrt(ux * ux + uy * uy);
    ux /= lu; uy /= lu;
    var fx = hasta[0] - ux * 7, fy = hasta[1] - uy * 7;
    /* Y sale a 7 de la casa, para no taparla. */
    var sx = desde[0] + (cx - desde[0]) / L * 7, sy = desde[1] + (cy - desde[1]) / L * 7;
    var g = el('g', { 'data-flecha': nombre }, padre);
    var raya = el('path', { class: 'ln-flecha', 'data-raya': '',
      d: 'M ' + r2(sx) + ' ' + r2(sy) + ' Q ' + r2(cx) + ' ' + r2(cy) + ' ' + r2(fx - ux * 3) + ' ' + r2(fy - uy * 3) }, g);
    var bx = fx - ux * 4.4, by = fy - uy * 4.4, px = -uy * 2.6, py = ux * 2.6;
    var punta = el('path', { class: 'ln-punta am-fuera', 'data-punta': '',
      d: 'M ' + r2(bx + px) + ' ' + r2(by + py) + ' L ' + r2(fx) + ' ' + r2(fy) + ' L ' + r2(bx - px) + ' ' + r2(by - py) + ' Z' }, g);
    flechas[nombre] = { raya: raya, punta: punta };
  }

  /* La hora de un lugar: la hora grande y el día debajo, con halo, como
     los nombres. `ancla` es «start» o «end»: el rótulo crece hacia el mar,
     no encima de lo que nombra. */
  function reloj(padre, quien, dia, hora, x, y, ancla) {
    var g = A.el('g', { class: 'am-fuera', 'data-reloj': quien }, padre);
    texto(g, { class: 'ln-hora', 'data-hora': '', x: x, y: y, 'font-size': 13, 'text-anchor': ancla }, hora);
    texto(g, { class: 'ln-dia', 'data-dia': '', x: x, y: y + 10.5, 'font-size': 10.5, 'text-anchor': ancla }, dia);
    relojes.push(g);
    return g;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    var mapa = el('g', { 'data-mundo': '', 'data-l0': L0 }, svg);
    el('path', { class: 'ln-mar', 'data-mar': '', d: borde() }, mapa);
    MUNDO.tierra.forEach(function (c, i) {
      el('path', { class: 'ln-tierra', 'data-tierra': MUNDO.continente[i], d: contorno(c) }, mapa);
    });
    MUNDO.agua.forEach(function (c) { el('path', { class: 'ln-agua', d: contorno(c) }, mapa); });

    /* Cada continente, iluminado encima del mapa gris: se prende cuando
       le toca su nombre. */
    ORDEN.forEach(function (k) {
      var g = el('g', { class: 'am-fuera ln-luz ln-luz-' + k, 'data-luz': k }, mapa);
      MUNDO.tierra.forEach(function (c, i) {
        if (MUNDO.continente[i] === k) el('path', { d: contorno(c) }, g);
      });
      luces[k] = g;
    });

    /* La noche: de la frontera del día a la orilla del mapa, de cada lado. */
    var dSol = norm(SOL[0] - L0), t1 = norm(dSol + 90), t2 = norm(dSol - 90);
    noche = el('g', { class: 'am-fuera', 'data-noche': '', 'data-sol-lon': SOL[0], 'data-sol-lat': SOL[1] }, svg);
    el('path', { class: 'ln-noche', 'data-lado': 'derecha',
      d: camino([[t1, 90]].concat(orilla(t1, 90, -90), [[180, -90]], orilla(180, -90, 90))) }, noche);
    el('path', { class: 'ln-noche', 'data-lado': 'izquierda',
      d: camino([[-180, 90]].concat(orilla(-180, 90, -90), [[t2, -90]], orilla(t2, -90, 90))) }, noche);

    LUNAS.forEach(function (l) {
      var p = proy(l[0], l[1]);
      var g = el('g', { class: 'am-fuera', 'data-luna': '', transform: 'translate(' + r2(p[0]) + ' ' + r2(p[1]) + ')' }, svg);
      el('path', { class: 'ln-luna', d: 'M 1.6 -5.2 A 5.4 5.4 0 1 0 1.6 5.2 A 4.2 4.2 0 1 1 1.6 -5.2 Z' }, g);
      lunas.push(g);
    });
    var ps = proy(SOL[0], SOL[1]);
    sol = el('g', { class: 'am-fuera', 'data-sol': '', 'data-lon': SOL[0], 'data-lat': SOL[1],
      transform: 'translate(' + r2(ps[0]) + ' ' + r2(ps[1]) + ')' }, svg);
    for (var r = 0; r < 8; r++) {
      var an = r * Math.PI / 4;
      el('path', { class: 'ln-rayo', d: 'M ' + r2(Math.cos(an) * 4.4) + ' ' + r2(Math.sin(an) * 4.4) + ' L ' + r2(Math.cos(an) * 6.6) + ' ' + r2(Math.sin(an) * 6.6) }, sol);
    }
    el('circle', { class: 'ln-sol', cx: 0, cy: 0, r: 3.3 }, sol);

    /* Las flechas, con su «?» al final. */
    var pc = proy(CASA[0], CASA[1]);
    var cCasa = [pc[0], pc[1] - 4.5];
    ORDEN.forEach(function (k) {
      var pd = proy(DESTINO[k][0], DESTINO[k][1]);
      flecha(svg, k, cCasa, pd, CURVA[k]);
      dudas[k] = duda(svg, k, pd);
    });

    casa(svg, pc);

    /* El nombre de cada continente, encima de su tierra, con halo. */
    ORDEN.forEach(function (k) {
      var p = proy(LUGAR_NOMBRE[k][0], LUGAR_NOMBRE[k][1]);
      nombres[k] = texto(svg, { class: 'ln-nombre am-fuera', 'data-nombre': k,
        x: r2(p[0]), y: r2(p[1]), 'font-size': 12 }, NOMBRE[k]);
    });

    /* Sídney: su punto y su nombre, que se prenden con la hora. */
    var pSid = proy(SIDNEY[0], SIDNEY[1]);
    sidney = A.el('g', { class: 'am-fuera', 'data-sidney': '', 'data-lon': SIDNEY[0], 'data-lat': SIDNEY[1],
      transform: 'translate(' + r2(pSid[0]) + ' ' + r2(pSid[1]) + ')' }, svg);
    A.el('circle', { class: 'ln-punto', cx: 0, cy: 0, r: 2.2 }, sidney);
    texto(sidney, { class: 'ln-lugar', x: -4, y: -1, 'font-size': 10.5, 'text-anchor': 'end' }, 'Sídney');

    /* Las dos horas: la de la casa a su derecha, sobre el mar Caribe; la de
       Sídney a la izquierda de su punto, bajando hacia el mar del sur. */
    reloj(svg, 'casa', 'martes', '8 p. m.', r2(pc[0] + 7.5), r2(pc[1] - 1.5), 'start');
    reloj(svg, 'sidney', 'miércoles', '12 m.', r2(pSid[0] - 8), r2(pSid[1] + 13), 'end');
  }

  function pintar(n) {
    var i;
    /* Las tres flechas salen desde el primer paso, una detrás de otra. */
    ORDEN.forEach(function (k, j) {
      A.trazar(flechas[k].raya, true, 150 + j * 250);
      A.ver(flechas[k].punta, true, 150 + j * 250 + 500);
    });
    ORDEN.forEach(function (k, j) {
      var nombrado = n >= j + 1;
      /* El «?» vuelve cuando el alumno retrocede, en cuanto se apaga la luz
         de su continente; al empezar otra vez vuelven los tres, uno detrás
         de otro. */
      A.ver(dudas[k], !nombrado, nombrado ? 0 : 300 + (n === 0 ? j * 200 : 0));
      A.ver(luces[k], nombrado, nombrado ? 200 : 0);
      A.ver(nombres[k], nombrado, nombrado ? 500 : 0);
    });
    var hora = n >= 4;
    A.ver(noche, hora, hora ? 0 : 0);
    A.ver(sol, hora, hora ? 350 : 0);
    for (i = 0; i < lunas.length; i++) A.ver(lunas[i], hora, hora ? 350 : 0);
    A.ver(sidney, hora, hora ? 600 : 0);
    for (i = 0; i < relojes.length; i++) A.ver(relojes[i], hora, hora ? 800 + i * 350 : 0);
  }

  function marcador(n) {
    if (n === 4) return { cifra: '16 h', palabras: 'más adelante en Sídney' };
    var k = Math.min(n, 3);
    return { cifra: String(k), palabras: k === 1 ? 'continente con nombre' : 'continentes con nombre' };
  }

  AnimacionMision.montar('#amLejos', {
    vista: [ANCHO, ALTO],
    describe: 'Un mapa del mundo con el océano en medio: la casa de doña Nely en Honduras y tres flechas que llegan a América, a Oceanía y a la Antártida.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['🌎 La primera', '🌏 La segunda', '🧭 La tercera', '🕗 A las 8 de la noche', '🗺️ ¿Y ahora?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
