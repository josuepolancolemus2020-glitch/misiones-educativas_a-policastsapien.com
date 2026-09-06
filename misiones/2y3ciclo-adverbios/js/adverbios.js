// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y puedes poner *tus datos* para que tu maestro observe todos tus logros. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Lengua y Literatura._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
    _waShare(texto);
}

// Función para hacer la letra más grande (Accesibilidad)
function toggleLetra() {
    document.body.classList.toggle('letra-grande');
    if (typeof sfx === 'function') sfx('click');
    const estaActivado = document.body.classList.contains('letra-grande');
    localStorage.setItem('preferenciaLetra', estaActivado);
}
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('preferenciaLetra') === 'true') {
        document.body.classList.add('letra-grande');
    }
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

function fb(id, msg, isOk) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = msg;
        el.className = 'fb show ' + (isOk ? 'ok' : 'err');
    }
}

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'adverbios_v1_basica';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1;
let evalCritFormNum = 1, evalCritAnsVisible = false;
let unlockedAch = [];
let darkMode = false;
let prevLevel = 0;
const TOTAL_SECTIONS = 11;

const xpTracker = {
    fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(),
    cmp: new Set(), reto: new Set(), sopa: new Set(), critWin: new Set(),
};

// ===================== SONIDO =====================
let sndOn = true; let AC = null;
function getAC() { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { } } return AC; }
function sfx(t) {
    if (!sndOn) return;
    try {
        const ac = getAC(); if (!ac) return;
        const g = ac.createGain(); g.connect(ac.destination);
        const o = ac.createOscillator(); o.connect(g);
        if (t === 'click') { o.type = 'sine'; o.frequency.setValueAtTime(800, ac.currentTime); o.frequency.linearRampToValueAtTime(1200, ac.currentTime + 0.1); g.gain.setValueAtTime(0.2, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.12); o.start(); o.stop(ac.currentTime + 0.12); }
        else if (t === 'ok') { [523, 659, 784].forEach((f, i) => { const o2 = ac.createOscillator(); const g2 = ac.createGain(); o2.connect(g2); g2.connect(ac.destination); o2.type = 'triangle'; o2.frequency.value = f; g2.gain.setValueAtTime(0.15, ac.currentTime + i * 0.1); g2.gain.linearRampToValueAtTime(0, ac.currentTime + i * 0.1 + 0.15); o2.start(ac.currentTime + i * 0.1); o2.stop(ac.currentTime + i * 0.1 + 0.15); }); }
        else if (t === 'no') { o.type = 'square'; o.frequency.setValueAtTime(200, ac.currentTime); o.frequency.linearRampToValueAtTime(100, ac.currentTime + 0.2); g.gain.setValueAtTime(0.15, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.2); o.start(); o.stop(ac.currentTime + 0.2); }
        else if (t === 'up') { [523, 659, 784, 1047].forEach((f, i) => { const o2 = ac.createOscillator(); const g2 = ac.createGain(); o2.connect(g2); g2.connect(ac.destination); o2.type = 'triangle'; o2.frequency.value = f; g2.gain.setValueAtTime(0.18, ac.currentTime + i * 0.12); g2.gain.linearRampToValueAtTime(0, ac.currentTime + i * 0.12 + 0.18); o2.start(ac.currentTime + i * 0.12); o2.stop(ac.currentTime + i * 0.12 + 0.18); }); }
        else if (t === 'fan') { [523, 587, 659, 698, 784, 1047].forEach((f, i) => { const o2 = ac.createOscillator(); const g2 = ac.createGain(); o2.connect(g2); g2.connect(ac.destination); o2.type = 'triangle'; o2.frequency.value = f; g2.gain.setValueAtTime(0.15, ac.currentTime + i * 0.1); g2.gain.linearRampToValueAtTime(0, ac.currentTime + i * 0.1 + 0.2); o2.start(ac.currentTime + i * 0.1); o2.stop(ac.currentTime + i * 0.1 + 0.2); }); }
        else if (t === 'flip') { o.type = 'sine'; o.frequency.setValueAtTime(400, ac.currentTime); o.frequency.linearRampToValueAtTime(900, ac.currentTime + 0.15); g.gain.setValueAtTime(0.12, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.18); o.start(); o.stop(ac.currentTime + 0.18); }
        else if (t === 'tick') { o.type = 'sine'; o.frequency.value = 1000; g.gain.setValueAtTime(0.1, ac.currentTime); g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.05); o.start(); o.stop(ac.currentTime + 0.05); }
        else if (t === 'ach') { [880, 1047, 1319].forEach((f, i) => { const o2 = ac.createOscillator(); const g2 = ac.createGain(); o2.connect(g2); g2.connect(ac.destination); o2.type = 'triangle'; o2.frequency.value = f; g2.gain.setValueAtTime(0.2, ac.currentTime + i * 0.12); g2.gain.linearRampToValueAtTime(0, ac.currentTime + i * 0.12 + 0.22); o2.start(ac.currentTime + i * 0.12); o2.stop(ac.currentTime + i * 0.12 + 0.22); }); }
    } catch (e) { }
}
function toggleSnd() { sndOn = !sndOn; document.getElementById('sndBtn').textContent = sndOn ? '🔊 Sonido' : '🔇 Sonido'; }

// ===================== DARK MODE =====================
function toggleTheme() { darkMode = !darkMode; document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light'); document.getElementById('themeBtn').textContent = darkMode ? '☀️ Tema' : '🌙 Tema'; localStorage.setItem(SAVE_KEY + '_theme', darkMode ? 'dark' : 'light'); sfx('click'); }
function initTheme() { const s = localStorage.getItem(SAVE_KEY + '_theme'); const sys = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches; darkMode = (s === 'dark') || (s === null && sys); if (darkMode) { document.documentElement.setAttribute('data-theme', 'dark'); document.getElementById('themeBtn').textContent = '☀️ Tema'; } }

// ===================== LOCALSTORAGE =====================
function saveProgress() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ doneSections: Array.from(done), unlockedAch, evalFormNum, evalCritFormNum, xp })); } catch (e) { }
}
function loadProgress() {
    try {
        const s = JSON.parse(localStorage.getItem(SAVE_KEY));
        if (!s) return;
        if (s.doneSections && Array.isArray(s.doneSections)) s.doneSections.forEach(id => {
            done.add(id);
            const b = document.querySelector(`[data-s="${id}"]`);
            if (b) b.classList.add('done');
        });
        if (s.unlockedAch && Array.isArray(s.unlockedAch)) unlockedAch = s.unlockedAch.filter(id => ACHIEVEMENTS[id] !== undefined);
        if (s.evalFormNum) evalFormNum = s.evalFormNum;
        if (s.evalCritFormNum) evalCritFormNum = s.evalCritFormNum;
        if (s.xp !== undefined) {
            xp = s.xp;
            updateXPBar();
        }
    } catch (e) { }
}
// ===================== ACHIEVEMENTS =====================
let _lecturaApi = null;

const ACHIEVEMENTS = {
    lector_minuto: { icon: '📖', label: 'Primer minuto de lectura cronometrado' },
    lector_banda: { icon: '⏱️', label: 'Leíste dentro de la banda de tu grado' },
    cazador_adverbios: { icon: '🎯', label: 'Cazaste todos los adverbios de una lectura' },
    primer_quiz: { icon: '🧠', label: 'Primera prueba superada' },
    flash_master: { icon: '🃏', label: 'Todas las flashcards vistas' },
    clasif_pro: { icon: '🗂️', label: 'Clasificador experto' },
    id_master: { icon: '🔍', label: 'Identificador maestro' },
    reto_hero: { icon: '🏆', label: 'Héroe del reto final' },
    nivel3: { icon: '🔭', label: '¡Explorador alcanzado! Nivel 3' },
    nivel5: { icon: '🥇', label: '¡Campeón alcanzado! Nivel 6' }
};
function unlockAchievement(id) {
    if (unlockedAch.includes(id)) return;
    unlockedAch.push(id);
    sfx('ach');
    showToast(ACHIEVEMENTS[id].icon + ' ¡Logro desbloqueado! ' + ACHIEVEMENTS[id].label);
    launchConfetti();
    renderAchPanel();
    saveProgress();
}
function renderAchPanel() {
    const list = document.getElementById('achList'); list.innerHTML = '';
    Object.entries(ACHIEVEMENTS).forEach(([id, a]) => {
        const div = document.createElement('div');
        div.className = 'ach-item' + (unlockedAch.includes(id) ? '' : ' locked');
        div.innerHTML = `<span class="ach-icon">${a.icon}</span><span>${a.label}</span>`;
        list.appendChild(div);
    });
}
function toggleAchPanel() { sfx('click'); document.getElementById('achPanel').classList.toggle('open'); }
function showToast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.style.display = 'block';
    clearTimeout(t._tid);
    t._tid = setTimeout(() => t.style.display = 'none', 3200);
}
function launchConfetti() {
    const colors = ['#0097a7', '#c49000', '#00b894', '#fdcb6e', '#6c5ce7'];
    for (let i = 0; i < 60; i++) {
        const c = document.createElement('div'); c.className = 'confetti-piece';
        c.style.cssText = `left:${Math.random() * 100}vw;background:${colors[Math.floor(Math.random() * colors.length)]};animation-duration:${0.8 + Math.random() * 1.5}s;animation-delay:${Math.random() * 0.4}s;width:${6 + Math.random() * 6}px;height:${6 + Math.random() * 6}px;border-radius:${Math.random() > 0.5 ? '50%' : '2px'};`;
        document.body.appendChild(c);
        c.addEventListener('animationend', () => c.remove());
    }
}

// ===================== XP =====================
const lvls = [{ t: 0, n: 'Novato ✏️' }, { t: 25, n: 'Aprendiz 📝' }, { t: 55, n: 'Explorador 🔭' }, { t: 90, n: 'Detective 🔍' }, { t: 130, n: 'Experto 🌟' }, { t: 165, n: 'Campeón 🥇' }, { t: 190, n: 'Maestro 🏆' }];
function pts(n) {
    xp = Math.max(0, Math.min(MXP, xp + n));
    updateXPBar();
    saveProgress();
}
function updateXPBar() {
    const pct = Math.round((xp / MXP) * 100);
    document.getElementById('xpFill').style.width = pct + '%';
    const el = document.getElementById('xpPts');
    el.textContent = '⭐ ' + xp;
    el.style.transform = 'scale(1.3)';
    setTimeout(() => el.style.transform = '', 300);
    let lv = 0;
    for (let i = 0; i < lvls.length; i++) if (xp >= lvls[i].t) lv = i;
    document.getElementById('xpLvl').textContent = lvls[lv].n;
    if (lv !== prevLevel) { if (lv >= 2) unlockAchievement('nivel3'); if (lv >= 5) unlockAchievement('nivel5'); prevLevel = lv; }
}
function resetXP() {
    sfx('click'); xp = 0; updateXPBar();
    showToast('🔄 XP reiniciado a 0');
}
function fin(id, showFX = true) {
    if (!done.has(id)) {
        done.add(id);
        const b = document.querySelector(`[data-s="${id}"]`);
        if (b) b.classList.add('done');
        if (showFX) { sfx('up'); launchConfetti(); }
        saveProgress();
    }
}
function getProgress() { return Math.round((done.size / TOTAL_SECTIONS) * 100); }

// ===================== NAV =====================
function go(id) {
  /* El cronómetro no puede seguir corriendo detrás de otra pestaña. */
  if (id !== 's-lectura' && _lecturaApi) _lecturaApi.soltar();
    sfx('click');
    document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-t[role="tab"]').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    document.getElementById(id).classList.add('active');
    const btn = document.querySelector(`[data-s="${id}"]`);
    if (btn) { btn.classList.add('active'); btn.setAttribute('aria-selected', 'true'); }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (id === 's-sopa') {
        setTimeout(buildSopa, 50);
    }
}

// ===================== FLASHCARD DATA =====================
const fcData = [
    { w: 'Adverbio', a: '🧭 Palabra <strong>invariable</strong> que modifica al verbo, a un adjetivo o a otro adverbio. No cambia de género ni número.' },
    { w: 'Adverbio de Lugar', a: '📍 Indica dónde ocurre la acción. Ej: <strong>aquí, allí, cerca, lejos, dentro, fuera</strong>.' },
    { w: 'Adverbio de Tiempo', a: '⏰ Indica cuándo ocurre la acción. Ej: <strong>hoy, ayer, mañana, siempre, nunca, pronto</strong>.' },
    { w: 'Adverbio de Modo', a: '🎯 Indica cómo se realiza la acción. Ej: <strong>bien, mal, así, rápidamente, despacio</strong>.' },
    { w: 'Adverbio de Cantidad', a: '⚖️ Indica la intensidad o cantidad. Ej: <strong>mucho, poco, muy, bastante, demasiado</strong>.' },
    { w: 'Adverbio de Afirmación', a: '✅ Confirma lo que se expresa. Ej: <strong>sí, también, claro, efectivamente</strong>.' },
    { w: 'Adverbio de Negación', a: '❌ Niega lo que se expresa. Ej: <strong>no, nunca, jamás, tampoco</strong>.' },
    { w: 'Adverbio de Duda', a: '❓ Expresa posibilidad o incertidumbre. Ej: <strong>quizás, tal vez, acaso, posiblemente</strong>.' },
    { w: 'Sufijo "-mente"', a: '🔧 Se agrega al adjetivo en su forma <strong>femenina</strong> para formar un adverbio de modo. Ej: lenta → <strong>lentamente</strong>.' },
    { w: 'Adverbio vs Adjetivo', a: '⚔️ El adjetivo <strong>concuerda</strong> en género y número ("niña rápida"). El adverbio es <strong>invariable</strong> ("corre rápido").' },
    { w: 'Adverbios en serie', a: '🔗 Cuando hay dos o más adverbios en -mente seguidos, <strong>solo el último</strong> conserva el sufijo. Ej: "Habló clara y <strong>precisamente</strong>".' },
];
let fcIdx = 0;
function upFC() {
    document.getElementById('fcInner').classList.remove('flipped');
    document.getElementById('fcW').textContent = fcData[fcIdx].w;
    document.getElementById('fcA').innerHTML = fcData[fcIdx].a;
    document.getElementById('fcCtr').textContent = (fcIdx + 1) + ' / ' + fcData.length;
}
function flipCard() {
    sfx('flip');
    document.getElementById('fcInner').classList.toggle('flipped');
    if (!xpTracker.fc.has(fcIdx)) { xpTracker.fc.add(fcIdx); pts(1); }
    if (xpTracker.fc.size === fcData.length) { fin('s-flash'); unlockAchievement('flash_master'); }
}
function nextFC() { sfx('click'); fcIdx = (fcIdx + 1) % fcData.length; upFC(); }
function prevFC() { sfx('click'); fcIdx = (fcIdx - 1 + fcData.length) % fcData.length; upFC(); }

