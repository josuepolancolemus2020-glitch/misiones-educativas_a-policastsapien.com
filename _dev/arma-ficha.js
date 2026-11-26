#!/usr/bin/env node
/* ════════════════════════════════════════════════════════════════
   M.E.T.A.S · Arma la ficha de una misión desde su bloque
   ────────────────────────────────────────────────────────────────
   Había cinco armadores (`arma-fichas-ia`, `arma-ficha-mundo`,
   `-saber`, `-lenguaje`, `-fin-de-grado`), cada uno para su ficha, y 80
   fichas escritas a mano con su CSS copiado dentro. Este es UNO para
   todas las que vengan: lee el bloque `FICHA` de la misión

       misiones/<carpeta>/js/ficha.js

   y escribe la ficha de siempre, en su dirección de siempre

       fichas/<FICHA.archivo>.html

   ► POR QUÉ SE ARMA AQUÍ Y NO EN EL TELÉFONO. Lo que se publica es el
     HTML resultante: plano, sin una línea de JavaScript, con su CSS
     dentro. Se abre sin señal, su QR impreso sigue valiendo y cada hoja
     se puede medir contra el papel antes de publicarla (tope de 248 mm,
     `verifica-ficha-paginas.js`). Armarla en el navegador del maestro
     dejaría esa medida para el día de la fotocopia.

   ► POR QUÉ EL BLOQUE VA EN SU PROPIO ARCHIVO. `js/ficha.js` no lo carga
     la página de la misión: el alumno no lo descarga, y cambiar una
     ficha no obliga a resellar la misión.

   ► LO QUE EL ARMADOR PONE Y EL BLOQUE NO ESCRIBE (y por eso no se
     puede equivocar a mano): la pauta, que sale de las respuestas; la
     numeración; la Columna B de los pareados, barajada sin que ninguno
     caiga en su propia fila; los pies de página; y el CSS, que es el
     único de `_dev/fichas-motor/ficha.css` con la paleta de la materia.

   ► LO QUE SE NIEGA A ARMAR. Una práctica que copia el examen de su
     misión (la regla de `_dev/lib-ficha.js`), un completar sin su hueco,
     un verdadero o falso con casi todo igual, una selección con la
     correcta siempre en la misma letra (ninguna pasa del 40 %), un
     `ensaya` que no nombra un dato del examen. Mejor no escribir la
     ficha que escribirla mal y enterarse por la sonda.

   Uso:  node _dev/arma-ficha.js <carpeta>            la arma y la escribe
         node _dev/arma-ficha.js                      todas las que tienen bloque
         node _dev/arma-ficha.js <carpeta> --revisa   no escribe: dice si la
                                                      publicada es la que saldría

   Después SIEMPRE:
         node _dev/verifica-ficha-paginas.js <archivo>      (cada hoja cabe)
         node _dev/verifica-ficha-no-copia-examen.js --anota
   Si una hoja se pasa, el corte se mueve en `hojas` del bloque; el
   repartidor (`reparte-hojas-ficha.js <archivo>`) sirve para ver dónde.

   No es una sonda: escribe. La forma del bloque está explicada en
   `_privado/PLANTILLA-FICHAS.md`.
   ════════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const L = require('./lib-formas.js');
const F = require('./lib-ficha.js');

const RAIZ = path.resolve(__dirname, '..');
const DIR_FICHAS = path.join(RAIZ, 'fichas');
const CSS = fs.readFileSync(path.join(__dirname, 'fichas-motor', 'ficha.css'), 'utf8');

/* La paleta de cada materia. Son los colores que las fichas ya llevaban
   escritos dentro (se leyeron de ellas, no se eligieron ahora): una ficha
   armada tiene que verse igual que su hermana hecha a mano. */
