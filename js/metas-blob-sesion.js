/* =====================================================================
   M.E.T.A.S — js/metas-blob-sesion.js · lo que sigue en el blob, por sesión
   ---------------------------------------------------------------------
   Reemplaza al espejo viejo (js/metas-docente-sync.js), que hablaba con la
   base con el código y la CONTRASEÑA guardados en METAS_DOCENTE_V1. Desde el
   paso 1 de SUPABASE-V2-CONGELAR.sql eso ya no sirve para un docente
   vinculado, y la app nueva no guarda la contraseña en ningún lado (02, 2.3).

   Aquí se usa la sesión de MetasDatos (la de metas-entrar) y las dos
   funciones del paso 1d: metas.blob_leer y metas.blob_guardar. Viajan solo
   las llaves que todavía no pasaron a filas (08, 8.1):
     METAS_ADMIN_V1        equipos, acumulativos, lecturas, inventario, convocatorias
     METAS_PLANACCION_V1   plan de acción
     METAS_CAMP_*          Campeonísimo
     meta_ge_v2            gobierno escolar

   De METAS_ADMIN_V1 NUNCA sale lo del corte 1 (lista, notas, asistencia,
   dinero, controles, bitácora, encabezado de boleta…): eso vive en filas, y
   el candado del servidor rechazaría la escritura entera (MT040). Se quita
   antes de comparar y antes de mandar; lo que la pantalla de antes muestra
   de esas secciones lo arma js/tools/mi-aula-puente.js desde las filas.

   Lo que se conserva del espejo viejo, porque fue lo que dejó de perder
   datos: tres versiones (base, aquí, allá) y la fusión dato por dato de
   js/metas-fusion-aula.js. Lo que se quita, como pide 09-INTERFAZ.md:
   «sincronizar ahora», recuperar, papelera, empezar de nuevo, imponer esta
   copia. Nada de eso se le muestra al docente: todo pasa solo.
   ===================================================================== */