// ===================== QUIZ DATA =====================
const qzData = [
    { q: '¿Cuál es la función principal de un adverbio?', o: ['a) Sustituir al sustantivo', 'b) Modificar al verbo, a un adjetivo o a otro adverbio', 'c) Indicar género y número', 'd) Unir dos oraciones'], c: 1 },
    { q: '"Juan corre RÁPIDO". ¿Qué clase de adverbio es "rápido"?', o: ['a) Lugar', 'b) Tiempo', 'c) Modo', 'd) Cantidad'], c: 2 },
    { q: '"Te veré MAÑANA". ¿Qué clase de adverbio es "mañana"?', o: ['a) Lugar', 'b) Tiempo', 'c) Modo', 'd) Duda'], c: 1 },
    { q: '"El gato está AQUÍ". ¿Qué clase de adverbio es "aquí"?', o: ['a) Lugar', 'b) Tiempo', 'c) Cantidad', 'd) Negación'], c: 0 },
    { q: '"Como MUCHO los fines de semana". ¿Qué clase de adverbio es "mucho"?', o: ['a) Modo', 'b) Cantidad', 'c) Afirmación', 'd) Lugar'], c: 1 },
    { q: '"SÍ, iré contigo". ¿Qué clase de adverbio es "sí"?', o: ['a) Afirmación', 'b) Negación', 'c) Duda', 'd) Modo'], c: 0 },
    { q: '"NUNCA lo haré". ¿Qué clase de adverbio es "nunca"?', o: ['a) Afirmación', 'b) Negación', 'c) Tiempo', 'd) Lugar'], c: 1 },
    { q: '"QUIZÁS llueva mañana". ¿Qué clase de adverbio es "quizás"?', o: ['a) Duda', 'b) Negación', 'c) Cantidad', 'd) Modo'], c: 0 },
    { q: '¿Cuál es el adverbio formado a partir del adjetivo "feliz"?', o: ['a) Felizamente', 'b) Felizmente', 'c) Felizemente', 'd) Felicidad'], c: 1 },
    { q: '"Es un corredor RÁPIDO" vs "Corre RÁPIDO". ¿Cuál es la diferencia?', o: ['a) Ninguna, ambos son adverbios', 'b) El 1ero es adverbio, el 2do es adjetivo', 'c) El 1ero es adjetivo (concuerda), el 2do es adverbio (invariable)', 'd) Ambos son sustantivos'], c: 2 },
];
let qzIdx = 0, qzSel = -1, qzDone = false;
function buildQz() { qzIdx = 0; qzSel = -1; qzDone = false; showQz(); }
function showQz() {var _fbQ=document.getElementById('fbQz');if(_fbQ)_fbQ.classList.remove('show');
    if (qzIdx >= qzData.length) {
        document.getElementById('qzQ').textContent = '🎉 ¡Quiz completado!';
        document.getElementById('qzOpts').innerHTML = '';
        fin('s-quiz'); unlockAchievement('primer_quiz'); return;
    }
    const q = qzData[qzIdx];
    document.getElementById('qzProg').textContent = `Pregunta ${qzIdx + 1} de ${qzData.length}`;
    document.getElementById('qzQ').textContent = q.q;
    const opts = document.getElementById('qzOpts'); opts.innerHTML = '';
    q.o.forEach((o, i) => {
        const b = document.createElement('button'); b.className = 'qz-opt'; b.textContent = o;
        b.onclick = () => { if (qzDone) return; document.querySelectorAll('.qz-opt').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); qzSel = i; sfx('click'); };
        opts.appendChild(b);
    });
    qzDone = false;
}
// El quiz ya NO avanza solo a los 1,6 s. Con el avance automático, el alumno que
// fallaba veía la respuesta correcta medio segundo y desaparecía antes de poder
// leerla; y el «Incorrecto» se quedaba colgado debajo de la pregunta SIGUIENTE,
// que todavía no había contestado. Ahora avanza él, cuando ya la leyó.
function nextQz(){
  if(!qzDone)return fb('fbQz','Primero toca «Verificar».',false);
  qzIdx++; qzSel=-1; qzDone=false; showQz();
}
function checkQz() {
    if (qzSel < 0) return fb('fbQz', 'Selecciona una respuesta.', false);
    qzDone = true;
    const opts = document.querySelectorAll('.qz-opt');
    if (qzSel === qzData[qzIdx].c) {
        opts[qzSel].classList.add('correct');
        fb('fbQz', '¡Correcto! +5 XP', true);
        if (!xpTracker.qz.has(qzIdx)) { xpTracker.qz.add(qzIdx); pts(5); }
        sfx('ok');
    } else {
        opts[qzSel].classList.add('wrong'); opts[qzData[qzIdx].c].classList.add('correct');
        fb('fbQz', 'Incorrecto. Revisa la respuesta correcta.', false); sfx('no');
    }
    
}
function resetQz() {
    sfx('click');
    qzIdx = 0; qzSel = -1; qzDone = false;
    showQz();
    document.getElementById('fbQz').classList.remove('show');
}

// ===================== CLASIFICACIÓN =====================
const classGroups = [
    {
        label: ['Lugar', 'Tiempo'], headA: '📍 Lugar', headB: '⏰ Tiempo', colA: 'lugar', colB: 'tiempo',
        words: [{ w: 'aquí', t: 'lugar' }, { w: 'hoy', t: 'tiempo' }, { w: 'allí', t: 'lugar' }, { w: 'ayer', t: 'tiempo' }, { w: 'cerca', t: 'lugar' }, { w: 'mañana', t: 'tiempo' }, { w: 'lejos', t: 'lugar' }, { w: 'siempre', t: 'tiempo' }, { w: 'dentro', t: 'lugar' }, { w: 'nunca', t: 'tiempo' }]
    },
    {
        label: ['Modo', 'Cantidad'], headA: '🎯 Modo', headB: '⚖️ Cantidad', colA: 'modo', colB: 'cantidad',
        words: [{ w: 'bien', t: 'modo' }, { w: 'mucho', t: 'cantidad' }, { w: 'mal', t: 'modo' }, { w: 'poco', t: 'cantidad' }, { w: 'rápidamente', t: 'modo' }, { w: 'muy', t: 'cantidad' }, { w: 'despacio', t: 'modo' }, { w: 'bastante', t: 'cantidad' }, { w: 'así', t: 'modo' }, { w: 'demasiado', t: 'cantidad' }]
    },
    {
        label: ['Afirmación', 'Negación'], headA: '✅ Afirmación', headB: '❌ Negación', colA: 'afirmación', colB: 'negación',
        words: [{ w: 'sí', t: 'afirmación' }, { w: 'no', t: 'negación' }, { w: 'también', t: 'afirmación' }, { w: 'nunca', t: 'negación' }, { w: 'claro', t: 'afirmación' }, { w: 'jamás', t: 'negación' }, { w: 'efectivamente', t: 'afirmación' }, { w: 'tampoco', t: 'negación' }, { w: 'ciertamente', t: 'afirmación' }, { w: 'nada', t: 'negación' }]
    },
    {
        label: ['Duda', 'Modo'], headA: '❓ Duda', headB: '🎯 Modo', colA: 'duda', colB: 'modo',
        words: [{ w: 'quizás', t: 'duda' }, { w: 'bien', t: 'modo' }, { w: 'tal vez', t: 'duda' }, { w: 'mal', t: 'modo' }, { w: 'acaso', t: 'duda' }, { w: 'despacio', t: 'modo' }, { w: 'posiblemente', t: 'duda' }, { w: 'así', t: 'modo' }, { w: 'probablemente', t: 'duda' }, { w: 'rápido', t: 'modo' }]
    },
];
let currentClassGroupIdx = 0;
let clsSelectedWord = null;

function buildClass() {
    const group = classGroups[currentClassGroupIdx];
    document.getElementById('col-left-head').textContent = group.headA;
    document.getElementById('col-right-head').textContent = group.headB;
    const bank = document.getElementById('clsBank'); bank.innerHTML = '';
    clsSelectedWord = null;
    document.getElementById('items-left').innerHTML = '';
    document.getElementById('items-right').innerHTML = '';
    _shuffle([...group.words]).forEach(w => {
        const el = document.createElement('div'); el.className = 'wb-item'; el.textContent = w.w; el.dataset.t = w.t;
        el.onclick = () => { document.querySelectorAll('.wb-item').forEach(i => i.classList.remove('sel-word')); el.classList.add('sel-word'); clsSelectedWord = el; sfx('click'); };
        bank.appendChild(el);
    });
    ['col-left', 'col-right'].forEach(colId => {
        const col = document.getElementById(colId);
        col.onclick = (e) => {
            if (!clsSelectedWord || e.target.classList.contains('drop-item')) return;
            const targetId = colId === 'col-left' ? 'items-left' : 'items-right';
            const wordsCol = document.getElementById(targetId);
            const item = document.createElement('div'); item.className = 'drop-item';
            item.textContent = clsSelectedWord.textContent; item.dataset.t = clsSelectedWord.dataset.t;
            const original = clsSelectedWord;
            item.onclick = (ev) => {
                ev.stopPropagation();
                if (clsSelectedWord !== null) {
                    col.click();
                } else {
                    document.getElementById('clsBank').appendChild(original);
                    original.classList.remove('sel-word');
                    item.remove();
                    if (typeof sfx === 'function') sfx('click');
                }
            };
            wordsCol.appendChild(item); clsSelectedWord.remove(); clsSelectedWord = null; sfx('click');
        };
    });
}
function checkClass() {
    const remaining = document.querySelectorAll('#clsBank .wb-item').length;
    if (remaining > 0) { fb('fbCls', 'Mueve todas las palabras a las columnas primero.', false); return; }
    const group = classGroups[currentClassGroupIdx]; let allOk = true;
    document.querySelectorAll('#items-left .drop-item,#items-right .drop-item').forEach(el => {
        const inLeft = el.parentElement.id === 'items-left';
        const expectedType = inLeft ? group.colA : group.colB;
        if (el.dataset.t === expectedType) { el.classList.add('cls-ok'); } else { el.classList.add('cls-no'); allOk = false; }
    });
    if (!xpTracker.cls.has(currentClassGroupIdx)) { xpTracker.cls.add(currentClassGroupIdx); pts(5); }
    if (allOk) { fb('fbCls', '¡Perfecto! +5 XP', true); sfx('fan'); fin('s-clasifica'); unlockAchievement('clasif_pro'); }
    else { fb('fbCls', 'Hay errores. Marcados en rojo.', false); sfx('no'); }
}
function nextClassGroup() {
    sfx('click');
    currentClassGroupIdx = (currentClassGroupIdx + 1) % classGroups.length;
    buildClass(); document.getElementById('fbCls').classList.remove('show');
    showToast('🔄 Grupo: ' + classGroups[currentClassGroupIdx].label[0] + ' vs ' + classGroups[currentClassGroupIdx].label[1]);
}
function resetClass() { sfx('click'); buildClass(); document.getElementById('fbCls').classList.remove('show'); }

