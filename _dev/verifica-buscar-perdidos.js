/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · El dinero de las colectas no se pierde entre equipos,
               y lo perdido se puede encontrar
   ──────────────────────────────────────────────────────────────
   Lo que pasó (noviembre de 2026, datos de este maestro, aquí con
   nombres inventados): el gasto «Entregado a dirección» de L 1,090 de
   la colecta de vigilancia y el pago de Luis en la de pupitres
   aparecieron anotados un día y al siguiente ya no estaban.

   Esta sonda pide, con dos equipos y la nube de mentira del simulador:
   · dos gastos del MISMO día anotados en dos equipos quedan los dos;
   · un pago anotado en un equipo sobrevive a otro equipo que guarda
     una copia leída antes (la ventanita de «¿Cuánto aportó?» abierta);
   · cuando la nube viene casi vacía, lo nuevo que trae no se tira;
   · «🔎 Buscar datos perdidos» encuentra en las copias el pago, el gasto
     y las notas que faltan, no lista lo que sigue ahí, y devolver solo
     AÑADE: no cambia ni borra nada de lo que hay;
   · borrar un gasto busca ESE gasto, no «el de la posición 3».

   Uso:  node _dev/verifica-buscar-perdidos.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const S = require('./sace-prueba/simulador');
const F = require('../js/metas-fusion-aula.js');
const BP = require('../js/tools/buscar-perdidos.js');

let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };

const COL = (extra) => Object.assign({ id: 'col-vig', concepto: 'Pago de vigilancia', montoAlumno: 240, fecha: '2026-07-14',
  pagos: { 1: 240, 3: 240 }, pagosF: { 1: '2026-07-14', 3: '2026-07-15' },
  gastos: [{ d: 'Entregado a dirección', m: 870, f: '2026-07-14' }, { d: 'Entregado a dirección', m: 780, f: '2026-07-14' }] }, extra || {});

function montar() {
  const { raw } = S.aulaDePrueba();
  const o = JSON.parse(raw);
  o.grupos[0].colectas = [COL(), { id: 'col-pup', concepto: 'Proyecto pupitres', montoAlumno: 600, fecha: '2026-07-14', pagos: { 1: 600 }, pagosF: {}, gastos: [] }];
  const r2 = JSON.stringify(o);
  const v0 = Date.now() - 86400e3;
  const cloud = S.nube({ METAS_ADMIN_V1: { raw: r2, version: v0 } });
  const lsA = S.almacen(), lsB = S.almacen();
  S.sembrar(lsA, r2, v0); S.sembrar(lsB, r2, v0);
  return { cloud, lsA, lsB };
}
const col = (g, id) => (g.colectas || []).find(c => c.id === id);
const deNube = cloud => JSON.parse(cloud.datos.METAS_ADMIN_V1.raw).grupos[0];

