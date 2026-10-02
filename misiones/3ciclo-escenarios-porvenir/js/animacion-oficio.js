/* ============================================================
   Animación de «Escenarios por venir»
   (Ruta de la Máquina que Aprende, etapa 7)
   ------------------------------------------------------------
   La historia: Katy termina noveno. En el grupo del colegio le dicen
   «estudiá computación, que es el futuro» y «no estudiés eso, la máquina lo
   va a hacer todo». Las dos suenan seguras y ninguna le dice qué hacer.
   Nadie le hizo la pregunta que sirve: de qué tareas está hecho un oficio.

   Lo que se dibuja: arriba, los dos mensajes del grupo y Katy. Debajo, la
   carpeta de un oficio de verdad, el de don Beto, que lleva las cuentas de
   la cooperativa. Se abre y adentro hay siete tareas. La máquina se lleva
   cuatro, una va a medias y dos se quedan con él. La que más dice es la de
   fiar: los números dicen que no, y don Beto sabe que ese hombre paga
   siempre.

   ⚠️ Las tareas NO se escriben aquí: se leen de js/data/ia-futuros.js, con
   su veredicto, que es el mismo archivo que pinta la misión y arma la ficha.
   Las cuentas de las frases y del marcador también salen de ahí. Si mañana
   cambia una tarea, la animación cambia con ella, y la sonda compara cada
   tarjeta con el archivo.

   ⚠️ Lo que se afirma es de HOY, no del futuro. La misión no predice: mira
   lo que la máquina ya hace. Por eso a «lo va a hacer todo» no se le pone
   una ✗, que sería contestar una profecía con otra: se le pone «hoy, no».

   ⚠️ Lo que NO se dice, y a propósito: ni las cuatro clases de tarea ni las
   capacidades ni lo que ya hacía una computadora normal (son pareados de la
   prueba), ni con qué se lleva la máquina cada tarea (lo enseña la tarjeta
   de abajo), ni la cuenta de los ocho oficios, ni nada de la escuela.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amOficio')) return;
  /* Sin el archivo de datos no hay tareas que enseñar: se queda la frase de
     reserva, que dice lo mismo en un párrafo. */
  if (typeof IA_OFICIOS === 'undefined') return;
  var OFICIO = IA_OFICIOS.filter(function (o) { return o.k === 'cuentas'; })[0];
  if (!OFICIO) return;

  var ANCHO = 320, ALTO = 248;

  /* Lo que le dicen a Katy en el grupo, tal cual lo cuenta la historia (la
     sonda lo compara con la tarjeta de la historia). El ancho va impuesto
     con textLength, medido con la Fredoka: así «todo», que se subraya en el
     paso 4, cae en su sitio aunque la letra todavía no haya llegado. */
  var VOZ1 = { texto: 'Estudiá computación, que es el futuro.', ancho: 172.3 };
  var VOZ2 = { antes: 'No estudiés eso, la máquina lo va a hacer', ancho: 184.6, espacio: 2.4,
               todo: 'todo.', anchoTodo: 23.1, palabraTodo: 20.9 };

  /* ── el dibujo ─────────────────────────────────────────────── */
  var GLOBO = { x: 8, ys: [15, 36], alto: 17, pad: 6, tam: 10 };
  var CAB = { x: 8, y: 10.5, tam: 8.5 };
  var KATY = { x: 297, y: 20 };
  var PESTANA = { x: 8, y: 62, ancho: 228, alto: 16 };
  var CARPETA = { x: 4, y: 77, ancho: 312, alto: 167 };
  /* Una tarjeta por tarea, en un renglón: con la letra de 10 la tarea más
     larga mide 185 y la tarjeta deja 212, con el signo de quién se la queda
     al final. Entre grupo y grupo va un hueco de más, para que se cuenten. */
  var CARTA = { x: 10, ancho: 212, alto: 16, tam: 10, paso: 21, y0: 84, hueco: 10, signo: 202 };
  var GUIA = { x: 228, letra: 234, tam: 9.5, renglon: 12 };
  /* Lo que el informe se corre a la derecha mientras espera: fuera del
     renglón de las demás, sin salirse de la carpeta. */
  var APARTE = 92;
  var CUADERNO = { x0: 8, x1: 274, y0: 5, y1: 56, tam: 9.5, renglones: [19, 34, 49] };

  /* ── el reloj de la escena ──────────────────────────────────── */
  var T1 = { tapa: 0, primera: 400, cada: 260 };
  var T2 = { primera: 200, cada: 300, mueve: 300, sube: 800, guia: 1000 };
  var T3 = { vuelve: 0, medias: 800, guiaMedias: 1000, primera: 1400, cada: 300, guia: 800 };
  var T4 = { aro: 200, raya: 800, dice: 1100 };
  var T5 = { cuaderno: 400 };

  /* ── las tareas, con su veredicto ──────────────────────────────
     y1: su lugar en el orden del archivo. y2: su lugar ya repartido,
     primero lo que se lleva la máquina, después lo que va a medias y al
     final lo que se queda con don Beto, cada grupo en el orden del archivo. */
  var ORDEN = ['si', 'medias', 'no'];
  var SIGNO = { si: '🤖', medias: '🤝', no: '🧑' };
  var TAREAS = OFICIO.tareas.map(function (t, i) {
    return { t: t.t, maquina: t.maquina, porque: t.porque, y1: CARTA.y0 + CARTA.paso * i };
  });
  var GRUPOS = [];
  (function () {
    var y = CARTA.y0;
    ORDEN.forEach(function (v) {
      var del = TAREAS.filter(function (c) { return c.maquina === v; });
      if (!del.length) return;
      if (GRUPOS.length) y += CARTA.hueco - (CARTA.paso - CARTA.alto);
      del.forEach(function (c) { c.y2 = y; y += CARTA.paso; });
      GRUPOS.push({ v: v, del: del, y0: del[0].y2, y1: del[del.length - 1].y2 + CARTA.alto });
    });
  })();
  var cuantas = function (v) { return TAREAS.filter(function (c) { return c.maquina === v; }).length; };
  var N = { total: TAREAS.length, si: cuantas('si'), medias: cuantas('medias'), no: cuantas('no') };
  /* La tarea que se rodea en el paso 4: la primera que se queda con don
     Beto. La frase de ese paso es su «por qué», leído del archivo. */
  var FIAR = TAREAS.filter(function (c) { return c.maquina === 'no'; })[0];

  /* Los números de las frases, con su palabra. Van en femenino: cuentan tareas. */
  var PALABRA = ['ninguna', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
  var dice = function (n) { return PALABRA[n] || String(n); };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }

  /* Una tarjeta, en cuatro piezas, porque se mueve de tres maneras y una
     pieza tiene una sola demora: `fila` la lleva a su lugar ya repartido,
     `aparte` corre al informe mientras espera, y `ver` la hace aparecer al
     abrir la carpeta. */
  function carta(A, svg, c, i) {
    var lugar = A.el('g', { transform: 'translate(' + CARTA.x + ' ' + c.y1 + ')' }, svg);
    var fila = A.el('g', { 'data-tarea': String(i) }, lugar);
    var aparte = A.el('g', {}, fila);
    var ver = A.el('g', {}, aparte);
    A.el('rect', { x: 0, y: 0, width: CARTA.ancho, height: CARTA.alto, rx: 3, 'class': 'of-carta', 'data-carta': '' }, ver);
    /* el tinte de quién se la queda; el informe lleva la mitad de cada uno */
    var tinte = A.el('g', { 'data-tinte': c.maquina }, ver);
    if (c.maquina === 'medias') {
      A.el('rect', { x: 0, y: 0, width: CARTA.ancho / 2, height: CARTA.alto, rx: 3, 'class': 'of-tinte-maq' }, tinte);
      A.el('rect', { x: CARTA.ancho / 2, y: 0, width: CARTA.ancho / 2, height: CARTA.alto, rx: 3, 'class': 'of-tinte-beto' }, tinte);
    } else {
      A.el('rect', { x: 0, y: 0, width: CARTA.ancho, height: CARTA.alto, rx: 3,
                     'class': c.maquina === 'si' ? 'of-tinte-maq' : 'of-tinte-beto' }, tinte);
    }
    texto(A, ver, 6, 11.6, 'of-letra', CARTA.tam, 'start', c.t).setAttribute('data-carta-dice', '');
    var signo = texto(A, ver, CARTA.signo, 12, 'of-signo', 10, 'middle', SIGNO[c.maquina]);
    signo.setAttribute('data-signo', c.maquina);
    var espera = null;
    if (c.maquina === 'medias') {
      espera = texto(A, ver, CARTA.signo, 12, 'of-espera', 11, 'middle', '?');
      espera.setAttribute('data-signo', 'espera');
    }
    return { c: c, fila: fila, aparte: aparte, ver: ver, tinte: tinte, signo: signo, espera: espera };
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── lo que le dicen en el grupo ──
       Sin cola, a propósito: los dos mensajes llegan del grupo, y una cola
       apuntando a Katy diría que los dijo ella. */
    P.voces = A.el('g', { 'data-voces': '' }, svg);
    texto(A, P.voces, CAB.x, CAB.y, 'am-rotulo', CAB.tam, 'start', '👥 En el grupo del colegio').setAttribute('data-voces-cab', '');
    [VOZ1.ancho, VOZ2.ancho + VOZ2.espacio + VOZ2.anchoTodo].forEach(function (w, j) {
      A.el('rect', { x: GLOBO.x, y: GLOBO.ys[j], width: w + 2 * GLOBO.pad, height: GLOBO.alto, rx: 7,
                     'class': 'of-globo', 'data-globo': String(j) }, P.voces);
    });
    var bx = GLOBO.x + GLOBO.pad;
    var v1 = texto(A, P.voces, bx, GLOBO.ys[0] + 12, 'of-letra', GLOBO.tam, 'start', VOZ1.texto);
    v1.setAttribute('textLength', VOZ1.ancho); v1.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    v1.setAttribute('data-voz', '0');
    var v2 = texto(A, P.voces, bx, GLOBO.ys[1] + 12, 'of-letra', GLOBO.tam, 'start', VOZ2.antes);
    v2.setAttribute('textLength', VOZ2.ancho); v2.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    v2.setAttribute('data-voz', '1');
    var xTodo = bx + VOZ2.ancho + VOZ2.espacio;
    var vt = texto(A, P.voces, xTodo, GLOBO.ys[1] + 12, 'of-letra', GLOBO.tam, 'start', VOZ2.todo);
    vt.setAttribute('textLength', VOZ2.anchoTodo); vt.setAttribute('lengthAdjust', 'spacingAndGlyphs');
    vt.setAttribute('data-voz-todo', '');

    /* «todo», subrayado con raya cortada, y lo que se le contesta: hoy, no. */
    P.raya = A.el('path', { d: 'M' + xTodo + ' ' + (GLOBO.ys[1] + 14.5) + ' L' + (xTodo + VOZ2.palabraTodo) + ' ' + (GLOBO.ys[1] + 14.5),
                            'class': 'of-raya-todo', 'data-todo-raya': '' }, svg);
    P.hoy = texto(A, svg, GLOBO.x + VOZ2.ancho + VOZ2.espacio + VOZ2.anchoTodo + 2 * GLOBO.pad + 6, GLOBO.ys[1] + 12,
                  'am-rotulo', 9.5, 'start', 'hoy, no');
    P.hoy.setAttribute('data-todo-hoy', '');

    /* ── Katy, con su teléfono ── */
    P.katy = A.el('g', { 'data-katy': '' }, svg);
    A.el('ellipse', { cx: KATY.x + 7, cy: KATY.y + 3, rx: 3, ry: 6, 'class': 'of-pelo' }, P.katy);
    A.el('circle', { cx: KATY.x, cy: KATY.y - 1.5, r: 8, 'class': 'of-pelo' }, P.katy);
    A.el('circle', { cx: KATY.x, cy: KATY.y + 1, r: 6.5, 'class': 'of-piel' }, P.katy);
    A.el('path', { d: 'M' + (KATY.x - 11) + ' 54 L' + (KATY.x - 10) + ' 37 Q' + KATY.x + ' 29 ' + (KATY.x + 10) +
                   ' 37 L' + (KATY.x + 11) + ' 54 Z', 'class': 'of-blusa' }, P.katy);
    A.el('rect', { x: KATY.x - 4, y: 37, width: 8, height: 12, rx: 1.5, 'class': 'of-telefono' }, P.katy);
    texto(A, P.katy, KATY.x, 64, 'am-rotulo', 9, 'middle', 'Katy').setAttribute('data-katy-dice', '');

    /* ── la carpeta del oficio ──
       El cuerpo va antes que la pestaña: así la pestaña le tapa el borde de
       arriba y las dos son una sola carpeta. Por eso la pestaña no cierra su
       trazo por abajo: sería la raya entre las dos. */
    A.el('rect', { x: CARPETA.x, y: CARPETA.y, width: CARPETA.ancho, height: CARPETA.alto, rx: 6,
                   'class': 'of-carpeta', 'data-carpeta': '' }, svg);
    var pe = PESTANA;
    A.el('path', { d: 'M' + pe.x + ' ' + (pe.y + pe.alto) + ' L' + pe.x + ' ' + (pe.y + 4) + ' Q' + pe.x + ' ' + pe.y + ' ' + (pe.x + 4) + ' ' + pe.y +
                   ' L' + (pe.x + pe.ancho - 4) + ' ' + pe.y + ' Q' + (pe.x + pe.ancho) + ' ' + pe.y + ' ' + (pe.x + pe.ancho) + ' ' + (pe.y + 4) +
                   ' L' + (pe.x + pe.ancho) + ' ' + (pe.y + pe.alto), 'class': 'of-pestana', 'data-pestana': '' }, svg);
    texto(A, svg, pe.x + 6, pe.y + 12.5, 'of-letra', 10, 'start', OFICIO.e);
    texto(A, svg, pe.x + 20, pe.y + 12.5, 'of-letra', 10, 'start', OFICIO.nombre).setAttribute('data-oficio-nombre', '');

    /* ── las tarjetas: una por tarea ──
       ⚠️ La que va a medias se dibuja la ÚLTIMA. Al apartarse cruza por
       encima de dos tarjetas, y dibujada en su orden pasaba por DEBAJO de
       ellas: parecía que se metía en la carpeta. Al final de cada paso no se
       notaba; se vio en las fotos a medio viaje. */
    var orden = TAREAS.map(function (c, i) { return i; }).sort(function (a, b) {
      return ((TAREAS[a].maquina === 'medias') - (TAREAS[b].maquina === 'medias')) || (a - b);
    });
    P.cartas = [];
    orden.forEach(function (i) { P.cartas[i] = carta(A, svg, TAREAS[i], i); });

    /* ── la llave de cada grupo y lo que dice ── */
    var DICE = { si: ['🤖 se las lleva', 'la máquina'], medias: ['🤝 a medias'], no: ['🧑 le quedan', 'a ' + OFICIO.quien] };
    P.guias = {};
    GRUPOS.forEach(function (gr) {
      var g = A.el('g', { 'data-guia': gr.v }, svg);
      var a = gr.y0 + 1.5, b = gr.y1 - 1.5, m = (gr.y0 + gr.y1) / 2;
      A.el('path', { d: 'M' + (GUIA.x - 4) + ' ' + a + ' L' + GUIA.x + ' ' + a + ' L' + GUIA.x + ' ' + b + ' L' + (GUIA.x - 4) + ' ' + b +
                     ' M' + GUIA.x + ' ' + m + ' L' + (GUIA.x + 3) + ' ' + m, 'class': 'of-llave', 'data-llave': '' }, g);
      var renglones = DICE[gr.v];
      var y0 = m + 3.5 - GUIA.renglon * (renglones.length - 1) / 2;
      renglones.forEach(function (r, j) {
        texto(A, g, GUIA.letra, y0 + GUIA.renglon * j, 'of-guia', GUIA.tam, 'start', r).setAttribute('data-guia-dice', '');
      });
      P.guias[gr.v] = g;
    });

    /* ── la tapa de la carpeta cerrada, con su «?» ──
       Va encima de las tarjetas: al abrirla se apaga y las deja ver. */
    P.tapa = A.el('g', { 'data-tapa': '' }, svg);
    A.el('rect', { x: CARPETA.x + 4, y: CARPETA.y + 4, width: CARPETA.ancho - 8, height: CARPETA.alto - 8, rx: 5,
                   'class': 'of-tapa', 'data-tapa-caja': '' }, P.tapa);
    texto(A, P.tapa, ANCHO / 2, 170, 'of-tapa-q', 40, 'middle', '?').setAttribute('data-tapa-q', '');
    texto(A, P.tapa, ANCHO / 2, 200, 'of-tapa-n', 13, 'middle', OFICIO.quien).setAttribute('data-tapa-quien', '');

    /* ── el aro de la tarea que la máquina no tiene cómo hacer ── */
    P.aro = A.el('rect', { x: CARTA.x - 3, y: FIAR.y2 - 2.5, width: CARTA.ancho + 6, height: CARTA.alto + 5, rx: 5,
                           'class': 'of-aro', 'data-aro': '' }, svg);

    /* ── el cuaderno del final, en el lugar de los mensajes ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUADERNO.x0, y: CUADERNO.y0, width: CUADERNO.x1 - CUADERNO.x0, height: CUADERNO.y1 - CUADERNO.y0, rx: 6,
                   'class': 'of-cuaderno', 'data-cuaderno-caja': '' }, P.cuaderno);
    [['Un oficio que te guste:', 116], ['Tres de sus tareas:', 100], ['¿Cuáles se lleva la máquina?', 143]].forEach(function (r, j) {
      var y = CUADERNO.renglones[j];
      texto(A, P.cuaderno, 16, y, 'of-letra', CUADERNO.tam, 'start', r[0]);
      A.el('path', { d: 'M' + r[1] + ' ' + (y + 1) + ' L' + (CUADERNO.x1 - 8) + ' ' + (y + 1), 'class': 'of-renglon', 'data-raya-escribir': '' }, P.cuaderno);
    });
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso. abierta: si ya se abrió la carpeta;
     maq: si ya se ve lo que se lleva la máquina (y entonces las tarjetas
     están repartidas); aparte: si el informe espera corrido; medias y beto:
     si ya se ve lo que va a medias y lo que se queda; aro: si se rodea la
     de fiar y se le contesta a «todo»; cuaderno: si sale el cuaderno. */
  var ESTADOS = [
    { abierta: false, maq: false, aparte: false, medias: false, beto: false, aro: false, cuaderno: false },
    { abierta: true, maq: false, aparte: false, medias: false, beto: false, aro: false, cuaderno: false },
    { abierta: true, maq: true, aparte: true, medias: false, beto: false, aro: false, cuaderno: false },
    { abierta: true, maq: true, aparte: false, medias: true, beto: true, aro: false, cuaderno: false },
    { abierta: true, maq: true, aparte: false, medias: true, beto: true, aro: true, cuaderno: false },
    { abierta: true, maq: true, aparte: false, medias: true, beto: true, aro: true, cuaderno: true }
  ];

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function todo() {
    var lista = [P.voces, P.raya, P.hoy, P.tapa, P.aro, P.cuaderno];
    P.cartas.forEach(function (k) {
      lista.push(k.fila, k.aparte, k.ver, k.tinte, k.signo);
      if (k.espera) lista.push(k.espera);
    });
    Object.keys(P.guias).forEach(function (v) { lista.push(P.guias[v]); });
    return lista;
  }
  /* Repartidas: cada tarjeta en su grupo. Si no, en el orden del archivo. */
  function repartir(A, si, demora) {
    P.cartas.forEach(function (k) { A.mover(k.fila, 0, si ? k.c.y2 - k.c.y1 : 0, 0, 1, demora(k)); });
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.ver(P.tapa, !s.abierta, 0);
      repartir(A, s.maq, function () { return 0; });
      P.cartas.forEach(function (k) {
        var v = k.c.maquina;
        A.ver(k.ver, s.abierta, 0);
        A.mover(k.aparte, v === 'medias' && s.aparte ? APARTE : 0, 0, 0, 1, 0);
        var hecho = v === 'si' ? s.maq : (v === 'medias' ? s.medias : s.beto);
        A.ver(k.tinte, hecho, 0);
        A.ver(k.signo, hecho, 0);
        if (k.espera) A.ver(k.espera, s.aparte, 0);
      });
      A.ver(P.guias.si, s.maq, 0);
      if (P.guias.medias) A.ver(P.guias.medias, s.medias, 0);
      if (P.guias.no) A.ver(P.guias.no, s.beto, 0);
      A.ver(P.aro, s.aro, 0);
      A.ver(P.raya, s.aro && !s.cuaderno, 0);
      A.ver(P.hoy, s.aro && !s.cuaderno, 0);
      A.ver(P.voces, !s.cuaderno, 0);
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 4) se cuentan cada vez que se ENTRA en
       ellos, también volviendo con «Atrás»; el 0 y el 5 se pintan siempre. */
    if (n >= 1 && n <= 4 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 5) {
      if (antes !== 4) { base(A, ESTADOS[5]); return; }
      base(A, ESTADOS[4]);
      A.ver(P.voces, false, 0);
      A.ver(P.raya, false, 0);
      A.ver(P.hoy, false, 0);
      A.ver(P.cuaderno, true, T5.cuaderno);
      return;
    }
    if (n === 1) {
      /* se abre la carpeta y salen las tareas, una por una */
      base(A, ESTADOS[0]);
      A.ver(P.tapa, false, T1.tapa);
      P.cartas.forEach(function (k, i) { A.ver(k.ver, true, T1.primera + T1.cada * i); });
      return;
    }
    if (n === 2) {
      /* la máquina se lleva las suyas, una por una; el informe se corre a
         esperar y las demás se juntan arriba */
      base(A, ESTADOS[1]);
      var maq = P.cartas.filter(function (k) { return k.c.maquina === 'si'; });
      maq.forEach(function (k, j) {
        A.ver(k.tinte, true, T2.primera + T2.cada * j);
        A.ver(k.signo, true, T2.primera + T2.cada * j);
      });
      var tras = T2.primera + T2.cada * maq.length;
      P.cartas.forEach(function (k) {
        if (k.c.maquina === 'medias') {
          A.mover(k.aparte, APARTE, 0, 0, 1, tras + T2.mueve);
          A.ver(k.espera, true, tras + T2.mueve);
        }
      });
      repartir(A, true, function (k) { return k.c.maquina === 'si' ? tras + T2.sube : tras + T2.mueve; });
      A.ver(P.guias.si, true, tras + T2.sube + T2.guia);
      return;
    }
    if (n === 3) {
      /* el informe vuelve a su renglón, a medias; y lo que queda, con él */
      base(A, ESTADOS[2]);
      P.cartas.forEach(function (k) {
        if (k.c.maquina !== 'medias') return;
        A.mover(k.aparte, 0, 0, 0, 1, T3.vuelve);
        A.ver(k.espera, false, T3.vuelve);
        A.ver(k.tinte, true, T3.medias);
        A.ver(k.signo, true, T3.medias);
      });
      if (P.guias.medias) A.ver(P.guias.medias, true, T3.guiaMedias);
      var suyas = P.cartas.filter(function (k) { return k.c.maquina === 'no'; });
      suyas.forEach(function (k, j) {
        A.ver(k.tinte, true, T3.primera + T3.cada * j);
        A.ver(k.signo, true, T3.primera + T3.cada * j);
      });
      if (P.guias.no) A.ver(P.guias.no, true, T3.primera + T3.cada * suyas.length + T3.guia);
      return;
    }
    base(A, ESTADOS[3]);
    A.ver(P.aro, true, T4.aro);
    A.ver(P.raya, true, T4.raya);
    A.ver(P.hoy, true, T4.dice);
  }

  var FRASES = [
    'A Katy le dicen dos cosas, y las dos hablan del oficio como si fuera una sola cosa. ¿Qué hay adentro?',
    'Abramos uno: el de ' + OFICIO.quien + ', que lleva las cuentas de la cooperativa. Adentro hay ' + dice(N.total) + ' tareas distintas.',
    'La máquina se lleva ' + dice(N.si) + ': sumar las facturas, pasar los números, avisar quién debe y sacar el impuesto. El informe espera.',
    'El informe va a medias: lo escribe la máquina, pero los números y la revisión son de ' + OFICIO.quien + '. Y le quedan ' + dice(N.no) + '.',
    '¿Todo? Hoy, no. ¿Se le fía al que tuvo un mal año? ' + FIAR.porque,
    'Ahora vos: elegí un oficio que te guste y escribí tres de sus tareas. ¿Cuáles se lleva la máquina?'
  ];
  var BOTONES = ['📂 Abrir el oficio', '🤖 ¿Cuáles se lleva?', '🤝 ¿Y las otras?', '🧑 ¿Por qué esas no?', '✍️ ¿Y vos?', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['?', 'tareas adentro'],
    [String(N.total), 'tareas en el oficio de ' + OFICIO.quien],
    [String(N.si), 'se las lleva la máquina'],
    [String(N.no), 'le quedan a ' + OFICIO.quien + ', y ' + N.medias + ' a medias'],
    [String(N.no), 'tareas que hoy no hace la máquina'],
    ['3', 'tareas de tu oficio, en tu cuaderno']
  ];

  AnimacionMision.montar('#amOficio', {
    vista: [ANCHO, ALTO],
    describe: 'A Katy le dicen dos cosas sobre un oficio, como si fuera una sola cosa. Adentro del de ' + OFICIO.quien +
      ', que lleva las cuentas de la cooperativa, hay ' + dice(N.total) + ' tareas: la máquina se lleva ' + dice(N.si) +
      ', una va a medias y ' + dice(N.no) + ' se quedan con él. Hoy no lo hace todo.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
