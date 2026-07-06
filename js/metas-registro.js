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
  var CLAVE_ALUMNO = 'METAS_ALUMNO_V1';
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

  // Identificación "lite" del estudiante (sin contraseña, sin servidor):
  // { nombre, grado, docente } — viaja pegada a cada evento
  function identificacion() {
    try { var o = JSON.parse(localStorage.getItem(CLAVE_ALUMNO)); return (o && typeof o === 'object') ? o : null; }
    catch (e) { return null; }
  }
  function guardarIdentificacion(datos) {
    try { localStorage.setItem(CLAVE_ALUMNO, JSON.stringify(datos)); } catch (e) {}
  }

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
    var id = identificacion();
    if (id && id.nombre) return String(id.nombre).slice(0, 60);
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
    var id = identificacion() || {};
    var ev = {
      id: 'E-' + Math.random().toString(36).slice(2, 10),
      t: new Date().toISOString(),
      tipo: tipo,
      mision: idMision(),
      alumno: alumnoActual(),
      grado: id.grado || '',
      docente: id.docente || '',
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
    programarSync();
    return ev;
  }

  // Al ocultar/cerrar la página, actualiza la duración de la sesión
  // e intenta un último envío (la sesión actual recién ahí es elegible)
  function cerrarSesion() {
    var eventos = leer();
    for (var i = eventos.length - 1; i >= 0; i--) {
      if (eventos[i].ses === sesId && eventos[i].tipo === 'sesion') {
        if (eventos[i].min !== minActivos()) {
          eventos[i].min = minActivos();
          escribir(eventos);
        }
        break;
      }
    }
    sincronizar({ keepalive: true, incluirSesionActual: true });
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
    var filas = ['fecha,hora,mision,alumno,grado,docente,tipo,seccion,forma,nota,base,xp,min,sesion,dispositivo'];
    eventos.forEach(function (ev) {
      var fl = fechaLocal(ev.t);
      filas.push([fl.fecha, fl.hora, ev.mision, ev.alumno, ev.grado, ev.docente, ev.tipo, ev.seccion, ev.forma,
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

  // ---------- sincronización opcional a Google Sheets (fase 3) ----------
  // Pega aquí la URL del despliegue del Apps Script (ver FASE3-GOOGLE-SHEETS.md).
  // Mientras esté vacía, la app funciona igual pero solo con registro local.
  var URL_SINCRONIZACION = '';
  function urlSync() {
    try { return localStorage.getItem('METAS_SYNC_URL') || URL_SINCRONIZACION; }
    catch (e) { return URL_SINCRONIZACION; }
  }
  // La sesión actual no se envía hasta que la página se oculta,
  // para que llegue con sus minutos de trabajo y no con 0.
  function pendientes(incluirSesionActual) {
    return leer().filter(function (ev) {
      if (ev.env) return false;
      if (!incluirSesionActual && ev.tipo === 'sesion' && ev.ses === sesId) return false;
      return true;
    });
  }
  var syncEnCurso = false;
  function sincronizar(opciones) {
    opciones = opciones || {};
    var url = urlSync();
    var quedan = function () { return { enviados: 0, pendientes: pendientes(true).length }; };
    if (!url || typeof fetch !== 'function' || syncEnCurso) return Promise.resolve(quedan());
    if (navigator.onLine === false) return Promise.resolve(quedan());
    var lote = pendientes(opciones.incluirSesionActual).slice(0, 200);
    if (!lote.length) return Promise.resolve(quedan());
    syncEnCurso = true;
    var conf = { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ eventos: lote }) };
    if (opciones.keepalive) conf.keepalive = true;
    return fetch(url, conf)
      .then(function (r) { return r.json(); })
      .then(function (r) {
        if (!r || r.ok !== true) throw new Error('respuesta no ok');
        var ids = {};
        lote.forEach(function (ev) { ids[ev.id] = true; });
        var eventos = leer();
        eventos.forEach(function (ev) { if (ids[ev.id]) ev.env = 1; });
        escribir(eventos);
        syncEnCurso = false;
        // si quedaron más lotes, seguir enviando (salvo en el cierre de página)
        if (!opciones.keepalive && pendientes(opciones.incluirSesionActual).length) {
          return sincronizar(opciones).then(function (r2) {
            return { enviados: lote.length + r2.enviados, pendientes: r2.pendientes };
          });
        }
        return { enviados: lote.length, pendientes: pendientes(true).length };
      })
      .catch(function () { syncEnCurso = false; return quedan(); });
  }
  var syncTimer = null;
  function programarSync() {
    if (!urlSync()) return;
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(function () { syncTimer = null; sincronizar(); }, 8000);
  }

  // ---------- reporte del estudiante (WhatsApp al maestro) ----------
  function tituloMision() {
    var t = (document.title || '').replace(/^[^\wÁÉÍÓÚÑáéíóúñ]+/, '').trim();
    return t || idMision() || 'Misión';
  }
  function textoReporte() {
    var id = identificacion() || {};
    var nombre = id.nombre || alumnoActual() || 'Estudiante';
    var mid = idMision();
    var evs = leer().filter(function (e) {
      return e.mision === mid && (!e.alumno || e.alumno === nombre);
    });
    // secciones completadas: lo que muestra la propia misión en su navegación
    var tabs = document.querySelectorAll('[data-s]');
    var hechas = 0;
    for (var i = 0; i < tabs.length; i++) { if (tabs[i].classList.contains('done')) hechas++; }
    // tiempo: suma del máximo por sesión (la sesión actual usa el contador vivo)
    var porSes = {};
    evs.forEach(function (e) { if (e.ses && typeof e.min === 'number') porSes[e.ses] = Math.max(porSes[e.ses] || 0, e.min); });
    porSes[sesId] = Math.max(porSes[sesId] || 0, minActivos());
    var minutos = 0; for (var s in porSes) minutos += porSes[s];
    // última nota e intentos por tipo de prueba
    var linea = function (tipo, etiqueta) {
      var lista = evs.filter(function (e) { return e.tipo === tipo && typeof e.nota === 'number'; });
      if (!lista.length) return etiqueta + ': aún sin calificar';
      var u = lista[lista.length - 1];
      var fl = fechaLocal(u.t);
      return etiqueta + ': *' + u.nota + '/' + (u.base || 100) + '*' +
        (u.forma ? ' · Forma ' + u.forma : '') +
        ' · ' + lista.length + ' intento' + (lista.length === 1 ? '' : 's') +
        ' · ' + fl.fecha + ' ' + fl.hora;
    };
    var hoy = fechaLocal(new Date().toISOString());
    return '📤 *REPORTE DE RESULTADOS · M.E.T.A.S*\n\n' +
      '👤 Alumno: ' + nombre + '\n' +
      (id.grado ? '🏫 Grado y sección: ' + id.grado + '\n' : '') +
      (id.docente ? '🧑‍🏫 Código del maestro: ' + id.docente + '\n' : '') +
      '🚀 Misión: ' + tituloMision() + '\n' +
      '📅 Enviado: ' + hoy.fecha + ' ' + hoy.hora + '\n\n' +
      '✅ Secciones completadas: ' + hechas + (tabs.length ? ' de ' + tabs.length : '') + '\n' +
      '⭐ XP: ' + (xpActual() === null ? '—' : xpActual()) + '\n' +
      '⏱️ Tiempo activo: ' + Math.round(minutos) + ' min\n' +
      '📋 ' + linea('evaluacion', 'Evaluación conceptual') + '\n' +
      '🧮 ' + linea('prueba_operativa', 'Prueba operativa') + '\n\n' +
      '🔎 Verificable en el Registro Docente del dispositivo ' + idDispositivo() + '\n\n' +
      '🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com';
  }
  function abrirWA(texto) {
    var enc = encodeURIComponent(texto);
    var esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    window.open(esMovil ? 'https://wa.me/?text=' + enc : 'https://web.whatsapp.com/send?text=' + enc, '_blank');
  }
  function enviarResultados() {
    if (!identificacion() && !alumnoActual()) { abrirIdentificacion(enviarResultados); return; }
    abrirWA(textoReporte());
  }

  // ---------- identificación: modal "lite" (sin contraseña) ----------
  var ID_CSS = '.metas-id-overlay{position:fixed;inset:0;background:rgba(20,30,48,0.72);display:flex;align-items:center;justify-content:center;z-index:99999;padding:1rem;}' +
    '.metas-id-card{background:#ffffff;color:#2d3436;border-radius:18px;max-width:400px;width:100%;padding:1.3rem 1.4rem;box-shadow:0 12px 40px rgba(0,0,0,0.35);font-family:inherit;}' +
    '.metas-id-card h3{color:#1565c0;font-size:1.15rem;margin:0 0 0.3rem;}' +
    '.metas-id-card p{font-size:0.82rem;color:#636e72;margin:0 0 0.9rem;line-height:1.45;}' +
    '.metas-id-card label{display:block;font-size:0.78rem;font-weight:700;color:#1565c0;margin:0.6rem 0 0.2rem;}' +
    '.metas-id-card input{width:100%;box-sizing:border-box;padding:0.55rem 0.7rem;border:2px solid #cfd8e3;border-radius:10px;font-size:0.95rem;background:#f7fafd;color:#2d3436;}' +
    '.metas-id-card input:focus{outline:none;border-color:#1565c0;}' +
    '.metas-id-acciones{display:flex;gap:0.5rem;margin-top:1.1rem;}' +
    '.metas-id-btn{flex:1;border:none;border-radius:10px;padding:0.65rem;font-size:0.9rem;font-weight:700;cursor:pointer;}' +
    '.metas-id-guardar{background:#1565c0;color:#fff;}' +
    '.metas-id-luego{background:#eef2f7;color:#636e72;}';

  function abrirIdentificacion(alGuardar) {
    if (document.getElementById('metasIdModal')) return;
    var st = document.createElement('style'); st.textContent = ID_CSS; document.head.appendChild(st);
    var id = identificacion() || {};
    var ov = document.createElement('div');
    ov.className = 'metas-id-overlay'; ov.id = 'metasIdModal';
    ov.innerHTML = '<div class="metas-id-card" role="dialog" aria-modal="true" aria-label="Identifícate">' +
      '<h3>👋 ¡Hola, explorador!</h3>' +
      '<p>Escribe tus datos <strong>una sola vez</strong> para que tu maestro sepa que estos logros son tuyos.</p>' +
      '<label for="metasIdNombre">👤 Tu nombre o código de alumno</label>' +
      '<input id="metasIdNombre" type="text" maxlength="60" autocomplete="off" placeholder="Ej: Ana López o A07">' +
      '<label for="metasIdGrado">🏫 Grado y sección</label>' +
      '<input id="metasIdGrado" type="text" maxlength="30" autocomplete="off" placeholder="Ej: 6to A">' +
      '<label for="metasIdDocente">🧑‍🏫 Código de tu maestro <span style="font-weight:400;color:#636e72;">(si te dieron uno)</span></label>' +
      '<input id="metasIdDocente" type="text" maxlength="30" autocomplete="off" placeholder="Ej: PROF-JP">' +
      '<div class="metas-id-acciones">' +
      '<button type="button" class="metas-id-btn metas-id-luego" id="metasIdLuego">Ahora no</button>' +
      '<button type="button" class="metas-id-btn metas-id-guardar" id="metasIdGuardar">✅ Guardar</button>' +
      '</div></div>';
    document.body.appendChild(ov);
    document.getElementById('metasIdNombre').value = id.nombre || '';
    document.getElementById('metasIdGrado').value = id.grado || '';
    document.getElementById('metasIdDocente').value = id.docente || '';
    function cerrar() { ov.remove(); st.remove(); }
    document.getElementById('metasIdLuego').addEventListener('click', function () {
      try { sessionStorage.setItem('METAS_ID_OMITIDA', '1'); } catch (e) {}
      cerrar();
    });
    document.getElementById('metasIdGuardar').addEventListener('click', function () {
      var nombre = document.getElementById('metasIdNombre').value.trim();
      if (!nombre) { document.getElementById('metasIdNombre').focus(); return; }
      var datos = {
        nombre: nombre.slice(0, 60),
        grado: document.getElementById('metasIdGrado').value.trim().slice(0, 30),
        docente: document.getElementById('metasIdDocente').value.trim().slice(0, 30)
      };
      guardarIdentificacion(datos);
      // sincronizar con el nombre de la constancia de la misión
      // (siempre: al cambiar de alumno la constancia debe cambiar de dueño)
      var inp = document.querySelector('.diploma-input');
      if (inp) {
        inp.value = datos.nombre;
        try { inp.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
        if (typeof window.updateDiplomaName === 'function') window.updateDiplomaName(datos.nombre);
      }
      cerrar();
      if (typeof alGuardar === 'function') alGuardar();
    });
  }

  function idOmitidaEstaSesion() {
    try { return sessionStorage.getItem('METAS_ID_OMITIDA') === '1'; } catch (e) { return false; }
  }

  // Botones "Enviar resultados" y "Cambiar alumno" junto a los de la constancia
  function inyectarBotonEnviar() {
    var acciones = document.querySelector('.diploma-actions');
    if (!acciones || document.getElementById('metasBtnEnviar')) return;
    var btn = document.createElement('button');
    btn.id = 'metasBtnEnviar';
    btn.className = 'btn btn-wa';
    btn.textContent = '📤 Enviar resultados';
    btn.addEventListener('click', enviarResultados);
    acciones.insertBefore(btn, acciones.firstChild);
    // para dispositivos compartidos: reabre el modal de identificación
    var btnCambiar = document.createElement('button');
    btnCambiar.id = 'metasBtnCambiar';
    btnCambiar.className = 'btn btn-d';
    btnCambiar.textContent = '👤 Cambiar alumno';
    btnCambiar.addEventListener('click', function () { abrirIdentificacion(); });
    acciones.appendChild(btnCambiar);
  }

  // ---------- API pública ----------
  window.METAS = {
    version: 2,
    registrar: registrar,
    eventos: leer,
    csv: csv,
    exportarCSV: exportarCSV,
    resumen: resumen,
    borrar: borrar,
    dispositivo: idDispositivo,
    identificacion: identificacion,
    identificar: abrirIdentificacion,
    textoReporte: textoReporte,
    enviarResultados: enviarResultados,
    sincronizar: sincronizar,
    pendientes: function () { return pendientes(true).length; },
    urlSincronizacion: urlSync
  };

  function iniciar() {
    instalarGanchos();
    if (idMision()) {
      registrar('sesion', {});
      inyectarBotonEnviar();
      if (!identificacion() && !idOmitidaEstaSesion()) abrirIdentificacion();
    }
    if (urlSync()) {
      setTimeout(function () { sincronizar(); }, 4000);
      window.addEventListener('online', function () { sincronizar(); });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
