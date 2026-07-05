// js/interaccion_radar.js
// Widget: Radar Par-Impar — aparece un número grande y el estudiante decide
// si es par o impar. El feedback ilumina la última cifra: ¡es la que manda!

window.WidgetRadarJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wpr-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wpr-num { font-family: 'Fira Code', monospace; font-size: 2.1rem; font-weight: 700; color: #1b2838; text-align: center; margin-bottom: 0.9rem; letter-spacing: 0.08em; }
        .wpr-num .wpr-last { color: #1565c0; border-bottom: 4px solid #fdcb6e; border-radius: 2px; }
        .wpr-opts { display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: center; }
        .wpr-opt { font-family: 'Fredoka', sans-serif; font-size: 1rem; padding: 0.55rem 1.5rem; border: 2px solid #1565c0; border-radius: 20px; background: white; color: #1565c0; cursor: pointer; transition: all 0.2s; font-weight: 700; }
        .wpr-opt:hover:not(:disabled) { background: #1565c0; color: white; }
        .wpr-opt.wpr-ok { background: #00b894; border-color: #00b894; color: white; }
        .wpr-opt.wpr-no { background: #d63031; border-color: #d63031; color: white; }
        .wpr-msg { font-size: 0.88rem; text-align: center; color: #636e72; min-height: 2.4rem; padding: 0.4rem 0.6rem; border-radius: 8px; margin-top: 0.7rem; line-height: 1.45; }
        .wpr-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wpr-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wpr-streak { font-family: 'Fredoka', sans-serif; font-size: 0.8rem; text-align: center; color: #636e72; margin-top: 0.4rem; }
        [data-theme="dark"] .wpr-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wpr-num { color: #e8f0fe; }
        [data-theme="dark"] .wpr-opt { background: #1e2130; }
        [data-theme="dark"] .wpr-msg { color: #a0aec0; }
      </style>
      <div class="wpr-container">
        <div class="wpr-num" id="wpr-num"></div>
        <div class="wpr-opts">
          <button class="wpr-opt" id="wpr-btn-par">2️⃣ PAR</button>
          <button class="wpr-opt" id="wpr-btn-impar">1️⃣ IMPAR</button>
        </div>
        <div class="wpr-msg" id="wpr-msg">¿Par o impar? No necesitas dividir: hay una pista secreta en el número.</div>
        <div class="wpr-streak" id="wpr-streak">🔥 Racha: 0</div>
      </div>
    `;

    const numEl = document.getElementById('wpr-num');
    const msgEl = document.getElementById('wpr-msg');
    const streakEl = document.getElementById('wpr-streak');
    const btnPar = document.getElementById('wpr-btn-par');
    const btnImpar = document.getElementById('wpr-btn-impar');
    let current = 0, answered = false, streak = 0;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wpr-msg' + (cls ? ' ' + cls : ''); }

    function showNum(highlight) {
      const s = current.toLocaleString('en-US');
      if (!highlight) { numEl.textContent = s; return; }
      numEl.innerHTML = s.slice(0, -1) + '<span class="wpr-last">' + s.slice(-1) + '</span>';
    }

    function newRound() {
      current = rint(0, 1) ? rint(100, 9999) : rint(10, 99);
      answered = false;
      btnPar.classList.remove('wpr-ok', 'wpr-no');
      btnImpar.classList.remove('wpr-ok', 'wpr-no');
      btnPar.disabled = false; btnImpar.disabled = false;
      showNum(false);
      setMsg('¿Par o impar? No necesitas dividir: hay una pista secreta en el número.');
    }

    function answer(dicePar) {
      if (answered) return;
      answered = true;
      btnPar.disabled = true; btnImpar.disabled = true;
      const last = current % 10;
      const esPar = current % 2 === 0;
      const btn = dicePar ? btnPar : btnImpar;
      const okBtn = esPar ? btnPar : btnImpar;
      showNum(true);
      if (dicePar === esPar) {
        btn.classList.add('wpr-ok');
        streak++;
        setMsg(`✔ ¡Radar certero! La última cifra es <strong>${last}</strong>, que es ${esPar ? 'par (0, 2, 4, 6, 8)' : 'impar (1, 3, 5, 7, 9)'}: por eso todo el número es ${esPar ? 'PAR' : 'IMPAR'}.`, 'ok');
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('a' + awarded.size); pts(2); }
      } else {
        btn.classList.add('wpr-no');
        okBtn.classList.add('wpr-ok');
        streak = 0;
        setMsg(`💡 Era <strong>${esPar ? 'PAR' : 'IMPAR'}</strong>. El truco: mira solo la última cifra, el <strong>${last}</strong>. Las demás cifras no deciden nada.`, 'err');
        if (typeof sfx === 'function') sfx('no');
      }
      streakEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(newRound, 2400);
    }

    btnPar.addEventListener('click', () => answer(true));
    btnImpar.addEventListener('click', () => answer(false));

    newRound();
  }
};
