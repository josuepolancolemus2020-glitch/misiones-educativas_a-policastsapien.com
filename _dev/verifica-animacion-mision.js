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
   4. Que nada se salga del teléfono y que todo botón mida 44 px.
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
      cifra: raiz.querySelector('.am-cifra').textContent,
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
