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
const SAVE_KEY = 'pronombres_v2_basica';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1;
let unlockedAch = [];
let darkMode = false;
let prevLevel = 0;
const TOTAL_SECTIONS = 11;

const xpTracker = {
    fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(),
    cmp: new Set(), reto: new Set(), sopa: new Set(),
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
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ doneSections: Array.from(done), unlockedAch, evalFormNum, xp })); } catch (e) { }
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
        if (s.xp !== undefined) {
            xp = s.xp;
            updateXPBar();
        }
    } catch (e) { }
}
// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS = {
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
    { w: 'Pronombre', a: '👤 Palabra que <strong>sustituye al sustantivo</strong>. Su función es evitar repeticiones y su significado depende del contexto.' },
    { w: 'Personales Tónicos', a: '🗣️ Pueden funcionar solos o tras preposición (no dependen del verbo). Ej: <strong>Yo, tú, él, nosotros, ustedes, mí, ti</strong>.' },
    { w: 'Personales Átonos', a: '🔗 Acompañan obligatoriamente al verbo. Ej: <strong>Me, te, se, nos, os, lo, la, le, los, las, les</strong>.' },
    { w: 'Demostrativos', a: '👉 Sustituyen al nombre indicando distancia. Van solos. Ej: "No quiero este libro, quiero <strong>ese</strong>".' },
    { w: 'Posesivos', a: '💼 Sustituyen indicando pertenencia. Ej: "Mi casa es pequeña, la <strong>tuya</strong> es grande".' },
    { w: 'Relativos', a: '🔗 Unen oraciones y se refieren a un sustantivo mencionado antes (antecedente). Ej: "El libro <strong>que</strong> leí".' },
    { w: 'Indefinidos', a: '🤷 Sustituyen a una persona o cosa sin precisar la cantidad. Ej: "<strong>Alguien</strong> llamó", "No vino <strong>nadie</strong>".' },
    { w: 'Interrogativos', a: '❓ Sirven para preguntar, sustituyendo aquello por lo que se pregunta. Llevan tilde. Ej: "¿<strong>Quién</strong> vino?", "¿<strong>Qué</strong> es eso?".' },
    { w: 'Pronombre Enclítico', a: '▶️ Es un pronombre átono que va <strong>pegado al final</strong> del verbo, formando una sola palabra. Ej: Dáme<strong>lo</strong>, ir<strong>se</strong>.' },
    { w: 'Pronombre Proclítico', a: '◀️ Es un pronombre átono que va <strong>separado y antes</strong> del verbo conjugado. Ej: <strong>Te</strong> llamo, <strong>me lo</strong> dijo.' },
    { w: 'El Voseo', a: '🇭🇳 Uso del pronombre <strong>"vos"</strong> en lugar de "tú" para la segunda persona singular. Muy común en Honduras.' },
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
    { q: '¿Cuál es la función principal de un pronombre?', o: ['a) Describir cómo es un objeto', 'b) Sustituir al sustantivo para no repetirlo', 'c) Indicar la acción del sujeto', 'd) Unir dos oraciones'], c: 1 },
    { q: '"El lápiz es MÍO". ¿Qué clase de pronombre es "mío"?', o: ['a) Personal', 'b) Demostrativo', 'c) Posesivo', 'd) Relativo'], c: 2 },
    { q: '"DÁMELO rápido". El pronombre en esta oración es:', o: ['a) Personal Tónico', 'b) Proclítico', 'c) Enclítico', 'd) Demostrativo'], c: 2 },
    { q: '¿Cuál de los siguientes es un pronombre personal TÓNICO?', o: ['a) Me', 'b) Lo', 'c) Nosotros', 'd) Te'], c: 2 },
    { q: '"No vino NADIE a la fiesta". La palabra "nadie" es un pronombre:', o: ['a) Relativo', 'b) Personal', 'c) Demostrativo', 'd) Indefinido'], c: 3 },
    { q: 'En Honduras, el pronombre equivalente al "tú" de España es:', o: ['a) Vosotros', 'b) Vos', 'c) Ustedes', 'd) Os'], c: 1 },
    { q: '"TE lo advertí". El pronombre "te" está funcionando de forma:', o: ['a) Enclítica', 'b) Proclítica', 'c) Posesiva', 'd) Interrogativa'], c: 1 },
    { q: '"El coche QUE compré es azul". La palabra "que" es un pronombre:', o: ['a) Relativo', 'b) Interrogativo', 'c) Personal', 'd) Demostrativo'], c: 0 },
    { q: '¿Cuál de estos es un pronombre demostrativo?', o: ['a) Suyo', 'b) Alguien', 'c) Aquel', 'd) Yo'], c: 2 },
    { q: '¿Qué diferencia a "Aquel carro" de "Quiero AQUEL"?', o: ['a) Ninguna, ambos son pronombres', 'b) El 1ero es determinante (acompaña), el 2do es pronombre (sustituye)', 'c) El 1ero es pronombre, el 2do es adjetivo', 'd) Ambos son adjetivos'], c: 1 },
];
let qzIdx = 0, qzSel = -1, qzDone = false;
function buildQz() { qzIdx = 0; qzSel = -1; qzDone = false; showQz(); }
function showQz() {
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
    setTimeout(() => { qzIdx++; qzSel = -1; showQz(); }, 1600);
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
        label: ['Personal', 'Posesivo'], headA: '👤 Personal', headB: '💼 Posesivo', colA: 'personal', colB: 'posesivo',
        words: [{ w: 'yo', t: 'personal' }, { w: 'mío', t: 'posesivo' }, { w: 'nosotros', t: 'personal' }, { w: 'tuyo', t: 'posesivo' }, { w: 'él', t: 'personal' }, { w: 'suyo', t: 'posesivo' }, { w: 'tú', t: 'personal' }, { w: 'nuestro', t: 'posesivo' }, { w: 'ellos', t: 'personal' }, { w: 'vuestro', t: 'posesivo' }]
    },
    {
        label: ['Demostrativo', 'Indefinido'], headA: '👉 Demostrativo', headB: '🤷 Indefinido', colA: 'demostrativo', colB: 'indefinido',
        words: [{ w: 'este', t: 'demostrativo' }, { w: 'alguien', t: 'indefinido' }, { w: 'ese', t: 'demostrativo' }, { w: 'nadie', t: 'indefinido' }, { w: 'aquel', t: 'demostrativo' }, { w: 'algo', t: 'indefinido' }, { w: 'aquello', t: 'demostrativo' }, { w: 'ninguno', t: 'indefinido' }, { w: 'esto', t: 'demostrativo' }, { w: 'varios', t: 'indefinido' }]
    },
    {
        label: ['Proclítico', 'Enclítico'], headA: '◀️ Proclítico', headB: '▶️ Enclítico', colA: 'proclítico', colB: 'enclítico',
        words: [{ w: 'me dijo', t: 'proclítico' }, { w: 'dámelo', t: 'enclítico' }, { w: 'lo vi', t: 'proclítico' }, { w: 'irse', t: 'enclítico' }, { w: 'te busco', t: 'proclítico' }, { w: 'llámame', t: 'enclítico' }, { w: 'se fue', t: 'proclítico' }, { w: 'cómpralo', t: 'enclítico' }, { w: 'nos llama', t: 'proclítico' }, { w: 'viéndolo', t: 'enclítico' }]
    },
    {
        label: ['Relativo', 'Interrogativo'], headA: '🔗 Relativo', headB: '❓ Interrogativo', colA: 'relativo', colB: 'interrogativo',
        words: [{ w: 'que', t: 'relativo' }, { w: '¿quién?', t: 'interrogativo' }, { w: 'cual', t: 'relativo' }, { w: '¿qué?', t: 'interrogativo' }, { w: 'quien', t: 'relativo' }, { w: '¿cuántos?', t: 'interrogativo' }, { w: 'donde', t: 'relativo' }, { w: '¿cuál?', t: 'interrogativo' }, { w: 'cuyo', t: 'relativo' }, { w: '¿dónde?', t: 'interrogativo' }]
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
    { s: ['Ese', 'libro', 'es', 'mío.'], c: 3, art: 'Pronombre posesivo' },
    { s: ['Alguien', 'llamó', 'por', 'teléfono.'], c: 0, art: 'Pronombre indefinido' },
    { s: ['Nosotros', 'iremos', 'al', 'cine.'], c: 0, art: 'Pronombre personal tónico' },
    { s: ['¿Quién', 'rompió', 'el', 'vaso?'], c: 0, art: 'Pronombre interrogativo' },
    { s: ['Te', 'dije', 'la', 'verdad.'], c: 0, art: 'Pronombre proclítico' },
    { s: ['La', 'niña', 'que', 'canta', 'es', 'mi', 'prima.'], c: 2, art: 'Pronombre relativo' },
    { s: ['No', 'quiero', 'esa,', 'quiero', 'esta.'], c: 4, art: 'Pronombre demostrativo' },
    { s: ['Dámelo', 'ahora', 'mismo.'], c: 0, art: 'Pronombre enclítico' },
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
    document.getElementById('idInfo').textContent = `Busca: ${d.art}`;
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

    if (i === idData[idIdx].c) {
        idDone = true;
        span.classList.add('id-ok'); fb('fbId', '¡Correcto! +5 XP', true);
        if (!xpTracker.id.has(idIdx)) { xpTracker.id.add(idIdx); pts(5); }
        sfx('ok');
    } else {
        span.classList.add('id-no'); fb('fbId', 'Ese no es el pronombre solicitado.', false); sfx('no');
    }
}
function nextId() { sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId() { sfx('click'); idIdx = 0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData = [
    { s: 'El ___ es la palabra que sustituye al sustantivo.', opts: ['adjetivo', 'pronombre', 'verbo'], c: 1 },
    { s: 'Los pronombres ___ indican cercanía, distancia media o lejanía.', opts: ['personales', 'demostrativos', 'indefinidos'], c: 1 },
    { s: 'Un pronombre átono que va antes del verbo conjugado se llama ___.', opts: ['enclítico', 'proclítico', 'tónico'], c: 1 },
    { s: 'El pronombre "vos" utilizado en Honduras reemplaza al pronombre "___".', opts: ['tú', 'él', 'nosotros'], c: 0 },
    { s: '"El regalo es TUYO". La palabra "tuyo" es un pronombre ___.', opts: ['personal', 'posesivo', 'demostrativo'], c: 1 },
    { s: 'Un pronombre pegado al final de un verbo (ej: "dámelo") se llama ___.', opts: ['enclítico', 'proclítico', 'relativo'], c: 0 },
    { s: '"NADIE lo sabía". La palabra "nadie" es un pronombre ___.', opts: ['relativo', 'interrogativo', 'indefinido'], c: 2 },
    { s: 'Los pronombres personales ___ pueden funcionar como sujeto por sí solos.', opts: ['tónicos', 'átonos', 'relativos'], c: 0 },
];
let cmpIdx = 0, cmpSel = -1, cmpDone = false;
function showCmp() {
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
    setTimeout(() => { cmpIdx++; document.getElementById('fbCmp').classList.remove('show'); showCmp(); }, 1600);
}

// ===================== RETO FINAL =====================
const retoPairs = [
    {
        label: ['Proclítico', 'Enclítico'], btnA: '◀️ Proclítico', btnB: '▶️ Enclítico',
        colA: 'proclítico', colB: 'enclítico',
        words: [
            { w: 'te veo', t: 'proclítico' }, { w: 'vete', t: 'enclítico' }, { w: 'me dijo', t: 'proclítico' },
            { w: 'dímelo', t: 'enclítico' }, { w: 'lo sabe', t: 'proclítico' }, { w: 'marcharse', t: 'enclítico' },
            { w: 'se fue', t: 'proclítico' }, { w: 'sabiéndolo', t: 'enclítico' }, { w: 'nos llama', t: 'proclítico' },
            { w: 'dámelo', t: 'enclítico' }, { w: 'le di', t: 'proclítico' }, { w: 'cómpralo', t: 'enclítico' },
        ]
    },
    {
        label: ['Personal', 'Posesivo'], btnA: '👤 Personal', btnB: '💼 Posesivo',
        colA: 'personal', colB: 'posesivo',
        words: [
            { w: 'yo', t: 'personal' }, { w: 'mío', t: 'posesivo' }, { w: 'nosotros', t: 'personal' }, { w: 'tuyo', t: 'posesivo' },
            { w: 'él', t: 'personal' }, { w: 'suyo', t: 'posesivo' }, { w: 'tú', t: 'personal' }, { w: 'nuestro', t: 'posesivo' },
            { w: 'ellos', t: 'personal' }, { w: 'vuestro', t: 'posesivo' },
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
    { s: 'Nosotros compramos el pan.', type: 'Pronombre personal tónico (Nosotros)' },
    { s: 'Ese libro es mío.', type: 'Posesivo (mío) / Demostrativo (Ese)' },
    { s: 'Alguien llamó a la puerta.', type: 'Indefinido (Alguien)' },
    { s: '¿Quién trajo los dulces?', type: 'Interrogativo (Quién)' },
    { s: 'La niña que canta es mi prima.', type: 'Relativo (que)' },
    { s: 'Te dije la verdad ayer.', type: 'Proclítico (Te)' },
    { s: 'Dámelo rápido, por favor.', type: 'Enclítico (-me, -lo en Dámelo)' },
    { s: 'Nadie vino a la reunión.', type: 'Indefinido (Nadie)' },
    { s: 'Él me lo explicó todo.', type: 'Personal tónico (Él) / Proclíticos (me, lo)' },
    { s: 'Esto no me gusta nada.', type: 'Demostrativo (Esto) / Proclítico (me)' },
];
const classifyTaskDB = [
    { w: 'yo', tipo: 'Personal', subtipo: 'Tónico', posición: '-' },
    { w: 'mío', tipo: 'Posesivo', subtipo: '-', posición: '-' },
    { w: 'alguien', tipo: 'Indefinido', subtipo: '-', posición: '-' },
    { w: 'que', tipo: 'Relativo', subtipo: '-', posición: '-' },
    { w: 'dámelo', tipo: 'Personal átono', subtipo: 'Enclítico', posición: 'Pegado al final' },
    { w: 'te dije', tipo: 'Personal átono', subtipo: 'Proclítico', posición: 'Antes del verbo' },
    { w: 'aquel', tipo: 'Demostrativo', subtipo: '-', posición: '-' },
    { w: '¿quién?', tipo: 'Interrogativo', subtipo: '-', posición: '-' },
];
const completeTaskDB = [
    { s: '___ iremos al parque esta tarde.', opts: ['Nosotros', 'Mío', 'Alguien'], ans: 'Nosotros' },
    { s: 'El cuaderno es ___. No lo toques.', opts: ['mío', 'yo', 'que'], ans: 'mío' },
    { s: '___ llamó por teléfono anoche.', opts: ['Aquel', 'Alguien', 'Tuyo'], ans: 'Alguien' },
    { s: 'El perro ___ ladra es de mi vecino.', opts: ['quien', 'que', 'cual'], ans: 'que' },
    { s: '¿___ trajo esa comida tan rica?', opts: ['Quién', 'Que', 'Nadie'], ans: 'Quién' },
    { s: 'Dá___ el libro que te pedí.', opts: ['me', 'mío', 'yo'], ans: 'me' },
    { s: '___ de los estudiantes aprobó el examen.', opts: ['Ninguno', 'Ese', 'Suyo'], ans: 'Ninguno' },
    { s: 'Vos ___ muy buena persona.', opts: ['sos', 'eres', 'sois'], ans: 'sos' },
];
const explainQuestions = [
    { q: '¿Qué es un pronombre y para qué sirve?', ans: 'Sustituye al sustantivo para evitar repeticiones. Ej: Yo, él, esto.' },
    { q: '¿Cuál es la diferencia entre un pronombre tónico y uno átono?', ans: 'El tónico funciona solo (yo, tú), el átono necesita al verbo (me, te, se).' },
    { q: '¿Qué es un pronombre enclítico? Da un ejemplo.', ans: 'Es un pronombre átono pegado al final del verbo. Ej: dámelo, irse.' },
    { q: 'Explica la diferencia entre pronombre demostrativo y determinante demostrativo.', ans: 'El pronombre va solo y sustituye (quiero ese), el determinante acompaña al nombre (ese libro).' },
    { q: '¿Qué es el voseo? ¿Dónde se usa?', ans: 'Es el uso de "vos" en lugar de "tú". Se usa en Honduras y Centroamérica.' },
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
    _instrBlock(out, 'Instrucción', ['Copia en tu cuaderno; subraya, colorea o encierra el pronombre en las siguientes oraciones. Escribe al lado qué tipo de pronombre es.', '<strong>Ejemplo:</strong> Nosotros compramos el pan. → <span style="color:var(--jade);font-weight:700;">Pronombre personal tónico (Nosotros)</span>']);
    _pick(identifyTaskDB, Math.min(count, identifyTaskDB.length)).forEach((item, i) => {
        const div = document.createElement('div'); div.className = 'tg-task';
        div.innerHTML = `<div class="tg-task-num">${i + 1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
        out.appendChild(div);
    });
}

function genClassifyTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia la siguiente tabla en tu cuaderno. Para cada pronombre, escribe su tipo, subtipo y posición (si aplica).']);
    const items = _pick(classifyTaskDB, Math.min(count, classifyTaskDB.length));
    const wrap = document.createElement('div'); wrap.style.overflowX = 'auto';
    const th = (t, extra = '') => `<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;
    let html = `<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Pronombre', 'text-align:left;')}${th('Tipo')}${th('Subtipo')}${th('Posición')}</tr></thead><tbody>`;
    items.forEach(it => {
        html += `<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>` + Array(3).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('') + '</tr>';
    });
    html += '</tbody></table>';
    wrap.innerHTML = html; out.appendChild(wrap);
    const ans = document.createElement('div'); ans.className = 'tg-answer'; ans.style.marginTop = '0.8rem';
    ans.innerHTML = '<strong>✅ Respuestas:</strong><br>' + items.map(it => {
        return `<strong>${it.w}:</strong> Tipo: ${it.tipo} | Subtipo: ${it.subtipo} | Posición: ${it.posición}`;
    }).join('<br>');
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
            ['P', 'R', 'O', 'N', 'O', 'M', 'B', 'R', 'E', 'S'],
            ['Z', 'D', 'Y', 'U', 'I', 'P', 'K', 'L', 'M', 'U'],
            ['M', 'E', 'J', 'O', 'R', 'E', 'L', 'A', 'T', 'Y'],
            ['F', 'M', 'H', 'E', 'J', 'R', 'L', 'Z', 'X', 'O'],
            ['C', 'O', 'T', 'Y', 'T', 'S', 'I', 'O', 'P', 'Q'],
            ['A', 'S', 'D', 'F', 'G', 'O', 'H', 'J', 'K', 'W'],
            ['W', 'T', 'O', 'W', 'E', 'N', 'V', 'T', 'Y', 'U'],
            ['N', 'R', 'T', 'X', 'C', 'A', 'B', 'O', 'N', 'M'],
            ['A', 'A', 'Z', 'O', 'L', 'L', 'E', 'S', 'U', 'I'],
            ['D', 'T', 'U', 'Y', 'O', 'N', 'A', 'D', 'I', 'E'],
        ],
        words: [
            { w: 'PRONOMBRE', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8]] },
            { w: 'SUYO', cells: [[0, 9], [1, 9], [2, 9], [3, 9]] },
            { w: 'TUYO', cells: [[9, 1], [9, 2], [9, 3], [9, 4]] },
            { w: 'NADIE', cells: [[9, 5], [9, 6], [9, 7], [9, 8], [9, 9]] },
            { w: 'PERSONAL', cells: [[1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5]] },
            { w: 'RELATIVO', cells: [[2, 6], [2, 7], [2, 8], [3, 8], [4, 8], [5, 8], [6, 8], [7, 8]] },
            { w: 'DEMOSTRATIVO', cells: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1], [9, 1], [9, 2], [9, 3]] },
        ]
    },
    {
        size: 10,
        grid: [
            ['W', 'Z', 'A', 'T', 'O', 'N', 'O', 'I', 'N', 'T'],
            ['P', 'O', 'S', 'E', 'S', 'I', 'V', 'O', 'U', 'O'],
            ['O', 'S', 'Q', 'P', 'E', 'V', 'R', 'D', 'F', 'N'],
            ['R', 'H', 'J', 'U', 'E', 'L', 'Z', 'X', 'P', 'I'],
            ['Q', 'C', 'V', 'B', 'I', 'N', 'D', 'E', 'F', 'C'],
            ['U', 'Q', 'W', 'E', 'O', 'V', 'O', 'S', 'T', 'O'],
            ['E', 'Y', 'U', 'J', 'I', 'O', 'L', 'P', 'A', 'S'],
            ['V', 'A', 'L', 'G', 'U', 'I', 'E', 'N', 'H', 'M'],
            ['O', 'M', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'E'],
            ['S', 'N', 'M', 'E', 'N', 'C', 'L', 'I', 'T', 'I'],
        ],
        words: [
            { w: 'POSESIVO', cells: [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7]] },
            { w: 'TONICO', cells: [[0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9]] },
            { w: 'ALGUIEN', cells: [[7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6], [7, 7]] },
            { w: 'VOS', cells: [[5, 7], [6, 7], [7, 7]] },
            { w: 'ENCLITICO', cells: [[9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9], [8, 9], [7, 9]] },
            { w: 'ATONO', cells: [[0, 2], [0, 3], [0, 4], [0, 5], [0, 6]] },
            { w: 'PORQUE', cells: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]] },
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
    { q: 'El pronombre es una palabra que se usa para sustituir al sustantivo y evitar repeticiones.', a: true },
    { q: '"Nosotros" es un pronombre personal tónico.', a: true },
    { q: 'Un pronombre enclítico va escrito después del verbo y unido a él (ej: dímelo).', a: true },
    { q: 'Los pronombres relativos (que, quien, cual) sirven para realizar preguntas directas.', a: false },
    { q: 'En "Este libro es mío", la palabra "mío" es un pronombre posesivo.', a: true },
    { q: '"Alguien" y "nadie" son ejemplos de pronombres indefinidos.', a: true },
    { q: 'El pronombre "te" en "te llamo mañana" es un pronombre tónico.', a: false },
    { q: 'Los pronombres demostrativos sustituyen al nombre indicando la distancia (cerca, media, lejos).', a: true },
    { q: 'En "Mi casa", la palabra "Mi" es un pronombre posesivo.', a: false },
    { q: 'El uso de "vos" en Honduras es un ejemplo de pronombre de segunda persona singular.', a: true },
    { q: '"Dáselo" tiene pronombres proclíticos.', a: false },
    { q: 'Los pronombres interrogativos siempre llevan tilde (qué, quién, cuánto).', a: true },
    { q: 'El pronombre es una palabra que se usa para nombrar las cualidades de las cosas.', a: false },
    { q: '"Me, te, se, lo, la" son pronombres personales átonos.', a: true },
    { q: 'Los pronombres posesivos acompañan al sustantivo igual que los determinantes.', a: false },
];
const evalMCBank = [
    { q: '¿Cuál es la función del pronombre en la oración?', o: ['a) Describir', 'b) Sustituir al sustantivo', 'c) Unir párrafos', 'd) Indicar acción'], a: 1 },
    { q: '"La niña QUE canta es mi hermana". La palabra en mayúsculas es un pronombre:', o: ['a) Posesivo', 'b) Personal', 'c) Relativo', 'd) Demostrativo'], a: 2 },
    { q: '¿Cuál de estos es un pronombre enclítico?', o: ['a) Me dijo', 'b) Se fue', 'c) Irse', 'd) Te busco'], a: 2 },
    { q: '"No quiero este, dame AQUEL". La palabra en mayúsculas es un pronombre:', o: ['a) Personal', 'b) Demostrativo', 'c) Indefinido', 'd) Numeral'], a: 1 },
    { q: '¿Qué pronombre personal reemplaza a "tú" en el habla hondureña?', o: ['a) Ustedes', 'b) Nosotros', 'c) Vosotros', 'd) Vos'], a: 3 },
    { q: 'En "LO compré ayer", el pronombre "LO" es:', o: ['a) Proclítico', 'b) Enclítico', 'c) Tónico', 'd) Demostrativo'], a: 0 },
    { q: '¿Qué tipo de pronombre indica una cantidad o identidad imprecisa?', o: ['a) Relativo', 'b) Posesivo', 'c) Indefinido', 'd) Tónico'], a: 2 },
    { q: '"¿QUIÉN llegó?". Es un pronombre:', o: ['a) Interrogativo', 'b) Relativo', 'c) Personal', 'd) Exclamativo'], a: 0 },
    { q: '"El lápiz es MÍO". ¿Qué clase de pronombre es "mío"?', o: ['a) Personal', 'b) Demostrativo', 'c) Posesivo', 'd) Relativo'], a: 2 },
    { q: '¿Cuál de los siguientes es un pronombre personal tónico?', o: ['a) Me', 'b) Lo', 'c) Nosotros', 'd) Te'], a: 2 },
    { q: '"No vino NADIE a la fiesta". La palabra "nadie" es un pronombre:', o: ['a) Relativo', 'b) Personal', 'c) Demostrativo', 'd) Indefinido'], a: 3 },
    { q: '"TE lo advertí". El pronombre "te" funciona de forma:', o: ['a) Enclítica', 'b) Proclítica', 'c) Posesiva', 'd) Interrogativa'], a: 1 },
    { q: '¿Cuál de estos es un pronombre demostrativo?', o: ['a) Suyo', 'b) Alguien', 'c) Aquel', 'd) Yo'], a: 2 },
    { q: 'En "DÁMELO rápido", el pronombre es:', o: ['a) Tónico', 'b) Proclítico', 'c) Enclítico', 'd) Demostrativo'], a: 2 },
    { q: '"El coche QUE compré es azul". La palabra "que" es un pronombre:', o: ['a) Relativo', 'b) Interrogativo', 'c) Personal', 'd) Demostrativo'], a: 0 },
];
const evalCPBank = [
    { q: 'La función del ___ es evitar repeticiones sustituyendo al sustantivo.', a: 'pronombre' },
    { q: 'Los pronombres personales ___ no dependen del verbo y pueden funcionar solos (ej: Yo, tú, él).', a: 'tónicos' },
    { q: 'El pronombre átono que va antes y separado del verbo conjugado se llama ___.', a: 'proclítico' },
    { q: 'El pronombre átono que va pegado al final del verbo (ej: dímelo) se llama ___.', a: 'enclítico' },
    { q: '"Mío", "tuyo", y "suyo" son pronombres ___.', a: 'posesivos' },
    { q: 'Los pronombres ___ indican la distancia entre el hablante y el objeto sustituido (este, ese, aquel).', a: 'demostrativos' },
    { q: 'Palabras como "alguien", "algo" o "nadie" funcionan como pronombres ___.', a: 'indefinidos' },
    { q: 'Los pronombres ___ enlazan oraciones refiriéndose a un antecedente ya mencionado (que, cual).', a: 'relativos' },
    { q: 'Los pronombres ___ sirven para preguntar y llevan tilde (qué, quién, cuánto).', a: 'interrogativos' },
    { q: 'En Honduras se usa el pronombre "___ " en lugar de "tú".', a: 'vos' },
    { q: 'Los pronombres "me, te, se, lo, la, le" son pronombres personales ___.', a: 'átonos' },
    { q: 'El pronombre que sustituye sin precisar cantidad exacta se llama ___.', a: 'indefinido' },
    { q: 'Un pronombre que va antes del verbo y separado de él se denomina ___.', a: 'proclítico' },
    { q: '"Yo, tú, él, nosotros, ustedes" son pronombres personales ___.', a: 'tónicos' },
    { q: 'El pronombre ___ se refiere a un antecedente ya mencionado y une oraciones.', a: 'relativo' },
];
const evalPRBank = [
    { term: 'Pronombre Personal Tónico', def: 'Funciona solo, no depende del verbo (Yo, tú, nosotros)' },
    { term: 'Pronombre Átono Proclítico', def: 'Va antes del verbo y separado (Me lo dio)' },
    { term: 'Pronombre Átono Enclítico', def: 'Va después del verbo y unido (Dámelo)' },
    { term: 'Pronombre Demostrativo', def: 'Sustituye indicando distancia (este, ese, aquel)' },
    { term: 'Pronombre Posesivo', def: 'Sustituye indicando pertenencia (mío, tuyo, suyo)' },
    { term: 'Pronombre Indefinido', def: 'Sustituye sin precisar cantidad exacta (alguien, nadie)' },
    { term: 'Pronombre Relativo', def: 'Une oraciones refiriéndose a un nombre anterior (que, cual)' },
    { term: 'Pronombre Interrogativo', def: 'Se usa para preguntar y lleva tilde (quién, qué)' },
    { term: 'Voseo', def: 'Uso de "vos" en lugar de "tú" en Honduras y Centroamérica' },
    { term: 'Pronombre Personal Átono', def: 'Acompaña obligatoriamente al verbo (me, te, se, lo)' },
    { term: 'Concordancia pronominal', def: 'El pronombre debe coincidir en persona y número' },
    { term: 'Antecedente', def: 'Sustantivo al que se refiere el pronombre relativo' },
    { term: 'Tónico', def: 'Tiene acento propio y puede funcionar independientemente' },
    { term: 'Átono', def: 'Sin acento propio, depende del verbo para funcionar' },
    { term: 'Persona gramatical', def: 'Categoría que indica quién habla (1ª), a quién (2ª) o de quién (3ª)' },
];

