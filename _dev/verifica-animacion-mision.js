#!/usr/bin/env node
/* ============================================================
   M.E.T.A.S · La animación que explica el tema, abierta y tocada
   ------------------------------------------------------------
   verifica-animaciones lee los archivos; esta abre cada misión que
   monta la animación y la recorre ENTERA con el dedo (clics de
   verdad, no llamando a la función), en un teléfono de 360 px.

   Lo que vigila, en todas:

   1. Que cada paso diga algo distinto, con frases de 25 palabras o
      menos: la misma vara que la ruta de IA, porque esto lo lee el
      alumno de cuarto.
      Y que ninguna cuenta de la frase («315 ÷ 4.5 = 70») se parta entre
      dos renglones: cortada después del ÷ se lee como dos cosas.
   2. Que «Atrás» vuelva, que el último paso empiece otra vez, y que
      Enter y la barra espaciadora avancen sin deslizar la página.
   3. Que con «reducir movimiento» no se mueva nada y sin él sí.
   4. Que nada se salga del teléfono, que todo botón mida 44 px y que la
      letra blanca del botón que avanza se lea en todo su degradado.
   5. Que mirarla no dé XP ni llame a fin(), y que no reviente nada
      (ni un error de JavaScript).

   Y lo que es de CADA escena, que es lo que de verdad cuesta caro:
   ⚠️ **lo que el marcador dice, el dibujo lo tiene.** En Números
   Grandes se cuentan los huevos uno por uno en cada paso —los de
   las filas, los de la tabla, los que quedan con raya cortada— y
   en el camino al millón se suma lo que vale cada cuadro que se ve.
   Una animación que dice un número y enseña otro enseña a no
   creerle a la pantalla. Así se cazó, antes de publicar, que las
   nueve filas del diez mil y del millón no salían nunca: el marcador
   decía 10,000 y el dibujo enseñaba mil.
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const { abrir, SIN_SW } = require('./lib-navegador');

const BASE = process.env.METAS_BASE || process.env.BASE || 'http://localhost:8123';
const RAIZ = path.resolve(__dirname, '..');

let fallos = 0;
const ok = (bien, txt, extra) => {
  if (!bien) fallos++;
  console.log((bien ? '  ✓ ' : '  ✘ ') + txt + (extra !== undefined ? '  → ' + JSON.stringify(extra) : ''));
};

/* Las misiones que la montan: se cuentan leyendo, no se escriben aquí. */
const misiones = [];
for (const dir of fs.readdirSync(path.join(RAIZ, 'misiones'))) {
  const carpeta = path.join(RAIZ, 'misiones', dir);
  if (!fs.statSync(carpeta).isDirectory()) continue;
  for (const f of fs.readdirSync(carpeta)) {
    if (!f.endsWith('.html')) continue;
    const html = fs.readFileSync(path.join(carpeta, f), 'utf8');
    const m = html.match(/<div\b[^>]*\bdata-animacion\b[^>]*>[\s\S]*?<div\b[^>]*\bid="([^"]+)"/);
    if (m) misiones.push({ url: `misiones/${dir}/${encodeURI(f)}`, id: m[1] });
  }
}

/* ── lo que se mide dentro de la página ─────────────────────── */
/* Visible de verdad: ni transparente, ni escondido, ni él ni ninguno de
   sus padres hasta el <svg>. Una fila metida en una capa apagada está
   «encendida» por sí misma y no se ve: por eso se sube por los padres. */
const LEER = `
  window.__amVisible = function (el) {
    for (var e = el; e && e.tagName && e.tagName.toLowerCase() !== 'svg'; e = e.parentNode) {
      var cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.99) return false;
    }
    return true;
  };
  /* Lo que cada escena necesita que se mida, además de lo de todas. */
  window.__amExtra = {
    amLibreta: function (raiz, centro) {
      var vis = window.__amVisible;
      function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
      return {
        cols: todos('.vp-col').map(function (c) { return { x: centro(c).x, lugar: +c.getAttribute('data-lugar') }; }),
        lugares: todos('.vp-lugarval').map(function (c) { return { x: centro(c).x, lugar: +c.getAttribute('data-lugar') }; })
          .sort(function (a, b) { return a.x - b.x; }).map(function (c) { return c.lugar; }),
        cartas: todos('.vp-carta').map(function (g) {
          var r = g.querySelector('rect');
          return { x: centro(r).x, cifra: +g.getAttribute('data-cifra'), caida: r.classList.contains('am-roto'),
                   raya: getComputedStyle(r).strokeDasharray,
                   valores: [].filter.call(g.querySelectorAll('.vp-valor'), vis).map(function (v) { return +v.getAttribute('data-valor'); }) };
        }),
        flechas: todos('.vp-flecha').length,
        comas: todos('.vp-coma').map(function (c) { return centro(c).x; }),
        sumas: todos('.vp-suma').map(function (t) { return t.textContent; }),
        tramos: todos('.vp-tramo').map(function (t) { return t.getBoundingClientRect().width; }),
        marvin: (todos('.vp-marvin')[0] || { getBoundingClientRect: function () { return { width: 0 }; } }).getBoundingClientRect().width
      };
    }
  };
  window.__amExtra.amVara = function (raiz, centro) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), s = svg.getBoundingClientRect(), k = s.width / svg.viewBox.baseVal.width;
    function enVista(b) { return { x0: (b.left - s.left) / k, x1: (b.right - s.left) / k, y0: (b.top - s.top) / k, y1: (b.bottom - s.top) / k }; }
    function salto(p) {
      var g = p.parentNode, t = g.querySelector('.rn-salto-num');
      return { caja: enVista(p.getBoundingClientRect()), de: +p.getAttribute('data-de'), a: +p.getAttribute('data-a'), dice: t ? t.textContent : '' };
    }
    var agua = raiz.querySelector('.rn-agua');
    return {
      marcasV: todos('.rn-marca').map(function (t) { var c = centro(t); return { v: +t.getAttribute('data-v'), x: c.x, y: c.y }; }),
      marcasH: todos('.rn-marca-h').map(function (t) { var c = centro(t); return { v: +t.getAttribute('data-v'), x: c.x, y: c.y }; }),
      agua: vis(agua) ? enVista(agua.getBoundingClientRect()).y0 : null,
      saltos: [].filter.call(raiz.querySelectorAll('.rn-salto'), function (p) { return vis(p.parentNode); }).map(salto),
      cuentas: todos('.rn-cuenta').map(function (t) { return t.textContent; }),
      puntos: todos('.rn-punto').map(function (c) { var q = centro(c); return { v: +c.getAttribute('data-v'), x: q.x, y: q.y }; }),
      rana: todos('.rn-rana').map(function (g) { return centro(g.querySelector('text')).x; })[0]
    };
  };
  window.__amExtra.amReparto = function (raiz, centro) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    return {
      platos: todos('.tn-plato').map(function (p) { return centro(p).x; }).sort(function (a, b) { return a - b; }),
      cuadernos: todos('.tn-cuaderno').map(function (g) { return centro(g); }),
      lapices: todos('.tn-lapiz').map(function (g) { return centro(g); }),
      sobran: todos('.tn-sobran').map(function (t) { return { que: t.getAttribute('data-que'), n: +t.getAttribute('data-n'), texto: t.textContent }; }),
      chips: todos('.tn-chip').map(function (g) {
        return { fila: +g.getAttribute('data-fila'), v: +g.getAttribute('data-v'), x: centro(g).x, dice: g.textContent.trim(),
                 marcada: vis(g.querySelector('.tn-marca')) };
      }),
      comunes: todos('.tn-comun').map(function (g) { return { v: +g.getAttribute('data-v'), x: centro(g).x }; }),
      mayor: todos('.tn-mayor').map(function (r) { return { v: +r.getAttribute('data-v'), x: centro(r).x }; }),
      mcd: todos('.tn-mcd').map(function (t) { return { x: centro(t).x, texto: t.textContent }; })
    };
  };
  window.__amExtra.amCalendario = function (raiz, centro) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), s = svg.getBoundingClientRect(), k = s.width / svg.viewBox.baseVal.width;
    /* Un punto de la curva de un salto, en las medidas del dibujo: donde
       empieza (0) y donde acaba (su largo). */
    function punto(p, l) { var q = p.getPointAtLength(l).matrixTransform(p.getScreenCTM()); return (q.x - s.left) / k; }
    return {
      dias: todos('.md-dia').map(function (g) { return { v: +g.getAttribute('data-d'), x: centro(g).x }; }),
      fichas: todos('.md-ficha').map(function (g) {
        return { fila: g.getAttribute('data-fila'), v: +g.getAttribute('data-v'), x: centro(g.querySelector('rect')).x, dice: g.querySelector('text').textContent };
      }),
      saltos: todos('.md-arco').map(function (g) {
        var p = g.querySelector('.md-camino'), t = g.querySelector('.md-arco-num');
        return { fila: g.getAttribute('data-fila'), de: +g.getAttribute('data-de'), a: +g.getAttribute('data-a'),
                 x0: punto(p, 0), x1: punto(p, p.getTotalLength()), dice: t ? t.textContent : '' };
      }),
      bandas: todos('.md-banda').map(function (b) { return centro(b).x; }),
      rotulos: todos('.md-rotulo-banda').map(function (t) { return { x: centro(t).x, texto: t.textContent }; }),
      hueco: todos('.md-hueco').map(function (g) { return centro(g.querySelector('circle')).x; }),
      pruebas: todos('.md-prueba').map(function (t) { return { v: +t.getAttribute('data-v'), x: centro(t).x, texto: t.textContent }; })
    };
  };
  window.__amExtra.amBaldosas = function (raiz) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), s = svg.getBoundingClientRect(), k = s.width / svg.viewBox.baseVal.width;
    function caja(el) { var b = el.getBoundingClientRect(); return { x0: (b.left - s.left) / k, x1: (b.right - s.left) / k, y0: (b.top - s.top) / k, y1: (b.bottom - s.top) / k }; }
    return {
      sala: caja(raiz.querySelector('.pr-sala')),
      baldosas: todos('.pr-baldosa').map(function (t) {
        var c = caja(t);
        return { f: +t.getAttribute('data-f'), c: +t.getAttribute('data-c'), x0: c.x0, x1: c.x1, y0: c.y0, y1: c.y1 };
      }),
      velo: todos('.pr-velo').map(caja),
      capas: todos('.pr-capa').length,
      pila: +raiz.querySelector('.pr-pila-n').textContent,
      pilaQue: raiz.querySelector('.pr-pila-que').textContent,
      pilaVacia: todos('.pr-pila-vacia').length,
      corchetes: todos('.pr-corchete').map(function (g) {
        var c = caja(g.querySelector('path'));
        return { eje: g.getAttribute('data-eje'), dice: +g.querySelector('text').textContent, x0: c.x0, x1: c.x1, y0: c.y0, y1: c.y1 };
      }),
      carteles: todos('.pr-cartel').map(function (g) { return g.querySelector('text').textContent; }),
      hilos: todos('.pr-hilo').map(function (l) { return l.getAttribute('data-eje'); })
    };
  };
  window.__amExtra.amSandia = function (raiz) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), s = svg.getBoundingClientRect(), k = s.width / svg.viewBox.baseVal.width;
    function aVista(el, x, y) {
      var p = svg.createSVGPoint(); p.x = x; p.y = y; p = p.matrixTransform(el.getScreenCTM());
      return { x: (p.x - s.left) / k, y: (p.y - s.top) / k };
    }
    var cb = raiz.querySelector('.fr-cascara').getBoundingClientRect();
    var c = { x: (cb.left + cb.width / 2 - s.left) / k, y: (cb.top + cb.height / 2 - s.top) / k };
    function angulo(q) { return (Math.atan2(q.x - c.x, -(q.y - c.y)) * 180 / Math.PI + 360) % 360; }
    /* El ángulo en el dibujo de un rayo local (del centro del pedazo hacia
       el ángulo a): se lleva un punto del rayo a la pantalla con todo lo que
       el pedazo tenga encima (su giro, y el de la sandía). */
    function rayo(el, a) { var t = (a - 90) * Math.PI / 180; return angulo(aVista(el, 50 * Math.cos(t), 50 * Math.sin(t))); }
    function tramo(el) { return [rayo(el, +el.getAttribute('data-a0')), rayo(el, +el.getAttribute('data-a1'))]; }
    function donde(el) { var b = el.getBoundingClientRect(); return angulo({ x: (b.left + b.width / 2 - s.left) / k, y: (b.top + b.height / 2 - s.top) / k }); }
    var cifra = raiz.querySelector('.am-cifra .fr');
    return {
      cortes: todos('.fr-corte').map(function (g) { return angulo(aVista(g.querySelector('line'), 0, -50)); }),
      marcas: todos('.fr-marca').map(function (m) { return { quien: m.getAttribute('data-quien'), a: tramo(m) }; }),
      copias: todos('.fr-copia').map(function (g) { return { a: tramo(g) }; }),
      copiaN: todos('.fr-copia-n').map(function (t) { return { a: donde(t), n: t.textContent }; }),
      quintos: todos('.fr-quinto').map(tramo),
      velos: todos('.fr-velo').map(tramo),
      nombres: todos('.fr-nombre').map(function (t) { return { quien: t.getAttribute('data-quien'), a: donde(t) }; }),
      etiquetas: todos('.fr-etq').map(function (g) { return { a: donde(g), num: g.querySelector('.fr-num').textContent, den: g.querySelector('.fr-den').textContent }; }),
      panel: todos('.fr-panel').length ? {
        num: todos('.fr-grande .fr-num').map(function (t) { return t.textContent; })[0] || null,
        den: todos('.fr-grande .fr-den').map(function (t) { return t.textContent; })[0] || null,
        entero: todos('.fr-entero').length > 0
      } : null,
      marcadorFr: cifra ? [].map.call(cifra.children, function (b) { return b.textContent; }) : null
    };
  };
  window.__amExtra.amManteca = function (raiz) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), s = svg.getBoundingClientRect(), k = s.width / svg.viewBox.baseVal.width;
    function caja(el) { var b = el.getBoundingClientRect(); return { x0: (b.left - s.left) / k, x1: (b.right - s.left) / k, y0: (b.top - s.top) / k, y1: (b.bottom - s.top) / k }; }
    function medio(el) { var c = caja(el); return { x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2 }; }
    /* Una fracción del dibujo se lee de sus dos números, no de un atributo:
       lo que se comprueba es lo que se ve. */
    function fr(g) { return g.querySelector('.mt-num').textContent + '/' + g.querySelector('.mt-den').textContent; }
    return {
      tazas: [].map.call(raiz.querySelectorAll('.mt-taza'), function (t) {
        return { x0: +t.getAttribute('data-x0'), x1: +t.getAttribute('data-x1'), fondo: +t.getAttribute('data-fondo'), alto: +t.getAttribute('data-alto') };
      }),
      cuartos: todos('.mt-cuarto rect').map(caja),
      octavos: todos('.mt-octavo rect').map(caja),
      rayas: todos('.mt-raya').map(function (l) { return { taza: +l.getAttribute('data-taza'), y: medio(l).y }; }),
      niveles: todos('.mt-nivel').map(function (g) {
        return { taza: +g.getAttribute('data-taza'), dice: fr(g), y: medio(g.querySelector('.mt-barra')).y, x: medio(g).x, antes: g.classList.contains('mt-antes') };
      }),
      antesRaya: todos('.mt-antes-raya').map(caja),
      cuentas: todos('.mt-cuenta').map(function (t) { var c = medio(t); return { t: t.textContent, x: c.x, y: c.y }; }),
      nombres: todos('.mt-nombre').map(function (t) { return { t: t.textContent, x: medio(t).x }; }),
      duda: todos('.mt-duda-taza').map(medio),
      cuchillos: todos('.mt-cuchillo').length,
      escrito: todos('.mt-escrito .mt-tok').map(function (t) {
        var c = medio(t), tipo = t.getAttribute('data-tipo');
        return { tipo: tipo, t: tipo === 'fr' ? fr(t) : t.textContent, x: c.x, y: c.y };
      }),
      notas: todos('.mt-nota').map(function (t) { return t.textContent; })
    };
  };
  /* Números Decimales: la tabla y los dos cuadros de cien centavos.
     La cuadrícula se lee de sus rayas (son lo que se ve), y lo pintado
     por su caja: el área dice cuántos cuadritos son. */
  window.__amExtra.amCentavos = function (raiz) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), s = svg.getBoundingClientRect(), k = s.width / svg.viewBox.baseVal.width;
    function caja(el) { var b = el.getBoundingClientRect(); return { x0: (b.left - s.left) / k, x1: (b.right - s.left) / k, y0: (b.top - s.top) / k, y1: (b.bottom - s.top) / k }; }
    function medio(el) { var c = caja(el); return { x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2 }; }
    return {
      cols: todos('.dc-col').map(function (t) { return { col: t.getAttribute('data-col'), t: t.textContent, x: medio(t).x }; }),
      puntos: todos('.dc-punto').map(function (t) { var c = medio(t); return { fila: +t.getAttribute('data-fila'), x: c.x, y: c.y }; }),
      fichas: [].map.call(raiz.querySelectorAll('.dc-ficha'), function (g) {
        var t = g.querySelector('.am-digito'), r = g.querySelector('.am-ficha'), a = g.querySelector('.dc-anillo'), c = medio(t);
        return { fila: +g.getAttribute('data-fila'), cifra: t.textContent, ve: vis(t), borde: vis(r),
                 roto: r.classList.contains('am-roto'), raya: getComputedStyle(r).strokeDasharray,
                 palida: parseFloat(getComputedStyle(t).opacity) < 0.99, x: c.x, y: c.y, anillo: !!a && vis(a) };
      }),
      rels: todos('.dc-rel').map(function (t) { var c = medio(t); return { col: t.getAttribute('data-col'), t: t.textContent, x: c.x, y: c.y }; }),
      tintes: todos('.dc-tinte').map(function (t) { return { col: t.getAttribute('data-col'), x: medio(t).x }; }),
      banda: todos('.dc-banda').map(function (t) { return t.textContent; }),
      cuadros: [].filter.call(raiz.querySelectorAll('.dc-cuadro'), vis).map(function (g) {
        return { grid: g.getAttribute('data-grid'), lineas: g.querySelector('.dc-lineas').getAttribute('d'),
                 llenos: [].filter.call(g.querySelectorAll('.dc-llenos'), vis).map(function (r) { return Object.assign({ tipo: r.getAttribute('data-tipo') }, caja(r)); }) };
      }),
      cuentas: todos('.dc-cuenta').map(function (t) { return { grid: t.getAttribute('data-grid'), t: t.textContent }; }),
      demas: todos('.dc-demas').map(function (t) { return t.textContent; })
    };
  };
  /* Multiplicación de Decimales: la compra y la cuenta de doña Chepa, en
     cuadrícula. Cada número se lee de sus cifras y de dónde quedó su punto;
     un salto está trazado si su raya no está corrida; y la regla se lee de
     sus marcas. Una cifra pálida (el 0 que se aparta) se lee aparte: se ve,
     pero no cuenta. */
  window.__amExtra.amPunto = function (raiz) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), s = svg.getBoundingClientRect(), k = s.width / svg.viewBox.baseVal.width;
    function caja(el) { var b = el.getBoundingClientRect(); return { x0: (b.left - s.left) / k, x1: (b.right - s.left) / k, y0: (b.top - s.top) / k, y1: (b.bottom - s.top) / k }; }
    function medio(el) { var c = caja(el); return { x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2 }; }
    function palida(el) { var o = parseFloat(getComputedStyle(el).opacity); return o > 0.1 && o < 0.99 && vis(el.parentNode); }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function salto(g) {
      var c = g.querySelector('.mp-curva'), t = g.querySelector('.mp-salto-txt');
      return { de: +g.getAttribute('data-de'), a: +g.getAttribute('data-a'), trazada: trazada(c), dice: vis(t) ? t.textContent : '' };
    }
    return {
      cifras: [].map.call(raiz.querySelectorAll('.mp-cifra'), function (t) {
        var c = medio(t);
        return { fila: +t.getAttribute('data-fila'), grupo: t.getAttribute('data-grupo'), cifra: t.textContent, x: c.x, y: c.y, ve: vis(t), palida: palida(t) };
      }).filter(function (c) { return c.ve || c.palida; }),
      puntos: todos('.mp-punto').map(function (p) { var c = medio(p); return { fila: +p.getAttribute('data-fila'), grupo: p.getAttribute('data-grupo'), x: c.x, y: c.y }; }),
      fantasmas: todos('.mp-fantasma').map(function (p) { return medio(p); }),
      x10: [].map.call(raiz.querySelectorAll('.mp-x10'), salto),
      d10: [].map.call(raiz.querySelectorAll('.mp-d10'), salto),
      x100: { trazada: trazada(raiz.querySelector('path.mp-x100')), dice: todos('text.mp-x100').map(function (t) { return t.textContent; }) },
      hueco: todos('.mp-hueco').length,
      aparte: todos('.mp-aparte').map(caja),
      rotulos: todos('.mp-rotulo').map(function (t) { return t.textContent; }),
      cuentas: todos('.mp-cuenta').map(function (g) {
        return { grupo: g.getAttribute('data-grupo'), cuantas: +g.getAttribute('data-cuantas'), x0: +g.getAttribute('data-x0'), x1: +g.getAttribute('data-x1'),
                 dice: g.querySelector('.mp-cuantas').textContent };
      }),
      ticks: todos('.mp-tick').map(function (t) { return { v: +t.getAttribute('data-v'), dice: t.textContent, x: medio(t).x }; }),
      barras: todos('.mp-barra').map(function (g) { return Object.assign({ libras: +g.getAttribute('data-libras') }, caja(g.querySelector('.mp-barra-r'))); }),
      marca: todos('text.mp-marca').map(function (t) { return { dice: t.textContent, x: medio(t).x }; }),
      linea: todos('path.mp-marca').map(function (p) { return medio(p).x; })
    };
  };
  /* División de Decimales: los galones de don Chele y la división en su
     tira de cuadrícula. Cada galón dice si va lleno o a la mitad y en qué
     fila está; cada precio, de qué galón es; y la división se lee de sus
     cifras y de su punto. */
  window.__amExtra.amLeche = function (raiz) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), s = svg.getBoundingClientRect(), k = s.width / svg.viewBox.baseVal.width;
    function caja(el) { var b = el.getBoundingClientRect(); return { x0: (b.left - s.left) / k, x1: (b.right - s.left) / k, y0: (b.top - s.top) / k, y1: (b.bottom - s.top) / k }; }
    function medio(el) { var c = caja(el); return { x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2 }; }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    return {
      galones: todos('.dl-galon').map(function (g) {
        var c = caja(g.querySelector('.dl-cuerpo'));
        return { tipo: g.getAttribute('data-tipo'), fila: g.getAttribute('data-fila'), x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2, ancho: c.x1 - c.x0, arriba: c.y0 };
      }),
      precios: todos('.dl-precio').map(function (t) { var c = medio(t); return { fila: t.getAttribute('data-fila'), dice: t.textContent, x: c.x, y: c.y }; }),
      totales: todos('.dl-total').map(function (t) { return { fila: t.getAttribute('data-fila'), dice: t.textContent }; }),
      etiquetas: todos('.dl-etq').map(function (t) { return t.textContent; }),
      cifras: todos('.dl-cifra').map(function (t) { return { grupo: t.getAttribute('data-grupo'), cifra: t.textContent, x: medio(t).x }; }),
      punto: todos('.dl-punto').map(function (p) { return medio(p).x; }),
      fantasmas: todos('.dl-fantasma').map(function (p) { return { grupo: p.getAttribute('data-grupo'), x: medio(p).x }; }),
      saltos: [].map.call(raiz.querySelectorAll('.dl-x10'), function (g) {
        var t = g.querySelector('.dl-salto-txt');
        return { grupo: g.getAttribute('data-grupo'), de: +g.getAttribute('data-de'), a: +g.getAttribute('data-a'), trazada: trazada(g.querySelector('.dl-curva')), dice: vis(t) ? t.textContent : '' };
      }),
      hueco: todos('.dl-hueco').length
    };
  };
  /* Multiplicación Vertical: los siete renglones de 43 y la cuenta corta,
     en cuadrícula. La cuadrícula se saca de sus propias rayas («M x y V …»
     las de pie y «M x y H …» las acostadas); cada cifra dice de qué es (un
     renglón, lo que se lleva, el resultado) y se mide dónde cae. */
  window.__amExtra.amCopias = function (raiz) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), s = svg.getBoundingClientRect(), k = s.width / svg.viewBox.baseVal.width;
    function caja(el) { var b = el.getBoundingClientRect(); return { x0: (b.left - s.left) / k, x1: (b.right - s.left) / k, y0: (b.top - s.top) / k, y1: (b.bottom - s.top) / k }; }
    function medio(el) { var c = caja(el); return { x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2 }; }
    var cols = [], filas = [];
    raiz.querySelector('.mv-rejilla path').getAttribute('d').split('M').slice(1).forEach(function (t) {
      var p = t.trim().split(/[ ,]+/);
      if (p[2] === 'V') cols.push(+p[0]); else if (p[2] === 'H') filas.push(+p[1]);
    });
    function orden(a, b) { return a - b; }
    return {
      cols: cols.sort(orden), filas: filas.sort(orden),
      cifras: todos('.mv-cifra').map(function (t) { var c = medio(t); return { grupo: t.getAttribute('data-grupo'), cifra: t.textContent, x: c.x, y: c.y }; }),
      sumas: todos('.mv-suma').map(function (g) {
        var ts = [].filter.call(g.querySelectorAll('text'), vis).map(function (t) { return { c: t.textContent, x: medio(t).x }; })
          .sort(function (a, b) { return a.x - b.x; });
        return { col: g.getAttribute('data-col'), dice: ts.map(function (t) { return t.c; }).join(''), y: medio(g).y };
      }),
      nota: todos('.mv-mas').map(function (t) { var c = medio(t); return { dice: t.textContent, x: c.x, y: c.y }; }),
      signos: todos('.mv-signo').map(function (t) { var c = medio(t); return { dice: t.textContent, x: c.x, y: c.y }; }),
      raya: todos('.mv-raya').map(function (p) { return medio(p).y; }),
      bandas: todos('.mv-banda').map(function (b) { var c = caja(b); return { x: (c.x0 + c.x1) / 2, y0: c.y0, y1: c.y1 }; }),
      rotulos: todos('.mv-rotulo').map(function (t) { return { dice: t.textContent, y: medio(t).y }; }),
      hueco: todos('.mv-hueco').length,
      aro: todos('.mv-aro').map(medio),
      olvido: todos('.mv-olvido').map(medio),
      mal: todos('.mv-mal').map(caja)
    };
  };
  /* Numeración Maya: la piedra con sus tres signos tallados y la mesa donde
     se explican. De cada signo se cuentan los puntos, las barras y la
     concha que tiene tallados, y lo que dice su rótulo; de la mesa, lo que
     hay a la vista. */
  window.__amExtra.amPiedra = function (raiz) {
    var vis = window.__amVisible;
    function todos(sel, base) { return [].filter.call((base || raiz).querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), s = svg.getBoundingClientRect(), k = s.width / svg.viewBox.baseVal.width;
    function caja(el) { var b = el.getBoundingClientRect(); return { x0: (b.left - s.left) / k, x1: (b.right - s.left) / k, y0: (b.top - s.top) / k, y1: (b.bottom - s.top) / k }; }
    function medio(el) { var c = caja(el); return { x: (c.x0 + c.x1) / 2, y: (c.y0 + c.y1) / 2 }; }
    return {
      signos: [].map.call(raiz.querySelectorAll('.ma-signo'), function (g) {
        var clave = g.getAttribute('data-signo');
        var val = raiz.querySelector('.ma-valor[data-signo="' + clave + '"]'), marco = raiz.querySelector('.ma-marco[data-signo="' + clave + '"]');
        return { clave: clave, puntos: todos('.ma-talla-punto', g).length, barras: todos('.ma-talla-barra', g).length, conchas: todos('.ma-talla-concha', g).length,
                 dice: vis(val) ? val.textContent : '', marcado: vis(marco), y: medio(g).y, yDice: medio(val).y };
      }),
      puntos: todos('.ma-punto').map(function (c) { var m = medio(c); return { x: m.x, y: m.y, arriba: !!c.closest('.ma-arriba') }; }),
      barras: todos('.ma-barra').map(caja),
      valeBarra: todos('.ma-vale-barra').map(function (t) { var m = medio(t); return { dice: t.textContent, y: m.y }; }),
      conchas: todos('.ma-concha').map(medio),
      cero: todos('.ma-cero').map(function (t) { return t.textContent; }),
      cuentas: todos('.ma-cuenta').map(function (t) { var m = medio(t); return { dice: t.textContent, x: m.x }; }),
      raya: todos('.ma-nivel-raya').map(medio),
      pregunta: todos('.ma-pregunta').map(function (t) { var m = medio(t); return { dice: t.textContent, x: m.x, y: m.y }; })
    };
  };
  /* Área del Círculo: el redondel del patio. Del cuadrado pedido se lee su
     tamaño y su cuadrícula; de cada tajada, su punta, la mitad de su arco y
     las dos puntas del arco, ya puestas en la vista con el movimiento que
     lleven encima. Con eso la sonda mide el redondel, la tira y lo que
     sobra, sin creerle a ningún rótulo. */
  window.__amExtra.amRedondel = function (raiz) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function nums(t) { return (String(t).match(/-?[0-9]+(?:[.][0-9]+)?/g) || []).map(Number); }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function circulo(c) {
      var cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), o = aVista(c, cx, cy), b = aVista(c, cx + +c.getAttribute('r'), cy);
      return { c: o, r: Math.hypot(b[0] - o[0], b[1] - o[1]) };
    }
    function lineas(p) {
      var d = p.getAttribute('d'), re = /M ([-0-9.]+) ([-0-9.]+) ([VH]) ([-0-9.]+)/g, m, v = [], h = [];
      while ((m = re.exec(d))) { if (m[3] === 'V') v.push(aVista(p, +m[1], +m[2])[0]); else h.push(aVista(p, +m[1], +m[2])[1]); }
      return { v: v, h: h };
    }
    function extremos(p) { var L = p.getTotalLength(), a = p.getPointAtLength(0), b = p.getPointAtLength(L); return [aVista(p, a.x, a.y), aVista(p, b.x, b.y)]; }
    function textos(sel) { return todos(sel).map(function (t) { return t.textContent; }); }
    var rejilla = raiz.querySelector('.rd-rejilla'), cortes = raiz.querySelector('.rd-cortes');
    return {
      pedido: todos('.rd-pedido').map(function (q) {
        var x = +q.getAttribute('x'), y = +q.getAttribute('y'), a = aVista(q, x, y), b = aVista(q, x + +q.getAttribute('width'), y + +q.getAttribute('height'));
        return { x0: a[0], y0: a[1], x1: b[0], y1: b[1] };
      }),
      rejilla: vis(rejilla) ? lineas(rejilla) : null,
      lados: textos('.rd-lado'),
      cordon: todos('.rd-cordon').map(circulo),
      disco: todos('.rd-disco').map(circulo),
      esquinas: todos('.rd-sobra').map(function (q) { return { rayada: getComputedStyle(q).fill.indexOf('url(') === 0 }; }),
      cortes: trazada(cortes) ? (cortes.getAttribute('d').match(/L/g) || []).length : 0,
      tajadas: todos('.rd-tajada').map(function (t) {
        var n = nums(t.getAttribute('d')), R = n[4];
        return { j: +t.getAttribute('data-j'), apice: aVista(t, 0, 0), medio: aVista(t, 0, -R), izq: aVista(t, n[2], n[3]), der: aVista(t, n[9], n[10]) };
      }),
      radio: textos('.rd-radio'),
      cotaAlto: todos('.rd-cota-alto').map(extremos),
      largo: textos('.rd-largo'),
      area: textos('.rd-area'),
      sobran: textos('.rd-sobran')
    };
  };
  /* Ángulos y Bisectriz: la esquina del marco de la pizarra. De cada
     listón se leen sus vértices ya puestos en la vista (con el movimiento que
     lleve encima), y de ahí se mide su corte; lo mismo con la cuña del hueco,
     la bisectriz, el marco entero y la hoja que se dobla. */
  window.__amExtra.amMarco = function (raiz) {
    var vis = window.__amVisible;
    function todos(sel) { return [].filter.call(raiz.querySelectorAll(sel), vis); }
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function puntos(el) { var out = []; for (var i = 0; i < el.points.length; i++) out.push(aVista(el, el.points[i].x, el.points[i].y)); return out; }
    function extremos(el) { var L = el.getTotalLength(), a = el.getPointAtLength(0), b = el.getPointAtLength(L); return [aVista(el, a.x, a.y), aVista(el, b.x, b.y)]; }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    var s = svg.getBoundingClientRect(), k = s.width / svg.viewBox.baseVal.width;
    function medio(el) { var b = el.getBoundingClientRect(); return { x: (b.left + b.width / 2 - s.left) / k, y: (b.top + b.height / 2 - s.top) / k }; }
    return {
      listones: todos('.bm-liston').map(function (p) { return { juego: p.getAttribute('data-juego'), lado: p.getAttribute('data-lado'), pts: puntos(p) }; }),
      sobras: todos('.bm-sobra').length,
      sierras: [].filter.call(raiz.querySelectorAll('.bm-sierra'), trazada).length,
      /* El borde de la madera va aparte (.bm-canto) y no pasa por el corte:
         si el cuerpo o la sobra llevaran borde, el listón sin cortar ya
         enseñaría por dónde se corta, que es lo que el paso 0 pregunta. */
      bordeEnElCorte: todos('.bm-liston, .bm-sobra').filter(function (p) { return getComputedStyle(p).stroke !== 'none'; }).length,
      hueco: todos('.bm-hueco').map(puntos),
      rotulos: todos('.bm-rotulo').map(function (t) { var m = medio(t); return { dice: t.textContent, x: m.x, y: m.y }; }),
      bisectriz: [].filter.call(raiz.querySelectorAll('.bm-bisectriz'), trazada).map(extremos),
      lados: todos('.bm-rayo').map(extremos),
      guia: todos('.bm-guia').length,
      marco: todos('.bm-marco-liston').map(puntos),
      pizarra: todos('.bm-pizarra').length,
      hoja: todos('.bm-hoja').map(puntos),
      solapa: todos('.bm-solapa').map(puntos),
      pliegue: todos('.bm-pliegue').map(extremos)
    };
  };
  /* Las cuentas de la frase, de las palabras del marcador y de su número
     grande que el renglón parte en dos («315 ÷» arriba y «4.5 = 70»
     abajo). Se le pregunta al navegador: un Range por cuenta, y si sus
     pedazos caen en dos alturas, se partió. El número grande entró cuando
     «36 − 28.26 = 7.74» no cupo en un teléfono de 360 px y quedó con el
     «7.74» solo en el segundo renglón. */
  window.__amPartidas = function (id) {
    var raiz = document.getElementById(id), out = [];
    var RE = /[0-9](?:[0-9.,]*[0-9])?°?(?:[ \u00a0]*[×÷+−=<>][ \u00a0]*[0-9](?:[0-9.,]*[0-9])?°?)+/g;
    ['.am-texto', '.am-palabras', '.am-cifra'].forEach(function (sel) {
      var nodo = raiz.querySelector(sel).firstChild;
      if (!nodo || nodo.nodeType !== 3) return;
      var s = nodo.textContent, m;
      RE.lastIndex = 0;
      while ((m = RE.exec(s))) {
        var rg = document.createRange();
        rg.setStart(nodo, m.index); rg.setEnd(nodo, m.index + m[0].length);
        var altos = {};
        [].forEach.call(rg.getClientRects(), function (q) { if (q.width > 0.5) altos[Math.round(q.top)] = 1; });
        if (Object.keys(altos).length > 1) out.push(m[0].replace(/\u00a0/g, ' '));
      }
    });
    return out;
  };
  window.__amLeer = function (id) {
    var raiz = document.getElementById(id);
    var svg = raiz.querySelector('svg');
    var vb = svg.viewBox.baseVal, r = svg.getBoundingClientRect(), k = r.width / vb.width;
    function centro(el) { var b = el.getBoundingClientRect(); return { x: (b.left + b.width / 2 - r.left) / k, y: (b.top + b.height / 2 - r.top) / k }; }
    var huevos = [].map.call(raiz.querySelectorAll('ellipse.hv'), function (e) {
      var c = centro(e);
      return { x: c.x, y: c.y, ve: window.__amVisible(e), roto: e.classList.contains('am-roto'),
               raya: getComputedStyle(e).strokeDasharray };
    });
    var digitos = [].filter.call(raiz.querySelectorAll('text.am-digito'), window.__amVisible)
      .map(function (t) { return { x: centro(t).x, t: t.textContent }; })
      .sort(function (a, b) { return a.x - b.x; }).map(function (d) { return d.t; }).join('');
    var vale = 0;
    [].forEach.call(raiz.querySelectorAll('[data-vale]'), function (e) { if (window.__amVisible(e)) vale += +e.getAttribute('data-vale'); });
    var tarjeta = raiz.closest('[data-animacion]').getBoundingClientRect().top;
    return {
      yBoton: raiz.querySelector('.am-sigue').getBoundingClientRect().top - tarjeta,
      yDibujo: raiz.querySelector('.am-escenario').getBoundingClientRect().top - tarjeta,
      paso: raiz.amControl.paso(),
      /* Una fracción del marcador se escribe apilada (js/metas-fracciones.js):
         se lee como «1/5», que es lo que dice. */
      cifra: (function () {
        var c = raiz.querySelector('.am-cifra'), fr = c.querySelector('.fr');
        return fr ? [].map.call(fr.children, function (b) { return b.textContent; }).join('/') : c.textContent;
      })(),
      palabras: raiz.querySelector('.am-palabras').textContent,
      texto: raiz.querySelector('.am-texto').textContent,
      boton: raiz.querySelector('.am-sigue').textContent,
      huevos: huevos, digitos: digitos, vale: vale,
      extra: window.__amExtra[id] ? window.__amExtra[id](raiz, centro) : null
    };
  };`;

