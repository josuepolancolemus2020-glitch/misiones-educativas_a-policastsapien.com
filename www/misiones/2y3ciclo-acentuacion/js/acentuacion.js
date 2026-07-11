// En escritorio (Windows) la app de WhatsApp corrompe los emojis recibidos vía wa.me; WhatsApp Web los conserva
function _waShare(texto){const enc=encodeURIComponent(texto);const esMovil=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);window.open(esMovil?'https://wa.me/?text='+enc:'https://web.whatsapp.com/send?text='+enc,'_blank');}
// Compartir misión por WhatsApp
function compartirMision() {
    const url = window.location.href;
    const texto = `🚀 *Misión Asignada* 🚀\n\nPractica sobre este tema y sobresale en ser de los mejores alumnos. 🏆\n\nDesbloquea *todos los logros* y envía a tu maestro la *constancia de logro* cuando hayas culminado. 📋\n\n_Se te hará prueba escrita y serás excelente estudiante en Lengua y Literatura._ ✍️\n\n👇 *TOCA EL ENLACE PARA INICIAR TU MISIÓN* 👇\n${url}`;
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
const SAVE_KEY = 'acentuacion_v1';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1;
let unlockedAch = [];
let darkMode = false;
let prevLevel = 0;
let evalCritFormNum = 1, evalCritAnsVisible = false;
const TOTAL_SECTIONS = 13;

const xpTracker = {
    fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(),
    cmp: new Set(), reto: new Set(), sopa: new Set(), wgt: new Set(),
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
const ACHIEVEMENTS = {
    primer_quiz: { icon: '🧠', label: 'Primera prueba superada' },
    flash_master: { icon: '🃏', label: 'Todas las flashcards vistas' },
    clasif_pro: { icon: '🗂️', label: 'Clasificador experto' },
    id_master: { icon: '🔍', label: 'Identificador maestro' },
    reto_hero: { icon: '🏆', label: 'Héroe del reto final' },
    nivel3: { icon: '🔭', label: '¡Explorador alcanzado! Nivel 3' },
    nivel5: { icon: '🥇', label: '¡Campeón alcanzado! Nivel 6' },
    widgets_master: { icon: '🧩', label: 'Widgets de acentuación dominados' }
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
    { w: 'Sílaba', a: '🔤 Unidad mínima de pronunciación de una palabra. Toda sílaba tiene como núcleo una <strong>vocal</strong>. Ej: ca-sa (2 sílabas).' },
    { w: 'Sílaba tónica', a: '💪 La sílaba que se pronuncia con <strong>mayor intensidad</strong> dentro de la palabra. Ej: en "ca-MI-no", la tónica es "mi".' },
    { w: 'Vocales fuertes y débiles', a: '🔡 Fuertes (abiertas): <strong>a, e, o</strong>. Débiles (cerradas): <strong>i, u</strong>. Su combinación determina si hay diptongo, triptongo o hiato.' },
    { w: 'Diptongo', a: '🔗 Unión de <strong>dos vocales</strong> en una misma sílaba: fuerte + débil átona (o viceversa), o dos débiles distintas. Ej: ai-re, pia-no, ciu-dad.' },
    { w: 'Triptongo', a: '🔺 Unión de <strong>tres vocales</strong> en una misma sílaba: débil átona + fuerte + débil átona. Ej: buey, U-ru-guay, miau.' },
    { w: 'Hiato simple', a: '➗ Dos vocales <strong>fuertes</strong> juntas que se pronuncian en sílabas separadas. Ej: ca-os, po-e-ta, te-a-tro.' },
    { w: 'Hiato acentual', a: '⚡ Vocal <strong>débil tónica</strong> junto a una fuerte (o viceversa); rompe el diptongo y <strong>siempre lleva tilde</strong> en la débil. Ej: dí-a, ba-úl, pa-ís.' },
    { w: 'Palabra Aguda', a: '🔚 La sílaba tónica es la <strong>última</strong>. Lleva tilde si termina en <strong>n, s o vocal</strong>. Ej: camión, sofá, compás.' },
    { w: 'Palabra Llana (Grave)', a: '➖ La sílaba tónica es la <strong>penúltima</strong>. Lleva tilde si <strong>NO</strong> termina en n, s o vocal. Ej: árbol, azúcar.' },
    { w: 'Palabra Esdrújula', a: '⏫ La sílaba tónica es la <strong>antepenúltima</strong>. <strong>Siempre</strong> lleva tilde. Ej: música, médico.' },
    { w: 'Palabra Sobresdrújula', a: '🔝 La sílaba tónica está antes de la antepenúltima. <strong>Siempre</strong> lleva tilde. Ej: cuéntaselo, explícaselo.' },
    { w: 'Tilde diacrítica', a: '🆚 Tilde que distingue dos palabras que se escriben igual pero tienen <strong>función gramatical distinta</strong>. Ej: él (pronombre) / el (artículo).' },
    { w: 'Mayúsculas y tilde', a: '🔠 Las palabras escritas en <strong>mayúscula también llevan tilde</strong> si la regla lo exige. Ej: ÁFRICA, CAMIÓN, MÚSICA.' },
    { w: 'Adverbios en -mente', a: '🔧 Conservan la tilde del adjetivo original si este la tenía. Ej: fácil → fácilmente; rápida → rápidamente; lenta → lentamente (sin tilde).' },
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
    { q: '¿Cuál es la sílaba tónica de la palabra "camino"?', o: ['a) ca', 'b) mi', 'c) no', 'd) Ninguna'], c: 1 },
    { q: '¿Cuáles son las vocales fuertes?', o: ['a) i, u', 'b) a, e, o', 'c) a, i, u', 'd) Todas las vocales'], c: 1 },
    { q: '"Piano" tiene un diptongo formado por:', o: ['a) Dos vocales fuertes', 'b) Una débil átona + una fuerte', 'c) Tres vocales', 'd) Una fuerte tónica sola'], c: 1 },
    { q: '"Buey" es un ejemplo de:', o: ['a) Diptongo', 'b) Hiato', 'c) Triptongo', 'd) Sílaba átona'], c: 2 },
    { q: '"Día" tiene un hiato acentual porque:', o: ['a) Las dos vocales son fuertes', 'b) La vocal débil "i" es tónica junto a una fuerte', 'c) No tiene vocales juntas', 'd) Es una palabra esdrújula'], c: 1 },
    { q: '¿Cuándo llevan tilde las palabras agudas?', o: ['a) Siempre', 'b) Cuando terminan en n, s o vocal', 'c) Nunca', 'd) Cuando terminan en consonante'], c: 1 },
    { q: '¿Cuándo llevan tilde las palabras llanas?', o: ['a) Cuando terminan en n, s o vocal', 'b) Cuando NO terminan en n, s o vocal', 'c) Siempre', 'd) Nunca'], c: 1 },
    { q: 'Las palabras esdrújulas y sobresdrújulas:', o: ['a) Nunca llevan tilde', 'b) Llevan tilde solo a veces', 'c) Siempre llevan tilde', 'd) Solo llevan tilde si terminan en vocal'], c: 2 },
    { q: 'En la oración "Él no sabe si vendrá", la palabra "Él" lleva tilde porque:', o: ['a) Es aguda terminada en vocal', 'b) Es tilde diacrítica (pronombre)', 'c) Es esdrújula', 'd) Es un error'], c: 1 },
    { q: '¿Cuál de estas palabras es esdrújula?', o: ['a) Camión', 'b) Árbol', 'c) Música', 'd) Compás'], c: 2 },
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
        label: ['Agudas', 'Llanas'], headA: '🔚 Agudas', headB: '➖ Llanas', colA: 'agudas', colB: 'llanas',
        words: [{ w: 'camión', t: 'agudas' }, { w: 'árbol', t: 'llanas' }, { w: 'compás', t: 'agudas' }, { w: 'azúcar', t: 'llanas' }, { w: 'sofá', t: 'agudas' }, { w: 'examen', t: 'llanas' }, { w: 'jardín', t: 'agudas' }, { w: 'lápiz', t: 'llanas' }, { w: 'café', t: 'agudas' }, { w: 'joven', t: 'llanas' }]
    },
    {
        label: ['Esdrújulas', 'Sobresdrújulas'], headA: '⏫ Esdrújulas', headB: '🔝 Sobresdrújulas', colA: 'esdrujulas', colB: 'sobresdrujulas',
        words: [{ w: 'música', t: 'esdrujulas' }, { w: 'cuéntaselo', t: 'sobresdrujulas' }, { w: 'médico', t: 'esdrujulas' }, { w: 'explícaselo', t: 'sobresdrujulas' }, { w: 'página', t: 'esdrujulas' }, { w: 'dígamelo', t: 'sobresdrujulas' }, { w: 'número', t: 'esdrujulas' }, { w: 'llévatelo', t: 'sobresdrujulas' }, { w: 'sábado', t: 'esdrujulas' }, { w: 'devuélvemelo', t: 'sobresdrujulas' }]
    },
    {
        label: ['Diptongo', 'Hiato'], headA: '🔗 Diptongo', headB: '✂️ Hiato', colA: 'diptongo', colB: 'hiato',
        words: [{ w: 'piano', t: 'diptongo' }, { w: 'poeta', t: 'hiato' }, { w: 'aire', t: 'diptongo' }, { w: 'caos', t: 'hiato' }, { w: 'ciudad', t: 'diptongo' }, { w: 'teatro', t: 'hiato' }, { w: 'fuego', t: 'diptongo' }, { w: 'país', t: 'hiato' }, { w: 'bueno', t: 'diptongo' }, { w: 'día', t: 'hiato' }]
    },
    {
        label: ['Con tilde', 'Sin tilde'], headA: '✅ Con tilde', headB: '🚫 Sin tilde', colA: 'contilde', colB: 'sintilde',
        words: [{ w: 'camión', t: 'contilde' }, { w: 'reloj', t: 'sintilde' }, { w: 'árbol', t: 'contilde' }, { w: 'examen', t: 'sintilde' }, { w: 'música', t: 'contilde' }, { w: 'pared', t: 'sintilde' }, { w: 'café', t: 'contilde' }, { w: 'joven', t: 'sintilde' }, { w: 'lápiz', t: 'contilde' }, { w: 'casa', t: 'sintilde' }]
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
    { s: ['La', 'música', 'suena', 'fuerte.'], c: 1, art: 'Palabra esdrújula' },
    { s: ['Compré', 'un', 'sofá', 'nuevo.'], c: 2, art: 'Palabra aguda con tilde' },
    { s: ['El', 'árbol', 'es', 'muy', 'alto.'], c: 1, art: 'Palabra llana con tilde' },
    { s: ['Cuéntaselo', 'a', 'tu', 'hermano.'], c: 0, art: 'Palabra sobresdrújula' },
    { s: ['Él', 'no', 'quiere', 'venir.'], c: 0, art: 'Tilde diacrítica (pronombre personal)' },
    { s: ['Vimos', 'un', 'hermoso', 'día', 'soleado.'], c: 3, art: 'Palabra con hiato acentual' },
    { s: ['El', 'perro', 'duerme', 'en', 'el', 'jardín.'], c: 5, art: 'Palabra aguda con tilde' },
    { s: ['¿Dónde', 'está', 'el', 'baúl', 'azul?'], c: 0, art: 'Adverbio interrogativo con tilde diacrítica' },
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
    const correct = idData[idIdx].c;
    if (i === correct) {
        idDone = true;
        span.classList.add('id-ok');
        fb('fbId', '¡Correcto! +5 XP', true);
        if (!xpTracker.id.has(idIdx)) { xpTracker.id.add(idIdx); pts(5); }
        sfx('ok');
    } else {
        span.classList.add('id-no'); fb('fbId', 'Esa no es la palabra solicitada.', false); sfx('no');
    }
}
function nextId() { sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId() { sfx('click'); idIdx = 0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData = [
    { s: 'Compré un ___ para la sala.', opts: ['sofá', 'sofa', 'sofà'], c: 0 },
    { s: 'El ___ del colegio es muy alto.', opts: ['arbol', 'árbol', 'arból'], c: 1 },
    { s: 'Mi materia favorita es la ___.', opts: ['musica', 'músika', 'música'], c: 2 },
    { s: '___ no quiere ir a la fiesta.', opts: ['El', 'Él', 'EL'], c: 1 },
    { s: 'Hoy hace un ___ muy bonito.', opts: ['dia', 'día', 'diá'], c: 1 },
    { s: '¿___ es tu nombre?', opts: ['Como', 'Cómo', 'Comó'], c: 1 },
    { s: 'El examen fue ___ difícil.', opts: ['bastante', 'bastente', 'bastanté'], c: 0 },
    { s: '___ tu hermano si quiere venir.', opts: ['Pregúntale', 'Preguntale', 'Pregúntalé'], c: 0 },
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

// ===================== WIDGETS =====================
// Widget 1: Ordenar pasos de acentuación
const routeSets = [
    { label: 'Pasos para saber si una palabra lleva tilde', steps: ['Separar la palabra en sílabas', 'Identificar la sílaba tónica', 'Determinar si es aguda, llana, esdrújula o sobresdrújula', 'Aplicar la regla de tildación correspondiente', 'Escribir la tilde si corresponde'] },
    { label: 'Pasos para distinguir diptongo de hiato', steps: ['Identificar las dos vocales que están juntas', 'Determinar si cada una es fuerte (a,e,o) o débil (i,u)', 'Si hay una fuerte y una débil átona, es diptongo', 'Si la vocal débil es tónica, es hiato acentual (lleva tilde)', 'Si ambas vocales son fuertes, es hiato simple'] },
    { label: 'Pasos para aplicar la tilde diacrítica', steps: ['Identificar una palabra que se escribe igual a otra', 'Determinar su función gramatical en la oración', 'Comprobar si es pronombre o adverbio interrogativo/exclamativo', 'Aplicar la tilde solo si corresponde a esa función'] },
];
let currentRouteIdx = 0, routeItems = [];
function buildRoute() { routeItems = _shuffle([...routeSets[currentRouteIdx].steps]); renderRoute(); const fbEl = document.getElementById('fbRoute'); if (fbEl) fbEl.classList.remove('show'); }
function renderRoute() {
    const list = document.getElementById('routeList'); if (!list) return; list.innerHTML = '';
    routeItems.forEach((step, i) => {
        const div = document.createElement('div'); div.className = 'sort-item';
        div.innerHTML = `<div class="sort-arrows"><button class="sort-arrow" onclick="routeMove(${i},-1)"${i === 0 ? ' disabled' : ''}>▲</button><button class="sort-arrow" onclick="routeMove(${i},1)"${i === routeItems.length - 1 ? ' disabled' : ''}>▼</button></div><div class="sort-step-num">${i + 1}.</div><div class="sort-item-txt">${step}</div>`;
        list.appendChild(div);
    });
}
function routeMove(idx, dir) { sfx('click'); const ni = idx + dir; if (ni < 0 || ni >= routeItems.length) return;[routeItems[idx], routeItems[ni]] = [routeItems[ni], routeItems[idx]]; renderRoute(); }
function checkRoute() {
    const correct = routeSets[currentRouteIdx].steps;
    const isOk = routeItems.every((s, i) => s === correct[i]);
    if (isOk) { fb('fbRoute', '¡Perfecto! Orden correcto. +4 XP', true); if (!xpTracker.wgt.has('route_' + currentRouteIdx)) { xpTracker.wgt.add('route_' + currentRouteIdx); pts(4); } sfx('fan'); fin('s-widgets'); unlockAchievement('widgets_master'); }
    else { fb('fbRoute', 'Hay pasos fuera de orden. Revisa el arreglo.', false); sfx('no'); }
}
function nextRoute() { sfx('click'); currentRouteIdx = (currentRouteIdx + 1) % routeSets.length; buildRoute(); showToast('🔄 ' + routeSets[currentRouteIdx].label); }

// Widget 2: Identifica el tipo de palabra según su acento
const wordTypeData = [
    { word: 'camión', ans: 'Aguda', opts: ['Aguda', 'Llana', 'Esdrújula', 'Sobresdrújula'] },
    { word: 'árbol', ans: 'Llana', opts: ['Aguda', 'Llana', 'Esdrújula', 'Sobresdrújula'] },
    { word: 'música', ans: 'Esdrújula', opts: ['Aguda', 'Llana', 'Esdrújula', 'Sobresdrújula'] },
    { word: 'cuéntaselo', ans: 'Sobresdrújula', opts: ['Aguda', 'Llana', 'Esdrújula', 'Sobresdrújula'] },
    { word: 'examen', ans: 'Llana', opts: ['Aguda', 'Llana', 'Esdrújula', 'Sobresdrújula'] },
    { word: 'compás', ans: 'Aguda', opts: ['Aguda', 'Llana', 'Esdrújula', 'Sobresdrújula'] },
    { word: 'médico', ans: 'Esdrújula', opts: ['Aguda', 'Llana', 'Esdrújula', 'Sobresdrújula'] },
    { word: 'explícaselo', ans: 'Sobresdrújula', opts: ['Aguda', 'Llana', 'Esdrújula', 'Sobresdrújula'] },
];
let wtypeIdx = 0, wtypeDone = false;
function showWtype() {
    wtypeDone = false;
    if (wtypeIdx >= wordTypeData.length) { const el = document.getElementById('wtypeDesc'); if (el) el.textContent = '🎉 ¡Todas las palabras identificadas!'; const opts = document.getElementById('wtypeOpts'); if (opts) opts.innerHTML = ''; fin('s-widgets'); return; }
    const d = wordTypeData[wtypeIdx];
    const prog = document.getElementById('wtypeProg'); if (prog) prog.textContent = `Palabra ${wtypeIdx + 1} de ${wordTypeData.length}`;
    const desc = document.getElementById('wtypeDesc'); if (desc) desc.textContent = d.word;
    const opts = document.getElementById('wtypeOpts'); if (!opts) return; opts.innerHTML = '';
    _shuffle([...d.opts]).forEach(opt => { const b = document.createElement('button'); b.className = 'cmp-opt'; b.textContent = opt; b.onclick = () => checkWtype(opt, b, d); opts.appendChild(b); });
    const fbEl = document.getElementById('fbWtype'); if (fbEl) fbEl.classList.remove('show');
}
function checkWtype(opt, btn, d) {
    if (wtypeDone) return; wtypeDone = true;
    document.querySelectorAll('#wtypeOpts .cmp-opt').forEach(b => { if (b.textContent === d.ans) b.classList.add('correct'); else if (b === btn && b.textContent !== d.ans) b.classList.add('wrong'); });
    const isOk = opt === d.ans;
    if (isOk) { fb('fbWtype', '¡Correcto! +3 XP', true); if (!xpTracker.wgt.has('wtype_' + wtypeIdx)) { xpTracker.wgt.add('wtype_' + wtypeIdx); pts(3); } sfx('ok'); }
    else { fb('fbWtype', 'La respuesta correcta es: ' + d.ans, false); sfx('no'); }
}
function nextWtype() { sfx('click'); wtypeIdx++; showWtype(); }
function resetWtype() { sfx('click'); wtypeIdx = 0; showWtype(); }

// Widget 3: Empareja concepto → ejemplo
const silPairs = [
    { term: 'Diptongo (vocal fuerte + débil átona)', ans: 'aire', opts: ['aire', 'poeta', 'día', 'buey'] },
    { term: 'Diptongo (vocal débil átona + fuerte)', ans: 'piano', opts: ['piano', 'caos', 'país', 'Uruguay'] },
    { term: 'Hiato simple (dos vocales fuertes)', ans: 'poeta', opts: ['poeta', 'piano', 'baúl', 'miau'] },
    { term: 'Hiato acentual (débil tónica + fuerte)', ans: 'día', opts: ['día', 'aire', 'teatro', 'buey'] },
    { term: 'Triptongo (débil átona + fuerte + débil átona)', ans: 'buey', opts: ['buey', 'ciudad', 'teatro', 'río'] },
];
let silIdx = 0, silDone = false;
function showSil() {
    silDone = false;
    if (silIdx >= silPairs.length) { const el = document.getElementById('silTerm'); if (el) el.textContent = '🎉 ¡Completado!'; const opts = document.getElementById('silOpts'); if (opts) opts.innerHTML = ''; return; }
    const d = silPairs[silIdx];
    const prog = document.getElementById('silProg'); if (prog) prog.textContent = `${silIdx + 1} de ${silPairs.length}`;
    const term = document.getElementById('silTerm'); if (term) term.textContent = d.term;
    const opts = document.getElementById('silOpts'); if (!opts) return; opts.innerHTML = '';
    _shuffle([...d.opts]).forEach(opt => { const b = document.createElement('button'); b.className = 'qz-opt'; b.textContent = opt; b.onclick = () => checkSil(opt, b, d); opts.appendChild(b); });
    const fbEl = document.getElementById('fbSil'); if (fbEl) fbEl.classList.remove('show');
}
function checkSil(opt, btn, d) {
    if (silDone) return; silDone = true;
    document.querySelectorAll('#silOpts .qz-opt').forEach(b => { if (b.textContent === d.ans) b.classList.add('correct'); else if (b === btn && b.textContent !== d.ans) b.classList.add('wrong'); });
    const isOk = opt === d.ans;
    if (isOk) { fb('fbSil', '¡Correcto! +3 XP', true); if (!xpTracker.wgt.has('sil_' + silIdx)) { xpTracker.wgt.add('sil_' + silIdx); pts(3); } sfx('ok'); }
    else { fb('fbSil', 'Correcto: ' + d.ans, false); sfx('no'); }
    setTimeout(() => { silIdx++; showSil(); }, 1800);
}
function resetSil() { sfx('click'); silIdx = 0; showSil(); }

// Widget 4: Tilde diacrítica en contexto
const diacriticoData = [
    { ctx: '___ profesor llegó temprano hoy.', ans: 'El', opts: ['El', 'Él'] },
    { ctx: '¿___ quieres venir con nosotros?', ans: 'Tú', opts: ['Tú', 'Tu'] },
    { ctx: 'Dame ___ opinión sobre el libro.', ans: 'tu', opts: ['tu', 'tú'] },
    { ctx: 'No ___ si podré llegar a tiempo.', ans: 'sé', opts: ['sé', 'se'] },
    { ctx: 'Espero que ___ relaje un poco.', ans: 'se', opts: ['se', 'sé'] },
    { ctx: 'Quiero un poco más de ___, por favor.', ans: 'té', opts: ['té', 'te'] },
];
let diaIdx = 0, diaDone = false;
function showDia() {
    diaDone = false;
    if (diaIdx >= diacriticoData.length) { const el = document.getElementById('diaCtx'); if (el) el.textContent = '🎉 ¡Completado!'; const opts = document.getElementById('diaOpts'); if (opts) opts.innerHTML = ''; return; }
    const d = diacriticoData[diaIdx];
    const prog = document.getElementById('diaProg'); if (prog) prog.textContent = `${diaIdx + 1} de ${diacriticoData.length}`;
    const ctx = document.getElementById('diaCtx'); if (ctx) ctx.textContent = d.ctx;
    const opts = document.getElementById('diaOpts'); if (!opts) return; opts.innerHTML = '';
    _shuffle([...d.opts]).forEach(opt => { const b = document.createElement('button'); b.className = 'qz-opt'; b.textContent = opt; b.onclick = () => checkDia(opt, b, d); opts.appendChild(b); });
    const fbEl = document.getElementById('fbDia'); if (fbEl) fbEl.classList.remove('show');
}
function checkDia(opt, btn, d) {
    if (diaDone) return; diaDone = true;
    document.querySelectorAll('#diaOpts .qz-opt').forEach(b => { if (b.textContent === d.ans) b.classList.add('correct'); else if (b === btn && b.textContent !== d.ans) b.classList.add('wrong'); });
    const isOk = opt === d.ans;
    if (isOk) { fb('fbDia', '¡Correcto! +3 XP', true); if (!xpTracker.wgt.has('dia_' + diaIdx)) { xpTracker.wgt.add('dia_' + diaIdx); pts(3); } sfx('ok'); }
    else { fb('fbDia', 'Correcto: ' + d.ans, false); sfx('no'); }
    setTimeout(() => { diaIdx++; showDia(); }, 1800);
}
function resetDia() { sfx('click'); diaIdx = 0; showDia(); }

// ===================== RETO FINAL =====================
const retoPairs = [
    {
        label: ['Agudas', 'Llanas'], btnA: '🔚 Aguda', btnB: '➖ Llana',
        colA: 'agudas', colB: 'llanas',
        words: [
            { w: 'camión', t: 'agudas' }, { w: 'árbol', t: 'llanas' }, { w: 'compás', t: 'agudas' }, { w: 'azúcar', t: 'llanas' },
            { w: 'sofá', t: 'agudas' }, { w: 'examen', t: 'llanas' }, { w: 'jardín', t: 'agudas' }, { w: 'lápiz', t: 'llanas' },
            { w: 'café', t: 'agudas' }, { w: 'joven', t: 'llanas' }, { w: 'reloj', t: 'agudas' }, { w: 'casa', t: 'llanas' },
        ]
    },
    {
        label: ['Diptongo', 'Hiato'], btnA: '🔗 Diptongo', btnB: '✂️ Hiato',
        colA: 'diptongo', colB: 'hiato',
        words: [
            { w: 'piano', t: 'diptongo' }, { w: 'poeta', t: 'hiato' }, { w: 'aire', t: 'diptongo' }, { w: 'caos', t: 'hiato' },
            { w: 'ciudad', t: 'diptongo' }, { w: 'teatro', t: 'hiato' }, { w: 'fuego', t: 'diptongo' }, { w: 'país', t: 'hiato' },
            { w: 'bueno', t: 'diptongo' }, { w: 'día', t: 'hiato' }, { w: 'cielo', t: 'diptongo' }, { w: 'oasis', t: 'hiato' },
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
    { s: 'La música clásica relaja la mente.', type: 'Palabra esdrújula (música)' },
    { s: 'Compramos un sofá nuevo para la sala.', type: 'Palabra aguda con tilde (sofá)' },
    { s: 'El árbol del jardín es centenario.', type: 'Palabra llana con tilde (árbol)' },
    { s: 'Cuéntaselo a tu mejor amigo.', type: 'Palabra sobresdrújula (Cuéntaselo)' },
    { s: 'Él no quiso acompañarnos al cine.', type: 'Tilde diacrítica — pronombre personal (Él)' },
    { s: 'Tuvimos un día muy soleado.', type: 'Hiato acentual (día)' },
    { s: 'El perro juega en el jardín.', type: 'Palabra aguda con tilde (jardín)' },
    { s: '¿Dónde dejaste el baúl?', type: 'Adverbio interrogativo con tilde (Dónde) / Hiato acentual (baúl)' },
    { s: 'El examen fue bastante difícil.', type: 'Palabra llana sin tilde (examen)' },
    { s: 'El poeta escribió un hermoso poema.', type: 'Hiato simple (poeta)' },
];
const classifyTaskDB = [
    { w: 'camión', tipo: 'Aguda' },
    { w: 'árbol', tipo: 'Llana' },
    { w: 'música', tipo: 'Esdrújula' },
    { w: 'cuéntaselo', tipo: 'Sobresdrújula' },
    { w: 'piano', tipo: 'Diptongo' },
    { w: 'país', tipo: 'Hiato acentual' },
    { w: 'poeta', tipo: 'Hiato simple' },
    { w: 'buey', tipo: 'Triptongo' },
];
const completeTaskDB = [
    { s: 'El ___ del parque es muy antiguo.', opts: ['arbol', 'árbol', 'arból'], ans: 'árbol' },
    { s: 'Necesito comprar un ___ nuevo.', opts: ['sofá', 'sofa', 'sofà'], ans: 'sofá' },
    { s: 'La clase de ___ es mi favorita.', opts: ['musica', 'músika', 'música'], ans: 'música' },
    { s: '___ no vino a la reunión.', opts: ['El', 'Él', 'EL'], ans: 'Él' },
    { s: 'Hoy es un ___ especial para mí.', opts: ['dia', 'día', 'diá'], ans: 'día' },
    { s: '¿___ te llamas?', opts: ['Como', 'Cómo', 'Comó'], ans: 'Cómo' },
    { s: 'No quiero ___ café ahora.', opts: ['mas', 'más', 'màs'], ans: 'más' },
    { s: 'Quiero un poco de ___, por favor.', opts: ['te', 'té', 'tê'], ans: 'té' },
];
const explainQuestions = [
    { q: '¿Qué es la sílaba tónica y cómo se identifica?', ans: 'Es la sílaba que se pronuncia con mayor intensidad o fuerza dentro de una palabra.' },
    { q: 'Explica la diferencia entre diptongo e hiato.', ans: 'El diptongo une dos vocales en una sola sílaba (fuerte+débil átona o dos débiles); el hiato las separa en sílabas distintas (dos fuertes, o una débil tónica junto a una fuerte).' },
    { q: '¿Cuáles son las reglas de tildación de las palabras agudas y llanas?', ans: 'Las agudas llevan tilde si terminan en n, s o vocal. Las llanas llevan tilde si NO terminan en n, s o vocal.' },
    { q: '¿Qué es la tilde diacrítica? Da un ejemplo.', ans: 'Es la tilde que distingue palabras que se escriben igual pero cumplen funciones gramaticales distintas. Ej: tú (pronombre) / tu (posesivo).' },
    { q: '¿Por qué las palabras esdrújulas y sobresdrújulas siempre llevan tilde?', ans: 'Porque son las menos frecuentes en español y la ortografía marca siempre su acentuación para evitar confusión en la pronunciación.' },
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
    _instrBlock(out, 'Instrucción', ['Copia en tu cuaderno; subraya, colorea o encierra la palabra solicitada en las siguientes oraciones. Escribe al lado a qué clase pertenece.', '<strong>Ejemplo:</strong> La música clásica relaja la mente. → <span style="color:var(--jade);font-weight:700;">Palabra esdrújula (música)</span>']);
    _pick(identifyTaskDB, Math.min(count, identifyTaskDB.length)).forEach((item, i) => {
        const div = document.createElement('div'); div.className = 'tg-task';
        div.innerHTML = `<div class="tg-task-num">${i + 1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
        out.appendChild(div);
    });
}

function genClassifyTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia la siguiente tabla en tu cuaderno. Para cada palabra, escribe a qué tipo pertenece.']);
    const items = _pick(classifyTaskDB, Math.min(count, classifyTaskDB.length));
    const wrap = document.createElement('div'); wrap.style.overflowX = 'auto';
    const th = (t, extra = '') => `<th style="padding:0.3rem 0.4rem;border:1px solid var(--border);font-size:0.72rem;text-align:center;${extra}">${t}</th>`;
    let html = `<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:420px;"><thead><tr style="background:var(--pri-gl);">${th('Palabra', 'text-align:left;')}${th('Tipo')}</tr></thead><tbody>`;
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
            ['S', 'I', 'L', 'A', 'B', 'A', 'X', 'Y', 'Z', 'T'],
            ['K', 'P', 'L', 'M', 'N', 'B', 'V', 'C', 'X', 'I'],
            ['D', 'I', 'P', 'T', 'O', 'N', 'G', 'O', 'Z', 'L'],
            ['H', 'J', 'K', 'L', 'P', 'O', 'I', 'U', 'Y', 'D'],
            ['H', 'I', 'A', 'T', 'O', 'S', 'F', 'G', 'H', 'E'],
            ['G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B'],
            ['A', 'G', 'U', 'D', 'A', 'N', 'M', 'Q', 'W', 'E'],
            ['R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D'],
            ['V', 'O', 'C', 'A', 'L', 'F', 'G', 'H', 'J', 'K'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Q', 'W', 'E'],
        ],
        words: [
            { w: 'SILABA', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]] },
            { w: 'DIPTONGO', cells: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7]] },
            { w: 'HIATO', cells: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4]] },
            { w: 'AGUDA', cells: [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4]] },
            { w: 'TILDE', cells: [[0, 9], [1, 9], [2, 9], [3, 9], [4, 9]] },
            { w: 'VOCAL', cells: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4]] },
        ]
    },
    {
        size: 10,
        grid: [
            ['T', 'R', 'I', 'P', 'T', 'O', 'N', 'G', 'O', 'X'],
            ['K', 'P', 'L', 'M', 'N', 'B', 'V', 'C', 'X', 'Q'],
            ['L', 'L', 'A', 'N', 'A', 'Z', 'Q', 'W', 'E', 'R'],
            ['H', 'J', 'K', 'L', 'P', 'O', 'I', 'U', 'Y', 'T'],
            ['E', 'S', 'D', 'R', 'U', 'J', 'U', 'L', 'A', 'M'],
            ['G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B'],
            ['A', 'C', 'E', 'N', 'T', 'O', 'N', 'M', 'Q', 'W'],
            ['R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D'],
            ['D', 'I', 'A', 'C', 'R', 'I', 'T', 'I', 'C', 'A'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Q', 'W', 'E'],
        ],
        words: [
            { w: 'TRIPTONGO', cells: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8]] },
            { w: 'LLANA', cells: [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4]] },
            { w: 'ESDRUJULA', cells: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8]] },
            { w: 'ACENTO', cells: [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5]] },
            { w: 'DIACRITICA', cells: [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 9]] },
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

