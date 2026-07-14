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

  // «Tu siguiente paso» directo en la portada (guiado por notas).
  // Sin actividad ni diagnóstico aún: se oculta y manda la Misión destacada.
  const pasoEl = document.getElementById('home-paso');
  if (pasoEl) {
    const rd = _rutasDatos();
    pasoEl.innerHTML = (rd.sug && !rd.sug.m) ? '' : pasoCardHTML(rd.sug, true);
  }

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
  _rdCache = null; // el diagnóstico cambió: invalidar la caché de rutas
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

/* ── Datos de rutas con caché por sesión ──
   rutasProgress() + sugerenciaSiguiente() recorren TODO el registro; en
   teléfonos de gama baja con años de eventos eso pesa. Se recalcula solo
   si el registro o el diagnóstico cambiaron (firma por longitud). */
let _rdCache = null;

function _rutasDatos() {
  let firma = '';
  try {
    firma = ((localStorage.getItem(REGISTRO_KEY) || '').length) + ':' +
            ((localStorage.getItem(DIAG_KEY) || '').length);
  } catch (_) {}
  if (_rdCache && _rdCache.firma === firma) return _rdCache;
  const prog = rutasProgress();
  _rdCache = { firma, prog, sug: sugerenciaSiguiente(prog) };
  return _rdCache;
}

/* Tarjeta «Tu siguiente paso» reutilizable (Rutas y portada).
   sug === null significa: todas las rutas dominadas. */
