'use strict';

/* ============================================================
   CAMPEONÍSIMO — Torneo académico estilo programa de TV
   ------------------------------------------------------------
   Modos:
   · Torneo  — 3 rondas (Conocimiento, Relámpago ×2, Gran Final ×3
               con Apuesta Final), turnos rotativos, rebote,
               muerte súbita, normativas, podio e insignias.
   · Práctica — preguntas individuales con retroalimentación
               inmediata y sugerencia de misiones a repasar.
   · Salón de la Fama — historial persistente de torneos e
               insignias (localStorage METAS_CAMP_V1).
   Banco de preguntas: CAMP_BANK (js/data/campeonismo-bank.js).
   ============================================================ */

/* ── Materias y colores ── */
const CAMP_SUBJECTS = [
  { key: 'español',     label: 'Español',      short: 'ESP', icon: '📝', color: '#b45309', bg: '#fef3c7', cls: 'esp'  },
  { key: 'matemáticas', label: 'Matemáticas',   short: 'MAT', icon: '📐', color: '#2563eb', bg: '#dbeafe', cls: 'mat'  },
  { key: 'naturales',   label: 'C. Naturales',  short: 'NAT', icon: '🌿', color: '#0d9488', bg: '#ccfbf1', cls: 'cnat' },
  { key: 'sociales',    label: 'C. Sociales',   short: 'SOC', icon: '🌍', color: '#dc2626', bg: '#fee2e2', cls: 'csoc' },
];

const CAMP_COLORS   = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#06b6d4','#84cc16','#f97316'];
const CAMP_MASCOTAS = ['🦅','🐆','🦈','🐺','🦁','🐉','🐢','🐍'];

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
    case 'click':    _tone(700, 'sine', 0.06, 0.18); break;
    case 'spin':     for (let i = 0; i < 10; i++) _tone(180 + i * 55, 'sawtooth', 0.08, 0.12, i * 0.045); break;
    case 'spin_end': _tone(880, 'sine', 0.12, 0.28, 0); _tone(1100, 'sine', 0.12, 0.32, 0.12); _tone(660, 'sine', 0.18, 0.4, 0.26); break;
    case 'reveal':   _tone(523, 'sine', 0.14, 0.32, 0); _tone(659, 'sine', 0.14, 0.32, 0.10); _tone(784, 'sine', 0.16, 0.36, 0.20); break;
    case 'pts':      [523, 659, 784, 1047].forEach((f, i) => _tone(f, 'sine', 0.12, 0.32, i * 0.07)); break;
    case 'wrong':    _tone(220, 'sawtooth', 0.28, 0.30, 0); _tone(180, 'sawtooth', 0.34, 0.30, 0.10); break;
    case 'steal':    [392, 523, 392, 659].forEach((f, i) => _tone(f, 'square', 0.08, 0.16, i * 0.09)); break;
    case 'timeout':  _tone(400, 'sawtooth', 0.18, 0.3, 0); _tone(300, 'sawtooth', 0.18, 0.3, 0.22); _tone(180, 'sawtooth', 0.25, 0.32, 0.44); break;
    case 'tick':     _tone(900, 'square', 0.03, 0.08); break;
    case 'urgent':   _tone(1400, 'square', 0.04, 0.18); break;
    case 'drum':     for (let i = 0; i < 14; i++) _tone(120 + Math.random() * 40, 'triangle', 0.05, 0.20, i * 0.09); break;
    case 'start':    _tone(392, 'sine', 0.12, 0.3, 0); _tone(523, 'sine', 0.12, 0.3, 0.13); _tone(659, 'sine', 0.16, 0.4, 0.26); _tone(784, 'sine', 0.20, 0.5, 0.39); break;
    case 'fanfare':
      [392, 392, 392, 523, 659, 523, 784].forEach((f, i) => _tone(f, 'sine', i === 6 ? 0.5 : 0.14, 0.4, i * 0.14));
      [196, 262, 330, 392].forEach((f, i) => _tone(f, 'triangle', 0.4, 0.18, 0.98 + i * 0.02));
      break;
  }
}

/* ══════════════════════════════════════════════════════════════
   PERSISTENCIA — Salón de la Fama (METAS_CAMP_V1)
══════════════════════════════════════════════════════════════ */
const CAMP_KEY = 'METAS_CAMP_V1';

function _campLoad() {
  try {
    const o = JSON.parse(localStorage.getItem(CAMP_KEY));
    return (o && typeof o === 'object' && Array.isArray(o.historial)) ? o : { historial: [] };
  } catch (_) { return { historial: [] }; }
}
function _campSave(data) {
  try { localStorage.setItem(CAMP_KEY, JSON.stringify(data)); } catch (_) {}
}

/* ══════════════════════════════════════════════════════════════
   DEFINICIÓN DE RONDAS (formato TV)
══════════════════════════════════════════════════════════════ */
function _rondasDef(cfg) {
  return [
    { n: 1, nombre: 'Ronda de Conocimiento', icon: '📚', mult: 1, vueltas: cfg.vueltasR1, timerFactor: 1,
      desc: 'Turnos rotativos. Cada acierto vale los puntos base.' },
    { n: 2, nombre: 'Ronda Relámpago',       icon: '⚡', mult: 2, vueltas: 1, timerFactor: 0.5,
      desc: '¡La mitad de tiempo y puntos DOBLES!' },
    { n: 3, nombre: 'La Gran Final',         icon: '🏆', mult: 3, vueltas: 1, timerFactor: 1, final: true,
      desc: 'Solo los mejores. Cada finalista APUESTA sus puntos: si acierta los gana, si falla los pierde.' },
  ];
}

/* ══════════════════════════════════════════════════════════════
   ESTADO GLOBAL
══════════════════════════════════════════════════════════════ */
let CAMP = {
  screen: 'home',            /* home | setup | play | practice | fame */
  T: null,                   /* estado del torneo activo */
  P: null,                   /* estado de la práctica activa */
};

let _container = null;
let _timerInt  = null;
const $id = id => document.getElementById(id);

function _stopTimer() { clearInterval(_timerInt); _timerInt = null; }

function _missionsBySubject(subjectKey) {
  const bank = _bank()[subjectKey] || [];
  const seen = new Set();
  return bank.map(q => q.mision).filter(m => { if (seen.has(m)) return false; seen.add(m); return true; });
}

/* ══════════════════════════════════════════════════════════════
   BANCO DINÁMICO — preguntas extraídas de las misiones
   El botón "🔄 Actualizar banco" lee el evalMCBank de cada misión
   del catálogo que aún no esté cubierta y lo guarda en
   localStorage (METAS_CAMP_BANK_EXTRA_V1). El juego usa siempre
   el banco fusionado: CAMP_BANK (estático) + extra (dinámico).
══════════════════════════════════════════════════════════════ */
const CAMP_EXTRA_KEY = 'METAS_CAMP_BANK_EXTRA_V1';
let _bankFullCache = null;

function _extraLoad() {
  try {
    const o = JSON.parse(localStorage.getItem(CAMP_EXTRA_KEY));
    return (o && typeof o === 'object') ? o : {};
  } catch (_) { return {}; }
}
function _extraSave(o) {
  try { localStorage.setItem(CAMP_EXTRA_KEY, JSON.stringify(o)); } catch (_) {}
}

function _bank() {
  if (_bankFullCache) return _bankFullCache;
  const extra  = _extraLoad();
  const merged = {};
  CAMP_SUBJECTS.forEach(s => {
    const base   = (typeof CAMP_BANK !== 'undefined' && CAMP_BANK[s.key]) || [];
    const vistos = new Set(base.map(q => _campNorm(q.q)));
    const add    = (extra[s.key] || []).filter(q =>
      q && q.q && Array.isArray(q.o) && typeof q.c === 'number' && !vistos.has(_campNorm(q.q)));
    merged[s.key] = base.concat(add);
  });
  _bankFullCache = merged;
  return merged;
}

/* Extrae un banco de opción múltiple de un texto JS (escáner con soporte
   de cadenas). Prueba evalMCBank ({q,o,a|c}) y como respaldo QUIZ_QS
   ({q,opts,ans}, formato de las misiones de primer ciclo). */
function _extraerMCBank(txt) {
  return _extraerArray(txt, 'evalMCBank') || _extraerArray(txt, 'QUIZ_QS');
}

function _extraerArray(txt, nombre) {
  const m = txt.match(new RegExp('(?:const|var|let)\\s+' + nombre + '\\s*=\\s*\\['));
  if (!m) return null;
  const start = txt.indexOf('[', m.index);
  let depth = 0, inStr = null, i = start;
  for (; i < txt.length; i++) {
    const ch = txt[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') { inStr = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) break; }
  }
  if (depth !== 0) return null;
  let arr;
  try { arr = new Function('return ' + txt.slice(start, i + 1))(); }
  catch (_) { return null; }
  if (!Array.isArray(arr)) return null;
  return arr
    .map(it => {
      if (!it || typeof it.q !== 'string') return null;
      const o = Array.isArray(it.o) ? it.o : it.opts;       /* QUIZ_QS usa opts/ans */
      if (!Array.isArray(o) || o.length < 2) return null;
      let c = (typeof it.c === 'number') ? it.c : (typeof it.a === 'number') ? it.a : it.ans;
      return { q: it.q, o: o.map(op => String(op).replace(/^[a-dA-D]\)\s*/, '')), c };
    })
    .filter(it => it && typeof it.c === 'number' && it.c >= 0 && it.c < it.o.length);
}

/* Cobertura: cuántas misiones del catálogo tienen preguntas en el banco */
function _coberturaBanco() {
  const bank = _bank();
  let preguntas = 0;
  const cubiertas = new Set();
  CAMP_SUBJECTS.forEach(s => (bank[s.key] || []).forEach(q => {
    preguntas++;
    const m = _findMissionByTitle(q.mision);
    if (m) cubiertas.add(m.id);
  }));
  const total = (typeof MISSIONS !== 'undefined') ? MISSIONS.length : 0;
  return { preguntas, cubiertas: cubiertas.size, total };
}

/* Descarga y agrega los bancos de las misiones que faltan */
async function actualizarBanco(status) {
  if (typeof MISSIONS === 'undefined') return { nuevasMisiones: 0, nuevasPreguntas: 0, errores: 0, pendientes: 0 };
  const bank = _bank();

  const cubiertas = new Set();
  CAMP_SUBJECTS.forEach(s => (bank[s.key] || []).forEach(q => {
    const m = _findMissionByTitle(q.mision);
    if (m) cubiertas.add(m.id);
  }));
  const subjOk = new Set(CAMP_SUBJECTS.map(s => s.key));
  const pendientes = MISSIONS.filter(m => !cubiertas.has(m.id));

  const extra = _extraLoad();
  let nuevasMisiones = 0, nuevasPreguntas = 0, errores = 0;

  for (let k = 0; k < pendientes.length; k++) {
    const m = pendientes[k];
    if (status) status(`Leyendo ${k + 1}/${pendientes.length}: ${m.title}…`);
    try {
      const html = await fetch(encodeURI(m.url)).then(r => r.ok ? r.text() : Promise.reject(new Error('HTTP ' + r.status)));
      const dir  = m.url.slice(0, m.url.lastIndexOf('/') + 1);
      const srcs = [...html.matchAll(/<script[^>]+src=["'](js\/[^"']+)["']/g)]
        .map(x => x[1]).filter(s => !/html2canvas/i.test(s));
      let items = null;
      for (const s of srcs) {
        const js = await fetch(encodeURI(dir + s)).then(r => r.ok ? r.text() : null).catch(() => null);
        if (!js) continue;
        items = _extraerMCBank(js);
        if (items && items.length) break;
      }
      if (items && items.length) {
        const subjKey = subjOk.has(m.subject) ? m.subject : 'español';   /* bach → español */
        extra[subjKey] = (extra[subjKey] || []).concat(
          items.map(it => ({ q: it.q, o: it.o, c: it.c, mision: m.title })));
        nuevasMisiones++;
        nuevasPreguntas += items.length;
      } else {
        errores++;
      }
    } catch (_) { errores++; }
  }

  _extraSave(extra);
  _bankFullCache = null;
  return { nuevasMisiones, nuevasPreguntas, errores, pendientes: pendientes.length };
}

