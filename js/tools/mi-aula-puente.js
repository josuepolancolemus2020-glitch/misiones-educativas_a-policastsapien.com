/* =====================================================================
   M.E.T.A.S — js/tools/mi-aula-puente.js · la pantalla de antes, con filas
   ---------------------------------------------------------------------
   Equipos, Acumulativos, Estadísticas, Lectura, Gastos de mi bolsillo e
   Inventario todavía abren la pantalla de antes (registros-admin.js) hasta
   su corte (08, 8.2 y 8.3). Esa pantalla lee el aula de METAS_ADMIN_V1 en
   este aparato. Con la sesión nueva, este puente:

     1. le ARMA ese aula desde las filas (la misma lista, notas, asistencia
        y colectas que ve Mi aula), un grupo por cada aula de metas.aulas,
        con lo suyo del blob (equipos, acumulativos, lecturas…) al lado. Lo
        arma js/tools/mi-aula-papel.js, igual que para lo que se imprime;
     2. manda de vuelta a Mi aula lo que ya vive en filas: tocar «Alumnos»,
        «Economía», «Asistencia», «Controles», «Notas SACE», «Comunicados» u
        «Otro grupo» en la pantalla de antes abre esa sección de Mi aula
        (ahí está la de verdad; lo que se escribiera allá no llegaría a la base);
     3. guarda en filas los dos datos del corte 1 que esas pestañas sí
        cambian: la observación del grado (Estadísticas) va a
        metas.aulas.observacion_grado, y «Gastos de mi bolsillo» a
        metas.gastos_docente y metas.reembolsos. El candado del servidor no
        deja que los gastos vuelvan al blob (MT040: son del corte 1).

   El blob (lo de los puntos 1 y 3 que no es del corte 1) viaja solo, por
   sesión: js/metas-blob-sesion.js. Nada cambia en cómo se ven las pantallas.
   ===================================================================== */
