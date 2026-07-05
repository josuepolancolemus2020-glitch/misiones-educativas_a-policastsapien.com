// js/interaccion_saltos.js
// Widget Lab 2: La Rana Saltarina — la suma avanza y la resta retrocede.
// Primero se predice el resultado y luego se anima el salto de la rana
// sobre la recta de 0 a 100.

window.WidgetSaltosJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .ws-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .ws-op { font-family: 'Fira Code', monospace; font-size: 1.4rem; font-weight: 700; color: #1565c0; text-align: center; margin-bottom: 0.8rem; }
        .ws-line { display: flex; align-items: flex-end; margin: 1.4rem 0 0.9rem; }
        .ws-tick { flex: 1; text-align: center; position: relative; }
        .ws-rail { height: 3px; background: #1b2838; position: absolute; left: 0; right: 0; top: 24px; }
        .ws-frog { font-size: 1.1rem; height: 1.5rem; line-height: 1.5rem; }
        .ws-dot { width: 12px; height: 12px; border-radius: 50%; border: 2.5px solid #1b2838; background: #fff; margin: 2px auto 4px; position: relative; z-index: 1; transition: all 0.25s; }
        .ws-tick.ws-visited .ws-dot { background: #00838f; border-color: #00838f; }
        .ws-tick.ws-final .ws-dot { background: #00b894; border-color: #00b894; transform: scale(1.4); }
        .ws-lbl { font-family: 'Fredoka', sans-serif; font-size: 0.68rem; color: #1b2838; }
        .ws-pred { background: linear-gradient(135deg, rgba(108,92,231,0.08), rgba(21,101,192,0.08)); border: 2px solid #6c5ce7; border-radius: 12px; padding: 0.9rem 1.1rem; margin-bottom: 1rem; }
        .ws-pred-q { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; color: #1b2838; margin-bottom: 0.6rem; font-weight: 600; }
        .ws-pred-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .ws-pred-btn { font-family: 'Fredoka', sans-serif; font-size: 0.9rem; padding: 0.45rem 1rem; border: 2px solid #6c5ce7; border-radius: 20px; background: white; color: #6c5ce7; cursor: pointer; transition: all 0.2s; }
        .ws-pred-btn:hover:not(:disabled) { background: #6c5ce7; color: white; }
        .ws-pred-btn.ws-ok { background: #00b894; border-color: #00b894; color: white; }
        .ws-pred-btn.ws-no { background: #d63031; border-color: #d63031; color: white; }
        .ws-msg { font-size: 0.88rem; text-align: center; color: #636e72; min-height: 2.2rem; padding: 0.4rem 0.6rem; border-radius: 8px; line-height: 1.45; }
        .ws-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .ws-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .ws-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.8rem; flex-wrap: wrap; }
        .ws-btn { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .ws-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .ws-btn:disabled { opacity: 0.45; cursor: default; }
        .ws-btn.ws-btn-teal { background: #00838f; }
        [data-theme="dark"] .ws-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .ws-pred-q { color: #e8f0fe; }
        [data-theme="dark"] .ws-pred-btn { background: #1e2130; }
        [data-theme="dark"] .ws-lbl { color: #e8f0fe; }
        [data-theme="dark"] .ws-rail { background: #a0aec0; }
        [data-theme="dark"] .ws-dot { border-color: #a0aec0; background: #1e2130; }
        [data-theme="dark"] .ws-msg { color: #a0aec0; }
      </style>
      <div class="ws-container">
        <div class="ws-op" id="ws-op"></div>
        <div class="ws-pred" id="ws-pred">
          <div class="ws-pred-q" id="ws-pred-q"></div>
          <div class="ws-pred-opts" id="ws-pred-opts"></div>
        </div>
        <div class="ws-line" id="ws-line"></div>
        <div class="ws-msg" id="ws-msg">Primero predice el resultado.</div>
        <div class="ws-btn-row">
          <button class="ws-btn" id="ws-btn-go" disabled>🐸 Ver los saltos</button>
          <button class="ws-btn ws-btn-teal" id="ws-btn-new">🔄 Otro ejercicio</button>
        </div>
      </div>
    `;

    const lineEl = document.getElementById('ws-line');
    const opEl = document.getElementById('ws-op');
    const msgEl = document.getElementById('ws-msg');
    const predQEl = document.getElementById('ws-pred-q');
    const predOptsEl = document.getElementById('ws-pred-opts');
    const btnGo = document.getElementById('ws-btn-go');
    const btnNew = document.getElementById('ws-btn-new');
    let a = 30, b = 40, esSuma = true, result = 70, predicted = false, animating = false, animTimers = [];
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'ws-msg' + (cls ? ' ' + cls : ''); }
    function clearTimers() { animTimers.forEach(t => clearTimeout(t)); animTimers = []; }

    function renderLine(frogAt) {
      lineEl.innerHTML = '';
      for (let i = 0; i <= 10; i++) {
        const v = i * 10;
        const t = document.createElement('div');
        t.className = 'ws-tick';
        t.dataset.v = v;
        t.innerHTML = `<div class="ws-rail"></div><div class="ws-frog">${v === frogAt ? '🐸' : '&nbsp;'}</div><div class="ws-dot"></div><div class="ws-lbl">${v}</div>`;
        lineEl.appendChild(t);
      }
    }

    function newRound() {
      clearTimers(); animating = false; predicted = false;
      esSuma = Math.random() < 0.5;
      if (esSuma) { a = 10 * rint(1, 6); b = 10 * rint(1, (100 - a) / 10); result = a + b; }
      else { a = 10 * rint(4, 10); b = 10 * rint(1, a / 10 - 1); result = a - b; }
      opEl.textContent = `${a} ${esSuma ? '+' : '−'} ${b} = ?`;
      renderLine(a);
      btnGo.disabled = true;
      setMsg('Primero predice el resultado.');
      predQEl.textContent = `🔮 La rana está en el ${a}. Si ${esSuma ? 'avanza' : 'retrocede'} ${b}, ¿dónde caerá?`;
      const opts = [result];
      [result + 10, result - 10, esSuma ? a - b : a + b].forEach(v => { if (opts.length < 3 && v >= 0 && v <= 100 && !opts.includes(v)) opts.push(v); });
      while (opts.length < 3) opts.push(Math.min(100, result + 20 * opts.length));
      opts.sort(() => Math.random() - 0.5);
      predOptsEl.innerHTML = '';
      opts.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'ws-pred-btn';
        btn.textContent = v;
        btn.addEventListener('click', () => {
          if (predicted) return;
          predicted = true;
          predOptsEl.querySelectorAll('.ws-pred-btn').forEach(x => { x.disabled = true; });
          const isOk = v === result;
          btn.classList.add(isOk ? 'ws-ok' : 'ws-no');
          if (!isOk) predOptsEl.querySelectorAll('.ws-pred-btn').forEach(x => { if (parseInt(x.textContent) === result) x.classList.add('ws-ok'); });
          if (isOk) {
            setMsg(`✔ ¡Muy bien! Ahora mira a la rana dar sus ${b / 10} saltos de 10.`, 'ok');
            if (typeof sfx === 'function') sfx('ok');
            const key = a + '_' + b;
            if (awarded.size < 5 && !awarded.has(key) && typeof pts === 'function') { awarded.add(key); pts(2); }
          } else {
            setMsg(`💡 Caerá en el <strong>${result}</strong>: ${esSuma ? 'avanzar' : 'retroceder'} ${b} son ${b / 10} saltos de 10 hacia la ${esSuma ? 'derecha' : 'izquierda'}. Míralo con el botón 🐸.`, 'err');
            if (typeof sfx === 'function') sfx('no');
          }
          btnGo.disabled = false;
        });
        predOptsEl.appendChild(btn);
      });
    }

    function animate() {
      if (animating) return;
      animating = true; btnGo.disabled = true;
      renderLine(a);
      const dir = esSuma ? 10 : -10;
      const nSaltos = b / 10;
      for (let s = 1; s <= nSaltos; s++) {
        animTimers.push(setTimeout(() => {
          const pos = a + dir * s;
          lineEl.querySelectorAll('.ws-tick').forEach(t => {
            const v = parseInt(t.dataset.v);
            t.querySelector('.ws-frog').textContent = (v === pos) ? '🐸' : ' ';
            if (v === pos - dir) t.classList.add('ws-visited');
            if (v === pos && s === nSaltos) t.classList.add('ws-final');
          });
          if (typeof sfx === 'function') sfx('tick');
          if (s === nSaltos) {
            setMsg(`🐸 ¡Llegó! ${a} ${esSuma ? '+' : '−'} ${b} = <strong>${result}</strong>. ${esSuma ? 'Sumar es avanzar' : 'Restar es retroceder'} en la recta numérica.`, 'ok');
            opEl.textContent = `${a} ${esSuma ? '+' : '−'} ${b} = ${result}`;
            if (typeof sfx === 'function') sfx('fan');
            animating = false;
          }
        }, 420 * s));
      }
    }

    btnGo.addEventListener('click', () => { if (typeof sfx === 'function') sfx('click'); animate(); });
    btnNew.addEventListener('click', () => { if (typeof sfx === 'function') sfx('click'); newRound(); });

    newRound();
  }
};
