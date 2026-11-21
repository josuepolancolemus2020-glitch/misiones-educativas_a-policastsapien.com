/* =====================================================================
   M.E.T.A.S · Un centro borrado en otro aparato no se queda aquí
   ---------------------------------------------------------------------
   Datos ficticios, sin red. El aparato tiene la copia local; la «nube»
   es una función de mentira. Comprueba que ponerse al día:

     · quita el centro borrado de verdad, su grupo, su alumna y la nota;
     · la edición que esperaba sale como «no se anotó» y no lo revive;
     · un centro con crear pendiente (cola, entrantes o pregunta) se queda;
     · con la lista de grupos a medias, no quita nada;
     · un centro archivado, que la nube sí devuelve, se queda.

   Uso:  node _dev/prueba-reconciliar-centros.js
   ===================================================================== */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const RAIZ = path.resolve(__dirname, '..');
const OWNER = '00000000-0000-4000-8000-0000000000aa';
const C_VIVO = '10000000-0000-4000-8000-000000000001';
const C_BORRADO = '10000000-0000-4000-8000-000000000002';
const C_NUEVO = '10000000-0000-4000-8000-000000000003';
const C_ARCH = '10000000-0000-4000-8000-000000000004';
const C_ENTRANTE = '10000000-0000-4000-8000-000000000005';
const C_PREGUNTA = '10000000-0000-4000-8000-000000000006';
const A_VIVO = '20000000-0000-4000-8000-000000000001';
const A_BORRADO = '20000000-0000-4000-8000-000000000002';
const ALUMNO = '30000000-0000-4000-8000-000000000001';
const NOTA = '40000000-0000-4000-8000-000000000001';
const PAGO = '60000000-0000-4000-8000-000000000001';
const FRASE = 'Ese centro o grupo ya se había borrado en otro aparato.';

let fallos = 0;
function ok(que, cond, detalle) {
  console.log((cond ? '  ✔ ' : '  ✘ ') + que);
  if (!cond) {
    fallos++;
    if (detalle !== undefined) console.log('      ' + (typeof detalle === 'string' ? detalle : JSON.stringify(detalle)));
  }
}
const palabras = (t) => String(t || '').trim().split(/\s+/).filter(Boolean).length;

function idNum(n) {
  return '50000000-0000-4000-8000-' + String(n).padStart(12, '0');
}
function centro(id, extra) {
  return Object.assign({
    id: id, nombre: 'Centro Ficticio', anio_lectivo: 2026, version: 2,
    deleted_at: null, updated_at: '2026-11-01T00:00:00.000Z',
  }, extra);
}
function errorRed() {
  const e = new Error('red');
  e.tipo = 'red';
  return e;
}

function aparato() {
  const web = crypto.webcrypto;
  const mem = {};
  const contexto = {
    console: console,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    Promise: Promise,
    URL: URL,
    crypto: {
      randomUUID: function () { return web.randomUUID(); },
      getRandomValues: function (b) { return web.getRandomValues(b); },
    },
    localStorage: {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(mem, k) ? mem[k] : null; },
      setItem: function (k, v) { mem[k] = String(v); },
      removeItem: function (k) { delete mem[k]; },
    },
    navigator: {},
    location: { hostname: 'prueba.invalid', href: 'https://prueba.invalid/' },
    fetch: function () {
      contexto.__red = (contexto.__red || 0) + 1;
      return Promise.reject(new Error('sin red de prueba'));
    },
  };
  contexto.window = contexto;
  vm.createContext(contexto);
  ['js/datos/ids.js', 'js/datos/montos.js', 'js/datos/nube.js', 'js/datos/almacen.js', 'js/datos/cola.js', 'js/datos/tiempo-real.js']
    .forEach(function (f) {
      vm.runInContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), contexto, { filename: f });
    });
  contexto.mem = mem;
  return contexto;
}

