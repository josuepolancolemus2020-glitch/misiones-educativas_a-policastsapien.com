/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Fichas del SACE sin sexo (las de antes de v577)
   ──────────────────────────────────────────────────────────────
   Un aula INVENTADA de 10 fichas con «Registrado en SACE», 3 de ellas
   sin sexo (como quedaron las fichas creadas antes de que la ficha lo
   pidiera), más una ficha fuera del SACE, también sin sexo, que no debe
   contar para nada.

     1 · Qué dicen los cinco cuadros y el Cuadro final: T cuenta a los
         10; N y V solo a los 7 con sexo; N + V no da T, y la pantalla lo
         sabe (avisos.sinSexo).
     2 · SaceLista.sexosSace cuenta lo mismo con la ficha de filas
         (en_sace) y con la del blob (sace).
     3 · El aviso de Mi aula (Alumnos y Notas SACE › Para imprimir) dice
         «3 alumnos del SACE sin sexo: no salen en N/V. Complétalos», con
         la cuenta Total = N + V + sin sexo y un toque que abre esas fichas.
     4 · Nunca se adivina ni se rellena el sexo: contar no cambia ninguna
         ficha, el aviso no escribe nada y solo el toque del maestro
         (ficha-sexo) pone F o M.
     5 · Paridad blob/filas: cuántas notas hay y cuánto suman es lo mismo
         en el blob y en las filas, antes y después de contar, y después
         de que el maestro completa el sexo. No se escribe ninguna nota.

   Uso:  node _dev/verifica-sace-sin-sexo.js
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
const AULA = { id: 'aula-sin-sexo', escuela: 'Escuela de Fantasía', grado: 5, seccion: '2', anio_lectivo: 2026, docente_nombre: 'Docente de Prueba' };

// sexo '' = ficha vieja, sin sexo. Las notas: 4 niñas, 3 varones y 3 sin sexo,
// con aprobados y reprobados en los tres grupos para que se note en cada cuadro.
const ALUMNOS = [
  { n: 1,  nom: 'Ana Ficticia Uno',       sexo: 'F', fnac: '2016-02-10', sace: true,  nota: 85 },
  { n: 2,  nom: 'Beto Ficticio Dos',      sexo: 'M', fnac: '2015-05-30', sace: true,  nota: 64 },
  { n: 3,  nom: 'Cora Ficticia Tres',     sexo: 'F', fnac: '2016-06-01', sace: true,  nota: 92 },
  { n: 4,  nom: 'Dani Ficticio Cuatro',   sexo: '',  fnac: '2015-01-01', sace: true,  nota: 78 },
  { n: 5,  nom: 'Elsa Ficticia Cinco',    sexo: 'F', fnac: '2016-05-05', sace: true,  nota: 71 },
  { n: 6,  nom: 'Fer Ficticio Seis',      sexo: '',  fnac: '2017-02-02', sace: true,  nota: 66 },
  { n: 7,  nom: 'Gabi Ficticia Siete',    sexo: 'F', fnac: '2016-07-07', sace: true,  nota: 88 },
  { n: 8,  nom: 'Hugo Ficticio Ocho',     sexo: 'M', fnac: '2015-04-04', sace: true,  nota: 95 },
  { n: 9,  nom: 'Isa Ficticia Nueve',     sexo: '',  fnac: '2016-09-09', sace: true,  nota: 81 },
  { n: 10, nom: 'Juan Ficticio Diez',     sexo: 'M', fnac: '2016-10-10', sace: true,  nota: 74 },
  // fuera del SACE y sin sexo: no entra en ningún cuadro ni en el aviso
  { n: 11, nom: 'Kim Fuera Sace',         sexo: '',  fnac: '2016-01-01', sace: false, nota: 100 },
];
const SIN_SEXO = [4, 6, 9];