const PALETAS = {
  'Español':            { materia: '#b45309', osc: '#78350f', claro: '#fefce8', linea: '#ecdcc0', fondo: '#f7f3ea', par: '#fdf9f0', papel: '#fffdf7', pauta: '#faf6ec', sombra: 'rgba(180,83,9,.4)' },
  'Matemáticas':        { materia: '#1565c0', osc: '#0d3b7a', claro: '#e8f1fb', linea: '#cfdcec', fondo: '#eef2f7', par: '#f6f9fd', papel: '#fbfdff', pauta: '#f3f6fb', sombra: 'rgba(21,101,192,.4)' },
  'Ciencias Naturales': { materia: '#0d9488', osc: '#115e59', claro: '#f0fdfa', linea: '#cfece7', fondo: '#eef6f4', par: '#f5fbfa', papel: '#fafefd', pauta: '#f2faf8', sombra: 'rgba(13,148,136,.4)' },
  'Ciencias Sociales':  { materia: '#dc2626', osc: '#991b1b', claro: '#fef2f2', linea: '#f0d4d4', fondo: '#f7efef', par: '#fdf5f5', papel: '#fffbfb', pauta: '#fdf4f4', sombra: 'rgba(220,38,38,.4)' },
  'Educación Cívica':   { materia: '#3f6212', osc: '#365314', claro: '#f5f9e8', linea: '#dbe7c4', fondo: '#f2f6ea', par: '#f8fbf1', papel: '#fcfdf8', pauta: '#f7fbef', sombra: 'rgba(63,98,18,.4)' },
  'Programación':       { materia: '#0e7490', osc: '#155e75', claro: '#ecfeff', linea: '#cffafe', fondo: '#eefafc', par: '#f4fcfd', papel: '#f8feff', pauta: '#f2fbfd', sombra: 'rgba(14,116,144,.4)' },
  'Robótica':           { materia: '#0e7490', osc: '#155e75', claro: '#ecfeff', linea: '#cdeef6', fondo: '#eef8fa', par: '#f4fbfd', papel: '#fafdfe', pauta: '#f2fafc', sombra: 'rgba(14,116,144,.4)' },
  'Inglés':             { materia: '#be185d', osc: '#831843', claro: '#fff1f5', linea: '#fbcfe8', fondo: '#fdf2f8', par: '#fdf2f8', papel: '#fffafc', pauta: '#fdf2f8', sombra: 'rgba(190,24,93,.4)' }
};

const ROMANOS = ['I', 'II', 'III', 'IV'];
const SECCIONES = ['completar', 'vf', 'seleccion', 'pareados'];
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

class Rechazo extends Error {}
const exige = (cond, msg) => { if (!cond) throw new Rechazo(msg); };

/* ── Leer ───────────────────────────────────────────────────── */
function leeBloque(carpeta) {
  const ruta = path.join(L.DIR_MISIONES, carpeta, 'js', 'ficha.js');
  exige(fs.existsSync(ruta), carpeta + ': no tiene bloque (misiones/' + carpeta + '/js/ficha.js)');
  return vm.runInNewContext(fs.readFileSync(ruta, 'utf8') + '\n;FICHA', {}, { filename: ruta });
}

/* El examen de la misión, con el JavaScript de verdad de la misión. */
function examenDe(carpeta) {
  const bancos = L.bancosDe(L.cargarMision(carpeta));
  const lista = [], datos = new Set();
  Object.keys(bancos).forEach(n => bancos[n].forEach((it, i) => {
    const p = F.deBanco(n, it);
    if (p) lista.push(Object.assign(p, { banco: n, i: i + 1 }));
    if (it && it.k) [].concat(it.k).forEach(k => datos.add(k));
  }));
  return { lista, datos };
}

/* ── La Columna B, barajada ─────────────────────────────────── */
/* Con semilla (el nombre de la ficha) y no con Math.random: armar dos
   veces la misma ficha tiene que dar el mismo archivo, o cada corrida
   cambiaría la pauta de una hoja que el maestro ya imprimió. Se baraja
   hasta que ningún pareado quede en su propia fila: si el 6 de la
   Columna A cae al lado de la F, la tabla se contesta sola. */