/* ══════════════════════════════════════════════════════════════
   PUNTO DE ENTRADA
══════════════════════════════════════════════════════════════ */
function initCampeonismo() {
  _container = $id('camp-content');
  if (!_container) return;
  if (typeof CAMP_BANK === 'undefined') {
    _container.innerHTML = `
      <div class="camp-error-msg">
        <p>⚠️ El banco de preguntas no está cargado.</p>
        <p style="font-size:13px;color:var(--muted);margin-top:6px;">Asegúrate de que el archivo <strong>campeonismo-bank.js</strong> esté disponible.</p>
      </div>`;
    return;
  }
  switch (CAMP.screen) {
    case 'setup':    renderSetup();       break;
    case 'play':     renderTurno();       break;
    case 'practice': renderPractice();    break;
    case 'fame':     renderFame();        break;
    default:         renderCampHome();
  }
}
window.initCampeonismo = initCampeonismo;

/* ══════════════════════════════════════════════════════════════
   PANTALLA DE INICIO DE LA HERRAMIENTA
══════════════════════════════════════════════════════════════ */
function renderCampHome() {
  CAMP.screen = 'home';
  _stopTimer();
  const data   = _campLoad();
  const total  = data.historial.length;
  const ultimo = total ? data.historial[total - 1] : null;

  _container.innerHTML = `
    <div class="camp-setup">
      <div class="camp-setup-hero">
        <div class="camp-trophy">🏆</div>
        <h2 class="camp-setup-title">Campeonísimo</h2>
        <p class="camp-setup-sub">El torneo académico del aula, estilo programa de TV</p>
        ${ultimo ? `<p class="camp-home-last">Último campeón: <strong>${ultimo.mascota || ''} ${ultimo.campeon}</strong>${ultimo.lugar ? ' · ' + ultimo.lugar : ''}</p>` : ''}
      </div>

      <button class="camp-home-card ch-torneo" id="camp-h-torneo">
        <span class="camp-hc-icon">🎬</span>
        <span class="camp-hc-info">
          <strong>Modo Torneo</strong>
          <em>3 rondas, apuesta final, insignias y podio</em>
        </span>
        <i class="fa-solid fa-chevron-right"></i>
      </button>

      <button class="camp-home-card ch-practica" id="camp-h-practica">
        <span class="camp-hc-icon">🎯</span>
        <span class="camp-hc-info">
          <strong>Modo Práctica</strong>
          <em>Entrena con los temas que quieras, a tu ritmo</em>
        </span>
        <i class="fa-solid fa-chevron-right"></i>
      </button>

      <button class="camp-home-card ch-fama" id="camp-h-fama">
        <span class="camp-hc-icon">🏅</span>
        <span class="camp-hc-info">
          <strong>Salón de la Fama</strong>
          <em>${total ? total + ' torneo' + (total > 1 ? 's' : '') + ' jugado' + (total > 1 ? 's' : '') + ' e insignias' : 'Aquí quedará la historia de tus torneos'}</em>
        </span>
        <i class="fa-solid fa-chevron-right"></i>
      </button>

      <button class="camp-home-card ch-normas" id="camp-h-normas">
        <span class="camp-hc-icon">📜</span>
        <span class="camp-hc-info">
          <strong>Normas del juego</strong>
          <em>Las reglas oficiales, como en la televisión</em>
        </span>
        <i class="fa-solid fa-chevron-right"></i>
      </button>

      <div class="camp-card camp-bank-card">
        <div class="camp-card-label">🧠 Banco de preguntas</div>
        <p class="camp-bank-status" id="camp-bank-status">${_bankStatusTxt()}</p>
        <button class="camp-bank-btn" id="camp-bank-update">🔄 Actualizar banco con las misiones nuevas</button>
        <p class="camp-bank-hint">Lee las evaluaciones de las misiones que aún no están en el banco y agrega sus preguntas al torneo y a la práctica.</p>
      </div>
    </div>`;

  $id('camp-h-torneo').addEventListener('click',   () => { _sfx('click'); renderSetup(); });
  $id('camp-h-practica').addEventListener('click', () => { _sfx('click'); renderPracticeSetup(); });
  $id('camp-h-fama').addEventListener('click',     () => { _sfx('click'); renderFame(); });
  $id('camp-h-normas').addEventListener('click',   () => { _sfx('click'); _showNormas(null); });

  $id('camp-bank-update').addEventListener('click', async () => {
    _sfx('click');
    const btn = $id('camp-bank-update');
    const st  = $id('camp-bank-status');
    btn.disabled = true;
    btn.textContent = '⏳ Actualizando…';
    try {
      const r = await actualizarBanco(msg => { if (st) st.textContent = msg; });
      _sfx(r.nuevasPreguntas ? 'pts' : 'click');
      if (st) {
        if (!r.pendientes)            st.textContent = '✅ El banco ya cubre todas las misiones. ' + _bankStatusTxt();
        else if (r.nuevasPreguntas)   st.textContent = `✅ ¡Listo! +${r.nuevasPreguntas} preguntas de ${r.nuevasMisiones} misión${r.nuevasMisiones > 1 ? 'es' : ''}. ${_bankStatusTxt()}`;
        else                          st.textContent = '⚠️ No se pudieron leer las misiones pendientes. Revisa la conexión e intenta de nuevo.';
      }
    } catch (_) {
      if (st) st.textContent = '⚠️ Ocurrió un error al actualizar. Intenta de nuevo con conexión.';
    }
    btn.disabled = false;
    btn.textContent = '🔄 Actualizar banco con las misiones nuevas';
  });
}

function _bankStatusTxt() {
  const c = _coberturaBanco();
  return `${c.preguntas} preguntas · cubre ${c.cubiertas} de ${c.total} misiones`;
}

/* ══════════════════════════════════════════════════════════════
   NORMAS (modal) — generadas según la configuración
══════════════════════════════════════════════════════════════ */
function _normasHTML(cfg) {
  const c = cfg || { vueltasR1: 2, basePts: 10, reboteOn: true, finalistas: 2, timerSecs: 30, temaMode: 'ruleta', comodines: 1 };
  const temaTxt = c.temaMode === 'ruleta'   ? 'La ruleta decide el tema de cada turno.'
                : c.temaMode === 'eleccion' ? 'El grupo en turno elige el tema de su pregunta.'
                : `La ruleta decide el tema, pero cada grupo tiene ${c.comodines} comodín${c.comodines > 1 ? 'es' : ''} «Yo elijo» para escoger tema.`;
  return `
    <ol class="camp-normas-list">
      <li><strong>Turnos.</strong> Los grupos participan en orden. En su turno, solo el grupo en turno responde primero. ${temaTxt}</li>
      <li><strong>📚 Ronda 1 — Conocimiento.</strong> ${c.vueltasR1} vuelta${c.vueltasR1 > 1 ? 's' : ''} completa${c.vueltasR1 > 1 ? 's' : ''}. Cada acierto vale <strong>${c.basePts} pts</strong>. Tiempo por pregunta: ${c.timerSecs}s.</li>
      ${c.reboteOn ? `<li><strong>🔁 Rebote.</strong> Si el grupo en turno falla, otro grupo puede robar la pregunta y ganar <strong>la mitad de los puntos</strong>.</li>` : ''}
      <li><strong>⚡ Ronda 2 — Relámpago.</strong> Una vuelta con la <strong>mitad de tiempo</strong> y puntos <strong>DOBLES</strong>.</li>
      <li><strong>🏆 Ronda 3 — La Gran Final.</strong> Clasifican los <strong>${c.finalistas} mejores</strong>. Si hay empate en el corte, los grupos empatados juegan <strong>muerte súbita</strong> por los lugares: nadie queda fuera sin competir. Cada finalista elige tema y <strong>apuesta</strong> sus puntos antes de ver la pregunta: si acierta los gana, si falla los pierde.</li>
      <li><strong>⚔️ Muerte súbita.</strong> Cada grupo empatado responde <strong>su propia pregunta</strong> por turnos. Al completar la ronda: quien acierta sigue, quien falla queda fuera. Si todos aciertan o todos fallan, se juega otra ronda. Se usa para el empate en el corte a la final y para el empate por el campeonato.</li>
      ${c.variar === false ? '' : `<li><strong>🔀 Preguntas variadas.</strong> Las opciones cambian de orden, algunas preguntas se replantean («¿es correcta esta respuesta?») y se evita repetir las de torneos recientes: aquí se gana con conocimiento, no de memoria.</li>`}
      <li><strong>🎖️ Insignias.</strong> Al final se otorgan insignias (Campeón, Racha de Fuego, Rey Relámpago, Remontada…) que quedan en el Salón de la Fama.</li>
      <li><strong>👨‍🏫 El jurado.</strong> La palabra del docente-presentador es definitiva: si el tiempo se agota por descuido puede validar la respuesta, y con <strong>✏️ Editar puntos</strong> corrige el marcador para que el grupo que acertó siga participando. ¡Juego limpio siempre!</li>
    </ol>`;
}

function _showNormas(cfg) {
  const back = document.createElement('div');
  back.className = 'camp-modal-backdrop';
  back.innerHTML = `
    <div class="camp-modal">
      <div class="camp-modal-head">
        <span>📜 Normas del Campeonísimo</span>
        <button class="camp-modal-close" aria-label="Cerrar">✕</button>
      </div>
      ${_normasHTML(cfg)}
      <button class="camp-start-btn camp-modal-ok">¡Entendido!</button>
    </div>`;
  back.querySelector('.camp-modal-close').addEventListener('click', () => back.remove());
  back.querySelector('.camp-modal-ok').addEventListener('click', () => { _sfx('click'); back.remove(); });
  back.addEventListener('click', e => { if (e.target === back) back.remove(); });
  document.body.appendChild(back);
}

