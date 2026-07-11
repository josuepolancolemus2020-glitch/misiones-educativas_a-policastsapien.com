'use strict';



const SUBJECT_LABELS = {
  'español':     'Español',
  'matemáticas': 'Matemáticas',
  'naturales':   'C. Naturales',
  'sociales':    'C. Sociales',
};

const LEVELS = [
  { n: 1, min:   0, max:  99,       label: 'Explorador', emoji: '🌱' },
  { n: 2, min: 100, max: 249,       label: 'Aprendiz',   emoji: '📚' },
  { n: 3, min: 250, max: 499,       label: 'Estudioso',  emoji: '🔍' },
  { n: 4, min: 500, max: 799,       label: 'Académico',  emoji: '⚡' },
  { n: 5, min: 800, max: Infinity,  label: 'Sabio',      emoji: '🏆' },
];



/* ─────────────────────────────────────────────
   STATE
───────────────────────────────────────────── */

/* ─────────────────────────────────────────────
   MODAL SÍMBOLOS
───────────────────────────────────────────── */

const _simRegistry = new Map();

function openSimModal(key) {
  const s = _simRegistry.get(key);
  if (!s) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'sim-modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');

  const imgHTML = s.img
    ? `<img src="${s.img}" alt="${s.nombre}" class="sim-modal-img">`
    : `<div class="sim-modal-emoji">${s.emoji}</div>`;

  backdrop.innerHTML = `
    <div class="sim-modal">
      ${imgHTML}
      <span class="sim-modal-badge">${s.tipo}</span>
      <div class="sim-modal-title">${s.nombre}</div>
      ${s.info ? `<p class="sim-modal-info">${s.info}</p>` : ''}
      <button class="sim-modal-close" aria-label="Cerrar">Cerrar ✕</button>
    </div>`;

  backdrop.querySelector('.sim-modal-close').addEventListener('click', () => backdrop.remove());
  backdrop.addEventListener('click', e => { if (e.target === backdrop) backdrop.remove(); });
  document.body.appendChild(backdrop);
}
window.openSimModal = openSimModal;

/* ─────────────────────────────────────────────
   STATE
───────────────────────────────────────────── */

const KEY = 'meta_v2';

function blank() {
  return { name: '', grade: '2y3ciclo', country: 'HN', xp: 0, visited: [], lastVisited: [] };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const st = Object.assign(blank(), JSON.parse(raw));
      // Países en standby: mientras la bandera esté apagada todos exploran
      // Honduras (rescata sin perder XP a quien tenía otro país guardado).
      if (!window.METAS_PAISES_ON) st.country = 'HN';
      return st;
    }
  } catch (_) {}
  return blank();
}

function save(s) {
  try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (_) {}
}

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */

function getLevel(xp) {
  return LEVELS.find(l => xp >= l.min && xp <= l.max) || LEVELS[0];
}

function xpPct(xp) {
  const lv = getLevel(xp);
  if (lv.n === 5) return 100;
  return Math.round(((xp - lv.min) / (lv.max - lv.min + 1)) * 100);
}

function displayName(s) {
  return s.name.trim() || 'Estudiante';
}

function featuredMission(s) {
  const unvisited = MISSIONS.filter(m => !s.visited.includes(m.id));
  if (unvisited.length) {
    const idx = Math.floor(Date.now() / 86400000) % unvisited.length;
    return unvisited[idx];
  }
  return MISSIONS.reduce((a, b) => a.xp > b.xp ? a : b);
}

/* ─────────────────────────────────────────────
   ROTACIÓN AUTOMÁTICA (tiempo basado en lectura)
───────────────────────────────────────────── */

// Velocidad de lectura promedio en español: ~200 palabras/minuto
// Buffer 1.8× para dar tiempo de comprensión
const WPM        = 200;
const READ_BUF   = 1.8;
const MIN_DELAY  = 14000;  // mínimo 14 s (textos muy cortos)
const MAX_DELAY  = 95000;  // máximo 95 s (textos muy largos)

let _motivIdx       = Math.floor(Math.random() * FRASES.length);
let _factIdx        = 0;
let _currentCountry = 'HN';
let _rotTimeout     = null;

function calcReadingDelay() {
  const frase = FRASES[_motivIdx];
  const data  = COUNTRY_DATA[_currentCountry];
  const fact  = data ? data.curiosidades[_factIdx % data.curiosidades.length] : null;
  // Contar palabras del texto visible actualmente
  const combined = [frase.texto, fact ? fact.texto : ''].join(' ');
  const words    = combined.trim().split(/\s+/).filter(Boolean).length;
  const ms       = Math.round((words / WPM) * 60 * READ_BUF * 1000);
  return Math.min(MAX_DELAY, Math.max(MIN_DELAY, ms));
}

function fadeUpdate(id, text) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(6px)';
  setTimeout(() => {
    el.textContent = text;
    el.style.opacity = '';
    el.style.transform = '';
  }, 280);
}

function renderFactDots() {
  const dotsEl = document.getElementById('cc-dots');
  const data   = COUNTRY_DATA[_currentCountry];
  if (!dotsEl || !data) return;
  const total   = data.curiosidades.length;
  const visible = Math.min(total, 10);
  const active  = _factIdx % visible;
  dotsEl.innerHTML = Array.from({ length: visible }, (_, i) =>
    `<span class="cc-dot${i === active ? ' active' : ''}"></span>`
  ).join('');
}

function tickRotation() {
  _motivIdx = (_motivIdx + 1) % FRASES.length;
  _factIdx++;

  const frase = FRASES[_motivIdx];
  fadeUpdate('motiv-text',  frase.texto);
  fadeUpdate('motiv-autor', '— ' + frase.autor);

  const data = COUNTRY_DATA[_currentCountry];
  if (data) {
    const fact = data.curiosidades[_factIdx % data.curiosidades.length];
    fadeUpdate('cc-text',     fact.texto);
    fadeUpdate('cc-category', fact.categoria);
    setTimeout(renderFactDots, 290);
  }

  scheduleNextTick();
}

