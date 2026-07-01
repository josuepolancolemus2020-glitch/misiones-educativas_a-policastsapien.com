'use strict';

/* ============================================================
   CAMPEONÍSIMO — Módulo de Juego para el Aula
   ============================================================ */

/* ── Materias y colores ── */
const CAMP_SUBJECTS = [
  { key: 'español',     label: 'Español',      short: 'ESP', icon: '📝', color: '#b45309', bg: '#fef3c7', cls: 'esp'  },
  { key: 'matemáticas', label: 'Matemáticas',   short: 'MAT', icon: '📐', color: '#2563eb', bg: '#dbeafe', cls: 'mat'  },
  { key: 'naturales',   label: 'C. Naturales',  short: 'NAT', icon: '🌿', color: '#0d9488', bg: '#ccfbf1', cls: 'cnat' },
  { key: 'sociales',    label: 'C. Sociales',   short: 'SOC', icon: '🌍', color: '#dc2626', bg: '#fee2e2', cls: 'csoc' },
];

const CAMP_COLORS = [
  '#6366f1','#f59e0b','#10b981','#ef4444',
  '#8b5cf6','#06b6d4','#84cc16','#f97316',
];

/* ══════════════════════════════════════════════════════════════
   AUDIO — Web Audio API (sin archivos externos)
══════════════════════════════════════════════════════════════ */
let _ctx = null;

