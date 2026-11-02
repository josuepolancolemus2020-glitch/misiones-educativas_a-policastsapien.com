/* ==========================================================================
   M.E.T.A.S · Prebásica (3.° Grado) — Técnicas Gráficas y No Gráficas (Libro 1)
   Compilado por Evelyn S. Castellanos H.
   Lógica interactiva táctil + ratón + voz TTS Español/Inglés + Web Audio API
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'metas_prebasica_libro1_v1';
  var state = {
    xp: 0,
    soundOn: true,
    completedTraces: {},
    completedRodea: {},
    completedPuzzles: {},
    completedHomeTechs: {},
    doneSections: {}
  };

  /* --------------------------------------------------------------------------
     HELPER: ESCUELA / INSTITUCIÓN ACTIVA
     -------------------------------------------------------------------------- */
  function obtenerSaludoEscuela() {
    try {
      var esc = localStorage.getItem('metas_prebasica_institucion');
      if (esc && esc.trim()) return esc.trim();
    } catch (e) {}
    return '';
  }
  window.obtenerSaludoEscuela = obtenerSaludoEscuela;

  /* --------------------------------------------------------------------------
     CARGA Y GUARDADO DE PROGRESO LOCAL
     -------------------------------------------------------------------------- */
  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          state.xp = Number(parsed.xp) || 0;
          state.soundOn = parsed.soundOn !== false;
          state.completedTraces = parsed.completedTraces || {};
          state.completedRodea = parsed.completedRodea || {};
          state.completedPuzzles = parsed.completedPuzzles || {};
          state.completedHomeTechs = parsed.completedHomeTechs || {};
          state.doneSections = parsed.doneSections || {};
        }
      }
    } catch (e) {
      /* Sin acceso a localStorage */
    }
    updateXPBar();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* Ignorar error de cuota */
    }
  }

  function addXP(pts, secId) {
    state.xp += pts;
    if (secId) {
      state.doneSections[secId] = true;
      var btn = document.querySelector('.nav-t[data-s="' + secId + '"]');
      if (btn) btn.classList.add('done');
      if (typeof window.fin === 'function') {
        try { window.fin(secId, pts); } catch (e) {}
      }
    }
    updateXPBar();
    saveState();
  }

  function updateXPBar() {
    var fill = document.getElementById('xpFill');
    var pts = document.getElementById('xpPts');
    var lvl = document.getElementById('xpLvl');
    var pct = Math.min(100, Math.round((state.xp / 200) * 100));
    if (fill) fill.style.width = pct + '%';
    if (pts) pts.textContent = '⭐ ' + state.xp;
    if (lvl) {
      if (state.xp >= 160) lvl.textContent = 'Estrella Prebásica 🌟';
      else if (state.xp >= 100) lvl.textContent = 'Manitas Creativas 🎨';
      else if (state.xp >= 45) lvl.textContent = 'Explorador Activo 🐝';
      else lvl.textContent = 'Semillita 🌱';
    }
    Object.keys(state.doneSections).forEach(function (secId) {
      var btn = document.querySelector('.nav-t[data-s="' + secId + '"]');
      if (btn) btn.classList.add('done');
    });
  }

  /* --------------------------------------------------------------------------
     AUDIO WEB API (100% OFFLINE) Y SÍNTESIS DE VOZ (TTS ESPAÑOL / INGLÉS)
     -------------------------------------------------------------------------- */
  var audioCtx = null;
  function getAudioCtx() {
    if (!state.soundOn) return null;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === 'suspended') {
      try { audioCtx.resume(); } catch (e) {}
    }
    return audioCtx;
  }

  function playTone(freq, duration, type, delay) {
    var ctx = getAudioCtx();
    if (!ctx) return;
    var start = ctx.currentTime + (delay || 0);
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0.14, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + duration);
  }

  function sonarAcierto() {
    playTone(523.25, 0.14, 'triangle', 0);
    playTone(659.25, 0.18, 'triangle', 0.1);
  }

  function sonarCelebracion() {
    playTone(523.25, 0.14, 'triangle', 0);
    playTone(659.25, 0.14, 'triangle', 0.11);
    playTone(783.99, 0.16, 'triangle', 0.22);
    playTone(1046.5, 0.34, 'sine', 0.34);
  }

  function sonarSuaveError() {
    playTone(280, 0.18, 'sine', 0);
    playTone(220, 0.22, 'sine', 0.12);
  }

  /* --------------------------------------------------------------------------
     REPRODUCTOR DE VOZ NEURONAL MP3 + CONTROL DE PAUSA / DETENER + SÍNTESIS
     -------------------------------------------------------------------------- */
  window.audioPrebasicaActual = null;
  window.ultimoTextoAudio = null;
  window.ultimoBotonAudio = null;
  window.audioPrebasicaPlaying = false;
  window.audioTimeoutBilingue = null;

  function normalizarTextoAudio(t) {
    if (!t) return '';
    return t
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function actualizarBotonFlotanteDetener(visible) {
    var btn = document.getElementById('btnDetenerVozFlotante');
    if (btn) {
      btn.style.display = visible ? 'inline-flex' : 'none';
    }
  }

  function limpiarEstadoReproduccionAudio() {
    window.audioPrebasicaPlaying = false;
    window.ultimoTextoAudio = null;
    if (window.ultimoBotonAudio) {
      try { window.ultimoBotonAudio.classList.remove('audio-playing'); } catch (e) {}
      window.ultimoBotonAudio = null;
    }
    actualizarBotonFlotanteDetener(false);
  }

  window.detenerAudioPrebasica = function () {
    if (window.audioTimeoutBilingue) {
      clearTimeout(window.audioTimeoutBilingue);
      window.audioTimeoutBilingue = null;
    }
    if (window.audioPrebasicaActual) {
      try {
        window.audioPrebasicaActual.pause();
        window.audioPrebasicaActual.currentTime = 0;
      } catch (e) {}
      window.audioPrebasicaActual = null;
    }
    if ('speechSynthesis' in window) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
    }
    limpiarEstadoReproduccionAudio();
  };
  window.detenerVozPrebasica = window.detenerAudioPrebasica;

  function hablarConSintesisRespaldo(textoLimpio, lang, onEnd) {
    if (!('speechSynthesis' in window)) {
      if (typeof onEnd === 'function') onEnd();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(textoLimpio);
      var isEn = (lang && lang.toLowerCase().indexOf('en') === 0);
      u.lang = isEn ? 'en-US' : (lang || 'es-ES');
      u.rate = 0.94;
      u.pitch = 1.05;

      u.onend = function () {
        if (typeof onEnd === 'function') onEnd();
      };
      u.onerror = function () {
        if (typeof onEnd === 'function') onEnd();
      };

      var voices = window.speechSynthesis.getVoices() || [];
      var selectedVoice = null;

      if (isEn) {
        // Exclusivamente voces nativas en inglés
        var priorityEn = ['ana', 'aria', 'jenny', 'michelle', 'google us english', 'natural', 'online'];
        for (var i = 0; i < priorityEn.length; i++) {
          var needle = priorityEn[i];
          selectedVoice = voices.find(function (v) {
            return (v.lang && v.lang.toLowerCase().indexOf('en') === 0) &&
                   v.name.toLowerCase().indexOf(needle) !== -1;
          });
          if (selectedVoice) break;
        }
        if (!selectedVoice) {
          selectedVoice = voices.find(function (v) {
            return v.lang && v.lang.toLowerCase().indexOf('en') === 0;
          });
        }
      } else {
        var priorityEs = ['dalia', 'elena', 'salome', 'paulina', 'google español', 'natural', 'online'];
        for (var j = 0; j < priorityEs.length; j++) {
          var needleEs = priorityEs[j];
          selectedVoice = voices.find(function (v) {
            return (v.lang && v.lang.toLowerCase().indexOf('es') === 0) &&
                   v.name.toLowerCase().indexOf(needleEs) !== -1;
          });
          if (selectedVoice) break;
        }
        if (!selectedVoice) {
          selectedVoice = voices.find(function (v) {
            return v.lang && v.lang.toLowerCase().indexOf('es') === 0;
          });
        }
      }

      if (selectedVoice) u.voice = selectedVoice;
      window.speechSynthesis.speak(u);
    } catch (e) {
      if (typeof onEnd === 'function') onEnd();
    }
  }

  function reproducirAudioOTexto(limpio, lang, btn, onEnd) {
    var archivo = null;
    if (window.MAPA_AUDIOS_PREBASICA) {
      archivo = window.MAPA_AUDIOS_PREBASICA[limpio] ||
                window.MAPA_AUDIOS_PREBASICA[limpio.toLowerCase()];
    }

    if (archivo) {
      try {
        var audio = new Audio('audios/' + archivo);
        window.audioPrebasicaActual = audio;

        audio.onended = function () {
          window.audioPrebasicaActual = null;
          if (typeof onEnd === 'function') onEnd();
        };

        audio.onerror = function () {
          window.audioPrebasicaActual = null;
          hablarConSintesisRespaldo(limpio, lang, onEnd);
        };

        var playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(function () {
            window.audioPrebasicaActual = null;
            hablarConSintesisRespaldo(limpio, lang, onEnd);
          });
        }
        return;
      } catch (e) {
        window.audioPrebasicaActual = null;
      }
    }

    hablarConSintesisRespaldo(limpio, lang, onEnd);
  }

  window.hablarTexto = function (texto, lang, btn, callback) {
    if (!state.soundOn || !texto) return;

    var limpio = normalizarTextoAudio(texto);
    if (!limpio) return;

    // Toggle: si hay un audio sonando y el usuario vuelve a pulsar el mismo botón o texto
    if (window.audioPrebasicaPlaying && (
      (window.ultimoTextoAudio && window.ultimoTextoAudio === limpio) ||
      (btn && btn === window.ultimoBotonAudio)
    )) {
      window.detenerAudioPrebasica();
      window.ultimoTextoAudio = null;
      return;
    }

    // Detener cualquier audio previo
    window.detenerAudioPrebasica();

    window.ultimoTextoAudio = limpio;
    window.ultimoBotonAudio = btn || null;
    window.audioPrebasicaPlaying = true;
    actualizarBotonFlotanteDetener(true);

    if (btn) {
      btn.classList.add('audio-playing');
    }

    reproducirAudioOTexto(limpio, lang, btn, function () {
      limpiarEstadoReproduccionAudio();
      if (typeof callback === 'function') {
        try { callback(); } catch (e) {}
      }
    });
  };

  window.hablarBilingue = function (textoEs, textoEn, triggerBtn) {
    if (!state.soundOn) return;
    var claveEs = normalizarTextoAudio(textoEs);
    var claveEn = normalizarTextoAudio(textoEn);
    var comboClave = claveEs + ' | ' + claveEn;

    // Toggle: si se toca de nuevo el mismo elemento bilingüe mientras suena, detener
    if (window.audioPrebasicaPlaying && (
      (triggerBtn && triggerBtn === window.ultimoBotonAudio) ||
      window.ultimoTextoAudio === comboClave ||
      window.ultimoTextoAudio === claveEs ||
      window.ultimoTextoAudio === claveEn
    )) {
      window.detenerAudioPrebasica();
      window.ultimoTextoAudio = null;
      return;
    }

    window.detenerAudioPrebasica();
    window.ultimoTextoAudio = comboClave;
    window.ultimoBotonAudio = triggerBtn || null;
    window.audioPrebasicaPlaying = true;
    actualizarBotonFlotanteDetener(true);

    if (triggerBtn) {
      triggerBtn.classList.add('audio-playing');
    }

    // 1. Reproducir primero en español con voz es-MX-DaliaNeural
    reproducirAudioOTexto(claveEs, 'es-ES', triggerBtn, function () {
      if (!window.audioPrebasicaPlaying) return;
      // 2. Pausa natural de 220ms antes del inglés nativo
      window.audioTimeoutBilingue = setTimeout(function () {
        if (!window.audioPrebasicaPlaying) return;
        // 3. Reproducir en inglés nativo con voz en-US-AnaNeural
        window.hablarTexto(claveEn, 'en-US', triggerBtn);
      }, 220);
    });
  };

  window.hablarAvisoAdulto = function (btn) {
    var esc = obtenerSaludoEscuela();
    var texto = esc
      ? ('¡Atención querida familia de ' + esc + '! Uso exclusivo con apoyo de un adulto. Esta sección de Prebásica está diseñada para que papá, mamá o encargado trabajen sentados junto al niño. Nunca deje al niño solo con el teléfono o la tablet.')
      : 'Atención familia: Uso exclusivo con apoyo de un adulto. Esta sección de Prebásica está diseñada para que el padre, madre o encargado trabaje sentado junto al niño. Nunca deje al niño solo con el teléfono o la tablet.';
    window.hablarTexto(texto, 'es-ES', btn);
  };

  /* --------------------------------------------------------------------------
     NAVEGACIÓN ENTRE LAS 4 PESTAÑAS
     -------------------------------------------------------------------------- */
  window.go = function (secId) {
    window.detenerVozPrebasica();
    var secs = document.querySelectorAll('.sec');
    secs.forEach(function (s) {
      s.classList.toggle('active', s.id === secId);
    });
    var tabs = document.querySelectorAll('.nav-t[data-s]');
    tabs.forEach(function (t) {
      var active = t.getAttribute('data-s') === secId;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    if (secId === 's-trazos') {
      setTimeout(renderTraceCanvas, 40);
    } else if (secId === 's-rodea') {
      setTimeout(function () {
        syncLassoCanvasSize();
        if (rodeaState.category === 'espacial' && rodeaState.targetId === 'dactilo') {
          renderDactiloCanvas();
        }
      }, 40);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ==========================================================================
     PESTAÑA 1: TRAZOS CON EL DEDO (6 RETOS DE GRAFOMOTRICIDAD EN CANVAS)
     ========================================================================== */
  var TRACE_CHALLENGES = [
    {
      id: 'verticales',
      title: '1. Líneas Verticales',
      subtitle: 'Abejitas a las flores (Arriba → Abajo)',
      ico: '🐝',
      startEmoji: '🐝',
      endEmoji: '🌸',
      guideText: 'Pídale al niño que baje su dedito desde cada abejita 🐝 hasta su flor 🌸 siguiendo las 3 líneas verticales de arriba hacia abajo.',
      ttsText: 'Reto uno: Líneas verticales. Lleva cada abejita de arriba hacia abajo hasta llegar a la flor.',
      buildPaths: function (w, h) {
        var cols = [w * 0.23, w * 0.50, w * 0.77];
        var paths = [];
        cols.forEach(function (cx) {
          var pts = [];
          for (var i = 0; i <= 18; i++) {
            pts.push({ x: cx, y: 72 + ((h - 144) * i) / 18 });
          }
          paths.push(pts);
        });
        return paths;
      }
    },
    {
      id: 'horizontales',
      title: '2. Líneas Horizontales',
      subtitle: 'Avión a la pista (Izquierda → Derecha)',
      ico: '✈️',
      startEmoji: '✈️',
      endEmoji: '🛬',
      guideText: 'Lleve el dedito de izquierda a derecha acompañando a los dos aviones ✈️ por su ruta horizontal hasta aterrizar en la pista 🛬.',
      ttsText: 'Reto dos: Líneas horizontales. Desliza tu dedo de izquierda a derecha para llevar el avión hasta la pista.',
      buildPaths: function (w, h) {
        var rows = [h * 0.33, h * 0.68];
        var paths = [];
        rows.forEach(function (ry) {
          var pts = [];
          for (var i = 0; i <= 24; i++) {
            pts.push({ x: 85 + ((w - 170) * i) / 24, y: ry });
          }
          paths.push(pts);
        });
        return paths;
      }
    },
    {
      id: 'zigzag',
      title: '3. Líneas Quebradas (Zig-Zag)',
      subtitle: 'Cuerdas del tambor musical',
      ico: '🥁',
      startEmoji: '🥢',
      endEmoji: '🥁',
      guideText: 'Siga los picos de arriba y abajo en zig-zag como las cuerdas de un tambor 🥁. ¡Subo, bajo, subo, bajo sin soltar el dedo!',
      ttsText: 'Reto tres: Líneas quebradas en zig zag. Sube y baja por los picos hasta tocar el tambor.',
      buildPaths: function (w, h) {
        var vertices = [
          { x: 85, y: h * 0.72 },
          { x: w * 0.24, y: h * 0.24 },
          { x: w * 0.39, y: h * 0.74 },
          { x: w * 0.54, y: h * 0.24 },
          { x: w * 0.69, y: h * 0.74 },
          { x: w * 0.83, y: h * 0.24 },
          { x: w - 85, y: h * 0.68 }
        ];
        return [interpolateSegments(vertices, 8)];
      }
    },
    {
      id: 'inclinadas',
      title: '4. Líneas Inclinadas',
      subtitle: 'Cometas que suben al cielo',
      ico: '🪁',
      startEmoji: '🪁',
      endEmoji: '☁️',
      guideText: 'Trace las cuerdas inclinadas en diagonal para que las dos cometas 🪁 suban hasta las nubes ☁️.',
      ttsText: 'Reto cuatro: Líneas inclinadas. Sube por la cuerda diagonal para llevar cada cometa hasta la nube.',
      buildPaths: function (w, h) {
        var p1 = interpolateSegments([
          { x: 100, y: h - 75 },
          { x: w * 0.48, y: 78 }
        ], 20);
        var p2 = interpolateSegments([
          { x: w * 0.45, y: h - 75 },
          { x: w - 95, y: 78 }
        ], 20);
        return [p1, p2];
      }
    },
    {
      id: 'onduladas',
      title: '5. Curvas y Ondas',
      subtitle: 'Olas del mar con el pececito',
      ico: '🐠',
      startEmoji: '🐠',
      endEmoji: '🪸',
      guideText: 'Mueva el dedito con suavidad haciendo olas curvas para que el pececito 🐠 nade hasta el arrecife de coral 🪸.',
      ttsText: 'Reto cinco: Líneas curvas y onduladas. Nada con el pececito haciendo olas suaves hasta el coral.',
      buildPaths: function (w, h) {
        var pts = [];
        var steps = 42;
        for (var i = 0; i <= steps; i++) {
          var t = i / steps;
          var x = 85 + (w - 170) * t;
          var y = h * 0.52 + Math.sin(t * Math.PI * 3.5) * (h * 0.25);
          pts.push({ x: x, y: y });
        }
        return [pts];
      }
    },
    {
      id: 'arabescos',
      title: '6. Arabescos y Espiral',
      subtitle: 'Vuelo de la mariposa al caracol',
      ico: '🦋',
      startEmoji: '🦋',
      endEmoji: '🐌',
      guideText: 'El arabesco desarrolla la soltura de muñeca y dedos: siga los giros de la mariposa 🦋 dando vueltas amplias hasta el caracolito 🐌.',
      ttsText: 'Reto seis: Arabescos y espirales. Sigue el vuelo circular de la mariposa hasta llegar al caracol.',
      buildPaths: function (w, h) {
        var pts = [];
        var steps = 65;
        for (var i = 0; i <= steps; i++) {
          var t = i / steps;
          var x = 85 + (w - 180) * t + Math.sin(t * Math.PI * 4) * 38;
          var y = h * 0.50 - Math.cos(t * Math.PI * 4) * (h * 0.27);
          pts.push({ x: x, y: y });
        }
        return [pts];
      }
    }
  ];

  function interpolateSegments(vertices, perSeg) {
    var out = [];
    for (var i = 0; i < vertices.length - 1; i++) {
      var a = vertices[i];
      var b = vertices[i + 1];
      for (var s = 0; s < perSeg; s++) {
        var t = s / perSeg;
        out.push({
          x: a.x + (b.x - a.x) * t,
          y: a.y + (b.y - a.y) * t
        });
      }
    }
    out.push(vertices[vertices.length - 1]);
    return out;
  }

  var traceState = {
    currentIdx: 0,
    color: 'rainbow',
    hue: 0,
    isDrawing: false,
    lastPt: null,
    userStrokes: [],
    waypoints: [],
    completedCurrent: false
  };

  function initTraceTab() {
    renderTraceSelector();
    selectTraceChallenge(0, false);

    var canvas = document.getElementById('traceCanvas');
    if (!canvas) return;

    function getCanvasPoint(e) {
      var rect = canvas.getBoundingClientRect();
      var clientX, clientY;
      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
      };
    }

    function startDraw(e) {
      if (e.cancelable) e.preventDefault();
      var pt = getCanvasPoint(e);
      traceState.isDrawing = true;
      traceState.lastPt = pt;
      traceState.userStrokes.push({
        color: traceState.color,
        points: [{ x: pt.x, y: pt.y, hue: traceState.hue }]
      });
      checkTraceWaypoints(pt);
      renderTraceCanvas();
    }

    function moveDraw(e) {
      if (!traceState.isDrawing) return;
      if (e.cancelable) e.preventDefault();
      var pt = getCanvasPoint(e);
      traceState.hue = (traceState.hue + 7) % 360;
      var currentStroke = traceState.userStrokes[traceState.userStrokes.length - 1];
      if (currentStroke) {
        currentStroke.points.push({ x: pt.x, y: pt.y, hue: traceState.hue });
      }
      traceState.lastPt = pt;
      checkTraceWaypoints(pt);
      renderTraceCanvas();
    }

    function endDraw(e) {
      if (!traceState.isDrawing) return;
      if (e && e.cancelable) e.preventDefault();
      traceState.isDrawing = false;
      traceState.lastPt = null;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    canvas.addEventListener('touchend', endDraw, { passive: false });
  }

  function renderTraceSelector() {
    var grid = document.getElementById('traceSelectorGrid');
    if (!grid) return;
    grid.innerHTML = '';
    TRACE_CHALLENGES.forEach(function (ch, idx) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'trace-chip-btn' +
        (idx === traceState.currentIdx ? ' active' : '') +
        (state.completedTraces[ch.id] ? ' completed' : '');
      btn.innerHTML =
        '<span class="trace-chip-ico" aria-hidden="true">' + ch.ico + '</span>' +
        '<div class="trace-chip-info">' +
          '<strong>' + ch.title + '</strong>' +
          '<span>' + ch.subtitle + '</span>' +
        '</div>';
      btn.onclick = function () {
        selectTraceChallenge(idx, true);
      };
      grid.appendChild(btn);
    });
  }

  function selectTraceChallenge(idx, speak) {
    window.detenerVozPrebasica();
    traceState.currentIdx = idx;
    traceState.userStrokes = [];
    traceState.completedCurrent = false;

    var canvas = document.getElementById('traceCanvas');
    var ch = TRACE_CHALLENGES[idx];
    var guideEl = document.getElementById('traceParentGuideText');
    if (guideEl && ch) guideEl.textContent = ch.guideText;

    if (canvas && ch) {
      var paths = ch.buildPaths(canvas.width, canvas.height);
      var wps = [];
      paths.forEach(function (p, pIdx) {
        p.forEach(function (pt, i) {
          wps.push({
            x: pt.x,
            y: pt.y,
            pathIdx: pIdx,
            isStart: i === 0,
            isEnd: i === p.length - 1,
            hit: false
          });
        });
      });
      traceState.waypoints = wps;
      traceState.paths = paths;
    }

    updateTraceProgressUI(0);
    var statusBanner = document.getElementById('traceStatusBanner');
    var statusMsg = document.getElementById('traceStatusMsg');
    if (statusBanner) statusBanner.classList.remove('celebrate');
    if (statusMsg && ch) {
      statusMsg.textContent = 'Pon tu dedito en ' + ch.startEmoji + ' y sigue los puntitos hasta llegar a ' + ch.endEmoji + '.';
    }

    renderTraceSelector();
    renderTraceCanvas();
    if (speak && ch) {
      window.hablarTexto(ch.ttsText, 'es-ES');
    }
  }

  function checkTraceWaypoints(pt) {
    var hitRadius = 42;
    var newlyHit = false;
    traceState.waypoints.forEach(function (wp) {
      if (!wp.hit) {
        var dx = pt.x - wp.x;
        var dy = pt.y - wp.y;
        if (Math.sqrt(dx * dx + dy * dy) <= hitRadius) {
          wp.hit = true;
          newlyHit = true;
        }
      }
    });

    if (newlyHit) {
      var total = traceState.waypoints.length || 1;
      var hits = traceState.waypoints.filter(function (w) { return w.hit; }).length;
      var pct = Math.min(100, Math.round((hits / total) * 100));
      updateTraceProgressUI(pct);

      if (pct >= 82 && !traceState.completedCurrent) {
        traceState.completedCurrent = true;
        updateTraceProgressUI(100);
        var ch = TRACE_CHALLENGES[traceState.currentIdx];
        if (ch && !state.completedTraces[ch.id]) {
          state.completedTraces[ch.id] = true;
          addXP(15, 's-trazos');
        } else {
          sonarCelebracion();
        }
        sonarCelebracion();
        var statusBanner = document.getElementById('traceStatusBanner');
        var statusMsg = document.getElementById('traceStatusMsg');
        if (statusBanner) statusBanner.classList.add('celebrate');
        if (statusMsg) {
          statusMsg.innerHTML = '🎉 <strong>¡Felicidades! ✓</strong> Completaste el trazo hasta la meta con mucho control.';
        }
        var esc = obtenerSaludoEscuela();
        var fel = esc ? ('¡Excelente trabajo en familia con ' + esc + '! Llegaste a la meta con un gran trazo.') : '¡Muy bien! Llegaste a la meta. ¡Excelente trazo!';
        window.hablarTexto(fel, 'es-ES');
        renderTraceSelector();
      }
    }
  }

  function updateTraceProgressUI(pct) {
    var fill = document.getElementById('traceProgressFill');
    var lbl = document.getElementById('traceProgressPct');
    if (fill) fill.style.width = pct + '%';
    if (lbl) lbl.textContent = pct + '%';
  }

  function renderTraceCanvas() {
    var canvas = document.getElementById('traceCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var ch = TRACE_CHALLENGES[traceState.currentIdx];
    if (!ch) return;

    ctx.clearRect(0, 0, w, h);

    // Renglones suaves de cuaderno preescolar
    ctx.save();
    ctx.strokeStyle = 'rgba(150, 165, 185, 0.18)';
    ctx.lineWidth = 1;
    for (var y = 40; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();

    var paths = traceState.paths || ch.buildPaths(w, h);

    // Carril de sombra suave y línea punteada guía
    paths.forEach(function (path) {
      if (!path || path.length < 2) return;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(path[0].x, path[0].y);
      for (var i = 1; i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
      }
      ctx.strokeStyle = 'rgba(230, 81, 0, 0.12)';
      ctx.lineWidth = 34;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      ctx.setLineDash([12, 14]);
      ctx.strokeStyle = '#95a5a6';
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.restore();
    });

    // Puntos de control iluminados al pasar el dedo
    traceState.waypoints.forEach(function (wp) {
      if (wp.hit) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 184, 148, 0.28)';
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    // Trazos pintados por el niño
    traceState.userStrokes.forEach(function (stroke) {
      var pts = stroke.points;
      if (!pts || pts.length === 0) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 22;

      if (pts.length === 1) {
        ctx.fillStyle = stroke.color === 'rainbow' ? 'hsl(' + pts[0].hue + ', 90%, 52%)' : stroke.color;
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, 11, 0, Math.PI * 2);
        ctx.fill();
      } else {
        for (var i = 1; i < pts.length; i++) {
          ctx.beginPath();
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
          ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = stroke.color === 'rainbow'
            ? 'hsl(' + pts[i].hue + ', 90%, 50%)'
            : stroke.color;
          ctx.stroke();
        }
      }
      ctx.restore();
    });

    // Iconos de Inicio (🟢) y Meta (🏁) en cada camino
    paths.forEach(function (path) {
      if (!path || path.length < 2) return;
      var start = path[0];
      var end = path[path.length - 1];

      // Círculo de inicio
      ctx.save();
      ctx.fillStyle = '#00b894';
      ctx.beginPath();
      ctx.arc(start.x, start.y, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Círculo de meta
      ctx.fillStyle = traceState.completedCurrent ? '#f1c40f' : '#e65100';
      ctx.beginPath();
      ctx.arc(end.x, end.y, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ch.startEmoji, start.x, start.y);
      ctx.fillText(ch.endEmoji, end.x, end.y);
      ctx.restore();
    });
  }

  window.seleccionarColorTrazo = function (color, btn) {
    traceState.color = color;
    var swatches = document.querySelectorAll('.color-swatch');
    swatches.forEach(function (s) { s.classList.remove('active'); });
    if (btn) btn.classList.add('active');
  };

  window.borrarTrazoActual = function () {
    selectTraceChallenge(traceState.currentIdx, false);
  };

  window.siguienteRetoTrazo = function () {
    var next = (traceState.currentIdx + 1) % TRACE_CHALLENGES.length;
    selectTraceChallenge(next, true);
  };

  window.leerRetoTrazoActual = function (btn) {
    var ch = TRACE_CHALLENGES[traceState.currentIdx];
    if (ch) {
      var esc = obtenerSaludoEscuela();
      var texto = esc ? ('¡Familia de ' + esc + '! ' + ch.ttsText) : ch.ttsText;
      window.hablarTexto(texto, 'es-ES', btn);
    }
  };

  /* ==========================================================================
     PESTAÑA 2: RODEA Y DESCUBRE (LETRAS, NÚMEROS Y NOCIONES ESPACIALES)
     ========================================================================== */
  var LETRAS_DATA = [
    { id: 'A', label: 'Vocal A a', esWord: 'Abeja', enWord: 'Apple', emoji: '🐝', esTTS: 'Rodea todas las tarjetas con la vocal A, como Abeja.' },
    { id: 'E', label: 'Vocal E e', esWord: 'Elefante', enWord: 'Elephant', emoji: '🐘', esTTS: 'Rodea todas las tarjetas con la vocal E, como Elefante.' },
    { id: 'I', label: 'Vocal I i', esWord: 'Iguana', enWord: 'Igloo', emoji: '🦎', esTTS: 'Rodea todas las tarjetas con la vocal I, como Iguana.' },
    { id: 'O', label: 'Vocal O o', esWord: 'Oso', enWord: 'Octopus', emoji: '🐻', esTTS: 'Rodea todas las tarjetas con la vocal O, como Oso.' },
    { id: 'U', label: 'Vocal U u', esWord: 'Uvas', enWord: 'Umbrella', emoji: '🍇', esTTS: 'Rodea todas las tarjetas con la vocal U, como Uvas.' },
    { id: 'B', label: 'ABC · B b', esWord: 'Barco', enWord: 'Ball', emoji: '⛵', esTTS: 'Rodea todas las letras B, como Barco.' },
    { id: 'C', label: 'ABC · C c', esWord: 'Casa', enWord: 'Cat', emoji: '🐱', esTTS: 'Rodea todas las letras C, como Casa.' },
    { id: 'D', label: 'ABC · D d', esWord: 'Dado', enWord: 'Dog', emoji: '🎲', esTTS: 'Rodea todas las letras D, como Dado.' },
    { id: 'F', label: 'ABC · F f', esWord: 'Foca', enWord: 'Fish', emoji: '🦭', esTTS: 'Rodea todas las letras F, como Foca.' },
    { id: 'M', label: 'ABC · M m', esWord: 'Mamá', enWord: 'Moon', emoji: '🌙', esTTS: 'Rodea todas las letras M, como Mamá.' },
    { id: 'P', label: 'ABC · P p', esWord: 'Pato', enWord: 'Pig', emoji: '🦆', esTTS: 'Rodea todas las letras P, como Pato.' },
    { id: 'S', label: 'ABC · S s', esWord: 'Sol', enWord: 'Star', emoji: '☀️', esTTS: 'Rodea todas las letras S, como Sol.' },
    { id: 'T', label: 'ABC · T t', esWord: 'Tortuga', enWord: 'Tiger', emoji: '🐢', esTTS: 'Rodea todas las letras T, como Tortuga.' }
  ];

  var NUMEROS_DATA = [
    { id: '1', num: 1, es: 'Uno', en: 'One', emoji: '☀️' },
    { id: '2', num: 2, es: 'Dos', en: 'Two', emoji: '🦆🦆' },
    { id: '3', num: 3, es: 'Tres', en: 'Three', emoji: '🍎🍎🍎' },
    { id: '4', num: 4, es: 'Cuatro', en: 'Four', emoji: '🦋🦋🦋🦋' },
    { id: '5', num: 5, es: 'Cinco', en: 'Five', emoji: '⭐⭐⭐⭐⭐' },
    { id: '6', num: 6, es: 'Seis', en: 'Six', emoji: '🍓🍓🍓🍓🍓🍓' },
    { id: '7', num: 7, es: 'Siete', en: 'Seven', emoji: '🐟🐟🐟🐟🐟🐟🐟' },
    { id: '8', num: 8, es: 'Ocho', en: 'Eight', emoji: '🎈🎈🎈🎈🎈🎈🎈🎈' },
    { id: '9', num: 9, es: 'Nueve', en: 'Nine', emoji: '🌼🌼🌼🌼🌼🌼🌼🌼🌼' },
    { id: '10', num: 10, es: 'Diez', en: 'Ten', emoji: '🐝🐝🐝🐝🐝🐝🐝🐝🐝🐝' }
  ];

  var ESPACIAL_DATA = [
    {
      id: 'detras_delante',
      label: '🧀 Detrás / Delante',
      promptEs: 'Rodea el ratón que está DETRÁS del queso y pinta el que está DELANTE',
      items: [
        { id: 'r1', main: '🧀🐭', title: 'Ratón DETRÁS del queso', sub: 'Asomándose por detrás (Behind)', correct: true, markType: 'circled' },
        { id: 'r2', main: '🐭🧀', title: 'Ratón DELANTE del queso', sub: 'Frente al queso (In front) · ¡Píntalo!', correct: true, markType: 'painted' },
        { id: 'r3', main: '🧀🍽️', title: 'Queso solo en el plato', sub: 'Sin ratoncito', correct: false },
        { id: 'r4', main: '🧀🐭', title: 'Ratón DETRÁS del queso', sub: 'Escondido detrás (Behind)', correct: true, markType: 'circled' }
      ]
    },
    {
      id: 'arriba_abajo',
      label: '🐞 Arriba de las flores',
      promptEs: 'Rodea las mariquitas que están ARRIBA de las flores',
      items: [
        { id: 'm1', main: '🐞⬆️🌻', title: 'Mariquita ARRIBA de la flor', sub: 'Volando arriba (Above)', correct: true, markType: 'circled' },
        { id: 'm2', main: '🌻⬇️🐞', title: 'Mariquita ABAJO en la tierra', sub: 'Abajo en el tallo (Below)', correct: false },
        { id: 'm3', main: '🐞⬆️🌷', title: 'Mariquita ARRIBA del tulipán', sub: 'Volando arriba (Above)', correct: true, markType: 'circled' },
        { id: 'm4', main: '🌺⬇️🐞', title: 'Mariquita ABAJO en la hoja', sub: 'Abajo en el suelo (Below)', correct: false },
        { id: 'm5', main: '🐞⬆️🌼', title: 'Mariquita ARRIBA de la margarita', sub: 'Volando arriba (Above)', correct: true, markType: 'circled' },
        { id: 'm6', main: '🌻⬇️🐞', title: 'Mariquita ABAJO de la maceta', sub: 'Abajo (Below)', correct: false }
      ]
    },
    {
      id: 'grande_pequeno',
      label: '🐘 Grande / Pequeño',
      promptEs: 'Marca con X el objeto GRANDE y rodea el objeto PEQUEÑO en cada pareja',
      items: [
        { id: 'gp1', main: '🐘', sizeStyle: 'font-size:3.1rem;', title: 'Elefante GRANDE (Big)', sub: '¡Márcalo con ❌!', correct: true, markType: 'crossed' },
        { id: 'gp2', main: '🐘', sizeStyle: 'font-size:1.35rem;', title: 'Elefantito PEQUEÑO (Small)', sub: '¡Rodéalo con ⭕!', correct: true, markType: 'circled' },
        { id: 'gp3', main: '⚽', sizeStyle: 'font-size:3.1rem;', title: 'Pelota GRANDE (Big)', sub: '¡Márcala con ❌!', correct: true, markType: 'crossed' },
        { id: 'gp4', main: '⚽', sizeStyle: 'font-size:1.35rem;', title: 'Pelotita PEQUEÑA (Small)', sub: '¡Rodéala con ⭕!', correct: true, markType: 'circled' }
      ]
    },
    {
      id: 'lleno_vacio',
      label: '🧺 Lleno / Vacío',
      promptEs: 'Rodea los recipientes LLENOS y marca con X los que están VACÍOS',
      items: [
        { id: 'lv1', main: '🧺🍎🍊🍇', title: 'Canasta LLENA de frutas', sub: 'Full · ¡Rodéala con ⭕!', correct: true, markType: 'circled' },
        { id: 'lv2', main: '🧺', title: 'Canasta VACÍA', sub: 'Empty · ¡Márcala con ❌!', correct: true, markType: 'crossed' },
        { id: 'lv3', main: '🫙🍬🍭🍫', title: 'Frasco LLENO de dulces', sub: 'Full · ¡Rodéalo con ⭕!', correct: true, markType: 'circled' },
        { id: 'lv4', main: '🫙', title: 'Frasco VACÍO', sub: 'Empty · ¡Márcalo con ❌!', correct: true, markType: 'crossed' }
      ]
    },
    {
      id: 'dactilo',
      label: '🎨 Dactilopintura Adentro / Afuera',
      promptEs: 'Dactilopintura digital: pon huellitas de pintura ADENTRO o AFUERA de la figura (manzana, uvas, caballito de mar)'
    }
  ];

  var rodeaState = {
    category: 'letras',
    targetId: 'A',
    interactionMode: 'lasso', // 'lasso' o 'tap'
    cards: [],
    foundCount: 0,
    totalTargets: 0,
    lassoPoints: [],
    isLassoing: false
  };

  function initRodeaTab() {
    setupLassoCanvas();
    initDactiloCanvas();
    seleccionarCategoriaRodea('letras');
  }

  window.cambiarModoRodea = function (modo) {
    window.detenerAudioPrebasica();
    rodeaState.interactionMode = modo;
    var bLasso = document.getElementById('btnModoLasso');
    var bTap = document.getElementById('btnModoTap');
    var wrap = document.getElementById('rodeaBoardWrap');
    if (bLasso) bLasso.classList.toggle('active-chip', modo === 'lasso');
    if (bTap) bTap.classList.toggle('active-chip', modo === 'tap');
    if (wrap) wrap.classList.toggle('rodea-lasso-disabled', modo === 'tap');
  };

  window.seleccionarCategoriaRodea = function (cat) {
    window.detenerVozPrebasica();
    rodeaState.category = cat;
    document.getElementById('subtabLetras').classList.toggle('active-chip', cat === 'letras');
    document.getElementById('subtabNumeros').classList.toggle('active-chip', cat === 'numeros');
    document.getElementById('subtabEspacial').classList.toggle('active-chip', cat === 'espacial');

    if (cat === 'letras') {
      rodeaState.targetId = 'A';
    } else if (cat === 'numeros') {
      rodeaState.targetId = '1';
    } else {
      rodeaState.targetId = 'detras_delante';
    }
    renderRodeaPills();
    buildRodeaExercise();
  };

  function renderRodeaPills() {
    var bar = document.getElementById('rodeaTargetPills');
    if (!bar) return;
    bar.innerHTML = '';

    var list = rodeaState.category === 'letras'
      ? LETRAS_DATA
      : (rodeaState.category === 'numeros' ? NUMEROS_DATA : ESPACIAL_DATA);

    list.forEach(function (item) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'target-pill' + (item.id === rodeaState.targetId ? ' active' : '');
      if (rodeaState.category === 'letras') {
        btn.textContent = item.emoji + ' ' + item.label;
      } else if (rodeaState.category === 'numeros') {
        btn.textContent = item.id + ' · ' + item.es;
      } else {
        btn.textContent = item.label;
      }
      btn.onclick = function () {
        window.detenerVozPrebasica();
        rodeaState.targetId = item.id;
        renderRodeaPills();
        buildRodeaExercise();
      };
      bar.appendChild(btn);
    });
  }

  function shuffleArray(arr) {
    var copy = arr.slice();
    for (var i = copy.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function buildRodeaExercise() {
    var boardWrap = document.getElementById('rodeaBoardWrap');
    var dactiloCont = document.getElementById('dactiloContainer');
    var promptEs = document.getElementById('rodeaPromptEs');
    var promptEn = document.getElementById('rodeaPromptEn');
    var statusBanner = document.getElementById('rodeaStatusBanner');
    var statusMsg = document.getElementById('rodeaStatusMsg');
    if (statusBanner) statusBanner.classList.remove('celebrate');

    if (rodeaState.category === 'espacial' && rodeaState.targetId === 'dactilo') {
      if (boardWrap) boardWrap.style.display = 'none';
      if (dactiloCont) dactiloCont.style.display = 'block';
      updateDactiloPromptText();
      renderDactiloCanvas();
      return;
    }

    if (boardWrap) boardWrap.style.display = 'block';
    if (dactiloCont) dactiloCont.style.display = 'none';

    var cards = [];
    if (rodeaState.category === 'letras') {
      var targetL = LETRAS_DATA.find(function (l) { return l.id === rodeaState.targetId; }) || LETRAS_DATA[0];
      if (promptEs) promptEs.textContent = '⭕ Rodea todas las letras «' + targetL.id + '» (' + targetL.esWord + ')';
      if (promptEn) promptEn.textContent = '🇺🇸 Pronunciación en inglés: ' + targetL.id + ' (toca el botón English para escucharla)';

      var othersL = LETRAS_DATA.filter(function (l) { return l.id !== targetL.id; });
      for (var i = 0; i < 4; i++) {
        cards.push({
          uid: 't_' + i,
          main: (i % 2 === 0 ? targetL.id : targetL.id.toLowerCase()) + ' ' + targetL.emoji,
          title: targetL.id + ' · ' + targetL.esWord,
          sub: targetL.enWord,
          enVocab: targetL.id,
          correct: true,
          markType: 'circled',
          done: false
        });
      }
      shuffleArray(othersL).slice(0, 4).forEach(function (o, idx) {
        cards.push({
          uid: 'd_' + idx,
          main: o.id + ' ' + o.emoji,
          title: o.id + ' · ' + o.esWord,
          sub: o.enWord,
          enVocab: o.id,
          correct: false,
          done: false
        });
      });
      cards = shuffleArray(cards);
    } else if (rodeaState.category === 'numeros') {
      var targetN = NUMEROS_DATA.find(function (n) { return n.id === rodeaState.targetId; }) || NUMEROS_DATA[0];
      if (promptEs) promptEs.textContent = '⭕ Rodea todos los números «' + targetN.id + '» (' + targetN.es + ')';
      if (promptEn) promptEn.textContent = '🇺🇸 Pronunciación en inglés: ' + targetN.en + ' (toca el botón English para escucharla)';

      var othersN = NUMEROS_DATA.filter(function (n) { return n.id !== targetN.id; });
      for (var k = 0; k < 4; k++) {
        cards.push({
          uid: 'nt_' + k,
          main: targetN.id,
          title: targetN.es + ' / ' + targetN.en,
          sub: targetN.emoji,
          enVocab: targetN.en,
          correct: true,
          markType: 'circled',
          done: false
        });
      }
      shuffleArray(othersN).slice(0, 4).forEach(function (o, idx) {
        cards.push({
          uid: 'nd_' + idx,
          main: o.id,
          title: o.es + ' / ' + o.en,
          sub: o.emoji,
          enVocab: o.en,
          correct: false,
          done: false
        });
      });
      cards = shuffleArray(cards);
    } else {
      var esp = ESPACIAL_DATA.find(function (e) { return e.id === rodeaState.targetId; }) || ESPACIAL_DATA[0];
      if (promptEs) promptEs.textContent = '🧭 ' + esp.promptEs;
      if (promptEn) promptEn.textContent = '🇺🇸 Nociones espaciales básicas en familia';
      cards = esp.items.map(function (it, idx) {
        return {
          uid: 'esp_' + idx,
          main: it.main,
          sizeStyle: it.sizeStyle || '',
          title: it.title,
          sub: it.sub,
          correct: it.correct,
          markType: it.markType || 'circled',
          done: false
        };
      });
    }

    rodeaState.cards = cards;
    rodeaState.foundCount = 0;
    rodeaState.totalTargets = cards.filter(function (c) { return c.correct; }).length;

    if (statusMsg) {
      statusMsg.textContent = 'Encuentra y rodea las ' + rodeaState.totalTargets + ' tarjetas correctas (0 / ' + rodeaState.totalTargets + ').';
    }

    renderRodeaCardsDOM();
    setTimeout(syncLassoCanvasSize, 30);
  }

  function renderRodeaCardsDOM() {
    var grid = document.getElementById('rodeaItemsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    rodeaState.cards.forEach(function (card, index) {
      var div = document.createElement('div');
      div.className = 'rodea-item-card' + (card.done ? ' ' + card.markType : '');
      div.setAttribute('data-idx', String(index));
      div.setAttribute('role', 'button');
      div.setAttribute('tabindex', '0');

      var enBtnHtml = '';
      if (card.enVocab) {
        enBtnHtml = '<button type="button" class="btn-card-audio-en" onclick="event.stopPropagation(); hablarTexto(\'' + card.enVocab + '\', \'en-US\', this);" title="Escuchar en inglés">🇺🇸 ' + card.enVocab + '</button>';
      }

      div.innerHTML =
        '<div class="rodea-item-main" style="' + (card.sizeStyle || '') + '">' + card.main + '</div>' +
        '<div style="font-family:\'Fredoka\',sans-serif;font-size:0.92rem;">' + card.title + '</div>' +
        '<div class="rodea-item-sub">' + card.sub + '</div>' +
        enBtnHtml;
      div.onclick = function () {
        activateRodeaCard(index, div);
      };
      grid.appendChild(div);
    });
  }

  function activateRodeaCard(index, domEl) {
    var card = rodeaState.cards[index];
    if (!card || card.done) return;

    if (!domEl) {
      domEl = document.querySelector('.rodea-item-card[data-idx="' + index + '"]');
    }

    if (card.correct) {
      card.done = true;
      rodeaState.foundCount++;
      if (domEl) domEl.classList.add(card.markType || 'circled');
      sonarAcierto();

      if (card.enVocab) {
        setTimeout(function () {
          window.hablarTexto(card.enVocab, 'en-US');
        }, 120);
      }

      var statusBanner = document.getElementById('rodeaStatusBanner');
      var statusMsg = document.getElementById('rodeaStatusMsg');
      if (rodeaState.foundCount >= rodeaState.totalTargets) {
        sonarCelebracion();
        if (statusBanner) statusBanner.classList.add('celebrate');
        if (statusMsg) {
          statusMsg.innerHTML = '🌟 <strong>¡Excelente! ✓</strong> Encontraste todas las respuestas (' + rodeaState.foundCount + ' / ' + rodeaState.totalTargets + ').';
        }
        var key = rodeaState.category + '_' + rodeaState.targetId;
        if (!state.completedRodea[key]) {
          state.completedRodea[key] = true;
          addXP(15, 's-rodea');
        }
        var esc = obtenerSaludoEscuela();
        var fel = esc ? ('¡Excelente trabajo en familia con ' + esc + '! Completaste todo el tablero.') : '¡Muy bien hecho! Completaste todo el tablero.';
        window.hablarTexto(fel, 'es-ES');
      } else if (statusMsg) {
        statusMsg.textContent = '¡Muy bien! ✓ Llevas ' + rodeaState.foundCount + ' de ' + rodeaState.totalTargets + '. ¡Sigue buscando!';
      }
    } else {
      sonarSuaveError();
      if (domEl) {
        domEl.classList.remove('wrong-shake');
        void domEl.offsetWidth;
        domEl.classList.add('wrong-shake');
      }
    }
  }

  /* Lienzo superpuesto para rodear dibujando un círculo con el dedo */
  function syncLassoCanvasSize() {
    var wrap = document.getElementById('rodeaBoardWrap');
    var canvas = document.getElementById('rodeaLassoCanvas');
    if (!wrap || !canvas) return;
    canvas.width = wrap.clientWidth || 800;
    canvas.height = wrap.clientHeight || 360;
  }

  function setupLassoCanvas() {
    var canvas = document.getElementById('rodeaLassoCanvas');
    var wrap = document.getElementById('rodeaBoardWrap');
    if (!canvas || !wrap) return;

    function getPt(e) {
      var rect = canvas.getBoundingClientRect();
      var cx, cy;
      if (e.touches && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        cx = e.changedTouches[0].clientX;
        cy = e.changedTouches[0].clientY;
      } else {
        cx = e.clientX;
        cy = e.clientY;
      }
      return {
        x: (cx - rect.left) * (canvas.width / (rect.width || 1)),
        y: (cy - rect.top) * (canvas.height / (rect.height || 1)),
        clientX: cx,
        clientY: cy
      };
    }

    function startLasso(e) {
      if (rodeaState.interactionMode === 'tap') return;
      if (e.cancelable) e.preventDefault();
      syncLassoCanvasSize();
      rodeaState.isLassoing = true;
      rodeaState.lassoPoints = [getPt(e)];
      drawLassoTrail();
    }

    function moveLasso(e) {
      if (!rodeaState.isLassoing) return;
      if (e.cancelable) e.preventDefault();
      rodeaState.lassoPoints.push(getPt(e));
      drawLassoTrail();
    }

    function endLasso(e) {
      if (!rodeaState.isLassoing) return;
      if (e && e.cancelable) e.preventDefault();
      rodeaState.isLassoing = false;
      evaluateLassoSelection();
      setTimeout(clearLassoTrail, 260);
    }

    canvas.addEventListener('mousedown', startLasso);
    canvas.addEventListener('mousemove', moveLasso);
    window.addEventListener('mouseup', endLasso);

    canvas.addEventListener('touchstart', startLasso, { passive: false });
    canvas.addEventListener('touchmove', moveLasso, { passive: false });
    canvas.addEventListener('touchend', endLasso, { passive: false });
  }

  function drawLassoTrail() {
    var canvas = document.getElementById('rodeaLassoCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var pts = rodeaState.lassoPoints;
    if (!pts || pts.length < 2) return;
    ctx.save();
    ctx.strokeStyle = '#e65100';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i].x, pts[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function clearLassoTrail() {
    var canvas = document.getElementById('rodeaLassoCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function evaluateLassoSelection() {
    var pts = rodeaState.lassoPoints;
    if (!pts || pts.length === 0) return;

    // Calculamos centroide del gesto (o punto de toque si fue un toque rápido)
    var sumX = 0;
    var sumY = 0;
    pts.forEach(function (p) {
      sumX += p.clientX;
      sumY += p.clientY;
    });
    var centerClientX = sumX / pts.length;
    var centerClientY = sumY / pts.length;

    var cardEls = document.querySelectorAll('#rodeaItemsGrid .rodea-item-card');
    cardEls.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (centerClientX >= r.left && centerClientX <= r.right &&
          centerClientY >= r.top && centerClientY <= r.bottom) {
        var idx = Number(el.getAttribute('data-idx'));
        activateRodeaCard(idx, el);
      }
    });
  }

  window.reiniciarEjercicioRodea = function () {
    window.detenerVozPrebasica();
    buildRodeaExercise();
  };

  window.hablarConsignaRodea = function (lang, btn) {
    var esc = obtenerSaludoEscuela();
    var prefijo = esc ? ('¡Familia de ' + esc + '! ') : '';
    if (rodeaState.category === 'espacial' && rodeaState.targetId === 'dactilo') {
      window.hablarTexto(
        prefijo + 'Pon huellitas de pintura ' + dactiloState.zone.toUpperCase() + ' de la figura: ' + dactiloState.figureEs + '.',
        'es-ES',
        btn
      );
      return;
    }

    if (rodeaState.category === 'letras') {
      var l = LETRAS_DATA.find(function (x) { return x.id === rodeaState.targetId; }) || LETRAS_DATA[0];
      window.hablarTexto(prefijo + l.esTTS, 'es-ES', btn);
    } else if (rodeaState.category === 'numeros') {
      var n = NUMEROS_DATA.find(function (x) { return x.id === rodeaState.targetId; }) || NUMEROS_DATA[0];
      window.hablarTexto(prefijo + 'Rodea todos los números ' + n.id + ', ' + n.es + '.', 'es-ES', btn);
    } else {
      var esp = ESPACIAL_DATA.find(function (x) { return x.id === rodeaState.targetId; }) || ESPACIAL_DATA[0];
      window.hablarTexto(prefijo + esp.promptEs + '.', 'es-ES', btn);
    }
  };

  window.hablarVocabularioInglesRodea = function (btn) {
    if (rodeaState.category === 'espacial' && rodeaState.targetId === 'dactilo') {
      window.hablarTexto(dactiloState.figureEn || 'Apple', 'en-US', btn);
      return;
    }
    if (rodeaState.category === 'letras') {
      var l = LETRAS_DATA.find(function (x) { return x.id === rodeaState.targetId; }) || LETRAS_DATA[0];
      window.hablarTexto(l.id, 'en-US', btn);
    } else if (rodeaState.category === 'numeros') {
      var n = NUMEROS_DATA.find(function (x) { return x.id === rodeaState.targetId; }) || NUMEROS_DATA[0];
      window.hablarTexto(n.en, 'en-US', btn);
    } else {
      window.hablarTexto('Apple', 'en-US', btn);
    }
  };

  /* --------------------------------------------------------------------------
     DACTILOPINTURA DIGITAL ADENTRO / AFUERA (MANZANA, UVAS, CABALLITO DE MAR)
     -------------------------------------------------------------------------- */
  var dactiloState = {
    figure: 'manzana',
    figureEs: 'Manzana',
    figureEn: 'Apple',
    zone: 'adentro', // 'adentro' o 'afuera'
    stamps: [],
    validCount: 0,
    goalCount: 10
  };

  var DACTILO_COLORS = ['#e74c3c', '#0984e3', '#00b894', '#f39c12', '#8e44ad', '#e84393'];

  function buildFigurePath2D(fig, w, h) {
    var p = new Path2D();
    var cx = w / 2;
    var cy = h / 2 + 12;

    if (fig === 'manzana') {
      // Silueta amplia de Manzana
      p.moveTo(cx, cy - 95);
      p.bezierCurveTo(cx - 95, cy - 135, cx - 155, cy - 20, cx - 105, cy + 85);
      p.bezierCurveTo(cx - 65, cy + 140, cx - 15, cy + 125, cx, cy + 105);
      p.bezierCurveTo(cx + 15, cy + 125, cx + 65, cy + 140, cx + 105, cy + 85);
      p.bezierCurveTo(cx + 155, cy - 20, cx + 95, cy - 135, cx, cy - 95);
      p.closePath();
    } else if (fig === 'uvas') {
      // Silueta de Racimo de Uvas (contorno envolvente grande)
      p.ellipse(cx, cy + 5, 125, 130, 0, 0, Math.PI * 2);
    } else {
      // Silueta de Caballito de Mar
      p.moveTo(cx - 20, cy - 135);
      p.bezierCurveTo(cx + 75, cy - 135, cx + 95, cy - 55, cx + 45, cy - 10);
      p.bezierCurveTo(cx + 95, cy + 35, cx + 70, cy + 115, cx - 5, cy + 140);
      p.bezierCurveTo(cx - 65, cy + 145, cx - 80, cy + 95, cx - 35, cy + 75);
      p.bezierCurveTo(cx - 75, cy + 25, cx - 75, cy - 85, cx - 20, cy - 135);
      p.closePath();
    }
    return p;
  }

  function initDactiloCanvas() {
    var canvas = document.getElementById('dactiloCanvas');
    if (!canvas) return;

    function stampAt(e) {
      if (e.cancelable) e.preventDefault();
      var rect = canvas.getBoundingClientRect();
      var cx, cy;
      if (e.touches && e.touches.length > 0) {
        cx = e.touches[0].clientX;
        cy = e.touches[0].clientY;
      } else {
        cx = e.clientX;
        cy = e.clientY;
      }
      var x = (cx - rect.left) * (canvas.width / (rect.width || 1));
      var y = (cy - rect.top) * (canvas.height / (rect.height || 1));

      var ctx = canvas.getContext('2d');
      var path = buildFigurePath2D(dactiloState.figure, canvas.width, canvas.height);
      var inside = ctx.isPointInPath(path, x, y);
      var isCorrect = (dactiloState.zone === 'adentro' && inside) ||
                      (dactiloState.zone === 'afuera' && !inside);

      var color = DACTILO_COLORS[dactiloState.stamps.length % DACTILO_COLORS.length];
      dactiloState.stamps.push({
        x: x,
        y: y,
        color: color,
        ok: isCorrect
      });

      if (isCorrect) {
        dactiloState.validCount++;
        sonarAcierto();
      } else {
        sonarSuaveError();
      }

      renderDactiloCanvas();
      updateDactiloStatus();
    }

    canvas.addEventListener('mousedown', stampAt);
    canvas.addEventListener('touchstart', stampAt, { passive: false });
  }

  function updateDactiloPromptText() {
    var map = {
      manzana: { es: 'Manzana 🍎', en: 'Apple' },
      uvas: { es: 'Racimo de Uvas 🍇', en: 'Grapes' },
      caballito: { es: 'Caballito de Mar 🐴🌊', en: 'Seahorse' }
    };
    var info = map[dactiloState.figure] || map.manzana;
    dactiloState.figureEs = info.es;
    dactiloState.figureEn = info.en;

    var promptEs = document.getElementById('rodeaPromptEs');
    var promptEn = document.getElementById('rodeaPromptEn');
    if (promptEs) {
      promptEs.textContent = '🎨 Dactilopintura: Estampa 10 huellitas con tu dedo ' +
        dactiloState.zone.toUpperCase() + ' de la figura (' + info.es + ')';
    }
    if (promptEn) {
      promptEn.textContent = '🇺🇸 Vocabulario en inglés: ' + info.en + ' (toca el botón English para escucharlo)';
    }
    updateDactiloStatus();
  }

  function updateDactiloStatus() {
    var statusBanner = document.getElementById('rodeaStatusBanner');
    var statusMsg = document.getElementById('rodeaStatusMsg');
    if (dactiloState.validCount >= dactiloState.goalCount) {
      if (statusBanner) statusBanner.classList.add('celebrate');
      if (statusMsg) {
        statusMsg.innerHTML = '🎉 <strong>¡Obra de arte completada! ✓</strong> Pusiste ' +
          dactiloState.validCount + ' huellitas ' + dactiloState.zone.toUpperCase() + ' de la figura.';
      }
      var key = 'dactilo_' + dactiloState.figure + '_' + dactiloState.zone;
      if (!state.completedRodea[key]) {
        state.completedRodea[key] = true;
        sonarCelebracion();
        addXP(15, 's-rodea');
        var esc = obtenerSaludoEscuela();
        var fel = esc ? ('¡Excelente trabajo en familia con ' + esc + '! Qué linda pintura con tus deditos.') : '¡Qué linda pintura con tus deditos! Lo hiciste excelente.';
        window.hablarTexto(fel, 'es-ES');
      }
    } else {
      if (statusBanner) statusBanner.classList.remove('celebrate');
      if (statusMsg) {
        statusMsg.textContent = 'Huellitas correctas ' + dactiloState.zone.toUpperCase() + ': ' +
          dactiloState.validCount + ' de ' + dactiloState.goalCount + '. ¡Toca con tu dedito!';
      }
    }
  }

  function renderDactiloCanvas() {
    var canvas = document.getElementById('dactiloCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var cx = w / 2;
    var cy = h / 2 + 12;

    ctx.clearRect(0, 0, w, h);

    var path = buildFigurePath2D(dactiloState.figure, w, h);

    // Resaltado sutil de la zona objetivo
    ctx.save();
    if (dactiloState.zone === 'afuera') {
      ctx.fillStyle = 'rgba(0, 184, 148, 0.06)';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.fillStyle = dactiloState.zone === 'adentro' ? 'rgba(255, 234, 167, 0.35)' : '#ffffff';
    ctx.fill(path);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#2d3436';
    ctx.stroke(path);
    ctx.restore();

    // Detalles internos decorativos de la figura (tallos/hojas/ojito)
    ctx.save();
    ctx.font = '28px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    if (dactiloState.figure === 'manzana') {
      ctx.fillText('🍃', cx + 18, cy - 112);
    } else if (dactiloState.figure === 'uvas') {
      ctx.fillText('🍃🍇', cx, cy - 135);
      // Círculos guía suaves de uvas dentro del racimo
      ctx.strokeStyle = 'rgba(108, 92, 231, 0.28)';
      ctx.lineWidth = 2;
      var grapeOffsets = [
        [0, -65], [-45, -55], [45, -55],
        [-65, -5], [0, -5], [65, -5],
        [-45, 50], [0, 50], [45, 50], [0, 95]
      ];
      grapeOffsets.forEach(function (of) {
        ctx.beginPath();
        ctx.arc(cx + of[0], cy + of[1], 28, 0, Math.PI * 2);
        ctx.stroke();
      });
    } else {
      ctx.fillText('👑', cx - 5, cy - 145);
      ctx.fillStyle = '#2d3436';
      ctx.beginPath();
      ctx.arc(cx + 15, cy - 90, 6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // Dibujar huellitas dactilares estampadas
    dactiloState.stamps.forEach(function (st) {
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.fillStyle = st.color;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.ellipse(0, 0, 18, 23, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Líneas concéntricas de huella dactilar
      ctx.strokeStyle = 'rgba(255,255,255,0.55)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 2, 9, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();

      // Marca no-color ✓ o ✗
      ctx.globalAlpha = 1;
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(st.ok ? '✓' : '✗', 0, 0);
      ctx.restore();
    });
  }

  window.cambiarFiguraDactilo = function (fig) {
    window.detenerVozPrebasica();
    dactiloState.figure = fig;
    if (fig === 'manzana') {
      dactiloState.figureEs = 'Manzana';
      dactiloState.figureEn = 'Apple';
    } else if (fig === 'uvas') {
      dactiloState.figureEs = 'Uvas';
      dactiloState.figureEn = 'Grapes';
    } else {
      dactiloState.figureEs = 'Caballito de Mar';
      dactiloState.figureEn = 'Seahorse';
    }
    dactiloState.stamps = [];
    dactiloState.validCount = 0;
    document.getElementById('btnFigManzana').classList.toggle('active-chip', fig === 'manzana');
    document.getElementById('btnFigUvas').classList.toggle('active-chip', fig === 'uvas');
    document.getElementById('btnFigCaballito').classList.toggle('active-chip', fig === 'caballito');
    updateDactiloPromptText();
    renderDactiloCanvas();
  };

  window.cambiarZonaDactilo = function (zona) {
    window.detenerVozPrebasica();
    dactiloState.zone = zona;
    dactiloState.stamps = [];
    dactiloState.validCount = 0;
    document.getElementById('btnZonaAdentro').classList.toggle('secondary', zona === 'adentro');
    document.getElementById('btnZonaAfuera').classList.toggle('secondary', zona === 'afuera');
    updateDactiloPromptText();
    renderDactiloCanvas();
  };

  window.limpiarDactilo = function () {
    window.detenerVozPrebasica();
    dactiloState.stamps = [];
    dactiloState.validCount = 0;
    updateDactiloPromptText();
    renderDactiloCanvas();
  };

  /* ==========================================================================
     PESTAÑA 3: ROMPECABEZAS DE NÚMEROS, CUERPO HUMANO, COLORES Y FIGURAS
     ========================================================================== */
  var puzzleState = {
    currentGame: 'numeros', // 'numeros', 'cuerpo', 'carros'
    numBlock: '1_5',        // '1_5' o '6_10'
    carSubMode: 'colores',  // 'colores' o 'figuras'
    selectedPieceId: null,
    placedMap: {}
  };

  var BODY_PARTS_BOOK = [
    {
      id: 'cabeza',
      order: 1,
      es: '1. Cabeza',
      en: 'Head',
      desc: 'Parte superior: ojos, nariz, boca y orejas',
      svg: '<svg width="58" height="58" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="34" r="22" fill="#ffccaa" stroke="#2d3436" stroke-width="3"/><path d="M12 28 C14 10, 50 10, 52 28 C44 18, 20 18, 12 28 Z" fill="#4a2c11"/><circle cx="24" cy="33" r="3" fill="#2d3436"/><circle cx="40" cy="33" r="3" fill="#2d3436"/><path d="M24 44 Q32 51 40 44" fill="none" stroke="#d63031" stroke-width="3" stroke-linecap="round"/></svg>'
    },
    {
      id: 'tronco',
      order: 2,
      es: '2. Tronco',
      en: 'Trunk',
      desc: 'Pecho, espalda y abdomen (centro del cuerpo)',
      svg: '<svg width="58" height="58" viewBox="0 0 64 64" aria-hidden="true"><rect x="16" y="10" width="32" height="44" rx="10" fill="#0984e3" stroke="#2d3436" stroke-width="3"/><circle cx="32" cy="32" r="7" fill="#ffeaa7"/></svg>'
    },
    {
      id: 'brazos',
      order: 3,
      es: '3. Brazos y Manos',
      en: 'Arms and Hands',
      desc: 'Extremidades superiores para abrazar y pintar',
      svg: '<svg width="58" height="58" viewBox="0 0 64 64" aria-hidden="true"><path d="M8 38 L26 22 M56 38 L38 22" stroke="#ffccaa" stroke-width="9" stroke-linecap="round"/><circle cx="8" cy="40" r="6" fill="#ffccaa" stroke="#2d3436" stroke-width="2"/><circle cx="56" cy="40" r="6" fill="#ffccaa" stroke="#2d3436" stroke-width="2"/></svg>'
    },
    {
      id: 'piernas',
      order: 4,
      es: '4. Piernas y Pies',
      en: 'Legs and Feet',
      desc: 'Extremidades inferiores para caminar, correr y saltar',
      svg: '<svg width="58" height="58" viewBox="0 0 64 64" aria-hidden="true"><rect x="18" y="8" width="11" height="38" rx="5" fill="#00897b" stroke="#2d3436" stroke-width="2.5"/><rect x="35" y="8" width="11" height="38" rx="5" fill="#00897b" stroke="#2d3436" stroke-width="2.5"/><ellipse cx="21" cy="50" rx="9" ry="5" fill="#d63031"/><ellipse cx="43" cy="50" rx="9" ry="5" fill="#d63031"/></svg>'
    }
  ];

  var CAR_COLORS = [
    { id: 'red', es: 'Rojo', en: 'Red', hex: '#d63031', emoji: '🚗' },
    { id: 'blue', es: 'Azul', en: 'Blue', hex: '#0984e3', emoji: '🚙' },
    { id: 'yellow', es: 'Amarillo', en: 'Yellow', hex: '#f39c12', emoji: '🚕' },
    { id: 'green', es: 'Verde', en: 'Green', hex: '#00b894', emoji: '🚜' },
    { id: 'orange', es: 'Naranja', en: 'Orange', hex: '#e65100', emoji: '🏎️' },
    { id: 'violet', es: 'Morado', en: 'Violet', hex: '#6c5ce7', emoji: '🚐' }
  ];

  var GEOMETRIC_SHAPES = [
    { id: 'circulo', es: 'Círculo', en: 'Circle', color: '#e74c3c', svg: '<svg width="54" height="54" viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" fill="#e74c3c" stroke="#2d3436" stroke-width="3"/></svg>' },
    { id: 'cuadrado', es: 'Cuadrado', en: 'Square', color: '#0984e3', svg: '<svg width="54" height="54" viewBox="0 0 60 60"><rect x="8" y="8" width="44" height="44" fill="#0984e3" stroke="#2d3436" stroke-width="3"/></svg>' },
    { id: 'triangulo', es: 'Triángulo', en: 'Triangle', color: '#00b894', svg: '<svg width="54" height="54" viewBox="0 0 60 60"><polygon points="30,6 55,52 5,52" fill="#00b894" stroke="#2d3436" stroke-width="3"/></svg>' },
    { id: 'rectangulo', es: 'Rectángulo', en: 'Rectangle', color: '#f39c12', svg: '<svg width="54" height="54" viewBox="0 0 60 60"><rect x="4" y="15" width="52" height="30" fill="#f39c12" stroke="#2d3436" stroke-width="3"/></svg>' },
    { id: 'ovalo', es: 'Óvalo', en: 'Oval', color: '#9b59b6', svg: '<svg width="54" height="54" viewBox="0 0 60 60"><ellipse cx="30" cy="30" rx="26" ry="16" fill="#9b59b6" stroke="#2d3436" stroke-width="3"/></svg>' },
    { id: 'rombo', es: 'Rombo', en: 'Diamond', color: '#16a085', svg: '<svg width="54" height="54" viewBox="0 0 60 60"><polygon points="30,5 55,30 30,55 5,30" fill="#16a085" stroke="#2d3436" stroke-width="3"/></svg>' },
    { id: 'estrella', es: 'Estrella', en: 'Star', color: '#f1c40f', svg: '<svg width="54" height="54" viewBox="0 0 60 60"><polygon points="30,4 37,21 56,22 41,34 46,53 30,42 14,53 19,34 4,22 23,21" fill="#f1c40f" stroke="#2d3436" stroke-width="2.5"/></svg>' },
    { id: 'corazon', es: 'Corazón', en: 'Heart', color: '#e84393', svg: '<svg width="54" height="54" viewBox="0 0 60 60"><path d="M30 52 C30 52 7 37 7 20 C7 11 15 6 23 10 C27 12 30 16 30 16 C30 16 33 12 37 10 C45 6 53 11 53 20 C53 37 30 52 30 52 Z" fill="#e84393" stroke="#2d3436" stroke-width="2.5"/></svg>' }
  ];

  window.mostrarRompecabezas = function (tipo) {
    if (window.detenerVozPrebasica) window.detenerVozPrebasica();
    puzzleState.currentGame = tipo;
    puzzleState.selectedPieceId = null;
    puzzleState.placedMap = {};

    document.getElementById('pzTabNumeros').classList.toggle('active-chip', tipo === 'numeros');
    document.getElementById('pzTabCuerpo').classList.toggle('active-chip', tipo === 'cuerpo');
    document.getElementById('pzTabCarros').classList.toggle('active-chip', tipo === 'carros');

    renderCurrentPuzzle();
  };

  window.reiniciarRompecabezasActual = function () {
    if (window.detenerVozPrebasica) window.detenerVozPrebasica();
    puzzleState.selectedPieceId = null;
    puzzleState.placedMap = {};
    renderCurrentPuzzle();
  };

  window.leerInstruccionRompecabezas = function (btn) {
    var esc = obtenerSaludoEscuela();
    var prefijo = esc ? ('¡Familia de ' + esc + '! ') : '';
    if (puzzleState.currentGame === 'numeros') {
      window.hablarTexto(prefijo + 'Rompecabezas de los números: toca cada ficha numérica y colócala en su silueta contando los dibujos en orden.', 'es-ES', btn);
    } else if (puzzleState.currentGame === 'cuerpo') {
      window.hablarTexto(prefijo + 'Rompecabezas del cuerpo humano, página cincuenta y nueve: coloca en orden vertical la Cabeza, el Tronco, los Brazos y las Piernas.', 'es-ES', btn);
    } else if (puzzleState.carSubMode === 'colores') {
      window.hablarTexto(prefijo + 'Estaciona cada carrito en su estacionamiento del mismo color. Rojo, Azul, Amarillo, Verde, Naranja y Morado.', 'es-ES', btn);
    } else {
      window.hablarTexto(prefijo + 'Rompecabezas de figuras geométricas: coloca cada figura en su silueta.', 'es-ES', btn);
    }
  };

  function renderCurrentPuzzle() {
    var cont = document.getElementById('puzzleStageContainer');
    var statusBanner = document.getElementById('puzzleStatusBanner');
    var statusMsg = document.getElementById('puzzleStatusMsg');
    if (!cont) return;
    if (statusBanner) statusBanner.classList.remove('celebrate');

    if (puzzleState.currentGame === 'numeros') {
      renderNumbersPuzzle(cont, statusMsg);
    } else if (puzzleState.currentGame === 'cuerpo') {
      renderBodyPuzzle(cont, statusMsg);
    } else {
      renderCarsAndShapesPuzzle(cont, statusMsg);
    }
  }

  /* Minijuego A: Rompecabezas de Números y Cantidades */
  function renderNumbersPuzzle(cont, statusMsg) {
    var slice = puzzleState.numBlock === '1_5' ? NUMEROS_DATA.slice(0, 5) : NUMEROS_DATA.slice(5, 10);
    var unplaced = shuffleArray(slice.filter(function (n) { return !puzzleState.placedMap[n.id]; }));

    var html =
      '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">' +
        '<span style="font-family:\'Fredoka\',sans-serif;">Secuencia numérica:</span>' +
        '<button type="button" class="btn-kid ' + (puzzleState.numBlock === '1_5' ? 'active-chip' : '') + '" onclick="cambiarBloqueNumeros(\'1_5\')">1️⃣ Números del 1 al 5</button>' +
        '<button type="button" class="btn-kid ' + (puzzleState.numBlock === '6_10' ? 'active-chip' : '') + '" onclick="cambiarBloqueNumeros(\'6_10\')">🔟 Números del 6 al 10</button>' +
      '</div>' +
      '<div class="pieces-bank" aria-label="Fichas de números para colocar">';

    slice.forEach(function (n) {
      var placed = !!puzzleState.placedMap[n.id];
      var selected = puzzleState.selectedPieceId === n.id;
      html +=
        '<button type="button" class="puzzle-piece' + (placed ? ' placed' : '') + (selected ? ' selected' : '') + '" ' +
          'draggable="' + (!placed) + '" data-pid="' + n.id + '" onclick="seleccionarPiezaPuzzle(\'' + n.id + '\', this)">' +
          '<span style="font-size:1.75rem;font-weight:700;color:var(--pri);">' + n.id + '</span>' +
          '<span style="font-size:0.82rem;">' + n.es + '</span>' +
          '<span class="btn-card-audio-en" onclick="event.stopPropagation(); hablarTexto(\'' + n.en + '\', \'en-US\', this);" title="Pronunciación en inglés">🇺🇸 ' + n.en + '</span>' +
        '</button>';
    });
    html += '</div><div class="slots-grid">';

    slice.forEach(function (n) {
      var filled = !!puzzleState.placedMap[n.id];
      html +=
        '<div class="puzzle-slot' + (filled ? ' filled' : '') + '" data-sid="' + n.id + '" onclick="colocarEnSiluetaPuzzle(\'' + n.id + '\')">' +
          '<div style="font-family:\'Fredoka\',sans-serif;font-size:0.85rem;color:var(--gray);">Posición #' + n.id + '</div>' +
          '<div style="font-size:1.25rem;line-height:1.25;">' + n.emoji + '</div>' +
          (filled
            ? '<div style="font-family:\'Fredoka\',sans-serif;font-size:1.45rem;color:var(--sec);">✓ ' + n.id + ' · ' + n.es + ' (' + n.en + ')</div>'
            : '<div style="font-family:\'Fredoka\',sans-serif;font-size:1rem;color:var(--pri);">[ Silueta del ' + n.id + ' ]</div>') +
        '</div>';
    });
    html += '</div>';

    cont.innerHTML = html;
    bindDragEventsOnPuzzle(cont);
    if (statusMsg) {
      var doneCount = Object.keys(puzzleState.placedMap).length;
      statusMsg.textContent = unplaced.length === 0
        ? '🎉 ¡Secuencia numérica armada! ✓ Todos los números están con su cantidad.'
        : 'Coloca cada número en su silueta contando los objetos (' + doneCount + ' / ' + slice.length + ').';
    }
  }

  window.cambiarBloqueNumeros = function (blk) {
    if (window.detenerVozPrebasica) window.detenerVozPrebasica();
    puzzleState.numBlock = blk;
    puzzleState.selectedPieceId = null;
    puzzleState.placedMap = {};
    renderCurrentPuzzle();
  };

  /* Minijuego B: Partes Gruesas del Cuerpo Humano (Pág. 59 del Libro 1) */
  function renderBodyPuzzle(cont, statusMsg) {
    var html =
      '<div class="body-puzzle-layout">' +
        '<div>' +
          '<h3>1. Toca o arrastra cada parte del cuerpo:</h3>' +
          '<div class="pieces-bank" style="flex-direction:column;align-items:stretch;">';

    BODY_PARTS_BOOK.slice().reverse().forEach(function (bp) {
      var placed = !!puzzleState.placedMap[bp.id];
      var selected = puzzleState.selectedPieceId === bp.id;
      html +=
        '<button type="button" class="puzzle-piece' + (placed ? ' placed' : '') + (selected ? ' selected' : '') + '" ' +
          'style="flex-direction:row;justify-content:flex-start;gap:0.8rem;width:100%;" ' +
          'draggable="' + (!placed) + '" data-pid="' + bp.id + '" onclick="seleccionarPiezaPuzzle(\'' + bp.id + '\', this)">' +
          bp.svg +
          '<div style="text-align:left;flex:1;">' +
            '<div style="font-size:1.05rem;font-weight:700;">' + bp.es + '</div>' +
            '<div style="font-size:0.8rem;color:var(--gray);font-family:\'Nunito\',sans-serif;">' + bp.desc + '</div>' +
          '</div>' +
          '<span class="btn-card-audio-en" onclick="event.stopPropagation(); hablarTexto(\'' + bp.en + '\', \'en-US\', this);" title="Pronunciación en inglés">🇺🇸 ' + bp.en + '</span>' +
        '</button>';
    });

    html +=
          '</div>' +
        '</div>' +
        '<div>' +
          '<h3>2. Silueta Vertical (de arriba hacia abajo, pág. 59):</h3>' +
          '<div class="body-silhouette-tower">';

    BODY_PARTS_BOOK.forEach(function (bp) {
      var filled = !!puzzleState.placedMap[bp.id];
      html +=
        '<div class="body-slot-row puzzle-slot' + (filled ? ' filled' : '') + '" data-sid="' + bp.id + '" onclick="colocarEnSiluetaPuzzle(\'' + bp.id + '\')">' +
          '<div style="text-align:left;">' +
            '<strong style="font-family:\'Fredoka\',sans-serif;font-size:1rem;">' + bp.es + ' / ' + bp.en + '</strong>' +
            '<div style="font-size:0.82rem;color:var(--gray);">' + (filled ? '✓ ¡Colocado en su lugar!' : 'Toca aquí para colocar ' + bp.es) + '</div>' +
          '</div>' +
          '<div>' + (filled ? bp.svg : '<span style="font-size:1.8rem;opacity:0.4;">🧩</span>') + '</div>' +
        '</div>';
    });

    html += '</div></div></div>';
    cont.innerHTML = html;
    bindDragEventsOnPuzzle(cont);

    if (statusMsg) {
      var c = Object.keys(puzzleState.placedMap).length;
      statusMsg.textContent = c === BODY_PARTS_BOOK.length
        ? '🎉 ¡Excelente! ✓ Armaste el cuerpo humano completo de arriba hacia abajo.'
        : 'Ordena el cuerpo humano de arriba hacia abajo: Cabeza, Tronco, Brazos y Piernas (' + c + ' / 4).';
    }
  }

  /* Minijuego C: Color Matching Car Park + Figuras Geométricas */
  function renderCarsAndShapesPuzzle(cont, statusMsg) {
    var isCars = puzzleState.carSubMode === 'colores';
    var items = isCars ? CAR_COLORS : GEOMETRIC_SHAPES;

    var html =
      '<div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">' +
        '<span style="font-family:\'Fredoka\',sans-serif;">Elige actividad:</span>' +
        '<button type="button" class="btn-kid ' + (isCars ? 'active-chip' : '') + '" onclick="cambiarSubmodoCarros(\'colores\')">🚗 Color Matching Car Park (6 Colores ES/EN)</button>' +
        '<button type="button" class="btn-kid ' + (!isCars ? 'active-chip' : '') + '" onclick="cambiarSubmodoCarros(\'figuras\')">🔷 Figuras Geométricas (8 Figuras ES/EN)</button>' +
      '</div>' +
      '<div class="pieces-bank">';

    items.forEach(function (it) {
      var placed = !!puzzleState.placedMap[it.id];
      var selected = puzzleState.selectedPieceId === it.id;
      if (isCars) {
        html +=
          '<button type="button" class="puzzle-piece' + (placed ? ' placed' : '') + (selected ? ' selected' : '') + '" ' +
            'style="border-color:' + it.hex + ';" draggable="' + (!placed) + '" data-pid="' + it.id + '" onclick="seleccionarPiezaPuzzle(\'' + it.id + '\', this)">' +
            '<span style="font-size:2rem;">' + it.emoji + '</span>' +
            '<span style="font-size:0.9rem;color:' + it.hex + ';font-weight:700;">' + it.es + '</span>' +
            '<span class="btn-card-audio-en" onclick="event.stopPropagation(); hablarTexto(\'' + it.en + '\', \'en-US\', this);" title="Pronunciación en inglés">🇺🇸 ' + it.en + '</span>' +
          '</button>';
      } else {
        html +=
          '<button type="button" class="puzzle-piece' + (placed ? ' placed' : '') + (selected ? ' selected' : '') + '" ' +
            'draggable="' + (!placed) + '" data-pid="' + it.id + '" onclick="seleccionarPiezaPuzzle(\'' + it.id + '\', this)">' +
            it.svg +
            '<span style="font-size:0.88rem;font-weight:700;">' + it.es + '</span>' +
            '<span class="btn-card-audio-en" onclick="event.stopPropagation(); hablarTexto(\'' + it.en + '\', \'en-US\', this);" title="Pronunciación en inglés">🇺🇸 ' + it.en + '</span>' +
          '</button>';
      }
    });

    html += '</div><div class="carpark-grid">';

    items.forEach(function (it) {
      var filled = !!puzzleState.placedMap[it.id];
      if (isCars) {
        html +=
          '<div class="parking-bay puzzle-slot' + (filled ? ' filled' : '') + '" style="border-color:' + it.hex + ';" data-sid="' + it.id + '" onclick="colocarEnSiluetaPuzzle(\'' + it.id + '\')">' +
            '<div class="parking-bay-header" style="background:' + it.hex + ';">🅿️ ' + it.en.toUpperCase() + ' · ' + it.es.toUpperCase() + '</div>' +
            '<div style="font-size:2.3rem;margin:0.35rem 0;">' + (filled ? it.emoji + ' ✓' : '🛣️') + '</div>' +
            '<div style="font-size:0.8rem;color:var(--gray);">' + (filled ? '¡Estacionado!' : 'Estaciona aquí el carro ' + it.es) + '</div>' +
          '</div>';
      } else {
        html +=
          '<div class="puzzle-slot' + (filled ? ' filled' : '') + '" data-sid="' + it.id + '" onclick="colocarEnSiluetaPuzzle(\'' + it.id + '\')">' +
            '<div style="font-family:\'Fredoka\',sans-serif;font-size:0.95rem;">' + it.es + ' (' + it.en + ')</div>' +
            '<div style="margin:0.25rem 0;opacity:' + (filled ? '1' : '0.28') + ';">' + it.svg + '</div>' +
            '<div style="font-size:0.8rem;color:var(--gray);">' + (filled ? '✓ ¡Figura colocada!' : 'Silueta de ' + it.es) + '</div>' +
          '</div>';
      }
    });

    html += '</div>';
    cont.innerHTML = html;
    bindDragEventsOnPuzzle(cont);

    if (statusMsg) {
      var done = Object.keys(puzzleState.placedMap).length;
      statusMsg.textContent = done === items.length
        ? '🎉 ¡Completado! ✓ Todas las piezas están en su lugar.'
        : 'Une cada pieza con su lugar correspondiente (' + done + ' / ' + items.length + ').';
    }
  }

  window.cambiarSubmodoCarros = function (sub) {
    if (window.detenerVozPrebasica) window.detenerVozPrebasica();
    puzzleState.carSubMode = sub;
    puzzleState.selectedPieceId = null;
    puzzleState.placedMap = {};
    renderCurrentPuzzle();
  };

  window.seleccionarPiezaPuzzle = function (pid, btn) {
    if (puzzleState.placedMap[pid]) return;
    puzzleState.selectedPieceId = pid;
    renderCurrentPuzzle();

    var targetBtn = document.querySelector('.puzzle-piece[data-pid="' + pid + '"]') || btn;

    // Pronunciar en voz alta la pieza seleccionada (Bilingüe nativa)
    if (puzzleState.currentGame === 'numeros') {
      var n = NUMEROS_DATA.find(function (x) { return x.id === pid; });
      if (n) window.hablarBilingue(n.es, n.en, targetBtn);
    } else if (puzzleState.currentGame === 'cuerpo') {
      var bp = BODY_PARTS_BOOK.find(function (x) { return x.id === pid; });
      if (bp) {
        var esLimpio = bp.es.replace(/^\d+\.\s*/, '');
        window.hablarBilingue(esLimpio, bp.en, targetBtn);
      }
    } else if (puzzleState.carSubMode === 'colores') {
      var c = CAR_COLORS.find(function (x) { return x.id === pid; });
      if (c) window.hablarBilingue(c.es, c.en, targetBtn);
    } else {
      var sh = GEOMETRIC_SHAPES.find(function (x) { return x.id === pid; });
      if (sh) window.hablarBilingue(sh.es, sh.en, targetBtn);
    }
  };

  window.colocarEnSiluetaPuzzle = function (sid) {
    if (!puzzleState.selectedPieceId) return;
    if (puzzleState.selectedPieceId === sid) {
      var piezaColocadaId = sid;
      puzzleState.placedMap[sid] = true;
      puzzleState.selectedPieceId = null;
      sonarAcierto();
      renderCurrentPuzzle();

      // Pronunciar la palabra en inglés del elemento recién colocado
      var vocabEn = null;
      if (puzzleState.currentGame === 'numeros') {
        var numObj = NUMEROS_DATA.find(function (x) { return x.id === piezaColocadaId; });
        if (numObj) vocabEn = numObj.en;
      } else if (puzzleState.currentGame === 'cuerpo') {
        var bpObj = BODY_PARTS_BOOK.find(function (x) { return x.id === piezaColocadaId; });
        if (bpObj) vocabEn = bpObj.en;
      } else if (puzzleState.carSubMode === 'colores') {
        var colObj = CAR_COLORS.find(function (x) { return x.id === piezaColocadaId; });
        if (colObj) vocabEn = colObj.en;
      } else {
        var shObj = GEOMETRIC_SHAPES.find(function (x) { return x.id === piezaColocadaId; });
        if (shObj) vocabEn = shObj.en;
      }
      if (vocabEn) {
        setTimeout(function () {
          window.hablarTexto(vocabEn, 'en-US');
        }, 120);
      }

      checkPuzzleCompletion();
    } else {
      sonarSuaveError();
      var slotEl = document.querySelector('.puzzle-slot[data-sid="' + sid + '"]');
      if (slotEl) {
        slotEl.classList.remove('wrong-shake');
        void slotEl.offsetWidth;
        slotEl.classList.add('wrong-shake');
      }
    }
  };

  function bindDragEventsOnPuzzle(container) {
    var pieces = container.querySelectorAll('.puzzle-piece[draggable="true"]');
    var slots = container.querySelectorAll('.puzzle-slot');

    pieces.forEach(function (p) {
      p.addEventListener('dragstart', function (e) {
        var pid = p.getAttribute('data-pid');
        puzzleState.selectedPieceId = pid;
        if (e.dataTransfer) e.dataTransfer.setData('text/plain', pid);
      });
    });

    slots.forEach(function (s) {
      s.addEventListener('dragover', function (e) {
        e.preventDefault();
        s.classList.add('drag-over');
      });
      s.addEventListener('dragleave', function () {
        s.classList.remove('drag-over');
      });
      s.addEventListener('drop', function (e) {
        e.preventDefault();
        s.classList.remove('drag-over');
        var sid = s.getAttribute('data-sid');
        if (e.dataTransfer) {
          var droppedId = e.dataTransfer.getData('text/plain');
          if (droppedId) puzzleState.selectedPieceId = droppedId;
        }
        window.colocarEnSiluetaPuzzle(sid);
      });
    });
  }

  function checkPuzzleCompletion() {
    var totalNeeded = 5;
    var key = puzzleState.currentGame;
    if (puzzleState.currentGame === 'numeros') {
      totalNeeded = 5;
      key = 'numeros_' + puzzleState.numBlock;
    } else if (puzzleState.currentGame === 'cuerpo') {
      totalNeeded = BODY_PARTS_BOOK.length;
      key = 'cuerpo_59';
    } else {
      totalNeeded = puzzleState.carSubMode === 'colores' ? CAR_COLORS.length : GEOMETRIC_SHAPES.length;
      key = 'carros_' + puzzleState.carSubMode;
    }

    var done = Object.keys(puzzleState.placedMap).length;
    if (done >= totalNeeded) {
      sonarCelebracion();
      var banner = document.getElementById('puzzleStatusBanner');
      if (banner) banner.classList.add('celebrate');
      if (!state.completedPuzzles[key]) {
        state.completedPuzzles[key] = true;
        addXP(20, 's-rompecabezas');
      }
      var esc = obtenerSaludoEscuela();
      var fel = esc ? ('¡Excelente trabajo en familia con ' + esc + '! Completaron todo el rompecabezas.') : '¡Bravo! Completaste todo el rompecabezas sin ningún error.';
      window.hablarTexto(fel, 'es-ES');
    }
  }

  /* ==========================================================================
     PESTAÑA 4: MANOS A LA OBRA EN CASA (6 TÉCNICAS FÍSICAS EN PAPEL)
     ========================================================================== */
  var HOME_TECHNIQUES = [
    {
      id: 'estrujado',
      title: '1. Estrujado y Arrugado de Papel',
      benefit: '💪 Fuerza palmar y tono muscular de la mano',
      materials: 'Papel periódico, papel reciclado, papel bond o papel china.',
      steps: [
        'Entregue al niño media hoja de papel periódico o reciclado.',
        'Pídale que la apriete con ambas manos y luego con una sola mano hasta formar una pelota bien compacta.',
        'Jueguen a encestar las pelotas de papel arrugado dentro de una caja o cesto.'
      ],
      safety: 'Supervise que el niño no se lleve trocitos de papel a la boca.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="22" fill="#fdcb6e" stroke="#e65100" stroke-width="3"/><path d="M18 26 L30 20 L44 28 L36 44 L22 40 Z" fill="none" stroke="#d35400" stroke-width="2.5"/></svg>'
    },
    {
      id: 'rasgado',
      title: '2. Rasgado de Papel (Adentro y Afuera)',
      benefit: '🤲 Coordinación bimanual y freno inhibitorio',
      materials: 'Papel lustre, revista o papel construcción y pegamento escolar en barra.',
      steps: [
        'Enseñe al niño a tomar el papel con los dedos pulgar e índice de ambas manos (pinza digital).',
        'Una mano tira hacia adelante y la otra hacia atrás para rasgar tiras y luego cuadritos pequeños.',
        'Peguen los papelitos rasgados ADENTRO o AFUERA de una figura dibujada en una hoja, tal como indica el Libro 1.'
      ],
      safety: 'Use pegamento escolar no tóxico y lávense las manos al terminar.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><path d="M12 12 H30 L26 24 L32 36 L25 52 H12 Z" fill="#74b9ff" stroke="#0984e3" stroke-width="2.5"/><path d="M36 12 H52 V52 H34 L40 36 L34 24 Z" fill="#a29bfe" stroke="#6c5ce7" stroke-width="2.5"/></svg>'
    },
    {
      id: 'boleado',
      title: '3. Boleado con Índice y Pulgar',
      benefit: '🤏 Pinza fina digital previa a tomar el lápiz',
      materials: 'Cuadritos pequeños de papel china (papel seda) o papel crepé y pegamento.',
      steps: [
        'Corte cuadritos de papel china de unos 3×3 cm.',
        'Pídale al niño que forme pelotitas chiquitas girando el papel EXCLUSIVAMENTE con las yemas del dedo índice y el pulgar (sin frotar con las palmas).',
        'Peguen las bolitas siguiendo el contorno de una letra, número o dibujo.'
      ],
      safety: 'Cuide que el niño use solo índice y pulgar; si se cansa, hagan pausas cortas.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><circle cx="22" cy="24" r="8" fill="#ff7675"/><circle cx="42" cy="22" r="7" fill="#55efc4"/><circle cx="32" cy="40" r="9" fill="#ffeaa7"/><circle cx="46" cy="44" r="6" fill="#a29bfe"/></svg>'
    },
    {
      id: 'dactilopintura',
      title: '4. Dactilopintura con Témpera Real',
      benefit: '🎨 Sensopercepción táctil y control del espacio gráfico',
      materials: 'Témperas lavables no tóxicas, plato plástico, hoja blanca y trapito húmedo.',
      steps: [
        'Coloque poquita témpera de colores primarios (rojo, azul, amarillo) en un platito.',
        'Pídale al niño que moje solo la yema de su dedo índice y estampe huellitas dentro de una manzana, uvas o caballito de mar dibujado en papel.',
        'Descubran juntos qué pasa al mezclar amarillo + azul (verde) o rojo + amarillo (naranja).'
      ],
      safety: 'Utilice únicamente pintura lavable infantil no tóxica.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="34" rx="14" ry="19" fill="#e84393"/><circle cx="18" cy="16" r="5" fill="#0984e3"/><circle cx="32" cy="11" r="5" fill="#00b894"/><circle cx="46" cy="16" r="5" fill="#fdcb6e"/></svg>'
    },
    {
      id: 'punzado',
      title: '5. Punzado Seguro con Foamy Debajo',
      benefit: '📌 Prensión trípode y precisión óculo-manual',
      materials: 'Hoja con dibujo, una lámina de foamy grueso (o cartón/toalla doblada) debajo y punzón plástico infantil o lápiz de punta gruesa.',
      steps: [
        'Coloque el foamy o cartón debajo de la hoja de papel sobre la mesa.',
        'El niño sujeta el punzón plástico como si fuera un lápiz (con pulgar, índice y cordial) y hace piquitos seguidos sobre la línea del dibujo.',
        'Al terminar, levanten la hoja contra la luz para ver cómo brilla la silueta perforada.'
      ],
      safety: '⚠️ SUPERVISIÓN DIRECTA OBLIGATORIA: Nunca use agujas ni objetos metálicos filosos. Use punzón escolar plástico de punta roma.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="38" width="44" height="14" rx="4" fill="#dfe6e9" stroke="#636e72" stroke-width="2"/><line x1="38" y1="10" x2="28" y2="38" stroke="#e65100" stroke-width="6" stroke-linecap="round"/></svg>'
    },
    {
      id: 'recorte',
      title: '6. Recorte con Tijeras de Punta Redonda',
      benefit: '✂️ Coordinación visomotriz y fuerza disociada de dedos',
      materials: 'Tijera escolar infantil de punta redonda y tiras de papel con líneas rectas, zig-zag y curvas.',
      steps: [
        'Verifique la postura: dedo pulgar arriba mirando al techo («el pulgar siempre mira al sol»).',
        'Empiecen practicando pequeños flecos en el borde de una tira de papel.',
        'Luego recorten siguiendo líneas rectas, después líneas quebradas (zig-zag) y finalmente líneas curvas.'
      ],
      safety: '⚠️ Uso exclusivo de tijeras escolares de punta redonda con el adulto sentado al lado.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><circle cx="20" cy="44" r="8" fill="none" stroke="#d63031" stroke-width="4"/><circle cx="44" cy="44" r="8" fill="none" stroke="#d63031" stroke-width="4"/><line x1="25" y1="38" x2="46" y2="12" stroke="#636e72" stroke-width="4" stroke-linecap="round"/><line x1="39" y1="38" x2="18" y2="12" stroke="#636e72" stroke-width="4" stroke-linecap="round"/></svg>'
    }
  ];

  function renderHandsOnTab() {
    var grid = document.getElementById('handsOnGrid');
    if (!grid) return;
    grid.innerHTML = '';

    HOME_TECHNIQUES.forEach(function (t) {
      var done = !!state.completedHomeTechs[t.id];
      var card = document.createElement('article');
      card.className = 'tech-card' + (done ? ' done-home' : '');

      var stepsHtml = t.steps.map(function (s) { return '<li>' + s + '</li>'; }).join('');
      var ttsFull = t.title + '. Beneficio: ' + t.benefit + '. Materiales: ' + t.materials + '. Pasos: ' + t.steps.join(' ') + '. ' + t.safety;

      card.innerHTML =
        '<div>' +
          '<div class="tech-card-head">' +
            '<div class="tech-svg-box">' + t.svg + '</div>' +
            '<div class="tech-card-title">' +
              '<h3>' + t.title + '</h3>' +
              '<span class="tech-benefit-badge">' + t.benefit + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="tech-materials" style="margin-top:0.75rem;">' +
            '<strong>🧺 Materiales en casa:</strong> ' + t.materials +
          '</div>' +
          '<ol class="tech-steps" style="margin-top:0.65rem;">' + stepsHtml + '</ol>' +
        '</div>' +
        '<div>' +
          '<div class="tech-safety" style="margin-bottom:0.75rem;">' +
            '<strong>🛡️ Cuidado del adulto:</strong> ' + t.safety +
          '</div>' +
          '<div class="tech-card-footer">' +
            '<button type="button" class="btn-kid" data-tts="' + encodeURIComponent(ttsFull) + '" onclick="hablarTexto(decodeURIComponent(this.getAttribute(\'data-tts\')), \'es-ES\', this)">' +
              '🔊 Escuchar pasos' +
            '</button>' +
            '<button type="button" class="btn-kid ' + (done ? 'secondary' : 'primary') + '" onclick="marcarTecnicaCasa(\'' + t.id + '\')">' +
              (done ? '✓ ¡Hecha en familia! ⭐' : '✅ Marcar como hecha en casa') +
            '</button>' +
          '</div>' +
        '</div>';

      grid.appendChild(card);
    });

    var count = Object.keys(state.completedHomeTechs).filter(function (k) {
      return state.completedHomeTechs[k];
    }).length;
    var badge = document.getElementById('homeTechCounter');
    if (badge) {
      badge.textContent = '🏅 ' + count + ' / ' + HOME_TECHNIQUES.length + ' técnicas hechas en casa';
    }
  }

  window.marcarTecnicaCasa = function (id) {
    var wasDone = !!state.completedHomeTechs[id];
    state.completedHomeTechs[id] = !wasDone;
    if (!wasDone) {
      sonarCelebracion();
      addXP(20, 's-casa');
      var esc = obtenerSaludoEscuela();
      var fel = esc ? ('¡Felicidades familia de ' + esc + '! Una técnica más del libro realizada en casa con papel y manos creativas.') : '¡Felicidades familia! Una técnica más del libro realizada en casa con papel y manos creativas.';
      window.hablarTexto(fel, 'es-ES');
    } else {
      saveState();
    }
    renderHandsOnTab();
  };

  /* --------------------------------------------------------------------------
     CONTROLES DEL PIE DE PÁGINA (SONIDO, TEMA, LETRA GRANDE, COMPARTIR, RESET)
     -------------------------------------------------------------------------- */
  window.toggleSnd = function () {
    state.soundOn = !state.soundOn;
    var btn = document.getElementById('sndBtn');
    if (btn) btn.textContent = state.soundOn ? '🔊 Sonido: Sí' : '🔇 Sonido: No';
    if (!state.soundOn) {
      if (window.detenerVozPrebasica) window.detenerVozPrebasica();
      if (currentAudioObj) {
        try {
          currentAudioObj.pause();
          currentAudioObj.currentTime = 0;
        } catch (e) {}
        currentAudioObj = null;
      }
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch (e) {}
      }
    }
    saveState();
  };

  window.toggleTheme = function () {
    var html = document.documentElement;
    var isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    var btn = document.getElementById('themeBtn');
    if (btn) btn.textContent = isDark ? '🌙 Tema' : '☀️ Tema';
  };

  window.toggleLetra = function () {
    document.body.classList.toggle('letra-grande');
  };

  function reiniciarTodoProgresoPrebasica() {
    if (typeof window.detenerVozPrebasica === 'function') {
      window.detenerVozPrebasica();
    }
    state = {
      xp: 0,
      soundOn: (state && state.soundOn !== false),
      completedTraces: {},
      completedRodea: {},
      completedPuzzles: {},
      completedHomeTechs: {},
      doneSections: {}
    };
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    saveState();
    updateXPBar();
    var doneNavs = document.querySelectorAll('.nav-t.done');
    for (var i = 0; i < doneNavs.length; i++) {
      doneNavs[i].classList.remove('done');
    }
    selectTraceChallenge(0, false);
    buildRodeaExercise();
    mostrarRompecabezas('numeros');
    renderHandsOnTab();
    if (typeof window.go === 'function') {
      window.go('s-trazos');
    }
  }
  window.reiniciarTodoProgresoPrebasica = reiniciarTodoProgresoPrebasica;
  window.resetXP = reiniciarTodoProgresoPrebasica;

  window.cambiarEscuelaPrebasica = function () {
    reiniciarTodoProgresoPrebasica();
    window.abrirModalInstitucion(true);
  };

  window.compartirMision = function () {
    var esc = obtenerSaludoEscuela() || 'nuestro centro educativo';
    var msg = '🌟 ¡Mira qué increíble! En *' + esc + '* estamos aprendiendo en familia con la Misión Interactiva de Prebásica (Libro 1 · Técnicas Gráficas y No Gráficas) en M.E.T.A.S. 🎨✨ Trazos con el dedo, números, colores en inglés y rompecabezas guiados para papá, mamá y los pequeños:\n' + window.location.href;
    window.open('https://wa.me/?text=' + encodeURIComponent(msg), '_blank');
  };

  /* --------------------------------------------------------------------------
     PORTAL DE ACCESO Y GESTIÓN DE INSTITUCIÓN EDUCATIVA (PREBÁSICA)
     -------------------------------------------------------------------------- */
  function actualizarCintilloInstitucion(nombre) {
    var cintillo = document.getElementById('cintilloInstitucionPrebasica');
    var lbl = document.getElementById('lblNombreInstitucion');
    if (cintillo && lbl) {
      lbl.textContent = nombre;
      cintillo.style.display = 'block';
    }
  }

  function inicializarInstitucionPrebasica() {
    var guardada = null;
    try {
      guardada = localStorage.getItem('metas_prebasica_institucion');
    } catch (e) {}

    if (guardada) {
      actualizarCintilloInstitucion(guardada);
    } else {
      window.abrirModalInstitucion(false);
    }
  }

  window.abrirModalInstitucion = function (permitirCerrar) {
    if (permitirCerrar) {
      reiniciarTodoProgresoPrebasica();
    }
    var modal = document.getElementById('modalInstitucionPrebasica');
    var input = document.getElementById('inputColegioPrebasica');
    var err = document.getElementById('errorInstitucionPrebasica');
    var btnCancelar = document.getElementById('btnCancelarInstitucion');
    if (err) err.style.display = 'none';
    if (btnCancelar) {
      btnCancelar.style.display = permitirCerrar ? 'inline-flex' : 'none';
    }
    if (modal) {
      modal.style.display = 'flex';
    }
    if (input) {
      input.value = '';
      setTimeout(function () { input.focus(); }, 120);
    }
  };

  window.cerrarModalInstitucion = function () {
    var modal = document.getElementById('modalInstitucionPrebasica');
    if (modal) modal.style.display = 'none';
  };

  window.procesarInstitucionPrebasica = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    var input = document.getElementById('inputColegioPrebasica');
    var err = document.getElementById('errorInstitucionPrebasica');
    var raw = input ? input.value : '';

    var validado = null;
    if (typeof window.validarInstitucionPrebasica === 'function') {
      validado = window.validarInstitucionPrebasica(raw);
    }

    if (validado) {
      var institucionAnterior = null;
      try {
        institucionAnterior = localStorage.getItem('metas_prebasica_institucion');
      } catch (errPrev) {}

      var esDistinta = (!institucionAnterior || institucionAnterior !== validado);

      try {
        localStorage.setItem('metas_prebasica_institucion', validado);
      } catch (errLS) {}

      if (esDistinta) {
        reiniciarTodoProgresoPrebasica();
      }

      actualizarCintilloInstitucion(validado);
      window.cerrarModalInstitucion();
    } else {
      if (err) {
        err.textContent = 'No reconocimos ese centro educativo. Por favor verifica e ingresa el nombre oficial de la escuela o kínder donde adquiriste tu libro.';
        err.style.display = 'block';
      }
      if (input) input.focus();
    }
  };

  /* --------------------------------------------------------------------------
     INICIALIZACIÓN AL CARGAR EL DOM
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    loadState();
    var sndBtn = document.getElementById('sndBtn');
    if (sndBtn) sndBtn.textContent = state.soundOn ? '🔊 Sonido: Sí' : '🔇 Sonido: No';
    initTraceTab();
    initRodeaTab();
    mostrarRompecabezas('numeros');
    renderHandsOnTab();
    inicializarInstitucionPrebasica();
  });
})();