function scheduleNextTick() {
  clearTimeout(_rotTimeout);
  _rotTimeout = setTimeout(tickRotation, calcReadingDelay());
}

/* ─────────────────────────────────────────────
   TEMA POR PAÍS
───────────────────────────────────────────── */

function applyCountryTheme(code) {
  const data = COUNTRY_DATA[code];
  if (!data) return;
  const r = document.documentElement.style;
  r.setProperty('--brand',       data.tema.brand);
  r.setProperty('--brand-mid',   data.tema.brandMid);
  r.setProperty('--brand-light', data.tema.brandLight);
}

function renderCountryCard(code) {
  const data = COUNTRY_DATA[code];
  if (!data) return;

  const idx  = _factIdx % data.curiosidades.length;
  const fact = data.curiosidades[idx];

  // Emoji + nombre + lema
  const flagEl = document.getElementById('cc-flag');
  const nameEl = document.getElementById('cc-country-name');
  const lemaEl = document.getElementById('cc-lema');
  const textEl = document.getElementById('cc-text');
  const catEl  = document.getElementById('cc-category');

  if (flagEl) flagEl.textContent = data.bandera;
  if (nameEl) nameEl.textContent = data.nombre;
  if (lemaEl) lemaEl.textContent = data.lema || '';
  if (textEl) textEl.textContent = fact.texto;
  if (catEl)  catEl.textContent  = fact.categoria;

  // Símbolos patrios — dos secciones con imágenes y modal
  const simEl = document.getElementById('cc-simbolos');
  if (simEl) {
    _simRegistry.clear();

    const buildItem = s => {
      const key = 'sim_' + Math.random().toString(36).slice(2);
      _simRegistry.set(key, s);
      const visual = s.img
        ? `<img src="${s.img}" alt="${s.nombre}" class="cc-sim-img">`
        : `<span class="cc-sim-emoji">${s.emoji}</span>`;
      return `<div class="cc-sim-item cc-sim-clickable" onclick="openSimModal('${key}')">${visual}<span class="cc-sim-nombre">${s.nombre}</span><span class="cc-sim-tipo">${s.tipo}</span></div>`;
    };

    let html = '';
    if (data.simbolosMayores && data.simbolosMayores.length) {
      html += `<div class="cc-sim-section"><div class="cc-sim-label">🏅 Símbolos Mayores</div><div class="cc-sim-grid">${data.simbolosMayores.map(buildItem).join('')}</div></div>`;
    }
    if (data.simbolos && data.simbolos.length) {
      html += `<div class="cc-sim-section"><div class="cc-sim-label">🌿 Símbolos Menores</div><div class="cc-sim-grid">${data.simbolos.map(buildItem).join('')}</div></div>`;
    }
    simEl.innerHTML = html;
  }

  renderFactDots();
}

function nextFact() {
  const data = COUNTRY_DATA[_currentCountry];
  if (!data) return;
  _factIdx = (_factIdx + 1) % data.curiosidades.length;
  const fact = data.curiosidades[_factIdx];
  fadeUpdate('cc-text',     fact.texto);
  fadeUpdate('cc-category', fact.categoria);
  setTimeout(renderFactDots, 290);
  scheduleNextTick();
}

function prevFact() {
  const data = COUNTRY_DATA[_currentCountry];
  if (!data) return;
  _factIdx = (_factIdx - 1 + data.curiosidades.length) % data.curiosidades.length;
  const fact = data.curiosidades[_factIdx];
  fadeUpdate('cc-text',     fact.texto);
  fadeUpdate('cc-category', fact.categoria);
  setTimeout(renderFactDots, 290);
  scheduleNextTick();
}

/* ─────────────────────────────────────────────
   RENDER — HOME
───────────────────────────────────────────── */

function renderHome() {
  const s       = load();
  const country = s.country || 'HN';

  // Saludo
  document.getElementById('home-name').textContent = displayName(s) + '!';

  // Frase motivacional (índice global de rotación)
  const frase = FRASES[_motivIdx];
  document.getElementById('motiv-text').textContent  = frase.texto;
  document.getElementById('motiv-autor').textContent = '— ' + frase.autor;

  // Tema y datos del país
  _currentCountry = country;
  applyCountryTheme(country);
  renderCountryCard(country);

  // Chips de materia: misiones o "Próximamente" según país
  document.querySelectorAll('.subj-chip').forEach(chip => {
    const em = chip.querySelector('em');
    if (!em) return;
    if (country === 'HN') {
      const count = MISSIONS.filter(m => m.subject === chip.dataset.subject).length;
      em.textContent = `${count} misión${count !== 1 ? 'es' : ''}`;
    } else {
      em.textContent = 'Próximamente';
    }
  });

  // Sección Misión destacada + Recientes: solo Honduras
  const featuredSection = document.getElementById('featured-section');
  if (featuredSection) featuredSection.hidden = (country !== 'HN');

  if (country !== 'HN') return;

  const m    = featuredMission(s);
  const done = s.visited.includes(m.id);
  const card = document.getElementById('featured-card');
  card.innerHTML = `
    <div class="feat-label">★ Misión destacada</div>
    <div class="feat-subj">${m.icon} ${SUBJECT_LABELS[m.subject] || m.subject}</div>
    <div class="feat-title">${m.title}</div>
    <div class="feat-grade">${rutaLabel(m)}</div>
    <div class="feat-actions">
      <div class="feat-xp">
        <i class="fa-solid fa-star"></i>
        ${done ? 'Ya visitada' : `+${m.xp} XP`}
      </div>
      <button class="feat-btn">
        ${done ? 'Repetir' : 'Iniciar'} <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  `;
  card.onclick = () => visitMission(m.id);

  const wrap   = document.getElementById('recent-wrap');
  const list   = document.getElementById('recent-list');
  const recent = (s.lastVisited || [])
    .slice(0, 3)
    .map(id => MISSIONS.find(m => m.id === id))
    .filter(Boolean);

  if (recent.length === 0) {
    wrap.hidden = true;
  } else {
    wrap.hidden = false;
    list.innerHTML = recent.map(m => `
      <a class="small-item" onclick="visitMission(${m.id}); return false;" href="${m.url}">
        <div class="small-icon ${m.color}">${m.icon}</div>
        <div class="small-info">
          <div class="small-title">${m.title}</div>
          <div class="small-meta">${SUBJECT_LABELS[m.subject] || m.subject} · ${rutaLabel(m)}</div>
        </div>
        <i class="fa-solid fa-chevron-right small-arrow"></i>
      </a>
    `).join('');
  }
}

