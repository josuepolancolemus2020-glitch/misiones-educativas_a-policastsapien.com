// js/interaccion_recta.js
// Widget Lab 1: Explorador de la Recta — el estudiante toca la marca donde
// vive el número pedido. La escala cambia en cada ronda.

window.WidgetRectaJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wr-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wr-goal { font-family: 'Fredoka', sans-serif; font-size: 1.05rem; text-align: center; color: #1b2838; margin-bottom: 0.3rem; }
        .wr-goal strong { color: #1565c0; font-size: 1.3rem; }
        .wr-esc { font-size: 0.8rem; text-align: center; color: #636e72; margin-bottom: 0.9rem; }
        .wr-line { display: flex; align-items: flex-end; margin: 0.4rem 0 0.9rem; }
        .wr-tick { flex: 1; text-align: center; cursor: pointer; position: relative; padding-top: 4px; }
        .wr-rail { height: 3px; background: #1b2838; position: absolute; left: 0; right: 0; top: 18px; }
        .wr-dot { width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid #1b2838; background: #fff; margin: 8px auto 4px; position: relative; z-index: 1; transition: all 0.2s; }
        .wr-tick:hover .wr-dot { transform: scale(1.3); border-color: #1565c0; }
        .wr-tick.wr-ok .wr-dot { background: #00b894; border-color: #00b894; transform: scale(1.35); }
        .wr-tick.wr-no .wr-dot { background: #d63031; border-color: #d63031; }
        .wr-tick.wr-show .wr-dot { background: #fdcb6e; border-color: #e17055; transform: scale(1.35); }
        .wr-lbl { font-family: 'Fredoka', sans-serif; font-size: 0.7rem; color: #1b2838; min-height: 1rem; }
        .wr-msg { font-size: 0.88rem; text-align: center; color: #636e72; min-height: 2.2rem; padding: 0.4rem 0.6rem; border-radius: 8px; line-height: 1.45; }
        .wr-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wr-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wr-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.8rem; flex-wrap: wrap; }
        .wr-btn { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wr-btn:hover { transform: translateY(-2px); }
        .wr-score { font-family: 'Fredoka', sans-serif; font-size: 0.78rem; text-align: center; color: #636e72; margin-top: 0.4rem; }
        [data-theme="dark"] .wr-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wr-goal { color: #e8f0fe; }
        [data-theme="dark"] .wr-lbl { color: #e8f0fe; }
        [data-theme="dark"] .wr-rail { background: #a0aec0; }
        [data-theme="dark"] .wr-dot { border-color: #a0aec0; background: #1e2130; }
        [data-theme="dark"] .wr-msg { color: #a0aec0; }
      </style>
      <div class="wr-container">
        <div class="wr-goal" id="wr-goal"></div>
        <div class="wr-esc" id="wr-esc"></div>
        <div class="wr-line" id="wr-line"></div>
        <div class="wr-msg" id="wr-msg">Toca la marca donde vive el número pedido.</div>
        <div class="wr-score" id="wr-score">✔ 0 aciertos · ✗ 0 intentos fallidos</div>
        <div class="wr-btn-row">
          <button class="wr-btn" id="wr-btn-new">🔄 Otra recta</button>
        </div>
      </div>
    `;

    const CONFIGS = [
      { start: 0, step: 5 }, { start: 0, step: 10 }, { start: 0, step: 100 },
      { start: 100, step: 10 }, { start: 200, step: 25 }, { start: 500, step: 50 }
    ];
    const lineEl = document.getElementById('wr-line');
    const goalEl = document.getElementById('wr-goal');
    const escEl = document.getElementById('wr-esc');
    const msgEl = document.getElementById('wr-msg');
    const scoreEl = document.getElementById('wr-score');
    let cfg = null, targetIdx = 0, target = 0, answered = false, okCount = 0, errCount = 0;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function fmt(n) { return n.toLocaleString('en-US'); }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wr-msg' + (cls ? ' ' + cls : ''); }
    function upScore() { scoreEl.textContent = `✔ ${okCount} aciertos · ✗ ${errCount} intentos fallidos`; }

    function newRound() {
      cfg = CONFIGS[rint(0, CONFIGS.length - 1)];
      targetIdx = rint(1, 9);
      target = cfg.start + targetIdx * cfg.step;
      answered = false;
      goalEl.innerHTML = `📍 Ubica el número <strong>${fmt(target)}</strong>`;
      escEl.textContent = `La recta va de ${fmt(cfg.start)} a ${fmt(cfg.start + 10 * cfg.step)} con escala de ${cfg.step} en ${cfg.step}.`;
      setMsg('Toca la marca donde vive el número pedido.');
      lineEl.innerHTML = '';
      for (let i = 0; i <= 10; i++) {
        const t = document.createElement('div');
        t.className = 'wr-tick';
        const lbl = (i === 0 || i === 5 || i === 10) ? fmt(cfg.start + i * cfg.step) : '&nbsp;';
        t.innerHTML = `<div class="wr-rail"></div><div class="wr-dot"></div><div class="wr-lbl">${lbl}</div>`;
        t.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          if (i === targetIdx) {
            t.classList.add('wr-ok');
            okCount++;
            const saltos = targetIdx;
            setMsg(`✔ ¡Correcto! Desde ${fmt(cfg.start)} das <strong>${saltos} saltos</strong> de ${cfg.step}: ${saltos} × ${cfg.step} = ${fmt(saltos * cfg.step)}${cfg.start ? ' y sumas el inicio' : ''}.`, 'ok');
            if (typeof sfx === 'function') sfx('ok');
            if (awarded.size < 5 && !awarded.has(target) && typeof pts === 'function') { awarded.add(target); pts(2); }
          } else {
            t.classList.add('wr-no');
            errCount++;
            const correct = lineEl.children[targetIdx];
            if (correct) correct.classList.add('wr-show');
            setMsg(`💡 Esa marca es el <strong>${fmt(cfg.start + i * cfg.step)}</strong>. El ${fmt(target)} está en la marca amarilla: cuenta ${targetIdx} saltos de ${cfg.step} desde ${fmt(cfg.start)}.`, 'err');
            if (typeof sfx === 'function') sfx('no');
          }
          upScore();
        });
        lineEl.appendChild(t);
      }
    }

    document.getElementById('wr-btn-new').addEventListener('click', () => {
      if (typeof sfx === 'function') sfx('click');
      newRound();
    });

    newRound();
  }
};
