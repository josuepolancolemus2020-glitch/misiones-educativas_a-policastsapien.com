/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Resumen final de resultados por grado: cada cuenta
   ──────────────────────────────────────────────────────────────
   Un grupo de prueba INVENTADO (nombres de fantasía, ningún alumno real)
   con todo lo que puede torcer el formulario:
     · notas finales de 69, 70, 79, 80, 90 y 91 (los bordes de la escala)
       y parciales que redondean (69, 70, 70, 71 → 70; 90, 91, 91, 91 → 91);
     · un ingreso con promedio Excelente que igual reprueba una materia;
     · un traslado y una desertora con notas (no deben contarse);
     · un alumno al que le falta un parcial (Sin nota completa);
     · uno FUERA del SACE con puros 100 (no debe aparecer en nada);
     · el registro de prueba del maestro;
     · Tecnología con columna pero sin una sola nota (va con «·»);
     · edades en 6, 6 ½ (justo 6 años 6 meses), 7…14 y más de 14.
   Cada cuadro se compara con lo que se contó a mano.

   Y mira el código: el cálculo no escribe nada en el grupo, no guarda
   y no manda nada fuera; la pantalla solo guarda el Período.

   Uso:  node _dev/verifica-cuadros-sace.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const RAIZ = path.resolve(__dirname, '..');
const SL = require(path.join(RAIZ, 'js', 'tools', 'sace-lista.js'));
const RS = require(path.join(RAIZ, 'js', 'tools', 'cuadros-sace.js'));

let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };
const igual = (a, b, t) => {
  const s = JSON.stringify(a) === JSON.stringify(b);
  ok(s, t + (s ? '' : '  → salió ' + JSON.stringify(a) + ', se esperaba ' + JSON.stringify(b)));
};

/* ── el grupo ficticio ── */
const MATS = ['Español', 'Inglés', 'Educación Artística', 'Matemáticas', 'Ciencias Sociales',
  'Ciencias Naturales', 'Educación Física', 'Educación Cívica', 'Tecnología', 'Caligrafía'];
const SIN_TEC = MATS.filter(m => m !== 'Tecnología' && m !== 'Caligrafía');
const P = ['I', 'II', 'III', 'IV'];

const alumnos = [
  { num: 1,  nombre: 'Alba Prueba Uno',     sexo: 'F', fnac: '2020-08-15', sace: true, n: 70 },
  { num: 2,  nombre: 'Bruno Prueba Dos',    sexo: 'M', fnac: '2020-05-30', sace: true, n: 69 },
  { num: 3,  nombre: 'Cira Prueba Tres',    sexo: 'F', fnac: '2017-06-01', sace: true, n: 79 },
  { num: 4,  nombre: 'Dimas Prueba Cuatro', sexo: 'M', fnac: '2012-01-01', sace: true, n: 80 },
  { num: 5,  nombre: 'Eva Prueba Cinco',    sexo: 'F', fnac: '2011-05-05', sace: true, n: 90 },
  { num: 6,  nombre: 'Fito Prueba Seis',    sexo: 'M', fnac: '2016-02-02', sace: true, n: 91 },
  { num: 7,  nombre: 'Gala Prueba Siete',   sexo: 'F', fnac: '2015-07-07', sace: true, n: 95, estado: 'ingreso', estadoF: '2026-03-02' },
  { num: 8,  nombre: 'Hilo Prueba Ocho',    sexo: 'M', fnac: '2014-04-04', sace: true, n: 50, estado: 'trasladado', estadoF: '2026-06-15' },
  { num: 9,  nombre: 'Ines Prueba Nueve',   sexo: 'F', fnac: '2018-09-09', sace: true, n: 40, estado: 'desertor', estadoF: '2026-08-20' },
  { num: 10, nombre: 'Jaco Prueba Diez',    sexo: 'M', fnac: '2019-10-10', sace: true, n: 85 },
  { num: 11, nombre: 'Kilo Fuera Sace',     sexo: 'M', fnac: '2016-01-01', sace: false, n: 100 },
  { num: 12, nombre: 'Registro de prueba',  sexo: 'F', fnac: '2016-01-01', sace: true, n: 100, prueba: true }
];
const notas = {};
P.forEach(p => { notas[p] = {}; MATS.forEach(m => { notas[p][m] = {}; }); });
alumnos.forEach(a => SIN_TEC.forEach(m => P.forEach(p => { notas[p][m][a.num] = String(a.n); })));
/* los que redondean */
[69, 70, 70, 71].forEach((v, i) => { notas[P[i]]['Español'][1] = String(v); });
[90, 91, 91, 91].forEach((v, i) => { notas[P[i]]['Español'][6] = String(v); });
/* Gala: Matemáticas 69,25 → 69 (no aprobada) con promedio general Excelente */
[68, 70, 69, 70].forEach((v, i) => { notas[P[i]]['Matemáticas'][7] = String(v); });
/* Jaco: le falta el IV parcial de Inglés */
delete notas.IV['Inglés'][10];
/* Caligrafía no está en el formulario: tiene notas pero no se cuenta */
alumnos.forEach(a => { notas.I['Caligrafía'][a.num] = '50'; });

