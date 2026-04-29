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
const SAVE_KEY = 'sustantivos_v2_basica';
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
    { w: 'Sustantivo', a: '📝 Palabra que sirve para <strong>nombrar</strong> personas, animales, cosas, lugares, sentimientos e ideas. Es el núcleo del sujeto.' },
    { w: 'Sustantivo Propio', a: '👤 Nombra a un ser o lugar <strong>específico y único</strong>. Se escribe con <strong>mayúscula</strong>: María, Honduras, Copán.' },
    { w: 'Sustantivo Común', a: '🏠 Nombra a cualquier ser de su clase <strong>sin distinguirlo</strong>: perro, ciudad, río, escuela.' },
    { w: 'Sustantivo Concreto', a: '🪨 Se puede percibir con los <strong>cinco sentidos</strong>: ver, oír, tocar, oler o saborear. Ej: mesa, música, chocolate.' },
    { w: 'Sustantivo Abstracto', a: '💭 No se puede percibir con los sentidos: <strong>sentimientos, ideas, cualidades</strong>. Ej: amor, libertad, valentía.' },
    { w: 'Sustantivo Individual', a: '🐕 Nombra a <strong>un solo ser</strong> u objeto: árbol, soldado, abeja, estrella.' },
    { w: 'Sustantivo Colectivo', a: '🌳 Nombra un <strong>conjunto o grupo</strong> de seres (en singular): bosque (árboles), ejército (soldados), enjambre (abejas).' },
    { w: 'Sustantivo Contable', a: '🔢 Se puede <strong>contar</strong> con números: tres libros, cinco gatos, dos casas.' },
    { w: 'Sustantivo Incontable', a: '💧 No se puede contar, se <strong>mide</strong>: agua, arena, aire, leche.' },
    { w: 'Sustantivo Primitivo', a: '🌱 Palabra <strong>original</strong> que no viene de ninguna otra: pan, flor, zapato, mar.' },
    { w: 'Sustantivo Derivado', a: '🌿 Se forma a partir de un primitivo usando <strong>sufijos</strong>: panadería, florero, zapatero, marinero.' },
    { w: 'Género del Sustantivo', a: '⚧ Puede ser <strong>masculino</strong> (el niño) o <strong>femenino</strong> (la niña). Muchos masculinos terminan en -o y femeninos en -a.' },
    { w: 'Número del Sustantivo', a: '🔢 <strong>Singular</strong> = uno (casa). <strong>Plural</strong> = varios (casas). Se forma con -s, -es o cambiando -z por -ces.' },
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
    { q: '¿Qué es un sustantivo?', o: ['a) Una palabra que indica acción', 'b) Una palabra que nombra seres, cosas o ideas', 'c) Una palabra que describe cualidades', 'd) Una palabra que une oraciones'], c: 1 },
    { q: '¿Cuál de estos es un sustantivo propio?', o: ['a) perro', 'b) ciudad', 'c) Honduras', 'd) alegría'], c: 2 },
    { q: '¿Qué tipo de sustantivo es «amor»?', o: ['a) Concreto', 'b) Colectivo', 'c) Propio', 'd) Abstracto'], c: 3 },
    { q: '¿Cuál es un sustantivo colectivo?', o: ['a) soldado', 'b) ejército', 'c) casa', 'd) libertad'], c: 1 },
    { q: '¿Qué sustantivo es incontable?', o: ['a) libro', 'b) gato', 'c) agua', 'd) mesa'], c: 2 },
    { q: 'Si «pan» es un sustantivo primitivo, ¿cuál es su derivado?', o: ['a) pantalón', 'b) panadería', 'c) pandilla', 'd) panorama'], c: 1 },
    { q: '¿Cómo se forma el plural de «lápiz»?', o: ['a) lápizs', 'b) lápizes', 'c) lápices', 'd) lápizces'], c: 2 },
    { q: '¿Qué tipo de sustantivo es «bosque»?', o: ['a) Individual', 'b) Abstracto', 'c) Propio', 'd) Colectivo'], c: 3 },
    { q: '¿Cuál de estos sustantivos es concreto?', o: ['a) valentía', 'b) tristeza', 'c) chocolate', 'd) esperanza'], c: 2 },
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
        label: ['Común', 'Propio'], headA: '🏠 Común', headB: '👤 Propio', colA: 'comun', colB: 'propio',
        words: [{ w: 'niño', t: 'comun' }, { w: 'río', t: 'comun' }, { w: 'país', t: 'comun' }, { w: 'perro', t: 'comun' }, { w: 'ciudad', t: 'comun' }, { w: 'Pedro', t: 'propio' }, { w: 'Amazonas', t: 'propio' }, { w: 'Honduras', t: 'propio' }, { w: 'Rex', t: 'propio' }, { w: 'Tegucigalpa', t: 'propio' }]
    },
    {
        label: ['Concreto', 'Abstracto'], headA: '🪨 Concreto', headB: '💭 Abstracto', colA: 'concreto', colB: 'abstracto',
        words: [{ w: 'mesa', t: 'concreto' }, { w: 'piedra', t: 'concreto' }, { w: 'lápiz', t: 'concreto' }, { w: 'agua', t: 'concreto' }, { w: 'nube', t: 'concreto' }, { w: 'amor', t: 'abstracto' }, { w: 'paz', t: 'abstracto' }, { w: 'justicia', t: 'abstracto' }, { w: 'alegría', t: 'abstracto' }, { w: 'miedo', t: 'abstracto' }]
    },
    {
        label: ['Individual', 'Colectivo'], headA: '🐕 Individual', headB: '🌳 Colectivo', colA: 'individual', colB: 'colectivo',
        words: [{ w: 'abeja', t: 'individual' }, { w: 'perro', t: 'individual' }, { w: 'soldado', t: 'individual' }, { w: 'árbol', t: 'individual' }, { w: 'oveja', t: 'individual' }, { w: 'enjambre', t: 'colectivo' }, { w: 'jauría', t: 'colectivo' }, { w: 'ejército', t: 'colectivo' }, { w: 'bosque', t: 'colectivo' }, { w: 'rebaño', t: 'colectivo' }]
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
    { s: ['María', 'viajó', 'a', 'Tegucigalpa', 'ayer.'], c: 0, art: 'sustantivo propio', info: '«María» es un sustantivo propio porque nombra a una persona específica.' },
    { s: ['El', 'perro', 'corre', 'por', 'el', 'parque.'], c: 1, art: 'sustantivo común', info: '«perro» es un sustantivo común porque nombra a cualquier perro sin distinguirlo.' },
    { s: ['La', 'valentía', 'del', 'soldado', 'fue', 'admirable.'], c: 1, art: 'sustantivo abstracto', info: '«valentía» es abstracto porque no se puede percibir con los sentidos.' },
    { s: ['Un', 'enjambre', 'de', 'abejas', 'voló', 'sobre', 'nosotros.'], c: 1, art: 'sustantivo colectivo', info: '«enjambre» es colectivo porque nombra un grupo de abejas en singular.' },
    { s: ['El', 'chocolate', 'tiene', 'un', 'sabor', 'delicioso.'], c: 1, art: 'sustantivo concreto', info: '«chocolate» es concreto porque lo podemos saborear, tocar y oler.' },
    { s: ['La', 'panadería', 'abre', 'temprano', 'cada', 'mañana.'], c: 1, art: 'sustantivo derivado', info: '«panadería» es derivado porque viene del sustantivo primitivo «pan».' },
    { s: ['El', 'agua', 'del', 'río', 'está', 'muy', 'fría.'], c: 1, art: 'sustantivo incontable', info: '«agua» es incontable porque no se puede contar, solo medir.' },
    { s: ['Honduras', 'tiene', 'hermosos', 'bosques', 'tropicales.'], c: 0, art: 'sustantivo propio', info: '«Honduras» es propio porque nombra a un país específico.' },
    { s: ['Tres', 'libros', 'están', 'sobre', 'la', 'mesa.'], c: 1, art: 'sustantivo contable', info: '«libros» es contable porque podemos contar cuántos hay: tres.' },
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
    const d = idData[idIdx];
    document.querySelectorAll('.id-word').forEach(s => s.classList.remove('selected'));
    span.classList.add('selected');
    if (i === d.c) {
        span.classList.add('id-ok');
        document.getElementById('idInfo').textContent = '✅ ' + d.info;
        fb('fbId', '¡Correcto! +5 XP', true);
        if (!xpTracker.id.has(idIdx)) { xpTracker.id.add(idIdx); pts(5); }
        sfx('ok');
    } else {
        span.classList.add('id-no'); fb('fbId', 'No es esa. Sigue buscando.', false); sfx('no');
    }
}
function nextId() { sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId() { sfx('click'); idIdx = 0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData = [
    { s: 'Un sustantivo ___ nombra a un ser o lugar específico y se escribe con mayúscula.', opts: ['común', 'colectivo', 'propio', 'abstracto'], c: 2, exp: 'Los sustantivos propios siempre se escriben con mayúscula inicial.' },
    { s: '«Bosque» es un sustantivo ___ porque nombra un conjunto de árboles.', opts: ['individual', 'colectivo', 'propio', 'contable'], c: 1, exp: 'Los sustantivos colectivos nombran un grupo de seres en singular.' },
    { s: 'La palabra «amor» es un sustantivo ___ porque no se percibe con los sentidos.', opts: ['concreto', 'colectivo', 'propio', 'abstracto'], c: 3, exp: 'Los sustantivos abstractos nombran sentimientos, ideas o cualidades.' },
    { s: '«Panadería» es un sustantivo ___ porque viene de la palabra «pan».', opts: ['primitivo', 'propio', 'derivado', 'abstracto'], c: 2, exp: 'Los sustantivos derivados se forman a partir de un primitivo con sufijos.' },
    { s: 'El plural de «lápiz» es ___.', opts: ['lápizs', 'lápizes', 'lápices', 'lápizces'], c: 2, exp: 'Cuando un sustantivo termina en -z, se cambia la z por c y se agrega -es.' },
    { s: '«Agua» es un sustantivo ___ porque no se puede contar, solo medir.', opts: ['contable', 'individual', 'incontable', 'primitivo'], c: 2, exp: 'Los sustantivos incontables se miden pero no se pueden contar con números.' },
    { s: 'Los sustantivos ___ se pueden percibir con los cinco sentidos.', opts: ['abstractos', 'colectivos', 'propios', 'concretos'], c: 3, exp: 'Los sustantivos concretos se perciben con los sentidos: ver, oír, tocar, oler, saborear.' },
    { s: '«Casita» es un sustantivo en forma ___.', opts: ['aumentativa', 'despectiva', 'primitiva', 'diminutiva'], c: 3, exp: 'Los diminutivos achican o dan cariño: casita, perrito, florecita.' },
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
    const d = cmpData[cmpIdx];
    const opts = document.querySelectorAll('.cmp-opt');
    if (cmpSel === d.c) {
        opts[cmpSel].classList.add('correct');
        document.getElementById('cmpSent').innerHTML = d.s.replace('___', `<span class="blank" style="color:var(--jade);border-color:var(--jade)">${opts[cmpSel].textContent}</span>`);
        fb('fbCmp', '¡Correcto! ' + d.exp, true);
        if (!xpTracker.cmp.has(cmpIdx)) { xpTracker.cmp.add(cmpIdx); pts(5); }
        sfx('ok');
    } else {
        opts[cmpSel].classList.add('wrong'); opts[d.c].classList.add('correct');
        fb('fbCmp', 'Incorrecto. ' + d.exp, false); sfx('no');
    }
    setTimeout(() => { cmpIdx++; showCmp(); }, 2000);
}

// ===================== RETO FINAL =====================
const retoPairs = [
    {
        label: ['Concreto', 'Abstracto'], btnA: '🪨 Concreto', btnB: '💭 Abstracto',
        colA: 'concreto', colB: 'abstracto',
        words: [
            { w: 'mesa', t: 'concreto' }, { w: 'amor', t: 'abstracto' }, { w: 'perro', t: 'concreto' },
            { w: 'libertad', t: 'abstracto' }, { w: 'chocolate', t: 'concreto' }, { w: 'tristeza', t: 'abstracto' },
            { w: 'música', t: 'concreto' }, { w: 'valentía', t: 'abstracto' }, { w: 'flor', t: 'concreto' },
            { w: 'esperanza', t: 'abstracto' }, { w: 'pan', t: 'concreto' }, { w: 'alegría', t: 'abstracto' },
        ]
    },
    {
        label: ['Común', 'Propio'], btnA: '🏠 Común', btnB: '👤 Propio',
        colA: 'comun', colB: 'propio',
        words: [
            { w: 'país', t: 'comun' }, { w: 'Brasil', t: 'propio' }, { w: 'río', t: 'comun' },
            { w: 'María', t: 'propio' }, { w: 'montaña', t: 'comun' }, { w: 'Lempira', t: 'propio' },
            { w: 'gato', t: 'comun' }, { w: 'Marta', t: 'propio' }, { w: 'escuela', t: 'comun' },
            { w: 'Honduras', t: 'propio' }, { w: 'niño', t: 'comun' }, { w: 'Copán', t: 'propio' },
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
    { s: 'El perro corre rápido.', type: 'Sustantivo común (perro)' },
    { s: 'María viajó a Honduras para las vacaciones.', type: 'Sustantivos propios (María, Honduras)' },
    { s: 'El niño dibujó un árbol.', type: 'Sustantivos comunes (niño, árbol)' },
    { s: 'La valentía del soldado fue admirable.', type: 'Sustantivo abstracto (valentía)' },
    { s: 'La niña canta hermoso.', type: 'Sustantivo común (niña)' },
    { s: 'Compré un ramo de flores.', type: 'Sustantivos comunes (ramo, flores)' },
    { s: 'El enjambre nos asustó.', type: 'Sustantivo colectivo (enjambre)' },
    { s: 'Mi mamá preparó la cena.', type: 'Sustantivos comunes (mamá, cena)' },
    { s: 'El gato duerme en el sofá.', type: 'Sustantivos comunes (gato, sofá)' },
    { s: 'El sol brilla fuerte.', type: 'Sustantivo común (sol)' },
    { s: 'Yo escribí un poema.', type: 'Sustantivo común (poema)' },
    { s: 'El ejército marchó ayer.', type: 'Sustantivo colectivo (ejército)' },
    { s: 'Ella siente mucha alegría.', type: 'Sustantivo abstracto (alegría)' },
    { s: 'Comimos rico pan.', type: 'Sustantivo primitivo/concreto (pan)' },
    { s: 'Visitaremos París pronto.', type: 'Sustantivo propio (París)' },
];
const classifyTaskDB = [
    { w: 'perros', inf: 'perro', t: 'Común', p: 'Masculino', n: 'Plural' },
    { w: 'jauría', inf: 'jauría', t: 'Colectivo', p: 'Femenino', n: 'Singular' },
    { w: 'mesas', inf: 'mesa', t: 'Concreto', p: 'Femenino', n: 'Plural' },
    { w: 'paz', inf: 'paz', t: 'Abstracto', p: 'Femenino', n: 'Singular' },
    { w: 'Pedro', inf: 'Pedro', t: 'Propio', p: 'Masculino', n: 'Singular' },
    { w: 'ciudades', inf: 'ciudad', t: 'Común', p: 'Femenino', n: 'Plural' },
    { w: 'Honduras', inf: 'Honduras', t: 'Propio', p: 'Femenino', n: 'Singular' },
    { w: 'bosque', inf: 'bosque', t: 'Colectivo', p: 'Masculino', n: 'Singular' },
    { w: 'amor', inf: 'amor', t: 'Abstracto', p: 'Masculino', n: 'Singular' },
    { w: 'lápiz', inf: 'lápiz', t: 'Concreto', p: 'Masculino', n: 'Singular' },
    { w: 'árboles', inf: 'árbol', t: 'Común', p: 'Masculino', n: 'Plural' },
    { w: 'rebaño', inf: 'rebaño', t: 'Colectivo', p: 'Masculino', n: 'Singular' },
    { w: 'aguas', inf: 'agua', t: 'Incontable', p: 'Femenino', n: 'Plural' },
    { w: 'alegría', inf: 'alegría', t: 'Abstracto', p: 'Femenino', n: 'Singular' },
    { w: 'flores', inf: 'flor', t: 'Común', p: 'Femenino', n: 'Plural' },
];
const completeTaskDB = [
    { s: 'El ___ corría por el parque atrapando su pelota.', opts: ['perro', 'gato', 'árbol'], ans: 'perro' },
    { s: 'La capital de Francia es ___, una ciudad hermosa.', opts: ['España', 'París', 'Londres'], ans: 'París' },
    { s: 'El conjunto de abejas se llama ___.', opts: ['manada', 'rebaño', 'enjambre'], ans: 'enjambre' },
    { s: 'Siento mucha ___ cuando veo a mi familia.', opts: ['tristeza', 'alegría', 'mesas'], ans: 'alegría' },
    { s: 'Las ___ del árbol cayeron en otoño.', opts: ['hojas', 'hoja', 'ramas'], ans: 'hojas' },
    { s: 'Necesito comprar un ___ nuevo para escribir.', opts: ['lápiz', 'cuaderno', 'libreta'], ans: 'lápiz/cuaderno' },
    { s: 'El río ___ es muy importante en Honduras.', opts: ['Ulúa', 'Nilo', 'Amazonas'], ans: 'Ulúa' },
    { s: 'Mi ___ se llama Carmen.', opts: ['abuela', 'tío', 'primos'], ans: 'abuela' },
    { s: 'El ___ amazónico es inmenso.', opts: ['ríos', 'selva', 'bosque'], ans: 'bosque' },
    { s: 'La ___ es un valor muy importante en la sociedad.', opts: ['mesa', 'justicia', 'perro'], ans: 'justicia' },
];
const explainQuestions = [
    { q: '¿Qué es un sustantivo? Menciona 2 ejemplos.', ans: 'Es la palabra que sirve para nombrar personas, animales, cosas, etc. Ej: mesa, Carlos.' },
    { q: '¿Cuál es la diferencia entre un sustantivo común y uno propio?', ans: 'El común nombra en general (ciudad) y el propio distingue (París) y va con mayúscula.' },
    { q: 'Explica qué son los sustantivos abstractos y da un ejemplo.', ans: 'Son los que nombran ideas o sentimientos que no se ven ni tocan. Ejemplo: paz, amor.' },
    { q: '¿Qué es un sustantivo colectivo? Menciona uno.', ans: 'El que nombra a un grupo de seres en singular. Ejemplo: jauría, enjambre.' },
    { q: '¿Cómo identificamos el género y el número de un sustantivo?', ans: 'El género indica si es masculino o femenino (el/la), y el número si es singular o plural (uno/varios).' },
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
    _instrBlock(out, 'Instrucción', ['Copia en tu cuaderno; subraya, colorea o encierra el sustantivo principal en las siguientes oraciones. Escribe al lado de qué tipo es.', '<strong>Ejemplo:</strong> El perro corre rápido. → <span style="color:var(--jade);font-weight:700;">Sustantivo común (perro)</span>']);
    _pick(identifyTaskDB, Math.min(count, identifyTaskDB.length)).forEach((item, i) => {
        const div = document.createElement('div'); div.className = 'tg-task';
        div.innerHTML = `<div class="tg-task-num">${i + 1}</div><div class="tg-task-content"><em style="font-size:0.92rem;">${item.s}</em><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
        out.appendChild(div);
    });
}

function genClassifyTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia la siguiente tabla en tu cuaderno. Para cada sustantivo, completa cuál es su forma en singular, su clase (Común/Propio/etc.), su género (Masculino/Femenino) y su número (Singular/Plural).']);
    const items = _pick(classifyTaskDB, Math.min(count, classifyTaskDB.length));
    const wrap = document.createElement('div'); wrap.style.overflowX = 'auto';
    const th = (t, extra = '') => `<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;
    let html = `<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:520px;"><thead><tr style="background:var(--pri-gl);">${th('Sustantivo', 'text-align:left;')}${th('Singular')}${th('Clase')}${th('Género')}${th('Número')}</tr></thead><tbody>`;
    items.forEach(it => {
        html += `<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td>` + Array(4).fill(`<td style="padding:0.4rem;border:1px solid var(--border);min-width:50px;"></td>`).join('') + '</tr>';
    });
    html += '</tbody></table>';
    wrap.innerHTML = html; out.appendChild(wrap);
    const ans = document.createElement('div'); ans.className = 'tg-answer'; ans.style.marginTop = '0.8rem';
    ans.innerHTML = '<strong>✅ Respuestas:</strong><br>' + items.map(it => {
        return `<strong>${it.w}:</strong> Singular: ${it.inf} | Clase: ${it.t} | Género: ${it.p} | Número: ${it.n}`;
    }).join('<br>');
    out.appendChild(ans);
}

function genCompleteTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Debajo de cada oración hay opciones de sustantivos. Elige y escribe la opción correcta que concuerde en género y número.']);
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
        // Horizontal: SUSTANTIVO(fila 0), NUMERO(fila 9)
        // Vertical:   GENERO(col 0)
        // Diagonal↘:  CONCRETO(desde 1,1)
        // Diagonal↗:  COMUN(desde 8,5), PROPIO(desde 8,1)
        size: 10,
        grid: [
            ['S', 'U', 'S', 'T', 'A', 'N', 'T', 'I', 'V', 'O'],
            ['G', 'C', 'L', 'P', 'Q', 'Z', 'W', 'R', 'B', 'K'],
            ['E', 'A', 'O', 'F', 'Y', 'M', 'V', 'D', 'L', 'U'],
            ['N', 'T', 'K', 'N', 'B', 'C', 'O', 'J', 'G', 'H'],
            ['E', 'J', 'H', 'W', 'C', 'I', 'L', 'K', 'A', 'N'],
            ['R', 'Q', 'Z', 'U', 'P', 'R', 'D', 'T', 'U', 'Y'],
            ['O', 'X', 'Y', 'O', 'B', 'C', 'E', 'M', 'F', 'K'],
            ['L', 'Z', 'R', 'F', 'M', 'W', 'O', 'T', 'D', 'C'],
            ['A', 'P', 'G', 'K', 'H', 'C', 'I', 'J', 'O', 'X'],
            ['T', 'Y', 'N', 'U', 'M', 'E', 'R', 'O', 'K', 'B']
        ],
        words: [
            { w: 'SUSTANTIVO', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8], [0, 9]] },
            { w: 'CONCRETO', cells: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [8, 8]] },
            { w: 'GENERO', cells: [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0]] },
            { w: 'NUMERO', cells: [[9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7]] },
            { w: 'COMUN', cells: [[8, 5], [7, 6], [6, 7], [5, 8], [4, 9]] },
            { w: 'PROPIO', cells: [[8, 1], [7, 2], [6, 3], [5, 4], [4, 5], [3, 6]] }
        ]
    },
    {
        // Horizontal: COLECTIVO(fila 0), REBAÑO(fila 2), INDIVIDUAL(fila 9)
        // Vertical:   JAURIA(col 1), MASCULINO(col 9)
        // Diagonal↗:  OVEJA(desde 7,4)
        size: 10,
        grid: [
            ['C', 'O', 'L', 'E', 'C', 'T', 'I', 'V', 'O', 'M'],
            ['P', 'J', 'E', 'M', 'K', 'N', 'I', 'Z', 'W', 'A'],
            ['K', 'A', 'R', 'E', 'B', 'A', 'Ñ', 'O', 'F', 'S'],
            ['Q', 'U', 'Z', 'O', 'V', 'Y', 'T', 'D', 'A', 'C'],
            ['Y', 'R', 'H', 'G', 'J', 'W', 'S', 'J', 'P', 'U'],
            ['M', 'I', 'N', 'B', 'P', 'K', 'E', 'Z', 'K', 'L'],
            ['L', 'A', 'P', 'O', 'I', 'V', 'Y', 'T', 'R', 'I'],
            ['W', 'K', 'E', 'S', 'O', 'F', 'G', 'H', 'J', 'N'],
            ['X', 'C', 'V', 'B', 'N', 'M', 'K', 'L', 'P', 'O'],
            ['I', 'N', 'D', 'I', 'V', 'I', 'D', 'U', 'A', 'L']
        ],
        words: [
            { w: 'COLECTIVO', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8]] },
            { w: 'INDIVIDUAL', cells: [[9, 0], [9, 1], [9, 2], [9, 3], [9, 4], [9, 5], [9, 6], [9, 7], [9, 8], [9, 9]] },
            { w: 'MASCULINO', cells: [[0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9], [8, 9]] },
            { w: 'JAURIA', cells: [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]] },
            { w: 'REBAÑO', cells: [[2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7]] },
            { w: 'OVEJA', cells: [[7, 4], [6, 5], [5, 6], [4, 7], [3, 8]] }
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
    { q: 'El sustantivo es la palabra que nombra personas, animales, cosas, lugares e ideas.', a: true },
    { q: 'Los sustantivos propios se escriben siempre con minúscula.', a: false },
    { q: '«Ejército» es un sustantivo colectivo porque nombra un grupo de soldados.', a: true },
    { q: 'Los sustantivos abstractos se pueden percibir con los cinco sentidos.', a: false },
    { q: '«Agua» es un sustantivo contable.', a: false },
    { q: 'El plural de «lápiz» es «lápices».', a: true },
    { q: '«Panadería» es un sustantivo primitivo.', a: false },
    { q: 'Los sustantivos concretos se pueden ver, oír, tocar, oler o saborear.', a: true },
    { q: '«Perro» es un sustantivo propio.', a: false },
    { q: 'Los sustantivos masculinos llevan el artículo «el» o «los».', a: true },
    { q: '«Valentía» es un sustantivo concreto.', a: false },
    { q: '«Casita» es un sustantivo en forma diminutiva.', a: true },
    { q: 'Un sustantivo común nombra a un ser específico y único.', a: false },
    { q: '«Flor» es un sustantivo primitivo.', a: true },
    { q: 'Los sustantivos colectivos siempre se escriben en plural.', a: false },
];
const evalMCBank = [
    { q: '¿Qué es un sustantivo?', o: ['a) Palabra que indica acción', 'b) Palabra que nombra seres y cosas', 'c) Palabra que describe cualidades', 'd) Palabra que une oraciones'], a: 1 },
    { q: '¿Cuál es un sustantivo propio?', o: ['a) perro', 'b) ciudad', 'c) Tegucigalpa', 'd) libertad'], a: 2 },
    { q: '¿Qué tipo de sustantivo es «amor»?', o: ['a) Concreto', 'b) Colectivo', 'c) Propio', 'd) Abstracto'], a: 3 },
    { q: '¿Cuál es un sustantivo colectivo?', o: ['a) soldado', 'b) enjambre', 'c) mesa', 'd) alegría'], a: 1 },
    { q: '¿Cómo se forma el plural de «reloj»?', o: ['a) relojs', 'b) relojces', 'c) relojes', 'd) reloje'], a: 2 },
    { q: '¿Qué sustantivo es incontable?', o: ['a) libro', 'b) gato', 'c) arena', 'd) estrella'], a: 2 },
    { q: '¿Cuál es un sustantivo derivado de «flor»?', o: ['a) florida', 'b) florero', 'c) florido', 'd) floral'], a: 1 },
    { q: '¿Qué tipo de sustantivo es «chocolate»?', o: ['a) Abstracto', 'b) Colectivo', 'c) Concreto', 'd) Propio'], a: 2 },
    { q: '¿Cuál es un sustantivo individual?', o: ['a) bosque', 'b) ejército', 'c) manada', 'd) árbol'], a: 3 },
    { q: '¿Qué forma tiene «perrazo»?', o: ['a) Diminutiva', 'b) Despectiva', 'c) Aumentativa', 'd) Primitiva'], a: 2 },
    { q: 'Los sustantivos que terminan en -z forman el plural cambiando -z por:', o: ['a) -zs', 'b) -zes', 'c) -ces', 'd) -zces'], a: 2 },
    { q: '¿Cuál de estos es un sustantivo abstracto?', o: ['a) mesa', 'b) río', 'c) justicia', 'd) guitarra'], a: 2 },
    { q: '¿Qué artículo acompaña a los sustantivos femeninos?', o: ['a) el', 'b) los', 'c) un', 'd) la'], a: 3 },
    { q: '¿Cuál es un sustantivo primitivo?', o: ['a) panadería', 'b) florero', 'c) zapatero', 'd) pan'], a: 3 },
    { q: '«Rebaño» es un sustantivo colectivo de:', o: ['a) árboles', 'b) soldados', 'c) ovejas', 'd) abejas'], a: 2 },
];
const evalCPBank = [
    { q: 'Los sustantivos ___ se escriben siempre con mayúscula inicial.', a: 'propios' },
    { q: '«Bosque» es un sustantivo ___ porque nombra un conjunto de árboles.', a: 'colectivo' },
    { q: 'La palabra «amor» es un sustantivo ___.', a: 'abstracto' },
    { q: '«Panadería» es un sustantivo ___ de la palabra «pan».', a: 'derivado' },
    { q: 'El plural de «lápiz» es ___.', a: 'lápices' },
    { q: 'Los sustantivos ___ se pueden percibir con los cinco sentidos.', a: 'concretos' },
    { q: '«Agua» es un sustantivo ___ porque no se puede contar.', a: 'incontable' },
    { q: '«Casita» es un sustantivo en forma ___.', a: 'diminutiva' },
    { q: 'Los sustantivos ___ llevan el artículo «el» o «los».', a: 'masculinos' },
    { q: 'El ___ nombra a más de un ser u objeto.', a: 'plural' },
    { q: '«Flor» es un sustantivo ___ porque no viene de ninguna otra palabra.', a: 'primitivo' },
    { q: 'Los sustantivos ___ nombran a cualquier ser de su clase sin distinguirlo.', a: 'comunes' },
    { q: '«Ejército» es un sustantivo ___ que nombra un grupo de soldados.', a: 'colectivo' },
    { q: '«Perrazo» es un sustantivo en forma ___.', a: 'aumentativa' },
    { q: 'Un sustantivo ___ nombra a un solo ser u objeto.', a: 'individual' },
];
const evalPRBank = [
    { term: 'Sustantivo propio', def: 'Nombra a un ser o lugar específico con mayúscula' },
    { term: 'Sustantivo común', def: 'Nombra a cualquier ser de su clase' },
    { term: 'Sustantivo concreto', def: 'Se percibe con los cinco sentidos' },
    { term: 'Sustantivo abstracto', def: 'Nombra sentimientos, ideas o cualidades' },
    { term: 'Sustantivo colectivo', def: 'Nombra un grupo de seres en singular' },
    { term: 'Sustantivo individual', def: 'Nombra a un solo ser u objeto' },
    { term: 'Sustantivo contable', def: 'Se puede contar con números' },
    { term: 'Sustantivo incontable', def: 'Se mide pero no se cuenta' },
    { term: 'Sustantivo primitivo', def: 'Palabra original que no viene de otra' },
    { term: 'Sustantivo derivado', def: 'Se forma con sufijos a partir de un primitivo' },
    { term: 'Aumentativo', def: 'Forma que agranda: perrazo, casona' },
    { term: 'Diminutivo', def: 'Forma que achica o da cariño: casita, perrito' },
    { term: 'Género masculino', def: 'Lleva el artículo «el» o «los»' },
    { term: 'Género femenino', def: 'Lleva el artículo «la» o «las»' },
    { term: 'Número plural', def: 'Nombra más de un ser: casas, flores' },
];

