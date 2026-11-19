/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · La lista oficial del SACE manda también en Mi aula por filas
   ──────────────────────────────────────────────────────────────
   Desde el rediseño de datos, Mi aula guarda una fila por alumno
   (metas.alumnos) y lo impreso se arma en js/tools/mi-aula-papel.js con
   el mismo objeto «grupo» de antes. La marca del SACE vive en las
   columnas en_sace, sace_num y edad_sace, pero el grupo impreso no las
   traía: SaceLista.hayImportacion() daba false y los cuadros contaban
   también la ficha fuera del SACE (y el Resumen final decía 0).

   Un aula INVENTADA (nombres de fantasía, ningún alumno real) con 12
   alumnos, 7 niñas y 5 varones:
     · 10 en la lista oficial del SACE (6 niñas, 4 varones);
     · 1 ficha fuera del SACE (una niña que llegó sin papeles);
     · 1 trasladado (varón), que ya no es matrícula.
   Se pide:
     1 · el grupo de mi-aula-papel.js trae sace, saceNum y edadSace;
     2 · alumnosQueCuentan da 10 (6 niñas, 4 varones);
     3 · los 5 cuadros del Resumen final y el Cuadro final cuentan 10;
     4 · la misma aula guardada en el blob (como en main) da los MISMOS
         números en los 5 cuadros (paridad);
     5 · importar el CSV del SACE en filas: empareja por identidad (solo
         de Honduras) y, si no hay, por nombre; nunca por número de lista;
         un editar por alumno con solo lo que cambia; quien no está en el
         archivo queda en_sace = false y no se borra; y ni una nota cambia
         (mismo conteo de filas y misma suma de valores antes y después).

   Uso:  node _dev/verifica-lista-sace-filas.js
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
const ok = (c, t) => { console.log((c ? '✓ ' : '✘ ') + t); if (!c) fallos++; };
const igual = (a, b, t) => {
  const s = JSON.stringify(a) === JSON.stringify(b);
  ok(s, t + (s ? '' : '  → salió ' + JSON.stringify(a) + ', se esperaba ' + JSON.stringify(b)));
};

/* ── los archivos del sitio, en un «navegador» de mentira ── */
const ctx = { console, Intl, Date, Math, JSON, String, Number, Object, Array, RegExp, Error, TypeError };
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
['js/datos/montos.js', 'js/tools/sace-lista.js', 'js/tools/cuadros-sace.js', 'js/tools/mi-aula-papel.js']
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), ctx, { filename: f }));
const SL = ctx.SaceLista;
const RS = ctx.ResumenSace;
const PAPEL = ctx.metasMiAulaPapel;

/* ── el aula ficticia ── */
const MATS = ['Español', 'Inglés', 'Educación Artística', 'Matemáticas', 'Ciencias Sociales',
  'Ciencias Naturales', 'Educación Física', 'Educación Cívica'];
const P = ['I', 'II', 'III', 'IV'];
const CORTE = '2026-11-30';
const AULA = { id: 'aula-ficticia', escuela: 'Escuela de Fantasía', grado: 6, seccion: '1', anio_lectivo: 2026, docente_nombre: 'Docente de Prueba' };