const id = (t, x) => t + '-' + String(x).padStart(4, '0');
function filasDelAula() {
  const t = {
    aulas: [AULA], familias: [], notas_personalidad: [], inasistencias_oficiales: [], asistencia_dias: [], asistencia: [],
    v_colecta_alumnos: [], colectas: [], pagos: [], gastos: [],
    asignaturas: MATS.map((m, i) => ({ id: id('asig', i + 1), aula_id: AULA.id, nombre: m, orden: i + 1 })),
    alumnos: ALUMNOS.map(a => ({
      id: id('al', a.n), aula_id: AULA.id, nombre_completo: a.nom, num_lista: a.n, sexo: a.sexo || null,
      identidad: null, documento_pais: 'HN', fecha_nacimiento: a.fnac,
      estado: 'activo', estado_fecha: null, en_sace: a.sace, sace_num: a.sace ? a.n : null,
      edad_sace: null, no_copiar_sace: false,
    })),
    notas: [],
  };
  ALUMNOS.forEach(a => MATS.forEach((m, i) => P.forEach(p => {
    t.notas.push({ id: id('nota', t.notas.length + 1), aula_id: AULA.id, alumno_id: id('al', a.n), asignatura_id: id('asig', i + 1),
      periodo: p, componente: 'final', valor: a.nota + '.00' });
  })));
  return t;
}
function apiDe(t) {
  return {
    lista(tabla, filtro) {
      return (t[tabla] || []).filter(f => !f.deleted_at && Object.keys(filtro || {}).every(k => f[k] === filtro[k]))
        .map(f => Object.assign({}, f));
    },
  };
}
// La misma aula como la guardaba el blob: METAS_ADMIN_V1.grupos[i].
function grupoBlob() {
  const notas = {};
  P.forEach(p => { notas[p] = {}; MATS.forEach(m => { notas[p][m] = {}; }); });
  ALUMNOS.forEach(a => MATS.forEach(m => P.forEach(p => { notas[p][m][a.n] = String(a.nota); })));
  return {
    id: 'g-sin-sexo', grado: '5', seccion: '2', escuela: 'Escuela de Fantasía', materias: MATS.slice(),
    boleta: { docente: 'Docente de Prueba', anio: '2026' }, notas, recuperacion: {}, inasisOficial: {}, asistencia: [],
    lista: ALUMNOS.map(a => ({ num: a.n, nombre: a.nom, sexo: a.sexo, fnac: a.fnac, sace: a.sace })),
  };
}
/* Cuántas notas hay y cuánto suman, en enteros (la nota se lee como texto,
   sin parseFloat: «85.00» → 85). */
function huellaNotas(notasPorParcial) {
  let n = 0, suma = 0;
  P.forEach(p => Object.keys(notasPorParcial[p] || {}).forEach(m => {
    if (MATS.indexOf(m) < 0) return;
    Object.values(notasPorParcial[p][m]).forEach(v => {
      const t = String(v).trim();
      if (!/^\d+(\.0+)?$/.test(t)) return;
      n++; suma += parseInt(t, 10);
    });
  }));
  return { n, suma };
}
function huellaFilas(t) {
  let n = 0, suma = 0;
  t.notas.forEach(x => { if (x.deleted_at) return; n++; suma += parseInt(String(x.valor), 10); });
  return { n, suma };
}
const nvt = (N, V, T) => ({ N, V, T });

/* ══════════ 1 · Los cinco cuadros y el Cuadro final ══════════ */
console.log('1 · Lo que dicen los cinco cuadros y el Cuadro final con 3 fichas sin sexo');
const tablas = filasDelAula();
const filasAntes = JSON.stringify(tablas);
const g = PAPEL.grupo(apiDe(tablas), AULA);
const gAntes = JSON.stringify(g);
const r = RS.calcular(g, { corte: CORTE, SL });
const cs = RS.cuadros(r, '5º-2');
const cf = RS.cuadroFinal(g, { SL, corte: CORTE });

igual(r.totalSace, 10, 'Total según SACE: las 10 fichas registradas (la de fuera no)');
igual(r.avisos.sinSexo.map(a => a.num), SIN_SEXO, 'avisos.sinSexo nombra a los 3 sin sexo, y a nadie más');
igual(r.avisos.fueraSace.map(a => a.num), [11], 'la ficha fuera del SACE va en su aviso, no en sin sexo');