// ===================== IDENTIFICAR =====================
const idData = [
    { s: ['Iremos', 'al', 'parque', 'mañana.'], c: 3, art: 'Adverbio de tiempo' },
    { s: ['El', 'gato', 'duerme', 'aquí.'], c: 3, art: 'Adverbio de lugar' },
    { s: ['Ella', 'canta', 'bien.'], c: 2, art: 'Adverbio de modo' },
    { s: ['Comimos', 'demasiado', 'en', 'la', 'fiesta.'], c: 1, art: 'Adverbio de cantidad' },
    { s: ['Sí,', 'iré', 'a', 'la', 'reunión.'], c: 0, art: 'Adverbio de afirmación' },
    { s: ['Nunca', 'llegamos', 'tarde.'], c: 0, art: 'Adverbio de negación' },
    { s: ['Quizás', 'vengan', 'mis', 'primos.'], c: 0, art: 'Adverbio de duda' },
    { s: ['Habló', 'clara', 'y', 'precisamente.'], c: [1, 3], art: 'Adverbios de modo en serie (solo el último lleva -mente)' },
];
let idIdx = 0;
let idDone = false;
function showId() {
    idDone = false;
    if (idIdx >= idData.length) {
        document.getElementById('idSent').innerHTML = '🎉 ¡Completado!';
        fin('s-identifica'); unlockAchievement('id_master'); return;
    }
    const d = idData[idIdx];
    document.getElementById('idProg').textContent = `Oración ${idIdx + 1} de ${idData.length}`;
    document.getElementById('idInfo').textContent = `Busca: ${d.art}` + (Array.isArray(d.c) ? ` (hay ${d.c.length} en esta oración)` : '');
    const sent = document.getElementById('idSent'); sent.innerHTML = '';
    d.s.forEach((w, i) => {
        const span = document.createElement('span'); span.className = 'id-word'; span.textContent = w + ' ';
        span.onclick = () => checkId(i, span);
        sent.appendChild(span);
    });
}
function checkId(i, span) {
    if (idDone) return;

    document.querySelectorAll('.id-word').forEach(s => s.classList.remove('selected'));
    span.classList.add('selected');

    const correct = idData[idIdx].c;
    const isArray = Array.isArray(correct);
    const isCorrect = isArray ? correct.includes(i) : i === correct;

    if (isCorrect) {
        idDone = true;
        span.classList.add('id-ok');
        if (isArray) {
            const allWords = document.querySelectorAll('.id-word');
            correct.forEach(ci => { if (ci !== i) allWords[ci].classList.add('id-ok'); });
            const others = correct.filter(ci => ci !== i)
                .map(ci => '"' + idData[idIdx].s[ci].replace(/[,.]$/, '') + '"').join(' y ');
            fb('fbId', `¡Correcto! +5 XP — ${others} también es ${idData[idIdx].art.toLowerCase()} en esta oración.`, true);
        } else {
            fb('fbId', '¡Correcto! +5 XP', true);
        }
        if (!xpTracker.id.has(idIdx)) { xpTracker.id.add(idIdx); pts(5); }
        sfx('ok');
    } else {
        span.classList.add('id-no'); fb('fbId', 'Ese no es el adverbio solicitado.', false); sfx('no');
    }
}
function nextId() { sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId() { sfx('click'); idIdx = 0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData = [
    { s: 'Vivo muy ___ de la escuela.', opts: ['cerca', 'ayer', 'sí'], c: 0 },
    { s: 'Ella habla ___ con sus amigos.', opts: ['amablemente', 'allí', 'hoy'], c: 0 },
    { s: '___, lo haré con gusto.', opts: ['Sí', 'Lejos', 'Despacio'], c: 0 },
    { s: 'No quiero comer ___ de ese postre.', opts: ['nada', 'aquí', 'bien'], c: 0 },
    { s: '___ lloverá esta tarde.', opts: ['Quizás', 'Bien', 'Aquí'], c: 0 },
    { s: 'Comimos ___ en la fiesta de cumpleaños.', opts: ['demasiado', 'jamás', 'allí'], c: 0 },
    { s: 'El examen estuvo ___ difícil.', opts: ['bastante', 'ayer', 'sí'], c: 0 },
    { s: 'Mi hermano ___ llega tarde a clases.', opts: ['nunca', 'aquí', 'mucho'], c: 0 },
];
let cmpIdx = 0, cmpSel = -1, cmpDone = false;
function showCmp() {var _fbC=document.getElementById('fbCmp');if(_fbC)_fbC.classList.remove('show');
    if (cmpIdx >= cmpData.length) {
        document.getElementById('cmpSent').innerHTML = '🎉 ¡Completado!';
        document.getElementById('cmpOpts').innerHTML = '';
        fin('s-completa'); return;
    }
    const d = cmpData[cmpIdx];
    document.getElementById('cmpProg').textContent = `Oración ${cmpIdx + 1} de ${cmpData.length}`;
    document.getElementById('cmpSent').innerHTML = d.s.replace('___', '<span class="blank">___</span>');
    const opts = document.getElementById('cmpOpts'); opts.innerHTML = ''; cmpSel = -1; cmpDone = false;
    d.opts.forEach((o, i) => {
        const b = document.createElement('button'); b.className = 'cmp-opt'; b.textContent = o;
        b.onclick = () => { if (cmpDone) return; document.querySelectorAll('.cmp-opt').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); cmpSel = i; sfx('click'); };
        opts.appendChild(b);
    });
}
// Misma razón que en el quiz: la corrección se lee, no se persigue.
function nextCmp(){
  if(!cmpDone)return fb('fbCmp','Primero toca «Verificar».',false);
  cmpIdx++; cmpSel=-1; cmpDone=false; showCmp();
}
function checkCmp() {
    if (cmpSel < 0) return fb('fbCmp', 'Selecciona una opción.', false);
    cmpDone = true;
    const opts = document.querySelectorAll('.cmp-opt');
    if (cmpSel === cmpData[cmpIdx].c) {
        opts[cmpSel].classList.add('correct');
        document.getElementById('cmpSent').innerHTML = cmpData[cmpIdx].s.replace('___', `<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);
        fb('fbCmp', '¡Correcto! +5 XP', true);
        if (!xpTracker.cmp.has(cmpIdx)) { xpTracker.cmp.add(cmpIdx); pts(5); }
        sfx('ok');
    } else {
        opts[cmpSel].classList.add('wrong'); opts[cmpData[cmpIdx].c].classList.add('correct');
        fb('fbCmp', 'Incorrecto. Fíjate bien en el concepto.', false); sfx('no');
    }
    
}

// ===================== RETO FINAL =====================
const retoPairs = [
    {
        label: ['Lugar', 'Tiempo'], btnA: '📍 Lugar', btnB: '⏰ Tiempo',
        colA: 'lugar', colB: 'tiempo',
        words: [
            { w: 'aquí', t: 'lugar' }, { w: 'hoy', t: 'tiempo' }, { w: 'allí', t: 'lugar' },
            { w: 'ayer', t: 'tiempo' }, { w: 'cerca', t: 'lugar' }, { w: 'mañana', t: 'tiempo' },
            { w: 'lejos', t: 'lugar' }, { w: 'siempre', t: 'tiempo' }, { w: 'dentro', t: 'lugar' },
            { w: 'nunca', t: 'tiempo' }, { w: 'fuera', t: 'lugar' }, { w: 'pronto', t: 'tiempo' },
        ]
    },
    {
        label: ['Modo', 'Cantidad'], btnA: '🎯 Modo', btnB: '⚖️ Cantidad',
        colA: 'modo', colB: 'cantidad',
        words: [
            { w: 'bien', t: 'modo' }, { w: 'mucho', t: 'cantidad' }, { w: 'mal', t: 'modo' }, { w: 'poco', t: 'cantidad' },
            { w: 'despacio', t: 'modo' }, { w: 'muy', t: 'cantidad' }, { w: 'así', t: 'modo' }, { w: 'bastante', t: 'cantidad' },
            { w: 'rápido', t: 'modo' }, { w: 'demasiado', t: 'cantidad' }, { w: 'lentamente', t: 'modo' }, { w: 'casi', t: 'cantidad' },
        ]
    },
];
let currentRetoPairIdx = 0;
let retoPool = [], retoOk = 0, retoErr = 0, retoTimerInt = null, retoSec = 30, retoRunning = false, retoCurrent = null;

function updateRetoButtons() {
    const pair = retoPairs[currentRetoPairIdx];
    document.querySelectorAll('.reto-btns .btn')[0].textContent = pair.btnA;
    document.querySelectorAll('.reto-btns .btn')[1].textContent = pair.btnB;
    document.querySelectorAll('.reto-btns .btn')[0].onclick = () => ansReto(pair.colA);
    document.querySelectorAll('.reto-btns .btn')[1].onclick = () => ansReto(pair.colB);
}
function startReto() {
    if (retoRunning) return;
    sfx('click'); retoRunning = true; retoOk = 0; retoErr = 0; retoSec = 30;
    retoPool = _shuffle([...retoPairs[currentRetoPairIdx].words, ...retoPairs[currentRetoPairIdx].words]);
    showRetoWord();
    retoTimerInt = setInterval(() => {
        retoSec--; sfx('tick');
        document.getElementById('retoTimer').textContent = '⏱ ' + retoSec;
        if (retoSec <= 10) document.getElementById('retoTimer').style.color = 'var(--red)';
        if (retoSec <= 0) { clearInterval(retoTimerInt); endReto(); }
    }, 1000);
}
function showRetoWord() {
    if (retoPool.length === 0) retoPool = _shuffle([...retoPairs[currentRetoPairIdx].words, ...retoPairs[currentRetoPairIdx].words]);
    retoCurrent = retoPool.pop();
    document.getElementById('retoWord').textContent = retoCurrent.w;
}
function ansReto(t) {
    if (!retoRunning || !retoCurrent) return;
    const firstPlay = !xpTracker.reto.has(currentRetoPairIdx);
    if (t === retoCurrent.t) { sfx('ok'); retoOk++; if (firstPlay) pts(1); }
    else { sfx('no'); retoErr++; if (firstPlay) pts(-1); }
    document.getElementById('retoScore').textContent = `✅ ${retoOk} correctas | ❌ ${retoErr} errores`;
    showRetoWord();
}
function endReto() {
    retoRunning = false;
    document.getElementById('retoWord').textContent = '🏁 ¡Tiempo!';
    document.getElementById('retoTimer').style.color = 'var(--pri)';
    xpTracker.reto.add(currentRetoPairIdx);
    const total = retoOk + retoErr;
    const pct = total > 0 ? Math.round((retoOk / total) * 100) : 0;
    fb('fbReto', `Resultado: ${retoOk}/${total} (${pct}%) ¡Bien hecho!`, true);
    fin('s-reto'); sfx('fan'); unlockAchievement('reto_hero');
}
function nextRetoPair() {
    sfx('click'); clearInterval(retoTimerInt); retoRunning = false; retoSec = 30; retoOk = 0; retoErr = 0;
    currentRetoPairIdx = (currentRetoPairIdx + 1) % retoPairs.length;
    updateRetoButtons();
    document.getElementById('retoTimer').textContent = '⏱ 30';
    document.getElementById('retoTimer').style.color = 'var(--pri)';
    document.getElementById('retoWord').textContent = '¡Prepárate!';
    document.getElementById('retoScore').textContent = '✅ 0 correctas | ❌ 0 errores';
    document.getElementById('fbReto').classList.remove('show');
    showToast(`🔀 Pareja: ${retoPairs[currentRetoPairIdx].label[0]} vs ${retoPairs[currentRetoPairIdx].label[1]}`);
}
function resetReto() {
    sfx('click'); clearInterval(retoTimerInt); retoRunning = false; retoSec = 30; retoOk = 0; retoErr = 0;
    document.getElementById('retoTimer').textContent = '⏱ 30';
    document.getElementById('retoTimer').style.color = 'var(--pri)';
    document.getElementById('retoWord').textContent = '¡Prepárate!';
    document.getElementById('retoScore').textContent = '✅ 0 correctas | ❌ 0 errores';
    document.getElementById('fbReto').classList.remove('show');
}

// ===================== TASK GENERATOR =====================
const identifyTaskDB = [
    { s: 'El avión llegó tarde.', type: 'Adverbio de tiempo (tarde)' },
    { s: 'Vivimos cerca del parque.', type: 'Adverbio de lugar (cerca)' },
    { s: 'Ella canta muy bien.', type: 'Adverbio de cantidad (muy) / Adverbio de modo (bien)' },
    { s: 'Sí, asistiré a la reunión.', type: 'Adverbio de afirmación (Sí)' },
    { s: 'Nunca llegamos tarde a clases.', type: 'Adverbio de negación (Nunca)' },
    { s: 'Quizás llueva esta tarde.', type: 'Adverbio de duda (Quizás)' },
    { s: 'El perro corre rápidamente.', type: 'Adverbio de modo (rápidamente)' },
    { s: 'Comimos demasiado en la fiesta.', type: 'Adverbio de cantidad (demasiado)' },
    { s: 'Mi abuela vive lejos de aquí.', type: 'Adverbio de lugar (lejos, aquí)' },
    { s: 'Tampoco quiero ir al cine hoy.', type: 'Adverbio de negación (Tampoco) / Adverbio de tiempo (hoy)' },
];
const classifyTaskDB = [
    { w: 'aquí', tipo: 'Lugar' },
    { w: 'mañana', tipo: 'Tiempo' },
    { w: 'despacio', tipo: 'Modo' },
    { w: 'bastante', tipo: 'Cantidad' },
    { w: 'también', tipo: 'Afirmación' },
    { w: 'jamás', tipo: 'Negación' },
    { w: 'acaso', tipo: 'Duda' },
    { w: 'felizmente', tipo: 'Modo (formado con -mente)' },
];
const completeTaskDB = [
    { s: 'Vivo muy ___ de la escuela.', opts: ['cerca', 'hoy', 'sí'], ans: 'cerca' },
    { s: 'Mi hermana habla ___ con todos.', opts: ['amablemente', 'allí', 'ayer'], ans: 'amablemente' },
    { s: '___, iré contigo a la fiesta.', opts: ['Sí', 'Lejos', 'Despacio'], ans: 'Sí' },
    { s: 'No quiero comer ___ de ese postre.', opts: ['nada', 'aquí', 'bien'], ans: 'nada' },
    { s: '___ lloverá esta tarde.', opts: ['Quizás', 'Bien', 'Aquí'], ans: 'Quizás' },
    { s: 'Comimos ___ en el cumpleaños.', opts: ['demasiado', 'jamás', 'allí'], ans: 'demasiado' },
    { s: 'El examen estuvo ___ difícil.', opts: ['bastante', 'ayer', 'sí'], ans: 'bastante' },
    { s: 'Mi hermano ___ llega tarde a clases.', opts: ['nunca', 'aquí', 'mucho'], ans: 'nunca' },
];
const explainQuestions = [
    { q: '¿Qué es un adverbio y para qué sirve?', ans: 'Es una palabra invariable que modifica al verbo, a un adjetivo o a otro adverbio.' },
    { q: '¿Cuál es la diferencia entre un adjetivo y un adverbio?', ans: 'El adjetivo concuerda en género y número con el sustantivo; el adverbio es invariable.' },
    { q: '¿Cómo se forman los adverbios de modo terminados en -mente? Da un ejemplo.', ans: 'Se agrega "-mente" al adjetivo en su forma femenina. Ej: lenta → lentamente.' },
    { q: 'Menciona tres tipos de adverbios y un ejemplo de cada uno.', ans: 'Lugar (aquí), Tiempo (ayer), Modo (bien), Cantidad (mucho), entre otros.' },
    { q: '¿Qué ocurre cuando hay dos o más adverbios en -mente seguidos en una oración?', ans: 'Solo el último conserva el sufijo "-mente"; los anteriores se usan en su forma de adjetivo femenino.' },
];
let ansVisible = false;

function genTask() {
    sfx('click');
    const type = document.getElementById('tgType').value;
    const count = parseInt(document.getElementById('tgCount').value);
    ansVisible = false;
    const out = document.getElementById('tgOut'); out.innerHTML = '';

    if (type === 'identify') genIdentifyTask(out, count);
    else if (type === 'classify') genClassifyTask(out, count);
    else if (type === 'complete') genCompleteTask(out, count);
    else if (type === 'explain') genExplainTask(out, count);
    fin('s-tareas');
}

function _instrBlock(out, title, lines) {
    const ib = document.createElement('div'); ib.className = 'tg-instruction-block';
    ib.innerHTML = `<h4>📌 ${title}</h4>` + lines.map(l => `<p>${l}</p>`).join('');
    out.appendChild(ib);
}

function genIdentifyTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia en tu cuaderno; subraya, colorea o encierra el adverbio en las siguientes oraciones. Escribe al lado qué tipo de adverbio es.', '<strong>Ejemplo:</strong> El avión llegó tarde. → <span style="color:var(--jade);font-weight:700;">Adverbio de tiempo (tarde)</span>']);
    _pick(identifyTaskDB, Math.min(count, identifyTaskDB.length)).forEach((item, i) => {
        const div = document.createElement('div'); div.className = 'tg-task';
        div.innerHTML = `<div class="tg-task-num">${i + 1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
        out.appendChild(div);
    });
}

function genClassifyTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia la siguiente tabla en tu cuaderno. Para cada adverbio, escribe a qué tipo pertenece.']);
    const items = _pick(classifyTaskDB, Math.min(count, classifyTaskDB.length));
    const wrap = document.createElement('div'); wrap.style.overflowX = 'auto';
    const th = (t, extra = '') => `<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;
    let html = `<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:420px;"><thead><tr style="background:var(--pri-gl);">${th('Adverbio', 'text-align:left;')}${th('Tipo')}</tr></thead><tbody>`;
    items.forEach(it => {
        html += `<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td><td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td></tr>`;
    });
    html += '</tbody></table>';
    wrap.innerHTML = html; out.appendChild(wrap);
    const ans = document.createElement('div'); ans.className = 'tg-answer'; ans.style.marginTop = '0.8rem';
    ans.innerHTML = '<strong>✅ Respuestas:</strong><br>' + items.map(it => `<strong>${it.w}:</strong> ${it.tipo}`).join('<br>');
    out.appendChild(ans);
}

function genCompleteTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige y escribe la opción correcta.']);
    const pool = _shuffle([...completeTaskDB]);
    for (let i = 0; i < count; i++) {
        const item = pool[i % pool.length];
        const div = document.createElement('div'); div.className = 'tg-task';
        const sent = item.s.replace('___', '<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
        div.innerHTML = `<div class="tg-task-num">${i + 1}</div><div class="tg-task-content"><strong>${sent}</strong><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📋 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;
        out.appendChild(div);
    }
}

function genExplainTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia las siguientes preguntas en tu cuaderno y responde cada una de forma clara.']);
    const pool = _shuffle([...explainQuestions]);
    for (let i = 0; i < count; i++) {
        const item = pool[i % pool.length];
        const div = document.createElement('div'); div.className = 'tg-task';
        div.innerHTML = `<div class="tg-task-num">${i + 1}</div><div class="tg-task-content"><strong>${item.q}</strong><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div style="border-bottom:1.5px solid var(--border);min-width:200px;margin-top:0.3rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.ans}</div></div>`;
        out.appendChild(div);
    }
}

function toggleAns() { ansVisible = !ansVisible; document.querySelectorAll('.tg-answer').forEach(el => el.style.display = ansVisible ? 'block' : 'none'); sfx('click'); }

// ===================== SOPA DE LETRAS =====================
const sopaSets = [
    {
        size: 10,
        grid: [
            ['A', 'D', 'V', 'E', 'R', 'B', 'I', 'O', 'X', 'C'],
            ['K', 'P', 'L', 'M', 'N', 'B', 'V', 'C', 'X', 'A'],
            ['L', 'U', 'G', 'A', 'R', 'Z', 'Q', 'W', 'E', 'N'],
            ['H', 'J', 'K', 'L', 'P', 'O', 'I', 'U', 'Y', 'T'],
            ['T', 'I', 'E', 'M', 'P', 'O', 'S', 'D', 'F', 'I'],
            ['G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'D'],
            ['M', 'O', 'D', 'O', 'B', 'N', 'M', 'Q', 'W', 'A'],
            ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'D'],
            ['D', 'U', 'D', 'A', 'S', 'F', 'G', 'H', 'J', 'K'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Q', 'W', 'E'],
        ],
        words: [
            { w: 'ADVERBIO', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]] },
            { w: 'LUGAR', cells: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
            { w: 'TIEMPO', cells: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5]] },
            { w: 'MODO', cells: [[6, 0], [6, 1], [6, 2], [6, 3]] },
            { w: 'CANTIDAD', cells: [[0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9]] },
            { w: 'DUDA', cells: [[8, 0], [8, 1], [8, 2], [8, 3]] },
        ]
    },
    {
        size: 10,
        grid: [
            ['S', 'I', 'E', 'M', 'P', 'R', 'E', 'X', 'Y', 'C'],
            ['Q', 'W', 'Z', 'X', 'V', 'B', 'N', 'M', 'L', 'E'],
            ['N', 'U', 'N', 'C', 'A', 'T', 'Y', 'U', 'I', 'R'],
            ['H', 'J', 'K', 'O', 'P', 'A', 'S', 'D', 'F', 'C'],
            ['G', 'H', 'J', 'K', 'L', 'Z', 'X', 'V', 'B', 'A'],
            ['L', 'E', 'J', 'O', 'S', 'N', 'M', 'Q', 'W', 'E'],
            ['R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D'],
            ['M', 'U', 'C', 'H', 'O', 'F', 'G', 'H', 'J', 'K'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Q', 'W', 'E'],
            ['B', 'I', 'E', 'N', 'R', 'T', 'Y', 'U', 'I', 'O'],
        ],
        words: [
            { w: 'SIEMPRE', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6]] },
            { w: 'NUNCA', cells: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
            { w: 'CERCA', cells: [[0, 9], [1, 9], [2, 9], [3, 9], [4, 9]] },
            { w: 'LEJOS', cells: [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4]] },
            { w: 'MUCHO', cells: [[7, 0], [7, 1], [7, 2], [7, 3], [7, 4]] },
            { w: 'BIEN', cells: [[9, 0], [9, 1], [9, 2], [9, 3]] },
        ]
    }
];
let currentSopaSetIdx = 0, sopaFoundWords = new Set();
let sopaFirstClickCell = null, sopaPointerStartCell = null, sopaPointerMoved = false, sopaSelectedCells = [];