// n: la nota de todos los parciales y materias (bordes de la escala: 69, 70, 79, 80, 90, 91)
const ALUMNOS = [
  { n: 1,  nom: 'Alba Ficticia Uno',     sexo: 'F', fnac: '2015-02-10', idn: '0801201500001', sace: true,  sn: 1,  edad: 11, nota: 70 },
  { n: 2,  nom: 'Bruno Ficticio Dos',    sexo: 'M', fnac: '2014-05-30', idn: '0801201400002', sace: true,  sn: 2,  edad: 12, nota: 69 },
  { n: 3,  nom: 'Cira Ficticia Tres',    sexo: 'F', fnac: '2015-06-01', idn: '0801201500003', sace: true,  sn: 3,  edad: 11, nota: 79 },
  { n: 4,  nom: 'Dimas Ficticio Cuatro', sexo: 'M', fnac: '2014-01-01', idn: '0801201400004', sace: true,  sn: 4,  edad: 12, nota: 80 },
  { n: 5,  nom: 'Eva Ficticia Cinco',    sexo: 'F', fnac: '2015-05-05', idn: '0801201500005', sace: true,  sn: 5,  edad: 11, nota: 90 },
  { n: 6,  nom: 'Fito Ficticio Seis',    sexo: 'M', fnac: '2016-02-02', idn: '0801201600006', sace: true,  sn: 6,  edad: 10, nota: 91 },
  { n: 7,  nom: 'Gala Ficticia Siete',   sexo: 'F', fnac: '2015-07-07', idn: '0801201500007', sace: true,  sn: 7,  edad: 11, nota: 95 },
  { n: 8,  nom: 'Hilda Ficticia Ocho',   sexo: 'F', fnac: '2014-04-04', idn: '0801201400008', sace: true,  sn: 8,  edad: 12, nota: 85 },
  { n: 9,  nom: 'Ines Ficticia Nueve',   sexo: 'F', fnac: '2015-09-09', idn: '0801201500009', sace: true,  sn: 9,  edad: 11, nota: 60 },
  { n: 10, nom: 'Jaco Ficticio Diez',    sexo: 'M', fnac: '2015-10-10', idn: '0801201500010', sace: true,  sn: 10, edad: 11, nota: 75 },
  // fuera del SACE, con puros 100: si se colara en un cuadro se notaría
  { n: 11, nom: 'Kira Fuera Sace',       sexo: 'F', fnac: '2015-01-01', idn: '',              sace: false, nota: 100 },
  // trasladado: sigue en la lista con sus notas, ya no es matrícula
  { n: 12, nom: 'Lalo Ficticio Traslado', sexo: 'M', fnac: '2014-03-03', idn: '0801201400012', sace: false, nota: 100, estado: 'trasladado', estadoF: '2026-06-15' },
];

const id = (t, x) => t + '-' + String(x).padStart(4, '0');
function filasDelAula(conMarca) {
  const t = {
    aulas: [AULA], familias: [], notas_personalidad: [], inasistencias_oficiales: [], asistencia_dias: [], asistencia: [],
    v_colecta_alumnos: [], colectas: [], pagos: [], gastos: [],
    asignaturas: MATS.map((m, i) => ({ id: id('asig', i + 1), aula_id: AULA.id, nombre: m, orden: i + 1 })),
    alumnos: ALUMNOS.map(a => ({
      id: id('al', a.n), aula_id: AULA.id, nombre_completo: a.nom, num_lista: a.n, sexo: a.sexo,
      identidad: a.idn || null, documento_pais: 'HN', fecha_nacimiento: a.fnac,
      estado: a.estado || 'activo', estado_fecha: a.estadoF || null,
      en_sace: conMarca ? a.sace : false, sace_num: conMarca && a.sace ? a.sn : null,
      edad_sace: conMarca && a.sace ? a.edad : null, no_copiar_sace: false,
    })),
    notas: [],
  };
  ALUMNOS.forEach(a => MATS.forEach((m, i) => P.forEach(p => {
    t.notas.push({ id: id('nota', t.notas.length + 1), aula_id: AULA.id, alumno_id: id('al', a.n), asignatura_id: id('asig', i + 1),
      periodo: p, componente: 'final', valor: a.nota + '.00' });
  })));
  return t;
}
// La API de MetasDatos que lee mi-aula-papel.js: lista(tabla, filtro).
function apiDe(t) {
  return {
    lista(tabla, filtro) {
      return (t[tabla] || []).filter(f => !f.deleted_at && Object.keys(filtro || {}).every(k => f[k] === filtro[k]))
        .map(f => Object.assign({}, f));
    },
  };
}
// La misma aula como la guardaba el blob (main): METAS_ADMIN_V1.grupos[i].
function grupoBlob() {
  const notas = {};
  P.forEach(p => { notas[p] = {}; MATS.forEach(m => { notas[p][m] = {}; }); });
  ALUMNOS.forEach(a => MATS.forEach(m => P.forEach(p => { notas[p][m][a.n] = String(a.nota); })));
  return {
    id: 'g-ficticio', grado: '6', seccion: '1', escuela: 'Escuela de Fantasía', materias: MATS.slice(),
    boleta: { docente: 'Docente de Prueba', anio: '2026' }, notas, recuperacion: {}, inasisOficial: {}, asistencia: [],
    lista: ALUMNOS.map(a => {
      const x = { num: a.n, nombre: a.nom, idn: a.idn, sexo: a.sexo, fnac: a.fnac, sace: a.sace };
      if (a.sace) { x.saceNum = a.sn; x.edadSace = String(a.edad); }
      if (a.estado) { x.estado = a.estado; x.estadoF = a.estadoF; }
      return x;
    }),
  };
}

