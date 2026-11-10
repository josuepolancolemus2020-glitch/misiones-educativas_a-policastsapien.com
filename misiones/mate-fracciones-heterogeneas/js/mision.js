/* ==========================================================================
   M.E.T.A.S — Misión: Suma y Resta de Fracciones con Diferente Denominador
   Archivo: misiones/mate-fracciones-heterogeneas/js/mision.js
   Arquitectura: 100% Offline-First · 17 Secciones + Lab 3 Pasos + Evaluaciones
   ========================================================================== */

const MISION_ID = 'mate-fracciones-heterogeneas';
const META_EJERCICIOS = 5;
const STORAGE_KEY = 'metas_frac_heterogeneas_v2';

/* ═══════════════ ESTADO GLOBAL Y GAMIFICACIÓN ═══════════════ */
const S = {
  xp: 0,
  snd: true,
  sec: 's-predice',
  visited: new Set(['s-predice']),
  ach: new Set(),
  predDone: new Set(),
  typeSeen: new Set(),
  fcIdx: 0,
  fcKnown: new Set(),
  qScore: 0,
  qAns: {},
  clIdx: 0,
  clScore: 0,
  idAns: {},
  compDone: new Set(),
  expDone: new Set(),
  tasksDone: new Set(),
  sopaFound: new Set(),
  sopaSel: null,
  retoBest: 0,
  labCompletados: 0,
  eventoEnviado: false,
  modoOperacion: 'mixto',
  modoVista: 'ambos',
  pasoActual: 1,
  ejercicioActual: null,
  indicePool: 0
};

const LEVELS = [
  { min: 0, t: 'Nv.1 Aprendiz del MCM' },
  { min: 100, t: 'Nv.2 Explorador de Equivalentes' },
  { min: 220, t: 'Nv.3 Arquitecto de Denominadores' },
  { min: 360, t: 'Nv.4 Maestro de la Simplificación' },
  { min: 520, t: 'Nv.5 Leyenda Heterogénea M.E.T.A.S' }
];

const ACHS = [
  { id: 'first_pred', ic: '🔮', nm: 'Intuición Fraccionaria', ds: 'Completaste las 3 predicciones iniciales' },
  { id: 'all_types', ic: '🔍', nm: 'Explorador de Casos', ds: 'Exploraste los 6 casos de fracciones heterogéneas' },
  { id: 'lab_first', ic: '🔬', nm: 'Primer Paso Firme', ds: 'Resolviste tu primer ejercicio en 3 pasos' },
  { id: 'lab_five', ic: '⭐', nm: 'Meta 5/5 Cumplida', ds: 'Completaste 5 ejercicios en el Laboratorio 3 Pasos' },
  { id: 'fc_master', ic: '🃏', nm: 'Memoria de Denominadores', ds: 'Dominaste al menos 8 flashcards' },
  { id: 'quiz_pro', ic: '🧠', nm: 'Mente Analítica', ds: 'Obtuviste 10 o más aciertos en el Quiz' },
  { id: 'clas_pro', ic: '🗂️', nm: 'Estratega del MCM', ds: 'Clasificaste 8 o más pares de denominadores' },
  { id: 'detective', ic: '🎯', nm: 'Cazador de Errores', ds: 'Detectaste todos los errores en Identifica' },
  { id: 'completa_pro', ic: '✏️', nm: 'Calculador Preciso', ds: 'Completaste los 8 ejercicios de Completa' },
  { id: 'reto_hero', ic: '🏆', nm: 'Relámpago del MCM', ds: 'Superaste 60 puntos en el Reto Cronometrado' },
  { id: 'sopa_done', ic: '🔤', nm: 'Léxico Fraccionario', ds: 'Encontraste las 8 palabras en la Sopa de Letras' },
  { id: 'eval_grad', ic: '🎓', nm: 'Graduado con Honores', ds: 'Aprobaste una Evaluación Sumativa con 70% o más' }
];

const SECS = [
  's-predice', 's-aprende', 's-videos', 's-tipos', 's-errores',
  's-lab', 's-flash', 's-quiz', 's-clasifica', 's-identifica',
  's-completa', 's-widgets', 's-explica', 's-reto', 's-sopa',
  's-tareas', 's-evaluacion', 's-recursos'
];

/* ═══════════════ SONIDO WEB AUDIO Y SÍNTESIS DE VOZ ═══════════════ */
let audioCtx = null;
function sfx(type) {
  if (!S.snd) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    if (type === 'ok') {
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now); osc.stop(now + 0.25);
    } else if (type === 'bad') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.setValueAtTime(165, now + 0.1);
      gain.gain.setValueAtTime(0.11, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now); osc.stop(now + 0.28);
    } else if (type === 'win') {
      [523.25, 659.25, 783.99, 1046.5].forEach((f, idx) => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.connect(g); g.connect(audioCtx.destination);
        o.frequency.setValueAtTime(f, now + idx * 0.09);
        g.gain.setValueAtTime(0.12, now + idx * 0.09);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.24);
        o.start(now + idx * 0.09); o.stop(now + idx * 0.09 + 0.24);
      });
    } else {
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now); osc.stop(now + 0.09);
    }
  } catch (e) {}
}

function hablarTexto(texto) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const limpio = String(texto || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const u = new SpeechSynthesisUtterance(limpio);
    u.lang = 'es-HN';
    u.rate = 0.96;
    u.pitch = 1.04;
    const voces = window.speechSynthesis.getVoices();
    const vozEs = voces.find(v => v.lang && v.lang.toLowerCase().startsWith('es'));
    if (vozEs) u.voice = vozEs;
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

function escucharPaso(numPaso) {
  const ej = S.ejercicioActual;
  if (!ej) return;
  const verboOp = ej.op === '+' ? ' más ' : ' menos ';
  const verboAccion = ej.op === '+' ? 'sumar' : 'restar';
  if (numPaso === 1) {
    hablarTexto(`Paso 1: Encontrar el denominador común. Ejercicio: ${ej.numA} sobre ${ej.denA}, ${verboOp} ${ej.numB} sobre ${ej.denB}. Busca el mínimo común múltiplo de ${ej.denA} y ${ej.denB} y toca el botón correcto.`);
  } else if (numPaso === 2) {
    hablarTexto(`Paso 2: Convertir a fracciones equivalentes con denominador ${ej.mcm}. Para la primera fracción, multiplica el numerador ${ej.numA} por ${ej.multA}. Para la segunda fracción, multiplica el numerador ${ej.numB} por ${ej.multB}.`);
  } else if (numPaso === 3) {
    const extraSimp = ej.requiereSimp ? ' Después simplifica el resultado dividiendo numerador y denominador entre su máximo común divisor.' : '';
    hablarTexto(`Paso 3: Realizar la operación final. Ahora que ambas tienen denominador ${ej.mcm}, vamos a ${verboAccion} ${ej.eqNumA} y ${ej.eqNumB} en el numerador y conservar ${ej.mcm} en el denominador.${extraSimp}`);
  }
}

function escucharPasoActual() {
  if (S.sec === 's-lab') {
    escucharPaso(S.pasoActual || 1);
    return;
  }
  const mapaVoz = {
    's-predice': 'Sección Predice y Observa. Lee cada situación con fracciones de diferente denominador y elige tu predicción antes de ver la explicación.',
    's-aprende': 'Sección Aprende. Para sumar o restar fracciones heterogéneas seguimos tres pasos: Uno, hallar el mínimo común múltiplo de los denominadores. Dos, convertir a fracciones equivalentes multiplicando cada numerador. Tres, operar los numeradores y simplificar.',
    's-videos': 'Sección Videos de la Misión. Mira los videos explicativos sobre suma y resta de fracciones con diferente denominador.',
    's-tipos': 'Sección Explorar Casos. Toca cada una de las seis tarjetas para conocer los casos de denominadores coprimos, denominador múltiplo, factor común, resta y simplificación.',
    's-errores': 'Sección Errores Comunes. Recuerda que nunca se suman ni se restan los denominadores directamente.',
    's-flash': 'Sección Flashcards. Toca la tarjeta para voltearla y repasar los conceptos clave.',
    's-quiz': 'Sección Quiz. Responde las doce preguntas sobre suma y resta de fracciones heterogéneas.',
    's-clasifica': 'Sección Clasifica. Identifica qué estrategia de denominador común conviene en cada operación.',
    's-identifica': 'Sección Identifica. Actúa como detective y descubre en qué paso se equivocó cada estudiante.',
    's-completa': 'Sección Completa. Escribe el número que falta en cada paso de fracciones equivalentes.',
    's-widgets': 'Sección Mini Juegos. Practica con el Radar de MCM, el Método Mariposa y la Balanza de Fracciones.',
    's-explica': 'Sección Explica. Escribe con tus propias palabras por qué igualamos denominadores.',
    's-reto': 'Sección Reto Cronometrado. Resuelve la mayor cantidad de operaciones en noventa segundos.',
    's-sopa': 'Sección Sopa de Letras. Encuentra las ocho palabras del vocabulario de fracciones heterogéneas.',
    's-tareas': 'Sección Tareas para el cuaderno. Completa los seis problemas contextualizados en Honduras.',
    's-evaluacion': 'Sección Evaluación. Resuelve la Prueba Conceptual o la Prueba Operativa de cien puntos.',
    's-recursos': 'Sección Recursos. Abre e imprime la ficha didáctica oficial de siete páginas.'
  };
  hablarTexto(mapaVoz[S.sec] || 'Misión Suma y Resta de Fracciones Heterogéneas.');
}

/* ═══════════════ MATEMÁTICA AUXILIAR ═══════════════ */
function calcularMCD(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b !== 0) { const t = b; b = a % b; a = t; }
  return a || 1;
}

function calcularMCM(a, b) {
  return Math.abs(a * b) / calcularMCD(a, b);
}

/* ═══════════════ XP, LOGROS Y NAVEGACIÓN ═══════════════ */
function addXP(pts) {
  S.xp += pts;
  updateXPUI();
  saveProgress();
}

function updateXPUI() {
  let curLvl = LEVELS[0];
  let nextMin = 600;
  for (let i = 0; i < LEVELS.length; i++) {
    if (S.xp >= LEVELS[i].min) {
      curLvl = LEVELS[i];
      nextMin = LEVELS[i + 1] ? LEVELS[i + 1].min : 600;
    }
  }
  const elLvl = document.getElementById('xpLvl');
  const elPts = document.getElementById('xpPts');
  const elFill = document.getElementById('xpFill');
  const elTxt = document.getElementById('xpTxt');
  if (elLvl) elLvl.textContent = curLvl.t;
  if (elPts) elPts.textContent = `⭐ ${S.xp}`;
  if (elFill) elFill.style.width = Math.min(100, Math.round((S.xp / nextMin) * 100)) + '%';
  if (elTxt) elTxt.textContent = `${S.xp} / ${nextMin} XP`;
}

function compartirMision() {
  const titulo = document.title || 'Misión Fracciones Heterogéneas';
  const url = window.location.href;
  const texto = `🍕 ¡Aprende a sumar y restar fracciones con diferente denominador en 3 pasos! ${titulo}: ${url}`;
  if (navigator.share) {
    navigator.share({ title: titulo, text: texto, url }).catch(() => {});
  } else {
    window.open('https://wa.me/?text=' + encodeURIComponent(texto), '_blank');
  }
}

function unlockAch(id) {
  if (S.ach.has(id)) return;
  S.ach.add(id);
  sfx('win');
  renderAch();
  saveProgress();
}

function renderAch() {
  const grid = document.getElementById('achGrid');
  const cnt = document.getElementById('achCount');
  if (cnt) cnt.textContent = `${S.ach.size}/${ACHS.length}`;
  if (!grid) return;
  grid.innerHTML = ACHS.map(a => {
    const on = S.ach.has(a.id);
    return `<div class="ach-item ${on ? 'unlocked' : ''}">
      <div class="ach-ico">${a.ic}</div>
      <div><div class="ach-nm">${a.nm}</div><div class="ach-ds">${a.ds}</div></div>
    </div>`;
  }).join('');
}

function toggleAchPanel() {
  const p = document.getElementById('achPanel');
  if (p) p.classList.toggle('show');
}

function toggleSnd() {
  S.snd = !S.snd;
  const b = document.getElementById('sndBtn');
  if (b) b.textContent = S.snd ? '🔊 Sonido' : '🔇 Silencio';
  saveProgress();
}

let darkMode = false;
function initTheme() {
  const saved = localStorage.getItem('metas_theme_frac_het');
  if (saved) {
    darkMode = saved === 'dark';
  } else {
    darkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  applyTheme();
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  document.body.classList.toggle('light-mode', !darkMode);
  const b = document.getElementById('themeBtn');
  if (b) b.textContent = darkMode ? '☀️ Claro' : '🌙 Tema';
}

function toggleTheme() {
  darkMode = !darkMode;
  try { localStorage.setItem('metas_theme_frac_het', darkMode ? 'dark' : 'light'); } catch (e) {}
  applyTheme();
}

function toggleLetra() {
  document.body.classList.toggle('letra-grande');
}

function resetXP() {
  if (!confirm('¿Deseas reiniciar todo tu progreso de XP y logros en esta misión?')) return;
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
}

function go(secId) {
  const target = document.getElementById(secId);
  if (!target) return;
  document.querySelectorAll('.sec').forEach(el => {
    el.classList.remove('on', 'active');
  });
  target.classList.add('on', 'active');
  S.sec = secId;
  if (!S.visited.has(secId)) {
    S.visited.add(secId);
    addXP(5);
  }
  document.querySelectorAll('.nav-t').forEach(btn => {
    const active = btn.getAttribute('data-s') === secId;
    btn.classList.toggle('on', active);
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  renderProgDots();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (window.Fr && Fr.barrer) Fr.barrer(target);
}

function renderProgDots() {
  const box = document.getElementById('progDots');
  if (!box) return;
  box.innerHTML = SECS.map(id => {
    const cls = id === S.sec ? 'pdot on' : (S.visited.has(id) ? 'pdot done' : 'pdot');
    return `<span class="${cls}" onclick="go('${id}')" title="${id.replace('s-', '')}"></span>`;
  }).join('');
}

function openDiploma() {
  const ov = document.getElementById('diplomaOverlay');
  if (!ov) return;
  const dt = document.getElementById('dipDate');
  if (dt) dt.textContent = new Date().toLocaleDateString('es-HN');
  const st = document.getElementById('dipStats');
  if (st) {
    st.innerHTML = `
      <span class="dip-stat">⚡ ${S.xp} XP</span>
      <span class="dip-stat">⭐ ${S.labCompletados}/${META_EJERCICIOS} Lab 3 Pasos</span>
      <span class="dip-stat">🏅 ${S.ach.size}/${ACHS.length} Logros</span>
    `;
  }
  ov.classList.add('show');
}

function closeDiploma() {
  const ov = document.getElementById('diplomaOverlay');
  if (ov) ov.classList.remove('show');
}

function downloadDiploma() {
  const card = document.getElementById('diplomaCard');
  const btns = document.getElementById('dipBtns');
  if (!card || typeof html2canvas !== 'function') { window.print(); return; }
  if (btns) btns.style.display = 'none';
  const bgCol = getComputedStyle(document.documentElement).getPropertyValue('--bg-tarjeta').trim() || '#ffffff';
  html2canvas(card, { scale: 2, backgroundColor: bgCol }).then(canvas => {
    if (btns) btns.style.display = 'flex';
    const a = document.createElement('a');
    a.download = 'Constancia_Fracciones_Heterogeneas_METAS.png';
    a.href = canvas.toDataURL('image/png');
    a.click();
  }).catch(() => {
    if (btns) btns.style.display = 'flex';
    window.print();
  });
}

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      xp: S.xp,
      snd: S.snd,
      visited: Array.from(S.visited),
      ach: Array.from(S.ach),
      labCompletados: S.labCompletados,
      eventoEnviado: S.eventoEnviado,
      tasksDone: Array.from(S.tasksDone)
    }));
  } catch (e) {}
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const d = JSON.parse(raw);
    if (typeof d.xp === 'number') S.xp = d.xp;
    if (typeof d.snd === 'boolean') S.snd = d.snd;
    if (Array.isArray(d.visited)) d.visited.forEach(x => S.visited.add(x));
    if (Array.isArray(d.ach)) d.ach.forEach(x => S.ach.add(x));
    if (typeof d.labCompletados === 'number') S.labCompletados = d.labCompletados;
    if (typeof d.eventoEnviado === 'boolean') S.eventoEnviado = d.eventoEnviado;
    if (Array.isArray(d.tasksDone)) d.tasksDone.forEach(x => S.tasksDone.add(x));
  } catch (e) {}
}

/* ═══════════════ 0. SECCIÓN PREDICE + ANIMACIÓN SVG ═══════════════ */
const PREDS = [
  {
    id: 'p1',
    tag: '🍕 Acertijo 1 · La Quesadilla de Comayagua',
    q: 'Doña Reina horneó dos quesadillas iguales. En la mañana vendió <strong>1/2</strong> de la primera y en la tarde vendió <strong>1/3</strong> de la segunda. Un alumno dice que en total vendió «2/5 de quesadilla» porque sumó 1+1=2 arriba y 2+3=5 abajo. ¿Tiene razón?',
    opts: [
      { t: 'Sí, porque se suma numerador con numerador y denominador con denominador.', ok: false },
      { t: 'No, porque 2/5 es MENOR que 1/2: ¡al sumar 1/3 a media quesadilla no puede quedarte menos de la mitad! En realidad vendió 5/6.', ok: true },
      { t: 'No, porque dos fracciones con diferente denominador nunca se pueden sumar.', ok: false }
    ],
    exp: '¡Exacto! <strong>1/2 ya es la mitad (0.50)</strong>, mientras que <strong>2/5 es 0.40 (menos de la mitad)</strong>. Sumar denominadores achica el resultado absurdamente. Al partir ambas en sextos: <strong>1/2 = 3/6</strong> y <strong>1/3 = 2/6</strong>, así que <strong>3/6 + 2/6 = 5/6</strong> de quesadilla.'
  },
  {
    id: 'p2',
    tag: '🥛 Acertijo 2 · El Fresco de Horchata',
    q: 'En un pichel hay <strong>3/4 de litro</strong> de horchata y en otro hay <strong>1/8 de litro</strong>. Si vaciamos ambos en una jarra grande, ¿en qué tamaño de partes conviene medir todo?',
    opts: [
      { t: 'En octavos (denominador 8), porque 8 ya es múltiplo de 4 y 3/4 equivale a 6/8; en total son 7/8 de litro.', ok: true },
      { t: 'En doceavos (denominador 12), sumando 4 + 8 = 12.', ok: false },
      { t: 'En cuartos, dejando el 1/8 igual: 3/4 + 1/8 = 4/4.', ok: false }
    ],
    exp: '¡Brillante! Cuando un denominador es múltiplo del otro (<strong>8 es múltiplo de 4</strong>), el mayor ya es el <strong>MCM</strong>. Como cada cuarto tiene dos octavos, <strong>3/4 = 6/8</strong>, y <strong>6/8 + 1/8 = 7/8 de litro</strong>.'
  },
  {
    id: 'p3',
    tag: '🪵 Acertijo 3 · El Carpintero de Siguatepeque',
    q: 'Don Mateo tiene una tabla de <strong>5/6 de metro</strong> y le corta un trozo de <strong>1/4 de metro</strong>. Para restar <strong>5/6 − 1/4</strong>, ¿cuál es el menor denominador común (MCM de 6 y 4)?',
    opts: [
      { t: 'El MCM es 2, porque 6 − 4 = 2.', ok: false },
      { t: 'El MCM es 12, porque 12 es el menor número que está tanto en la tabla del 6 (6×2) como en la del 4 (4×3). Quedan 10/12 − 3/12 = 7/12 m.', ok: true },
      { t: 'El MCM es 10, porque 6 + 4 = 10.', ok: false }
    ],
    exp: '¡Excelente! Los múltiplos de 6 son 6, <strong>12</strong>, 18, 24... y los de 4 son 4, 8, <strong>12</strong>, 16, 20, 24... Aunque 24 también es múltiplo común, el <strong>Mínimo Común Múltiplo es 12</strong>: <strong>10/12 − 3/12 = 7/12 de metro</strong>.'
  }
];

