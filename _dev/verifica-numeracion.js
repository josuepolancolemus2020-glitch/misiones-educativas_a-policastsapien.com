/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Dos equipos con la lista numerada distinto no cruzan datos
   ──────────────────────────────────────────────────────────────
   El caso real (noviembre de 2026, aquí con nombres parecidos): en un
   equipo se pasó a Dayrin del #2 al final y se borró a un alumno; en
   otro equipo, con la numeración de antes, se marcó el pago de Génesis
   en la colecta de pupitres y una nota. Al juntarse, el pago se perdió.

   Esta sonda pide, con la fusión de verdad (js/metas-fusion-aula.js)
   envuelta por js/metas-numeracion.js:
   · el pago y la nota quedan con SU alumno, venga de donde venga;
   · manda la numeración más reciente (el orden que eligió el maestro);
   · el borrado de un alumno no lo revive el otro equipo;
   · un alumno nuevo del otro equipo no pisa a nadie;
   · reordenar/borrar/insertar mueven TODO lo que va por número
     (recuperación, inasistencias oficiales, «no cuenta», equipos…).

   Uso:  node _dev/verifica-numeracion.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const F = require('../js/metas-fusion-aula.js');
const N = require('../js/metas-numeracion.js');
N.envolver(F);

let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };
const clon = o => JSON.parse(JSON.stringify(o));
const quien = (g, nombre) => (g.lista.find(a => N.normNom(a.nombre) === N.normNom(nombre)) || {}).num;

/* la base: lo último que los dos equipos tuvieron igual */
const BASE = { v: 2, activo: 'G1', grupos: [{
  id: 'G1', grado: '6', seccion: '1',
  lista: [
    { num: 1, nombre: 'Ada Sevilla', idn: '0511201501561' },
    { num: 2, nombre: 'Dayrin Liliana Orellana', idn: '0504201400093' },
    { num: 3, nombre: 'Génesis Janeth Maldonado', idn: '0511201500620' },
    { num: 4, nombre: 'Alumno de prueba', idn: '' },
    { num: 5, nombre: 'Emely Natalia García', idn: '0511201501481' },
  ],
  colectas: [{ id: 'pup', concepto: 'Pupitres', montoAlumno: 600, pagos: { 1: 600 }, pagosF: { 1: '2026-10-01' }, gastos: [] }],
  notas: { I: { Español: { 1: 90, 2: 80, 3: 70, 5: 85 } } },
  asistencia: [{ f: '2026-10-05', aus: { 2: 'A' } }],
}] };

/* Equipo A: pasa a Dayrin al final y borra al alumno de prueba (como lo
   hacen las pantallas: remapGrupo + lista renumerada + ordenT) */
function equipoA() {
  const o = clon(BASE), g = o.grupos[0];
  // borrar #4
  const restantes = g.lista.filter(a => a.num !== 4);
  const m1 = {}; restantes.forEach((a, i) => { m1[a.num] = i + 1; });
  N.remapGrupo(g, m1, true);
  // Dayrin (#2) al final: Ada 1, Génesis 2, Emely 3, Dayrin 4
  const orden = [1, 3, 4, 2];
  const m2 = {}; orden.forEach((n, i) => { m2[n] = i + 1; });
  N.remapGrupo(g, m2, false);
  g.lista.sort((a, b) => a.num - b.num);
  g.ordenT = 2000;
  return o;
}
/* Equipo B: numeración vieja; marca el pago de Génesis (#3), una nota de
   Emely (#5), la falta de Génesis y agrega a un alumno nuevo (#6) */
function equipoB() {
  const o = clon(BASE), g = o.grupos[0];
  g.colectas[0].pagos[3] = 600; g.colectas[0].pagosF[3] = '2026-10-28';
  g.notas.I.Español[5] = 95;
  g.asistencia[0].aus[3] = 'E';
  g.lista.push({ num: 6, nombre: 'Luis Nuevo', idn: '0511201509999', alta: 3000 });
  return o;
}

