/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · La ficha del alumno manda en Mi aula; el SACE, en los cuadros
   ──────────────────────────────────────────────────────────────
   Decisiones de Josué (20 nov. 2026):
     1 · Mi aula es el registro del aula: todo alumno matriculado tiene su
         ficha, aunque no tenga identidad ni esté todavía en el SACE.
     2 · En los cuadros, el Resumen final, el Cuadro final y la matrícula
         cuentan SOLO los que tienen en_sace = true (y no se fueron).
     3 · en_sace se marca con la casilla «Registrado en SACE» de la ficha o
         importando la lista del SACE.
     4 · El sexo es obligatorio en la ficha, solo F o M.

   Los dos fallos que esta sonda demuestra (rojos antes del arreglo):
     a · Cuadros en cero: con Mi aula como estaba, la ficha no pedía sexo
         ni tenía cómo marcar en_sace, y la importación del SACE no copiaba
         el sexo: N y V salían en 0 y, sin nadie marcado, todo en 0.
     b · Cuadro final con 11 en vez de 10: los cinco cuadros contaban solo
         a.sace === true (cuadros-sace.js, calcular), pero el Cuadro final
         usaba SaceLista.alumnosQueCuentan, que sin nadie marcado devuelve
         a TODOS menos trasladados y desertores (sace-lista.js). Se colaba
         la ficha sin identidad y sin SACE. Y un «Retirado» de Mi aula no
         estaba entre los que se fueron: con en_sace se colaba también.

   Aula INVENTADA (nombres de fantasía): 12 fichas, 7 niñas y 5 varones;
   10 en el SACE (6 niñas, 4 varones); la #11, niña, sin identidad y sin
   SACE; la #12, varón, trasladado (estaba en el SACE). Esperado: 10 = 6/4.

   Uso:  node _dev/verifica-sace-ficha.js
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
const hay = (f) => typeof f === 'function';

const ctx = { console, Intl, Date, Math, JSON, String, Number, Object, Array, RegExp, Error, TypeError };
ctx.window = ctx; ctx.globalThis = ctx;
vm.createContext(ctx);
['js/datos/montos.js', 'js/tools/sace-lista.js', 'js/tools/cuadros-sace.js', 'js/tools/mi-aula-papel.js']
  .forEach(f => vm.runInContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), ctx, { filename: f }));
const SL = ctx.SaceLista;
const RS = ctx.ResumenSace;
const PAPEL = ctx.metasMiAulaPapel;

const MATS = ['Español', 'Matemáticas', 'Ciencias Naturales', 'Ciencias Sociales'];
const P = ['I', 'II', 'III', 'IV'];
const CORTE = '2026-11-30';
const AULA = { id: 'aula-ficticia-ficha', escuela: 'Escuela de Fantasía', grado: 6, seccion: '1', anio_lectivo: 2026 };
const ALUMNOS = [
  { n: 1,  nom: 'Alba Ficticia Uno',      sexo: 'F', idn: '0801201500001', fnac: '2015-02-10', sace: true, nota: 70 },
  { n: 2,  nom: 'Bruno Ficticio Dos',     sexo: 'M', idn: '0801201400002', fnac: '2014-05-30', sace: true, nota: 69 },
  { n: 3,  nom: 'Cira Ficticia Tres',     sexo: 'F', idn: '0801201500003', fnac: '2015-06-01', sace: true, nota: 79 },
  { n: 4,  nom: 'Dimas Ficticio Cuatro',  sexo: 'M', idn: '0801201400004', fnac: '2014-01-01', sace: true, nota: 80 },
  { n: 5,  nom: 'Eva Ficticia Cinco',     sexo: 'F', idn: '0801201500005', fnac: '2015-05-05', sace: true, nota: 90 },
  { n: 6,  nom: 'Fito Ficticio Seis',     sexo: 'M', idn: '0801201600006', fnac: '2016-02-02', sace: true, nota: 91 },
  { n: 7,  nom: 'Gala Ficticia Siete',    sexo: 'F', idn: '0801201500007', fnac: '2015-07-07', sace: true, nota: 95 },
  { n: 8,  nom: 'Hilda Ficticia Ocho',    sexo: 'F', idn: '0801201400008', fnac: '2014-04-04', sace: true, nota: 85 },
  { n: 9,  nom: 'Ines Ficticia Nueve',    sexo: 'F', idn: '0801201500009', fnac: '2015-09-09', sace: true, nota: 60 },
  { n: 10, nom: 'Jaco Ficticio Diez',     sexo: 'M', idn: '0801201500010', fnac: '2015-10-10', sace: true, nota: 75 },
  // sin identidad y sin SACE, con puros 100: si se colara se notaría
  { n: 11, nom: 'Kira Sin Papeles',       sexo: 'F', idn: '',              fnac: '2015-01-01', sace: false, nota: 100 },
  // estaba en el SACE y se trasladó
  { n: 12, nom: 'Lalo Ficticio Traslado', sexo: 'M', idn: '0801201400012', fnac: '2014-03-03', sace: true, nota: 100,
    estado: 'trasladado', estadoF: '2026-06-15' },
];
const id = (t, x) => t + '-' + String(x).padStart(4, '0');