const grupo = {
  id: 'g-prueba', grado: '6', seccion: '1', escuela: 'Escuela de Fantasía',
  materias: MATS.slice(),
  boleta: { docente: 'Docente de Prueba', anio: '2026' },
  lista: alumnos.map(a => { const x = Object.assign({}, a); delete x.n; return x; }),
  notas
};
const CORTE = '2026-11-30';

const antes = JSON.stringify(grupo);
const r = RS.calcular(grupo, { corte: CORTE, SL });
ok(JSON.stringify(grupo) === antes, 'calcular no cambia nada del grupo (notas, fichas, nada)');

/* ── quién cuenta ── */
igual(r.totalSace, 10, 'Total según SACE: 10 (ni el de fuera del SACE ni el de prueba)');
igual(r.mov.inicial, { N: 4, V: 5, T: 9 }, 'Matrícula inicial: activos + trasladado + desertora, sin el ingreso');
igual(r.mov.ingresos, { N: 1, V: 0, T: 1 }, 'Ingresos');
igual(r.mov.traslados, { N: 0, V: 1, T: 1 }, 'Traslados');
igual(r.mov.desertores, { N: 1, V: 0, T: 1 }, 'Desertores');
igual(r.mov.final, { N: 4, V: 4, T: 8 }, 'Matrícula final (conteo de activos e ingresos)');
igual(r.formula, r.mov.final, 'inicial + ingresos − traslados − desertores = matrícula final');
ok(r.cuadra === true, 'sin advertencia de que no cuadra');
igual(r.evaluados, { N: 4, V: 3, T: 7 }, 'Evaluados: la matrícula final menos Jaco (sin nota completa)');
igual(r.avisos.sinNota.map(x => x.a.num), [10], 'Sin nota completa: solo Jaco');
igual(r.avisos.sinNota[0].faltan, [{ asig: 'Inglés', parciales: ['IV'] }], 'y se dice qué le falta: Inglés, IV parcial');
igual(r.avisos.fueraSace.map(a => a.num), [11], 'el alumno fuera del SACE queda en el aviso, no en los cuadros');
igual(r.avisos.vacias.map(x => x.k), ['tecnologia'], 'Tecnología sin notas en el año: no impartida');
igual(r.avisos.sobran, ['Caligrafía'], 'Caligrafía no es del formulario: se avisa y no se cuenta');

