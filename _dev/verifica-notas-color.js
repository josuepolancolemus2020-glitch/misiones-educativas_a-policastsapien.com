/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Notas SACE: el color de cada casilla y las filas quietas
   ──────────────────────────────────────────────────────────────
   El maestro pidió dos cosas (noviembre de 2026):
   · cada nota con el color de su escala, la misma del Resumen final:
     hasta 69 rojo claro, 70 a 79 amarillo, 80 a 90 azul claro y
     91 a 100 verde; personalidad e inasistencias sin color;
   · mover (▲ ▼, tocar el #) y borrar (✕) alumnos, SOLO en 👥 Alumnos:
     en Notas SACE y en Identidad y contactos ya no están.

   Uso:  node _dev/verifica-notas-color.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const S = require('./sace-prueba/simulador');
const RS = require('../js/tools/cuadros-sace.js');

let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };

const ls = S.almacen();
const { raw } = S.aulaDePrueba();
S.sembrar(ls, raw, Date.now());
const eq = S.equipo(ls, S.nube({}));
const c = v => eq.adNotaEscalaClase(v);

console.log('1 · La escala de colores');
ok([1, 55, 69].every(v => c(v) === 'nt-i'), 'hasta 69: Inicial (rojo claro)');
ok([70, 75, 79].every(v => c(v) === 'nt-b'), '70 a 79: Básico (amarillo)');
ok([80, 85, 90].every(v => c(v) === 'nt-a'), '80 a 90: Avanzado (azul claro)');
ok([91, 95, 100].every(v => c(v) === 'nt-e'), '91 a 100: Excelente (verde)');
ok(['', null, undefined, 'MB', 'S', 0, 101, 'x'].every(v => c(v) === ''), 'vacío, letras y fuera de 1 a 100: sin color');
ok(c('70') === 'nt-b' && c(' 91 ') === 'nt-e', 'también cuando la nota viene como texto');
const corte = { nt_i: 'I', nt_b: 'B', nt_a: 'A', nt_e: 'E' };
ok([...Array(100)].map((_, i) => i + 1).every(v => corte[c(v).replace('-', '_')] === RS.escalaDe(v)),
  'del 1 al 100, el color dice lo mismo que la escala del Resumen final');

console.log('\n2 · La pantalla');
const adm = fs.readFileSync(path.join(__dirname, '..', 'js', 'tools', 'registros-admin.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'app.css'), 'utf8');
const sace = adm.slice(adm.indexOf('function adRenderSace('), adm.indexOf('function adRenderSace(') + 30000);
ok(/adNotaEscalaClase\(valOfP\(/.test(sace) && /!esLetra && cd\.campo !== 'Inasistencias'/.test(sace), 'la casilla nace con su color; personalidad e inasistencias no');
ok(/adNotaPintar\(inp\.closest\('td'\), raw\)/.test(adm), 'y cambia en vivo al escribir');
ok(/class="ad-nt-ley"/.test(sace) && /Inicial: hasta 69/.test(sace), 'arriba de la tabla va la leyenda con los cuatro colores en palabras');
['nt-i', 'nt-b', 'nt-a', 'nt-e'].forEach(k => ok(new RegExp('\\.ad-mx td\\.' + k).test(css) &&
  new RegExp(':root\\[data-theme="dark"\\] \\.ad-mx td\\.' + k).test(css), k + ': color en claro y en oscuro'));

console.log('\n3 · Mover y borrar, solo en 👥 Alumnos');
const fichas = adm.slice(adm.indexOf('<table class="ad-mx ad-fi-mx">'), adm.indexOf('</table>', adm.indexOf('<table class="ad-mx ad-fi-mx">')));
const tablaSace = sace.slice(sace.indexOf('<tbody>'), sace.indexOf('</tbody>'));
[['Notas SACE', tablaSace], ['Identidad y contactos', fichas]].forEach(([q, t]) => {
  ok(t.length > 0 && !/ad-mx-rmv|data-delnum|data-irnum|ad-mx-del/.test(t), q + ': sin ▲ ▼, sin # para mover y sin ✕');
});
ok(!/ev\.altKey && \(ev\.key === 'ArrowUp'/.test(sace), 'Notas SACE: Alt + flecha ya no mueve filas');
const lista = adm.slice(adm.indexOf('<div id="ad-lista-rows">'), adm.indexOf('<div id="ad-lista-rows">') + 3000);
ok(/ad-al-rmv/.test(lista) && /data-irnum/.test(lista) && /data-delnum/.test(lista), '👥 Alumnos conserva ▲ ▼, el # y el ✕');
ok(!/function adTablaFilasArrastrar/.test(adm), 'no queda código muerto de los botones quitados');

console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ Notas con su color, y mover o borrar solo en 👥 Alumnos');
process.exit(fallos ? 1 : 0);
