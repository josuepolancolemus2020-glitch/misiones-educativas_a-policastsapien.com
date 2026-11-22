/* ============================================================
   M.E.T.A.S · Cuando la nube no guarda algo, se dice y no se insiste
   ------------------------------------------------------------
   La base no guarda en docente_estado un valor de más de 3 MB
   (SUPABASE-TOPES-Y-PAGINAS.sql), y metas.blob_guardar rechaza el
   LOTE entero con «valor_demasiado_grande». Antes, el espejo
   (js/metas-blob-sesion.js) se tragaba el error y volvía a mandar
   los mismos megas cada 10 segundos, para siempre, sin decirle
   nada al docente.

   Esta sonda carga el espejo de verdad en una caja (vm), con una
   base de mentira, y comprueba:
   1. Lo que no cabe ni se manda, y se avisa UNA vez, con palabras.
   2. Diez vueltas después, no se volvió a mandar ni a avisar.
   3. Si la base rechaza un lote, se prueba cada llave sola UNA vez:
      las que caben se guardan, la que no se aparta.
   4. Cuando vuelve a caber, sube y la marca se quita.

   Solo lee archivos: no abre navegador ni toca la red.
   Uso:  node _dev/verifica-tope-espejo.js
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const RAIZ = path.resolve(__dirname, '..');
let fallos = 0;
const ok = (nombre, cond, extra) => {
  console.log((cond ? '  ✔ ' : '  ✘ ') + nombre + (cond || extra === undefined ? '' : ' → ' + JSON.stringify(extra).slice(0, 300)));
  if (!cond) fallos++;
};

function caja() {
  const almacen = {};
  const localStorage = {
    getItem: k => (k in almacen ? almacen[k] : null),
    setItem: (k, v) => { almacen[k] = String(v); },
    removeItem: k => { delete almacen[k]; },
  };
  const llamadas = [];      // cada blob_guardar: las llaves y su peso
  const avisos = [];
  const base = {};          // lo que la base de mentira guardó
  let rechazar = () => false;   // (entrada) → true si la base la rechaza por tope
  const nube = {
    uid: () => 'uid-1',
    aparato: () => 'AP-1',
    rpc: async (fn, args) => {
      if (fn === 'blob_leer') return [];
      if (fn !== 'blob_guardar') return null;
      llamadas.push(args.p_entradas.map(e => ({ k: e.k, peso: JSON.stringify(e.valor).length })));
      if (args.p_entradas.some(e => rechazar(e))) {
        const err = new Error('base: valor_demasiado_grande');
        err.tipo = 'base'; err.status = 400; err.codigo = 'P0001'; err.mensaje = 'valor_demasiado_grande';
        throw err;
      }
      args.p_entradas.forEach(e => { base[e.k] = e.valor.raw; });
      return args.p_entradas.length;
    },
  };
  const w = {
    localStorage, TextEncoder, console: { warn() {} },
    MetasDatos: { _nube: nube },
    metasAlert: (m) => { avisos.push(String(m)); return Promise.resolve(); },
    addEventListener() {},
  };
  const ctx = vm.createContext({
    window: w, document: { addEventListener() {}, querySelector: () => null, visibilityState: 'visible' },
    setTimeout: () => 0, clearTimeout() {}, setInterval: () => 0, JSON, Math, Date, Number, String, Object, Array,
    Promise, unescape, encodeURIComponent, console,
  });
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'js/metas-blob-sesion.js'), 'utf8'), ctx);
  return { w, almacen, llamadas, avisos, base, alRechazar: f => { rechazar = f; } };
}

(async () => {
  console.log('\n════════ LA NUBE NO LO GUARDA: SE DICE Y NO SE INSISTE ════════\n');
  const c = caja();
  const B = c.w.MetasBlob;
  const GRANDE = 'x'.repeat(3200000);

  console.log('1) Lo que pasa de 3 MB ni se manda');
  c.almacen.METAS_PLANACCION_V1 = GRANDE;
  c.almacen.meta_ge_v2 = '{"g":1}';
  await B.alEntrar('PROF-X');
  const mandadas = c.llamadas.flat();
  ok('el plan de 3,2 MB no viajó', !mandadas.some(e => e.k === 'METAS_PLANACCION_V1'), mandadas);
  ok('lo demás sí (gobierno escolar)', c.base.meta_ge_v2 === '{"g":1}');
  ok('se avisó una vez, con palabras y sin tecnicismos',
    c.avisos.length === 1 && /plan de acción ya pesa demasiado para guardarse en la nube/.test(c.avisos[0])
    && /está a salvo/.test(c.avisos[0]) && !/MB|tope|error/i.test(c.avisos[0]), c.avisos);

  console.log('\n2) Diez vueltas después: ni se manda ni se avisa otra vez');
  const antes = c.llamadas.length;
  for (let i = 0; i < 10; i++) await B.ahora();
  ok('ninguna llamada nueva a la base', c.llamadas.length === antes, c.llamadas.length - antes);
  c.almacen.METAS_PLANACCION_V1 = GRANDE + 'y';      // el docente sigue trabajando y sigue sin caber
  await B.ahora();
  ok('un cambio que sigue sin caber tampoco viaja ni abre otro aviso',
    c.llamadas.length === antes && c.avisos.length === 1, { llamadas: c.llamadas.length - antes, avisos: c.avisos.length });

  console.log('\n3) Si la base rechaza un lote, cada llave se prueba sola UNA vez');
  c.alRechazar(e => e.k === 'METAS_CAMP_V1');        // la base mide distinto: esta no le cabe
  c.almacen.METAS_CAMP_V1 = '{"camp":"mucho"}';
  c.almacen.meta_ge_v2 = '{"g":2}';
  const antes3 = c.llamadas.length;
  await B.ahora();
  const nuevas = c.llamadas.length - antes3;
  ok('un lote, y después una prueba por llave (3 llamadas)', nuevas === 3, nuevas);
  ok('la que cabe quedó guardada', c.base.meta_ge_v2 === '{"g":2}');
  ok('la que no, avisada una vez', c.avisos.length === 2 && /Campeonísimo/.test(c.avisos[1]), c.avisos);
  const antes3b = c.llamadas.length;
  for (let i = 0; i < 10; i++) await B.ahora();
  ok('y no se vuelve a mandar', c.llamadas.length === antes3b, c.llamadas.length - antes3b);

  console.log('\n4) Cuando vuelve a caber, sube');
  c.alRechazar(() => false);
  c.almacen.METAS_PLANACCION_V1 = '{"analisis":[]}';
  await B.ahora();
  ok('el plan aligerado llegó a la base', c.base.METAS_PLANACCION_V1 === '{"analisis":[]}');
  const meta = JSON.parse(c.almacen.METAS_BLOB_V1 || '{}');
  ok('y su marca de tope se quitó', !(meta.tope && meta.tope.METAS_PLANACCION_V1), meta.tope);

  console.log('\n' + (fallos ? '✘ ' + fallos + ' fallo(s)' : '✔ Todo en verde') + '\n');
  process.exit(fallos ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
