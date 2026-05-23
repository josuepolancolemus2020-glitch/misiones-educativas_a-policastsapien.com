// ===================== MEMORY GAME =====================
const memEmojis = ['🧠', '⚡', '👁️', '👂', '🦴', '💊', '🔬', '🧬'];
let memCards = [], memFlipped = [], memMatched = 0, memMoves = 0, memBusy = false;

function buildMem() {
    memMatched = 0; memMoves = 0; memFlipped = []; memBusy = false;
    document.getElementById('memMoves').textContent = '0';
    document.getElementById('memMatched').textContent = '0 / ' + memEmojis.length;
    document.getElementById('fbMem').classList.remove('show');
    const pairs = _shuffle([...memEmojis, ...memEmojis]);
    const grid = document.getElementById('memGrid'); grid.innerHTML = '';
    memCards = [];
    pairs.forEach((em, i) => {
        const card = document.createElement('div'); card.className = 'mem-card'; card.dataset.idx = i; card.dataset.em = em;
        card.innerHTML = `<div class="mem-inner" id="mc${i}"><div class="mem-front">🧠</div><div class="mem-back">${em}</div></div>`;
        card.onclick = () => clickMem(i);
        grid.appendChild(card); memCards.push(card);
    });
}

function clickMem(idx) {
    if (memBusy) return;
    const inner = document.getElementById('mc' + idx);
    if (!inner || inner.classList.contains('mem-flipped') || inner.classList.contains('mem-matched')) return;
    sfx('click');
    inner.classList.add('mem-flipped');
    memFlipped.push(idx);
    if (memFlipped.length === 2) {
        memBusy = true; memMoves++;
        document.getElementById('memMoves').textContent = memMoves;
        const [a, b] = memFlipped;
        if (memCards[a].dataset.em === memCards[b].dataset.em) {
            document.getElementById('mc' + a).classList.add('mem-matched');
            document.getElementById('mc' + b).classList.add('mem-matched');
            memMatched++; memFlipped = []; memBusy = false;
            document.getElementById('memMatched').textContent = memMatched + ' / ' + memEmojis.length;
            sfx('ok');
            if (memMatched === memEmojis.length) { fb('fbMem', '¡Todas las parejas encontradas! 🎉', true); sfx('fan'); launchConfetti(); }
        } else {
            setTimeout(() => {
                document.getElementById('mc' + a).classList.remove('mem-flipped');
                document.getElementById('mc' + b).classList.remove('mem-flipped');
                memFlipped = []; memBusy = false; sfx('no');
            }, 900);
        }
    }
}

// ===================== SFX =====================
let sndOn = true;
const _AudioCtx = window.AudioContext || window.webkitAudioContext;
let _actx = null;
function _ac() { if (!_actx && _AudioCtx) _actx = new _AudioCtx(); return _actx; }
function sfx(t) {
    if (!sndOn) return;
    const ac = _ac(); if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.connect(g); g.connect(ac.destination);
    if (t === 'ok') { o.frequency.setValueAtTime(520, ac.currentTime); o.frequency.exponentialRampToValueAtTime(780, ac.currentTime + 0.12); g.gain.setValueAtTime(0.18, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.28); o.start(); o.stop(ac.currentTime + 0.28); }
    else if (t === 'no') { o.frequency.setValueAtTime(280, ac.currentTime); o.frequency.exponentialRampToValueAtTime(180, ac.currentTime + 0.18); g.gain.setValueAtTime(0.15, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.22); o.start(); o.stop(ac.currentTime + 0.22); }
    else if (t === 'click') { o.frequency.setValueAtTime(700, ac.currentTime); g.gain.setValueAtTime(0.08, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.07); o.start(); o.stop(ac.currentTime + 0.07); }
    else if (t === 'fan') { [600,700,800,900].forEach((f,i) => { const o2=ac.createOscillator(),g2=ac.createGain(); o2.connect(g2);g2.connect(ac.destination); o2.frequency.value=f; g2.gain.setValueAtTime(0.1,ac.currentTime+i*0.08); g2.gain.exponentialRampToValueAtTime(0.001,ac.currentTime+i*0.08+0.15); o2.start(ac.currentTime+i*0.08); o2.stop(ac.currentTime+i*0.08+0.15); }); }
    else if (t === 'flip') { o.type='sine'; o.frequency.setValueAtTime(400, ac.currentTime); o.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.1); g.gain.setValueAtTime(0.07, ac.currentTime); g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15); o.start(); o.stop(ac.currentTime + 0.15); }
}

// ===================== GLOBALS =====================
const SAVE_KEY = 'sist_nervioso_v1';
const TOTAL_SECTIONS = 11;
const MXP = 200;
let xp = 0;
let doneSecs = new Set();
let evalFormNum = 1;
let evalAnsVisible = false;
const xpTracker = { flash: new Set(), quiz: new Set(), clasif: new Set(), id: new Set(), cmp: new Set(), reto: new Set(), sopa: new Set() };

// ===================== XP / PROGRESS =====================
function pts(n) {
    xp = Math.min(xp + n, MXP + 50);
    updateXPBar();
    saveProgress();
    checkAch();
}

function fin(sec, award = true) {
    if (doneSecs.has(sec)) return;
    doneSecs.add(sec);
    if (award) { pts(0); }
    updateXPBar();
    saveProgress();
}

function getProgress() {
    return Math.min(100, Math.round((doneSecs.size / TOTAL_SECTIONS) * 100));
}

function updateXPBar() {
    const fill = document.getElementById('xpFill');
    const ptsEl = document.getElementById('xpPts');
    const lvlEl = document.getElementById('xpLvl');
    if (fill) fill.style.width = Math.min(100, (xp / MXP) * 100) + '%';
    if (ptsEl) ptsEl.textContent = '⭐ ' + xp;
    const lv = xp < 20 ? 1 : xp < 50 ? 2 : xp < 90 ? 3 : xp < 140 ? 4 : 5;
    if (lvlEl) lvlEl.textContent = 'Nivel ' + lv;
}

function saveProgress() {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ xp, done: [...doneSecs], evalFormNum, flash: [...xpTracker.flash], quiz: [...xpTracker.quiz], clasif: [...xpTracker.clasif], id: [...xpTracker.id], cmp: [...xpTracker.cmp], reto: [...xpTracker.reto], sopa: [...xpTracker.sopa], ach: unlockedAch }));
}

function loadProgress() {
    try {
        const d = JSON.parse(localStorage.getItem(SAVE_KEY) || '{}');
        if (d.xp) xp = d.xp;
        if (d.done) doneSecs = new Set(d.done);
        if (d.evalFormNum) evalFormNum = d.evalFormNum;
        if (d.flash) d.flash.forEach(v => xpTracker.flash.add(v));
        if (d.quiz) d.quiz.forEach(v => xpTracker.quiz.add(v));
        if (d.clasif) d.clasif.forEach(v => xpTracker.clasif.add(v));
        if (d.id) d.id.forEach(v => xpTracker.id.add(v));
        if (d.cmp) d.cmp.forEach(v => xpTracker.cmp.add(v));
        if (d.reto) d.reto.forEach(v => xpTracker.reto.add(v));
        if (d.sopa) d.sopa.forEach(v => xpTracker.sopa.add(v));
        if (d.ach) unlockedAch = d.ach;
    } catch (e) { /* ignore */ }
    updateXPBar();
}

function resetXP() {
    if (!confirm('¿Reiniciar todo el progreso de esta misión?')) return;
    localStorage.removeItem(SAVE_KEY);
    xp = 0; doneSecs = new Set(); evalFormNum = 1; unlockedAch = [];
    Object.keys(xpTracker).forEach(k => xpTracker[k].clear());
    updateXPBar(); renderAchPanel(); showToast('🔄 Progreso reiniciado');
}

// ===================== THEME / FONT / SOUND =====================
function initTheme() {
    const t = localStorage.getItem('snTheme');
    if (t) document.documentElement.setAttribute('data-theme', t);
    const s = localStorage.getItem('snSnd');
    if (s !== null) sndOn = s === '1';
    document.getElementById('sndBtn').textContent = sndOn ? '🔊 Sonido' : '🔇 Silencio';
    const l = localStorage.getItem('snLetra');
    if (l === '1') document.body.classList.add('letra-grande');
}

function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('snTheme', next);
    sfx('click');
}

