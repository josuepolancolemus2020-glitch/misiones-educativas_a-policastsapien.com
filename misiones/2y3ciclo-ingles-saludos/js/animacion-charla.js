/* ============================================================
   Animación de «Hello! Saludos y Presentarme» (Ruta de las
   Primeras Palabras)
   ------------------------------------------------------------
   La historia: llegó a la escuela una señora de fuera preguntando por
   la dirección. Marvin le dijo «hello», ella le sonrió y le contestó
   algo, y él se quedó parado: no supo decirle su nombre ni preguntarle
   el de ella. La señora siguió de largo. Con cuatro frases esa
   conversación sigue: saludar según la hora, decir el nombre, preguntar
   el de ella y preguntar cómo está.

   Lo que se dibuja: la entrada de la escuela, con el reloj de la pared
   y la puerta de la dirección; Marvin y la señora, cada uno con su
   globo; y abajo, las cuatro frases de la misión, cada una en su
   tarjeta. La primera vez Marvin no tiene ninguna: saluda, ella le
   pregunta el nombre, él se queda callado y ella se va. La segunda vez
   las va usando una por una, cada tarjeta se llena cuando la dice, y la
   conversación sigue hasta que la señora llega a la dirección.

   ⚠️ «Hello» no estuvo mal, y la frase lo dice: Marvin saluda bien. Lo
   que faltó fue lo que venía después.

   ⚠️ Lo que NO se dice, y a propósito. La prueba pregunta las demás
   frases de la misión (las de la tarde y la noche, las despedidas, las
   de cortesía), el registro, la /h/ y la th: aquí no sale ninguna. Y
   ningún número de la prueba: el reloj marca las 10.

   ⚠️ Una pieza tiene una sola demora. Cada globo va en dos envolturas
   (aparecer y quitarse), y la señora camina en la suya.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amCharla')) return;

  var ANCHO = 320, ALTO = 260;

  /* ── el dibujo ─────────────────────────────────────────────── */
  var SUELO = 178;
  /* El reloj de la pared, con las agujas en las 10 */
  var RELOJ = { x: 30, y: 30, r: 15 }, HORA = 10;
  /* La puerta de la dirección y su letrero */
  var PUERTA = { x: 10, y: 114, ancho: 34 };
  var LETRERO = { x: 2, y: 99, ancho: 52, alto: 12 };
  /* Marvin y la señora: el centro de cada uno */
  var MX = 124, LX = 254;
  var FUERA = 100;                              // lo que camina la señora para irse: sale del dibujo
  var A_PUERTA = PUERTA.x + PUERTA.ancho / 2 - LX;
  /* Los globos: la punta, justo encima de la cabeza de cada uno */
  var GLOBO_M = { cx: MX, abajo: 122, punta: 128, ancho: 128 };
  var GLOBO_L = { cx: LX, abajo: 106, punta: 112, ancho: 108 };
  var RENGLON = 14;
  /* Las cuatro tarjetas, de dos en dos */
  var CARTA = { ancho: 150, alto: 30, x: [8, 162], y: [190, 224] };

  /* ── el reloj de la escena ──────────────────────────────────── */
  var T1 = { hola: 300, ella: 1300, calla: 2600, quita: 3800, camina: 3900 };
  var T2 = { vuelve: 200, reloj: 1900, frase: 2300, ella: 3300 };
  var T3 = { frase: 400, carta3: 900, ella: 1800 };
  var T4 = { frase: 400, ella: 1400 };
  var T5 = { senala: 300, camina: 700 };

  /* Lo que dice cada uno, en orden. «cartas» son las tarjetas que se
     llenan con ese globo: una por renglón. */
  var DICHOS = [
    { k: 'hola', quien: 'M', lineas: ['Hello.'], cartas: [] },
    { k: 'pregunta', quien: 'L', lineas: ['Hello!', 'What’s your name?'], cartas: [] },
    { k: 'calla', quien: 'M', lineas: ['…'], cartas: [], calla: true },
    { k: 'saludo', quien: 'M', lineas: ['Good morning.'], cartas: [1] },
    { k: 'saludo-ella', quien: 'L', lineas: ['Good morning.'], cartas: [] },
    { k: 'nombres', quien: 'M', lineas: ['My name is Marvin.', 'What’s your name?'], cartas: [2, 3] },
    { k: 'nombre-ella', quien: 'L', lineas: ['I’m Rosa.'], cartas: [] },
    { k: 'como', quien: 'M', lineas: ['How are you?'], cartas: [4] },
    { k: 'como-ella', quien: 'L', lineas: ['Fine, thank you.'], cartas: [] }
  ];
  var CARTAS = [
    { n: 1, para: 'saludar según la hora', frase: 'Good morning' },
    { n: 2, para: 'decir tu nombre', frase: 'My name is…' },
    { n: 3, para: 'preguntar su nombre', frase: 'What’s your name?' },
    { n: 4, para: 'preguntar cómo está', frase: 'How are you?' }
  ];

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido || '';
    return n;
  }
  function origen(n, x, y) { n.style.transformOrigin = x + 'px ' + y + 'px'; }
  function r2(v) { return Math.round(v * 100) / 100; }

  /* Un globo con la punta hacia abajo, hacia la cabeza de quien habla */
  function globo(A, padre, G, lineas, calla, k, numerada) {
    var alto = 8 + lineas.length * RENGLON;
    var cx = G.cx, x0 = cx - G.ancho / 2, x1 = cx + G.ancho / 2, y1 = G.abajo, y0 = y1 - alto;
    A.el('path', { d: 'M' + (x0 + 5) + ' ' + y0 + ' L' + (x1 - 5) + ' ' + y0 + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + 5) +
      ' L' + x1 + ' ' + (y1 - 5) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - 5) + ' ' + y1 + ' L' + (cx + 5) + ' ' + y1 +
      ' L' + cx + ' ' + G.punta + ' L' + (cx - 5) + ' ' + y1 + ' L' + (x0 + 5) + ' ' + y1 + ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - 5) +
      ' L' + x0 + ' ' + (y0 + 5) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + 5) + ' ' + y0 + ' Z',
      'class': 'ch-globo' + (calla ? ' ch-calla' : ''), 'data-globo-caja': k }, padre);
    /* las frases numeradas van a la izquierda, detrás de su número */
    return lineas.map(function (l, i) {
      var t = numerada ? texto(A, padre, x0 + 21, y0 + 14 + i * RENGLON, 'ch-letra', 10.5, 'start', l)
        : texto(A, padre, cx, y0 + 14 + i * RENGLON, 'ch-letra', 11, 'middle', l);
      t.setAttribute('data-linea', i);
      return t;
    });
  }

  /* El número de la frase, en un círculo */
  function numero(A, padre, x, y, n, atributos) {
    var g = A.el('g', atributos || {}, padre);
    A.el('circle', { cx: x, cy: y, r: 6.5, 'class': 'ch-num' }, g);
    var t = texto(A, g, x, y + 3.6, 'ch-num-t', 9.5, 'middle', String(n));
    t.setAttribute('data-num-t', '');
    return g;
  }

  /* Marvin: uniforme de la escuela, camisa blanca y pantalón azul */
  function marvin(A, padre) {
    var g = A.el('g', { 'data-persona': 'M' }, padre);
    var x = MX;
    A.el('rect', { x: x - 6, y: SUELO - 13, width: 5, height: 13, rx: 1.5, 'class': 'ch-pantalon' }, g);
    A.el('rect', { x: x + 1, y: SUELO - 13, width: 5, height: 13, rx: 1.5, 'class': 'ch-pantalon' }, g);
    A.el('rect', { x: x - 9.5, y: SUELO - 29, width: 19, height: 19, rx: 3.5, 'class': 'ch-camisa', 'data-torso': '' }, g);
    /* el brazo que va a señalar la puerta, desde el hombro */
    P.brazo = A.el('g', { 'data-brazo': '' }, g);
    origen(P.brazo, x - 8, SUELO - 26);
    A.el('path', { d: 'M' + (x - 8) + ' ' + (SUELO - 26) + ' L' + (x - 11) + ' ' + (SUELO - 13), 'class': 'ch-brazo', 'data-brazo-linea': '' }, P.brazo);
    A.el('path', { d: 'M' + (x + 8) + ' ' + (SUELO - 26) + ' L' + (x + 11) + ' ' + (SUELO - 13), 'class': 'ch-brazo' }, g);
    A.el('circle', { cx: x, cy: SUELO - 37, r: 9, 'class': 'ch-piel-m', 'data-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 9) + ' ' + (SUELO - 38) + ' Q' + (x - 8) + ' ' + (SUELO - 48) + ' ' + x + ' ' + (SUELO - 47) +
      ' Q' + (x + 8) + ' ' + (SUELO - 48) + ' ' + (x + 9) + ' ' + (SUELO - 38) + ' Q' + x + ' ' + (SUELO - 43) + ' ' + (x - 9) + ' ' + (SUELO - 38) + ' Z', 'class': 'ch-pelo' }, g);
    A.el('circle', { cx: x - 3.2, cy: SUELO - 36, r: 1.2, 'class': 'ch-ojo' }, g);
    A.el('circle', { cx: x + 3.2, cy: SUELO - 36, r: 1.2, 'class': 'ch-ojo' }, g);
    return g;
  }

  /* La señora de fuera: vestido, moño y cartera. Camina en su propia
     envoltura. */
  function senora(A, padre) {
    var camina = A.el('g', { 'class': 'ch-camina', 'data-camina': '' }, padre);
    var g = A.el('g', { 'data-persona': 'L' }, camina);
    var x = LX;
    A.el('rect', { x: x - 5, y: SUELO - 9, width: 4, height: 9, 'class': 'ch-piel-l' }, g);
    A.el('rect', { x: x + 1, y: SUELO - 9, width: 4, height: 9, 'class': 'ch-piel-l' }, g);
    A.el('path', { d: 'M' + (x - 8) + ' ' + (SUELO - 42) + ' L' + (x + 8) + ' ' + (SUELO - 42) + ' L' + (x + 13) + ' ' + (SUELO - 8) +
      ' L' + (x - 13) + ' ' + (SUELO - 8) + ' Z', 'class': 'ch-vestido', 'data-torso': '' }, g);
    A.el('path', { d: 'M' + (x - 8) + ' ' + (SUELO - 40) + ' L' + (x - 12) + ' ' + (SUELO - 22), 'class': 'ch-brazo-l' }, g);
    A.el('path', { d: 'M' + (x + 8) + ' ' + (SUELO - 40) + ' L' + (x + 12) + ' ' + (SUELO - 22), 'class': 'ch-brazo-l' }, g);
    A.el('rect', { x: x + 10, y: SUELO - 24, width: 9, height: 8, rx: 1.5, 'class': 'ch-cartera' }, g);
    A.el('circle', { cx: x, cy: SUELO - 53, r: 9, 'class': 'ch-piel-l', 'data-cabeza': '' }, g);
    A.el('circle', { cx: x + 6, cy: SUELO - 62, r: 4.5, 'class': 'ch-pelo-l' }, g);
    A.el('path', { d: 'M' + (x - 9) + ' ' + (SUELO - 54) + ' Q' + (x - 8) + ' ' + (SUELO - 64) + ' ' + x + ' ' + (SUELO - 63) +
      ' Q' + (x + 8) + ' ' + (SUELO - 64) + ' ' + (x + 9) + ' ' + (SUELO - 54) + ' Q' + x + ' ' + (SUELO - 59) + ' ' + (x - 9) + ' ' + (SUELO - 54) + ' Z', 'class': 'ch-pelo-l' }, g);
    A.el('circle', { cx: x - 3.2, cy: SUELO - 52, r: 1.2, 'class': 'ch-ojo' }, g);
    A.el('circle', { cx: x + 3.2, cy: SUELO - 52, r: 1.2, 'class': 'ch-ojo' }, g);
    return camina;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    A.el('path', { d: 'M0 ' + SUELO + ' L' + ANCHO + ' ' + SUELO, 'class': 'ch-suelo', 'data-suelo': '' }, svg);

    /* ── el reloj de la pared ── */
    var rj = A.el('g', { 'data-reloj': '' }, svg);
    A.el('circle', { cx: RELOJ.x, cy: RELOJ.y, r: RELOJ.r, 'class': 'ch-reloj', 'data-reloj-cara': '' }, rj);
    for (var h = 0; h < 12; h++) {
      var a = h * Math.PI / 6;
      A.el('path', { d: 'M' + r2(RELOJ.x + Math.sin(a) * (RELOJ.r - 4)) + ' ' + r2(RELOJ.y - Math.cos(a) * (RELOJ.r - 4)) +
        ' L' + r2(RELOJ.x + Math.sin(a) * (RELOJ.r - 1.5)) + ' ' + r2(RELOJ.y - Math.cos(a) * (RELOJ.r - 1.5)), 'class': 'ch-raya' }, rj);
    }
    var ah = HORA * Math.PI / 6;
    A.el('path', { d: 'M' + RELOJ.x + ' ' + RELOJ.y + ' L' + r2(RELOJ.x + Math.sin(ah) * 8) + ' ' + r2(RELOJ.y - Math.cos(ah) * 8), 'class': 'ch-aguja-h', 'data-aguja': 'hora' }, rj);
    A.el('path', { d: 'M' + RELOJ.x + ' ' + RELOJ.y + ' L' + RELOJ.x + ' ' + (RELOJ.y - 12), 'class': 'ch-aguja-m', 'data-aguja': 'minuto' }, rj);
    A.el('circle', { cx: RELOJ.x, cy: RELOJ.y, r: 1.6, 'class': 'ch-eje' }, rj);
    P.horaTxt = texto(A, rj, RELOJ.x + RELOJ.r + 10, RELOJ.y + 4, 'am-rotulo', 11, 'start', HORA + ':00');
    P.horaTxt.setAttribute('data-hora', '');
    P.aro = A.el('circle', { cx: RELOJ.x, cy: RELOJ.y, r: RELOJ.r + 4.5, 'class': 'ch-aro', 'data-aro': '' }, svg);

    /* ── la puerta de la dirección ── */
    var pu = A.el('g', { 'data-puerta': '' }, svg);
    A.el('rect', { x: PUERTA.x, y: PUERTA.y, width: PUERTA.ancho, height: SUELO - PUERTA.y, rx: 1.5, 'class': 'ch-puerta', 'data-puerta-caja': '' }, pu);
    A.el('circle', { cx: PUERTA.x + PUERTA.ancho - 6, cy: PUERTA.y + 34, r: 1.8, 'class': 'ch-perilla' }, pu);
    A.el('rect', { x: LETRERO.x, y: LETRERO.y, width: LETRERO.ancho, height: LETRERO.alto, rx: 2, 'class': 'ch-letrero' }, pu);
    var lt = texto(A, pu, LETRERO.x + LETRERO.ancho / 2, LETRERO.y + 9.2, 'ch-letra', 9.5, 'middle', 'Dirección');
    lt.setAttribute('data-letrero', '');

    /* ── la señora y Marvin: Marvin va delante, y ella pasa por detrás ── */
    P.senora = senora(A, svg);
    P.marvin = marvin(A, svg);

    /* ── lo que dice cada uno ── */
    P.dichos = DICHOS.map(function (d) {
      var va = A.el('g', { 'data-dicho': d.k, 'data-quien': d.quien }, svg);
      var sale = A.el('g', { 'data-dicho-sale': d.k }, va);
      var G = d.quien === 'M' ? GLOBO_M : GLOBO_L;
      var lineas = globo(A, sale, G, d.lineas, d.calla, d.k, d.cartas.length > 0);
      /* el número de cada una de las cuatro frases, delante de su renglón */
      d.cartas.forEach(function (n, i) {
        var t = lineas[i];
        numero(A, sale, G.cx - G.ancho / 2 + 11, Number(t.getAttribute('y')) - 3.8, n, { 'data-num': n });
      });
      return { d: d, va: va, sale: sale };
    });

    /* ── las cuatro frases de la misión, cada una en su tarjeta ── */
    P.cartas = CARTAS.map(function (c, i) {
      var x = CARTA.x[i % 2], y = CARTA.y[Math.floor(i / 2)];
      var g = A.el('g', { 'data-carta': c.n }, svg);
      var vacia = A.el('g', { 'data-carta-vacia': c.n }, g);
      A.el('rect', { x: x, y: y, width: CARTA.ancho, height: CARTA.alto, rx: 4, 'class': 'ch-carta ch-carta-vacia', 'data-carta-caja': 'vacia' }, vacia);
      numero(A, vacia, x + 12, y + CARTA.alto / 2, c.n);
      texto(A, vacia, x + 24, y + 11, 'ch-para', 9.5, 'start', c.para).setAttribute('data-para', '');
      texto(A, vacia, x + 24, y + 25.5, 'ch-falta', 11, 'start', '?').setAttribute('data-falta', '');
      var llena = A.el('g', { 'data-carta-llena': c.n }, g);
      A.el('rect', { x: x, y: y, width: CARTA.ancho, height: CARTA.alto, rx: 4, 'class': 'ch-carta', 'data-carta-caja': 'llena' }, llena);
      numero(A, llena, x + 12, y + CARTA.alto / 2, c.n);
      texto(A, llena, x + 24, y + 11, 'ch-para', 9.5, 'start', c.para).setAttribute('data-para', '');
      texto(A, llena, x + 24, y + 25.5, 'ch-letra', 11, 'start', c.frase).setAttribute('data-frase', '');
      return { c: c, vacia: vacia, llena: llena };
    });
  }

  /* ── los estados ───────────────────────────────────────────── */

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    var lista = [P.senora, P.brazo, P.aro];
    P.dichos.forEach(function (d) { lista.push(d.va, d.sale); });
    P.cartas.forEach(function (c) { lista.push(c.vacia, c.llena); });
    return lista;
  }
  function dicho(k) { return P.dichos.filter(function (d) { return d.d.k === k; })[0]; }
  function carta(n) { return P.cartas[n - 1]; }

  /* El estado al TERMINAR cada paso. ella: dónde está la señora (aquí,
     fuera o en la puerta); globos: los que se ven; llenas: cuántas de las
     cuatro tarjetas se llenaron; aro: el reloj marcado; senala: Marvin
     señala la puerta. */
  var ESTADOS = [
    { ella: 'aqui', globos: [], llenas: 0, aro: false, senala: false },
    { ella: 'fuera', globos: ['calla'], llenas: 0, aro: false, senala: false },
    { ella: 'aqui', globos: ['saludo', 'saludo-ella'], llenas: 1, aro: true, senala: false },
    { ella: 'aqui', globos: ['nombres', 'nombre-ella'], llenas: 3, aro: false, senala: false },
    { ella: 'aqui', globos: ['como', 'como-ella'], llenas: 4, aro: false, senala: false },
    { ella: 'puerta', globos: [], llenas: 4, aro: false, senala: true }
  ];
  var DONDE = { aqui: 0, fuera: FUERA, puerta: A_PUERTA };

  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.mover(P.senora, DONDE[s.ella], 0, 0, 1, 0);
      A.mover(P.brazo, 0, 0, s.senala ? 85 : 0, 1, 0);
      A.ver(P.aro, s.aro, 0);
      P.dichos.forEach(function (d) { A.ver(d.va, true, 0); A.ver(d.sale, s.globos.indexOf(d.d.k) >= 0, 0); });
      P.cartas.forEach(function (c) { A.ver(c.llena, c.c.n <= s.llenas, 0); A.ver(c.vacia, c.c.n > s.llenas, 0); });
    });
  }
  function dice(k, demora) { A_.ver(dicho(k).sale, true, demora); }
  function quita(k, demora) { A_.ver(dicho(k).va, false, demora); }
  function llena(n, demora) { A_.ver(carta(n).llena, true, demora); A_.ver(carta(n).vacia, false, demora); }
  var A_ = null;

  function pintar(n, antes, A) {
    A_ = A;
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan cada vez que se ENTRA
       en ellos, también volviendo con «Atrás»; el 0 y el 5 se pintan
       siempre, también en el primer pintado. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 5) {
      if (antes !== 4) { base(A, ESTADOS[5]); return; }
      base(A, ESTADOS[4]);
      /* los globos se van; Marvin señala la puerta y la señora camina
         hasta ella, por detrás de él */
      quita('como', 0);
      quita('como-ella', 0);
      A.mover(P.brazo, 0, 0, 85, 1, T5.senala);
      A.mover(P.senora, A_PUERTA, 0, 0, 1, T5.camina);
      return;
    }
    if (n === 1) {
      base(A, ESTADOS[0]);
      /* así pasó: él saluda, ella contesta y le pregunta el nombre, él se
         queda callado y ella sigue de largo */
      dice('hola', T1.hola);
      dice('pregunta', T1.ella);
      quita('hola', T1.calla);
      dice('calla', T1.calla + 400);
      quita('pregunta', T1.quita);
      A.mover(P.senora, FUERA, 0, 0, 1, T1.camina);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      /* otra vez: ella vuelve, y la primera frase saluda según la hora */
      quita('calla', 0);
      A.mover(P.senora, 0, 0, 0, 1, T2.vuelve);
      A.ver(P.aro, true, T2.reloj);
      dice('saludo', T2.frase);
      llena(1, T2.frase);
      dice('saludo-ella', T2.ella);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      A.ver(P.aro, false, 0);
      quita('saludo', 0);
      quita('saludo-ella', 0);
      dice('nombres', T3.frase);
      llena(2, T3.frase);
      llena(3, T3.carta3);
      dice('nombre-ella', T3.ella);
      return;
    }
    /* el 4: la cuarta pregunta cómo está */
    base(A, ESTADOS[3]);
    quita('nombres', 0);
    quita('nombre-ella', 0);
    dice('como', T4.frase);
    llena(4, T4.frase);
    dice('como-ella', T4.ella);
  }

  var FRASES = [
    'Llega una señora de fuera buscando la dirección, y Marvin solo sabe decir «hello». Antes de tocar, piensa: ¿qué le falta decir para que ella no se vaya?',
    'Así pasó: Marvin saluda bien, ella le contesta y le pregunta su nombre, y él se queda callado. Ella sigue de largo a buscar a alguien más.',
    'Otra vez, con las cuatro frases. La primera saluda según la hora: son las 10 de la mañana, así que es «Good morning».',
    'La segunda dice su nombre, y la tercera le pregunta el de ella. Ella contesta, y la conversación sigue.',
    'La cuarta pregunta cómo está. Ya van las cuatro, y la señora no se ha ido.',
    'Con las cuatro frases la conversación siguió, y la señora llegó a la dirección. ¿A quién vas a saludar hoy en inglés con las cuatro?'
  ];
  var BOTONES = ['💬 Así pasó', '🕙 Otra vez', '🙋 Los nombres', '💬 ¿Cómo está?', '🚪 A la dirección', '↺ Empezar otra vez'];
  var MARCADOR = [['0', 'de las cuatro frases'], ['0', 'de las cuatro frases, y se va'], ['1', 'de las cuatro frases'],
    ['3', 'de las cuatro frases'], ['4', 'de las cuatro frases'], ['4', 'frases, y llegó a la dirección']];

  AnimacionMision.montar('#amCharla', {
    vista: [ANCHO, ALTO],
    describe: 'La entrada de la escuela, con el reloj en las 10 de la mañana y la puerta de la dirección. La primera vez, Marvin solo dice «hello», se queda callado y la señora se va. La segunda, usa las cuatro frases de la misión, cada una en su tarjeta, y la señora llega a la dirección.',
    pasos: 6,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
