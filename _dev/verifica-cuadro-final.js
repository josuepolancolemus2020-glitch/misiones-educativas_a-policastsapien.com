/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Cuadro final del año y colores de la boleta
   ──────────────────────────────────────────────────────────────
   El cuadro final reúne lo que trae el consolidado del SACE: una fila
   por alumno con personalidad final, nota final y recuperación de cada
   asignatura, inasistencias, promedio, valoración y observación. Esta
   sonda lo cuenta con un grupo INVENTADO y pide que diga lo mismo que la
   boleta:
   · nota final = promedio de los cuatro parciales, redondeado;
   · 69 reprueba la materia y el promedio alto no la salva;
   · falta un parcial → PENDIENTE y se dice qué falta, sin inventar nota;
   · personalidad S, MB, B, MB → MB (promedio 3 en número oficial);
   · recuperación «N/A» si aprobó; en blanco si no (no se inventa);
   · cuentan solo los de la lista oficial que siguen activos;
   · la boleta pinta cada nota con la escala, y su gráfica usa la misma.

   Uso:  node _dev/verifica-cuadro-final.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const SL = require('../js/tools/sace-lista.js');
const RS = require('../js/tools/cuadros-sace.js');

let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };
const igual = (a, b, t) => { const s = JSON.stringify(a) === JSON.stringify(b); ok(s, t + (s ? '' : '  → salió ' + JSON.stringify(a) + ', se esperaba ' + JSON.stringify(b))); };

const P = ['I', 'II', 'III', 'IV'];
const MATS = ['Español', 'Matemáticas', 'Educación Física'];
const PERS = ['Puntualidad', 'Espíritu de trabajo', 'Orden y presentación', 'Sociabilidad', 'Moralidad'];
const alumnos = [
  { num: 1, nombre: 'Alba Prueba Uno', sexo: 'F', idn: '0801201500001', sace: true, n: [[70, 70, 70, 70], [91, 91, 90, 91], [80, 80, 80, 80]] },
  { num: 2, nombre: 'Bruno Prueba Dos', sexo: 'M', idn: '0801201500002', sace: true, n: [[95, 95, 95, 95], [69, 69, 69, 69], [99, 99, 99, 99]] },
  { num: 3, nombre: 'Cira Prueba Tres', sexo: 'F', idn: '0801201500003', sace: true, n: [[80, 80, 80, null], [85, 85, 85, 85], [85, 85, 85, 85]] },
  { num: 4, nombre: 'Dimas Prueba Cuatro', sexo: 'M', idn: '0801201500004', sace: true, estado: 'trasladado', n: [[50, 50, 50, 50], [50, 50, 50, 50], [50, 50, 50, 50]] },
  { num: 5, nombre: 'Eva Fuera Sace', sexo: 'F', idn: '0801201500005', sace: false, n: [[100, 100, 100, 100], [100, 100, 100, 100], [100, 100, 100, 100]] },
  { num: 6, nombre: 'Fito Prueba Seis', sexo: 'M', idn: '0801201500006', sace: true, estado: 'ingreso', n: [[69, 70, 70, 70], [79, 80, 80, 80], [90, 91, 91, 91]] }
];
const notas = {};
P.forEach((p, pi) => {
  notas[p] = { Inasistencias: {} };
  MATS.forEach(m => { notas[p][m] = {}; });
  PERS.forEach(r => { notas[p][r] = {}; });
  alumnos.forEach(a => {
    MATS.forEach((m, mi) => { const v = a.n[mi][pi]; if (v != null) notas[p][m][a.num] = v; });
    PERS.forEach(r => { notas[p][r][a.num] = ['S', 'MB', 'B', 'MB'][pi]; });
    notas[p].Inasistencias[a.num] = pi;          // 0 + 1 + 2 + 3 = 6
  });
});
const grupo = { id: 'g', grado: '6', seccion: '1', materias: MATS.concat(['Tecnología']),
  lista: alumnos.map(a => { const x = Object.assign({}, a); delete x.n; return x; }), notas };