(async () => {
  console.log('1 · Dos gastos del mismo día, uno en cada equipo');
  {
    const base = { gastos: [{ d: 'A', m: 1, f: '2026-07-14' }] };
    const l = { gastos: [{ d: 'A', m: 1, f: '2026-07-14' }, { d: 'Entregado a dirección', m: 1090, f: '2026-11-10' }] };
    const r = { gastos: [{ d: 'A', m: 1, f: '2026-07-14' }, { d: 'Fotocopias', m: 50, f: '2026-11-10' }] };
    const out = JSON.parse(F.fusionar(JSON.stringify(base), JSON.stringify(l), JSON.stringify(r), true)).gastos;
    ok(out.length === 3 && out.some(g => g.m === 1090) && out.some(g => g.m === 50), 'quedan los dos gastos nuevos (' + out.length + ' en total)');
    const asis = F.fusionar(JSON.stringify({ a: [{ f: '2026-11-10', aus: { 1: 1 } }] }), JSON.stringify({ a: [{ f: '2026-11-10', aus: { 1: 1, 2: 1 } }] }),
      JSON.stringify({ a: [{ f: '2026-11-10', aus: { 1: 1, 5: 1 } }] }), true);
    ok(JSON.parse(asis).a.length === 1, 'un día de asistencia editado en dos equipos sigue siendo UN día');
  }

  console.log('\n2 · Gasto de L 1,090 en un equipo y pago editado con la ventanita abierta en el otro');
  {
    const { cloud, lsA, lsB } = montar();
    const A = S.equipo(lsA, cloud); A.__arrancar(); await A.__esperar();
    const B = S.equipo(lsB, cloud); B.__arrancar(); await B.__esperar();
    const viejo = B.adLoad();                                  // B toca a #3 y se abre «¿Cuánto aportó?»
    const dA = A.adLoad(); col(dA, 'col-vig').gastos.push({ id: 'Gx1', d: 'Entregado a dirección 10/11/26', m: 1090, f: '2026-11-10' });
    col(dA, 'col-pup').pagos[38] = 600; col(dA, 'col-pup').pagosF[38] = '2026-11-10';
    A.adSave(dA); await A.__esperar();                         // A sube el gasto y el pago de Luis
    await B.dsSync(); await B.__esperar();                     // le llega a B en segundo plano
    col(viejo, 'col-vig').pagos[3] = 180; B.adSave(viejo); await B.__esperar();   // «Guardar» en B
    const A2 = S.equipo(lsA, cloud); A2.__arrancar(); await A2.dsSync(); await A2.__esperar();
    [['A', S.grupo(lsA)], ['la nube', deNube(cloud)], ['B', S.grupo(lsB)]].forEach(([q, g]) => {
      ok(col(g, 'col-vig').gastos.some(x => x.m === 1090) && col(g, 'col-pup').pagos[38] === 600 && col(g, 'col-vig').pagos[3] === 180,
        q + ': el gasto de L 1,090, el pago de Luis y el monto corregido de #3 están');
    });
  }

  console.log('\n3 · La nube viene casi vacía pero trae algo nuevo');
  {
    const { cloud, lsA } = montar();
    const A = S.equipo(lsA, cloud); A.__arrancar(); await A.__esperar();
    const g = S.grupo(lsA);
    const flaco = { v: 2, activo: g.id, grupos: [{ id: g.id, grado: g.grado, seccion: g.seccion, lista: [], notas: {},
      colectas: [{ id: 'col-vig', pagos: { 9: 240 }, pagosF: { 9: '2026-11-11' }, gastos: [] }] }] };
    cloud.datos.METAS_ADMIN_V1 = { raw: JSON.stringify(flaco), version: Date.now() + 5 };
    const A2 = S.equipo(lsA, cloud); A2.__arrancar(); await A2.dsSync(); await A2.__esperar();
    const g2 = S.grupo(lsA);
    ok(g2.lista.length === g.lista.length, 'no se pierde la lista de este equipo (' + g2.lista.length + ')');
    ok(col(g2, 'col-vig').pagos[9] === 240, 'y el pago nuevo que traía la nube se queda');
  }

  console.log('\n4 · «Buscar datos perdidos» encuentra lo que falta');
  {
    const { lsA } = montar();
    const antes = JSON.parse(lsA.getItem('METAS_ADMIN_V1'));
    const g = antes.grupos[0];
    col(g, 'col-vig').gastos.push({ d: 'Entregado a dirección 10/11/26', m: 1090, f: '2026-11-10' });
    col(g, 'col-pup').pagos[38] = 600; col(g, 'col-pup').pagosF[38] = '2026-11-10';
    g.notas.IV = { 'Español': { 1: 88, 2: 90 } };
    const copia = JSON.stringify(antes);
    const ahora = JSON.parse(lsA.getItem('METAS_ADMIN_V1'));
    col(ahora.grupos[0], 'col-vig').pagos[5] = 240;               // algo nuevo que hay hoy
    const ahoraRaw = JSON.stringify(ahora);
    const items = BP.buscar(ahoraRaw, [{ raw: copia, cuando: '2026-11-11T15:40:00', fuente: 'respaldo' }]);
    const tipos = items.map(i => i.tipo).join(',');
    ok(items.some(i => i.tipo === 'pago' && i.num === '38' && i.monto === 600 && i.fecha === '2026-11-10'), 'encuentra el pago de Luis (#38, L 600, 10/11)');
    ok(items.some(i => i.tipo === 'gasto' && i.monto === 1090), 'encuentra el gasto de L 1,090');
    ok(items.filter(i => i.tipo === 'nota').length === 2, 'encuentra las 2 notas del IV parcial');
    ok(items.length === 4, 'y nada más: lo que sigue ahí no sale (' + tipos + ')');
    ok(items.every(i => i.vistoEn === '2026-11-11T15:40:00'), 'cada cosa dice en qué copia se vio');
    const g2 = JSON.parse(ahoraRaw).grupos[0];
    const n = BP.devolver(g2, items);
    ok(n === 4 && col(g2, 'col-pup').pagos[38] === 600 && col(g2, 'col-vig').gastos.length === 3 && g2.notas.IV['Español'][2] === 90,
      'devolver pone los 4 datos');
    ok(col(g2, 'col-vig').pagos[5] === 240 && col(g2, 'col-vig').pagos[1] === 240, 'y no toca lo que ya había');
    ok(BP.devolver(g2, items) === 0 && col(g2, 'col-vig').gastos.length === 3, 'devolver dos veces no duplica nada');
    const g3 = JSON.parse(ahoraRaw).grupos[0]; col(g3, 'col-pup').pagos[38] = 300;
    BP.devolver(g3, items);
    ok(col(g3, 'col-pup').pagos[38] === 300, 'si la casilla ya se llenó con otro monto, no la cambia');
    ok(BP.buscar(ahoraRaw, [{ raw: ahoraRaw }]).length === 0, 'una copia igual a lo de ahora no encuentra nada');
    ok(BP.buscar(ahoraRaw, [{ raw: 'no es json' }]).length === 0, 'una copia rota no revienta');
  }

  console.log('\n4b · El alumno se reconoce por su nombre, y lo quitado a propósito no vuelve');
  {
    /* la copia de hace dos semanas: Génesis era la #3 y ya había pagado
       los pupitres; después se ordenó la lista (Niñas y Varones) y hoy es
       la #1, sin pago. El #3 de hoy es otro niño. */
    const copia = { v: 2, activo: 'G', grupos: [{ id: 'G', lista: [
      { num: 1, nombre: 'Carlos Meza' }, { num: 2, nombre: 'Ana Ruiz' }, { num: 3, nombre: 'Génesis Janeth Maldonado' }],
      colectas: [{ id: 'pup', concepto: 'Pupitres', montoAlumno: 600, pagos: { 1: 600, 3: 600 }, pagosF: { 3: '2026-10-28' },
        gastos: [{ id: 'gA', d: 'Madera', m: 900, f: '2026-10-29' }] }] }] };
    const hoy = { v: 2, activo: 'G', grupos: [{ id: 'G', lista: [
      { num: 1, nombre: 'GENESIS JANETH MALDONADO' }, { num: 2, nombre: 'Ana Ruiz' }, { num: 3, nombre: 'Carlos Meza' }],
      colectas: [{ id: 'pup', concepto: 'Pupitres', montoAlumno: 600, pagos: { 3: 600 }, pagosF: {}, gastos: [] }] }] };
    let it = BP.buscar(JSON.stringify(hoy), [{ raw: JSON.stringify(copia), cuando: '2026-10-30T10:00', fuente: 'nube' }]);
    const pagos = it.filter(x => x.tipo === 'pago');
    ok(pagos.length === 1 && pagos[0].num === '1' && /GENESIS/i.test(pagos[0].nombre) && pagos[0].fecha === '2026-10-28',
      'el pago de Génesis vuelve a Génesis (#1 hoy), no al #3 de hoy');
    ok(!pagos.some(x => x.num === '3'), 'Carlos (#1 en la copia, #3 hoy) ya tiene su pago: no se duplica ni se mueve');
    const g = JSON.parse(JSON.stringify(hoy.grupos[0]));
    ok(BP.devolver(g, it) === 2 && g.colectas[0].pagos[1] === 600 && g.colectas[0].gastos.length === 1, 'devolver pone el pago y el gasto');
    /* el maestro quitó a propósito el pago de Génesis y borró el gasto */
    const hoy2 = JSON.parse(JSON.stringify(hoy));
    hoy2.grupos[0].colectas[0].quitados = { [BP.firmaAlumno({ nombre: 'Génesis Janeth Maldonado' })]: 1 };
    hoy2.grupos[0].colectas[0].gastosQuitados = [BP.gastoId({ id: 'gA' })];
    it = BP.buscar(JSON.stringify(hoy2), [{ raw: JSON.stringify(copia), cuando: '2026-10-30T10:00', fuente: 'nube' }]);
    ok(it.length === 0, 'lo quitado a propósito (pago y gasto) no vuelve solo');
    /* un alumno que ya no está en la lista no recibe nada */
    const hoy3 = JSON.parse(JSON.stringify(hoy)); hoy3.grupos[0].lista = hoy3.grupos[0].lista.filter(a => a.num !== 1);
    it = BP.buscar(JSON.stringify(hoy3), [{ raw: JSON.stringify(copia), cuando: '', fuente: 'nube' }]).filter(x => x.tipo === 'pago');
    ok(it.length === 0, 'si la alumna ya no está en la lista, su pago no se le pone a otro');
  }
  {
    const src = fs.readFileSync(path.join(__dirname, '../js/tools/registros-admin.js'), 'utf8');
    ok(/adRecuperarSoloProgramar\(\);\s*\n\s*\n\s*const savedState/.test(src), 'al pintar Mi aula se buscan solos los pagos y gastos perdidos');
    ok(/filter\(i => i\.tipo === 'pago' \|\| i\.tipo === 'gasto'\)/.test(src), 'lo automático es SOLO dinero de colectas (las notas van a mano)');
    ok(/adPagoQuitado\(cc, al, true\)/.test(src) && /gastosQuitados/.test(src), 'quitar un pago o borrar un gasto deja su marca');
    ok(/adUndoGuardar\('Antes de devolver/.test(src), 'antes de devolver solo se toma una foto de Deshacer');
    ok(/const deFamilias = await adPagosDesdeRegistroNube\(\)/.test(src) && /adPagosDesdeRegistroNube\(\)\.catch/.test(src),
      'también se busca en lo que ven las familias (registro_admin y su historial), solo y con 🔎');
    ok(/numDe\[id\.slice\(pre\.length\)\.toUpperCase\(\)\]/.test(src), 'el pago de la nube de familias se ubica por la clave de familia, no por el número');
  }

  console.log('\n5 · El código');
  {
    const adm = fs.readFileSync(path.join(__dirname, '..', 'js', 'tools', 'registros-admin.js'), 'utf8');
    const i = adm.indexOf("body.querySelectorAll('.ad-gasto-del')");
    const h = adm.slice(i, i + 900);
    ok(i > 0 && /dataset\.gf/.test(h) && /findIndex/.test(h) && !/splice\(\+b\.dataset\.gi/.test(h), 'borrar un gasto busca ESE gasto, no la posición');
    ok(/id: 'G' \+ Date\.now\(\)/.test(adm), 'cada gasto nuevo de colecta lleva su identidad');
    const ig = adm.indexOf("document.getElementById('ad-add-gasto').addEventListener");
    const hg = adm.slice(ig, ig + 2000);
    ok(ig > 0 && /type: 'date'/.test(hg) && /f: String\(fecha\)/.test(hg) && !/f: adHoy\(\) \}\)/.test(hg),
      'al anotar un gasto se elige el día (un gasto del 10/11 anotado el 12/11 queda con su fecha)');
    ok(/id="ad-col-perdidos"/.test(adm) && /id="ad-sace-perdidos"/.test(adm), 'el botón 🔎 está en la colecta y en Notas SACE');
    const bp = fs.readFileSync(path.join(__dirname, '..', 'js', 'tools', 'buscar-perdidos.js'), 'utf8');
    ok(!/localStorage|fetch\s*\(|supabase/i.test(bp), 'buscar-perdidos.js no guarda ni manda nada por su cuenta');
    const idx = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    ok(idx.indexOf('js/tools/buscar-perdidos.js') > 0 && idx.indexOf('js/tools/buscar-perdidos.js') < idx.indexOf('js/tools/registros-admin.js'),
      'index.html lo carga antes de Mi aula');
    const sql = fs.readFileSync(path.join(__dirname, '..', '_privado', 'SUPABASE-DOCENTE-HISTORIAL.sql'), 'utf8');
    ok(/exception when others/.test(sql) && /metas_docente_historial/.test(sql) && /_metas_docente_ok/.test(sql),
      'el SQL del historial valida la clave y nunca impide guardar');
  }

  console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ El dinero de las colectas no se pierde entre equipos, y lo perdido se encuentra');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error('✘ La sonda tropezó:', e.stack || e.message); process.exit(1); });
