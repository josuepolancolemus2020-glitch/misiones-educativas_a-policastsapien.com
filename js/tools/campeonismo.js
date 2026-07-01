'use strict';

/* ============================================================
   CAMPEONÍSIMO — Módulo de Juego para el Aula
   ============================================================ */

/* ── Constantes ── */
const CAMP_SUBJECTS = [
  { key: 'español',     label: 'Español',       short: 'ESP', icon: '📝', color: '#b45309', bg: '#fef3c7', cls: 'esp' },
  { key: 'matemáticas', label: 'Matemáticas',    short: 'MAT', icon: '📐', color: '#2563eb', bg: '#dbeafe', cls: 'mat' },
  { key: 'naturales',   label: 'C. Naturales',   short: 'NAT', icon: '🌿', color: '#0d9488', bg: '#ccfbf1', cls: 'cnat' },
  { key: 'sociales',    label: 'C. Sociales',    short: 'SOC', icon: '🌍', color: '#dc2626', bg: '#fee2e2', cls: 'csoc' },
];

const CAMP_COLORS = [
  '#6366f1','#f59e0b','#10b981','#ef4444',
  '#8b5cf6','#06b6d4','#84cc16','#f97316',
];

/* ── Estado del juego ── */
let campState = {
  phase: 'setup',
  groups: [],
  timerSecs: 30,
  timerInterval: null,
  timerRemaining: 30,
  currentSubject: null,
  currentQuestion: null,
  usedQs: { español: [], matemáticas: [], naturales: [], sociales: [] },
  wheelRotation: 0,
  round: 0,
  pointsPerQ: 10,
  selectedGroups: new Set(),
};

/* ── Selectores cacheados ── */
let _container = null;
function $id(id) { return document.getElementById(id); }

/* ── Punto de entrada (llamado por app.js al navegar a la vista) ── */
function initCampeonismo() {
  _container = $id('camp-content');
  if (!_container) return;
  if (campState.phase === 'setup') {
    renderSetup();
  } else {
    renderHub();
  }
}
window.initCampeonismo = initCampeonismo;

/* ══════════════════════════════════════════════════════════════
   FASE 1 — CONFIGURACIÓN
══════════════════════════════════════════════════════════════ */
function renderSetup() {
  campState.phase = 'setup';
  _container.innerHTML = `
    <div class="camp-setup">
      <div class="camp-setup-hero">
        <div class="camp-trophy">🏆</div>
        <h2 class="camp-setup-title">Campeonísimo</h2>
        <p class="camp-setup-sub">Configura el juego antes de comenzar</p>
      </div>

      <div class="camp-card">
        <div class="camp-card-label">Número de Grupos</div>
        <div class="camp-num-btns" id="camp-num-btns">
          ${[2,3,4,5,6,7,8].map(n =>
            `<button class="camp-num-btn${n===4?' active':''}" data-n="${n}">${n}</button>`
          ).join('')}
        </div>
      </div>

      <div class="camp-card">
        <div class="camp-card-label">Nombres de los Grupos</div>
        <div id="camp-group-names" class="camp-group-names-grid">
          ${_genGroupInputs(4)}
        </div>
      </div>

      <div class="camp-card">
        <div class="camp-card-label">Tiempo por pregunta</div>
        <div class="camp-timer-row">
          ${[15,20,30,45,60].map(s =>
            `<button class="camp-timer-btn${s===30?' active':''}" data-t="${s}">${s}s</button>`
          ).join('')}
        </div>
      </div>

      <div class="camp-card">
        <div class="camp-card-label">Puntos por respuesta correcta</div>
        <div class="camp-timer-row">
          ${[5,10,15,20].map(p =>
            `<button class="camp-pts-btn${p===10?' active':''}" data-p="${p}">${p} pts</button>`
          ).join('')}
        </div>
      </div>

      <button class="camp-start-btn" id="camp-start-btn">
        🚀 ¡Comenzar Campeonísimo!
      </button>
    </div>
  `;

  /* Número de grupos */
  _container.querySelectorAll('.camp-num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _container.querySelectorAll('.camp-num-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      $id('camp-group-names').innerHTML = _genGroupInputs(+btn.dataset.n);
    });
  });

  /* Timer */
  _container.querySelectorAll('.camp-timer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _container.querySelectorAll('.camp-timer-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      campState.timerSecs = +btn.dataset.t;
    });
  });

  /* Puntos */
  _container.querySelectorAll('.camp-pts-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _container.querySelectorAll('.camp-pts-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      campState.pointsPerQ = +btn.dataset.p;
    });
  });

  /* Iniciar */
  $id('camp-start-btn').addEventListener('click', startGame);
}