// Cuadro 1: evaluados y escala
igual(r.evaluados, nvt(4, 3, 10), 'cuadro 1 · evaluados: T = 10, N = 4, V = 3');
const esc = ['I', 'B', 'A', 'E'].map(k => r.escalaGen[k]);
igual(esc.reduce((t, c) => t + c.T, 0), 10, 'cuadro 1 · la escala reparte a los 10 en T');
igual(esc.reduce((t, c) => t + c.N + c.V, 0), 7, 'cuadro 1 · en N + V de la escala salen 7: los 3 sin sexo no están');
// Cuadros 2 y 3: por asignatura no hay sexo, cuentan los 10
r.asignaturas.filter(x => x.cuenta).forEach(as => {
  const pa = r.porAsig[as.k];
  ok(pa.T === 10 && pa.A + pa.NA === 10 && pa.I + pa.B + pa.AV + pa.E === 10,
    'cuadros 2 y 3 · ' + as.et + ': A + NA = 10 e I + B + A + E = 10');
});
// Cuadro 4: edades
igual(r.edTotal, nvt(4, 3, 10), 'cuadro 4 · edades: T = 10, N = 4, V = 3');
// Cuadro 5: movimiento, aprobados y reprobados
igual(r.mov.inicial, nvt(4, 3, 10), 'cuadro 5 · matrícula inicial: T = 10, N = 4, V = 3');
igual(r.mov.final, nvt(4, 3, 10), 'cuadro 5 · matrícula final: T = 10, N = 4, V = 3');
ok(r.cuadra, 'cuadro 5 · inicial + ingresos − traslados − desertores = final (en N, V y T)');
igual(r.aprobados.T + r.reprobados.T, 10, 'cuadro 5 · aprobados + reprobados = 10');
igual(r.aprobados.N + r.aprobados.V + r.reprobados.N + r.reprobados.V, 7, 'cuadro 5 · en N + V de aprobados y reprobados salen 7');
// Las tablas que van a la hoja impresa: el mismo número en pantalla, papel y Excel
const c1 = cs[0].filas[0].vals;
igual(c1.slice(0, 3), [4, 3, 10], 'la hoja del cuadro 1 imprime matrícula inicial 4 · 3 · 10 (N + V ≠ T, como debe)');
igual(cs.length, 5, 'siguen siendo cinco cuadros, con el mismo diseño');

// Cuadro final del año
igual(cf.filas.length, 10, 'Cuadro final: una fila por cada uno de los 10 del SACE');
igual(cf.filas.filter(f => !f.sexo).map(f => f.num), SIN_SEXO, 'Cuadro final: las 3 filas sin sexo van con el sexo en blanco, no inventado');
igual(cf.resumen.total, nvt(4, 3, 10), 'Cuadro final · total: T = 10, N = 4, V = 3');
const rcf = cf.resumen;
igual(rcf.aprob.T + rcf.aprobRec.T + rcf.reprob.T + rcf.pend.T, 10, 'Cuadro final · aprobados + en recuperación + reprobados + pendientes = 10');

/* ══════════ 2 · La cuenta del aviso, en filas y en blob ══════════ */
console.log('2 · SaceLista.sexosSace con la ficha de filas y con la del blob');
const filasAlumnos = tablas.alumnos;
const cFilas = SL.sexosSace(filasAlumnos);
const cBlob = SL.sexosSace(grupoBlob().lista);
const resumen = c => ({ total: c.total, N: c.N, V: c.V, sinSexo: c.sinSexo.length });
igual(resumen(cFilas), { total: 10, N: 4, V: 3, sinSexo: 3 }, 'filas (en_sace): Total 10 = 4 N + 3 V + 3 sin sexo');
igual(resumen(cBlob), { total: 10, N: 4, V: 3, sinSexo: 3 }, 'blob (sace): la misma cuenta');
igual(cFilas.total, cFilas.N + cFilas.V + cFilas.sinSexo.length, 'Total = N + V + sin sexo');
ok(cFilas.N + cFilas.V !== cFilas.total, 'mientras falten, N + V no da el total (7 ≠ 10)');
igual(cFilas.N, r.mov.final.N, 'la N del aviso es la N de los cuadros');
igual(cFilas.V, r.mov.final.V, 'la V del aviso es la V de los cuadros');
igual(SL.sexosSace(filasAlumnos.concat([{ id: 'x', en_sace: true, sexo: '', prueba: true }])).sinSexo.length, 3,
  'el registro de prueba del maestro no entra en el aviso');
igual(SL.sexosSace([]).sinSexo.length, 0, 'aula vacía: sin aviso');