/* ── notas finales y redondeo ── */
const fin = num => r.porAlumno.find(x => x.a.num === num);
igual(fin(1).fin.espanol, 70, '69, 70, 70, 71 → 70 (Math.round, como la boleta)');
igual(fin(6).fin.espanol, 91, '90, 91, 91, 91 → 91');
igual(fin(7).fin.matematicas, 69, '68, 70, 69, 70 → 69');
igual(fin(7).prom, 92, 'promedio general de Gala: 92');
ok(fin(7).aprobo === false, 'Gala reprueba: el promedio no salva una materia en 69');
ok(!r.porAlumno.some(x => [8, 9, 11, 12].includes(x.a.num)), 'traslado, desertora, fuera del SACE y prueba no tienen fila de notas');

/* ── cuadro 1: escala por promedio general ── */
igual(r.escalaGen.I, { N: 0, V: 1, T: 1 }, 'Inicial: Bruno (69)');
igual(r.escalaGen.B, { N: 2, V: 0, T: 2 }, 'Básico: Alba (70) y Cira (79)');
igual(r.escalaGen.A, { N: 1, V: 1, T: 2 }, 'Avanzado: Dimas (80) y Eva (90)');
igual(r.escalaGen.E, { N: 1, V: 1, T: 2 }, 'Excelente: Fito (91) y Gala (92)');

/* ── cuadro 5 ── */
igual(r.aprobados, { N: 3, V: 2, T: 5 }, 'Aprobados: Alba, Cira, Eva, Dimas, Fito');
igual(r.reprobados, { N: 1, V: 1, T: 2 }, 'Reprobados: Bruno y Gala');

/* ── cuadros 2 y 3 ── */
const pa = k => { const x = r.porAsig[k]; return [x.A, x.NA, x.T, x.I, x.B, x.AV, x.E, x.sinNota]; };
igual(pa('matematicas'), [6, 2, 8, 2, 2, 3, 1, 0], 'Matemáticas: A 6 · NA 2 · T 8 · I 2 · B 2 · A 3 · E 1');
igual(pa('ingles'), [6, 1, 7, 1, 2, 2, 2, 1], 'Inglés: Jaco fuera (1 sin nota completa), T 7');
igual(pa('espanol'), [7, 1, 8, 1, 2, 3, 2, 0], 'Español con los redondeos: A 7 · NA 1 · I 1 · B 2 · A 3 · E 2');
igual(pa('artistica'), [7, 1, 8, 1, 2, 3, 2, 0], 'Educación Artística: Gala con 95 cae en E');
ok(r.porAsig.fisica.T === 8 && r.asignaturas.find(x => x.k === 'fisica').col === 'Educación Física',
  '«Educación Física» de Notas SACE es «Educación Física y Deportes» del formulario');
ok(r.porAsig.tecnologia.cuenta === false, 'Tecnología no cuenta');

/* ── cuadro 4 ── */
const ed = k => r.edades[k];
igual(ed('6'), { N: 1, V: 0, T: 1 }, '6 años: Alba (6 años 3 meses)');
igual(ed('6.5'), { N: 0, V: 1, T: 1 }, '6 ½: Bruno (justo 6 años 6 meses)');
igual(ed('7'), { N: 0, V: 1, T: 1 }, '7: Jaco');
igual(ed('9'), { N: 1, V: 0, T: 1 }, '9: Cira');
igual(ed('10'), { N: 0, V: 1, T: 1 }, '10: Fito');
igual(ed('11'), { N: 1, V: 0, T: 1 }, '11: Gala (ingreso, sí cuenta)');
igual(ed('12'), { N: 0, V: 0, T: 0 }, '12: nadie (Hilo se trasladó)');
igual(ed('8'), { N: 0, V: 0, T: 0 }, '8: nadie (Ines desertó)');
igual(ed('14'), { N: 0, V: 1, T: 1 }, '14: Dimas (14 años 10 meses)');
igual(ed('mas'), { N: 1, V: 0, T: 1 }, 'más de 14: Eva');
igual(r.edTotal, r.mov.final, 'el total por edades es la matrícula final');
/* mismo criterio que el cuadro de Fichas */
const viejo = SL.cuadroEdades(grupo, CORTE);
igual(viejo.total, { F: r.edTotal.N, M: r.edTotal.V, total: r.edTotal.T }, 'y coincide con «Matrícula final por edades y género» de Fichas');

