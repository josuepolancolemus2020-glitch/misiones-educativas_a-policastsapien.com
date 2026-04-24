const memoEmojis = ['🦕', '🦖', '🦣', '🐚', '🌋', '🐟', '🦎', '🌳'];
let memoCards = [];
let flippedCards = [];
let memoPairsFound = 0;
let memoTries = 0;
let memoLock = false;

function initMemory() {
    const grid = document.getElementById('memoGrid');
    grid.innerHTML = '';
    memoCards = _shuffle([...memoEmojis, ...memoEmojis]);
    memoPairsFound = 0;
    memoTries = 0;
    memoLock = false;
    flippedCards = [];

    document.getElementById('memoPairs').textContent = `0 / ${memoEmojis.length}`;
    document.getElementById('memoTries').textContent = '0';
    document.getElementById('fbMemo').classList.remove('show');

    memoCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memo-card';
        card.dataset.index = index;
        card.dataset.emoji = emoji;
        card.innerHTML = `
                <div class="memo-inner">
                    <div class="memo-front"></div>
                    <div class="memo-back">${emoji}</div>
                </div>
            `;
        card.onclick = () => flipMemoCard(card);
        grid.appendChild(card);
    });
    if (typeof sfx === 'function') sfx('click');
}

function flipMemoCard(card) {
    if (memoLock || card.classList.contains('flipped') || card.classList.contains('matched')) return;

    card.classList.add('flipped');
    flippedCards.push(card);
    if (typeof sfx === 'function') sfx('flip');

    if (flippedCards.length === 2) {
        memoTries++;
        document.getElementById('memoTries').textContent = memoTries;
        checkMemoMatch();
    }
}

function checkMemoMatch() {
    memoLock = true;
    const [c1, c2] = flippedCards;
    const isMatch = c1.dataset.emoji === c2.dataset.emoji;

    if (isMatch) {
        memoPairsFound++;
        document.getElementById('memoPairs').textContent = `${memoPairsFound} / ${memoEmojis.length}`;
        c1.classList.add('matched');
        c2.classList.add('matched');
        flippedCards = [];
        memoLock = false;
        if (typeof sfx === 'function') sfx('ok');

        if (memoPairsFound === memoEmojis.length) {
            setTimeout(winMemory, 500);
        }
    } else {
        setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            flippedCards = [];
            memoLock = false;
            if (typeof sfx === 'function') sfx('no');
        }, 1000);
    }
}

function winMemory() {
    if (typeof sfx === 'function') sfx('fan');
    fb('fbMemo', '¡Excelente memoria! Has encontrado todos los pares. +15 XP', true);
    if (!xpTracker.memoWin) {
        xpTracker.memoWin = true;
        if (typeof pts === 'function') pts(15);
    }
    if (typeof fin === 'function') fin('s-memoria');
    if (typeof launchConfetti === 'function') launchConfetti();
}

window.addEventListener('DOMContentLoaded', () => {
    initMemory();
    xpTracker.memoWin = false;
});
// ===================== ACCESIBILIDAD: LETRA GRANDE =====================
function toggleLetra() {
    document.body.classList.toggle('letra-grande');
    if (typeof sfx === 'function') sfx('click');
    const on = document.body.classList.contains('letra-grande');
    localStorage.setItem('preferenciaLetra', on);
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
const SAVE_KEY = 'eras_geo_v3';
let xp = 0, MXP = 200, done = new Set(), evalAnsVisible = false;
let evalFormNum = 1;
let unlockedAch = [];
let darkMode = false;
let prevLevel = 0;
const TOTAL_SECTIONS = 13;

const xpTracker = {
    fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(),
    cmp: new Set(), reto: new Set(), sopa: new Set(),
    asim: new Set(),
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
        if (s.xp !== undefined) { xp = s.xp; updateXPBar(); }
    } catch (e) { }
}

// ===================== ACHIEVEMENTS =====================
const ACHIEVEMENTS = {
    primer_quiz: { icon: '🧠', label: 'Primera prueba superada' },
    flash_master: { icon: '🃏', label: 'Todos los fósiles de memoria vistos' },
    clasif_pro: { icon: '🗂️', label: 'Clasificador de estratos experto' },
    id_master: { icon: '🔍', label: 'Identificador de eras maestro' },
    reto_hero: { icon: '🏆', label: 'Héroe del reto asteroide' },
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
    const colors = ['#2d98da', '#20bf6b', '#fa8231', '#fdcb6e', '#6c5ce7'];
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
    if (id === 's-sopa') { setTimeout(() => { if (currentSopaSet) _renderSopaGrid(); else buildSopa(); }, 50); }
}

