/* ============================================================
   Animación de «La Historia de la Inteligencia Artificial»
   (Ruta de la Máquina que Aprende, etapa 3)
   ------------------------------------------------------------
   La historia: el primo de Kenia dice que la Inteligencia Artificial
   se inventó en 2022, el año del chat. Su tío estudió computación en
   los noventa y dice: «eso ya se probó y no sirvió». Los dos ven media
   película, y Kenia tiene que decidir a quién creerle.

   Lo que se dibuja: la línea del tiempo como una cinta de película,
   tapada. Encima, los dos y Kenia. Cada uno vio un pedazo: el primo,
   desde el chat hasta hoy; el tío, desde el principio hasta los
   noventa, con los dos inviernos. Entre los dos queda un hueco que no
   vio ninguno. Después de los inviernos vienen seis hitos, y el tío no
   vio ninguno; y de cerca, la idea del chat estaba en el hueco, cinco
   años antes. Cada uno vio un pedazo y creyó que era la película.

   ⚠️ Ni un año escrito a mano. Los hitos salen de js/data/ia-historia.js,
   que es el único sitio del proyecto donde vive una fecha de la IA: cada
   punto de la cinta es un hito con su año; los dos inviernos van como
   franjas sin borde, porque son períodos y nadie se pone de acuerdo en
   el día (el segundo, a finales de su década, como dice su edad); y «de
   2023 a hoy», como una franja hasta hoy. El chat y la idea de la que
   salió se buscan por su `clave`, no por su año. Lo único que pone la
   escena es dónde termina el pedazo del tío: a mitad de los noventa,
   que es cuando estudió. Y «hoy» es el año del teléfono.

   ⚠️ Los números del marcador no se escriben: se cuentan en la cinta,
   cuántos hitos caen en cada pedazo. La sonda los vuelve a contar en
   el dibujo, leyendo el año de cada punto con la regla de la cinta.

   ⚠️ Lo que NO se dice, y a propósito: ni un nombre de la línea del
   tiempo (ni personas, ni programas, ni juegos), ni qué pasó en cada
   hito, ni por qué hubo inviernos (eso lo pregunta la prueba), ni las
   tres patas. Los puntos van sin nombre: lo que se enseña aquí es qué
   pedazo vio cada uno, no qué hay en cada punto. Tampoco se calculan
   los años entre dos hitos de la actividad «¿Cuánto tardó?», que el
   alumno adivina más abajo. Y la máquina no piensa, ni sabe, ni entiende.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amPelicula')) return;
  if (typeof IA_HITOS === 'undefined' || typeof IA_EPOCAS === 'undefined') return;

  var ANCHO = 320, ALTO = 246;

  /* ── lo que dice el archivo de datos ───────────────────────── */
  function porClave(c) { for (var i = 0; i < IA_HITOS.length; i++) if (IA_HITOS[i].clave === c) return IA_HITOS[i]; return null; }
  var CHAT = porClave('chat'), IDEA = porClave('motor');
  if (!CHAT || !IDEA || !/^\d{4}$/.test(CHAT.anio) || !/^\d{4}$/.test(IDEA.anio)) return;
  var DECADAS = { setenta: 1970, ochenta: 1980, noventa: 1990 };
  /* El segundo invierno va a finales de su década: lo dice su edad */
  var FINALES = (function () {
    var e = IA_EPOCAS.filter(function (x) { return x.clave === 'invierno'; })[0];
    var m = e && /finales de los (\w+)/.exec(e.rango);
    return m ? DECADAS[m[1]] : null;
  })();
  /* Cada hito, con su sitio en la cinta: un año, un período o un invierno */
  var HITOS = IA_HITOS.map(function (h) {
    var a = String(h.anio), m;
    if (/^\d{4}$/.test(a)) return { h: h, tipo: 'punto', desde: +a, hasta: +a };
    if ((m = /^de (\d{4}) a hoy$/.exec(a))) return { h: h, tipo: 'periodo', desde: +m[1], hasta: null };
    if ((m = /^años (\w+)$/.exec(a)) && DECADAS[m[1]] && h.epoca === 'invierno') {
      var d = DECADAS[m[1]];
      return { h: h, tipo: 'invierno', desde: d === FINALES ? d + 5 : d, hasta: d + 10 };
    }
    return null;
  }).filter(Boolean);
  if (HITOS.length !== IA_HITOS.length) return;
  var periodo = HITOS.filter(function (o) { return o.tipo === 'periodo'; })[0];
  var HOY = Math.max(new Date().getFullYear(), periodo ? periodo.desde + 1 : 0);
  HITOS.forEach(function (o) { if (o.hasta === null) o.hasta = HOY; });
  var anios = HITOS.filter(function (o) { return o.tipo === 'punto'; }).map(function (o) { return o.desde; });
  /* La cinta empieza en la década del primer hito */
  var INICIO = Math.floor(Math.min.apply(null, anios) / 10) * 10;
  /* El tío estudió en los noventa: su pedazo termina a mitad de esa década */
  var NOVENTA = DECADAS.noventa + 5;
  var FIN_INVIERNOS = Math.max.apply(null, HITOS.filter(function (o) { return o.tipo === 'invierno'; }).map(function (o) { return o.hasta; }));
  /* De cerca: desde un lustro antes de la idea hasta hoy */
  var CERCA = Math.floor(+IDEA.anio / 5) * 5 - 5;

  function dentro(o, a, b) { return o.desde >= a && o.hasta <= b; }
  var PEDAZO = {
    primo: HITOS.filter(function (o) { return o.desde >= +CHAT.anio; }),
    tio: HITOS.filter(function (o) { return dentro(o, INICIO, NOVENTA); }),
    hueco: HITOS.filter(function (o) { return o.desde > NOVENTA && o.hasta < +CHAT.anio; }),
    despues: HITOS.filter(function (o) { return o.desde >= FIN_INVIERNOS; }),
    cerca: HITOS.filter(function (o) { return o.desde >= CERCA; })
  };
  var INVIERNOS = HITOS.filter(function (o) { return o.tipo === 'invierno'; }).length;
  var ANTES = +CHAT.anio - +IDEA.anio;
  /* Lo que las frases afirman tiene que ser verdad con los datos de hoy. Si
     un hito nuevo lo cambiara (que el tío viera algo de después de los
     inviernos, que el hueco quedara vacío, que la idea dejara de estar en
     él), la escena no se monta y queda la frase de reserva: la sonda lo dice
     antes de publicar. */
  if (INVIERNOS !== 2 || !PEDAZO.primo.length || !PEDAZO.tio.length || !PEDAZO.hueco.length ||
      PEDAZO.despues.some(function (o) { return o.hasta <= NOVENTA; }) ||
      !(+IDEA.anio > NOVENTA && +IDEA.anio < +CHAT.anio)) return;
  var PALABRA = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
    'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte'];
  function enLetra(n) { return PALABRA[n] || String(n); }

  /* ── el dibujo ─────────────────────────────────────────────── */
  /* La cinta: su borde oscuro con los agujeros, y la parte clara de en
     medio, donde van los hitos */
  var CINTA = { x0: 14, x1: 306, y0: 120, y1: 146, adentro: [124.5, 141.5], filas: [129.5, 136.5], radio: 2.4, invierno: [125.5, 140.5] };
  function xa(a) { return CINTA.x0 + (a - INICIO) * (CINTA.x1 - CINTA.x0) / (HOY - INICIO); }
  /* Los años, ARRIBA de la cinta: abajo van las llaves que la miden */
  var REGLA = { y0: 113, y1: 116.5, base: 111, tam: 9, rotulo: 20 };
  /* La barra de color encima de la cinta: el pedazo que vio cada uno */
  var BARRA = { y0: 117.5, y1: 119.5 };
  /* Las llaves debajo de la cinta, con lo que dicen */
  var LLAVE = { y: 153, alto: 3.5, base: 164.5, tam: 9.5 };
  /* La gente: los pies en la misma raya */
  var PIES = 99;
  var GENTE = {
    tio: { x: 70, cabeza: 59, r: 8.5 },
    kenia: { x: 200, cabeza: 66, r: 7.5 },
    primo: { x: 290, cabeza: 60, r: 8 }
  };
  /* Lo que dice cada uno, en su globo de dos renglones */
  var GLOBO = { y0: 4, y1: 38, tam: 10.5, bases: [17.5, 31], cola: 47 };
  var GLOBOS = {
    tio: { x0: 21, x1: 119, dice: ['Eso ya se probó', 'y no sirvió.'], cola: 70, colaY: 48 },
    primo: { x0: 250, x1: 316, dice: ['Se inventó', 'en ' + CHAT.anio + '.'], cola: 290, colaY: 49 },
    duda: { x0: 170, x1: 230, dice: ['¿A quién', 'le creo?'], cola: 200, colaY: 56 },
    entera: { x0: 148, x1: 244, dice: ['Mejor veo la', 'película entera.'], cola: 200, colaY: 56 }
  };
  /* De cerca: el marco sobre la cinta, las dos rayas que bajan y la cinta
     grande, con su regla debajo. Mientras no se mira de cerca, lo de arriba
     va centrado (ARRIBA): sin eso, un tercio del dibujo se quedaba vacío en
     cinco de los siete pasos. Para mirar de cerca, sube y deja sitio. */
  var ARRIBA = 37;
  var LUPA = { y0: 118.5, y1: 148.5, sale: 3 };
  var GRANDE = { x0: 24, x1: 302, y0: 198, y1: 224, adentro: [202.5, 219.5], fila: 211, radio: 3.2, grande: 3.8,
    marco: { x0: 9, x1: 311, y0: 162, y1: 242 }, regla: { y0: 224, y1: 228.5, menor: 226.5, base: 237.5, tam: 9 } };
  function xg(a) { return GRANDE.x0 + (a - CERCA) * (GRANDE.x1 - GRANDE.x0) / (HOY - CERCA); }
  /* «la idea» y «llega a todos», cada una encima de su punto; el arco va de
     una a la otra y lo que dice, encima del arco */
  var ARCO = { pie: 184, control: 171, base: 172, tam: 9.5, rotulo: 193.5 };

  /* ── el reloj de la escena ──────────────────────────────────── */
  /* Lo que cambia en el mismo sitio no se cruza: lo de antes se apaga y
     lo nuevo llega cuando ya se apagó. */
  var APAGA = 500;
  var T1 = { cono: 0, velo: 400, hito: 800, cada: 200 };
  var T2 = { cono: 0, velo: 400, hito: 800, cada: 160 };
  var T3 = { llave: 0, velo: 500, hito: 900, cada: 220 };
  var T4 = { sale: 0, llave: APAGA };
  var T5 = { sale: 0, sube: 0, marco: 800, rayas: 1050, cerca: 1300, hito: 1550, cada: 120, idea: 2250, todos: 2450, arco: 2700, dice: 3400 };
  var T6 = { sale: 0, baja: APAGA, llave: APAGA + 800, globo: APAGA + 800 };

  var P = {};

  function r2(v) { return Math.round(v * 100) / 100; }
  function texto(A, padre, x, y, clase, tam, ancla, contenido) {
    var n = A.el('text', { x: r2(x), y: y, 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'start' }, padre);
    n.textContent = contenido;
    return n;
  }

  /* El tío: grande, con anteojos y bigote */
  function tio(A, padre) {
    var G = GENTE.tio, x = G.x, c = G.cabeza;
    var g = A.el('g', { 'data-persona': 'tio' }, padre);
    A.el('rect', { x: x - 7, y: PIES - 14, width: 5, height: 14, rx: 1.5, 'class': 'pl-pantalon' }, g);
    A.el('rect', { x: x + 2, y: PIES - 14, width: 5, height: 14, rx: 1.5, 'class': 'pl-pantalon' }, g);
    A.el('rect', { x: x - 10, y: c + 9, width: 20, height: 21, rx: 4, 'class': 'pl-camisa-tio' }, g);
    A.el('path', { d: 'M' + (x - 9) + ' ' + (c + 13) + ' L' + (x - 12) + ' ' + (c + 27) + ' M' + (x + 9) + ' ' + (c + 13) + ' L' + (x + 12) + ' ' + (c + 27), 'class': 'pl-brazo' }, g);
    A.el('circle', { cx: x, cy: c, r: G.r, 'class': 'pl-piel', 'data-cabeza': 'tio' }, g);
    A.el('path', { d: 'M' + (x - 8.5) + ' ' + (c - 1) + ' Q' + (x - 8) + ' ' + (c - 9.5) + ' ' + x + ' ' + (c - 9) + ' Q' + (x + 8) + ' ' + (c - 9.5) + ' ' + (x + 8.5) + ' ' + (c - 1) +
      ' Q' + (x + 5) + ' ' + (c - 6) + ' ' + x + ' ' + (c - 5.5) + ' Q' + (x - 5) + ' ' + (c - 6) + ' ' + (x - 8.5) + ' ' + (c - 1) + ' Z', 'class': 'pl-canas' }, g);
    A.el('circle', { cx: x - 3.4, cy: c - 0.5, r: 2.4, 'class': 'pl-lente' }, g);
    A.el('circle', { cx: x + 3.4, cy: c - 0.5, r: 2.4, 'class': 'pl-lente' }, g);
    A.el('path', { d: 'M' + (x - 1) + ' ' + (c - 0.5) + ' L' + (x + 1) + ' ' + (c - 0.5), 'class': 'pl-lente' }, g);
    A.el('path', { d: 'M' + (x - 3.5) + ' ' + (c + 4) + ' Q' + x + ' ' + (c + 2.4) + ' ' + (x + 3.5) + ' ' + (c + 4), 'class': 'pl-bigote' }, g);
    return g;
  }
  /* Kenia: más bajita, con trenzas */
  function kenia(A, padre) {
    var G = GENTE.kenia, x = G.x, c = G.cabeza;
    var g = A.el('g', { 'data-persona': 'kenia' }, padre);
    A.el('rect', { x: x - 5.5, y: PIES - 11, width: 4, height: 11, rx: 1.2, 'class': 'pl-piel' }, g);
    A.el('rect', { x: x + 1.5, y: PIES - 11, width: 4, height: 11, rx: 1.2, 'class': 'pl-piel' }, g);
    A.el('path', { d: 'M' + (x - 6) + ' ' + (c + 8) + ' L' + (x + 6) + ' ' + (c + 8) + ' L' + (x + 10) + ' ' + (PIES - 10) + ' L' + (x - 10) + ' ' + (PIES - 10) + ' Z', 'class': 'pl-vestido' }, g);
    A.el('path', { d: 'M' + (x - 7) + ' ' + (c + 11) + ' L' + (x - 10) + ' ' + (c + 21) + ' M' + (x + 7) + ' ' + (c + 11) + ' L' + (x + 10) + ' ' + (c + 21), 'class': 'pl-brazo pl-brazo-n' }, g);
    /* las trenzas, detrás de la cara */
    A.el('path', { d: 'M' + (x - 6.5) + ' ' + (c + 1) + ' Q' + (x - 9) + ' ' + (c + 7) + ' ' + (x - 7.5) + ' ' + (c + 13) +
      ' M' + (x + 6.5) + ' ' + (c + 1) + ' Q' + (x + 9) + ' ' + (c + 7) + ' ' + (x + 7.5) + ' ' + (c + 13), 'class': 'pl-trenza' }, g);
    A.el('circle', { cx: x, cy: c, r: G.r, 'class': 'pl-piel', 'data-cabeza': 'kenia' }, g);
    A.el('path', { d: 'M' + (x - 7.5) + ' ' + (c - 0.5) + ' Q' + (x - 6.8) + ' ' + (c - 8.6) + ' ' + x + ' ' + (c - 8.2) + ' Q' + (x + 6.8) + ' ' + (c - 8.6) + ' ' + (x + 7.5) + ' ' + (c - 0.5) +
      ' Q' + x + ' ' + (c - 4.5) + ' ' + (x - 7.5) + ' ' + (c - 0.5) + ' Z', 'class': 'pl-pelo' }, g);
    return g;
  }
  /* El primo: con gorra, la visera hacia la cinta */
  function primo(A, padre) {
    var G = GENTE.primo, x = G.x, c = G.cabeza;
    var g = A.el('g', { 'data-persona': 'primo' }, padre);
    A.el('rect', { x: x - 6.5, y: PIES - 14, width: 5, height: 14, rx: 1.5, 'class': 'pl-pantalon' }, g);
    A.el('rect', { x: x + 1.5, y: PIES - 14, width: 5, height: 14, rx: 1.5, 'class': 'pl-pantalon' }, g);
    A.el('rect', { x: x - 9.5, y: c + 9, width: 19, height: 21, rx: 4, 'class': 'pl-camisa-primo' }, g);
    A.el('path', { d: 'M' + (x - 8.5) + ' ' + (c + 13) + ' L' + (x - 11.5) + ' ' + (c + 27) + ' M' + (x + 8.5) + ' ' + (c + 13) + ' L' + (x + 11.5) + ' ' + (c + 27), 'class': 'pl-brazo' }, g);
    A.el('circle', { cx: x, cy: c, r: G.r, 'class': 'pl-piel', 'data-cabeza': 'primo' }, g);
    A.el('path', { d: 'M' + (x - 8.2) + ' ' + (c - 2) + ' Q' + (x - 7.5) + ' ' + (c - 10) + ' ' + x + ' ' + (c - 10) + ' Q' + (x + 7.5) + ' ' + (c - 10) + ' ' + (x + 8.2) + ' ' + (c - 2) + ' Z', 'class': 'pl-gorra' }, g);
    A.el('path', { d: 'M' + (x - 8.2) + ' ' + (c - 2.6) + ' L' + (x - 14) + ' ' + (c - 1.2) + ' L' + (x - 8) + ' ' + (c - 0.6) + ' Z', 'class': 'pl-gorra' }, g);
    return g;
  }

  /* Un globo de dos renglones, con su cola hasta encima de la cabeza */
  function globo(A, padre, k) {
    var L = GLOBOS[k], x0 = L.x0, x1 = L.x1, y0 = GLOBO.y0, y1 = GLOBO.y1, pt = L.cola;
    var g = A.el('g', { 'data-globo': k }, padre);
    A.el('path', { d: 'M' + (x0 + 7) + ' ' + y0 + ' L' + (x1 - 7) + ' ' + y0 + ' Q' + x1 + ' ' + y0 + ' ' + x1 + ' ' + (y0 + 7) +
      ' L' + x1 + ' ' + (y1 - 7) + ' Q' + x1 + ' ' + y1 + ' ' + (x1 - 7) + ' ' + y1 + ' L' + (pt + 4) + ' ' + y1 +
      ' L' + pt + ' ' + L.colaY + ' L' + (pt - 4) + ' ' + y1 + ' L' + (x0 + 7) + ' ' + y1 +
      ' Q' + x0 + ' ' + y1 + ' ' + x0 + ' ' + (y1 - 7) + ' L' + x0 + ' ' + (y0 + 7) + ' Q' + x0 + ' ' + y0 + ' ' + (x0 + 7) + ' ' + y0 + ' Z',
      'class': 'pl-globo', 'data-globo-caja': '', 'data-punta-globo': pt + ' ' + L.colaY }, g);
    L.dice.forEach(function (t, i) { texto(A, g, (x0 + x1) / 2, GLOBO.bases[i], 'pl-letra', GLOBO.tam, 'middle', t).setAttribute('data-dice', String(i)); });
    return g;
  }

  /* Una cinta de película: el borde oscuro, sus agujeros en UN solo trazo
     (son decenas, iguales y quietos) y la parte clara de en medio */
  function cinta(A, padre, C, x0, x1) {
    A.el('rect', { x: x0, y: C.y0, width: x1 - x0, height: C.y1 - C.y0, rx: 1.5, 'class': 'pl-cinta', 'data-cinta-caja': '' }, padre);
    var hoyos = [], paso = 8, an = 3.2, al = 2.2;
    for (var hx = x0 + 3; hx + an <= x1 - 2; hx += paso) {
      [C.y0 + 1.3, C.y1 - 1.3 - al].forEach(function (hy) {
        hoyos.push('M' + r2(hx) + ' ' + r2(hy) + ' h' + an + ' v' + al + ' h' + (-an) + ' Z');
      });
    }
    A.el('path', { d: hoyos.join(' '), 'class': 'pl-hoyo' }, padre);
    A.el('rect', { x: x0, y: C.adentro[0], width: x1 - x0, height: C.adentro[1] - C.adentro[0], 'class': 'pl-luz', 'data-cinta-adentro': '' }, padre);
  }

  /* Los hitos de una cinta. Un año es un punto; un período, una franja.
     Los puntos que caerían casi encima de otro bajan a la otra fila. En la
     cinta de cerca, la idea y el chat van más grandes y con su color. */
  function hitos(A, padre, lista, X, filas, radio, invierno, dato, resalta) {
    var ultimo = [-99, -99], out = {};
    lista.forEach(function (o) {
      var n, k = o.h.clave;
      if (o.tipo === 'punto') {
        var cx = X(o.desde), f = cx - ultimo[0] >= radio * 2 + 2.4 || filas.length === 1 ? 0 : 1;
        ultimo[f] = cx;
        var r = resalta && resalta[k] ? resalta[k].radio : radio;
        n = A.el('circle', { cx: r2(cx), cy: filas[f], r: r, 'class': resalta && resalta[k] ? resalta[k].clase : 'pl-hito' }, padre);
      } else if (o.tipo === 'periodo') {
        var fp = filas.length > 1 ? 1 : 0, x0 = X(o.desde), x1 = X(o.hasta);
        n = A.el('rect', { x: r2(x0), y: r2(filas[fp] - radio * 0.85), width: r2(x1 - x0), height: r2(radio * 1.7), rx: r2(radio * 0.85), 'class': 'pl-hito' }, padre);
      } else {
        var w0 = X(o.desde), w1 = X(o.hasta);
        n = A.el('rect', { x: r2(w0), y: invierno[0], width: r2(w1 - w0), height: invierno[1] - invierno[0], 'class': 'pl-invierno' }, padre);
      }
      n.setAttribute(dato, k);
      n.setAttribute('data-tipo', o.tipo);
      out[k] = n;
    });
    return out;
  }

  /* Una llave debajo de la cinta, de a hasta b, con lo que dice */
  function llave(A, padre, k, a, b, dice) {
    var g = A.el('g', { 'data-llave': k }, padre), x0 = xa(a), x1 = xa(b), y = LLAVE.y;
    A.el('path', { d: 'M' + r2(x0) + ' ' + (y - LLAVE.alto) + ' L' + r2(x0) + ' ' + y + ' L' + r2(x1) + ' ' + y + ' L' + r2(x1) + ' ' + (y - LLAVE.alto),
      'class': 'pl-llave pl-llave-' + k, 'data-llave-raya': '' }, g);
    var cx = Math.min(Math.max((x0 + x1) / 2, 60), ANCHO - 60);
    texto(A, g, cx, LLAVE.base, 'pl-rotulo', LLAVE.tam, 'middle', dice).setAttribute('data-llave-dice', '');
    return g;
  }

  function construir(svg, A) {
    A.el('rect', { x: 0, y: 0, width: ANCHO, height: ALTO, 'class': 'am-fondo' }, svg);
    /* Las franjas de los inviernos no tienen borde: se desvanecen a los dos
       lados, porque nadie sabe el día en que empezaron ni el día en que
       terminaron. */
    var defs = A.el('defs', null, svg), grad = A.el('linearGradient', { id: 'plFrio', x1: '0', x2: '1', y1: '0', y2: '0' }, defs);
    [[0, 0], [0.22, 1], [0.78, 1], [1, 0]].forEach(function (q) {
      A.el('stop', { offset: String(q[0]), 'stop-color': '#60a5fa', 'stop-opacity': String(q[1]) }, grad);
    });

    /* Lo de arriba (la gente, la cinta y sus llaves) va en un grupo: sube
       para dejar sitio a lo de cerca */
    var ar = P.arriba = A.el('g', { 'data-arriba': '' }, svg);

    /* ── lo que vio cada uno: el cono, detrás de la gente ── */
    function cono(k, a, b) {
      var G = GENTE[k];
      return A.el('polygon', { points: [[G.x, G.cabeza], [r2(xa(b)), BARRA.y0], [r2(xa(a)), BARRA.y0]].map(function (q) { return q.join(','); }).join(' '),
        'class': 'pl-cono pl-cono-' + k, 'data-cono': k }, ar);
    }
    P.cono = { tio: cono('tio', INICIO, NOVENTA), primo: cono('primo', +CHAT.anio, HOY) };

    /* ── la gente y lo que dice ── */
    P.gente = { tio: tio(A, ar), kenia: kenia(A, ar), primo: primo(A, ar) };
    P.globo = { tio: globo(A, ar, 'tio'), primo: globo(A, ar, 'primo'), duda: globo(A, ar, 'duda'), entera: globo(A, ar, 'entera') };

    /* ── la regla: los años, arriba de la cinta ── */
    var marcas = [], d;
    for (d = INICIO; d <= HOY; d += 10) marcas.push('M' + r2(xa(d)) + ' ' + REGLA.y0 + ' L' + r2(xa(d)) + ' ' + REGLA.y1);
    marcas.push('M' + r2(xa(HOY)) + ' ' + REGLA.y0 + ' L' + r2(xa(HOY)) + ' ' + REGLA.y1);
    A.el('path', { d: marcas.join(' '), 'class': 'pl-marca', 'data-regla': 'cinta' }, ar);
    for (d = INICIO; d <= HOY; d += 10) {
      if (d % REGLA.rotulo !== 0 || xa(d) > xa(HOY) - 26) continue;
      texto(A, ar, xa(d), REGLA.base, 'pl-anio', REGLA.tam, 'middle', String(d)).setAttribute('data-anio', 'cinta');
    }
    texto(A, ar, xa(HOY), REGLA.base, 'pl-anio', REGLA.tam, 'end', 'hoy').setAttribute('data-hoy', 'cinta');

    /* ── la cinta, con sus hitos y tapada ── */
    var gc = A.el('g', { 'data-cinta': '' }, ar);
    cinta(A, gc, CINTA, CINTA.x0, CINTA.x1);
    /* la raya entre décadas: los cuadros de la película */
    var cuadros = [];
    for (d = INICIO + 10; d < HOY; d += 10) cuadros.push('M' + r2(xa(d)) + ' ' + CINTA.adentro[0] + ' L' + r2(xa(d)) + ' ' + CINTA.adentro[1]);
    A.el('path', { d: cuadros.join(' '), 'class': 'pl-cuadro' }, gc);
    P.hito = hitos(A, gc, HITOS, xa, CINTA.filas, CINTA.radio, CINTA.invierno, 'data-hito');
    /* los copos de los inviernos, encima de su franja */
    P.copo = {};
    HITOS.filter(function (o) { return o.tipo === 'invierno'; }).forEach(function (o) {
      var t = texto(A, gc, (xa(o.desde) + xa(o.hasta)) / 2, (CINTA.invierno[0] + CINTA.invierno[1]) / 2 + 3.4, 'pl-copo', 9.5, 'middle', '❄');
      t.setAttribute('data-copo', o.h.clave);
      P.copo[o.h.clave] = t;
    });
    /* lo tapado: tres pedazos que se ven como uno solo (se montan medio
       punto, para que no quede la costura). El corte del primo va justo
       antes del punto del chat: en el año mismo, el hueco tapaba medio
       punto. */
    var corteChat = xa(+CHAT.anio) - CINTA.radio - 1;
    P.velo = {};
    [['tio', xa(INICIO), xa(NOVENTA)], ['hueco', xa(NOVENTA), corteChat], ['primo', corteChat, xa(HOY)]].forEach(function (v) {
      var g = A.el('g', { 'data-velo': v[0] }, ar), x0 = v[1], x1 = v[2], monta = v[0] === 'tio' ? 0 : 0.5;
      A.el('rect', { x: r2(x0 - monta), y: CINTA.y0, width: r2(x1 - x0 + monta), height: CINTA.y1 - CINTA.y0,
        'class': 'pl-velo', 'data-velo-caja': '' }, g);
      if (x1 - x0 > 30) texto(A, g, (x0 + x1) / 2, (CINTA.y0 + CINTA.y1) / 2 + 4.5, 'pl-duda', 13, 'middle', '?');
      P.velo[v[0]] = g;
    });

    /* ── la barra encima de la cinta: el pedazo de cada uno ── */
    P.barra = {};
    [['tio', INICIO, NOVENTA], ['primo', +CHAT.anio, HOY]].forEach(function (v) {
      P.barra[v[0]] = A.el('rect', { x: r2(xa(v[1])), y: BARRA.y0, width: r2(xa(v[2]) - xa(v[1])), height: BARRA.y1 - BARRA.y0,
        'class': 'pl-barra pl-barra-' + v[0], 'data-barra': v[0] }, ar);
    });

    /* ── las llaves debajo de la cinta ── */
    P.llave = {
      hueco: llave(A, ar, 'hueco', NOVENTA, +CHAT.anio, 'no lo vio ninguno'),
      despues: llave(A, ar, 'despues', FIN_INVIERNOS, HOY, 'después de los inviernos'),
      entera: llave(A, ar, 'entera', INICIO, HOY, 'la película entera')
    };

    /* ── de cerca: el marco sobre la cinta va con lo de arriba ── */
    var lx0 = xa(CERCA) - 2, lx1 = xa(HOY) + LUPA.sale, M = GRANDE.marco;
    P.lupa = { marco: A.el('rect', { x: r2(lx0), y: LUPA.y0, width: r2(lx1 - lx0), height: LUPA.y1 - LUPA.y0, rx: 3, 'class': 'pl-lupa', 'data-lupa-marco': '' }, ar) };
    /* y lo demás, abajo y quieto: las rayas que bajan del marco (cuando lo
       de arriba ya subió) y la cinta grande */
    P.lupa.rayas = [[lx0, M.x0], [lx1, M.x1]].map(function (q) {
      return A.el('path', { d: 'M' + r2(q[0]) + ' ' + LUPA.y1 + ' L' + q[1] + ' ' + M.y0, 'class': 'pl-lupa-raya', 'data-lupa-raya': '' }, svg);
    });
    var gg = P.lupa.grande = A.el('g', { 'data-grande': '' }, svg);
    A.el('rect', { x: M.x0, y: M.y0, width: M.x1 - M.x0, height: M.y1 - M.y0, rx: 5, 'class': 'pl-lupa pl-lupa-fondo', 'data-grande-marco': '' }, gg);
    cinta(A, gg, GRANDE, GRANDE.x0, GRANDE.x1);
    var R = GRANDE.regla, mayor = [], menor = [];
    for (d = CERCA; d <= HOY; d++) (d % 5 === 0 ? mayor : menor).push('M' + r2(xg(d)) + ' ' + R.y0 + ' L' + r2(xg(d)) + ' ' + (d % 5 === 0 ? R.y1 : R.menor));
    mayor.push('M' + r2(xg(HOY)) + ' ' + R.y0 + ' L' + r2(xg(HOY)) + ' ' + R.y1);
    A.el('path', { d: mayor.join(' '), 'class': 'pl-marca', 'data-regla': 'grande' }, gg);
    A.el('path', { d: menor.join(' '), 'class': 'pl-marca pl-marca-menor', 'data-regla': 'grande-menor' }, gg);
    for (d = CERCA; d <= HOY; d += 5) {
      if (xg(d) > xg(HOY) - 26) continue;
      texto(A, gg, xg(d), R.base, 'pl-anio', R.tam, 'middle', String(d)).setAttribute('data-anio', 'grande');
    }
    texto(A, gg, xg(HOY), R.base, 'pl-anio', R.tam, 'end', 'hoy').setAttribute('data-hoy', 'grande');
    var resalta = {};
    resalta[IDEA.clave] = { radio: GRANDE.grande, clase: 'pl-hito-idea' };
    resalta[CHAT.clave] = { radio: GRANDE.grande, clase: 'pl-hito-chat' };
    P.cerca = hitos(A, svg, PEDAZO.cerca, xg, [GRANDE.fila], GRANDE.radio, null, 'data-hito-cerca', resalta);
    /* la idea y el día que llegó a todos, cada una encima de su punto, y el
       arco de la una a la otra con los años de en medio */
    var xi = xg(+IDEA.anio), xc = xg(+CHAT.anio);
    P.idea = texto(A, svg, xi, ARCO.rotulo, 'pl-rotulo pl-rotulo-idea', ARCO.tam, 'middle', 'la idea');
    P.idea.setAttribute('data-cerca-dice', 'idea');
    P.todos = texto(A, svg, xc, ARCO.rotulo, 'pl-rotulo pl-rotulo-chat', ARCO.tam, 'middle', 'llega a todos');
    P.todos.setAttribute('data-cerca-dice', 'todos');
    P.arco = A.el('path', { d: 'M' + r2(xc) + ' ' + ARCO.pie + ' Q' + r2((xi + xc) / 2) + ' ' + ARCO.control + ' ' + r2(xi) + ' ' + ARCO.pie,
      'class': 'pl-arco', 'data-arco': '' }, svg);
    P.arcoDice = texto(A, svg, (xi + xc) / 2, ARCO.base, 'pl-rotulo', ARCO.tam, 'middle', ANTES + ' años');
    P.arcoDice.setAttribute('data-arco-dice', '');
  }

  /* ── los estados ───────────────────────────────────────────── */
  /* Al TERMINAR cada paso: qué pedazos siguen tapados, qué se ve encima de
     la cinta, qué llave hay debajo y si se ve de cerca. */
  var ESTADOS = [
    { tapa: { tio: true, hueco: true, primo: true }, vio: { tio: false, primo: false }, llave: null, cerca: false, kenia: 'duda' },
    { tapa: { tio: true, hueco: true, primo: false }, vio: { tio: false, primo: true }, llave: null, cerca: false, kenia: 'duda' },
    { tapa: { tio: false, hueco: true, primo: false }, vio: { tio: true, primo: true }, llave: null, cerca: false, kenia: 'duda' },
    { tapa: { tio: false, hueco: false, primo: false }, vio: { tio: true, primo: true }, llave: 'hueco', cerca: false, kenia: 'duda' },
    { tapa: { tio: false, hueco: false, primo: false }, vio: { tio: true, primo: true }, llave: 'despues', cerca: false, kenia: 'duda' },
    { tapa: { tio: false, hueco: false, primo: false }, vio: { tio: true, primo: true }, llave: null, cerca: true, kenia: 'duda' },
    { tapa: { tio: false, hueco: false, primo: false }, vio: { tio: true, primo: true }, llave: 'entera', cerca: false, kenia: 'entera' }
  ];
  function con(s, cambios) { var o = {}, k; for (k in s) o[k] = s[k]; for (k in cambios) o[k] = cambios[k]; return o; }
  function deQuien(o) { return o.desde >= +CHAT.anio ? 'primo' : o.hasta <= NOVENTA ? 'tio' : 'hueco'; }
  function cercaTodo() {
    var l = [P.lupa.marco, P.lupa.grande, P.idea, P.todos, P.arco, P.arcoDice].concat(P.lupa.rayas);
    Object.keys(P.cerca).forEach(function (k) { l.push(P.cerca[k]); });
    return l;
  }

  function todo() {
    var l = [P.arriba, P.cono.tio, P.cono.primo, P.barra.tio, P.barra.primo, P.globo.duda, P.globo.entera].concat(cercaTodo());
    Object.keys(P.velo).forEach(function (k) { l.push(P.velo[k]); });
    Object.keys(P.llave).forEach(function (k) { l.push(P.llave[k]); });
    Object.keys(P.hito).forEach(function (k) { l.push(P.hito[k]); });
    Object.keys(P.copo).forEach(function (k) { l.push(P.copo[k]); });
    return l;
  }
  function deGolpe(A, piezas, hazlo) {
    piezas.forEach(function (p) { p.classList.add('am-quieto'); });
    hazlo();
    A.asentar();
    piezas.forEach(function (p) { p.classList.remove('am-quieto'); });
  }
  function base(A, s) {
    deGolpe(A, todo(), function () {
      A.mover(P.arriba, 0, s.cerca ? 0 : ARRIBA, 0, 1, 0);
      Object.keys(P.velo).forEach(function (k) { A.ver(P.velo[k], s.tapa[k], 0); });
      HITOS.forEach(function (o) {
        var ve = !s.tapa[deQuien(o)];
        A.ver(P.hito[o.h.clave], ve, 0);
        if (P.copo[o.h.clave]) A.ver(P.copo[o.h.clave], ve, 0);
      });
      ['tio', 'primo'].forEach(function (k) {
        A.ver(P.cono[k], s.vio[k], 0);
        A.ver(P.barra[k], s.vio[k], 0);
      });
      Object.keys(P.llave).forEach(function (k) { A.ver(P.llave[k], s.llave === k, 0); });
      cercaTodo().forEach(function (q) { A.ver(q, s.cerca, 0); });
      A.trazar(P.arco, s.cerca, 0);
      A.ver(P.globo.duda, s.kenia === 'duda', 0);
      A.ver(P.globo.entera, s.kenia === 'entera', 0);
    });
  }
  /* Se destapa un pedazo: su cono y su barra, se va lo que lo tapaba y
     aparecen sus hitos, uno por uno y por orden de año */
  function destapar(A, k, T) {
    A.ver(P.cono[k], true, T.cono);
    A.ver(P.barra[k], true, T.cono);
    A.ver(P.velo[k], false, T.velo);
    HITOS.filter(function (o) { return deQuien(o) === k; }).forEach(function (o, i) {
      A.ver(P.hito[o.h.clave], true, T.hito + T.cada * i);
      if (P.copo[o.h.clave]) A.ver(P.copo[o.h.clave], true, T.hito + T.cada * i);
    });
  }

  function pintar(n, antes, A) {
    var entra = function (k) { return n === k && antes !== k; };
    /* Los pasos que cuentan algo se cuentan cada vez que se ENTRA en ellos,
       también volviendo con «Atrás»; el 0 se pinta siempre, también en el
       primer pintado. Lo que arranca de golpe no puede traer piezas que se
       van en ese mismo paso: aparecerían un instante y se irían (por eso el
       `con`). */
    if (n >= 1 && !entra(n)) return;
    if (n === 0) { base(A, ESTADOS[0]); return; }
    if (n === 1) { base(A, ESTADOS[0]); destapar(A, 'primo', T1); return; }
    if (n === 2) { base(A, ESTADOS[1]); destapar(A, 'tio', T2); return; }
    if (n === 3) {
      base(A, ESTADOS[2]);
      A.ver(P.llave.hueco, true, T3.llave);
      A.ver(P.velo.hueco, false, T3.velo);
      HITOS.filter(function (o) { return deQuien(o) === 'hueco'; }).forEach(function (o, i) { A.ver(P.hito[o.h.clave], true, T3.hito + T3.cada * i); });
      return;
    }
    if (n === 4) {
      base(A, antes === 3 ? ESTADOS[3] : con(ESTADOS[3], { llave: null }));
      A.ver(P.llave.hueco, false, T4.sale);
      A.ver(P.llave.despues, true, T4.llave);
      return;
    }
    if (n === 5) {
      /* lo de arriba sube para dejar sitio, y después se mira de cerca */
      base(A, antes === 4 ? ESTADOS[4] : con(ESTADOS[4], { llave: null }));
      A.ver(P.llave.despues, false, T5.sale);
      A.mover(P.arriba, 0, 0, 0, 1, T5.sube);
      A.ver(P.lupa.marco, true, T5.marco);
      P.lupa.rayas.forEach(function (r) { A.ver(r, true, T5.rayas); });
      A.ver(P.lupa.grande, true, T5.cerca);
      PEDAZO.cerca.forEach(function (o, i) { A.ver(P.cerca[o.h.clave], true, T5.hito + T5.cada * i); });
      A.ver(P.idea, true, T5.idea);
      A.ver(P.todos, true, T5.todos);
      A.ver(P.arco, true, T5.arco);
      A.trazar(P.arco, true, T5.arco);
      A.ver(P.arcoDice, true, T5.dice);
      return;
    }
    /* el 6: se va lo de cerca, lo de arriba baja, y la película entera */
    base(A, antes === 5 ? ESTADOS[5] : con(ESTADOS[5], { cerca: false }));
    cercaTodo().forEach(function (q) { A.ver(q, false, T6.sale); });
    A.mover(P.arriba, 0, ARRIBA, 0, 1, T6.baja);
    A.ver(P.llave.entera, true, T6.llave);
    A.ver(P.globo.duda, false, T6.globo - APAGA);
    A.ver(P.globo.entera, true, T6.globo);
  }

  var CHATA = CHAT.anio;
  var FRASES = [
    'El tío y el primo dicen lo contrario. Cada uno vio un pedazo de esta película. ¿Cuál vio cada uno?',
    'El primo vio desde ' + CHATA + ' hasta hoy: ' + enLetra(PEDAZO.primo.length) + ' hitos. Para él, ahí empieza la película.',
    'El tío estudió en los noventa: vio ' + enLetra(PEDAZO.tio.length) + ' hitos. Dos son inviernos, cuando casi se paró todo.',
    'Entre los dos queda un hueco que no vio ninguno: ' + enLetra(PEDAZO.hueco.length) + ' hitos.',
    'Los inviernos no fueron el final: después vinieron ' + enLetra(PEDAZO.despues.length) + ' hitos, y esta vez funcionó. El tío no vio ninguno.',
    'La idea del chat es de ' + enLetra(ANTES) + ' años antes: estaba en el hueco. El primo vio el día que llegó a todos.',
    'Cada uno vio un pedazo y creyó que era la película entera. ¿Y un adulto de tu casa? Pregúntale qué pedazo vio.'
  ];
  var BOTONES = ['🧢 Lo que vio el primo', '👓 Lo que vio el tío', '🕳️ El hueco', '❄️ ¿Y después?', '🔍 De cerca', '🎬 La película entera', '↺ Empezar otra vez'];
  var MARCADOR = [
    [String(HITOS.length), 'hitos en la película, todos tapados'],
    [String(PEDAZO.primo.length), 'hitos que vio el primo'],
    [String(PEDAZO.tio.length), 'hitos que vio el tío'],
    [String(PEDAZO.hueco.length), 'hitos que no vio ninguno'],
    [String(PEDAZO.despues.length), 'hitos después de los inviernos'],
    [String(ANTES), 'años entre la idea y el chat'],
    [String(HITOS.length), 'hitos en la película entera']
  ];

  AnimacionMision.montar('#amPelicula', {
    vista: [ANCHO, ALTO],
    describe: 'La línea del tiempo de la Inteligencia Artificial, tapada como una película. El primo vio desde ' + CHATA +
      ' hasta hoy, y el tío desde el principio hasta los noventa, con los dos inviernos. Entre los dos queda un hueco que no vio ninguno. ' +
      'Después de los inviernos vienen ' + enLetra(PEDAZO.despues.length) + ' hitos, y la idea del chat es de ' + enLetra(ANTES) + ' años antes.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return { cifra: MARCADOR[n][0], palabras: MARCADOR[n][1] }; }
  });
})();
