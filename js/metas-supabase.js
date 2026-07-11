/* =====================================================================
   M.E.T.A.S — metas-supabase.js (Fase 1 · Nube)
   Capa de sincronización de RESULTADOS a Supabase. 100% offline-first:

   - metas-registro.js sigue siendo la única fuente de verdad local.
   - Cada evaluación calificada (conceptual u operativa) se copia a una
     cola local (METAS_SB_OUTBOX_V1) y se envía a la tabla `resultados`
     cuando hay internet. Sin conexión NADA se bloquea ni se pierde.
   - Deduplicación en el servidor por evento_id (índice único +
     Prefer: resolution=ignore-duplicates), así los reintentos tras un
     corte de luz nunca duplican filas.
   - Este archivo lo carga automáticamente metas-registro.js; las
     misiones NO necesitan incluirlo a mano.

   La clave usada es la PÚBLICA (anon/publishable): solo permite
   insertar gracias a RLS. La consulta del maestro vive en
   consulta-nube.html y exige la clave docente (ver SUPABASE-FASE1.md).
   ===================================================================== */
(function () {
  'use strict';

  var SB_URL = 'https://uljjgrikyigdrkbikcxo.supabase.co';
  var SB_KEY = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
  // Otro maestro puede apuntar a su propio proyecto sin tocar el código:
  try {
    SB_URL = localStorage.getItem('METAS_SB_URL') || SB_URL;
    SB_KEY = localStorage.getItem('METAS_SB_KEY') || SB_KEY;
  } catch (e) {}

  var CLAVE_OUTBOX = 'METAS_SB_OUTBOX_V1';
  var CLAVE_BACKFILL = 'METAS_SB_BACKFILL_V1';
  var MAX_OUTBOX = 1000;   // tope de seguridad para no llenar localStorage
  var LOTE_MAX = 200;      // filas por envío normal
  var LOTE_CIERRE = 50;    // filas al cerrar la página (límite de keepalive)
  var TIPOS = { evaluacion: 1, prueba_operativa: 1 };

  // ---------- cola local (outbox) ----------
  function leerCola() {
    try { var a = JSON.parse(localStorage.getItem(CLAVE_OUTBOX)); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  function escribirCola(filas) {
    if (filas.length > MAX_OUTBOX) filas = filas.slice(filas.length - MAX_OUTBOX);
    try { localStorage.setItem(CLAVE_OUTBOX, JSON.stringify(filas)); return true; }
    catch (e) {
      try { localStorage.setItem(CLAVE_OUTBOX, JSON.stringify(filas.slice(200))); return true; }
      catch (e2) { return false; }
    }
  }

  function entero(v) {
    var n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  }

  // Convierte un evento del registro local en una fila de la tabla `resultados`
  function fila(ev) {
    return {
      evento_id: ev.id,
      tipo: ev.tipo,
      mision: ev.mision || null,
      forma: entero(ev.forma),
      nota: entero(ev.nota),
      base: entero(ev.base),
      alumno: ev.alumno || '',
      codigo_lista: ev.num || '',
      grado: ev.grado || '',
      docente: ev.docente || '',
      escuela: ev.escuela || '',
      dispositivo: ev.disp || '',
      xp: entero(ev.xp),
      fecha: ev.t || null
    };
  }

  function encolar(ev) {
    if (!ev || !TIPOS[ev.tipo] || !ev.id) return;
    var cola = leerCola();
    for (var i = 0; i < cola.length; i++) { if (cola[i].evento_id === ev.id) return; }
    cola.push(fila(ev));
    escribirCola(cola);
    programar();
  }

  // Primera vez: copia a la cola las evaluaciones ya guardadas en este
  // dispositivo, para que el historial previo también llegue a la nube.
  function backfill() {
    try {
      if (localStorage.getItem(CLAVE_BACKFILL) === '1') return;
      var eventos = [];
      try { eventos = JSON.parse(localStorage.getItem('METAS_REGISTRO_V1')) || []; } catch (e) {}
      if (Array.isArray(eventos)) {
        var cola = leerCola();
        var enCola = {};
        cola.forEach(function (f) { enCola[f.evento_id] = 1; });
        eventos.forEach(function (ev) {
          if (ev && TIPOS[ev.tipo] && ev.id && !enCola[ev.id]) cola.push(fila(ev));
        });
        escribirCola(cola);
      }
      localStorage.setItem(CLAVE_BACKFILL, '1');
    } catch (e) {}
  }

  // ---------- envío ----------
  var enCurso = false;
  function sincronizar(opciones) {
    opciones = opciones || {};
    var quedan = function () { return { enviados: 0, pendientes: leerCola().length }; };
    if (!SB_URL || !SB_KEY || typeof fetch !== 'function' || enCurso) return Promise.resolve(quedan());
    if (navigator.onLine === false) return Promise.resolve(quedan());
    var lote = leerCola().slice(0, opciones.keepalive ? LOTE_CIERRE : LOTE_MAX);
    if (!lote.length) return Promise.resolve(quedan());
    enCurso = true;
    var conf = {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=ignore-duplicates,return=minimal'
      },
      body: JSON.stringify(lote)
    };
    if (opciones.keepalive) conf.keepalive = true;
    return fetch(SB_URL + '/rest/v1/resultados?on_conflict=evento_id', conf)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        var ids = {};
        lote.forEach(function (f) { ids[f.evento_id] = 1; });
        escribirCola(leerCola().filter(function (f) { return !ids[f.evento_id]; }));
        enCurso = false;
        if (!opciones.keepalive && leerCola().length) {
          return sincronizar(opciones).then(function (r2) {
            return { enviados: lote.length + r2.enviados, pendientes: r2.pendientes };
          });
        }
        return { enviados: lote.length, pendientes: leerCola().length };
      })
      .catch(function () { enCurso = false; return quedan(); });
  }

  var timer = null;
  function programar() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () { timer = null; sincronizar(); }, 6000);
  }

  // ---------- conexiones ----------
  // metas-registro.js emite este evento por cada registro nuevo
  document.addEventListener('metas:registro', function (e) { encolar(e.detail); });
  window.addEventListener('online', function () { sincronizar(); });
  window.addEventListener('pagehide', function () { sincronizar({ keepalive: true }); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) sincronizar({ keepalive: true });
  });

  // ---------- API pública ----------
  window.METAS_SB = {
    version: 1,
    url: SB_URL,
    pendientes: function () { return leerCola().length; },
    sincronizar: sincronizar
  };

  backfill();
  setTimeout(function () { sincronizar(); }, 5000);
})();