// ===================== SIMULADOR INTERACTIVO =====================
const erasInfo = [
    {
        titulo: 'Era Precámbrica', tiempo: '4,600 – 540 Millones de años',
        bg: 'linear-gradient(135deg, #ff4e50, #f9d423)', bc1: '#ff4e50', bc2: '#f9d423',
        imgUrl: 'descriptivas-img/era-precambrica_edit.webp',
        imgTexto: 'Observa la ilustración: El planeta era una inmensa bola volcánica. La corteza terrestre aún se estaba formando entre erupciones de lava. Las primeras formas de vida, bacterias simples, surgieron en esos océanos primitivos.',
        desc: 'La era más larga de la historia. El planeta era una inmensa bola volcánica cubierta de lava. Los primeros océanos se formaron y en ellos surgieron las primeras formas de vida: bacterias simples y organismos unicelulares. La atmósfera no tenía oxígeno.',
        h1: '🔬 Vida principal', p1: 'Bacterias y organismos unicelulares simples. No existía vida en tierra firme.',
        h2: '🌎 Evento clave', p2: 'Formación de la Tierra, los océanos y una atmósfera sin oxígeno (tóxica).'
    },
    {
        titulo: 'Era Paleozoica', tiempo: '540 – 250 Millones de años',
        bg: 'linear-gradient(135deg, #1cb5e0, #000046)', bc1: '#1cb5e0', bc2: '#000046',
        imgUrl: 'descriptivas-img/era-paleozoica_edit.webp',
        imgTexto: 'Conocida como "Vida Antigua". Observa el fondo oceánico: El animal con caparazón en la arena es un Trilobite, el rey de los mares de esa época. También puedes ver a los primeros vertebrados: peces primitivos.',
        desc: 'Conocida como «Vida Antigua». Los mares se llenaron de vida: trilobites, primeros peces y vertebrados. Luego surgieron anfibios y reptiles. Al final ocurrió la peor extinción masiva: desapareció el 90% de las especies (Extinción del Pérmico).',
        h1: '🦐 Fósil Guía', p1: 'Los Trilobites dominaron los mares. Surgieron los primeros peces y anfibios.',
        h2: '💥 Extinción', p2: 'Terminó con la extinción del Pérmico, donde desapareció el 90% de las especies.'
    },
    {
        titulo: 'Era Mesozoica', tiempo: '250 – 66 Millones de años',
        bg: 'linear-gradient(135deg, #56ab2f, #a8e063)', bc1: '#56ab2f', bc2: '#a8e063',
        imgUrl: 'descriptivas-img/era-mesozoica_edit.webp',
        imgTexto: 'La "Era de los Dinosaurios". Fíjate en la imagen: un imponente T-Rex camina por una selva, mientras que en el cielo vuela un Pterodactyl (reptil volador). Al final, aparecen las primeras aves.',
        desc: 'La «Era de los Dinosaurios». Enormes reptiles dominaron tierra, mar y aire. Existía un supercontinente llamado Pangea que se fragmentó. Aparecieron las primeras aves y plantas con flores. Terminó con el impacto de un meteorito gigante.',
        h1: '🦕 Dominio', p1: 'Dinosaurios terrestres, reptiles voladores y marinos. Aparecen plantas con flores.',
        h2: '🌍 Supercontinente', p2: 'Pangea se fragmentó. Terminó de golpe con el impacto de un meteorito gigante.'
    },
    {
        titulo: 'Era Cenozoica', tiempo: '66 – 2.6 Millones de años',
        bg: 'linear-gradient(135deg, #fa709a, #fee140)', bc1: '#fa709a', bc2: '#f39c12',
        imgUrl: 'descriptivas-img/era-cenozoica_edit.webp',
        imgTexto: 'Tras la extinción de los dinosaurios, los mamíferos tomaron el control. En la ilustración destacan grandes mamíferos peludos como el Mamut y depredadores temibles como el Tigre dientes de sable.',
        desc: 'Tras la extinción de los dinosaurios, los mamíferos tomaron el control y crecieron a tamaños gigantes: mamuts, tigres dientes de sable, megaterios. Las aves se diversificaron y los continentes adoptaron posiciones cercanas a las actuales.',
        h1: '🐅 Nuevos Reyes', p1: 'Mamíferos gigantes dominaron: mamuts, tigres dientes de sable, megaterios.',
        h2: '🦅 Evolución', p2: 'Aves y mamíferos ocuparon los espacios que dejaron libres los dinosaurios.'
    },
    {
        titulo: 'Era Cuaternaria', tiempo: '2.6 M.a. – Actualidad',
        bg: 'linear-gradient(135deg, #8fd3f4, #84fab0)', bc1: '#3498db', bc2: '#2ecc71',
        imgUrl: 'descriptivas-img/era-cuaternaria_edit.webp',
        imgTexto: '¡Nuestra era! La imagen muestra las características Edades de Hielo (glaciaciones) cubriendo las montañas. Lo más importante: los primeros humanos (Homo sapiens) descubren el fuego.',
        desc: '¡Nuestra era! Ocurrieron grandes Edades de Hielo (glaciaciones) que cubrieron enormes áreas con hielo. Lo más importante: apareció el Homo sapiens, descubrió el fuego, inventó herramientas, creó la agricultura y desarrolló la civilización.',
        h1: '🧑 Ser Humano', p1: 'Aparición y desarrollo de nuestra especie (Homo sapiens) y la civilización.',
        h2: '❄️ Glaciaciones', p2: 'Ocurrieron grandes Edades de Hielo que obligaron a humanos y animales a adaptarse.'
    }
];

function cambiarEra(idx) {
    sfx('click');
    document.querySelectorAll('.sim-btn').forEach((btn, i) => btn.classList.toggle('active', i === idx));
    const d = erasInfo[idx];
    const imgBox = document.getElementById('era-img-box');
    const b1 = document.getElementById('era-box1'), b2 = document.getElementById('era-box2');
    imgBox.classList.remove('anim-in'); b1.classList.remove('anim-in'); b2.classList.remove('anim-in');
    setTimeout(() => {
        document.getElementById('era-pantalla').style.background = d.bg;
        document.getElementById('era-titulo').textContent = d.titulo;
        document.getElementById('era-tiempo').textContent = d.tiempo;
        document.getElementById('era-desc').textContent = d.desc;
        document.getElementById('era-img').src = d.imgUrl;
        document.getElementById('era-img-texto').textContent = d.imgTexto;
        document.getElementById('era-h1').textContent = d.h1; document.getElementById('era-p1').textContent = d.p1;
        document.getElementById('era-h2').textContent = d.h2; document.getElementById('era-p2').textContent = d.p2;
        b1.style.borderColor = d.bc1; b2.style.borderColor = d.bc2;
        void imgBox.offsetWidth;
        imgBox.classList.add('anim-in'); b1.classList.add('anim-in'); b2.classList.add('anim-in');
    }, 100);
}