/* ── las tablas ── */
const cs = RS.cuadros(r, '6º-1');
igual(cs.map(c => c.grupos.reduce((t, g) => t + g.subs.length, 0)), [30, 27, 36, 36, 24],
  'columnas de cada cuadro como el formulario (30, 27, 36, 36, 24)');
igual(cs[1].grupos.map(g => g.et), ['EDUCACIÓN ARTÍSTICA', 'ESPAÑOL', 'INGLÉS', 'MATEMÁTICAS', 'CIENCIAS NATURALES',
  'EDUCACIÓN CÍVICA', 'CIENCIAS SOCIALES', 'EDUCACIÓN FÍSICA Y DEPORTES', 'TECNOLOGÍA'], 'asignaturas en el orden del formulario');
ok(cs.every(c => c.filas.length === 2 && c.filas[1].et === 'TOTAL' && JSON.stringify(c.filas[0].vals) === JSON.stringify(c.filas[1].vals)),
  'cada cuadro tiene la fila del grupo y la fila TOTAL');
igual(cs[0].filas[0].vals.slice(0, 18), [4, 5, 9, 4, 4, 8, 1, 0, 1, 1, 0, 1, 0, 1, 1, 4, 3, 7],
  'cuadro 1: inicial, final, ingresos, desertores, traslados, evaluados en el orden del formulario');
igual(cs[1].filas[0].vals.slice(-3), ['·', '·', '·'], 'Tecnología va con «·», no con 0');
igual(cs[4].filas[0].vals.slice(-6), [3, 2, 5, 1, 1, 2], 'cuadro 5: aprobados y reprobados al final');
const html = RS.tablaHtml(cs[0]);
ok((html.match(/<tr/g) || []).length === 4 && /class="rf-total"/.test(html), 'la tabla HTML trae dos filas de encabezado, la del grupo y TOTAL');
ok(!/Kilo|Registro de prueba/.test(JSON.stringify(cs)), 'ni el de fuera del SACE ni el de prueba aparecen en los cuadros');

/* ── el cuadre avisa cuando no cuadra ── */
const SLraro = Object.assign({}, SL, { matriculaFinal: d => SL.matriculaFinal(d).slice(1) });
ok(RS.calcular(grupo, { corte: CORTE, SL: SLraro }).cuadra === false, 'si el conteo y la fórmula no coinciden, se advierte');
const g2 = JSON.parse(antes); g2.lista[2].estado = 'suspendido';
igual(RS.calcular(g2, { corte: CORTE, SL }).avisos.raros.map(a => a.num), [3], 'un estado que el formulario no conoce se señala');
const g3 = JSON.parse(antes); delete g3.lista[0].sexo;
const r3 = RS.calcular(g3, { corte: CORTE, SL });
ok(r3.mov.final.T === 8 && r3.mov.final.N === 3 && r3.avisos.sinSexo.length === 1, 'sin sexo: cuenta en T, no en N, y se avisa');

/* ── el Excel ── */
const bytes = RS.xlsx(cs, { titulo: 'RESUMEN FINAL DE RESULTADOS POR GRADO', datos: [['Grado y sección', '6º-1']], notas: ['nota'] });
const buf = Buffer.from(bytes);
const archivos = {};
let p = 0, crcBien = true;
while (buf.readUInt32LE(p) === 0x04034b50) {
  const crc = buf.readUInt32LE(p + 14), tam = buf.readUInt32LE(p + 18), ln = buf.readUInt16LE(p + 26), lx = buf.readUInt16LE(p + 28);
  const nom = buf.slice(p + 30, p + 30 + ln).toString('utf8');
  const dat = buf.slice(p + 30 + ln + lx, p + 30 + ln + lx + tam);
  if (zlib.crc32 ? zlib.crc32(dat) !== crc : RS.crc32(dat) !== crc) crcBien = false;
  archivos[nom] = dat.toString('utf8');
  p += 30 + ln + lx + tam;
}
igual(Object.keys(archivos).sort(), ['[Content_Types].xml', '_rels/.rels', 'xl/_rels/workbook.xml.rels', 'xl/styles.xml',
  'xl/workbook.xml', 'xl/worksheets/sheet1.xml'], 'el .xlsx trae sus seis partes');
