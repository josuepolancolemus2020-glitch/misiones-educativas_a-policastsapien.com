/* =====================================================================
   M.E.T.A.S — js/datos/almacen.js · lo que el aparato guarda
   ---------------------------------------------------------------------
   IndexedDB, base «metas-datos-v2» (03, 3.7):
     filas      copia de LECTURA de lo que dice la base, por cuenta. Nunca
                se sube ni se compara: con señal se reemplaza.
     cola       las operaciones que todavía no llegaron a la base, en orden
     entrantes  lo que anotaron las OTRAS pestañas, esperando entrar a la cola
     preguntas  las operaciones que esperan que el docente responda
     no_anotado las tarjetas «no quedó anotado» que el docente no ha visto
     meta       cursores de «ponerse al día», por cuenta y tabla

   Todo se tiene además en memoria: la pantalla pregunta muchas veces por
   segundo y la respuesta tiene que ser al instante, también sin señal. Si
   IndexedDB no existe (modo privado de algunos navegadores), todo sigue
   funcionando en memoria.

   UNA COLA POR APARATO, aunque haya varias pestañas abiertas (rev. 9,
   decisión de Josué). Antes, cada pestaña numeraba su propia cola y podía
   pisar en IndexedDB la operación de la otra con el mismo número: un pago
   perdido. Ahora:
     · una sola pestaña es la LÍDER (navigator.locks): solo ella escribe la
       cola, la copia, las preguntas y las tarjetas, y solo ella habla con
       la base (envía, renueva la sesión, escucha Realtime);
     · las demás anotan en «entrantes», con el op_id como llave (dos
       pestañas no pueden chocar ahí), y le avisan a la líder, que las pasa
       a la cola con su número;
     · la líder les cuenta a las demás cómo quedó todo (BroadcastChannel);
     · si la líder se cierra, otra toma el candado y sigue con lo guardado.
   El docente no ve nada de esto.
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};

  var NOMBRE = 'metas-datos-v2';
  var VERSION_BD = 2;                                       // 2: entrantes (rev. 9)
  var ALMACENES = { filas: 'k', cola: 'seq', entrantes: 'op_id', preguntas: 'id', no_anotado: 'id', meta: 'k' };
  var CANDADO = 'metas-datos-v2-lider';

  var db = null;
  var filas = new Map();       // owner → Map(tabla → Map(id → fila))
  var cola = [];               // ordenada por seq
  var preguntas = [];
  var noAnotado = [];
  var meta = new Map();
  var misEntrantes = [];       // lo que ESTA pestaña anotó y la líder todavía no tomó
  var ultimoSeq = 0;
  var lider = false;
  var canal = null;
  var oyentesMensaje = [];
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
      try { r = w.indexedDB.open(NOMBRE, VERSION_BD); } catch (e) { return ok(null); }
      r.onupgradeneeded = function () {
        var d = r.result;
        Object.keys(ALMACENES).forEach(function (n) {
          if (!d.objectStoreNames.contains(n)) d.createObjectStore(n, { keyPath: ALMACENES[n] });
        });
      };
      r.onsuccess = function () {
        var d = r.result;
        // Otra pestaña con una versión más nueva de la app pide cerrar: se
        // cierra, y esta sigue en memoria hasta que la recarguen.
        d.onversionchange = function () { try { d.close(); } catch (e) { /* ya estaba */ } db = null; };
        ok(d);
      };
      r.onerror = function () { ok(null); };
      r.onblocked = function () { ok(null); };
    });
  }

  // Solo la líder escribe; las demás, solo en «entrantes».
  function escribir(almacenes, accion, aunqueNoSeaLider) {
    if (!db || (!lider && !aunqueNoSeaLider)) return escrituras;
    escrituras = escrituras.then(function () {
      return new Promise(function (ok) {
        try {
          var tx = db.transaction(almacenes, 'readwrite');
          accion(tx);
          tx.oncomplete = ok;
          tx.onerror = ok;
          tx.onabort = ok;
        } catch (e) {
          ok();
        }
      });
    });
    return escrituras;
  }

  async function todo(almacen) {
    if (!db) return [];
    try {
      return await pedir(db.transaction(almacen, 'readonly').objectStore(almacen).getAll());
    } catch (e) {
      return [];
    }
  }

  async function leerTodo() {
    filas = new Map();
    (await todo('filas')).forEach(function (x) { ponerEnMemoria(x.owner, x.tabla, x.fila); });
    cola = (await todo('cola')).sort(function (a, b) { return a.seq - b.seq; });
    preguntas = await todo('preguntas');
    noAnotado = await todo('no_anotado');
    meta = new Map();
    (await todo('meta')).forEach(function (x) { meta.set(x.k, x.v); });
    cola.concat(preguntas.map(function (p) { return p.op; })).forEach(function (o) {
      if (o && o.seq > ultimoSeq) ultimoSeq = o.seq;
    });
  }

  async function cargar() {
    db = await abrir();
    await leerTodo();
    if (typeof w.BroadcastChannel === 'function') {
      try {
        canal = new w.BroadcastChannel(NOMBRE);
        canal.onmessage = function (e) {
          oyentesMensaje.forEach(function (f) { try { f(e.data || {}); } catch (x) { /* un oyente roto no frena a los demás */ } });
        };
      } catch (e) {
        canal = null;
      }
    }
  }

  // ── Quién es la líder ──────────────────────────────────────────────────
  // Resuelve en cuanto se sabe si ESTA pestaña es líder ahora. Si no, queda
  // en la fila del candado y alSerLider corre el día que la líder se cierre.
  // Sin navigator.locks (navegadores de antes de 2022) cada pestaña es su
  // propia líder, como antes de la revisión 9.
  function elegirLider(alSerLider) {
    var locks = w.navigator && w.navigator.locks;
    if (!locks || typeof locks.request !== 'function') {
      lider = true;
      return Promise.resolve(true);
    }
    var nunca = function () { return new Promise(function () {}); };
    return new Promise(function (ok) {
      locks.request(CANDADO, { ifAvailable: true }, function (candado) {
        if (candado) {
          lider = true;
          ok(true);
          return nunca();
        }
        ok(false);
        locks.request(CANDADO, function () {
          lider = true;
          Promise.resolve(alSerLider()).catch(function () {});
          return nunca();
        });
        return null;
      });
    });
  }

  // La que acaba de ser líder lee todo de nuevo: lo que había en memoria lo
  // contaba otra pestaña, y lo que vale es lo guardado.
  async function asumir() {
    await leerTodo();
    return absorberEntrantes();
  }

  // ── Mensajes entre pestañas ────────────────────────────────────────────
  function enviar(m) {
    if (!canal) return;
    try { canal.postMessage(m); } catch (e) { /* la pestaña se está cerrando */ }
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

  // Guarda lo que dijo la base. Una versión vieja (un aviso que llegó tarde)
  // no pisa a una más nueva; una fila borrada se queda como borrada, para
  // que nada la vuelva a mostrar. La líder la guarda y la reparte.
  function guardarFila(owner, tabla, nueva) {
    if (!nueva || !nueva.id) return false;
    var vieja = fila(owner, tabla, nueva.id);
    // Una lectura atrasada no resucita la fila: si no, un aviso viejo
    // volvería a mostrar un centro que ya se archivó. Una versión mayor
    // sí puede dejar deleted_at vacío: es recuperarlo a propósito.
    if (vieja && vieja.deleted_at && !nueva.deleted_at) {
      var mayor = typeof nueva.version === 'number' && typeof vieja.version === 'number' && nueva.version > vieja.version;
      if (!mayor) return false;
    }
    if (vieja && typeof vieja.version === 'number' && typeof nueva.version === 'number'
        && nueva.version < vieja.version) return false;
    ponerEnMemoria(owner, tabla, nueva);
    if (lider) {
      escribir('filas', function (tx) {
        tx.objectStore('filas').put({ k: owner + '|' + tabla + '|' + nueva.id, owner: owner, tabla: tabla, fila: nueva });
      });
      enviar({ t: 'fila', owner: owner, tabla: tabla, fila: nueva });
    }
    return true;
  }

  function filasDe(owner, tabla) {
    var porCuenta = filas.get(owner);
    var t = porCuenta && porCuenta.get(tabla);
    return t ? Array.from(t.values()) : [];
  }

  function nombresTablas(owner) {
    var porCuenta = filas.get(owner);
    return porCuenta ? Array.from(porCuenta.keys()) : [];
  }

  // Quita la copia local de una fila que la base ya borró de verdad.
  // No toca otras cuentas. La líder avisa a las demás pestañas.
  function quitarFila(owner, tabla, id) {
    var porCuenta = filas.get(owner);
    var t = porCuenta && porCuenta.get(tabla);
    if (t) t.delete(id);
    if (!lider) return;
    escribir('filas', function (tx) {
      tx.objectStore('filas').delete(owner + '|' + tabla + '|' + id);
    });
    enviar({ t: 'quitar', owner: owner, tabla: tabla, id: id });
  }

  // Al cerrar sesión con todo enviado, la copia de esa cuenta se borra del
  // aparato (02, 2.6): el próximo que entre no ve datos de otro docente.
  // Y las lecturas de la base que el service worker había guardado en
  // meta-datos-v1 (el mismo nombre que CACHE_DATOS en sw.js, que no cambia
  // entre despliegues): ahí quedaban filas con nombre, notas y pagos. Solo
  // esas entradas. La caché es del origen, así que se limpia aunque esta
  // pestaña no sea la líder.
  function olvidarLecturasDeLaBase() {
    var api = w.caches;
    if (!api || typeof api.open !== 'function') return;
    api.open('meta-datos-v1').then(function (cache) {
      return cache.keys().then(function (reqs) {
        return Promise.all(reqs.map(function (req) {
          var host = '';
          try { host = new URL(req.url).hostname; } catch (e) { return null; }
          if (/(^|\.)supabase\.co$/i.test(host)) return cache.delete(req);
          return null;
        }));
      });
    }).catch(function () { /* sin caché no hay nada que olvidar */ });
  }
  function olvidarCuenta(owner) {
    olvidarLecturasDeLaBase();
    var porCuenta = filas.get(owner);
    filas.delete(owner);
    if (!lider) return;
    var llaves = [];
    if (porCuenta) {
      porCuenta.forEach(function (t, tabla) {
        t.forEach(function (f, id) { llaves.push(owner + '|' + tabla + '|' + id); });
      });
    }
    escribir('filas', function (tx) { llaves.forEach(function (k) { tx.objectStore('filas').delete(k); }); });
    Array.from(meta.keys()).forEach(function (k) {
      if (k.indexOf('cursor|' + owner + '|') === 0) quitarMeta(k);
    });
    enviar({ t: 'olvidar', owner: owner });
  }

  // ── Cola ───────────────────────────────────────────────────────────────
  // En la líder: a la cola, con su número. En otra pestaña: a «entrantes»,
  // con su op_id como llave (nunca choca), y se le avisa a la líder.
  function encolar(op) {
    if (!lider) {
      op.orden = op.orden || (Date.now() * 1000 + (misEntrantes.length % 1000));
      if (!misEntrantes.some(function (x) { return x.op_id === op.op_id; })) misEntrantes.push(op);
      escribir('entrantes', function (tx) { tx.objectStore('entrantes').put(op); }, true)
        .then(function () { enviar({ t: 'entrante' }); });
      return op;
    }
    if (!op.seq) op.seq = ++ultimoSeq;
    else if (op.seq > ultimoSeq) ultimoSeq = op.seq;
    if (cola.indexOf(op) < 0) cola.push(op);
    cola.sort(function (a, b) { return a.seq - b.seq; });
    escribir('cola', function (tx) { tx.objectStore('cola').put(op); });
    return op;
  }

  // La líder toma lo que anotaron las otras pestañas, en el orden en que se
  // anotó, y lo pasa a la cola en la MISMA transacción en que lo saca de
  // «entrantes»: nada queda en los dos lados ni en ninguno.
  async function absorberEntrantes() {
    if (!lider || !db) return [];
    var hay = (await todo('entrantes')).sort(function (a, b) { return (a.orden || 0) - (b.orden || 0); });
    if (!hay.length) return [];
    var ya = {};
    cola.forEach(function (o) { ya[o.op_id] = 1; });
    preguntas.forEach(function (p) { if (p.op) ya[p.op.op_id] = 1; });
    var nuevas = [];
    hay.forEach(function (op) {
      if (ya[op.op_id]) return;
      ya[op.op_id] = 1;
      delete op.seq;
      op.seq = ++ultimoSeq;
      cola.push(op);
      nuevas.push(op);
    });
    cola.sort(function (a, b) { return a.seq - b.seq; });
    await escribir(['cola', 'entrantes'], function (tx) {
      nuevas.forEach(function (op) { tx.objectStore('cola').put(op); });
      hay.forEach(function (op) { tx.objectStore('entrantes').delete(op.op_id); });
    });
    return hay.map(function (op) { return op.op_id; });
  }

  function actualizarOp(op) {
    escribir('cola', function (tx) { tx.objectStore('cola').put(op); });
  }

  function sacarDeCola(op) {
    var i = cola.indexOf(op);
    if (i >= 0) cola.splice(i, 1);
    escribir('cola', function (tx) { tx.objectStore('cola').delete(op.seq); });
  }

  // ── Preguntas y tarjetas ───────────────────────────────────────────────
  function ponerPregunta(p) {
    preguntas = preguntas.filter(function (x) { return x.id !== p.id; });
    preguntas.push(p);
    escribir('preguntas', function (tx) { tx.objectStore('preguntas').put(p); });
  }

  function quitarPregunta(id) {
    preguntas = preguntas.filter(function (x) { return x.id !== id; });
    escribir('preguntas', function (tx) { tx.objectStore('preguntas').delete(id); });
  }

  // Una sola tarjeta por fila y motivo (t.clave), con un contador. Antes se
  // apilaba una por cada intento: el 18 de noviembre un perfil escrito
  // letra por letra dejó una tarjeta por letra. Si el docente ya tocó
  // «Entendido», la próxima vez sí sale una nueva.
  function ponerNoAnotado(t) {
    var ya = t.clave ? noAnotado.filter(function (x) { return x.clave === t.clave; })[0] : null;
    if (ya) {
      ya.veces = (ya.veces || 1) + 1;
      ya.texto = t.texto;
      escribir('no_anotado', function (tx) { tx.objectStore('no_anotado').put(ya); });
      return ya;
    }
    t.veces = t.veces || 1;
    noAnotado.push(t);
    escribir('no_anotado', function (tx) { tx.objectStore('no_anotado').put(t); });
    return t;
  }

  function quitarNoAnotado(id) {
    noAnotado = noAnotado.filter(function (x) { return x.id !== id; });
    escribir('no_anotado', function (tx) { tx.objectStore('no_anotado').delete(id); });
  }

  // ── Lo que la líder cuenta a las demás pestañas ────────────────────────
  function foto() {
    return { cola: cola, preguntas: preguntas, noAnotado: noAnotado };
  }
  function ponerFoto(f, absorbidos) {
    if (lider) return;
    cola = (f.cola || []).slice().sort(function (a, b) { return a.seq - b.seq; });
    preguntas = f.preguntas || [];
    noAnotado = f.noAnotado || [];
    var tomadas = {};
    (absorbidos || []).forEach(function (id) { tomadas[id] = 1; });
    cola.forEach(function (o) { tomadas[o.op_id] = 1; });
    preguntas.forEach(function (p) { if (p.op) tomadas[p.op.op_id] = 1; });
    misEntrantes = misEntrantes.filter(function (o) { return !tomadas[o.op_id]; });
  }

  // ── Meta ───────────────────────────────────────────────────────────────
  function ponerMeta(k, v) {
    meta.set(k, v);
    escribir('meta', function (tx) { tx.objectStore('meta').put({ k: k, v: v }); });
  }
  function quitarMeta(k) {
    meta.delete(k);
    escribir('meta', function (tx) { tx.objectStore('meta').delete(k); });
  }

  M._almacen = {
    cargar: cargar,
    elegirLider: elegirLider,
    asumir: asumir,
    esLider: function () { return lider; },
    enviar: enviar,
    alMensaje: function (f) { oyentesMensaje.push(f); },
    fila: fila,
    filasDe: filasDe,
    nombresTablas: nombresTablas,
    guardarFila: guardarFila,
    quitarFila: quitarFila,
    olvidarCuenta: olvidarCuenta,
    cola: function () { return cola; },
    misEntrantes: function () { return misEntrantes; },
    encolar: encolar,
    absorberEntrantes: absorberEntrantes,
    actualizarOp: actualizarOp,
    sacarDeCola: sacarDeCola,
    preguntas: function () { return preguntas; },
    ponerPregunta: ponerPregunta,
    quitarPregunta: quitarPregunta,
    noAnotado: function () { return noAnotado; },
    ponerNoAnotado: ponerNoAnotado,
    quitarNoAnotado: quitarNoAnotado,
    foto: foto,
    ponerFoto: ponerFoto,
    meta: function (k) { return meta.get(k); },
    ponerMeta: ponerMeta,
    escrito: function () { return escrituras; },
  };
})(window);
