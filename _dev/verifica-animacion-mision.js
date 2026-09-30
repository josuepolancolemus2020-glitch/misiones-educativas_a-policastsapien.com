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
  /* Perímetro y Área: el gallinero de Don Chele. Del piso se lee su caja; de
     cada cuadrito, su caja y su número; de cada tramo de malla y de cada lado
     de la orilla, sus dos puntas; de las tablas y de lo que faltó, sus puntas;
     y de cada gallina, dónde está. Todo ya puesto en la vista. */
  window.__amExtra.amGallinero = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function linea(el) { return [aVista(el, +el.getAttribute('x1'), +el.getAttribute('y1')), aVista(el, +el.getAttribute('x2'), +el.getAttribute('y2'))]; }
    function caja(el) { var x = +el.getAttribute('x'), y = +el.getAttribute('y'), a = aVista(el, x, y), b = aVista(el, x + +el.getAttribute('width'), y + +el.getAttribute('height')); return [a[0], a[1], b[0], b[1]]; }
    function medio(el) { var b = el.getBBox(); return aVista(el, b.x + b.width / 2, b.y + b.height / 2); }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function uno(sel) { return raiz.querySelector(sel); }
    var hueco = uno('.gl-hueco');
    return {
      piso: caja(uno('.gl-piso')),
      cuadros: todos('.gl-cuadro').filter(vis).map(function (q) { return { n: +q.getAttribute('data-n'), c: caja(q) }; }),
      numeros: todos('.gl-num').filter(vis).map(function (t) { return { dice: t.textContent, c: medio(t) }; }),
      malla: todos('.gl-malla').filter(trazada).map(function (m) { return { m: +m.getAttribute('data-m'), l: linea(m) }; }),
      postes: todos('.gl-poste').filter(vis).map(function (p) { return aVista(p, +p.getAttribute('cx'), +p.getAttribute('cy')); }),
      hueco: vis(hueco) ? (hueco.getAttribute('d').match(/-?[0-9.]+/g) || []).map(Number).reduce(function (o, v, i, l) { if (i % 2 === 0) o.push(aVista(hueco, v, l[i + 1])); return o; }, []) : null,
      tablas: vis(uno('.gl-tablas')) ? todos('.gl-tabla').map(linea) : [],
      orilla: todos('.gl-orilla').filter(trazada).map(function (o) { return { lado: +o.getAttribute('data-lado'), l: linea(o) }; }),
      lados: todos('.gl-lado').filter(vis).map(function (t) { return { lado: +t.getAttribute('data-lado'), dice: t.textContent, c: medio(t), cuenta: t.classList.contains('gl-lado-cuenta') }; }),
      unCuadro: vis(uno('.gl-un-cuadro')) ? caja(uno('.gl-un-cuadro')) : null,
      unaRaya: vis(uno('.gl-una-raya')) ? linea(uno('.gl-una-raya')) : null,
      unidades: todos('.gl-unidad').filter(vis).map(function (t) { return { dice: t.textContent, c: medio(t) }; }),
      gallinas: todos('.gl-gallina').map(function (g) { return aVista(g, 0, 0); })
    };
  };
  /* Ángulos: Tipos y Transportador: la rampa de Kenia. Del mundo se leen el
     suelo y la rampa ya puestos en la vista, con el acercamiento que lleven
     encima; del transportador, su centro, su base, sus rayas y sus números,
     también en la vista. Con eso la sonda mide el ángulo de la rampa y lee el
     transportador sin creerle a ningún rótulo. */
  window.__amExtra.amRampa = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function linea(el) { return [aVista(el, +el.getAttribute('x1'), +el.getAttribute('y1')), aVista(el, +el.getAttribute('x2'), +el.getAttribute('y2'))]; }
    function circulo(el) { return aVista(el, +el.getAttribute('cx'), +el.getAttribute('cy')); }
    function medio(el) { var b = el.getBBox(); return aVista(el, b.x + b.width / 2, b.y + b.height / 2); }
    function escala(el) { var m = base.multiply(el.getScreenCTM()); return Math.hypot(m.a, m.b); }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function extremos(p) { var L = p.getTotalLength(), a = p.getPointAtLength(0), b = p.getPointAtLength(L); return [aVista(p, a.x, a.y), aVista(p, b.x, b.y)]; }
    function uno(sel) { return raiz.querySelector(sel); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    var centro = uno('.tr-centro'), vertice = uno('.tr-vertice'), anillo = uno('.tr-anillo'), lectura = uno('.tr-lectura'), tachado = uno('.tr-tachado');
    return {
      mundo: escala(uno('.tr-mundo')),
      suelo: linea(uno('.tr-suelo')),
      rampa: linea(uno('.tr-rampa')),
      lados: todos('.tr-lado').filter(vis).map(function (l) { return { suelo: l.classList.contains('tr-lado-suelo'), l: linea(l) }; }),
      vertice: vis(vertice) ? circulo(vertice) : null,
      arco: vis(uno('.tr-arco')),
      pregunta: vis(uno('.tr-pregunta')) ? uno('.tr-pregunta').textContent : null,
      grados: vis(uno('.tr-grados')) ? uno('.tr-grados').textContent : null,
      rotulos: todos('.tr-rotulo').filter(vis).map(function (t) { return { dice: t.textContent, c: medio(t) }; }),
      tp: vis(centro) ? {
        centro: circulo(centro),
        escala: escala(centro),
        base: linea(uno('.tr-base')),
        marcas: todos('.tr-marca').map(function (m) { var l = linea(m); return { g: +m.getAttribute('data-grados'), a: l[0], b: l[1] }; }),
        nums: todos('.tr-num').map(function (t) {
          return { fila: t.getAttribute('data-fila'), valor: +t.getAttribute('data-valor'), dice: t.textContent, c: medio(t),
            marcada: t.classList.contains('tr-fila'), leido: t.classList.contains('tr-leido'), mal: t.classList.contains('tr-mal'), esc: escala(t) / escala(centro) };
        }),
        anillo: vis(anillo) ? circulo(anillo) : null,
        cuenta: trazada(uno('.tr-cuenta')) ? extremos(uno('.tr-cuenta')) : null,
        pasos: todos('.tr-paso').filter(vis).map(function (p) { return { g: +p.getAttribute('data-grados'), c: circulo(p) }; }),
        lectura: vis(lectura) ? circulo(lectura) : null,
        tachado: vis(tachado) ? { valor: +tachado.getAttribute('data-valor'), l: linea(tachado) } : null
      } : null
    };
  };
  /* Área de Polígonos Regulares: la tapa de hexágono. De cada tapa se leen
     sus vértices y su orilla; de cada pedazo de adentro, sus tres puntas; del
     triángulo que se pasa, sus puntas; y de la medida que falta, sus dos
     puntas. Todo ya puesto en la vista, con el movimiento que lleve encima. */
  window.__amExtra.amTapa = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function puntos(el) { var out = []; for (var i = 0; i < el.points.length; i++) out.push(aVista(el, el.points[i].x, el.points[i].y)); return out; }
    function linea(el) { return [aVista(el, +el.getAttribute('x1'), +el.getAttribute('y1')), aVista(el, +el.getAttribute('x2'), +el.getAttribute('y2'))]; }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function medio(el) { var b = el.getBBox(); return aVista(el, b.x + b.width / 2, b.y + b.height / 2); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function tapa(t) {
      var p = raiz.querySelector('.tp-tapa[data-tapa="' + t + '"]');
      var o = raiz.querySelector('.tp-orilla[data-tapa="' + t + '"]');
      return vis(p) ? { vertices: puntos(p), orilla: trazada(o), piezas: todos('.tp-pieza[data-tapa="' + t + '"]').filter(vis).map(puntos) } : null;
    }
    var fantasma = raiz.querySelector('.tp-fantasma'), raya = raiz.querySelector('.tp-falta'), pregunta = raiz.querySelector('.tp-pregunta');
    return {
      hex: tapa('hex'),
      tri: tapa('tri'),
      medidas: todos('.tp-medida').filter(vis).map(function (t) { return { dice: t.textContent, c: medio(t) }; }),
      fantasma: vis(fantasma) ? puntos(fantasma) : null,
      falta: vis(raya) ? linea(raya) : null,
      pregunta: vis(pregunta) ? { dice: pregunta.textContent, c: medio(pregunta) } : null
    };
  };
  /* Volumen de Cuerpos: el tanque de mil litros. De cada bloque de cubitos
     que se ve se leen sus datos (dónde dice que está y cuántos cubitos mide)
     y las esquinas de sus tres caras, ya puestas en la vista con el
     movimiento que lleve encima. Del tanque, sus tres aristas medidas; y los
     rótulos que se ven, con lo que dicen y dónde. */
  window.__amExtra.amTanque = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function puntos(el) { var out = []; for (var i = 0; i < el.points.length; i++) out.push(aVista(el, el.points[i].x, el.points[i].y)); return out; }
    function medio(el) { var b = el.getBBox(); return aVista(el, b.x + b.width / 2, b.y + b.height / 2); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function dato(el, k) { return +el.getAttribute('data-' + k); }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function caras(g) {
      return { frente: puntos(g.querySelector('.tq-frente')), arriba: puntos(g.querySelector('.tq-arriba')), lado: puntos(g.querySelector('.tq-lado')) };
    }
    var muestra = raiz.querySelector('.tq-muestra');
    return {
      aristas: todos('.tq-arista').map(function (a) {
        var t = a.getTotalLength(), p = a.getPointAtLength(0), q = a.getPointAtLength(t);
        return { nombre: a.getAttribute('data-arista'), a: aVista(a, p.x, p.y), b: aVista(a, q.x, q.y), trazada: trazada(a) };
      }),
      bloques: todos('.tq-bloque').filter(vis).map(function (g) {
        var c = caras(g);
        c.x = dato(g, 'x'); c.y = dato(g, 'y'); c.z = dato(g, 'z'); c.l = dato(g, 'l'); c.h = dato(g, 'h'); c.p = dato(g, 'p');
        c.contado = g.classList.contains('tq-contado');
        return c;
      }),
      agua: todos('.tq-agua').map(function (p) { return parseFloat(getComputedStyle(p).fillOpacity); }),
      muestra: vis(muestra) ? caras(muestra) : null,
      rotulos: todos('text').filter(vis).map(function (t) {
        return { dice: t.textContent, c: medio(t), clase: t.getAttribute('class') || '', arista: t.getAttribute('data-arista'), capa: t.getAttribute('data-capa') };
      })
    };
  };
  /* Sólidos Geométricos: el molde de la caja de Kenia. De cada pieza del
     molde y de cada cara de la caja que se ve se leen sus esquinas, ya
     puestas en la vista con el movimiento que lleven encima (la tapa que se
     cambia de lugar va girada); y los rótulos que se ven. */
  window.__amExtra.amMolde = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function puntos(el) { var out = []; for (var i = 0; i < el.points.length; i++) out.push(aVista(el, el.points[i].x, el.points[i].y)); return out; }
    function medio(el) { var b = el.getBBox(); return aVista(el, b.x + b.width / 2, b.y + b.height / 2); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    return {
      piezas: todos('[data-pieza]').filter(vis).map(function (p) {
        return { nombre: p.getAttribute('data-pieza'), p: puntos(p), movida: p.classList.contains('sg-movida') };
      }),
      caras: todos('[data-cara]').filter(vis).map(function (p) {
        return { nombre: p.getAttribute('data-cara'), p: puntos(p), movida: p.classList.contains('sg-movida') };
      }),
      dice: todos('.sg-dice').filter(vis).map(function (t) { return { que: t.getAttribute('data-dice'), dice: t.textContent, c: medio(t) }; })
    };
  };
  /* Los Sustantivos: la constancia de Kenia. De cada alumno se lee dónde
     está su cabeza, qué es y cómo se llama; de cada etiqueta, dónde quedó,
     qué dice, con qué raya va y si está tenue; de cada aro, alrededor de
     quién está; y lo que dice la libreta, renglón por renglón. La raya se lee
     del estilo: lo que se dibuja con A.trazar lleva un solo guion del largo
     entero, así que una raya «entera» es la que no tiene guiones o la que
     tiene uno largo. */
  window.__amExtra.amConstancia = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(/[ ,]+/).map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    return {
      alumnos: todos('[data-alumno]').filter(vis).map(function (g) {
        var c = g.querySelector('.su-cabeza');
        return { i: +g.getAttribute('data-alumno'), es: g.getAttribute('data-es'), nombre: g.getAttribute('data-nombre') || '',
                 c: aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')) };
      }),
      renglones: todos('[data-renglon]').filter(vis).map(function (t) {
        return { r: +t.getAttribute('data-renglon'), dice: t.textContent, palabra: t.getAttribute('data-palabra') || '', caja: caja(t) };
      }),
      cajas: todos('[data-caja]').filter(function (c) { return c.classList.contains('su-caja-cualquiera') ? vis(c) : trazada(c); })
        .map(function (c) { return { de: c.getAttribute('data-caja'), caja: caja(c), raya: raya(c) }; }),
      etiquetas: todos('[data-etiqueta]').filter(vis).map(function (g) {
        var r = g.querySelector('rect');
        return { de: g.getAttribute('data-etiqueta'), dice: g.querySelector('text').textContent, caja: caja(r), raya: raya(r),
                 tenue: parseFloat(getComputedStyle(r).fillOpacity) < 0.9 };
      }),
      aros: todos('[data-anillo]').filter(function (a) { return a.classList.contains('su-anillo-k') ? trazada(a) : vis(a); })
        .map(function (a) {
          return { de: a.getAttribute('data-anillo'), c: aVista(a, +a.getAttribute('cx'), +a.getAttribute('cy')), raya: raya(a),
                   tenue: parseFloat(getComputedStyle(a).strokeOpacity) < 0.9 };
        }),
      rotulos: todos('[data-rotulo]').filter(vis).map(function (g) {
        return { de: g.getAttribute('data-rotulo'), dice: g.querySelector('text').textContent, caja: caja(g.querySelector('rect')) };
      }),
      hilos: todos('[data-conector]').filter(trazada).map(function (p) {
        var L = p.getTotalLength(), a = p.getPointAtLength(0), b = p.getPointAtLength(L);
        return { de: p.getAttribute('data-conector'), a: aVista(p, a.x, a.y), b: aVista(p, b.x, b.y) };
      }),
      sello: todos('[data-sello]').filter(vis).map(function (g) { return g.querySelector('text').textContent; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* Los Adjetivos: los sacos de doña Nely. De cada saco se lee dónde está
     su cuerpo, qué parches tiene, si lleva nudo o la boca abierta; de cada
     etiqueta, dónde quedó, qué dice, con qué raya va y si está tenue; de
     cada hilo, de dónde sale y adónde llega, y de su aro, qué rodea. Y lo que
     dice el globo, palabra por palabra, con sus subrayados. */
  window.__amExtra.amSacos = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(/[ ,]+/).map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function extremos(p) { var L = p.getTotalLength(), a = p.getPointAtLength(0), b = p.getPointAtLength(L); return { a: aVista(p, a.x, a.y), b: aVista(p, b.x, b.y) }; }
    var m = raiz.querySelector('[data-marvin]'), cabeza = m && m.querySelector('.aj-cabeza');
    return {
      sacos: todos('[data-saco]').filter(vis).map(function (g) {
        var nudo = g.querySelector('[data-nudo]');
        return { i: +g.getAttribute('data-saco'), cuerpo: caja(g.querySelector('[data-cuerpo]')), todo: caja(g),
                 parches: [].slice.call(g.querySelectorAll('[data-parche]')).filter(vis).map(caja),
                 nudo: nudo && vis(nudo) ? caja(nudo) : null, boca: !!g.querySelector('[data-boca]') };
      }),
      palabras: todos('[data-renglon]').filter(vis).map(function (t) {
        return { dice: t.textContent, palabra: t.getAttribute('data-palabra') || '', caja: caja(t) };
      }),
      rayas: todos('[data-raya]').filter(function (p) { return p.classList.contains('aj-subraya-cualquiera') ? vis(p) : trazada(p); })
        .map(function (p) { return { de: p.getAttribute('data-raya'), caja: caja(p), raya: raya(p) }; }),
      etiquetas: todos('[data-etiqueta]').filter(vis).map(function (g) {
        var r = g.querySelector('rect');
        return { de: g.getAttribute('data-etiqueta'), dice: g.querySelector('text').textContent, caja: caja(r), raya: raya(r),
                 tenue: parseFloat(getComputedStyle(r).fillOpacity) < 0.9 };
      }),
      hilos: todos('[data-hilo]').filter(trazada).map(function (p) { var e = extremos(p); return { de: p.getAttribute('data-hilo'), a: e.a, b: e.b }; }),
      aros: todos('[data-aro]').filter(trazada).map(function (c) {
        return { de: c.getAttribute('data-aro'), c: aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')), r: +c.getAttribute('r'), raya: raya(c) };
      }),
      rotulos: todos('[data-rotulo]').filter(vis).map(function (g) {
        return { de: g.getAttribute('data-rotulo'), dice: g.querySelector('text').textContent, caja: caja(g.querySelector('rect')) };
      }),
      conectores: todos('[data-conector]').filter(trazada).map(function (p) { var e = extremos(p); return { de: p.getAttribute('data-conector'), a: e.a, b: e.b }; }),
      marvin: m && vis(m) ? { c: aVista(cabeza, +cabeza.getAttribute('cx'), +cabeza.getAttribute('cy')), caja: caja(m) } : null,
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* Los Verbos: el papel de Marvin. Del papel se lee cada palabra con su
     caja y su renglón, el hueco y las rayas que subrayan, con su raya; del
     sobre, dónde quedó; de la línea del tiempo, dónde están sus puntos, su
     «ahora» y sus rótulos; y lo que se escribió arriba y abajo de cada punto,
     pieza por pieza. */
  window.__amExtra.amPapel = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(/[ ,]+/).map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function extremos(p) { var L = p.getTotalLength(), a = p.getPointAtLength(0), b = p.getPointAtLength(L); return { a: aVista(p, a.x, a.y), b: aVista(p, b.x, b.y) }; }
    function medio(c) { return [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2]; }
    function pieza(t) { return t && vis(t) ? { dice: t.textContent, caja: caja(t) } : null; }
    function subraya(p) { return p && vis(p) ? { caja: caja(p), raya: raya(p) } : null; }
    var hueco = raiz.querySelector('[data-hueco]'), eje = extremos(raiz.querySelector('[data-eje]'));
    return {
      palabras: todos('[data-renglon]').filter(vis).map(function (t) {
        return { r: +t.getAttribute('data-renglon'), pieza: t.getAttribute('data-pieza') || '', dice: t.textContent, caja: caja(t) };
      }),
      hueco: hueco && vis(hueco) ? { caja: caja(hueco), raya: raya(hueco) } : null,
      rayas: todos('[data-raya]').filter(vis).map(function (p) { return { de: p.getAttribute('data-raya'), caja: caja(p), raya: raya(p) }; }),
      sobre: caja(raiz.querySelector('[data-sobre-cuerpo]')),
      caidas: todos('[data-caida]').filter(vis).map(function (p) { var e = extremos(p); return { de: p.getAttribute('data-caida'), a: e.a, b: e.b }; }),
      abanico: todos('[data-abanico]').filter(vis).map(function (p) { var e = extremos(p); return { de: p.getAttribute('data-abanico'), a: e.a, b: e.b }; }),
      preguntas: todos('[data-pregunta]').filter(vis).map(function (t) { return { dice: t.textContent, c: medio(caja(t)) }; }),
      eje: { x0: Math.min(eje.a[0], eje.b[0]), x1: Math.max(eje.a[0], eje.b[0]), y: eje.a[1] },
      ahora: extremos(raiz.querySelector('[data-ahora]')).a[0],
      puntos: todos('[data-punto]').map(function (c) { return aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')); }),
      zonas: todos('[data-zona]').filter(vis).map(function (t) { return { dice: t.textContent, c: medio(caja(t)) }; }),
      formas: todos('[data-forma]').filter(vis).map(function (g) {
        return { raiz: pieza(g.querySelector('[data-parte="raiz"]')), fin: pieza(g.querySelector('[data-parte="fin"]')),
                 rayaFin: subraya(g.querySelector('[data-raya-forma="fin"]')), rayaRaiz: subraya(g.querySelector('[data-raya-forma="raiz"]')) };
      }),
      noticias: todos('[data-noticia]').filter(vis).map(function (t) { return { dice: t.textContent, c: medio(caja(t)) }; }),
      rotulos: todos('[data-rotulo]').filter(vis).map(function (g) {
        var r = g.querySelector('rect');
        return { de: g.getAttribute('data-rotulo'), dice: g.querySelector('text').textContent, caja: caja(r), raya: raya(r) };
      }),
      conectores: todos('[data-conector]').filter(trazada).map(function (p) { var e = extremos(p); return { de: p.getAttribute('data-conector'), a: e.a, b: e.b }; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* Los Adverbios: el recado de Kenia, lo que copiaron en la libreta y el
     plato. Todo en las coordenadas del dibujo, con cada pieza donde quedó. */
  window.__amExtra.amRecado = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(/[ ,]+/).map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function extremos(p) { var L = p.getTotalLength(), a = p.getPointAtLength(0), b = p.getPointAtLength(L); return { a: aVista(p, a.x, a.y), b: aVista(p, b.x, b.y) }; }
    function redondo(c) { var k = caja(c); return { c: [(k.x0 + k.x1) / 2, (k.y0 + k.y1) / 2], r: (k.x1 - k.x0) / 2 }; }
    /* La TINTA de una palabra, no su renglón: getBBox da el alto de la
       letra entera (con el aire de encima de las mayúsculas) y un marco
       ceñido a lo que se ve saldría «fuera» sin estarlo. La mide el lienzo
       con la misma letra. */
    var lienzo = document.createElement('canvas').getContext('2d');
    function tinta(t) {
      var cs = getComputedStyle(t);
      lienzo.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      var m = lienzo.measureText(t.textContent), x0 = +t.getAttribute('x'), y0 = +t.getAttribute('y');
      var a = aVista(t, x0 - m.actualBoundingBoxLeft, y0 - m.actualBoundingBoxAscent), b = aVista(t, x0 + m.actualBoundingBoxRight, y0 + m.actualBoundingBoxDescent);
      return { x0: Math.min(a[0], b[0]), y0: Math.min(a[1], b[1]), x1: Math.max(a[0], b[0]), y1: Math.max(a[1], b[1]) };
    }
    var hueco = raiz.querySelector('[data-hueco]'), anillo = raiz.querySelector('[data-anillo]'), rb = raiz.querySelector('[data-rotulo-bocado]');
    return {
      libreta: caja(raiz.querySelector('[data-libreta]')),
      recado: caja(raiz.querySelector('[data-recado]')),
      rotulosPapel: todos('[data-rotulo-papel]').filter(vis).map(function (t) { return { de: t.getAttribute('data-rotulo-papel'), dice: t.textContent, caja: caja(t) }; }),
      palabras: todos('[data-texto]').filter(vis).map(function (t) {
        return { renglon: t.closest('[data-palabra]').getAttribute('data-renglon'), dice: t.textContent, caja: caja(t), tinta: tinta(t) };
      }),
      marcos: todos('[data-marco]').filter(vis).map(function (m) {
        return { de: m.getAttribute('data-marco'), renglon: m.closest('[data-palabra]').getAttribute('data-renglon'), caja: caja(m), raya: raya(m) };
      }),
      hueco: hueco && vis(hueco) ? { caja: caja(hueco), raya: raya(hueco) } : null,
      subraya: todos('[data-subraya]').filter(vis).map(function (p) { return { de: p.getAttribute('data-subraya'), caja: caja(p), raya: raya(p) }; }),
      tiras: todos('[data-tira]').filter(vis).map(function (b) { return { de: b.getAttribute('data-tira'), caja: caja(b), raya: raya(b) }; }),
      preguntas: todos('[data-pregunta]').filter(vis).map(function (t) { return { de: t.getAttribute('data-pregunta'), dice: t.textContent, caja: caja(t) }; }),
      marcas: todos('[data-marca]').filter(vis).map(function (g) { return { de: g.getAttribute('data-marca'), caja: caja(g.querySelector('circle')) }; }),
      plato: redondo(raiz.querySelector('[data-plato]')),
      tortilla: redondo(raiz.querySelector('[data-tortilla-disco]')),
      mordidas: todos('[data-bocado] circle').filter(vis).map(redondo),
      anillo: anillo && vis(anillo) ? redondo(anillo) : null,
      rotBocado: rb && vis(rb) ? { dice: rb.textContent, caja: caja(rb) } : null,
      rotulos: todos('[data-rotulo]').filter(vis).map(function (g) { return { de: g.getAttribute('data-rotulo'), dice: g.querySelector('text').textContent, caja: caja(g.querySelector('rect')) }; }),
      conectores: todos('[data-conector]').filter(trazada).map(function (p) { var e = extremos(p); return { de: p.getAttribute('data-conector'), palabra: p.getAttribute('data-de') || '', a: e.a, b: e.b }; }),
      llave: todos('[data-llave]').filter(trazada).map(extremos),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* Los Pronombres: el mensaje del grupo de las familias. Se lee el globo
     (de uno o de dos renglones); cada palabra con su renglón, su caja, su
     tinta y dónde está su renglón; los subrayados, con qué raya; las
     píldoras de pregunta y de respuesta con su palito; los hilos de «le» y
     de «lo», de dónde salen y adónde llegan; los niños con su nombre; los
     aros, las cosas y las dudas donde quedaron; y la raya de los
     pronombres. */
  window.__amExtra.amMensaje = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(/[ ,]+/).map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function extremos(p) { var L = p.getTotalLength(), a = p.getPointAtLength(0), b = p.getPointAtLength(L); return { a: aVista(p, a.x, a.y), b: aVista(p, b.x, b.y) }; }
    var lienzo = document.createElement('canvas').getContext('2d');
    function tinta(t) {
      var cs = getComputedStyle(t);
      lienzo.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      /* Los nombres de los niños van centrados: el lienzo tiene que medir
         desde el mismo sitio que la letra, o la tinta sale corrida. */
      lienzo.textAlign = cs.textAnchor === 'middle' ? 'center' : (cs.textAnchor === 'end' ? 'right' : 'left');
      var m = lienzo.measureText(t.textContent), x0 = +t.getAttribute('x'), y0 = +t.getAttribute('y');
      var a = aVista(t, x0 - m.actualBoundingBoxLeft, y0 - m.actualBoundingBoxAscent), b = aVista(t, x0 + m.actualBoundingBoxRight, y0 + m.actualBoundingBoxDescent);
      return { x0: Math.min(a[0], b[0]), y0: Math.min(a[1], b[1]), x1: Math.max(a[0], b[0]), y1: Math.max(a[1], b[1]) };
    }
    function pildora(g) {
      var r = g.querySelector('rect');
      return { de: g.getAttribute('data-pregunta') || g.getAttribute('data-respuesta') || g.getAttribute('data-rotulo'),
               dice: g.querySelector('text').textContent, caja: caja(r), raya: raya(r),
               palito: g.querySelector('path') ? extremos(g.querySelector('path')) : null };
    }
    var marco = raiz.querySelector('[data-nombre-marco]');
    return {
      globos: todos('[data-globo]').filter(vis).map(function (g) { return { de: +g.getAttribute('data-globo'), caja: caja(g) }; }),
      palabras: todos('[data-palabra]').filter(vis).map(function (t) {
        return { renglon: t.getAttribute('data-renglon'), dice: t.textContent, caja: caja(t), tinta: tinta(t),
                 base: aVista(t, +t.getAttribute('x'), +t.getAttribute('y')) };
      }),
      huecos: todos('[data-hueco]').filter(vis).map(function (p) { return { de: p.getAttribute('data-hueco'), caja: caja(p), raya: raya(p) }; }),
      subrayas: todos('[data-subraya]').filter(vis).map(function (p) { return { de: p.getAttribute('data-subraya'), caja: caja(p), raya: raya(p) }; }),
      subCtx: todos('[data-subraya-ctx]').filter(vis).map(function (p) { return { de: p.getAttribute('data-subraya-ctx'), caja: caja(p), raya: raya(p) }; }),
      arcos: todos('[data-arco]').filter(trazada).map(function (p) { var e = extremos(p); return { de: p.getAttribute('data-arco'), a: e.a, b: e.b }; }),
      preguntas: todos('[data-pregunta]').filter(vis).map(pildora),
      respuestas: todos('[data-respuesta]').filter(vis).map(pildora),
      hilos: todos('[data-hilo]').filter(vis).map(function (p) {
        var e = extremos(p);
        return { de: p.getAttribute('data-hilo'), a: p.getAttribute('data-a'), ini: e.a, fin: e.b, raya: raya(p) };
      }),
      alumnos: todos('[data-alumno]').filter(vis).map(function (g) {
        var c = g.querySelector('.pn-cabeza'), nom = g.querySelector('[data-nombre-de]');
        var pies = Math.max.apply(null, [].map.call(g.querySelectorAll('.pn-zapato'), function (z) { return caja(z).y1; }));
        return { i: +g.getAttribute('data-alumno'), es: g.getAttribute('data-es'), nombre: g.getAttribute('data-nombre'),
                 c: aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')), r: +c.getAttribute('r'), pies: pies,
                 rotulo: nom && vis(nom) ? { dice: nom.textContent, caja: caja(nom), tinta: tinta(nom) } : null };
      }),
      anillos: todos('[data-anillo], [data-anillo-uno]').filter(vis).map(function (a) {
        return { uno: a.hasAttribute('data-anillo-uno'), c: aVista(a, +a.getAttribute('cx'), +a.getAttribute('cy')), r: +a.getAttribute('r'), raya: raya(a) };
      }),
      cosas: todos('[data-cosa]').filter(vis).map(function (g) { return { de: g.getAttribute('data-cosa'), caja: caja(g.firstElementChild) }; }),
      rotCosas: todos('[data-rotulo-cosa]').filter(vis).map(function (t) { return { de: t.getAttribute('data-rotulo-cosa'), dice: t.textContent, caja: caja(t) }; }),
      dudas: todos('[data-duda]').filter(vis).map(function (g) {
        var c = g.querySelector('circle');
        return { c: aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')), r: +c.getAttribute('r'), dice: g.querySelector('text').textContent, raya: raya(c) };
      }),
      marcoNombre: marco && vis(marco) ? { caja: caja(marco), raya: raya(marco) } : null,
      conectores: todos('[data-conector]').filter(trazada).map(function (p) { var e = extremos(p); return { de: p.getAttribute('data-de'), a: e.a, b: e.b }; }),
      llave: todos('[data-llave]').filter(trazada).map(function (p) { var e = extremos(p); return { de: p.getAttribute('data-llave'), a: e.a, b: e.b }; }),
      rotulos: todos('[data-rotulo]').filter(vis).map(pildora),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* La Acentuación: la rayita de doña Nely. Se lee el mensaje del globo,
     su subrayado y la raya que baja de él; las sílabas de cada lectura, cuál
     subió y dónde está el dibujo de la voz; la palabra escrita, con el sitio
     exacto de su rayita medido con la misma letra; los hilos del paso 4; el
     marco; las flechas del camino con sus minutos; y dónde está doña Nely. */
  window.__amExtra.amRayita = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function trazada(p) { return !!p && vis(p) && Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) < 1; }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(/[ ,]+/).map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function extremos(p) { var L = p.getTotalLength(), a = p.getPointAtLength(0), b = p.getPointAtLength(L); return { a: aVista(p, a.x, a.y), b: aVista(p, b.x, b.y) }; }
    var lienzo = document.createElement('canvas').getContext('2d');
    /* Dónde está cada letra de un texto, con la misma letra y desde el mismo
       sitio que la pinta el navegador. */
    function letras(t) {
      var cs = getComputedStyle(t), s = t.textContent;
      lienzo.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      lienzo.textAlign = 'left';
      var total = lienzo.measureText(s).width, x0 = +t.getAttribute('x'), y0 = +t.getAttribute('y');
      if (cs.textAnchor === 'middle') x0 -= total / 2; else if (cs.textAnchor === 'end') x0 -= total;
      return s.split('').map(function (ch, i) {
        var a = lienzo.measureText(s.slice(0, i)).width, m = lienzo.measureText(ch);
        var p = aVista(t, x0 + a, y0 - m.actualBoundingBoxAscent), q = aVista(t, x0 + a + m.width, y0);
        return { ch: ch, x0: p[0], x1: q[0], y0: p[1], y1: q[1] };
      });
    }
    function fichas(g) {
      return [].slice.call(g.querySelectorAll('[data-silaba]')).map(function (f) {
        return { s: f.getAttribute('data-silaba'), carga: f.getAttribute('data-carga') === 'si', caja: caja(f.querySelector('rect')),
                 dice: f.querySelector('text').textContent, raya: raya(f.querySelector('rect')) };
      });
    }
    var neut = raiz.querySelector('[data-neutras]'), marco = raiz.querySelector('[data-marco]'), nely = raiz.querySelector('[data-nely] .ra-cara');
    var enl = raiz.querySelector('[data-enlace]');
    return {
      globo: caja(raiz.querySelector('[data-globo]')),
      mensaje: todos('[data-mensaje]').filter(vis).map(function (t) {
        return { renglon: +t.getAttribute('data-mensaje'), dice: t.textContent, caja: caja(t), base: aVista(t, +t.getAttribute('x'), +t.getAttribute('y')) };
      }),
      subs: todos('[data-sub]').filter(vis).map(function (p) { return { de: p.getAttribute('data-sub'), caja: caja(p), raya: raya(p) }; }),
      enlace: enl && trazada(enl) ? extremos(enl) : null,
      neutras: neut && vis(neut) ? { fichas: fichas(neut), dudas: [].slice.call(neut.querySelectorAll('[data-duda]')).map(function (t) { return { s: t.getAttribute('data-duda'), caja: caja(t), dice: t.textContent }; }) } : null,
      lecturas: todos('[data-lectura]').filter(vis).map(function (g) {
        var w = g.querySelector('[data-escrita]'), v = g.querySelector('[data-voz]');
        return { de: g.getAttribute('data-lectura'), fichas: fichas(g), voz: caja(v), escrita: w.textContent, caja: caja(w), letras: letras(w),
                 dice: g.querySelector('[data-dice]').textContent, quien: g.querySelector('[data-quien]').textContent };
      }),
      /* El hilo del paso 4 va de la sílaba a la rayita («M x y L x y») y
         después dibuja la punta: lo que cuenta es dónde acaba ese primer
         tramo, no dónde acaba la punta. */
      hilos: todos('[data-hilo]').filter(vis).map(function (p) {
        var tk = p.getAttribute('d').split(' ');
        return { de: p.getAttribute('data-hilo'), a: aVista(p, +tk[1], +tk[2]), b: aVista(p, +tk[4], +tk[5]) };
      }),
      marco: marco && vis(marco) ? { de: marco.getAttribute('data-marco'), caja: caja(marco), raya: raya(marco) } : null,
      flechas: todos('[data-flecha]').filter(vis).map(function (g) {
        var p = g.querySelector('path'), t = g.querySelector('text');
        /* El trazo va de un extremo al otro («M x y H x») y después dibuja
           la punta: la punta está donde acaba ese primer tramo. Se parte a
           mano y no con una expresión regular, porque este lector vive en
           una plantilla de texto y ahí las barras se pierden. */
        var tk = p.getAttribute('d').split(' ');
        return { de: g.getAttribute('data-flecha'), desde: aVista(p, +tk[1], +tk[2])[0], hasta: aVista(p, +tk[4], +tk[2])[0],
                 minutos: +t.getAttribute('data-minutos'), dice: t.textContent };
      }),
      nely: nely && vis(nely) ? aVista(nely, +nely.getAttribute('cx'), +nely.getAttribute('cy')) : null,
      lugares: todos('[data-lugar]').filter(vis).map(function (t) { return { de: t.getAttribute('data-lugar'), caja: caja(t) }; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* Marcadores Textuales: la pizarra del maestro. Se lee cada pedazo de
     tiza con lo que es (del maestro, nuevo, coma o punto), su renglón, su
     avance y su tinta; las marcas de las comas, los subrayados y los aros;
     y cada trabajo de abajo: sus tres cosas en el orden en que se ven, qué
     cae dentro de la banda de las parejas y sus banderitas. */
  window.__amExtra.amPizarra = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(/[ ,]+/).map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    var lienzo = document.createElement('canvas').getContext('2d');
    /* La tinta de un texto y su avance, con la misma letra con que lo pinta
       el navegador: la caja del renglón (getBBox) lleva el aire de encima de
       las mayúsculas y acusaría a un aro bien puesto. */
    function medir(t) {
      var cs = getComputedStyle(t), s = t.textContent;
      lienzo.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      lienzo.textAlign = 'left';
      var m = lienzo.measureText(s), x0 = +t.getAttribute('x'), y0 = +t.getAttribute('y');
      var p = aVista(t, x0 - m.actualBoundingBoxLeft, y0 - m.actualBoundingBoxAscent), q = aVista(t, x0 + m.actualBoundingBoxRight, y0 + m.actualBoundingBoxDescent);
      var a = aVista(t, x0, y0), b = aVista(t, x0 + m.width, y0);
      return { tinta: { x0: p[0], y0: p[1], x1: q[0], y1: q[1] }, x0: a[0], x1: b[0], base: a[1] };
    }
    var ley = raiz.querySelector('[data-leyenda]');
    return {
      fondo: caja(raiz.querySelector('[data-pizarra-fondo]')),
      tiza: todos('[data-pizarra]').filter(vis).map(function (t) {
        var m = medir(t);
        return { rol: t.getAttribute('data-pizarra'), renglon: +t.getAttribute('data-renglon'), dice: t.textContent, x0: m.x0, x1: m.x1, base: m.base, tinta: m.tinta };
      }),
      marcas: todos('[data-marca-coma]').filter(vis).map(function (p) { return { de: p.getAttribute('data-marca-coma'), caja: caja(p), raya: raya(p) }; }),
      rayas: todos('[data-raya]').filter(vis).map(function (p) { return { de: p.getAttribute('data-raya'), caja: caja(p), raya: raya(p) }; }),
      aros: todos('[data-aro-marcador]').filter(vis).map(function (p) { return { de: p.getAttribute('data-aro-marcador'), caja: caja(p), raya: raya(p) }; }),
      leyenda: ley && vis(ley) ? { dice: ley.querySelector('[data-leyenda-dice]').textContent, caja: caja(ley), aro: raya(ley.querySelector('[data-leyenda-aro]')) } : null,
      trabajos: todos('[data-trabajo]').filter(vis).map(function (g) {
        return {
          de: g.getAttribute('data-trabajo'),
          papel: caja(g.querySelector('[data-papel]')),
          acciones: [].slice.call(g.querySelectorAll('[data-accion]')).filter(vis).map(function (t) { return { dice: t.textContent, caja: medir(t).tinta }; }),
          bandas: [].slice.call(g.querySelectorAll('[data-banda]')).filter(vis).map(function (b) { return { caja: caja(b), raya: raya(b) }; }),
          banderas: [].slice.call(g.querySelectorAll('[data-bandera]')).filter(vis).map(function (t) { return { dice: t.textContent, caja: medir(t).tinta }; })
        };
      }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* Los Tipos de Textos: la carta de Kenia. Se lee cada pedazo de la carta
     con su tinta y su línea base; quién la lee (el director o la prima) y
     lo que dice su globo; cada pregunta del lector, con raya cortada o
     entera y su ✓; los hilos de punta a punta, las llaves, los aros y la
     leyenda; y la cancha: el candado, el ancho de la puerta y dónde están
     las niñas. ⚠️ Aquí no van barras invertidas: esto vive dentro de una
     plantilla de texto y se pierden. */
  window.__amExtra.amCarta = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(',').join(' ').split(' ').map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    var lienzo = document.createElement('canvas').getContext('2d');
    /* La tinta y el avance de un texto, con la misma letra y el mismo
       ancla con que lo pinta el navegador. */
    function medir(t) {
      var cs = getComputedStyle(t), s = t.textContent, ancla = t.getAttribute('text-anchor') || 'start';
      lienzo.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      lienzo.textAlign = ancla === 'end' ? 'right' : (ancla === 'middle' ? 'center' : 'left');
      var m = lienzo.measureText(s), x0 = +t.getAttribute('x'), y0 = +t.getAttribute('y');
      var ini = ancla === 'end' ? x0 - m.width : (ancla === 'middle' ? x0 - m.width / 2 : x0);
      var p = aVista(t, x0 - m.actualBoundingBoxLeft, y0 - m.actualBoundingBoxAscent), q = aVista(t, x0 + m.actualBoundingBoxRight, y0 + m.actualBoundingBoxDescent);
      var a = aVista(t, ini, y0), b = aVista(t, ini + m.width, y0);
      return { tinta: { x0: p[0], y0: p[1], x1: q[0], y1: q[1] }, x0: a[0], x1: b[0], base: a[1] };
    }
    function punta(p, largo) { var q = p.getPointAtLength(largo); return aVista(p, q.x, q.y); }
    var ley = raiz.querySelector('[data-leyenda]'), candado = raiz.querySelector('[data-candado]');
    return {
      papel: caja(raiz.querySelector('[data-papel]')),
      lineas: todos('[data-linea]').filter(vis).map(function (t) {
        var m = medir(t);
        return { rol: t.getAttribute('data-linea'), dice: t.textContent, x0: m.x0, x1: m.x1, base: m.base, tinta: m.tinta,
          ancla: t.getAttribute('text-anchor') || 'start' };
      }),
      lectores: todos('[data-lector]').filter(vis).map(function (g) { return { de: g.getAttribute('data-lector'), caja: caja(g) }; }),
      dice: todos('[data-dice]').filter(vis).map(function (g) {
        return { de: g.getAttribute('data-dice'), globo: caja(g.querySelector('[data-globo]')),
          texto: [].slice.call(g.querySelectorAll('text')).map(function (t) { return t.textContent; }).join(' ') };
      }),
      preguntas: todos('[data-pregunta]').filter(vis).map(function (g) {
        var ab = g.querySelector('[data-abierta]'), he = g.querySelector('[data-hecha]');
        return { dice: g.getAttribute('data-pregunta'), de: g.getAttribute('data-de'),
          abierta: vis(ab), hecha: vis(he), visto: vis(g.querySelector('[data-visto]')),
          rayaAbierta: raya(ab), rayaHecha: raya(he), caja: caja(vis(he) ? he : ab) };
      }),
      hilos: todos('[data-hilo]').filter(vis).map(function (p) {
        var largo = p.getTotalLength();
        return { de: p.getAttribute('data-hilo'), ini: punta(p, 0), fin: punta(p, largo),
          corrido: Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0) };
      }),
      llaves: todos('[data-llave]').filter(vis).map(function (p) { return { de: p.getAttribute('data-llave'), caja: caja(p) }; }),
      aros: todos('[data-aro]').filter(vis).map(function (p) { return { de: p.getAttribute('data-aro'), caja: caja(p), raya: raya(p) }; }),
      leyenda: ley && vis(ley) ? { dice: ley.querySelector('[data-leyenda-dice]').textContent, caja: caja(ley), aro: raya(ley.querySelector('[data-leyenda-aro]')) } : null,
      cancha: {
        cerca: caja(raiz.querySelector('[data-cerca]')),
        piso: caja(raiz.querySelector('[data-cancha]')),
        puerta: caja(raiz.querySelector('[data-puerta-marco]')),
        candado: !!candado && vis(candado),
        grilletes: todos('[data-grillete]').filter(vis).map(function (p) { return p.getAttribute('data-grillete'); }),
        ninas: todos('[data-nina]').filter(vis).map(function (g) { return caja(g); })
      },
      barrido: vis(raiz.querySelector('[data-barrido]')),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* Geografía y Coordenadas: la aldea y el mapa. De la aldea, cada casa
     con el centro de sus paredes, cada copa de mango, el puente, el río
     (unos cuantos puntos, para ver que pasa por debajo del puente), las
     marcas con su tipo y sus rayas, la ambulancia, las dos líneas de la
     casa de doña Nely y su aro. Del mapa, el marco, la malla, las dos
     líneas de referencia (con cuánto les falta por trazarse), la punta de
     la chincheta y si cae en tierra, cada flecha de punta a punta con su
     raya, los números y las letras con su tinta, las dos líneas enteras,
     el aro y la lectura. ⚠️ Aquí no van barras invertidas: esto vive
     dentro de una plantilla de texto y se pierden. */
  window.__amExtra.amCruce = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function centro(el) { var c = caja(el); return [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2]; }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(',').join(' ').split(' ').map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function corrido(el) { return Math.abs(parseFloat(getComputedStyle(el).strokeDashoffset) || 0); }
    function punta(p, largo) { var q = p.getPointAtLength(largo); return aVista(p, q.x, q.y); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    var lienzo = document.createElement('canvas').getContext('2d');
    function tinta(t) {
      var cs = getComputedStyle(t), s = t.textContent, ancla = t.getAttribute('text-anchor') || cs.textAnchor || 'start';
      lienzo.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      lienzo.textAlign = ancla === 'end' ? 'right' : (ancla === 'middle' ? 'center' : 'left');
      var m = lienzo.measureText(s), x0 = +t.getAttribute('x'), y0 = +t.getAttribute('y');
      var p = aVista(t, x0 - m.actualBoundingBoxLeft, y0 - m.actualBoundingBoxAscent), q = aVista(t, x0 + m.actualBoundingBoxRight, y0 + m.actualBoundingBoxDescent);
      return { x0: p[0], y0: p[1], x1: q[0], y1: q[1], base: aVista(t, x0, y0)[1] };
    }
    function vertices(p) {
      var t = p.getAttribute('d').split(' ').filter(function (v) { return v.length; }), out = [], cx = 0, cy = 0;
      for (var i = 0; i < t.length; i++) {
        if (t[i] === 'M' || t[i] === 'L') { cx = +t[i + 1]; cy = +t[i + 2]; out.push(aVista(p, cx, cy)); i += 2; }
        else if (t[i] === 'H') { cx = +t[i + 1]; out.push(aVista(p, cx, cy)); i += 1; }
        else if (t[i] === 'V') { cy = +t[i + 1]; out.push(aVista(p, cx, cy)); i += 1; }
      }
      return out;
    }
    var aldea = raiz.querySelector('[data-aldea]'), mundo = raiz.querySelector('[data-mundo]');
    var rio = raiz.querySelector('[data-rio]'), largoRio = rio.getTotalLength(), puntosRio = [];
    for (var k = 0; k <= 60; k++) puntosRio.push(punta(rio, largoRio * k / 60));
    var ambu = raiz.querySelector('[data-ambulancia]');
    var pin = raiz.querySelector('[data-pin] g');
    var puntaPin = aVista(pin, 0, 0);
    var enTierra = todos('[data-tierra]').some(function (p) { var q = svg.createSVGPoint(); q.x = puntaPin[0]; q.y = puntaPin[1]; return p.isPointInFill(q); });
    var enAgua = todos('[data-agua]').some(function (p) { var q = svg.createSVGPoint(); q.x = puntaPin[0]; q.y = puntaPin[1]; return p.isPointInFill(q); });
    var mapa = raiz.querySelector('[data-mapa]');
    return {
      aldea: vis(aldea),
      mundo: vis(mundo),
      puente: centro(raiz.querySelector('[data-tablero]')),
      rio: puntosRio,
      casas: todos('[data-casa]').map(function (g) {
        var c = caja(g.querySelector('[data-cuerpo]'));
        return { n: +g.getAttribute('data-casa'), nely: g.hasAttribute('data-nely'), c: [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2], cuerpo: c, caja: caja(g) };
      }),
      matas: todos('[data-copa]').map(function (c) { return centro(c); }),
      marcas: todos('[data-marca]').filter(vis).map(function (g) {
        var aro = g.querySelector('[data-marca-aro]'), tr = g.querySelector('[data-marca-trazo]');
        return { tipo: g.getAttribute('data-marca'), c: centro(aro), raya: raya(aro), rayas: tr ? (tr.getAttribute('d').match(/M/g) || []).length : 0 };
      }),
      ambulancia: { c: aVista(ambu, 0, 0), ve: vis(ambu) },
      lineasCasa: todos('[data-linea-casa]').filter(vis).map(function (p) {
        return { de: p.getAttribute('data-linea-casa'), v: vertices(p), corrido: corrido(p) };
      }),
      rotulosCasa: todos('[data-rotulo-casa]').filter(vis).map(function (t) { return { de: t.getAttribute('data-rotulo-casa'), dice: t.textContent, tinta: tinta(t) }; }),
      aroCasa: (function (c) { return vis(c) ? { c: aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')), r: +c.getAttribute('r') } : null; })(raiz.querySelector('[data-aro-casa]')),
      mapa: caja(mapa),
      mallaLat: todos('[data-malla-lat]').map(function (p) { var v = vertices(p); return { lat: +p.getAttribute('data-malla-lat'), y: v[0][1] }; }),
      mallaLon: todos('[data-malla-lon]').map(function (p) { var v = vertices(p); return { lon: +p.getAttribute('data-malla-lon'), x: v[0][0] }; }),
      refs: todos('[data-ref]').map(function (p) { return { de: p.getAttribute('data-ref'), v: vertices(p), corrido: corrido(p) }; }),
      refRotulos: todos('[data-ref-rotulo]').filter(vis).map(function (t) { return { de: t.getAttribute('data-ref-rotulo'), dice: t.textContent }; }),
      pin: { ve: vis(pin), punta: puntaPin, tierra: enTierra, agua: enAgua },
      flechas: todos('[data-flecha]').filter(vis).map(function (g) {
        var r = g.querySelector('[data-raya]'), largo = r.getTotalLength(), pv = vertices(g.querySelector('[data-punta]'));
        return { de: g.getAttribute('data-flecha'), ini: punta(r, 0), fin: punta(r, largo), raya: raya(r), largo: largo, corrido: corrido(r), punta: pv[1] };
      }),
      numeros: todos('[data-num]').filter(vis).map(function (t) { return { de: t.getAttribute('data-num'), dice: t.textContent, tinta: tinta(t) }; }),
      letras: todos('[data-letra]').filter(vis).map(function (t) { return { de: t.getAttribute('data-letra'), dice: t.textContent, tinta: tinta(t) }; }),
      enteras: todos('[data-entera]').filter(vis).map(function (p) { return { de: p.getAttribute('data-entera'), v: vertices(p), corrido: corrido(p) }; }),
      aro: (function (c) { return vis(c) ? { c: aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')), r: +c.getAttribute('r') } : null; })(raiz.querySelector('[data-aro]')),
      lectura: (function (t) { return vis(t) ? t.textContent : null; })(raiz.querySelector('[data-lectura]')),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* Los Continentes: la casa de doña Nely, tres flechas y la noche. La
     proyección (Equal Earth) la hace la sonda por su cuenta: el meridiano
     del centro lo declara el mapa, y la escala y el centro salen del borde
     del dibujo. Con eso se buscan en el dibujo los puntos de los contornos,
     y se proyectan ciudades de verdad y puntos de prueba para preguntarle al
     navegador dónde caen (isPointInFill): en qué continente iluminado, en
     tierra o en el mar, de día o de noche. ⚠️ Aquí no van barras
     invertidas: esto vive dentro de una plantilla de texto y se pierden. */
  window.__amExtra.amLejos = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(',').join(' ').split(' ').map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function corrido(el) { return Math.abs(parseFloat(getComputedStyle(el).strokeDashoffset) || 0); }
    var lienzo = document.createElement('canvas').getContext('2d');
    function tinta(t) {
      var cs = getComputedStyle(t), s = t.textContent, ancla = t.getAttribute('text-anchor') || cs.textAnchor || 'start';
      lienzo.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      lienzo.textAlign = ancla === 'end' ? 'right' : (ancla === 'middle' ? 'center' : 'left');
      var m = lienzo.measureText(s), x0 = +t.getAttribute('x'), y0 = +t.getAttribute('y');
      var p = aVista(t, x0 - m.actualBoundingBoxLeft, y0 - m.actualBoundingBoxAscent), q = aVista(t, x0 + m.actualBoundingBoxRight, y0 + m.actualBoundingBoxDescent);
      return { x0: p[0], y0: p[1], x1: q[0], y1: q[1] };
    }
    function vertices(p) {
      var t = p.getAttribute('d').split(' ').filter(function (v) { return v.length; }), out = [];
      for (var i = 0; i < t.length; i++) if (t[i] === 'M' || t[i] === 'L') { out.push(aVista(p, +t[i + 1], +t[i + 2])); i += 2; }
      return out;
    }
    function dentro(paths, p) {
      var q = svg.createSVGPoint(); q.x = p[0]; q.y = p[1];
      return paths.some(function (el) { return el.isPointInFill(q); });
    }

    /* ── Equal Earth, de la sonda (Šavrič, Patterson y Jenny, 2018) ── */
    var A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, R3 = Math.sqrt(3);
    var mundo = raiz.querySelector('[data-mundo]'), mar = raiz.querySelector('[data-mar]');
    var L0 = +mundo.getAttribute('data-l0'), bb = mar.getBBox();
    var XMAX = 2 * R3 * Math.PI / (3 * A1);
    var YMAX = (function () { var t = Math.PI / 3, t2 = t * t, t6 = t2 * t2 * t2; return t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2)); })();
    var S = bb.width / (2 * XMAX), CX = bb.x + bb.width / 2, CY = bb.y + bb.height / 2;
    function ee(lon, lat) {
      var d = lon - L0;
      while (d > 180) d -= 360;
      while (d <= -180) d += 360;
      var l = d * Math.PI / 180, f = lat * Math.PI / 180, t = Math.asin(R3 / 2 * Math.sin(f)), t2 = t * t, t6 = t2 * t2 * t2;
      var X = 2 * R3 * l * Math.cos(t) / (3 * (9 * A4 * t6 * t2 + 7 * A3 * t6 + 3 * A2 * t2 + A1));
      var Y = t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2));
      return [CX + S * X, CY - S * Y];
    }

    /* Cada punto de los contornos, en el dibujo donde lo pone Equal Earth. */
    var tierras = todos('[data-tierra]'), C = window.CONTORNOS_MUNDO, faltan = 0, total = 0, peor = 0;
    C.tierra.forEach(function (c, i) {
      var v = tierras[i] ? vertices(tierras[i]) : [];
      for (var j = 0; j < c.length; j += 2) {
        if (c[j + 1] <= -89.9) continue;
        total++;
        var p = ee(c[j], c[j + 1]), mejor = 1e9;
        for (var k = 0; k < v.length; k++) { var dd = Math.hypot(v[k][0] - p[0], v[k][1] - p[1]); if (dd < mejor) mejor = dd; }
        if (mejor > 0.06) faltan++;
        if (mejor > peor) peor = mejor;
      }
    });

    var luz = {};
    todos('[data-luz]').forEach(function (g) { luz[g.getAttribute('data-luz')] = { g: g, p: [].slice.call(g.querySelectorAll('path')) }; });
    var ks = ['america', 'oceania', 'antartida'];
    function enLuces(p) { var o = {}; ks.forEach(function (k) { o[k] = !!luz[k] && dentro(luz[k].p, p); }); return o; }
    /* Un lugar de la costa (Sídney) cae justo sobre el contorno, y en el
       borde isPointInFill contesta que no: se mira también un punto
       alrededor. */
    function enLucesCosta(p) {
      var o = {};
      ks.forEach(function (k) {
        o[k] = !!luz[k] && [[0, 0], [0.9, 0], [-0.9, 0], [0, 0.9], [0, -0.9]].some(function (d) { return dentro(luz[k].p, [p[0] + d[0], p[1] + d[1]]); });
      });
      return o;
    }
    var nocheG = raiz.querySelector('[data-noche]'), nocheP = nocheG ? [].slice.call(nocheG.querySelectorAll('path')) : [];

    /* Ciudades de verdad, lejos de la costa (los contornos son simplificados),
       con el continente al que pertenecen: la sonda lo sabe, no la escena. */
    var CIUDADES = [
      ['Tegucigalpa', -87.2, 14.1, 'america'], ['Ciudad de México', -99.1, 19.4, 'america'], ['Denver', -105, 39.7, 'america'],
      ['Winnipeg', -97.1, 49.9, 'america'], ['Fairbanks', -147.7, 64.8, 'america'], ['Groenlandia', -42, 72, 'america'],
      ['Bogotá', -74.1, 4.7, 'america'], ['Brasilia', -47.9, -15.8, 'america'], ['La Paz', -68.1, -16.5, 'america'],
      ['Córdoba', -64.2, -31.4, 'america'],
      ['Alice Springs', 133.9, -23.7, 'oceania'], ['Canberra', 149.1, -35.3, 'oceania'], ['Kalgoorlie', 121.5, -30.7, 'oceania'],
      ['Mount Hagen', 144.2, -5.9, 'oceania'], ['Hamilton', 175.3, -37.8, 'oceania'], ['la isla Sur', 170.5, -44, 'oceania'],
      ['Tasmania', 146.5, -42, 'oceania'], ['Nueva Caledonia', 165.8, -21.4, 'oceania'], ['Viti Levu', 178, -17.8, 'oceania'],
      ['el interior de la Antártida', 0, -80, 'antartida'], ['la Antártida, a 100° E', 100, -75, 'antartida'],
      ['la Antártida, a 100° O', -100, -78, 'antartida'], ['la Antártida, a 160° E', 160, -80, 'antartida'],
      ['la Antártida, a 60° O', -60, -80, 'antartida'],
      ['Madrid', -3.7, 40.4, ''], ['el Senegal', -15.5, 14, ''], ['Islandia', -19, 64.8, ''], ['Moscú', 37.6, 55.8, ''],
      ['Pekín', 116.4, 39.9, ''], ['Tokio', 139.7, 35.7, ''], ['Luzón', 121, 16.5, ''], ['Borneo', 114, 1, ''],
      ['Java', 107, -7, ''], ['Madagascar', 46.9, -18.9, ''], ['el sur de África', 22, -30, '']
    ];
    var ciudades = CIUDADES.map(function (c) {
      var p = ee(c[1], c[2]), cuya = null;
      tierras.forEach(function (t) { if (!cuya && dentro([t], p)) cuya = t; });
      return { nombre: c[0], de: c[3], tierra: !!cuya, trozos: cuya ? (cuya.getAttribute('d').match(/M/g) || []).length : 0,
               luz: enLuces(p), noche: dentro(nocheP, p) };
    });

    function punto(g) { return g ? aVista(g, 0, 0) : null; }
    var casa = raiz.querySelector('[data-casa]'), sol = raiz.querySelector('[data-sol]'), sid = raiz.querySelector('[data-sidney]');
    var solLon = nocheG ? +nocheG.getAttribute('data-sol-lon') : 0, solLat = nocheG ? +nocheG.getAttribute('data-sol-lat') : 0;
    var pruebas = [];
    [-60, -30, 0, 30, 60].forEach(function (la) {
      [-95, -85, 0, 85, 95, 180].forEach(function (off) { pruebas.push({ lat: la, off: off, noche: dentro(nocheP, ee(solLon + off, la)) }); });
    });
    var amTotal = 0, amNoche = 0;
    if (luz.america) for (var lo = -170; lo <= -10; lo += 4) for (var la = -56; la <= 84; la += 4) {
      var pa = ee(lo, la);
      if (dentro(luz.america.p, pa)) { amTotal++; if (dentro(nocheP, pa)) amNoche++; }
    }
    function cerca(t, k) {
      if (!luz[k]) return false;
      var b = tinta(t), cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
      for (var dx = -14; dx <= 14; dx += 2) for (var dy = -14; dy <= 14; dy += 2) if (dentro(luz[k].p, [cx + dx, cy + dy])) return true;
      return false;
    }
    return {
      proy: { L0: L0, S: S, alto: bb.height, altoEE: 2 * YMAX * S, total: total, faltan: faltan, peor: Math.round(peor * 1000) / 1000,
              dibujados: tierras.length, anillos: C.tierra.length },
      ciudades: ciudades,
      luces: ks.map(function (k) { return { k: k, ve: !!luz[k] && vis(luz[k].g) }; }),
      casa: casa ? { ve: vis(casa), pos: punto(casa), lon: +casa.getAttribute('data-lon'), lat: +casa.getAttribute('data-lat'),
                     proy: ee(+casa.getAttribute('data-lon'), +casa.getAttribute('data-lat')),
                     luz: enLuces(ee(+casa.getAttribute('data-lon'), +casa.getAttribute('data-lat'))),
                     noche: dentro(nocheP, ee(+casa.getAttribute('data-lon'), +casa.getAttribute('data-lat'))) } : null,
      dudas: todos('[data-duda]').map(function (g) {
        var lon = +g.getAttribute('data-lon'), lat = +g.getAttribute('data-lat'), p = ee(lon, lat);
        return { k: g.getAttribute('data-duda'), ve: vis(g), pos: punto(g), proy: p, luz: enLucesCosta(p),
                 raya: raya(g.querySelector('circle')), signo: g.querySelector('text').textContent };
      }),
      flechas: todos('[data-flecha]').map(function (g) {
        var rr = g.querySelector('[data-raya]'), pu = g.querySelector('[data-punta]'), largo = rr.getTotalLength(), muestras = [];
        for (var i = 0; i <= 20; i++) { var q = rr.getPointAtLength(largo * i / 20), pv = aVista(rr, q.x, q.y); muestras.push({ p: pv, tierra: dentro(tierras, pv) }); }
        return { k: g.getAttribute('data-flecha'), ve: vis(rr), corrido: corrido(rr), largo: largo, muestras: muestras,
                 punta: vertices(pu)[1], puntaVe: vis(pu) };
      }),
      nombres: todos('[data-nombre]').map(function (t) { return { k: t.getAttribute('data-nombre'), ve: vis(t), dice: t.textContent, cerca: cerca(t, t.getAttribute('data-nombre')) }; }),
      noche: { ve: !!nocheG && vis(nocheG), solLon: solLon, solLat: solLat, pruebas: pruebas, america: { total: amTotal, noche: amNoche } },
      sol: sol ? { ve: vis(sol), pos: punto(sol), lon: +sol.getAttribute('data-lon'), lat: +sol.getAttribute('data-lat'),
                   proy: ee(+sol.getAttribute('data-lon'), +sol.getAttribute('data-lat')),
                   noche: dentro(nocheP, ee(+sol.getAttribute('data-lon'), +sol.getAttribute('data-lat'))) } : null,
      lunas: todos('[data-luna]').map(function (g) { var p = punto(g); return { ve: vis(g), pos: p, noche: dentro(nocheP, p) }; }),
      sidney: sid ? { ve: vis(sid), pos: punto(sid), lon: +sid.getAttribute('data-lon'), lat: +sid.getAttribute('data-lat'),
                      proy: ee(+sid.getAttribute('data-lon'), +sid.getAttribute('data-lat')),
                      luz: enLucesCosta(ee(+sid.getAttribute('data-lon'), +sid.getAttribute('data-lat'))),
                      noche: dentro(nocheP, ee(+sid.getAttribute('data-lon'), +sid.getAttribute('data-lat'))),
                      dice: sid.querySelector('text').textContent, tinta: tinta(sid.querySelector('text')) } : null,
      relojes: todos('[data-reloj]').map(function (g) {
        var h = g.querySelector('[data-hora]'), d = g.querySelector('[data-dia]'), a = tinta(h), b = tinta(d);
        return { k: g.getAttribute('data-reloj'), ve: vis(g), hora: h.textContent, dia: d.textContent,
                 caja: { x0: Math.min(a.x0, b.x0), y0: Math.min(a.y0, b.y0), x1: Math.max(a.x1, b.x1), y1: Math.max(a.y1, b.y1) } };
      }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* Los Continentes: Europa, Asia y África. El mapa se lee como el de la
     misión anterior (Equal Earth, proyectado por la sonda) y la mesa del
     precio, pieza por pieza: cada taza con su centro y si tiene café, cada
     quintal con su centro, lo que falta, lo que sobra, la pila de monedas y
     el hilo de la etiqueta. ⚠️ Aquí no van barras invertidas: esto vive
     dentro de una plantilla de texto y se pierden. */
  window.__amExtra.amPrecio = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function centroDe(el) { var c = caja(el); return [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2]; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(',').join(' ').split(' ').map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function corrido(el) { return Math.abs(parseFloat(getComputedStyle(el).strokeDashoffset) || 0); }
    var lienzo = document.createElement('canvas').getContext('2d');
    function tinta(t) {
      var cs = getComputedStyle(t), s = t.textContent, ancla = t.getAttribute('text-anchor') || cs.textAnchor || 'start';
      lienzo.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      lienzo.textAlign = ancla === 'end' ? 'right' : (ancla === 'middle' ? 'center' : 'left');
      var m = lienzo.measureText(s), x0 = +t.getAttribute('x'), y0 = +t.getAttribute('y');
      var p = aVista(t, x0 - m.actualBoundingBoxLeft, y0 - m.actualBoundingBoxAscent), q = aVista(t, x0 + m.actualBoundingBoxRight, y0 + m.actualBoundingBoxDescent);
      return { x0: p[0], y0: p[1], x1: q[0], y1: q[1] };
    }
    function vertices(p) {
      var t = p.getAttribute('d').split(' ').filter(function (v) { return v.length; }), out = [];
      for (var i = 0; i < t.length; i++) if (t[i] === 'M' || t[i] === 'L') { out.push(aVista(p, +t[i + 1], +t[i + 2])); i += 2; }
      return out;
    }
    function dentro(paths, p) {
      var q = svg.createSVGPoint(); q.x = p[0]; q.y = p[1];
      return paths.some(function (el) { return el.isPointInFill(q); });
    }

    /* ── Equal Earth, de la sonda ── */
    var A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, R3 = Math.sqrt(3);
    var mundo = raiz.querySelector('[data-mundo]'), mar = raiz.querySelector('[data-mar]');
    var L0 = +mundo.getAttribute('data-l0'), bb = mar.getBBox();
    var XMAX = 2 * R3 * Math.PI / (3 * A1);
    var YMAX = (function () { var t = Math.PI / 3, t2 = t * t, t6 = t2 * t2 * t2; return t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2)); })();
    var S = bb.width / (2 * XMAX), CX = bb.x + bb.width / 2, CY = bb.y + bb.height / 2;
    function ee(lon, lat) {
      var d = lon - L0;
      while (d > 180) d -= 360;
      while (d <= -180) d += 360;
      var l = d * Math.PI / 180, f = lat * Math.PI / 180, t = Math.asin(R3 / 2 * Math.sin(f)), t2 = t * t, t6 = t2 * t2 * t2;
      var X = 2 * R3 * l * Math.cos(t) / (3 * (9 * A4 * t6 * t2 + 7 * A3 * t6 + 3 * A2 * t2 + A1));
      var Y = t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2));
      return [CX + S * X, CY - S * Y];
    }

    var tierras = todos('[data-tierra]'), C = window.CONTORNOS_MUNDO, faltan = 0, total = 0, peor = 0;
    C.tierra.forEach(function (c, i) {
      var v = tierras[i] ? vertices(tierras[i]) : [];
      for (var j = 0; j < c.length; j += 2) {
        if (c[j + 1] <= -89.9) continue;
        total++;
        var p = ee(c[j], c[j + 1]), mejor = 1e9;
        for (var k = 0; k < v.length; k++) { var dd = Math.hypot(v[k][0] - p[0], v[k][1] - p[1]); if (dd < mejor) mejor = dd; }
        if (mejor > 0.06) faltan++;
        if (mejor > peor) peor = mejor;
      }
    });
    /* La costura: un anillo que sale en más de un pedazo quedó partido. */
    var partidos = tierras.filter(function (t) { return (t.getAttribute('d').match(/M/g) || []).length > 1; })
      .map(function (t) { return t.getAttribute('data-tierra') + ' ' + t.getAttribute('data-anillo'); });

    var luz = {}, gruposLuz = todos('[data-luz]');
    gruposLuz.forEach(function (g) { luz[g.getAttribute('data-luz')] = { g: g, p: [].slice.call(g.querySelectorAll('path')) }; });
    var ks = ['europa', 'asia', 'africa'];
    function enLuces(p) { var o = {}; ks.forEach(function (k) { o[k] = !!luz[k] && dentro(luz[k].p, p); }); return o; }
    /* El agua de dentro de la tierra, encima de las luces. */
    var aguas = todos('[data-agua]');
    var aguaEncima = aguas.length === 2 && aguas.every(function (a) {
      return gruposLuz.every(function (g) { return !!(g.compareDocumentPosition(a) & 4); });
    });

    /* Ciudades de verdad, lejos de la costa, con el continente al que
       pertenecen: la sonda lo sabe, no la escena. La frontera de Europa y
       Asia pasa entre Ufá y Ekaterimburgo, y entre Tracia y Anatolia. */
    var CIUDADES = [
      ['Madrid', -3.7, 40.4, 'europa'], ['París', 2.35, 48.85, 'europa'], ['Berlín', 13.4, 52.5, 'europa'], ['Roma', 12.8, 42.5, 'europa'],
      ['Atenas', 22, 39.5, 'europa'], ['Kiev', 30.5, 50.45, 'europa'], ['Moscú', 37.6, 55.8, 'europa'], ['Kazán', 49.1, 55.8, 'europa'],
      ['Perm', 56.2, 58, 'europa'], ['Ufá', 56, 54.7, 'europa'], ['Astracán', 48, 46.6, 'europa'], ['Noruega', 10.5, 61, 'europa'],
      ['Finlandia', 25.5, 62, 'europa'], ['Gran Bretaña', -1.9, 52.5, 'europa'], ['Irlanda', -8, 53.3, 'europa'],
      ['Islandia', -18.5, 64.9, 'europa'], ['Tracia', 27, 41.6, 'europa'],
      ['Ekaterimburgo', 60.6, 56.8, 'asia'], ['Cheliábinsk', 61.4, 55.2, 'asia'], ['Novosibirsk', 82.9, 55, 'asia'],
      ['Pekín', 116.4, 39.9, 'asia'], ['Delhi', 77.2, 28.6, 'asia'], ['Bangkok', 100.5, 14.5, 'asia'], ['Ankara', 32.9, 39.9, 'asia'],
      ['Anatolia', 28.5, 38.5, 'asia'], ['Jerusalén', 35.2, 31.8, 'asia'], ['Riad', 46.7, 24.7, 'asia'], ['Tiflis', 44.8, 41.7, 'asia'],
      ['el Sinaí', 33.8, 29.5, 'asia'], ['Japón', 138.5, 36.2, 'asia'], ['Taiwán', 121, 23.8, 'asia'], ['Sri Lanka', 80.7, 7.8, 'asia'],
      ['Java', 110.4, -7.5, 'asia'], ['Borneo', 114, 1, 'asia'], ['Luzón', 121, 16.5, 'asia'],
      ['El Cairo', 31.2, 30, 'africa'], ['Jartum', 32.5, 15.6, 'africa'], ['Nairobi', 36.8, -1.3, 'africa'], ['Kinsasa', 15.3, -4.3, 'africa'],
      ['Ibadán', 3.9, 7.4, 'africa'], ['el Senegal', -15.5, 14, 'africa'], ['Marrakech', -8, 31.6, 'africa'], ['el Karoo', 21, -32, 'africa'],
      ['Madagascar', 46.9, -18.9, 'africa'],
      ['Tegucigalpa', -87.2, 14.1, ''], ['Bogotá', -74.1, 4.7, ''], ['Groenlandia', -42, 72, ''], ['Alice Springs', 133.9, -23.7, ''],
      ['Nueva Guinea', 144.2, -5.9, ''], ['la Antártida', 0, -80, '']
    ];
    var ciudades = CIUDADES.map(function (c) {
      var p = ee(c[1], c[2]);
      return { nombre: c[0], de: c[3], tierra: dentro(tierras, p), luz: enLuces(p) };
    });

    function punto(g) { return g ? aVista(g, 0, 0) : null; }
    var casa = raiz.querySelector('[data-casa]'), hn = raiz.querySelector('[data-honduras]');
    var rg = raiz.querySelector('[data-ruta]'), rr = rg && rg.querySelector('[data-raya]'), rp = rg && rg.querySelector('[data-punta]');
    var ruta = null;
    if (rr) {
      var largo = rr.getTotalLength(), muestras = [];
      for (var i = 0; i <= 20; i++) { var q = rr.getPointAtLength(largo * i / 20), pv = aVista(rr, q.x, q.y); muestras.push({ p: pv, tierra: dentro(tierras, pv) }); }
      var dl = +rg.getAttribute('data-destino-lon'), dla = +rg.getAttribute('data-destino-lat'), punta = vertices(rp)[1];
      ruta = { ve: vis(rr), corrido: corrido(rr), muestras: muestras, punta: punta, puntaVe: vis(rp),
               destino: ee(dl, dla), luzPunta: enLuces(punta) };
    }
    function cerca(t, k) {
      if (!luz[k]) return false;
      var b = tinta(t), cx = (b.x0 + b.x1) / 2, cy = (b.y0 + b.y1) / 2;
      for (var dx = -14; dx <= 14; dx += 2) for (var dy = -14; dy <= 14; dy += 2) if (dentro(luz[k].p, [cx + dx, cy + dy])) return true;
      return false;
    }
    var bu = raiz.querySelector('[data-burbuja]');
    var etiq = raiz.querySelector('.pc-etiqueta'), hilo = raiz.querySelector('.pc-hilo');
    var finHilo = hilo ? (function () { var L = hilo.getTotalLength(), a = hilo.getPointAtLength(0), b = hilo.getPointAtLength(L); return [aVista(hilo, a.x, a.y), aVista(hilo, b.x, b.y)]; })() : null;
    var fa = raiz.querySelector('[data-falta]'), so = raiz.querySelector('[data-sobran]');
    return {
      proy: { L0: L0, S: S, alto: bb.height, altoEE: 2 * YMAX * S, total: total, faltan: faltan, peor: Math.round(peor * 1000) / 1000,
              dibujados: tierras.length, anillos: C.tierra.length, partidos: partidos, aguaEncima: aguaEncima },
      ciudades: ciudades,
      luces: ks.map(function (k) { return { k: k, ve: !!luz[k] && vis(luz[k].g) }; }),
      casa: casa ? { ve: vis(casa), pos: punto(casa), lon: +casa.getAttribute('data-lon'), lat: +casa.getAttribute('data-lat'),
                     proy: ee(+casa.getAttribute('data-lon'), +casa.getAttribute('data-lat')) } : null,
      honduras: hn ? { ve: vis(hn), dice: hn.textContent, tinta: tinta(hn) } : null,
      ruta: ruta,
      nombres: todos('[data-nombre]').map(function (t) { return { k: t.getAttribute('data-nombre'), ve: vis(t), dice: t.textContent, cerca: cerca(t, t.getAttribute('data-nombre')) }; }),
      burbuja: bu ? { ve: vis(bu), pos: punto(bu), raya: raya(bu.querySelector('circle')), signo: bu.querySelector('text').textContent } : null,
      mesa: caja(raiz.querySelector('[data-mesa] rect')),
      tazas: todos('[data-taza]').map(function (g) {
        return { i: +g.getAttribute('data-taza'), ve: vis(g), c: centroDe(g.querySelector('[data-cuerpo]')),
                 cafe: vis(g.querySelector('[data-cafe]')), vapor: vis(g.querySelector('[data-vapor]')) };
      }),
      sacos: todos('[data-saco]').map(function (g) {
        return { k: +g.getAttribute('data-saco'), ve: vis(g), chele: g.hasAttribute('data-chele'), c: centroDe(g.querySelector('.pc-saco')),
                 caja: caja(g.querySelector('.pc-saco')) };
      }),
      falta: fa ? { ve: vis(fa), c: centroDe(fa.querySelector('path')), raya: raya(fa.querySelector('path')), dice: fa.querySelector('text').textContent } : null,
      sobran: so ? { ve: vis(so), caja: caja(so.querySelector('rect')), raya: raya(so.querySelector('rect')), dice: so.querySelector('text').textContent } : null,
      precio: {
        monedas: todos('[data-moneda]').filter(vis).length,
        fantasmas: todos('[data-fantasma]').filter(vis).map(raya),
        duda: (function () { var t = raiz.querySelector('[data-precio-duda]'); return t ? { ve: vis(t), dice: t.textContent } : null; })(),
        etiqueta: etiq ? caja(etiq) : null,
        hilo: finHilo
      },
      rotulos: todos('[data-rotulo]').map(function (t) { return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, tinta: tinta(t) }; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* El Adjetivo Avanzado: el acta de las dos comas. Se lee cada pedazo del
     acta con su tinta y su línea base; los subrayados, con su raya; las
     marquitas de las comas; cada alumno con su nota (la ✗ son dos rayas y la
     ✓ una) y el sitio de donde se mide; los aros y los sobres con su
     centro; la etiqueta con su raya y su hilo de punta a punta, y la
     leyenda. ⚠️ Aquí no van barras invertidas: esto vive dentro de una
     plantilla de texto y se pierden. */
  window.__amExtra.amActa = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function raya(el) { var d = getComputedStyle(el).strokeDasharray; if (!d || d === 'none') return 0; var v = d.split(',').join(' ').split(' ').map(parseFloat).filter(isFinite); return v.length ? Math.max.apply(null, v) : 0; }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    var lienzo = document.createElement('canvas').getContext('2d');
    function medir(t) {
      var cs = getComputedStyle(t), s = t.textContent;
      lienzo.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      lienzo.textAlign = 'left';
      var m = lienzo.measureText(s), x0 = +t.getAttribute('x'), y0 = +t.getAttribute('y');
      var p = aVista(t, x0 - m.actualBoundingBoxLeft, y0 - m.actualBoundingBoxAscent), q = aVista(t, x0 + m.actualBoundingBoxRight, y0 + m.actualBoundingBoxDescent);
      var a = aVista(t, x0, y0), b = aVista(t, x0 + m.width, y0);
      return { tinta: { x0: p[0], y0: p[1], x1: q[0], y1: q[1] }, x0: a[0], x1: b[0], base: a[1] };
    }
    function punta(p, largo) { var q = p.getPointAtLength(largo); return aVista(p, q.x, q.y); }
    var ley = raiz.querySelector('[data-leyenda]');
    return {
      papel: caja(raiz.querySelector('[data-papel]')),
      acta: todos('[data-acta]').filter(vis).map(function (t) {
        var m = medir(t);
        return { rol: t.getAttribute('data-acta'), dice: t.textContent, x0: m.x0, x1: m.x1, base: m.base, tinta: m.tinta };
      }),
      subrayas: todos('[data-subraya]').filter(vis).map(function (p) {
        var largo = p.getTotalLength();
        return { de: p.getAttribute('data-subraya'), caja: caja(p), raya: raya(p), corrido: Math.abs(parseFloat(getComputedStyle(p).strokeDashoffset) || 0), largo: largo };
      }),
      marcas: todos('[data-marca-coma]').filter(vis).map(function (p) { return { de: p.getAttribute('data-marca-coma'), caja: caja(p) }; }),
      alumnos: todos('[data-alumno]').filter(vis).map(function (g) {
        var nota = g.querySelector('[data-nota]'), marca = nota.querySelector('[data-marca]');
        return { n: +g.getAttribute('data-alumno'), nota: nota.getAttribute('data-nota'),
          rayas: (marca.getAttribute('d').match(/M/g) || []).length, sitio: aVista(g, 0, 0), caja: caja(g) };
      }),
      aros: todos('[data-aro]').filter(vis).map(function (c) {
        return { centro: aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')), r: +c.getAttribute('r'), raya: raya(c) };
      }),
      sobres: todos('[data-sobre]').filter(vis).map(function (g) { return { caja: caja(g) }; }),
      etiquetas: todos('[data-etiqueta]').filter(vis).map(function (g) {
        var marco = g.querySelector('[data-etiqueta-marco]');
        return { de: g.getAttribute('data-etiqueta'), dice: g.querySelector('[data-etiqueta-dice]').textContent, caja: caja(marco), raya: raya(marco) };
      }),
      hilos: todos('[data-hilo-etiqueta]').filter(vis).map(function (p) {
        var largo = p.getTotalLength();
        return { de: p.getAttribute('data-hilo-etiqueta'), ini: punta(p, 0), fin: punta(p, largo) };
      }),
      leyenda: {
        dice: [].slice.call(ley.querySelectorAll('[data-ley]')).filter(vis).map(function (t) {
          var cerca = null, mejor = Infinity, tx = medir(t);
          [].slice.call(ley.querySelectorAll('[data-nota]')).forEach(function (g) {
            var c = caja(g), d = Math.abs(c.x1 - tx.x0) + Math.abs((c.y0 + c.y1) / 2 - (tx.tinta.y0 + tx.tinta.y1) / 2);
            if (d < mejor) { mejor = d; cerca = g.getAttribute('data-nota'); }
          });
          return { de: t.getAttribute('data-ley'), dice: t.textContent, nota: cerca, lejos: mejor };
        }),
        aro: vis(raiz.querySelector('[data-ley-aro]')),
        sobre: vis(raiz.querySelector('[data-ley-sobre]'))
      },
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* Desastres Naturales: la misma lluvia, dos casas. Se lee lo que se ve:
     la pared de atrás, los muros, el tejado y el piso de cada casa; lo de
     adentro, cada cosa con su caja; las ✗ y las ✓ con su centro; cada gota
     de punta a punta; el agua por su borde de arriba y hasta dónde llega; el
     cauce; la flecha del agua que baja, punto por punto, con el suelo que
     tiene debajo; la marca del agua, la persona y su cintura; el techo que
     gotea, la repisa y los rótulos. El suelo en una x se le pregunta al
     navegador: el primer punto, de arriba abajo, que cae dentro de la
     tierra. ⚠️ Aquí no van barras invertidas: esto vive dentro de una
     plantilla de texto y se pierden. */
  window.__amExtra.amAguacero = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(base.multiply(el.getScreenCTM())); return [q.x, q.y]; }
    function caja(el) { var b = el.getBBox(), a = aVista(el, b.x, b.y), c = aVista(el, b.x + b.width, b.y + b.height); return { x0: Math.min(a[0], c[0]), y0: Math.min(a[1], c[1]), x1: Math.max(a[0], c[0]), y1: Math.max(a[1], c[1]) }; }
    function uno(sel) { return raiz.querySelector(sel); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    var tierra = uno('[data-terreno]');
    function enTierra(x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; return tierra.isPointInFill(p); }
    function suelo(x) {
      for (var y = 0; y <= 262; y += 0.25) { if (enTierra(x, y)) return y; }
      return null;
    }
    function casa(k) {
      var t = uno('[data-tejado="' + k + '"]'), a = t.getPointAtLength(0);
      return { fondo: caja(uno('[data-fondo="' + k + '"]')), muros: caja(uno('[data-muros="' + k + '"]')),
               tejado: caja(t), alero: aVista(t, a.x, a.y), piso: caja(uno('[data-piso="' + k + '"]')).y0 };
    }
    var ck = casa('kenia'), cv = casa('vecino');
    var agua = uno('[data-agua-cuerpo]'), ac = caja(agua);
    var raya = uno('[data-escurre] [data-raya]'), punta = uno('[data-escurre] [data-punta]');
    var largo = raya.getTotalLength(), muestras = [];
    for (var i = 0; i <= 40; i++) {
      var q = raya.getPointAtLength(largo * i / 40), m = aVista(raya, q.x, q.y);
      muestras.push({ p: m, suelo: suelo(m[0]) });
    }
    var pd = (punta.getAttribute('d').match(/[0-9.]+/g) || []).map(Number);
    var persona = uno('[data-persona]');
    return {
      casas: { kenia: ck, vecino: cv },
      suelos: { vecino: suelo((cv.muros.x0 + cv.muros.x1) / 2) },
      cosas: todos('[data-cosa]').map(function (g) {
        return { id: g.getAttribute('data-cosa'), casa: g.getAttribute('data-casa'), tipo: g.getAttribute('data-tipo'), caja: caja(g.querySelector('[data-cuerpo]')) };
      }),
      marcas: todos('[data-marca]').map(function (g) {
        var c = caja(g);
        return { tipo: g.getAttribute('data-marca'), de: g.getAttribute('data-de'), ve: vis(g), c: [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2] };
      }),
      lluvia: { ve: vis(uno('[data-lluvia]')), gotas: todos('[data-gota]').map(function (l) {
        var a = aVista(l, +l.getAttribute('x1'), +l.getAttribute('y1')), b = aVista(l, +l.getAttribute('x2'), +l.getAttribute('y2'));
        return { a: a, b: b, sueloFin: suelo(b[0]) };
      }) },
      nube: { ve: vis(uno('[data-nube]')), caja: caja(uno('[data-nube]')) },
      sol: vis(uno('[data-sol]')),
      agua: { ve: vis(agua), top: ac.y0, x1: ac.x1, sueloBorde: suelo(ac.x1) },
      cauce: caja(uno('[data-cauce]')),
      flecha: { ve: vis(raya), corrido: Math.abs(parseFloat(getComputedStyle(raya).strokeDashoffset) || 0),
                puntaVe: vis(punta), punta: aVista(punta, pd[2], pd[3]), muestras: muestras },
      lodo: { raya: { ve: vis(uno('[data-marca-agua]')), caja: caja(uno('[data-marca-agua]')) },
              mancha: { ve: vis(uno('[data-mancha]')), caja: caja(uno('[data-mancha]')) } },
      persona: { ve: vis(persona), caja: caja(persona), cintura: caja(uno('[data-cintura]')) },
      mojada: { ve: vis(uno('[data-mojada]')), gotas: todos('[data-gotita]').map(caja) },
      repisa: { ve: vis(uno('[data-repisa]')), tabla: caja(uno('[data-tabla]')) },
      rotulos: todos('[data-rotulo]').map(function (t) {
        var c = caja(t);
        return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: c, enTierra: enTierra((c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2) };
      }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  /* Áreas Protegidas: «El agua que el monte guarda». Se lee lo que se ve:
     cada cerro por su curva y lo de adentro por su recorte, punto por
     punto; el agua guardada por su borde de arriba, con todas las capas de
     los meses que la bajan; los árboles, los tocones y las raíces; la toma,
     su tubo, el chorro, la pila con su agua, la ✗ de la toma seca y los
     bidones; cada gota de punta a punta; las flechas punto por punto; y las
     tiras de los meses, celda por celda, con lo que lleva cada una. ⚠️ Aquí
     no van barras invertidas: esto vive dentro de una plantilla de texto. */
  window.__amExtra.amToma = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel) { return raiz.querySelector(sel); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    /* Los puntos de un trazo, en la vista. Lo de adentro vive en un
       recorte, que no se pinta: sus puntos se pasan con el grupo del cerro. */
    function recorrido(path, ref, n) {
      var L = path.getTotalLength(), out = [];
      for (var i = 0; i <= n; i++) { var q = path.getPointAtLength(L * i / n); out.push(aVista(ref || path, q.x, q.y)); }
      return out;
    }
    function flecha(g) {
      var raya = g.querySelector('[data-raya]'), punta = g.querySelector('[data-punta]');
      var pd = (punta.getAttribute('d').match(/[0-9.]+/g) || []).map(Number);
      return { ve: vis(g), pts: recorrido(raya, null, 30), punta: aVista(punta, pd[2], pd[3]), puntaCaja: caja(punta) };
    }
    function cerro(k) {
      var g = uno('[data-cerro="' + k + '"]');
      var agua = uno('[data-agua="' + k + '"]'), res = uno('[data-reserva="' + k + '"]');
      var chorro = uno('[data-chorro="' + k + '"]');
      return {
        forma: recorrido(uno('[data-forma="' + k + '"]'), null, 240),
        dentro: recorrido(uno('[data-dentro="' + k + '"]'), g, 240),
        reserva: vis(res), nivel: caja(agua).y0, capas: res.querySelectorAll('[data-mes-nivel]').length,
        arboles: todos('[data-frente="' + k + '"] [data-arbol]').map(function (a) {
          var t = a.querySelector('.ap-tronco'), c = a.querySelector('.ap-copa');
          return { tronco: caja(t), copa: aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')), r: +c.getAttribute('r') };
        }),
        tocones: todos('[data-frente="' + k + '"] [data-tocon]').map(function (a) { return caja(a); }),
        raices: todos('[data-cerro="' + k + '"] [data-raiz]').map(function (r) { return recorrido(r, null, 12); }),
        toma: caja(uno('[data-toma="' + k + '"]')), tubo: caja(uno('[data-tubo="' + k + '"]')),
        chorro: { ve: vis(chorro), a: aVista(chorro, +chorro.getAttribute('x1'), +chorro.getAttribute('y1')), b: aVista(chorro, +chorro.getAttribute('x2'), +chorro.getAttribute('y2')) },
        pila: caja(uno('[data-pila="' + k + '"]')),
        pilaAgua: { ve: vis(uno('[data-pila-agua="' + k + '"]')), caja: caja(uno('[data-pila-agua="' + k + '"]')) },
        seca: { ve: vis(uno('[data-seca="' + k + '"]')), caja: caja(uno('[data-seca="' + k + '"]')), rayas: uno('[data-seca="' + k + '"]').querySelectorAll('path').length },
        celdas: todos('[data-celda^="' + k + '-"]').map(function (c) {
          var i = c.getAttribute('data-celda').split('-')[1], cont = uno('[data-contenido="' + k + '-' + i + '"]'), letra = uno('[data-mes="' + k + '-' + i + '"]');
          return { i: +i, caja: caja(c), letra: letra.textContent, letraCaja: caja(letra),
                   cont: { ve: vis(cont), forma: cont.tagName.toLowerCase() === 'g' ? 'x' + cont.querySelectorAll('path').length : cont.classList.contains('ap-gota-mes') ? 'gota' : 'otra',
                           caja: caja(cont) } };
        })
      };
    }
    return {
      cerros: { monte: cerro('monte'), pelado: cerro('pelado') },
      suelo: caja(uno('[data-suelo]')).y0,
      entran: todos('[data-entra]').map(function (g) { var f = flecha(g); f.k = g.getAttribute('data-entra'); return f; }),
      corren: todos('[data-corre]').map(function (g) { var f = flecha(g); f.k = g.getAttribute('data-corre'); return f; }),
      flechas: vis(uno('[data-flechas]')),
      lluvia: { ve: vis(uno('[data-lluvia]')), gotas: todos('[data-gota]').map(function (l) {
        return { a: aVista(l, +l.getAttribute('x1'), +l.getAttribute('y1')), b: aVista(l, +l.getAttribute('x2'), +l.getAttribute('y2')) };
      }) },
      nube: { ve: vis(uno('[data-nube]')), caja: caja(uno('[data-nube]')) },
      sol: vis(uno('[data-sol]')),
      bidones: { ve: vis(uno('[data-bidones]')), cajas: todos('[data-bidon]').map(caja) },
      tiras: vis(uno('[data-tiras]')),
      rotulos: todos('[data-rotulo]').map(function (t) { return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: caja(t) }; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  window.__amExtra.amAmarra = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel, en) { return (en || raiz).querySelector(sel); }
    function todos(sel, en) { return [].slice.call((en || raiz).querySelectorAll(sel)); }
    function punto(c) { return aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')); }
    /* Cuánto se movió una pieza y con qué demora: se lee del estilo que le
       puso el aparato (translate en px, que en el dibujo son unidades). */
    function tras(el) {
      var t = el.style.transform || '', i = t.indexOf('translate(');
      if (i < 0) return [0, 0];
      var par = t.slice(i + 10, t.indexOf(')', i)).split(',');
      return [parseFloat(par[0]) || 0, parseFloat(par[1]) || 0];
    }
    function demora(el) { return parseFloat(el.style.getPropertyValue('--d')) || 0; }
    function soga(el) {
      var d = (el.getAttribute('d') || '').split(' ');
      return [aVista(el, +d[1], +d[2]), aVista(el, +d[4], +d[5])];
    }
    function animal(g) {
      var mueve = g.firstElementChild;
      var lomo = uno('[data-lomo]', g), boca = uno('[data-boca]', g);
      return { donde: g.getAttribute('data-rata'), ve: vis(g), pisa: punto(uno('[data-pisa]', g)),
               lomo: lomo ? punto(lomo) : null, boca: boca ? punto(boca) : null,
               caja: caja(mueve), mueve: tras(mueve), dMueve: demora(mueve), dVer: demora(g) };
    }
    var gav = uno('[data-gavilan]'), va = gav.firstElementChild;
    var per = uno('[data-persona]'), con = uno('[data-con]');
    /* El gavilán tiene las alas abiertas y su caja es casi toda aire: si un
       rótulo lo toca se le pregunta a su dibujo, punto por punto. */
    var formasGav = todos('path, ellipse, circle', gav).filter(function (f) { return !f.classList.contains('ec-punto'); });
    function tocaGavilan(c) {
      if (!vis(gav)) return false;
      for (var xx = c.x0; xx <= c.x1; xx += 1) {
        for (var yy = c.y0; yy <= c.y1; yy += 1) {
          for (var i = 0; i < formasGav.length; i++) {
            var f = formasGav[i], p = svg.createSVGPoint(); p.x = xx; p.y = yy;
            var q = p.matrixTransform(m(f).inverse());
            if (f.isPointInFill(q) || f.isPointInStroke(q)) return true;
          }
        }
      }
      return false;
    }
    return {
      patio: caja(uno('[data-patio]')),
      troja: caja(uno('[data-troja]')),
      postes: todos('[data-poste]').map(caja),
      mazorcas: todos('[data-mazorca]').map(function (g) { return { ve: vis(g), c: punto(uno('ellipse', g)), caja: caja(g) }; }),
      huecosMaz: todos('[data-mazorca-hueco]').map(function (e) { return { ve: vis(e), c: punto(e) }; }),
      ratas: todos('[data-rata]').map(animal),
      pollos: todos('[data-pollo]').map(animal),
      huecoPollo: todos('[data-pollo-hueco]').map(function (g) { return { ve: vis(g), pisa: punto(uno('[data-pisa]', g)), caja: caja(g), d: demora(g) }; }),
      gavilan: { ve: vis(gav), patas: punto(uno('[data-patas]')), caja: caja(gav), va: tras(va), dVa: demora(va), dVer: demora(gav),
                 vuelos: todos('[data-vuelo]').map(function (v) { return { k: v.getAttribute('data-vuelo'), t: tras(v), d: demora(v) }; }) },
      amarras: todos('[data-amarra]').map(function (g) {
        var s = soga(uno('[data-soga]', g));
        return { k: g.getAttribute('data-amarra'), ve: vis(g), a: s[0], b: s[1], d: demora(g),
                 nudos: todos('.ec-nudo', g).map(punto) };
      }),
      persona: { ve: vis(per), pisa: punto(uno('[data-pisa]', per)), vara: punto(uno('[data-punta-vara]', per)), caja: caja(per) },
      guia: { ve: vis(con), ab: soga(uno('[data-guia]', con)) },
      rotulos: todos('[data-rotulo]').map(function (t) { var c = caja(t); return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: c, tocaGav: vis(t) && tocaGavilan(c) }; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  window.__amExtra.amVeneno = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel, en) { return (en || raiz).querySelector(sel); }
    function todos(sel, en) { return [].slice.call((en || raiz).querySelectorAll(sel)); }
    /* Las hojas no llevan movimiento: sus coordenadas son las de la vista
       (se comprueba), y así un punto de la vista se le pregunta tal cual. */
    var hojaA = uno('[data-hoja="a"]'), hojaB = uno('[data-hoja="b"]');
    function quieta(h) { var q = m(h); return Math.abs(q.a - 1) < 1e-6 && Math.abs(q.d - 1) < 1e-6 && Math.abs(q.e) < 1e-6 && Math.abs(q.f) < 1e-6; }
    function dentro(h, p) { var q = svg.createSVGPoint(); q.x = p[0]; q.y = p[1]; return h.isPointInFill(q); }
    /* Las mordidas viven en una máscara (no se pintan): se leen de sus
       atributos, y se ven si su opacidad es 1. */
    var mascara = uno('mask');
    var mordidas = todos('[data-mordida]').map(function (c) {
      var cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), r = +c.getAttribute('r');
      return { tipo: c.getAttribute('data-mordida'), ve: parseFloat(getComputedStyle(c).opacity) > 0.99, c: [cx, cy], r: r,
               abajoDentro: dentro(hojaA, [cx, cy + r * 0.6]), arribaFuera: !dentro(hojaA, [cx, cy - r * 0.6]), tocaB: dentro(hojaB, [cx, cy]) };
    });
    var manchas = todos('[data-mancha]').map(function (g) {
      var c = uno('[data-mancha-cuerpo]', g), cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), r = +c.getAttribute('r');
      var p = aVista(c, cx, cy), q = aVista(c, cx + r, cy);
      return { ve: vis(c), c: p, r: Math.hypot(q[0] - p[0], q[1] - p[1]), dentro: dentro(hojaB, p) };
    });
    /* Cuánto de la hoja de don Tulio tapan las manchas: se cuenta punto
       por punto, cada medio punto de la vista. */
    var bb = hojaB.getBBox(), tot = 0, cub = 0;
    for (var x = bb.x; x <= bb.x + bb.width; x += 0.5) {
      for (var y = bb.y; y <= bb.y + bb.height; y += 0.5) {
        if (!dentro(hojaB, [x, y])) continue;
        tot++;
        for (var k = 0; k < manchas.length; k++) { var mm = manchas[k]; if (mm.ve && Math.hypot(x - mm.c[0], y - mm.c[1]) <= mm.r) { cub++; break; } }
      }
    }
    var ch = uno('[data-chapulin]');
    var bocaEl = uno('[data-boca]', ch);
    var sol = uno('.vn-sol');
    return {
      quietas: quieta(hojaA) && quieta(hojaB),
      dA: hojaA.getAttribute('d'), dB: hojaB.getAttribute('d'),
      usaMascara: !!mascara && hojaA.parentNode.getAttribute('mask') === 'url(#' + mascara.id + ')',
      mordidas: mordidas,
      granos: todos('[data-granito]').map(function (g) {
        var p = aVista(g, +g.getAttribute('cx'), +g.getAttribute('cy'));
        return { hoja: g.getAttribute('data-granito'), ve: vis(g), p: p, dentroA: dentro(hojaA, p), dentroB: dentro(hojaB, p) };
      }),
      manchas: manchas,
      cubre: tot ? cub / tot : 0,
      hilos: todos('[data-hilo]').map(function (h) {
        var L = h.getTotalLength(), pts = [];
        for (var i = 0; i <= 12; i++) { var q = h.getPointAtLength(L * i / 12); pts.push(aVista(h, q.x, q.y)); }
        var off = parseFloat(h.style.strokeDashoffset); if (isNaN(off)) off = 0;
        return { ve: vis(h) && off < 1, pts: pts, fuera: pts.filter(function (p) { return !dentro(hojaB, p); }).length };
      }),
      chapulin: {
        ve: vis(ch),
        patas: todos('[data-pata]', ch).map(function (c) {
          var p = aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy'));
          return { p: p, bajo: dentro(hojaA, [p[0], p[1] + 1.5]), sobre: !dentro(hojaA, [p[0], p[1] - 1.5]) };
        }),
        boca: aVista(bocaEl, +bocaEl.getAttribute('cx'), +bocaEl.getAttribute('cy')),
        caja: caja(ch),
        /* Cuándo se apaga y cuándo se cae: con el veneno, las dos cosas a la
           vez y después de que caen las gotas. */
        dVer: parseFloat(ch.style.getPropertyValue('--d')) || 0,
        dCae: parseFloat(uno('[data-cae]', ch).style.getPropertyValue('--d')) || 0
      },
      dGotas: todos('[data-gota]').map(function (g) { return parseFloat(g.style.getPropertyValue('--d')) || 0; }),
      sol: { c: aVista(sol, +sol.getAttribute('cx'), +sol.getAttribute('cy')), r: +sol.getAttribute('r') },
      rayos: todos('[data-rayo]').map(function (l) {
        var a = aVista(l, +l.getAttribute('x1'), +l.getAttribute('y1')), b = aVista(l, +l.getAttribute('x2'), +l.getAttribute('y2'));
        return { ve: vis(l), a: a, b: b, enA: dentro(hojaA, b), enB: dentro(hojaB, b) };
      }),
      gotas: todos('[data-gota]').map(function (g) {
        var p = aVista(g, +g.getAttribute('cx'), +g.getAttribute('cy'));
        return { ve: vis(g), p: p, enA: dentro(hojaA, p), enB: dentro(hojaB, p) };
      }),
      bomba: { ve: vis(uno('[data-bomba]')), caja: caja(uno('[data-bomba]')) },
      etiquetas: todos('[data-etiqueta]').map(function (g) {
        return { k: g.getAttribute('data-etiqueta'), ve: vis(g), caja: caja(uno('[data-caja]', g)), dice: [].map.call(g.querySelectorAll('text'), function (t) { return t.textContent; }) };
      }),
      rotulos: todos('[data-rotulo]').map(function (t) { return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: caja(t) }; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  window.__amExtra.amHerida = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel, en) { return (en || raiz).querySelector(sel); }
    function todos(sel, en) { return [].slice.call((en || raiz).querySelectorAll(sel)); }
    function demora(el) { return parseFloat(el.style.getPropertyValue('--d')) || 0; }
    function linea(l) { return { a: aVista(l, +l.getAttribute('x1'), +l.getAttribute('y1')), b: aVista(l, +l.getAttribute('x2'), +l.getAttribute('y2')) }; }
    /* El centro de una célula: el de su cuerpo, donde está ahora. Y donde
       estaba antes de correrse: el mismo punto, sin el movimiento de la
       envoltura (se mide en las coordenadas de su padre). */
    function centro(g) { var r = uno('[data-cuerpo]', g), x = +r.getAttribute('x') + (+r.getAttribute('width')) / 2, y = +r.getAttribute('y') + (+r.getAttribute('height')) / 2; return { ahora: aVista(r, x, y), antes: aVista(g.parentNode, x, y), lado: +r.getAttribute('width') }; }
    return {
      viejas: todos('[data-vieja]').map(function (g) { var c = centro(g); return { id: g.getAttribute('data-celula'), ve: vis(g), d: demora(g), c: c.ahora, casa: c.antes, lado: c.lado }; }),
      nuevas: todos('[data-nueva]').map(function (g) { var c = centro(g); return { id: g.getAttribute('data-nueva'), madre: g.getAttribute('data-madre'), ve: vis(g), d: demora(g), c: c.ahora, inicio: c.antes }; }),
      flechas: { ve: vis(uno('[data-flechas]')), d: demora(uno('[data-flechas]')), lista: todos('[data-flecha]').map(function (g) {
        var l = linea(uno('line', g)), pd = uno('path', g).getAttribute('d').split(' ');
        return { id: g.getAttribute('data-flecha'), a: l.a, b: l.b, punta: aVista(g, parseFloat(pd[1]), parseFloat(pd[2])) };
      }) },
      corte: (function () { var c = uno('[data-corte]'), pd = c.getAttribute('d').split(' '); return { ve: vis(c), d: demora(c), a: aVista(c, parseFloat(pd[1]), parseFloat(pd[2])), b: aVista(c, parseFloat(pd[4]), parseFloat(pd[5])) }; })(),
      lupa: caja(uno('[data-lupa]')), brazo: caja(uno('[data-brazo]')), piel: caja(uno('[data-piel]')),
      rayas: todos('[data-lupa-raya]').map(function (l) { return linea(l); }),
      rotulos: todos('[data-rotulo]').map(function (t) { return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: caja(t) }; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  window.__amExtra.amSuTiempo = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel, en) { return (en || raiz).querySelector(sel); }
    function todos(sel, en) { return [].slice.call((en || raiz).querySelectorAll(sel)); }
    function demora(el) { return parseFloat(el.style.getPropertyValue('--d')) || 0; }
    function linea(l) { return { a: aVista(l, +l.getAttribute('x1'), +l.getAttribute('y1')), b: aVista(l, +l.getAttribute('x2'), +l.getAttribute('y2')) }; }
    /* Los tramos de algo que viaja: cuánto corre cada envoltura y cuándo
       arranca. Se mide en el dibujo: la diferencia entre dónde queda el
       origen de una envoltura y el de la de fuera. */
    function tramos(g0) {
      var gs = todos('[data-tramo]', g0), antes = aVista(g0, 0, 0);
      return gs.map(function (g) { var p = aVista(g, 0, 0), t = { dx: p[0] - antes[0], dy: p[1] - antes[1], d: demora(g) }; antes = p; return t; });
    }
    function globo(g) {
      var pt = g.getAttribute('data-punta').split(' ').map(Number), env = g.parentNode.getAttribute('data-envoltura') ? g.parentNode : null;
      return { clave: g.getAttribute('data-globo'), cuando: g.getAttribute('data-cuando'), ve: vis(g), d: demora(g), caja: caja(uno('[data-caja]', g)),
               dice: todos('[data-dice]', g).map(function (t) { return t.textContent; }), letras: todos('[data-dice]', g).map(caja),
               punta: aVista(g, pt[0], pt[1]), fila: g.closest('[data-fila]').getAttribute('data-fila'),
               envoltura: env ? { ve: vis(env), d: demora(env), fuera: env.classList.contains('am-fuera') } : null,
               dentroFuera: g.classList.contains('am-fuera') };
    }
    return {
      clase: vis(uno('[data-clase]')), dia: vis(uno('[data-dia]')), tarjetaVe: vis(uno('[data-tarjeta]')),
      alumnos: todos('[data-alumno]').map(function (g) {
        var n = g.getAttribute('data-alumno'), pista = linea(uno('[data-pista="' + n + '"]'));
        return { nombre: n, es: g.getAttribute('data-es'), cara: caja(uno('[data-cara]', g)), rotulo: caja(uno('text', g)), dice: uno('text', g).textContent, pista: pista };
      }),
      brotes: todos('[data-brote]').map(function (g) {
        var c = uno('.rd-base', g);
        return { nombre: g.getAttribute('data-brote'), ve: vis(g), d: demora(g), base: aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')), caja: caja(g) };
      }),
      raya: (function () {
        var g0 = uno('[data-raya-tiempo]'), l = uno('[data-ahora]');
        var L = linea(l);
        return { x: L.a[0], y0: Math.min(L.a[1], L.b[1]), y1: Math.max(L.a[1], L.b[1]), tramos: tramos(g0) };
      })(),
      eje: linea(uno('[data-eje]')),
      leyenda: { ve: vis(uno('[data-leyenda]')), brote: uno('[data-leyenda] .rd-hoja') ? caja(uno('[data-leyenda]')) : null },
      filas: todos('[data-fila]').map(function (g) {
        var k = g.getAttribute('data-fila'), cam = linea(uno('[data-camino]', g)), est = caja(uno('[data-llega]', g));
        return { k: k, ve: vis(g), camino: cam, escuela: caja(uno('[data-lugar="escuela"]', g)), casa: caja(uno('[data-lugar="casa"]', g)),
                 maestra: caja(uno('[data-maestra]', g)), cabezaMaestra: caja(uno('[data-cabeza-maestra]', g)),
                 estrella: { caja: est, c: [(est.x0 + est.x1) / 2, (est.y0 + est.y1) / 2] } };
      }),
      kenias: todos('[data-kenia]').map(function (g) {
        var cuerpo = uno('[data-pisa]', g), camina = g.getAttribute('data-cual') === 'camina';
        var boca = function (k) { var b = uno('[data-boca="' + k + '"]', g); return { ve: vis(b), d: demora(b) }; };
        var lag = uno('[data-lagrima]', g);
        return { fila: g.getAttribute('data-kenia'), cual: g.getAttribute('data-cual'), ve: vis(g), dVer: demora(g),
                 pisa: aVista(cuerpo, 0, 0), cabeza: caja(uno('[data-cabeza]', g)), tramos: camina ? tramos(g) : [],
                 tranquila: boca('tranquila'), triste: boca('triste'), contenta: boca('contenta'), lagrima: { ve: vis(lag), d: demora(lag) } };
      }),
      globos: todos('[data-globo]').map(globo),
      ayuda: todos('[data-ayuda]').map(function (g) { var c = uno('[data-visto]', g); return { cuando: g.getAttribute('data-cuando'), ve: vis(g), d: demora(g), caja: caja(c) }; }),
      comparar: (function () {
        var g = uno('[data-comparar]');
        return { ve: vis(g), d: demora(g), union: linea(uno('[data-union]', g)),
                 anillos: todos('[data-anillo]', g).map(function (c) { return { k: c.getAttribute('data-anillo'), c: aVista(c, +c.getAttribute('cx'), +c.getAttribute('cy')), caja: caja(c) }; }) };
      })(),
      tarjeta: { hoja: caja(uno('[data-hoja]')), escribir: linea(uno('[data-escribir]')) },
      rotulos: todos('[data-rotulo]').map(function (t) {
        var f = t.closest('[data-fila]');
        return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: caja(t), fila: f ? f.getAttribute('data-fila') : '' };
      }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  window.__amExtra.amCuesta = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel) { return raiz.querySelector(sel); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function demora(el) { return parseFloat(el.style.getPropertyValue('--d')) || 0; }
    /* ¿Cae el punto (de la vista) dentro de lo pintado de la pieza? Se le
       pregunta al navegador, en las coordenadas de la pieza. */
    function dentro(el, p) {
      var q = svg.createSVGPoint(); q.x = p[0]; q.y = p[1];
      return el.isPointInFill(q.matrixTransform(m(el).inverse()));
    }
    var pulmones = todos('[data-pulmon]'), piernas = todos('[data-pierna]'), aire = uno('[data-aire]');
    function cual(lista, atr, p) {
      for (var i = 0; i < lista.length; i++) if (dentro(lista[i], p)) return lista[i].getAttribute(atr);
      return '';
    }
    /* La punta de una flecha: el primer punto de su trazo es la punta y
       los otros dos, la base. Sin expresiones regulares: esto vive en una
       plantilla de texto. */
    function punta(el) {
      var t = el.getAttribute('d').split(' ');
      var a = aVista(el, parseFloat(t[1]), parseFloat(t[2])), b = aVista(el, parseFloat(t[4]), parseFloat(t[5])), c = aVista(el, parseFloat(t[7]), parseFloat(t[8]));
      return { punta: a, base: [(b[0] + c[0]) / 2, (b[1] + c[1]) / 2] };
    }
    return {
      cabeza: caja(uno('[data-cabeza]')), marvin: caja(uno('[data-marvin]')), boca: caja(uno('[data-boca]')),
      corazon: caja(uno('[data-corazon]')), aire: caja(aire),
      pulmones: pulmones.map(function (p) { return { k: p.getAttribute('data-pulmon'), caja: caja(p) }; }),
      piernas: piernas.map(function (p) { return { k: p.getAttribute('data-pierna'), caja: caja(p) }; }),
      vasos: todos('[data-vaso]').map(function (g) {
        var raya = g.querySelector('[data-raya]'), L = raya.getTotalLength(), a = raya.getPointAtLength(0), b = raya.getPointAtLength(L);
        var pa = aVista(raya, a.x, a.y), pb = aVista(raya, b.x, b.y);
        var f = punta(g.querySelector('path:not([data-raya])'));
        return { k: g.getAttribute('data-vaso'), a: pa, b: pb, pulmonA: cual(pulmones, 'data-pulmon', pa), pulmonB: cual(pulmones, 'data-pulmon', pb),
                 piernaA: cual(piernas, 'data-pierna', pa), piernaB: cual(piernas, 'data-pierna', pb), punta: f.punta, base: f.base };
      }),
      bolitas: todos('[data-oxigeno]').map(function (g0) {
        var c = g0.querySelector('circle'), cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), r = +c.getAttribute('r');
        var fin = aVista(c, cx, cy), q = aVista(c, cx + r, cy);
        return { cual: g0.getAttribute('data-oxigeno'), lado: g0.getAttribute('data-lado'), ve: vis(g0), dVer: demora(g0),
                 sale: aVista(g0, cx, cy), enAire: dentro(aire, aVista(g0, cx, cy)), fin: fin, r: Math.hypot(q[0] - fin[0], q[1] - fin[1]),
                 pulmon: cual(pulmones, 'data-pulmon', fin), pierna: cual(piernas, 'data-pierna', fin),
                 tramos: [1, 2, 3, 4].map(function (t) {
                   var g = g0.querySelector('[data-tramo="' + t + '"]'), p = aVista(g, cx, cy);
                   return { p: p, d: demora(g), pulmon: cual(pulmones, 'data-pulmon', p), pierna: cual(piernas, 'data-pierna', p) };
                 }) };
      }),
      relojes: { ve: vis(uno('[data-relojes]')) },
      agujas: todos('[data-aguja]').map(function (a) {
        return { k: a.getAttribute('data-aguja'), c: aVista(a, +a.getAttribute('x1'), +a.getAttribute('y1')),
                 p: aVista(a, +a.getAttribute('x2'), +a.getAttribute('y2')), d: demora(a) };
      }),
      hilos: todos('[data-hilo]').map(function (l) {
        return { k: l.getAttribute('data-hilo'), a: aVista(l, +l.getAttribute('x1'), +l.getAttribute('y1')), b: aVista(l, +l.getAttribute('x2'), +l.getAttribute('y2')) };
      }),
      rotulos: todos('[data-rotulo]').map(function (t) {
        var g = t.closest('[data-reloj]');
        return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: caja(t), reloj: g ? g.getAttribute('data-reloj') : '' };
      }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  window.__amExtra.amFrascos = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel) { return raiz.querySelector(sel); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function demora(el) { return parseFloat(el.style.getPropertyValue('--d')) || 0; }
    /* ¿Cae el punto (de la vista) dentro de lo pintado de la panza? Se le
       pregunta al navegador, en las coordenadas de la panza. */
    var panza = uno('[data-panza]');
    function dentro(p) {
      var q = svg.createSVGPoint(); q.x = p[0]; q.y = p[1];
      return panza.isPointInFill(q.matrixTransform(m(panza).inverse()));
    }
    /* Lo dibujado en un plato: cada pieza con su clase (qué alimento es) y
       su caja. */
    function comida(sel) {
      return todos(sel + ' *').filter(function (e) { return e.tagName.toLowerCase() !== 'g' && e.getAttribute('class'); })
        .map(function (e) { return { clase: e.getAttribute('class').split(' ')[0], caja: caja(e) }; });
    }
    var raya = uno('[data-raya-llena]'), llena = uno('[data-llena]');
    return {
      kenia: caja(uno('[data-kenia]')), cabeza: caja(uno('[data-cabeza]')), panza: caja(panza), plato: caja(uno('[data-plato]')),
      comidaA: { ve: vis(uno('[data-comida="kenia"]')), d: demora(uno('[data-comida="kenia"]')), cosas: comida('[data-comida="kenia"]') },
      comidaB: { ve: vis(uno('[data-comida-va]')), sale: vis(uno('[data-comida="otro"]')), d: demora(uno('[data-comida-va]')), cosas: comida('[data-comida-va]') },
      boca: caja(uno('[data-boca]')),
      bocados: todos('[data-bocado]').map(function (g) {
        var c = g.querySelector('circle'), h = g.querySelector('[data-baja]'), cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), r = +c.getAttribute('r');
        var p = aVista(c, cx, cy), q = aVista(c, cx + r, cy), rr = Math.hypot(q[0] - p[0], q[1] - p[1]);
        /* pasa: adónde lo lleva solo la envoltura de fuera (el primer tramo). */
        return { cual: g.getAttribute('data-bocado'), de: g.getAttribute('data-de'), ve: vis(g), c: p, r: rr, d: demora(g), d2: demora(h),
                 pasa: aVista(g, cx, cy), clase: c.getAttribute('class'), sale: aVista(g.parentNode, cx, cy),
                 enPanza: [p, [p[0] + rr, p[1]], [p[0] - rr, p[1]], [p[0], p[1] + rr], [p[0], p[1] - rr]].every(dentro) };
      }),
      llena: { ve: vis(llena), d: demora(llena), y: aVista(raya, +raya.getAttribute('x1'), +raya.getAttribute('y1'))[1],
               x0: aVista(raya, +raya.getAttribute('x1'), +raya.getAttribute('y1'))[0], x1: aVista(raya, +raya.getAttribute('x2'), +raya.getAttribute('y2'))[0] },
      frascos: [0, 1, 2, 3].map(function (f) {
        var v = uno('[data-vacio="' + f + '"]');
        return { f: f, caja: caja(uno('[data-frasco="' + f + '"]')),
                 etiqueta: todos('[data-etiqueta="' + f + '"]').map(function (t) { return { dice: t.textContent, caja: caja(t), ve: vis(t) }; }),
                 vacio: { ve: vis(v), caja: caja(v), dice: v.textContent, d: demora(v) } };
      }),
      rotulos: todos('[data-rotulo]').map(function (t) { return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: caja(t) }; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  window.__amExtra.amReloj = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel) { return raiz.querySelector(sel); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function demora(el) { return parseFloat(el.style.getPropertyValue('--d')) || 0; }
    /* Sin expresiones regulares: esto vive en una plantilla de texto y ahí
       las barras se pierden. */
    function giro(el) { var t = el.style.transform || '', i = t.indexOf('rotate('); return i < 0 ? 0 : parseFloat(t.slice(i + 7)); }
    function recorrido(path, n) {
      var L = path.getTotalLength(), out = [];
      for (var i = 0; i <= n; i++) { var q = path.getPointAtLength(L * i / n); out.push(aVista(path, q.x, q.y)); }
      return out;
    }
    /* Un camino: sus tramos, si cada uno está dibujado (la raya corrida a
       cero), cuándo arranca cada uno y si el camino entero se ve. */
    function camino(g) {
      return {
        k: g.getAttribute('data-orden') || g.getAttribute('data-cable'), ve: vis(g),
        tramos: [].slice.call(g.querySelectorAll('[data-tramo]')).map(function (t) {
          var cs = getComputedStyle(t);
          return { pts: recorrido(t, 12), dibujado: Math.abs(parseFloat(cs.strokeDashoffset) || 0) < 1, demora: demora(t),
                   rapido: t.classList.contains('se-rapido') };
        })
      };
    }
    var esf = uno('[data-esfera]'), ce = aVista(esf, +esf.getAttribute('cx'), +esf.getAttribute('cy')),
        rb = aVista(esf, +esf.getAttribute('cx') + +esf.getAttribute('r'), +esf.getAttribute('cy'));
    var ag = uno('[data-punta-aguja]');
    var raya = uno('[data-raya]');
    var boca = todos('[data-cara] .se-boca').filter(vis)[0];
    return {
      cabeza: caja(uno('[data-cabeza]')), vestido: caja(uno('[data-cuerpo]')),
      mano: caja(uno('[data-mano]')), mano2: caja(uno('[data-mano2]')),
      hombro: recorrido(uno('[data-cable="brazo"] [data-tramo]'), 1)[0],
      brazo: { d: demora(uno('[data-brazo]')) },
      glandula: caja(uno('[data-glandula]')), brillo: vis(uno('[data-brillo]')),
      corazon: caja(uno('[data-corazon]')),
      cables: todos('[data-cable]').map(camino), ordenes: todos('[data-orden]').map(camino),
      nombres: vis(uno('[data-nombres]')),
      reloj: { ve: vis(uno('[data-reloj]')), c: ce, r: Math.hypot(rb[0] - ce[0], rb[1] - ce[1]),
               marca: aVista(uno('[data-marca]'), 0, 0),
               giro1: giro(uno('[data-aguja]')), giro2: giro(uno('[data-aguja2]')),
               d1: demora(uno('[data-aguja]')), d2: demora(uno('[data-aguja2]')),
               punta: aVista(ag, +ag.getAttribute('x2'), +ag.getAttribute('y2')) },
      barra: { ve: vis(uno('[data-barra]')), tubo: caja(uno('[data-tubo]')),
               raya: { y: aVista(raya, +raya.getAttribute('x1'), +raya.getAttribute('y1'))[1],
                       x0: aVista(raya, +raya.getAttribute('x1'), +raya.getAttribute('y1'))[0], x1: aVista(raya, +raya.getAttribute('x2'), +raya.getAttribute('y2'))[0],
                       corta: getComputedStyle(raya).strokeDasharray !== 'none' },
               celdas: [1, 2, 3, 4, 5, 6, 7, 8].map(function (k) {
                 var ps = todos('[data-celda="' + k + '"]');
                 return { k: k, caja: caja(ps[0]), ve: ps.some(vis), piezas: ps.map(function (q) { return { ve: vis(q), d: demora(q) }; }) };
               }) },
      toma: { sale: vis(uno('[data-toma="sale"]')), dSale: demora(uno('[data-toma="sale"]')),
              va: vis(uno('[data-toma-va]')), dVa: demora(uno('[data-toma-va]')),
              dViaja: demora(uno('[data-toma-viaja]')), c: aVista(uno('[data-toma-viaja] > g'), 0, 0) },
      olvido: { ve: vis(uno('[data-olvido]')), d: demora(uno('[data-olvido]')), c: aVista(uno('[data-olvido]'), 0, 0),
                tache: !!uno('[data-olvido] .se-tache') },
      cara: { bien: vis(uno('[data-cara="bien"]')), mal: vis(uno('[data-cara="mal"]')),
              dBien: demora(uno('[data-cara="bien"]')), dMal: demora(uno('[data-cara="mal"]')),
              gota: vis(uno('[data-cara="mal"] .se-gota')), boca: boca ? caja(boca) : null },
      rotulos: todos('[data-rotulo]').map(function (t) { return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: caja(t) }; }),
      hilos: todos('[data-nombres] .se-hilo').map(function (l) { return aVista(l, +l.getAttribute('x2'), +l.getAttribute('y2')); }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  window.__amExtra.amAtajo = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel) { return raiz.querySelector(sel); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function recorrido(path, n) {
      var L = path.getTotalLength(), out = [];
      for (var i = 0; i <= n; i++) { var q = path.getPointAtLength(L * i / n); out.push(aVista(path, q.x, q.y)); }
      return out;
    }
    /* Un camino de señal: sus tramos, si cada uno está dibujado (la raya
       corrida a cero) y la punta de la flecha. El largo se mide en la vista. */
    function senal(g) {
      var punta = g.querySelector('[data-punta]'), pd = punta ? (punta.getAttribute('d').match(/[0-9.]+/g) || []).map(Number) : null;
      return {
        k: g.getAttribute('data-senal'),
        tramos: [].slice.call(g.querySelectorAll('[data-tramo]')).map(function (t) {
          var cs = getComputedStyle(t), pts = recorrido(t, 16), L = 0;
          for (var i = 1; i < pts.length; i++) L += Math.sqrt((pts[i][0] - pts[i - 1][0]) * (pts[i][0] - pts[i - 1][0]) + (pts[i][1] - pts[i - 1][1]) * (pts[i][1] - pts[i - 1][1]));
          return { pts: pts, largo: L, dibujado: vis(t) && Math.abs(parseFloat(cs.strokeDashoffset) || 0) < 1,
                   demora: parseFloat(t.style.getPropertyValue('--d')) || 0 };
        }),
        punta: punta ? { ve: vis(punta), p: aVista(punta, pd[2], pd[3]) } : null
      };
    }
    var ce = uno('[data-cerebro]'), co = uno('[data-comal]'), me = uno('[data-medula]');
    return {
      cerebro: { c: aVista(ce, +ce.getAttribute('cx'), +ce.getAttribute('cy')), caja: caja(ce) },
      medula: [aVista(me, +me.getAttribute('x1'), +me.getAttribute('y1')), aVista(me, +me.getAttribute('x2'), +me.getAttribute('y2'))],
      cabeza: caja(uno('[data-cabeza]')), cuerpo: caja(uno('[data-cuerpo]')),
      comal: { c: aVista(co, +co.getAttribute('cx'), +co.getAttribute('cy')), arriba: aVista(co, +co.getAttribute('cx'), +co.getAttribute('cy') - +co.getAttribute('ry'))[1],
               x0: aVista(co, +co.getAttribute('cx') - +co.getAttribute('rx'), +co.getAttribute('cy'))[0], x1: aVista(co, +co.getAttribute('cx') + +co.getAttribute('rx'), +co.getAttribute('cy'))[0] },
      mano: caja(uno('[data-mano]')), musculo: caja(uno('[data-musculo]')),
      senales: todos('[data-senal]').map(senal),
      piensa: { ve: vis(uno('[data-piensa]')), caja: caja(uno('[data-piensa]')) },
      ay: { ve: vis(uno('[data-ay]')), caja: caja(uno('[data-ay]')), dice: uno('[data-dice="ay"]').textContent },
      nombres: vis(uno('[data-nombres]')),
      rotulos: todos('[data-rotulo]').map(function (t) { return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: caja(t) }; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  window.__amExtra.amCorte = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel) { return raiz.querySelector(sel); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function recorrido(path, n) {
      var L = path.getTotalLength(), out = [];
      for (var i = 0; i <= n; i++) { var q = path.getPointAtLength(L * i / n); out.push(aVista(path, q.x, q.y)); }
      return out;
    }
    /* Un camino de agua: sus tramos, si cada uno está dibujado (la raya
       corrida a cero), su ancho, y la punta de la flecha. */
    function agua(g) {
      var punta = g.querySelector('[data-punta]');
      var pd = (punta.getAttribute('d').match(/[0-9.]+/g) || []).map(Number);
      return {
        tramos: [].slice.call(g.querySelectorAll('[data-tramo]')).map(function (t) {
          var cs = getComputedStyle(t);
          return { pts: recorrido(t, 12), largo: t.getTotalLength(), dibujado: vis(t) && Math.abs(parseFloat(cs.strokeDashoffset) || 0) < 1,
                   ancho: parseFloat(cs.strokeWidth) || 0 };
        }),
        punta: { ve: vis(punta), p: aVista(punta, pd[2], pd[3]) }
      };
    }
    var sup = uno('[data-superficie]');
    return {
      superficie: recorrido(sup, 400),
      mares: todos('[data-mar]').map(function (r) { return { k: r.getAttribute('data-mar'), caja: caja(r) }; }),
      lados: todos('[data-lado]').map(function (l) { return { k: l.getAttribute('data-lado'), ve: vis(l), pts: recorrido(l, 300) }; }),
      cumbre: { ve: vis(uno('[data-cumbre]')), raya: (function () { var l = uno('[data-raya-cumbre]');
        return [aVista(l, +l.getAttribute('x1'), +l.getAttribute('y1')), aVista(l, +l.getAttribute('x2'), +l.getAttribute('y2'))]; })() },
      nombres: vis(uno('[data-nombres]')),
      rios: todos('[data-rio]').map(function (g) { var a = agua(g); a.k = g.getAttribute('data-rio'); return a; }),
      bajan: todos('[data-baja]').map(function (g) { var a = agua(g); a.k = g.getAttribute('data-baja'); return a; }),
      crecido: agua(uno('[data-crecido]')),
      trozo: { ve: vis(uno('[data-trozo]')), pts: recorrido(uno('[data-trozo]'), 20) },
      escuela: caja(uno('[data-escuela]')),
      radio: { ve: vis(uno('[data-radio]')), caja: caja(uno('[data-radio]')) },
      nubeArriba: { ve: vis(uno('[data-nube="arriba"]')), caja: caja(uno('[data-nube="arriba"]')) },
      gotas: todos('[data-gota-cae]').map(function (g) { return { k: g.getAttribute('data-gota-cae'), ve: vis(g), caja: caja(g) }; }),
      tormenta: { ve: vis(uno('[data-tormenta]')), caja: caja(uno('[data-tormenta] .gh-nube')),
        lluvia: todos('[data-lluvia]').map(function (l) { return [aVista(l, +l.getAttribute('x1'), +l.getAttribute('y1')), aVista(l, +l.getAttribute('x2'), +l.getAttribute('y2'))]; }) },
      largos: vis(uno('[data-largos]')),
      dudas: todos('[data-duda]').map(function (t) { return { k: t.getAttribute('data-duda'), ve: vis(t), dice: t.textContent, caja: caja(t) }; }),
      rotulos: todos('[data-rotulo]').map(function (t) { return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: caja(t) }; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  window.__amExtra.amVuelta = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel) { return raiz.querySelector(sel); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    /* Un círculo en la vista: su centro, y el radio medido hasta un punto
       del borde (la Tierra va dentro de dieciséis capas que giran). */
    function circulo(c) {
      var cx = +c.getAttribute('cx'), cy = +c.getAttribute('cy'), r = +c.getAttribute('r');
      var p = aVista(c, cx, cy), q = aVista(c, cx + r, cy);
      return { c: p, r: Math.sqrt((q[0] - p[0]) * (q[0] - p[0]) + (q[1] - p[1]) * (q[1] - p[1])) };
    }
    function linea(l) {
      return { a: aVista(l, +l.getAttribute('x1'), +l.getAttribute('y1')), b: aVista(l, +l.getAttribute('x2'), +l.getAttribute('y2')) };
    }
    var tierra = uno('[data-tierra-bola]');
    return {
      sol: circulo(uno('[data-sol-bola]')), rayosSol: todos('[data-sol] line').map(linea),
      camino: circulo(uno('[data-camino]')),
      rayas: todos('[data-raya-mes]').map(function (l) { var q = linea(l); q.i = +l.getAttribute('data-raya-mes'); return q; }),
      meses: todos('[data-mes]').map(function (t) { return { i: +t.getAttribute('data-mes'), dice: t.textContent, ve: vis(t), caja: caja(t) }; }),
      /* La forma de cada marca se lee del dibujo, no de su nombre: una gota
         es un trazo solo; un sol, un círculo con sus ocho rayitos. */
      marcas: todos('[data-marca]').map(function (g) {
        var tag = g.tagName.toLowerCase();
        var forma = tag === 'path' ? 'gota' : tag === 'g' && g.querySelectorAll('circle').length === 1 && g.querySelectorAll('line').length === 8 ? 'sol' : 'otra';
        return { i: +g.getAttribute('data-marca'), ve: vis(g), forma: forma, caja: caja(g) };
      }),
      tierra: circulo(tierra), tierraVe: vis(tierra),
      marco: caja(uno('[data-marco]')), suelo: caja(uno('[data-suelo-parcela]')),
      nube: { ve: vis(uno('[data-nube]')), caja: caja(uno('[data-nube]')) },
      lluvia: { ve: vis(uno('[data-gotas]')), lineas: todos('[data-gota]').map(linea) },
      brotes: { ve: vis(uno('[data-brotes]')), caja: caja(uno('[data-brotes]')) },
      milpa: { ve: vis(uno('[data-milpa]')), caja: caja(uno('[data-milpa]')), mazorcas: uno('[data-milpa]').querySelectorAll('ellipse').length,
               tallos: uno('[data-milpa]').querySelectorAll('.uv-tallo').length },
      rotulos: todos('[data-rotulo]').map(function (t) { return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: caja(t) }; }),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
    };
  };
  window.__amExtra.amCaracol = function (raiz) {
    var vis = window.__amVisible;
    var svg = raiz.querySelector('svg'), base = svg.getScreenCTM().inverse();
    function m(el) { return base.multiply(el.getScreenCTM()); }
    function aVista(el, x, y) { var p = svg.createSVGPoint(); p.x = x; p.y = y; var q = p.matrixTransform(m(el)); return [q.x, q.y]; }
    function caja(el) {
      var b = el.getBBox();
      var ps = [[b.x, b.y], [b.x + b.width, b.y], [b.x, b.y + b.height], [b.x + b.width, b.y + b.height]].map(function (p) { return aVista(el, p[0], p[1]); });
      var xs = ps.map(function (p) { return p[0]; }), ys = ps.map(function (p) { return p[1]; });
      return { x0: Math.min.apply(null, xs), y0: Math.min.apply(null, ys), x1: Math.max.apply(null, xs), y1: Math.max.apply(null, ys) };
    }
    function uno(sel) { return raiz.querySelector(sel); }
    function todos(sel) { return [].slice.call(raiz.querySelectorAll(sel)); }
    function puntos(poly) {
      return poly.getAttribute('points').split(' ').filter(Boolean).map(function (t) { var p = t.split(','); return aVista(poly, +p[0], +p[1]); });
    }
    /* ¿En qué capa cae un punto de la vista? Se pregunta a la roca de cada
       capa encendida, en SUS coordenadas: están dentro del bloque que sube. */
    function capaEn(px, py) {
      var gs = todos('[data-capa]').filter(vis);
      for (var i = 0; i < gs.length; i++) {
        var roca = gs[i].querySelector('[data-roca]'), q = svg.createSVGPoint();
        q.x = px; q.y = py;
        if (roca.isPointInFill(q.matrixTransform(m(roca).inverse()))) return gs[i].getAttribute('data-capa');
      }
      return null;
    }
    function dD(el) { return parseFloat(el.style.getPropertyValue('--d')) || 0; }
    var capas = todos('[data-capa]').map(function (g) {
      var roca = g.querySelector('[data-roca]'), lodo = g.querySelector('[data-lodo]');
      return { k: g.getAttribute('data-capa'), ve: vis(g), pts: puntos(roca), lodo: !!lodo && vis(lodo), dLodo: lodo ? dD(lodo) : null,
               vetas: g.querySelectorAll('.er-veta').length, d: dD(g),
               lodoOpaco: lodo ? parseFloat(getComputedStyle(lodo).fillOpacity) : null };
    });
    var ola = uno('[data-ola]'), marY = aVista(ola, 0, +ola.getAttribute('data-y'))[1];
    /* La costa: donde el lado del cerro que da al mar cruza el agua. */
    var c1 = capas.filter(function (c) { return c.k === 'c1'; })[0];
    var der = c1.pts.slice().sort(function (a, b) { return b[0] - a[0]; }).slice(0, 2).sort(function (a, b) { return a[1] - b[1]; });
    var yc = marY + 8, xc = der[0][0] + (der[1][0] - der[0][0]) * (yc - der[0][1]) / (der[1][1] - der[0][1]);
    var cg = uno('[data-caracol]'), piedra = uno('[data-piedra]'), concha = uno('[data-concha]');
    var fl = uno('[data-flecha]'), raya = fl.querySelector('[data-raya]');
    var gb = uno('[data-punta-globo]');
    return {
      capas: capas,
      mar: { y: marY, costa: { x: xc, y: yc, izq: capaEn(xc - 8, yc), der: capaEn(xc + 8, yc) } },
      /* La concha es un círculo: se mide el círculo, no su caja, que al
         girar el caracol crece por las esquinas y «se hunde» en el suelo. */
      caracol: (function () {
        var sh = vis(piedra) ? piedra : concha, ci = sh.querySelector('circle');
        return { base: aVista(cg, 0, 0), cuerpo: vis(uno('[data-cuerpo]')), concha: vis(concha), piedra: vis(piedra), caja: caja(sh),
                 centro: aVista(ci, +ci.getAttribute('cx'), +ci.getAttribute('cy')), radio: +ci.getAttribute('r') };
      })(),
      matas: todos('[data-mata]').map(function (g) { return { ve: vis(g), base: aVista(g, 0, 0), caja: caja(g) }; }),
      tulio: { ve: vis(uno('[data-tulio]')), caja: caja(uno('[data-tulio]')) },
      arado: { ve: vis(uno('[data-arado]')), reja: caja(uno('[data-reja]')) },
      surco: { ve: vis(uno('[data-surco]')), caja: caja(uno('[data-surco]')) },
      suelo: { ve: vis(uno('[data-suelo]')), caja: caja(uno('[data-suelo]')) },
      globo: { ve: vis(uno('[data-globo]')), punta: aVista(gb, +gb.getAttribute('cx'), +gb.getAttribute('cy')) },
      flecha: { ve: vis(fl), a: aVista(raya, +raya.getAttribute('x1'), +raya.getAttribute('y1')), b: aVista(raya, +raya.getAttribute('x2'), +raya.getAttribute('y2')),
                punta: caja(fl.querySelector('[data-punta]')) },
      llave: { ve: vis(uno('[data-llave]')), caja: caja(uno('[data-llave]')) },
      rotulos: todos('[data-rotulo]').map(function (t) {
        var c = caja(t), cx = (c.x0 + c.x1) / 2, cy = (c.y0 + c.y1) / 2;
        return { k: t.getAttribute('data-rotulo'), ve: vis(t), dice: t.textContent, caja: c, capa: capaEn(cx, cy) };
      }),
      reloj: todos('[data-reloj]').filter(vis).map(function (t) { return t.getAttribute('data-reloj'); }),
      telon: vis(uno('[data-telon]')), nube: vis(uno('[data-nube]')),
      textos: todos('text').filter(vis).map(function (t) { return t.textContent; })
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
let escalaGallinero = null;
let raizVerbos = null;
let keniaAdverbios = null;
let mensajePron = null;
let chelePrecio = null;
let aguaDN = { normal: null, llena: null };
let caracolER = { x: null, mar: null, tops: null };
const FIN_ER = 6;
/* Áreas Protegidas: lo que se mide en un paso y se usa en los siguientes
   (el agua que guardó cada cerro y lo que se lleva la toma en un mes). */
let tomaAP = { a0: null, mes: null };
/* Los Cinco Reinos: dónde quedó la boca del chapulín (paso 2) y cuánto
   tapaban las manchas antes del veneno (paso 3). */
let bocaVeneno = null, cubreVeneno = null;
/* Los Ecosistemas: dónde estaban el pollo y la rata que se lleva el gavilán
   antes de que se los llevara, para ver que baja justo a su lomo. */
let amarraAntes = null;
/* El área de un polígono (en la vista) que queda por debajo de un nivel:
   se recorta con la recta y se cuenta con la fórmula del cordón. */
function areaDebajo(poly, nivel) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i], q = poly[(i + 1) % poly.length];
    const pin = p[1] >= nivel, qin = q[1] >= nivel;
    if (pin) out.push(p);
    if (pin !== qin) { const t = (nivel - p[1]) / (q[1] - p[1]); out.push([p[0] + (q[0] - p[0]) * t, nivel]); }
  }
  let a = 0;
  for (let i = 0; i < out.length; i++) { const p = out[i], q = out[(i + 1) % out.length]; a += p[0] * q[1] - q[0] * p[1]; }
  return Math.abs(a) / 2;
}
function enPoligono(poly, pt) {
  let dentro = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) dentro = !dentro;
  }
  return dentro;
}
/* La altura de la superficie de un contorno en una x: la más alta de las
   veces que el contorno pasa por esa x. */
function superficieEn(poly, x) {
  let mejor = null;
  for (let i = 0; i < poly.length - 1; i++) {
    const p = poly[i], q = poly[i + 1];
    if ((p[0] - x) * (q[0] - x) <= 0 && p[0] !== q[0]) {
      const y = p[1] + (q[1] - p[1]) * (x - p[0]) / (q[0] - p[0]);
      if (mejor === null || y < mejor) mejor = y;
    }
  }
  return mejor;
}

const ESCENAS = {
  /* Los Cinco Reinos. «El veneno que no servía».
     ⚠️ Nada se le cree a la escena. Las mordidas se leen de la máscara y se
     comprueba que cada una muerda la orilla de la hoja de arriba; las patas
     del chapulín, que pisen esa orilla; lo que tapan las manchas se cuenta
     punto por punto sobre la hoja de don Tulio (media hoja con el veneno),
     y cada granito que se va, que se vaya a la boca del chapulín o al centro
     de una mancha. */
  amAmarra(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const monta = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
    const area = c => Math.max(0, c.x1 - c.x0) * Math.max(0, c.y1 - c.y0);
    const cruce = (a, b) => ({ x0: Math.max(a.x0, b.x0), y0: Math.max(a.y0, b.y0), x1: Math.min(a.x1, b.x1), y1: Math.min(a.y1, b.y1) });
    const enCaja = (p, c, m = 0) => p[0] >= c.x0 - m && p[0] <= c.x1 + m && p[1] >= c.y0 - m && p[1] <= c.y1 + m;
    const aCaja = (p, c) => Math.hypot(Math.max(c.x0 - p[0], 0, p[0] - c.x1), Math.max(c.y0 - p[1], 0, p[1] - c.y1));
    /* ¿La raya de a a b pasa por dentro de la caja? Se mira punto por punto. */
    const corta = (a, b, c) => { for (let i = 0; i <= 40; i++) { const t = i / 40; if (enCaja([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], c, -0.5)) return true; } return false; };
    /* Lo que no depende del dibujo, primero. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['ecosistema', 'ecosistemas', 'cadena', 'cadenas', 'red', 'redes', 'depredador', 'depredadores', 'presa', 'presas', 'cazador',
      'cazadores', 'consumidor', 'consumidores', 'productor', 'productores', 'descomponedor', 'descomponedores', 'herbívoro', 'herbívoros',
      'carnívoro', 'carnívoros', 'omnívoro', 'omnívoros', 'energía', 'sol', 'nivel', 'niveles', 'eslabón', 'eslabones', 'ecología', 'biotopo',
      'biocenosis', 'nicho', 'población', 'poblaciones', 'comunidad', 'mutualismo', 'parasitismo', 'competencia', 'hábitat', 'biosfera', 'bioma',
      'individuo', 'abiótico', 'abióticos', 'biótico', 'bióticos', 'fotosíntesis', 'casa', 'disminuye', 'baja', 'primario', 'secundario',
      'terciario', 'equilibrio', 'especie', 'especies', 'quetzal', 'manglar', 'manglares', 'garza', 'garzas', 'puma', 'venado', 'venados', 'rana',
      'halcón', 'conejo', 'conejos', 'coyote', 'coyotes', 'cabra', 'cabras', 'laguna', 'plaga', 'relación', 'relaciones'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = EXACTAS.filter(w => suelto.includes(' ' + w + ' '));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni los papeles en la cadena, ni cómo se llama el que caza, ni la red)`, malas]);
    const nums = [e.texto].concat(x.textos).map(nb).join(' ').match(/\d+/g) || [];
    r.push([nums.length === 0, `paso ${n}: ningún número en la frase ni en el dibujo`, nums]);
    const frase = nb(e.texto);
    const FR = [['hay pollos, ratas y maíz en la troja', 'Arriba anda un gavilán', '¿Qué tendrá que ver el gavilán con el maíz?'],
      ['El gavilán se lanza y se lleva un pollo', 'lo ve todo el mundo'],
      ['Lo que nadie ve', 'también se come a las ratas', 'las ratas se comen el maíz', 'Están amarrados'],
      ['espanta al gavilán', 'se va la amarra que tenía con las ratas'],
      ['Al año siguiente', 'nadie se come a las ratas', 'Se multiplican', 'se meten en la troja'],
      ['Con el gavilán se perdían pollos', 'sin él, tres cuartos de la troja', 'se cortó una amarra'],
      ['¿Y tú?', 'un animal que donde vives quieren espantar', 'a quién se come', 'dibuja sus amarras']];
    r.push([FR[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${FR[n].join(', ')})`, frase]);

    /* ── El patio y la troja ── */
    const patio = x.patio, troja = x.troja;
    r.push([x.postes.length === 3 && x.postes.every(c => Math.abs(c.y0 - troja.y1) < 0.6 && c.y1 > patio.y0 + 4 && c.y1 < patio.y1 && c.x0 >= troja.x0 - 0.5 && c.x1 <= troja.x1 + 0.5),
      `paso ${n}: la troja está sobre sus tres postes, y los postes pisan el patio`, x.postes.map(c => [Math.round(c.x0), Math.round(c.y1)])]);
    const pisaPatio = p => p[1] > patio.y0 + 4 && p[1] < patio.y1 - 4 && p[0] > patio.x0 + 2 && p[0] < patio.x1 - 2;

    /* ── Las mazorcas: ocho en la troja; al año siguiente, seis comidas ── */
    const maz = x.mazorcas.filter(q => q.ve), hue = x.huecosMaz.filter(q => q.ve);
    r.push([x.mazorcas.length === 8 && x.mazorcas.every(q => enCaja(q.c, troja)) && x.mazorcas.every(q => q.caja.x0 >= troja.x0 - 0.5 && q.caja.x1 <= troja.x1 + 0.5),
      `paso ${n}: las ocho mazorcas caben en la troja`, x.mazorcas.map(q => q.caja.x1)]);
    const comidas = n >= 4 ? 6 : 0;
    r.push([maz.length === 8 - comidas && hue.length === comidas, `paso ${n}: mazorcas enteras ${8 - comidas} y comidas ${comidas}`, [maz.length, hue.length]]);
    r.push([hue.every(h => x.mazorcas.some(q => dist(q.c, h.c) < 0.6)) && maz.every(q => !hue.some(h => dist(q.c, h.c) < 0.6)),
      `paso ${n}: cada mazorca comida deja su hueco de raya cortada justo donde estaba`]);
    if (n >= 4) {
      const yEnteras = maz.map(q => q.c[1]), yComidas = hue.map(h => h.c[1]);
      r.push([Math.min(...yEnteras) > Math.max(...yComidas), `paso ${n}: las que quedan son las de abajo (las ratas entran por arriba)`, { yEnteras, yComidas }]);
    }

    /* ── Las ratas ── */
    const ratas = x.ratas.filter(q => q.ve);
    const esperaR = n <= 1 ? 3 : n <= 3 ? 2 : 10;
    r.push([ratas.length === esperaR, `paso ${n}: se ven ${esperaR} ratas`, ratas.length]);
    const dentroR = ratas.filter(q => q.donde === 'dentro'), fueraR = ratas.filter(q => q.donde === 'fuera');
    r.push([dentroR.every(q => q.caja.x0 >= troja.x0 - 0.5 && q.caja.x1 <= troja.x1 + 0.5 && q.caja.y0 >= troja.y0 - 0.5 && q.caja.y1 <= troja.y1 + 0.5),
      `paso ${n}: las ratas de adentro están dentro de la troja`, dentroR.map(q => [Math.round(q.caja.x0), Math.round(q.caja.x1), Math.round(q.caja.y0), Math.round(q.caja.y1)])]);
    r.push([fueraR.every(q => pisaPatio(q.pisa)), `paso ${n}: las ratas de afuera pisan el patio`, fueraR.map(q => q.pisa.map(v => Math.round(v)))]);
    if (n >= 4) r.push([dentroR.length === 5 && fueraR.length === 5, 'al año siguiente, cinco ratas dentro de la troja y cinco afuera', [dentroR.length, fueraR.length]]);
    if (n === 4) {
      const nuevas = x.ratas.filter(q => q.ve && (q.donde === 'dentro' || q.dVer > 0)).map(q => q.dVer).filter(d => d > 0);
      r.push([nuevas.length === 8 && new Set(nuevas).size === 8 && Math.min(...nuevas) >= 300, 'paso 4: las ocho ratas nuevas llegan una por una, no todas de golpe', nuevas]);
    }

    /* ── Los pollos ── */
    const pollos = x.pollos.filter(q => q.ve);
    const esperaP = n === 0 ? 4 : 3;
    r.push([pollos.length === esperaP, `paso ${n}: se ven ${esperaP} pollos`, pollos.length]);
    r.push([pollos.every(q => pisaPatio(q.pisa)), `paso ${n}: los pollos pisan el patio`, pollos.map(q => q.pisa.map(v => Math.round(v)))]);
    const hp = x.huecoPollo;
    r.push([hp.length === 1 && hp[0].ve === (n >= 1), `paso ${n}: ${n >= 1 ? 'donde estaba el pollo que se llevó queda su silueta de raya cortada' : 'todavía no falta ningún pollo'}`]);

    /* ── Nadie se monta en nadie: se mide cuánto se tapan dos animales ── */
    const cuerpos = ratas.filter(q => q.donde === 'fuera').map((q, i) => ({ k: 'rata' + i, c: q.caja })).concat(pollos.map((q, i) => ({ k: 'pollo' + i, c: q.caja })))
      .concat(x.persona.ve ? [{ k: 'persona', c: x.persona.caja }] : []);
    const tapados = [];
    cuerpos.forEach((p, i) => cuerpos.slice(i + 1).forEach(q => {
      const t = area(cruce(p.c, q.c)) / Math.min(area(p.c), area(q.c));
      if (monta(p.c, q.c) && t > 0.12) tapados.push(p.k + '/' + q.k + ' ' + Math.round(t * 100) + '%');
    }));
    r.push([tapados.length === 0, `paso ${n}: ningún animal del patio tapa a otro`, tapados]);

    /* ── El gavilán: arriba, y baja justo al lomo de lo que se lleva ── */
    const g = x.gavilan;
    r.push([g.ve === (n <= 2), `paso ${n}: el gavilán ${n <= 2 ? 'está' : 'ya no está'}`]);
    if (n <= 2) r.push([g.caja.y1 < patio.y0 - 60 && g.caja.x0 > 0 && g.caja.x1 < patio.x1, `paso ${n}: el gavilán vuela arriba, dentro del dibujo`, g.caja]);
    if (n === 0) amarraAntes = { pollo: x.pollos.map(q => q.lomo), rata: x.ratas.map(q => q.lomo), patas: g.patas };
    const vuelo = k => g.vuelos.find(v => v.k === k) || { t: [0, 0], d: 0 };
    const presa = (lista, antes, i) => ({ q: lista[i], antes: antes[i] });
    if ((n === 1 || n === 2) && amarraAntes) {
      const cual = n === 1 ? 'pollo' : 'rata';
      const lista = n === 1 ? x.pollos : x.ratas;
      const idx = lista.findIndex(q => !q.ve && Math.hypot(q.mueve[0], q.mueve[1]) > 1);
      const pr = idx >= 0 ? presa(lista, amarraAntes[cual], idx) : null;
      const baja = vuelo(cual + '-baja'), sube = vuelo(cual + '-sube');
      r.push([!!pr, `paso ${n}: hay un${n === 1 ? ' pollo' : 'a rata'} que se llevó`]);
      if (pr) {
        const abajo = [amarraAntes.patas[0] + baja.t[0], amarraAntes.patas[1] + baja.t[1]];
        r.push([dist(abajo, pr.antes) < 1, `paso ${n}: el gavilán baja con las patas justo al lomo de${n === 1 ? 'l pollo' : ' la rata'}`, { patas: abajo.map(v => Math.round(v)), lomo: pr.antes.map(v => Math.round(v)) }]);
        r.push([Math.abs(pr.q.mueve[0] - sube.t[0]) < 0.6 && Math.abs(pr.q.mueve[1] - sube.t[1]) < 0.6 && Math.abs(pr.q.dMueve - sube.d) < 1 && sube.d >= 600,
          `paso ${n}: lo que se lleva sube con él, por el mismo camino y al mismo tiempo`, { presa: pr.q.mueve, sube: sube.t, dPresa: pr.q.dMueve, dSube: sube.d }]);
        r.push([pr.q.dVer >= sube.d + 800, `paso ${n}: se apaga cuando ya llegó arriba, no en el camino`, [pr.q.dVer, sube.d]]);
        r.push([dist(pr.q.lomo, g.patas) < 1, `paso ${n}: al final del paso está en las patas del gavilán`, dist(pr.q.lomo, g.patas)]);
        if (n === 1) r.push([hp[0] && dist(hp[0].pisa, x.pollos[idx].pisa.map((v, j) => v - x.pollos[idx].mueve[j])) < 0.6 && Math.abs(hp[0].d - sube.d) < 1,
          'paso 1: la silueta queda donde estaba el pollo, cuando el gavilán lo levanta', hp[0] && hp[0].d]);
      }
    }
    if (n === 3) r.push([g.va[0] > 100 && g.va[1] < -60 && g.dVer > g.dVa, 'paso 3: el gavilán se va volando hacia arriba, y se apaga ya en el camino', { va: g.va, dVa: g.dVa, dVer: g.dVer }]);

    /* ── Las amarras ── */
    const am = k => x.amarras.find(q => q.k === k);
    const aP = am('pollos'), aR = am('ratas'), aM = am('maiz');
    r.push([aP.ve === (n === 2) && aR.ve === (n === 2) && aM.ve === (n >= 2), `paso ${n}: ${n === 2 ? 'se ven las tres amarras' : n >= 3 ? 'solo queda la amarra de las ratas con el maíz' : 'todavía no se ve ninguna amarra'}`, [aP.ve, aR.ve, aM.ve]]);
    const nudos = q => q.nudos.length === 2 && dist(q.nudos[0], q.a) < 0.6 && dist(q.nudos[1], q.b) < 0.6;
    r.push([[aP, aR, aM].every(nudos), `paso ${n}: cada amarra lleva un nudo en cada punta`]);
    if (n === 2) {
      const pollosAm = pollos.filter(q => dist(aP.b, q.lomo) < 4.5), ratasAm = fueraR.filter(q => dist(aR.b, q.lomo) < 4.5);
      r.push([dist(aP.a, g.patas) < 8 && pollosAm.length === 1, 'paso 2: una amarra va de las patas del gavilán al lomo de un pollo de los que quedan', { a: dist(aP.a, g.patas), b: pollosAm.length }]);
      r.push([dist(aR.a, g.patas) < 8 && ratasAm.length === 1, 'paso 2: otra va de las patas del gavilán al lomo de una rata', { a: dist(aR.a, g.patas), b: ratasAm.length }]);
      r.push([aR.a[0] < aP.a[0], 'paso 2: la de las ratas sale del lado de las ratas y la de los pollos, del lado de los pollos', [aR.a, aP.a]]);
      const dRata = Math.max(...x.ratas.map(q => q.dVer)), dArriba = vuelo('rata-sube').d + 800;
      r.push([aP.d === aR.d && aR.d === aM.d && aM.d >= dArriba, 'paso 2: las amarras aparecen cuando el gavilán ya volvió arriba con la rata', { d: aM.d, arriba: dArriba, rata: dRata }]);
    }
    if (n === 3) r.push([Math.abs(aP.d - g.dVa) < 1 && Math.abs(aR.d - g.dVa) < 1, 'paso 3: las dos amarras del gavilán se van cuando él se va', { amarras: [aP.d, aR.d], va: g.dVa }]);
    if (n >= 2) {
      const bocas = ratas.filter(q => q.boca && dist(aM.a, q.boca) < 1);
      r.push([bocas.length === 1 && bocas[0].donde === 'fuera', `paso ${n}: la amarra del maíz sale de la boca de una rata del patio`, bocas.length]);
      r.push([Math.abs(aM.b[0] - troja.x1) < 2 && aM.b[1] > troja.y0 + 5 && aM.b[1] < troja.y1 - 5, `paso ${n}: y llega a la troja, por su lado`, aM.b]);
    }

    /* ── La persona que espanta al gavilán ── */
    r.push([x.persona.ve === (n === 3), `paso ${n}: ${n === 3 ? 'la persona espanta al gavilán' : 'no hay nadie espantando'}`]);
    if (n === 3) r.push([pisaPatio(x.persona.pisa) && x.persona.caja.x1 <= patio.x1 + 0.5, 'paso 3: la persona pisa el patio, dentro del dibujo', x.persona.pisa]);

    /* ── Los rótulos ── */
    const rot = k => x.rotulos.find(q => q.k === k) || {};
    const DEBEN = { 'amarra-pollos': [n === 2, 'se lleva pollos'], 'amarra-ratas': [n === 2, 'se come ratas'], 'amarra-maiz': [n >= 2, 'se comen el maíz'],
      fuera: [n === 3, '¡Fuera!'], anio: [n >= 4, 'al año siguiente'], sin: [n >= 5, 'sin el gavilán'], con: [n >= 5, 'con el gavilán'] };
    Object.keys(DEBEN).forEach(k => {
      const q = rot(k), [debe, dice] = DEBEN[k];
      r.push([q.ve === debe && (!q.ve || nb(q.dice) === dice), `paso ${n}: el rótulo «${dice}» ${debe ? 'se ve' : 'no se ve'}`, [q.ve, q.dice]]);
    });
    const vis = x.rotulos.filter(q => q.ve);
    r.push([vis.every(q => q.caja.x0 >= 0 && q.caja.x1 <= patio.x1 && q.caja.y0 >= 0 && q.caja.y1 <= patio.y1), `paso ${n}: todos los rótulos caben en el dibujo`, vis.map(q => [q.k, Math.round(q.caja.x0), Math.round(q.caja.x1)])]);
    if (n === 2) {
      const cx = (g.caja.x0 + g.caja.x1) / 2, rp = rot('amarra-pollos'), rr = rot('amarra-ratas'), rm = rot('amarra-maiz');
      r.push([rr.caja.x1 < cx && rp.caja.x0 > cx && rr.caja.y1 > g.caja.y0 && rp.caja.y1 > g.caja.y0 && rr.caja.y0 < g.caja.y1 + 4 && rp.caja.y0 < g.caja.y1 + 4,
        'paso 2: «se come ratas» y «se lleva pollos» van a los lados del gavilán, cada uno del lado de su amarra', { r: rr.caja, p: rp.caja }]);
      const dSoga = Math.min(...[0, 0.25, 0.5, 0.75, 1].map(t => aCaja([aM.a[0] + (aM.b[0] - aM.a[0]) * t, aM.a[1] + (aM.b[1] - aM.a[1]) * t], rm.caja)));
      r.push([dSoga < 16 && !corta(aM.a, aM.b, rm.caja), 'paso 2: «se comen el maíz» va junto a su amarra, sin taparla', Math.round(dSoga * 10) / 10]);
    }
    if (n === 3) {
      const rf = rot('fuera');
      r.push([rf.caja.x1 < x.persona.pisa[0] && aCaja(x.persona.vara, rf.caja) < 12, 'paso 3: «¡Fuera!» lo grita la persona: va junto a su vara', aCaja(x.persona.vara, rf.caja)]);
    }
    if (n >= 5) {
      const rs = rot('sin'), rc = rot('con'), cxs = (rs.caja.x0 + rs.caja.x1) / 2;
      r.push([Math.abs(cxs - (troja.x0 + troja.x1) / 2) < 8 && rs.caja.y1 < troja.y0 - 20, `paso ${n}: «sin el gavilán» va encima de la troja`, { cx: cxs, y1: rs.caja.y1 }]);
      const [ga, gb] = x.guia.ab;
      r.push([x.guia.ve && aCaja(ga, rc.caja) < 6 && hp[0] && aCaja(gb, hp[0].caja) < 1.5 && !pollos.some(q => corta(ga, gb, q.caja)),
        `paso ${n}: «con el gavilán» señala con su raya la silueta del pollo que se llevó, sin pasar por otro pollo`, { a: aCaja(ga, rc.caja), b: hp[0] && aCaja(gb, hp[0].caja) }]);
    } else r.push([!x.guia.ve, `paso ${n}: todavía no se señala lo que se perdió`]);
    /* Ningún rótulo se monta en otro, ni en un animal, ni lo cruza una amarra. */
    const montados = [];
    vis.forEach((p, i) => vis.slice(i + 1).forEach(q => { if (monta(p.caja, q.caja)) montados.push(p.k + '/' + q.k); }));
    const animales = cuerpos.map(c => c.c).concat(ratas.filter(q => q.donde === 'dentro').map(q => q.caja));
    vis.forEach(p => { if (animales.some(c => monta(p.caja, c))) montados.push(p.k + '/animal'); if (p.tocaGav) montados.push(p.k + '/gavilán'); });
    x.amarras.filter(q => q.ve).forEach(q => vis.forEach(p => { if (corta(q.a, q.b, p.caja)) montados.push(p.k + '/amarra-' + q.k); }));
    r.push([montados.length === 0, `paso ${n}: ningún rótulo se monta en otro, en un animal ni en una amarra`, montados]);

    /* ── El marcador dice lo que se ve ── */
    const cifra = nb(e.cifra);
    const MAR = [String(pollos.length), String(pollos.length), String(ratas.length), String(x.gavilan.ve ? 1 : 0), String(ratas.length),
      hue.length * 4 === 3 * x.mazorcas.length ? '¾' : '·', '?'];
    r.push([cifra === MAR[n], `paso ${n}: el marcador dice lo que se ve (${MAR[n]})`, cifra]);
    return r;
  },
  amVeneno(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/\u00a0/g, ' ').trim();
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const monta = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
    const dentroCaja = (c, d) => c.x0 >= d.x0 - 0.5 && c.x1 <= d.x1 + 0.5 && c.y0 >= d.y0 - 0.5 && c.y1 <= d.y1 + 0.5;
    /* Lo que no depende del dibujo, primero. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['fotosíntesis', 'clorofila', 'cloroplasto', 'cloroplastos', 'autótrofo', 'autótrofos', 'autótrofa', 'autótrofas',
      'heterótrofo', 'heterótrofos', 'heterótrofa', 'heterótrofas', 'eucariota', 'eucariotas', 'procariota', 'procariotas', 'célula', 'células',
      'unicelular', 'unicelulares', 'pluricelular', 'pluricelulares', 'quitina', 'celulosa', 'pared', 'fungi', 'plantae', 'animalia', 'monera',
      'protista', 'protistas', 'taxonomía', 'taxón', 'especie', 'especies', 'linneo', 'whittaker', 'descomponedor', 'descomponedores', 'moho',
      'mohos', 'levadura', 'levaduras', 'champiñón', 'champiñones', 'bacteria', 'bacterias', 'ameba', 'amebas', 'alga', 'algas', 'vertebrado',
      'vertebrados', 'invertebrado', 'invertebrados', 'columna', 'oxígeno', 'color', 'verde', 'verdes', 'absorbe', 'absorben', 'fabrica',
      'fabrican', 'alimento', 'alimentos', 'desplaza', 'desplazan', 'penicilina', 'antibiótico', 'semillas', 'parásito', 'parásitos', 'hifa',
      'hifas', 'latín', 'núcleo', 'espora', 'esporas', 'remedio', 'musgos', 'yogur', 'queso', 'caracol', 'filo', 'sapiens', 'glucosa'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = EXACTAS.filter(w => suelto.includes(' ' + w + ' '));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni cómo se llama la manera de comer, ni la pared, ni los reinos en latín, ni el color)`, malas]);
    const nums = [e.texto].concat(x.textos).map(nb).join(' ').match(/\d+/g) || [];
    r.push([nums.length === 0, `paso ${n}: ningún número en la frase ni en el dibujo`, nums]);
    const frase = nb(e.texto);
    const FR = [['Estas dos hojas de milpa están comidas', 'le pasó lo de don Tulio', '¿Se las come lo mismo?'],
      ['son de una planta', 'con la luz del sol hacen su propia comida', 'esa comida son los granitos'],
      ['un chapulín llega y se come la hoja a mordidas', 'con granitos y todo', 'El chapulín es un animal'],
      ['nadie muerde', 'no tiene boca ni patas', 'Mete hilitos en la hoja', 'le saca la comida', 'Es un hongo'],
      ['Llega el veneno para insectos', 'Al chapulín sí le hace', 'deja de comer y se cae', 'Al hongo no le hace nada', 'la mancha sigue creciendo'],
      ['Son tres reinos distintos', 'cada uno consigue su comida a su manera', 'El veneno para insectos es para un animal', 'el hongo es de otro reino'],
      ['¿Y tú?', 'qué plagas ha tenido su milpa o su huerto', 'cuáles eran animales']];
    r.push([FR[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${FR[n].join(', ')})`, frase]);

    /* ── Las dos hojas: la misma, corrida hacia abajo, y quietas ── */
    const numsD = d => (d.match(/-?\d+(\.\d+)?/g) || []).map(Number);
    const a = numsD(x.dA), b = numsD(x.dB);
    let dy = null, igual = a.length === b.length && a.length > 20;
    for (let i = 0; igual && i < a.length; i += 2) {
      if (Math.abs(a[i] - b[i]) > 0.01) igual = false;
      const d = b[i + 1] - a[i + 1];
      if (dy === null) dy = d; else if (Math.abs(d - dy) > 0.02) igual = false;
    }
    r.push([igual && dy > 40 && x.quietas, `paso ${n}: las dos hojas son la misma, la de don Tulio debajo, y no se mueven`, { dy }]);
    r.push([x.usaMascara, `paso ${n}: las mordidas son huecos de la hoja de arriba (su máscara)`]);

    /* ── Las mordidas: muerden la orilla de arriba de la hoja de arriba ── */
    const mord = x.mordidas.filter(m => m.ve);
    const malMord = mord.filter(m => !m.abajoDentro || !m.arribaFuera || m.tocaB);
    r.push([malMord.length === 0, `paso ${n}: cada mordida muerde la orilla de la hoja de arriba (una parte dentro y otra fuera)`, malMord.map(m => m.c)]);
    r.push([mord.length === (n >= 2 ? 5 : 2), `paso ${n}: se ven ${n >= 2 ? 'las dos mordidas viejas y las tres del chapulín' : 'solo las dos mordidas viejas'}`, mord.length]);
    r.push([x.mordidas.filter(m => m.tipo === 'vieja').every(m => m.ve), `paso ${n}: las mordidas viejas están siempre`]);

    /* ── Las manchas: en la hoja de don Tulio, y lo que tapan, contado ── */
    const man = x.manchas.filter(m => m.ve);
    r.push([man.length === 3 && man.every(m => m.dentro), `paso ${n}: hay tres manchas, todas en la hoja de don Tulio`, man.length]);
    const rad = man.map(m => Math.round(m.r * 10) / 10);
    if (n <= 2) r.push([rad.every(v => Math.abs(v - 5) < 0.3) && x.cubre < 0.05, `paso ${n}: las manchas todavía son chicas`, { rad, cubre: x.cubre }]);
    if (n === 3) r.push([rad.every(v => Math.abs(v - 8) < 0.3) && x.cubre < 0.12, 'paso 3: las manchas crecen un poco al meter los hilitos', { rad, cubre: x.cubre }]);
    if (n >= 4) r.push([x.cubre > 0.45 && x.cubre < 0.58 && rad.every(v => v > 18), `paso ${n}: las manchas tapan media hoja (contado punto por punto)`, { rad, cubre: Math.round(x.cubre * 1000) / 1000 }]);

    /* ── Los hilitos: salen de una mancha y no se salen de la hoja ── */
    const hil = x.hilos.filter(h => h.ve);
    r.push([hil.length === (n >= 4 ? 24 : n === 3 ? 12 : 0), `paso ${n}: ${n >= 3 ? 'se ven los hilitos del hongo' : 'todavía no se ven hilitos'}`, hil.length]);
    const sueltos = hil.filter(h => !man.some(m => dist(h.pts[0], m.c) < 1));
    r.push([sueltos.length === 0, `paso ${n}: cada hilito sale del centro de una mancha`, sueltos.length]);
    const fuera = hil.filter(h => h.fuera > 0);
    r.push([fuera.length === 0, `paso ${n}: los hilitos van por dentro de la hoja`, fuera.length]);

    /* ── Los granitos: dentro de su hoja, nunca en una mordida ni en una
       mancha; los que se van, a la boca o a una mancha ── */
    const gA = x.granos.filter(g => g.hoja === 'a'), gB = x.granos.filter(g => g.hoja === 'b');
    const vA = gA.filter(g => g.ve), vB = gB.filter(g => g.ve);
    const esperaA = n === 0 ? 0 : n === 1 ? 12 : 9, esperaB = n === 0 ? 0 : n <= 2 ? 12 : n === 3 ? 9 : 6;
    r.push([vA.length === esperaA && vB.length === esperaB, `paso ${n}: granitos que se ven: ${esperaA} arriba y ${esperaB} abajo`, [vA.length, vB.length]]);
    const malG = vA.filter(g => !g.dentroA || mord.some(m => dist(g.p, m.c) <= m.r)).length + vB.filter(g => !g.dentroB || man.some(m => dist(g.p, m.c) <= m.r)).length;
    r.push([malG === 0, `paso ${n}: cada granito está dentro de su hoja, fuera de las mordidas y de las manchas`, malG]);
    if (n === 1) r.push([+e.cifra === vA.length && +e.cifra === vB.length, 'paso 1: el marcador dice cuántos granitos hizo cada hoja', e.cifra]);
    if (n === 2) bocaVeneno = x.chapulin.boca;
    if (n >= 2 && bocaVeneno) {
      const idos = gA.filter(g => !g.ve);
      r.push([idos.length === 3 && idos.every(g => dist(g.p, bocaVeneno) < 2.5), `paso ${n}: los granitos que faltan arriba se fueron a la boca del chapulín`, idos.map(g => g.p.map(v => Math.round(v)))]);
    }
    if (n >= 3) {
      const idos = gB.filter(g => !g.ve);
      r.push([idos.every(g => man.some(m => dist(g.p, m.c) < 1.5)), `paso ${n}: los granitos que faltan abajo se fueron al centro de una mancha`, idos.length]);
    }

    /* ── El chapulín: solo en el 2 y el 3, pisando la orilla y mordiendo ── */
    const ch = x.chapulin;
    r.push([ch.ve === (n === 2 || n === 3), `paso ${n}: el chapulín ${n === 2 || n === 3 ? 'está en la hoja de arriba' : 'no está'}`]);
    if (n === 2 || n === 3) {
      r.push([ch.patas.length === 3 && ch.patas.every(p => p.bajo && p.sobre), `paso ${n}: las tres patas del chapulín pisan la orilla de la hoja`, ch.patas.map(p => [p.bajo, p.sobre])]);
      const nuevas = x.mordidas.filter(m => m.tipo === 'nueva' && m.ve).sort((p, q) => p.c[0] - q.c[0]);
      const ult = nuevas[0];
      r.push([!!ult && dist(ch.boca, ult.c) <= ult.r + 3 && ch.boca[0] > ult.c[0], `paso ${n}: la boca del chapulín está en la última mordida`, ult ? Math.round(dist(ch.boca, ult.c) * 10) / 10 : null]);
    }

    /* ── La luz: del sol a las dos hojas, desde el paso 1 ── */
    const ray = x.rayos.filter(q => q.ve);
    r.push([ray.length === (n >= 1 ? 2 : 0), `paso ${n}: ${n >= 1 ? 'la luz les llega a las dos hojas' : 'todavía no se dibuja la luz'}`, ray.length]);
    if (n >= 1) {
      const d0 = ray.map(q => dist(q.a, x.sol.c));
      r.push([d0.every(v => v > x.sol.r && v < x.sol.r + 4) && ray.some(q => q.enA) && ray.some(q => q.enB) && ray.every(q => !man.some(m => dist(q.b, m.c) <= m.r)),
        `paso ${n}: cada rayo sale del sol y llega a una hoja, fuera de las manchas`, d0.map(v => Math.round(v))]);
    }

    /* ── El veneno: las gotas caen en las dos hojas, y en las manchas ── */
    const got = x.gotas.filter(g => g.ve);
    r.push([got.length === (n === 4 ? 12 : 0), `paso ${n}: ${n === 4 ? 'caen las gotas del veneno' : 'no hay gotas'}`, got.length]);
    if (n === 4) {
      r.push([got.every(g => g.enA || g.enB) && got.filter(g => g.enA).length >= 5 && got.filter(g => g.enB).length >= 5, 'paso 4: las gotas caen sobre las dos hojas', [got.filter(g => g.enA).length, got.filter(g => g.enB).length]]);
      r.push([got.filter(g => man.some(m => dist(g.p, m.c) <= m.r)).length >= 2, 'paso 4: el veneno también le cae al hongo', got.filter(g => man.some(m => dist(g.p, m.c) <= m.r)).length]);
      r.push([cubreVeneno !== null && x.cubre > cubreVeneno + 0.3, 'paso 4: la mancha sigue creciendo después del veneno', [cubreVeneno, x.cubre]]);
      /* ⚠️ Se escapó una vez: la pieza que se apagaba era la misma que
         llegaba, y la demora de llegar (0) le ganaba a la de apagarse. El
         chapulín desaparecía al tocar el botón, antes de que cayera una sola
         gota. */
      const d = x.chapulin;
      r.push([d.dVer >= 1000 && Math.abs(d.dVer - d.dCae) < 1 && d.dVer > Math.min(...x.dGotas) + 500,
        'paso 4: el chapulín sigue en la hoja mientras caen las gotas, y se apaga cuando se cae', { ver: d.dVer, cae: d.dCae }]);
    }
    if (n === 3) cubreVeneno = x.cubre;
    r.push([x.bomba.ve === (n >= 4), `paso ${n}: la bomba ${n >= 4 ? 'está' : 'no está'}`]);
    const rotV = x.rotulos.find(t => t.k === 'veneno');
    r.push([!!rotV && rotV.ve === (n === 4) && (!rotV.ve || nb(rotV.dice) === 'veneno para insectos'), `paso ${n}: el rótulo «veneno para insectos» solo va con las gotas`]);

    /* ── Las etiquetas de los reinos: una por paso, en su orden ── */
    const et = x.etiquetas.filter(t => t.ve);
    const deben = ['planta', 'animal', 'hongo'].slice(0, Math.min(n, 3));
    r.push([et.map(t => t.k).join() === deben.join(), `paso ${n}: las etiquetas que se ven son ${deben.join(', ') || 'ninguna'}`, et.map(t => t.k)]);
    r.push([et.every(t => nb(t.dice[0]) === t.k) && et.every((t, i) => i === 0 || t.caja.x0 > et[i - 1].caja.x1), `paso ${n}: cada etiqueta dice su reino, de izquierda a derecha`, et.map(t => t.dice.join(' / '))]);
    if (n >= 5) {
      const ani = x.etiquetas.find(t => t.k === 'animal');
      r.push([dentroCaja(x.bomba.caja, ani.caja), `paso ${n}: la bomba del veneno para insectos se fue a la etiqueta del animal`, x.bomba.caja]);
    }
    if (n === 4) r.push([!x.etiquetas.some(t => dentroCaja(x.bomba.caja, t.caja)), 'paso 4: la bomba todavía está arriba, echando el veneno']);

    /* ── Nada se monta ── */
    const cajas = x.rotulos.filter(t => t.ve).map(t => ({ k: t.k, c: t.caja })).concat(et.map(t => ({ k: t.k, c: t.caja })));
    const montados = [];
    cajas.forEach((p, i) => cajas.slice(i + 1).forEach(q => { if (monta(p.c, q.c)) montados.push(p.k + '/' + q.k); }));
    r.push([montados.length === 0, `paso ${n}: ningún rótulo se monta en otro`, montados]);

    /* ── El marcador cuenta en el dibujo ── */
    const MC = [
      [e.cifra === '2' && /hojas comidas/.test(e.palabras), '2 hojas comidas'],
      [+e.cifra === vA.length, 'los granitos de cada hoja'],
      [+e.cifra === mord.length && /mordidas/.test(e.palabras), 'las mordidas que se ven'],
      [+e.cifra === man.length && /manchas/.test(e.palabras), 'las manchas que se ven'],
      [e.cifra === '½' && x.cubre > 0.45 && x.cubre < 0.58 && /de la hoja/.test(e.palabras), 'media hoja, contada'],
      [+e.cifra === et.length && /reinos/.test(e.palabras), 'las etiquetas de los reinos'],
      [e.cifra === '?', 'la pregunta del alumno']][n];
    r.push([MC[0], `paso ${n}: el marcador dice lo que se ve (${MC[1]})`, [e.cifra, e.palabras]]);
    return r;
  },
  /* La Célula. «El brazo de don Tulio».
     ⚠️ Nada se le cree a la escena. El hueco se lee en el dibujo (qué
     células ya no se ven), cada célula nueva se busca en el lugar que
     ocupa, y su madre en el lugar de donde arrancó: tiene que ser una
     vecina que ya estaba ahí. Así se comprueba lo que la animación dice,
     que ninguna aparece de la nada. */
  amHerida(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const monta = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
    const dentro = (p, c, t) => p[0] >= c.x0 - (t || 0) && p[0] <= c.x1 + (t || 0) && p[1] >= c.y0 - (t || 0) && p[1] <= c.y1 + (t || 0);
    /* Lo que no depende del dibujo, primero. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['microscopio', 'microscópica', 'microscópicas', 'micrómetro', 'micrómetros', 'núcleo', 'núcleos', 'membrana', 'citoplasma', 'adn',
      'organelo', 'organelos', 'mitocondria', 'ribosoma', 'vacuola', 'cloroplasto', 'pared', 'centriolo', 'teoría', 'postulado', 'postulados',
      'virchow', 'omnis', 'hooke', 'corcho', 'celdas', 'billones', 'millones', 'procariota', 'eucariota', 'unicelular', 'pluricelular',
      'especializadas', 'energía', 'alimento', 'muere', 'mueren', 'reproduce', 'reproducen', 'fotosíntesis', 'clorofila', 'oxígeno', 'atp',
      'celulosa', 'ameba', 'bacteria', 'científicos', 'firmeza', 'lechuga', 'máquinas', 'porción', 'propia', 'reacciones'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = EXACTAS.filter(w => suelto.includes(' ' + w + ' '));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni una parte de la célula, ni con qué se ve, ni cuánto mide, ni la teoría)`, malas]);
    const nums = [e.texto].concat(x.textos).map(nb).join(' ').match(/\d+/g) || [];
    r.push([nums.length === 0, `paso ${n}: ningún número en la frase ni en el dibujo`, nums]);
    const frase = nb(e.texto);
    const FR = [['la piel del brazo de don Tulio', 'células pegadas unas con otras', '¿De dónde saldrá la piel nueva?'],
      ['El machete se llevó estas nueve', 'la tiene que hacer su propio cuerpo'],
      ['Una célula de la orilla se divide', 'de una salen dos, iguales', 'un lugar del hueco'],
      ['se siguen dividiendo', 'y la nueva también', 'de abajo hacia arriba'],
      ['la herida está cerrada', 'salió de otra que ya estaba viva ahí', 'ninguna apareció de la nada'],
      ['un raspón que ya sanó', 'dibuja en tu cuaderno']];
    r.push([FR[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${FR[n].join(', ')})`, frase]);
    const vistos = x.rotulos.filter(t => t.ve), montados = [];
    vistos.forEach((a, i) => vistos.slice(i + 1).forEach(b => { if (monta(a.caja, b.caja)) montados.push(nb(a.dice) + '/' + nb(b.dice)); }));
    r.push([montados.length === 0, `paso ${n}: ningún rótulo se monta en otro`, montados]);

    /* ── El brazo y la piel de cerca ── */
    if (n === 0) {
      r.push([dentro(x.corte.a, x.lupa) && dentro(x.corte.b, x.lupa) && x.lupa.x0 >= x.brazo.x0 && x.lupa.x1 <= x.brazo.x1, 'el recuadro está sobre el brazo, justo donde va la herida']);
      const [ra, rb] = x.rayas;
      r.push([!!ra && !!rb && dist(ra.a, [x.lupa.x0, x.lupa.y1]) <= 1 && dist(rb.a, [x.lupa.x1, x.lupa.y1]) <= 1 && dist(ra.b, [x.piel.x0, x.piel.y0]) <= 1.5 && dist(rb.b, [x.piel.x1, x.piel.y0]) <= 1.5,
        'dos rayas van del recuadro a la piel de cerca: es la misma herida, agrandada']);
    }
    r.push([x.corte.ve === (n >= 1 && n <= 3), `paso ${n}: el corte en el brazo ${n >= 1 && n <= 3 ? 'está abierto' : n === 0 ? 'todavía no está' : 'ya se cerró'}`]);

    /* La piel: cinco filas de nueve, todas dentro. */
    const V = x.viejas, lado = V[0].lado;
    /* Dónde está el lugar de cada una: el de antes de caerse, si se cayó. */
    const ys = [...new Set(V.map(c => Math.round(c.casa[1])))].sort((a, b) => a - b), xs = [...new Set(V.map(c => Math.round(c.casa[0])))].sort((a, b) => a - b);
    const quieta = V.filter(c => c.ve);
    if (n === 0) {
      r.push([V.length === 45 && ys.length === 5 && xs.length === 9 && V.every(c => dist(c.c, c.casa) < 0.3 && dentro(c.c, x.piel, -lado / 2 + 0.5)), 'paso 0: la piel son cinco filas de nueve células, todas dentro del recuadro', [V.length, ys.length, xs.length]]);
      r.push([quieta.length === 45 && x.nuevas.every(q => !q.ve), 'paso 0: la piel está entera y no hay ninguna nueva']);
    }
    /* El hueco: las que ya no se ven. */
    const fuera = V.filter(c => !c.ve), filaDe = c => ys.findIndex(y => Math.abs(y - c.casa[1]) < 1), colDe = c => xs.findIndex(v => Math.abs(v - c.casa[0]) < 1);
    if (n >= 1) {
      const porFila = [0, 1, 2, 3, 4].map(f => fuera.filter(c => filaDe(c) === f).map(colDe).sort((a, b) => a - b));
      const seguidas = porFila.every(cs => cs.every((c, i) => i === 0 || c === cs[i - 1] + 1));
      const largos = porFila.map(cs => cs.length), hasta = largos.findIndex(l => l === 0);
      const v = largos[0] > 0 && largos.slice(0, hasta < 0 ? 5 : hasta).every((l, i, a) => i === 0 || l < a[i - 1]) && (hasta < 0 || largos.slice(hasta).every(l => l === 0));
      const centrada = porFila.filter(cs => cs.length).every(cs => Math.abs((cs[0] + cs[cs.length - 1]) / 2 - (porFila[0][0] + porFila[0][porFila[0].length - 1]) / 2) < 0.6);
      r.push([fuera.length === 9 && seguidas && v && centrada, `paso ${n}: el machete se llevó nueve, en forma de V desde la superficie`, largos]);
    }
    /* Las nuevas: dónde están, de quién salieron y cuándo. */
    const N = x.nuevas, vivas = N.filter(q => q.ve), todas = quieta.concat(vivas.map(q => ({ id: q.id, c: q.c })));
    const quiere = [0, 0, 1, 4, 9, 9][n];
    r.push([vivas.length === quiere, `paso ${n}: hay ${quiere} células nuevas`, vivas.length]);
    const enHueco = q => fuera.some(c => dist(c.casa, q.c) <= 0.6);
    r.push([vivas.every(enHueco) && new Set(vivas.map(q => Math.round(q.c[0]) + ',' + Math.round(q.c[1]))).size === vivas.length, `paso ${n}: cada nueva ocupa un lugar del hueco, y ninguna el de otra`]);
    /* La madre: la que se ve con ese lugar. Si la de antes se fue con el
       corte, es la nueva que ocupa su lugar. */
    const buscar = id => { const v = V.find(c => c.id === id), q = N.find(o => o.id === id); return v && v.ve ? v : q || v; };
    const huerfanas = vivas.filter(q => {
      const madre = buscar(q.madre);
      if (!madre || !madre.ve) return true;
      const vecina = Math.abs(dist(madre.c, q.c) - (xs[1] - xs[0])) <= 1;
      const arranca = dist(q.inicio, madre.c) <= 0.6;
      /* Una madre nueva de este mismo paso tiene que haber llegado a su
         lugar antes de dividirse; una de un paso anterior ya estaba. */
      const yaEstaba = !N.includes(madre) || madre.d === 0 || madre.d + 800 <= q.d;
      return !(vecina && arranca && yaEstaba);
    });
    r.push([huerfanas.length === 0, `paso ${n}: cada nueva salió de encima de una vecina que ya estaba ahí: ninguna aparece de la nada`, huerfanas.map(q => q.id + '←' + q.madre)]);
    const desdeNueva = vivas.filter(q => N.some(o => o.id === q.madre));
    if (n >= 3) r.push([desdeNueva.length >= 1, `paso ${n}: las nuevas también se dividen`, desdeNueva.map(q => q.id)]);
    /* Se llena de abajo hacia arriba: una nueva de una fila más arriba
       nunca está antes que las de la fila de abajo del hueco. */
    if (n >= 2) {
      const filasLlenas = [0, 1, 2, 3, 4].map(f => { const h = fuera.filter(c => filaDe(c) === f); return h.length && h.every(c => vivas.some(q => dist(q.c, c.casa) <= 0.6)); });
      const filasCon = [0, 1, 2, 3, 4].map(f => fuera.filter(c => filaDe(c) === f).some(c => vivas.some(q => dist(q.c, c.casa) <= 0.6)));
      const bien = filasCon.every((con, f) => !con || fuera.filter(c => filaDe(c) > f).every(c => vivas.some(q => dist(q.c, c.casa) <= 0.6)));
      r.push([bien, `paso ${n}: el hueco se llena de abajo hacia arriba`, filasLlenas]);
    }
    const encimadas = [];
    todas.forEach((a, i) => todas.slice(i + 1).forEach(b => { if (dist(a.c, b.c) < lado - 0.5) encimadas.push(a.id + '/' + b.id); }));
    r.push([encimadas.length === 0, `paso ${n}: ninguna célula se monta en otra`, encimadas]);
    if (n >= 4) {
      const huecos = V.filter(c => !todas.some(o => dist(o.c, c.casa) <= 0.6));
      r.push([huecos.length === 0, `paso ${n}: la piel está completa otra vez`, huecos.map(c => c.id)]);
    }
    /* Las flechas: de cada madre a su hija, en el paso 4 y el 5. */
    r.push([x.flechas.ve === (n >= 4), `paso ${n}: las flechas de cada madre a su hija ${n >= 4 ? 'están' : 'no están'}`]);
    if (n >= 4) {
      const malas2 = N.filter(q => {
        const f = x.flechas.lista.find(o => o.id === q.id), madre = buscar(q.madre);
        return !f || !madre || dist(f.a, madre.c) > 7 || dist(f.punta, q.c) > 12 || dist(f.punta, q.c) >= dist(f.a, q.c);
      });
      r.push([x.flechas.lista.length === 9 && malas2.length === 0, `paso ${n}: cada nueva lleva su flecha desde la que la hizo`, malas2.map(q => q.id)]);
    }

    /* ── El marcador ── */
    const M = [['?', '¿de dónde sale la piel nueva?'], [String(fuera.length), 'se fueron con el corte'], [String(vivas.length), 'nueva, salida de otra'],
      [String(vivas.length), 'nuevas, faltan ' + (fuera.length - vivas.length)], [String(vivas.length), 'nuevas: la herida se cerró'], ['?', '¿cómo se cerró la tuya?']];
    r.push([nb(e.cifra) === M[n][0] && nb(e.palabras) === M[n][1], `paso ${n}: el marcador dice lo que se ve («${M[n][0]}», ${M[n][1]})`, [e.cifra, e.palabras]]);
    return r;
  },
  /* La Reproducción y el Desarrollo Humano. «A cada uno, a su tiempo».
     ⚠️ Nada se le cree a la escena. Cuándo le llegan los cambios a cada
     compañero se lee en el dibujo: el brote sale en SU línea y aparece
     justo cuando la raya del tiempo pasa por ahí. El día de Kenia se mide
     igual: dónde pisa, por dónde camina y cuándo piensa, dice o la ayudan,
     con lo que tiene escrito cada globo. Y lo que la prueba pregunta no se
     dice en ningún paso. */
  amSuTiempo(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cen = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const monta = (a, b) => a.x0 < b.x1 - 0.5 && b.x0 < a.x1 - 0.5 && a.y0 < b.y1 - 0.5 && b.y0 < a.y1 - 0.5;
    /* Lo que no depende del dibujo, primero. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['pubertad', 'madura', 'maduran', 'madurar', 'maduro', 'hormona', 'hormonas', 'sexual', 'sexuales', 'normal', 'normales',
      'estatura', 'voz', 'vello', 'hombros', 'ensanchan', 'mamas', 'caderas', 'higiene', 'respetar', 'respeto', 'respeta', 'médico', 'médica',
      'controles', 'embarazo', 'embarazada', 'bebé', 'útero', 'estómago', 'óvulo', 'óvulos', 'espermatozoide', 'espermatozoides', 'fecundación',
      'cigoto', 'trompas', 'placenta', 'cordón', 'umbilical', 'parto', 'gestación', 'meses', 'infancia', 'niñez', 'adolescencia', 'adolescente',
      'adultez', 'vejez', 'etapa', 'etapas', 'edad', 'edades', 'varón', 'varones', 'mujer', 'mujeres', 'hombre', 'hombres', 'reproducción',
      'reproductor', 'reproductora', 'reproductores', 'responsabilidad', 'moverse', 'alcohol', 'tabaco', 'fumar', 'cuidado', 'rápido', 'crece',
      'crecer', 'crecen', 'menstrual', 'ciclo', 'vida'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = EXACTAS.filter(w => suelto.includes(' ' + w + ' '));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni un cambio del cuerpo, ni quién los dirige, ni una etapa de la vida, ni lo que se preguntó en su lugar)`, malas]);
    const nums = [e.texto].concat(x.textos).map(nb).join(' ').match(/\d+/g) || [];
    r.push([nums.length === 0, `paso ${n}: ningún número en la frase ni en el dibujo`, nums]);
    const frase = nb(e.texto);
    const FR = [['compañeros de grado de Kenia', '¿Les llegan a todos los cambios del cuerpo el mismo día?'],
      ['Les llegan a todos', 'no el mismo día', 'a cada uno, a su tiempo'],
      ['primera menstruación en la escuela', 'nadie le había explicado nada', 'creyó que estaba enferma', 'se lo guardó todo el día'],
      ['el mismo día', 'alguien que se lo explicó antes', 'Kenia sabe qué es', 'le pide ayuda a la maestra'],
      ['Su cuerpo hizo lo mismo los dos días', 'saber cómo se llama y a quién preguntar'],
      ['adulto de confianza', 'escribe su nombre en tu cuaderno']];
    r.push([FR[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${FR[n].join(', ')})`, frase]);

    /* ── Qué se ve en cada paso ── */
    r.push([x.clase === (n <= 1), `paso ${n}: los compañeros de grado ${n <= 1 ? 'están' : 'ya no están'}`]);
    r.push([x.dia === (n >= 2 && n <= 4), `paso ${n}: el día de Kenia ${n >= 2 && n <= 4 ? 'está' : 'no está'}`]);
    r.push([x.tarjetaVe === (n === 5), `paso ${n}: la tarjeta de la pregunta ${n === 5 ? 'está' : 'no está'}`]);
    const vistos = x.rotulos.filter(t => t.ve);
    const montados = [];
    vistos.forEach((a, i) => vistos.slice(i + 1).forEach(b => { if (monta(a.caja, b.caja)) montados.push(nb(a.dice) + '/' + nb(b.dice)); }));
    r.push([montados.length === 0, `paso ${n}: ningún rótulo se monta en otro`, montados]);

    /* ── La clase ── */
    if (n <= 1) {
      const al = x.alumnos, ys = al.map(a => a.pista.a[1]);
      r.push([al.length === 6 && new Set(al.map(a => a.nombre)).size === 6 && al.every(a => nb(a.dice) === a.nombre), 'son seis compañeros, cada uno con su nombre escrito', al.map(a => a.dice)]);
      r.push([ys.every((y, i) => i === 0 || y > ys[i - 1] + 10), 'cada uno en su fila, una debajo de otra', ys.map(Math.round)]);
      r.push([al.every(a => Math.abs(a.pista.a[1] - a.pista.b[1]) < 0.3 && Math.abs(cen(a.cara)[1] - a.pista.a[1]) <= 0.6 && a.cara.x1 < a.rotulo.x0 && a.rotulo.x1 < a.pista.a[0] - 4),
        'cada uno tiene su cara, su nombre y su línea del tiempo, en ese orden y a la misma altura']);
      const x0 = al[0].pista.a[0], x1 = al[0].pista.b[0];
      r.push([al.every(a => Math.abs(a.pista.a[0] - x0) < 0.5 && Math.abs(a.pista.b[0] - x1) < 0.5), 'las seis líneas empiezan y acaban en el mismo punto']);
      r.push([x.eje.a[1] > ys[5] + 8 && Math.abs(x.eje.a[0] - x0) < 0.5 && x.eje.b[0] >= x1, 'debajo de todos va el eje del tiempo, del mismo largo']);
      const ti = x.rotulos.find(t => t.k === 'tiempo');
      r.push([!!ti && ti.ve && nb(ti.dice) === 'el tiempo' && Math.abs(ti.caja.x1 - x.eje.b[0]) <= 12 && ti.caja.y0 > x.eje.a[1], 'el eje dice «el tiempo», debajo de su punta']);
      const le = x.rotulos.find(t => t.k === 'leyenda');
      r.push([x.leyenda.ve && !!x.leyenda.brote && !!le && nb(le.dice) === 'le llegaron sus cambios', 'lo que es un brote está escrito: «le llegaron sus cambios»']);
      const ry = x.raya;
      r.push([ry.y0 < ys[0] - 5 && ry.y1 >= x.eje.a[1] - 3, 'la raya del tiempo cruza las seis líneas hasta el eje']);
      const vivos = x.brotes.filter(b => b.ve);
      if (n === 0) {
        r.push([Math.abs(ry.x - x0) <= 0.6, 'paso 0: la raya del tiempo está al principio', ry.x]);
        r.push([vivos.length === 0, 'paso 0: todavía no le ha salido el brote a nadie', vivos.length]);
      } else {
        r.push([Math.abs(ry.x - x1) <= 0.6, 'paso 1: la raya del tiempo llegó al final', ry.x]);
        const tr = ry.tramos, L = tr.length ? tr[0].dx : 0;
        r.push([tr.length === 5 && tr.every(t => Math.abs(t.dx - L) < 0.3 && Math.abs(t.dy) < 0.3) && Math.abs(L * 5 - (x1 - x0)) < 0.6,
          'paso 1: la raya avanza en cinco tramos iguales', tr.map(t => +t.dx.toFixed(2))]);
        r.push([tr.every((t, i) => i === 0 || Math.abs(t.d - tr[i - 1].d - 800) <= 5), 'paso 1: cada tramo arranca cuando acabó el anterior, a paso parejo', tr.map(t => t.d)]);
        r.push([vivos.length === 6 && al.every(a => vivos.some(b => b.nombre === a.nombre)), 'paso 1: a los seis les salió su brote: les llega a todos', vivos.length]);
        const fuera = vivos.filter(b => { const a = al.find(q => q.nombre === b.nombre); return !a || Math.abs(b.base[1] - a.pista.a[1]) > 0.6 || b.base[0] < x0 || b.base[0] > x1; });
        r.push([fuera.length === 0, 'paso 1: cada brote está parado en la línea de su compañero', fuera.map(b => b.nombre)]);
        const xs = vivos.map(b => b.base[0]).sort((p, q) => p - q);
        r.push([xs.every((v, i) => i === 0 || v - xs[i - 1] >= 12) && xs[xs.length - 1] - xs[0] >= 100, 'paso 1: cada brote sale en otro punto de la línea: no el mismo día', xs.map(Math.round)]);
        const cuando = b => tr[0].d + (b.base[0] - x0) / L * 800;
        const tarde = vivos.filter(b => Math.abs(b.d - cuando(b)) > 40);
        r.push([tarde.length === 0, 'paso 1: cada brote sale justo cuando la raya pasa por su punto', tarde.map(b => [b.nombre, b.d, Math.round(cuando(b))])]);
        const orden = vivos.slice().sort((p, q) => p.base[0] - q.base[0]).map(b => al.find(a => a.nombre === b.nombre).es);
        let saltos = 0; orden.forEach((s, i) => { if (i && s !== orden[i - 1]) saltos++; });
        r.push([saltos >= 2 && new Set(orden).size === 2, 'paso 1: niñas y niños salen mezclados, nadie va primero por ser niña o niño', orden]);
      }
    } else if (x.brotes.some(b => b.ve)) r.push([false, `paso ${n}: los brotes ya no se ven`]);

    /* ── El día de Kenia ── */
    const F = k => x.filas.find(q => q.k === k), K = (f, c) => x.kenias.find(k => k.fila === f && k.cual === c);
    const G = (clave, cuando) => x.globos.find(g => g.clave === clave && g.cuando === cuando);
    const globosVe = x.globos.filter(g => g.ve), ayudaVe = x.ayuda.filter(a => a.ve);
    if (n >= 2 && n <= 4) {
      r.push([F('a').ve && F('b').ve === (n >= 3), `paso ${n}: ${n >= 3 ? 'las dos filas' : 'solo la primera fila'}, «sin saber» ${n >= 3 ? 'y «sabiendo»' : ''}`]);
      ['a', 'b'].filter(k => F(k).ve).forEach(k => {
        const f = F(k), y = f.camino.a[1], ex = cen(f.escuela)[0], cx = cen(f.casa)[0], mx = cen(f.maestra)[0], sx = f.estrella.c[0];
        r.push([Math.abs(f.camino.b[1] - y) < 0.3 && ex < sx && sx < mx && mx < cx, `fila ${k}: la escuela, el momento en que le llega, la maestra y la casa, en ese orden`]);
        r.push([[f.escuela, f.casa, f.maestra].every(c => Math.abs(c.y1 - y) <= 1.5) && f.estrella.caja.y0 > y && f.estrella.caja.y0 - y < 6, `fila ${k}: todo está parado en el camino, y el momento, debajo`]);
        const tit = x.rotulos.find(t => t.k === 'fila-' + k);
        r.push([!!tit && tit.ve && nb(tit.dice) === (k === 'a' ? 'Sin saber qué era' : 'Sabiendo qué era'), `fila ${k}: dice ${k === 'a' ? '«Sin saber qué era»' : '«Sabiendo qué era»'}`]);
        const rot = kk => x.rotulos.find(t => t.k === kk && t.fila === k);
        const bajo = (t, c) => !!t && t.ve && Math.abs(cen(t.caja)[0] - cen(c)[0]) <= 3 && t.caja.y0 > y;
        r.push([bajo(rot('escuela'), f.escuela) && bajo(rot('casa'), f.casa) && bajo(rot('maestra'), f.maestra) && nb(rot('escuela').dice) === 'escuela' && nb(rot('casa').dice) === 'casa' && nb(rot('maestra').dice) === 'maestra',
          `fila ${k}: «escuela», «maestra» y «casa» van debajo de lo que nombran`]);
        const ll = rot('llega');
        r.push([!!ll && ll.ve && nb(ll.dice) === 'le llega' && ll.caja.x0 > f.estrella.caja.x1 && ll.caja.y1 > f.estrella.caja.y0 && ll.caja.y0 < f.estrella.caja.y1, `fila ${k}: «le llega» va al lado del momento`]);
      });
      if (n >= 3) r.push([Math.abs(F('a').estrella.c[0] - F('b').estrella.c[0]) < 0.5 && Math.abs(cen(F('a').maestra)[0] - cen(F('b').maestra)[0]) < 0.5, `paso ${n}: en las dos filas le llega en el mismo momento del día, y la maestra está en el mismo sitio`]);
      /* Ningún globo se monta en otro ni en un rótulo, y todos caben. */
      const choques = [];
      globosVe.forEach((g, i) => {
        globosVe.slice(i + 1).forEach(h => { if (monta(g.caja, h.caja)) choques.push(g.clave + '/' + h.clave); });
        vistos.forEach(t => { if (monta(g.caja, t.caja)) choques.push(g.clave + '/' + nb(t.dice)); });
        if (g.caja.x0 < 0 || g.caja.x1 > 320 || g.caja.y0 < 0) choques.push(g.clave + ' se sale');
        const letras = g.letras.every(l => l.x0 >= g.caja.x0 && l.x1 <= g.caja.x1 && l.y0 >= g.caja.y0 - 0.5 && l.y1 <= g.caja.y1 + 0.5);
        if (!letras) choques.push(g.clave + ': la letra no cabe');
      });
      r.push([choques.length === 0, `paso ${n}: los globos caben, con su letra adentro, sin montarse en nada`, choques]);
    } else if (globosVe.length || ayudaVe.length) r.push([false, `paso ${n}: no queda ningún globo del día`]);

    /* Primera fila: «¿Estoy enferma?» se va con ella a su casa. */
    const aC = K('a', 'camina'), aQ = K('a', 'quieta'), fa = F('a');
    r.push([aC.ve === (n === 2) && aQ.ve === (n === 3 || n === 4), `paso ${n}: en la primera fila, Kenia ${n === 2 ? 'camina' : n === 3 || n === 4 ? 'ya está en su casa' : 'no está'}`]);
    if (n === 2) {
      const tr = aC.tramos, L = tr.length ? tr[0].dx : 0, sale = aC.pisa[0] - tr.reduce((s, t) => s + t.dx, 0);
      r.push([tr.length === 4 && tr.every(t => Math.abs(t.dx - L) < 0.3 && Math.abs(t.dy) < 0.3) && Math.abs(sale - fa.estrella.c[0]) <= 0.6 && Math.abs(aC.pisa[1] - fa.camino.a[1]) <= 0.6,
        'paso 2: Kenia sale de donde le llega y camina por el camino, en tramos iguales', { sale: Math.round(sale), tramos: tr.map(t => +t.dx.toFixed(1)) }]);
      r.push([tr.every((t, i) => i === 0 || Math.abs(t.d - tr[i - 1].d - 800) <= 5), 'paso 2: cada tramo arranca cuando acabó el anterior', tr.map(t => t.d)]);
      r.push([aC.pisa[0] > fa.maestra.x1 && aC.cabeza.x1 < fa.casa.x0, 'paso 2: pasa de largo junto a la maestra y llega a su casa', aC.pisa.map(Math.round)]);
      r.push([Math.abs(aC.pisa[0] - aQ.pisa[0]) <= 0.6 && Math.abs(aC.pisa[1] - aQ.pisa[1]) <= 0.6, 'la Kenia que camina acaba justo donde está la que ya llegó']);
      const g = G('enferma', 'camina');
      r.push([!!g && g.ve && g.dice.join(' ') === '¿Estoy enferma?' && g.caja.y1 < aC.cabeza.y0 && Math.abs(cen(g.caja)[0] - aC.pisa[0]) <= 1 && g.d < tr[0].d,
        'paso 2: piensa «¿Estoy enferma?» apenas le llega, y el pensamiento se va con ella', g && [g.d, tr[0].d]]);
      r.push([!!g && g.punta[1] > g.caja.y1 && g.punta[1] < aC.cabeza.y0 + 2 && Math.abs(g.punta[0] - aC.pisa[0]) <= 7, 'paso 2: el globo de pensar apunta a su cabeza']);
      r.push([aC.triste.ve && !aC.tranquila.ve && !aC.contenta.ve && aC.triste.d === (g ? g.d : -1), 'paso 2: se pone triste en el momento en que le llega', aC.triste.d]);
      r.push([aC.lagrima.ve && Math.abs(aC.lagrima.d - (tr[3].d + 800)) <= 5, 'paso 2: llora al llegar a su casa, no antes', [aC.lagrima.d, tr[3].d + 800]]);
      r.push([!globosVe.some(q => q.fila === 'a' && q.clave !== 'enferma') && ayudaVe.length === 0, 'paso 2: no le dice nada a nadie y nadie la ayuda']);
    }
    if (n === 3 || n === 4) {
      const g = G('enferma', 'quieta');
      r.push([aQ.lagrima.ve && aQ.triste.ve && !!g && g.ve && g.caja.y1 < aQ.cabeza.y0 && Math.abs(cen(g.caja)[0] - aQ.pisa[0]) <= 1, `paso ${n}: en su casa, Kenia sigue con «¿Estoy enferma?» y llorando`]);
    }

    /* Segunda fila: «Ya sé qué es», y donde la maestra lo dice con la
       palabra exacta y pide ayuda. */
    const bC = K('b', 'camina'), bQ = K('b', 'quieta'), fb = F('b');
    r.push([bC.ve === (n === 3) && bQ.ve === (n === 4), `paso ${n}: en la segunda fila, Kenia ${n === 3 ? 'camina' : n === 4 ? 'ya está con la maestra' : 'no está'}`]);
    if (n === 3) {
      const tr = bC.tramos, L = tr.length ? tr[0].dx : 0, sale = bC.pisa[0] - tr.reduce((s, t) => s + t.dx, 0);
      r.push([tr.length === 3 && tr.every(t => Math.abs(t.dx - L) < 0.3 && Math.abs(t.dy) < 0.3) && Math.abs(sale - fb.estrella.c[0]) <= 0.6 && Math.abs(bC.pisa[1] - fb.camino.a[1]) <= 0.6,
        'paso 3: Kenia sale de donde le llega y camina por el camino, en tramos iguales', { sale: Math.round(sale), tramos: tr.map(t => +t.dx.toFixed(1)) }]);
      r.push([tr.every((t, i) => i === 0 || Math.abs(t.d - tr[i - 1].d - 800) <= 5), 'paso 3: cada tramo arranca cuando acabó el anterior', tr.map(t => t.d)]);
      const llega = tr[2].d + 800;
      r.push([bC.cabeza.x1 < fb.cabezaMaestra.x0 && fb.cabezaMaestra.x0 - bC.cabeza.x1 <= 14, 'paso 3: se para junto a la maestra', [Math.round(bC.cabeza.x1), Math.round(fb.cabezaMaestra.x0)]]);
      r.push([Math.abs(bC.pisa[0] - bQ.pisa[0]) <= 0.6 && Math.abs(bC.pisa[1] - bQ.pisa[1]) <= 0.6, 'la Kenia que camina acaba justo donde está la que ya llegó']);
      const s = G('sabe', 'camina');
      r.push([!!s && s.envoltura && s.envoltura.ve && s.envoltura.d < tr[0].d && s.dice.join(' ') === 'Ya sé qué es.', 'paso 3: piensa «Ya sé qué es.» apenas le llega', s && s.envoltura]);
      r.push([!!s && !s.ve && s.dentroFuera && Math.abs(s.d - llega) <= 5, 'paso 3: lo que piensa se apaga al llegar donde la maestra', s && [s.d, llega]]);
      const d = G('dice', 'camina');
      r.push([!!d && d.ve && d.dice.join(' ') === 'Es mi menstruación. ¿Me ayuda?' && d.d >= llega + 500, 'paso 3: donde la maestra dice la palabra exacta y pide ayuda, cuando el pensamiento ya se fue', d && [d.dice, d.d]]);
      const cab = bC.cabeza, dPunta = d ? Math.max(cab.x0 - d.punta[0], 0, d.punta[0] - cab.x1) + Math.max(cab.y0 - d.punta[1], 0, d.punta[1] - cab.y1) : 99;
      r.push([!!d && dPunta <= 4 && !monta(d.caja, fb.cabezaMaestra), 'paso 3: el globo sale de su cabeza y no tapa a la maestra', dPunta]);
      const a = x.ayuda.find(q => q.cuando === 'camina');
      r.push([!!a && a.ve && a.d >= (d ? d.d : 0) + 500 && a.caja.x0 >= fb.cabezaMaestra.x1 - 1 && a.caja.x0 - fb.cabezaMaestra.x1 <= 10 && a.caja.y0 < fb.cabezaMaestra.y1 + 8 && a.caja.y1 > fb.cabezaMaestra.y0 - 8,
        'paso 3: después de pedirla, la maestra la ayuda (✓ junto a la maestra)', a && [a.d, d && d.d]]);
      r.push([bC.contenta.ve && !bC.tranquila.ve && !bC.triste.ve && !bC.lagrima.ve && !!a && bC.contenta.d === a.d, 'paso 3: se pone contenta cuando la ayudan, y no llora', bC.contenta.d]);
      r.push([!globosVe.some(q => q.fila === 'b' && q.clave === 'sabe'), 'paso 3: al final ya no piensa: lo dijo']);
    }
    if (n === 4) {
      const d = G('dice', 'quieta'), a = x.ayuda.find(q => q.cuando === 'quieta');
      r.push([!!d && d.ve && d.dice.join(' ') === 'Es mi menstruación. ¿Me ayuda?' && !!a && a.ve && bQ.contenta.ve && !bQ.lagrima.ve, 'paso 4: en la segunda fila, Kenia sigue con la maestra: lo dijo, pidió ayuda y la ayudaron']);
      const c = x.comparar, u = c.union, sa = fa.estrella.c, sb = fb.estrella.c;
      r.push([c.ve && Math.abs(u.a[0] - u.b[0]) < 0.3 && dist(u.a, sa) <= 1 && dist(u.b, sb) <= 1, 'paso 4: una raya une los dos momentos: le llegó en el mismo momento del día']);
      r.push([c.anillos.length === 2 && c.anillos.every(q => { const s = F(q.k).estrella; return dist(q.c, s.c) <= 0.6 && q.caja.x0 < s.caja.x0 && q.caja.x1 > s.caja.x1; }), 'paso 4: cada momento lleva su anillo']);
      const mi = x.rotulos.find(t => t.k === 'mismo');
      r.push([!!mi && mi.ve && nb(mi.dice) === 'el mismo momento' && mi.caja.x0 > u.a[0] && mi.caja.y0 > sa[1] && mi.caja.y1 < sb[1], 'paso 4: dice «el mismo momento», al lado de la raya']);
      const cruza = vistos.filter(t => t.k !== 'mismo' && t.caja.x0 < u.a[0] && t.caja.x1 > u.a[0] && t.caja.y0 < Math.max(u.a[1], u.b[1]) && t.caja.y1 > Math.min(u.a[1], u.b[1]));
      r.push([cruza.length === 0, 'paso 4: la raya no atraviesa ningún rótulo', cruza.map(t => t.dice)]);
    } else r.push([!x.comparar.ve, `paso ${n}: la raya del mismo momento solo está en el paso 4`]);

    /* ── La pregunta del final ── */
    if (n === 5) {
      const t = x.rotulos.find(q => q.k === 'tarjeta'), h = x.tarjeta.hoja, w = x.tarjeta.escribir;
      r.push([!!t && t.ve && nb(t.dice) === 'Le puedo preguntar a:' && t.caja.x0 > h.x0 && t.caja.x1 < h.x1 && t.caja.y0 > h.y0, 'paso 5: la tarjeta dice «Le puedo preguntar a:»']);
      r.push([w.a[0] > h.x0 && w.b[0] < h.x1 && w.a[1] > t.caja.y1 && w.a[1] < h.y1 && Math.abs(w.a[1] - w.b[1]) < 0.3, 'paso 5: y trae su raya para escribir, debajo']);
    }

    /* ── El marcador ── */
    const tot = x.alumnos.length, van = x.brotes.filter(b => b.ve).length;
    const M = [['?', '¿el mismo día?'], [van + ' de ' + tot, 'cada uno a su tiempo'], ['sola', 'todo el día'], ['ayuda', 'ahí mismo'], ['saber', 'lo que cambió'], ['?', '¿a quién le preguntas?']];
    r.push([nb(e.cifra) === M[n][0] && nb(e.palabras) === M[n][1], `paso ${n}: el marcador dice lo que se ve («${M[n][0]}», ${M[n][1]})`, [e.cifra, e.palabras]]);
    return r;
  },
  /* El Sistema Respiratorio y Circulatorio. «La cuesta de la pila».
     ⚠️ Nada se le cree a la escena. Cada bolita de oxígeno se sigue tramo
     por tramo en el dibujo: del aire a la boca, de la boca a un pulmón
     (dentro de lo pintado: se le pregunta al navegador), del pulmón al
     corazón y del corazón a una pierna; y cada tramo arranca cuando acabó
     el anterior. Los caminos de la sangre se leen de punta a punta: la ida,
     de cada pulmón al corazón y del corazón a cada pierna; la vuelta, de
     cada pierna al corazón y del corazón a cada pulmón, con la flecha
     hacia donde va. Las agujas se leen por su ángulo. Con eso se comprueba
     lo que la historia dice: el oxígeno llega a los pulmones, pero a las
     piernas lo lleva la sangre, y cuesta arriba llega más y las agujas se
     van a «rápido». ⚠️ Y la prueba no se regala: ni un tramo del camino del
     aire, ni un vaso, ni una parte de la sangre, ni lo que sale al soltar
     el aire, ni «pecho», ni «pulso», ni un número. */
  amCuesta(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cen = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const enCaja = (p, b, t) => p[0] >= b.x0 - t && p[0] <= b.x1 + t && p[1] >= b.y0 - t && p[1] <= b.y1 + t;
    /* Lo que no depende del dibujo, primero. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['dióxido', 'carbono', 'cuatro', 'ventrículos', 'aurículas', 'circulatorio', 'respiratorio', 'puño', 'nariz', 'desechos',
      'dos', 'pulso', 'pecho', 'hemoglobina', 'humo', 'esponjosos', 'laringe', 'faringe', 'tráquea', 'bronquios', 'alvéolos', 'arteria',
      'arterias', 'vena', 'venas', 'capilares', 'diafragma', 'glóbulos', 'plaquetas', 'plasma', 'músculo', 'saquitos', 'nunca', 'ejercicio',
      'fortalece', 'puro', 'fumar', 'digestivo', 'estómago', 'inspiración', 'espiración', 'intercambio', 'energía', 'células', 'hierro',
      'frijol', 'verduras', 'pañuelo', 'tres', 'millones', 'gota', 'alcohol', 'grasa', 'montaña', 'dormir', 'bombea', 'cavidades',
      'nutrientes', 'sale', 'salir', 'suelta', 'expulsa', 'expulsamos', 'expulsar', 'todo el cuerpo'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = EXACTAS.filter(w => suelto.includes(' ' + w + ' '));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni un tramo del camino del aire, ni un vaso, ni una parte de la sangre, ni lo que sale al soltar el aire)`, malas]);
    const nums = dicho.match(/\d+/g) || [];
    r.push([nums.length === 0, `paso ${n}: ningún número`, nums]);
    const frase = nb(e.texto);
    const F = [['las piernas de Marvin gastan oxígeno', 'el oxígeno está afuera, en el aire', '¿Cómo les llega hasta allá?'],
      ['el oxígeno entra por la boca y llega a los pulmones', 'las piernas están lejos de los pulmones'],
      ['La sangre pasa por los pulmones y se lo lleva', 'El corazón la empuja hasta las piernas'],
      ['Allá se gasta', 'la sangre vuelve por más', 'respirar despacio', 'corazón tranquilo'],
      ['Cuesta arriba, las piernas gastan más', 'se respira más rápido', 'el corazón late más rápido'],
      ['llegó sin aire y con el corazón golpeando', 'Cuenta tus respiraciones sentado', 'después de subir unas gradas']];
    r.push([F[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${F[n].join(', ')})`, frase]);

    /* ── Marvin por dentro ── */
    const L = k => x.pulmones.find(q => q.k === k), P = k => x.piernas.find(q => q.k === k);
    if (n === 0) {
      r.push([x.aire.x1 < x.cabeza.x0, 'el aire está afuera, a un lado de la cara']);
      r.push([enCaja(cen(x.boca), x.cabeza, 0), 'la boca está en la cara']);
      r.push([x.pulmones.length === 2 && x.pulmones.every(q => enCaja(cen(q.caja), x.marvin, 0) && q.caja.y0 >= x.marvin.y0 - 2), 'los dos pulmones están dentro de Marvin']);
      r.push([enCaja(cen(x.corazon), x.marvin, 0) && x.corazon.y0 > Math.max(...x.pulmones.map(q => cen(q.caja)[1])), 'el corazón está dentro de Marvin, debajo del medio de los pulmones']);
      r.push([x.piernas.length === 2 && x.piernas.every(q => q.caja.y0 >= x.marvin.y1 - 2), 'las piernas salen de debajo de la camisa']);
      /* Los caminos de la sangre, de punta a punta, y la flecha hacia donde va. */
      const cerca = (p, c) => enCaja(p, c, 4);
      const V = k => x.vasos.find(v => v.k === k);
      const esperado = {
        'ida-pulmon-izq': v => v.pulmonA === 'izq' && cerca(v.b, x.corazon), 'ida-pulmon-der': v => v.pulmonA === 'der' && cerca(v.b, x.corazon),
        'ida-pierna-izq': v => cerca(v.a, x.corazon) && v.piernaB === 'izq', 'ida-pierna-der': v => cerca(v.a, x.corazon) && v.piernaB === 'der',
        'vuelta-pierna-izq': v => v.piernaA === 'izq' && cerca(v.b, x.corazon), 'vuelta-pierna-der': v => v.piernaA === 'der' && cerca(v.b, x.corazon),
        'vuelta-pulmon-izq': v => cerca(v.a, x.corazon) && v.pulmonB === 'izq', 'vuelta-pulmon-der': v => cerca(v.a, x.corazon) && v.pulmonB === 'der' };
      Object.entries(esperado).forEach(([k, ok]) => {
        const v = V(k);
        r.push([!!v && ok(v), `el camino ${k} va de donde dice a donde dice (la vuelta también pasa por el corazón)`, v && { a: v.a.map(Math.round), b: v.b.map(Math.round) }]);
        if (v) {
          const d = [v.b[0] - v.a[0], v.b[1] - v.a[1]], f = [v.punta[0] - v.base[0], v.punta[1] - v.base[1]];
          r.push([d[0] * f[0] + d[1] * f[1] > 0, `la flecha del camino ${k} apunta hacia donde va`]);
        }
      });
      /* Los rótulos de los órganos, con su hilo hasta el órgano. */
      [['pulmones', h => x.pulmones.some(q => enCaja(h.b, q.caja, 0))], ['corazon', h => enCaja(h.b, x.corazon, 1)],
        ['piernas', h => x.piernas.some(q => enCaja(h.b, q.caja, 0))]].forEach(([k, ok]) => {
        const h = x.hilos.find(q => q.k === k), t = x.rotulos.find(q => q.k === k);
        r.push([!!h && !!t && ok(h) && Math.abs(h.a[0] - t.caja.x0) <= 5 && h.a[1] >= t.caja.y0 - 2 && h.a[1] <= t.caja.y1 + 2,
          `el rótulo «${t ? nb(t.dice) : k}» tiene su hilo hasta el órgano`]);
      });
      const sentado = x.bolitas.filter(b => b.cual === 'sentado'), cuesta = x.bolitas.filter(b => b.cual === 'cuesta');
      r.push([sentado.length === 2 && cuesta.length === 4, 'sentado son dos bolitas, y cuesta arriba, cuatro: llega más', [sentado.length, cuesta.length]]);
      r.push([x.bolitas.every(b => b.enAire), 'todas las bolitas salen del aire']);
      r.push([['izq', 'der'].every(l => x.bolitas.filter(b => b.lado === l).length === 3), 'van a los dos pulmones y a las dos piernas por igual']);
    }

    /* ── Dónde está cada bolita, medido ── */
    const dondeFin = b => !b.ve ? 'no' : b.pulmon ? 'pulmon-' + b.pulmon : b.pierna ? 'pierna-' + b.pierna : b.enAire && b.tramos.every(t => dist(t.p, b.sale) < 0.5) ? 'aire' : 'afuera';
    const espera = b => {
      if (b.cual === 'sentado') return n === 0 ? 'aire' : n === 1 ? 'pulmon-' + b.lado : n === 2 ? 'pierna-' + b.lado : 'no';
      return n >= 4 ? 'pierna-' + b.lado : 'no';
    };
    const malos = x.bolitas.filter(b => dondeFin(b) !== espera(b));
    r.push([malos.length === 0, `paso ${n}: cada bolita está donde le toca (en el aire, en SU pulmón o en SU pierna, o ya gastada)`,
      malos.map(b => b.cual + ':' + b.lado + ' ' + dondeFin(b) + ' ≠ ' + espera(b))]);
    /* El camino, tramo por tramo, de las que viajan en este paso. */
    const viajan = x.bolitas.filter(b => b.ve && ((b.cual === 'sentado' && (n === 1 || n === 2)) || (b.cual === 'cuesta' && n === 4)));
    viajan.forEach(b => {
      const hasta = b.cual === 'sentado' && n === 1 ? 2 : 4;
      const bien = [dist(b.tramos[0].p, cen(x.boca)) <= 3, b.tramos[1].pulmon === b.lado];
      if (hasta === 4) bien.push(dist(b.tramos[2].p, cen(x.corazon)) <= 4, b.tramos[3].pierna === b.lado);
      r.push([bien.every(Boolean), `paso ${n}: la bolita ${b.cual}-${b.lado} pasa por la boca y su pulmón${hasta === 4 ? ', el corazón y llega a su pierna' : ''}`,
        b.tramos.slice(0, hasta).map(t => t.p.map(Math.round))]);
      const desde = b.cual === 'sentado' && n === 2 ? 2 : 0;
      const pasos = [];
      for (let t = desde + 1; t < hasta; t++) pasos.push(b.tramos[t].d - b.tramos[t - 1].d);
      r.push([pasos.every(p => p >= 800), `paso ${n}: cada tramo de la bolita ${b.cual}-${b.lado} arranca cuando acabó el anterior`, pasos]);
      if (b.cual === 'cuesta') r.push([b.dVer === b.tramos[0].d, `paso ${n}: la bolita ${b.cual}-${b.lado} aparece cuando empieza a viajar`, [b.dVer, b.tramos[0].d]]);
    });
    /* La ida de la sangre es por donde van: la bolita sale de su pulmón por
       donde empieza su camino, y su camino a la pierna pasa junto a ella. */
    if (n === 2 || n === 4) {
      const seg = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))); return dist(p, [a[0] + t * dx, a[1] + t * dy]); };
      const lejos = viajan.filter(b => {
        const arriba = x.vasos.find(v => v.k === 'ida-pulmon-' + b.lado), abajo = x.vasos.find(v => v.k === 'ida-pierna-' + b.lado);
        return !arriba || !abajo || dist(b.tramos[1].p, arriba.a) > 2 || seg(b.fin, abajo.a, abajo.b) > 4;
      });
      r.push([lejos.length === 0, `paso ${n}: las bolitas van por la ida de la sangre`, lejos.map(b => b.cual + '-' + b.lado)]);
    }
    const enPiernas = x.bolitas.filter(b => b.ve && b.pierna);
    const quiere = n === 2 ? 2 : n >= 4 ? 4 : 0;
    r.push([enPiernas.length === quiere, `paso ${n}: en las piernas hay ${quiere} bolitas`, enPiernas.length]);
    const vis = x.bolitas.filter(b => b.ve), pegadas = [];
    vis.forEach((a, i) => vis.slice(i + 1).forEach(b => { if (dist(a.fin, b.fin) < a.r + b.r - 0.5) pegadas.push(a.cual + a.lado + '/' + b.cual + b.lado); }));
    r.push([pegadas.length === 0, `paso ${n}: ninguna bolita se monta encima de otra, así se cuentan`, pegadas]);

    /* ── Los relojes ── */
    r.push([x.relojes.ve === (n >= 3), `paso ${n}: los relojes ${n >= 3 ? 'están' : 'todavía no están'}`]);
    const titulo = k => { const t = x.rotulos.find(q => q.k === k); return t && t.ve; };
    r.push([titulo('sentado') === (n === 3) && titulo('cuesta') === (n >= 4), `paso ${n}: arriba de los relojes dice ${n === 3 ? '«sentado»' : n >= 4 ? '«cuesta arriba»' : 'nada'}`]);
    if (n >= 3) {
      x.agujas.forEach(a => {
        const ang = Math.atan2(-(a.p[1] - a.c[1]), a.p[0] - a.c[0]) * 180 / Math.PI;
        const lado = x.rotulos.filter(t => t.reloj === a.k && (t.k === 'despacio' || t.k === 'rapido'));
        const hacia = lado.slice().sort((p, q) => dist(a.p, cen(p.caja)) - dist(a.p, cen(q.caja)))[0];
        r.push([(n === 3 ? ang > 100 : ang < 80) && hacia && hacia.k === (n === 3 ? 'despacio' : 'rapido'),
          `paso ${n}: la aguja de «${a.k}» apunta a «${n === 3 ? 'despacio' : 'rápido'}»`, Math.round(ang)]);
        const d = x.rotulos.find(t => t.reloj === a.k && t.k === 'despacio'), q = x.rotulos.find(t => t.reloj === a.k && t.k === 'rapido');
        const nom = x.rotulos.find(t => t.reloj === a.k && t.k === 'nombre-' + a.k);
        r.push([d && q && nb(d.dice) === 'despacio' && nb(q.dice) === 'rápido' && d.caja.x1 < a.c[0] && q.caja.x0 > a.c[0],
          `paso ${n}: en el reloj de «${a.k}», «despacio» a la izquierda y «rápido» a la derecha`]);
        r.push([nom && nb(nom.dice) === (a.k === 'respira' ? 'respira' : 'el corazón') && nom.caja.y0 > a.c[1], `paso ${n}: el reloj de «${a.k}» dice qué mide, debajo`]);
      });
    }
    /* Ningún rótulo se monta en otro. */
    const vistos = x.rotulos.filter(t => t.ve), montados = [];
    vistos.forEach((a, i) => vistos.slice(i + 1).forEach(b => {
      if (a.caja.x0 < b.caja.x1 - 0.5 && b.caja.x0 < a.caja.x1 - 0.5 && a.caja.y0 < b.caja.y1 - 0.5 && b.caja.y0 < a.caja.y1 - 0.5) montados.push(nb(a.dice) + '/' + nb(b.dice));
    }));
    r.push([montados.length === 0, `paso ${n}: ningún rótulo se monta en otro`, montados]);

    /* ── El marcador ── */
    const M = [['?', 'cómo llega el oxígeno a las piernas'], ['pulmones', 'hasta ahí llega el aire'], ['sangre', 'lo lleva a las piernas'],
      ['despacio', 'sentado'], ['rápido', 'cuesta arriba'], ['?', 'cuántas veces respiras']];
    r.push([nb(e.cifra) === M[n][0] && nb(e.palabras) === M[n][1], `paso ${n}: el marcador dice lo que se ve («${M[n][0]}», ${M[n][1]})`, [e.cifra, e.palabras]]);
    return r;
  },
  /* El Sistema Digestivo. «Llena no es lo mismo que nutrida».
     ⚠️ Nada se le cree a la escena. Qué alimento va a qué frasco lo dice una
     tabla de la sonda, y cada entrada se justifica con lo que está escrito
     debajo del frasco. Dónde está cada bocado se mide en el dibujo: dentro
     de lo pintado de la panza (se le pregunta al navegador) o dentro de un
     frasco. Con eso se comprueba lo que la historia dice: los dos platos dan
     los mismos ocho bocados y la panza se llena igual; con el de Kenia casi
     todo va al mismo frasco, del frijol llega uno (casi nada, no nada) y dos
     frascos quedan vacíos; con el otro, llega de los cuatro. Y cada bocado
     sale de su alimento, en SU plato. ⚠️ Y la prueba no se regala: ni el
     nombre de un nutriente, ni para qué sirve, ni un órgano, ni una etapa,
     ni un número fuera del marcador. */
  amFrascos(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cen = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const enCaja = (p, b, t) => p[0] >= b.x0 - t && p[0] <= b.x1 + t && p[1] >= b.y0 - t && p[1] <= b.y1 + t;
    /* Lo que no depende del dibujo, primero. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['carbohidrato', 'carbohidratos', 'proteína', 'proteínas', 'grasa', 'grasas', 'vitamina', 'vitaminas', 'mineral', 'minerales',
      'nutriente', 'nutrientes', 'nutrición', 'energía', 'construye', 'construyen', 'construir', 'regulan', 'protegen', 'reserva',
      'ingestión', 'digestión', 'absorción', 'egestión', 'sangre', 'heces', 'saliva', 'jugo', 'jugos', 'bilis', 'esófago', 'estómago',
      'intestino', 'intestinos', 'hígado', 'páncreas', 'quimo', 'bolo', 'dientes', 'ano', 'vellosidades', 'cancha', 'fibra', 'estreñimiento',
      'caries', 'chatarra', 'equilibrado', 'equilibrada', 'variado', 'cinco', 'nueve', 'metros', 'grupos', 'digestivo', 'digestiva', 'aparato'];
    const malas = dicho.split(/[^a-záéíóúñü]+/).filter(w => EXACTAS.includes(w));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni un nutriente, ni para qué sirve, ni un órgano, ni una etapa)`, malas]);
    const nums = [e.texto, e.palabras].concat(x.textos).map(nb).join(' ').match(/\d+/g) || [];
    r.push([nums.length === 0, `paso ${n}: ningún número fuera del marcador`, nums]);
    const frase = nb(e.texto);
    const F = [['tortilla, arroz, un fresco y un poquito de frijol', '¿Le llegó de todo lo que su cuerpo usa?'],
      ['Todo baja a la panza', 'la panza se llena', 'no se queda con hambre'],
      ['casi todo va al mismo frasco', 'Del frijol, el huevo y la leche', 'crecer y repararse', 'casi nada'],
      ['Otro plato', 'tortilla, frijol, huevo, aguacate, ensalada y una naranja', 'La panza se llena igual'],
      ['le llega de los cuatro frascos', 'no fue cuánto comió, sino qué comió'],
      ['Llenarse no es lo mismo que nutrirse', '¿qué frasco te quedó vacío?']];
    r.push([F[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${F[n].join(', ')})`, frase]);

    /* ── Qué alimento va a qué frasco. La tabla es de la sonda; lo que la
       justifica tiene que estar escrito debajo de ese frasco. El fresco va
       al primero por su azúcar. ── */
    const VA = { tortilla: [0, 'tortilla'], arroz: [0, 'arroz'], fresco: [0, 'azúcar'], frijol: [1, 'frijol'], huevo: [1, 'huevo'],
                 aguacate: [2, 'aguacate'], naranja: [3, 'frutas'], tomate: [3, 'verduras'], repollo: [3, 'verduras'] };
    const CLASE = { 'sd-tortilla': 'tortilla', 'sd-arroz': 'arroz', 'sd-fresco': 'fresco', 'sd-frijol': 'frijol', 'sd-clara': 'huevo', 'sd-yema': 'huevo',
                    'sd-aguacate': 'aguacate', 'sd-naranja': 'naranja', 'sd-hoja': 'naranja', 'sd-tomate': 'tomate', 'sd-repollo': 'repollo' };
    const etiqueta = f => x.frascos[f].etiqueta.map(t => nb(t.dice)).join(' ').toLowerCase();
    if (n === 0) {
      Object.entries(VA).forEach(([de, [f, palabra]]) =>
        r.push([etiqueta(f).includes(palabra), `debajo del frasco ${f + 1} dice «${palabra}», que es por lo que va ahí el bocado de ${de}`, etiqueta(f)]));
      x.frascos.forEach(q => r.push([q.etiqueta.length > 0 && q.etiqueta.every(t => t.ve && t.caja.y0 > q.caja.y1 && cen(t.caja)[0] > q.caja.x0 && cen(t.caja)[0] < q.caja.x1),
        `lo escrito del frasco ${q.f + 1} va debajo de él`]));
      const kB = x.bocados.filter(b => b.cual === 'kenia'), oB = x.bocados.filter(b => b.cual === 'otro');
      r.push([kB.length === 8 && oB.length === 8, 'los dos platos dan los mismos ocho bocados', [kB.length, oB.length]]);
      r.push([x.bocados.every(b => VA[b.de] && b.clase.includes('sd-b-' + b.de)), 'cada bocado es de un alimento que la tabla conoce, y del color de ese alimento']);
      /* Cada bocado sale de su alimento, en SU plato; y lo que hay en cada
         plato es justo de lo que salen sus bocados. */
      [['kenia', x.comidaA, 'el plato de Kenia'], ['otro', x.comidaB, 'el otro plato']].forEach(([cual, plato, nom]) => {
        const bs = x.bocados.filter(b => b.cual === cual);
        bs.forEach(b => r.push([plato.cosas.some(c => CLASE[c.clase] === b.de && enCaja(b.sale, c.caja, 1)),
          `el bocado de ${b.de} sale de su ${b.de}, en ${nom}`, b.sale.map(Math.round)]));
        const hay = [...new Set(plato.cosas.map(c => CLASE[c.clase]).filter(Boolean))].sort().join(',');
        const van = [...new Set(bs.map(b => b.de))].sort().join(',');
        r.push([hay === van, `en ${nom} hay justo lo que da bocados`, { hay, van }]);
      });
      r.push([enCaja(cen(x.panza), x.kenia, 0) && x.panza.x0 >= x.kenia.x0 - 2 && x.panza.x1 <= x.kenia.x1 + 2 && x.cabeza.y1 <= x.kenia.y0 + 4,
        'la panza está dentro de Kenia, debajo de su cabeza']);
      const su = x.rotulos.filter(t => t.k === 'panza');
      r.push([su.length === 2 && su.every(t => t.ve && t.caja.x1 < x.panza.x0 && cen(t.caja)[1] > x.panza.y0 && cen(t.caja)[1] < x.panza.y1),
        'el rótulo «su panza» va a la izquierda de la panza, a su altura']);
      const fr = x.rotulos.find(t => t.k === 'frascos');
      r.push([fr && fr.ve && fr.caja.y1 < Math.min(...x.frascos.map(q => q.caja.y0)) && cen(fr.caja)[0] > x.frascos[0].caja.x0 && cen(fr.caja)[0] < x.frascos[3].caja.x1,
        'el rótulo de los frascos va encima de ellos']);
    }

    /* ── El plato ── */
    r.push([x.comidaA.ve === (n === 0), `paso ${n}: el plato de Kenia ${n === 0 ? 'está servido' : 'ya no está'}`]);
    r.push([!x.comidaB.ve, `paso ${n}: el otro plato no se queda servido al terminar el paso`]);
    r.push([x.comidaB.sale === (n >= 3), `paso ${n}: el otro plato ${n >= 3 ? 'ya salió' : 'todavía no sale'}`]);

    /* ── Dónde está cada bocado, medido ── */
    const donde = b => {
      if (!b.ve) return 'no';
      if (b.enPanza) return 'panza';
      const f = x.frascos.findIndex(q => b.c[0] - b.r >= q.caja.x0 - 0.5 && b.c[0] + b.r <= q.caja.x1 + 0.5 && b.c[1] - b.r >= q.caja.y0 - 0.5 && b.c[1] + b.r <= q.caja.y1 + 0.5);
      return f >= 0 ? 'frasco' + f : 'afuera';
    };
    const espera = b => {
      if (b.cual === 'kenia' ? n === 1 : n === 3) return 'panza';
      if (b.cual === 'kenia' ? n === 2 : n >= 4) return 'frasco' + VA[b.de][0];
      return 'no';
    };
    const malos = x.bocados.filter(b => VA[b.de] && donde(b) !== espera(b));
    r.push([malos.length === 0, `paso ${n}: cada bocado está donde le toca (en el plato sin verse, en la panza o en SU frasco)`,
      malos.map(b => b.cual + ':' + b.de + ' ' + donde(b) + ' ≠ ' + espera(b))]);
    const visibles = x.bocados.filter(b => b.ve);
    const pegados = [];
    visibles.forEach((a, i) => visibles.slice(i + 1).forEach(b => { if (Math.hypot(a.c[0] - b.c[0], a.c[1] - b.c[1]) < a.r + b.r - 0.5) pegados.push(a.de + '/' + b.de); }));
    r.push([pegados.length === 0, `paso ${n}: ningún bocado se monta encima de otro, así se pueden contar`, pegados]);

    /* ── La panza llena, las dos veces a la misma raya ── */
    const enPanza = visibles.filter(b => b.enPanza);
    r.push([x.llena.ve === (n === 1 || n === 3), `paso ${n}: la raya de «llena» ${n === 1 || n === 3 ? 'está' : 'no está'}`]);
    if (n === 1 || n === 3) {
      r.push([enPanza.length === 8, `paso ${n}: los ocho bocados están en la panza`, enPanza.length]);
      const tope = Math.min(...enPanza.map(b => b.c[1] - b.r));
      r.push([tope - x.llena.y >= 0 && tope - x.llena.y <= 4, `paso ${n}: la panza llega justo a la raya de «llena»`, Math.round((tope - x.llena.y) * 10) / 10]);
      r.push([x.llena.x0 >= x.panza.x0 - 1 && x.llena.x1 <= x.panza.x1 + 1 && x.llena.x1 - x.llena.x0 >= 0.6 * (x.panza.x1 - x.panza.x0) && x.llena.y >= x.panza.y0,
        `paso ${n}: la raya cruza la panza por dentro`]);
      /* Del plato a la panza se pasa por la boca: el primer tramo termina en
         la boca y el segundo arranca cuando el primero acabó. */
      const boca = cen(x.boca), lejos = enPanza.filter(b => Math.hypot(b.pasa[0] - boca[0], b.pasa[1] - boca[1]) > 4);
      r.push([lejos.length === 0, `paso ${n}: cada bocado pasa por la boca de Kenia antes de bajar a la panza`, lejos.map(b => b.de + ' ' + b.pasa.map(Math.round))]);
      r.push([enPanza.every(b => b.d2 - b.d >= 800), `paso ${n}: baja cuando ya llegó a la boca, no antes`, enPanza.map(b => b.d2 - b.d)]);
      const dm = Math.max(...enPanza.map(b => b.d2));
      r.push([x.llena.d >= dm + 400, `paso ${n}: la raya aparece cuando el último bocado ya va bajando`, [x.llena.d, dm]]);
    } else r.push([enPanza.length === 0, `paso ${n}: la panza no tiene bocados que contar`, enPanza.length]);
    if (n === 2 || n === 4) r.push([visibles.every(b => b.d2 === b.d && Math.hypot(b.pasa[0] - b.c[0], b.pasa[1] - b.c[1]) < 0.5),
      `paso ${n}: de la panza a su frasco, cada bocado va derecho`]);

    /* ── Los frascos ── */
    const cuenta = [0, 1, 2, 3].map(f => visibles.filter(b => donde(b) === 'frasco' + f).length);
    const llegan = n === 2 || n >= 4;
    x.frascos.forEach(q => {
      const vacio = llegan && cuenta[q.f] === 0;
      r.push([q.vacio.ve === vacio && (!vacio || (nb(q.vacio.dice) === 'vacío' && enCaja(cen(q.vacio.caja), q.caja, 0))),
        `paso ${n}: el frasco ${q.f + 1} ${vacio ? 'dice «vacío», adentro' : 'no dice «vacío»'}`, [q.vacio.ve, cuenta[q.f]]]);
    });
    const vacios = x.frascos.filter(q => q.vacio.ve);
    if (n === 2) {
      r.push([cuenta[0] >= 6 && cuenta[1] === 1 && cuenta[2] === 0 && cuenta[3] === 0,
        'paso 2: casi todo va al mismo frasco, del frijol llega uno (casi nada, no nada) y dos quedan vacíos', cuenta]);
      const dm = Math.max(...visibles.map(b => b.d));
      r.push([dm === 0 || vacios.every(q => q.vacio.d >= dm), 'paso 2: «vacío» aparece cuando ya llegaron los bocados']);
    }
    if (n >= 4) r.push([cuenta.every(c => c >= 1) && cuenta[3] === Math.max(...cuenta) && cuenta[2] === 1,
      `paso ${n}: llega de los cuatro frascos; el de las frutas y verduras es el que más lleva, y el del aguacate uno`, cuenta]);

    /* ── El marcador ── */
    const cifra = nb(e.cifra), pal = nb(e.palabras);
    const M = [['?', 'si le llegó de todo'], ['llena', 'la panza de Kenia'], [String(vacios.length), 'frascos vacíos'],
      ['llena', 'igual que con el plato de Kenia'], [String(vacios.length), 'frascos vacíos'], ['?', 'qué frasco te quedó vacío']];
    r.push([cifra === M[n][0] && pal === M[n][1], `paso ${n}: el marcador dice lo que se ve («${M[n][0]}», ${M[n][1]})`, [cifra, pal]]);
    return r;
  },
  /* El Sistema Endocrino. «Por qué la hora importa».
     ⚠️ Nada se le cree a la escena. Los caminos se siguen en el dibujo: el
     cable va de la cabeza a una mano; la sangre baja de la glándula al
     corazón y de ahí sale a las dos manos y a los dos pies, y la mano del
     cable es la misma a la que llega la sangre. Quién llega primero se
     saca de la demora de cada tramo. El reloj se lee por su aguja (cuántas
     horas pasaron, y adónde apunta) y la barra se cuenta cuadro por
     cuadro; lo que la barra tiene a cada hora sale de cuándo se apaga cada
     cuadro, y el paso del tiempo de la aguja, del CSS de la misión. Con
     eso se comprueba lo que la historia dice: el día que se le pasa, a la
     hora de la toma todavía alcanza, y la cara cambia justo cuando la
     barra baja de la raya, horas después. ⚠️ Y la prueba no se regala: ni
     «hormona», ni «mensajero», ni «químico» ni «eléctrico», ni una
     glándula con nombre, ni «lejos», ni un número. */
  amReloj(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cerca = (a, b, t) => Math.abs(a - b) <= t;
    const cen = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const enCaja = (p, b, t) => p[0] >= b.x0 - t && p[0] <= b.x1 + t && p[1] >= b.y0 - t && p[1] <= b.y1 + t;
    /* Lo que no depende del dibujo, primero. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['hormona', 'hormonas', 'mensajero', 'mensajeros', 'químico', 'química', 'químicos', 'eléctrico', 'eléctrica', 'eléctricos',
      'impulso', 'impulsos', 'insulina', 'glucagón', 'glucosa', 'azúcar', 'adrenalina', 'cortisol', 'melatonina', 'tiroxina', 'yodo', 'yodada',
      'diabetes', 'bocio', 'páncreas', 'tiroides', 'hipófisis', 'hipotálamo', 'pineal', 'suprarrenales', 'timo', 'gónadas', 'homeostasis',
      'retroalimentación', 'receptor', 'receptores', 'cerradura', 'llave', 'lejos', 'lejano', 'lejana', 'conducto', 'conductos', 'exocrina',
      'exocrinas', 'endocrina', 'endocrinas', 'endocrino', 'nervioso', 'neuronas', 'nervios', 'crecer', 'crecimiento', 'sueño', 'estrés',
      'susto', 'peligro', 'corazón', 'receta', 'médico', 'metabolismo', 'energía', 'enanismo', 'gigantismo', 'ayuno', 'calcio', 'sudor',
      'glucemia', 'hipoglucemia', 'islotes', 'langerhans', 'cushing', 'hipotiroidismo', 'hipertiroidismo', 'huye', 'lucha'];
    const FRASES = ['poquita', 'glándula maestra', 'directo a la sangre', 'más lento', 'más rápido', 'duradero', 'duradera'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni «hormona», ni qué es, ni una glándula con nombre, ni «lejos»)`, malas]);
    const nums = dicho.match(/\d+/g) || [];
    r.push([nums.length === 0, `paso ${n}: ningún número`, nums]);
    const frase = nb(e.texto);
    const F = [['salen dos órdenes a la vez', 'una por un cable y otra por la sangre', '¿Cuál llega primero?'],
      ['La del cable llega enseguida', 'a un solo lugar: la mano', 'La de la sangre tarda', 'todo el cuerpo'],
      ['la orden del cable se acaba al instante', 'La de la sangre se queda un buen rato'],
      ['también va por la sangre', 'Se gasta durante el día', 'antes de que se acabe'],
      ['El día que se le pasa', 'no siente nada', 'Horas después ya no alcanza', 'ahí lo siente'],
      ['Por eso la hora importa', 'se nota tarde, también cuando falta', '¿Qué le dirías a su nieto?']];
    r.push([F[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${F[n].join(', ')})`, frase]);

    /* ── El paso del tiempo, del CSS de la misión: cuánto tarda la aguja en
       dar un día, y el tramo del cable ── */
    const css = fs.readFileSync(path.join(RAIZ, 'misiones/2y3ciclo-sistema-endocrino/css/sistema-endocrino.css'), 'utf8');
    const seg = re => { const q = re.exec(css); return q ? +q[1] * 1000 : NaN; };
    const msDia = seg(/\.se-dia\s*\{\s*transition:\s*transform\s+([\d.]+)s/), msMedio = seg(/\.se-medio\s*\{\s*transition:\s*transform\s+([\d.]+)s/);
    const msRapido = seg(/\.se-rapido\s*\{\s*transition:\s*stroke-dashoffset\s+([\d.]+)s/);
    const msHora = msDia / 24;

    /* ── Doña Nely ── */
    const radio = (x.cabeza.x1 - x.cabeza.x0) / 2, cCab = cen(x.cabeza);
    r.push([dist(cen(x.glandula), cCab) < radio - 3, `paso ${n}: la glándula está adentro de la cabeza`]);
    r.push([n <= 2 ? cerca(cen(x.vestido)[0], 160, 12) : x.vestido.x1 < x.reloj.c[0] - x.reloj.r - 8 && x.vestido.x1 < x.barra.tubo.x0,
      `paso ${n}: doña Nely ${n <= 2 ? 'va en el centro' : 'se corrió a la izquierda, sin tocar el reloj ni la barra'}`, Math.round(cen(x.vestido)[0])]);

    /* ── Los caminos, en el dibujo ── */
    const C = k => x.cables.find(q => q.k === k), O = k => x.ordenes.find(q => q.k === k);
    const ini = q => q.tramos[0].pts[0], fin = q => { const t = q.tramos[q.tramos.length - 1].pts; return t[t.length - 1]; };
    const c1 = C('cuello'), c2 = C('brazo');
    const o0 = O('cabeza-corazon'), oQ = O('brazo-quieto'), oH = O('al-hombro'), oC = O('brazo-cable'), oD = O('pierna-der'), oI = O('pierna-izq');
    r.push([enCaja(ini(c1), x.cabeza, 0) && dist(fin(c1), ini(c2)) < 1.5 && enCaja(fin(c2), x.mano, 2),
      `paso ${n}: el cable sale de la cabeza y llega a una mano, sin despegarse en el hombro`]);
    r.push([enCaja(ini(o0), x.glandula, 1.5) && enCaja(fin(o0), x.corazon, 3), `paso ${n}: la sangre baja de la glándula al corazón`]);
    r.push([[oQ, oH, oD, oI].every(q => enCaja(ini(q), x.corazon, 4)) && dist(fin(oH), ini(oC)) < 1.5 && enCaja(fin(oC), x.mano, 2) &&
      enCaja(fin(oQ), x.mano2, 2) && fin(oD)[1] > x.vestido.y1 + 12 && fin(oI)[1] > x.vestido.y1 + 12 && Math.abs(fin(oD)[0] - fin(oI)[0]) > 12,
      `paso ${n}: del corazón sale a las dos manos y a los dos pies, y una de esas manos es la del cable`]);
    /* Qué está encendido en cada paso. */
    const todo = q => q.tramos.every(t => t.dibujado), nada = q => q.tramos.every(t => !t.dibujado);
    r.push([n === 1 ? [c1, c2].every(q => q.ve && todo(q)) : [c1, c2].every(q => !q.ve) && (n !== 0 || [c1, c2].every(nada)),
      `paso ${n}: la orden del cable ${n === 1 ? 'se ve entera' : n === 0 ? 'todavía no sale' : 'ya se acabó'}`]);
    const ords = [o0, oQ, oH, oC, oD, oI];
    r.push([n === 1 || n === 2 ? ords.every(q => q.ve && todo(q)) : ords.every(q => !q.ve) && (n !== 0 || ords.every(nada)),
      `paso ${n}: la orden de la sangre ${n === 1 || n === 2 ? 'está en toda la sangre' : n === 0 ? 'todavía no sale' : 'ya no está'}`]);
    r.push([x.brillo === (n === 1), `paso ${n}: la glándula ${n === 1 ? 'manda' : 'no manda'}`]);
    r.push([x.nombres === (n <= 2), `paso ${n}: los nombres del cable, la sangre y la glándula ${n <= 2 ? 'están' : 'ya no están'}`]);
    if (n <= 2) {
      const [hg, hc, hs] = x.hilos;
      const cercaDe = (p, pts, t) => pts.some(q => dist(p, q) < t);
      r.push([dist(hg, cen(x.glandula)) < 6 && cercaDe(hc, c1.tramos[0].pts.concat(c2.tramos[0].pts), 4) && cercaDe(hs, oQ.tramos.flatMap(t => t.pts), 5),
        `paso ${n}: cada nombre apunta a lo suyo: la glándula, el cable y la sangre`]);
    }
    /* La mano se mueve cuando llega la orden del cable, y solo entonces. */
    const mc = cen(x.mano), ang = Math.atan2(mc[0] - x.hombro[0], mc[1] - x.hombro[1]) * 180 / Math.PI;
    r.push([n === 1 ? ang < -25 : ang > -18 && ang < -5, `paso ${n}: la mano ${n === 1 ? 'se movió' : 'está quieta'}`, Math.round(ang)]);
    if (n === 1) {
      const seguidos = (q, ms) => q.tramos.every((t, i) => i === 0 || cerca(t.demora, q.tramos[i - 1].demora + ms, 1));
      const llega = (q, ms) => q.tramos[q.tramos.length - 1].demora + ms;
      const cableLlega = llega(c2, msRapido), sangreLlega = llega(oC, 800), enCorazon = llega(o0, 800);
      r.push([c1.tramos.every(t => t.rapido) && cerca(c1.tramos[0].demora, 0, 1) && cerca(c2.tramos[0].demora, llega(c1, msRapido), 1) &&
        cerca(o0.tramos[0].demora, 0, 1) && ords.every(q => seguidos(q, 800)) && [oQ, oH, oD, oI].every(q => cerca(q.tramos[0].demora, enCorazon, 1)) &&
        cerca(oC.tramos[0].demora, llega(oH, 800), 1),
        'paso 1: las dos órdenes salen a la vez; la de la sangre pasa por el corazón y de ahí sale a todas partes']);
      r.push([sangreLlega >= 3 * cableLlega && x.brazo.d === cableLlega,
        'paso 1: a la misma mano, el cable llega mucho antes que la sangre, y la mano se mueve justo cuando llega el cable', [cableLlega, sangreLlega, x.brazo.d]]);
    }

    /* ── El reloj ── */
    const R = x.reloj;
    r.push([R.ve === (n >= 3) && x.barra.ve === (n >= 3), `paso ${n}: el reloj y la barra ${n >= 3 ? 'están' : 'todavía no'}`]);
    const angulo = p => ((Math.atan2(p[0] - R.c[0], -(p[1] - R.c[1])) * 180 / Math.PI) + 360) % 360;
    r.push([cerca(angulo(R.marca), 240, 3) && dist(R.marca, R.c) > R.r, `paso ${n}: su hora está marcada afuera del reloj, en las ocho`, Math.round(angulo(R.marca))]);
    const horas = (R.giro1 + R.giro2 - 240) / 30;
    const horasDebe = n <= 2 ? 0 : n === 3 ? 24 : 60;
    r.push([cerca(horas, horasDebe, 0.01) && cerca(angulo(R.punta), angulo(R.marca), 3),
      `paso ${n}: la aguja lleva ${horasDebe} horas y apunta a su hora`, [horas, Math.round(angulo(R.punta))]]);
    if (n >= 3) {
      const rh = x.rotulos.find(t => t.k === 'hora');
      r.push([rh && rh.ve && rh.dice === 'su hora' && dist(cen(rh.caja), R.marca) < 18, `paso ${n}: «su hora» junto a la marca`]);
    }

    /* ── La barra: se cuenta cuadro por cuadro ── */
    const B = x.barra, cel = B.celdas.slice().sort((a, b) => b.caja.y0 - a.caja.y0);
    r.push([cel.every((c, i) => c.k === i + 1 && enCaja(cen(c.caja), B.tubo, 0)), `paso ${n}: ocho cuadros, uno sobre otro, adentro de la barra`]);
    const falta = cel.filter(c => cen(c.caja)[1] > B.raya.y).length;
    r.push([falta === 3 && B.raya.corta && B.raya.x0 >= B.tubo.x0 - 1 && B.raya.x1 <= B.tubo.x1 + 1 &&
      cel[falta - 1].caja.y0 >= B.raya.y - 1.5 && cel[falta].caja.y1 <= B.raya.y + 1.5,
      `paso ${n}: la raya de lo que hace falta va cortada, entre el tercer cuadro y el cuarto`, falta]);
    const rf = x.rotulos.filter(t => t.k === 'falta'), rb = x.rotulos.find(t => t.k === 'barra');
    if (n >= 3) r.push([rf.map(t => t.dice).join(' ') === 'lo que hace falta' && rf.every(t => t.caja.x1 < B.tubo.x0 && Math.abs(cen(t.caja)[1] - B.raya.y) < 14) &&
      rb.dice === 'en su sangre' && rb.caja.y1 <= B.tubo.y0 && cerca(cen(rb.caja)[0], cen(B.tubo)[0], 2),
      `paso ${n}: la barra dice «en su sangre», y su raya, «lo que hace falta»`]);
    const lit = cel.filter(c => c.ve).length;
    r.push([cel.every((c, i) => c.ve === (i < lit)), `paso ${n}: los cuadros encendidos van de abajo hacia arriba, sin huecos`, lit]);
    if (n >= 3) r.push([n === 3 ? lit === 8 : lit < falta, `paso ${n}: en su sangre ${n === 3 ? 'la barra está llena' : 'ya no alcanza'}`, lit]);
    /* La cara, y la toma que viaja a la boca. */
    r.push([x.cara.bien === (n <= 3) && x.cara.mal === (n >= 4) && x.cara.gota === (n >= 4), `paso ${n}: doña Nely ${n <= 3 ? 'está bien' : 'lo siente'}`]);
    r.push([!(x.toma.sale && x.toma.va), `paso ${n}: la cápsula de la toma no se queda a la vista`]);
    if (n >= 3 && x.cara.boca) r.push([dist(x.toma.c, cen(x.cara.boca)) < 5, `paso ${n}: la toma llegó a la boca`, dist(x.toma.c, cen(x.cara.boca))]);
    if (n <= 2) r.push([dist(x.toma.c, R.marca) < 1.5, `paso ${n}: la toma espera en su marca`]);
    r.push([x.olvido.ve === (n >= 4) && dist(x.olvido.c, R.marca) < 1.5 && x.olvido.tache, `paso ${n}: la toma que se le pasó ${n >= 4 ? 'está en su marca, con su ✗' : 'todavía no'}`]);

    /* ── Cuándo pasa cada cosa (se mide al llegar al paso) ── */
    const A = k => cel[k - 1].piezas[0], S = k => cel[k - 1].piezas[1];
    if (n === 3) {
      const d1 = R.d1, dl = 6 * msHora;
      r.push([[8, 7, 6, 5].every((k, i) => cerca(A(k).d, d1 + (i + 1) * dl, 1)) && cerca(msMedio, 12 * msHora, 1),
        'paso 3: la barra pierde un cuadro cada seis horas del reloj', [8, 7, 6, 5].map(k => A(k).d)]);
      const fin = d1 + 4 * dl;
      r.push([cerca(x.toma.dSale, fin, 1) && x.toma.dViaja >= x.toma.dSale && x.toma.dVa >= x.toma.dViaja + 800 &&
        [5, 6, 7, 8].every((k, i, a) => S(k).d > x.toma.dVa && (i === 0 || S(k).d > S(a[i - 1]).d)),
        'paso 3: a las ocho del día siguiente llega la otra toma, y la barra se vuelve a llenar después de tomarla']);
    }
    if (n === 4) {
      const d1 = R.d1, dl = 6 * msHora;
      r.push([[8, 7, 6, 5].every((k, i) => cerca(S(k).d, d1 + (i + 1) * dl, 1)), 'paso 4: pasa otro día, un cuadro cada seis horas']);
      const d2 = R.d2, olv = x.olvido.d;
      r.push([olv >= d1 + 4 * dl && d2 >= olv && cerca(A(4).d, d2 + dl, 1) && cerca(A(3).d, d2 + 2 * dl, 1),
        'paso 4: a las ocho se le pasa la toma; la barra sigue bajando con el reloj']);
      /* Cuántos cuadros quedan a una hora: los que se apagan después. */
      const quedan = t => cel.filter((c, i) => { const k = i + 1; const sale = k <= 2 ? Infinity : k <= 4 ? A(k).d : S(k).d; return sale > t; }).length;
      const primera = [A(3).d, A(4).d].concat([5, 6, 7, 8].map(k => S(k).d)).sort((a, b) => a - b).find(t => quedan(t) < falta);
      /* La hora del reloj a un momento del paso: la aguja da el día, se
         para en las ocho mientras sale la ✗, y sigue. */
      const horaDe = t => t <= d1 + msDia ? (t - d1) / msHora : t < d2 ? 24 : 24 + (t - d2) / msHora;
      const tarde = horaDe(primera) - horaDe(olv);
      r.push([quedan(olv) >= falta && cerca(x.cara.dMal, primera, 1) && cerca(x.cara.dBien, primera, 1) && tarde >= 6,
        'paso 4: a la hora de la toma todavía le alcanza, y la cara cambia justo cuando la barra baja de la raya, horas después',
        { alaHora: quedan(olv), cara: x.cara.dMal, baja: primera, horasDespues: tarde }]);
    }

    /* ── Lo que dice el marcador ── */
    const cifra = nb(e.cifra), pal = nb(e.palabras);
    const MARC = [['?', 'qué orden llega primero'], ['el cable', 'llega primero, y a un solo lugar'], ['la sangre', 'se queda un buen rato'],
      ['alcanza', 'la de cada mañana llega a tiempo'], ['horas después', 'se siente la toma que se le pasó'], ['?', 'qué le dirías a su nieto']];
    const cuadra = n === 3 ? lit >= falta && x.cara.bien : n === 4 ? x.cara.mal : true;
    r.push([cifra === MARC[n][0] && pal === MARC[n][1] && cuadra, `paso ${n}: el marcador dice «${cifra}», y es lo que se ve`, [cifra, pal]]);

    /* ── El aviso del esquema ── */
    const re = x.rotulos.filter(t => t.k === 'esquema');
    r.push([re.length === 2 && re.every(t => t.ve) && re.map(t => t.dice).join(' ') === 'Es un esquema: los tiempos no son los de verdad.',
      `paso ${n}: el aviso de que los tiempos no son los de verdad`]);
    return r;
  },
  /* El Sistema Nervioso. «El atajo de la médula».
     ⚠️ Nada se le cree a la escena. Las señales se siguen en el dibujo:
     el aviso nace en los dedos y llega a la médula, pasando por el codo y
     el hombro sin despegarse aunque el brazo gire; la orden sale de la
     médula y termina en el músculo del brazo; el camino al cerebro sale de
     la médula, sube por ella y termina adentro del cerebro. Todas corren a
     paso parejo: tramos del mismo largo. La mano se mide contra el comal:
     cerca sin tocarlo, tocándolo, y bien lejos cuando la orden ya llegó;
     el «¡Ay!» sale cuando la mano ya está afuera. El camino que pasaría por
     el cerebro se mide contra el atajo, sumando sus tramos. ⚠️ Y la prueba
     no se regala: ni el nombre del atajo, ni el tipo de neurona, ni
     «estímulo», ni una velocidad, ni un número de más. */
  amAtajo(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cerca = (a, b, t) => Math.abs(a - b) <= t;
    const cen = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    /* Lo que no depende del dibujo, primero. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['reflejo', 'reflejos', 'arco', 'sensorial', 'sensoriales', 'motora', 'motoras', 'motor', 'aferente', 'aferentes', 'eferente',
      'eferentes', 'interneurona', 'estímulo', 'estimulo', 'receptor', 'efector', 'neurona', 'neuronas', 'sinapsis', 'axón', 'axon', 'dendrita',
      'dendritas', 'mielina', 'simpático', 'parasimpático', 'autónomo', 'voluntario', 'involuntario', 'central', 'periférico', 'snc', 'snp',
      'encéfalo', 'cerebelo', 'tronco', 'bulbo', 'cráneo', 'columna', 'vertebral', 'segundos', 'milisegundos', 'metros', 'velocidad', 'impulso',
      'impulsos', 'dopamina', 'serotonina', 'acetilcolina', 'gaba', 'alzheimer', 'parkinson', 'epilepsia', 'demencia', 'ataxia', 'casco',
      'hemisferios', 'taza', 'plancha', 'olla', 'vidrio', 'rodilla', 'meninges', 'corteza'];
    const FRASES = ['sí mismo'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni el nombre del atajo, ni el tipo de neurona, ni «estímulo»)`, malas]);
    const nums = (dicho.match(/\d+/g) || []).map(Number);
    r.push([nums.every(k => k === 1 || k === 2), `paso ${n}: ningún número de la prueba`, nums.filter(k => k !== 1 && k !== 2)]);
    const frase = nb(e.texto);
    const F = [['Marvin acerca la mano al comal caliente', '¿Quién da la orden de quitarla'],
      ['La mano toca el comal', 'Un aviso sale de los dedos', 'hasta la médula espinal'],
      ['En la médula salen dos caminos a la vez', 'orden baja por otro nervio al músculo', 'la mano se quita', 'el aviso sigue al cerebro'],
      ['El cerebro necesita un momento para darse cuenta', 'llegan el susto y el dolor', 'la mano ya estaba afuera'],
      ['Si la orden tuviera que salir del cerebro', 'el camino sería más largo', 'La mano seguiría en el comal'],
      ['El atajo vive en la médula', 'más abajo que el cerebro', '¿Qué más hace tu cuerpo sin que lo decidas?']];
    r.push([F[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${F[n].join(', ')})`, frase]);

    /* ── El cerebro, la médula y el comal ── */
    const M0 = x.medula[0], M1 = x.medula[1], mx = M0[0];
    const enMedula = p => cerca(p[0], mx, 2) && p[1] >= M0[1] - 1 && p[1] <= M1[1] + 1;
    const enCaja = (p, b, t) => p[0] >= b.x0 - t && p[0] <= b.x1 + t && p[1] >= b.y0 - t && p[1] <= b.y1 + t;
    r.push([cerca(M0[0], M1[0], 0.3) && M1[1] - M0[1] > 80 && M0[1] - x.cerebro.caja.y1 < 20 && M0[1] > x.cerebro.c[1] &&
      mx > x.cuerpo.x0 && mx < x.cuerpo.x1 && M1[1] > x.cuerpo.y0 + 60, `paso ${n}: la médula baja derecha desde el cerebro, por dentro de la espalda`]);
    r.push([enCaja(x.cerebro.c, x.cabeza, 0) && x.cerebro.caja.y1 < x.cabeza.y1 && x.cerebro.caja.x0 > x.cabeza.x0 - 1, `paso ${n}: el cerebro está adentro de la cabeza`]);
    const hueco = x.comal.arriba - x.mano.y1;
    const sobreComal = cen(x.mano)[0] > x.comal.x0 && cen(x.mano)[0] < x.comal.x1;
    const manoDebe = n === 0 ? hueco > 3 && hueco < 20 && sobreComal : n === 1 ? hueco > -2 && hueco < 2.5 && sobreComal : hueco > 40;
    r.push([manoDebe, `paso ${n}: la mano ${n === 0 ? 'está cerca del comal sin tocarlo' : n === 1 ? 'toca el comal' : 'ya está lejos del comal'}`, Math.round(hueco * 10) / 10]);

    /* ── Las señales, en el dibujo ── */
    const S = k => x.senales.find(q => q.k === k);
    const pts = q => [].concat(...q.tramos.map(t => t.pts));
    const ini = q => q.tramos[0].pts[0], fin = q => { const t = q.tramos[q.tramos.length - 1].pts; return t[t.length - 1]; };
    const dib = q => q.tramos.every(t => t.dibujado), nada = q => q.tramos.every(t => !t.dibujado);
    const L = q => q.tramos.reduce((a, t) => a + t.largo, 0);
    const AM = S('aviso-mano'), AB = S('aviso-brazo'), AC = S('aviso-cuerpo'), OC = S('orden-cuerpo'), OB = S('orden-brazo'), CE = S('cerebro'), LA = S('largo');
    r.push([enCaja(ini(AM), x.mano, 3) && dist(fin(AM), ini(AB)) < 1.5 && dist(fin(AB), ini(AC)) < 1.5 && enMedula(fin(AC)),
      `paso ${n}: el aviso nace en los dedos y llega a la médula sin despegarse en el codo ni en el hombro`, [ini(AM), fin(AC)].map(p => p.map(Math.round))]);
    r.push([enMedula(ini(OC)) && dist(fin(OC), ini(OB)) < 1.5 && enCaja(fin(OB), x.musculo, 3), `paso ${n}: la orden sale de la médula y termina en el músculo del brazo`]);
    r.push([enMedula(ini(CE)) && dist(ini(CE), fin(AC)) < 6 && pts(CE).slice(0, -2).every(p => cerca(p[0], mx, 3) || p[1] < M0[1] + 2) && enCaja(fin(CE), x.cerebro.caja, 0),
      `paso ${n}: el camino al cerebro sale de donde llegó el aviso, sube por la médula y termina adentro del cerebro`]);
    const puntaBien = q => q.punta && dist(q.punta.p, fin(q)) < 1;
    r.push([puntaBien(AC) && puntaBien(OB) && puntaBien(CE) && puntaBien(LA), `paso ${n}: cada camino lleva su flecha en la punta, hacia donde va`]);
    /* A paso parejo: todos los tramos miden casi lo mismo. */
    const todos = [AM, AB, AC, OC, OB, CE, LA].flatMap(q => q.tramos.map(t => t.largo));
    const med = todos.slice().sort((a, b) => a - b)[Math.floor(todos.length / 2)];
    r.push([todos.every(v => v > med * 0.45 && v < med * 1.6), `paso ${n}: las señales corren a paso parejo: tramos de largos parecidos`, todos.map(Math.round)]);
    /* ⚠️ Y en el paso 2 los dos caminos salen de la médula a la vez, y el
       aviso NO llega al cerebro antes de que la orden llegue al músculo:
       si llegara antes, el que mira concluye que el cerebro sí tuvo tiempo.
       Cada tramo tarda lo mismo, así que se mira cuándo arranca cada uno. */
    if (n === 2) {
      const sale = q => Math.min(...q.tramos.map(t => t.demora)), llega = q => Math.max(...q.tramos.map(t => t.demora)) + 800;
      r.push([sale(CE) === sale(OC) && llega(CE) >= llega(OB),
        'paso 2: la orden y el aviso al cerebro salen a la vez, y el aviso no llega arriba antes de que la orden llegue al músculo',
        { sale: [sale(OC), sale(CE)], llega: [llega(OB), llega(CE)] }]);
    }
    /* Qué está encendido en cada paso. */
    const avisoVe = n >= 1, ordenVe = n >= 2;
    r.push([[AM, AB, AC].every(q => avisoVe ? dib(q) && (!q.punta || q.punta.ve) : nada(q) && (!q.punta || !q.punta.ve)),
      `paso ${n}: el aviso ${avisoVe ? 'se ve entero, hasta la médula' : 'todavía no sale'}`]);
    r.push([[OC, OB, CE].every(q => ordenVe ? dib(q) && (!q.punta || q.punta.ve) : nada(q) && (!q.punta || !q.punta.ve)),
      `paso ${n}: la orden y el camino al cerebro ${ordenVe ? 'se ven' : 'todavía no salen'}`]);
    r.push([n === 4 ? dib(LA) && LA.punta.ve : nada(LA) && !LA.punta.ve, `paso ${n}: el camino que pasaría por el cerebro ${n === 4 ? 'se ve' : 'no está'}`]);
    /* El camino largo sale de la médula, sube hasta el cerebro, vuelve a
       bajar y va al brazo; se mide contra el atajo. */
    const P = pts(LA);
    r.push([cerca(ini(LA)[0], mx, 10) && dist(ini(LA), fin(AC)) < 12 && Math.min(...P.map(p => p[1])) < x.cerebro.caja.y1 && dist(fin(LA), ini(OB)) < 6,
      `paso ${n}: el camino largo sale de la médula, sube al cerebro y vuelve a bajar hasta el brazo`]);
    const atajo = L(AM) + L(AB) + L(AC) + L(OC) + L(OB), largo = L(AM) + L(AB) + L(AC) + L(LA) + L(OB);
    r.push([largo > 1.3 * atajo, `paso ${n}: el camino por el cerebro es mucho más largo que el atajo`, [largo, atajo].map(Math.round)]);

    /* ── El cerebro se da cuenta, con la mano ya afuera ── */
    r.push([x.piensa.ve === (n === 3) && (n !== 3 || x.piensa.caja.y1 < x.cabeza.y0 + 4), `paso ${n}: ${n === 3 ? 'el cerebro se está dando cuenta' : 'no hay puntos de pensar'}`]);
    r.push([x.ay.ve === (n >= 3) && nb(x.ay.dice) === '¡Ay!' && x.ay.caja.x0 > x.cabeza.x1 - 12 && x.ay.caja.x0 - x.cabeza.x1 < 30 && x.ay.caja.y1 < x.cabeza.y1 + 6 &&
      (n < 3 || hueco > 40), `paso ${n}: el «¡Ay!» ${n >= 3 ? 'sale junto a la cabeza, con la mano ya lejos del comal' : 'todavía no sale'}`]);

    /* ── Los rótulos ── */
    const rot = k => x.rotulos.filter(q => q.k === k);
    const r1 = k => rot(k)[0];
    const rc = r1('cerebro'), rm = rot('medula').concat(rot('medula2'));
    r.push([rc && rc.ve && nb(rc.dice) === 'el cerebro' && rc.caja.x0 > x.cabeza.x1 - 10 && rc.caja.y1 < x.cabeza.y1, `paso ${n}: «el cerebro» va junto a la cabeza`]);
    r.push([rm.map(q => nb(q.dice)).join(' ') === 'la médula espinal' && rm.every(q => q.ve && q.caja.x1 < mx && q.caja.y0 > M0[1] && q.caja.y1 < M1[1]),
      `paso ${n}: «la médula espinal» va a la izquierda de la médula, a su altura`]);
    const lento = rot('lento');
    r.push([lento.length === 2 && lento.every(q => q.ve) && lento.map(q => nb(q.dice)).join(' ') === 'Aquí va en cámara lenta: de verdad es un instante.',
      `paso ${n}: el aviso de la cámara lenta`]);
    const ra = r1('atajo'), rl = r1('largo');
    r.push([x.nombres === (n === 4) && ra && rl && nb(ra.dice) === 'el atajo' && nb(rl.dice) === 'si esperara al cerebro', `paso ${n}: los nombres de los dos caminos ${n === 4 ? 'se ven' : 'no están'}`]);

    /* ── El marcador cuenta en el dibujo ── */
    const desdeMedula = [OC, CE].filter(q => dib(q)).length;
    const mk = {
      0: ['?', 'quién da la orden de quitar la mano'],
      1: [String([AM].filter(dib).length), 'camino: de la mano a la médula'],
      2: [String(desdeMedula), 'caminos salen de la médula: al músculo y al cerebro'],
      3: ['¡Ay!', 'el dolor llega con la mano ya afuera'],
      4: ['más largo', 'el camino si esperara al cerebro'],
      5: ['?', 'qué más hace tu cuerpo sin que lo decidas']
    };
    r.push([nb(e.cifra) === mk[n][0] && nb(e.palabras) === mk[n][1], `paso ${n}: el marcador dice «${mk[n][0]}» · ${mk[n][1]}`, [e.cifra, e.palabras]]);
    return r;
  },
  /* Geografía de Honduras. «¿A qué mar baja el río?».
     ⚠️ Nada se le cree a la escena. El perfil se lee del dibujo: tiene que
     subir sin parar desde cada mar hasta lo más alto y bajar sin parar
     hasta el otro (si no, el agua se quedaría atrapada y «el agua siempre
     baja» mentiría), con lo más alto más cerca del Pacífico. La raya de lo
     más alto va donde el perfil llega arriba. Cada camino de agua se sigue
     punto por punto: pegado al suelo, siempre hacia abajo y alejándose de
     lo más alto, hasta terminar adentro de su mar; y el mar lo dice su
     nombre, no el de la escena. De ahí sale lo demás: que las dos gotas
     caigan juntas y terminen en mares distintos, que cada lado tenga su
     nombre adentro, que el río de la escuela sea largo y el del sur corto,
     que la tormenta caiga río arriba de la escuela y el río crecido pase
     por ella, y lo que cuenta el marcador. ⚠️ Y la prueba no se regala: ni
     el nombre de un río, ni del golfo, ni de un país vecino, ni llanuras ni
     valles, ni el clima, ni un mes, ni un número de más. */
  amCorte(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cerca = (a, b, t) => Math.abs(a - b) <= t;
    const cen = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    /* Lo que no depende del dibujo, primero. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['ulúa', 'ulua', 'chamelecón', 'chamelecon', 'aguán', 'aguan', 'patuca', 'coco', 'segovia', 'choluteca', 'goascorán', 'goascoran',
      'nacaome', 'sula', 'fonseca', 'golfo', 'llanura', 'llanuras', 'valle', 'valles', 'cordillera', 'cordilleras', 'merendón', 'merendon', 'celaque',
      'minas', 'nicaragua', 'guatemala', 'salvador', 'belice', 'méxico', 'mexico', 'tegucigalpa', 'comayagüela', 'comayaguela', 'lorenzo', 'cortés',
      'roatán', 'roatan', 'utila', 'guanaja', 'isla', 'islas', 'yojoa', 'caratasca', 'mosquitia', 'cajón', 'cajon', 'clima', 'cálido', 'calido',
      'fresco', 'seca', 'lluviosa', 'estación', 'mayo', 'octubre', 'noviembre', 'abril', 'municipio', 'municipios', 'región', 'regiones', 'corazón',
      'centroamérica', 'café', 'banano', 'bananos', 'camarones', 'melones', 'capital', 'occidental', 'oriental', 'cabecera', 'puerto', 'puertos',
      'caudaloso', 'caudalosos', 'kilómetros', 'km', 'lago', 'laguna', 'represa'];
    const FRASES = ['tres cuartas', 'nombre de dios', 'el salvador', 'distrito central', 'la esperanza', 'santa rosa'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni un río, ni el golfo, ni un país vecino, ni llanuras, ni valles)`, malas]);
    const nums = (dicho.match(/\d+/g) || []).map(Number);
    r.push([nums.every(k => k === 2), `paso ${n}: ningún número de la prueba`, nums.filter(k => k !== 2)]);
    const frase = nb(e.texto);
    const F = [['cortada de norte a sur', 'La escuela está junto a un río', '¿Ese río baja al Caribe o al Pacífico?'],
      ['El agua siempre baja', 'Dos gotas caen juntas en lo más alto', 'una baja al Caribe', 'al Pacífico'],
      ['Lo más alto parte el país en dos lados', 'del lado norte baja al Caribe', 'del sur, al Pacífico', 'Cada lado es una vertiente'],
      ['La escuela está del lado norte de lo más alto', 'Su río baja cuesta abajo hasta el Caribe'],
      ['Lo más alto queda cerca del Pacífico', 'los ríos que bajan al Caribe son largos', 'al Pacífico, cortos'],
      ['llueve río arriba', 'pasa por la escuela', 'la radio pide que se mueva la gente de las riberas'],
      ['Saber de qué lado estás', 'adónde baja tu río', 'la radio nombra departamentos', '¿en cuál está tu escuela?', 'Búscalo en el mapa']];
    r.push([F[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${F[n].join(', ')})`, frase]);

    /* ── El perfil, los mares y lo más alto ── */
    const S = x.superficie.slice().sort((a, b) => a[0] - b[0]);
    const iTop = S.reduce((m, p, i) => p[1] < S[m][1] ? i : m, 0), top = S[iTop];
    const suelo = xx => { for (let i = 1; i < S.length; i++) if (xx >= S[i - 1][0] && xx <= S[i][0]) { const a = S[i - 1], b = S[i]; return b[0] === a[0] ? a[1] : a[1] + (b[1] - a[1]) * (xx - a[0]) / (b[0] - a[0]); } return null; };
    const mar = k => x.mares.find(q => q.k === k);
    const MC = mar('caribe'), MP = mar('pacifico');
    const nivel = MC.caja.y0;
    r.push([cerca(MP.caja.y0, nivel, 0.3) && MC.caja.x1 < top[0] && MP.caja.x0 > top[0], `paso ${n}: un mar a cada lado, al mismo nivel`]);
    r.push([cerca(S[0][1], nivel, 0.6) && S[0][0] <= MC.caja.x1 + 0.5 && cerca(S[S.length - 1][1], nivel, 0.6) && S[S.length - 1][0] >= MP.caja.x0 - 0.5,
      `paso ${n}: la tierra empieza y termina en el mar`, [S[0], S[S.length - 1]].map(p => p.map(Math.round))]);
    const sube = S.slice(1, iTop + 1).every((p, i) => p[1] <= S[i][1] + 0.05), baja = S.slice(iTop + 1).every((p, i) => p[1] >= S[iTop + i][1] - 0.05);
    r.push([sube && baja, `paso ${n}: la tierra sube sin parar hasta lo más alto y baja sin parar hasta el otro mar: el agua no se queda atrapada`]);
    const aCar = top[0] - S[0][0], aPac = S[S.length - 1][0] - top[0];
    r.push([aPac < 0.6 * aCar, `paso ${n}: lo más alto queda más cerca del Pacífico`, [aCar, aPac].map(Math.round)]);
    const rot = k => x.rotulos.filter(q => q.k === k);
    const r1 = k => rot(k)[0];
    const rc = r1('caribe'), rp = r1('pacifico'), rn = r1('norte'), rs = r1('sur');
    r.push([rc && nb(rc.dice) === 'mar Caribe' && rc.ve && rc.caja.x0 < MC.caja.x1 && rc.caja.x1 < top[0] && rc.caja.y0 > MC.caja.y1 &&
      rp && nb(rp.dice) === 'océano Pacífico' && rp.ve && rp.caja.x1 > MP.caja.x0 && rp.caja.x0 > S[0][0] && rp.caja.y0 > MP.caja.y1,
      `paso ${n}: cada mar lleva su nombre debajo: el Caribe a la izquierda, el Pacífico a la derecha`]);
    r.push([rn && rs && nb(rn.dice) === '← norte' && nb(rs.dice) === 'sur →' && cen(rn.caja)[0] < top[0] && cen(rs.caja)[0] > top[0],
      `paso ${n}: el norte del lado del Caribe y el sur del lado del Pacífico`]);
    const esc = rot('escala');
    r.push([esc.length === 2 && esc.every(q => q.ve) && esc.map(q => nb(q.dice)).join(' ') === 'Las montañas no van a su tamaño.',
      `paso ${n}: el aviso de que las montañas no van a su tamaño`]);
    const ray = x.cumbre.raya;
    r.push([x.cumbre.ve === (n >= 2) && cerca(ray[0][0], top[0], 1.2) && cerca(ray[1][0], top[0], 1.2) && Math.max(ray[0][1], ray[1][1]) <= top[1] + 0.5 &&
      top[1] - Math.max(ray[0][1], ray[1][1]) < 6 && (() => { const q = r1('cumbre'); return q && nb(q.dice) === 'lo más alto' && cerca(cen(q.caja)[0], top[0], 1.5) && q.caja.y1 < Math.min(ray[0][1], ray[1][1]); })(),
      `paso ${n}: la raya de lo más alto ${n >= 2 ? 'va sobre la cumbre, con su nombre' : 'todavía no está'}`]);

    /* ── La escuela, en la ladera del norte ── */
    const E = x.escuela, ex = (E.x0 + E.x1) / 2;
    const sE = suelo(ex);
    r.push([ex < top[0] && ex > S[0][0] && sE !== null && cerca(E.y1, sE, 3.5), `paso ${n}: la escuela está parada en la ladera del norte`, [ex, E.y1, sE].map(Math.round)]);
    const re = r1('escuela');
    const hueco = (a, b) => Math.hypot(Math.max(0, a.x0 - b.x1, b.x0 - a.x1), Math.max(0, a.y0 - b.y1, b.y0 - a.y1));
    r.push([re && re.ve && nb(re.dice) === 'la escuela' && hueco(re.caja, E) < 10, `paso ${n}: «la escuela» va junto a la escuela`]);

    /* ── El agua: pegada al suelo, siempre hacia abajo, hasta su mar ── */
    const pegado = pts => pts.every(p => { const s0 = suelo(p[0]); return s0 === null || p[1] > nivel - 0.5 || (s0 - p[1] >= 0.5 && s0 - p[1] <= 4.5); });
    const marDe = p => [MC, MP].find(M => p[0] >= M.caja.x0 - 0.5 && p[0] <= M.caja.x1 + 0.5 && p[1] >= M.caja.y0 - 1 && p[1] <= M.caja.y1);
    const nombreMar = M => M === MC ? 'Caribe' : M === MP ? 'Pacífico' : null;
    const seguir = a => {
      const pts = [].concat(...a.tramos.map(t => t.pts));
      const hacia = Math.sign(pts[pts.length - 1][0] - pts[0][0]);
      const baja = pts.slice(1).every((p, i) => p[1] >= pts[i][1] - 0.05 && (p[0] - pts[i][0]) * hacia >= -0.05);
      const fin = pts[pts.length - 1];
      return { pts, baja, pegado: pegado(pts), mar: marDe(fin), dibujado: a.tramos.every(t => t.dibujado), nada: a.tramos.every(t => !t.dibujado),
        largo: a.tramos.reduce((s0, t) => s0 + t.largo, 0), ancho: Math.max(...a.tramos.map(t => t.ancho)), punta: a.punta, fin };
    };
    const bienHecho = (w, lado) => w.baja && w.pegado && w.mar && (lado === 'caribe' ? w.mar === MC : w.mar === MP) &&
      cerca(w.punta.p[0], w.fin[0], 1) && cerca(w.punta.p[1], w.fin[1], 1);

    /* Paso 0: el pedazo de río junto a la escuela, y las dos preguntas. */
    const T = x.trozo;
    r.push([T.ve && pegado(T.pts) && Math.min(...T.pts.map(p => p[0])) < ex && Math.max(...T.pts.map(p => p[0])) > ex && !T.pts.some(p => marDe(p)),
      `paso ${n}: junto a la escuela se ve su pedazo de río, pegado al suelo y lejos de los dos mares`]);
    const dudas = x.dudas;
    r.push([dudas.length === 2 && dudas.every(q => q.ve === (n === 0) && nb(q.dice) === '?') &&
      dudas.some(q => cen(q.caja)[0] < MC.caja.x1 + 2) && dudas.some(q => cen(q.caja)[0] > MP.caja.x0 - 2),
      `paso ${n}: ${n === 0 ? 'un «?» sobre cada mar' : 'ya no hay «?» sobre los mares'}`]);
    const rr = r1('rio');
    r.push([rr && rr.ve === (n === 0) && nb(rr.dice) === 'su río' && (n !== 0 || T.pts.some(p => Math.hypot(p[0] - cen(rr.caja)[0], p[1] - cen(rr.caja)[1]) < 16)),
      `paso ${n}: «su río» ${n === 0 ? 'va junto al pedazo de río' : 'ya no está'}`]);

    /* Paso 1: dos gotas caen juntas en lo más alto y bajan a mares distintos. */
    const B = { caribe: seguir(x.bajan.find(b => b.k === 'caribe')), pacifico: seguir(x.bajan.find(b => b.k === 'pacifico')) };
    r.push([x.nubeArriba.ve === (n === 1) && (n !== 1 || cerca(cen(x.nubeArriba.caja)[0], top[0], 4) && x.nubeArriba.caja.y1 < top[1]),
      `paso ${n}: ${n === 1 ? 'la nube está sobre lo más alto' : 'no hay nube sobre lo más alto'}`]);
    const G = x.gotas;
    if (n === 1) {
      const gc = G.find(g => g.k === 'caribe'), gp = G.find(g => g.k === 'pacifico');
      const cc = cen(gc.caja), cp = cen(gp.caja);
      /* Llegan al suelo y se vuelven el agua que baja: al terminar el paso
         ya no se ven, pero su sitio dice dónde cayeron. */
      r.push([!gc.ve && !gp.ve && cc[0] < top[0] && cp[0] > top[0] && cp[0] - cc[0] < 14 && gc.caja.y1 <= suelo(cc[0]) + 0.5 && suelo(cc[0]) - gc.caja.y1 < 7 &&
        gp.caja.y1 <= suelo(cp[0]) + 0.5 && suelo(cp[0]) - gp.caja.y1 < 7, 'paso 1: las dos gotas caen juntas, una a cada lado de lo más alto, llegan al suelo y se vuelven el agua que baja',
        [cc, cp].map(p => p.map(Math.round))]);
      r.push([bienHecho(B.caribe, 'caribe') && bienHecho(B.pacifico, 'pacifico') && B.caribe.dibujado && B.pacifico.dibujado && B.caribe.punta.ve && B.pacifico.punta.ve &&
        cerca(B.caribe.pts[0][0], cc[0], 1.5) && cerca(B.pacifico.pts[0][0], cp[0], 1.5),
        'paso 1: cada gota baja pegada al suelo, siempre hacia abajo, y termina en el mar de su lado',
        [nombreMar(B.caribe.mar), nombreMar(B.pacifico.mar)]]);
    } else {
      r.push([G.every(g => !g.ve) && B.caribe.nada && B.pacifico.nada && !B.caribe.punta.ve && !B.pacifico.punta.ve, `paso ${n}: las dos gotas del paso 1 ya no están`]);
    }

    /* Paso 2: los dos lados, cada uno con su nombre adentro. */
    const enPol = (pol, p) => { let c = false; for (let i = 0, j = pol.length - 1; i < pol.length; j = i++) {
      const a = pol[i], b = pol[j]; if (((a[1] > p[1]) !== (b[1] > p[1])) && p[0] < (b[0] - a[0]) * (p[1] - a[1]) / (b[1] - a[1]) + a[0]) c = !c; } return c; };
    const LN = x.lados.find(l => l.k === 'caribe'), LS = x.lados.find(l => l.k === 'pacifico');
    r.push([LN.ve === (n === 2) && LS.ve === (n === 2) && x.nombres === (n === 2), `paso ${n}: los dos lados ${n === 2 ? 'se ven, con sus nombres' : 'no están pintados'}`]);
    const xs = pol => pol.map(p => p[0]);
    r.push([cerca(Math.min(...xs(LN.pts)), S[0][0], 1) && cerca(Math.max(...xs(LN.pts)), top[0], 1) && cerca(Math.min(...xs(LS.pts)), top[0], 1) &&
      cerca(Math.max(...xs(LS.pts)), S[S.length - 1][0], 1), `paso ${n}: el lado del Caribe va de su costa a lo más alto, y el del Pacífico, de lo más alto a su costa`]);
    const dentroDe = (pol, k) => rot(k).every(q => enPol(pol, cen(q.caja)) && enPol(pol, [q.caja.x0 + 1, cen(q.caja)[1]]) && enPol(pol, [q.caja.x1 - 1, cen(q.caja)[1]]));
    const vc = rot('vertiente-caribe').concat(rot('vertiente-caribe2')), vp = rot('vertiente-pacifico').concat(rot('vertiente-pacifico2'));
    r.push([vc.map(q => nb(q.dice)).join(' ') === 'vertiente del Caribe' && vp.map(q => nb(q.dice)).join(' ') === 'vertiente del Pacífico' &&
      dentroDe(LN.pts, 'vertiente-caribe') && dentroDe(LN.pts, 'vertiente-caribe2') && dentroDe(LS.pts, 'vertiente-pacifico') && dentroDe(LS.pts, 'vertiente-pacifico2'),
      `paso ${n}: cada lado lleva su nombre adentro: vertiente del Caribe y vertiente del Pacífico`]);

    /* Paso 3 en adelante: el río de la escuela, hasta el Caribe. */
    const RN = seguir(x.rios.find(q => q.k === 'caribe')), RS = seguir(x.rios.find(q => q.k === 'pacifico'));
    const pasaPor = (w, xx) => w.pts.some((p, i) => i && (w.pts[i - 1][0] - xx) * (p[0] - xx) <= 0);
    r.push([bienHecho(RN, 'caribe') && pasaPor(RN, ex) && RN.pts[0][0] > ex && RN.pts[0][0] < top[0] && top[0] - RN.pts[0][0] < 16,
      `paso ${n}: el río de la escuela nace cerca de lo más alto, pasa por la escuela y baja hasta el Caribe`]);
    r.push([n >= 3 ? RN.dibujado && RN.punta.ve : RN.nada && !RN.punta.ve, `paso ${n}: el río de la escuela ${n >= 3 ? 'se ve entero, hasta el Caribe' : 'todavía no se ve entero'}`]);
    /* Paso 4: el del sur, corto; los nombres de los dos. */
    r.push([bienHecho(RS, 'pacifico') && RS.pts[0][0] > top[0] && RS.pts[0][0] - top[0] < 16, `paso ${n}: el río del sur nace cerca de lo más alto y baja hasta el Pacífico`]);
    r.push([n === 4 ? RS.dibujado && RS.punta.ve : RS.nada && !RS.punta.ve, `paso ${n}: el río del sur ${n === 4 ? 'se ve' : 'no está'}`]);
    r.push([RN.largo > 1.4 * RS.largo, `paso ${n}: el río que baja al Caribe es mucho más largo que el que baja al Pacífico`, [RN.largo, RS.largo].map(Math.round)]);
    const rl = r1('rio-largo'), rco = r1('rio-corto');
    r.push([x.largos === (n === 4) && rl && rco && nb(rl.dice) === 'río largo' && nb(rco.dice) === 'río corto' &&
      cen(rl.caja)[0] > S[0][0] && cen(rl.caja)[0] < top[0] && cen(rco.caja)[0] > top[0] && cen(rco.caja)[0] < S[S.length - 1][0],
      `paso ${n}: «río largo» del lado del Caribe y «río corto» del lado del Pacífico${n === 4 ? '' : ', que no se ven'}`]);

    /* Paso 5: la tormenta cae río arriba de la escuela, y el río crece desde ahí. */
    const TM = x.tormenta, CR = seguir(x.crecido);
    r.push([TM.ve === (n === 5), `paso ${n}: ${n === 5 ? 'llueve con el temporal' : 'no hay temporal'}`]);
    const lluviaX = TM.lluvia.map(l => l[1][0]);
    r.push([TM.lluvia.length >= 4 && TM.lluvia.every(l => { const s0 = suelo(l[1][0]); return s0 !== null && s0 - l[1][1] >= 0 && s0 - l[1][1] <= 4.5 && l[0][1] > TM.caja.y0; }) &&
      Math.min(...lluviaX) > ex + 10 && Math.max(...lluviaX) < top[0] && cen(TM.caja)[0] > ex && cen(TM.caja)[0] < top[0],
      `paso ${n}: la tormenta cae río arriba de la escuela, entre ella y lo más alto`]);
    r.push([bienHecho(CR, 'caribe') && pasaPor(CR, ex) && CR.pts[0][0] >= Math.min(...lluviaX) - 2 && CR.pts[0][0] <= Math.max(...lluviaX) + 2 && CR.ancho > RN.ancho * 1.5,
      `paso ${n}: el río crecido empieza donde llueve, pasa por la escuela y llega al Caribe, más ancho que el río de siempre`]);
    r.push([n >= 5 ? CR.dibujado && CR.punta.ve : CR.nada && !CR.punta.ve, `paso ${n}: el río crecido ${n >= 5 ? 'se ve' : 'no está'}`]);
    r.push([x.radio.ve === (n === 0 || n >= 5) && Math.hypot(cen(x.radio.caja)[0] - ex, cen(x.radio.caja)[1] - cen(E)[1]) < 35,
      `paso ${n}: la radio, junto a la escuela, ${n === 0 || n >= 5 ? 'suena' : 'no está'}`]);
    const rd = r1('departamento');
    r.push([rd && rd.ve === (n === 6) && nb(rd.dice) === '¿qué departamento?' && hueco(rd.caja, E) < 12,
      `paso ${n}: «¿qué departamento?» ${n === 6 ? 'junto a la escuela' : 'no está'}`]);

    /* ── El marcador cuenta en el dibujo ── */
    const maresGotas = new Set([B.caribe.mar, B.pacifico.mar].filter(Boolean)).size;
    const lados = [LN, LS].filter(l => l.ve).length;
    const mk = {
      0: ['?', 'adónde baja el río de la escuela'],
      1: [String(maresGotas), 'mares para dos gotas que cayeron juntas'],
      2: [String(lados), 'lados: la vertiente del Caribe y la del Pacífico'],
      3: [nombreMar(RN.mar), 'adonde baja el río de la escuela'],
      4: ['largos', 'los ríos del Caribe; los del Pacífico, cortos'],
      5: ['↓', 'la lluvia de río arriba pasa por la escuela'],
      6: ['?', 'en qué departamento está tu escuela']
    };
    r.push([nb(e.cifra) === mk[n][0] && nb(e.palabras) === mk[n][1], `paso ${n}: el marcador dice «${mk[n][0]}» · ${mk[n][1]}`, [e.cifra, e.palabras]]);
    return r;
  },
  /* El Universo y el Sistema Solar. «Cuándo le llueve a la parcela».
     ⚠️ Nada se le cree a la escena. El camino tiene que ser un círculo con
     el Sol en el centro (la Tierra no se acerca ni se aleja en ningún mes),
     con doce rayas a 30° una de otra, enero abajo y los meses contra las
     agujas del reloj, y el nombre de cada mes afuera, en la línea de su
     raya. La Tierra se busca en el camino y de su ángulo sale en qué mes
     está; ningún nombre de mes puede quedar debajo de ella. De ahí sale lo
     demás: qué marcas se ven (una por cada mes por el que ya pasó), que la
     de cada mes sea gota si su nombre va de mayo a octubre y sol si no, si
     le llueve a la parcela, los brotes cuando la lluvia entra y la milpa
     crecida cuando se va, y lo que cuenta el marcador. ⚠️ Y la prueba no se
     regala: ni traslación, ni rotación, ni estaciones, ni planeta, ni
     estrella, ni luz, ni un número de más. */
  amVuelta(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cerca = (a, b, t) => Math.abs(a - b) <= t;
    const cen = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const MESES = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const LARGOS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    /* Lo que dice la historia: a la parcela le llueve de mayo a octubre. Y lo
       que dice cada frase: dónde está la Tierra y cuántos meses lleva
       caminando desde el enero del principio. */
    const LLUVIOSOS = ['MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT'];
    const DONDE = [0, 4, 10, 0, 4, 4], CAMINADO = [0, 4, 10, 12, 16, 16];
    /* Lo que no depende del dibujo, primero. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['traslación', 'traslacion', 'rotación', 'rotacion', 'estación', 'estacion', 'estaciones', 'verano', 'invierno', 'primavera',
      'otoño', 'órbita', 'orbita', 'eje', 'inclinada', 'inclinado', 'inclinación', 'día', 'dia', 'días', 'dias', 'noche', 'noches', 'hora', 'horas',
      'minutos', 'planeta', 'planetas', 'estrella', 'estrellas', 'satélite', 'satelite', 'luna', 'centro', 'galaxia', 'universo', 'astro', 'astros',
      'cometa', 'cometas', 'asteroide', 'asteroides', 'eclipse', 'telescopio', 'sonda', 'sondas', 'naves', 'cohete', 'cohetes', 'luz', 'calor',
      'gira', 'giran', 'girar', 'alrededor', 'júpiter', 'jupiter', 'marte', 'mercurio', 'venus', 'saturno', 'urano', 'neptuno', 'rojo', 'anillos',
      'mareas', 'marea', 'tercer', 'tercero', 'cercana', 'cercano', 'lejos', 'lejano', 'lejanos', 'millón', 'millon', 'mediano', 'mediana', 'gas',
      'aire', 'vida', 'sistema', 'solar', 'cabrían', 'cabrian', 'fases', 'fase', 'creciente', 'menguante', 'llena', 'nueva'];
    const FRASES = ['sí misma', 'si misma', 'vía láctea', 'luz propia', 'más cercana', 'una vuelta completa'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni traslación, ni estaciones, ni planeta, ni estrella, ni luz)`, malas]);
    const nums = (dicho.match(/\d+/g) || []).map(Number);
    r.push([nums.every(k => [6, 12].includes(k)), `paso ${n}: ningún número de la prueba`, nums.filter(k => ![6, 12].includes(k))]);
    const frase = nb(e.texto);
    const F = [['El Sol', 'la Tierra en enero', 'le da la vuelta al Sol', 'la parcela de don Tulio', '¿cuándo le llueve?'],
      ['febrero, marzo y abril', 'sin lluvia', 'En mayo', 'entran las lluvias', 'don Tulio siembra'],
      ['De mayo a octubre llueve', 'la milpa crece', 'En noviembre', 'se acaban las lluvias'],
      ['Don Tulio cosechó', 'en diciembre y en enero no llueve', 'la vuelta entera al Sol', 'doce meses, un año'],
      ['Al año siguiente', 'el mismo camino', 'En mayo', 'al mismo lugar', 'las lluvias vuelven a entrar'],
      ['más o menos por las mismas fechas', 'la Tierra vuelve a pasar por el mismo lugar', '¿En qué mes llueve donde vives?']];
    r.push([F[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${F[n].join(', ')})`, frase]);

    /* ── El Sol y el camino ── */
    const S = x.sol.c, Ro = x.camino.r;
    const ang = p => Math.atan2(p[1] - S[1], p[0] - S[0]) * 180 / Math.PI;
    const dif = (a, b) => Math.abs(((a - b) % 360 + 540) % 360 - 180);
    const dist = p => Math.hypot(p[0] - S[0], p[1] - S[1]);
    const angMes = i => 90 - 30 * i;
    const distCaja = (p, b) => Math.hypot(Math.max(b.x0 - p[0], 0, p[0] - b.x1), Math.max(b.y0 - p[1], 0, p[1] - b.y1));
    const choca = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
    r.push([cerca(x.camino.c[0], S[0], 0.5) && cerca(x.camino.c[1], S[1], 0.5) && Ro > x.sol.r + 30,
      `paso ${n}: el camino es un círculo con el Sol en el centro`, [x.camino.c, S].map(p => p.map(Math.round))]);
    r.push([x.rayosSol.length === 12 && x.rayosSol.every(l => dist(l.a) > x.sol.r && dist(l.b) > dist(l.a) + 3 && dist(l.b) < Ro - 30 && dif(ang(l.a), ang(l.b)) < 1),
      `paso ${n}: el Sol lleva sus rayos alrededor`]);
    const rayas = x.rayas.slice().sort((a, b) => a.i - b.i);
    r.push([rayas.length === 12 && rayas.every((q, i) => { const mid = [(q.a[0] + q.b[0]) / 2, (q.a[1] + q.b[1]) / 2];
      return q.i === i && cerca(dist(mid), Ro, 0.6) && dif(ang(q.a), ang(q.b)) < 0.5 && dif(ang(mid), angMes(i)) < 0.5 && Math.abs(dist(q.a) - dist(q.b)) > 5; }),
      `paso ${n}: doce rayas que cruzan el camino, a 30° una de otra: enero abajo y los meses contra las agujas del reloj`]);
    const meses = x.meses.slice().sort((a, b) => a.i - b.i);
    r.push([meses.length === 12 && meses.every((t, i) => t.i === i && nb(t.dice) === MESES[i] && t.ve),
      `paso ${n}: los doce meses, de enero a diciembre`, meses.map(t => t.dice).join(' ')]);
    r.push([meses.every(t => { const c = cen(t.caja); return dif(ang(c), angMes(t.i)) < 4 && distCaja(S, t.caja) > Ro + 3; }),
      `paso ${n}: el nombre de cada mes va afuera del camino, en la línea de su raya`]);
    r.push([meses.every((t, i) => meses.every((u, j) => i === j || !choca(t.caja, u.caja))) &&
      meses.every(t => t.caja.x0 >= 0 && t.caja.x1 <= 320 && t.caja.y0 >= 0 && t.caja.y1 <= 240 && !choca(t.caja, x.marco)),
      `paso ${n}: los nombres no se tapan entre sí ni con la parcela, y caben en el dibujo`]);

    /* ── La Tierra: en el camino, y de su ángulo sale el mes ── */
    const T = x.tierra;
    r.push([x.tierraVe && cerca(dist(T.c), Ro, 0.8), `paso ${n}: la Tierra va sobre el camino, a la misma distancia del Sol que siempre`,
      [dist(T.c), Ro].map(v => Math.round(v * 10) / 10)]);
    const mes = ((Math.round((90 - ang(T.c)) / 30) % 12) + 12) % 12;
    r.push([dif(ang(T.c), angMes(mes)) < 1 && mes === DONDE[n], `paso ${n}: la Tierra está en ${LARGOS[DONDE[n]]}`, [MESES[mes], Math.round(ang(T.c))]]);
    r.push([meses.every(t => distCaja(T.c, t.caja) >= T.r + 0.5), `paso ${n}: la Tierra no tapa el nombre de ningún mes`,
      meses.map(t => Math.round(distCaja(T.c, t.caja) * 10) / 10).filter(v => v < T.r + 0.5)]);

    /* ── Las marcas: una por cada mes por el que ya pasó ── */
    const deben = new Set(MESES.map((_, i) => i).filter(i => i === 0 ? CAMINADO[n] > 0 : i <= Math.min(CAMINADO[n], 11)));
    const marcas = x.marcas.slice().sort((a, b) => a.i - b.i);
    r.push([marcas.length === 12 && marcas.every(q => q.ve === deben.has(q.i)),
      `paso ${n}: se ven las marcas de los meses por los que ya pasó la Tierra (${deben.size})`, marcas.filter(q => q.ve).map(q => MESES[q.i]).join(' ')]);
    r.push([marcas.every(q => { const c = cen(q.caja); return dif(ang(c), angMes(q.i)) < 3 && dist(c) < Ro && distCaja(T.c, q.caja) >= T.r && distCaja(S, q.caja) > x.sol.r + 12; }),
      `paso ${n}: cada marca va adentro del camino, en la línea de su mes, sin tocar a la Tierra ni al Sol`]);
    const malasM = marcas.filter(q => q.forma !== (LLUVIOSOS.includes(nb(meses[q.i].dice)) ? 'gota' : 'sol'));
    r.push([malasM.length === 0, `paso ${n}: gota en los meses de lluvia (de mayo a octubre) y sol en los demás`, malasM.map(q => MESES[q.i])]);

    /* ── La parcela: le llueve si la Tierra está en un mes de lluvia ── */
    const llueveEn = i => LLUVIOSOS.includes(MESES[(i + 12) % 12]);
    const moja = llueveEn(mes), entra = moja && !llueveEn(mes - 1), sale = !moja && llueveEn(mes - 1);
    r.push([x.nube.ve === moja && x.lluvia.ve === moja, `paso ${n}: ${moja ? 'le llueve a la parcela' : 'a la parcela no le llueve'} (la Tierra está en ${LARGOS[mes]})`,
      [x.nube.ve, x.lluvia.ve]]);
    const M = x.marco, Su = x.suelo, N = x.nube.caja;
    r.push([N.x0 > M.x0 && N.x1 < M.x1 && N.y0 > M.y0 && x.lluvia.lineas.length >= 4 &&
      x.lluvia.lineas.every(l => l.a[1] >= N.y1 - 1.5 && l.a[1] <= N.y1 + 6 && l.b[1] <= Su.y0 && Su.y0 - l.b[1] < 6 && l.a[0] > N.x0 && l.a[0] < N.x1),
      `paso ${n}: la lluvia cae de la nube hasta el suelo, adentro de la parcela`]);
    r.push([x.brotes.ve === entra && x.milpa.ve === sale,
      `paso ${n}: ${entra ? 'con la lluvia que entra, don Tulio siembra: brotes' : sale ? 'la lluvia se fue y la milpa ya creció' : 'la parcela, sin nada sembrado'}`, [x.brotes.ve, x.milpa.ve]]);
    r.push([[x.brotes.caja, x.milpa.caja].every(b => cerca(b.y1, Su.y0, 1.2) && b.x0 > M.x0 && b.x1 < M.x1 && b.y0 > M.y0) &&
      x.milpa.caja.y1 - x.milpa.caja.y0 > 3 * (x.brotes.caja.y1 - x.brotes.caja.y0) && x.milpa.mazorcas === 3 && x.milpa.tallos === 3,
      `paso ${n}: los brotes y la milpa salen del suelo de la parcela, y la milpa es mucho más alta, con sus tres mazorcas`]);

    /* ── Los rótulos ── */
    const rot = k => x.rotulos.filter(q => q.k === k);
    const rs = rot('sol')[0], rt = rot('tierra')[0];
    r.push([rs && rs.ve && nb(rs.dice) === 'el Sol' && cerca(cen(rs.caja)[0], S[0], 1) && rs.caja.y0 > S[1] + x.sol.r && rs.caja.y0 - (S[1] + x.sol.r) < 20,
      `paso ${n}: «el Sol» va debajo del Sol`]);
    r.push([rt && rt.ve === (n === 0) && nb(rt.dice) === 'la Tierra' &&
      (n !== 0 || (cerca(cen(rt.caja)[0], T.c[0], 1) && rt.caja.y1 < T.c[1] - T.r && T.c[1] - T.r - rt.caja.y1 < 8 && !choca(rt.caja, rs.caja))),
      `paso ${n}: «la Tierra» ${n === 0 ? 'va justo encima de la Tierra' : 'ya no está'}`]);
    const esc = rot('escala');
    r.push([esc.length === 3 && esc.every(q => q.ve && q.caja.y1 < M.y0) && esc.map(q => nb(q.dice)).join(' ') === 'Los tamaños y las distancias no son los de verdad.',
      `paso ${n}: el aviso de que los tamaños y las distancias no son los de verdad`, esc.map(q => q.dice).join(' ')]);
    const par = rot('parcela').concat(rot('parcela2'));
    r.push([par.length === 2 && par.map(q => nb(q.dice)).join(' ') === 'la parcela de don Tulio' && par.every(q => q.ve && q.caja.y0 > M.y1 && cerca(cen(q.caja)[0], (M.x0 + M.x1) / 2, 1)),
      `paso ${n}: la parcela lleva su nombre debajo`]);

    /* ── El marcador cuenta en el dibujo ── */
    const vistas = marcas.filter(q => q.ve), gotas = vistas.filter(q => q.forma === 'gota');
    const mk = {
      0: ['?', 'cuándo le llueve a la parcela'],
      1: [LARGOS[mes], 'entran las lluvias'],
      2: [String(gotas.length), gotas.length ? 'meses de lluvia: de ' + LARGOS[gotas[0].i] + ' a ' + LARGOS[gotas[gotas.length - 1].i] : '—'],
      3: [String(vistas.length), 'meses: una vuelta entera al Sol'],
      4: [LARGOS[mes], 'otra vez entran las lluvias'],
      5: ['↻', 'cada vuelta, las mismas lluvias']
    };
    r.push([nb(e.cifra) === mk[n][0] && nb(e.palabras) === mk[n][1], `paso ${n}: el marcador dice «${mk[n][0]}» · ${mk[n][1]}`, [e.cifra, e.palabras]]);
    if (n === 1 || n === 4) r.push([entra, `paso ${n}: en ${LARGOS[mes]} entran las lluvias: el mes anterior no llovía`]);
    if (n === 3) r.push([vistas.length === 12 && mes === 0, 'paso 3: la Tierra volvió a enero y los doce meses tienen su marca']);
    return r;
  },
  /* Áreas Protegidas de Honduras. «El agua que el monte guarda».
     ⚠️ Nada se le cree a la escena. Los dos cerros se comparan punto por
     punto: la misma curva, con lo de adentro dentro de su tierra y la toma,
     el tubo y la pila en el mismo sitio. La lluvia se mide gota por gota:
     el mismo paso, las gotas en los mismos puntos de cada cerro, y cada una
     termina en el suelo que tiene debajo. Las flechas: en el monte, tres
     que entran en la tierra; en el pelado, una corta que entra y otra que
     corre pegada al cerro, siempre hacia abajo, hasta el borde. El agua
     guardada se lee por su borde de arriba y se mide su ÁREA adentro de lo
     de adentro: el monte guarda el doble, y cada mes las dos tomas se
     llevan lo mismo. De esas áreas sale lo que cada tira tiene que decir
     (gota si al empezar el mes quedaba agua, ✗ si no), si hay chorro y agua
     en la pila, la ✗ de la toma seca y los bidones; y el marcador cuenta en
     las tiras. ⚠️ Y la prueba no se regala: ni erosión, ni inundación, ni
     neblina, ni especies, ni aire, ni clima, ni un área protegida, ni un
     número de más. */
  amToma(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/\u00a0/g, ' ').trim();
    const cerca = (a, b, t) => Math.abs(a - b) <= t;
    const cen = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const enCaja = (p, k) => p[0] >= k.x0 - 0.5 && p[0] <= k.x1 + 0.5 && p[1] >= k.y0 - 0.5 && p[1] <= k.y1 + 0.5;
    /* Lo que no depende del dibujo, primero. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['erosión', 'erosion', 'inundación', 'inundacion', 'inundaciones', 'neblina', 'niebla', 'especies', 'especie', 'aire',
      'clima', 'climático', 'climatico', 'selva', 'pinar', 'ceiba', 'cuero', 'salado', 'manglar', 'manglares', 'quetzal', 'manatí',
      'lancetilla', 'tigra', 'sinaph', 'icf', 'corredor', 'biodiversidad', 'variedad', 'tala', 'talaron', 'talar', 'potrero', 'potreros',
      'ganado', 'ganadería', 'deforestación', 'deforestacion', 'incendio', 'incendios', 'quema', 'camaronera', 'gorgojo', 'roble', 'pino',
      'celaque', 'mosquitia', 'plátano', 'unesco', 'reserva', 'protegida', 'protegidas', 'protegido', 'ley', 'jaguar', 'tapir', 'orquídeas',
      'bromelias', 'caimán', 'garífuna', 'hectáreas', 'tegucigalpa', 'conectados', 'extensiva', 'verano', 'nublado', 'latifoliado', 'madera',
      'resina', 'aves'];
    const FRASES = ['se secan en verano', 'área protegida', 'áreas protegidas', 'cambio climático', 'río plátano', 'la tigra', 'las minas',
      'pico bonito', 'la muralla', 'gracias a dios'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni erosión, ni neblina, ni un área protegida)`, malas]);
    const nums = (dicho.match(/\d+/g) || []).map(Number);
    r.push([nums.every(k => [2, 4, 6].includes(k)), `paso ${n}: ningún número de la prueba`, nums.filter(k => ![2, 4, 6].includes(k))]);
    const frase = nb(e.texto);
    const F = [['Dos cerros iguales', 'toma de agua', 'monte', 'pelado', '¿Cuál toma aguanta más sin lluvia?'],
      ['Llueve lo mismo', 'de mayo a octubre', 'se mete en la tierra', 'corre cuesta abajo y se va'],
      ['Las hojas frenan la lluvia', 'las raíces le abren camino', 'mucha agua adentro', 'poca'],
      ['En noviembre se acaban las lluvias', 'el agua que su cerro guardó', 'despacio'],
      ['diciembre, enero y febrero', 'En marzo', 'su toma se seca', 'La del monte sigue'],
      ['Hasta mayo', 'volvieron las lluvias', 'bidones', 'nunca se secó'],
      ['El monte guarda la lluvia', 'la suelta cuando ya no llueve', 'don Tulio']];
    r.push([F[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${F[n].join(', ')})`, frase]);

    /* ── Los dos cerros, iguales ── */
    const M = x.cerros.monte, P = x.cerros.pelado, C = { monte: M, pelado: P };
    const pie = f => { const ys = Math.max(...f.map(p => p[1])); const b = f.filter(p => cerca(p[1], ys, 0.5)); return [Math.min(...b.map(p => p[0])), Math.max(...b.map(p => p[0])), ys]; };
    const centro = f => { const b = pie(f); return (b[0] + b[1]) / 2; };
    const cx = { monte: centro(M.forma), pelado: centro(P.forma) };
    const dx = cx.pelado - cx.monte;
    const igualForma = M.forma.every((p, i) => cerca(P.forma[i][0] - dx, p[0], 0.3) && cerca(P.forma[i][1], p[1], 0.3));
    r.push([igualForma && dx > 100, `paso ${n}: los dos cerros son la misma curva, uno al lado del otro`, [cx.monte, cx.pelado].map(Math.round)]);
    const base = pie(M.forma)[2];
    r.push([cerca(base, x.suelo, 0.5) && cerca(pie(P.forma)[2], x.suelo, 0.5), `paso ${n}: los dos se paran en el suelo`, [base, x.suelo]]);
    ['monte', 'pelado'].forEach(k => {
      const c = C[k], sup = xx => superficieEn(c.forma, xx);
      const arriba = c.dentro.filter(p => p[1] < base - 1);
      r.push([arriba.length > 50 && arriba.every(p => enPoligono(c.forma, p) && sup(p[0]) !== null && p[1] - sup(p[0]) >= 9),
        `paso ${n}: lo de adentro del ${k} está dentro de su cerro, con tierra encima`]);
      r.push([c.capas === 6, `paso ${n}: el agua del ${k} baja en seis capas, una por mes`, c.capas]);
    });
    const rel = (c, k) => [c.x0 - cx[k], c.y0, c.x1 - cx[k], c.y1];
    const mismo = (a, b) => a.every((v, i) => cerca(v, b[i], 0.3));
    r.push([['toma', 'tubo', 'pila'].every(q => mismo(rel(M[q], 'monte'), rel(P[q], 'pelado'))),
      `paso ${n}: la toma, el tubo y la pila, en el mismo sitio de cada cerro`]);

    /* ── Árboles, tocones y raíces ── */
    const supM = xx => superficieEn(M.forma, xx), supP = xx => superficieEn(P.forma, xx);
    const baseArbol = a => [(a.tronco.x0 + a.tronco.x1) / 2, a.tronco.y1];
    r.push([M.arboles.length === 6 && M.tocones.length === 0 && P.arboles.length === 0 && P.tocones.length === 6,
      `paso ${n}: seis árboles en el monte y sus seis tocones en el pelado`, [M.arboles.length, M.tocones.length, P.arboles.length, P.tocones.length]]);
    r.push([M.arboles.every(a => { const b = baseArbol(a); return Math.abs(b[1] - supM(b[0])) <= 1.2 && a.copa[1] < a.tronco.y0 + 1; }),
      `paso ${n}: cada árbol está parado en el cerro, con la copa encima del tronco`]);
    const xsArb = M.arboles.map(a => baseArbol(a)[0] - cx.monte).sort((a, b) => a - b);
    const xsToc = P.tocones.map(t => (t.x0 + t.x1) / 2 - cx.pelado).sort((a, b) => a - b);
    r.push([xsArb.every((v, i) => cerca(v, xsToc[i], 0.3)) && P.tocones.every(t => Math.abs(t.y1 - supP((t.x0 + t.x1) / 2)) <= 1.2),
      `paso ${n}: cada tocón está donde el monte tiene su árbol, sobre la tierra`, [xsArb, xsToc].map(a => a.map(Math.round))]);
    r.push([M.raices.length >= 6 && P.raices.length === 0 && M.raices.every(rz => {
      const b = rz[0]; return M.arboles.some(a => cerca(baseArbol(a)[0], b[0], 0.6) && cerca(baseArbol(a)[1], b[1], 1.2)) && Math.max(...rz.map(p => p[1])) > b[1] + 5;
    }), `paso ${n}: las raíces salen del pie de cada árbol y bajan a la tierra; en el pelado no hay`]);

    /* ── La lluvia, el sol y la nube ── */
    const llueve = n === 1 || n >= 5, hayFlechas = n === 1 || n === 2 || n === 6;
    r.push([x.lluvia.ve === llueve && x.nube.ve === llueve && x.sol === (n === 3 || n === 4),
      `paso ${n}: ${llueve ? 'llueve' : n === 3 || n === 4 ? 'hace sol: no llueve' : 'ni lluvia ni sol'}`, [x.lluvia.ve, x.nube.ve, x.sol]]);
    const G = x.lluvia.gotas.slice().sort((a, b) => a.a[0] - b.a[0]);
    const pasos = G.slice(1).map((g, i) => g.a[0] - G[i].a[0]);
    r.push([G.length >= 16 && pasos.every(v => cerca(v, pasos[0], 0.05)) && G.every(g => cerca(g.a[0], g.b[0], 0.05) && cerca(g.a[1], G[0].a[1], 0.05)),
      `paso ${n}: las gotas caen derechas, a la misma distancia y desde la misma altura`]);
    const sobre = k => G.filter(g => g.a[0] > cx[k] - 64 && g.a[0] < cx[k] + 64).map(g => Math.round((g.a[0] - cx[k]) * 100) / 100);
    r.push([sobre('monte').length >= 6 && JSON.stringify(sobre('monte')) === JSON.stringify(sobre('pelado')),
      `paso ${n}: sobre los dos cerros caen las gotas en los mismos puntos`, [sobre('monte').length, sobre('pelado').length]]);
    r.push([G.every(g => { const s1 = supM(g.b[0]), s2 = supP(g.b[0]); const s = s1 !== null && s1 < base ? s1 : s2 !== null && s2 < base ? s2 : base; return g.b[1] < s && s - g.b[1] <= 3; }),
      `paso ${n}: cada gota termina en el suelo que tiene debajo`]);

    /* ── Adónde se va la lluvia ── */
    r.push([x.flechas === hayFlechas, `paso ${n}: las flechas de adónde se va la lluvia ${hayFlechas ? 'se ven' : 'no están'}`]);
    const entM = x.entran.filter(f => f.k === 'monte'), entP = x.entran.filter(f => f.k === 'pelado');
    const baja = (f, c) => { const a = f.pts[0], b = f.pts[f.pts.length - 1], s = superficieEn(c.forma, a[0]);
      return cerca(a[0], b[0], 0.3) && a[1] - s >= 1 && a[1] - s <= 5 && f.punta[1] > a[1] && cerca(f.punta[0], a[0], 0.3); };
    const largo = f => f.punta[1] - f.pts[0][1];
    r.push([entM.length === 3 && entM.every(f => baja(f, M) && largo(f) >= 16),
      `paso ${n}: en el monte, tres flechas que se meten en la tierra`, entM.map(largo).map(Math.round)]);
    r.push([entP.length === 1 && baja(entP[0], P) && largo(entP[0]) < Math.min(...entM.map(largo)) / 2,
      `paso ${n}: en el pelado, una sola que entra, y corta: entra poca`, entP.map(largo).map(Math.round)]);
    const co = x.corren;
    const pegada = co.length === 1 && co[0].k === 'pelado' && co[0].pts.every(p => { const s = supP(p[0]); const suelo = s !== null && s < base ? s : base; return suelo - p[1] >= 0 && suelo - p[1] <= 4; });
    const siempreBaja = co.length === 1 && co[0].pts.slice(1).every((p, i) => p[1] >= co[0].pts[i][1] - 0.05 && p[0] >= co[0].pts[i][0] - 0.05);
    r.push([pegada && siempreBaja && co[0].pts[0][0] > cx.pelado && co[0].punta[0] > pie(P.forma)[1] + 6 && co[0].punta[0] > 300,
      `paso ${n}: en el pelado, el agua corre pegada al cerro, siempre hacia abajo, y se va por el borde`]);

    /* ── El agua guardada: se mide su área adentro ── */
    const area = k => C[k].nivel >= base - 0.05 ? 0 : areaDebajo(C[k].dentro, C[k].nivel);
    const verRes = n >= 2;
    r.push([M.reserva === verRes && P.reserva === verRes, `paso ${n}: el agua de adentro ${verRes ? 'se ve' : 'todavía no se ve'}`]);
    if (n === 2) {
      tomaAP.a0 = { monte: area('monte'), pelado: area('pelado') };
      r.push([tomaAP.a0.pelado > 0 && cerca(tomaAP.a0.monte / tomaAP.a0.pelado, 2, 0.04),
        'paso 2: el cerro con monte guardó el doble de agua que el pelado', [tomaAP.a0.monte, tomaAP.a0.pelado].map(Math.round)]);
    }
    if (n === 3 && tomaAP.a0) {
      const dm = tomaAP.a0.monte - area('monte'), dp = tomaAP.a0.pelado - area('pelado');
      tomaAP.mes = dm;
      r.push([dm > 0 && cerca(dm, dp, dm * 0.02), 'paso 3: en noviembre las dos tomas se llevan lo mismo', [dm, dp].map(Math.round)]);
    }
    /* Cuántos meses se han llevado ya: los que salen en la tira. */
    const meses = n <= 2 ? 0 : n === 3 ? 1 : n === 4 ? 5 : 6;
    const queda = (k, i) => tomaAP.a0 && tomaAP.mes ? tomaAP.a0[k] - i * tomaAP.mes : null;
    if (n >= 4 && tomaAP.mes) {
      ['monte', 'pelado'].forEach(k => {
        const debe = Math.max(0, queda(k, meses));
        r.push([cerca(area(k), debe, tomaAP.mes * 0.1), `paso ${n}: al ${k} le queda el agua de ${Math.round(debe / tomaAP.mes * 10) / 10} meses`, [area(k), debe].map(Math.round)]);
      });
    }

    /* ── La toma: chorro y agua en la pila si hay agua adentro ── */
    ['monte', 'pelado'].forEach(k => {
      const c = C[k];
      const hay = n <= 2 ? true : area(k) > 0;
      r.push([c.chorro.ve === hay && c.pilaAgua.ve === hay && c.seca.ve === !hay,
        `paso ${n}: la toma del ${k} ${hay ? 'da agua: chorro y agua en la pila' : 'está seca: sin chorro, con su ✗'}`, [c.chorro.ve, c.pilaAgua.ve, c.seca.ve]]);
      r.push([cerca(c.chorro.a[1], c.tubo.y1, 1) && c.chorro.a[0] > c.pila.x0 && c.chorro.a[0] < c.pila.x1 && c.chorro.a[0] > c.tubo.x0 && c.chorro.a[0] < c.tubo.x1 &&
        c.chorro.b[1] > c.pila.y0 && c.chorro.b[1] < c.pila.y1 && cerca(c.pila.y1, base, 1.2) && c.pilaAgua.caja.y1 <= c.pila.y1 + 0.5 &&
        c.pilaAgua.caja.x0 >= c.pila.x0 - 0.5 && c.pilaAgua.caja.x1 <= c.pila.x1 + 0.5 && c.seca.rayas === 2 && enCaja(cen(c.seca.caja), c.pila),
        `paso ${n}: el chorro sale del tubo y cae en la pila, que está en el suelo`]);
      const t = c.toma, pts = [];
      for (let i = 0; i <= 4; i++) for (let j = 0; j <= 4; j++) pts.push([t.x0 + (t.x1 - t.x0) * i / 4, t.y0 + (t.y1 - t.y0) * j / 4]);
      r.push([pts.some(p => enPoligono(c.dentro, p)) && c.tubo.x1 <= t.x0 + 0.6, `paso ${n}: la toma del ${k} toca lo de adentro, donde se guarda el agua`]);
    });
    const bid = x.bidones, secoP = n >= 4;
    r.push([bid.ve === secoP, `paso ${n}: ${secoP ? 'con la toma seca, bidones' : 'sin bidones'}`]);
    r.push([bid.cajas.length === 2 && bid.cajas.every(b => cerca(b.y1, base, 1.2) && b.x0 > pie(M.forma)[1] && b.x1 < P.pila.x0),
      `paso ${n}: los bidones, en el suelo, junto a la pila del pelado`]);

    /* ── Las tiras de los meses ── */
    const NOMBRES = { N: 'noviembre', D: 'diciembre', E: 'enero', F: 'febrero', M: 'marzo', A: 'abril' };
    r.push([x.tiras === (n >= 3), `paso ${n}: las tiras de los meses ${n >= 3 ? 'se ven' : 'todavía no'}`]);
    const vistos = {};
    ['monte', 'pelado'].forEach(k => {
      const cs = C[k].celdas.slice().sort((a, b) => a.i - b.i);
      const xs = cs.map(c => c.caja.x0), w = cs.map(c => c.caja.x1 - c.caja.x0);
      const pasoC = xs.slice(1).map((v, i) => v - xs[i]);
      r.push([cs.length === 6 && w.every(v => cerca(v, w[0], 0.05)) && pasoC.every(v => cerca(v, pasoC[0], 0.05)) && cs.every(c => cerca(c.caja.y0, cs[0].caja.y0, 0.05)) &&
        cerca((cs[0].caja.x0 + cs[5].caja.x1) / 2, cx[k], 0.6) && cs[0].caja.y0 > base,
        `paso ${n}: la tira del ${k}: seis celdas iguales, en fila, debajo de su cerro`]);
      r.push([cs.map(c => c.letra).join('') === 'NDEFMA' && cs.every(c => cerca(cen(c.letraCaja)[0], cen(c.caja)[0], 0.8) && c.letraCaja.y0 > c.caja.y1),
        `paso ${n}: debajo de cada celda, la letra de su mes, de noviembre a abril`, cs.map(c => c.letra).join('')]);
      const ve = cs.filter(c => c.cont.ve);
      vistos[k] = ve;
      r.push([ve.length === meses && ve.every(c => c.i < meses) && ve.every(c => enCaja(cen(c.cont.caja), c.caja)),
        `paso ${n}: en la tira del ${k} salen los meses que ya pasaron (${meses})`, ve.map(c => c.i)]);
      if (tomaAP.mes) {
        const malas = ve.filter(c => { const conAgua = queda(k, c.i) > tomaAP.mes * 0.01; return c.cont.forma !== (conAgua ? 'gota' : 'x2'); });
        r.push([malas.length === 0, `paso ${n}: gota en el mes que la toma del ${k} dio agua; ✗ en el que no`, malas.map(c => c.i)]);
      }
    });
    /* ── El marcador cuenta en las tiras ── */
    const mk = { 0: ['?', 'cuál toma aguanta más sin lluvia'], 1: ['=', 'la misma lluvia en los dos cerros'], 2: ['↓', 'el agua que cada cerro guardó'] };
    if (n in mk) r.push([nb(e.cifra) === mk[n][0] && nb(e.palabras) === mk[n][1], `paso ${n}: el marcador dice «${mk[n][0]}» · ${mk[n][1]}`, [e.cifra, e.palabras]]);
    const ultimo = vistos.monte && vistos.monte.length ? NOMBRES[vistos.monte[vistos.monte.length - 1].letra] : null;
    if (n === 3) r.push([nb(e.cifra) === ultimo && nb(e.palabras) === 'se acabaron las lluvias', 'paso 3: el marcador dice el mes que acaba de pasar', [e.cifra, ultimo]]);
    if (n === 4) {
      const primeraX = vistos.pelado.find(c => c.cont.forma === 'x2');
      r.push([nb(e.cifra) === ultimo && primeraX && NOMBRES[primeraX.letra] === ultimo && nb(e.palabras) === 'se secó la toma del cerro pelado',
        'paso 4: el marcador dice el mes en que se secó la toma del pelado, y es su primera ✗', [e.cifra, primeraX && primeraX.letra]]);
    }
    const cuenta = (k, f) => vistos[k].filter(c => c.cont.forma === f).length;
    if (n === 5) r.push([nb(e.cifra) === cuenta('pelado', 'x2') + ' meses' && nb(e.palabras) === 'sin agua en la toma del cerro pelado',
      'paso 5: el marcador cuenta las ✗ de la tira del pelado', [e.cifra, cuenta('pelado', 'x2')]]);
    if (n === 6) r.push([nb(e.cifra) === cuenta('monte', 'gota') + ' y ' + cuenta('pelado', 'gota') && nb(e.palabras) === 'meses con agua sin lluvia: monte y pelado',
      'paso 6: el marcador cuenta las gotas de las dos tiras', [e.cifra, cuenta('monte', 'gota'), cuenta('pelado', 'gota')]]);

    /* ── Los rótulos ── */
    const rot = k => x.rotulos.find(q => q.k === k);
    const rm = rot('monte'), rp = rot('pelado'), rg = rot('guardada'), rme = rot('meses');
    r.push([rm && rp && rm.ve && rp.ve && nb(rm.dice) === 'con monte' && nb(rp.dice) === 'pelado' && cerca(cen(rm.caja)[0], cx.monte, 1.5) &&
      cerca(cen(rp.caja)[0], cx.pelado, 1.5) && rm.caja.y0 > base && rp.caja.y0 > base, `paso ${n}: cada cerro lleva su nombre debajo`]);
    r.push([rg && rg.ve === (n === 2) && nb(rg.dice) === 'agua guardada', `paso ${n}: «agua guardada» ${n === 2 ? 'se ve' : 'no está'}`]);
    if (n === 2) { const c = cen(rg.caja); r.push([enPoligono(M.dentro, c) && c[1] > M.nivel, 'paso 2: «agua guardada» está escrito en el agua del monte', c.map(Math.round)]); }
    r.push([rme && rme.ve === (n >= 3) && nb(rme.dice) === 'de noviembre a abril, sin lluvia', `paso ${n}: el rótulo de las tiras dice de qué meses son`]);
    return r;
  },
  /* Las Eras Geológicas. «El caracol que apareció en la milpa».
     ⚠️ Nada se le cree a la escena. Las capas se leen de su roca: tienen que
     estar apiladas en su orden (la más nueva arriba), pegadas una a otra,
     con el mismo borde a la izquierda y el lado que da al mar en una sola
     recta. En cada paso se ven las que tienen que verse: el fondo solo, las
     tres de lodo que caen encima, y hoy, sin las dos que se llevó la lluvia.
     Lodo es liso y la roca lleva vetas. El caracol está sobre el fondo, en
     el mismo sitio, del paso 1 al 4; vivo solo en el 1; tapado por su capa
     del 2 al 4; y hoy, encima del suelo, al final del surco. El mar no se
     mueve nunca: en el pasado todo está debajo del agua, y hoy el cerro y
     el caracol quedan muy por encima, con la costa donde el cerro cruza el
     agua. Al subir, todas las capas suben lo mismo. El marcador cuenta las
     capas que hay encima del caracol, contándolas en el dibujo. ⚠️ Y la
     prueba no se regala: ni fósil, ni estratos, ni el nombre de una era, ni
     un animal, ni un número de más. */
  amCaracol(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cerca = (a, b, t) => Math.abs(a - b) <= t;
    const hoy = n === 0 || n >= 5, arriba = n === 0 || n >= 4;
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['fósil', 'fósiles', 'fosil', 'fosiles', 'estrato', 'estratos', 'geólogo', 'geólogos', 'geología', 'eras', 'precámbrica',
      'precámbrico', 'paleozoica', 'paleozoico', 'mesozoica', 'mesozoico', 'cenozoica', 'cenozoico', 'cuaternaria', 'cuaternario', 'trilobite',
      'trilobites', 'pangea', 'laurasia', 'gondwana', 'continente', 'continentes', 'supercontinente', 'extinción', 'extinciones', 'extinguió',
      'desapareció', 'desaparecieron', 'dinosaurio', 'dinosaurios', 'mamut', 'mamuts', 'mamífero', 'mamíferos', 'bacteria', 'bacterias',
      'oxígeno', 'atmósfera', 'hielo', 'glaciación', 'meteorito', 'millones', 'sapiens', 'humano', 'humanos', 'vida', 'vivos', 'peces',
      'anfibios', 'reptiles', 'aves', 'flores', 'volcán', 'volcanes', 'lava', 'corteza', 'cretácico', 'pérmico', 'fuego', 'placas', 'tectónica',
      'artrópodo', 'caparazón', 'rueda', 'hierro'];
    const FRASES = ['tierra firme', 'seres vivos', 'guardado en la roca', 'una encima de otra', 'bajo el agua', 'toda la tierra',
      'edad de hielo', 'era geológica'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni fósil, ni estratos, ni una era, ni un animal)`, malas]);
    const nums = (dicho.match(/\d+/g) || []).map(Number);
    r.push([nums.every(k => k === 0 || k === 3), `paso ${n}: ningún número de la prueba`, nums.filter(k => k !== 0 && k !== 3)]);
    const frase = nb(e.texto);
    const F = [['Don Tulio', 'caracol de mar', 'cerro', '¿Cómo llegó'], ['Hace muchísimo tiempo', 'fondo del mar', 'vivía el caracol'],
      ['murió', 'lodo', 'una capa, encima otra, y otra más'], ['el lodo se volvió roca', 'la concha se volvió piedra'],
      ['el fondo del mar se fue levantando', 'todas sus capas', 'muy por encima del agua'], ['La lluvia', 'capas de arriba', 'el arado de don Tulio', 'lo sacó'],
      ['de abajo hacia arriba', 'las de abajo son las más viejas', '¿Qué guardarán']];
    r.push([F[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${F[n].join(', ')})`, frase]);
    const reloj = hoy ? 'hoy' : n === 4 ? 'despues' : 'antes';
    r.push([x.reloj.length === 1 && x.reloj[0] === reloj, `paso ${n}: el letrero del tiempo dice «${reloj}»`, x.reloj]);
    r.push([!x.telon && !x.nube, `paso ${n}: al terminar el paso no queda telón ni nube tapando nada`, [x.telon, x.nube]]);

    /* ── Las capas, leídas de su roca ── */
    const C = {}; x.capas.forEach(c => { C[c.k] = c; });
    const ORDEN = ['c4', 'c3', 'c2', 'c1', 'v1', 'v2', 'v3', 'v4'];
    const top = c => Math.min(...c.pts.map(p => p[1])), bot = c => Math.max(...c.pts.map(p => p[1]));
    const izq = c => Math.min(...c.pts.map(p => p[0]));
    const ven = n === 1 ? ['c1', 'v1', 'v2', 'v3', 'v4'] : hoy ? ['c2', 'c1', 'v1', 'v2', 'v3', 'v4'] : ORDEN;
    const vistas = ORDEN.filter(k => C[k] && C[k].ve);
    r.push([JSON.stringify(vistas) === JSON.stringify(ven), `paso ${n}: se ven las capas que tiene que haber (${ven.join(', ')})`, vistas]);
    const pila = vistas.map(k => C[k]);
    const pegadas = pila.slice(1).every((c, i) => cerca(top(c), bot(pila[i]), 0.3));
    const tops = pila.map(top);
    r.push([pegadas && tops.every((t, i) => i === 0 || t > tops[i - 1]),
      `paso ${n}: apiladas en su orden, la más nueva arriba, y pegadas una a otra`, tops.map(v => Math.round(v))]);
    r.push([pila.every(c => cerca(izq(c), izq(pila[0]), 0.3)), `paso ${n}: todas con el mismo borde a la izquierda`]);
    const derechos = pila.flatMap(c => c.pts.filter(p => p[0] > izq(c) + 1));
    const a0 = derechos.reduce((a, p) => p[1] < a[1] ? p : a), a1 = derechos.reduce((a, p) => p[1] > a[1] ? p : a);
    const enRecta = p => Math.abs((a1[0] - a0[0]) * (p[1] - a0[1]) - (a1[1] - a0[1]) * (p[0] - a0[0])) / Math.hypot(a1[0] - a0[0], a1[1] - a0[1]) <= 0.3;
    r.push([derechos.every(enRecta), `paso ${n}: el lado que da al mar es una sola recta para todas`]);
    const lodo = n === 1 || n === 2;
    const conLodo = ['c1', 'c2', 'c3', 'c4'].filter(k => C[k].ve && C[k].lodo);
    const deberian = ['c1', 'c2', 'c3', 'c4'].filter(k => C[k].ve && lodo);
    r.push([JSON.stringify(conLodo) === JSON.stringify(deberian),
      `paso ${n}: ${lodo ? 'lo del fondo todavía es lodo' : 'el lodo ya es roca'}`, conLodo]);
    r.push([pila.every(c => c.vetas >= 1) && ['c1', 'c2', 'c3', 'c4'].every(k => C[k].lodoOpaco === 1),
      `paso ${n}: la roca lleva vetas y el lodo es liso: las tapa (no se distinguen solo por el color)`]);
    if (n === 2) r.push([C.c2.d < C.c3.d && C.c3.d < C.c4.d, 'paso 2: las capas de lodo caen de abajo hacia arriba, una después de otra', [C.c2.d, C.c3.d, C.c4.d]]);
    if (n === 3) r.push([C.c1.dLodo < C.c2.dLodo && C.c2.dLodo < C.c3.dLodo && C.c3.dLodo < C.c4.dLodo,
      'paso 3: el lodo se vuelve roca de abajo hacia arriba', ['c1', 'c2', 'c3', 'c4'].map(k => C[k].dLodo)]);

    /* ── El mar: no se mueve nunca ── */
    if (n === 0) caracolER.mar = x.mar.y;
    r.push([cerca(x.mar.y, caracolER.mar, 0.3), `paso ${n}: el nivel del mar es el mismo que al principio`, [x.mar.y, caracolER.mar]]);
    const cima = tops[0], ca = x.caracol;
    if (arriba) {
      r.push([cima < x.mar.y - 40 && ca.base[1] < x.mar.y - 40, `paso ${n}: el cerro y el caracol quedan muy por encima del agua`, [cima, ca.base[1], x.mar.y].map(Math.round)]);
      r.push([x.mar.costa.izq !== null && x.mar.costa.der === null, `paso ${n}: la costa: a la izquierda el cerro, a la derecha el agua`, x.mar.costa]);
    } else {
      r.push([cima > x.mar.y + 10 && ca.caja.y0 > x.mar.y + 10, `paso ${n}: todo está debajo del agua, el fondo y el caracol`, [cima, ca.caja.y0, x.mar.y].map(Math.round)]);
    }
    if (n === 3) caracolER.tops = Object.fromEntries(vistas.map(k => [k, top(C[k])]));
    if (n === 4 && caracolER.tops) {
      const subidas = vistas.map(k => caracolER.tops[k] - top(C[k]));
      r.push([subidas.every(v => cerca(v, subidas[0], 0.3)) && subidas[0] > 100,
        'paso 4: todas las capas suben lo mismo, con el caracol adentro', subidas.map(v => Math.round(v))]);
    }

    /* ── El caracol ── */
    const encima = pila.filter(c => bot(c) <= ca.base[1] + 0.5 && top(c) < ca.caja.y0).map(c => c.k);
    if (!hoy) {
      if (n === 1) caracolER.x = ca.base[0];
      r.push([cerca(ca.base[1], top(C.c1), 0.6) && cerca(ca.base[0], caracolER.x, 0.3),
        `paso ${n}: el caracol está sobre el fondo donde vivía, en el mismo sitio`, [ca.base.map(Math.round), Math.round(top(C.c1))]]);
      if (n >= 2) r.push([ca.caja.y0 > top(C.c2) + 1 && ca.caja.y1 <= bot(C.c2) + 0.6,
        `paso ${n}: y lo tapa su capa, entera`, [ca.caja.y0, top(C.c2), ca.caja.y1, bot(C.c2)].map(Math.round)]);
    } else {
      const fondoConcha = ca.centro[1] + ca.radio;
      r.push([cerca(ca.base[1], top(C.c2), 0.6) && cerca(fondoConcha, top(C.c2), 1) && encima.length === 0,
        `paso ${n}: hoy el caracol está encima del suelo, sin nada encima`, [ca.base.map(Math.round), fondoConcha, Math.round(top(C.c2)), encima]]);
    }
    const vivo = n === 1, dePiedra = !(n === 1 || n === 2);
    r.push([ca.cuerpo === vivo && ca.concha === !dePiedra && ca.piedra === dePiedra,
      `paso ${n}: ${vivo ? 'el caracol está vivo, con su cuerpo' : dePiedra ? 'la concha es de piedra' : 'murió: la concha, sin cuerpo'}`, [ca.cuerpo, ca.concha, ca.piedra]]);
    const cuenta = { 1: 0, 2: 3, 3: 3, 5: 0 };
    if (n in cuenta) {
      const pal = { 1: 'capas encima del caracol', 2: 'capas de lodo encima del caracol', 3: 'capas de roca encima del caracol', 5: 'capas encima: lo sacó el arado' };
      r.push([nb(e.cifra) === String(encima.length) && encima.length === cuenta[n] && nb(e.palabras) === pal[n],
        `paso ${n}: el marcador cuenta las capas que hay encima del caracol: ${cuenta[n]}`, [e.cifra, encima, e.palabras]]);
    } else {
      const mk = { 0: ['?', 'un caracol de mar en lo alto del cerro'], 4: ['↑', 'el fondo del mar, arriba del agua'], 6: ['↓', 'más abajo, más viejo'] };
      r.push([nb(e.cifra) === mk[n][0] && nb(e.palabras) === mk[n][1], `paso ${n}: el marcador dice «${mk[n][0]}» · ${mk[n][1]}`, [e.cifra, e.palabras]]);
    }

    /* ── Lo de hoy: el suelo, la milpa, don Tulio, su arado y el surco ── */
    const sup = top(C.c2), borde = Math.max(...C.c2.pts.filter(p => cerca(p[1], sup, 0.5)).map(p => p[0]));
    const matas = x.matas.filter(q => q.ve);
    if (hoy) {
      r.push([matas.length === 4 && matas.every(q => cerca(q.base[1], sup, 0.6) && q.base[0] > izq(C.c2) && q.base[0] < borde),
        `paso ${n}: la milpa: cuatro matas plantadas en el suelo de arriba`, matas.map(q => q.base.map(Math.round))]);
      const t = x.tulio, rj = x.arado.reja, su = x.surco.caja;
      r.push([t.ve && cerca(t.caja.y1, sup, 1), `paso ${n}: don Tulio está parado en el suelo`, [t.caja.y1, sup].map(Math.round)]);
      r.push([x.arado.ve && x.surco.ve && cerca(rj.y1, sup, 2.5) && su.y0 >= sup - 1.5 && su.y1 <= sup + 3.5 && t.caja.x1 < rj.x0 + 1 && rj.x0 < ca.base[0],
        `paso ${n}: el arado entra en el suelo, delante de don Tulio, y el caracol va después`, [rj, su].map(c => [c.x0, c.y0, c.x1, c.y1].map(Math.round))]);
      r.push([Math.abs(ca.base[0] - su.x1) <= 6, `paso ${n}: el caracol quedó al final del surco que abrió el arado`, [ca.base[0], su.x1].map(Math.round)]);
      r.push([x.suelo.ve && cerca(x.suelo.caja.y0, sup, 0.6), `paso ${n}: la tierra de la milpa está sobre la capa de arriba`]);
    } else {
      r.push([matas.length === 0 && !x.tulio.ve && !x.arado.ve && !x.surco.ve && !x.suelo.ve, `paso ${n}: todavía no hay milpa, ni don Tulio, ni arado`]);
    }
    if (n === 0) {
      const g = x.globo, c = ca.caja;
      r.push([g.ve && g.punta[0] >= c.x0 - 10 && g.punta[0] <= c.x1 + 10 && g.punta[1] >= c.y0 - 10 && g.punta[1] <= c.y1 + 2,
        'paso 0: la pregunta sale del caracol', g.punta.map(Math.round)]);
    } else r.push([!x.globo.ve, `paso ${n}: sin la pregunta del principio`]);

    /* ── Los rótulos ── */
    const rot = k => x.rotulos.find(q => q.k === k);
    const enAgua = q => q.capa === null && q.caja.y0 > x.mar.y;
    const debe = { 'mar-antes': n >= 1 && n <= 3, 'mar-hoy': arriba, fondo: n === 1, lodo: n === 2, roca: n === 3, nuevas: n === FIN_ER, viejas: n === FIN_ER };
    const malos = Object.keys(debe).filter(k => !rot(k) || rot(k).ve !== debe[k]);
    r.push([malos.length === 0, `paso ${n}: cada rótulo sale cuando toca`, malos]);
    ['mar-antes', 'mar-hoy'].forEach(k => { const q = rot(k); if (q && q.ve) r.push([nb(q.dice) === 'el mar' && enAgua(q), `paso ${n}: «el mar» está escrito en el agua`, q.caja]); });
    if (n === 1) { const q = rot('fondo'); r.push([nb(q.dice) === 'el fondo del mar' && enAgua(q) && q.caja.y1 <= top(C.c1) && top(C.c1) - q.caja.y1 <= 12,
      'paso 1: «el fondo del mar», justo encima del fondo', q.caja]); }
    if (n === 2 || n === 3) {
      const ll = x.llave.caja, q = rot(n === 2 ? 'lodo' : 'roca');
      r.push([x.llave.ve && cerca(ll.y0, top(C.c4), 1) && cerca(ll.y1, bot(C.c2), 1) && enAgua({ capa: q.capa, caja: ll }),
        `paso ${n}: la llave abarca justo las tres capas nuevas, en el agua`, [ll.y0, top(C.c4), ll.y1, bot(C.c2)].map(Math.round)]);
      r.push([nb(q.dice) === (n === 2 ? 'lodo' : 'roca') && q.caja.x0 >= ll.x1 && q.caja.y0 >= ll.y0 && q.caja.y1 <= ll.y1,
        `paso ${n}: y dice «${n === 2 ? 'lodo' : 'roca'}»`, q.dice]);
    } else r.push([!x.llave.ve, `paso ${n}: sin la llave de las capas nuevas`]);
    if (n === FIN_ER) {
      const f = x.flecha, qn = rot('nuevas'), qv = rot('viejas');
      r.push([f.ve && f.a[1] >= sup && f.a[1] <= sup + 20 && f.b[1] > f.a[1] + 150 && f.punta.y1 > f.b[1] && f.a[0] > izq(C.c2),
        'paso 6: la flecha baja por el corte, de la capa de arriba a las de más abajo', [f.a, f.b].map(p => p.map(Math.round))]);
      r.push([nb(qn.dice) === 'más nuevas' && nb(qv.dice) === 'más viejas' && Math.abs(qn.caja.y1 - f.a[1]) <= 10 && Math.abs(qv.caja.y1 - f.punta.y1) <= 10,
        'paso 6: «más nuevas» arriba y «más viejas» abajo, cada una en su punta', [qn.caja.y1, f.a[1], qv.caja.y1, f.punta.y1].map(Math.round)]);
    } else r.push([!x.flecha.ve, `paso ${n}: sin la flecha del final`]);
    return r;
  },
  /* Desastres Naturales y el Huracán Mitch. «Adónde se va el agua del
     aguacero». ⚠️ Nada se le cree a la escena. Las dos casas se comparan
     pieza por pieza: la misma casa, con lo mismo adentro y en el mismo
     sitio, y lo único distinto es dónde está cada una. La lluvia se mide
     gota por gota: el mismo paso en toda la escena, sobre las dos casas, y
     cada gota termina justo encima de lo que tiene debajo (el techo, el
     suelo o la quebrada), nunca adentro de una casa. La flecha del agua que
     baja sale del alero del vecino, va siempre hacia abajo, corre pegada al
     cerro y termina dentro del cauce. El agua se lee por su borde: en su
     cauce, subiendo sin salirse, y cuando se sale, dentro de la casa de
     Kenia y lejos del piso del vecino, hasta donde el cerro sube a su
     altura; y en el último paso, a la misma altura. Lo que el agua alcanzó
     lleva ✗, lo seco ✓, y el marcador cuenta las ✗. La marca del agua queda
     donde llegó el agua, y la cintura de la persona, en la marca. ⚠️ Y la
     prueba no se regala: ni amenaza, ni vulnerabilidad, ni riesgo, ni
     prevención (los pareados), ni inundación, crecida, evacuar o alerta, ni
     un número de más. */
  amAguacero(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const cen = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const cerca = (a, b, t) => Math.abs(a - b) <= t;
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['amenaza', 'amenazas', 'vulnerabilidad', 'vulnerable', 'vulnerables', 'riesgo', 'riesgos', 'prevención', 'prevenir',
      'mitigación', 'mitigar', 'refugio', 'deslizamiento', 'deslizamientos', 'derrumbe', 'derrumbes', 'ladera', 'laderas', 'rocas', 'ojo',
      'copeco', 'codel', 'saffir', 'simpson', 'mitch', 'sequía', 'tsunami', 'reforestar', 'reforestación', 'evacuación', 'evacuar',
      'terremoto', 'sismo', 'sismos', 'temblor', 'temprana', 'centroamérica', 'crecido', 'crecida', 'crecidos', 'creció', 'crece', 'crecen',
      'crecer', 'simulacro', 'simulacros', 'octubre', 'noviembre', 'categoría', 'inundación', 'inundaciones', 'inundó', 'inundada',
      'huracán', 'huracanes', 'tormenta', 'tormentas', 'rayos', 'viento', 'vientos', 'volcán', 'erupción', 'lava', 'ceniza', 'mochila',
      'alerta', 'alertas', 'roja', 'amarilla', 'deforestación', 'árboles', 'grietas', 'marejadas', 'mar', 'techo', 'lámina', 'amarrado',
      'corriente', 'cruzar', 'honda', 'drenajes', 'basura', 'cauce', 'desastre', 'desastres', 'fenómeno', 'fenómenos', 'daño', 'daños',
      'debilidad', 'probabilidad', 'impacto', 'evitar', 'seguro', 'segura', 'zona', 'zonas', 'peligro', 'salir', 'caliente', 'cálido',
      'gira', 'tranquilo', 'clima', 'comunidad', 'radio', 'aviso'];
    const FRASES = ['agua caliente', 'centro tranquilo', 'alerta temprana', 'zona segura', 'lugar seguro', 'evitar daños', 'reducir el impacto',
      'sufrir daños', 'causar daño', 'junto a los ríos', 'lluvias intensas', 'hacer crecer', 'bajan por', 'que suelen estar secos',
      'cubre de agua', 'fondo del mar', 'falta de lluvia', 'sembrar árboles', 'plan de emergencia', 'hay que irse'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de la prueba (ni amenaza, ni vulnerabilidad, ni riesgo, ni prevención, ni inundación, ni crecida, ni alerta)`, malas]);
    const nums = (dicho.match(/\d+/g) || []).map(Number);
    const PERMITIDOS = [0, 4];
    r.push([nums.every(k => PERMITIDOS.includes(k)), `paso ${n}: ningún número de la prueba`, nums.filter(k => !PERMITIDOS.includes(k))]);
    const frase = nb(e.texto);
    const F = [['Kenia', 'quebrada', 'vecino', 'loma', '¿Cuál'], ['mismo aguacero', 'igual de juntas'], ['loma', 'quebrada', 'todo el cerro'],
      ['se sale', 'cintura', 'colchones', 'cuadernos'], ['cintura', 'mojada y nada más', 'dónde estaba cada casa'],
      ['no se muda', 'no los alcanza', 'antes de que llueva', '¿Qué subirías tú']];
    r.push([F[n].every(w => frase.includes(w)), `paso ${n}: la frase dice lo que se ve (${F[n].join(', ')})`, frase]);

    /* ── Las dos casas: la misma casa, en dos lugares ── */
    const K = x.casas.kenia, V = x.casas.vecino, cau = x.cauce;
    const ancho = c => c.x1 - c.x0, alto = c => c.y1 - c.y0;
    if (n === 0) {
      const partes = ['fondo', 'muros', 'tejado'];
      r.push([partes.every(p => cerca(ancho(K[p]), ancho(V[p]), 0.3) && cerca(alto(K[p]), alto(V[p]), 0.3)),
        'las dos casas son la misma casa: las mismas paredes, los mismos muros y el mismo tejado',
        partes.map(p => [ancho(K[p]), alto(K[p]), ancho(V[p]), alto(V[p])].map(v => Math.round(v * 10) / 10))]);
      r.push([K.muros.x1 <= cau.x0 + 0.5 && cau.x0 - K.muros.x1 <= 20 && cerca(K.piso, cau.y0, 1),
        'la casa de Kenia está a la orilla de la quebrada, a la altura de la orilla', [K.muros.x1, cau.x0, K.piso, cau.y0]]);
      r.push([cerca(V.piso, x.suelos.vecino, 1) && V.piso < K.piso - 40 && V.muros.x0 >= cau.x1,
        'la del vecino está en la loma, del otro lado de la quebrada y mucho más arriba', [V.piso, x.suelos.vecino, K.piso]]);
    }
    const cosas = x.cosas, deK = cosas.filter(c => c.casa === 'kenia'), deV = cosas.filter(c => c.casa === 'vecino');
    const tipos = l => l.map(c => c.tipo).sort().join(',');
    r.push([deK.length === 4 && tipos(deK) === 'colchon,colchon,cuaderno,cuaderno' && tipos(deV) === tipos(deK),
      `paso ${n}: en cada casa hay dos colchones y dos cuadernos`, [tipos(deK), tipos(deV)]]);
    if (n < 5) {
      const rel = (c, h) => [c.caja.x0 - h.fondo.x0, c.caja.y1 - h.piso, ancho(c.caja), alto(c.caja)];
      const par = deK.every(c => {
        const o = deV.find(v => v.id === c.id.replace('kenia', 'vecino'));
        return !!o && rel(c, K).every((v, i) => cerca(v, rel(o, V)[i], 0.3));
      });
      r.push([par, `paso ${n}: y cada cosa está en el mismo sitio de su casa`]);
    }

    /* ── La lluvia: la misma en toda la escena ── */
    const ll = x.lluvia, llueve = n >= 1 && n !== 4;
    r.push([ll.ve === llueve, `paso ${n}: ${llueve ? 'llueve' : 'no llueve'}`, ll.ve]);
    const nu = x.nube;
    r.push([nu.ve === (n !== 4) && (!nu.ve || (nu.caja.x0 <= K.tejado.x0 + 2 && nu.caja.x1 >= V.tejado.x1 - 6 && nu.caja.y1 <= Math.min(...ll.gotas.map(q => q.a[1])) + 0.5)),
      `paso ${n}: ${n !== 4 ? 'una sola nube, encima de las dos casas, y las gotas salen de ella' : 'amaneció: ya no hay nube'}`, nu.caja]);
    const lb = x.rotulos.find(t => t.k === 'aguacero');
    r.push([!!lb && lb.ve === llueve && (!lb.ve || (nb(lb.dice) === 'el mismo aguacero' && lb.caja.x0 >= nu.caja.x0 && lb.caja.x1 <= nu.caja.x1 && lb.caja.y1 <= nu.caja.y1 + 0.5)),
      `paso ${n}: ${llueve ? '«el mismo aguacero», escrito en la nube' : 'la nube no dice nada'}`, lb && lb.dice]);
    r.push([x.sol === (n === 4), `paso ${n}: ${n === 4 ? 'salió el sol' : 'no hay sol'}`]);

    /* ── El agua de la quebrada, por su borde ── */
    const ag = x.agua;
    if (n === 0) {
      aguaDN.normal = ag.top;
      aguaDN.llena = null;
      r.push([ag.top > cau.y0 + 2 && ag.top < cau.y1, 'paso 0: la quebrada va por su cauce, por debajo de la orilla', [ag.top, cau.y0, cau.y1]]);
    } else if (n === 1 || n === 4) {
      r.push([cerca(ag.top, aguaDN.normal, 0.3), `paso ${n}: la quebrada va por su cauce, como al principio`, [ag.top, aguaDN.normal]]);
    } else if (n === 2) {
      r.push([ag.top > cau.y0 && ag.top < aguaDN.normal - 2, 'paso 2: la quebrada sube, sin salirse todavía', [ag.top, cau.y0, aguaDN.normal]]);
    } else {
      if (n === 3) aguaDN.llena = ag.top;
      r.push([ag.top < K.piso - 5 && ag.top > V.piso + 5, `paso ${n}: el agua se sale, entra en la casa de Kenia y no llega a la del vecino`, [ag.top, K.piso, V.piso]]);
      r.push([ag.x1 > cau.x1 && ag.sueloBorde != null && cerca(ag.sueloBorde, ag.top, 1.5),
        `paso ${n}: y llega hasta donde el cerro sube a su altura, ni un paso más`, [ag.x1, ag.sueloBorde, ag.top]]);
      if (n === 5) r.push([cerca(ag.top, aguaDN.llena, 0.3), 'paso 5: con el mismo aguacero, el agua llega a la misma altura', [ag.top, aguaDN.llena]]);
    }
    if (n === 1) {
      const g = ll.gotas.map(q => q.a[0] + (q.b[0] - q.a[0]) * (50 - q.a[1]) / (q.b[1] - q.a[1])).sort((a, b) => a - b);
      const pasos = g.slice(1).map((v, i) => v - g[i]);
      const sobre = h => g.filter(v => v >= h.tejado.x0 && v <= h.tejado.x1).length;
      r.push([g.length >= 15 && pasos.every(p => cerca(p, pasos[0], 0.3)),
        'las gotas caen al mismo paso en toda la escena: la misma lluvia en la loma y en la orilla', [g.length, Math.min(...pasos), Math.max(...pasos)]]);
      r.push([sobre(K) >= 3 && sobre(V) >= 3, 'y caen sobre las dos casas', [sobre(K), sobre(V)]]);
      /* Cada gota termina justo encima de lo que tiene debajo. */
      const techo = (h, px) => {
        const c = h.tejado, m = (c.x0 + c.x1) / 2;
        if (px < c.x0 || px > c.x1) return null;
        return c.y1 - (c.y1 - c.y0) * (1 - Math.abs(px - m) / (m - c.x0));
      };
      const mal = ll.gotas.filter(q => {
        const px = q.b[0], py = q.b[1], t = techo(K, px) ?? techo(V, px);
        const debajo = t != null ? t : (px > cau.x0 && px < cau.x1 ? aguaDN.normal : q.sueloFin);
        return !(debajo != null && py < debajo && debajo - py <= 5);
      }).map(q => q.b.map(v => Math.round(v)));
      r.push([mal.length === 0, 'cada gota termina justo encima de lo que tiene debajo: el techo, el suelo o la quebrada', mal.slice(0, 3)]);
      const adentro = ll.gotas.filter(q => [K, V].some(h => {
        for (let i = 0; i <= 12; i++) {
          const px = q.a[0] + (q.b[0] - q.a[0]) * i / 12, py = q.a[1] + (q.b[1] - q.a[1]) * i / 12;
          if (px > h.fondo.x0 && px < h.fondo.x1 && py > h.fondo.y0 && py < h.fondo.y1) return true;
        }
        return false;
      }));
      r.push([adentro.length === 0, 'y ninguna cae adentro de una casa', adentro.length]);
    }

    /* ── La flecha del agua que baja ── */
    const f = x.flecha, baja = n === 2 || n === 3 || n === 5;
    if (!baja) r.push([!f.puntaVe && (f.corrido > 1 || !f.ve), `paso ${n}: no se ve el agua que baja`, [f.corrido, f.puntaVe]]);
    else {
      const m = f.muestras, ys = m.map(q => q.p[1]);
      r.push([f.ve && f.corrido <= 1 && f.puntaVe, `paso ${n}: la flecha del agua que baja está entera, con su punta`, [f.corrido, f.puntaVe]]);
      r.push([d2(m[0].p, V.alero) <= 4, `paso ${n}: sale del alero del vecino`, [m[0].p, V.alero].map(q => q.map(Math.round))]);
      r.push([ys.every((v, i) => i === 0 || v >= ys[i - 1] - 0.01), `paso ${n}: y va siempre hacia abajo`]);
      const cerro = m.filter(q => q.p[0] > cau.x1 + 1 && q.p[0] < V.muros.x0 - 6);
      const lejos = cerro.filter(q => q.suelo == null || q.suelo - q.p[1] < -0.3 || q.suelo - q.p[1] > 7);
      r.push([cerro.length >= 8 && lejos.length === 0, `paso ${n}: corre pegada al cerro, por encima del suelo`, [cerro.length, lejos.slice(0, 2).map(q => q.p.map(Math.round))]]);
      r.push([f.punta[0] > cau.x0 && f.punta[0] < cau.x1 && f.punta[1] > cau.y0, `paso ${n}: y termina dentro de la quebrada`, f.punta.map(Math.round)]);
    }

    /* ── Lo de adentro: ✗ lo que el agua alcanzó, ✓ lo seco ── */
    const marca = (id, t) => { const q = x.marcas.find(m => m.de === id && m.tipo === t); return !!q && q.ve; };
    const bajoAgua = c => aguaDN.llena != null && c.caja.y0 > aguaDN.llena;
    const seca = c => aguaDN.llena == null || c.caja.y1 < aguaDN.llena;
    if (n <= 2) r.push([x.marcas.every(m => !m.ve), `paso ${n}: todavía no hay ✗ ni ✓`]);
    else {
      const toca = c => n === 3 ? (c.casa === 'kenia' ? 'x' : null) : n === 4 ? (c.casa === 'kenia' ? 'x' : 'v') : 'v';
      const mal = cosas.filter(c => marca(c.id, 'x') !== (toca(c) === 'x') || marca(c.id, 'v') !== (toca(c) === 'v')).map(c => c.id);
      r.push([mal.length === 0, `paso ${n}: ${n === 3 ? 'lo de Kenia lleva ✗' : n === 4 ? 'lo de Kenia lleva ✗ y lo del vecino ✓' : 'todo lleva ✓'}, y nada más`, mal]);
      const falsas = cosas.filter(c => (marca(c.id, 'x') && !bajoAgua(c)) || (marca(c.id, 'v') && !seca(c))).map(c => c.id);
      r.push([falsas.length === 0, `paso ${n}: cada ✗ está sobre algo que el agua alcanzó y cada ✓ sobre algo seco`, falsas]);
      const fuera = x.marcas.filter(m => m.ve).filter(m => {
        const c = cosas.find(q => q.id === m.de);
        return !c || m.c[0] < c.caja.x0 - 1.5 || m.c[0] > c.caja.x1 + 1.5 || m.c[1] < c.caja.y0 - 1.5 || m.c[1] > c.caja.y1 + 1.5;
      }).map(m => m.de);
      r.push([fuera.length === 0, `paso ${n}: cada marca está encima de su cosa`, fuera]);
    }
    const rp = x.repisa;
    if (n === 5) {
      r.push([rp.ve && rp.tabla.x0 >= K.fondo.x0 - 1.5 && rp.tabla.x1 <= K.fondo.x1 + 1.5 && rp.tabla.y0 < aguaDN.llena - 6,
        'paso 5: en la casa de Kenia hay una repisa alta, lejos del agua', rp.tabla]);
      const sueltas = deK.filter(c => !cerca(c.caja.y1, rp.tabla.y0, 1) || c.caja.x0 < rp.tabla.x0 - 1 || c.caja.x1 > rp.tabla.x1 + 1).map(c => c.id);
      r.push([sueltas.length === 0, 'paso 5: los colchones y los cuadernos de Kenia están sobre la repisa', sueltas]);
    } else r.push([!rp.ve, `paso ${n}: todavía no hay repisa`]);
    const cuentaX = h => cosas.filter(c => c.casa === h && marca(c.id, 'x')).length;
    if (n === 3) r.push([nb(e.cifra) === String(cuentaX('kenia')) && cuentaX('kenia') === deK.filter(bajoAgua).length && cuentaX('kenia') === 4 &&
      nb(e.palabras) === 'colchones y cuadernos bajo el agua', 'paso 3: el marcador cuenta lo que quedó debajo del agua: las 4 ✗', [e.cifra, cuentaX('kenia')]]);
    if (n === 4) r.push([nb(e.cifra) === cuentaX('kenia') + ' y ' + cuentaX('vecino') && nb(e.palabras) === 'perdidos: abajo y en la loma',
      'paso 4: el marcador cuenta las ✗ de cada casa: ' + cuentaX('kenia') + ' y ' + cuentaX('vecino'), e.cifra]);
    if (n === 5) r.push([nb(e.cifra) === '0' && deK.filter(bajoAgua).length === 0 && cuentaX('kenia') === 0 && nb(e.palabras) === 'perdidos, con la misma agua',
      'paso 5: el marcador dice 0: lo de Kenia está arriba del agua', e.cifra]);
    const M = [['?', 'cuál casa se va a llenar de agua'], ['=', 'la misma lluvia en las dos casas'], ['↓', 'el agua de la loma baja a la quebrada']];
    if (n <= 2) r.push([nb(e.cifra) === M[n][0] && nb(e.palabras) === M[n][1], `paso ${n}: el marcador dice «${M[n][0]}» y «${M[n][1]}»`, [e.cifra, e.palabras]]);

    /* ── Al otro día: la marca del agua, la persona y el techo mojado ── */
    const lr = x.lodo.raya, lm = x.lodo.mancha, pe = x.persona;
    const rot = k => x.rotulos.find(t => t.k === k);
    const rm = rot('marca'), rc = rot('cintura');
    if (n === 4) {
      const yl = cen(lr.caja)[1], cint = cen(pe.cintura)[1], alt = pe.caja.y1 - pe.caja.y0;
      r.push([lr.ve && cerca(yl, aguaDN.llena, 0.6) && lr.caja.x0 <= K.fondo.x0 + 1 && lr.caja.x1 >= K.fondo.x1 - 1,
        'paso 4: la marca del agua queda en la pared de Kenia, donde llegó el agua', [yl, aguaDN.llena]]);
      r.push([lm.ve && cerca(lm.caja.y0, aguaDN.llena, 1) && cerca(lm.caja.y1, K.piso, 1), 'paso 4: y la pared queda sucia de la marca para abajo', lm.caja]);
      r.push([!!rm && rm.ve && nb(rm.dice) === 'la marca del agua' && rm.caja.y1 <= lr.caja.y0 + 0.5 && rm.caja.x0 >= K.fondo.x0 && rm.caja.x1 <= K.fondo.x1,
        'paso 4: con «la marca del agua» escrito encima de la raya', rm && rm.dice]);
      r.push([pe.ve && cerca(pe.caja.y1, K.piso, 1) && pe.caja.x0 >= K.muros.x1 && pe.caja.x1 <= cau.x0,
        'paso 4: una persona parada en el patio, entre la casa y la quebrada', pe.caja]);
      r.push([cerca(cint, yl, 1.2) && (pe.caja.y1 - cint) / alt > 0.55 && (pe.caja.y1 - cint) / alt < 0.68,
        'paso 4: su cintura está a la altura de la marca: el agua llegó hasta la cintura', [cint, yl, Math.round((pe.caja.y1 - cint) / alt * 100) / 100]]);
      r.push([!!rc && rc.ve && nb(rc.dice) === 'cintura' && cerca(cen(rc.caja)[1], cint, 3.5) && rc.caja.x0 >= pe.caja.x1 && rc.caja.x0 - pe.caja.x1 <= 14,
        'paso 4: con «cintura» escrito al lado', rc && rc.dice]);
      const mo = x.mojada, t = V.tejado;
      const lejos = mo.gotas.filter(g => { const c = cen(g); return c[0] < t.x0 - 8 || c[0] > t.x1 + 8 || c[1] < t.y0 - 8 || c[1] > t.y1 + 12; });
      r.push([mo.ve && mo.gotas.length >= 3 && lejos.length === 0, 'paso 4: el techo del vecino gotea: mojada y nada más', [mo.gotas.length, lejos.length]]);
    } else {
      r.push([!lr.ve && !lm.ve && !pe.ve && !(rm && rm.ve) && !(rc && rc.ve) && !x.mojada.ve, `paso ${n}: ni marca del agua, ni persona, ni techo que gotea`]);
    }

    /* ── Los rótulos ── */
    const enX = (t, a, b) => { const c = cen(t.caja)[0]; return c >= a && c <= b; };
    const rk = rot('kenia'), rv = rot('vecino'), rq = rot('quebrada'), rl = rot('loma');
    r.push([!!rk && rk.ve && nb(rk.dice) === 'Kenia' && enX(rk, K.muros.x0, K.muros.x1) && rk.caja.y0 >= K.piso, `paso ${n}: «Kenia», debajo de su casa`]);
    r.push([!!rv && rv.ve && nb(rv.dice) === 'el vecino' && enX(rv, V.muros.x0, V.muros.x1) && rv.caja.y0 >= V.piso, `paso ${n}: «el vecino», debajo de la suya`]);
    r.push([!!rq && rq.ve && nb(rq.dice) === 'la quebrada' && enX(rq, cau.x0, cau.x1) && rq.caja.y0 >= cau.y0, `paso ${n}: «la quebrada», debajo de su cauce`]);
    r.push([!!rl && rl.ve && nb(rl.dice) === 'la loma' && enX(rl, cau.x1, V.muros.x0) && rl.enTierra, `paso ${n}: «la loma», escrita en el cerro`]);
    return r;
  },
  /* Los Continentes: Europa, Asia y África. «El precio que no se pone
     aquí». ⚠️ Nada se le cree a la escena. El mapa se mide como el de la
     misión anterior: la sonda proyecta por su cuenta, cada punto de los
     contornos tiene que estar donde cae, y ciudades de verdad dicen qué se
     iluminó: Europa lleva Ufá y no Ekaterimburgo, Tracia y no Anatolia;
     Asia, el Sinaí y no El Cairo; África, Madagascar y no Riad. La flecha
     va de la casa, en Honduras, a un punto de Europa, y cruza el océano. En
     la mesa, la sonda empareja cada taza con el quintal que tiene debajo:
     tiene café la que tiene quintal, falta el que no está y sobran los que
     no tienen taza encima; y de ahí saca el precio: con menos quintales que
     tazas la pila es alta, con más, baja, y lo que se fue va con raya
     cortada. El quintal de don Chele no se mueve de un paso a otro y se
     vende los dos años. ⚠️ Y la prueba no se regala: ni tamaños, ni
     países, ni lo que vende o compra Honduras, ni el mar entre Europa y
     África, ni un número de más. */
  amPrecio(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/\u00a0/g, ' ').trim();
    const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['grande', 'grandes', 'pequeño', 'pequeña', 'tamaño', 'país', 'países', 'china', 'japón', 'corea', 'india',
      'egipto', 'nigeria', 'sudáfrica', 'urales', 'alpes', 'pirineos', 'danubio', 'rin', 'volga', 'nilo', 'sahara', 'everest',
      'himalaya', 'monzón', 'mediterráneo', 'colonialismo', 'koica', 'aacue', 'ue', 'unión', 'europea', 'euro', 'suez', 'roma',
      'grecia', 'ganges', 'yangtsé', 'gobi', 'kilimanjaro', 'humanidad', 'joven', 'jazz', 'blues', 'francés', 'inglés', 'portugués',
      'idioma', 'idiomas', 'muralla', 'eiffel', 'coliseo', 'taj', 'angkor', 'renacimiento', 'industrial', 'cristianismo', 'onu',
      'oea', 'banano', 'textiles', 'mariscos', 'palma', 'ropa', 'tecnología', 'celulares', 'maquinaria', 'autos', 'petróleo',
      'trenes', 'turismo', 'población', 'masa', 'eurasia', 'viejo', 'cooperación', 'becas', 'acuerdo', 'socios', 'socio', 'bloque',
      'mercado', 'exporta', 'importa', 'exportación', 'importación', 'mar', 'atlántico', 'pacífico', 'mesopotamia', 'bruselas',
      'clima', 'cumbres', 'marcala', 'caficultor', 'tigres', 'asean', 'cuna'];
    const FRASES = ['misma masa', 'techo del mundo', 'más largo', 'mercado único', 'más grande', 'más poblado', 'socios comerciales',
      'unión europea', 'unión africana', 'estados unidos', 'cambio climático'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de las respuestas de la prueba (ni tamaños, ni países, ni lo que vende o compra Honduras)`, malas]);
    const nums = (dicho.match(/\d+/g) || []).map(Number);
    const PERMITIDOS = [0, 1, 2, 3, 4, 8];
    r.push([nums.every(k => PERMITIDOS.includes(k)), `paso ${n}: ningún número de la prueba (ni kilómetros, ni países, ni por ciento)`, nums.filter(k => !PERMITIDOS.includes(k))]);

    const ORDEN = ['europa', 'asia', 'africa'];
    const NOMBRE = { europa: 'Europa', asia: 'Asia', africa: 'África' };
    const nombrados = n === 0 ? [] : n === 1 ? ['europa'] : n <= 4 ? ['europa', 'asia'] : ['europa', 'asia', 'africa'];

    /* ── El mapa: una sola vez, porque no cambia ── */
    if (n === 0) {
      const p = x.proy;
      r.push([p.dibujados === p.anillos && p.total > 1000 && p.faltan === 0,
        'cada punto de los contornos está en el dibujo donde lo pone Equal Earth, proyectado por la sonda', p]);
      r.push([Math.abs(p.alto - p.altoEE) <= 0.6, 'el mapa mide de alto lo que Equal Earth manda para su ancho: es un mapa de áreas verdaderas',
        [Math.round(p.alto * 10) / 10, Math.round(p.altoEE * 10) / 10]]);
      r.push([p.partidos.length === 0, 'la costura va por el estrecho de Bering: ningún continente sale partido (la Antártida da la vuelta entera y va de una pieza)', p.partidos]);
      r.push([p.aguaEncima, 'el mar Negro y el Caspio se pintan encima de las luces: el agua no se ilumina', p.aguaEncima]);
      const fuera = x.ciudades.filter(c => !c.tierra).map(c => c.nombre);
      r.push([fuera.length === 0, 'las ciudades de prueba caen en tierra (la sonda no mide sobre el mar)', fuera]);
      const mal = x.ciudades.filter(c => ORDEN.some(k => c.luz[k] !== (c.de === k)))
        .map(c => c.nombre + ' → ' + (ORDEN.filter(k => c.luz[k]).join(', ') || 'ninguno'));
      r.push([mal.length === 0, 'cada continente iluminado lleva sus ciudades y ninguna de otro (Ufá y Tracia son de Europa; Ekaterimburgo, Anatolia y el Sinaí, de Asia; El Cairo, de África)', mal]);
    }

    /* ── La casa, en Honduras ── */
    const casa = x.casa;
    r.push([!!casa && casa.ve && casa.lon >= -89.4 && casa.lon <= -83.1 && casa.lat >= 12.9 && casa.lat <= 16.5 && d2(casa.pos, casa.proy) <= 0.6,
      `paso ${n}: la casa está en Honduras, y en el dibujo donde cae su punto`, casa && [casa.lon, casa.lat]]);
    const hl = x.honduras;
    const lejosDe = (c, p) => Math.max(c.x0 - p[0], p[0] - c.x1, c.y0 - p[1], p[1] - c.y1, 0);
    r.push([!!hl && !!casa && hl.ve && nb(hl.dice) === 'Honduras' && lejosDe(hl.tinta, casa.pos) <= 10, `paso ${n}: y lleva «Honduras» al lado`, hl && hl.dice]);

    /* ── Los continentes con nombre ── */
    const luces = x.luces.filter(l => l.ve).map(l => l.k);
    r.push([JSON.stringify(luces) === JSON.stringify(nombrados), `paso ${n}: se ilumina${nombrados.length === 1 ? '' : 'n'} ${nombrados.length ? nombrados.map(k => NOMBRE[k]).join(', ') : 'ninguno'}, y nada más`, luces]);
    const nombres = x.nombres.filter(t => t.ve);
    r.push([JSON.stringify(nombres.map(t => t.k)) === JSON.stringify(nombrados) && nombres.every(t => nb(t.dice) === NOMBRE[t.k]),
      `paso ${n}: cada continente iluminado lleva su nombre escrito`, nombres.map(t => t.dice)]);
    r.push([nombres.every(t => t.cerca), `paso ${n}: y cada nombre está sobre su continente o junto a él`, nombres.filter(t => !t.cerca).map(t => t.dice)]);

    /* ── La flecha del café: de la casa a Europa, por el océano ── */
    const ru = x.ruta;
    if (!ru || !casa) r.push([false, `paso ${n}: la flecha del café existe`]);
    else if (n === 0) r.push([!ru.puntaVe && (ru.corrido > 1 || !ru.ve), 'paso 0: el café todavía no sale: no hay flecha', [ru.corrido, ru.puntaVe]]);
    else {
      const ini = ru.muestras[0].p, medio = ru.muestras.slice(3, 18), xs = ru.muestras.map(m => m.p[0]);
      r.push([ru.ve && ru.corrido <= 1 && ru.puntaVe, `paso ${n}: la flecha del café está entera, con su punta`, [ru.corrido, ru.puntaVe]]);
      r.push([d2(ini, casa.pos) <= 12, `paso ${n}: sale de la casa, en Honduras`, ini.map(Math.round)]);
      r.push([ru.luzPunta.europa && !ru.luzPunta.asia && !ru.luzPunta.africa && d2(ru.punta, ru.destino) <= 0.6,
        `paso ${n}: y su punta llega a Europa, y a ningún otro continente`, ru.luzPunta]);
      r.push([medio.every(m => !m.tierra) && xs.every((v, i) => i === 0 || v >= xs[i - 1] - 0.01),
        `paso ${n}: cruza el océano, y va siempre hacia Europa`, medio.filter(m => m.tierra).length]);
    }

    /* ── El «?» del final, sobre la casa ── */
    const bu = x.burbuja;
    r.push([!!bu && !!casa && bu.ve === (n === 5) && (!bu.ve || (d2(bu.pos, casa.pos) <= 20 && bu.raya > 0 && bu.raya <= 3 && nb(bu.signo) === '?')),
      `paso ${n}: ${n === 5 ? 'sobre la casa, un «?» con el aro de raya cortada: lo que vino a tu casa' : 'todavía no hay «?» sobre la casa'}`, bu && [bu.ve, bu.raya]]);

    /* ── La mesa: tazas y quintales ── */
    const tazas = x.tazas.filter(t => t.ve), sacos = x.sacos.filter(s => s.ve);
    const nT = tazas.length, nS = sacos.length;
    const nTazas = n === 0 ? 0 : n === 1 ? 2 : 4, nSacos = n <= 2 ? 1 : n === 3 ? 3 : 8;
    r.push([nT === nTazas && nS === nSacos, `paso ${n}: en la mesa hay ${nTazas} taza${nTazas === 1 ? '' : 's'} y ${nSacos} quintal${nSacos === 1 ? '' : 'es'}`, [nT, nS]]);
    const m = x.mesa;
    r.push([tazas.map(t => t.c).concat(sacos.map(s => s.c)).every(c => c[0] > m.x0 && c[0] < m.x1 && c[1] > m.y0 && c[1] < m.y1),
      `paso ${n}: las tazas y los quintales están sobre la mesa`]);
    const debajo = t => sacos.find(s => Math.abs(s.c[0] - t.c[0]) <= 2 && s.c[1] > t.c[1]);
    const conTaza = s => tazas.some(t => Math.abs(s.c[0] - t.c[0]) <= 2 && s.c[1] > t.c[1]);
    if (n >= 3) {
      r.push([tazas.every(t => t.cafe === !!debajo(t) && t.vapor === t.cafe), `paso ${n}: una taza tiene café si y solo si tiene un quintal debajo`,
        tazas.map(t => [t.i, t.cafe, !!debajo(t)])]);
    } else {
      r.push([tazas.every(t => !t.cafe && !t.vapor), `paso ${n}: todavía nadie compró: las tazas están vacías`, tazas.map(t => t.cafe)]);
    }
    const sinCafe = tazas.filter(t => !t.cafe), sobrantes = n >= 3 ? sacos.filter(s => !conTaza(s)) : [];
    const escasez = n >= 3 && nS < nT, sobra = n >= 3 && nS > nT;

    /* ── El quintal de don Chele: el mismo, en el mismo sitio ── */
    const dc = x.sacos.find(s => s.chele);
    r.push([!!dc && dc.ve, `paso ${n}: el quintal de don Chele está en la mesa`]);
    if (dc) {
      if (chelePrecio == null || n === 0) chelePrecio = dc.c;
      r.push([d2(dc.c, chelePrecio) <= 0.3, `paso ${n}: y no se mueve de un paso a otro: es el mismo quintal`, [dc.c, chelePrecio].map(q => q.map(v => Math.round(v * 10) / 10))]);
      const rc = x.rotulos.find(t => t.k === 'chele');
      r.push([!!rc && rc.ve && nb(rc.dice) === 'don Chele' && rc.tinta.y0 >= dc.caja.y1 - 1 && Math.abs((rc.tinta.x0 + rc.tinta.x1) / 2 - dc.c[0]) <= 3,
        `paso ${n}: con «don Chele» escrito debajo`, rc && rc.dice]);
      const h = x.precio.hilo, et = x.precio.etiqueta, cb = dc.caja;
      r.push([!!h && !!et && lejosDe(et, h[0]) <= 0.5 && h[1][0] >= cb.x0 - 1 && h[1][0] <= cb.x1 + 1 && h[1][1] >= cb.y0 - 1 && h[1][1] <= cb.y0 + 8,
        `paso ${n}: la etiqueta del precio cuelga del cuello de su quintal`, h && h.map(q => q.map(Math.round))]);
      if (n >= 3) r.push([conTaza(dc) && tazas.some(t => Math.abs(dc.c[0] - t.c[0]) <= 2 && t.cafe), `paso ${n}: el quintal de don Chele se vende: tiene una taza con café encima`]);
    }

    /* ── Lo que falta y lo que sobra ── */
    const fa = x.falta, so = x.sobran;
    r.push([!!fa && fa.ve === escasez && (!fa.ve || (sinCafe.length === 1 && Math.abs(fa.c[0] - sinCafe[0].c[0]) <= 2 && fa.c[1] > sinCafe[0].c[1] && fa.raya > 0 && nb(fa.dice) === 'falta')),
      `paso ${n}: ${escasez ? 'debajo de la taza sin café, el quintal que falta, con raya cortada y «falta»' : 'no falta ningún quintal'}`, fa && [fa.ve, fa.raya]]);
    const enRecuadro = so ? sacos.filter(s => s.c[0] > so.caja.x0 && s.c[0] < so.caja.x1 && s.c[1] > so.caja.y0 && s.c[1] < so.caja.y1) : [];
    r.push([!!so && so.ve === sobra && (!so.ve || (so.raya > 0 && nb(so.dice) === 'sobran' && sobrantes.length > 0 && enRecuadro.length === sobrantes.length && sobrantes.every(s => enRecuadro.includes(s)))),
      `paso ${n}: ${sobra ? 'los quintales sin taza encima, y solo esos, van en el recuadro de raya cortada que dice «sobran»' : 'no sobra ningún quintal'}`, so && [so.ve, enRecuadro.length, sobrantes.length]]);
    if (n >= 3 && !sobra) r.push([sobrantes.length === 0, `paso ${n}: todo quintal de la mesa tiene su taza`, sobrantes.length]);

    /* ── El precio: sale de la mesa, no del rótulo ── */
    const pr = x.precio;
    const pila = n <= 2 ? 0 : escasez ? 3 : sobra ? 1 : -1;
    r.push([pr.monedas === pila, `paso ${n}: ${n <= 2 ? 'todavía no hay precio' : escasez ? 'con menos quintales que tazas, la pila de monedas es alta' : 'con más quintales que tazas, la pila es baja'}`, [pr.monedas, pila]]);
    r.push([!!pr.duda && pr.duda.ve === (n <= 2) && (!pr.duda.ve || nb(pr.duda.dice) === '?'), `paso ${n}: la etiqueta dice «?» mientras no hay quien compre y quien venda`, pr.duda]);
    r.push([pr.fantasmas.length === (sobra ? 3 - pr.monedas : 0) && pr.fantasmas.every(v => v > 0),
      `paso ${n}: ${sobra ? 'las monedas que se fueron quedan dibujadas con raya cortada' : 'no hay monedas con raya cortada'}`, pr.fantasmas]);
    const rco = x.rotulos.find(t => t.k === 'compran');
    r.push([!!rco && rco.ve === (n >= 1) && (!rco.ve || (nT > 0 && rco.tinta.x1 < Math.min(...tazas.map(t => t.c[0])) - 5 && Math.abs((rco.tinta.y0 + rco.tinta.y1) / 2 - tazas[0].c[1]) <= 6)),
      `paso ${n}: ${n >= 1 ? '«compran», a la izquierda de las tazas' : 'todavía no hay quien compre'}`, rco && rco.ve]);

    /* ── El marcador y la frase ── */
    const frase = nb(e.texto);
    if (n === 0) r.push([nb(e.cifra) === '?' && nb(e.palabras) === 'el precio de su quintal', 'paso 0: el marcador dice «?», como la etiqueta', [e.cifra, e.palabras]]);
    if (n === 1 || n === 2) r.push([nb(e.cifra) === String(luces.length) && nb(e.palabras) === (luces.length === 1 ? 'continente que lo compra' : 'continentes que lo compran'),
      `paso ${n}: el marcador cuenta los continentes iluminados (${luces.length})`, [e.cifra, e.palabras]]);
    if (n === 3 || n === 4) r.push([nb(e.cifra) === String(nS) && nb(e.palabras) === `quintales para ${nT} que compran`,
      `paso ${n}: el marcador cuenta los quintales y las tazas que se ven (${nS} para ${nT})`, [e.cifra, e.palabras]]);
    if (n === 5) r.push([nb(e.cifra) === '?' && nb(e.palabras) === 'lo que vino a tu casa', 'paso 5: el marcador dice «?», como el de la casa', [e.cifra, e.palabras]]);
    if (n === 1) r.push([frase.includes('Europa') && frase.includes('océano'), 'paso 1: la frase dice que el café cruza el océano hasta Europa', frase]);
    if (n === 2) r.push([frase.includes('Asia'), 'paso 2: la frase nombra Asia', frase]);
    if (n === 3) r.push([frase.includes('poco café') && frase.includes('No alcanza') && frase.includes('pagan bien') && escasez, 'paso 3: la frase dice que no alcanza, y en la mesa hay menos quintales que tazas', frase]);
    if (n === 4) r.push([frase.includes('mucho café') && frase.includes('Sobra') && frase.includes('mismo quintal') && frase.includes('menos') && sobra,
      'paso 4: la frase dice que sobra, y en la mesa hay más quintales que tazas', frase]);
    if (n === 5) r.push([ORDEN.every(k => frase.includes(NOMBRE[k])) && frase.includes('casa') && frase.includes('no cambió nada'), 'paso 5: la frase nombra los tres continentes, la casa y que don Chele no cambió nada', frase]);
    return r;
  },
  /* Los Continentes: América, Oceanía y Antártida. «¿Y eso queda lejos?»
     ⚠️ Nada se le cree a la escena. La sonda proyecta por su cuenta
     (Equal Earth, con el meridiano del centro que declara el mapa y la
     escala que sale del borde del dibujo), y cada punto de los contornos
     tiene que estar en el dibujo donde cae. Ciudades de verdad dicen qué se
     iluminó: América lleva Tegucigalpa, Groenlandia, Bogotá y La Paz, y no
     Madrid ni el Senegal; Oceanía, Alice Springs, Nueva Guinea, las dos
     islas de Nueva Zelanda y Fiyi, y no Java, Borneo ni Tokio; la
     Antártida, su interior, y no Tasmania. De ahí salen las flechas (de la
     casa a su continente), el marcador (cuántos nombres se ven) y, a las 8
     de la noche, la noche: del sol que está dibujado sale la hora del
     mundo, y con ella lo que tienen que decir los dos relojes, la frontera
     del día, dónde caen la casa, Sídney y las lunas, y que «casi toda
     América» sea casi toda y no toda. ⚠️ Y la prueba no se regala: ni
     «Pacífico», ni «polo», ni tamaños, ni países, ni un número de más. */
  amLejos(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cerca = (a, b, tol) => Math.abs(a - b) <= tol;
    const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['pacífico', 'atlántico', 'índico', 'polo', 'polos', 'sur', 'norte', 'hielo', 'helado', 'helada', 'nieve',
      'permanente', 'población', 'científico', 'científicos', 'investigan', 'investigar', 'temporada', 'temporadas', 'remesa', 'remesas',
      'dinero', 'mar', 'nivel', 'ventoso', 'seco', 'seca', 'argentina', 'méxico', 'canadá', 'perú', 'chile', 'belice', 'venezuela',
      'brasil', 'australia', 'zelanda', 'país', 'países', 'pequeño', 'pequeña', 'grande', 'grandes', 'tamaño', 'región', 'regiones',
      'central', 'centroamérica', 'norteamérica', 'sudamérica', 'suramérica', 'militar', 'militares', 'bases', 'dueño', 'pertenece',
      'deshielo', 'costa', 'costas', 'pingüino', 'pingüinos', 'ballena', 'ballenas', 'oea', 'cafta', 'copán', 'vinson', 'aconcagua',
      'andes', 'amazonas', 'maoríes', 'aborígenes', 'tratado', 'kosciuszko', 'bosque', 'selva', 'isla', 'islas', 'clima', 'climático',
      'hemisferio', 'oeste', 'corazón', 'centro', 'medio'];
    const FRASES = ['estados unidos', 'ee uu', 'cambio climático', 'en medio', 'alrededor del polo'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna palabra de las respuestas de la prueba (ni «Pacífico», ni «polo», ni tamaños ni países)`, malas]);
    const nums = (dicho.match(/\d+/g) || []).map(Number);
    const PERMITIDOS = [0, 1, 2, 3, 8, 12, 16];
    r.push([nums.every(k => PERMITIDOS.includes(k)), `paso ${n}: ningún número de la prueba (ni kilómetros, ni años, ni cuántos países)`, nums.filter(k => !PERMITIDOS.includes(k))]);

    const ORDEN = ['america', 'oceania', 'antartida'];
    const NOMBRE = { america: 'América', oceania: 'Oceanía', antartida: 'Antártida' };
    const nombrados = ORDEN.slice(0, Math.min(n, 3));

    /* ── El mapa: una sola vez, porque no cambia ── */
    if (n === 0) {
      const p = x.proy;
      r.push([p.dibujados === p.anillos && p.total > 1000 && p.faltan === 0,
        'cada punto de los contornos está en el dibujo donde lo pone Equal Earth, proyectado por la sonda', p]);
      r.push([cerca(p.alto, p.altoEE, 0.6), 'el mapa mide de alto lo que Equal Earth manda para su ancho: es un mapa de áreas verdaderas',
        [Math.round(p.alto * 10) / 10, Math.round(p.altoEE * 10) / 10]]);
      const fuera = x.ciudades.filter(c => !c.tierra).map(c => c.nombre);
      r.push([fuera.length === 0, 'las ciudades de prueba caen en tierra (la sonda no mide sobre el mar)', fuera]);
      const mal = x.ciudades.filter(c => ORDEN.some(k => c.luz[k] !== (c.de === k)))
        .map(c => c.nombre + ' → ' + (ORDEN.filter(k => c.luz[k]).join(', ') || 'ninguno'));
      r.push([mal.length === 0, 'cada continente iluminado lleva sus ciudades y ninguna de otro (Groenlandia es de América, Nueva Guinea de Oceanía, Java no)', mal]);
      const partidas = x.ciudades.filter(c => c.de === 'america' && c.trozos !== 1).map(c => c.nombre);
      r.push([partidas.length === 0, 'la costura va por el mar: ni América ni Groenlandia salen partidas', partidas]);
      const syd = x.sidney;
      r.push([!!syd && x.casa.pos[0] > syd.pos[0], 'con el océano en medio, América queda a la derecha de Oceanía', [x.casa.pos, syd && syd.pos].map(q => q && q.map(Math.round))]);
    }

    /* ── La casa de doña Nely ── */
    const casa = x.casa;
    r.push([!!casa && casa.ve && casa.lon >= -89.4 && casa.lon <= -83.1 && casa.lat >= 12.9 && casa.lat <= 16.5,
      `paso ${n}: la casa de doña Nely está en Honduras`, casa && [casa.lon, casa.lat]]);
    r.push([!!casa && d2(casa.pos, casa.proy) <= 0.6 && casa.luz.america, `paso ${n}: y en el dibujo, donde cae su punto, dentro de América`, casa && [casa.pos, casa.proy].map(q => q.map(v => Math.round(v * 10) / 10))]);

    /* ── Los continentes con nombre ── */
    const luces = x.luces.filter(l => l.ve).map(l => l.k);
    r.push([JSON.stringify(luces) === JSON.stringify(nombrados), `paso ${n}: se ilumina${nombrados.length === 1 ? '' : 'n'} ${nombrados.length ? nombrados.map(k => NOMBRE[k]).join(', ') : 'ninguno'}, y nada más`, luces]);
    const nombres = x.nombres.filter(t => t.ve);
    r.push([JSON.stringify(nombres.map(t => t.k)) === JSON.stringify(nombrados) && nombres.every(t => nb(t.dice) === NOMBRE[t.k]),
      `paso ${n}: cada continente iluminado lleva su nombre escrito`, nombres.map(t => t.dice)]);
    r.push([nombres.every(t => t.cerca), `paso ${n}: y cada nombre está sobre su continente o junto a él`, nombres.filter(t => !t.cerca).map(t => t.dice)]);

    /* ── Las tres flechas: de la casa a su continente ── */
    const fl = k => x.flechas.find(f => f.k === k);
    const faltaFlecha = ORDEN.filter(k => !fl(k) || !fl(k).ve || fl(k).corrido > 1 || !fl(k).puntaVe);
    r.push([x.flechas.length === 3 && faltaFlecha.length === 0, `paso ${n}: las tres flechas salen de la casa, enteras y con su punta`, faltaFlecha]);
    for (const k of ORDEN) {
      const f = fl(k), du = x.dudas.find(d => d.k === k);
      if (!f || !du) { r.push([false, `paso ${n}: la flecha y el lugar de ${NOMBRE[k]} existen`]); continue; }
      const ini = f.muestras[0].p;
      r.push([d2(ini, casa.pos) <= 12 && d2(f.punta, du.proy) <= 9 && d2(du.pos, du.proy) <= 0.6,
        `paso ${n}: la flecha de ${NOMBRE[k]} va de la casa hasta su lugar`, [ini, f.punta, du.proy].map(q => q.map(Math.round))]);
      r.push([ORDEN.every(o => du.luz[o] === (o === k)), `paso ${n}: y su lugar está en ${NOMBRE[k]}, y en ningún otro continente`, du.luz]);
      const nombrado = nombrados.includes(k);
      r.push([du.ve === !nombrado && (!du.ve || (du.raya > 0 && du.raya <= 3 && nb(du.signo) === '?')),
        `paso ${n}: ${nombrado ? `el lugar de ${NOMBRE[k]} ya no lleva «?»` : `el lugar de ${NOMBRE[k]} todavía es un «?» con el aro de raya cortada`}`, [du.ve, du.raya]]);
    }
    const oc = fl('oceania');
    if (oc) {
      const medio = oc.muestras.slice(4, 17);
      const xs = oc.muestras.map(m => m.p[0]);
      r.push([medio.every(m => !m.tierra) && xs.every((v, i) => i === 0 || v <= xs[i - 1] + 0.01),
        `paso ${n}: la flecha de Oceanía cruza el océano, y va siempre hacia la izquierda: hacia donde se pone el sol`, medio.filter(m => m.tierra).length]);
    }

    /* ── El marcador y la frase ── */
    if (n === 4) {
      /* se mide abajo, con los relojes */
    } else {
      const k = nombres.length;
      r.push([nb(e.cifra) === String(k) && nb(e.palabras) === (k === 1 ? 'continente con nombre' : 'continentes con nombre'),
        `paso ${n}: el marcador cuenta los continentes con nombre que se ven (${k})`, [e.cifra, e.palabras]]);
    }
    const frase = nb(e.texto);
    if (n === 0) r.push([/\btres\b/.test(frase) && x.dudas.filter(d => d.ve).length === 3, 'paso 0: la frase dice tres lugares, y hay tres «?»', frase]);
    if (n >= 1 && n <= 3) r.push([frase.includes(NOMBRE[ORDEN[n - 1]]), `paso ${n}: la frase nombra el continente que se acaba de iluminar`, frase]);

    /* ── La noche, a las 8 de doña Nely ── */
    const hora = n >= 4, noche = x.noche, sol = x.sol, sid = x.sidney;
    const prendidos = [noche.ve, !!sol && sol.ve, !!sid && sid.ve].concat(x.lunas.map(l => l.ve), x.relojes.map(c => c.ve));
    r.push([prendidos.every(v => v === hora), `paso ${n}: ${hora ? 'la noche, el sol, las lunas, Sídney y los relojes se ven' : 'todavía no hay noche, ni sol, ni relojes'}`, prendidos]);
    if (hora && sol && sid) {
      r.push([d2(sol.pos, sol.proy) <= 0.6 && !sol.noche, `paso ${n}: el sol está donde dice su punto, y de día`, [sol.lon, sol.lat]]);
      const malas = noche.pruebas.filter(p => p.noche !== (Math.abs(p.off) > 90));
      r.push([malas.length === 0, `paso ${n}: la frontera de la noche está a un cuarto de vuelta del sol, de polo a polo`, malas]);
      r.push([casa.noche && !sid.noche && x.lunas.every(l => l.noche), `paso ${n}: la casa de doña Nely y las lunas quedan de noche; Sídney, de día`, [casa.noche, sid.noche, x.lunas.map(l => l.noche)]]);
      r.push([cerca(sid.lon, 151.2, 0.3) && cerca(sid.lat, -33.9, 0.3) && d2(sid.pos, sid.proy) <= 0.6 && sid.luz.oceania && nb(sid.dice) === 'Sídney',
        `paso ${n}: Sídney está donde está Sídney, en Oceanía, con su nombre`, [sid.lon, sid.lat, sid.dice]]);
      const am = noche.america, f = am.total ? am.noche / am.total : 0;
      r.push([am.total > 50 && f >= 0.7 && f < 1, `paso ${n}: «casi toda América» es casi toda y no toda (${Math.round(f * 100)} % de sus puntos, de noche)`, am]);
      /* La hora del mundo sale del sol: está sobre el meridiano donde es
         mediodía. Honduras va con UTC−6 todo el año, y Sídney con UTC+10
         en septiembre (su horario de verano empieza en octubre). */
      const utc = ((12 - sol.lon / 15) % 24 + 24) % 24;
      const local = off => { const h = utc + off; return { h: ((h % 24) + 24) % 24, dia: Math.floor(h / 24) }; };
      const escrita = h => h === 12 ? '12 m.' : h === 0 ? '12 a. m.' : h < 12 ? h + ' a. m.' : (h - 12) + ' p. m.';
      const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const rc = x.relojes.find(c => c.k === 'casa'), rs = x.relojes.find(c => c.k === 'sidney');
      const hn = local(-6), sy = local(10);
      const dCasa = rc ? DIAS.indexOf(nb(rc.dia)) : -1, dSid = rs ? DIAS.indexOf(nb(rs.dia)) : -1;
      r.push([!!rc && !!rs && nb(rc.hora) === escrita(hn.h) && nb(rs.hora) === escrita(sy.h),
        `paso ${n}: los relojes dicen la hora que marca el sol: ${escrita(hn.h)} en la casa y ${escrita(sy.h)} en Sídney`, rc && rs && [rc.hora, rs.hora]]);
      r.push([dCasa >= 0 && dSid === (dCasa + (sy.dia - hn.dia) + 7) % 7, `paso ${n}: y el día de Sídney es ${sy.dia - hn.dia === 1 ? 'el siguiente' : 'el que toca'}`, rc && rs && [rc.dia, rs.dia]]);
      const lejos = (c, p) => Math.max(c.x0 - p[0], p[0] - c.x1, c.y0 - p[1], p[1] - c.y1, 0);
      r.push([!!rc && !!rs && lejos(rc.caja, casa.pos) <= 12 && lejos(rs.caja, sid.pos) <= 12, `paso ${n}: cada reloj está junto a su lugar`,
        rc && rs && [Math.round(lejos(rc.caja, casa.pos)), Math.round(lejos(rs.caja, sid.pos))]]);
      const dif = (sy.h - hn.h) + 24 * (sy.dia - hn.dia);
      if (n === 4) {
        r.push([nb(e.cifra) === dif + ' h' && /Sídney/.test(nb(e.palabras)), `paso 4: el marcador dice la diferencia que marcan los relojes (${dif} h)`, [e.cifra, e.palabras]]);
        r.push([frase.includes('8 de la noche') && hn.h === 20 && frase.includes('mediodía') && sy.h === 12 && frase.includes('día siguiente') && sy.dia - hn.dia === 1 && frase.includes('casi toda América'),
          'paso 4: la frase dice lo mismo que los relojes y la noche del dibujo', frase]);
      }
    }
    return r;
  },
  /* Geografía y Coordenadas: la aldea de doña Nely y los dos números de un
     punto. ⚠️ Nada se le cree a la escena. En la aldea, la sonda saca del
     dibujo cuáles casas cumplen la seña («la de la mata de mango, pasando
     el puente»): las que tienen su mata al lado y quedan del otro lado del
     río, del que no entra la ambulancia. Con eso compara las marcas, la
     ambulancia y el marcador; y en el 6, las dos líneas de la casa de doña
     Nely: pasan por su centro, cada una toca también otras casas y en las
     dos solo está la suya. En el mapa, saca la escala del marco (lo mismo
     por grado a lo ancho que a lo alto), las líneas de referencia de la
     malla, y de ahí los dos números del punto, leyendo la punta de la
     chincheta; con eso compara las flechas de punta a punta, los números,
     las letras, lo que va con raya cortada, las líneas enteras, el aro, la
     lectura y el marcador. Y comprueba que el punto caiga en tierra, en un
     cruce de la malla y FUERA de Honduras. ⚠️ Y la prueba no se regala: ni
     los nombres de los pareados, ni una palabra de las respuestas, ni un
     número de las preguntas. */
  amCruce(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cerca = (a, b, tol) => Math.abs(a - b) <= tol;
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['ecuador', 'greenwich', 'paralelo', 'paralelos', 'meridiano', 'meridianos', 'polo', 'polos', 'grado', 'grados',
      'imaginaria', 'imaginarias', 'ubicación', 'geográfica', 'geográficas', 'hemisferio', 'hemisferios', 'mitad', 'mitades', 'oeste',
      'sur', 'trópico', 'trópicos', 'círculo', 'círculos', 'tórrida', 'templada', 'polar', 'antípoda', 'huso', 'husos', 'hora', 'horas',
      'franja', 'franjas', 'honduras', 'tegucigalpa', 'ceiba', 'mar', 'océano', 'barco', 'isla', 'calle', 'calles', 'rótulo', 'rótulos',
      'cero', 'reino', 'distancia', 'coordenadas'];
    const FRASES = ['de un polo al otro', 'de polo a polo', 'parte la tierra', 'misma distancia', 'línea del medio de la tierra'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ningún nombre de los pareados ni una palabra de las respuestas de la prueba`, malas]);
    const nums = (dicho.match(/\d+/g) || []).map(Number);
    const PERMITIDOS = [0, 1, 3, 30, 40, 105];
    r.push([nums.every(k => PERMITIDOS.includes(k)) && !/(^|[^0-9])0°/.test(dicho), `paso ${n}: ningún número de las preguntas de la prueba (ni el 0°)`, nums.filter(k => !PERMITIDOS.includes(k))]);

    const enAldea = n <= 1 || n === 6;
    r.push([x.aldea === enAldea && x.mundo === !enAldea, `paso ${n}: se ve ${enAldea ? 'la aldea' : 'el mapa del mundo'}, y solo eso`, [x.aldea, x.mundo]]);

    if (enAldea) {
      /* ── La seña, sacada del dibujo: cada mata es de la casa que tiene más
         cerca; «pasando el puente» es la orilla contraria a la entrada, que
         es por donde espera la ambulancia al empezar. ── */
      const [bx, by] = x.puente;
      const bajo = x.rio.reduce((m, p) => Math.abs(p[1] - by) < Math.abs(m[1] - by) ? p : m);
      r.push([cerca(bajo[0], bx, 3), `paso ${n}: el río pasa por debajo del puente`, [Math.round(bajo[0]), Math.round(bx)]]);
      const d2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
      const dueno = x.matas.map(m => x.casas.reduce((q, c) => d2(c.c, m) < d2(q.c, m) ? c : q));
      const conMata = new Set(dueno.map(c => c.n));
      r.push([x.matas.length === conMata.size && x.matas.every((m, i) => d2(dueno[i].c, m) < 34), `paso ${n}: cada mata de mango está al lado de una casa, y ninguna casa tiene dos`, [x.matas.length, conMata.size]]);
      const lado = c => c.c[0] > bx;
      const candidatas = x.casas.filter(c => conMata.has(c.n) && lado(c)).sort((a, b) => a.c[0] - b.c[0]);
      const nely = x.casas.find(c => c.nely);
      r.push([candidatas.length === 3 && !!nely && candidatas.includes(nely), `paso ${n}: pasando el puente hay tres casas con mata de mango, y una es la de doña Nely`, candidatas.map(c => c.n)]);
      r.push([x.casas.some(c => conMata.has(c.n) && !lado(c)), `paso ${n}: antes del puente también hay una casa con mata: la seña la deja fuera`, x.casas.filter(c => conMata.has(c.n) && !lado(c)).map(c => c.n)]);
      const deCasa = mk => x.casas.reduce((q, c) => d2(c.c, mk.c) < d2(q.c, mk.c) ? c : q);
      const marcas = t => x.marcas.filter(m => m.tipo === t);
      const sobre = t => marcas(t).map(m => deCasa(m).n).sort((a, b) => a - b);
      const ids = l => l.map(c => c.n).sort((a, b) => a - b);
      const amb = x.ambulancia.c;
      r.push([x.ambulancia.ve && cerca(amb[1], by, 3), `paso ${n}: la ambulancia va por el camino`, amb.map(Math.round)]);

      if (n === 0) {
        r.push([JSON.stringify(sobre('duda')) === JSON.stringify(ids(candidatas)) && marcas('no').length === 0 && marcas('si').length === 0,
          'paso 0: un «?» sobre cada casa de la seña, y ninguna ✗ ni ✓', [sobre('duda'), ids(candidatas)]]);
        r.push([marcas('duda').every(m => m.raya > 0 && m.raya <= 3), 'paso 0: la duda va con el aro de raya cortada', marcas('duda').map(m => m.raya)]);
        r.push([amb[0] < bx, 'paso 0: la ambulancia espera a la entrada, antes del puente', Math.round(amb[0])]);
        r.push([nb(e.cifra) === String(candidatas.length) && nb(e.palabras) === 'casas con esa seña' && /\btres\b/.test(nb(e.texto)),
          `paso 0: el marcador y la frase cuentan las casas de la seña (${candidatas.length})`, [e.cifra, e.palabras]]);
      } else {
        const noEs = n === 1 ? ids(candidatas.filter(c => c !== nely)) : [];
        r.push([JSON.stringify(sobre('no')) === JSON.stringify(noEs) && JSON.stringify(sobre('si')) === JSON.stringify([nely.n]) && marcas('duda').length === 0,
          `paso ${n}: ${n === 1 ? 'una ✗ en las otras dos casas de la seña y la ✓ en la de doña Nely' : 'solo la ✓ en la casa de doña Nely'}`, [sobre('no'), sobre('si')]]);
        r.push([marcas('no').every(m => m.rayas === 2) && marcas('si').every(m => m.rayas === 1), `paso ${n}: la ✗ son dos rayas y la ✓ una: no se distinguen solo por el color`,
          x.marcas.map(m => [m.tipo, m.rayas])]);
        r.push([cerca(amb[0], nely.c[0], 2), `paso ${n}: la ambulancia acaba frente a la casa de doña Nely`, [Math.round(amb[0]), Math.round(nely.c[0])]]);
        if (n === 1) r.push([nely === candidatas[candidatas.length - 1], 'paso 1: la de doña Nely es la tercera que encuentra por el camino', ids(candidatas)]);
        r.push([nb(e.cifra) === (n === 1 ? '40' : '0') && nb(e.palabras) === 'minutos preguntando' && (n !== 1 || /cuarenta minutos/.test(nb(e.texto))),
          `paso ${n}: el marcador dice ${n === 1 ? 'los cuarenta minutos de la historia' : 'que no hubo que preguntar'}`, [e.cifra, e.palabras]]);
      }

      /* ── Las dos líneas de la casa de doña Nely, en el 6. ── */
      if (n === 6) {
        const lat = x.lineasCasa.find(l => l.de === 'lat'), lon = x.lineasCasa.find(l => l.de === 'lon');
        const horiz = !!lat && cerca(lat.v[0][1], lat.v[1][1], 0.2) && cerca(lat.v[0][1], nely.c[1], 1) && Math.min(lat.v[0][0], lat.v[1][0]) <= 10 && Math.max(lat.v[0][0], lat.v[1][0]) >= 294;
        const vert = !!lon && cerca(lon.v[0][0], lon.v[1][0], 0.2) && cerca(lon.v[0][0], nely.c[0], 1) && Math.min(lon.v[0][1], lon.v[1][1]) <= 10 && Math.max(lon.v[0][1], lon.v[1][1]) >= 180;
        r.push([horiz && vert && lat.corrido <= 0.5 && lon.corrido <= 0.5, 'paso 6: por la casa de doña Nely pasa una línea acostada y otra de arriba abajo, de borde a borde', x.lineasCasa.map(l => [l.de, l.v.map(p => p.map(Math.round))])]);
        if (horiz && vert) {
          const yl = lat.v[0][1], xl = lon.v[0][0];
          const enLat = x.casas.filter(c => c.cuerpo.y0 <= yl && c.cuerpo.y1 >= yl), enLon = x.casas.filter(c => c.cuerpo.x0 <= xl && c.cuerpo.x1 >= xl);
          const enLasDos = enLat.filter(c => enLon.includes(c));
          r.push([enLat.length >= 2 && enLon.length >= 2, 'paso 6: cada línea sola toca también otras casas: un número no alcanza', [ids(enLat), ids(enLon)]]);
          r.push([enLasDos.length === 1 && enLasDos[0] === nely, 'paso 6: en las dos líneas solo está la casa de doña Nely', ids(enLasDos)]);
          const rl = x.rotulosCasa.find(t => t.de === 'lat'), ro = x.rotulosCasa.find(t => t.de === 'lon');
          r.push([!!rl && nb(rl.dice) === 'latitud' && rl.tinta.y1 <= yl && rl.tinta.y1 >= yl - 7 && !!ro && nb(ro.dice) === 'longitud' && ro.tinta.x1 <= xl && ro.tinta.x1 >= xl - 8,
            'paso 6: la acostada dice «latitud» y la de arriba abajo «longitud», cada rótulo pegado a su línea', x.rotulosCasa.map(t => t.dice)]);
        }
        const aro = x.aroCasa;
        r.push([!!aro && d2(aro.c, nely.c) <= aro.r - 8 && x.casas.every(c => c === nely || d2(aro.c, c.c) > aro.r),
          'paso 6: el aro rodea la casa de doña Nely y ninguna otra', aro && [aro.c.map(Math.round), aro.r]]);
      } else {
        r.push([x.lineasCasa.length === 0 && x.rotulosCasa.length === 0 && !x.aroCasa, `paso ${n}: todavía sin las líneas de la casa`, x.lineasCasa.length]);
      }
      return r;
    }

    /* ════════ El mapa ════════ */
    const m = x.mapa, K = (m.x1 - m.x0) / 360;
    r.push([Math.abs((m.y1 - m.y0) / 180 - K) < 0.01, `paso ${n}: el mapa mide lo mismo por grado a lo ancho que a lo alto`, [Math.round(K * 1000) / 1000, Math.round((m.y1 - m.y0) / 180 * 1000) / 1000]]);
    const yLat = lat => m.y0 + (90 - lat) * K, xLon = lon => m.x0 + (lon + 180) * K;
    r.push([x.mallaLat.length === 11 && x.mallaLat.every(l => l.lat % 15 === 0 && cerca(l.y, yLat(l.lat), 0.3)) &&
      x.mallaLon.length === 23 && x.mallaLon.every(l => l.lon % 15 === 0 && cerca(l.x, xLon(l.lon), 0.3)),
      `paso ${n}: la malla va de 15° en 15°, cada línea en su sitio`, [x.mallaLat.length, x.mallaLon.length]]);
    const medio = x.refs.find(q => q.de === 'medio'), partida = x.refs.find(q => q.de === 'partida');
    const yM = medio.v[0][1], xP = partida.v[0][0];
    r.push([cerca(yM, yLat(0), 0.3) && cerca(medio.v[1][1], yM, 0.1) && cerca(xP, xLon(0), 0.3) && cerca(partida.v[1][0], xP, 0.1),
      `paso ${n}: la línea del medio parte el mapa a lo alto, y la de partida es la del 0 de la malla`, [Math.round(yM), Math.round(xP)]]);
    const conPartida = n >= 3;
    r.push([medio.corrido <= 0.5 && (conPartida ? partida.corrido <= 0.5 : partida.corrido > 1),
      `paso ${n}: ${conPartida ? 'las dos líneas de referencia trazadas' : 'solo la línea del medio: la de partida todavía no'}`, [medio.corrido, partida.corrido]]);
    const rr = x.refRotulos.map(q => q.de + ':' + nb(q.dice)).sort();
    r.push([JSON.stringify(rr) === JSON.stringify(conPartida ? ['medio:línea del medio', 'partida:línea de partida'] : ['medio:línea del medio']),
      `paso ${n}: cada línea de referencia con su nombre`, rr]);

    /* ── El punto: sus dos números, leídos en la punta de la chincheta. ── */
    const [px, py] = x.pin.punta;
    const lat = Math.round((yM - py) / K * 10) / 10, lon = Math.round((px - xP) / K * 10) / 10;
    const aLat = Math.abs(lat), aLon = Math.abs(lon), letLat = lat > 0 ? 'N' : 'S', letLon = lon < 0 ? 'O' : 'E';
    const lectura = `${aLat}° ${letLat}, ${aLon}° ${letLon}`;
    r.push([x.pin.ve && lat % 15 === 0 && lon % 15 === 0 && lat !== 0 && lon !== 0, `paso ${n}: el punto está en un cruce de la malla, y se puede contar`, [lat, lon]]);
    r.push([x.pin.tierra && !x.pin.agua, `paso ${n}: el punto cae en tierra`, [lat, lon]]);
    r.push([!(lat >= 12.9 && lat <= 16.6 && lon >= -89.5 && lon <= -83), `paso ${n}: el punto NO es Honduras (la prueba pregunta dónde está)`, [lat, lon]]);

    /* ── Las flechas que cuentan: de la línea de referencia a la punta, con
       la punta de la flecha en el punto. ── */
    const fl = nombre => x.flechas.find(f => f.de === nombre);
    const flecha = (f, ini, fin) => !!f && cerca(f.ini[0], ini[0], 0.6) && cerca(f.ini[1], ini[1], 0.6) && Math.hypot(f.fin[0] - fin[0], f.fin[1] - fin[1]) <= 4.5 &&
      cerca(f.punta[0], fin[0], 0.6) && cerca(f.punta[1], fin[1], 0.6);
    const entera = f => !!f && f.corrido <= 0.5 && (f.raya === 0 || f.raya >= f.largo - 0.5);
    const cortada = f => !!f && f.raya > 0 && f.raya <= 4;
    const num = nombre => x.numeros.find(q => q.de === nombre), letra = nombre => x.letras.find(q => q.de === nombre);
    const conLat = n >= 2 && n <= 4, conLon = n >= 3 && n <= 4, espejo = n === 4;
    if (conLat) {
      r.push([flecha(fl('lat'), [px, yM], [px, py]) && entera(fl('lat')), `paso ${n}: la flecha del primer número va de la línea del medio al punto`, fl('lat') && [fl('lat').ini, fl('lat').fin].map(p => p.map(Math.round))]);
      const t = num('lat');
      r.push([!!t && nb(t.dice) === aLat + '°' && t.tinta.x1 < px - 2 && t.tinta.y0 >= py - 1 && t.tinta.y1 <= yM + 1, `paso ${n}: al lado de su flecha dice ${aLat}°`, t && t.dice]);
    }
    if (conLon) {
      r.push([flecha(fl('lon'), [xP, py], [px, py]) && entera(fl('lon')), `paso ${n}: la flecha del segundo número va de la línea de partida al punto`, fl('lon') && [fl('lon').ini, fl('lon').fin].map(p => p.map(Math.round))]);
      const t = num('lon');
      r.push([!!t && nb(t.dice) === aLon + '°' && t.tinta.y1 <= py && t.tinta.x0 >= Math.min(px, xP) && t.tinta.x1 <= Math.max(px, xP), `paso ${n}: encima de su flecha dice ${aLon}°`, t && t.dice]);
    }
    const vivas = x.flechas.map(f => f.de).sort();
    const esperadas = [].concat(conLat ? ['lat'] : [], conLon ? ['lon'] : [], espejo ? ['lat-espejo', 'lon-espejo'] : []).sort();
    r.push([JSON.stringify(vivas) === JSON.stringify(esperadas), `paso ${n}: las flechas que tocan, y ninguna más`, vivas]);

    /* ── El número sin letra: del otro lado, con raya cortada y sin letra. La
       letra va pegada al número de verdad. ── */
    if (espejo) {
      const le = fl('lat-espejo'), lo = fl('lon-espejo');
      r.push([flecha(le, [px, yM], [px, yM + (yM - py)]) && cortada(le), `paso 4: hacia el otro lado también hay ${aLat}°, con raya cortada`, le && le.fin.map(Math.round)]);
      r.push([flecha(lo, [xP, py], [xP + (xP - px), py]) && cortada(lo), `paso 4: y del otro lado también hay ${aLon}°, con raya cortada`, lo && lo.fin.map(Math.round)]);
      const te = num('lat-espejo'), toe = num('lon-espejo');
      r.push([!!te && nb(te.dice) === aLat + '°' && !!toe && nb(toe.dice) === aLon + '°', 'paso 4: los números del otro lado dicen lo mismo, sin letra', [te && te.dice, toe && toe.dice]]);
      const pegada = (l, t) => !!l && !!t && cerca(l.tinta.base, t.tinta.base, 0.3) && l.tinta.x0 - t.tinta.x1 >= 1 && l.tinta.x0 - t.tinta.x1 <= 4.5;
      r.push([!!letra('lat') && nb(letra('lat').dice) === letLat && pegada(letra('lat'), num('lat')), `paso 4: el primer número lleva la ${letLat}, pegada a él`, letra('lat') && letra('lat').dice]);
      r.push([!!letra('lon') && nb(letra('lon').dice) === letLon && pegada(letra('lon'), num('lon')), `paso 4: el segundo lleva la ${letLon}, pegada a él`, letra('lon') && letra('lon').dice]);
      r.push([x.letras.length === 2, 'paso 4: los números del otro lado no llevan letra', x.letras.map(q => q.de)]);
    } else {
      r.push([x.letras.length === 0 && !x.numeros.some(q => /espejo/.test(q.de)), `paso ${n}: sin letras ni números del otro lado`, x.letras.map(q => q.de)]);
    }

    /* ── En el 5, cada número es su línea entera, y se cruzan en el punto. ── */
    if (n === 5) {
      const el = x.enteras.find(q => q.de === 'lat'), eo = x.enteras.find(q => q.de === 'lon');
      r.push([!!el && cerca(el.v[0][1], py, 0.3) && cerca(el.v[1][1], py, 0.3) && cerca(Math.min(el.v[0][0], el.v[1][0]), m.x0, 1) && cerca(Math.max(el.v[0][0], el.v[1][0]), m.x1, 1) && el.corrido <= 0.5,
        `paso 5: ${aLat}° ${letLat} solo es una línea acostada entera, de un borde al otro`, el && el.v.map(p => p.map(Math.round))]);
      r.push([!!eo && cerca(eo.v[0][0], px, 0.3) && cerca(eo.v[1][0], px, 0.3) && cerca(Math.min(eo.v[0][1], eo.v[1][1]), m.y0, 1) && cerca(Math.max(eo.v[0][1], eo.v[1][1]), m.y1, 1) && eo.corrido <= 0.5,
        `paso 5: ${aLon}° ${letLon} solo es una línea de arriba abajo entera`, eo && eo.v.map(p => p.map(Math.round))]);
      r.push([!!x.aro && Math.hypot(x.aro.c[0] - px, x.aro.c[1] - py) <= 0.6 && x.aro.r >= 5, 'paso 5: el aro rodea el cruce de las dos, que es el punto', x.aro && x.aro.c.map(Math.round)]);
      r.push([nb(x.lectura) === lectura, `paso 5: la lectura del punto dice ${lectura}`, x.lectura]);
    } else {
      r.push([x.enteras.length === 0 && !x.aro && x.lectura === null, `paso ${n}: todavía sin las líneas enteras`, x.enteras.map(q => q.de)]);
    }

    /* ── El marcador, y los números de la frase. ── */
    const MARCA = { 2: [aLat + '°', 'la latitud'], 3: [aLon + '°', 'la longitud'], 4: [lectura, 'cada número con su letra'], 5: ['1', 'punto con esos dos números'] }[n];
    r.push([nb(e.cifra) === MARCA[0] && nb(e.palabras) === MARCA[1], `paso ${n}: el marcador dice ${MARCA[0]} (${MARCA[1]})`, [e.cifra, e.palabras]]);
    const enFrase = (nb(e.texto).match(/\d+/g) || []).map(Number);
    r.push([enFrase.every(k => k === aLat || k === aLon), `paso ${n}: cada número de la frase es uno de los dos del punto`, enFrase]);
    if (n === 4) r.push([nb(e.texto).includes(lectura), `paso 4: la frase lee el punto con sus letras: ${lectura}`, e.texto]);
    return r;
  },
  /* El Adjetivo Avanzado: el acta de las dos comas. Se lee el acta pedazo
     por pedazo, como se escribe, y se comprueba que sus palabras sean las
     mismas en los seis pasos: lo único que entra y sale son las dos comas.
     ⚠️ De quiénes habla el acta no se le cree a la escena: la sonda saca del
     acta que ve si lleva las comas, y de ahí a quiénes nombra (a los 35, o
     solo a los de la ✗, que cuenta ella leyendo las notas). Con eso compara
     los aros, los sobres (a los que el acta nombra y aprobaron), el
     subrayado (lo que nombra al grupo con raya entera; lo que va aparte
     entre comas, con raya cortada), la etiqueta con su raya y su hilo, la
     leyenda y el marcador. Y cada número de la frase es uno de los que se
     cuentan en el dibujo. ⚠️ Y la prueba no se regala: ninguna otra clase de
     adjetivo ni función, ni una palabra de las respuestas, ni la definición
     del pareado tal cual. */
  amActa(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/\u00a0/g, ' ').trim();
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['calificativo', 'calificativa', 'calificativos', 'relacional', 'relacionales', 'adverbial', 'adverbiales',
      'adyacente', 'atributo', 'predicativo', 'predicativa', 'elativo', 'elativos', 'apócope', 'epíteto', 'epítetos', 'supletiva',
      'supletivo', 'determinativo', 'determinativos', 'cuantificador', 'cuantificadores', 'superlativo', 'superlativos',
      'comparativo', 'sufijo', 'núcleo', 'concordancia', 'concuerda', 'buen', 'peor', 'hondureña', 'cansada', 'cansados',
      'mínimo', 'economía', 'sol', 'número', 'edad', 'luna', 'tren', 'paupérrimo', 'pobre', 'presunto', 'óptimo', 'diminuto',
      'grandérrimo', 'mayor', 'agua', 'electoral', 'libérrimo', 'sucios', 'abrigos', 'pésimo', 'gran', 'rey', 'contentos',
      'orgulloso', 'machete', 'nuevo', 'mango', 'mangos', 'maduros', 'aplicados', 'muy', 'nieve', 'blanca', 'alto', 'algunos',
      'varios', 'pocos'];
    const FRASES = ['de los demás', 'separa a', 'sin separar', 'todo el grupo', 'el más'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna otra clase ni función, ni una respuesta de la prueba, ni el pareado tal cual`, malas]);

    const dentroDe = (c, k, tol = 0.5) => c.x0 >= k.x0 - tol && c.x1 <= k.x1 + tol && c.y0 >= k.y0 - tol && c.y1 <= k.y1 + tol;
    const cortada = v => v > 0 && v < 8, entera = v => v === 0 || v > 20;
    const PALABRAS = ['Los alumnos', 'que reprobaron Matemáticas', 'repetirán el año.'];

    /* ── El acta, renglón por renglón y como se escribe: la coma pegada a la
       palabra de antes, un espacio entre palabras, y todo dentro de la hoja. ── */
    const renglones = [];
    x.acta.slice().sort((a, b) => a.base - b.base || a.x0 - b.x0).forEach(t => {
      const q = renglones.find(z => Math.abs(z.base - t.base) < 0.6);
      if (q) q.piezas.push(t); else renglones.push({ base: t.base, piezas: [t] });
    });
    let espacios = true;
    renglones.forEach(z => {
      z.piezas.sort((a, b) => a.x0 - b.x0);
      z.texto = z.piezas.map((p, i) => {
        if (!i) return nb(p.dice);
        /* Un espacio mide 3,25: un hueco de 6,3 es el de una coma que se fue
           y dejó su sitio, y así se lee «alumnos  que». */
        const g = p.x0 - z.piezas[i - 1].x1, pegada = nb(p.dice) === ',';
        if (pegada ? Math.abs(g) > 0.6 : (g < 2.5 || g > 4.5)) espacios = false;
        return (pegada ? '' : ' ') + nb(p.dice);
      }).join('');
    });
    const palabras = x.acta.filter(p => nb(p.dice) !== ',').sort((a, b) => a.base - b.base || a.x0 - b.x0).map(p => nb(p.dice));
    r.push([JSON.stringify(palabras) === JSON.stringify(PALABRAS), `paso ${n}: las palabras del acta son las de siempre: solo entran y salen las comas`, palabras]);
    const comas = x.acta.filter(p => nb(p.dice) === ',');
    const conComas = comas.length === 2;
    r.push([comas.length === 2 || comas.length === 0, `paso ${n}: el acta lleva las dos comas o ninguna`, comas.length]);
    r.push([conComas === !(n === 3 || n === 4), `paso ${n}: ${n === 3 || n === 4 ? 'el acta va sin las comas' : 'el acta lleva sus dos comas'}`, comas.length]);
    const ESPERA = [conComas ? 'Los alumnos, que reprobaron Matemáticas,' : 'Los alumnos que reprobaron Matemáticas', 'repetirán el año.'];
    const leidos = renglones.map(z => z.texto);
    r.push([JSON.stringify(leidos) === JSON.stringify(ESPERA) && espacios, `paso ${n}: el acta dice lo que dice, renglón por renglón y como se escribe`, leidos]);
    r.push([x.acta.every(p => dentroDe(p.tinta, x.papel, 0)), `paso ${n}: todo lo escrito cabe en la hoja`, x.acta.filter(p => !dentroDe(p.tinta, x.papel, 0)).map(p => p.dice)]);
    const sujeto = x.acta.find(p => nb(p.dice) === PALABRAS[0]), inciso = x.acta.find(p => nb(p.dice) === PALABRAS[1]);

    /* ── El aula: 35 alumnos, cada uno con su nota. La ✗ son dos rayas que
       se cruzan y la ✓ una sola: se distinguen sin distinguir colores. ── */
    const reprobo = x.alumnos.filter(a => a.nota === 'reprobo'), aprobo = x.alumnos.filter(a => a.nota === 'aprobo');
    r.push([x.alumnos.length === 35 && reprobo.length === 5 && aprobo.length === 30, `paso ${n}: en el aula hay 35 alumnos, 5 con la ✗ y 30 con la ✓`, [x.alumnos.length, reprobo.length, aprobo.length]]);
    r.push([x.alumnos.every(a => a.rayas === (a.nota === 'reprobo' ? 2 : 1)), `paso ${n}: la ✗ son dos rayas y la ✓ una: no se distinguen solo por el color`, x.alumnos.filter(a => a.rayas !== (a.nota === 'reprobo' ? 2 : 1)).map(a => a.n)]);

    /* ── De quiénes habla el acta, sacado de sus comas: con ellas, de los 35;
       sin ellas, solo de los que reprobaron. En el paso 0 todavía no se ha
       leído. ── */
    const nombra = n === 0 ? [] : (conComas ? x.alumnos : reprobo).map(a => a.n).sort((a, b) => a - b);
    const cerca = (a, c) => Math.hypot(c[0] - a.sitio[0], c[1] - (a.sitio[1] - 0.5)) <= 1.5;
    const ringed = x.aros.map(c => { const a = x.alumnos.find(q => cerca(q, c.centro)); return a ? a.n : -1; });
    const unicos = [...new Set(ringed)].sort((a, b) => a - b);
    r.push([ringed.every(v => v > 0) && unicos.length === ringed.length && JSON.stringify(unicos) === JSON.stringify(nombra),
      `paso ${n}: ${n === 0 ? 'todavía no hay aros: el acta no se ha leído' : 'un aro alrededor de cada alumno que nombra el acta ' + (conComas ? '(los 35)' : '(los de la ✗)') + ', y de ninguno más'}`,
      [ringed.length, unicos.length, nombra.length]]);
    r.push([x.aros.every(c => entera(c.raya)), `paso ${n}: los aros van con raya entera`, x.aros.map(c => c.raya).filter(v => !entera(v)).slice(0, 3)]);

    /* ── Los sobres: solo en el 2, uno por cada alumno que el acta nombra y
       que aprobó: a esas familias hubo que desmentirles el acta. ── */
    const conSobre = x.sobres.map(sb => {
      const cx = (sb.caja.x0 + sb.caja.x1) / 2, cy = (sb.caja.y0 + sb.caja.y1) / 2;
      const a = x.alumnos.find(q => cx > q.sitio[0] + 5 && cx < q.sitio[0] + 19 && cy > q.sitio[1] - 18 && cy < q.sitio[1] - 8);
      return a ? a.n : -1;
    });
    const citar = n === 2 ? aprobo.filter(a => nombra.includes(a.n)).map(a => a.n).sort((a, b) => a - b) : [];
    r.push([conSobre.every(v => v > 0) && JSON.stringify([...new Set(conSobre)].sort((a, b) => a - b)) === JSON.stringify(citar) && conSobre.length === citar.length,
      `paso ${n}: ${n === 2 ? 'un sobre por cada alumno que el acta nombra y que aprobó (' + citar.length + '), en su esquina' : 'sin sobres'}`, [conSobre.length, citar.length]]);

    /* ── El marcador. ── */
    if (n === 0) r.push([nb(e.cifra) === '¿?' && nb(e.palabras) === 'repiten el año, según el acta', 'paso 0: el marcador pregunta', [e.cifra, e.palabras]]);
    else if (n === 2) r.push([nb(e.cifra) === String(x.sobres.length) && nb(e.palabras) === 'familias citadas', `paso 2: el marcador cuenta los sobres (${x.sobres.length})`, [e.cifra, e.palabras]]);
    else r.push([nb(e.cifra) === String(x.aros.length) && nb(e.palabras) === 'repiten el año, según el acta', `paso ${n}: el marcador cuenta los aros: los que repiten según el acta (${x.aros.length})`, [e.cifra, e.palabras]]);

    /* ── Cada número de la frase es uno de los que se cuentan en el dibujo, y
       la oración se cita tal cual. ── */
    const cuentas = [x.alumnos.length, reprobo.length, aprobo.length, x.aros.length, x.sobres.length];
    const nums = (nb(e.texto).match(/\d+/g) || []).map(Number);
    r.push([nums.every(k => cuentas.includes(k)), `paso ${n}: cada número de la frase se cuenta en el dibujo`, [nums, cuentas]]);
    if (n === 1 || n === 3) r.push([nb(e.texto).includes('«' + PALABRAS[1] + '»'), `paso ${n}: la frase cita la oración del acta tal cual`, PALABRAS[1]]);

    /* ── Los subrayados: en el 0 ninguno. Con las comas, «Los alumnos» con
       raya entera y la oración de entre comas con raya cortada; sin ellas,
       todo el grupo con raya entera, de una punta a otra. ── */
    const cubre = (sb, desde, hasta) => !!desde && !!hasta && Math.abs(sb.caja.x0 - desde.x0) <= 1.6 && Math.abs(sb.caja.x1 - hasta.x1) <= 1.6 &&
      sb.caja.y0 >= desde.base && sb.caja.y1 <= desde.base + 8;
    const subs = x.subrayas;
    if (n === 0) r.push([subs.length === 0, 'paso 0: todavía no hay subrayados', subs.map(q => q.de)]);
    else if (conComas) {
      const ent = subs.filter(q => entera(q.raya)), cor = subs.filter(q => cortada(q.raya));
      r.push([subs.length === 2 && ent.length === 1 && cor.length === 1 && cubre(ent[0], sujeto, sujeto) && cubre(cor[0], inciso, inciso) && ent[0].corrido <= 0.5,
        `paso ${n}: «Los alumnos» subrayado con raya entera y la oración de entre comas con raya cortada`, subs.map(q => [q.de, Math.round(q.caja.x0), Math.round(q.caja.x1), q.raya])]);
    } else {
      r.push([subs.length === 1 && entera(subs[0].raya) && cubre(subs[0], sujeto, inciso) && subs[0].corrido <= 0.5,
        `paso ${n}: sin comas, todo el grupo subrayado de una punta a otra con raya entera`, subs.map(q => [q.de, Math.round(q.caja.x0), Math.round(q.caja.x1), q.raya])]);
    }

    /* ── Las marquitas de las comas: solo en el 0, una debajo de cada coma,
       pegada a ella y sin tocar las letras de al lado. ── */
    if (n === 0) {
      const bien = comas.length === 2 && x.marcas.length === 2 && comas.every(c => x.marcas.some(m => {
        const mx = (m.caja.x0 + m.caja.x1) / 2;
        return mx >= c.tinta.x0 - 1 && mx <= c.tinta.x1 + 1 && m.caja.y0 >= c.tinta.y1 && m.caja.y0 <= c.tinta.y1 + 4 &&
          x.acta.every(p => p === c || m.caja.x1 <= p.tinta.x0 || m.caja.x0 >= p.tinta.x1 || m.caja.y0 >= p.tinta.y1 || m.caja.y1 <= p.tinta.y0);
      }));
      r.push([bien, 'paso 0: una marquita debajo de cada coma, pegada a ella y sin tocar las letras', x.marcas.map(m => [Math.round(m.caja.x0), Math.round(m.caja.y0)])]);
    } else r.push([x.marcas.length === 0, `paso ${n}: sin marquitas`, x.marcas.length]);

    /* ── La etiqueta: restrictiva sin comas, explicativa con ellas, con la
       misma raya que el subrayado de la oración, y un hilo que baja de ese
       subrayado a la etiqueta. ── */
    if (n === 4 || n === 5) {
      const dice = conComas ? 'explicativa: describe' : 'restrictiva: delimita';
      const t = x.etiquetas, h = x.hilos;
      const sub = conComas ? subs.find(q => cortada(q.raya)) : subs.find(q => entera(q.raya));
      const bienHilo = t.length === 1 && h.length === 1 && !!sub && !!inciso &&
        Math.abs(h[0].ini[1] - (sub.caja.y0 + sub.caja.y1) / 2) <= 1.6 && h[0].ini[0] >= inciso.x0 && h[0].ini[0] <= inciso.x1 &&
        Math.abs(h[0].fin[1] - t[0].caja.y0) <= 1 && h[0].fin[0] > t[0].caja.x0 && h[0].fin[0] < t[0].caja.x1;
      r.push([t.length === 1 && nb(t[0].dice) === dice && (conComas ? cortada(t[0].raya) : entera(t[0].raya)) && dentroDe(t[0].caja, x.papel, 0),
        `paso ${n}: la etiqueta dice «${dice}», con la raya del subrayado de la oración`, t.map(q => [q.dice, q.raya])]);
      r.push([bienHilo, `paso ${n}: un hilo baja del subrayado de la oración a la etiqueta`, h.map(q => [q.ini.map(Math.round), q.fin.map(Math.round)])]);
      r.push([t.length === 1 && x.acta.every(p => t[0].caja.x1 <= p.tinta.x0 || t[0].caja.x0 >= p.tinta.x1 || t[0].caja.y1 <= p.tinta.y0 || t[0].caja.y0 >= p.tinta.y1),
        `paso ${n}: la etiqueta no tapa ninguna palabra del acta`, t.length]);
    } else r.push([x.etiquetas.length === 0 && x.hilos.length === 0, `paso ${n}: sin etiqueta`, x.etiquetas.map(q => q.dice)]);

    /* ── La leyenda: la ✗ y la ✓ siempre, cada una al lado de lo que quiere
       decir; el aro, mientras haya aros, y el sobre, mientras haya sobres. ── */
    const ley = x.leyenda.dice;
    const lr = ley.find(q => q.de === 'reprobo'), la = ley.find(q => q.de === 'aprobo');
    r.push([!!lr && !!la && nb(lr.dice) === 'reprobó Matemáticas' && lr.nota === 'reprobo' && nb(la.dice) === 'la aprobó' && la.nota === 'aprobo' && lr.lejos < 6 && la.lejos < 6,
      `paso ${n}: la leyenda dice qué es la ✗ y qué es la ✓, cada una al lado de su dibujo`, ley.map(q => [q.dice, q.nota, Math.round(q.lejos)])]);
    r.push([x.leyenda.aro === (x.aros.length > 0) && x.leyenda.sobre === (x.sobres.length > 0),
      `paso ${n}: la leyenda del aro y la del sobre están solo si hay aros y sobres`, [x.leyenda.aro, x.leyenda.sobre]]);
    return r;
  },
  /* Los Tipos de Textos: la carta de Kenia. Se lee la carta renglón por
     renglón, como se escribe, y se comprueba que los cuatro renglones de
     Kenia sean los mismos en los seis pasos: lo que cambia es lo que se le
     agrega. ⚠️ Lo que contesta el lector no se le cree a la escena: la
     sonda saca de la carta que ve quién la lee (por el saludo), qué
     renglones cuentan, cuáles piden y cuál da la razón, y de ahí qué
     preguntas del lector tienen respuesta. Con eso compara las etiquetas
     (raya cortada o entera y su ✓), los hilos de punta a punta, las llaves,
     el globo, el marcador y la cancha: el candado, la puerta y dónde están
     las niñas. Y en el 5, un aro alrededor de «Le pido» y de «porque», sin
     tocar las palabras de al lado. ⚠️ Y la prueba no se regala: ningún
     tipo de texto, ninguna pieza de los pareados, ni «convencer», que es
     la respuesta del anuncio. */
  amCarta(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/\u00a0/g, ' ').trim();
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['narrativo', 'narrativa', 'narrativos', 'descriptivo', 'descriptiva', 'expositivo', 'expositiva', 'informativo',
      'argumentativo', 'argumentativa', 'instructivo', 'instructiva', 'dialogado', 'dialogada', 'poético', 'poética', 'lírico',
      'literario', 'literaria', 'literarios', 'inicio', 'nudo', 'desenlace', 'narrador', 'personaje', 'personajes', 'tesis',
      'argumento', 'argumentos', 'propósito', 'conector', 'conectores', 'verso', 'versos', 'imperativo', 'adjetivo', 'adjetivos',
      'objetivo', 'objetiva', 'raya', 'ingredientes', 'pasado', 'enciclopedia', 'tercera', 'presente', 'título', 'recibo',
      'pulpería', 'opinión', 'convencer', 'convence', 'convenció', 'defiende'];
    const FRASES = ['para qué se escribe', 'que une', 'no literario'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w)).concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ningún tipo de texto, ni una pieza de los pareados, ni una respuesta de la prueba`, malas]);
    r.push([!x.barrido, `paso ${n}: el resaltador con que lee el director no se queda encendido`, x.barrido]);

    const dentroDe = (c, k, tol = 0.5) => c.x0 >= k.x0 - tol && c.x1 <= k.x1 + tol && c.y0 >= k.y0 - tol && c.y1 <= k.y1 + tol;
    const cruza = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
    const cortada = v => v > 0 && v < 8, entera = v => v === 0 || v > 20;
    const une = cs => cs.reduce((a, c) => ({ x0: Math.min(a.x0, c.x0), y0: Math.min(a.y0, c.y0), x1: Math.max(a.x1, c.x1), y1: Math.max(a.y1, c.y1) }),
      { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });

    /* ── La carta, renglón por renglón, como se escribe: el punto y la coma
       pegados a la palabra de antes, un espacio entre palabras, y todo
       dentro de la hoja. ── */
    const renglones = [];
    x.lineas.slice().sort((a, b) => a.base - b.base || a.x0 - b.x0).forEach(t => {
      const q = renglones.find(z => Math.abs(z.base - t.base) < 0.6);
      if (q) q.piezas.push(t); else renglones.push({ base: t.base, piezas: [t] });
    });
    let espacios = true;
    renglones.forEach(z => {
      z.piezas.sort((a, b) => a.x0 - b.x0);
      z.texto = z.piezas.map((p, i) => {
        if (!i) return nb(p.dice);
        const g = p.x0 - z.piezas[i - 1].x1, pegada = nb(p.dice) === '.' || nb(p.dice) === ',';
        if (pegada ? Math.abs(g) > 0.6 : (g < 2.5 || g > 7)) espacios = false;
        return (pegada ? '' : ' ') + nb(p.dice);
      }).join('');
      z.tinta = une(z.piezas.map(p => p.tinta));
    });
    const K = ['Jugar con mis compañeras', 'es lo más bonito del día.', 'Corremos, saltamos y nos', 'reímos. ¡Nadie se aburre!'];
    const ESPERA = [n === 2 ? 'Querida prima:' : 'Señor director:'].concat(K)
      .concat(n >= 3 ? ['Le pido que nos deje usar', 'la cancha en el recreo' + (n >= 4 ? ',' : '.')] : [])
      .concat(n >= 4 ? ['porque a esa hora está vacía.'] : []).concat(['Kenia']);
    const leidos = renglones.map(z => z.texto);
    r.push([JSON.stringify(leidos) === JSON.stringify(ESPERA) && espacios, `paso ${n}: la carta dice lo que tiene que decir, renglón por renglón y como se escribe`, leidos]);
    r.push([renglones.every(z => dentroDe(z.tinta, x.papel, 0)), `paso ${n}: todo lo escrito cabe en la hoja`, renglones.filter(z => !dentroDe(z.tinta, x.papel, 0)).map(z => z.texto)]);
    r.push([renglones.every((z, i) => !i || z.tinta.y0 >= renglones[i - 1].tinta.y1 - 0.5), `paso ${n}: ningún renglón se monta en el de arriba`, renglones.map(z => Math.round(z.base))]);
    const cuerpo = renglones.slice(1, -1), firma = renglones[renglones.length - 1];
    const x0s = cuerpo.map(z => z.piezas[0].x0).concat(renglones.length ? [renglones[0].piezas[0].x0] : []);
    r.push([x0s.length > 0 && Math.max(...x0s) - Math.min(...x0s) < 0.5, `paso ${n}: el saludo y los renglones empiezan todos en el mismo margen`, x0s.map(v => Math.round(v * 10) / 10)]);
    r.push([!!firma && firma.piezas[0].ancla === 'end' && firma.tinta.y0 > Math.max(...cuerpo.map(z => z.tinta.y1)) + 4,
      `paso ${n}: la firma va a la derecha, debajo del último renglón`, firma && firma.texto]);

    /* ── Lo que la carta tiene, sacado del texto que se ve: quién la lee
       (por el saludo), qué renglones cuentan, desde dónde pide y desde
       dónde da la razón. ── */
    const saludo = renglones.length ? renglones[0].texto : '';
    const lector = saludo === 'Querida prima:' ? 'prima' : (saludo === 'Señor director:' ? 'director' : null);
    const iP = cuerpo.findIndex(z => z.texto.split(' ').includes('pido'));
    const iR = cuerpo.findIndex(z => z.texto.startsWith('porque'));
    const partes = {
      cuenta: cuerpo.slice(0, iP >= 0 ? iP : cuerpo.length),
      pide: iP >= 0 ? cuerpo.slice(iP, iR >= 0 ? iR : cuerpo.length) : [],
      razon: iR >= 0 ? cuerpo.slice(iR) : []
    };
    const hay = { cuenta: partes.cuenta.length > 0, pide: partes.pide.length > 0, razon: partes.razon.length > 0 };
    const vistos = x.lectores.map(l => l.de);
    r.push([!!lector && JSON.stringify(vistos) === JSON.stringify([lector]), `paso ${n}: la lee quien dice el saludo (${lector})`, vistos]);

    /* ── Las preguntas del lector: sin respuesta, raya cortada; con
       respuesta en la carta, raya entera, su ✓ y un hilo hasta la llave de
       los renglones que la contestan. ── */
    const BUSCA = { director: [['¿Qué me pide?', 'pide'], ['¿Por qué?', 'razon']], prima: [['¿Cómo te va?', 'cuenta']] };
    const busca = n === 0 || !lector ? [] : BUSCA[lector];
    const pregs = x.preguntas.map(p => nb(p.dice));
    r.push([JSON.stringify(pregs.slice().sort()) === JSON.stringify(busca.map(b => b[0]).sort()),
      `paso ${n}: ${busca.length ? 'las preguntas son las de quien lee: ' + busca.map(b => b[0]).join(' ') : 'todavía nadie pregunta nada'}`, pregs]);
    let sinRespuesta = 0;
    busca.forEach(([dice, de]) => {
      const p = x.preguntas.find(q => nb(q.dice) === dice);
      if (!p) return;
      r.push([p.caja.x0 >= x.papel.x1, `paso ${n}: «${dice}» va fuera de la hoja, del lado del lector`, Math.round(p.caja.x0)]);
      if (!hay[de]) {
        sinRespuesta++;
        r.push([p.abierta && !p.hecha && !p.visto && cortada(p.rayaAbierta) && !x.hilos.some(h => h.de === de),
          `paso ${n}: «${dice}» no tiene respuesta en la carta: raya cortada, sin ✓ y sin hilo`, [p.abierta, p.hecha, p.visto, p.rayaAbierta]]);
        return;
      }
      const tinta = une(partes[de].map(z => z.tinta));
      const otros = cuerpo.filter(z => !partes[de].includes(z));
      const ll = x.llaves.find(q => q.de === de);
      const bienLlave = !!ll && ll.caja.y0 <= tinta.y0 + 0.5 && ll.caja.y1 >= tinta.y1 - 0.5 && ll.caja.x0 >= tinta.x1 - 0.2 &&
        dentroDe(ll.caja, x.papel, 0) && otros.every(z => z.tinta.y1 <= ll.caja.y0 + 0.5 || z.tinta.y0 >= ll.caja.y1 - 0.5);
      r.push([bienLlave, `paso ${n}: la llave de «${dice}» abarca justo los renglones que la contestan (${partes[de].length})`, ll && [Math.round(ll.caja.y0), Math.round(ll.caja.y1), Math.round(tinta.y0), Math.round(tinta.y1)]]);
      const h = x.hilos.find(q => q.de === de);
      const enPregunta = pt => Math.abs(pt[0] - p.caja.x0) <= 1.2 && pt[1] > p.caja.y0 && pt[1] < p.caja.y1;
      const enLlave = pt => !!ll && Math.abs(pt[0] - ll.caja.x1) <= 1.2 && pt[1] >= ll.caja.y0 - 0.5 && pt[1] <= ll.caja.y1 + 0.5;
      r.push([!!h && h.corrido <= 0.5 && ((enPregunta(h.ini) && enLlave(h.fin)) || (enPregunta(h.fin) && enLlave(h.ini))),
        `paso ${n}: el hilo de «${dice}» va de la pregunta a su llave, dibujado entero`, h && [h.ini.map(Math.round), h.fin.map(Math.round), h.corrido]]);
      r.push([p.hecha && p.visto && !p.abierta && entera(p.rayaHecha), `paso ${n}: «${dice}» tiene respuesta: raya entera y su ✓`, [p.abierta, p.hecha, p.visto]]);
    });
    const contestadas = busca.filter(b => hay[b[1]]).map(b => b[1]);
    r.push([x.hilos.length === contestadas.length && x.llaves.length === contestadas.length,
      `paso ${n}: un hilo y una llave por cada pregunta contestada (${contestadas.length}), y ninguno más`, [x.hilos.map(h => h.de), x.llaves.map(l => l.de)]]);

    /* ── El marcador: las preguntas sin respuesta, y en el 5 las pistas. ── */
    if (n === 0) r.push([nb(e.cifra) === '¿?', 'paso 0: el marcador pregunta', e.cifra]);
    else if (n === 5) r.push([nb(e.cifra) === String(x.aros.length) && nb(e.palabras) === 'pistas de la carta que pide', 'paso 5: el marcador cuenta los aros: las pistas', [e.cifra, x.aros.length]]);
    else r.push([nb(e.cifra) === String(sinRespuesta) && nb(e.palabras) === (sinRespuesta === 1 ? 'pregunta sin respuesta' : 'preguntas sin respuesta'),
      `paso ${n}: el marcador dice ${sinRespuesta}, las preguntas de quien lee que la carta no contesta`, [e.cifra, e.palabras]]);

    /* ── Lo que dice el lector, sacado de lo que la carta contesta. ── */
    const DICE = lector === 'prima' ? '¡Qué bonito!' : (hay.pide && hay.razon ? '¡Sí! Úsenla desde el lunes.' : (hay.pide ? '¿Y por qué?' : '¡Qué bonito!'));
    if (n === 0) r.push([x.dice.length === 0, 'paso 0: el director todavía no la ha leído, y no dice nada', x.dice.map(d => d.texto)]);
    else {
      const d = x.dice, fig = x.lectores[0];
      r.push([d.length === 1 && nb(d[0].texto) === DICE && d[0].de === lector && !!fig && d[0].globo.y1 <= fig.caja.y0 + 1 &&
        (d[0].globo.x0 + d[0].globo.x1) / 2 > fig.caja.x0 && (d[0].globo.x0 + d[0].globo.x1) / 2 < fig.caja.x1,
        `paso ${n}: ${lector === 'prima' ? 'la prima' : 'el director'} dice «${DICE}», en un globo encima de su cabeza`, d.map(z => [z.de, z.texto])]);
    }
    /* Lo que se cita en la frase es lo que dice la carta, letra por letra. */
    const sinPunto = zs => zs.map(z => z.texto).join(' ').replace(/[.,]$/, '');
    if (n === 3) r.push([nb(e.texto).includes('«' + sinPunto(partes.pide) + '»'), 'paso 3: la frase cita lo que pide la carta, tal cual', sinPunto(partes.pide)]);
    if (n === 4) r.push([nb(e.texto).includes('«' + sinPunto(partes.razon) + '»'), 'paso 4: la frase cita la razón de la carta, tal cual', sinPunto(partes.razon)]);

    /* ── La cancha: abierta solo si la carta es al director y le contesta
       las dos preguntas. Cerrada: candado con el gancho puesto, puerta
       entera y las niñas afuera. Abierta: sin candado, la puerta girada y
       las niñas adentro, en el piso de la cancha y sin montarse. ── */
    const c = x.cancha, abierta = lector === 'director' && hay.pide && hay.razon;
    const anchoPuerta = c.puerta.x1 - c.puerta.x0;
    if (abierta) {
      const dentro = c.ninas.every(q => q.x0 >= c.cerca.x0 + 44 && q.x1 <= c.cerca.x1 && q.y1 >= c.piso.y0 && q.y1 <= c.piso.y1 + 1);
      const juntas = c.ninas.some((q, i) => c.ninas.some((w, j) => j > i && cruza(q, w)));
      r.push([!c.candado && anchoPuerta <= 10 && c.ninas.length === 3 && dentro && !juntas,
        `paso ${n}: la cancha se abre: sin candado, la puerta girada y las tres niñas adentro`, [c.candado, Math.round(anchoPuerta), c.ninas.map(q => Math.round(q.x0))]]);
    } else {
      r.push([c.candado && JSON.stringify(c.grilletes) === '["cerrado"]' && anchoPuerta >= 38 && c.ninas.length === 3 && c.ninas.every(q => q.x1 <= c.cerca.x0),
        `paso ${n}: la cancha sigue cerrada: con candado, la puerta entera y las niñas afuera`, [c.candado, c.grilletes, Math.round(anchoPuerta), c.ninas.map(q => Math.round(q.x1))]]);
    }

    /* ── 5 · Un aro de raya entera alrededor de «Le pido» y de «porque», sin
       tocar las palabras de al lado, y la leyenda. ── */
    if (n === 5) {
      const piezas = x.lineas;
      const bienAros = ['Le pido', 'porque'].every(w => {
        const a = x.aros.find(q => q.de === w), p = piezas.find(q => nb(q.dice) === w);
        return !!a && !!p && entera(a.raya) && dentroDe(p.tinta, a.caja, 0) && piezas.every(o => o === p || !cruza(o.tinta, a.caja));
      });
      r.push([x.aros.length === 2 && bienAros, 'paso 5: un aro de raya entera alrededor de «Le pido» y de «porque», sin tocar las palabras de al lado', x.aros.map(a => a.de)]);
      r.push([!!x.leyenda && nb(x.leyenda.dice) === 'las pistas' && entera(x.leyenda.aro) && x.leyenda.caja.x0 >= x.papel.x1,
        'paso 5: al lado de la hoja, el aro quiere decir «las pistas»', x.leyenda && x.leyenda.dice]);
    } else {
      r.push([x.aros.length === 0 && !x.leyenda, `paso ${n}: sin aros ni leyenda`, x.aros.length]);
    }
    return r;
  },
  /* Marcadores Textuales: la pizarra del maestro. Se lee la pizarra
     renglón por renglón, como se escribe, y se comprueba que las cuatro
     cosas del maestro sean las mismas en los seis pasos: solo cambian las
     junturas. ⚠️ Los trabajos de abajo no se le creen a la escena: la sonda
     saca de la pizarra que ve las lecturas que ese texto permite (si ya se
     sabe qué se subraya, y para qué es «en parejas») y las compara con las
     filas: el orden de sus tres cosas y cuáles caen dentro de la banda de
     las parejas. En el paso 1 solo se pregunta el orden, y las filas no
     llevan todavía ni banda ni banderitas. Mientras la pizarra deje más de
     una lectura, cada coma lleva su marca de raya cortada debajo; lo que se
     agrega va subrayado con raya entera; y en el 5 cada marcador lleva su
     aro, sin tocar a las palabras de al lado. ⚠️ Y la prueba no se regala:
     ninguna clase de marcador ni palabra de sus respuestas, ni «al final»
     ni «segundo», que son las de las dos preguntas que cambiaron. */
  amPizarra(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['pero', 'porque', 'también', 'además', 'antes', 'luego', 'mientras', 'asimismo', 'incluso', 'aunque', 'igualmente',
      'finalmente', 'tanto', 'segundo', 'ventana', 'causa', 'consecuencia', 'adición', 'contraste', 'ejemplo', 'tiempo', 'cierre', 'conclusión',
      'cohesión', 'coherencia', 'conector', 'conectores', 'párrafo', 'motivo', 'resultado', 'aclara', 'opone', 'concluye', 'pasos'];
    const RAICES = ['orden', 'organiz', 'suelt', 'ejemplific'];
    const FRASES = ['así que', 'no obstante', 'dado que', 'o sea', 'en resumen', 'por eso', 'sin embargo', 'a continuación', 'para terminar',
      'es decir', 'por consiguiente', 'por lo tanto', 'ya que', 'más tarde', 'al final', 'por último', 'en primer lugar', 'en cambio', 'por ejemplo'];
    const suelto = ' ' + dicho.split(/[^a-záéíóúñü]+/).filter(Boolean).join(' ') + ' ';
    const malas = suelto.trim().split(' ').filter(w => EXACTAS.includes(w) || RAICES.some(z => w.startsWith(z)))
      .concat(FRASES.filter(f => suelto.includes(' ' + f + ' ')));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna clase de marcador ni una palabra de las respuestas de la prueba`, malas]);

    const dentroDe = (c, k, tol = 0.5) => c.x0 >= k.x0 - tol && c.x1 <= k.x1 + tol && c.y0 >= k.y0 - tol && c.y1 <= k.y1 + tol;
    const cruza = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
    const cortada = v => v > 0 && v < 8, entera = v => v === 0 || v > 20;

    /* ── La pizarra, renglón por renglón, como se escribe: la coma y el
       punto pegados a la palabra de antes, y un espacio entre palabras. ── */
    const tz = x.tiza;
    const renglon = k => tz.filter(t => t.renglon === k).sort((a, b) => a.x0 - b.x0);
    const pegada = t => nb(t.dice) === ',' || nb(t.dice) === '.';
    const leerR = ws => ws.map((w, i) => (i && !pegada(w) ? ' ' : '') + nb(w.dice)).join('');
    const bienR = ws => ws.every((w, i) => {
      if (!i) return true;
      const g = w.x0 - ws[i - 1].x1;
      return pegada(w) ? Math.abs(g) <= 0.6 : g > 3 && g < 7;
    }) && ws.every(w => Math.abs(w.base - ws[0].base) < 0.5);
    const conPrimero = n >= 3, conDespues = n >= 4;
    const ESPERA = [
      (conPrimero ? 'Primero, leer el texto y subrayar' : 'leer el texto, subrayar') + (conDespues ? '.' : ','),
      (conDespues ? 'Después, ' : '') + 'copiar en el cuaderno,',
      'en parejas' + (conDespues ? '.' : '')
    ];
    const lineas = [1, 2, 3].map(k => renglon(k));
    lineas.forEach((ws, i) => {
      r.push([leerR(ws) === ESPERA[i] && bienR(ws) && ws.every(w => dentroDe(w.tinta, x.fondo, 0.5)),
        `paso ${n}: el renglón ${i + 1} dice «${ESPERA[i]}», como se escribe y dentro de la pizarra`, leerR(ws)]);
    });
    const deMaestro = lineas.flat().filter(t => t.rol === 'maestro').map(t => nb(t.dice));
    r.push([JSON.stringify(deMaestro) === JSON.stringify(['leer el texto', 'subrayar', 'copiar en el cuaderno', 'en parejas']),
      `paso ${n}: las cuatro cosas del maestro, las mismas y en su orden`, deMaestro]);
    const nuevasV = lineas.flat().filter(t => t.rol === 'nueva').map(t => nb(t.dice));
    const NUEVAS = conDespues ? ['Primero,', 'y', 'Después,'] : (conPrimero ? ['Primero,', 'y'] : []);
    r.push([JSON.stringify(nuevasV) === JSON.stringify(NUEVAS), `paso ${n}: lo que se agregó: ${NUEVAS.join(' ') || 'nada'}`, nuevasV]);

    /* ── Lo que la pizarra permite, sacado del texto que se ve: si ya se
       sabe que se subraya el texto (con «Primero» y la «y», o con
       «Después» delante de copiar) y si «en parejas» quedó en una oración
       donde solo se copia. ── */
    const texto = lineas.map(leerR).join(' ');
    const ordenFijo = texto.includes('Primero, leer el texto y subrayar') || texto.includes('Después, copiar');
    const conParejas = texto.split('.').find(o => o.includes('en parejas')) || '';
    const parejasFija = conParejas.includes('copiar') && !conParejas.includes('leer') && !conParejas.includes('subrayar');
    const ORDENES = ordenFijo ? ['leer subrayar copiar'] : ['leer copiar subrayar', 'leer subrayar copiar'];
    const MODOS = parejasFija ? ['copiar'] : ['', 'copiar,leer,subrayar'];
    const unica = ordenFijo && parejasFija;

    /* ── Los trabajos: el orden de sus tres cosas y lo que cae dentro de la
       banda de las parejas. ── */
    const filas = x.trabajos.map(t => {
      const acc = t.acciones.slice().sort((a, b) => a.caja.x0 - b.caja.x0);
      const orden = acc.map(a => nb(a.dice)).join(' ');
      const enPar = acc.filter(a => t.bandas.some(b => dentroDe(a.caja, b.caja, 0.5)));
      return { de: t.de, t, acc, orden, enPar, par: enPar.map(a => nb(a.dice)).sort().join(',') };
    });
    r.push([filas.every(f => f.acc.length === 3 && f.acc.every(a => dentroDe(a.caja, f.t.papel, 0.5)) && f.t.papel.y0 > x.fondo.y1) &&
      filas.every((f, i) => filas.every((g, j) => i === j || !cruza(f.t.papel, g.t.papel))),
      `paso ${n}: cada trabajo, sus tres cosas en su tira de papel, debajo de la pizarra y sin montarse en otro`, filas.map(f => f.orden)]);
    if (n === 0) {
      r.push([filas.length === 0 && e.cifra === '¿?', 'paso 0: todavía no hay trabajos, y el marcador pregunta', filas.length]);
    } else if (n === 1) {
      r.push([JSON.stringify(filas.map(f => f.orden).sort()) === JSON.stringify(ORDENES) && filas.every(f => !f.t.bandas.length && !f.t.banderas.length),
        'paso 1: un trabajo por cada orden que dejan las comas, todavía sin decir quién va en parejas', filas.map(f => f.orden)]);
    } else {
      const deben = [];
      ORDENES.forEach(o => MODOS.forEach(m => deben.push(o + ' | ' + m)));
      const hay = filas.map(f => f.orden + ' | ' + f.par).sort();
      r.push([JSON.stringify(hay) === JSON.stringify(deben.sort()), `paso ${n}: los trabajos son las lecturas que la pizarra permite: ${deben.length}`, hay]);
      /* Las banderitas: «solo» encima de lo que se hizo solo y «en parejas»
         encima de la banda, cada una sobre la primera cosa de lo suyo. */
      const bienBanderas = filas.every(f => {
        const solas = f.acc.filter(a => !f.enPar.includes(a));
        const deben = (solas.length ? ['solo'] : []).concat(f.enPar.length ? ['en parejas'] : []);
        const tiene = f.t.banderas.map(b => nb(b.dice));
        const sobre = (b, a) => !!a && b.caja.y1 < a.caja.y0 && a.caja.y0 - b.caja.y1 < 14 && a.caja.x0 - b.caja.x0 > -1 && a.caja.x0 - b.caja.x0 < 12;
        return JSON.stringify(tiene.slice().sort()) === JSON.stringify(deben.slice().sort()) &&
          f.t.banderas.every(b => sobre(b, nb(b.dice) === 'solo' ? solas[0] : f.enPar[0]));
      });
      r.push([bienBanderas, `paso ${n}: cada trabajo dice encima qué se hizo solo y qué en parejas`, filas.map(f => f.t.banderas.map(b => b.dice))]);
    }

    /* ── Las marcas de las comas: mientras la pizarra deje más de una
       lectura, una debajo de cada coma, de raya cortada. ── */
    const comas = tz.filter(t => nb(t.dice) === ',');
    if (!unica) {
      const bien = comas.length === x.marcas.length && comas.every(c => x.marcas.some(m => {
        const cx = (m.caja.x0 + m.caja.x1) / 2;
        return cx > c.x0 - 1.5 && cx < c.x1 + 1.5 && m.caja.y0 > c.base + 2 && m.caja.y0 < c.base + 8 && cortada(m.raya);
      }));
      r.push([bien, `paso ${n}: una marca de raya cortada debajo de cada coma (${comas.length})`, x.marcas.map(m => m.de)]);
    } else {
      r.push([x.marcas.length === 0, `paso ${n}: la pizarra ya se entiende de una manera, y ninguna coma lleva marca`, x.marcas.map(m => m.de)]);
    }

    /* ── Los subrayados: raya entera debajo de lo que se agregó (hasta el
       paso 4), y raya cortada debajo de «en parejas» mientras no se sabe
       para qué es. ── */
    const bajo = (rr, w) => Math.abs(rr.caja.x0 - w.x0) < 1.2 && Math.abs(rr.caja.x1 - w.x1) < 1.2 && rr.caja.y0 > w.base + 2 && rr.caja.y0 < w.base + 7;
    const nuevasT = tz.filter(t => t.rol === 'nueva');
    const parejasT = tz.find(t => nb(t.dice) === 'en parejas');
    const debenRayas = (n < 5 ? nuevasT.length : 0) + (n >= 2 && !parejasFija ? 1 : 0);
    const bienRayas = x.rayas.length === debenRayas &&
      (n < 5 ? nuevasT.every(w => x.rayas.some(rr => entera(rr.raya) && bajo(rr, w))) : true) &&
      (n >= 2 && !parejasFija ? x.rayas.some(rr => cortada(rr.raya) && !!parejasT && bajo(rr, parejasT)) : true);
    r.push([bienRayas, `paso ${n}: subrayado lo que se agregó (raya entera) y «en parejas» mientras está abierto (raya cortada)`, x.rayas.map(q => [q.de, q.raya])]);

    /* ── 5 · Un aro de raya entera alrededor de cada marcador, sin tocar las
       palabras de al lado, y la leyenda que dice qué son. ── */
    if (n === 5) {
      const bienAros = x.aros.length === nuevasT.length && nuevasT.every(w => x.aros.some(a => entera(a.raya) && dentroDe(w.tinta, a.caja, 0) &&
        tz.filter(t => t.renglon === w.renglon && t !== w).every(o => !cruza(o.tinta, a.caja))));
      r.push([bienAros, 'paso 5: un aro de raya entera alrededor de cada marcador, sin tocar las palabras de al lado', x.aros.map(a => a.de)]);
      r.push([!!x.leyenda && nb(x.leyenda.dice) === 'marcadores textuales' && entera(x.leyenda.aro) && x.leyenda.caja.y0 > x.fondo.y1,
        'paso 5: debajo de la pizarra, el aro quiere decir «marcadores textuales»', x.leyenda && x.leyenda.dice]);
    } else {
      r.push([x.aros.length === 0 && !x.leyenda, `paso ${n}: sin aros ni leyenda`, x.aros.length]);
    }

    /* ── El marcador y la frase, contra lo que se ve. ── */
    if (n >= 1 && n <= 4) {
      r.push([e.cifra === String(filas.length), `paso ${n}: el marcador cuenta los trabajos que se ven`, [e.cifra, filas.length]]);
    }
    if (n === 2) {
      r.push([nb(e.palabras).includes(ORDENES.length + ' × ' + MODOS.length) && ORDENES.length * MODOS.length === filas.length,
        'paso 2: el marcador multiplica las dos preguntas abiertas', e.palabras]);
    }
    const sinComa = w => w.replace(/,$/, '');
    const NUEVAS_DEL_PASO = { 3: ['Primero', 'y'], 4: ['Después'], 5: ['Primero', 'y', 'Después'] };
    if (NUEVAS_DEL_PASO[n]) {
      r.push([NUEVAS_DEL_PASO[n].every(w => e.texto.includes('«' + w + '»')), `paso ${n}: la frase nombra lo que se agregó`, NUEVAS_DEL_PASO[n]]);
    }
    if (n === 5) {
      r.push([e.cifra === String(x.aros.length) && x.aros.every(a => e.texto.includes('«' + sinComa(a.de) + '»')) && e.texto.includes('marcadores textuales'),
        'paso 5: el marcador cuenta los aros, y la frase los nombra como marcadores textuales', [e.cifra, x.aros.length]]);
    }
    return r;
  },
  /* La Acentuación: la rayita de doña Nely. Se lee el mensaje, que no
     cambia nunca, y cada lectura sobre el dibujo: sus tres sílabas, cuál
     subió y dónde está el dibujo de la voz. ⚠️ Dónde va la rayita no se le
     cree a la escena: la sonda la calcula con la regla (en estas tres
     palabras, que terminan en vocal, la voz en «bli» va sin rayita y en otra
     sílaba la lleva sobre su vocal) y la compara con la palabra escrita,
     letra por letra. ⚠️ Las lecturas van de izquierda a derecha en el orden
     en que la voz recorre la palabra, y la que aparece en cada paso es la
     que nombran la frase y el marcador. En el paso 1 las flechas del camino
     suman lo que dice el marcador; en el 4 cada hilo baja de la sílaba que
     sube a la rayita de su palabra; en el 5 la raya baja del mensaje a la
     lectura del maestro, enmarcada. ⚠️ Y la prueba no se regala: ninguna
     clase, ninguna posición (la última, la penúltima…), ninguna palabra de
     sus preguntas, ni «tilde» ni «diacrítica». */
  amRayita(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['aguda', 'agudas', 'llana', 'llanas', 'grave', 'graves', 'esdrújula', 'esdrújulas', 'sobresdrújula', 'sobresdrújulas',
      'tónica', 'tónicas', 'átona', 'átonas', 'diptongo', 'triptongo', 'hiato', 'diacrítica', 'tilde', 'tildes', 'distingue', 'fuerte', 'fuertes',
      'débil', 'débiles', 'última', 'penúltima', 'antepenúltima', 'café', 'azúcar', 'azucar', 'camioneta', 'teléfono', 'telefono', 'pared', 'sofá',
      'jardín', 'álbum', 'ventilador', 'baúl', 'cuéntaselo', 'árbol', 'camión', 'murciélago', 'difícil', 'raíz', 'rápidamente', 'estómago',
      'cómo', 'último', 'jóvenes', 'canción', 'lápiz', 'reloj', 'examen', 'brújula', 'música', 'fácilmente', 'maíz', 'comió', 'termino',
      'terminó', 'término', 'célebre', 'celebre', 'papá', 'papa', 'sé', 'tú', 'él', 'mí'];
    const malas = dicho.split(/[^a-záéíóúñü]+/).filter(w => w && EXACTAS.includes(w));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna clase, ninguna posición ni una palabra de la prueba`, malas]);

    const dentroDe = (c, k, tol = 0.5) => c.x0 >= k.x0 - tol && c.x1 <= k.x1 + tol && c.y0 >= k.y0 - tol && c.y1 <= k.y1 + tol;
    const medio = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const cortada = v => v > 0 && v < 8, entera = v => v === 0 || v > 20;
    const SIL = ['pu', 'bli', 'co'];
    const DICE = { 'público': 'la gente que mira', publico: 'yo lo hago', 'publicó': 'ya pasó' };
    const QUIEN = { 'público': 'otra palabra', publico: 'el maestro', 'publicó': 'doña Nely' };

    /* El mensaje del maestro: el mismo en los seis pasos, sin rayita. */
    const r1 = x.mensaje.filter(t => t.renglon === 1).sort((a, b) => a.caja.x0 - b.caja.x0), r2 = x.mensaje.filter(t => t.renglon === 2);
    /* La palabra de la historia es la segunda del renglón, diga lo que
       diga: si alguien le pone rayita, esto sale rojo y lo demás se sigue
       midiendo. */
    const pub = r1.length === 3 ? r1[1] : null;
    r.push([r1.map(t => nb(t.dice)).join(' ') === 'Mañana publico la lista' && r2.map(t => nb(t.dice)).join(' ') === 'de los que van.' &&
      x.mensaje.every(t => dentroDe(t.caja, x.globo, 1)) && r1.every(t => Math.abs(t.base[1] - r1[0].base[1]) < 0.5) && !!pub,
      `paso ${n}: el mensaje dice «Mañana publico la lista de los que van.», sin rayita, dentro de su globo`, r1.map(t => t.dice)]);
    if (!pub) return r;
    const sub = x.subs.length === 1 ? x.subs[0] : null;
    const bajoPub = !!sub && Math.abs(sub.caja.x0 - pub.caja.x0) < 1 && sub.caja.x1 <= pub.caja.x1 + 1 && sub.caja.x1 - sub.caja.x0 > 0.8 * (pub.caja.x1 - pub.caja.x0) &&
      sub.caja.y0 > pub.base[1] && sub.caja.y0 < pub.base[1] + 7;
    r.push([bajoPub && (n === 5 ? entera(sub.raya) : cortada(sub.raya)), `paso ${n}: «publico» subrayado con raya ${n === 5 ? 'entera: así se lee' : 'cortada: ¿cómo se lee?'}`,
      x.subs.map(q => [q.de, q.raya])]);

    /* Las sílabas de una lectura: pu, bli, co, en su orden y pegadas; como
       mucho una subida, y el dibujo de la voz encima de ella. */
    const bienFichas = fs => fs.length === 3 && fs.map(f => nb(f.dice)).join(' ') === SIL.join(' ') &&
      fs.every((f, i) => !i || (f.caja.x0 > fs[i - 1].caja.x1 && f.caja.x0 - fs[i - 1].caja.x1 < 6));
    const alto = fs => Math.max(...fs.map(f => f.caja.y0));

    /* 0 · Las tres sílabas, ninguna subida, y una pregunta encima de cada una. */
    if (n === 0) {
      const q = x.neutras;
      r.push([!!q && bienFichas(q.fichas) && q.fichas.every(f => Math.abs(f.caja.y0 - q.fichas[0].caja.y0) < 0.5 && !f.carga) &&
        q.dudas.length === 3 && q.dudas.every((d, i) => nb(d.dice) === '?' && Math.abs(medio(d.caja)[0] - medio(q.fichas[i].caja)[0]) <= 1 && d.caja.y1 < q.fichas[i].caja.y0),
        'paso 0: pu, bli y co, ninguna subida, con una pregunta encima de cada una', q && q.fichas.map(f => f.dice)]);
      r.push([x.lecturas.length === 0 && e.cifra === '¿?', 'paso 0: todavía no hay lecturas, y el marcador pregunta', x.lecturas.length]);
    } else {
      r.push([!x.neutras, `paso ${n}: las sílabas sin voz ya se fueron`, !!x.neutras]);
    }

    /* Cada lectura: la sílaba que sube, la voz encima, y la palabra escrita
       con la rayita donde la pone la regla. La regla la calcula la sonda: en
       estas tres palabras, que terminan en vocal, con la voz en «bli» no hay
       rayita; con la voz en otra, la rayita va en su vocal. */
    const VOCAL = { pu: 'u', bli: 'i', co: 'o' }, TILDE = { u: 'ú', o: 'ó', i: 'í' };
    const leidas = x.lecturas.map(l => {
      const sube = l.fichas.filter(f => f.caja.y0 < alto(l.fichas) - 3);
      const k = sube.length === 1 ? l.fichas.indexOf(sube[0]) : -1;
      let esperada = null;
      if (k >= 0) {
        const s = SIL[k];
        esperada = k === 1 ? 'publico' : SIL.map((q, i) => i === k ? q.replace(VOCAL[s], TILDE[VOCAL[s]]) : q).join('');
      }
      return Object.assign({}, l, { k, sube: sube[0], esperada });
    });
    leidas.forEach(l => {
      const f = l.sube;
      r.push([bienFichas(l.fichas) && l.k >= 0 && l.fichas.every(q => q.carga === (q === f)) && entera(f.raya) && Math.abs(medio(l.voz)[0] - medio(f.caja)[0]) <= 1 &&
        l.voz.y1 < f.caja.y0 && l.voz.y0 > x.globo.y1,
        `paso ${n}: en «${l.de}» sube una sola sílaba, con la voz encima`, l.fichas.map(q => q.dice + (q.caja.y0 < alto(l.fichas) - 3 ? '↑' : ''))]);
      r.push([!!l.esperada && nb(l.escrita) === l.esperada && Math.abs(medio(l.caja)[0] - medio(l.fichas[1].caja)[0]) <= 1 && l.caja.y0 > Math.max(...l.fichas.map(q => q.caja.y1)),
        `paso ${n}: debajo de sus sílabas se escribe «${l.esperada}»: la rayita donde la pone la regla`, [l.escrita, l.esperada]]);
      r.push([nb(l.dice) === DICE[nb(l.escrita)] && nb(l.quien) === QUIEN[nb(l.escrita)], `paso ${n}: «${l.escrita}» dice «${DICE[nb(l.escrita)]}»`, [l.dice, l.quien]]);
    });
    /* Cuáles se ven en cada paso, y en qué orden: de izquierda a derecha,
       por dónde carga la voz. */
    const DESDE = { 'publicó': 1, publico: 2, 'público': 3 };
    const deben = Object.keys(DESDE).filter(w => n >= DESDE[w]).sort();
    r.push([JSON.stringify(leidas.map(l => nb(l.escrita)).sort()) === JSON.stringify(deben) &&
      leidas.slice().sort((a, b) => a.caja.x0 - b.caja.x0).every((l, i, o) => !i || l.k > o[i - 1].k),
      `paso ${n}: ${deben.length} lectura(s), de izquierda a derecha por dónde carga la voz`, leidas.map(l => l.escrita)]);

    /* El camino: la casa a la izquierda, la escuela a la derecha, y doña
       Nely en su casa en todos los pasos. En el 1, la ida y la vuelta. */
    const casa = x.lugares.find(q => q.de === 'casa'), escuela = x.lugares.find(q => q.de === 'escuela');
    r.push([!!casa && !!escuela && !!x.nely && x.nely[0] > casa.caja.x0 - 5 && x.nely[0] < medio(casa.caja)[0] + 40,
      `paso ${n}: doña Nely está en su casa`, x.nely && x.nely.map(Math.round)]);
    if (n === 1) {
      const ida = x.flechas.find(q => q.hasta > q.desde), vuelta = x.flechas.find(q => q.hasta < q.desde);
      const va = q => !!q && !!casa && !!escuela && Math.min(q.desde, q.hasta) < medio(casa.caja)[0] + 50 && Math.max(q.desde, q.hasta) > medio(escuela.caja)[0] - 70;
      const suma = x.flechas.reduce((a, q) => a + (q.minutos || 0), 0);
      r.push([x.flechas.length === 2 && va(ida) && va(vuelta) && x.flechas.every(q => nb(q.dice).startsWith(q.minutos + ' min')),
        'paso 1: una flecha de ida y otra de vuelta entre la casa y la escuela, cada una con sus minutos', x.flechas.map(q => [q.de, q.dice])]);
      r.push([e.cifra === String(suma) && /minutos/.test(e.palabras), 'paso 1: el marcador suma los minutos de las flechas', [e.cifra, suma]]);
    } else {
      r.push([x.flechas.length === 0, `paso ${n}: sin flechas en el camino`, x.flechas.length]);
    }

    /* Lo que nombran la frase y el marcador, contra lo que apareció. */
    const nueva = leidas.find(l => DESDE[nb(l.escrita)] === n);
    if (n >= 1 && n <= 3) {
      r.push([!!nueva && e.texto.includes('«' + SIL[nueva.k] + '»') && e.texto.includes('«' + nb(nueva.escrita) + '»'),
        `paso ${n}: la frase nombra la sílaba que subió y la palabra que se escribe`, nueva && [SIL[nueva.k], nueva.escrita]]);
    }
    if (n === 2) r.push([!!nueva && e.cifra === SIL[nueva.k], 'paso 2: el marcador dice la sílaba que subió', [e.cifra, nueva && SIL[nueva.k]]]);
    if (n === 3) r.push([e.cifra === String(leidas.length), 'paso 3: el marcador cuenta las palabras que salieron de las mismas letras', e.cifra]);

    /* 4 · De la sílaba que sube baja un hilo hasta la rayita de su palabra,
       y solo en las que la llevan. */
    const conRaya = leidas.filter(l => /[áéíóú]/.test(nb(l.escrita)));
    if (n === 4) {
      const ok = x.hilos.length === conRaya.length && conRaya.every(l => {
        const h = x.hilos.find(q => q.de === nb(l.escrita)), le = l.letras.find(q => /[áéíóú]/.test(q.ch));
        return !!h && !!le && h.a[0] >= l.sube.caja.x0 && h.a[0] <= l.sube.caja.x1 && Math.abs(h.a[1] - l.sube.caja.y1) <= 3 &&
          h.b[0] >= le.x0 && h.b[0] <= le.x1 && h.b[1] < le.y0 + 1 && h.b[1] > le.y0 - 6;
      });
      r.push([ok, 'paso 4: de la sílaba que sube baja un hilo a la rayita de su palabra, y solo donde hay rayita', x.hilos.map(h => h.de)]);
      r.push([e.cifra === String(conRaya.length) && /rayitas/.test(e.palabras), 'paso 4: el marcador cuenta las rayitas que se ven', [e.cifra, conRaya.length]]);
    } else {
      r.push([x.hilos.length === 0, `paso ${n}: sin hilos a las rayitas`, x.hilos.length]);
    }

    /* 5 · Del mensaje baja una raya a la lectura sin rayita, que queda
       enmarcada: así se leía. */
    if (n === 5) {
      const sin = leidas.find(l => !/[áéíóú]/.test(nb(l.escrita))), m = x.marco;
      const dentro = !!sin && !!m && [sin.caja, sin.voz].concat(sin.fichas.map(f => f.caja)).every(c => dentroDe(c, m.caja, 0.5)) &&
        leidas.filter(l => l !== sin).every(l => l.fichas.every(f => f.caja.x1 < m.caja.x0 || f.caja.x0 > m.caja.x1));
      r.push([dentro && entera(m.raya) && m.de === 'publico', 'paso 5: la lectura sin rayita queda enmarcada, y ninguna otra', m && m.de]);
      const en = x.enlace;
      r.push([!!en && !!m && Math.abs(en.a[0] - pub.caja.x1) <= 1.5 && en.a[1] > pub.base[1] && en.a[1] < pub.base[1] + 8 &&
        Math.abs(en.b[1] - m.caja.y0) <= 1 && en.b[0] > m.caja.x0 && en.b[0] < m.caja.x1,
        'paso 5: del final de «publico» baja una raya al marco', en && [en.a.map(Math.round), en.b.map(Math.round)]]);
      r.push([e.cifra === '0' && e.texto.includes('«bli»'), 'paso 5: sin viaje de balde, y la frase dice dónde carga la voz', e.cifra]);
    } else {
      r.push([!x.marco && !x.enlace, `paso ${n}: sin marco ni raya del mensaje`, [!!x.marco, !!x.enlace]]);
    }
    return r;
  },
  /* Los Pronombres: el mensaje del grupo de las familias. Se lee el mensaje
     palabra por palabra y se mide sobre el dibujo adónde llega cada hilo:
     «le» se prueba en los CINCO niños (un hilo y un aro a cada uno, y cada
     uno a un niño distinto) y «lo» en las DOS cosas, y el marcador tiene que
     multiplicar lo que se ve. ⚠️ Lo que pasó en cada casa se lee del dibujo:
     encima de qué niño quedó cada cosa, y una duda sobre cada uno de los
     demás; y la frase tiene que nombrar a quien está debajo de cada cosa.
     ⚠️ Con la frase de antes, esa frase queda justo donde estaba el mensaje
     y el mensaje, un renglón más abajo; cada respuesta va debajo de su
     pronombre y dice palabras que están en la frase de antes; un hilo sube
     de cada pronombre a esas palabras; y el cuaderno queda encima del niño
     que se llama como dice la frase. Lo que queda abierto va con raya
     cortada y lo que ya se sabe, con raya entera. ⚠️ Y la prueba no se
     regala: ninguna clase de pronombre, ni «antecedente», ni una palabra de
     las respuestas de la prueba ni de la pregunta que cambió. */
  amMensaje(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/\u00a0/g, ' ').trim();
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ').toLowerCase();
    const EXACTAS = ['él', 'ella', 'ellas', 'ellos', 'usted', 'ustedes', 'nosotros', 'nadie', 'alguien', 'mío', 'mía', 'tuyo', 'tuya', 'suyo',
      'aquel', 'aquella', 'esa', 'cuánto', 'dámelo', 'búscala', 'llámame', 'pásamela', 'escríbeme', 'tráemelo', 'saludé', 'compró',
      'antecedente', 'personal', 'personales', 'determinante', 'voseo', 'vos', 'elvin', 'dania', 'gorra', 'prestó', 'marta', 'juan', 'sofía',
      'luisa', 'ana', 'abuelo', 'mangos', 'pan', 'tía'];
    const RAICES = ['tónic', 'átono', 'átona', 'proclític', 'enclític', 'demostrativ', 'posesiv', 'indefinid', 'relativ', 'interrogativ'];
    const malas = dicho.split(/[^a-záéíóúñü]+/).filter(w => w && (EXACTAS.includes(w) || RAICES.some(z => w.startsWith(z))));
    r.push([malas.length === 0, `paso ${n}: no sale ninguna clase de pronombre ni una palabra de la prueba`, malas]);

    const dentroDe = (c, k, tol = 0.5) => c.x0 >= k.x0 - tol && c.x1 <= k.x1 + tol && c.y0 >= k.y0 - tol && c.y1 <= k.y1 + tol;
    const cruza = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
    const medio = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const cortada = v => v > 0 && v < 8, entera = v => v === 0 || v > 20;
    const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    const aCaja = (p, k) => Math.hypot(Math.max(k.x0 - p[0], 0, p[0] - k.x1), Math.max(k.y0 - p[1], 0, p[1] - k.y1));
    const orden = ws => ws.slice().sort((a, b) => a.caja.x0 - b.caja.x0);
    const pegada = (a, b) => nb(b.dice) === '.' || (nb(a.dice) === 'Díga' && nb(b.dice) === 'le');
    const leer = ws => ws.map((w, i) => (i && !pegada(ws[i - 1], w) ? ' ' : '') + nb(w.dice)).join('');
    const bienPuestas = ws => ws.every((w, i) => {
      if (!i) return true;
      const g = w.caja.x0 - ws[i - 1].caja.x1;
      return pegada(ws[i - 1], w) ? Math.abs(g) <= 1 : g > 2 && g < 7;
    }) && ws.every(w => Math.abs(w.base[1] - ws[0].base[1]) < 0.5);

    /* El globo: de un renglón hasta el paso 3 y de dos desde el 4. */
    const dos = n >= 4;
    const globo = x.globos.length === 1 ? x.globos[0] : null;
    r.push([!!globo && globo.de === (dos ? 2 : 1), `paso ${n}: el globo es de ${dos ? 'dos renglones' : 'un renglón'}`, x.globos.map(g => g.de)]);
    if (!globo) return r;

    /* El mensaje, como se escribe: «Díga» y «le» pegadas, que son una sola
       palabra; un espacio entre las demás y el punto pegado. */
    const msg = orden(x.palabras.filter(w => w.renglon === 'mensaje'));
    r.push([leer(msg) === 'Dígale que lo lleve mañana.' && bienPuestas(msg) && msg.every(w => dentroDe(w.tinta, globo.caja)),
      `paso ${n}: el globo dice «Dígale que lo lleve mañana.», en un renglón y como se escribe`, leer(msg)]);
    const le = msg.find(w => nb(w.dice) === 'le'), lo = msg.find(w => nb(w.dice) === 'lo');
    if (!le || !lo) return r;
    const ctx = orden(x.palabras.filter(w => w.renglon === 'contexto'));
    if (n === 0) mensajePron = msg[0].base[1];
    if (dos) {
      r.push([leer(ctx) === 'Marvin olvidó el cuaderno.' && bienPuestas(ctx) && ctx.every(w => dentroDe(w.tinta, globo.caja)),
        `paso ${n}: en el mismo globo, antes del mensaje, dice «Marvin olvidó el cuaderno.»`, leer(ctx)]);
      /* La frase queda donde estaba el mensaje, y el mensaje, un renglón
         más abajo y empezando en el mismo sitio. */
      const altoC = ctx.length ? Math.max(...ctx.map(w => w.tinta.y1)) : 0, altoM = Math.min(...msg.map(w => w.tinta.y0));
      r.push([ctx.length > 0 && mensajePron != null && Math.abs(ctx[0].base[1] - mensajePron) < 0.5 && altoM > altoC + 4 &&
        msg[0].base[1] - ctx[0].base[1] < 40 && Math.abs(msg[0].caja.x0 - ctx[0].caja.x0) < 0.5,
        `paso ${n}: la frase quedó donde estaba el mensaje, y el mensaje un renglón más abajo`, ctx.length && [ctx[0].base[1], msg[0].base[1], mensajePron]]);
    } else {
      r.push([ctx.length === 0 && mensajePron != null && Math.abs(msg[0].base[1] - mensajePron) < 0.5,
        `paso ${n}: el mensaje va solo, en su renglón`, [ctx.length, msg[0].base[1]]]);
    }

    /* «le» y «lo» subrayados: con raya cortada mientras no dicen nada, con
       raya entera cuando ya dicen. Nada más va subrayado en el mensaje. */
    const bajo = (s, w) => !!s && !!w && s.caja.x0 >= w.caja.x0 - 0.5 && s.caja.x1 <= w.caja.x1 + 0.5 &&
      s.caja.x1 - s.caja.x0 >= 0.8 * (w.caja.x1 - w.caja.x0) && s.caja.y0 >= w.tinta.y1 - 0.5 && s.caja.y0 <= w.tinta.y1 + 6;
    const lineaDe = { le: dos ? x.subrayas.find(s => s.de === 'le') : x.huecos.find(s => s.de === 'le'),
                      lo: dos ? x.subrayas.find(s => s.de === 'lo') : x.huecos.find(s => s.de === 'lo') };
    r.push([x.huecos.length + x.subrayas.length === 2 && bajo(lineaDe.le, le) && bajo(lineaDe.lo, lo) &&
      (dos ? entera(lineaDe.le.raya) && entera(lineaDe.lo.raya) : cortada(lineaDe.le.raya) && cortada(lineaDe.lo.raya)),
      `paso ${n}: solo «le» y «lo» van subrayados, con raya ${dos ? 'entera: ya dicen' : 'cortada: todavía no dicen'}`,
      [x.huecos.map(h => h.de), x.subrayas.map(h => h.de)]]);

    /* 4 y 5 · En la frase de antes, «Marvin» y «el cuaderno» subrayados, y
       un hilo que sube de cada pronombre a la suya. */
    if (dos) {
      const pal = t => ctx.find(w => nb(w.dice) === t);
      const m = pal('Marvin'), el = pal('el'), cu = pal('cuaderno');
      const sM = x.subCtx.find(s => s.de === 'Marvin'), sC = x.subCtx.find(s => s.de === 'cuaderno');
      /* Hasta donde acaba la letra: la «o» de «cuaderno» se sale medio punto
         de su avance, y el subrayado llega hasta el avance. */
      const bajoDe = (s, a, b) => !!s && !!a && !!b && Math.abs(s.caja.x0 - a.caja.x0) < 1 && Math.abs(s.caja.x1 - b.caja.x1) < 1 &&
        s.caja.y0 >= a.tinta.y1 - 0.5 && s.caja.y0 <= a.tinta.y1 + 6 && entera(s.raya);
      r.push([x.subCtx.length === 2 && bajoDe(sM, m, m) && bajoDe(sC, el, cu), `paso ${n}: en la frase de antes van subrayados «Marvin» y «el cuaderno»`, x.subCtx.map(s => s.de)]);
      const sube = (a, w, s) => !!a && !!w && !!s && a.a[0] >= w.caja.x0 && a.a[0] <= w.caja.x1 && a.a[1] <= w.tinta.y0 + 1.5 && a.a[1] >= w.tinta.y0 - 3 &&
        a.b[0] >= s.caja.x0 && a.b[0] <= s.caja.x1 && a.b[1] >= s.caja.y0 && a.b[1] <= s.caja.y0 + 4;
      const aL = x.arcos.find(a => a.de === 'le'), aO = x.arcos.find(a => a.de === 'lo');
      r.push([x.arcos.length === 2 && sube(aL, le, sM) && sube(aO, lo, sC), `paso ${n}: un hilo sube de «le» a «Marvin» y otro de «lo» a «el cuaderno»`,
        x.arcos.map(a => [a.de, a.a.map(Math.round), a.b.map(Math.round)])]);
    } else {
      r.push([x.subCtx.length === 0 && x.arcos.length === 0, `paso ${n}: sin frase de antes, nada subrayado arriba ni hilos que suban`, [x.subCtx.length, x.arcos.length]]);
    }

    /* Las preguntas (1 a 3) y las respuestas (4): debajo de su pronombre,
       centradas, con su palito hasta el subrayado, y sin montarse. */
    const PREG = { le: '¿a quién?', lo: '¿qué?' }, RESP = { le: 'a Marvin', lo: 'el cuaderno' };
    const colgada = (q, w, s) => !!q && !!w && !!s && !!q.palito && Math.abs(medio(q.caja)[0] - medio(w.caja)[0]) <= 0.6 && q.caja.y0 > globo.caja.y1 - 0.5 &&
      Math.abs(q.palito.a[0] - medio(w.caja)[0]) <= 0.6 && q.palito.a[1] >= s.caja.y0 - 0.5 && q.palito.a[1] <= s.caja.y0 + 3 &&
      Math.abs(q.palito.b[0] - medio(w.caja)[0]) <= 0.6 && Math.abs(q.palito.b[1] - q.caja.y0) <= 0.6;
    const hayPreg = { le: n >= 1 && n <= 3, lo: n >= 2 && n <= 3 };
    ['le', 'lo'].forEach(p => {
      const w = p === 'le' ? le : lo, q = x.preguntas.find(t => t.de === p), a = x.respuestas.find(t => t.de === p);
      if (hayPreg[p]) {
        r.push([colgada(q, w, lineaDe[p]) && nb(q.dice) === PREG[p] && cortada(q.raya), `paso ${n}: debajo de «${p}» pregunta «${PREG[p]}», con raya cortada`, q && [q.dice, q.raya]]);
      } else r.push([!q, `paso ${n}: sin la pregunta de «${p}»`, !!q]);
      if (n === 4) {
        const enFrase = leer(ctx).includes(RESP[p].replace(/^a /, ''));
        r.push([colgada(a, w, lineaDe[p]) && nb(a.dice) === RESP[p] && entera(a.raya) && enFrase,
          `paso 4: debajo de «${p}» contesta «${RESP[p]}», con raya entera, con palabras de la frase de antes`, a && [a.dice, a.raya]]);
      } else r.push([!a, `paso ${n}: sin la respuesta de «${p}»`, !!a]);
    });
    const pills = x.preguntas.concat(x.respuestas);
    r.push([!pills.some((q, i) => pills.some((o, j) => j > i && cruza(q.caja, o.caja))) && !pills.some(q => msg.concat(ctx).some(w => cruza(w.tinta, q.caja))),
      `paso ${n}: las píldoras no se montan entre sí ni sobre el mensaje`, pills.map(q => q.dice)]);

    /* Los niños: cinco, cada uno con su nombre debajo de los pies. */
    const ninos = x.alumnos;
    r.push([ninos.length === 5 && ninos.every(k => !!k.rotulo && nb(k.rotulo.dice) === k.nombre && k.rotulo.tinta.y0 > k.pies && Math.abs(medio(k.rotulo.caja)[0] - k.c[0]) <= 0.6) &&
      ninos.filter(k => k.nombre === 'Marvin').length === 1,
      `paso ${n}: los cinco niños, cada uno con su nombre debajo`, ninos.map(k => k.nombre)]);
    if (ninos.length !== 5) return r;
    const encima = (c, k) => Math.abs(medio(c.caja)[0] - k.c[0]) <= 2 && c.caja.y1 < k.c[1] - k.r - 4 && c.caja.y1 > k.c[1] - k.r - 30;
    const deQuien = c => ninos.find(k => encima(c, k));
    const pregLe = x.preguntas.find(t => t.de === 'le'), pregLo = x.preguntas.find(t => t.de === 'lo');

    /* 1 · «le» en los cinco: un hilo de raya cortada desde «¿a quién?» hasta
       el aro de cada niño, cada uno a uno distinto. */
    const hLe = x.hilos.filter(h => h.de === 'le'), hLo = x.hilos.filter(h => h.de === 'lo');
    const anillosLe = x.anillos.filter(a => !a.uno), anillosUno = x.anillos.filter(a => a.uno);
    const aroDe = a => ninos.find(k => dist(a.c, k.c) <= 1 && a.r > k.r + 2);
    if (n === 1) {
      const destinos = hLe.map(h => ninos.find(k => dist(h.fin, [k.c[0], k.c[1] - 13]) <= 2.5));
      r.push([hLe.length === 5 && !!pregLe && hLe.every(h => cortada(h.raya) && dist(h.ini, [medio(pregLe.caja)[0], pregLe.caja.y1]) <= 1) &&
        destinos.every(Boolean) && new Set(destinos.map(k => k.i)).size === 5,
        'paso 1: de «¿a quién?» sale un hilo de raya cortada a cada uno de los cinco niños', destinos.map(k => k && k.nombre)]);
    } else r.push([hLe.length === 0, `paso ${n}: sin los hilos de «le»`, hLe.length]);
    if (n === 1 || n === 2) {
      const con = anillosLe.map(aroDe);
      r.push([anillosLe.length === 5 && anillosUno.length === 0 && con.every(Boolean) && new Set(con.map(k => k.i)).size === 5 && anillosLe.every(a => cortada(a.raya)),
        `paso ${n}: un aro de raya cortada alrededor de cada uno de los cinco`, con.map(k => k && k.nombre)]);
    } else if (dos) {
      const k = anillosUno.length === 1 ? aroDe(anillosUno[0]) : null;
      r.push([anillosLe.length === 0 && !!k && k.nombre === nb((ctx[0] || {}).dice) && entera(anillosUno[0].raya),
        `paso ${n}: un solo aro, de raya entera, alrededor del niño que nombra la frase de antes`, k && k.nombre]);
      const mk = x.marcoNombre, rk = k && k.rotulo;
      r.push([!!mk && !!rk && dentroDe(rk.tinta, mk.caja) && entera(mk.raya), `paso ${n}: su nombre, enmarcado`, !!mk]);
    } else {
      r.push([x.anillos.length === 0 && !x.marcoNombre, `paso ${n}: sin aros`, x.anillos.length]);
    }
    if (!dos) r.push([!x.marcoNombre, `paso ${n}: ningún nombre enmarcado`, !!x.marcoNombre]);

    /* 2 · «lo» en las dos cosas: de «¿qué?» sale un hilo a cada una, y al
       lado de cada una dice qué es. */
    const cuaderno = x.cosas.find(c => c.de === 'cuaderno'), dinero = x.cosas.find(c => c.de === 'dinero');
    if (n === 2) {
      const destinos = hLo.map(h => x.cosas.find(c => aCaja(h.fin, c.caja) <= 3));
      const salen = !!pregLo && hLo.every(h => cortada(h.raya) && aCaja(h.ini, pregLo.caja) <= 0.8);
      r.push([x.cosas.length === 2 && hLo.length === 2 && salen && destinos.every(Boolean) && new Set(destinos.map(c => c.de)).size === 2 &&
        x.cosas.every(c => !deQuien(c) && c.caja.y1 < Math.min(...ninos.map(k => k.c[1] - k.r)) - 8),
        'paso 2: de «¿qué?» sale un hilo a cada una de las dos cosas, lejos de los niños', destinos.map(c => c && c.de)]);
      const ROT = { cuaderno: 'el cuaderno', dinero: 'el dinero' };
      r.push([x.rotCosas.length === 2 && x.cosas.every(c => { const t = x.rotCosas.find(q => q.de === c.de); return !!t && nb(t.dice) === ROT[c.de] && t.caja.x0 > c.caja.x1 && t.caja.y0 < c.caja.y1 && t.caja.y1 > c.caja.y0; }),
        'paso 2: al lado de cada cosa dice qué es', x.rotCosas.map(t => t.dice)]);
      const multiplica = anillosLe.length * hLo.length;
      r.push([e.cifra === String(multiplica) && nb(e.palabras).includes(anillosLe.length + ' × ' + hLo.length) && e.texto.includes('diez'),
        'paso 2: el marcador multiplica lo que se ve: niños con aro por cosas con hilo', [e.cifra, e.palabras, multiplica]]);
    } else {
      r.push([hLo.length === 0 && x.rotCosas.length === 0, `paso ${n}: sin los hilos de «lo» ni lo que dice cada cosa`, hLo.length]);
    }

    /* 3 · Lo que pasó en cada casa: cada cosa encima de un niño, una duda
       encima de cada uno de los demás, y la frase nombra a quien está debajo
       de cada cosa. 4 y 5 · el cuaderno, encima del niño de la frase. */
    const dudas = x.dudas.map(d => ({ d, k: ninos.find(k => Math.abs(d.c[0] - k.c[0]) <= 1 && d.c[1] < k.c[1] - k.r) }));
    if (n === 3) {
      const kc = cuaderno && deQuien(cuaderno), kd = dinero && deQuien(dinero);
      const conDuda = dudas.map(q => q.k);
      const todos = [kc, kd].concat(conDuda).filter(Boolean).map(k => k.i);
      r.push([!!kc && !!kd && kc !== kd && dudas.length === 3 && conDuda.every(Boolean) && new Set(todos).size === 5 &&
        x.dudas.every(d => nb(d.dice) === '?' && cortada(d.raya)),
        'paso 3: una cosa encima de dos niños y una duda encima de cada uno de los otros tres', [kc && kc.nombre, kd && kd.nombre, conDuda.map(k => k && k.nombre)]]);
      r.push([!!kc && !!kd && e.texto.includes(kc.nombre + ' llevó un cuaderno') && e.texto.includes(kd.nombre + ' el dinero'),
        'paso 3: la frase nombra a quien está debajo de cada cosa', [kc && kc.nombre, kd && kd.nombre]]);
      r.push([e.cifra === String(dudas.length) && /no mandaron nada/.test(e.palabras), 'paso 3: el marcador cuenta las casas que no mandaron nada', [e.cifra, dudas.length]]);
    } else {
      r.push([x.dudas.length === 0, `paso ${n}: sin dudas`, x.dudas.length]);
    }
    if (dos) {
      const kc = cuaderno && deQuien(cuaderno);
      r.push([!!kc && kc.nombre === nb((ctx[0] || {}).dice) && !dinero, `paso ${n}: el cuaderno, encima del niño que nombra la frase de antes, y el dinero ya no está`, kc && kc.nombre]);
    }
    if (n <= 1) r.push([x.cosas.length === 0, `paso ${n}: todavía no hay cosas`, x.cosas.length]);

    /* 5 · Los dos pronombres bajan a una misma raya, y de ella cuelga su
       nombre. */
    if (n === 5) {
      const cL = x.conectores.find(c => c.de === 'le'), cO = x.conectores.find(c => c.de === 'lo');
      const sale = (c, w, s) => !!c && !!s && Math.abs(c.a[0] - medio(w.caja)[0]) <= 0.6 && c.a[1] >= s.caja.y0 - 0.5 && c.a[1] <= s.caja.y0 + 3 && c.b[1] > globo.caja.y1;
      const hz = x.llave.find(q => q.de === ''), baja = x.llave.find(q => q.de === 'baja'), rot = x.rotulos.find(q => q.de === 'pronombres');
      const ok = x.conectores.length === 2 && sale(cL, le, lineaDe.le) && sale(cO, lo, lineaDe.lo) && !!hz && !!baja && !!rot &&
        Math.abs(cL.b[1] - hz.a[1]) <= 0.6 && Math.abs(cO.b[1] - hz.b[1]) <= 0.6 && Math.abs(hz.a[0] - cL.b[0]) <= 0.6 && Math.abs(hz.b[0] - cO.b[0]) <= 0.6 &&
        Math.abs(baja.a[0] - (hz.a[0] + hz.b[0]) / 2) <= 0.6 && Math.abs(baja.b[1] - rot.caja.y0) <= 0.6 && Math.abs(medio(rot.caja)[0] - baja.a[0]) <= 0.6 &&
        nb(rot.dice) === 'pronombres' && entera(rot.raya);
      r.push([ok, 'paso 5: «le» y «lo» bajan a una misma raya, y de ella cuelga «pronombres»', [x.conectores.map(c => c.de), !!hz, !!baja, rot && rot.dice]]);
      r.push([e.cifra === String(x.conectores.length) && /pronombres/.test(e.palabras), 'paso 5: el marcador cuenta los pronombres del mensaje', e.cifra]);
    } else {
      r.push([x.conectores.length === 0 && x.llave.length === 0 && x.rotulos.length === 0, `paso ${n}: todavía sin la raya de los pronombres`, x.conectores.length]);
    }

    /* Lo que dice el marcador en los pasos que no cuentan dibujo. */
    if (n === 0) r.push([e.cifra === '¿?', 'paso 0: el marcador todavía no dice cuántas', e.cifra]);
    if (n === 1) r.push([e.cifra === String(anillosLe.length) && e.cifra === String(hLe.length) && /«le»/.test(e.palabras), 'paso 1: el marcador cuenta los niños con aro', e.cifra]);
    if (n === 4) r.push([e.cifra === '1', 'paso 4: el marcador dice un solo mensaje', e.cifra]);
    return r;
  },
  /* Los Verbos: el papel de Marvin. Se lee el papel palabra por palabra
     (qué dice y dónde está cada una) y se mide sobre el dibujo en qué punto
     de la línea del tiempo cayó el sobre, sin creerle a ningún rótulo: el
     pasado tiene que quedar a la IZQUIERDA del «ahora» y el futuro a la
     DERECHA, y el marcador tiene que nombrar el tiempo del punto donde está
     el sobre. ⚠️ La raíz no se mueve nunca: «mand» se mide en cada paso y
     tiene que estar en el mismo sitio; lo que cambia es solo la terminación,
     que va pegada a ella. ⚠️ Y las tres noticias se quedan: en el paso 3
     están las tres formas, cada una encima de su punto, y lo que entiende
     el maestro, debajo. Lo que es la raíz va con raya cortada y lo que es
     la desinencia, con raya entera. ⚠️ Y la prueba no se regala: no sale
     ninguna palabra de sus preguntas, ni persona, ni número, ni modo. */
  amPapel(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ');
    const prohibidas = dicho.match(/gato|sof[aá]|duerm|durm|dorm|\bcant|\bviv[ie]|\bcom(er|e|es|o|imos|er[aá]n)\b|\bjug|\bjueg|\bcorr|\bbail|feli[zc]|estudi|escrib|\bsalt|\bcasa\b|r[aá]pido|\bviaj|\bbeb|\bni[ñn][oa]s?\b|patio|\ble(o|e|es|en|er|emos|er[aá]n)\b|\bamar\b|temer|subir|vender|perro|ladr|\bmucho\b|\bnad(ar|o)\b|tamales|cop[aá]n|choluteca|mercado|\bfui(mos)?\b|\best[aá]n\b|content|prepar|\bcena\b|\bt[íi]a\b|ojal[aá]|lluev|llov|ma[ñn]ana|\bayer\b|\bhoy\b|viernes|s[aá]bado|persona|singular|plural|sujeto|predicado|infinitivo|conjugaci|regular|copulativ|subjuntivo|imperativo|indicativo|\bmodos?\b|\btuve\b|\btener\b|\bser\b|\bestar\b|parec|parque|carta|abuel|p[aá]jaro|vuel[av]|puerta|cierr|campeonato|profesora|explic|verano|playa|cumplea|leones|rug[ei]|carrera|pel[íi]cula|habitaci|agricultor|cosech|caf[ée]|baleada|cuida|\br[íi]o\b|comunidad|himno|ruinas|pescad|\bvend|ceiba|leyenda|yoro|hermos|poema|cuento|brill|dibuj|[áa]rbol|ciudad|inteligente|cansad|\bnoche\b|\bellas?\b|\bellos\b|nosotros|ustedes|\byo\b|\btú(?=[\s.,;:!?»]|$)/gi);
    r.push([!prohibidas, `paso ${n}: no sale ninguna palabra de la prueba, ni persona, ni número, ni modo`, prohibidas]);
    const FINES = ['ó', 'a', 'ará'];
    /* Qué quiere decir cada tiempo y dónde tiene que caer, escrito aquí
       aparte y no leído de la escena. */
    const TIEMPO = { antes: 'pasado', ahora: 'presente', 'después': 'futuro' };
    const NOTICIA = { antes: '«Ya salió.»', ahora: '«Sale ahora.»', 'después': '«Va a salir.»' };
    const t = n === 0 ? -1 : Math.min(n, 3) - 1;
    const cortada = v => v > 0 && v < 8, entera = v => v === 0 || v > 20;
    const dentro = (p, c, tol = 3) => p[0] >= c.x0 - tol && p[0] <= c.x1 + tol && p[1] >= c.y0 - tol && p[1] <= c.y1 + tol;
    const medio = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    /* Subrayada: la raya va justo debajo de la palabra y del ancho de ella. */
    const bajo = (ra, w) => !!ra && !!w && Math.abs(ra.caja.x0 - w.caja.x0) <= 1.5 && Math.abs(ra.caja.x1 - w.caja.x1) <= 2 &&
      ra.caja.y0 >= w.caja.y1 - 4 && ra.caja.y0 <= w.caja.y1 + 6;
    /* Pegada: la terminación empieza donde acaba la raíz, en el mismo renglón. */
    const pegada = (a, b) => !!a && !!b && Math.abs(b.caja.x0 - a.caja.x1) <= 1.5 && Math.abs(b.caja.y1 - a.caja.y1) <= 1.5;

    /* El papel: lo que dice, renglón por renglón. */
    const r1 = x.palabras.filter(p => p.r === 1), r2 = x.palabras.filter(p => p.r === 2);
    const mama = r1.find(p => !p.pieza), raizP = r1.find(p => p.pieza === 'raiz'), fines = r1.filter(p => p.pieza === 'fin');
    r.push([!!mama && nb(mama.dice) === 'Mi mamá' && r2.length === 1 && nb(r2[0].dice) === 'el dinero de la excursión.' &&
      r2[0].caja.y0 > mama.caja.y1 - 2,
      `paso ${n}: el papel dice «Mi mamá …» y debajo «el dinero de la excursión.»`, x.palabras.map(p => p.dice)]);
    if (!mama) return r;
    if (n === 0) {
      raizVerbos = null;
      r.push([!raizP && fines.length === 0 && !!x.hueco && x.hueco.caja.x0 > mama.caja.x1 && x.hueco.caja.y0 < mama.caja.y1 && x.hueco.caja.y1 > mama.caja.y0 &&
        cortada(x.hueco.raya) && !/mand/i.test(e.texto + e.cifra + e.palabras) && x.formas.length + x.noticias.length === 0,
        'paso 0: el verbo es un hueco con raya cortada, al lado de «Mi mamá», y nada dice todavía cuál es', [!!raizP, fines.length, !!x.hueco]]);
    } else {
      r.push([!x.hueco && !!raizP && nb(raizP.dice) === 'mand' && raizP.caja.x0 > mama.caja.x1 + 2 && Math.abs(raizP.caja.y1 - mama.caja.y1) <= 1.5,
        `paso ${n}: en el hueco está «mand», en el renglón de «Mi mamá»`, raizP && [raizP.dice, Math.round(raizP.caja.x0)]]);
      if (raizP) {
        if (raizVerbos == null) raizVerbos = raizP.caja.x0;
        r.push([Math.abs(raizP.caja.x0 - raizVerbos) < 0.5, `paso ${n}: la raíz no se movió ni un punto`, [raizVerbos, raizP.caja.x0]]);
      }
      const fin = fines[0];
      r.push([fines.length === 1 && nb(fin.dice) === FINES[t] && pegada(raizP, fin),
        `paso ${n}: la terminación es «${FINES[t]}», una sola, pegada a «mand»`, fines.map(f => [f.dice, Math.round(f.caja.x0)])]);
      const rFin = x.rayas.filter(q => q.de === 'fin');
      r.push([rFin.length === 1 && bajo(rFin[0], fin) && entera(rFin[0].raya), `paso ${n}: la terminación va subrayada con raya entera`, rFin.map(q => q.raya)]);
      const rRaiz = x.rayas.filter(q => q.de === 'raiz');
      if (n === 4) r.push([rRaiz.length === 1 && bajo(rRaiz[0], raizP) && cortada(rRaiz[0].raya), 'paso 4: la raíz va subrayada con raya cortada', rRaiz.map(q => q.raya)]);
      else r.push([rRaiz.length === 0, `paso ${n}: la raíz todavía no se subraya`, rRaiz.length]);
    }
    const fin = fines[0];

    /* La línea del tiempo: tres puntos en el eje, el del medio es el
       «ahora», y cada uno con su rótulo debajo. */
    const ejeP = x.puntos.slice().sort((a, b) => a[0] - b[0]);
    const zona = p => { const z = x.zonas.find(q => Math.abs(q.c[0] - p[0]) <= 1.5 && q.c[1] > p[1]); return z ? nb(z.dice) : null; };
    r.push([ejeP.length === 3 && ejeP.every(p => Math.abs(p[1] - x.eje.y) <= 0.5 && p[0] > x.eje.x0 && p[0] < x.eje.x1) &&
      Math.abs(ejeP[1][0] - x.ahora) <= 1 && zona(ejeP[0]) === 'antes' && zona(ejeP[1]) === 'ahora' && zona(ejeP[2]) === 'después',
      `paso ${n}: la línea del tiempo tiene antes, ahora y después, en ese orden, y el ahora lleva su marca`, ejeP.map(zona)]);
    if (ejeP.length !== 3) return r;
    /* En qué punto está algo: el más cercano a lo ancho, a menos de 1,5. */
    const enPunto = cx => { const p = ejeP.reduce((m, q) => Math.abs(q[0] - cx) < Math.abs(m[0] - cx) ? q : m, ejeP[0]); return Math.abs(p[0] - cx) <= 1.5 ? p : null; };
    const sx = medio(x.sobre)[0], pSobre = enPunto(sx);

    if (n === 0) {
      r.push([Math.abs(sx - x.ahora) <= 1.5 && x.caidas.length === 0, 'paso 0: el sobre espera encima del ahora, sin caer en ningún tiempo', [Math.round(sx), x.ahora, x.caidas.length]]);
      const salen = x.abanico.filter(l => Math.abs(l.a[0] - sx) <= 1.5 && Math.abs(l.a[1] - x.sobre.y1) <= 2.5);
      const llegan = x.abanico.map(l => enPunto(l.b[0])).filter(p => p && x.abanico.some(l => Math.abs(l.b[1] - (p[1] - 5)) <= 2));
      r.push([x.abanico.length === 3 && salen.length === 3 && new Set(llegan).size === 3,
        'paso 0: del sobre salen tres caminos, uno a cada punto', x.abanico.map(l => [l.a.map(Math.round), l.b.map(Math.round)])]);
      const bajoPunto = x.preguntas.map(q => enPunto(q.c[0])).filter(Boolean);
      r.push([x.preguntas.length === 3 && x.preguntas.every(q => nb(q.dice) === '?') && new Set(bajoPunto).size === 3 &&
        x.preguntas.every(q => q.c[1] > x.eje.y + 10),
        'paso 0: debajo de cada punto, un «?»: sin la palabra no se sabe cuál', x.preguntas.map(q => q.c.map(Math.round))]);
      r.push([e.cifra === '¿?', 'paso 0: el marcador todavía no dice ningún tiempo', e.cifra]);
    } else {
      /* El sobre cae en un punto, y ese punto es el del tiempo del verbo. */
      const z = pSobre && zona(pSobre);
      r.push([!!z && TIEMPO[z] === ['pasado', 'presente', 'futuro'][t] &&
        (t === 0 ? sx < x.ahora - 20 : t === 1 ? Math.abs(sx - x.ahora) <= 1.5 : sx > x.ahora + 20),
        `paso ${n}: con «mand${FINES[t]}», el sobre cae ${['a la izquierda del ahora', 'en el ahora', 'a la derecha del ahora'][t]}`, [Math.round(sx), x.ahora, z]]);
      const c = x.caidas[0];
      r.push([x.caidas.length === 1 && !!pSobre && Math.abs(c.a[0] - sx) <= 1.5 && Math.abs(c.a[1] - x.sobre.y1) <= 2.5 &&
        Math.abs(c.b[0] - pSobre[0]) <= 1.5 && Math.abs(c.b[1] - (pSobre[1] - 5)) <= 2,
        `paso ${n}: una sola raya baja del sobre hasta su punto`, x.caidas.map(q => [q.a.map(Math.round), q.b.map(Math.round)])]);
      r.push([x.abanico.length + x.preguntas.length === 0, `paso ${n}: ya no quedan caminos ni «?»`, [x.abanico.length, x.preguntas.length]]);
      /* El marcador nombra el tiempo del punto donde está el sobre. */
      if (n <= 3) r.push([e.cifra === '-' + FINES[t] && !!z && nb(e.palabras).startsWith(TIEMPO[z]) && !!fin && e.cifra === '-' + nb(fin.dice),
        `paso ${n}: el marcador dice la terminación del papel y el tiempo del punto donde cayó el sobre`, [e.cifra, e.palabras, z]]);
      if (n <= 3) r.push([e.texto.includes('«mand' + FINES[t] + '»'), `paso ${n}: la frase dice la palabra que hay en el papel`, e.texto]);
    }

    /* Lo que se leyó en cada tiempo se queda: la forma encima de su punto,
       con la terminación pegada y subrayada, y la noticia debajo. */
    const hechas = n === 0 ? 0 : Math.min(n, 3);
    r.push([x.formas.length === hechas && x.noticias.length === hechas, `paso ${n}: quedan ${hechas} forma${hechas === 1 ? '' : 's'} y ${hechas} noticia${hechas === 1 ? '' : 's'}`, [x.formas.length, x.noticias.length]]);
    const vistas = [];
    x.formas.forEach(f => {
      const ok0 = !!f.raiz && !!f.fin && nb(f.raiz.dice) === 'mand' && pegada(f.raiz, f.fin);
      const w = ok0 ? { x0: f.raiz.caja.x0, x1: f.fin.caja.x1 } : null;
      const p = w && enPunto((w.x0 + w.x1) / 2);
      const z = p && zona(p);
      const k = z ? ['antes', 'ahora', 'después'].indexOf(z) : -1;
      vistas.push(k);
      r.push([ok0 && k >= 0 && nb(f.fin.dice) === FINES[k] && f.fin.caja.y1 < x.sobre.y0 + 1 && f.fin.caja.y1 < p[1] &&
        !!f.rayaFin && bajo(f.rayaFin, f.fin) && entera(f.rayaFin.raya),
        `paso ${n}: «mand${f.fin ? f.fin.dice : '?'}» va encima de ${z || '¿?'}, con la terminación subrayada entera`, w && [Math.round(w.x0), Math.round(w.x1), z]]);
      if (n === 4) r.push([!!f.rayaRaiz && bajo(f.rayaRaiz, f.raiz) && cortada(f.rayaRaiz.raya), `paso 4: el «mand» de «mand${f.fin && f.fin.dice}» va subrayado con raya cortada`, f.rayaRaiz && f.rayaRaiz.raya]);
      else r.push([!f.rayaRaiz, `paso ${n}: la raíz de las formas todavía no se subraya`, !!f.rayaRaiz]);
    });
    r.push([new Set(vistas).size === vistas.length && vistas.every(k => k >= 0 && k < hechas),
      `paso ${n}: cada forma está en su punto, y en el orden en que se probaron`, vistas]);
    x.noticias.forEach(q => {
      const p = enPunto(q.c[0]), z = p && zona(p);
      const zc = z && x.zonas.find(o => nb(o.dice) === z);
      r.push([!!z && nb(q.dice) === NOTICIA[z] && !!zc && q.c[1] > zc.c[1], `paso ${n}: debajo de ${z || '¿?'} dice ${z ? NOTICIA[z] : '?'}`, [q.dice, z]]);
    });
    /* La forma que está encima del sobre es la que dice el papel. */
    if (n >= 1 && n <= 3 && pSobre && fin) {
      const f = x.formas.find(q => q.fin && enPunto((q.raiz.caja.x0 + q.fin.caja.x1) / 2) === pSobre);
      r.push([!!f && nb(f.fin.dice) === nb(fin.dice), `paso ${n}: encima del sobre está la palabra del papel`, f && f.fin.dice]);
    }

    /* Qué es cada pieza, en el papel. */
    if (n === 4) {
      const rr = x.rotulos.find(q => q.de === 'raiz'), rd = x.rotulos.find(q => q.de === 'desinencia');
      r.push([x.rotulos.length === 2 && !!rr && !!rd && nb(rr.dice) === 'raíz' && nb(rd.dice) === 'desinencia' && cortada(rr.raya) && entera(rd.raya),
        'paso 4: los dos rótulos, «raíz» con borde cortado y «desinencia» con borde entero', x.rotulos.map(q => [q.dice, q.raya])]);
      const cr = x.conectores.find(q => q.de === 'raiz'), cd = x.conectores.find(q => q.de === 'desinencia');
      /* Un extremo en el rótulo y el otro junto a su palabra: el hilo empieza
         a unos puntos de la letra, para no tocarla. */
      const une = (h, rot, pal) => !!h && ((dentro(h.a, rot, 2) && dentro(h.b, pal, 5)) || (dentro(h.b, rot, 2) && dentro(h.a, pal, 5)));
      r.push([x.conectores.length === 2 && !!rr && !!rd && !!raizP && !!fin && une(cr, rr.caja, raizP.caja) && une(cd, rd.caja, fin.caja) &&
        Math.abs(medio(rr.caja)[0] - medio(raizP.caja)[0]) <= 2 && rr.caja.y1 <= raizP.caja.y0 + 1 &&
        rd.caja.x0 > fin.caja.x1 && rd.caja.y0 < fin.caja.y1 && rd.caja.y1 > fin.caja.y0,
        'paso 4: «raíz» va encima de «mand» y «desinencia» al lado de la terminación, cada uno con su hilo', x.conectores.map(q => [q.de, q.a.map(Math.round), q.b.map(Math.round)])]);
      r.push([e.cifra === nb(raizP ? raizP.dice : '') + '-' && /raíz/.test(e.palabras) && /raíz/.test(e.texto) && /desinencia/.test(e.texto),
        'paso 4: el marcador dice la raíz del papel, y la frase nombra la raíz y la desinencia', [e.cifra, e.palabras]]);
    } else {
      r.push([x.rotulos.length + x.conectores.length === 0, `paso ${n}: todavía no hay rótulos`, [x.rotulos.length, x.conectores.length]]);
    }
    return r;
  },

  /* Los Adverbios: el recado de Kenia. Se lee cada papel palabra por
     palabra, y en qué papel quedó cada palabra, sin creerle a ningún
     rótulo: el recado dice «Kenia casi no comió hoy.» y lo copiado, «Kenia
     no comió hoy.». ⚠️ El plato es lo que pasó: a la tortilla le falta UN
     bocado, en su orilla, y el anillo lo rodea; por eso el ✓ va al recado y
     la ✗ a lo copiado. Al alinearse, cada palabra copiada queda debajo de
     la suya y el hueco ocupa justo el sitio de «casi». Al recortarlos, los
     tres adverbios salen de la nota con su borde de tijera y su pregunta, y
     en la nota queda «Kenia comió.», que el marcador cuenta. ⚠️ «Kenia» no
     se mueve nunca. ⚠️ Ninguna raya une «casi» con otra palabra: a qué
     modifica es lo que la prueba pregunta en sus pareados. ⚠️ Y la prueba
     no se regala: no sale ninguna palabra de sus preguntas, ni una clase de
     adverbio. */
  amRecado(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ');
    const prohibidas = dicho.match(/bonit|\blent[ao]s?\b|feli[zc]|f[aá]cil|invariable|g[eé]nero|tranquil|\bserie\b|[a-záéíóúñ]+mente\b|cari[ñn]os|quiz[aá]s|lluev|\btela\b|despu[eé]s|recreo|lejos|\bt[íi]o\b|amable|alegre|veloz|\bbajo\b|biblioteca|temprano|lleg[aoó]|r[aá]pid|ma[ñn]ana|\br[íi]o\b|tal vez|\bluis\b|correct|honrad|deprisa|cort[eé]s|\bayer\b|comimos|\bbien\b|d[eé]bil|seren|educad|perro|ladr|fuerte|c[oó]mod|sincer|pr[aá]ctic|\bprima\b|cerca|\btarde\b|anoche|calor|choluteca|\blugar\b|tiempo|\bmodo\b|cantidad|afirmaci|negaci|\bduda\b|pronto|\bmuy\b|\balto\b|nunca|avi[oó]n|parque|aqu[íi]|\bcine\b|tampoco|demasiado|fiesta|abuel|bastante|tambi[eé]n|jam[aá]s|acaso|despacio|all[íi]\b|postre|\bnada\b|\bcomer\b|cumplea|examen|dif[íi]cil|herman|\bclaro\b|\bduro\b|\bpan\b|tortilla|mercado|siempre|mucho|afuera|pulper|leche|lempira|se[ñn]ora|\bpoco\b|\bm[aá]s\b/gi);
    r.push([!prohibidas, `paso ${n}: no sale ninguna palabra de la prueba, ni una clase de adverbio`, prohibidas]);

    const dentroDe = (c, k, tol = 0.5) => c.x0 >= k.x0 - tol && c.x1 <= k.x1 + tol && c.y0 >= k.y0 - tol && c.y1 <= k.y1 + tol;
    const cruza = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
    const medio = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const cortada = v => v > 0 && v < 8, entera = v => v === 0 || v > 20;
    const orden = ws => ws.slice().sort((a, b) => a.caja.x0 - b.caja.x0);
    const frase = ws => orden(ws).map(w => nb(w.dice)).join(' ').replace(/ \./g, '.');
    /* Seguidas como se escriben: un espacio entre palabra y palabra, y el
       punto pegado a la última. */
    const seguidas = ws => orden(ws).every((w, i, o) => {
      if (i === 0) return true;
      const g = w.caja.x0 - o[i - 1].caja.x1;
      return nb(w.dice) === '.' ? Math.abs(g) <= 1.5 : g > 2 && g < 7;
    });
    const PREG = { casi: '¿cuánto?', no: '¿sí o no?', hoy: '¿cuándo?' };

    /* El recado: lo que dice, y qué quedó dentro de la nota. */
    const rotR = x.rotulosPapel.find(q => q.de === 'recado');
    r.push([!!rotR && nb(rotR.dice) === 'Recado de la mamá' && dentroDe(rotR.caja, x.recado), `paso ${n}: el recado lleva su rótulo, dentro de la nota`, rotR && rotR.dice]);
    const enRecado = x.palabras.filter(w => w.renglon === 'recado');
    const enNota = enRecado.filter(w => dentroDe(w.caja, x.recado, 1)), fueraNota = enRecado.filter(w => !dentroDe(w.caja, x.recado, 1));
    const palabra = (lista, t) => lista.find(w => nb(w.dice) === t);
    if (n === 4) {
      r.push([frase(enNota) === 'Kenia comió.' && seguidas(enNota), 'paso 4: en la nota queda «Kenia comió.», seguido como se escribe', frase(enNota)]);
      r.push([fueraNota.length === 3 && ['casi', 'no', 'hoy'].every(t => { const w = palabra(fueraNota, t); return !!w && dentroDe(w.caja, x.libreta) && w.caja.y0 > x.recado.y1; }),
        'paso 4: «casi», «no» y «hoy» salieron de la nota y están en la libreta, debajo de ella', fueraNota.map(w => w.dice)]);
    } else {
      r.push([fueraNota.length === 0 && frase(enNota) === 'Kenia casi no comió hoy.' && seguidas(enNota),
        `paso ${n}: el recado dice «Kenia casi no comió hoy.», seguido como se escribe`, [frase(enNota), fueraNota.map(w => w.dice)]]);
    }
    const kenia = palabra(enNota, 'Kenia');
    if (!kenia) return r;
    if (n === 0) keniaAdverbios = [kenia.caja.x0, kenia.caja.y1];
    r.push([!!keniaAdverbios && Math.abs(kenia.caja.x0 - keniaAdverbios[0]) < 0.5 && Math.abs(kenia.caja.y1 - keniaAdverbios[1]) < 0.5,
      `paso ${n}: «Kenia» no se movió ni un punto`, [keniaAdverbios, kenia.caja.x0]]);

    /* Lo que copiaron en la libreta: debajo del recado, seguido en los dos
       primeros pasos y alineado después, cada palabra debajo de la suya. */
    const copiadas = x.palabras.filter(w => w.renglon === 'libreta');
    const rotL = x.rotulosPapel.find(q => q.de === 'libreta');
    if (n <= 3) {
      r.push([frase(copiadas) === 'Kenia no comió hoy.' && copiadas.every(w => dentroDe(w.caja, x.libreta) && w.caja.y0 > x.recado.y1) &&
        !!rotL && nb(rotL.dice) === 'Libreta de la escuela',
        `paso ${n}: en la libreta, debajo del recado, dice «Kenia no comió hoy.»`, frase(copiadas)]);
      if (n <= 1) {
        r.push([seguidas(copiadas) && !x.hueco, `paso ${n}: lo copiado va seguido, como se escribió, y todavía sin hueco`, !!x.hueco]);
      } else {
        const debajo = copiadas.every(w => { const q = palabra(enNota, nb(w.dice)); return !!q && Math.abs(q.caja.x0 - w.caja.x0) <= 0.5; });
        r.push([debajo, `paso ${n}: cada palabra copiada quedó debajo de la suya en el recado`, copiadas.map(w => [w.dice, Math.round(w.caja.x0)])]);
        const casi = palabra(enNota, 'casi'), h = x.hueco;
        const fila = { y0: Math.min(...copiadas.map(w => w.caja.y0)), y1: Math.max(...copiadas.map(w => w.caja.y1)) };
        r.push([!!h && !!casi && cortada(h.raya) && Math.abs(h.caja.x0 - casi.caja.x0) <= 1 && Math.abs(h.caja.x1 - casi.caja.x1) <= 1 &&
          h.caja.y0 < fila.y1 && h.caja.y1 > fila.y0 && !copiadas.some(w => cruza(w.caja, h.caja)),
          `paso ${n}: en la libreta queda el hueco de «casi», con raya cortada, justo debajo de ella`, h && [Math.round(h.caja.x0), Math.round(h.caja.x1), h.raya]]);
        if (n === 2 && h) {
          const falta = enNota.find(w => Math.abs(w.caja.x0 - h.caja.x0) <= 1);
          r.push([!!falta && e.cifra === nb(falta.dice) && e.texto.includes('«' + nb(falta.dice) + '»'),
            'paso 2: el marcador y la frase dicen la palabra que hay encima del hueco', [e.cifra, falta && falta.dice]]);
        }
      }
    } else {
      r.push([copiadas.length === 0 && !rotL && !x.hueco, `paso ${n}: lo copiado ya se fue de la libreta`, copiadas.length]);
    }

    /* El ✓ y la ✗: el ✓ al lado del recado y la ✗ al lado de lo copiado. */
    const bien = x.marcas.filter(m => m.de === 'bien'), mal = x.marcas.filter(m => m.de === 'mal');
    const renglon = ws => ({ x1: Math.max(...ws.map(w => w.caja.x1)), y0: Math.min(...ws.map(w => w.caja.y0)), y1: Math.max(...ws.map(w => w.caja.y1)) });
    const alLado = (m, ws) => { const q = renglon(ws); return m.caja.x0 > q.x1 && m.caja.y0 < q.y1 && m.caja.y1 > q.y0; };
    const conBien = n >= 1 && n !== 4, conMal = n >= 1 && n <= 3;
    r.push([bien.length === (conBien ? 1 : 0) && mal.length === (conMal ? 1 : 0) && (!conBien || alLado(bien[0], enNota)) && (!conMal || alLado(mal[0], copiadas)),
      `paso ${n}: ${conBien ? '✓ al lado del recado' : 'sin ✓'}${conMal ? ' y ✗ al lado de lo copiado' : ', sin ✗'}`, [bien.length, mal.length]]);

    /* El plato: a la tortilla le falta un bocado, en su orilla, y es poco:
       lo que se comió se mide contando puntos de la tortilla que caen
       dentro de las mordidas. */
    const t = x.tortilla, ms = x.mordidas;
    const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    const cm = ms.length ? [ms.reduce((a, m) => a + m.c[0], 0) / ms.length, ms.reduce((a, m) => a + m.c[1], 0) / ms.length] : null;
    const unBocado = ms.length > 0 && ms.every(m => dist(m.c, cm) <= 8 && Math.abs(dist(m.c, t.c) - t.r) <= 3);
    let dentroT = 0, comido = 0;
    for (let px = t.c[0] - t.r; px <= t.c[0] + t.r; px += 0.5) for (let py = t.c[1] - t.r; py <= t.c[1] + t.r; py += 0.5) {
      if (dist([px, py], t.c) > t.r) continue;
      dentroT++;
      if (ms.some(m => dist([px, py], m.c) <= m.r)) comido++;
    }
    const parte = dentroT ? comido / dentroT : 1;
    r.push([unBocado && parte > 0.02 && parte < 0.15 && dist(t.c, x.plato.c) + t.r < x.plato.r,
      `paso ${n}: a la tortilla le falta un bocado, en su orilla, y es poco (${Math.round(parte * 100)} %)`, [ms.length, Math.round(parte * 100)]]);
    if (n === 0) {
      r.push([!x.anillo && !x.rotBocado && e.cifra === '¿?', 'paso 0: el bocado está, pero nada lo señala todavía', [!!x.anillo, e.cifra]]);
    } else {
      const a = x.anillo;
      r.push([!!a && !!cm && dist(a.c, cm) <= 3 && ms.every(m => dist(a.c, m.c) + m.r <= a.r + 0.5),
        `paso ${n}: el anillo rodea el bocado`, a && [a.c.map(Math.round), a.r]]);
      const rb = x.rotBocado;
      r.push([!!rb && !!a && nb(rb.dice) === 'un bocado' && rb.caja.x0 > x.plato.c[0] + x.plato.r && Math.abs(medio(rb.caja)[1] - a.c[1]) <= 10,
        `paso ${n}: al lado del anillo dice «un bocado»`, rb && rb.dice]);
    }
    if (n === 1) r.push([e.cifra === '1' && unBocado && /bocado/.test(e.palabras), 'paso 1: el marcador cuenta el bocado que falta', [e.cifra, e.palabras]]);

    /* 2 · Lo que es igual en los dos papeles, enmarcado; y «casi»,
       subrayada. Cada marco rodea su palabra y no se monta en la de al
       lado. */
    if (n === 2) {
      const ok4 = ['recado', 'libreta'].every(rg => ['Kenia', 'comió'].every(tx => {
        const m = x.marcos.find(q => q.renglon === rg && q.de === tx);
        const lista = rg === 'recado' ? enNota : copiadas, w = palabra(lista, tx);
        return !!m && !!w && dentroDe(w.tinta, m.caja, 0.5) && entera(m.raya) &&
          !lista.some(o => o !== w && cruza(o.tinta, m.caja)) && !(x.hueco && cruza(x.hueco.caja, m.caja));
      }));
      r.push([x.marcos.length === 4 && ok4, 'paso 2: «Kenia» y «comió» enmarcados en los dos papeles, sin montarse en la palabra de al lado', x.marcos.map(q => [q.renglon, q.de])]);
    } else {
      r.push([x.marcos.length === 0, `paso ${n}: sin marcos`, x.marcos.length]);
    }
    const sub = x.subraya, casiN = palabra(enNota, 'casi');
    if (n === 2 || n === 3) {
      r.push([sub.length === 1 && !!casiN && entera(sub[0].raya) && Math.abs(sub[0].caja.x0 - casiN.caja.x0) <= 1.5 && Math.abs(sub[0].caja.x1 - casiN.caja.x1) <= 1.5 &&
        sub[0].caja.y0 >= casiN.caja.y1 - 4 && sub[0].caja.y0 <= casiN.caja.y1 + 6,
        `paso ${n}: «casi» va subrayada en el recado`, sub.map(q => q.de)]);
    } else {
      r.push([sub.length === 0, `paso ${n}: sin subrayado`, sub.length]);
    }

    /* 3 y 4 · Lo que dice cada adverbio: su pregunta, debajo de él. */
    const esperadas = n === 3 ? ['casi'] : (n === 4 ? ['casi', 'no', 'hoy'] : []);
    const pregOk = x.preguntas.length === esperadas.length && esperadas.every(tx => {
      const q = x.preguntas.find(o => o.de === tx), w = palabra(enRecado, tx);
      return !!q && !!w && nb(q.dice) === PREG[tx] && Math.abs(medio(q.caja)[0] - medio(w.caja)[0]) <= 1.5 && q.caja.y0 >= w.caja.y1 - 1 &&
        !x.palabras.some(o => cruza(o.caja, q.caja));
    }) && x.preguntas.every((q, i) => x.preguntas.every((o, j) => i === j || !cruza(q.caja, o.caja)));
    r.push([pregOk, `paso ${n}: ${esperadas.length ? 'debajo de ' + esperadas.map(tx => '«' + tx + '» ' + PREG[tx]).join(', ') : 'ninguna pregunta'}, sin encimarse`, x.preguntas.map(q => [q.de, q.dice])]);
    if (n === 3) r.push([e.cifra === PREG.casi, 'paso 3: el marcador dice lo que dice «casi»', e.cifra]);

    /* 4 · Las tiras recortadas: cada adverbio con su borde de tijera, fuera
       de la nota. Y lo que queda en la nota, contado. */
    if (n === 4) {
      r.push([x.tiras.length === 3 && ['casi', 'no', 'hoy'].every(tx => {
        const b = x.tiras.find(q => q.de === tx), w = palabra(fueraNota, tx);
        return !!b && !!w && cortada(b.raya) && dentroDe(w.tinta, b.caja, 0.5) && b.caja.y0 > x.recado.y1 && dentroDe(b.caja, x.libreta) &&
          !x.palabras.some(o => o !== w && cruza(o.tinta, b.caja));
      }), 'paso 4: cada adverbio recortado lleva su borde de tijera, fuera de la nota', x.tiras.map(q => q.de)]);
      const enPie = enNota.filter(w => nb(w.dice) !== '.');
      r.push([e.cifra === String(enPie.length) && e.palabras.includes('«' + frase(enNota) + '»') && e.texto.includes('«' + frase(enNota) + '»'),
        'paso 4: el marcador cuenta las palabras que quedan en pie, y dice cuáles', [e.cifra, e.palabras]]);
    } else {
      r.push([x.tiras.length === 0, `paso ${n}: ninguna tira recortada`, x.tiras.length]);
    }

    /* 5 · Los nombres: «sustantivo» y «verbo» con su hilo hasta su
       palabra, y los tres adverbios bajando a una misma raya de la que
       cuelga el suyo. Ninguna raya une dos palabras. */
    const rot = de => x.rotulos.find(q => q.de === de);
    const con = de => x.conectores.filter(q => q.de === de);
    const bajoDe = (p, w) => p[0] > w.caja.x0 && p[0] < w.caja.x1 && p[1] >= w.caja.y1 - 1 && p[1] <= w.caja.y1 + 6;
    const enCaja = (p, k) => p[0] >= k.x0 - 2 && p[0] <= k.x1 + 2 && p[1] >= k.y0 - 2 && p[1] <= k.y1 + 2;
    const une = (h, w, k) => !!h && !!w && !!k && ((bajoDe(h.a, w) && enCaja(h.b, k)) || (bajoDe(h.b, w) && enCaja(h.a, k)));
    if (n === 5) {
      r.push([x.rotulos.length === 3 && ['sustantivo', 'verbo', 'adverbios'].every(de => { const q = rot(de); return !!q && nb(q.dice) === de && q.caja.y0 > x.recado.y1 && dentroDe(q.caja, x.libreta); }),
        'paso 5: los tres nombres, «sustantivo», «verbo» y «adverbios», en la libreta', x.rotulos.map(q => q.dice)]);
      r.push([con('sustantivo').length === 1 && une(con('sustantivo')[0], kenia, rot('sustantivo') && rot('sustantivo').caja) &&
        con('verbo').length === 1 && une(con('verbo')[0], palabra(enNota, 'comió'), rot('verbo') && rot('verbo').caja),
        'paso 5: «sustantivo» cuelga de «Kenia» y «verbo», de «comió»', x.conectores.map(q => q.de)]);
      const ticks = con('adverbio'), ll = x.llave[0];
      const yL = ll ? ll.a[1] : NaN, xs = ticks.map(h => h.a[0]);
      const ticksOk = ticks.length === 3 && ['casi', 'no', 'hoy'].every(tx => {
        const h = ticks.find(q => q.palabra === tx), w = palabra(enNota, tx);
        return !!h && !!w && bajoDe(h.a, w) && Math.abs(h.a[0] - h.b[0]) <= 0.5 && Math.abs(h.b[1] - yL) <= 1;
      });
      r.push([ticksOk && x.llave.length === 1 && Math.abs(ll.a[1] - ll.b[1]) <= 0.5 &&
        Math.abs(Math.min(ll.a[0], ll.b[0]) - Math.min(...xs)) <= 1 && Math.abs(Math.max(ll.a[0], ll.b[0]) - Math.max(...xs)) <= 1,
        'paso 5: de «casi», «no» y «hoy» baja una raya a cada uno, hasta la misma llave', ticks.map(h => h.palabra)]);
      const tallo = con('adverbios')[0], rA = rot('adverbios');
      r.push([con('adverbios').length === 1 && !!ll && !!rA && Math.abs(tallo.a[1] - yL) <= 1 && tallo.a[0] > Math.min(ll.a[0], ll.b[0]) && tallo.a[0] < Math.max(ll.a[0], ll.b[0]) && enCaja(tallo.b, rA.caja),
        'paso 5: de la llave cuelga «adverbios»', tallo && [tallo.a.map(Math.round), tallo.b.map(Math.round)]]);
      /* Las rayas de los adverbios no atraviesan los otros dos nombres. */
      const otros = ['sustantivo', 'verbo'].map(rot).filter(Boolean);
      r.push([ticks.every(h => otros.every(q => !(h.a[0] > q.caja.x0 - 1 && h.a[0] < q.caja.x1 + 1 && Math.min(h.a[1], h.b[1]) < q.caja.y1 && Math.max(h.a[1], h.b[1]) > q.caja.y0))),
        'paso 5: las rayas de los adverbios no atraviesan «sustantivo» ni «verbo»']);
      r.push([e.cifra === String(ticks.length) && ['casi', 'no', 'hoy'].every(tx => e.texto.toLowerCase().includes('«' + tx + '»')),
        'paso 5: el marcador cuenta los adverbios que cuelgan de la llave, y la frase los nombra', [e.cifra, ticks.length]]);
    } else {
      r.push([x.rotulos.length + x.conectores.length + x.llave.length === 0, `paso ${n}: todavía sin nombres ni rayas`, [x.rotulos.length, x.conectores.length]]);
    }
    /* Ninguna raya une dos palabras del recado: a qué modifica «casi» es
       una pregunta de la prueba. */
    r.push([x.conectores.every(h => enRecado.filter(w => bajoDe(h.a, w) || bajoDe(h.b, w)).length <= 1), `paso ${n}: ninguna raya une dos palabras`]);
    return r;
  },

  /* Los Adjetivos: los sacos de doña Nely. Se mide sobre el dibujo sobre qué
     saco se posa cada etiqueta (el más cercano, y por encima de él), qué
     rodea cada aro y hasta dónde llega cada hilo; y lo que el marcador
     cuenta, a cuántos sacos les queda «saco» y a cuántos «saco grande», tiene
     que ser lo que se ve. ⚠️ La historia dice que bastaba UNA palabra, y
     cualquiera de las tres: eso solo es verdad si el saco bueno es el ÚNICO
     grande, el único con parches y el único amarrado, y se mide. Lo que le
     queda a cualquiera va con raya cortada y lo que nombra a uno solo, con
     raya entera. ⚠️ Y la prueba no se regala: no sale ninguna palabra de sus
     preguntas, ni «ese» ni «este», ni «más», «muy» o «-ísimo». */
  amSacos(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ');
    const prohibidas = dicho.match(/blanc|\besos?\b|\besas?\b|\best[ae]s?\b|nuestr|varios|segundo|perro|puente|angost|limp|muchas|flores|mochila|\bni[ñn]os?\b|alegre|cantar|monta[ñn]a|verde|nosotros|\btu\b|cuaderno|\bbuen|peque[ñn]|algun|bonit|cinco|manzana|cielo|azul|carro|\brojo|sopa|caliente|[íi]simo|ventana|abiert|amarill|content|abuela|cari[ñn]os|camisa|\bfr[íi][ao]\b|feli[zc]|\bdos\b|libros?\b|pueblo|tranquil|positivo|comparativo|superlativo|igualdad|superioridad|inferioridad|concordancia|ep[íi]teto|determinativo|calificativo|acompa[ñn]|c[óo]mo es|\bmuy\b|\bm[áa]s\b|\bmenos\b|\btan\b/gi);
    r.push([!prohibidas, `paso ${n}: no sale ninguna palabra de la prueba, ni «ese», ni un grado`, prohibidas]);
    const cortada = v => v > 0 && v < 8, entera = v => v === 0 || v > 20;
    const dentro = (p, c, t = 3) => p[0] >= c.x0 - t && p[0] <= c.x1 + t && p[1] >= c.y0 - t && p[1] <= c.y1 + t;
    const medio = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    const alto = c => c.y1 - c.y0, ancho = c => c.x1 - c.x0;

    /* Los cuatro sacos, y el bueno es el único grande, el único viejo y el
       único amarrado de lleno. */
    const sacos = x.sacos.slice().sort((a, b) => a.cuerpo.x0 - b.cuerpo.x0);
    r.push([sacos.length === 4, `paso ${n}: en el corredor hay cuatro sacos`, sacos.length]);
    if (sacos.length !== 4) return r;
    /* Grande de alto y de ancho: el saco entero, con su boca o con la manta
       recogida encima del nudo, y el cuerpo a lo ancho. */
    const grandes = sacos.filter(s => sacos.every(o => o === s || (alto(s.todo) > 1.5 * alto(o.todo) && ancho(s.cuerpo) > 1.3 * ancho(o.cuerpo))));
    const viejos = sacos.filter(s => s.parches.length > 0), llenos = sacos.filter(s => !!s.nudo);
    r.push([grandes.length === 1 && viejos.length === 1 && llenos.length === 1 && grandes[0] === viejos[0] && viejos[0] === llenos[0] &&
      sacos.filter(s => s !== grandes[0]).every(s => s.boca),
      `paso ${n}: uno solo es grande, uno solo tiene parches y uno solo va amarrado, y es el mismo; los otros tres van abiertos`,
      sacos.map(s => [Math.round(alto(s.todo)), Math.round(ancho(s.cuerpo)), s.parches.length, !!s.nudo, s.boca])]);
    if (grandes.length !== 1) return r;
    const bueno = grandes[0];
    /* Sobre qué saco está algo: el más cercano a lo ancho, a menos de 3. */
    const sobre = cx => { const s = sacos.reduce((m, q) => Math.abs(medio(q.cuerpo)[0] - cx) < Math.abs(medio(m.cuerpo)[0] - cx) ? q : m, sacos[0]); return Math.abs(medio(s.cuerpo)[0] - cx) < 3 ? s : null; };

    /* El globo, palabra por palabra, de izquierda a derecha y sin encimarse. */
    const pal = x.palabras.slice().sort((a, b) => a.caja.x0 - b.caja.x0);
    const dice = pal.map(p => nb(p.dice)).join(' ');
    r.push([dice === (n >= 2 ? 'Doña Nely: Tráeme el saco grande' : 'Doña Nely: Tráeme el saco'),
      `paso ${n}: el globo dice lo que dice doña Nely${n >= 2 ? ', con la palabra que faltaba' : ''}`, dice]);
    r.push([pal.every((p, i) => i === 0 || p.caja.x0 >= pal[i - 1].caja.x1 + 1), `paso ${n}: las palabras del globo no se enciman`, pal.map(p => [p.dice, Math.round(p.caja.x0), Math.round(p.caja.x1)])]);
    const wSaco = pal.find(p => p.palabra === 'saco'), wAdj = pal.find(p => p.palabra === 'grande');
    const bajo = (ra, w) => !!ra && !!w && ra.caja.x0 <= w.caja.x0 + 1.5 && ra.caja.x1 >= w.caja.x1 - 1.5 && ra.caja.x1 - ra.caja.x0 <= (w.caja.x1 - w.caja.x0) + 4 &&
      ra.caja.y0 >= w.caja.y1 - 4 && ra.caja.y0 <= w.caja.y1 + 6;
    const rS = x.rayas.find(q => q.de === 'saco'), rA = x.rayas.find(q => q.de === 'grande');
    if (n >= 1) r.push([bajo(rS, wSaco) && cortada(rS.raya), `paso ${n}: «saco» va subrayada con raya cortada`, rS && rS.raya]);
    else r.push([!rS, 'paso 0: todavía no se subraya nada', !!rS]);
    if (n >= 2) r.push([bajo(rA, wAdj) && entera(rA.raya), `paso ${n}: «grande» va subrayada con raya entera`, rA && rA.raya]);
    else r.push([!rA && !wAdj, `paso ${n}: todavía no está la palabra que faltaba`, [!!rA, !!wAdj]]);

    /* «saco» se posa sobre cada uno de los cuatro. */
    const etS = x.etiquetas.filter(t => t.de === 'saco'), etG = x.etiquetas.filter(t => t.de === 'grande');
    const etV = x.etiquetas.filter(t => t.de === 'viejo'), etL = x.etiquetas.filter(t => t.de === 'lleno');
    if (n === 0) {
      r.push([x.etiquetas.length + x.hilos.length + x.aros.length === 0 && e.cifra === '¿?',
        'paso 0: todavía no se prueba ninguna palabra y el marcador no cuenta nada', [x.etiquetas.length, x.hilos.length, e.cifra]]);
    } else {
      const bajoS = etS.map(t => sobre(medio(t.caja)[0]));
      r.push([etS.length === 4 && bajoS.every((s, i) => s && etS[i].caja.y1 <= s.todo.y0 + 1 && s.todo.y0 - etS[i].caja.y1 < 12) && new Set(bajoS).size === 4,
        `paso ${n}: «saco» se posa encima de cada uno de los cuatro, cada una el suyo`, bajoS.map(s => s && s.i)]);
      r.push([!!wSaco && etS.every(t => nb(t.dice) === nb(wSaco.dice) && cortada(t.raya)),
        `paso ${n}: cada etiqueta dice la palabra del globo, con raya cortada`, etS.map(t => [t.dice, t.raya])]);
      r.push([etS.every(t => t.tenue === (n >= 2)), `paso ${n}: ${n >= 2 ? 'con la palabra que faltaba, «saco» sigue en los cuatro, pero tenue' : '«saco» se ve entera en los cuatro'}`, etS.map(t => t.tenue)]);
    }
    if (n === 1) r.push([e.cifra === String(etS.length) && e.cifra === '4' && /cuatro/.test(e.texto),
      'paso 1: el marcador cuenta las etiquetas que se ven: 4, y la frase dice cuatro', [e.cifra, etS.length]]);

    /* «grande», sobre uno solo, encima de su «saco». */
    const suSaco = etS.find(t => sobre(medio(t.caja)[0]) === bueno);
    if (n >= 2) {
      const g = etG[0], s = g && sobre(medio(g.caja)[0]);
      r.push([etG.length === 1 && s === bueno && !!suSaco && g.caja.y1 <= suSaco.caja.y0 + 1 && suSaco.caja.y0 - g.caja.y1 < 10,
        `paso ${n}: «grande» se posa sobre uno solo, el grande, encima de su «saco»`, s && s.i]);
      r.push([etG.length === 1 && !!wAdj && nb(g.dice) === nb(wAdj.dice) && entera(g.raya) && !g.tenue,
        `paso ${n}: la etiqueta dice la palabra del globo, con raya entera`, g && [g.dice, g.raya]]);
    } else {
      r.push([etG.length === 0, `paso ${n}: todavía no hay etiqueta «grande»`, etG.length]);
    }
    if (n === 2) r.push([e.cifra === String(etG.length) && e.cifra === '1' && /grande/.test(e.palabras), 'paso 2: el marcador cuenta la etiqueta «grande»: 1', [e.cifra, e.palabras]]);

    /* «viejo» y «lleno», cada una con su hilo hasta lo que la hace verdad. */
    if (n === 3 || n === 4) {
      const hV = x.hilos.find(h => h.de === 'viejo'), hL = x.hilos.find(h => h.de === 'lleno');
      const aV = x.aros.find(a => a.de === 'viejo'), aL = x.aros.find(a => a.de === 'lleno');
      r.push([etV.length === 1 && etL.length === 1 && nb(etV[0].dice) === 'viejo' && nb(etL[0].dice) === 'lleno' && entera(etV[0].raya) && entera(etL[0].raya),
        `paso ${n}: «viejo» y «lleno», con raya entera`, [etV.length, etL.length]]);
      const enBorde = (h, a) => !!h && !!a && Math.abs(Math.hypot(h.b[0] - a.c[0], h.b[1] - a.c[1]) - a.r) < 1.5;
      r.push([!!hV && !!aV && etV.length === 1 && dentro(hV.a, etV[0].caja, 3) && enBorde(hV, aV) && entera(aV.raya) &&
        bueno.parches.some(p => dentro(aV.c, p, 2)),
        `paso ${n}: el hilo de «viejo» sale de su etiqueta y acaba en un aro alrededor de un parche del saco grande`, hV && [hV.a.map(Math.round), hV.b.map(Math.round)]]);
      r.push([!!hL && !!aL && etL.length === 1 && dentro(hL.a, etL[0].caja, 3) && enBorde(hL, aL) && entera(aL.raya) &&
        !!bueno.nudo && dentro(aL.c, bueno.nudo, 2),
        `paso ${n}: el hilo de «lleno» sale de su etiqueta y acaba en un aro alrededor del nudo del saco grande`, hL && [hL.a.map(Math.round), hL.b.map(Math.round)]]);
      /* Las tres en fila, sin encimarse, y ninguna tapa el «saco» del bueno. */
      const fila = [etV[0], etG[0], etL[0]].filter(Boolean).sort((a, b) => a.caja.x0 - b.caja.x0);
      r.push([fila.length === 3 && fila.every((t, i) => i === 0 || t.caja.x0 >= fila[i - 1].caja.x1 + 2) && !!suSaco && fila.every(t => t.caja.y1 <= suSaco.caja.y0 + 1),
        `paso ${n}: las tres palabras van en fila, sin encimarse, encima del «saco» del grande`, fila.map(t => [t.dice, Math.round(t.caja.x0), Math.round(t.caja.x1)])]);
    } else {
      r.push([etV.length + etL.length + x.hilos.length + x.aros.length === 0, `paso ${n}: no hay «viejo» ni «lleno», ni sus hilos`, [etV.length, etL.length, x.hilos.length, x.aros.length]]);
    }
    if (n === 3) r.push([e.cifra === String(etG.length + etV.length + etL.length) && e.cifra === '3' && /cualquiera/.test(e.palabras),
      'paso 3: el marcador cuenta las palabras que bastaban: 3', [e.cifra, e.palabras]]);

    /* Qué es cada una, con su hilo hasta su palabra del globo. */
    if (n >= 4) {
      const rs = x.rotulos.find(t => t.de === 'sustantivo'), ra = x.rotulos.find(t => t.de === 'adjetivo');
      r.push([x.rotulos.length === 2 && !!rs && !!ra && nb(rs.dice) === 'sustantivo' && nb(ra.dice) === 'adjetivo',
        `paso ${n}: los dos rótulos, «sustantivo» y «adjetivo»`, x.rotulos.map(t => t.dice)]);
      const cs = x.conectores.find(h => h.de === 'sustantivo'), ca = x.conectores.find(h => h.de === 'adjetivo');
      r.push([x.conectores.length === 2 && !!cs && !!ca && !!rs && !!ra && !!wSaco && !!wAdj &&
        dentro(cs.a, wSaco.caja, 8) && dentro(cs.b, rs.caja, 3) && dentro(ca.a, wAdj.caja, 8) && dentro(ca.b, ra.caja, 3),
        `paso ${n}: «sustantivo» tiene su hilo hasta «saco», y «adjetivo» hasta «grande»`, x.conectores.map(h => [h.de, h.a.map(Math.round), h.b.map(Math.round)])]);
    } else {
      r.push([x.rotulos.length === 0 && x.conectores.length === 0, `paso ${n}: todavía no hay rótulos`, [x.rotulos.length, x.conectores.length]]);
    }
    if (n === 4) r.push([e.cifra === String(x.rotulos.length) && e.cifra === '2', 'paso 4: el marcador cuenta los rótulos: 2', e.cifra]);

    /* Marvin: a la entrada del corredor, y al final, junto al grande. */
    const mv = x.marvin;
    if (n === 5) {
      r.push([!!mv && Math.abs(mv.caja.x1 - bueno.cuerpo.x0) <= 3 && mv.c[0] > medio(sacos[1].cuerpo)[0] && mv.caja.y1 <= bueno.cuerpo.y1 + 1,
        'paso 5: Marvin va derecho al saco grande', mv && [Math.round(mv.caja.x1), Math.round(bueno.cuerpo.x0)]]);
      r.push([e.cifra === '1' && nb(e.palabras) === 'viaje, y no tres', 'paso 5: el marcador dice un viaje, y no tres', [e.cifra, e.palabras]]);
    } else {
      r.push([!!mv && mv.caja.x1 < sacos[0].cuerpo.x0, `paso ${n}: Marvin espera a la entrada del corredor`, mv && Math.round(mv.caja.x1)]);
    }
    return r;
  },

  /* Los Sustantivos: la constancia de Kenia. Se mide sobre el dibujo sobre
     quién se posa cada etiqueta (la cabeza más cercana, y por encima de
     ella), alrededor de quién está cada aro, qué dice la libreta y qué dicen
     los rótulos; y lo que el marcador cuenta, cuántas niñas nombra «niña» y a
     cuántas «Kenia Ramírez», tiene que ser lo que se ve. Lo que le queda a
     cualquiera va con raya cortada y lo que nombra a una sola, con raya
     entera, y eso también se mide. ⚠️ Y la prueba no se regala: no sale
     ninguna palabra de sus preguntas, ni la que va en la raya de «como
     Carlos, empiezan con letra ___», ni «niño», que es el intruso de su
     pensamiento crítico. */
  amConstancia(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    /* Lo que no depende del dibujo, primero: con una pieza mal puesta la
       sonda deja de medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].concat(x.textos).map(nb).join(' | ');
    const prohibidas = dicho.match(/Honduras|Cop[aá]n|Tegucigalpa|Lempira|Ul[uú]a|Comayagua|cerro|ciudad|perro|\bmesa\b|monta[ñn]a|Carlos|Mar[ií]a|Pedro|may[uú]scula|\bniños?\b|art[íi]culo|g[ée]nero|n[úu]mero|singular|plural|femenin|masculin/gi);
    r.push([!prohibidas, `paso ${n}: no sale ninguna palabra de la prueba, ni «mayúscula», ni «niño»`, prohibidas]);
    const cortada = v => v > 0 && v < 8, entera = v => v === 0 || v > 20;
    const dentro = (p, c, t = 3) => p[0] >= c.x0 - t && p[0] <= c.x1 + t && p[1] >= c.y0 - t && p[1] <= c.y1 + t;
    const kids = x.alumnos;
    const ninas = kids.filter(k => k.es === 'nina'), ninos = kids.filter(k => k.es === 'nino');
    const kenia = kids.filter(k => k.nombre === 'Kenia Ramírez');
    r.push([kids.length === 7 && ninas.length === 5 && ninos.length === 2 && kenia.length === 1 && kenia[0].es === 'nina',
      `paso ${n}: la clase de primero, con cinco niñas y dos niños, y una de ellas se llama Kenia Ramírez`, [ninas.length, ninos.length, kenia.length]]);
    if (kids.length !== 7 || kenia.length !== 1) return r;
    const k0 = kenia[0];
    /* Sobre quién está algo: la cabeza más cercana, a menos de 3 de lado. */
    const sobre = cx => { const k = kids.reduce((m, q) => Math.abs(q.c[0] - cx) < Math.abs(m.c[0] - cx) ? q : m, kids[0]); return Math.abs(k.c[0] - cx) < 3 ? k : null; };
    const medio = c => [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
    /* La libreta, renglón por renglón, de izquierda a derecha. */
    const renglon = k => x.renglones.filter(t => t.r === k).sort((a, b) => a.caja.x0 - b.caja.x0).map(t => nb(t.dice)).join(' ');
    r.push([renglon(1) === 'Constancia para: la niña de primero', `paso ${n}: la libreta dice «la niña de primero»`, renglon(1)]);
    const r2 = renglon(2);
    if (n >= 2) r.push([r2 === 'Kenia Ramírez' && /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+ [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+$/.test(r2), `paso ${n}: su nombre está en la libreta, como se escribe un nombre`, r2]);
    else r.push([r2 === '', `paso ${n}: todavía no está su nombre en la libreta`, r2]);
    const wNina = x.renglones.find(t => t.palabra === 'nina'), wKenia = x.renglones.find(t => t.palabra === 'kenia');
    const etN = x.etiquetas.filter(t => t.de === 'nina'), etK = x.etiquetas.filter(t => t.de === 'kenia');
    const arN = x.aros.filter(a => a.de === 'nina'), arK = x.aros.filter(a => a.de === 'kenia');
    if (n === 0) {
      r.push([etN.length + etK.length + x.aros.length + x.cajas.length === 0 && e.cifra === '¿?',
        'paso 0: todavía no se prueba ninguna palabra y el marcador no cuenta nada', [etN.length, etK.length, x.aros.length, x.cajas.length, e.cifra]]);
    } else {
      /* «Niña» se posa sobre cada una de las cinco niñas, y sobre ningún niño. */
      const bajo = etN.map(t => sobre(medio(t.caja)[0]));
      r.push([etN.length === 5 && bajo.every((k, i) => k && k.es === 'nina' && etN[i].caja.y1 < k.c[1] - 9) && new Set(bajo.map(k => k && k.i)).size === 5,
        `paso ${n}: «niña» se posa encima de cada una de las cinco niñas, y de ningún niño`, bajo.map(k => k && k.es)]);
      r.push([!!wNina && etN.every(t => nb(t.dice) === nb(wNina.dice) && cortada(t.raya)),
        `paso ${n}: cada etiqueta dice la palabra de la libreta, con raya cortada`, etN.map(t => [t.dice, t.raya])]);
      const conAro = arN.map(a => sobre(a.c[0]));
      r.push([arN.length === 5 && conAro.every((k, i) => k && k.es === 'nina' && Math.abs(arN[i].c[1] - k.c[1]) < 1 && cortada(arN[i].raya)) && new Set(conAro.map(k => k && k.i)).size === 5,
        `paso ${n}: cada niña a la que le queda «niña» lleva su aro, con raya cortada`, conAro.map(k => k && k.es)]);
      const cN = x.cajas.find(c => c.de === 'nina');
      r.push([!!cN && !!wNina && cortada(cN.raya) && dentro([wNina.caja.x0, wNina.caja.y0], cN.caja, 0) && dentro([wNina.caja.x1, wNina.caja.y1], cN.caja, 0),
        `paso ${n}: en la libreta, «niña» va dentro de su recuadro de raya cortada`, cN && cN.raya]);
    }
    if (n === 1) r.push([e.cifra === String(etN.length) && e.cifra === '5' && /cinco/.test(e.texto) && !etN.some(t => t.tenue),
      'paso 1: el marcador cuenta las etiquetas que se ven: 5, y la frase dice cinco', [e.cifra, etN.length]]);
    if (n >= 2) {
      const k = etK.length === 1 ? sobre(medio(etK[0].caja)[0]) : null;
      const suNina = etN.find(t => sobre(medio(t.caja)[0]) === k0);
      r.push([etK.length === 1 && k === k0 && !!suNina && etK[0].caja.y1 <= suNina.caja.y0 + 1,
        `paso ${n}: «Kenia Ramírez» se posa sobre una sola, la que se llama así, y encima de su «niña»`, k && k.i]);
      r.push([etK.length === 1 && nb(etK[0].dice) === r2 && entera(etK[0].raya), `paso ${n}: la etiqueta dice lo que dice la libreta, con raya entera`, etK[0] && [etK[0].dice, etK[0].raya]]);
      r.push([arK.length === 1 && sobre(arK[0].c[0]) === k0 && Math.abs(arK[0].c[1] - k0.c[1]) < 1 && entera(arK[0].raya),
        `paso ${n}: su aro va entero y alrededor de ella`, arK.map(a => a.raya)]);
      r.push([etN.length === 5 && etN.every(t => t.tenue) && arN.every(a => a.tenue) && !etK[0].tenue,
        `paso ${n}: lo que le queda a cualquiera sigue ahí, pero tenue`, etN.map(t => t.tenue)]);
      const cK = x.cajas.find(c => c.de === 'kenia');
      r.push([!!cK && !!wKenia && entera(cK.raya) && dentro([wKenia.caja.x0, wKenia.caja.y0], cK.caja, 0) && dentro([wKenia.caja.x1, wKenia.caja.y1], cK.caja, 0),
        `paso ${n}: en la libreta, su nombre va dentro de su recuadro de raya entera`, cK && cK.raya]);
    } else {
      r.push([etK.length === 0 && arK.length === 0, `paso ${n}: todavía no hay etiqueta ni aro del nombre`, [etK.length, arK.length]]);
    }
    if (n === 2) r.push([e.cifra === String(etK.length) && e.cifra === '1', 'paso 2: el marcador cuenta la etiqueta del nombre: 1', e.cifra]);
    if (n >= 3) {
      const rc = x.rotulos.find(t => t.de === 'comun'), rp = x.rotulos.find(t => t.de === 'propio');
      r.push([x.rotulos.length === 2 && !!rc && !!rp && nb(rc.dice) === 'sustantivo común' && nb(rp.dice) === 'sustantivos propios',
        `paso ${n}: los dos rótulos, «sustantivo común» y «sustantivos propios» (el nombre y el apellido son dos)`, x.rotulos.map(t => t.dice)]);
      const hc = x.hilos.find(h => h.de === 'comun'), hp = x.hilos.find(h => h.de === 'propio');
      r.push([x.hilos.length === 2 && !!hc && !!hp && !!rc && !!rp && !!wNina && !!wKenia &&
        dentro(hc.a, wNina.caja, 8) && dentro(hc.b, rc.caja, 3) && dentro(hp.a, wKenia.caja, 8) && dentro(hp.b, rp.caja, 3),
        `paso ${n}: cada rótulo tiene su hilo hasta su palabra de la libreta`, x.hilos.map(h => [h.de, h.a.map(Math.round), h.b.map(Math.round)])]);
    } else {
      r.push([x.rotulos.length === 0 && x.hilos.length === 0, `paso ${n}: todavía no hay rótulos`, [x.rotulos.length, x.hilos.length]]);
    }
    if (n === 3) r.push([e.cifra === String(x.rotulos.length) && e.cifra === '2', 'paso 3: el marcador cuenta los rótulos: 2', e.cifra]);
    if (n === 4) r.push([x.sello.length === 1 && nb(x.sello[0]) === 'ENTREGADA' && e.cifra === '✓' && /Kenia Ramírez/.test(e.palabras),
      'paso 4: la constancia sale: el sello, y el marcador dice para quién', [x.sello, e.cifra, e.palabras]]);
    else r.push([x.sello.length === 0, `paso ${n}: todavía no hay sello`, x.sello]);
    return r;
  },

  /* Sólidos Geométricos: el molde de la caja de Kenia. Del molde se mide
     que la tira de los lados sea una tira (misma altura, pegados uno al
     otro, los lados opuestos iguales) y dónde está pegada cada tapa: a qué
     lado y si arriba o abajo, borde con borde. De ahí sale lo que la caja
     tiene que mostrar, y se compara con lo que muestra: qué boca cierra,
     si queda hueco, si una tapa sobra y cuelga, y cuántas bocas dice el
     marcador. ⚠️ Y ni el «Predice» ni la prueba se regalan: aquí no se
     cuentan caras, aristas ni vértices, no se nombra el cuerpo, no hay dado,
     cubo ni nada que gire, y no se habla de la lata ni de su etiqueta, que es
     el molde que el «Predice» pide imaginar. */
  amMolde(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    /* Ni el «Predice» ni la prueba: no se cuenta ni se nombra. Va primero,
       porque no depende del dibujo: con una pieza mal puesta la sonda deja de
       medir, y esto no puede quedarse sin mirar por eso. */
    const dicho = [e.texto, e.cifra, e.palabras].map(nb).join(' | ');
    const numsDichos = (dicho.match(/\d+/g) || []).map(Number);
    r.push([![6, 8, 12].some(v => numsDichos.includes(v)) && !/seis|ocho|doce|dado|cubo|cono|gir[ao]|prisma|arista|v[ée]rtice|lata|etiqueta|cilindro|rect[áa]ngulo/i.test(dicho),
      `paso ${n}: no cuenta caras, aristas ni vértices, no nombra el cuerpo y no sale nada del Predice`, numsDichos]);
    const cerca = (a, b, t = 0.6) => Math.abs(a - b) <= t;
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const caja = p => { const xs = p.map(q => q[0]), ys = p.map(q => q[1]); return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) }; };
    const pz = Object.fromEntries(x.piezas.map(p => [p.nombre, Object.assign(caja(p.p), { movida: p.movida })]));
    const tira = ['izquierdo', 'frente', 'derecho', 'atras'].map(k => pz[k]);
    r.push([tira.every(Boolean) && !!pz['tapa-fija'] && !!pz['tapa-movil'], `paso ${n}: el molde tiene su tira de lados y sus dos tapas`, Object.keys(pz)]);
    if (!tira.every(Boolean) || !pz['tapa-fija'] || !pz['tapa-movil']) return r;
    const [izq, fre, der, atr] = tira;
    r.push([tira.every(p => cerca(p.y0, izq.y0) && cerca(p.y1, izq.y1)) && cerca(izq.x1, fre.x0) && cerca(fre.x1, der.x0) && cerca(der.x1, atr.x0) &&
      cerca(izq.w, der.w) && cerca(fre.w, atr.w),
      `paso ${n}: los lados van en tira, pegados, con los opuestos iguales`, tira.map(p => [p.x0.toFixed(1), p.w.toFixed(1)])]);

    /* Dónde está pegada cada tapa: borde con borde, a lo ancho entero de un
       lado, por arriba o por abajo. Y cada tapa mide lo que la cara de arriba
       de la caja: el largo del frente por el ancho de un costado. */
    const pegada = t => {
      for (const [nom, p] of [['izquierdo', izq], ['frente', fre], ['derecho', der], ['atras', atr]]) {
        if (!cerca(t.x0, p.x0) || !cerca(t.x1, p.x1)) continue;
        if (cerca(t.y1, p.y0)) return { lado: nom, donde: 'arriba' };
        if (cerca(t.y0, p.y1)) return { lado: nom, donde: 'abajo' };
      }
      return null;
    };
    const tapas = [pz['tapa-fija'], pz['tapa-movil']];
    const pegadas = tapas.map(pegada);
    const medida = t => { const m = [t.w, t.h].sort((a, b) => a - b), c = [fre.w, izq.w].sort((a, b) => a - b); return cerca(m[0], c[0]) && cerca(m[1], c[1]); };
    r.push([pegadas.every(Boolean) && tapas.every(medida), `paso ${n}: cada tapa va pegada borde con borde a un lado, y mide lo que la cara de arriba`, pegadas]);
    if (!pegadas.every(Boolean)) return r;
    const arriba = pegadas.filter(p => p.donde === 'arriba').length, abajo = pegadas.filter(p => p.donde === 'abajo').length;
    /* La historia: las dos abajo hasta el paso 2; después, una en cada boca. */
    r.push([n <= 2 ? abajo === 2 && arriba === 0 : abajo === 1 && arriba === 1,
      `paso ${n}: ${n <= 2 ? 'las dos tapas van abajo, como las pegó Kenia' : 'una tapa arriba y otra abajo'}`, [arriba, abajo]]);

    /* La caja. */
    const cf = Object.fromEntries(x.caras.map(c => [c.nombre, c]));
    const cifra = nb(e.cifra);
    if (n === 0) {
      r.push([!x.caras.length && cifra === '¿?', 'paso 0: todavía no hay caja: solo el molde sobre la mesa', [x.caras.length, cifra]]);
    } else {
      const f = cf.frente && caja(cf.frente.p), d = cf.derecho && cf.derecho.p;
      r.push([!!f && !!d && cerca(f.w / f.h, fre.w / izq.h, 0.02) && dist(d[0], [f.x1, f.y1]) < 0.8,
        `paso ${n}: el frente de la caja tiene la forma del frente del molde, y el costado sale de su esquina`, f && [(f.w / f.h).toFixed(3), (fre.w / izq.h).toFixed(3)]]);
      if (!f || !d) return r;
      const dv = [d[1][0] - d[0][0], d[1][1] - d[0][1]];
      /* Con las tapas sin doblar la caja tiene sus dos bocas abiertas; con las
         tapas dobladas, lo que muestra sale de dónde están pegadas. */
      const dobladas = n >= 2;
      const conTapa = dobladas && arriba >= 1, sobran = dobladas ? Math.max(0, abajo - 1) + Math.max(0, arriba - 1) : 0;
      const bocas = dobladas ? (arriba === 0 ? 1 : 0) + (abajo === 0 ? 1 : 0) : 2;
      r.push([!!cf.hueco === !conTapa && !!cf['tapa-arriba'] === conTapa && !!cf['tapa-cuelga'] === (sobran > 0),
        `paso ${n}: la caja muestra lo que sale del molde: ${conTapa ? 'tapada arriba' : 'hueco arriba'}${sobran ? ', y una tapa que sobra' : ''}`,
        { hueco: !!cf.hueco, tapa: !!cf['tapa-arriba'], cuelga: !!cf['tapa-cuelga'] }]);
      const top = cf.hueco || cf['tapa-arriba'];
      if (top) r.push([dist(top.p[0], [f.x0, f.y0]) < 0.8 && dist(top.p[1], [f.x1, f.y0]) < 0.8 && dist([top.p[2][0] - top.p[1][0], top.p[2][1] - top.p[1][1]], dv) < 0.8,
        `paso ${n}: lo de arriba cubre justo la boca de la caja`, null]);
      if (cf['tapa-cuelga']) {
        /* La que sobra cuelga del borde de abajo del costado, con su lado largo
           hacia abajo: mide lo que el frente de largo. */
        const c = cf['tapa-cuelga'].p;
        r.push([dist(c[0], d[0]) < 0.8 && dist(c[1], d[1]) < 0.8 && cerca(c[3][1] - c[0][1], f.w, 0.8) && cerca(c[3][0], c[0][0]),
          `paso ${n}: la tapa que sobra cuelga del borde de abajo del costado, con el largo del frente`, null]);
      }
      /* La tapa que se cambia de lugar lleva su marca en los dos dibujos. */
      const suya = cf['tapa-cuelga'] || cf['tapa-arriba'];
      if (suya && dobladas) r.push([pz['tapa-movil'].movida && suya.movida, `paso ${n}: la tapa que se cambia va marcada en el molde y en la caja`, null]);
      r.push([cifra === `${bocas} boca${bocas === 1 ? '' : 's'}`, `paso ${n}: el marcador dice ${cifra} y la caja tiene ${bocas} ${bocas === 1 ? 'abierta' : 'abiertas'}`, [cifra, bocas]]);
      /* Los rótulos: «hueco» si hay hueco, encima de él; «sobra» junto a la que sobra. */
      const dH = x.dice.find(t => t.que === 'hueco'), dS = x.dice.find(t => t.que === 'sobra');
      const topC = top ? [top.p.reduce((s, q) => s + q[0], 0) / 4, Math.min(...top.p.map(q => q[1]))] : null;
      r.push([!!dH === !!cf.hueco && (!dH || (nb(dH.dice) === 'hueco' && Math.abs(dH.c[0] - topC[0]) < 12 && dH.c[1] < topC[1])),
        `paso ${n}: «hueco» solo si hay hueco, y encima de él`, dH && dH.c]);
      const cuC = cf['tapa-cuelga'] ? [cf['tapa-cuelga'].p.reduce((s, q) => s + q[0], 0) / 4, cf['tapa-cuelga'].p.reduce((s, q) => s + q[1], 0) / 4] : null;
      r.push([!!dS === !!cf['tapa-cuelga'] && (!dS || (nb(dS.dice) === 'sobra' && dist(dS.c, cuC) < 36)),
        `paso ${n}: «sobra» solo si una tapa sobra, y junto a ella`, dS && dS.c]);
    }

    return r;
  },
  /* Volumen de Cuerpos: el tanque de mil litros. Las tres aristas del
     tanque dan la regla: cuánto se corre el dibujo por cada cubito a lo
     largo, hacia arriba y hacia el fondo. Con ella se mide cada bloque, que
     esté donde dice y que mida los cubitos que dice; después se cuentan los
     cubitos que se ven, uno por uno y sin repetir ninguno, y se comparan con
     el marcador (cada cubito es un litro) y con el rótulo de cada capa.
     ⚠️ Y lo que va debajo no se regala: el «Predice» pregunta la caja de
     4 × 3 × 2, cuántos cubitos de 1 cm le cabrían a este mismo tanque y qué
     le pasa al volumen si se duplica la arista. De eso aquí no sale ni un
     número, ni el millón, ni cubitos de 1 cm: la animación cuenta litros, y
     bajar al centímetro lo hace el alumno. */
  amTanque(e, n) {
    const x = e.extra, r = [], N = 10;
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const ar = Object.fromEntries(x.aristas.map(a => [a.nombre, a]));
    const O = ar.largo && ar.largo.a;
    r.push([!!(ar.largo && ar.alto && ar.ancho) && dist(ar.alto.a, O) < 0.5 && dist(ar.ancho.a, ar.largo.b) < 0.5,
      `paso ${n}: las tres aristas del tanque salen de sus esquinas`, Object.keys(ar)]);
    if (!ar.largo || !ar.alto || !ar.ancho) return r;
    const paso = (a, b) => [(b[0] - a[0]) / N, (b[1] - a[1]) / N];
    const ex = paso(ar.largo.a, ar.largo.b), ey = paso(ar.alto.a, ar.alto.b), ez = paso(ar.ancho.a, ar.ancho.b);
    const P = (i, j, k) => [O[0] + i * ex[0] + j * ey[0] + k * ez[0], O[1] + i * ex[1] + j * ey[1] + k * ez[1]];
    /* El frente del tanque es un cuadrado: lo largo y lo alto miden lo mismo
       en el dibujo. El ancho va en diagonal, que es como se dibuja lo hondo. */
    const largo = Math.hypot(...ex) * N, alto = Math.hypot(...ey) * N;
    r.push([Math.abs(largo - alto) < 0.5 && Math.abs(ex[1]) < 0.01 && Math.abs(ey[0]) < 0.01 && ez[0] > 0 && ez[1] < 0,
      `paso ${n}: el frente del tanque es un cuadrado y lo hondo va en diagonal`, [largo.toFixed(1), alto.toFixed(1)]]);
    /* Cada arista lleva su «1 m» al lado. */
    const metros = x.rotulos.filter(t => /tq-metro/.test(t.clase));
    const conMetro = ['largo', 'alto', 'ancho'].every(nom => {
      const a = ar[nom], m = [(a.a[0] + a.b[0]) / 2, (a.a[1] + a.b[1]) / 2];
      return metros.some(t => t.arista === nom && nb(t.dice) === '1 m' && dist(t.c, m) < 22);
    });
    r.push([conMetro, `paso ${n}: cada arista del tanque dice «1 m»`, metros.map(t => t.dice)]);

    /* Los bloques: cada uno donde dice, del tamaño que dice, cara por cara. */
    const cerca = (a, b) => dist(a, b) < 0.6;
    const mal = x.bloques.filter(b => {
      const f = [P(b.x, b.y, b.z), P(b.x + b.l, b.y, b.z), P(b.x + b.l, b.y + b.h, b.z), P(b.x, b.y + b.h, b.z)];
      const t = [P(b.x, b.y + b.h, b.z), P(b.x + b.l, b.y + b.h, b.z), P(b.x + b.l, b.y + b.h, b.z + b.p), P(b.x, b.y + b.h, b.z + b.p)];
      const s = [P(b.x + b.l, b.y, b.z), P(b.x + b.l, b.y, b.z + b.p), P(b.x + b.l, b.y + b.h, b.z + b.p), P(b.x + b.l, b.y + b.h, b.z)];
      return ![[f, b.frente], [t, b.arriba], [s, b.lado]].every(([esp, real]) => real.length === 4 && esp.every((q, i) => cerca(q, real[i])));
    });
    r.push([!mal.length, `paso ${n}: cada bloque está donde dice y mide los cubitos que dice`, mal.slice(0, 2).map(b => [b.x, b.y, b.z, b.l, b.h, b.p])]);

    /* Los cubitos que se ven, uno por uno: ninguno repetido, todos dentro. */
    const vistos = new Set();
    let repetidos = 0, fuera = 0;
    x.bloques.forEach(b => {
      for (let i = b.x; i < b.x + b.l; i++) for (let j = b.y; j < b.y + b.h; j++) for (let k = b.z; k < b.z + b.p; k++) {
        const c = i + ',' + j + ',' + k;
        if (vistos.has(c)) repetidos++;
        if (i < 0 || j < 0 || k < 0 || i >= N || j >= N || k >= N) fuera++;
        vistos.add(c);
      }
    });
    const cubitos = [...vistos].map(c => c.split(',').map(Number));
    const total = cubitos.length;
    r.push([!repetidos && !fuera, `paso ${n}: ningún cubito se cuenta dos veces ni cae fuera del tanque`, [repetidos, fuera]]);
    r.push([total === [0, 1, 10, 100, 1000, 1000][n], `paso ${n}: se ven ${total} cubitos`, total]);
    if (n === 1) r.push([vistos.has('0,0,0'), 'paso 1: el cubito está en la esquina del tanque', [...vistos]]);
    if (n === 2) r.push([cubitos.every(([i, j, k]) => j === 0 && k === 0), 'paso 2: los 10 van en fila, a lo largo del frente', null]);
    if (n === 3) r.push([cubitos.every(([i, j, k]) => j === 0), 'paso 3: los 100 cubren el fondo, y nada más', null]);

    /* Un cubito, un litro: el marcador dice lo que se ve. */
    const cifra = nb(e.cifra);
    if (n === 0) r.push([cifra === '¿?' && x.agua.length === 3 && x.agua.every(o => o >= 0.4) && !x.muestra,
      'paso 0: el tanque lleno, sin contar nada', [cifra, x.agua]]);
    else {
      const litros = Number(cifra.replace(/[^0-9]/g, ''));
      r.push([/ L$/.test(cifra) && litros === total && x.agua.every(o => o <= 0.2),
        `paso ${n}: el marcador dice ${cifra} y se ven ${total} cubitos de un litro`, [cifra, total]]);
      /* El litro de muestra: el mismo cubito, más grande, con «1 litro» y
         «10 cm». Que sea el mismo se mide: sus tres caras crecen igual. */
      const m = x.muestra;
      const s = m ? (m.frente[1][0] - m.frente[0][0]) / ex[0] : 0;
      const igual = !!m && s > 1.5 && Math.abs((m.frente[0][1] - m.frente[3][1]) / -ey[1] - s) < 0.05 &&
        Math.abs((m.arriba[3][0] - m.arriba[0][0]) / ez[0] - s) < 0.05 && Math.abs((m.arriba[3][1] - m.arriba[0][1]) / ez[1] - s) < 0.05;
      const litro = x.rotulos.some(t => /tq-litro/.test(t.clase) && nb(t.dice) === '1 litro');
      const diez = x.rotulos.some(t => /tq-diez/.test(t.clase) && nb(t.dice) === '10 cm');
      r.push([igual && litro && diez, `paso ${n}: el litro de muestra es un cubito igual, más grande, con «1 litro» y «10 cm»`, [s && s.toFixed(2), litro, diez]]);
    }

    /* Los 100 litros del conserje: el fondo va de otro color en los pasos 3
       y 4, que es cuando se compara con lo demás, y en ningún otro. */
    const deColor = n === 3 || n === 4;
    r.push([x.bloques.every(b => b.contado === (deColor && b.y === 0)),
      `paso ${n}: el fondo ${deColor ? 'va de otro color, y nada más' : 'no va de otro color'}`, x.bloques.filter(b => b.contado).length]);

    /* Al lado de cada capa llena, lo que se lleva contado hasta ella. */
    const llenas = [];
    for (let j = 0; j < N; j++) if (cubitos.filter(c => c[1] === j).length === N * N) llenas.push(j);
    const cuentas = x.rotulos.filter(t => /tq-cuenta/.test(t.clase));
    const rotMal = cuentas.filter(t => {
      const k = +t.capa, hasta = cubitos.filter(c => c[1] <= k).length, junto = P(N, k + 0.5, N);
      return !llenas.includes(k) || nb(t.dice) !== hasta.toLocaleString('en-US') + ' L' || Math.abs(t.c[1] - junto[1]) > 3 || t.c[0] < junto[0];
    });
    const sinRotulo = llenas.filter(j => !cuentas.some(t => +t.capa === j));
    r.push([!rotMal.length && !sinRotulo.length, `paso ${n}: al lado de cada capa llena, lo que se lleva contado`, [rotMal.map(t => t.dice), sinRotulo]]);

    /* Las tres aristas se marcan al final, y la cuenta entera se dice. */
    const trazadas = x.aristas.filter(a => a.trazada).map(a => a.nombre).sort().join(',');
    r.push([trazadas === (n === 5 ? 'alto,ancho,largo' : ''), `paso ${n}: las tres aristas se marcan solo al final`, trazadas]);
    if (n === 5) r.push([nb(e.texto).includes('10 × 10 × 10 = 1,000') && nb(e.palabras) === '10 × 10 × 10 cubitos',
      'paso 5: la frase y el marcador dicen la cuenta entera', nb(e.palabras)]);

    /* Lo que va debajo no se regala. */
    const dicho = [e.texto, e.cifra, e.palabras].map(nb).join(' | ');
    const numsDichos = (dicho.match(/\d+/g) || []).map(Number);
    r.push([![2, 3, 4, 8, 12, 24].some(v => numsDichos.includes(v)) && !/doble|duplic|ocho|cuatro|veces mayor/i.test(dicho),
      `paso ${n}: no sale un número del Predice ni se habla de duplicar la arista`, numsDichos]);
    r.push([!/1,000,000|mill[oó]n|100 × 100|(^|[^\d,])1 cm\b/i.test(dicho),
      `paso ${n}: no dice cuántos cubitos de 1 cm caben, que es lo que pregunta el Predice`, dicho]);
    return r;
  },
  /* Área de Polígonos Regulares: la tapa de hexágono. La escala sale del
     rótulo del lado del hexágono (30 cm); con ella se mide cada tapa y cada
     pedazo: que el hexágono sea regular, que sus 6 pedazos y los 4 del
     triángulo sean triángulos de 30 cm por lado que llenan su tapa, que las
     dos orillas midan lo mismo y que el triángulo que se pasa caiga justo
     encima del de en medio. ⚠️ Y lo que va debajo no se regala: el «Predice»
     pregunta el área de un pentágono con la apotema y si la fórmula usa el
     lado o la apotema; aquí no se dice «apotema» ni se divide entre 2. */
  amTapa(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cerca = (a, b, t = 0.3) => Math.abs(a - b) <= t;
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const lados = p => p.map((q, i) => dist(q, p[(i + 1) % p.length]));
    const area = p => Math.abs(p.reduce((s, q, i) => { const w = p[(i + 1) % p.length]; return s + q[0] * w[1] - w[0] * q[1]; }, 0)) / 2;
    const centro = p => [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length];
    const h = x.hex;
    r.push([!!h, `paso ${n}: la tapa de hexágono está`, !!h]);
    if (!h) return r;
    /* La escala: el rótulo de su lado de abajo dice cuántos centímetros son. */
    const rotHex = x.medidas.find(m => Math.abs(m.c[0] - centro(h.vertices)[0]) < 20);
    const cmHex = rotHex ? parseFloat(nb(rotHex.dice)) : NaN;
    const ladoPx = lados(h.vertices);
    const S = ladoPx[0] / cmHex;
    const c = centro(h.vertices);
    r.push([h.vertices.length === 6 && ladoPx.every(l => cerca(l, ladoPx[0], 0.3)) && h.vertices.every(v => cerca(dist(v, c), ladoPx[0], 0.3)),
      `paso ${n}: el hexágono es regular: 6 lados iguales y sus vértices a la misma distancia del centro`, ladoPx.map(l => l.toFixed(1))]);
    r.push([/ cm$/.test(nb(rotHex && rotHex.dice)) && cmHex === 30, `paso ${n}: el lado del hexágono dice 30 cm`, rotHex && rotHex.dice]);
    const triangulito = p => p.length === 3 && lados(p).every(l => cerca(l / S, cmHex, 0.1));

    const dicho = [e.texto, e.cifra, e.palabras].map(nb).join(' | ');
    const numsDichos = (dicho.match(/\d+/g) || []).map(Number);
    r.push([![5, 11, 20, 4 * 10, 80, 24, 25].some(v => numsDichos.includes(v)) && !/apotema|entre 2|÷ ?2|mitad/i.test(dicho),
      `paso ${n}: no dice «apotema», no divide entre 2 ni sale un número del Predice`, numsDichos]);
    const cifra = nb(e.cifra);

    if (n === 0) r.push([cifra === '¿?' && !h.orilla && !h.piezas.length && !x.tri, 'paso 0: solo la tapa, sin contar nada', [cifra, h.orilla]]);
    if (n >= 1) {
      const orillaCm = ladoPx.reduce((s, l) => s + l, 0) / S;
      r.push([h.orilla && cerca(orillaCm, 180, 0.3), `paso ${n}: la orilla del hexágono está marcada y mide ${orillaCm.toFixed(1)} cm`, orillaCm]);
      if (n === 1) r.push([cifra === `${Math.round(orillaCm)} cm` && nb(e.texto).includes('6 × 30 = 180'), 'paso 1: el marcador y la frase dicen la orilla', cifra]);
    }
    if (n >= 2) {
      const p = h.piezas;
      const suma = p.reduce((s, q) => s + area(q), 0);
      r.push([p.length === 6 && p.every(triangulito) && p.every(q => q.some(v => dist(v, c) < 0.8)) && cerca(suma, area(h.vertices), 1),
        `paso ${n}: por dentro, 6 triángulos de 30 cm por lado que salen del centro y llenan la tapa`, [p.length, Math.round(suma), Math.round(area(h.vertices))]]);
      if (n === 2) r.push([+cifra === p.length && !x.tri, 'paso 2: el marcador dice los triángulos que se cuentan', cifra]);
    }
    if (n >= 3) {
      const t = x.tri;
      r.push([!!t, `paso ${n}: la tapa de triángulo está`, !!t]);
      if (t) {
        const lt = lados(t.vertices), orillaT = lt.reduce((s, l) => s + l, 0) / S;
        const rotTri = x.medidas.find(m => Math.abs(m.c[0] - centro(t.vertices)[0]) < 20);
        r.push([t.vertices.length === 3 && lt.every(l => cerca(l / S, 60, 0.15)) && rotTri && nb(rotTri.dice) === '60 cm',
          `paso ${n}: el triángulo tiene sus tres lados de 60 cm, y lo dice`, lt.map(l => (l / S).toFixed(1))]);
        r.push([t.orilla && cerca(orillaT, 180, 0.3), `paso ${n}: su orilla mide lo mismo que la del hexágono (${orillaT.toFixed(1)} cm)`, orillaT]);
        if (n === 3) r.push([cifra === '180 cm' && nb(e.texto).includes('3 × 60 = 180') && !t.piezas.length, 'paso 3: el marcador y la frase dicen la orilla del triángulo', cifra]);
        if (n >= 4) {
          const q = t.piezas, suma = q.reduce((s, w) => s + area(w), 0);
          r.push([q.length === 4 && q.every(triangulito) && cerca(suma, area(t.vertices), 1),
            `paso ${n}: por dentro, 4 triángulos de 30 cm por lado que llenan la tapa`, [q.length, Math.round(suma), Math.round(area(t.vertices))]]);
          if (n === 4) {
            /* El que se pasa cae justo encima de uno de los del triángulo. */
            const f = x.fantasma;
            const encima = !!f && q.some(w => w.every(v => f.some(u => dist(u, v) < 0.8)));
            r.push([encima && triangulito(f), 'paso 4: el triángulo del hexágono cae justo encima de uno del triángulo', f]);
            r.push([cifra === `${h.piezas.length} y ${q.length}`, 'paso 4: el marcador dice los dos conteos', cifra]);
          }
        }
      }
    }
    if (n === 5) {
      /* La medida que falta: del centro del hexágono a la mitad de un lado,
         con su «?», y sin ningún número. */
      const f = x.falta, v = h.vertices;
      const mitades = v.map((q, i) => [(q[0] + v[(i + 1) % 6][0]) / 2, (q[1] + v[(i + 1) % 6][1]) / 2]);
      r.push([!!f && dist(f[0], c) < 0.8 && mitades.some(m => dist(f[1], m) < 0.8), 'paso 5: la medida que falta va del centro a la mitad de un lado', f]);
      r.push([!!x.pregunta && nb(x.pregunta.dice) === '?' && cifra === '¿?', 'paso 5: y no se dice cuánto mide: un «?»', [x.pregunta && x.pregunta.dice, cifra]]);
    }
    return r;
  },
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

  /* Perímetro y Área de Cuadriláteros: el gallinero de Don Chele. La escala
     sale del piso y de los rótulos de sus lados (4 m y 2 m); con ella se
     cuentan los cuadritos de adentro, se mide cada tramo de malla y cada lado
     de la orilla, y se ve dónde está la gallina. Lo que dice el marcador
     tiene que ser lo que se cuenta en el dibujo. ⚠️ Y lo que va debajo no se
     regala: el «Predice» pregunta el perímetro de un cuadrado de 5 cm, el
     área de un rectángulo de 6 × 4 y si con estos mismos 12 m de malla un
     gallinero de 3 m por cada lado deja más espacio. Esa comparación la hace
     el alumno: aquí no sale ni el 3 ni el 9. */
  amGallinero(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cerca = (a, b, t = 0.6) => Math.abs(a - b) <= t;
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    const mismo = (p, q, t = 0.8) => dist(p, q) <= t;
    const [px0, py0, px1, py1] = x.piso;
    let S, L, H;
    if (n !== 4) {
      const rot = k => x.lados.find(l => l.lado === k);
      const arriba = rot(0), izq = rot(3);
      L = arriba ? parseFloat(nb(arriba.dice)) : NaN;
      H = izq ? parseFloat(nb(izq.dice)) : NaN;
      S = (px1 - px0) / L;
      escalaGallinero = { S, L, H };
      r.push([x.lados.length === 4 && cerca(S, (py1 - py0) / H, 0.3) && /^[0-9]+ m$/.test(nb(arriba.dice)),
        `paso ${n}: el gallinero se ve con sus cuatro medidas, a escala (${S.toFixed(1)} px por metro)`, x.lados.map(l => l.dice)]);
      /* Cada rótulo junto a su lado: arriba, a la derecha, abajo y a la
         izquierda, y diciendo lo que mide ese lado. */
      const junto = [[(px0 + px1) / 2, py0], [px1, (py0 + py1) / 2], [(px0 + px1) / 2, py1], [px0, (py0 + py1) / 2]];
      const medidas = [L, H, L, H];
      r.push([x.lados.every(l => dist(l.c, junto[l.lado]) < 30 && nb(l.dice) === `${medidas[l.lado]} m`),
        `paso ${n}: cada medida está junto a su lado`, x.lados.map(l => [l.lado, l.dice, Math.round(dist(l.c, junto[l.lado]))])]);
    } else {
      /* En el paso 4 las medidas de los lados se apagan (el «1 m» va encima
         del lado de arriba): la escala es la que se midió antes. */
      ({ S, L, H } = escalaGallinero || {});
      r.push([!!escalaGallinero && !x.lados.length, 'paso 4: las medidas de los lados se apagan', x.lados.length]);
      if (!escalaGallinero) return r;
    }
    const AREA = L * H, ORILLA = 2 * (L + H);
    const aMetros = p => [(p[0] - px0) / S, (p[1] - py0) / S];
    const dentro = p => { const m = aMetros(p); return m[0] > 0 && m[0] < L && m[1] > 0 && m[1] < H; };
    const largoM = l => dist(l[0], l[1]) / S;

    const dicho = [e.texto, e.cifra, e.palabras].map(nb).join(' | ');
    const numsDichos = (dicho.match(/\d+/g) || []).map(Number);
    r.push([![3, 5, 6, 9, 10, 20, 24, 25].some(v => numsDichos.includes(v)),
      `paso ${n}: no sale ningún número de lo que pregunta el Predice`, numsDichos]);
    const cifra = nb(e.cifra);
    const cifraNum = parseFloat(cifra);

    /* Las gallinas: dos siempre adentro; la de la esquina se sale cuando
       faltó malla y vuelve cuando se cierra. */
    const fueraGallinas = x.gallinas.filter(g => !dentro(g)).length;
    const conHueco = n >= 2 && n <= 4;
    r.push([x.gallinas.length === 3 && fueraGallinas === (conHueco ? 1 : 0),
      `paso ${n}: ${conHueco ? 'una gallina se salió' : 'las tres gallinas están adentro'}`, fueraGallinas]);

    if (n === 0) {
      r.push([cifra === '¿?' && !x.cuadros.length && !x.malla.length && !numsDichos.includes(AREA) && !numsDichos.includes(ORILLA),
        'paso 0: todavía no se cuenta nada, y la frase no adelanta ninguna cuenta', [cifra, numsDichos]]);
    }
    if (n === 1) {
      /* Lo de adentro: cuadritos de un metro por lado que llenan el piso sin
         encimarse, cada uno con su número, del 1 al último. */
      const c = x.cuadros;
      const deUnMetro = c.every(q => cerca((q.c[2] - q.c[0]) / S, 1, 0.02) && cerca((q.c[3] - q.c[1]) / S, 1, 0.02));
      const suma = c.reduce((s, q) => s + (q.c[2] - q.c[0]) * (q.c[3] - q.c[1]), 0) / (S * S);
      const adentro = c.every(q => q.c[0] >= px0 - 0.5 && q.c[2] <= px1 + 0.5 && q.c[1] >= py0 - 0.5 && q.c[3] <= py1 + 0.5);
      const sinEncimar = c.every((q, i) => c.every((w, j) => i === j || q.c[2] <= w.c[0] + 0.5 || w.c[2] <= q.c[0] + 0.5 || q.c[3] <= w.c[1] + 0.5 || w.c[3] <= q.c[1] + 0.5));
      r.push([c.length === AREA && deUnMetro && cerca(suma, AREA, 0.05) && adentro && sinEncimar,
        `paso 1: lo de adentro son ${c.length} cuadritos de un metro por lado que llenan el piso`, [c.length, suma]]);
      const nums = x.numeros.map(t => +nb(t.dice)).sort((a, b) => a - b);
      const cadaUno = x.numeros.every(t => c.some(q => t.c[0] > q.c[0] && t.c[0] < q.c[2] && t.c[1] > q.c[1] && t.c[1] < q.c[3] && q.n === +nb(t.dice)));
      r.push([nums.join(',') === Array.from({ length: AREA }, (_, i) => i + 1).join(',') && cadaUno,
        'paso 1: cada cuadrito lleva su número, del 1 al último', nums]);
      r.push([cifra === `${c.length} m²` && /2 filas de 4/.test(nb(e.palabras)) && H === 2 && L === 4,
        'paso 1: el marcador dice los metros cuadrados que se contaron', cifra]);
    }
    if (n >= 2) {
      /* La malla: tramos de un metro, uno detrás de otro por la orilla, desde
         la esquina de arriba a la izquierda y en el sentido del reloj. */
      const m = x.malla.slice().sort((a, b) => a.m - b.m);
      const deUnMetro = m.every(t => cerca(largoM(t.l), 1, 0.02));
      const seguidos = m.every((t, i) => i === 0 ? mismo(t.l[0], [px0, py0]) : mismo(t.l[0], m[i - 1].l[1]));
      const porLaOrilla = m.every(t => t.l.every(p => { const q = aMetros(p); return (cerca(q[0], 0, 0.02) || cerca(q[0], L, 0.02) || cerca(q[1], 0, 0.02) || cerca(q[1], H, 0.02)); }));
      const esperados = n === 5 ? ORILLA : AREA;
      r.push([m.length === esperados && deUnMetro && seguidos && porLaOrilla,
        `paso ${n}: ${m.length} tramos de malla de un metro, seguidos por la orilla`, [m.length, deUnMetro, seguidos, porLaOrilla]]);
      const postes = x.postes;
      r.push([postes.length === m.length + (n === 5 ? 0 : 1) && m.every(t => postes.some(p => mismo(p, t.l[0])) && postes.some(p => mismo(p, t.l[1]))),
        `paso ${n}: un poste en cada punta de cada tramo`, postes.length]);
      if (n >= 2 && n <= 4) {
        /* Lo que faltó: desde donde se acabó la malla hasta cerrar, por la
           orilla. Y las tablas encima, con su rendija en la esquina. */
        const h = x.hueco;
        const largoHueco = h ? h.slice(1).reduce((s, p, i) => s + dist(h[i], p), 0) / S : 0;
        r.push([!!h && mismo(h[0], m[m.length - 1].l[1]) && mismo(h[h.length - 1], [px0, py0]) && cerca(largoHueco, ORILLA - AREA, 0.02),
          `paso ${n}: lo que faltó va desde donde se acabó la malla hasta cerrar, y mide ${largoHueco.toFixed(2)} m`, largoHueco]);
        r.push([m.length + largoHueco === ORILLA || cerca(m.length + largoHueco, ORILLA, 0.02),
          `paso ${n}: la malla puesta más lo que faltó dan la orilla entera`, [m.length, largoHueco]]);
        const tablasM = x.tablas.reduce((s, l) => s + largoM(l), 0);
        r.push([x.tablas.length === 2 && tablasM < largoHueco && tablasM > largoHueco - 1,
          `paso ${n}: las tablas tapan el hueco, pero no del todo`, [x.tablas.length, tablasM]]);
        if (n === 2) r.push([cifraNum === ORILLA - AREA && / m$/.test(cifra) && /faltan 4/.test(nb(e.texto)), 'paso 2: el marcador dice los metros que faltaron', cifra]);
      }
    }
    if (n === 3) {
      /* La orilla, lado por lado: sus cuatro lados, y la suma. */
      const o = x.orilla.slice().sort((a, b) => a.lado - b.lado);
      const largos = o.map(t => Math.round(largoM(t.l) * 100) / 100);
      r.push([o.length === 4 && largos.join(',') === [L, H, L, H].join(',') && mismo(o[0].l[0], [px0, py0]) && o.every((t, i) => i === 0 || mismo(t.l[0], o[i - 1].l[1])) && mismo(o[3].l[1], [px0, py0]),
        `paso 3: la orilla, lado por lado: ${largos.join(' + ')}`, largos]);
      const suma = largos.reduce((s, v) => s + v, 0);
      r.push([cifraNum === suma && suma === ORILLA && / m$/.test(cifra) && nb(e.texto).includes(`${L} + ${H} + ${L} + ${H} = ${ORILLA}`),
        `paso 3: el marcador y la frase dicen la suma de los lados (${suma} m)`, [cifra, suma]]);
      r.push([x.lados.every(l => l.cuenta), 'paso 3: las cuatro medidas se marcan al contarlas', x.lados.map(l => l.cuenta)]);
    }
    if (n === 4) {
      /* Un metro y un metro cuadrado: una raya de un metro y un cuadrito de un
         metro por lado, cada uno con su rótulo al lado. */
      const q = x.unCuadro, y = x.unaRaya;
      r.push([!!q && cerca((q[2] - q[0]) / S, 1, 0.02) && cerca((q[3] - q[1]) / S, 1, 0.02), 'paso 4: el cuadrito mide un metro por lado', q]);
      r.push([!!y && cerca(largoM(y), 1, 0.02), 'paso 4: la raya mide un metro', y && largoM(y)]);
      const dq = x.unidades.find(u => nb(u.dice) === '1 m²'), dr = x.unidades.find(u => nb(u.dice) === '1 m');
      r.push([!!dq && !!q && dq.c[0] > q[0] && dq.c[0] < q[2] && dq.c[1] > q[1] && dq.c[1] < q[3], 'paso 4: «1 m²» está dentro del cuadrito', dq && dq.c]);
      r.push([!!dr && !!y && dist(dr.c, [(y[0][0] + y[1][0]) / 2, (y[0][1] + y[1][1]) / 2]) < 30, 'paso 4: «1 m» está junto a la raya', dr && dr.c]);
      r.push([cifra === 'm y m²', 'paso 4: el marcador dice las dos unidades', cifra]);
    }
    if (n === 5) {
      r.push([!x.hueco && !x.tablas.length, 'paso 5: ya no falta nada ni quedan tablas', [x.hueco, x.tablas.length]]);
      const m = x.malla.slice().sort((a, b) => a.m - b.m);
      r.push([m.length === ORILLA && mismo(m[m.length - 1].l[1], [px0, py0]) && cifraNum === m.length,
        'paso 5: la malla da la vuelta entera y cierra, y el marcador dice sus metros', [m.length, cifra]]);
    }
    return r;
  },

  /* Ángulos: Tipos y Transportador: la rampa de Kenia. El ángulo de la
     rampa se mide en el dibujo (del vértice a la punta de arriba, contra el
     suelo), y el transportador se lee como se lee uno de verdad: cada raya y
     cada número a sus grados desde la punta derecha de la base, medidos en
     la vista. Lo leído tiene que ser el número por donde pasa la rampa, y
     ese número, el ángulo medido. ⚠️ Y lo que va debajo no se regala: el
     «Predice» pregunta el tipo de un ángulo de 130°, el complemento de 25° y
     el tercer ángulo de un triángulo de 50° y 60°. */
  amRampa(e, n) {
    const x = e.extra, r = [];
    const nb = t => String(t == null ? '' : t).replace(/ /g, ' ').trim();
    const cerca = (a, b, t = 0.5) => Math.abs(a - b) <= t;
    const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
    /* Los grados se cuentan hacia ARRIBA, como en el transportador: en la
       vista la y crece hacia abajo. */
    const rumbo = (a, b) => Math.atan2(-(b[1] - a[1]), b[0] - a[0]) * 180 / Math.PI;
    const norm = g => { const v = ((g % 360) + 360) % 360; return v > 180 ? v - 360 : v; };
    const aLinea = (p, [a, b]) => Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / dist(a, b);
    const Z = 5, R = 140, ANG = 20;
    const angRampa = norm(rumbo(x.rampa[0], x.rampa[1]) - rumbo(x.suelo[0], x.suelo[1]));
    r.push([cerca(angRampa, ANG, 0.2), `paso ${n}: la rampa sube ${angRampa.toFixed(2)}° sobre el suelo, medidos en el dibujo`, angRampa]);
    r.push([aLinea(x.rampa[0], x.suelo) < 0.5, `paso ${n}: la rampa sale del suelo`, aLinea(x.rampa[0], x.suelo)]);
    const lejos = n <= 1 || n === 6;
    r.push([cerca(x.mundo, lejos ? 1 : Z, 0.01), `paso ${n}: la vista está ${lejos ? 'de lejos' : Z + ' veces más cerca'}`, x.mundo]);

    const dicho = [e.texto, e.cifra, e.palabras].map(nb).join(' | ');
    const numsDichos = (dicho.match(/\d+/g) || []).map(Number);
    const prohibidos = [130, 25, 65, 75, 155, 50, 60, 70, 90];
    r.push([!numsDichos.some(v => prohibidos.includes(v)) && !/agud|obtus|recto|llano|complement|suplement|triángul/i.test(dicho),
      `paso ${n}: no nombra ningún tipo de ángulo ni lo que pregunta el Predice`, numsDichos]);

    const cifra = nb(e.cifra);
    if (n <= 3) {
      r.push([cifra === '¿?', `paso ${n}: todavía no se ha leído: el marcador dice ¿?`, cifra]);
      r.push([!numsDichos.includes(ANG), `paso ${n}: la frase no adelanta la medida`, numsDichos]);
    }
    if (n <= 1) {
      r.push([x.arco && x.pregunta === '?' && !x.grados, `paso ${n}: el arco del ángulo, con su pregunta`, [x.arco, x.pregunta, x.grados]]);
      r.push([!x.tp, `paso ${n}: el transportador todavía no está`, !!x.tp]);
    }
    if (n === 0) r.push([!x.vertice && !x.lados.length && !x.rotulos.length, 'paso 0: solo la rampa, sin marcar nada', [x.vertice, x.lados.length, x.rotulos.length]]);
    if (n === 1) {
      const ls = x.lados.find(l => l.suelo), lr = x.lados.find(l => !l.suelo);
      r.push([!!ls && !!lr && !!x.vertice, 'paso 1: los dos lados y el vértice', [!!ls, !!lr, !!x.vertice]]);
      if (ls && lr && x.vertice) {
        r.push([dist(x.vertice, x.rampa[0]) < 0.8 && dist(ls.l[0], x.vertice) < 0.8 && dist(lr.l[0], x.vertice) < 0.8,
          'paso 1: el vértice es donde la rampa sale del suelo, y de ahí salen los dos lados', dist(x.vertice, x.rampa[0])]);
        r.push([aLinea(ls.l[1], x.suelo) < 0.8 && ls.l[1][0] > x.vertice[0] && dist(lr.l[1], x.rampa[1]) < 1,
          'paso 1: un lado va por el suelo, bajo la rampa, y el otro por la rampa hasta arriba', [ls.l, lr.l]]);
        const vt = x.rotulos.filter(q => nb(q.dice) === 'vértice'), la = x.rotulos.filter(q => nb(q.dice) === 'lado');
        r.push([vt.length === 1 && dist(vt[0].c, x.vertice) < 45, 'paso 1: el rótulo «vértice» está junto al vértice', vt.map(q => dist(q.c, x.vertice))]);
        r.push([la.length === 2 && la.some(q => aLinea(q.c, ls.l) < 22 && q.c[1] > x.vertice[1]) && la.some(q => aLinea(q.c, lr.l) < 22 && q.c[1] < x.vertice[1]),
          'paso 1: un rótulo «lado» junto a cada lado', la.map(q => [aLinea(q.c, ls.l), aLinea(q.c, lr.l)])]);
      }
    }
    if (n < 2) return r;

    const t = x.tp;
    r.push([!!t, `paso ${n}: el transportador está`, !!t]);
    if (!t) return r;
    r.push([!!x.vertice && dist(t.centro, x.vertice) < 0.8 && dist(t.centro, x.rampa[0]) < 0.8,
      `paso ${n}: el centro del transportador está sobre el vértice`, x.vertice && dist(t.centro, x.vertice)]);
    r.push([cerca(t.escala, n === 6 ? 1 / Z : 1, 0.005), `paso ${n}: el transportador ${n === 6 ? 'se achicó con la vista' : 'está a su tamaño de cerca'}`, t.escala]);
    /* El marco del transportador: los grados se cuentan desde la punta
       derecha de la base, la del cero de la fila de dentro. */
    const derecha = t.base[1];
    const gradosDe = p => norm(rumbo(t.centro, p) - rumbo(t.centro, derecha));
    const radio = dist(t.centro, derecha);
    const torcido = norm(rumbo(t.base[0], t.base[1]) - rumbo(x.suelo[0], x.suelo[1]));
    if (n === 2) r.push([Math.abs(torcido) >= 10, `paso 2: el transportador llega torcido (${torcido.toFixed(1)}°), y por eso todavía no se lee`, torcido]);
    else r.push([Math.abs(torcido) < 0.3 && aLinea(t.base[0], x.suelo) < 0.8 && aLinea(t.base[1], x.suelo) < 0.8,
      `paso ${n}: la base del transportador está encima del suelo`, [torcido, aLinea(t.base[0], x.suelo), aLinea(t.base[1], x.suelo)]]);

    if (n === 2 || n === 3) {
      /* Un transportador de verdad: cada raya a sus grados; cada número de la
         fila de dentro, a sus grados desde la derecha, y cada uno de la de
         fuera, desde la izquierda. Torcido o derecho, da lo mismo. */
      const k = t.escala;
      const rayasMal = t.marcas.filter(m => !cerca(gradosDe(m.a), m.g, 0.2) || !cerca(gradosDe(m.b), m.g, 0.3) || !cerca(dist(t.centro, m.a), R * k, 0.6));
      const cada = (paso, cuantas) => Array.from({ length: cuantas }, (_, i) => i * paso).join(',');
      r.push([t.marcas.map(m => m.g).sort((a, b) => a - b).join(',') === cada(5, 37) && !rayasMal.length,
        `paso ${n}: las 37 rayas, cada 5°, cada una a sus grados`, rayasMal.slice(0, 3)]);
      const dentro = t.nums.filter(q => q.fila === 'dentro'), fuera = t.nums.filter(q => q.fila === 'fuera');
      const deDiez = l => l.map(q => q.valor).sort((a, b) => a - b).join(',') === cada(10, 19);
      /* Los de las puntas van justo encima de la base: basta con que estén en
         su punta y pegados a ella. */
      const dondeVa = (q, g) => { const real = gradosDe(q.c); return g <= 0 ? real > 0 && real < 6 : g >= 180 ? real > 174 && real < 180 : cerca(real, g, 1.5); };
      const numsMal = [...dentro.map(q => [q, q.valor]), ...fuera.map(q => [q, 180 - q.valor])]
        .filter(([q, g]) => !dondeVa(q, g) || nb(q.dice) !== String(q.valor)).map(([q, g]) => [q.fila, q.valor, gradosDe(q.c).toFixed(1), g]);
      r.push([deDiez(dentro) && deDiez(fuera) && !numsMal.length,
        `paso ${n}: las dos filas de 0 a 180: la de dentro cuenta desde la derecha y la de fuera, desde la izquierda`, numsMal.slice(0, 3)]);
      r.push([!t.nums.some(q => q.leido || q.mal || q.marcada) && !t.lectura && !t.tachado && !t.anillo && !t.cuenta,
        `paso ${n}: todavía no se marca nada en la escala`, null]);
    }
    if (n === 4 || n === 5) {
      const dentro = t.nums.filter(q => q.fila === 'dentro');
      r.push([dentro.every(q => q.marcada) && !t.nums.some(q => q.fila === 'fuera' && q.marcada),
        `paso ${n}: la fila que se sigue es la de dentro, entera, y solo ella`, t.nums.filter(q => q.marcada).length]);
      const cero = dentro.find(q => q.valor === 0);
      r.push([!!t.anillo && !!cero && dist(t.anillo, cero.c) < 2, `paso ${n}: el anillo está en el cero de esa fila`, t.anillo && cero && dist(t.anillo, cero.c)]);
      /* «El cero que queda bajo la rampa»: del lado del suelo que es lado del
         ángulo, y por debajo de la rampa. */
      const gCero = cero ? norm(rumbo(x.vertice, cero.c) - rumbo(x.suelo[0], x.suelo[1])) : NaN;
      r.push([gCero > 0 && gCero < angRampa, `paso ${n}: ese cero queda bajo la rampa (a ${gCero.toFixed(1)}° del suelo)`, gCero]);
      if (n === 4) r.push([cifra === '0°' && !t.nums.some(q => q.leido) && !t.lectura, 'paso 4: el marcador dice 0°, el cero de donde se cuenta, y todavía no se lee', cifra]);
    }
    if (n === 5) {
      /* Lo leído, sacado del DIBUJO: el número de la fila de dentro que está
         en el rumbo de la rampa. */
      const dentro = t.nums.filter(q => q.fila === 'dentro');
      const porDonde = dentro.slice().sort((a, b) => Math.abs(gradosDe(a.c) - angRampa) - Math.abs(gradosDe(b.c) - angRampa))[0];
      const leidos = t.nums.filter(q => q.leido), l = leidos[0];
      r.push([leidos.length === 1 && l === porDonde, 'paso 5: lo leído es el número de la fila de dentro por donde pasa la rampa', leidos.map(q => [q.fila, q.valor])]);
      if (l) r.push([l.valor === Math.round(angRampa) && cifra === `${l.valor}°` && l.esc >= 1.3,
        `paso 5: lo leído (${l.valor}) es el ángulo medido en el dibujo y lo que dice el marcador, y se ve más grande`, [l.valor, angRampa, cifra, l.esc]]);
      r.push([!!t.lectura && aLinea(t.lectura, x.rampa) < 1 && cerca(dist(t.centro, t.lectura), R * t.escala, 1.2),
        'paso 5: el anillo de la lectura está donde la rampa cruza el borde', t.lectura && [aLinea(t.lectura, x.rampa), dist(t.centro, t.lectura)]]);
      const c = t.cuenta;
      r.push([!!c && cerca(gradosDe(c[0]), 0, 0.6) && cerca(gradosDe(c[1]), angRampa, 0.6), 'paso 5: la cuenta va del cero hasta la rampa', c && [gradosDe(c[0]), gradosDe(c[1])]]);
      r.push([t.pasos.map(p => p.g).join(',') === '10,20' && t.pasos.every(p => cerca(gradosDe(p.c), p.g, 0.6)),
        'paso 5: la cuenta pasa por el 10 y llega al 20', t.pasos.map(p => [p.g, gradosDe(p.c).toFixed(1)])]);
      /* La otra fila: lo tachado es el número de la de fuera que está en ese
         mismo sitio, y vale lo que le falta a lo leído para 180. */
      const tc = t.tachado, mal = t.nums.filter(q => q.mal);
      const otro = tc && t.nums.find(q => q.fila === 'fuera' && q.valor === tc.valor);
      const medioT = tc && [(tc.l[0][0] + tc.l[1][0]) / 2, (tc.l[0][1] + tc.l[1][1]) / 2];
      r.push([!!otro && !!l && tc.valor === 180 - l.valor && cerca(gradosDe(otro.c), angRampa, 1.5) && dist(otro.c, medioT) < 2
        && mal.length === 1 && mal[0] === otro, 'paso 5: el número de la otra fila, en ese mismo sitio, tachado', otro && [tc.valor, gradosDe(otro.c).toFixed(1)]]);
      /* La raya que tacha no puede parecer un pedazo de la rampa. */
      if (tc) {
        const gT = norm(rumbo(tc.l[0], tc.l[1]) - rumbo(x.suelo[0], x.suelo[1]));
        r.push([Math.abs(gT - angRampa) > 30 && Math.abs(Math.abs(gT - angRampa) - 180) > 30, `paso 5: la raya que tacha va en otra dirección que la rampa (${gT.toFixed(1)}°)`, gT]);
      }
      r.push([/20°/.test(nb(e.texto)) && /\b160\b/.test(nb(e.texto)), 'paso 5: la frase dice las dos lecturas, 20° y 160', e.texto]);
    }
    if (n === 6) {
      const larga = dist(x.rampa[0], x.rampa[1]);
      r.push([radio < larga / 4, `paso 6: el transportador es chiquito junto a la rampa (radio ${radio.toFixed(1)} contra ${larga.toFixed(1)})`, [radio, larga]]);
      r.push([Math.abs(torcido) < 0.3, 'paso 6: y sigue derecho sobre el suelo', torcido]);
      r.push([x.arco && nb(x.grados) === `${Math.round(angRampa)}°` && !x.pregunta, 'paso 6: el arco del ángulo ya dice lo medido', [x.grados, x.pregunta]]);
      r.push([cifra === `${Math.round(angRampa)}°`, 'paso 6: el marcador dice lo medido', cifra]);
    }
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