function getSopaCellSize() {
    const container = document.getElementById('sopaGrid');
    if (!container || !container.parentElement) return 28;
    const avail = container.parentElement.clientWidth - 16;
    const set = sopaSets[currentSopaSetIdx];
    return Math.max(20, Math.min(32, Math.floor(avail / set.size)));
}
function buildSopa() {
    const set = sopaSets[currentSopaSetIdx];
    const grid = document.getElementById('sopaGrid'); grid.innerHTML = '';
    const sz = getSopaCellSize();
    grid.style.gridTemplateColumns = `repeat(${set.size},${sz}px)`;
    grid.style.gridTemplateRows = `repeat(${set.size},${sz}px)`;
    sopaFirstClickCell = null; sopaSelectedCells = [];
    for (let r = 0; r < set.size; r++) for (let c = 0; c < set.size; c++) {
        const cell = document.createElement('div'); cell.className = 'sopa-cell';
        cell.style.width = sz + 'px'; cell.style.height = sz + 'px';
        cell.style.fontSize = Math.max(11, sz - 10) + 'px';
        cell.textContent = set.grid[r][c]; cell.dataset.row = r; cell.dataset.col = c;
        const alreadyFound = set.words.find(w => sopaFoundWords.has(w.w) && w.cells.some(([wr, wc]) => wr === r && wc === c));
        if (alreadyFound) cell.classList.add('sopa-found');
        grid.appendChild(cell);
    }
    setupSopaEvents();
    const wl = document.getElementById('sopaWords'); wl.innerHTML = '';
    set.words.forEach(wObj => {
        const sp = document.createElement('span'); sp.className = 'sopa-w' + (sopaFoundWords.has(wObj.w) ? ' found' : '');
        sp.id = 'sw-' + wObj.w; sp.textContent = wObj.w; wl.appendChild(sp);
    });
}
function setupSopaEvents() {
    const grid = document.getElementById('sopaGrid');
    grid.onpointerdown = e => {
        const cell = e.target.closest('.sopa-cell'); if (!cell) return;
        e.preventDefault(); grid.setPointerCapture(e.pointerId);
        sopaPointerStartCell = cell; sopaPointerMoved = false;
        cell.classList.add('sopa-sel'); sopaSelectedCells = [cell];
    };
    grid.onpointermove = e => {
        if (!sopaPointerStartCell) return; e.preventDefault();
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const cell = el ? el.closest('.sopa-cell') : null; if (!cell) return;
        const sr = parseInt(sopaPointerStartCell.dataset.row), sc = parseInt(sopaPointerStartCell.dataset.col);
        const er = parseInt(cell.dataset.row), ec = parseInt(cell.dataset.col);
        if (sr !== er || sc !== ec) sopaPointerMoved = true;
        document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c => c.classList.remove('sopa-sel'));
        sopaSelectedCells = [];
        getSopaPath(sr, sc, er, ec).forEach(([r, c]) => {
            const pc = document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
            if (pc) { pc.classList.add('sopa-sel'); sopaSelectedCells.push(pc); }
        });
    };
    grid.onpointerup = e => {
        if (!sopaPointerStartCell) return; e.preventDefault();
        grid.releasePointerCapture(e.pointerId);
        if (sopaPointerMoved && sopaSelectedCells.length > 1) {
            checkSopaSelection();
        } else {
            const cell = sopaPointerStartCell;
            document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c => c.classList.remove('sopa-sel'));
            sopaSelectedCells = [];
            if (!sopaFirstClickCell) { sopaFirstClickCell = cell; cell.classList.add('sopa-start'); }
            else if (sopaFirstClickCell === cell) { cell.classList.remove('sopa-start'); sopaFirstClickCell = null; }
            else {
                const sr = parseInt(sopaFirstClickCell.dataset.row), sc = parseInt(sopaFirstClickCell.dataset.col);
                const er = parseInt(cell.dataset.row), ec = parseInt(cell.dataset.col);
                sopaFirstClickCell.classList.remove('sopa-start'); sopaFirstClickCell = null;
                getSopaPath(sr, sc, er, ec).forEach(([r, c]) => {
                    const pc = document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
                    if (pc) { pc.classList.add('sopa-sel'); sopaSelectedCells.push(pc); }
                });
                checkSopaSelection();
            }
        }
        sopaPointerStartCell = null; sopaPointerMoved = false;
    };
}
function getSopaPath(r1, c1, r2, c2) {
    const dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1);
    const lr = Math.abs(r2 - r1), lc = Math.abs(c2 - c1);
    if (lr !== 0 && lc !== 0 && lr !== lc) return [[r1, c1]];
    const len = Math.max(lr, lc); const path = [];
    for (let i = 0; i <= len; i++) path.push([r1 + dr * i, c1 + dc * i]);
    return path;
}
function checkSopaSelection() {
    const set = sopaSets[currentSopaSetIdx];
    const word = sopaSelectedCells.map(c => c.textContent).join('');
    const wordRev = word.split('').reverse().join('');
    const found = set.words.find(wObj => !sopaFoundWords.has(wObj.w) && (wObj.w === word || wObj.w === wordRev));
    if (found) {
        sopaFoundWords.add(found.w);
        found.cells.forEach(([r, c]) => {
            const cell = document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
            if (cell) { cell.classList.remove('sopa-sel', 'sopa-start'); cell.classList.add('sopa-found'); }
        });
        const sp = document.getElementById('sw-' + found.w); if (sp) sp.classList.add('found');
        if (!xpTracker.sopa.has(found.w)) { xpTracker.sopa.add(found.w); pts(1); }
        sfx('ok');
        if (sopaFoundWords.size === set.words.length) { fin('s-sopa'); sfx('fan'); showToast('🎉 ¡Todas las palabras encontradas!'); }
        else showToast('✅ ¡Encontraste: ' + found.w + '!');
    } else sfx('no');
    document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c => c.classList.remove('sopa-sel'));
    sopaSelectedCells = [];
}
function nextSopaSet() {
    sfx('click'); sopaFoundWords = new Set();
    currentSopaSetIdx = (currentSopaSetIdx + 1) % sopaSets.length;
    buildSopa(); showToast('🔄 Nueva sopa cargada');
}

let _sopaResizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(_sopaResizeTimer); _sopaResizeTimer = setTimeout(() => { if (document.getElementById('s-sopa').classList.contains('active')) buildSopa(); }, 200);
});

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank = [
    { q: 'El adverbio modifica al verbo, al adjetivo o a otro adverbio.', a: true },
    { q: 'El adverbio cambia de género y número según la palabra que acompaña.', a: false },
    { q: '"Aquí" y "allí" son adverbios de lugar.', a: true },
    { q: '"Hoy" y "ayer" son adverbios de modo.', a: false },
    { q: 'Muchos adverbios de modo se forman agregando el sufijo "-mente" al adjetivo femenino.', a: true },
    { q: '"Mucho" y "poco" son adverbios de cantidad.', a: true },
    { q: '"Sí" y "también" son adverbios de negación.', a: false },
    { q: '"Nunca" y "jamás" son adverbios de negación.', a: true },
    { q: '"Quizás" y "tal vez" son adverbios de duda.', a: true },
    { q: 'Cuando hay dos adverbios en -mente seguidos, ambos deben llevar el sufijo completo.', a: false },
    { q: 'El adverbio "rápidamente" se forma a partir del adjetivo "rápida" más el sufijo "-mente".', a: true },
    { q: '"Bien" y "mal" son adverbios de modo.', a: true },
    { q: 'El adverbio "lejos" indica tiempo.', a: false },
    { q: 'El adverbio es una palabra invariable.', a: true },
    { q: '"Bastante" y "demasiado" pueden funcionar como adverbios de cantidad.', a: true },
];
const evalMCBank = [
    { q: '¿Cuál es la función del adverbio en la oración?', o: ['a) Sustituir al sustantivo', 'b) Modificar al verbo, adjetivo u otro adverbio', 'c) Indicar género y número', 'd) Unir oraciones'], a: 1 },
    { q: '"Llegó TARDE a la reunión". La palabra en mayúsculas es adverbio de:', o: ['a) Lugar', 'b) Modo', 'c) Tiempo', 'd) Cantidad'], a: 2 },
    { q: '"Vive CERCA del colegio". La palabra en mayúsculas es adverbio de:', o: ['a) Tiempo', 'b) Lugar', 'c) Cantidad', 'd) Duda'], a: 1 },
    { q: '"Estudia MUCHO para el examen". La palabra en mayúsculas es adverbio de:', o: ['a) Modo', 'b) Negación', 'c) Cantidad', 'd) Afirmación'], a: 2 },
    { q: '"SÍ, iré a la fiesta". La palabra en mayúsculas es adverbio de:', o: ['a) Afirmación', 'b) Negación', 'c) Duda', 'd) Lugar'], a: 0 },
    { q: '"NUNCA llega temprano". La palabra en mayúsculas es adverbio de:', o: ['a) Afirmación', 'b) Negación', 'c) Tiempo', 'd) Modo'], a: 1 },
    { q: '"QUIZÁS venga mañana". La palabra en mayúsculas es adverbio de:', o: ['a) Duda', 'b) Negación', 'c) Lugar', 'd) Cantidad'], a: 0 },
    { q: '¿Cuál de estos es un adverbio de modo?', o: ['a) Mucho', 'b) Aquí', 'c) Lentamente', 'd) Hoy'], a: 2 },
    { q: '¿Cómo se forma el adverbio a partir del adjetivo "feliz"?', o: ['a) Felizmente', 'b) Felizamente', 'c) Felizemente', 'd) Felicidad'], a: 0 },
    { q: '"Es un niño MUY inteligente". La palabra en mayúsculas es adverbio de:', o: ['a) Modo', 'b) Cantidad', 'c) Tiempo', 'd) Lugar'], a: 1 },
    { q: '¿Cuál de estos NO es un adverbio de tiempo?', o: ['a) Ayer', 'b) Siempre', 'c) Despacio', 'd) Pronto'], a: 2 },
    { q: '"Tampoco" es un adverbio de:', o: ['a) Afirmación', 'b) Negación', 'c) Duda', 'd) Modo'], a: 1 },
    { q: 'El adverbio es una palabra:', o: ['a) Variable en género', 'b) Variable en número', 'c) Invariable', 'd) Solo se usa en plural'], a: 2 },
    { q: '"Habló clara y precisamente". ¿Por qué "clara" no lleva "-mente"?', o: ['a) Es un error', 'b) Porque modifica a un sustantivo', 'c) Porque en una serie de adverbios en -mente, solo el último lleva el sufijo', 'd) Porque es un adjetivo'], a: 2 },
    { q: '¿Cuál de estos es un adverbio de cantidad?', o: ['a) Bastante', 'b) Jamás', 'c) Aquí', 'd) Bien'], a: 0 },
];
const evalCPBank = [
    { q: 'La función del ___ es modificar al verbo, al adjetivo o a otro adverbio.', a: 'adverbio' },
    { q: 'El adverbio es una palabra ___, no cambia de género ni número.', a: 'invariable' },
    { q: 'Los adverbios de ___ indican dónde ocurre la acción (aquí, allí, cerca).', a: 'lugar' },
    { q: 'Los adverbios de ___ indican cuándo ocurre la acción (hoy, ayer, siempre).', a: 'tiempo' },
    { q: 'Los adverbios de ___ indican cómo se realiza la acción (bien, mal, así).', a: 'modo' },
    { q: 'Los adverbios de ___ indican la intensidad de la acción (mucho, poco, muy).', a: 'cantidad' },
    { q: '"Sí" y "también" son adverbios de ___.', a: 'afirmación' },
    { q: '"No", "nunca" y "jamás" son adverbios de ___.', a: 'negación' },
    { q: '"Quizás" y "tal vez" son adverbios de ___.', a: 'duda' },
    { q: 'Muchos adverbios de modo se forman agregando el sufijo "___" al adjetivo en femenino.', a: 'mente' },
    { q: 'El adverbio formado a partir de "lenta" es "lenta___".', a: 'mente' },
    { q: 'Cuando hay varios adverbios en -mente seguidos, solo el ___ conserva el sufijo completo.', a: 'último' },
    { q: '"Rápido" puede funcionar como adjetivo o como ___ según la oración.', a: 'adverbio' },
    { q: 'El adverbio "lejos" pertenece a la clase de adverbios de ___.', a: 'lugar' },
    { q: 'El adverbio "bastante" pertenece a la clase de adverbios de ___.', a: 'cantidad' },
];
const evalPRBank = [
    { term: 'Adverbio de Lugar', def: 'Indica dónde ocurre la acción (aquí, allí, cerca, lejos)' },
    { term: 'Adverbio de Tiempo', def: 'Indica cuándo ocurre la acción (hoy, ayer, siempre, nunca)' },
    { term: 'Adverbio de Modo', def: 'Indica cómo se realiza la acción (bien, mal, así, rápidamente)' },
    { term: 'Adverbio de Cantidad', def: 'Indica la intensidad o cantidad (mucho, poco, muy, bastante)' },
    { term: 'Adverbio de Afirmación', def: 'Confirma lo expresado (sí, también, claro)' },
    { term: 'Adverbio de Negación', def: 'Niega lo expresado (no, nunca, jamás, tampoco)' },
    { term: 'Adverbio de Duda', def: 'Expresa posibilidad o incertidumbre (quizás, tal vez, acaso)' },
    { term: 'Sufijo -mente', def: 'Se agrega al adjetivo femenino para formar un adverbio de modo' },
    { term: 'Invariabilidad', def: 'Característica del adverbio de no cambiar en género ni número' },
    { term: 'Adverbios en serie', def: 'Cuando hay varios adverbios en -mente juntos, solo el último lleva el sufijo' },
    { term: 'Adjetivo vs Adverbio', def: 'El adjetivo concuerda en género y número; el adverbio es invariable' },
    { term: 'Locución adverbial', def: 'Grupo de palabras que funciona como un solo adverbio (ej: tal vez, de repente)' },
    { term: 'Modificador', def: 'Función principal del adverbio: complementa al verbo, adjetivo u otro adverbio' },
    { term: 'Adverbio interrogativo', def: 'Adverbio usado para preguntar (dónde, cuándo, cómo, cuánto)' },
    { term: 'Adverbio exclamativo', def: 'Adverbio usado en exclamaciones (qué, cuán, cuánto)' },
];

