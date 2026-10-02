/* ============================================================
   Animación de «El Himno Nacional de Honduras» · el coro pinta el Escudo
   ------------------------------------------------------------
   La segunda mitad del coro no cuenta nada: pinta. Son cuatro versos y
   tres cosas del Escudo, una detrás de otra, y esta escena las busca en
   el Escudo de verdad con una lupa:

     0  el Escudo y la pregunta: ¿qué tres cosas nombra el coro?;
     1  el mar: la lupa baja a las olas, y salen las palabras difíciles de
        esos dos versos con lo que quieren decir;
     2  el volcán, entre las dos torres;
     3  el astro, que es el sol, detrás de la cima del volcán;
     4  las tres juntas, cada una con su nombre, y el dibujo para el cuaderno.

   Seis decisiones, y ninguna es de adorno:

   1. ⚠️ **El Escudo es la imagen real** (img/honduras_img/simbolos/
      escudo.webp), completa y sin retocar. La normativa de los símbolos
      patrios es clara: se muestran completos o no se muestran, y un escudo
      dibujado aquí sería una versión «parecida». La lupa agranda un pedazo,
      pero el Escudo entero sigue a la vista al lado.
   2. **Dónde está cada cosa se midió sobre la imagen** (en sus píxeles,
      262 × 346) y vive en PARTES. Si la imagen cambia, se mide otra vez: la
      sonda comprueba que cada aro caiga dentro del dibujo del Escudo.
   3. ⚠️ **La letra no se escribe aquí**: los versos se citan de himno.js
      (coro, versos 5 a 8) y lo que quiere decir cada palabra difícil sale de
      su lista `palabras`. verifica-himno busca en este archivo cualquier
      tirada de cuatro palabras del Himno y se pone roja si la encuentra.
   4. **Lo que no dice el Himno no se dice**: ni colores ni medidas del
      Escudo, ni lo que significa cada pieza. El coro nombra tres cosas, y la
      explicación de la misión dice dónde está cada una («el volcán entre las
      torres», «el sol naciente» sobre la cima).
   5. **La lupa se mueve, no se cambia**: el mismo Escudo, agrandado, va de
      una cosa a la otra (una sola pieza con su transformación), así se ve
      que es el mismo dibujo y no otro.
   6. **Nada se dice solo con color**: cada aro tiene su nombre en la
      columna de la derecha, y lo que todavía no se encontró va con raya
      cortada y un «?».
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || !document.getElementById('amEscudo')) return;
  if (typeof HIMNO === 'undefined') return;

  var ANCHO = 320, ALTO = 160;
  var CORO = HIMNO.filter(function (e) { return e.clave === 'coro'; })[0];
  if (!CORO || CORO.versos.length !== 8) return;
  function verso(i) { return CORO.versos[i].replace(/[.,;:]+$/, ''); }
  function glosa(p) {
    var g = (CORO.palabras || []).filter(function (w) { return w.p === p; })[0];
    return g ? g.s : '';
  }
  /* Las palabras que se explican tienen que estar en su verso y en la lista
     de himno.js; si no, no hay escena. */
  var GLOSAS = { mar: ['rumoroso', 'bravías', 'escuda'], astro: ['astro'] };
  var V = { mar: [4, 5], volcan: [6], astro: [7] };
  var bien = Object.keys(GLOSAS).every(function (k) {
    return GLOSAS[k].every(function (p) {
      return glosa(p) && V[k].some(function (i) { return CORO.versos[i].indexOf(p) >= 0; });
    });
  }) && /\bmar\b/.test(CORO.versos[4]) && /volcán/.test(CORO.versos[6]) && /astro/.test(CORO.versos[7]);
  if (!bien) return;

  /* ── El Escudo: la imagen y dónde está cada cosa en ella ── */
  var IMG = { src: '../../img/honduras_img/simbolos/escudo.webp', w: 262, h: 346 };
  var E0 = [6, 5], K = 150 / IMG.h;                 // dónde va y a qué tamaño
  function ep(q) { return [E0[0] + q[0] * K, E0[1] + q[1] * K]; }
  var PARTES = [
    { clave: 'mar', centro: [128, 234], rx: 47, ry: 17, ve: 30, icono: '🌊', nombre: 'mar' },
    { clave: 'volcan', centro: [129, 194], rx: 19, ry: 13, ve: 24, icono: '🌋', nombre: 'volcán' },
    { clave: 'astro', centro: [128.5, 170.5], rx: 13, ry: 13, ve: 21, icono: '☀️', nombre: 'sol' }
  ];
  /* `ve`: cuánto Escudo cabe en la lupa, del centro a la orilla (en píxeles
     de la imagen). Del sol se ve un poco más de lo que mide, porque la imagen
     es chica y agrandada de más se vuelve una mancha. */
  var LUPA = { x: 205, y: 66, r: 45 };
  function zoomDe(p) { return LUPA.r / p.ve; }
  function r2(v) { return Math.round(v * 100) / 100; }

  var P = { aros: [], conos: [], textos: [], fichas: [], vacias: [], hilos: [] };

  function texto(A, padre, x, y, clase, tam, ancla, contenido, extra) {
    var a = { x: r2(x), y: r2(y), 'class': clase, 'font-size': tam, 'text-anchor': ancla || 'middle' };
    for (var k in extra) a[k] = extra[k];
    var n = A.el('text', a, padre);
    n.textContent = contenido;
    return n;
  }

  function construir(svg, A) {
    var defs = A.el('defs', {}, svg);
    var recorte = A.el('clipPath', { id: 'veLupa' }, defs);
    A.el('circle', { cx: LUPA.x, cy: LUPA.y, r: LUPA.r }, recorte);

    /* el Escudo entero */
    A.el('image', { href: IMG.src, x: E0[0], y: E0[1], width: r2(IMG.w * K), height: r2(IMG.h * K), 'data-escudo': '', preserveAspectRatio: 'none' }, svg);

    /* los conos de la lupa, por debajo de la lupa */
    PARTES.forEach(function (p, k) {
      var c = ep(p.centro), rx = p.rx * K, ry = p.ry * K;
      var g = A.el('g', { 'data-cono': p.clave }, svg);
      var a1 = [c[0] + rx * 0.72, c[1] - ry * 0.72], a2 = [c[0] + rx * 0.72, c[1] + ry * 0.72];
      var b1 = [LUPA.x - LUPA.r * 0.72, LUPA.y - LUPA.r * 0.72], b2 = [LUPA.x - LUPA.r * 0.72, LUPA.y + LUPA.r * 0.72];
      A.el('path', { d: 'M' + r2(a1[0]) + ' ' + r2(a1[1]) + ' L' + r2(b1[0]) + ' ' + r2(b1[1]) + ' M' + r2(a2[0]) + ' ' + r2(a2[1]) + ' L' + r2(b2[0]) + ' ' + r2(b2[1]), 'class': 've-cono' }, g);
      P.conos.push(g);
    });

    /* los aros sobre el Escudo */
    PARTES.forEach(function (p) {
      var c = ep(p.centro);
      var g = A.el('g', { 'data-aro': p.clave }, svg);
      A.el('ellipse', { cx: r2(c[0]), cy: r2(c[1]), rx: r2(p.rx * K + 1.5), ry: r2(p.ry * K + 1.5), 'class': 've-aro-halo' }, g);
      A.el('ellipse', { cx: r2(c[0]), cy: r2(c[1]), rx: r2(p.rx * K + 1.5), ry: r2(p.ry * K + 1.5), 'class': 've-aro' }, g);
      P.aros.push(g);
    });

    /* la lupa: el mismo Escudo, agrandado, que se mueve de una cosa a otra */
    P.lupa = A.el('g', { 'data-lupa': '' }, svg);
    var mango = [LUPA.x + LUPA.r * 0.72, LUPA.y + LUPA.r * 0.72];
    A.el('path', { d: 'M' + r2(mango[0]) + ' ' + r2(mango[1]) + ' l14 14', 'class': 've-mango' }, P.lupa);
    A.el('circle', { cx: LUPA.x, cy: LUPA.y, r: LUPA.r, 'class': 've-vidrio' }, P.lupa);
    var dentro = A.el('g', { 'clip-path': 'url(#veLupa)' }, P.lupa);
    P.lupaImg = A.el('g', { 'data-lupa-img': '' }, dentro);
    A.el('image', { href: IMG.src, x: 0, y: 0, width: IMG.w, height: IMG.h, preserveAspectRatio: 'none' }, P.lupaImg);
    A.el('circle', { cx: LUPA.x, cy: LUPA.y, r: LUPA.r, 'class': 've-aro-lupa' }, P.lupa);

    /* lo que dice cada cosa, debajo de la lupa */
    var lineas = {
      mar: GLOSAS.mar.map(function (p) { return p + ': ' + glosa(p).charAt(0).toLowerCase() + glosa(p).slice(1); }),
      volcan: ['el volcán, entre las dos torres'],
      astro: (function () {
        var g = glosa('astro'), i = g.indexOf('; ');
        return i > 0 ? ['astro: ' + g.slice(0, i).toLowerCase(), g.slice(i + 2)] : ['astro: ' + g.toLowerCase()];
      })()
    };
    PARTES.forEach(function (p) {
      var g = A.el('g', { 'data-texto': p.clave }, svg);
      lineas[p.clave].forEach(function (l, i) {
        texto(A, g, 214, 125 + i * 11, 've-rotulo' + (i === 0 && p.clave !== 'mar' ? ' ve-rotulo-fuerte' : ''), 7.6, 'middle', l);
      });
      P.textos.push(g);
    });

    /* la columna de lo encontrado: un renglón por cosa, vacío hasta que se
       encuentra; y en el último paso, un hilo de cada renglón a su aro. Se
       llena de ABAJO hacia arriba: el mar está más abajo en el Escudo que
       el volcán, y el volcán más que el sol, así los hilos no se cruzan. */
    PARTES.forEach(function (p, k) {
      var y = 14 + (PARTES.length - 1 - k) * 20;
      var hilo = A.el('path', { d: '', 'class': 've-hilo', 'data-hilo': p.clave }, svg);
      var c = ep(p.centro), x0 = c[0] + p.rx * K + 1.5;
      hilo.setAttribute('d', 'M' + r2(x0) + ' ' + r2(c[1]) + ' C' + r2(x0 + 60) + ' ' + r2(c[1]) + ' ' + r2(220) + ' ' + r2(y + 7) + ' 262 ' + r2(y + 7));
      P.hilos.push(hilo);
      var v = A.el('g', { 'data-vacia': p.clave }, svg);
      A.el('rect', { x: 262, y: y, width: 54, height: 14, rx: 7, 'class': 've-ficha ve-ficha-vacia' }, v);
      texto(A, v, 289, y + 10, 've-ficha-txt ve-suave', 8, 'middle', '?');
      P.vacias.push(v);
      var f = A.el('g', { 'data-ficha': p.clave }, svg);
      A.el('rect', { x: 262, y: y, width: 54, height: 14, rx: 7, 'class': 've-ficha' }, f);
      texto(A, f, 269, y + 10.2, 've-emoji', 8.5, 'middle', p.icono);
      texto(A, f, 296, y + 10, 've-ficha-txt', 8, 'middle', p.nombre);
      P.fichas.push(f);
    });
  }

  /* ── Los estados ───────────────────────────────────────────── */
  /* parte: la que mira la lupa (−1: ninguna); halladas: cuántas ya se
     encontraron; todas: el último paso, con los tres aros y sus hilos. */
  var ESTADOS = [
    { parte: -1, halladas: 0, todas: false },
    { parte: 0, halladas: 1, todas: false },
    { parte: 1, halladas: 2, todas: false },
    { parte: 2, halladas: 3, todas: false },
    { parte: -1, halladas: 3, todas: true }
  ];
  function apuntar(A, k, d) {
    var p = PARTES[k], z = zoomDe(p);
    A.mover(P.lupaImg, LUPA.x - p.centro[0] * z, LUPA.y - p.centro[1] * z, 0, z, d);
  }
  function poner(A, E, d) {
    A.ver(P.lupa, E.parte >= 0, d);
    if (E.parte >= 0) apuntar(A, E.parte, d);
    PARTES.forEach(function (p, k) {
      A.ver(P.aros[k], E.todas || E.parte === k, d);
      A.ver(P.conos[k], E.parte === k, d);
      A.ver(P.textos[k], E.parte === k, d);
      A.ver(P.fichas[k], k < E.halladas, d);
      A.ver(P.vacias[k], k >= E.halladas, d);
      A.ver(P.hilos[k], E.todas, d);
      A.trazar(P.hilos[k], E.todas, d);
    });
  }
  function base(A, E) {
    var yaQuieto = A.quieto();
    if (!yaQuieto) A.svg.classList.add('am-quieto');
    poner(A, E, 0);
    A.asentar();
    if (!yaQuieto) A.svg.classList.remove('am-quieto');
  }

  function pintar(n, antes, A) {
    var E = ESTADOS[n];
    /* Cada paso se cuenta cada vez que se ENTRA en él, también volviendo
       con «Atrás»; el primer pintado solo pone cada cosa en su sitio. */
    if (n === antes || n === 0) { base(A, E); return; }
    var Ea = ESTADOS[n - 1];
    base(A, Ea);
    var k = E.parte;
    if (k >= 0) {
      /* lo de antes se va; el aro aparece; la lupa llega (o se mueve) a la
         cosa nueva; después, lo que dice, y al final su renglón */
      if (Ea.parte >= 0) { A.ver(P.aros[Ea.parte], false, 0); A.ver(P.conos[Ea.parte], false, 0); A.ver(P.textos[Ea.parte], false, 0); }
      A.ver(P.aros[k], true, 250);
      if (Ea.parte < 0) {
        apuntar(A, k, 0);
        A.ver(P.lupa, true, 450);
      } else {
        apuntar(A, k, 400);
      }
      A.ver(P.conos[k], true, 1100);
      A.ver(P.textos[k], true, 1300);
      A.ver(P.vacias[k], false, 1600);
      A.ver(P.fichas[k], true, 1700);
      return;
    }
    /* n === 4: la lupa se guarda y salen los tres aros, cada uno con su hilo */
    A.ver(P.aros[Ea.parte], false, 0); A.ver(P.conos[Ea.parte], false, 0); A.ver(P.textos[Ea.parte], false, 0);
    A.ver(P.lupa, false, 0);
    PARTES.forEach(function (p, i) {
      A.ver(P.aros[i], true, 500 + i * 450);
      A.ver(P.hilos[i], true, 500 + i * 450);
      A.trazar(P.hilos[i], true, 650 + i * 450);
    });
  }

  var FRASES = [
    'El coro termina pintando el Escudo, en cuatro versos. ¿Qué tres cosas nombra? Búscalas en el dibujo antes de tocar.',
    'El «emblema» es el Escudo: «' + verso(4) + ' ' + verso(5) + '». Un mar lo protege con sus olas.',
    'Después: «' + verso(6) + '». En el Escudo, el volcán está entre las dos torres.',
    'Y la última: «' + verso(7) + '». Ese astro es el sol, que sale detrás de la cima del volcán.',
    'Mar, volcán y sol: los cuatro versos pintan el Escudo. Dibújalo en tu cuaderno, y escribe junto a cada cosa su verso.'
  ];
  var BOTONES = ['🌊 La primera cosa', '🌋 La segunda', '☀️ La tercera', '🛡️ Las tres', '↺ Empezar otra vez'];
  var MARCADOR = [
    { cifra: '?', palabras: 'tres cosas del Escudo, en cuatro versos' },
    { cifra: '1', palabras: 'de 3: el mar, que lo protege' },
    { cifra: '2', palabras: 'de 3: el volcán, entre dos torres' },
    { cifra: '3', palabras: 'de 3: el astro, que es el sol' },
    { cifra: '3', palabras: 'cosas, y cada una con su verso' }
  ];

  AnimacionMision.montar('#amEscudo', {
    vista: [ANCHO, ALTO],
    describe: 'El Escudo de Honduras y una lupa. El coro nombra tres cosas del Escudo: el mar, que lo protege con sus olas; el volcán, entre las dos torres; y el astro, que es el sol, detrás de la cima del volcán.',
    pasos: FRASES.length,
    construir: construir,
    pintar: pintar,
    texto: function (n) { return FRASES[n]; },
    boton: function (n) { return BOTONES[n]; },
    atajo: function () { return null; },
    marcador: function (n) { return MARCADOR[n]; }
  });
})();