/* ══════════ 3 · El aviso de Mi aula ══════════ */
console.log('3 · El aviso en Alumnos y en Notas SACE › Para imprimir');
const MA = fs.readFileSync(path.join(RAIZ, 'js', 'tools', 'mi-aula.js'), 'utf8');
const trozo = (desde, hasta) => {
  const i = MA.indexOf(desde), j = MA.indexOf(hasta, i);
  if (i < 0 || j < 0) return '';
  return MA.slice(i, j);
};
const fAviso = trozo('function avisoSinSexo(', 'function pintarSinSexo(');
const fVista = trozo('function pintarSinSexo(', '// ── 📝 Datos para el SACE');
ok(fAviso && fVista, 'mi-aula.js tiene avisoSinSexo y pintarSinSexo');
// Se ejecutan con lo mínimo: las fichas del aula y el escape de siempre.
const ui = { window: { SaceLista: SL }, esc: s => String(s == null ? '' : s), num: a => String(a.num_lista), sinSexoIds: null };
let lasFichas = filasAlumnos.map(a => Object.assign({}, a));
ui.alumnos = () => lasFichas;
vm.createContext(ui);
vm.runInContext(fAviso + fVista, ui);
const aviso = ui.avisoSinSexo(AULA);
const llano = s => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
ok(llano(aviso).includes('⚠ 3 alumnos del SACE sin sexo: no salen en N/V. Complétalos.'),
  'dice «3 alumnos del SACE sin sexo: no salen en N/V. Complétalos.»');
ok(llano(aviso).includes('Del SACE: 10 = 4 niñas (N) + 3 varones (V) + 3 sin sexo. En los cuadros, N + V da 7 y no 10 mientras falten.'),
  'dice la cuenta: Total = N + V + sin sexo, y que N + V no cuadra mientras falten');
ok(/data-accion="sin-sexo"/.test(aviso) && /♀♂ Completar las 3 fichas/.test(aviso), 'trae el toque «♀♂ Completar las 3 fichas»');
ok(/role="status"/.test(aviso) && /⚠/.test(aviso), 'el aviso se dice con ⚠ y palabras, no solo con color');
// Una sola: singular
lasFichas = filasAlumnos.map(a => Object.assign({}, a, a.num_lista === 4 || a.num_lista === 6 ? { sexo: 'M' } : {}));
ok(llano(ui.avisoSinSexo(AULA)).includes('⚠ 1 alumno del SACE sin sexo: no sale en N/V. Complétalo.'), 'con uno solo, en singular');
// Ninguna: no hay aviso
lasFichas = filasAlumnos.map(a => Object.assign({}, a, SIN_SEXO.includes(a.num_lista) ? { sexo: 'F' } : {}));
igual(ui.avisoSinSexo(AULA), '', 'con todas completas, el aviso desaparece');
// La vista que abre el toque: solo esas fichas, con Niña (F) y Niño (M)
lasFichas = filasAlumnos.map(a => Object.assign({}, a));
const vista = ui.pintarSinSexo(AULA);
igual((vista.match(/data-metas="sin-sexo-fila"/g) || []).length, 3, 'el toque abre las 3 fichas, y solo esas');
igual((vista.match(/data-accion="ficha-sexo"/g) || []).length, 6, 'cada una con Niña (F) y Niño (M), de un toque');
ok(!/Kim Fuera Sace/.test(vista), 'la ficha fuera del SACE no aparece');
ok(llano(vista).includes('Faltan 3 de 3'), 'dice cuántas faltan');
// Tras el toque, la ficha sigue a la vista (para corregir un toque equivocado)
ui.sinSexoIds = SL.sexosSace(lasFichas).sinSexo.map(a => a.id);
lasFichas = lasFichas.map(a => a.num_lista === 4 ? Object.assign({}, a, { sexo: 'M' }) : a);
const vista2 = ui.pintarSinSexo(AULA);
igual((vista2.match(/data-metas="sin-sexo-fila"/g) || []).length, 3, 'después de un toque las 3 siguen a la vista');
ok(llano(vista2).includes('Faltan 2 de 3') && /aria-pressed="true"[^>]*>✓ Niño \(M\)/.test(vista2), 'y se ve cuál quedó: ✓ Niño (M), faltan 2 de 3');

// Dónde sale: Alumnos y Notas SACE › Para imprimir
const fAlumnos = trozo('function pintarAlumnos(', '// Debajo del nombre, en letra chica');
const fImprimir = trozo('function notaImprimirSace(', 'function camposPerfilNuevo(');
ok(/avisoSinSexo\(aula\)/.test(fAlumnos), 'el aviso sale en Alumnos');
ok(/avisoSinSexo\(aula\)/.test(fImprimir), 'el aviso sale en Notas SACE › Para imprimir');
ok(/case 'sin-sexo':[\s\S]{0,600}vista\.seccion = 'alumnos'[\s\S]{0,300}subAlumnos = 'sin-sexo'/.test(MA),
  'el toque lleva a Alumnos, con esas fichas abiertas (también desde Notas SACE)');