/* opc.marca: false = nadie marcado todavía (Mi aula como estaba)
   opc.sinSexo: fichas creadas sin sexo (la alta de antes no lo pedía) */
function tablas(opc) {
  opc = opc || {};
  const t = {
    aulas: [AULA], familias: [], notas_personalidad: [], inasistencias_oficiales: [], asistencia_dias: [], asistencia: [],
    v_colecta_alumnos: [], colectas: [], pagos: [], gastos: [],
    asignaturas: MATS.map((m, i) => ({ id: id('asig', i + 1), aula_id: AULA.id, nombre: m, orden: i + 1 })),
    alumnos: ALUMNOS.map(a => ({
      id: id('al', a.n), aula_id: AULA.id, nombre_completo: a.nom, num_lista: a.n,
      sexo: opc.sinSexo ? null : a.sexo, identidad: a.idn || null, documento_pais: 'HN', fecha_nacimiento: a.fnac,
      estado: (opc.estado12 && a.n === 12) ? opc.estado12 : (a.estado || 'activo'), estado_fecha: a.estadoF || null,
      en_sace: opc.marca === false ? false : a.sace, sace_num: null, edad_sace: null, no_copiar_sace: false,
    })),
    notas: [],
  };
  ALUMNOS.forEach(a => MATS.forEach((m, i) => P.forEach(p => {
    t.notas.push({ id: id('nota', t.notas.length + 1), aula_id: AULA.id, alumno_id: id('al', a.n), asignatura_id: id('asig', i + 1),
      periodo: p, componente: 'final', valor: a.nota + '.00' });
  })));
  return t;
}
const apiDe = (t) => ({
  lista(tabla, filtro) {
    return (t[tabla] || []).filter(f => !f.deleted_at && Object.keys(filtro || {}).every(k => f[k] === filtro[k]))
      .map(f => Object.assign({}, f));
  },
});
// Lo que hace MetasDatos.editar con la fila del aparato, anotando cada llamada.
function datosDe(t, llamadas) {
  return {
    editar(tabla, idx, c) { llamadas.push(['editar', tabla, idx, c]); Object.assign(t[tabla].find(f => f.id === idx), c); return { id: idx }; },
    crear(tabla) { llamadas.push(['crear', tabla]); },
    borrar(tabla) { llamadas.push(['borrar', tabla]); },
  };
}
function cuentas(t) {
  const g = PAPEL.grupo(apiDe(t), AULA);
  const r = RS.calcular(g, { corte: CORTE, SL });
  return { g, r, cs: RS.cuadros(r, '6º-1'), cf: RS.cuadroFinal(g, { SL, corte: CORTE }) };
}
const notasHuella = (t) => ({ n: t.notas.length, suma: t.notas.reduce((s, x) => s + Math.round(parseFloat(x.valor) * 100), 0), json: JSON.stringify(t.notas) });
const nvt = (r) => ({ final: r.mov.final, edades: r.edTotal, evaluados: r.evaluados });

