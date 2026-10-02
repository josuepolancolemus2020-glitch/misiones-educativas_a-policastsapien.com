/* ============================================================
   Animación de «¿De qué está hecho el mundo?»
   (Ruta de la Raíz, Filosofía, etapa 3)
   ------------------------------------------------------------
   La historia: el abuelo le dejó el machete a Elvin. Hace años le
   cambiaron el mango; el verano pasado, la hoja. Su hermana dice que ese
   ya no es el machete del abuelo, que del de él no queda nada, y que le
   toca la mitad. Llevan tres semanas sin hablarse por una pregunta que
   ninguno sabe contestar: ¿sigue siendo el mismo machete?

   Lo que se dibuja: el mismo machete en tres momentos, uno debajo del
   otro: como lo dejó el abuelo, hace años y el verano pasado. Cada pedazo
   que viene del abuelo lleva su sello 👴. Así se ve lo que asombra: en cada
   cambio se quedó un pedazo, y aun así del primero al de hoy no queda
   ninguno. La hermana cuenta los sellos del de hoy; Elvin sigue cada
   cambio. Abajo están los dos, y entre ellos, las tres semanas.

   ⚠️ La escena NO contesta la pregunta. Los casos de «¿sigue siendo el
   mismo?» no tienen una sola respuesta buena (MUN_IDENTIDAD_OJO), y la
   misión lo dice. Nadie lleva ✓ ni ✗: cada uno dice lo suyo «para él» o
   «para ella», y el final le pide al alumno su regla.

   ⚠️ No se nombra ninguna clase de cambio, ni la palabra con que la prueba
   llama a lo que hace que algo siga siendo lo mismo, ni nada de lo que
   pregunta el examen: la escena dice lo de la historia.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amMachete')) return;

  var ANCHO = 320, ALTO = 240;

  /* ── los tres momentos del machete, uno debajo del otro ── */
  var X0 = 88;                              /* donde empieza el mango */
  var FILAS = [32, 74, 116];                /* el centro de cada machete */
  var PASO_FILA = FILAS[1] - FILAS[0];
  var CUANDO = ['el abuelo', 'hace años', 'el verano pasado'];
  /* Qué pedazo trae cada momento. El primero es el del abuelo; en el
     segundo se fue su mango; en el tercero, su hoja. «va» es el pedazo que
     se cae al llegar ese momento y «viene» el que llega en su lugar. */
  var PIEZAS = [
    [{ k: 'mango', de: 'abuelo' }, { k: 'hoja', de: 'abuelo' }],
    [{ k: 'mango', de: 'abuelo', vuelo: 'va' }, { k: 'mango', de: 'nuevo', vuelo: 'viene' }, { k: 'hoja', de: 'abuelo' }],
    [{ k: 'mango', de: 'nuevo' }, { k: 'hoja', de: 'abuelo', vuelo: 'va' }, { k: 'hoja', de: 'nuevo', vuelo: 'viene' }]
  ];
  var CAE = 18;       /* lo que baja el pedazo que se va */
  var ENTRA = 18;     /* desde cuán arriba baja el que llega */
  var SELLO = { r: 7.5, tam: 10, mango: 31, hoja: 140, hojaY: 3 };
  var HUECO = { x0: X0 - 2, x1: X0 + 224, arriba: 9, abajo: 15 };

  /* ── la hermana, Elvin y lo que dice cada uno ── */
  var GENTE = {
    elvin: { x: 40, cara: '👦', nombre: 'Elvin' },
    hermana: { x: 280, cara: '👧', nombre: 'su hermana' }
  };
  var CARA = { y: 222, tam: 22, nombre: 235 };
  var GLOBOS = {
    elvin: { x0: 8, x1: 156, cola: [34, 48], punta: [40, 199], dice: ['Es el del abuelo:', 'nunca hubo otro.'] },
    hermana: { x0: 164, x1: 312, cola: [272, 286], punta: [280, 199], dice: ['Ya no es el del abuelo.', 'Me toca la mitad.'] }
  };
  var GLOBO = { y0: 142, y1: 176, r: 8, renglones: [156, 170], letra: 9.5 };

  /* ── lo que mira la hermana: el de hoy; lo que mira Elvin: cada cambio ── */
  var ARO = { x0: X0 - 6, x1: X0 + 228, y0: FILAS[2] - 12, y1: FILAS[2] + 17, hoy: 294 };
  var LAZOS = [
    { k: 'hoja', de: 0, x: X0 + SELLO.hoja, dice: 'la misma hoja' },
    { k: 'mango', de: 1, x: X0 + SELLO.mango, dice: 'el mismo mango' }
  ];

  /* ── las tres semanas, entre los dos ── */
  var CAL = { x0: 120, x1: 200, y0: 184, y1: 227, dia: 8, paso: 10, filas: [193, 204, 215], dias: 7, dice: 236 };

  /* ── el cuaderno del final ── */
  var CUADERNO = { x0: 14, x1: 306, y0: 140, y1: 234 };

  /* ── el reloj de la escena ── */
  var VIAJE = 800, APAGA = 500;
  var T1 = { cae: 1000, apaga: 300, viene: 1900 };
  var T3 = { globo: 0, aro: 700 };
  var T4 = { globo: 0, lazo: 700, entre: 600 };
  var T5 = { cal: 200, semana: 700, entre: 450 };
  var T6 = { cuaderno: 500 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }
  /* Un pedazo del machete en su fila. La hoja es larga, con el lomo derecho
     y el filo que se abre hacia la punta; el mango, de madera, con sus dos
     remaches. El del abuelo es el gastado y lleva su sello 👴; el nuevo no
     lleva ninguno. Lo que se mueve y lo que se apaga son dos envolturas:
     una pieza tiene una sola demora. */
  function pieza(A, padre, Y, p) {
    var g = A.el('g', { 'data-pieza': p.k, 'data-de': p.de }, padre);
    var mueve = A.el('g', { 'data-pieza-mueve': '' }, g);
    var ve = A.el('g', { 'data-pieza-ve': '' }, mueve);
    var viejo = p.de === 'abuelo';
    if (p.k === 'hoja') {
      A.el('path', { d: 'M' + (X0 + 62) + ' ' + (Y - 6) + ' L' + (X0 + 206) + ' ' + (Y - 6) +
                     ' Q' + (X0 + 222) + ' ' + (Y - 6) + ' ' + (X0 + 222) + ' ' + (Y + 1) +
                     ' Q' + (X0 + 221) + ' ' + (Y + 9) + ' ' + (X0 + 206) + ' ' + (Y + 12) +
                     ' L' + (X0 + 62) + ' ' + (Y + 7) + ' Z',
                     'class': viejo ? 'mh-hoja-abuelo' : 'mh-hoja-nueva', 'data-cuerpo': '' }, ve);
      A.el('path', { d: 'M' + (X0 + 66) + ' ' + (Y + 5.4) + ' L' + (X0 + 204) + ' ' + (Y + 10.2), 'class': 'mh-filo' }, ve);
      if (viejo) {
        A.el('path', { d: 'M' + (X0 + 92) + ' ' + (Y - 2) + ' L' + (X0 + 104) + ' ' + (Y + 1) +
                       ' M' + (X0 + 174) + ' ' + (Y - 1) + ' L' + (X0 + 186) + ' ' + (Y + 2), 'class': 'mh-rayon' }, ve);
      }
    } else {
      A.el('rect', { x: X0, y: Y - 7, width: 62, height: 14, rx: 5,
                     'class': viejo ? 'mh-mango-abuelo' : 'mh-mango-nuevo', 'data-cuerpo': '' }, ve);
      A.el('circle', { cx: X0 + 11, cy: Y, r: 1.8, 'class': 'mh-remache' }, ve);
      A.el('circle', { cx: X0 + 51, cy: Y, r: 1.8, 'class': 'mh-remache' }, ve);
    }
    if (viejo) {
      var cx = X0 + (p.k === 'hoja' ? SELLO.hoja : SELLO.mango), cy = Y + (p.k === 'hoja' ? SELLO.hojaY : 0);
      var s = A.el('g', { 'data-sello': '' }, ve);
      A.el('circle', { cx: cx, cy: cy, r: SELLO.r, 'class': 'mh-sello' }, s);
      texto(A, s, cx, cy + 3.6, 'mh-emoji', SELLO.tam, 'middle', '👴');
    }
    return { g: g, mueve: mueve, ve: ve, k: p.k, de: p.de, vuelo: p.vuelo || null };
  }
  /* El globo de cada uno, con su cola hasta la cabeza: un solo trazo. */
  function globo(G) {
    var x0 = G.x0, x1 = G.x1, y0 = GLOBO.y0, y1 = GLOBO.y1, r = GLOBO.r;
    return 'M' + (x0 + r) + ' ' + y0 + ' L' + (x1 - r) + ' ' + y0 + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + r) +
      ' L' + x1 + ' ' + (y1 - r) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - r) + ' ' + y1 +
      ' L' + G.cola[1] + ' ' + y1 + ' L' + G.punta[0] + ' ' + G.punta[1] + ' L' + G.cola[0] + ' ' + y1 +
      ' L' + (x0 + r) + ' ' + y1 + ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - r) + ' L' + x0 + ' ' + (y0 + r) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + r) + ' ' + y0 + ' Z';
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── cuándo es cada fila, y el hueco del momento que todavía no llega ── */
    P.cuando = CUANDO.map(function (c, k) {
      var t = texto(A, svg, 8, FILAS[k] + 3, 'am-rotulo', 9, 'start', c);
      t.setAttribute('data-cuando', String(k));
      return t;
    });
    P.huecos = [null];
    for (var k = 1; k < FILAS.length; k++) {
      var h = A.el('g', { 'data-hueco': String(k) }, svg);
      A.el('rect', { x: HUECO.x0, y: FILAS[k] - HUECO.arriba, width: HUECO.x1 - HUECO.x0, height: HUECO.arriba + HUECO.abajo, rx: 6,
                     'class': 'am-hueco' }, h);
      texto(A, h, (HUECO.x0 + HUECO.x1) / 2, FILAS[k] + 6, 'am-rotulo', 11, 'middle', '?');
      P.huecos.push(h);
    }

    /* ── los tres machetes: la hoja detrás y el mango delante ── */
    P.filas = PIEZAS.map(function (lista, k) {
      var g = A.el('g', { 'data-fila': String(k) }, svg);
      var mueve = A.el('g', { 'data-fila-mueve': '' }, g);
      var ve = A.el('g', { 'data-fila-ve': '' }, mueve);
      var orden = lista.filter(function (p) { return p.k === 'hoja'; }).concat(lista.filter(function (p) { return p.k === 'mango'; }));
      var piezas = orden.map(function (p) { return pieza(A, ve, FILAS[k], p); });
      return {
        g: g, mueve: mueve, ve: ve, piezas: piezas,
        va: piezas.filter(function (p) { return p.vuelo === 'va'; })[0] || null,
        viene: piezas.filter(function (p) { return p.vuelo === 'viene'; })[0] || null
      };
    });

    /* ── lo que mira la hermana: el de hoy ── */
    P.aro = A.el('g', { 'data-aro': '' }, svg);
    A.el('rect', { x: ARO.x0, y: ARO.y0, width: ARO.x1 - ARO.x0, height: ARO.y1 - ARO.y0, rx: 7,
                   'class': 'mh-aro', 'data-aro-forma': '' }, P.aro);
    /* «hoy» va sobre el borde de arriba: el del verano pasado es el que
       Elvin tiene hoy, y la hermana cuenta los pedazos de ese. */
    texto(A, P.aro, ARO.hoy, ARO.y0 + 2.5, 'am-rotulo', 8.5, 'middle', 'hoy').setAttribute('data-aro-dice', '');

    /* ── lo que mira Elvin: en cada cambio se quedó un pedazo ── */
    P.lazos = LAZOS.map(function (l) {
      var arriba = FILAS[l.de], abajo = FILAS[l.de + 1];
      var y0 = l.k === 'hoja' ? arriba + 11.5 : arriba + 8;
      var y1 = l.k === 'hoja' ? abajo - 7.5 : abajo - 8;
      var g = A.el('g', { 'data-lazo': l.k, 'data-lazo-de': String(l.de) }, svg);
      A.el('path', { d: 'M' + l.x + ' ' + y0 + ' L' + l.x + ' ' + y1 +
                     ' M' + (l.x - 3) + ' ' + y0 + ' L' + (l.x + 3) + ' ' + y0 + ' M' + (l.x - 3) + ' ' + y1 + ' L' + (l.x + 3) + ' ' + y1,
                     'class': 'mh-lazo', 'data-lazo-raya': '' }, g);
      texto(A, g, l.x + 6, r2((y0 + y1) / 2 + 3), 'am-rotulo', 8.5, 'start', l.dice).setAttribute('data-lazo-dice', '');
      return g;
    });

    /* ── Elvin y su hermana, con lo que dice cada uno ── */
    P.gente = {};
    Object.keys(GENTE).forEach(function (q) {
      var p = GENTE[q];
      var g = A.el('g', { 'data-persona': q }, svg);
      texto(A, g, p.x, CARA.y, 'mh-emoji', CARA.tam, 'middle', p.cara).setAttribute('data-persona-cara', '');
      texto(A, g, p.x, CARA.nombre, 'am-rotulo', 8.5, 'middle', p.nombre).setAttribute('data-persona-nombre', '');
      P.gente[q] = g;
    });
    P.globos = {};
    Object.keys(GLOBOS).forEach(function (q) {
      var G = GLOBOS[q];
      var g = A.el('g', { 'data-globo': q }, svg);
      A.el('path', { d: globo(G), 'class': 'mh-globo', 'data-globo-forma': '' }, g);
      G.dice.forEach(function (d, i) {
        texto(A, g, G.x0 + 8, GLOBO.renglones[i], 'mh-tinta', GLOBO.letra, 'start', d).setAttribute('data-globo-dice', '');
      });
      P.globos[q] = g;
    });

    /* ── las tres semanas sin hablarse, entre los dos ── */
    P.cal = A.el('g', { 'data-calendario': '' }, svg);
    A.el('rect', { x: CAL.x0, y: CAL.y0, width: CAL.x1 - CAL.x0, height: CAL.y1 - CAL.y0, rx: 4, 'class': 'mh-papel', 'data-calendario-hoja': '' }, P.cal);
    A.el('rect', { x: CAL.x0, y: CAL.y0, width: CAL.x1 - CAL.x0, height: 5, rx: 2, 'class': 'mh-tira' }, P.cal);
    var x0 = (CAL.x0 + CAL.x1) / 2 - (CAL.paso * (CAL.dias - 1) + CAL.dia) / 2;
    P.semanas = CAL.filas.map(function (y) {
      for (var d = 0; d < CAL.dias; d++) {
        A.el('rect', { x: r2(x0 + CAL.paso * d), y: y, width: CAL.dia, height: CAL.dia, rx: 1, 'class': 'mh-dia', 'data-dia': '' }, P.cal);
      }
      return A.el('path', { d: 'M' + r2(x0 - 3) + ' ' + (y + CAL.dia / 2) + ' L' + r2(x0 + CAL.paso * (CAL.dias - 1) + CAL.dia + 3) + ' ' + (y + CAL.dia / 2),
                            'class': 'mh-tacha', 'data-semana': '' }, P.cal);
    });
    texto(A, P.cal, (CAL.x0 + CAL.x1) / 2, CAL.dice, 'am-rotulo', 8.5, 'middle', 'sin hablarse').setAttribute('data-calendario-dice', '');

    /* ── el cuaderno del final, donde va la regla del alumno ── */
    P.cuaderno = A.el('g', { 'data-cuaderno': '' }, svg);
    A.el('rect', { x: CUADERNO.x0, y: CUADERNO.y0, width: CUADERNO.x1 - CUADERNO.x0, height: CUADERNO.y1 - CUADERNO.y0, rx: 5,
                   'class': 'mh-papel', 'data-cuaderno-caja': '' }, P.cuaderno);
    texto(A, P.cuaderno, CUADERNO.x0 + 8, 164, 'mh-tinta', 9, 'start', 'Mi regla: es el mismo mientras');
    A.el('path', { d: 'M149 165 L' + (CUADERNO.x1 - 8) + ' 165', 'class': 'mh-renglon', 'data-raya-escribir': '' }, P.cuaderno);
    A.el('path', { d: 'M' + (CUADERNO.x0 + 8) + ' 189 L' + (CUADERNO.x1 - 8) + ' 189', 'class': 'mh-renglon', 'data-raya-escribir': '' }, P.cuaderno);
    texto(A, P.cuaderno, CUADERNO.x0 + 8, 216, 'mh-tinta', 9, 'start', '¿Sigue siendo el mismo machete?');
    texto(A, P.cuaderno, 168, 216, 'mh-tinta', 9, 'start', 'sí · no');
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso. filas: cuántos momentos del machete se
     ven; gente: si están Elvin y su hermana; ella y el: si ya dijo lo suyo
     cada uno; aro: lo que mira la hermana; lazos: lo que mira Elvin; cal:
     las tres semanas; cuaderno: el del final. */
  var ESTADOS = [
    { filas: 1, gente: true, ella: false, el: false, aro: false, lazos: false, cal: false, cuaderno: false },
    { filas: 2, gente: true, ella: false, el: false, aro: false, lazos: false, cal: false, cuaderno: false },
    { filas: 3, gente: true, ella: false, el: false, aro: false, lazos: false, cal: false, cuaderno: false },
    { filas: 3, gente: true, ella: true, el: false, aro: true, lazos: false, cal: false, cuaderno: false },
    { filas: 3, gente: true, ella: true, el: true, aro: true, lazos: true, cal: false, cuaderno: false },
    { filas: 3, gente: true, ella: true, el: true, aro: true, lazos: true, cal: true, cuaderno: false },
    { filas: 3, gente: false, ella: false, el: false, aro: false, lazos: false, cal: false, cuaderno: true }
  ];

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function todo() {
    var lista = [P.aro, P.cal, P.cuaderno, P.gente.elvin, P.gente.hermana, P.globos.elvin, P.globos.hermana]
      .concat(P.lazos, P.semanas, P.huecos.slice(1));
    P.filas.forEach(function (f) {
      lista.push(f.mueve, f.ve);
      f.piezas.forEach(function (p) { lista.push(p.mueve, p.ve); });
    });
    return lista;
  }
  /* Una fila que todavía no llegó espera escondida encima de la anterior,
     con los pedazos que traía; una que ya llegó está en su sitio, con el
     pedazo que se fue abajo y apagado, y el nuevo en su lugar. */
  function fila(A, k, llego) {
    var f = P.filas[k];
    A.ver(f.ve, llego, 0);
    A.mover(f.mueve, 0, llego || !k ? 0 : -PASO_FILA, 0, 1, 0);
    if (f.va) {
      A.mover(f.va.mueve, 0, llego ? CAE : 0, 0, 1, 0);
      A.ver(f.va.ve, !llego, 0);
    }
    if (f.viene) {
      A.mover(f.viene.mueve, 0, llego ? 0 : -ENTRA, 0, 1, 0);
      A.ver(f.viene.ve, llego, 0);
    }
    if (P.huecos[k]) A.ver(P.huecos[k], !llego, 0);
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      P.filas.forEach(function (f, k) { fila(A, k, k < s.filas); });
      A.ver(P.gente.elvin, s.gente, 0);
      A.ver(P.gente.hermana, s.gente, 0);
      A.ver(P.globos.hermana, s.ella, 0);
      A.ver(P.globos.elvin, s.el, 0);
      A.ver(P.aro, s.aro, 0);
      P.lazos.forEach(function (g) { A.ver(g, s.lazos, 0); });
      A.ver(P.cal, s.cal, 0);
      P.semanas.forEach(function (g) { A.ver(g, s.cal, 0); });
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 5) se cuentan cada vez que se ENTRA en
       ellos, también volviendo con «Atrás»; el 0 y el 6 se pintan siempre. */
    if (n >= 1 && n <= 5 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 6) {
      if (antes !== 5) { base(A, ESTADOS[6]); return; }
      base(A, ESTADOS[5]);
      [P.gente.elvin, P.gente.hermana, P.globos.elvin, P.globos.hermana, P.aro, P.cal]
        .concat(P.lazos).forEach(function (g) { A.ver(g, false, 0); });
      A.ver(P.cuaderno, true, T6.cuaderno);
      return;
    }
    if (n === 1 || n === 2) {
      /* Pasa el tiempo: el machete baja de un momento al siguiente. Cuando
         llega, se le cae el pedazo que se cambió, y cuando ya se fue, baja
         el nuevo a su lugar. */
      base(A, ESTADOS[n - 1]);
      var f = P.filas[n];
      A.ver(f.ve, true, 0);
      A.mover(f.mueve, 0, 0, 0, 1, 0);
      A.ver(P.huecos[n], false, VIAJE);
      A.mover(f.va.mueve, 0, CAE, 0, 1, T1.cae);
      A.ver(f.va.ve, false, T1.cae + T1.apaga);
      A.mover(f.viene.mueve, 0, 0, 0, 1, T1.viene);
      A.ver(f.viene.ve, true, T1.viene);
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      A.ver(P.globos.hermana, true, T3.globo);
      A.ver(P.aro, true, T3.aro);
      return;
    }
    if (n === 4) {
      base(A, ESTADOS[3]);
      A.ver(P.globos.elvin, true, T4.globo);
      P.lazos.forEach(function (g, i) { A.ver(g, true, T4.lazo + T4.entre * i); });
      return;
    }
    base(A, ESTADOS[4]);
    A.ver(P.cal, true, T5.cal);
    P.semanas.forEach(function (g, i) { A.ver(g, true, T5.semana + T5.entre * i); });
  }

  var FRASES = [
    'El abuelo le dejó este machete a Elvin. Tiene dos pedazos: el mango y la hoja. ¿Qué le pasa con los años?',
    'Hace años le cambiaron el mango. La hoja sigue siendo la del abuelo.',
    'El verano pasado le cambiaron la hoja. Ya no le queda ningún pedazo del abuelo.',
    'La hermana cuenta los pedazos del abuelo que tiene hoy: ninguno. Para ella ya no es el mismo machete.',
    'Elvin mira cada cambio: en cada uno se quedó un pedazo. Para él, nunca hubo otro machete.',
    'Los dos tienen media razón. Ella compara el primero con el de hoy; él, cada cambio. Nadie dijo su regla antes de discutir.',
    'Ahora vos: escribí tu regla en el cuaderno. Después contestá con ella: ¿sigue siendo el mismo machete?'
  ];
  var BOTONES = ['⏳ Hace años', '⏳ El verano pasado', '👧 ¿Qué dice ella?', '👦 ¿Y Elvin?', '📅 ¿Quién tiene razón?', '✍️ ¿Y vos?', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['2', 'pedazos, los dos del abuelo'],
    ['1', 'pedazo nuevo: el mango'],
    ['2', 'pedazos nuevos'],
    ['0', 'pedazos del abuelo en el de hoy'],
    ['1', 'pedazo se quedó en cada cambio'],
    ['3', 'semanas sin hablarse'],
    ['3', 'renglones en tu cuaderno']
  ];

  AnimacionMision.montar('#amMachete', {
    vista: [ANCHO, ALTO],
    describe: 'Al machete del abuelo de Elvin le cambiaron el mango hace años. El verano pasado, la hoja. ' +
      'En cada cambio se quedó un pedazo. Pero del primero al de hoy no queda ninguno. ' +
      'Para la hermana ya no es el mismo. Para Elvin sí, porque nunca hubo otro. ' +
      'Los dos tienen media razón: les faltó decir su regla antes.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