// ===================== EVALUACIÓN CONCEPTUAL =====================
const evalTFBank = [
    { q: 'La sílaba tónica es la que se pronuncia con mayor intensidad.', a: true },
    { q: 'Las vocales fuertes son i, u.', a: false },
    { q: 'El diptongo une dos vocales en sílabas distintas.', a: false },
    { q: 'El hiato simple ocurre cuando dos vocales fuertes están juntas.', a: true },
    { q: 'El hiato acentual siempre lleva tilde en la vocal débil tónica.', a: true },
    { q: 'Las palabras agudas llevan tilde si terminan en n, s o vocal.', a: true },
    { q: 'Las palabras llanas llevan tilde si terminan en n, s o vocal.', a: false },
    { q: 'Las palabras esdrújulas llevan tilde solo a veces.', a: false },
    { q: 'Las palabras sobresdrújulas siempre llevan tilde.', a: true },
    { q: '"Reloj" es una palabra aguda que lleva tilde.', a: false },
    { q: 'La tilde diacrítica distingue palabras con la misma escritura pero distinta función gramatical.', a: true },
    { q: 'Las palabras en mayúscula no necesitan tilde.', a: false },
    { q: '"Música" es una palabra esdrújula.', a: true },
    { q: 'El triptongo está formado por tres vocales en una misma sílaba.', a: true },
    { q: 'Los adverbios terminados en -mente nunca conservan la tilde del adjetivo original.', a: false },
];
const evalMCBank = [
    { q: '¿Qué es la sílaba tónica?', o: ['a) La primera sílaba', 'b) La sílaba con mayor intensidad', 'c) La última sílaba siempre', 'd) Una vocal débil'], a: 1 },
    { q: '¿Cuáles son las vocales fuertes?', o: ['a) i, u', 'b) a, e, o', 'c) a, i, u', 'd) Todas'], a: 1 },
    { q: '"Piano" contiene:', o: ['a) Un hiato', 'b) Un diptongo', 'c) Un triptongo', 'd) Ninguna vocal junta'], a: 1 },
    { q: '"Buey" es un ejemplo de:', o: ['a) Diptongo', 'b) Hiato', 'c) Triptongo', 'd) Sílaba átona'], a: 2 },
    { q: '"País" tiene hiato acentual porque:', o: ['a) Ambas vocales son fuertes', 'b) La vocal débil es tónica junto a una fuerte', 'c) No tiene vocales juntas', 'd) Es esdrújula'], a: 1 },
    { q: 'Las palabras agudas llevan tilde cuando:', o: ['a) Terminan en consonante', 'b) Terminan en n, s o vocal', 'c) Nunca', 'd) Siempre'], a: 1 },
    { q: 'Las palabras llanas llevan tilde cuando:', o: ['a) Terminan en n, s o vocal', 'b) NO terminan en n, s o vocal', 'c) Siempre', 'd) Nunca'], a: 1 },
    { q: 'Las esdrújulas y sobresdrújulas:', o: ['a) Nunca llevan tilde', 'b) Llevan tilde solo en mayúscula', 'c) Siempre llevan tilde', 'd) Solo si terminan en vocal'], a: 2 },
    { q: 'En "Él no vendrá", "Él" lleva tilde porque:', o: ['a) Es esdrújula', 'b) Es tilde diacrítica', 'c) Es un error', 'd) Termina en consonante'], a: 1 },
    { q: '¿Cuál de estas es esdrújula?', o: ['a) Camión', 'b) Árbol', 'c) Música', 'd) Compás'], a: 2 },
    { q: '¿Cuál de estas es sobresdrújula?', o: ['a) Música', 'b) Cuéntaselo', 'c) Compás', 'd) Árbol'], a: 1 },
    { q: '"Reloj" no lleva tilde porque:', o: ['a) Es esdrújula', 'b) Es aguda terminada en consonante distinta de n/s', 'c) Es llana', 'd) No tiene sílaba tónica'], a: 1 },
    { q: 'El adverbio formado a partir de "fácil" es:', o: ['a) Facilmente', 'b) Fácilmente', 'c) Facilménte', 'd) Fasilmente'], a: 1 },
    { q: '¿Cuál palabra usa correctamente la tilde diacrítica como verbo?', o: ['a) Yo se la verdad', 'b) Yo sé la verdad', 'c) Yo se lo dije', 'd) El se fue'], a: 1 },
    { q: '"Cuéntaselo" lleva tilde porque es:', o: ['a) Aguda', 'b) Llana', 'c) Esdrújula', 'd) Sobresdrújula'], a: 3 },
];
const evalCPBank = [
    { q: 'La sílaba que se pronuncia con mayor intensidad se llama sílaba ___.', a: 'tónica' },
    { q: 'Las vocales a, e, o se llaman vocales ___.', a: 'fuertes' },
    { q: 'La unión de dos vocales en una misma sílaba se llama ___.', a: 'diptongo' },
    { q: 'La unión de tres vocales en una misma sílaba se llama ___.', a: 'triptongo' },
    { q: 'Cuando dos vocales juntas se pronuncian en sílabas distintas, se llama ___.', a: 'hiato' },
    { q: 'Las palabras ___ llevan tilde si terminan en n, s o vocal.', a: 'agudas' },
    { q: 'Las palabras ___ llevan tilde si NO terminan en n, s o vocal.', a: 'llanas' },
    { q: 'Las palabras esdrújulas y sobresdrújulas ___ llevan tilde.', a: 'siempre' },
    { q: 'La sílaba tónica de las palabras esdrújulas es la ___.', a: 'antepenúltima' },
    { q: 'La tilde que distingue palabras iguales con función distinta se llama tilde ___.', a: 'diacrítica' },
    { q: 'ÁFRICA y CAMIÓN son ejemplos de palabras en mayúscula que sí llevan ___.', a: 'tilde' },
    { q: 'El adverbio "rápidamente" conserva la tilde del adjetivo ___.', a: 'rápida' },
    { q: 'En "tú estudias mucho", la palabra "tú" lleva tilde porque es un ___.', a: 'pronombre' },
    { q: 'En "es tu libro", la palabra "tu" no lleva tilde porque es un ___.', a: 'posesivo' },
    { q: '"Río" tiene un hiato ___ porque la vocal débil "i" es tónica.', a: 'acentual' },
];
const evalPRBank = [
    { term: 'Sílaba tónica', def: 'Sílaba que se pronuncia con mayor intensidad' },
    { term: 'Vocales fuertes', def: 'a, e, o — vocales abiertas' },
    { term: 'Vocales débiles', def: 'i, u — vocales cerradas' },
    { term: 'Diptongo', def: 'Dos vocales que forman una sola sílaba' },
    { term: 'Triptongo', def: 'Tres vocales que forman una sola sílaba' },
    { term: 'Hiato simple', def: 'Dos vocales fuertes juntas en sílabas distintas' },
    { term: 'Hiato acentual', def: 'Vocal débil tónica junto a una fuerte; siempre lleva tilde' },
    { term: 'Palabra aguda', def: 'Tónica en la última sílaba; tilde si termina en n, s o vocal' },
    { term: 'Palabra llana', def: 'Tónica en la penúltima sílaba; tilde si NO termina en n, s o vocal' },
    { term: 'Palabra esdrújula', def: 'Tónica en la antepenúltima sílaba; siempre lleva tilde' },
    { term: 'Palabra sobresdrújula', def: 'Tónica antes de la antepenúltima sílaba; siempre lleva tilde' },
    { term: 'Tilde diacrítica', def: 'Distingue palabras iguales con función gramatical distinta' },
    { term: 'Mayúsculas y tilde', def: 'Las palabras en mayúscula también llevan tilde si la regla lo exige' },
    { term: 'Adverbios en -mente', def: 'Conservan la tilde del adjetivo original si este la tenía' },
    { term: 'Palabras compuestas', def: 'Pueden perder la tilde de la primera palabra simple al unirse sin guion' },
];

