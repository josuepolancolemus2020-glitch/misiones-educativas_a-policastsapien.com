/* ============================================================
   Animación de «Cómo Aprende una Máquina»
   (Ruta de la Máquina que Aprende, etapa 2)
   ------------------------------------------------------------
   La historia: a Wilmer lo cambiaron de escuela a mitad de año y el
   sistema de notas no lo aceptó: «no está en la lista». Quien escribió
   esa regla no pensó en él, y su maestro lo llevó en un cuaderno aparte.
   La historia termina con las dos maneras de fallar: un programa de
   siempre falla con el caso que nadie escribió; uno que aprende de
   ejemplos, con los que no vio.

   Lo que se dibuja: una máquina que tiene que pasar al sistema la nota
   de Wilmer, un 71 escrito a mano en el cuaderno. Primero, con una regla
   que escribió una persona (un 7 lleva la raya de arriba de lado a lado):
   el 7 del maestro tiene la raya corta, y entra como 11. Después, de la
   otra manera: cuatro personas escribieron un 1 y un 7, cada número con
   su nombre. La máquina pone los unos uno encima de otro, y los sietes
   también, y donde casi todos tienen tinta queda más oscuro. El 7 del
   maestro cae más en lo oscuro del 7, y el 71 entra bien. Pero un 1
   pegado a la orilla del cuadro cae en lo oscuro del 7: ninguno de los
   unos que le dieron estaba en la orilla.

   ⚠️ Lo oscuro NO se escribe: se cuenta. Cada casilla de un montón es la
   parte de los números de ese montón que tienen tinta en esa casilla. Y
   cada barra es cuánto de lo oscuro hay, en promedio, debajo de la tinta
   del número que se lee. La sonda lo vuelve a contar aparte, leyendo las
   casillas en el dibujo, y lo mismo con la regla.

   ⚠️ Los números están hechos para que la historia sea verdad, y eso se
   dice aquí: la raya de arriba del 7 del maestro es corta, así que la
   regla lo lee 1; y es un 7 que no se parece a ninguno de los cuatro, y
   aun así cae más en lo oscuro del 7. Todos los unos que le dieron están
   en medio del cuadro, así que un 1 en la orilla no cae en nada oscuro
   del 1. Quien los cambie tiene que volver a contar: la sonda se pone
   roja si alguna de las tres cosas deja de pasar.

   ⚠️ Lo que NO se dice, y a propósito: ni «ejemplo», ni «etiqueta», ni
   «entrenar», ni «patrón», ni «prueba», ni «modelo», ni «sesgo», que
   son los pareados de la prueba; ni «lo que se repite», que es la
   definición de uno de ellos; ni que la máquina piensa, sabe o entiende.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amNota')) return;

  var ANCHO = 320, ALTO = 256;

  /* ── los números, en casillas: 5 de ancho y 7 de alto ────────── */
  /* '#' es una casilla con tinta. Cada persona escribe a su manera, y la
     cuarta los escribe inclinados. */
  var PERSONAS = [
    { uno: '..#../..#../..#../..#../..#../..#../..#..', siete: '#####/....#/...#./...#./..#../..#../..#..' },
    { uno: '..#../.##../..#../..#../..#../..#../..#..', siete: '#####/...#./...#./..#../..#../..#../..#..' },
    { uno: '..#../.##../..#../..#../..#../..#../.###.', siete: '#####/....#/....#/...#./...#./..#../..#..' },
    { uno: '...#./..##./..#../..#../..#../.#.../.#...', siete: '.####/....#/...#./..#../..#../.#.../.#...' }
  ];
  /* El 71 del cuaderno: el 7 con la raya de arriba corta, y el 1 con su
     rayita larga. */
  var MAESTRO = { siete: '.###./...#./...#./..#../..#../..#../..#..', uno: '..#../.##../#.#../..#../..#../..#../..#..' };
  /* Un 1 pegado a la orilla derecha del cuadro */
  var ORILLA = '....#/....#/....#/....#/....#/....#/....#';

  function casillas(s) {
    return s.split('/').map(function (f) { return f.split('').map(function (c) { return c === '#' ? 1 : 0; }); });
  }
  /* Un montón: en cada casilla, la parte de los números que tienen tinta ahí */
  function monton(clave) {
    var g = PERSONAS.map(function (p) { return casillas(p[clave]); }), m = [];
    for (var r = 0; r < 7; r++) {
      m.push([]);
      for (var c = 0; c < 5; c++) {
        var s = 0;
        g.forEach(function (x) { s += x[r][c]; });
        m[r].push(s / g.length);
      }
    }
    return m;
  }
  var MONTON = { uno: monton('uno'), siete: monton('siete') };
  /* Cuánto cae en lo oscuro: lo oscuro del montón, en promedio, debajo de
     cada casilla con tinta del número que se lee */
  function cae(num, m) {
    var x = casillas(num), s = 0, n = 0;
    for (var r = 0; r < 7; r++) for (var c = 0; c < 5; c++) if (x[r][c]) { s += m[r][c]; n++; }
    return n ? s / n : 0;
  }
  function conMontones(num) { return cae(num, MONTON.siete) > cae(num, MONTON.uno) ? '7' : '1'; }
  /* La regla que escribió una persona: si la raya de arriba va de lado a
     lado, es un 7; si no, es un 1. */
  function conRegla(num) { return casillas(num)[0].every(function (v) { return v === 1; }) ? '7' : '1'; }
  var CAE = {
    M: { uno: cae(MAESTRO.siete, MONTON.uno), siete: cae(MAESTRO.siete, MONTON.siete) },
    O: { uno: cae(ORILLA, MONTON.uno), siete: cae(ORILLA, MONTON.siete) }
  };
  var LEE = {
    regla: conRegla(MAESTRO.siete) + conRegla(MAESTRO.uno),
    montones: conMontones(MAESTRO.siete) + conMontones(MAESTRO.uno),
    orilla: conMontones(ORILLA)
  };

  /* ── dónde va cada cosa ────────────────────────────────────── */
  var CUADERNO = { x0: 8, y0: 16, x1: 88, y1: 72, celda: 6, siete: [16, 23], uno: [52, 23], titulo: { x: 8, base: 11, texto: 'el cuaderno de Wilmer' } };
  var SISTEMA = { x0: 204, y0: 16, x1: 312, y1: 72, titulo: { x: 258, base: 11, texto: 'el sistema de notas' }, nombre: { base: 34 }, nota: { base: 63, tam: 22 } };
  var FLECHA = { x0: 92, x1: 198, y: 44, rotulo: { x: 145, base: 38, texto: 'la máquina' } };
  var REGLA = { x0: 8, y0: 82, x1: 312, y1: 132, lineas: [
    { base: 95, texto: 'La regla que escribió una persona:', clase: 'nt-letra-b' },
    { base: 110, texto: 'Si la raya de arriba va de lado a lado, es un 7.', clase: 'nt-letra' },
    { base: 124, texto: 'Si no, es un 1.', clase: 'nt-letra' }] };
  /* El número que se lee, grande, y lo que contesta debajo */
  var GRANDE = { x: 40, y: 156, celda: 8, rotulo: { x: 60, base: 150 } };
  var LLAVE = { y0: 152, y1: 148, rotulo: { base: 143, texto: 'de lado a lado' } };
  var RESP = { x0: 18, y0: 220, x1: 114, y1: 244, texto: { x: 56, base: 236.5, tam: 11 } };
  /* Los números de las cuatro personas */
  var EJ = { x0: 12, paso: 40, celda: 5, y: { uno: 100, siete: 160 }, nombre: { dy: 39, ancho: 14, alto: 11 }, rotulo: { x: 8, base: 92, texto: 'escrito por cuatro personas' } };
  function ejX(i) { return EJ.x0 + EJ.paso * i; }
  /* Los dos montones, y sus barras a la derecha */
  var MONT = { x: 186, celda: 7, y: { uno: 88, siete: 150 }, rotulo: { x: 203.5, base: { uno: 84, siete: 146 } } };
  var BARRA = { x0: 228, largo: 78, y: { uno: 112.5, siete: 174.5 }, rotulo: { x: 228, base: 98, texto: 'cae en lo oscuro:' } };
  var ARO = { x0: 224, ancho: 86, medio: 7 };
  var TARJETA = { x0: 8, y0: 84, x1: 176, y1: 248 };

  /* ── el reloj de la escena ──────────────────────────────────── */
  /* La copia del número aparece encima de él, vuela hasta el montón y,
     cuando llega, crece su barra. La segunda sale cuando la primera ya
     llegó. */
  var VUELO = { sale: 200, llega: 1000, barra: 1100 };
  /* Lo que cambia en la pantalla del sistema no se cruza: la nota de antes
     se apaga, y la nueva llega cuando ya se apagó. */
  var APAGA = 500;
  var T1 = { sale: 0, regla: 300, llave: 1000, resp: 1800, nota: 2300 };
  var T2 = { sale: 0, rotulo: 500, ej: 600, cada: 300, nombre: 150 };
  var T3 = { rotulo: 0, cada: 250, vuelo: 800, otro: 1900 };
  var T4 = { grande: 0, copia: 500, otra: 1300, aro: 3900, resp: 4300, nota: 4700 };
  var T5 = { sale: 0, grande: 600, copia: 1100, otra: 1300, aro: 4400, resp: 4800 };
  var T6 = { sale: 0, tarjeta: 500 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: x, y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }

  /* Un cuadro de 5 x 7 casillas, dibujado en casillas de 1: quien lo pone
     en su sitio le da el tamaño. Con `monton`, cada casilla va tan oscura
     como dice el montón; con `copia`, solo el borde de la tinta, para que
     se vea lo oscuro de debajo. */
  function cuadro(A, padre, num, o) {
    var g = A.el('g', o.dato || {}, padre), r, c;
    if (o.copia) {
      A.el('rect', { x: 0, y: 0, width: 5, height: 7, 'class': 'nt-copia-caja', 'data-cuadro-caja': '' }, g);
    } else {
      A.el('rect', { x: 0, y: 0, width: 5, height: 7, 'class': 'nt-papel', 'data-cuadro-caja': '' }, g);
      /* Las rayas del cuadro van en UN solo trazo: son diez por número,
         iguales y quietas, y veinte números con sus diez rayas sueltas eran
         doscientas piezas que el teléfono repinta en cada cuadro de lo que
         se mueve. */
      var rayas = [];
      for (c = 1; c < 5; c++) rayas.push('M' + c + ' 0 L' + c + ' 7');
      for (r = 1; r < 7; r++) rayas.push('M0 ' + r + ' L5 ' + r);
      A.el('path', { d: rayas.join(' '), 'class': 'nt-linea' }, g);
    }
    if (o.monton) {
      for (r = 0; r < 7; r++) for (c = 0; c < 5; c++) {
        if (o.monton[r][c] > 0) {
          A.el('rect', { x: r2(c + 0.06), y: r2(r + 0.06), width: 0.88, height: 0.88, 'class': 'nt-oscuro',
            'fill-opacity': o.monton[r][c], 'data-oscuro': String(o.monton[r][c]) }, g);
        }
      }
    }
    if (num) {
      var x = casillas(num);
      for (r = 0; r < 7; r++) for (c = 0; c < 5; c++) {
        if (x[r][c]) {
          A.el('rect', { x: r2(c + 0.12), y: r2(r + 0.12), width: 0.76, height: 0.76, rx: 0.14,
            'class': o.copia ? 'nt-copia' : (o.tinta || 'nt-tinta'), 'data-tinta': '' }, g);
        }
      }
    }
    if (!o.copia) A.el('rect', { x: 0, y: 0, width: 5, height: 7, 'class': 'nt-borde' }, g);
    return g;
  }
  /* Un cuadro quieto: su sitio va en el dibujo, no en el reloj */
  function quieto(g, x, y, celda) { g.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(' + celda + ')'); return g; }

  /* Una punta de flecha en (x, y), mirando a la derecha */
  function puntaDerecha(A, padre, x, y) {
    return A.el('polygon', { points: [[x, y], [x - 6, y - 3.6], [x - 6, y + 3.6]].map(function (q) { return q[0] + ',' + q[1]; }).join(' '), 'class': 'nt-punta', 'data-flecha-punta': '' }, padre);
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── el cuaderno de Wilmer, con su 71 ── */
    texto(A, svg, CUADERNO.titulo.x, CUADERNO.titulo.base, 'am-rotulo', 10, 'start', CUADERNO.titulo.texto).setAttribute('data-cuaderno-titulo', '');
    A.el('rect', { x: CUADERNO.x0, y: CUADERNO.y0, width: CUADERNO.x1 - CUADERNO.x0, height: CUADERNO.y1 - CUADERNO.y0, rx: 3, 'class': 'nt-hoja', 'data-cuaderno-caja': '' }, svg);
    quieto(cuadro(A, svg, MAESTRO.siete, { dato: { 'data-numero': 'cuaderno-7' } }), CUADERNO.siete[0], CUADERNO.siete[1], CUADERNO.celda);
    quieto(cuadro(A, svg, MAESTRO.uno, { dato: { 'data-numero': 'cuaderno-1' } }), CUADERNO.uno[0], CUADERNO.uno[1], CUADERNO.celda);

    /* ── la máquina lo pasa al sistema ── */
    texto(A, svg, FLECHA.rotulo.x, FLECHA.rotulo.base, 'am-rotulo', 10, 'middle', FLECHA.rotulo.texto).setAttribute('data-maquina', '');
    var fl = A.el('g', { 'data-flecha': '' }, svg);
    A.el('path', { d: 'M' + FLECHA.x0 + ' ' + FLECHA.y + ' L' + (FLECHA.x1 - 5) + ' ' + FLECHA.y, 'class': 'nt-flecha', 'data-flecha-linea': '' }, fl);
    puntaDerecha(A, fl, FLECHA.x1, FLECHA.y);

    /* ── el sistema de notas: una pantalla, con lo que entró ── */
    texto(A, svg, SISTEMA.titulo.x, SISTEMA.titulo.base, 'am-rotulo', 10, 'middle', SISTEMA.titulo.texto).setAttribute('data-sistema-titulo', '');
    A.el('rect', { x: SISTEMA.x0, y: SISTEMA.y0, width: SISTEMA.x1 - SISTEMA.x0, height: SISTEMA.y1 - SISTEMA.y0, rx: 6, 'class': 'nt-sistema', 'data-sistema': '' }, svg);
    var mx = (SISTEMA.x0 + SISTEMA.x1) / 2;
    texto(A, svg, mx, SISTEMA.nombre.base, 'nt-pantalla', 10, 'middle', 'Wilmer').setAttribute('data-sistema-nombre', '');
    P.nota = {};
    ['?', LEE.regla, LEE.montones].forEach(function (k) {
      var t = texto(A, svg, mx, SISTEMA.nota.base, 'nt-pantalla', SISTEMA.nota.tam, 'middle', k);
      t.setAttribute('data-nota', k);
      P.nota[k] = t;
    });

    /* ── la regla que escribió una persona ── */
    P.regla = A.el('g', { 'data-regla': '' }, svg);
    A.el('rect', { x: REGLA.x0, y: REGLA.y0, width: REGLA.x1 - REGLA.x0, height: REGLA.y1 - REGLA.y0, rx: 5, 'class': 'nt-regla', 'data-regla-caja': '' }, P.regla);
    REGLA.lineas.forEach(function (l) { texto(A, P.regla, REGLA.x0 + 8, l.base, l.clase, 10, 'start', l.texto); });

    /* ── el número que se lee, grande ── */
    P.grande = {
      maestro: quieto(cuadro(A, svg, MAESTRO.siete, { dato: { 'data-numero': 'grande-maestro' } }), GRANDE.x, GRANDE.y, GRANDE.celda),
      orilla: quieto(cuadro(A, svg, ORILLA, { dato: { 'data-numero': 'grande-orilla' } }), GRANDE.x, GRANDE.y, GRANDE.celda)
    };
    P.rotGrande = {
      maestro: texto(A, svg, GRANDE.rotulo.x, GRANDE.rotulo.base, 'am-rotulo', 10, 'middle', 'el 7 del maestro'),
      orilla: texto(A, svg, GRANDE.rotulo.x, GRANDE.rotulo.base, 'am-rotulo', 10, 'middle', 'un 1 en la orilla')
    };
    P.rotGrande.maestro.setAttribute('data-grande-dice', 'maestro');
    P.rotGrande.orilla.setAttribute('data-grande-dice', 'orilla');

    /* La llave de «de lado a lado», y las dos casillas de arriba que no
       tienen tinta: lo que la regla mira, y lo que le falta a este 7. */
    P.llave = A.el('g', { 'data-llave': '' }, svg);
    var gx1 = GRANDE.x + 5 * GRANDE.celda;
    A.el('path', { d: 'M' + GRANDE.x + ' ' + LLAVE.y0 + ' L' + GRANDE.x + ' ' + LLAVE.y1 + ' L' + gx1 + ' ' + LLAVE.y1 + ' L' + gx1 + ' ' + LLAVE.y0,
      'class': 'nt-llave', 'data-llave-raya': '' }, P.llave);
    texto(A, P.llave, (GRANDE.x + gx1) / 2, LLAVE.rotulo.base, 'am-rotulo', 9.5, 'middle', LLAVE.rotulo.texto).setAttribute('data-llave-dice', '');
    casillas(MAESTRO.siete)[0].forEach(function (v, c) {
      if (v) return;
      A.el('rect', { x: GRANDE.x + c * GRANDE.celda + 0.7, y: GRANDE.y + 0.7, width: GRANDE.celda - 1.4, height: GRANDE.celda - 1.4,
        'class': 'nt-falta', 'data-falta': String(c) }, P.llave);
    });

    /* ── lo que contesta: una pieza por cada vez ── */
    function respuesta(clave, dice, bien) {
      var g = A.el('g', { 'data-respuesta': clave }, svg);
      A.el('rect', { x: RESP.x0, y: RESP.y0, width: RESP.x1 - RESP.x0, height: RESP.y1 - RESP.y0, rx: 6, 'class': 'nt-globo', 'data-respuesta-caja': '' }, g);
      texto(A, g, RESP.texto.x, RESP.texto.base, 'nt-letra', RESP.texto.tam, 'middle', 'contesta «' + dice + '»').setAttribute('data-respuesta-dice', dice);
      if (bien) A.el('path', { d: 'M94 232.5 L98 237 L107 225.5', 'class': 'nt-bien', 'data-bien': '' }, g);
      else A.el('path', { d: 'M95 226 L106 237 M106 226 L95 237', 'class': 'nt-mal', 'data-mal': '' }, g);
      return g;
    }
    P.resp = {
      r1: respuesta('r1', conRegla(MAESTRO.siete), conRegla(MAESTRO.siete) === '7'),
      r4: respuesta('r4', conMontones(MAESTRO.siete), conMontones(MAESTRO.siete) === '7'),
      r5: respuesta('r5', LEE.orilla, LEE.orilla === '1')
    };

    /* ── lo que escribieron las cuatro personas ── */
    P.rotEj = texto(A, svg, EJ.rotulo.x, EJ.rotulo.base, 'am-rotulo', 10, 'start', EJ.rotulo.texto);
    P.rotEj.setAttribute('data-ej-rotulo', '');
    P.ej = { uno: [], siete: [] };
    ['uno', 'siete'].forEach(function (k) {
      var cifra = k === 'uno' ? '1' : '7';
      PERSONAS.forEach(function (p, i) {
        /* el nombre que lleva: un papelito debajo, que no se mueve */
        var nom = A.el('g', { 'data-nombre-num': cifra, 'data-persona': String(i) }, svg);
        var nx = ejX(i) + (5 * EJ.celda - EJ.nombre.ancho) / 2, ny = EJ.y[k] + EJ.nombre.dy;
        A.el('rect', { x: nx, y: ny, width: EJ.nombre.ancho, height: EJ.nombre.alto, rx: 2, 'class': 'nt-nombre', 'data-nombre-caja': '' }, nom);
        texto(A, nom, r2(nx + EJ.nombre.ancho / 2), r2(ny + 8.4), 'nt-letra', 9, 'middle', cifra);
        /* el número: la de fuera lo lleva, la de dentro lo enciende */
        var g = A.el('g', { 'data-ej': k, 'data-persona': String(i) }, svg);
        var ver = A.el('g', { 'data-ej-ver': '' }, g);
        cuadro(A, ver, p[k], { tinta: 'nt-tinta-' + i, dato: { 'data-numero': 'ej-' + k + '-' + i } });
        P.ej[k].push({ g: g, ver: ver, nombre: nom });
      });
    });

    /* ── los dos montones ── */
    P.monton = {}; P.rotMonton = {};
    ['uno', 'siete'].forEach(function (k) {
      P.monton[k] = quieto(cuadro(A, svg, null, { monton: MONTON[k], dato: { 'data-numero': 'monton-' + k } }), MONT.x, MONT.y[k], MONT.celda);
      var t = texto(A, svg, MONT.rotulo.x, MONT.rotulo.base[k], 'am-rotulo', 10, 'middle', k === 'uno' ? 'los 1' : 'los 7');
      t.setAttribute('data-monton-dice', k);
      P.rotMonton[k] = t;
    });

    /* ── las barras: cuánto cae en lo oscuro de cada montón ── */
    P.rotBarras = texto(A, svg, BARRA.rotulo.x, BARRA.rotulo.base, 'am-rotulo', 9.5, 'start', BARRA.rotulo.texto);
    P.rotBarras.setAttribute('data-barras-dice', '');
    P.riel = {}; P.barra = { M: {}, O: {} }; P.aro = {};
    ['uno', 'siete'].forEach(function (k) {
      P.riel[k] = A.el('path', { d: 'M' + BARRA.x0 + ' ' + BARRA.y[k] + ' L' + (BARRA.x0 + BARRA.largo) + ' ' + BARRA.y[k], 'class': 'nt-riel', 'data-riel': k }, svg);
    });
    ['M', 'O'].forEach(function (c) {
      ['uno', 'siete'].forEach(function (k) {
        P.barra[c][k] = A.el('path', { d: 'M' + BARRA.x0 + ' ' + BARRA.y[k] + ' L' + r2(BARRA.x0 + BARRA.largo * CAE[c][k]) + ' ' + BARRA.y[k],
          'class': 'nt-barra', 'data-barra': c + '-' + k, 'data-cae': String(Math.round(CAE[c][k] * 1000) / 1000) }, svg);
      });
      var gana = CAE[c].siete > CAE[c].uno ? 'siete' : 'uno';
      P.aro[c] = A.el('rect', { x: ARO.x0, y: BARRA.y[gana] - ARO.medio, width: ARO.ancho, height: 2 * ARO.medio, rx: 5, 'class': 'nt-aro', 'data-aro': c }, svg);
    });

    /* ── lo que escribe el alumno ── */
    P.tarjeta = A.el('g', { 'data-tarjeta': '' }, svg);
    A.el('rect', { x: TARJETA.x0, y: TARJETA.y0, width: TARJETA.x1 - TARJETA.x0, height: TARJETA.y1 - TARJETA.y0, rx: 6, 'class': 'nt-hoja', 'data-tarjeta-caja': '' }, P.tarjeta);
    texto(A, P.tarjeta, 18, 102, 'nt-letra-b', 10, 'start', 'En tu cuaderno:');
    texto(A, P.tarjeta, 18, 120, 'nt-letra', 9.5, 'start', 'Escribe tu 1 y tu 7:');
    quieto(cuadro(A, P.tarjeta, null, { dato: { 'data-numero': 'tarjeta-1' } }), 34, 128, 6);
    quieto(cuadro(A, P.tarjeta, null, { dato: { 'data-numero': 'tarjeta-7' } }), 90, 128, 6);
    texto(A, P.tarjeta, 49, 182, 'nt-letra', 9.5, 'middle', 'tu 1');
    texto(A, P.tarjeta, 105, 182, 'nt-letra', 9.5, 'middle', 'tu 7');
    texto(A, P.tarjeta, 18, 204, 'nt-letra', 9.5, 'start', '¿A cuál se parece tu 7?');
    A.el('path', { d: 'M18 226 L166 226', 'class': 'nt-renglon-escribir', 'data-raya-escribir': '' }, P.tarjeta);

    /* ── las copias que vuelan: van al final, encima de todo ── */
    P.copia = { M: {}, O: {} };
    ['M', 'O'].forEach(function (c) {
      ['uno', 'siete'].forEach(function (k) {
        var g = A.el('g', { 'data-copia': c + '-' + k }, svg);
        var ver = A.el('g', { 'data-copia-ver': '' }, g);
        cuadro(A, ver, c === 'M' ? MAESTRO.siete : ORILLA, { copia: true, dato: { 'data-numero': 'copia-' + c + '-' + k } });
        P.copia[c][k] = { g: g, ver: ver };
      });
    });
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso. sistema: qué número entró; grande: qué
     número se está leyendo; regla: la tarjeta de la regla y su llave;
     resp: qué contestó; copias y barras: de cuál número (M, el del
     maestro; O, el de la orilla). */
  var ESTADOS = [
    { sistema: '?', grande: 'maestro', rotGrande: true, regla: false, resp: null, ejemplos: false, montones: false, copias: null, barras: null, tarjeta: false },
    { sistema: LEE.regla, grande: 'maestro', rotGrande: false, regla: true, resp: 'r1', ejemplos: false, montones: false, copias: null, barras: null, tarjeta: false },
    { sistema: '?', grande: null, rotGrande: false, regla: false, resp: null, ejemplos: true, montones: false, copias: null, barras: null, tarjeta: false },
    { sistema: '?', grande: null, rotGrande: false, regla: false, resp: null, ejemplos: false, montones: true, copias: null, barras: null, tarjeta: false },
    { sistema: LEE.montones, grande: 'maestro', rotGrande: true, regla: false, resp: 'r4', ejemplos: false, montones: true, copias: 'M', barras: 'M', tarjeta: false },
    { sistema: LEE.montones, grande: 'orilla', rotGrande: true, regla: false, resp: 'r5', ejemplos: false, montones: true, copias: 'O', barras: 'O', tarjeta: false },
    { sistema: LEE.montones, grande: null, rotGrande: false, regla: false, resp: null, ejemplos: false, montones: true, copias: null, barras: null, tarjeta: true }
  ];
  function con(s, cambios) { var o = {}, k; for (k in s) o[k] = s[k]; for (k in cambios) o[k] = cambios[k]; return o; }

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }

  function todo() {
    var l = [P.regla, P.llave, P.grande.maestro, P.grande.orilla, P.rotGrande.maestro, P.rotGrande.orilla, P.rotEj, P.rotBarras, P.tarjeta,
      P.riel.uno, P.riel.siete, P.aro.M, P.aro.O, P.resp.r1, P.resp.r4, P.resp.r5, P.monton.uno, P.monton.siete, P.rotMonton.uno, P.rotMonton.siete];
    Object.keys(P.nota).forEach(function (k) { l.push(P.nota[k]); });
    ['uno', 'siete'].forEach(function (k) {
      P.ej[k].forEach(function (e) { l.push(e.g, e.ver, e.nombre); });
      ['M', 'O'].forEach(function (c) { l.push(P.barra[c][k], P.copia[c][k].g, P.copia[c][k].ver); });
    });
    return l;
  }

  function ponerEj(A, k, i, enMonton, demora) {
    if (enMonton) A.mover(P.ej[k][i].g, MONT.x, MONT.y[k], 0, MONT.celda, demora);
    else A.mover(P.ej[k][i].g, ejX(i), EJ.y[k], 0, EJ.celda, demora);
  }
  function ponerCopia(A, c, k, llego, demora) {
    if (llego) A.mover(P.copia[c][k].g, MONT.x, MONT.y[k], 0, MONT.celda, demora);
    else A.mover(P.copia[c][k].g, GRANDE.x, GRANDE.y, 0, GRANDE.celda, demora);
  }

  function base(A, s) {
    deGolpe(A, todo(), function () {
      Object.keys(P.nota).forEach(function (k) { A.ver(P.nota[k], s.sistema === k, 0); });
      ['maestro', 'orilla'].forEach(function (k) {
        A.ver(P.grande[k], s.grande === k, 0);
        A.ver(P.rotGrande[k], s.grande === k && s.rotGrande, 0);
      });
      A.ver(P.regla, s.regla, 0);
      A.ver(P.llave, s.regla, 0);
      ['r1', 'r4', 'r5'].forEach(function (k) { A.ver(P.resp[k], s.resp === k, 0); });
      A.ver(P.rotEj, s.ejemplos, 0);
      ['uno', 'siete'].forEach(function (k) {
        P.ej[k].forEach(function (e, i) {
          ponerEj(A, k, i, false, 0);
          A.ver(e.ver, s.ejemplos, 0);
          A.ver(e.nombre, s.ejemplos, 0);
        });
        A.ver(P.monton[k], s.montones, 0);
        A.ver(P.rotMonton[k], s.montones, 0);
        A.ver(P.riel[k], !!s.barras, 0);
        ['M', 'O'].forEach(function (c) {
          ponerCopia(A, c, k, s.copias === c, 0);
          A.ver(P.copia[c][k].ver, s.copias === c, 0);
          A.ver(P.barra[c][k], s.barras === c, 0);
          A.trazar(P.barra[c][k], s.barras === c, 0);
        });
      });
      A.ver(P.aro.M, s.barras === 'M', 0);
      A.ver(P.aro.O, s.barras === 'O', 0);
      A.ver(P.rotBarras, !!s.barras, 0);
      A.ver(P.tarjeta, s.tarjeta, 0);
    });
  }

  function salen(A, piezas, demora) { piezas.forEach(function (p) { A.ver(p, false, demora); }); }

  /* Lee un número con los montones: su copia vuela a cada montón y crece
     la barra de lo que cae en lo oscuro; después el aro y lo que contesta. */
  function leer(A, c, cual, T) {
    A.ver(P.grande[cual], true, T.grande);
    A.ver(P.rotGrande[cual], true, T.grande);
    ['uno', 'siete'].forEach(function (k, j) {
      var t = T.copia + j * T.otra;
      A.ver(P.copia[c][k].ver, true, t);
      ponerCopia(A, c, k, true, t + VUELO.sale);
      A.ver(P.riel[k], true, t + VUELO.barra);
      if (j === 0) A.ver(P.rotBarras, true, t + VUELO.barra);
      A.ver(P.barra[c][k], true, t + VUELO.barra);
      A.trazar(P.barra[c][k], true, t + VUELO.barra);
    });
    A.ver(P.aro[c], true, T.aro);
    A.ver(P.resp[c === 'M' ? 'r4' : 'r5'], true, T.resp);
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo (1 a 5) se cuentan cada vez que se ENTRA
       en ellos, también volviendo con «Atrás»; el 0 y el 6 se pintan
       siempre, también en el primer pintado. Lo que arranca de golpe no
       puede traer piezas que se van en ese mismo paso: aparecerían un
       instante y se irían (por eso el `con`). */
    if (n >= 1 && n <= 5 && !entra(n)) return;

    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 6) {
      if (antes !== 5) { base(A, ESTADOS[6]); return; }
      base(A, ESTADOS[5]);
      salen(A, [P.grande.orilla, P.rotGrande.orilla, P.resp.r5, P.aro.O, P.rotBarras, P.riel.uno, P.riel.siete,
        P.barra.O.uno, P.barra.O.siete, P.copia.O.uno.ver, P.copia.O.siete.ver], T6.sale);
      A.ver(P.tarjeta, true, T6.tarjeta);
      return;
    }
    if (n === 1) {
      base(A, antes === 0 ? ESTADOS[0] : con(ESTADOS[0], { rotGrande: false }));
      A.ver(P.rotGrande.maestro, false, T1.sale);
      A.ver(P.regla, true, T1.regla);
      A.ver(P.llave, true, T1.llave);
      A.ver(P.resp.r1, true, T1.resp);
      A.ver(P.nota['?'], false, T1.nota);
      A.ver(P.nota[LEE.regla], true, T1.nota + APAGA);
      return;
    }
    if (n === 2) {
      base(A, antes === 1 ? ESTADOS[1] : con(ESTADOS[1], { sistema: '?', grande: null, regla: false, resp: null }));
      salen(A, [P.regla, P.llave, P.resp.r1, P.grande.maestro, P.nota[LEE.regla]], T2.sale);
      A.ver(P.nota['?'], true, T2.sale + APAGA);
      A.ver(P.rotEj, true, T2.rotulo);
      ['uno', 'siete'].forEach(function (k) {
        P.ej[k].forEach(function (e, i) {
          A.ver(e.ver, true, T2.ej + T2.cada * i);
          A.ver(e.nombre, true, T2.ej + T2.cada * i + T2.nombre);
        });
      });
      return;
    }
    if (n === 3) {
      base(A, ESTADOS[2]);
      A.ver(P.rotEj, false, T3.rotulo);
      ['uno', 'siete'].forEach(function (k, j) {
        var d0 = j * T3.otro;
        /* sale primero el de la punta que da al montón: así ninguno pasa
           por encima de los que esperan */
        for (var o = 0; o < PERSONAS.length; o++) {
          var i = PERSONAS.length - 1 - o, t = d0 + o * T3.cada;
          A.ver(P.ej[k][i].nombre, false, t);
          ponerEj(A, k, i, true, t);
          A.ver(P.ej[k][i].ver, false, t + T3.vuelo);
        }
        var listo = d0 + (PERSONAS.length - 1) * T3.cada + T3.vuelo;
        A.ver(P.monton[k], true, listo);
        A.ver(P.rotMonton[k], true, listo);
      });
      return;
    }
    if (n === 4) {
      base(A, ESTADOS[3]);
      leer(A, 'M', 'maestro', T4);
      A.ver(P.nota['?'], false, T4.nota);
      A.ver(P.nota[LEE.montones], true, T4.nota + APAGA);
      return;
    }
    /* el 5: un 1 en la orilla */
    base(A, antes === 4 ? ESTADOS[4] : con(ESTADOS[4], { grande: null, rotGrande: false, copias: null, barras: null, resp: null }));
    salen(A, [P.grande.maestro, P.rotGrande.maestro, P.resp.r4, P.aro.M, P.barra.M.uno, P.barra.M.siete, P.copia.M.uno.ver, P.copia.M.siete.ver], T5.sale);
    leer(A, 'O', 'orilla', T5);
  }

  var FRASES = [
    'Imagina una máquina que pasa al sistema las notas del cuaderno. El maestro de Wilmer escribió así su 71. ¿Cómo lee el 7?',
    'Una persona le escribió la regla: un 7 lleva la raya de arriba de lado a lado. Esta raya es corta, y contesta «1». El 71 entra como 11.',
    'Otra manera: nadie le escribe la regla. Cuatro personas escribieron un 1 y un 7, y cada número lleva su nombre.',
    'Pone los unos uno encima de otro, y los sietes también. Donde casi todos tienen tinta, queda más oscuro.',
    'Pone el 7 del maestro encima de los dos. Cae más en lo oscuro del 7, y contesta «7». Ahora el 71 entra bien.',
    'Llega un 1 pegado a la orilla. Su tinta no cae en lo oscuro del 1, y contesta «7». Ninguno de los unos estaba en la orilla.',
    '¿Cómo escribes tú el 1 y el 7? Escríbelos en tu cuaderno. ¿A cuál de los dos de la pantalla se parece tu 7?'
  ];
  var BOTONES = ['📏 Con una regla', '🗂️ De otra manera', '📚 Uno sobre otro', '🔍 Que lea el 7', '➡️ Un 1 en la orilla', '✍️ ¿Y tú?', '↺ Empezar otra vez'];
  var MARCADOR = [['71', 'la nota de Wilmer, escrita a mano'], ['11', 'lo que entró al sistema'], ['4', 'personas: cada una escribió un 1 y un 7'],
    ['2', 'montones: el de los 1 y el de los 7'], ['71', 'lo que entró al sistema'], ['7', 'lo que contestó por un 1 en la orilla'],
    ['2', 'números para tu cuaderno: tu 1 y tu 7']];

  AnimacionMision.montar('#amNota', {
    vista: [ANCHO, ALTO],
    describe: 'Una máquina tiene que pasar al sistema el 71 que el maestro de Wilmer escribió a mano. Con una regla escrita por una persona, ' +
      'el 7 de raya corta entra como 1 y la nota como 11. De la otra manera, pone uno encima de otro los unos y los sietes de cuatro personas: ' +
      'el 7 del maestro cae más en lo oscuro del 7 y la nota entra bien. Pero un 1 pegado a la orilla lo contesta 7.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
