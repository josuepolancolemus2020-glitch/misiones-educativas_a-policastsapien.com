/* =====================================================================
   M.E.T.A.S — js/datos/almacen.js · lo que el aparato guarda
   ---------------------------------------------------------------------
   IndexedDB, base «metas-datos-v2» (03, 3.7):
     filas      copia de LECTURA de lo que dice la base, por cuenta. Nunca
                se sube ni se compara: con señal se reemplaza.
     cola       las operaciones que todavía no llegaron a la base, en orden
     preguntas  las operaciones que esperan que el docente responda
     no_anotado las tarjetas «no quedó anotado» que el docente no ha visto
     meta       cursores de «ponerse al día», por cuenta y tabla

   Todo se tiene además en memoria: la pantalla pregunta muchas veces por
   segundo y la respuesta tiene que ser al instante, también sin señal. La
   memoria es la que manda mientras la app está abierta; IndexedDB es para
   volver a abrirla. Si IndexedDB no existe (modo privado de algunos
   navegadores), todo sigue funcionando en memoria.
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};

  var NOMBRE = 'metas-datos-v2';
  var ALMACENES = { filas: 'k', cola: 'seq', preguntas: 'id', no_anotado: 'id', meta: 'k' };

  var db = null;
  var filas = new Map();       // owner → Map(tabla → Map(id → fila))
  var cola = [];               // ordenada por seq
  var preguntas = [];
  var noAnotado = [];
  var meta = new Map();
  var ultimoSeq = 0;
  // Las escrituras van en fila india: así lo último que se anotó es lo que
  // queda, aunque dos cambios lleguen en el mismo instante.
  var escrituras = Promise.resolve();

  function pedir(r) {
    return new Promise(function (ok, mal) {
      r.onsuccess = function () { ok(r.result); };
      r.onerror = function () { mal(r.error); };
    });
  }

  function abrir() {
    return new Promise(function (ok) {
      if (!w.indexedDB) return ok(null);
      var r;
      try { r = w.indexedDB.open(NOMBRE, 1); } catch (e) { return ok(null); }
      r.onupgradeneeded = function () {
        var d = r.result;
        Object.keys(ALMACENES).forEach(function (n) {
          if (!d.objectStoreNames.contains(n)) d.createObjectStore(n, { keyPath: ALMACENES[n] });
        });
      };
      r.onsuccess = function () { ok(r.result); };
      r.onerror = function () { ok(null); };
      r.onblocked = function () { ok(null); };
    });
  }

  function escribir(almacen, accion) {
    if (!db) return;
    escrituras = escrituras.then(function () {
      return new Promise(function (ok) {
        try {
          var tx = db.transaction(almacen, 'readwrite');
          accion(tx.objectStore(almacen));
          tx.oncomplete = ok;
          tx.onerror = ok;
          tx.onabort = ok;
        } catch (e) {
          ok();
        }
      });
    });
  }

  async function todo(almacen) {
    if (!db) return [];
    try {
      return await pedir(db.transaction(almacen, 'readonly').objectStore(almacen).getAll());
    } catch (e) {
      return [];
    }
  }

  async function cargar() {
    db = await abrir();
    (await todo('filas')).forEach(function (x) { ponerEnMemoria(x.owner, x.tabla, x.fila); });
    cola = (await todo('cola')).sort(function (a, b) { return a.seq - b.seq; });
    preguntas = await todo('preguntas');
    noAnotado = await todo('no_anotado');
    (await todo('meta')).forEach(function (x) { meta.set(x.k, x.v); });
    cola.concat(preguntas.map(function (p) { return p.op; })).forEach(function (o) {
      if (o && o.seq > ultimoSeq) ultimoSeq = o.seq;
    });
  }

  // ── Copia de lectura ───────────────────────────────────────────────────
  function tablaDe(owner, tabla) {
    var porCuenta = filas.get(owner);
    if (!porCuenta) filas.set(owner, porCuenta = new Map());
    var t = porCuenta.get(tabla);
    if (!t) porCuenta.set(tabla, t = new Map());
    return t;
  }

  function ponerEnMemoria(owner, tabla, fila) {
    tablaDe(owner, tabla).set(fila.id, fila);
  }

  function fila(owner, tabla, id) {
    var porCuenta = filas.get(owner);
    var t = porCuenta && porCuenta.get(tabla);
    return (t && t.get(id)) || null;
  }

  // Guarda lo que dijo la base. Una versión vieja (un aviso de Realtime que
  // llegó tarde) no pisa a una más nueva; una fila borrada se queda como
  // borrada, para que nada la vuelva a mostrar.
  function guardarFila(owner, tabla, nueva) {
    if (!nueva || !nueva.id) return false;
    var vieja = fila(owner, tabla, nueva.id);
    if (vieja && vieja.deleted_at && !nueva.deleted_at) return false;
    if (vieja && typeof vieja.version === 'number' && typeof nueva.version === 'number'
        && nueva.version < vieja.version) return false;
    ponerEnMemoria(owner, tabla, nueva);
    escribir('filas', function (s) {
      s.put({ k: owner + '|' + tabla + '|' + nueva.id, owner: owner, tabla: tabla, fila: nueva });
    });
    return true;
  }

  function filasDe(owner, tabla) {
    var porCuenta = filas.get(owner);
    var t = porCuenta && porCuenta.get(tabla);
    return t ? Array.from(t.values()) : [];
  }

  // Al cerrar sesión con todo enviado, la copia de esa cuenta se borra del
  // aparato (02, 2.6): el próximo que entre no ve datos de otro docente.
  function olvidarCuenta(owner) {
    var porCuenta = filas.get(owner);
    if (!porCuenta) return;
    var llaves = [];
    porCuenta.forEach(function (t, tabla) {
      t.forEach(function (f, id) { llaves.push(owner + '|' + tabla + '|' + id); });
    });
    filas.delete(owner);
    escribir('filas', function (s) { llaves.forEach(function (k) { s.delete(k); }); });
    Array.from(meta.keys()).forEach(function (k) {
      if (k.indexOf('cursor|' + owner + '|') === 0) quitarMeta(k);
    });
  }

  // ── Cola ───────────────────────────────────────────────────────────────
  function encolar(op) {
    if (!op.seq) op.seq = ++ultimoSeq;
    else if (op.seq > ultimoSeq) ultimoSeq = op.seq;
    cola.push(op);
    cola.sort(function (a, b) { return a.seq - b.seq; });
    escribir('cola', function (s) { s.put(op); });
    return op;
  }

  function actualizarOp(op) {
    escribir('cola', function (s) { s.put(op); });
  }

  function sacarDeCola(op) {
    var i = cola.indexOf(op);
    if (i >= 0) cola.splice(i, 1);
    escribir('cola', function (s) { s.delete(op.seq); });
  }

  // ── Preguntas y tarjetas ───────────────────────────────────────────────
  function ponerPregunta(p) {
    preguntas = preguntas.filter(function (x) { return x.id !== p.id; });
    preguntas.push(p);
    escribir('preguntas', function (s) { s.put(p); });
  }

  function quitarPregunta(id) {
    preguntas = preguntas.filter(function (x) { return x.id !== id; });
    escribir('preguntas', function (s) { s.delete(id); });
  }

  function ponerNoAnotado(t) {
    noAnotado.push(t);
    escribir('no_anotado', function (s) { s.put(t); });
  }

  function quitarNoAnotado(id) {
    noAnotado = noAnotado.filter(function (x) { return x.id !== id; });
    escribir('no_anotado', function (s) { s.delete(id); });
  }

  // ── Meta ───────────────────────────────────────────────────────────────
  function ponerMeta(k, v) {
    meta.set(k, v);
    escribir('meta', function (s) { s.put({ k: k, v: v }); });
  }
  function quitarMeta(k) {
    meta.delete(k);
    escribir('meta', function (s) { s.delete(k); });
  }

  M._almacen = {
    cargar: cargar,
    fila: fila,
    filasDe: filasDe,
    guardarFila: guardarFila,
    olvidarCuenta: olvidarCuenta,
    cola: function () { return cola; },
    encolar: encolar,
    actualizarOp: actualizarOp,
    sacarDeCola: sacarDeCola,
    preguntas: function () { return preguntas; },
    ponerPregunta: ponerPregunta,
    quitarPregunta: quitarPregunta,
    noAnotado: function () { return noAnotado; },
    ponerNoAnotado: ponerNoAnotado,
    quitarNoAnotado: quitarNoAnotado,
    meta: function (k) { return meta.get(k); },
    ponerMeta: ponerMeta,
    escrito: function () { return escrituras; },
  };
})(window);