ok(/if \(subAlumnos === 'sin-sexo'\) return pintarSinSexo\(aula\);/.test(MA), 'Alumnos pinta la vista de las fichas sin sexo');

/* ══════════ 4 · Nunca se adivina ni se rellena ══════════ */
console.log('4 · El sexo lo pone el maestro, nunca la app');
igual(JSON.stringify(tablas), filasAntes, 'contar y armar los cuadros no cambia ninguna fila');
igual(JSON.stringify(g), gAntes, 'ni el grupo impreso');
igual(SIN_SEXO.map(n => g.lista.find(a => a.num === n).sexo), ['', '', ''], 'las 3 siguen sin sexo: nadie lo puso por ellas');
ok(!/editar\(|crear\(|\.sexo\s*=[^=]/.test(fAviso + fVista), 'el aviso y su vista no escriben nada (ni editar, ni crear, ni sexo =)');
const casoSexo = trozo("case 'ficha-sexo':", "case 'lista-sace-elegir':");
ok(/v !== 'F' && v !== 'M'/.test(casoSexo) && /d\.editar\('alumnos', alS\.id, \{ sexo: v \}\)/.test(casoSexo),
  'solo el toque del maestro (ficha-sexo) escribe el sexo, y solo F o M');
const SLsrc = fs.readFileSync(path.join(RAIZ, 'js', 'tools', 'sace-lista.js'), 'utf8');
const fSexos = SLsrc.slice(SLsrc.indexOf('function sexosSace('), SLsrc.indexOf('/* ── cuadro «Matrícula final'));
ok(fSexos && !/nombre|\.sexo\s*=[^=]/.test(fSexos), 'sexosSace no mira el nombre ni pone sexo: solo cuenta');

/* ══════════ 5 · Paridad blob/filas: ninguna nota cambia ══════════ */
console.log('5 · Conteo y suma de notas, iguales antes y después');
const hFilas = huellaFilas(tablas);
const hGrupo = huellaNotas(g.notas);
const hBlob = huellaNotas(grupoBlob().notas);
igual(hFilas, { n: 11 * 8 * 4, suma: ALUMNOS.reduce((t, a) => t + a.nota * 8 * 4, 0) }, 'filas: 352 notas con su suma');
igual(hGrupo, hFilas, 'el grupo armado desde filas tiene las mismas notas y la misma suma');
igual(hBlob, hFilas, 'el blob tiene las mismas notas y la misma suma (paridad blob/filas)');
// El maestro completa el sexo (aquí, con datos ficticios): las notas no se tocan.
const tablas2 = JSON.parse(filasAntes);
tablas2.alumnos.forEach(a => { if (SIN_SEXO.includes(a.num_lista)) a.sexo = a.num_lista === 6 ? 'M' : 'F'; });
const g2 = PAPEL.grupo(apiDe(tablas2), AULA);
igual(huellaFilas(tablas2), hFilas, 'después de completar el sexo: las mismas filas de notas y la misma suma');
igual(huellaNotas(g2.notas), hFilas, 'y el grupo impreso, también');
igual(JSON.stringify(tablas2.notas), JSON.stringify(JSON.parse(filasAntes).notas), 'ni una nota distinta, ni una de más ni de menos');
const r2 = RS.calcular(g2, { corte: CORTE, SL });
igual(r2.mov.final, nvt(6, 4, 10), 'ya completas: N + V = T (6 + 4 = 10)');
igual(r2.avisos.sinSexo.length, 0, 'y el aviso de los cuadros desaparece');
igual(r2.porAlumno.map(x => x.prom), r.porAlumno.map(x => x.prom), 'los promedios de cada alumno no cambian');
igual(r2.aprobados.T, r.aprobados.T, 'ni cuántos aprueban');

console.log(fallos ? '\n✘ ' + fallos + ' fallo(s)' : '\n✓ Fichas sin sexo: se avisa, no se adivina y ninguna nota cambia');
process.exit(fallos ? 1 : 0);