// ══════════ Formas deterministas v1 (M.E.T.A.S, jul 2026) ══════════
// La Forma N genera SIEMPRE el mismo examen y la misma pauta («bucle exacto»),
// en cualquier navegador y aunque se cierre el programa. PRNG mulberry32
// (aritmética entera exacta) + barajado Fisher-Yates. ⚠️ NO usar
// sort(() => rng() - 0.5): el resultado depende del motor del navegador.
// ⚠️ Editar los bancos de preguntas CAMBIA el contenido de todas las formas.
const EVAL_FORMAS = 30;
function _evalRng(forma) {
    let s = (forma * 2654435761 + 909090909) >>> 0;
    return function () {
        s = (s + 0x6D2B79F5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const _shuffleF = (arr, rng) => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const tmp = a[i]; a[i] = a[j]; a[j] = tmp; } return a; };
const _pickF = (arr, n, rng) => _shuffleF(arr, rng).slice(0, n);
// Selector «Forma exacta»: el docente elige qué forma generar (p.ej. para
// reimprimir la pauta de la Forma 15 que ya repartió a los alumnos).
function _injectFormaSel(fnName, selId, actual, onPick) {
    const ya = document.getElementById(selId);
    if (ya) { ya.value = String(actual); return; }
    const btn = document.querySelector('[onclick*="' + fnName + '()"]');
    if (!btn || !btn.parentNode) return;
    const wrap = document.createElement('label');
    wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin:0 8px 6px 0;font-weight:700;font-size:0.95rem;';
    let ops = '';
    for (let i = 1; i <= EVAL_FORMAS; i++) ops += '<option value="' + i + '"' + (i === actual ? ' selected' : '') + '>Forma ' + i + '</option>';
    wrap.innerHTML = '📋 <select id="' + selId + '" style="padding:6px 10px;border-radius:8px;border:2px solid #888;font-weight:700;font-size:0.95rem;background:#fff;color:#222;" aria-label="Elegir número de forma exacta (1 a ' + EVAL_FORMAS + ')">' + ops + '</select>';
    btn.parentNode.insertBefore(wrap, btn);
    const sel = wrap.querySelector('select');
    if (sel) sel.addEventListener('change', function () { onPick(parseInt(this.value, 10) || 1); try { saveProgress(); } catch (e) { } });
}
function _evalFormaSelector() { _injectFormaSel('genEval', 'evalFormaSel', evalFormNum, function (v) { evalFormNum = v; }); }

function genEval() {
    sfx('click');
    _evalFormaSelector(); const _selF = document.getElementById('evalFormaSel'); if (_selF && parseInt(_selF.value, 10)) evalFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_selF.value, 10))); const cf = evalFormNum; const rng = _evalRng(cf); /* la Forma cf siembra TODO el azar de esta evaluación */
    window._currentEvalForm = cf;
    evalFormNum = (evalFormNum % EVAL_FORMAS) + 1; _evalFormaSelector();
    saveProgress();
    document.getElementById('eval-screen-title').textContent = `📝 Evaluación Final — Forma ${cf} · Los Adverbios`;
    evalAnsVisible = false;
    const out = document.getElementById('evalOut'); out.innerHTML = '';
    const bar = document.createElement('div'); bar.className = 'eval-score-bar';
    bar.innerHTML = `<div><div class="esb-title">📊 Distribución de puntaje — 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;
    out.appendChild(bar);
    const cpItems = _pickF(evalCPBank, 5, rng);
    const s1 = document.createElement('div'); s1.innerHTML = '<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
    cpItems.forEach((item, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.dataset.evalType = 'cp'; d.dataset.evalIndex = i; const qHtml = item.q.replace('___', `<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`); d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`; s1.appendChild(d); });
    out.appendChild(s1);
    const tfItems = _pickF(evalTFBank, 5, rng);
    const s2 = document.createElement('div'); s2.innerHTML = '<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
    tfItems.forEach((item, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.dataset.evalType = 'tf'; d.dataset.evalIndex = i; d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a ? 'Verdadero' : 'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`; s2.appendChild(d); });
    out.appendChild(s2);
    const mcItems = _pickF(evalMCBank, 5, rng);
    const s3 = document.createElement('div'); s3.innerHTML = '<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
    mcItems.forEach((item, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.dataset.evalType = 'mc'; d.dataset.evalIndex = i; const optsHtml = item.o.map((op, oi) => `<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join(''); d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`; s3.appendChild(d); });
    out.appendChild(s3);
    const prItems = _pickF(evalPRBank, 5, rng); const shuffledDefs = _shuffleF(prItems, rng); const letters = ['A', 'B', 'C', 'D', 'E'];
    const s4 = document.createElement('div'); s4.innerHTML = '<div class="eval-section-title">IV. Términos Pareados <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
    const matchCard = document.createElement('div'); matchCard.className = 'eval-item';
    let colLeft = '<div class="eval-match-col"><h4>📌 Términos</h4>';
    prItems.forEach((item, i) => { colLeft += `<div class="eval-match-item"><span class="eval-match-letter">${i + 16}.</span> <select class="eval-match-select" data-pr="${i}" aria-label="Respuesta pareada ${i + 16}"><option value="">—</option>${letters.map(l => `<option value="${l}">${l}</option>`).join('')}</select> ${item.term}</div>`; });
    colLeft += '</div>';
    let colRight = '<div class="eval-match-col"><h4>🔑 Definiciones</h4>';
    shuffledDefs.forEach((item, i) => { colRight += `<div class="eval-match-item"><span class="eval-match-letter">${letters[i]}.</span> ${item.def}</div>`; });
    colRight += '</div>';
    const ansKey = prItems.map((item, i) => { const letter = letters[shuffledDefs.findIndex(d => d.def === item.def)]; return `${i + 16}→${letter}`; }).join(' · ');
    matchCard.innerHTML = `<div class="eval-match-grid">${colLeft}${colRight}</div><div class="eval-answer" style="display:none;">${ansKey}</div><div class="eval-item-feedback" id="evalFbPr" aria-live="polite"></div>`;
    s4.appendChild(matchCard); out.appendChild(s4);
    window._evalPrintData = { tf: tfItems, mc: mcItems, cp: cpItems, pr: { terms: prItems, shuffledDefs, letters } };
    const autoPanel = document.createElement('div'); autoPanel.id = 'evalAutoResult'; autoPanel.className = 'eval-auto-result'; autoPanel.innerHTML = '<strong>🧮 Evaluación interactiva:</strong> responde en pantalla y presiona <em>Calificar prueba</em>. La impresión conserva el formato original sin respuestas digitadas.'; out.appendChild(autoPanel);
    fin('s-evaluacion');
}
function toggleEvalAns() {
    evalAnsVisible = !evalAnsVisible;
    document.querySelectorAll('#evalOut .eval-answer').forEach(el => el.style.display = evalAnsVisible ? 'block' : 'none');
    sfx('click');
}
function normalizeEvalAnswer(v) {
    return (v || '').toString().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').replace(/[()]/g, '').trim();
}
function isCpCorrect(student, expected) {
    const s = normalizeEvalAnswer(student);
    const e = normalizeEvalAnswer(expected);
    if (!s) return false;
    const variants = new Set([e]);
    if (e.includes(' ')) e.split(' ').forEach(x => x && variants.add(x));
    return variants.has(s) || e.replace(/[^a-z0-9]/g, '') === s.replace(/[^a-z0-9]/g, '');
}
function setEvalFeedback(id, ok, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.className = 'eval-item-feedback ' + (ok ? 'eval-ok' : 'eval-no');
}
function gradeEval() {
    if (!window._evalPrintData) { showToast('⚠️ Genera una evaluación primero'); return; }
    sfx('click');
    const d = window._evalPrintData;
    let total = 0;
    const detail = { cp: 0, tf: 0, mc: 0, pr: 0 };
    d.cp.forEach((it, i) => {
        const input = document.querySelector(`[data-cp="${i}"]`);
        const ok = isCpCorrect(input ? input.value : '', it.a);
        if (input) { input.classList.toggle('eval-input-ok', ok); input.classList.toggle('eval-input-no', !ok); }
        if (ok) { detail.cp++; total += 5; }
        setEvalFeedback('evalFbCp' + i, ok, ok ? 'Correcto. +5 pts' : 'Revisar. Respuesta esperada: ' + it.a);
    });
    d.tf.forEach((it, i) => {
        const selected = document.querySelector(`input[name="tf${i}"]:checked`);
        const ok = !!selected && (selected.value === 'true') === it.a;
        if (ok) { detail.tf++; total += 5; }
        setEvalFeedback('evalFbTf' + i, ok, ok ? 'Correcto. +5 pts' : 'Revisar. Respuesta esperada: ' + (it.a ? 'Verdadero' : 'Falso'));
    });
    d.mc.forEach((it, i) => {
        const selected = document.querySelector(`input[name="mc${i}"]:checked`);
        const ok = !!selected && Number(selected.value) === it.a;
        if (ok) { detail.mc++; total += 5; }
        setEvalFeedback('evalFbMc' + i, ok, ok ? 'Correcto. +5 pts' : 'Revisar. Respuesta esperada: ' + it.o[it.a]);
    });
    const expectedLetters = d.pr.terms.map(it => d.pr.letters[d.pr.shuffledDefs.findIndex(df => df.def === it.def)]);
    expectedLetters.forEach((letter, i) => {
        const sel = document.querySelector(`[data-pr="${i}"]`);
        const ok = !!sel && sel.value === letter;
        if (sel) { sel.classList.toggle('eval-input-ok', ok); sel.classList.toggle('eval-input-no', !ok); }
        if (ok) { detail.pr++; total += 5; }
    });
    const prMsg = `Pareados: ${detail.pr}/5 correctos. ${detail.pr === 5 ? 'Excelente. +25 pts' : 'Clave: ' + expectedLetters.map((l, i) => (i + 16) + '→' + l).join(' · ')}`;
    setEvalFeedback('evalFbPr', detail.pr === 5, prMsg);
    const result = document.getElementById('evalAutoResult');
    if (result) {
        result.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk');
        result.innerHTML = `<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Completar: ${detail.cp * 5}/25 · V/F: ${detail.tf * 5}/25 · Selección: ${detail.mc * 5}/25 · Pareados: ${detail.pr * 5}/25</span><br><em>Este resultado es solo para revisión en pantalla; la impresión conserva el formato limpio para papel.</em>`;
    }
    if (total >= 70) { pts(8); showToast('🎯 Evaluación calificada: ' + total + '/100'); }
    else showToast('🧮 Evaluación calificada: ' + total + '/100. Revisa las respuestas marcadas.');
}
function printEval() {
    if (!window._evalPrintData) { showToast('⚠️ Genera una evaluación primero'); return; }
    sfx('click');
    const forma = window._currentEvalForm || 1;
    const d = window._evalPrintData;

    // ── I. Completar el espacio (preguntas 1-5)
    let s1 = '<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>';
    d.cp.forEach((it, i) => { const q = it.q.replace('___', '<span class="cp-blank"></span>'); s1 += `<div class="cp-row"><span class="qn">${i + 1}.</span><span class="cp-text">${q}</span></div>`; });

    // ── II. Verdadero o Falso (preguntas 6-10)
    let s2 = '<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>';
    d.tf.forEach((it, i) => { s2 += `<div class="tf-row"><span class="qn">${i + 6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`; });

    // ── III. Selección Múltiple (preguntas 11-15)
    let s3 = '<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">';
    d.mc.forEach((it, i) => { const opts = it.o.map((op, oi) => `<label class="mc-opt"><input type="radio" name="mcp${i}"> ${op}</label>`).join(''); s3 += `<div class="mc-item"><div class="mc-q"><span class="qn">${i + 11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`; });
    s3 += '</div>';

    // ── IV. Términos Pareados (preguntas 16-20)
    let colL = '<div class="pr-col"><div class="pr-head">📌 Términos</div>';
    d.pr.terms.forEach((it, i) => { colL += `<div class="pr-item"><span class="pr-num">${i + 16}.</span><span class="pr-line"></span>${it.term}</div>`; });
    colL += '</div>';
    let colR = '<div class="pr-col"><div class="pr-head">🔑 Definiciones</div>';
    d.pr.shuffledDefs.forEach((it, i) => { colR += `<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`; });
    colR += '</div>';
    let s4 = `<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;

    // ── Pauta
    let pR = '';
    pR += `<div class="p-sec"><div class="p-ttl">I. Completar</div><table class="p-tbl">`;
    d.cp.forEach((it, i) => { pR += `<tr><td class="pn">${i + 1}.</td><td class="pa">${it.a}</td></tr>`; });
    pR += `</table></div><div class="p-sec"><div class="p-ttl">II. V o F</div><table class="p-tbl">`;
    d.tf.forEach((it, i) => { pR += `<tr><td class="pn">${i + 6}.</td><td class="pa">${it.a ? 'V' : 'F'}</td></tr>`; });
    pR += `</table></div><div class="p-sec"><div class="p-ttl">III. Selección</div><table class="p-tbl">`;
    d.mc.forEach((it, i) => { pR += `<tr><td class="pn">${i + 11}.</td><td class="pa">${it.o[it.a]}</td></tr>`; });
    pR += `</table></div><div class="p-sec"><div class="p-ttl">IV. Pareados</div><table class="p-tbl">`;
    d.pr.terms.forEach((it, i) => { const l = d.pr.letters[d.pr.shuffledDefs.findIndex(df => df.def === it.def)]; pR += `<tr><td class="pn">${i + 16}.</td><td class="pa">${i + 16}→${l}</td></tr>`; });
    pR += `</table></div>`;

    
    // ── Clave rápida estilo ZipGrade (círculos rellenados automáticamente con la pauta)
    const zgKey = [];
    d.cp.forEach((it, i) => zgKey.push({ n: i + 1, fill: 0, labels: ['✓', '✗', '', '', ''] }));
    d.tf.forEach((it, i) => zgKey.push({ n: i + 6, fill: it.a ? 0 : 1, labels: ['V', 'F', '', '', ''] }));
    d.mc.forEach((it, i) => zgKey.push({ n: i + 11, fill: it.a, labels: ['', '', '', '', ''] }));
    d.pr.terms.forEach((it, i) => { const l = d.pr.letters[d.pr.shuffledDefs.findIndex(df => df.def === it.def)]; zgKey.push({ n: i + 16, fill: 'ABCDE'.indexOf(l), labels: ['', '', '', '', ''] }); });
    const zgRow = r => `<div class="zg-row"><span class="zg-n">${r.n}</span>${r.labels.map((lb, ci) => ci === r.fill ? `<span class="zg-c zg-fill">${lb || '●'}</span>` : `<span class="zg-c">${lb}</span>`).join('')}</div>`;
    const zgHead = '<div class="zg-head"><span class="zg-n"></span><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span></div>';
    const zgCol1 = zgHead + zgKey.slice(0, 10).map(zgRow).join('');
    const zgCol2 = zgHead + zgKey.slice(10).map(zgRow).join('');
    const zgVer = ['A', 'B', 'C', 'D'].map((v, i) => ((forma - 1) % 4) === i ? `<span class="zg-c zg-fill">${v}</span>` : `<span class="zg-c">${v}</span>`).join('');
    const zgBlock = `<div class="zg-wrap"><div class="zg-title">🎯 Clave rápida estilo ZipGrade · Forma ${forma} — respuestas correctas ya rellenadas para digitar la clave en la app</div><div class="zg-grid"><div class="zg-col">${zgCol1}</div><div class="zg-col">${zgCol2}</div></div><div class="zg-ver"><span>Test Version / Forma:</span>${zgVer}</div><div class="zg-note">1–5 (Completar): se revisan a mano → ✓ (A) equivale a respuesta correcta · 6–10: V=A, F=B · Réplica visual de referencia; para escanear alumnos usa la hoja oficial de ZipGrade.</div></div>`;

const doc = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evaluación Los Adverbios · Forma ${forma}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body {font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:2mm 6mm;width:201.9mm;margin:0 auto;}
.ph{margin-bottom:0.55rem;}
.ph h2{font-size:12pt;font-weight:700;text-align:center;margin-bottom:0.4rem;}
.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:5px;}
.ph-fill{flex:1;border-bottom:1px solid #555;min-height:13px;display:block;}
.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}
.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}
.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}
.ph-crit{font-size:10.5pt;text-align:center;color:#555;margin-top:0.2rem;}
.sec-title {font-size:11pt;font-weight:700;padding:0.2rem 0.48rem;margin:0.38rem 0 0.17rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #c49000;background:#fef9e7;color:#c49000;}
.obt-row {display:flex;align-items:baseline;gap:4px;font-size:10pt;font-weight:700;font-style:italic;color:#c49000;}
.obt-lbl{white-space:nowrap;}
.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #c49000;height:13px;}
.obt-pct{white-space:nowrap;}
.qn{font-weight:700;min-width:22px;flex-shrink:0;}
.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:11pt;line-height:1.4;padding:0.22rem 0.25rem;border-bottom:1px solid #eee;}
.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}
.tf-text{flex:1;}
.mc-item {border:1px solid #ddd;border-radius:4px;padding:0.22rem 0.42rem;margin-bottom:0.17rem;break-inside:avoid;page-break-inside:avoid;}
.mc-q{font-size:11pt;line-height:1.4;display:flex;gap:0.28rem;margin-bottom:0.15rem;}
.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.17rem 0.5rem;}
.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.06rem 0.2rem;margin-left:1.2rem;}
.mc-opt{font-size:9.5pt;display:flex;align-items:center;gap:0.2rem;}
.mc-opt input{width:11px;height:11px;flex-shrink:0;}
.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:11pt;line-height:1.4;padding:0.22rem 0.25rem;border-bottom:1px solid #eee;}
.cp-text{flex:1;}
.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}
.pr-section{margin-top:0.22rem;}
.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.15rem;}
.pr-head{font-size:9.5pt;font-weight:700;color:#555;margin-bottom:0.18rem;}
.pr-item {font-size:11pt;padding:0.2rem 0.35rem;background:#fef9e7;border-radius:3px;margin-bottom:0.14rem;display:flex;align-items:center;gap:0.2rem;line-height:1.28;break-inside:avoid;page-break-inside:avoid;}
.pr-num {font-weight:700;color:#c49000;min-width:19px;flex-shrink:0;}
.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}
.total-row {display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:12pt;font-weight:700;font-style:italic;margin-top:0.42rem;padding:0.28rem 0;page-break-before:avoid;break-before:avoid;color:#c49000;}
.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #c49000;}
.pauta-wrap{page-break-before:always;padding-top:0.4rem;}
.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}
.p-main{font-size:13pt;font-weight:700;}
.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.12rem 0;}
.p-meta{font-size:9pt;color:#555;}
.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem 1rem;}
.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.35rem 0.55rem;}
.p-ttl{font-size:11pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.15rem;margin-bottom:0.25rem;}
.p-tbl{width:100%;border-collapse:collapse;font-size:11pt;}
.p-tbl tr{border-bottom:1px dotted #ddd;}
.p-tbl td{padding:0.14rem 0.2rem;vertical-align:top;}
.pn{font-weight:700;width:24px;color:#555;}.pa{color:#007a00;font-weight:600;}
.zg-wrap{margin-top:0.5rem;border:1px solid #bbb;border-radius:4px;padding:0.3rem 0.55rem;break-inside:avoid;page-break-inside:avoid;}
.zg-title{font-size:9.5pt;font-weight:700;margin-bottom:0.3rem;}
.zg-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 1.4rem;}
.zg-head{display:flex;gap:5px;align-items:center;font-weight:700;font-size:10pt;letter-spacing:1px;}
.zg-head span:not(.zg-n){width:17px;text-align:center;}
.zg-row{display:flex;gap:5px;align-items:center;margin-top:3px;}
.zg-n{width:22px;text-align:right;font-weight:700;font-size:10.5pt;margin-right:5px;flex-shrink:0;}
.zg-c{width:17px;height:17px;border:1.4px solid #555;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:8pt;color:#666;background:#fff;flex-shrink:0;}
.zg-fill{background:#111;color:#fff;border-color:#111;font-weight:700;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
.zg-ver{margin-top:0.3rem;display:flex;gap:5px;align-items:center;font-size:8.5pt;font-weight:700;}
.zg-note{font-size:7pt;color:#555;margin-top:0.22rem;}
.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}
.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}
.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}
.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}
@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}
</style></head><body><div id="evalPage">
<div class="ph">
  <h2>Evaluación Final de Misión Los Adverbios — Español — Lengua</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
</div><div class="pauta-wrap" id="pautaPage">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · Misión Los Adverbios · Forma ${forma}</div>
    <div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div>
    <div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div>
  </div>
  <div class="p-grid">${pR}</div>
  ${zgBlock}
</div>
<div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div>
<script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.45);fit("pautaPage",252,0.55,1.3);})();</script></body></html>`;

    const win = window.open('', '_blank', '');
    if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
    win.document.write(doc);
    win.document.close();
    setTimeout(() => win.print(), 400);
}

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
// Segunda evaluación imprimible de la misión (Español · Lengua). Todo el
// contenido nace de los bancos y tarjetas de ESTA misión (adjetivo vs adverbio,
// sufijo -mente, adverbios en serie, clases). Formas deterministas: semilla
// _evalRng(200000 + cf). Progresión de dificultad: identificar → transformar →
// analizar el error → clasificar/argumentar en texto → producir.
function evalSwitchMode(mode) {
    sfx('click');
    const cWrap = document.getElementById('evalConceptWrap'), critWrap = document.getElementById('evalCritWrap');
    const cBtn = document.getElementById('evalModeBtnConcept'), critBtn = document.getElementById('evalModeBtnCrit');
    if (mode === 'crit') {
        cWrap.style.display = 'none'; critWrap.style.display = 'block';
        cBtn.classList.remove('active'); cBtn.setAttribute('aria-selected', 'false');
        critBtn.classList.add('active'); critBtn.setAttribute('aria-selected', 'true');
        if (!window._evalCritData) genEvalCrit();
    } else {
        critWrap.style.display = 'none'; cWrap.style.display = 'block';
        critBtn.classList.remove('active'); critBtn.setAttribute('aria-selected', 'false');
        cBtn.classList.add('active'); cBtn.setAttribute('aria-selected', 'true');
    }
}

// ── I. ¿Adjetivo o adverbio? El juez de la invariabilidad (misma palabra que
//    concuerda como adjetivo o es invariable como adverbio; prueba de la p.10 del quiz)
const critAdjAdvBank = [
    { sent: 'Juan es RÁPIDO.', word: 'rápido', ans: 'adj', rewrite: 'Con sujeto femenino: «Ana es rápida». La palabra CAMBIA (rápida) → es adjetivo, concuerda en género y número.' },
    { sent: 'Juan corre RÁPIDO.', word: 'rápido', ans: 'adv', rewrite: 'Con sujeto femenino: «Ana corre rápido». La palabra NO cambia (rápido) → es adverbio, invariable.' },
    { sent: 'Los corredores son LENTOS.', word: 'lentos', ans: 'adj', rewrite: 'Femenino/plural: «Las corredoras son lentas». Cambia → adjetivo (concuerda).' },
    { sent: 'Los corredores caminan LENTO.', word: 'lento', ans: 'adv', rewrite: 'Femenino/plural: «Las corredoras caminan lento». No cambia → adverbio (invariable).' },
    { sent: 'El cielo está CLARO.', word: 'claro', ans: 'adj', rewrite: 'Femenino/plural: «Las mañanas están claras». Cambia → adjetivo (concuerda).' },
    { sent: 'María habla CLARO.', word: 'claro', ans: 'adv', rewrite: 'Con otro sujeto: «Ellas hablan claro». No cambia → adverbio (invariable).' },
    { sent: 'El pan está DURO.', word: 'duro', ans: 'adj', rewrite: 'Femenino/plural: «Las tortillas están duras». Cambia → adjetivo (concuerda).' },
    { sent: 'Ellas trabajan DURO.', word: 'duro', ans: 'adv', rewrite: 'Con otro sujeto: «Él trabaja duro». No cambia → adverbio (invariable).' },
];
// ── II. Laboratorio del sufijo -mente (transformar adjetivo → adverbio conservando la tilde)
const critMenteBank = [
    { adj: 'fácil', adv: 'fácilmente', hint: 'conserva la tilde de «fácil»' },
    { adj: 'rápida', adv: 'rápidamente', hint: 'conserva la tilde de «rápida»' },
    { adj: 'feliz', adv: 'felizmente', hint: '¡ojo! NO es «felizamente»' },
    { adj: 'lenta', adv: 'lentamente', hint: 'sobre el adjetivo femenino «lenta»' },
    { adj: 'clara', adv: 'claramente', hint: 'sobre el adjetivo femenino «clara»' },
    { adj: 'débil', adv: 'débilmente', hint: 'conserva la tilde de «débil»' },
    { adj: 'cortés', adv: 'cortésmente', hint: 'conserva la tilde de «cortés»' },
    { adj: 'amable', adv: 'amablemente', hint: 'sobre el adjetivo «amable»' },
    { adj: 'tímida', adv: 'tímidamente', hint: 'conserva la tilde de «tímida»' },
];
// ── III. Detective del error (errores que la misión enseña a evitar)
const critErrBank = [
    { bad: 'Ella cantó felizamente en la fiesta.', key: 'felizmente', fix: 'Ella cantó felizmente en la fiesta.', rule: 'El adverbio de «feliz» es «felizmente»: el sufijo es -mente, nunca «-amente».' },
    { bad: 'Habló claramente y precisamente.', key: 'clara', fix: 'Habló clara y precisamente.', rule: 'En una serie de adverbios en -mente, solo el ÚLTIMO conserva el sufijo; el anterior va como adjetivo femenino (clara).' },
    { bad: 'Ellas corren rápidas.', key: 'rapido', fix: 'Ellas corren rápido.', rule: '«Rápido» modifica al verbo «corren»: es adverbio e invariable, no concuerda (no «rápidas»).' },
    { bad: '«Ayer» es un adverbio de lugar.', key: 'tiempo', fix: '«Ayer» es un adverbio de tiempo.', rule: '«Ayer» indica CUÁNDO ocurre la acción → adverbio de tiempo, no de lugar.' },
    { bad: 'Hablaron lentamente y suavemente.', key: 'lenta', fix: 'Hablaron lenta y suavemente.', rule: 'Serie de -mente: solo el último lleva el sufijo (lenta y suavemente).' },
    { bad: '«Cerca» es un adverbio de tiempo.', key: 'lugar', fix: '«Cerca» es un adverbio de lugar.', rule: '«Cerca» indica DÓNDE ocurre la acción → adverbio de lugar.' },
    { bad: 'Los atletas llegaron rápidamentes.', key: 'rapidamente', fix: 'Los atletas llegaron rápidamente.', rule: 'El adverbio es invariable: no tiene plural; se dice «rápidamente», no «rápidamentes».' },
    { bad: '«Mucho» es un adverbio de modo.', key: 'cantidad', fix: '«Mucho» es un adverbio de cantidad.', rule: '«Mucho» indica intensidad o cantidad → adverbio de cantidad.' },
];
// ── IV. El poder del adverbio en el texto (mini-párrafos hondureños con 5 adverbios subrayados)
const critClassOptions = ['lugar', 'tiempo', 'modo', 'cantidad', 'afirmación', 'negación', 'duda'];
const critTextBank = [
    {
        scene: '🛒 En el mercado',
        html: 'Hoy fui temprano al mercado de mi comunidad. <u class="crit-adv">AQUÍ</u><sup>1</sup> los vendedores ofrecen <u class="crit-adv">SIEMPRE</u><sup>2</sup> frutas frescas. Mi mamá compró <u class="crit-adv">MUCHO</u><sup>3</sup> maíz y pagó cincuenta lempiras. «Regatea <u class="crit-adv">BIEN</u><sup>4</sup>», me dijo. <u class="crit-adv">QUIZÁS</u><sup>5</sup> mañana volvamos por más.',
        advs: [{ n: 1, w: 'AQUÍ', cls: 'lugar' }, { n: 2, w: 'SIEMPRE', cls: 'tiempo' }, { n: 3, w: 'MUCHO', cls: 'cantidad' }, { n: 4, w: 'BIEN', cls: 'modo' }, { n: 5, w: 'QUIZÁS', cls: 'duda' }],
        effect: [
            { q: 'Si cambias SIEMPRE (nº 2) por NUNCA, ¿cómo cambia el sentido de la oración?', model: 'Cambia por completo: con NUNCA los vendedores ya no ofrecen frutas frescas de forma habitual; el adverbio de negación indica que jamás lo hacen, lo contrario de SIEMPRE.' },
            { q: 'Si quitas el adverbio MUCHO (nº 3), ¿qué información se pierde?', model: 'Se pierde la cantidad: ya no sabríamos cuánto maíz compró. El adverbio de cantidad precisa la intensidad de la acción.' }
        ]
    },
    {
        scene: '🏫 En la escuela',
        html: '<u class="crit-adv">AYER</u><sup>1</sup> en la escuela estudiamos <u class="crit-adv">BASTANTE</u><sup>2</sup>. La maestra explicó <u class="crit-adv">CLARAMENTE</u><sup>3</sup> la lección. «<u class="crit-adv">SÍ</u><sup>4</sup>, entendimos todo», respondimos. Luego salimos <u class="crit-adv">AFUERA</u><sup>5</sup> al patio.',
        advs: [{ n: 1, w: 'AYER', cls: 'tiempo' }, { n: 2, w: 'BASTANTE', cls: 'cantidad' }, { n: 3, w: 'CLARAMENTE', cls: 'modo' }, { n: 4, w: 'SÍ', cls: 'afirmación' }, { n: 5, w: 'AFUERA', cls: 'lugar' }],
        effect: [
            { q: 'Si cambias SÍ (nº 4) por NO, ¿cómo cambia el sentido de la respuesta?', model: 'Se invierte: con NO negamos, indicaría que NO entendieron. El adverbio de afirmación confirma; el de negación rechaza.' },
            { q: 'Si cambias AYER (nº 1) por MAÑANA, ¿qué cambia en el tiempo del relato?', model: 'El relato deja de ser pasado: MAÑANA sitúa la acción en el futuro, algo que todavía no ha ocurrido.' }
        ]
    },
    {
        scene: '🏪 En la pulpería',
        html: '<u class="crit-adv">CERCA</u><sup>1</sup> de mi casa hay una pulpería. <u class="crit-adv">HOY</u><sup>2</sup> compré pan y pagué diez lempiras. La señora me atendió <u class="crit-adv">AMABLEMENTE</u><sup>3</sup>. «<u class="crit-adv">TAMBIÉN</u><sup>4</sup> llévate leche», me dijo. <u class="crit-adv">POSIBLEMENTE</u><sup>5</sup> regrese en la tarde.',
        advs: [{ n: 1, w: 'CERCA', cls: 'lugar' }, { n: 2, w: 'HOY', cls: 'tiempo' }, { n: 3, w: 'AMABLEMENTE', cls: 'modo' }, { n: 4, w: 'TAMBIÉN', cls: 'afirmación' }, { n: 5, w: 'POSIBLEMENTE', cls: 'duda' }],
        effect: [
            { q: 'Si cambias POSIBLEMENTE (nº 5) por SEGURAMENTE, ¿cómo cambia la certeza?', model: 'Aumenta la certeza: POSIBLEMENTE expresa duda; SEGURAMENTE expresa casi seguridad de que regresará.' },
            { q: 'Si eliminas el adverbio CERCA (nº 1), ¿qué se pierde en la oración?', model: 'Se pierde el lugar: ya no sabríamos dónde está la pulpería respecto a la casa.' }
        ]
    }
];
// ── V. Producción escrita (con rúbrica de 4 criterios × 5 pts)
const critProdBank = [
    { prompt: 'Escribe de 4 a 5 oraciones que cuenten cómo es un día en tu comunidad. Usa al menos 5 adverbios de clases distintas (lugar, tiempo, modo, cantidad, afirmación, negación o duda). Subraya cada adverbio e indica entre paréntesis a qué clase pertenece.' },
    { prompt: 'Escribe de 4 a 5 oraciones que describan un día de trabajo o de faena en tu comunidad. Emplea al menos 5 adverbios de clases diferentes; subraya cada uno e indica su clase entre paréntesis.' },
    { prompt: 'Escribe de 4 a 5 oraciones sobre un paseo o una fiesta en tu comunidad. Incluye al menos 5 adverbios de clases distintas; subráyalos e indica la clase de cada uno entre paréntesis.' }
];
const critProdRubric = [
    'Usa al menos 5 adverbios en el texto.',
    'Los adverbios pertenecen a clases variadas (no repite siempre la misma).',
    'Clasifica correctamente cada adverbio subrayado.',
    'El texto es coherente y trata sobre un día en su comunidad.'
];

// Comparación estricta que SÍ exige la tilde (para el laboratorio -mente)
function _critNormTilde(v) { return (v || '').toString().toLowerCase().replace(/\s+/g, ' ').trim(); }
function _critClassSelect(dataAttr, i) {
    return `<select class="crit-fossil-select" ${dataAttr}="${i}" aria-label="Clase del adverbio ${i + 1}"><option value="">— elige la clase —</option>${critClassOptions.map(e => `<option value="${e}">${e}</option>`).join('')}</select>`;
}

function genEvalCrit() {
    sfx('click');
    _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
    const _sC = document.getElementById('evalCritFormaSel');
    if (_sC && parseInt(_sC.value, 10)) evalCritFormNum = Math.min(EVAL_FORMAS, Math.max(1, parseInt(_sC.value, 10)));
    const cf = evalCritFormNum; window._currentEvalCritForm = cf; const rngC = _evalRng(200000 + cf);
    evalCritFormNum = (evalCritFormNum % EVAL_FORMAS) + 1;
    _injectFormaSel('genEvalCrit', 'evalCritFormaSel', evalCritFormNum, function (v) { evalCritFormNum = v; });
    saveProgress();
    document.getElementById('evalcrit-screen-title').textContent = `🧠 Pensamiento Crítico · Forma ${cf} · Los Adverbios`;
    evalCritAnsVisible = false;
    const out = document.getElementById('evalCritOut'); out.innerHTML = '';

    // Barra de distribución + progresión de dificultad
    const bar = document.createElement('div'); bar.className = 'eval-score-bar';
    bar.innerHTML = `<div><div class="esb-title">📊 Distribución de puntaje — 100 puntos</div><div class="esb-dist">Dificultad creciente: identificar (I) → transformar (II) → analizar el error (III) → clasificar y argumentar en un texto (IV) → producir por escrito (V).</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">I. Adj/Adv 20</span><span class="eval-score-pill esp-tf">II. -mente 15</span><span class="eval-score-pill esp-mc">III. Error 20</span><span class="eval-score-pill esp-pr">IV. En el texto 25</span><span class="eval-score-pill esp-cp">V. Producción 20</span></div>`;
    out.appendChild(bar);

    // ── I. ¿Adjetivo o adverbio? (5 × 4 = 20; radios autocalificables + reescritura modelo)
    const adjItems = _pickF(critAdjAdvBank, 5, rngC);
    let adjRows = '';
    adjItems.forEach((it, i) => {
        adjRows += `<div class="crit-q-block"><div class="crit-q-label">${i + 1}. ${it.sent.replace(it.word.toUpperCase(), '<strong>' + it.word.toUpperCase() + '</strong>')}</div><div class="crit-adj-opts"><label class="crit-radio"><input type="radio" name="critAdj${i}" value="adj"> Adjetivo (concuerda)</label><label class="crit-radio"><input type="radio" name="critAdj${i}" value="adv"> Adverbio (invariable)</label></div><div class="crit-q-sub">Aplica la prueba: reescríbela con sujeto femenino o plural en tu cuaderno.</div><div class="crit-pauta">Es <strong>${it.ans === 'adj' ? 'ADJETIVO' : 'ADVERBIO'}</strong>. ${it.rewrite}</div><div class="eval-item-feedback" id="critFbAdj${i}" aria-live="polite"></div></div>`;
    });
    const s1 = document.createElement('div');
    s1.innerHTML = `<div class="eval-section-title">I. ¿Adjetivo o adverbio? El juez de la invariabilidad <span class="eval-pts">20 pts · 4 pts c/u</span></div><div class="eval-item"><p class="crit-q-label">Marca si la palabra en mayúsculas es adjetivo o adverbio. Luego aplica la prueba de la invariabilidad: reescribe la oración con sujeto femenino o plural y observa si la palabra cambia.</p>${adjRows}</div>`;
    out.appendChild(s1);

    // ── II. Laboratorio del sufijo -mente (5 × 3 = 15; inputs, exige la tilde correcta)
    const menteItems = _pickF(critMenteBank, 5, rngC);
    let menteRows = '';
    menteItems.forEach((it, i) => {
        menteRows += `<div class="crit-tl-row"><span class="crit-tl-ev"><strong>${it.adj}</strong> → <input type="text" class="crit-mente-input" data-mente="${i}" autocomplete="off" spellcheck="false" aria-label="Adverbio en -mente de ${it.adj}" placeholder="adverbio en -mente"> <span class="crit-mente-hint">(${it.hint})</span></span><div class="crit-pauta">${it.adj} → <strong>${it.adv}</strong></div><div class="eval-item-feedback" id="critFbMente${i}" aria-live="polite"></div></div>`;
    });
    const s2 = document.createElement('div');
    s2.innerHTML = `<div class="eval-section-title">II. Laboratorio del sufijo -mente <span class="eval-pts">15 pts · 3 pts c/u</span></div><div class="eval-item"><p class="crit-q-label">Transforma cada adjetivo en un adverbio terminado en -mente. <strong>Debes conservar la tilde</strong> del adjetivo si la tiene.</p>${menteRows}</div>`;
    out.appendChild(s2);

    // ── III. Detective del error (4 × 5 = 20; corrección autocalificable + regla modelo)
    const errItems = _pickF(critErrBank, 4, rngC);
    let errRows = '';
    errItems.forEach((it, i) => {
        errRows += `<div class="crit-q-block"><div class="crit-scenario">❌ ${it.bad}</div><div class="crit-q-label">Escribe la forma correcta:</div><textarea class="crit-textarea" data-err="${i}" rows="2" aria-label="Corrige la afirmación ${i + 1}" placeholder="Reescribe la oración corregida..."></textarea><div class="crit-pauta">${it.fix} <em>Regla:</em> ${it.rule}</div><div class="eval-item-feedback" id="critFbErr${i}" aria-live="polite"></div></div>`;
    });
    const s3 = document.createElement('div');
    s3.innerHTML = `<div class="eval-section-title">III. Detective del error <span class="eval-pts">20 pts · 5 pts c/u</span></div><div class="eval-item"><p class="crit-q-label">Cada oración contiene un error de los que estudiamos. Escribe la forma correcta y, en tu cuaderno, explica qué regla se rompió.</p>${errRows}</div>`;
    out.appendChild(s3);

    // ── IV. El poder del adverbio en el texto (5 clasificaciones × 5 = 25; + 2 preguntas de efecto)
    const txtItem = _pickF(critTextBank, 1, rngC)[0];
    let advRows = '';
    txtItem.advs.forEach((a, i) => {
        advRows += `<div class="crit-tl-row"><span class="crit-match-n">${a.n}. ${a.w}</span> ${_critClassSelect('data-adv', i)}<div class="eval-item-feedback" id="critFbAdv${i}" aria-live="polite"></div></div>`;
    });
    let effRows = '';
    txtItem.effect.forEach((e, i) => {
        effRows += `<div class="crit-q-block"><div class="crit-q-label">Efecto ${i + 1}: ${e.q}</div><textarea class="crit-textarea" rows="2" aria-label="Efecto semántico ${i + 1}"></textarea><div class="crit-pauta">${e.model}</div></div>`;
    });
    const advKey = txtItem.advs.map(a => a.n + '. ' + a.w + ' → ' + a.cls).join(' · ');
    const s4 = document.createElement('div');
    s4.innerHTML = `<div class="eval-section-title">IV. El poder del adverbio en el texto <span class="eval-pts">25 pts · 5 pts c/u</span></div><div class="eval-item"><p class="crit-q-label">${txtItem.scene}. Lee el texto y clasifica cada adverbio subrayado. Luego responde las preguntas de efecto (en tu cuaderno).</p><div class="crit-scenario">${txtItem.html}</div><div class="crit-q-label" style="margin-top:0.6rem;">Clasifica cada adverbio subrayado:</div>${advRows}<div class="crit-pauta">Clases: ${advKey}</div>${effRows}</div>`;
    out.appendChild(s4);

    // ── V. Producción escrita (autoevaluación 0-20; rúbrica de 4 criterios × 5)
    const prodItem = _pickF(critProdBank, 1, rngC)[0];
    const rubricHtml = critProdRubric.map((c, i) => `<label class="crit-rubric-item"><input type="checkbox" class="crit-rubric-chk" data-rubric="${i}"> ${c} <span class="crit-rubric-pts">(5 pts)</span></label>`).join('');
    const s5 = document.createElement('div');
    s5.innerHTML = `<div class="eval-section-title">V. Producción escrita <span class="eval-pts">20 pts · 4 criterios × 5 pts</span></div><div class="eval-item"><div class="crit-q-label">${prodItem.prompt}</div><textarea class="crit-textarea" rows="5" aria-label="Producción escrita"></textarea><div class="crit-rubric"><strong>📋 Autoevaluación (marca lo que cumpliste, cada casilla vale 5 pts):</strong><div class="crit-rubric-list">${rubricHtml}</div></div><div class="crit-selfscore"><span>Puntaje de esta sección (según las casillas marcadas):</span> <strong id="critScoreVout">0</strong> <span>de 20 pts</span></div></div>`;
    out.appendChild(s5);

    window._evalCritData = {
        adj: adjItems,
        mente: menteItems,
        err: errItems,
        txt: txtItem,
        prod: prodItem,
        rubric: critProdRubric
    };
    const totalPanel = document.createElement('div'); totalPanel.id = 'evalCritTotalResult'; totalPanel.className = 'eval-auto-result';
    totalPanel.innerHTML = '<strong>🧮 Prueba de pensamiento crítico:</strong> resuelve las secciones I–IV en pantalla, autoevalúa la V con la rúbrica de casillas y presiona <em>Calificar prueba</em>. La impresión conserva el formato limpio para papel.';
    out.appendChild(totalPanel);
    fin('s-evaluacion');
}
function toggleEvalCritAns() {
    evalCritAnsVisible = !evalCritAnsVisible;
    document.querySelectorAll('#evalCritOut .crit-pauta').forEach(el => el.style.display = evalCritAnsVisible ? 'block' : 'none');
    sfx('click');
}
function _setCritFb(id, ok, msg) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = msg;
    el.className = 'eval-item-feedback ' + (ok ? 'eval-ok' : 'eval-no');
}
function gradeEvalCrit() {
    if (!window._evalCritData) { showToast('⚠️ Genera una prueba primero'); return; }
    sfx('click');
    const d = window._evalCritData;
    const detail = { adj: 0, mente: 0, err: 0, txt: 0, prod: 0 };

    // I. Adjetivo o adverbio (radios, 4 pts c/u)
    d.adj.forEach((it, i) => {
        const sel = document.querySelector(`input[name="critAdj${i}"]:checked`);
        const ok = !!sel && sel.value === it.ans;
        if (ok) detail.adj += 4;
        _setCritFb('critFbAdj' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. R/ Es ' + (it.ans === 'adj' ? 'adjetivo (concuerda)' : 'adverbio (invariable)'));
    });

    // II. Laboratorio -mente (inputs con tilde estricta, 3 pts c/u)
    d.mente.forEach((it, i) => {
        const inp = document.querySelector(`[data-mente="${i}"]`);
        const ok = !!inp && _critNormTilde(inp.value) === _critNormTilde(it.adv);
        if (inp) { inp.classList.toggle('eval-input-ok', ok); inp.classList.toggle('eval-input-no', !ok); }
        if (ok) detail.mente += 3;
        _setCritFb('critFbMente' + i, ok, ok ? 'Correcto. +3 pts' : 'Revisar (¡cuida la tilde!). R/ ' + it.adv);
    });

    // III. Detective del error (5 pts c/u; correcto si el texto contiene la palabra clave)
    d.err.forEach((it, i) => {
        const ta = document.querySelector(`[data-err="${i}"]`);
        const student = normalizeEvalAnswer(ta ? ta.value : '');
        const key = normalizeEvalAnswer(it.key);
        const ok = !!student && student.includes(key);
        if (ta) { ta.classList.toggle('eval-input-ok', ok); ta.classList.toggle('eval-input-no', !ok); }
        if (ok) detail.err += 5;
        _setCritFb('critFbErr' + i, ok, ok ? 'Correcto. +5 pts' : 'Revisar. R/ ' + it.fix);
    });

    // IV. El poder del adverbio en el texto (clasificación, 5 pts c/u)
    d.txt.advs.forEach((a, i) => {
        const sel = document.querySelector(`[data-adv="${i}"]`);
        const ok = !!sel && sel.value === a.cls;
        if (sel) { sel.classList.toggle('eval-input-ok', ok); sel.classList.toggle('eval-input-no', !ok); }
        if (ok) detail.txt += 5;
        _setCritFb('critFbAdv' + i, ok, ok ? 'Correcto. +5 pts' : 'Revisar. R/ ' + a.w + ' → ' + a.cls);
    });

    // V. Producción escrita (autoevaluación por casillas, 5 pts c/u)
    const chks = document.querySelectorAll('.crit-rubric-chk');
    let vScore = 0;
    chks.forEach(c => { if (c.checked) vScore += 5; });
    vScore = Math.min(20, vScore);
    detail.prod = vScore;
    const vOut = document.getElementById('critScoreVout'); if (vOut) vOut.textContent = vScore;

    const total = detail.adj + detail.mente + detail.err + detail.txt + detail.prod;
    const panel = document.getElementById('evalCritTotalResult');
    if (panel) {
        panel.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk');
        panel.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>I. Adj/Adv: ${detail.adj}/20 · II. -mente: ${detail.mente}/15 · III. Error: ${detail.err}/20 · IV. En el texto: ${detail.txt}/25 · V. Producción: ${detail.prod}/20</span><br><em>Las secciones I–IV se califican solas; la V la autoevalúas con la rúbrica. Compara siempre con la Pauta.</em>`;
    }
    const formKey = 'crit_' + (window._currentEvalCritForm || 1);
    if (total >= 70) { if (!xpTracker.critWin.has(formKey)) { xpTracker.critWin.add(formKey); pts(8); } showToast('🎯 Pensamiento crítico: ' + total + '/100'); }
    else showToast('🧮 Prueba calificada: ' + total + '/100. Revisa lo marcado.');
}
function printEvalCrit() {
    if (!window._evalCritData) { showToast('⚠️ Genera una prueba primero'); return; }
    sfx('click');
    const forma = window._currentEvalCritForm || 1;
    const d = window._evalCritData;
    const lines = (n) => Array(n).fill('<div class="ln"></div>').join('');

    // I. ¿Adjetivo o adverbio?
    let s1 = `<div class="sec-title"><span>I. ¿Adjetivo o adverbio? El juez de la invariabilidad</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="crit-print-q">Marca (Adj / Adv) y aplica la prueba: reescribe con sujeto femenino o plural y observa si la palabra cambia.</p>`;
    d.adj.forEach((it, i) => { const sent = it.sent.replace(it.word.toUpperCase(), '<strong>' + it.word.toUpperCase() + '</strong>'); s1 += `<div class="cp-row"><span class="qn">${i + 1}.</span><span class="cp-text">${sent} &nbsp; Es: <span class="ph-box2">Adj</span> <span class="ph-box2">Adv</span> &nbsp; Reescritura: <span class="cp-blank"></span></span></div>`; });

    // II. Laboratorio -mente
    let s2 = `<div class="sec-title"><span>II. Laboratorio del sufijo -mente</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 15 pts</span></div></div><p class="crit-print-q">Transforma cada adjetivo en adverbio en -mente. Conserva la tilde del adjetivo si la tiene.</p>`;
    d.mente.forEach((it, i) => { s2 += `<div class="cp-row"><span class="qn">${i + 1}.</span><span class="cp-text"><strong>${it.adj}</strong> → <span class="cp-blank"></span></span></div>`; });

    // III. Detective del error
    let s3 = `<div class="sec-title"><span>III. Detective del error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="crit-print-q">Cada oración tiene un error. Escribe la forma correcta y la regla.</p>`;
    d.err.forEach((it, i) => { s3 += `<p class="crit-print-scenario">❌ ${it.bad}</p>${lines(1)}`; });

    // IV. El poder del adverbio en el texto
    let s4 = `<div class="sec-title"><span>IV. El poder del adverbio en el texto</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25 pts</span></div></div><p class="crit-print-scenario">${d.txt.scene}. ${d.txt.html}</p><p class="crit-print-q">Clasifica cada adverbio subrayado (lugar, tiempo, modo, cantidad, afirmación, negación o duda):</p>`;
    d.txt.advs.forEach(a => { s4 += `<div class="cp-row"><span class="qn">${a.n}.</span><span class="cp-text">${a.w} → <span class="cp-blank"></span></span></div>`; });
    d.txt.effect.forEach((e, i) => { s4 += `<p class="crit-print-q"><strong>Efecto ${i + 1}.</strong> ${e.q}</p>${lines(1)}`; });

    // V. Producción escrita
    let s5 = `<div class="sec-title"><span>V. Producción escrita</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="crit-print-q">${d.prod.prompt}</p>${lines(6)}<p class="crit-print-q" style="margin-top:0.3rem;">Rúbrica (5 pts c/u): ${d.rubric.join(' · ')}</p>`;

    // Pauta
    let pR = '';
    pR += `<div class="p-sec"><div class="p-ttl">I. ¿Adjetivo o adverbio?</div>${d.adj.map((it, i) => `<div class="p-crit-line"><strong>${i + 1}. ${it.ans === 'adj' ? 'ADJETIVO' : 'ADVERBIO'}:</strong> ${it.rewrite}</div>`).join('')}</div>`;
    pR += `<div class="p-sec"><div class="p-ttl">II. Laboratorio -mente</div>${d.mente.map((it, i) => `<div class="p-crit-line"><strong>${i + 1}.</strong> ${it.adj} → ${it.adv}</div>`).join('')}</div>`;
    pR += `<div class="p-sec"><div class="p-ttl">III. Detective del error</div>${d.err.map((it, i) => `<div class="p-crit-line"><strong>${i + 1}.</strong> ${it.fix} <em>(${it.rule})</em></div>`).join('')}</div>`;
    pR += `<div class="p-sec"><div class="p-ttl">IV. El poder del adverbio en el texto</div>${d.txt.advs.map(a => `<div class="p-crit-line"><strong>${a.n}. ${a.w}:</strong> ${a.cls}</div>`).join('')}${d.txt.effect.map((e, i) => `<div class="p-crit-line"><strong>Efecto ${i + 1}:</strong> ${e.model}</div>`).join('')}</div>`;
    pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Producción escrita (guía de corrección)</div>${d.rubric.map((c, i) => `<div class="p-crit-line"><strong>Criterio ${i + 1} (5 pts):</strong> ${c}</div>`).join('')}</div>`;

    const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pensamiento Crítico Los Adverbios · Forma ${forma}</title><style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 6mm;width:201.9mm;margin:0 auto;}
.ph{margin-bottom:0.35rem;}
.ph h2{font-size:11.5pt;font-weight:700;text-align:center;margin-bottom:0.25rem;}
.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}
.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}
.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}
.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}
.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}
.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.15rem;}
.sec-title{font-size:10.5pt;font-weight:700;padding:0.15rem 0.45rem;margin:0.28rem 0 0.12rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #c49000;background:#fef9e7;color:#c49000;}
.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#c49000;}
.obt-lbl{white-space:nowrap;}
.obt-line{display:inline-block;min-width:52px;border-bottom:1.5px solid #c49000;height:12px;}
.obt-pct{white-space:nowrap;}
.crit-print-scenario{font-size:10pt;background:#fef9e7;border-left:3px solid #c49000;padding:0.18rem 0.5rem;margin:0.12rem 0 0.15rem;line-height:1.4;}
.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}
.ln{border-bottom:1px solid #111;min-height:13px;margin-bottom:3px;}
.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.5;padding:0.16rem 0.2rem;border-bottom:1px solid #eee;}
.qn{font-weight:700;min-width:22px;flex-shrink:0;}
.cp-text{flex:1;}
.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}
.ph-box2{display:inline-block;border:1.3px solid #111;border-radius:3px;padding:0 5px;font-size:9pt;font-weight:700;margin:0 2px;}
.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:18%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.28rem;padding:0.1rem 0;color:#c49000;}
.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #c49000;}
.pauta-wrap{page-break-before:always;padding-top:0.4rem;}
.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}
.p-main{font-size:13pt;font-weight:700;color:#c49000;}
.p-sub{font-size:9pt;color:#c00;font-weight:700;margin:0.08rem 0;}
.p-meta{font-size:9pt;color:#555;}
.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}
.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}
.p-ttl{font-size:11pt;font-weight:700;color:#c49000;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}
.p-crit-line{font-size:10pt;color:#007a00;margin-bottom:0.16rem;line-height:1.35;}
.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}
.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}
.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}
.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}
@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}
</style></head><body><div id="evalPage">
<div class="ph">
  <h2>Evaluación Competencial · Pensamiento Crítico · Los Adverbios · Educación Básica · Español · Lengua</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · I. Adj/Adv 20 · II. -mente 15 · III. Error 20 · IV. En el texto 25 · V. Producción 20 · Forma ${forma}</p>
