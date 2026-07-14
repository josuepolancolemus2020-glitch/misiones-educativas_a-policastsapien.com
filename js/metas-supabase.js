/* =====================================================================
   M.E.T.A.S — metas-supabase.js (Fase 1 · Nube)
   Capa de sincronización de RESULTADOS a Supabase. 100% offline-first:

   - metas-registro.js sigue siendo la única fuente de verdad local.
   - Cada evaluación calificada (conceptual u operativa) se copia a una
     cola local (METAS_SB_OUTBOX_V1) y se envía a la tabla `resultados`
     cuando hay internet. Sin conexión NADA se bloquea ni se pierde.
   - Deduplicación en el servidor por evento_id (índice único; la función
     metas_guardar hace ON CONFLICT DO NOTHING), así los reintentos tras
     un corte de luz nunca duplican filas.
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
  var TIPOS = { evaluacion: 1, prueba_operativa: 1, pauta_vista: 1 };

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
      codigo_aula: ev.codigo_aula || '',
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
    // Se envía a la función metas_guardar (no a la tabla directo): ella
    // deduplica por evento_id en el servidor, cosa que RLS de solo-insertar
    // no permite hacer vía on_conflict del API REST.
    var conf = {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ filas: lote })
    };
    if (opciones.keepalive) conf.keepalive = true;
    return fetch(SB_URL + '/rest/v1/rpc/metas_guardar', conf)
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

  // ---------- Fase 2: espejo de progreso ----------
  // Una "foto" del avance del alumno actual en este dispositivo (XP del
  // index, secciones, mejores notas por misión, diagnósticos de rutas,
  // insignias del Campeonísimo). Se envía a la tabla `progreso` vía la
  // función metas_guardar_progreso (upsert por dispositivo+alumno) y solo
  // cuando el resumen cambió desde el último envío.
  var CLAVE_PROG = 'METAS_SB_PROG_V1'; // último resumen enviado con éxito

  function leerJSON(clave, respaldo) {
    try { var v = JSON.parse(localStorage.getItem(clave)); return (v === null || v === undefined) ? respaldo : v; }
    catch (e) { return respaldo; }
  }

  function snapshotProgreso() {
    var disp = '';
    try { disp = localStorage.getItem('METAS_DISPOSITIVO') || ''; } catch (e) {}
    if (!disp) return null;
    var id = leerJSON('METAS_ALUMNO_V1', {}) || {};
    var nombre = id.nombre || '';
    var eventos = leerJSON('METAS_REGISTRO_V1', []);
    if (!Array.isArray(eventos)) eventos = [];
    var misiones = {}, porSesion = {}, secciones = 0;
    eventos.forEach(function (ev) {
      if (!ev || !ev.mision) return;
      // en dispositivos compartidos, cuenta solo lo del alumno actual
      if (ev.alumno && nombre && ev.alumno !== nombre) return;
      var m = misiones[ev.mision] || (misiones[ev.mision] = { sec: 0, best: null, intentos: 0 });
      if (ev.tipo === 'seccion') { m.sec++; secciones++; }
      if ((ev.tipo === 'evaluacion' || ev.tipo === 'prueba_operativa') && typeof ev.nota === 'number') {
        m.intentos++;
        var base = (typeof ev.base === 'number' && ev.base > 0) ? ev.base : 100;
        var pct = Math.round((ev.nota / base) * 100);
        if (m.best === null || pct > m.best) m.best = pct;
      }
      if (ev.ses && typeof ev.min === 'number') porSesion[ev.ses] = Math.max(porSesion[ev.ses] || 0, ev.min);
    });
    var minutos = 0; for (var s in porSesion) minutos += porSesion[s];
    var dominadas = [];
    for (var f in misiones) { if (misiones[f].best !== null && misiones[f].best >= 70) dominadas.push(f); }
    var meta = leerJSON('meta_v2', {}) || {};
    var diag = leerJSON('METAS_DIAG_V1', {}) || {};
    var camp = null;
    var c = leerJSON('METAS_CAMP_V1', null);
    if (c && Array.isArray(c.historial) && c.historial.length) {
      var ins = [];
      c.historial.forEach(function (h) {
        (h.insignias || []).forEach(function (i) { ins.push((i.icon || '') + ' ' + (i.nombre || '')); });
      });
      camp = { torneos: c.historial.length, insignias: ins.slice(0, 40) };
    }
    return {
      dispositivo: disp,
      alumno: nombre,
      codigo_lista: id.num || '',
      grado: id.grado || '',
      docente: id.docente || '',
      escuela: id.escuela || '',
      resumen: {
        xp_index: (typeof meta.xp === 'number') ? meta.xp : null,
        visitadas: Array.isArray(meta.visited) ? meta.visited.length : null,
        secciones: secciones,
        minutos: Math.round(minutos),
        dominadas: dominadas.sort(),
        misiones: misiones,
        diag: diag,
        camp: camp
      }
    };
  }

  var progEnCurso = false;
  function sincronizarProgreso(opciones) {
    opciones = opciones || {};
    if (progEnCurso || !SB_URL || !SB_KEY || typeof fetch !== 'function') return Promise.resolve(false);
    if (navigator.onLine === false) return Promise.resolve(false);
    var snap = snapshotProgreso();
    if (!snap) return Promise.resolve(false);
    var cuerpo = JSON.stringify({ fila: snap });
    try { if (localStorage.getItem(CLAVE_PROG) === cuerpo) return Promise.resolve(false); } catch (e) {}
    progEnCurso = true;
    var conf = {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json'
      },
      body: cuerpo
    };
    if (opciones.keepalive) conf.keepalive = true;
    return fetch(SB_URL + '/rest/v1/rpc/metas_guardar_progreso', conf)
      .then(function (r) {
        progEnCurso = false;
        if (!r.ok) return false;
        try { localStorage.setItem(CLAVE_PROG, cuerpo); } catch (e) {}
        return true;
      })
      .catch(function () { progEnCurso = false; return false; });
  }

  var progTimer = null;
  function programarProgreso() {
    if (progTimer) clearTimeout(progTimer);
    progTimer = setTimeout(function () { progTimer = null; sincronizarProgreso(); }, 12000);
  }

  // ---------- conexiones ----------
  // metas-registro.js emite este evento por cada registro nuevo
  document.addEventListener('metas:registro', function (e) {
    encolar(e.detail);
    programarProgreso();
  });
  window.addEventListener('online', function () { sincronizar(); sincronizarProgreso(); });
  window.addEventListener('pagehide', function () {
    sincronizar({ keepalive: true });
    sincronizarProgreso({ keepalive: true });
  });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { sincronizar({ keepalive: true }); sincronizarProgreso({ keepalive: true }); }
  });

  // ---------- API pública ----------
  window.METAS_SB = {
    version: 2,
    url: SB_URL,
    pendientes: function () { return leerCola().length; },
    sincronizar: sincronizar,
    progreso: snapshotProgreso,
    sincronizarProgreso: sincronizarProgreso
  };

  backfill();
  setTimeout(function () { sincronizar(); }, 5000);
  setTimeout(function () { sincronizarProgreso(); }, 9000);
})();
