/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Revisar cruces entre equipos, caso por caso
   ──────────────────────────────────────────────────────────────
   El caso real (noviembre de 2026, aquí con nombres parecidos): un equipo
   pasó a Dayrin del #2 al final; otro, con la lista vieja (Génesis #3), se
   juntó POR NÚMERO y lo de Génesis cayó en quien hoy es el #3: Dayrin.

   Se pide a js/tools/revisa-cruces.js:
   · encuentra el cruce (de Génesis a Dayrin) y dice cuándo;
   · dice que SIGUE cruzado y qué casillas;
   · «arreglar» le devuelve a Dayrin lo suyo y a Génesis lo suyo, sin
     pisar lo que el maestro cambió después;
   · un reordenamiento hecho bien NO es un cruce;
   · corregir una nota o pasar lista NO es un cruce;
   · un pago nuevo justo al reordenar sale en «para confirmar».

   Uso:  node _dev/verifica-revisa-cruces.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
globalThis.MetasNumeracion = require('../js/metas-numeracion.js');
const R = require('../js/tools/revisa-cruces.js');

let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };
const clon = o => JSON.parse(JSON.stringify(o));
const aula = g => JSON.stringify({ v: 2, activo: 'G1', grupos: [g] });
const copia = (g, cuando) => ({ raw: aula(g), cuando, fuente: 'nube' });

/* Copia 1 · lista vieja: Génesis es la #3, con su pago y sus notas */
const C1 = {
  id: 'G1', grado: '6', seccion: '1',
  lista: [{ num: 1, nombre: 'Ada Sevilla' }, { num: 2, nombre: 'Dayrin Orellana' }, { num: 3, nombre: 'Génesis Maldonado' }],
  colectas: [{ id: 'pup', concepto: 'Pupitres', montoAlumno: 600, pagos: { 1: 600, 3: 600 }, pagosF: { 1: '2026-10-01', 3: '2026-10-28' } }],
  notas: { I: { Español: { 1: 90, 2: 61, 3: 95 }, Matemáticas: { 1: 88, 2: 62, 3: 97 } } },
  asistencia: [{ f: '2026-10-05', aus: { 2: 'A' } }],
};
/* Copia 2 · el equipo A reordena BIEN: Dayrin al final, todo se mueve con su niño */
const C2 = clon(C1);
C2.lista = [{ num: 1, nombre: 'Ada Sevilla' }, { num: 2, nombre: 'Génesis Maldonado' }, { num: 3, nombre: 'Dayrin Orellana' }];
C2.colectas[0].pagos = { 1: 600, 2: 600 }; C2.colectas[0].pagosF = { 1: '2026-10-01', 2: '2026-10-28' };
C2.notas.I.Español = { 1: 90, 2: 95, 3: 61 }; C2.notas.I.Matemáticas = { 1: 88, 2: 97, 3: 62 };
C2.asistencia[0].aus = { 3: 'A' };
/* Copia 3 · el equipo viejo se junta POR NÚMERO: lo de Génesis (#3 viejo) cae en Dayrin (#3 hoy),
   y Génesis se queda sin pago */
const C3 = clon(C2);
C3.colectas[0].pagos = { 1: 600, 3: 600 }; C3.colectas[0].pagosF = { 1: '2026-10-01', 3: '2026-10-28' };
C3.notas.I.Español = { 1: 90, 2: 95, 3: 95 }; C3.notas.I.Matemáticas = { 1: 88, 2: 97, 3: 97 };
/* Hoy · después el maestro corrigió la nota de Matemáticas de Dayrin a mano (eso se respeta) */
const HOY = clon(C3);
HOY.notas.I.Matemáticas[3] = 70;

console.log('1 · Encuentra el cruce');
const res = R.analizar(aula(HOY), [copia(C1, '2026-10-29T08:00:00Z'), copia(C2, '2026-10-30T08:00:00Z'), copia(C3, '2026-10-31T08:00:00Z')]);
const caso = res.casos[0];
ok(res.casos.length === 1, 'un solo caso (' + res.casos.length + ')');
ok(caso && /Dayrin/.test(caso.a.nombre) && /Génesis/.test(caso.de.nombre) && caso.cuando === '2026-10-31T08:00:00Z',
  'de Génesis a Dayrin, el 31/10');