function genEval() {
    sfx('click');
    const cf = evalFormNum;
    window._currentEvalForm = cf;
    evalFormNum = (evalFormNum % 10) + 1;
    saveProgress();
    document.getElementById('eval-screen-title').textContent = `📝 Evaluación Final — Forma ${cf} · La Acentuación`;
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

    let s1 = '<div class="sec-title"><span>I. Completar el espacio</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>';
    d.cp.forEach((it, i) => { const q = it.q.replace('___', '<span class="cp-blank"></span>'); s1 += `<div class="cp-row"><span class="qn">${i + 1}.</span><span class="cp-text">${q}</span></div>`; });

    let s2 = '<div class="sec-title"><span>II. Verdadero o Falso</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div>';
    d.tf.forEach((it, i) => { s2 += `<div class="tf-row"><span class="qn">${i + 6}.</span><span class="tf-blank"></span><span class="tf-text">${it.q}</span></div>`; });

    let s3 = '<div class="sec-title"><span>III. Selección Múltiple</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="mc-grid">';
    d.mc.forEach((it, i) => { const opts = it.o.map((op, oi) => `<label class="mc-opt"><input type="radio" name="mcp${i}"> ${op}</label>`).join(''); s3 += `<div class="mc-item"><div class="mc-q"><span class="qn">${i + 11}.</span><span>${it.q}</span></div><div class="mc-opts">${opts}</div></div>`; });
    s3 += '</div>';

    let colL = '<div class="pr-col"><div class="pr-head">📌 Términos</div>';
    d.pr.terms.forEach((it, i) => { colL += `<div class="pr-item"><span class="pr-num">${i + 16}.</span><span class="pr-line"></span>${it.term}</div>`; });
    colL += '</div>';
    let colR = '<div class="pr-col"><div class="pr-head">🔑 Definiciones</div>';
    d.pr.shuffledDefs.forEach((it, i) => { colR += `<div class="pr-item"><span class="pr-num">${d.pr.letters[i]}.</span>${it.def}</div>`; });
    colR += '</div>';
    let s4 = `<div class="pr-section"><div class="sec-title"><span>IV. Términos Pareados</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 25%</span></div></div><div class="pr-grid">${colL}${colR}</div></div>`;

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
<title>Evaluación La Acentuación · Forma ${forma}</title>
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
</style></head><body>
<div class="ph">
  <h2>Evaluación Final de Misión La Acentuación — Español — Lengua</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
<div class="pauta-wrap">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · Misión La Acentuación · Forma ${forma}</div>
    <div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div>
    <div class="p-meta">Valor total: 100 pts | 4 secciones × 5 preguntas × 5 pts c/u</div>
  </div>
  <div class="p-grid">${pR}</div>
  ${zgBlock}
</div>
<div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div>
</body></html>`;

    const win = window.open('', '_blank', '');
    if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
    win.document.write(doc);
    win.document.close();
    setTimeout(() => win.print(), 400);
}

// ===================== PRUEBA DE PENSAMIENTO CRÍTICO =====================
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

const critCaseBank = [
    { txt: 'Mateo escribió en su cuaderno: "El sabado fui al jardin con mi papá y vimos un arbol muy alto cerca del rio."' },
    { txt: 'Camila escribió: "Compre un sofa nuevo para la sala y tambien una mesa pequeña de color cafe."' },
    { txt: 'Luis escribió: "Mi materia favorita es la musica, porque el profesor explica con ejemplos muy practicos."' },
    { txt: 'Ana escribió: "El no sabe si vendra a la fiesta, pero yo si quiero ir con el este sabado."' },
    { txt: 'Pedro escribió: "Cuentaselo a tu hermano antes de que se entere por otra persona, el se va a molestar."' },
    { txt: 'Sofía escribió: "Tuvimos un dia muy especial: vimos un arcoiris despues de la lluvia y comimos un pastel de chocolate."' },
];
const critCaseQuestions = [
    '1. Identifica todas las palabras que deberían llevar tilde y no la tienen.',
    '2. Para cada palabra que falta, explica si es aguda, llana, esdrújula o un caso de tilde diacrítica.',
    '3. Reescribe la oración completa con la acentuación correcta.',
    '4. Explica con tus propias palabras la regla que aplicaste en cada caso.',
];
const critCaseGuides = [
    'Busca palabras que terminen en vocal, n o s y sean agudas (deben llevar tilde), o que NO terminen en esas letras y sean llanas (deben llevar tilde); las esdrújulas y sobresdrújulas siempre la llevan.',
    'Clasifica cada palabra corregida según el lugar de su sílaba tónica: última (aguda), penúltima (llana), antepenúltima (esdrújula) o antes (sobresdrújula); o indica si es un caso de tilde diacrítica (pronombres como él/tú/sí, o adverbios interrogativos como dónde/cómo).',
    'La oración corregida debe colocar la tilde en cada palabra identificada, respetando las reglas de acentuación correspondientes a cada caso.',
    'La explicación debe mencionar la regla específica aplicada en cada palabra: regla de agudas, de llanas, de esdrújulas/sobresdrújulas, o el uso de la tilde diacrítica.',
];

const critErrorBank = [
    { txt: '"Las palabras agudas siempre llevan tilde, sin importar en qué letra terminen. Por ejemplo, reloj y pared deberían escribirse \'reló\' y \'paréd\'."',
        g1: 'No es cierto que las agudas siempre lleven tilde: solo la llevan si terminan en n, s o vocal.',
        g2: '"Reloj" y "pared" terminan en consonantes distintas de n y s, por eso NO llevan tilde: se escriben "reloj" y "pared".' },
    { txt: '"Las palabras esdrújulas casi nunca llevan tilde, solo en casos especiales. Por eso \'musica\' y \'medico\' se escriben sin tilde."',
        g1: 'Las palabras esdrújulas SIEMPRE llevan tilde, sin excepción alguna.',
        g2: '"Música" y "médico" son esdrújulas (tónica en la antepenúltima sílaba) y por eso deben escribirse con tilde.' },
    { txt: '"El diptongo ocurre cuando dos vocales fuertes como la a y la e están juntas, por ejemplo en la palabra \'poeta\'."',
        g1: 'Dos vocales fuertes juntas NO forman diptongo, forman un hiato simple, porque se pronuncian en sílabas separadas.',
        g2: '"Poeta" (po-e-ta) es un ejemplo de hiato simple, no de diptongo, ya que "o" y "e" son ambas vocales fuertes.' },
    { txt: '"Las palabras en mayúscula nunca llevan tilde porque las reglas de acentuación solo aplican a las minúsculas. Por eso se escribe \'AFRICA\' y \'CAMION\'."',
        g1: 'Las palabras en mayúscula SÍ deben llevar tilde si la regla de acentuación lo exige.',
        g2: 'Lo correcto es escribir "ÁFRICA" y "CAMIÓN", conservando la tilde aunque estén en mayúscula.' },
    { txt: '"En la oración \'el libro es mio\', la palabra \'el\' debe llevar tilde porque siempre que aparece antes de un sustantivo se acentúa."',
        g1: '"El" antes de un sustantivo es un artículo y nunca lleva tilde; solo se tilda "él" cuando es pronombre personal.',
        g2: 'Además, "mio" en esa oración es un pronombre posesivo tónico y debería escribirse "mío", con tilde, por ser un hiato acentual (í tónica junto a o).' },
    { txt: '"Las palabras sobresdrújulas, como cuentaselo y explicaselo, no necesitan tilde porque son muy largas y ya se entienden igual."',
        g1: 'La longitud de la palabra no determina si lleva tilde; las sobresdrújulas SIEMPRE llevan tilde, sin excepción.',
        g2: 'Lo correcto es escribir "cuéntaselo" y "explícaselo", con tilde en la sílaba tónica (antes de la antepenúltima).' },
];

const critDecisionBank = [
    'Un estudiante escribe sus tareas muy rápido, nunca separa las palabras en sílabas y casi nunca revisa lo que escribió. Comete muchos errores de tildes en sus exámenes.',
    'Una estudiante confunde constantemente "tu" y "tú", "el" y "él", porque no sabe identificar la función gramatical de la palabra en la oración.',
    'Un estudiante memorizó las reglas de acentuación, pero al escribir un texto no logra identificar la sílaba tónica de las palabras y se equivoca colocando las tildes.',
    'Una estudiante escribe textos largos sin tildes porque dice que "se entienden igual" y que la tilde no es tan importante.',
    'Un estudiante confunde diptongo con hiato y por eso no sabe en qué palabras debe poner tilde en la vocal débil (como "día" o "país").',
];
const critDecisionGuide = 'Debe proponer al menos tres estrategias concretas relacionadas con el proceso de acentuación: separar la palabra en sílabas antes de escribirla, identificar en voz alta cuál es la sílaba tónica, recordar las reglas según el tipo de palabra (aguda/llana/esdrújula/sobresdrújula), distinguir la función gramatical de las palabras con tilde diacrítica, y releer y corregir el texto después de escribirlo. Debe explicar con sus palabras por qué cada estrategia ayuda a mejorar la acentuación.';

const critCompareBank = [
    { a: 'La palabra "música" lleva tilde en la "ú".', b: 'La palabra "compás" lleva tilde en la "á".',
        ga: '"Música" es esdrújula (tónica en la antepenúltima sílaba) y las esdrújulas siempre llevan tilde.',
        gb: '"Compás" es aguda (tónica en la última sílaba) y termina en "s", por eso lleva tilde según la regla de las agudas.',
        gr: 'No es la misma regla: una lleva tilde por ser esdrújula (siempre se tilda) y la otra por ser aguda terminada en s (regla condicional).' },
    { a: 'La palabra "piano" no lleva tilde y tiene dos vocales juntas en una sílaba.', b: 'La palabra "día" sí lleva tilde y tiene dos vocales juntas en sílabas distintas.',
        ga: '"Piano" tiene un diptongo (ia: vocal débil átona + vocal fuerte) que forma una sola sílaba y sigue las reglas normales de acentuación.',
        gb: '"Día" tiene un hiato acentual (í tónica + a): la vocal débil tónica siempre lleva tilde, sin importar otras reglas.',
        gr: 'No son el mismo caso: uno es un diptongo que se acentúa según las reglas generales y el otro es un hiato acentual que SIEMPRE lleva tilde en la vocal débil.' },
    { a: 'En la oración "Sé que vendrá", la palabra "Sé" lleva tilde.', b: 'En la oración "Se fue temprano", la palabra "Se" no lleva tilde.',
        ga: '"Sé" lleva tilde porque es una forma del verbo "saber" (o "ser"); es un caso de tilde diacrítica.',
        gb: '"Se" no lleva tilde porque es un pronombre reflexivo; la tilde diacrítica solo se usa para diferenciarlo del verbo.',
        gr: 'No es el mismo caso: ambas palabras se escriben igual mas cumplen funciones gramaticales distintas, por eso una lleva tilde diacrítica y la otra no.' },
    { a: 'La palabra "cuéntaselo" lleva tilde en la "é".', b: 'La palabra "cuenta" no lleva tilde.',
        ga: '"Cuéntaselo" es sobresdrújula (la tónica está antes de la antepenúltima sílaba, por agregar pronombres al verbo) y siempre lleva tilde.',
        gb: '"Cuenta" es una palabra llana terminada en vocal, por lo que no necesita tilde según la regla de las llanas.',
        gr: 'No siguen la misma regla: al agregar pronombres átonos al verbo, la palabra cambia de categoría (de llana a sobresdrújula) y debe llevar tilde aunque la palabra original no la tuviera.' },
];

const critCauseBank = [
    { cause: 'Un estudiante no identifica correctamente la sílaba tónica de las palabras.', guide: 'Comete errores frecuentes al decidir si una palabra necesita tilde, ya que no puede aplicar correctamente las reglas de agudas, llanas, esdrújulas o sobresdrújulas.' },
    { cause: 'Una palabra llana termina en una consonante distinta de n o s (como "árbol" o "azúcar").', guide: 'La palabra debe llevar tilde, según la regla de las palabras llanas.' },
    { cause: 'Dos vocales fuertes (a, e, o) están juntas en una palabra (como en "poeta" o "caos").', guide: 'Se forma un hiato simple: las vocales se separan en sílabas distintas, aunque estén escritas juntas.' },
    { cause: 'Una palabra confunde dos funciones gramaticales distintas con la misma escritura (como "tu" y "tú").', guide: 'Se debe usar la tilde diacrítica para diferenciarlas según su función en la oración (pronombre o posesivo).' },
];
const critEffectBank = [
    { effect: 'La palabra "camión" se escribe con tilde en la "ó".', guide: 'Es una palabra aguda terminada en "n", y según la regla, las agudas llevan tilde si terminan en n, s o vocal.' },
    { effect: 'La palabra "página" lleva tilde sin excepción posible.', guide: 'Es una palabra esdrújula (tónica en la antepenúltima sílaba); todas las esdrújulas siempre llevan tilde.' },
    { effect: 'La vocal débil "í" en la palabra "país" lleva tilde aunque rompa el diptongo esperado.', guide: 'Ocurre un hiato acentual: cuando la vocal débil es tónica junto a una fuerte, siempre se tilda, sin importar otras reglas.' },
    { effect: 'La palabra "explícaselo" cambia de no llevar tilde (explica) a llevarla obligatoriamente.', guide: 'Al agregar pronombres átonos al verbo, la palabra se vuelve sobresdrújula y las sobresdrújulas siempre llevan tilde.' },
];

function genEvalCrit() {
    sfx('click');
    const cf = evalCritFormNum; window._currentEvalCritForm = cf; evalCritFormNum = (evalCritFormNum % 10) + 1; saveProgress();
    document.getElementById('evalcrit-screen-title').textContent = `🧠 Pensamiento Crítico · Forma ${cf} · La Acentuación`;
    evalCritAnsVisible = false;
    const out = document.getElementById('evalCritOut'); out.innerHTML = '';

    const kase = _pick(critCaseBank, 1)[0];
    const s1 = document.createElement('div');
    s1.innerHTML = `<div class="eval-section-title">I. Caso de análisis: la tilde olvidada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${kase.txt}</div>${critCaseQuestions.map((q, i) => `<div class="crit-q-block"><div class="crit-q-label">${q}</div><textarea class="crit-textarea" rows="2" aria-label="${q}"></textarea><div class="crit-pauta">${critCaseGuides[i]}</div></div>`).join('')}<div class="crit-selfscore"><label for="critScore0">Obtenido:</label><input type="number" id="critScore0" class="crit-score-input" data-score="0" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
    out.appendChild(s1);

    const err = _pick(critErrorBank, 1)[0];
    const s2 = document.createElement('div');
    s2.innerHTML = `<div class="eval-section-title">II. Corrige el error <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${err.txt}</div><p style="font-size:0.85rem;margin-bottom:0.5rem;">Identifica <strong>dos errores</strong> y corrígelos con tus propias palabras:</p><div class="crit-q-block"><div class="crit-q-label">Error 1 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 1 y su corrección"></textarea><div class="crit-pauta">${err.g1}</div></div><div class="crit-q-block"><div class="crit-q-label">Error 2 y su corrección:</div><textarea class="crit-textarea" rows="2" aria-label="Error 2 y su corrección"></textarea><div class="crit-pauta">${err.g2}</div></div><div class="crit-selfscore"><label for="critScore1">Obtenido:</label><input type="number" id="critScore1" class="crit-score-input" data-score="1" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
    out.appendChild(s2);

    const dec = _pick(critDecisionBank, 1)[0];
    const s3 = document.createElement('div');
    s3.innerHTML = `<div class="eval-section-title">III. Toma de decisiones: mejorar la acentuación <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-scenario">${dec}</div><div class="crit-q-block"><div class="crit-q-label">¿Qué tres estrategias recomendarías para mejorar su acentuación? Explica por qué ayudaría cada una.</div><textarea class="crit-textarea" rows="4" aria-label="Tres estrategias recomendadas y su justificación"></textarea><div class="crit-pauta">${critDecisionGuide}</div></div><div class="crit-selfscore"><label for="critScore2">Obtenido:</label><input type="number" id="critScore2" class="crit-score-input" data-score="2" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
    out.appendChild(s3);

    const cmp = _pick(critCompareBank, 1)[0];
    const s4 = document.createElement('div');
    s4.innerHTML = `<div class="eval-section-title">IV. Comparación razonada <span class="eval-pts">20 pts</span></div><div class="eval-item"><div class="crit-compare-grid"><div class="crit-compare-box"><h5>Caso A</h5>${cmp.a}</div><div class="crit-compare-box"><h5>Caso B</h5>${cmp.b}</div></div><div class="crit-q-block"><div class="crit-q-label">1. ¿Qué regla de acentuación se aplica en cada caso? 2. ¿Por qué no son el mismo caso?</div><textarea class="crit-textarea" rows="4" aria-label="Comparación razonada de los casos A y B"></textarea><div class="crit-pauta">Caso A: ${cmp.ga} · Caso B: ${cmp.gb} · ${cmp.gr}</div></div><div class="crit-selfscore"><label for="critScore3">Obtenido:</label><input type="number" id="critScore3" class="crit-score-input" data-score="3" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
    out.appendChild(s4);

    const causes = _pick(critCauseBank, 2), effects = _pick(critEffectBank, 3);
    let ceRows = '';
    causes.forEach((it) => { ceRows += `<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Causa</span>${it.cause}</div><div class="crit-ce-cell"><span class="crit-ce-tag">Efecto</span><textarea class="crit-textarea" rows="2" aria-label="Efecto de: ${it.cause}" placeholder="Escribe el efecto..."></textarea></div></div><div class="crit-pauta">${it.guide}</div></div>`; });
    effects.forEach((it) => { ceRows += `<div class="crit-ce-item"><div class="crit-ce-row"><div class="crit-ce-cell"><span class="crit-ce-tag">Causa</span><textarea class="crit-textarea" rows="2" aria-label="Causa de: ${it.effect}" placeholder="Escribe la causa..."></textarea></div><div class="crit-ce-cell crit-ce-given"><span class="crit-ce-tag">Efecto</span>${it.effect}</div></div><div class="crit-pauta">${it.guide}</div></div>`; });
    const s5 = document.createElement('div');
    s5.innerHTML = `<div class="eval-section-title">V. Análisis de causas y efectos <span class="eval-pts">20 pts</span></div><div class="eval-item">${ceRows}<div class="crit-selfscore"><label for="critScore4">Obtenido:</label><input type="number" id="critScore4" class="crit-score-input" data-score="4" min="0" max="20" value="0"> <span>de 20 pts</span></div></div>`;
    out.appendChild(s5);

    window._evalCritData = { kase, err, dec, cmp, causes, effects };
    const totalPanel = document.createElement('div'); totalPanel.id = 'evalCritTotalResult'; totalPanel.className = 'crit-total-panel'; totalPanel.innerHTML = '<strong>🧮 Autoevaluación:</strong> responde cada sección, compara con la <em>Pauta</em> y anota tu puntaje (0–20) en cada casilla. Luego presiona <em>Calcular Total</em>.'; out.appendChild(totalPanel);
    fin('s-evaluacion');
}
function toggleEvalCritAns() { evalCritAnsVisible = !evalCritAnsVisible; document.querySelectorAll('#evalCritOut .crit-pauta').forEach(el => el.style.display = evalCritAnsVisible ? 'block' : 'none'); sfx('click'); }
function calcCritTotal() {
    if (!window._evalCritData) { showToast('⚠️ Genera una prueba primero'); return; }
    sfx('click');
    let total = 0;
    document.querySelectorAll('#evalCritOut .crit-score-input').forEach(inp => { let v = parseInt(inp.value) || 0; v = Math.max(0, Math.min(20, v)); inp.value = v; total += v; });
    const panel = document.getElementById('evalCritTotalResult');
    if (panel) { panel.className = 'crit-total-panel ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk'); panel.innerHTML = `<strong>Puntaje total autoevaluado: ${total}/100</strong><br><em>Compara siempre tus respuestas con la Pauta antes de anotar el puntaje de cada sección.</em>`; }
    const formKey = 'crit_' + (window._currentEvalCritForm || 1);
    if (total >= 70) { if (!xpTracker.wgt.has(formKey)) { xpTracker.wgt.add(formKey); pts(8); } showToast('🎯 Pensamiento crítico: ' + total + '/100'); }
    else showToast('🧮 Puntaje registrado: ' + total + '/100. ¡Sigue practicando!');
}
function printEvalCrit() {
    if (!window._evalCritData) { showToast('⚠️ Genera una prueba primero'); return; }
    sfx('click');
    const forma = window._currentEvalCritForm || 1; const d = window._evalCritData;
    const lines = (n) => Array(n).fill('<div class="ln"></div>').join('');
    let s1 = `<div class="sec-title"><span>I. Caso de análisis: la tilde olvidada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.kase.txt}</p>`;
    critCaseQuestions.forEach(q => { s1 += `<p class="crit-print-q">${q}</p>${lines(1)}`; });
    let s2 = `<div class="sec-title"><span>II. Corrige el error</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.err.txt}</p><p class="crit-print-q">Identifica dos errores y corrígelos con tus propias palabras:</p><p class="crit-print-q"><strong>Error 1:</strong></p>${lines(1)}<p class="crit-print-q"><strong>Error 2:</strong></p>${lines(1)}`;
    let s3 = `<div class="sec-title"><span>III. Toma de decisiones</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><p class="crit-print-scenario">${d.dec}</p><p class="crit-print-q">¿Qué tres estrategias recomendarías para mejorar su acentuación? Explica por qué ayudaría cada una.</p>${lines(2)}`;
    let s4 = `<div class="sec-title"><span>IV. Comparación razonada</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div><div class="crit-compare-print-grid"><div class="crit-compare-print-box"><strong>Caso A:</strong> ${d.cmp.a}</div><div class="crit-compare-print-box"><strong>Caso B:</strong> ${d.cmp.b}</div></div><p class="crit-print-q">1. ¿Qué regla de acentuación se aplica en cada caso? 2. ¿Por qué no son el mismo caso?</p>${lines(2)}`;
    let ceTbl = '<table class="crit-print-tbl"><tr><th>Causa</th><th>Efecto</th></tr>';
    d.causes.forEach(it => { ceTbl += `<tr><td>${it.cause}</td><td></td></tr>`; });
    d.effects.forEach(it => { ceTbl += `<tr><td></td><td>${it.effect}</td></tr>`; });
    ceTbl += '</table>';
    let s5 = `<div class="sec-title"><span>V. Análisis de causas y efectos</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20</span></div></div>${ceTbl}`;
    let pR = '';
    pR += `<div class="p-sec"><div class="p-ttl">I. Caso</div>${critCaseQuestions.map((q, i) => `<div class="p-crit-line"><strong>${i + 1}.</strong> ${critCaseGuides[i]}</div>`).join('')}</div>`;
    pR += `<div class="p-sec"><div class="p-ttl">II. Corrige el error</div><div class="p-crit-line"><strong>Error 1:</strong> ${d.err.g1}</div><div class="p-crit-line"><strong>Error 2:</strong> ${d.err.g2}</div></div>`;
    pR += `<div class="p-sec"><div class="p-ttl">III. Toma de decisiones</div><div class="p-crit-line">${critDecisionGuide}</div></div>`;
    pR += `<div class="p-sec"><div class="p-ttl">IV. Comparación</div><div class="p-crit-line"><strong>Caso A:</strong> ${d.cmp.ga}</div><div class="p-crit-line"><strong>Caso B:</strong> ${d.cmp.gb}</div><div class="p-crit-line">${d.cmp.gr}</div></div>`;
    pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Causas y efectos</div>${d.causes.map(it => `<div class="p-crit-line"><strong>Causa:</strong> ${it.cause} → <strong>Efecto:</strong> ${it.guide}</div>`).join('')}${d.effects.map(it => `<div class="p-crit-line"><strong>Efecto:</strong> ${it.effect} → <strong>Causa:</strong> ${it.guide}</div>`).join('')}</div>`;
    const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Pensamiento Crítico La Acentuación · Forma ${forma}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,Helvetica,sans-serif;font-size:11pt;color:#111;background:#fff;padding:1mm 5mm;}.ph{margin-bottom:0.3rem;}.ph h2{font-size:11pt;font-weight:700;text-align:center;margin-bottom:0.2rem;}.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:3px;}.ph-fill{flex:1;border-bottom:1px solid #555;min-height:12px;display:block;}.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}.ph-crit{font-size:9.5pt;text-align:center;color:#555;margin-top:0.1rem;}.sec-title{font-size:10.5pt;font-weight:700;padding:0.1rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #6c5ce7;background:#f1effd;color:#6c5ce7;}.obt-row{display:flex;align-items:baseline;gap:4px;font-size:9.5pt;font-weight:700;font-style:italic;color:#6c5ce7;}.obt-lbl{white-space:nowrap;}.obt-line{display:inline-block;min-width:50px;border-bottom:1.5px solid #6c5ce7;height:12px;}.obt-pct{white-space:nowrap;}.crit-print-scenario{font-size:10.5pt;background:#f1effd;border-left:3px solid #6c5ce7;padding:0.2rem 0.5rem;margin:0.1rem 0 0.2rem;line-height:1.3;}.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}.ln{border-bottom:1px solid #111;min-height:12px;margin-bottom:2px;}.crit-compare-print-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin:0.15rem 0;}.crit-compare-print-box{font-size:9.5pt;background:#f1effd;border-radius:4px;padding:0.25rem 0.4rem;line-height:1.25;}.crit-print-tbl{width:100%;border-collapse:collapse;font-size:9.5pt;margin-top:0.15rem;}.crit-print-tbl th,.crit-print-tbl td{border:1px solid #999;padding:0.3rem 0.45rem;text-align:left;height:30px;vertical-align:middle;}.crit-print-tbl th{background:#f1effd;}.pauta-wrap{page-break-before:always;padding-top:0.4rem;}.p-head{border-bottom:2px solid #333;padding-bottom:0.3rem;margin-bottom:0.4rem;text-align:center;}.p-main{font-size:9.5pt;font-weight:700;}.p-sub{font-size:7pt;color:#c00;font-weight:700;margin:0.08rem 0;}.p-meta{font-size:7pt;color:#555;}.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.4rem 0.9rem;}.p-sec{border:1px solid #ccc;border-radius:4px;padding:0.3rem 0.45rem;}.p-ttl{font-size:8pt;font-weight:700;border-bottom:1px solid #ddd;padding-bottom:0.1rem;margin-bottom:0.18rem;}.p-crit-line{font-size:7.5pt;color:#5a3fc0;margin-bottom:0.18rem;line-height:1.35;}.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.2rem;padding:0.1rem 0;color:#6c5ce7;}.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #6c5ce7;}.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}@media print{@page{size:letter portrait;margin:12.7mm;}}</style></head><body><div class="ph"><h2>Evaluación Competencial · Pensamiento Crítico · La Acentuación · II y III Ciclo · Español</h2><div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div><div class="ph-line"><strong>Institución:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div><p class="ph-crit">Valor total: 100 puntos · 5 secciones de 20 puntos</p></div>${s1}${s2}${s3}${s4}${s5}<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100</span></div><div class="pauta-wrap"><div class="p-head"><div class="p-main">✅ PAUTA — Pensamiento Crítico · La Acentuación · Forma ${forma}</div><div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div><div class="p-meta">Valor total: 100 pts | 5 secciones × 20 pts c/u — respuesta abierta, usar como guía de corrección</div></div><div class="p-grid">${pR}</div></div><div class="forma-tag">Forma ${forma}</div></body></html>`;
    const win = window.open('', '_blank', '');
    if (!win) { showToast('⚠️ Activa las ventanas emergentes para imprimir'); return; }
    win.document.write(doc); win.document.close(); setTimeout(() => win.print(), 400);
}