function genEval() {
    sfx('click');
    const cf = evalFormNum;
    window._currentEvalForm = cf;
    evalFormNum = (evalFormNum % 10) + 1;
    saveProgress();
    document.getElementById('eval-screen-title').textContent = `📝 Evaluación Final — Forma ${cf} · Los Sustantivos`;
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
    if (e.includes('comun')) variants.add('comun');
    if (e.includes('propio')) variants.add('propio');
    if (e.includes('concreto')) variants.add('concreto');
    if (e.includes('abstracto')) variants.add('abstracto');
    return variants.has(s) || e.replace(/[^a-záéíóú0-9]/g, '') === s.replace(/[^a-záéíóú0-9]/g, '');
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
<title>Evaluación Los Sustantivos · Forma ${forma}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body {font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:2mm 6mm;}
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
  <h2>Evaluación Final de Misión Los Sustantivos — Español — Lengua</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
<div class="pauta-wrap">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · Misión Los Sustantivos · Forma ${forma}</div>
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
    const msgs = ['🚀 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!', '🌱 ¡GRAN INICIO! Estás dando los primeros pasos.', '📚 ¡BUEN TRABAJO! Vas progresando muy bien.', '💪 ¡MUY BIEN! Dominas gran parte del contenido.', '🌟 ¡INCREÍBLE avance! Estás cerca de la excelencia.', '🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Sustantivos!'];
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
    const txt = `${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: Los Sustantivos\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText ? '\n\n🏅 Logros desbloqueados:\n' + achText : ''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo Familia Polanco-Castellanos\n🌐 policastsapien.com`;
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
    const savedName = localStorage.getItem('nombreEstudianteSustantivos');
    const inputName = document.querySelector('.diploma-input');
    if (savedName && inputName) { inputName.value = savedName; updateDiplomaName(savedName); }
    if (inputName) inputName.addEventListener('input', e => localStorage.setItem('nombreEstudianteSustantivos', e.target.value));
    fin('s-aprende', false);
    fin('s-tipos', false);
});