console.log('1 · El equipo que tenía la lista vieja sube sus cambios (fusiona en B)');
{
  const out = JSON.parse(F.fusionar(JSON.stringify(BASE), JSON.stringify(equipoB()), JSON.stringify(equipoA()), true));
  const g = out.grupos[0];
  const gen = quien(g, 'Génesis Janeth Maldonado'), day = quien(g, 'Dayrin Liliana Orellana'),
    em = quien(g, 'Emely Natalia García'), ada = quien(g, 'Ada Sevilla'), luis = quien(g, 'Luis Nuevo');
  ok(gen === 2 && em === 3 && day === 4, 'manda la numeración más reciente: Génesis #2, Emely #3, Dayrin al final (#4)');
  ok(g.colectas[0].pagos[gen] === 600 && g.colectas[0].pagosF[gen] === '2026-10-28', 'el pago de pupitres es de Génesis, con su fecha');
  ok(g.colectas[0].pagos[ada] === 600 && Object.keys(g.colectas[0].pagos).length === 2, 'nadie más recibe un pago que no dio');
  ok(g.notas.I.Español[em] === 95 && g.notas.I.Español[day] === 80 && g.notas.I.Español[gen] === 70, 'cada nota con su alumno (la nueva de Emely incluida)');
  ok(g.asistencia[0].aus[day] === 'A' && g.asistencia[0].aus[gen] === 'E', 'la asistencia, también');
  ok(!g.lista.some(a => /prueba/i.test(a.nombre)), 'el alumno borrado en A no revive');
  ok(luis === 5 && g.lista.length === 5, 'el alumno nuevo de B entra al final sin pisar a nadie (#5)');
  const nums = g.lista.map(a => a.num);
  ok(new Set(nums).size === nums.length, 'no hay dos alumnos con el mismo número');
}

console.log('\n2 · Al revés: el equipo que reordenó trae los cambios del otro (fusiona en A)');
{
  const out = JSON.parse(F.fusionar(JSON.stringify(BASE), JSON.stringify(equipoA()), JSON.stringify(equipoB()), true));
  const g = out.grupos[0];
  const gen = quien(g, 'Génesis Janeth Maldonado');
  ok(gen === 2 && g.colectas[0].pagos[gen] === 600, 'el pago de Génesis llega a Génesis (#2)');
  ok(g.notas.I.Español[quien(g, 'Emely Natalia García')] === 95, 'la nota de Emely llega a Emely');
  ok(!g.lista.some(a => /prueba/i.test(a.nombre)) && quien(g, 'Luis Nuevo') === 5, 'sin revivir al borrado y con el nuevo al final');
}

console.log('\n3 · Copias viejas sin sello de orden: manda este equipo, pero por identidad');
{
  const a = equipoA(); delete a.grupos[0].ordenT;
  const out = JSON.parse(F.fusionar(JSON.stringify(BASE), JSON.stringify(equipoB()), JSON.stringify(a), true));
  const g = out.grupos[0];
  const gen = quien(g, 'Génesis Janeth Maldonado');
  ok(g.colectas[0].pagos[gen] === 600 && g.notas.I.Español[quien(g, 'Dayrin Liliana Orellana')] === 80,
    'aunque gane la numeración de aquí, cada dato sigue con su alumno');
}

console.log('\n3b · Una copia ya tiene identidad interna y la otra todavía no');
{
  const a = equipoA(); a.grupos[0].lista.forEach((x, i) => { x.uid = 'U' + i; });
  const out = JSON.parse(F.fusionar(JSON.stringify(BASE), JSON.stringify(equipoB()), JSON.stringify(a), true));
  const g = out.grupos[0];
  ok(g.colectas[0].pagos[quien(g, 'Génesis Janeth Maldonado')] === 600 && !g.lista.some(x => /prueba/i.test(x.nombre)) &&
     quien(g, 'Luis Nuevo') === 5, 'igual cada dato con su alumno, el borrado no vuelve y el nuevo entra sin hueco');
}

console.log('\n4 · Lo mismo con un grupo suelto (el guardado que encuentra un cambio en medio)');
{
  const leido = clon(BASE.grupos[0]);
  const pantalla = clon(leido); pantalla.colectas[0].pagos[3] = 600;     // marca a Génesis con la lista vieja
  const ahora = equipoA().grupos[0];                                     // mientras, se reordenó
  const g = JSON.parse(F.fusionar(JSON.stringify(leido), JSON.stringify(pantalla), JSON.stringify(ahora), true));
  ok(g.colectas[0].pagos[quien(g, 'Génesis Janeth Maldonado')] === 600 && g.colectas[0].pagos[quien(g, 'Emely Natalia García')] == null,
    'el pago marcado con la pantalla vieja cae en Génesis, no en quien hoy tiene su número');
}

