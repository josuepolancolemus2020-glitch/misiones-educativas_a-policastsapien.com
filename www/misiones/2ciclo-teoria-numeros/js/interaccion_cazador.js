// js/interaccion_cazador.js
// Widget-juego: Cazador de Múltiplos — arcade de 30 segundos. Se muestra un
// tablero 4×4 de números; el estudiante debe tocar solo los múltiplos del
// número objetivo. Aciertos suman, intrusos restan. Guarda el récord local.

window.WidgetCazadorJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wc-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wc-head { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.8rem; font-family: 'Fredoka', sans-serif; }
        .wc-target { font-size: 1rem; font-weight: 700; color: #1565c0; }
        .wc-target strong { font-size: 1.4rem; color: #6c5ce7; }
        .wc-timer { font-size: 1rem; font-weight: 700; color: #00897b; }
        .wc-timer.wc-low { color: #d63031; animation: wcBlink 0.5s ease infinite alternate; }
        @keyframes wcBlink { from { opacity: 1; } to { opacity: 0.4; } }
        .wc-score { font-size: 0.9rem; font-weight: 700; color: #1b2838; }
        .wc-bar-wrap { height: 8px; background: #eee; border-radius: 6px; overflow: hidden; margin-bottom: 0.9rem; }
        .wc-bar { height: 100%; width: 100%; background: #00b894; border-radius: 6px; transition: width 1s linear, background 0.4s; }
        .wc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 0.9rem; }
        .wc-cell { font-family: 'Fredoka', sans-serif; font-size: 1.15rem; font-weight: 700; padding: 0.85rem 0.2rem; text-align: center; border-radius: 12px; border: 2px solid #dcdde1; background: #fafafa; color: #1b2838; cursor: pointer; transition: transform 0.15s, background 0.2s; user-select: none; }
        .wc-cell:hover { transform: scale(1.05); }
        .wc-cell.wc-hit { background: rgba(0,184,148,0.25); border-color: #00b894; color: #006d4e; transform: scale(0.92); }
        .wc-cell.wc-miss { background: rgba(214,48,49,0.2); border-color: #d63031; color: #a00; animation: wcShake 0.3s ease; }
        @keyframes wcShake { 0%,100% { transform: none; } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .wc-cell.wc-off { opacity: 0.35; pointer-events: none; }
        .wc-msg { font-size: 0.88rem; text-align: center; min-height: 1.8rem; padding: 0.35rem 0.6rem; border-radius: 8px; color: #636e72; line-height: 1.4; }
        .wc-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wc-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wc-btn-row { display: flex; gap: 0.6rem; justify-content: center; align-items: center; margin-top: 0.7rem; flex-wrap: wrap; }
        .wc-btn { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.3rem; border-radius: 12px; cursor: pointer; font-size: 0.92rem; transition: transform 0.2s; }
        .wc-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .wc-btn:disabled { opacity: 0.45; cursor: default; }
        .wc-record { font-family: 'Fredoka', sans-serif; font-size: 0.82rem; color: #b45309; }
        [data-theme="dark"] .wc-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wc-cell { background: #171923; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .wc-score { color: #e8f0fe; }
        [data-theme="dark"] .wc-bar-wrap { background: #2d3450; }
        [data-theme="dark"] .wc-msg { color: #a0aec0; }
      </style>
      <div class="wc-container">
        <div class="wc-head">
          <span class="wc-target" id="wc-target">🎯 Caza los múltiplos de <strong>3</strong></span>
          <span class="wc-timer" id="wc-timer">⏱ 30</span>
          <span class="wc-score" id="wc-score">Puntos: 0</span>
        </div>
        <div class="wc-bar-wrap"><div class="wc-bar" id="wc-bar"></div></div>
        <div class="wc-grid" id="wc-grid"></div>
        <div class="wc-msg" id="wc-msg">Presiona ¡Jugar! y toca solo los múltiplos del número objetivo.</div>
        <div class="wc-btn-row">
          <button class="wc-btn" id="wc-play">🚀 ¡Jugar!</button>
          <span class="wc-record" id="wc-record"></span>
        </div>
      </div>
    `;

    const targetEl = document.getElementById('wc-target');
    const timerEl = document.getElementById('wc-timer');
    const scoreEl = document.getElementById('wc-score');
    const barEl = document.getElementById('wc-bar');
    const gridEl = document.getElementById('wc-grid');
    const msgEl = document.getElementById('wc-msg');
    const playBtn = document.getElementById('wc-play');
    const recordEl = document.getElementById('wc-record');

    const REC_KEY = 'cazadorMultiplosRecord';
    let base = 3, score = 0, sec = 30, timerInt = null, running = false, xpAwarded = false;

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wc-msg' + (cls ? ' ' + cls : ''); }
    function showRecord() { const r = parseInt(localStorage.getItem(REC_KEY) || '0', 10); recordEl.textContent = r > 0 ? '🏅 Récord: ' + r : ''; }

    function fillGrid() {
      gridEl.innerHTML = '';
      const cells = [];
      const nMult = rint(6, 9);
      for (let i = 0; i < 16; i++) {
        let v;
        if (i < nMult) { v = base * rint(2, 12); }
        else { do { v = rint(4, 120); } while (v % base === 0); }
        cells.push(v);
      }
      cells.sort(() => Math.random() - 0.5);
      cells.forEach(v => {
        const cell = document.createElement('div');
        cell.className = 'wc-cell'; cell.textContent = v;
        cell.onclick = () => {
          if (!running) return;
          if (v % base === 0) {
            score += 2; cell.classList.add('wc-hit'); cell.classList.add('wc-off');
            if (typeof sfx === 'function') sfx('ok');
            if (!gridEl.querySelector('.wc-cell:not(.wc-off)') || gridEl.querySelectorAll('.wc-cell.wc-hit').length >= nMult) { fillGridSoon(); }
          } else {
            score = Math.max(0, score - 1); cell.classList.add('wc-miss');
            setTimeout(() => cell.classList.remove('wc-miss'), 350);
            if (typeof sfx === 'function') sfx('no');
          }
          scoreEl.textContent = 'Puntos: ' + score;
        };
        gridEl.appendChild(cell);
      });
    }

    let refillTimeout = null;
    function fillGridSoon() {
      clearTimeout(refillTimeout);
      refillTimeout = setTimeout(() => { if (running) { base = rint(2, 9); targetEl.innerHTML = '🎯 Caza los múltiplos de <strong>' + base + '</strong>'; fillGrid(); } }, 500);
    }

    function endGame() {
      running = false;
      clearInterval(timerInt); clearTimeout(refillTimeout);
      playBtn.disabled = false;
      gridEl.querySelectorAll('.wc-cell').forEach(c => c.classList.add('wc-off'));
      const rec = parseInt(localStorage.getItem(REC_KEY) || '0', 10);
      let recTxt = '';
      if (score > rec) { try { localStorage.setItem(REC_KEY, String(score)); } catch (e) {} recTxt = ' 🏅 ¡Nuevo récord!'; }
      showRecord();
      let xpTxt = '';
      if (!xpAwarded && typeof pts === 'function') {
        const xpWin = Math.min(8, Math.floor(score / 4));
        if (xpWin > 0) { pts(xpWin); xpTxt = ` +${xpWin} XP`; }
        xpAwarded = true;
      }
      setMsg(`🏁 ¡Tiempo! Cazaste <strong>${score}</strong> puntos.${recTxt}${xpTxt} ¿Puedes superarlo?`, 'ok');
      if (typeof sfx === 'function') sfx('fan');
    }

    function start() {
      if (running) return;
      if (typeof sfx === 'function') sfx('click');
      running = true; score = 0; sec = 30;
      playBtn.disabled = true;
      base = rint(2, 9);
      targetEl.innerHTML = '🎯 Caza los múltiplos de <strong>' + base + '</strong>';
      scoreEl.textContent = 'Puntos: 0';
      timerEl.textContent = '⏱ 30'; timerEl.className = 'wc-timer';
      barEl.style.width = '100%'; barEl.style.background = '#00b894';
      setMsg('¡Toca los múltiplos de ' + base + '! Aciertos +2, intrusos −1.');
      fillGrid();
      timerInt = setInterval(() => {
        sec--;
        timerEl.textContent = '⏱ ' + sec;
        barEl.style.width = (sec / 30 * 100) + '%';
        if (sec <= 10) { timerEl.className = 'wc-timer wc-low'; barEl.style.background = '#d63031'; }
        if (typeof sfx === 'function') sfx('tick');
        if (sec <= 0) endGame();
      }, 1000);
    }

    playBtn.onclick = start;
    showRecord();
    fillGrid();
    gridEl.querySelectorAll('.wc-cell').forEach(c => c.classList.add('wc-off'));
  }
};