// =====================================================================
//  LA MÁQUINA CLASIFICADORA
// =====================================================================
// axis: 'pc' = ¿Propio o Común?   |   axis: 'ac' = ¿Abstracto o Concreto?
//
// Regla del banco de palabras:
//   - Eje 'pc': propios son nombres únicos (personas, lugares).
//               Comunes incluyen tanto concretos (niño, río) COMO abstractos
//               (amistad, problema) para que el estudiante vea que "común"
//               no equivale a "concreto". Ninguna palabra se repite en 'ac'.
//   - Eje 'ac': palabras donde la distinción sensorial es clara y no causan
//               confusión con el eje propio/común.
const MAQ_WORDS = [
    // — Eje Propio / Común —
    { word: 'Honduras',    type: 'propio', axis: 'pc', emoji: '🇭🇳' },
    { word: 'María',       type: 'propio', axis: 'pc', emoji: '👤'  },
    { word: 'Tegucigalpa', type: 'propio', axis: 'pc', emoji: '🏙️' },
    { word: 'Copán',       type: 'propio', axis: 'pc', emoji: '🏛️' },
    { word: 'Lempira',     type: 'propio', axis: 'pc', emoji: '⚔️' },
    { word: 'Juan',        type: 'propio', axis: 'pc', emoji: '🧑' },
    // Comunes concretos (para mostrar que común ≠ solo abstracto)
    { word: 'niño',        type: 'comun',  axis: 'pc', emoji: '🧒' },
    { word: 'ciudad',      type: 'comun',  axis: 'pc', emoji: '🏙️' },
    { word: 'río',         type: 'comun',  axis: 'pc', emoji: '🏞️' },
    { word: 'animal',      type: 'comun',  axis: 'pc', emoji: '🐾' },
    // Comunes abstractos (para mostrar que común ≠ solo concreto)
    { word: 'amistad',     type: 'comun',  axis: 'pc', emoji: '🤝' },
    { word: 'problema',    type: 'comun',  axis: 'pc', emoji: '❓' },
    // — Eje Abstracto / Concreto —
    { word: 'amor',        type: 'abstracto', axis: 'ac', emoji: '❤️' },
    { word: 'libertad',    type: 'abstracto', axis: 'ac', emoji: '🕊️' },
    { word: 'valentía',    type: 'abstracto', axis: 'ac', emoji: '💪' },
    { word: 'tristeza',    type: 'abstracto', axis: 'ac', emoji: '😢' },
    { word: 'esperanza',   type: 'abstracto', axis: 'ac', emoji: '🌟' },
    { word: 'justicia',    type: 'abstracto', axis: 'ac', emoji: '⚖️' },
    { word: 'piedra',      type: 'concreto',  axis: 'ac', emoji: '🪨' },
    { word: 'lluvia',      type: 'concreto',  axis: 'ac', emoji: '🌧️' },
    { word: 'pan',         type: 'concreto',  axis: 'ac', emoji: '🍞' },
    { word: 'mariposa',    type: 'concreto',  axis: 'ac', emoji: '🦋' },
    { word: 'montaña',     type: 'concreto',  axis: 'ac', emoji: '⛰️' },
    { word: 'música',      type: 'concreto',  axis: 'ac', emoji: '🎵' },
];