</div>
${s1}${s2}${s3}${s4}${s5}
<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div>
</div><div class="pauta-wrap" id="pautaPage">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Pensamiento Crítico · Los Adverbios · Forma ${forma}</div>
    <div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div>
    <div class="p-meta">Valor total: 100 pts | I 20 · II 15 · III 20 · IV 25 · V 20 — secciones abiertas: usar como guía de corrección</div>
  </div>
  <div class="p-grid">${pR}</div>
</div>
<div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div>
<script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("evalPage",252,0.55,1.3);fit("pautaPage",252,0.55,1.3);})();<\/script></body></html>`;
    const win = window.open('', '_blank', '');
    if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
    win.document.write(doc);
    win.document.close();
    setTimeout(() => win.print(), 400);
}

// ===================== DIPLOMA =====================
function _diplPct() { return xp >= MXP ? 100 : Math.round((xp / MXP) * 100); }
function openDiploma() {
    sfx('click');
    const pct = _diplPct();
    document.getElementById('diplPct').textContent = pct + '%';
    document.getElementById('diplPct').style.color = pct >= 70 ? 'var(--jade)' : pct >= 40 ? 'var(--blue)' : 'var(--amber)';
    document.getElementById('diplBar').style.width = pct + '%';
    const stars = pct === 100 ? '⭐⭐⭐⭐⭐' : pct >= 80 ? '⭐⭐⭐⭐' : pct >= 60 ? '⭐⭐⭐' : pct >= 40 ? '⭐⭐' : '⭐';
    document.getElementById('diplStars').textContent = stars;
    const msgs = ['🚀 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!', '🌱 ¡GRAN INICIO! Estás dando los primeros pasos.', '📚 ¡BUEN TRABAJO! Vas progresando muy bien.', '💪 ¡MUY BIEN! Dominas gran parte de los adverbios.', '🌟 ¡INCREÍBLE avance! Estás cerca de la excelencia gramatical.', '🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Adverbios!'];
    const mi = pct === 100 ? 5 : pct >= 80 ? 4 : pct >= 60 ? 3 : pct >= 40 ? 2 : pct >= 20 ? 1 : 0;
    document.getElementById('diplMsg').textContent = msgs[mi];
    document.getElementById('diplDate').textContent = 'Honduras, ' + new Date().toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' });
    const achStr = unlockedAch.length > 0 ? '🏅 Logros: ' + unlockedAch.map(id => ACHIEVEMENTS[id].icon + ' ' + ACHIEVEMENTS[id].label).join(', ') : 'Sin logros aún — ¡sigue completando secciones!';
    document.getElementById('diplAch').textContent = achStr;
    document.getElementById('diplomaOverlay').classList.add('open');
    document.querySelector('.diploma-input').focus();
}
function closeDiploma() { document.getElementById('diplomaOverlay').classList.remove('open'); }
function updateDiplomaName(v) { document.getElementById('diplName').textContent = v || 'Estudiante'; }
function shareWA() {
    const pct = _diplPct(); const name = document.getElementById('diplName').textContent;
    const stars = document.getElementById('diplStars').textContent;
    const msg = document.getElementById('diplMsg').textContent;
    const date = document.getElementById('diplDate').textContent;
    const achText = unlockedAch.map(id => ACHIEVEMENTS[id].icon + ' ' + ACHIEVEMENTS[id].label).join('\n');
    const txt = `${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: Los Adverbios\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText ? '\n\n🏅 Logros desbloqueados:\n' + achText : ''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
    _waShare(txt);
}