const sexos = l => ({ F: l.filter(a => a.sexo === 'F').length, M: l.filter(a => a.sexo === 'M').length, T: l.length });
function cuentas(g) {
  const r = RS.calcular(g, { corte: CORTE, SL });
  return { r, cs: RS.cuadros(r, '6º-1'), cf: RS.cuadroFinal(g, { SL, corte: CORTE }) };
}

/* ── 1 · el grupo impreso trae la marca ── */
console.log('1 · El grupo de mi-aula-papel.js trae la marca del SACE');
const tablas = filasDelAula(true);
const g = PAPEL.grupo(apiDe(tablas), AULA);
const de = n => g.lista.find(a => a.num === n) || {};
ok(g.lista.every(a => 'sace' in a && 'saceNum' in a && 'edadSace' in a), 'cada alumno del grupo trae sace, saceNum y edadSace');
igual(g.lista.filter(a => a.sace === true).map(a => a.num), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'sace: true justo para los 10 con en_sace');
igual([de(11).sace, de(12).sace], [false, false], 'la ficha fuera del SACE y el trasladado: sace false');
igual([String(de(3).saceNum), String(de(3).edadSace)], ['3', '11'], 'sace_num → saceNum y edad_sace → edadSace');
igual([de(12).estado, de(12).fnac], ['trasladado', '2014-03-03'], 'estado y fecha de nacimiento siguen viajando');
ok(SL.hayImportacion(g) === true, 'hayImportacion() da true');

/* ── 2 · quién cuenta ── */
console.log('2 · Quién cuenta');
igual(sexos(SL.alumnosQueCuentan(g)), { F: 6, M: 4, T: 10 }, 'alumnosQueCuentan: 10 (6 niñas, 4 varones)');
igual(sexos(SL.matriculaFinal(g)), { F: 6, M: 4, T: 10 }, 'matriculaFinal: 10');

/* ── 3 · los cinco cuadros y el Cuadro final ── */
console.log('3 · Resumen final de resultados por grado y Cuadro final');
const F = cuentas(g);
const r = F.r;
igual(r.totalSace, 10, 'Total según SACE: 10');
igual(r.mov.final, { N: 6, V: 4, T: 10 }, 'cuadro 1 · matrícula final 10 (6/4)');
igual(r.evaluados, { N: 6, V: 4, T: 10 }, 'cuadro 1 · evaluados 10');
const sumaEsc = ['I', 'B', 'A', 'E'].reduce((t, k) => t + r.escalaGen[k].T, 0);
igual(sumaEsc, 10, 'cuadro 1 · Inicial + Básico + Avanzado + Excelente = 10');
igual(r.escalaGen.I, { N: 1, V: 1, T: 2 }, 'cuadro 1 · Inicial: 69 y 60 (escala sin cambios, ≤69)');
igual(r.escalaGen.E, { N: 1, V: 1, T: 2 }, 'cuadro 1 · Excelente: 91 y 95 (la de 100 fuera del SACE no entra)');
const cuentanAsig = r.asignaturas.filter(x => r.porAsig[x.k].cuenta);
ok(cuentanAsig.length === 8 && cuentanAsig.every(x => r.porAsig[x.k].T === 10),
  'cuadros 2 y 3 · cada asignatura cuenta 10');
