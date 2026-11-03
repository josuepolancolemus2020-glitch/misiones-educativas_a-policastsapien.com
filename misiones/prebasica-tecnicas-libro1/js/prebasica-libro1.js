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
    completedFiguras: {},
    completedFiguraObjects: {},
    completedRodea: {},
    completedPuzzles: {},
    completedHomeTechs: {},
    doneSections: {}
  };

  /* Temporizadores de auto-avance secuencial entre retos y pestañas */
  var traceAutoAdvanceTimer = null;
  var figuraAutoAdvanceTimer = null;
  var rodeaAutoAdvanceTimer = null;
  var puzzleAutoAdvanceTimer = null;

  /* --------------------------------------------------------------------------
     HELPER: ESCUELA / INSTITUCIÓN ACTIVA Y PREFIJOS RÁPIDOS
     -------------------------------------------------------------------------- */
  var CATALOGO_COLEGIOS_PREBASICA_INTERNO = [
    { nombre: 'CEPB María Consuelo', claves: ['mariaconsuelo', 'consuelo'] },
    { nombre: 'Coral Bilingual School', claves: ['coral', 'coralbilingual'] },
    { nombre: 'CEPB Rafael Pineda Ponce', claves: ['rafael', 'pineda', 'ponce', 'pinedaponce'] },
    { nombre: 'CEPB Nimia Baquedano', claves: ['nimia', 'baquedano', 'nimiabaquedano'] },
    { nombre: 'CEPB Dionisio de Herrera', claves: ['dionisio', 'herrera', 'dionisiodeherrera'] },
    { nombre: 'CEPB Amigo de los Niños', claves: ['amigo', 'amigodelosninos', 'amigosdelosninos'] },
    { nombre: 'CEBNG Blessing Bilingual School', claves: ['blessing', 'blessingbilingual'] },
    { nombre: 'CEBNG Simiente Santa', claves: ['simiente', 'simientesanta'] },
    { nombre: 'CEPB Marina Name', claves: ['marina', 'marinaname'] },
    { nombre: 'John Cook School', claves: ['johncook', 'john', 'cook', 'jhoncook'] },
    { nombre: 'Liceo Panamericano', claves: ['panamericano', 'liceopanamericano'] },
    { nombre: 'Edición Oficial M.E.T.A.S. · Evelyn S. Castellanos H.', claves: ['metas', 'evelyn', 'castellanos', 'demo'] }
  ];

  function normalizarTextoColegioLocal(str) {
    if (!str) return '';
    return str
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  function limpiarPrefijoEscuela(nombre) {
    if (!nombre) return '';
    if (typeof nombre === 'object' && nombre !== null) {
      nombre = nombre.nombre || '';
    }
    if (typeof nombre !== 'string') return '';
    var str = nombre.trim();
    if (str.charAt(0) === '{' && str.charAt(str.length - 1) === '}') {
      try {
        var parseado = JSON.parse(str);
        if (parseado && parseado.nombre) {
          str = parseado.nombre;
        }
      } catch (e) {}
    }
    // Quitar prefijo temporal DEMO (ej. DEMO20-, DEMO7:, DEMO-)
    str = str.replace(/^DEMO(\d+)?\s*[-:]\s*/i, '');
    // Quitar prefijos oficiales rápidos (ej. 2027-, METAS-, METAS2027:)
    str = str.replace(/^(?:2027|metas|metas2027)\s*[-:]\s*/i, '');
    return str.trim();
  }

  function obtenerInfoEscuela() {
    var raw = null;
    try {
      raw = localStorage.getItem('metas_prebasica_institucion');
    } catch (e) {}
    if (!raw || typeof raw !== 'string' || !raw.trim()) return null;
    var str = raw.trim();

    if (str.charAt(0) === '{' && str.charAt(str.length - 1) === '}') {
      try {
        var obj = JSON.parse(str);
        if (obj && typeof obj === 'object' && obj.nombre) {
          obj.nombre = limpiarPrefijoEscuela(obj.nombre);
          return obj;
        }
      } catch (eJson) {}
    }

    var nombreLimpio = limpiarPrefijoEscuela(str);
    if (!nombreLimpio) return null;
    return {
      nombre: nombreLimpio,
      tipo: 'OFICIAL'
    };
  }

  function guardarInfoEscuela(info) {
    if (!info || !info.nombre) return;
    try {
      var serializado = JSON.stringify(info);
      localStorage.setItem('metas_prebasica_institucion', serializado);
      sessionStorage.setItem('metas_prebasica_institucion', serializado);
    } catch (e) {}
  }

  function borrarInfoEscuela() {
    try {
      localStorage.removeItem('metas_prebasica_institucion');
    } catch (e1) {}
    try {
      sessionStorage.removeItem('metas_prebasica_institucion');
    } catch (e2) {}
  }

  function estaColegioRevocadoLocal(nombre) {
    if (!nombre) return false;
    var nombreLimpio = limpiarPrefijoEscuela(nombre);
    if (typeof window.estaColegioRevocado === 'function') {
      if (window.estaColegioRevocado(nombreLimpio)) return true;
    }
    var rev = window.COLEGIOS_REVOCADOS;
    if (!rev || !Array.isArray(rev) || rev.length === 0) return false;
    var norm = normalizarTextoColegioLocal(nombreLimpio);
    if (!norm) return false;
    for (var i = 0; i < rev.length; i++) {
      var rNorm = normalizarTextoColegioLocal(rev[i]);
      if (rNorm && (norm === rNorm || norm.indexOf(rNorm) !== -1 || rNorm.indexOf(norm) !== -1)) {
        return true;
      }
    }
    return false;
  }

  function formatearNombreInstitucion(str) {
    if (!str) return '';
    var limpio = str.trim().replace(/\s+/g, ' ');
    if (!limpio) return '';

    var todoMinusculas = (limpio === limpio.toLowerCase());
    var todoMayusculas = (limpio === limpio.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(limpio));

    if (!todoMinusculas && !todoMayusculas) {
      return limpio;
    }

    var palabras = limpio.split(' ');
    var menores = ['de', 'del', 'la', 'las', 'el', 'los', 'en', 'y', 'e', 'o', 'u', 'al'];
    var formateadas = palabras.map(function (palabra, idx) {
      var low = palabra.toLowerCase();
      if (idx > 0 && menores.indexOf(low) !== -1) {
        return low;
      }
      return low.charAt(0).toUpperCase() + low.slice(1);
    });
    return formateadas.join(' ');
  }

  function buscarEnCatalogoColegios(texto) {
    if (!texto) return null;
    var catalogo = window.CATALOGO_COLEGIOS_PREBASICA || CATALOGO_COLEGIOS_PREBASICA_INTERNO;
    var fnNorm = (typeof window.normalizarTextoColegio === 'function')
      ? window.normalizarTextoColegio
      : normalizarTextoColegioLocal;
    var limpio = fnNorm(texto);
    if (!limpio) return null;

    for (var i = 0; i < catalogo.length; i++) {
      var item = catalogo[i];
      for (var j = 0; j < item.claves.length; j++) {
        var clave = fnNorm(item.claves[j]);
        if (limpio === clave || limpio.indexOf(clave) !== -1 || clave.indexOf(limpio) !== -1) {
          return item.nombre;
        }
      }
    }
    return null;
  }

  function obtenerSaludoEscuela() {
    var info = obtenerInfoEscuela();
    if (info && info.nombre) return info.nombre;
    return '';
  }
  window.obtenerSaludoEscuela = obtenerSaludoEscuela;

  var MAPA_SALUDO_ESCUELA = {
    'CEPB María Consuelo': 'saludo-mariaconsuelo.mp3',
    'Coral Bilingual School': 'saludo-coral.mp3',
    'CEPB Rafael Pineda Ponce': 'saludo-rafael.mp3',
    'CEPB Nimia Baquedano': 'saludo-nimia.mp3',
    'CEPB Dionisio de Herrera': 'saludo-dionisio.mp3',
    'CEPB Amigo de los Niños': 'saludo-amigo.mp3',
    'CEBNG Blessing Bilingual School': 'saludo-blessing.mp3',
    'CEBNG Simiente Santa': 'saludo-simiente.mp3',
    'CEPB Marina Name': 'saludo-marina.mp3',
    'John Cook School': 'saludo-johncook.mp3',
    'Liceo Panamericano': 'saludo-panamericano.mp3',
    'Edición Oficial M.E.T.A.S. · Evelyn S. Castellanos H.': 'saludo-metas.mp3'
  };

  function obtenerAudioSaludoEscuela() {
    var esc = obtenerSaludoEscuela();
    if (!esc) return null;
    return MAPA_SALUDO_ESCUELA[esc] || 'saludo-generico.mp3';
  }

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
          state.completedFiguras = parsed.completedFiguras || {};
          state.completedFiguraObjects = parsed.completedFiguraObjects || {};
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

  function normalizarClaveBusquedaAudio(t) {
    if (!t) return '';
    return t
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]/gu, '')
      .replace(/[¡!¿?.,:;"'«»()_—–\-\[\]{}]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  function obtenerArchivoAudio(texto) {
    if (!window.MAPA_AUDIOS_PREBASICA || !texto) return null;
    var mapa = window.MAPA_AUDIOS_PREBASICA;

    // 1. Clave exacta
    if (mapa[texto]) return mapa[texto];

    // 2. Sin emojis
    var limpio = normalizarTextoAudio(texto);
    if (mapa[limpio]) return mapa[limpio];

    // 3. Minúsculas
    var lower = limpio.toLowerCase();
    if (mapa[lower]) return mapa[lower];

    // 4. Clave ultra tolerante (sin signos)
    var tolerante = normalizarClaveBusquedaAudio(texto);
    if (mapa[tolerante]) return mapa[tolerante];

    // 5. Si trae prefijo dinámico institucional, retirarlo y buscar la base
    var regexPrefijo = /^(?:¡?familia\s+de\s+[^!.,;]+[!:.,;]?\s*|¡?atenci[oó]n\s+querida\s+familia\s+de\s+[^!.,;]+[!:.,;]?\s*|¡?excelente\s+trabajo\s+en\s+familia\s+con\s+[^!.,;]+[!:.,;]?\s*|¡?felicidades\s+familia\s+de\s+[^!.,;]+[!:.,;]?\s*)/i;
    var sinPrefijo = texto.replace(regexPrefijo, '').trim();
    if (sinPrefijo && sinPrefijo !== texto) {
      var archivoSin = obtenerArchivoAudio(sinPrefijo);
      if (archivoSin) return archivoSin;
    }

    return null;
  }

  function reproducirArchivoDirecto(archivo, onEnd) {
    try {
      var audio = new Audio('audios/' + archivo);
      window.audioPrebasicaActual = audio;

      audio.onended = function () {
        window.audioPrebasicaActual = null;
        if (typeof onEnd === 'function') onEnd();
      };

      audio.onerror = function () {
        window.audioPrebasicaActual = null;
        if (typeof onEnd === 'function') onEnd();
      };

      var p = audio.play();
      if (p !== undefined) {
        p.catch(function () {
          window.audioPrebasicaActual = null;
          if (typeof onEnd === 'function') onEnd();
        });
      }
    } catch (e) {
      window.audioPrebasicaActual = null;
      if (typeof onEnd === 'function') onEnd();
    }
  }

  var MAPA_TECNICAS_CASA = {
    'aviso_maestro': 'casa_aviso_maestro.mp3',
    'boleado': 'casa_boleado.mp3',
    'rasgado': 'casa_rasgado.mp3',
    'figuras': 'casa_figuras.mp3',
    'dactilopintura': 'casa_dactilopintura.mp3',
    'recorte': 'casa_recorte.mp3',
    'germinacion': 'casa_germinacion.mp3'
  };

  window.hablarAvisoMaestro = function (btn) {
    window.hablarTecnicaCasa('aviso_maestro', btn);
  };

  window.hablarVocabularioChip = function (file, btn) {
    if (!state.soundOn) return;
    if (window.audioPrebasicaPlaying && btn && btn === window.ultimoBotonAudio) {
      window.detenerAudioPrebasica();
      window.ultimoTextoAudio = null;
      return;
    }

    window.detenerAudioPrebasica();
    window.ultimoBotonAudio = btn || null;
    window.ultimoTextoAudio = file;
    window.audioPrebasicaPlaying = true;
    actualizarBotonFlotanteDetener(true);
    if (btn) btn.classList.add('audio-playing');

    reproducirArchivoDirecto(file, function () {
      limpiarEstadoReproduccionAudio();
    });
  };

  window.hablarTecnicaCasa = function (techId, btn) {
    if (!state.soundOn) return;
    var archivo = MAPA_TECNICAS_CASA[techId];
    if (!archivo) return;

    if (window.audioPrebasicaPlaying && btn && btn === window.ultimoBotonAudio) {
      window.detenerAudioPrebasica();
      window.ultimoTextoAudio = null;
      return;
    }

    window.detenerAudioPrebasica();
    window.ultimoBotonAudio = btn || null;
    window.ultimoTextoAudio = archivo;
    window.audioPrebasicaPlaying = true;
    actualizarBotonFlotanteDetener(true);
    if (btn) btn.classList.add('audio-playing');

    reproducirArchivoDirecto(archivo, function () {
      limpiarEstadoReproduccionAudio();
    });
  };

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
    var archivo = obtenerArchivoAudio(limpio);

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

  window.hablarConSaludoEscuela = function (textoInstruccion, lang, btn, callback) {
    if (!state.soundOn || !textoInstruccion) return;

    var esc = obtenerSaludoEscuela();
    var audioSaludo = esc ? obtenerAudioSaludoEscuela() : null;
    var esEspañol = !lang || lang.toLowerCase().indexOf('es') === 0;

    // Si hay escuela activa y es en español, encadenar primero el saludo institucional en MP3
    if (audioSaludo && esEspañol) {
      // Toggle
      if (window.audioPrebasicaPlaying && (
        (btn && btn === window.ultimoBotonAudio) ||
        window.ultimoTextoAudio === textoInstruccion
      )) {
        window.detenerAudioPrebasica();
        window.ultimoTextoAudio = null;
        return;
      }

      window.detenerAudioPrebasica();
      window.ultimoBotonAudio = btn || null;
      window.ultimoTextoAudio = textoInstruccion;
      window.audioPrebasicaPlaying = true;
      actualizarBotonFlotanteDetener(true);
      if (btn) btn.classList.add('audio-playing');

      // 1. Reproducir saludo de la escuela
      reproducirArchivoDirecto(audioSaludo, function () {
        if (!window.audioPrebasicaPlaying) return;
        // 2. Pausa natural de 150ms
        window.audioTimeoutBilingue = setTimeout(function () {
          if (!window.audioPrebasicaPlaying) return;
          // 3. Audio de la instrucción oficial
          reproducirAudioOTexto(textoInstruccion, lang, btn, function () {
            limpiarEstadoReproduccionAudio();
            if (typeof callback === 'function') {
              try { callback(); } catch (e) {}
            }
          });
        }, 150);
      });
      return;
    }

    // Sin escuela activa o en inglés: reproducir directamente
    window.hablarTexto(textoInstruccion, lang, btn, callback);
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
    var textoFijo = 'Esta sección de Prebásica es un complemento exclusivo para trabajar con el padre, madre o encargado sentado junto al niño durante 10 a 15 minutos. No promovemos el uso libre de teléfonos ni tablets. Si no existe supervisión directa de un adulto, utilice únicamente el libro físico.';
    window.hablarConSaludoEscuela(textoFijo, 'es-ES', btn);
  };

  /* --------------------------------------------------------------------------
     CONTROL DEL ACORDEÓN DESPLEGABLE DE AVISO PARENTAL
     -------------------------------------------------------------------------- */
  window.toggleAvisoParental = function (ev) {
    var cont = document.getElementById('avisoParentalCollapsible');
    var btnToggle = document.getElementById('btnAvisoToggle');
    var cuerpo = document.getElementById('avisoParentalCuerpo');
    var txt = document.getElementById('avisoToggleTexto');
    if (!cont) return;

    var abierto = cont.classList.toggle('abierto');
    if (btnToggle) btnToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    if (cuerpo) cuerpo.setAttribute('aria-hidden', abierto ? 'false' : 'true');
    if (txt) txt.textContent = abierto ? '▲ Ocultar' : 'Ver más ▾';
  };

  window.cerrarAvisoParental = function () {
    var cont = document.getElementById('avisoParentalCollapsible');
    var btnToggle = document.getElementById('btnAvisoToggle');
    var cuerpo = document.getElementById('avisoParentalCuerpo');
    var txt = document.getElementById('avisoToggleTexto');
    if (!cont) return;

    cont.classList.remove('abierto');
    if (btnToggle) btnToggle.setAttribute('aria-expanded', 'false');
    if (cuerpo) cuerpo.setAttribute('aria-hidden', 'true');
    if (txt) txt.textContent = 'Ver más ▾';
  };

  window.toggleAudioAvisoAdulto = function (btn) {
    var textoFijo = 'Esta sección de Prebásica es un complemento exclusivo para trabajar con el padre, madre o encargado sentado junto al niño durante 10 a 15 minutos. No promovemos el uso libre de teléfonos ni tablets. Si no existe supervisión directa de un adulto, utilice únicamente el libro físico.';
    var limpio = normalizarTextoAudio(textoFijo);

    // Si ya está sonando este aviso (o cualquier audio) y el botón o texto coinciden:
    if (window.audioPrebasicaPlaying && (
      (btn && btn === window.ultimoBotonAudio) ||
      window.ultimoTextoAudio === limpio
    )) {
      window.detenerAudioPrebasica();
      return;
    }

    // Si no está sonando este aviso, reproducir con saludo
    window.hablarConSaludoEscuela(textoFijo, 'es-ES', btn);
  };

  /* --------------------------------------------------------------------------
     NAVEGACIÓN ENTRE LAS 5 PESTAÑAS
     -------------------------------------------------------------------------- */
  window.go = function (secId) {
    window.detenerVozPrebasica();
    if (traceAutoAdvanceTimer) { clearTimeout(traceAutoAdvanceTimer); traceAutoAdvanceTimer = null; }
    if (figuraAutoAdvanceTimer) { clearTimeout(figuraAutoAdvanceTimer); figuraAutoAdvanceTimer = null; }
    if (rodeaAutoAdvanceTimer) { clearTimeout(rodeaAutoAdvanceTimer); rodeaAutoAdvanceTimer = null; }
    if (puzzleAutoAdvanceTimer) { clearTimeout(puzzleAutoAdvanceTimer); puzzleAutoAdvanceTimer = null; }
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
    } else if (secId === 's-figuras') {
      setTimeout(renderFiguraCanvas, 40);
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

  function buildCheckpointsForTrace(ch, w, h) {
    var checkpoints = [];
    var numSegments = 1;

    if (ch.id === 'verticales') {
      var cols = [w * 0.23, w * 0.50, w * 0.77];
      numSegments = cols.length; // 3 columnas / segmentos
      var perCol = 12; // 36 checkpoints
      cols.forEach(function (cx, sIdx) {
        for (var i = 0; i < perCol; i++) {
          var t = (i + 0.5) / perCol;
          checkpoints.push({
            x: cx,
            y: 72 + (h - 144) * t,
            segmentIdx: sIdx,
            hit: false
          });
        }
      });
    } else if (ch.id === 'horizontales') {
      var rows = [h * 0.33, h * 0.68];
      numSegments = rows.length; // 2 filas / segmentos
      var perRow = 18; // 36 checkpoints
      rows.forEach(function (ry, sIdx) {
        for (var i = 0; i < perRow; i++) {
          var t = (i + 0.5) / perRow;
          checkpoints.push({
            x: 85 + (w - 170) * t,
            y: ry,
            segmentIdx: sIdx,
            hit: false
          });
        }
      });
    } else if (ch.id === 'zigzag') {
      var vertices = [
        { x: 85, y: h * 0.72 },
        { x: w * 0.24, y: h * 0.24 },
        { x: w * 0.39, y: h * 0.74 },
        { x: w * 0.54, y: h * 0.24 },
        { x: w * 0.69, y: h * 0.74 },
        { x: w * 0.83, y: h * 0.24 },
        { x: w - 85, y: h * 0.68 }
      ];
      numSegments = vertices.length - 1; // 6 pendientes / segmentos
      var perSlope = 8; // 48 checkpoints
      for (var s = 0; s < numSegments; s++) {
        var a = vertices[s];
        var b = vertices[s + 1];
        for (var k = 0; k < perSlope; k++) {
          var t = (k + 0.5) / perSlope;
          checkpoints.push({
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t,
            segmentIdx: s,
            hit: false
          });
        }
      }
    } else if (ch.id === 'inclinadas') {
      numSegments = 2; // 2 cometas / diagonales
      var perKite = 18; // 36 checkpoints
      var segs = [
        { a: { x: 100, y: h - 75 }, b: { x: w * 0.48, y: 78 } },
        { a: { x: w * 0.45, y: h - 75 }, b: { x: w - 95, y: 78 } }
      ];
      segs.forEach(function (sg, sIdx) {
        for (var i = 0; i < perKite; i++) {
          var t = (i + 0.5) / perKite;
          checkpoints.push({
            x: sg.a.x + (sg.b.x - sg.a.x) * t,
            y: sg.a.y + (sg.b.y - sg.a.y) * t,
            segmentIdx: sIdx,
            hit: false
          });
        }
      });
    } else if (ch.id === 'onduladas') {
      numSegments = 4; // 4 cuadrantes / tramos de onda
      var perQuarter = 9; // 36 checkpoints
      var totalSteps = numSegments * perQuarter;
      for (var i = 0; i < totalSteps; i++) {
        var t = (i + 0.5) / totalSteps;
        var sIdx = Math.min(numSegments - 1, Math.floor(i / perQuarter));
        var x = 85 + (w - 170) * t;
        var y = h * 0.52 + Math.sin(t * Math.PI * 3.5) * (h * 0.25);
        checkpoints.push({
          x: x,
          y: y,
          segmentIdx: sIdx,
          hit: false
        });
      }
    } else if (ch.id === 'arabescos') {
      numSegments = 4; // 4 cuadrantes / giros de espiral
      var perQuarter = 9; // 36 checkpoints
      var totalSteps = numSegments * perQuarter;
      for (var i = 0; i < totalSteps; i++) {
        var t = (i + 0.5) / totalSteps;
        var sIdx = Math.min(numSegments - 1, Math.floor(i / perQuarter));
        var x = 85 + (w - 180) * t + Math.sin(t * Math.PI * 4) * 38;
        var y = h * 0.50 - Math.cos(t * Math.PI * 4) * (h * 0.27);
        checkpoints.push({
          x: x,
          y: y,
          segmentIdx: sIdx,
          hit: false
        });
      }
    }

    return {
      checkpoints: checkpoints,
      numSegments: numSegments
    };
  }

  /* --------------------------------------------------------------------------
     HELPER: PROYECCIÓN MAGNÉTICA AL CAMINO GUÍA (SNAP-TO-PATH / MÁSCARA CARRIL)
     Calcula la distancia mínima entre un punto (x, y) y los segmentos del camino
     o contorno guía, retornando la coordenada exacta sobre la línea más cercana.
     -------------------------------------------------------------------------- */
  function puntoMasCercanoEnCamino(pt, paths) {
    if (!pt || !paths || paths.length === 0) return null;
    var bestDistSq = Infinity;
    var bestPt = null;
    var bestPathIdx = -1;
    var bestSegIdx = -1;

    for (var p = 0; p < paths.length; p++) {
      var path = paths[p];
      if (!path || path.length === 0) continue;
      if (path.length === 1) {
        var d2 = (pt.x - path[0].x) * (pt.x - path[0].x) + (pt.y - path[0].y) * (pt.y - path[0].y);
        if (d2 < bestDistSq) {
          bestDistSq = d2;
          bestPt = { x: path[0].x, y: path[0].y };
          bestPathIdx = p;
          bestSegIdx = 0;
        }
        continue;
      }
      for (var i = 0; i < path.length - 1; i++) {
        var ax = path[i].x;
        var ay = path[i].y;
        var bx = path[i + 1].x;
        var by = path[i + 1].y;

        var abx = bx - ax;
        var aby = by - ay;
        var apx = pt.x - ax;
        var apy = pt.y - ay;

        var abLenSq = abx * abx + aby * aby;
        var t = 0;
        if (abLenSq > 0.0001) {
          t = (apx * abx + apy * aby) / abLenSq;
          if (t < 0) t = 0;
          else if (t > 1) t = 1;
        }

        var projX = ax + t * abx;
        var projY = ay + t * aby;
        var dx = pt.x - projX;
        var dy = pt.y - projY;
        var distSq = dx * dx + dy * dy;

        if (distSq < bestDistSq) {
          bestDistSq = distSq;
          bestPt = { x: projX, y: projY };
          bestPathIdx = p;
          bestSegIdx = i;
        }
      }
    }

    if (!bestPt) return null;
    return {
      point: bestPt,
      dist: Math.sqrt(bestDistSq),
      pathIdx: bestPathIdx,
      segIdx: bestSegIdx
    };
  }

  var traceAutoAdvanceTimer = null;
  var traceState = {
    currentIdx: 0,
    color: 'rainbow',
    hue: 0,
    isDrawing: false,
    inLane: false,
    lastPathIdx: -1,
    lastPt: null,
    userStrokes: [],
    waypoints: [],
    numSegments: 1,
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
      // Si el reto ya llegó al 100%, desactivar dibujo para permitir scroll libre
      if (traceState.completedCurrent) {
        traceState.isDrawing = false;
        traceState.inLane = false;
        return;
      }

      var pt = getCanvasPoint(e);
      var paths = traceState.paths;
      if (!paths || paths.length === 0) {
        var ch = TRACE_CHALLENGES[traceState.currentIdx];
        if (ch) paths = ch.buildPaths(canvas.width, canvas.height);
      }
      var snap = puntoMasCercanoEnCamino(pt, paths);

      // Si el toque inicia en zona blanca lejos del inicio/camino (> 32px),
      // NO activar dibujo ni llamar preventDefault: permitir scroll vertical normal
      if (!snap || snap.dist > 32) {
        traceState.isDrawing = false;
        traceState.inLane = false;
        return;
      }

      // Toque directo sobre el carril guía o punto de inicio: capturar trazo
      if (e.cancelable) e.preventDefault();
      traceState.isDrawing = true;
      traceState.inLane = true;
      traceState.lastPathIdx = snap.pathIdx;
      traceState.lastPt = snap.point;
      traceState.userStrokes.push({
        color: traceState.color,
        points: [{ x: snap.point.x, y: snap.point.y, hue: traceState.hue }]
      });
      checkTraceWaypoints(snap.point);
      renderTraceCanvas();
    }

    function moveDraw(e) {
      if (!traceState.isDrawing) return;
      if (traceState.completedCurrent) {
        traceState.isDrawing = false;
        traceState.inLane = false;
        return;
      }
      if (e.cancelable) e.preventDefault();

      var pt = getCanvasPoint(e);
      var paths = traceState.paths;
      if (!paths || paths.length === 0) {
        var ch = TRACE_CHALLENGES[traceState.currentIdx];
        if (ch) paths = ch.buildPaths(canvas.width, canvas.height);
      }
      var snap = puntoMasCercanoEnCamino(pt, paths);

      // Si el dedo está FUERA del radio del carril guía (> 28px):
      // NO dibujar absolutamente nada (ignorar trazo para que el fondo blanco no se manche)
      if (!snap || snap.dist > 28) {
        traceState.inLane = false;
        return;
      }

      // DENTRO del carril guía (<= 28px): pintar únicamente sobre la coordenada exacta del camino
      traceState.hue = (traceState.hue + 7) % 360;
      var snappedPt = snap.point;

      // Si reingresa al carril tras haber salido o cambió de línea (ej. columnas separadas),
      // iniciar un nuevo segmento para no trazar líneas que crucen el fondo blanco
      if (!traceState.inLane || snap.pathIdx !== traceState.lastPathIdx || traceState.userStrokes.length === 0) {
        traceState.userStrokes.push({
          color: traceState.color,
          points: [{ x: snappedPt.x, y: snappedPt.y, hue: traceState.hue }]
        });
        traceState.inLane = true;
        traceState.lastPathIdx = snap.pathIdx;
      } else {
        var currentStroke = traceState.userStrokes[traceState.userStrokes.length - 1];
        if (currentStroke && currentStroke.points && currentStroke.points.length > 0) {
          var lastP = currentStroke.points[currentStroke.points.length - 1];
          var dx = snappedPt.x - lastP.x;
          var dy = snappedPt.y - lastP.y;
          // Evitar saturar puntos idénticos seguidos
          if (dx * dx + dy * dy >= 4) {
            currentStroke.points.push({ x: snappedPt.x, y: snappedPt.y, hue: traceState.hue });
          }
        } else {
          traceState.userStrokes.push({
            color: traceState.color,
            points: [{ x: snappedPt.x, y: snappedPt.y, hue: traceState.hue }]
          });
        }
      }

      traceState.lastPt = snappedPt;
      checkTraceWaypoints(snappedPt);
      renderTraceCanvas();
    }

    function endDraw(e) {
      if (!traceState.isDrawing) return;
      if (e && e.cancelable) e.preventDefault();
      traceState.isDrawing = false;
      traceState.inLane = false;
      traceState.lastPt = null;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    canvas.addEventListener('touchend', endDraw, { passive: false });
    canvas.addEventListener('touchcancel', endDraw, { passive: false });
    window.addEventListener('touchend', endDraw, { passive: false });
    window.addEventListener('touchcancel', endDraw, { passive: false });
  }

  function renderTraceSelector() {
    var grid = document.getElementById('traceSelectorGrid');
    if (!grid) return;
    var panel = document.getElementById('traceWorkspacePanel');
    if (panel && panel.parentNode && panel.parentNode !== grid.parentNode) {
      grid.parentNode.insertBefore(panel, grid.nextSibling);
    }
    grid.innerHTML = '';
    TRACE_CHALLENGES.forEach(function (ch, idx) {
      var isCompleted = !!state.completedTraces[ch.id];
      var item = document.createElement('div');
      item.className = 'trace-acc-item' + (idx === traceState.currentIdx ? ' active' : '');
      item.id = 'traceAccItem-' + idx;

      var headerBtn = document.createElement('button');
      headerBtn.type = 'button';
      headerBtn.className = 'trace-acc-header' + (idx === traceState.currentIdx ? ' active' : '');
      headerBtn.innerHTML =
        '<span class="trace-chip-ico" aria-hidden="true">' + ch.ico + '</span>' +
        '<div class="trace-chip-info" style="flex:1;">' +
          '<strong>' + ch.title + '</strong>' +
          '<span>' + ch.subtitle + '</span>' +
        '</div>' +
        '<div class="trace-acc-status">' +
          (isCompleted ? '<span class="acc-tag-done">✓ ¡Listo!</span>' : '<span class="acc-tag-pending">✏ Trazar</span>') +
          '<span class="acc-chevron">' + (idx === traceState.currentIdx ? '▲' : '▼') + '</span>' +
        '</div>';

      headerBtn.onclick = function () {
        selectTraceChallenge(idx, true);
      };

      var body = document.createElement('div');
      body.className = 'trace-acc-body';
      body.id = 'traceAccBody-' + idx;

      item.appendChild(headerBtn);
      item.appendChild(body);
      grid.appendChild(item);

      if (idx === traceState.currentIdx && panel) {
        body.appendChild(panel);
      }
    });
  }

  function selectTraceChallenge(idx, speak) {
    if (traceAutoAdvanceTimer) {
      clearTimeout(traceAutoAdvanceTimer);
      traceAutoAdvanceTimer = null;
    }
    window.detenerVozPrebasica();
    traceState.currentIdx = idx;
    traceState.userStrokes = [];
    traceState.completedCurrent = false;
    traceState.isDrawing = false;
    traceState.inLane = false;
    traceState.lastPt = null;
    traceState.lastPathIdx = -1;

    var canvas = document.getElementById('traceCanvas');
    var ch = TRACE_CHALLENGES[idx];
    var guideEl = document.getElementById('traceParentGuideText');
    if (guideEl && ch) guideEl.textContent = ch.guideText;

    if (canvas && ch) {
      var paths = ch.buildPaths(canvas.width, canvas.height);
      var cpData = buildCheckpointsForTrace(ch, canvas.width, canvas.height);
      traceState.waypoints = cpData.checkpoints;
      traceState.numSegments = cpData.numSegments;
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

    var btnSigTrazo = document.getElementById('btnSiguienteRetoTrazo');
    if (btnSigTrazo) {
      if (idx === TRACE_CHALLENGES.length - 1) {
        btnSigTrazo.innerHTML = '➡ Pasar a 2. Figuras con mi Dedito';
      } else {
        btnSigTrazo.innerHTML = '➡ Siguiente reto';
      }
    }

    var activeAccItem = document.getElementById('traceAccItem-' + idx);
    if (activeAccItem) {
      try {
        activeAccItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (e) {}
    }

    if (speak && ch) {
      window.hablarTexto(ch.ttsText, 'es-ES');
    }
  }

  function checkTraceWaypoints(pt) {
    var hitRadius = 25;
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
      var pct = Math.floor((hits / total) * 100);

      var numSegments = traceState.numSegments || 1;
      var allSegmentsDone = true;
      for (var s = 0; s < numSegments; s++) {
        var segTotal = 0;
        var segHits = 0;
        traceState.waypoints.forEach(function (w) {
          if (w.segmentIdx === s) {
            segTotal++;
            if (w.hit) segHits++;
          }
        });
        if (segTotal > 0 && (segHits / segTotal) < 0.85) {
          allSegmentsDone = false;
          break;
        }
      }

      var displayPct = (allSegmentsDone && pct >= 92) ? 100 : Math.min(99, pct);
      updateTraceProgressUI(displayPct);

      if (allSegmentsDone && pct >= 92 && !traceState.completedCurrent) {
        traceState.completedCurrent = true;
        traceState.isDrawing = false;
        traceState.inLane = false;
        traceState.waypoints.forEach(function (w) { w.hit = true; });
        updateTraceProgressUI(100);
        renderTraceCanvas();
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
          statusMsg.innerHTML = '🎉 <strong>¡Felicidades! ✓</strong> Completaste el trazo hasta la meta con mucho control. Toca <strong>🧹 Borrar trazo</strong> si deseas repasar.';
        }
        window.hablarTexto('¡Muy bien! Llegaste a la meta. ¡Excelente trazo!', 'es-ES');
        renderTraceSelector();

        if (traceAutoAdvanceTimer) clearTimeout(traceAutoAdvanceTimer);
        traceAutoAdvanceTimer = setTimeout(function () {
          window.siguienteRetoTrazo();
        }, 1800);
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

    // Si el reto de trazo está 100% completado, pintar todo el camino continuo sin huecos
    if (traceState.completedCurrent && paths) {
      paths.forEach(function (path) {
        if (!path || path.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        if (traceState.color === 'rainbow') {
          var grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, '#e53935');
          grad.addColorStop(0.2, '#fb8c00');
          grad.addColorStop(0.4, '#fbc02d');
          grad.addColorStop(0.6, '#43a047');
          grad.addColorStop(0.8, '#1e88e5');
          grad.addColorStop(1, '#8e24aa');
          ctx.strokeStyle = grad;
        } else {
          ctx.strokeStyle = traceState.color || '#e65100';
        }
        ctx.lineWidth = 22;
        ctx.stroke();

        // Brillo interior blanco de celebración
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (var j = 1; j < path.length; j++) {
          ctx.lineTo(path[j].x, path[j].y);
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.restore();
      });
    }

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
    if (traceAutoAdvanceTimer) {
      clearTimeout(traceAutoAdvanceTimer);
      traceAutoAdvanceTimer = null;
    }
    selectTraceChallenge(traceState.currentIdx, false);
  };

  window.siguienteRetoTrazo = function () {
    if (traceAutoAdvanceTimer) {
      clearTimeout(traceAutoAdvanceTimer);
      traceAutoAdvanceTimer = null;
    }
    if (traceState.currentIdx < TRACE_CHALLENGES.length - 1) {
      selectTraceChallenge(traceState.currentIdx + 1, true);
    } else {
      window.detenerVozPrebasica();
      window.go('s-figuras');
      selectFigura(0, true);
      var sec = document.getElementById('s-figuras');
      if (sec) {
        try {
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) {}
      }
    }
  };

  window.leerRetoTrazoActual = function (btn) {
    var ch = TRACE_CHALLENGES[traceState.currentIdx];
    if (ch) {
      window.hablarConSaludoEscuela(ch.ttsText, 'es-ES', btn);
    }
  };

  /* ==========================================================================
     PESTAÑA 2: FIGURAS PLANAS CON MI DEDITO (PÁGS. 25–32)
     ========================================================================== */
  window.lanzarConfetiPrebasica = function () {
    var colors = ['#e53935', '#1e88e5', '#43a047', '#fb8c00', '#e91e63', '#fbc02d', '#9c27b0', '#00bcd4'];
    for (var i = 0; i < 60; i++) {
      var c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.cssText =
        'left:' + (Math.random() * 100) + 'vw;' +
        'background:' + colors[Math.floor(Math.random() * colors.length)] + ';' +
        'animation-duration:' + (0.9 + Math.random() * 1.5) + 's;' +
        'animation-delay:' + (Math.random() * 0.35) + 's;' +
        'width:' + (8 + Math.random() * 8) + 'px;' +
        'height:' + (8 + Math.random() * 8) + 'px;' +
        'border-radius:' + (Math.random() > 0.5 ? '50%' : '3px') + ';';
      document.body.appendChild(c);
      c.addEventListener('animationend', function () {
        if (this.parentNode) this.parentNode.removeChild(this);
      });
    }
  };

  var FIGURAS_DATA = [
    {
      id: 'circulo',
      nameEs: 'Círculo',
      nameEn: 'Circle',
      audioEnKey: 'Circle',
      bookColorName: 'Rojo',
      colorHex: '#e53935',
      page: 25,
      emoji: '🔴',
      selectorTitle: '1. Círculo',
      selectorSubtitle: 'Pág. 25 · Rojo',
      badges: [
        { text: '⭕ Línea curva continua', cls: 'curva' },
        { text: '0 esquinas (rueda)', cls: 'curva' }
      ],
      guideText: 'Pasa tu dedito por el contorno del círculo rojo. Es una línea curva que rueda y no tiene esquinas.',
      audioInst: 'fig_instruccion_circulo',
      audioFelicita: 'fig_felicita_circulo',
      hasSubfigures: false,
      buildPerimeter: function (w, h) {
        var cx = w * 0.5;
        var cy = h * 0.5;
        var r = 135;
        var pts = [];
        var numPts = 32;
        for (var i = 0; i <= numPts; i++) {
          var angle = -Math.PI / 2 + (i / numPts) * (Math.PI * 2);
          pts.push({ x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
        }
        var numberedMarkers = [];
        for (var n = 1; n <= 8; n++) {
          var ang = -Math.PI / 2 + ((n - 1) / 8) * (Math.PI * 2);
          numberedMarkers.push({
            num: n,
            x: cx + r * Math.cos(ang),
            y: cy + r * Math.sin(ang),
            label: '' + n
          });
        }
        var checkpoints = [];
        var numSegments = 4;
        var perSeg = 8;
        for (var s = 0; s < numSegments; s++) {
          for (var k = 0; k < perSeg; k++) {
            var t = (k + 0.5) / perSeg;
            var a = -Math.PI / 2 + ((s + t) / numSegments) * (Math.PI * 2);
            checkpoints.push({
              x: cx + r * Math.cos(a),
              y: cy + r * Math.sin(a),
              segmentIdx: s,
              hit: false
            });
          }
        }
        return {
          type: 'single',
          paths: [pts],
          checkpoints: checkpoints,
          numSegments: numSegments,
          fillColor: 'rgba(229, 57, 53, 0.08)',
          strokeColor: '#e53935',
          markers: numberedMarkers,
          centerText: 'Línea curva sin esquinas'
        };
      },
      objects: [
        { id: 'cd', name: 'CD o Disco', ico: '💿', audioKey: 'fig_obj_cd' },
        { id: 'reloj', name: 'Reloj de pared', ico: '⏰', audioKey: 'fig_obj_reloj' },
        { id: 'pizza', name: 'Pizza redonda', ico: '🍕', audioKey: 'fig_obj_pizza' },
        { id: 'plato', name: 'Plato', ico: '🍽️', audioKey: 'fig_obj_plato' }
      ]
    },
    {
      id: 'cuadrado',
      nameEs: 'Cuadrado',
      nameEn: 'Square',
      audioEnKey: 'Square',
      bookColorName: 'Azul',
      colorHex: '#1e88e5',
      page: 26,
      emoji: '🟦',
      selectorTitle: '2. Cuadrado',
      selectorSubtitle: 'Pág. 26 · Azul',
      badges: [
        { text: '⏹️ 4 lados rectos iguales', cls: 'cuadrado-iguales' },
        { text: '4 esquinas (vértices)', cls: 'cuadrado-iguales' }
      ],
      guideText: 'Pasa tu dedito por el contorno del cuadrado azul y cuenta sus cuatro lados rectos iguales.',
      audioInst: 'fig_instruccion_cuadrado',
      audioFelicita: 'fig_felicita_cuadrado',
      hasSubfigures: false,
      buildPerimeter: function (w, h) {
        var size = 260;
        var x0 = (w - size) / 2;
        var y0 = (h - size) / 2;
        var x1 = x0 + size;
        var y1 = y0 + size;
        var vertices = [
          { x: x0, y: y0 },
          { x: x1, y: y0 },
          { x: x1, y: y1 },
          { x: x0, y: y1 },
          { x: x0, y: y0 }
        ];
        var pts = interpolateSegments(vertices, 8);
        var markers = [
          { num: 1, x: x0, y: y0, label: '1' },
          { num: 2, x: x1, y: y0, label: '2' },
          { num: 3, x: x1, y: y1, label: '3' },
          { num: 4, x: x0, y: y1, label: '4' }
        ];
        var sideLabels = [
          { x: (x0 + x1) / 2, y: y0 - 16, text: 'Lado 1 (igual)' },
          { x: x1 + 45, y: (y0 + y1) / 2, text: 'Lado 2 (igual)' },
          { x: (x0 + x1) / 2, y: y1 + 22, text: 'Lado 3 (igual)' },
          { x: x0 - 45, y: (y0 + y1) / 2, text: 'Lado 4 (igual)' }
        ];
        var checkpoints = [];
        var numSegments = 4;
        var perSide = 8;
        var sideCorners = [
          { a: { x: x0, y: y0 }, b: { x: x1, y: y0 } },
          { a: { x: x1, y: y0 }, b: { x: x1, y: y1 } },
          { a: { x: x1, y: y1 }, b: { x: x0, y: y1 } },
          { a: { x: x0, y: y1 }, b: { x: x0, y: y0 } }
        ];
        sideCorners.forEach(function (sc, sIdx) {
          for (var k = 0; k < perSide; k++) {
            var t = (k + 0.5) / perSide;
            checkpoints.push({
              x: sc.a.x + (sc.b.x - sc.a.x) * t,
              y: sc.a.y + (sc.b.y - sc.a.y) * t,
              segmentIdx: sIdx,
              hit: false
            });
          }
        });
        return {
          type: 'single',
          paths: [pts],
          checkpoints: checkpoints,
          numSegments: numSegments,
          fillColor: 'rgba(30, 136, 229, 0.08)',
          strokeColor: '#1e88e5',
          markers: markers,
          sideLabels: sideLabels,
          centerText: '4 LADOS IGUALES'
        };
      },
      objects: [
        { id: 'chocolate', name: 'Barra de chocolate', ico: '🍫', audioKey: 'fig_obj_chocolate' },
        { id: 'ventana', name: 'Ventana cuadrada', ico: '🪟', audioKey: 'fig_obj_ventana' },
        { id: 'fichas', name: 'Fichas de letras', ico: '🔤', audioKey: 'fig_obj_fichas' },
        { id: 'nota', name: 'Nota adhesiva', ico: '📝', audioKey: 'fig_obj_nota' }
      ]
    },
    {
      id: 'triangulo',
      nameEs: 'Triángulo',
      nameEn: 'Triangle',
      audioEnKey: 'Triangle',
      bookColorName: 'Verde',
      colorHex: '#43a047',
      page: 27,
      emoji: '🔺',
      selectorTitle: '3. Triángulo',
      selectorSubtitle: 'Pág. 27 · Verde',
      badges: [
        { text: '📐 3 lados rectos', cls: 'triangulo' },
        { text: '3 puntas o esquinas', cls: 'triangulo' }
      ],
      guideText: 'Recorre con tu dedito los tres lados rectos y las tres puntas del triángulo verde.',
      audioInst: 'fig_instruccion_triangulo',
      audioFelicita: 'fig_felicita_triangulo',
      hasSubfigures: false,
      buildPerimeter: function (w, h) {
        var v1 = { x: w * 0.5, y: 55 };
        var v2 = { x: w * 0.5 + 165, y: 345 };
        var v3 = { x: w * 0.5 - 165, y: 345 };
        var vertices = [v1, v2, v3, v1];
        var pts = interpolateSegments(vertices, 10);
        var markers = [
          { num: 1, x: v1.x, y: v1.y, label: '1 (Punta)' },
          { num: 2, x: v2.x, y: v2.y, label: '2 (Punta)' },
          { num: 3, x: v3.x, y: v3.y, label: '3 (Punta)' }
        ];
        var sideLabels = [
          { x: (v1.x + v2.x) / 2 + 35, y: (v1.y + v2.y) / 2, text: 'Lado 1' },
          { x: w * 0.5, y: v2.y + 22, text: 'Lado 2' },
          { x: (v1.x + v3.x) / 2 - 35, y: (v1.y + v3.y) / 2, text: 'Lado 3' }
        ];
        var checkpoints = [];
        var numSegments = 3;
        var perSide = 10;
        var sides = [
          { a: v1, b: v2 },
          { a: v2, b: v3 },
          { a: v3, b: v1 }
        ];
        sides.forEach(function (sd, sIdx) {
          for (var k = 0; k < perSide; k++) {
            var t = (k + 0.5) / perSide;
            checkpoints.push({
              x: sd.a.x + (sd.b.x - sd.a.x) * t,
              y: sd.a.y + (sd.b.y - sd.a.y) * t,
              segmentIdx: sIdx,
              hit: false
            });
          }
        });
        return {
          type: 'single',
          paths: [pts],
          checkpoints: checkpoints,
          numSegments: numSegments,
          fillColor: 'rgba(67, 160, 71, 0.08)',
          strokeColor: '#43a047',
          markers: markers,
          sideLabels: sideLabels,
          centerText: '3 LADOS Y 3 PUNTAS'
        };
      },
      objects: [
        { id: 'senal_vial', name: 'Señal vial', ico: '⚠️', audioKey: 'fig_obj_senal_vial' },
        { id: 'queso', name: 'Trozo de queso', ico: '🧀', audioKey: 'fig_obj_queso' },
        { id: 'sandwich', name: 'Sándwich', ico: '🥪', audioKey: 'fig_obj_sandwich' },
        { id: 'triangulo_musical', name: 'Triángulo musical', ico: '📐', audioKey: 'fig_obj_triangulo_musical' }
      ]
    },
    {
      id: 'rectangulo',
      nameEs: 'Rectángulo',
      nameEn: 'Rectangle',
      audioEnKey: 'Rectangle',
      bookColorName: 'Anaranjado',
      colorHex: '#fb8c00',
      page: 28,
      emoji: '🟧',
      selectorTitle: '4. Rectángulo',
      selectorSubtitle: 'Pág. 28 · Anaranjado',
      badges: [
        { text: '↔ 2 lados LARGOS iguales', cls: 'rect-largos' },
        { text: '↕ 2 lados CORTOS iguales', cls: 'rect-cortos' },
        { text: '4 esquinas', cls: 'rect-largos' }
      ],
      guideText: 'Recorre los dos lados largos y los dos lados cortos del rectángulo anaranjado.',
      audioInst: 'fig_instruccion_rectangulo',
      audioFelicita: 'fig_felicita_rectangulo',
      hasSubfigures: false,
      buildPerimeter: function (w, h) {
        var rw = 380;
        var rh = 200;
        var x0 = (w - rw) / 2;
        var y0 = (h - rh) / 2;
        var x1 = x0 + rw;
        var y1 = y0 + rh;
        var vertices = [
          { x: x0, y: y0 },
          { x: x1, y: y0 },
          { x: x1, y: y1 },
          { x: x0, y: y1 },
          { x: x0, y: y0 }
        ];
        var pts = interpolateSegments(vertices, 9);
        var markers = [
          { num: 1, x: x0, y: y0, label: '1' },
          { num: 2, x: x1, y: y0, label: '2' },
          { num: 3, x: x1, y: y1, label: '3' },
          { num: 4, x: x0, y: y1, label: '4' }
        ];
        var sideLabels = [
          { x: (x0 + x1) / 2, y: y0 - 18, text: '↔ LADO LARGO 1', color: '#e65100' },
          { x: x1 + 42, y: (y0 + y1) / 2, text: '↕ CORTO 1', color: '#00838f' },
          { x: (x0 + x1) / 2, y: y1 + 24, text: '↔ LADO LARGO 2', color: '#e65100' },
          { x: x0 - 42, y: (y0 + y1) / 2, text: '↕ CORTO 2', color: '#00838f' }
        ];
        var checkpoints = [];
        var numSegments = 4;
        var perSide = 8;
        var sideCorners = [
          { a: { x: x0, y: y0 }, b: { x: x1, y: y0 } },
          { a: { x: x1, y: y0 }, b: { x: x1, y: y1 } },
          { a: { x: x1, y: y1 }, b: { x: x0, y: y1 } },
          { a: { x: x0, y: y1 }, b: { x: x0, y: y0 } }
        ];
        sideCorners.forEach(function (sc, sIdx) {
          for (var k = 0; k < perSide; k++) {
            var t = (k + 0.5) / perSide;
            checkpoints.push({
              x: sc.a.x + (sc.b.x - sc.a.x) * t,
              y: sc.a.y + (sc.b.y - sc.a.y) * t,
              segmentIdx: sIdx,
              hit: false
            });
          }
        });
        return {
          type: 'rectangle_distinct',
          x0: x0, y0: y0, x1: x1, y1: y1,
          paths: [pts],
          checkpoints: checkpoints,
          numSegments: numSegments,
          fillColor: 'rgba(251, 140, 0, 0.08)',
          markers: markers,
          sideLabels: sideLabels,
          centerText: '2 LARGOS ↔ y 2 CORTOS ↕'
        };
      },
      objects: [
        { id: 'sobres', name: 'Sobres de carta', ico: '✉️', audioKey: 'fig_obj_sobres' },
        { id: 'celular', name: 'Teléfono celular', ico: '📱', audioKey: 'fig_obj_celular' },
        { id: 'regla', name: 'Regla escolar', ico: '📏', audioKey: 'fig_obj_regla' },
        { id: 'televisor', name: 'Televisor', ico: '📺', audioKey: 'fig_obj_televisor' },
        { id: 'libro', name: 'Libro escolar', ico: '📖', audioKey: 'fig_obj_libro' }
      ]
    },
    {
      id: 'ovalo',
      nameEs: 'Óvalo',
      nameEn: 'Oval',
      audioEnKey: 'Oval',
      bookColorName: 'Rosado / Fucsia',
      colorHex: '#e91e63',
      page: 29,
      emoji: '🥚',
      selectorTitle: '5. Óvalo',
      selectorSubtitle: 'Pág. 29 · Rosado',
      badges: [
        { text: '🥚 Curva alargada como huevito', cls: 'curva' },
        { text: '0 esquinas', cls: 'curva' }
      ],
      guideText: 'Pasa tu dedito por la curva alargada del óvalo rosado, parece la forma de un huevito.',
      audioInst: 'fig_instruccion_ovalo',
      audioFelicita: 'fig_felicita_ovalo',
      hasSubfigures: false,
      buildPerimeter: function (w, h) {
        var cx = w * 0.5;
        var cy = h * 0.5;
        var rx = 185;
        var ry = 115;
        var pts = [];
        var numPts = 32;
        for (var i = 0; i <= numPts; i++) {
          var angle = -Math.PI / 2 + (i / numPts) * (Math.PI * 2);
          pts.push({ x: cx + rx * Math.cos(angle), y: cy + ry * Math.sin(angle) });
        }
        var numberedMarkers = [];
        for (var n = 1; n <= 8; n++) {
          var ang = -Math.PI / 2 + ((n - 1) / 8) * (Math.PI * 2);
          numberedMarkers.push({
            num: n,
            x: cx + rx * Math.cos(ang),
            y: cy + ry * Math.sin(ang),
            label: '' + n
          });
        }
        var checkpoints = [];
        var numSegments = 4;
        var perSeg = 8;
        for (var s = 0; s < numSegments; s++) {
          for (var k = 0; k < perSeg; k++) {
            var t = (k + 0.5) / perSeg;
            var a = -Math.PI / 2 + ((s + t) / numSegments) * (Math.PI * 2);
            checkpoints.push({
              x: cx + rx * Math.cos(a),
              y: cy + ry * Math.sin(a),
              segmentIdx: s,
              hit: false
            });
          }
        }
        return {
          type: 'single',
          paths: [pts],
          checkpoints: checkpoints,
          numSegments: numSegments,
          fillColor: 'rgba(233, 30, 99, 0.08)',
          strokeColor: '#e91e63',
          markers: numberedMarkers,
          centerText: 'Curva alargada como un huevito'
        };
      },
      objects: [
        { id: 'bandeja', name: 'Bandeja', ico: '🍱', audioKey: 'fig_obj_bandeja' },
        { id: 'balon', name: 'Balón americano', ico: '🏈', audioKey: 'fig_obj_balon' },
        { id: 'huevo', name: 'Huevo', ico: '🥚', audioKey: 'fig_obj_huevo' },
        { id: 'sandia', name: 'Sandía ovalada', ico: '🍉', audioKey: 'fig_obj_sandia' }
      ]
    },
    {
      id: 'rombo',
      nameEs: 'Diamante o Rombo',
      nameEn: 'Diamond',
      audioEnKey: 'Diamond',
      bookColorName: 'Rojo',
      colorHex: '#d32f2f',
      page: 30,
      emoji: '♦️',
      selectorTitle: '6. Rombo / Diamante',
      selectorSubtitle: 'Pág. 30 · Rojo',
      badges: [
        { text: '♦️ 4 lados inclinados iguales', cls: 'rombo' },
        { text: '4 puntas (arriba, abajo, izq, der)', cls: 'rombo' }
      ],
      guideText: 'Traza los cuatro lados inclinados del rombo o diamante rojo y toca sus cuatro puntas.',
      audioInst: 'fig_instruccion_rombo',
      audioFelicita: 'fig_felicita_rombo',
      hasSubfigures: false,
      buildPerimeter: function (w, h) {
        var cx = w * 0.5;
        var cy = h * 0.5;
        var rx = 160;
        var ry = 145;
        var p1 = { x: cx, y: cy - ry };
        var p2 = { x: cx + rx, y: cy };
        var p3 = { x: cx, y: cy + ry };
        var p4 = { x: cx - rx, y: cy };
        var vertices = [p1, p2, p3, p4, p1];
        var pts = interpolateSegments(vertices, 8);
        var markers = [
          { num: 1, x: p1.x, y: p1.y, label: '1 (Arriba)' },
          { num: 2, x: p2.x, y: p2.y, label: '2 (Derecha)' },
          { num: 3, x: p3.x, y: p3.y, label: '3 (Abajo)' },
          { num: 4, x: p4.x, y: p4.y, label: '4 (Izquierda)' }
        ];
        var sideLabels = [
          { x: (p1.x + p2.x) / 2 + 25, y: (p1.y + p2.y) / 2 - 10, text: 'Lado inclinado 1' },
          { x: (p2.x + p3.x) / 2 + 25, y: (p2.y + p3.y) / 2 + 10, text: 'Lado inclinado 2' },
          { x: (p3.x + p4.x) / 2 - 25, y: (p3.y + p4.y) / 2 + 10, text: 'Lado inclinado 3' },
          { x: (p4.x + p1.x) / 2 - 25, y: (p4.y + p1.y) / 2 - 10, text: 'Lado inclinado 4' }
        ];
        var checkpoints = [];
        var numSegments = 4;
        var perSide = 8;
        var sideCorners = [
          { a: p1, b: p2 },
          { a: p2, b: p3 },
          { a: p3, b: p4 },
          { a: p4, b: p1 }
        ];
        sideCorners.forEach(function (sc, sIdx) {
          for (var k = 0; k < perSide; k++) {
            var t = (k + 0.5) / perSide;
            checkpoints.push({
              x: sc.a.x + (sc.b.x - sc.a.x) * t,
              y: sc.a.y + (sc.b.y - sc.a.y) * t,
              segmentIdx: sIdx,
              hit: false
            });
          }
        });
        return {
          type: 'single',
          paths: [pts],
          checkpoints: checkpoints,
          numSegments: numSegments,
          fillColor: 'rgba(211, 47, 47, 0.08)',
          strokeColor: '#d32f2f',
          markers: markers,
          sideLabels: sideLabels,
          centerText: '4 LADOS INCLINADOS'
        };
      },
      objects: [
        { id: 'carta', name: 'Carta de diamantes', ico: '♦️', audioKey: 'fig_obj_carta' },
        { id: 'senal_amarilla', name: 'Señal amarilla', ico: '🔶', audioKey: 'fig_obj_senal_amarilla' }
      ]
    },
    {
      id: 'estrella_corazon',
      nameEs: 'Estrella y Corazón',
      nameEn: 'Star & Heart',
      audioEnKey: 'Star',
      bookColorName: 'Amarillo y Fucsia',
      colorHex: '#fbc02d',
      page: '31–32',
      emoji: '⭐💖',
      selectorTitle: '7. Estrella y Corazón',
      selectorSubtitle: 'Págs. 31–32 · Especial',
      hasSubfigures: true,
      currentSub: 'estrella',
      subfigures: {
        estrella: {
          nameEs: 'Estrella',
          nameEn: 'Star',
          audioEnKey: 'Star',
          bookColorName: 'Amarillo',
          colorHex: '#fbc02d',
          page: 31,
          emoji: '⭐',
          badges: [
            { text: '⭐ 5 puntas brillantes', cls: 'estrella' },
            { text: '10 lados en zigzag', cls: 'estrella' }
          ],
          guideText: 'Recorre las cinco puntas brillantes de la estrella amarilla como en el cielo o en el mar.',
          audioInst: 'fig_instruccion_estrella',
          audioFelicita: 'fig_felicita_estrella',
          buildPerimeter: function (w, h) {
            var cx = w * 0.5;
            var cy = h * 0.52;
            var rOuter = 145;
            var rInner = 65;
            var vertices = [];
            var numPoints = 5;
            for (var i = 0; i < numPoints * 2; i++) {
              var r = (i % 2 === 0) ? rOuter : rInner;
              var a = -Math.PI / 2 + (i * Math.PI) / numPoints;
              vertices.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
            }
            vertices.push(vertices[0]);
            var pts = interpolateSegments(vertices, 5);
            var markers = [];
            for (var p = 0; p < numPoints; p++) {
              var aOut = -Math.PI / 2 + (p * 2 * Math.PI) / numPoints;
              markers.push({
                num: p + 1,
                x: cx + rOuter * Math.cos(aOut),
                y: cy + rOuter * Math.sin(aOut),
                label: '' + (p + 1)
              });
            }
            var checkpoints = [];
            var numSegments = 5;
            for (var p = 0; p < numPoints; p++) {
              var vPeak = vertices[p * 2];
              var vValley = vertices[p * 2 + 1];
              var vNextPeak = vertices[p * 2 + 2];
              // Tramo 1 del segmento: Vértice Punta -> Vértice Valle
              for (var k1 = 0; k1 < 4; k1++) {
                var t1 = (k1 + 0.5) / 4;
                checkpoints.push({
                  x: vPeak.x + (vValley.x - vPeak.x) * t1,
                  y: vPeak.y + (vValley.y - vPeak.y) * t1,
                  segmentIdx: p,
                  hit: false
                });
              }
              // Tramo 2 del segmento: Vértice Valle -> Siguiente Punta (cierra en Punta 1)
              for (var k2 = 0; k2 < 4; k2++) {
                var t2 = (k2 + 0.5) / 4;
                checkpoints.push({
                  x: vValley.x + (vNextPeak.x - vValley.x) * t2,
                  y: vValley.y + (vNextPeak.y - vValley.y) * t2,
                  segmentIdx: p,
                  hit: false
                });
              }
            }
            return {
              type: 'single',
              paths: [pts],
              checkpoints: checkpoints,
              numSegments: numSegments,
              fillColor: 'rgba(251, 192, 45, 0.12)',
              strokeColor: '#fbc02d',
              markers: markers,
              centerText: '5 PUNTAS BRILLANTES'
            };
          },
          objects: [
            { id: 'estrella_mar', name: 'Estrella de mar', ico: '⭐', audioKey: 'fig_obj_estrella_mar' },
            { id: 'varita', name: 'Varita mágica', ico: '🪄', audioKey: 'fig_obj_varita' }
          ]
        },
        corazon: {
          nameEs: 'Corazón',
          nameEn: 'Heart',
          audioEnKey: 'Heart',
          bookColorName: 'Fucsia',
          colorHex: '#e91e63',
          page: 32,
          emoji: '💖',
          badges: [
            { text: '💖 2 curvas arriba', cls: 'corazon' },
            { text: '1 punta abajo', cls: 'corazon' }
          ],
          guideText: 'Traza las dos curvas de arriba y la punta de abajo de este lindo corazón fucsia.',
          audioInst: 'fig_instruccion_corazon',
          audioFelicita: 'fig_felicita_corazon',
          buildPerimeter: function (w, h) {
            var cx = w * 0.5;
            var cy = h * 0.44;
            var pts = [];
            var num = 36;
            for (var i = 0; i <= num; i++) {
              var t = (i / num) * Math.PI * 2;
              var scale = 8.5;
              var x = cx + scale * 16 * Math.pow(Math.sin(t), 3);
              var y = cy - scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
              pts.push({ x: x, y: y });
            }
            var markers = [
              { num: 1, x: cx, y: cy - 75, label: '1 (Centro)' },
              { num: 2, x: cx - 110, y: cy - 90, label: '2 (Curva izq)' },
              { num: 3, x: cx, y: cy + 145, label: '3 (Punta abajo)' },
              { num: 4, x: cx + 110, y: cy - 90, label: '4 (Curva der)' }
            ];
            var checkpoints = [];
            var numSegments = 4;
            var perQuarter = 9;
            var totalCps = numSegments * perQuarter;
            for (var i = 0; i < totalCps; i++) {
              var tVal = ((i + 0.5) / totalCps) * Math.PI * 2;
              var sIdx = Math.min(numSegments - 1, Math.floor(i / perQuarter));
              var sc = 8.5;
              var cpX = cx + sc * 16 * Math.pow(Math.sin(tVal), 3);
              var cpY = cy - sc * (13 * Math.cos(tVal) - 5 * Math.cos(2 * tVal) - 2 * Math.cos(3 * tVal) - Math.cos(4 * tVal));
              checkpoints.push({
                x: cpX,
                y: cpY,
                segmentIdx: sIdx,
                hit: false
              });
            }
            return {
              type: 'single',
              paths: [pts],
              checkpoints: checkpoints,
              numSegments: numSegments,
              fillColor: 'rgba(233, 30, 99, 0.1)',
              strokeColor: '#e91e63',
              markers: markers,
              centerText: '2 CURVAS Y 1 PUNTA'
            };
          },
          objects: [
            { id: 'galletas', name: 'Galletas de corazón', ico: '🍪', audioKey: 'fig_obj_galletas' },
            { id: 'globos', name: 'Globos de corazón', ico: '🎈', audioKey: 'fig_obj_globos' }
          ]
        }
      }
    }
  ];

  var figuraState = {
    currentIdx: 0,
    color: 'rainbow',
    hue: 0,
    isDrawing: false,
    inLane: false,
    lastPathIdx: -1,
    lastPt: null,
    userStrokes: [],
    waypoints: [],
    numSegments: 1,
    paths: [],
    perimeterData: null,
    completedCurrent: false,
    sparkles: []
  };

  function getActiveFigura() {
    var fig = FIGURAS_DATA[figuraState.currentIdx];
    if (!fig) return null;
    if (fig.hasSubfigures) {
      return fig.subfigures[fig.currentSub] || fig.subfigures['estrella'];
    }
    return fig;
  }

  function getActiveFiguraStorageKey() {
    var fig = FIGURAS_DATA[figuraState.currentIdx];
    if (!fig) return 'figura';
    if (fig.hasSubfigures) {
      return fig.id + '_' + fig.currentSub;
    }
    return fig.id;
  }

  function initFigurasTab() {
    renderFigurasSelector();
    selectFigura(0, false);

    var canvas = document.getElementById('figuraCanvas');
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
      // Si el reto ya llegó al 100%, desactivar dibujo para permitir scroll libre
      if (figuraState.completedCurrent) {
        figuraState.isDrawing = false;
        figuraState.inLane = false;
        return;
      }

      var pt = getCanvasPoint(e);
      var paths = figuraState.paths;
      if (!paths || paths.length === 0) {
        var active = getActiveFigura();
        if (active && active.buildPerimeter) {
          var per = active.buildPerimeter(canvas.width, canvas.height);
          if (per && per.paths) paths = per.paths;
        }
      }
      var snap = puntoMasCercanoEnCamino(pt, paths);

      // Si el toque inicia en zona blanca lejos del contorno (> 32px),
      // NO activar dibujo ni llamar preventDefault: permitir scroll vertical normal
      if (!snap || snap.dist > 32) {
        figuraState.isDrawing = false;
        figuraState.inLane = false;
        return;
      }

      // Toque directo sobre el contorno: capturar trazo
      if (e.cancelable) e.preventDefault();
      figuraState.isDrawing = true;
      figuraState.inLane = true;
      figuraState.lastPathIdx = snap.pathIdx;
      figuraState.lastPt = snap.point;
      figuraState.userStrokes.push({
        color: figuraState.color,
        points: [{ x: snap.point.x, y: snap.point.y, hue: figuraState.hue }]
      });
      addFiguraSparkle(snap.point.x, snap.point.y);
      checkFiguraWaypoints(snap.point);
      renderFiguraCanvas();
    }

    function moveDraw(e) {
      if (!figuraState.isDrawing) return;
      if (figuraState.completedCurrent) {
        figuraState.isDrawing = false;
        figuraState.inLane = false;
        return;
      }
      if (e.cancelable) e.preventDefault();

      var pt = getCanvasPoint(e);
      var paths = figuraState.paths;
      if (!paths || paths.length === 0) {
        var active = getActiveFigura();
        if (active && active.buildPerimeter) {
          var per = active.buildPerimeter(canvas.width, canvas.height);
          if (per && per.paths) paths = per.paths;
        }
      }
      var snap = puntoMasCercanoEnCamino(pt, paths);

      // Si el dedo está FUERA del radio del carril guía (> 28px):
      // NO dibujar absolutamente nada (ignorar trazo para que el fondo blanco no se manche)
      if (!snap || snap.dist > 28) {
        figuraState.inLane = false;
        return;
      }

      // DENTRO del carril guía (<= 28px): pintar únicamente sobre la coordenada exacta del contorno
      figuraState.hue = (figuraState.hue + 8) % 360;
      var snappedPt = snap.point;

      // Si reingresa al carril tras haber salido, iniciar un nuevo segmento continuo
      if (!figuraState.inLane || snap.pathIdx !== figuraState.lastPathIdx || figuraState.userStrokes.length === 0) {
        figuraState.userStrokes.push({
          color: figuraState.color,
          points: [{ x: snappedPt.x, y: snappedPt.y, hue: figuraState.hue }]
        });
        figuraState.inLane = true;
        figuraState.lastPathIdx = snap.pathIdx;
      } else {
        var currentStroke = figuraState.userStrokes[figuraState.userStrokes.length - 1];
        if (currentStroke && currentStroke.points && currentStroke.points.length > 0) {
          var lastP = currentStroke.points[currentStroke.points.length - 1];
          var dx = snappedPt.x - lastP.x;
          var dy = snappedPt.y - lastP.y;
          // Evitar saturar puntos idénticos seguidos
          if (dx * dx + dy * dy >= 4) {
            currentStroke.points.push({ x: snappedPt.x, y: snappedPt.y, hue: figuraState.hue });
          }
        } else {
          figuraState.userStrokes.push({
            color: figuraState.color,
            points: [{ x: snappedPt.x, y: snappedPt.y, hue: figuraState.hue }]
          });
        }
      }

      figuraState.lastPt = snappedPt;
      if (Math.random() < 0.65) {
        addFiguraSparkle(snappedPt.x, snappedPt.y);
      }
      checkFiguraWaypoints(snappedPt);
      renderFiguraCanvas();
    }

    function endDraw(e) {
      if (!figuraState.isDrawing) return;
      if (e && e.cancelable) e.preventDefault();
      figuraState.isDrawing = false;
      figuraState.inLane = false;
      figuraState.lastPt = null;
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);

    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    canvas.addEventListener('touchend', endDraw, { passive: false });
    canvas.addEventListener('touchcancel', endDraw, { passive: false });
    window.addEventListener('touchend', endDraw, { passive: false });
    window.addEventListener('touchcancel', endDraw, { passive: false });
  }

  function addFiguraSparkle(x, y) {
    if (figuraState.sparkles.length > 25) {
      figuraState.sparkles.shift();
    }
    figuraState.sparkles.push({
      x: x + (Math.random() * 24 - 12),
      y: y + (Math.random() * 24 - 12),
      char: Math.random() > 0.4 ? '✦' : '★',
      size: 14 + Math.random() * 8,
      alpha: 1.0,
      hue: figuraState.hue
    });
  }

  function renderFigurasSelector() {
    var grid = document.getElementById('figurasSelectorGrid');
    if (!grid) return;
    var panel = document.getElementById('figuraWorkspacePanel');
    if (panel && panel.parentNode && panel.parentNode !== grid.parentNode) {
      grid.parentNode.insertBefore(panel, grid.nextSibling);
    }
    grid.innerHTML = '';
    FIGURAS_DATA.forEach(function (fig, idx) {
      var isCompleted = false;
      if (fig.hasSubfigures) {
        isCompleted = !!(state.completedFiguras[fig.id + '_estrella'] || state.completedFiguras[fig.id + '_corazon']);
      } else {
        isCompleted = !!state.completedFiguras[fig.id];
      }

      var item = document.createElement('div');
      item.className = 'figura-acc-item' + (idx === figuraState.currentIdx ? ' active' : '');
      item.id = 'figuraAccItem-' + idx;

      var headerBtn = document.createElement('button');
      headerBtn.type = 'button';
      headerBtn.className = 'figura-acc-header' + (idx === figuraState.currentIdx ? ' active' : '');
      headerBtn.innerHTML =
        '<span class="figura-chip-ico" aria-hidden="true">' + fig.emoji + '</span>' +
        '<div class="figura-chip-info" style="flex:1;">' +
          '<strong>' + fig.selectorTitle + '</strong>' +
          '<span>' + fig.selectorSubtitle + '</span>' +
        '</div>' +
        '<div class="figura-acc-status">' +
          (isCompleted ? '<span class="acc-tag-done">✓ ¡Listo!</span>' : '<span class="acc-tag-pending">🎨 Trazar</span>') +
          '<span class="acc-chevron">' + (idx === figuraState.currentIdx ? '▲' : '▼') + '</span>' +
        '</div>';

      headerBtn.onclick = function () {
        selectFigura(idx, true);
      };

      var body = document.createElement('div');
      body.className = 'figura-acc-body';
      body.id = 'figuraAccBody-' + idx;

      item.appendChild(headerBtn);
      item.appendChild(body);
      grid.appendChild(item);

      if (idx === figuraState.currentIdx && panel) {
        body.appendChild(panel);
      }
    });
  }

  function selectFigura(idx, speak) {
    if (figuraAutoAdvanceTimer) {
      clearTimeout(figuraAutoAdvanceTimer);
      figuraAutoAdvanceTimer = null;
    }
    window.detenerVozPrebasica();
    figuraState.currentIdx = idx;
    figuraState.userStrokes = [];
    figuraState.sparkles = [];
    figuraState.completedCurrent = false;
    figuraState.isDrawing = false;
    figuraState.inLane = false;
    figuraState.lastPt = null;
    figuraState.lastPathIdx = -1;

    var fig = FIGURAS_DATA[idx];
    if (!fig) return;
    var active = getActiveFigura();
    if (!active) return;

    // Actualizar banner de presentación
    var pTag = document.getElementById('figuraPaginaTag');
    var cTag = document.getElementById('figuraColorTag');
    var nEs = document.getElementById('figuraNameEs');
    var nEn = document.getElementById('figuraNameEn');
    var gLabels = document.getElementById('figuraGeomLabels');
    var pGuide = document.getElementById('figParentGuideText');
    var pObjTag = document.getElementById('lblPaginaObjetos');

    if (pTag) pTag.textContent = '📖 Pág. ' + active.page;
    if (cTag) cTag.textContent = active.emoji + ' Color: ' + active.bookColorName;
    if (nEs) nEs.textContent = active.nameEs;
    if (nEn) nEn.textContent = '(' + active.nameEn + ')';
    if (pGuide) pGuide.textContent = active.guideText;
    if (pObjTag) pObjTag.textContent = active.page;

    if (gLabels && active.badges) {
      gLabels.innerHTML = '';
      active.badges.forEach(function (b) {
        var span = document.createElement('span');
        span.className = 'figura-geom-badge ' + b.cls;
        span.textContent = b.text;
        gLabels.appendChild(span);
      });
    }

    // Selector secundario de Estrella / Corazón
    var subBar = document.getElementById('figSubSelectorBar');
    if (subBar) {
      if (fig.hasSubfigures) {
        subBar.style.display = 'flex';
        var bEst = document.getElementById('btnSubFigEstrella');
        var bCor = document.getElementById('btnSubFigCorazon');
        if (bEst) bEst.className = 'btn-kid' + (fig.currentSub === 'estrella' ? ' active-chip' : '');
        if (bCor) bCor.className = 'btn-kid' + (fig.currentSub === 'corazon' ? ' active-chip' : '');
      } else {
        subBar.style.display = 'none';
      }
    }

    // Configurar caminos y puntos de control en el canvas
    var canvas = document.getElementById('figuraCanvas');
    if (canvas && active.buildPerimeter) {
      var perim = active.buildPerimeter(canvas.width, canvas.height);
      figuraState.perimeterData = perim;
      if (perim.checkpoints && perim.checkpoints.length > 0) {
        figuraState.waypoints = perim.checkpoints.map(function (cp) {
          return {
            x: cp.x,
            y: cp.y,
            segmentIdx: cp.segmentIdx !== undefined ? cp.segmentIdx : 0,
            hit: false
          };
        });
        figuraState.numSegments = perim.numSegments || 1;
      } else {
        var wps = [];
        perim.paths.forEach(function (path, pIdx) {
          path.forEach(function (pt) {
            wps.push({
              x: pt.x,
              y: pt.y,
              segmentIdx: pIdx,
              hit: false
            });
          });
        });
        figuraState.waypoints = wps;
        figuraState.numSegments = perim.paths.length || 1;
      }
      figuraState.paths = perim.paths;
    }

    updateFiguraProgressUI(0);
    var statusBanner = document.getElementById('figuraStatusBanner');
    var statusMsg = document.getElementById('figuraStatusMsg');
    if (statusBanner) statusBanner.classList.remove('celebrate');
    if (statusMsg) {
      statusMsg.innerHTML = '☝️ Pasa tu dedito por los puntos numerados del contorno para descubrir sus lados y forma.';
    }

    renderFigurasSelector();
    renderFiguraObjetos();
    renderFiguraCanvas();

    var btnSigFig = document.getElementById('btnSiguienteFigura');
    if (btnSigFig) {
      if (idx === FIGURAS_DATA.length - 1 && (!fig.hasSubfigures || fig.currentSub === 'corazon')) {
        btnSigFig.innerHTML = '➡ Pasar a 3. Rodea y Descubre';
      } else {
        btnSigFig.innerHTML = '➡ Siguiente figura';
      }
    }

    var activeAccItem = document.getElementById('figuraAccItem-' + idx);
    if (activeAccItem) {
      try {
        activeAccItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (e) {}
    }

    if (speak) {
      window.hablarTexto(active.audioInst, 'es-ES');
    }
  }

  window.seleccionarSubFigura = function (subId) {
    var fig = FIGURAS_DATA[figuraState.currentIdx];
    if (fig && fig.hasSubfigures) {
      fig.currentSub = subId;
      selectFigura(figuraState.currentIdx, true);
    }
  };

  function checkFiguraWaypoints(pt) {
    var hitRadius = 25;
    var newlyHit = false;
    figuraState.waypoints.forEach(function (wp) {
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
      var total = figuraState.waypoints.length || 1;
      var hits = figuraState.waypoints.filter(function (w) { return w.hit; }).length;
      var rawPct = Math.floor((hits / total) * 100);

      var numSegments = figuraState.numSegments || 1;
      var allSegmentsDone = true;
      for (var s = 0; s < numSegments; s++) {
        var segTotal = 0;
        var segHits = 0;
        figuraState.waypoints.forEach(function (w) {
          if (w.segmentIdx === s) {
            segTotal++;
            if (w.hit) segHits++;
          }
        });
        if (segTotal > 0 && (segHits / segTotal) < 0.88) {
          allSegmentsDone = false;
          break;
        }
      }

      // Exigir que los últimos checkpoints del tramo final que regresa al vértice 1 estén visitados
      var lastCps = figuraState.waypoints.slice(-2);
      var finalClosed = lastCps.length > 0 && lastCps.every(function (w) { return w.hit; });

      var isFullyClosed = allSegmentsDone && finalClosed && rawPct >= 96;
      // Mientras falte cerrar ese último tramo hacia el punto 1, la barra debe mostrar máximo 95% o 96%
      var displayPct = isFullyClosed ? 100 : Math.min(95, rawPct);
      updateFiguraProgressUI(displayPct);

      if (isFullyClosed && !figuraState.completedCurrent) {
        figuraState.completedCurrent = true;
        figuraState.isDrawing = false;
        figuraState.inLane = false;
        // Marcar todos los waypoints como iluminados
        figuraState.waypoints.forEach(function (w) { w.hit = true; });
        updateFiguraProgressUI(100);

        // Forzar renderizado completo del contorno cerrado al 100% sobre el canvas sin huecos
        renderFiguraCanvas();

        var active = getActiveFigura();
        var key = getActiveFiguraStorageKey();
        if (active && !state.completedFiguras[key]) {
          state.completedFiguras[key] = true;
          addXP(10, 's-figuras');
        } else {
          sonarCelebracion();
        }
        sonarCelebracion();
        window.lanzarConfetiPrebasica();
        var statusBanner = document.getElementById('figuraStatusBanner');
        var statusMsg = document.getElementById('figuraStatusMsg');
        if (statusBanner) statusBanner.classList.add('celebrate');
        if (statusMsg && active) {
          statusMsg.innerHTML = '🎉 <strong>¡Fantástico! ⭐</strong> ¡Descubriste el contorno del ' + active.nameEs + '! Toca <strong>🔄 Repasar de nuevo</strong> si deseas volver a trazarlo.';
        }
        if (active) {
          window.hablarTexto(active.audioFelicita, 'es-ES');
        }
        renderFigurasSelector();

        if (figuraAutoAdvanceTimer) clearTimeout(figuraAutoAdvanceTimer);
        figuraAutoAdvanceTimer = setTimeout(function () {
          window.siguienteFigura();
        }, 1800);
      }
    }
  }

  function updateFiguraProgressUI(pct) {
    var fill = document.getElementById('figuraProgressFill');
    var lbl = document.getElementById('figuraProgressPct');
    if (fill) fill.style.width = pct + '%';
    if (lbl) lbl.textContent = pct + '%';
  }

  function renderFiguraCanvas() {
    var canvas = document.getElementById('figuraCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w = canvas.width;
    var h = canvas.height;
    var active = getActiveFigura();
    var pData = figuraState.perimeterData;
    if (!active || !pData) return;

    ctx.clearRect(0, 0, w, h);

    // 1. Cuadrícula suave de cuaderno de preescolar
    ctx.save();
    ctx.strokeStyle = 'rgba(150, 165, 185, 0.16)';
    ctx.lineWidth = 1;
    for (var y = 35; y < h; y += 35) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (var x = 35; x < w; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    ctx.restore();

    // 2. Relleno traslúcido de la figura en su color oficial
    if (pData.paths && pData.paths.length > 0) {
      ctx.save();
      ctx.fillStyle = pData.fillColor || 'rgba(0,0,0,0.05)';
      pData.paths.forEach(function (path) {
        if (!path || path.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();

      // Carril guía magnético sombreado detrás del contorno punteado
      pData.paths.forEach(function (path) {
        if (!path || path.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.07)';
        ctx.lineWidth = 32;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
      });
    }

    // 3. Diferenciación geométrica visual especial
    if (pData.type === 'rectangle_distinct') {
      // En el Rectángulo: distinguir claramente 2 lados LARGOS ↔ y 2 lados CORTOS ↕
      ctx.save();
      ctx.lineWidth = 14;
      ctx.setLineDash([12, 10]);

      // Lados largos horizontales (Anaranjado vivo)
      ctx.strokeStyle = '#fb8c00';
      ctx.beginPath();
      ctx.moveTo(pData.x0, pData.y0);
      ctx.lineTo(pData.x1, pData.y0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pData.x0, pData.y1);
      ctx.lineTo(pData.x1, pData.y1);
      ctx.stroke();

      // Lados cortos verticales (Teal / Cian)
      ctx.strokeStyle = '#00acc1';
      ctx.beginPath();
      ctx.moveTo(pData.x1, pData.y0);
      ctx.lineTo(pData.x1, pData.y1);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pData.x0, pData.y0);
      ctx.lineTo(pData.x0, pData.y1);
      ctx.stroke();
      ctx.restore();
    } else {
      // Línea punteada guía de contorno en el color del libro
      pData.paths.forEach(function (path) {
        if (!path || path.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.strokeStyle = pData.strokeColor || active.colorHex;
        ctx.lineWidth = 14;
        ctx.setLineDash([12, 10]);
        ctx.stroke();
        ctx.restore();
      });
    }

    // 4. Texto geométrico explicativo en el centro
    if (pData.centerText) {
      ctx.save();
      ctx.font = 'bold 22px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = active.colorHex;
      ctx.globalAlpha = 0.35;
      ctx.fillText(pData.centerText, w * 0.5, h * 0.5);
      ctx.restore();
    }

    // 5. Etiquetas de lados o puntas
    if (pData.sideLabels) {
      pData.sideLabels.forEach(function (lbl) {
        ctx.save();
        ctx.font = 'bold 15px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = lbl.color || active.colorHex;
        ctx.fillText(lbl.text, lbl.x, lbl.y);
        ctx.restore();
      });
    }

    // 6. Puntos de control / waypoints iluminados al pasar el dedo
    figuraState.waypoints.forEach(function (wp) {
      if (wp.hit) {
        ctx.save();
        ctx.fillStyle = 'rgba(255, 215, 0, 0.45)';
        ctx.beginPath();
        ctx.arc(wp.x, wp.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    // 7. Trazos pintados por el niño (dedito táctil)
    figuraState.userStrokes.forEach(function (stroke) {
      var pts = stroke.points;
      if (!pts || pts.length === 0) return;
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 22;

      if (pts.length === 1) {
        ctx.fillStyle = stroke.color === 'rainbow' ? 'hsl(' + pts[0].hue + ', 95%, 52%)' : stroke.color;
        ctx.beginPath();
        ctx.arc(pts[0].x, pts[0].y, 11, 0, Math.PI * 2);
        ctx.fill();
      } else {
        for (var i = 1; i < pts.length; i++) {
          ctx.beginPath();
          ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
          ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = stroke.color === 'rainbow'
            ? 'hsl(' + pts[i].hue + ', 95%, 50%)'
            : stroke.color;
          ctx.stroke();
        }
      }
      ctx.restore();
    });

    // Si la figura está 100% completada, forzar el renderizado completo y cerrado del contorno sin huecos
    if (figuraState.completedCurrent && pData.paths) {
      pData.paths.forEach(function (path) {
        if (!path || path.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (var i = 1; i < path.length; i++) {
          ctx.lineTo(path[i].x, path[i].y);
        }
        ctx.closePath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        if (figuraState.color === 'rainbow') {
          var grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, '#e53935');
          grad.addColorStop(0.2, '#fb8c00');
          grad.addColorStop(0.4, '#fbc02d');
          grad.addColorStop(0.6, '#43a047');
          grad.addColorStop(0.8, '#1e88e5');
          grad.addColorStop(1, '#8e24aa');
          ctx.strokeStyle = grad;
        } else {
          ctx.strokeStyle = figuraState.color || active.colorHex;
        }
        ctx.lineWidth = 24;
        ctx.stroke();

        // Brillo interior blanco de celebración
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        for (var j = 1; j < path.length; j++) {
          ctx.lineTo(path[j].x, path[j].y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 8;
        ctx.stroke();
        ctx.restore();
      });
    }

    // 8. Chispas mágicas doradas en el recorrido del dedo
    figuraState.sparkles.forEach(function (sp) {
      ctx.save();
      ctx.font = sp.size + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'hsl(' + sp.hue + ', 100%, 60%)';
      ctx.globalAlpha = sp.alpha;
      ctx.fillText(sp.char, sp.x, sp.y);
      ctx.restore();
    });

    // 9. Círculos numerados en los vértices / esquinas / tramos (1, 2, 3, 4...)
    if (pData.markers) {
      pData.markers.forEach(function (m) {
        ctx.save();
        // Círculo base blanco con borde grueso
        ctx.beginPath();
        ctx.arc(m.x, m.y, 19, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = active.colorHex;
        ctx.stroke();

        // Número en el centro
        ctx.font = 'bold 16px Fredoka, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = active.colorHex;
        ctx.fillText(m.label, m.x, m.y);
        ctx.restore();
      });
    }
  }

  window.seleccionarColorFigura = function (color, btn) {
    figuraState.color = color;
    var swatches = document.querySelectorAll('.figura-stage-wrap .color-swatch, #s-figuras .color-swatch');
    swatches.forEach(function (s) { s.classList.remove('active'); });
    if (btn) btn.classList.add('active');
  };

  window.borrarTrazoFiguraActual = function () {
    if (figuraAutoAdvanceTimer) {
      clearTimeout(figuraAutoAdvanceTimer);
      figuraAutoAdvanceTimer = null;
    }
    selectFigura(figuraState.currentIdx, false);
  };

  window.siguienteFigura = function () {
    if (figuraAutoAdvanceTimer) {
      clearTimeout(figuraAutoAdvanceTimer);
      figuraAutoAdvanceTimer = null;
    }
    var currentFig = FIGURAS_DATA[figuraState.currentIdx];
    if (currentFig && currentFig.hasSubfigures && currentFig.currentSub === 'estrella') {
      window.seleccionarSubFigura('corazon');
      return;
    }

    if (figuraState.currentIdx < FIGURAS_DATA.length - 1) {
      var nextIdx = figuraState.currentIdx + 1;
      var nextFig = FIGURAS_DATA[nextIdx];
      if (nextFig && nextFig.hasSubfigures) {
        nextFig.currentSub = 'estrella';
      }
      selectFigura(nextIdx, true);
    } else {
      window.detenerVozPrebasica();
      window.go('s-rodea');
      if (typeof window.seleccionarCategoriaRodea === 'function') {
        window.seleccionarCategoriaRodea('letras');
      }
      var sec = document.getElementById('s-rodea');
      if (sec) {
        try {
          sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (e) {}
      }
    }
  };

  window.leerInstruccionFiguraActual = function (btn) {
    var active = getActiveFigura();
    if (active && active.audioInst) {
      window.hablarTexto(active.audioInst, 'es-ES', btn);
    }
  };

  window.escucharInglesFiguraActual = function (btn) {
    var active = getActiveFigura();
    if (active && active.audioEnKey) {
      window.hablarTexto(active.audioEnKey, 'en-US', btn);
    }
  };

  function renderFiguraObjetos() {
    var grid = document.getElementById('figuraObjetosGrid');
    if (!grid) return;
    grid.innerHTML = '';
    var active = getActiveFigura();
    if (!active || !active.objects) return;

    active.objects.forEach(function (obj) {
      var card = document.createElement('div');
      var isTouched = !!state.completedFiguraObjects[obj.id];
      card.className = 'figura-objeto-card' + (isTouched ? ' tocado' : '');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', obj.name + '. Toca para escuchar su nombre');
      card.innerHTML =
        '<span class="obj-ico" aria-hidden="true">' + obj.ico + '</span>' +
        '<span class="obj-name">' + obj.name + '</span>' +
        '<span class="obj-status' + (isTouched ? ' badge-descubierto' : '') + '">' +
          (isTouched ? '✓ ¡Descubierto!' : 'Toca para descubrir') +
        '</span>';

      card.onclick = function () {
        tocarObjetoFigura(obj, card);
      };
      card.onkeydown = function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          tocarObjetoFigura(obj, card);
        }
      };
      grid.appendChild(card);
    });
  }

  function tocarObjetoFigura(obj, cardEl) {
    if (cardEl) {
      cardEl.classList.add('tocado');
      var statusEl = cardEl.querySelector('.obj-status');
      if (statusEl) {
        statusEl.className = 'obj-status badge-descubierto';
        statusEl.textContent = '✓ ¡Descubierto!';
      }
    }
    state.completedFiguraObjects[obj.id] = true;
    saveState();
    sonarAcierto();
    window.hablarTexto(obj.audioKey, 'es-ES', cardEl);
  }

  /* ==========================================================================
     PESTAÑA 3: RODEA Y DESCUBRE (LETRAS, NÚMEROS Y NOCIONES ESPACIALES)
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
      actualizarBotonSiguienteRodea();
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
    actualizarBotonSiguienteRodea();
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
        window.hablarTexto('¡Muy bien hecho! Completaste todo el tablero.', 'es-ES');

        if (rodeaAutoAdvanceTimer) clearTimeout(rodeaAutoAdvanceTimer);
        rodeaAutoAdvanceTimer = setTimeout(function () {
          window.siguienteRodea();
        }, 1800);
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

  function actualizarBotonSiguienteRodea() {
    var btn = document.getElementById('btnSiguienteRodea');
    if (!btn) return;
    if (rodeaState.category === 'espacial' && rodeaState.targetId === 'dactilo') {
      btn.innerHTML = '➡ Pasar a 4. Rompecabezas';
    } else {
      btn.innerHTML = '➡ Siguiente reto';
    }
  }

  window.siguienteRodea = function () {
    if (rodeaAutoAdvanceTimer) {
      clearTimeout(rodeaAutoAdvanceTimer);
      rodeaAutoAdvanceTimer = null;
    }
    window.detenerVozPrebasica();

    if (rodeaState.category === 'letras') {
      var idxL = LETRAS_DATA.findIndex(function (x) { return x.id === rodeaState.targetId; });
      if (idxL >= 0 && idxL < LETRAS_DATA.length - 1) {
        rodeaState.targetId = LETRAS_DATA[idxL + 1].id;
        renderRodeaPills();
        buildRodeaExercise();
      } else {
        window.seleccionarCategoriaRodea('numeros');
      }
    } else if (rodeaState.category === 'numeros') {
      var idxN = NUMEROS_DATA.findIndex(function (x) { return x.id === rodeaState.targetId; });
      if (idxN >= 0 && idxN < NUMEROS_DATA.length - 1) {
        rodeaState.targetId = NUMEROS_DATA[idxN + 1].id;
        renderRodeaPills();
        buildRodeaExercise();
      } else {
        window.seleccionarCategoriaRodea('espacial');
      }
    } else {
      var idxE = ESPACIAL_DATA.findIndex(function (x) { return x.id === rodeaState.targetId; });
      if (idxE >= 0 && idxE < ESPACIAL_DATA.length - 1) {
        rodeaState.targetId = ESPACIAL_DATA[idxE + 1].id;
        renderRodeaPills();
        buildRodeaExercise();
      } else {
        window.go('s-rompecabezas');
        if (typeof window.mostrarRompecabezas === 'function') {
          window.mostrarRompecabezas('numeros');
        }
        var sec = document.getElementById('s-rompecabezas');
        if (sec) {
          try {
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } catch (e) {}
        }
      }
    }
    actualizarBotonSiguienteRodea();
  };

  window.reiniciarEjercicioRodea = function () {
    if (rodeaAutoAdvanceTimer) {
      clearTimeout(rodeaAutoAdvanceTimer);
      rodeaAutoAdvanceTimer = null;
    }
    window.detenerVozPrebasica();
    buildRodeaExercise();
  };

  window.hablarConsignaRodea = function (lang, btn) {
    if (rodeaState.category === 'espacial' && rodeaState.targetId === 'dactilo') {
      var dactiloTxt = 'Pon huellitas de pintura ' + dactiloState.zone.toUpperCase() + ' de la figura: ' + dactiloState.figureEs;
      window.hablarConSaludoEscuela(dactiloTxt, 'es-ES', btn);
      return;
    }

    if (rodeaState.category === 'letras') {
      var l = LETRAS_DATA.find(function (x) { return x.id === rodeaState.targetId; }) || LETRAS_DATA[0];
      window.hablarConSaludoEscuela(l.esTTS, 'es-ES', btn);
    } else if (rodeaState.category === 'numeros') {
      var n = NUMEROS_DATA.find(function (x) { return x.id === rodeaState.targetId; }) || NUMEROS_DATA[0];
      window.hablarConSaludoEscuela('Rodea todos los números ' + n.id + ', ' + n.es + '.', 'es-ES', btn);
    } else {
      var esp = ESPACIAL_DATA.find(function (x) { return x.id === rodeaState.targetId; }) || ESPACIAL_DATA[0];
      window.hablarConSaludoEscuela(esp.promptEs, 'es-ES', btn);
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
        window.hablarTexto('¡Qué linda pintura con tus deditos! Lo hiciste excelente.', 'es-ES');
      } else {
        sonarCelebracion();
      }

      if (rodeaAutoAdvanceTimer) clearTimeout(rodeaAutoAdvanceTimer);
      rodeaAutoAdvanceTimer = setTimeout(function () {
        window.siguienteRodea();
      }, 1800);
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
    if (rodeaAutoAdvanceTimer) {
      clearTimeout(rodeaAutoAdvanceTimer);
      rodeaAutoAdvanceTimer = null;
    }
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
    if (rodeaAutoAdvanceTimer) {
      clearTimeout(rodeaAutoAdvanceTimer);
      rodeaAutoAdvanceTimer = null;
    }
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
    if (rodeaAutoAdvanceTimer) {
      clearTimeout(rodeaAutoAdvanceTimer);
      rodeaAutoAdvanceTimer = null;
    }
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

  function actualizarBotonSiguienteRompecabezas() {
    var btn = document.getElementById('btnSiguienteRompecabezas');
    if (!btn) return;
    if (puzzleState.currentGame === 'carros' && puzzleState.carSubMode === 'figuras') {
      btn.innerHTML = '➡ Pasar a 5. Manos a la Obra en Casa';
    } else {
      btn.innerHTML = '➡ Siguiente juego';
    }
  }

  window.siguienteRompecabezas = function () {
    if (puzzleAutoAdvanceTimer) {
      clearTimeout(puzzleAutoAdvanceTimer);
      puzzleAutoAdvanceTimer = null;
    }
    window.detenerVozPrebasica();

    if (puzzleState.currentGame === 'numeros') {
      if (puzzleState.numBlock === '1_5') {
        window.cambiarBloqueNumeros('6_10');
      } else {
        window.mostrarRompecabezas('cuerpo');
      }
    } else if (puzzleState.currentGame === 'cuerpo') {
      window.mostrarRompecabezas('carros');
      window.cambiarSubmodoCarros('colores');
    } else {
      if (puzzleState.carSubMode === 'colores') {
        window.cambiarSubmodoCarros('figuras');
      } else {
        window.go('s-casa');
        var sec = document.getElementById('s-casa');
        if (sec) {
          try {
            sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } catch (e) {}
        }
      }
    }
    actualizarBotonSiguienteRompecabezas();
  };

  window.mostrarRompecabezas = function (tipo) {
    if (puzzleAutoAdvanceTimer) {
      clearTimeout(puzzleAutoAdvanceTimer);
      puzzleAutoAdvanceTimer = null;
    }
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
    if (puzzleAutoAdvanceTimer) {
      clearTimeout(puzzleAutoAdvanceTimer);
      puzzleAutoAdvanceTimer = null;
    }
    if (window.detenerVozPrebasica) window.detenerVozPrebasica();
    puzzleState.selectedPieceId = null;
    puzzleState.placedMap = {};
    renderCurrentPuzzle();
  };

  window.leerInstruccionRompecabezas = function (btn) {
    var textoFijo = '';
    if (puzzleState.currentGame === 'numeros') {
      textoFijo = 'Rompecabezas de los números: toca cada ficha numérica y colócala en su silueta contando los dibujos en orden.';
    } else if (puzzleState.currentGame === 'cuerpo') {
      textoFijo = 'Rompecabezas del cuerpo humano, página cincuenta y nueve: coloca en orden vertical la Cabeza, el Tronco, los Brazos y las Piernas.';
    } else if (puzzleState.carSubMode === 'colores') {
      textoFijo = 'Estacionamiento de carritos de colores: estaciona cada carrito en su lugar del mismo color. Rojo, Azul, Amarillo, Verde, Naranja y Morado.';
    } else {
      textoFijo = 'Rompecabezas de figuras geométricas: coloca el círculo, cuadrado, triángulo, rectángulo, óvalo, rombo, estrella y corazón en su silueta.';
    }
    window.hablarConSaludoEscuela(textoFijo, 'es-ES', btn);
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
    actualizarBotonSiguienteRompecabezas();
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
    if (puzzleAutoAdvanceTimer) {
      clearTimeout(puzzleAutoAdvanceTimer);
      puzzleAutoAdvanceTimer = null;
    }
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
    if (puzzleAutoAdvanceTimer) {
      clearTimeout(puzzleAutoAdvanceTimer);
      puzzleAutoAdvanceTimer = null;
    }
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
      window.hablarTexto('¡Bravo! Completaste todo el rompecabezas sin ningún error.', 'es-ES');

      if (puzzleAutoAdvanceTimer) clearTimeout(puzzleAutoAdvanceTimer);
      puzzleAutoAdvanceTimer = setTimeout(function () {
        window.siguienteRompecabezas();
      }, 1800);
    }
  }

  /* ==========================================================================
     PESTAÑA 5: MANOS A LA OBRA (EN EL AULA Y EN CASA)
     ========================================================================== */
  var HOME_TECHNIQUES = [
    {
      id: 'boleado',
      title: '1. Boleado de Papel Crepé y Juego de Encestar',
      benefit: '🤏 Motricidad fina (pinza trípode) y coordinación visomotriz',
      materials: 'Papel crepé de colores, pegamento escolar y un vasito o recipiente plástico.',
      aula: {
        title: '🏫 En el Libro (Aula o Tarea asignada)',
        hint: '📌 Según indique tu maestro(a) · Págs. de Boleado y Contornos',
        desc: 'Rasgar tiritas de papel crepé y formar bolitas usando exclusivamente la pinza trípode (dedos pulgar, índice y medio) para pegarlas sobre los contornos indicados del libro.'
      },
      casa: {
        title: '🏠 Juego Complementario en Familia: ¡A encestar bolitas!',
        desc: '¡Conserven o hagan más bolitas de papel de colores y jueguen en familia a lanzarlas para encestarlas dentro de un vasito o recipiente a corta distancia! Cuenten en español e inglés cuántas bolitas encestan (One, Two, Three...) y clasifíquenlas por color.',
        vocab: [
          { label: '🔴 Red', file: 'pz_color_red_en.mp3' },
          { label: '🔵 Blue', file: 'pz_color_blue_en.mp3' },
          { label: '🟡 Yellow', file: 'pz_color_yellow_en.mp3' }
        ]
      },
      safety: 'Supervise que el niño no se lleve bolitas de papel a la boca. Usar pegamento no tóxico.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><circle cx="22" cy="24" r="8" fill="#ff7675"/><circle cx="42" cy="22" r="7" fill="#55efc4"/><circle cx="32" cy="40" r="9" fill="#ffeaa7"/><circle cx="46" cy="44" r="6" fill="#a29bfe"/></svg>'
    },
    {
      id: 'rasgado',
      title: '2. Rasgado, Trozado y Collage Texturizado',
      benefit: '🤲 Coordinación bilateral, fuerza bimanual y discriminación táctil',
      materials: 'Papel lustre, periódico, hojas secas de plantas, cáscaras de huevo limpias o cartón reciclado y pegamento en barra.',
      aula: {
        title: '🏫 En el Libro (Aula o Tarea asignada)',
        hint: '📌 Según indique tu maestro(a) · Págs. de Rasgado y Óvalo/Huevo Pág. 29',
        desc: 'Rasgar papel con ambas manos coordinadas (una tira hacia adelante y otra hacia atrás) para rellenar figuras del libro (por ejemplo, el óvalo/huevo de la pág. 29 con cascarones o papel trozado).'
      },
      casa: {
        title: '🏠 Juego Complementario en Familia: Caminitos y Texturas de la Naturaleza',
        desc: 'En una hoja suelta o cartón reciclado, dibujen un caminito o figura y péguenle hojas secas caídas, ramitas, cáscaras de huevo limpias o papel de periódico rasgado. ¡Estimula el sentido táctil y el cuidado del medio ambiente!'
      },
      safety: 'Lávense las manos con agua y jabón al terminar la actividad con pegamento.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><path d="M12 12 H30 L26 24 L32 36 L25 52 H12 Z" fill="#74b9ff" stroke="#0984e3" stroke-width="2.5"/><path d="M36 12 H52 V52 H34 L40 36 L34 24 Z" fill="#a29bfe" stroke="#6c5ce7" stroke-width="2.5"/></svg>'
    },
    {
      id: 'figuras',
      title: '3. Exploradores de Figuras Geométricas y Constructores',
      benefit: '📐 Percepción espacial, geometría básica y razonamiento abstracto',
      materials: 'Objetos de casa (tapas, cajas, libros), palillos de dientes o hisopos, plastilina o masa de harina.',
      aula: {
        title: '🏫 En el Libro (Aula o Tarea asignada)',
        hint: '📌 Según indique tu maestro(a) · Págs. 25 a 32 (Figuras Geométricas)',
        desc: 'Identificar, colorear y trazar las figuras planas en las páginas 25 a 32 del libro: Círculo, Cuadrado, Triángulo, Rectángulo, Óvalo, Diamante/Rombo, Estrella y Corazón.'
      },
      casa: {
        title: '🏠 Juego Complementario en Familia: Detective de Formas y Constructores',
        desc: '• Detective: Busquen en casa objetos cotidianos: una tapa (círculo), un cojín (cuadrado), una rebanada o gancho (triángulo), una puerta (rectángulo).\n• Constructores: Con palillos de dientes (o hisopos) y bolitas de plastilina (o masa), construyan cuadrados, triángulos y rectángulos uniendo vértices y lados.',
        vocab: [
          { label: '🔴 Circle', file: 'pz_fig_circle_en.mp3' },
          { label: '🟦 Square', file: 'pz_fig_square_en.mp3' },
          { label: '🔺 Triangle', file: 'pz_fig_triangle_en.mp3' },
          { label: '🟧 Rectangle', file: 'pz_fig_rectangle_en.mp3' },
          { label: '🥚 Oval', file: 'pz_fig_oval_en.mp3' },
          { label: '💎 Diamond', file: 'pz_fig_diamond_en.mp3' },
          { label: '⭐ Star', file: 'pz_fig_star_en.mp3' },
          { label: '💖 Heart', file: 'pz_fig_heart_en.mp3' }
        ]
      },
      safety: 'Supervise el uso de palillos para que las puntas queden protegidas dentro de las bolitas de plastilina.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><circle cx="20" cy="20" r="12" fill="#ff7675"/><rect x="36" y="8" width="20" height="20" rx="3" fill="#74b9ff"/><polygon points="20,38 32,58 8,58" fill="#55efc4"/><polygon points="46,38 58,48 53,62 39,62 34,48" fill="#ffeaa7"/></svg>'
    },
    {
      id: 'dactilopintura',
      title: '4. Dactilopintura y Trazos Sensoriales en Bandeja',
      benefit: '🎨 Sensopercepción táctil, grafomotricidad sin lápiz y control del espacio',
      materials: 'Témpera lavable escolar, plato plano, y para casa: una bandeja o plato con harina, maicena, avena o sal fina.',
      aula: {
        title: '🏫 En el Libro (Aula o Tarea asignada)',
        hint: '📌 Según indique tu maestro(a) · Págs. 31 y 32',
        desc: 'Pintura dactilar estampando huellitas con témpera escolar no tóxica sobre las áreas indicadas del libro (frutas, animales o figuras).'
      },
      casa: {
        title: '🏠 Juego Complementario en Familia: Pizarra Mágica de Harina o Avena',
        desc: 'Viertan una capa fina de harina, maicena, avena o sal fina sobre una bandeja o plato extendido. El niño dibuja con su dedito índice líneas rectas, olas, espirales, círculos y números. Luego sacuden suavemente la bandeja ¡y la pizarra se borra mágicamente para volver a trazar! Cero manchas y máxima estimulación sensorial.'
      },
      safety: 'En el aula usar témperas no tóxicas lavables. En casa, si se derrama harina, limpiar juntos en familia.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><ellipse cx="32" cy="34" rx="14" ry="19" fill="#e84393"/><circle cx="18" cy="16" r="5" fill="#0984e3"/><circle cx="32" cy="11" r="5" fill="#00b894"/><circle cx="46" cy="16" r="5" fill="#fdcb6e"/></svg>'
    },
    {
      id: 'recorte',
      title: '5. Recorte Seguro con Tijera y Rompecabezas',
      benefit: '✂️ Freno inhibitorio, disociación de dedos y coordinación óculo-manual',
      materials: 'Tijera escolar de punta roma, papel reciclado, tubos de cartón y revistas o fotos para recortar.',
      aula: {
        title: '🏫 En el Libro (Aula o Tarea asignada)',
        hint: '📌 Según indique tu maestro(a) · Páginas de Recorte del Libro 1',
        desc: 'Uso de tijera punta roma con agarre ergonómico («pulgar siempre hacia arriba mirando al cielo») cortando con cuidado sobre las líneas punteadas asignadas por el docente.'
      },
      casa: {
        title: '🏠 Juego Complementario en Familia: Peluquería de Papel y Rompecabezas de Tiras',
        desc: '• Peluquería: Dibujen caritas en tiras de papel o tubos de papel higiénico y dejen que el niño le corte el «cabello» haciendo flequillos rectos o en picos.\n• Rompecabezas: Peguen una foto o dibujo infantil en un cartón, corten 3 o 4 tiras rectas y jueguen a armar el rompecabezas en familia.'
      },
      safety: '⚠️ Uso exclusivo de tijeras escolares de punta redonda con el adulto sentado al lado supervisando.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><circle cx="20" cy="44" r="8" fill="none" stroke="#d63031" stroke-width="4"/><circle cx="44" cy="44" r="8" fill="none" stroke="#d63031" stroke-width="4"/><line x1="25" y1="38" x2="46" y2="12" stroke="#636e72" stroke-width="4" stroke-linecap="round"/><line x1="39" y1="38" x2="18" y2="12" stroke="#636e72" stroke-width="4" stroke-linecap="round"/></svg>'
    },
    {
      id: 'germinacion',
      title: '6. Laboratorio Vivo: Germinación y Secuencia de las Plantas',
      benefit: '🌱 Observación científica, paciencia, respeto a la naturaleza y secuenciación temporal',
      materials: 'Un vaso plástico transparente, algodón o tierra, semillas de frijol o maíz y agua.',
      aula: {
        title: '🏫 En el Libro (Aula o Tarea asignada)',
        hint: '📌 Según indique tu maestro(a) · Página 111 (Ciclo de Vida de las Plantas)',
        desc: 'Observar, colorear y numerar la secuencia del ciclo de vida de la planta en la página 111 del libro, reconociendo la semilla, el brote, la planta y sus frutos.'
      },
      casa: {
        title: '🏠 Juego Complementario en Familia: El Vaso Mágico de Frijolito',
        desc: 'Coloquen un frijol o maíz entre algodón húmedo dentro de un vasito transparente. Pónganlo cerca de la ventana y riéguenlo con gotitas de agua. El niño registrará cada 2 días con dibujos cómo nace la raíz, el tallo y las hojas.',
        vocab: [
          { label: '💧 Water', file: 'plant_water_en.mp3' },
          { label: '🌱 Seed', file: 'plant_seed_en.mp3' },
          { label: '🌿 Plant', file: 'plant_plant_en.mp3' },
          { label: '🍎 Fruit', file: 'plant_fruit_en.mp3' }
        ]
      },
      safety: 'Supervise que el niño se lave las manos después de regar y no ingiera las semillas crudas.',
      svg: '<svg width="46" height="46" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="48" r="12" fill="#8d6e63"/><path d="M32 40 Q32 20 22 14 Q28 26 32 28 Q36 26 42 14 Q32 20 32 40 Z" fill="#4caf50"/><circle cx="32" cy="12" r="3" fill="#81c784"/></svg>'
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

      var vocabHtml = '';
      if (t.casa && t.casa.vocab && t.casa.vocab.length) {
        vocabHtml =
          '<div class="tech-vocab-chips">' +
            '<span class="tech-vocab-label">🗣️ Vocabulario en inglés:</span>' +
            t.casa.vocab.map(function (v) {
              return '<button type="button" class="btn-chip-audio" onclick="hablarVocabularioChip(\'' + v.file + '\', this)" title="Escuchar pronunciación en inglés">' +
                v.label + ' 🔊' +
              '</button>';
            }).join('') +
          '</div>';
      }

      var dualHtml =
        '<div class="tech-dual-container">' +
          '<div class="tech-block-aula">' +
            '<div class="tech-block-title-aula">' + t.aula.title + '</div>' +
            '<div class="tech-sub-hint">' + t.aula.hint + '</div>' +
            '<p class="tech-block-desc">' + t.aula.desc + '</p>' +
          '</div>' +
          '<div class="tech-block-casa">' +
            '<div class="tech-block-title-casa">' + t.casa.title + '</div>' +
            '<p class="tech-block-desc" style="white-space: pre-line;">' + t.casa.desc + '</p>' +
            vocabHtml +
          '</div>' +
        '</div>';

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
            '<strong>🧺 Materiales sugeridos:</strong> ' + t.materials +
          '</div>' +
          dualHtml +
        '</div>' +
        '<div>' +
          '<div class="tech-safety" style="margin-top:0.75rem; margin-bottom:0.75rem;">' +
            '<strong>🛡️ Cuidado del adulto:</strong> ' + t.safety +
          '</div>' +
          '<div class="tech-card-footer">' +
            '<button type="button" class="btn-kid" onclick="hablarTecnicaCasa(\'' + t.id + '\', this)">' +
              '🔊 Escuchar explicación' +
            '</button>' +
            '<button type="button" class="btn-kid ' + (done ? 'secondary' : 'primary') + '" onclick="marcarTecnicaCasa(\'' + t.id + '\')">' +
              (done ? '✓ ¡Hecha en familia! ⭐' : '✅ Marcar como hecha') +
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
      badge.textContent = '🏅 ' + count + ' / ' + HOME_TECHNIQUES.length + ' técnicas completadas';
    }
    var diplomaBox = document.getElementById('diplomaPrebasicaBox');
    if (diplomaBox) {
      diplomaBox.style.display = (count >= HOME_TECHNIQUES.length) ? 'block' : 'none';
    }
  }

  window.marcarTecnicaCasa = function (id) {
    var wasDone = !!state.completedHomeTechs[id];
    state.completedHomeTechs[id] = !wasDone;
    if (!wasDone) {
      sonarCelebracion();
      addXP(20, 's-casa');
      if (state.soundOn) {
        reproducirArchivoDirecto('casa_felicitacion.mp3', function () {
          limpiarEstadoReproduccionAudio();
        });
      }
    } else {
      saveState();
    }
    renderHandsOnTab();

    var totalHechas = Object.keys(state.completedHomeTechs).filter(function (k) {
      return state.completedHomeTechs[k];
    }).length;
    if (!wasDone && totalHechas >= HOME_TECHNIQUES.length) {
      window.lanzarConfetiPrebasica();
      var diplomaBox = document.getElementById('diplomaPrebasicaBox');
      if (diplomaBox) {
        try {
          diplomaBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (e) {}
      }
    }
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
    if (traceAutoAdvanceTimer) { clearTimeout(traceAutoAdvanceTimer); traceAutoAdvanceTimer = null; }
    if (figuraAutoAdvanceTimer) { clearTimeout(figuraAutoAdvanceTimer); figuraAutoAdvanceTimer = null; }
    if (rodeaAutoAdvanceTimer) { clearTimeout(rodeaAutoAdvanceTimer); rodeaAutoAdvanceTimer = null; }
    if (puzzleAutoAdvanceTimer) { clearTimeout(puzzleAutoAdvanceTimer); puzzleAutoAdvanceTimer = null; }

    state = {
      xp: 0,
      soundOn: (state && state.soundOn !== false),
      completedTraces: {},
      completedFiguras: {},
      completedFiguraObjects: {},
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
    selectFigura(0, false);
    buildRodeaExercise();
    if (typeof window.mostrarRompecabezas === 'function') {
      window.mostrarRompecabezas('numeros');
    }
    renderHandsOnTab();
    if (typeof window.go === 'function') {
      window.go('s-trazos');
    }
  }
  window.reiniciarTodoProgresoPrebasica = reiniciarTodoProgresoPrebasica;
  window.resetXP = reiniciarTodoProgresoPrebasica;

  window.cambiarEscuelaPrebasica = function () {
    borrarInfoEscuela();
    var cintillo = document.getElementById('cintilloInstitucionPrebasica');
    if (cintillo) cintillo.style.display = 'none';
    reiniciarTodoProgresoPrebasica();
    window.abrirModalInstitucion(false);
  };

  /* --------------------------------------------------------------------------
     COMPARTIR POR WHATSAPP Y PORTAL DE INVITACIÓN FAMILIAR / DOCENTE
     -------------------------------------------------------------------------- */
  function obtenerUrlLimpiaMision() {
    var meta = document.querySelector('meta[property="og:url"]');
    if (meta && meta.content) {
      return meta.content;
    }
    return 'https://metas.policastsapien.com/misiones/prebasica-tecnicas-libro1/prebasica-libro1.html';
  }

  function generarMensajeWhatsAppPrebasica(nombreEscuela) {
    var urlLimpia = obtenerUrlLimpiaMision();
    var escuelaLimpia = limpiarPrefijoEscuela(nombreEscuela);
    var tieneEscuela = (escuelaLimpia && typeof escuelaLimpia === 'string' && escuelaLimpia.trim().length > 0);
    var paso2 = tieneEscuela
      ? '2️⃣ En la caja del Portal de Acceso, escriba el nombre oficial de nuestro Kínder / Centro Educativo: *' + escuelaLimpia.trim() + '*'
      : '2️⃣ En la caja del Portal de Acceso, escriba el nombre oficial de nuestro Kínder / Centro Educativo: *[ESCRIBA AQUÍ EL NOMBRE DEL KÍNDER / CEPB]*';

    var lineas = [
      '📚✨ *M.E.T.A.S. · Prebásica (3.° Grado): Técnicas Gráficas y No Gráficas (Libro 1)*',
      '👨‍👩‍👧 *Recurso de Uso Exclusivo para Centros Educativos Autorizados*',
      '',
      '🔑 *¿Cómo ingresar desde casa?*',
      '1️⃣ Toque el enlace oficial al final de este mensaje.',
      paso2,
      '',
      '⚠️ *Uso exclusivo y supervisado:* Este complemento digital es únicamente para padres responsables sentados junto a su hijo(a) durante 10 a 15 minutos como refuerzo del libro físico. Prohibido compartir fuera de nuestra comunidad educativa o dejar al niño solo con el dispositivo.',
      '',
      '👇 *TOQUE EL ENLACE PARA INICIAR LA MISIÓN:* 👇',
      urlLimpia
    ];
    return lineas.join('\n');
  }

  function copiarTextoAlPortapapeles(texto, btn, textoOriginal, textoExito) {
    var fnFeedback = function () {
      if (!btn) return;
      var orig = textoOriginal || btn.innerHTML;
      btn.innerHTML = textoExito || '✅ ¡Copiado!';
      btn.classList.add('copiado-exito');
      setTimeout(function () {
        btn.innerHTML = orig;
        btn.classList.remove('copiado-exito');
      }, 2200);
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(texto).then(function () {
        fnFeedback();
      }).catch(function () {
        fallbackCopiar(texto, fnFeedback);
      });
      return;
    }
    fallbackCopiar(texto, fnFeedback);
  }

  function fallbackCopiar(texto, onExito) {
    try {
      var ta = document.createElement('textarea');
      ta.value = texto;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.top = '0';
      ta.setAttribute('readonly', '');
      document.body.appendChild(ta);
      ta.select();
      var ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok && typeof onExito === 'function') {
        onExito();
      } else if (!ok) {
        alert('Por favor selecciona y copia el mensaje:\n\n' + texto);
      }
    } catch (e) {
      alert('Por favor selecciona y copia el mensaje:\n\n' + texto);
    }
  }

  function _waShare(texto) {
    var enc = encodeURIComponent(texto);
    var esMovil = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    window.open(esMovil ? 'https://wa.me/?text=' + enc : 'https://web.whatsapp.com/send?text=' + enc, '_blank');
  }

  function abrirWhatsAppCompartir(msg) {
    _waShare(msg);
  }

  window.compartirWhatsAppDocenteGeneral = function () {
    var msg = generarMensajeWhatsAppPrebasica(null);
    abrirWhatsAppCompartir(msg);
  };

  window.copiarMensajeInvitacion = function (btnElement) {
    var msg = generarMensajeWhatsAppPrebasica(null);
    copiarTextoAlPortapapeles(msg, btnElement, '📋 Copiar mensaje de invitación', '✅ ¡Mensaje copiado!');
  };

  window.compartirMision = function () {
    var info = obtenerInfoEscuela();
    if (info && info.nombre) {
      window.abrirModalCompartirOpciones(info.nombre);
    } else {
      window.compartirWhatsAppDocenteGeneral();
    }
  };

  window.abrirModalCompartirOpciones = function (escuelaActiva) {
    var modal = document.getElementById('modalCompartirPrebasica');
    var lblEscuela = document.getElementById('lblShareOpcionEscuela');
    var subEscuela = document.getElementById('lblShareSubEscuela');
    var escuelaLimpia = limpiarPrefijoEscuela(escuelaActiva);
    if (lblEscuela) {
      lblEscuela.textContent = '🏫 Compartir para mi escuela actual (' + escuelaLimpia + ')';
    }
    if (subEscuela) {
      subEscuela.textContent = 'Incluye "' + escuelaLimpia + '" en el Paso 2 para que las familias ingresen directamente.';
    }
    if (modal) {
      modal.style.display = 'flex';
    }
  };

  window.cerrarModalCompartir = function () {
    var modal = document.getElementById('modalCompartirPrebasica');
    if (modal) modal.style.display = 'none';
  };

  window.enviarWhatsAppPrebasica = function (usarEscuelaActiva) {
    var esc = null;
    if (usarEscuelaActiva) {
      var info = obtenerInfoEscuela();
      esc = info ? info.nombre : null;
    }
    var msg = generarMensajeWhatsAppPrebasica(esc);
    abrirWhatsAppCompartir(msg);
    window.cerrarModalCompartir();
  };

  window.copiarMensajePrebasicaBtn = function (btnElement, usarEscuelaActiva) {
    var esc = null;
    if (usarEscuelaActiva) {
      var info = obtenerInfoEscuela();
      esc = info ? info.nombre : null;
    }
    var msg = generarMensajeWhatsAppPrebasica(esc);
    copiarTextoAlPortapapeles(msg, btnElement, '📋 Copiar texto', '✅ ¡Copiado!');
  };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      window.cerrarModalCompartir();
      var btnCancelar = document.getElementById('btnCancelarInstitucion');
      if (btnCancelar && btnCancelar.style.display !== 'none') {
        window.cerrarModalInstitucion();
      }
    }
  });

  /* --------------------------------------------------------------------------
     PORTAL DE ACCESO Y GESTIÓN DE INSTITUCIÓN EDUCATIVA (PREBÁSICA)
     -------------------------------------------------------------------------- */
  function actualizarCintilloInstitucion(infoOrNombre) {
    var cintillo = document.getElementById('cintilloInstitucionPrebasica');
    var lbl = document.getElementById('lblNombreInstitucion');
    if (!cintillo || !lbl) return;

    var info = null;
    if (typeof infoOrNombre === 'object' && infoOrNombre !== null) {
      info = infoOrNombre;
    } else if (typeof infoOrNombre === 'string') {
      var str = infoOrNombre.trim();
      if (str.charAt(0) === '{' && str.charAt(str.length - 1) === '}') {
        try { info = JSON.parse(str); } catch (e) {}
      }
      if (!info) {
        info = { nombre: limpiarPrefijoEscuela(str), tipo: 'OFICIAL' };
      }
    } else {
      info = obtenerInfoEscuela();
    }

    if (!info || !info.nombre) {
      cintillo.style.display = 'none';
      return;
    }

    var nombreLimpio = limpiarPrefijoEscuela(info.nombre);
    if (!nombreLimpio) {
      cintillo.style.display = 'none';
      return;
    }

    if (info.tipo === 'DEMO') {
      var msRestantes = (info.expiraEn || Date.now()) - Date.now();
      var diasRestantes = Math.max(1, Math.ceil(msRestantes / 86400000));
      var sufijoDias = diasRestantes === 1 ? ' día restante)' : ' días restantes)';
      lbl.textContent = nombreLimpio + ' ⏳ Demo (' + diasRestantes + sufijoDias;
    } else {
      lbl.textContent = nombreLimpio;
    }

    cintillo.style.display = 'block';
  }

  function inicializarInstitucionPrebasica() {
    var info = obtenerInfoEscuela();
    if (!info || !info.nombre) {
      window.abrirModalInstitucion(false);
      return;
    }

    var nombreLimpio = limpiarPrefijoEscuela(info.nombre);

    // 1. Verificar revocación remota
    if (estaColegioRevocadoLocal(nombreLimpio)) {
      borrarInfoEscuela();
      var cintilloRev = document.getElementById('cintilloInstitucionPrebasica');
      if (cintilloRev) cintilloRev.style.display = 'none';
      window.abrirModalInstitucion(false);
      var errRev = document.getElementById('errorInstitucionPrebasica');
      if (errRev) {
        errRev.textContent = '⛔ El acceso para ' + nombreLimpio + ' ha sido revocado. Para reactivar el servicio, comuníquese con la distribuidora M.E.T.A.S.';
        errRev.style.display = 'block';
      }
      return;
    }

    // 2. Verificar expiración de prueba DEMO
    if (info.tipo === 'DEMO') {
      var ahora = Date.now();
      if (info.expiraEn && ahora > info.expiraEn) {
        borrarInfoEscuela();
        var cintilloExp = document.getElementById('cintilloInstitucionPrebasica');
        if (cintilloExp) cintilloExp.style.display = 'none';
        window.abrirModalInstitucion(false);
        var errExp = document.getElementById('errorInstitucionPrebasica');
        if (errExp) {
          errExp.textContent = '⏳ El periodo de prueba gratuita para ' + nombreLimpio + ' ha concluido. Para activar el acceso oficial anual junto con el Libro 1 de Prebásica, comuníquese con la distribuidora M.E.T.A.S.';
          errExp.style.display = 'block';
        }
        return;
      }
    }

    // 3. Acceso válido: actualizar almacenamiento a objeto canónico y mostrar cintillo
    info.nombre = nombreLimpio;
    guardarInfoEscuela(info);
    actualizarCintilloInstitucion(info);
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
    if (!raw || !raw.trim()) {
      if (err) {
        err.textContent = 'Por favor escribe el nombre de tu centro educativo.';
        err.style.display = 'block';
      }
      if (input) input.focus();
      return;
    }

    var entrada = raw.trim();
    var validadoInfo = null;

    // 1. Detección de prefijo temporal DEMO (DEMO20-, DEMO7-, DEMO-, etc.)
    var regexDemo = /^DEMO(\d+)?\s*[-:]\s*(.+)$/i;
    var matchDemo = entrada.match(regexDemo);
    if (matchDemo) {
      var dias = matchDemo[1] ? parseInt(matchDemo[1], 10) : 20;
      if (isNaN(dias) || dias <= 0) dias = 20;
      var candDemo = matchDemo[2].trim();
      if (candDemo.length >= 3) {
        if (estaColegioRevocadoLocal(candDemo)) {
          if (err) {
            err.textContent = '⛔ El acceso para ' + candDemo + ' ha sido revocado. Comuníquese con la distribuidora M.E.T.A.S.';
            err.style.display = 'block';
          }
          if (input) input.focus();
          return;
        }
        var nomDemoCat = buscarEnCatalogoColegios(candDemo);
        var nomDemoFinal = nomDemoCat || ((typeof window.formatearNombreColegio === 'function')
          ? window.formatearNombreColegio(candDemo)
          : formatearNombreInstitucion(candDemo));
        validadoInfo = {
          nombre: nomDemoFinal,
          tipo: 'DEMO',
          expiraEn: Date.now() + (dias * 86400000),
          diasAsignados: dias
        };
      }
    }

    // 2. Detección de prefijo rápido oficial: 2027-, 2027:, METAS-, METAS:, METAS2027-
    if (!validadoInfo) {
      var regexPrefijo = /^\s*(?:2027|metas|metas2027)\s*[-:]\s*(.+)$/i;
      var matchPrefijo = entrada.match(regexPrefijo);
      if (matchPrefijo) {
        var candOficial = matchPrefijo[1].trim();
        if (candOficial.length >= 3) {
          if (estaColegioRevocadoLocal(candOficial)) {
            if (err) {
              err.textContent = '⛔ El acceso para ' + candOficial + ' ha sido revocado. Comuníquese con la distribuidora M.E.T.A.S.';
              err.style.display = 'block';
            }
            if (input) input.focus();
            return;
          }
          var nomOficialCat = buscarEnCatalogoColegios(candOficial);
          var nomOficialFinal = nomOficialCat || ((typeof window.formatearNombreColegio === 'function')
            ? window.formatearNombreColegio(candOficial)
            : formatearNombreInstitucion(candOficial));
          validadoInfo = {
            nombre: nomOficialFinal,
            tipo: 'OFICIAL'
          };
        }
      }
    }

    // 3. Validación contra colegios-prebasica.js o catálogo interno (sin prefijo)
    if (!validadoInfo) {
      if (typeof window.validarInstitucionPrebasica === 'function') {
        var resVal = window.validarInstitucionPrebasica(entrada);
        if (resVal) {
          if (typeof resVal === 'object' && resVal.nombre) {
            validadoInfo = resVal;
          } else if (typeof resVal === 'string') {
            validadoInfo = {
              nombre: resVal,
              tipo: 'OFICIAL'
            };
          }
        }
      }
    }

    // 4. Catálogo interno directo si no se resolvió
    if (!validadoInfo) {
      var nomDirecto = buscarEnCatalogoColegios(entrada);
      if (nomDirecto) {
        if (estaColegioRevocadoLocal(nomDirecto)) {
          if (err) {
            err.textContent = '⛔ El acceso para ' + nomDirecto + ' ha sido revocado. Comuníquese con la distribuidora M.E.T.A.S.';
            err.style.display = 'block';
          }
          if (input) input.focus();
          return;
        }
        validadoInfo = {
          nombre: nomDirecto,
          tipo: 'OFICIAL'
        };
      }
    }

    if (validadoInfo && validadoInfo.nombre) {
      if (estaColegioRevocadoLocal(validadoInfo.nombre)) {
        if (err) {
          err.textContent = '⛔ El acceso para ' + validadoInfo.nombre + ' ha sido revocado. Comuníquese con la distribuidora M.E.T.A.S.';
          err.style.display = 'block';
        }
        if (input) input.focus();
        return;
      }

      var infoAnterior = obtenerInfoEscuela();
      var esDistinta = (!infoAnterior || infoAnterior.nombre !== validadoInfo.nombre);

      guardarInfoEscuela(validadoInfo);

      if (esDistinta) {
        reiniciarTodoProgresoPrebasica();
      }

      actualizarCintilloInstitucion(validadoInfo);
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
     RETORNO INTELIGENTE Y REGISTRO DE ESTADO PARA EL PORTAL
     -------------------------------------------------------------------------- */
  function guardarEstadoPrebasicaParaPortal() {
    try {
      localStorage.setItem('metas_usuario_prebasica', 'true');
      localStorage.setItem('metas_ultima_mision_prebasica_id', 'prebasica-tecnicas-libro1');
      localStorage.setItem('metas_ultima_mision_prebasica_titulo', 'Prebásica (3.° Grado): Técnicas Gráficas y No Gráficas — Libro 1');
      localStorage.setItem('metas_ultima_mision_prebasica_url', 'misiones/prebasica-tecnicas-libro1/prebasica-libro1.html');
    } catch (e) {}
  }
  window.guardarEstadoPrebasicaParaPortal = guardarEstadoPrebasicaParaPortal;

  window.guardarYRegresarPrebasica = function (e) {
    if (e && e.preventDefault) e.preventDefault();
    guardarEstadoPrebasicaParaPortal();
    window.location.href = '../../index.html?desde=prebasica#zona-prebasica';
  };

  /* --------------------------------------------------------------------------
     INICIALIZACIÓN AL CARGAR EL DOM
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    loadState();
    guardarEstadoPrebasicaParaPortal();
    var sndBtn = document.getElementById('sndBtn');
    if (sndBtn) sndBtn.textContent = state.soundOn ? '🔊 Sonido: Sí' : '🔇 Sonido: No';
    initTraceTab();
    initFigurasTab();
    initRodeaTab();
    if (typeof window.mostrarRompecabezas === 'function') {
      window.mostrarRompecabezas('numeros');
    }
    renderHandsOnTab();
    inicializarInstitucionPrebasica();
  });
})();