function toggleSnd() {
    sndOn = !sndOn;
    localStorage.setItem('snSnd', sndOn ? '1' : '0');
    document.getElementById('sndBtn').textContent = sndOn ? '🔊 Sonido' : '🔇 Silencio';
}

function toggleLetra() {
    document.body.classList.toggle('letra-grande');
    localStorage.setItem('snLetra', document.body.classList.contains('letra-grande') ? '1' : '0');
    sfx('click');
}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS = {
    primer_quiz: { icon: '⚡', label: 'Primer impulso', req: 'Responde tu primera pregunta del quiz' },
    flash_master: { icon: '🃏', label: 'Maestro de flashcards', req: 'Voltea todas las flashcards' },
    clasif_pro: { icon: '🗂️', label: 'Clasificador pro', req: 'Completa la sección Clasifica' },
    id_master: { icon: '🔍', label: 'Identificador experto', req: 'Completa la sección Identifica' },
    reto_hero: { icon: '🏆', label: 'Héroe del reto', req: 'Completa todos los retos' },
    nivel3: { icon: '⭐', label: 'Nivel 3', req: 'Alcanza 60 XP' },
    nivel5: { icon: '🌟', label: 'Nivel 5', req: 'Alcanza 120 XP' },
};
let unlockedAch = [];

function checkAch() {
    const toCheck = [
        ['primer_quiz', xpTracker.quiz.size >= 1],
        ['flash_master', xpTracker.flash.size >= fcData.length],
        ['clasif_pro', xpTracker.clasif.size >= 1],
        ['id_master', xpTracker.id.size >= idData.length],
        ['reto_hero', xpTracker.reto.size >= retoPairs.length],
        ['nivel3', xp >= 60],
        ['nivel5', xp >= 120],
    ];
    toCheck.forEach(([id, cond]) => {
        if (cond && !unlockedAch.includes(id)) {
            unlockedAch.push(id);
            showToast(ACHIEVEMENTS[id].icon + ' ¡Logro desbloqueado: ' + ACHIEVEMENTS[id].label + '!');
            launchConfetti();
            renderAchPanel();
            saveProgress();
        }
    });
}

function renderAchPanel() {
    const list = document.getElementById('achList');
    if (!list) return;
    list.innerHTML = '';
    Object.entries(ACHIEVEMENTS).forEach(([id, ach]) => {
        const el = document.createElement('div');
        el.className = 'ach-item' + (unlockedAch.includes(id) ? '' : ' locked');
        el.innerHTML = `<span class="ach-icon">${ach.icon}</span><div><strong>${ach.label}</strong><br><small>${ach.req}</small></div>`;
        list.appendChild(el);
    });
}

function toggleAchPanel() {
    sfx('click');
    document.getElementById('achPanel').classList.toggle('open');
}

// ===================== CONFETTI =====================
function launchConfetti() {
    const colors = ['#6c5ce7', '#0984e3', '#00b894', '#fdcb6e', '#e84393', '#ff6b35'];
    for (let i = 0; i < 50; i++) {
        const el = document.createElement('div'); el.className = 'confetti-piece';
        el.style.left = Math.random() * 100 + 'vw';
        el.style.width = (6 + Math.random() * 8) + 'px';
        el.style.height = (6 + Math.random() * 8) + 'px';
        el.style.background = colors[Math.floor(Math.random() * colors.length)];
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        el.style.animationDuration = (1.5 + Math.random() * 2) + 's';
        el.style.animationDelay = Math.random() * 0.5 + 's';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3500);
    }
}

// ===================== TOAST =====================
let _toastT = null;
function showToast(msg) {
    const t = document.querySelector('.toast'); if (!t) return;
    t.textContent = msg; t.style.display = 'block';
    clearTimeout(_toastT); _toastT = setTimeout(() => { t.style.display = 'none'; }, 2500);
}

// ===================== FEEDBACK HELPER =====================
function fb(id, msg, ok) {
    const el = document.getElementById(id); if (!el) return;
    el.textContent = msg;
    el.className = 'fb show ' + (ok ? 'ok' : 'err');
}

// ===================== SHUFFLE =====================
function _shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
function _pick(arr, n) { return _shuffle([...arr]).slice(0, n); }