/* ── a · cuadros en cero ── */
console.log('a · Cuadros en cero');
{
  // Mi aula como estaba: las fichas sin sexo (la alta no lo pedía) y la
  // importación del SACE marcaba en_sace pero no copiaba el sexo.
  const t = tablas({ marca: false, sinSexo: true });
  const ordenados = t.alumnos.slice().sort((a, b) => a.num_lista - b.num_lista);
  const csv = 'num;identidad;nombre;sexo;fecha_nacimiento;edad_sace\n' + ALUMNOS.filter(a => a.sace).map((a, i) =>
    [i + 1, a.idn, a.nom.toUpperCase(), a.sexo, a.fnac, 11].join(';')).join('\n') + '\n';
  const plan = SL.emparejarFilas(ordenados, SL.parseCsv(csv).filas);
  const llamadas = [];
  const d = datosDe(t, llamadas);
  SL.cambiosFilas(ordenados, plan, { pares: plan.pares.map((_, i) => i), fecha: '2026-11-20' }).forEach(x => d.editar('alumnos', x.id, x.cambios));
  const sexoDe = n => t.alumnos.find(a => a.num_lista === n).sexo;
  igual([sexoDe(1), sexoDe(2)], ['F', 'M'], 'importar el SACE copia el sexo a la ficha');
  const F = cuentas(t);
  // la #12 está en el SACE pero trasladado: no es matrícula final
  igual(nvt(F.r), { final: { N: 6, V: 4, T: 10 }, edades: { N: 6, V: 4, T: 10 }, evaluados: { N: 6, V: 4, T: 10 } },
    'después de importar, los cuadros cuentan 10 = 6/4 (N y V ya no salen en 0)');

  // La casilla manual: la ficha dice F o M desde que se crea.
  ok(hay(SL.revisarFicha), 'sace-lista.js revisa la ficha (revisarFicha)');
  if (hay(SL.revisarFicha)) {
    ok(SL.revisarFicha({ nombre_completo: 'Kira Sin Papeles', sexo: 'F' }).errores.length === 0, 'sin identidad la ficha se guarda igual');
    ok(SL.revisarFicha({ nombre_completo: 'Kira Sin Papeles', sexo: '' }).errores.some(e => /sexo|niña|niño/i.test(e)), 'sin sexo no se guarda: lo pide');
    ok(SL.revisarFicha({ nombre_completo: 'Kira Sin Papeles', sexo: 'X' }).errores.length > 0, 'solo F o M');
    ok(SL.revisarFicha({ nombre_completo: 'Kira', sexo: 'F', identidad: '0801-2015' }).errores.some(e => /13/.test(e)), 'una identidad de Honduras incompleta se dice (13 cifras)');
    igual(SL.revisarFicha({ nombre_completo: ' Kira  Sin Papeles ', sexo: 'f', identidad: '0801-2015-00011' }).campos,
      { nombre_completo: 'Kira Sin Papeles', sexo: 'F', identidad: '0801201500011' }, 'limpia nombre, sexo e identidad');
  }
}

/* ── b · Cuadro final 11 en vez de 10 ── */
console.log('b · Cuadro final y los cinco cuadros, con la misma regla');
{
  const F = cuentas(tablas({ marca: false }));
  igual(F.r.mov.final.T, 0, 'nadie marcado en el SACE: los cinco cuadros dan 0');
  igual(F.cf.filas.length, 0, 'y el Cuadro final también 0 (antes daba 11, con la #11 sin identidad ni SACE)');
  ok(!F.cf.filas.some(f => f.num === 11), 'la ficha sin SACE no entra al Cuadro final');

  const R = cuentas(tablas({ estado12: 'retirado' }));
  igual(R.r.mov.final, { N: 6, V: 4, T: 10 }, 'un «Retirado» de Mi aula no es matrícula final (cuadros: 10 = 6/4)');
  igual(R.cf.filas.length, 10, 'ni entra al Cuadro final (10)');
  ok(R.r.cuadra === false && R.r.avisos.raros.length === 1, 'y el Resumen avisa que su estado no está en el formulario (elegir Trasladado o Desertor)');

  const T = cuentas(tablas({}));
  igual(nvt(T.r), { final: { N: 6, V: 4, T: 10 }, edades: { N: 6, V: 4, T: 10 }, evaluados: { N: 6, V: 4, T: 10 } },
    'aula ficticia: los cinco cuadros cuentan 10 = 6/4');
  igual(T.cf.filas.length, 10, 'Cuadro final: 10');
  igual(T.r.mov.traslados, { N: 0, V: 1, T: 1 }, 'el trasladado va en Traslados');
}

