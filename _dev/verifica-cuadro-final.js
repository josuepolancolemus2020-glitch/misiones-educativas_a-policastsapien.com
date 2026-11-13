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

console.log('\n2c · Recuperación');
{
  const g3 = JSON.parse(antes);
  const c0 = RS.cuadroFinal(g3, { SL, pers: PERS });
  const b0 = c0.filas.find(x => x.num === 2);
  igual([b0.estado, b0.recPend.map(x => x.et)], ['REPROBADO', ['Matemáticas']], 'Bruno sin recuperación: reprobado, recuperación pendiente en Matemáticas');
  ok(/recuperación pendiente: Matemáticas/.test(RS.observacion(b0)), 'y la observación lo dice');
  g3.recuperacion = { 'Matemáticas': { 2: 62 } };
  const b1 = RS.cuadroFinal(g3, { SL, pers: PERS }).filas.find(x => x.num === 2);
  igual([b1.estado, b1.notas[1].recup], ['REPROBADO', 62], 'recuperación con 62: sigue reprobado y la casilla muestra 62');
  ok(/no superó la recuperación: Matemáticas \(62\)/.test(RS.observacion(b1)), 'la observación dice que no la superó');
  g3.recuperacion = { 'Matemáticas': { 2: 70 } };
  const c2 = RS.cuadroFinal(g3, { SL, pers: PERS });
  const b2 = c2.filas.find(x => x.num === 2);
  igual([b2.estado, b2.prom, b2.valoracion], ['APROBADO EN RECUPERACIÓN', 88, 'A'], 'recuperación con 70: aprobado en recuperación; promedio y valoración siguen los ordinarios');
  igual([c2.resumen.aprobRec.T, c2.resumen.reprob.T], [1, 0], 'el pie lo cuenta aparte');
  g3.recuperacion = { 'Matemáticas': { 1: 99 } };
  ok(RS.cuadroFinal(g3, { SL, pers: PERS }).filas.find(x => x.num === 1).notas[1].recup === 'N/A', 'en una materia aprobada la recuperación no existe: N/A');
  ok(JSON.stringify(RS.cuadroFinal(g3, { SL, pers: PERS }).filas.find(x => x.num === 1).notas.map(n => n.final)) === '[70,91,80]', 'y no cambia ninguna nota');

  console.log('\n2d · Mensajes a las familias');
  const ctx = { docente: 'Docente de Prueba', grupo: '6º-1', centro: 'Escuela de Fantasía', anio: '2026', grado: 6 };
  const mR = RS.mensajeFamilia(c0.filas.find(x => x.num === 2), ctx);
  ok(/\*Bruno Prueba Dos\*/.test(mR) && /Matemáticas \(69\)/.test(mR) && /recuperación/.test(mR) && /Hicimos todo lo posible/.test(mR),
    'reprobado: nombre, materia con su nota, que se hizo todo lo posible y la recuperación');
  ok(/de la Escuela de Fantasía/.test(mR), 'redacción: «de la Escuela…»');
  const mA = RS.mensajeFamilia(c0.filas.find(x => x.num === 1), ctx);
  ok(/Felicidades/.test(mA) && /promedio de \*80\*/.test(mA) && /séptimo grado/.test(mA), 'aprobado: felicita, da el promedio y anima hacia séptimo grado');
  const mRec = RS.mensajeFamilia(b2, ctx);
  ok(/aprobó el grado\* después de presentar con éxito la recuperación de Matemáticas/.test(mRec), 'aprobado en recuperación: lo reconoce');
  const mG = RS.mensajeGrupo(c0, ctx);
  ok(!/Alba|Bruno|Cira|Fito/.test(mG) && /aprobaron el grado/.test(mG), 'el mensaje para el grupo no lleva ningún nombre');
  ok([mR, mA, mRec, mG].every(t => !/—/.test(t) && !/\bundefined\b|NaN/.test(t)), 'sin guiones largos ni huecos');
  ok(/del centro educativo JOHN ARNOLD COOK/.test(RS.mensajeFamilia(c0.filas[0], Object.assign({}, ctx, { centro: 'JOHN ARNOLD COOK' }))), 'redacción: «del centro educativo …»');
}

