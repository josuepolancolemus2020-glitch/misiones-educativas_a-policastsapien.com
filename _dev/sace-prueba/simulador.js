/* ══════════════════════════════════════════════════════════════
   M.E.T.A.S · Un equipo del maestro, sin navegador
   ──────────────────────────────────────────────────────────────
   Carga en Node, con `vm`, los cuatro archivos que guardan y sincronizan
   Mi aula (fusión, espejo de la nube, lista del SACE y Mi aula) sobre un
   localStorage de mentira CON TOPE de espacio y una nube de mentira que
   hace EXACTAMENTE lo que hace el SQL de producción
   (_privado/SUPABASE-DOCENTE-ESTADO.sql, metas_docente_estado_guardar):
   solo escribe si la versión que llega es >= la que tiene, y cuenta la
   fila aunque no la escriba. La nube de la sonda vieja aceptaba todo, y
   por eso nunca vio que la PC no podía guardar con un teléfono de reloj
   adelantado.

   No es una sonda: lo usan verifica-sace-recarga y verifica-borrar-recarga.
   «Recargar la página» es abrir otro equipo() con el MISMO almacén.
   ══════════════════════════════════════════════════════════════ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..', '..');
const ARCHIVOS = ['js/metas-fusion-aula.js', 'js/metas-docente-sync.js', 'js/tools/sace-lista.js', 'js/tools/registros-admin.js'];
const COD = 'PROF-PRUEBA', CLAVE = 'clave';

function almacen(tope) {
  const m = new Map();
  const usado = () => { let n = 0; m.forEach((v, k) => { n += k.length + v.length; }); return n; };
  return {
    _m: m, usado,
    get length() { return m.size; },
    key(i) { return [...m.keys()][i] || null; },
    getItem(k) { return m.has(k) ? m.get(k) : null; },
    setItem(k, v) {
      v = String(v);
      const antes = m.has(k) ? k.length + m.get(k).length : 0;
      if (tope && usado() - antes + k.length + v.length > tope) {
        const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e;
      }
      m.set(k, v);
    },
    removeItem(k) { m.delete(k); },
    clear() { m.clear(); }
  };
}

/* La nube: { datos: { k: { raw, version } } } con la regla del SQL. */
function nube(inicial) {
  const n = { datos: Object.assign({}, inicial || {}), rechazadas: 0 };
  n.fetch = async (url, op) => {
    const fn = String(url).split('/rpc/')[1];
    const c = JSON.parse((op && op.body) || '{}');
    const res = b => ({ ok: true, status: 200, json: async () => b });
    if (fn === 'metas_docente_estado_leer') {
      return res(Object.keys(n.datos).map(k => ({ k, valor: { raw: n.datos[k].raw }, version: n.datos[k].version })));
    }
    if (fn === 'metas_docente_estado_guardar') {
      let cuenta = 0;
      (c.p_entradas || []).forEach(e => {
        const ya = n.datos[e.k];
        if (c.p_forzar || !ya || e.version >= ya.version) n.datos[e.k] = { raw: e.valor.raw, version: e.version };
        else n.rechazadas++;
        cuenta++;                                 // el SQL cuenta aunque no escriba
      });
      return res(cuenta);
    }
    if (fn === 'metas_docente_papelera') return res({ hay: false });
    return res(null);
  };
  return n;
}

