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
  // { nombre, escuela, grado, docente } — viaja pegada a cada evento
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
      num: id.num || '',
      grado: id.grado || '',
      docente: id.docente || '',
      codigo_aula: id.codigo_aula || '',
      escuela: id.escuela || '',
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
    // aviso a capas externas (metas-supabase.js escucha este evento)
    try { document.dispatchEvent(new CustomEvent('metas:registro', { detail: ev })); } catch (e) {}
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
  }
  window.addEventListener('pagehide', cerrarSesion);
  document.addEventListener('visibilitychange', function () { if (document.hidden) cerrarSesion(); });

  // ---------- ganchos sobre la plantilla de misiones ----------
  // La nota se lee del panel de resultado que pinta la propia misión.
  // Hay dos formatos según la generación de la misión:
  // "Resultado: 85/100 pts" y "Resultado automático: 85/100 puntos"
  function notaDePanel(idPanel) {
    var el = document.getElementById(idPanel);
    if (!el) return null;
    var m = (el.textContent || '').match(/Resultado[^:]*:\s*(\d+)\s*\/\s*(\d+)/);
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
        // misiones nuevas guardan _evalGradeData; las anteriores solo _evalPrintData
        if (window._evalGradeData || window._evalPrintData) {
          var res = notaDePanel('evalAutoResult');
          if (res) registrar('evaluacion', { forma: window._currentEvalForm || null, nota: res.nota, base: res.base });
          avisarPractica('evalAutoResult');
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
          avisarPractica('evalOpAutoResult');
        }
        return r;
      };
    }
    // Pauta vista (anti-trampa): imprimir/previsualizar el examen muestra la
    // pauta con las respuestas. Se registra el momento para que el maestro
    // vea un aviso ⚠️ en toda evaluación calificada DESPUÉS en este equipo.
    var _pautaUltimo = 0;
    var _pautaAbierta = false;   // en esta visita se abrió la pauta de esta misión
    function registrarPauta(forma) {
      _pautaAbierta = true;      // esto NO se limita: se abrió, y ya está
      var ahora = Date.now();
      if (ahora - _pautaUltimo < 60000) return; // máximo 1 registro por minuto
      _pautaUltimo = ahora;
      registrar('pauta_vista', { forma: forma || null });
    }

    /* Que el alumno lo sepa EN EL MOMENTO, no solo el maestro tres días
       después. Sin esto la pantalla le dice «100/100» y él se lo cree: nadie
       le avisó de que mirar la pauta convierte el examen en práctica.

       Y se dice sin regañar. Practicar con la clave delante está bien —es lo
       que la propia misión invita a hacer en 44 de las 66— y no se le quita
       nada: se le explica qué acaba de sacar y cómo se saca la otra, que es
       generar otra forma y no mirar. */
    function avisarPractica(idPanel) {
      if (!_pautaAbierta) return;
      var panel = document.getElementById(idPanel);
      if (!panel || panel.querySelector('.metas-practica')) return;
      var n = document.createElement('div');
      n.className = 'metas-practica';
      n.setAttribute('style',
        'margin-top:10px;padding:9px 11px;border-radius:10px;border-left:4px solid #b45309;' +
        'background:#fffbeb;color:#7c3f0a;font-size:13.5px;line-height:1.5;text-align:left');
      n.innerHTML = '<strong>👁 Esto cuenta como práctica, no como nota.</strong><br>' +
        'Abriste la pauta antes de calificar, así que este puntaje no se guarda como ' +
        'evaluación. Está bien practicar así. Cuando quieras la nota de verdad: ' +
        '<strong>genera otra forma y califica sin mirar la pauta</strong>.';
      panel.appendChild(n);
    }
    if (typeof window.printEval === 'function') {
      var peOrig = window.printEval;
      window.printEval = function () {
        registrarPauta(window._currentEvalForm || null);
        return peOrig.apply(this, arguments);
      };
    }
    if (typeof window.printEvalOp === 'function') {
      var poOrig = window.printEvalOp;
      window.printEvalOp = function () {
        registrarPauta(window._currentEvalOpForm || null);
        return poOrig.apply(this, arguments);
      };
    }

    /* ⚠️ Y AQUÍ estaba el agujero por el que se caía todo el anti-trampa.
       Se registraba la pauta al IMPRIMIR, que es lo que hace el maestro, y no
       al abrirla en la pantalla, que es lo que hace el alumno: el botón
       «👁 Ver Pauta» está al lado de «Calificar», antes de calificar, en las
       66 misiones. Un alumno de 5º lo tocó sin proponérselo, vio las 16
       respuestas, las copió, calificó, y la pantalla dijo 100/100. Esa nota
       entró en el registro y en Rutas la misión pasó a «Dominada · 100».

       Lo que costaba de ver es que el aviso al maestro YA ESTABA HECHO —el ⚠️
       de registro.html y consulta-nube.html, que cruza la pauta con la nota
       del mismo día y el mismo equipo— y no se disparaba nunca, porque nadie
       le contaba que la pauta se había abierto.

       Se mira el DOM y no una variable de la misión: cada misión lleva su
       propio `evalAnsVisible` y hay 66. Lo que vale es si las respuestas
       quedaron a la vista después de tocar, que es lo que de verdad pasó. */
    function hayRespuestasALaVista(selector) {
      var els = document.querySelectorAll(selector);
      for (var i = 0; i < els.length; i++) {
        if (els[i].offsetParent !== null) return true;
      }
      return false;
    }
    function engancharPauta(nombre, selector, forma) {
      if (typeof window[nombre] !== 'function') return;
      var orig = window[nombre];
      window[nombre] = function () {
        var r = orig.apply(this, arguments);
        /* Es un interruptor: solo cuenta cuando ABRE. Cerrarla no deshace
           haberla visto, pero registrar el cierre ensuciaría el aviso. */
        if (hayRespuestasALaVista(selector)) registrarPauta(forma());
        return r;
      };
    }
    engancharPauta('toggleEvalAns', '#evalOut .eval-answer',
                   function () { return window._currentEvalForm || null; });
    engancharPauta('toggleEvalOpAns', '#evalOpOut .eval-answer',
                   function () { return window._currentEvalOpForm || null; });
    /* Y la tercera, la del caso crítico, que solo tienen dos misiones y por eso
       es la que se olvida: enseña la pauta igual y cuenta igual. */
    engancharPauta('toggleEvalCritAns', '#evalCritOut .crit-pauta, #evalCritOut .eval-answer',
                   function () { return window._currentEvalForm || null; });
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
    /* Las tres últimas columnas son del Control de lectura de las misiones
       (tipo «lectura»): van AL FINAL y vacías en los demás eventos, para no
       correr las columnas de las hojas de cálculo que el maestro ya armó. */
    var filas = ['fecha,hora,mision,alumno,grado,docente,escuela,tipo,seccion,forma,nota,base,xp,min,sesion,dispositivo,categoria,texto,ppm,comprension,lectura'];
    eventos.forEach(function (ev) {
      var fl = fechaLocal(ev.t);
      var comp = (ev.tipo === 'lectura' && typeof ev.comp === 'number') ? ev.comp + '/' + (ev.compDe || 5) : '';
      filas.push([fl.fecha, fl.hora, ev.mision, ev.alumno, ev.grado, ev.docente, ev.escuela, ev.tipo, ev.seccion, ev.forma,
        ev.nota, ev.base, ev.xp, ev.min, ev.ses, ev.disp, ev.categoria, ev.texto,
        ev.ppm, comp, ev.titulo].map(celda).join(','));
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
    var alumnos = {}, misiones = {}, evals = [], ops = [], lecturas = [], porSesion = {};
    var minT = null, maxT = null;
    eventos.forEach(function (ev) {
      if (ev.alumno) alumnos[ev.alumno] = true;
      if (ev.mision) misiones[ev.mision] = true;
      if (ev.tipo === 'evaluacion' && typeof ev.nota === 'number') evals.push(ev.nota);
      if (ev.tipo === 'prueba_operativa' && typeof ev.nota === 'number') ops.push(ev.nota);
      if (ev.tipo === 'lectura' && typeof ev.ppm === 'number') lecturas.push(ev.ppm);
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
      lecturas: lecturas.length, promedioPpm: prom(lecturas),
      minutos: Math.round(minutos),
      desde: minT ? fechaLocal(minT).fecha : null,
      hasta: maxT ? fechaLocal(maxT).fecha : null
    };
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
        (u.forma ? ' · Forma ' + (+u.forma > 100 ? 'R-' + (+u.forma - 100) : u.forma) : '') +
        ' · ' + lista.length + ' intento' + (lista.length === 1 ? '' : 's') +
        ' · ' + fl.fecha + ' ' + fl.hora;
    };
    /* Control de lectura: se manda la ÚLTIMA toma, no el promedio. En
       fluidez lo que importa es hacia dónde va el alumno, y un promedio
       entre septiembre y noviembre esconde justamente eso. */
    var lecs = evs.filter(function (e) { return e.tipo === 'lectura' && typeof e.ppm === 'number'; });
    var lineaLectura = function () {
      if (!lecs.length) return 'Control de lectura: aún sin tomas';
      var u = lecs[lecs.length - 1];
      var fl = fechaLocal(u.t);
      return 'Control de lectura: *' + u.ppm + ' palabras por minuto*' +
        (typeof u.comp === 'number' ? ' · comprensión ' + u.comp + '/' + (u.compDe || 5) : '') +
        (u.titulo ? ' · «' + u.titulo + '»' : '') +
        ' · ' + lecs.length + ' toma' + (lecs.length === 1 ? '' : 's') + ' · ' + fl.fecha;
    };
    var hoy = fechaLocal(new Date().toISOString());
    return '📤 *REPORTE DE RESULTADOS · M.E.T.A.S*\n\n' +
      '👤 Alumno: ' + nombre + '\n' +
      (id.escuela ? '🏫 Escuela: ' + id.escuela + '\n' : '') +
      (id.grado ? '📚 Grado y sección: ' + id.grado + '\n' : '') +
      (id.docente ? '🧑‍🏫 Maestro: ' + id.docente + '\n' : '') +
      '🚀 Misión: ' + tituloMision() + '\n' +
      '📅 Enviado: ' + hoy.fecha + ' ' + hoy.hora + '\n\n' +
      '✅ Secciones completadas: ' + hechas + (tabs.length ? ' de ' + tabs.length : '') + '\n' +
      '⭐ XP: ' + (xpActual() === null ? '—' : xpActual()) + '\n' +
      '⏱️ Tiempo activo: ' + Math.round(minutos) + ' min\n' +
      '📋 ' + linea('evaluacion', 'Evaluación conceptual') + '\n' +
      '🧮 ' + linea('prueba_operativa', 'Prueba operativa') + '\n' +
      '📖 ' + lineaLectura() + '\n\n' +
      '🔎 Verificable en la Evidencia de misiones del dispositivo ' + idDispositivo() + '\n\n' +
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
  var ID_CSS = '.metas-id-overlay{position:fixed;inset:0;background:rgba(20,30,48,0.72);display:flex;justify-content:center;z-index:99999;padding:1rem;overflow-y:auto;-webkit-overflow-scrolling:touch;}' +
    '.metas-id-card{background:#ffffff;color:#2d3436;border-radius:18px;max-width:400px;width:100%;padding:1.3rem 1.4rem;box-shadow:0 12px 40px rgba(0,0,0,0.35);font-family:inherit;margin:auto 0;height:fit-content;}' +
    '.metas-id-card h3{color:#1565c0;font-size:1.15rem;margin:0 0 0.3rem;}' +
    '.metas-id-card p{font-size:0.82rem;color:#636e72;margin:0 0 0.9rem;line-height:1.45;}' +
    '.metas-id-card label{display:block;font-size:0.78rem;font-weight:700;color:#1565c0;margin:0.6rem 0 0.2rem;}' +
    '.metas-id-card input,.metas-id-card select,.metas-id-card textarea{width:100%;box-sizing:border-box;padding:0.55rem 0.7rem;border:2px solid #cfd8e3;border-radius:10px;font-size:0.95rem;background:#f7fafd;color:#2d3436;font-family:inherit;}' +
    '.metas-id-card input:focus,.metas-id-card select:focus,.metas-id-card textarea:focus{outline:none;border-color:#1565c0;}' +
    '.metas-id-card textarea{resize:vertical;min-height:90px;}' +
    '.metas-id-acciones{display:flex;gap:0.5rem;margin-top:1.1rem;}' +
    '.metas-id-btn{flex:1;border:none;border-radius:10px;padding:0.65rem;font-size:0.9rem;font-weight:700;cursor:pointer;}' +
    '.metas-id-guardar{background:#1565c0;color:#fff;}' +
    '.metas-id-luego{background:#eef2f7;color:#636e72;}' +
    '.metas-id-aulamsg{font-size:0.8rem;font-weight:700;color:#636e72;margin:0.3rem 0 0;min-height:1rem;}' +
    '.metas-id-aulaok{color:#1e7d34;}' +
    '.metas-id-aulaerr{color:#c0392b;}';

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
      '<label for="metasIdNum">🔢 Tu número de lista (opcional)</label>' +
      '<input id="metasIdNum" type="text" maxlength="10" inputmode="numeric" autocomplete="off" placeholder="Ej: 7">' +
      '<label for="metasIdEscuela">🏫 Tu escuela o centro educativo</label>' +
      '<input id="metasIdEscuela" type="text" maxlength="80" autocomplete="off" placeholder="Ej: Esc. Francisco Morazán">' +
      '<label for="metasIdGrado">📚 Grado y sección</label>' +
      '<input id="metasIdGrado" type="text" maxlength="30" autocomplete="off" placeholder="Ej: 6to A">' +
      '<label for="metasIdAula">🔑 Código de aula (te lo da tu maestro)</label>' +
      '<input id="metasIdAula" type="text" maxlength="8" autocomplete="off" placeholder="Ej: K2M9P" style="text-transform:uppercase;letter-spacing:3px;font-weight:800;">' +
      '<div id="metasIdAulaMsg" class="metas-id-aulamsg"></div>' +
      '<div class="metas-id-acciones">' +
      '<button type="button" class="metas-id-btn metas-id-luego" id="metasIdLuego">Ahora no</button>' +
      '<button type="button" class="metas-id-btn metas-id-guardar" id="metasIdGuardar">✅ Guardar</button>' +
      '</div></div>';
    document.body.appendChild(ov);
    document.getElementById('metasIdNombre').value = id.nombre || '';
    document.getElementById('metasIdNum').value = id.num || '';
    document.getElementById('metasIdEscuela').value = id.escuela || '';
    document.getElementById('metasIdGrado').value = id.grado || '';
    document.getElementById('metasIdAula').value = id.codigo_aula || '';

    // Resolución en vivo: al teclear el código, confirma el nombre del maestro.
    var _aulaNombre = id.docente || '';        // nombre resuelto del maestro (para emparejar)
    var _aulaTimer = null;
    var aulaInp = document.getElementById('metasIdAula');
    var aulaMsg = document.getElementById('metasIdAulaMsg');
    function resolverAula() {
      var cod = aulaInp.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (cod.length < 5) { aulaMsg.textContent = ''; aulaMsg.className = 'metas-id-aulamsg'; return; }
      if (navigator.onLine === false) {
        aulaMsg.textContent = '📴 Sin internet: se confirmará al reconectar.';
        aulaMsg.className = 'metas-id-aulamsg';
        return;
      }
      aulaMsg.textContent = '⏳ Buscando…'; aulaMsg.className = 'metas-id-aulamsg';
      var url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
      var key = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
      try { url = localStorage.getItem('METAS_SB_URL') || url; key = localStorage.getItem('METAS_SB_KEY') || key; } catch (e) {}
      fetch(url + '/rest/v1/rpc/metas_aula_resolver', {
        method: 'POST',
        headers: { apikey: key, Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ p_codigo_aula: cod })
      }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        if (aulaInp.value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '') !== cod) return;  // cambió
        if (j && j.ok && j.nombre) {
          _aulaNombre = j.nombre;
          aulaMsg.textContent = '✅ Maestro(a): ' + j.nombre;
          aulaMsg.className = 'metas-id-aulamsg metas-id-aulaok';
        } else {
          _aulaNombre = '';
          aulaMsg.textContent = '❌ Código no encontrado. Pídeselo de nuevo a tu maestro.';
          aulaMsg.className = 'metas-id-aulamsg metas-id-aulaerr';
        }
      }).catch(function () { aulaMsg.textContent = ''; });
    }
    aulaInp.addEventListener('input', function () {
      clearTimeout(_aulaTimer); _aulaTimer = setTimeout(resolverAula, 450);
    });
    if ((id.codigo_aula || '').length >= 5) resolverAula();

    function cerrar() { ov.remove(); st.remove(); }
    document.getElementById('metasIdLuego').addEventListener('click', function () {
      try { sessionStorage.setItem('METAS_ID_OMITIDA', '1'); } catch (e) {}
      cerrar();
    });
    document.getElementById('metasIdGuardar').addEventListener('click', function () {
      var nombre = document.getElementById('metasIdNombre').value.trim();
      if (!nombre) { document.getElementById('metasIdNombre').focus(); return; }
      var codAula = document.getElementById('metasIdAula').value.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
      var datos = {
        nombre: nombre.slice(0, 60),
        num: document.getElementById('metasIdNum').value.trim().slice(0, 10),
        escuela: document.getElementById('metasIdEscuela').value.trim().slice(0, 80),
        grado: document.getElementById('metasIdGrado').value.trim().slice(0, 30),
        // Código de aula: el servidor lo resuelve al nombre EXACTO del maestro
        // al subir (metas_guardar). Guardamos también el nombre ya resuelto
        // (si lo confirmamos con internet) para emparejar sin depender del server.
        codigo_aula: codAula,
        docente: (_aulaNombre || '').slice(0, 60)
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
      actualizarBarraAlumno();
      if (typeof alGuardar === 'function') alGuardar();
    });
  }

  function idOmitidaEstaSesion() {
    try { return sessionStorage.getItem('METAS_ID_OMITIDA') === '1'; } catch (e) { return false; }
  }

  // ---------- buzón de sugerencias ----------
  /* Lo que se escribe aquí SÍ llega a alguien: metas-sugerencias.js lo
     lleva a la bandeja del administrador del proyecto. Durante mucho
     tiempo no fue así —se guardaba en este teléfono y ahí se quedaba—,
     y por eso la pantalla ahora dice a dónde va: quien avisa de una
     errata tiene derecho a saber si alguien la va a leer. */
  var SUG_MIN = 5;   // el mismo mínimo que hacen cumplir el puente y el servidor

  function seccionActiva() {
    var t = document.querySelector('.nav-t.active[data-s]');
    return t ? t.getAttribute('data-s') : '';
  }
  function abrirSugerencias() {
    if (document.getElementById('metasSugModal')) return;
    var st = document.createElement('style'); st.textContent = ID_CSS; document.head.appendChild(st);
    var ov = document.createElement('div');
    ov.className = 'metas-id-overlay'; ov.id = 'metasSugModal';
    ov.innerHTML = '<div class="metas-id-card" role="dialog" aria-modal="true" aria-label="Sugerencias">' +
      '<h3>💬 Buzón de sugerencias</h3>' +
      '<p>¿Encontraste un error o tienes una idea? Tu mensaje llega al equipo que hace M.E.T.A.S y <strong>no se publica en ningún lado</strong>. Va con la misión y la sección donde estás, para que sepan dónde mirar.</p>' +
      '<label for="metasSugCat">🏷️ Tipo de mensaje</label>' +
      '<select id="metasSugCat">' +
      '<option value="error_contenido">📚 Encontré un error en el contenido</option>' +
      '<option value="error_tecnico">🔧 Algo no funciona bien</option>' +
      '<option value="idea">💡 Tengo una idea</option>' +
      '<option value="felicitacion">🎉 Quiero felicitar al equipo</option>' +
      '</select>' +
      '<label for="metasSugTexto">✍️ Tu mensaje</label>' +
      '<textarea id="metasSugTexto" maxlength="500" placeholder="Escribe aquí con tus palabras..."></textarea>' +
      '<div id="metasSugAviso" class="metas-id-aulamsg"></div>' +
      '<div class="metas-id-acciones">' +
      '<button type="button" class="metas-id-btn metas-id-luego" id="metasSugCancelar">Cancelar</button>' +
      '<button type="button" class="metas-id-btn metas-id-guardar" id="metasSugEnviar">📤 Enviar</button>' +
      '</div></div>';
    document.body.appendChild(ov);
    function cerrar() { ov.remove(); st.remove(); }
    document.getElementById('metasSugCancelar').addEventListener('click', cerrar);
    document.getElementById('metasSugEnviar').addEventListener('click', function () {
      var area = document.getElementById('metasSugTexto');
      var texto = area.value.trim();
      /* Un mensaje de dos letras no lo acepta el servidor, así que si
         se dejara pasar se quedaría dando vueltas en la cola del
         teléfono para siempre. Mejor decirlo aquí, donde la persona
         todavía está mirando y puede escribirlo. */
      if (texto.length < SUG_MIN) {
        var av = document.getElementById('metasSugAviso');
        if (av) av.textContent = '✍️ Cuéntanos un poco más para poder buscarlo.';
        area.focus();
        return;
      }
      registrar('sugerencia', {
        categoria: document.getElementById('metasSugCat').value,
        texto: texto.slice(0, 500),
        seccion: seccionActiva()
      });
      cerrar();
      /* «Va camino» y no «se envió»: sin señal se guarda y sale solo
         cuando vuelva el internet, y decir que ya se mandó cuando no es
         verdad es exactamente el problema que este buzón tenía. */
      if (typeof window.showToast === 'function') window.showToast('💬 ¡Gracias! Tu mensaje va camino al equipo.');
    });
  }

  // Barra de identidad permanente sobre la navegación de la misión:
  // muestra quién está trabajando y permite cambiar de alumno sin ir a la constancia
  var BARRA_CSS = '#metasBarraAlumno{display:flex;align-items:center;justify-content:center;gap:0.6rem;flex-wrap:wrap;margin:0.9rem auto 0.4rem;padding:0.45rem 0.9rem;max-width:640px;border-radius:14px;background:var(--pri-gl,#e3f2fd);border:1.5px dashed var(--pri,#1565c0);font-size:0.85rem;color:var(--pri,#1565c0);font-weight:600;}' +
    '#metasBarraAlumno .metas-ba-btn{border:none;border-radius:10px;padding:0.35rem 0.8rem;background:var(--pri,#1565c0);color:#fff;font-weight:700;font-size:0.8rem;cursor:pointer;font-family:inherit;}';

  function actualizarBarraAlumno() {
    var barra = document.getElementById('metasBarraAlumno');
    if (!barra) return;
    var id = identificacion();
    var conNombre = !!(id && id.nombre);
    barra.querySelector('.metas-ba-txt').textContent = conNombre
      ? '👤 ' + id.nombre + (id.grado ? ' · ' + id.grado : '')
      : '👤 Aún no te has identificado';
    barra.querySelector('.metas-ba-btn').textContent = conNombre ? '✏️ Cambiar alumno' : '✍️ Escribir mis datos';
  }

  function inyectarBarraAlumno() {
    if (document.getElementById('metasBarraAlumno')) return;
    var primerTab = document.querySelector('[data-s]');
    if (!primerTab || !primerTab.parentNode) return;
    var st = document.createElement('style');
    st.textContent = BARRA_CSS;
    document.head.appendChild(st);
    var barra = document.createElement('div');
    barra.id = 'metasBarraAlumno';
    var txt = document.createElement('span');
    txt.className = 'metas-ba-txt';
    var btn = document.createElement('button');
    btn.className = 'metas-ba-btn';
    btn.type = 'button';
    btn.addEventListener('click', function () { abrirIdentificacion(); });
    var btnSug = document.createElement('button');
    btnSug.className = 'metas-ba-btn';
    btnSug.id = 'metasBtnSug';
    btnSug.type = 'button';
    btnSug.textContent = '💬 Sugerencias';
    btnSug.addEventListener('click', abrirSugerencias);
    barra.appendChild(txt);
    barra.appendChild(btn);
    barra.appendChild(btnSug);
    var nav = (primerTab.closest && primerTab.closest('nav')) || primerTab;
    nav.parentNode.insertBefore(barra, nav);
    actualizarBarraAlumno();
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

  // ---------- capas de nube ----------
  // Se cargan solas desde la misma carpeta que este archivo; las
  // misiones no necesitan incluirlas. Si un archivo no existe, no pasa
  // nada. Son sesenta y cinco misiones: cualquier cosa que obligue a
  // tocar sus HTML uno por uno se queda a medias.
  //
  //   · metas-supabase.js   → los RESULTADOS, al proyecto de M.E.T.A.S,
  //                           que es lo que consulta el maestro.
  //   · metas-sugerencias.js → las SUGERENCIAS, al proyecto de F.A.R.O,
  //                           que es donde las lee el administrador.
  //
  // Son dos destinos distintos a propósito; el porqué está escrito en
  // la cabecera de metas-sugerencias.js.
  try {
    var scriptPropio = document.currentScript && document.currentScript.src;
    if (scriptPropio && /metas-registro\.js/.test(scriptPropio)) {
      ['metas-supabase.js', 'metas-sugerencias.js'].forEach(function (archivo) {
        var tag = document.createElement('script');
        tag.src = scriptPropio.replace(/metas-registro\.js([?#].*)?$/, archivo);
        tag.defer = true;
        document.head.appendChild(tag);
      });
    }
  } catch (e) {}

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
    sugerir: abrirSugerencias
  };

  function iniciar() {
    instalarGanchos();
    if (idMision()) {
      registrar('sesion', {});
      inyectarBotonEnviar();
      inyectarBarraAlumno();
      if (!identificacion() && !idOmitidaEstaSesion()) abrirIdentificacion();
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