(function (w) {
  'use strict';

  var LLAVES = ['METAS_ADMIN_V1', 'METAS_PLANACCION_V1', 'METAS_CAMP_V1', 'METAS_CAMP_BANK_EXTRA_V1',
    'METAS_CAMP_USED_V1', 'meta_ge_v2'];
  // Las secciones que el candado del paso 1 revisa en la raíz y en cada
  // grupo (metas._blob_bloqueado): son del corte 1 y viven en filas.
  var CORTE1 = ['lista', 'notas', 'recuperacion', 'inasisOficial', 'asistencia', 'colectas', 'controles',
    'bitacora', 'boleta', 'materias', 'logo', 'logoSec', 'edadCorte', 'obsGrado'];
  var META = 'METAS_BLOB_V1';       // { dueno, k: { h, v } }: lo último que este aparato y la base tuvieron igual
  var BASE = 'METAS_BLOB_BASE_V1';  // { k: texto } esa misma copia común, para fusionar en tres versiones
  var DUENO_VIEJO = 'METAS_DS_OWNER';

  function ls(k) { try { return w.localStorage.getItem(k); } catch (e) { return null; } }
  function ponerLs(k, v) {
    try { if (v == null) w.localStorage.removeItem(k); else w.localStorage.setItem(k, v); return true; } catch (e) { return false; }
  }
  function leerJson(k) {
    try { var o = JSON.parse(ls(k)); return o && typeof o === 'object' ? o : {}; } catch (e) { return {}; }
  }
  function hash(s) {
    if (s == null) return '0';
    var h = 5381, i = s.length;
    while (i) h = (h * 33) ^ s.charCodeAt(--i);
    return (h >>> 0).toString(36);
  }

  // ── Lo que de METAS_ADMIN_V1 puede viajar ──────────────────────────────
  // Cada grupo conserva su id, su aula (el uuid de metas.aulas que atiende),
  // grado, sección y escuela, para emparejarlo en otro aparato. La marca
  // «de prueba» de Estadísticas se guarda aparte (pruebas: ids de alumnos),
  // porque vive en la lista y la lista no viaja.
  function sinCorte1(o) {
    var r = {};
    Object.keys(o).forEach(function (k) { if (CORTE1.indexOf(k) < 0) r[k] = o[k]; });
    return r;
  }
  function filtrarAdmin(raw) {
    if (raw == null || raw === '') return raw;
    var st;
    try { st = JSON.parse(raw); } catch (e) { return null; }   // ilegible: no se manda nada
    if (!st || typeof st !== 'object') return null;
    var r = sinCorte1(st);
    delete r.gastos;   // «Gastos de mi bolsillo» vive en filas (gastos_docente)
    // También los grupos de antes sin aula nueva (mi-aula-puente.js): lo
    // suyo del blob viaja, su lista no.
    ['grupos', 'gruposSinAula'].forEach(function (cual) {
      if (!Array.isArray(st[cual])) return;
      r[cual] = st[cual].map(function (g) {
        if (!g || typeof g !== 'object') return g;
        var x = sinCorte1(g);
        if (Array.isArray(g.lista) && g.lista.length) {
          var p = g.lista.filter(function (a) { return a && a.prueba && a.id; }).map(function (a) { return a.id; }).sort();
          if (p.length) x.pruebas = p; else delete x.pruebas;
        }
        return x;
      });
    });
    return JSON.stringify(r);
  }
  function filtrar(k, raw) { return k === 'METAS_ADMIN_V1' ? filtrarAdmin(raw) : raw; }

  // Lo que llega de la base se escribe aquí SIN tocar lo del corte 1 que la
  // pantalla de antes ya tiene armado desde las filas (grupo por grupo).
  function conLoDeAqui(k, raw) {
    if (k !== 'METAS_ADMIN_V1' || raw == null) return raw;
    var nuevo, aqui;
    try { nuevo = JSON.parse(raw); } catch (e) { return raw; }
    try { aqui = JSON.parse(ls(k)); } catch (e) { aqui = null; }
    if (!aqui || !Array.isArray(aqui.grupos) || !Array.isArray(nuevo.grupos)) return raw;
    nuevo.grupos.forEach(function (g) {
      var h = aqui.grupos.filter(function (x) { return x && g && x.id === g.id; })[0];
      if (!h) return;
      CORTE1.forEach(function (s) { if (s in h) g[s] = h[s]; });
      // la marca de prueba que llegó se pone en la lista de aquí
      if (Array.isArray(g.lista)) g.lista.forEach(function (a) { if (a) a.prueba = !!(g.pruebas && g.pruebas.indexOf(a.id) >= 0); });
    });
    return JSON.stringify(nuevo);
  }

  // ── Estado ─────────────────────────────────────────────────────────────
  function datos() { return w.MetasDatos && w.MetasDatos._nube; }
  function uid() { var n = datos(); return n ? n.uid() : null; }
  function meta() { return leerJson(META); }
  function guardarMeta(m) { ponerLs(META, JSON.stringify(m)); }
  function base() { return leerJson(BASE); }
  function ponerBase(k, raw) {
    var b = base();
    if (raw == null) delete b[k]; else b[k] = raw;
    // Si no cabe, se quita esa base: sin base la fusión solo une, y unir
    // no borra nada. Una base vieja, en cambio, haría pasar lo nuevo por borrado.
    if (!ponerLs(BASE, JSON.stringify(b))) { delete b[k]; ponerLs(BASE, JSON.stringify(b)); }
  }
  function local(k) { return filtrar(k, ls(k)); }

  function repintar() {
    try {
      var activa = document.querySelector('.view.active');
      var id = activa ? activa.id : '';
      if (id === 'view-admin' && typeof w.renderAdmin === 'function') w.renderAdmin();
      if (id === 'view-plan-accion' && typeof w.paInit === 'function') w.paInit();
      if (id === 'view-campeonismo' && typeof w.initCampeonismo === 'function') w.initCampeonismo();
      if (id === 'view-gobierno' && typeof w.renderGobiernoEscolar === 'function') w.renderGobiernoEscolar();
    } catch (e) { /* repintar es cortesía: el dato ya quedó */ }
  }

  // El aparato es de una sola cuenta a la vez: si entra otra, lo de la
  // anterior se quita de aquí (sigue en la base). Lo que había sin dueño
  // conocido, o del mismo docente con el espejo viejo, se adopta y se FUSIONA
  // con la base en la primera bajada (unir no borra nada).
  function olvidarLocal() {
    LLAVES.forEach(function (k) { ponerLs(k, null); });
    ponerLs(META, null);
    ponerLs(BASE, null);
  }
  // Lo que una cuenta dejó sin subir (salió sin señal) se aparta para ella
  // y vuelve cuando ELLA entra otra vez; otra cuenta nunca lo ve ni lo sube.
  function apartadoDe(u) { return 'METAS_BLOB_APARTADO_' + u; }
  function hayPorSubir() {
    var m = meta();
    return LLAVES.some(function (k) { var x = local(k); return x != null && hash(x) !== ((m.k || {})[k] || {}).h; });
  }
  function apartar() {
    var m = meta();
    if (!m.dueno || !hayPorSubir()) return;
    var guarda = { meta: m, base: base(), k: {} };
    LLAVES.forEach(function (k) { guarda.k[k] = ls(k); });
    ponerLs(apartadoDe(m.dueno), JSON.stringify(guarda));
  }
  function reclamar(u, codigo) {
    var m = meta();
    if (m.dueno === u) return;
    var viejo = ls(DUENO_VIEJO);
    if ((m.dueno && m.dueno !== u) || (viejo && codigo && viejo !== codigo)) { apartar(); olvidarLocal(); }
    var guarda = null;
    try { guarda = JSON.parse(ls(apartadoDe(u))); } catch (e) { guarda = null; }
    if (guarda && guarda.meta) {
      LLAVES.forEach(function (k) { ponerLs(k, guarda.k[k] == null ? null : guarda.k[k]); });
      guardarMeta(guarda.meta);
      ponerLs(BASE, JSON.stringify(guarda.base || {}));
      ponerLs(apartadoDe(u), null);
      ponerLs(DUENO_VIEJO, null);
      return;
    }
    m = meta();
    m.dueno = u;
    m.k = {};
    guardarMeta(m);
    ponerLs(BASE, null);
    ponerLs(DUENO_VIEJO, null);
  }

  // ── Bajar y subir ──────────────────────────────────────────────────────
  var ocupado = null;
  var otraVez = false;

  async function bajar() {
    var n = datos();
    var u = uid();
    if (!n || !u) return false;
    var filas = await n.rpc('blob_leer', {});
    if (uid() !== u || !Array.isArray(filas)) return false;
    var m = meta();
    m.k = m.k || {};
    var cambio = false;
    filas.forEach(function (f) {
      var k = f && f.k;
      if (LLAVES.indexOf(k) < 0 || !f.valor || f.valor.raw === undefined) return;
      var allaRaw = filtrar(k, f.valor.raw);
      if (allaRaw == null) return;
      var v = Number(f.version) || 0;
      var aqui = local(k);
      var e = m.k[k] || {};
      if (hash(aqui) === hash(allaRaw)) {           // ya son iguales
        m.k[k] = { h: hash(allaRaw), v: Math.max(v, e.v || 0) };
        ponerBase(k, allaRaw);
        return;
      }
      var tocadoAqui = aqui != null && hash(aqui) !== e.h;
      if (tocadoAqui && v <= (e.v || 0)) return;    // lo de aquí es más nuevo: se sube después
      var nuevo = allaRaw;
      if (tocadoAqui && w.MetasFusion && w.MetasFusion.fusionar) {
        // Los dos cambiaron: dato por dato. Si los dos tocaron lo mismo,
        // manda lo de aquí, que es lo último que hizo el docente en este aparato.
        var f3 = null;
        try { f3 = w.MetasFusion.fusionar(base()[k] == null ? null : base()[k], aqui, allaRaw, true); } catch (x) { f3 = null; }
        if (f3 == null) { try { f3 = w.MetasFusion.fusionar(null, aqui, allaRaw, true); } catch (x) { f3 = null; } }
        if (f3 == null) return;                     // sin fusión posible no se pisa nada
        nuevo = f3;
      }
      ponerLs(k, conLoDeAqui(k, nuevo));
      // La base es lo de allá: si quedó algo de aquí fusionado, se nota
      // como cambio y sube en la próxima vuelta.
      m.k[k] = { h: hash(allaRaw), v: v };
      ponerBase(k, allaRaw);
      cambio = true;
    });
    guardarMeta(m);
    if (cambio) repintar();
    return true;
  }

  async function subir() {
    var n = datos();
    var u = uid();
    if (!n || !u) return true;
    var m = meta();
    m.k = m.k || {};
    var entradas = [];
    LLAVES.forEach(function (k) {
      var aqui = local(k);
      if (aqui == null) return;
      var e = m.k[k] || {};
      if (hash(aqui) === e.h) return;
      entradas.push({ k: k, raw: aqui, version: Math.max(Date.now(), (e.v || 0) + 1) });
    });
    if (!entradas.length) return true;
    var aparato = typeof n.aparato === 'function' ? n.aparato() : '';
    var escritas = await n.rpc('blob_guardar', {
      p_entradas: entradas.map(function (x) { return { k: x.k, valor: { raw: x.raw }, version: x.version, dispositivo: aparato }; }),
      p_forzar: false,
    });
    if (uid() !== u) return true;
    m = meta();
    m.k = m.k || {};
    // La base solo escribe lo que es más nuevo que lo suyo: si escribió
    // menos, otro aparato se adelantó y hay que bajar y fusionar.
    if (Number(escritas) !== entradas.length) return false;
    entradas.forEach(function (x) {
      m.k[x.k] = { h: hash(x.raw), v: x.version };
      ponerBase(x.k, x.raw);
    });
    guardarMeta(m);
    return true;
  }

  // Una vuelta: bajar, y subir lo de aquí. Si la base no aceptó todo
  // (otro aparato se adelantó), otra vuelta, como mucho tres.
  function vuelta() {
    if (ocupado) { otraVez = true; return ocupado; }
    ocupado = (async function () {
      try {
        for (var i = 0; i < 3; i++) {
          if (!uid()) break;
          await bajar();
          if (await subir()) break;
        }
      } catch (e) {
        // Sin señal o la sesión venció: se reintenta solo más tarde. El
        // docente no ve nada (09-INTERFAZ.md); lo suyo sigue en el aparato.
      }
    })();
    return ocupado.then(function () {
      ocupado = null;
      if (otraVez) { otraVez = false; return vuelta(); }
    });
  }

  var reloj = null;
  function pronto() {
    clearTimeout(reloj);
    reloj = setTimeout(vuelta, 1500);
  }

  // ── Arranque ───────────────────────────────────────────────────────────
  // Se sube lo que cambie al guardar Mi aula de antes (adStateSave) y, para
  // las demás herramientas, con una revisión tranquila cada 10 s.
  var huellas = {};
  function revisar() {
    if (!uid()) return;
    var m = meta();
    var hay = LLAVES.some(function (k) {
      var h = hash(ls(k));
      var cambio = huellas[k] !== undefined && huellas[k] !== h;
      huellas[k] = h;
      return cambio || hash(local(k)) !== ((m.k || {})[k] || {}).h;
    });
    if (hay) pronto();
  }

  var enganchado = false;
  function enganchar() {
    if (enganchado) return;
    enganchado = true;
    if (typeof w.adStateSave === 'function') {
      var original = w.adStateSave;
      w.adStateSave = function (st) {
        var r = original.apply(this, arguments);
        pronto();
        return r;
      };
    }
    w.addEventListener('online', function () { if (uid()) vuelta(); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible' && uid()) vuelta();
    });
    setInterval(revisar, 10000);
  }

  var MetasBlob = {
    LLAVES: LLAVES.slice(),
    CORTE1: CORTE1.slice(),
    filtrarAdmin: filtrarAdmin,
    // La sesión nueva ya está: de quién es este aparato, y la primera vuelta.
    alEntrar: function (codigo) {
      var u = uid();
      if (!u) return Promise.resolve();
      reclamar(u, codigo || '');
      enganchar();
      return vuelta();
    },
    // Al cerrar sesión: lo pendiente sube (con señal) y se quita de aquí.
    // Lo que no alcanzó a subir se aparta para esta cuenta (ver apartar).
    salir: async function () {
      if (uid()) {
        await Promise.race([vuelta(), new Promise(function (ok) { setTimeout(ok, 10000); })]);
      }
      apartar();
      olvidarLocal();
      ponerLs(DUENO_VIEJO, null);
    },
    ahora: vuelta,
  };
  w.MetasBlob = MetasBlob;
})(window);
