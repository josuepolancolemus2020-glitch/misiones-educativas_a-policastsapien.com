/* ============================================================
   Animación de «El Estatuto del Docente y sus derechos»
   (misión del maestro, sección de los nueve trámites)
   ------------------------------------------------------------
   Lo que enseña: quién se lleva una plaza vacante. Casi todo maestro
   cree que la gana la nota más alta del concurso, y no es así: la ley
   pone TURNOS, y la nota solo cuenta en el último.

   De dónde sale cada cosa, leído en los PDF de _dev/leyes/:
   - Estatuto, artículo 29: «Los puestos vacantes se cubrirán mediante
     traslado […] En defecto de aspirante por traslado, se cubrirá con
     el exento de concurso a quien por lista le corresponda y, en último
     caso, se hará por llamamiento a concurso».
   - Reglamento (Acuerdo 0760-SE-99), artículo 89, con los turnos
     numerados: «1. Solicitudes de traslado. 2. Lista de exonerados de
     concurso del departamento. 3. Listado resultante del concurso general
     anual o específico en orden descendentes, o pena de incurrir en
     responsabilidad». Lo repite el artículo 113.
   - Estatuto, artículo 19: en la lista del concurso «la propiedad se
     establecerá exclusivamente por orden descendente de los puntajes».

   Lo que se dibuja: arriba, la plaza; abajo, los tres turnos, cada uno en
   su fila, con quien espera en él. La plaza se le da al primero que haya
   en el primer turno con alguien, y después se pregunta «¿y si no
   hubiera…?»: quien falta queda como un hueco de raya cortada, y el turno
   baja al siguiente. Así se ve lo que dice la ley con «en defecto de» y
   «en último caso».

   ⚠️ Una sola plaza, a propósito. Con varias, la del segundo turno caía en
   la segunda plaza y la del tercero en la tercera, y parecía que cada fila
   tenía la suya. Y dentro de los traslados no se ordena a nadie: la ley
   (artículo 29, por la evaluación) y el Reglamento (artículos 110 y 112,
   por el motivo) no dicen lo mismo, y aquí solo hay una solicitud.

   ⚠️ No se nombra ninguno de los motivos de traslado ni su orden (el
   simulacro y el quiz los preguntan), ni cuánto dura la lista del
   concurso, ni la nota mínima para aprobarlo.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPlaza')) return;

  var ANCHO = 320, ALTO = 270;

  /* ── los tres turnos, en el orden del artículo 89 ── */
  var FILAS = [
    { k: 'traslado', num: '1', titulo: 'Traslados', sub: 'a esa escuela', y: 98 },
    { k: 'exonerado', num: '2', titulo: 'Exonerados', sub: 'de concurso', y: 160 },
    { k: 'concurso', num: '3', titulo: 'Lista del concurso', sub: 'de mayor a menor nota', y: 222 }
  ];
  /* ── quienes quieren la plaza. La de la lista del concurso se ordena SOLA
        por la nota (de mayor a menor): no se escribe a mano su lugar. ── */
  var GENTE = [
    { k: 'dania', nombre: 'Dania', cara: '👩', fila: 'concurso', nota: 92 },
    { k: 'oscar', nombre: 'Óscar', cara: '🧔', fila: 'concurso', nota: 85 },
    { k: 'ana', nombre: 'Ana', cara: '🧑', fila: 'traslado' },
    { k: 'rosa', nombre: 'Rosa', cara: '👱', fila: 'concurso', nota: 78 },
    { k: 'luis', nombre: 'Luis', cara: '👨', fila: 'exonerado' }
  ];
  var LUGARES = [180, 234, 288];
  /* Cada pieza de una persona, medida: la cara (de y−14 a y+10), el nombre
     (la Ó de Óscar sube hasta y+11) y la etiqueta, uno debajo del otro. El
     aro va un punto dentro de la banda y abraza la etiqueta más ancha. */
  var PERSONA = { cara: 20, bajaCara: 5, nombre: 11.5, bajaNombre: 22, tag: 10, tagY0: 27, tagAlto: 13, tagBaja: 9.6, aroX: 28, aroY0: -15, aroY1: 42 };
  var PLAZA = { x0: 212, x1: 308, y0: 4, y1: 66 };

  /* ── el reloj de la escena ── */
  var APAGA = 500, VIAJE = 800;
  var T1 = { numeros: [0, 350, 700], regla: 1400 };
  var T2 = { turno: 0, aro: 500, plaza: 900 };
  var T3 = { suelta: 0, falta: 300, turno: 800, aro: 1700, plaza: 2100 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }
  /* El ancho de una etiqueta: el de su letra (Fredoka 600 a 10, medida en el
     navegador: 5,9 por letra de promedio) más su aire. */
  function anchoTag(t) { return Math.round(t.length * 5.9 + 10); }
  function filaDe(k) { for (var i = 0; i < FILAS.length; i++) if (FILAS[i].k === k) return i; return -1; }

  /* El orden en que se pregunta: los turnos en su orden y, dentro de la
     lista del concurso, de mayor a menor nota. */
  function enOrden() {
    var out = [];
    FILAS.forEach(function (f) {
      var de = GENTE.filter(function (g) { return g.fila === f.k; });
      if (f.k === 'concurso') de.sort(function (a, b) { return b.nota - a.nota; });
      de.forEach(function (g, i) { out.push({ g: g, fila: filaDe(f.k), lugar: i }); });
    });
    return out;
  }
  /* A quién le toca: al primero, en ese orden, de los que están. */
  function leToca(fuera) {
    var orden = enOrden();
    for (var i = 0; i < orden.length; i++) if (fuera.indexOf(orden[i].g.k) < 0) return orden[i];
    return null;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── la plaza ── */
    texto(A, svg, 186, 46, 'pz-emoji', 28, 'middle', '🏫').setAttribute('data-escuela', '');
    P.plaza = A.el('g', { 'data-plaza': '' }, svg);
    A.el('rect', { x: PLAZA.x0, y: PLAZA.y0, width: PLAZA.x1 - PLAZA.x0, height: PLAZA.y1 - PLAZA.y0, rx: 8, 'class': 'pz-papel', 'data-plaza-caja': '' }, P.plaza);
    texto(A, P.plaza, (PLAZA.x0 + PLAZA.x1) / 2, 18, 'pz-tinta', 11, 'middle', 'la plaza');
    texto(A, P.plaza, (PLAZA.x0 + PLAZA.x1) / 2, 44, 'pz-emoji', 22, 'middle', '🪑').setAttribute('data-silla', '');
    P.vacante = texto(A, P.plaza, (PLAZA.x0 + PLAZA.x1) / 2, 59, 'pz-gris', 11, 'middle', 'vacante');
    P.vacante.setAttribute('data-estado', 'vacante');
    P.para = {};
    GENTE.forEach(function (g) {
      var t = texto(A, P.plaza, (PLAZA.x0 + PLAZA.x1) / 2, 59, 'pz-tinta', 11, 'middle', 'para ' + g.nombre);
      t.setAttribute('data-estado', 'para');
      t.setAttribute('data-para', g.k);
      P.para[g.k] = t;
    });

    /* ── de dónde sale el orden ── */
    P.regla = texto(A, svg, 10, 44, 'am-rotulo', 11, 'start', 'Reglamento, artículo 89');
    P.regla.setAttribute('data-regla', '');

    /* ── los tres turnos ── */
    P.filas = FILAS.map(function (f) {
      var g = A.el('g', { 'data-fila': f.k }, svg);
      A.el('rect', { x: 4, y: f.y - 16, width: ANCHO - 8, height: 60, rx: 8, 'class': 'pz-banda', 'data-banda': '' }, g);
      A.el('circle', { cx: 20, cy: f.y - 1, r: 11, 'class': 'pz-badge', 'data-badge': '' }, g);
      var num = texto(A, g, 20, f.y + 3.6, 'am-digito', 13, 'middle', f.num);
      num.setAttribute('data-num', '');
      var duda = texto(A, g, 20, f.y + 3.6, 'pz-duda', 13, 'middle', '?');
      duda.setAttribute('data-duda', '');
      texto(A, g, 38, f.y + 3, 'pz-titulo', 13, 'start', f.titulo).setAttribute('data-titulo', '');
      texto(A, g, 38, f.y + 18, 'pz-sub', 10.5, 'start', f.sub).setAttribute('data-sub', '');
      return { g: g, num: num, duda: duda };
    });

    /* ── el turno que se está preguntando: una flecha a la izquierda ── */
    P.turno = A.el('path', { d: 'M1 ' + (FILAS[0].y - 8) + ' L8 ' + (FILAS[0].y - 1) + ' L1 ' + (FILAS[0].y + 6) + ' Z', 'class': 'pz-turno', 'data-turno': '' }, svg);

    /* ── la gente, cada una en su turno ── */
    P.gente = {};
    enOrden().forEach(function (o) {
      var g = o.g, x = LUGARES[o.lugar], y = FILAS[o.fila].y;
      var dice = g.fila === 'concurso' ? 'nota ' + g.nota : g.fila;
      var w = anchoTag(dice), ax = Math.max(PERSONA.aroX, w / 2 + 2.5);
      var hueco = A.el('rect', { x: r2(x - ax + 1.5), y: y + PERSONA.aroY0 + 1.5, width: r2(2 * ax - 3), height: PERSONA.aroY1 - PERSONA.aroY0 - 3, rx: 7,
                                 'class': 'am-hueco', 'data-hueco': g.k }, svg);
      var grupo = A.el('g', { 'data-persona': g.k }, svg);
      texto(A, grupo, x, y + PERSONA.bajaCara, 'pz-emoji', PERSONA.cara, 'middle', g.cara).setAttribute('data-cara', '');
      texto(A, grupo, x, y + PERSONA.bajaNombre, 'am-rotulo', PERSONA.nombre, 'middle', g.nombre).setAttribute('data-nombre', '');
      var tag = A.el('g', { 'class': 'pz-tag', 'data-tag': '' }, grupo);
      A.el('rect', { x: r2(x - w / 2), y: y + PERSONA.tagY0, width: w, height: PERSONA.tagAlto, rx: 6 }, tag);
      texto(A, tag, x, y + PERSONA.tagY0 + PERSONA.tagBaja, 'pz-tag-txt', PERSONA.tag, 'middle', dice).setAttribute('data-tag-txt', '');
      var aro = A.el('rect', { x: r2(x - ax), y: y + PERSONA.aroY0, width: r2(2 * ax), height: PERSONA.aroY1 - PERSONA.aroY0, rx: 9,
                               'class': 'pz-aro', 'data-aro': g.k }, svg);
      P.gente[g.k] = { grupo: grupo, hueco: hueco, aro: aro };
    });
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* El estado al TERMINAR cada paso: si ya se ven los números de los turnos,
     quién falta (el «¿y si no hubiera…?»). A quién le toca y en qué turno
     se pregunta NO se escriben: salen de leToca(), con el orden de la ley. */
  var ESTADOS = [
    { numeros: false, da: false, fuera: [] },
    { numeros: true, da: false, fuera: [] },
    { numeros: true, da: true, fuera: [] },
    { numeros: true, da: true, fuera: ['ana'] },
    { numeros: true, da: true, fuera: ['ana', 'luis'] },
    { numeros: true, da: true, fuera: [] }
  ];

  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function todo() {
    var out = [P.plaza, P.regla, P.turno];
    P.filas.forEach(function (f) { out.push(f.g); });
    Object.keys(P.gente).forEach(function (k) { var p = P.gente[k]; out.push(p.grupo, p.hueco, p.aro); });
    return out;
  }
  function moverTurno(A, fila, demora) {
    A.mover(P.turno, 0, fila == null ? 0 : FILAS[fila].y - FILAS[0].y, 0, 1, demora);
  }
  function base(A, s) {
    var toca = s.da ? leToca(s.fuera) : null;
    deGolpe(A, todo(), function () {
      P.filas.forEach(function (f) {
        A.ver(f.num, s.numeros, 0);
        A.ver(f.duda, !s.numeros, 0);
      });
      A.ver(P.regla, s.numeros, 0);
      A.ver(P.turno, !!toca, 0);
      moverTurno(A, toca ? toca.fila : null, 0);
      Object.keys(P.gente).forEach(function (k) {
        var p = P.gente[k], falta = s.fuera.indexOf(k) >= 0;
        A.ver(p.grupo, !falta, 0);
        A.ver(p.hueco, falta, 0);
        A.ver(p.aro, !!toca && toca.g.k === k, 0);
        A.ver(P.para[k], !!toca && toca.g.k === k, 0);
      });
      A.ver(P.vacante, !toca, 0);
    });
  }

  /* Da la plaza: la flecha baja al turno que toca, el aro rodea a quien le
     toca y la plaza dice para quién es. */
  function dar(A, s, t) {
    var toca = leToca(s.fuera);
    A.ver(P.turno, true, t.turno);
    moverTurno(A, toca.fila, t.turno);
    A.ver(P.gente[toca.g.k].aro, true, t.aro);
    A.ver(P.vacante, false, t.plaza);
    A.ver(P.para[toca.g.k], true, t.plaza + APAGA);
  }

  function pintar(n, antes, A) {
    /* Los pasos que cuentan algo (1 a 5) se cuentan cada vez que se ENTRA en
       ellos, también volviendo con «Atrás»; el 0 se pinta siempre. */
    if (n >= 1 && antes === n) return;
    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 1) {
      /* Los turnos reciben su número, uno detrás de otro, y después se dice
         de dónde sale el orden. */
      base(A, ESTADOS[0]);
      P.filas.forEach(function (f, i) {
        A.ver(f.duda, false, T1.numeros[i]);
        A.ver(f.num, true, T1.numeros[i] + APAGA);
      });
      A.ver(P.regla, true, T1.regla);
      return;
    }
    if (n === 2) {
      base(A, ESTADOS[1]);
      dar(A, ESTADOS[2], T2);
      return;
    }
    /* 3, 4 y 5: de un «¿y si…?» al siguiente. Primero se suelta la plaza;
       después sale (o vuelve) quien cambia; la flecha va al turno que toca,
       y al final el aro y la plaza. */
    var prev = ESTADOS[n - 1], s = ESTADOS[n];
    base(A, prev);
    var antesToca = leToca(prev.fuera);
    A.ver(P.gente[antesToca.g.k].aro, false, T3.suelta);
    A.ver(P.para[antesToca.g.k], false, T3.suelta);
    Object.keys(P.gente).forEach(function (k) {
      var falta = s.fuera.indexOf(k) >= 0, faltaba = prev.fuera.indexOf(k) >= 0;
      if (falta === faltaba) return;
      A.ver(P.gente[k].grupo, !falta, T3.falta);
      A.ver(P.gente[k].hueco, falta, T3.falta);
    });
    var toca = leToca(s.fuera);
    moverTurno(A, toca.fila, T3.turno);
    A.ver(P.gente[toca.g.k].aro, true, T3.aro);
    A.ver(P.para[toca.g.k], true, T3.plaza);
  }

  var FRASES = [
    'Se abrió una plaza y la quieren cinco docentes. Dania sacó la nota más alta del concurso: 92. ¿Le toca a ella?',
    'No la decide la nota. El artículo 89 del Reglamento numera los turnos: 1, los traslados; 2, los exonerados de concurso; 3, la lista.',
    'Se pregunta primero por los traslados. Ana pidió traslado a esa escuela: la plaza es de ella, y a la lista no le llega el turno.',
    'Si Ana no hubiera pedido traslado, se pasa al segundo turno. La plaza sería de Luis, exonerado de concurso.',
    'Solo si tampoco hubiera exonerado le llega el turno a la lista. Y en la lista sí manda la nota, de mayor a menor: Dania, con 92.',
    'Ese orden no es un favor: el Reglamento lo manda, y quien nombra responde si se lo salta. ¿En qué turno está usted hoy?'
  ];
  var BOTONES = ['📜 Ver el orden', '🪑 Dar la plaza', '🤔 ¿Y sin Ana?', '🤔 ¿Y sin Luis?', '⚖️ ¿Se lo saltan?', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['1', 'plaza vacante, y cinco la quieren'],
    ['3', 'turnos, y la nota va en el último'],
    ['1.º', 'turno: el traslado de Ana'],
    ['2.º', 'turno, si Ana no lo hubiera pedido'],
    ['3.º', 'turno: la lista, de mayor a menor nota'],
    ['89', 'el artículo que manda ese orden']
  ];

  AnimacionMision.montar('#amPlaza', {
    vista: [ANCHO, ALTO],
    describe: 'Una plaza vacante y cinco docentes que la quieren. Dania tiene la nota más alta del concurso, 92. ' +
      'El Reglamento del Estatuto pone tres turnos: primero los traslados, después los exonerados de concurso y al final ' +
      'la lista del concurso, de mayor a menor nota. La plaza es de Ana, que pidió traslado; sin ella sería de Luis, ' +
      'el exonerado, y solo sin los dos le llegaría a Dania.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