// Ejes de clasificación: cada eje tiene su pregunta y sus dos tipos válidos
const MAQ_AXES = {
    pc: { label: '¿Propio o Común?',       types: ['propio',    'comun']    },
    ac: { label: '¿Abstracto o Concreto?', types: ['abstracto', 'concreto'] },
};

const MAQ_CATS = [
    { type: 'propio',    label: 'Propio',    icon: '⭐' },
    { type: 'comun',     label: 'Común',     icon: '🏠' },
    { type: 'abstracto', label: 'Abstracto', icon: '💭' },
    { type: 'concreto',  label: 'Concreto',  icon: '🪨' },
];

let maqQueue = [], maqIdx = 0, maqActive = false;
let maqScore = { correct: 0, errors: 0 };
let maqBinCounts = { propio: 0, comun: 0, abstracto: 0, concreto: 0 };
let maqXpSet = new Set();

function maqEnsureInit() {
    const host = document.getElementById('widget-clasificador');
    if (host && !host.hasChildNodes()) initMaq();
}

function initMaq() {
    const host = document.getElementById('widget-clasificador');
    if (!host) return;

    maqQueue = _shuffle([...MAQ_WORDS]);
    maqIdx = 0;
    maqScore = { correct: 0, errors: 0 };
    maqBinCounts = { propio: 0, comun: 0, abstracto: 0, concreto: 0 };
    maqActive = false;

    host.innerHTML = `
      <div class="maq-machine">
        <div class="maq-info-bar">
          <span class="maq-info-ok">✅ <span id="maqOk">0</span> correctas</span>
          <span class="maq-info-ctr" id="maqCtr" aria-live="polite">1 / ${maqQueue.length}</span>
          <span class="maq-info-err">❌ <span id="maqErr">0</span> errores</span>
        </div>
        <div class="maq-progress-wrap">
          <div class="maq-progress-fill" id="maqProgFill" style="width:0%"></div>
        </div>

        <div class="maq-scene" role="region" aria-label="Cinta transportadora">

          <div class="maq-shredder" id="maqShredder" aria-hidden="true">
            <div class="maq-shred-top">💢</div>
            <div class="maq-shred-teeth">
              <span></span><span></span><span></span><span></span><span></span>
            </div>
          </div>

          <div class="maq-axis-label" id="maqAxisLabel" aria-live="polite"></div>

          <div class="maq-belt-row">
            <div class="maq-roller" aria-hidden="true"></div>
            <div class="maq-belt" aria-hidden="true">
              <div class="maq-chip-stage">
                <div class="maq-word-chip" id="maqChip" aria-live="assertive" aria-atomic="true">
                  <span class="maq-chip-emoji" id="maqChipEmoji"></span>
                  <span class="maq-chip-word"  id="maqChipWord"></span>
                </div>
              </div>
            </div>
            <div class="maq-roller" aria-hidden="true"></div>
          </div>

          <div class="maq-bins" aria-hidden="true">
            ${MAQ_CATS.map(c => `
              <div class="maq-bin maq-bin-${c.type}" id="maqBin-${c.type}">
                <span class="maq-bin-icon">${c.icon}</span>
                <span class="maq-bin-label">${c.label}</span>
                <span class="maq-bin-count" id="maqCt-${c.type}">0</span>
              </div>
            `).join('')}
          </div>

        </div>

        <div class="maq-controls" id="maqControls" role="group" aria-label="Clasificar sustantivo">
          <div class="maq-axis-group" id="maqGrp-pc">
            <button class="maq-btn maq-btn-propio"    data-type="propio"    onclick="maqAnswer('propio')"    aria-label="Clasificar como Propio">
              <span class="maq-btn-icon">⭐</span><span class="maq-btn-label">Propio</span>
            </button>
            <button class="maq-btn maq-btn-comun"     data-type="comun"     onclick="maqAnswer('comun')"     aria-label="Clasificar como Común">
              <span class="maq-btn-icon">🏠</span><span class="maq-btn-label">Común</span>
            </button>
          </div>
          <div class="maq-axis-group" id="maqGrp-ac">
            <button class="maq-btn maq-btn-abstracto" data-type="abstracto" onclick="maqAnswer('abstracto')" aria-label="Clasificar como Abstracto">
              <span class="maq-btn-icon">💭</span><span class="maq-btn-label">Abstracto</span>
            </button>
            <button class="maq-btn maq-btn-concreto"  data-type="concreto"  onclick="maqAnswer('concreto')"  aria-label="Clasificar como Concreto">
              <span class="maq-btn-icon">🪨</span><span class="maq-btn-label">Concreto</span>
            </button>
          </div>
        </div>

        <div class="maq-footer">
          <div class="maq-feedback" id="maqFb" role="alert" aria-live="polite"></div>
          <button class="maq-restart" onclick="initMaq()">🔄 Reiniciar</button>
        </div>
      </div>`;

    setTimeout(() => maqNextWord(), 200);
}