/* ─────────────────────────────────────────────
   RENDER — PRÓCERES CAROUSEL
───────────────────────────────────────────── */

let _proceresIdx = 0;

function renderProceres(country) {
  const section = document.getElementById('proceres-section');
  if (!section) return;
  const data = PROCERES_DATA[country];
  if (!data || !data.length) { section.innerHTML = ''; return; }
  _proceresIdx = 0;
  _buildProceresHTML(country, data);
}

function _buildProceresHTML(country, data) {
  const section = document.getElementById('proceres-section');
  if (!section) return;
  const cd = COUNTRY_DATA[country];
  const item = data[_proceresIdx];
  const dots = data.map((_, i) =>
    `<span class="cc-dot${i === _proceresIdx ? ' active' : ''}"></span>`
  ).join('');

  section.innerHTML = `
    <div class="proc-card">
      <div class="proc-card-header">
        <span class="proc-flag">${cd ? cd.bandera : ''}</span>
        <span class="proc-card-title">Próceres de ${cd ? cd.nombre : country}</span>
      </div>
      <div class="proc-body" id="proc-swipe">
        <img src="${item.img}" alt="${item.nombre}" class="proc-foto">
        <div class="proc-info">
          <div class="proc-nombre">${item.nombre}</div>
          <div class="proc-fecha">${item.fecha}</div>
          <p class="proc-desc">${item.desc}</p>
          <p class="proc-cita">"${item.cita}"</p>
        </div>
      </div>
      <div class="proc-footer">
        <button class="cc-nav-btn" id="proc-prev" aria-label="Anterior">‹</button>
        <div class="cc-dots">${dots}</div>
        <button class="cc-nav-btn" id="proc-next" aria-label="Siguiente">›</button>
      </div>
    </div>`;

  document.getElementById('proc-prev').addEventListener('click', () => {
    _proceresIdx = (_proceresIdx - 1 + data.length) % data.length;
    _buildProceresHTML(country, data);
  });
  document.getElementById('proc-next').addEventListener('click', () => {
    _proceresIdx = (_proceresIdx + 1) % data.length;
    _buildProceresHTML(country, data);
  });

  const swipe = document.getElementById('proc-swipe');
  if (swipe) {
    let _tx = 0;
    swipe.addEventListener('touchstart', e => { _tx = e.touches[0].clientX; }, { passive: true });
    swipe.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - _tx;
      if (Math.abs(dx) > 38) {
        _proceresIdx = dx < 0
          ? (_proceresIdx + 1) % data.length
          : (_proceresIdx - 1 + data.length) % data.length;
        _buildProceresHTML(country, data);
      }
    }, { passive: true });
  }
}

/* ─────────────────────────────────────────────
   RENDER — MISSIONS
───────────────────────────────────────────── */

