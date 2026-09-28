/* ============================================================
   M.E.T.A.S · Recta Numérica · La vara de la pila
   ------------------------------------------------------------
   La escena de la animación que va después de la historia de don
   Tulio, que mide el agua de la pila con una vara marcada: el
   lunes 38 y el viernes 24. Su hijo dice que subió; él, que bajó;
   y de quién tenga razón depende si esa semana hay que racionar.
   El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Lo que enseña, en el orden en que se aprende:

     0  la pila con el agua en el 38, y la pregunta de la historia:
        ¿subió o bajó? Se decide ANTES de tocar;
     1  el agua baja hasta el 24 a la vista: más abajo en la vara es
        menor;
     2  cuánto bajó, contado en saltos de 24 a 38: 6 hasta el 30 y 8
        más, que es contar con números redondos;
     3  la resta y su prueba: 38 − 24 = 14 y 24 + 14 = 38;
     4  la vara se acuesta y es una recta numérica: los números
        crecen hacia la derecha, el menor queda a la izquierda;
     5  restar es retroceder: Salta (la rana de la misión) va del 38
        al 24;
     6  el precio de la historia: si la otra semana baja lo mismo,
        llega al 10, y por eso hay que racionar;
     7  sumar es avanzar: si llueve y sube 14, vuelve al 24.

   Tres decisiones, y ninguna es de adorno:

   1. ⚠️ **La vara se acuesta de verdad.** La historia dice que «una
      vara marcada es una recta numérica puesta de pie», y aquí se ve
      pasar: la misma vara, con las mismas rayas, gira hasta quedar
      tendida. Los números que tiene escritos giran al revés mientras
      tanto, para seguir leyéndose derechos.
   2. ⚠️ **Lo que se dibuja es lo que se cuenta.** El nivel del agua
      cae en la raya de su número, cada salto va de la raya en que
      dice que empieza a la raya en que dice que acaba, y la rana
      queda donde dice el marcador. La sonda
      `verifica-animacion-mision` lo mide sobre el dibujo.
   3. **No se usa lo que pregunta el «Predice» de abajo**: el punto
      medio entre 40 y 60, el 75 entre 70 y 80, ni 350 − 120. Todos
      los números de aquí son los de la pila de don Tulio.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amVara')) return;

  var ANCHO = 320, ALTO = 236, FIN = 7;
  var ESC = 3.5;                       // cuánto mide una unidad de la vara
  var PIE = { x: 110, y: 214 };        // el 0 de la vara, de pie en la pila
  var TENDIDA = { x: 38, y: 128 };     // el 0 de la vara, acostada
  /* Acostada crece un 40 %: de pie la limita el alto de la pila, y tendida
     le sobra ancho; si no crece, la recta queda como un fósforo en medio
     del escenario y los saltos de 14 se ven de un dedo. */
  var GRANDE = 1.4;
  function yV(v) { return PIE.y - ESC * v; }                // una marca, con la vara de pie
  function xH(v) { return TENDIDA.x + ESC * GRANDE * v; }   // una marca, con la vara acostada

  var LUNES = 38, VIERNES = 24, OTRA = 10;
  var RANA = { 4: 38, 5: 24, 6: 10, 7: 24 };

  /* Las cuentas van con espacios que no se parten (\u00a0): en un teléfono
     «38 − 24 = 14» se cortaba entre renglones y se leía «38» arriba y
     «− 24 = 14» abajo, como si fueran dos cosas. */
  var TEXTOS = [
    'El lunes, el agua de la pila llegaba a la marca 38 de la vara. El viernes llegó a la 24. ¿Subió o bajó? Decídelo antes de tocar.',
    'Bajó: en la vara, el 24 queda más abajo que el 38. Tenía razón don Tulio. Ahora falta saber cuánto bajó.',
    'Se cuenta de 24 a 38 en saltos: 6 hasta el 30 y 8 más hasta el 38. En total, el agua bajó 14.',
    'Eso se escribe con una resta: 38\u00a0−\u00a024\u00a0=\u00a014. Y se comprueba al revés, con una suma: 24\u00a0+\u00a014\u00a0=\u00a038.',
    'Acostada, la vara es una recta numérica: los números crecen hacia la derecha. El 24 queda a la izquierda del 38 porque es menor.',
    'Restar es retroceder hacia la izquierda. Del 38 se retroceden 14 y se llega al 24: 38\u00a0−\u00a014\u00a0=\u00a024.',
    'Si la otra semana baja lo mismo, el agua llega a la marca 10: 24\u00a0−\u00a014\u00a0=\u00a010. Por eso esta semana toca racionar.',
    'Y sumar es avanzar hacia la derecha. Si llueve y el agua sube 14, vuelve a la 24: 10\u00a0+\u00a014\u00a0=\u00a024.'
  ];

  var A;
  var pila, agua, nivelL, rotuloL, nivelV, rotuloV, saltosV = [], llave, cuentas = [];
  var vara, marcasV = [], tendida, puntos = {}, saltosH = {}, rana, ranaCara;

  /* Un salto: la curva con su punta de flecha y el número que dice. Se
     guarda de dónde a dónde va (data-de, data-a) para que la sonda mida
     si de verdad empieza y acaba en esas rayas. */
  function salto(padre, de, a, d, rotulo, xR, yR, anchor) {
    var el = A.el;
    var g = el('g', { class: 'rn-salto-g am-fuera' }, padre);
    var p = el('path', { class: 'am-trazo rn-salto', d: d, 'data-de': de, 'data-a': a, style: 'stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round' }, g);
    var t = el('text', { class: 'am-rotulo rn-salto-num', x: xR, y: yR, 'text-anchor': anchor || 'middle', 'font-size': 13, style: 'fill:var(--am-sec,#00838f)' }, g);
    t.textContent = rotulo;
    return { g: g, camino: p };
  }
  /* Un salto aparece dibujándose: la flecha sale mientras se hace el
     salto, no aparece ya hecha. */
  function verSalto(s, si, demora) {
    A.ver(s.g, si, demora);
    A.trazar(s.camino, si, demora);
  }
  /* La punta de una flecha que llega a (x, y) viniendo en la dirección
     (dx, dy): dos rayitas. */
  function punta(x, y, dx, dy) {
    var l = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / l, uy = dy / l;
    var px = -uy, py = ux, L = 6, W = 3.5;
    return ' M ' + (x - ux * L + px * W).toFixed(2) + ' ' + (y - uy * L + py * W).toFixed(2) + ' L ' + x + ' ' + y +
      ' L ' + (x - ux * L - px * W).toFixed(2) + ' ' + (y - uy * L - py * W).toFixed(2);
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el, id = A.id;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── La pila, con el agua (pasos 0 a 3) ── */
    /* La pila va con los colores de la tarjeta (clara en la pantalla clara,
       oscura en la oscura): así los números de encima, que llevan halo del
       color de la tarjeta, se leen igual en las dos. Con cemento claro fijo,
       en la pantalla oscura salían letras claras con borde negro. */
    pila = el('g', { class: 'am-capa' }, svg);
    el('rect', { x: 36, y: 30, width: 248, height: 196, rx: 8, style: 'fill:var(--border,#e2ddd4);stroke:var(--gray,#8f969c);stroke-width:2' }, pila);
    el('rect', { x: 48, y: 38, width: 224, height: 180, rx: 3, style: 'fill:var(--card,#fff)' }, pila);
    var defs = el('defs', null, svg);
    var clip = el('clipPath', { id: id + '-pila' }, defs);
    el('rect', { x: 48, y: 38, width: 224, height: 180, rx: 3 }, clip);
    var recorte = el('g', { 'clip-path': 'url(#' + id + '-pila)' }, pila);
    /* El agua es un bloque alto que sube y baja de una pieza: solo se
       mueve, no cambia de tamaño, y lo que sobra lo recorta la pila. */
    agua = el('g', null, recorte);
    el('rect', { class: 'rn-agua', x: 48, y: 0, width: 224, height: 240, fill: '#62a8e5', 'fill-opacity': 0.85 }, agua);
    el('rect', { x: 48, y: 0, width: 224, height: 2.5, fill: '#d6ecfb' }, agua);

    function nivel(v, texto) {
      var l = el('line', { class: 'am-trazo', x1: 118, y1: yV(v), x2: 186, y2: yV(v), style: 'stroke-width:1.6' }, pila);
      var t = el('text', { class: 'am-rotulo rn-rotulo', x: 192, y: yV(v) + 4.5, 'font-size': 13, 'data-v': v }, pila);
      t.textContent = texto;
      return [l, t];
    }
    var nl = nivel(LUNES, 'lunes: 38'); nivelL = nl[0]; rotuloL = nl[1];
    var nv = nivel(VIERNES, 'viernes: 24'); nivelV = nv[0]; rotuloV = nv[1];

    /* Los saltos de 24 a 38, a la derecha de la vara, y la llave del total. */
    function curvaV(de, a) {
      var y0 = yV(de), y1 = yV(a), ym = (y0 + y1) / 2;
      return 'M 118 ' + y0 + ' Q 142 ' + ym + ' 118 ' + y1 + punta(118, y1, -24, y1 - ym);
    }
    saltosV.push(salto(pila, VIERNES, 30, curvaV(VIERNES, 30), '6', 138, (yV(VIERNES) + yV(30)) / 2 + 4.5, 'start'));
    saltosV.push(salto(pila, 30, LUNES, curvaV(30, LUNES), '8', 138, (yV(30) + yV(LUNES)) / 2 + 4.5, 'start'));
    llave = el('g', { class: 'am-fuera' }, pila);
    el('path', { class: 'am-trazo', d: 'M 166 ' + yV(LUNES) + ' L 172 ' + yV(LUNES) + ' L 172 ' + yV(VIERNES) + ' L 166 ' + yV(VIERNES), style: 'stroke-width:1.6' }, llave);
    var t14 = el('text', { class: 'am-rotulo', x: 178, y: (yV(LUNES) + yV(VIERNES)) / 2 + 6, 'font-size': 17, style: 'fill:var(--am-sec,#00838f)' }, llave);
    t14.textContent = '14';

    /* La resta y su prueba (paso 3), escritas sobre el agua. */
    ['38 − 24 = 14', '24 + 14 = 38'].forEach(function (c, i) {
      var t = el('text', { class: 'am-rotulo rn-cuenta am-fuera', x: 206, y: 178 + i * 24, 'text-anchor': 'middle', 'font-size': 15 }, pila);
      t.textContent = c;
      cuentas.push(t);
    });

    /* ── La recta, ya tendida (pasos 4 a 7) ── */
    tendida = el('g', { class: 'am-capa am-fuera' }, svg);
    for (var v = 0; v <= 50; v += 10) {
      var th = el('text', { class: 'am-rotulo rn-marca-h', x: xH(v), y: TENDIDA.y + 26, 'text-anchor': 'middle', 'font-size': 12, 'data-v': v }, tendida);
      th.textContent = v;
    }
    function curvaH(de, a) {
      /* La curva va por encima de la cabeza de la rana: si empezara a la
         altura de sus patas, la punta de la flecha quedaría tapada por
         ella justo al llegar. */
      var x0 = xH(de), x1 = xH(a), xm = (x0 + x1) / 2, y = TENDIDA.y - 34, yc = TENDIDA.y - 78;
      return 'M ' + x0 + ' ' + y + ' Q ' + xm + ' ' + yc + ' ' + x1 + ' ' + y + punta(x1, y, x1 - xm, y - yc);
    }
    [[5, LUNES, VIERNES, '−14'], [6, VIERNES, OTRA, '−14'], [7, OTRA, VIERNES, '+14']].forEach(function (s) {
      saltosH[s[0]] = salto(tendida, s[1], s[2], curvaH(s[1], s[2]), s[3], (xH(s[1]) + xH(s[2])) / 2, TENDIDA.y - 62);
    });
    [LUNES, VIERNES, OTRA].forEach(function (v2) {
      var g = el('g', { class: 'am-fuera' }, tendida);
      el('circle', { class: 'am-relleno rn-punto', cx: xH(v2), cy: TENDIDA.y, r: 4.5, 'data-v': v2, style: 'stroke:var(--card,#fff);stroke-width:1.5' }, g);
      var tp = el('text', { class: 'am-valor', x: xH(v2), y: TENDIDA.y + 44, 'text-anchor': 'middle', 'font-size': 13 }, g);
      tp.textContent = v2;
      puntos[v2] = g;
    });

    /* ── La vara, que es la misma de pie y acostada ── */
    vara = el('g', null, svg);
    el('rect', { x: -4, y: -(50 * ESC + 4), width: 8, height: 50 * ESC + 8, rx: 2, fill: '#c8955c', stroke: '#8b5e34', 'stroke-width': 1 }, vara);
    for (var m = 0; m <= 50; m++) {
      var largo = m % 10 === 0 ? 14 : (m % 5 === 0 ? 10 : 6);
      el('line', { x1: -4, y1: -ESC * m, x2: -4 + largo, y2: -ESC * m, stroke: '#5b3a1e', 'stroke-width': m % 5 === 0 ? 1.2 : 0.8 }, vara);
    }
    for (var n2 = 0; n2 <= 50; n2 += 10) {
      /* Cada número va en su propio grupo, que gira al revés que la vara:
         así se sigue leyendo derecho mientras ella se acuesta. */
      var gm = el('g', null, vara);
      var tm = el('text', { class: 'am-rotulo rn-marca', x: 0, y: 4.5, 'text-anchor': 'middle', 'font-size': 12, 'data-v': n2 }, gm);
      tm.textContent = n2;
      marcasV.push({ g: gm, t: tm, v: n2 });
    }

    /* ── Salta, la rana de la misión ── */
    rana = el('g', { class: 'rn-rana am-viaja am-fuera' }, svg);
    ranaCara = el('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-size': 22 }, rana);
    ranaCara.textContent = '🐸';
  }

  function pintar(n, antes) {
    var adelante = n > antes;
    var dePie = n <= 3;

    /* La pila y el agua */
    A.ver(pila, dePie);
    A.mover(agua, 0, yV(n === 0 ? LUNES : VIERNES), 0, 1, adelante && n === 1 ? 150 : 0);
    A.ver(nivelL, dePie); A.ver(rotuloL, dePie);
    /* El nivel del lunes se queda marcado, con raya cortada: ya no está. */
    nivelL.classList.toggle('am-roto', n >= 1);
    A.ver(nivelV, n >= 1 && dePie, adelante && n === 1 ? 700 : 0);
    A.ver(rotuloV, n >= 1 && dePie, adelante && n === 1 ? 700 : 0);
    saltosV.forEach(function (s, i) { verSalto(s, n === 2 || n === 3, adelante && n === 2 ? 200 + i * 700 : 0); });
    A.ver(llave, n === 2 || n === 3, adelante && n === 2 ? 1600 : 0);
    cuentas.forEach(function (c, i) { A.ver(c, n === 3, adelante && n === 3 ? 150 + i * 500 : 0); });

    /* La vara: de pie en la pila o tendida como recta */
    var giro = dePie ? 0 : 90;
    if (dePie) A.mover(vara, PIE.x, PIE.y, 0, 1, 0);
    else A.mover(vara, TENDIDA.x, TENDIDA.y, 90, GRANDE, 0);
    marcasV.forEach(function (m) {
      A.mover(m.g, -18, -ESC * m.v, -giro, 1, 0);
      A.ver(m.t, dePie);
    });

    /* La recta tendida, sus puntos y sus saltos */
    A.ver(tendida, !dePie, adelante && n === 4 ? 550 : 0);
    A.ver(puntos[LUNES], !dePie);
    A.ver(puntos[VIERNES], !dePie);
    A.ver(puntos[OTRA], n >= 6, adelante && n === 6 ? 650 : 0);
    [5, 6, 7].forEach(function (p) { verSalto(saltosH[p], n === p, 0); });

    /* La rana: cae donde dice el marcador, y si cambia de sitio con
       movimiento, brinca por el camino. */
    var donde = RANA[n] != null ? RANA[n] : LUNES;
    var yaEstaba = rana._amV;
    A.mover(rana, xH(donde), TENDIDA.y - 10, 0, 1, adelante && n === 4 ? 700 : 0);
    A.ver(rana, !dePie, adelante && n === 4 ? 700 : 0);
    rana._amV = donde;
    ranaCara.classList.remove('am-salta');
    if (!dePie && yaEstaba != null && yaEstaba !== donde && !A.quieto()) {
      A.asentar();
      ranaCara.classList.add('am-salta');
    }
  }

  function marcador(n, antes) {
    var adelante = n > antes;
    return [
      { cifra: '38', palabras: 'el lunes' },
      { cifra: '24', palabras: 'el viernes' },
      { cifra: '14', palabras: '6 + 8' },
      { cifra: '14', palabras: '38 − 24 = 14' },
      { cifra: '24 < 38', palabras: 'el menor queda a la izquierda' },
      { cifra: '24', palabras: '38 − 14 = 24', salto: adelante ? '−14' : '' },
      { cifra: '10', palabras: '24 − 14 = 10', salto: adelante ? '−14' : '' },
      { cifra: '24', palabras: '10 + 14 = 24', salto: adelante ? '+14' : '' }
    ][n];
  }

  AnimacionMision.montar('#amVara', {
    vista: [ANCHO, ALTO],
    describe: 'La pila de don Tulio con la vara marcada del 0 al 50 y el agua a la altura de la semana.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['💧 Ver el viernes', '📏 ¿Cuánto bajó?', '➖ Escribirlo con una resta', '📐 Acostar la vara',
        '🐸 Retroceder 14', '🐸 ¿Y la otra semana?', '🐸 ¿Y si llueve?', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
