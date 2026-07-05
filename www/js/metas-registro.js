/* =====================================================================
   M.E.T.A.S — metas-registro.js
   Capa mínima de registro local de evidencia de aprendizaje.

   - Guarda eventos (sesión, sección completada, evaluación calificada,
     prueba operativa) en localStorage (METAS_REGISTRO_V1). 100% offline.
   - NO modifica la lógica de las misiones: envuelve las funciones
     estándar de la plantilla (fin, gradeEval, gradeEvalOp) si existen.
   - El panel del docente (registro.html) lee estos eventos, los filtra
     y los exporta a CSV o resumen de WhatsApp.

   Uso en cada misión (después de los scripts propios de la misión):
     <script src="../../js/metas-registro.js"></script>
   ===================================================================== */
(function () {
  'use strict';

  var CLAVE = 'METAS_REGISTRO_V1';
  var CLAVE_DISP = 'METAS_DISPOSITIVO';
  var MAX_EVENTOS = 4000; // tope de seguridad para no llenar localStorage

  // ---------- almacenamiento ----------
  function leer() {
    try { var a = JSON.parse(localStorage.getItem(CLAVE)); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  function escribir(eventos) {
    try { localStorage.setItem(CLAVE, JSON.stringify(eventos)); return true; }
    catch (e) {
      // localStorage lleno: descartar los 500 más antiguos y reintentar
      try { localStorage.setItem(CLAVE, JSON.stringify(eventos.slice(500))); return true; }
      catch (e2) { return false; }
    }
  }
  function borrar() { try { localStorage.removeItem(CLAVE); } catch (e) {} }

  // Identificador anónimo del dispositivo (se crea una sola vez)
  function idDispositivo() {
    var id = null;
    try { id = localStorage.getItem(CLAVE_DISP); } catch (e) {}
    if (!id) {
      id = 'D-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      try { localStorage.setItem(CLAVE_DISP, id); } catch (e) {}
    }
    return id;
  }

  // ---------- contexto de la página ----------
  function idMision() {
    var m = (location.pathname || '').match(/misiones\/([^\/]+)\//);
    return m ? decodeURIComponent(m[1]) : null;
  }
  function alumnoActual() {
    var inp = document.querySelector('.diploma-input');
    var v = inp && inp.value ? inp.value.trim() : '';
    return v.slice(0, 60);
  }
  function xpActual() {
    var el = document.getElementById('xpPts');
    if (!el) return null;
    var m = (el.textContent || '').match(/\d+/);
    return m ? parseInt(m[0], 10) : null;
  }

  // Tiempo activo: cuenta solo mientras la pestaña está visible
  var sesId = 'S-' + Math.random().toString(36).slice(2, 8);
  var segActivos = 0;
  setInterval(function () { if (!document.hidden) segActivos += 15; }, 15000);
  function minActivos() { return Math.round(segActivos / 6) / 10; }

  // ---------- registro de eventos ----------
  function registrar(tipo, datos) {
    var ev = {
      t: new Date().toISOString(),
      tipo: tipo,
      mision: idMision(),
      alumno: alumnoActual(),
      xp: xpActual(),
      min: minActivos(),
      ses: sesId,
      disp: idDispositivo()
    };
    if (datos) { for (var k in datos) { if (Object.prototype.hasOwnProperty.call(datos, k)) ev[k] = datos[k]; } }
    var eventos = leer();
    eventos.push(ev);
    if (eventos.length > MAX_EVENTOS) eventos = eventos.slice(eventos.length - MAX_EVENTOS);
    escribir(eventos);
    return ev;
  }

  // Al ocultar/cerrar la página, actualiza la duración de la sesión
  function cerrarSesion() {
    var eventos = leer();
    for (var i = eventos.length - 1; i >= 0; i--) {
      if (eventos[i].ses === sesId && eventos[i].tipo === 'sesion') {
        if (eventos[i].min === minActivos()) return;
        eventos[i].min = minActivos();
        escribir(eventos);
        return;
      }
    }
  }
  window.addEventListener('pagehide', cerrarSesion);
  document.addEventListener('visibilitychange', function () { if (document.hidden) cerrarSesion(); });

  // ---------- ganchos sobre la plantilla de misiones ----------
  // La nota se lee del panel de resultado que pinta la propia misión:
  // "Resultado: 85/100 pts"
  function notaDePanel(idPanel) {
    var el = document.getElementById(idPanel);
    if (!el) return null;
    var m = (el.textContent || '').match(/Resultado:\s*(\d+)\s*\/\s*(\d+)/);
    return m ? { nota: parseInt(m[1], 10), base: parseInt(m[2], 10) } : null;
  }

  function instalarGanchos() {
    // Sección completada por primera vez (fin marca el botón con .done)
    if (typeof window.fin === 'function') {
      var finOrig = window.fin;
      window.fin = function (id) {
        var antes = document.querySelector('[data-s="' + id + '"]');
        var yaHecha = !!(antes && antes.classList.contains('done'));
        var r = finOrig.apply(this, arguments);
        if (!yaHecha) {
          var despues = document.querySelector('[data-s="' + id + '"]');
          if (despues && despues.classList.contains('done')) registrar('seccion', { seccion: id });
        }
        return r;
      };
    }
    // Evaluación conceptual calificada
    if (typeof window.gradeEval === 'function') {
      var geOrig = window.gradeEval;
      window.gradeEval = function () {
        var r = geOrig.apply(this, arguments);
        if (window._evalGradeData) {
          var res = notaDePanel('evalAutoResult');
          if (res) registrar('evaluacion', { forma: window._currentEvalForm || null, nota: res.nota, base: res.base });
        }
        return r;
      };
    }
    // Prueba operativa calificada
    if (typeof window.gradeEvalOp === 'function') {
      var goOrig = window.gradeEvalOp;
      window.gradeEvalOp = function () {
        var r = goOrig.apply(this, arguments);
        if (window._evalOpData) {
          var res = notaDePanel('evalOpAutoResult');
          if (res) registrar('prueba_operativa', { forma: window._currentEvalOpForm || null, nota: res.nota, base: res.base });
        }
        return r;
      };
    }
  }

  // ---------- exportación ----------
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  function fechaLocal(iso) {
    var f = new Date(iso);
    if (isNaN(f)) return { fecha: iso || '', hora: '' };
    return {
      fecha: f.getFullYear() + '-' + pad2(f.getMonth() + 1) + '-' + pad2(f.getDate()),
      hora: pad2(f.getHours()) + ':' + pad2(f.getMinutes())
    };
  }
  function celda(v) {
    if (v === null || v === undefined) return '';
    v = String(v);
    return /[",\r\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  function csv(eventos) {
    eventos = eventos || leer();
    var filas = ['fecha,hora,mision,alumno,tipo,seccion,forma,nota,base,xp,min,sesion,dispositivo'];
    eventos.forEach(function (ev) {
      var fl = fechaLocal(ev.t);
      filas.push([fl.fecha, fl.hora, ev.mision, ev.alumno, ev.tipo, ev.seccion, ev.forma,
        ev.nota, ev.base, ev.xp, ev.min, ev.ses, ev.disp].map(celda).join(','));
    });
    return '﻿' + filas.join('\r\n'); // BOM para que Excel abra bien las tildes
  }

  function exportarCSV() {
    var contenido = csv();
    var hoy = fechaLocal(new Date().toISOString()).fecha;
    var nombre = 'metas-registro-' + hoy + '.csv';
    var cap = window.Capacitor;
    if (cap && cap.isNativePlatform && cap.isNativePlatform() && cap.Plugins && cap.Plugins.Filesystem && cap.Plugins.Share) {
      return cap.Plugins.Filesystem.writeFile({ path: nombre, data: contenido, directory: 'CACHE', encoding: 'utf8' })
        .then(function (res) { return cap.Plugins.Share.share({ url: res.uri, dialogTitle: 'Exportar registro M.E.T.A.S' }); })
        .then(function () { return nombre; });
    }
    var blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = nombre;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    return Promise.resolve(nombre);
  }

  // ---------- resumen (para el panel docente y WhatsApp) ----------
  function resumen(eventos) {
    eventos = eventos || leer();
    var alumnos = {}, misiones = {}, evals = [], ops = [], porSesion = {};
    var minT = null, maxT = null;
    eventos.forEach(function (ev) {
      if (ev.alumno) alumnos[ev.alumno] = true;
      if (ev.mision) misiones[ev.mision] = true;
      if (ev.tipo === 'evaluacion' && typeof ev.nota === 'number') evals.push(ev.nota);
      if (ev.tipo === 'prueba_operativa' && typeof ev.nota === 'number') ops.push(ev.nota);
      if (ev.ses && typeof ev.min === 'number') porSesion[ev.ses] = Math.max(porSesion[ev.ses] || 0, ev.min);
      if (ev.t) { if (!minT || ev.t < minT) minT = ev.t; if (!maxT || ev.t > maxT) maxT = ev.t; }
    });
    var prom = function (a) { return a.length ? Math.round(a.reduce(function (s, n) { return s + n; }, 0) / a.length) : null; };
    var minutos = 0; for (var s in porSesion) minutos += porSesion[s];
    return {
      eventos: eventos.length,
      alumnos: Object.keys(alumnos).sort(),
      misiones: Object.keys(misiones).sort(),
      evaluaciones: evals.length, promedioEval: prom(evals),
      pruebasOperativas: ops.length, promedioOp: prom(ops),
      minutos: Math.round(minutos),
      desde: minT ? fechaLocal(minT).fecha : null,
      hasta: maxT ? fechaLocal(maxT).fecha : null
    };
  }

  // ---------- API pública ----------
  window.METAS = {
    version: 1,
    registrar: registrar,
    eventos: leer,
    csv: csv,
    exportarCSV: exportarCSV,
    resumen: resumen,
    borrar: borrar,
    dispositivo: idDispositivo
  };

  function iniciar() {
    instalarGanchos();
    if (idMision()) registrar('sesion', {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