function barajaB(n, semilla) {
  let s = 2166136261;
  for (const c of semilla) { s ^= c.charCodeAt(0); s = Math.imul(s, 16777619) >>> 0; }
  const azar = () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  for (let intento = 0; intento < 200; intento++) {
    const orden = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i--) { const j = Math.floor(azar() * (i + 1)); [orden[i], orden[j]] = [orden[j], orden[i]]; }
    if (n < 2 || orden.every((par, fila) => par !== fila)) return orden;   /* orden[fila] = qué par va en esa fila de B */
  }
  throw new Rechazo('no se pudo barajar la Columna B');
}

/* ── Comprobar el bloque antes de escribir nada ─────────────── */
/* `sinQr`: la ficha de una misión recién nacida se comprueba antes de que
   exista su QR (los QR se generan cuando la misión entra al catálogo). Solo
   se salta eso: todo lo demás se le exige igual. */
function comprueba(B, carpeta, examen, sinQr) {
  ['archivo', 'mision', 'asignatura', 'nivel', 'tema', 'qr'].forEach(c => exige(typeof B[c] === 'string' && B[c].trim(), 'falta «' + c + '» en el bloque'));
  exige(/^ficha-[a-z0-9-]+$/.test(B.archivo), '«archivo» tiene que ser ficha-<slug>, sin .html');
  exige(PALETAS[B.asignatura], 'no hay paleta para la asignatura «' + B.asignatura + '». Las que hay: ' + Object.keys(PALETAS).join(', '));
  exige(/^qr-mision-[a-z0-9-]+\.png$/.test(B.qr), '«qr» tiene que ser qr-mision-<slug>.png');
  exige(sinQr || fs.existsSync(path.join(RAIZ, 'img', B.qr)), 'no existe img/' + B.qr + ' (se genera con _dev/genera-qr-mision.py)');
  exige(Array.isArray(B.objetivos) && B.objetivos.length, 'faltan los objetivos');
  exige(Array.isArray(B.hojas) && B.hojas.length, 'faltan las hojas');
  const P = B.practica || {};
  exige(Array.isArray(P.completar) && Array.isArray(P.vf) && Array.isArray(P.seleccion) && P.pareados && Array.isArray(P.pareados.pares),
    'la práctica lleva completar, vf, seleccion y pareados.pares');

  P.completar.forEach((q, i) => {
    exige((q.q.match(/_{3,}/g) || []).length === 1, 'Completar ' + (i + 1) + ': lleva exactamente un hueco «___»');
    exige(typeof q.a === 'string' && q.a.trim(), 'Completar ' + (i + 1) + ': falta la respuesta');
  });
  P.vf.forEach((q, i) => exige(typeof q.a === 'boolean', 'Verdadero o falso ' + (i + 1) + ': la respuesta es true o false'));
  if (P.vf.length >= 4) {
    const v = P.vf.filter(q => q.a).length;
    exige(v >= P.vf.length * 0.3 && v <= P.vf.length * 0.7, 'Verdadero o falso: ' + v + ' de ' + P.vf.length + ' son verdaderos. Con casi todos iguales se contesta sin leer');
  }
  P.seleccion.forEach((q, i) => {
    exige(Array.isArray(q.o) && q.o.length === 4, 'Selección ' + (i + 1) + ': lleva cuatro opciones');
    exige(Number.isInteger(q.a) && q.a >= 0 && q.a < 4, 'Selección ' + (i + 1) + ': «a» es el lugar de la correcta, de 0 a 3');
    exige(new Set(q.o.map(F.llano)).size === 4, 'Selección ' + (i + 1) + ': hay dos opciones iguales');
  });
  if (P.seleccion.length >= 5) {
    [0, 1, 2, 3].forEach(l => {
      const n = P.seleccion.filter(q => q.a === l).length;
      exige(n <= P.seleccion.length * 0.4, 'Selección: la correcta cae ' + n + ' de ' + P.seleccion.length + ' veces en la «' + 'abcd'[l] + '». Ninguna letra pasa del 40 %');
    });
  }
  const pares = P.pareados.pares;
  exige(pares.length <= LETRAS.length, 'demasiados pareados');
  exige(new Set(pares.map(p => F.llano(p.term))).size === pares.length, 'Pareados: hay un término repetido');
  exige(new Set(pares.map(p => F.llano(p.def))).size === pares.length, 'Pareados: hay una definición repetida');

  /* Cada `ensaya` nombra un dato que el examen pregunta de verdad. */
  const todas = [].concat(P.completar, P.vf, P.seleccion, pares);
  todas.forEach(q => [].concat(q.ensaya || []).forEach(k => exige(examen.datos.has(k), 'la práctica dice que ensaya «' + k + '» y el examen no tiene ese dato')));

  /* Y ninguna es del examen. Es la misma regla que aplica la sonda. */
  const mias = [].concat(
    P.completar.map((q, i) => ({ n: 'Completar ' + (i + 1), f: { tipo: 'completar', texto: q.q, resp: q.a } })),
    P.vf.map((q, i) => ({ n: 'Verdadero o falso ' + (i + 1), f: { tipo: 'vf', texto: q.q, resp: q.a ? 'V' : 'F' } })),
    P.seleccion.map((q, i) => ({ n: 'Selección ' + (i + 1), f: { tipo: 'seleccion', texto: q.q, resp: q.o[q.a] } })),
    pares.map((q, i) => ({ n: 'Pareado ' + (i + 1), f: { tipo: 'pareado', texto: q.term, resp: q.def } })));
  mias.forEach(m => examen.lista.forEach(e => {
    const por = F.mismaPregunta(m.f, e);
    exige(!por, m.n + ' es ' + por + ' del examen (' + e.banco + ' ' + e.i + '): «' + e.texto + '»');
  }));

  /* Cada sección de la práctica sale en las hojas, entera y una vez. */
  const puestas = {};
  B.hojas.forEach(h => h.forEach(b => { if (b.practica) (puestas[b.practica] = puestas[b.practica] || []).push(b); }));
  SECCIONES.forEach(s => exige(puestas[s], 'la sección «' + s + '» de la práctica no está puesta en ninguna hoja'));
  ['completar', 'vf', 'seleccion'].forEach(s => {
    const total = P[s].length, vistos = [];
    puestas[s].forEach(b => { for (let i = b.desde || 1; i <= (b.hasta || total); i++) vistos.push(i); });
    exige(vistos.length === total && vistos.every((v, i) => v === i + 1), 'la sección «' + s + '» no sale entera y en orden: revisa «desde» y «hasta» en las hojas');
  });
  exige(puestas.pareados.length === 1, 'los pareados van enteros en una hoja: la tabla no se parte');
  return todas;
}

