/* ============================================================
   M.E.T.A.S · Multiplicación Vertical · Las copias de la guía
   ------------------------------------------------------------
   La escena de la animación que va después de la historia del
   maestro que manda a fotocopiar la guía: 7 hojas para cada uno de
   sus 43 alumnos, y en el centro de copiado le piden el número
   exacto. La historia termina diciendo que sumar 43 siete veces sale
   pero se tarda, y que multiplicar es esa misma suma hecha corta, en
   tres renglones. El aparato (botones, frase, marcador) vive en
   js/animacion-mision.js; aquí solo está el dibujo y dónde va cada
   pieza en cada paso.

   Todo va en cuadrícula, como en el cuaderno: una cifra por cuadro.
   Lo que enseña, en el orden en que se aprende:

     0  de cada una de las 7 hojas van 43 copias: es sumar 43 siete
        veces, en siete renglones, y abajo el resultado por saber;
     1  las unidades: siete veces 3 van sumando 3, 6, 9… hasta 21, que
        es 7 × 3. Son 2 decenas y 1 unidad: el 1 se escribe y el 2 se
        lleva arriba de las decenas;
     2  las decenas: siete veces 4 son 28, que es 7 × 4. Y arriba está
        el 2 que se llevaba, que también son decenas;
     3  con el 2, 28 + 2 = 30: el 0 se escribe y el 3 va delante. Son
        301 hojas;
     4  eso mismo, hecho corto: los siete 43 se juntan en uno, las siete
        hojas se vuelven el 7, y la cuenta cabe en tres renglones:
        43 × 7 = 301, con el 2 que se lleva donde estaba;
     5  si se olvida el 2, sale 281: faltan 20 hojas y tres alumnos se
        quedan sin la guía completa;
     6  con el 2, 301 hojas, siete para cada uno de los 43.

   Cinco decisiones, y ninguna es de adorno:

   1. ⚠️ **Primero la suma larga, después la corta.** La historia dice
      que multiplicar es la misma suma hecha corta, y eso se VE: las
      sumas de cada columna van corriendo (3, 6, 9… 21) y la tabla de
      multiplicar sale de ahí (siete veces 3 es 7 × 3). Sin eso, el 7 ×
      3 de la cuenta corta es una regla que se memoriza, y lo que se
      memoriza sin saber de dónde sale se olvida al mes.
   2. ⚠️ **Llevar es partir el 21 en decenas y unidades.** El 21 de la
      columna se parte a la vista: el 1 baja a su cuadro y el 2 sube a
      las decenas, donde se suma con ellas. Y el 2 llega de verdad a la
      cuenta de las decenas: baja de su cuadro al 28, que se vuelve 30.
      El error de olvidarlo (el Error 2 de la misión) se hace después a
      la vista, con lo que cuesta: veinte hojas de menos.
   3. **Las siete hojas se vuelven el 7.** Al juntar la suma, los siete
      rótulos de hoja van a parar al renglón del 7: el alumno ve de dónde
      sale el número de abajo de la multiplicación.
   4. ⚠️ **Lo que va debajo NO se regala.** El «Predice» pregunta en qué
      cifra termina 34 × 5, cuánto es 45 × 10 y si 23 × 14 pasa de 300.
      Aquí no se dice ninguna regla de la última cifra, ni se multiplica
      por diez, ni se estima: solo los números de la historia.
   5. **Lo que se dibuja es lo que se cuenta.** La sonda
      `verifica-animacion-mision` saca la cuadrícula de sus propias
      rayas, lee cada renglón por el cuadro donde cae cada cifra, suma
      aparte los siete renglones y rehace cada suma que va corriendo, en
      cada paso.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCopias')) return;

  var ANCHO = 320, ALTO = 204, FIN = 6;

  /* La cuadrícula: cuatro columnas (la del signo, centenas, decenas y
     unidades) y nueve renglones: el de lo que se lleva, los siete de las
     hojas y el del resultado. */
  var P = 24, FILA = 21, TOPE = 6, FILAS = 9, X0 = 92;
  var COL = { S: 0, C: 1, D: 2, U: 3 };
  function xc(c) { return X0 + P * COL[c] + P / 2; }
  function yb(r) { return TOPE + FILA * r + 16; }        // dónde se asienta una cifra del renglón r
  function yl(r) { return TOPE + FILA * r + 18; }        // y una de las chicas, las que se llevan
  function yRaya(r) { return TOPE + FILA * r; }          // la raya de arriba del renglón r
  var LARGO = { lleva: 0, resultado: 8 };
  var CORTO = { lleva: 2, arriba: 3, por: 4, resultado: 5 };
  var FZ = 17, FZ_LLEVA = 12.5, FZ_SUMA = 14;

  /* Las sumas que van corriendo, a la derecha de la cuadrícula: una cifra
     por pieza (decenas y unidades), para que el 21 y el 30 se puedan partir
     y cada cifra se vaya a su cuadro. */
  var XS = [214, 222.4];
  /* Y la cuenta de las decenas con lo que se llevaba: 28 + 2 = 30. */
  var X_MAS = 235, X_DOS = 246.5, X_IGUAL = 258, X_30 = [268.5, 276.9];

  var TEXTOS = [
    'De cada una de las 7 hojas se sacan 43 copias, una por alumno. Es sumar 43 siete veces: ¿cuántas hojas son?',
    'Las unidades: siete veces 3 son 21, que es 7 × 3. Son 2 decenas y 1 unidad: el 1 se escribe y el 2 se lleva.',
    'Las decenas: siete veces 4 son 28, que es 7 × 4. Y arriba está el 2 que se llevaba: también son decenas.',
    'Con el 2 que se llevaba, 28 + 2 = 30. El 0 se escribe y el 3 va delante: son 301 hojas.',
    'Eso mismo, hecho corto: 43 × 7 = 301. Arriba el 43, abajo el 7 y debajo el resultado: tres renglones en vez de ocho.',
    '¿Y si se olvida el 2 que se llevaba? Sale 281: faltan 20 hojas, y tres alumnos se quedan sin la guía completa.',
    'Con el 2 son 301 hojas: siete para cada uno de los 43. El maestro pide el número exacto y no paga ni una de más.'
  ];

  var A;
  var filas = [], rotHoja = [], sumas = { U: [], D: [] }, bandas = {};
  var signoMas, signoPor, por7, raya, hueco, rotAlumnos, rotHojas, rotTotal;
  var lleva, u1, r3, r0, mal = {}, nota = {}, error = {};

  function texto(padre, attrs, t) {
    var n = A.el('text', attrs, padre);
    n.textContent = t;
    return n;
  }

  /* Una pieza que viaja: el grupo de fuera la lleva de un sitio a otro y
     la letra de dentro se enciende y se apaga. Van separadas porque la
     demora de cada cosa es distinta: se enciende en su sitio y DESPUÉS
     viaja. */
  function pieza(clase, grupo, fz, t, col) {
    var g = A.el('g', null, A.svg);
    var n = texto(g, { class: clase, 'data-grupo': grupo, 'data-col': col || null, x: 0, y: 0, 'text-anchor': 'middle', 'font-size': fz }, t);
    return { g: g, t: n };
  }

  function construir(svg, ayuda) {
    A = ayuda;
    var el = A.el;

    el('rect', { class: 'am-fondo', x: 0, y: 0, width: ANCHO, height: ALTO }, svg);

    /* ── La hoja de cuadrícula ── */
    var rej = el('g', { class: 'mv-rejilla' }, svg), d = '', k;
    var ancho = P * 4, alto = FILA * FILAS;
    el('rect', { x: X0, y: TOPE, width: ancho, height: alto, style: 'fill:var(--card,#fff)' }, rej);
    for (k = 0; k <= 4; k++) d += 'M ' + (X0 + P * k) + ' ' + TOPE + ' V ' + (TOPE + alto) + ' ';
    for (k = 0; k <= FILAS; k++) d += 'M ' + X0 + ' ' + (TOPE + FILA * k) + ' H ' + (X0 + ancho) + ' ';
    el('path', { d: d.trim(), style: 'fill:none;stroke:var(--gray,#636e72);stroke-opacity:0.45;stroke-width:1' }, rej);

    /* La columna que se está sumando, pintada detrás de sus cifras. El
       tono va en fill-opacity y no en opacity: una opacidad escrita en
       línea le gana a .am-fuera y la banda no se apagaría nunca. */
    ['U', 'D'].forEach(function (c) {
      bandas[c] = el('rect', { class: 'mv-banda am-fuera', 'data-col': c, x: X0 + P * COL[c] + 1, y: yRaya(1) + 1, width: P - 2, height: FILA * 7 - 2, rx: 3,
        style: 'fill:var(--am-sec);fill-opacity:0.2' }, svg);
    });

    /* ── Los siete renglones de 43, uno por hoja ── */
    for (k = 1; k <= 7; k++) {
      var g = el('g', { class: k > 1 ? 'mv-fila am-capa' : 'mv-fila', 'data-fila': k }, svg);
      texto(g, { class: 'am-digito mv-cifra', 'data-grupo': 'sumando', 'data-col': 'D', x: xc('D'), y: 0, 'text-anchor': 'middle', 'font-size': FZ }, '4');
      texto(g, { class: 'am-digito mv-cifra', 'data-grupo': 'sumando', 'data-col': 'U', x: xc('U'), y: 0, 'text-anchor': 'middle', 'font-size': FZ }, '3');
      A.mover(g, 0, yb(k), 0, 1, 0);
      filas.push(g);

      var rg = el('g', { class: 'am-capa' }, svg);
      texto(rg, { class: 'am-letra mv-rotulo', x: X0 - 4, y: 0, 'text-anchor': 'end', 'font-size': 12 }, 'hoja ' + k);
      A.mover(rg, 0, yb(k), 0, 1, 0);
      rotHoja.push(rg);
    }
    signoMas = texto(svg, { class: 'am-letra mv-signo', x: xc('S'), y: yb(7), 'text-anchor': 'middle', 'font-size': FZ }, '+');

    /* Lo de la cuenta corta: el × y el 7, y lo que dice cada renglón. */
    signoPor = texto(svg, { class: 'am-letra mv-signo am-fuera', x: xc('S'), y: yb(CORTO.por), 'text-anchor': 'middle', 'font-size': FZ }, '×');
    por7 = texto(svg, { class: 'am-digito mv-cifra am-fuera', 'data-grupo': 'por', 'data-col': 'U', x: xc('U'), y: yb(CORTO.por), 'text-anchor': 'middle', 'font-size': FZ }, '7');
    rotAlumnos = texto(svg, { class: 'am-letra mv-rotulo am-fuera', x: X0 - 4, y: yb(CORTO.arriba), 'text-anchor': 'end', 'font-size': 12 }, 'alumnos');
    rotHojas = texto(svg, { class: 'am-letra mv-rotulo am-fuera', x: X0 - 4, y: yb(CORTO.por), 'text-anchor': 'end', 'font-size': 12 }, 'hojas');
    rotTotal = texto(svg, { class: 'am-letra mv-rotulo am-fuera', x: X0 - 4, y: yb(CORTO.resultado), 'text-anchor': 'end', 'font-size': 12 }, 'en total');

    /* La raya de la suma: se mueve entera cuando la cuenta se acorta. */
    raya = el('g', { class: 'mv-raya-g' }, svg);
    el('path', { class: 'mv-raya', d: 'M ' + (X0 + 2) + ' 0 H ' + (X0 + P * 4 - 2), style: 'fill:none;stroke:var(--dark,#1b2838);stroke-width:2;stroke-linecap:round' }, raya);

    /* El resultado, por saber. */
    hueco = el('g', { class: 'mv-hueco-g' }, svg);
    el('rect', { class: 'am-hueco mv-hueco', x: X0 + P + 2, y: yRaya(LARGO.resultado) + 2, width: 3 * P - 4, height: FILA - 4, rx: 3, style: 'fill:var(--card,#fff)' }, hueco);
    texto(hueco, { class: 'am-letra mv-hueco', x: xc('D'), y: yb(LARGO.resultado), 'text-anchor': 'middle', 'font-size': FZ }, '?');

    /* ── Las sumas que van corriendo, columna por columna ── */
    [['U', 3], ['D', 4]].forEach(function (s) {
      for (var i = 1; i <= 7; i++) {
        var v = s[1] * i, sg = el('g', { class: 'mv-suma am-fuera', 'data-col': s[0], 'data-fila': i }, svg), cs = String(v);
        cs.split('').forEach(function (c, j) {
          texto(sg, { class: 'am-letra', x: XS[j + 2 - cs.length], y: yb(i), 'text-anchor': 'middle', 'font-size': FZ_SUMA }, c);
        });
        sumas[s[0]].push(sg);
      }
    });

    /* La cuenta de las decenas con lo que se llevaba: + 2 = 30. El 2 que
       llega es una copia del que está arriba: baja de su cuadro. */
    nota.mas = texto(svg, { class: 'am-letra mv-mas am-fuera', x: X_MAS, y: yb(7), 'text-anchor': 'middle', 'font-size': FZ_SUMA }, '+');
    nota.dos = pieza('am-letra mv-mas', 'nota', FZ_LLEVA, '2');
    nota.igual = texto(svg, { class: 'am-letra mv-mas am-fuera', x: X_IGUAL, y: yb(7), 'text-anchor': 'middle', 'font-size': FZ_SUMA }, '=');
    nota.tres = texto(svg, { class: 'am-letra mv-mas am-fuera', x: X_30[0], y: yb(7), 'text-anchor': 'middle', 'font-size': FZ_SUMA }, '3');
    nota.cero = texto(svg, { class: 'am-letra mv-mas am-fuera', x: X_30[1], y: yb(7), 'text-anchor': 'middle', 'font-size': FZ_SUMA }, '0');

    /* ── Lo que va a su cuadro: el 2 que se lleva y las cifras del
       resultado. Salen de las sumas de la derecha (el 21 y el 30) y viajan. */
    lleva = pieza('am-digito mv-cifra', 'lleva', FZ_LLEVA, '2', 'D');
    lleva.aro = el('circle', { class: 'am-trazo mv-aro am-fuera', cx: 0, cy: -4.5, r: 8.5, style: 'stroke-width:1.6' }, lleva.g);
    lleva.olvido = el('circle', { class: 'am-hueco mv-olvido am-fuera', cx: 0, cy: -4.5, r: 8.5 }, lleva.g);
    u1 = pieza('am-digito mv-cifra', 'resultado', FZ, '1', 'U');
    r0 = pieza('am-digito mv-cifra', 'resultado', FZ, '0', 'D');
    r3 = pieza('am-digito mv-cifra', 'resultado', FZ, '3', 'C');

    /* ── El error: sin el 2, las decenas quedan en 28 ── */
    mal.dos = texto(svg, { class: 'am-digito mv-cifra am-fuera', 'data-grupo': 'resultado', 'data-col': 'C', x: xc('C'), y: yb(CORTO.resultado), 'text-anchor': 'middle', 'font-size': FZ }, '2');
    mal.ocho = texto(svg, { class: 'am-digito mv-cifra am-fuera', 'data-grupo': 'resultado', 'data-col': 'D', x: xc('D'), y: yb(CORTO.resultado), 'text-anchor': 'middle', 'font-size': FZ }, '8');
    error.caja = el('rect', { class: 'am-hueco mv-mal am-fuera', x: X0 + P + 1, y: yRaya(CORTO.resultado) + 1.5, width: 3 * P - 2, height: FILA - 3, rx: 4 }, svg);
    error.sin = texto(svg, { class: 'am-letra mv-rotulo am-fuera', x: X0 + 4 * P + 8, y: yb(CORTO.resultado), 'font-size': 12.5 }, 'sin el 2');
    error.faltan = texto(svg, { class: 'am-letra mv-rotulo am-fuera', x: X0 + 4 * P + 8, y: yb(CORTO.resultado + 1), 'font-size': 13.5 }, 'faltan 20 hojas');
  }

  function pintar(n, antes) {
    var adelante = n > antes;
    function d(ms) { return adelante ? ms : 0; }
    var corto = n >= 4, llega1 = adelante && n === 1, llega2 = adelante && n === 2, llega3 = adelante && n === 3, junta = adelante && n === 4;

    /* ── Los renglones de 43 y sus hojas: siete, o uno solo ── */
    filas.forEach(function (g, i) {
      A.mover(g, 0, corto ? yb(CORTO.arriba) : yb(i + 1), 0, 1, 0);
      if (i > 0) A.ver(g, !corto);
    });
    rotHoja.forEach(function (g, i) {
      /* Las siete hojas van a parar al renglón del 7. */
      A.mover(g, 0, corto ? yb(CORTO.por) : yb(i + 1), 0, 1, 0);
      A.ver(g, !corto);
    });
    A.ver(signoMas, !corto, 0);
    A.ver(signoPor, corto, d(junta ? 600 : 0));
    A.ver(por7, corto, d(junta ? 600 : 0));
    A.ver(rotAlumnos, corto, d(junta ? 900 : 0));
    A.ver(rotHojas, corto, d(junta ? 900 : 0));
    A.ver(rotTotal, corto, d(junta ? 900 : 0));
    A.mover(raya, 0, corto ? yRaya(CORTO.resultado) : yRaya(LARGO.resultado), 0, 1, 0);
    A.ver(hueco, n === 0, 0);

    /* ── La columna que se suma, y sus sumas corriendo ── */
    A.ver(bandas.U, n === 1, 0);
    A.ver(bandas.D, n === 2 || n === 3, 0);
    sumas.U.forEach(function (g, i) { A.ver(g, n === 1, d(llega1 ? 250 + 170 * i : 0)); });
    sumas.D.forEach(function (g, i) { A.ver(g, n === 2 || n === 3, d(llega2 ? 250 + 170 * i : 0)); });

    /* ── Las unidades: el 21 se parte. El 1 baja a su cuadro y el 2 sube
       a las decenas. ── */
    var yRes = corto ? yb(CORTO.resultado) : yb(LARGO.resultado);
    if (n === 0) {
      A.mover(u1.g, XS[1], yb(7), 0, FZ_SUMA / FZ, 0);
      A.mover(lleva.g, XS[0], yb(7), 0, FZ_SUMA / FZ_LLEVA, 0);
    } else {
      A.mover(u1.g, xc('U'), yRes, 0, 1, llega1 ? 1750 : 0);
      A.mover(lleva.g, xc('D'), corto ? yl(CORTO.lleva) : yl(LARGO.lleva), 0, 1, llega1 ? 1750 : 0);
    }
    A.ver(u1.t, n >= 1, d(llega1 ? 1400 : 0));
    A.ver(lleva.t, n >= 1 && n !== 5, d(llega1 ? 1400 : 0));
    A.ver(lleva.aro, n === 2 || n === 3 || n === 6, d(llega2 ? 1500 : n === 6 ? 400 : 0));
    A.ver(lleva.olvido, n === 5, d(n === 5 ? 300 : 0));

    /* ── Las decenas: 28, y el 2 que baja de su cuadro. El 30 se parte: el
       0 a su cuadro y el 3 delante. ── */
    A.ver(nota.mas, n === 3, d(llega3 ? 200 : 0));
    if (n === 3) A.mover(nota.dos.g, X_DOS, yb(7), 0, FZ_SUMA / FZ_LLEVA, d(400));
    else A.mover(nota.dos.g, xc('D'), yl(LARGO.lleva), 0, 1, 0);
    A.ver(nota.dos.t, n === 3, d(llega3 ? 200 : 0));
    [nota.igual, nota.tres, nota.cero].forEach(function (t) { A.ver(t, n === 3, d(llega3 ? 1200 : 0)); });
    [[r3, 'C', X_30[0]], [r0, 'D', X_30[1]]].forEach(function (s) {
      if (n <= 2) A.mover(s[0].g, s[2], yb(7), 0, FZ_SUMA / FZ, 0);
      else A.mover(s[0].g, xc(s[1]), yRes, 0, 1, llega3 ? 1600 : 0);
      A.ver(s[0].t, n >= 3 && n !== 5, d(llega3 ? 1200 : n === 5 || n === 6 ? 500 : 0));
    });

    /* ── El 2 que se olvida ── */
    A.ver(mal.dos, n === 5, d(n === 5 ? 1000 : 0));
    A.ver(mal.ocho, n === 5, d(n === 5 ? 1000 : 0));
    A.ver(error.caja, n === 5, d(n === 5 ? 1000 : 0));
    A.ver(error.sin, n === 5, d(n === 5 ? 1300 : 0));
    A.ver(error.faltan, n === 5, d(n === 5 ? 1500 : 0));
  }

  function marcador(n, antes) {
    var adelante = n > antes;
    return [
      { cifra: '43 × 7', palabras: '¿cuántas hojas en total?' },
      { cifra: '7 × 3 = 21', palabras: 'escribo 1, llevo 2' },
      { cifra: '7 × 4 = 28', palabras: 'siete veces 4' },
      { cifra: '28 + 2 = 30', palabras: 'con el 2 que se llevaba' },
      { cifra: '43 × 7 = 301', palabras: 'en tres renglones' },
      { cifra: '281', palabras: 'si se olvida el 2', salto: adelante ? '−20' : '' },
      { cifra: '301', palabras: 'hojas, justas' }
    ][n];
  }

  AnimacionMision.montar('#amCopias', {
    vista: [ANCHO, ALTO],
    describe: 'Siete renglones de 43 en cuadrícula, uno por cada hoja de la guía, que se suman columna por columna y se juntan en la multiplicación 43 × 7.',
    pasos: FIN + 1,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return TEXTOS[n]; },
    boton: function (n) {
      return ['➕ Las unidades', '➕ Las decenas', '➕ Sumar el 2', '✂️ Hacerlo corto', '🤔 ¿Y si falta el 2?', '✅ Con el 2', '↺ Empezar otra vez'][n];
    },
    atajo: function () { return null; },
    marcador: marcador
  });
})();