function initPredice() {
  const box = document.getElementById('predBox');
  if (!box) return;
  box.innerHTML = PREDS.map((p, idx) => `
    <div class="pred-box" id="pred_${p.id}">
      <div class="pill p-gold" style="margin-bottom:0.5rem;">${p.tag}</div>
      <p style="font-size:0.92rem;line-height:1.65;margin-bottom:0.7rem;">${p.q}</p>
      <div id="predOpts_${idx}">
        ${p.opts.map((o, oi) => `<button class="pred-opt" onclick="ansPred(${idx},${oi})">${o.t}</button>`).join('')}
      </div>
      <div id="predExp_${idx}" class="explain-box" style="display:none;margin-top:0.7rem;"></div>
    </div>
  `).join('');
  montarAnimacionQuesadilla();
}

function ansPred(idx, oi) {
  const p = PREDS[idx];
  const optsWrap = document.getElementById('predOpts_' + idx);
  const expEl = document.getElementById('predExp_' + idx);
  if (!optsWrap || !expEl) return;
  const btns = optsWrap.querySelectorAll('.pred-opt');
  btns.forEach((b, i) => {
    b.disabled = true;
    if (p.opts[i].ok) b.classList.add('correct');
    else if (i === oi) b.classList.add('wrong');
  });
  expEl.style.display = 'block';
  expEl.innerHTML = (p.opts[oi].ok ? '✅ <strong>¡Tu intuición acertó!</strong> ' : '💡 <strong>Observa lo que ocurre:</strong> ') + p.exp;
  sfx(p.opts[oi].ok ? 'ok' : 'bad');
  if (!S.predDone.has(p.id)) {
    S.predDone.add(p.id);
    addXP(15);
    if (S.predDone.size === PREDS.length) unlockAch('first_pred');
  }
  if (window.Fr && Fr.barrer) Fr.barrer(expEl);
}

function montarAnimacionQuesadilla() {
  if (!window.AnimacionMision || !document.getElementById('amQuesadilla')) return;
  window.AnimacionMision.montar('#amQuesadilla', {
    titulo: '🎬 Míralo paso a paso: ¿Por qué 1/2 + 1/3 se convierte en 3/6 + 2/6 = 5/6?',
    pasos: [
      {
        texto: '<strong>Paso 1 · Dos bandejas iguales con cortes distintos:</strong> En la primera bandeja tenemos <strong>1/2</strong> (1 mitad dorada) y en la segunda <strong>1/3</strong> (1 tercio turquesa). Como los pedazos no miden lo mismo, todavía no podemos contarlos juntos.',
        svg: `<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="660" height="200" rx="16" fill="var(--bg-tarjeta-alt)" stroke="var(--borde-suave)" stroke-width="2"/>
          <text x="160" y="42" text-anchor="middle" fill="var(--gold)" font-weight="900" font-size="18">Bandeja A: 1/2</text>
          <rect x="60" y="60" width="100" height="90" rx="8" fill="var(--gold)" stroke="var(--bg-tarjeta)" stroke-width="2.5"/>
          <rect x="160" y="60" width="100" height="90" rx="8" fill="var(--frac-empty)" stroke="var(--borde-suave)" stroke-width="2.5"/>
          <text x="160" y="180" text-anchor="middle" fill="var(--texto-secundario)" font-weight="700" font-size="14">Partida en 2 mitades</text>
          <text x="340" y="115" text-anchor="middle" fill="var(--purple)" font-weight="900" font-size="34">+</text>
          <text x="510" y="42" text-anchor="middle" fill="var(--teal)" font-weight="900" font-size="18">Bandeja B: 1/3</text>
          <rect x="410" y="60" width="66.6" height="90" rx="8" fill="var(--teal)" stroke="var(--bg-tarjeta)" stroke-width="2.5"/>
          <rect x="476.6" y="60" width="66.6" height="90" rx="8" fill="var(--frac-empty)" stroke="var(--borde-suave)" stroke-width="2.5"/>
          <rect x="543.2" y="60" width="66.8" height="90" rx="8" fill="var(--frac-empty)" stroke="var(--borde-suave)" stroke-width="2.5"/>
          <text x="510" y="180" text-anchor="middle" fill="var(--texto-secundario)" font-weight="700" font-size="14">Partida en 3 tercios</text>
        </svg>`
      },
      {
        texto: '<strong>Paso 2 · Cortamos ambas bandejas en el MCM (6 partes iguales):</strong> Como <strong>MCM(2, 3) = 6</strong>, hacemos cortes para que las dos bandejas queden divididas en <strong>sextos</strong>. Mira cómo <strong>1/2 se vuelve 3/6</strong> y <strong>1/3 se vuelve 2/6</strong> sin cambiar la cantidad de comida.',
        svg: `<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="660" height="200" rx="16" fill="var(--bg-tarjeta-alt)" stroke="var(--borde-suave)" stroke-width="2"/>
          <text x="160" y="42" text-anchor="middle" fill="var(--gold)" font-weight="900" font-size="18">1/2 = 3/6 (×3 arriba y abajo)</text>
          <rect x="60" y="60" width="100" height="90" fill="var(--gold)" stroke="var(--bg-tarjeta)" stroke-width="2"/>
          <rect x="160" y="60" width="100" height="90" fill="var(--frac-empty)" stroke="var(--borde-suave)" stroke-width="2"/>
          <line x1="60" y1="90" x2="260" y2="90" stroke="var(--texto-principal)" stroke-dasharray="5,4" stroke-width="2"/>
          <line x1="60" y1="120" x2="260" y2="120" stroke="var(--texto-principal)" stroke-dasharray="5,4" stroke-width="2"/>
          <text x="160" y="180" text-anchor="middle" fill="var(--gold)" font-weight="800" font-size="14">3 de 6 sextos iluminados</text>
          <text x="340" y="115" text-anchor="middle" fill="var(--purple)" font-weight="900" font-size="34">+</text>
          <text x="510" y="42" text-anchor="middle" fill="var(--teal)" font-weight="900" font-size="18">1/3 = 2/6 (×2 arriba y abajo)</text>
          <rect x="410" y="60" width="66.6" height="90" fill="var(--teal)" stroke="var(--bg-tarjeta)" stroke-width="2"/>
          <rect x="476.6" y="60" width="66.6" height="90" fill="var(--frac-empty)" stroke="var(--borde-suave)" stroke-width="2"/>
          <rect x="543.2" y="60" width="66.8" height="90" fill="var(--frac-empty)" stroke="var(--borde-suave)" stroke-width="2"/>
          <line x1="410" y1="105" x2="610" y2="105" stroke="var(--texto-principal)" stroke-dasharray="5,4" stroke-width="2"/>
          <text x="510" y="180" text-anchor="middle" fill="var(--teal)" font-weight="800" font-size="14">2 de 6 sextos iluminados</text>
        </svg>`
      },
      {
        texto: '<strong>Paso 3 · ¡Ahora sí sumamos pedazos iguales!</strong> Juntamos los <strong>3 sextos dorados</strong> más los <strong>2 sextos turquesas</strong> en una sola bandeja de 6 partes: <strong>3/6 + 2/6 = 5/6</strong>. ¡5 de las 6 partes quedan llenas!',
        svg: `<svg viewBox="0 0 680 220" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="10" width="660" height="200" rx="16" fill="var(--bg-tarjeta-alt)" stroke="var(--green)" stroke-width="2"/>
          <text x="340" y="42" text-anchor="middle" fill="var(--green)" font-weight="900" font-size="20">Resultado Final: 3/6 + 2/6 = 5/6</text>
          <g transform="translate(130, 62)">
            <rect x="0" y="0" width="70" height="86" fill="var(--gold)" stroke="var(--bg-tarjeta)" stroke-width="2.5"/>
            <rect x="70" y="0" width="70" height="86" fill="var(--gold)" stroke="var(--bg-tarjeta)" stroke-width="2.5"/>
            <rect x="140" y="0" width="70" height="86" fill="var(--gold)" stroke="var(--bg-tarjeta)" stroke-width="2.5"/>
            <rect x="210" y="0" width="70" height="86" fill="var(--teal)" stroke="var(--bg-tarjeta)" stroke-width="2.5"/>
            <rect x="280" y="0" width="70" height="86" fill="var(--teal)" stroke="var(--bg-tarjeta)" stroke-width="2.5"/>
            <rect x="350" y="0" width="70" height="86" fill="var(--frac-empty)" stroke="var(--borde-suave)" stroke-width="2.5"/>
          </g>
          <text x="340" y="182" text-anchor="middle" fill="var(--texto-principal)" font-weight="800" font-size="15">3 sextos (de 1/2) + 2 sextos (de 1/3) = 5/6 de bandeja</text>
        </svg>`
      }
    ]
  });
}

/* ═══════════════ 3. SECCIÓN EXPLORAR CASOS (s-tipos) ═══════════════ */
const TYPES_DATA = [
  {
    ic: '🤝', nm: '1. Denominadores Coprimos', sub: 'No comparten divisores (ej. 2 y 3, 3 y 4)',
    desc: 'Cuando los dos denominadores no tienen ningún divisor común aparte del 1 (como 2 y 5, 3 y 4, o 4 y 7), su <strong>Mínimo Común Múltiplo (MCM) es simplemente su multiplicación</strong>.',
    rule: 'MCM(b, d) = b × d · Ejemplo: MCM(3, 5) = 15',
    ex: '<strong>2/3 + 1/5:</strong> MCM(3,5) = 15 → 2/3 = 10/15 y 1/5 = 3/15 → <strong>10/15 + 3/15 = 13/15</strong>.'
  },
  {
    ic: '🎯', nm: '2. Un Denominador es Múltiplo del Otro', sub: 'El mayor contiene al menor (ej. 2 y 6, 4 y 8)',
    desc: 'Si el denominador mayor se puede dividir exactamente entre el menor (como 8 entre 4, o 9 entre 3), <strong>¡el denominador mayor YA ES el MCM!</strong> Solo tienes que transformar la fracción de denominador pequeño.',
    rule: 'Si d es múltiplo de b → MCM(b, d) = d',
    ex: '<strong>1/4 + 5/8:</strong> Como 8 es múltiplo de 4, el MCM es 8. Convertimos 1/4 = 2/8 y sumamos: <strong>2/8 + 5/8 = 7/8</strong>.'
  },
  {
    ic: '🔗', nm: '3. Denominadores Compuestos con Factor Común', sub: 'Comparten divisores (ej. 4 y 6, 6 y 9)',
    desc: 'Cuando ambos denominadores tienen un divisor común (por ejemplo 4 y 6 son pares), su MCM es <strong>más pequeño que su multiplicación</strong>. Usar el MCM evita trabajar con números gigantes.',
    rule: 'MCM(4, 6) = 12 (menor que 4×6=24) · MCM(6, 9) = 18',
    ex: '<strong>3/4 + 1/6:</strong> MCM(4,6) = 12. 3/4 = 9/12 (×3) y 1/6 = 2/12 (×2). Suma: <strong>9/12 + 2/12 = 11/12</strong>.'
  },
  {
    ic: '➖', nm: '4. Resta de Fracciones Heterogéneas', sub: 'Comparar o quitar partes de distinto tamaño',
    desc: 'El procedimiento de los 3 pasos es idéntico al de la suma, pero en el Paso 3 <strong>restamos los numeradores equivalentes</strong>. ¡El orden importa: el minuendo siempre va primero!',
    rule: 'a/b − c/d = (a·k₁ − c·k₂) / MCM(b,d)',
    ex: '<strong>7/8 − 1/2:</strong> MCM(8,2) = 8. Convertimos 1/2 = 4/8. Restamos: <strong>7/8 − 4/8 = 3/8</strong>.'
  },
  {
    ic: '✨', nm: '5. Simplificación y Fracción Irreducible', sub: 'Dividir arriba y abajo entre el MCD',
    desc: 'Muchas veces, tras sumar o restar en el Paso 3, el resultado puede simplificarse dividiendo numerador y denominador entre su <strong>Máximo Común Divisor (MCD)</strong>.',
    rule: '1/6 + 1/3 = 1/6 + 2/6 = 3/6 → ÷3 arriba y abajo = 1/2',
    ex: '<strong>3/10 + 1/5:</strong> MCM=10 → 3/10 + 2/10 = 5/10. Dividimos entre 5: <strong>5/10 = 1/2</strong>.'
  },
  {
    ic: '🦋', nm: '6. Método Mariposa vs. 3 Fracciones', sub: 'Cuándo usar productos cruzados y cuándo MCM',
    desc: 'El <strong>Método Mariposa</strong> multiplica cruzado <code>(a×d ± b×c)/(b×d)</code> y es genial para 2 fracciones pequeñas. Si tienes <strong>3 fracciones</strong> (ej. 1/2 + 1/3 + 1/6), usa siempre el <strong>MCM de los tres denominadores</strong>.',
    rule: '1/2 + 1/3 + 1/6 → MCM(2,3,6) = 6 → 3/6 + 2/6 + 1/6 = 6/6 = 1',
    ex: '<strong>1/2 + 1/4 + 1/8:</strong> MCM(2,4,8) = 8 → 4/8 + 2/8 + 1/8 = <strong>7/8</strong>.'
  }
];

function initTipos() {
  const g = document.getElementById('typeGrid');
  if (!g) return;
  g.innerHTML = TYPES_DATA.map((t, i) => `
    <div class="type-card" id="tc_${i}" onclick="showType(${i})">
      <div class="tc-ico">${t.ic}</div>
      <div class="tc-nm">${t.nm}</div>
      <div class="tc-sub">${t.sub}</div>
    </div>
  `).join('');
  showType(0);
}

function showType(i) {
  const t = TYPES_DATA[i];
  document.querySelectorAll('.type-card').forEach((el, idx) => el.classList.toggle('active', idx === i));
  const det = document.getElementById('typeDetail');
  if (!det) return;
  det.style.display = 'block';
  det.innerHTML = `
    <div class="concept-box" style="border-left:4px solid var(--gold);">
      <h4 style="color:var(--gold);font-size:1.05rem;margin-bottom:0.4rem;">${t.ic} ${t.nm}</h4>
      <p style="font-size:0.9rem;line-height:1.65;margin-bottom:0.6rem;">${t.desc}</p>
      <div class="formula-pill" style="margin-bottom:0.6rem;display:inline-block;">${t.rule}</div>
      <div class="explain-box" style="margin-top:0.4rem;">🔎 <strong>Ejemplo paso a paso:</strong> ${t.ex}</div>
    </div>
  `;
  if (!S.typeSeen.has(i)) {
    S.typeSeen.add(i);
    addXP(5);
    if (S.typeSeen.size === TYPES_DATA.length) unlockAch('all_types');
  }
  if (window.Fr && Fr.barrer) Fr.barrer(det);
}

/* ═══════════════ 4. SECCIÓN ERRORES COMUNES ═══════════════ */
const ERRORS_DATA = [
  {
    bad: '❌ Error 1: Sumar o restar los denominadores directamente → 1/2 + 1/3 = 2/5 o 3/4 − 1/2 = 2/2',
    good: '✅ Corrección: Los denominadores NUNCA se suman ni se restan entre sí. Primero hallamos el MCM(2,3)=6 → 3/6 + 2/6 = 5/6; y en 3/4 − 1/2 → 3/4 − 2/4 = 1/4.'
  },
  {
    bad: '❌ Error 2: Cambiar el denominador al MCM pero dejar el numerador igual → 1/2 + 1/6 = 1/6 + 1/6 = 2/6',
    good: '✅ Corrección: Si el denominador de 1/2 se multiplicó por 3 para llegar a 6, ¡su numerador también debe multiplicarse por 3! 1/2 = 3/6, así que 3/6 + 1/6 = 4/6 = 2/3.'
  },
  {
    bad: '❌ Error 3: Multiplicar las dos fracciones por el mismo factor → En 1/3 + 1/4, multiplicar ambas por 4',
    good: '✅ Corrección: Cada fracción tiene su propio multiplicador según su denominador: 1/3 se multiplica por 4 (4/12), pero 1/4 se multiplica por 3 (3/12).'
  },
  {
    bad: '❌ Error 4: Invertir el orden de los productos cruzados en la resta → En 3/4 − 2/5, hacer (8 − 15)/20',
    good: '✅ Corrección: En la resta siempre va primero el numerador de la primera fracción: (3×5 − 4×2)/20 = (15 − 8)/20 = 7/20.'
  },
  {
    bad: '❌ Error 5: Olvidar simplificar el resultado final cuando numerador y denominador tienen factor común',
    good: '✅ Corrección: En 1/6 + 1/3 = 3/6, como 3 y 6 se dividen entre 3, simplificamos siempre a la fracción irreducible 1/2.'
  },
  {
    bad: '❌ Error 6: Sumar un entero directo al numerador → 2 + 1/3 = 3/3 = 1',
    good: '✅ Corrección: El entero 2 equivale a 2/1 = 6/3 (dos enteros completos son 6 tercios). Por tanto, 6/3 + 1/3 = 7/3 (o 2 1/3).'
  }
];

function initErrores() {
  const box = document.getElementById('errList');
  if (!box) return;
  box.innerHTML = ERRORS_DATA.map(e => `
    <div class="err-card">
      <div class="err-wrong">${e.bad}</div>
      <div class="err-right">${e.good}</div>
    </div>
  `).join('');
}

/* ═══════════════ 5. LABORATORIO 1: RETO INTERACTIVO EN 3 PASOS ═══════════════ */
const POOL_EJERCICIOS = [
  { numA: 1, denA: 2, numB: 1, denB: 3, op: '+' },
  { numA: 3, denA: 4, numB: 1, denB: 2, op: '-' },
  { numA: 1, denA: 3, numB: 1, denB: 6, op: '+' },
  { numA: 2, denA: 3, numB: 1, denB: 4, op: '+' },
  { numA: 5, denA: 6, numB: 1, denB: 3, op: '-' },
  { numA: 1, denA: 2, numB: 1, denB: 4, op: '+' },
  { numA: 3, denA: 5, numB: 1, denB: 2, op: '-' },
  { numA: 1, denA: 4, numB: 3, denB: 8, op: '+' },
  { numA: 4, denA: 5, numB: 3, denB: 10, op: '-' },
  { numA: 1, denA: 6, numB: 1, denB: 2, op: '+' },
  { numA: 7, denA: 8, numB: 1, denB: 4, op: '-' },
  { numA: 2, denA: 5, numB: 3, denB: 10, op: '+' },
  { numA: 5, denA: 6, numB: 1, denB: 4, op: '-' },
  { numA: 3, denA: 4, numB: 1, denB: 6, op: '+' },
  { numA: 7, denA: 10, numB: 1, denB: 5, op: '-' },
  { numA: 1, denA: 3, numB: 1, denB: 2, op: '+' },
  { numA: 2, denA: 3, numB: 1, denB: 6, op: '-' },
  { numA: 3, denA: 8, numB: 1, denB: 4, op: '+' }
];

function cambiarModoLab(modo) {
  S.modoOperacion = modo;
  document.getElementById('modoMixBtn')?.classList.toggle('on', modo === 'mixto');
  document.getElementById('modoSumaBtn')?.classList.toggle('on', modo === 'suma');
  document.getElementById('modoRestaBtn')?.classList.toggle('on', modo === 'resta');
  const badge = document.getElementById('badgeModoOperacion');
  if (badge) {
    badge.textContent = modo === 'suma' ? '➕ Modo: Solo Sumas' : (modo === 'resta' ? '➖ Modo: Solo Restas' : '➕➖ Modo: Suma y Resta Aleatoria');
  }
  generarNuevoEjercicio();
}

function cambiarVista(modo) {
  S.modoVista = modo;
  document.getElementById('btnVisAmbos')?.classList.toggle('on', modo === 'ambos');
  document.getElementById('btnVisCirculos')?.classList.toggle('on', modo === 'circulos');
  document.getElementById('btnVisBarras')?.classList.toggle('on', modo === 'barras');
  renderizarVisuales();
}

