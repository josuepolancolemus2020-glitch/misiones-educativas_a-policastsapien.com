/* ============================================================
   M.E.T.A.S · Variables: las Cajitas de Memoria · La hoja que se comió los goles
   ------------------------------------------------------------
   La escena de la animación que va después de la historia: a Marvin lo
   pusieron a llevar el marcador del partido en una hoja; cada gol, borraba
   el número y escribía el nuevo. Ganaron 3 a 2, y cuando el maestro
   preguntó en qué minuto había caído cada gol, no quedaba nada que mirar.
   La historia dice que esa hoja se portó como una variable: guarda un solo
   valor a la vez, y el que entra borra al que estaba; y que si después te
   van a preguntar por lo de antes, hay que anotar cada valor, uno debajo
   del otro. Eso es lo que se ve aquí. El aparato (botones, frase,
   marcador) vive en js/animacion-mision.js; aquí solo está el dibujo y
   dónde va cada pieza en cada paso.

   Arriba, la hoja de Marvin con dos números (el de la escuela y el del
   rival) y el reloj del partido. Mientras se juega, la hoja va grande; en
   la otra forma se achica para dejarle sitio a la lista.

     0  la hoja en 0 a 0, antes de empezar: ¿qué quedará escrito al final?;
     1  el partido corre en el reloj; cada gol sale en su letrero, con su
        minuto, y en la hoja el número nuevo se come al que estaba.
        Terminan 3 a 2;
     2  el maestro pregunta en qué minuto cayó cada gol: en la hoja solo
        queda el 3 a 2, y los cinco goles se quedan con su «?»;
     3  otra forma, desde el principio: además de la hoja, una lista. Cada
        gol, una línea nueva debajo de la otra, con el minuto y cómo van;
     4  la hoja se sigue comiendo lo de antes, pero la lista no borra nada:
        cada gol recibe su minuto;
     5  la hoja dice cómo van ahora; la lista, gol por gol. Y la pregunta
        es del alumno: algo que cambie hoy en su casa, anotado cada vez.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **El número que entra se come al que estaba, a la vista.** Cada
      número es su propia pieza: el nuevo baja desde arriba del recuadro
      cuando cae el gol que lo hace, y empuja al de antes hasta sacarlo por
      abajo, como en un marcador de los de antes. Los dos se mueven juntos
      y dentro del recuadro (un recorte), así nunca se leen encimados; a
      medio cambio, primero se probó que el viejo se encogiera mientras el
      nuevo crecía, y los dos se leían revueltos. Al final del partido en
      la hoja no hay nada más que el 3 a 2.
   2. ⚠️ **Los goles caen cuando el reloj llega a su minuto.** El reloj
      corre a paso parejo, y cada gol (el número de la hoja, el letrero con
      su minuto y, en la otra forma, la línea de la lista) sale justo
      cuando el reloj pasa por ahí. El letrero se va un poco ANTES de que
      salga el del gol siguiente, porque van en el mismo sitio y cruzándose
      se leían encimados; el del último gol, un momento después de que
      termina el partido. Tampoco se queda.
   3. ⚠️ **La lista no le quita nada a la hoja.** En la otra forma la hoja
      se sigue portando igual (un número por equipo, y el nuevo se come al
      de antes); lo que cambia es que al lado queda escrito cada gol. Eso
      es lo que la misión llama tabla de valores, sin nombrarlo aquí.
   4. ⚠️ **Lo que pregunta la prueba no se dice.** Ni variable, ni cajita,
      ni valor, ni ninguna instrucción de la misión (GUARDA, SUMA, RESTA,
      MUESTRA), ni contador, acumulador, trazar, nombre u orden: la
      animación habla de la hoja, del número y de la lista, como la
      historia. El nombre de lo que se ve lo dan las tarjetas de abajo.
   5. **Nada se dice solo con color.** En la lista va en negrita el número
      del equipo que anotó; la pregunta sin respuesta es un «?», y la
      respuesta, el minuto escrito.
   6. **Cada paso que cuenta una historia la cuenta cada vez que se entra
      en él**, también volviendo con «Atrás»: el partido vuelve a empezar
      desde el 0 a 0.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amGoles')) return;

  var ANCHO = 320, ALTO = 272;

  /* ── el partido ─────────────────────────────────────────── */
  var MINUTOS = 40;                 // lo que dura el partido de la escuela
  var MS_MIN = 130;                 // lo que tarda un minuto en el reloj: entre gol y gol da para leer el letrero
  var GOLES = [
    { m: 6, e: 'escuela' },
    { m: 13, e: 'rival' },
    { m: 22, e: 'escuela' },
    { m: 29, e: 'rival' },
    { m: 37, e: 'escuela' }
  ];
  var EQUIPOS = ['escuela', 'rival'];
  /* Cómo van después de cada gol: se cuenta, no se escribe. */
  var VAN = [];
  (function () {
    var c = { escuela: 0, rival: 0 };
    GOLES.forEach(function (g) { c[g.e]++; VAN.push({ escuela: c.escuela, rival: c.rival }); });
  })();
  var FINAL = VAN[VAN.length - 1];

  /* ── la hoja de Marvin (dibujada desde su esquina) ──────── */
  var HOJA = { x: 6, y: 6, w: 144, h: 106 };
  var CAJA = { escuela: { x: 10, y: 22 }, rival: { x: 78, y: 22 } };
  var CW = 56, CH = 52;
  var GRANDE = 1.45;                // mientras se juega, sin la lista al lado

  /* ── la lista ──────────────────────────────────────────── */
  var LISTA = { x: 6, y: 122, w: 144, h: 144 };
  var COL = { minuto: 34, escuela: 82, rival: 124 };
  var FILA0 = 174, PASO_FILA = 18;

  /* ── el reloj, el letrero, el maestro y los goles ──────── */
  var RELOJ = { x: 282, y: 36, r: 24 };
  var LETRERO = { x: 176, y: 212, w: 120, h: 36 };     // en la otra forma, abajo a la derecha
  var LETRERO_1 = { dx: -126, dy: -8 };                 // mientras se juega, debajo de la hoja grande
  var BAL_X0 = 180, BAL_PASO = 26, BAL_Y = 118;         // junto a la lista
  var BALONES_2 = { dx: -156, dy: 80 };                 // debajo de la hoja grande
  var CABEZA = { x: 296, y: 190, r: 9 };
  var GLOBO = { x: 164, y: 164, w: 108, h: 42 };

  var D1 = 300, D3 = 800;           // cuándo arranca el partido en los pasos 1 y 3
  var SE_VA_ANTES = 250;            // el letrero de un gol se va antes de que salga el del siguiente
  var QUEDA_AL_FINAL = 500;         // y el del último gol, un momento después de que termina el partido
  var NB = ' ';

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }

  /* Un balón, con el centro en (0, 0). */
  function balon(A, padre, r) {
    var g = A.el('g', { 'data-dibujo': 'balon' }, padre);
    A.el('circle', { cx: 0, cy: 0, r: r, 'class': 'vg-balon' }, g);
    var p = '', k = r * 0.42;
    for (var i = 0; i < 5; i++) {
      var a = -Math.PI / 2 + i * 2 * Math.PI / 5;
      p += (i ? ' L' : 'M') + r2(Math.cos(a) * k) + ' ' + r2(Math.sin(a) * k);
    }
    A.el('path', { d: p + ' Z', 'class': 'vg-balon-parche' }, g);
    return g;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── la hoja de Marvin y sus dos números ──────────────── */
    var pos = A.el('g', { transform: 'translate(' + HOJA.x + ' ' + HOJA.y + ')' }, svg);
    P.hoja = A.el('g', { 'data-hoja': '' }, pos);
    A.el('rect', { x: 0, y: 0, width: HOJA.w, height: HOJA.h, rx: 4, 'class': 'vg-papel' }, P.hoja);
    texto(A, P.hoja, HOJA.w / 2, 15, 'vg-papel-tit', 9.5, 'middle', 'la hoja de Marvin').setAttribute('data-titulo', 'hoja');
    /* Cada número entra por arriba y empuja al de antes hacia abajo, como
       en un marcador de los de antes: los dos se mueven juntos y dentro de
       su recuadro, así nunca se leen encimados. */
    var defs = A.el('defs', {}, svg);
    P.numeros = [];
    EQUIPOS.forEach(function (e) {
      var c = CAJA[e];
      A.el('rect', { x: c.x, y: c.y, width: CW, height: CH, rx: 7, 'class': 'vg-caja', 'data-caja': e }, P.hoja);
      A.el('rect', { x: c.x + 4, y: 80, width: CW - 8, height: 16, rx: 4, 'class': 'vg-nombre-barra' }, P.hoja);
      texto(A, P.hoja, c.x + CW / 2, 91.5, 'vg-nombre', 9.5, 'middle', e).setAttribute('data-nombre', e);
      var recorte = A.el('clipPath', { id: 'amGoles-recorte-' + e }, defs);
      A.el('rect', { x: c.x + 2, y: c.y + 2, width: CW - 4, height: CH - 4, rx: 5 }, recorte);
      var dentro = A.el('g', { 'clip-path': 'url(#amGoles-recorte-' + e + ')' }, P.hoja);
      for (var v = 0; v <= FINAL[e]; v++) {
        var base = A.el('g', { transform: 'translate(' + (c.x + CW / 2) + ' ' + (c.y + CH / 2) + ')' }, dentro);
        var sale = A.el('g', { 'data-num': e, 'data-vale': v }, base);
        var va = A.el('g', { 'data-va': '' }, sale);
        texto(A, va, 0, 10.5, 'vg-num', 30, 'middle', String(v));
        P.numeros.push({ e: e, v: v, sale: sale, va: va });
      }
    });

    /* ── el reloj del partido ─────────────────────────────── */
    var reloj = A.el('g', { 'data-reloj': '' }, svg);
    A.el('circle', { cx: RELOJ.x, cy: RELOJ.y, r: RELOJ.r, 'class': 'vg-reloj' }, reloj);
    var ru = RELOJ.r / 2;
    P.uso = A.el('circle', { cx: RELOJ.x, cy: RELOJ.y, r: ru, 'class': 'vg-uso', 'stroke-width': RELOJ.r,
      transform: 'rotate(-90 ' + RELOJ.x + ' ' + RELOJ.y + ')', 'data-uso': '' }, reloj);
    P.largoUso = 2 * Math.PI * ru;
    P.uso.style.strokeDasharray = r2(P.largoUso) + ' ' + r2(P.largoUso);
    P.uso.style.strokeDashoffset = String(r2(P.largoUso));
    for (var h = 0; h < 8; h++) {
      var a = h * Math.PI / 4, co = Math.cos(a), si = Math.sin(a), r0 = RELOJ.r - (h % 2 ? 3 : 5);
      A.el('path', { d: 'M' + r2(RELOJ.x + si * r0) + ' ' + r2(RELOJ.y - co * r0) + ' L' + r2(RELOJ.x + si * RELOJ.r) + ' ' + r2(RELOJ.y - co * RELOJ.r),
        'class': 'vg-reloj-marca' }, reloj);
    }
    A.el('circle', { cx: RELOJ.x, cy: RELOJ.y, r: RELOJ.r, 'class': 'vg-reloj-borde' }, reloj);
    texto(A, svg, RELOJ.x, RELOJ.y + RELOJ.r + 14, 'am-rotulo', 9.5, 'middle', 'el partido').setAttribute('data-rotulo', 'partido');

    /* ── el letrero de cada gol ───────────────────────────── */
    P.letreros = A.el('g', { 'data-letreros': '' }, svg);
    P.etiquetas = GOLES.map(function (g, i) {
      var sale = A.el('g', { 'data-etiqueta': i + 1 }, P.letreros);
      var va = A.el('g', { 'data-va': '' }, sale);
      A.el('rect', { x: LETRERO.x, y: LETRERO.y, width: LETRERO.w, height: LETRERO.h, rx: 12, 'class': 'vg-etiqueta' }, va);
      var b = A.el('g', { transform: 'translate(' + (LETRERO.x + 19) + ' ' + (LETRERO.y + LETRERO.h / 2) + ')' }, va);
      balon(A, b, 10);
      texto(A, va, LETRERO.x + 35, LETRERO.y + 23.5, 'vg-etiqueta-txt', 15, 'start', 'minuto ' + g.m).setAttribute('data-minuto', g.m);
      return { sale: sale, va: va };
    });

    /* ── la lista ─────────────────────────────────────────── */
    P.lista = A.el('g', { 'data-lista': '' }, svg);
    A.el('rect', { x: LISTA.x, y: LISTA.y, width: LISTA.w, height: LISTA.h, rx: 4, 'class': 'vg-papel' }, P.lista);
    texto(A, P.lista, LISTA.x + LISTA.w / 2, 137, 'vg-papel-tit', 9.5, 'middle', 'la lista de Marvin').setAttribute('data-titulo', 'lista');
    ['minuto', 'escuela', 'rival'].forEach(function (c) {
      texto(A, P.lista, COL[c], 154, 'vg-enc', 9, 'middle', c).setAttribute('data-enc', c);
    });
    A.el('path', { d: 'M14 159 H142', 'class': 'vg-raya' }, P.lista);
    A.el('path', { d: 'M58 146 V254 M104 146 V254', 'class': 'vg-raya' }, P.lista);
    P.filas = GOLES.map(function (g, i) {
      var f = A.el('g', { 'data-fila': i + 1 }, P.lista);
      var y = FILA0 + i * PASO_FILA;
      texto(A, f, COL.minuto, y, 'vg-celda', 11, 'middle', String(g.m)).setAttribute('data-col', 'minuto');
      EQUIPOS.forEach(function (e) {
        texto(A, f, COL[e], y, 'vg-celda' + (g.e === e ? ' vg-celda-gol' : ''), 11, 'middle', String(VAN[i][e])).setAttribute('data-col', e);
      });
      return f;
    });

    /* ── los cinco goles, con su «?» o su minuto ──────────── */
    P.balonesPos = A.el('g', { 'data-balones-pos': '' }, svg);
    P.balones = A.el('g', { 'data-balones': '' }, P.balonesPos);
    P.dudas = [];
    P.minutos = [];
    GOLES.forEach(function (g, i) {
      var x = BAL_X0 + i * BAL_PASO;
      var gb = A.el('g', { 'data-balon': i + 1 }, P.balones);
      texto(A, gb, x, BAL_Y - 14, 'am-rotulo', 9, 'middle', (i + 1) + '.º').setAttribute('data-ordinal', i + 1);
      var bb = A.el('g', { transform: 'translate(' + x + ' ' + BAL_Y + ')' }, gb);
      balon(A, bb, 8);
      var du = texto(A, gb, x, BAL_Y + 27, 'am-rotulo vg-duda', 14, 'middle', '?');
      du.setAttribute('data-duda', i + 1);
      var mi = texto(A, gb, x, BAL_Y + 27, 'am-rotulo vg-minuto', 13, 'middle', String(g.m));
      mi.setAttribute('data-min', i + 1);
      P.dudas.push(du);
      P.minutos.push(mi);
    });

    /* ── el maestro y su pregunta ─────────────────────────── */
    P.maestro = A.el('g', { 'data-maestro': '' }, svg);
    var cx = CABEZA.x;
    A.el('rect', { x: cx - 6, y: 234, width: 5, height: 28, rx: 2, 'class': 'vg-pantalon' }, P.maestro);
    A.el('rect', { x: cx + 1, y: 234, width: 5, height: 28, rx: 2, 'class': 'vg-pantalon' }, P.maestro);
    A.el('path', { d: 'M' + (cx + 9) + ' 206 L' + (cx + 16) + ' 192', 'class': 'vg-brazo' }, P.maestro);
    A.el('circle', { cx: cx + 16.5, cy: 189.5, r: 2.8, 'class': 'vg-piel' }, P.maestro);
    A.el('rect', { x: cx - 9, y: 200, width: 18, height: 36, rx: 5, 'class': 'vg-camisa' }, P.maestro);
    A.el('circle', { cx: cx, cy: CABEZA.y, r: CABEZA.r, 'class': 'vg-piel', 'data-cabeza': '' }, P.maestro);
    A.el('path', { d: 'M' + (cx - 9) + ' ' + (CABEZA.y - 1) + ' Q' + cx + ' ' + (CABEZA.y - 15) + ' ' + (cx + 9) + ' ' + (CABEZA.y - 1)
      + ' Q' + cx + ' ' + (CABEZA.y - 7) + ' ' + (cx - 9) + ' ' + (CABEZA.y - 1) + ' Z', 'class': 'vg-pelo' }, P.maestro);
    /* El globo sale de la cabeza del maestro: la cola se pinta ENCIMA del
       borde del globo, con su relleno tapando ese pedazo de borde, así el
       globo y la cola se leen como una sola pieza. */
    P.globo = A.el('g', { 'data-globo': '' }, svg);
    var gx = GLOBO.x + GLOBO.w, gy = GLOBO.y + GLOBO.h / 2, punta = cx - CABEZA.r - 1;
    A.el('rect', { x: GLOBO.x, y: GLOBO.y, width: GLOBO.w, height: GLOBO.h, rx: 9, 'class': 'vg-globo' }, P.globo);
    A.el('path', { d: 'M' + (gx - 1.5) + ' ' + (gy - 6.5) + ' L' + punta + ' ' + CABEZA.y + ' L' + (gx - 1.5) + ' ' + (gy + 4.5) + ' Z', 'class': 'vg-globo-relleno' }, P.globo);
    A.el('path', { d: 'M' + gx + ' ' + (gy - 6) + ' L' + punta + ' ' + CABEZA.y + ' L' + gx + ' ' + (gy + 4), 'class': 'vg-globo-borde', 'data-cola': '' }, P.globo);
    texto(A, P.globo, GLOBO.x + GLOBO.w / 2, GLOBO.y + 17, 'vg-globo-txt', 11, 'middle', '¿En qué minuto').setAttribute('data-dice', '1');
    texto(A, P.globo, GLOBO.x + GLOBO.w / 2, GLOBO.y + 33, 'vg-globo-txt', 11, 'middle', 'cayó cada gol?').setAttribute('data-dice', '2');

    /* ── lo que se marca al final ────────────────────────── */
    P.aroMinutos = A.el('rect', { x: 13, y: 143, width: 42, height: 111, rx: 7, 'class': 'vg-aro', 'data-aro': 'minutos' }, svg);
    P.aroHoja = A.el('rect', { x: 11, y: 24, width: 134, height: 83, rx: 8, 'class': 'vg-aro', 'data-aro': 'hoja' }, svg);
    P.aroLista = A.el('rect', { x: 10, y: 143, width: 136, height: 111, rx: 8, 'class': 'vg-aro', 'data-aro': 'lista' }, svg);
    P.rotAhora = A.el('g', { 'data-rotulo-g': 'ahora' }, svg);
    A.el('path', { d: 'M146 44 L162 44', 'class': 'vg-union' }, P.rotAhora);
    texto(A, P.rotAhora, 165, 47.5, 'am-rotulo', 10, 'start', 'solo lo de ahora').setAttribute('data-rotulo', 'ahora');
    P.rotGol = A.el('g', { 'data-rotulo-g': 'gol' }, svg);
    A.el('path', { d: 'M147 198 L162 198', 'class': 'vg-union' }, P.rotGol);
    texto(A, P.rotGol, 165, 201.5, 'am-rotulo', 10, 'start', 'gol por gol').setAttribute('data-rotulo', 'gol');
  }

  /* ── dónde va cada pieza ────────────────────────────────── */

  /* Cuándo cae cada gol, si el partido arranca en d0. */
  function cae(d0, m) { return d0 + m * MS_MIN; }

  /* De golpe, sin movimiento: así la escena se vuelve a ver entera cada
     vez que se entra en su paso, también volviendo con «Atrás». */
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  /* Un número: el que llega baja desde arriba del recuadro (sale), y el
     que se va sigue bajando hasta salirse por abajo (va). */
  function llega(A, n, si, d) { A.ver(n.sale, si, d); A.mover(n.sale, 0, si ? 0 : -CH, 0, 1, d); }
  function queda(A, n, si, d) { A.ver(n.va, si, d); A.mover(n.va, 0, si ? 0 : CH, 0, 1, d); }

  /* La hoja antes de empezar: 0 a 0, y los demás números esperando. */
  function hojaEnCero(A) {
    P.numeros.forEach(function (n) { llega(A, n, n.v === 0, 0); queda(A, n, true, 0); });
  }
  /* La hoja al terminar: 3 a 2, y los de antes ya comidos. */
  function hojaAlFinal(A) {
    P.numeros.forEach(function (n) { llega(A, n, true, 0); queda(A, n, n.v === FINAL[n.e], 0); });
  }
  function letrerosFuera(A) {
    P.etiquetas.forEach(function (t) { A.ver(t.sale, false, 0); A.ver(t.va, true, 0); });
  }
  function reloj(A, minutos, d, dur) {
    P.uso.style.setProperty('--dur', Math.round(dur || 0) + 'ms');
    P.uso.style.setProperty('--d', Math.round(d || 0) + 'ms');
    P.uso.style.strokeDashoffset = String(r2(P.largoUso * (1 - minutos / MINUTOS)));
    P.uso.setAttribute('data-min', minutos);
  }
  function filas(A, si, demora) {
    P.filas.forEach(function (f, i) { A.ver(f, si, demora ? demora(i) : 0); });
  }
  function todoLoQueCorre() {
    return P.numeros.reduce(function (l, n) { return l.concat([n.sale, n.va]); }, [P.uso, P.letreros, P.balonesPos])
      .concat(P.etiquetas.reduce(function (l, t) { return l.concat([t.sale, t.va]); }, []), P.filas);
  }
  /* Dónde van el letrero y los balones: debajo de la hoja grande mientras
     no está la lista, y a la derecha cuando está. Se mudan escondidos. */
  function lugares(A, conLista) {
    A.mover(P.letreros, conLista ? 0 : LETRERO_1.dx, conLista ? 0 : LETRERO_1.dy, 0, 1, 0);
    A.mover(P.balonesPos, conLista ? 0 : BALONES_2.dx, conLista ? 0 : BALONES_2.dy, 0, 1, 0);
  }

  /* El partido, desde d0: el reloj corre parejo y cada gol cae en su
     minuto. En la hoja, el número nuevo aparece y el de antes se va en
     ese mismo momento; el letrero del gol dura hasta el gol siguiente. */
  function partido(A, d0) {
    reloj(A, MINUTOS, d0, MINUTOS * MS_MIN);
    var cuandoLlega = {}, cuandoSeVa = {};
    GOLES.forEach(function (g, i) {
      var t = cae(d0, g.m), v = VAN[i][g.e];
      cuandoLlega[g.e + v] = t;
      cuandoSeVa[g.e + (v - 1)] = t;
    });
    P.numeros.forEach(function (n) {
      var k = n.e + n.v;
      if (n.v > 0) llega(A, n, true, cuandoLlega[k]);
      if (cuandoSeVa[k] != null) queda(A, n, false, cuandoSeVa[k]);
    });
    /* El letrero se va un poco ANTES del gol siguiente: los dos van en el
       mismo sitio, y cruzándose se leían encimados. */
    GOLES.forEach(function (g, i) {
      var fin = i + 1 < GOLES.length ? cae(d0, GOLES[i + 1].m) - SE_VA_ANTES : cae(d0, MINUTOS) + QUEDA_AL_FINAL;
      A.ver(P.etiquetas[i].sale, true, cae(d0, g.m));
      A.ver(P.etiquetas[i].va, false, fin);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };

    /* Primero lo que corre: desde el 0 a 0 (el paso 0, y el partido cada
       vez que se entra en el paso 1 o en el 3), o el partido ya terminado
       (2, 4 y 5: si se llegó con el partido todavía corriendo, se adelanta
       al final). Va ANTES que lo demás: lo que se deja de golpe no puede
       llevarse por delante la demora de lo que tiene que esperar. */
    if (n === 0 || entra(1) || entra(3)) {
      deGolpe(A, todoLoQueCorre(), function () {
        hojaEnCero(A); letrerosFuera(A); reloj(A, 0, 0, 0); filas(A, false); lugares(A, n === 3);
      });
      if (n === 1) partido(A, D1);
      if (n === 3) {
        partido(A, D3);
        filas(A, true, function (i) { return cae(D3, GOLES[i].m); });
      }
    } else if (n !== 1 && n !== 3 && antes !== n) {
      deGolpe(A, todoLoQueCorre(), function () {
        hojaAlFinal(A); letrerosFuera(A); reloj(A, MINUTOS, 0, 0); filas(A, n >= 3); lugares(A, n >= 3);
      });
    }

    /* La hoja va grande mientras no está la lista. */
    A.mover(P.hoja, 0, 0, 0, n <= 2 ? GRANDE : 1, 0);
    A.ver(P.lista, n >= 3, 0);
    A.ver(P.maestro, n === 2 || n === 4, n === 2 || n === 4 ? 200 : 0);
    A.ver(P.globo, n === 2 || n === 4, n === 2 || n === 4 ? 450 : 0);
    A.ver(P.balones, n === 2 || n >= 4, n === 2 || n === 4 ? 700 : 0);
    P.dudas.forEach(function (d) { A.ver(d, n === 2, 0); });
    P.minutos.forEach(function (m, i) { A.ver(m, n >= 4, n === 4 && antes === 3 ? 1100 + i * 250 : 0); });
    A.ver(P.aroMinutos, n === 4, n === 4 ? 800 : 0);
    A.ver(P.aroHoja, n === 5, n === 5 ? 200 : 0);
    A.ver(P.rotAhora, n === 5, n === 5 ? 200 : 0);
    A.ver(P.aroLista, n === 5, n === 5 ? 500 : 0);
    A.ver(P.rotGol, n === 5, n === 5 ? 500 : 0);
  }

  var FRASES = [
    'Marvin lleva la cuenta del partido en su hoja: un número para la escuela y otro para el rival. ¿Qué quedará escrito al final?',
    'Cada gol, borra el número y escribe el nuevo: el que entra se come al que estaba. Terminan 3' + NB + 'a' + NB + '2.',
    'El maestro pregunta en qué minuto cayó cada gol. En la hoja solo queda el 3' + NB + 'a' + NB + '2: lo de antes ya no está.',
    'Otra forma, desde el principio: además de la hoja, Marvin lleva una lista. En cada gol escribe una línea nueva, debajo de la otra: el minuto y cómo van.',
    'La hoja se sigue comiendo lo de antes, pero la lista no borra nada: ahí está el minuto de cada gol.',
    'La hoja dice solo cómo van ahora; la lista lo dice gol por gol. ¿Qué cambia hoy en tu casa? Anótalo cada vez, con la hora.'
  ];
  var BOTONES = ['⚽ Que empiece', '🙋 La pregunta', '📋 Otra forma', '🔍 La respuesta', '📝 Tu turno', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['0' + NB + 'a' + NB + '0', 'en la hoja de Marvin'],
    [FINAL.escuela + NB + 'a' + NB + FINAL.rival, 'en la hoja: lo de antes, borrado'],
    ['0', 'de ' + GOLES.length + ' goles con su minuto'],
    [String(GOLES.length), 'líneas en la lista, una por gol'],
    [String(GOLES.length), 'de ' + GOLES.length + ' goles con su minuto'],
    [String(GOLES.length), 'goles con su minuto, en la lista']
  ];

  AnimacionMision.montar('#amGoles', {
    vista: [ANCHO, ALTO],
    describe: 'Arriba, la hoja de Marvin con un número para la escuela y otro para el rival, y el reloj del partido; abajo, una lista con el minuto de cada gol.',
    pasos: 6,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
