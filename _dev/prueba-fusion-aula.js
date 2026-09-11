/* ============================================================
   M.E.T.A.S · La fusión de los datos del aula, caso por caso
   ------------------------------------------------------------
   Sin navegador y en un segundo, porque esto hay que poder correrlo
   cada vez que se toca: lo que vigila es que **no se pierda el trabajo
   del maestro** cuando usa el teléfono y la PC el mismo día.

   El caso que le da nombre está medido (9 de septiembre de 2026): pasa
   lista en el teléfono a las 9:00 sin señal, pone una nota en la PC a
   las 20:00, y al volver la señal la asistencia desaparecía.

   Uso:  node _dev/prueba-fusion-aula.js
   ============================================================ */
'use strict';
const F = require('../js/metas-fusion-aula.js');

let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra)));
  if (!cond) fallos++;
};
const J = o => JSON.stringify(o);
const P = s => JSON.parse(s);
/* fusionar devolviendo objeto; ganaLocal = a quién se le hace caso en un
   empate de verdad (los dos cambiaron el MISMO dato) */
const fus = (b, l, r, ganaLocal) => {
  const s = F.fusionar(b === null ? null : J(b), J(l), J(r), !!ganaLocal);
  return s === null ? null : P(s);
};

/* Un aula como la de verdad: {v, activo, grupos:[{…}]} */
const alumnos = [{ num: 1, nombre: 'Ana López' }, { num: 2, nombre: 'Luis Cruz' }, { num: 3, nombre: 'Sara Mejía' }];
function aula(extra) {
  return { v: 2, activo: 'G1', grupos: [Object.assign({
    id: 'G1', escuela: 'John Arnold Cook', grado: '6', seccion: '1',
    materias: ['Español', 'Matemáticas'], lista: alumnos.map(a => Object.assign({}, a)),
    colectas: [], asistencia: [], notas: {}, controles: [], bitacora: [], lectura: [], convocatorias: []
  }, extra || {})] };
}
const g0 = o => o.grupos[0];

console.log('\n▶ 1 · El caso del hallazgo: el teléfono y la PC, el mismo día');
{
  const base = aula();
  const tel = aula({ asistencia: [{ f: '2026-09-09', aus: { 2: 'F' } }] });        // 9:00, sin señal
  const pc  = aula({ notas: { p1: { 'Español': { 1: '85' } } } });                 // 20:00
  const m = fus(base, tel, pc, false);   // gana la PC en los empates: es la más nueva
  ok('la asistencia del teléfono no se pierde', g0(m).asistencia.length === 1 && g0(m).asistencia[0].f === '2026-09-09', g0(m).asistencia);
  ok('la falta de Luis sigue anotada', J(g0(m).asistencia[0].aus) === J({ 2: 'F' }));
  ok('la nota de la PC tampoco se pierde', g0(m).notas.p1['Español'][1] === '85', g0(m).notas);
  ok('los tres alumnos siguen ahí', g0(m).lista.length === 3);
}

console.log('\n▶ 2 · Y al revés, que es lo que pasa con el reloj del teléfono adelantado');
{
  const base = aula();
  const tel = aula({ asistencia: [{ f: '2026-09-09', aus: { 2: 'F' } }] });
  const pc  = aula({ notas: { p1: { 'Español': { 1: '85' } } } });
  const m = fus(base, pc, tel, true);    // ahora el "local" es la PC y gana ella
  ok('siguen estando las dos cosas', g0(m).asistencia.length === 1 && g0(m).notas.p1['Español'][1] === '85');
}

console.log('\n▶ 3 · Borrar de verdad borra (con base)');
{
  const base = aula();
  const sinSara = aula(); g0(sinSara).lista = g0(sinSara).lista.filter(a => a.num !== 3);
  const otro = aula({ asistencia: [{ f: '2026-09-09', aus: {} }] });
  const m = fus(base, sinSara, otro, false);
  ok('el alumno borrado en un equipo no vuelve', g0(m).lista.length === 2 && !g0(m).lista.some(a => a.num === 3), g0(m).lista);
  ok('y lo del otro equipo sigue', g0(m).asistencia.length === 1);
}

console.log('\n▶ 4 · Editar gana a borrar: nunca se le quita al maestro lo que acaba de escribir');
{
  const base = aula();
  const borra = aula(); g0(borra).lista = g0(borra).lista.filter(a => a.num !== 3);
  const edita = aula(); g0(edita).lista[2].nombre = 'Sara Mejía Ortiz';
  const m = fus(base, borra, edita, true);
  const sara = g0(m).lista.find(a => a.num === 3);
  ok('el alumno editado sobrevive al borrado del otro equipo', !!sara && sara.nombre === 'Sara Mejía Ortiz', g0(m).lista);
}

console.log('\n▶ 5 · Sin base solo se une, y no se borra nada');
{
  const tel = aula({ asistencia: [{ f: '2026-09-09', aus: { 2: 'F' } }] });
  const pc  = aula({ notas: { p1: { 'Español': { 1: '85' } } } });
  const m = fus(null, tel, pc, false);
  ok('se conservan las dos cosas', g0(m).asistencia.length === 1 && g0(m).notas.p1['Español'][1] === '85');
  const sinSara = aula(); g0(sinSara).lista = g0(sinSara).lista.filter(a => a.num !== 3);
  const m2 = fus(null, sinSara, aula(), false);
  ok('sin base, un alumno borrado VUELVE (a propósito: revivir cuesta menos que perder)', g0(m2).lista.length === 3);
}