function crearDatosEjercicio(base) {
  const { numA, denA, numB, denB, op } = base;
  const mcm = calcularMCM(denA, denB);
  const multA = mcm / denA;
  const multB = mcm / denB;
  const eqNumA = numA * multA;
  const eqNumB = numB * multB;
  const rawNum = op === '+' ? (eqNumA + eqNumB) : (eqNumA - eqNumB);
  const rawDen = mcm;
  const mcd = calcularMCD(rawNum, rawDen);
  const simpNum = rawNum / mcd;
  const simpDen = rawDen / mcd;
  const requiereSimp = mcd > 1;
  return { numA, denA, numB, denB, op, mcm, multA, multB, eqNumA, eqNumB, rawNum, rawDen, mcd, simpNum, simpDen, requiereSimp };
}

function generarNuevoEjercicio() {
  let candidatos = POOL_EJERCICIOS;
  if (S.modoOperacion === 'suma') candidatos = POOL_EJERCICIOS.filter(x => x.op === '+');
  else if (S.modoOperacion === 'resta') candidatos = POOL_EJERCICIOS.filter(x => x.op === '-');

  const base = candidatos[S.indicePool % candidatos.length];
  S.indicePool++;
  S.ejercicioActual = crearDatosEjercicio(base);
  S.pasoActual = 1;

  const ej = S.ejercicioActual;
  document.getElementById('numA').textContent = ej.numA;
  document.getElementById('denA').textContent = ej.denA;
  document.getElementById('simboloOp').textContent = ej.op === '+' ? '+' : '−';
  document.getElementById('numB').textContent = ej.numB;
  document.getElementById('denB').textContent = ej.denB;
  document.getElementById('numResTop').textContent = '?';
  document.getElementById('denResTop').textContent = '?';
  document.getElementById('badgeOpVisual').textContent = ej.op === '+' ? '+' : '−';

  configurarPaso1(ej);
  configurarPaso2(ej);
  configurarPaso3(ej);
  actualizarIndicadoresPasos(1);
  renderizarVisuales();
}

function configurarPaso1(ej) {
  const inst1 = document.getElementById('instruccionPaso1');
  if (inst1) inst1.innerHTML = `Busca el <strong>Mínimo Común Múltiplo (MCM)</strong> de los denominadores <strong>${ej.denA}</strong> y <strong>${ej.denB}</strong>:`;

  const multA = [];
  const multB = [];
  for (let i = 1; i <= 5; i++) {
    multA.push(ej.denA * i);
    multB.push(ej.denB * i);
  }
  const helper = document.getElementById('ayudaMultiplos');
  if (helper) {
    helper.innerHTML = `
      <div>🔹 Múltiplos de <strong>${ej.denA}</strong>: ${multA.map(m => m === ej.mcm ? `<strong style="color:var(--gold);text-decoration:underline;">${m}</strong>` : m).join(', ')}...</div>
      <div>🔸 Múltiplos de <strong>${ej.denB}</strong>: ${multB.map(m => m === ej.mcm ? `<strong style="color:var(--teal);text-decoration:underline;">${m}</strong>` : m).join(', ')}...</div>
    `;
  }

  const setOpciones = new Set([ej.mcm]);
  const distractores = [ej.denA + ej.denB, ej.denA * ej.denB, ej.mcm + ej.denA, ej.mcm * 2, Math.max(ej.denA, ej.denB) + 2, 10, 12, 15, 18, 20, 24];
  for (const d of distractores) {
    if (setOpciones.size >= 4) break;
    if (d > 1 && d !== ej.mcm) setOpciones.add(d);
  }
  const listaOpciones = Array.from(setOpciones).sort((a, b) => a - b);
  const contOpciones = document.getElementById('opcionesMCM');
  if (contOpciones) {
    contOpciones.innerHTML = '';
    listaOpciones.forEach(valor => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mcm-btn';
      btn.textContent = valor;
      btn.onclick = () => verificarPaso1(valor, btn);
      contOpciones.appendChild(btn);
    });
  }
  mostrarFeedback('feedbackPaso1', '', '');
}

function verificarPaso1(valorElegido, botonPulsado) {
  if (S.pasoActual !== 1) return;
  const ej = S.ejercicioActual;
  const botones = document.querySelectorAll('#opcionesMCM .mcm-btn');
  if (valorElegido === ej.mcm) {
    sfx('ok');
    botones.forEach(b => {
      b.disabled = true;
      if (Number(b.textContent) === ej.mcm) b.classList.add('correct');
    });
    mostrarFeedback('feedbackPaso1', `✅ ¡Excelente! El MCM de ${ej.denA} y ${ej.denB} es ${ej.mcm}. Observa cómo las figuras se parten ahora en ${ej.mcm} partes iguales.`, 'ok');
    S.pasoActual = 2;
    actualizarIndicadoresPasos(2);
    renderizarVisuales();
    setTimeout(() => document.getElementById('inputEqNumA')?.focus(), 220);
  } else {
    sfx('bad');
    botonPulsado.classList.add('wrong');
    let pista = `💡 ${valorElegido} no es el Mínimo Común Múltiplo de ${ej.denA} y ${ej.denB}. `;
    if (valorElegido === ej.denA + ej.denB) {
      pista += `¡Cuidado! Sumaste ${ej.denA} + ${ej.denB}, pero los denominadores no se suman.`;
    } else if (valorElegido % ej.denA === 0 && valorElegido % ej.denB === 0) {
      pista += `${valorElegido} sí es múltiplo común, pero existe uno MÁS PEQUEÑO en la lista.`;
    } else {
      pista += `Busca el primer número resaltado que se repite en ambas filas de múltiplos.`;
    }
    mostrarFeedback('feedbackPaso1', pista, 'err');
  }
}

function configurarPaso2(ej) {
  document.getElementById('eqOrigNumA').textContent = ej.numA;
  document.getElementById('eqOrigDenA').textContent = ej.denA;
  document.getElementById('tagMultNumA').textContent = `× ${ej.multA}`;
  document.getElementById('tagMultDenA').textContent = `× ${ej.multA}`;
  document.getElementById('eqNuevoDenA').textContent = ej.mcm;
  document.getElementById('pistaEqA').textContent = `Porque ${ej.denA} × ${ej.multA} = ${ej.mcm}, entonces ${ej.numA} × ${ej.multA} = ?`;

  document.getElementById('eqOrigNumB').textContent = ej.numB;
  document.getElementById('eqOrigDenB').textContent = ej.denB;
  document.getElementById('tagMultNumB').textContent = `× ${ej.multB}`;
  document.getElementById('tagMultDenB').textContent = `× ${ej.multB}`;
  document.getElementById('eqNuevoDenB').textContent = ej.mcm;
  document.getElementById('pistaEqB').textContent = `Porque ${ej.denB} × ${ej.multB} = ${ej.mcm}, entonces ${ej.numB} × ${ej.multB} = ?`;

  const inA = document.getElementById('inputEqNumA');
  const inB = document.getElementById('inputEqNumB');
  if (inA) { inA.value = ''; inA.disabled = false; inA.className = 'num-input'; }
  if (inB) { inB.value = ''; inB.disabled = false; inB.className = 'num-input'; }
  const btn2 = document.getElementById('btnVerificarPaso2');
  if (btn2) btn2.disabled = false;
  mostrarFeedback('feedbackPaso2', '', '');
}

function verificarPaso2() {
  if (S.pasoActual !== 2) return;
  const ej = S.ejercicioActual;
  const inA = document.getElementById('inputEqNumA');
  const inB = document.getElementById('inputEqNumB');
  const valA = parseInt(inA.value, 10);
  const valB = parseInt(inB.value, 10);
  const okA = valA === ej.eqNumA;
  const okB = valB === ej.eqNumB;
  inA.className = 'num-input ' + (okA ? 'input-ok' : 'input-err');
  inB.className = 'num-input ' + (okB ? 'input-ok' : 'input-err');

  if (okA && okB) {
    sfx('ok');
    inA.disabled = true;
    inB.disabled = true;
    document.getElementById('btnVerificarPaso2').disabled = true;
    mostrarFeedback('feedbackPaso2', `✅ ¡Perfecto! ${ej.numA}/${ej.denA} = ${ej.eqNumA}/${ej.mcm} y ${ej.numB}/${ej.denB} = ${ej.eqNumB}/${ej.mcm}. ¡Vamos al paso final!`, 'ok');
    S.pasoActual = 3;
    actualizarIndicadoresPasos(3);
    renderizarVisuales();
    setTimeout(() => document.getElementById('inputRawNum')?.focus(), 220);
  } else {
    sfx('bad');
    let msg = '💡 Revisa la multiplicación: ';
    if (!okA) msg += `En la primera fracción multiplica ${ej.numA} × ${ej.multA}. `;
    if (!okB) msg += `En la segunda fracción multiplica ${ej.numB} × ${ej.multB}.`;
    mostrarFeedback('feedbackPaso2', msg, 'err');
  }
}

function configurarPaso3(ej) {
  document.getElementById('finNumA').textContent = ej.eqNumA;
  document.getElementById('finDenA').textContent = ej.mcm;
  document.getElementById('finOp').textContent = ej.op === '+' ? '+' : '−';
  document.getElementById('finNumB').textContent = ej.eqNumB;
  document.getElementById('finDenB').textContent = ej.mcm;

  const verbo = ej.op === '+' ? 'Suma' : 'Resta';
  const inst3 = document.getElementById('instruccionPaso3');
  if (inst3) {
    inst3.innerHTML = `${verbo} los numeradores (<strong>${ej.eqNumA} ${ej.op === '+' ? '+' : '−'} ${ej.eqNumB}</strong>) y conserva el denominador común (<strong>${ej.mcm}</strong>).` +
      (ej.requiereSimp ? ` Luego <strong>simplifica</strong> dividiendo arriba y abajo entre <strong>${ej.mcd}</strong>.` : '');
  }

  ['inputRawNum', 'inputRawDen', 'inputSimpNum', 'inputSimpDen'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.value = ''; el.disabled = false; el.className = 'num-input'; }
  });

  const panelSimp = document.getElementById('panelSimplificar');
  const badgeSimp = document.getElementById('badgeSimplificar');
  if (ej.requiereSimp) {
    panelSimp.hidden = false;
    badgeSimp.textContent = `✨ ¡Se puede simplificar! Divide numerador y denominador entre ${ej.mcd} (su MCD):`;
  } else {
    panelSimp.hidden = true;
  }
  document.getElementById('btnVerificarPaso3').disabled = false;
  document.getElementById('btnSiguienteEjercicio').hidden = true;
  mostrarFeedback('feedbackPaso3', '', '');
}

function verificarPaso3() {
  if (S.pasoActual !== 3) return;
  const ej = S.ejercicioActual;
  const inRawN = document.getElementById('inputRawNum');
  const inRawD = document.getElementById('inputRawDen');
  const valRawN = parseInt(inRawN.value, 10);
  const valRawD = parseInt(inRawD.value, 10);
  const okRawN = valRawN === ej.rawNum;
  const okRawD = valRawD === ej.rawDen;
  inRawN.className = 'num-input ' + (okRawN ? 'input-ok' : 'input-err');
  inRawD.className = 'num-input ' + (okRawD ? 'input-ok' : 'input-err');

  if (!okRawN || !okRawD) {
    sfx('bad');
    let msg = '💡 ';
    if (!okRawN) msg += `En el numerador calcula ${ej.eqNumA} ${ej.op === '+' ? '+' : '−'} ${ej.eqNumB} = ${ej.rawNum}. `;
    if (!okRawD) msg += `El denominador común ${ej.mcm} se copia igual abajo.`;
    mostrarFeedback('feedbackPaso3', msg, 'err');
    return;
  }

  if (ej.requiereSimp) {
    const inSimpN = document.getElementById('inputSimpNum');
    const inSimpD = document.getElementById('inputSimpDen');
    const valSimpN = parseInt(inSimpN.value, 10);
    const valSimpD = parseInt(inSimpD.value, 10);
    const okSimpN = valSimpN === ej.simpNum;
    const okSimpD = valSimpD === ej.simpDen;
    inSimpN.className = 'num-input ' + (okSimpN ? 'input-ok' : 'input-err');
    inSimpD.className = 'num-input ' + (okSimpD ? 'input-ok' : 'input-err');
    if (!okSimpN || !okSimpD) {
      sfx('bad');
      mostrarFeedback('feedbackPaso3', `💡 ¡La operación ${ej.rawNum}/${ej.rawDen} está bien! Ahora simplifícala dividiendo ${ej.rawNum} ÷ ${ej.mcd} arriba y ${ej.rawDen} ÷ ${ej.mcd} abajo.`, 'err');
      return;
    }
    inSimpN.disabled = true;
    inSimpD.disabled = true;
  }

  inRawN.disabled = true;
  inRawD.disabled = true;
  document.getElementById('btnVerificarPaso3').disabled = true;
  document.getElementById('btnSiguienteEjercicio').hidden = false;

  document.getElementById('numResTop').textContent = ej.simpNum;
  document.getElementById('denResTop').textContent = ej.simpDen;

  S.pasoActual = 4;
  actualizarIndicadoresPasos(4);
  renderizarVisuales();

  const txtFinal = ej.requiereSimp
    ? `🎉 ¡Excelente! ${ej.eqNumA}/${ej.mcm} ${ej.op === '+' ? '+' : '−'} ${ej.eqNumB}/${ej.mcm} = ${ej.rawNum}/${ej.rawDen}, y simplificada es ${ej.simpNum}/${ej.simpDen}. (+25 XP)`
    : `🎉 ¡Excelente! ${ej.eqNumA}/${ej.mcm} ${ej.op === '+' ? '+' : '−'} ${ej.eqNumB}/${ej.mcm} = ${ej.simpNum}/${ej.simpDen}. (+25 XP)`;
  mostrarFeedback('feedbackPaso3', txtFinal, 'ok');
  registrarEjercicioLabCompletado();
}

function actualizarIndicadoresPasos(paso) {
  const c1 = document.getElementById('cardPaso1');
  const c2 = document.getElementById('cardPaso2');
  const c3 = document.getElementById('cardPaso3');
  const p1 = document.getElementById('pillPaso1');
  const p2 = document.getElementById('pillPaso2');
  const p3 = document.getElementById('pillPaso3');
  const l1 = document.getElementById('lineaPaso1');
  const l2 = document.getElementById('lineaPaso2');
  if (!c1) return;

  c1.className = 'step-card ' + (paso === 1 ? 'active-step' : 'done-step');
  c2.className = 'step-card ' + (paso < 2 ? 'locked-step' : (paso === 2 ? 'active-step' : 'done-step'));
  c3.className = 'step-card ' + (paso < 3 ? 'locked-step' : (paso === 3 ? 'active-step' : 'done-step'));

  p1.className = 'step-pill ' + (paso === 1 ? 'active' : 'done');
  p2.className = 'step-pill ' + (paso < 2 ? '' : (paso === 2 ? 'active' : 'done'));
  p3.className = 'step-pill ' + (paso < 3 ? '' : (paso === 3 ? 'active' : 'done'));

  l1.className = 'step-line ' + (paso >= 2 ? 'done' : '');
  l2.className = 'step-line ' + (paso >= 3 ? 'done' : '');
}

function mostrarFeedback(id, texto, tipo) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className = 'feedback-msg' + (tipo ? ' ' + tipo : '');
}