async function preparar(ctx, antesDeLider) {
  const M = ctx.MetasDatos;
  M._nube.uid = function () { return OWNER; };
  M._nube.sesion = function () { return { uid: OWNER, access_token: 'prueba', refresh_token: 'prueba' }; };
  M._nube.peticion = async function (metodo, ruta) {
    if (metodo === 'POST' && ruta === 'rechazos') return { ok: true, status: 201, datos: null };
    return { ok: true, status: 200, datos: [] };
  };
  await M._almacen.cargar();
  if (antesDeLider) await antesDeLider(M);
  await M._almacen.elegirLider();
  return M;
}

function idsDe(M, tabla) {
  return M._almacen.filasDe(OWNER, tabla).map(function (f) { return f.id; }).sort();
}
function enCola(M, opId) {
  return M._almacen.cola().some(function (o) { return o.op_id === opId; });
}

(async function () {
  console.log('— Tres centros: uno borrado en la nube, uno por crear, uno archivado —');
  const ctx = aparato();
  const consultas = [];
  const enNube = {
    centros: [C_VIVO, C_ARCH],
    aulas: [A_VIVO],
  };
  const M = await preparar(ctx, async function (api) {
    // Todavía no es líder: este crear queda en entrantes, no en la cola.
    api._almacen.encolar({
      op_id: 'op-entrante', owner: OWNER, tipo: 'crear', tabla: 'centros', id: C_ENTRANTE,
      cambios: { nombre: 'Centro Ficticio Entrante', anio_lectivo: 2026 },
    });
  });
  M._nube.leer = async function (q) {
    consultas.push(q);
    if (q.indexOf('select=id') < 0) return [];
    const tabla = q.split('?')[0];
    let lista = (enNube[tabla] || []).slice().sort();
    const m = /[?&]id=gt\.([^&]+)/.exec(q);
    if (m) {
      const tras = decodeURIComponent(m[1]);
      lista = lista.filter(function (id) { return id > tras; });
    }
    return lista.map(function (id) { return { id: id }; });
  };
  const alm = M._almacen;
  alm.guardarFila(OWNER, 'centros', centro(C_VIVO, { nombre: 'Centro Ficticio Las Flores' }));
  alm.guardarFila(OWNER, 'centros', centro(C_BORRADO, { nombre: 'Centro Ficticio Borrado', version: 3 }));
  alm.guardarFila(OWNER, 'centros', centro(C_NUEVO, { nombre: 'Centro Ficticio Nuevo', version: 0 }));
  alm.guardarFila(OWNER, 'centros', centro(C_ARCH, { nombre: 'Centro Ficticio Archivado', deleted_at: '2026-03-01T00:00:00.000Z' }));
  alm.guardarFila(OWNER, 'centros', centro(C_ENTRANTE, { nombre: 'Centro Ficticio Entrante', version: 0 }));
  alm.guardarFila(OWNER, 'centros', centro(C_PREGUNTA, { nombre: 'Centro Ficticio Pregunta', version: 0 }));
  alm.guardarFila(OWNER, 'aulas', {
    id: A_VIVO, centro_id: C_VIVO, grado: 6, seccion: '1', escuela: 'Centro Ficticio Las Flores',
    version: 1, deleted_at: null,
  });
  alm.guardarFila(OWNER, 'aulas', {
    id: A_BORRADO, centro_id: C_BORRADO, grado: 6, seccion: '2', escuela: 'Centro Ficticio Borrado',
    version: 1, deleted_at: null,
  });
  alm.guardarFila(OWNER, 'alumnos', {
    id: ALUMNO, aula_id: A_BORRADO, nombre_completo: 'Alumna Ficticia Uno', version: 1, deleted_at: null,
  });
  alm.guardarFila(OWNER, 'notas', {
    id: NOTA, alumno_id: ALUMNO, aula_id: A_BORRADO, version: 1, deleted_at: null,
  });
  alm.encolar({
    op_id: 'op-editar-borrado', owner: OWNER, tipo: 'editar', tabla: 'centros', id: C_BORRADO,
    base_version: 3, cambios: { nombre: 'Nombre que no debe volver' },
  });
  alm.encolar({
    op_id: 'op-editar-vivo', owner: OWNER, tipo: 'editar', tabla: 'centros', id: C_VIVO,
    base_version: 2, cambios: { direccion: 'Colonia Ficticia' },
  });
  alm.encolar({
    op_id: 'op-crear-nuevo', owner: OWNER, tipo: 'crear', tabla: 'centros', id: C_NUEVO,
    cambios: { nombre: 'Centro Ficticio Nuevo', anio_lectivo: 2026 },
  });
  alm.encolar({
    op_id: 'op-alumno', owner: OWNER, tipo: 'editar', tabla: 'alumnos', id: ALUMNO,
    base_version: 1, cambios: { nombre_completo: 'Alumna Ficticia Uno' },
  });
  alm.encolar({
    op_id: 'op-pago', owner: OWNER, tipo: 'pago_crear', tabla: 'pagos', id: PAGO,
    args: { p_alumno: ALUMNO, p_monto: '50.00' },
  });
  alm.ponerPregunta({
    id: 'preg-1', owner: OWNER, tipo: 'nombre_ocupado', texto: '¿Unirlos?',
    botones: [], op: {
      op_id: 'op-pregunta', owner: OWNER, tipo: 'crear', tabla: 'centros', id: C_PREGUNTA,
      cambios: { nombre: 'Centro Ficticio Pregunta', anio_lectivo: 2026 },
    },
  });

  await M._tiempoReal.ponerseAlDia(OWNER);

  ok('el centro borrado desaparece de la copia', idsDe(M, 'centros').indexOf(C_BORRADO) < 0, idsDe(M, 'centros'));
  ok('su grupo, su alumna y la nota también', !alm.fila(OWNER, 'aulas', A_BORRADO)
    && !alm.fila(OWNER, 'alumnos', ALUMNO) && !alm.fila(OWNER, 'notas', NOTA));
  ok('el centro que sí está en la nube se queda, con su grupo', !!alm.fila(OWNER, 'centros', C_VIVO)
    && !!alm.fila(OWNER, 'aulas', A_VIVO));
  ok('el centro archivado se queda', !!alm.fila(OWNER, 'centros', C_ARCH)
    && alm.fila(OWNER, 'centros', C_ARCH).deleted_at === '2026-03-01T00:00:00.000Z');
  ok('el centro con crear en la cola no se quita', !!alm.fila(OWNER, 'centros', C_NUEVO) && enCola(M, 'op-crear-nuevo'));
  ok('el crear que está en entrantes tampoco', !!alm.fila(OWNER, 'centros', C_ENTRANTE)
    && alm.misEntrantes().some(function (o) { return o.op_id === 'op-entrante'; }));
  ok('el crear que espera en una pregunta tampoco', !!alm.fila(OWNER, 'centros', C_PREGUNTA) && alm.preguntas().length === 1);
  ok('la edición del centro borrado salió de la cola', !enCola(M, 'op-editar-borrado'));
  ok('la edición del centro que sigue, no', enCola(M, 'op-editar-vivo'));
  const tarjeta = alm.noAnotado().filter(function (t) { return t.texto === FRASE; })[0];
  ok('la tarjeta dice que ese centro o grupo ya se había borrado', !!tarjeta, alm.noAnotado().map(function (t) { return t.texto; }));
  ok('esa frase no pasa de doce palabras', !!tarjeta && palabras(tarjeta.texto) <= 12, tarjeta && tarjeta.texto);
  ok('la edición de la alumna y el pago no se tiran en silencio', !enCola(M, 'op-alumno') && !enCola(M, 'op-pago')
    && alm.noAnotado().some(function (t) { return t.clave && t.clave.indexOf(ALUMNO) >= 0; })
    && alm.noAnotado().some(function (t) { return t.clave && t.clave.indexOf(PAGO) >= 0; }));
  const deIds = consultas.filter(function (q) { return q.indexOf('select=id') >= 0; });
  ok('los ids se piden sin filtrar deleted_at', deIds.length >= 2 && deIds.every(function (q) { return q.indexOf('deleted_at') < 0; }), deIds);
  ok('no se habló con una red de verdad', !ctx.__red);

  const tarjetasAntes = alm.noAnotado().length;
  await M._tiempoReal.ponerseAlDia(OWNER);
  ok('ponerse al día otra vez no revive el centro ni duplica la tarjeta',
    !alm.fila(OWNER, 'centros', C_BORRADO) && alm.noAnotado().length === tarjetasAntes && !enCola(M, 'op-editar-borrado'));

  console.log('— Si la lista de grupos no termina, no se quita nada —');
  const ctxRed = aparato();
  const Mred = await preparar(ctxRed);
  Mred._nube.leer = async function (q) {
    if (q.indexOf('aulas?select=id') === 0) throw errorRed();
    if (q.indexOf('centros?select=id') === 0) return [{ id: C_VIVO }];
    return [];
  };
  Mred._almacen.guardarFila(OWNER, 'centros', centro(C_VIVO, { nombre: 'Centro Ficticio Las Flores' }));
  Mred._almacen.guardarFila(OWNER, 'centros', centro(C_BORRADO, { nombre: 'Centro Ficticio Borrado' }));
  Mred._almacen.guardarFila(OWNER, 'aulas', {
    id: A_BORRADO, centro_id: C_BORRADO, grado: 6, seccion: '2', version: 1, deleted_at: null,
  });
  Mred._almacen.encolar({
    op_id: 'op-editar-borrado', owner: OWNER, tipo: 'editar', tabla: 'centros', id: C_BORRADO,
    base_version: 2, cambios: { nombre: 'Nombre que no debe volver' },
  });
  await Mred._tiempoReal.ponerseAlDia(OWNER);
  ok('con error de red siguen el centro, su grupo y la edición',
    !!Mred._almacen.fila(OWNER, 'centros', C_BORRADO)
    && !!Mred._almacen.fila(OWNER, 'aulas', A_BORRADO)
    && enCola(Mred, 'op-editar-borrado')
    && Mred._almacen.noAnotado().length === 0);
  ok('tampoco se fue el centro que la primera lista sí nombró', !!Mred._almacen.fila(OWNER, 'centros', C_VIVO));

  console.log('— La lista de ids viene por páginas —');
  const ctxPag = aparato();
  const Mpag = await preparar(ctxPag);
  const presente = idNum(1001);
  const fantasma = idNum(2000);
  const nubeMil = [];
  for (let i = 1; i <= 1001; i++) nubeMil.push(idNum(i));
  const pedidas = [];
  Mpag._nube.leer = async function (q) {
    if (q.indexOf('select=id') < 0) return [];
    pedidas.push(q);
    if (q.indexOf('deleted_at') >= 0) throw new Error('filtró deleted_at');
    let lista = q.indexOf('centros?') === 0 ? nubeMil.slice() : [];
    const m = /[?&]id=gt\.([^&]+)/.exec(q);
    if (m) {
      const tras = decodeURIComponent(m[1]);
      lista = lista.filter(function (id) { return id > tras; });
    }
    const lim = /limit=(\d+)/.exec(q);
    const n = lim ? Number(lim[1]) : 1000;
    return lista.slice(0, n).map(function (id) { return { id: id }; });
  };
  Mpag._almacen.guardarFila(OWNER, 'centros', centro(presente, { nombre: 'Centro Ficticio Página Dos' }));
  Mpag._almacen.guardarFila(OWNER, 'centros', centro(fantasma, { nombre: 'Centro Ficticio Fantasma' }));
  await Mpag._tiempoReal.ponerseAlDia(OWNER);
  ok('el centro de la segunda página se queda', !!Mpag._almacen.fila(OWNER, 'centros', presente));
  ok('el que no vino en ninguna página se quita', !Mpag._almacen.fila(OWNER, 'centros', fantasma));
  ok('hubo una segunda lectura con id mayor que el último de la primera',
    pedidas.some(function (q) { return q.indexOf('id=gt.') >= 0; }));

  const ctxCorta = aparato();
  const Mcorta = await preparar(ctxCorta);
  let paginas = 0;
  Mcorta._nube.leer = async function (q) {
    if (q.indexOf('centros?select=id') !== 0) {
      if (q.indexOf('select=id') >= 0) return [];
      return [];
    }
    paginas++;
    if (paginas > 1) throw errorRed();
    return nubeMil.slice(0, 1000).map(function (id) { return { id: id }; });
  };
  Mcorta._almacen.guardarFila(OWNER, 'centros', centro(presente, { nombre: 'Centro Ficticio Página Dos' }));
  Mcorta._almacen.guardarFila(OWNER, 'centros', centro(fantasma, { nombre: 'Centro Ficticio Fantasma' }));
  await Mcorta._tiempoReal.ponerseAlDia(OWNER);
  ok('si la segunda página falla, no se quita ni el fantasma',
    !!Mcorta._almacen.fila(OWNER, 'centros', presente) && !!Mcorta._almacen.fila(OWNER, 'centros', fantasma));

  console.log('— Avisar un borrado y mandar la edición —');
  const ctxRt = aparato();
  let aviso = null;
  ctxRt.supabase = {
    RealtimeClient: function () {
      this.setAuth = function () {};
      this.channel = function () {
        const ch = {
          on: function (tipo, filtro, cb) {
            if (tipo === 'postgres_changes') aviso = cb;
            return ch;
          },
          subscribe: function () { return ch; },
        };
        return ch;
      };
      this.removeAllChannels = function () {};
      this.disconnect = function () {};
    },
  };
  const Mrt = await preparar(ctxRt);
  Mrt._nube.leer = async function (q) {
    if (q.indexOf('id=in.') >= 0) return [];
    return [];
  };
  Mrt._almacen.guardarFila(OWNER, 'centros', centro(C_VIVO, { nombre: 'Centro Ficticio Las Flores' }));
  Mrt._almacen.guardarFila(OWNER, 'centros', centro(C_BORRADO, { nombre: 'Centro Ficticio Borrado' }));
  Mrt._almacen.guardarFila(OWNER, 'aulas', {
    id: A_BORRADO, centro_id: C_BORRADO, grado: 6, seccion: '2', version: 1, deleted_at: null,
  });
  Mrt._almacen.encolar({
    op_id: 'op-editar-borrado', owner: OWNER, tipo: 'editar', tabla: 'centros', id: C_BORRADO,
    base_version: 3, cambios: { nombre: 'Nombre que no debe volver' },
  });
  Mrt._tiempoReal.conectar(OWNER);
  ok('el aviso de borrado trae el id viejo', typeof aviso === 'function');
  if (aviso) aviso({ table: 'centros', new: {}, old: { id: C_BORRADO } });
  await new Promise(function (r) { setTimeout(r, 250); });
  ok('al releer y no venir, se van el centro y su grupo',
    !Mrt._almacen.fila(OWNER, 'centros', C_BORRADO) && !Mrt._almacen.fila(OWNER, 'aulas', A_BORRADO));
  ok('el otro centro no se toca', !!Mrt._almacen.fila(OWNER, 'centros', C_VIVO));
  ok('la edición pendiente queda en la tarjeta y no revive el centro',
    !enCola(Mrt, 'op-editar-borrado') && Mrt._almacen.noAnotado().some(function (t) { return t.texto === FRASE; })
    && !Mrt._almacen.fila(OWNER, 'centros', C_BORRADO));

  console.log('— Un PATCH de cero filas, o un centro que ya no está —');
  const ctxCero = aparato();
  const Mcero = await preparar(ctxCero);
  let parches = 0;
  Mcero._nube.leer = async function () { return []; };
  Mcero._nube.peticion = async function (metodo, ruta) {
    if (metodo === 'POST' && ruta === 'rechazos') return { ok: true, status: 201, datos: null };
    if (metodo === 'PATCH') { parches++; return { ok: true, status: 200, datos: [] }; }
    return { ok: true, status: 200, datos: [] };
  };
  Mcero._almacen.guardarFila(OWNER, 'centros', centro(C_BORRADO, { nombre: 'Centro Ficticio Borrado', version: 3 }));
  Mcero._almacen.guardarFila(OWNER, 'aulas', {
    id: A_BORRADO, centro_id: C_BORRADO, grado: 6, seccion: '2', version: 1, deleted_at: null,
  });
  Mcero._cola.encolar({
    tipo: 'editar', tabla: 'centros', id: C_BORRADO, base_version: 3,
    cambios: { nombre: 'Nombre que no debe volver' },
  });
  await Mcero._cola.esperar();
  ok('cero filas: una sola petición, el centro no vuelve y sale la tarjeta',
    parches === 1 && !Mcero._almacen.fila(OWNER, 'centros', C_BORRADO)
    && !Mcero._almacen.fila(OWNER, 'aulas', A_BORRADO)
    && Mcero._almacen.noAnotado().some(function (t) { return t.texto === FRASE; }));

  const ctxVer = aparato();
  const Mver = await preparar(ctxVer);
  let parchesVer = 0;
  const viva = centro(C_VIVO, { nombre: 'Centro Ficticio Las Flores', version: 4 });
  Mver._nube.leer = async function (q) {
    if (q.indexOf('id=eq.') >= 0) return [viva];
    return [];
  };
  Mver._nube.peticion = async function (metodo, ruta) {
    if (metodo === 'POST' && ruta === 'rechazos') return { ok: true, status: 201, datos: null };
    if (metodo === 'PATCH') {
      parchesVer++;
      if (parchesVer === 1) return { ok: true, status: 200, datos: [] };
      return { ok: true, status: 200, datos: [Object.assign({}, viva, { version: 5, direccion: 'Colonia Ficticia' })] };
    }
    return { ok: true, status: 200, datos: [] };
  };
  Mver._almacen.guardarFila(OWNER, 'centros', viva);
  Mver._cola.encolar({
    tipo: 'editar', tabla: 'centros', id: C_VIVO, base_version: 2,
    base: { direccion: null }, cambios: { direccion: 'Colonia Ficticia' },
  });
  await Mver._cola.esperar();
  ok('cero filas con la fila todavía viva no es un borrado: se vuelve a mandar',
    parchesVer === 2 && !!Mver._almacen.fila(OWNER, 'centros', C_VIVO)
    && Mver._almacen.noAnotado().length === 0);

  const ctxFk = aparato();
  const Mfk = await preparar(ctxFk);
  const aulaNueva = '20000000-0000-4000-8000-000000000099';
  Mfk._nube.leer = async function () { return []; };
  Mfk._nube.peticion = async function (metodo, ruta) {
    if (metodo === 'POST' && ruta === 'rechazos') return { ok: true, status: 201, datos: null };
    if (metodo === 'POST' && ruta === 'aulas') {
      return {
        ok: false, status: 409,
        datos: {
          code: '23503',
          message: 'insert or update on table "aulas" violates foreign key constraint "aulas_centro_id_fkey"',
          details: 'Key (centro_id)=(' + C_BORRADO + ') is not present in table "centros".',
        },
      };
    }
    return { ok: true, status: 200, datos: [] };
  };
  Mfk._almacen.guardarFila(OWNER, 'aulas', {
    id: aulaNueva, centro_id: C_BORRADO, grado: 6, seccion: '1', escuela: 'Centro Ficticio Borrado',
    version: 0, deleted_at: null,
  });
  Mfk._cola.encolar({
    tipo: 'crear', tabla: 'aulas', id: aulaNueva,
    cambios: { centro_id: C_BORRADO, grado: 6, seccion: '1', escuela: 'Centro Ficticio Borrado', anio_lectivo: 2026 },
  });
  await Mfk._cola.esperar();
  ok('crear un grupo en un centro que ya no está no lo revive',
    !Mfk._almacen.fila(OWNER, 'aulas', aulaNueva)
    && !Mfk._almacen.cola().some(function (o) { return o.id === aulaNueva; })
    && Mfk._almacen.noAnotado().some(function (t) { return t.texto === FRASE; }));

  console.log('— La lista de lectura se reemplaza cuando la base contestó —');
  const memLista = {};
  const caja = {
    console: console, setTimeout: setTimeout, clearTimeout: clearTimeout,
  };
  caja.localStorage = {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(memLista, k) ? memLista[k] : null; },
    setItem: function (k, v) { memLista[k] = String(v); },
    removeItem: function (k) { delete memLista[k]; },
  };
  caja.window = caja;
  vm.createContext(caja);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/metas-centro.js'), 'utf8'), caja, { filename: 'js/metas-centro.js' });
  const perfilBorrado = {
    id: C_BORRADO, nombre: 'Centro Ficticio Borrado', direccion: '', aldea: '', municipio: '',
    departamento: '', docente: '', logo: '', logoSec: '', grado: '6', seccion: '2', gradoSeccion: '6º-2', anio: '2026',
  };
  caja.localStorage.setItem('METAS_CENTRO_LECTURA', JSON.stringify({
    actual: A_BORRADO,
    porAula: { [A_BORRADO]: perfilBorrado, [A_VIVO]: Object.assign({}, perfilBorrado, { id: C_VIVO, nombre: 'Centro Ficticio Las Flores' }) },
    centros: [
      { id: C_VIVO, nombre: 'Centro Ficticio Las Flores', logo: '', direccion: '', aldea: '', municipio: '', departamento: '', docente: '' },
      { id: C_BORRADO, nombre: 'Centro Ficticio Borrado', logo: '', direccion: '', aldea: '', municipio: '', departamento: '', docente: '' },
    ],
  }));
  const filas = {
    centros: [
      { id: C_VIVO, nombre: 'Centro Ficticio Las Flores', anio_lectivo: 2026, created_at: '2026-01-01T00:00:00Z' },
    ],
    aulas: [
      { id: A_VIVO, centro_id: C_VIVO, grado: 6, seccion: '1', escuela: 'Centro Ficticio Las Flores' },
      { id: A_BORRADO, centro_id: C_BORRADO, grado: 6, seccion: '2', escuela: 'Centro Ficticio Borrado' },
    ],
  };
  caja.MetasCentro.refrescar({
    lista: function (t) { return (filas[t] || []).map(function (x) { return Object.assign({}, x); }); },
    archivados: function () { return []; },
  }, A_VIVO);
  const copia = JSON.parse(caja.localStorage.getItem('METAS_CENTRO_LECTURA'));
  ok('la lista queda solo con lo que contestó la base', copia.centros.length === 1 && copia.centros[0].id === C_VIVO, copia.centros);
  ok('el perfil del centro borrado no se suma al grupo que ya no es suyo', copia.porAula[A_BORRADO] == null);
  ok('el comentario viejo de que un centro no se borra ya no está',
    fs.readFileSync(path.join(RAIZ, 'js/metas-centro.js'), 'utf8').indexOf('Un centro no se borra (la base no deja)') < 0);

  console.log(fallos ? '\n✘ ' + fallos + ' comprobaciones fallaron' : '\n✅ la copia local no revive un centro borrado');
  process.exit(fallos ? 1 : 0);
})().catch(function (e) {
  console.error('✘ La prueba tropezó:', e && e.stack || e);
  process.exit(1);
});