/* Set chip CSS vars. Pass animated=false to jump instantly (no transition). */
function maqSetChip(xpx, ypx, s, op, animated) {
    const chip = document.getElementById('maqChip');
    if (!chip) return;
    if (!animated) {
        chip.style.transition = 'none';
        void chip.offsetWidth; // force reflow so the "none" takes effect immediately
    } else {
        chip.style.transition = 'transform 0.55s cubic-bezier(.34,1.4,.64,1), opacity 0.35s ease';
    }
    chip.style.setProperty('--cx', xpx + 'px');
    chip.style.setProperty('--cy', ypx + 'px');
    chip.style.setProperty('--cs', s);
    chip.style.setProperty('--co', op);
}

function maqNextWord() {
    if (maqIdx >= maqQueue.length) { maqShowEnd(); return; }

    const w = maqQueue[maqIdx];
    const emojiEl = document.getElementById('maqChipEmoji');
    const wordEl  = document.getElementById('maqChipWord');
    const fb      = document.getElementById('maqFb');
    const ctr     = document.getElementById('maqCtr');
    const fill    = document.getElementById('maqProgFill');

    if (emojiEl) emojiEl.textContent = w.emoji;
    if (wordEl)  wordEl.textContent  = w.word;
    if (fb)      { fb.textContent = ''; fb.className = 'maq-feedback'; }
    if (ctr)     ctr.textContent = `${maqIdx + 1} / ${maqQueue.length}`;
    if (fill)    fill.style.width = `${(maqIdx / maqQueue.length) * 100}%`;

    // Show which classification axis applies to this word
    const axisEl = document.getElementById('maqAxisLabel');
    if (axisEl) axisEl.textContent = MAQ_AXES[w.axis].label;

    maqSetBtns(false);

    // Place chip off-screen left instantly, then animate in.
    // Uses setTimeout instead of double-rAF: more reliable on Android Chrome.
    maqSetChip(-180, 0, 0.6, 0, false);
    setTimeout(() => {
        maqSetChip(0, 0, 1, 1, true);
        setTimeout(() => { maqSetBtns(true, w.axis); maqActive = true; }, 440);
    }, 32);
}