function _ac() {
  if (!_ctx) {
    try { _ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
  }
  if (_ctx && _ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

function _tone(freq, type, dur, vol, t0) {
  const ac = _ac(); if (!ac) return;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.connect(g); g.connect(ac.destination);
  o.type = type || 'sine';
  o.frequency.value = freq;
  const t = ac.currentTime + (t0 || 0);
  g.gain.setValueAtTime(0.001, t);
  g.gain.linearRampToValueAtTime(vol || 0.25, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + (dur || 0.15));
  o.start(t);
  o.stop(t + (dur || 0.15) + 0.05);
}

function _sfx(name) {
  switch (name) {
    case 'click':
      _tone(700, 'sine', 0.06, 0.18);
      break;
    case 'spin':
      /* Barrido ascendente que simula la aceleración */
      for (let i = 0; i < 10; i++) _tone(180 + i * 55, 'sawtooth', 0.08, 0.12, i * 0.045);
      break;
    case 'spin_end':
      _tone(880, 'sine', 0.12, 0.28, 0);
      _tone(1100, 'sine', 0.12, 0.32, 0.12);
      _tone(660,  'sine', 0.18, 0.4,  0.26);
      break;
    case 'reveal':
      _tone(523, 'sine', 0.14, 0.32, 0);
      _tone(659, 'sine', 0.14, 0.32, 0.10);
      _tone(784, 'sine', 0.16, 0.36, 0.20);
      break;
    case 'pts':
      /* Fanfarria corta */
      [523, 659, 784, 1047].forEach((f, i) => _tone(f, 'sine', 0.12, 0.32, i * 0.07));
      break;
    case 'timeout':
      _tone(400, 'sawtooth', 0.18, 0.3,  0);
      _tone(300, 'sawtooth', 0.18, 0.3,  0.22);
      _tone(180, 'sawtooth', 0.25, 0.32, 0.44);
      break;
    case 'tick':
      _tone(900, 'square', 0.03, 0.08);
      break;
    case 'urgent':
      _tone(1400, 'square', 0.04, 0.18);
      break;
    case 'start':
      _tone(392, 'sine', 0.12, 0.3, 0);
      _tone(523, 'sine', 0.12, 0.3, 0.13);
      _tone(659, 'sine', 0.16, 0.4, 0.26);
      _tone(784, 'sine', 0.20, 0.5, 0.39);
      break;
  }
}

/* ══════════════════════════════════════════════════════════════
   ESTADO
══════════════════════════════════════════════════════════════ */
let campState = {
  phase:            'setup',
  groups:           [],
  timerSecs:        30,
  timerInterval:    null,
  timerRemaining:   30,
  currentSubject:   null,
  currentQuestion:  null,
  usedQs:           { español: [], 'matemáticas': [], naturales: [], sociales: [] },
  wheelRotation:    0,
  round:            0,
  pointsPerQ:       10,
  selectedGroups:   new Set(),
  selectedMissions: null,   /* null = todas; o Set con nombres de misión */
};

/* ── Helpers ── */
let _container = null;
const $id = id => document.getElementById(id);

function _missionsBySubject(subjectKey) {
  const bank = (typeof CAMP_BANK !== 'undefined' && CAMP_BANK[subjectKey]) || [];
  const seen = new Set();
  return bank.map(q => q.mision).filter(m => { if (seen.has(m)) return false; seen.add(m); return true; });
}

/* ══════════════════════════════════════════════════════════════
   PUNTO DE ENTRADA
══════════════════════════════════════════════════════════════ */
function initCampeonismo() {
  _container = $id('camp-content');
  if (!_container) return;
  /* Verificar que el banco de preguntas esté disponible */
  if (typeof CAMP_BANK === 'undefined') {
    _container.innerHTML = `
      <div class="camp-error-msg">
        <p>⚠️ El banco de preguntas no está cargado.</p>
        <p style="font-size:13px;color:var(--muted);margin-top:6px;">Asegúrate de que el archivo <strong>campeonismo-bank.js</strong> esté disponible.</p>
      </div>`;
    return;
  }
  if (campState.phase === 'setup') renderSetup();
  else renderHub();
}
window.initCampeonismo = initCampeonismo;

/* ══════════════════════════════════════════════════════════════
   FASE 1 — CONFIGURACIÓN
══════════════════════════════════════════════════════════════ */
function renderSetup() {
  campState.phase = 'setup';

  /* ── Selector de misiones ── */
  const misionHTML = CAMP_SUBJECTS.map(s => {
    const missions = _missionsBySubject(s.key);
    return `
      <div class="camp-ms-block">
        <div class="camp-ms-bhead camp-ms-bh-${s.cls}">
          <span>${s.icon} ${s.label}</span>
          <button class="camp-ms-tog" data-subj="${s.key}">Todas ✓</button>
        </div>
        <div class="camp-ms-blist">
          ${missions.map(m => `
            <label class="camp-ms-blbl">
              <input type="checkbox" class="camp-ms-ck" data-subj="${s.key}" value="${m}" checked>
              <span>${m}</span>
            </label>
          `).join('')}
        </div>
      </div>`;
  }).join('');

  _container.innerHTML = `
    <div class="camp-setup">

      <div class="camp-setup-hero">
        <div class="camp-trophy">🏆</div>
        <h2 class="camp-setup-title">Campeonísimo</h2>
        <p class="camp-setup-sub">Configura el juego antes de comenzar</p>
      </div>

      <!-- Grupos -->
      <div class="camp-card">
        <div class="camp-card-label">Número de Grupos</div>
        <div class="camp-num-btns">
          ${[2,3,4,5,6,7,8].map(n =>
            `<button class="camp-num-btn${n===4?' active':''}" data-n="${n}">${n}</button>`
          ).join('')}
        </div>
      </div>

      <div class="camp-card">
        <div class="camp-card-label">Nombres de los Grupos</div>
        <div id="camp-group-names">${_genGroupInputs(4)}</div>
      </div>

      <!-- Tiempo -->
      <div class="camp-card">
        <div class="camp-card-label">Tiempo por pregunta</div>
        <div class="camp-timer-row">
          ${[15,20,30,45,60].map(s =>
            `<button class="camp-timer-btn${s===30?' active':''}" data-t="${s}">${s}s</button>`
          ).join('')}
        </div>
      </div>

      <!-- Puntos -->
      <div class="camp-card">
        <div class="camp-card-label">Puntos por respuesta correcta</div>
        <div class="camp-timer-row">
          ${[5,10,15,20].map(p =>
            `<button class="camp-pts-btn${p===10?' active':''}" data-p="${p}">${p} pts</button>`
          ).join('')}
        </div>
      </div>

      <!-- Selector de misiones -->
      <div class="camp-card">
        <div class="camp-card-label camp-ms-header-row">
          <span>Misiones incluidas</span>
          <div>
            <button class="camp-ms-global" id="camp-ms-all">Todas ✓</button>
            <button class="camp-ms-global camp-ms-none" id="camp-ms-none">Ninguna ○</button>
          </div>
        </div>
        <div class="camp-ms-blocks">${misionHTML}</div>
      </div>

      <button class="camp-start-btn" id="camp-start-btn">🚀 ¡Comenzar Campeonísimo!</button>
    </div>
  `;

  /* Número de grupos */
  _container.querySelectorAll('.camp-num-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      _sfx('click');
      _container.querySelectorAll('.camp-num-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      $id('camp-group-names').innerHTML = _genGroupInputs(+btn.dataset.n);
    })
  );

  /* Timer */
  _container.querySelectorAll('.camp-timer-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      _sfx('click');
      _container.querySelectorAll('.camp-timer-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      campState.timerSecs = +btn.dataset.t;
    })
  );

  /* Puntos */
  _container.querySelectorAll('.camp-pts-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      _sfx('click');
      _container.querySelectorAll('.camp-pts-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      campState.pointsPerQ = +btn.dataset.p;
    })
  );

  /* Toggle por materia */
  _container.querySelectorAll('.camp-ms-tog').forEach(btn => {
    btn.addEventListener('click', () => {
      _sfx('click');
      const cks = _container.querySelectorAll(`.camp-ms-ck[data-subj="${btn.dataset.subj}"]`);
      const allOn = [...cks].every(c => c.checked);
      cks.forEach(c => c.checked = !allOn);
      btn.textContent = allOn ? 'Todas ○' : 'Todas ✓';
    });
  });

  $id('camp-ms-all').addEventListener('click', () => {
    _sfx('click');
    _container.querySelectorAll('.camp-ms-ck').forEach(c => c.checked = true);
    _container.querySelectorAll('.camp-ms-tog').forEach(b => b.textContent = 'Todas ✓');
  });
  $id('camp-ms-none').addEventListener('click', () => {
    _sfx('click');
    _container.querySelectorAll('.camp-ms-ck').forEach(c => c.checked = false);
    _container.querySelectorAll('.camp-ms-tog').forEach(b => b.textContent = 'Todas ○');
  });

  $id('camp-start-btn').addEventListener('click', () => { _sfx('click'); startGame(); });
}

