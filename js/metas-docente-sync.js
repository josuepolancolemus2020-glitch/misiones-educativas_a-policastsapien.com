/* ══════════════════════════════════════════════════════════════
   ESPEJO DEL ESTADO DEL MAESTRO — misma Zona Docente en todo equipo
   ─────────────────────────────────────────────────────────────
   Problema que resuelve: las herramientas de la Zona Docente
   (Registros Admin, Plan de Acción, claves de familia, Campeonísimo,
   Gobierno Escolar, candado del maestro) viven en localStorage de CADA
   equipo. El mismo maestro veía datos distintos en el teléfono y en la
   PC. Aquí sincronizamos esas claves por CÓDIGO DOCENTE (PROF-XXXX)
   contra Supabase (SUPABASE-DOCENTE-ESTADO.sql).

   Cómo funciona:
   • Detecta cambios locales por hash (no toca el código de cada
     herramienta) y sube solo lo que cambió, con marca de tiempo.
   • Al abrir la Zona Docente / al volver internet / con la app visible,
     baja lo más nuevo de la nube y repinta la vista activa.
   • Conflicto automático: gana el cambio más reciente (last-write-wins).
   • Reconciliación manual (una sola vez): «⬆️ Subir lo de este equipo»
     y «⬇️ Traer lo de la nube» fuerzan la dirección elegida.
   • Offline-first: sin internet no pasa nada; reintenta al volver.

   Solo sincroniza las claves del maestro (abajo). NO toca los
   resultados/progreso de los alumnos (esos sincronizan por su propio
   camino en metas-supabase.js).
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Claves de localStorage que forman «la Zona Docente» de un maestro.
     Deliberadamente NO se incluyen: identidad del docente (la clave por
     la que sincronizamos), config de nube/sync, banderas de sesión,
     preferencias de presentación por equipo, ni datos de alumno. */
  var DS_KEYS = [
    'METAS_ADMIN_V1',            // Registros Admin (lista, economía, asistencia, notas SACE)
    'METAS_PLANACCION_V1',       // Plan de Acción
    'METAS_CODIGOS_V1',          // claves de familia (deben calzar entre equipos)
    'METAS_CAMP_V1',             // Campeonísimo (torneo)
    'METAS_CAMP_BANK_EXTRA_V1',  // banco de preguntas extra
    'METAS_CAMP_USED_V1',        // anti-repetición del torneo
    'meta_ge_v2',                // Gobierno Escolar
    'METAS_PIN_MAESTRO_V1'       // candado del maestro (mismo PIN en todo equipo)
  ];

  var META_KEY = 'METAS_DOCSYNC_V1';   // { [k]: {v:version, h:hash, sv:sentVersion} }
  var SB_URL_DEF = 'https://uljjgrikyigdrkbikcxo.supabase.co';
  var SB_KEY_DEF = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';

  var _applying = false;   // true mientras aplicamos datos bajados (no re-estampar)
  var _busy = false;       // una operación de red a la vez
  var _pushT = null;       // debounce de subida

  /* ── util ── */
  function ls(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }
  function hash(s) {
    if (s == null) return '0';
    var h = 5381, i = s.length;
    while (i) h = (h * 33) ^ s.charCodeAt(--i);
    return (h >>> 0).toString(36);
  }
  function metaLoad() {
    try { var o = JSON.parse(ls(META_KEY)); return (o && typeof o === 'object') ? o : {}; }
    catch (_) { return {}; }
  }
  function metaSave(m) { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (_) {} }

  function creds() {
    try {
      var d = JSON.parse(ls('METAS_DOCENTE_V1'));
      if (d && d.codigo && d.clave) return { codigo: d.codigo, clave: d.clave };
    } catch (_) {}
    return null;
  }
  function sbCfg() {
    var url = SB_URL_DEF, key = SB_KEY_DEF;
    try { url = ls('METAS_SB_URL') || url; key = ls('METAS_SB_KEY') || key; } catch (_) {}
    return { url: url, key: key };
  }
  function deviceId() {
    var id = ls('METAS_DISPOSITIVO');
    if (!id) return 'equipo';
    return String(id).slice(0, 40);
  }
  function ahora() { return Date.now(); }

  /* Refresca el mapa: marca con versión nueva SOLO las claves que el
     maestro editó de verdad desde la última vez que las vimos (por hash).
     La PRIMERA vez que vemos datos ya existentes NO se marcan como cambio
     (sv = v): así no se re-emiten automáticamente y no pueden pisar lo de
     otro equipo. Esos datos previos solo suben con «⬆️ Subir» (o como
     semilla si la nube aún no los tiene, ver push()). */
  function scanLocal() {
    var m = metaLoad(), t = ahora(), toca = false;
    DS_KEYS.forEach(function (k) {
      var cur = ls(k);
      var h = hash(cur);
      var e = m[k];
      if (!e) {
        if (cur != null) { m[k] = { v: t, h: h, sv: t }; toca = true; }   // ya existía: NO es edición
      } else if (e.h !== h) {
        e.v = t; e.h = h; toca = true;                                     // edición real → pendiente
      }
    });
    if (toca) metaSave(m);
    return m;
  }

  /* ── SUBIR ──
     force  = reconciliación manual: sube TODO y manda al servidor pisar
              sin importar versiones (p_forzar). Es la copia buena.
     cloudKeys = Set de claves que la nube YA tiene (viene del pull previo);
              permite SEMBRAR datos previos solo cuando la nube no los tiene,
              sin arriesgar pisar lo de otro equipo. */
  function push(force, cloudKeys) {
    var c = creds();
    if (!c) return Promise.resolve(false);
    var m = scanLocal();
    var t = ahora();
    var entradas = [];
    DS_KEYS.forEach(function (k) {
      var cur = ls(k);
      var e = m[k];
      if (cur == null && !e) return;                       // nunca ha existido: nada que subir
      if (!e) { e = m[k] = { v: t, h: hash(cur), sv: t }; }
      var edicionReal = e.v !== e.sv;
      var semilla = !!cloudKeys && !cloudKeys.has(k) && cur != null;   // la nube no lo tiene aún
      if (!(force || edicionReal || semilla)) return;
      var version = force ? t : e.v;
      if (force) { e.v = version; e.h = hash(cur); }
      entradas.push({ k: k, valor: { raw: cur }, version: version, dispositivo: deviceId() });
    });
    if (!entradas.length) { return Promise.resolve(true); }
    if (navigator.onLine === false) return Promise.resolve(false);
    var cfg = sbCfg();
    return fetch(cfg.url + '/rest/v1/rpc/metas_docente_estado_guardar', {
      method: 'POST',
      headers: { apikey: cfg.key, Authorization: 'Bearer ' + cfg.key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_codigo: c.codigo, p_clave: c.clave, p_entradas: entradas, p_forzar: !!force })
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (n) {
      if (typeof n !== 'number' || n < 0) throw new Error('rechazado');
      entradas.forEach(function (en) { var e = m[en.k]; if (e) e.sv = en.version; });
      metaSave(m);
      return true;
    }).catch(function () { return false; });
  }

  /* ── BAJAR ── (resuelve { ok, cloudKeys })
     force = reconciliación manual: reemplaza lo local con la nube sin
             importar versiones. Automático: aplica solo lo más nuevo. */
  function pull(force) {
    var c = creds();
    if (!c) return Promise.resolve({ ok: false, cloudKeys: new Set() });
    if (navigator.onLine === false) return Promise.resolve({ ok: false, cloudKeys: new Set() });
    var cfg = sbCfg();
    return fetch(cfg.url + '/rest/v1/rpc/metas_docente_estado_leer', {
      method: 'POST',
      headers: { apikey: cfg.key, Authorization: 'Bearer ' + cfg.key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_codigo: c.codigo, p_clave: c.clave })
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (rows) {
      var cloudKeys = new Set();
      if (!Array.isArray(rows)) return { ok: false, cloudKeys: cloudKeys };
      var m = scanLocal(), cambio = false;
      rows.forEach(function (row) {
        if (!row || DS_KEYS.indexOf(row.k) === -1) return;
        cloudKeys.add(row.k);
        if (!row.valor || typeof row.valor.raw === 'undefined') return;
        var local = (m[row.k] && m[row.k].v) || 0;
        var remota = Number(row.version) || 0;
        if (!force && remota <= local) return;             // lo local es igual o más nuevo
        var raw = row.valor.raw;
        if (m[row.k] && m[row.k].h === hash(raw)) {         // mismo contenido: solo alinear versión
          m[row.k].v = remota; m[row.k].sv = remota; return;
        }
        _applying = true;
        try { if (raw == null) localStorage.removeItem(row.k); else localStorage.setItem(row.k, raw); }
        catch (_) {}
        _applying = false;
        m[row.k] = { v: remota, h: hash(raw), sv: remota };
        cambio = true;
      });
      metaSave(m);
      if (cambio) repaint();
      return { ok: true, cloudKeys: cloudKeys };
    }).catch(function () { return { ok: false, cloudKeys: new Set() }; });
  }

  /* Repinta la vista de la Zona Docente que esté abierta, para que los
     datos bajados se vean sin recargar. */
  function repaint() {
    try {
      if (typeof renderProfile === 'function' &&
          document.getElementById('view-perfil') &&
          document.getElementById('view-perfil').classList.contains('active')) renderProfile();
      var active = document.querySelector('.view.active');
      var id = active ? active.id : '';
      if (id === 'view-admin' && typeof renderAdmin === 'function') renderAdmin();
      if (id === 'view-plan-accion' && typeof paInit === 'function') paInit();
      if (id === 'view-campeonismo' && typeof initCampeonismo === 'function') initCampeonismo();
      if (id === 'view-gobierno' && typeof renderGobiernoEscolar === 'function') renderGobiernoEscolar();
    } catch (_) {}
  }

  /* ── Sincronización normal: baja lo nuevo y sube lo cambiado ── */
  function sync() {
    if (_busy || !creds()) return Promise.resolve(false);
    _busy = true;
    return pull(false).then(function (res) { return push(false, res.cloudKeys); })
      .then(function (r) { _busy = false; estado(); return r; })
      .catch(function () { _busy = false; return false; });
  }

  function schedulePush() {
    clearTimeout(_pushT);
    _pushT = setTimeout(function () { if (!_busy) { _busy = true; push(false).then(function () { _busy = false; estado(); }); } }, 4000);
  }

  /* Actualiza el texto de estado en la tarjeta del maestro (si está). */
  function estado(txt) {
    var el = document.getElementById('doc-sync-status');
    if (!el) return;
    if (txt) { el.textContent = txt; return; }
    if (!creds()) { el.textContent = ''; return; }
    if (navigator.onLine === false) { el.textContent = '📴 Datos del aula: esperando internet.'; return; }
    var m = metaLoad(), pend = 0;
    DS_KEYS.forEach(function (k) { var e = m[k]; if (e && e.v !== e.sv) pend++; });
    el.textContent = pend ? ('⏳ Guardando ' + pend + ' cambio(s) en la nube…')
                          : '✅ Datos del aula sincronizados en todos tus equipos.';
  }

  /* ── Reconciliación manual (detrás del candado del maestro) ── */
  function guardar(fn, msg) {
    if (typeof paVerificarPin === 'function') {
      return Promise.resolve(paVerificarPin(msg)).then(function (ok) { return ok ? fn() : false; });
    }
    return Promise.resolve(fn());
  }

  function forcePush() {
    if (!creds()) { if (typeof toast === 'function') toast('Primero entra a tu cuenta docente'); return; }
    var ask = (typeof metasConfirm === 'function')
      ? metasConfirm('Esto hará que la nube y tus demás equipos usen los datos de **ESTE equipo** (lista, economía, asistencia, notas, Plan de Acción…). ¿Continuar?',
          { icono: '⬆️', titulo: 'Subir lo de este equipo', okTxt: 'Sí, subir' })
      : Promise.resolve(true);
    Promise.resolve(ask).then(function (ok) {
      if (!ok) return;
      return guardar(function () {
        estado('⏳ Subiendo todo…');
        return push(true).then(function (r) {
          if (typeof toast === 'function') toast(r ? '☁️ Este equipo quedó como la copia buena' : '⚠️ No se pudo subir ahora');
          estado();
        });
      }, 'Para subir los datos de este equipo:');
    });
  }

  function forcePull() {
    if (!creds()) { if (typeof toast === 'function') toast('Primero entra a tu cuenta docente'); return; }
    var ask = (typeof metasConfirm === 'function')
      ? metasConfirm('Esto **reemplazará** los datos de la Zona Docente de este equipo con los de la nube. Úsalo en el equipo que tiene datos viejos o de prueba. ¿Continuar?',
          { icono: '⬇️', titulo: 'Traer lo de la nube', okTxt: 'Sí, traer' })
      : Promise.resolve(true);
    Promise.resolve(ask).then(function (ok) {
      if (!ok) return;
      return guardar(function () {
        estado('⏳ Trayendo de la nube…');
        return pull(true).then(function (r) {
          if (typeof toast === 'function') toast(r && r.ok ? '⬇️ Este equipo quedó igual que la nube' : '⚠️ No se pudo traer ahora');
          repaint(); estado();
        });
      }, 'Para traer los datos de la nube:');
    });
  }

  /* Se llama desde renderProfile() cuando se muestra el panel del maestro */
  function onProfile() {
    if (!creds()) return;
    estado('☁️ Revisando la nube del aula…');
    sync();
  }

  /* ── disparadores automáticos ── */
  document.addEventListener('DOMContentLoaded', function () {
    if (creds()) setTimeout(sync, 1500);
    // vigía suave: sube cambios locales sin depender de cada herramienta
    setInterval(function () {
      if (document.hidden || !creds() || _applying) return;
      var m = scanLocal(), pend = false;
      DS_KEYS.forEach(function (k) { var e = m[k]; if (e && e.v !== e.sv) pend = true; });
      if (pend) { schedulePush(); estado(); }
    }, 10000);
  });
  window.addEventListener('online', function () { if (creds()) sync(); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && creds()) sync(); });

  /* API pública mínima */
  window.dsForcePush = forcePush;
  window.dsForcePull = forcePull;
  window.dsOnProfile = onProfile;
  window.dsSync = sync;
})();