igual(r.edTotal, { N: 6, V: 4, T: 10 }, 'cuadro 4 · total por edades 10');
igual([r.aprobados.T, r.reprobados.T, r.aprobados.T + r.reprobados.T], [8, 2, 10], 'cuadro 5 · aprobados 8 + reprobados 2 = 10');
igual(F.cs.length, 5, 'son 5 cuadros');
ok(F.cs.every(c => c.filas.length === 2), 'cada cuadro con su fila del grupo y su TOTAL');
ok(!/Kira|Lalo/.test(JSON.stringify(F.cs)), 'ni la ficha fuera del SACE ni el trasladado aparecen en los cuadros');
igual(F.cf.filas.length, 10, 'Cuadro final: 10 alumnos');
ok(!F.cf.filas.some(f => [11, 12].includes(f.num)), 'Cuadro final: sin la ficha fuera del SACE ni el trasladado');

/* ── 4 · paridad con el blob ── */
console.log('4 · La misma aula en el blob (main) y en filas da los mismos números');
const B = cuentas(grupoBlob());
igual(F.cs.map(c => c.filas.map(f => f.vals)), B.cs.map(c => c.filas.map(f => f.vals)), 'los 5 cuadros, celda por celda');
igual([F.r.totalSace, F.r.mov, F.r.evaluados], [B.r.totalSace, B.r.mov, B.r.evaluados], 'total SACE, movimiento y evaluados');
igual(F.cf.filas.map(f => [f.num, f.prom]), B.cf.filas.map(f => [f.num, f.prom]), 'Cuadro final: mismos alumnos y promedios');
igual(SL.cuadroEdades(g, CORTE).total, SL.cuadroEdades(grupoBlob(), CORTE).total, '«Matrícula final por edades y género»');