function pasoCardHTML(sug, enPortada) {
  if (!sug) {
    return `
      <div class="paso-card">
        <div class="paso-label">🧭 Tu siguiente paso</div>
        <div class="paso-title">¡Increíble! Dominaste todas las etapas 🏆</div>
        <p class="paso-razon">Completaste todas las rutas de aprendizaje. Sigue practicando para mantener tus notas de campeón.</p>
      </div>`;
  }
  return `
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
      ${enPortada ? `<p class="paso-nota">Sugerido según lo trabajado en este dispositivo.</p>` : ''}
    </div>`;
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

  const { prog, sug } = _rutasDatos();
  const diag = readDiag();

  // Tarjeta "Tu siguiente paso" (la misma tarjeta que en la portada)
  const pasoHTML = pasoCardHTML(sug, false);

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
   RENDER — VISTA PADRE (Fase 2)
   Resumen para madres y padres, todo guiado por NOTAS (el XP es
   decoración lúdica): semana, notas registradas por el maestro en
   el Plan de Acción (METAS_PLANACCION_V1), siguiente paso, consejo
   del día y asistente/consulta con clave de familia (METAS_PADRE_V1).
   Sin WhatsApp al maestro: el asistente responde para no interrumpirlo.
───────────────────────────────────────────── */

const PADRE_KEY = 'METAS_PADRE_V1';

function _padreCfg() {
  try { const o = JSON.parse(localStorage.getItem(PADRE_KEY)); return (o && typeof o === 'object') ? o : {}; }
  catch (_) { return {}; }
}
function _padreSaveCfg(c) { try { localStorage.setItem(PADRE_KEY, JSON.stringify(c)); } catch (_) {} }

function _alumnoIdent() {
  try { const o = JSON.parse(localStorage.getItem('METAS_ALUMNO_V1')); return (o && typeof o === 'object') ? o : {}; }
  catch (_) { return {}; }
}

function _pEsc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* Sección del alumno: letra final de textos como «6to A», «6-B» o «B» */
function _padreSeccion(txt) {
  const m = String(txt || '').trim().match(/([a-fA-F])$/);
  return m ? m[1].toUpperCase() : '';
}

/* Notas del alumno registradas por el maestro en el Plan de Acción.
   El cruce exacto es Nº de lista + grado + sección (el 4A nunca se
   mezcla con el 4B); el nombre normalizado y el código «#num» siguen
   valiendo como identificación directa. */
function _padreNotasPA(ident) {
  let pa = null;
  try { pa = JSON.parse(localStorage.getItem('METAS_PLANACCION_V1')); } catch (_) {}
  if (!pa || !Array.isArray(pa.analisis)) return [];
  const num  = String(ident.num || '').replace(/\D/g, '');
  const nomN = _rNorm(ident.nombre || '');
  const gradoAl = String(ident.grado || '').replace(/\D/g, '');
  const secAl   = _padreSeccion(ident.grado); // el modal guarda «Grado y sección» juntos
  const filas = [];
  pa.analisis.slice().reverse().forEach(a => {
    const gradoPA = String(a.grado || '').replace(/\D/g, '');
    const secPA   = _padreSeccion(a.seccion);
    // Solo se exige coincidencia cuando ambos lados tienen sección con letra
    const okSec   = !secAl || !secPA || secAl === secPA;
    (a.students || []).forEach(st => {
      const okNombre = nomN && _rNorm(st.nombre || '') === nomN;
      const okCodigo = num && String(st.nombre || '').trim() === ('#' + num) &&
                       (!gradoAl || !gradoPA || gradoAl === gradoPA) && okSec;
      const okNum = num && String(st.num || '').replace(/\D/g, '') === num &&
                    (!gradoAl || !gradoPA || gradoAl === gradoPA) && okSec;
      if (okNombre || okCodigo || okNum) filas.push({ a, st });
    });
  });
  return filas;
}

function renderPadre() {
  const cont = document.getElementById('padre-content');
  if (!cont) return;

  const ident  = _alumnoIdent();
  const s      = load();
  const nombre = String(ident.nombre || s.name || '').trim();
  const quien  = nombre ? _pEsc(nombre) : 'su hijo o hija';

  /* ── Resumen de la semana (últimos 7 días de METAS_REGISTRO_V1) ── */
  const hace7  = Date.now() - 7 * 86400000;
  const misSem = new Set();
  let mejor = null;
  readRegistro().forEach(ev => {
    if (!ev || !ev.mision) return;
    if (nombre && ev.alumno && ev.alumno !== nombre) return; // dispositivo compartido
    const t = Date.parse(ev.t || '') || 0;
    if (t < hace7) return;
    misSem.add(_rNorm(ev.mision));
    if ((ev.tipo === 'evaluacion' || ev.tipo === 'prueba_operativa') && typeof ev.nota === 'number') {
      const base = (typeof ev.base === 'number' && ev.base > 0) ? ev.base : 100;
      const pct  = Math.round((ev.nota / base) * 100);
      if (!mejor || pct > mejor.pct) mejor = { pct, mision: ev.mision };
    }
  });
  let mejorTitulo = '';
  if (mejor) {
    const m = MISSIONS.find(x => missionFolder(x) === _rNorm(mejor.mision));
    mejorTitulo = m ? m.title : mejor.mision;
  }
  const semanaHTML = `
    <div class="padre-sec">
      <div class="padre-sec-title">📈 Esta semana</div>
      ${misSem.size
        ? `<p class="padre-big">${quien} trabajó en <strong>${misSem.size} misión${misSem.size !== 1 ? 'es' : ''}</strong>${mejor
            ? ` y su mejor nota fue <strong>${mejor.pct}</strong> en «${_pEsc(mejorTitulo)}»${mejor.pct >= 70 ? ' ✔' : ''}` : ''}.</p>`
        : `<p class="padre-big">Esta semana aún no hay actividad registrada en este teléfono. Anime a ${quien} a entrar a su siguiente misión. 💪</p>`}
    </div>`;

  /* ── Notas que registró el maestro (Plan de Acción) ── */
  const filasPA = _padreNotasPA(ident);
  const paHTML = filasPA.length ? `
    <div class="padre-sec">
      <div class="padre-sec-title">📝 Notas registradas por el maestro</div>
      ${filasPA.slice(0, 4).map(({ a, st }) => {
        const f = a.fechaPrueba
          ? '📅 Prueba: ' + String(a.fechaPrueba).slice(0, 10).split('-').reverse().join('/')
          : (a.t || '').slice(0, 10);
        const esNSP = st.nota === 'NSP';
        const aprobo = !esNSP && typeof st.nota === 'number' && st.nota >= 70;
        const formaTxt = (a.forma && !String(a.evaluacion || '').includes('Forma'))
          ? ' · Forma ' + _pEsc(a.forma) : '';
        const parcialTxt = a.parcial ? ' · Parcial ' + _pEsc(a.parcial) : '';
        return `
        <div class="padre-nota">
          <div class="padre-nota-top">
            <strong>${_pEsc(a.evaluacion || 'Evaluación')}</strong>
            <span class="padre-nota-val ${aprobo ? 'ok' : 'baja'}">${esNSP ? 'NSP' : _pEsc(st.nota) + '/100'}</span>
          </div>
          <div class="padre-nota-meta">${_pEsc(st.categoria || '')}${parcialTxt}${formaTxt}${f ? ' · ' + f : ''}</div>
        </div>`;
      }).join('')}
      ${filasPA[0].st.msg ? `<div class="padre-msg">💬 <em>Mensaje del maestro:</em><br>${_pEsc(filasPA[0].st.msg)}</div>` : ''}
    </div>` : '';

  /* ── Qué le toca ahora (misma tarjeta guiada por notas) ── */
  const rd = _rutasDatos();
  const pasoHTML = (rd.sug && !rd.sug.m) ? '' : pasoCardHTML(rd.sug, false);

  /* ── Consejo del día ── */
  let consejoHTML = '';
  if (typeof CONSEJOS_PADRES !== 'undefined' && CONSEJOS_PADRES.length) {
    const dia = Math.floor(Date.now() / 86400000) % CONSEJOS_PADRES.length;
    consejoHTML = `
      <div class="padre-sec padre-consejo">
        <div class="padre-sec-title">💡 Consejo de hoy para apoyar en casa</div>
        <p class="padre-big">${CONSEJOS_PADRES[dia]}</p>
      </div>`;
  }

  /* ── Consulta en la nube con la clave de la familia (desde cualquier lugar) ── */
  const codigoIni = String(_padreCfg().codigo || '');
  const nubeHTML = `
    <div class="padre-sec padre-nube">
      <div class="padre-sec-title">🔑 Notas desde cualquier lugar</div>
      <p class="padre-hint">Escriba la <strong>clave de la familia</strong> que le entregó el maestro
        (empieza con el número de lista, ej. <strong>15-K7QM</strong>). Es secreta: solo su familia la conoce.</p>
      <div class="padre-tel-row">
        <input id="padre-codigo" class="pa-inp-field padre-codigo-inp" maxlength="12"
               autocomplete="off" autocapitalize="characters" placeholder="ej: 15-K7QM" value="${_pEsc(codigoIni)}">
        <button class="padre-wa-btn" onclick="padreConsultarNube()">Consultar</button>
      </div>
      <div id="padre-nube-out"></div>
      <a class="padre-wa-btn padre-asistente-btn" href="padres.html">🤖 Abrir el asistente de padres</a>
      <p class="padre-hint padre-asistente-hint">El asistente responde preguntas como
        «¿cómo va?», «¿qué sacó?» y «¿cómo lo ayudo en casa?» con la misma clave.</p>
    </div>`;

  const avisoHTML = `
    <p class="padre-aviso">⚠️ El resumen de arriba vive en el teléfono donde ${quien} estudia y practica.
      Las notas con la <strong>clave de la familia</strong> sí se ven desde cualquier equipo con internet.</p>`;

  cont.innerHTML =
    (nombre ? `<h2 class="padre-titulo">El avance de ${_pEsc(nombre)}</h2>` : '') +
    semanaHTML + paHTML + nubeHTML + pasoHTML + consejoHTML + avisoHTML;
}

function _padreSbCfg() {
  let url = 'https://uljjgrikyigdrkbikcxo.supabase.co';
  let key = 'sb_publishable_VGj7He4XL8AGscsY3RsxGg__xlzi48w';
  try {
    url = localStorage.getItem('METAS_SB_URL') || url;
    key = localStorage.getItem('METAS_SB_KEY') || key;
  } catch (_) {}
  return { url, key };
}

async function padreConsultarNube() {
  const inp = document.getElementById('padre-codigo');
  const out = document.getElementById('padre-nube-out');
  if (!inp || !out) return;
  // La clave se escribe con o sin guion/espacios: 15-K7QM = 15K7QM
  const codigo = String(inp.value || '').replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (codigo.length < 4) { toast('Escriba la clave completa (ej. 15-K7QM)'); return; }
  const c = _padreCfg(); c.codigo = codigo; _padreSaveCfg(c);
  if (navigator.onLine === false) {
    out.innerHTML = '<p class="padre-hint">📴 La consulta necesita internet. Intente cuando tenga conexión.</p>';
    return;
  }
  out.innerHTML = '<p class="padre-hint">⏳ Consultando la nube…</p>';
  try {
    const { url, key } = _padreSbCfg();
    const r = await fetch(url + '/rest/v1/rpc/metas_consultar_plan_padre', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_codigo: codigo }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    let rows = await r.json();
    if (!Array.isArray(rows)) rows = [];
    if (!rows.length) {
      out.innerHTML = `<p class="padre-hint">Aún no hay notas para el código <strong>${_pEsc(codigo)}</strong>.
        Verifique el código con el maestro, o espere a que él suba las notas.</p>`;
      return;
    }
    out.innerHTML = rows.slice(0, 8).map(row => {
      const esNSP = !!row.nsp;
      const nota = esNSP ? 'NSP' : (row.nota == null ? '—' : row.nota + '/' + (row.base || 100));
      const aprobo = !esNSP && typeof row.nota === 'number' && row.nota >= 70;
      const formaTxt = (row.forma && !String(row.evaluacion || '').includes('Forma'))
        ? ' · Forma ' + _pEsc(row.forma) : '';
      const parcialTxt = row.parcial ? ' · Parcial ' + _pEsc(row.parcial) : '';
      const f = row.fecha_prueba
        ? '📅 Prueba: ' + String(row.fecha_prueba).slice(0, 10).split('-').reverse().join('/')
        : String(row.fecha || '').slice(0, 10);
      return `
        <div class="padre-nota">
          <div class="padre-nota-top">
            <strong>${_pEsc(row.evaluacion || 'Evaluación')}</strong>
            <span class="padre-nota-val ${aprobo ? 'ok' : 'baja'}">${nota}</span>
          </div>
          <div class="padre-nota-meta">${_pEsc(row.categoria || '')}${parcialTxt}${formaTxt}${f ? ' · ' + f : ''}${row.docente ? ' · ' + _pEsc(row.docente) : ''}</div>
        </div>`;
    }).join('') +
    (rows[0].mensaje ? `<div class="padre-msg">💬 <em>Mensaje del maestro:</em><br>${_pEsc(rows[0].mensaje)}</div>` : '');
  } catch (_) {
    out.innerHTML = '<p class="padre-hint">⚠️ No se pudo consultar en este momento. Intente de nuevo en unos minutos.</p>';
  }
}
window.padreConsultarNube = padreConsultarNube;

/* ─────────────────────────────────────────────
   RENDER — PROFILE
───────────────────────────────────────────── */

/* ── Acceso del maestro (Zona Docente) ──
   El maestro crea su cuenta con su nombre completo, su correo y una
   contraseña que él elige. El código técnico lo genera EL SERVIDOR y
   nunca se muestra en la pantalla: los alumnos solo escriben el NOMBRE
   del maestro en el campo «Docente» de las misiones.
   Guardado en METAS_DOCENTE_V1 {codigo, clave, nombre, correo, …}. */

const DOCENTE_KEY = 'METAS_DOCENTE_V1';

function _docenteCfg() {
  try { const o = JSON.parse(localStorage.getItem(DOCENTE_KEY)); return (o && typeof o === 'object') ? o : {}; }
  catch (_) { return {}; }
}
function _docenteSave(c) { try { localStorage.setItem(DOCENTE_KEY, JSON.stringify(c)); } catch (_) {} }

function docenteMostrarRecuperar() {
  const f = document.getElementById('doc-recuperar-form');
  if (f) f.style.display = f.style.display === 'none' ? '' : 'none';
}

async function docenteRecuperar() {
  const correo = (document.getElementById('doc-rec-correo')?.value || '').trim().toLowerCase();
  const clave  = (document.getElementById('doc-rec-clave')?.value || '');
  if (!correo.includes('@')) { toast('Escribe el correo con que te registraste'); return; }
  if (!clave) { toast('Escribe tu contraseña'); return; }
  if (navigator.onLine === false) { toast('📴 Entrar necesita internet'); return; }
  toast('⏳ Verificando…');
  const { url, key } = _padreSbCfg();
  try {
    const r = await fetch(url + '/rest/v1/rpc/metas_entrar_docente_v2', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_correo: correo, p_clave: clave }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const resp = await r.json();
    if (resp && resp.ok && resp.codigo) {
      _docenteSave({ codigo: resp.codigo, clave, nombre: resp.nombre || '', correo, t: new Date().toISOString() });
      renderProfile();
      toast('✅ ¡Bienvenido de vuelta, ' + String(resp.nombre || 'colega').split(' ')[0] + '!');
    } else if (resp && resp.motivo === 'espera') {
      await metasAlert('Demasiados intentos. Por seguridad espera 10 minutos y vuelve a intentar.',
        { icono: '⏳', titulo: 'Zona Docente' });
    } else {
      toast('Correo o contraseña incorrectos');
    }
  } catch (_) {
    toast('⚠️ No se pudo conectar. Intenta de nuevo en un momento.');
  }
}

function renderProfile() {
  const cont = document.getElementById('docente-acceso');
  if (!cont) return;
  const d = _docenteCfg();

  // Las herramientas del aula solo existen para el maestro registrado:
  // sin sesión no se muestran (el alumno no tiene la cuenta del maestro).
  const _tg = document.getElementById('teacher-tools-group');
  if (_tg) _tg.style.display = d.codigo ? '' : 'none';

  if (!d.codigo) {
    // Visitante: formulario de suscripción
    cont.innerHTML = `
      <div class="setting-group teacher-panel-group">
        <div class="teacher-panel-head">
          <i class="fa-solid fa-user-plus teacher-panel-icon"></i>
          <label class="setting-label" style="margin-bottom:0;">¿Eres maestro o maestra?</label>
        </div>
        <p class="teacher-panel-desc">Crea tu cuenta gratis. Tus alumnos escribirán tu
          <strong>nombre</strong> al empezar una misión y su avance llegará solo a tu cuenta.</p>
        <input id="doc-nombre" class="pa-inp-field" maxlength="60" autocomplete="name"
               placeholder="Nombre completo *" style="margin-bottom:4px;">
        <p class="doc-campo-hint">Nombre y apellidos — tus alumnos lo escribirán para que te llegue su avance.</p>
        <input id="doc-correo" class="pa-inp-field" maxlength="100" autocomplete="email" type="email"
               placeholder="Correo electrónico *" style="margin-bottom:8px;">
        <input id="doc-clave" class="pa-inp-field" maxlength="40" autocomplete="new-password" type="password"
               placeholder="Elige una contraseña fácil de recordar *" style="margin-bottom:8px;">
        <input id="doc-escuela" class="pa-inp-field" maxlength="120" autocomplete="off"
               placeholder="Nombre de tu escuela" style="margin-bottom:8px;">
        <div style="display:flex;gap:8px;margin-bottom:8px;">
          <button id="doc-tipo-pub" class="doc-tipo-btn doc-tipo-sel" onclick="docenteTipo('Pública')">🏫 Pública</button>
          <button id="doc-tipo-pri" class="doc-tipo-btn" onclick="docenteTipo('Privada')">🏛 Privada</button>
        </div>
        <select id="doc-departamento" class="pa-inp-field" style="margin-bottom:8px;">
          <option value="">Departamento</option>
          <option>Atlántida</option><option>Choluteca</option><option>Colón</option>
          <option>Comayagua</option><option>Copán</option><option>Cortés</option>
          <option>El Paraíso</option><option>Francisco Morazán</option><option>Gracias a Dios</option>
          <option>Intibucá</option><option>Islas de la Bahía</option><option>La Paz</option>
          <option>Lempira</option><option>Ocotepeque</option><option>Olancho</option>
          <option>Santa Bárbara</option><option>Valle</option><option>Yoro</option>
        </select>
        <input id="doc-municipio" class="pa-inp-field" maxlength="80" autocomplete="off"
               placeholder="Municipio" style="margin-bottom:8px;">
        <input id="doc-lugar" class="pa-inp-field" maxlength="200" autocomplete="off"
               placeholder="Lugar / dirección o referencia de la escuela" style="margin-bottom:8px;">
        <input id="doc-telefono" class="pa-inp-field" maxlength="40" autocomplete="tel" type="tel"
               placeholder="Teléfono / WhatsApp (opcional)" style="margin-bottom:12px;">
        <button class="padre-wa-btn doc-btn-brand" onclick="docenteSuscribir()">🎓 Crear mi cuenta gratis</button>
        <p class="padre-hint" style="margin-top:8px;">Solo este paso necesita internet.
          <a href="panel-docente.html" class="doc-admin-link">¿Administrador del proyecto?</a></p>
        <div style="margin-top:10px;text-align:center;">
          <button class="doc-ver-btn" onclick="docenteMostrarRecuperar()" style="font-size:0.82rem;padding:6px 12px;">
            🔑 ¿Ya tienes cuenta? Entrar
          </button>
        </div>
        <div id="doc-recuperar-form" style="display:none;margin-top:10px;border-top:1px solid #e0e0e0;padding-top:12px;">
          <p style="font-size:0.8rem;color:#555;margin:0 0 10px;">Entra con tu correo y tu contraseña:</p>
          <label style="font-size:0.72rem;font-weight:700;color:#666;display:block;margin-bottom:3px;">📧 TU CORREO</label>
          <input id="doc-rec-correo" class="pa-inp-field" maxlength="100" autocomplete="email" type="email"
                 placeholder="El correo con que te registraste" style="margin-bottom:10px;">
          <label style="font-size:0.72rem;font-weight:700;color:#666;display:block;margin-bottom:3px;">🔒 TU CONTRASEÑA</label>
          <input id="doc-rec-clave" class="pa-inp-field" type="password" maxlength="40" autocomplete="current-password"
                 placeholder="La contraseña que elegiste" style="margin-bottom:14px;">
          <button class="padre-wa-btn" onclick="docenteRecuperar()">🔓 Entrar</button>
          <button class="padre-wa-cambiar" onclick="docenteOlvide()">🆘 ¿Olvidaste tu contraseña?</button>
        </div>
      </div>`;
    return;
  }

  // Maestro con sesión: saludo, aviso del nombre y SU botón principal
  const primerNombre = String(d.nombre || '').trim().split(/\s+/)[0] || 'colega';
  cont.innerHTML = `
    <div class="setting-group teacher-panel-group">
      <div class="doc-saludo">
        <div class="doc-saludo-hola">👋 ¡Hola, ${_pEsc(primerNombre)}!</div>
        <div class="doc-saludo-sub">${_pEsc(d.nombre || '')}${d.escuela ? ' · ' + _pEsc(d.escuela) : ''}</div>
      </div>
      <div class="doc-aviso-alumnos">📣 Dile a tus alumnos que escriban tu nombre —
        <strong>${_pEsc(d.nombre || '')}</strong> — en el campo «Docente» al empezar una misión.
        Así su avance llega solo a tu cuenta.</div>
      <a class="doc-avance-btn" href="consulta-nube.html">📊 Ver el avance de mis alumnos</a>
      <a class="doc-offline-link" href="registro.html">📴 ¿Sin internet? Mira lo trabajado en este equipo</a>
      <div class="doc-sync-box">
        <div class="doc-sync-title">🔄 Tus datos, iguales en todos tus equipos</div>
        <div class="doc-sync-status" id="doc-sync-status">☁️ Revisando la nube del aula…</div>
        <p class="doc-sync-hint">Si un equipo tiene datos viejos o de prueba, usa estos botones una vez:</p>
        <div class="doc-sync-btns">
          <button class="doc-sync-btn" onclick="dsForcePush()">⬆️ Subir lo de este equipo</button>
          <button class="doc-sync-btn" onclick="dsForcePull()">⬇️ Traer lo de la nube</button>
        </div>
      </div>
      <button class="padre-wa-cambiar" onclick="docenteCambiarClave()">✏️ Cambiar mi contraseña</button>
      <button class="padre-wa-cambiar" style="color:#c0392b;margin-top:6px;" onclick="docenteCerrarSesion()">🚪 Cerrar sesión</button>
    </div>`;
  if (typeof dsOnProfile === 'function') dsOnProfile();
}

let _docTipo = 'Pública';
function docenteTipo(t) {
  _docTipo = t;
  document.getElementById('doc-tipo-pub')?.classList.toggle('doc-tipo-sel', t === 'Pública');
  document.getElementById('doc-tipo-pri')?.classList.toggle('doc-tipo-sel', t === 'Privada');
}

async function docenteSuscribir() {
  const nombre        = (document.getElementById('doc-nombre')?.value || '').trim().replace(/\s+/g, ' ');
  const correo        = (document.getElementById('doc-correo')?.value || '').trim().toLowerCase();
  const clave         = (document.getElementById('doc-clave')?.value || '');
  const escuela       = (document.getElementById('doc-escuela')?.value || '').trim();
  const telefono      = (document.getElementById('doc-telefono')?.value || '').trim();
  const departamento  = (document.getElementById('doc-departamento')?.value || '').trim();
  const municipio     = (document.getElementById('doc-municipio')?.value || '').trim();
  const lugar         = (document.getElementById('doc-lugar')?.value || '').trim();
  if (nombre.split(' ').length < 2) { toast('Escribe tu nombre y al menos un apellido'); return; }
  if (!correo.includes('@') || correo.length < 5) { toast('Escribe un correo válido — con él entrarás a tu cuenta'); return; }
  if (clave.length < 6) { toast('La contraseña debe tener al menos 6 letras o números'); return; }
  if (navigator.onLine === false) { toast('📴 Crear la cuenta necesita internet (solo esta vez)'); return; }
  toast('⏳ Creando tu cuenta…');
  const { url, key } = _padreSbCfg();
  try {
    // El código técnico del docente lo genera el servidor (nunca se muestra)
    const r = await fetch(url + '/rest/v1/rpc/metas_docente_alta_v2', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_nombre: nombre, p_correo: correo, p_clave: clave,
        p_escuela: escuela, p_tipo: _docTipo, p_telefono: telefono,
        p_departamento: departamento, p_municipio: municipio, p_lugar: lugar }),
    });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const resp = await r.json();
    if (resp && resp.ok && resp.codigo) {
      _docenteSave({ codigo: resp.codigo, clave, nombre, correo, escuela, tipo: _docTipo, telefono,
        departamento, municipio, lugar, t: new Date().toISOString() });
      renderProfile();
      toast('🎉 ¡Bienvenido, ' + nombre.split(' ')[0] + '! Tu cuenta está lista');
      return;
    }
    const motivo = resp && resp.motivo;
    if (motivo === 'nombre') {
      await metasAlert('Ya hay un maestro registrado con ese nombre. Agrega tu segundo apellido para diferenciarte (ej.: Josué Polanco Lemus).',
        { icono: '👤', titulo: 'Zona Docente' });
    } else if (motivo === 'correo') {
      toast('Ese correo ya tiene cuenta — usa «¿Ya tienes cuenta? Entrar»');
    } else if (motivo === 'nombre_corto') {
      toast('Escribe tu nombre y apellidos completos');
    } else if (motivo === 'correo_malo') {
      toast('Revisa el correo: parece incompleto');
    } else if (motivo === 'clave_corta') {
      toast('La contraseña debe tener al menos 6 letras o números');
    } else {
      toast('⚠️ No se pudo crear la cuenta. Intenta de nuevo.');
    }
  } catch (_) {
    toast('⚠️ No se pudo conectar. Intenta de nuevo en un momento.');
  }
}
window.docenteSuscribir = docenteSuscribir;

