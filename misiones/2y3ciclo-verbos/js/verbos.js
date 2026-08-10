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
let evalCritFormNum = 1, evalCritAnsVisible = false;
let unlockedAch = [];
let darkMode = false;
let prevLevel = 0;
const TOTAL_SECTIONS = 11;

// XP TRACKER — previene doble puntuación
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
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ doneSections: Array.from(done), unlockedAch, evalFormNum, evalCritFormNum })); } catch (e) { }
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
    } catch (e) { }
}

// ===================== ACHIEVEMENTS =====================
let _lecturaApi = null;

const ACHIEVEMENTS = {
    lector_minuto: { icon: '📖', label: 'Primer minuto de lectura cronometrado' },
    lector_banda: { icon: '⏱️', label: 'Leíste dentro de la banda de tu grado' },
    cazador_verbos: { icon: '🎯', label: 'Cazaste todos los verbos de una lectura' },
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
  /* El cronómetro no puede seguir corriendo detrás de otra pestaña. */
  if (id !== 's-lectura' && _lecturaApi) _lecturaApi.soltar();
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
    { s: ['Quiero', 'aprender', 'a', 'nadar.'], c: 0, art: 'Verbo principal conjugado (no el infinitivo)' },
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
    document.getElementById('eval-screen-title').textContent = `📝 Evaluación Final — Forma ${cf} · Los Verbos`;
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
<title>Evaluación Los Verbos · Forma ${forma}</title>
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
  <h2>Evaluación Final de Misión Los Verbos — Español — Lengua</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
</div><div class="pauta-wrap" id="pautaPage">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · Misión Los Verbos · Forma ${forma}</div>
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
// Segunda evaluación imprimible de la misión (Español). Todo el contenido nace
// de los bancos y tarjetas de ESTA misión (classifyTaskDB, cmpData,
// completeTaskDB, fcData). Formas deterministas: semilla _evalRng(200000+cf).
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

// ── I. Cirujano del verbo (raíz + desinencia + conjugación; derivado de classifyTaskDB)
const critCirBank = [
    { w: 'corrió', raiz: 'corr', des: 'ió', inf: 'correr', conj: '2da' },
    { w: 'cantamos', raiz: 'cant', des: 'amos', inf: 'cantar', conj: '1ra' },
    { w: 'viviré', raiz: 'viv', des: 'iré', inf: 'vivir', conj: '3ra' },
    { w: 'lees', raiz: 'le', des: 'es', inf: 'leer', conj: '2da' },
    { w: 'saltaron', raiz: 'salt', des: 'aron', inf: 'saltar', conj: '1ra' },
    { w: 'escribirá', raiz: 'escrib', des: 'irá', inf: 'escribir', conj: '3ra' },
    { w: 'jugaban', raiz: 'jug', des: 'aban', inf: 'jugar', conj: '1ra' },
    { w: 'dibujas', raiz: 'dibuj', des: 'as', inf: 'dibujar', conj: '1ra' },
    { w: 'estudiaré', raiz: 'estudi', des: 'aré', inf: 'estudiar', conj: '1ra' },
    { w: 'dormimos', raiz: 'dorm', des: 'imos', inf: 'dormir', conj: '3ra' },
    { w: 'comerán', raiz: 'com', des: 'erán', inf: 'comer', conj: '2da' },
    { w: 'viajaste', raiz: 'viaj', des: 'aste', inf: 'viajar', conj: '1ra' },
];
const critConjOptions = [{ v: '1ra', t: '1ra (-ar)' }, { v: '2da', t: '2da (-er)' }, { v: '3ra', t: '3ra (-ir)' }];
// ── II. Detective del tiempo y modo (pistas contextuales al estilo de cmpData)
const critTMBank = [
    { s: 'Ayer nosotros <strong>fuimos</strong> al parque a jugar fútbol.', pista: 'Ayer', t: 'pasado', m: 'indicativo' },
    { s: 'Mañana yo <strong>escribiré</strong> una carta a mi abuela.', pista: 'Mañana', t: 'futuro', m: 'indicativo' },
    { s: '¡Por favor, <strong>cierra</strong> la puerta ahora mismo!', pista: 'ahora mismo', t: 'presente', m: 'imperativo' },
    { s: 'Ojalá que mi equipo <strong>gane</strong> el campeonato.', pista: 'Ojalá que', t: 'presente', m: 'subjuntivo' },
    { s: 'En este momento, la profesora <strong>explica</strong> la lección.', pista: 'En este momento', t: 'presente', m: 'indicativo' },
    { s: 'El año pasado, yo <strong>viajé</strong> a la montaña con mi familia.', pista: 'El año pasado', t: 'pasado', m: 'indicativo' },
    { s: 'Mañana nosotros <strong>veremos</strong> una película muy divertida.', pista: 'Mañana', t: 'futuro', m: 'indicativo' },
    { s: 'Ojalá que no <strong>llueva</strong> durante nuestra excursión.', pista: 'Ojalá que', t: 'presente', m: 'subjuntivo' },
    { s: '¡<strong>Ordena</strong> tu habitación ahora mismo!', pista: 'ahora mismo', t: 'presente', m: 'imperativo' },
    { s: 'El verano pasado, mis amigos <strong>viajaron</strong> a la playa.', pista: 'El verano pasado', t: 'pasado', m: 'indicativo' },
];
const critTiempoOptions = ['pasado', 'presente', 'futuro'];
const critModoOptions = ['indicativo', 'subjuntivo', 'imperativo'];
// ── III. Detective del error de concordancia (persona/número mal conjugados)
const critConcBank = [
    { bad: 'Nosotros canta en el coro de la escuela.', fix: 'cantamos', model: 'El sujeto «nosotros» es 1ra persona del plural: el verbo debe ser «cantamos».' },
    { bad: 'Los pájaros vuela alto en el cielo azul.', fix: 'vuelan', model: 'El sujeto «los pájaros» es plural (3ra persona): el verbo debe ser «vuelan».' },
    { bad: 'Yo comes frutas todas las mañanas.', fix: 'como', model: '«Yo» es 1ra persona del singular: el verbo debe ser «como».' },
    { bad: 'Tú estudian para el examen de Español.', fix: 'estudias', model: '«Tú» es 2da persona del singular: el verbo debe ser «estudias».' },
    { bad: 'Ella dibujamos un paisaje del campo.', fix: 'dibuja', model: '«Ella» es 3ra persona del singular: el verbo debe ser «dibuja».' },
    { bad: 'Ustedes lee un cuento cada noche.', fix: 'leen', model: '«Ustedes» es plural: el verbo debe ser «leen».' },
    { bad: 'Mi mamá preparan la cena de la familia.', fix: 'prepara', model: '«Mi mamá» es un solo sujeto (3ra persona singular): el verbo debe ser «prepara».' },
    { bad: 'Ellos duerme en el sofá de la sala.', fix: 'duermen', model: '«Ellos» es 3ra persona del plural: el verbo debe ser «duermen».' },
];
// ── IV. Transformador de oraciones (contexto hondureño; verificación por forma verbal clave)
const critTransBank = [
    { orig: 'El agricultor cosecha café en la montaña.', pedido: 'presente → futuro', key: 'cosechará', model: 'El agricultor cosechará café en la montaña.' },
    { orig: 'Yo como una baleada en el desayuno.', pedido: 'singular → plural (yo → nosotros)', key: 'comemos', model: 'Nosotros comemos baleadas en el desayuno.' },
    { orig: 'Tú cuidas el río de tu comunidad.', pedido: 'indicativo → imperativo', key: 'cuida', model: '¡Cuida el río de tu comunidad!' },
    { orig: 'La niña canta el Himno Nacional en el acto cívico.', pedido: 'presente → pasado', key: 'cantó', model: 'La niña cantó el Himno Nacional en el acto cívico.' },
    { orig: 'Los estudiantes visitarán las ruinas de Copán.', pedido: 'futuro → pasado', key: 'visitaron', model: 'Los estudiantes visitaron las ruinas de Copán.' },
    { orig: 'El pescador vende pescado frito en La Ceiba.', pedido: 'singular → plural (el pescador → los pescadores)', key: 'venden', model: 'Los pescadores venden pescado frito en La Ceiba.' },
    { orig: 'Ustedes leen la leyenda de la Lluvia de Peces de Yoro.', pedido: 'presente → futuro', key: 'leerán', model: 'Ustedes leerán la leyenda de la Lluvia de Peces de Yoro.' },
    { orig: 'Tú estudias la clase de Español todos los días.', pedido: 'indicativo → imperativo', key: 'estudia', model: '¡Estudia la clase de Español todos los días!' },
];
// ── V. Razonamiento argumentado (desarrollo con respuesta modelo + rúbrica)
const critArgBank = [
    {
        q: 'Aplica la «prueba de la raíz»: conjuga «cantar» y «tener» en pasado (yo) y en futuro (yo), y demuestra con esas formas por qué «cantar» es regular y «tener» es irregular.',
        model: 'Cantar: yo canté, yo cantaré — la raíz cant- se mantiene igual en todos los tiempos: es REGULAR. Tener: yo tuve, yo tendré — la raíz ten- cambia a tuv- y tendr-: es IRREGULAR porque no conserva su raíz al conjugarse.'
    },
    {
        q: 'Argumenta por qué «ser», «estar» y «parecer» son verbos copulativos y no de acción. Escribe un ejemplo propio con uno de ellos.',
        model: 'No expresan una acción que el sujeto realiza: unen el sujeto con una cualidad o estado (atributo). Ejemplo: «Mi abuela es cariñosa» — «es» no indica movimiento ni acción; solo une a la abuela con su cualidad.'
    },
];

function _critSel(cls, dataAttr, i, opts, aria) {
    return `<select class="${cls}" ${dataAttr}="${i}" aria-label="${aria}"><option value="">—</option>${opts.map(o => typeof o === 'string' ? `<option value="${o}">${o}</option>` : `<option value="${o.v}">${o.t}</option>`).join('')}</select>`;
}
function _critEq(student, expected) {
    return normalizeEvalAnswer(student).replace(/-/g, '') === normalizeEvalAnswer(expected).replace(/-/g, '');
}
function _critHasWord(student, key) {
    const words = normalizeEvalAnswer(student).replace(/[¡!¿?.,;:«»"']/g, ' ').split(/\s+/).filter(Boolean);
    return words.includes(normalizeEvalAnswer(key));
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
    document.getElementById('evalcrit-screen-title').textContent = `🧠 Pensamiento Crítico · Forma ${cf} · Los Verbos`;
    evalCritAnsVisible = false;
    const out = document.getElementById('evalCritOut'); out.innerHTML = '';

    // Barra de distribución + progresión de dificultad declarada
    const bar = document.createElement('div'); bar.className = 'eval-score-bar';
    bar.innerHTML = `<div><div class="esb-title">📊 Distribución de puntaje — 100 puntos</div><div class="esb-dist">Dificultad creciente: identificar y separar (I) → analizar pistas de tiempo y modo (II) → detectar y corregir errores (III) → transformar oraciones (IV) → argumentar (V).</div></div><div style="display:flex;gap:0.4rem;flex-wrap:wrap;"><span class="eval-score-pill esp-cp">I. Cirujano 20</span><span class="eval-score-pill esp-tf">II. Tiempo y modo 20</span><span class="eval-score-pill esp-mc">III. Concordancia 20</span><span class="eval-score-pill esp-pr">IV. Transformador 20</span><span class="eval-score-pill esp-cp">V. Argumenta 20</span></div>`;
    out.appendChild(bar);

    // ── I. Cirujano del verbo (5×4=20)
    const cirItems = _pickF(critCirBank, 5, rngC);
    let cirRows = '';
    cirItems.forEach((it, i) => {
        cirRows += `<div class="crit-q-block"><div class="crit-scenario"><strong>🔪 Verbo ${i + 1}:</strong> <em style="font-size:1.05rem;">${it.w}</em></div><div class="crit-cir-row">Raíz: <input class="eval-cp-input crit-cir-input" type="text" data-cirr="${i}" autocomplete="off" aria-label="Raíz del verbo ${it.w}"> + Desinencia: <input class="eval-cp-input crit-cir-input" type="text" data-cird="${i}" autocomplete="off" aria-label="Desinencia del verbo ${it.w}"> · Conjugación del infinitivo: ${_critSel('crit-sel', 'data-circ', i, critConjOptions, 'Conjugación del infinitivo de ' + it.w)}</div><div class="eval-answer">${it.raiz}- + -${it.des} → infinitivo ${it.inf}, ${it.conj} conjugación</div><div class="eval-item-feedback" id="critFbCir${i}" aria-live="polite"></div></div>`;
    });
    const s1 = document.createElement('div');
    s1.innerHTML = `<div class="eval-section-title">I. Cirujano del verbo <span class="eval-pts">20 pts · 4 pts c/u</span></div><div class="eval-item"><p class="crit-q-label">Opera cada verbo conjugado: sepáralo en <strong>raíz</strong> + <strong>desinencia</strong> y elige la <strong>conjugación</strong> de su infinitivo (1ra -ar, 2da -er, 3ra -ir).</p>${cirRows}</div>`;
    out.appendChild(s1);

    // ── II. Detective del tiempo y modo (5×4=20)
    const tmItems = _pickF(critTMBank, 5, rngC);
    let tmRows = '';
    tmItems.forEach((it, i) => {
        tmRows += `<div class="crit-q-block"><div class="crit-scenario"><strong>🕵️ Oración ${i + 1}:</strong> ${it.s}</div><div class="crit-cir-row">Tiempo: ${_critSel('crit-sel', 'data-tmt', i, critTiempoOptions, 'Tiempo verbal de la oración ' + (i + 1))} · Modo: ${_critSel('crit-sel', 'data-tmm', i, critModoOptions, 'Modo verbal de la oración ' + (i + 1))} · Palabra-pista: <input class="eval-cp-input crit-cir-input" type="text" data-tmp="${i}" autocomplete="off" aria-label="Palabra pista de la oración ${i + 1}"></div><div class="eval-answer">Tiempo ${it.t} · modo ${it.m} · pista: «${it.pista}»</div><div class="eval-item-feedback" id="critFbTm${i}" aria-live="polite"></div></div>`;
    });
    const s2 = document.createElement('div');
    s2.innerHTML = `<div class="eval-section-title">II. Detective del tiempo y modo <span class="eval-pts">20 pts · 4 pts c/u</span></div><div class="eval-item"><p class="crit-q-label">El verbo va <strong>resaltado</strong>. Identifica su tiempo y su modo, y escribe la <strong>palabra-pista</strong> del contexto que te lo reveló (en papel la subrayas).</p>${tmRows}</div>`;
    out.appendChild(s2);

    // ── III. Detective del error de concordancia (5×4=20)
    const concItems = _pickF(critConcBank, 5, rngC);
    let concRows = '';
    concItems.forEach((it, i) => {
        concRows += `<div class="crit-q-block"><div class="crit-scenario">❌ ${it.bad}</div><div class="crit-cir-row">Forma verbal correcta: <input class="eval-cp-input crit-cir-input" type="text" data-conc="${i}" autocomplete="off" aria-label="Forma verbal correcta de la oración ${i + 1}"></div><div class="crit-q-label" style="margin-top:0.35rem;">¿Por qué está mal? Explica:</div><textarea class="crit-textarea" rows="2" aria-label="Explicación del error ${i + 1}" placeholder="El sujeto es... por eso el verbo debe..."></textarea><div class="eval-answer">${it.fix}. ${it.model}</div><div class="eval-item-feedback" id="critFbConc${i}" aria-live="polite"></div></div>`;
    });
    const s3 = document.createElement('div');
    s3.innerHTML = `<div class="eval-section-title">III. Detective del error de concordancia <span class="eval-pts">20 pts · 4 pts c/u</span></div><div class="eval-item"><p class="crit-q-label">Cada oración tiene un verbo <strong>mal conjugado</strong> en persona o número. Escribe la forma correcta (se autocalifica) y explica el porqué (se compara con la pauta).</p>${concRows}</div>`;
    out.appendChild(s3);

    // ── IV. Transformador de oraciones (5×4=20)
    const transItems = _pickF(critTransBank, 5, rngC);
    let transRows = '';
    transItems.forEach((it, i) => {
        transRows += `<div class="crit-q-block"><div class="crit-scenario"><strong>⚙️ Original ${i + 1}:</strong> ${it.orig}<br><strong>Cambio pedido:</strong> ${it.pedido}</div><textarea class="crit-textarea" data-trans="${i}" rows="2" aria-label="Oración transformada ${i + 1}" placeholder="Reescribe la oración completa con el cambio pedido..."></textarea><div class="eval-answer">${it.model} (forma verbal clave: «${it.key}»)</div><div class="eval-item-feedback" id="critFbTrans${i}" aria-live="polite"></div></div>`;
    });
    const s4 = document.createElement('div');
    s4.innerHTML = `<div class="eval-section-title">IV. Transformador de oraciones <span class="eval-pts">20 pts · 4 pts c/u</span></div><div class="eval-item"><p class="crit-q-label">Reescribe cada oración cambiando <strong>solo lo que se pide</strong> (tiempo, número o modo). Se verifica que uses la forma verbal correcta.</p>${transRows}</div>`;
    out.appendChild(s4);

    // ── V. Razonamiento argumentado (2×10=20, autoevaluación con rúbrica)
    const agItems = critArgBank; // las dos preguntas del diseño, fijas en todas las formas
    let agRows = '';
    agItems.forEach((it, i) => {
        agRows += `<div class="crit-q-block"><div class="crit-q-label">${String.fromCharCode(97 + i)}) ${it.q}</div><textarea class="crit-textarea" rows="3" aria-label="Respuesta argumentada ${i + 1}"></textarea><div class="eval-answer">${it.model}</div><div class="crit-selfscore"><label for="critScoreV${i}">Obtenido (autoevaluación con la rúbrica):</label><input type="number" id="critScoreV${i}" class="crit-score-input" min="0" max="10" value="0"> <span>de 10 pts</span></div></div>`;
    });
    const s5 = document.createElement('div');
    s5.innerHTML = `<div class="eval-section-title">V. Razonamiento argumentado <span class="eval-pts">20 pts · 10 pts c/u</span></div><div class="eval-item"><p class="crit-q-label">Responde con tus propias palabras y compara con la respuesta modelo de la <strong>Pauta</strong>.</p>${agRows}<div class="crit-rubric"><strong>📋 Rúbrica (3 criterios, hasta 10 pts por respuesta):</strong> claridad de la idea (0-3) · uso correcto de los conceptos de la misión: raíz, desinencia, conjugación, regular/irregular, copulativo (0-4) · demostración con ejemplos o conjugaciones propias (0-3).</div></div>`;
    out.appendChild(s5);

    window._evalCritData = { cir: cirItems, tm: tmItems, conc: concItems, trans: transItems, arg: agItems };
    const totalPanel = document.createElement('div'); totalPanel.id = 'evalCritTotalResult'; totalPanel.className = 'eval-auto-result';
    totalPanel.innerHTML = '<strong>🧮 Prueba de pensamiento crítico:</strong> resuelve las secciones I–IV en pantalla, autoevalúa la V con la rúbrica y presiona <em>Calificar prueba</em>. La impresión conserva el formato limpio para papel.';
    out.appendChild(totalPanel);
    fin('s-evaluacion');
}
function toggleEvalCritAns() {
    evalCritAnsVisible = !evalCritAnsVisible;
    document.querySelectorAll('#evalCritOut .eval-answer').forEach(el => el.style.display = evalCritAnsVisible ? 'block' : 'none');
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
    const detail = { cir: 0, tm: 0, conc: 0, trans: 0, arg: 0 };

    // I. Cirujano del verbo (4 pts c/u: raíz + desinencia + conjugación correctas)
    d.cir.forEach((it, i) => {
        const inR = document.querySelector(`[data-cirr="${i}"]`), inD = document.querySelector(`[data-cird="${i}"]`), sel = document.querySelector(`[data-circ="${i}"]`);
        const okR = !!inR && _critEq(inR.value, it.raiz);
        const okD = !!inD && _critEq(inD.value, it.des);
        const okC = !!sel && sel.value === it.conj;
        if (inR) { inR.classList.toggle('eval-input-ok', okR); inR.classList.toggle('eval-input-no', !okR); }
        if (inD) { inD.classList.toggle('eval-input-ok', okD); inD.classList.toggle('eval-input-no', !okD); }
        if (sel) { sel.classList.toggle('eval-input-ok', okC); sel.classList.toggle('eval-input-no', !okC); }
        const ok = okR && okD && okC;
        if (ok) detail.cir += 4;
        _setCritFb('critFbCir' + i, ok, ok ? 'Correcto. +4 pts' : `Revisar. R/ ${it.raiz}- + -${it.des} · ${it.conj} conjugación (${it.inf})`);
    });

    // II. Detective del tiempo y modo (4 pts c/u: tiempo + modo + palabra-pista)
    d.tm.forEach((it, i) => {
        const selT = document.querySelector(`[data-tmt="${i}"]`), selM = document.querySelector(`[data-tmm="${i}"]`), inP = document.querySelector(`[data-tmp="${i}"]`);
        const okT = !!selT && selT.value === it.t;
        const okM = !!selM && selM.value === it.m;
        const sP = normalizeEvalAnswer(inP ? inP.value : ''), eP = normalizeEvalAnswer(it.pista);
        const okP = !!sP && (eP.includes(sP) || sP.includes(eP));
        if (selT) { selT.classList.toggle('eval-input-ok', okT); selT.classList.toggle('eval-input-no', !okT); }
        if (selM) { selM.classList.toggle('eval-input-ok', okM); selM.classList.toggle('eval-input-no', !okM); }
        if (inP) { inP.classList.toggle('eval-input-ok', okP); inP.classList.toggle('eval-input-no', !okP); }
        const ok = okT && okM && okP;
        if (ok) detail.tm += 4;
        _setCritFb('critFbTm' + i, ok, ok ? 'Correcto. +4 pts' : `Revisar. R/ Tiempo ${it.t} · modo ${it.m} · pista: «${it.pista}»`);
    });

    // III. Concordancia (4 pts c/u por la forma verbal correcta; explicación → pauta)
    d.conc.forEach((it, i) => {
        const inp = document.querySelector(`[data-conc="${i}"]`);
        const ok = !!inp && isCpCorrect(inp.value, it.fix);
        if (inp) { inp.classList.toggle('eval-input-ok', ok); inp.classList.toggle('eval-input-no', !ok); }
        if (ok) detail.conc += 4;
        _setCritFb('critFbConc' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. R/ ' + it.fix + '. ' + it.model);
    });

    // IV. Transformador (4 pts c/u si la oración contiene la forma verbal esperada)
    d.trans.forEach((it, i) => {
        const ta = document.querySelector(`[data-trans="${i}"]`);
        const ok = !!ta && _critHasWord(ta.value, it.key);
        if (ta) { ta.classList.toggle('eval-input-ok', ok); ta.classList.toggle('eval-input-no', !ok); }
        if (ok) detail.trans += 4;
        _setCritFb('critFbTrans' + i, ok, ok ? 'Correcto. +4 pts' : 'Revisar. R/ ' + it.model);
    });

    // V. Razonamiento argumentado (autoevaluación 0-10 por respuesta)
    d.arg.forEach((it, i) => {
        const inp = document.getElementById('critScoreV' + i);
        let v = parseInt(inp ? inp.value : 0) || 0;
        v = Math.max(0, Math.min(10, v));
        if (inp) inp.value = v;
        detail.arg += v;
    });

    const total = detail.cir + detail.tm + detail.conc + detail.trans + detail.arg;
    const panel = document.getElementById('evalCritTotalResult');
    if (panel) {
        panel.className = 'eval-auto-result ' + (total >= 70 ? 'eval-auto-pass' : 'eval-auto-risk');
        panel.innerHTML = `<strong>Resultado: ${total}/100 pts</strong><br><span>I. Cirujano: ${detail.cir}/20 · II. Tiempo y modo: ${detail.tm}/20 · III. Concordancia: ${detail.conc}/20 · IV. Transformador: ${detail.trans}/20 · V. Argumenta: ${detail.arg}/20</span><br><em>Las secciones I–IV se califican solas; la V la autoevalúas con la rúbrica. Compara siempre con la Pauta.</em>`;
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

    // I. Cirujano del verbo
    let s1 = `<div class="sec-title"><span>I. Cirujano del verbo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="crit-print-q">Separa cada verbo conjugado en raíz + desinencia y escribe la conjugación de su infinitivo (1ra -ar, 2da -er, 3ra -ir).</p>`;
    d.cir.forEach((it, i) => { s1 += `<div class="cir-row"><span class="qn">${i + 1}.</span><strong class="cir-w">${it.w}</strong> → Raíz: <span class="cp-blank sm"></span> + Desinencia: <span class="cp-blank sm"></span> · Conjugación: <span class="cp-blank sm"></span></div>`; });

    // II. Detective del tiempo y modo
    let s2 = `<div class="sec-title"><span>II. Detective del tiempo y modo</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="crit-print-q">Subraya la palabra-pista de cada oración y escribe el tiempo y el modo del verbo resaltado.</p>`;
    d.tm.forEach((it, i) => { s2 += `<div class="tm-row"><span class="qn">${i + 6}.</span><span class="tm-s">${it.s}</span></div><div class="tm-ans">Tiempo: <span class="cp-blank sm"></span> · Modo: <span class="cp-blank sm"></span></div>`; });

    // III. Detective del error de concordancia
    let s3 = `<div class="sec-title"><span>III. Detective del error de concordancia</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="crit-print-q">Cada oración tiene un verbo mal conjugado en persona o número. Escribe la forma correcta y explica por qué.</p>`;
    d.conc.forEach((it, i) => { s3 += `<div class="crit-print-scenario">❌ ${it.bad}</div><p class="crit-print-q">${i + 11}. Forma correcta: <span class="cp-blank sm"></span> · ¿Por qué?</p>${lines(1)}`; });

    // IV. Transformador de oraciones
    let s4 = `<div class="sec-title"><span>IV. Transformador de oraciones</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="crit-print-q">Reescribe cada oración cambiando solo lo que se pide (tiempo, número o modo).</p>`;
    d.trans.forEach((it, i) => { s4 += `<div class="crit-print-scenario"><strong>${i + 16}.</strong> ${it.orig} <em>(Cambio: ${it.pedido})</em></div>${lines(1)}`; });

    // V. Razonamiento argumentado
    let s5 = `<div class="sec-title"><span>V. Razonamiento argumentado</span><div class="obt-row"><span class="obt-lbl">Obtenido:</span><span class="obt-line"></span><span class="obt-pct">de 20 pts</span></div></div><p class="crit-print-q">Responde con tus propias palabras (10 pts c/u). Rúbrica: claridad (0-3) · uso correcto de conceptos: raíz, conjugación, regular/irregular, copulativo (0-4) · demostración con ejemplos propios (0-3).</p>`;
    d.arg.forEach((it, i) => { s5 += `<p class="crit-print-q"><strong>${String.fromCharCode(97 + i)})</strong> ${it.q}</p>${lines(3)}`; });

    // Pauta
    let pR = '';
    pR += `<div class="p-sec"><div class="p-ttl">I. Cirujano del verbo</div>${d.cir.map((it, i) => `<div class="p-crit-line"><strong>${i + 1}. ${it.w}:</strong> ${it.raiz}- + -${it.des} → ${it.inf}, ${it.conj} conjugación</div>`).join('')}</div>`;
    pR += `<div class="p-sec"><div class="p-ttl">II. Detective del tiempo y modo</div>${d.tm.map((it, i) => `<div class="p-crit-line"><strong>${i + 6}.</strong> Tiempo ${it.t} · modo ${it.m} · pista: «${it.pista}»</div>`).join('')}</div>`;
    pR += `<div class="p-sec"><div class="p-ttl">III. Error de concordancia</div>${d.conc.map((it, i) => `<div class="p-crit-line"><strong>${i + 11}. ${it.fix}:</strong> ${it.model}</div>`).join('')}</div>`;
    pR += `<div class="p-sec"><div class="p-ttl">IV. Transformador de oraciones</div>${d.trans.map((it, i) => `<div class="p-crit-line"><strong>${i + 16}.</strong> ${it.model} <em>(clave: ${it.key})</em></div>`).join('')}</div>`;
    pR += `<div class="p-sec" style="grid-column:1/-1;"><div class="p-ttl">V. Razonamiento argumentado (respuestas modelo + rúbrica)</div>${d.arg.map((it, i) => `<div class="p-crit-line"><strong>${String.fromCharCode(97 + i)})</strong> ${it.model}</div>`).join('')}<div class="p-crit-line"><em>Rúbrica por respuesta (10 pts): claridad de la idea (0-3) · uso correcto de conceptos de la misión (0-4) · demostración con ejemplos o conjugaciones propias (0-3).</em></div></div>`;

    const doc = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pensamiento Crítico Los Verbos · Forma ${forma}</title><style>
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
.crit-print-scenario{font-size:10pt;background:#fef9e7;border-left:3px solid #c49000;padding:0.18rem 0.5rem;margin:0.12rem 0 0.15rem;line-height:1.3;}
.crit-print-q{font-size:10pt;font-weight:600;margin:0.15rem 0 0.08rem;line-height:1.25;}
.ln{border-bottom:1px solid #111;min-height:13px;margin-bottom:3px;}
.qn{font-weight:700;min-width:20px;flex-shrink:0;}
.cir-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.5;padding:0.2rem 0.2rem;border-bottom:1px solid #eee;flex-wrap:wrap;}
.cir-w{min-width:70px;}
.tm-row{display:flex;align-items:baseline;gap:0.3rem;font-size:10.5pt;line-height:1.4;padding:0.18rem 0.2rem 0;}
.tm-s{flex:1;}
.tm-ans{font-size:10pt;margin:0.08rem 0 0.15rem 1.5rem;border-bottom:1px solid #eee;padding-bottom:0.15rem;}
.cp-blank{display:inline-block;min-width:110px;border-bottom:1.5px solid #111;margin:0 0.12rem;}
.cp-blank.sm{min-width:62px;}
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
.p-crit-line{font-size:11pt;color:#007a00;margin-bottom:0.16rem;line-height:1.35;}
.print-foot{position:fixed;bottom:2mm;left:0;right:0;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:7.5pt;color:#111;background:#fff;padding:1px 3px;}
.pf-item{display:flex;align-items:center;gap:4px;white-space:nowrap;}
.pf-line{display:inline-block;min-width:34px;border-bottom:1px solid #555;height:9px;}
.pf-box{display:inline-block;width:11px;height:11px;border:1.3px solid #111;border-radius:2px;background:#fff;flex-shrink:0;}
.forma-tag{font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;white-space:nowrap;}
@media print{@page{size:letter portrait;margin:5mm 7mm;}body{padding-bottom:9mm;}}
</style></head><body><div id="critPage">
<div class="ph">
  <h2>Evaluación Competencial · Pensamiento Crítico · Los Verbos · Educación Básica · Español</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Parcial:</strong><span class="ph-s">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · I. Cirujano 20 · II. Tiempo y modo 20 · III. Concordancia 20 · IV. Transformador 20 · V. Argumenta 20 · Forma ${forma}</p>
</div>
${s1}${s2}${s3}${s4}${s5}
<div class="total-row"><span>Total obtenido:</span><span class="obt-line"></span><span>de 100 pts</span></div>
</div><div class="pauta-wrap" id="critPautaPage">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Pensamiento Crítico · Los Verbos · Forma ${forma}</div>
    <div class="p-sub">Documento exclusivo del docente · No distribuir al estudiante</div>
    <div class="p-meta">Valor total: 100 pts | I 20 · II 20 · III 20 · IV 20 · V 20 — secciones abiertas: usar como guía de corrección</div>
  </div>
  <div class="p-grid">${pR}</div>
</div>
<div class="print-foot"><span class="pf-item"><strong>Nº de Evaluación temática realizada:</strong><span class="pf-line">&nbsp;</span></span><span class="pf-item"><strong>Evaluación con valor en el parcial</strong><span class="pf-box"></span></span><span class="pf-item"><strong>Evaluación solo de repaso</strong><span class="pf-box"></span></span><span class="forma-tag">Forma ${forma}</span></div>
<script>(function(){function fit(id,mm,min,max){var el=document.getElementById(id);if(!el)return;var target=mm*96/25.4;if(!el.getBoundingClientRect().height)return;var lo=min,hi=max,best=min;for(var i=0;i<12;i++){var z=(lo+hi)/2;el.style.zoom=z;if(el.getBoundingClientRect().height<=target){best=z;lo=z;}else{hi=z;}}el.style.zoom=best*0.995;}fit("critPage",252,0.55,1.3);fit("critPautaPage",252,0.55,1.3);})();<\/script></body></html>`;
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
    const pct = _diplPct(); const name = document.getElementById('diplName').textContent;
    const stars = document.getElementById('diplStars').textContent;
    const msg = document.getElementById('diplMsg').textContent;
    const date = document.getElementById('diplDate').textContent;
    const achText = unlockedAch.map(id => ACHIEVEMENTS[id].icon + ' ' + ACHIEVEMENTS[id].label).join('\n');
    const txt = `${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: Los Verbos\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText ? '\n\n🏅 Logros desbloqueados:\n' + achText : ''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
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
// Formas deterministas v1: selectores de forma visibles desde la carga de la página
(function _formaSelInit(){ const go=function(){ try{_evalFormaSelector();}catch(e){} try{ if(typeof genEvalOp==='function') _injectFormaSel('genEvalOp','evalOpFormaSel',evalOpFormNum,function(v){evalOpFormNum=v;}); }catch(e){} try{ if(typeof genEvalCrit==='function') _injectFormaSel('genEvalCrit','evalCritFormaSel',evalCritFormNum,function(v){evalCritFormNum=v;}); }catch(e){} }; if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',go); else go(); })();

// ═════════════════ 📖 CONTROL DE LECTURA ═════════════════
// Se paga UNA vez por lectura, no por repetirla: releer el mismo texto dos o
// tres días es lo que más sube la fluidez, y si se pagara cada vez el alumno
// repetiría por los puntos y no por leer.
function initLectura(){
  if (typeof LecturaMision === 'undefined' || typeof LECTURA_VERBOS === 'undefined') return;
  _lecturaApi = LecturaMision.montar({
    contenedor: 'lm-root',
    corpus: LECTURA_VERBOS,
    actividades: LECTURA_VERBOS_TALLER,
    resumen: LECTURA_VERBOS_RESUMEN,
    mision: 'verbos',
    tema: 'los verbos',
    alTerminar: function (r) {
      fin('s-lectura');
      unlockAchievement('lector_minuto');
      if (r.nivelVelocidad === 'estandar' || r.nivelVelocidad === 'avanzado') unlockAchievement('lector_banda');
      var caza = r.porActividad && r.porActividad.caza;
      if (caza && caza.de && caza.puntos >= caza.de) unlockAchievement('cazador_verbos');
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
