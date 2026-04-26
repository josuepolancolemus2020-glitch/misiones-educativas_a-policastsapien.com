'use strict';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const MISSIONS = [
  // ESPAÑOL
  { id:  1, title: 'Los Adjetivos',                           subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '📝', url: '2y3ciclo-adjetivos/adjetivos-II-IIICiclo.html' },
  { id:  2, title: 'Los Verbos',                              subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '✍️', url: '2y3ciclo-verbos/verbos-II-III-ciclo-basica.html' },
  { id:  3, title: 'Los Sustantivos',                         subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '📖', url: '2y3ciclo-sustantivos/sustantivos-II-III-ciclo-basica.html' },
  { id:  4, title: 'Los Pronombres',                          subject: 'español',     color: 'esp',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '💬', url: '2y3ciclo-pronombres/pronombres-II-III-ciclo-basica.html' },
  { id:  5, title: 'El Adjetivo Avanzado',                    subject: 'español',     color: 'bach', grade: 'Bachillerato',   cycle: 'bach',     xp: 40, icon: '🎓', url: 'bach-uni-adjetivos/adjetivos-avanzado.html' },
  // MATEMÁTICAS
  { id:  6, title: 'Números de Tres Cifras',                  subject: 'matemáticas', color: 'mat',  grade: '2° Grado',       cycle: '1ciclo',   xp: 20, icon: '🔢', url: '1ciclo-2º-grado/numeros-hasta-999.html' },
  { id:  7, title: 'Ángulos y Bisectriz',                     subject: 'matemáticas', color: 'mat',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '📐', url: '2y3ciclo-angulo-bisectriz/angulos-bisectriz_II y III-Ciclo_Básica.html' },
  { id:  8, title: 'Números Decimales',                       subject: 'matemáticas', color: 'mat',  grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '🔢', url: '2y3ciclo-numeros-decimales/2y3ciclo-numeros-decimales.html' },
  // CIENCIAS NATURALES
  { id:  9, title: 'Las Eras Geológicas',                     subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 35, icon: '🦕', url: '2y3ciclo-eras-geológicas/eras_geológicas.html' },
  { id: 10, title: 'Áreas Protegidas de Honduras',            subject: 'naturales',   color: 'cnat', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '🌿', url: '2y3ciclo-áreas-protegidas-de-honduras/2y3ciclo-áreas-protegidas-de-Honduras.html' },
  // CIENCIAS SOCIALES
  { id: 11, title: 'Geografía y Coordenadas',                 subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 25, icon: '🗺️', url: '2y3ciclo-geografía-coordenadas/2y3ciclo_geografia-coordenadas.html' },
  { id: 12, title: 'Continentes: Europa, Asia y África',      subject: 'sociales',    color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '🌍', url: '2y3ciclo-los-Continentes-Europa-Asia-y-Africa/2y3ciclo_geografia-continentes-eas.html' },
  { id: 13, title: 'Continentes: América, Oceanía y Antártida', subject: 'sociales',  color: 'csoc', grade: 'II y III Ciclo', cycle: '2y3ciclo', xp: 30, icon: '🌎', url: '2y3ciclo-los-continentes-América-Oceanía-Antártida/2y3ciclo-los-continentes-América-Oceanía-Antártida.html' },
];

const SUBJECT_LABELS = {
  'español':     'Español',
  'matemáticas': 'Matemáticas',
  'naturales':   'C. Naturales',
  'sociales':    'C. Sociales',
};

const LEVELS = [
  { n: 1, min:   0, max:  99, label: 'Explorador', emoji: '🌱' },
  { n: 2, min: 100, max: 249, label: 'Aprendiz',   emoji: '📚' },
  { n: 3, min: 250, max: 499, label: 'Estudioso',  emoji: '🔍' },
  { n: 4, min: 500, max: 799, label: 'Académico',  emoji: '⚡' },
  { n: 5, min: 800, max: Infinity, label: 'Sabio', emoji: '🏆' },
];