function dibujarCirculoSVG(numerador, denominador, colorHex) {
  const size = 104, cx = 52, cy = 52, r = 43;
  const enteros = Math.max(1, Math.ceil(numerador / denominador));
  let html = '';
  let restantes = numerador;

  for (let c = 0; c < enteros; c++) {
    const iluminar = Math.max(0, Math.min(denominador, restantes));
    restantes -= iluminar;
    let sectores = '';
    if (denominador === 1) {
      const fill = iluminar >= 1 ? colorHex : 'var(--frac-empty)';
      sectores = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="var(--bg-tarjeta)" stroke-width="2"/>`;
    } else {
      for (let i = 0; i < denominador; i++) {
        const a1 = (i * 2 * Math.PI) / denominador - Math.PI / 2;
        const a2 = ((i + 1) * 2 * Math.PI) / denominador - Math.PI / 2;
        const x1 = cx + r * Math.cos(a1);
        const y1 = cy + r * Math.sin(a1);
        const x2 = cx + r * Math.cos(a2);
        const y2 = cy + r * Math.sin(a2);
        const largeArc = (a2 - a1) > Math.PI ? 1 : 0;
        const pathData = `M ${cx} ${cy} L ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(2)} ${y2.toFixed(2)} Z`;
        const activo = i < iluminar;
        const fill = activo ? colorHex : 'var(--frac-empty)';
        const cls = activo ? 'slice-lit' : '';
        sectores += `<path d="${pathData}" fill="${fill}" class="${cls}" stroke="var(--bg-tarjeta)" stroke-width="1.8"/>`;
      }
    }
    html += `<svg class="frac-circle-svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
      <circle cx="${cx}" cy="${cy}" r="${r + 2}" fill="none" stroke="var(--borde-suave)" stroke-width="2"/>
      ${sectores}
    </svg>`;
  }
  return `<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap;">${html}</div>`;
}

function dibujarBarraSVG(numerador, denominador, colorHex) {
  const enteros = Math.max(1, Math.ceil(numerador / denominador));
  let html = '';
  let restantes = numerador;
  for (let b = 0; b < enteros; b++) {
    const iluminar = Math.max(0, Math.min(denominador, restantes));
    restantes -= iluminar;
    let celdas = '';
    for (let i = 0; i < denominador; i++) {
      const activo = i < iluminar;
      const estilo = activo ? `background:${colorHex};` : '';
      const cls = activo ? 'frac-bar-cell lit' : 'frac-bar-cell';
      celdas += `<div class="${cls}" style="${estilo}"></div>`;
    }
    html += `<div class="frac-bar-wrap" style="margin-bottom:${enteros > 1 ? '4px' : '0'};">${celdas}</div>`;
  }
  return html;
}

function construirCanvasFraccion(num, den, colorHex) {
  let out = '';
  if (S.modoVista === 'circulos' || S.modoVista === 'ambos') out += dibujarCirculoSVG(num, den, colorHex);
  if (S.modoVista === 'barras' || S.modoVista === 'ambos') out += dibujarBarraSVG(num, den, colorHex);
  return out;
}

function renderizarVisuales() {
  const ej = S.ejercicioActual;
  if (!ej) return;
  const usarEquivalentes = S.pasoActual >= 2;
  const mostrarResultado = S.pasoActual >= 4;

  const nA = usarEquivalentes ? ej.eqNumA : ej.numA;
  const dA = usarEquivalentes ? ej.mcm : ej.denA;
  const nB = usarEquivalentes ? ej.eqNumB : ej.numB;
  const dB = usarEquivalentes ? ej.mcm : ej.denB;

  document.getElementById('tituloVisA').textContent = usarEquivalentes
    ? `Fracción 1: ${ej.numA}/${ej.denA} = ${nA}/${dA}`
    : `Fracción 1: ${nA}/${dA}`;
  document.getElementById('subtituloVisA').textContent = `${nA} de ${dA} partes iluminadas`;
  document.getElementById('lienzoVisA').innerHTML = construirCanvasFraccion(nA, dA, '#f59e0b');

  document.getElementById('tituloVisB').textContent = usarEquivalentes
    ? `Fracción 2: ${ej.numB}/${ej.denB} = ${nB}/${dB}`
    : `Fracción 2: ${nB}/${dB}`;
  document.getElementById('subtituloVisB').textContent = `${nB} de ${dB} partes iluminadas`;
  document.getElementById('lienzoVisB').innerHTML = construirCanvasFraccion(nB, dB, '#14b8a6');

  const tRes = document.getElementById('tituloVisRes');
  const sRes = document.getElementById('subtituloVisRes');
  const lRes = document.getElementById('lienzoVisRes');

  if (mostrarResultado) {
    tRes.textContent = ej.requiereSimp
      ? `Resultado: ${ej.rawNum}/${ej.rawDen} = ${ej.simpNum}/${ej.simpDen}`
      : `Resultado: ${ej.simpNum}/${ej.simpDen}`;
    sRes.textContent = `${ej.simpNum} de ${ej.simpDen} partes iluminadas`;
    lRes.innerHTML = construirCanvasFraccion(ej.simpNum, ej.simpDen, '#22c55e');
  } else if (S.pasoActual >= 2) {
    tRes.textContent = `Resultado en /${ej.mcm}`;
    sRes.textContent = `Resuelve el Paso ${S.pasoActual} para iluminar el total`;
    lRes.innerHTML = construirCanvasFraccion(0, ej.mcm, '#22c55e');
  } else {
    tRes.textContent = 'Resultado: ?';
    sRes.textContent = 'Halla primero el MCM en el Paso 1';
    lRes.innerHTML = `<div style="font-size:2rem;opacity:0.4;padding:0.8rem;">🔒</div>`;
  }
}

function actualizarUIEstrellasLab() {
  const txt = document.getElementById('textoMeta');
  if (txt) txt.textContent = `${Math.min(S.labCompletados, META_EJERCICIOS)} / ${META_EJERCICIOS} completados`;
  document.querySelectorAll('#estrellasMeta .star-slot').forEach((s, idx) => {
    s.classList.toggle('earned', idx < S.labCompletados);
  });
  const banner = document.getElementById('bannerCompletado');
  if (banner) banner.hidden = S.labCompletados < META_EJERCICIOS;
}

function dispararRegistroMetas() {
  document.dispatchEvent(new CustomEvent('metas:registro', { detail: { id: 'frac-het-' + Date.now(), tipo: 'evaluacion', mision: MISION_ID, nota: 100, base: 100, t: new Date().toISOString() } }));
}

function registrarEjercicioLabCompletado() {
  S.labCompletados++;
  addXP(25);
  unlockAch('lab_first');
  actualizarUIEstrellasLab();

  if (S.labCompletados >= META_EJERCICIOS && !S.eventoEnviado) {
    S.eventoEnviado = true;
    unlockAch('lab_five');
    sfx('win');
    dispararRegistroMetas();
    if (window.EstrellaGanada && typeof window.EstrellaGanada.mostrar === 'function') {
      try { window.EstrellaGanada.mostrar(); } catch (e) {}
    }
    hablarTexto('¡Felicidades! Has completado los cinco ejercicios de suma y resta de fracciones heterogéneas. Tu calificación de cien puntos se ha guardado en el Plan de Acción.');
  } else {
    sfx('ok');
  }
  saveProgress();
}

function reiniciarMision5() {
  S.labCompletados = 0;
  S.eventoEnviado = false;
  saveProgress();
  actualizarUIEstrellasLab();
  generarNuevoEjercicio();
}

/* ═══════════════ LABORATORIO 2: EXPLORADOR EN VIVO DE MCM Y MARIPOSA ═══════════════ */
function updateSimMCM() {
  const an = Math.max(1, parseInt(document.getElementById('simAn')?.value || '3', 10));
  const ad = Math.max(2, parseInt(document.getElementById('simAd')?.value || '4', 10));
  const bn = Math.max(1, parseInt(document.getElementById('simBn')?.value || '1', 10));
  const bd = Math.max(2, parseInt(document.getElementById('simBd')?.value || '6', 10));
  const op = document.getElementById('simOp')?.value || '+';

  const mcm = calcularMCM(ad, bd);
  const k1 = mcm / ad;
  const k2 = mcm / bd;
  const eqA = an * k1;
  const eqB = bn * k2;
  const resMcmNum = op === '+' ? (eqA + eqB) : (eqA - eqB);
  const mcd = calcularMCD(resMcmNum, mcm);
  const simpN = resMcmNum / mcd;
  const simpD = mcm / mcd;

  const maripDen = ad * bd;
  const ala1 = an * bd;
  const ala2 = ad * bn;
  const maripNum = op === '+' ? (ala1 + ala2) : (ala1 - ala2);

  const out = document.getElementById('simMCMOutput');
  if (!out) return;
  out.innerHTML = `
    <div class="g2">
      <div class="concept-box" style="border-left:4px solid var(--gold);">
        <span class="pill p-gold">MÉTODO 1 · CON EL MCM (${mcm})</span>
        <p style="font-size:0.86rem;line-height:1.65;margin-top:0.5rem;">
          • <strong>Paso 1:</strong> MCM(${ad}, ${bd}) = <strong>${mcm}</strong>.<br>
          • <strong>Paso 2:</strong> ${an}/${ad} × ${k1}/${k1} = <strong>${eqA}/${mcm}</strong> · y · ${bn}/${bd} × ${k2}/${k2} = <strong>${eqB}/${mcm}</strong>.<br>
          • <strong>Paso 3:</strong> ${eqA}/${mcm} ${op === '+' ? '+' : '−'} ${eqB}/${mcm} = <strong>${resMcmNum}/${mcm}</strong>
          ${mcd > 1 ? ` → Simplificando (÷${mcd}): <strong style="color:var(--green);">${simpN}/${simpD}</strong>` : ' (Ya es irreducible)'}.
        </p>
      </div>
      <div class="concept-box" style="border-left:4px solid var(--purple);">
        <span class="pill p-purple">MÉTODO 2 · MARIPOSA (PRODUCTOS CRUZADOS)</span>
        <p style="font-size:0.86rem;line-height:1.65;margin-top:0.5rem;">
          • <strong>Ala izquierda:</strong> ${an} × ${bd} = <strong>${ala1}</strong>.<br>
          • <strong>Ala derecha:</strong> ${ad} × ${bn} = <strong>${ala2}</strong>.<br>
          • <strong>Cola (denominadores):</strong> ${ad} × ${bd} = <strong>${maripDen}</strong>.<br>
          • <strong>Resultado:</strong> (${ala1} ${op === '+' ? '+' : '−'} ${ala2}) / ${maripDen} = <strong>${maripNum}/${maripDen}</strong> = <strong style="color:var(--green);">${simpN}/${simpD}</strong>.
        </p>
      </div>
    </div>
  `;
  if (window.Fr && Fr.barrer) Fr.barrer(out);
}

function randomSimMCM() {
  const ejemplos = [
    [3, 4, 1, 6, '+'], [5, 6, 1, 4, '-'], [2, 3, 3, 5, '+'],
    [7, 8, 1, 2, '-'], [3, 10, 2, 5, '+'], [5, 9, 1, 6, '-']
  ];
  const pick = ejemplos[Math.floor(Math.random() * ejemplos.length)];
  document.getElementById('simAn').value = pick[0];
  document.getElementById('simAd').value = pick[1];
  document.getElementById('simBn').value = pick[2];
  document.getElementById('simBd').value = pick[3];
  document.getElementById('simOp').value = pick[4];
  updateSimMCM();
}

/* ═══════════════ 6. FLASHCARDS (s-flash) ═══════════════ */
const FCS = [
  { q: '¿Qué son las fracciones heterogéneas?', a: 'Son dos o más fracciones que tienen DIFERENTE denominador (por ejemplo 1/2 y 1/3), lo que significa que el entero está partido en pedazos de distinto tamaño.' },
  { q: '¿Por qué NO podemos sumar 1/2 + 1/3 haciendo (1+1)/(2+3) = 2/5?', a: 'Porque los denominadores indican el tamaño del pedazo, no la cantidad de pedazos. Además, 2/5 (0.40) es menor que 1/2 (0.50), ¡lo cual es imposible al sumar una cantidad positiva!' },
  { q: '¿Cuáles son los 3 pasos para sumar o restar fracciones heterogéneas?', a: 'Paso 1: Hallar el denominador común (MCM). Paso 2: Convertir a fracciones equivalentes multiplicando cada numerador. Paso 3: Sumar o restar los numeradores y simplificar.' },
  { q: '¿Qué es el Mínimo Común Múltiplo (MCM) de dos denominadores?', a: 'Es el menor número positivo que es múltiplo de ambos denominadores a la vez (por ejemplo, el MCM de 4 y 6 es 12).' },
  { q: 'Si un denominador es múltiplo del otro (como en 1/3 + 4/9), ¿cuál es el MCM?', a: 'El denominador MAYOR ya es el MCM (en este caso 9). Solo necesitamos convertir 1/3 en 3/9.' },
  { q: 'Si los dos denominadores son primos entre sí o coprimos (como 3 y 5), ¿cómo se halla su MCM?', a: 'Multiplicándolos directamente: MCM(3, 5) = 3 × 5 = 15.' },
  { q: '¿Cómo se convierte 2/3 en una fracción equivalente con denominador 12?', a: 'Dividimos 12 ÷ 3 = 4 y multiplicamos numerador y denominador por 4: (2×4)/(3×4) = 8/12.' },
  { q: '¿En qué consiste el Método Mariposa para sumar o restar a/b ± c/d?', a: 'Se multiplican en cruz las dos alas (a×d y b×c), se suman o restan arriba, y abajo se multiplican los denominadores (b×d): (a·d ± b·c)/(b·d).' },
  { q: '¿Qué significa simplificar una fracción a su forma irreducible?', a: 'Dividir el numerador y el denominador entre su Máximo Común Divisor (MCD) hasta que ya no compartan ningún divisor mayor que 1 (ej. 4/6 = 2/3).' },
  { q: '¿Cómo se resta un entero menos una fracción, como 2 − 1/4?', a: 'Se escribe el entero como fracción con denominador 1 (2/1), se iguala al denominador 4 (8/4) y se resta: 8/4 − 1/4 = 7/4.' },
  { q: '¿Cómo se suman dos números mixtos con diferente denominador, como 1 1/2 + 2 1/3?', a: 'Podemos convertirlos a fracciones impropias (3/2 + 7/3), igualar al MCM=6 (9/6 + 14/6 = 23/6 = 3 5/6) o sumar enteros aparte y fracciones aparte.' },
  { q: '¿Cuánto es 1/2 + 1/4 + 1/8?', a: 'El MCM de 2, 4 y 8 es 8. Convertimos: 4/8 + 2/8 + 1/8 = 7/8.' }
];

function renderFC() {
  const f = FCS[S.fcIdx];
  const card = document.getElementById('fcCard');
  if (card) card.classList.remove('flip');
  const tag = document.getElementById('fcTag');
  const q = document.getElementById('fcQ');
  const a = document.getElementById('fcA');
  const st = document.getElementById('fcStats');
  if (tag) tag.textContent = `CONCEPTO ${S.fcIdx + 1} / ${FCS.length}`;
  if (q) q.innerHTML = window.Fr ? Fr(f.q) : f.q;
  if (a) a.innerHTML = window.Fr ? Fr(f.a) : f.a;
  if (st) st.textContent = `Dominadas: ${S.fcKnown.size} de ${FCS.length} tarjetas`;
}

function flipFC() {
  const c = document.getElementById('fcCard');
  if (c) { c.classList.toggle('flip'); sfx('tap'); }
}

function nextFC() {
  S.fcIdx = (S.fcIdx + 1) % FCS.length;
  renderFC();
}

function prevFC() {
  S.fcIdx = (S.fcIdx - 1 + FCS.length) % FCS.length;
  renderFC();
}

function markFC(known) {
  if (known && !S.fcKnown.has(S.fcIdx)) {
    S.fcKnown.add(S.fcIdx);
    addXP(5);
    sfx('ok');
    if (S.fcKnown.size >= 8) unlockAch('fc_master');
  } else {
    sfx('tap');
  }
  nextFC();
}

function hablarFlashcardActual() {
  const f = FCS[S.fcIdx];
  if (!f) return;
  const c = document.getElementById('fcCard');
  const volteada = c && c.classList.contains('flip');
  hablarTexto(volteada ? f.a : f.q);
}

/* ═══════════════ 7. QUIZ (s-quiz) ═══════════════ */
const QUIZ_BANK = [
  { q: '¿Cuál es el resultado correcto de sumar 1/2 + 1/3?', opts: ['5/6', '2/5', '2/6', '1/6'], ok: 0, hint: 'El MCM de 2 y 3 es 6: convierte a 3/6 + 2/6.', exp: 'MCM(2,3) = 6 → 1/2 = 3/6 y 1/3 = 2/6. Al sumar: 3/6 + 2/6 = 5/6.' },
  { q: '¿Cuál es el Mínimo Común Múltiplo (MCM) de los denominadores de 3/4 y 5/6?', opts: ['12', '24', '10', '2'], ok: 0, hint: 'Busca el primer múltiplo de 6 que también se divide entre 4.', exp: 'Múltiplos de 4: 4, 8, 12... Múltiplos de 6: 6, 12... El menor múltiplo común es 12.' },
  { q: 'Al resolver 3/4 − 1/2, ¿qué resultado se obtiene?', opts: ['1/4', '2/2', '2/4', '1/2'], ok: 0, hint: 'Convierte 1/2 a cuartos multiplicando por 2 arriba y abajo.', exp: '1/2 equivale a 2/4. Entonces 3/4 − 2/4 = 1/4.' },
  { q: 'Si convertimos la fracción 2/5 a denominador 15, ¿cuál es su nuevo numerador?', opts: ['6', '5', '12', '2'], ok: 0, hint: '¿Por cuánto multiplicaste el 5 para llegar a 15?', exp: 'Como 5 × 3 = 15, multiplicamos el numerador 2 × 3 = 6. Así, 2/5 = 6/15.' },
  { q: '¿Cuál es el resultado simplificado de 1/6 + 1/3?', opts: ['1/2', '3/6', '2/9', '2/6'], ok: 0, hint: '1/3 = 2/6; suma con 1/6 y luego divide entre 3 arriba y abajo.', exp: '1/6 + 2/6 = 3/6. Dividiendo numerador y denominador entre 3 obtenemos 1/2.' },
  { q: 'En una receta se usan 2/3 de taza de leche y 1/4 de taza de crema. ¿Cuántas tazas de líquido son en total?', opts: ['11/12 de taza', '3/7 de taza', '8/12 de taza', '9/12 de taza'], ok: 0, hint: 'MCM(3,4) = 12 → 8/12 + 3/12.', exp: '2/3 = 8/12 y 1/4 = 3/12. La suma total es 8/12 + 3/12 = 11/12 de taza.' },
  { q: '¿Cuál es el resultado de restar 5/6 − 1/4?', opts: ['7/12', '4/2', '6/12', '4/10'], ok: 0, hint: 'El MCM de 6 y 4 es 12: convierte a doceavos antes de restar.', exp: '5/6 = 10/12 y 1/4 = 3/12. Restando: 10/12 − 3/12 = 7/12.' },
  { q: '¿Qué ocurre con el valor de una fracción cuando multiplicamos su numerador y su denominador por un mismo número distinto de cero?', opts: ['Se obtiene una fracción equivalente (su valor no cambia)', 'La fracción se duplica o triplica', 'La fracción se hace más pequeña', 'Se convierte en fracción impropia'], ok: 0, hint: 'Multiplicar arriba y abajo por k equivale a multiplicar por k/k = 1.', exp: 'Al multiplicar numerador y denominador por el mismo factor k obtenemos una fracción equivalente que representa exactamente la misma porción.' },
  { q: 'Calcula y simplifica a su forma irreducible: 4/5 − 3/10', opts: ['1/2', '5/10', '1/5', '7/10'], ok: 0, hint: '4/5 = 8/10; resta 3/10 y simplifica el resultado.', exp: '8/10 − 3/10 = 5/10, que al dividir entre 5 arriba y abajo se simplifica a 1/2.' },
  { q: '¿Cuál es la suma de las tres fracciones heterogéneas 1/2 + 1/3 + 1/6?', opts: ['1 entero (6/6)', '3/11', '5/6', '7/6'], ok: 0, hint: 'Convierte todas a sextos (denominador 6).', exp: '1/2 = 3/6 y 1/3 = 2/6. Sumando: 3/6 + 2/6 + 1/6 = 6/6 = 1 entero.' },
  { q: 'Si a un listón de 7/8 de metro se le corta un pedazo de 1/4 de metro, ¿cuánto listón queda?', opts: ['5/8 de metro', '6/4 de metro', '3/8 de metro', '6/8 de metro'], ok: 0, hint: '1/4 equivale a 2/8.', exp: '7/8 − 1/4 = 7/8 − 2/8 = 5/8 de metro.' },
  { q: '¿Cuánto resulta al restar 1 − 2/7?', opts: ['5/7', '1/7', '6/7', '3/7'], ok: 0, hint: 'El entero 1 se escribe como 7/7.', exp: 'Como 1 entero tiene 7 séptimos (7/7), entonces 7/7 − 2/7 = 5/7.' }
];

function initQuiz() {
  S.qScore = 0;
  S.qAns = {};
  const pill = document.getElementById('qScorePill');
  if (pill) pill.textContent = `Puntos: 0 / ${QUIZ_BANK.length}`;
  const box = document.getElementById('quizBox');
  if (!box) return;
  box.innerHTML = QUIZ_BANK.map((item, qi) => `
    <div class="q-box" id="qb_${qi}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
        <span class="pill p-teal">Pregunta ${qi + 1}</span>
        <button class="btn btn-ghost" style="padding:0.2rem 0.6rem;font-size:0.74rem;" onclick="toggleHint(${qi})">💡 Ver pista</button>
      </div>
      <p style="font-weight:800;font-size:0.92rem;margin-bottom:0.6rem;">${item.q}</p>
      <div id="qHint_${qi}" class="hint-box" style="display:none;margin-bottom:0.6rem;">💡 ${item.hint}</div>
      <div id="qOpts_${qi}">
        ${item.opts.map((op, oi) => `<button class="q-opt" onclick="ansQuiz(${qi},${oi})">${op}</button>`).join('')}
      </div>
      <div id="qExp_${qi}" class="explain-box" style="display:none;margin-top:0.6rem;"></div>
    </div>
  `).join('');
  if (window.Fr && Fr.barrer) Fr.barrer(box);
}

function toggleHint(qi) {
  const h = document.getElementById('qHint_' + qi);
  if (h) h.style.display = h.style.display === 'none' ? 'block' : 'none';
}

function ansQuiz(qi, oi) {
  if (S.qAns[qi] !== undefined) return;
  S.qAns[qi] = oi;
  const item = QUIZ_BANK[qi];
  const opts = document.querySelectorAll(`#qOpts_${qi} .q-opt`);
  opts.forEach((b, idx) => {
    b.disabled = true;
    if (idx === item.ok) b.classList.add('correct');
    else if (idx === oi) b.classList.add('wrong');
  });
  const exp = document.getElementById('qExp_' + qi);
  if (exp) {
    exp.style.display = 'block';
    exp.innerHTML = (oi === item.ok ? '✅ <strong>¡Correcto!</strong> ' : '❌ <strong>Revisa:</strong> ') + item.exp;
    if (window.Fr && Fr.barrer) Fr.barrer(exp);
  }
  if (oi === item.ok) {
    S.qScore++;
    addXP(10);
    sfx('ok');
    if (S.qScore >= 10) unlockAch('quiz_pro');
  } else {
    sfx('bad');
  }
  const pill = document.getElementById('qScorePill');
  if (pill) pill.textContent = `Puntos: ${S.qScore} / ${QUIZ_BANK.length}`;
}

/* ═══════════════ 8. CLASIFICA (s-clasifica) ═══════════════ */
const CLAS_ITEMS = [
  { op: '1/2 + 1/3', cat: 'coprimos', why: '2 y 3 son primos entre sí: su MCM es su producto 2 × 3 = 6.' },
  { op: '1/4 + 3/8', cat: 'multiplo', why: '8 es múltiplo de 4: el denominador mayor (8) ya es el MCM.' },
  { op: '3/4 + 1/6', cat: 'compuesto', why: '4 y 6 comparten el factor 2: su MCM es 12 (menor que 4×6=24).' },
  { op: '2/5 − 1/3', cat: 'coprimos', why: '5 y 3 no comparten divisores: su MCM es 5 × 3 = 15.' },
  { op: '5/9 − 1/3', cat: 'multiplo', why: '9 es múltiplo de 3: el denominador mayor (9) ya es el MCM.' },
  { op: '5/6 − 1/9', cat: 'compuesto', why: '6 y 9 comparten el factor 3: su MCM es 18 (menor que 6×9=54).' },
  { op: '3/7 + 1/2', cat: 'coprimos', why: '7 y 2 son primos entre sí: su MCM es 7 × 2 = 14.' },
  { op: '7/10 − 2/5', cat: 'multiplo', why: '10 es múltiplo de 5: el denominador mayor (10) ya es el MCM.' },
  { op: '5/8 + 1/6', cat: 'compuesto', why: '8 y 6 son pares (factor común 2): su MCM es 24 (menor que 48).' },
  { op: '1/4 + 7/12', cat: 'multiplo', why: '12 es múltiplo de 4: el denominador mayor (12) ya es el MCM.' }
];

function initClasifica() {
  S.clIdx = 0;
  S.clScore = 0;
  renderClasifica();
}

function renderClasifica() {
  const prog = document.getElementById('clProg');
  if (prog) prog.textContent = `Progreso: ${S.clIdx} / ${CLAS_ITEMS.length} · Aciertos: ${S.clScore}`;
  const box = document.getElementById('clBox');
  if (!box) return;
  if (S.clIdx >= CLAS_ITEMS.length) {
    box.innerHTML = `<div class="concept-box" style="text-align:center;border:2px solid var(--green);">
      <div style="font-size:2.2rem;">🎉🗂️</div>
      <h4 style="color:var(--green);margin:0.4rem 0;">¡Clasificación Completada! (${S.clScore} / ${CLAS_ITEMS.length})</h4>
      <p style="font-size:0.86rem;color:var(--muted);">Ahora sabes reconocer de un vistazo cuándo multiplicar denominadores, cuándo tomar el mayor y cuándo sacar el MCM compuesto.</p>
    </div>`;
    return;
  }
  const cur = CLAS_ITEMS[S.clIdx];
  box.innerHTML = `
    <div class="concept-box" style="text-align:center;">
      <div style="font-size:0.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;">Operación ${S.clIdx + 1} de ${CLAS_ITEMS.length}</div>
      <div style="font-size:1.7rem;font-weight:900;color:var(--gold);margin:0.6rem 0;">${cur.op}</div>
      <p style="font-size:0.85rem;color:var(--muted);margin-bottom:0.9rem;">¿Qué relación tienen sus denominadores para hallar el MCM?</p>
      <div style="display:flex;gap:0.6rem;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-gold" onclick="ansClasifica('coprimos')">🤝 Coprimos (MCM = b × d)</button>
        <button class="btn btn-teal" onclick="ansClasifica('multiplo')">🎯 Uno es múltiplo del otro (MCM = el mayor)</button>
        <button class="btn btn-purple" onclick="ansClasifica('compuesto')">🔗 Compuestos con factor común (MCM &lt; b × d)</button>
      </div>
      <div id="clFeedback" style="margin-top:0.8rem;font-weight:800;font-size:0.86rem;"></div>
    </div>
  `;
  if (window.Fr && Fr.barrer) Fr.barrer(box);
}

function ansClasifica(cat) {
  const cur = CLAS_ITEMS[S.clIdx];
  const fb = document.getElementById('clFeedback');
  if (!fb) return;
  if (cat === cur.cat) {
    S.clScore++;
    addXP(10);
    sfx('ok');
    if (S.clScore >= 8) unlockAch('clas_pro');
    fb.style.color = 'var(--green)';
    fb.innerHTML = `✅ ¡Correcto! ${cur.why}`;
  } else {
    sfx('bad');
    fb.style.color = 'var(--coral)';
    fb.innerHTML = `💡 Observa bien: ${cur.why}`;
  }
  setTimeout(() => {
    S.clIdx++;
    renderClasifica();
  }, 1400);
}

/* ═══════════════ 9. IDENTIFICA (CAZADOR DE ERRORES) ═══════════════ */
const IDENT_CASES = [
  {
    student: 'Caso 1 · Carlos resuelve 2/3 + 1/4:',
    work: 'Paso 1: MCM(3,4) = 12  →  Paso 2: 2/3 = 2/12 y 1/4 = 1/12  →  Paso 3: 2/12 + 1/12 = 3/12',
    opts: ['Error en el Paso 1 (MCM mal calculado)', 'Error en el Paso 2 (cambió el denominador a 12 pero no multiplicó los numeradores)', 'Error en el Paso 3 (sumó mal)', 'El procedimiento está 100% correcto'],
    ok: 1,
    exp: 'Carlos halló bien el MCM=12, pero en el Paso 2 dejó los numeradores 2 y 1 intactos. Debía hacer 2×4=8 (8/12) y 1×3=3 (3/12) para obtener 11/12.'
  },
  {
    student: 'Caso 2 · Sofía resuelve 5/6 − 1/3:',
    work: 'Paso 1: MCM(6,3) = 6  →  Paso 2: 5/6 se queda igual y 1/3 = 2/6  →  Paso 3: 5/6 − 2/6 = 3/6 = 1/2',
    opts: ['Error en el Paso 1', 'Error en el Paso 2', 'Error en el Paso 3', 'El procedimiento está 100% correcto'],
    ok: 3,
    exp: '¡Sofía lo hizo impecable! Reconoció que 6 es múltiplo de 3, convirtió 1/3 = 2/6, restó 5/6 − 2/6 = 3/6 y simplificó entre 3 para llegar a 1/2.'
  },
  {
    student: 'Caso 3 · Diego resuelve 1/2 + 2/5:',
    work: 'Paso 1: Denominador común = 2 + 5 = 7  →  Paso 2: 1/7 + 2/7  →  Paso 3: 3/7',
    opts: ['Error desde el Paso 1 (sumó los denominadores 2+5 en lugar de hallar el MCM=10)', 'Solo se equivocó al simplificar al final', 'El procedimiento está 100% correcto', 'Error únicamente al sumar 1+2'],
    ok: 0,
    exp: 'Diego cometió el error clásico en el Paso 1: sumó los denominadores 2 + 5 = 7. El MCM de 2 y 5 es 10, por lo que 1/2 + 2/5 = 5/10 + 4/10 = 9/10.'
  },
  {
    student: 'Caso 4 · Valeria resuelve 3/4 − 1/6:',
    work: 'Paso 1: MCM(4,6) = 12  →  Paso 2: 3/4 = 9/12 y 1/6 = 2/12  →  Paso 3: 9/12 + 2/12 = 11/12',
    opts: ['Error en el Paso 1', 'Error en el Paso 2', 'Error en el Paso 3 (sumó los numeradores 9+2 cuando la operación original era una RESTA)', 'El procedimiento está 100% correcto'],
    ok: 2,
    exp: 'Valeria hizo perfectos los Pasos 1 y 2, pero en el Paso 3 sumó en vez de restar: 9/12 − 2/12 debía dar 7/12.'
  },
  {
    student: 'Caso 5 · Andrés resuelve 1/6 + 1/2:',
    work: 'Paso 1: MCM(6,2) = 6  →  Paso 2: 1/6 + 3/6  →  Paso 3: 4/6 y afirma que 4/6 ya no se puede simplificar',
    opts: ['Error en el Paso 1', 'Error en el Paso 2', 'Error en el Paso 3 (4/6 sí se puede simplificar dividiendo entre 2 para obtener 2/3)', 'El procedimiento está 100% correcto'],
    ok: 2,
    exp: 'Como 4 y 6 son números pares, su MCD es 2. Al dividir 4÷2 y 6÷2 se obtiene la fracción irreducible 2/3.'
  }
];

function initIdentifica() {
  const box = document.getElementById('idBox');
  if (!box) return;
  box.innerHTML = IDENT_CASES.map((c, idx) => `
    <div class="q-box">
      <div class="pill p-purple" style="margin-bottom:0.4rem;">${c.student}</div>
      <div class="formula-pill" style="display:block;margin-bottom:0.7rem;font-size:0.88rem;">${c.work}</div>
      <div id="idOpts_${idx}">
        ${c.opts.map((o, oi) => `<button class="q-opt" onclick="ansIdent(${idx},${oi})">${o}</button>`).join('')}
      </div>
      <div id="idExp_${idx}" class="explain-box" style="display:none;margin-top:0.6rem;"></div>
    </div>
  `).join('');
  if (window.Fr && Fr.barrer) Fr.barrer(box);
}

function ansIdent(idx, oi) {
  if (S.idAns[idx] !== undefined) return;
  S.idAns[idx] = oi;
  const c = IDENT_CASES[idx];
  const btns = document.querySelectorAll(`#idOpts_${idx} .q-opt`);
  btns.forEach((b, i) => {
    b.disabled = true;
    if (i === c.ok) b.classList.add('correct');
    else if (i === oi) b.classList.add('wrong');
  });
  const exp = document.getElementById('idExp_' + idx);
  if (exp) {
    exp.style.display = 'block';
    exp.innerHTML = (oi === c.ok ? '✅ <strong>¡Buen ojo de detective!</strong> ' : '💡 <strong>Observa el detalle:</strong> ') + c.exp;
    if (window.Fr && Fr.barrer) Fr.barrer(exp);
  }
  if (oi === c.ok) {
    addXP(12);
    sfx('ok');
    if (Object.keys(S.idAns).length === IDENT_CASES.length) unlockAch('detective');
  } else {
    sfx('bad');
  }
}

/* ═══════════════ 10. COMPLETA (s-completa) ═══════════════ */
const COMP_ITEMS = [
  { pre: '1) En 1/2 + 1/4 = ▢/4 + 1/4 = 3/4, el numerador equivalente es:', ans: 2, hint: 'Porque 2 × 2 = 4, entonces 1 × 2 = 2.' },
  { pre: '2) El Mínimo Común Múltiplo (MCM) de los denominadores de 2/3 y 1/5 es:', ans: 15, hint: 'Multiplica 3 × 5.' },
  { pre: '3) En 2/3 + 1/6 = 4/6 + 1/6 = ▢/6, el numerador de la suma es:', ans: 5, hint: 'Suma 4 + 1.' },
  { pre: '4) En 5/6 − 1/2 = 5/6 − ▢/6 = 2/6 = 1/3, el numerador equivalente de 1/2 es:', ans: 3, hint: 'La mitad de 6 es 3 (1×3=3).' },
  { pre: '5) El Mínimo Común Múltiplo (MCM) de los denominadores 4 y 6 es:', ans: 12, hint: 'Es el menor múltiplo común de 4 y 6.' },
  { pre: '6) En 3/4 + 1/6 = 9/12 + 2/12 = ▢/12, el numerador final es:', ans: 11, hint: 'Suma 9 + 2.' },
  { pre: '7) Al simplificar 4/6 dividiendo entre 2 arriba y abajo, queda ▢/3:', ans: 2, hint: 'Divide 4 ÷ 2.' },
  { pre: '8) En 1 − 3/8 = 8/8 − 3/8 = ▢/8, el numerador resultante es:', ans: 5, hint: 'Resta 8 − 3.' }
];

function initCompleta() {
  const box = document.getElementById('compBox');
  if (!box) return;
  box.innerHTML = COMP_ITEMS.map((c, i) => `
    <div class="fill-row" id="compRow_${i}" style="justify-content:space-between;">
      <span style="flex:1;min-width:220px;">${c.pre}</span>
      <div style="display:flex;gap:0.4rem;align-items:center;">
        <input type="number" class="fill-in" id="compIn_${i}" inputmode="numeric" placeholder="?">
        <button class="btn btn-teal" style="padding:0.35rem 0.7rem;font-size:0.76rem;" onclick="checkOneCompleta(${i})">✓</button>
      </div>
      <div id="compFb_${i}" style="width:100%;font-size:0.78rem;color:var(--muted);display:none;"></div>
    </div>
  `).join('');
  if (window.Fr && Fr.barrer) Fr.barrer(box);
}

function checkOneCompleta(i) {
  const item = COMP_ITEMS[i];
  const inp = document.getElementById('compIn_' + i);
  const fb = document.getElementById('compFb_' + i);
  if (!inp || !fb) return;
  const val = parseInt(inp.value, 10);
  fb.style.display = 'block';
  if (val === item.ans) {
    inp.classList.remove('bad');
    inp.classList.add('ok');
    fb.style.color = 'var(--green)';
    fb.textContent = `✅ ¡Correcto! ${item.hint}`;
    sfx('ok');
    if (!S.compDone.has(i)) {
      S.compDone.add(i);
      addXP(10);
      if (S.compDone.size === COMP_ITEMS.length) unlockAch('completa_pro');
    }
  } else {
    inp.classList.remove('ok');
    inp.classList.add('bad');
    fb.style.color = 'var(--coral)';
    fb.textContent = `💡 Pista: ${item.hint}`;
    sfx('bad');
  }
}

function checkAllCompleta() {
  COMP_ITEMS.forEach((_, i) => checkOneCompleta(i));
}

/* ═══════════════ 11. MINI-JUEGOS / WIDGETS (s-widgets) ═══════════════ */
let wMcmData = { a: 4, b: 6, mcm: 12 };
let wMaripData = { an: 2, ad: 3, bn: 1, bd: 4 };
let wBalIdx = 0;
const W_BAL_ITEMS = [
  { expr: '1/2 + 1/3', rel: '<', why: '1/2 + 1/3 = 5/6, que le falta 1/6 para llegar a 1 entero.' },
  { expr: '3/4 + 1/2', rel: '>', why: '3/4 + 2/4 = 5/4 (1 entero y 1/4), por lo que supera 1 entero.' },
  { expr: '2/3 + 1/3', rel: '=', why: '2/3 + 1/3 = 3/3 = exactamente 1 entero.' },
  { expr: '1/2 + 1/3 + 1/6', rel: '=', why: '3/6 + 2/6 + 1/6 = 6/6 = exactamente 1 entero.' },
  { expr: '5/6 + 1/3', rel: '>', why: '5/6 + 2/6 = 7/6, que es mayor que 1 entero.' },
  { expr: '7/8 − 1/4', rel: '<', why: '7/8 − 2/8 = 5/8, que es menor que 1 entero.' }
];

function initWidgets() {
  newWidgetMCM();
  newWidgetMariposa();
  renderWidgetBalanza();
}

function newWidgetMCM() {
  const pares = [[2,3],[3,4],[4,6],[6,8],[3,9],[4,10],[6,9],[5,10],[3,5],[8,12]];
  const p = pares[Math.floor(Math.random() * pares.length)];
  const mcm = calcularMCM(p[0], p[1]);
  wMcmData = { a: p[0], b: p[1], mcm };
  const opts = Array.from(new Set([mcm, p[0] + p[1], p[0] * p[1] === mcm ? mcm * 2 : p[0] * p[1], mcm + p[0]])).sort((x, y) => x - y);
  const box = document.getElementById('wMcmBox');
  if (!box) return;
  box.innerHTML = `
    <div style="text-align:center;font-size:1.3rem;font-weight:900;margin-bottom:0.6rem;">MCM(${p[0]}, ${p[1]}) = ?</div>
    <div style="display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;">
      ${opts.map(o => `<button class="btn btn-ghost" onclick="ansWidgetMCM(${o})">${o}</button>`).join('')}
    </div>
    <div id="wMcmFb" style="text-align:center;margin-top:0.6rem;font-size:0.82rem;font-weight:800;"></div>
  `;
}

function ansWidgetMCM(val) {
  const fb = document.getElementById('wMcmFb');
  if (!fb) return;
  if (val === wMcmData.mcm) {
    fb.style.color = 'var(--green)';
    fb.textContent = `✅ ¡Exacto! MCM(${wMcmData.a}, ${wMcmData.b}) = ${wMcmData.mcm} (+8 XP)`;
    addXP(8); sfx('ok');
    setTimeout(newWidgetMCM, 1100);
  } else {
    fb.style.color = 'var(--coral)';
    fb.textContent = `💡 No es ${val}. Busca el menor múltiplo común de ${wMcmData.a} y ${wMcmData.b}.`;
    sfx('bad');
  }
}

function newWidgetMariposa() {
  const casos = [[2,3,1,4],[1,2,2,5],[3,5,1,3],[1,4,2,3],[3,7,1,2]];
  const c = casos[Math.floor(Math.random() * casos.length)];
  wMaripData = { an: c[0], ad: c[1], bn: c[2], bd: c[3] };
  const box = document.getElementById('wMariposaBox');
  if (!box) return;
  box.innerHTML = `
    <div style="text-align:center;font-size:1.25rem;font-weight:900;color:var(--purple);margin-bottom:0.5rem;">${c[0]}/${c[1]} + ${c[2]}/${c[3]}</div>
    <div style="display:flex;gap:0.4rem;justify-content:center;align-items:center;flex-wrap:wrap;font-size:0.84rem;">
      <span>Ala 1 (${c[0]}×${c[3]}):</span>
      <input type="number" id="wmA1" class="fill-in" style="width:58px;" placeholder="?">
      <span>+ Ala 2 (${c[1]}×${c[2]}):</span>
      <input type="number" id="wmA2" class="fill-in" style="width:58px;" placeholder="?">
      <span>/ Cola (${c[1]}×${c[3]}):</span>
      <input type="number" id="wmCola" class="fill-in" style="width:58px;" placeholder="?">
    </div>
    <div style="text-align:center;margin-top:0.6rem;display:flex;gap:0.4rem;justify-content:center;">
      <button class="btn btn-purple" style="padding:0.35rem 0.8rem;font-size:0.78rem;" onclick="checkWidgetMariposa()">🦋 Comprobar Mariposa</button>
      <button class="btn btn-ghost" style="padding:0.35rem 0.8rem;font-size:0.78rem;" onclick="newWidgetMariposa()">🎲 Otra</button>
    </div>
    <div id="wMaripFb" style="text-align:center;margin-top:0.5rem;font-size:0.82rem;font-weight:800;"></div>
  `;
  if (window.Fr && Fr.barrer) Fr.barrer(box);
}

function checkWidgetMariposa() {
  const { an, ad, bn, bd } = wMaripData;
  const a1 = parseInt(document.getElementById('wmA1')?.value || '0', 10);
  const a2 = parseInt(document.getElementById('wmA2')?.value || '0', 10);
  const cola = parseInt(document.getElementById('wmCola')?.value || '0', 10);
  const fb = document.getElementById('wMaripFb');
  if (!fb) return;
  if (a1 === an * bd && a2 === ad * bn && cola === ad * bd) {
    fb.style.color = 'var(--green)';
    fb.textContent = `✅ ¡Mariposa perfecta! (${a1} + ${a2})/${cola} = ${a1 + a2}/${cola} (+10 XP)`;
    addXP(10); sfx('ok');
  } else {
    fb.style.color = 'var(--coral)';
    fb.textContent = `💡 Revisa: Ala 1 = ${an}×${bd}=${an*bd}, Ala 2 = ${ad}×${bn}=${ad*bn}, Cola = ${ad}×${bd}=${ad*bd}.`;
    sfx('bad');
  }
}

function renderWidgetBalanza() {
  const cur = W_BAL_ITEMS[wBalIdx % W_BAL_ITEMS.length];
  const box = document.getElementById('wBalanzaBox');
  if (!box) return;
  box.innerHTML = `
    <div style="text-align:center;">
      <div style="font-size:1.45rem;font-weight:900;color:var(--teal);margin-bottom:0.6rem;">${cur.expr}</div>
      <div style="display:flex;gap:0.6rem;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-ghost" onclick="ansWidgetBalanza('<')">⬇️ Menor que 1 (&lt; 1)</button>
        <button class="btn btn-ghost" onclick="ansWidgetBalanza('=')">⚖️ Igual a 1 (= 1)</button>
        <button class="btn btn-ghost" onclick="ansWidgetBalanza('>')">⬆️ Mayor que 1 (&gt; 1)</button>
      </div>
      <div id="wBalFb" style="margin-top:0.6rem;font-size:0.84rem;font-weight:800;"></div>
    </div>
  `;
  if (window.Fr && Fr.barrer) Fr.barrer(box);
}

function ansWidgetBalanza(rel) {
  const cur = W_BAL_ITEMS[wBalIdx % W_BAL_ITEMS.length];
  const fb = document.getElementById('wBalFb');
  if (!fb) return;
  if (rel === cur.rel) {
    fb.style.color = 'var(--green)';
    fb.textContent = `✅ ¡Correcto! ${cur.why} (+8 XP)`;
    addXP(8); sfx('ok');
    setTimeout(() => { wBalIdx++; renderWidgetBalanza(); }, 1300);
  } else {
    fb.style.color = 'var(--coral)';
    fb.textContent = `💡 Pista: ${cur.why}`;
    sfx('bad');
  }
}

/* ═══════════════ 12. EXPLICA (s-explica) ═══════════════ */
const EXP_QUESTIONS = [
  {
    q: '1. Un compañero de 5° grado te pregunta: «¿Por qué en 1/2 + 1/3 no puedo sumar 1+1=2 arriba y 2+3=5 abajo?». ¿Cómo se lo explicarías usando el ejemplo de dos pizzas o quesadillas?',
    model: 'Porque 1/2 y 1/3 son pedazos de distinto tamaño. Además, si sumas media pizza (1/2) más otro pedazo (1/3), el resultado tiene que ser MÁS de media pizza, pero 2/5 es MENOS de la mitad. Primero debemos partir ambas pizzas en 6 partes iguales (sextos): 3/6 + 2/6 = 5/6.'
  },
  {
    q: '2. ¿Por qué al multiplicar el numerador y el denominador de 2/3 por 4 (obteniendo 8/12) la fracción no cambia de valor?',
    model: 'Porque multiplicar arriba y abajo por 4 es lo mismo que multiplicar por 4/4, que vale 1 entero. Al hacer 4 veces más cortes, cada pedazo mide la cuarta parte, pero tomamos 4 veces más pedazos (8 de 12), representando exactamente la misma cantidad.'
  },
  {
    q: '3. ¿Cuándo conviene más usar el Mínimo Común Múltiplo (MCM) en lugar de multiplicar los denominadores directamente?',
    model: 'Cuando los denominadores tienen un divisor común (por ejemplo 6 y 8, o 4 y 12) o cuando sumamos 3 fracciones. Con el MCM trabajamos con números más pequeños (MCM de 6 y 8 es 24, en lugar de 6×8=48) y simplificamos mucho más rápido.'
  }
];

function initExplica() {
  const box = document.getElementById('expBox');
  if (!box) return;
  box.innerHTML = EXP_QUESTIONS.map((item, i) => `
    <div class="explain-card">
      <p style="font-weight:800;font-size:0.9rem;margin-bottom:0.5rem;">${item.q}</p>
      <textarea class="explain-area" id="expTxt_${i}" placeholder="Escribe aquí tu explicación con tus propias palabras..."></textarea>
      <div style="margin-top:0.5rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
        <button class="btn btn-teal" style="padding:0.4rem 0.9rem;font-size:0.8rem;" onclick="showExpModel(${i})">💡 Comparar con Respuesta Modelo (+20 XP)</button>
      </div>
      <div class="explain-model" id="expMod_${i}">
        <strong style="color:var(--teal);">🌟 Respuesta Modelo:</strong> ${item.model}
      </div>
    </div>
  `).join('');
  if (window.Fr && Fr.barrer) Fr.barrer(box);
}

function showExpModel(i) {
  const txt = document.getElementById('expTxt_' + i);
  const mod = document.getElementById('expMod_' + i);
  if (!mod) return;
  if (txt && txt.value.trim().length < 8) {
    alert('Escribe primero una breve idea con tus propias palabras antes de ver la respuesta modelo.');
    return;
  }
  mod.style.display = 'block';
  if (!S.expDone.has(i)) {
    S.expDone.add(i);
    addXP(20);
    sfx('ok');
  }
}

/* ═══════════════ 13. RETO CRONOMETRADO (s-reto) ═══════════════ */
let retoTimer = null;
let retoTimeLeft = 90;
let retoScore = 0;
let retoStreak = 0;
let retoCurQ = null;

const RETO_POOL = [
  { q: '1/2 + 1/4 =', ans: '3/4', opts: ['3/4', '2/6', '1/4', '3/6'] },
  { q: '1/2 + 1/3 =', ans: '5/6', opts: ['5/6', '2/5', '3/6', '1/6'] },
  { q: '3/4 − 1/2 =', ans: '1/4', opts: ['1/4', '2/2', '2/4', '1/2'] },
  { q: 'MCM(4, 6) =', ans: '12', opts: ['12', '24', '10', '2'] },
  { q: '2/3 + 1/6 =', ans: '5/6', opts: ['5/6', '3/9', '3/6', '4/6'] },
  { q: '5/6 − 1/3 =', ans: '1/2', opts: ['1/2', '4/3', '4/6', '2/3'] },
  { q: 'MCM(3, 5) =', ans: '15', opts: ['15', '8', '30', '5'] },
  { q: '1/3 + 1/4 =', ans: '7/12', opts: ['7/12', '2/7', '5/12', '1/12'] },
  { q: '7/8 − 1/4 =', ans: '5/8', opts: ['5/8', '6/4', '3/8', '6/8'] },
  { q: '1 − 2/5 =', ans: '3/5', opts: ['3/5', '1/5', '2/5', '4/5'] },
  { q: '3/10 + 1/5 =', ans: '1/2', opts: ['1/2', '4/15', '4/10', '2/5'] },
  { q: 'MCM(6, 9) =', ans: '18', opts: ['18', '54', '15', '3'] },
  { q: '5/8 − 1/2 =', ans: '1/8', opts: ['1/8', '4/6', '3/8', '1/4'] },
  { q: '1/2 + 1/3 + 1/6 =', ans: '1', opts: ['1', '3/11', '5/6', '7/6'] }
];

function startReto() {
  if (retoTimer) clearInterval(retoTimer);
  retoTimeLeft = 90;
  retoScore = 0;
  retoStreak = 0;
  document.getElementById('chStartArea').style.display = 'none';
  const area = document.getElementById('chGameArea');
  area.style.display = 'block';
  updateRetoHUD();
  nextRetoQ();
  retoTimer = setInterval(() => {
    retoTimeLeft--;
    updateRetoHUD();
    if (retoTimeLeft <= 0) endReto();
  }, 1000);
}

function updateRetoHUD() {
  document.getElementById('chTime').textContent = retoTimeLeft;
  document.getElementById('chScore').textContent = retoScore;
  document.getElementById('chStreak').textContent = retoStreak;
}

function nextRetoQ() {
  retoCurQ = RETO_POOL[Math.floor(Math.random() * RETO_POOL.length)];
  const shuffled = [...retoCurQ.opts].sort(() => Math.random() - 0.5);
  const area = document.getElementById('chGameArea');
  area.innerHTML = `
    <div class="concept-box" style="border:2px solid var(--gold);">
      <div style="font-size:1.5rem;font-weight:900;color:var(--gold);margin-bottom:0.8rem;">${retoCurQ.q}</div>
      <div class="g2">
        ${shuffled.map(o => `<button class="btn btn-ghost" style="justify-content:center;font-size:1rem;" onclick="ansReto('${o}')">${o}</button>`).join('')}
      </div>
    </div>
  `;
  if (window.Fr && Fr.barrer) Fr.barrer(area);
}

function ansReto(choice) {
  if (choice === retoCurQ.ans) {
    retoStreak++;
    const pts = 10 + Math.min(20, retoStreak * 2);
    retoScore += pts;
    sfx('ok');
    if (retoScore >= 60) unlockAch('reto_hero');
  } else {
    retoStreak = 0;
    sfx('bad');
  }
  updateRetoHUD();
  nextRetoQ();
}

function endReto() {
  clearInterval(retoTimer);
  retoTimer = null;
  addXP(Math.min(50, Math.round(retoScore / 3)));
  const area = document.getElementById('chGameArea');
  area.innerHTML = `
    <div class="concept-box" style="border:2px solid var(--green);">
      <div style="font-size:2.4rem;">🏁🏆</div>
      <h3 style="color:var(--green);margin:0.4rem 0;">¡Tiempo Terminado! Puntaje: ${retoScore} pts</h3>
      <p style="font-size:0.86rem;color:var(--muted);margin-bottom:0.8rem;">Has ganado XP adicional por tu agilidad mental.</p>
      <button class="btn btn-gold" onclick="startReto()">🔄 Jugar de Nuevo</button>
    </div>
  `;
}

/* ═══════════════ 14. SOPA DE LETRAS (s-sopa) ═══════════════ */
const SOPA_WORDS = ['MCM', 'NUMERADOR', 'EQUIVALENTE', 'SIMPLIFICAR', 'MARIPOSA', 'MULTIPLO', 'FRACCION', 'RESTA'];
const SOPA_SIZE = 12;
let sopaMatrix = [];
let sopaPlacements = {};

function initSopa() {
  S.sopaFound = new Set();
  S.sopaSel = null;
  sopaMatrix = Array.from({ length: SOPA_SIZE }, () => Array(SOPA_SIZE).fill(''));
  sopaPlacements = {};

  const fixed = [
    { w: 'EQUIVALENTE', r: 0, c: 0, dr: 0, dc: 1 },
    { w: 'SIMPLIFICAR', r: 2, c: 1, dr: 0, dc: 1 },
    { w: 'NUMERADOR',   r: 4, c: 0, dr: 0, dc: 1 },
    { w: 'MULTIPLO',    r: 6, c: 2, dr: 0, dc: 1 },
    { w: 'MARIPOSA',    r: 8, c: 1, dr: 0, dc: 1 },
    { w: 'FRACCION',    r: 10, c: 3, dr: 0, dc: 1 },
    { w: 'RESTA',       r: 3, c: 11, dr: 1, dc: 0 },
    { w: 'MCM',         r: 9, c: 0, dr: 1, dc: 0 }
  ];

  fixed.forEach(item => {
    const cells = [];
    for (let i = 0; i < item.w.length; i++) {
      const rr = item.r + item.dr * i;
      const cc = item.c + item.dc * i;
      sopaMatrix[rr][cc] = item.w[i];
      cells.push(`${rr},${cc}`);
    }
    sopaPlacements[item.w] = cells;
  });

  const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  for (let r = 0; r < SOPA_SIZE; r++) {
    for (let c = 0; c < SOPA_SIZE; c++) {
      if (!sopaMatrix[r][c]) sopaMatrix[r][c] = letters[Math.floor(Math.random() * letters.length)];
    }
  }
  renderSopa();
}

function renderSopa() {
  const wBox = document.getElementById('sopaWords');
  if (wBox) {
    wBox.innerHTML = SOPA_WORDS.map(w => `<span class="sopa-w ${S.sopaFound.has(w) ? 'done' : ''}">${w}</span>`).join('');
  }
  const gBox = document.getElementById('sopaGrid');
  if (!gBox) return;
  gBox.style.gridTemplateColumns = `repeat(${SOPA_SIZE}, 30px)`;

  const foundCells = new Set();
  S.sopaFound.forEach(w => (sopaPlacements[w] || []).forEach(k => foundCells.add(k)));

  let html = '';
  for (let r = 0; r < SOPA_SIZE; r++) {
    for (let c = 0; c < SOPA_SIZE; c++) {
      const key = `${r},${c}`;
      const isF = foundCells.has(key);
      const isS = S.sopaSel && S.sopaSel.r === r && S.sopaSel.c === c;
      html += `<div class="sopa-c ${isF ? 'found' : ''} ${isS ? 'sel' : ''}" onclick="clickSopa(${r},${c})">${sopaMatrix[r][c]}</div>`;
    }
  }
  gBox.innerHTML = html;
}

function clickSopa(r, c) {
  if (!S.sopaSel) {
    S.sopaSel = { r, c };
    sfx('tap');
    renderSopa();
    return;
  }
  const r1 = S.sopaSel.r, c1 = S.sopaSel.c;
  S.sopaSel = null;
  for (const w of SOPA_WORDS) {
    if (S.sopaFound.has(w)) continue;
    const cells = sopaPlacements[w];
    const first = cells[0];
    const last = cells[cells.length - 1];
    if ((first === `${r1},${c1}` && last === `${r},${c}`) || (last === `${r1},${c1}` && first === `${r},${c}`)) {
      S.sopaFound.add(w);
      addXP(12);
      sfx('ok');
      if (S.sopaFound.size === SOPA_WORDS.length) {
        unlockAch('sopa_done');
        const msg = document.getElementById('sopaMsg');
        if (msg) msg.textContent = '🎉 ¡Felicidades! Encontraste las 8 palabras clave.';
      }
      renderSopa();
      return;
    }
  }
  sfx('bad');
  renderSopa();
}

/* ═══════════════ 15. TAREAS (s-tareas) ═══════════════ */
const TASKS_DATA = [
  { t: 'Tarea 1 · La Baleada Compartida', d: 'En tu cuaderno, dibuja dos círculos iguales. En el primero colorea 1/2 y en el segundo 1/4. Luego divide ambos en cuartos y demuestra visualmente por qué 1/2 + 1/4 = 3/4.' },
  { t: 'Tarea 2 · La Cosecha de Café en Marcala', d: 'Un productor recolectó 2/5 de quintal por la mañana y 3/10 de quintal por la tarde. Resuelve en 3 pasos cuánto recolectó en total y simplifica el resultado (7/10).' },
  { t: 'Tarea 3 · El Listón de Madera en Cedros', d: 'Una tabla mide 5/6 de metro y el carpintero corta 1/4 de metro. Halla el MCM(6,4), convierte ambas a doceavos y calcula cuántos metros quedan (7/12 m).' },
  { t: 'Tarea 4 · Comparando MCM vs. Mariposa', d: 'Resuelve la operación 3/4 + 1/6 primero usando el MCM(4,6)=12 y luego usando el Método Mariposa (denominador 24 y simplificando). Escribe cuál método te pareció más corto.' },
  { t: 'Tarea 5 · Suma de Tres Fracciones', d: 'En una jarra se mezclan 1/2 litro de agua, 1/3 litro de jugo de naranja y 1/6 litro de jugo de piña. Halla el MCM(2,3,6) y demuestra que juntos llenan exactamente 1 litro.' },
  { t: 'Tarea 6 · Crea tu Propio Problema Familiar', d: 'Inventa un problema real de cocina o compras en tu casa que use una suma o resta de fracciones heterogéneas, resuélvelo en 3 pasos y explícalo a un familiar.' }
];

function initTareas() {
  const box = document.getElementById('taskList');
  if (!box) return;
  box.innerHTML = TASKS_DATA.map((tk, i) => {
    const done = S.tasksDone.has(i);
    return `<div class="task-card ${done ? 'done' : ''}" onclick="toggleTask(${i})">
      <div class="task-chk">${done ? '✓' : ''}</div>
      <div>
        <div style="font-weight:800;font-size:0.9rem;color:var(--gold);margin-bottom:0.2rem;">${tk.t}</div>
        <div style="font-size:0.84rem;color:var(--muted);line-height:1.55;">${tk.d}</div>
      </div>
    </div>`;
  }).join('');
  if (window.Fr && Fr.barrer) Fr.barrer(box);
}

function toggleTask(i) {
  if (S.tasksDone.has(i)) {
    S.tasksDone.delete(i);
  } else {
    S.tasksDone.add(i);
    addXP(25);
    sfx('ok');
  }
  saveProgress();
  initTareas();
}

/* ═══════════════ 16. EVALUACIÓN SUMATIVA DUAL (CONCEPTUAL Y OPERATIVA · 100 PTS) ═══════════════ */
const EVAL_FORMAS = 30;
let evalCounter = Math.floor(Math.random() * EVAL_FORMAS);
let evalFormaActual = 1;
let evalOpCounter = Math.floor(Math.random() * EVAL_FORMAS);
let evalOpFormaActual = 1;
let evalData = null;
let evalOpData = null;
let evalShowAns = false;
let evalOpShowAns = false;

function crearPRNG(semilla) {
  let s = ((semilla * 2654435761) >>> 0) || 1;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function barajarCon(arr, rng) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function switchEvalMode(mode) {
  const cWrap = document.getElementById('evalConceptualWrap');
  const oWrap = document.getElementById('evalOperativaWrap');
  const cBtn = document.getElementById('evalModeCBtn');
  const oBtn = document.getElementById('evalModeOBtn');
  if (mode === 'operativa') {
    if (cWrap) cWrap.style.display = 'none';
    if (oWrap) oWrap.style.display = 'block';
    if (cBtn) cBtn.className = 'btn btn-ghost';
    if (oBtn) oBtn.className = 'btn btn-teal';
  } else {
    if (cWrap) cWrap.style.display = 'block';
    if (oWrap) oWrap.style.display = 'none';
    if (cBtn) cBtn.className = 'btn btn-gold';
    if (oBtn) oBtn.className = 'btn btn-ghost';
  }
}

/* ─── BANCOS DE LA PRUEBA CONCEPTUAL ─── */
const EV_COMP = [
  { pre: 'Dos o más fracciones que tienen diferente denominador se llaman fracciones', post: '.', ans: 'heterogéneas', alts: ['heterogeneas'] },
  { pre: 'Para sumar o restar fracciones con distinto denominador, el Paso 1 es hallar el', post: 'de los denominadores.', ans: 'MCM', alts: ['mcm', 'mínimo común múltiplo', 'minimo comun multiplo'] },
  { pre: 'Dos fracciones que se escriben distinto pero representan la misma cantidad (como 1/2 y 3/6) son fracciones', post: '.', ans: 'equivalentes', alts: ['equivalente'] },
  { pre: 'En el Paso 3, después de igualar los denominadores, sumamos o restamos únicamente los', post: '.', ans: 'numeradores', alts: ['numerador'] },
  { pre: 'Para simplificar una fracción a su forma irreducible dividimos numerador y denominador entre su', post: '.', ans: 'MCD', alts: ['mcd', 'máximo común divisor', 'maximo comun divisor'] },
  { pre: 'Cuando un denominador es múltiplo del otro (como 3 y 9), el MCM es directamente el denominador', post: '.', ans: 'mayor', alts: ['más grande', 'mas grande'] },
  { pre: 'El método que multiplica en cruz las dos alas y multiplica abajo los denominadores se conoce como método', post: '.', ans: 'mariposa', alts: ['de la mariposa', 'productos cruzados'] },
  { pre: 'Una fracción que ya no se puede simplificar más se denomina fracción', post: '.', ans: 'irreducible', alts: ['irreductible'] }
];

const EV_VF = [
  { s: 'Para sumar 1/2 + 1/3 basta con sumar arriba (1+1=2) y abajo (2+3=5), obteniendo 2/5.', v: false, just: 'Los denominadores nunca se suman entre sí; primero se halla el MCM(2,3)=6 para obtener 3/6 + 2/6 = 5/6.' },
  { s: 'El Mínimo Común Múltiplo (MCM) de los denominadores 4 y 6 es 12.', v: true, just: '' },
  { s: 'Si multiplicamos el denominador de 2/3 por 4 para llegar a 12, también debemos multiplicar su numerador por 4 (obteniendo 8/12).', v: true, just: '' },
  { s: 'En la resta 5/6 − 1/3, el resultado simplificado a su forma irreducible es 4/3.', v: false, just: 'Como 1/3 = 2/6, entonces 5/6 − 2/6 = 3/6, que simplificado entre 3 es 1/2.' },
  { s: 'Cuando dos denominadores son primos entre sí (como 3 y 5), su MCM es igual a su producto (3 × 5 = 15).', v: true, just: '' },
  { s: 'La fracción 4/6 es irreducible porque 4 y 6 no tienen divisores comunes.', v: false, just: '4 y 6 son pares (MCD = 2), por lo que 4/6 se simplifica a 2/3.' },
  { s: 'La suma de 1/2 + 1/3 + 1/6 es exactamente igual a 1 entero (6/6).', v: true, just: '' },
  { s: 'Para restar 1 − 3/8 convertimos el 1 en 8/8 y obtenemos 5/8.', v: true, just: '' }
];

const EV_MC = [
  { q: '¿Cuál es el resultado de sumar 2/3 + 1/4?', opts: ['11/12', '3/7', '8/12', '9/12'], ans: '11/12' },
  { q: '¿Cuál es el Mínimo Común Múltiplo (MCM) de los denominadores 6 y 8?', opts: ['24', '48', '14', '2'], ans: '24' },
  { q: '¿Cuál es el resultado simplificado de 1/6 + 1/2?', opts: ['2/3', '4/6', '2/8', '1/3'], ans: '2/3' },
  { q: 'Al resolver 7/8 − 1/4 se obtiene:', opts: ['5/8', '6/4', '3/8', '6/8'], ans: '5/8' },
  { q: 'Si amplificamos 3/5 para que tenga denominador 20, la fracción equivalente es:', opts: ['12/20', '3/20', '15/20', '7/20'], ans: '12/20' },
  { q: '¿Cuánto es 5/6 − 1/4?', opts: ['7/12', '4/2', '6/12', '13/12'], ans: '7/12' },
  { q: '¿Cuál es el resultado irreducible de 4/5 − 3/10?', opts: ['1/2', '5/10', '1/5', '7/10'], ans: '1/2' },
  { q: 'En una receta se mezclan 1/3 de taza de azúcar morena y 1/6 de taza de azúcar blanca. ¿Cuánto es en total simplificado?', opts: ['1/2 de taza', '2/9 de taza', '2/6 de taza', '1/3 de taza'], ans: '1/2 de taza' }
];

const EV_PAIR = [
  { term: 'Fracciones heterogéneas', def: 'Fracciones que tienen diferente denominador y representan partes de distinto tamaño' },
  { term: 'Mínimo Común Múltiplo (MCM)', def: 'El menor número positivo que es múltiplo común de todos los denominadores' },
  { term: 'Fracciones equivalentes', def: 'Fracciones con distinta escritura pero igual valor numérico (como 2/3 y 8/12)' },
  { term: 'Simplificar una fracción', def: 'Dividir numerador y denominador entre su MCD hasta que sea irreducible' },
  { term: 'Método Mariposa', def: 'Procedimiento de productos cruzados (a·d ± b·c)/(b·d) para dos fracciones' },
  { term: 'Denominador múltiplo', def: 'Caso donde el denominador mayor contiene exactamente al menor y actúa como MCM' },
  { term: 'Numerador', def: 'Número superior que indica cuántas partes del denominador común se suman o restan' }
];

function genEval() {
  evalShowAns = false;
  const ansBtn = document.getElementById('evAnsBtn');
  if (ansBtn) ansBtn.textContent = '👁️ Mostrar Respuestas';
  const sb = document.getElementById('evScoreBox');
  if (sb) sb.style.display = 'none';

  evalFormaActual = (evalCounter % EVAL_FORMAS) + 1;
  evalCounter++;
  const rng = crearPRNG(evalFormaActual);

  const comp = barajarCon(EV_COMP, rng).slice(0, 5);
  const vf = barajarCon(EV_VF, rng).slice(0, 5);
  const mc = barajarCon(EV_MC, rng).slice(0, 5).map(item => ({ ...item, shuffledOpts: barajarCon(item.opts, rng) }));
  const pairPool = barajarCon(EV_PAIR, rng);
  const pairUsed = pairPool.slice(0, 5);
  const pairDistractor = pairPool[5];
  const pairRight = barajarCon([...pairUsed.map(p => p.def), pairDistractor.def], rng);

  evalData = { comp, vf, mc, pairUsed, pairRight };
  renderEval();
}

function renderEval() {
  const { comp, vf, mc, pairUsed, pairRight } = evalData;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  let html = '';

  html += `<div style="margin-bottom:1.4rem;">
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.7rem;padding-bottom:0.4rem;border-bottom:2px solid var(--gold);">
      <span style="background:var(--gold);color:var(--texto-inverso);font-weight:900;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.78rem;">I</span>
      <strong style="font-size:0.95rem;color:var(--gold);">TIPO COMPLETACIÓN</strong>
      <span style="margin-left:auto;font-size:0.75rem;color:var(--texto-secundario);">5 × 5 pts = 25%</span>
    </div>`;
  comp.forEach((c, i) => {
    html += `<div class="ev-item-card" id="evComp_${i}">
      <div style="font-size:0.88rem;line-height:1.6;"><strong>${i + 1}.</strong> ${c.pre}
        <input id="evCompIn_${i}" class="ev-inline-in" placeholder="Escribe aquí..." style="width:170px;margin:0 4px;">
        ${c.post}</div>
      <div class="ev-ans" id="evCompAns_${i}" style="display:none;margin-top:0.3rem;font-size:0.78rem;color:var(--green);font-weight:700;">✅ Respuesta: ${c.ans}</div>
    </div>`;
  });
  html += `</div>`;

  html += `<div style="margin-bottom:1.4rem;">
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.7rem;padding-bottom:0.4rem;border-bottom:2px solid var(--teal);">
      <span style="background:var(--teal);color:var(--texto-inverso);font-weight:900;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.78rem;">II</span>
      <strong style="font-size:0.95rem;color:var(--teal);">TIPO VERDADERO O FALSO</strong>
      <span style="margin-left:auto;font-size:0.75rem;color:var(--texto-secundario);">5 × 5 pts = 25%</span>
    </div>`;
  vf.forEach((item, i) => {
    html += `<div class="ev-item-card" id="evVF_${i}">
      <div style="display:flex;align-items:flex-start;gap:0.5rem;flex-wrap:wrap;">
        <span style="font-size:0.88rem;flex:1;min-width:200px;line-height:1.5;"><strong>${i + 1}.</strong> ${item.s}</span>
        <div style="display:flex;gap:0.3rem;">
          <button class="btn btn-ghost" id="evVFB_${i}_V" onclick="selVF(${i},true)" style="padding:0.25rem 0.7rem;font-size:0.8rem;min-width:40px;">V</button>
          <button class="btn btn-ghost" id="evVFB_${i}_F" onclick="selVF(${i},false)" style="padding:0.25rem 0.7rem;font-size:0.8rem;min-width:40px;">F</button>
        </div>
      </div>
      <div class="ev-ans" id="evVFAns_${i}" style="display:none;margin-top:0.3rem;font-size:0.78rem;color:var(--green);font-weight:700;">✅ Respuesta: <strong>${item.v ? 'V (Verdadero)' : 'F (Falso)'}</strong>${!item.v ? ' — ' + item.just : ''}</div>
    </div>`;
  });
  html += `</div>`;

  html += `<div style="margin-bottom:1.4rem;">
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.7rem;padding-bottom:0.4rem;border-bottom:2px solid var(--coral);">
      <span style="background:var(--coral);color:var(--texto-inverso);font-weight:900;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.78rem;">III</span>
      <strong style="font-size:0.95rem;color:var(--coral);">TIPO SELECCIÓN ÚNICA</strong>
      <span style="margin-left:auto;font-size:0.75rem;color:var(--texto-secundario);">5 × 5 pts = 25%</span>
    </div>`;
  mc.forEach((item, i) => {
    const optLetters = ['a', 'b', 'c', 'd'];
    html += `<div class="ev-item-card" id="evMC_${i}">
      <div style="font-size:0.88rem;font-weight:700;margin-bottom:0.4rem;">${i + 1}. ${item.q}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.35rem;">
        ${item.shuffledOpts.map((o, oi) => `<label class="ev-opt-label" id="evMCL_${i}_${oi}">
          <input type="radio" name="evMC_${i}" value="${o}" style="accent-color:var(--gold);"> <strong>${optLetters[oi]})</strong> ${o}
        </label>`).join('')}
      </div>
      <div class="ev-ans" id="evMCAns_${i}" style="display:none;margin-top:0.3rem;font-size:0.78rem;color:var(--green);font-weight:700;">✅ Respuesta: ${item.ans}</div>
    </div>`;
  });
  html += `</div>`;

  html += `<div style="margin-bottom:1rem;">
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.7rem;padding-bottom:0.4rem;border-bottom:2px solid var(--purple);">
      <span style="background:var(--purple);color:var(--texto-inverso);font-weight:900;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.78rem;">IV</span>
      <strong style="font-size:0.95rem;color:var(--purple);">TIPO TÉRMINOS PAREADOS</strong>
      <span style="margin-left:auto;font-size:0.75rem;color:var(--texto-secundario);">5 × 5 pts = 25%</span>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.8rem;">
      <div>
        <div style="font-size:0.75rem;font-weight:800;color:var(--purple);text-transform:uppercase;margin-bottom:0.4rem;">Columna A (Conceptos)</div>
        ${pairUsed.map((p, i) => `<div class="ev-item-card" style="display:flex;align-items:center;gap:0.4rem;" id="evPair_${i}">
          <select id="evPairSel_${i}" style="width:52px;padding:0.25rem;border-radius:6px;border:1.5px solid var(--purple);background:var(--bg-tarjeta);color:var(--gold);font-family:inherit;font-weight:800;font-size:0.82rem;text-align:center;">
            <option value="">—</option>
            ${letters.map(l => `<option value="${l}">${l}</option>`).join('')}
          </select>
          <span style="font-size:0.84rem;font-weight:700;">${i + 1}. ${p.term}</span>
        </div>
        <div class="ev-ans" id="evPairAns_${i}" style="display:none;font-size:0.74rem;color:var(--green);font-weight:700;margin:-0.2rem 0 0.3rem 0.5rem;">✅ ${letters[pairRight.indexOf(p.def)]}) ${p.def}</div>`).join('')}
      </div>
      <div>
        <div style="font-size:0.75rem;font-weight:800;color:var(--teal);text-transform:uppercase;margin-bottom:0.4rem;">Columna B (Definiciones)</div>
        ${pairRight.map((d, i) => `<div class="ev-item-card" style="font-size:0.82rem;line-height:1.45;">
          <strong style="color:var(--teal);">${letters[i]})</strong> ${d}
        </div>`).join('')}
      </div>
    </div>
  </div>`;

  const cont = document.getElementById('evContent');
  if (cont) {
    cont.innerHTML = html;
    if (window.Fr && Fr.barrer) Fr.barrer(cont);
  }
}