async function captureDiploma() {
    if (typeof html2canvas === 'undefined') { showToast('⚠️ Cargando... intenta de nuevo'); return; }
    sfx('click');
    const card = document.querySelector('.diploma-card');
    const btn = document.querySelector('.diploma-actions .btn-pri');
    const toHide = [card.querySelector('.diploma-input'), card.querySelector('.diploma-actions'), card.querySelector('hr')];
    if (btn) { btn.disabled = true; btn.textContent = '⏳ Capturando...'; }
    toHide.forEach(el => { if (el) el.style.display = 'none'; });
    let dataUrl = '';
    try {
        const canvas = await html2canvas(card, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
        toHide.forEach(el => { if (el) el.style.display = ''; });
        dataUrl = canvas.toDataURL('image/png');
        const name = (document.getElementById('diplName').textContent || 'Estudiante').replace(/\s+/g, '-');
        const fileName = 'constancia-' + name + '.png';
        const cap = window.Capacitor;
        if (cap && cap.isNativePlatform && cap.isNativePlatform() && cap.Plugins?.Filesystem && cap.Plugins?.Share) {
            const base64Data = dataUrl.split(',')[1];
            const result = await cap.Plugins.Filesystem.writeFile({ path: fileName, data: base64Data, directory: 'CACHE' });
            await cap.Plugins.Share.share({ url: result.uri, dialogTitle: 'Guardar / Compartir Constancia' });
        } else {
            const a = document.createElement('a');
            a.href = dataUrl; a.download = fileName; a.click();
        }
    } catch (e) {
        toHide.forEach(el => { if (el) el.style.display = ''; });
        if (e.name !== 'AbortError') showToast('⚠️ No se pudo guardar la constancia');
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = '📷 Guardar foto'; }
    }
}
// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadProgress();
    upFC(); buildQz(); buildClass(); showId(); showCmp(); buildSopa(); genEval(); initStudentClassroomCard();
    updateRetoButtons();
    renderAchPanel();
    document.addEventListener('click', function (e) {
        const panel = document.getElementById('achPanel');
        const btn = document.getElementById('achBtn');
        if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn) panel.classList.remove('open');
    });
    document.addEventListener('click', function (e) {
        if (e.target === document.getElementById('diplomaOverlay')) closeDiploma();
    });
    const savedName = localStorage.getItem('nombreEstudianteAdverbios');
    const inputName = document.querySelector('.diploma-input');
    if (savedName && inputName) { inputName.value = savedName; updateDiplomaName(savedName); }
    if (inputName) inputName.addEventListener('input', e => localStorage.setItem('nombreEstudianteAdverbios', e.target.value));
    fin('s-aprende', false);
    fin('s-tipos', false);
});