// ===================== NAVIGATION =====================
function go(sec) {
    sfx('click');
    document.querySelectorAll('.sec').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-t').forEach(b => { b.classList.remove('active'); if (b.dataset.s === sec) b.classList.add('active'); });
    const el = document.getElementById(sec);
    if (el) { el.classList.add('active'); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

function compartirMision() {
    const pct = _diplPct();
    const txt = `🧠 ¡Estoy aprendiendo sobre el Sistema Nervioso!\n📊 Progreso: ${pct}%\n⭐ XP: ${xp} de ${MXP}\n\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
    window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
}

// ===================== SIMULADOR — PARTES DEL SISTEMA NERVIOSO =====================
const sistemaInfo = [
    {
        name: 'Cerebro', emoji: '🧠', sub: 'Centro del pensamiento y la memoria',
        gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
        facts: [
            { h: '🔬 Función principal', p: 'Procesa información, genera pensamientos, almacena recuerdos y controla las emociones.' },
            { h: '⚡ Dato clave', p: 'Tiene aproximadamente 86 mil millones de neuronas y consume el 20% de la energía del cuerpo.' }
        ]
    },
    {
        name: 'Cerebelo', emoji: '🎯', sub: 'Coordinador del movimiento y equilibrio',
        gradient: 'linear-gradient(135deg, #0984e3, #74b9ff)',
        facts: [
            { h: '🔬 Función principal', p: 'Regula el equilibrio corporal y coordina los movimientos voluntarios para que sean precisos.' },
            { h: '⚡ Dato clave', p: 'Contiene más neuronas que el resto del cerebro. Sin él no podríamos caminar con equilibrio.' }
        ]
    },
    {
        name: 'Tronco Encefálico', emoji: '🌿', sub: 'Controlador de funciones vitales',
        gradient: 'linear-gradient(135deg, #00b894, #55efc4)',
        facts: [
            { h: '🔬 Función principal', p: 'Regula funciones vitales: respiración, latido cardíaco, presión arterial y ciclo del sueño.' },
            { h: '⚡ Dato clave', p: 'Conecta el encéfalo con la médula espinal y controla reflejos como la tos y el estornudo.' }
        ]
    },
    {
        name: 'Médula Espinal', emoji: '🦴', sub: 'Carretera del impulso nervioso',
        gradient: 'linear-gradient(135deg, #e84393, #fd79a8)',
        facts: [
            { h: '🔬 Función principal', p: 'Conduce impulsos entre el encéfalo y el resto del cuerpo. También coordina reflejos simples.' },
            { h: '⚡ Dato clave', p: 'Está protegida por la columna vertebral y las meninges. Tiene una longitud de unos 45 cm.' }
        ]
    },
    {
        name: 'Nervios Periféricos', emoji: '🕸️', sub: 'Red de comunicación del cuerpo',
        gradient: 'linear-gradient(135deg, #fa8231, #fdcb6e)',
        facts: [
            { h: '🔬 Función principal', p: 'Conectan el SNC con todos los órganos y tejidos del cuerpo, llevando señales sensoriales y motoras.' },
            { h: '⚡ Dato clave', p: 'El cuerpo humano tiene 43 pares de nervios periféricos: 12 pares craneales y 31 pares espinales.' }
        ]
    },
    {
        name: 'La Neurona', emoji: '⚡', sub: 'Unidad funcional del sistema nervioso',
        gradient: 'linear-gradient(135deg, #d63031, #ff7675)',
        facts: [
            { h: '🔬 Partes', p: 'Soma (cuerpo celular), axón (lleva el impulso) y dendritas (reciben señales de otras neuronas).' },
            { h: '⚡ Dato clave', p: 'El impulso nervioso viaja a una velocidad de hasta 120 m/s. La sinapsis es la unión entre neuronas.' }
        ]
    }
];
let sistActivo = 0;

function cambiarSistema(idx) {
    sfx('click');
    sistActivo = idx;
    const s = sistemaInfo[idx];
    document.getElementById('sn-pantalla').style.background = s.gradient;
    document.getElementById('sn-titulo').textContent = s.emoji + ' ' + s.name;
    document.getElementById('sn-subtitulo').textContent = s.sub;
    const el = document.getElementById('sn-info');
    el.classList.remove('anim-in'); void el.offsetWidth; el.classList.add('anim-in');
    document.getElementById('sn-box1').style.borderColor = s.gradient.match(/#[0-9a-f]{6}/i)?.[0] || '#6c5ce7';
    document.getElementById('sn-box2').style.borderColor = s.gradient.match(/#[0-9a-f]{6}/i)?.[1] || '#0984e3';
    document.getElementById('sn-h1').textContent = s.facts[0].h;
    document.getElementById('sn-p1').textContent = s.facts[0].p;
    document.getElementById('sn-h2').textContent = s.facts[1].h;
    document.getElementById('sn-p2').textContent = s.facts[1].p;
    document.querySelectorAll('.sim-btn').forEach((b, i) => b.classList.toggle('active', i === idx));
}

// ===================== FLASHCARDS =====================
const fcData = [
    { w: 'Sistema Nervioso', a: 'Red de comunicación del cuerpo que controla y coordina todas las funciones.' },
    { w: 'Neurona', a: 'Célula especializada que transmite impulsos nerviosos. Tiene soma, axón y dendritas.' },
    { w: 'Encéfalo', a: 'Parte del SNC dentro del cráneo. Formado por cerebro, cerebelo y tronco encefálico.' },
    { w: 'Cerebro', a: 'Mayor parte del encéfalo. Controla pensamiento, memoria, lenguaje y emociones.' },
    { w: 'Cerebelo', a: 'Regula el equilibrio y coordina los movimientos voluntarios del cuerpo.' },
    { w: 'Médula Espinal', a: 'Cordón nervioso que conecta el encéfalo con el cuerpo y coordina reflejos.' },
    { w: 'Impulso nervioso', a: 'Señal eléctrica que viaja a través de las neuronas a hasta 120 m/s.' },
    { w: 'Sinapsis', a: 'Conexión entre dos neuronas donde se transmite la señal nerviosa mediante neurotransmisores.' },
    { w: 'Receptores', a: 'Estructuras que captan estímulos del entorno (luz, sonido, tacto) y los convierten en señales.' },
    { w: 'Efectores', a: 'Músculos y glándulas que reciben órdenes del sistema nervioso y dan la respuesta.' },
    { w: 'Nervio', a: 'Haz de fibras nerviosas que conduce impulsos entre el SNC y los órganos.' },
    { w: 'Reflejo', a: 'Respuesta involuntaria e inmediata ante un estímulo. No requiere control consciente.' },
    { w: 'Meningitis', a: 'Inflamación de las meninges (membranas que protegen el encéfalo). Puede ser bacteriana o viral.' },
    { w: 'Alzheimer', a: 'Enfermedad neurodegenerativa que afecta la memoria y las funciones cognitivas. Prevalece en adultos mayores.' },
];
let fcIdx = 0, fcFlipped = false;

function upFC() {
    const front = document.getElementById('fcW');
    const back = document.getElementById('fcA');
    const ctr = document.getElementById('fcCtr');
    const inner = document.getElementById('fcInner');
    front.textContent = fcData[fcIdx].w;
    back.textContent = fcData[fcIdx].a;
    ctr.textContent = (fcIdx + 1) + ' / ' + fcData.length;
    fcFlipped = false;
    inner.classList.remove('flipped');
    if (!xpTracker.flash.has(fcIdx)) {
        xpTracker.flash.add(fcIdx);
        pts(2);
        if (xpTracker.flash.size === fcData.length) { fb('fbFlash', '¡Todas las tarjetas estudiadas! +2 XP c/u 🌟', true); sfx('fan'); launchConfetti(); fin('s-flash'); }
        else fb('fbFlash', '+2 XP — Tarjeta ' + (fcIdx + 1) + ' completada', true);
    }
}

function flipCard() { sfx('flip'); document.getElementById('fcInner').classList.toggle('flipped'); fcFlipped = !fcFlipped; }
function nextFC() { sfx('click'); fcIdx = (fcIdx + 1) % fcData.length; upFC(); }
function prevFC() { sfx('click'); fcIdx = (fcIdx - 1 + fcData.length) % fcData.length; upFC(); }

// ===================== QUIZ =====================
const qzData = [
    { q: '¿Cuál es la función principal del sistema nervioso?', o: ['Bombear la sangre', 'Controlar y coordinar las funciones del cuerpo', 'Digerir los alimentos', 'Filtrar el aire'], c: 1 },
    { q: '¿Cómo se llama la célula especializada del sistema nervioso?', o: ['Glóbulo rojo', 'Neurona', 'Epitelio', 'Fibra muscular'], c: 1 },
    { q: '¿Qué parte del encéfalo regula el equilibrio y coordina movimientos?', o: ['Cerebro', 'Tronco encefálico', 'Cerebelo', 'Médula espinal'], c: 2 },
    { q: '¿Cómo se llama la señal eléctrica que viaja por las neuronas?', o: ['Sinapsis', 'Reflejo', 'Impulso nervioso', 'Estímulo'], c: 2 },
    { q: '¿Qué es la sinapsis?', o: ['Un tipo de neurona', 'La conexión entre dos neuronas', 'El soma de la neurona', 'Un reflejo automático'], c: 1 },
    { q: '¿Cómo se llaman los órganos que responden al impulso nervioso?', o: ['Receptores', 'Efectores', 'Neuronas motoras', 'Ganglios'], c: 1 },
    { q: '¿Qué estructura protege la médula espinal?', o: ['Las meninges únicamente', 'El cráneo', 'La columna vertebral', 'Los nervios periféricos'], c: 2 },
    { q: '¿Qué es un reflejo?', o: ['Una respuesta voluntaria', 'Una señal enviada al cerebro', 'Una respuesta involuntaria e inmediata', 'Un tipo de sinapsis'], c: 2 },
    { q: '¿Qué enfermedad neurodegenerativa afecta la memoria en adultos mayores?', o: ['Meningitis', 'Epilepsia', 'Parkinson', 'Alzheimer'], c: 3 },
];
let qzIdx = 0, qzSel = -1;

function buildQz() {
    qzIdx = 0; qzSel = -1;
    showQz();
}

function showQz() {
    const q = qzData[qzIdx];
    document.getElementById('qzProg').textContent = 'Pregunta ' + (qzIdx + 1) + ' de ' + qzData.length;
    document.getElementById('qzQ').textContent = q.q;
    const opts = document.getElementById('qzOpts'); opts.innerHTML = '';
    q.o.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'qz-opt'; btn.textContent = opt;
        btn.onclick = () => { qzSel = i; document.querySelectorAll('.qz-opt').forEach(b => b.classList.remove('sel')); btn.classList.add('sel'); sfx('click'); };
        opts.appendChild(btn);
    });
    document.getElementById('fbQz').classList.remove('show');
    qzSel = -1;
}

function checkQz() {
    if (qzSel < 0) { fb('fbQz', 'Selecciona una opción primero.', false); return; }
    const q = qzData[qzIdx];
    const opts = document.querySelectorAll('.qz-opt');
    opts.forEach((b, i) => {
        b.disabled = true;
        if (i === q.c) b.classList.add('ok');
        else if (i === qzSel && i !== q.c) b.classList.add('err');
    });
    if (qzSel === q.c) {
        fb('fbQz', '¡Correcto! +5 XP', true); sfx('ok');
        if (!xpTracker.quiz.has(qzIdx)) { xpTracker.quiz.add(qzIdx); pts(5); }
        if (xpTracker.quiz.size === qzData.length) { fin('s-quiz'); launchConfetti(); }
    } else {
        fb('fbQz', '❌ Incorrecto. La respuesta es: ' + q.o[q.c], false); sfx('no');
    }
    setTimeout(() => {
        if (qzIdx < qzData.length - 1) { qzIdx++; showQz(); }
        else showToast('🎉 ¡Quiz completado!');
    }, 1800);
}

function resetQz() { sfx('click'); buildQz(); document.getElementById('fbQz').classList.remove('show'); }

// ===================== CLASIFICAR =====================
const classGroups = [
    {
        title: 'SNC vs SNP', a: 'Sistema Nervioso Central', b: 'Sistema Nervioso Periférico',
        left: ['Cerebro', 'Cerebelo', 'Tronco encefálico', 'Médula espinal'],
        right: ['Nervios sensoriales', 'Nervios motores', 'Ganglios nerviosos', 'Nervios autónomos']
    },
    {
        title: 'Neurona sensorial vs Neurona motora', a: 'Neurona sensorial', b: 'Neurona motora',
        left: ['Capta estímulos', 'Lleva info al SNC', 'Conecta receptores', 'Parte aferente'],
        right: ['Lleva respuestas', 'Sale del SNC', 'Activa músculos', 'Parte eferente']
    },
    {
        title: 'Funciones del cerebro vs Cerebelo', a: 'Funciones del cerebro', b: 'Funciones del cerebelo',
        left: ['Pensamiento', 'Memoria', 'Lenguaje', 'Emociones'],
        right: ['Equilibrio', 'Coordinación', 'Postura', 'Movimientos finos']
    },
    {
        title: 'Enfermedades vs Cuidados del SN', a: 'Enfermedades', b: 'Cuidados',
        left: ['Meningitis', 'Alzheimer', 'Epilepsia', 'Parkinson'],
        right: ['Dormir bien', 'Usar casco', 'Hidratarse', 'Evitar toxinas']
    }
];
let classGIdx = 0, classBankSel = null;

function buildClass() {
    classBankSel = null;
    const g = classGroups[classGIdx];
    document.getElementById('col-left-head').textContent = g.a;
    document.getElementById('col-right-head').textContent = g.b;
    document.getElementById('items-left').innerHTML = '';
    document.getElementById('items-right').innerHTML = '';
    document.getElementById('fbCls').classList.remove('show');
    const bank = document.getElementById('clsBank'); bank.innerHTML = '';
    _shuffle([...g.left, ...g.right]).forEach(w => {
        const ch = document.createElement('div'); ch.className = 'bank-chip'; ch.textContent = w;
        ch.onclick = () => selectBankChip(ch);
        bank.appendChild(ch);
    });
}

function selectBankChip(chip) {
    if (chip.classList.contains('placed')) return;
    sfx('click');
    document.querySelectorAll('.bank-chip').forEach(c => c.classList.remove('sel'));
    classBankSel = chip;
    chip.classList.add('sel');
}

function dropInCol(side) {
    if (!classBankSel) { showToast('Selecciona una palabra primero'); return; }
    sfx('click');
    const g = classGroups[classGIdx];
    const word = classBankSel.textContent;
    const colEl = document.getElementById('items-' + side);
    const item = document.createElement('div'); item.className = 'drop-item'; item.textContent = word; item.dataset.word = word; item.dataset.side = side;
    item.onclick = () => returnToBank(item);
    colEl.appendChild(item);
    classBankSel.classList.add('placed');
    classBankSel = null;
    document.querySelectorAll('.bank-chip').forEach(c => c.classList.remove('sel'));
}

function returnToBank(item) {
    sfx('click');
    const chip = [...document.querySelectorAll('.bank-chip')].find(c => c.textContent === item.dataset.word);
    if (chip) chip.classList.remove('placed', 'sel');
    item.remove();
}

function checkClass() {
    const g = classGroups[classGIdx];
    const leftItems = [...document.querySelectorAll('#items-left .drop-item')];
    const rightItems = [...document.querySelectorAll('#items-right .drop-item')];
    if (leftItems.length + rightItems.length < g.left.length + g.right.length) { fb('fbCls', 'Faltan palabras por clasificar.', false); sfx('no'); return; }
    let allOk = true;
    leftItems.forEach(el => {
        const ok = g.left.includes(el.dataset.word);
        el.classList.toggle('ok', ok); el.classList.toggle('err', !ok);
        if (!ok) allOk = false;
    });
    rightItems.forEach(el => {
        const ok = g.right.includes(el.dataset.word);
        el.classList.toggle('ok', ok); el.classList.toggle('err', !ok);
        if (!ok) allOk = false;
    });
    if (allOk) {
        fb('fbCls', '¡Clasificación correcta! +5 XP', true); sfx('ok'); launchConfetti();
        if (!xpTracker.clasif.has(classGIdx)) { xpTracker.clasif.add(classGIdx); pts(5); }
        fin('s-clasifica');
    } else { fb('fbCls', 'Algunas palabras están en la columna incorrecta.', false); sfx('no'); }
}

function nextClassGroup() { sfx('click'); classGIdx = (classGIdx + 1) % classGroups.length; buildClass(); }
function resetClass() { sfx('click'); buildClass(); }

// ===================== IDENTIFICAR =====================
const idData = [
    { s: 'El <strong data-k="cerebro">cerebro</strong> procesa información y almacena recuerdos.', key: 'cerebro', label: 'Cerebro' },
    { s: 'La <strong data-k="neurona">neurona</strong> es la célula especializada que transmite impulsos nerviosos.', key: 'neurona', label: 'Neurona' },
    { s: 'El <strong data-k="impulso nervioso">impulso nervioso</strong> es una señal eléctrica que viaja por las neuronas.', key: 'impulso nervioso', label: 'Impulso nervioso' },
    { s: 'La <strong data-k="sinapsis">sinapsis</strong> es la conexión entre dos neuronas para transmitir la señal.', key: 'sinapsis', label: 'Sinapsis' },
    { s: 'Los <strong data-k="receptores">receptores</strong> captan estímulos como la luz, el sonido y el tacto.', key: 'receptores', label: 'Receptores' },
    { s: 'Los <strong data-k="efectores">efectores</strong> son los músculos y glándulas que dan la respuesta nerviosa.', key: 'efectores', label: 'Efectores' },
    { s: 'La <strong data-k="médula espinal">médula espinal</strong> conduce impulsos entre el cerebro y el cuerpo.', key: 'médula espinal', label: 'Médula espinal' },
    { s: 'El <strong data-k="reflejo">reflejo</strong> es una respuesta rápida e involuntaria ante un estímulo.', key: 'reflejo', label: 'Reflejo' },
];
let idIdx = 0, idSolved = new Set();

function showId() {
    const item = idData[idIdx];
    document.getElementById('idProg').textContent = 'Oración ' + (idIdx + 1) + ' de ' + idData.length;
    const sent = document.getElementById('idSent');
    sent.innerHTML = item.s;
    sent.querySelectorAll('[data-k]').forEach(kw => {
        kw.addEventListener('click', () => pickId(kw, item));
    });
    document.getElementById('idInfo').textContent = '';
    document.getElementById('fbId').classList.remove('show');
}

function pickId(el, item) {
    if (el.classList.contains('id-ok')) return;
    if (el.dataset.k === item.key) {
        el.classList.add('id-ok'); sfx('ok');
        document.getElementById('idInfo').textContent = '✅ ¡Correcto! ' + item.label;
        fb('fbId', '¡Correcto! +5 XP', true);
        if (!xpTracker.id.has(idIdx)) { xpTracker.id.add(idIdx); pts(5); }
        if (xpTracker.id.size === idData.length) { fin('s-identifica'); launchConfetti(); }
        setTimeout(() => { if (idIdx < idData.length - 1) { idIdx++; showId(); } else showToast('🎉 ¡Todos los conceptos identificados!'); }, 1200);
    } else {
        el.classList.add('id-err'); sfx('no');
        setTimeout(() => el.classList.remove('id-err'), 700);
        fb('fbId', 'Toca la palabra clave correcta.', false);
    }
}

// ===================== COMPLETAR =====================
const cmpData = [
    { s: 'La ___ es la unidad funcional del sistema nervioso.', opts: ['sinapsis', 'neurona', 'dendrita'], ans: 'neurona' },
    { s: 'El cerebelo regula el ___ y coordina movimientos.', opts: ['pensamiento', 'equilibrio', 'lenguaje'], ans: 'equilibrio' },
    { s: 'La ___ es la conexión entre dos neuronas.', opts: ['sinapsis', 'axón', 'médula'], ans: 'sinapsis' },
    { s: 'Los ___ captan estímulos del entorno.', opts: ['efectores', 'nervios', 'receptores'], ans: 'receptores' },
    { s: 'El tronco encefálico regula funciones como la ___.', opts: ['memoria', 'respiración', 'coordinación'], ans: 'respiración' },
    { s: 'La médula espinal está protegida por la ___.', opts: ['meningitis', 'columna vertebral', 'neurona'], ans: 'columna vertebral' },
    { s: 'Un ___ es una respuesta rápida e involuntaria ante un estímulo.', opts: ['impulso', 'reflejo', 'sinapsis'], ans: 'reflejo' },
    { s: 'El Alzheimer es una enfermedad que afecta principalmente la ___.', opts: ['respiración', 'coordinación', 'memoria'], ans: 'memoria' },
];
let cmpIdx = 0, cmpSel = '';

function showCmp() {
    const item = cmpData[cmpIdx];
    document.getElementById('cmpProg').textContent = 'Oración ' + (cmpIdx + 1) + ' de ' + cmpData.length;
    const filled = item.s.replace('___', `<span class="cmp-blank" id="cmpBlank">${cmpSel || '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'}</span>`);
    document.getElementById('cmpSent').innerHTML = filled;
    const opts = document.getElementById('cmpOpts'); opts.innerHTML = '';
    item.opts.forEach(opt => {
        const btn = document.createElement('button'); btn.className = 'cmp-opt'; btn.textContent = opt;
        btn.onclick = () => { cmpSel = opt; document.querySelectorAll('.cmp-opt').forEach(b => b.classList.remove('sel')); btn.classList.add('sel'); document.getElementById('cmpBlank').textContent = opt; sfx('click'); };
        opts.appendChild(btn);
    });
    document.getElementById('fbCmp').classList.remove('show');
    cmpSel = '';
}

function checkCmp() {
    if (!cmpSel) { fb('fbCmp', 'Selecciona una opción primero.', false); return; }
    const item = cmpData[cmpIdx];
    if (cmpSel === item.ans) {
        fb('fbCmp', '¡Correcto! +5 XP', true); sfx('ok');
        if (!xpTracker.cmp.has(cmpIdx)) { xpTracker.cmp.add(cmpIdx); pts(5); }
        if (xpTracker.cmp.size === cmpData.length) { fin('s-completa'); launchConfetti(); }
        setTimeout(() => { if (cmpIdx < cmpData.length - 1) { cmpIdx++; cmpSel = ''; showCmp(); } else showToast('🎉 ¡Todas las oraciones completadas!'); }, 1200);
    } else { fb('fbCmp', '❌ Incorrecto. Intenta de nuevo.', false); sfx('no'); }
}

function resetCmp() { sfx('click'); cmpIdx = 0; cmpSel = ''; showCmp(); }

// ===================== RETO =====================
const retoPairs = [
    {
        title: 'Sistema Nervioso Central vs Periférico',
        a: 'SNC', b: 'SNP',
        aItems: ['Cerebro', 'Cerebelo', 'Médula espinal', 'Tronco encefálico'],
        bItems: ['Nervios sensoriales', 'Nervios motores', 'Ganglio nervioso', 'Nervio autónomo']
    },
    {
        title: 'Función sensorial vs Función motora',
        a: 'Función sensorial', b: 'Función motora',
        aItems: ['Capta estímulos', 'Recibe información', 'Lleva señal al SNC', 'Parte aferente'],
        bItems: ['Da respuestas', 'Envía órdenes', 'Sale del SNC', 'Activa efectores']
    },
    {
        title: 'Enfermedades vs Cuidados del SN',
        a: 'Enfermedades', b: 'Cuidados',
        aItems: ['Meningitis', 'Alzheimer', 'Epilepsia', 'Parkinson'],
        bItems: ['Usar casco', 'Dormir bien', 'Hidratarse', 'Evitar tóxicos']
    }
];
let retoIdx = 0;

function updateRetoButtons() {
    document.querySelectorAll('.reto-pair-btn').forEach((btn, i) => {
        btn.classList.remove('active', 'done');
        if (xpTracker.reto.has(i)) btn.classList.add('done');
        else if (i === retoIdx) btn.classList.add('active');
    });
}

function selectReto(idx) {
    sfx('click'); retoIdx = idx;
    buildReto(); updateRetoButtons();
}

function buildReto() {
    const p = retoPairs[retoIdx];
    const inner = document.getElementById('retoInner');
    const backA = document.getElementById('retoBackA');
    const backB = document.getElementById('retoBackB');
    document.getElementById('retoLabel').textContent = '🏆 Reto: ' + p.title;
    document.getElementById('retoTerm').textContent = '¿Cuáles pertenecen a cada grupo?';
    document.getElementById('retoZoneAHead').textContent = p.a;
    document.getElementById('retoZoneBHead').textContent = p.b;
    backA.innerHTML = '<h5>' + p.a + '</h5><ul class="reto-items">' + p.aItems.map(i => '<li>' + i + '</li>').join('') + '</ul>';
    backB.innerHTML = '<h5>' + p.b + '</h5><ul class="reto-items">' + p.bItems.map(i => '<li>' + i + '</li>').join('') + '</ul>';
    inner.classList.remove('reto-flipped');
    document.getElementById('fbReto').classList.remove('show');
}

function flipReto() {
    sfx('flip');
    document.getElementById('retoInner').classList.toggle('reto-flipped');
}

function submitReto() {
    sfx('ok'); launchConfetti();
    if (!xpTracker.reto.has(retoIdx)) {
        xpTracker.reto.add(retoIdx); pts(5);
        if (xpTracker.reto.size === retoPairs.length) { fin('s-reto'); showToast('🏆 ¡Todos los retos superados!'); }
    }
    fb('fbReto', '¡Reto completado! +5 XP', true);
    updateRetoButtons();
}

// ===================== TASK GENERATOR =====================
const identifyTaskDB = [
    { s: 'El cerebro procesa la información y almacena recuerdos.', type: 'Cerebro' },
    { s: 'La neurona transmite impulsos nerviosos mediante sinapsis.', type: 'Neurona' },
    { s: 'El cerebelo coordina los movimientos y regula el equilibrio.', type: 'Cerebelo' },
    { s: 'La médula espinal conduce señales entre el cerebro y el cuerpo.', type: 'Médula espinal' },
    { s: 'Los receptores captan estímulos del ambiente como luz y sonido.', type: 'Receptores' },
    { s: 'Los efectores son músculos y glándulas que responden a las órdenes nerviosas.', type: 'Efectores' },
    { s: 'La sinapsis es la unión entre dos neuronas para transmitir señales.', type: 'Sinapsis' },
    { s: 'Un reflejo es una respuesta rápida e involuntaria del sistema nervioso.', type: 'Reflejo' },
];

const classifyTaskDB = [
    { w: 'Cerebro', cat: 'SNC', func: 'Pensamiento y memoria' },
    { w: 'Cerebelo', cat: 'SNC', func: 'Equilibrio y coordinación' },
    { w: 'Médula espinal', cat: 'SNC', func: 'Conducción de impulsos' },
    { w: 'Nervios sensoriales', cat: 'SNP', func: 'Llevan señales al SNC' },
    { w: 'Nervios motores', cat: 'SNP', func: 'Llevan respuestas del SNC' },
    { w: 'Meningitis', cat: 'Enfermedad', func: 'Inflamación de meninges' },
    { w: 'Alzheimer', cat: 'Enfermedad', func: 'Afecta la memoria' },
    { w: 'Usar casco', cat: 'Cuidado', func: 'Protege la cabeza' },
];

const completeTaskDB = [
    { s: 'La ___ es la célula del sistema nervioso.', opts: ['sinapsis', 'neurona', 'epitelio'], ans: 'neurona' },
    { s: 'El ___ regula el equilibrio y coordina movimientos.', opts: ['cerebro', 'cerebelo', 'nervio'], ans: 'cerebelo' },
    { s: 'La señal eléctrica en las neuronas se llama ___.', opts: ['sinapsis', 'reflejo', 'impulso nervioso'], ans: 'impulso nervioso' },
    { s: 'Los ___ captan estímulos del entorno.', opts: ['efectores', 'receptores', 'ganglios'], ans: 'receptores' },
    { s: 'La ___ es la conexión entre dos neuronas.', opts: ['axón', 'sinapsis', 'dendrita'], ans: 'sinapsis' },
    { s: 'Un ___ es una respuesta involuntaria inmediata.', opts: ['impulso', 'reflejo', 'receptor'], ans: 'reflejo' },
    { s: 'El ___ controla funciones vitales como la respiración.', opts: ['cerebro', 'cerebelo', 'tronco encefálico'], ans: 'tronco encefálico' },
    { s: 'El Alzheimer afecta principalmente la ___.', opts: ['coordinación', 'memoria', 'respiración'], ans: 'memoria' },
];

const explainQuestions = [
    { q: '¿Cuáles son las partes del sistema nervioso central?', ans: 'Encéfalo (cerebro, cerebelo, tronco encefálico) y médula espinal.' },
    { q: '¿Qué diferencia hay entre receptores y efectores?', ans: 'Receptores: captan estímulos. Efectores: músculos y glándulas que dan la respuesta.' },
    { q: '¿Qué es una sinapsis y por qué es importante?', ans: 'Conexión entre dos neuronas que permite transmitir el impulso nervioso.' },
    { q: '¿Cómo podemos cuidar nuestro sistema nervioso?', ans: 'Dormir bien, usar casco, hidratarse, alimentarse bien, evitar tóxicos.' },
    { q: '¿Qué diferencia hay entre un impulso nervioso y un reflejo?', ans: 'El impulso es la señal eléctrica; el reflejo es la respuesta involuntaria que genera.' },
];
let tgAnsVisible = false;

function genTask() {
    sfx('click');
    const type = document.getElementById('tgType').value;
    const count = parseInt(document.getElementById('tgCount').value);
    tgAnsVisible = false;
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
    _instrBlock(out, 'Instrucción', ['Copia en tu cuaderno; identifica el concepto del sistema nervioso en cada oración.', '<strong>Ejemplo:</strong> El cerebro procesa información → <span style="color:var(--jade);font-weight:700;">Cerebro</span>']);
    _pick(identifyTaskDB, Math.min(count, identifyTaskDB.length)).forEach((item, i) => {
        const div = document.createElement('div'); div.className = 'tg-task';
        div.innerHTML = `<div class="tg-task-num">${i + 1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
        out.appendChild(div);
    });
}

function genClassifyTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia la siguiente tabla en tu cuaderno. Para cada elemento, escribe su categoría y función.']);
    const items = _pick(classifyTaskDB, Math.min(count, classifyTaskDB.length));
    const wrap = document.createElement('div'); wrap.style.overflowX = 'auto';
    let html = `<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:400px;"><thead><tr style="background:var(--pri-gl);"><th style="padding:0.3rem 0.4rem;border:1px solid var(--border);text-align:left;">Elemento</th><th style="padding:0.3rem;border:1px solid var(--border);text-align:center;">Categoría</th><th style="padding:0.3rem;border:1px solid var(--border);text-align:center;">Función</th></tr></thead><tbody>`;
    items.forEach(it => { html += `<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td><td style="padding:0.4rem;border:1px solid var(--border);min-width:80px;"></td><td style="padding:0.4rem;border:1px solid var(--border);min-width:80px;"></td></tr>`; });
    html += '</tbody></table>';
    wrap.innerHTML = html; out.appendChild(wrap);
    const ans = document.createElement('div'); ans.className = 'tg-answer'; ans.style.marginTop = '0.8rem';
    ans.innerHTML = '<strong>✅ Respuestas:</strong><br>' + items.map(it => `<strong>${it.w}:</strong> ${it.cat} | ${it.func}`).join('<br>');
    out.appendChild(ans);
}

function genCompleteTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia y resuelve en tu cuaderno. Cada oración tiene un espacio ___. Elige la opción correcta.']);
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

function toggleAns() { tgAnsVisible = !tgAnsVisible; document.querySelectorAll('.tg-answer').forEach(el => el.style.display = tgAnsVisible ? 'block' : 'none'); sfx('click'); }

// ===================== SOPA DE LETRAS =====================
const sopaWordLists = [
    { words: ['NEURONA', 'CEREBRO', 'CEREBELO', 'MEDULA', 'AXON', 'DENDRITA', 'NERVIO', 'SINAPSIS'] },
    { words: ['IMPULSO', 'RECEPTOR', 'EFECTOR', 'ENCEFALO', 'SENSORIAL', 'MOTORA', 'REFLEJO'] },
    { words: ['MENINGITIS', 'ALZHEIMER', 'EPILEPSIA', 'CASCO', 'DESCANSO', 'MIELINA'] },
];

let currentSopaSetIdx = 0, sopaFoundWords = new Set(), currentSopaSet = null;
let sopaFirstClickCell = null, sopaPointerStartCell = null, sopaPointerMoved = false, sopaSelectedCells = [];

function generateSopaGrid(words) {
    const SIZE = 10;
    const DIRS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    const LETTERS = 'ABCDEFGHIJLMNOPRSTUVWXZ';
    const g = Array.from({ length: SIZE }, () => Array(SIZE).fill(''));
    const placed = [];
    for (const word of words) {
        let ok = false;
        const dirs = _shuffle([...DIRS]);
        for (let t = 0; t < 200 && !ok; t++) {
            const [dr, dc] = dirs[t % dirs.length];
            const r = Math.floor(Math.random() * SIZE);
            const c = Math.floor(Math.random() * SIZE);
            const cells = []; let fits = true;
            for (let i = 0; i < word.length; i++) {
                const nr = r + dr * i, nc = c + dc * i;
                if (nr < 0 || nr >= SIZE || nc < 0 || nc >= SIZE) { fits = false; break; }
                if (g[nr][nc] !== '' && g[nr][nc] !== word[i]) { fits = false; break; }
                cells.push([nr, nc]);
            }
            if (fits) { cells.forEach(([nr, nc], i) => g[nr][nc] = word[i]); placed.push({ w: word, cells }); ok = true; }
        }
        if (!ok) {
            outer: for (let r2 = 0; r2 < SIZE; r2++) {
                for (let c2 = 0; c2 <= SIZE - word.length; c2++) {
                    const cells = []; let fits = true;
                    for (let i = 0; i < word.length; i++) {
                        if (g[r2][c2 + i] !== '' && g[r2][c2 + i] !== word[i]) { fits = false; break; }
                        cells.push([r2, c2 + i]);
                    }
                    if (fits) { cells.forEach(([nr, nc], i) => g[nr][nc] = word[i]); placed.push({ w: word, cells }); ok = true; break outer; }
                }
            }
        }
    }
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++)
        if (!g[r][c]) g[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    return { size: SIZE, grid: g, words: placed };
}