// ===================== FLASHCARD DATA =====================
const fcData = [
    { w: 'Era Precámbrica', a: '🌋 La era más larga. <strong>Primeras bacterias</strong> y formación de los océanos. Atmósfera sin oxígeno.' },
    { w: 'Era Paleozoica', a: '🐚 «Vida Antigua». <strong>Trilobites</strong>, primeros peces, anfibios y reptiles. Extinción del Pérmico.' },
    { w: 'Era Mesozoica', a: '🦖 Era de los <strong>Dinosaurios</strong>. Pangea se fragmenta. Primeras aves y flores.' },
    { w: 'Era Cenozoica', a: '🐘 Dominio de los <strong>Mamíferos gigantes</strong>: mamuts, tigres dientes de sable.' },
    { w: 'Era Cuaternaria', a: '🧑 <strong>Edad de Hielo</strong> y aparición del <strong>ser humano</strong> (Homo sapiens).' },
    { w: 'Pangea', a: '🌍 <strong>Supercontinente</strong> que existía en la era Mesozoica y se dividió en los continentes actuales.' },
    { w: 'Trilobite', a: '🦐 <strong>Artrópodo marino</strong> que dominó los océanos paleozoicos. Es el fósil guía de esa era.' },
    { w: 'Meteorito', a: '☄️ Impactó la Tierra hace <strong>66 millones de años</strong> y causó la extinción de los dinosaurios.' },
    { w: 'Extinción del Pérmico', a: '☠️ La <strong>peor extinción</strong> de la historia: desapareció el <strong>90%</strong> de las especies.' },
    { w: 'Glaciación', a: '❄️ Período de frío extremo con enormes capas de hielo. Ocurrieron en la era <strong>Cuaternaria</strong>.' },
    { w: 'Homo sapiens', a: '🧠 Nuestra especie. Apareció en la era <strong>Cuaternaria</strong>, descubrió el fuego y creó civilización.' },
    { w: 'Mamut', a: '🐘 Mamífero gigante y peludo de la era <strong>Cenozoica</strong>. Se extinguió durante las glaciaciones.' },
    { w: 'Fósil', a: '🦴 Resto de un ser vivo <strong>conservado en roca</strong>. Nos cuenta la historia de la vida en la Tierra.' },
    { w: 'Dinosaurio', a: '🦕 Reptil gigante que dominó la Tierra en la era <strong>Mesozoica</strong> durante 185 millones de años.' },
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
    { q: '¿Cuál es la era geológica más larga de la historia de la Tierra?', o: ['a) Paleozoica', 'b) Mesozoica', 'c) Precámbrica', 'd) Cuaternaria'], c: 2 },
    { q: '¿En qué era vivieron los dinosaurios?', o: ['a) Precámbrica', 'b) Paleozoica', 'c) Mesozoica', 'd) Cenozoica'], c: 2 },
    { q: '¿Qué fue Pangea?', o: ['a) Un océano antiguo', 'b) Un supercontinente', 'c) Un fósil gigante', 'd) Una glaciación'], c: 1 },
    { q: '¿Qué animal es el fósil guía de la era Paleozoica?', o: ['a) Dinosaurio', 'b) Mamut', 'c) Trilobite', 'd) Tigre dientes de sable'], c: 2 },
    { q: '¿Qué causó la extinción de los dinosaurios?', o: ['a) Una glaciación', 'b) Un terremoto', 'c) Un meteorito', 'd) Una erupción volcánica'], c: 2 },
    { q: '¿En qué era apareció el ser humano (Homo sapiens)?', o: ['a) Mesozoica', 'b) Cenozoica', 'c) Cuaternaria', 'd) Paleozoica'], c: 2 },
    { q: '¿Qué tipo de animales dominaron la era Cenozoica?', o: ['a) Reptiles marinos', 'b) Mamíferos gigantes', 'c) Bacterias', 'd) Dinosaurios'], c: 1 },
    { q: '¿Qué evento climático caracteriza la era Cuaternaria?', o: ['a) Erupciones volcánicas', 'b) Formación de océanos', 'c) Edad de Hielo', 'd) Lluvia ácida'], c: 2 },
    { q: 'La extinción del Pérmico acabó con el ___ de las especies:', o: ['a) 50%', 'b) 70%', 'c) 90%', 'd) 100%'], c: 2 },
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
    if (qzDone) return;
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
function resetQz() { sfx('click'); qzIdx = 0; qzSel = -1; qzDone = false; showQz(); document.getElementById('fbQz').classList.remove('show'); }

// ===================== CLASIFICACIÓN =====================
const classGroups = [
    {
        label: ['Paleozoica', 'Mesozoica'], headA: '🐚 Paleozoica', headB: '🦖 Mesozoica', colA: 'p', colB: 'm',
        words: [{ w: 'Trilobites', t: 'p' }, { w: 'Dinosaurios', t: 'm' }, { w: 'Vida marina', t: 'p' }, { w: 'Pangea se fragmenta', t: 'm' }, { w: 'Peces primitivos', t: 'p' }, { w: 'Meteorito', t: 'm' }, { w: 'Primeros anfibios', t: 'p' }, { w: 'Primeras aves', t: 'm' }, { w: 'Extinción del Pérmico', t: 'p' }, { w: 'Plantas con flores', t: 'm' }]
    },
    {
        label: ['Precámbrica', 'Cenozoica'], headA: '🌋 Precámbrica', headB: '🐘 Cenozoica', colA: 'pr', colB: 'c',
        words: [{ w: 'Bacterias', t: 'pr' }, { w: 'Mamuts', t: 'c' }, { w: 'Océanos nacen', t: 'pr' }, { w: 'Tigre dientes de sable', t: 'c' }, { w: 'Planeta de lava', t: 'pr' }, { w: 'Aves modernas', t: 'c' }, { w: 'Sin oxígeno', t: 'pr' }, { w: 'Megaterio', t: 'c' }, { w: 'Organismos unicelulares', t: 'pr' }, { w: 'Diversificación de aves', t: 'c' }]
    },
    {
        label: ['Cenozoica', 'Cuaternaria'], headA: '🐘 Cenozoica', headB: '🧑 Cuaternaria', colA: 'ce', colB: 'cu',
        words: [{ w: 'Mamut lanudo', t: 'ce' }, { w: 'Homo sapiens', t: 'cu' }, { w: 'Aves gigantes', t: 'ce' }, { w: 'Edad de Hielo', t: 'cu' }, { w: 'Tigre dientes de sable', t: 'ce' }, { w: 'Descubrimiento del fuego', t: 'cu' }, { w: 'Mamíferos dominan', t: 'ce' }, { w: 'Agricultura', t: 'cu' }, { w: 'Megaterio', t: 'ce' }, { w: 'Glaciaciones', t: 'cu' }]
    },
    {
        label: ['Era antigua', 'Era reciente'], headA: '🕰️ Antigua (Pre+Paleo)', headB: '🆕 Reciente (Ceno+Cuat)', colA: 'ant', colB: 'rec',
        words: [{ w: 'Bacterias', t: 'ant' }, { w: 'Ser humano', t: 'rec' }, { w: 'Trilobites', t: 'ant' }, { w: 'Mamuts', t: 'rec' }, { w: 'Sin oxígeno', t: 'ant' }, { w: 'Glaciaciones', t: 'rec' }, { w: 'Primeros peces', t: 'ant' }, { w: 'Civilización', t: 'rec' }, { w: 'Volcanes primigenios', t: 'ant' }, { w: 'Diversificación de aves', t: 'rec' }]
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
    { s: ['En', 'esta', 'era', 'se', 'formó', 'la', 'Tierra.'], c: 6, art: 'Busca la palabra clave → Precámbrica (Tierra)' },
    { s: ['Los', 'dinosaurios', 'dominaron', 'el', 'planeta.'], c: 1, art: 'Busca la palabra clave → Mesozoica' },
    { s: ['Dominaron', 'los', 'mamíferos', 'gigantes', 'como', 'el', 'mamut.'], c: 3, art: 'Busca el adjetivo clave → Cenozoica' },
    { s: ['El', 'ser', 'humano', 'apareció', 'y', 'creó', 'el', 'fuego.'], c: 2, art: 'Busca la palabra clave → Cuaternaria' },
    { s: ['Los', 'trilobites', 'reinaron', 'en', 'los', 'mares.'], c: 1, art: 'Busca el animal → Paleozoica' },
    { s: ['Pangea', 'se', 'fragmentó', 'en', 'varios', 'continentes.'], c: 0, art: 'Busca el supercontinente → Mesozoica' },
    { s: ['Las', 'glaciaciones', 'cubrieron', 'todo', 'de', 'hielo.'], c: 1, art: 'Busca el evento climático → Cuaternaria' },
    { s: ['Las', 'bacterias', 'fueron', 'los', 'primeros', 'seres', 'vivos.'], c: 1, art: 'Busca la forma de vida → Precámbrica' },
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
    document.getElementById('idInfo').textContent = d.art;
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
        span.classList.add('id-no'); fb('fbId', 'Esa no es la palabra clave.', false); sfx('no');
    }
}
function nextId() { sfx('click'); idIdx++; showId(); document.getElementById('fbId').classList.remove('show'); }
function resetId() { sfx('click'); idIdx = 0; showId(); document.getElementById('fbId').classList.remove('show'); }

// ===================== COMPLETA =====================
const cmpData = [
    { s: 'Los ___ vivieron en la era Mesozoica.', opts: ['mamuts', 'dinosaurios', 'humanos'], c: 1 },
    { s: 'El fósil guía de la era Paleozoica es el ___.', opts: ['trilobite', 'T-Rex', 'mamut'], c: 0 },
    { s: 'La Edad de ___ ocurrió en la era Cuaternaria.', opts: ['Fuego', 'Hielo', 'Piedra'], c: 1 },
    { s: 'Las primeras ___ surgieron en la era Precámbrica.', opts: ['plantas', 'bacterias', 'aves'], c: 1 },
    { s: '___ era el supercontinente del Mesozoico.', opts: ['Laurasia', 'Gondwana', 'Pangea'], c: 2 },
    { s: 'Los mamíferos ___ dominaron la era Cenozoica.', opts: ['pequeños', 'gigantes', 'marinos'], c: 1 },
    { s: 'El ser humano apareció en la era ___.', opts: ['Mesozoica', 'Cenozoica', 'Cuaternaria'], c: 2 },
    { s: 'Un ___ causó la extinción de los dinosaurios.', opts: ['volcán', 'meteorito', 'terremoto'], c: 1 },
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
    if (cmpDone) return;
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
        fb('fbCmp', 'Incorrecto. Revisa la respuesta.', false); sfx('no');
    }
    setTimeout(() => { cmpIdx++; document.getElementById('fbCmp').classList.remove('show'); showCmp(); }, 1600);
}
function resetCmp() { sfx('click'); cmpIdx = 0; cmpSel = -1; cmpDone = false; showCmp(); document.getElementById('fbCmp').classList.remove('show'); }

