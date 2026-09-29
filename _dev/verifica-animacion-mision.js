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
const ESCENAS = {
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
      r.push([x.hueco.length === 1 && cerca(dia(h), BUS + CAM) && +e.cifra === BUS + CAM && vacio && /6 \+ 8/.test(e.palabras),
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
    const escena = ESCENAS[m.id];
    for (let n = 0; n < base.pasos; n++) {
      const e = await pag.evaluate(id => window.__amLeer(id), m.id);
      vistos.push(e);
      ok(e.paso === n, `paso ${n}: el botón lleva paso a paso`, e.paso);
      const largas = frases(e.texto).filter(x => x > 25);
      if (!e.texto.trim() || largas.length) ok(false, `paso ${n}: la frase existe y ninguna pasa de 25 palabras`, largas);
      if (escena) for (const [bien, txt, extra] of escena(e, n)) ok(bien, txt, extra);
      await pag.click(`#${m.id} .am-sigue`);
    }
    const repetidas = vistos.filter((e, i) => i > 0 && e.texto === vistos[i - 1].texto).length;
    ok(repetidas === 0, 'cada paso dice algo distinto del anterior', repetidas);
    ok(vistos.every(e => e.texto.trim()) , `las ${vistos.length} frases existen y son de 25 palabras o menos`);
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