console.log('\n▶ 6 · Cuando los dos cambian LO MISMO, manda el reloj');
{
  const base = aula({ notas: { p1: { 'Español': { 1: '70' } } } });
  const a = aula({ notas: { p1: { 'Español': { 1: '85' } } } });
  const b = aula({ notas: { p1: { 'Español': { 1: '90' } } } });
  ok('gana el local cuando el local es el más nuevo', fus(base, a, b, true).grupos[0].notas.p1['Español'][1] === '85');
  ok('y gana la nube cuando la nube es la más nueva', fus(base, a, b, false).grupos[0].notas.p1['Español'][1] === '90');
}

console.log('\n▶ 7 · Las tomas de lectura no llevan id y varias caen el mismo día');
{
  const t1 = { f: '2026-09-09', num: 1, textoId: 'L4-01', ppm: 92 };
  const t2 = { f: '2026-09-09', num: 2, textoId: 'L4-01', ppm: 74 };
  const t3 = { f: '2026-09-09', num: 3, textoId: 'L4-02', ppm: 110 };
  const base = aula({ lectura: [t1] });
  const tel = aula({ lectura: [t1, t2] });
  const pc  = aula({ lectura: [t1, t3] });
  const m = fus(base, tel, pc, false);
  ok('las tomas de los dos equipos se conservan', g0(m).lectura.length === 3, g0(m).lectura.map(x => x.num));
}

console.log('\n▶ 8 · El MISMO día de asistencia, marcado en los dos equipos');
{
  const base = aula({ asistencia: [{ f: '2026-09-09', aus: { 2: 'F' } }] });
  const tel = aula({ asistencia: [{ f: '2026-09-09', aus: { 2: 'F', 3: 'F' } }] });
  const pc  = aula({ asistencia: [{ f: '2026-09-09', aus: { 1: 'P', 2: 'F' } }] });
  const m = fus(base, tel, pc, false);
  const aus = g0(m).asistencia[0].aus;
  ok('se juntan las faltas de los dos, alumno por alumno', J(aus) === J({ 1: 'P', 2: 'F', 3: 'F' }), aus);
}

console.log('\n▶ 9 · Las claves de familia: una tira ya entregada no se pierde jamás');
{
  const base = { 'G:G1': { 1: 'AB12', 2: 'CD34' } };
  const tel  = { 'G:G1': { 1: 'AB12', 2: 'CD34', 3: 'EF56' } };
  const pc   = { 'G:G1': { 1: 'AB12', 2: 'CD34' }, 'G:G2': { 1: 'GH78' } };
  const m = fus(base, tel, pc, false);
  ok('la clave nueva del teléfono se queda', m['G:G1'][3] === 'EF56', m);
  ok('el grupo nuevo de la PC también', m['G:G2'][1] === 'GH78');
  ok('y las de siempre no se tocan', m['G:G1'][1] === 'AB12' && m['G:G1'][2] === 'CD34');
}

console.log('\n▶ 10 · El orden de la lista es del maestro, no del azar');
{
  const base = aula();
  const tel = aula(); g0(tel).lista = [g0(tel).lista[2], g0(tel).lista[0], g0(tel).lista[1]];  // la reordenó
  const pc  = aula({ notas: { p1: {} } });
  const m = fus(base, tel, pc, true);   // el teléfono es el más nuevo
  ok('manda el orden del equipo más reciente', J(g0(m).lista.map(a => a.num)) === J([3, 1, 2]), g0(m).lista.map(a => a.num));
}

console.log('\n▶ 11 · Un grupo nuevo en cada equipo: los dos entran');
{
  const base = aula();
  const tel = aula(); tel.grupos.push({ id: 'G2', escuela: 'X', grado: '5', seccion: '1', lista: [], asistencia: [], notas: {} });
  const pc  = aula(); pc.grupos.push({ id: 'G3', escuela: 'Y', grado: '4', seccion: '2', lista: [], asistencia: [], notas: {} });
  const m = fus(base, tel, pc, false);
  ok('están los tres grupos', m.grupos.length === 3 && m.grupos.map(g => g.id).sort().join() === 'G1,G2,G3', m.grupos.map(g => g.id));
}

console.log('\n▶ 12 · Si algo no cuadra, NO se inventa: devuelve null y quien llama hace lo de siempre');
{
  ok('texto que no es JSON', F.fusionar(null, '{no json', '{}', false) === null);
  ok('una lista contra un objeto', F.fusionar(null, '[]', '{}', false) === null);
  ok('un número suelto', F.fusionar(null, '5', '6', false) === null);
  ok('nulo', F.fusionar(null, 'null', '{}', false) === null);
}

console.log('\n▶ 13 · Lo que ya era igual se queda igual (no se mueve un byte de más)');
{
  const a = aula({ asistencia: [{ f: '2026-09-09', aus: { 2: 'F' } }] });
  ok('dos copias idénticas dan la misma copia', J(fus(a, a, a, false)) === J(a));
  ok('y sin base también', J(fus(null, a, a, false)) === J(a));
}

console.log('\n' + '─'.repeat(52));
if (fallos) { console.log(`✖ ${fallos} fallo(s) en la fusión del aula.`); process.exit(1); }
console.log('✅ La fusión no pierde el trabajo del maestro.');