function maqAnswer(type) {
    if (!maqActive) return;
    maqActive = false;
    maqSetBtns(false);
    sfx('click');

    const w    = maqQueue[maqIdx];
    const chip = document.getElementById('maqChip');
    const fb   = document.getElementById('maqFb');

    if (type === w.type) {
        // ---- CORRECT ----
        maqScore.correct++;
        maqBinCounts[type]++;
        const okEl  = document.getElementById('maqOk');
        const ctEl  = document.getElementById(`maqCt-${type}`);
        const binEl = document.getElementById(`maqBin-${type}`);
        if (okEl)  okEl.textContent  = maqScore.correct;
        if (ctEl)  ctEl.textContent  = maqBinCounts[type];
        if (fb) { fb.textContent = `✅ ¡Correcto! "${w.word}" es sustantivo ${maqCatLabel(type).toLowerCase()}.`; fb.className = 'maq-feedback maq-fb-ok'; }
        if (!maqXpSet.has(maqIdx)) { pts(2); maqXpSet.add(maqIdx); }
        sfx('ok');

        if (chip && binEl) {
            const cr = chip.getBoundingClientRect();
            const br = binEl.getBoundingClientRect();
            const dx = (br.left + br.width  / 2) - (cr.left + cr.width  / 2);
            const dy = (br.top  + br.height / 2) - (cr.top  + cr.height / 2);
            chip.style.transition = 'transform 0.5s cubic-bezier(.4,0,.2,1), opacity 0.4s ease';
            chip.style.setProperty('--cx', dx + 'px');
            chip.style.setProperty('--cy', dy + 'px');
            chip.style.setProperty('--cs', '0.1');
            chip.style.setProperty('--co', '0');
            binEl.classList.remove('maq-bin-pop');
            void binEl.offsetWidth;
            binEl.classList.add('maq-bin-pop');
        }
        setTimeout(() => { maqIdx++; maqNextWord(); }, 620);

    } else {
        // ---- WRONG ----
        maqScore.errors++;
        const errEl = document.getElementById('maqErr');
        if (errEl) errEl.textContent = maqScore.errors;
        if (fb) { fb.textContent = `❌ No es ${maqCatLabel(type)}. Esa palabra era: ${maqCatLabel(w.type)}.`; fb.className = 'maq-feedback maq-fb-err'; }
        sfx('no');

        if (chip) {
            chip.classList.remove('maq-chip-shake');
            void chip.offsetWidth;
            chip.classList.add('maq-chip-shake');
            // Use setTimeout instead of animationend: more reliable on iOS Safari
            // and when prefers-reduced-motion is active (animation never fires).
            setTimeout(() => {
                chip.classList.remove('maq-chip-shake');
                const shredder = document.getElementById('maqShredder');
                if (shredder) {
                    const cr = chip.getBoundingClientRect();
                    const sr = shredder.getBoundingClientRect();
                    const dx = (sr.left + sr.width  / 2) - (cr.left + cr.width  / 2);
                    const dy = (sr.top  + sr.height / 2) - (cr.top  + cr.height / 2);
                    chip.style.transition = 'transform 0.35s ease-in, opacity 0.3s ease';
                    chip.style.setProperty('--cx', dx + 'px');
                    chip.style.setProperty('--cy', dy + 'px');
                    chip.style.setProperty('--cs', '0.05');
                    chip.style.setProperty('--co', '0');
                    shredder.classList.remove('maq-shred-flash');
                    void shredder.offsetWidth;
                    shredder.classList.add('maq-shred-flash');
                }
                setTimeout(() => { maqIdx++; maqNextWord(); }, 400);
            }, 460); // 420ms animation duration + 40ms buffer
        }
    }
}