/* ── Pintar ─────────────────────────────────────────────────── */
const hueco = '<span class="linea-resp"></span>';

function tabla(t) {
  const estilo = t.k === 'normal' ? ' style="white-space:normal;"' : '';
  const clase = t.clase ? ' class="' + t.clase + '"' : '';
  return '<table' + clase + '>\n      <tr>' + t.cab.map(c => '<th>' + c + '</th>').join('') + '</tr>\n'
    + t.filas.map(f => '      <tr>' + f.map((c, i) => i === 0 && t.k !== false ? '<td class="k"' + estilo + '>' + c + '</td>' : '<td>' + c + '</td>').join('') + '</tr>').join('\n')
    + '\n    </table>';
}

function titulosPractica(B) {
  const P = B.practica, valor = n => { const v = 100 / n; return Number.isInteger(v) ? ' <span class="val">(Valor: ' + v + ' puntos c/u)</span>' : ''; };
  return {
    completar: 'I. Completa los espacios' + valor(P.completar.length),
    vf: 'II. Verdadero o Falso' + valor(P.vf.length),
    seleccion: 'III. Selección múltiple' + valor(P.seleccion.length) + '. Rellena el círculo de la letra de la respuesta correcta.',
    pareados: 'IV. Relaciona (Pareados)' + valor(P.pareados.pares.length) + '. Escribe en la línea la letra de la Columna B que corresponde.'
  };
}