const antes = JSON.stringify(grupo);
const cf = RS.cuadroFinal(grupo, { SL, pers: PERS });
ok(JSON.stringify(grupo) === antes, 'el cuadro no cambia nada del grupo');

console.log('1 · Quién entra');
igual(cf.filas.map(f => f.num), [1, 2, 3, 6], 'los de la lista oficial que siguen: sin el trasladado ni el de fuera del SACE');
igual(cf.asigs.map(a => a.k), ['espanol', 'matematicas', 'fisica'], 'asignaturas en el orden del SACE; Tecnología sin notas no sale');
igual(cf.asigs.map(a => a.area), ['COMUNICACIÓN', 'MATEMÁTICAS', 'EDUCACIÓN FÍSICA'], 'cada una con su área');

console.log('\n2 · Las notas');
const f = n => cf.filas.find(x => x.num === n);
igual(f(1).notas.map(x => x.final), [70, 91, 80], 'Alba: 70, 90.75 → 91, 80');
igual([f(1).prom, f(1).valoracion, f(1).estado], [80, 'A', 'APROBADO'], 'Alba: promedio 80, valoración A, aprobado');
igual(f(1).notas.map(x => x.recup), ['N/A', 'N/A', 'N/A'], 'aprobó todo: recuperación N/A');
igual([f(2).prom, f(2).valoracion, f(2).estado], [88, 'A', 'REPROBADO'], 'Bruno: promedio 88 pero Matemáticas 69 → reprobado');
igual(f(2).notas.map(x => x.recup), ['N/A', '', 'N/A'], 'la materia reprobada deja la recuperación en blanco, para escribirla a mano');
igual([f(3).prom, f(3).estado, f(3).faltan], [null, 'PENDIENTE', ['Español (IV)']], 'Cira: sin el IV de Español → pendiente y se dice qué falta');
igual(f(3).notas[0].final, null, 'y no se inventa su nota de Español');
igual(f(6).notas.map(x => x.final), [70, 80, 91], 'Fito: 69.75 → 70, 79.75 → 80, 90.75 → 91');
igual([f(6).prom, f(6).valoracion, f(6).estado], [80, 'A', 'APROBADO'], 'Fito (ingreso): promedio 80, aprobado');
igual(f(1).pers, ['MB', 'MB', 'MB', 'MB', 'MB'], 'personalidad S, MB, B, MB → MB');
igual([cf.inasisFuente, f(1).inasis], ['parciales', 6], 'sin pase de lista: la suma de lo escrito en los cuatro parciales');
igual(f(1).idn, '0801201500001', 'trae la identidad');

console.log('\n2b · Inasistencias reales, del pase de lista');
{
  const g2 = JSON.parse(antes);
  g2.asistencia = [
    { f: '2026-03-02', aus: { 1: 'A', 2: 'E' } },
    { f: '2026-03-03', aus: { 1: 'A', 2: 'A' } },
    { f: '2026-03-03', aus: { 1: 'A' } },              // el mismo día repetido: cuenta una vez
    { f: '2026-03-04', aus: { 1: 'E', 6: 'E' } },      // excusas: no son inasistencia
    { f: '2026-03-05', aus: {} }
  ];
  const c2 = RS.cuadroFinal(g2, { SL, pers: PERS });
  const g = n => c2.filas.find(x => x.num === n).inasis;
  igual([c2.inasisFuente, c2.diasPase], ['pase', 4], 'con pase de lista, cuenta de ahí (4 días con lista)');
  igual([g(1), g(2), g(6)], [2, 1, 0], 'Alba 2 ausencias (con excusa no cuenta, día repetido una vez), Bruno 1, Fito 0');
  ok(g(3) === 0, 'y no usa la columna de los parciales (que decía 6)');
}

