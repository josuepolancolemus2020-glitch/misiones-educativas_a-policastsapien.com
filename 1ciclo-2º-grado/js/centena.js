// ===== UTILIDADES =====
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
function fb(id, msg, isOk) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.className = 'fb show ' + (isOk ? 'ok' : 'err'); }
}
function numToWords(n) {
  if (n === 100) return 'cien';
  if (n < 100 || n > 999) return '???';
  const H = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  const T = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const O = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const TEENS = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
  const V = ['veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
  const c = Math.floor(n / 100), rest = n % 100;
  let w = H[c];
  if (rest === 0) return w;
  let r = '';
  if (rest >= 1 && rest <= 9) r = O[rest];
  else if (rest >= 10 && rest <= 19) r = TEENS[rest - 10];
  else if (rest >= 20 && rest <= 29) r = V[rest - 20];
  else { const t = Math.floor(rest / 10), u = rest % 10; r = u === 0 ? T[t] : T[t] + ' y ' + O[u]; }
  return w + ' ' + r;
}

// ===== SAVE KEY & ESTADO =====
const SAVE_KEY = 'matematica_centena_2g_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1, unlockedAch = [], darkMode = false, prevLevel = 0;
const TOTAL_SECTIONS = 12;
const xpT = { fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set(), nl: new Set(), sort: new Set(), bldr: new Set(), compVis: new Set() };

// ===== SONIDO =====
let sndOn = true, AC = null;
function getAC() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } return AC; }
function sfx(t) {
  if (!sndOn) return;
  try {
    const ac = getAC(); if (!ac) return;
    const g = ac.createGain(); g.connect(ac.destination);
    const o = ac.createOscillator(); o.connect(g);
    if (t === 'click') { o.type = 'sine'; o.frequency.setValueAtTime(700, ac.currentTime); o.frequency.linearRampToValueAtTime(1100, ac.currentTime + 0.1); g.gain.setValueAtTime(0.15, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.12); o.start(); o.stop(ac.currentTime + 0.12); }
    else if (t === 'ok') { [523, 659, 784].forEach((f, i) => { const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.connect(g2); g2.connect(ac.destination); o2.type = 'triangle'; o2.frequency.value = f; g2.gain.setValueAtTime(0.15, ac.currentTime + i * 0.1); g2.gain.linearRampToValueAtTime(0, ac.currentTime + i * 0.1 + 0.15); o2.start(ac.currentTime + i * 0.1); o2.stop(ac.currentTime + i * 0.1 + 0.15); }); }
    else if (t === 'no') { o.type = 'square'; o.frequency.setValueAtTime(200, ac.currentTime); o.frequency.linearRampToValueAtTime(100, ac.currentTime + 0.2); g.gain.setValueAtTime(0.12, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.2); o.start(); o.stop(ac.currentTime + 0.2); }
    else if (t === 'up') { [523, 659, 784, 1047].forEach((f, i) => { const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.connect(g2); g2.connect(ac.destination); o2.type = 'triangle'; o2.frequency.value = f; g2.gain.setValueAtTime(0.18, ac.currentTime + i * 0.12); g2.gain.linearRampToValueAtTime(0, ac.currentTime + i * 0.12 + 0.18); o2.start(ac.currentTime + i * 0.12); o2.stop(ac.currentTime + i * 0.12 + 0.18); }); }
    else if (t === 'fan') { [523, 587, 659, 698, 784, 1047].forEach((f, i) => { const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.connect(g2); g2.connect(ac.destination); o2.type = 'triangle'; o2.frequency.value = f; g2.gain.setValueAtTime(0.15, ac.currentTime + i * 0.1); g2.gain.linearRampToValueAtTime(0, ac.currentTime + i * 0.1 + 0.2); o2.start(ac.currentTime + i * 0.1); o2.stop(ac.currentTime + i * 0.1 + 0.2); }); }
    else if (t === 'flip') { o.type = 'sine'; o.frequency.setValueAtTime(400, ac.currentTime); o.frequency.linearRampToValueAtTime(900, ac.currentTime + 0.15); g.gain.setValueAtTime(0.1, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.18); o.start(); o.stop(ac.currentTime + 0.18); }
    else if (t === 'tick') { o.type = 'sine'; o.frequency.value = 1000; g.gain.setValueAtTime(0.08, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.05); o.start(); o.stop(ac.currentTime + 0.05); }
    else if (t === 'ach') { [880, 1047, 1319].forEach((f, i) => { const o2 = ac.createOscillator(), g2 = ac.createGain(); o2.connect(g2); g2.connect(ac.destination); o2.type = 'triangle'; o2.frequency.value = f; g2.gain.setValueAtTime(0.2, ac.currentTime + i * 0.12); g2.gain.linearRampToValueAtTime(0, ac.currentTime + i * 0.12 + 0.22); o2.start(ac.currentTime + i * 0.12); o2.stop(ac.currentTime + i * 0.12 + 0.22); }); }
  } catch (e) { }
}
function toggleSnd() { sndOn = !sndOn; document.getElementById('sndBtn').textContent = sndOn ? '🔊 Sonido' : '🔇 Sonido'; }