/* ── ¿Olvidaste tu contraseña? ──
   Camino 1 (autoservicio): cualquier equipo con la sesión abierta puede
   ponerte contraseña nueva sin la anterior (docenteCambiarClave).
   Camino 2: WhatsApp del proyecto — el administrador verifica tus datos
   registrados (nombre, escuela, teléfono) y te la restablece. */
const DOC_SOPORTE_WA = '';   /* nº WhatsApp de soporte, ej. '50499999999' (vacío = solo camino 1) */

async function docenteOlvide() {
  const correo = (document.getElementById('doc-rec-correo')?.value || '').trim();
  const msj = '💡 **¿Tienes otro equipo con tu sesión abierta?** (tu PC o tu teléfono donde la Zona Docente ya te saluda)\n\n' +
    'Entra ahí y toca «✏️ Cambiar mi contraseña»: te deja poner una nueva SIN saber la anterior. Es el camino más rápido.\n\n' +
    (DOC_SOPORTE_WA
      ? '🆘 **¿No tienes ninguno?** Escríbenos por WhatsApp: verificamos tus datos registrados y te la restablecemos.'
      : '🆘 **¿No tienes ninguno?** Escríbele al administrador del proyecto (quien te invitó a M.E.T.A.S): verifica tus datos registrados y te la restablece.');
  if (!DOC_SOPORTE_WA) {
    await metasAlert(msj, { icono: '🆘', titulo: 'Recuperar contraseña' });
    return;
  }
  const ir = await metasConfirm(msj, {
    icono: '🆘', titulo: 'Recuperar contraseña',
    okTxt: '💬 Escribir por WhatsApp', cancelTxt: 'Entendido',
  });
  if (!ir) return;
  const txt = 'Hola 👋 Olvidé la contraseña de mi cuenta de maestro en M.E.T.A.S.\n' +
    (correo ? '📧 Mi correo registrado: ' + correo + '\n' : '📧 Mi correo registrado: \n') +
    '👤 Mi nombre completo: \n🏫 Mi escuela: \n📱 Mi teléfono registrado: ';
  window.open('https://wa.me/' + DOC_SOPORTE_WA + '?text=' + encodeURIComponent(txt), '_blank');
}
window.docenteOlvide = docenteOlvide;