function _genGroupInputs(n) {
  return Array.from({ length: n }, (_, i) => `
    <div class="camp-group-input-row">
      <span class="camp-gi-badge" style="background:${CAMP_COLORS[i]}">G${i+1}</span>
      <input type="text" class="camp-gi-input" id="camp-gi-${i}"
        placeholder="Grupo ${i+1}" maxlength="18" autocomplete="off">
    </div>`
  ).join('');
}

function startGame() {
  const numBtn = _container.querySelector('.camp-num-btn.active');
  const n = numBtn ? +numBtn.dataset.n : 4;

  campState.groups = Array.from({ length: n }, (_, i) => {
    const inp = $id(`camp-gi-${i}`);
    return { name: (inp && inp.value.trim()) || `Grupo ${i+1}`, score: 0, color: CAMP_COLORS[i] };
  });

  /* Recopilar misiones seleccionadas */
  const checked = [..._container.querySelectorAll('.camp-ms-ck:checked')];
  campState.selectedMissions = checked.length ? new Set(checked.map(c => c.value)) : null;

  campState.usedQs = { español: [], 'matemáticas': [], naturales: [], sociales: [] };
  campState.round  = 0;
  campState.wheelRotation = 0;
  campState.phase = 'hub';
  _sfx('start');
  renderHub();
}