function pintaPractica(B, b, ordenB) {
  const P = B.practica, T = titulosPractica(B), s = b.practica;
  const total = s === 'pareados' ? P.pareados.pares.length : P[s].length;
  const desde = b.desde || 1, hasta = b.hasta || total;
  /* El título solo donde empieza la sección: si sigue en la hoja
     siguiente, sigue sin repetirlo. */
  const h3 = desde === 1 ? '<h3>' + T[s] + '</h3>\n\n    ' : '';
  if (s === 'completar' || s === 'vf') {
    const lis = P[s].slice(desde - 1, hasta).map(q => s === 'completar'
      ? '      <li>' + q.q.replace(/_{3,}/, hueco) + '</li>'
      : '      <li>____ ' + q.q + '</li>');
    return h3 + '<ol' + (desde > 1 ? ' start="' + desde + '"' : '') + '>\n' + lis.join('\n') + '\n    </ol>';
  }
  if (s === 'seleccion') {
    return h3 + P.seleccion.slice(desde - 1, hasta).map((q, i) =>
      '<div class="preg">\n      <div class="preg-q"><span class="preg-n">' + (desde + i) + '</span>' + q.q + '</div>\n      <div class="preg-ops">\n'
      + q.o.map((o, j) => '        <span class="op"><i>' + 'abcd'[j] + '</i> ' + o + '</span>').join('\n')
      + '\n      </div>\n    </div>').join('\n\n    ');
  }
  const pares = P.pareados.pares;
  const filas = pares.map((p, fila) => '      <tr><td>' + (fila + 1) + '. ____ ' + p.term + '</td><td>' + LETRAS[fila] + '. ' + pares[ordenB[fila]].def + '</td></tr>');
  return h3 + (P.pareados.intro ? P.pareados.intro + '\n\n    ' : '')
    + '<table>\n      <tr><th style="width:' + (P.pareados.anchoA || '42%') + ';">' + (P.pareados.columnaA || 'Columna A') + '</th><th>' + (P.pareados.columnaB || 'Columna B') + '</th></tr>\n'
    + filas.join('\n') + '\n    </table>';
}

function pintaBloque(B, b, ordenB) {
  if (b.objetivos) return '<h2>🎯 Objetivos de Aprendizaje</h2>\n\n    <ol class="objetivos">\n' + B.objetivos.map(o => '      <li>' + o + '</li>').join('\n') + '\n    </ol>';
  if (b.h2) return '<h2' + (b.pegado ? ' style="margin-top:0;"' : '') + '>' + b.h2 + '</h2>';
  if (b.h3) return '<h3>' + b.h3 + '</h3>';
  if (b.p) return '<p>' + b.p + '</p>';
  if (b.caja) return '<div class="caja ' + b.caja + '">' + b.html + '</div>';
  if (b.tabla) return tabla(b.tabla);
  if (b.practica) return pintaPractica(B, b, ordenB);
  if (b.felicitacion) return '<div class="felic">\n      ' + B.felicitacion + '\n    </div>';
  if (b.rubrica) {
    const R = B.rubrica;
    return '<h2>📏 Rúbrica de Evaluación</h2>\n\n    <table class="rubrica">\n      <tr><th>Actividad</th><th>Lugar</th><th>Valor</th><th>Nota obtenida</th><th>Observación</th></tr>\n'
      + R.filas.map(f => '      <tr><td>' + f[0] + '</td><td class="lg">' + f[1] + '</td><td>100</td><td>&nbsp;</td><td>&nbsp;</td></tr>').join('\n')
      + '\n      <tr><td colspan="3" style="text-align:right;font-weight:700;">Promedio nota final →</td><td colspan="2">&nbsp; %</td></tr>\n    </table>\n\n'
      + '    <p style="font-size:9pt;color:var(--gris);">' + R.nota + '</p>';
  }
  if (typeof b.html === 'string') return b.html;
  throw new Rechazo('bloque que el armador no conoce: ' + JSON.stringify(b).slice(0, 90));
}

