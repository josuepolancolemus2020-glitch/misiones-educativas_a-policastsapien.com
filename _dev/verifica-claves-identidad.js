/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · La clave de familia viaja con su niño
   ──────────────────────────────────────────────────────────────
   Las claves viven en METAS_CODIGOS_V1 ({ 'G:<grupo>': { num: clave } })
   y se sincronizan aparte de la lista. Si otro equipo traía el mapa con la
   numeración vieja, el #17 apuntaba a la clave de otro niño: esa familia
   veía pagos, notas y recibos ajenos.

   Con la app de verdad (registros-admin.js en el simulador), se pide:
   · los alumnos de antes reciben su clave en la lista, sin cambiar ninguna;
   · reordenar lleva la clave con el niño, en el mapa y en la lista;
   · un mapa viejo que llega de otro equipo se corrige solo;
   · el recibo de un pago sale con la clave de QUIEN pagó;
   · un número que apunta a la clave de otro niño se limpia (no se la da);
   · cambiar una clave a propósito, o pedir una nueva, no se revierte;
   · ninguna clave entregada cambia de valor.

   Uso:  node _dev/verifica-claves-identidad.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const S = require('./sace-prueba/simulador');

let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };

const ls = S.almacen();
const cloud = S.nube({});
ls.setItem('METAS_ADMIN_V1', JSON.stringify({ v: 2, activo: 'G1', grupos: [{
  id: 'G1', grado: '6', seccion: '1',
  lista: [{ num: 1, nombre: 'Ada Sevilla' }, { num: 2, nombre: 'Dayrin Orellana' }, { num: 3, nombre: 'Génesis Maldonado' }],
  colectas: [{ id: 'C1', concepto: 'Pupitres', montoAlumno: 600, fecha: '2026-07-14', pagos: { 3: 600 }, pagosF: {}, gastos: [] }],
  notas: {}, asistencia: [], materias: [],
}] }));
const ENTREGADAS = { 1: '1AAAA', 2: '2BBBB', 3: '3CCCC' };
ls.setItem('METAS_CODIGOS_V1', JSON.stringify({ 'G:G1': Object.assign({}, ENTREGADAS) }));

const app = S.equipo(ls, cloud);
/* el mapa de claves lo guarda js/tools/plan-accion.js, que el simulador no carga */
app.paCodesLoad = () => { try { return JSON.parse(ls.getItem('METAS_CODIGOS_V1')) || {}; } catch (_) { return {}; } };
app.paCodesSave = c => ls.setItem('METAS_CODIGOS_V1', JSON.stringify(c));
const run = src => require('vm').runInContext(src, app);
const mapa = () => app.paCodesLoad()['G:G1'];
const lista = () => run('adLoad()').lista;
const de = nombre => lista().find(a => a.nombre === nombre);

console.log('1 · Los alumnos de antes');
{
  lista();
  ok(lista().every(a => a.clave === ENTREGADAS[a.num]), 'cada alumno recibe en la lista la clave que ya tenía');
  ok(JSON.stringify(mapa()) === JSON.stringify(ENTREGADAS), 'el mapa no cambia');
}

console.log('\n2 · Reordenar (Dayrin al final)');
{
  run("adReordenarAlumnos([1, 3, 2], 'prueba')");
  ok(de('Génesis Maldonado').num === 2 && de('Génesis Maldonado').clave === '3CCCC' && mapa()[2] === '3CCCC',
    'Génesis pasa al #2 con SU clave, en la lista y en el mapa');
  ok(de('Dayrin Orellana').clave === '2BBBB' && mapa()[3] === '2BBBB', 'Dayrin, igual');
}

console.log('\n3 · Llega de otro equipo el mapa con la numeración vieja');
{
  ls.setItem('METAS_CODIGOS_V1', JSON.stringify({ 'G:G1': Object.assign({}, ENTREGADAS) }));
  lista();
  ok(mapa()[2] === '3CCCC' && mapa()[3] === '2BBBB' && mapa()[1] === '1AAAA', 'se corrige solo: cada número apunta a la clave de su niño');
  const recibos = run("adFilasNube(adState())").filter(f => f.tipo === 'economia' && f.estado === 'pago');
  ok(recibos.length === 1 && recibos[0].codigo === '3CCCC', 'el recibo del pago de Génesis sale con la clave de Génesis');
}

console.log('\n4 · Un número que apunta a la clave de otro niño');
{
  const st = JSON.parse(ls.getItem('METAS_ADMIN_V1'));
  st.grupos[0].lista.push({ num: 4, nombre: 'Luis Nuevo' });
  ls.setItem('METAS_ADMIN_V1', JSON.stringify(st));
  ls.setItem('METAS_CODIGOS_V1', JSON.stringify({ 'G:G1': Object.assign(mapa(), { 4: '1AAAA' }) }));
  lista();
  ok(mapa()[4] == null && !de('Luis Nuevo').clave && mapa()[1] === '1AAAA', 'Luis no se queda con la clave de Ada; Ada la conserva');
  const nueva = run("adClaveFamilia('G1', 4)");
  lista();
  ok(/^4[A-Z0-9]{4}$/.test(nueva) && de('Luis Nuevo').clave === nueva, 'Luis recibe una clave suya, y queda también en la lista');
}

console.log('\n5 · Cambiar una clave a propósito');
{
  run("adClaveFamiliaSet('G1', 2, '2ZZZZ')");
  lista(); lista();
  ok(mapa()[2] === '2ZZZZ' && de('Génesis Maldonado').clave === '2ZZZZ', 'la clave nueva queda en el mapa y en la lista, y no se revierte');
}

console.log('\n6 · Ninguna clave entregada cambia de valor');
{
  const vals = Object.values(mapa()).sort().join(',');
  ok(vals === ['1AAAA', '2BBBB', '2ZZZZ', run("adClaveFamilia('G1', 4, false)")].sort().join(','),
    'en el mapa solo están las de siempre, la cambiada a propósito y la del alumno nuevo');
}

console.log(fallos ? '\n✘ ' + fallos + ' fallo(s)' : '\n✓ La clave de familia viaja con su niño');
process.exit(fallos ? 1 : 0);