/* Una cuenta escrita en la pantalla («40,000 + 5,000 = 45,000»,
   «10 × 100,000 = 1,000,000»): se hace aparte y se compara. */
function cuenta(txt) {
  const [izq, der] = txt.replace(/,/g, '').replace(/\u00a0/g, ' ').split('=');
  let hecho;
  if (izq.includes('×')) hecho = izq.split('×').map(t => +t.trim()).reduce((a, b) => a * b, 1);
  else hecho = (izq.replace(/\s/g, '').replace(/−/g, '-').match(/[+-]?\d+(\.\d+)?/g) || []).map(Number).reduce((a, b) => a + b, 0);
  return { hecho, dice: +der.trim() };
}

/* De dónde a dónde mide una recta: con las marcas que se ven se saca la
   regla (valor = a + b · posición) y se lee cualquier punto del dibujo. */
function regla(marcas, eje) {
  if (marcas.length < 2) return null;
  const m = marcas.slice().sort((p, q) => p[eje] - q[eje]);
  const p0 = m[0], p1 = m[m.length - 1];
  const b = (p1.v - p0.v) / (p1[eje] - p0[eje]);
  return pos => p0.v + b * (pos - p0[eje]);
}

/* ── lo propio de cada escena ───────────────────────────────── */
let escalaRedondel = 0;

