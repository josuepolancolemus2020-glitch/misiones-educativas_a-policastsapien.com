'use strict';

/* ──────────────────────────────────────────
   Motor de Misiones Dinámico — M.E.T.A.
   Lee ?id= de la URL, carga misiones_db.json
   y renderiza el quiz interactivo.
────────────────────────────────────────── */

const MOTOR_STATE_KEY    = 'meta_v2';
const MOTOR_PROGRESS_KEY = 'meta_motor_progress_v1';

/* ── Estado compartido con la app principal ── */
function loadState() {
  try {
    const raw = localStorage.getItem(MOTOR_STATE_KEY);
    if (raw) return Object.assign(blankState(), JSON.parse(raw));
  } catch (_) {}
  return blankState();
}
function blankState() {
  return { name: '', grade: '2y3ciclo', country: 'HN', xp: 0, visited: [], lastVisited: [] };
}
function saveState(s) {
  try { localStorage.setItem(MOTOR_STATE_KEY, JSON.stringify(s)); } catch (_) {}
}

/* ── Progreso por pregunta (evita XP duplicado) ── */
function loadProgress() {
  try {
    const raw = localStorage.getItem(MOTOR_PROGRESS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {};
}
function saveProgress(p) {
  try { localStorage.setItem(MOTOR_PROGRESS_KEY, JSON.stringify(p)); } catch (_) {}
}

/* ── Arranque ── */
const _params   = new URLSearchParams(window.location.search);
const _misionId = parseInt(_params.get('id'), 10);

if (!_misionId || isNaN(_misionId)) {
  showError('No se especificó una misión válida. Regresa al inicio y selecciona una.');
} else {
  fetch('data/misiones_db.json')
    .then(r => {
      if (!r.ok) throw new Error('No se pudo cargar la base de datos de misiones.');
      return r.json();
    })
    .then(data => {
      const mision = data.misiones.find(m => m.id === _misionId);
      if (!mision) {
        showError(`No se encontró la misión con ID ${_misionId}. Verifica el enlace.`);
      } else {
        iniciarMision(mision);
      }
    })
    .catch(err => showError(err.message));
}

/* ── Variables de sesión ── */
let quiz         = [];
let idx          = 0;
let selOpcion    = -1;
let puntosBonus  = 0;  // XP ganado en esta sesión
let correctasHoy = 0;  // respuestas correctas en esta sesión
let misionActual = null;
let progreso     = {};

/* ── Iniciar misión ── */
function iniciarMision(mision) {
  misionActual = mision;
  quiz         = mision.quiz;
  progreso     = loadProgress();

  document.title = `${mision.titulo} — M.E.T.A.`;
  actualizarXpBadge();
  renderMision(mision);
}

/* ── Badge de XP en topbar ── */
function actualizarXpBadge() {
  const s = loadState();
  const badge = document.getElementById('xp-badge');
  if (badge) badge.textContent = `⭐ ${s.xp} XP`;
}

/* ── Render del esqueleto de misión ── */
function renderMision(mision) {
  const colorVar = `var(--${mision.color})`;
  document.getElementById('contenedor-principal').innerHTML = `
    <div class="mision-wrap">
      <div class="mision-header-card" style="border-left-color:${colorVar}">
        <div class="mision-icono">${mision.icono}</div>
        <div class="mision-meta">
          <h1 id="titulo-mision">${mision.titulo}</h1>
          <p id="subtitulo-mision">${mision.materia_label} · ${mision.ciclo}</p>
          <p id="descripcion-mision">${mision.descripcion}</p>
        </div>
      </div>
      <div id="quiz-container"></div>
    </div>`;

  renderQuizCard();
}

/* ── Render de la tarjeta de quiz ── */
function renderQuizCard() {
  document.getElementById('quiz-container').innerHTML = `
    <div class="quiz-card">
      <div class="quiz-card-title">🧠 Quiz de Comprensión</div>
      <p class="quiz-xp-hint">⭐ +5 XP por respuesta correcta (primera vez por pregunta)</p>
      <p id="progreso-quiz"></p>
      <div id="pregunta-texto"></div>
      <div class="quiz-opciones" id="contenedor-preguntas" role="group" aria-label="Opciones de respuesta"></div>
      <div class="quiz-acciones">
        <button class="btn-verificar" id="btn-verificar" onclick="verificarRespuesta()">✅ Verificar</button>
        <button class="btn-siguiente" id="btn-siguiente">▶ Siguiente</button>
        <button class="btn-reiniciar" onclick="reiniciarQuiz()">🔄 Reiniciar</button>
      </div>
      <div id="feedback-mision" role="alert"></div>
    </div>`;

  renderPregunta();
}

/* ── Render de la pregunta actual ── */
function renderPregunta() {
  const q      = quiz[idx];
  const letras = ['a', 'b', 'c', 'd'];

  document.getElementById('progreso-quiz').textContent = `Pregunta ${idx + 1} de ${quiz.length}`;
  document.getElementById('pregunta-texto').textContent = q.pregunta;
  document.getElementById('contenedor-preguntas').innerHTML = q.opciones
    .map((op, i) =>
      `<button class="quiz-opcion" onclick="seleccionarOpcion(${i})" id="opt-${i}">
         ${letras[i]}) ${op}
       </button>`
    ).join('');

  selOpcion = -1;
  ocultarFeedback();

  const btnSig = document.getElementById('btn-siguiente');
  btnSig.style.display  = 'none';
  btnSig.onclick        = null;

  const btnVer = document.getElementById('btn-verificar');
  btnVer.disabled = false;
}

/* ── Selección de opción ── */
function seleccionarOpcion(i) {
  selOpcion = i;
  document.querySelectorAll('.quiz-opcion').forEach((el, j) => {
    el.classList.toggle('sel', j === i);
  });
}

/* ── Verificar respuesta ── */
function verificarRespuesta() {
  if (selOpcion === -1) {
    mostrarFeedback('Selecciona una opción antes de verificar.', false);
    return;
  }

  const q           = quiz[idx];
  const progressKey = `m${misionActual.id}_q${idx}`;
  const opts        = document.querySelectorAll('.quiz-opcion');

  /* Bloquear opciones y botón de verificar */
  opts.forEach(el => { el.onclick = null; el.disabled = true; });
  document.getElementById('btn-verificar').disabled = true;

  if (selOpcion === q.correcta) {
    opts[selOpcion].classList.add('correcto');
    mostrarFeedback('¡Correcto! Muy bien. 🎉', true);
    correctasHoy++;

    /* +5 XP solo si es la primera vez que se responde bien */
    if (!progreso[progressKey]) {
      progreso[progressKey] = true;
      saveProgress(progreso);
      puntosBonus += 5;

      const s = loadState();
      s.xp += 5;
      saveState(s);
      actualizarXpBadge();
    }
  } else {
    opts[selOpcion].classList.add('incorrecto');
    opts[q.correcta].classList.add('correcto');
    mostrarFeedback('Incorrecto. Observa la respuesta correcta.', false);
  }

  /* Configurar botón siguiente o resultado */
  const btnSig = document.getElementById('btn-siguiente');
  if (idx < quiz.length - 1) {
    btnSig.style.display = 'inline-flex';
    btnSig.textContent   = '▶ Siguiente';
    btnSig.onclick       = siguientePregunta;
  } else {
    btnSig.style.display = 'inline-flex';
    btnSig.textContent   = '🏆 Ver resultado';
    btnSig.onclick       = mostrarResultado;
  }
}

/* ── Avanzar a la siguiente pregunta ── */
function siguientePregunta() {
  idx++;
  renderPregunta();
}

/* ── Reiniciar quiz (mantiene progreso de XP ya ganado) ── */
function reiniciarQuiz() {
  idx          = 0;
  selOpcion    = -1;
  puntosBonus  = 0;
  correctasHoy = 0;
  renderPregunta();
}

/* ── Pantalla de resultado final ── */
function mostrarResultado() {
  const total = quiz.length;
  const pct   = Math.round((correctasHoy / total) * 100);

  let emoji, titulo;
  if (pct >= 89) { emoji = '🏆'; titulo = '¡Excelente! ¡Dominaste el tema!'; }
  else if (pct >= 67) { emoji = '👍'; titulo = '¡Muy bien! Sigue así.'; }
  else if (pct >= 44) { emoji = '💪'; titulo = '¡Buen esfuerzo! Practica un poco más.'; }
  else { emoji = '📖'; titulo = '¡Sigue estudiando! Tú puedes lograrlo.'; }

  document.getElementById('quiz-container').innerHTML = `
    <div class="resultado-card">
      <div class="resultado-emoji">${emoji}</div>
      <h2 class="resultado-titulo">${titulo}</h2>
      <p class="resultado-score">${correctasHoy} de ${total} respuestas correctas</p>
      <p class="resultado-xp">
        ${puntosBonus > 0
          ? `Ganaste <strong>+${puntosBonus} XP</strong> de bonificación en este quiz.`
          : 'Las respuestas de este quiz ya habían sido respondidas correctamente antes. ¡Sin bonificación extra!'}
      </p>
      <div class="resultado-acciones">
        <button class="btn-resultado secondary" onclick="repetirQuiz()">🔄 Repetir</button>
        <a href="index.html" class="btn-resultado primary">🏠 Volver al Inicio</a>
      </div>
    </div>`;
}

/* ── Repetir el quiz desde cero (sin borrar progreso de XP) ── */
function repetirQuiz() {
  idx          = 0;
  selOpcion    = -1;
  puntosBonus  = 0;
  correctasHoy = 0;
  renderQuizCard();
}

/* ── Feedback visual ── */
function mostrarFeedback(msg, ok) {
  const el = document.getElementById('feedback-mision');
  if (!el) return;
  el.textContent = msg;
  el.className   = `show ${ok ? 'ok' : 'err'}`;
}
function ocultarFeedback() {
  const el = document.getElementById('feedback-mision');
  if (el) { el.className = ''; el.textContent = ''; }
}

/* ── Pantalla de error ── */
function showError(msg) {
  document.getElementById('contenedor-principal').innerHTML = `
    <div class="error-card">
      <p>⚠️</p>
      <p>${msg}</p>
      <a href="index.html" style="display:inline-block;margin-top:16px;color:#dc2626;font-weight:700;text-decoration:underline;">
        ← Regresar al inicio
      </a>
    </div>`;
}