console.log('\n3 · El resumen del pie');
const r = cf.resumen;
igual([r.aprob, r.reprob, r.pend], [{ N: 1, V: 1, T: 2 }, { N: 0, V: 1, T: 1 }, { N: 1, V: 0, T: 1 }], 'aprobados 2, reprobados 1, pendientes 1, por sexo');
igual(r.promGrupo, Math.round((80 + 88 + 80) / 3 * 10) / 10, 'promedio del grupo con los que tienen promedio');
igual([r.porVal.E.T, r.porVal.A.T, r.porVal.B.T, r.porVal.I.T], [0, 3, 0, 0], 'valoraciones contadas');

console.log('\n4 · Excel');
const t = RS.cuadroFinalTabla(cf, SL.idnBonita);
igual(t.filas[0].vals.slice(0, 2), ['0801-2015-00001', 'Alba Prueba Uno'], 'la fila trae la identidad con guiones y el nombre');
igual(t.filas[1].vals.slice(-4), [6, 88, 'A', 'REPROBADO'], 'y al final inasistencias, promedio, valoración y observación');
ok(/falta Español \(IV\)/.test(t.filas[2].vals.slice(-1)[0]), 'el pendiente dice qué le falta');
const bytes = RS.xlsx([t], { titulo: 'CUADRO FINAL', datos: [], anchos: [4, 17, 34] });
ok(bytes.length > 1000 && Buffer.from(bytes).readUInt32LE(0) === 0x04034b50, 'el .xlsx se arma');

console.log('\n5 · La pantalla y la boleta');
const adm = fs.readFileSync(path.join(__dirname, '..', 'js', 'tools', 'registros-admin.js'), 'utf8');
ok(/id="ad-sace-cfinal"[^>]*>📒 Cuadro final del año</.test(adm), 'el botón 📒 está en Notas SACE');
const i0 = adm.indexOf('📒 CUADRO FINAL DEL AÑO'), i1 = adm.indexOf('🔎 BUSCAR DATOS PERDIDOS', i0);
const cfui = adm.slice(i0, i1);
ok(/size: letter landscape/.test(cfui) && /🖨️ Imprimir \/ PDF/.test(cfui) && /📥 Descargar Excel/.test(cfui), 'hoja carta horizontal, Imprimir / PDF y Excel');
ok(/adNotaEscalaClase\(n\.final\)/.test(cfui) && /✓ APROBADO/.test(cfui) && /✗ REPROBADO/.test(cfui), 'notas con color y observación con ✓ / ✗, no solo color');
ok(!/\.notas\b\s*\[[^\]]*\]\s*=/.test(cfui) && (cfui.match(/adSave\(/g) || []).length === 1, 'solo lectura: lo único que guarda son los datos del encabezado');
const bol = adm.slice(adm.indexOf('function adPrintBoletas('), adm.indexOf('function adPrintBoletas(') + 40000);
ok(/adNotaEscalaClase\(v\)/.test(bol) && /class="bl-escala"/.test(bol), 'la boleta pinta cada nota con la escala y trae la leyenda');
ok(/tr\.prom td\.nt-i/.test(bol), 'también la fila PROM.');
const graf = adm.slice(adm.indexOf('function adBoletaGraficoEstado('), adm.indexOf('function adBoletaGraficoEstado(') + 4000);
ok(/AD_NOTA_ESCALA_INFO/.test(graf) && !/adNotaCat\(/.test(graf), 'la gráfica de la boleta usa la misma escala que la tabla');

const tr = adm.slice(adm.indexOf("getElementById('ad-inasis-traer')?.addEventListener"), adm.indexOf("getElementById('ad-inasis-traer')?.addEventListener") + 2500);
ok(/r\.aus\[num\] === 'A'/.test(tr) && /vistos\[r\.f\]/.test(tr), '«Traer faltas» cuenta solo Ausente, cada día una vez');
ok(/cruces/.test(tr), 'y avisa si el rango se cruza con otro parcial');
ok(/excusas no cuentan/.test(adm), 'la ayuda lo dice');

console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ El cuadro final dice lo mismo que la boleta');
process.exit(fallos ? 1 : 0);