const FRASES = [
  { texto: "El éxito es la suma de pequeños esfuerzos repetidos día tras día.", autor: "Robert Collier" },
  { texto: "La educación es el arma más poderosa que puedes usar para cambiar el mundo.", autor: "Nelson Mandela" },
  { texto: "No importa cuán despacio vayas, siempre que no te detengas.", autor: "Confucio" },
  { texto: "El conocimiento es el único bien que crece cuanto más se comparte.", autor: "Proverbio" },
  { texto: "Nunca es demasiado tarde para aprender algo nuevo.", autor: "Anónimo" },
  { texto: "La perseverancia es el camino al éxito.", autor: "Charles Chaplin" },
  { texto: "Cada libro que lees es un mundo nuevo que descubres.", autor: "Anónimo" },
  { texto: "Un día sin aprender algo nuevo es un día perdido.", autor: "Albert Einstein" },
  { texto: "La constancia convierte lo ordinario en extraordinario.", autor: "Anónimo" },
  { texto: "Tu futuro se construye con lo que haces hoy.", autor: "Robert Kiyosaki" },
  { texto: "Primero aprende las reglas; luego juega mejor que nadie.", autor: "Albert Einstein" },
  { texto: "La mente que se abre a una nueva idea jamás volverá a su tamaño original.", autor: "Albert Einstein" },
  { texto: "El aprendizaje es un tesoro que te acompañará a todas partes.", autor: "Proverbio chino" },
  { texto: "Estudia, no para saber más, sino para saber mejor.", autor: "Séneca" },
  { texto: "Invertir en conocimiento siempre paga el mejor interés.", autor: "Benjamin Franklin" },
  { texto: "Los sueños no funcionan a menos que tú también lo hagas.", autor: "John C. Maxwell" },
  { texto: "El único límite a tu aprendizaje es el que tú mismo te pongas.", autor: "Anónimo" },
  { texto: "Cada pequeño avance de hoy es la gran diferencia de mañana.", autor: "Anónimo" },
  { texto: "La perseverancia convierte lo imposible en posible.", autor: "Anónimo" },
  { texto: "No hay atajos hacia el conocimiento verdadero.", autor: "Anónimo" },
  { texto: "Un buen estudiante nunca deja de aprender, incluso fuera del aula.", autor: "Anónimo" },
  { texto: "El esfuerzo de hoy es el orgullo de mañana.", autor: "Anónimo" },
  { texto: "Cada vez que estudias, te conviertes en una versión mejor de ti mismo.", autor: "Anónimo" },
  { texto: "La disciplina es el puente entre las metas y los logros.", autor: "Jim Rohn" },
  { texto: "El que estudia con constancia, cosecha con abundancia.", autor: "Proverbio" },
  { texto: "No te compares con otros; compárate con quien eras ayer.", autor: "Anónimo" },
  { texto: "Aprender es el regalo más valioso que te haces a ti mismo.", autor: "Anónimo" },
  { texto: "La educación no es llenar un balde, sino encender un fuego.", autor: "W.B. Yeats" },
  { texto: "Con dedicación y paciencia, cualquier meta es alcanzable.", autor: "Anónimo" },
  { texto: "Los grandes logros requieren tiempo. Dale tiempo a tu aprendizaje.", autor: "Anónimo" },
];

/* ─────────────────────────────────────────────
   STATE
───────────────────────────────────────────── */

const KEY = 'meta_v2';

function blank() {
  return { name: '', grade: '2y3ciclo', xp: 0, visited: [], lastVisited: [] };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return Object.assign(blank(), JSON.parse(raw));
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
   RENDER — HOME
───────────────────────────────────────────── */

function renderHome() {
  const s = load();

  // Saludo
  document.getElementById('home-name').textContent = displayName(s) + '!';

  // Frase motivacional aleatoria
  const frase = FRASES[Math.floor(Math.random() * FRASES.length)];
  document.getElementById('motiv-text').textContent  = frase.texto;
  document.getElementById('motiv-autor').textContent = '— ' + frase.autor;

  // Featured
  const m = featuredMission(s);
  const done = s.visited.includes(m.id);
  const card = document.getElementById('featured-card');
  card.innerHTML = `
    <div class="feat-label">★ Misión destacada</div>
    <div class="feat-subj">${m.icon} ${SUBJECT_LABELS[m.subject] || m.subject}</div>
    <div class="feat-title">${m.title}</div>
    <div class="feat-grade">${m.grade}</div>
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

  // Recent
  const wrap = document.getElementById('recent-wrap');
  const list = document.getElementById('recent-list');
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
          <div class="small-meta">${SUBJECT_LABELS[m.subject] || m.subject} · ${m.grade}</div>
        </div>
        <i class="fa-solid fa-chevron-right small-arrow"></i>
      </a>
    `).join('');
  }
}