function maqCatLabel(type) {
    return { propio: 'Propio', comun: 'Común', abstracto: 'Abstracto', concreto: 'Concreto' }[type] || type;
}

function maqSetBtns(on, axis) {
    // Show only the 2-button group that belongs to the current axis.
    // The other group is hidden entirely so the student never sees
    // categories that don't apply to this word.
    Object.keys(MAQ_AXES).forEach(ax => {
        const grp = document.getElementById(`maqGrp-${ax}`);
        if (!grp) return;
        grp.style.display = (!axis || axis === ax) ? '' : 'none';
    });
    document.querySelectorAll('#maqControls .maq-btn').forEach(b => {
        const inAxis = !axis || MAQ_AXES[axis].types.includes(b.dataset.type);
        b.disabled = !on || !inAxis;
    });
}

function maqShowEnd() {
    const host = document.getElementById('widget-clasificador');
    if (!host) return;
    const total = maqQueue.length;
    const pct   = Math.round((maqScore.correct / total) * 100);
    const medal = pct === 100 ? '🥇' : pct >= 80 ? '🥈' : pct >= 60 ? '🥉' : '🎯';
    const msg   = pct === 100 ? '¡Máquina perfecta! ¡Eres un maestro clasificador!'
                : pct >= 80  ? '¡Excelente! La máquina quedó muy impresionada.'
                : pct >= 60  ? '¡Bien! Sigue practicando para perfeccionar tu clasificación.'
                :               '¡Estudia los tipos de sustantivos y vuelve a intentarlo!';
    const machine = host.querySelector('.maq-machine');
    if (!machine) return;
    machine.innerHTML = `
      <div class="maq-end">
        <div class="maq-end-medal">${medal}</div>
        <div class="maq-end-pct">${pct}%</div>
        <div class="maq-end-msg">${msg}</div>
        <p class="maq-end-detail">✅ ${maqScore.correct} correctas &nbsp;·&nbsp; ❌ ${maqScore.errors} errores &nbsp;·&nbsp; ${total} palabras</p>
        <button class="btn btn-pri" onclick="initMaq()">🔄 Jugar de nuevo</button>
      </div>`;
    sfx(pct >= 70 ? 'fan' : 'up');
}