// ===================== RETO FINAL =====================
const retoPairs = [
    {
        label: ['Paleozoica', 'Mesozoica'], btnA: '🐚 Paleozoica', btnB: '🦖 Mesozoica',
        colA: 'p', colB: 'm',
        words: [{ w: 'Trilobites', t: 'p' }, { w: 'Dinosaurios', t: 'm' }, { w: 'Vida marina', t: 'p' }, { w: 'Meteorito', t: 'm' },
        { w: 'Primeros peces', t: 'p' }, { w: 'Pangea', t: 'm' }, { w: 'Anfibios', t: 'p' }, { w: 'Primeras aves', t: 'm' },
        { w: 'Extinción del Pérmico', t: 'p' }, { w: 'Plantas con flores', t: 'm' }]
    },
    {
        label: ['Cenozoica', 'Cuaternaria'], btnA: '🐘 Cenozoica', btnB: '🧑 Cuaternaria',
        colA: 'c', colB: 'q',
        words: [{ w: 'Mamuts', t: 'c' }, { w: 'Ser humano', t: 'q' }, { w: 'Aves gigantes', t: 'c' }, { w: 'Edad de Hielo', t: 'q' },
        { w: 'Tigre dientes de sable', t: 'c' }, { w: 'Agricultura', t: 'q' }, { w: 'Megaterio', t: 'c' }, { w: 'Fuego', t: 'q' },
        { w: 'Diversificación aves', t: 'c' }, { w: 'Glaciaciones', t: 'q' }]
    },
    {
        label: ['Precámbrica', 'Cuaternaria'], btnA: '🌋 Precámbrica', btnB: '🧑 Cuaternaria',
        colA: 'pr', colB: 'cu',
        words: [{ w: 'Bacterias', t: 'pr' }, { w: 'Homo sapiens', t: 'cu' }, { w: 'Sin oxígeno', t: 'pr' }, { w: 'Civilización', t: 'cu' },
        { w: 'Volcanes', t: 'pr' }, { w: 'Glaciaciones', t: 'cu' }, { w: 'Océanos nacen', t: 'pr' }, { w: 'Fuego', t: 'cu' }]
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
    { s: 'Los dinosaurios dominaron la Tierra durante millones de años.', type: 'Era Mesozoica' },
    { s: 'Las primeras bacterias surgieron en un planeta sin oxígeno.', type: 'Era Precámbrica' },
    { s: 'Los trilobites fueron los reyes de los océanos primitivos.', type: 'Era Paleozoica' },
    { s: 'Los mamíferos gigantes como el mamut dominaron después de los dinosaurios.', type: 'Era Cenozoica' },
    { s: 'El ser humano creó herramientas, agricultura y civilización.', type: 'Era Cuaternaria' },
    { s: 'Enormes capas de hielo cubrieron los continentes.', type: 'Era Cuaternaria' },
    { s: 'Los primeros vertebrados vivían en los mares.', type: 'Era Paleozoica' },
    { s: 'Aparecieron las primeras aves y los primeros mamíferos junto a los dinosaurios.', type: 'Era Mesozoica' },
    { s: 'Se formaron los océanos y la atmósfera primitiva.', type: 'Era Precámbrica' },
    { s: 'Las aves se diversificaron ocupando todos los ecosistemas.', type: 'Era Cenozoica' },
];
const classifyTaskDB = [
    { w: 'Trilobite', era: 'Paleozoica', evento: 'Vida en los mares' },
    { w: 'Tiranosaurio Rex', era: 'Mesozoica', evento: 'Era de los dinosaurios' },
    { w: 'Mamut', era: 'Cenozoica', evento: 'Mamíferos gigantes' },
    { w: 'Bacteria primitiva', era: 'Precámbrica', evento: 'Primeras formas de vida' },
    { w: 'Homo sapiens', era: 'Cuaternaria', evento: 'Aparición del ser humano' },
    { w: 'Primer anfibio', era: 'Paleozoica', evento: 'Primeros vertebrados' },
    { w: 'Pangea', era: 'Mesozoica', evento: 'Se fragmentó' },
    { w: 'Megaterio', era: 'Cenozoica', evento: 'Mamíferos gigantes' },
];
const completeTaskDB = [
    { s: 'Los dinosaurios vivieron en la era ___.', opts: ['Paleozoica', 'Mesozoica', 'Cenozoica'], ans: 'Mesozoica' },
    { s: 'El fósil guía de la era Paleozoica es el ___.', opts: ['mamut', 'trilobite', 'dinosaurio'], ans: 'trilobite' },
    { s: 'La ___ de Hielo ocurrió en la era Cuaternaria.', opts: ['Explosión', 'Edad', 'Formación'], ans: 'Edad' },
    { s: '___ era el supercontinente del Mesozoico.', opts: ['Laurasia', 'Gondwana', 'Pangea'], ans: 'Pangea' },
    { s: 'Las primeras ___ surgieron en la era Precámbrica.', opts: ['plantas', 'bacterias', 'aves'], ans: 'bacterias' },
    { s: 'Los mamíferos ___ dominaron la era Cenozoica.', opts: ['pequeños', 'gigantes', 'marinos'], ans: 'gigantes' },
    { s: 'El ser humano apareció en la era ___.', opts: ['Mesozoica', 'Cenozoica', 'Cuaternaria'], ans: 'Cuaternaria' },
    { s: 'Los primeros ___ aparecieron en la era Paleozoica.', opts: ['dinosaurios', 'vertebrados', 'mamíferos'], ans: 'vertebrados' },
];
const explainQuestions = [
    { q: '¿Cuáles son las 5 eras geológicas? Ordénalas de la más antigua a la más reciente.', ans: 'Precámbrica → Paleozoica → Mesozoica → Cenozoica → Cuaternaria.' },
    { q: '¿Qué diferencia la era Cenozoica de la Cuaternaria?', ans: 'Cenozoica: mamíferos gigantes. Cuaternaria: Edad de Hielo y aparición del ser humano.' },
    { q: '¿Qué fue Pangea y en qué era se fragmentó?', ans: 'Supercontinente único que se fragmentó en la era Mesozoica.' },
    { q: '¿Qué caracteriza a la era Paleozoica?', ans: 'Vida en los mares, primeros vertebrados, trilobites, primeros anfibios y reptiles.' },
    { q: '¿Cómo se extinguieron los dinosaurios?', ans: 'Un meteorito impactó la Tierra hace 66 M.a. al final de la era Mesozoica.' },
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
    _instrBlock(out, 'Instrucción', ['Copia en tu cuaderno; identifica a qué era pertenece cada evento y escríbelo al lado.', '<strong>Ejemplo:</strong> Los dinosaurios dominaron la Tierra → <span style="color:var(--jade);font-weight:700;">Era Mesozoica</span>']);
    _pick(identifyTaskDB, Math.min(count, identifyTaskDB.length)).forEach((item, i) => {
        const div = document.createElement('div'); div.className = 'tg-task';
        div.innerHTML = `<div class="tg-task-num">${i + 1}</div><div class="tg-task-content"><strong>${item.s}</strong><div style="border-bottom:1.5px solid var(--border);min-width:220px;margin-top:0.5rem;height:1.3rem;">&nbsp;</div><div class="tg-answer">✅ ${item.type}</div></div>`;
        out.appendChild(div);
    });
}

function genClassifyTask(out, count) {
    _instrBlock(out, 'Instrucción', ['Copia la siguiente tabla en tu cuaderno. Para cada elemento, escribe su era y evento asociado.']);
    const items = _pick(classifyTaskDB, Math.min(count, classifyTaskDB.length));
    const wrap = document.createElement('div'); wrap.style.overflowX = 'auto';
    let html = `<table style="width:100%;border-collapse:collapse;font-size:0.78rem;min-width:400px;"><thead><tr style="background:var(--pri-gl);"><th style="padding:0.3rem 0.4rem;border:1px solid var(--border);text-align:left;">Elemento</th><th style="padding:0.3rem;border:1px solid var(--border);text-align:center;">Era</th><th style="padding:0.3rem;border:1px solid var(--border);text-align:center;">Evento</th></tr></thead><tbody>`;
    items.forEach(it => {
        html += `<tr><td style="padding:0.4rem 0.5rem;border:1px solid var(--border);font-weight:600;">${it.w}</td><td style="padding:0.4rem;border:1px solid var(--border);min-width:80px;"></td><td style="padding:0.4rem;border:1px solid var(--border);min-width:80px;"></td></tr>`;
    });
    html += '</tbody></table>';
    wrap.innerHTML = html; out.appendChild(wrap);
    const ans = document.createElement('div'); ans.className = 'tg-answer'; ans.style.marginTop = '0.8rem';
    ans.innerHTML = '<strong>✅ Respuestas:</strong><br>' + items.map(it => `<strong>${it.w}:</strong> Era: ${it.era} | Evento: ${it.evento}`).join('<br>');
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
// Listas de palabras para cada set (la cuadrícula se genera dinámicamente)
const sopaWordLists = [
    { words: ['PALEOZOICA', 'DINOSAURIO', 'MAMUT', 'FOSIL', 'PANGEA', 'TRILOBITE', 'HIELO', 'GLACIAR', 'MESOZOICA'] },
    { words: ['BACTERIA', 'METEORITO', 'VERTEBRADO', 'MAMIFEROS', 'PANGEA', 'HOMOSAPIEN', 'AVES', 'GLACIAR'] },
    { words: ['CENOZOICA', 'EXTINCION', 'TRILOBITE', 'FOSIL', 'ERA', 'GLACIAR', 'MAMUT', 'HIELO', 'PANGEA'] },
];

let currentSopaSetIdx = 0, sopaFoundWords = new Set(), currentSopaSet = null;
let sopaFirstClickCell = null, sopaPointerStartCell = null, sopaPointerMoved = false, sopaSelectedCells = [];

// Genera una cuadrícula en las 8 direcciones de forma aleatoria
function generateSopaGrid(words) {
    const SIZE = 10;
    // [dr, dc]: →←↓↑↘↙↗↖
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
        // Fallback: colocación horizontal forzada si no cupo en ninguna dirección
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
    // Rellenar celdas vacías con letras aleatorias
    for (let r = 0; r < SIZE; r++)for (let c = 0; c < SIZE; c++)
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

// Solo re-dibuja la cuadrícula con el set actual (para resize sin regenerar)
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

// Genera un nuevo grid y lo dibuja (nuevo set o primera carga)
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

// 🔦 Linterna: parpadea brevemente las celdas de palabras no encontradas
function sopaFlashlight() {
    if (!currentSopaSet) { showToast('⚠️ La sopa aún se está generando'); return; }
    sfx('click');
    const flashCells = [];
    currentSopaSet.words.forEach(wObj => {
        if (!sopaFoundWords.has(wObj.w)) {
            wObj.cells.forEach(([r, c]) => {
                const el = document.querySelector(`#sopaGrid [data-row="${r}"][data-col="${c}"]`);
                if (el && !el.classList.contains('sopa-found')) {
                    el.classList.add('sopa-flash');
                    flashCells.push(el);
                }
            });
        }
    });
    // Retirar el flash después de 3 ciclos × 0.44s ≈ 1.4 s
    setTimeout(() => flashCells.forEach(el => el.classList.remove('sopa-flash')), 1450);
}

let _sopaResizeTimer = null;
// En resize solo se redibuja (sin regenerar) para conservar el progreso
window.addEventListener('resize', () => { clearTimeout(_sopaResizeTimer); _sopaResizeTimer = setTimeout(() => { if (document.getElementById('s-sopa').classList.contains('active')) _renderSopaGrid(); }, 200); });

// ===================== EVALUACIÓN FINAL =====================
const evalTFBank = [
    { q: 'La era Precámbrica es la más larga de la historia de la Tierra.', a: true },
    { q: 'Los dinosaurios vivieron en la era Cuaternaria.', a: false },
    { q: 'Pangea fue un supercontinente que existía en la era Mesozoica.', a: true },
    { q: 'Los trilobites son fósiles guía de la era Mesozoica.', a: false },
    { q: 'El ser humano apareció en la era Cuaternaria.', a: true },
    { q: 'La vida en los mares comenzó en la era Paleozoica.', a: true },
    { q: 'Las glaciaciones ocurrieron en la era Precámbrica.', a: false },
    { q: 'La extinción del Cretácico fue causada por un meteorito.', a: true },
    { q: 'Los mamíferos gigantes dominaron la era Cenozoica.', a: true },
    { q: 'Las primeras bacterias surgieron en la era Paleozoica.', a: false },
    { q: 'La era Paleozoica se conoce como «Era de los Dinosaurios».', a: false },
    { q: 'Las primeras aves aparecieron en la era Mesozoica.', a: true },
    { q: 'La Tierra tiene aproximadamente 4,600 millones de años.', a: true },
    { q: 'La Edad de Hielo ocurrió en la era Cuaternaria.', a: true },
    { q: 'La diversificación de las aves ocurrió en la era Cenozoica.', a: true },
];
const evalMCBank = [
    { q: '¿Cuál es la era más larga?', o: ['a) Paleozoica', 'b) Mesozoica', 'c) Precámbrica', 'd) Cuaternaria'], a: 2 },
    { q: '¿En qué era vivieron los dinosaurios?', o: ['a) Precámbrica', 'b) Paleozoica', 'c) Mesozoica', 'd) Cenozoica'], a: 2 },
    { q: '¿Qué fue Pangea?', o: ['a) Un océano', 'b) Un supercontinente', 'c) Un fósil', 'd) Una glaciación'], a: 1 },
    { q: 'Los trilobites son fósiles de la era:', o: ['a) Cenozoica', 'b) Mesozoica', 'c) Paleozoica', 'd) Cuaternaria'], a: 2 },
    { q: '¿Qué causó la extinción de los dinosaurios?', o: ['a) Glaciación', 'b) Terremoto', 'c) Meteorito', 'd) Volcán'], a: 2 },
    { q: '¿En qué era apareció el Homo sapiens?', o: ['a) Mesozoica', 'b) Cenozoica', 'c) Cuaternaria', 'd) Paleozoica'], a: 2 },
    { q: '¿Qué era se caracteriza por mamíferos gigantes?', o: ['a) Paleozoica', 'b) Cenozoica', 'c) Precámbrica', 'd) Cuaternaria'], a: 1 },
    { q: '¿Qué evento caracteriza la era Cuaternaria?', o: ['a) Dinosaurios', 'b) Formación Tierra', 'c) Edad de Hielo', 'd) Vida en mares'], a: 2 },
    { q: '¿En qué era aparecieron los primeros vertebrados?', o: ['a) Precámbrica', 'b) Paleozoica', 'c) Mesozoica', 'd) Cuaternaria'], a: 1 },
    { q: '¿Qué se formó durante la era Precámbrica?', o: ['a) Dinosaurios', 'b) Civilizaciones', 'c) La Tierra y océanos', 'd) Mamíferos'], a: 2 },
    { q: 'La mayor extinción masiva ocurrió al final de:', o: ['a) Cenozoica', 'b) Mesozoica', 'c) Paleozoica', 'd) Precámbrica'], a: 2 },
    { q: '¿Qué era se conoce como «Vida Antigua»?', o: ['a) Mesozoica', 'b) Cenozoica', 'c) Paleozoica', 'd) Cuaternaria'], a: 2 },
    { q: 'Las primeras aves aparecieron en:', o: ['a) Paleozoica', 'b) Precámbrica', 'c) Cenozoica', 'd) Mesozoica'], a: 3 },
    { q: '¿Cuántas eras geológicas principales hay?', o: ['a) 3', 'b) 4', 'c) 5', 'd) 6'], a: 2 },
    { q: 'La diversificación de aves ocurrió en:', o: ['a) Paleozoica', 'b) Mesozoica', 'c) Cenozoica', 'd) Precámbrica'], a: 2 },
];
const evalCPBank = [
    { q: 'La era más larga es la ___.', a: 'Precámbrica' },
    { q: 'Los dinosaurios vivieron en la era ___.', a: 'Mesozoica' },
    { q: 'El supercontinente se llamaba ___.', a: 'Pangea' },
    { q: 'Los trilobites son fósiles de la era ___.', a: 'Paleozoica' },
    { q: 'El ser humano apareció en la era ___.', a: 'Cuaternaria' },
    { q: 'La ___ de Hielo ocurrió en la era Cuaternaria.', a: 'Edad' },
    { q: 'Los mamíferos ___ dominaron la era Cenozoica.', a: 'gigantes' },
    { q: 'Los primeros ___ aparecieron en la era Paleozoica.', a: 'vertebrados' },
    { q: 'Un ___ causó la extinción de los dinosaurios.', a: 'meteorito' },
    { q: 'Las primeras ___ surgieron en la era Precámbrica.', a: 'bacterias' },
    { q: 'La era ___ se conoce como «Vida Antigua».', a: 'Paleozoica' },
    { q: 'Las primeras ___ aparecieron en la era Mesozoica.', a: 'aves' },
    { q: 'La ___ de las aves ocurrió en la era Cenozoica.', a: 'diversificación' },
    { q: 'La Tierra tiene aproximadamente ___ millones de años.', a: '4,600' },
    { q: 'La era ___ es en la que vivimos actualmente.', a: 'Cuaternaria' },
];
const evalPRBank = [
    { term: 'Era Precámbrica', def: 'Formación de la Tierra y primeras bacterias' },
    { term: 'Era Paleozoica', def: 'Vida en los mares y primeros vertebrados' },
    { term: 'Era Mesozoica', def: 'Era de los dinosaurios y primeras aves' },
    { term: 'Era Cenozoica', def: 'Mamíferos gigantes y diversificación de aves' },
    { term: 'Era Cuaternaria', def: 'Edad de Hielo y aparición del ser humano' },
    { term: 'Fósil', def: 'Resto de ser vivo conservado en roca' },
    { term: 'Pangea', def: 'Supercontinente que se fragmentó en el Mesozoico' },
    { term: 'Extinción masiva', def: 'Desaparición de muchas especies a la vez' },
    { term: 'Trilobite', def: 'Artrópodo fósil guía del Paleozoico' },
    { term: 'Glaciación', def: 'Período de frío extremo con capas de hielo' },
    { term: 'Homo sapiens', def: 'Especie humana de la era Cuaternaria' },
    { term: 'Mamut', def: 'Mamífero gigante de la era Cenozoica' },
    { term: 'Meteorito', def: 'Causó la extinción de los dinosaurios' },
    { term: 'Primeros vertebrados', def: 'Peces primitivos de la era Paleozoica' },
    { term: 'Diversificación de aves', def: 'Evento de la era Cenozoica' },
];

function genEval() {
    sfx('click');
    const cf = evalFormNum;
    window._currentEvalForm = cf;
    evalFormNum = (evalFormNum % 10) + 1;
    saveProgress();
    document.getElementById('eval-screen-title').textContent = `📝 Evaluación Final — Forma ${cf} · Las Eras Geológicas`;
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

    // ── Pauta (nuevo orden I-II-III-IV)
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
<title>Evaluación Las Eras Geológicas · Forma ${forma}</title>
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
.sec-title {font-size:10pt;font-weight:700;padding:0.15rem 0.4rem;margin:0.2rem 0 0.1rem;display:flex;justify-content:space-between;align-items:center;border-left:4px solid #27ae60;background:#e8f8f5;color:#27ae60;}
.obt-row {display:flex;align-items:baseline;gap:4px;font-size:9pt;font-weight:700;font-style:italic;color:#27ae60;}
.obt-lbl{white-space:nowrap;}
.obt-line{display:inline-block;min-width:58px;border-bottom:1.5px solid #27ae60;height:12px;}
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
.pr-item {font-size:9.5pt;padding:0.15rem 0.25rem;background:#e8f8f5;border-radius:3px;margin-bottom:0.1rem;display:flex;align-items:center;gap:0.2rem;line-height:1.15;break-inside:avoid;page-break-inside:avoid;}
.pr-num {font-weight:700;color:#27ae60;min-width:17px;flex-shrink:0;}
.pr-line{display:inline-block;min-width:17px;border-bottom:1.5px solid #111;margin-right:0.12rem;flex-shrink:0;}
.total-row {display:flex;align-items:baseline;justify-content:flex-start;margin-left:20%;gap:7px;font-size:11pt;font-weight:700;font-style:italic;margin-top:0.3rem;padding:0.2rem 0;page-break-before:avoid;break-before:avoid;color:#27ae60;}
.total-row .obt-line{min-width:80px;border-bottom:1.5px solid #27ae60;}
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
  <h2>Evaluación Final · Misión Las Eras Geológicas · CC.NN.</h2>
  <div class="ph-line"><strong>Nombre:</strong><span class="ph-fill">&nbsp;</span><strong>Fecha:</strong><span class="ph-m">&nbsp;</span></div>
  <div class="ph-line"><strong>Centro Educativo:</strong><span class="ph-fill">&nbsp;</span><strong>Grado y Sección:</strong><span class="ph-s">&nbsp;</span><strong>Nº Lista:</strong><span class="ph-xs">&nbsp;</span></div>
  <p class="ph-crit">Valor total: 100 puntos · Cada respuesta vale 5 puntos</p>
</div>
${s1}${s2}${s3}${s4}
<div class="total-row"><span>Total, obtenido</span><span class="obt-line"></span><span>de 100%</span></div>
<div class="pauta-wrap">
  <div class="p-head">
    <div class="p-main">✅ PAUTA — Evaluación Final · Misión Las Eras Geológicas · Forma ${forma}</div>
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
    const msgs = ['🚀 ¡ÁNIMO! Comienza tu misión. ¡Cada paso cuenta!', '🌱 ¡GRAN INICIO! Estás dando los primeros pasos.', '📚 ¡BUEN TRABAJO! Vas progresando muy bien.', '💪 ¡MUY BIEN! Dominas gran parte del contenido.', '🌟 ¡INCREÍBLE avance! Estás cerca de la excelencia.', '🏆 ¡EXTRAORDINARIO! Completaste TODA la misión. ¡Eres experto en Eras Geológicas!'];
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
    const txt = `${stars} CONSTANCIA DE LOGRO ${stars}\n\n📝 Misión: Las Eras Geológicas\n👤 Estudiante: ${name}\n📊 Progreso: ${pct}% completado\n⭐ XP obtenido: ${xp} de ${MXP}${achText ? '\n\n🏅 Logros desbloqueados:\n' + achText : ''}\n\n${msg}\n\n📅 ${date}\n🏠 Proyecto Educativo Familia Polanco-Castellanos\n🌐 policastsapien.com`;
    window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
}

// ===================== ASIMILACIÓN — JUEGO 1: ORDENACIÓN =====================
const ordCorrect = ['Precámbrica', 'Paleozoica', 'Mesozoica', 'Cenozoica', 'Cuaternaria'];
const ordEmojis = { Precámbrica: '🌋', Paleozoica: '🐚', Mesozoica: '🦖', Cenozoica: '🐘', Cuaternaria: '🧑' };

function buildOrdenacion() {
    const list = document.getElementById('ordList');
    list.innerHTML = '';
    _shuffle([...ordCorrect]).forEach(era => {
        const li = document.createElement('li');
        li.className = 'ord-item';
        li.dataset.era = era;
        li.innerHTML = `<span class="ord-num"></span>
      <span class="ord-label">${ordEmojis[era]} ${era}</span>
      <div class="ord-btns">
        <button class="ord-btn" onclick="moveOrd(this,-1)" title="Subir" aria-label="Subir ${era}">▲</button>
        <button class="ord-btn" onclick="moveOrd(this,1)"  title="Bajar" aria-label="Bajar ${era}">▼</button>
      </div>`;
        list.appendChild(li);
    });
    _refreshOrd();
    document.getElementById('fbOrd').classList.remove('show');
}

function _refreshOrd() {
    const items = [...document.querySelectorAll('#ordList .ord-item')];
    items.forEach((el, i) => {
        el.querySelector('.ord-num').textContent = (i + 1) + '.';
        el.querySelector('[title="Subir"]').disabled = i === 0;
        el.querySelector('[title="Bajar"]').disabled = i === items.length - 1;
        el.classList.remove('ord-ok', 'ord-no');
    });
}

function moveOrd(btn, dir) {
    sfx('click');
    const item = btn.closest('.ord-item');
    const list = item.parentElement;
    const items = [...list.children];
    const idx = items.indexOf(item);
    const swap = idx + dir;
    if (swap < 0 || swap >= items.length) return;
    dir === -1 ? list.insertBefore(item, items[swap]) : list.insertBefore(items[swap], item);
    _refreshOrd();
}

function checkOrdenacion() {
    const items = [...document.querySelectorAll('#ordList .ord-item')];
    let allOk = true;
    items.forEach((el, i) => {
        const ok = el.dataset.era === ordCorrect[i];
        el.classList.toggle('ord-ok', ok);
        el.classList.toggle('ord-no', !ok);
        if (!ok) allOk = false;
    });
    if (allOk) {
        fb('fbOrd', '¡Orden perfecto! +5 XP', true);
        sfx('ok');
        if (!xpTracker.asim.has('ord')) { xpTracker.asim.add('ord'); pts(5); fin('s-asimilacion'); launchConfetti(); }
    } else {
        fb('fbOrd', 'Hay eras fuera de lugar — las rojas necesitan moverse.', false);
        sfx('no');
    }
}

// ===================== ASIMILACIÓN — JUEGO 2: ASOCIACIÓN =====================
const asocPairs = [
    { term: '🦐 Trilobite', era: '🐚 Paleozoica', key: 'tri' },
    { term: '🦖 Dinosaurio', era: '🦖 Mesozoica', key: 'din' },
    { term: '🐘 Mamut', era: '🐘 Cenozoica', key: 'mam' },
    { term: '❄️ Glaciación', era: '🧑 Cuaternaria', key: 'gla' },
];
let asocSel = null;
let asocDone = 0;

function buildAsociacion() {
    asocSel = null; asocDone = 0;
    const leftCol = document.getElementById('asocLeft');
    const rightCol = document.getElementById('asocRight');
    leftCol.innerHTML = ''; rightCol.innerHTML = '';
    document.getElementById('fbAsoc').classList.remove('show');

    _shuffle([...asocPairs]).forEach(p => {
        const el = document.createElement('div');
        el.className = 'asoc-item'; el.textContent = p.term; el.dataset.key = p.key;
        el.onclick = () => selectAsocLeft(el);
        leftCol.appendChild(el);
    });
    _shuffle([...asocPairs]).forEach(p => {
        const el = document.createElement('div');
        el.className = 'asoc-item'; el.textContent = p.era; el.dataset.key = p.key;
        el.onclick = () => selectAsocRight(el);
        rightCol.appendChild(el);
    });
}

function selectAsocLeft(el) {
    if (el.classList.contains('asoc-ok')) return;
    sfx('click');
    document.querySelectorAll('#asocLeft .asoc-item').forEach(i => i.classList.remove('asoc-sel'));
    el.classList.add('asoc-sel');
    asocSel = el;
}

function selectAsocRight(el) {
    if (el.classList.contains('asoc-ok') || !asocSel) return;
    sfx('click');
    if (asocSel.dataset.key === el.dataset.key) {
        asocSel.classList.remove('asoc-sel'); asocSel.classList.add('asoc-ok');
        el.classList.add('asoc-ok');
        asocSel = null; asocDone++;
        sfx('ok');
        if (asocDone === asocPairs.length) {
            fb('fbAsoc', '¡Todas las parejas correctas! +5 XP', true);
            if (!xpTracker.asim.has('asoc')) { xpTracker.asim.add('asoc'); pts(5); launchConfetti(); }
        }
    } else {
        sfx('no');
        asocSel.classList.remove('asoc-sel'); asocSel = null;
        fb('fbAsoc', 'Esa pareja no coincide — intenta de nuevo.', false);
    }
}

// ===================== ASIMILACIÓN — JUEGO 3: ANAGRAMA =====================
const anaWord = 'METEORITO';
let anaLetters = [];   // [{letter, id}]
let anaSelected = null; // posición seleccionada (o null)

function buildAnagrama() {
    anaSelected = null;
    // Mezclar garantizando que no quede resuelto de entrada
    do { anaLetters = _shuffle([...anaWord].map((l, i) => ({ letter: l, id: i }))); }
    while (anaLetters.map(o => o.letter).join('') === anaWord);
    _renderAna();
    document.getElementById('fbAna').classList.remove('show');
}

function _renderAna() {
    const grid = document.getElementById('anaGrid');
    grid.innerHTML = '';
    anaLetters.forEach((obj, pos) => {
        const cell = document.createElement('div');
        cell.className = 'ana-cell';
        cell.textContent = obj.letter;
        cell.dataset.pos = pos;
        cell.setAttribute('aria-label', `Letra ${obj.letter}, posición ${pos + 1}`);
        cell.onclick = () => _clickAna(pos);
        if (pos === anaSelected) cell.classList.add('ana-sel');
        grid.appendChild(cell);
    });
}

function _clickAna(pos) {
    if (anaSelected === null) {
        // Primera selección
        anaSelected = pos;
        sfx('click');
        _renderAna();
    } else if (anaSelected === pos) {
        // Deseleccionar
        anaSelected = null;
        sfx('click');
        _renderAna();
    } else {
        // Intercambiar
        const tmp = anaLetters[anaSelected];
        anaLetters[anaSelected] = anaLetters[pos];
        anaLetters[pos] = tmp;
        anaSelected = null;
        sfx('click');
        _renderAna();
        // Auto-detectar victoria
        if (anaLetters.map(o => o.letter).join('') === anaWord) _winAna();
    }
}

function checkAnagrama() {
    if (anaLetters.map(o => o.letter).join('') === anaWord) {
        _winAna();
    } else {
        fb('fbAna', 'Aún no es correcto — sigue intercambiando letras.', false);
        sfx('no');
    }
}

function _winAna() {
    document.querySelectorAll('#anaGrid .ana-cell').forEach(c => c.classList.add('ana-ok'));
    fb('fbAna', '¡METEORITO! Correcto. +5 XP', true);
    sfx('ok');
    if (!xpTracker.asim.has('ana')) { xpTracker.asim.add('ana'); pts(5); launchConfetti(); }
}

// ===================== CRUCIGRAMA =====================
const cruciData = [
    { num: 1, def: 'Supercontinente del Mesozoico', ans: 'PANGEA' },
    { num: 2, def: 'Resto de un ser vivo conservado en roca', ans: 'FOSIL' },
    { num: 3, def: 'Nuestra especie (sin espacios)', ans: 'HOMOSAPIENS' }
];

function buildCrucigrama() {
    const list = document.getElementById('cruciList');
    if (!list) return;
    list.innerHTML = '';
    cruciData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cruci-item';
        div.setAttribute('role', 'listitem');
        div.innerHTML =
            `<label class="cruci-def"><span class="cruci-num">${item.num}.</span>${item.def}</label>` +
            `<input class="cruci-input" id="cruciInp${item.num}" type="text" maxlength="12"` +
            ` autocomplete="off" autocorrect="off" spellcheck="false"` +
            ` oninput="this.value=this.value.toUpperCase()" aria-label="Respuesta ${item.num}">`;
        list.appendChild(div);
    });
    fb('fbCruci', '', true);
    document.getElementById('fbCruci').textContent = '';
}

function _normCruci(str) {
    return str.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
}

function checkCrucigrama() {
    let allCorrect = true;
    cruciData.forEach(item => {
        const inp = document.getElementById(`cruciInp${item.num}`);
        if (!inp) return;
        const val = _normCruci(inp.value);
        const ans = _normCruci(item.ans);
        inp.classList.remove('cruci-ok', 'cruci-no');
        if (val === ans) {
            inp.classList.add('cruci-ok');
            inp.readOnly = true;
        } else {
            inp.classList.add('cruci-no');
            allCorrect = false;
        }
    });
    if (allCorrect) {
        fb('fbCruci', '¡Crucigrama completo! +5 XP', true);
        sfx('ok');
        if (!xpTracker.asim.has('cruci')) { xpTracker.asim.add('cruci'); pts(5); launchConfetti(); }
    } else {
        fb('fbCruci', 'Alguna respuesta no es correcta. Revisa las marcadas en rojo.', false);
        sfx('no');
    }
}
// ===================== GALERÍA DE PÓSTERS (FLIPBOARD) =====================
const posterGalleryData = [
    { src: 'carrusel-img/precambrica.edit.webp', alt: 'Era Precámbrica' },
    { src: 'carrusel-img/paleozoica.edit.webp', alt: 'Era Paleozoica' },
    { src: 'carrusel-img/mesozoica.edit.webp', alt: 'Era Mesozoica' },
    { src: 'carrusel-img/cenozoica.edit.webp', alt: 'Era Cenozoica' },
    { src: 'carrusel-img/cuaternaria.edit.webp', alt: 'Era Cuaternaria' }
];
let posterIdx = 0;
let posterRot = 0;

function updatePosterFlip(dir) {
    if (typeof sfx === 'function') sfx('flip');
    posterIdx += dir;
    // Girar 180 grados hacia la izquierda o derecha
    posterRot += (dir > 0 ? -180 : 180);

    // Averiguar qué lado de la tarjeta está oculto ahora para cargar ahí la nueva imagen
    const isFrontHidden = (Math.abs(posterRot / 180) % 2 !== 0);
    const hiddenFace = isFrontHidden ? document.getElementById('posterFront') : document.getElementById('posterBack');

    hiddenFace.innerHTML = `<img src="${posterGalleryData[posterIdx].src}" alt="${posterGalleryData[posterIdx].alt}" loading="lazy">`;

    // Ejecutar el giro CSS
    document.getElementById('posterInner').style.transform = `rotateY(${posterRot}deg)`;

    // Actualizar los botones y el contador
    document.getElementById('posterDots').textContent = `${posterIdx + 1} / ${posterGalleryData.length}`;
    document.getElementById('btnPrevPoster').disabled = (posterIdx === 0);
    document.getElementById('btnNextPoster').disabled = (posterIdx === posterGalleryData.length - 1);
}

function nextPosterFlip() { if (posterIdx < posterGalleryData.length - 1) updatePosterFlip(1); }
function prevPosterFlip() { if (posterIdx > 0) updatePosterFlip(-1); }
// ===================== INIT =====================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadProgress();
    cambiarEra(0);
    upFC(); buildQz(); buildClass(); showId(); showCmp(); buildSopa(); genEval();
    buildOrdenacion(); buildAsociacion(); buildAnagrama(); buildCrucigrama();
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
    const savedName = localStorage.getItem('nombreEstudianteEras');
    const inputName = document.querySelector('.diploma-input');
    if (savedName && inputName) { inputName.value = savedName; updateDiplomaName(savedName); }
    if (inputName) inputName.addEventListener('input', e => localStorage.setItem('nombreEstudianteEras', e.target.value));
    fin('s-aprende', false);
    fin('s-tipos', false);
});