/* ─────────────────────────────────────────────
   RENDER — MISSIONS
───────────────────────────────────────────── */

function renderMissions(filter, query) {
  const s = load();
  let list = [...MISSIONS];

  if (filter && filter !== 'all') {
    list = list.filter(m => m.subject === filter);
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    list = list.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (SUBJECT_LABELS[m.subject] || '').toLowerCase().includes(q) ||
      m.grade.toLowerCase().includes(q)
    );
  }

  const container = document.getElementById('missions-container');

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
            <span class="mc-grade">${m.grade}</span>
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
   RENDER — PROGRESS
───────────────────────────────────────────── */

function renderProgress() {
  const s = load();
  const lv = getLevel(s.xp);
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

  const subjects = [
    { key: 'español',     label: 'Español',      color: 'var(--esp)' },
    { key: 'matemáticas', label: 'Matemáticas',   color: 'var(--mat)' },
    { key: 'naturales',   label: 'C. Naturales',  color: 'var(--cnat)' },
    { key: 'sociales',    label: 'C. Sociales',   color: 'var(--csoc)' },
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
                 <span class="mc-grade">${m.grade}</span>
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
  const s = load();
  const lv = getLevel(s.xp);

  document.getElementById('prf-avatar').textContent = lv.emoji;
  document.getElementById('prf-name').textContent   = displayName(s);
  document.getElementById('prf-rank').textContent   = `Nivel ${lv.n} · ${lv.label} · ${s.xp} XP`;
  document.getElementById('name-input').value       = s.name;

  document.querySelectorAll('.grade-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.grade === s.grade)
  );

  document.getElementById('prf-visited').textContent = `${s.visited.length} / ${MISSIONS.length}`;
  document.getElementById('prf-xp').textContent      = `${s.xp} XP`;
  document.getElementById('prf-level').textContent   = `Nivel ${lv.n}`;
  document.getElementById('prf-badge').textContent   = lv.label;
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
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  const btn = document.querySelector(`.nav-btn[data-view="${id}"]`);
  if (btn) btn.classList.add('active');

  if (id === 'view-inicio')   renderHome();
  if (id === 'view-misiones') renderMissions(currentFilter, currentQuery);
  if (id === 'view-progreso') renderProgress();
  if (id === 'view-perfil')   renderProfile();

  // Scroll to top
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

  // Initial home render
  renderHome();

  // Nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
  });

  // Subject chips → go to missions filtered
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

  // Search
  const searchEl = document.getElementById('search-input');
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      currentQuery = searchEl.value;
      renderMissions(currentFilter, currentQuery);
    });
  }

  // Filter pills
  document.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderMissions(currentFilter, currentQuery);
    });
  });

  // Notification button
  document.getElementById('notif-btn').addEventListener('click', () => {
    toast('Sin notificaciones nuevas por ahora');
  });

  // Save name
  document.getElementById('save-name-btn').addEventListener('click', () => {
    const s = load();
    s.name = document.getElementById('name-input').value.trim();
    save(s);
    renderProfile();
    renderHome();
    toast('¡Nombre guardado!');
  });

  document.getElementById('name-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('save-name-btn').click();
  });

  // Grade buttons
  document.querySelectorAll('.grade-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = load();
      s.grade = btn.dataset.grade;
      save(s);
      document.querySelectorAll('.grade-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      toast('Nivel de estudios actualizado');
    });
  });

  // Reset
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('¿Reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
      localStorage.removeItem(KEY);
      renderProfile();
      renderHome();
      toast('Progreso reiniciado');
    }
  });
});