// ===== DARK MODE =====
function toggleTheme() { darkMode = !darkMode; document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light'); document.getElementById('themeBtn').textContent = darkMode ? '☀️ Tema' : '🌙 Tema'; localStorage.setItem(SAVE_KEY + '_theme', darkMode ? 'dark' : 'light'); sfx('click'); }
function initTheme() { const s = localStorage.getItem(SAVE_KEY + '_theme'), sys = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; darkMode = (s === 'dark') || (s === null && sys); if (darkMode) { document.documentElement.setAttribute('data-theme', 'dark'); const b = document.getElementById('themeBtn'); if (b) b.textContent = '☀️ Tema'; } }

// ===== XP =====
const LEVELS = [{ min: 0, name: 'Novato ✏️' }, { min: 30, name: 'Explorador 🔍' }, { min: 70, name: 'Conocedor 📐' }, { min: 120, name: 'Experto 🌟' }, { min: 180, name: 'Campeón 🏆' }, { min: MXP, name: '¡Maestro! 🎓' }];
function addXP(n) { const old = xp; xp = Math.min(xp + n, MXP); updateXPBar(); if (n > 0 && xp !== old) { const lvlNow = LEVELS.filter(l => xp >= l.min).length - 1; if (lvlNow > prevLevel) { showToast('🆙 ¡Subiste a ' + LEVELS[lvlNow].name + '!'); sfx('up'); prevLevel = lvlNow; if (lvlNow >= 2) unlockAchievement('nivel2'); if (lvlNow >= 4) unlockAchievement('nivel4'); } saveProgress(); } }
function updateXPBar() { const pct = (xp / MXP) * 100; const fill = document.getElementById('xpFill'); const pts = document.getElementById('xpPts'); const lvl = document.getElementById('xpLvl'); if (fill) fill.style.width = pct + '%'; if (pts) pts.textContent = '⭐ ' + xp; if (lvl) { const l = LEVELS.filter(x => xp >= x.min); lvl.textContent = l[l.length - 1].name; } }

// ===== ACHIEVEMENTS =====
const ACHIEVEMENTS = {
  primer_quiz: { icon: '🧠', label: 'Primera prueba superada' },
  flash_master: { icon: '📚', label: 'Todas las flashcards vistas' },
  clasif_pro: { icon: '🏷️', label: 'Clasificador experto' },
  id_master: { icon: '🔍', label: 'Identificador maestro' },
  reto_hero: { icon: '🏆', label: 'Héroe del reto final' },
  nivel2: { icon: '🔭', label: '¡Explorador alcanzado!' },
  nivel4: { icon: '🔥', label: '¡Campeón alcanzado!' }
};
function unlockAchievement(id) { if (unlockedAch.includes(id)) return; unlockedAch.push(id); sfx('ach'); showToast(ACHIEVEMENTS[id].icon + ' ¡Logro desbloqueado! ' + ACHIEVEMENTS[id].label); launchConfetti(); renderAchPanel(); saveProgress(); }
function renderAchPanel() { const list = document.getElementById('achList'); if (!list) return; list.innerHTML = ''; Object.entries(ACHIEVEMENTS).forEach(([id, a]) => { const div = document.createElement('div'); div.className = 'ach-item' + (unlockedAch.includes(id) ? '' : ' locked'); div.innerHTML = `<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`; list.appendChild(div); }); }
function toggleAchPanel() { sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg) { let t = document.querySelector('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); } t.textContent = msg; t.style.display = 'block'; clearTimeout(t._tid); t._tid = setTimeout(() => t.style.display = 'none', 3200); }
function launchConfetti() { const colors = ['#2e7d32', '#f57c00', '#1565c0', '#fdcb6e', '#00b894']; for (let i = 0; i < 60; i++) { const c = document.createElement('div'); c.className = 'confetti-piece'; c.style.cssText = `left:${Math.random() * 100}vw;background:${colors[Math.floor(Math.random() * colors.length)]};animation-duration:${0.8 + Math.random() * 1.5}s;animation-delay:${Math.random() * 0.4}s;width:${6 + Math.random() * 6}px;height:${6 + Math.random() * 6}px;border-radius:${Math.random() > 0.5 ? '50%' : '2px'};`; document.body.appendChild(c); c.addEventListener('animationend', () => c.remove()); } }

// ===== LOCAL STORAGE =====
function saveProgress() { try { localStorage.setItem(SAVE_KEY, JSON.stringify({ doneSections: Array.from(done), unlockedAch, evalFormNum, xp })); } catch (e) { } }
function loadProgress() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (!s) return;
    if (s.doneSections && Array.isArray(s.doneSections)) s.doneSections.forEach(id => { done.add(id); const b = document.querySelector(`[data-s="${id}"]`); if (b) b.classList.add('done'); });
    if (s.unlockedAch && Array.isArray(s.unlockedAch)) unlockedAch = s.unlockedAch.filter(id => ACHIEVEMENTS[id] !== undefined);
    if (s.evalFormNum) evalFormNum = s.evalFormNum;
    if (s.xp !== undefined) { xp = s.xp; updateXPBar(); }
    prevLevel = LEVELS.filter(l => xp >= l.min).length - 1;
  } catch (e) { }
}

// ===== ACCESIBILIDAD =====
function toggleLetra() { document.body.classList.toggle('letra-grande'); sfx('click'); }

// ===== NAVEGACIÓN =====
function go(id) {
  document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-t').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
  const sec = document.getElementById(id);
  if (sec) { sec.classList.add('active'); done.add(id); const nb = document.querySelector(`[data-s="${id}"]`); if (nb) { nb.classList.add('active', 'done'); nb.setAttribute('aria-selected', 'true'); } saveProgress(); }
  sfx('click');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== CONTENIDO: FLASHCARDS =====
const FLASHCARDS = [
  { w: '¿Cuántas unidades hay en 1 centena?', a: '<strong>100 unidades</strong> (10 grupos de 10)' },
  { w: '¿Cuántas decenas forman 1 centena?', a: '<strong>10 decenas</strong> forman 1 centena' },
  { w: '¿Cómo se lee el número 325?', a: '<strong>Trescientos veinticinco</strong>' },
  { w: '¿Cómo se escribe "doscientos cuarenta"?', a: '<strong>240</strong>' },
  { w: '¿Cuál es el valor del dígito 4 en 478?', a: '<strong>400</strong> (cuatro centenas)' },
  { w: '¿Cuál es el valor del dígito 7 en 478?', a: '<strong>70</strong> (siete decenas)' },
  { w: '¿Cuál es el valor del dígito 8 en 478?', a: '<strong>8</strong> (ocho unidades)' },
  { w: '¿Cómo se descompone el número 563?', a: '<strong>500 + 60 + 3</strong>' },
  { w: '¿Qué número forman 3 centenas, 0 decenas y 5 unidades?', a: '<strong>305</strong>' },
  { w: '¿Cuál es el MAYOR número de tres cifras?', a: '<strong>999</strong> (novecientos noventa y nueve)' },
  { w: '¿Cuál es el MENOR número de tres cifras?', a: '<strong>100</strong> (cien)' },
  { w: '¿Cómo se lee el número 500?', a: '<strong>Quinientos</strong>' },
  { w: '¿Cómo se descompone 807?', a: '<strong>800 + 0 + 7</strong> (8 centenas, 0 decenas, 7 unidades)' },
  { w: '¿Cuántos números de tres cifras existen?', a: '<strong>900</strong> números (del 100 al 999)' },
  { w: '¿Cuántos grupos de 10 forman 1 centena?', a: '<strong>10 grupos de 10</strong> = 100' },
  { w: '¿Cómo se escribe "novecientos noventa y nueve"?', a: '<strong>999</strong>' },
];
let fcIdx = 0, fcFlipped = false, fcFirstSeen = new Set();
function initFC() { renderFC(); }
function renderFC() {
  const fc = FLASHCARDS[fcIdx];
  document.getElementById('fcW').textContent = fc.w;
  document.getElementById('fcA').innerHTML = fc.a;
  document.getElementById('fcCtr').textContent = (fcIdx + 1) + ' / ' + FLASHCARDS.length;
  const inner = document.getElementById('fcInner');
  inner.classList.remove('flipped'); fcFlipped = false;
  inner.setAttribute('aria-label', 'Pregunta: ' + fc.w + '. Presiona Enter para ver la respuesta');
}
function flipCard() {
  sfx('flip'); fcFlipped = !fcFlipped;
  document.getElementById('fcInner').classList.toggle('flipped', fcFlipped);
  if (!fcFirstSeen.has(fcIdx)) { fcFirstSeen.add(fcIdx); addXP(1); if (fcFirstSeen.size === FLASHCARDS.length) unlockAchievement('flash_master'); }
}
function prevFC() { sfx('click'); fcIdx = (fcIdx - 1 + FLASHCARDS.length) % FLASHCARDS.length; renderFC(); }
function nextFC() { sfx('click'); fcIdx = (fcIdx + 1) % FLASHCARDS.length; renderFC(); }

// ===== CONTENIDO: QUIZ =====
const QUIZ_QS = [
  { q: '¿Cuántas unidades hay en 1 centena?', opts: ['10 unidades', '50 unidades', '100 unidades', '1,000 unidades'], ans: 2 },
  { q: '¿Cuántas decenas forman 1 centena?', opts: ['5 decenas', '10 decenas', '20 decenas', '100 decenas'], ans: 1 },
  { q: '¿Cuál es el valor del dígito 5 en el número 537?', opts: ['5', '50', '500', '5,000'], ans: 2 },
  { q: '¿Cómo se lee el número 427?', opts: ['Cuatrocientos doce', 'Cuatrocientos veintisiete', 'Quinientos veintisiete', 'Cuatrocientos siete'], ans: 1 },
  { q: '¿Cuántas centenas tiene el número 700?', opts: ['1 centena', '7 centenas', '70 centenas', '700 centenas'], ans: 1 },
  { q: '¿Qué número forman 2 centenas + 4 decenas + 6 unidades?', opts: ['246', '264', '426', '642'], ans: 0 },
  { q: '¿Cómo se descompone 381?', opts: ['300 + 80 + 1', '300 + 8 + 1', '38 + 1', '3 + 8 + 1'], ans: 0 },
  { q: '¿Cuál es el MENOR número de tres cifras?', opts: ['001', '099', '100', '010'], ans: 2 },
  { q: '¿Cuál es el MAYOR número de tres cifras?', opts: ['900', '990', '998', '999'], ans: 3 },
  { q: '¿Cuánto vale el dígito 0 en el número 506?', opts: ['0 decenas (ninguna decena)', '0 centenas', '0 unidades', 'Vale 10'], ans: 0 },
  { q: '¿Cómo se escribe "seiscientos tres"?', opts: ['630', '613', '603', '6,003'], ans: 2 },
  { q: '¿Qué número viene después de 299?', opts: ['200', '289', '300', '298'], ans: 2 },
];
let qzIdx = 0, qzSel = null;
function renderQz() {
  const q = QUIZ_QS[qzIdx];
  document.getElementById('qzProg').textContent = 'Pregunta ' + (qzIdx + 1) + ' de ' + QUIZ_QS.length;
  document.getElementById('qzQ').textContent = q.q;
  const opts = document.getElementById('qzOpts'); opts.innerHTML = '';
  q.opts.forEach((o, i) => {
    const btn = document.createElement('button');
    btn.className = 'qz-opt'; btn.textContent = o;
    btn.onclick = () => { document.querySelectorAll('.qz-opt').forEach(b => b.classList.remove('sel')); btn.classList.add('sel'); qzSel = i; sfx('click'); };
    opts.appendChild(btn);
  });
  document.getElementById('fbQz').className = 'fb';
}
function checkQz() {
  if (qzSel === null) { fb('fbQz', '¡Selecciona una respuesta primero!', false); return; }
  const q = QUIZ_QS[qzIdx];
  document.querySelectorAll('.qz-opt').forEach((b, i) => { b.classList.remove('sel'); if (i === q.ans) b.classList.add('correct'); else if (i === qzSel) b.classList.add('wrong'); });
  if (qzSel === q.ans) {
    sfx('ok'); if (!xpT.qz.has(qzIdx)) { xpT.qz.add(qzIdx); addXP(5); }
    fb('fbQz', '¡Excelente! ¡Correcto! 🎉', true);
    if (qzIdx === QUIZ_QS.length - 1) unlockAchievement('primer_quiz');
    setTimeout(() => { qzIdx = (qzIdx + 1) % QUIZ_QS.length; qzSel = null; renderQz(); }, 1800);
  } else {
    sfx('no'); fb('fbQz', '¡Inténtalo de nuevo! La respuesta correcta está marcada en verde.', false);
    qzSel = null; setTimeout(() => { if (qzIdx < QUIZ_QS.length - 1) { qzIdx++; renderQz(); } }, 2200);
  }
}
function useHintQz() {
  addXP(-2); const q = QUIZ_QS[qzIdx];
  document.querySelectorAll('.qz-opt').forEach((b, i) => { if (i !== q.ans && Math.random() > 0.5) b.style.opacity = '0.3'; });
  fb('fbQz', '💡 Pista: una opción incorrecta ha sido atenuada (-2 XP)', false);
}
function resetQz() { qzIdx = 0; qzSel = null; renderQz(); sfx('click'); }

// ===== CONTENIDO: CLASIFICA =====
const CLASS_GROUPS = [
  { left: 'Empieza con centena 3 (300-399)', right: 'No empieza con centena 3', items: [{ t: '325', s: 'left' }, { t: '399', s: 'left' }, { t: '301', s: 'left' }, { t: '200', s: 'right' }, { t: '450', s: 'right' }, { t: '189', s: 'right' }] },
  { left: 'Entre 100 y 499', right: 'Entre 500 y 999', items: [{ t: '125', s: 'left' }, { t: '380', s: 'left' }, { t: '499', s: 'left' }, { t: '500', s: 'right' }, { t: '750', s: 'right' }, { t: '999', s: 'right' }] },
  { left: 'Tiene 5 en las decenas', right: 'No tiene 5 en las decenas', items: [{ t: '254', s: 'left' }, { t: '152', s: 'left' }, { t: '853', s: 'left' }, { t: '234', s: 'right' }, { t: '698', s: 'right' }, { t: '307', s: 'right' }] },
  { left: 'Tiene 0 en las unidades', right: 'Unidades distintas de 0', items: [{ t: '200', s: 'left' }, { t: '350', s: 'left' }, { t: '470', s: 'left' }, { t: '213', s: 'right' }, { t: '506', s: 'right' }, { t: '841', s: 'right' }] },
  { left: 'Centena vale 400 (400-499)', right: 'Centena diferente a 400', items: [{ t: '400', s: 'left' }, { t: '427', s: 'left' }, { t: '489', s: 'left' }, { t: '340', s: 'right' }, { t: '504', s: 'right' }, { t: '144', s: 'right' }] },
];
let clsGroup = 0, clsSel = null, clsPlaced = {};
function renderClass() {
  const g = CLASS_GROUPS[clsGroup];
  document.getElementById('col-left-head').textContent = g.left;
  document.getElementById('col-right-head').textContent = g.right;
  const bank = document.getElementById('clsBank'); bank.innerHTML = '';
  document.getElementById('items-left').innerHTML = ''; document.getElementById('items-right').innerHTML = '';
  clsPlaced = {}; clsSel = null;
  _shuffle(g.items).forEach(item => {
    const el = document.createElement('div'); el.className = 'wb-item'; el.textContent = item.t;
    el.dataset.val = item.t; el.dataset.ans = item.s;
    el.onclick = () => { document.querySelectorAll('.wb-item').forEach(b => b.classList.remove('sel-word')); el.classList.add('sel-word'); clsSel = el; sfx('click'); };
    bank.appendChild(el);
  });
  document.getElementById('fbCls').className = 'fb';
}
function placeInCol(side) {
  if (!clsSel) { fb('fbCls', '¡Primero selecciona un número del banco!', false); return; }
  const col = document.getElementById('items-' + side);
  const item = document.createElement('div'); item.className = 'drop-item';
  item.dataset.val = clsSel.dataset.val; item.dataset.ans = clsSel.dataset.ans; item.dataset.placed = side;
  item.innerHTML = clsSel.dataset.val + ' <span style="font-size:0.7rem;color:var(--gray)">↩</span>';
  item.onclick = () => { document.getElementById('clsBank').appendChild(clsSel || (() => { const b = document.createElement('div'); b.className = 'wb-item'; b.textContent = item.dataset.val; b.dataset.val = item.dataset.val; b.dataset.ans = item.dataset.ans; b.onclick = () => { document.querySelectorAll('.wb-item').forEach(x => x.classList.remove('sel-word')); b.classList.add('sel-word'); clsSel = b; sfx('click'); }; return b; })()); item.remove(); sfx('click'); };
  col.appendChild(item); clsSel.remove(); clsSel = null;
  document.getElementById('fbCls').className = 'fb';
  sfx('click');
}
function checkClass() {
  const items = document.querySelectorAll('.drop-item'); let allOk = true;
  items.forEach(it => { const ok = it.dataset.ans === it.dataset.placed; it.classList.toggle('cls-ok', ok); it.classList.toggle('cls-no', !ok); if (!ok) allOk = false; });
  if (items.length === 0) { fb('fbCls', '¡Coloca los números en las columnas primero!', false); return; }
  if (allOk) { sfx('ok'); launchConfetti(); if (!xpT.cls.has(clsGroup)) { xpT.cls.add(clsGroup); addXP(5); unlockAchievement('clasif_pro'); } fb('fbCls', '¡Excelente! ¡Todos bien colocados! 🎉', true); }
  else { sfx('no'); fb('fbCls', '¡Hay errores! Los rojos están mal. Intenta de nuevo.', false); }
}
function nextClassGroup() { clsGroup = (clsGroup + 1) % CLASS_GROUPS.length; renderClass(); sfx('click'); }
function resetClass() { renderClass(); sfx('click'); }

// ===== CONTENIDO: IDENTIFICA =====
const IDENTIFY_SETS = [
  { words: ['El', 'número', '325', 'tiene', '3', 'centenas,', '2', 'decenas', 'y', '5', 'unidades.'], instruction: 'Toca el número de tres cifras', ans: 2 },
  { words: ['En', 'el', 'número', '487,', 'el', 'dígito', '4', 'vale', '400.'], instruction: 'Toca el dígito que vale 400 (está en las centenas)', ans: 6 },
  { words: ['El', 'número', '600', 'tiene', '6', 'centenas,', '0', 'decenas', 'y', '0', 'unidades.'], instruction: 'Toca el número de tres cifras', ans: 2 },
  { words: ['La', 'descomposición', 'de', '256', 'es:', '200', '+', '50', '+', '6.'], instruction: 'Toca el valor de las decenas', ans: 7 },
  { words: ['El', 'menor', 'número', 'de', 'tres', 'cifras', 'es', '100.'], instruction: 'Toca el menor número de tres cifras', ans: 7 },
  { words: ['Para', 'formar', '734', 'necesito', '7', 'centenas,', '3', 'decenas', 'y', '4', 'unidades.'], instruction: 'Toca el número de tres cifras que se está formando', ans: 2 },
  { words: ['El', 'número', '500', 'se', 'lee', '"quinientos".'], instruction: 'Toca el número', ans: 2 },
  { words: ['Las', 'centenas', 'son', 'grupos', 'de', 'cien', 'unidades.'], instruction: 'Toca la palabra que nombra a los grupos de 100', ans: 1 },
  { words: ['En', '382,', 'el', 'dígito', '8', 'está', 'en', 'las', 'decenas.'], instruction: 'Toca el dígito que está en las decenas', ans: 4 },
  { words: ['El', 'número', '999', 'es', 'el', 'mayor', 'de', 'tres', 'cifras.'], instruction: 'Toca el mayor número de tres cifras', ans: 2 },
];
let idIdx = 0;
function renderId() {
  const set = IDENTIFY_SETS[idIdx];
  document.getElementById('idProg').textContent = 'Oración ' + (idIdx + 1) + ' de ' + IDENTIFY_SETS.length;
  document.getElementById('idInfo').textContent = '📌 ' + set.instruction;
  const sent = document.getElementById('idSent'); sent.innerHTML = '';
  set.words.forEach((w, i) => {
    const span = document.createElement('span'); span.className = 'id-word'; span.textContent = w; span.tabIndex = 0;
    span.onclick = () => checkId(span, i); span.onkeydown = e => { if (e.key === 'Enter') checkId(span, i); };
    sent.appendChild(span); sent.appendChild(document.createTextNode(' '));
  });
  document.getElementById('fbId').className = 'fb';
}
function checkId(span, i) {
  const set = IDENTIFY_SETS[idIdx];
  document.querySelectorAll('.id-word').forEach(s => s.classList.remove('selected', 'id-ok', 'id-no'));
  if (i === set.ans) {
    span.classList.add('id-ok'); sfx('ok');
    if (!xpT.id.has(idIdx)) { xpT.id.add(idIdx); addXP(5); }
    fb('fbId', '¡Muy bien! ¡Correcto! 🎉', true);
    if (xpT.id.size === IDENTIFY_SETS.length) unlockAchievement('id_master');
    setTimeout(() => { idIdx = (idIdx + 1) % IDENTIFY_SETS.length; renderId(); }, 1500);
  } else { span.classList.add('id-no'); sfx('no'); fb('fbId', '¡Inténtalo de nuevo! Busca la palabra pedida.', false); }
}
function nextId() { sfx('click'); idIdx = (idIdx + 1) % IDENTIFY_SETS.length; renderId(); }
function resetId() { idIdx = 0; renderId(); sfx('click'); }

// ===== CONTENIDO: COMPLETA =====
const COMPLETE_SETS = [
  { sent: 'En el número 652, el valor de la centena es ___', opts: ['600', '60', '6', '6,000'], ans: 0 },
  { sent: '1 centena = ___ decenas', opts: ['1', '5', '10', '100'], ans: 2 },
  { sent: 'En 807: 800 + ___ + 7', opts: ['8', '0', '80', '800'], ans: 1 },
  { sent: 'Después del número 299 viene ___', opts: ['198', '200', '300', '289'], ans: 2 },
  { sent: 'El número 345 tiene ___ centenas', opts: ['5', '4', '3', '2'], ans: 2 },
  { sent: 'El número 560 tiene el dígito ___ en las unidades', opts: ['5', '6', '0', '1'], ans: 2 },
  { sent: '"Cuatrocientos cincuenta y dos" se escribe ___', opts: ['425', '452', '245', '542'], ans: 1 },
  { sent: '9 centenas + 9 decenas + 9 unidades = ___', opts: ['900', '990', '999', '9,999'], ans: 2 },
];
let cmpIdx = 0, cmpSel = null;
function renderCmp() {
  const set = COMPLETE_SETS[cmpIdx];
  document.getElementById('cmpProg').textContent = 'Oración ' + (cmpIdx + 1) + ' de ' + COMPLETE_SETS.length;
  const parts = set.sent.split('___');
  document.getElementById('cmpSent').innerHTML = parts[0] + '<span class="blank">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>' + (parts[1] || '');
  const opts = document.getElementById('cmpOpts'); opts.innerHTML = ''; cmpSel = null;
  set.opts.forEach((o, i) => {
    const btn = document.createElement('button'); btn.className = 'cmp-opt'; btn.textContent = o;
    btn.onclick = () => { document.querySelectorAll('.cmp-opt').forEach(b => b.classList.remove('sel')); btn.classList.add('sel'); cmpSel = i; sfx('click'); };
    opts.appendChild(btn);
  });
  document.getElementById('fbCmp').className = 'fb';
}
function checkCmp() {
  if (cmpSel === null) { fb('fbCmp', '¡Selecciona una opción primero!', false); return; }
  const set = COMPLETE_SETS[cmpIdx];
  document.querySelectorAll('.cmp-opt').forEach((b, i) => { b.classList.remove('sel'); if (i === set.ans) b.classList.add('correct'); else if (i === cmpSel) b.classList.add('wrong'); });
  if (cmpSel === set.ans) {
    sfx('ok'); if (!xpT.cmp.has(cmpIdx)) { xpT.cmp.add(cmpIdx); addXP(5); }
    document.getElementById('cmpSent').innerHTML = COMPLETE_SETS[cmpIdx].sent.replace('___', '<span class="blank" style="color:var(--jade)">' + set.opts[set.ans] + '</span>');
    fb('fbCmp', '¡Correcto! ¡Muy bien! 🎉', true);
    setTimeout(() => { cmpIdx = (cmpIdx + 1) % COMPLETE_SETS.length; cmpSel = null; renderCmp(); }, 1800);
  } else { sfx('no'); fb('fbCmp', '¡Inténtalo de nuevo! La respuesta correcta está marcada.', false); cmpSel = null; }
}

// ===== LAB: CDU BUILDER =====
let labC = 2, labD = 3, labU = 5;
let labChallengeNum = 0;
function labUpdate() {
  const vis = document.getElementById('labVis'); if (!vis) return;
  let html = '';
  // Centenas blocks
  html += '<div class="lab-vis-group"><div class="lab-vis-blocks">';
  for (let i = 0; i < labC; i++) html += '<div class="lab-vis-c">100</div>';
  if (labC === 0) html += '<div style="width:44px;height:44px;border:2px dashed var(--border);border-radius:6px;"></div>';
  html += '</div><div class="lab-vis-label">C: ' + labC + '</div></div>';
  // Decenas blocks
  html += '<div class="lab-vis-group"><div class="lab-vis-blocks">';
  for (let i = 0; i < labD; i++) html += '<div class="lab-vis-d"></div>';
  if (labD === 0) html += '<div style="width:12px;height:44px;border:2px dashed var(--border);border-radius:3px;"></div>';
  html += '</div><div class="lab-vis-label">D: ' + labD + '</div></div>';
  // Unidades dots
  html += '<div class="lab-vis-group"><div class="lab-vis-blocks">';
  for (let i = 0; i < labU; i++) html += '<div class="lab-vis-u"></div>';
  if (labU === 0) html += '<div style="width:14px;height:14px;border:2px dashed var(--border);border-radius:50%;"></div>';
  html += '</div><div class="lab-vis-label">U: ' + labU + '</div></div>';
  vis.innerHTML = html;
  const num = labC * 100 + labD * 10 + labU;
  document.getElementById('labNum').textContent = num;
  document.getElementById('labWords').textContent = num >= 100 ? numToWords(num) : (num < 10 ? 'solo unidades: ' + num : 'sin centenas completas');
  document.getElementById('labDecomp').textContent = (labC * 100) + ' + ' + (labD * 10) + ' + ' + labU + ' = ' + num;
  document.getElementById('labC').textContent = labC;
  document.getElementById('labD').textContent = labD;
  document.getElementById('labU').textContent = labU;
}
function changeC(n) { labC = Math.max(0, Math.min(9, labC + n)); labUpdate(); sfx('click'); }
function changeD(n) { labD = Math.max(0, Math.min(9, labD + n)); labUpdate(); sfx('click'); }
function changeU(n) { labU = Math.max(0, Math.min(9, labU + n)); labUpdate(); sfx('click'); }
function newLabChallenge() {
  labChallengeNum = Math.floor(Math.random() * 9 + 1) * 100 + Math.floor(Math.random() * 10) * 10 + Math.floor(Math.random() * 10);
  document.getElementById('labChallengeText').textContent = '¡Forma el número ' + labChallengeNum + '!';
  const fbEl = document.getElementById('fbLab'); if (fbEl) fbEl.className = 'fb';
}
function checkLabChallenge() {
  const num = labC * 100 + labD * 10 + labU;
  if (num === labChallengeNum) { sfx('ok'); launchConfetti(); addXP(4); fb('fbLab', '¡Excelente! Formaste el ' + labChallengeNum + ' correctamente! 🎉', true); newLabChallenge(); }
  else { sfx('no'); fb('fbLab', '¡Casi! Tienes ' + num + ' pero necesitas ' + labChallengeNum + '. ¡Sigue intentando!', false); }
}

// ===== WIDGETS: NUMBER LINE =====
const NL_TARGETS = [
  { start: 100, end: 200, target: 150 }, { start: 200, end: 300, target: 250 },
  { start: 300, end: 400, target: 350 }, { start: 100, end: 500, target: 300 },
  { start: 500, end: 600, target: 530 }, { start: 400, end: 800, target: 600 },
  { start: 100, end: 1000, target: 500 }, { start: 700, end: 900, target: 800 },
];
let nlIdx = 0;
function nlDraw() {
  const svg = document.getElementById('nlSvg'); if (!svg) return;
  const nt = NL_TARGETS[nlIdx];
  document.getElementById('nlTarget').textContent = nt.target;
  const W = 400, H = 80, margin = 30;
  const usable = W - margin * 2;
  const ticks = 5;
  const step = (nt.end - nt.start) / ticks;
  let content = '';
  content += `<line x1="${margin}" y1="40" x2="${W - margin}" y2="40" stroke="var(--border)" stroke-width="2"/>`;
  content += `<polygon points="${margin - 8},40 ${margin},36 ${margin},44" fill="var(--border)"/>`;
  content += `<polygon points="${W - margin + 8},40 ${W - margin},36 ${W - margin},44" fill="var(--border)"/>`;
  for (let i = 0; i <= ticks; i++) {
    const x = margin + (i / ticks) * usable;
    const val = nt.start + i * step;
    content += `<line x1="${x}" y1="33" x2="${x}" y2="47" stroke="var(--border)" stroke-width="1.5"/>`;
    content += `<text x="${x}" y="60" text-anchor="middle" font-size="9" fill="var(--gray)" font-family="Fredoka,sans-serif">${Math.round(val)}</text>`;
  }
  svg.innerHTML = content;
}
function nlClick(e) {
  const svg = document.getElementById('nlSvg'); const nt = NL_TARGETS[nlIdx];
  const rect = svg.getBoundingClientRect();
  const margin = 30, W = 400, usable = W - margin * 2;
  const svgW = rect.width;
  const clickX = (e.clientX - rect.left) / svgW * W;
  const pct = (clickX - margin) / usable;
  const val = nt.start + pct * (nt.end - nt.start);
  const tol = (nt.end - nt.start) * 0.08;
  const ok = Math.abs(val - nt.target) <= tol;
  const x = margin + ((nt.target - nt.start) / (nt.end - nt.start)) * usable;
  const clickSvgX = margin + ((val - nt.start) / (nt.end - nt.start)) * usable;
  const existing = svg.querySelector('.nl-marker');
  if (existing) existing.remove();
  svg.innerHTML += `<circle class="nl-marker" cx="${clickSvgX}" cy="40" r="8" fill="${ok ? 'var(--jade)' : 'var(--red)'}" opacity="0.85"/>`;
  svg.innerHTML += `<circle cx="${x}" cy="40" r="5" fill="var(--pri)" opacity="0.6"/>`;
  if (ok) { sfx('ok'); if (!xpT.nl.has(nlIdx)) { xpT.nl.add(nlIdx); addXP(3); } fb('fbNl', '¡Bien ubicado! 🎯', true); }
  else { sfx('no'); fb('fbNl', '¡Casi! El punto verde muestra dónde está ' + nt.target + '.', false); }
}
function nlNext() { sfx('click'); nlIdx = (nlIdx + 1) % NL_TARGETS.length; nlDraw(); document.getElementById('fbNl').className = 'fb'; }
function nlReset() { nlIdx = 0; nlDraw(); document.getElementById('fbNl').className = 'fb'; sfx('click'); }

// ===== WIDGETS: BUILDER CDU =====
const BLDR_TARGETS = [235, 104, 350, 621, 478, 580, 143, 760, 309, 999, 100, 455];
let bldrIdx = 0, bldrC = 0, bldrD = 0, bldrU = 0;
function updateBldr() {
  const num = bldrC * 100 + bldrD * 10 + bldrU;
  document.getElementById('bldrDisplay').textContent = String(num).padStart(3, '0');
  document.getElementById('bldrDC').textContent = bldrC;
  document.getElementById('bldrDD').textContent = bldrD;
  document.getElementById('bldrDU').textContent = bldrU;
  document.getElementById('bldrTarget').textContent = BLDR_TARGETS[bldrIdx];
}
function bldrChange(slot, n) {
  if (slot === 'c') bldrC = Math.max(0, Math.min(9, bldrC + n));
  else if (slot === 'd') bldrD = Math.max(0, Math.min(9, bldrD + n));
  else bldrU = Math.max(0, Math.min(9, bldrU + n));
  sfx('click'); updateBldr();
}
function checkBldr() {
  const num = bldrC * 100 + bldrD * 10 + bldrU;
  if (num === BLDR_TARGETS[bldrIdx]) { sfx('ok'); launchConfetti(); if (!xpT.bldr.has(bldrIdx)) { xpT.bldr.add(bldrIdx); addXP(4); } fb('fbBldr', '¡Excelente! Formaste el número correctamente! 🎉', true); }
  else { sfx('no'); fb('fbBldr', '¡Casi! Tienes ' + num + ' pero necesitas ' + BLDR_TARGETS[bldrIdx] + '.', false); }
}
function nextBldr() { bldrIdx = (bldrIdx + 1) % BLDR_TARGETS.length; bldrC = 0; bldrD = 0; bldrU = 0; updateBldr(); document.getElementById('fbBldr').className = 'fb'; sfx('click'); }
function resetBldr() { bldrC = 0; bldrD = 0; bldrU = 0; updateBldr(); sfx('click'); }

// ===== WIDGETS: SORT =====
const SORT_GROUPS = [
  [345, 123, 678, 210], [500, 100, 750, 320], [999, 101, 505, 250],
  [630, 460, 820, 170], [415, 900, 205, 735],
];
let sortGroup = 0, sortItems = [];
function renderSort() {
  sortItems = _shuffle([...SORT_GROUPS[sortGroup]]);
  const list = document.getElementById('sortList'); if (!list) return; list.innerHTML = '';
  sortItems.forEach((num, i) => {
    const row = document.createElement('div'); row.className = 'sort-item'; row.dataset.idx = i;
    row.innerHTML = `<div class="sort-arrows"><button class="sort-arrow" onclick="sortMove(${i},-1)" ${i === 0 ? 'disabled' : ''}>▲</button><button class="sort-arrow" onclick="sortMove(${i},1)" ${i === sortItems.length - 1 ? 'disabled' : ''}>▼</button></div><div class="sort-item-num">${num}</div>`;
    list.appendChild(row);
  });
  document.getElementById('fbSort').className = 'fb';
}
function sortMove(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= sortItems.length) return;
  [sortItems[i], sortItems[j]] = [sortItems[j], sortItems[i]];
  renderSort2(); sfx('click');
}
function renderSort2() {
  const list = document.getElementById('sortList'); list.innerHTML = '';
  sortItems.forEach((num, i) => {
    const row = document.createElement('div'); row.className = 'sort-item';
    row.innerHTML = `<div class="sort-arrows"><button class="sort-arrow" onclick="sortMove(${i},-1)" ${i === 0 ? 'disabled' : ''}>▲</button><button class="sort-arrow" onclick="sortMove(${i},1)" ${i === sortItems.length - 1 ? 'disabled' : ''}>▼</button></div><div class="sort-item-num">${num}</div>`;
    list.appendChild(row);
  });
}
function checkSort() {
  const sorted = [...sortItems].sort((a, b) => a - b);
  const allOk = sortItems.every((v, i) => v === sorted[i]);
  document.querySelectorAll('.sort-item').forEach((row, i) => { row.classList.toggle('sort-ok', sortItems[i] === sorted[i]); row.classList.toggle('sort-no', sortItems[i] !== sorted[i]); });
  if (allOk) { sfx('ok'); launchConfetti(); if (!xpT.sort.has(sortGroup)) { xpT.sort.add(sortGroup); addXP(4); } fb('fbSort', '¡Perfecto! Ordenados de menor a mayor! 🎉', true); }
  else { sfx('no'); fb('fbSort', '¡Todavía no! Sigue moviendo los números.', false); }
}
function nextSort() { sortGroup = (sortGroup + 1) % SORT_GROUPS.length; renderSort(); sfx('click'); }

// ===== WIDGETS: COMPARE =====
const COMP_PAIRS = [
  [345, 543], [720, 720], [199, 200], [850, 580], [100, 999],
  [450, 409], [630, 360], [512, 521], [888, 889], [234, 243],
];
let compIdx = 0;
function renderComp() {
  const [a, b] = COMP_PAIRS[compIdx];
  document.getElementById('cmpVisA').textContent = a;
  document.getElementById('cmpVisB').textContent = b;
  const pctA = Math.round((a / 999) * 100), pctB = Math.round((b / 999) * 100);
  document.getElementById('cmpVisBarA').style.width = pctA + '%';
  document.getElementById('cmpVisBarB').style.width = pctB + '%';
  document.getElementById('cmpVisPctA').textContent = a + ' / 999';
  document.getElementById('cmpVisPctB').textContent = b + ' / 999';
  document.querySelectorAll('.cmp-sym-btn').forEach(b => b.classList.remove('cmp-ok', 'cmp-no'));
  document.getElementById('fbComp').className = 'fb';
}
function ansComp(rel) {
  const [a, b] = COMP_PAIRS[compIdx];
  const correct = a > b ? 'gt' : a < b ? 'lt' : 'eq';
  const ok = rel === correct;
  document.querySelectorAll('.cmp-sym-btn').forEach(btn => { if (btn.dataset.rel === rel) btn.classList.add(ok ? 'cmp-ok' : 'cmp-no'); });
  if (ok) { sfx('ok'); if (!xpT.compVis.has(compIdx)) { xpT.compVis.add(compIdx); addXP(3); } fb('fbComp', '¡Correcto! 🎉', true); }
  else { sfx('no'); fb('fbComp', '¡No! Observa las barras para comparar.', false); }
}
function nextComp() { compIdx = (compIdx + 1) % COMP_PAIRS.length; renderComp(); sfx('click'); }

// ===== RETO =====
const RETO_PAIRS = [
  { la: 'Mayor que 500', lb: 'Menor que 500', items: [{ t: '523', a: 'a' }, { t: '300', a: 'b' }, { t: '750', a: 'a' }, { t: '100', a: 'b' }, { t: '999', a: 'a' }, { t: '400', a: 'b' }, { t: '600', a: 'a' }, { t: '250', a: 'b' }, { t: '501', a: 'a' }, { t: '499', a: 'b' }] },
  { la: 'Número par (termina en 0,2,4,6,8)', lb: 'Número impar (termina en 1,3,5,7,9)', items: [{ t: '234', a: 'a' }, { t: '307', a: 'b' }, { t: '560', a: 'a' }, { t: '483', a: 'b' }, { t: '728', a: 'a' }, { t: '191', a: 'b' }, { t: '450', a: 'a' }, { t: '375', a: 'b' }] },
  { la: 'Centena PAR (200,400,600,800)', lb: 'Centena IMPAR (100,300,500,700,900)', items: [{ t: '234', a: 'a' }, { t: '315', a: 'b' }, { t: '620', a: 'a' }, { t: '100', a: 'b' }, { t: '456', a: 'a' }, { t: '700', a: 'b' }, { t: '812', a: 'a' }, { t: '567', a: 'b' }] },
  { la: 'Tiene 0 en las decenas', lb: 'No tiene 0 en las decenas', items: [{ t: '304', a: 'a' }, { t: '345', a: 'b' }, { t: '207', a: 'a' }, { t: '271', a: 'b' }, { t: '500', a: 'a' }, { t: '543', a: 'b' }, { t: '109', a: 'a' }, { t: '198', a: 'b' }] },
];
let retoRunning = false, retoTid = null, retoTimerVal = 30, retoPairIdx = 0, retoItemIdx = 0, retoCorrect = 0, retoErrors = 0, retoItems = [];
function startReto() {
  const pair = RETO_PAIRS[retoPairIdx];
  document.getElementById('retoBtn-a').textContent = pair.la;
  document.getElementById('retoBtn-b').textContent = pair.lb;
  retoItems = _shuffle([...pair.items]); retoItemIdx = 0; retoCorrect = 0; retoErrors = 0;
  retoTimerVal = 30; retoRunning = true;
  document.getElementById('retoWord').textContent = retoItems[0].t;
  document.getElementById('retoScore').textContent = '✅ 0 correctas | ❌ 0 errores';
  clearInterval(retoTid);
  retoTid = setInterval(() => {
    retoTimerVal--;
    document.getElementById('retoTimer').textContent = '⏱ ' + retoTimerVal;
    document.getElementById('retoBarFill').style.width = (retoTimerVal / 30 * 100) + '%';
    document.getElementById('retoBarFill').style.background = retoTimerVal > 10 ? 'var(--jade)' : 'var(--red)';
    if (retoTimerVal <= 0) { clearInterval(retoTid); retoRunning = false; endReto(); }
  }, 1000);
  sfx('click');
}
function ansReto(choice) {
  if (!retoRunning || retoItemIdx >= retoItems.length) return;
  const item = retoItems[retoItemIdx];
  if (choice === item.a) { retoCorrect++; sfx('ok'); } else { retoErrors++; sfx('no'); document.getElementById('gameBox').classList.add('shake-error'); setTimeout(() => document.getElementById('gameBox').classList.remove('shake-error'), 500); }
  document.getElementById('retoScore').textContent = '✅ ' + retoCorrect + ' correctas | ❌ ' + retoErrors + ' errores';
  retoItemIdx++;
  if (retoItemIdx < retoItems.length) document.getElementById('retoWord').textContent = retoItems[retoItemIdx].t;
  else document.getElementById('retoWord').textContent = '¡Terminaste! ⏳';
}
function endReto() {
  document.getElementById('retoWord').textContent = '¡Tiempo! ✅ ' + retoCorrect + ' | ❌ ' + retoErrors;
  const firstTime = !xpT.reto.has(retoPairIdx);
  if (firstTime) { xpT.reto.add(retoPairIdx); addXP(retoCorrect - retoErrors); unlockAchievement('reto_hero'); }
  fb('fbReto', '¡Reto terminado! ' + retoCorrect + ' correctas y ' + retoErrors + ' errores.', retoCorrect > retoErrors);
}
function resetReto() { clearInterval(retoTid); retoRunning = false; retoTimerVal = 30; document.getElementById('retoTimer').textContent = '⏱ 30'; document.getElementById('retoBarFill').style.width = '100%'; document.getElementById('retoWord').textContent = '¡Prepárate!'; document.getElementById('retoScore').textContent = '✅ 0 | ❌ 0'; document.getElementById('fbReto').className = 'fb'; sfx('click'); }
function nextRetoPair() { retoPairIdx = (retoPairIdx + 1) % RETO_PAIRS.length; resetReto(); const pair = RETO_PAIRS[retoPairIdx]; document.getElementById('retoBtn-a').textContent = pair.la; document.getElementById('retoBtn-b').textContent = pair.lb; sfx('click'); }

// ===== SOPA DE LETRAS =====
const SOPA_WORD_SETS = [
  ['CENTENA', 'DECENA', 'UNIDAD', 'CIFRA', 'LEER'],
  ['NUMERO', 'VALOR', 'CIEN', 'MAYOR', 'MENOR'],
  ['COMPONER', 'CONTAR', 'ESCRIBIR', 'FORMA', 'TRES'],
];
let sopaSetIdx = 0, sopaFound = [], sopaData = null, sopaStart = null, sopaGridN = 10;
function makeWordSearch(words, N = 10) {
  const grid = Array.from({ length: N }, () => Array(N).fill(''));
  const placed = [];
  const DIRS = [[0, 1], [1, 0], [1, 1]];
  for (const word of words) {
    let ok = false;
    for (let t = 0; t < 200 && !ok; t++) {
      const [dr, dc] = DIRS[Math.floor(Math.random() * DIRS.length)];
      const r0 = Math.floor(Math.random() * N), c0 = Math.floor(Math.random() * N);
      const r1 = r0 + dr * (word.length - 1), c1 = c0 + dc * (word.length - 1);
      if (r1 < 0 || r1 >= N || c1 < 0 || c1 >= N) continue;
      let canPlace = true;
      for (let i = 0; i < word.length; i++) { const r = r0 + dr * i, c = c0 + dc * i; if (grid[r][c] !== '' && grid[r][c] !== word[i]) { canPlace = false; break; } }
      if (canPlace) { for (let i = 0; i < word.length; i++) grid[r0 + dr * i][c0 + dc * i] = word[i]; placed.push({ word, r: r0, c: c0, dr, dc }); ok = true; }
    }
  }
  const AL = 'ABCDEFGHIJKLMNOPRSTUVXY';
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (grid[r][c] === '') grid[r][c] = AL[Math.floor(Math.random() * AL.length)];
  return { grid, placed };
}
function renderSopa() {
  const words = SOPA_WORD_SETS[sopaSetIdx];
  sopaData = makeWordSearch(words, sopaGridN);
  sopaFound = []; sopaStart = null;
  const wordList = document.getElementById('sopaWords'); wordList.innerHTML = '';
  words.forEach(w => { const span = document.createElement('span'); span.className = 'sopa-w'; span.id = 'sw-' + w; span.textContent = w; wordList.appendChild(span); });
  const gridEl = document.getElementById('sopaGrid'); gridEl.innerHTML = '';
  const cellSize = Math.min(32, Math.floor((window.innerWidth - 48) / sopaGridN));
  gridEl.style.gridTemplateColumns = `repeat(${sopaGridN}, ${cellSize}px)`;
  sopaData.grid.forEach((row, r) => row.forEach((letter, c) => {
    const cell = document.createElement('div'); cell.className = 'sopa-cell';
    cell.style.width = cellSize + 'px'; cell.style.height = cellSize + 'px'; cell.style.fontSize = (cellSize * 0.45) + 'px';
    cell.textContent = letter; cell.dataset.r = r; cell.dataset.c = c;
    cell.onclick = () => sopaClick(r, c);
    gridEl.appendChild(cell);
  }));
  document.getElementById('fbSopa').className = 'fb';
}
function sopaClick(r, c) {
  sfx('click');
  if (!sopaStart) {
    sopaStart = { r, c };
    document.querySelectorAll('.sopa-cell').forEach(el => { if (+el.dataset.r === r && +el.dataset.c === c && !el.classList.contains('sopa-found')) el.classList.add('sopa-sel'); });
    return;
  }
  const r0 = sopaStart.r, c0 = sopaStart.c;
  sopaStart = null;
  document.querySelectorAll('.sopa-cell').forEach(el => { if (!el.classList.contains('sopa-found')) el.classList.remove('sopa-sel'); });
  const dr = Math.sign(r - r0), dc = Math.sign(c - c0);
  const len = Math.max(Math.abs(r - r0), Math.abs(c - c0)) + 1;
  let sel = '';
  for (let i = 0; i < len; i++) sel += sopaData.grid[r0 + dr * i][c0 + dc * i];
  const found = sopaData.placed.find(p => p.word === sel || p.word === [...sel].reverse().join(''));
  if (found && !sopaFound.includes(found.word)) {
    sopaFound.push(found.word);
    for (let i = 0; i < found.word.length; i++) {
      const fr = found.r + found.dr * i, fc = found.c + found.dc * i;
      document.querySelectorAll('.sopa-cell').forEach(el => { if (+el.dataset.r === fr && +el.dataset.c === fc) { el.classList.remove('sopa-sel'); el.classList.add('sopa-found'); } });
    }
    const wEl = document.getElementById('sw-' + found.word);
    if (wEl) wEl.classList.add('found');
    sfx('ok'); if (!xpT.sopa.has(sopaSetIdx + '_' + found.word)) { xpT.sopa.add(sopaSetIdx + '_' + found.word); addXP(1); }
    if (sopaFound.length === SOPA_WORD_SETS[sopaSetIdx].length) { launchConfetti(); fb('fbSopa', '¡Encontraste todas las palabras! 🎉', true); }
    else fb('fbSopa', '¡Encontraste "' + found.word + '"! Sigue buscando.', true);
  }
}
function nextSopaSet() { sopaSetIdx = (sopaSetIdx + 1) % SOPA_WORD_SETS.length; renderSopa(); sfx('click'); }

// ===== TAREAS =====
let tgAnsVisible = false;
function genTask() {
  const type = document.getElementById('tgType').value;
  const count = parseInt(document.getElementById('tgCount').value);
  const nums = Array.from({ length: count }, () => Math.floor(Math.random() * 900) + 100);
  let html = '';
  const instrucciones = {
    identify: { title: '🔍 Identifica el valor posicional', instr: 'Escribe cuántas centenas, decenas y unidades tiene cada número:', tag: 'tt-a' },
    write: { title: '✏️ Lee y escribe los números', instr: 'Escribe cada número con letras (en palabras):', tag: 'tt-b' },
    decompose: { title: '➕ Descompón los números', instr: 'Escribe cada número en forma descompuesta (Centenas + Decenas + Unidades):', tag: 'tt-c' },
    compose: { title: '🔧 Compón los números', instr: 'Forma el número a partir de su descomposición:', tag: 'tt-d' },
    order: { title: '↕️ Ordena los números', instr: 'Escribe estos números de MENOR a MAYOR:', tag: 'tt-e' },
  };
  const cfg = instrucciones[type];
  html += `<div class="tg-instruction-block"><h4>${cfg.title}</h4><p>${cfg.instr}</p></div>`;
  if (type === 'order') {
    const orderNums = Array.from({ length: 5 }, () => Math.floor(Math.random() * 900) + 100);
    html += `<div class="tg-task"><div class="tg-task-num">1</div><span class="tg-task-type ${cfg.tag}">Ordenar</span><div class="tg-task-content">${_shuffle(orderNums).join(' · ')}<br><div class="tg-answer">De menor a mayor: ${[...orderNums].sort((a, b) => a - b).join(' &lt; ')}</div></div></div>`;
  } else {
    nums.forEach((n, i) => {
      const c = Math.floor(n / 100), d = Math.floor((n % 100) / 10), u = n % 10;
      let q = '', ans = '';
      if (type === 'identify') { q = `El número <strong>${n}</strong> tiene: ___ centenas, ___ decenas, ___ unidades`; ans = `${c} centenas, ${d} decenas, ${u} unidades`; }
      else if (type === 'write') { q = `<strong>${n}</strong> = `; ans = numToWords(n); }
      else if (type === 'decompose') { q = `<strong>${n}</strong> = ___ + ___ + ___`; ans = `${c * 100} + ${d * 10} + ${u}`; }
      else if (type === 'compose') { q = `${c * 100} + ${d * 10} + ${u} = ___`; ans = String(n); }
      html += `<div class="tg-task"><div class="tg-task-num">${i + 1}</div><span class="tg-task-type ${cfg.tag}">${type === 'identify' ? 'CDU' : type === 'write' ? 'Leer' : type === 'decompose' ? 'Descomponer' : 'Componer'}</span><div class="tg-task-content">${q}<div class="tg-answer">${ans}</div></div></div>`;
    });
  }
  document.getElementById('tgOut').innerHTML = html;
  tgAnsVisible = false;
  document.querySelectorAll('.tg-answer').forEach(el => el.style.display = 'none');
  sfx('click');
}
function toggleAns() {
  tgAnsVisible = !tgAnsVisible;
  document.querySelectorAll('.tg-answer').forEach(el => el.style.display = tgAnsVisible ? 'block' : 'none');
  sfx('click');
}

// ===== EVALUACIÓN =====
function genEval() {
  evalFormNum++;
  const evalNums = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 900) + 100);
  let html = `<div class="eval-score-bar"><span class="esb-title">📝 Evaluación N° ${evalFormNum}</span><div><span class="eval-score-pill esp-tf">V/F</span> <span class="eval-score-pill esp-mc">Selección</span> <span class="eval-score-pill esp-cp">Completar</span></div></div>`;

  // Sección I: Valor posicional (5 preguntas - selección múltiple)
  html += `<div class="eval-section-title">📌 I. Selección múltiple — Valor Posicional <span class="eval-pts">25 pts (5 c/u)</span></div>`;
  const secI = [
    { q: '¿Cuántas unidades hay en 1 centena?', opts: ['A. 10', 'B. 50', 'C. 100', 'D. 1,000'], ans: 'C' },
    { q: '¿Cuántas decenas forman 1 centena?', opts: ['A. 5', 'B. 10', 'C. 20', 'D. 100'], ans: 'B' },
    { q: '¿Cuál es el valor del dígito 6 en el número ' + (Math.floor(Math.random() * 3 + 6) * 100 + Math.floor(Math.random() * 90) + 10) + '?', opts: ['A. 6', 'B. 60', 'C. 600', 'D. 6,000'], ans: 'C' },
    { q: '¿Cuál es el MENOR número de tres cifras?', opts: ['A. 001', 'B. 099', 'C. 100', 'D. 010'], ans: 'C' },
    { q: '¿Cuál es el MAYOR número de tres cifras?', opts: ['A. 900', 'B. 990', 'C. 998', 'D. 999'], ans: 'D' },
  ];
  secI.forEach((item, i) => {
    html += `<div class="eval-item"><div class="eval-q"><span class="eval-num">${i + 1}</span><div class="eval-q-text">${item.q}<div class="eval-mc-opts">`;
    item.opts.forEach(o => { html += `<div class="eval-mc-opt"><input type="radio" name="si${i}"> ${o}</div>`; });
    html += `</div><div class="eval-answer">${item.ans}</div></div></div></div>`;
  });

  // Sección II: Lectura y escritura (5 preguntas)
  html += `<div class="eval-section-title">✏️ II. Lee y escribe <span class="eval-pts">25 pts (5 c/u)</span></div>`;
  const secIInums = evalNums().concat([Math.floor(Math.random() * 900) + 100]);
  secIInums.slice(0, 3).forEach((n, i) => {
    html += `<div class="eval-item"><div class="eval-q"><span class="eval-num">${i + 6}</span><div class="eval-q-text">Escribe con letras: <strong>${n}</strong> = <span class="eval-blank"></span><div class="eval-answer">${numToWords(n)}</div></div></div></div>`;
  });
  const wordExamples = [{ n: 425, w: 'cuatrocientos veinticinco' }, { n: 308, w: 'trescientos ocho' }];
  wordExamples.forEach((ex, i) => {
    html += `<div class="eval-item"><div class="eval-q"><span class="eval-num">${i + 9}</span><div class="eval-q-text">Escribe el número: "${ex.w}" = <span class="eval-blank"></span><div class="eval-answer">${ex.n}</div></div></div></div>`;
  });

  // Sección III: Composición y descomposición (5 preguntas)
  html += `<div class="eval-section-title">🔢 III. Composición y descomposición <span class="eval-pts">25 pts (5 c/u)</span></div>`;
  const secIIInums = evalNums();
  secIIInums.slice(0, 3).forEach((n, i) => {
    const c = Math.floor(n / 100), d = Math.floor((n % 100) / 10), u = n % 10;
    html += `<div class="eval-item"><div class="eval-q"><span class="eval-num">${i + 11}</span><div class="eval-q-text">Descompón: <strong>${n}</strong> = <span class="eval-blank"></span> + <span class="eval-blank"></span> + <span class="eval-blank"></span><div class="eval-answer">${c * 100} + ${d * 10} + ${u}</div></div></div></div>`;
  });
  [{ c: 4, d: 5, u: 3 }, { c: 7, d: 0, u: 8 }].forEach((p, i) => {
    html += `<div class="eval-item"><div class="eval-q"><span class="eval-num">${i + 14}</span><div class="eval-q-text">Compón: ${p.c * 100} + ${p.d * 10} + ${p.u} = <span class="eval-blank"></span><div class="eval-answer">${p.c * 100 + p.d * 10 + p.u}</div></div></div></div>`;
  });

  // Sección IV: Verdadero / Falso (5 preguntas)
  html += `<div class="eval-section-title">☑️ IV. Verdadero o Falso <span class="eval-pts">25 pts (5 c/u)</span></div>`;
  const vf = [
    { q: '1 centena = 10 decenas', ans: 'Verdadero' },
    { q: 'El número 100 es el menor número de tres cifras', ans: 'Verdadero' },
    { q: 'El valor del 5 en el número 350 es 5', ans: 'Falso (es 50)' },
    { q: 'El número 999 tiene 9 centenas, 9 decenas y 9 unidades', ans: 'Verdadero' },
    { q: 'La descomposición de 206 es: 200 + 60 + 0', ans: 'Falso (es 200 + 0 + 6)' },
  ];
  vf.forEach((item, i) => {
    html += `<div class="eval-item"><div class="eval-q"><span class="eval-num">${i + 16}</span><div class="eval-q-text">${item.q}<div style="display:flex;gap:1.5rem;margin-top:0.5rem;margin-left:1.7rem;"><label><input type="radio" name="vf${i}"> Verdadero</label><label><input type="radio" name="vf${i}"> Falso</label></div><div class="eval-answer">${item.ans}</div></div></div></div>`;
  });

  document.getElementById('evalOut').innerHTML = html;
  evalAnsVisible = false;
  document.querySelectorAll('.eval-answer').forEach(el => el.style.display = 'none');
  saveProgress(); sfx('click');
}
function toggleEvalAns() {
  evalAnsVisible = !evalAnsVisible;
  document.querySelectorAll('.eval-answer').forEach(el => { el.style.display = evalAnsVisible ? 'block' : 'none'; el.classList.toggle('print-show', evalAnsVisible); });
  sfx('click');
}
function printEval() { document.body.classList.add('printing'); window.print(); document.body.classList.remove('printing'); }

