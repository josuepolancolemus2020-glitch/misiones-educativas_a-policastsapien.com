// ============================================================================
// Capa B · arnés: varios aparatos con su propio almacén contra Supabase local
// ----------------------------------------------------------------------------
// Cada «aparato» es un contexto aislado (vm) que carga los scripts de
// js/datos/ tal como los cargará el navegador, con:
//   · su IndexedDB (fake-indexeddb, uno por aparato);
//   · una red que se puede cortar, demorar o que PIERDE LA RESPUESTA después
//     de que la base ya aplicó (el caso que hoy inventa pagos), de cualquier
//     petición o solo de una función (rev. 9: B4 pierde solo pago_crear);
//   · varias PESTAÑAS de un mismo aparato (rev. 9, B11): comparten
//     IndexedDB, localStorage, el canal entre pestañas (BroadcastChannel) y
//     los candados (navigator.locks, aquí uno de mentira con lo que usa
//     js/datos); cada una se puede cerrar;
//   · Math.random convertido en error (regla 16 de CLAUDE.md);
//   · WebSocket de verdad para Realtime.
// Los contadores de 06, 6.1 se miden en la base con psql (METAS_DB).
// ============================================================================
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const RAIZ = path.resolve(AQUI, '../../..');
// fake-indexeddb y supabase-js se instalan con --no-save en _dev/supabase-local
const requerir = createRequire(path.join(RAIZ, '_dev/supabase-local/requerir.js'));

export const API = process.env.METAS_API;
export const PUBLICA = process.env.METAS_PUBLICA;
export const DB = process.env.METAS_DB;

export const SCRIPTS = [
  'js/vendor/supabase.min.js', 'js/datos/ids.js', 'js/datos/montos.js', 'js/datos/nube.js',
  'js/datos/almacen.js', 'js/datos/cola.js', 'js/datos/tiempo-real.js', 'js/datos/senal.js',
  'js/datos/calculos.js', 'js/datos/datos.js',
];

export function faltantes() {
  return SCRIPTS.filter((s) => !fs.existsSync(path.join(RAIZ, s)));
}

// ── Red con fallas a pedido ────────────────────────────────────────────────
function redCon(estado, pestana) {
  return async (url, opciones) => {
    if (pestana && pestana.cerrada) throw new TypeError('Failed to fetch');
    if (estado.modo === 'sin_senal') throw new TypeError('Failed to fetch');
    if (estado.demora) await new Promise((r) => setTimeout(r, estado.demora));
    const r = await fetch(url, opciones);
    // La base ya aplicó; el aparato no se entera (se cae la señal de vuelta).
    if (estado.perderSiguientes > 0 && String(url).includes(estado.perderSolo || '/rest/v1/')) {
      estado.perderSiguientes--;
      await r.arrayBuffer();
      throw new TypeError('Failed to fetch');
    }
    return r;
  };
}

// Candados de mentira, compartidos por las pestañas de un aparato: solo lo
// que usa js/datos (request con o sin ifAvailable; se sueltan al cerrar).
function candados() {
  const tenidos = new Map();
  const fila = new Map();
  function dar(nombre, quien, cb) {
    let soltar;
    const fin = new Promise((r) => { soltar = r; });
    tenidos.set(nombre, { quien, soltar });
    Promise.resolve().then(() => cb({ name: nombre })).then(() => soltar(), () => soltar());
    fin.then(() => {
      if (tenidos.get(nombre)?.quien !== quien) return;
      tenidos.delete(nombre);
      const siguiente = (fila.get(nombre) || []).shift();
      if (siguiente) dar(nombre, siguiente.quien, siguiente.cb);
    });
  }
  return {
    para(quien) {
      return {
        request(nombre, opciones, cb) {
          if (typeof opciones === 'function') { cb = opciones; opciones = {}; }
          if (!tenidos.has(nombre)) { dar(nombre, quien, cb); return Promise.resolve(); }
          if (opciones && opciones.ifAvailable) return Promise.resolve(cb(null));
          (fila.get(nombre) || fila.set(nombre, []).get(nombre)).push({ quien, cb });
          return Promise.resolve();
        },
      };
    },
    soltar(quien) {
      for (const [nombre, l] of fila) fila.set(nombre, l.filter((x) => x.quien !== quien));
      for (const [nombre, t] of tenidos) if (t.quien === quien) t.soltar();
    },
  };
}