function getSopaCellSize() {
    const container = document.getElementById('sopaGrid');
    if (!container || !container.parentElement) return 28;
    const avail = container.parentElement.clientWidth - 16;
    const sz = (currentSopaSet || { size: 10 }).size;
    return Math.max(20, Math.min(32, Math.floor(avail / sz)));
}

function _renderSopaGrid() {
    if (!currentSopaSet) return;
    const set = currentSopaSet;
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
        if (set.words.find(w => sopaFoundWords.has(w.w) && w.cells.some(([wr, wc]) => wr === r && wc === c)))
            cell.classList.add('sopa-found');
        grid.appendChild(cell);
    }
    setupSopaEvents();
    const wl = document.getElementById('sopaWords'); wl.innerHTML = '';
    set.words.forEach(wObj => {
        const sp = document.createElement('span'); sp.className = 'sopa-w' + (sopaFoundWords.has(wObj.w) ? ' found' : '');
        sp.id = 'sw-' + wObj.w; sp.textContent = wObj.w; wl.appendChild(sp);
    });
}

function buildSopa() {
    sopaFoundWords = new Set();
    currentSopaSet = generateSopaGrid(sopaWordLists[currentSopaSetIdx].words);
    _renderSopaGrid();
}

function setupSopaEvents() {
    const grid = document.getElementById('sopaGrid');
    grid.onpointerdown = e => { const cell = e.target.closest('.sopa-cell'); if (!cell) return; e.preventDefault(); grid.setPointerCapture(e.pointerId); sopaPointerStartCell = cell; sopaPointerMoved = false; cell.classList.add('sopa-sel'); sopaSelectedCells = [cell]; };
    grid.onpointermove = e => { if (!sopaPointerStartCell) return; e.preventDefault(); const el = document.elementFromPoint(e.clientX, e.clientY); const cell = el ? el.closest('.sopa-cell') : null; if (!cell) return; const sr = parseInt(sopaPointerStartCell.dataset.row), sc = parseInt(sopaPointerStartCell.dataset.col); const er = parseInt(cell.dataset.row), ec = parseInt(cell.dataset.col); if (sr !== er || sc !== ec) sopaPointerMoved = true; document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c => c.classList.remove('sopa-sel')); sopaSelectedCells = []; getSopaPath(sr, sc, er, ec).forEach(([r, c]) => { const pc = document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if (pc) { pc.classList.add('sopa-sel'); sopaSelectedCells.push(pc); } }); };
    grid.onpointerup = e => { if (!sopaPointerStartCell) return; e.preventDefault(); grid.releasePointerCapture(e.pointerId); if (sopaPointerMoved && sopaSelectedCells.length > 1) { checkSopaSelection(); } else { const cell = sopaPointerStartCell; document.querySelectorAll('.sopa-cell.sopa-sel').forEach(c => c.classList.remove('sopa-sel')); sopaSelectedCells = []; if (!sopaFirstClickCell) { sopaFirstClickCell = cell; cell.classList.add('sopa-start'); } else if (sopaFirstClickCell === cell) { cell.classList.remove('sopa-start'); sopaFirstClickCell = null; } else { const sr = parseInt(sopaFirstClickCell.dataset.row), sc = parseInt(sopaFirstClickCell.dataset.col); const er = parseInt(cell.dataset.row), ec = parseInt(cell.dataset.col); sopaFirstClickCell.classList.remove('sopa-start'); sopaFirstClickCell = null; getSopaPath(sr, sc, er, ec).forEach(([r, c]) => { const pc = document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if (pc) { pc.classList.add('sopa-sel'); sopaSelectedCells.push(pc); } }); checkSopaSelection(); } } sopaPointerStartCell = null; sopaPointerMoved = false; };
}

