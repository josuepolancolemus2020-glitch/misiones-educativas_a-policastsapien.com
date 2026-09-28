/* ============================================================
   M.E.T.A.S · Teoría de Números · El reparto sin que sobre
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de los
   48 cuadernos y los 36 lápices: el maestro los tenía que repartir
   en grupos iguales, sin que sobrara nada, y se pasó media hora de
   su almuerzo probando. El aparato (botones, frase, marcador) vive
   en js/animacion-mision.js; aquí solo está el dibujo y dónde va
   cada pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  el montón, y la pregunta de la historia: ¿en cuántos grupos?
        Se piensa ANTES de tocar;
     1  las pruebas del maestro, repartiendo de verdad, uno a cada
        grupo por vuelta: entre 5 sobran 3 cuadernos y 1 lápiz;
     2  entre 7 sobran 6 cuadernos y 1 lápiz;
     3  entre 8 los cuadernos salen justos (48 es divisible entre 8)
        y sobran 4 lápices (36 no lo es);
     4  sin probar: los divisores de 48 y los de 36, cada uno en su
        columna;
     5  los que están en las dos filas son los divisores comunes, y
        el 8 está solo en la de arriba: por eso sobraban lápices;
     6  el mayor de los comunes, el 12, es el Máximo Común Divisor;
     7  y repartido entre 12, a cada grupo le tocan 4 cuadernos y 3
        lápices, sin que sobre nada.

   Tres decisiones, y ninguna es de adorno:

   1. ⚠️ **Se reparte de verdad, uno a cada grupo por vuelta**, que es
      como se reparte en el aula. Lo que no alcanza para otra vuelta
      entera es lo que sobra, y se queda en la mesa, en fila, para
      contarlo. Así «divisible» se VE: es que no se queda nada.
   2. ⚠️ **Las dos filas de divisores comparten las columnas.** Cada
      número tiene su columna, así que un divisor común es una columna
      con DOS fichas, y eso se ve sin leer. Y el 5 y el 7 del maestro
      no tienen columna: no dividen a ninguno de los dos.
   3. **No se usa lo que pregunta el «Predice» de abajo**: ni la regla
      de sumar las cifras (432 entre 9), ni múltiplos que coinciden
      (la rana de 4 en 4 y el conejo de 6 en 6), ni las bolsas de 12
      dulces y 18 galletas. Todos los números de aquí son los del
      reparto de la historia.

   La sonda `verifica-animacion-mision` cuenta el dibujo en cada paso:
   cuántos grupos se ven, cuántos cuadernos y lápices tiene cada uno,
   cuántos se quedan en la mesa, qué fichas hay en cada fila de
   divisores y en qué columna cae la del Máximo Común Divisor.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amReparto')) return;

  var ANCHO = 320, ALTO = 240, FIN = 7;
  var CUADERNOS = 48, LAPICES = 36;
  var GRUPOS = { 1: 5, 2: 7, 3: 8, 7: 12 };      // entre cuántos se reparte en cada paso

  /* ── la mesa: los dos montones, arriba ── */
  var MONTON = { c: { x: 82, y: 48 }, l: { x: 238, y: 48 } };
  var RX = 66, RY = 22;
  var ESTADO_Y = 72;
  /* Las piezas se dibujan a su medida y se ponen un 30 % más grandes: a
     360 px el dibujo se ve al 89 %, y un cuaderno de 11 px no se cuenta
     de un vistazo. Más grandes no caben: doce grupos llenan el ancho. */
  var PIEZA = 1.3;
  /* ── los grupos, abajo: cada uno con su pila ── */
  var BASE = 212, MARGEN = 16;
  var ALTO_C = 6.4 * PIEZA + 0.9, ALTO_L = 3.4 * PIEZA + 0.9;
  /* ── las dos filas de divisores: trece columnas de lado a lado ── */
  var FILA = { 48: 116, 36: 162 };
  var COL0 = 21.5, PASO_COL = 23.1;

  function divisores(n) { var d = []; for (var i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }
  var D48 = divisores(CUADERNOS), D36 = divisores(LAPICES);
  var COMUNES = D48.filter(function (v) { return D36.indexOf(v) >= 0; });
  var MCD = COMUNES[COMUNES.length - 1];
  /* Las columnas son TODOS los números que aparecen en alguna fila, en
     orden: así un mismo número cae en la misma columna en las dos. */
  var COLUMNAS = D48.concat(D36.filter(function (v) { return D48.indexOf(v) < 0; })).sort(function (a, b) { return a - b; });
  function xCol(v) { return COL0 + PASO_COL * COLUMNAS.indexOf(v); }
  function xGrupo(j, k) { return MARGEN + (j + 0.5) * (ANCHO - 2 * MARGEN) / k; }

  /* Las cuentas van con espacios que no se parten ( ), como en la
     vara de la pila: «48 ÷ 12 = 4» no puede quedar partida en dos
     renglones. */
  var TEXTOS = [
    'Llegaron 48 cuadernos y 36 lápices. Hay que repartirlos en grupos iguales, sin que sobre nada. ¿En cuántos grupos? Piénsalo antes de tocar.',
    'Entre 5 grupos, a cada uno le tocan 9 cuadernos y 7 lápices. Pero sobran 3 cuadernos y 1 lápiz: no sirve.',
    'Entre 7, a cada grupo le tocan 6 cuadernos y 5 lápices. Sobran 6 cuadernos y 1 lápiz: tampoco sirve.',
    'Entre 8, los cuadernos salen justos, 6 para cada grupo: 48 es divisible entre 8. Pero sobran 4 lápices: 36 no lo es.',
    'No hacía falta probar. Los números que reparten 48 sin que sobre nada se llaman sus divisores. Debajo están los de 36.',
    'Los que están en las dos filas reparten las dos cosas: 1, 2, 3, 4, 6 y 12. Son los divisores comunes. El 8 solo está arriba: por eso sobraban lápices.',
    'El mayor de los comunes es el 12. Se llama Máximo Común Divisor: el número más grande que divide a 48 y a 36.',
    'Doce grupos, cada uno con 4 cuadernos y 3 lápices: 48 ÷ 12 = 4 y 36 ÷ 12 = 3. No sobra nada, y sin media hora de pruebas.'
  ];

  var A;
  var cuadernos = [], lapices = [], platos = [], numeros = [];
  var estadoC, estadoL, pregunta, listas, fichas = [], comunes = {}, marcoMcd, rotuloMcd;

  /* Un cuaderno: la tapa con su lomo y su etiqueta. Un lápiz: el cuerpo
     amarillo, el borrador y la punta. Se distinguen por la FORMA, no
     solo por el color: el que no distingue colores también los cuenta. */
  function cuaderno(padre) {
    var el = A.el;
    var g = el('g', { class: 'tn-cuaderno' }, padre);
    el('rect', { x: -6, y: -3.2, width: 12, height: 6.4, rx: 1, fill: '#3d8bd9', stroke: '#1c4f86', 'stroke-width': 0.7 }, g);
    el('rect', { x: -6, y: -3.2, width: 2.4, height: 6.4, fill: '#1c4f86' }, g);
    el('rect', { x: -1.8, y: -1.1, width: 5.2, height: 2.2, rx: 0.4, fill: '#eaf3fc' }, g);
    return g;
  }
  function lapiz(padre) {
    var el = A.el;
    var g = el('g', { class: 'tn-lapiz' }, padre);
    el('rect', { x: -6.5, y: -1.7, width: 1.9, height: 3.4, rx: 0.6, fill: '#f08a9b' }, g);
    el('rect', { x: -4.6, y: -1.7, width: 1, height: 3.4, fill: '#a9a9a9' }, g);
    el('rect', { x: -3.6, y: -1.7, width: 7.2, height: 3.4, fill: '#f5c330', stroke: '#b7860b', 'stroke-width': 0.4 }, g);
    el('polygon', { points: '3.6,-1.7 6.6,0 3.6,1.7', fill: '#e9c08e' }, g);
    el('polygon', { points: '5.5,-0.62 6.6,0 5.5,0.62', fill: '#3b3b3b' }, g);
    return g;
  }

  /* El montón revuelto, pero SIEMPRE igual (con semilla): cada pieza en
     el sitio que queda más lejos de las que ya están, dentro de un óvalo.
     Así se ve un montón y no una pila ordenada, que ya diría de cuántos
     en cuántos se reparte. */
  function monton(n, centro, semilla, giroMax) {
    var rnd = A.azar(semilla), puestos = [];
    for (var i = 0; i < n; i++) {
      var mejor = null, lejos = -1;
      for (var t = 0; t < 14; t++) {
        var ang = rnd() * Math.PI * 2, r = Math.sqrt(rnd());
        var p = { x: centro.x + Math.cos(ang) * r * RX, y: centro.y + Math.sin(ang) * r * RY };
        var d = 1e9;
        for (var j = 0; j < puestos.length; j++) {
          var dx = puestos[j].x - p.x, dy = (puestos[j].y - p.y) * 1.8;
          d = Math.min(d, dx * dx + dy * dy);
        }
        if (d > lejos) { lejos = d; mejor = p; }
      }
      mejor.giro = (rnd() * 2 - 1) * giroMax;
      puestos.push(mejor);
    }
    return puestos;
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;
    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── lo que se lee arriba de cada montón ── */
    [['c', '48 cuadernos'], ['l', '36 lápices']].forEach(function (m) {
      var t = el('text', { class: 'am-letra', x: MONTON[m[0]].x, y: 12, 'text-anchor': 'middle', 'font-size': 12 }, svg);
      t.textContent = m[1];
    });
    estadoC = el('text', { class: 'am-rotulo tn-sobran am-fuera', 'data-que': 'cuadernos', x: MONTON.c.x, y: ESTADO_Y, 'text-anchor': 'middle', 'font-size': 12 }, svg);
    estadoL = el('text', { class: 'am-rotulo tn-sobran am-fuera', 'data-que': 'lapices', x: MONTON.l.x, y: ESTADO_Y, 'text-anchor': 'middle', 'font-size': 12 }, svg);

    /* En el paso 0 el sitio de los grupos está vacío a propósito: la
       pregunta de la historia es justo cuántos van ahí. */
    pregunta = el('text', { class: 'am-letra', x: ANCHO / 2, y: 160, 'text-anchor': 'middle', 'font-size': 18, style: 'fill:var(--gray,#8f969c)' }, svg);
    pregunta.textContent = '¿En cuántos grupos?';

    /* ── los grupos: un plato con su número, doce de sobra ── */
    for (var j = 0; j < 12; j++) {
      var p = el('rect', { class: 'tn-plato am-fuera', x: -11, y: 0, width: 22, height: 3.4, rx: 1.7, style: 'fill:var(--gray,#8f969c);fill-opacity:0.6' }, svg);
      var nm = el('text', { class: 'am-letra tn-num am-fuera', x: 0, y: 0, 'text-anchor': 'middle', 'font-size': 10, style: 'fill:var(--gray,#8f969c)' }, svg);
      nm.textContent = j + 1;
      platos.push(p); numeros.push(nm);
    }

    /* ── las dos filas de divisores (pasos 4 a 6) ── */
    listas = el('g', { class: 'am-capa am-fuera' }, svg);
    var cab = el('text', { class: 'am-letra', x: 10, y: 97, 'font-size': 12, style: 'fill:var(--gray,#8f969c)' }, listas);
    cab.textContent = 'Divisores de 48 (arriba) y de 36 (abajo)';
    /* Un divisor común es una columna con DOS fichas, y un puente las une:
       se ve sin leer y sin distinguir colores. */
    COMUNES.forEach(function (v) {
      var g = el('g', { class: 'tn-comun am-fuera', 'data-v': v }, listas);
      el('line', { x1: xCol(v), y1: FILA[48] + 10.5, x2: xCol(v), y2: FILA[36] - 10.5,
        style: 'stroke:var(--am-sec,#00838f);stroke-width:2.4;stroke-linecap:round' }, g);
      comunes[v] = g;
    });
    /* El mayor lleva un marco de borde grueso alrededor de su columna, y no
       solo más color: tiene que distinguirse también fotocopiado. */
    marcoMcd = el('rect', { class: 'tn-mayor am-fuera', 'data-v': MCD, x: xCol(MCD) - 12.8, y: FILA[48] - 14, width: 25.6, height: FILA[36] - FILA[48] + 28, rx: 7,
      style: 'fill:none;stroke:var(--am-pri,#1565c0);stroke-width:2.4' }, listas);
    [[48, D48], [36, D36]].forEach(function (f) {
      var fila = f[0], y = FILA[fila];
      f[1].forEach(function (v) {
        var g = el('g', { class: 'tn-chip am-fuera', 'data-fila': fila, 'data-v': v }, listas);
        el('rect', { class: 'am-ficha', x: xCol(v) - 10.5, y: y - 10, width: 21, height: 20, rx: 4.5, style: 'stroke-width:1.4' }, g);
        /* Pintada por dentro cuando es común: encima del blanco de la
           ficha y debajo del número. */
        var marca = el('rect', { class: 'tn-marca am-fuera', x: xCol(v) - 10.5, y: y - 10, width: 21, height: 20, rx: 4.5,
          style: 'fill:var(--am-sec,#00838f);fill-opacity:0.28' }, g);
        var tx = el('text', { class: 'am-digito', x: xCol(v), y: y + 5, 'text-anchor': 'middle', 'font-size': 14 }, g);
        tx.textContent = v;
        fichas.push({ g: g, fila: fila, v: v, marca: marca });
      });
    });
    rotuloMcd = el('text', { class: 'am-rotulo tn-mcd am-fuera', x: xCol(MCD), y: FILA[36] + 34, 'text-anchor': 'middle', 'font-size': 14, style: 'fill:var(--am-pri,#1565c0)' }, listas);
    rotuloMcd.textContent = 'el mayor: M.C.D.';

    /* ── las piezas, encima de todo ── */
    var sitiosC = monton(CUADERNOS, MONTON.c, 4812, 40);
    var sitiosL = monton(LAPICES, MONTON.l, 3612, 90);
    for (var i = 0; i < CUADERNOS; i++) { var c = cuaderno(svg); c._amCasa = sitiosC[i]; cuadernos.push(c); }
    for (var i2 = 0; i2 < LAPICES; i2++) { var l = lapiz(svg); l._amCasa = sitiosL[i2]; lapices.push(l); }
  }

  /* Dónde cae cada pieza al repartir entre k: la i-ésima va al grupo
     i mod k, en el piso i div k (una vuelta de reparto por piso). Lo que
     no alcanza para otra vuelta entera se queda en la mesa, en fila. */
  function repartir(piezas, total, k, centro, sepSobra, pisoBase, demora0, adelante) {
    var q = Math.floor(total / k), usados = q * k, sobran = total - usados;
    piezas.forEach(function (p, i) {
      var d = adelante ? demora0 + i * 10 : 0;
      if (i < usados) {
        var j = i % k, piso = Math.floor(i / k);
        A.mover(p, xGrupo(j, k), pisoBase(piso), 0, PIEZA, d);
      } else {
        var s = i - usados;
        A.mover(p, centro.x + (s - (sobran - 1) / 2) * sepSobra, centro.y, 0, PIEZA, d);
      }
    });
    return sobran;
  }
  function alMonton(piezas) {
    piezas.forEach(function (p) { A.mover(p, p._amCasa.x, p._amCasa.y, p._amCasa.giro, PIEZA, 0); });
  }
  function estado(t, sobran, visible) {
    t.setAttribute('data-n', sobran);
    t.textContent = sobran === 0 ? '✓ no sobra ninguno' : (sobran === 1 ? 'sobra 1' : 'sobran ' + sobran);
    A.ver(t, visible);
  }

  function pintar(n, antes) {
    var adelante = n > antes;
    var k = GRUPOS[n] || 0;
    A.ver(pregunta, n === 0);

    /* Los platos y sus números: los k primeros, repartidos a lo ancho. */
    platos.forEach(function (p, j) {
      var si = j < k;
      if (si) {
        A.mover(p, xGrupo(j, k), BASE + 1, 0, 1, 0);
        A.mover(numeros[j], xGrupo(j, k), BASE + 17, 0, 1, 0);
      }
      A.ver(p, si);
      A.ver(numeros[j], si);
    });

    if (k) {
      var q = Math.floor(CUADERNOS / k);
      var sobraC = repartir(cuadernos, CUADERNOS, k, MONTON.c, 18,
        function (piso) { return BASE - 4.4 - piso * ALTO_C; }, 150, adelante);
      var sobraL = repartir(lapices, LAPICES, k, MONTON.l, 20,
        function (piso) { return BASE - q * ALTO_C - 3.1 - piso * ALTO_L; }, 150 + CUADERNOS * 10 + 100, adelante);
      estado(estadoC, sobraC, true);
      estado(estadoL, sobraL, true);
    } else {
      alMonton(cuadernos);
      alMonton(lapices);
      A.ver(estadoC, false);
      A.ver(estadoL, false);
    }

    /* Las filas de divisores: primero la del 48, después la del 36. */
    var enListas = n >= 4 && n <= 6;
    A.ver(listas, enListas);
    var conComunes = n === 5 || n === 6;
    fichas.forEach(function (f) {
      var orden = COLUMNAS.indexOf(f.v) + (f.fila === 36 ? 14 : 0);
      var i = COMUNES.indexOf(f.v);
      A.ver(f.g, enListas, adelante && n === 4 ? 300 + orden * 40 : 0);
      A.ver(f.marca, conComunes && i >= 0, adelante && n === 5 ? 150 + i * 150 : 0);
    });
    COMUNES.forEach(function (v, i) {
      A.ver(comunes[v], conComunes, adelante && n === 5 ? 150 + i * 150 : 0);
    });
    A.ver(marcoMcd, n === 6, adelante && n === 6 ? 150 : 0);
    A.ver(rotuloMcd, n === 6, adelante && n === 6 ? 300 : 0);
  }

  function marcador(n) {
    return [
      { cifra: '48 y 36', palabras: 'cuadernos y lápices' },
      { cifra: '5 grupos', palabras: 'sobran 3 cuadernos y 1 lápiz' },
      { cifra: '7 grupos', palabras: 'sobran 6 cuadernos y 1 lápiz' },
      { cifra: '8 grupos', palabras: 'sobran 4 lápices' },
      { cifra: '48 y 36', palabras: 'sus divisores' },
      { cifra: '48 y 36', palabras: 'sus divisores comunes' },
      { cifra: String(MCD), palabras: 'Máximo Común Divisor' },
      { cifra: '12 grupos', palabras: 'de 4 cuadernos y 3 lápices' }
    ][n];
  }

  AnimacionMision.montar('#amReparto', {
    vista: [ANCHO, ALTO],
    describe: 'Una mesa con 48 cuadernos y 36 lápices, y abajo los grupos entre los que se reparten.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['📦 Repartir entre 5', '📦 Probar entre 7', '📦 Probar entre 8', '🧮 Hacerlo sin probar',
        '🔍 Ver los comunes', '🏆 Elegir el mayor', '📦 Repartir entre 12', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