// ── Un aparato (una pestaña) ───────────────────────────────────────────
// compartido: lo que comparten las pestañas de un mismo aparato.
async function pestana(nombre, compartido) {
  const red = compartido.red;
  const oyentes = {};
  const yo = { cerrada: false, canales: [] };
  const Canal = class extends BroadcastChannel {
    constructor(n) { super(n); yo.canales.push(this); }
    postMessage(m) { if (!yo.cerrada) super.postMessage(m); }
  };
  const ventana = {
    console, setTimeout, clearTimeout, setInterval, clearInterval, queueMicrotask,
    URL, URLSearchParams, TextEncoder, TextDecoder, Headers, Request, Response, AbortController,
    structuredClone, WebSocket, atob, btoa, Blob,
    crypto: globalThis.crypto,
    indexedDB: compartido.idb, IDBKeyRange: compartido.IDBKeyRange,
    BroadcastChannel: Canal,
    fetch: redCon(red, yo),
    location: { hostname: '127.0.0.1', href: 'http://127.0.0.1:8080/', origin: 'http://127.0.0.1:8080' },
    navigator: { onLine: red.modo !== 'sin_senal', userAgent: 'capa-b/' + nombre, locks: compartido.candados.para(yo) },
    localStorage: {
      getItem: (k) => (compartido.almacenLocal.has(k) ? compartido.almacenLocal.get(k) : null),
      setItem: (k, v) => compartido.almacenLocal.set(k, String(v)),
      removeItem: (k) => compartido.almacenLocal.delete(k),
    },
    addEventListener: (t, f) => ((oyentes[t] = oyentes[t] || []).push(f)),
    removeEventListener: (t, f) => (oyentes[t] = (oyentes[t] || []).filter((x) => x !== f)),
    dispatchEvent: (e) => { if (!yo.cerrada) (oyentes[e.type] || []).forEach((f) => f(e)); },
    __METAS_NUBE_DE_PRUEBA__: { url: API, llavePublica: PUBLICA },
  };
  ventana.window = ventana;
  ventana.self = ventana;
  ventana.globalThis = ventana;
  ventana.document = { addEventListener: ventana.addEventListener, visibilityState: 'visible' };
  const ctx = vm.createContext(ventana);
  // Regla 16: ningún id ni nada de la capa de datos sale de Math.random.
  vm.runInContext("Math.random = function () { throw new Error('Math.random prohibido en js/datos (regla 16)'); };", ctx);
  for (const s of SCRIPTS) vm.runInContext(fs.readFileSync(path.join(RAIZ, s), 'utf8'), ctx, { filename: s });
  const d = await ventana.MetasDatos.iniciar();
  compartido.pestanas.push({ ventana });

  return {
    nombre, d, MetasDatos: ventana.MetasDatos,
    sinSenal() { compartido.cambiarSenal('sin_senal'); },
    conSenal() { compartido.cambiarSenal('normal'); },
    perderRespuestas(n, solo) { red.perderSiguientes = n; red.perderSolo = solo || null; },
    demorar(ms) { red.demora = ms; },
    // Cerrar la pestaña: deja de tener red, suelta sus candados y su canal.
    cerrar() {
      yo.cerrada = true;
      compartido.candados.soltar(yo);
      yo.canales.forEach((c) => { try { c.close(); } catch (e) { /* ya estaba cerrado */ } });
      compartido.pestanas = compartido.pestanas.filter((p) => p.ventana !== ventana);
    },
  };
}

function dispositivoCompartido() {
  const { IDBFactory, IDBKeyRange } = requerir('fake-indexeddb');
  const c = {
    red: { modo: 'normal', demora: 0, perderSiguientes: 0, perderSolo: null },
    idb: new IDBFactory(), IDBKeyRange,
    almacenLocal: new Map(),
    candados: candados(),
    pestanas: [],
  };
  c.cambiarSenal = (modo) => {
    c.red.modo = modo;
    for (const p of c.pestanas) {
      p.ventana.navigator.onLine = modo !== 'sin_senal';
      p.ventana.dispatchEvent({ type: modo === 'sin_senal' ? 'offline' : 'online' });
    }
  };
  return c;
}