console.log('\n5 · Reordenar, borrar e insertar mueven TODO lo que va por número');
{
  const g = {
    id: 'G', lista: [{ num: 1, nombre: 'A' }, { num: 2, nombre: 'B' }, { num: 3, nombre: 'C' }],
    notas: { I: { Mat: { 1: 10, 3: 30 } } }, recuperacion: { Mat: { 3: 70 } }, inasisOficial: { 3: 4 },
    asistencia: [{ f: 'x', aus: { 3: 'A' } }],
    colectas: [{ id: 'c', pagos: { 3: 5 }, pagosF: { 3: 'f' }, noCuenta: [3] }],
    controles: [{ id: 'k', datos: { 3: true } }], lectura: [{ num: 3, ppm: 80 }],
    equipos: { reparto: '1,3|2', coord: [3], fuera: { nums: [3] }, separar: [[1, 3]] },
  };
  N.remapGrupo(g, { 1: 1, 2: 3, 3: 2 }, false);
  ok(g.notas.I.Mat[2] === 30 && g.recuperacion.Mat[2] === 70 && g.inasisOficial[2] === 4, 'notas, recuperación e inasistencias oficiales');
  ok(g.asistencia[0].aus[2] === 'A' && g.colectas[0].pagos[2] === 5 && g.colectas[0].pagosF[2] === 'f' && g.colectas[0].noCuenta[0] === 2,
    'asistencia, pagos con su fecha y los «no cuenta»');
  ok(g.controles[0].datos[2] === true && g.lectura[0].num === 2, 'controles y lectura');
  ok(g.equipos.reparto === '1,2|3' && g.equipos.coord[0] === 2 && g.equipos.fuera.nums[0] === 2 && g.equipos.separar[0][1] === 2,
    'equipos (el reparto en texto incluido)');
  N.remapGrupo(g, { 1: 1, 3: 2 }, true);    // borrar al que era #2 (hoy #2 es C… se borra el #2 actual)
  ok(g.notas.I.Mat[2] == null || g.notas.I.Mat[2] !== 30, 'al borrar, lo del borrado se va');
}

console.log('\n6 · Identidad interna');
{
  const g = { lista: [{ num: 1, nombre: 'A' }, { num: 2, nombre: 'B', uid: 'AX' }, { num: 3, nombre: 'C', uid: 'AX' }] };
  const n = N.asegurarUids(g);
  ok(n === 2 && g.lista.every(a => a.uid) && new Set(g.lista.map(a => a.uid)).size === 3, 'todos con uid, y sin repetidos');
  ok(N.asegurarUids(g) === 0, 'leer otra vez no cambia ningún uid');
  /* dos alumnos con el mismo nombre y sin identidad no se adivinan */
  const ref = { lista: [{ num: 1, nombre: 'Luis' }, { num: 2, nombre: 'Luis' }] };
  const otro = { lista: [{ num: 1, nombre: 'Luis' }, { num: 2, nombre: 'Luis' }] };
  ok(Object.keys(N.emparejar(ref, otro)).length === 0, 'dos «Luis» sin identidad no se emparejan a ciegas');
}

