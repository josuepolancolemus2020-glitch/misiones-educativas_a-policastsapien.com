// Función para hacer la letra más grande (Accesibilidad)
function toggleLetra() {
    document.body.classList.toggle('letra-grande');

    // Si tienes activados los sonidos, que suene al hacer clic
    if (typeof sfx === 'function') sfx('click');

    // Guardar la preferencia para que no se borre al cambiar de página
    const estaActivado = document.body.classList.contains('letra-grande');
    localStorage.setItem('preferenciaLetra', estaActivado);
}

// Revisar la memoria al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('preferenciaLetra') === 'true') {
        document.body.classList.add('letra-grande');
    }
});

// ===================== UTILIDADES =====================
const _pick = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const _shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// ===================== VARIABLES GLOBALES =====================
const SAVE_KEY = 'verbos_v2_basica';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1;
let unlockedAch = [];
let darkMode = false;
let prevLevel = 0;
const TOTAL_SECTIONS = 11;

// XP TRACKER — previene doble puntuación
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
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ doneSections: Array.from(done), unlockedAch, evalFormNum })); } catch (e) { }
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
    const colors = ['#e84393', '#0984e3', '#00b894', '#fdcb6e', '#6c5ce7'];
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
}
function fb(id, msg, ok) {
    const el = document.getElementById(id);
    el.textContent = msg; el.className = 'fb show ' + (ok ? 'ok' : 'err');
    setTimeout(() => el.classList.remove('show'), 3500);
}