/* ── c · la casilla «Registrado en SACE» ── */
console.log('c · Marcar y desmarcar a mano');
ok(hay(SL.cambiosMarca), 'sace-lista.js prepara la marca manual (cambiosMarca)');
if (hay(SL.cambiosMarca)) {
  const t = tablas({});
  const antes = notasHuella(t);
  const llamadas = [];
  const d = datosDe(t, llamadas);
  const kira = () => t.alumnos.find(a => a.num_lista === 11);
  const notasKira = () => cuentas(t).g.notas.I['Matemáticas'][11];
  igual(notasKira(), '100', 'la #11 (sin identidad) tiene sus notas aunque no esté en el SACE');
  igual(cuentas(t).r.mov.final.T, 10, 'antes de marcar: 10');

  igual(SL.cambiosMarca(kira(), true, ''), { en_sace: true }, 'marcar: solo en_sace');
  igual(SL.cambiosMarca(kira(), true, '7'), { en_sace: true, sace_num: 7 }, 'marcar con su número del SACE (opcional)');
  d.editar('alumnos', kira().id, SL.cambiosMarca(kira(), true, ''));
  let C = cuentas(t);
  igual(C.r.mov.final, { N: 7, V: 4, T: 11 }, 'marcar la casilla la suma a los cuadros (11 = 7/4)');
  ok(C.cf.filas.some(f => f.num === 11 && f.prom === 100), 'y entra al Cuadro final con sus notas');
  igual(SL.cambiosMarca(kira(), true, ''), {}, 'marcar otra vez no manda nada');

  d.editar('alumnos', kira().id, SL.cambiosMarca(kira(), false, ''));
  C = cuentas(t);
  igual(C.r.mov.final, { N: 6, V: 4, T: 10 }, 'desmarcarla la quita (10 = 6/4)');
  igual(notasKira(), '100', 'la #11 conserva sus notas después de desmarcar');
  ok(llamadas.every(l => l[0] === 'editar' && l[1] === 'alumnos'), 'solo editar en alumnos');
  const despues = notasHuella(t);
  igual([despues.n, despues.suma], [antes.n, antes.suma], 'notas: mismo conteo y misma suma');
  ok(despues.json === antes.json, 'notas: ni una fila cambió');
}

/* ── d · importar el SACE: sexo, vista previa y lo que no se borra ── */
console.log('d · Importar la lista del SACE');
{
  const t = tablas({ marca: false });
  const al = n => t.alumnos.find(a => a.num_lista === n);
  al(3).sexo = 'M';   // mal anotado en Mi aula: gana el SACE
  al(4).sexo = null;  // sin sexo, y el SACE tampoco lo trae: no se adivina
  const ordenados = t.alumnos.slice().sort((a, b) => a.num_lista - b.num_lista);
  const csv = 'num;identidad;nombre;sexo;fecha_nacimiento;edad_sace\n' + ALUMNOS.filter(a => a.sace).map((a, i) =>
    [i + 1, a.idn, a.nom.toUpperCase(), a.n === 4 ? '' : a.sexo, a.fnac, 11].join(';')).join('\n') + '\n';
  const leido = SL.parseCsv(csv);
  const plan = SL.emparejarFilas(ordenados, leido.filas);
  const cambios = SL.cambiosFilas(ordenados, plan, { pares: plan.pares.map((_, i) => i), fecha: '2026-11-20' });
  const c = n => (cambios.find(x => x.id === id('al', n)) || {}).cambios || {};
  igual(c(3).sexo, 'F', 'el sexo de la ficha difiere del SACE: gana el SACE');
  ok(!('sexo' in c(4)), 'el SACE no trae sexo válido: no se adivina');
  const par4 = plan.pares.find(p => p.id === id('al', 4));
  ok(par4 && par4.f.sexo === '' && hay(SL.avisosPar) && SL.avisosPar(par4.f).some(a => /sexo/i.test(a)), 'y se avisa con ⚠ en la vista previa');
  igual(c(11), {}, 'la #11 no está en el SACE: queda en_sace = false y no se borra');
  const antes = notasHuella(t);
  const llamadas = [];
  const d = datosDe(t, llamadas);
  cambios.forEach(x => d.editar('alumnos', x.id, x.cambios));
  igual(t.alumnos.length, 12, 'nadie se borra');
  ok(llamadas.every(l => l[0] === 'editar' && l[1] === 'alumnos'), 'solo editar en alumnos');
  const despues = notasHuella(t);
  igual([despues.n, despues.suma], [antes.n, antes.suma], 'notas idénticas antes y después de importar');
  const src = fs.readFileSync(path.join(RAIZ, 'js/tools/mi-aula.js'), 'utf8');
  ok(/'sexo' in c\)|"sexo" in c\)|\('sexo' in c\)/.test(src) && /→/.test(src), 'la vista previa muestra el sexo antes → después');
}