export async function aparato(nombre) {
  return pestana(nombre, dispositivoCompartido());
}

// Un aparato con varias pestañas: abrir() abre una más, que comparte todo
// con las otras.
export function dispositivo(nombre) {
  const c = dispositivoCompartido();
  let n = 0;
  return { abrir: () => pestana(nombre + '-' + (++n), c) };
}

// ── La base, mirada desde afuera (como postgres, solo lectura) ────────────
export function sql(consulta) {
  const salida = execFileSync('psql', [DB, '-X', '-A', '-t', '-q', '-v', 'ON_ERROR_STOP=1', '-c', consulta], { encoding: 'utf8' });
  return salida.trim();
}
export function sqlJson(consulta) {
  const t = sql(`select coalesce(json_agg(x), '[]') from (${consulta}) x`);
  return JSON.parse(t || '[]');
}

// Los cuatro contadores de 06, 6.1, para las filas creadas desde «desde»
// (hora del servidor al empezar el escenario).
export function contadores(desde, opsDelEscenario) {
  const ops = opsDelEscenario.length ? `array[${opsDelEscenario.map((o) => `'${o}'::uuid`).join(',')}]` : `'{}'::uuid[]`;
  const t = `'${desde}'::timestamptz`;
  return sqlJson(`
    select
      (select count(*) from metas.auditoria a
        where a.accion = 'crear' and a.ocurrido_at >= ${t} and a.tabla in ('pagos','gastos','notas','asistencia')
          and not (coalesce(a.op_id, (a.despues->>'op_creacion')::uuid) = any (${ops})))          as inventados,
      (select count(*) from metas.auditoria a
        where a.ocurrido_at >= ${t} and (a.antes->>'deleted_at') is not null
          and (a.despues->>'deleted_at') is null)                                                   as revividos,
      (select count(*) from (select alumno_id, asignatura_id, periodo, componente from metas.notas
                              where deleted_at is null and created_at >= ${t}
                              group by 1,2,3,4 having count(*) > 1) x)
      + (select count(*) from (select alumno_id, fecha from metas.asistencia
                              where deleted_at is null and created_at >= ${t}
                              group by 1,2 having count(*) > 1) x)                                  as duplicados
  `)[0];
}

export function horaServidor() {
  return sql('select now()');
}

// ── Pruebas ────────────────────────────────────────────────────────────────
let total = 0;
let fallas = 0;
export async function escenario(nombre, fn) {
  total++;
  try {
    await fn();
    console.log('  ✔', nombre);
  } catch (e) {
    fallas++;
    console.log('  ✘', nombre, '\n      ', e && e.stack ? e.stack.split('\n').slice(0, 3).join('\n       ') : e);
  }
}
export function afirma(cond, msg) {
  if (!cond) throw new Error(msg || 'no se cumplió');
}
export function resultado() {
  console.log(fallas ? `\n✘ ${fallas} de ${total} escenarios de la capa B FALLARON` : `\n✅ Los ${total} escenarios de la capa B en verde`);
  return fallas ? 1 : 0;
}

// Ningún dinero como número en lo que ve la pantalla.
export const COLUMNAS_DINERO = ['monto', 'monto_sugerido', 'monto_aplicable', 'aplicable', 'pagado', 'falta',
  'pago_de_mas', 'meta', 'recaudado', 'falta_total', 'pago_de_mas_total', 'gastado', 'saldo', 'reembolsado', 'por_cobrar'];
export function dineroComoTexto(filas) {
  for (const f of filas) {
    for (const k of COLUMNAS_DINERO) {
      if (k in f && f[k] !== null && typeof f[k] !== 'string') return `${k} = ${JSON.stringify(f[k])} (${typeof f[k]})`;
      if (k in f && f[k] !== null && !/^-?[0-9]+\.[0-9]{2}$/.test(f[k])) return `${k} = «${f[k]}» sin dos decimales`;
    }
  }
  return null;
}