ok(caso && caso.sigue && caso.campos.some(c => c.campo === 'p|pup' && c.sigue) && caso.campos.some(c => c.campo === 'n|I|Español' && c.sigue),
  'sigue cruzado: el pago de pupitres y la nota de Español');
ok(caso && caso.campos.some(c => c.campo === 'n|I|Matemáticas' && !c.sigue),
  'la nota de Matemáticas que el maestro corrigió después NO se cuenta como cruzada');
ok(res.revisadas === 3, 'revisó las 3 copias');

console.log('\n2 · Arreglar le devuelve a cada quien lo suyo');
{
  const g = clon(HOY);
  const n = R.arreglar(g, caso);
  ok(g.notas.I.Español[3] === 61 && g.notas.I.Español[2] === 95, 'Dayrin vuelve a su 61 en Español; Génesis conserva su 95');
  ok(g.colectas[0].pagos[3] == null && g.colectas[0].pagosF[3] == null, 'Dayrin ya no tiene un pago que no dio');
  ok(g.colectas[0].pagos[2] === 600 && g.colectas[0].pagosF[2] === '2026-10-28', 'Génesis tiene su pago, con su fecha');
  ok(g.notas.I.Matemáticas[3] === 70, 'lo que el maestro corrigió después se respeta');
  ok(n >= 3, 'tocó ' + n + ' casillas');
  ok(R.arreglar(g, caso) === 0, 'arreglar dos veces no cambia nada más');
}

console.log('\n3 · Lo que NO es un cruce');
{
  const r2 = R.analizar(aula(C2), [copia(C1, '2026-10-29T08:00:00Z')]);
  ok(r2.casos.length === 0, 'un reordenamiento hecho bien no es un cruce');
  const C2b = clon(C2); C2b.notas.I.Español[3] = 65; C2b.asistencia.push({ f: '2026-10-30', aus: { 1: 'A', 3: 'E' } });
  C2b.notas.II = { Español: { 1: 95, 2: 95, 3: 61 } };
  const r3 = R.analizar(aula(C2b), [copia(C1, '2026-10-29T08:00:00Z'), copia(C2, '2026-10-30T08:00:00Z')]);
  ok(r3.casos.length === 0, 'corregir una nota, pasar lista o llenar otro parcial no es un cruce');
}

console.log('\n4 · Un pago nuevo justo al reordenar sale «para confirmar»');
{
  const C2c = clon(C2); C2c.colectas[0].pagos[3] = 600; C2c.colectas[0].pagosF[3] = '2026-10-30';
  const r4 = R.analizar(aula(C2c), [copia(C1, '2026-10-29T08:00:00Z')]);
  ok(r4.casos.length === 0 && r4.revisar.length === 1 && /Dayrin/.test(r4.revisar[0].nombre) && r4.revisar[0].monto === 600,
    'el pago de Dayrin que apareció al reordenar se pide confirmar con la hoja');
}

console.log('\n5 · La pantalla');
{
  const fs = require('fs'), path = require('path');
  const src = fs.readFileSync(path.join(__dirname, '../js/tools/registros-admin.js'), 'utf8');
  const idx = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  ok(/class="pa-generate-btn ad-btn-sec ad-cruces-btn"/.test(src) && /adCrucesTarjetaHtml\(\)/.test(src), 'el botón está junto a «Deshacer», en Mi aula');
  ok(/window\.dsHistorial\(ADMIN_KEY, 50\)/.test(src.slice(src.indexOf('async function adRevisarCrucesModal'))), 'revisa también la nube del último mes');
  ok(/adUndoGuardar\('Antes de deshacer el cruce/.test(src), 'antes de arreglar se guarda una foto de Deshacer');
  ok(/adPagoQuitado\(col, al, true\)/.test(src.slice(src.indexOf('async function adRevisarCrucesModal'))),
    'el pago ajeno que se quita no lo devuelve la recuperación automática');
  ok(/js\/tools\/revisa-cruces\.js\?v=\d+/.test(idx), 'index.html lo carga');
}

console.log(fallos ? '\n✘ ' + fallos + ' fallo(s)' : '\n✓ Los cruces se encuentran caso por caso y se arreglan sin pisar nada');
process.exit(fallos ? 1 : 0);