function docenteCerrarSesion() {
  _docenteSave(null);
  try { localStorage.removeItem(DOCENTE_KEY); } catch (_) {}
  renderProfile();
  toast('Sesión cerrada');
}
window.docenteCerrarSesion = docenteCerrarSesion;

/* Cambiar contraseña SIN pedir la actual: este equipo ya tiene la sesión
   del maestro (la cuenta guardada conoce su contraseña), así que también
   sirve de RESCATE cuando la olvidó — basta un equipo con sesión abierta. */
async function docenteCambiarClave() {
  const d = _docenteCfg();
  if (!d.codigo) return;
  if (navigator.onLine === false) { toast('📴 Cambiar la contraseña necesita internet'); return; }
  const nueva = await metasPrompt('Escribe tu contraseña **nueva** (mínimo 6 letras o números).\nNo necesitas la anterior: este equipo ya tiene tu sesión.', {
    icono: '✏️', titulo: 'Zona Docente', type: 'password', okTxt: 'Siguiente',
    valida: v => String(v).trim().length >= 6 ? '' : 'Muy corta: usa al menos 6 letras o números.',
  });
  if (nueva === null) return;
  const np = String(nueva).trim();
  const conf = await metasPrompt('Escríbela otra vez para confirmar.\nGuárdala bien: con ella entrarás en todos tus equipos.', {
    icono: '✏️', titulo: 'Zona Docente', type: 'password', okTxt: 'Cambiar contraseña',
    valida: v => String(v).trim() === np ? '' : 'No coincide con la primera — revísala.',
  });
  if (conf === null) return;
  try {
    const { url, key } = _padreSbCfg();
    const r = await fetch(url + '/rest/v1/rpc/metas_cambiar_clave_docente', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_codigo: d.codigo, p_actual: d.clave || '', p_nueva: np }),
    });
    const ok = r.ok ? await r.json() : false;
    if (ok === true) {
      d.clave = np; _docenteSave(d);
      toast('✅ Contraseña actualizada');
      return;
    }
    /* La guardada no sirvió (quizá ya la cambiaste en otro equipo):
       último intento pidiéndola a mano. */
    const actual = await metasPrompt('La contraseña guardada en este equipo ya no es la vigente.\nEscribe tu contraseña **actual** para confirmar el cambio:', {
      icono: '✏️', titulo: 'Zona Docente', type: 'password', okTxt: 'Confirmar',
      valida: v => String(v).length ? '' : 'Escribe tu contraseña actual.',
    });
    if (actual === null) return;
    const r2 = await fetch(url + '/rest/v1/rpc/metas_cambiar_clave_docente', {
      method: 'POST',
      headers: { 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_codigo: d.codigo, p_actual: String(actual), p_nueva: np }),
    });
    const ok2 = r2.ok ? await r2.json() : false;
    if (ok2 === true) {
      d.clave = np; _docenteSave(d);
      toast('✅ Contraseña actualizada');
    } else {
      toast('⚠️ No se pudo cambiar. Si la olvidaste por completo, usa «¿Olvidaste tu contraseña?» al entrar.');
    }
  } catch (_) { toast('⚠️ Sin conexión con la nube'); }
}
window.docenteCambiarClave = docenteCambiarClave;

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
  if (id === 'view-padre')    renderPadre();
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

  // Vista Padre: botón volver
  document.getElementById('padre-back-btn')?.addEventListener('click', () => switchView('view-inicio'));

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