/* ══════════════════════════════════════════════════════════════
   FASE 2 — HUB (Ruleta + Marcador)
══════════════════════════════════════════════════════════════ */
function renderHub() {
  campState.phase = 'hub';
  campState.currentSubject = null;
  campState.selectedGroups = new Set();
  _stopTimer();

  _container.innerHTML = `
    <div class="camp-hub">

      <div class="camp-scoreboard">
        ${campState.groups.map((g, i) => {
          const sorted = [...campState.groups].sort((a,b) => b.score - a.score);
          const rank   = sorted.findIndex(x => x === g) + 1;
          const medal  = rank===1?'🥇':rank===2?'🥈':rank===3?'🥉':'';
          return `
            <div class="camp-score-row">
              <div class="camp-score-color" style="background:${g.color}"></div>
              <span class="camp-score-name">${g.name}</span>
              <span class="camp-score-pts">${g.score}</span>
              <span class="camp-score-medal">${medal}</span>
            </div>`;
        }).join('')}
      </div>

      <div class="camp-wheel-section">
        <div class="camp-round-badge">Ronda ${campState.round}</div>

        <div class="camp-wheel-wrap">
          <div class="camp-pointer-arrow"></div>
          <div class="camp-wheel" id="camp-wheel">
            ${CAMP_SUBJECTS.map(s => `
              <div class="camp-wsector camp-ws-${s.cls}">
                <span class="camp-ws-icon">${s.icon}</span>
                <span class="camp-ws-short">${s.short}</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="camp-subject-announce" id="camp-subject-announce"></div>
        <button class="camp-spin-btn" id="camp-spin-btn">🎯 Girar Ruleta</button>
      </div>

      <div class="camp-hub-actions">
        <button class="camp-action-btn" id="camp-reset-btn">↺ Reiniciar</button>
        <button class="camp-action-btn" id="camp-cfg-btn">⚙ Config.</button>
      </div>

    </div>
  `;

  /* Restaurar ángulo */
  const wheel = $id('camp-wheel');
  if (wheel) {
    wheel.style.transition = 'none';
    wheel.style.transform  = `rotate(${campState.wheelRotation % 360}deg)`;
  }

  $id('camp-spin-btn').addEventListener('click', spinWheel);

  $id('camp-reset-btn').addEventListener('click', () => {
    _sfx('click');
    if (!confirm('¿Reiniciar el marcador?')) return;
    campState.groups.forEach(g => g.score = 0);
    campState.round = 0;
    campState.usedQs = { español: [], 'matemáticas': [], naturales: [], sociales: [] };
    campState.wheelRotation = 0;
    renderHub();
  });

  $id('camp-cfg-btn').addEventListener('click', () => {
    _sfx('click');
    if (!confirm('¿Volver a la configuración?')) return;
    campState.phase = 'setup';
    renderSetup();
  });
}

/* ── Animación de ruleta ── */
function spinWheel() {
  const btn = $id('camp-spin-btn');
  if (!btn || btn.disabled) return;
  btn.disabled = true;
  _sfx('spin');

  /* Quitar botón de pregunta anterior */
  const old = $id('camp-go-question-btn');
  if (old) old.remove();

  const wheel    = $id('camp-wheel');
  const announce = $id('camp-subject-announce');
  if (!wheel) return;

  /* Filtrar materias que tengan preguntas en las misiones seleccionadas */
  const validSubjects = CAMP_SUBJECTS.filter(s => {
    if (!campState.selectedMissions) return true;
    return (CAMP_BANK[s.key] || []).some(q => campState.selectedMissions.has(q.mision));
  });
  if (!validSubjects.length) { btn.disabled = false; alert('Sin misiones seleccionadas.'); return; }

  const subject = validSubjects[Math.floor(Math.random() * validSubjects.length)];
  const idx     = CAMP_SUBJECTS.indexOf(subject);

  /* Para que el sector quede bajo la flecha (tope = 0°), necesitamos que
     rotate(θ) lleve ese sector al tope: θ = 360 - centro_original.
     Centros: ESP=45 MAT=135 NAT=225 SOC=315 → targets: 315 225 135 45 */
  const sectorCenter = [315, 225, 135, 45][idx];
  const curAngle     = campState.wheelRotation % 360;
  let   extra        = sectorCenter - curAngle;
  if (extra <= 0) extra += 360;
  campState.wheelRotation += 5 * 360 + extra;

  wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  wheel.style.transform  = `rotate(${campState.wheelRotation}deg)`;

  if (announce) { announce.textContent = ''; announce.className = 'camp-subject-announce'; }

  /* Sonido continuo de ruleta girando */
  let tick = 0;
  const spinInterval = setInterval(() => {
    tick++;
    const pct = Math.min(1, tick / 55); /* 55 ticks × ~70ms ≈ 3.85s */
    const freq = 300 - pct * 100;       /* baja velocidad al frenar */
    _tone(freq + Math.random() * 80, 'sine', 0.06, 0.07);
    if (tick >= 55) clearInterval(spinInterval);
  }, 70);

  setTimeout(() => {
    clearInterval(spinInterval);
    _sfx('spin_end');
    campState.currentSubject = subject.key;
    campState.round++;

    if (announce) {
      announce.className = `camp-subject-announce camp-sa-${subject.cls}`;
      announce.innerHTML = `${subject.icon} <strong>${subject.label}</strong>`;
    }

    const badge = _container.querySelector('.camp-round-badge');
    if (badge) badge.textContent = `Ronda ${campState.round}`;

    setTimeout(() => {
      btn.disabled = false;
      const hub = _container.querySelector('.camp-hub');
      if (!hub) return;
      let qBtn = $id('camp-go-question-btn');
      if (!qBtn) {
        qBtn = document.createElement('button');
        qBtn.id        = 'camp-go-question-btn';
        qBtn.className = 'camp-start-btn';
        qBtn.style.marginTop = '12px';
        const actions = hub.querySelector('.camp-hub-actions');
        if (actions) hub.insertBefore(qBtn, actions);
        else hub.appendChild(qBtn);
      }
      qBtn.textContent = `📋 Ver Pregunta de ${subject.label}`;
      qBtn.onclick     = () => { _sfx('click'); renderQuestion(subject.key); };
    }, 400);
  }, 4300);
}

/* ══════════════════════════════════════════════════════════════
   FASE 3 — PREGUNTA
══════════════════════════════════════════════════════════════ */
function renderQuestion(subjectKey) {
  const subject = CAMP_SUBJECTS.find(s => s.key === subjectKey);
  if (!subject) return;

  let q = _pickQuestion(subjectKey);
  if (!q) {
    /* Banco agotado: reiniciar preguntas de esta materia */
    campState.usedQs[subjectKey] = [];
    q = _pickQuestion(subjectKey);
  }
  if (!q) { alert('No hay preguntas disponibles para las misiones seleccionadas.'); return; }

  campState.currentQuestion = q;
  campState.phase = 'question';
  campState.selectedGroups = new Set();
  _stopTimer();
  campState.timerRemaining = campState.timerSecs;

  const CIRCUM = 107; /* 2π × 17 ≈ 106.8 */

  _container.innerHTML = `
    <div class="camp-question-screen">

      <div class="camp-q-header camp-q-header-${subject.cls}">
        <span class="camp-q-subj-icon">${subject.icon}</span>
        <div class="camp-q-subj-info">
          <span class="camp-q-subj-label">${subject.label}</span>
          <span class="camp-q-mision">${q.mision}</span>
        </div>
        <div class="camp-q-timer-wrap" id="camp-q-timer">
          <svg class="camp-timer-svg" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none"
              stroke="rgba(0,0,0,.12)" stroke-width="3.5"/>
            <circle id="camp-timer-arc" cx="22" cy="22" r="18" fill="none"
              stroke="${subject.color}" stroke-width="3.5" stroke-linecap="round"
              stroke-dasharray="${CIRCUM}" stroke-dashoffset="0"
              transform="rotate(-90 22 22)"/>
          </svg>
          <span class="camp-q-timer-num" id="camp-q-timer-num">${campState.timerSecs}</span>
        </div>
      </div>

      <p class="camp-q-text">${q.q}</p>

      <div class="camp-q-opts">
        ${q.o.map((opt, i) => `
          <button class="camp-q-opt" data-i="${i}">
            <span class="camp-q-letter">${'ABCD'[i]}</span>
            <span class="camp-q-opt-text">${opt}</span>
          </button>`).join('')}
      </div>

      <div class="camp-q-actions" id="camp-q-actions">
        <button class="camp-reveal-btn" id="camp-reveal-btn">✅ Revelar Respuesta</button>
        <button class="camp-skip-btn"   id="camp-skip-btn">⏭ Saltar</button>
      </div>

      <div class="camp-mini-score">
        ${campState.groups.map((g, i) => `
          <div class="camp-ms-item">
            <span class="camp-ms-dot" style="background:${g.color}"></span>
            <span class="camp-ms-name">${g.name}</span>
            <span class="camp-ms-pts" id="camp-mini-pts-${i}">${g.score}</span>
          </div>`).join('')}
      </div>
    </div>
  `;

  _container.querySelectorAll('.camp-q-opt').forEach(btn =>
    btn.addEventListener('click', () => {
      _sfx('click');
      _container.querySelectorAll('.camp-q-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    })
  );

  $id('camp-reveal-btn').addEventListener('click', () => { _sfx('reveal'); revealAnswer(false); });
  $id('camp-skip-btn').addEventListener('click',   () => revealAnswer(true));

  _startTimer(CIRCUM);
}

function _pickQuestion(subjectKey) {
  const bank = CAMP_BANK[subjectKey];
  if (!bank || !bank.length) return null;

  let pool = bank;
  if (campState.selectedMissions && campState.selectedMissions.size) {
    const filtered = bank.filter(q => campState.selectedMissions.has(q.mision));
    if (filtered.length) pool = filtered;
  }

  const used      = campState.usedQs[subjectKey];
  const poolIdxs  = pool.map(q => bank.indexOf(q));
  const available = poolIdxs.filter(i => !used.includes(i));
  if (!available.length) return null;

  const bankIdx = available[Math.floor(Math.random() * available.length)];
  used.push(bankIdx);
  return bank[bankIdx];
}

/* ── Temporizador circular ── */
function _startTimer(circum) {
  const numEl  = $id('camp-q-timer-num');
  const arcEl  = $id('camp-timer-arc');
  const wrapEl = $id('camp-q-timer');
  if (!numEl) return;
  _stopTimer();
  const total = campState.timerSecs;
  const C     = circum || 107;

  campState.timerInterval = setInterval(() => {
    campState.timerRemaining--;
    const rem = Math.max(0, campState.timerRemaining);
    if (numEl) numEl.textContent = rem;
    if (arcEl) arcEl.style.strokeDashoffset = C * (1 - rem / total);
    const urgent = rem <= 10;
    if (wrapEl) wrapEl.classList.toggle('camp-timer-urgent', urgent);
    if (rem > 0) _sfx(urgent ? 'urgent' : 'tick');
    if (rem <= 0) { _stopTimer(); _sfx('timeout'); revealAnswer(false, true); }
  }, 1000);
}

function _stopTimer() {
  clearInterval(campState.timerInterval);
  campState.timerInterval = null;
}

/* ══════════════════════════════════════════════════════════════
   FASE 4 — REVELAR RESPUESTA
══════════════════════════════════════════════════════════════ */
function revealAnswer(skip, timeout) {
  _stopTimer();
  campState.phase = 'reveal';

  const q = campState.currentQuestion;
  if (!q) { renderHub(); return; }

  _container.querySelectorAll('.camp-q-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.c)                           btn.classList.add('correct');
    else if (btn.classList.contains('selected')) btn.classList.add('wrong');
  });

  const actions = $id('camp-q-actions');
  if (!actions) return;

  actions.innerHTML = `
    <div class="camp-award-section">
      ${(timeout || skip) ? `<p class="camp-timeout-msg">${timeout ? '⏰ Tiempo agotado' : '⏭ Pregunta saltada'}</p>` : ''}
      ${!skip ? `
        <p class="camp-award-label">¿Quién respondió correctamente?</p>
        <div class="camp-award-groups">
          ${campState.groups.map((g, i) => `
            <button class="camp-award-btn" data-gi="${i}" style="--gc:${g.color}">
              <span class="camp-ag-dot" style="background:${g.color}"></span>
              ${g.name}
            </button>`).join('')}
        </div>
        <button class="camp-confirm-pts-btn" id="camp-confirm-pts-btn" disabled>
          + ${campState.pointsPerQ} pts — Selecciona un grupo
        </button>
      ` : ''}
      <button class="camp-next-q-btn" id="camp-next-q-btn">
        ${skip ? '▶ Continuar' : 'Sin puntos — Continuar'}
      </button>
    </div>
  `;

  _container.querySelectorAll('.camp-award-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _sfx('click');
      const gi = +btn.dataset.gi;
      if (campState.selectedGroups.has(gi)) {
        campState.selectedGroups.delete(gi);
        btn.classList.remove('selected');
      } else {
        campState.selectedGroups.add(gi);
        btn.classList.add('selected');
      }
      const cb = $id('camp-confirm-pts-btn');
      if (!cb) return;
      const n = campState.selectedGroups.size;
      cb.disabled    = n === 0;
      cb.textContent = n ? `+ ${campState.pointsPerQ} pts — Asignar a ${n} grupo${n>1?'s':''}` : `+ ${campState.pointsPerQ} pts — Selecciona un grupo`;
    });
  });

  const cb = $id('camp-confirm-pts-btn');
  if (cb) {
    cb.addEventListener('click', () => {
      campState.selectedGroups.forEach(gi => {
        campState.groups[gi].score += campState.pointsPerQ;
        const el = $id(`camp-mini-pts-${gi}`);
        if (el) { el.textContent = campState.groups[gi].score; el.classList.add('camp-pts-bump'); setTimeout(() => el.classList.remove('camp-pts-bump'), 600); }
      });
      _sfx('pts');
      setTimeout(returnToHub, 1400);
    });
  }

  $id('camp-next-q-btn')?.addEventListener('click', returnToHub);
}

function returnToHub() {
  _stopTimer();
  campState.phase = 'hub';
  renderHub();
}

/* ── Registro de navegación (llamado por app.js al cargar) ── */
function campRegisterNav() {
  $id('goto-camp-btn')?.addEventListener('click', () => switchView('view-campeonismo'));
  $id('camp-back-btn')?.addEventListener('click', () => switchView('view-perfil'));
}
window.campRegisterNav = campRegisterNav;