function initStudentClassroomCard() {
    const params = new URLSearchParams(window.location.search);
    const tareaUrl = params.get('tarea');
    const card = document.getElementById('studentClassroomCard');
    if (!card) return;

    card.style.display = 'block';

    if (tareaUrl && tareaUrl.startsWith('https://classroom.google.com/')) {
        card.style.borderLeft = '4px solid #0f9d58';
        const header = document.createElement('div');
        header.className = 'student-task-assigned';
        const icon = document.createElement('div');
        icon.className = 'student-task-icon';
        icon.textContent = '📋';
        const info = document.createElement('div');
        const title = document.createElement('h3');
        title.className = 'student-task-title';
        title.textContent = 'Tienes una tarea asignada en Google Classroom';
        const sub = document.createElement('p');
        sub.className = 'student-task-sub';
        sub.textContent = 'Completa las actividades de esta misión y luego entrégala en Classroom.';
        info.appendChild(title);
        info.appendChild(sub);
        header.appendChild(icon);
        header.appendChild(info);
        const btn = document.createElement('a');
        btn.href = tareaUrl;
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.className = 'btn btn-classroom student-task-btn';
        btn.textContent = 'Ir a entregar en Classroom →';
        card.appendChild(header);
        card.appendChild(btn);
    } else {
        card.style.borderLeft = '4px solid var(--border)';
        const wrap = document.createElement('div');
        wrap.className = 'student-generic-title';
        const emoji = document.createElement('span');
        emoji.textContent = '🎓';
        const title = document.createElement('h4');
        title.textContent = '¿Tu maestro te asignó una tarea?';
        wrap.appendChild(emoji);
        wrap.appendChild(title);
        const desc = document.createElement('p');
        desc.className = 'classroom-step2-desc';
        desc.textContent = 'Si tu maestro compartió un enlace especial de la misión, ábrelo desde ahí para ver tu tarea. Si no, puedes ir directamente a Classroom.';
        const btn = document.createElement('a');
        btn.href = 'https://classroom.google.com';
        btn.target = '_blank';
        btn.rel = 'noopener noreferrer';
        btn.className = 'btn btn-d';
        btn.style.display = 'inline-block';
        btn.style.textDecoration = 'none';
        btn.textContent = 'Ir a Google Classroom';
        card.appendChild(wrap);
        card.appendChild(desc);
        card.appendChild(btn);
    }
}

function generarEnlaceAlumno() {
    const input = document.getElementById('classroomAssignmentUrl');
    const url = input ? input.value.trim() : '';
    if (!url || !url.startsWith('https://classroom.google.com/')) {
        _classroomHint('⚠️ Pega un enlace válido de Google Classroom (debe empezar con https://classroom.google.com/).', false);
        return;
    }
    const misionBase = window.location.origin + window.location.pathname;
    const enlace = misionBase + '?tarea=' + encodeURIComponent(url);
    const out = document.getElementById('classroomLinkOut');
    const result = document.getElementById('classroomLinkResult');
    result.textContent = enlace;
    out.style.display = 'block';
    navigator.clipboard.writeText(enlace).then(() => {
        _classroomHint('✅ Enlace copiado. ¡Compártelo con tus alumnos!', true);
    }).catch(() => {
        _classroomHint('Enlace generado. Cópialo manualmente del recuadro.', false);
    });
}

function copiarEnlaceAlumno() {
    const result = document.getElementById('classroomLinkResult');
    if (!result) return;
    navigator.clipboard.writeText(result.textContent).then(() => {
        _classroomHint('✅ Enlace copiado al portapapeles.', true);
    });
}

function asignarEnClassroom() {
    const out = document.getElementById('tgOut');
    const url = encodeURIComponent(window.location.href);
    const titulo = encodeURIComponent('Misión Los Adverbios | Educación Básica – policastsapien.com');
    const classroomUrl = 'https://classroom.google.com/share?url=' + url + '&title=' + titulo;

    if (!out || out.innerHTML.trim() === '') {
        _classroomHint('⚠️ Primero genera las tareas con el botón "Generar" y luego haz clic aquí.', false);
        return;
    }

    const tipoEl = document.getElementById('tgType');
    const tipoText = tipoEl ? tipoEl.options[tipoEl.selectedIndex].text.replace(/^\S+\s*/, '') : '';
    let texto = '📚 MISIÓN: LOS ADVERBIOS | Educación Básica – Español · Lengua\n';
    texto += '🔗 ' + window.location.href + '\n';
    texto += '📋 Tipo de tarea: ' + tipoText + '\n';
    texto += '─'.repeat(45) + '\n\n';

    const instr = out.querySelector('.tg-instruction-block');
    if (instr) {
        const instrClone = instr.cloneNode(true);
        texto += '📌 INSTRUCCIÓN:\n' + instrClone.textContent.replace(/\s+/g, ' ').trim() + '\n\n';
    }

    const tasks = out.querySelectorAll('.tg-task');
    if (tasks.length > 0) {
        tasks.forEach((task, i) => {
            const content = task.querySelector('.tg-task-content');
            if (content) {
                const clone = content.cloneNode(true);
                const ans = clone.querySelector('.tg-answer');
                if (ans) ans.remove();
                texto += (i + 1) + '. ' + clone.textContent.replace(/\s+/g, ' ').trim() + '\n\n';
            }
        });
    } else {
        // Tabla (tipo classify)
        const table = out.querySelector('table');
        if (table) {
            table.querySelectorAll('tr').forEach(row => {
                const cells = [...row.querySelectorAll('th, td')].map(c => c.textContent.trim());
                texto += cells.join(' | ') + '\n';
            });
            texto += '\n';
        }
    }

    navigator.clipboard.writeText(texto).then(() => {
        _classroomHint('✅ ¡Tareas copiadas! En Classroom pégalas en la descripción de la tarea (Ctrl+V).', true);
    }).catch(() => {
        _classroomHint('Classroom abierto. Copia el texto de las tareas manualmente y pégalo en la descripción.', false);
    });

    window.open(classroomUrl, '_blank');
}

function _classroomHint(msg, ok) {
    const hint = document.querySelector('.classroom-hint');
    if (!hint) return;
    hint.textContent = msg;
    hint.style.color = ok ? 'var(--jade)' : 'var(--amber)';
    hint.style.fontStyle = 'normal';
    hint.style.fontWeight = '600';
    setTimeout(() => {
        hint.textContent = 'Genera las tareas primero · luego haz clic para copiarlas y abrirlas en Classroom.';
        hint.style.color = '';
        hint.style.fontStyle = '';
        hint.style.fontWeight = '';
    }, 7000);
}

// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ═════════════════ 📖 CONTROL DE LECTURA ═════════════════
// Se paga UNA vez por lectura, no por repetirla: releer el mismo texto dos o
// tres días es lo que más sube la fluidez.
function initLectura(){
  if (typeof LecturaMision === 'undefined' || typeof LECTURA_ADVERBIOS === 'undefined') return;
  _lecturaApi = LecturaMision.montar({
    contenedor: 'lm-root',
    corpus: LECTURA_ADVERBIOS,
    actividades: LECTURA_ADVERBIOS_TALLER,
    resumen: LECTURA_ADVERBIOS_RESUMEN,
    mision: 'adverbios',
    tema: 'los adverbios',
    alTerminar: function (r) {
      fin('s-lectura');
      unlockAchievement('lector_minuto');
      if (r.nivelVelocidad === 'estandar' || r.nivelVelocidad === 'avanzado') unlockAchievement('lector_banda');
      var caza = r.porActividad && r.porActividad.caza;
      if (caza && caza.de && caza.puntos >= caza.de) unlockAchievement('cazador_adverbios');
      if (!xpTracker.lec) xpTracker.lec = new Set();
      if (!xpTracker.lec.has(r.textoId)) {
        xpTracker.lec.add(r.textoId);
        var bono = r.puntosDe ? Math.round((r.puntos / r.puntosDe) * 5) : 0;
        pts(5 + bono);
      }
    }
  });
}
initLectura();