/* Abre la aplicación en un equipo: mismo almacén = misma «pestaña recargada». */
function equipo(ls, cloud, reloj) {
  const avisos = [], oyentes = {}, intervalos = [], pendientes = [];
  const doc = {
    addEventListener(ev, fn) { (oyentes[ev] = oyentes[ev] || []).push(fn); }, getElementById() { return null; }, querySelector() { return null; },
    querySelectorAll() { return []; }, createElement() { return { style: {}, appendChild() {}, setAttribute() {} }; },
    body: { appendChild() {}, classList: { add() {}, remove() {} } }, documentElement: { style: {}, classList: { add() {}, remove() {} } },
    hidden: false
  };
  const RealDate = Date;
  const desfase = reloj || 0;
  class FDate extends RealDate {
    constructor(...a) { if (a.length) super(...a); else super(RealDate.now() + desfase); }
    static now() { return RealDate.now() + desfase; }
  }
  const ctx = {
    console, localStorage: ls, document: doc, navigator: { onLine: true, userAgent: 'node' },
    location: { href: 'http://localhost/', search: '', hash: '' },
    fetch: cloud.fetch, Date: FDate, JSON, Math, Promise, Set, Map, Object, Array, String, Number, Error,
    /* los relojes no corren solos: la sonda decide cuándo pasa el tiempo */
    setTimeout: (fn, ms) => { pendientes.push({ fn, ms: ms || 0 }); return pendientes.length; },
    clearTimeout(id) { if (pendientes[id - 1]) pendientes[id - 1].fn = null; },
    setInterval: (fn, ms) => { intervalos.push({ fn, ms }); return intervalos.length; }, clearInterval() {},
    toast: t => avisos.push(String(t)), metasAlert: async t => { avisos.push(String(t)); },
    metasConfirm: async () => true, addEventListener() {}, removeEventListener() {},
    matchMedia: () => ({ matches: false, addEventListener() {} })
  };
  ctx.window = ctx; ctx.self = ctx; ctx.globalThis = ctx;
  vm.createContext(ctx);
  ARCHIVOS.forEach(f => vm.runInContext(fs.readFileSync(path.join(RAIZ, f), 'utf8'), ctx, { filename: f }));
  ctx.__avisos = avisos;
  /* «abre la página»: corre lo que la app hace al cargar */
  ctx.__arrancar = () => (oyentes.DOMContentLoaded || []).forEach(fn => fn());
  /* deja pasar el tiempo: corre los relojes de 8 s (el vigía que sube lo
     pendiente) y luego los temporizadores que hayan quedado puestos */
  ctx.__esperar = async () => {
    intervalos.filter(x => x.ms === 8000).forEach(x => x.fn());
    for (let vuelta = 0; vuelta < 5; vuelta++) {
      const ahora = pendientes.splice(0).filter(x => x.fn && x.ms >= 1000);
      if (!ahora.length) break;
      for (const x of ahora) { await x.fn(); }
      await new Promise(r => setImmediate(r)); await new Promise(r => setImmediate(r));
      await new Promise(r => setTimeout(r, 5));
    }
  };
  /* lo que hace el botón «Guardar lo marcado», sin la pantalla */
  ctx.__importarSace = (csv, conf) => vm.runInContext(`(function (csv, conf) {
    const leido = SaceLista.parseCsv(csv);
    const plan = SaceLista.emparejar(adLoad().lista, leido.filas);
    adUndoGuardar('Importar lista del SACE');
    const dd = adLoad();
    const c = Object.assign({ pares: plan.pares.map((_, i) => i), campos: { fnac: true, sexo: true, idn: true },
      nuevos: [], fuera: plan.sinSace.slice(), estados: {}, fecha: '2026-11-11' }, conf || {});
    SaceLista.aplicar(dd, plan, c);
    return adSave(dd);
  })`, ctx)(csv, conf);
  return ctx;
}

/* Siembra el almacén de un equipo YA sincronizado con la nube. */
function sembrar(ls, raw, version, conBase) {
  const hash = s => { if (s == null) return '0'; let h = 5381, i = s.length; while (i) h = (h * 33) ^ s.charCodeAt(--i); return (h >>> 0).toString(36); };
  ls.setItem('METAS_DOCENTE_V1', JSON.stringify({ codigo: COD, clave: CLAVE, nombre: 'Prof. Prueba' }));
  ls.setItem('METAS_DS_OWNER', COD);
  ls.setItem('METAS_ADMIN_V1', raw);
  ls.setItem('METAS_DOCSYNC_V1', JSON.stringify({ METAS_ADMIN_V1: { v: version, h: hash(raw), sv: version } }));
  if (conBase !== false) ls.setItem('METAS_DOCSYNC_BASE_V1', JSON.stringify({ METAS_ADMIN_V1: raw }));
}

function aulaDePrueba(extraFichas) {
  const fix = JSON.parse(fs.readFileSync(path.join(__dirname, 'aula-prueba.json'), 'utf8'));
  const g = fix.grupo;
  (extraFichas || []).forEach(f => g.lista.push(f));
  return { fix, raw: JSON.stringify({ v: 2, activo: g.id, grupos: [g] }) };
}
const CSV = () => fs.readFileSync(path.join(__dirname, 'lista-sace-prueba.csv'), 'utf8');
const grupo = ls => JSON.parse(ls.getItem('METAS_ADMIN_V1')).grupos[0];

module.exports = { almacen, nube, equipo, sembrar, aulaDePrueba, CSV, grupo, COD };