// ===== DIPLOMA =====
function openDiploma() {
  const pct = Math.round((xp / MXP) * 100);
  document.getElementById('diplPct').textContent = pct + '%';
  document.getElementById('diplBar').style.width = pct + '%';
  document.getElementById('diplBar').style.background = pct >= 80 ? 'linear-gradient(90deg,var(--jade),var(--pri))' : pct >= 50 ? 'linear-gradient(90deg,var(--sec),var(--amber))' : 'linear-gradient(90deg,var(--red),var(--orange))';
  document.getElementById('diplMsg').textContent = pct >= 80 ? '¡Eres un maestro de los números de tres cifras! 🌟' : pct >= 50 ? '¡Muy buen trabajo! Sigue practicando. 💪' : '¡Sigue adelante! Cada práctica te hace mejor. 🌱';
  document.getElementById('diplStars').textContent = pct >= 80 ? '⭐⭐⭐' : pct >= 50 ? '⭐⭐' : '⭐';
  document.getElementById('diplDate').textContent = new Date().toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById('diplAch').textContent = unlockedAch.length > 0 ? '🏅 Logros: ' + unlockedAch.map(id => ACHIEVEMENTS[id].icon).join(' ') : '';
  document.getElementById('diplomaOverlay').classList.add('open');
  if (pct >= 70) launchConfetti();
  sfx('fan');
}
function closeDiploma() { document.getElementById('diplomaOverlay').classList.remove('open'); sfx('click'); }
function updateDiplomaName(v) { document.getElementById('diplName').textContent = v || 'Estudiante'; }
function shareWA() {
  const name = document.getElementById('diplName').textContent;
  const pct = document.getElementById('diplPct').textContent;
  const msg = encodeURIComponent(`🎓 ¡${name} completó la Misión Números de Tres Cifras!\n⭐ Puntaje XP: ${pct}\n🌐 policastsapien.com`);
  window.open('https://wa.me/?text=' + msg, '_blank');
}

// ===== INIT =====
window.addEventListener('DOMContentLoaded', () => {
  initTheme(); loadProgress(); renderAchPanel();
  go('s-aprende');
  initFC();
  renderQz();
  renderClass();
  renderId();
  renderCmp();
  labUpdate();
  newLabChallenge();
  nlDraw();
  updateBldr();
  renderSort();
  renderComp();
  renderSopa();
  genEval();
  document.getElementById('retoBtn-a').textContent = RETO_PAIRS[0].la;
  document.getElementById('retoBtn-b').textContent = RETO_PAIRS[0].lb;
});