(function (w) {
  'use strict';

  var LLAVE = 'METAS_ADMIN_V1';
  // Pestaña de la pantalla de antes → sección de Mi aula que la reemplaza.
  var A_MI_AULA = { lista: 'alumnos', eco: 'economia', asis: 'asistencia', ctrl: 'controles', sace: 'notas',
    com: 'comunicados' };
  var api = null;

  function hayCuenta() {
    return !!(api && w.MetasDatos && w.MetasDatos._nube && w.MetasDatos._nube.uid());
  }
  function leerSt() {
    var st = null;
    try { st = JSON.parse(w.localStorage.getItem(LLAVE)); } catch (e) { st = null; }
    if (!st || typeof st !== 'object' || st.v !== 2) {
      // Un aula de antes del formato 2 (todo suelto en la raíz) solo trae
      // cosas del corte 1: se queda lo que no es de ese corte.
      var r = { v: 2, grupos: [] };
      if (st && typeof st === 'object') ['inventario', 'invActas'].forEach(function (k) { if (st[k]) r[k] = st[k]; });
      st = r;
    }
    if (!Array.isArray(st.grupos)) st.grupos = [];
    return st;
  }
  function norm(t) {
    return String(t == null ? '' : t).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim().toUpperCase();
  }
  // ¿Este grupo viejo del blob es esta aula? Grado y sección, y la escuela
  // si los dos la tienen. Solo se adopta si hay UNO que calce.
  function mismoGrupo(g, aula) {
    var gr = String(g.grado == null ? '' : g.grado).replace(/\D/g, '');
    var se = (String(g.seccion == null ? '' : g.seccion).match(/[0-9A-Za-z]+\s*$/) || [''])[0].trim().toUpperCase();
    if (gr !== String(aula.grado) || se !== String(aula.seccion).toUpperCase()) return false;
    return !g.escuela || !aula.escuela || norm(g.escuela) === norm(aula.escuela);
  }
  // Junta en g lo que el grupo viejo trae del blob (nada del corte 1): lo
  // que g no tiene se toma entero; en las listas se suman los elementos que
  // g no tenía (por id, o por contenido si no traen id). Nunca se borra nada.
  var PROPIOS = ['id', 'aula', 'grado', 'seccion', 'escuela', 'pruebas'];
  function juntarGrupo(g, viejo) {
    var corte1 = (w.MetasBlob && w.MetasBlob.CORTE1) || [];
    Object.keys(viejo).forEach(function (k) {
      if (PROPIOS.indexOf(k) >= 0 || corte1.indexOf(k) >= 0) return;
      var a = g[k], b = viejo[k];
      var vacio = a == null || (Array.isArray(a) && !a.length) || (typeof a === 'object' && !Array.isArray(a) && !Object.keys(a).length);
      if (vacio) { g[k] = b; return; }
      if (Array.isArray(a) && Array.isArray(b)) {
        var hay = {};
        a.forEach(function (x) { hay[x && x.id != null ? 'id:' + x.id : JSON.stringify(x)] = 1; });
        b.forEach(function (x) { if (!hay[x && x.id != null ? 'id:' + x.id : JSON.stringify(x)]) a.push(x); });
      }
    });
    if (Array.isArray(viejo.pruebas) && !Array.isArray(g.pruebas)) g.pruebas = viejo.pruebas;
  }
  function porGrupo(a, b) {
    return (a.grado - b.grado) || String(a.seccion).localeCompare(String(b.seccion)) || String(a.escuela).localeCompare(String(b.escuela));
  }

  // ── 1. Armar el aula de la pantalla de antes ───────────────────────────
  function hidratar(aulaActiva) {
    if (!hayCuenta() || !w.metasMiAulaPapel) return false;
    var aulas = api.lista('aulas').sort(porGrupo);
    if (!aulas.length) return false;      // sin aula: Mi aula pide crearla primero
    var st = leerSt();
    var viejos = st.grupos.concat(Array.isArray(st.gruposSinAula) ? st.gruposSinAula : []);
    var usados = {};
    var grupos = aulas.map(function (aula) {
      var g = viejos.filter(function (x) { return x && !usados[x.id] && x.aula === aula.id; })[0]
        || viejos.filter(function (x) { return x && !usados[x.id] && x.id === aula.id; })[0];
      // Solo si no hay duda: el grupo de antes calza con ESTA aula y con
      // ninguna otra (sin escuela, un «6º-1» puede ser de dos escuelas).
      var calzan = viejos.filter(function (x) {
        return x && x !== g && !usados[x.id] && !x.aula && mismoGrupo(x, aula)
          && aulas.filter(function (otra) { return mismoGrupo(x, otra); }).length === 1;
      });
      if (calzan.length === 1) {
        // El grupo de antes de este mismo grado y sección (con sus equipos,
        // acumulativos y lecturas) pasa a ser el de esta aula. Si el aula ya
        // tenía grupo (se abrió antes de que llegara el blob), se juntan.
        if (g) juntarGrupo(g, calzan[0]); else g = calzan[0];
        usados[calzan[0].id] = 1;
      }
      g = g || { id: aula.id };
      usados[g.id] = 1;
      var filas = w.metasMiAulaPapel.grupo(api, aula);
      var marcadas = Array.isArray(g.pruebas) ? g.pruebas : [];
      g.aula = aula.id;
      ['escuela', 'grado', 'seccion', 'boleta', 'materias', 'logo', 'logoSec', 'notas', 'recuperacion',
        'inasisOficial', 'asistencia', 'colectas', 'controles', 'bitacora'].forEach(function (k) { g[k] = filas[k]; });
      g.lista = filas.lista.map(function (a) { if (marcadas.indexOf(a.id) >= 0) a.prueba = true; return a; });
      if (aula.observacion_grado) g.obsGrado = aula.observacion_grado; else delete g.obsGrado;
      obsBase[aula.id] = aula.observacion_grado || null;
      if (aula.edad_corte) g.edadCorte = aula.edad_corte; else delete g.edadCorte;
      return g;
    });
    // Lo que no es de ningún aula nueva (un grupo de antes sin pareja) se
    // guarda aparte, sin mostrarse: lo suyo del blob no se pierde.
    st.gruposSinAula = viejos.filter(function (x) { return x && !usados[x.id]; });
    if (!st.gruposSinAula.length) delete st.gruposSinAula;
    st.grupos = grupos;
    var activo = grupos.filter(function (g) { return g.aula === aulaActiva; })[0]
      || grupos.filter(function (g) { return g.id === st.activo; })[0] || grupos[0];
    st.activo = activo.id;
    try {
      w.localStorage.setItem(LLAVE, JSON.stringify(st));
      w.localStorage.setItem('METAS_ADMIN_GRUPO_ACTIVO', activo.id);
    } catch (e) { return false; }
    try { /* global _adGrupoActivoId */ _adGrupoActivoId = activo.id; } catch (e) { /* sin la pantalla de antes */ }
    return true;
  }

  // ── 3a. La observación del grado (Estadísticas) va a metas.aulas ───────
  // Solo lo que cambió AQUÍ desde que se armó el aula: si otro aparato la
  // cambió después, guardar otra cosa aquí no la pisa con la de antes.
  var obsReloj = {};
  var obsBase = {};
  function revisarObs(st) {
    if (!hayCuenta() || !st || !Array.isArray(st.grupos)) return;
    st.grupos.forEach(function (g) {
      if (!g || !g.aula) return;
      var aula = api.lista('aulas', { id: g.aula })[0];
      if (!aula) return;
      var nueva = String(g.obsGrado || '').slice(0, 500) || null;
      if (!(g.aula in obsBase) || nueva === obsBase[g.aula] || nueva === (aula.observacion_grado || null)) return;
      obsBase[g.aula] = nueva;
      // Se escribe mientras el docente teclea: una sola edición cuando para.
      clearTimeout(obsReloj[g.aula]);
      obsReloj[g.aula] = setTimeout(function () {
        try { api.editar('aulas', g.aula, { observacion_grado: nueva }); } catch (e) { /* lo valida la pantalla */ }
      }, 1200);
    });
  }

  // ── 3b. «Gastos de mi bolsillo» en filas, con la forma de siempre ─────
  // La pantalla de antes lee y escribe una lista { id, fecha, cat, concepto,
  // monto, cobrarA, factura, escuela, estado, fechaCobro }. Aquí se arma de
  // gastos_docente y sus reembolsos, y cada cambio se vuelve la operación de
  // dinero que le toca. «Me lo pagaron» = un reembolso por lo que faltaba;
  // «sigue pendiente» = se anulan los reembolsos, con su motivo.
  function montos() { return w.MetasDatos.montos; }
  function hoy() {
    var f = new Date();
    return f.getFullYear() + '-' + String(f.getMonth() + 1).padStart(2, '0') + '-' + String(f.getDate()).padStart(2, '0');
  }
  function reembolsosDe(id) {
    return api.lista('reembolsos', { gasto_id: id }).filter(function (r) { return r.monto != null; })
      .sort(function (a, b) { return String(a.fecha).localeCompare(String(b.fecha)); });
  }
  function gastosDesdeFilas() {
    var mt = montos();
    return api.lista('gastos_docente').filter(function (g) { return g.monto != null; })
      .sort(function (a, b) {
        return String(a.fecha).localeCompare(String(b.fecha)) || String(a.created_at || '9').localeCompare(String(b.created_at || '9'));
      })
      .map(function (g) {
        var rs = reembolsosDe(g.id);
        var devuelto = mt.sumar(rs.map(function (r) { return r.monto; }));
        var cobrado = rs.length > 0 && mt.comparar(devuelto, g.monto) >= 0;
        var x = {
          id: g.id, fecha: g.fecha, cat: g.tipo || 'otro', concepto: g.concepto, monto: g.monto,
          cobrarA: g.cobrar_a, factura: g.tiene_recibo ? 1 : 0, escuela: g.escuela || '',
          estado: cobrado ? 'cobrado' : 'pendiente',
        };
        if (cobrado) x.fechaCobro = rs[rs.length - 1].fecha;
        return x;
      });
  }
  function montoTexto(n) {
    var r = montos().leer(String(n));
    return r.ok ? r.valor : null;
  }
  function gastosAFilas(arr) {
    var antes = gastosDesdeFilas();
    var porId = {};
    antes.forEach(function (g) { porId[g.id] = g; });
    var siguen = {};
    (Array.isArray(arr) ? arr : []).forEach(function (x) {
      if (!x) return;
      var prev = porId[x.id];
      if (!prev) {
        var m = montoTexto(x.monto);
        if (!m) return;
        api.gastoDocente.crear({
          fecha: x.fecha || hoy(), tipo: x.cat || 'otro', concepto: String(x.concepto || '').slice(0, 160),
          cobrar_a: x.cobrarA || 'Tesorería', monto: m, tiene_recibo: !!x.factura, escuela: x.escuela || null,
        });
        return;
      }
      siguen[x.id] = 1;
      if (prev.estado !== 'cobrado' && x.estado === 'cobrado') {
        var falta = montos().restar(prev.monto, montos().sumar(reembolsosDe(prev.id).map(function (r) { return r.monto; })));
        if (montos().comparar(falta, '0.00') > 0) {
          api.reembolso.crear({ gasto_id: prev.id, monto: falta, fecha: x.fechaCobro || hoy(), quien_pago: prev.cobrarA || null });
        }
      } else if (prev.estado === 'cobrado' && x.estado !== 'cobrado') {
        reembolsosDe(prev.id).forEach(function (r) { api.reembolso.anular(r.id, 'sigue pendiente'); });
      }
    });
    antes.forEach(function (g) {
      if (siguen[g.id]) return;
      // Quitar un gasto que ya tenía dinero devuelto: primero se anula eso.
      reembolsosDe(g.id).forEach(function (r) { api.reembolso.anular(r.id, 'gasto quitado del registro'); });
      api.gastoDocente.anular(g.id, 'quitado del registro');
    });
  }

  // ── Enganches con la pantalla de antes (sin tocar su código) ───────────
  function enganchar() {
    var origCargar = w.adGastosLoad;
    var origGuardar = w.adGastosSave;
    if (typeof origCargar === 'function') {
      w.adGastosLoad = function () { return hayCuenta() ? gastosDesdeFilas() : origCargar.apply(this, arguments); };
    }
    if (typeof origGuardar === 'function') {
      w.adGastosSave = function (arr) {
        if (!hayCuenta()) return origGuardar.apply(this, arguments);
        try { gastosAFilas(arr); } catch (e) { if (typeof w.toast === 'function') w.toast(e && e.paraElDocente ? e.message : 'Eso no se pudo anotar. Revisa lo que escribiste.'); }
      };
    }
    if (typeof w.adStateSave === 'function') {
      var origSave = w.adStateSave;
      w.adStateSave = function (st) {
        var r = origSave.apply(this, arguments);
        if (hayCuenta()) revisarObs(st);
        return r;
      };
    }
    if (typeof w.switchView === 'function') {
      var origVer = w.switchView;
      w.switchView = function (id) {
        if (id === 'view-admin' && hayCuenta()) hidratar(null);
        return origVer.apply(this, arguments);
      };
    }
    // Lo que vive en filas se abre en Mi aula. En la fase de captura, antes
    // de que la pantalla de antes lo atienda.
    document.addEventListener('click', function (ev) {
      if (!hayCuenta() || !ev.target.closest || !w.metasMiAula) return;
      var vista = document.getElementById('view-admin');
      if (!vista || !vista.classList.contains('active')) return;
      var tab = ev.target.closest('#admin-content [data-adtab]');
      var seccion = tab && A_MI_AULA[tab.getAttribute('data-adtab')];
      if (!seccion && ev.target.closest('#ad-gr-add')) seccion = 'otro-grupo';
      if (!seccion && ev.target.closest('#ad-gsto-volver, #ad-inv-volver')) seccion = 'economia';
      if (seccion) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        w.metasMiAula.irA(seccion);
        return;
      }
      // Cambiar de grupo arriba: Mi aula queda en ese mismo grupo.
      var chip = ev.target.closest('#admin-content [data-gid]');
      if (chip) {
        var st = leerSt();
        var g = st.grupos.filter(function (x) { return x.id === chip.getAttribute('data-gid'); })[0];
        if (g && g.aula) w.metasMiAula.elegirAula(g.aula);
      }
    }, true);
  }

  w.metasMiAulaPuente = {
    // Lo llama Mi aula al abrir una pestaña de antes: el aula de las filas,
    // con ese grupo activo.
    preparar: function (aulaId) { return hidratar(aulaId); },
    activo: hayCuenta,
    _gastosDesdeFilas: function () { return gastosDesdeFilas(); },
  };

  function arrancar() {
    enganchar();
    if (!w.MetasDatos || typeof w.MetasDatos.iniciar !== 'function') return;
    w.MetasDatos.iniciar().then(function (a) {
      api = a;
      if (!a) return;
      // Lo que cambie en las filas (otro aparato, la cola) se ve también en
      // la pantalla de antes si está abierta.
      var reloj = null;
      a.escuchar(function () {
        var v = document.getElementById('view-admin');
        if (!v || !v.classList.contains('active') || !hayCuenta()) return;
        clearTimeout(reloj);
        reloj = setTimeout(function () {
          if (hidratar(null) && typeof w.renderAdmin === 'function') w.renderAdmin();
        }, 400);
      });
      var v = document.getElementById('view-admin');
      if (v && v.classList.contains('active') && hidratar(null) && typeof w.renderAdmin === 'function') w.renderAdmin();
    }).catch(function () { /* sin MetasDatos la pantalla de antes sigue como estaba */ });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})(window);