/* ── 5 · importar el CSV del SACE en filas ── */
console.log('5 · Importar la lista del SACE en la Mi aula nueva');
const hay = typeof SL.emparejarFilas === 'function' && typeof SL.cambiosFilas === 'function';
ok(hay, 'sace-lista.js empareja y prepara los cambios para filas (emparejarFilas, cambiosFilas)');
if (hay) {
  // Antes de importar: nadie trae la marca, salvo la ficha 11, marcada por
  // error en una importación vieja (debe quedar fuera).
  const t = filasDelAula(false);
  const al = n => t.alumnos.find(a => a.num_lista === n);
  al(11).en_sace = true;
  al(5).identidad = null;                         // sin identidad: se empareja por nombre
  al(12).estado = 'activo'; al(12).estado_fecha = null; // el SACE dirá que se trasladó
  al(1).fecha_nacimiento = '2015-02-11';          // la del SACE gana
  // un documento de Guatemala con los mismos 13 dígitos que la fila 9 del
  // SACE: no debe emparejar por identidad (otro país)
  t.alumnos.push({ id: id('al', 13), aula_id: AULA.id, nombre_completo: 'Mara Otro Pais', num_lista: 13, sexo: 'F',
    identidad: '0801201500009', documento_pais: 'GT', fecha_nacimiento: '2015-09-09', estado: 'activo', en_sace: false });
  al(9).identidad = null;

  const csv = 'num;identidad;nombre;sexo;fecha_nacimiento;edad_sace;estado\n' + ALUMNOS.filter(a => a.n <= 10 || a.n === 12).map(a => [
    // el número del SACE NO coincide con el de la lista (al revés): no debe usarse para emparejar
    13 - a.n, a.n === 5 ? '' : a.idn, a.nom.toUpperCase(), a.sexo, a.fnac, a.edad || 12, a.n === 12 ? 'Traslado' : 'Activo',
  ].join(';')).join('\n') + '\n99;0801201599999;NUEVA SIN FICHA;F;2015-12-12;10;Activo\n';
  const leido = SL.parseCsv(csv);
  igual(leido.filas.length, 12, 'el CSV ficticio trae 12 filas');
  igual(leido.filas.find(f => f.nombre === 'LALO FICTICIO TRASLADO').estado, 'trasladado', 'la columna «estado» del SACE se entiende: Traslado → trasladado');

  const ordenados = t.alumnos.slice().sort((a, b) => a.num_lista - b.num_lista);
  const plan = SL.emparejarFilas(ordenados, leido.filas);
  const parDe = n => plan.pares.find(p => p.id === id('al', n));
  igual(plan.pares.length, 11, 'se emparejan 11 (los 10 del SACE y el trasladado)');
  ok(plan.pares.every(p => p.f.nombre.toUpperCase() === (ALUMNOS.find(a => id('al', a.n) === p.id) || {}).nom.toUpperCase()),
    'cada par es la misma persona (nunca por número de lista: el número del SACE va al revés)');
  igual(parDe(5) && parDe(5).por, 'nombre', 'sin identidad, por nombre');
  ok(parDe(5) && parDe(5).seguro, 'el mismo nombre escrito igual es seguro (✓)');
  igual(parDe(9) && parDe(9).por, 'nombre', 'la de Guatemala no se lleva a la fila 9 del SACE por identidad');
  ok(!plan.pares.some(p => p.id === id('al', 13)), 'el documento de otro país no empareja con el SACE');
  igual(plan.sinFicha.map(f => f.nombre), ['NUEVA SIN FICHA'], '✗ del SACE sin ficha en Mi aula: 1');
  igual(plan.sinSace.slice().sort(), [id('al', 11), id('al', 13)], 'fichas sin alumno en el SACE: la 11 y la de otro país');

  const notasAntes = { n: t.notas.length, suma: t.notas.reduce((s, x) => s + Math.round(parseFloat(x.valor) * 100), 0), json: JSON.stringify(t.notas) };
  const otrasAntes = JSON.stringify([t.asistencia, t.inasistencias_oficiales, t.notas_personalidad]);
  const conf = { pares: plan.pares.map((_, i) => i), fecha: '2026-11-19' };
  const cambios = SL.cambiosFilas(ordenados, plan, conf);

  // Un «MetasDatos» de mentira que anota cada llamada y la aplica.
  const llamadas = [];
  const d = {
    editar(tabla, idx, c) { llamadas.push(['editar', tabla, idx, c]); Object.assign(t[tabla].find(f => f.id === idx), c); return { id: idx }; },
    crear(tabla) { llamadas.push(['crear', tabla]); },
    borrar(tabla) { llamadas.push(['borrar', tabla]); },
  };
  cambios.forEach(x => d.editar('alumnos', x.id, x.cambios));

  ok(llamadas.every(l => l[0] === 'editar' && l[1] === 'alumnos'), 'solo editar en alumnos: ningún crear ni borrar, ninguna otra tabla');
  igual(new Set(llamadas.map(l => l[2])).size, llamadas.length, 'un editar por alumno');
  const c = n => (cambios.find(x => x.id === id('al', n)) || {}).cambios;
  igual(c(1), { en_sace: true, sace_num: 12, edad_sace: 11, fecha_nacimiento: '2015-02-10' }, 'Alba: marca, número, edad y la fecha del SACE');
  igual(c(12), { en_sace: true, sace_num: 1, edad_sace: 12, estado: 'trasladado', estado_fecha: '2026-11-19' }, 'el SACE dice Traslado: estado y fecha');
  igual(c(11), { en_sace: false }, 'la ficha que no está en el CSV queda en_sace = false (y nada más)');
  ok(c(13) === undefined, 'la de otro país ya estaba en false: no se manda nada');
  ok(Object.values(cambios).every(x => !('nombre_completo' in x.cambios) && !('identidad' in x.cambios) && !('num_lista' in x.cambios)),
    'no cambia nombres, identidades ni números de lista');
  igual(t.alumnos.length, 13, 'nadie se borra');

  const notasDespues = { n: t.notas.length, suma: t.notas.reduce((s, x) => s + Math.round(parseFloat(x.valor) * 100), 0), json: JSON.stringify(t.notas) };
  igual([notasDespues.n, notasDespues.suma], [notasAntes.n, notasAntes.suma], 'notas: mismo conteo de filas y misma suma de valores');
  ok(notasDespues.json === notasAntes.json, 'notas: ni una fila cambió');
  ok(JSON.stringify([t.asistencia, t.inasistencias_oficiales, t.notas_personalidad]) === otrasAntes, 'asistencia, inasistencias y personalidad intactas');

  // Importar dos veces no cambia nada la segunda.
  const ord2 = t.alumnos.slice().sort((a, b) => a.num_lista - b.num_lista);
  const plan2 = SL.emparejarFilas(ord2, leido.filas);
  igual(SL.cambiosFilas(ord2, plan2, { pares: plan2.pares.map((_, i) => i), fecha: '2026-11-20' }), [], 'importar otra vez el mismo archivo no manda nada');

  // Un par que el maestro NO confirma queda fuera de la lista oficial.
  const sinConf = SL.cambiosFilas(ord2, plan2, { pares: plan2.pares.map((_, i) => i).filter(i => plan2.pares[i].id !== id('al', 4)) });
  igual(sinConf.map(x => [x.id, x.cambios]), [[id('al', 4), { en_sace: false }]], 'sin confirmar: queda en_sace = false, no se borra');
  // Emparejar a mano: la fila del SACE sin ficha es la ficha 13.
  const aMano = SL.cambiosFilas(ord2, plan2, { pares: plan2.pares.map((_, i) => i), manuales: [{ i: 0, id: id('al', 13) }] });
  igual(aMano.map(x => [x.id, Object.keys(x.cambios)]), [[id('al', 13), ['en_sace', 'sace_num', 'edad_sace', 'fecha_nacimiento']]], 'emparejado a mano: entra a la lista oficial');
  // Fuera del SACE y marcado como desertor desde la vista previa.
  const des = SL.cambiosFilas(ord2, plan2, { pares: plan2.pares.map((_, i) => i), estados: { [id('al', 11)]: 'desertor' }, fecha: '2026-11-20' });
  igual(des.map(x => x.cambios), [{ estado: 'desertor', estado_fecha: '2026-11-20' }], 'fuera y desertor: estado y fecha, sin tocar nada más');

  // Y después de importar, lo impreso cuenta la lista oficial.
  const g2 = PAPEL.grupo(apiDe(t), AULA);
  igual(sexos(SL.alumnosQueCuentan(g2)), { F: 6, M: 4, T: 10 }, 'después de importar: alumnosQueCuentan 10 (6/4)');
  igual(RS.calcular(g2, { corte: CORTE, SL }).mov.traslados, { N: 0, V: 1, T: 1 }, 'y el trasladado del SACE va en Traslados del cuadro 1');
}