function genEval() {
    sfx('click');
    const cf = evalFormNum;
    window._currentEvalForm = cf;
    evalFormNum = (evalFormNum % 10) + 1;
    saveProgress();
    document.getElementById('eval-screen-title').textContent = `📝 Evaluación Final — Forma ${cf} · Los Pronombres`;
    evalAnsVisible = false;
    const out = document.getElementById('evalOut'); out.innerHTML = '';
    const bar = document.createElement('div'); bar.className = 'eval-score-bar';
    bar.innerHTML = `<div><div class="esb-title">📊 Distribución de puntaje — 100 puntos</div><div class="esb-dist">Cada sección vale 25 puntos (5 preguntas × 5 pts)</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">Completar 25 pts</span><span class="eval-score-pill esp-tf">V/F 25 pts</span><span class="eval-score-pill esp-mc">Selección 25 pts</span><span class="eval-score-pill esp-pr">Pareados 25 pts</span></div>`;
    out.appendChild(bar);
    const cpItems = _pick(evalCPBank, 5);
    const s1 = document.createElement('div'); s1.innerHTML = '<div class="eval-section-title">I. Completar el espacio <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
    cpItems.forEach((item, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.dataset.evalType = 'cp'; d.dataset.evalIndex = i; const qHtml = item.q.replace('___', `<input class="eval-cp-input" type="text" data-cp="${i}" autocomplete="off">`); d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 1}</span><span class="eval-q-text">${qHtml}</span></div><div class="eval-answer">${item.a}</div><div class="eval-item-feedback" id="evalFbCp${i}" aria-live="polite"></div>`; s1.appendChild(d); });
    out.appendChild(s1);
    const tfItems = _pick(evalTFBank, 5);
    const s2 = document.createElement('div'); s2.innerHTML = '<div class="eval-section-title">II. Verdadero o Falso <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
    tfItems.forEach((item, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.dataset.evalType = 'tf'; d.dataset.evalIndex = i; d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 6}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-tf-opts"><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="true"> Verdadero</label><label class="eval-tf-opt"><input type="radio" name="tf${i}" value="false"> Falso</label></div><div class="eval-answer">${item.a ? 'Verdadero' : 'Falso'}</div><div class="eval-item-feedback" id="evalFbTf${i}" aria-live="polite"></div>`; s2.appendChild(d); });
    out.appendChild(s2);
    const mcItems = _pick(evalMCBank, 5);
    const s3 = document.createElement('div'); s3.innerHTML = '<div class="eval-section-title">III. Selección Múltiple <span class="eval-pts">25 pts · 5 pts c/u</span></div>';
    mcItems.forEach((item, i) => { const d = document.createElement('div'); d.className = 'eval-item eval-auto-item'; d.dataset.evalType = 'mc'; d.dataset.evalIndex = i; const optsHtml = item.o.map((op, oi) => `<label class="eval-mc-opt"><input type="radio" name="mc${i}" value="${oi}"> ${op}</label>`).join(''); d.innerHTML = `<div class="eval-q"><span class="eval-num">${i + 11}</span><span class="eval-q-text">${item.q}</span></div><div class="eval-mc-opts">${optsHtml}</div><div class="eval-answer">${item.o[item.a]}</div><div class="eval-item-feedback" id="evalFbMc${i}" aria-live="polite"></div>`; s3.appendChild(d); });
    out.appendChild(s3);
    const prItems = _pick(evalPRBank, 5); const shuffledDefs = [...prItems].sort(() => Math.random() - 0.5); const letters = ['A', 'B', 'C', 'D', 'E'];
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

    const doc = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evaluación Los Pronombres · Forma ${forma}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body {font-family:Arial,Helvetica,sans-serif;font-size:10.5pt;color:#111;background:#fff;padding:2mm 5mm;}
.ph{margin-bottom:0.4rem;}
.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.3rem;}
.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}
.ph-fill{flex:1;border-bottom:1px solid #555;min-height:11px;display:block;}
.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}
.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}
.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}
.ph-crit{font-size:9pt;text-align:center;color:#555;margin-top:0.1rem;}
.sec-title {font-size:10pt;font-weight:700;padding:0.15rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #c49000;background:#fef9e7;color:#c49000;}
.obt-row {display:flex;align-items:baseline;gap:4px;font-size:9pt;font-weight:700;font-style:italic;color:#c49000;}
.obt-lbl{white-space:nowrap;}
.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #c49000;height:12px;}
.obt-pct{white-space:nowrap;}
.qn{font-weight:700;min-width:20px;flex-shrink:0;}
.tf-row{display:flex;align-items:baseline;gap:0.25rem;font-size:9pt;line-height:1.32;padding:0.15rem 0.2rem;border-bottom:1px solid #eee;}
.tf-blank{display:inline-block;min-width:38px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.15rem;}
.tf-text{flex:1;}
.mc-item {border:1px solid #ddd;border-radius:4px;padding:0.15rem 0.3rem;margin-bottom:0.12rem;break-inside:avoid;page-break-inside:avoid;}
.mc-q{font-size:9pt;line-height:1.32;display:flex;gap:0.25rem;margin-bottom:0.1rem;}
.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.15rem 0.5rem;}
.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.05rem 0.2rem;margin-left:1.2rem;}
.mc-opt{font-size:8.5pt;display:flex;align-items:center;gap:0.2rem;}
.mc-opt input{width:11px;height:11px;flex-shrink:0;}
.cp-row{display:flex;align-items:baseline;gap:0.25rem;font-size:9pt;line-height:1.32;padding:0.15rem 0.2rem;border-bottom:1px solid #eee;}
.cp-text{flex:1;}
.cp-blank{display:inline-block;min-width:140px;border-bottom:1.5px solid #111;margin:0 0.1rem;}
.pr-section{margin-top:0.2rem;}
.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.2rem 0.5rem;margin-top:0.1rem;}
.pr-head{font-size:8pt;font-weight:700;color:#555;margin-bottom:0.15rem;}
.pr-item {font-size:9.5pt;padding:0.15rem 0.25rem;background:#fef9e7;border-radius:3px;margin-bottom:0.1rem;display:flex;align-items:center;gap:0.2rem;line-height:1.15;break-inside:avoid;page-break-inside:avoid;}
.pr-num {font-weight:700;color:#c49000;min-width:17px;flex-shrink:0;}
.pr-line{display:inline-block;min-width:17px;border-bottom:1.5px solid #111;margin-right:0.12rem;flex-shrink:0;}
.total-row {display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.3rem;padding:0.2rem 0;page-break-before:avoid;break-before:avoid;color:#c49000;}
.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #c49000;}
.pauta-wrap{page-break-before:always;padding-top:0.4rem;}
.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}
.p-main{font-size:9.5pt;font-weight:700;}
.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}
.p-meta{font-size:7pt;color:#555;}
.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}
.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.25rem 0.4rem;}
.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.15rem;}
.p-tbl{width:100%;border-collapse:collapse;font-size:7.5pt;}
.p-tbl tr{border-bottom:1px dotted #ddd;}
.p-tbl td{padding:0.07rem 0.12rem;vertical-align:top;}
.pn{font-weight:700;width:16px;color:#555;}.pa{color:#007a00;font-weight:600;}
.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}
@media print{@page{margin:4mm 6mm;}}
</style></head><body>
<div class="ph">
  <h2>Evaluación Final de Misión Los Pronombres — Español — Lengua</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
<div class="pauta-wrap">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · Misión Los Pronombres · Forma ${forma}</div>
    <div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div>
    <div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div>
  </div>
  <div class="p-grid">${pR}</div>
</div>
<div class="forma-tag">Forma ${forma}</div>
</body></html>`;

    const win = window.open('', '_blank', '');
    if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
    win.document.write(doc);
    win.document.close();
    setTimeout(() => win.print(), 400);
}

// ===================== DIPLOMA =====================
function openDiploma() {
    sfx('click');
    const pct = getProgress();
    document.getElementById('diplPct').textContent = pct + '%';
    document.getElementById('diplPct').style.color = pct >= 70 ? 'var(--jade)' : pct >= 40 ? 'var(--blue)' : 'var(--amber)';
    document.getElementById('diplBar').style.width = pct + '%';
    const stars = pct === 100 ? '⭐⭐⭐⭐⭐' : pct >= 80 ? '⭐⭐⭐⭐' : pct >= 60 ? '⭐⭐⭐' : pct >= 40 ? '⭐⭐' : '⭐';
    document.getElementById('diplStars').textContent = stars;
    const msgs = ['🚀 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!', '🌱 ¡GRAN INICIO! Estás dando los primeros pasos.', '📚 ¡BUEN TRABAJO! Vas progresando muy bien.', '💪 ¡MUY BIEN! Dominas gran parte de la sustitución pronominal.', '🌟 ¡INCREÍBLE avance! Estás cerca de la excelencia gramatical.', '🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Pronombres!'];
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
    const pct = getProgress(); const name = document.getElementById('diplName').textContent;
    const stars = document.getElementById('diplStars').textContent;
    const msg = document.getElementById('diplMsg').textContent;
    const date = document.getElementById('diplDate').textContent;
    const achText = unlockedAch.map(id => ACHIEVEMENTS[id].icon + ' ' + ACHIEVEMENTS[id].label).join('\n');
    const txt = `${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: Los Pronombres\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText ? '\n\n🏅 Logros desbloqueados:\n' + achText : ''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo Familia Polanco-Castellanos\n🌐 policastsapien.com`;
    window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadProgress();
    upFC(); buildQz(); buildClass(); showId(); showCmp(); buildSopa(); genEval();
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
    const savedName = localStorage.getItem('nombreEstudiantePronombres');
    const inputName = document.querySelector('.diploma-input');
    if (savedName && inputName) { inputName.value = savedName; updateDiplomaName(savedName); }
    if (inputName) inputName.addEventListener('input', e => localStorage.setItem('nombreEstudiantePronombres', e.target.value));
    fin('s-aprende', false);
    fin('s-tipos', false);
});