function renderMissions(filter, query) {
  const s = load();
  const country = s.country || 'HN';

  renderProceres(country);

  const container = document.getElementById('missions-container');

  if (country !== 'HN') {
    const cd = COUNTRY_DATA[country];
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🚀</div>
        <h3>¡Próximamente!</h3>
        <p>Las misiones para <strong>${cd ? cd.nombre : 'este país'}</strong> están en camino.<br>
           Cambia a <strong>🇭🇳 Honduras</strong> para explorar las misiones disponibles.</p>
      </div>`;
    return;
  }

  let list = [...MISSIONS];

  if (filter && filter !== 'all') {
    list = list.filter(m => m.subject === filter);
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (SUBJECT_LABELS[m.subject] || '').toLowerCase().includes(q) ||
      rutaLabel(m).toLowerCase().includes(q)
    );
  }

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>Sin resultados</h3>
        <p>Intenta con otro término o cambia el filtro.</p>
      </div>`;
    return;
  }

  container.innerHTML = list.map(m => {
    const visited = s.visited.includes(m.id);
    return `
      <a class="mission-card ${visited ? 'visited' : ''}"
         onclick="visitMission(${m.id}); return false;"
         href="${m.url}">
        <div class="mc-icon ${m.color}">${m.icon}</div>
        <div class="mc-info">
          <div class="mc-title">${m.title}</div>
          <div class="mc-meta">
            <span class="mc-subj ${m.color}">${SUBJECT_LABELS[m.subject] || m.subject}</span>
            <span class="mc-grade">${rutaLabel(m)}</span>
            ${visited
              ? `<span class="mc-done"><i class="fa-solid fa-check"></i> Visitada</span>`
              : `<span class="mc-xp"><i class="fa-solid fa-star"></i> +${m.xp} XP</span>`}
          </div>
        </div>
        <i class="fa-solid fa-chevron-right mc-arrow"></i>
      </a>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   RENDER — RUTAS DE APRENDIZAJE
   Mapa tipo línea de metro con progreso real leído de
   METAS_REGISTRO_V1 (mismo origen que las misiones):
   nota ≥ 70 = etapa dominada · intentada = en progreso.
───────────────────────────────────────────── */

const REGISTRO_KEY = 'METAS_REGISTRO_V1';
const RUTAS_ORDEN  = ['numero', 'forma', 'palabra', 'planeta', 'cuerpo'];

function _rNorm(s) {
  s = String(s || '').toLowerCase();
  try { return s.normalize('NFC'); } catch (_) { return s; }
}

function missionFolder(m) {
  const seg = (m.url || '').split('/')[1] || '';
  try { return _rNorm(decodeURIComponent(seg)); } catch (_) { return _rNorm(seg); }
}

function readRegistro() {
  try {
    const a = JSON.parse(localStorage.getItem(REGISTRO_KEY));
    return Array.isArray(a) ? a : [];
  } catch (_) { return []; }
}

// Mapa carpeta-de-misión → { tried, best } (mejor nota sobre 100)
function rutasProgress() {
  const prog = {};
  readRegistro().forEach(ev => {
    if (!ev || !ev.mision) return;
    const f = _rNorm(ev.mision);
    const p = prog[f] || (prog[f] = { tried: false, best: null });
    p.tried = true;
    if ((ev.tipo === 'evaluacion' || ev.tipo === 'prueba_operativa') && typeof ev.nota === 'number') {
      const base = (typeof ev.base === 'number' && ev.base > 0) ? ev.base : 100;
      const pct  = Math.round((ev.nota / base) * 100);
      if (p.best === null || pct > p.best) p.best = pct;
    }
  });
  return prog;
}

function etapaEstado(m, prog) {
  const p = prog[missionFolder(m)];
  if (!p) return 'pendiente';
  if (p.best !== null && p.best >= 70) return 'dominada';
  return 'progreso';
}

/* ── Fase 3: diagnóstico por ruta, "Tu siguiente paso" e insignias ── */

const DIAG_KEY = 'METAS_DIAG_V1';

function readDiag() {
  try {
    const o = JSON.parse(localStorage.getItem(DIAG_KEY));
    return (o && typeof o === 'object') ? o : {};
  } catch (_) { return {}; }
}
function saveDiag(d) {
  try { localStorage.setItem(DIAG_KEY, JSON.stringify(d)); } catch (_) {}
}

function insigniasDeRuta(key, prog) {
  const etapas = rutaEtapas(key);
  const dom = etapas.filter(m => etapaEstado(m, prog) === 'dominada').length;
  const list = [];
  if (dom >= 1) list.push({ icon: '⭐', nombre: 'En marcha' });
  if (dom >= Math.ceil(etapas.length / 2)) list.push({ icon: '🏅', nombre: 'Media ruta' });
  if (dom === etapas.length) list.push({ icon: '🏆', nombre: 'Ruta completa' });
  return list;
}

// Última misión con ruta que aparece en el registro (el evento más reciente)
function ultimaMisionActiva() {
  const evs = readRegistro();
  for (let i = evs.length - 1; i >= 0; i--) {
    const ev = evs[i];
    if (!ev || !ev.mision) continue;
    const f = _rNorm(ev.mision);
    const m = MISSIONS.find(x => x.ruta && missionFolder(x) === f);
    if (m) return m;
  }
  return null;
}

// Reglas Fase 3: nota <70 → asegurar la etapa anterior; ≥90 → invitar a la siguiente
function sugerenciaSiguiente(prog) {
  const last = ultimaMisionActiva();
  if (last) {
    const etapas = rutaEtapas(last.ruta);
    const p = prog[missionFolder(last)] || {};
    const best = (typeof p.best === 'number') ? p.best : null;

    if (best !== null && best < 70) {
      const prev = etapas.filter(x => x.etapa < last.etapa).pop();
      if (prev) return { m: prev, titulo: 'Asegura tu base', razon: `Tu nota en «${last.title}» fue ${best}. Refuerza primero la etapa anterior y vuelve con más fuerza: repasar también es avanzar. 💪` };
      return { m: last, titulo: 'Vuelve a intentarlo', razon: `Tu mejor nota en «${last.title}» fue ${best}. Ya conoces el camino: esta vez la dominas. 💪` };
    }

    if (best !== null) {
      const next = etapas.find(x => x.etapa > last.etapa && etapaEstado(x, prog) !== 'dominada')
                || etapas.find(x => etapaEstado(x, prog) !== 'dominada');
      if (next) {
        if (best >= 90) return { m: next, titulo: '¡Sigue avanzando!', razon: `¡Excelente! Dominaste «${last.title}» con ${best}. Estás más que listo para la siguiente etapa. 🚀` };
        return { m: next, titulo: 'Tu siguiente etapa', razon: `Dominaste «${last.title}» con ${best}. Puedes avanzar, o repetirla si quieres subir tu nota a 90 o más.` };
      }
      for (let i = 0; i < RUTAS_ORDEN.length; i++) {
        const k = RUTAS_ORDEN[i];
        const otra = rutaEtapas(k).find(x => etapaEstado(x, prog) !== 'dominada');
        if (otra) return { m: otra, titulo: 'Una nueva ruta te espera', razon: `¡Completaste la ${RUTAS[last.ruta].nombre}! 🏆 Es momento de explorar la ${RUTAS[k].nombre}.` };
      }
      return null; // todas las rutas dominadas
    }

    return { m: last, titulo: 'Continúa donde quedaste', razon: `Ya exploraste «${last.title}». Complétala y califica su evaluación para dominar la etapa.` };
  }

  // Sin actividad registrada: usar el diagnóstico más reciente
  const diag = readDiag();
  let mejorRuta = null, mejorT = '';
  Object.keys(diag).forEach(k => {
    if (RUTAS[k] && diag[k] && diag[k].t > mejorT) { mejorT = diag[k].t; mejorRuta = k; }
  });
  if (mejorRuta) {
    const etapas = rutaEtapas(mejorRuta);
    const m = etapas.find(x => x.etapa === diag[mejorRuta].etapa) || etapas[0];
    return { m, titulo: 'Tu punto de partida', razon: `Según tu diagnóstico de la ${RUTAS[mejorRuta].nombre}, este es tu punto de partida ideal.` };
  }
  return { m: null, titulo: '¿Por dónde empiezo?', razon: 'Toca «📍 ¿Dónde empiezo?» en una ruta para hacer un diagnóstico rápido, o comienza por el Punto de partida de la Ruta del Número.' };
}

/* Diagnóstico de entrada: cuestionario corto en un modal, sin tocar las misiones */

let _diagState = null;

function abrirDiagnostico(rutaKey) {
  const r = RUTAS[rutaKey];
  const banco = (typeof DIAGNOSTICOS !== 'undefined' && DIAGNOSTICOS[rutaKey]) || [];
  if (!r || !banco.length) { toast('Diagnóstico no disponible todavía'); return; }
  _diagState = { ruta: rutaKey, idx: 0, errores: [], aciertos: 0 };
  let b = document.getElementById('diag-backdrop');
  if (!b) {
    b = document.createElement('div');
    b.id = 'diag-backdrop';
    b.className = 'diag-backdrop';
    document.body.appendChild(b);
  }
  _diagPintarPregunta();
}
window.abrirDiagnostico = abrirDiagnostico;

function _diagCerrar() {
  const b = document.getElementById('diag-backdrop');
  if (b) b.remove();
  _diagState = null;
}
window._diagCerrar = _diagCerrar;

function _diagPintarPregunta() {
  const st = _diagState;
  const b = document.getElementById('diag-backdrop');
  if (!st || !b) return;
  const banco = DIAGNOSTICOS[st.ruta];
  const r = RUTAS[st.ruta];
  const item = banco[st.idx];
  b.innerHTML = `
    <div class="diag-modal">
      <div class="diag-head">
        <span class="diag-ruta">${r.emoji} ${r.nombre}</span>
        <button class="diag-close" onclick="_diagCerrar()" aria-label="Cerrar">✕</button>
      </div>
      <div class="diag-progress">Pregunta ${st.idx + 1} de ${banco.length}</div>
      <div class="diag-bar"><div class="diag-bar-fill" style="width:${Math.round((st.idx / banco.length) * 100)}%"></div></div>
      <div class="diag-q">${item.q}</div>
      <div class="diag-opts">
        ${item.o.map((op, i) => `<button class="diag-opt" onclick="_diagResponder(${i})">${op}</button>`).join('')}
      </div>
      <p class="diag-nota">Responde tranquilo: esto no es un examen, es una brújula. 🧭</p>
    </div>`;
}

function _diagResponder(i) {
  const st = _diagState;
  if (!st) return;
  const banco = DIAGNOSTICOS[st.ruta];
  const item = banco[st.idx];
  if (i === item.a) st.aciertos++; else st.errores.push(item.etapa);
  st.idx++;
  if (st.idx < banco.length) { _diagPintarPregunta(); return; }
  _diagResultado();
}
window._diagResponder = _diagResponder;

function _diagResultado() {
  const st = _diagState;
  const b = document.getElementById('diag-backdrop');
  if (!st || !b) return;
  const banco  = DIAGNOSTICOS[st.ruta];
  const r      = RUTAS[st.ruta];
  const etapas = rutaEtapas(st.ruta);

  // Primera etapa con error = punto de partida; todo correcto = última etapa
  const etapaSug = st.errores.length ? Math.min.apply(null, st.errores) : rutaMaxEtapa(st.ruta);
  const m = etapas.find(x => x.etapa === etapaSug) || etapas[0];

  const d = readDiag();
  d[st.ruta] = { t: new Date().toISOString(), etapa: m.etapa, aciertos: st.aciertos, total: banco.length };
  saveDiag(d);

  const etiqueta = m.etapa === 0 ? 'Punto de partida' : 'Etapa ' + m.etapa;
  b.innerHTML = `
    <div class="diag-modal">
      <div class="diag-head">
        <span class="diag-ruta">${r.emoji} ${r.nombre}</span>
        <button class="diag-close" onclick="_diagCerrar(); renderRutas();" aria-label="Cerrar">✕</button>
      </div>
      <div class="diag-result">
        <div class="diag-result-emoji">${st.errores.length ? '📍' : '🌟'}</div>
        <div class="diag-result-score">${st.aciertos} de ${banco.length} correctas</div>
        <div class="diag-result-label">Tu punto de partida sugerido:</div>
        <div class="diag-result-etapa">${etiqueta} · ${m.title}</div>
        ${st.errores.length ? '' : '<p class="diag-result-msg">¡Dominas toda la ruta! Confírmalo con la última etapa. 🏆</p>'}
        <button class="diag-go" onclick="_diagCerrar(); visitMission(${m.id});">🚀 Ir a la misión</button>
        <button class="diag-later" onclick="_diagCerrar(); renderRutas();">Verlo en el mapa</button>
      </div>
    </div>`;
}

function renderRutas() {
  const container = document.getElementById('rutas-container');
  if (!container) return;

  const prog = rutasProgress();
  const diag = readDiag();

  // Tarjeta "Tu siguiente paso"
  const sug = sugerenciaSiguiente(prog);
  let pasoHTML;
  if (sug) {
    pasoHTML = `
      <div class="paso-card">
        <div class="paso-label">🧭 Tu siguiente paso</div>
        <div class="paso-title">${sug.titulo}</div>
        <p class="paso-razon">${sug.razon}</p>
        ${sug.m ? `
          <button class="paso-btn" onclick="visitMission(${sug.m.id})">
            <span class="paso-btn-icon">${sug.m.icon}</span>
            <span class="paso-btn-info">
              <span class="paso-btn-ruta">${rutaLabel(sug.m)}</span>
              <span class="paso-btn-title">${sug.m.title}</span>
            </span>
            <i class="fa-solid fa-chevron-right"></i>
          </button>` : ''}
      </div>`;
  } else {
    pasoHTML = `
      <div class="paso-card">
        <div class="paso-label">🧭 Tu siguiente paso</div>
        <div class="paso-title">¡Increíble! Dominaste todas las etapas 🏆</div>
        <p class="paso-razon">Completaste todas las rutas de aprendizaje. Sigue practicando para mantener tus notas de campeón.</p>
      </div>`;
  }

  // Insignias ganadas en todas las rutas
  const ganadas = [];
  RUTAS_ORDEN.forEach(k => insigniasDeRuta(k, prog).forEach(ins => ganadas.push({ r: RUTAS[k], ins })));
  const insigniasHTML = `
    <div class="insignias-strip">
      <div class="insignias-title">🎖️ Tus insignias</div>
      ${ganadas.length
        ? `<div class="insignias-list">${ganadas.map(g =>
            `<span class="ins-chip">${g.ins.icon}<em>${g.r.emoji} ${g.ins.nombre}</em></span>`).join('')}</div>`
        : `<p class="insignias-empty">Domina tu primera etapa con nota de 70 o más y gana la insignia ⭐ En marcha.</p>`}
    </div>`;

  container.innerHTML = pasoHTML + insigniasHTML + RUTAS_ORDEN.map(key => {
    const r      = RUTAS[key];
    const etapas = rutaEtapas(key);
    if (!r || !etapas.length) return '';

    const dominadas = etapas.filter(m => etapaEstado(m, prog) === 'dominada').length;
    const pct       = Math.round((dominadas / etapas.length) * 100);

    const filas = etapas.map((m, i) => {
      const estado = etapaEstado(m, prog);
      const p      = prog[missionFolder(m)];
      const etiquetaEtapa = m.etapa === 0 ? 'Punto de partida' : `Etapa ${m.etapa}`;

      let chip;
      if (estado === 'dominada') {
        chip = `<span class="re-chip ok"><i class="fa-solid fa-check"></i> Dominada · ${p.best}</span>`;
      } else if (estado === 'progreso') {
        chip = `<span class="re-chip prog">En progreso${p && p.best !== null ? ' · Mejor nota ' + p.best : ''}</span>`;
      } else {
        chip = `<span class="re-chip pend">Por explorar · +${m.xp} XP</span>`;
      }

      return `
        <a class="ruta-etapa ${estado}" href="${m.url}"
           onclick="visitMission(${m.id}); return false;">
          <span class="re-rail">
            <span class="re-line ${i === 0 ? 'hide' : ''}"></span>
            <span class="re-nodo ${r.color}">${estado === 'dominada' ? '✔' : m.icon}</span>
            <span class="re-line ${i === etapas.length - 1 ? 'hide' : ''}"></span>
          </span>
          <span class="re-info">
            <span class="re-etapa">${etiquetaEtapa}</span>
            <span class="re-title">${m.title}</span>
            ${chip}
          </span>
          <i class="fa-solid fa-chevron-right re-arrow"></i>
        </a>`;
    }).join('');

    const insRuta   = insigniasDeRuta(key, prog);
    const tieneDiag = typeof DIAGNOSTICOS !== 'undefined' && (DIAGNOSTICOS[key] || []).length;
    const dg        = diag[key];
    const diagRow = tieneDiag ? `
        <div class="ruta-diag-row">
          <button class="ruta-diag-btn" onclick="abrirDiagnostico('${key}')">📍 ${dg ? 'Repetir diagnóstico' : '¿Dónde empiezo?'}</button>
          ${dg ? `<span class="ruta-diag-info">Sugerido: ${dg.etapa === 0 ? 'Punto de partida' : 'Etapa ' + dg.etapa}</span>` : ''}
        </div>` : '';

    return `
      <section class="ruta-card">
        <header class="ruta-head">
          <span class="ruta-emoji">${r.emoji}</span>
          <span class="ruta-head-info">
            <span class="ruta-nombre">${r.nombre}</span>
            <span class="ruta-avance">${dominadas} de ${etapas.length} etapas dominadas</span>
          </span>
          ${insRuta.length ? `<span class="ruta-ins">${insRuta.map(x => x.icon).join('')}</span>` : ''}
          <span class="ruta-pct ${r.color}">${pct}%</span>
        </header>
        <div class="ruta-bar"><div class="ruta-bar-fill ${r.color}" style="width:${pct}%"></div></div>
        ${diagRow}
        <div class="ruta-mapa">${filas}</div>
      </section>`;
  }).join('');
}

/* ─────────────────────────────────────────────
   RENDER — PROGRESS
───────────────────────────────────────────── */

function renderProgress() {
  const s   = load();
  const lv  = getLevel(s.xp);
  const pct = xpPct(s.xp);

  document.getElementById('progress-overview').innerHTML = `
    <div class="progress-overview">
      <div class="po-emoji">${lv.emoji}</div>
      <div class="po-level">Nivel ${lv.n}</div>
      <div class="po-rank">${lv.label}</div>
      <div class="po-xp">${s.xp}</div>
      <div class="po-xp-label">Puntos XP</div>
      <div class="po-bar-wrap">
        <div class="po-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="po-bar-lbls">
        <span>${lv.min} XP</span>
        <span>${lv.n < 5 ? (lv.max + 1) + ' XP' : 'Nivel máx.'}</span>
      </div>
    </div>`;

  // Premios por notas de evaluación (mismas insignias que en Rutas)
  const insEl = document.getElementById('progress-insignias');
  if (insEl) {
    const progR = rutasProgress();
    const ganadas = [];
    RUTAS_ORDEN.forEach(k => insigniasDeRuta(k, progR).forEach(ins => ganadas.push({ r: RUTAS[k], ins })));
    insEl.innerHTML = `
      <div class="insignias-strip">
        <div class="insignias-title">🎖️ Premios por notas de evaluación</div>
        ${ganadas.length
          ? `<div class="insignias-list">${ganadas.map(g =>
              `<span class="ins-chip">${g.ins.icon}<em>${g.r.emoji} ${g.ins.nombre}</em></span>`).join('')}</div>`
          : `<p class="insignias-empty">Domina tu primera etapa con nota de 70 o más y gana la insignia ⭐ En marcha.</p>`}
      </div>`;
  }

  const subjects = [
    { key: 'español',     label: 'Español',     color: 'var(--esp)'  },
    { key: 'matemáticas', label: 'Matemáticas',  color: 'var(--mat)'  },
    { key: 'naturales',   label: 'C. Naturales', color: 'var(--cnat)' },
    { key: 'sociales',    label: 'C. Sociales',  color: 'var(--csoc)' },
  ];

  document.getElementById('progress-subjects').innerHTML = `
    <h2 class="section-title" style="margin-bottom:12px;">Por materia</h2>
    ${subjects.map(sub => {
      const total = MISSIONS.filter(m => m.subject === sub.key).length;
      const done  = MISSIONS.filter(m => m.subject === sub.key && s.visited.includes(m.id)).length;
      const p = total ? Math.round((done / total) * 100) : 0;
      return `
        <div class="sp-item">
          <div class="sp-top">
            <span class="sp-name">${sub.label}</span>
            <span class="sp-cnt">${done} / ${total}</span>
          </div>
          <div class="sp-track">
            <div class="sp-fill" style="width:${p}%; background:${sub.color};"></div>
          </div>
        </div>`;
    }).join('')}`;

  const visitedList = MISSIONS.filter(m => s.visited.includes(m.id));
  document.getElementById('visited-missions').innerHTML = !visitedList.length
    ? `<div class="empty-state" style="margin-top:8px;">
        <div class="empty-icon">🚀</div>
        <h3>¡Empieza tu viaje!</h3>
        <p>Las misiones que visites aparecerán aquí.</p>
       </div>`
    : `<h2 class="section-title" style="margin:20px 0 12px;">
         Visitadas (${visitedList.length})
       </h2>
       <div class="missions-list">
         ${visitedList.map(m => `
           <a class="mission-card visited"
              onclick="visitMission(${m.id}); return false;"
              href="${m.url}">
             <div class="mc-icon ${m.color}">${m.icon}</div>
             <div class="mc-info">
               <div class="mc-title">${m.title}</div>
               <div class="mc-meta">
                 <span class="mc-subj ${m.color}">${SUBJECT_LABELS[m.subject] || m.subject}</span>
                 <span class="mc-grade">${rutaLabel(m)}</span>
                 <span class="mc-done"><i class="fa-solid fa-check"></i> Visitada</span>
               </div>
             </div>
             <i class="fa-solid fa-chevron-right mc-arrow"></i>
           </a>`).join('')}
       </div>`;
}

/* ─────────────────────────────────────────────
   RENDER — PROFILE
───────────────────────────────────────────── */

function renderProfile() {
  // Los elementos de estudiante fueron removidos del perfil; sección solo muestra herramientas del docente
}

/* ─────────────────────────────────────────────
   VISIT MISSION
───────────────────────────────────────────── */

function visitMission(id) {
  const s = load();
  const m = MISSIONS.find(m => m.id === id);
  if (!m) return;

  if (!s.visited.includes(id)) {
    s.xp += m.xp;
    s.visited.push(id);
  }
  s.lastVisited = [id, ...(s.lastVisited || []).filter(x => x !== id)].slice(0, 5);
  save(s);

  window.location.href = m.url;
}

window.visitMission = visitMission;

/* ─────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────── */

let currentFilter = 'all';
let currentQuery  = '';

function switchView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.drawer-item').forEach(b => b.classList.remove('active'));
  const view = document.getElementById(id);
  if (view) view.classList.add('active');
  const item = document.querySelector(`.drawer-item[data-view="${id}"]`);
  if (item) item.classList.add('active');

  if (id === 'view-inicio')   renderHome();
  if (id === 'view-misiones') renderMissions(currentFilter, currentQuery);
  if (id === 'view-rutas')    renderRutas();
  if (id === 'view-progreso') renderProgress();
  if (id === 'view-perfil')   renderProfile();
  if (id === 'view-gobierno')       renderGobiernoEscolar();
  if (id === 'view-plan-accion')    paInit();
  if (id === 'view-parte-mensual')  { /* la UI se recalcula en tiempo real con inputs */ }
  if (id === 'view-collage')        initCollage();
  if (id === 'view-campeonismo' && typeof initCampeonismo === 'function') initCampeonismo();

  const scroll = document.querySelector(`#${id} .view-scroll`);
  if (scroll) scroll.scrollTop = 0;
}

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */

function toast(msg) {
  let el = document.getElementById('meta-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'meta-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(() => { el.style.opacity = '0'; }, 2000);
}

/* ─────────────────────────────────────────────
   INIT
───────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  // Módulos de herramientas — registrar navegación
  if (typeof campRegisterNav === 'function') campRegisterNav();

  // Aplicar tema del país guardado antes de renderizar
  const s0      = load();
  const country0 = s0.country || 'HN';
  _currentCountry = country0;
  applyCountryTheme(country0);

  // Sincronizar selector de país con el estado guardado
  const countryEl = document.getElementById('country-select');
  if (countryEl) countryEl.value = country0;

  // Países en standby: ocultar el bloque de selectores completo.
  // El código de países queda dormido y listo (ver bandera en index.html).
  if (!window.METAS_PAISES_ON) {
    const selWrap = document.getElementById('selectors-container');
    if (selWrap) selWrap.style.display = 'none';
  }

  // Render inicial
  renderHome();

  // Iniciar rotación automática con tiempo adaptado a la lectura
  scheduleNextTick();

  // Si se regresa desde una misión con ?view=misiones&filter=X, ir directamente
  const _urlParams = new URLSearchParams(window.location.search);
  if (_urlParams.get('view') === 'misiones') {
    const _filter = _urlParams.get('filter') || 'all';
    currentFilter = _filter;
    document.querySelectorAll('.pill').forEach(p =>
      p.classList.toggle('active', p.dataset.filter === currentFilter)
    );
    switchView('view-misiones');
  }
  if (_urlParams.get('view') === 'rutas') switchView('view-rutas');

  // Cambio de país
  if (countryEl) {
    countryEl.addEventListener('change', () => {
      const s = load();
      s.country = countryEl.value;
      save(s);
      _currentCountry = s.country;
      _factIdx = 0;
      applyCountryTheme(s.country);
      renderCountryCard(s.country);
      scheduleNextTick();

      // Actualizar chips de materia (Próximamente vs conteo real)
      document.querySelectorAll('.subj-chip').forEach(chip => {
        const em = chip.querySelector('em');
        if (!em) return;
        if (s.country === 'HN') {
          const count = MISSIONS.filter(m => m.subject === chip.dataset.subject).length;
          em.textContent = `${count} misión${count !== 1 ? 'es' : ''}`;
        } else {
          em.textContent = 'Próximamente';
        }
      });

      // Mostrar u ocultar sección Misión destacada
      const featuredSection = document.getElementById('featured-section');
      if (featuredSection) featuredSection.hidden = (s.country !== 'HN');

      const d = COUNTRY_DATA[s.country];
      if (d) toast(`${d.bandera} ¡Explorando ${d.nombre}!`);

      // Quitar foco del select para que el scroll listener no quede bloqueado,
      // y restaurar el header si estaba oculto por el scroll.
      countryEl.blur();
      const header = document.querySelector('#view-inicio .app-header');
      if (header) { header.style.transform = ''; header.style.marginBottom = ''; }
    });
  }

  // Botones prev/next de curiosidades
  const prevBtn = document.getElementById('cc-prev');
  const nextBtn = document.getElementById('cc-next');
  if (prevBtn) prevBtn.addEventListener('click', prevFact);
  if (nextBtn) nextBtn.addEventListener('click', nextFact);

  // Swipe táctil en la tarjeta de curiosidades
  const swipeArea = document.getElementById('cc-swipe-area');
  if (swipeArea) {
    let touchX = 0, touchY = 0;
    swipeArea.addEventListener('touchstart', e => {
      touchX = e.touches[0].clientX;
      touchY = e.touches[0].clientY;
    }, { passive: true });
    swipeArea.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchX;
      const dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 38) {
        dx < 0 ? nextFact() : prevFact();
      }
    }, { passive: true });
  }

  // ── Drawer / Hamburguesa ──
  function openDrawer() {
    document.getElementById('app-drawer').classList.add('open');
    document.getElementById('drawer-overlay').classList.add('open');
  }
  function closeDrawer() {
    document.getElementById('app-drawer').classList.remove('open');
    document.getElementById('drawer-overlay').classList.remove('open');
  }

  document.querySelectorAll('.hamburger-btn').forEach(btn => {
    btn.addEventListener('click', openDrawer);
  });
  document.getElementById('drawer-close-btn')?.addEventListener('click', closeDrawer);
  document.getElementById('drawer-overlay')?.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-item').forEach(item => {
    item.addEventListener('click', () => {
      switchView(item.dataset.view);
      closeDrawer();
    });
  });

  // Rejilla «¿Qué quieres hacer hoy?» → vista correspondiente
  document.querySelectorAll('.home-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // Chips de materias → misiones filtradas
  document.querySelectorAll('.subj-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      currentFilter = chip.dataset.subject;
      currentQuery  = '';

      document.querySelectorAll('.pill').forEach(p =>
        p.classList.toggle('active', p.dataset.filter === currentFilter)
      );

      const si = document.getElementById('search-input');
      if (si) si.value = '';

      switchView('view-misiones');
    });
  });

  // Búsqueda
  const searchEl = document.getElementById('search-input');
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      currentQuery = searchEl.value;
      renderMissions(currentFilter, currentQuery);
    });
  }

  // Pills de filtro
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderMissions(currentFilter, currentQuery);
    });
  });

  // Botón 🏅 Premios: abre Rutas y muestra la tira de insignias
  document.getElementById('notif-btn').addEventListener('click', () => {
    switchView('view-rutas');
    const strip = document.querySelector('#view-rutas .insignias-strip');
    if (strip) strip.scrollIntoView({ block: 'start', behavior: 'smooth' });
  });

  // ── Header oculto al hacer scroll ──
  // Ocultar/mostrar el header cambia la altura del contenedor de scroll, y el
  // navegador re-ajusta scrollTop (clamp) cerca del límite inferior. Esos
  // deltas artificiales retro-alimentaban el acumulador y el header entraba
  // en un bucle ocultar/mostrar (temblor). Por eso: no ocultar en la zona
  // final del scroll y descartar los deltas mientras la animación se asienta.
  document.querySelectorAll('.view-scroll').forEach(scroll => {
    let lastY = 0;
    let accumulated = 0;
    let ticking = false;
    let settleUntil = 0;
    const HIDE_THRESHOLD = 22;
    const SETTLE_MS = 380; // transición del header (280ms) + margen

    scroll.addEventListener('scroll', () => {
      if (ticking) return;
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT')) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const header = scroll.closest('.view') && scroll.closest('.view').querySelector('.app-header');
        // Solo ocultar header en vistas principales (hamburguesa), nunca en vistas secundarias (botón atrás)
        if (!header || !header.querySelector('.hamburger-btn')) return;
        const h = header.offsetHeight;
        const maxScroll = Math.max(0, scroll.scrollHeight - scroll.clientHeight);
        // Clamp en ambos extremos: el rebote (overscroll) genera valores fuera de rango
        const y = Math.min(Math.max(0, scroll.scrollTop), maxScroll);

        if (y <= 4) {
          header.style.transform = '';
          header.style.marginBottom = '';
          lastY = 0; accumulated = 0;
          return;
        }

        const delta = y - lastY;
        lastY = y;

        if (performance.now() < settleUntil) { accumulated = 0; return; }

        accumulated += delta;

        if (accumulated > HIDE_THRESHOLD && y > 56 && maxScroll - y > h + HIDE_THRESHOLD) {
          header.style.transform = `translateY(-${h}px)`;
          header.style.marginBottom = `-${h}px`;
          accumulated = 0;
          settleUntil = performance.now() + SETTLE_MS;
        } else if (accumulated < -HIDE_THRESHOLD) {
          header.style.transform = '';
          header.style.marginBottom = '';
          accumulated = 0;
          settleUntil = performance.now() + SETTLE_MS;
        }
      });
    }, { passive: true });
  });

});