console.log('\n3 · El resumen del pie');
const r = cf.resumen;
igual([r.aprob, r.reprob, r.pend, r.aprobRec.T], [{ N: 1, V: 1, T: 2 }, { N: 0, V: 1, T: 1 }, { N: 1, V: 0, T: 1 }, 0], 'aprobados 2, reprobados 1, pendientes 1, por sexo');
igual(r.promGrupo, Math.round((80 + 88 + 80) / 3 * 10) / 10, 'promedio del grupo con los que tienen promedio');
igual([r.porVal.E.T, r.porVal.A.T, r.porVal.B.T, r.porVal.I.T], [0, 3, 0, 0], 'valoraciones contadas');

console.log('\n4 · Excel');
const t = RS.cuadroFinalTabla(cf, SL.idnBonita);
igual(t.filas[0].vals.slice(0, 2), ['0801-2015-00001', 'Alba Prueba Uno'], 'la fila trae la identidad con guiones y el nombre');
igual(t.filas[1].vals.slice(-4), [6, 88, 'A', 'REPROBADO: recuperación pendiente: Matemáticas'], 'y al final inasistencias, promedio, valoración y observación con su detalle');
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
ok(!/\.notas\b\s*\[[^\]]*\]\s*=/.test(cfui) && !/delete [^;]*\.notas/.test(cfui) && (cfui.match(/adSave\(/g) || []).length === 2 &&
  /dd\.boleta\[k\] = v/.test(cfui) && /dd\.recuperacion\[col\]\[num\] =/.test(cfui), 'no toca las notas: solo guarda el encabezado y la recuperación');