// ===================== FLASHCARD DATA =====================
const fcData = [
    { w: 'Verbo', a: '🏃‍♂️ Palabra que expresa una <strong>acción</strong>, <strong>estado</strong> o <strong>proceso</strong> del sujeto.' },
    { w: 'Infinitivo', a: '🏁 Nombre del verbo. Sus terminaciones son <strong>-ar</strong>, <strong>-er</strong>, o <strong>-ir</strong> (amar, comer, vivir).' },
    { w: 'Raíz', a: '🌱 Parte invariable del verbo que contiene su <strong>significado principal</strong>. Ej: de <em>cant-ar</em> es <em>cant-</em>.' },
    { w: 'Desinencia', a: '🧩 Parte final que se añade a la raíz para indicar tiempo, persona y número. Ej: cant-<em>amos</em>.' },
    { w: 'Tiempo Pasado', a: '⏪ Expresa una acción que <strong>ya ocurrió</strong>. Ej: Yo <em>jugué</em>, tú <em>comiste</em>.' },
    { w: 'Tiempo Presente', a: '▶️ Expresa una acción que ocurre <strong>en este momento</strong>. Ej: Yo <em>juego</em>, él <em>corre</em>.' },
    { w: 'Tiempo Futuro', a: '⏩ Expresa una acción que <strong>ocurrirá después</strong>. Ej: Yo <em>jugaré</em>, nosotros <em>dormiremos</em>.' },
    { w: 'Modo Indicativo', a: '✅ Expresa hechos <strong>reales o seguros</strong>. Ej: Él <em>estudia</em> mucho.' },
    { w: 'Modo Subjuntivo', a: '💭 Expresa <strong>dudas, deseos o posibilidades</strong>. Ej: Ojalá él <em>estudie</em>.' },
    { w: 'Modo Imperativo', a: '⚠️ Expresa <strong>órdenes, mandatos o ruegos</strong>. Ej: ¡<em>Estudia</em> ahora mismo!' },
    { w: 'Verbo Regular', a: '📏 Al conjugarse, <strong>mantiene su raíz igual</strong> en todos los tiempos. Ej: cantar (canto, canté).' },
    { w: 'Verbo Irregular', a: '🔄 Al conjugarse, <strong>cambia su raíz</strong> o desinencia. Ej: ir (fui, iré), ser (soy, seré).' },
    { w: 'Persona Gramatical', a: '🗣️ Indica quién realiza la acción: <strong>1ra</strong> (yo/nosotros), <strong>2da</strong> (tú/ustedes), <strong>3ra</strong> (él/ellos).' },
    { w: 'Número Gramatical', a: '🔢 Indica si la acción la realiza uno (<strong>Singular</strong>) o varios sujetos (<strong>Plural</strong>).' },
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
    { q: '¿Qué expresa un verbo?', o: ['a) Una característica del sujeto', 'b) El nombre de un objeto', 'c) Una acción, estado o proceso', 'd) La unión de dos oraciones'], c: 2 },
    { q: '¿Cuáles son las terminaciones del infinitivo?', o: ['a) -ando, -iendo', 'b) -ar, -er, -ir', 'c) -ado, -ido', 'd) -o, -as, -a'], c: 1 },
    { q: 'Si digo «Yo comeré pizza», ¿en qué tiempo está el verbo?', o: ['a) Pasado', 'b) Presente', 'c) Futuro', 'd) Infinitivo'], c: 2 },
    { q: '¿Cuál es la raíz del verbo «correr»?', o: ['a) cor-', 'b) corr-', 'c) -er', 'd) corre-'], c: 1 },
    { q: '¿Qué verbo está en plural?', o: ['a) saltó', 'b) dormimos', 'c) ríes', 'd) pinto'], c: 1 },
    { q: '«Ojalá ganemos el partido». ¿En qué modo está el verbo?', o: ['a) Indicativo', 'b) Imperativo', 'c) Subjuntivo', 'd) Infinitivo'], c: 2 },
    { q: '¿Cuál de estos es un verbo copulativo?', o: ['a) saltar', 'b) escribir', 'c) parecer', 'd) pensar'], c: 2 },
    { q: 'Un verbo es regular cuando...', o: ['a) Siempre termina en -ar', 'b) Mantiene su raíz al conjugarlo', 'c) Cambia su raíz al conjugarlo', 'd) Solo tiene tiempo presente'], c: 1 },
    { q: '¿En qué persona está el verbo en la oración «Tú estudias mucho»?', o: ['a) Primera persona', 'b) Segunda persona', 'c) Tercera persona', 'd) No tiene persona'], c: 1 },
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

// ===================== CLASIFICACIÓN — múltiples grupos =====================
const classGroups = [
    {
        label: ['Pasado', 'Futuro'], headA: '⏪ Pasado', headB: '⏩ Futuro', colA: 'pasado', colB: 'futuro',
        words: [{ w: 'canté', t: 'pasado' }, { w: 'vivieron', t: 'pasado' }, { w: 'comimos', t: 'pasado' }, { w: 'saltó', t: 'pasado' }, { w: 'escribió', t: 'pasado' }, { w: 'cantaré', t: 'futuro' }, { w: 'vivirán', t: 'futuro' }, { w: 'comeremos', t: 'futuro' }, { w: 'saltará', t: 'futuro' }, { w: 'escribirá', t: 'futuro' }]
    },
    {
        label: ['Singular', 'Plural'], headA: '👤 Singular', headB: '👥 Plural', colA: 'singular', colB: 'plural',
        words: [{ w: 'yo corro', t: 'singular' }, { w: 'él pinta', t: 'singular' }, { w: 'tú lees', t: 'singular' }, { w: 'ella viaja', t: 'singular' }, { w: 'usted come', t: 'singular' }, { w: 'nosotros corremos', t: 'plural' }, { w: 'ellos pintan', t: 'plural' }, { w: 'vosotros leéis', t: 'plural' }, { w: 'ellas viajan', t: 'plural' }, { w: 'ustedes comen', t: 'plural' }]
    },
    {
        label: ['Regular', 'Irregular'], headA: '📏 Regular', headB: '🔄 Irregular', colA: 'regular', colB: 'irregular',
        words: [{ w: 'amar', t: 'regular' }, { w: 'cantar', t: 'regular' }, { w: 'beber', t: 'regular' }, { w: 'vivir', t: 'regular' }, { w: 'saltar', t: 'regular' }, { w: 'ir', t: 'irregular' }, { w: 'ser', t: 'irregular' }, { w: 'estar', t: 'irregular' }, { w: 'tener', t: 'irregular' }, { w: 'venir', t: 'irregular' }]
    },
    {
        label: ['Acción', 'Estado (Copulativo)'], headA: '🏃‍♂️ Acción', headB: '🧘‍♂️ Estado', colA: 'accion', colB: 'estado',
        words: [{ w: 'correr', t: 'accion' }, { w: 'saltar', t: 'accion' }, { w: 'pensar', t: 'accion' }, { w: 'escribir', t: 'accion' }, { w: 'dibujar', t: 'accion' }, { w: 'ser', t: 'estado' }, { w: 'estar', t: 'estado' }, { w: 'parecer', t: 'estado' }, { w: 'soy', t: 'estado' }, { w: 'estuvo', t: 'estado' }]
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
                ev.stopPropagation(); // Evita que el clic se pase a la caja de atrás

                // El Candado Inteligente
                if (clsSelectedWord !== null) {
                    // Manos llenas: En lugar de sacar la palabra, hacemos clic en la caja contenedora
                    // para que la nueva palabra seleccionada caiga aquí adentro.
                    col.click();
                } else {
                    // Manos vacías: Devolvemos la palabra al banco
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
    { s: ['El', 'perro', 'corre', 'rápido.'], c: 2, art: 'Verbo de acción' },
    { s: ['Nosotros', 'estudiamos', 'matemáticas.'], c: 1, art: 'Verbo en presente' },
    { s: ['Ayer', 'visité', 'a', 'mi', 'abuela.'], c: 1, art: 'Verbo en pasado' },
    { s: ['Mañana', 'iremos', 'al', 'cine.'], c: 1, art: 'Verbo en futuro' },
    { s: ['El', 'cielo', 'es', 'azul.'], c: 2, art: 'Verbo copulativo' },
    { s: ['Quiero', 'aprender', 'a', 'nadar.'], c: 1, art: 'El verbo principal (infinitivo no, el conjugado)' },
    { s: ['¡Ven', 'aquí', 'ahora!'], c: 0, art: 'Verbo en imperativo' },
    { s: ['Ojalá', 'ganemos', 'el', 'premio.'], c: 1, art: 'Verbo en subjuntivo' },
];
let idIdx = 0;
function showId() {
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
    document.querySelectorAll('.id-word').forEach(s => s.classList.remove('selected'));
    span.classList.add('selected');
    if (i === idData[idIdx].c) {
        span.classList.add('id-ok'); fb('fbId', '¡Correcto! +5 XP', true);
        if (!xpTracker.id.has(idIdx)) { xpTracker.id.add(idIdx); pts(5); }
        sfx('ok');
    } else {
        span.classList.add('id-no'); fb('fbId', 'Ese no es el verbo principal.', false); sfx('no');
    }
}
function nextId() { sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId() { sfx('click'); idIdx = 0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData = [
    { s: 'El año pasado, yo ___ a la montaña con mi familia.', opts: ['viajé', 'viajo', 'viajaré'], c: 0 },
    { s: 'En este momento, mi hermano ___ un libro de aventuras.', opts: ['leyó', 'lee', 'leerá'], c: 1 },
    { s: 'Mañana nosotros ___ una película muy divertida.', opts: ['vimos', 'vemos', 'veremos'], c: 2 },
    { s: '¡Por favor, ___ tu habitación ahora mismo!', opts: ['ordenas', 'ordena', 'ordenaste'], c: 1 },
    { s: 'Ojalá que mañana no ___ durante nuestra excursión.', opts: ['llueva', 'llueve', 'llovió'], c: 0 },
    { s: 'Los pájaros ___ alegremente cada mañana en el jardín.', opts: ['canto', 'cantan', 'cantamos'], c: 1 },
    { s: 'El verbo «ser» es un verbo ___ porque no expresa acción.', opts: ['regular', 'copulativo', 'infinitivo'], c: 1 },
    { s: 'La terminación de la segunda conjugación en infinitivo es ___.', opts: ['-ar', '-ir', '-er'], c: 2 },
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
        fb('fbCmp', 'Incorrecto.', false); sfx('no');
    }
    setTimeout(() => { cmpIdx++; showCmp(); }, 1600);
}

// ===================== RETO FINAL =====================
const retoPairs = [
    {
        label: ['Pasado', 'Futuro'], btnA: '⏪ Pasado', btnB: '⏩ Futuro',
        colA: 'pasado', colB: 'futuro',
        words: [
            { w: 'canté', t: 'pasado' }, { w: 'jugaré', t: 'futuro' }, { w: 'viviste', t: 'pasado' },
            { w: 'leeremos', t: 'futuro' }, { w: 'escribió', t: 'pasado' }, { w: 'saltarán', t: 'futuro' },
            { w: 'dormimos', t: 'pasado' }, { w: 'viajaré', t: 'futuro' }, { w: 'pensaron', t: 'pasado' },
            { w: 'comerás', t: 'futuro' }, { w: 'fui', t: 'pasado' }, { w: 'seremos', t: 'futuro' },
        ]
    },
    {
        label: ['Regular', 'Irregular'], btnA: '📏 Regular', btnB: '🔄 Irregular',
        colA: 'regular', colB: 'irregular',
        words: [
            { w: 'cantar', t: 'regular' }, { w: 'ir', t: 'irregular' }, { w: 'beber', t: 'regular' }, { w: 'ser', t: 'irregular' },
            { w: 'vivir', t: 'regular' }, { w: 'tener', t: 'irregular' }, { w: 'saltar', t: 'regular' }, { w: 'venir', t: 'irregular' },
            { w: 'escribir', t: 'regular' }, { w: 'hacer', t: 'irregular' },
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
    sfx('click'); retoRunning = true; retoOk = 0; retoErr = 0;
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
    { s: 'El perro corre rápido.', type: 'Verbo correr' },
    { s: 'Nosotros estudiamos mucho.', type: 'Verbo estudiar' },
    { s: 'El niño dibujó un árbol.', type: 'Verbo dibujar' },
    { s: 'Mañana viajaré a la ciudad.', type: 'Verbo viajar' },
    { s: 'La niña canta hermoso.', type: 'Verbo cantar' },
    { s: 'Ayer llovió demasiado.', type: 'Verbo llover' },
    { s: 'Ellos juegan fútbol.', type: 'Verbo jugar' },
    { s: 'Mi mamá prepara la cena.', type: 'Verbo preparar' },
    { s: 'El gato duerme en el sofá.', type: 'Verbo dormir' },
    { s: 'El sol brilla fuerte.', type: 'Verbo brillar' },
    { s: 'Yo escribí un poema.', type: 'Verbo escribir' },
    { s: 'Nosotros leemos un cuento.', type: 'Verbo leer' },
    { s: 'Él es muy inteligente.', type: 'Verbo ser (copulativo)' },
    { s: 'Ellas bailaron toda la noche.', type: 'Verbo bailar' },
    { s: 'Tú pareces cansado.', type: 'Verbo parecer (copulativo)' },
];
const classifyTaskDB = [
    { w: 'corrió', inf: 'correr', t: 'pasado', p: '3ra', n: 'singular' },
    { w: 'cantamos', inf: 'cantar', t: 'presente', p: '1ra', n: 'plural' },
    { w: 'viviré', inf: 'vivir', t: 'futuro', p: '1ra', n: 'singular' },
    { w: 'lees', inf: 'leer', t: 'presente', p: '2da', n: 'singular' },
    { w: 'saltaron', inf: 'saltar', t: 'pasado', p: '3ra', n: 'plural' },
    { w: 'escribirá', inf: 'escribir', t: 'futuro', p: '3ra', n: 'singular' },
    { w: 'soy', inf: 'ser', t: 'presente', p: '1ra', n: 'singular' },
    { w: 'jugaban', inf: 'jugar', t: 'pasado', p: '3ra', n: 'plural' },
    { w: 'dibujas', inf: 'dibujar', t: 'presente', p: '2da', n: 'singular' },
    { w: 'estudiaré', inf: 'estudiar', t: 'futuro', p: '1ra', n: 'singular' },
    { w: 'dormimos', inf: 'dormir', t: 'pasado/presente', p: '1ra', n: 'plural' },
    { w: 'fui', inf: 'ir/ser', t: 'pasado', p: '1ra', n: 'singular' },
    { w: 'comerán', inf: 'comer', t: 'futuro', p: '3ra', n: 'plural' },
    { w: 'ríe', inf: 'reír', t: 'presente', p: '3ra', n: 'singular' },
    { w: 'viajaste', inf: 'viajar', t: 'pasado', p: '2da', n: 'singular' },
];
const completeTaskDB = [
    { s: 'Ayer nosotros ___ al parque a jugar fútbol.', opts: ['fuimos', 'iremos', 'vamos'], ans: 'fuimos' },
    { s: 'Mañana yo ___ una carta a mi abuela.', opts: ['escribo', 'escribí', 'escribiré'], ans: 'escribiré' },
    { s: 'El pájaro ___ muy alto en el cielo azul.', opts: ['vuela', 'volará', 'volaba'], ans: 'vuela' },
    { s: '¡Por favor, ___ la puerta que hace frío!', opts: ['cierras', 'cierra', 'cerrarás'], ans: 'cierra' },
    { s: 'Ojalá que mi equipo ___ el campeonato.', opts: ['ganó', 'gana', 'gane'], ans: 'gane' },
    { s: 'En este momento, la profesora ___ la lección.', opts: ['explica', 'explicó', 'explicará'], ans: 'explica' },
    { s: 'El verano pasado, mis amigos ___ a la playa.', opts: ['viajan', 'viajaron', 'viajarán'], ans: 'viajaron' },
    { s: 'Yo ___ muy feliz hoy porque es mi cumpleaños.', opts: ['soy', 'estoy', 'parezco'], ans: 'estoy' },
    { s: 'Los leones ___ ferozmente en la sabana.', opts: ['rugió', 'rugen', 'rugirá'], ans: 'rugen' },
    { s: 'Tú ___ muy rápido en la carrera de ayer.', opts: ['corriste', 'corres', 'correrás'], ans: 'corriste' },
];
const explainQuestions = [
    { q: '¿Qué es un verbo? Menciona 2 ejemplos.', ans: 'Es la palabra que expresa acción, estado o proceso. Ejemplos: correr, vivir.' },
    { q: '¿Cuáles son las tres conjugaciones de los verbos en infinitivo?', ans: 'Primera conjugación termina en -ar, segunda en -er, tercera en -ir.' },
    { q: 'Explica la diferencia entre un verbo regular y uno irregular.', ans: 'El regular mantiene su raíz al conjugarse (cantar). El irregular cambia su raíz o desinencia (ir, ser).' },
    { q: '¿Cuáles son los tiempos verbales básicos?', ans: 'Pasado (ayer), Presente (hoy) y Futuro (mañana).' },
    { q: '¿Qué es un verbo copulativo y cuáles son los más comunes?', ans: 'Unen el sujeto con un atributo, indicando estado. Los más comunes son ser, estar y parecer.' },
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
    _instrBlock(out, 'Instrucción', ['Copia en tu cuaderno; subraya, colorea o encierra el verbo conjugado en las siguientes oraciones. Escribe al lado en infinitivo a qué verbo pertenece.', '<strong>Ejemplo:</strong> Nosotros estudiamos mucho. → <span style="color:var(--jade);font-weight:700;">Verbo estudiar</span>']);
    _pick(identifyTaskDB, Math.min(count, identifyTaskDB.length)).forEach((item, i) => {
        const div = document.createElement('div'); div.className = 'tg-task';
        div.innerHTML = `<div class="tg-task-num">${i + 1}</div><div class="tg-task-content"><em style="font-size:0.92rem;">${item.s}</em><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
        out.appendChild(div);
    });
}

function genClassifyTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia la siguiente tabla en tu cuaderno. Para cada verbo conjugado, completa cuál es su infinitivo, el tiempo en que está, su persona (1ra, 2da, 3ra) y su número (singular o plural).']);
    const items = _pick(classifyTaskDB, Math.min(count, classifyTaskDB.length));
    const wrap = document.createElement('div'); wrap.style.overflowX = 'auto';
    const th = (t, extra = '') => `<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;
    let html = `<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Verbo Conjugado', 'text-align:left;')}${th('Infinitivo')}${th('Tiempo')}${th('Persona')}${th('Número')}</tr></thead><tbody>`;
    items.forEach(it => {
        html += `<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>` + Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('') + '</tr>';
    });
    html += '</tbody></table>';
    wrap.innerHTML = html; out.appendChild(wrap);
    const ans = document.createElement('div'); ans.className = 'tg-answer'; ans.style.marginTop = '0.8rem';
    ans.innerHTML = '<strong>✅ Respuestas:</strong><br>' + items.map(it => {
        return `<strong>${it.w}:</strong> Infinitivo: ${it.inf} | Tiempo: ${it.t} | Persona: ${it.p} | Número: ${it.n}`;
    }).join('<br>');
    out.appendChild(ans);
}

function genCompleteTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Debajo de cada oración hay opciones de verbos. Elige y escribe la opción correcta que concuerde en tiempo, persona y número.']);
    const pool = _shuffle([...completeTaskDB]);
    for (let i = 0; i < count; i++) {
        const item = pool[i % pool.length];
        const div = document.createElement('div'); div.className = 'tg-task';
        const sent = item.s.replace('___', '<span class="tg-blank" style="min-width:90px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>');
        div.innerHTML = `<div class="tg-task-num">${i + 1}</div><div class="tg-task-content"><span style="font-size:0.9rem;">${sent}</span><div style="margin-top:0.4rem;font-size:0.82rem;color:var(--gray);">📋 Opciones: <strong>${item.opts.join(' | ')}</strong></div><div class="tg-answer">✅ ${item.ans}</div></div>`;
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
        // Horizontal: VERBO(fila 0), ESTADO(fila 8)
        // Vertical:   FUTURO(col 6), PASADO(col 9), TIEMPO(col 0 filas 3-8)
        // Diagonal↘:  ACCION(desde 2,0)
        // Diagonal↗:  MODO(desde 9,6 hacia 6,9)
        size: 10,
        grid: [
            ['V', 'E', 'R', 'B', 'O', 'L', 'F', 'C', 'M', 'P'],
            ['K', 'X', 'N', 'Q', 'Z', 'G', 'U', 'H', 'R', 'A'],
            ['A', 'B', 'J', 'W', 'Y', 'D', 'T', 'V', 'N', 'S'],
            ['T', 'C', 'X', 'F', 'L', 'K', 'U', 'P', 'Q', 'A'],
            ['I', 'R', 'C', 'G', 'J', 'N', 'R', 'Z', 'W', 'D'],
            ['E', 'X', 'B', 'I', 'K', 'L', 'O', 'H', 'V', 'O'],
            ['M', 'Q', 'Y', 'Z', 'O', 'W', 'D', 'J', 'N', 'O'],
            ['P', 'F', 'G', 'H', 'K', 'N', 'X', 'B', 'D', 'R'],
            ['O', 'E', 'S', 'T', 'A', 'D', 'O', 'O', 'V', 'L'],
            ['Z', 'Y', 'X', 'W', 'K', 'J', 'M', 'Q', 'P', 'N'],
        ],
        words: [
            { w: 'VERBO', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]] },
            { w: 'FUTURO', cells: [[0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6]] },
            { w: 'PASADO', cells: [[0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9]] },
            { w: 'ACCION', cells: [[2, 0], [3, 1], [4, 2], [5, 3], [6, 4], [7, 5]] },
            { w: 'TIEMPO', cells: [[3, 0], [4, 0], [5, 0], [6, 0], [7, 0], [8, 0]] },
            { w: 'ESTADO', cells: [[8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6]] },
            { w: 'MODO', cells: [[9, 6], [8, 7], [7, 8], [6, 9]] },
        ]
    },
    {
        // Horizontal: CANTAR(fila 0), REGULAR(fila 8)
        // Vertical:   COMER(col 8), RAIZ(col 0 filas 4-7)
        // Diagonal↘:  VIVIR(desde 2,2)
        size: 10,
        grid: [
            ['C', 'A', 'N', 'T', 'A', 'R', 'K', 'B', 'C', 'X'],
            ['P', 'Q', 'W', 'Z', 'J', 'H', 'Y', 'D', 'O', 'F'],
            ['L', 'G', 'V', 'B', 'N', 'M', 'X', 'K', 'M', 'S'],
            ['T', 'U', 'O', 'I', 'W', 'Q', 'Z', 'H', 'E', 'V'],
            ['R', 'J', 'P', 'F', 'V', 'N', 'B', 'L', 'R', 'Y'],
            ['A', 'X', 'K', 'D', 'Q', 'I', 'W', 'G', 'Z', 'H'],
            ['I', 'B', 'H', 'N', 'L', 'M', 'R', 'P', 'F', 'J'],
            ['Z', 'V', 'Y', 'T', 'K', 'S', 'W', 'Q', 'X', 'U'],
            ['D', 'R', 'E', 'G', 'U', 'L', 'A', 'R', 'C', 'N'],
            ['E', 'F', 'H', 'J', 'M', 'P', 'Q', 'T', 'W', 'Y'],
        ],
        words: [
            { w: 'CANTAR', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]] },
            { w: 'COMER', cells: [[0, 8], [1, 8], [2, 8], [3, 8], [4, 8]] },
            { w: 'VIVIR', cells: [[2, 2], [3, 3], [4, 4], [5, 5], [6, 6]] },
            { w: 'REGULAR', cells: [[8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7]] },
            { w: 'RAIZ', cells: [[4, 0], [5, 0], [6, 0], [7, 0]] },
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
    buildSopa();
    showToast('🔄 Nueva sopa cargada');
}
let _sopaRevealTimer = null;
function toggleSopaWords() {
    sfx('click');
    const set = sopaSets[currentSopaSetIdx];
    const btn = document.getElementById('sopaWordsBtn');
    // Resaltar celdas ocultas (no encontradas aún) durante 2 s
    const revealCells = [];
    set.words.forEach(wObj => {
        if (sopaFoundWords.has(wObj.w)) return;
        wObj.cells.forEach(([r, c]) => {
            const cell = document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
            if (cell) { cell.classList.add('sopa-reveal'); revealCells.push(cell); }
        });
    });
    btn.disabled = true;
    clearTimeout(_sopaRevealTimer);
    _sopaRevealTimer = setTimeout(() => {
        revealCells.forEach(c => c.classList.remove('sopa-reveal'));
        btn.disabled = false;
    }, 2000);
}

let _sopaResizeTimer = null;
window.addEventListener('resize', () => {
    clearTimeout(_sopaResizeTimer); _sopaResizeTimer = setTimeout(() => { if (document.getElementById('s-sopa').classList.contains('active')) buildSopa(); }, 200);
});

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank = [
    { q: 'El verbo expresa una acción, estado o proceso.', a: true },
    { q: 'Los verbos en infinitivo terminan en -ar, -er, -ir.', a: true },
    { q: 'El modo indicativo se usa para expresar dudas o deseos.', a: false },
    { q: 'Un verbo regular mantiene su raíz al ser conjugado.', a: true },
    { q: '«Ser», «estar» y «parecer» son verbos de acción.', a: false },
    { q: 'El tiempo futuro indica una acción que ya ocurrió.', a: false },
    { q: 'La desinencia es la parte final del verbo que cambia al conjugarlo.', a: true },
    { q: 'El verbo es el núcleo del sujeto en la oración.', a: false },
    { q: '«Nosotros» es un pronombre de primera persona del plural.', a: true },
    { q: '«Fui» es la conjugación pasada de un verbo regular.', a: false },
    { q: 'El modo imperativo se usa para dar órdenes.', a: true },
    { q: 'La raíz de un verbo irregular nunca cambia.', a: false },
    { q: '«Comer» pertenece a la primera conjugación.', a: false },
    { q: '«Tú» corresponde a la segunda persona del singular.', a: true },
    { q: 'Los tiempos verbales básicos son pasado, presente y futuro.', a: true },
];
const evalMCBank = [
    { q: '¿Cuál de las siguientes palabras es un verbo?', o: ['a) Feliz', 'b) Saltar', 'c) Casa', 'd) Rápido'], a: 1 },
    { q: 'El verbo principal de «El gato duerme en el sofá» es:', o: ['a) El', 'b) gato', 'c) duerme', 'd) sofá'], a: 2 },
    { q: '¿A qué conjugación pertenece el verbo «vivir»?', o: ['a) Primera', 'b) Segunda', 'c) Tercera', 'd) Cuarta'], a: 2 },
    { q: '¿En qué tiempo está «Yo cantaré en el teatro»?', o: ['a) Presente', 'b) Pasado', 'c) Futuro', 'd) Infinitivo'], a: 2 },
    { q: '¿Qué modo verbal expresa una duda o deseo?', o: ['a) Indicativo', 'b) Imperativo', 'c) Subjuntivo', 'd) Copulativo'], a: 2 },
    { q: '¿Cuál de estos verbos es copulativo?', o: ['a) Correr', 'b) Parecer', 'c) Escribir', 'd) Comer'], a: 1 },
    { q: 'Un verbo que cambia su raíz al ser conjugado es:', o: ['a) Regular', 'b) Irregular', 'c) Infinitivo', 'd) Auxiliar'], a: 1 },
    { q: '¿En qué persona está «Nosotros jugamos»?', o: ['a) Primera', 'b) Segunda', 'c) Tercera', 'd) Ninguna'], a: 0 },
    { q: '¿Cuál es la raíz del verbo «cantar»?', o: ['a) can-', 'b) cant-', 'c) -ar', 'd) canta-'], a: 1 },
    { q: '¿En qué modo está «¡Estudia para el examen!»?', o: ['a) Indicativo', 'b) Subjuntivo', 'c) Imperativo', 'd) Infinitivo'], a: 2 },
    { q: '¿Cuál es el infinitivo de «comió»?', o: ['a) Comer', 'b) Comido', 'c) Comiendo', 'd) Comida'], a: 0 },
    { q: 'El número de un verbo indica si el sujeto es:', o: ['a) Pasado o presente', 'b) Regular o irregular', 'c) Singular o plural', 'd) Acción o estado'], a: 2 },
    { q: 'El pronombre para la tercera persona del plural es:', o: ['a) Yo', 'b) Tú', 'c) Él', 'd) Ellos'], a: 3 },
    { q: '¿Cuál de estos verbos es regular?', o: ['a) Ir (fui)', 'b) Ser (soy)', 'c) Amar (amo, amé)', 'd) Tener (tuve)'], a: 2 },
    { q: 'Si una acción sucede hoy, el verbo está en:', o: ['a) Pasado', 'b) Presente', 'c) Futuro', 'd) Imperativo'], a: 1 },
];
const evalCPBank = [
    { q: 'Los verbos terminados en -ar pertenecen a la ___ conjugación.', a: 'primera' },
    { q: 'El tiempo ___ indica que una acción ya ha ocurrido.', a: 'pasado' },
    { q: 'La parte del verbo que no cambia en los verbos regulares se llama ___.', a: 'raíz' },
    { q: 'El modo ___ se utiliza para expresar órdenes o ruegos.', a: 'imperativo' },
    { q: '«Ser» y «estar» son ejemplos de verbos ___.', a: 'copulativos' },
    { q: 'Los verbos ___ cambian su raíz al ser conjugados.', a: 'irregulares' },
    { q: 'La parte final que se añade a la raíz se llama ___.', a: 'desinencia' },
    { q: 'El verbo es el núcleo del ___ en la oración.', a: 'predicado' },
    { q: 'Si la acción ocurre en este mismo instante, está en tiempo ___.', a: 'presente' },
    { q: 'El pronombre «Yo» corresponde a la primera ___ del singular.', a: 'persona' },
    { q: 'Los verbos terminados en -er pertenecen a la ___ conjugación.', a: 'segunda' },
    { q: 'Si una acción la realizan varias personas, el verbo está en número ___.', a: 'plural' },
    { q: 'El modo ___ se usa para expresar hechos reales y seguros.', a: 'indicativo' },
    { q: 'El nombre del verbo, que no indica tiempo ni persona, es el ___.', a: 'infinitivo' },
    { q: 'El tiempo ___ indica que la acción ocurrirá más adelante.', a: 'futuro' },
];
const evalPRBank = [
    { term: 'Verbo', def: 'Expresa acción, estado o proceso' },
    { term: 'Infinitivo', def: 'Terminaciones -ar, -er, -ir' },
    { term: 'Raíz', def: 'Parte invariable del verbo regular' },
    { term: 'Desinencia', def: 'Terminación que indica tiempo y persona' },
    { term: 'Verbo regular', def: 'Conserva su raíz al conjugarse' },
    { term: 'Verbo irregular', def: 'Cambia su raíz al conjugarse' },
    { term: 'Tiempo presente', def: 'La acción ocurre ahora' },
    { term: 'Tiempo pasado', def: 'La acción ya ocurrió' },
    { term: 'Tiempo futuro', def: 'La acción ocurrirá después' },
    { term: 'Modo indicativo', def: 'Expresa un hecho real' },
    { term: 'Modo subjuntivo', def: 'Expresa duda o deseo' },
    { term: 'Modo imperativo', def: 'Expresa una orden o ruego' },
    { term: 'Número singular', def: 'Un solo sujeto realiza la acción' },
    { term: 'Número plural', def: 'Varios sujetos realizan la acción' },
    { term: 'Verbo copulativo', def: 'Ser, estar o parecer (expresa estado)' },
];

function genEval() {
    sfx('click');
    const cf = evalFormNum;
    window._currentEvalForm = cf;
    evalFormNum = (evalFormNum % 10) + 1;
    saveProgress();
    document.getElementById('eval-screen-title').textContent = `📝 Evaluación Final — Forma ${cf} · Los Verbos`;
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
    d.cp.forEach((it, i) => { const input = document.querySelector(`[data-cp="${i}"]`); const ok = isCpCorrect(input ? input.value : '', it.a); if (input) { input.classList.toggle('eval-input-ok', ok); input.classList.toggle('eval-input-no', !ok); } if (ok) { detail.cp++; total += 5; } setEvalFeedback('evalFbCp' + i, ok, ok ? 'Correcto. +5 pts' : 'Revisar. Respuesta esperada: ' + it.a); });
    d.tf.forEach((it, i) => { const selected = document.querySelector(`input[name="tf${i}"]:checked`); const ok = !!selected && (selected.value === 'true') === it.a; if (ok) { detail.tf++; total += 5; } setEvalFeedback('evalFbTf' + i, ok, ok ? 'Correcto. +5 pts' : 'Revisar. Respuesta esperada: ' + (it.a ? 'Verdadero' : 'Falso')); });
    d.mc.forEach((it, i) => { const selected = document.querySelector(`input[name="mc${i}"]:checked`); const ok = !!selected && Number(selected.value) === it.a; if (ok) { detail.mc++; total += 5; } setEvalFeedback('evalFbMc' + i, ok, ok ? 'Correcto. +5 pts' : 'Revisar. Respuesta esperada: ' + it.o[it.a]); });
    const expectedLetters = d.pr.terms.map(it => d.pr.letters[d.pr.shuffledDefs.findIndex(df => df.def === it.def)]);
    expectedLetters.forEach((letter, i) => { const sel = document.querySelector(`[data-pr="${i}"]`); const ok = !!sel && sel.value === letter; if (sel) { sel.classList.toggle('eval-input-ok', ok); sel.classList.toggle('eval-input-no', !ok); } if (ok) { detail.pr++; total += 5; } });
    setEvalFeedback('evalFbPr', detail.pr === 5, `Pareados: ${detail.pr}/5 correctos. ${detail.pr === 5 ? 'Excelente. +25 pts' : 'Clave: ' + expectedLetters.map((l, i) => (i + 16) + '→' + l).join(' · ')}`);
    const result = document.getElementById('evalAutoResult');
    if (result) { result.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); result.innerHTML = `<strong>Resultado automático: ${total}/100 puntos</strong><br><span>Completar: ${detail.cp * 5}/25 · V/F: ${detail.tf * 5}/25 · Selección: ${detail.mc * 5}/25 · Pareados: ${detail.pr * 5}/25</span><br><em>Este resultado es solo para revisión en pantalla; la impresión conserva el formato limpio para papel.</em>`; }
    if (total >= 70) { pts(8); showToast('🎯 Evaluación calificada: ' + total + '/100'); }
    else showToast('🧮 Evaluación calificada: ' + total + '/100. Revisa las respuestas marcadas.');
}
function printEval() {
    if (!window._evalPrintData) { showToast('⚠️ Genera una evaluación primero'); return; }
    sfx('click');
    const forma = window._currentEvalForm || 1;
    const d = window._evalPrintData;

    // ── I. Completar el espacio (1-5)
    let s1 = '<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>';
    d.cp.forEach((it, i) => { const q = it.q.replace('___', '<span class="cp-blank"></span>'); s1 += `<div class="cp-row"><span class="qn">${i + 1}.</span><span class="cp-text">${q}</span></div>`; });

    // ── II. Verdadero o Falso (6-10)
    let s2 = '<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>';
    d.tf.forEach((it, i) => { s2 += `<div class="tf-row"><span class="qn">${i + 6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`; });

    // ── III. Selección Múltiple (11-15)
    let s3 = '<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">';
    d.mc.forEach((it, i) => { const opts = it.o.map((op, oi) => `<label class="mc-opt"><input type="radio" name="mcp${i}"> ${op}</label>`).join(''); s3 += `<div class="mc-item"><div class="mc-q"><span class="qn">${i + 11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`; });
    s3 += '</div>';

    // ── IV. Pareados (16-20)
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
<title>Evaluación Los Verbos · Forma ${forma}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body {font-family:Arial,Helvetica,sans-serif;font-size:11.5pt;color:#111;background:#fff;padding:2mm 6mm;}
.ph{margin-bottom:0.45rem;}
.ph h2{font-size:11.5pt;font-weight:700;text-align:center;margin-bottom:0.35rem;}
.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:4px;}
.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}
.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}
.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}
.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}
.ph-crit{font-size:10pt;text-align:center;color:#555;margin-top:0.18rem;}
.sec-title {font-size:10.5pt;font-weight:700;padding:0.18rem 0.45rem;margin:0.32rem 0 0.15rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #c49000;background:#fef9e7;color:#c49000;}
.obt-row {display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#c49000;}
.obt-lbl{white-space:nowrap;}
.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #c49000;height:13px;}
.obt-pct{white-space:nowrap;}
.qn{font-weight:700;min-width:22px;flex-shrink:0;}
.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.38;padding:0.2rem 0.25rem;border-bottom:1px solid #eee;}
.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}
.tf-text{flex:1;}
.mc-item {border:1px solid #ddd;border-radius:4px;padding:0.2rem 0.4rem;margin-bottom:0.16rem;break-inside:avoid;page-break-inside:avoid;}
.mc-q{font-size:10.5pt;line-height:1.38;display:flex;gap:0.28rem;margin-bottom:0.14rem;}
.mc-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.16rem 0.5rem;}
.mc-opts{display:grid;grid-template-columns:repeat(4,1fr);gap:0.05rem 0.2rem;margin-left:1.2rem;}
.mc-opt{font-size:9pt;display:flex;align-items:center;gap:0.2rem;}
.mc-opt input{width:11px;height:11px;flex-shrink:0;}
.cp-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.38;padding:0.2rem 0.25rem;border-bottom:1px solid #eee;}
.cp-text{flex:1;}
.cp-blank{display:inline-block;min-width:150px;border-bottom:1.5px solid #111;margin:0 0.12rem;}
.pr-section{margin-top:0.2rem;}
.pr-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.18rem 0.5rem;margin-top:0.14rem;}
.pr-head{font-size:9pt;font-weight:700;color:#555;margin-bottom:0.16rem;}
.pr-item {font-size:10.5pt;padding:0.18rem 0.32rem;background:#fef9e7;border-radius:3px;margin-bottom:0.12rem;display:flex;align-items:center;gap:0.2rem;line-height:1.25;break-inside:avoid;page-break-inside:avoid;}
.pr-num {font-weight:700;color:#c49000;min-width:19px;flex-shrink:0;}
.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}
.total-row {display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11.5pt;font-weight:700;font-style:italic;margin-top:0.35rem;padding:0.25rem 0;page-break-before:avoid;break-before:avoid;color:#c49000;}
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
@media print{@page{size:letter portrait;margin:12.7mm;}}
</style></head><body>
<div class="ph">
  <h2>Evaluación Final de Misión Los Verbos — Español — Lengua</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
<div class="pauta-wrap">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · Misión Los Verbos · Forma ${forma}</div>
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
    const msgs = ['🚀 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!', '🌱 ¡GRAN INICIO! Estás dando los primeros pasos.', '📚 ¡BUEN TRABAJO! Vas progresando muy bien.', '💪 ¡MUY BIEN! Dominas gran parte del contenido.', '🌟 ¡INCREÍBLE avance! Estás cerca de la excelencia.', '🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Verbos!'];
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
    const txt = `${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: Los Verbos\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText ? '\n\n🏅 Logros desbloqueados:\n' + achText : ''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo Familia Polanco-Castellanos\n🌐 policastsapien.com`;
    window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
}

// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadProgress();
    upFC(); buildQz(); buildClass(); showId(); showCmp(); buildSopa(); genTask(); genEval();
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
    // Recuperar nombre guardado
    const savedName = localStorage.getItem('nombreEstudianteVerbos');
    const inputName = document.querySelector('.diploma-input');
    if (savedName && inputName) { inputName.value = savedName; updateDiplomaName(savedName); }
    if (inputName) inputName.addEventListener('input', e => localStorage.setItem('nombreEstudianteVerbos', e.target.value));
    fin('s-aprende', false);
    fin('s-tipos', false);
});