const evVFSel = {};
function selVF(i, val) {
  evVFSel[i] = val;
  const bV = document.getElementById(`evVFB_${i}_V`);
  const bF = document.getElementById(`evVFB_${i}_F`);
  if (bV) { bV.style.background = val === true ? 'rgba(20,184,166,0.2)' : ''; bV.style.borderColor = val === true ? 'var(--teal)' : ''; bV.style.color = val === true ? 'var(--teal)' : ''; }
  if (bF) { bF.style.background = val === false ? 'rgba(244,63,94,0.2)' : ''; bF.style.borderColor = val === false ? 'var(--coral)' : ''; bF.style.color = val === false ? 'var(--coral)' : ''; }
  sfx('tap');
}

function normEval(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9/]/g, '').trim();
}

function gradeEval() {
  const { comp, vf, mc, pairUsed, pairRight } = evalData;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  let total = 0;
  let c1 = 0, c2 = 0, c3 = 0, c4 = 0;

  comp.forEach((c, i) => {
    const inp = document.getElementById('evCompIn_' + i);
    const box = document.getElementById('evComp_' + i);
    const v = normEval(inp ? inp.value : '');
    const allAns = [c.ans, ...(c.alts || [])].map(normEval);
    const ok = v.length >= 2 && allAns.some(a => v === a || a.includes(v));
    if (ok) { c1 += 5; total += 5; if (box) box.style.borderColor = 'var(--green)'; }
    else { if (box) box.style.borderColor = 'var(--coral)'; }
    const ansEl = document.getElementById('evCompAns_' + i);
    if (ansEl) ansEl.style.display = 'block';
  });

  vf.forEach((item, i) => {
    const box = document.getElementById('evVF_' + i);
    const userVal = evVFSel[i];
    const ok = userVal === item.v;
    if (ok) { c2 += 5; total += 5; if (box) box.style.borderColor = 'var(--green)'; }
    else { if (box) box.style.borderColor = 'var(--coral)'; }
    const ansEl = document.getElementById('evVFAns_' + i);
    if (ansEl) ansEl.style.display = 'block';
  });

  mc.forEach((item, i) => {
    const box = document.getElementById('evMC_' + i);
    const sel = document.querySelector(`input[name="evMC_${i}"]:checked`);
    const ok = sel && sel.value === item.ans;
    if (ok) { c3 += 5; total += 5; if (box) box.style.borderColor = 'var(--green)'; }
    else { if (box) box.style.borderColor = 'var(--coral)'; }
    const ansEl = document.getElementById('evMCAns_' + i);
    if (ansEl) ansEl.style.display = 'block';
  });

  pairUsed.forEach((p, i) => {
    const box = document.getElementById('evPair_' + i);
    const sel = document.getElementById('evPairSel_' + i);
    const correctLetter = letters[pairRight.indexOf(p.def)];
    const ok = sel && sel.value === correctLetter;
    if (ok) { c4 += 5; total += 5; if (box) box.style.borderColor = 'var(--green)'; }
    else { if (box) box.style.borderColor = 'var(--coral)'; }
    const ansEl = document.getElementById('evPairAns_' + i);
    if (ansEl) ansEl.style.display = 'block';
  });

  evalShowAns = true;
  document.getElementById('evAnsBtn').textContent = '🙈 Ocultar Respuestas';

  const sb = document.getElementById('evScoreBox');
  let grade = '', col = '';
  if (total >= 90) { grade = '🏆 ¡EXCELENTE! Dominio sobresaliente'; col = 'var(--green)'; }
  else if (total >= 70) { grade = '👏 ¡MUY BIEN! Buen dominio del tema'; col = 'var(--teal)'; }
  else if (total >= 50) { grade = '📖 ACEPTABLE — Repasa las secciones con errores'; col = 'var(--gold)'; }
  else { grade = '🔄 NECESITA REFORZAR — Vuelve al Laboratorio 3 Pasos'; col = 'var(--coral)'; }

  sb.style.display = 'block';
  sb.style.background = 'var(--card2)';
  sb.style.border = `2px solid ${col}`;
  sb.innerHTML = `
    <div style="font-size:2.2rem;font-weight:900;color:${col};" data-sinfr="1">${total} / 100 puntos</div>
    <div style="font-size:0.95rem;font-weight:700;color:${col};margin:0.3rem 0;">${grade}</div>
    <div style="display:flex;gap:0.8rem;justify-content:center;flex-wrap:wrap;margin-top:0.6rem;font-size:0.78rem;color:var(--muted);" data-sinfr="1">
      <span>I. Completación: <strong>${c1}/25</strong></span>
      <span>II. V o F: <strong>${c2}/25</strong></span>
      <span>III. Selección: <strong>${c3}/25</strong></span>
      <span>IV. Pareados: <strong>${c4}/25</strong></span>
    </div>`;

  if (total >= 70) {
    unlockAch('eval_grad');
    addXP(30);
    sfx('win');
    dispararRegistroMetas();
  } else {
    sfx('bad');
  }
  sb.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function toggleEvalAns() {
  evalShowAns = !evalShowAns;
  document.querySelectorAll('#evContent .ev-ans').forEach(el => { el.style.display = evalShowAns ? 'block' : 'none'; });
  document.getElementById('evAnsBtn').textContent = evalShowAns ? '🙈 Ocultar Respuestas' : '👁️ Mostrar Respuestas';
}

function printEval() {
  const { comp, vf, mc, pairUsed, pairRight } = evalData;
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const optL = ['a', 'b', 'c', 'd'];
  const formaNum = String(evalFormaActual).padStart(2, '0');
  const pw = window.open('', '_blank');
  if (!pw) { window.print(); return; }
  pw.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Evaluación Conceptual · Fracciones Heterogéneas · Forma ${formaNum}</title>
  <style>
    @page{size:letter;margin:14mm 15mm;}
    body{font-family: Georgia, serif;color:#111;font-size:10pt;line-height:1.4;}
    h1{font-size:13pt;margin:0;text-transform:uppercase;}
    .sec-h{background:#111;color:#fff;padding:3px 8px;font-weight:bold;font-size:9.5pt;margin:10px 0 6px;}
    .q-item{margin-bottom:6px;}
    .pauta{page-break-before:always;border-top:2px dashed #000;padding-top:10px;}
  </style></head><body>
    <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:8px;">
      <h1>EVALUACIÓN DE MATEMÁTICA — SUMA Y RESTA DE FRACCIONES HETEROGÉNEAS</h1>
      <div style="font-size:9pt;">Proyecto Educativo M.E.T.A.S · Forma ${formaNum} · Valor: 100 Puntos</div>
    </div>
    <div style="margin-bottom:8px;font-size:9.5pt;">Nombre: _______________________________________ Grado: __________ Fecha: ____________</div>
    <div class="sec-h">I. COMPLETACIÓN (25 pts · 5 pts c/u)</div>
    ${comp.map((c, i) => `<div class="q-item">${i + 1}. ${c.pre} ________________________ ${c.post}</div>`).join('')}
    <div class="sec-h">II. VERDADERO O FALSO (25 pts · 5 pts c/u)</div>
    ${vf.map((v, i) => `<div class="q-item">( &nbsp; ) ${i + 1}. ${v.s}</div>`).join('')}
    <div class="sec-h">III. SELECCIÓN ÚNICA (25 pts · 5 pts c/u)</div>
    ${mc.map((m, i) => `<div class="q-item"><strong>${i + 1}. ${m.q}</strong><br>${m.shuffledOpts.map((o, oi) => `${optL[oi]}) ${o}`).join(' &nbsp;&nbsp;&nbsp; ')}</div>`).join('')}
    <div class="sec-h">IV. TÉRMINOS PAREADOS (25 pts · 5 pts c/u)</div>
    <table style="width:100%;border-collapse:collapse;font-size:9.5pt;">
      <tr><th style="text-align:left;width:45%;">Columna A</th><th style="text-align:left;">Columna B</th></tr>
      ${pairRight.map((d, i) => `<tr><td style="padding:3px 0;">${pairUsed[i] ? `( &nbsp; ) ${i + 1}. ${pairUsed[i].term}` : ''}</td><td style="padding:3px 0;"><strong>${letters[i]})</strong> ${d}</td></tr>`).join('')}
    </table>
    <div class="pauta">
      <h1>PAUTA DEL DOCENTE — FORMA ${formaNum}</h1>
      <p><strong>I. Completación:</strong> ${comp.map((c, i) => `${i + 1}) ${c.ans}`).join(' · ')}</p>
      <p><strong>II. Verdadero o Falso:</strong> ${vf.map((v, i) => `${i + 1}) ${v.v ? 'V' : 'F'}`).join(' · ')}</p>
      <p><strong>III. Selección Única:</strong> ${mc.map((m, i) => `${i + 1}) ${m.ans}`).join(' · ')}</p>
      <p><strong>IV. Términos Pareados:</strong> ${pairUsed.map((p, i) => `${i + 1}) ${letters[pairRight.indexOf(p.def)]}`).join(' · ')}</p>
    </div>
  </body></html>`);
  pw.document.close();
  setTimeout(() => pw.print(), 350);
}

/* ─── BANCOS DE LA PRUEBA OPERATIVA (100 PTS) ─── */
const EVOP_CALC = [
  { expr: '1/2 + 1/3', ans: '5/6', proc: 'MCM(2,3)=6 → 3/6 + 2/6 = 5/6' },
  { expr: '2/3 + 1/4', ans: '11/12', proc: 'MCM(3,4)=12 → 8/12 + 3/12 = 11/12' },
  { expr: '3/4 − 1/2', ans: '1/4', proc: 'MCM(4,2)=4 → 3/4 − 2/4 = 1/4' },
  { expr: '5/6 − 1/4', ans: '7/12', proc: 'MCM(6,4)=12 → 10/12 − 3/12 = 7/12' },
  { expr: '1/6 + 1/3', ans: '1/2', proc: 'MCM(6,3)=6 → 1/6 + 2/6 = 3/6 = 1/2' },
  { expr: '7/8 − 1/4', ans: '5/8', proc: 'MCM(8,4)=8 → 7/8 − 2/8 = 5/8' },
  { expr: '4/5 − 3/10', ans: '1/2', proc: 'MCM(5,10)=10 → 8/10 − 3/10 = 5/10 = 1/2' },
  { expr: '3/4 + 1/6', ans: '11/12', proc: 'MCM(4,6)=12 → 9/12 + 2/12 = 11/12' }
];

const EVOP_MCM = [
  { q: 'MCM de los denominadores de 3/4 y 5/6:', ans: '12', exp: 'Múltiplos comunes de 4 y 6: el menor es 12.' },
  { q: 'Numerador equivalente al convertir 2/3 a doceavos (▢/12):', ans: '8', exp: '12 ÷ 3 = 4, y 2 × 4 = 8.' },
  { q: 'MCM de los denominadores de 2/5 y 1/3:', ans: '15', exp: '5 y 3 son coprimos: 5 × 3 = 15.' },
  { q: 'Numerador equivalente al convertir 3/4 a octavos (▢/8):', ans: '6', exp: '8 ÷ 4 = 2, y 3 × 2 = 6.' },
  { q: 'Fracción irreducible equivalente a 4/6:', ans: '2/3', exp: 'Dividimos entre MCD(4,6)=2: 4÷2=2 y 6÷2=3.' },
  { q: 'MCM de los denominadores de 5/6 y 1/9:', ans: '18', exp: 'El menor múltiplo común de 6 y 9 es 18.' }
];

const EVOP_INC = [
  { eq: '1/2 + ▢ = 3/4', ans: '1/4', hint: '3/4 − 2/4 = 1/4' },
  { eq: '2/3 + ▢ = 5/6', ans: '1/6', hint: '5/6 − 4/6 = 1/6' },
  { eq: '7/8 − ▢ = 3/8', ans: '1/2', alts: ['4/8'], hint: '7/8 − 3/8 = 4/8 = 1/2' },
  { eq: '1 − ▢ = 3/5', ans: '2/5', hint: '5/5 − 3/5 = 2/5' }
];

const EVOP_PROB = [
  { title: 'La Receta de Semitas', text: 'Doña Carmen usó 2/3 de taza de leche tibia y 1/4 de taza de mantequilla derretida. ¿Cuántas tazas de líquido usó en total?', ans: '11/12', unit: 'tazas', sol: 'MCM(3,4)=12 → 8/12 + 3/12 = 11/12 tazas.' },
  { title: 'El Listón del Taller', text: 'Un carpintero tiene una regla de madera de 5/6 de metro y le corta un trozo de 1/3 de metro. ¿Cuántos metros quedan simplificando al máximo?', ans: '1/2', unit: 'metros', sol: '5/6 − 2/6 = 3/6 = 1/2 metro.' },
  { title: 'Caminata en La Tigra', text: 'Un grupo caminó 3/8 de la ruta antes del descanso y 1/4 de la ruta después. ¿Qué fracción de la ruta recorrieron en total?', ans: '5/8', unit: 'de la ruta', sol: '3/8 + 2/8 = 5/8 de la ruta.' },
  { title: 'Pintura para el Mural', text: 'Se tenían 4/5 de galón de pintura azul y se gastaron 3/10 de galón. ¿Cuánto quedó simplificado?', ans: '1/2', unit: 'galón', sol: '8/10 − 3/10 = 5/10 = 1/2 galón.' },
  { title: 'Los Tres Jugos Naturales', text: 'En un pichel se mezclan 1/2 litro de agua, 1/3 litro de jugo de naranja y 1/6 litro de jugo de limón. ¿Cuántos litros hay en total?', ans: '1', alts: ['6/6', '1/1'], unit: 'litro', sol: '3/6 + 2/6 + 1/6 = 6/6 = 1 litro.' }
];

const EVOP_RETO = [
  { title: 'Detective de Fracciones', q: 'Luis escribió: «1/2 + 1/3 = 2/5». ¿Cuál es la diferencia exacta entre el resultado verdadero (5/6) y lo que escribió Luis (2/5)?', opts: ['13/30', '3/1', '1/30', '7/30'], ans: '13/30', exp: '5/6 − 2/5 = 25/30 − 12/30 = 13/30.' },
  { title: 'Suma Unitaria Egipcia', q: '¿Cuál de los siguientes pares de fracciones unitarias con distinto denominador suma exactamente 1/2?', opts: ['1/3 + 1/6', '1/4 + 1/4', '1/2 + 1/4', '1/3 + 1/4'], ans: '1/3 + 1/6', exp: '1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 1/2.' },
  { title: 'Comparando con el Entero', q: '¿Cuánto le falta a la suma (1/4 + 2/3) para completar 1 entero?', opts: ['1/12', '3/7', '11/12', '1/7'], ans: '1/12', exp: '1/4 + 2/3 = 3/12 + 8/12 = 11/12. Para 12/12 falta 1/12.' }
];

function genEvalOp() {
  evalOpShowAns = false;
  const btn = document.getElementById('evOpAnsBtn');
  if (btn) btn.textContent = '👁️ Mostrar Respuestas';
  const sb = document.getElementById('evOpScoreBox');
  if (sb) sb.style.display = 'none';

  evalOpFormaActual = (evalOpCounter % EVAL_FORMAS) + 1;
  evalOpCounter++;
  const rng = crearPRNG(evalOpFormaActual + 100);

  const calc = barajarCon(EVOP_CALC, rng).slice(0, 6);
  const mcm = barajarCon(EVOP_MCM, rng).slice(0, 4);
  const inc = barajarCon(EVOP_INC, rng).slice(0, 3);
  const prob = barajarCon(EVOP_PROB, rng).slice(0, 4);
  const reto = barajarCon(EVOP_RETO, rng).slice(0, 3).map(r => ({ ...r, shuffledOpts: barajarCon(r.opts, rng) }));

  evalOpData = { calc, mcm, inc, prob, reto };
  renderEvalOp();
}

function renderEvalOp() {
  const { calc, mcm, inc, prob, reto } = evalOpData;
  let html = '';

  html += `<div style="margin-bottom:1.3rem;">
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;padding-bottom:0.35rem;border-bottom:2px solid var(--gold);">
      <span style="background:var(--gold);color:var(--texto-inverso);font-weight:900;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.78rem;">I</span>
      <strong style="color:var(--gold);">SUMA Y RESTA HETEROGÉNEA PASO A PASO (Simplifica)</strong>
      <span style="margin-left:auto;font-size:0.75rem;color:var(--texto-secundario);">6 × 5 pts = 30%</span>
    </div>
    <div class="g2">
      ${calc.map((c, i) => `<div class="ev-item-card" id="evOpC_${i}">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:0.4rem;">
          <strong style="font-size:0.95rem;">${i + 1}) ${c.expr} =</strong>
          <input id="evOpCIn_${i}" class="ev-inline-in" placeholder="Ej: 5/6" style="width:95px;">
        </div>
        <div class="ev-op-ans" style="display:none;margin-top:0.35rem;font-size:0.76rem;color:var(--green);font-weight:700;">✅ ${c.ans} (${c.proc})</div>
      </div>`).join('')}
    </div>
  </div>`;

  html += `<div style="margin-bottom:1.3rem;">
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;padding-bottom:0.35rem;border-bottom:2px solid var(--teal);">
      <span style="background:var(--teal);color:var(--texto-inverso);font-weight:900;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.78rem;">II</span>
      <strong style="color:var(--teal);">RADAR DEL MCM Y FRACCIONES EQUIVALENTES</strong>
      <span style="margin-left:auto;font-size:0.75rem;color:var(--texto-secundario);">4 × 5 pts = 20%</span>
    </div>
    ${mcm.map((m, i) => `<div class="ev-item-card" id="evOpM_${i}">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:0.4rem;flex-wrap:wrap;">
        <span style="font-size:0.88rem;"><strong>${i + 1}.</strong> ${m.q}</span>
        <input id="evOpMIn_${i}" class="ev-inline-in" placeholder="Resp." style="width:95px;color:var(--teal);">
      </div>
      <div class="ev-op-ans" style="display:none;margin-top:0.3rem;font-size:0.76rem;color:var(--green);font-weight:700;">✅ ${m.ans} — ${m.exp}</div>
    </div>`).join('')}
  </div>`;

  html += `<div style="margin-bottom:1.3rem;">
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;padding-bottom:0.35rem;border-bottom:2px solid var(--purple);">
      <span style="background:var(--purple);color:var(--texto-inverso);font-weight:900;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.78rem;">III</span>
      <strong style="color:var(--purple);">¿QUÉ FRACCIÓN SE ESCONDE EN ▢?</strong>
      <span style="margin-left:auto;font-size:0.75rem;color:var(--texto-secundario);">3 × 5 pts = 15%</span>
    </div>
    <div class="g3">
      ${inc.map((it, i) => `<div class="ev-item-card" style="text-align:center;" id="evOpI_${i}">
        <div style="font-weight:900;font-size:0.95rem;margin-bottom:0.4rem;">${i + 1}) ${it.eq}</div>
        <input id="evOpIIn_${i}" class="ev-inline-in" placeholder="▢ = ?" style="width:95px;color:var(--purple);">
        <div class="ev-op-ans" style="display:none;margin-top:0.3rem;font-size:0.75rem;color:var(--green);font-weight:700;">✅ ${it.ans} (${it.hint})</div>
      </div>`).join('')}
    </div>
  </div>`;

  html += `<div style="margin-bottom:1.3rem;">
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;padding-bottom:0.35rem;border-bottom:2px solid var(--coral);">
      <span style="background:var(--coral);color:var(--texto-inverso);font-weight:900;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.78rem;">IV</span>
      <strong style="color:var(--coral);">PROBLEMAS DE LA VIDA REAL</strong>
      <span style="margin-left:auto;font-size:0.75rem;color:var(--texto-secundario);">4 × 5 pts = 20%</span>
    </div>
    ${prob.map((p, i) => `<div class="ev-item-card" id="evOpP_${i}">
      <div style="font-size:0.86rem;line-height:1.55;margin-bottom:0.4rem;"><strong style="color:var(--gold);">${i + 1}. ${p.title}:</strong> ${p.text}</div>
      <div style="display:flex;align-items:center;gap:0.4rem;">
        <span style="font-size:0.8rem;color:var(--texto-secundario);">Respuesta:</span>
        <input id="evOpPIn_${i}" class="ev-inline-in" placeholder="Ej: 11/12" style="width:105px;">
        <span style="font-size:0.8rem;color:var(--texto-secundario);">${p.unit}</span>
      </div>
      <div class="ev-op-ans" style="display:none;margin-top:0.3rem;font-size:0.76rem;color:var(--green);font-weight:700;">✅ ${p.ans} ${p.unit} — ${p.sol}</div>
    </div>`).join('')}
  </div>`;

  html += `<div>
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.6rem;padding-bottom:0.35rem;border-bottom:2px solid var(--green);">
      <span style="background:var(--green);color:var(--texto-inverso);font-weight:900;padding:0.2rem 0.6rem;border-radius:6px;font-size:0.78rem;">V</span>
      <strong style="color:var(--green);">RETOS DE PENSAMIENTO CRÍTICO</strong>
      <span style="margin-left:auto;font-size:0.75rem;color:var(--texto-secundario);">3 × 5 pts = 15%</span>
    </div>
    ${reto.map((r, i) => `<div class="ev-item-card" id="evOpR_${i}">
      <div style="font-size:0.86rem;font-weight:700;margin-bottom:0.4rem;">${i + 1}. ${r.title}: ${r.q}</div>
      <div class="g2">
        ${r.shuffledOpts.map(o => `<label class="ev-opt-label">
          <input type="radio" name="evOpR_${i}" value="${o}"> ${o}
        </label>`).join('')}
      </div>
      <div class="ev-op-ans" style="display:none;margin-top:0.3rem;font-size:0.76rem;color:var(--green);font-weight:700;">✅ ${r.ans} — ${r.exp}</div>
    </div>`).join('')}
  </div>`;

  const cont = document.getElementById('evOpContent');
  if (cont) {
    cont.innerHTML = html;
    if (window.Fr && Fr.barrer) Fr.barrer(cont);
  }
}

function gradeEvalOp() {
  const { calc, mcm, inc, prob, reto } = evalOpData;
  let total = 0;

  calc.forEach((c, i) => {
    const v = normEval(document.getElementById('evOpCIn_' + i)?.value);
    const ok = v === normEval(c.ans);
    if (ok) total += 5;
    document.getElementById('evOpC_' + i).style.borderColor = ok ? 'var(--green)' : 'var(--coral)';
  });
  mcm.forEach((m, i) => {
    const v = normEval(document.getElementById('evOpMIn_' + i)?.value);
    const ok = v === normEval(m.ans);
    if (ok) total += 5;
    document.getElementById('evOpM_' + i).style.borderColor = ok ? 'var(--green)' : 'var(--coral)';
  });
  inc.forEach((it, i) => {
    const v = normEval(document.getElementById('evOpIIn_' + i)?.value);
    const valid = [it.ans, ...(it.alts || [])].map(normEval);
    const ok = valid.includes(v);
    if (ok) total += 5;
    document.getElementById('evOpI_' + i).style.borderColor = ok ? 'var(--green)' : 'var(--coral)';
  });
  prob.forEach((p, i) => {
    const v = normEval(document.getElementById('evOpPIn_' + i)?.value);
    const valid = [p.ans, ...(p.alts || [])].map(normEval);
    const ok = valid.includes(v);
    if (ok) total += 5;
    document.getElementById('evOpP_' + i).style.borderColor = ok ? 'var(--green)' : 'var(--coral)';
  });
  reto.forEach((r, i) => {
    const sel = document.querySelector(`input[name="evOpR_${i}"]:checked`);
    const ok = sel && sel.value === r.ans;
    if (ok) total += 5;
    document.getElementById('evOpR_' + i).style.borderColor = ok ? 'var(--green)' : 'var(--coral)';
  });

  evalOpShowAns = true;
  document.querySelectorAll('#evOpContent .ev-op-ans').forEach(el => { el.style.display = 'block'; });
  document.getElementById('evOpAnsBtn').textContent = '🙈 Ocultar Respuestas';

  const sb = document.getElementById('evOpScoreBox');
  const col = total >= 70 ? 'var(--green)' : 'var(--coral)';
  sb.style.display = 'block';
  sb.style.background = 'var(--card2)';
  sb.style.border = `2px solid ${col}`;
  sb.innerHTML = `<div style="font-size:2.1rem;font-weight:900;color:${col};" data-sinfr="1">${total} / 100 puntos</div>
    <div style="font-size:0.9rem;color:var(--muted);">Prueba Operativa Calificada</div>`;

  if (total >= 70) {
    unlockAch('eval_grad');
    addXP(35);
    sfx('win');
    dispararRegistroMetas();
  } else {
    sfx('bad');
  }
  sb.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function toggleEvalOpAns() {
  evalOpShowAns = !evalOpShowAns;
  document.querySelectorAll('#evOpContent .ev-op-ans').forEach(el => { el.style.display = evalOpShowAns ? 'block' : 'none'; });
  document.getElementById('evOpAnsBtn').textContent = evalOpShowAns ? '🙈 Ocultar Respuestas' : '👁️ Mostrar Respuestas';
}

function printEvalOp() {
  const { calc, mcm, inc, prob, reto } = evalOpData;
  const formaNum = String(evalOpFormaActual).padStart(2, '0');
  const pw = window.open('', '_blank');
  if (!pw) { window.print(); return; }
  pw.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Prueba Operativa · Fracciones Heterogéneas · Forma ${formaNum}</title>
  <style>
    @page{size:letter;margin:14mm 15mm;}
    body{font-family: Georgia, serif;color:#111;font-size:10pt;line-height:1.45;}
    h1{font-size:13pt;margin:0;}
    .sec-h{background:#111;color:#fff;padding:3px 8px;font-weight:bold;font-size:9.5pt;margin:10px 0 6px;}
    .pauta{page-break-before:always;border-top:2px dashed #000;padding-top:10px;}
  </style></head><body>
    <div style="text-align:center;border-bottom:2px solid #000;padding-bottom:6px;margin-bottom:8px;">
      <h1>PRUEBA OPERATIVA DE MATEMÁTICA — FRACCIONES HETEROGÉNEAS</h1>
      <div style="font-size:9pt;">Proyecto Educativo M.E.T.A.S · Forma ${formaNum} · Valor: 100 Puntos</div>
    </div>
    <div style="margin-bottom:8px;">Nombre: _______________________________________ Grado: __________ Fecha: ____________</div>
    <div class="sec-h">I. SUMA Y RESTA PASO A PASO (30 pts · 5 pts c/u)</div>
    ${calc.map((c, i) => `<div>${i + 1}) ${c.expr} = ___________________________</div>`).join('')}
    <div class="sec-h">II. RADAR DEL MCM Y FRACCIONES EQUIVALENTES (20 pts · 5 pts c/u)</div>
    ${mcm.map((m, i) => `<div>${i + 1}) ${m.q} _______________</div>`).join('')}
    <div class="sec-h">III. INCÓGNITAS FRACCIONARIAS (15 pts · 5 pts c/u)</div>
    ${inc.map((it, i) => `<div>${i + 1}) ${it.eq} → ▢ = ___________</div>`).join('')}
    <div class="sec-h">IV. PROBLEMAS DE APLICACIÓN (20 pts · 5 pts c/u)</div>
    ${prob.map((p, i) => `<div style="margin-bottom:8px;"><strong>${i + 1}. ${p.title}:</strong> ${p.text}<br>Respuesta: ______________________</div>`).join('')}
    <div class="sec-h">V. RETOS DE PENSAMIENTO CRÍTICO (15 pts · 5 pts c/u)</div>
    ${reto.map((r, i) => `<div style="margin-bottom:6px;"><strong>${i + 1}. ${r.q}</strong><br>${r.shuffledOpts.map(o => `[ &nbsp; ] ${o}`).join(' &nbsp;&nbsp;&nbsp; ')}</div>`).join('')}
    <div class="pauta">
      <h1>PAUTA DOCENTE — PRUEBA OPERATIVA FORMA ${formaNum}</h1>
      <p><strong>I:</strong> ${calc.map((c, i) => `${i + 1}) ${c.ans}`).join(' · ')}</p>
      <p><strong>II:</strong> ${mcm.map((m, i) => `${i + 1}) ${m.ans}`).join(' · ')}</p>
      <p><strong>III:</strong> ${inc.map((it, i) => `${i + 1}) ${it.ans}`).join(' · ')}</p>
      <p><strong>IV:</strong> ${prob.map((p, i) => `${i + 1}) ${p.ans} ${p.unit}`).join(' · ')}</p>
      <p><strong>V:</strong> ${reto.map((r, i) => `${i + 1}) ${r.ans}`).join(' · ')}</p>
    </div>
  </body></html>`);
  pw.document.close();
  setTimeout(() => pw.print(), 350);
}

/* ═══════════════ INICIALIZACIÓN GENERAL ═══════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadProgress();
  updateXPUI();
  renderAch();
  renderProgDots();

  initPredice();
  initTipos();
  initErrores();
  actualizarUIEstrellasLab();
  generarNuevoEjercicio();
  updateSimMCM();
  renderFC();
  initQuiz();
  initClasifica();
  initIdentifica();
  initCompleta();
  initWidgets();
  initExplica();
  initSopa();
  initTareas();
  genEval();
  genEvalOp();

  const today = new Date().toISOString().split('T')[0];
  const d1 = document.getElementById('evDate');
  const d2 = document.getElementById('evOpDate');
  if (d1) d1.value = today;
  if (d2) d2.value = today;

  ['inputEqNumA', 'inputEqNumB'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') verificarPaso2();
    });
  });
  ['inputRawNum', 'inputRawDen', 'inputSimpNum', 'inputSimpDen'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') verificarPaso3();
    });
  });

  if (window.Fr && Fr.barrer) {
    Fr.barrer(document.body);
  }
});