const bol = adm.slice(adm.indexOf('function adPrintBoletas('), adm.indexOf('function adPrintBoletas(') + 40000);
ok(/adNotaEscalaClase\(v\)/.test(bol) && /class="bl-escala"/.test(bol), 'la boleta pinta cada nota con la escala y trae la leyenda');
ok(/tr\.prom td\.nt-i/.test(bol), 'también la fila PROM.');
const graf = adm.slice(adm.indexOf('function adBoletaGraficoEstado('), adm.indexOf('function adBoletaGraficoEstado(') + 4000);
ok(/AD_NOTA_ESCALA_INFO/.test(graf) && !/adNotaCat\(/.test(graf), 'la gráfica de la boleta usa la misma escala que la tabla');

const tr = adm.slice(adm.indexOf("getElementById('ad-inasis-traer')?.addEventListener"), adm.indexOf("getElementById('ad-inasis-traer')?.addEventListener") + 2500);
ok(/r\.aus\[num\] === 'A'/.test(tr) && /vistos\[r\.f\]/.test(tr), '«Traer faltas» cuenta solo Ausente, cada día una vez');
ok(/cruces/.test(tr), 'y avisa si el rango se cruza con otro parcial');
ok(/excusas no cuentan/.test(adm), 'la ayuda lo dice');

ok(/id="ad-cf-lista-rep"/.test(adm) && /function adPrintListaReprobados/.test(adm) && /size: letter portrait/.test(adm.slice(adm.indexOf('function adPrintListaReprobados'))),
  'el listado de reprobados sale en una hoja carta');
const rg = adm.slice(adm.indexOf('function adRecGuardar('), adm.indexOf('function adRecGuardar(') + 700);
ok(/Math\.max\(1, Math\.min\(100/.test(rg) && /dd\.recuperacion\[col\]\[num\] = v/.test(rg), 'la nota de recuperación se guarda entre 1 y 100');

console.log('\n6 · La recuperación se escribe una vez y se ve en todas partes (noviembre de 2026)');
ok(/\.cf-rec-inp'\)\.forEach\(inp => \{\s*inp\.addEventListener\('input'/.test(adm) && /adCfTablaHtml\(cf\) \+ adCfPieHtml\(cf\)/.test(adm),
  'en el Cuadro final, el cuadro y su pie de aprobados cambian al escribir, sin repintar la ventana');
/* v504: la sección ya no es un <option> sino un botón de AD_SACE_VISTAS */
ok(/\{ k: 'recup', et: '✍️ Recuperación' \}/.test(adm) && /data-sel-vista="\$\{v\.k\}"/.test(adm) && /adRecCeldaHtml\(/.test(adm) && /data-parcial="REC"/.test(adm),
  'Notas SACE tiene la sección ✍️ Recuperación, aparte de los parciales, como en el SACE');
ok(/esRec\) \{\s*const v = adRecGuardar\(dd/.test(adm), 'y guarda en el mismo sitio que el Cuadro final');
ok(/id="ad-sace-rec-aviso"/.test(adm) && /contarBajo70\(dd\)/.test(adm), 'una nota que deja el final bajo 70 enciende el aviso de recuperación');
ok(/while \(i >= 0 && i < inputs\.length && inputs\[i\]\.disabled\) i \+= paso/.test(adm), 'el cursor salta las casillas N/A');
const css = fs.readFileSync(path.join(__dirname, '..', 'css', 'app.css'), 'utf8');
ok(/\.ad-mx-sticky \{\s*position: -webkit-sticky; position: sticky; left: 0;/.test(css) && /inset -2px 0 0 #0f2350/.test(css),
  'la columna de nombres queda inmovilizada, con su raya oscura');
{
  const g4 = JSON.parse(antes);
  const cuenta = () => { const rr = RS.calcular(g4, { SL }); const c = RS.cuadroFinal(g4, { SL, pers: PERS });
    return [rr.aprobados.T, rr.reprobados.T, rr.aprobadosRec.T, rr.porAsig.matematicas.A, c.resumen.aprob.T + c.resumen.aprobRec.T, c.resumen.reprob.T]; };
  const c0 = cuenta();
  g4.recuperacion = { 'Matemáticas': { 2: 75 } };
  const c1 = cuenta();
  igual([c1[0] - c0[0], c1[1] - c0[1], c1[2], c1[3] - c0[3]], [1, -1, 1, 1], 'Resumen final: el aprobado en recuperación pasa a aprobados, y su materia a A');
  ok(c1[0] === c1[4] && c1[1] === c1[5], 'Resumen final y Cuadro final cuentan lo mismo');
  g4.recuperacion = { 'Matemáticas': { 2: 60 } };
  igual(cuenta(), c0, 'con 60 sigue reprobado en los dos');
  ok(RS.notaFinal(g4, 'Matemáticas', 2) === 69 && RS.recuperacionDe(g4, 'Matemáticas', 2) === 60 && RS.recuperacionDe(g4, 'Español', 2) === null,
    'nota final y recuperación salen de una sola regla');
}

console.log('\n7 · Inasistencias del año: involuntarias y voluntarias, como en el SACE');
{
  const g5 = JSON.parse(antes);
  g5.boleta = { anio: '2026' };
  g5.asistencia = [{ f: '2026-02-03', aus: { 1: 'A', 2: 'E' } }, { f: '2026-02-04', aus: { 1: 'E', 2: 'A' } },
    { f: '2026-02-04', aus: { 1: 'E', 2: 'A' } }, { f: '2026-03-10', aus: { 1: 'A' } }];
  const ia = RS.inasistenciasAnio(g5);
  igual([ia.fuente, ia.dias], ['pase', 3], 'del pase de lista, cada fecha una sola vez');
  igual(ia.porAlumno[1], { inv: 1, vol: 2, total: 3 }, 'involuntarias = con excusa; voluntarias = Ausente sin excusa; total = las dos');
  igual(ia.porAlumno[3], { inv: 0, vol: 0, total: 0 }, 'quien no faltó: ceros');
  igual(RS.cuadroFinal(g5, { SL, pers: PERS }).filas.filter(f => f.num <= 2).map(f => f.inasis), [2, 1], 'el Cuadro final suma solo las voluntarias');
  const g6 = JSON.parse(antes);
  igual([RS.inasistenciasAnio(g6).fuente, RS.inasistenciasAnio(g6).porAlumno[1]], ['parciales', { inv: '', vol: 6, total: 6 }],
    'sin pase de lista: voluntarias de los parciales e involuntarias vacías, sin inventar un cero');
  ok(!/<option value="inasanio"/.test(adm) && /const esAnio = esInasis &&/.test(adm) && /data-ia="\$\{x\.k\}"/.test(adm) && /inasistenciasAnio\(dd\)\.porAlumno/.test(adm),
    'una sola sección 📅 Inasistencias: la del parcial y, a su lado, las del año con 📋 por columna');
  ok(/adDiasEntre\(desde, hasta\) > 100/.test(adm), '«Traer faltas» avisa si el rango del parcial es casi el año entero');
}

console.log('\n8 · Faltas que no se pusieron (noviembre de 2026: «Dayrin con 37»)');
{
  const g7 = JSON.parse(antes);
  g7.boleta = { anio: '2026' };
  g7.asistencia = [{ f: '2025-05-05', aus: { 1: 'A' } }, { f: '2025-05-06', aus: { 1: 'A' } },
    { f: '2026-02-03', aus: { 1: 'A' } }, { f: '2026-02-04', aus: { 1: 'E' } }, { f: '2026-02-04', aus: { 2: 'A', 1: 'A' } }];
  const ia = RS.inasistenciasAnio(g7);
  igual([ia.otrosAnios, ia.dias, ia.repetidos], [2, 2, 1], 'solo cuenta el año lectivo de la boleta; la fecha repetida, una vez');
  igual([ia.porAlumno[1], ia.porAlumno[2]], [{ inv: 1, vol: 1, total: 2 }, { inv: 0, vol: 1, total: 1 }],
    'en la fecha repetida manda la primera copia (la que enseña el pase de lista) y no se pierde lo que solo tiene la otra');
  igual(RS.cuadroFinal(g7, { SL, pers: PERS }).filas.find(f => f.num === 1).inasis, 1, 'el Cuadro final tampoco suma el año pasado');
  const iAsis = adm.indexOf("body.querySelectorAll('.ad-chip').forEach", adm.indexOf('function adRenderAsis('));
  const chip = adm.slice(iAsis, iAsis + 1200);
  ok(/adAsisDia\(dd, fechaSel, true\)/.test(chip) && !/dd\.asistencia = dd\.asistencia\.filter\(x => x !== r\)/.test(chip),
    'pase de lista: un día con todos presentes ya no se borra (el respaldo no le vuelve a pegar faltas)');
  const fus = adm.slice(adm.indexOf("if (act === 'fusionar')"), adm.indexOf("if (act === 'restaurar')"));
  ok(/dd\.asistencia\.some\(x => x && x\.f === r\.f\)\) return/.test(fus), 'recuperar de una versión no le suma faltas viejas a un día que ya existe');
  ok(/origen: fuente/.test(adm), 'el día pegado de un respaldo lleva de dónde vino');
  ok(/function adAsisRevisarModal/.test(adm) && /data-rf-num=/.test(adm) && /id="ad-asis-revisar"/.test(adm),
    '🔎 Revisar faltas: en 📋 Asistencia y en cada alumno de 📅 Inasistencias del año');
}

console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ El cuadro final dice lo mismo que la boleta');
process.exit(fallos ? 1 : 0);