// ===================== LABORATORIO DE ACENTUACIÓN =====================
const parteData = {
    agudas: {
        nombre: 'Palabras Agudas', icon: '🔚',
        regla: { title: 'Regla', info: 'La sílaba tónica es la <strong>última</strong>. Llevan tilde cuando terminan en <strong>N, S o VOCAL</strong>. Ejemplo: ca-MIÓN (termina en N → lleva tilde).' },
        ejemplos: { title: 'Ejemplos', info: '<strong>Con tilde</strong> (terminan en n, s, vocal): camión, compás, sofá, café, jardín, también.<br><strong>Sin tilde</strong> (terminan en otra consonante): reloj, pared, feliz, color, amor, verdad.' },
        casos: { title: 'Casos especiales', info: 'Si una palabra aguda termina en <strong>dos consonantes</strong> (como "robots") o en "y" (como "estoy", "virrey"), generalmente <strong>no lleva tilde</strong>, ya que la "y" se comporta como consonante.' },
        errores: { title: 'Errores comunes', info: 'Poner tilde a agudas terminadas en consonantes distintas de n/s (escribir "reló" en vez de "reloj"), o no tildar agudas terminadas en vocal (escribir "sofa" en vez de "sofá").' }
    },
    llanas: {
        nombre: 'Palabras Llanas (Graves)', icon: '➖',
        regla: { title: 'Regla', info: 'La sílaba tónica es la <strong>penúltima</strong>. Llevan tilde cuando <strong>NO</strong> terminan en N, S o VOCAL. Ejemplo: ÁR-bol (termina en L → lleva tilde).' },
        ejemplos: { title: 'Ejemplos', info: '<strong>Con tilde</strong> (terminan en consonante ≠ n/s): árbol, lápiz, azúcar, fácil, débil, móvil.<br><strong>Sin tilde</strong> (terminan en vocal, n o s): casa, examen, joven, lunes, zapatos.' },
        casos: { title: 'Casos especiales', info: 'Cuando una palabra llana termina en <strong>dos consonantes</strong> (bíceps, fórceps), también lleva tilde, porque la última letra no es ni vocal, ni n, ni s sola.' },
        errores: { title: 'Errores comunes', info: 'No tildar llanas terminadas en consonante distinta de n/s (escribir "arbol" en vez de "árbol"), o tildar llanas que terminan en vocal/n/s (escribir "exámen" en vez de "examen").' }
    },
    esdrujulas: {
        nombre: 'Palabras Esdrújulas', icon: '⏫',
        regla: { title: 'Regla', info: 'La sílaba tónica es la <strong>antepenúltima</strong> (la tercera contando desde el final). <strong>Siempre llevan tilde, sin excepción.</strong> Ejemplo: MÚ-si-ca.' },
        ejemplos: { title: 'Ejemplos', info: 'música, médico, página, sábado, número, rápido, público, técnica, matemática, símbolo.' },
        casos: { title: 'Casos especiales', info: 'No existen excepciones a esta regla: toda palabra esdrújula en español lleva tilde siempre, sin importar en qué letra termine.' },
        errores: { title: 'Errores comunes', info: 'Olvidar la tilde en palabras esdrújulas de uso frecuente, como escribir "rapido" en vez de "rápido" o "numero" en vez de "número".' }
    },
    sobresdrujulas: {
        nombre: 'Palabras Sobresdrújulas', icon: '🔝',
        regla: { title: 'Regla', info: 'La sílaba tónica está <strong>antes de la antepenúltima</strong> sílaba. <strong>Siempre llevan tilde.</strong> Se forman generalmente al unir un verbo con uno o más pronombres enclíticos (-me, -te, -lo, -la, -selo...). Ejemplo: CÓ-me-te-lo.' },
        ejemplos: { title: 'Ejemplos', info: 'cómetelo, explícaselo, dígamelo, cuéntaselo, llévatelo, devuélvemelo.' },
        casos: { title: 'Casos especiales', info: 'Son las palabras menos frecuentes en español. Casi siempre resultan de agregar varios pronombres átonos a un verbo en imperativo, infinitivo o gerundio.' },
        errores: { title: 'Errores comunes', info: 'Olvidar que estas palabras siempre llevan tilde, incluso si la palabra base (el verbo) no la llevaba originalmente. Ej: "cuenta" (sin tilde) → "cuéntaselo" (con tilde).' }
    }
};
let labParte = 'agudas', labAspecto = 'regla';
function labShowParte(parteKey) { labParte = parteKey; updateLabDisplay(); document.querySelectorAll('.lab-cont-btn').forEach(b => b.classList.remove('active-pri')); const btn = document.querySelector(`[data-parte="${parteKey}"]`); if (btn) btn.classList.add('active-pri'); if (typeof sfx === 'function') sfx('click'); }
function labShowAspecto(aspectoKey) { labAspecto = aspectoKey; updateLabDisplay(); document.querySelectorAll('.lab-asp-btn').forEach(b => b.classList.remove('active-sec')); const btn = document.querySelector(`[data-aspecto="${aspectoKey}"]`); if (btn) btn.classList.add('active-sec'); if (typeof sfx === 'function') sfx('click'); }
function updateLabDisplay() { const data = parteData[labParte]; const asp = data[labAspecto]; document.getElementById('lab-sentence').innerHTML = `🔤 Explorando: <strong>${data.nombre}</strong> → <strong>${asp.title}</strong>`; document.getElementById('lab-display').innerHTML = `<div class="lab-cont-header">${data.icon} ${data.nombre}</div><div class="lab-asp-title">${asp.title}</div><div class="lab-asp-info">${asp.info}</div>`; }

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
    const msgs = ['🚀 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!', '🌱 ¡GRAN INICIO! Estás dando los primeros pasos.', '📚 ¡BUEN TRABAJO! Vas progresando muy bien.', '💪 ¡MUY BIEN! Dominas gran parte de las reglas de acentuación.', '🌟 ¡INCREÍBLE avance! Estás cerca de la excelencia ortográfica.', '🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Acentuación!'];
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
    const txt = `${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: La Acentuación\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText ? '\n\n🏅 Logros desbloqueados:\n' + achText : ''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
    buildRoute(); showWtype(); showSil(); showDia(); updateLabDisplay();
    document.querySelector('[data-parte="agudas"]')?.classList.add('active-pri');
    document.querySelector('[data-aspecto="regla"]')?.classList.add('active-sec');
    renderAchPanel();
    document.addEventListener('click', function (e) {
        const panel = document.getElementById('achPanel');
        const btn = document.getElementById('achBtn');
        if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn) panel.classList.remove('open');
    });
    document.addEventListener('click', function (e) {
        if (e.target === document.getElementById('diplomaOverlay')) closeDiploma();
    });
    const savedName = localStorage.getItem('nombreEstudianteAcentuacion');
    const inputName = document.querySelector('.diploma-input');
    if (savedName && inputName) { inputName.value = savedName; updateDiplomaName(savedName); }
    if (inputName) inputName.addEventListener('input', e => localStorage.setItem('nombreEstudianteAcentuacion', e.target.value));
    fin('s-aprende', false);
    fin('s-estructura', false);
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
    const titulo = encodeURIComponent('Misión La Acentuación | II y III Ciclo – policastsapien.com');
    const classroomUrl = 'https://classroom.google.com/share?url=' + url + '&title=' + titulo;

    if (!out || out.innerHTML.trim() === '') {
        _classroomHint('⚠️ Primero genera las tareas con el botón "Generar" y luego haz clic aquí.', false);
        return;
    }

    const tipoEl = document.getElementById('tgType');
    const tipoText = tipoEl ? tipoEl.options[tipoEl.selectedIndex].text.replace(/^\S+\s*/, '') : '';
    let texto = '📚 MISIÓN: LA ACENTUACIÓN | II y III Ciclo – Español · Lengua\n';
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