function pinta(B) {
  const pal = PALETAS[B.asignatura], P = B.practica;
  const ordenB = barajaB(P.pareados.pares.length, B.archivo);
  const pie = (n, docente) => '  <div class="pag-pie"><span><b>M.E.T.A.S</b> · Ficha Didáctica · ' + B.mision + (docente ? ' · Hoja del Docente' : '') + '</span><span>Página ' + n + '</span></div>';

  const cabeza = '    <div class="idline"><span>Nombre:</span><span class="raya"></span><span>N.º-Lista:</span><span class="raya corta"></span></div>\n\n'
    + '    <div class="fh">\n      <div class="fh-txt">\n        <div class="f-badge">📄 Ficha Didáctica: Misión ' + B.mision + '</div>\n'
    + '        <div class="f-meta"><b>Asignatura:</b> ' + B.asignatura + ' &nbsp;·&nbsp; <b>Nivel:</b> ' + B.nivel + '</div>\n'
    + '        <div class="f-meta"><b>Tema:</b> ' + B.tema + '</div>\n      </div>\n      <div class="fh-qr">\n'
    + '        <img src="../img/' + B.qr + '" alt="QR de la misión">\n        <span>📷 Juega la misión en tu teléfono</span>\n      </div>\n    </div>\n\n';

  const hojas = B.hojas.map((h, i) => {
    const actividades = h.some(b => b.practica || b.felicitacion || b.rubrica);
    return '<!-- ═══════════ PÁGINA ' + (i + 1) + ' ═══════════ -->\n<section class="pagina">\n  <div class="contenido' + (actividades ? ' acts' : '') + '">\n\n'
      + (i === 0 ? cabeza : '') + h.map(b => '    ' + pintaBloque(B, b, ordenB)).join('\n\n') + '\n\n  </div>\n' + pie(i + 1) + '\n</section>';
  });

  /* La pauta: sale de las respuestas del bloque, no se escribe. La letra
     de cada pareado es la fila de la Columna B donde cayó su definición. */
  const letraDe = par => LETRAS[ordenB.indexOf(par)];
  const nDoc = B.hojas.length + 1;
  const pauta = [
    ['I. Completar:', P.completar.map((q, i) => (i + 1) + '. ' + q.a).join(' &nbsp; ')],
    ['II. Verdadero o Falso:', P.vf.map((q, i) => (i + 1) + (q.a ? 'V' : 'F')).join(', ')],
    ['III. Selección múltiple:', P.seleccion.map((q, i) => (i + 1) + 'abcd'[q.a]).join(', ')],
    ['IV. Pareados:', P.pareados.pares.map((q, i) => (i + 1) + letraDe(i)).join(', ')]
  ];
  const docente = '<!-- ═══════════ PÁGINA ' + nDoc + ' · HOJA SUELTA DEL DOCENTE ═══════════ -->\n<section class="pagina">\n  <div class="contenido">\n\n'
    + '    <h2>✅ Pauta de Respuestas · Hoja del Docente</h2>\n\n'
    + '    <p style="font-size:10pt;color:var(--gris);">Esta hoja se imprime <strong>suelta</strong>: es solo para el docente o para la autoevaluación guiada.</p>\n\n'
    + '    <div class="pauta">\n' + pauta.map(l => '      <div><span class="pt">' + l[0] + '</span> ' + l[1] + '</div>').join('\n') + '\n    </div>\n\n'
    + '    <div class="nota-doc">\n      <strong>Nota para el docente:</strong> ' + B.notaDocente + '\n    </div>\n\n  </div>\n' + pie(nDoc, true) + '\n</section>';

  const raiz = '  :root {\n    --materia: ' + pal.materia + '; --materia-osc: ' + pal.osc + '; --materia-claro: ' + pal.claro + ';\n'
    + '    --tinta: #1a2733; --gris: #5b6773; --linea: ' + pal.linea + ';\n'
    + '    --fondo: ' + pal.fondo + '; --par: ' + pal.par + '; --papel: ' + pal.papel + '; --pauta: ' + pal.pauta + '; --sombra: ' + pal.sombra + ';\n  }\n';
  /* El comentario del CSS único es para quien lo edita; en la ficha
     publicada sobra y se va, con una línea que dice de dónde salió. */
  const css = CSS.replace(/^\/\*[\s\S]*?\*\/\n/, '');
  const propio = B.estilos ? '\n  /* ─── Lo propio de esta ficha ─── */\n' + B.estilos.replace(/^\n+|\s+$/g, '') + '\n' : '';

  return '<!DOCTYPE html>\n<html lang="es">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
    + '<title>Ficha Didáctica · Misión ' + B.mision + '</title>\n<meta name="robots" content="noindex">\n'
    + '<!-- ⚠️ ESTA FICHA NO SE EDITA A MANO. La arma `node _dev/arma-ficha.js ' + B._carpeta + '` desde\n'
    + '     misiones/' + B._carpeta + '/js/ficha.js y el CSS único de _dev/fichas-motor/ficha.css.\n'
    + '     Una corrección hecha aquí se pierde en el siguiente armado. -->\n'
    + '<style>\n' + raiz + css + propio + '</style>\n</head>\n<body>\n'
    + '<button class="imprimir-btn" onclick="window.print()">🖨️ Imprimir la ficha</button>\n\n<div class="doc">\n\n'
    + hojas.join('\n\n') + '\n\n' + docente + '\n\n</div>\n</body>\n</html>\n';
}

