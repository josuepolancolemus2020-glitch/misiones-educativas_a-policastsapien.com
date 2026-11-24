/* =====================================================================
   M.E.T.A.S · Personalidad e inasistencias del respaldo antiguo
   ---------------------------------------------------------------------
   Datos ficticios, sin red. El respaldo es un METAS_ADMIN_V1 de mentira.
   Comprueba que traer la personalidad y el pase de lista:

     · cuelga cada fila del alumno ya importado, por su id de siempre;
     · si el alumno no está, lo lista y no lo crea;
     · la segunda vez dice «ya estaba» y no manda otra operación;
     · si la nube tiene otra letra u otra falta, ofrece «Cambiar de X a Y»
       sin marcarlo, y solo lo anota si el docente lo marca;
     · no toca pagos, notas, colectas, gastos ni alumnos.

   Uso:  node _dev/prueba-importar-personalidad-asistencia.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const RAIZ = path.resolve(__dirname, '..');
const OWNER = '00000000-0000-4000-8000-0000000000aa';
const PAGO = '60000000-0000-4000-8000-0000000000c1';
const NOTA = '60000000-0000-4000-8000-0000000000c2';
const PERS_NUBE = '60000000-0000-4000-8000-0000000000c3';
const PERS_IGUAL = '60000000-0000-4000-8000-0000000000c4';
const DIA_NUBE = '60000000-0000-4000-8000-0000000000c5';
const ASIS_NUBE = '60000000-0000-4000-8000-0000000000c6';

let fallos = 0;
function ok(que, cond, detalle) {
  console.log((cond ? '  ✔ ' : '  ✘ ') + que);
  if (!cond) {
    fallos++;
    if (detalle !== undefined) console.log('      ' + (typeof detalle === 'string' ? detalle : JSON.stringify(detalle)));
  }
}

function blob() {
  return {
    v: 2,
    grupos: [{
      id: 'GFICT1',
      escuela: 'Escuela Ficticia Las Flores',
      grado: '6º',
      seccion: '1',
      boleta: { anio: '2026', escalaPers: ['S', 'MB', 'B'] },
      lista: [
        { num: 1, nombre: 'Ana López', idn: '0801-1990-00123', sexo: 'F' },
        { num: 2, nombre: 'Luis Pérez', sexo: 'M' },
        { num: 3, nombre: 'Mario Ruiz', idn: '0801199000456', sexo: 'M' },
        { num: 4, nombre: 'Prueba Uno', prueba: true, sexo: 'F' },
      ],
      notas: {
        I: {
          Español: { 1: '90', 2: '80' },
          Puntualidad: { 1: 'S', 4: 'MB' },
          'Espíritu de trabajo': { 2: 'MB' },
          Inasistencias: { 1: '3', 2: '1' },
          Sociabilidad: { 1: '??' },
        },
        II: {
          Puntualidad: { 1: 'S' },
          Moralidad: { 2: '4', 3: 'B' },
        },
      },
      inasisOficial: { 1: 5 },
      asistencia: [
        { f: '2026-03-02', aus: { 1: 'A', 2: 'E' } },
        { f: '2026-03-02', aus: { 2: 'A' } },
        { f: '2026-03-03', aus: {} },
        { f: '2026-02-30', aus: { 1: 'A' } },
      ],
      colectas: [{ id: 'c1', concepto: 'Papel', montoAlumno: 50, fecha: '2026-03-01', pagos: { 1: 50 } }],
    }],
  };
}

function aparato() {
  const web = crypto.webcrypto;
  const mem = {};
  const contexto = {
    console: console,
    setTimeout: function () { return 0; },
    clearTimeout: function () {},
    Promise: Promise,
    URL: URL,
    TextEncoder: TextEncoder,
    Uint8Array: Uint8Array,
    crypto: web,
    localStorage: {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
      setItem: function (k, v) { mem[k] = String(v); },
      removeItem: function (k) { delete mem[k]; },
    },
    navigator: {},
    location: { hostname: 'prueba.invalid', href: 'https://prueba.invalid/' },
    addEventListener: function () {},
    removeEventListener: function () {},
    fetch: function () { return Promise.reject(new Error('sin red de prueba')); },
  };
  contexto.window = contexto;
  vm.createContext(contexto);
  ['js/datos/ids.js', 'js/datos/montos.js', 'js/datos/nube.js', 'js/datos/almacen.js', 'js/datos/cola.js',
    'js/datos/tiempo-real.js', 'js/datos/senal.js', 'js/datos/calculos.js', 'js/datos/datos.js', 'js/datos/importar.js']
    .forEach(function (f) {
      vm.runInContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), contexto, { filename: f });
    });
  return contexto;
}

async function preparar(ctx) {
  const M = ctx.MetasDatos;
  M._nube.peticion = async function () {
    const e = new Error('red');
    e.tipo = 'red';
    throw e;
  };
  M._nube.leer = async function () { return []; };
  // La cuenta se pone DESPUÉS de iniciar: si ya hubiera cuenta, «ponerse al
  // día» vería listas vacías y creería que el grupo se borró en la nube.
  const api = await M.iniciar();
  M._nube.uid = function () { return OWNER; };
  M._nube.sesion = function () { return { uid: OWNER, access_token: 'prueba', refresh_token: 'prueba' }; };
  return { M: M, api: api };
}

function fila(id, extra) {
  return Object.assign({ id: id, version: 1, deleted_at: null }, extra);
}
function porTexto(plan, seccion, trozo) {
  return plan[seccion].filter(function (f) { return String(f.texto).indexOf(trozo) >= 0; });
}
function opsDe(M) {
  return M._almacen.cola().filter(function (o) { return o.owner === OWNER; });
}
function tablas(ops) {
  return ops.map(function (o) { return o.tabla + ':' + o.tipo; }).sort();
}

(async function () {
  console.log('— Sin el grupo, no se crea a nadie —');
  const vacio = aparato();
  const pv = await preparar(vacio);
  const Mv = pv.M;
  const leido = Mv.importar.leer(JSON.stringify(blob()));
  ok('el respaldo antiguo se abre', leido.ok && leido.archivo && leido.archivo.respaldo);
  const previo = await Mv.importar.preparar(pv.api, leido.archivo, {});
  ok('el grupo no está y no se crea', previo.aula.estado === 'error');
  ok('Ana se lista y no se crea', porTexto(previo, 'alumnos', 'Ana López').some(function (f) { return f.estado === 'error'; }));
  ok('Mario se lista y no se crea', porTexto(previo, 'alumnos', 'Mario Ruiz').some(function (f) { return f.estado === 'error'; }));
  ok('el alumno de prueba no se lista', !previo.alumnos.some(function (f) { return /Prueba/.test(f.texto); }));
  ok('sin el grupo no hay filas nuevas de personalidad', previo.personalidad.length === 0, previo.personalidad.length);
  const aulaId = previo.aula.id;
  const ana = porTexto(previo, 'alumnos', 'Ana López')[0].id;
  const luis = porTexto(previo, 'alumnos', 'Luis Pérez')[0].id;
  const mario = porTexto(previo, 'alumnos', 'Mario Ruiz')[0].id;
  ok('cada alumno tiene su id', !!(aulaId && ana && luis && mario && ana !== luis));

  console.log('— Con el grupo ya importado: nuevo, ya estaba y cambiar —');
  const ctx = aparato();
  const p1 = await preparar(ctx);
  const M = p1.M;
  const api = p1.api;
  const alm = M._almacen;
  alm.guardarFila(OWNER, 'aulas', fila(aulaId, {
    escuela: 'Escuela Ficticia Las Flores', grado: 6, seccion: '1', anio_lectivo: 2026,
  }));
  alm.guardarFila(OWNER, 'alumnos', fila(ana, {
    aula_id: aulaId, nombre_completo: 'Ana López', identidad: '0801199000123', documento_pais: 'HN',
  }));
  alm.guardarFila(OWNER, 'alumnos', fila(luis, {
    aula_id: aulaId, nombre_completo: 'Luis Pérez',
  }));
  alm.guardarFila(OWNER, 'notas_personalidad', fila(PERS_NUBE, {
    aula_id: aulaId, alumno_id: ana, periodo: 'I', rasgo: 'Puntualidad', letra: 'MB',
  }));
  alm.guardarFila(OWNER, 'notas_personalidad', fila(PERS_IGUAL, {
    aula_id: aulaId, alumno_id: ana, periodo: 'II', rasgo: 'Puntualidad', letra: 'S',
  }));
  alm.guardarFila(OWNER, 'asistencia_dias', fila(DIA_NUBE, { aula_id: aulaId, fecha: '2026-03-02' }));
  alm.guardarFila(OWNER, 'asistencia', fila(ASIS_NUBE, {
    aula_id: aulaId, alumno_id: ana, fecha: '2026-03-02', estado: 'excusa',
  }));
  alm.guardarFila(OWNER, 'pagos', fila(PAGO, { alumno_id: ana, monto: '150.00', colecta_id: 'c-ficticia' }));
  alm.guardarFila(OWNER, 'notas', fila(NOTA, {
    aula_id: aulaId, alumno_id: ana, periodo: 'I', componente: 'final', valor: '90',
  }));
  const pagoAntes = JSON.stringify(alm.fila(OWNER, 'pagos', PAGO));
  const notaAntes = JSON.stringify(alm.fila(OWNER, 'notas', NOTA));
  const alumnosAntes = alm.filasDe(OWNER, 'alumnos').map(function (f) { return f.id; }).sort();

  const plan = await M.importar.preparar(api, leido.archivo, {});
  const punt = porTexto(plan, 'personalidad', 'Ana López · Puntualidad · parcial I')[0];
  const igual = porTexto(plan, 'personalidad', 'Ana López · Puntualidad · parcial II')[0];
  const espiritu = porTexto(plan, 'personalidad', 'Luis Pérez · Espíritu de trabajo')[0];
  const moral = porTexto(plan, 'personalidad', 'Luis Pérez · Moralidad')[0];
  const mala = porTexto(plan, 'personalidad', 'Sociabilidad')[0];
  const faltaAna = porTexto(plan, 'asistencia', 'Ana López · 2026-03-02')[0];
  const faltaLuis = porTexto(plan, 'asistencia', 'Luis Pérez · 2026-03-02')[0];
  const diaNuevo = plan.asistenciaDias.filter(function (f) { return f.texto.indexOf('2026-03-03') >= 0; })[0];
  const diaYa = plan.asistenciaDias.filter(function (f) { return f.texto.indexOf('2026-03-02') >= 0; })[0];
  const diaMala = plan.asistenciaDias.filter(function (f) { return f.estado === 'error'; })[0];

  ok('el grupo ya estaba', plan.aula.estado === 'ya_estaba');
  ok('Cambiar de MB a S, sin marcar', punt && punt.estado === 'cambia_sin_marcar' && punt.antes === 'MB' && punt.valor === 'S', punt);
  ok('la misma letra queda como ya estaba y no pide otra fila', igual && igual.estado === 'ya_estaba' && igual.id === PERS_IGUAL, igual && igual.id);
  ok('el 4 de Luis es S, nuevo', moral && moral.estado === 'nuevo' && moral.campos.letra === 'S', moral && moral.campos);
  ok('el espíritu de Luis es nuevo', espiritu && espiritu.estado === 'nuevo' && espiritu.campos.alumno_id === luis);
  ok('una letra que no se entiende no se anota', mala && mala.estado === 'error');
  ok('Cambiar de Con excusa a Ausente, sin marcar', faltaAna && faltaAna.estado === 'cambia_sin_marcar' && faltaAna.antes === 'Con excusa' && faltaAna.valor === 'Ausente', faltaAna);
  ok('si el día venía dos veces, manda la primera marca de Luis', faltaLuis && faltaLuis.estado === 'nuevo' && faltaLuis.campos.estado === 'excusa', faltaLuis && faltaLuis.campos);
  ok('un día en que nadie faltó también se anota', diaNuevo && diaNuevo.estado === 'nuevo');
  ok('el día que ya estaba no se vuelve a crear', diaYa && diaYa.estado === 'ya_estaba' && diaYa.id === DIA_NUBE);
  ok('una fecha imposible se señala', diaMala && diaMala.estado === 'error');
  ok('Mario sigue en el resumen y no se crea', porTexto(plan, 'alumnos', 'Mario Ruiz').some(function (f) { return f.estado === 'error' && f.id === mario; }));
  ok('no se arma ninguna nota ni ningún pago', plan.notas.length === 0 && plan.pagos.length === 0 && plan.colectas.length === 0 && plan.gastos.length === 0);
  ok('la pantalla ya dice Cambiar de X a Y con estos mismos campos',
    /Cambiar de ' \+ esc\(f\.antes\) \+ ' a ' \+ esc\(f\.valor\)/.test(fs.readFileSync(path.join(RAIZ, 'js/tools/mi-aula.js'), 'utf8'))
    && /personalidad: 'Personalidad'/.test(fs.readFileSync(path.join(RAIZ, 'js/tools/mi-aula.js'), 'utf8')));

  const guardado = await M.importar.guardar(api, plan, {});
  await new Promise(function (r) { setImmediate(r); });
  const ops = opsDe(M);
  const tipos = tablas(ops);
  ok('guardar solo manda lo nuevo', guardado.guardados === ops.length && ops.length > 0, { guardados: guardado.guardados, tipos: tipos });
  ok('todo va por la cola, a personalidad, días o faltas', ops.every(function (o) {
    return o.tipo === 'crear' && (o.tabla === 'notas_personalidad' || o.tabla === 'asistencia_dias' || o.tabla === 'asistencia');
  }), tipos);
  ok('cada operación trae su op_id fijo', ops.every(function (o) { return /^[0-9a-f-]{36}$/.test(o.op_id); }));
  ok('no se tocó el pago ni la nota que ya estaban',
    JSON.stringify(alm.fila(OWNER, 'pagos', PAGO)) === pagoAntes && JSON.stringify(alm.fila(OWNER, 'notas', NOTA)) === notaAntes);
  ok('no se creó a Mario ni se reescribió la lista',
    alm.filasDe(OWNER, 'alumnos').map(function (f) { return f.id; }).sort().join() === alumnosAntes.join()
    && !ops.some(function (o) { return o.tabla === 'alumnos' || o.tabla === 'pagos' || o.tabla === 'notas' || o.tabla === 'colectas' || o.tabla === 'gastos'; }));
  const opPorId = {};
  ops.forEach(function (o) { opPorId[o.id] = o.op_id; });
  ok('la falta de Ana no se cambió sola', !opPorId[ASIS_NUBE] && !ops.some(function (o) { return o.tipo === 'editar'; }));

  console.log('— Volver a abrirlo: ya estaba, y el cambio sigue sin marcar —');
  const plan2 = await M.importar.preparar(api, leido.archivo, {});
  ok('lo nuevo ahora ya estaba', porTexto(plan2, 'personalidad', 'Luis Pérez · Moralidad')[0].estado === 'ya_estaba');
  ok('el día vacío ya estaba', plan2.asistenciaDias.filter(function (f) { return f.texto.indexOf('2026-03-03') >= 0; })[0].estado === 'ya_estaba');
  const punt2 = porTexto(plan2, 'personalidad', 'Ana López · Puntualidad · parcial I')[0];
  ok('Cambiar de MB a S sigue sin marcar', punt2.estado === 'cambia_sin_marcar' && punt2.antes === 'MB' && punt2.valor === 'S');
  const antesCola = opsDe(M).length;
  const g2 = await M.importar.guardar(api, plan2, {});
  await new Promise(function (r) { setImmediate(r); });
  ok('sin marcar, no se anota la corrección ni se repite lo nuevo', g2.guardados === 0 && opsDe(M).length === antesCola, g2);

  console.log('— Si el docente marca el cambio, es una sola corrección —');
  const dec = {};
  dec[punt2.marca] = 'cambiar';
  dec[porTexto(plan2, 'asistencia', 'Ana López · 2026-03-02')[0].marca] = 'cambiar';
  const plan3 = await M.importar.preparar(api, leido.archivo, { decisiones: dec });
  const punt3 = porTexto(plan3, 'personalidad', 'Ana López · Puntualidad · parcial I')[0];
  const asis3 = porTexto(plan3, 'asistencia', 'Ana López · 2026-03-02')[0];
  ok('marcado, la letra pasa a cambiarse', punt3.estado === 'cambia' && punt3.id === PERS_NUBE);
  ok('marcado, la falta pasa a cambiarse', asis3.estado === 'cambia' && asis3.id === ASIS_NUBE && asis3.campos.estado === 'ausente');
  const g3 = await M.importar.guardar(api, plan3, {});
  await new Promise(function (r) { setImmediate(r); });
  const ediciones = opsDe(M).filter(function (o) { return o.tipo === 'editar'; });
  ok('se anotan las dos correcciones y nada más', g3.guardados === 2 && ediciones.length === 2, tablas(ediciones));
  ok('la corrección de la letra lleva op_id y deja la letra nueva', ediciones.some(function (o) {
    return o.tabla === 'notas_personalidad' && o.id === PERS_NUBE && o.cambios.letra === 'S' && o.op_id;
  }));
  ok('la corrección de la falta no borra el día: cambia el estado', ediciones.some(function (o) {
    return o.tabla === 'asistencia' && o.id === ASIS_NUBE && o.cambios.estado === 'ausente' && !o.cambios.deleted_at;
  }));

  const otra = aparato();
  const p2 = await preparar(otra);
  const M2 = p2.M;
  M2._almacen.guardarFila(OWNER, 'aulas', fila(aulaId, {
    escuela: 'Escuela Ficticia Las Flores', grado: 6, seccion: '1', anio_lectivo: 2026,
  }));
  M2._almacen.guardarFila(OWNER, 'alumnos', fila(ana, {
    aula_id: aulaId, nombre_completo: 'Ana López', identidad: '0801199000123', documento_pais: 'HN',
  }));
  M2._almacen.guardarFila(OWNER, 'alumnos', fila(luis, { aula_id: aulaId, nombre_completo: 'Luis Pérez' }));
  M2._almacen.guardarFila(OWNER, 'notas_personalidad', fila(PERS_NUBE, {
    aula_id: aulaId, alumno_id: ana, periodo: 'I', rasgo: 'Puntualidad', letra: 'MB',
  }));
  M2._almacen.guardarFila(OWNER, 'notas_personalidad', fila(PERS_IGUAL, {
    aula_id: aulaId, alumno_id: ana, periodo: 'II', rasgo: 'Puntualidad', letra: 'S',
  }));
  M2._almacen.guardarFila(OWNER, 'asistencia_dias', fila(DIA_NUBE, { aula_id: aulaId, fecha: '2026-03-02' }));
  M2._almacen.guardarFila(OWNER, 'asistencia', fila(ASIS_NUBE, {
    aula_id: aulaId, alumno_id: ana, fecha: '2026-03-02', estado: 'excusa',
  }));
  const planOtra = await M2.importar.preparar(p2.api, M2.importar.leer(JSON.stringify(blob())).archivo, {});
  await M2.importar.guardar(p2.api, planOtra, {});
  await new Promise(function (r) { setImmediate(r); });
  const op2 = {};
  opsDe(M2).forEach(function (o) { op2[o.id] = o.op_id; });
  const mismos = Object.keys(opPorId).every(function (id) { return op2[id] === opPorId[id]; });
  ok('en otro aparato los id y los op_id de lo nuevo son los mismos', mismos && Object.keys(opPorId).length === Object.keys(op2).length, { aqui: opPorId, alla: op2 });

  const planYa = await M2.importar.preparar(p2.api, M2.importar.leer(JSON.stringify(blob())).archivo, { decisiones: dec });
  const ed2 = await M2.importar.guardar(p2.api, planYa, {});
  await new Promise(function (r) { setImmediate(r); });
  const ediciones2 = opsDe(M2).filter(function (o) { return o.tipo === 'editar'; });
  const opEdit = {};
  ediciones.forEach(function (o) { opEdit[o.id] = o.op_id; });
  ok('marcar el cambio en otro aparato es la misma corrección', ed2.guardados === 2 && ediciones2.every(function (o) {
    return opEdit[o.id] === o.op_id;
  }), ediciones2.map(function (o) { return o.op_id; }));

  console.log('— El archivo de noviembre sigue igual —');
  const viejo = {
    formato: 'metas-importacion/1',
    origen: { tipo: 'manual', generado_at: '2026-11-16T12:00:00.000Z' },
    aula: { escuela: 'Otra Escuela Ficticia', grado: 3, seccion: 'A', anio_lectivo: 2026 },
  };
  const lv = M.importar.leer(JSON.stringify(viejo));
  ok('el archivo de importación de noviembre se sigue abriendo', lv.ok && !lv.archivo.respaldo);
  const planViejo = await M.importar.preparar(api, lv.archivo, {});
  ok('ese archivo no trae personalidad ni faltas', planViejo.personalidad.length === 0 && planViejo.asistencia.length === 0 && planViejo.aula.estado === 'nuevo');
  ok('un respaldo entre comillas también se abre', M.importar.leer(JSON.stringify(JSON.stringify(blob()))).ok);

  console.log(fallos ? '\n✘ ' + fallos + ' fallo(s)\n' : '\n✔ Todo en orden\n');
  process.exit(fallos ? 1 : 0);
})().catch(function (e) {
  console.error(e);
  process.exit(1);
});