/* ── e · datos para el SACE ── */
console.log('e · Datos para el SACE');
ok(hay(SL.datosParaSace), 'sace-lista.js arma la lista para registrar en el SACE (datosParaSace)');
if (hay(SL.datosParaSace)) {
  const t = tablas({});
  const filas = SL.datosParaSace(t.alumnos);
  igual(filas.map(f => f.num), [11], 'solo las fichas fuera del SACE que siguen en el aula');
  igual(Object.keys(filas[0]).filter(k => ['nombre', 'identidad', 'sexo', 'fecha_nacimiento'].includes(k)).sort(),
    ['fecha_nacimiento', 'identidad', 'nombre', 'sexo'], 'con nombre, identidad, sexo y fecha de nacimiento');
  igual(filas[0].identidad, '', 'sin identidad, en blanco (no se inventa)');
}

/* ── f · paridad blob y filas ── */
console.log('f · La misma aula en el blob y en filas');
{
  const T = cuentas(tablas({}));
  const notas = {};
  P.forEach(p => { notas[p] = {}; MATS.forEach(m => { notas[p][m] = {}; }); });
  ALUMNOS.forEach(a => MATS.forEach(m => P.forEach(p => { notas[p][m][a.n] = String(a.nota); })));
  const blob = {
    id: 'g', grado: '6', seccion: '1', materias: MATS.slice(), boleta: { anio: '2026' }, notas, recuperacion: {}, inasisOficial: {}, asistencia: [],
    lista: ALUMNOS.map(a => Object.assign({ num: a.n, nombre: a.nom, idn: a.idn, sexo: a.sexo, fnac: a.fnac, sace: a.sace },
      a.estado ? { estado: a.estado, estadoF: a.estadoF } : {})),
  };
  const r = RS.calcular(blob, { corte: CORTE, SL });
  igual(T.cs.map(c => c.filas.map(f => f.vals)), RS.cuadros(r, '6º-1').map(c => c.filas.map(f => f.vals)), 'los 5 cuadros, celda por celda');
  igual(T.cf.filas.map(f => [f.num, f.prom]), RS.cuadroFinal(blob, { SL }).filas.map(f => [f.num, f.prom]), 'Cuadro final: mismos alumnos y promedios');
}

/* ── g · la pantalla de Mi aula ── */
console.log('g · Mi aula');
{
  const src = fs.readFileSync(path.join(RAIZ, 'js/tools/mi-aula.js'), 'utf8');
  ok(/data-form="alumno"[\s\S]{0,1500}name="sexo"[\s\S]{0,200}required/.test(src), 'la alta rápida pide el sexo (F o M, obligatorio)');
  ok(/data-metas="alumno-en-sace"/.test(src) && /Registrado en SACE/.test(src), 'la ficha tiene la casilla «Registrado en SACE»');
  ok(/Aún no está en el SACE: no cuenta en estadísticas/.test(src), 'aviso discreto para la ficha fuera del SACE');
  ok(/data-metas="datos-sace"/.test(src) && /Datos para el SACE/.test(src), 'la vista «Datos para el SACE»');
  ok(/SL\.revisarFicha|SaceLista\.revisarFicha/.test(src) && /cambiosMarca/.test(src), 'la pantalla usa las mismas reglas (revisarFicha, cambiosMarca)');
  ok(!/Math\.random/.test(src), 'sin Math.random');
}

console.log(fallos ? '\n✘ ' + fallos + ' comprobación(es) fallaron' : '\n✓ La ficha del alumno y los cuadros del SACE cuentan lo mismo');
process.exit(fallos ? 1 : 0);