function getSopaPath(r1, c1, r2, c2) { const dr = Math.sign(r2 - r1), dc = Math.sign(c2 - c1); const lr = Math.abs(r2 - r1), lc = Math.abs(c2 - c1); if (lr !== 0 && lc !== 0 && lr !== lc) return [[r1, c1]]; const len = Math.max(lr, lc); const path = []; for (let i = 0; i <= len; i++) path.push([r1 + dr * i, c1 + dc * i]); return path; }

function checkSopaSelection() {
    if (!currentSopaSet) return;
    const set = currentSopaSet;
    const word = sopaSelectedCells.map(c => c.textContent).join('');
    const wordRev = word.split('').reverse().join('');
    const found = set.words.find(wObj => !sopaFoundWords.has(wObj.w) && (wObj.w === word || wObj.w === wordRev));
    if (found) {
        sopaFoundWords.add(found.w);
        found.cells.forEach(([r, c]) => { const cell = document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`); if (cell) { cell.classList.remove('sopa-sel', 'sopa-start', 'sopa-flash'); cell.classList.add('sopa-found'); } });
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
    sfx('click');
    currentSopaSetIdx = (currentSopaSetIdx + 1) % sopaWordLists.length;
    buildSopa();
    showToast('🔄 Nueva sopa cargada');
}

function sopaFlashlight() {
    if (!currentSopaSet) { showToast('⚠️ La sopa aún se está generando'); return; }
    sfx('click');
    const flashCells = [];
    currentSopaSet.words.forEach(wObj => {
        if (!sopaFoundWords.has(wObj.w)) {
            wObj.cells.forEach(([r, c]) => {
                const el = document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
                if (el && !el.classList.contains('sopa-found')) { el.classList.add('sopa-flash'); flashCells.push(el); }
            });
        }
    });
    setTimeout(() => flashCells.forEach(el => el.classList.remove('sopa-flash')), 1450);
}

let _sopaResizeTimer = null;
window.addEventListener('resize', () => { clearTimeout(_sopaResizeTimer); _sopaResizeTimer = setTimeout(() => { if (document.getElementById('s-sopa').classList.contains('active')) _renderSopaGrid(); }, 200); });

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank = [
    { q: 'La neurona es la célula básica del sistema nervioso.', a: true },
    { q: 'El cerebelo controla el pensamiento y el lenguaje.', a: false },
    { q: 'El impulso nervioso es una señal eléctrica.', a: true },
    { q: 'La sinapsis es la unión entre dos neuronas.', a: true },
    { q: 'Los receptores envían respuestas a los músculos.', a: false },
    { q: 'La médula espinal está protegida por la columna vertebral.', a: true },
    { q: 'El sistema nervioso central incluye el cerebro y el cerebelo.', a: true },
    { q: 'Los efectores captan estímulos del ambiente.', a: false },
    { q: 'El reflejo es una respuesta voluntaria.', a: false },
    { q: 'El Alzheimer afecta principalmente la memoria.', a: true },
    { q: 'La meningitis es una inflamación de las meninges.', a: true },
    { q: 'El axón conduce el impulso hacia otras neuronas.', a: true },
    { q: 'Las dendritas llevan el impulso fuera de la neurona.', a: false },
    { q: 'El tronco encefálico regula funciones vitales.', a: true },
    { q: 'El SNP incluye todos los nervios fuera del encéfalo y médula.', a: true },
];

const evalMCBank = [
    { q: '¿Cuál es la unidad funcional del sistema nervioso?', o: ['a) Glóbulo rojo', 'b) Epitelio', 'c) Neurona', 'd) Fibra muscular'], a: 2 },
    { q: '¿Qué parte del SNC regula el equilibrio?', o: ['a) Cerebro', 'b) Cerebelo', 'c) Médula espinal', 'd) Tronco encefálico'], a: 1 },
    { q: '¿Cómo se llama la señal eléctrica en las neuronas?', o: ['a) Sinapsis', 'b) Reflejo', 'c) Impulso nervioso', 'd) Estímulo'], a: 2 },
    { q: '¿Qué son los efectores?', o: ['a) Receptores de luz', 'b) Músculos y glándulas', 'c) Tipos de neuronas', 'd) Partes del encéfalo'], a: 1 },
    { q: '¿Qué estructura protege la médula espinal?', o: ['a) Las meninges únicamente', 'b) El cráneo', 'c) La columna vertebral', 'd) Los ganglios'], a: 2 },
    { q: '¿Qué enfermedad afecta la memoria en adultos mayores?', o: ['a) Meningitis', 'b) Epilepsia', 'c) Parkinson', 'd) Alzheimer'], a: 3 },
    { q: '¿Qué es la sinapsis?', o: ['a) Una neurona motora', 'b) La unión entre dos neuronas', 'c) Una parte del axón', 'd) Un reflejo'], a: 1 },
    { q: '¿Qué parte del encéfalo controla el lenguaje?', o: ['a) Cerebro', 'b) Cerebelo', 'c) Tronco encefálico', 'd) Médula espinal'], a: 0 },
    { q: '¿Cómo se llama la parte de la neurona que conduce el impulso?', o: ['a) Soma', 'b) Dendrita', 'c) Axón', 'd) Sinapsis'], a: 2 },
    { q: '¿Qué enfermedad inflama las meninges?', o: ['a) Meningitis', 'b) Alzheimer', 'c) Epilepsia', 'd) Parkinson'], a: 0 },
    { q: '¿Cuáles son las partes del SNC?', o: ['a) Solo el cerebro', 'b) Cerebro, cerebelo, tronco y médula', 'c) Nervios periféricos', 'd) Ganglios y receptores'], a: 1 },
    { q: '¿Qué hace el tronco encefálico?', o: ['a) Almacena recuerdos', 'b) Coordina movimientos', 'c) Regula funciones vitales', 'd) Capta estímulos'], a: 2 },
    { q: 'Un reflejo es:', o: ['a) Una respuesta involuntaria automática', 'b) Una señal al cerebro', 'c) Un tipo de sinapsis', 'd) Una parte de la neurona'], a: 0 },
    { q: '¿Qué parte de la neurona recibe señales?', o: ['a) Axón', 'b) Dendritas', 'c) Soma únicamente', 'd) Mielina'], a: 1 },
    { q: '¿Cuál parte del encéfalo coordina movimientos finos?', o: ['a) Cerebro', 'b) Cerebelo', 'c) Tronco encefálico', 'd) Médula espinal'], a: 1 },
];

const evalCPBank = [
    { q: 'La ___ es la célula del sistema nervioso.', a: 'neurona' },
    { q: 'El cerebelo regula el ___.', a: 'equilibrio' },
    { q: 'La señal eléctrica en las neuronas se llama ___.', a: 'impulso nervioso' },
    { q: 'La ___ es la conexión entre dos neuronas.', a: 'sinapsis' },
    { q: 'Los ___ captan estímulos del entorno.', a: 'receptores' },
    { q: 'Los ___ responden al impulso nervioso.', a: 'efectores' },
    { q: 'La médula espinal está en la columna ___.', a: 'vertebral' },
    { q: 'El ___ controla funciones vitales como la respiración.', a: 'tronco encefálico' },
    { q: 'El ___ es una enfermedad que afecta la memoria.', a: 'Alzheimer' },
    { q: 'La meningitis inflama las ___ del encéfalo.', a: 'meninges' },
    { q: 'El ___ es la parte larga de la neurona que conduce impulsos.', a: 'axón' },
    { q: 'Las ___ reciben señales de otras neuronas.', a: 'dendritas' },
    { q: 'Un ___ es una respuesta rápida e involuntaria.', a: 'reflejo' },
    { q: 'El SNC incluye el encéfalo y la médula ___.', a: 'espinal' },
    { q: 'El sistema nervioso controla y coordina el ___.', a: 'cuerpo' },
];

const evalPRBank = [
    { term: 'Neurona', def: 'Unidad funcional del sistema nervioso' },
    { term: 'Cerebro', def: 'Centro del pensamiento y la memoria' },
    { term: 'Cerebelo', def: 'Regula el equilibrio y coordina movimientos' },
    { term: 'Médula espinal', def: 'Conduce impulsos entre el cerebro y el cuerpo' },
    { term: 'Sinapsis', def: 'Conexión entre dos neuronas' },
    { term: 'Impulso nervioso', def: 'Señal eléctrica que viaja por las neuronas' },
    { term: 'Receptores', def: 'Captan estímulos del entorno' },
    { term: 'Efectores', def: 'Músculos y glándulas que dan la respuesta' },
    { term: 'Reflejo', def: 'Respuesta involuntaria e inmediata' },
    { term: 'Alzheimer', def: 'Enfermedad que afecta la memoria' },
    { term: 'Meningitis', def: 'Inflamación de las meninges' },
    { term: 'Axón', def: 'Parte de la neurona que conduce el impulso' },
    { term: 'Dendritas', def: 'Reciben señales de otras neuronas' },
    { term: 'Tronco encefálico', def: 'Controla funciones vitales' },
    { term: 'SNP', def: 'Red de nervios fuera del encéfalo y médula' },
];

function genEval() {
    sfx('click');
    const cf = evalFormNum;
    window._currentEvalForm = cf;
    evalFormNum = (evalFormNum % 10) + 1;
    saveProgress();
    document.getElementById('eval-screen-title').textContent = `📝 Evaluación Final — Forma ${cf} · El Sistema Nervioso`;
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
    const el = document.getElementById(id); if (!el) return;
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

    const doc = `<!DOCTYPE html><html lang="es"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Evaluación El Sistema Nervioso · Forma ${forma}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial,Helvetica,sans-serif;font-size:12pt;color:#111;background:#fff;padding:2mm 6mm;}
.ph{margin-bottom:0.55rem;}
.ph h2{font-size:12pt;font-weight:700;text-align:center;margin-bottom:0.4rem;}
.ph-line{display:flex;align-items:baseline;gap:5px;margin-bottom:5px;}
.ph-fill{flex:1;border-bottom:1px solid #555;min-height:13px;display:block;}
.ph-m{display:inline-block;min-width:80px;border-bottom:1px solid #555;}
.ph-s{display:inline-block;min-width:52px;border-bottom:1px solid #555;}
.ph-xs{display:inline-block;min-width:36px;border-bottom:1px solid #555;}
.ph-crit{font-size:10.5pt;text-align:center;color:#555;margin-top:0.2rem;}
.sec-title{font-size:11pt;font-weight:700;padding:0.2rem 0.48rem;margin:0.38rem 0 0.17rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #6c5ce7;background:#ede9ff;color:#6c5ce7;}
.obt-row{display:flex;align-items:baseline;gap:4px;font-size:10pt;font-weight:700;font-style:italic;color:#6c5ce7;}
.obt-lbl{white-space:nowrap;}
.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #6c5ce7;height:13px;}
.obt-pct{white-space:nowrap;}
.qn{font-weight:700;min-width:22px;flex-shrink:0;}
.tf-row{display:flex;align-items:baseline;gap:0.3rem;font-size:11pt;line-height:1.4;padding:0.22rem 0.25rem;border-bottom:1px solid #eee;}
.tf-blank{display:inline-block;min-width:40px;border-bottom:1.5px solid #111;flex-shrink:0;margin:0 0.18rem;}
.tf-text{flex:1;}
.mc-item{border:1px solid #ddd;border-radius:4px;padding:0.22rem 0.42rem;margin-bottom:0.17rem;break-inside:avoid;page-break-inside:avoid;}
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
.pr-item{font-size:11pt;padding:0.2rem 0.35rem;background:#ede9ff;border-radius:3px;margin-bottom:0.14rem;display:flex;align-items:center;gap:0.2rem;line-height:1.28;break-inside:avoid;page-break-inside:avoid;}
.pr-num{font-weight:700;color:#6c5ce7;min-width:19px;flex-shrink:0;}
.pr-line{display:inline-block;min-width:19px;border-bottom:1.5px solid #111;margin-right:0.14rem;flex-shrink:0;}
.total-row{display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:12pt;font-weight:700;font-style:italic;margin-top:0.42rem;padding:0.28rem 0;page-break-before:avoid;break-before:avoid;color:#6c5ce7;}
.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #6c5ce7;}
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
.pn{font-weight:700;width:16px;color:#555;}.pa{color:#6c5ce7;font-weight:600;}
.forma-tag{position:fixed;bottom:5mm;right:6mm;font-size:7pt;color:#555;border:1px solid #bbb;padding:1px 5px;border-radius:3px;background:white;}
@media print{@page{size:letter portrait;margin:12.7mm;}}
</style></head><body>
<div class="ph">
  <h2>Evaluación Final · Misión El Sistema Nervioso · CC.NN.</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Instituto:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
<div class="pauta-wrap">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · Misión El Sistema Nervioso · Forma ${forma}</div>
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
function _diplPct() { return xp >= MXP ? 100 : Math.round((xp / MXP) * 100); }

function openDiploma() {
    sfx('click');
    const pct = _diplPct();
    document.getElementById('diplPct').textContent = pct + '%';
    document.getElementById('diplPct').style.color = pct >= 70 ? 'var(--jade)' : pct >= 40 ? 'var(--blue)' : 'var(--amber)';
    document.getElementById('diplBar').style.width = pct + '%';
    const stars = pct === 100 ? '⭐⭐⭐⭐⭐' : pct >= 80 ? '⭐⭐⭐⭐' : pct >= 60 ? '⭐⭐⭐' : pct >= 40 ? '⭐⭐' : '⭐';
    document.getElementById('diplStars').textContent = stars;
    const msgs = [
        '🚀 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!',
        '🌱 ¡GRAN INICIO! Estás dando los primeros pasos.',
        '📚 ¡BUEN TRABAJO! Vas progresando muy bien.',
        '💪 ¡MUY BIEN! Dominas gran parte del contenido.',
        '🌟 ¡INCREÍBLE avance! Estás cerca de la excelencia.',
        '🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en el Sistema Nervioso!'
    ];
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
    const txt = `${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: El Sistema Nervioso\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText ? '\n\n🏅 Logros desbloqueados:\n' + achText : ''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo M.E.T.A.S\n🌐 policastsapien.com`;
    window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
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
    cambiarSistema(0);
    upFC(); buildQz(); buildClass(); showId(); showCmp(); buildSopa(); genEval();
    buildMem();
    updateRetoButtons(); buildReto();
    renderAchPanel();
    document.addEventListener('click', function (e) {
        const panel = document.getElementById('achPanel');
        const btn = document.getElementById('achBtn');
        if (panel.classList.contains('open') && !panel.contains(e.target) && e.target !== btn) panel.classList.remove('open');
    });
    document.addEventListener('click', function (e) {
        if (e.target === document.getElementById('diplomaOverlay')) closeDiploma();
    });
    const savedName = localStorage.getItem('nombreEstudianteSN');
    const inputName = document.querySelector('.diploma-input');
    if (savedName && inputName) { inputName.value = savedName; updateDiplomaName(savedName); }
    if (inputName) inputName.addEventListener('input', e => localStorage.setItem('nombreEstudianteSN', e.target.value));
    fin('s-aprende', false);
    fin('s-tipos', false);
});