/* ── Releer lo escrito con el lector de las sondas ──────────── */
/* El armador y el lector tienen que hablar igual. Si el lector no ve las
   mismas preguntas y la misma pauta que el bloque, las sondas vigilarían
   otra ficha que la que se publicó: se dice aquí, antes de escribir. */
function relee(B, html) {
  const P = B.practica, leida = F.itemsFicha(html);
  exige(leida && !leida.faltan, 'el lector (_dev/lib-ficha.js) no entiende la ficha armada');
  const de = b => leida.items.filter(it => it.banco === 'ficha ' + b);
  const [I, II, III, IV] = ROMANOS.map(de);
  exige(I.length === P.completar.length && II.length === P.vf.length && III.length === P.seleccion.length && IV.length === P.pareados.pares.length,
    'el lector cuenta ' + [I, II, III, IV].map(x => x.length).join(', ') + ' preguntas y el bloque trae ' + [P.completar, P.vf, P.seleccion, P.pareados.pares].map(x => x.length).join(', '));
  const txt = h => F.limpiaHtml(h);
  I.forEach((it, i) => exige(it.resp === txt(P.completar[i].a), 'Completar ' + (i + 1) + ': el lector lee «' + it.resp + '» en la pauta y el bloque dice «' + P.completar[i].a + '»'));
  III.forEach((it, i) => exige(it.resp === F.sinLetra(txt(P.seleccion[i].o[P.seleccion[i].a])), 'Selección ' + (i + 1) + ': el lector lee otra correcta en la pauta'));
  IV.forEach((it, i) => exige(it.def === txt(P.pareados.pares[i].def), 'Pareado ' + (i + 1) + ': el lector lo une con otra definición'));
  const vf = F.pautaVF(html);
  P.vf.forEach((q, i) => exige(vf[i + 1] === (q.a ? 'V' : 'F'), 'Verdadero o falso ' + (i + 1) + ': la pauta escrita no es la del bloque'));
}