function _genGroupInputs(n) {
  return Array.from({ length: n }, (_, i) => `
    <div class="camp-group-input-row">
      <span class="camp-gi-badge" style="background:${CAMP_COLORS[i]}">G${i+1}</span>
      <input type="text" class="camp-gi-input" id="camp-gi-${i}"
        placeholder="Grupo ${i+1}" maxlength="18" autocomplete="off">
    </div>
  `).join('');
}

function startGame() {
  const numBtnActive = _container.querySelector('.camp-num-btn.active');
  const n = numBtnActive ? +numBtnActive.dataset.n : 4;

  campState.groups = Array.from({ length: n }, (_, i) => {
    const inp = $id(`camp-gi-${i}`);
    return {
      name: (inp && inp.value.trim()) || `Grupo ${i + 1}`,
      score: 0,
      color: CAMP_COLORS[i],
    };
  });

  campState.usedQs = { español: [], matemáticas: [], naturales: [], sociales: [] };
  campState.round = 0;
  campState.wheelRotation = 0;
  campState.phase = 'hub';
  renderHub();
}

/* ══════════════════════════════════════════════════════════════
   FASE 2 — HUB (Ruleta + Marcador)
══════════════════════════════════════════════════════════════ */
function renderHub() {
  campState.phase = 'hub';
  campState.currentSubject = null;
  campState.selectedGroups = new Set();

  _container.innerHTML = `
    <div class="camp-hub">

      <!-- Marcador -->
      <div class="camp-scoreboard" id="camp-scoreboard">
        ${_renderScoreboard()}
      </div>

      <!-- Ruleta -->
      <div class="camp-wheel-section">
        <div class="camp-round-badge">Ronda ${campState.round}</div>
        <div class="camp-wheel-wrap">
          <div class="camp-pointer-arrow"></div>
          <div class="camp-wheel" id="camp-wheel">
            ${CAMP_SUBJECTS.map(s => `
              <div class="camp-wsector camp-ws-${s.cls}">
                <span class="camp-ws-icon">${s.icon}</span>
                <span class="camp-ws-short">${s.short}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="camp-subject-announce" id="camp-subject-announce"></div>
        <button class="camp-spin-btn" id="camp-spin-btn">🎯 Girar Ruleta</button>
      </div>

      <!-- Botones de control -->
      <div class="camp-hub-actions">
        <button class="camp-action-btn camp-reset-btn" id="camp-reset-btn">↺ Reiniciar</button>
        <button class="camp-action-btn camp-exit-btn" id="camp-exit-setup-btn">✕ Salir</button>
      </div>
    </div>
  `;

  /* Restaurar rotación acumulada de la ruleta */
  const wheel = $id('camp-wheel');
  if (wheel) {
    wheel.style.transition = 'none';
    wheel.style.transform = `rotate(${campState.wheelRotation % 360}deg)`;
  }

  $id('camp-spin-btn').addEventListener('click', spinWheel);
  $id('camp-reset-btn').addEventListener('click', () => {
    if (confirm('¿Reiniciar el marcador? Se perderán los puntajes actuales.')) {
      campState.groups.forEach(g => g.score = 0);
      campState.round = 0;
      campState.usedQs = { español: [], matemáticas: [], naturales: [], sociales: [] };
      campState.wheelRotation = 0;
      renderHub();
    }
  });
  $id('camp-exit-setup-btn').addEventListener('click', () => {
    if (confirm('¿Salir al menú de configuración?')) {
      campState.phase = 'setup';
      renderSetup();
    }
  });
}

function _renderScoreboard() {
  const sorted = [...campState.groups].sort((a, b) => b.score - a.score);
  return campState.groups.map((g, i) => {
    const rank = sorted.indexOf(g) + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
    return `
      <div class="camp-score-row" data-gi="${i}">
        <div class="camp-score-color" style="background:${g.color}"></div>
        <span class="camp-score-name">${g.name}</span>
        <span class="camp-score-pts">${g.score}</span>
        ${medal ? `<span class="camp-score-medal">${medal}</span>` : '<span></span>'}
      </div>
    `;
  }).join('');
}

/* ── Animación de la ruleta ── */
function spinWheel() {
  const btn = $id('camp-spin-btn');
  if (!btn || btn.disabled) return;
  btn.disabled = true;

  const wheel = $id('camp-wheel');
  const announce = $id('camp-subject-announce');
  if (!wheel) return;

  /* Selección aleatoria de materia */
  const idx = Math.floor(Math.random() * 4);
  const subject = CAMP_SUBJECTS[idx];

  /* Ángulo central de cada sector (comenzando desde las 12, en el sentido horario):
     Sector 0 (ESP): 0°–90°  → centro: 45°
     Sector 1 (MAT): 90°–180° → centro: 135°
     Sector 2 (NAT): 180°–270° → centro: 225°
     Sector 3 (SOC): 270°–360° → centro: 315°
  */
  const sectorAngles = [45, 135, 225, 315];
  const target = sectorAngles[idx];

  const currentAngle = campState.wheelRotation % 360;
  let additional = target - currentAngle;
  if (additional <= 0) additional += 360;
  campState.wheelRotation += (5 * 360) + additional;

  wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  wheel.style.transform = `rotate(${campState.wheelRotation}deg)`;

  if (announce) {
    announce.textContent = '';
    announce.className = 'camp-subject-announce';
  }

  setTimeout(() => {
    campState.currentSubject = subject.key;
    campState.round++;

    if (announce) {
      announce.className = `camp-subject-announce camp-sa-${subject.cls}`;
      announce.innerHTML = `${subject.icon} <strong>${subject.label}</strong>`;
      announce.style.animation = 'none';
      void announce.offsetWidth;
      announce.style.animation = '';
    }

    /* Actualizar badge de ronda */
    const badge = _container.querySelector('.camp-round-badge');
    if (badge) badge.textContent = `Ronda ${campState.round}`;

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = '🎯 Girar Ruleta';

      /* Mostrar botón de pregunta */
      const hub = _container.querySelector('.camp-hub');
      if (hub) {
        let qBtn = $id('camp-go-question-btn');
        if (!qBtn) {
          qBtn = document.createElement('button');
          qBtn.id = 'camp-go-question-btn';
          qBtn.className = 'camp-start-btn';
          qBtn.textContent = `📋 Ver Pregunta de ${subject.label}`;
          qBtn.addEventListener('click', () => renderQuestion(subject.key));
          const actionsRow = hub.querySelector('.camp-hub-actions');
          if (actionsRow) hub.insertBefore(qBtn, actionsRow);
          else hub.appendChild(qBtn);
        } else {
          qBtn.textContent = `📋 Ver Pregunta de ${subject.label}`;
          qBtn.onclick = () => renderQuestion(subject.key);
        }
      }
    }, 400);
  }, 4200);
}

/* ══════════════════════════════════════════════════════════════
   FASE 3 — PREGUNTA
══════════════════════════════════════════════════════════════ */
function renderQuestion(subjectKey) {
  const subject = CAMP_SUBJECTS.find(s => s.key === subjectKey);
  if (!subject) return;

  const q = _pickQuestion(subjectKey);
  if (!q) {
    alert('¡Ya se usaron todas las preguntas de ' + subject.label + '! Se reiniciará el banco.');
    campState.usedQs[subjectKey] = [];
    renderQuestion(subjectKey);
    return;
  }
  campState.currentQuestion = q;
  campState.phase = 'question';
  campState.selectedGroups = new Set();

  _stopTimer();
  campState.timerRemaining = campState.timerSecs;

  _container.innerHTML = `
    <div class="camp-question-screen">

      <!-- Header de materia -->
      <div class="camp-q-header camp-q-header-${subject.cls}">
        <span class="camp-q-subj-icon">${subject.icon}</span>
        <span class="camp-q-subj-label">${subject.label}</span>
        <span class="camp-q-mision">${q.mision}</span>
        <div class="camp-q-timer" id="camp-q-timer">
          <span id="camp-q-timer-num">${campState.timerSecs}</span>s
        </div>
      </div>

      <!-- Pregunta -->
      <div class="camp-q-body">
        <p class="camp-q-text" id="camp-q-text">${q.q}</p>

        <div class="camp-q-opts" id="camp-q-opts">
          ${q.o.map((opt, i) => `
            <button class="camp-q-opt" data-i="${i}">
              <span class="camp-q-letter">${'ABCD'[i]}</span>
              <span class="camp-q-opt-text">${opt}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Acciones -->
      <div class="camp-q-actions">
        <button class="camp-reveal-btn" id="camp-reveal-btn">✅ Revelar Respuesta</button>
        <button class="camp-skip-btn" id="camp-skip-btn">⏭ Siguiente</button>
      </div>

      <!-- Marcador mini -->
      <div class="camp-mini-score" id="camp-mini-score">
        ${campState.groups.map(g => `
          <div class="camp-ms-item">
            <span class="camp-ms-dot" style="background:${g.color}"></span>
            <span class="camp-ms-name">${g.name}</span>
            <span class="camp-ms-pts">${g.score}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  /* Selección de opción (solo para visualización, el docente decide) */
  _container.querySelectorAll('.camp-q-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      _container.querySelectorAll('.camp-q-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  $id('camp-reveal-btn').addEventListener('click', () => revealAnswer(false));
  $id('camp-skip-btn').addEventListener('click', () => revealAnswer(true));

  _startTimer();
}

function _pickQuestion(subjectKey) {
  const bank = CAMP_BANK[subjectKey];
  if (!bank || bank.length === 0) return null;
  const used = campState.usedQs[subjectKey];
  const available = bank.filter((_, i) => !used.includes(i));
  if (available.length === 0) return null;
  const bankIdx = bank.indexOf(available[Math.floor(Math.random() * available.length)]);
  campState.usedQs[subjectKey].push(bankIdx);
  return bank[bankIdx];
}

/* ── Temporizador ── */
function _startTimer() {
  const el = $id('camp-q-timer-num');
  if (!el) return;
  _stopTimer();
  campState.timerInterval = setInterval(() => {
    campState.timerRemaining--;
    if (el) el.textContent = Math.max(0, campState.timerRemaining);
    const pct = campState.timerRemaining / campState.timerSecs;
    const timerWrap = $id('camp-q-timer');
    if (timerWrap) {
      timerWrap.style.setProperty('--pct', Math.round(pct * 100) + '%');
      timerWrap.classList.toggle('camp-timer-urgent', campState.timerRemaining <= 10);
    }
    if (campState.timerRemaining <= 0) {
      _stopTimer();
      revealAnswer(false, true); /* tiempo agotado */
    }
  }, 1000);
}

function _stopTimer() {
  if (campState.timerInterval) {
    clearInterval(campState.timerInterval);
    campState.timerInterval = null;
  }
}

/* ══════════════════════════════════════════════════════════════
   FASE 4 — REVELAR RESPUESTA
══════════════════════════════════════════════════════════════ */
function revealAnswer(skip, timeout) {
  _stopTimer();
  campState.phase = 'reveal';

  const q = campState.currentQuestion;
  if (!q) { renderHub(); return; }

  const subject = CAMP_SUBJECTS.find(s => s.key === campState.currentSubject) || CAMP_SUBJECTS[0];

  /* Marcar opciones */
  _container.querySelectorAll('.camp-q-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.c) {
      btn.classList.add('correct');
    } else if (btn.classList.contains('selected')) {
      btn.classList.add('wrong');
    }
  });

  /* Reemplazar acciones por asignación de puntos */
  const actionsEl = _container.querySelector('.camp-q-actions');
  if (actionsEl) {
    actionsEl.innerHTML = `
      <div class="camp-award-section">
        ${skip || timeout ? `<p class="camp-timeout-msg">${timeout ? '⏰ Tiempo agotado' : '⏭ Pregunta saltada'}</p>` : ''}
        <p class="camp-award-label">${skip ? 'Sin puntos' : '¿Quién respondió correctamente?'}</p>
        ${!skip ? `
          <div class="camp-award-groups" id="camp-award-groups">
            ${campState.groups.map((g, i) => `
              <button class="camp-award-btn" data-gi="${i}" style="--gc:${g.color}">
                <span class="camp-ag-dot" style="background:${g.color}"></span>
                ${g.name}
              </button>
            `).join('')}
          </div>
          <button class="camp-confirm-pts-btn" id="camp-confirm-pts-btn">
            + ${campState.pointsPerQ} pts — Asignar y continuar
          </button>
        ` : ''}
        <button class="camp-next-q-btn" id="camp-next-q-btn">
          ${skip ? '▶ Continuar' : 'Omitir puntos y continuar'}
        </button>
      </div>
    `;

    /* Toggle de grupos ganadores */
    _container.querySelectorAll('.camp-award-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const gi = +btn.dataset.gi;
        if (campState.selectedGroups.has(gi)) {
          campState.selectedGroups.delete(gi);
          btn.classList.remove('selected');
        } else {
          campState.selectedGroups.add(gi);
          btn.classList.add('selected');
        }
        const confirmBtn = $id('camp-confirm-pts-btn');
        if (confirmBtn) {
          const n = campState.selectedGroups.size;
          confirmBtn.textContent = n > 0
            ? `+ ${campState.pointsPerQ} pts — Asignar a ${n} grupo${n>1?'s':''}`
            : `+ ${campState.pointsPerQ} pts — Selecciona un grupo`;
          confirmBtn.disabled = n === 0;
        }
      });
    });

    const confirmBtn = $id('camp-confirm-pts-btn');
    if (confirmBtn) {
      confirmBtn.disabled = true;
      confirmBtn.addEventListener('click', () => {
        campState.selectedGroups.forEach(gi => {
          campState.groups[gi].score += campState.pointsPerQ;
        });
        _showScoreUpdate();
        setTimeout(() => returnToHub(), 1200);
      });
    }

    const nextBtn = $id('camp-next-q-btn');
    if (nextBtn) nextBtn.addEventListener('click', returnToHub);
  }
}

function _showScoreUpdate() {
  campState.selectedGroups.forEach(gi => {
    const rows = _container.querySelectorAll('.camp-ms-item');
    if (rows[gi]) {
      const pts = rows[gi].querySelector('.camp-ms-pts');
      if (pts) {
        pts.textContent = campState.groups[gi].score;
        pts.classList.add('camp-pts-bump');
        setTimeout(() => pts.classList.remove('camp-pts-bump'), 600);
      }
    }
  });
}

function returnToHub() {
  _stopTimer();
  campState.phase = 'hub';
  renderHub();
}

/* ── Registro de botones de navegación (llamado una vez al cargar el DOM) ── */
function campRegisterNav() {
  document.getElementById('goto-camp-btn')?.addEventListener('click', () => switchView('view-campeonismo'));
  document.getElementById('camp-back-btn')?.addEventListener('click', () => switchView('view-perfil'));
}
window.campRegisterNav = campRegisterNav;
