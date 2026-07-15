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
     El maestro NO decide nada: la nube manda y todo converge solo.
   • Botón «🔄 Sincronizar ahora»: dispara una sync normal a pedido
     (tranquilidad del usuario; no fuerza nada).
   • «🗑️ Empezar de nuevo» (dsReset): único escape; borra el aula aquí
     y ARCHIVA el estado en una papelera en la nube (no lo destruye) para
     limpiar todos los equipos. «↩️ Recuperar lo que borré» (dsRecuperar)
     lo restaura desde la nube — incluso en otro equipo o tras reinstalar
     (SUPABASE-DOCENTE-PAPELERA.sql). Copia local además, por si no hay red.
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
    'METAS_AVISOS_V1',           // Comunicados (avisos + ficha del aula) — el aviso publicado en la PC debe verse en el teléfono
    'METAS_PLANACCION_V1',       // Plan de Acción
    'METAS_CODIGOS_V1',          // claves de familia (deben calzar entre equipos)
    'METAS_CAMP_V1',             // Campeonísimo (torneo)
    'METAS_CAMP_BANK_EXTRA_V1',  // banco de preguntas extra
    'METAS_CAMP_USED_V1',        // anti-repetición del torneo
    'meta_ge_v2'                 // Gobierno Escolar
    // OJO: METAS_PIN_MAESTRO_V1 NO se sincroniza a propósito. El candado
    // es «de este teléfono»: sincronizarlo hacía que un equipo sin clave
    // empezara a pedirla de la nada. Cada equipo maneja su propio candado.
  ];

  var META_KEY = 'METAS_DOCSYNC_V1';   // { [k]: {v:version, h:hash, sv:sentVersion} }
  var RESPALDO_KEY = 'METAS_AULA_RESPALDO_V1';  // copia de seguridad local antes de «Empezar de nuevo»
  var RESET_PEND_KEY = 'METAS_AULA_RESET_PEND'; // '1' = falta archivar+vaciar la nube (borrado sin red)
  var SB_URL_DEF = 'https://uljjgrikyigdrkbikcxo.supabase.co';
  var SB_KEY_DEF = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';

  var _applying = false;   // true mientras aplicamos datos bajados (no re-estampar)
  var _busy = false;       // una operación de red a la vez
  var _pushT = null;       // debounce de subida
  var _lastAuto = 0;       // última sync automática (para no saturar a escala)
  var AUTO_MIN = 15000;    // no más de una sync automática cada 15 s por equipo
  var _papeleraFecha = null; // fecha de la papelera en la nube (para mostrar «Recuperar» aun sin copia local)

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

  /* «Peso» de un valor: cuántos DATOS reales tiene. Sirve para no dejar
     que una copia casi vacía pise a una llena (la causa de la pérdida).
     Para las claves conocidas cuenta alumnos/claves/análisis; para el
     resto usa el tamaño del texto. */
  function peso(k, raw) {
    if (raw == null || raw === '') return 0;
    var base = raw.length;
    try {
      var o = JSON.parse(raw);
      if (k === 'METAS_ADMIN_V1' && o && Array.isArray(o.grupos)) {
        var n = 0;
        o.grupos.forEach(function (g) {
          (g && g.lista || []).forEach(function (a) {
            if (a && (String(a.nombre || '').trim() || a.num)) n++;
          });
        });
        return n * 1000 + base;
      }
      if (k === 'METAS_CODIGOS_V1' && o && typeof o === 'object') {
        var c = 0;
        Object.keys(o).forEach(function (gk) { c += Object.keys(o[gk] || {}).length; });
        return c * 1000 + base;
      }
      if (k === 'METAS_PLANACCION_V1' && o && Array.isArray(o.analisis)) {
        return o.analisis.length * 1000 + base;
      }
    } catch (_) {}
    return base;
  }

  /* Respaldo automático (acumulativo por clave) de lo que se va a PISAR.
     Se guarda en RESPALDO_KEY para que «↩️ Recuperar lo que borré» pueda
     devolverlo, incluso si la pérdida vino de una sincronización. */
  function backupLocal(k, raw) {
    if (raw == null || raw === '') return;
    var o;
    try { o = JSON.parse(ls(RESPALDO_KEY)); } catch (_) {}
    if (!o || typeof o !== 'object' || !o.datos) o = { fecha: null, datos: {} };
    o.datos[k] = raw;
    o.fecha = new Date().toISOString();
    try { localStorage.setItem(RESPALDO_KEY, JSON.stringify(o)); } catch (_) {}
    _papeleraFecha = o.fecha;
  }

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
      var m = scanLocal(), cambio = false, protegido = false;
      rows.forEach(function (row) {
        if (!row || DS_KEYS.indexOf(row.k) === -1) return;
        cloudKeys.add(row.k);
        if (!row.valor || typeof row.valor.raw === 'undefined') return;
        var raw = row.valor.raw;
        var localRaw = ls(row.k);
        var local = (m[row.k] && m[row.k].v) || 0;
        var remota = Number(row.version) || 0;
        // mismo contenido: solo alinear versión (sin pisar)
        if (m[row.k] && m[row.k].h === hash(raw)) {
          m[row.k].v = Math.max(m[row.k].v || 0, remota); m[row.k].sv = m[row.k].v; return;
        }
        var lp = peso(row.k, localRaw), rp = peso(row.k, raw);
        // GUARDA ANTI-PÉRDIDA: la nube viene MUCHO más vacía que lo local con
        // datos → NO pisar. Conservar lo local y re-subirlo GANANDO versión,
        // para que la nube y el otro equipo se curen solos con la copia buena.
        if (!force && lp >= 300 && rp * 2 < lp) {
          var winV = Math.max(remota, local, ahora()) + 1;
          m[row.k] = { v: winV, h: hash(localRaw), sv: 0 };   // pendiente, con versión que gana
          protegido = true;
          return;
        }
        // aplicar la nube solo si es más nueva (o si aquí no hay nada)
        if (!force && remota <= local && lp > 0) return;
        // RESPALDO antes de pisar algo con contenido (recuperable después)
        if (lp > 0 && localRaw != null) backupLocal(row.k, localRaw);
        _applying = true;
        try { if (raw == null) localStorage.removeItem(row.k); else localStorage.setItem(row.k, raw); }
        catch (_) {}
        _applying = false;
        m[row.k] = { v: remota, h: hash(raw), sv: remota };
        cambio = true;
      });
      metaSave(m);
      if (cambio || protegido) repaint();
      if (protegido) schedulePush();       // sube pronto la copia buena protegida
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

  /* Si un «Empezar de nuevo» se hizo sin red, completa en la nube el
     archivado+vaciado al reconectar (nunca vacía sin archivar primero). */
  function flushPendingReset() {
    if (ls(RESET_PEND_KEY) !== '1' || !creds() || navigator.onLine === false) return Promise.resolve();
    var c = creds();
    return rpc('metas_docente_reset', { p_codigo: c.codigo, p_clave: c.clave }).then(function (res) {
      if (res && res.ok) {
        try { localStorage.removeItem(RESET_PEND_KEY); } catch (_) {}
        if (res.fecha) _papeleraFecha = res.fecha;
      }
    });
  }

  /* ── Sincronización normal: baja lo nuevo y sube lo cambiado ── */
  function sync() {
    if (_busy || !creds()) return Promise.resolve(false);
    _lastAuto = ahora();
    _busy = true;
    return flushPendingReset()
      .then(function () { return pull(false); })
      .then(function (res) { return push(false, res.cloudKeys); })
      .then(function (r) { _busy = false; estado(); return r; })
      .catch(function () { _busy = false; return false; });
  }

  /* sync automática con freno: como muchos eventos (foco de pestaña,
     volver de suspensión) pueden dispararla, se limita a una cada
     AUTO_MIN por equipo. A escala evita lecturas repetidas innecesarias.
     Las acciones del usuario (onProfile, botones ⬆️/⬇️) NO pasan por aquí. */
  function autoSync() {
    if (ahora() - _lastAuto < AUTO_MIN) return Promise.resolve(false);
    return sync();
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

  /* ── Sincronizar ahora (botón único, tranquilidad del usuario) ──
     Hace una sync normal (baja lo nuevo, sube lo cambiado). No fuerza
     nada: es el mismo camino automático, pero a pedido. */
  function syncNow(btn) {
    if (!creds()) { if (typeof toast === 'function') toast('Primero entra a tu cuenta docente'); return; }
    if (btn) { btn.disabled = true; btn.dataset.txt = btn.textContent; btn.textContent = '⏳ Sincronizando…'; }
    estado('☁️ Sincronizando con la nube…');
    _lastAuto = ahora();
    // sync() se salta si _busy; forzamos un pull+push directo para el botón
    var p = _busy ? Promise.resolve(false)
                  : (function () { _busy = true;
                      return pull(false).then(function (res) { return push(false, res.cloudKeys); })
                        .then(function (r) { _busy = false; return r; })
                        .catch(function () { _busy = false; return false; }); })();
    return Promise.resolve(p).then(function (r) {
      if (btn) { btn.disabled = false; if (btn.dataset.txt) btn.textContent = btn.dataset.txt; }
      if (typeof toast === 'function') toast(r !== false ? '✅ Todo al día' : '⚠️ No se pudo ahora, reintenta');
      estado();
    });
  }

  /* ── Empezar de nuevo ──
     Único escape que necesita el maestro: borra TODOS los datos del aula
     (lista, claves de familia, Plan de Acción, economía, notas, torneo,
     gobierno) para reiniciar. Los borra aquí y sube el vacío a la nube
     (force) para que sus demás equipos también queden limpios.
     RED DE SEGURIDAD: antes de borrar guarda una copia en ESTE equipo, y
     luego aparece «↩️ Recuperar lo que borré» por si fue sin querer. */
  /* Llama una RPC de Supabase; resuelve el JSON o null si falla/sin red. */
  function rpc(nombre, cuerpo) {
    if (navigator.onLine === false) return Promise.resolve(null);
    var cfg = sbCfg();
    return fetch(cfg.url + '/rest/v1/rpc/' + nombre, {
      method: 'POST',
      headers: { apikey: cfg.key, Authorization: 'Bearer ' + cfg.key, 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo)
    }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
  }

  function reset() {
    if (!creds()) { if (typeof toast === 'function') toast('Primero entra a tu cuenta docente'); return; }
    var ask = (typeof metasConfirm === 'function')
      ? metasConfirm('Vas a **borrar todos los datos de tu aula** (lista de alumnos, claves de familia, Plan de Acción, economía, notas…) para empezar de cero. También se borran de la nube y de tus otros equipos.\n\nSi fue sin querer, podrás usar **«↩️ Recuperar lo que borré»** — incluso desde otro equipo.',
          { icono: '🗑️', titulo: 'Empezar de nuevo', okTxt: 'Sí, borrar todo' })
      : Promise.resolve(true);
    Promise.resolve(ask).then(function (ok) {
      if (!ok) return;
      var c = creds();
      // 1) copia de seguridad en ESTE equipo (respaldo inmediato aunque no haya red)
      var snap = {};
      DS_KEYS.forEach(function (k) { var v = ls(k); if (v != null) snap[k] = v; });
      try {
        localStorage.setItem(RESPALDO_KEY, JSON.stringify({ fecha: new Date().toISOString(), datos: snap }));
      } catch (_) {}
      // 2) borra local. Marca sv=v (NO pendiente): la nube la limpia el RPC
      //    de reset (que archiva primero), no el vigía de subida. Así nunca
      //    se vacía la nube sin haber archivado antes.
      DS_KEYS.forEach(function (k) { try { localStorage.removeItem(k); } catch (_) {} });
      var m = {}, t = ahora();
      DS_KEYS.forEach(function (k) { m[k] = { v: t, h: hash(null), sv: t }; });
      metaSave(m);
      try { localStorage.setItem(RESET_PEND_KEY, '1'); } catch (_) {}   // falta archivar+vaciar la nube
      _papeleraFecha = new Date().toISOString();   // ya hay algo que recuperar
      repaint();
      // 3) archiva + vacía en la nube (papelera server-side → recuperable desde cualquier equipo)
      rpc('metas_docente_reset', { p_codigo: c.codigo, p_clave: c.clave }).then(function (res) {
        if (res && res.ok) {
          try { localStorage.removeItem(RESET_PEND_KEY); } catch (_) {}
          if (res.fecha) _papeleraFecha = res.fecha;
          if (typeof toast === 'function') toast('🗑️ Aula vacía. Si fue por error, usa «Recuperar lo que borré».');
        } else {
          // sin red: queda pendiente; la copia local cubre el deshacer aquí y
          //          el archivado en la nube se hará al reconectar (flushPendingReset)
          if (typeof toast === 'function') toast('🗑️ Borrado. Se archivará y limpiará la nube al reconectar.');
        }
      });
    });
  }

  /* Lee la copia de seguridad LOCAL si existe y tiene contenido. */
  function respaldo() {
    try {
      var o = JSON.parse(ls(RESPALDO_KEY));
      if (o && o.datos && Object.keys(o.datos).length) return o;
    } catch (_) {}
    return null;
  }

  /* Aplica filas {k,valor,version} al localStorage (usado al recuperar de la nube). */
  function aplicarRows(rows) {
    if (!Array.isArray(rows)) return false;
    var m = metaLoad(), cambio = false;
    rows.forEach(function (row) {
      if (!row || DS_KEYS.indexOf(row.k) === -1) return;
      if (!row.valor || row.valor.raw == null) return;
      var raw = row.valor.raw;
      _applying = true;
      try { localStorage.setItem(row.k, raw); } catch (_) {}
      _applying = false;
      var rem = Number(row.version) || ahora();
      m[row.k] = { v: rem, h: hash(raw), sv: rem };    // sv=v → ya está en la nube, no re-subir
      cambio = true;
    });
    metaSave(m);
    if (cambio) repaint();
    return cambio;
  }

  function limpiarRespaldos() {
    try { localStorage.removeItem(RESPALDO_KEY); } catch (_) {}
    _papeleraFecha = null;
  }

  /* ── Recuperar lo que borré ──
     Prioriza la NUBE (sobrevive a reinstalar / otro equipo). Si la nube no
     tiene nada, usa la copia local de este equipo. */
  function recuperar() {
    var b = respaldo();
    var c = creds();
    if (!b && !c) { if (typeof toast === 'function') toast('No hay nada que recuperar'); return; }
    var fuente = (b && b.fecha) || _papeleraFecha;
    var cuando = '';
    try {
      var f = new Date(fuente);
      if (fuente && !isNaN(f)) cuando = ' (borrados el ' + f.toLocaleDateString() + ' a las ' +
        f.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ')';
    } catch (_) {}
    var ask = (typeof metasConfirm === 'function')
      ? metasConfirm('Se **restaurarán** los datos del aula que borraste' + cuando + ', aquí y en tus demás equipos. ¿Recuperarlos?',
          { icono: '↩️', titulo: 'Recuperar lo que borré', okTxt: 'Sí, recuperar' })
      : Promise.resolve(true);
    Promise.resolve(ask).then(function (ok) {
      if (!ok) return;
      // 1) intenta la nube primero
      var pNube = c ? rpc('metas_docente_reset_deshacer', { p_codigo: c.codigo, p_clave: c.clave })
                    : Promise.resolve(null);
      pNube.then(function (rows) {
        if (Array.isArray(rows) && rows.length && aplicarRows(rows)) {
          limpiarRespaldos();
          if (typeof toast === 'function') toast('↩️ Datos recuperados en todos tus equipos.');
          return;
        }
        // 2) la nube no tenía nada → usa la copia local
        if (b) {
          var m = metaLoad(), t = ahora();
          Object.keys(b.datos).forEach(function (k) {
            if (DS_KEYS.indexOf(k) === -1) return;
            try { localStorage.setItem(k, b.datos[k]); } catch (_) {}
            m[k] = { v: t, h: hash(b.datos[k]), sv: 0 };   // marca para re-subir
          });
          metaSave(m);
          limpiarRespaldos();
          repaint();
          push(true).then(function (r) {
            if (typeof toast === 'function') {
              toast(r ? '↩️ Datos recuperados en todos tus equipos.'
                      : '↩️ Recuperado aquí; se subirá al reconectar.');
            }
          });
        } else if (typeof toast === 'function') {
          toast('No se pudo recuperar ahora, reintenta con internet');
        }
      });
    });
  }

  /* ── «Este equipo tiene los datos correctos» (recuperación) ──
     Si un equipo aún conserva la copia buena, la impone en la nube y en los
     demás equipos (force). Salvavidas si algo se desincronizó. */
  function usarEste() {
    if (!creds()) { if (typeof toast === 'function') toast('Primero entra a tu cuenta docente'); return; }
    var ask = (typeof metasConfirm === 'function')
      ? metasConfirm('Se usarán los datos de **ESTE equipo** (lista de alumnos, claves de familia, economía, asistencia, notas, Plan de Acción) en la nube y en todos tus equipos, reemplazando lo que haya. Úsalo en el equipo que tiene la copia buena. ¿Continuar?',
          { icono: '✅', titulo: 'Usar los datos de este equipo', okTxt: 'Sí, usar este' })
      : Promise.resolve(true);
    Promise.resolve(ask).then(function (ok) {
      if (!ok) return;
      push(true).then(function (r) {
        if (typeof toast === 'function') toast(r ? '✅ Listo: este equipo es ahora la copia buena en todos.' : '⚠️ No se pudo ahora, reintenta con internet.');
      });
    });
  }

  /* Revisa si la nube tiene papelera; si cambia el estado, repinta para
     mostrar/ocultar «Recuperar» (así aparece aun en un equipo sin copia). */
  function checkPapelera() {
    var c = creds();
    if (!c) return Promise.resolve();
    return rpc('metas_docente_papelera', { p_codigo: c.codigo, p_clave: c.clave }).then(function (res) {
      var antes = !!_papeleraFecha;
      // no pisar una copia local recién hecha con un "no hay" de la nube
      if (res && res.hay) _papeleraFecha = res.fecha || true;
      else if (!respaldo()) _papeleraFecha = null;
      if (antes !== !!_papeleraFecha) repaint();
    });
  }

  /* Se llama desde renderProfile() cuando se muestra el panel del maestro.
     Sincroniza en silencio: la nube manda, el maestro no decide nada. */
  function onProfile() {
    if (!creds()) return;
    checkPapelera();
    sync();
  }

  /* ── disparadores automáticos (sincronización continua tipo Drive) ── */
  document.addEventListener('DOMContentLoaded', function () {
    if (creds()) setTimeout(autoSync, 1500);
    // vigía: sube cambios locales sin depender de cada herramienta
    setInterval(function () {
      if (document.hidden || !creds() || _applying) return;
      var m = scanLocal(), pend = false;
      DS_KEYS.forEach(function (k) { var e = m[k]; if (e && e.v !== e.sv) pend = true; });
      if (pend) { schedulePush(); estado(); }
    }, 8000);
    // late de fondo: baja lo nuevo de la nube cada ~20 s aunque nadie toque
    // nada, para que los equipos converjan solos (el freno AUTO_MIN evita saturar).
    setInterval(function () {
      if (document.hidden || !creds() || _applying) return;
      autoSync();
    }, 20000);
  });
  window.addEventListener('online', function () { if (creds()) autoSync(); });
  document.addEventListener('visibilitychange', function () { if (!document.hidden && creds()) autoSync(); });

  /* API pública mínima */
  window.dsOnProfile = onProfile;
  window.dsSync = sync;
  window.dsSyncNow = syncNow;
  window.dsReset = reset;
  window.dsRecuperar = recuperar;
  window.dsUsarEste = usarEste;
  window.dsTieneRespaldo = function () { var b = respaldo(); return (b && (b.fecha || true)) || _papeleraFecha; };
})();