const ESCENAS = {
  /* Área del Círculo: el redondel del patio. Todo se mide en el dibujo: la
     escala sale del cuadrado pedido y de sus dos rótulos de 6 m, el radio
     sale de las tajadas, y el largo de la tira es la suma de sus arcos. Las
     cuentas las rehace la sonda con 3.14, que es el pi de la prueba de la
     misión: que el redondel quepa justo en el cuadrado, que se parta en
     tajadas iguales que lo cubren entero, que la tira tenga de alto el
     radio y de largo media vuelta, que el área sea largo por alto y que lo
     que sobró sea el cuadrado menos el redondel. */
  amRedondel(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t).replace(/ /g, ' ');
    const cerca = (a, b, t = 0.6) => Math.abs(a - b) <= t;
    const mismo = (p, q, t = 1) => Math.hypot(p[0] - q[0], p[1] - q[1]) <= t;
    const nums = t => (nb(t).match(/\d+(\.\d+)?/g) || []).map(Number);
    const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const d2 = v => Math.round(v * 100) / 100;
    const PI = 3.14;
    const T = x.tajadas;
    /* Cuánto abre una tajada, vista desde su punta. */
    const abre = t => { let a = Math.abs(ang(t.apice, t.der) - ang(t.apice, t.izq)); return a > 180 ? 360 - a : a; };
    const radioDe = t => dist(t.apice, t.medio);

    if (n <= 2 || n === 6) {
      const q = x.pedido[0];
      r.push([!!q && x.lados.filter(t => nb(t) === '6 m').length === 2, `paso ${n}: el cuadrado pedido, con sus dos lados de 6 m`, x.lados]);
      if (!q) return r;
      const lado = q.x1 - q.x0;
      escalaRedondel = lado / 6;
      const g = x.rejilla;
      const parejas = l => l.slice().sort((a, b) => a - b).every((v, i, s) => !i || cerca(v - s[i - 1], lado / 6, 0.5));
      const celdas = g ? (g.v.length - 1) * (g.h.length - 1) : 0;
      const pideRejilla = n <= 1 || n === 6;
      if (pideRejilla) r.push([cerca(q.y1 - q.y0, lado) && !!g && g.v.length === 7 && g.h.length === 7 && parejas(g.v) && parejas(g.h) &&
        cerca(Math.min(...g.v), q.x0) && cerca(Math.max(...g.v), q.x1) && cerca(Math.min(...g.h), q.y0) && cerca(Math.max(...g.h), q.y1),
        `paso ${n}: la cuadrícula parte el cuadrado en ${celdas} cuadritos de un metro por lado`, g && [g.v.length, g.h.length]]);
      const c = x.cordon[0];
      r.push([!!c && mismo(c.c, [(q.x0 + q.x1) / 2, (q.y0 + q.y1) / 2]) && cerca(c.r, lado / 2) && cerca(2 * c.r / escalaRedondel, 6, 0.05),
        `paso ${n}: el redondel cabe justo en el cuadrado: mide 6 m de lado a lado`, c && [c.c, d2(c.r)]]);
      if (n === 0) {
        r.push([!T.length && !x.disco.length && !x.esquinas.length, 'paso 0: todavía no hay grama: ni el redondel ni lo que sobra', [T.length, x.disco.length, x.esquinas.length]]);
        r.push([nums(e.cifra)[0] === celdas && celdas === 36, `paso 0: el marcador dice ${nb(e.cifra)}, los ${celdas} cuadritos`, e.cifra]);
      }
      if (n === 1 || n === 6) {
        const dsk = x.disco[0];
        r.push([!!dsk && !!c && mismo(dsk.c, c.c) && cerca(dsk.r, c.r) && !T.length && !x.cortes,
          `paso ${n}: el redondel se ve entero: un disco, sin tajadas ni cortes`, [x.disco.length, T.length, x.cortes]]);
      }
      if (n >= 1) r.push([x.esquinas.length === 1 && x.esquinas[0].rayada, `paso ${n}: las esquinas que sobran se ven rayadas, no solo de otro color`, x.esquinas]);
      if (n === 1) r.push([nums(e.cifra)[0] === celdas && /</.test(e.cifra), `paso 1: el marcador dice ${nb(e.cifra)}: cabe menos que los ${celdas} m²`, e.cifra]);
      if (n === 2) {
        const R = c ? c.r : 0;
        const dirs = T.map(t => (ang(t.apice, t.medio) + 360) % 360).sort((a, b) => a - b);
        const reparte = dirs.every((v, i) => !i || cerca(v - dirs[i - 1], 22.5, 0.4));
        r.push([T.length === 16 && !x.disco.length && T.every(t => !!c && mismo(t.apice, c.c) && cerca(radioDe(t), R) && cerca(abre(t), 22.5, 0.3)) && reparte,
          `paso 2: el redondel partido en ${T.length} tajadas iguales de 22.5°, con la punta en el centro, que lo cubren entero`, T.map(t => d2(abre(t))).slice(0, 3)]);
        r.push([x.cortes === 16, 'paso 2: los 16 cortes, trazados del centro al borde', x.cortes]);
        r.push([nums(e.cifra)[0] === T.length && /iguales/.test(e.palabras), `paso 2: el marcador dice ${nb(e.cifra)}, ${nb(e.palabras)}`, e.cifra]);
      }
      if (n === 6) {
        const area = d2(PI * 3 * 3), falta = d2(celdas - area), m = nums(e.palabras), so = nums((x.sobran[0] || ''))[0];
        r.push([nums(e.cifra)[0] === falta && m.length === 2 && m[0] === celdas && m[1] === area && so === falta,
          `paso 6: sobraron ${celdas} − ${area} = ${falta} m², y eso dicen el marcador y el dibujo`, [e.cifra, e.palabras, x.sobran]]);
        r.push([Math.round(falta) === 8 && /casi ocho/.test(e.texto), 'paso 6: 7.74 es «casi ocho», como dice la historia', falta]);
      }
    } else {
      /* La tira: las mismas dieciséis tajadas, una arriba y otra abajo. */
      const esc = escalaRedondel;
      const arriba = T.filter(t => t.medio[1] < t.apice[1]), abajo = T.filter(t => t.medio[1] > t.apice[1]);
      const R = T.length ? radioDe(T[0]) : 0;
      r.push([T.length === 16 && arriba.length === 8 && abajo.length === 8 && !x.pedido.length && !x.disco.length && !x.cordon.length && !x.esquinas.length,
        `paso ${n}: la tira: las mismas 16 tajadas, ${arriba.length} con el arco arriba y ${abajo.length} abajo`, [arriba.length, abajo.length]]);
      if (T.length !== 16) return r;
      const yA = arriba.map(t => t.apice[1]), yB = abajo.map(t => t.apice[1]);
      const fila = l => l.every(v => cerca(v, l[0], 0.5));
      const orden = T.slice().sort((a, b) => a.apice[0] - b.apice[0]);
      const cuerda = dist(T[0].izq, T[0].der);
      const pegadas = orden.every((t, i) => !i || (cerca(t.apice[0] - orden[i - 1].apice[0], cuerda / 2, 0.4) && (t.medio[1] < t.apice[1]) !== (orden[i - 1].medio[1] < orden[i - 1].apice[1])));
      r.push([fila(yA) && fila(yB) && cerca(yA[0] - yB[0], R, 0.5) && pegadas && T.every(t => cerca(radioDe(t), R) && cerca(abre(t), 22.5, 0.3)),
        `paso ${n}: una arriba y otra abajo, pegadas: de alto, la tira mide lo que el radio`, [d2(yA[0] - yB[0]), d2(R)]]);
      const radioM = esc ? R / esc : 0;
      const rot = nums(x.radio[0] || '')[0], ca = x.cotaAlto[0];
      r.push([cerca(radioM, 3, 0.02) && rot === 3 && !!ca && cerca(Math.abs(ca[0][1] - ca[1][1]), R, 0.5),
        `paso ${n}: el radio medido es ${d2(radioM)} m, y la cota de la izquierda dice ${x.radio[0]}`, [d2(radioM), x.radio]]);
      /* Media vuelta: la suma de los arcos de una fila. */
      const arcos = l => l.reduce((s, t) => s + R * abre(t) * Math.PI / 180, 0);
      const mediaM = esc ? arcos(abajo) / esc : 0, largo = d2(PI * 3);
      if (n === 3) r.push([nums(e.cifra)[0] === 3 && /radio/.test(e.palabras), `paso 3: el marcador dice ${nb(e.cifra)}, ${nb(e.palabras)}`, e.cifra]);
      if (n >= 4) {
        const lb = nums(x.largo[0] || '')[0];
        r.push([cerca(mediaM, largo, 0.01) && cerca(arcos(arriba) / esc, largo, 0.01) && lb === largo,
          `paso ${n}: medidos en el dibujo, los arcos de una fila suman ${d2(mediaM)} m, media vuelta, y la cota dice ${lb} m`, [d2(mediaM), x.largo]]);
      }
      if (n === 4) {
        const m = nums(e.cifra);
        r.push([m.length === 3 && m[0] === PI && m[1] === 3 && m[2] === largo, `paso 4: el marcador dice ${nb(e.cifra)}`, e.cifra]);
      }
      if (n === 5) {
        const area = d2(largo * 3), m = nums(e.cifra), et = nums(x.area[0] || '')[0];
        const areaDibujo = T.reduce((s, t) => s + R * R * abre(t) * Math.PI / 360, 0) / (esc * esc);
        r.push([area === d2(PI * 3 * 3) && et === area && cerca(areaDibujo, area, 0.02),
          `paso 5: largo por alto, ${largo} × 3 = ${area} m², que es 3.14 × 3 × 3; las tajadas del dibujo suman ${d2(areaDibujo)} m²`, [x.area, d2(areaDibujo)]]);
        r.push([m.length === 3 && m[0] === largo && m[1] === 3 && m[2] === area && /pi/.test(e.palabras), `paso 5: el marcador dice ${nb(e.cifra)}`, e.cifra]);
      }
      if (n !== 5) r.push([!x.area.length, `paso ${n}: el área todavía no se dice`, x.area]);
    }
    return r;
  },

  /* Ángulos y Bisectriz: la esquina del marco de don Tulio. El corte de
     cada listón se MIDE en sus vértices, tal como quedaron en la vista: que
     diga 40° lo que está cortado a 40°, que la cuña del hueco sea justo lo
     que le falta a la esquina (90° menos los dos cortes), que la bisectriz
     salga de la esquina a 45° de cada lado, que las dos puntas a 45° casen
     en una sola raya, que el marco entero lleve sus ocho cortes a 45° y
     cada uno compartido por dos listones, y que el doblez de la hoja parta
     su esquina en dos de 45° y la hoja quede abierta. */
  amMarco(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t).replace(/ /g, ' ');
    const cerca = (a, b, t = 0.6) => Math.abs(a - b) <= t;
    const mismo = (p, q, t = 1) => Math.hypot(p[0] - q[0], p[1] - q[1]) <= t;
    const ang = (a, b) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    /* El corte de un listón, desde su canto de afuera: el de la derecha se
       mide contra la horizontal y el de abajo contra la vertical. */
    const corte = l => l.lado === 'h' ? ang(l.pts[0], l.pts[3]) : 90 - ang(l.pts[0], l.pts[1]);
    const juego = j => x.listones.filter(l => l.juego === j);
    const rotulos = t => x.rotulos.filter(q => nb(q.dice) === t);
    const dentro = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
    const nums = t => (nb(t).match(/\d+(\.\d+)?/g) || []).map(Number);

    if (n <= 3) {
      const ojo = juego('ojo'), bis = juego('bis'), l = n === 3 ? bis : n <= 1 ? ojo : [];
      const h = l.find(q => q.lado === 'h'), v = l.find(q => q.lado === 'v');
      if (n <= 1 || n === 3) {
        r.push([l.length === 2 && !!h && !!v && (n === 3 ? !ojo.length : !bis.length), `paso ${n}: se ven los dos listones ${n === 3 ? 'nuevos' : 'de don Tulio'}`, x.listones.map(q => q.juego + q.lado)]);
        if (!h || !v) return r;
        const th = corte(h), tv = corte(v), punta = h.pts[0];
        if (n === 0) {
          r.push([x.sobras === 2 && x.guia === 1 && !mismo(h.pts[0], v.pts[0], 20) && !x.hueco.length && rotulos('90°').length === 1,
            'paso 0: los listones están apartados, sin cortar, y la esquina vacía dice 90°', [x.sobras, x.guia]]);
          r.push([x.sierras === 0 && x.bordeEnElCorte === 0,
            'paso 0: los listones están enteros: ni la sierra ni el borde de la madera marcan todavía por dónde se corta', [x.sierras, x.bordeEnElCorte]]);
        } else {
          r.push([mismo(h.pts[0], v.pts[0]) && !x.sobras, `paso ${n}: los dos listones se juntan en la punta de la esquina`, [h.pts[0], v.pts[0]]]);
          const t = n === 1 ? 40 : 45;
          r.push([cerca(th, t) && cerca(tv, t), `paso ${n}: medidos en el dibujo, los dos cortes son de ${t}°`, [th.toFixed(2), tv.toFixed(2)]]);
          const et = rotulos(t + '°');
          r.push([et.length === 2 && dentro([et[0].x, et[0].y], h.pts) !== dentro([et[1].x, et[1].y], h.pts) &&
            et.every(q => dentro([q.x, q.y], h.pts) || dentro([q.x, q.y], v.pts)),
            `paso ${n}: cada listón dice ${t}° sobre su propia madera`, et.map(q => q.dice)]);
          const falta = 90 - th - tv;
          if (n === 1) {
            const c = x.hueco[0];
            const bien = !!c && mismo(c[0], punta) && cerca(ang(c[0], c[1]), th) && cerca(ang(c[0], c[3]), 90 - tv);
            r.push([bien && cerca(ang(c[0], c[3]) - ang(c[0], c[1]), falta) && cerca(falta, 10) && rotulos('hueco').length === 1 && x.sierras === 2,
              `paso 1: entre los dos cortes queda una cuña de ${falta.toFixed(1)}°, lo que le falta a la esquina, y dice «hueco»`, c]);
            const m = nums(e.cifra);
            r.push([m.length === 3 && cerca(m[0], th, 0.5) && cerca(m[1], tv, 0.5) && m[2] === m[0] + m[1] && nums(e.palabras)[0] === 90 - m[2],
              `paso 1: el marcador dice ${nb(e.cifra)} y ${nb(e.palabras)}`, [e.cifra, e.palabras]]);
          } else {
            r.push([!x.hueco.length && cerca(falta, 0) && mismo(h.pts[3], v.pts[1]),
              'paso 3: las dos puntas a 45° casan en una sola raya, sin hueco', [h.pts[3], v.pts[1]]]);
            r.push([x.sierras === 2, 'paso 3: los dos listones nuevos se cortaron con la sierra, igual que los de a ojo', x.sierras]);
            const b = x.bisectriz[0];
            r.push([!!b && mismo(b[0], punta) && cerca(ang(b[0], b[1]), th), 'paso 3: la raya donde casan es la bisectriz', b]);
            const m = nums(e.cifra);
            r.push([m.length === 3 && m[0] === 45 && m[1] === 45 && m[2] === 90, `paso 3: el marcador dice ${nb(e.cifra)}`, e.cifra]);
          }
        }
      } else {
        /* La esquina sola, con su bisectriz. */
        const ld = x.lados[0], b = x.bisectriz[0];
        r.push([!x.listones.length && !!ld && !!b, 'paso 2: la esquina sola, con sus dos lados y la bisectriz', [x.listones.length, !!ld, !!b]]);
        if (ld && b) {
          const o = ld[0], conH = ang(b[0], b[1]), conV = 90 - conH;
          r.push([mismo(b[0], o) && cerca(conH, 45) && cerca(conV, 45), `paso 2: la bisectriz sale de la esquina a ${conH.toFixed(1)}° de un lado y ${conV.toFixed(1)}° del otro`, [conH.toFixed(2)]]);
          const et = rotulos('45°');
          r.push([et.length === 2 && et.some(q => ang(o, [q.x, q.y]) < 45) && et.some(q => ang(o, [q.x, q.y]) > 45),
            'paso 2: un «45°» a cada lado de la bisectriz', et.map(q => ang(o, [q.x, q.y]).toFixed(1))]);
          const m = nums(e.cifra);
          r.push([m.length === 3 && m[0] / m[1] === m[2] && cerca(m[2], conH, 0.5), `paso 2: el marcador dice ${nb(e.cifra)}, lo que mide la bisectriz`, e.cifra]);
        }
      }
      r.push([!x.marco.length && !x.hoja.length, `paso ${n}: ni el marco entero ni la hoja todavía`, [x.marco.length, x.hoja.length]]);
    } else if (n === 4) {
      /* El marco entero: cuatro listones, ocho cortes a 45°, cada corte
         compartido por dos listones (así casan). */
      const cortes = [];
      x.marco.forEach((p, i) => p.forEach((a, j) => {
        const b = p[(j + 1) % p.length], g = Math.abs(ang(a, b)) % 90;
        if (!cerca(g, 0, 1) && !cerca(g, 90, 1)) cortes.push({ i, a, b, g: Math.abs(ang(a, b)) });
      }));
      const en45 = cortes.every(c => cerca(c.g % 90, 45) || cerca(c.g % 90, 45));
      const pareados = cortes.every(c => cortes.some(o => o.i !== c.i && ((mismo(o.a, c.a) && mismo(o.b, c.b)) || (mismo(o.a, c.b) && mismo(o.b, c.a)))));
      r.push([x.marco.length === 4 && cortes.length === 8 && en45 && pareados && x.pizarra === 1,
        `paso 4: cuatro listones, ${cortes.length} cortes a 45°, y cada corte casa con el del listón de al lado`, cortes.map(c => c.g.toFixed(1))]);
      r.push([nums(e.cifra)[0] === cortes.length && /45/.test(nb(e.palabras)), `paso 4: el marcador dice ${nb(e.cifra)}, ${nb(e.palabras)}`, [e.cifra, e.palabras]]);
      r.push([!x.listones.length && !x.hoja.length, 'paso 4: la esquina de cerca ya no está', x.listones.length]);
    } else {
      /* La hoja: abierta otra vez, con el doblez partiendo su esquina. */
      const hb = x.hoja[0], so = x.solapa[0], pl = x.pliegue[0];
      r.push([!!hb && !!so && !!pl, 'paso 5: la hoja, su solapa y el doblez', [!!hb, !!so, !!pl]]);
      if (hb && so && pl) {
        const o = hb[0], L = hb[2][1] - o[1];
        const abierta = mismo(so[0], o) && mismo(so[1], [o[0] + L, o[1]]) && mismo(so[2], [o[0] + L, o[1] + L]);
        r.push([abierta, 'paso 5: después de doblarse, la hoja quedó abierta: la solapa volvió a su sitio', so]);
        r.push([mismo(pl[0], o) && cerca(ang(pl[0], pl[1]), 45) && mismo(pl[1], [o[0] + L, o[1] + L]),
          `paso 5: el doblez sale de la esquina a ${ang(pl[0], pl[1]).toFixed(1)}° y llega a la esquina de enfrente`, pl]);
        const et = rotulos('45°');
        r.push([et.length === 2 && et.some(q => ang(o, [q.x, q.y]) < 45) && et.some(q => ang(o, [q.x, q.y]) > 45),
          'paso 5: un «45°» a cada lado del doblez', et.map(q => ang(o, [q.x, q.y]).toFixed(1))]);
      }
      r.push([nb(e.cifra) === '45° y 45°' && /bisectriz/.test(e.palabras), 'paso 5: el marcador dice 45° y 45°', e.cifra]);
      r.push([!x.listones.length && !x.marco.length, 'paso 5: solo la hoja', [x.listones.length, x.marco.length]]);
    }
    if (n === 0) r.push([nb(e.cifra) === '90°', 'paso 0: el marcador dice 90°, la esquina', e.cifra]);
    return r;
  },

  /* Numeración y Calendario Mayas: la piedra con tres signos tallados
     (cuatro puntos, dos barras y una concha) y la mesa donde se explican.
     Lo que dice cada signo se cuenta en lo que tiene tallado, y lo que dice
     el marcador, en lo que hay en la mesa. Y la regla del sistema se mira en
     cada paso: nunca quedan cinco puntos juntos. ⚠️ El último paso deja en
     pregunta lo que vale un punto de arriba, porque eso es lo que pregunta el
     «Predice» de abajo. */
  amPiedra(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t).replace(/ /g, ' ');
    const cerca = (a, b, t = 1.5) => Math.abs(a - b) <= t;
    const valor = s => s.conchas ? 0 : s.puntos + 5 * s.barras;

    /* ── La piedra ── */
    r.push([x.signos.length === 3 && x.signos.every(s => s.puntos <= 4 && s.barras <= 3 && (!s.conchas || (!s.puntos && !s.barras))),
      `paso ${n}: la piedra tiene tres signos, y ninguno lleva cinco puntos juntos`, x.signos.map(s => [s.clave, s.puntos, s.barras, s.conchas])]);
    const dichos = x.signos.filter(s => s.dice);
    r.push([dichos.every(s => nb(s.dice) === '= ' + valor(s) && cerca(s.yDice, s.y, 6)),
      `paso ${n}: lo que dice cada signo es lo que tiene tallado`, dichos.map(s => [s.clave, s.dice, valor(s)])]);
    const leidos = [[], ['a'], ['a'], ['a', 'b'], ['a', 'b', 'c'], ['a', 'b', 'c']][n];
    r.push([dichos.map(s => s.clave).join() === leidos.join(), `paso ${n}: ya se leyeron ${leidos.length} signos`, dichos.map(s => s.clave)]);
    const marcado = { 1: 'a', 3: 'b', 4: 'c' }[n] || '';
    r.push([x.signos.filter(s => s.marcado).map(s => s.clave).join() === marcado, `paso ${n}: está marcado el signo que se lee`, x.signos.filter(s => s.marcado).map(s => s.clave)]);

    /* ── La mesa ── */
    const abajo = x.puntos.filter(p => !p.arriba);
    const mesa = x.conchas.length && !abajo.length && !x.barras.length ? 0 : abajo.length + 5 * x.barras.length;
    r.push([abajo.length <= 4, `paso ${n}: en la mesa nunca quedan cinco puntos juntos`, abajo.length]);
    if (n === 0) r.push([!x.puntos.length && !x.barras.length && !x.conchas.length && !x.cuentas.length, 'paso 0: la mesa está vacía', [x.puntos.length, x.barras.length, x.conchas.length]]);
    if (n === 1) {
      const ps = abajo.slice().sort((a, b) => a.x - b.x), cs = x.cuentas.slice().sort((a, b) => a.x - b.x);
      r.push([ps.length === 4 && ps.every(p => cerca(p.y, ps[0].y, 0.5)) && cs.length === ps.length && cs.every((c, i) => c.dice === String(i + 1) && cerca(c.x, ps[i].x, 1.5)),
        `paso 1: ${ps.length} puntos en fila, contados uno por uno`, cs.map(c => c.dice)]);
      const a = x.signos.find(s => s.clave === 'a');
      r.push([valor(a) === ps.length, 'paso 1: el primer signo tiene los mismos puntos que la mesa', [valor(a), ps.length]]);
    }
    if (n === 2) r.push([x.barras.length === 1 && !x.puntos.length && !x.cuentas.length && x.valeBarra.length === 1 && x.valeBarra[0].dice === '5' && cerca(x.valeBarra[0].y, (x.barras[0].y0 + x.barras[0].y1) / 2, 3),
      'paso 2: cinco puntos se volvieron una barra, y la barra dice 5', [x.barras.length, x.valeBarra.map(v => v.dice)]]);
    if (n === 3) {
      const bs = x.barras.slice().sort((a, b) => a.y0 - b.y0);
      r.push([bs.length === 2 && !x.puntos.length && cerca((bs[0].x0 + bs[0].x1) / 2, (bs[1].x0 + bs[1].x1) / 2, 1) && bs[0].y1 <= bs[1].y0 &&
        x.valeBarra.length === 2 && x.valeBarra.every(v => v.dice === '5'),
        'paso 3: dos barras, una encima de otra, cada una de 5', [bs.length, x.valeBarra.map(v => v.dice)]]);
      const b = x.signos.find(s => s.clave === 'b');
      r.push([valor(b) === 5 * bs.length, 'paso 3: el segundo signo tiene las mismas barras que la mesa', [valor(b), 5 * bs.length]]);
    }
    if (n === 4) {
      r.push([x.conchas.length === 1 && !x.puntos.length && !x.barras.length && x.cero.join() === '0', 'paso 4: en la mesa, sola, la concha, y dice 0', [x.conchas.length, x.cero]]);
      const c = x.signos.find(s => s.clave === 'c');
      r.push([c.conchas === 1 && valor(c) === 0, 'paso 4: el tercer signo es la concha', [c.conchas, valor(c)]]);
    }
    if (n === 5) {
      const arriba = x.puntos.filter(p => p.arriba), con = x.conchas[0];
      r.push([arriba.length === 1 && x.puntos.length === 1 && !!con && !x.barras.length && arriba[0].y < con.y && x.raya.length === 1 && x.raya[0].y > arriba[0].y && x.raya[0].y < con.y,
        'paso 5: un punto arriba, la raya del nivel y la concha abajo', [arriba.length, !!con, x.raya.length]]);
      r.push([x.pregunta.length === 1 && x.pregunta[0].dice === '?' && cerca(x.pregunta[0].y, arriba[0] ? arriba[0].y : -99, 6) && !x.cero.length && !x.valeBarra.length,
        'paso 5: lo que vale el punto de arriba queda en pregunta', x.pregunta.map(p => p.dice)]);
    }

    /* ── El marcador dice lo que hay en la mesa ── */
    const espera = n === 0 ? '3 signos' : n === 5 ? '?' : String(mesa);
    r.push([nb(e.cifra) === espera, `paso ${n}: el marcador dice ${e.cifra}, que es lo que hay en la mesa`, [e.cifra, espera]]);

    /* ⚠️ Lo que pregunta el «Predice» de abajo (cómo se escribe el 13, cuánto
       vale un punto del nivel de arriba y cuántos días tiene el tun) no sale
       en ningún paso. Tampoco el 19 ni el 20: el más grande de un nivel y el
       primero del siguiente son la misma pregunta con otra cara. */
    const todo = [e.texto, e.palabras, e.cifra].concat(x.signos.map(s => s.dice), x.valeBarra.map(v => v.dice), x.cero, x.cuentas.map(c => c.dice), x.pregunta.map(p => p.dice)).map(nb).join(' | ');
    const regalo = todo.match(/(^|[^\d])(13|18|19|20|360|400)(?![\d])|veinte|\btun\b|uinal|base|cuatro barras|tres barras|barras y tres puntos/i);
    r.push([!regalo, `paso ${n}: no dice nada de lo que pregunta el «Predice» (el 13, lo que vale un punto de arriba, el tun)`, regalo ? regalo[0] : undefined]);
    return r;
  },

  /* Multiplicación Vertical: las copias de la guía (7 hojas para cada uno
     de sus 43 alumnos). La cuadrícula se saca de sus propias rayas y cada
     renglón se lee por el cuadro donde cae cada cifra. Las cuentas se
     rehacen AQUÍ, aparte: que cada suma que va corriendo sea su columna
     sumada hasta ese renglón, que lo que se escribe y lo que se lleva sean
     las unidades y las decenas de la columna, que los siete renglones sumen
     lo que dice el resultado, que la cuenta corta dé lo mismo que la larga,
     y lo que cuesta olvidarse del 2. */
  amCopias(e, n) {
    const x = e.extra, r = [];
    const HISTORIA = { hojas: 7, alumnos: 43 };
    const cerca = (a, b, t = 1.5) => Math.abs(a - b) <= t;
    const nb = t => String(t).replace(/ /g, ' ');
    const NUM = ['cero', 'una', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete'];

    /* ── La cuadrícula, de sus propias rayas ── */
    const { cols, filas } = x;
    const P = cols[1] - cols[0], FILA = filas[1] - filas[0];
    r.push([cols.length === 5 && filas.length >= 9 && cols.every((c, i) => i === 0 || cerca(c - cols[i - 1], P, 0.01)) &&
      filas.every((f, i) => i === 0 || cerca(f - filas[i - 1], FILA, 0.01)),
      `paso ${n}: la cuadrícula tiene cuatro columnas iguales (el signo, centenas, decenas y unidades) y renglones iguales`, [cols.length, filas.length]]);
    const VALOR = [0, 100, 10, 1];
    const celda = p => ({ col: cols.findIndex((c, i) => i < cols.length - 1 && p.x > c && p.x < cols[i + 1]),
                          fila: filas.findIndex((f, i) => i < filas.length - 1 && p.y > f && p.y < filas[i + 1]) });
    const cifras = x.cifras.map(c => Object.assign({}, c, celda(c)));
    const llaves = cifras.map(c => c.col + ':' + c.fila);
    r.push([cifras.every(c => c.col >= 1 && c.fila >= 0 && cerca(c.x, (cols[c.col] + cols[c.col + 1]) / 2, 2)) && new Set(llaves).size === llaves.length,
      `paso ${n}: cada cifra va centrada en su cuadro, y una sola por cuadro`, cifras.map(c => c.cifra + '@' + c.col + ':' + c.fila)]);

    /* ── Los renglones, leídos por su columna ── */
    const renglon = f => cifras.filter(c => c.fila === f && c.grupo !== 'lleva').reduce((a, c) => a + VALOR[c.col] * +c.cifra, 0);
    const filasDe = g => [...new Set(cifras.filter(c => c.grupo === g).map(c => c.fila))].sort((a, b) => a - b);
    const sumandos = filasDe('sumando');
    const signos = x.signos.map(sg => Object.assign({ dice: sg.dice }, celda(sg)));
    const filaRaya = x.raya.length === 1 ? filas.findIndex(f => cerca(f, x.raya[0], 1.5)) : -1;
    const lleva = cifras.filter(c => c.grupo === 'lleva');
    const res = cifras.filter(c => c.grupo === 'resultado');
    const filasRes = [...new Set(res.map(c => c.fila))];
    const leido = res.length ? renglon(res[0].fila) : null;
    const rot = t => x.rotulos.find(q => q.dice === t);
    const enFila = (y, f) => f >= 0 && y > filas[f] && y < filas[f + 1];
    const digitoDe = (f, col) => { const c = cifras.find(q => q.fila === f && q.col === col && q.grupo === 'sumando'); return c ? +c.cifra : 0; };

    if (n <= 3) {
      /* La suma larga: siete renglones de 43, uno por hoja. */
      const seguidos = sumandos.every((f, i) => i === 0 || f === sumandos[i - 1] + 1);
      r.push([sumandos.length === HISTORIA.hojas && seguidos && sumandos.every(f => renglon(f) === HISTORIA.alumnos),
        `paso ${n}: son ${sumandos.length} renglones seguidos de ${HISTORIA.alumnos}, uno por hoja`, sumandos.map(renglon)]);
      const ult = sumandos[sumandos.length - 1];
      r.push([signos.length === 1 && signos[0].dice === '+' && signos[0].col === 0 && signos[0].fila === ult && filaRaya === ult + 1,
        `paso ${n}: el + va en el último renglón y la raya debajo de él`, [signos.map(q => q.dice + '@' + q.col + ':' + q.fila), filaRaya]]);
      r.push([sumandos.every((f, i) => { const q = rot('hoja ' + (i + 1)); return q && enFila(q.y, f); }) && x.rotulos.length === HISTORIA.hojas,
        `paso ${n}: cada renglón dice de qué hoja es, de la 1 a la ${HISTORIA.hojas}`, x.rotulos.map(q => q.dice)]);
      if (res.length) r.push([filasRes.length === 1 && filasRes[0] === ult + 1, `paso ${n}: el resultado va en el renglón de debajo de la raya`, filasRes]);

      /* Las columnas, sumadas aparte. */
      const colU = sumandos.map(f => digitoDe(f, 3)), colD = sumandos.map(f => digitoDe(f, 2));
      const corrida = lista => lista.map((_, i) => lista.slice(0, i + 1).reduce((a, b) => a + b, 0));
      const totU = corrida(colU)[colU.length - 1], totD = corrida(colD)[colD.length - 1];
      const bandaCol = x.bandas.map(b => celda({ x: b.x, y: (b.y0 + b.y1) / 2 }).col);
      const sumasDe = c => x.sumas.filter(q => q.col === c);
      const bienSumas = (c, lista) => {
        const qs = sumasDe(c), esperado = corrida(lista);
        return qs.length === sumandos.length && sumandos.every((f, i) => { const q = qs.find(z => enFila(z.y, f)); return q && q.dice === String(esperado[i]); });
      };
      if (n === 0) {
        r.push([res.length === 0 && x.hueco >= 1 && lleva.length === 0 && x.sumas.length === 0 && x.bandas.length === 0 && x.nota.length === 0,
          'paso 0: el resultado todavía es un signo de pregunta, y no se ha sumado nada', [res.length, x.hueco, lleva.length, x.sumas.length]]);
      }
      if (n === 1) {
        r.push([bandaCol.length === 1 && bandaCol[0] === 3 && bienSumas('U', colU) && sumasDe('D').length === 0,
          `paso 1: la columna de las unidades se suma renglón por renglón: ${corrida(colU).join(', ')}`, sumasDe('U').map(q => q.dice)]);
      }
      if (n >= 2) {
        r.push([bandaCol.length === 1 && bandaCol[0] === 2 && bienSumas('D', colD) && sumasDe('U').length === 0,
          `paso ${n}: la columna de las decenas se suma renglón por renglón: ${corrida(colD).join(', ')}`, sumasDe('D').map(q => q.dice)]);
      }
      if (n >= 1) {
        /* Lo que se escribe y lo que se lleva: las unidades y las decenas de
           lo que dio la columna. */
        const u = res.find(c => c.col === 3), ll = lleva[0];
        r.push([!!u && +u.cifra === totU % 10 && lleva.length === 1 && ll.col === 2 && ll.fila === sumandos[0] - 1 && +ll.cifra === Math.floor(totU / 10),
          `paso ${n}: de ${totU} se escribe el ${totU % 10} en las unidades y el ${Math.floor(totU / 10)} se lleva arriba de las decenas`, [u && u.cifra, ll && ll.cifra]]);
      }
      if (n === 2) r.push([res.length === 1 && x.nota.length === 0, 'paso 2: todavía no se suma el 2 que se llevaba', res.map(c => c.cifra)]);
      if (n >= 2) r.push([x.aro.length === 1 && lleva.length === 1 && cerca(x.aro[0].x, lleva[0].x, 2) && cerca(x.aro[0].y, lleva[0].y, 4),
        `paso ${n}: el 2 que se llevaba está marcado`, x.aro]);
      if (n === 3) {
        /* La cuenta de las decenas con lo que se llevaba: 28 + 2 = 30, en el
           renglón de la última hoja, y el 30 partido en su cuadro. */
        const nota = x.nota.slice().sort((a, b) => a.x - b.x), dice = nota.map(q => q.dice).join('');
        const m = dice.match(/^\+(\d+)=(\d+)$/), total = totD + Math.floor(totU / 10);
        r.push([!!m && nota.every(q => enFila(q.y, ult)) && +m[1] === +lleva[0].cifra && +m[2] === total,
          `paso 3: a la derecha dice ${totD} + ${lleva[0] && lleva[0].cifra} = ${total}: las decenas y lo que se llevaba`, dice]);
        const d = res.find(c => c.col === 2), c = res.find(q => q.col === 1);
        r.push([!!d && !!c && +d.cifra === total % 10 && +c.cifra === Math.floor(total / 10),
          `paso 3: de ${total} se escribe el ${total % 10} en las decenas y el ${Math.floor(total / 10)} va delante`, res.map(q => q.cifra)]);
        const suma = sumandos.reduce((a, f) => a + renglon(f), 0);
        r.push([leido === suma && suma === HISTORIA.hojas * HISTORIA.alumnos,
          `paso 3: el resultado dice ${leido}, y los siete renglones sumados aparte dan ${suma}`, [leido, suma]]);
      } else r.push([x.nota.length === 0, `paso ${n}: sin la cuenta de las decenas a la derecha`, x.nota.map(q => q.dice)]);
    } else {
      /* La cuenta corta: el 43, el × 7 y el resultado, en tres renglones. */
      const arriba = sumandos[0], por = cifras.filter(c => c.grupo === 'por');
      const m = por.length === 1 ? +por[0].cifra : NaN;
      r.push([sumandos.length === 1 && renglon(arriba) === HISTORIA.alumnos && por.length === 1 && por[0].col === 3 && por[0].fila === arriba + 1 && m === HISTORIA.hojas &&
        signos.length === 1 && signos[0].dice === '×' && signos[0].col === 0 && signos[0].fila === arriba + 1 && filaRaya === arriba + 2 && filasRes.length === 1 && filasRes[0] === arriba + 2,
        `paso ${n}: en tres renglones: ${renglon(arriba)}, × ${m} y el resultado debajo de la raya`, [sumandos.map(renglon), por.map(q => q.cifra), signos.map(q => q.dice), filaRaya, filasRes]]);
      const rotCorto = [['alumnos', arriba], ['hojas', arriba + 1], ['en total', arriba + 2]];
      r.push([rotCorto.every(([t, f]) => { const q = rot(t); return q && enFila(q.y, f); }) && !x.rotulos.some(q => /^hoja \d/.test(q.dice)),
        `paso ${n}: el 43 dice «alumnos», el 7 «hojas» y el resultado «en total»`, x.rotulos.map(q => q.dice)]);
      const a = renglon(arriba), u = a % 10, dd = Math.floor(a / 10);
      const llevaBien = Math.floor(u * m / 10), bien = a * m, sinLlevar = dd * m * 10 + (u * m) % 10;
      if (n === 5) {
        const faltan = bien - sinLlevar, completas = Math.floor(sinLlevar / m), sinGuia = HISTORIA.alumnos - completas;
        r.push([lleva.length === 0 && x.olvido.length === 1 && cerca(x.olvido[0].x, (cols[2] + cols[3]) / 2, 2) && enFila(x.olvido[0].y, arriba - 1),
          'paso 5: el 2 que se llevaba ya no está: queda su hueco, con raya cortada', [lleva.length, x.olvido]]);
        r.push([leido === sinLlevar && x.mal.length === 1 && res.every(c => c.x > x.mal[0].x0 && c.x < x.mal[0].x1 && c.y > x.mal[0].y0 && c.y < x.mal[0].y1),
          `paso 5: sin el 2 sale ${leido}: ${dd * m} en las decenas tal cual, y va marcado con raya cortada`, [leido, sinLlevar]]);
        r.push([!!rot('sin el 2') && !!rot(`faltan ${faltan} hojas`) && new RegExp(`faltan ${faltan} hojas`).test(nb(e.texto)) &&
          new RegExp(`${NUM[sinGuia]} alumnos se quedan sin la guía completa`).test(nb(e.texto)),
          `paso 5: faltan ${faltan} hojas; con ${sinLlevar} alcanzan ${completas} guías de ${m}, y ${sinGuia} alumnos se quedan sin la suya`, [x.rotulos.map(q => q.dice), faltan, sinGuia]]);
      } else {
        r.push([lleva.length === 1 && lleva[0].col === 2 && lleva[0].fila === arriba - 1 && +lleva[0].cifra === llevaBien && x.olvido.length === 0,
          `paso ${n}: arriba de las decenas sigue el ${llevaBien} que se lleva (${m} × ${u} = ${u * m})`, lleva.map(q => q.cifra)]);
        r.push([leido === bien && x.mal.length === 0, `paso ${n}: ${a} × ${m} = ${leido}, lo mismo que la suma larga`, leido]);
      }
      if (n === 6) r.push([x.aro.length === 1, 'paso 6: el 2 que se lleva va marcado', x.aro.length]);
      r.push([x.sumas.length === 0 && x.bandas.length === 0 && x.nota.length === 0 && x.hueco === 0,
        `paso ${n}: sin las sumas de la suma larga`, [x.sumas.length, x.bandas.length, x.nota.length, x.hueco]]);
    }

    /* ── El marcador dice lo que se ve ── */
    const dice = nb(e.cifra);
    if (n === 0) r.push([dice === `${HISTORIA.alumnos} × ${sumandos.length}`, `paso 0: el marcador dice ${dice}: ${sumandos.length} renglones de ${HISTORIA.alumnos}`, dice]);
    if (n === 1 || n === 2) {
      const q = cuenta(dice), col = n === 1 ? 3 : 2, dig = digitoDe(sumandos[0], col), ult = x.sumas[x.sumas.length - 1];
      r.push([dice === `${sumandos.length} × ${dig} = ${q.hecho}` && q.hecho === q.dice && !!ult && q.dice === +ult.dice,
        `paso ${n}: el marcador dice ${dice}, que es la columna sumada`, [dice, ult && ult.dice]]);
    }
    if (n === 3) {
      const q = cuenta(dice), nota = x.nota.slice().sort((a, b) => a.x - b.x).map(z => z.dice).join('');
      r.push([q.hecho === q.dice && nota.endsWith('=' + q.dice) && dice.startsWith(String(x.sumas.map(z => +z.dice).reduce((a, b) => Math.max(a, b), 0))),
        `paso 3: el marcador dice ${dice}, lo mismo que la cuenta de la derecha`, [dice, nota]]);
    }
    if (n === 4) { const q = cuenta(dice); r.push([q.hecho === q.dice && q.dice === leido, `paso 4: el marcador dice ${dice}, lo mismo que el dibujo`, [dice, leido]]); }
    if (n >= 5) r.push([dice === String(leido), `paso ${n}: el marcador dice ${dice}, lo mismo que el resultado del dibujo`, [dice, leido]]);

    /* ⚠️ Lo que pregunta el «Predice» de abajo (en qué cifra termina 34 × 5,
       cuánto es 45 × 10 y si 23 × 14 pasa de 300) no sale en ningún paso:
       ni una regla de la última cifra, ni multiplicar por diez, ni estimar. */
    const todo = [e.texto, e.palabras, e.cifra].concat(x.rotulos.map(q => q.dice), x.nota.map(q => q.dice)).map(nb).join(' | ');
    const regalo = todo.match(/(^|[^\d])(34|45|10|23|14|170|450|322|300)(?![\d])|termina|diez|mayor que|menor que|redonde|estim|aproxim/i);
    r.push([!regalo, `paso ${n}: no dice nada de lo que pregunta el «Predice» (la última cifra, × 10, estimar)`, regalo ? regalo[0] : undefined]);
    return r;
  },

  /* División de Decimales: los galones de don Chele (4.5 galones por
     L 315, y allá pagan L 68 el galón). Los galones se cuentan sobre el
     dibujo, llenos y a la mitad; la división se lee de sus cifras y de su
     punto; y las cuentas se rehacen AQUÍ: que diez entregas sean diez veces
     la leche y la plata, que correr el punto sea un lugar en los dos, que el
     cociente sea el mismo, y que los precios de cada galón sumen lo que dice
     su fila. */
  amLeche(e, n) {
    const x = e.extra, r = [];
    const cerca = (a, b, t = 1.5) => Math.abs(a - b) <= t;
    const igual = (a, b) => Math.abs(a - b) < 1e-9;
    const nb = t => String(t).replace(/\u00a0/g, ' ');
    const lps = t => +nb(t).replace(/^L\s*/, '').replace(/,/g, '');
    const HISTORIA = { galones: 4.5, pago: 315, otra: 68 };
    const cuenta = lista => lista.reduce((a, g) => a + (g.tipo === 'medio' ? 0.5 : 1), 0);

    /* Un número de la división: sus cifras de izquierda a derecha y el punto
       donde cae entre ellas (solo el divisor lo trae a la vista). */
    function leer(grupo) {
      const cs = x.cifras.filter(c => c.grupo === grupo).sort((a, b) => a.x - b.x);
      const pts = grupo === 'divisor' ? x.punto : [];
      let texto = '';
      cs.forEach((c, i) => { if (i > 0 && pts.some(p => p > cs[i - 1].x && p < c.x)) texto += '.'; texto += c.cifra; });
      return { texto, valor: texto ? +texto : NaN, cs };
    }
    const dvd = leer('dividendo'), dvs = leer('divisor'), coc = leer('cociente');
    const todas = [dvd, dvs, coc].filter(q => q.cs.length > 1);
    const P = todas.length ? todas[0].cs[1].x - todas[0].cs[0].x : 0;
    r.push([P > 15 && todas.every(q => q.cs.every((c, i) => i === 0 || cerca(c.x - q.cs[i - 1].x, P, 0.6))) &&
      x.punto.every(p => dvs.cs.some((c, i) => i > 0 && cerca(p, (c.x + dvs.cs[i - 1].x) / 2, 1.2))),
      `paso ${n}: la división va en cuadrícula, una cifra por cuadro, y el punto en una raya`, [dvd.texto, dvs.texto, coc.texto]]);

    /* ── Los galones ── */
    const vs = x.galones;
    const filas = {};
    vs.forEach(g => { const y = Math.round(g.y); (filas[y] = filas[y] || []).push(g); });
    const rows = Object.keys(filas).map(Number).sort((a, b) => a - b).map(y => filas[y].sort((a, b) => a.x - b.x));
    const mismaForma = rows.every(f => f.length === 5 && f.slice(0, 4).every(g => g.tipo === 'lleno') && f[4].tipo === 'medio');
    const mismoTam = vs.every(g => cerca(g.ancho, vs[0].ancho, 0.6));
    if (n === 0 || n === 4) {
      r.push([vs.length === 5 && rows.length === 1 && mismaForma && vs.every(g => g.fila === 'aqui') && igual(cuenta(vs), HISTORIA.galones),
        `paso ${n}: la entrega: cuatro galones llenos y uno a la mitad, ${cuenta(vs)} galones`, vs.map(g => g.tipo[0]).join('')]);
    } else if (n <= 3) {
      r.push([vs.length === 50 && rows.length === 10 && mismaForma && mismoTam && igual(cuenta(vs), 10 * HISTORIA.galones),
        `paso ${n}: diez entregas iguales: ${rows.length} filas de ${HISTORIA.galones} galones, ${cuenta(vs)} en total`, [vs.length, rows.length]]);
      const et = x.etiquetas.find(t => /galones/.test(t)) || '';
      r.push([x.etiquetas.includes('diez entregas iguales') && igual(parseFloat(et), cuenta(vs)),
        `paso ${n}: el rótulo dice «${et}», que es lo que se cuenta en el dibujo`, x.etiquetas]);
    } else {
      const aqui = vs.filter(g => g.fila === 'aqui'), alla = vs.filter(g => g.fila === 'alla');
      r.push([vs.length === 10 && rows.length === 2 && mismaForma && aqui.length === 5 && alla.length === 5 && igual(cuenta(aqui), HISTORIA.galones) && igual(cuenta(alla), HISTORIA.galones) &&
        Math.max(...aqui.map(g => g.y)) < Math.min(...alla.map(g => g.y)),
        'paso 5: las dos filas, aquí arriba y la otra ruta abajo, cada una con los mismos 4.5 galones', [aqui.length, alla.length]]);
    }
    if (n === 0) r.push([x.etiquetas.includes('4.5 galones'), 'paso 0: el rótulo dice 4.5 galones', x.etiquetas]);

    /* ── Lo que vale cada galón, y lo que suma cada fila ── */
    const tarifa = { aqui: coc.cs.length ? coc.valor : NaN, alla: HISTORIA.otra };
    const total = f => (x.totales.find(t => t.fila === f) || {}).dice;
    if (n >= 4) {
      for (const f of n === 5 ? ['aqui', 'alla'] : ['aqui']) {
        const gs = vs.filter(g => g.fila === f), ps = x.precios.filter(p => p.fila === f);
        const bien = gs.length === 5 && ps.length === 5 && gs.every(g => {
          const p = ps.find(q => cerca(q.x, g.x, 2) && q.y < g.arriba);
          return p && igual(lps(p.dice), tarifa[f] * (g.tipo === 'medio' ? 0.5 : 1));
        });
        const suma = ps.reduce((a, p) => a + lps(p.dice), 0);
        r.push([bien && igual(suma, lps(total(f))) && igual(suma, tarifa[f] * HISTORIA.galones),
          `paso ${n}: ${f === 'aqui' ? 'aquí' : 'en la otra ruta'}, cada galón lleno a L ${tarifa[f]} y el de la mitad a L ${tarifa[f] / 2}: suman ${total(f)}`, ps.map(p => p.dice)]);
      }
      r.push([igual(lps(total('aqui')), HISTORIA.pago), `paso ${n}: la fila de aquí suma lo que le pagaron (L ${HISTORIA.pago})`, total('aqui')]);
    } else r.push([x.precios.length === 0, `paso ${n}: todavía no hay precio por galón`, x.precios.length]);
    if (n === 0) r.push([igual(lps(total('aqui')), HISTORIA.pago), 'paso 0: la entrega dice lo que le pagaron (L 315)', total('aqui')]);
    if (n >= 1 && n <= 3) r.push([igual(lps(total('rejilla')), 10 * HISTORIA.pago), `paso ${n}: diez entregas son ${total('rejilla')}`, total('rejilla')]);
    r.push([x.etiquetas.some(t => nb(t) === 'Otra ruta: L ' + HISTORIA.otra + ' el galón'), `paso ${n}: el letrero de la otra ruta está a la vista`, x.etiquetas]);

    /* ── La división ── */
    const corrido = n === 2 || n === 3;
    if (corrido) {
      const ultima = q => q.cs[q.cs.length - 1].x;
      r.push([dvd.texto === '3150' && dvs.texto === '45' && igual(dvd.valor, 10 * HISTORIA.pago) && igual(dvs.valor, 10 * HISTORIA.galones) && igual(dvd.valor / dvs.valor, HISTORIA.pago / HISTORIA.galones),
        `paso ${n}: la división quedó ${dvd.texto} ÷ ${dvs.texto}: los dos números por 10, y el mismo cociente`, [dvd.texto, dvs.texto]]);
      const sal = x.saltos.filter(t => t.trazada);
      r.push([sal.length === 2 && sal.every(t => cerca(t.a - t.de, P) && t.dice === '×10') &&
        ['dividendo', 'divisor'].every(g => { const t = sal.find(q => q.grupo === g), f = x.fantasmas.find(q => q.grupo === g), q = g === 'dividendo' ? dvd : dvs;
          return t && f && cerca(f.x, t.a) && cerca(t.a, ultima(q) + P / 2); }),
        `paso ${n}: el punto de cada número salta un lugar a la derecha (× 10) y queda detrás de su última cifra`, sal.map(t => [t.grupo, Math.round(t.de), Math.round(t.a), t.dice])]);
    } else {
      r.push([dvd.texto === String(HISTORIA.pago) && dvs.texto === String(HISTORIA.galones) && x.saltos.every(t => !t.trazada) && x.fantasmas.length === 0,
        `paso ${n}: la división es la de la historia, ${dvd.texto} ÷ ${dvs.texto}, sin saltos`, [dvd.texto, dvs.texto]]);
    }
    if (n >= 3) r.push([coc.texto === '70' && x.hueco === 0 && igual(coc.valor, HISTORIA.pago / HISTORIA.galones) && igual(coc.valor * dvs.valor, dvd.valor),
      `paso ${n}: el cociente es ${coc.texto}, y ${coc.texto} × ${dvs.texto} = ${dvd.texto}`, [coc.texto, dvs.texto, dvd.texto]]);
    else r.push([!coc.cs.length && x.hueco === 2, `paso ${n}: el cociente todavía es un signo de pregunta`, [coc.texto, x.hueco]]);

    /* ── El marcador dice lo que se ve ── */
    const dice = nb(e.cifra);
    const espera = [`${dvd.texto} ÷ ${dvs.texto}`, total('rejilla'), `${dvd.texto} ÷ ${dvs.texto}`, 'L ' + coc.texto, total('aqui'), `${tarifa.aqui} > ${tarifa.alla}`][n];
    r.push([!!espera && dice === nb(espera), `paso ${n}: el marcador dice ${e.cifra}, que es lo que se ve`, [e.cifra, espera]]);
    if (n === 5) {
      const dif = lps(total('aqui')) - lps(total('alla'));
      r.push([tarifa.aqui > tarifa.alla && dif === 9 && /L 306/.test(e.texto) && /nueve lempiras/.test(e.texto),
        `paso 5: allá serían ${total('alla')}, ${dif} lempiras menos por entrega, y la frase dice eso`, [total('alla'), dif]]);
    }
    if (n === 0) r.push([!/(^|[^\d])70(?![\d])/.test([e.texto, e.palabras, e.cifra].concat(x.etiquetas).map(nb).join(' ')),
      'paso 0: no dice todavía a cómo le pagan el galón', e.cifra]);

    /* ⚠️ Lo que pregunta el «Predice» de abajo (si el resultado sale mayor o
       menor que el dividendo, con 10 ÷ 0.50, 8 ÷ 0.2 y 15 ÷ 2.5) no sale en
       ningún paso, ni en la frase ni en el dibujo. */
    const todo = [e.texto, e.palabras, e.cifra].concat(x.etiquetas, x.precios.map(p => p.dice), x.totales.map(t => t.dice)).map(nb).join(' | ');
    const regalo = todo.match(/(^|[^\d.])(0\.50?|0\.2|2\.5|8 ÷|10 ÷|15 ÷)(?![\d])|grupos|mayor que|menor que/i);
    r.push([!regalo, `paso ${n}: no dice nada de lo que pregunta el «Predice» (el tamaño del cociente)`, regalo ? regalo[0] : undefined]);
    return r;
  },

  /* Multiplicación de Decimales: la compra (3.5 × 12.50) arriba y la
     cuenta de doña Chepa (35 × 125 = 4375) abajo, en cuadrícula. Cada número
     se lee del dibujo, cifra por cifra y con el punto donde quedó, y las
     cuentas se rehacen AQUÍ, aparte: que abajo esté cada factor por 10, que
     4375 sea 35 × 125, que el total de arriba sea 3.5 × 12.5 y también 4375
     entre 100, que cada salto sea de un lugar (× 10 o ÷ 10), que lo resaltado
     sean justo las cifras decimales, y que las barras midan en la regla lo
     que dice el total. */
  amPunto(e, n) {
    const x = e.extra, r = [];
    const cerca = (a, b, t = 1.5) => Math.abs(a - b) <= t;
    const igual = (a, b) => Math.abs(a - b) < 1e-9;
    const nb = t => String(t).replace(/\u00a0/g, ' ');
    /* Un número: sus cifras de izquierda a derecha y el punto entre dos de
       ellas. Las pálidas no entran en el número, pero se miran. */
    function leer(fila, grupo) {
      const cs = x.cifras.filter(c => c.fila === fila && c.grupo === grupo).sort((a, b) => a.x - b.x);
      const vivas = cs.filter(c => c.ve);
      const pts = x.puntos.filter(p => p.fila === fila && p.grupo === grupo);
      let texto = '';
      vivas.forEach((c, i) => { if (i > 0 && pts.some(p => p.x > vivas[i - 1].x && p.x < c.x)) texto += '.'; texto += c.cifra; });
      const decimales = texto.includes('.') ? texto.split('.')[1].length : 0;
      /* Cuadrícula: a paso parejo, y el punto en la raya entre dos cuadros. */
      const paso = cs.length > 1 ? (cs[cs.length - 1].x - cs[0].x) / (cs.length - 1) : 0;
      const parejo = cs.every((c, i) => i === 0 || cerca(c.x - cs[i - 1].x, paso, 0.6));
      const enRaya = pts.length <= 1 && pts.every(p => vivas.some((c, i) => i > 0 && cerca(p.x, (c.x + vivas[i - 1].x) / 2, 1.2)));
      return { texto, valor: texto ? +texto : NaN, decimales, cs, vivas, pts, paso, parejo, enRaya, palidas: cs.filter(c => c.palida) };
    }
    const A1 = leer(1, 'a'), B1 = leer(1, 'b'), C1 = leer(1, 'c');
    const A2 = leer(2, 'a'), B2 = leer(2, 'b'), C2 = leer(2, 'c');
    const todos = [A1, B1, C1, A2, B2, C2];
    const P = A1.paso;
    r.push([P > 15 && todos.every(q => q.parejo && q.enRaya && (!q.cs.length || cerca(q.paso || P, P, 0.6))),
      `paso ${n}: una cifra por cuadro, todas a paso parejo, y cada punto en la raya entre dos cuadros`, todos.map(q => q.texto)]);

    /* La compra: 3.5 × 12.50, y desde el paso 2 el 0 apartado. */
    const aparte = n >= 2;
    r.push([A1.texto === '3.5' && (aparte
      ? B1.texto === '12.5' && B1.palidas.map(c => c.cifra).join() === '0' && B1.palidas[0].x > B1.vivas[B1.vivas.length - 1].x &&
        x.aparte.length === 1 && x.aparte[0].x0 < B1.palidas[0].x && x.aparte[0].x1 > B1.palidas[0].x
      : B1.texto === '12.50' && !B1.palidas.length && !x.aparte.length),
      `paso ${n}: la compra es 3.5 × ${aparte ? '12.5 (el 0 del final, pálido y apartado)' : '12.50'}`, [A1.texto, B1.texto, B1.palidas.map(c => c.cifra), x.aparte.length]]);
    r.push([igual(B1.valor, 12.5), `paso ${n}: con el 0 o sin él, el precio vale lo mismo (${B1.texto})`, B1.texto]);

    /* El total de la compra: en blanco hasta el paso 4. */
    const total = n >= 4;
    r.push([total ? C1.texto === '43.75' && x.hueco === 0 : !C1.vivas.length && x.hueco === 2,
      `paso ${n}: el total de la compra ${total ? 'se lee ' + C1.texto : 'sigue en blanco, con su signo de pregunta'}`, [C1.texto, x.hueco]]);

    /* La cuenta de doña Chepa, y cada cifra debajo de la suya. */
    const cuenta = n < 6;
    if (cuenta) {
      r.push([A2.texto === '35' && B2.texto === '125' && C2.texto === '4375' && !A2.pts.length && !B2.pts.length && !C2.pts.length,
        `paso ${n}: la cuenta de doña Chepa, sin un solo punto: ${A2.texto} × ${B2.texto} = ${C2.texto}`, [A2.texto, B2.texto, C2.texto]]);
      const bajo = (arr, abj) => abj.cs.every((c, i) => arr.cs[i] && cerca(c.x, arr.cs[i].x, 0.6));
      r.push([bajo(A1, A2) && bajo(B1, B2) && (!total || bajo(C1, C2)), `paso ${n}: cada cifra de la cuenta cae en el cuadro de la misma cifra de la compra`]);
      /* Las cuentas, rehechas aquí. */
      r.push([igual(A2.valor, A1.valor * 10) && igual(B2.valor, B1.valor * 10) && igual(C2.valor, A2.valor * B2.valor),
        `paso ${n}: ${A2.texto} es ${A1.texto} × 10, ${B2.texto} es ${B1.texto} × 10, y ${C2.texto} es ${A2.texto} × ${B2.texto}`, [A1.valor, B1.valor, A2.valor, B2.valor, C2.valor]]);
    } else r.push([!A2.cs.length && !B2.cs.length && !C2.cs.length, 'paso 6: la cuenta de doña Chepa le deja su sitio a la regla']);
    if (total) r.push([igual(C1.valor, A1.valor * B1.valor) && igual(C1.valor * 100, 4375) && C1.decimales === A1.decimales + B1.decimales,
      `paso ${n}: ${C1.texto} es ${A1.texto} × ${B1.texto} y es 4375 entre 100, y lleva ${C1.decimales} cifras decimales: ${A1.decimales} + ${B1.decimales}`, [C1.valor, C1.decimales]]);

    /* Los saltos × 10 de abajo: uno por factor, de un lugar, desde donde
       tenía el punto la compra; y el punto que se fue, con raya cortada. */
    const x10 = x.x10.filter(s => s.trazada);
    const esperaX10 = n === 0 || n === 6 ? 0 : n === 1 ? 1 : 2;
    const desde = [A1.pts[0], B1.pts[0]].filter(Boolean).map(p => p.x);
    r.push([x10.length === esperaX10 && x.fantasmas.length === esperaX10 &&
      x10.every(s => cerca(s.a - s.de, P) && s.dice === '×10' && desde.some(d => cerca(d, s.de)) && x.fantasmas.some(f => cerca(f.x, s.a))),
      `paso ${n}: ${esperaX10} salto${esperaX10 === 1 ? '' : 's'} de un lugar a la derecha (× 10), cada uno desde el punto de su factor`, x10.map(s => [Math.round(s.de), Math.round(s.a), s.dice])]);

    /* Cien veces: la flecha solo en el paso 3, y es 10 × 10. */
    r.push([n === 3 ? x.x100.trazada && x.x100.dice.join() === '×100' && x10.length === 2 && igual(C2.valor / (A1.valor * B1.valor), 100) : !x.x100.trazada && !x.x100.dice.length,
      `paso ${n}: ${n === 3 ? 'la flecha de × 100: diez veces por cada factor' : 'sin la flecha de × 100'}`, x.x100]);

    /* Los saltos ÷ 10 del total: dos, de un lugar cada uno, encadenados
       desde la raya del final hasta donde quedó el punto. */
    const d10 = x.d10.filter(s => s.trazada).sort((a, b) => b.de - a.de);
    if (n === 4) {
      const ultima = C1.cs.length ? C1.cs[C1.cs.length - 1].x + P / 2 : NaN;
      r.push([d10.length === 2 && d10.every(s => cerca(s.de - s.a, P) && s.dice === '÷10') && cerca(d10[0].de, ultima) && cerca(d10[1].de, d10[0].a) &&
        C1.pts.length === 1 && cerca(d10[1].a, C1.pts[0].x) && igual(4375 / Math.pow(10, d10.length), C1.valor),
        `paso 4: el punto entra por la raya del final y salta dos lugares a la izquierda (÷ 10 y ÷ 10): ${C1.texto}`, d10.map(s => [Math.round(s.de), Math.round(s.a), s.dice])]);
    } else r.push([d10.length === 0, `paso ${n}: sin los saltos ÷ 10`, d10.length]);

    /* Se cuenta: lo resaltado son justo las cifras decimales de cada número,
       y su círculo dice cuántas. */
    if (n === 5) {
      const de = { a: A1, b: B1, c: C1 };
      const bien = x.cuentas.length === 3 && x.cuentas.every(g => {
        const q = de[g.grupo], dentro = q.vivas.filter(c => c.x > g.x0 && c.x < g.x1);
        const despues = q.vivas.filter(c => q.pts[0] && c.x > q.pts[0].x);
        return dentro.length === despues.length && dentro.every(c => despues.includes(c)) && dentro.length === g.cuantas && +g.dice === g.cuantas;
      });
      const [ca, cb, cc] = ['a', 'b', 'c'].map(g => (x.cuentas.find(q => q.grupo === g) || {}).cuantas);
      const m = nb(e.cifra).match(/^(\d+) \+ (\d+) = (\d+)$/);
      r.push([bien && ca + cb === cc && !!m && +m[1] === ca && +m[2] === cb && +m[3] === cc && cc === C1.decimales,
        `paso 5: lo resaltado son las cifras decimales (${ca} de 3.5, ${cb} de 12.5, ${cc} del total) y el marcador dice ${e.cifra}`, x.cuentas.map(g => [g.grupo, g.cuantas, g.dice])]);
    } else r.push([x.cuentas.length === 0, `paso ${n}: sin cifras resaltadas`, x.cuentas.length]);

    /* La regla: tres barras de una libra y media, cada una de lo que vale una
       libra, y la marca donde acaban. */
    if (n === 6) {
      const lee = regla(x.ticks.map(t => ({ v: t.v, x: t.x })), 'x');
      const ticksBien = x.ticks.length === 6 && x.ticks.every(t => t.dice === 'L ' + t.v) && x.ticks.every((t, i, a) => i === 0 || t.x > a[i - 1].x);
      const bs = x.barras.slice().sort((a, b) => a.x0 - b.x0);
      let va = 0, bien = ticksBien && bs.length === 4 && !!lee;
      for (const b of bs) {
        if (!lee) break;
        const i = lee(b.x0), f = lee(b.x1);
        if (!cerca(i, va, 0.15) || !cerca(f - i, b.libras * B1.valor, 0.15)) bien = false;
        va = f;
      }
      const libras = bs.reduce((a, b) => a + b.libras, 0);
      r.push([bien && igual(libras, A1.valor) && cerca(va, C1.valor, 0.15),
        `paso 6: ${bs.length} barras (${bs.map(b => b.libras).join(' + ')} = ${libras} libras), cada libra de ${B1.texto}, y llegan a ${Math.round(va * 100) / 100}`, bs.map(b => [b.libras, lee ? Math.round(lee(b.x0) * 100) / 100 : null])]);
      r.push([x.marca.length === 1 && x.marca[0].dice === C1.texto && x.linea.length === 1 && lee && cerca(lee(x.linea[0]), C1.valor, 0.15) && nb(e.cifra) === 'L ' + C1.texto,
        `paso 6: la marca dice ${x.marca.map(m => m.dice).join()} y está donde acaban las barras; el marcador dice ${e.cifra}`, [x.marca, x.linea]]);
    } else r.push([x.ticks.length === 0 && x.barras.length === 0, `paso ${n}: la regla todavía no está`]);

    /* El marcador dice lo que se ve. */
    const dice = [C2.texto, A2.texto, B2.texto, C2.texto, C1.texto][n];
    if (n <= 4) r.push([nb(e.cifra) === dice, `paso ${n}: el marcador dice ${e.cifra}, que es lo que se ve`, [e.cifra, dice]]);
    if (n === 0) r.push([/4,375/.test(e.palabras) && !/43\.75/.test([e.texto, e.palabras, e.cifra].concat(x.rotulos).join(' ')),
      'paso 0: pregunta por los L 4,375 de la historia y no dice todavía dónde va el punto', e.palabras]);

    /* ⚠️ Lo que pregunta el «Predice» de abajo (dónde va el punto en 2.5 ×
       1.3, cuánto es 0.2 × 0.3 y si tres libras a L 42.50 pasan de L 100) no
       sale en ningún paso, ni en la frase ni en el dibujo. */
    const todo = [e.texto, e.palabras, e.cifra].concat(x.rotulos, x.x10.map(s => s.dice), x.d10.map(s => s.dice), x.x100.dice, x.ticks.map(t => t.dice), x.marca.map(m => m.dice)).map(nb).join(' | ');
    const regalo = todo.match(/(^|[^\d.])(3\.25|325|0\.06|0\.2|0\.3|2\.5|1\.3|42\.50?|127\.50?)(?![\d])|L 100(?![\d])/);
    r.push([!regalo, `paso ${n}: no dice nada de lo que pregunta el «Predice» (2.5 × 1.3, 0.2 × 0.3, L 42.50)`, regalo ? regalo[0] : undefined]);
    return r;
  },

  /* Números Decimales: los centavos de Marvin. Cada precio se lee del
     dibujo mirando en qué columna cayó cada ficha (o de corrido, en el
     paso 0); cada cuadro de cien centavos se cuenta por el área de lo
     pintado; y las dos cosas se comparan entre sí, con el marcador, con
     los rótulos y con la historia: el maíz a L 12.50 y el frijol a
     L 12.05. Una tabla que dice 12.5 con el 5 en las centésimas, o un
     cuadro que pinta 40 donde el rótulo dice 50, salen aquí. */
  amCentavos(e, n) {
    const x = e.extra, r = [];
    const cerca = (a, b, t = 3) => Math.abs(a - b) <= t;
    const ORDEN = ['D', 'U', 'd', 'c'];
    const VALE = { D: 1000, U: 100, d: 10, c: 1 };            // en centavos
    const NOMBRE = { D: 'Decenas', U: 'Unidades', d: 'décimas', c: 'centésimas' };
    const HISTORIA = [1250, 1205];                            // maíz y frijol, en centavos
    const precio = c => Math.floor(c / 100) + '.' + String(c % 100).padStart(2, '0');
    const num = t => +((t.match(/\d+/) || [NaN])[0]);

    /* Las columnas, en su orden y con su nombre. */
    const tabla = x.cols.length > 0;
    const colX = {};
    x.cols.forEach(c => { colX[c.col] = c.x; });
    if (tabla) {
      const cs = x.cols.slice().sort((a, b) => a.x - b.x);
      r.push([cs.length === 4 && cs.every((c, i) => c.col === ORDEN[i] && c.t === NOMBRE[c.col]),
        `paso ${n}: las columnas de la tabla van en su orden (${cs.map(c => c.t).join(', ')})`, cs.map(c => c.t)]);
    }

    /* Cada fila, leída del dibujo. */
    const filas = [0, 1].map(f => {
      const vivas = x.fichas.filter(p => p.fila === f && p.ve);
      const punto = x.puntos.find(p => p.fila === f);
      if (!punto) return { texto: '?', centavos: NaN, bien: false, lugar: null };
      if (!tabla) {
        const orden = vivas.slice().sort((a, b) => a.x - b.x);
        const izq = orden.filter(p => p.x < punto.x).map(p => p.cifra).join('');
        const der = orden.filter(p => p.x > punto.x).map(p => p.cifra).join('');
        return { texto: izq + '.' + der, centavos: +izq * 100 + +(der + '00').slice(0, 2), bien: vivas.every(p => !p.borde), lugar: null };
      }
      const lugar = {};
      let bien = vivas.length > 0;
      for (const p of vivas) {
        const c = ORDEN.find(col => cerca(colX[col], p.x));
        if (!c || lugar[c] != null || !p.borde || p.roto) { bien = false; continue; }
        lugar[c] = +p.cifra;
      }
      /* El punto entre las unidades y las décimas, y nada en las centésimas
         con las décimas vacías: eso sería otro número. */
      bien = bien && punto.x > colX.U && punto.x < colX.d && (lugar.c == null || lugar.d != null);
      const texto = ['D', 'U'].map(c => lugar[c] != null ? lugar[c] : '').join('') + '.' +
        (lugar.d != null ? lugar.d : '') + (lugar.c != null ? lugar.c : '');
      return { texto, centavos: ORDEN.reduce((a, c) => a + (lugar[c] || 0) * VALE[c], 0), bien, lugar };
    });
    r.push([filas.every(p => p.bien), `paso ${n}: cada ficha cae en su lugar y el punto va entre las unidades y las décimas (${filas.map(p => p.texto).join(' y ')})`,
      filas.map(p => p.lugar || p.texto)]);

    /* Un 0 que se quita se ve quitado: fuera de la tabla, pálido y con raya
       cortada. Y solo se quitan ceros. */
    const quitados = x.fichas.filter(p => p.palida);
    r.push([quitados.every(p => p.cifra === '0' && p.roto && /\d/.test(p.raya) && tabla && p.x > colX.c + 25),
      `paso ${n}: lo que se quita es un 0, sale de la tabla y va con raya cortada`, quitados.map(p => [p.fila, p.cifra, Math.round(p.x)])]);

    /* Los cuadros de cien centavos: la cuadrícula de sus rayas, y lo pintado
       contado por su área. */
    const cuadros = {};
    for (const c of x.cuadros) {
      const vs = [...c.lineas.matchAll(/M\s*([\d.]+)\s+([\d.]+)\s*V/g)].map(m => +m[1]).sort((a, b) => a - b);
      const hs = [...c.lineas.matchAll(/M\s*([\d.]+)\s+([\d.]+)\s*H/g)].map(m => +m[2]).sort((a, b) => a - b);
      const S = (vs[vs.length - 1] - vs[0]) / 8, gx = vs[0] - S, gy = hs[0] - S;
      const parejo = vs.length === 9 && hs.length === 9 && vs.every((v, i) => cerca(v, gx + (i + 1) * S, 0.05)) && hs.every((h, i) => cerca(h, gy + (i + 1) * S, 0.05));
      let alineado = true;
      const piezas = c.llenos.map(q => {
        const a = (q.x1 - q.x0) / S, b = (q.y1 - q.y0) / S, i = (q.x0 - gx) / S, j = (q.y0 - gy) / S;
        if (![a, b, i, j].every(v => cerca(v, Math.round(v), 0.03)) || i < -0.03 || j < -0.03 || i + a > 10.03 || j + b > 10.03) alineado = false;
        return { tipo: q.tipo, a: Math.round(a), b: Math.round(b), i: Math.round(i), j: Math.round(j), cuadritos: Math.round(a) * Math.round(b) };
      });
      const choque = piezas.some((p, k) => piezas.some((q, m) => m > k && p.i < q.i + q.a && q.i < p.i + p.a && p.j < q.j + q.b && q.j < p.j + p.b));
      const suma = t => piezas.filter(p => !t || p.tipo === t).reduce((a, p) => a + p.cuadritos, 0);
      cuadros[c.grid] = { piezas, total: suma(), real: suma('real'), demas: suma('demas') };
      r.push([parejo && alineado && !choque, `paso ${n}: el cuadro del ${c.grid === 'maiz' ? 'maíz' : 'frijol'} es de diez por diez y lo pintado cae en cuadritos enteros, sin encimarse`,
        { parejo, alineado, choque }]);
    }
    const hay = Object.keys(cuadros);
    if (hay.length) {
      r.push([x.banda.length === 1 && /\b1 lempira = 100 centavos\b/.test(x.banda[0]), `paso ${n}: el rótulo dice lo que es cada cuadro: 1 lempira = 100 centavos`, x.banda]);
    } else r.push([x.banda.length === 0 && x.cuentas.length === 0, `paso ${n}: sin cuadros todavía, y sin sus rótulos`, x.banda.concat(x.cuentas.map(t => t.t))]);

    /* Lo pintado es lo que vale lo que va después del punto, y los rótulos
       dicen eso mismo. */
    const idx = { maiz: 0, frijol: 1 };
    for (const g of hay) {
      const c = cuadros[g], f = filas[idx[g]];
      const rot = x.cuentas.filter(t => t.grid === g);
      r.push([c.total === f.centavos % 100 && rot.length === 1 && num(rot[0].t) === c.total && rot[0].t.startsWith(g === 'maiz' ? 'maíz' : 'frijol'),
        `paso ${n}: el cuadro del ${g === 'maiz' ? 'maíz' : 'frijol'} tiene ${c.total} cuadritos pintados, lo que vale ${f.texto} después del punto, y su rótulo dice ${rot.map(t => t.t).join(',') || '—'}`,
        [c.total, f.centavos, rot.map(t => t.t)]]);
      /* Lo real es el precio de verdad; lo de más, rayado, es la diferencia. */
      r.push([c.real === HISTORIA[idx[g]] % 100 && c.demas === c.total - c.real,
        `paso ${n}: en el ${g === 'maiz' ? 'maíz' : 'frijol'}, lo pintado de verdad es su precio (${c.real}) y lo de más va rayado (${c.demas})`, [c.real, c.demas]]);
    }
    const demas = hay.reduce((a, g) => a + cuadros[g].demas, 0);
    r.push([demas ? (x.demas.length === 1 && num(x.demas[0]) === demas) : x.demas.length === 0,
      `paso ${n}: el rótulo de lo cobrado de más dice lo que se ve rayado (${demas})`, x.demas]);
    /* El 5 del maíz son tiras de diez; el del frijol, cuadritos sueltos. */
    if (cuadros.maiz) r.push([cuadros.maiz.piezas.filter(p => p.tipo === 'real').every(p => p.a === 1 && p.b === 10), `paso ${n}: el 5 del maíz son tiras de diez (décimas)`, cuadros.maiz.piezas]);
    if (cuadros.frijol) r.push([cuadros.frijol.piezas.filter(p => p.tipo === 'real').every(p => p.a === 1 && p.b === 1), `paso ${n}: el 5 del frijol son cuadritos sueltos (centésimas)`, cuadros.frijol.piezas.filter(p => p.tipo === 'real')]);

    /* Lo que se compara entre las filas: cada «=» junta dos cifras iguales,
       y «a > b» va en la primera columna donde cambian. */
    for (const rel of x.rels) {
      const c = ORDEN.find(col => cerca(colX[col], rel.x));
      const a = filas[0].lugar && filas[0].lugar[c], b = filas[1].lugar && filas[1].lugar[c];
      const bien = rel.t === '=' ? a != null && a === b : rel.t.replace(/\s/g, '') === `${a}>${b}` && a > b;
      r.push([!!c && bien && rel.y > x.puntos[0].y && rel.y < x.puntos[1].y - 10, `paso ${n}: «${rel.t}» en ${c ? NOMBRE[c] : '—'} es verdad entre las dos filas`, [a, b]]);
    }
    const anillos = x.fichas.filter(p => p.anillo);
    r.push([anillos.every(p => p.cifra === '5'), `paso ${n}: lo que se señala es el 5`, anillos.map(p => [p.fila, p.cifra])]);
    const lugarDe = (f, cifra) => { const l = filas[f].lugar || {}; return ORDEN.find(c => l[c] === cifra); };
    const tinte = x.tintes.map(t => t.col);

    if (n === 0) {
      const iguales = filas.map(f => f.texto.replace('.', '').split('').sort().join(''));
      r.push([!tabla && filas[0].centavos === HISTORIA[0] && filas[1].centavos === HISTORIA[1] && iguales[0] === iguales[1] && e.cifra === `${filas[0].texto} y ${filas[1].texto}`,
        'paso 0: los dos precios de la historia, de corrido: las mismas cifras, y el marcador dice los dos', [filas.map(f => f.texto), e.cifra]]);
    }
    if (n === 1) {
      r.push([filas[0].centavos === HISTORIA[0] && filas[1].centavos === HISTORIA[1] && lugarDe(0, 5) === 'd' && lugarDe(1, 5) === 'c' && anillos.length === 2 && e.cifra === `${filas[0].texto} y ${filas[1].texto}`,
        'paso 1: en la tabla, el 5 del maíz cae en las décimas y el del frijol en las centésimas, y los dos van señalados', [filas.map(f => f.texto), anillos.length]]);
      r.push([x.rels.map(t => t.t).join(' ') === '= =', 'paso 1: el 12 empata en los dos (dos «=»)', x.rels.map(t => t.t)]);
    }
    if (n === 2) {
      r.push([hay.join() === 'maiz' && tinte.join() === 'd' && anillos.length === 1 && anillos[0].fila === 0 && e.cifra === (cuadros.maiz.total / 100).toFixed(2),
        'paso 2: se ilumina la columna de las décimas, se señala el 5 del maíz, y el marcador dice lo que pinta su cuadro', [hay, tinte, e.cifra]]);
    }
    if (n === 3) {
      r.push([hay.length === 2 && tinte.join() === 'c' && anillos.length === 1 && anillos[0].fila === 1 && e.cifra === (cuadros.frijol.real / 100).toFixed(2) && cuadros.maiz.total === 10 * cuadros.frijol.total,
        'paso 3: se ilumina la de las centésimas, se señala el 5 del frijol, y el mismo 5 pinta diez veces menos', [tinte, e.cifra, cuadros.maiz.total, cuadros.frijol.total]]);
    }
    if (n === 4) {
      r.push([filas[0].centavos === HISTORIA[0] && e.cifra === filas[1].texto && lugarDe(1, 5) === 'd' && demas === filas[1].centavos - HISTORIA[1] && e.palabras.includes(String(demas)) && tinte.join() === 'd',
        `paso 4: el frijol quedó como lo apuntó Marvin (${filas[1].texto}), el 5 en las décimas, y lo de más son ${demas} centavos`, [filas.map(f => f.texto), e.cifra, demas]]);
    }
    if (n === 5) {
      const [a, b] = e.cifra.split('=').map(t => t.trim());
      r.push([a === precio(HISTORIA[0]) && b === filas[0].texto && filas[0].centavos === HISTORIA[0] && filas[0].texto === filas[1].texto && x.rels.map(t => t.t).join(' ') === '= = =',
        `paso 5: sin su 0 el maíz sigue valiendo lo mismo (${e.cifra}), y las dos filas quedan iguales`, [filas.map(f => f.texto), e.cifra, x.rels.map(t => t.t)]]);
    }
    if (n === 6) {
      const primera = ORDEN.find(c => filas[0].lugar[c] !== filas[1].lugar[c]);
      const [a, b] = e.cifra.split('>').map(t => t.trim());
      r.push([filas[0].centavos === HISTORIA[0] && filas[1].centavos === HISTORIA[1] && a === filas[0].texto && b === filas[1].texto && filas[0].centavos > filas[1].centavos,
        `paso 6: los dos precios de verdad, y el marcador dice cuál vale más (${e.cifra})`, [filas.map(f => f.texto), e.cifra]]);
      const rels = x.rels.slice().sort((p, q) => p.x - q.x);
      const esperado = ORDEN.slice(0, ORDEN.indexOf(primera)).map(() => '=').concat([`${filas[0].lugar[primera]} > ${filas[1].lugar[primera]}`]);
      r.push([rels.map(t => t.t).join(' | ') === esperado.join(' | ') && tinte.join() === primera,
        `paso 6: se compara desde la izquierda: empatan hasta ${NOMBRE[primera]}, y ahí decide`, rels.map(t => t.t)]);
      const dif = cuadros.maiz.total - cuadros.frijol.total;
      r.push([dif === HISTORIA[0] - HISTORIA[1] && e.palabras.includes(String(dif)), `paso 6: la diferencia (${dif} centavos) es la que se ve en los dos cuadros`, [dif, e.palabras]]);
    }
    return r;
  },

  /* Las Fracciones: la sandía de Kenia. Los cortes se miden sobre el
     dibujo (el ángulo de cada raya desde el centro), y de ahí salen los
     pedazos: que el de Kenia sea la mitad del de su hermano y ninguno un
     quinto, que las dos copias llenen justo el de su hermano, que después
     los cinco midan lo mismo y que lo marcado sea lo que dice la fracción. */
  amSandia(e, n) {
    const x = e.extra, r = [];
    const PARTES = 5, QUINTO = 360 / PARTES;
    const cerca = (a, b, t = 0.8) => Math.abs(((a - b) % 360 + 540) % 360 - 180) <= t;
    const cortes = x.cortes.slice().sort((a, b) => a - b);
    const pedazos = cortes.map((a, i) => [a, i + 1 < cortes.length ? cortes[i + 1] : cortes[0] + 360]);
    const mide = p => p[1] - p[0];
    const dentro = (a, p) => { const b = a < p[0] ? a + 360 : a; return b > p[0] && b < p[1]; };
    const deQuien = quien => { const t = x.nombres.find(m => m.quien === quien); return t ? pedazos.find(p => dentro(t.a, p)) : null; };
    const esPedazo = t => pedazos.some(p => cerca(t[0], p[0]) && cerca(t[1] < t[0] ? t[1] + 360 : t[1], p[1] < p[0] ? p[1] + 360 : p[1]));

    if (n === 0) r.push([x.cortes.length === 0 && e.cifra === '1', 'paso 0: la sandía está entera (sin un solo corte) y el marcador dice 1', x.cortes.length]);
    else r.push([x.cortes.length === PARTES && e.cifra !== '' , `paso ${n}: se ven los ${PARTES} cortes`, x.cortes.length]);

    if (n === 1 || n === 2) {
      const k = deQuien('kenia'), h = deQuien('hermano');
      r.push([!!k && !!h && k !== h && cerca(mide(h), 2 * mide(k), 1) && pedazos.every(p => !cerca(mide(p), QUINTO, 1)),
        `paso ${n}: el pedazo de Kenia es la mitad del de su hermano, y ninguno de los cinco es un quinto`, pedazos.map(p => Math.round(mide(p)))]);
      r.push([x.marcas.length === 2 && x.marcas.every(m => esPedazo(m.a)),
        `paso ${n}: las dos rayas gruesas marcan dos pedazos de verdad (el de Kenia y el de su hermano)`, x.marcas.map(m => m.a.map(Math.round))]);
      if (n === 1) r.push([+e.cifra === pedazos.length, 'paso 1: el marcador dice cuántos pedazos hay', e.cifra]);
    } else r.push([x.marcas.length === 0, `paso ${n}: las rayas gruesas del corte de Kenia no están`, x.marcas.length]);

    if (n === 2) {
      const k = deQuien('kenia'), h = deQuien('hermano');
      const cs = x.copias.map(c => c.a).sort((a, b) => a[0] - b[0]);
      const pegadas = cs.length === 2 && cerca(cs[0][1], cs[1][0]) && cerca(cs[0][0], h[0]) && cerca(cs[1][1], h[1]);
      r.push([cs.every(c => cerca(mide(c), mide(k), 1)) && pegadas && +e.cifra === cs.length,
        `paso 2: ${cs.length} copias del pedazo de Kenia llenan justo el de su hermano, y el marcador dice ${e.cifra}`, cs.map(c => c.map(Math.round))]);
      /* Y se cuentan: cada copia lleva su número, dentro de ella. */
      const cuentan = cs.map(c => x.copiaN.filter(t => dentro(t.a, c)).map(t => t.n).join('')).join(',');
      r.push([cuentan === '1,2', 'paso 2: las copias se cuentan: 1 y 2, cada número dentro de la suya', cuentan]);
    } else r.push([x.copias.length === 0 && x.copiaN.length === 0, `paso ${n}: sin copias`, x.copias.length]);

    if (n >= 3) {
      r.push([pedazos.length === PARTES && pedazos.every(p => cerca(mide(p), QUINTO, 0.6)),
        `paso ${n}: los ${PARTES} pedazos miden lo mismo (${QUINTO}°): son quintos`, pedazos.map(p => Math.round(mide(p) * 10) / 10)]);
    }
    if (n === 3) r.push([+e.cifra === PARTES && x.panel && x.panel.den === String(PARTES),
      'paso 3: el marcador y la fracción de la derecha dicen 5 partes iguales', [e.cifra, x.panel]]);

    const nombres = x.nombres.map(m => m.quien).sort().join(',');
    const esperaN = { 1: 'hermano,kenia', 2: 'hermano,kenia', 3: 'hermano,kenia', 4: 'kenia', 5: 'hermano,kenia' }[n] || '';
    r.push([nombres === esperaN && x.nombres.every(m => pedazos.some(p => dentro(m.a, p))),
      `paso ${n}: ${esperaN ? 'los nombres van cada uno dentro de un pedazo' : 'sin nombres'}`, nombres]);

    if (n >= 4) {
      const [num, den] = (x.marcadorFr || []).map(Number);
      r.push([den === pedazos.length && num === x.quintos.length && x.quintos.every(esPedazo) && x.velos.length === den - num && x.velos.every(esPedazo),
        `paso ${n}: el marcador dice ${num}/${den}: ${num} quintos marcados de ${pedazos.length}, y los otros a media luz`, [x.marcadorFr, x.quintos.length, x.velos.length]]);
      r.push([!!x.panel && +x.panel.num === num && +x.panel.den === den, `paso ${n}: la fracción de la derecha dice lo mismo que el marcador`, x.panel]);
      if (n < 6) {
        const k = deQuien('kenia');
        r.push([!!k && x.quintos.some(t => cerca(t[0], k[0])), `paso ${n}: entre los marcados va el de Kenia`, k]);
      }
    } else r.push([x.quintos.length === 0 && x.velos.length === 0, `paso ${n}: nada marcado ni a media luz`, [x.quintos.length, x.velos.length]]);

    if (n === 6) {
      const cada = pedazos.map(p => x.etiquetas.filter(t => dentro(t.a, p)).length);
      r.push([x.etiquetas.length === PARTES && cada.every(v => v === 1) && x.etiquetas.every(t => t.num === '1' && +t.den === PARTES) && x.panel.entero && x.panel.num === x.panel.den,
        'paso 6: cada quinto lleva su 1/5, y los cinco juntos son un entero (5/5)', { cada, panel: x.panel }]);
    } else r.push([x.etiquetas.length === 0, `paso ${n}: sin los 1/5 de cada pedazo`, x.etiquetas.length]);
    if (n <= 2) r.push([!x.panel, `paso ${n}: la fracción escrita todavía no está`, x.panel]);
    return r;
  },

  /* Multiplicación y División de Fracciones: la manteca de doña Chepa. La
     manteca de cada taza se mide sobre el dibujo: cuántos pedazos, de qué
     alto y apilados desde el fondo. De ahí sale cuánto hay, y se compara
     con la fracción de al lado, con lo escrito a la derecha (que se vuelve
     a calcular aquí) y con el marcador. Y entre las dos tazas hay siempre
     3/4: la manteca no aparece ni desaparece. */
  amManteca(e, n) {
    const x = e.extra, r = [];
    const T = x.tazas, H = T[0].alto;
    const cerca = (a, b, t = 1.2) => Math.abs(a - b) <= t;
    const valor = t => { const [a, b] = t.split('/').map(Number); return a / b; };
    const igual = (a, b) => Math.abs(a - b) < 1e-9;
    const medioX = p => (p.x0 + p.x1) / 2;
    const enTaza = (p, c) => medioX(p) > T[c].x0 && medioX(p) < T[c].x1;
    /* Un octavo que tiene encima la tapa de su cuarto no se ve: se cuenta el cuarto. */
    const tapado = o => x.cuartos.some(q => medioX(o) > q.x0 && medioX(o) < q.x1 && (o.y0 + o.y1) / 2 > q.y0 && (o.y0 + o.y1) / 2 < q.y1);
    const sueltos = x.octavos.filter(o => !tapado(o));
    const piezas = x.cuartos.map(p => Object.assign({ parte: 4 }, p)).concat(sueltos.map(p => Object.assign({ parte: 8 }, p)));
    r.push([piezas.every(p => enTaza(p, 0) || enTaza(p, 1)), `paso ${n}: toda la manteca está dentro de una taza`, piezas.filter(p => !enTaza(p, 0) && !enTaza(p, 1)).length]);
    const tazas = [0, 1].map(c => {
      const ps = piezas.filter(p => enTaza(p, c)).sort((a, b) => b.y1 - a.y1);   // del fondo hacia arriba
      let techo = T[c].fondo, bien = true;
      for (const p of ps) {
        if (!cerca(p.y1, techo) || p.x0 < T[c].x0 - 1 || p.x1 > T[c].x1 + 1 || !cerca(p.y1 - p.y0, H / p.parte)) bien = false;
        techo = p.y0;
      }
      return { ps, bien, techo, hay: (T[c].fondo - techo) / H, cuartos: ps.filter(p => p.parte === 4).length, octavos: ps.filter(p => p.parte === 8).length };
    });
    r.push([tazas.every(t => t.bien), `paso ${n}: en cada taza la manteca va apilada desde el fondo, sin huecos, y cada pedazo mide su parte de la taza`,
      tazas.map(t => [t.cuartos, t.octavos])]);
    r.push([igual(tazas[0].hay + tazas[1].hay, 3 / 4) || cerca(tazas[0].hay + tazas[1].hay, 0.75, 0.01),
      `paso ${n}: entre las dos tazas hay 3/4: la manteca no aparece ni desaparece`, tazas.map(t => Math.round(t.hay * 1000) / 1000)]);

    /* Las rayas: en cuartos hasta que se parte, en octavos después, y cada
       una en su altura. */
    const partes = n >= 2 ? 8 : 4;
    const rayasBien = [0, 1].every(c => {
      const rs = x.rayas.filter(v => v.taza === c);
      return rs.length === partes - 1 && rs.every(v => { const k = Math.round((T[c].fondo - v.y) / (H / partes)); return k >= 1 && k < partes && cerca(v.y, T[c].fondo - k * H / partes, 0.8); });
    });
    r.push([rayasBien, `paso ${n}: cada taza está marcada en ${partes} partes iguales`, [0, 1].map(c => x.rayas.filter(v => v.taza === c).length)]);

    /* La fracción de al lado de cada taza: dice lo que hay, va a la altura
       de la manteca, y su número de arriba son los pedazos que se ven, del
       tamaño que dice el de abajo. */
    for (const c of [0, 1]) {
      const l = x.niveles.filter(v => v.taza === c && !v.antes), t = tazas[c];
      if (t.hay < 0.01) { r.push([l.length === 0, `paso ${n}: la taza ${c + 1} está vacía y no dice ninguna fracción`, l.map(v => v.dice)]); continue; }
      const [a, b] = l.length === 1 ? l[0].dice.split('/').map(Number) : [NaN, NaN];
      const cuenta = b === 4 ? t.cuartos : t.octavos;
      r.push([l.length === 1 && cerca(a / b, t.hay, 0.01) && cerca(l[0].y, t.techo, 2.5) && a === cuenta && t.ps.length === cuenta && l[0].x > T[c].x1,
        `paso ${n}: la taza ${c + 1} dice ${l.map(v => v.dice).join(',') || '—'}: ${cuenta} pedazos de 1/${b}, y la manteca llega justo ahí`, [t.hay, t.cuartos, t.octavos, l]]);
    }

    /* Lo escrito a la derecha se vuelve a calcular aquí. */
    const toks = x.escrito.slice().sort((p, q) => Math.abs(p.y - q.y) > 14 ? p.y - q.y : p.x - q.x);
    const segs = [[]], rels = [];
    for (const t of toks) {
      if (t.tipo === 'op' && /[=≠<]/.test(t.t)) { rels.push(t.t); segs.push([]); } else segs[segs.length - 1].push(t);
    }
    const hace = s => {
      if (!s.length || s.some(t => t.tipo === 'duda')) return null;
      const v = t => t.tipo === 'fr' ? valor(t.t) : +t.t;
      let a = v(s[0]);
      for (let i = 1; i < s.length; i += 2) a = s[i].t === '+' ? a + v(s[i + 1]) : s[i].t === '÷' ? a / v(s[i + 1]) : NaN;
      return a;
    };
    const vs = segs.map(hace);
    const verdad = rels.length > 0 && rels.every((rel, i) => vs[i] === null || vs[i + 1] === null ||
      (rel === '=' ? igual(vs[i], vs[i + 1]) : rel === '≠' ? !igual(vs[i], vs[i + 1]) : vs[i] < vs[i + 1]));
    r.push([verdad, `paso ${n}: lo escrito a la derecha es verdad (${toks.map(t => t.t).join(' ')})`, vs]);
    const frs = toks.filter(t => t.tipo === 'fr').map(t => t.t);
    const hay = [tazas[0].hay, tazas[1].hay];

    if (n === 0) {
      r.push([e.cifra === '3/4' && igual(hay[0], 3 / 4) && hay[1] === 0 && frs[0] === '3/4' && toks.some(t => t.tipo === 'duda') && toks.some(t => t.t === '÷') && toks.some(t => t.tipo === 'n' && t.t === '2'),
        'paso 0: la receta entera tiene 3/4, la media receta está vacía, y lo escrito pregunta 3/4 ÷ 2 = ?', [e.cifra, hay, frs]]);
      const d = x.duda[0];
      r.push([x.duda.length === 1 && d.x > T[1].x0 && d.x < T[1].x1, 'paso 0: la pregunta va dentro de la taza vacía', x.duda]);
    } else r.push([x.duda.length === 0, `paso ${n}: sin la pregunta dentro de la taza`, x.duda.length]);
    if (n === 1) {
      const [p, q] = (e.cifra.match(/\d+/g) || []).map(Number);
      r.push([tazas[0].cuartos === p && tazas[1].cuartos === q && p !== q && tazas[0].octavos + tazas[1].octavos === 0 && frs.length === 2 && igual(valor(frs[0]), hay[0]) && igual(valor(frs[1]), hay[1]),
        `paso 1: con cuartos enteros: ${p} y ${q}, no son iguales, y lo escrito dice lo mismo`, [e.cifra, tazas.map(t => t.cuartos), frs]]);
    }
    if (n === 2) {
      r.push([e.cifra === '6/8' && tazas[0].octavos === 6 && tazas[0].cuartos === 0 && igual(hay[0], valor(e.cifra)) && frs.join(' ') === '3/4 6/8' && x.cuchillos === 3,
        'paso 2: el cuchillo parte cada cuarto: seis octavos en la taza, y 3/4 = 6/8', [e.cifra, tazas[0].octavos, frs, x.cuchillos]]);
    } else r.push([x.cuchillos === 0, `paso ${n}: sin el cuchillo`, x.cuchillos]);
    if (n >= 3 && n <= 5) {
      r.push([e.cifra === '3/8' && igual(hay[0], hay[1]) && igual(hay[1], 3 / 8) && tazas[1].octavos === 3,
        `paso ${n}: tres octavos en cada taza: las dos mitades son iguales, y el marcador dice 3/8`, [e.cifra, hay]]);
    }
    if (n === 3 || n === 4) {
      r.push([igual(vs[vs.length - 1], hay[1]) && toks.some(t => t.t === '÷') && toks.some(t => t.tipo === 'n' && t.t === '2'),
        `paso ${n}: lo escrito termina en lo que tiene la media receta`, [vs, hay[1]]]);
    }
    if (n === 4) {
      /* La regla: el de arriba se queda y el de abajo va por 2. */
      const [a1, b1] = frs[0].split('/').map(Number), [a2, b2] = frs[frs.length - 1].split('/').map(Number);
      r.push([frs[0] === '3/4' && a1 === a2 && b1 * 2 === b2 && x.notas.join('|') === 'se queda|× 2',
        'paso 4: la regla escrita: el 3 de arriba se queda y el 4 de abajo, por 2, da 8', [frs, x.notas]]);
      /* Y los tres pedazos de la media receta se cuentan, del fondo hacia arriba. */
      const ps = tazas[1].ps;
      const dentro = (t, p) => t.x > p.x0 && t.x < p.x1 && t.y > p.y0 && t.y < p.y1;
      const leidos = ps.map(p => x.cuentas.filter(t => dentro(t, p)).map(t => t.t).join('')).join(',');
      r.push([x.cuentas.length === 3 && leidos === '1,2,3', 'paso 4: los tres pedazos de la media receta van contados, 1, 2 y 3, cada número dentro del suyo', leidos]);
    } else r.push([x.cuentas.length === 0 && x.notas.length === 0, `paso ${n}: sin los números de los pedazos ni las flechas de la regla`, [x.cuentas.length, x.notas]]);
    if (n === 5) {
      const antes = x.niveles.filter(v => v.antes), raya = x.antesRaya[0];
      const yRaya = raya ? (raya.y0 + raya.y1) / 2 : NaN;
      r.push([antes.length === 1 && antes[0].dice === '3/4' && !!raya && medioX(raya) > T[1].x0 && medioX(raya) < T[1].x1 && cerca(yRaya, T[1].fondo - H * 3 / 4) && cerca(antes[0].y, yRaya, 1.5),
        'paso 5: la raya cortada marca hasta dónde llegaba 3/4, en la taza de la media receta', [antes.map(v => v.dice), yRaya]]);
      r.push([cerca((T[1].fondo - tazas[1].techo) * 2, T[1].fondo - yRaya) && frs.join(' ') === '3/8 3/4' && rels.join('') === '<' && e.cifra === '3/8',
        'paso 5: tres octavos llegan a la mitad de donde llegaban tres cuartos, y lo escrito dice 3/8 < 3/4', [tazas[1].techo, yRaya, frs]]);
    } else r.push([x.antesRaya.length === 0 && x.niveles.every(v => !v.antes), `paso ${n}: sin la raya de 3/4`, x.antesRaya.length]);
    if (n === 6) {
      r.push([e.cifra === '3/4' && hay[1] === 0 && tazas[0].octavos === 6 && igual(hay[0], 3 / 4) && igual(vs[vs.length - 1], hay[0]) && frs.join(' ') === '3/8 3/8 6/8 3/4',
        'paso 6: las dos mitades juntas vuelven a ser 3/4, y lo escrito lo comprueba (3/8 + 3/8 = 6/8 = 3/4)', [e.cifra, hay, frs]]);
    }

    /* Los nombres, debajo de su taza. */
    const esperaN = { 0: 'receta entera|media receta', 1: 'media receta', 2: 'receta entera|media receta', 3: 'la otra mitad|media receta', 4: 'la otra mitad|media receta', 5: 'la otra mitad|media receta', 6: 'receta entera' }[n];
    const nombres = x.nombres.slice().sort((p, q) => p.x - q.x);
    r.push([nombres.map(v => v.t).join('|') === esperaN && nombres.every(v => enTaza({ x0: v.x, x1: v.x }, v.t === 'media receta' ? 1 : 0)),
      `paso ${n}: debajo de cada taza, su nombre (${esperaN})`, nombres.map(v => v.t)]);

    /* ⚠️ Lo que pregunta el «Predice» de abajo (12 × 3/4, cuántos medios
       caben en 6 tortillas y si 2/3 × 4/5 pide denominador común) no sale
       en ningún paso: ni se multiplica una fracción por otra, ni se divide
       entre un medio, ni sale el 12. */
    const dice = [e.texto, e.palabras, e.cifra].concat(toks.map(t => t.t), x.notas, x.niveles.map(v => v.dice)).join(' | ');
    const regalo = dice.match(/(^|[^\d\/])(12|9)(?![\d\/])|1\/2|2\/3|4\/5|8\/15|×\s*\d+\/\d+|\d+\/\d+\s*×|denominador común|línea recta|\bmedios\b|tortilla/i);
    r.push([!regalo, `paso ${n}: no dice nada de lo que pregunta el «Predice» (12 × 3/4, 6 ÷ 1/2, 2/3 × 4/5)`, regalo ? regalo[0] : undefined]);
    return r;
  },

  /* Potencias y Raíces: las 144 baldosas de doña Nely. Se cuentan las del
     piso una por una (en qué celda cae cada una, sobre el dibujo) y se
     comparan con la pila, los corchetes, los carteles y el marcador: si la
     pantalla dice 12 por fila, el piso tiene 12 por fila. */
  amBaldosas(e, n) {
    const x = e.extra, r = [];
    const TOTAL = 144, CELDA = 18;
    const s = x.sala;
    const lado = Math.round((s.x1 - s.x0) / CELDA);
    const medio = t => [(t.x0 + t.x1) / 2, (t.y0 + t.y1) / 2];
    const enSala = t => { const [cx, cy] = medio(t); return cx > s.x0 && cx < s.x1 && cy > s.y0 && cy < s.y1; };
    const piso = x.baldosas.filter(enSala);
    const celda = t => { const [cx, cy] = medio(t); return [Math.floor((cx - s.x0) / CELDA), Math.floor((cy - s.y0) / CELDA)]; };
    const mal = piso.filter(t => { const [c, f] = celda(t); return c !== t.c || f !== t.f || t.x0 < s.x0 - 0.5 || t.x1 > s.x1 + 0.5 || t.y0 < s.y0 - 0.5 || t.y1 > s.y1 + 0.5; });
    const celdas = new Set(piso.map(t => celda(t).join(',')));
    r.push([x.baldosas.length === piso.length && mal.length === 0 && celdas.size === piso.length,
      `paso ${n}: cada baldosa que se ve cae en su celda, dentro de las paredes, y ninguna encima de otra`,
      { fuera: x.baldosas.length - piso.length, mal: mal.slice(0, 3).map(t => [t.f, t.c]) }]);
    const w = piso.length ? Math.max(...piso.map(t => t.c)) + 1 : 0;
    const h = piso.length ? Math.max(...piso.map(t => t.f)) + 1 : 0;
    r.push([piso.length === w * h, `paso ${n}: las ${piso.length} del piso forman un rectángulo de ${w} por fila y ${h} filas, sin huecos`, [piso.length, w, h]]);
    r.push([x.pila + piso.length === TOTAL && x.capas === Math.round(x.pila / 12) && (x.pilaVacia === 1) === (x.pila === 0),
      `paso ${n}: la pila dice ${x.pila} y en el piso hay ${piso.length}: entre las dos, ${TOTAL}`, [x.pila, piso.length, x.capas]]);

    /* Los corchetes: el de arriba mide lo que va en una fila y el de la
       izquierda, las filas; los dos empiezan en la esquina del piso. En el
       paso 6 son las marcas de las paredes y van de lado a lado. */
    const arriba = x.corchetes.filter(c => c.eje === 'col'), izq = x.corchetes.filter(c => c.eje === 'fila');
    const esperaC = n === 0 ? null : n === 6 ? [lado, lado] : [w, h];
    const mide = (c, dice, a0, a1, b0) => c && c.dice === dice && Math.abs((a1 - a0) - dice * CELDA) <= 1.5 && Math.abs(a0 - b0) <= 1.5;
    if (!esperaC) r.push([x.corchetes.length === 0, `paso ${n}: todavía no hay corchetes`, x.corchetes.length]);
    else r.push([arriba.length === 1 && izq.length === 1 && mide(arriba[0], esperaC[0], arriba[0].x0, arriba[0].x1, s.x0) && mide(izq[0], esperaC[1], izq[0].y0, izq[0].y1, s.y0),
      `paso ${n}: el corchete de arriba dice ${esperaC[0]} y el de la izquierda ${esperaC[1]}, y miden eso`, x.corchetes.map(c => [c.eje, c.dice, Math.round(c.eje === 'col' ? c.x1 - c.x0 : c.y1 - c.y0)])]);

    const nb = t => t.replace(/\u00a0/g, ' ');
    const nums = t => (nb(t).match(/\d+/g) || []).map(Number);
    const esperaCartel = { 3: 1, 4: 1, 5: 1 }[n] || 0;
    r.push([x.carteles.length === esperaCartel, `paso ${n}: ${esperaCartel ? 'un cartel con la cuenta' : 'sin cartel'}`, x.carteles]);
    r.push([(x.hilos.length === (n === 6 ? 2 * (lado - 1) : 0)) && x.hilos.filter(v => v === 'col').length === x.hilos.filter(v => v === 'fila').length,
      `paso ${n}: los hilos del albañil ${n === 6 ? 'van en cada junta, de pared a pared' : 'no están'}`, x.hilos.length]);
    if (n !== 5) r.push([x.velo.length === 0, `paso ${n}: ninguna baldosa está a media luz`, x.velo.length]);

    if (n === 0) r.push([+e.cifra === x.pila && x.pila === TOTAL && piso.length === 0 && /144/.test(e.texto),
      'paso 0: el marcador dice 144, que es lo que hay en la pila, y el piso está vacío', [e.cifra, x.pila]]);
    if (n === 1) {
      const [a, b, sobran] = nums(e.palabras);
      r.push([+e.cifra === piso.length && a * b === piso.length && w === a && h === b && sobran === x.pila && w < lado,
        `paso 1: ${e.palabras}: ${piso.length} en el piso, ${x.pila} en la pila, y el piso no llega a las paredes`, [e.cifra, w, h, x.pila]]);
    }
    if (n === 2) r.push([+e.cifra === piso.length && piso.length === TOTAL && w === lado && h === lado && x.pila === 0 && nums(e.palabras).reduce((p, q) => p * q, 1) === TOTAL,
      `paso 2: ${e.palabras}: el cuarto entero, ${lado} por ${lado}, y la pila vacía`, [e.cifra, w, h, x.pila]]);
    if (n === 3) {
      const m = nb(x.carteles[0] || '').match(/^(\d+)²\s*=\s*(\d+)\s*×\s*(\d+)$/);
      const base = parseInt(e.cifra, 10);
      r.push([/²$/.test(e.cifra) && base === w && base === h && !!m && +m[1] === base && +m[2] * +m[3] === piso.length && +m[2] === base && +m[3] === base,
        `paso 3: ${e.cifra} y el cartel «${x.carteles[0]}»: la base es lo que va por lado, y ${base} × ${base} son las ${piso.length} del piso`, [e.cifra, x.carteles[0], w, h]]);
    }
    if (n === 4) {
      const m = nb(x.carteles[0] || '').match(/^(\d+)\s*×\s*(\d+)\s*=\s*(\d+)$/);
      r.push([+e.cifra === piso.length && w === lado && h === 2 && !!m && +m[1] * +m[2] === +m[3] && +m[3] === piso.length && +m[1] === w && +m[2] === h,
        `paso 4: ${x.carteles[0]}: solo ${h} filas de ${w}, y el resto sin usar en la pila`, [e.cifra, w, h, x.pila]]);
    }
    if (n === 5) {
      const m = nb(x.carteles[0] || '').match(/^√(\d+)\s*=\s*(\d+)$/);
      /* Encendidas: las que el velo no tapa. Tienen que ser justo las de un
         lado, la fila de arriba, y el velo no puede tapar ni media de ellas. */
      const v = x.velo[0];
      const tapada = t => { const [cx, cy] = medio(t); return v && cx > v.x0 && cx < v.x1 && cy > v.y0 && cy < v.y1; };
      const encendidas = piso.filter(t => !tapada(t));
      r.push([+e.cifra === w && w === h && piso.length === TOTAL && !!m && +m[1] === piso.length && +m[2] * +m[2] === +m[1] && +m[2] === w,
        `paso 5: ${x.carteles[0]}: del total del piso sale el lado, ${w}`, [e.cifra, x.carteles[0], w]]);
      r.push([x.velo.length === 1 && encendidas.length === +e.cifra && encendidas.every(t => t.f === 0 && t.y1 <= v.y0 + 0.5),
        `paso 5: quedan encendidas las ${e.cifra} de un lado (la fila de arriba) y las demás, a media luz`, encendidas.map(t => t.f).join('')]);
    }
    if (n === 6) r.push([+e.cifra === piso.length && h === 1 && w === lado && x.pila === TOTAL - lado,
      `paso 6: con las marcas puestas, la primera fila entera: ${piso.length}`, [e.cifra, w, h, x.pila]]);

    /* ⚠️ Lo que pregunta el «Predice» de abajo (5², la raíz de 81 y si 50 es
       cuadrado perfecto) no sale en ningún paso, ni en la frase ni en el dibujo. */
    const dice = [e.texto, e.palabras, e.cifra, x.pilaQue].concat(x.carteles).map(nb).join(' | ');
    const regalo = dice.match(/(^|[^\d])(25|81|50|49|64)(?![\d])|5²|9²|√81/);
    r.push([!regalo, `paso ${n}: no dice nada de lo que pregunta el «Predice» (5², √81, 50)`, regalo ? regalo[0] : undefined]);
    return r;
  },

  /* Múltiplos: el bus (cada 6 días) y el camión del agua (cada 8) de doña
     Nely. Los días se leen sobre el dibujo con la regla que dan las rayitas
     que se ven; los múltiplos, los comunes y el primero se calculan AQUÍ,
     aparte, y se comparan con las fichas, los saltos y las bandas. */
  amCalendario(e, n) {
    const x = e.extra, r = [];
    const BUS = 6, CAM = 8;
    const dia = regla(x.dias, 'x');
    const cerca = (p, q) => Math.abs(p - q) <= 0.3;
    const hasta = Math.max(...x.dias.map(d => d.v));
    const mult = (m, tope) => { const l = []; for (let v = m; v <= tope; v += m) l.push(v); return l; };
    const comunes = mult(BUS, hasta).filter(v => v % CAM === 0);
    const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    const nums = t => (t.match(/\d+/g) || []).map(Number);

    /* Cada ficha cae en la rayita del día que dice. */
    const mal = x.fichas.filter(c => !cerca(dia(c.x), c.v) || +c.dice !== c.v);
    r.push([mal.length === 0, `paso ${n}: cada ficha cae en la rayita del día que dice`, mal.map(c => [c.fila, c.v, Math.round(dia(c.x) * 10) / 10])]);
    const fila = f => x.fichas.filter(c => c.fila === f).sort((a, b) => a.x - b.x).map(c => c.v);
    /* En el paso 5 la fila del bus queda tenue a propósito («sin dibujar»):
       para la sonda, como para el alumno, no está. */
    const esperaBus = n >= 1 && n !== 5 ? mult(BUS, hasta) : [];
    const esperaCam = n >= 2 ? mult(CAM, hasta) : [];
    r.push([igual(fila('bus'), esperaBus), `paso ${n}: arriba, los días del bus: de 6 en 6 hasta donde llega la fila (${hasta})`, fila('bus')]);
    r.push([igual(fila('camion'), esperaCam), `paso ${n}: abajo, los del camión: de 8 en 8`, fila('camion')]);

    /* Los saltos: cada uno va de la rayita en que dice que empieza a la
       rayita en que dice que acaba, y los de una fila se encadenan desde hoy
       hasta su última ficha. */
    const salta = f => x.saltos.filter(s => s.fila === f).sort((a, b) => a.de - b.de);
    const cadena = (lista, paso, ultima) => lista.length > 0 && lista[0].de === 0 && lista[lista.length - 1].a === ultima &&
      lista.every((s, i) => s.a - s.de === paso && (i === 0 || s.de === lista[i - 1].a) && cerca(dia(s.x0), s.de) && cerca(dia(s.x1), s.a));
    const sb = salta('bus'), sc = salta('camion'), sm = salta('comun');
    const ult = l => l[l.length - 1];
    if (n >= 1 && n <= 4) r.push([cadena(sb, BUS, ult(esperaBus)) && sb[0].dice === '+6',
      `paso ${n}: los saltos del bus van de 6 en 6, desde hoy hasta el ${ult(esperaBus)}`, sb.map(s => [s.de, s.a])]);
    else r.push([sb.length === 0, `paso ${n}: no se ven los saltos del bus`, sb.length]);
    if (n >= 2 && n <= 5) r.push([cadena(sc, CAM, ult(esperaCam)) && sc[0].dice === '+8',
      `paso ${n}: los del camión, de 8 en 8, desde hoy hasta el ${ult(esperaCam)}`, sc.map(s => [s.de, s.a])]);
    else r.push([sc.length === 0, `paso ${n}: no se ven los saltos del camión`, sc.length]);

    /* Las bandas juntan las dos filas en un día que está en las dos (o
       hoy, que es cuando coincidieron). */
    const bandas = x.bandas.map(b => Math.round(dia(b) * 10) / 10).sort((a, b) => a - b);
    const esperaBandas = [0].concat(n >= 3 ? comunes.slice(0, n >= 6 ? 2 : 1) : []);
    r.push([igual(bandas, esperaBandas), `paso ${n}: las bandas están hoy y en los días de los dos (${esperaBandas.join(', ')})`, bandas]);
    const sobre = (texto, d) => x.rotulos.some(t => t.texto === texto && cerca(dia(t.x), d));

    if (n === 1) r.push([igual(nums(e.cifra), fila('bus').slice(0, 3)), 'paso 1: el marcador dice los tres primeros días del bus', e.cifra]);
    if (n === 2) r.push([igual(nums(e.cifra), fila('camion').slice(0, 3)), 'paso 2: el marcador dice los tres primeros días del camión', e.cifra]);
    if (n === 3) r.push([+e.cifra === comunes[0] && sobre('¡los dos!', comunes[0]),
      `paso 3: el marcador dice ${e.cifra}, el primer día de las dos filas (${comunes[0]}), y el rótulo va encima`, x.rotulos.map(t => t.texto)]);
    if (n === 4) {
      const h = x.hueco[0];
      const vacio = x.fichas.every(c => !cerca(c.v, BUS + CAM));
      r.push([x.hueco.length === 1 && cerca(dia(h), BUS + CAM) && +e.cifra === BUS + CAM && vacio && /6\s\+\s8/.test(e.palabras),
        `paso 4: 6 + 8 = ${BUS + CAM}, y en ese día no hay ficha de ninguno`, x.hueco.map(dia)]);
    } else r.push([x.hueco.length === 0, `paso ${n}: la marca del 14 no está`, x.hueco.length]);
    if (n === 5) {
      /* Sin dibujar: se cuenta de 8 en 8 y se para en el primero de la tabla
         del 6. Lo que marca cada uno se decide aquí, no se lee. */
      const esperaP = []; for (let v = CAM; ; v += CAM) { esperaP.push(v); if (v % BUS === 0) break; }
      const pr = x.pruebas.slice().sort((a, b) => a.v - b.v);
      const bien = pr.every(p => cerca(dia(p.x), p.v) && (p.v % BUS === 0 ? /✓/.test(p.texto) && nums(p.texto).reduce((a, b) => a * b, 1) === p.v : p.texto.trim() === '✗'));
      r.push([igual(pr.map(p => p.v), esperaP) && bien, `paso 5: debajo del ${esperaP.join(', del ')}: no, no, sí (${BUS} × ${ult(esperaP) / BUS})`, pr.map(p => [p.v, p.texto])]);
      const partes = e.palabras.split('=').map(t => nums(t).reduce((a, b) => a * b, 1));
      r.push([+e.cifra === ult(esperaP) && partes.length === 3 && partes.every(v => v === +e.cifra),
        `paso 5: el marcador dice ${e.cifra} y sus cuentas dan eso (${e.palabras})`, partes]);
    } else r.push([x.pruebas.length === 0, `paso ${n}: las marcas de «sin dibujar» no están`, x.pruebas.length]);
    if (n === 6) r.push([+e.cifra === BUS * CAM && comunes.includes(BUS * CAM) && comunes[0] < BUS * CAM && sobre('1.ª vez', comunes[0]) && sobre('2.ª vez', BUS * CAM),
      `paso 6: 6 × 8 = ${BUS * CAM} es de los dos, pero después del ${comunes[0]}, y los rótulos lo dicen`, x.rotulos.map(t => t.texto)]);
    if (n === 7) {
      const dice = nums(e.cifra);
      r.push([dice.length >= 3 && dice.every((v, i) => v % BUS === 0 && v % CAM === 0 && v === comunes[0] * (i + 1)),
        `paso 7: ${e.cifra} son de los dos, y van de ${comunes[0]} en ${comunes[0]}`, dice]);
      r.push([cadena(sm, comunes[0], ult(comunes)) && sm.every(s => s.dice === '+' + comunes[0]),
        `paso 7: los saltos de los dos van de ${comunes[0]} en ${comunes[0]}, desde hoy`, sm.map(s => [s.de, s.a, s.dice])]);
    } else r.push([sm.length === 0, `paso ${n}: los saltos de los dos todavía no están`, sm.length]);
    return r;
  },

  /* Teoría de Números: los 48 cuadernos y los 36 lápices. Se cuenta el
     dibujo pieza por pieza: en qué grupo cayó cada una (el plato más
     cercano) y cuántas se quedaron en la mesa. Los divisores, los comunes y
     el mayor se calculan AQUÍ, aparte, y se comparan con las fichas que se
     ven: si alguien cambia un número del dibujo, la cuenta no cuadra. */
  amReparto(e, n) {
    const x = e.extra, r = [];
    const divs = m => { const d = []; for (let i = 1; i <= m; i++) if (m % i === 0) d.push(i); return d; };
    const D48 = divs(48), D36 = divs(36), COM = D48.filter(v => D36.includes(v)), MCD = Math.max(...COM);
    const MESA = 90;                     // arriba de esto es la mesa; abajo, los grupos
    const k = /grupos/.test(e.cifra) ? parseInt(e.cifra, 10) : 0;
    if (k) {
      r.push([x.platos.length === k, `paso ${n}: se ven ${k} grupos, los que dice el marcador`, x.platos.length]);
      const grupoDe = p => {
        let mejor = -1, d = 1e9;
        x.platos.forEach((px, i) => { const dd = Math.abs(px - p.x); if (dd < d) { d = dd; mejor = i; } });
        return d <= 6 ? mejor : -1;
      };
      const reparto = lista => {
        const por = x.platos.map(() => 0);
        let mesa = 0, sueltas = 0;
        lista.forEach(p => { if (p.y < MESA) mesa++; else { const g = grupoDe(p); if (g < 0) sueltas++; else por[g]++; } });
        return { por, mesa, sueltas };
      };
      const C = reparto(x.cuadernos), L = reparto(x.lapices);
      const parejo = a => a.length > 0 && a.every(v => v === a[0]);
      r.push([C.sueltas === 0 && parejo(C.por) && C.por[0] === Math.floor(48 / k) && C.mesa === 48 % k,
        `paso ${n}: a cada grupo le tocan ${Math.floor(48 / k)} cuadernos y en la mesa quedan ${48 % k}`, [C.por, C.mesa]]);
      r.push([L.sueltas === 0 && parejo(L.por) && L.por[0] === Math.floor(36 / k) && L.mesa === 36 % k,
        `paso ${n}: a cada grupo le tocan ${Math.floor(36 / k)} lápices y en la mesa quedan ${36 % k}`, [L.por, L.mesa]]);
      const dC = +((e.palabras.match(/(\d+) cuadernos?/) || [])[1] || 0);
      const dL = +((e.palabras.match(/(\d+) lápi(?:z|ces)/) || [])[1] || 0);
      if (/^sobra/.test(e.palabras)) {
        r.push([dC === C.mesa && dL === L.mesa, `paso ${n}: el marcador dice lo que se quedó en la mesa (${e.palabras})`, [C.mesa, L.mesa]]);
      } else {
        r.push([C.mesa === 0 && L.mesa === 0 && dC === C.por[0] && dL === L.por[0],
          `paso ${n}: no sobra nada, y el marcador dice lo que le toca a cada grupo (${e.palabras})`, [C.por[0], L.por[0]]]);
      }
      const rot = que => (x.sobran.find(s => s.que === que) || {}).n;
      r.push([x.sobran.length === 2 && rot('cuadernos') === C.mesa && rot('lapices') === L.mesa,
        `paso ${n}: el rótulo de cada montón dice lo que se quedó en la mesa`, x.sobran.map(s => s.texto)]);
      if (n === 7) r.push([k === MCD, `paso 7: se reparte entre el Máximo Común Divisor de 48 y 36 (${MCD})`, k]);
    } else {
      const arriba = x.cuadernos.filter(p => p.y < MESA).length + x.lapices.filter(p => p.y < MESA).length;
      r.push([x.cuadernos.length === 48 && x.lapices.length === 36 && arriba === 84 && x.platos.length === 0,
        `paso ${n}: los 48 cuadernos y los 36 lápices están en el montón, sin repartir`, [x.cuadernos.length, x.lapices.length, arriba]]);
      if (n !== 6) r.push([e.cifra === '48 y 36', `paso ${n}: el marcador dice 48 y 36`, e.cifra]);
    }
    if (n >= 4 && n <= 6) {
      const fila = f => x.chips.filter(c => c.fila === f).sort((a, b) => a.x - b.x);
      const f48 = fila(48), f36 = fila(36);
      r.push([JSON.stringify(f48.map(c => c.v)) === JSON.stringify(D48) && f48.every(c => +c.dice === c.v),
        `paso ${n}: la fila de arriba son los divisores de 48, en orden`, f48.map(c => c.dice)]);
      r.push([JSON.stringify(f36.map(c => c.v)) === JSON.stringify(D36) && f36.every(c => +c.dice === c.v),
        `paso ${n}: la de abajo, los de 36`, f36.map(c => c.dice)]);
      let columnas = true;
      f48.forEach(a => f36.forEach(b => { if ((Math.abs(a.x - b.x) < 1) !== (a.v === b.v)) columnas = false; }));
      r.push([columnas, `paso ${n}: cada número tiene su columna: el que está en las dos filas queda uno encima del otro`]);
      const com = x.comunes.map(c => c.v).sort((a, b) => a - b);
      const marcadas = x.chips.filter(c => c.marcada).map(c => c.v);
      if (n === 4) r.push([com.length === 0 && marcadas.length === 0, 'paso 4: todavía no se marca ningún común', com]);
      else {
        const enSuColumna = x.comunes.every(c => {
          const a = f48.find(q => q.v === c.v), b = f36.find(q => q.v === c.v);
          return a && b && Math.abs(a.x - c.x) < 1 && Math.abs(b.x - c.x) < 1;
        });
        r.push([JSON.stringify(com) === JSON.stringify(COM) && enSuColumna,
          `paso ${n}: los puentes unen justo los divisores comunes (${COM.join(', ')})`, com]);
        r.push([marcadas.length === 2 * COM.length && marcadas.every(v => COM.includes(v)),
          `paso ${n}: y esas fichas están pintadas en las dos filas`, marcadas.length]);
      }
      if (n === 6) {
        const m = x.mayor[0], col = m && f48.find(q => q.v === m.v);
        r.push([x.mayor.length === 1 && m.v === MCD && +e.cifra === MCD && !!col && Math.abs(col.x - m.x) < 1 &&
          x.mcd.length === 1 && Math.abs(x.mcd[0].x - m.x) < 1,
          `paso 6: el marco va en la columna del ${MCD}, el mayor de los comunes, y el marcador dice ${e.cifra}`, x.mayor.map(q => q.v)]);
      } else r.push([x.mayor.length === 0 && x.mcd.length === 0, `paso ${n}: el marco del mayor todavía no está`]);
    }
    return r;
  },

  /* Recta Numérica: la vara de la pila de don Tulio. Todo se lee sobre
     el dibujo con la regla que dan las marcas que se ven. */
  amVara(e, n) {
    const x = e.extra, r = [];
    const cerca = (p, q, tol) => Math.abs(p - q) <= (tol || 0.5);
    if (n <= 3) {
      const v = regla(x.marcasV, 'y');
      const nivel = v ? v(x.agua) : NaN;
      const espera = n === 0 ? 38 : 24;
      r.push([cerca(nivel, espera), `paso ${n}: el agua está en la raya del ${espera}`, Math.round(nivel * 10) / 10]);
      if (n <= 1) r.push([+e.cifra === espera, `paso ${n}: y el marcador dice ${espera}`, e.cifra]);
      if (n >= 2) {
        const bien = x.saltos.every(s => {
          const lo = v(s.caja.y1), hi = v(s.caja.y0);
          return cerca(Math.min(s.de, s.a), lo, 0.6) && cerca(Math.max(s.de, s.a), hi, 0.6) && +s.dice === Math.abs(s.a - s.de);
        });
        const total = x.saltos.reduce((t, s) => t + Math.abs(s.a - s.de), 0);
        r.push([x.saltos.length === 2 && bien && total === 38 - 24,
          `paso ${n}: cada salto va de la raya en que empieza a la raya en que acaba, y suman 38 − 24`, x.saltos.map(s => [s.de, s.a, s.dice])]);
      }
      if (n === 3) {
        const malas = x.cuentas.filter(c => { const k = cuenta(c); return k.hecho !== k.dice; });
        r.push([x.cuentas.length === 2 && malas.length === 0, 'paso 3: la resta y su prueba dan lo que dicen', x.cuentas]);
      }
    } else {
      const v = regla(x.marcasH, 'x');
      const malos = x.puntos.filter(p => !cerca(v(p.x), p.v));
      r.push([malos.length === 0 && x.puntos.length === (n >= 6 ? 3 : 2), `paso ${n}: cada punto de la recta cae en su número`, x.puntos.map(p => p.v)]);
      const espera = n === 4 ? 38 : +e.cifra;
      r.push([cerca(v(x.rana), espera), `paso ${n}: la rana está en el ${espera}`, Math.round(v(x.rana) * 10) / 10]);
      if (n >= 5) {
        const s = x.saltos[0];
        const bien = s && x.saltos.length === 1 && cerca(v(s.caja.x0), Math.min(s.de, s.a), 0.6) && cerca(v(s.caja.x1), Math.max(s.de, s.a), 0.6) &&
          +s.dice.replace('−', '-') === s.a - s.de && s.a === espera;
        r.push([!!bien, `paso ${n}: el salto va de ${s ? s.de : '?'} a ${s ? s.a : '?'}, dice ${s ? s.dice : '?'} y acaba donde está la rana`, s && [s.de, s.a, s.dice]]);
        const k = cuenta(e.palabras);
        r.push([k.hecho === k.dice && k.dice === +e.cifra, `paso ${n}: la cuenta del marcador da (${e.palabras})`, [k.hecho, k.dice]]);
      }
    }
    return r;
  },

  /* Valor Posicional: la libreta de Marvin. El número se ARMA mirando
     en qué columna quedó cada ficha, no se lee de ningún sitio. */
  amLibreta(e, n) {
    const x = e.extra, r = [];
    const num = +e.cifra.replace(/,/g, '');
    const enTabla = x.cartas.filter(c => !c.caida);
    const lugarDe = c => {
      const col = x.cols.reduce((m, k) => Math.abs(k.x - c.x) < Math.abs(m.x - c.x) ? k : m, x.cols[0]);
      return Math.abs(col.x - c.x) < 6 ? col.lugar : NaN;
    };
    const armado = enTabla.reduce((s, c) => s + c.cifra * lugarDe(c), 0);
    const lugares = enTabla.map(lugarDe).sort((a, b) => b - a);
    const seguidas = lugares.every((l, i) => l === Math.pow(10, lugares.length - 1 - i));
    r.push([armado === num && seguidas, `paso ${n}: las fichas, cada una en su columna, forman ${armado.toLocaleString('en-US')} y el marcador dice ${e.cifra}`, lugares]);
    const malValor = enTabla.filter(c => c.valores.length && c.valores[0] !== c.cifra * lugarDe(c));
    r.push([malValor.length === 0, `paso ${n}: lo que dice debajo de cada ficha es la cifra por su lugar`, malValor.map(c => [c.cifra, c.valores[0]])]);
    for (const s of x.sumas) {
      if (s.includes('?')) continue;
      const c = cuenta(s);
      r.push([c.hecho === c.dice && c.dice === num, `paso ${n}: la cuenta de abajo da lo que dice (${s})`, [c.hecho, c.dice, num]]);
    }
    const caidas = x.cartas.filter(c => c.caida);
    if (n === 2 || n === 3) {
      r.push([caidas.length === 1 && caidas[0].cifra === 0 && caidas[0].raya !== 'none',
        `paso ${n}: el 0 está afuera de la tabla, con raya cortada`, caidas.map(c => c.cifra)]);
    } else r.push([caidas.length === 0, `paso ${n}: no hay ninguna ficha tirada`, caidas.length]);
    if (n === 3) {
      const iguales = x.tramos.every(w => Math.abs(w - x.marvin) < 0.6);
      r.push([x.tramos.length === 10 && iguales && x.marvin > 0,
        'paso 3: la barra larga son diez barras iguales a la de Marvin', [x.tramos.length, x.marvin]]);
    }
    if (n >= 5) {
      const porDiez = x.lugares.every((l, i) => i === x.lugares.length - 1 || l === 10 * x.lugares[i + 1]);
      r.push([porDiez && x.lugares[x.lugares.length - 1] === 1 && x.flechas === x.lugares.length - 1,
        `paso ${n}: cada columna vale diez veces la de su derecha, con su flecha`, [x.lugares, x.flechas]]);
    }
    const colX = l => (x.cols.find(c => c.lugar === l) || {}).x;
    const entre = (cx, a, b) => cx > colX(a) && cx < colX(b);
    const comasBien = x.comas.length === (n === 6 ? 2 : 1) && x.comas.some(cx => entre(cx, 1000, 100)) &&
      (n !== 6 || x.comas.some(cx => entre(cx, 1000000, 100000)));
    r.push([comasBien, `paso ${n}: la coma va entre los miles y las centenas${n === 6 ? ', y entre el millón y los miles' : ''}`, x.comas]);
    return r;
  },

  /* Números Grandes: los 130 huevos de doña Chepa. */
  amHuevos(e, n) {
    const num = e.cifra === '?' ? null : +e.cifra.replace(/,/g, '');
    const vivos = e.huevos.filter(h => h.ve && !h.roto);
    const rotos = e.huevos.filter(h => h.ve && h.roto);
    const col = h => h.x < 112 ? 'C' : h.x < 212 ? 'D' : 'U';
    if (n === 0) return [[num === null && vivos.length === 130, 'paso 0: los 130 huevos revueltos y el marcador sin cifra', [e.cifra, vivos.length]]];
    if (n <= 13) {
      const enFila = vivos.filter(h => h.y < 125);
      const columnas = {};
      enFila.forEach(h => { const c = Math.round(h.x); columnas[c] = (columnas[c] || 0) + 1; });
      const cuantas = Object.values(columnas);
      return [[num === 10 * n && enFila.length === 10 * n && cuantas.length === n && cuantas.every(c => c === 10) && vivos.length === 130,
        `paso ${n}: ${n} fila(s) de 10 = ${10 * n}, y el marcador dice lo mismo`, [e.cifra, enFila.length, cuantas.length]]];
    }
    if (n <= 16) {
      const por = { C: 0, D: 0, U: 0 };
      vivos.forEach(h => por[col(h)]++);
      const r = [];
      if (n < 16) {
        r.push([num === 130 && por.C === 100 && por.D === 30 && por.U === 0 && rotos.length === 0,
          `paso ${n}: 100 en la centena y 30 en las decenas: 130`, [e.cifra, por]]);
        if (n === 15) r.push([e.digitos === '130', 'paso 15: la tabla dice 1 3 0', e.digitos]);
      } else {
        r.push([num === 103 && por.C === 100 && por.D === 0 && por.U === 3,
          'paso 16: 100 + 0 + 3 = 103, y el marcador dice 103', [e.cifra, por]]);
        r.push([rotos.length === 27 && rotos.every(h => col(h) === 'D' && h.raya !== 'none'),
          'paso 16: los 27 que faltan quedan en las decenas con raya cortada (no solo más pálidos)', rotos.length]);
        r.push([e.digitos === '103', 'paso 16: la tabla dice 1 0 3 (el 3 se mudó a las unidades)', e.digitos]);
      }
      return r;
    }
    const total = e.vale + vivos.length;
    return [[total === num, `paso ${n}: lo que se ve suma ${total.toLocaleString('en-US')} y el marcador dice ${e.cifra}`, [total, e.cifra]]];
  }
};