ok(crcBien, 'cada parte del .xlsx con su CRC correcto');
ok(buf.readUInt32LE(buf.length - 22) === 0x06054b50, 'el ZIP cierra con su directorio central');
const hoja = archivos['xl/worksheets/sheet1.xml'] || '';
ok(/orientation="landscape"/.test(hoja) && /paperSize="1"/.test(hoja), 'el Excel se imprime en carta horizontal');
ok(/<mergeCell ref="B\d+:D\d+"\/>/.test(hoja), 'encabezados combinados como en el formulario');
ok(/6º-1/.test(hoja) && (hoja.match(/>TOTAL</g) || []).length >= 5, 'trae el grupo y las filas TOTAL');

/* ── el código ── */
const src = fs.readFileSync(path.join(RAIZ, 'js', 'tools', 'cuadros-sace.js'), 'utf8');
ok(!/localStorage|sessionStorage|indexedDB/.test(src), 'cuadros-sace.js no guarda nada');
ok(!/fetch\s*\(|XMLHttpRequest|supabase|sendBeacon|WebSocket/i.test(src), 'cuadros-sace.js no manda nada fuera del dispositivo');
ok(!/notas\s*\[[^\]]*\]\s*(\[[^\]]*\]\s*)*=[^=]|delete\s+[^;]*notas/.test(src), 'cuadros-sace.js no escribe ni borra notas');
const adm = fs.readFileSync(path.join(RAIZ, 'js', 'tools', 'registros-admin.js'), 'utf8');
const i0 = adm.indexOf('📋 RESUMEN FINAL DE RESULTADOS POR GRADO'), i1 = adm.indexOf('📄 EXPEDIENTE DEL AULA', i0);
const pant = i0 > 0 && i1 > i0 ? adm.slice(i0, i1) : '';
ok(pant.length > 0, 'la pantalla del resumen está en registros-admin.js');
ok(!/\.notas\b/.test(pant), 'la pantalla del resumen no toca las notas');
ok((pant.match(/adSave\(/g) || []).length === 1 && /resumenPeriodo/.test(pant), 'lo único que guarda es el Período');
ok(/id="ad-fi-resumen"[^>]*>📋 Resumen final de resultados por grado</.test(adm), 'el botón está en Identidad y contactos');
ok(/id="ad-sace-resumen"[^>]*>📋 Resumen final de resultados por grado</.test(adm), 'y en Notas SACE');
ok(/🖨️ Imprimir \/ PDF/.test(pant) && /📥 Descargar Excel/.test(pant), 'botones «🖨️ Imprimir / PDF» y «📥 Descargar Excel»');
ok(/size:\s*letter landscape/.test(pant), 'la hoja impresa es carta horizontal');
const idx = fs.readFileSync(path.join(RAIZ, 'index.html'), 'utf8');
const pSL = idx.indexOf('js/tools/sace-lista.js'), pRS = idx.indexOf('js/tools/cuadros-sace.js'), pAD = idx.indexOf('js/tools/registros-admin.js');
ok(pSL > 0 && pRS > pSL && pAD > pRS, 'index.html carga sace-lista, cuadros-sace y registros-admin en ese orden');
igual(SL.ESTADOS.trasladado, 'Traslado', 'el Estado se lee Activo / Ingreso / Traslado / Desertor');

console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ Los cinco cuadros cuentan lo que se contó a mano');
process.exit(fallos ? 1 : 0);
