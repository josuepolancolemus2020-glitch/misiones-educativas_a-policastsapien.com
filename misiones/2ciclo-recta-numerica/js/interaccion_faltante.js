// js/interaccion_faltante.js
// Widget: El Número Escondido — ecuaciones con una casilla vacía (▢).
// Se resuelven con la operación inversa; el feedback enseña el porqué.

window.WidgetFaltanteJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wf-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wf-eq { font-family: 'Fira Code', monospace; font-size: 1.5rem; font-weight: 700; color: #1b2838; text-align: center; margin-bottom: 0.9rem; letter-spacing: 0.05em; }
        .wf-eq .wf-box { color: #d84315; }
        .wf-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
        .wf-opt { font-family: 'Fredoka', sans-serif; font-size: 1rem; padding: 0.5rem 1.2rem; border: 2px solid #d84315; border-radius: 20px; background: white; color: #d84315; cursor: pointer; transition: all 0.2s; font-weight: 700; }
        .wf-opt:hover:not(:disabled) { background: #d84315; color: white; }
        .wf-opt.wf-ok { background: #00b894; border-color: #00b894; color: white; }
        .wf-opt.wf-no { background: #d63031; border-color: #d63031; color: white; }
        .wf-msg { font-size: 0.88rem; text-align: center; color: #636e72; min-height: 2.4rem; padding: 0.4rem 0.6rem; border-radius: 8px; margin-top: 0.7rem; line-height: 1.45; }
        .wf-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wf-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wf-streak { font-family: 'Fredoka', sans-serif; font-size: 0.8rem; text-align: center; color: #636e72; margin-top: 0.4rem; }
        [data-theme="dark"] .wf-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wf-eq { color: #e8f0fe; }
        [data-theme="dark"] .wf-opt { background: #1e2130; }
        [data-theme="dark"] .wf-msg { color: #a0aec0; }
      </style>
      <div class="wf-container">
        <div class="wf-eq" id="wf-eq"></div>
        <div class="wf-opts" id="wf-opts"></div>
        <div class="wf-msg" id="wf-msg">¿Qué número se esconde en la casilla ▢? Usa la operación inversa.</div>
        <div class="wf-streak" id="wf-streak">🔥 Racha: 0</div>
      </div>
    `;

    const eqEl = document.getElementById('wf-eq');
    const optsEl = document.getElementById('wf-opts');
    const msgEl = document.getElementById('wf-msg');
    const streakEl = document.getElementById('wf-streak');
    let answered = false, streak = 0;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wf-msg' + (cls ? ' ' + cls : ''); }

    function genEq() {
      const f = rint(0, 3);
      if (f === 0) { const x = rint(15, 380), a = rint(15, 380); return { html: `<span class="wf-box">▢</span> + ${a} = ${x + a}`, ans: x, how: `resta: ${x + a} − ${a} = ${x}` }; }
      if (f === 1) { const x = rint(15, 380), a = rint(15, 380); return { html: `${a} + <span class="wf-box">▢</span> = ${x + a}`, ans: x, how: `resta: ${x + a} − ${a} = ${x}` }; }
      if (f === 2) { const c = rint(150, 900), x = rint(40, c - 40); return { html: `${c} − <span class="wf-box">▢</span> = ${c - x}`, ans: x, how: `resta: ${c} − ${c - x} = ${x}` }; }
      const a = rint(40, 300), d = rint(40, 400); return { html: `<span class="wf-box">▢</span> − ${a} = ${d}`, ans: a + d, how: `suma: ${d} + ${a} = ${a + d}` };
    }

    function newRound() {
      const eq = genEq();
      answered = false;
      eqEl.innerHTML = eq.html;
      const opts = [eq.ans];
      [eq.ans + 10, eq.ans - 10, eq.ans + 100, eq.ans - 100].forEach(v => { if (opts.length < 3 && v > 0 && !opts.includes(v)) opts.push(v); });
      opts.sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      opts.forEach(v => {
        const b = document.createElement('button');
        b.className = 'wf-opt';
        b.textContent = v;
        b.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          optsEl.querySelectorAll('.wf-opt').forEach(x => { x.disabled = true; });
          const isOk = v === eq.ans;
          b.classList.add(isOk ? 'wf-ok' : 'wf-no');
          if (!isOk) optsEl.querySelectorAll('.wf-opt').forEach(x => { if (parseInt(x.textContent) === eq.ans) x.classList.add('wf-ok'); });
          if (isOk) {
            streak++;
            setMsg(`✔ ¡Correcto! ▢ = <strong>${eq.ans}</strong>. Lo descubres con la operación inversa (${eq.how}).`, 'ok');
            if (typeof sfx === 'function') sfx('ok');
            if (awarded.size < 6 && typeof pts === 'function') { awarded.add('w' + awarded.size); pts(2); }
          } else {
            streak = 0;
            setMsg(`💡 Era <strong>${eq.ans}</strong>. Truco: usa la operación inversa (${eq.how}) y comprueba poniendo el número en la casilla.`, 'err');
            if (typeof sfx === 'function') sfx('no');
          }
          streakEl.textContent = '🔥 Racha: ' + streak;
          setTimeout(newRound, 2400);
        });
        optsEl.appendChild(b);
      });
    }

    newRound();
  }
};