/* ══════════════════════════════════════════════════════════════
   TORNEO — CONFIGURACIÓN
══════════════════════════════════════════════════════════════ */
function renderSetup() {
  CAMP.screen = 'setup';
  _stopTimer();

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
        <div class="camp-trophy">🎬</div>
        <h2 class="camp-setup-title">Nuevo Torneo</h2>
        <p class="camp-setup-sub">Configura el torneo antes de salir al aire</p>
      </div>

      <div class="camp-card">
        <div class="camp-card-label">📍 Lugar o evento (opcional)</div>
        <input type="text" class="camp-gi-input camp-lugar-input" id="camp-lugar"
          placeholder="Ej.: Gira — Instituto San José" maxlength="48" autocomplete="off">
      </div>

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

      <div class="camp-card">
        <div class="camp-card-label">🎲 ¿Quién decide el tema?</div>
        <div class="camp-tema-btns">
          <button class="camp-tema-btn" data-tm="ruleta">🎡 La ruleta</button>
          <button class="camp-tema-btn" data-tm="eleccion">🙋 El grupo elige</button>
          <button class="camp-tema-btn active" data-tm="mixto">🎡+🙋 Mixto</button>
        </div>
        <p class="camp-cfg-hint" id="camp-tema-hint">Mixto: gira la ruleta, pero cada grupo tiene comodines «Yo elijo».</p>
        <div class="camp-timer-row" id="camp-comodin-row">
          <span class="camp-cfg-mini">Comodines:</span>
          ${[1,2,3].map(k => `<button class="camp-com-btn${k===1?' active':''}" data-k="${k}">${k}</button>`).join('')}
        </div>
      </div>

      <div class="camp-card">
        <div class="camp-card-label">📚 Vueltas de la Ronda 1</div>
        <div class="camp-timer-row">
          ${[1,2,3].map(v => `<button class="camp-vuelta-btn${v===2?' active':''}" data-v="${v}">${v} vuelta${v>1?'s':''}</button>`).join('')}
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
        <div class="camp-card-label">Puntos base por acierto</div>
        <div class="camp-timer-row">
          ${[5,10,15,20].map(p =>
            `<button class="camp-pts-btn${p===10?' active':''}" data-p="${p}">${p} pts</button>`
          ).join('')}
        </div>
      </div>

      <div class="camp-card">
        <div class="camp-card-label">🔁 Rebote (robo de pregunta)</div>
        <div class="camp-timer-row">
          <button class="camp-reb-btn active" data-r="1">Sí, por mitad de puntos</button>
          <button class="camp-reb-btn" data-r="0">No</button>
        </div>
      </div>

      <div class="camp-card">
        <div class="camp-card-label">🏆 Finalistas de la Gran Final</div>
        <div class="camp-timer-row">
          ${[2,3].map(f => `<button class="camp-fin-btn${f===2?' active':''}" data-f="${f}">${f} grupos</button>`).join('')}
        </div>
      </div>

      <div class="camp-card">
        <div class="camp-card-label">🔀 Variar las preguntas</div>
        <div class="camp-timer-row">
          <button class="camp-var-btn active" data-x="1">Sí, variadas</button>
          <button class="camp-var-btn" data-x="0">No, tal cual</button>
        </div>
        <p class="camp-cfg-hint">Baraja el orden de las opciones, replantea preguntas («¿es correcta esta respuesta?») y evita repetir las de torneos recientes — para que nadie gane de memoria.</p>
      </div>

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

      <button class="camp-action-btn camp-ver-normas" id="camp-ver-normas">📜 Ver normas con esta configuración</button>
      <button class="camp-start-btn" id="camp-start-btn">🎬 ¡Al aire! Comenzar torneo</button>
      <button class="camp-action-btn" id="camp-setup-back">← Volver</button>
    </div>
  `;

  const activate = (sel, cb) => _container.querySelectorAll(sel).forEach(btn =>
    btn.addEventListener('click', () => {
      _sfx('click');
      _container.querySelectorAll(sel).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (cb) cb(btn);
    })
  );

  activate('.camp-num-btn', btn => { $id('camp-group-names').innerHTML = _genGroupInputs(+btn.dataset.n); });
  activate('.camp-timer-btn');
  activate('.camp-pts-btn');
  activate('.camp-vuelta-btn');
  activate('.camp-reb-btn');
  activate('.camp-fin-btn');
  activate('.camp-com-btn');
  activate('.camp-var-btn');
  activate('.camp-tema-btn', btn => {
    const tm   = btn.dataset.tm;
    const hint = $id('camp-tema-hint');
    const row  = $id('camp-comodin-row');
    if (hint) hint.textContent =
      tm === 'ruleta'   ? 'La ruleta manda: el azar decide el tema de cada turno.'
    : tm === 'eleccion' ? 'Cada grupo elige el tema de su pregunta en su turno.'
    : 'Mixto: gira la ruleta, pero cada grupo tiene comodines «Yo elijo».';
    if (row) row.style.display = tm === 'mixto' ? '' : 'none';
  });

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

  $id('camp-ver-normas').addEventListener('click', () => { _sfx('click'); _showNormas(_readSetupCfg()); });
  $id('camp-start-btn').addEventListener('click', () => { _sfx('click'); startTorneo(); });
  $id('camp-setup-back').addEventListener('click', () => { _sfx('click'); renderCampHome(); });
}

function _genGroupInputs(n) {
  return Array.from({ length: n }, (_, i) => `
    <div class="camp-group-input-row">
      <span class="camp-gi-badge" style="background:${CAMP_COLORS[i]}">${CAMP_MASCOTAS[i]}</span>
      <input type="text" class="camp-gi-input" id="camp-gi-${i}"
        placeholder="Grupo ${i+1}" maxlength="18" autocomplete="off">
    </div>`
  ).join('');
}

function _readSetupCfg() {
  const pick = (sel, attr, def) => {
    const b = _container.querySelector(sel + '.active');
    return b ? +b.dataset[attr] : def;
  };
  const temaBtn = _container.querySelector('.camp-tema-btn.active');
  return {
    n:          pick('.camp-num-btn', 'n', 4),
    timerSecs:  pick('.camp-timer-btn', 't', 30),
    basePts:    pick('.camp-pts-btn', 'p', 10),
    vueltasR1:  pick('.camp-vuelta-btn', 'v', 2),
    reboteOn:   pick('.camp-reb-btn', 'r', 1) === 1,
    finalistas: pick('.camp-fin-btn', 'f', 2),
    comodines:  pick('.camp-com-btn', 'k', 1),
    variar:     pick('.camp-var-btn', 'x', 1) === 1,
    temaMode:   temaBtn ? temaBtn.dataset.tm : 'mixto',
    lugar:      ($id('camp-lugar') && $id('camp-lugar').value.trim()) || '',
  };
}

function startTorneo() {
  const cfg = _readSetupCfg();
  const n   = cfg.n;

  const groups = Array.from({ length: n }, (_, i) => {
    const inp = $id(`camp-gi-${i}`);
    return {
      name: (inp && inp.value.trim()) || `Grupo ${i+1}`,
      color: CAMP_COLORS[i], mascota: CAMP_MASCOTAS[i],
      score: 0, streak: 0, bestStreak: 0,
      aciertos: 0, fallos: 0, robos: 0, ptsR2: 0,
      comodines: cfg.temaMode === 'mixto' ? cfg.comodines : 0,
      posR1: 0, apostoTodo: false, eliminado: false,
    };
  });

  cfg.finalistas = Math.min(cfg.finalistas, n);

  const checked = [..._container.querySelectorAll('.camp-ms-ck:checked')];

  CAMP.T = {
    cfg,
    groups,
    selectedMissions: checked.length ? new Set(checked.map(c => c.value)) : null,
    usedQs: { español: [], 'matemáticas': [], naturales: [], sociales: [] },
    rondaIdx: 0, vuelta: 1, turnIdx: 0,
    order: groups.map((_, i) => i),
    wheelRotation: 0,
    currentSubject: null, currentQ: null,
    fase: 'turno',            /* turno | pregunta | apuesta | muerte */
    apuesta: 0,
    muerte: null,             /* estado de muerte súbita (ver sección MUERTE SÚBITA) */
    insignias: [],
  };

  CAMP.screen = 'play';
  _sfx('start');
  _showNormas(cfg);
  renderRondaIntro();
}

/* ══════════════════════════════════════════════════════════════
   TORNEO — INTRO DE RONDA
══════════════════════════════════════════════════════════════ */
function renderRondaIntro() {
  const T = CAMP.T; if (!T) { renderCampHome(); return; }
  const R = _rondasDef(T.cfg)[T.rondaIdx];
  _stopTimer();
  _sfx('drum');

  _container.innerHTML = `
    <div class="camp-ronda-intro camp-ri-${R.n}">
      <div class="camp-ri-num">RONDA ${R.n}</div>
      <div class="camp-ri-icon">${R.icon}</div>
      <h2 class="camp-ri-nombre">${R.nombre}</h2>
      <p class="camp-ri-desc">${R.desc}</p>
      <div class="camp-ri-datos">
        <span>✖️ Puntos ×${R.mult}</span>
        <span>⏱ ${Math.max(8, Math.round(T.cfg.timerSecs * R.timerFactor))}s</span>
        ${R.final ? `<span>🎲 Apuesta libre</span>` : `<span>🔄 ${R.vueltas} vuelta${R.vueltas > 1 ? 's' : ''}</span>`}
      </div>
      ${R.final ? _clasificadosHTML() : ''}
      <button class="camp-start-btn" id="camp-ri-go">${R.final ? '🎰 Comenzar la Gran Final' : '▶ Comenzar ronda'}</button>
    </div>`;

  $id('camp-ri-go').addEventListener('click', () => { _sfx('start'); renderTurno(); });
}

function _clasificadosHTML() {
  const T = CAMP.T;
  return `
    <div class="camp-ri-clasif">
      <div class="camp-ri-clasif-title">Clasifican a la final:</div>
      ${T.order.map(gi => {
        const g = T.groups[gi];
        return `<div class="camp-ri-fin"><span class="camp-ms-dot" style="background:${g.color}"></span> ${g.mascota} <strong>${g.name}</strong> — ${g.score} pts</div>`;
      }).join('')}
      ${T.groups.some(g => g.eliminado) ? `<p class="camp-ri-elim">Los demás grupos siguen sumando su experiencia desde la banca. 👏</p>` : ''}
    </div>`;
}

/* ══════════════════════════════════════════════════════════════
   TORNEO — PANTALLA DE TURNO (ruleta / elección de tema)
══════════════════════════════════════════════════════════════ */
function _turnGroup() {
  const T = CAMP.T;
  return T.groups[T.order[T.turnIdx]];
}

function renderTurno() {
  const T = CAMP.T; if (!T) { renderCampHome(); return; }
  CAMP.screen = 'play';
  T.fase = 'turno';
  T.currentSubject = null;
  _stopTimer();

  const R = _rondasDef(T.cfg)[T.rondaIdx];
  const g = _turnGroup();
  const puedeElegir = T.cfg.temaMode === 'eleccion' || R.final ||
                      (T.cfg.temaMode === 'mixto' && g.comodines > 0);
  const soloElige   = T.cfg.temaMode === 'eleccion' || R.final;

  _container.innerHTML = `
    <div class="camp-hub">

      <div class="camp-ronda-banner camp-rb-${R.n}">
        <span>${R.icon} ${R.nombre}</span>
        <span class="camp-rb-detalle">×${R.mult} pts${R.final ? '' : ` · Vuelta ${T.vuelta}/${R.vueltas}`}</span>
      </div>

      ${_scoreboardHTML()}

      <div class="camp-turno-banner" style="--gc:${g.color}">
        <span class="camp-tb-label">Turno de</span>
        <span class="camp-tb-name">${g.mascota} ${g.name}</span>
        ${T.cfg.temaMode === 'mixto' && !R.final ? `<span class="camp-tb-com">🃏 ${g.comodines}</span>` : ''}
      </div>

      <div class="camp-wheel-section">
        ${soloElige ? '' : `
        <div class="camp-w2-wrap">
          <div class="camp-pointer-arrow"></div>
          <div class="camp-w2-lights" id="camp-w2-lights">
            ${Array.from({ length: 12 }, (_, i) => `<span class="camp-w2-bulb" style="transform: rotate(${i * 30}deg) translateY(-124px)"></span>`).join('')}
          </div>
          <div class="camp-w2" id="camp-wheel">
            ${Array.from({ length: 8 }, (_, i) => {
              const s = CAMP_SUBJECTS[i % 4];
              const a = i * 45 + 22.5;
              return `<span class="camp-w2-seg" style="transform: translate(-50%,-50%) rotate(${a}deg) translateY(-82px) rotate(${-a}deg)">${s.icon}</span>`;
            }).join('')}
            <div class="camp-w2-hub">🏆</div>
          </div>
        </div>
        <div class="camp-subject-announce" id="camp-subject-announce"></div>
        <button class="camp-spin-btn" id="camp-spin-btn">🎡 Girar la ruleta</button>
        ${puedeElegir && T.cfg.temaMode === 'mixto' ? `<button class="camp-elegir-btn" id="camp-elegir-btn">🃏 Usar comodín «Yo elijo» (${g.comodines})</button>` : ''}
        `}
        ${soloElige ? `
          <div class="camp-elegir-panel">
            <p class="camp-elegir-label">${R.final ? '🏆 Finalista: elige tu tema' : '🙋 El grupo elige su tema'}</p>
            <div class="camp-elegir-grid">${_subjectBtnsHTML()}</div>
          </div>
        ` : ''}
      </div>

      <div class="camp-hub-actions">
        <button class="camp-action-btn" id="camp-normas-btn">📜 Normas</button>
        <button class="camp-action-btn" id="camp-editar-btn">✏️ Editar puntos</button>
        <button class="camp-action-btn" id="camp-salir-btn">🚪 Terminar</button>
      </div>
    </div>`;

  const wheel = $id('camp-wheel');
  if (wheel) {
    wheel.style.transition = 'none';
    wheel.style.transform  = `rotate(${T.wheelRotation % 360}deg)`;
  }

  const spinBtn = $id('camp-spin-btn');
  if (spinBtn) spinBtn.addEventListener('click', spinWheel);

  const elegirBtn = $id('camp-elegir-btn');
  if (elegirBtn) elegirBtn.addEventListener('click', () => {
    _sfx('click');
    g.comodines--;
    _mostrarEleccionTema();
  });

  _container.querySelectorAll('.camp-subj-pick').forEach(b =>
    b.addEventListener('click', () => {
      _sfx('reveal');
      _empezarPregunta(b.dataset.subj);
    })
  );

  $id('camp-normas-btn').addEventListener('click', () => { _sfx('click'); _showNormas(T.cfg); });
  $id('camp-editar-btn').addEventListener('click', () => { _sfx('click'); _showEditarPuntos(() => renderTurno()); });
  $id('camp-salir-btn').addEventListener('click', () => {
    _sfx('click');
    if (!confirm('¿Terminar el torneo? Se irá directo al podio con el marcador actual.')) return;
    _irAlPodio();
  });
}

/* ── Corrección del jurado: editar puntos de cualquier grupo ──
   Para cuando el moderador se equivoca de botón o se le pasa el
   tiempo: ajusta el marcador y el grupo sigue participando. */
function _showEditarPuntos(onClose) {
  const T = CAMP.T; if (!T) return;
  const paso = Math.max(1, T.cfg.basePts);
  const back = document.createElement('div');
  back.className = 'camp-modal-backdrop';
  back.innerHTML = `
    <div class="camp-modal">
      <div class="camp-modal-head">
        <span>✏️ Corrección del jurado</span>
        <button class="camp-modal-close" aria-label="Cerrar">✕</button>
      </div>
      <p class="camp-edit-hint">¿El moderador se equivocó o se pasó el tiempo? Ajusta aquí los puntos del grupo que acertó: sigue participando con su marcador corregido.</p>
      ${T.groups.map((g, i) => `
        <div class="camp-edit-row" style="--gc:${g.color}">
          <span class="camp-edit-name">${g.mascota} ${g.name}${g.eliminado ? ' <small>(banca)</small>' : ''}</span>
          <div class="camp-edit-ctrl">
            <button class="camp-edit-btn" data-gi="${i}" data-d="${-paso}">−${paso}</button>
            <button class="camp-edit-btn" data-gi="${i}" data-d="-1">−1</button>
            <span class="camp-edit-pts" id="camp-edit-pts-${i}">${g.score}</span>
            <button class="camp-edit-btn" data-gi="${i}" data-d="1">+1</button>
            <button class="camp-edit-btn" data-gi="${i}" data-d="${paso}">+${paso}</button>
          </div>
        </div>`).join('')}
      <button class="camp-start-btn camp-modal-ok">✔ Listo, marcador corregido</button>
    </div>`;

  const cerrar = () => { back.remove(); if (onClose) onClose(); };
  back.querySelector('.camp-modal-close').addEventListener('click', cerrar);
  back.querySelector('.camp-modal-ok').addEventListener('click', () => { _sfx('pts'); cerrar(); });
  back.addEventListener('click', e => { if (e.target === back) cerrar(); });
  back.querySelectorAll('.camp-edit-btn').forEach(b =>
    b.addEventListener('click', () => {
      _sfx('click');
      const g = T.groups[+b.dataset.gi];
      g.score = Math.max(0, g.score + (+b.dataset.d));
      const el = $id('camp-edit-pts-' + b.dataset.gi);
      if (el) { el.textContent = g.score; el.classList.add('camp-pts-bump'); setTimeout(() => el.classList.remove('camp-pts-bump'), 500); }
    })
  );
  document.body.appendChild(back);
}

function _scoreboardHTML() {
  const T = CAMP.T;
  const max = Math.max(1, ...T.groups.map(g => g.score));
  const sorted = [...T.groups].sort((a, b) => b.score - a.score);
  const turnG = _turnGroup();
  return `
    <div class="camp-scoreboard">
      ${sorted.map(g => {
        const rank  = sorted.indexOf(g) + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
        return `
          <div class="camp-score-row ${g === turnG ? 'camp-sr-turn' : ''} ${g.eliminado ? 'camp-sr-out' : ''}">
            <div class="camp-score-color" style="background:${g.color}"></div>
            <span class="camp-score-name">${g.mascota} ${g.name}${g.streak >= 3 ? ' 🔥' : ''}</span>
            <div class="camp-score-barwrap"><div class="camp-score-bar" style="width:${Math.round(g.score / max * 100)}%; background:${g.color}"></div></div>
            <span class="camp-score-pts">${g.score}</span>
            <span class="camp-score-medal">${medal}</span>
          </div>`;
      }).join('')}
    </div>`;
}

function _subjectBtnsHTML() {
  const T = CAMP.T;
  return CAMP_SUBJECTS.filter(s => _hayPreguntas(s.key)).map(s => `
    <button class="camp-subj-pick camp-sp-${s.cls}" data-subj="${s.key}">
      <span class="camp-sp-icon">${s.icon}</span>${s.label}
    </button>`).join('');
}

function _hayPreguntas(subjectKey) {
  const T = CAMP.T;
  const bank = _bank()[subjectKey] || [];
  if (!bank.length) return false;
  if (!T || !T.selectedMissions) return true;
  return bank.some(q => T.selectedMissions.has(q.mision));
}

function _mostrarEleccionTema() {
  const section = _container.querySelector('.camp-wheel-section');
  if (!section) return;
  section.innerHTML = `
    <div class="camp-elegir-panel">
      <p class="camp-elegir-label">🃏 Comodín usado — elige tu tema</p>
      <div class="camp-elegir-grid">${_subjectBtnsHTML()}</div>
    </div>`;
  section.querySelectorAll('.camp-subj-pick').forEach(b =>
    b.addEventListener('click', () => { _sfx('reveal'); _empezarPregunta(b.dataset.subj); })
  );
}

/* ── Ruleta ── */
function spinWheel() {
  const T   = CAMP.T;
  const btn = $id('camp-spin-btn');
  if (!btn || btn.disabled) return;
  btn.disabled = true;
  const elegirBtn = $id('camp-elegir-btn');
  if (elegirBtn) elegirBtn.disabled = true;
  _sfx('spin');

  const wheel  = $id('camp-wheel');
  const lights = $id('camp-w2-lights');
  const announce = $id('camp-subject-announce');
  if (!wheel) return;
  if (lights) lights.classList.add('camp-w2-spinning');

  const validSubjects = CAMP_SUBJECTS.filter(s => _hayPreguntas(s.key));
  if (!validSubjects.length) { btn.disabled = false; alert('Sin misiones seleccionadas.'); return; }
  const subject = validSubjects[Math.floor(Math.random() * validSubjects.length)];
  const subjIdx = CAMP_SUBJECTS.indexOf(subject);

  /* 8 gajos de 45°; los gajos del tema elegido son subjIdx y subjIdx+4.
     Centro del gajo i = i·45 + 22.5 (desde arriba, horario).
     rotate(θ) lleva el centro a la flecha cuando θ ≡ 360 − centro. */
  const gajo   = subjIdx + (Math.random() < 0.5 ? 0 : 4);
  const centro = gajo * 45 + 22.5;
  const target = (360 - centro) % 360;
  const cur    = T.wheelRotation % 360;
  let   extra  = target - cur;
  if (extra <= 0) extra += 360;
  T.wheelRotation += 5 * 360 + extra;

  wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
  wheel.style.transform  = `rotate(${T.wheelRotation}deg)`;

  if (announce) { announce.textContent = ''; announce.className = 'camp-subject-announce'; }

  let tick = 0;
  const spinInterval = setInterval(() => {
    tick++;
    const pct  = Math.min(1, tick / 55);
    const freq = 300 - pct * 100;
    _tone(freq + Math.random() * 80, 'sine', 0.06, 0.07);
    if (tick >= 55) clearInterval(spinInterval);
  }, 70);

  setTimeout(() => {
    clearInterval(spinInterval);
    _sfx('spin_end');
    if (lights) lights.classList.remove('camp-w2-spinning');

    if (announce) {
      announce.className = `camp-subject-announce camp-sa-${subject.cls}`;
      announce.innerHTML = `${subject.icon} <strong>${subject.label}</strong>`;
    }
    setTimeout(() => _empezarPregunta(subject.key), 900);
  }, 4300);
}

/* ══════════════════════════════════════════════════════════════
   TORNEO — PREGUNTA
══════════════════════════════════════════════════════════════ */

/* ── Variación de preguntas (cfg.variar) ──
   Con «🔀 Variar preguntas» activado:
   · las opciones se barajan (la letra correcta cambia cada vez),
   · 1 de cada 3 preguntas se replantea como «¿es correcta esta
     respuesta?» (mismo tema, planteamiento distinto),
   · se evita repetir preguntas de torneos RECIENTES (historial
     persistente METAS_CAMP_USED_V1) mientras haya alternativas.
   Así el torneo no se memoriza ni termina siempre en empates. */
const CAMP_USED_KEY = 'METAS_CAMP_USED_V1';

function _usedHistLoad() {
  try { const a = JSON.parse(localStorage.getItem(CAMP_USED_KEY)); return Array.isArray(a) ? a : []; }
  catch (_) { return []; }
}
function _usedHistAdd(q) {
  try {
    const a = _usedHistLoad();
    a.push(_campNorm(q.q));
    localStorage.setItem(CAMP_USED_KEY, JSON.stringify(a.slice(-300)));
  } catch (_) {}
}

function _shuffleOpciones(q) {
  const idx = q.o.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return { ...q, o: idx.map(i => q.o[i]), c: idx.indexOf(q.c) };
}

function _variarPregunta(q) {
  /* Replanteo «¿es correcta esta respuesta?» (1 de cada 3, si hay 3+ opciones) */
  if (q.o.length >= 3 && Math.random() < 0.34) {
    const usarCorrecta = Math.random() < 0.5;
    let oi = q.c;
    if (!usarCorrecta) { do { oi = Math.floor(Math.random() * q.o.length); } while (oi === q.c); }
    return {
      ...q,
      q: `${q.q}<br><span class="camp-q-vf">🎤 Un concursante respondió: «<strong>${q.o[oi]}</strong>». ¿Es la respuesta correcta?</span>`,
      o: ['✅ Sí, es la correcta', `❌ No — la correcta es otra`],
      c: usarCorrecta ? 0 : 1,
    };
  }
  return _shuffleOpciones(q);
}

function _pickQuestion(subjectKey) {
  const T    = CAMP.T;
  const bank = _bank()[subjectKey];
  if (!bank || !bank.length) return null;

  let pool = bank;
  if (T.selectedMissions && T.selectedMissions.size) {
    const filtered = bank.filter(q => T.selectedMissions.has(q.mision));
    if (filtered.length) pool = filtered;
  }
  const used      = T.usedQs[subjectKey];
  const poolIdxs  = pool.map(q => bank.indexOf(q));
  let   available = poolIdxs.filter(i => !used.includes(i));
  if (!available.length) {         /* banco agotado: reciclar materia */
    T.usedQs[subjectKey] = [];
    available = poolIdxs;
  }
  if (T.cfg.variar) {              /* preferir preguntas que no salieron en torneos recientes */
    const recientes = new Set(_usedHistLoad());
    const frescas   = available.filter(i => !recientes.has(_campNorm(bank[i].q)));
    if (frescas.length) available = frescas;
  }
  const bankIdx = available[Math.floor(Math.random() * available.length)];
  T.usedQs[subjectKey].push(bankIdx);
  let q = bank[bankIdx];
  if (T.cfg.variar) { _usedHistAdd(q); q = _variarPregunta(q); }
  return q;
}

function _empezarPregunta(subjectKey) {
  const T = CAMP.T; if (!T) return;
  const R = _rondasDef(T.cfg)[T.rondaIdx];

  if (R.final && T.fase !== 'apuesta-hecha') { renderApuesta(subjectKey); return; }

  const q = _pickQuestion(subjectKey);
  if (!q) { alert('No hay preguntas disponibles para las misiones seleccionadas.'); renderTurno(); return; }

  T.currentSubject = subjectKey;
  T.currentQ = q;
  T.fase = 'pregunta';
  _renderPreguntaScreen(q, subjectKey);
}

function _renderPreguntaScreen(q, subjectKey) {
  const T = CAMP.T;
  const R = _rondasDef(T.cfg)[T.rondaIdx] || { n: 0, mult: 1, timerFactor: 1, final: false };
  const muerte = T.fase === 'muerte-pregunta';
  const g = muerte && T.muerte ? T.groups[T.muerte.vivos[T.muerte.pos]] : _turnGroup();
  const subject = CAMP_SUBJECTS.find(s => s.key === subjectKey);
  const secs    = Math.max(8, Math.round(T.cfg.timerSecs * R.timerFactor));
  const pts     = R.final ? T.apuesta : T.cfg.basePts * R.mult;
  const CIRCUM  = 107;

  _stopTimer();

  _container.innerHTML = `
    <div class="camp-question-screen">

      ${muerte ? `
      <div class="camp-turno-mini" style="--gc:${g.color}">
        ⚔️ <strong>MUERTE SÚBITA</strong> — responde ${g.mascota} <strong>${g.name}</strong>
        <span class="camp-tm-pts">Turno ${T.muerte ? T.muerte.pos + 1 : 1}/${T.muerte ? T.muerte.vivos.length : 1} · Ronda ${T.muerte ? T.muerte.ronda : 1}</span>
      </div>` : `
      <div class="camp-turno-mini" style="--gc:${g.color}">
        ${g.mascota} <strong>${g.name}</strong> responde
        <span class="camp-tm-pts">${R.final ? `🎰 Apostó ${T.apuesta}` : `+${pts} pts`}</span>
      </div>`}

      <div class="camp-q-header camp-q-header-${subject.cls}">
        <span class="camp-q-subj-icon">${subject.icon}</span>
        <div class="camp-q-subj-info">
          <span class="camp-q-subj-label">${subject.label} ${R.n === 2 ? '⚡×2' : R.final ? '🏆' : ''}</span>
          <span class="camp-q-mision">${q.mision}</span>
        </div>
        <div class="camp-q-timer-wrap" id="camp-q-timer">
          <svg class="camp-timer-svg" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="3.5"/>
            <circle id="camp-timer-arc" cx="22" cy="22" r="18" fill="none"
              stroke="${subject.color}" stroke-width="3.5" stroke-linecap="round"
              stroke-dasharray="${CIRCUM}" stroke-dashoffset="0" transform="rotate(-90 22 22)"/>
          </svg>
          <span class="camp-q-timer-num" id="camp-q-timer-num">${secs}</span>
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
        <button class="camp-reveal-btn" id="camp-reveal-btn">✅ Revelar respuesta</button>
      </div>

      <div class="camp-mini-score">
        ${T.groups.map((gr, i) => `
          <div class="camp-ms-item">
            <span class="camp-ms-dot" style="background:${gr.color}"></span>
            <span class="camp-ms-name">${gr.name}</span>
            <span class="camp-ms-pts" id="camp-mini-pts-${i}">${gr.score}</span>
          </div>`).join('')}
      </div>
    </div>`;

  _container.querySelectorAll('.camp-q-opt').forEach(btn =>
    btn.addEventListener('click', () => {
      _sfx('click');
      _container.querySelectorAll('.camp-q-opt').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    })
  );

  $id('camp-reveal-btn').addEventListener('click', () => { _sfx('reveal'); _revelar(false); });

  /* Temporizador */
  let remaining = secs;
  const numEl  = $id('camp-q-timer-num');
  const arcEl  = $id('camp-timer-arc');
  const wrapEl = $id('camp-q-timer');
  _timerInt = setInterval(() => {
    remaining--;
    const rem = Math.max(0, remaining);
    if (numEl) numEl.textContent = rem;
    if (arcEl) arcEl.style.strokeDashoffset = CIRCUM * (1 - rem / secs);
    const urgent = rem <= Math.min(10, Math.ceil(secs / 3));
    if (wrapEl) wrapEl.classList.toggle('camp-timer-urgent', urgent);
    if (rem > 0) _sfx(urgent ? 'urgent' : 'tick');
    if (rem <= 0) { _stopTimer(); _sfx('timeout'); _revelar(true); }
  }, 1000);
}

/* ── Revelación y asignación de puntos por turno ── */
function _revelar(timeout) {
  _stopTimer();
  const T = CAMP.T; if (!T) return;
  const R = _rondasDef(T.cfg)[T.rondaIdx] || { n: 0, mult: 1, timerFactor: 1, final: false };
  const q = T.currentQ;
  const g = _turnGroup();
  const gi = T.order[T.turnIdx];
  const pts = R.final ? T.apuesta : T.cfg.basePts * R.mult;

  _container.querySelectorAll('.camp-q-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.c) btn.classList.add('correct');
    else if (btn.classList.contains('selected')) btn.classList.add('wrong');
  });

  const actions = $id('camp-q-actions');
  if (!actions) return;

  if (T.fase === 'muerte-pregunta') { _revelarMuerte(actions, timeout); return; }

  actions.innerHTML = `
    ${timeout ? `<p class="camp-timeout-msg">⏰ ¡Tiempo agotado! El jurado decide: si el grupo respondió antes de que sonara la alarma, puede validar el acierto.</p>` : ''}
    <div class="camp-veredicto">
      <p class="camp-award-label">¿${g.mascota} ${g.name} respondió bien?</p>
      <div class="camp-veredicto-btns">
        <button class="camp-vd-ok" id="camp-vd-ok">✔ ¡Acertó! ${R.final ? `+${pts}` : `+${pts} pts`}</button>
        <button class="camp-vd-no" id="camp-vd-no">✘ Falló${R.final ? ` −${pts}` : ''}</button>
      </div>
    </div>`;

  $id('camp-vd-ok').addEventListener('click', () => {
    _sfx('pts');
    g.score += pts;
    g.aciertos++; g.streak++;
    if (g.streak > g.bestStreak) g.bestStreak = g.streak;
    if (R.n === 2) g.ptsR2 += pts;
    _bump(gi, g.score);
    setTimeout(_siguienteTurno, 1200);
  });

  $id('camp-vd-no').addEventListener('click', () => {
    _sfx('wrong');
    g.fallos++; g.streak = 0;
    if (R.final) {
      g.score = Math.max(0, g.score - pts);
      _bump(gi, g.score);
      setTimeout(_siguienteTurno, 1400);
      return;
    }
    if (T.cfg.reboteOn && T.order.length > 1) { _mostrarRebote(actions); return; }
    setTimeout(_siguienteTurno, 900);
  });
}

function _bump(gi, score) {
  const el = $id(`camp-mini-pts-${gi}`);
  if (el) { el.textContent = score; el.classList.add('camp-pts-bump'); setTimeout(() => el.classList.remove('camp-pts-bump'), 600); }
}

function _mostrarRebote(actions) {
  const T = CAMP.T;
  const R = _rondasDef(T.cfg)[T.rondaIdx];
  const stealPts = Math.max(1, Math.floor((T.cfg.basePts * R.mult) / 2));
  const gi = T.order[T.turnIdx];

  actions.innerHTML = `
    <div class="camp-veredicto">
      <p class="camp-award-label">🔁 ¡REBOTE! ¿Algún grupo roba la pregunta? (+${stealPts} pts)</p>
      <div class="camp-award-groups">
        ${T.groups.map((gr, i) => (i === gi || gr.eliminado) ? '' : `
          <button class="camp-award-btn" data-gi="${i}" style="--gc:${gr.color}">
            <span class="camp-ag-dot" style="background:${gr.color}"></span>${gr.mascota} ${gr.name}
          </button>`).join('')}
      </div>
      <button class="camp-next-q-btn" id="camp-no-rebote">Nadie robó — continuar</button>
    </div>`;

  actions.querySelectorAll('.camp-award-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      _sfx('steal');
      const i = +btn.dataset.gi;
      const gr = T.groups[i];
      gr.score += stealPts;
      gr.robos++;
      _bump(i, gr.score);
      setTimeout(_siguienteTurno, 1200);
    })
  );
  $id('camp-no-rebote').addEventListener('click', () => { _sfx('click'); _siguienteTurno(); });
}

/* ── Avance de turno / vuelta / ronda ── */
function _siguienteTurno() {
  const T = CAMP.T; if (!T) return;
  const R = _rondasDef(T.cfg)[T.rondaIdx];

  T.turnIdx++;
  if (T.turnIdx >= T.order.length) {
    T.turnIdx = 0;
    T.vuelta++;
    if (T.vuelta > R.vueltas) { _finDeRonda(); return; }
  }
  renderTurno();
}

function _finDeRonda() {
  const T = CAMP.T;
  const rondas = _rondasDef(T.cfg);

  if (T.rondaIdx === 0) {
    /* checkpoint para la insignia Remontada */
    const sorted = [...T.groups].sort((a, b) => b.score - a.score);
    T.groups.forEach(g => { g.posR1 = sorted.indexOf(g) + 1; });
  }

  T.rondaIdx++;
  T.vuelta = 1;
  T.turnIdx = 0;

  if (T.rondaIdx >= rondas.length) { _irAlPodio(); return; }

  if (rondas[T.rondaIdx].final) {
    /* Clasificación: los mejores avanzan. Un empate en el corte se
       resuelve con muerte súbita, nunca eliminando por orden arbitrario. */
    const sorted = T.groups.map((g, i) => ({ g, i })).sort((a, b) => b.g.score - a.g.score);
    const nFin   = Math.min(T.cfg.finalistas, sorted.length);
    const corte  = sorted[nFin - 1].g.score;
    const directos  = sorted.filter(x => x.g.score > corte).map(x => x.i);
    const empatados = sorted.filter(x => x.g.score === corte).map(x => x.i);

    if (directos.length + empatados.length > nFin) {
      T.muerte = { modo: 'clasif', vivos: empatados, slots: nFin - directos.length,
                   clasificados: directos, ronda: 1, pos: 0, resultados: {} };
      renderMuerteSubita();
      return;
    }
    const finalistas = sorted.slice(0, nFin).map(x => x.i);
    T.groups.forEach((g, i) => { g.eliminado = !finalistas.includes(i); });
    T.order = finalistas;
  }

  renderRondaIntro();
}

/* ══════════════════════════════════════════════════════════════
   TORNEO — LA APUESTA FINAL
══════════════════════════════════════════════════════════════ */
function renderApuesta(subjectKey) {
  const T = CAMP.T;
  const g = _turnGroup();
  const subject = CAMP_SUBJECTS.find(s => s.key === subjectKey);
  const maxBet  = Math.max(0, g.score);
  T.apuesta = Math.min(Math.max(T.cfg.basePts, Math.round(maxBet / 2 / 5) * 5), maxBet) || T.cfg.basePts;
  _sfx('drum');

  _container.innerHTML = `
    <div class="camp-apuesta-screen">
      <div class="camp-turno-banner" style="--gc:${g.color}">
        <span class="camp-tb-label">La Apuesta Final de</span>
        <span class="camp-tb-name">${g.mascota} ${g.name}</span>
      </div>
      <p class="camp-ap-tema">Tema elegido: <strong style="color:${subject.color}">${subject.icon} ${subject.label}</strong></p>
      <p class="camp-ap-saldo">Puntos disponibles: <strong>${g.score}</strong></p>

      <div class="camp-ap-monto" id="camp-ap-monto">${T.apuesta}</div>
      <div class="camp-ap-controls">
        <button class="camp-ap-btn" data-d="-10">−10</button>
        <button class="camp-ap-btn" data-d="-5">−5</button>
        <button class="camp-ap-btn" data-d="5">+5</button>
        <button class="camp-ap-btn" data-d="10">+10</button>
      </div>
      <button class="camp-ap-todo" id="camp-ap-todo">🦁 ¡APOSTARLO TODO! (${maxBet})</button>

      <p class="camp-ap-regla">Si acierta: <strong style="color:#15803d">gana su apuesta</strong> · Si falla: <strong style="color:#b91c1c">la pierde</strong></p>
      <button class="camp-start-btn" id="camp-ap-go">🎬 ¡Ver la pregunta!</button>
    </div>`;

  const montoEl = $id('camp-ap-monto');
  const setMonto = v => {
    T.apuesta = Math.min(maxBet || T.cfg.basePts, Math.max(0, v));
    montoEl.textContent = T.apuesta;
  };
  _container.querySelectorAll('.camp-ap-btn').forEach(b =>
    b.addEventListener('click', () => { _sfx('click'); setMonto(T.apuesta + (+b.dataset.d)); })
  );
  $id('camp-ap-todo').addEventListener('click', () => { _sfx('drum'); setMonto(maxBet); });
  $id('camp-ap-go').addEventListener('click', () => {
    _sfx('start');
    if (T.apuesta === maxBet && maxBet > 0) g.apostoTodo = true;
    T.fase = 'apuesta-hecha';
    _empezarPregunta(subjectKey);
    T.fase = 'pregunta';
  });
}

/* ══════════════════════════════════════════════════════════════
   TORNEO — MUERTE SÚBITA (desempates por conocimiento)
   Cada grupo empatado responde SU propia pregunta por turnos.
   Al completar la ronda: quien acierta sigue, quien falla queda
   fuera. Si todos aciertan o todos fallan, otra ronda. Nadie es
   eliminado sin haber respondido.
   T.muerte = { modo:'clasif'|'final', vivos:[gi], slots, clasificados:[gi], ronda, pos, resultados:{gi:bool} }
══════════════════════════════════════════════════════════════ */
function _empatePrimero() {
  const T = CAMP.T;
  const sorted = [...T.groups].sort((a, b) => b.score - a.score);
  const top = sorted[0].score;
  const empatados = T.groups.map((g, i) => ({ g, i })).filter(x => x.g.score === top);
  return empatados.length > 1 ? empatados.map(x => x.i) : null;
}

function renderMuerteSubita() {
  const T = CAMP.T, M = T.muerte;
  _sfx('drum');
  T.fase = 'muerte';

  const esFinal = M.modo === 'final';
  const desc = esFinal
    ? 'Empate en el primer lugar. Cada grupo responde <strong>su propia pregunta</strong> por turnos. Al completar la ronda: quien acierta sigue, quien falla queda fuera. Si todos aciertan o todos fallan, se juega otra ronda. ¡El último grupo en pie se corona campeón!'
    : `Empate en la clasificación a la Gran Final: <strong>${M.vivos.length} grupos</strong> pelean por <strong>${M.slots} lugar${M.slots > 1 ? 'es' : ''}</strong>. Cada grupo responde <strong>su propia pregunta</strong> por turnos: quien acierta avanza y quien falla sigue luchando por los lugares que queden. ¡Nadie queda fuera sin competir!`;

  _container.innerHTML = `
    <div class="camp-ronda-intro camp-ri-muerte">
      <div class="camp-ri-icon">⚔️</div>
      <h2 class="camp-ri-nombre">¡MUERTE SÚBITA!</h2>
      <p class="camp-ri-desc">${desc}</p>
      <div class="camp-ri-clasif">
        <div class="camp-ri-clasif-title">${esFinal ? 'Duelo por el campeonato:' : 'Duelo por la clasificación:'}</div>
        ${M.vivos.map(i => { const g = T.groups[i]; return `
          <div class="camp-ri-fin"><span class="camp-ms-dot" style="background:${g.color}"></span> ${g.mascota} <strong>${g.name}</strong> — ${g.score} pts</div>`; }).join('')}
      </div>
      <button class="camp-start-btn" id="camp-md-go">⚔️ Comenzar la muerte súbita</button>
    </div>`;

  $id('camp-md-go').addEventListener('click', () => { _sfx('start'); _muerteEmpiezaRonda(); });
}

function _muerteEmpiezaRonda() {
  const M = CAMP.T.muerte;
  M.pos = 0;
  M.resultados = {};
  _muertePregunta();
}

function _muertePregunta() {
  const T = CAMP.T, M = T.muerte;
  const subjects = CAMP_SUBJECTS.filter(s => _hayPreguntas(s.key));
  const s = subjects.length ? subjects[Math.floor(Math.random() * subjects.length)] : null;
  const q = s ? _pickQuestion(s.key) : null;
  if (!q) {   /* sin banco disponible: resolver sin bloquear el torneo */
    if (M.modo === 'clasif') { M.clasificados.push(...M.vivos.slice(0, M.slots)); _muerteFinClasif(); }
    else _irAlPodio(true);
    return;
  }
  T.currentQ = q;
  T.currentSubject = s.key;
  T.fase = 'muerte-pregunta';
  _renderPreguntaScreen(q, s.key);
  T.fase = 'muerte-pregunta';
}

function _revelarMuerte(actions, timeout) {
  const T = CAMP.T, M = T.muerte;
  const gi = M.vivos[M.pos];
  const g  = T.groups[gi];

  actions.innerHTML = `
    ${timeout ? `<p class="camp-timeout-msg">⏰ ¡Tiempo agotado! El jurado decide: si el grupo respondió antes de que sonara la alarma, puede validar el acierto.</p>` : ''}
    <div class="camp-veredicto">
      <p class="camp-award-label">⚔️ ¿${g.mascota} ${g.name} respondió bien?</p>
      <div class="camp-veredicto-btns">
        <button class="camp-vd-ok" id="camp-md-ok">✔ ¡Acertó!</button>
        <button class="camp-vd-no" id="camp-md-no">✘ Falló</button>
      </div>
    </div>`;

  const registrar = ok => {
    M.resultados[gi] = ok;
    M.pos++;
    setTimeout(M.pos < M.vivos.length ? _muertePregunta : _muerteEvaluarRonda, 1000);
  };
  $id('camp-md-ok').addEventListener('click', () => { _sfx('pts'); registrar(true); });
  $id('camp-md-no').addEventListener('click', () => { _sfx('wrong'); registrar(false); });
}

function _muerteEvaluarRonda() {
  const T = CAMP.T, M = T.muerte;
  const aciertos = M.vivos.filter(gi => M.resultados[gi]);
  const fallos   = M.vivos.filter(gi => !M.resultados[gi]);

  /* Todos igual → el empate persiste: otra ronda con los mismos grupos */
  if (!aciertos.length || !fallos.length) {
    M.ronda++;
    _muerteInterludio(
      aciertos.length ? '🤝 ¡Todos acertaron!' : '🤝 Todos fallaron',
      'El empate sigue vivo. Se juega otra ronda con los mismos grupos.',
      [], M.vivos);
    return;
  }

  if (M.modo === 'final') {
    aciertos.forEach(gi => { T.groups[gi].score += 1; });   /* +1 simbólico por ronda superada */
    M.vivos = aciertos;
    if (M.vivos.length === 1) { _sfx('fanfare'); _irAlPodio(true); return; }
    M.ronda++;
    _muerteInterludio('⚔️ ¡El duelo continúa!',
      'Quien falló queda fuera del desempate. Los demás siguen luchando por el campeonato.',
      fallos, M.vivos);
    return;
  }

  /* modo clasif: se pelean M.slots lugares para la Gran Final */
  if (aciertos.length === M.slots) {
    M.clasificados.push(...aciertos);
    _muerteFinClasif();
    return;
  }
  if (aciertos.length > M.slots) {
    M.vivos = aciertos;
    M.ronda++;
    _muerteInterludio('⚔️ ¡Siguen empatados!',
      `Quien falló queda fuera. Los que acertaron siguen peleando por ${M.slots} lugar${M.slots > 1 ? 'es' : ''}.`,
      fallos, M.vivos);
    return;
  }
  /* menos aciertos que lugares: los que acertaron clasifican y el resto pelea lo que queda */
  M.clasificados.push(...aciertos);
  M.slots -= aciertos.length;
  M.vivos = fallos;
  if (M.vivos.length <= M.slots) { M.clasificados.push(...M.vivos); _muerteFinClasif(); return; }
  M.ronda++;
  _muerteInterludio('🎫 ¡Hay clasificados!',
    `${aciertos.map(gi => `${T.groups[gi].mascota} ${T.groups[gi].name}`).join(', ')} ya ${aciertos.length > 1 ? 'están' : 'está'} en la Gran Final. Quedan ${M.slots} lugar${M.slots > 1 ? 'es' : ''} en juego.`,
    [], M.vivos);
}

function _muerteInterludio(titulo, desc, eliminados, vivos) {
  const T = CAMP.T, M = T.muerte;
  _sfx('drum');
  const fila = i => { const g = T.groups[i]; return `
    <div class="camp-ri-fin"><span class="camp-ms-dot" style="background:${g.color}"></span> ${g.mascota} <strong>${g.name}</strong></div>`; };

  _container.innerHTML = `
    <div class="camp-ronda-intro camp-ri-muerte">
      <div class="camp-ri-icon">⚔️</div>
      <h2 class="camp-ri-nombre">${titulo}</h2>
      <p class="camp-ri-desc">${desc}</p>
      ${eliminados.length ? `
      <div class="camp-ri-clasif" style="opacity:.6">
        <div class="camp-ri-clasif-title">Fuera del desempate (¡gran torneo!):</div>
        ${eliminados.map(fila).join('')}
      </div>` : ''}
      <div class="camp-ri-clasif">
        <div class="camp-ri-clasif-title">Siguen en el duelo:</div>
        ${vivos.map(fila).join('')}
      </div>
      <button class="camp-start-btn" id="camp-md-next">⚔️ Ronda ${M.ronda} de muerte súbita</button>
    </div>`;

  $id('camp-md-next').addEventListener('click', () => { _sfx('start'); _muerteEmpiezaRonda(); });
}

function _muerteFinClasif() {
  const T = CAMP.T, M = T.muerte;
  const finalistas = [...M.clasificados].sort((a, b) => T.groups[b].score - T.groups[a].score);
  T.groups.forEach((g, i) => { g.eliminado = !finalistas.includes(i); });
  T.order = finalistas;
  T.muerte = null;
  _sfx('fanfare');
  renderRondaIntro();
}

/* ══════════════════════════════════════════════════════════════
   TORNEO — PODIO, INSIGNIAS Y GUARDADO
══════════════════════════════════════════════════════════════ */
function _irAlPodio(sinDesempate) {
  const T = CAMP.T; if (!T) return;
  _stopTimer();

  if (!sinDesempate) {
    const empate = _empatePrimero();
    if (empate) {
      T.muerte = { modo: 'final', vivos: empate, slots: 1, clasificados: [], ronda: 1, pos: 0, resultados: {} };
      renderMuerteSubita();
      return;
    }
  }
  renderPodio();
}

function _calcularInsignias() {
  const T = CAMP.T;
  const sorted = [...T.groups].sort((a, b) => b.score - a.score);
  const ins = [];
  const add = (g, icon, nombre, detalle) => ins.push({ grupo: g.name, mascota: g.mascota, icon, nombre, detalle });

  if (sorted[0]) add(sorted[0], '🏆', 'Campeón', `${sorted[0].score} pts`);
  if (sorted[1]) add(sorted[1], '🥈', 'Subcampeón', `${sorted[1].score} pts`);

  T.groups.forEach(g => {
    if (g.bestStreak >= 3) add(g, '🔥', 'Racha de Fuego', `${g.bestStreak} aciertos seguidos`);
    if (g.aciertos >= 3 && g.fallos === 0) add(g, '🎯', 'Puntería Perfecta', 'sin fallar ninguna');
    if (g.robos >= 2) add(g, '🦊', 'Rey del Rebote', `${g.robos} robos`);
    if (g.apostoTodo) add(g, '🦁', 'Corazón Valiente', 'apostó todo en la final');
  });

  const reyR2 = T.groups.reduce((a, b) => (b.ptsR2 > (a ? a.ptsR2 : 0) ? b : a), null);
  if (reyR2 && reyR2.ptsR2 > 0) add(reyR2, '⚡', 'Rey Relámpago', `${reyR2.ptsR2} pts en la Ronda 2`);

  const remo = T.groups.find(g => g.posR1 === T.groups.length && T.groups.length >= 3 && sorted.indexOf(g) <= 1);
  if (remo) add(remo, '💪', 'Gran Remontada', 'de último a lo más alto');

  return ins;
}

function renderPodio() {
  const T = CAMP.T; if (!T) return;
  const sorted = [...T.groups].sort((a, b) => b.score - a.score);
  const insignias = _calcularInsignias();
  T.insignias = insignias;
  _sfx('fanfare');

  /* Guardar en el Salón de la Fama */
  const data = _campLoad();
  data.historial.push({
    t: new Date().toISOString(),
    lugar: T.cfg.lugar || '',
    campeon: sorted[0] ? sorted[0].name : '',
    mascota: sorted[0] ? sorted[0].mascota : '',
    grupos: sorted.map(g => ({ name: g.name, mascota: g.mascota, score: g.score })),
    insignias: insignias.map(i => ({ grupo: i.grupo, icon: i.icon, nombre: i.nombre })),
  });
  if (data.historial.length > 60) data.historial = data.historial.slice(-60);
  _campSave(data);

  const podio3 = [sorted[1], sorted[0], sorted[2]].filter(Boolean);
  const alturas = sorted.length >= 3 ? ['camp-pd-2', 'camp-pd-1', 'camp-pd-3'] : ['camp-pd-2', 'camp-pd-1'];

  _container.innerHTML = `
    <div class="camp-podio-screen">
      <div class="camp-confetti" id="camp-confetti"></div>
      <h2 class="camp-podio-title">🎉 ¡Tenemos resultados! 🎉</h2>
      ${T.cfg.lugar ? `<p class="camp-podio-lugar">📍 ${T.cfg.lugar}</p>` : ''}

      <div class="camp-podio">
        ${podio3.map((g, i) => `
          <div class="camp-pd-col ${alturas[i]}">
            <div class="camp-pd-mascota">${g.mascota}</div>
            <div class="camp-pd-name">${g.name}</div>
            <div class="camp-pd-block" style="background:${g.color}">
              <span class="camp-pd-medal">${alturas[i] === 'camp-pd-1' ? '🥇' : alturas[i] === 'camp-pd-2' ? '🥈' : '🥉'}</span>
              <span class="camp-pd-pts">${g.score}</span>
            </div>
          </div>`).join('')}
      </div>

      ${sorted.length > 3 ? `
        <div class="camp-podio-resto">
          ${sorted.slice(3).map((g, i) => `<div class="camp-pr-row">${i + 4}º · ${g.mascota} ${g.name} — ${g.score} pts</div>`).join('')}
        </div>` : ''}

      <div class="camp-podio-ins">
        <div class="camp-podio-ins-title">🎖️ Insignias del torneo</div>
        ${insignias.map(i => `
          <div class="camp-pi-row">
            <span class="camp-pi-icon">${i.icon}</span>
            <span class="camp-pi-nombre">${i.nombre}</span>
            <span class="camp-pi-grupo">${i.mascota} ${i.grupo}</span>
            <span class="camp-pi-det">${i.detalle || ''}</span>
          </div>`).join('')}
        <p class="camp-pi-nota">Guardadas en el 🏅 Salón de la Fama</p>
      </div>

      <button class="camp-start-btn" id="camp-pd-nuevo">🎬 Nuevo torneo</button>
      <button class="camp-action-btn" id="camp-pd-fama">🏅 Ver Salón de la Fama</button>
      <button class="camp-action-btn" id="camp-pd-home">← Menú del Campeonísimo</button>
    </div>`;

  _lanzarConfetti();

  $id('camp-pd-nuevo').addEventListener('click', () => { _sfx('click'); CAMP.T = null; renderSetup(); });
  $id('camp-pd-fama').addEventListener('click',  () => { _sfx('click'); CAMP.T = null; renderFame(); });
  $id('camp-pd-home').addEventListener('click',  () => { _sfx('click'); CAMP.T = null; renderCampHome(); });
}

function _lanzarConfetti() {
  const box = $id('camp-confetti');
  if (!box) return;
  const piezas = ['🎉', '⭐', '🎊', '✨', '🏆'];
  for (let i = 0; i < 26; i++) {
    const s = document.createElement('span');
    s.className = 'camp-cf';
    s.textContent = piezas[i % piezas.length];
    s.style.left = (Math.random() * 96) + '%';
    s.style.animationDelay = (Math.random() * 2.2) + 's';
    s.style.fontSize = (14 + Math.random() * 14) + 'px';
    box.appendChild(s);
  }
}

/* ══════════════════════════════════════════════════════════════
   SALÓN DE LA FAMA
══════════════════════════════════════════════════════════════ */
function renderFame() {
  CAMP.screen = 'fame';
  _stopTimer();
  const data = _campLoad();
  const hist = [...data.historial].reverse();

  /* Insignias acumuladas por grupo */
  const totales = {};
  data.historial.forEach(h => (h.insignias || []).forEach(i => {
    const k = i.grupo;
    totales[k] = totales[k] || { grupo: k, n: 0, iconos: [] };
    totales[k].n++;
    if (totales[k].iconos.length < 8) totales[k].iconos.push(i.icon);
  }));
  const ranking = Object.values(totales).sort((a, b) => b.n - a.n).slice(0, 8);

  _container.innerHTML = `
    <div class="camp-setup">
      <div class="camp-setup-hero">
        <div class="camp-trophy">🏅</div>
        <h2 class="camp-setup-title">Salón de la Fama</h2>
        <p class="camp-setup-sub">${hist.length ? 'La historia del Campeonísimo' : 'Aún no hay torneos jugados. ¡El primero hará historia!'}</p>
      </div>

      ${ranking.length ? `
        <div class="camp-card">
          <div class="camp-card-label">🎖️ Insignias acumuladas</div>
          ${ranking.map(r => `
            <div class="camp-fame-total">
              <span class="camp-ft-grupo">${r.grupo}</span>
              <span class="camp-ft-iconos">${r.iconos.join('')}</span>
              <span class="camp-ft-n">${r.n}</span>
            </div>`).join('')}
        </div>` : ''}

      ${hist.map(h => {
        const fecha = (h.t || '').slice(0, 10);
        return `
        <div class="camp-card camp-fame-card">
          <div class="camp-fame-head">
            <span class="camp-fame-campeon">🏆 ${h.mascota || ''} ${h.campeon}</span>
            <span class="camp-fame-fecha">${fecha}</span>
          </div>
          ${h.lugar ? `<div class="camp-fame-lugar">📍 ${h.lugar}</div>` : ''}
          <div class="camp-fame-grupos">${(h.grupos || []).map(g => `${g.mascota || ''} ${g.name}: <strong>${g.score}</strong>`).join(' · ')}</div>
          ${(h.insignias || []).length ? `<div class="camp-fame-ins">${h.insignias.map(i => `<span title="${i.nombre}">${i.icon}</span>`).join(' ')}</div>` : ''}
        </div>`;
      }).join('')}

      ${hist.length ? `<button class="camp-action-btn camp-fame-borrar" id="camp-fame-clear">🗑 Borrar historial</button>` : ''}
      <button class="camp-action-btn" id="camp-fame-back">← Menú del Campeonísimo</button>
    </div>`;

  const clearBtn = $id('camp-fame-clear');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    if (!confirm('¿Borrar TODO el historial del Salón de la Fama? Esta acción no se puede deshacer.')) return;
    _campSave({ historial: [] });
    renderFame();
  });
  $id('camp-fame-back').addEventListener('click', () => { _sfx('click'); renderCampHome(); });
}

/* ══════════════════════════════════════════════════════════════
   MODO PRÁCTICA
══════════════════════════════════════════════════════════════ */
function renderPracticeSetup() {
  CAMP.screen = 'practice';
  CAMP.P = null;
  _stopTimer();

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
            </label>`).join('')}
        </div>
      </div>`;
  }).join('');

  _container.innerHTML = `
    <div class="camp-setup">
      <div class="camp-setup-hero">
        <div class="camp-trophy">🎯</div>
        <h2 class="camp-setup-title">Modo Práctica</h2>
        <p class="camp-setup-sub">Entrena a tu ritmo con los temas que elijas</p>
      </div>

      <div class="camp-card">
        <div class="camp-card-label">Número de preguntas</div>
        <div class="camp-timer-row">
          ${[10,15,20].map(n => `<button class="camp-pn-btn${n===10?' active':''}" data-n="${n}">${n}</button>`).join('')}
        </div>
      </div>

      <div class="camp-card">
        <div class="camp-card-label camp-ms-header-row">
          <span>Temas para practicar</span>
          <div>
            <button class="camp-ms-global" id="camp-ms-all">Todas ✓</button>
            <button class="camp-ms-global camp-ms-none" id="camp-ms-none">Ninguna ○</button>
          </div>
        </div>
        <div class="camp-ms-blocks">${misionHTML}</div>
      </div>

      <button class="camp-start-btn" id="camp-pr-start">🎯 ¡A practicar!</button>
      <button class="camp-action-btn" id="camp-pr-back">← Volver</button>
    </div>`;

  _container.querySelectorAll('.camp-pn-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      _sfx('click');
      _container.querySelectorAll('.camp-pn-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    })
  );
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

  $id('camp-pr-start').addEventListener('click', () => { _sfx('start'); startPractice(); });
  $id('camp-pr-back').addEventListener('click', () => { _sfx('click'); renderCampHome(); });
}

function startPractice() {
  const nBtn = _container.querySelector('.camp-pn-btn.active');
  const n    = nBtn ? +nBtn.dataset.n : 10;
  const checked = [..._container.querySelectorAll('.camp-ms-ck:checked')].map(c => c.value);
  const sel = checked.length ? new Set(checked) : null;

  let pool = [];
  CAMP_SUBJECTS.forEach(s => {
    (_bank()[s.key] || []).forEach(q => {
      /* barajar opciones también en la práctica: que no se memorice la letra */
      if (!sel || sel.has(q.mision)) pool.push({ ..._shuffleOpciones(q), subj: s.key });
    });
  });
  if (!pool.length) { alert('Selecciona al menos una misión para practicar.'); return; }

  /* Barajar (Fisher-Yates) y tomar n */
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  CAMP.P = {
    qs: pool.slice(0, Math.min(n, pool.length)),
    idx: 0, aciertos: 0, streak: 0, bestStreak: 0,
    errores: {},     /* mision → nº errores */
  };
  renderPractice();
}

function renderPractice() {
  const P = CAMP.P;
  if (!P) { renderPracticeSetup(); return; }
  if (P.idx >= P.qs.length) { renderPracticeEnd(); return; }

  CAMP.screen = 'practice';
  const q = P.qs[P.idx];
  const subject = CAMP_SUBJECTS.find(s => s.key === q.subj);

  _container.innerHTML = `
    <div class="camp-question-screen">
      <div class="camp-pr-top">
        <span class="camp-pr-prog">Pregunta ${P.idx + 1} de ${P.qs.length}</span>
        <span class="camp-pr-score">✔ ${P.aciertos}</span>
        <span class="camp-pr-streak">${P.streak >= 3 ? '🔥 ' + P.streak : ''}</span>
      </div>
      <div class="diag-bar"><div class="diag-bar-fill" style="width:${Math.round(P.idx / P.qs.length * 100)}%"></div></div>

      <div class="camp-q-header camp-q-header-${subject.cls}">
        <span class="camp-q-subj-icon">${subject.icon}</span>
        <div class="camp-q-subj-info">
          <span class="camp-q-subj-label">${subject.label}</span>
          <span class="camp-q-mision">${q.mision}</span>
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

      <div class="camp-q-actions" id="camp-pr-actions">
        <button class="camp-action-btn" id="camp-pr-salir">🚪 Terminar práctica</button>
      </div>
    </div>`;

  _container.querySelectorAll('.camp-q-opt').forEach(btn =>
    btn.addEventListener('click', () => {
      const i = +btn.dataset.i;
      const ok = i === q.c;
      _container.querySelectorAll('.camp-q-opt').forEach((b, bi) => {
        b.disabled = true;
        if (bi === q.c) b.classList.add('correct');
        else if (bi === i) b.classList.add('wrong');
      });
      if (ok) {
        _sfx('pts');
        P.aciertos++; P.streak++;
        if (P.streak > P.bestStreak) P.bestStreak = P.streak;
      } else {
        _sfx('wrong');
        P.streak = 0;
        P.errores[q.mision] = (P.errores[q.mision] || 0) + 1;
      }
      const actions = $id('camp-pr-actions');
      actions.innerHTML = `
        <p class="camp-pr-fb ${ok ? 'ok' : 'no'}">${ok ? '✔ ¡Correcto!' : '✘ La respuesta era: ' + q.o[q.c]}</p>
        <button class="camp-start-btn" id="camp-pr-next">${P.idx + 1 >= P.qs.length ? '🏁 Ver mi resultado' : '▶ Siguiente pregunta'}</button>`;
      $id('camp-pr-next').addEventListener('click', () => { _sfx('click'); P.idx++; renderPractice(); });
    })
  );

  $id('camp-pr-salir').addEventListener('click', () => {
    if (!confirm('¿Terminar la práctica y ver tu resultado?')) return;
    P.qs = P.qs.slice(0, P.idx);  /* solo cuenta lo respondido */
    renderPracticeEnd();
  });
}

/* Emparejar el nombre de misión del banco con el catálogo (para "Repasar") */
function _campNorm(s) {
  s = String(s || '').toLowerCase();
  try { s = s.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (_) {}
  return s.replace(/[^a-z0-9ñ ]/g, ' ');
}
function _findMissionByTitle(title) {
  if (typeof MISSIONS === 'undefined') return null;
  const words = _campNorm(title).split(/\s+/).filter(w => w.length > 3);
  let best = null, bestN = 0;
  MISSIONS.forEach(m => {
    const mw = new Set(_campNorm(m.title).split(/\s+/).filter(w => w.length > 3));
    const n  = words.filter(w => mw.has(w)).length;
    if (n > bestN) { bestN = n; best = m; }
  });
  return bestN >= Math.min(2, words.length) ? best : null;
}

function renderPracticeEnd() {
  const P = CAMP.P;
  const total = P.qs.length;
  const pct   = total ? Math.round(P.aciertos / total * 100) : 0;
  const emoji = pct >= 90 ? '🌟' : pct >= 70 ? '💪' : pct >= 50 ? '📚' : '🌱';
  const msg   = pct >= 90 ? '¡Nivel Campeonísimo! Estás listo para el torneo.'
              : pct >= 70 ? '¡Muy bien! Un repaso más y llegas al oro.'
              : pct >= 50 ? 'Buen esfuerzo. Repasa los temas sugeridos y vuelve a intentarlo.'
              : 'Todo campeón empieza practicando. ¡Explora las misiones y vuelve!';

  const repasar = Object.keys(P.errores).map(mision => {
    const m = _findMissionByTitle(mision);
    return { mision, fallos: P.errores[mision], m };
  }).sort((a, b) => b.fallos - a.fallos);

  _sfx(pct >= 70 ? 'fanfare' : 'reveal');

  _container.innerHTML = `
    <div class="camp-setup">
      <div class="camp-setup-hero">
        <div class="camp-trophy">${emoji}</div>
        <h2 class="camp-setup-title">${pct}%</h2>
        <p class="camp-setup-sub">${P.aciertos} de ${total} correctas · Mejor racha: ${P.bestStreak} ${P.bestStreak >= 3 ? '🔥' : ''}</p>
        <p class="camp-pr-msg">${msg}</p>
      </div>

      ${repasar.length ? `
        <div class="camp-card">
          <div class="camp-card-label">📚 Temas para repasar</div>
          ${repasar.map(r => `
            <div class="camp-rep-row">
              <span class="camp-rep-tema">${r.mision}</span>
              <span class="camp-rep-fallos">${r.fallos} error${r.fallos > 1 ? 'es' : ''}</span>
              ${r.m ? `<button class="camp-rep-btn" onclick="visitMission(${r.m.id})">Repasar →</button>` : ''}
            </div>`).join('')}
        </div>` : (total ? `
        <div class="camp-card">
          <div class="camp-card-label">🎯 ¡Sin errores!</div>
          <p class="camp-pr-msg" style="margin:4px 0 2px;">Dominaste todos los temas de esta práctica.</p>
        </div>` : '')}

      <button class="camp-start-btn" id="camp-pr-otra">🎯 Practicar de nuevo</button>
      <button class="camp-action-btn" id="camp-pr-home">← Menú del Campeonísimo</button>
    </div>`;

  $id('camp-pr-otra').addEventListener('click', () => { _sfx('click'); renderPracticeSetup(); });
  $id('camp-pr-home').addEventListener('click', () => { _sfx('click'); CAMP.P = null; renderCampHome(); });
}

/* ── Registro de navegación (llamado por app.js al cargar) ── */
function campRegisterNav() {
  $id('goto-camp-btn')?.addEventListener('click', () => switchView('view-campeonismo'));
  $id('camp-back-btn')?.addEventListener('click', () => switchView('view-perfil'));
}
window.campRegisterNav = campRegisterNav;