/* ── 6 · la pantalla: la importación solo edita alumnos ── */
console.log('6 · La pantalla de Mi aula');
const src = fs.readFileSync(path.join(RAIZ, 'js/tools/mi-aula.js'), 'utf8');
const ini = src.indexOf('// ── 📥 Lista oficial del SACE');
const fin = src.indexOf('// ── fin de la lista oficial del SACE');
ok(ini > 0 && fin > ini, 'Mi aula (Alumnos) ofrece «Importar lista del SACE»');
if (ini > 0 && fin > ini) {
  const bloque = src.slice(ini, fin);
  ok(/window\.SaceLista/.test(bloque) && /SL\.emparejarFilas/.test(bloque) && /SL\.cambiosFilas/.test(bloque), 'reutiliza sace-lista.js para emparejar y preparar los cambios');
  ok(!/d\.(crear|borrar|pagar|recuperar)\(/.test(bloque), 'no crea ni borra nada');
  const eds = bloque.match(/d\.editar\(\s*'[^']+'/g) || [];
  ok(eds.length > 0 && eds.every(e => /'alumnos'/.test(e)), 'solo d.editar(\'alumnos\', …)');
  ok(!/Math\.random/.test(bloque), 'sin Math.random');
  ok(/'✓'|✓/.test(bloque) && /⚠/.test(bloque) && /✗/.test(bloque), 'la vista previa marca ✓ ⚠ ✗, no solo con color');
}

console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ La lista oficial del SACE manda en Mi aula por filas');
process.exit(fallos ? 1 : 0);
