/* ============================================================
   Animación de «M.E.T.A.S y SACE: qué hace cada uno»
   (misión del maestro, sección «Momentos», detrás del cuadro de la
   frontera)
   ------------------------------------------------------------
   Lo que enseña: el primer momento del año, el que la misión llama «la
   confusión más cara de todas», con un alumno de verdad. Su lista de Mi
   aula y la del registro oficial dicen los mismos nombres desde febrero.
   En agosto llega Elías, usted lo anota en Mi aula y trabaja con él
   cuatro meses; en la lista del registro no cambió nada, porque anotarlo
   aquí no lo escribe allá, y en noviembre el registro cierra el año sin
   él. Y lo que lo evita: el mismo agosto, comparar las dos listas el día
   que llega, nombre por nombre, y avisar por escrito.

   De dónde sale: de la propia misión, que lo dice con estas palabras en
   el momento 1 («Sirve para trabajar, no para inscribir»; «Revisar eso en
   marzo cuesta cinco minutos; en noviembre, un año») y en su Aprende («un
   alumno que no está en el registro oficial no existe para el sistema
   educativo… Reinsertarlo después es un trámite, y el que lo sufre es
   él»). Que M.E.T.A.S no manda nada al registro lo dice el caso 1 («no
   envía nada allá: no tiene forma de hacerlo»). La escena busca las dos
   frases del momento 1 antes de montarse: si dejaran de estar, queda la
   frase de reserva.

   ⚠️ Lo que NO se dice, y a propósito: QUIÉN matricula (el diagnóstico lo
   pregunta, y el completar pide «el administrador del ____»), cómo va un
   traslado o un repitiente, cómo se sube la nota, el cuadro de
   calificaciones, la clave de familia y los módulos del perfil docente.
   Lo preguntan el quiz, el completar, el Clasifica y el diagnóstico. Por
   eso el aviso de Elías no dice a quién va: lo que el maestro hace es
   avisar por escrito, con fecha, y volver a comparar. Tampoco dice
   «notas» del registro: «la nota del parcial, en los dos» es una tarjeta
   del Clasifica.

   ⚠️ Nada se dice solo con color: los nombres que tienen pareja llevan un
   «=» entre las dos listas, el que no la tiene va con raya cortada hasta
   un hueco que dice «no está», y el año cerrado es un ✓ (una raya
   quebrada) en el renglón del registro.

   Lo de M.E.T.A.S va en violeta y lo de SACE en el gris azulado de la
   misión, como en todo lo demás: en una misión sobre dónde termina uno y
   empieza el otro, que las dos listas se vieran iguales sería el error
   que viene a corregir.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amRegistro')) return;

  var ANCHO = 320, ALTO = 286;

  /* ── lo que dice la misión, y sin lo que no se monta ── */
  var dice = '';
  try { dice = [PARADAS[0].txt, PARADAS[0].aula].join(' '); } catch (e) { return; }
  if (dice.indexOf('Sirve para trabajar, no para inscribir.') < 0 ||
      dice.indexOf('Revisar eso en marzo cuesta cinco minutos; en noviembre, un año.') < 0) return;

  function r2(v) { return Math.round(v * 100) / 100; }

  /* ── el año de clases: de febrero a noviembre ── */
  var MESES = ['feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov'];
  var LLEGA = 6, CIERRA = 9;                 /* agosto y noviembre */
  var CAL = { x0: 8, x1: 312, y0: 6, y1: 30, celda: 30, c0: 25, base: 22, marca: { x: 12, y: 9, w: 26, h: 18 } };
  /* La marca del mes va en cuatro sobres, uno dentro de otro: el primero la
     lleva de febrero a agosto y cada uno de los otros tres le suma un mes.
     Así los meses de Elías pasan uno por uno, y cada uno espera su turno. */
  var SALTOS = [CAL.celda * LLEGA, CAL.celda, CAL.celda, CAL.celda];

  /* ── las dos listas ── */
  var LISTA = ['Carla Ruiz', 'Daniel Paz', 'Fabiola Cruz', 'Mario Flores', 'Sofía Banegas'];
  var NUEVO = 'Elías Zelaya', N6 = LISTA.length + 1;
  var PAN = { y0: 38, y1: 186, ancho: 144, titulo: 54, regla: 61, metas: 8, registro: 168 };
  function fila(k) { return 79 + 19 * (k - 1); }
  function centro(k) { return fila(k) - 3.5; }
  var HUECO = { x0: PAN.registro + 4, x1: PAN.registro + PAN.ancho - 4 };
  var IGUAL = { x0: 155.5, x1: 164.5, sep: 1.8 };
  var CASILLAS = { x0: 108, paso: 10, lado: 7 };

  /* ── Elías, el aviso y el cuaderno ── */
  var ELIAS = { x: 30, pies: 270, entra: -60 };
  var AVISO = { x0: 62, x1: 156, y0: 196, y1: 262 };
  var CUADERNO = { x0: 62, x1: 312, y0: 194, y1: 270 };

  /* ── el reloj de la escena ── */
  var T1 = { cal: 0, elias: 800, alta: 1700, hecho: 2300 };
  var T2 = { mes: 900, dura: 800 };
  var T3 = { mes: 0, dura: 800, cierre: 1300, cada: 250, hueco: 2800 };
  var T4 = { igual: 1000, cada: 400, roto: 3200 };
  var T5 = { aviso: 0, fecha: 500, copia: 900, sale: 1500, alta: 2000, igual: 2600 };
  var T6 = { mes: 900, dura: 800, cierre: 2900, cada: 150, aviso: 3800, cuaderno: 4300 };

  var P = {};

  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }
  /* ✓ es una raya quebrada */
  function bien(A, padre, x, y) {
    var t = 4.5;
    return A.el('path', { d: 'M' + r2(x - t) + ' ' + r2(y) + ' L' + r2(x - t * 0.2) + ' ' + r2(y + t * 0.8) + ' L' + r2(x + t) + ' ' + r2(y - t * 0.9), 'class': 'rg-bien' }, padre);
  }
  /* Una lista en su pantalla: el título, su raya y los cinco de febrero. */
  function panel(A, padre, k, titulo) {
    var x0 = PAN[k], g = A.el('g', { 'data-rg-panel': k }, padre);
    A.el('rect', { x: x0, y: PAN.y0, width: PAN.ancho, height: PAN.y1 - PAN.y0, rx: 8, 'class': 'rg-pantalla', 'data-rg-pantalla': '' }, g);
    texto(A, g, x0 + 10, PAN.titulo, 'rg-tit rg-tit-' + k, 11, 'start', titulo).setAttribute('data-rg-titulo', '');
    A.el('path', { d: 'M' + (x0 + 6) + ' ' + PAN.regla + ' L' + (x0 + PAN.ancho - 6) + ' ' + PAN.regla, 'class': 'rg-regla', 'data-rg-regla': '' }, g);
    LISTA.forEach(function (n, i) { texto(A, g, x0 + 10, fila(i + 1), 'rg-tinta', 10, 'start', (i + 1) + ' · ' + n).setAttribute('data-rg-fila', i + 1); });
    return g;
  }
  /* El renglón del que llega, con su fondo; en Mi aula, también sus meses. */
  function alta(A, padre, k) {
    var x0 = PAN[k], g = A.el('g', { 'data-rg-alta': k }, padre);
    A.el('rect', { x: x0 + 4, y: fila(N6) - 11, width: PAN.ancho - 8, height: 17, rx: 4, 'class': 'rg-nuevo-' + k, 'data-rg-nuevo': '' }, g);
    texto(A, g, x0 + 10, fila(N6), 'rg-tinta', 10, 'start', N6 + ' · ' + NUEVO).setAttribute('data-rg-fila', N6);
    return g;
  }
  /* Elías: zapatos, pantalón, mochila, camisa, brazos, cabeza y pelo, y su
     nombre debajo. Va de frente, con la mochila asomando a los lados. */
  function elias(A, padre) {
    var x = ELIAS.x, s = ELIAS.pies, cy = s - 39;
    var g = A.el('g', { 'data-rg-elias': '', 'class': 'am-viaja' }, padre);
    A.el('rect', { x: x - 10, y: s - 30, width: 20, height: 15, rx: 3, 'class': 'rg-mochila' }, g);
    A.el('rect', { x: x - 5.5, y: s - 15, width: 4.2, height: 13, rx: 1, 'class': 'rg-pantalon' }, g);
    A.el('rect', { x: x + 1.3, y: s - 15, width: 4.2, height: 13, rx: 1, 'class': 'rg-pantalon' }, g);
    A.el('rect', { x: x - 6.5, y: s - 3, width: 6, height: 3, rx: 1, 'class': 'rg-zapato', 'data-rg-pie': '' }, g);
    A.el('rect', { x: x + 0.5, y: s - 3, width: 6, height: 3, rx: 1, 'class': 'rg-zapato', 'data-rg-pie': '' }, g);
    A.el('rect', { x: x - 7.5, y: s - 30, width: 15, height: 16, rx: 4, 'class': 'rg-camisa' }, g);
    A.el('path', { d: 'M' + (x - 4) + ' ' + (s - 29.5) + ' L' + (x - 4) + ' ' + (s - 17), 'class': 'rg-tiras' }, g);
    A.el('path', { d: 'M' + (x + 4) + ' ' + (s - 29.5) + ' L' + (x + 4) + ' ' + (s - 17), 'class': 'rg-tiras' }, g);
    A.el('path', { d: 'M' + (x - 7) + ' ' + (s - 27) + ' L' + (x - 11) + ' ' + (s - 15), 'class': 'rg-brazo' }, g);
    A.el('path', { d: 'M' + (x + 7) + ' ' + (s - 27) + ' L' + (x + 11) + ' ' + (s - 15), 'class': 'rg-brazo' }, g);
    A.el('circle', { cx: x, cy: cy, r: 7.5, 'class': 'rg-piel', 'data-rg-cabeza': '' }, g);
    A.el('path', { d: 'M' + (x - 7.5) + ' ' + (cy - 1) + ' Q' + (x - 6.5) + ' ' + (cy - 9.5) + ' ' + x + ' ' + (cy - 8.4) +
      ' Q' + (x + 6.5) + ' ' + (cy - 9.5) + ' ' + (x + 7.5) + ' ' + (cy - 1) + ' Q' + x + ' ' + (cy - 5) + ' ' + (x - 7.5) + ' ' + (cy - 1) + ' Z', 'class': 'rg-pelo' }, g);
    texto(A, g, x, s + 11, 'am-rotulo', 10, 'middle', NUEVO.split(' ')[0]).setAttribute('data-rg-elias-nombre', '');
    return g;
  }

  /* Antes de agosto, el sitio de Elías: alguien que todavía no llega, de
     raya cortada y con su «?». Se va cuando él llega a ese sitio. */
  function espera(A, padre) {
    var x = ELIAS.x, s = ELIAS.pies, cy = s - 39;
    var g = A.el('g', { 'data-rg-espera': '' }, padre);
    A.el('rect', { x: x - 8, y: s - 30, width: 16, height: 30, rx: 5, 'class': 'rg-espera', 'data-rg-espera-cuerpo': '' }, g);
    A.el('circle', { cx: x, cy: cy, r: 7.5, 'class': 'rg-espera', 'data-rg-espera-cabeza': '' }, g);
    texto(A, g, x, cy + 3.3, 'rg-espera-txt', 9.5, 'middle', '?').setAttribute('data-rg-espera-txt', '');
    return g;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);

    /* ── el año de clases, con la marca del mes debajo de su nombre ── */
    var cal = A.el('g', { 'data-rg-cal': '' }, svg);
    A.el('rect', { x: CAL.x0, y: CAL.y0, width: CAL.x1 - CAL.x0, height: CAL.y1 - CAL.y0, rx: 7, 'class': 'rg-tira', 'data-rg-tira': '' }, cal);
    P.paso = [];
    var sobre = cal;
    SALTOS.forEach(function (s, i) { sobre = A.el('g', { 'data-rg-paso': i + 1 }, sobre); P.paso.push(sobre); });
    A.el('rect', { x: CAL.marca.x, y: CAL.marca.y, width: CAL.marca.w, height: CAL.marca.h, rx: 6, 'class': 'rg-marca', 'data-rg-marca': '' }, sobre);
    MESES.forEach(function (m, i) { texto(A, cal, CAL.c0 + CAL.celda * i, CAL.base, 'rg-tinta', 9.5, 'middle', m).setAttribute('data-rg-mes', m); });

    /* ── las dos listas ── */
    panel(A, svg, 'metas', 'Mi aula');
    panel(A, svg, 'registro', 'SACE');
    P.alta = { metas: alta(A, svg, 'metas'), registro: alta(A, svg, 'registro') };
    /* los meses de Elías en Mi aula: la casilla siempre, y lo hecho encima */
    P.hecho = [];
    for (var j = 0; j < CIERRA - LLEGA + 1; j++) {
      var cx = CASILLAS.x0 + CASILLAS.paso * j, cy = fila(N6) - 8.5;
      A.el('rect', { x: cx, y: cy, width: CASILLAS.lado, height: CASILLAS.lado, rx: 1.2, 'class': 'rg-casilla', 'data-rg-casilla': MESES[LLEGA + j] }, P.alta.metas);
      P.hecho.push(A.el('rect', { x: cx, y: cy, width: CASILLAS.lado, height: CASILLAS.lado, rx: 1.2, 'class': 'rg-hecho', 'data-rg-hecho': MESES[LLEGA + j] }, P.alta.metas));
    }

    /* ── entre las dos listas: «=» donde el nombre tiene pareja ── */
    P.igual = {};
    for (var k = 1; k <= N6; k++) {
      var y = centro(k), g = A.el('g', { 'data-rg-igual': k }, svg);
      A.el('path', { d: 'M' + IGUAL.x0 + ' ' + r2(y - IGUAL.sep) + ' L' + IGUAL.x1 + ' ' + r2(y - IGUAL.sep), 'class': 'rg-igual' }, g);
      A.el('path', { d: 'M' + IGUAL.x0 + ' ' + r2(y + IGUAL.sep) + ' L' + IGUAL.x1 + ' ' + r2(y + IGUAL.sep), 'class': 'rg-igual' }, g);
      P.igual[k] = g;
    }
    /* y el que no la tiene: raya cortada hasta su hueco */
    P.roto = A.el('path', { d: 'M' + (PAN.metas + PAN.ancho) + ' ' + centro(N6) + ' L' + HUECO.x0 + ' ' + centro(N6), 'class': 'rg-roto', 'data-rg-roto': N6 }, svg);
    /* El hueco del que no está: uno para noviembre y otro para agosto, en el
       mismo sitio. En el paso 4 el de noviembre se va y el de agosto llega
       con la comparación: un solo hueco no puede irse y volver en el mismo
       paso, porque tiene una sola demora. */
    P.hueco = {};
    ['nov', 'ago'].forEach(function (cuando) {
      var h = A.el('g', { 'data-rg-hueco': cuando }, svg);
      A.el('rect', { x: HUECO.x0, y: fila(N6) - 11.5, width: HUECO.x1 - HUECO.x0, height: 17, rx: 4, 'class': 'rg-hueco', 'data-rg-hueco-caja': '' }, h);
      texto(A, h, (HUECO.x0 + HUECO.x1) / 2, fila(N6), 'rg-tinta-suave', 9.5, 'middle', 'no está').setAttribute('data-rg-hueco-txt', '');
      P.hueco[cuando] = h;
    });
    /* el año cerrado en el registro: un ✓ en cada renglón */
    P.cierre = {};
    for (k = 1; k <= N6; k++) {
      P.cierre[k] = bien(A, svg, PAN.registro + PAN.ancho - 14, centro(k) + 0.5);
      P.cierre[k].setAttribute('data-rg-cierre', k);
    }

    /* ── Elías, y su sitio mientras todavía no llega ── */
    P.espera = espera(A, svg);
    P.elias = elias(A, svg);

    /* ── el aviso, por escrito y con fecha, y la copia que se queda ── */
    var Av = AVISO;
    P.aviso = A.el('g', { 'data-rg-aviso': '' }, svg);
    A.el('rect', { x: Av.x0, y: Av.y0, width: Av.x1 - Av.x0, height: Av.y1 - Av.y0, rx: 3, 'class': 'rg-papel', 'data-rg-aviso-papel': '' }, P.aviso);
    texto(A, P.aviso, Av.x0 + 8, Av.y0 + 16, 'rg-tinta', 10.5, 'start', 'Aviso').setAttribute('data-rg-aviso-tit', '');
    A.el('path', { d: 'M' + (Av.x0 + 6) + ' ' + (Av.y0 + 22) + ' L' + (Av.x1 - 6) + ' ' + (Av.y0 + 22), 'class': 'rg-regla' }, P.aviso);
    texto(A, P.aviso, Av.x0 + 8, Av.y0 + 36, 'rg-tinta', 9.5, 'start', NUEVO).setAttribute('data-rg-aviso-linea', 1);
    texto(A, P.aviso, Av.x0 + 8, Av.y0 + 50, 'rg-tinta', 9.5, 'start', 'llegó hoy').setAttribute('data-rg-aviso-linea', 2);
    P.fecha = texto(A, P.aviso, Av.x1 - 8, Av.y0 + 16, 'rg-tinta-suave', 9, 'end', MESES[LLEGA]);
    P.fecha.setAttribute('data-rg-fecha', '');
    P.copia = texto(A, P.aviso, Av.x1 - 8, Av.y1 - 5, 'rg-tinta-suave', 8, 'end', 'su copia');
    P.copia.setAttribute('data-rg-copia', '');

    /* ── el cuaderno del maestro: donde estaba el aviso ── */
    var C = CUADERNO;
    P.cuaderno = A.el('g', { 'data-rg-cuaderno': '' }, svg);
    A.el('rect', { x: C.x0, y: C.y0, width: C.x1 - C.x0, height: C.y1 - C.y0, rx: 6, 'class': 'rg-papel', 'data-rg-cuaderno-papel': '' }, P.cuaderno);
    texto(A, P.cuaderno, C.x0 + 10, C.y0 + 20, 'rg-tinta', 10.5, 'start', 'Nombres que no calzan con el registro:').setAttribute('data-rg-pide', '');
    A.el('path', { d: 'M' + (C.x0 + 10) + ' ' + (C.y0 + 36) + ' L' + (C.x1 - 10) + ' ' + (C.y0 + 36), 'class': 'rg-raya', 'data-rg-raya': '' }, P.cuaderno);
    texto(A, P.cuaderno, C.x0 + 10, C.y0 + 62, 'rg-tinta', 10.5, 'start', 'Se lo aviso por escrito a:').setAttribute('data-rg-pide', '');
    A.el('path', { d: 'M' + (C.x0 + 132) + ' ' + (C.y0 + 64) + ' L' + (C.x1 - 10) + ' ' + (C.y0 + 64), 'class': 'rg-raya', 'data-rg-raya': '' }, P.cuaderno);
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* Al TERMINAR cada paso: en qué mes va el año, qué renglones tiene cada
     lista, cuántos meses de Elías están hechos, cuántos renglones del
     registro cerraron el año, qué «=» se ven y qué hueco. */
  var ESTADOS = [
    { mes: 0, elias: false, metas6: false, registro6: false, hechos: 0, cierre: 0, nov: false, ago: false, igual: 0, roto: false, aviso: false, cuaderno: false },
    { mes: LLEGA, elias: true, metas6: true, registro6: false, hechos: 1, cierre: 0, nov: false, ago: false, igual: 0, roto: false, aviso: false, cuaderno: false },
    { mes: CIERRA - 1, elias: true, metas6: true, registro6: false, hechos: 3, cierre: 0, nov: false, ago: false, igual: 0, roto: false, aviso: false, cuaderno: false },
    { mes: CIERRA, elias: true, metas6: true, registro6: false, hechos: 4, cierre: 5, nov: true, ago: false, igual: 0, roto: false, aviso: false, cuaderno: false },
    { mes: LLEGA, elias: true, metas6: true, registro6: false, hechos: 1, cierre: 0, nov: false, ago: true, igual: 5, roto: true, aviso: false, cuaderno: false },
    { mes: LLEGA, elias: true, metas6: true, registro6: true, hechos: 1, cierre: 0, nov: false, ago: false, igual: 6, roto: false, aviso: true, cuaderno: false },
    { mes: CIERRA, elias: true, metas6: true, registro6: true, hechos: 4, cierre: 6, nov: false, ago: false, igual: 6, roto: false, aviso: false, cuaderno: true }
  ];

  function todo() {
    var l = [P.espera, P.elias, P.alta.metas, P.alta.registro, P.roto, P.hueco.nov, P.hueco.ago, P.aviso, P.fecha, P.copia, P.cuaderno].concat(P.paso, P.hecho);
    Object.keys(P.igual).forEach(function (k) { l.push(P.igual[k]); });
    Object.keys(P.cierre).forEach(function (k) { l.push(P.cierre[k]); });
    return l;
  }
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  /* la marca del mes, en el mes m */
  function mes(A, m, d) {
    A.mover(P.paso[0], m >= LLEGA ? SALTOS[0] : 0, 0, 0, 1, d);
    for (var i = 1; i < P.paso.length; i++) A.mover(P.paso[i], m >= LLEGA + i ? SALTOS[i] : 0, 0, 0, 1, d);
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      mes(A, s.mes, 0);
      A.ver(P.espera, !s.elias, 0);
      A.ver(P.elias, s.elias, 0);
      A.mover(P.elias, s.elias ? 0 : ELIAS.entra, 0, 0, 1, 0);
      A.ver(P.alta.metas, s.metas6, 0);
      A.ver(P.alta.registro, s.registro6, 0);
      P.hecho.forEach(function (h, j) { A.ver(h, j < s.hechos, 0); });
      Object.keys(P.cierre).forEach(function (k) { A.ver(P.cierre[k], +k <= s.cierre, 0); });
      A.ver(P.hueco.nov, s.nov, 0);
      A.ver(P.hueco.ago, s.ago, 0);
      Object.keys(P.igual).forEach(function (k) { A.ver(P.igual[k], +k <= s.igual, 0); });
      A.ver(P.roto, s.roto, 0);
      A.ver(P.aviso, s.aviso, 0);
      A.ver(P.fecha, s.aviso, 0);
      A.ver(P.copia, s.aviso, 0);
      A.ver(P.cuaderno, s.cuaderno, 0);
    });
  }
  /* los meses que siguen, uno por uno, hasta el sobre «hasta», y cada uno
     se marca hecho cuando la marca llega a él */
  function meses(A, T, hasta) {
    for (var i = 1; i <= hasta; i++) {
      var d = T.mes * (i - 1);
      A.mover(P.paso[i], SALTOS[i], 0, 0, 1, d);
      A.ver(P.hecho[i], true, d + T.dura);
    }
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo se cuentan cada vez que se ENTRA en ellos,
       también volviendo con «Atrás»; el 0 se pinta siempre. */
    if (n >= 1 && !entra(n)) return;
    var k;
    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 1) {
      /* el año corre hasta agosto; Elías llega, y cuando ya llegó, usted lo
         anota en Mi aula y su primer mes queda hecho */
      base(A, ESTADOS[0]);
      A.mover(P.paso[0], SALTOS[0], 0, 0, 1, T1.cal);
      A.ver(P.elias, true, T1.elias);
      A.mover(P.elias, 0, 0, 0, 1, T1.elias);
      A.ver(P.espera, false, T1.elias + 800);
      A.ver(P.alta.metas, true, T1.alta);
      A.ver(P.hecho[0], true, T1.hecho);
      return;
    }
    if (n === 2) { base(A, ESTADOS[1]); meses(A, T2, 2); return; }
    if (n === 3) {
      /* noviembre: su último mes queda hecho; después el registro cierra
         el año con los que tiene, uno por uno, y al final el hueco del que
         no está */
      base(A, ESTADOS[2]);
      A.mover(P.paso[3], SALTOS[3], 0, 0, 1, T3.mes);
      A.ver(P.hecho[3], true, T3.mes + T3.dura);
      for (k = 1; k <= LISTA.length; k++) A.ver(P.cierre[k], true, T3.cierre + T3.cada * (k - 1));
      A.ver(P.hueco.nov, true, T3.hueco);
      return;
    }
    if (n === 4) {
      /* El mismo agosto: lo de noviembre se va y el año vuelve. Después,
         nombre por nombre, el «=» de los que tienen pareja, y al final el
         que no la tiene. */
      base(A, ESTADOS[3]);
      for (k = 1; k <= LISTA.length; k++) A.ver(P.cierre[k], false, 0);
      A.ver(P.hueco.nov, false, 0);
      for (k = 1; k < P.paso.length; k++) { A.mover(P.paso[k], 0, 0, 0, 1, 0); A.ver(P.hecho[k], false, 0); }
      for (k = 1; k <= LISTA.length; k++) A.ver(P.igual[k], true, T4.igual + T4.cada * (k - 1));
      A.ver(P.roto, true, T4.roto);
      A.ver(P.hueco.ago, true, T4.roto);
      return;
    }
    if (n === 5) {
      /* el aviso por escrito, con su fecha, y la copia; cuando ya está, el
         hueco se va, Elías aparece en el registro y su «=» después */
      base(A, ESTADOS[4]);
      A.ver(P.aviso, true, T5.aviso);
      A.ver(P.fecha, true, T5.fecha);
      A.ver(P.copia, true, T5.copia);
      A.ver(P.hueco.ago, false, T5.sale);
      A.ver(P.roto, false, T5.sale);
      A.ver(P.alta.registro, true, T5.alta);
      A.ver(P.igual[N6], true, T5.igual);
      return;
    }
    /* el 6: el año otra vez hasta noviembre, el registro lo cierra con los
       seis, y el cuaderno sale donde estaba el aviso */
    base(A, ESTADOS[5]);
    meses(A, T6, 3);
    for (k = 1; k <= N6; k++) A.ver(P.cierre[k], true, T6.cierre + T6.cada * (k - 1));
    A.ver(P.aviso, false, T6.aviso);
    A.ver(P.cuaderno, true, T6.cuaderno);
  }

  var PRIMERO = NUEVO.split(' ')[0];
  var FRASES = [
    'En febrero, su lista de Mi aula y la del registro oficial dicen los mismos cinco nombres. En agosto llega ' + PRIMERO + ': ¿en cuál va a quedar?',
    'Usted lo anota en Mi aula y ya trabaja con él todos los días. La lista del registro no cambió: anotarlo aquí no lo escribe allá.',
    'Pasan los meses y ' + PRIMERO + ' trabaja como todos: en Mi aula, cada mes queda marcado. En el registro, todavía no está.',
    'En noviembre, el registro cierra el año con los cinco que tiene. ' + PRIMERO + ' no está: para el registro, no existe. Arreglarlo ahora es un trámite, y lo carga él.',
    'El mismo agosto, con un paso más: el día que llega, usted compara las dos listas, nombre por nombre. ' + PRIMERO + ' no tiene pareja.',
    'Usted lo avisa ese mismo día, por escrito y con fecha, y guarda su copia. Después vuelve a comparar: ya tiene pareja.',
    'En noviembre, el registro cierra el año con los seis. Compare hoy su lista con la del registro, nombre por nombre.'
  ];
  var BOTONES = ['📅 Llega en agosto', '🗓️ Pasan los meses', '📕 Llega noviembre', '🔁 Con un paso más', '✉️ Avisar ese día', '📕 Cierra el año', '↺ Empezar otra vez'];
  var MARCADOR = [
    ['?', 'listas donde va a quedar ' + PRIMERO],
    ['1', 'de 2 listas lo tienen'],
    ['3', 'meses de trabajo en Mi aula'],
    ['5', 'cierran el año en el registro'],
    ['5', 'de 6 nombres tienen pareja'],
    ['6', 'de 6 nombres tienen pareja'],
    ['6', 'cierran el año en el registro']
  ];

  AnimacionMision.montar('#amRegistro', {
    vista: [ANCHO, ALTO],
    describe: 'Dos listas: la de Mi aula y la del registro oficial, con los mismos cinco nombres. ' +
      'En agosto llega ' + PRIMERO + ', se anota en Mi aula y trabaja cuatro meses, pero en el registro no está. ' +
      'En noviembre, el registro cierra el año sin él. ' +
      'El mismo año otra vez: el día que llega se comparan las dos listas, se avisa por escrito y queda en las dos.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