/* ── Armar una ───────────────────────────────────────────────── */
function arma(carpeta, revisa) {
  const B = leeBloque(carpeta);
  B._carpeta = carpeta;
  const examen = examenDe(carpeta);
  const todas = comprueba(B, carpeta, examen);
  const html = pinta(B);
  relee(B, html);
  const salida = path.join(DIR_FICHAS, B.archivo + '.html');
  const ensayados = new Set([].concat(...todas.map(q => [].concat(q.ensaya || []))));
  const resumen = B.archivo + '.html · ' + (B.hojas.length + 1) + ' hojas · ' + todas.length + ' preguntas de práctica, ninguna del examen · ensaya ' + ensayados.size + ' de los ' + examen.datos.size + ' datos que preguntan sus pruebas';
  if (revisa) {
    const igual = fs.existsSync(salida) && fs.readFileSync(salida, 'utf8') === html;
    console.log((igual ? '  ✅ ' : '  ❌ ') + resumen + (igual ? ' · la publicada es la que sale del bloque' : ' · LA PUBLICADA NO ES LA QUE SALE DEL BLOQUE: falta armarla, o se editó a mano'));
    return igual;
  }
  fs.writeFileSync(salida, html);
  console.log('  ✍️  ' + resumen);
  return true;
}

/* Para la sonda: ¿la ficha publicada es, letra por letra, la que sale del
   bloque? Devuelve '' si lo es, o por qué no. No escribe ni imprime. */
function difiereDelBloque(carpeta) {
  try {
    const B = leeBloque(carpeta);
    B._carpeta = carpeta;
    comprueba(B, carpeta, examenDe(carpeta));
    const html = pinta(B);
    relee(B, html);
    const salida = path.join(DIR_FICHAS, B.archivo + '.html');
    return fs.existsSync(salida) && fs.readFileSync(salida, 'utf8') === html ? '' : 'la ficha publicada no es la que sale de su bloque: falta armarla, o se editó a mano';
  } catch (e) {
    if (!(e instanceof Rechazo)) throw e;
    return 'el armador se niega a armarla: ' + e.message;
  }
}

/* La ficha de una misión que todavía no se armó, en la memoria: la misma
   que escribiría `arma`, sin escribirla y sin pedir su QR. Es para las
   sondas, que así vigilan la práctica de una misión nacida (que no copie
   el examen, que ninguna pregunta regale otra) desde el día en que se
   escribe su bloque y no desde el día en que se imprime. Si el bloque está
   mal, lanza el mismo Rechazo que `arma`. */
function enMemoria(carpeta) {
  const B = leeBloque(carpeta);
  B._carpeta = carpeta;
  comprueba(B, carpeta, examenDe(carpeta), true);
  const html = pinta(B);
  relee(B, html);
  return { html, bloque: B, archivo: B.archivo };
}

function conBloque() {
  return fs.readdirSync(L.DIR_MISIONES).sort().filter(c => fs.existsSync(path.join(L.DIR_MISIONES, c, 'js', 'ficha.js')));
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const revisa = args.includes('--revisa');
  const pedidas = args.filter(a => !a.startsWith('--'));
  const lista = pedidas.length ? pedidas : conBloque();
  if (!lista.length) { console.log('No hay ninguna misión con bloque de ficha (misiones/<carpeta>/js/ficha.js).'); process.exit(0); }
  console.log('\n📄 ' + (revisa ? 'Revisar' : 'Armar') + ' ' + lista.length + ' ficha(s) desde su bloque\n');
  let mal = 0;
  lista.forEach(c => {
    try { if (!arma(c, revisa)) mal++; }
    catch (e) {
      if (!(e instanceof Rechazo)) throw e;
      mal++; console.log('  ❌ ' + c + ': ' + e.message);
    }
  });
  if (!revisa && !mal) console.log('\nAhora:  node _dev/verifica-ficha-paginas.js ' + lista.map(c => { try { return leeBloque(c).archivo; } catch (e) { return ''; } }).join(' ') + '\n        node _dev/verifica-ficha-no-copia-examen.js --anota');
  process.exit(mal ? 1 : 0);
}

module.exports = { arma, enMemoria, difiereDelBloque, conBloque, leeBloque, pinta, comprueba, examenDe, PALETAS, Rechazo };