function frases(t) {
  return t.split(/(?<=[.!?…])\s+/).map(f => f.split(/\s+/).filter(p => /[\p{L}\p{N}]/u.test(p)).length);
}

(async () => {
  console.log(`\nLa animación que explica el tema, abierta: ${misiones.length} misión(es)`);
  if (!misiones.length) { console.log('  (ninguna la monta todavía)'); process.exit(0); }
  const nav = await abrir({ args: ['--no-sandbox'] });

  for (const m of misiones) {
    console.log(`\n${decodeURI(m.url)}  (#${m.id})`);
    const ctx = await nav.newContext(Object.assign({}, SIN_SW, {
      viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce', locale: 'es-HN'
    }));
    await ctx.addInitScript(() => {
      try { localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({ nombre: 'Ana López', num: '7', grupo: '4-1' })); } catch (e) { }
    });
    /* La nube no se toca: lo de fuera se corta, y se anota lo que se pidió
       DESPUÉS del primer toque a la animación. */
    let midiendo = false;
    const fuera = [];
    await ctx.route(url => !url.href.startsWith(BASE), r => { if (midiendo) fuera.push(r.request().url()); r.abort(); });
    const pag = await ctx.newPage();
    const errores = [];
    pag.on('pageerror', e => errores.push(e.message));
    await pag.goto(`${BASE}/${m.url}`, { waitUntil: 'load' });
    await pag.waitForSelector(`#${m.id} .am-sigue`, { timeout: 15000 });
    await pag.evaluate(LEER);
    await pag.evaluate(() => {
      window.__premios = [];
      ['fin', 'pts', 'unlockAchievement'].forEach(n => {
        const f = window[n];
        if (typeof f === 'function') window[n] = function () { window.__premios.push(n); return f.apply(this, arguments); };
      });
    });
    const xp0 = await pag.evaluate(() => (document.getElementById('xpPts') || {}).textContent);
    const tarjeta = pag.locator(`#${m.id}`);
    await tarjeta.scrollIntoViewIfNeeded();
    /* El aparato vuelve a medir las frases cuando llega la letra de la
       misión y cuando se pone la letra grande (con un respiro de 80 ms):
       un alumno no toca antes, y la sonda tampoco. */
    await pag.evaluate(() => document.fonts && document.fonts.ready);
    await pag.waitForTimeout(400);

    /* 0 · montada, y en su sitio */
    const base = await pag.evaluate(id => {
      const raiz = document.getElementById(id);
      const svg = raiz.querySelector('svg');
      const sit = document.querySelector('[data-situacion]');
      return {
        montada: raiz.classList.contains('am-raiz'),
        tras: !!sit && sit.nextElementSibling === raiz.closest('[data-animacion]'),
        img: svg && svg.getAttribute('role') === 'img' && (svg.getAttribute('aria-label') || '').length > 10,
        vivo: raiz.querySelector('.am-texto').getAttribute('aria-live') === 'polite',
        pasos: raiz.amControl.pasos
      };
    }, m.id);
    ok(base.montada, 'el aparato se montó (la frase de reserva ya no está)');
    ok(base.tras, 'la tarjeta va justo después de la historia');
    ok(base.img && base.vivo, 'el dibujo tiene su descripción y la frase se anuncia');

    /* 1 · el recorrido entero, con el dedo */
    midiendo = true;
    const vistos = [];
    let partidasTodas = 0;
    const escena = ESCENAS[m.id];
    for (let n = 0; n < base.pasos; n++) {
      const e = await pag.evaluate(id => window.__amLeer(id), m.id);
      vistos.push(e);
      ok(e.paso === n, `paso ${n}: el botón lleva paso a paso`, e.paso);
      const largas = frases(e.texto).filter(x => x > 25);
      if (!e.texto.trim() || largas.length) ok(false, `paso ${n}: la frase existe y ninguna pasa de 25 palabras`, largas);
      if (escena) for (const [bien, txt, extra] of escena(e, n)) ok(bien, txt, extra);
      const partidas = await pag.evaluate(id => window.__amPartidas(id), m.id);
      if (partidas.length) ok(false, `paso ${n}: ninguna cuenta se parte entre dos renglones`, partidas);
      partidasTodas += partidas.length;
      await pag.click(`#${m.id} .am-sigue`);
    }
    const repetidas = vistos.filter((e, i) => i > 0 && e.texto === vistos[i - 1].texto).length;
    ok(repetidas === 0, 'cada paso dice algo distinto del anterior', repetidas);
    ok(vistos.every(e => e.texto.trim()) , `las ${vistos.length} frases existen y son de 25 palabras o menos`);
    ok(partidasTodas === 0, 'ninguna cuenta de las frases se parte entre dos renglones', partidasTodas);
    const vuelta = await pag.evaluate(id => window.__amLeer(id), m.id);
    ok(vuelta.paso === 0 && vuelta.texto === vistos[0].texto, 'el último paso empieza otra vez desde el principio');
    /* ⚠️ El botón que avanza no se mueve de un paso a otro, ni el dibujo.
       Se movían hasta 58 px en un teléfono de 360 px, porque la frase y el
       marcador cambian de largo: el que toca «siguiente» de corrido caía
       en el hueco o encima de la frase. */
    const rango = k => Math.max(...vistos.map(e => e[k])) - Math.min(...vistos.map(e => e[k]));
    ok(rango('yBoton') <= 1 && rango('yDibujo') <= 1, 'el botón que avanza y el dibujo no se mueven de un paso a otro',
      { boton: Math.round(rango('yBoton')), dibujo: Math.round(rango('yDibujo')) });

    /* 2 · atrás, y el teclado */
    await pag.click(`#${m.id} .am-sigue`);
    await pag.click(`#${m.id} .am-sigue`);
    await pag.click(`#${m.id} .am-atras`);
    const tras = await pag.evaluate(id => window.__amLeer(id), m.id);
    ok(tras.paso === 1 && tras.texto === vistos[1].texto, '«Atrás» vuelve al paso anterior');
    await pag.focus(`#${m.id} .am-sigue`);
    const y0 = await pag.evaluate(() => scrollY);
    await pag.keyboard.press('Enter');
    await pag.keyboard.press('Space');
    const tecla = await pag.evaluate(() => ({ paso: document.activeElement.closest('.am-raiz').amControl.paso(), y: scrollY }));
    ok(tecla.paso === 3, 'Enter y la barra espaciadora avanzan (sin el dedo)', tecla.paso);
    ok(tecla.y === y0, 'y la barra espaciadora no desliza la página', [y0, tecla.y]);

    /* 3 · sin movimiento, nada se mueve */
    const quieto = await pag.evaluate(id => {
      const svg = document.getElementById(id).querySelector('svg');
      const hijo = svg.querySelector('g *') || svg.firstElementChild;
      return { clase: svg.classList.contains('am-quieto'), dur: getComputedStyle(hijo).transitionDuration };
    }, m.id);
    ok(quieto.clase && /^0s(, 0s)*$/.test(quieto.dur), 'con «reducir movimiento» cada paso llega de golpe', quieto);

    /* 4 · cabe en el teléfono, y se toca */
    const medida = await pag.evaluate(id => {
      const raiz = document.getElementById(id);
      const card = raiz.closest('[data-animacion]').getBoundingClientRect();
      const svg = raiz.querySelector('svg').getBoundingClientRect();
      const botones = [].filter.call(raiz.querySelectorAll('button'), b => !b.hidden)
        .map(b => { const r = b.getBoundingClientRect(); return [b.textContent.trim(), Math.round(r.width), Math.round(r.height)]; });
      return { ancho: document.documentElement.scrollWidth, dentro: svg.left >= card.left && svg.right <= card.right + 0.5, botones };
    }, m.id);
    ok(medida.ancho <= 360 && medida.dentro, 'nada se sale del teléfono de 360 px', medida.ancho);
    ok(medida.botones.every(b => b[1] >= 44 && b[2] >= 44), 'todo botón mide por lo menos 44 × 44 px', medida.botones);
    /* ⚠️ La letra del botón que avanza se lee en TODO su fondo, que es un
       degradado: con el ámbar de Potencias y Raíces la punta dejaba el
       rótulo blanco a 2,15:1. Se mide contra cada color del degradado. */
    const letraBoton = await pag.evaluate(id => {
      const b = document.getElementById(id).querySelector('.am-sigue'), cs = getComputedStyle(b);
      const rgb = c => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; const [r, g, bl] = rgb(c); return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl); };
      const razon = (a, c) => { const x = lum(a), y = lum(c); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      const fondos = (cs.backgroundImage.match(/rgba?\([^)]+\)/g) || []).concat(cs.backgroundImage === 'none' ? [cs.backgroundColor] : []);
      return fondos.map(f => Math.round(razon(cs.color, f) * 100) / 100);
    }, m.id);
    ok(letraBoton.length > 0 && Math.min(...letraBoton) >= 4.5, 'la letra del botón que avanza se lee en todo su degradado (4,5:1 o más)', letraBoton);

    /* 5 · no regala nada, no sale del sitio, no revienta */
    const fin = await pag.evaluate(() => ({ premios: window.__premios, xp: (document.getElementById('xpPts') || {}).textContent }));
    ok(fin.premios.length === 0 && fin.xp === xp0, 'mirarla no da XP, ni estrella, ni logro', fin);
    ok(fuera.length === 0, 'no pide nada fuera del sitio', fuera.slice(0, 3));
    ok(errores.length === 0, 'sin errores de JavaScript', errores.slice(0, 2));
    await ctx.close();

    /* 3-bis · y CON movimiento, se mueve. Se abre en la pantalla OSCURA,
       que es como la tienen muchos teléfonos, para mirar también el
       contraste. */
    const ctx2 = await nav.newContext(Object.assign({}, SIN_SW, { viewport: { width: 360, height: 740 }, colorScheme: 'dark' }));
    await ctx2.addInitScript(() => {
      try { localStorage.setItem('METAS_ALUMNO_V1', JSON.stringify({ nombre: 'Ana López', num: '7', grupo: '4-1' })); } catch (e) { }
    });
    await ctx2.route(url => !url.href.startsWith(BASE), r => r.abort());
    const pag2 = await ctx2.newPage();
    await pag2.goto(`${BASE}/${m.url}`, { waitUntil: 'load' });
    await pag2.waitForSelector(`#${m.id} .am-sigue`, { timeout: 15000 });
    await pag2.click(`#${m.id} .am-sigue`);
    const mov = await pag2.evaluate(id => {
      const svg = document.getElementById(id).querySelector('svg');
      const hijo = svg.querySelector('g *') || svg.firstElementChild;
      return { clase: svg.classList.contains('am-quieto'), dur: getComputedStyle(hijo).transitionDuration };
    }, m.id);
    ok(!mov.clase && /[1-9]/.test(mov.dur), 'sin «reducir movimiento», los pasos se mueven', mov);
    /* ⚠️ En la pantalla oscura el número del marcador y las cifras del
       dibujo se leen: el azul de la misión, pensado para fondo claro, se
       leía a 2,8:1 sobre la tarjeta oscura. Se piden 4,5:1, que es lo que
       se le pide a una letra normal (el marcador es grande, pero las cifras
       de las fichas no). Se miran en todos los pasos: cada uno enseña
       cifras distintas. */
    const contrastes = [];
    const pasos2 = await pag2.evaluate(id => document.getElementById(id).amControl.pasos, m.id);
    for (let n = 0; n < pasos2; n++) {
      contrastes.push(...await pag2.evaluate(([id, n]) => {
        const raiz = document.getElementById(id);
        raiz.amControl.ir(n);
        const rgb = c => (c.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
        const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; const [r, g, b] = rgb(c); return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const razon = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
        let fondo = 'rgb(255, 255, 255)';
        for (let e = raiz; e; e = e.parentElement) {
          const bg = getComputedStyle(e).backgroundColor;
          if (bg && !/rgba\(.*,\s*0\)$/.test(bg) && bg !== 'transparent') { fondo = bg; break; }
        }
        const out = [['marcador', razon(getComputedStyle(raiz.querySelector('.am-cifra')).color, fondo)]];
        /* Las cifras del dibujo que se ven en este paso, sobre su ficha (del
           color de la tarjeta). */
        const seVe = el => { for (let e = el; e && e.tagName.toLowerCase() !== 'svg'; e = e.parentNode) { const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < 0.99) return false; } return true; };
        [].forEach.call(raiz.querySelectorAll('text.am-digito'), t => {
          if (seVe(t)) out.push(['cifra ' + t.textContent + ' (paso ' + n + ')', razon(getComputedStyle(t).fill, fondo)]);
        });
        return out.map(o => [o[0], Math.round(o[1] * 10) / 10]);
      }, [m.id, n]));
    }
    const bajas = contrastes.filter(c => c[1] < 4.5);
    ok(bajas.length === 0, 'en la pantalla oscura, el marcador y las cifras del dibujo se leen (4,5:1 o más)',
      bajas.length ? bajas.slice(0, 3) : Math.min(...contrastes.map(c => c[1])));
    await ctx2.close();
  }

  await nav.close();
  console.log('\n' + (fallos ? `✘ ${fallos} comprobaciones fallaron` : '✓ la animación dice lo que dibuja, se usa sin el dedo y no regala nada'));
  process.exit(fallos ? 1 : 0);
})();