console.log('\n6b · Comunicados, conducta y Plan de Acción siguen a su alumno');
{
  /* la lista de HOY, ya reordenada en otro equipo: Génesis pasó del #3 al #2 */
  const lista = [{ num: 1, nombre: 'Ada Sevilla', uid: 'UA' }, { num: 2, nombre: 'Génesis Janeth Maldonado', uid: 'UG' },
    { num: 3, nombre: 'Emely Natalia García', uid: 'UE' }, { num: 4, nombre: 'Dayrin Liliana Orellana', uid: 'UD' }];
  /* llegan de un equipo con la numeración vieja (Génesis #3, Emely #5, un alumno borrado #4) */
  const gAv = {
    conducta: [
      { id: 'c1', num: 3, uid: 'UG', nombre: 'Génesis Janeth Maldonado', tipo: 'felicitacion' },
      { id: 'c2', num: 5, nombre: 'Emely Natalia García', tipo: 'llamado' },
      { id: 'c3', num: 4, nombre: 'Alumno de prueba', tipo: 'leve' },
    ],
    avisos: [
      { id: 'a1', tipo: 'individual', alumnos: [3, 5], alumnosId: [{ uid: 'UG', nombre: 'Génesis Janeth Maldonado' }, { nombre: 'Emely Natalia García' }] },
      { id: 'a2', tipo: 'individual', alumnos: [4], alumnosId: [{ nombre: 'Alumno de prueba' }] },
      { id: 'a3', tipo: 'aviso', alumnos: null },
    ],
  };
  ok(N.anclarAvisosGrupo(lista, gAv) === true, 'algo había que corregir');
  ok(gAv.conducta[0].num === 2 && gAv.conducta[1].num === 3 && gAv.conducta[1].uid === 'UE',
    'cada reporte de conducta va al número que su alumno tiene hoy (Génesis #2, Emely #3)');
  ok(gAv.conducta[2].num === 0 && gAv.conducta[2].numAntes === 4,
    'el reporte de un alumno que ya no está NO le llega a quien hoy tiene su número (queda en 0, sin borrarse)');
  ok(JSON.stringify(gAv.avisos[0].alumnos) === '[2,3]', 'el comunicado individual llega a Génesis y Emely');
  ok(JSON.stringify(gAv.avisos[1].alumnos) === '[0]', 'si ninguno sigue en la lista, el comunicado NO pasa a ser para todos');
  ok(N.anclarAvisosGrupo(lista, gAv) === false, 'anclar otra vez no cambia nada');
  /* registros de antes, sin identidad: se les pone según el número de hoy */
  const viejo = { conducta: [{ id: 'v', num: 4, tipo: 'leve' }], avisos: [{ id: 'v2', tipo: 'individual', alumnos: [1] }] };
  N.anclarAvisosGrupo(lista, viejo);
  ok(viejo.conducta[0].uid === 'UD' && /Dayrin/.test(viejo.conducta[0].nombre) && viejo.avisos[0].alumnosId[0].uid === 'UA',
    'a los registros de antes se les anota quién es, con la lista de este equipo');
  /* Plan de Acción: nombres de la lista se corrigen; escritos a mano distinto, se respetan */
  const ana = { students: [{ num: 3, nombre: 'Génesis Janeth Maldonado', nota: 55 }, { num: 9, nombre: 'Génesis M.', nota: 60 }] };
  N.anclarPlan(lista, ana);
  ok(ana.students[0].num === 2 && ana.students[0].uid === 'UG', 'en el Plan, Génesis pasa a su número de hoy');
  ok(ana.students[1].num === 9, 'un nombre escrito a mano que no está en la lista se deja como estaba');
}

console.log('\n7 · El código');
{
  const src = fs.readFileSync(path.join(__dirname, '../js/tools/registros-admin.js'), 'utf8');
  const idx = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  ok((src.match(/MetasNumeracion\.remapGrupo\(/g) || []).length >= 3, 'reordenar, borrar e insertar usan la lista única');
  ok((src.match(/\.ordenT = Date\.now\(\)/g) || []).length >= 3, 'las tres sellan cuándo cambió la numeración');
  ok(/MetasNumeracion\.asegurarUids/.test(src), 'cada alumno recibe su identidad interna al leer el aula');
  ok(/adAnclarFuera\(st\);/.test(src) && /anclarAvisosGrupo/.test(src) && /anclarPlan/.test(src),
    'al leer el aula se anclan comunicados, conducta y Plan de Acción');
  ok(/gg\.conducta\.push\(\{[^}]*uid: al\.uid/.test(src) && /alumnosId: tipo === 'individual'/.test(src),
    'los reportes y comunicados nuevos nacen con su identidad');
  ok(/const x = claves\.find\(k => k\.num === c\.num\);\s*if \(!x\) return;/.test(src),
    'un reporte con número 0 no sube a ninguna familia');
  ok(idx.indexOf('js/metas-fusion-aula.js') < idx.indexOf('js/metas-numeracion.js') &&
     idx.indexOf('js/metas-numeracion.js') < idx.indexOf('js/metas-docente-sync.js'),
    'index.html carga la numeración después de la fusión y antes de la sincronización');
  const plano = F.fusionar(JSON.stringify({ a: 1 }), JSON.stringify({ a: 2 }), JSON.stringify({ a: 1 }), true);
  ok(JSON.parse(plano).a === 2, 'lo que no es un aula se fusiona igual que siempre');
}

console.log(fallos ? '\n✘ ' + fallos + ' fallo(s)' : '\n✓ Dos equipos con la lista numerada distinto no cruzan datos');
process.exit(fallos ? 1 : 0);
