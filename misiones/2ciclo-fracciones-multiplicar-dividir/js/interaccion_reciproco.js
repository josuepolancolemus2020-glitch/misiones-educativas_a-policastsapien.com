// js/interaccion_reciproco.js
// Widget: La Máquina del Recíproco. Dividir fracciones se falla casi siempre
// por lo mismo: se voltea la primera. Aquí el alumno tiene que ELEGIR cuál
// voltea antes de ver el resultado, así que el error sale a la luz en el
// momento en que se comete y no tres semanas después, en el examen.

window.WidgetReciprocoJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wrc-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wrc-op { font-family:'Fira Code',monospace; font-size:1.5rem; font-weight:700; color:#1b2838; text-align:center; margin-bottom:0.8rem; letter-spacing:0.04em; }
        .wrc-op .wrc-hl { background:#fff3cd; border-radius:4px; padding:0 4px; }
        .wrc-steps { background:#f5f7fb; border-radius:10px; padding:0.6rem 0.8rem; margin-bottom:0.7rem; min-height:2.2rem; font-family:'Fira Code',monospace; font-size:0.95rem; color:#1b2838; text-align:center; line-height:1.9; }
        .wrc-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wrc-opt { font-family:'Fredoka',sans-serif; font-size:0.92rem; padding:0.5rem 1rem; border:2px solid #00838f; border-radius:20px; background:#fff; color:#00838f; cursor:pointer; font-weight:700; transition:all 0.2s; }
        .wrc-opt:hover:not(:disabled) { background:#00838f; color:#fff; }
        .wrc-opt.wrc-ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wrc-opt.wrc-no { background:#d63031; border-color:#d63031; color:#fff; }
        .wrc-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wrc-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wrc-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wrc-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wrc-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wrc-op, [data-theme="dark"] .wrc-steps { color:#e8f0fe; }
        [data-theme="dark"] .wrc-steps { background:#161a26; }
        [data-theme="dark"] .wrc-opt { background:#1e2130; }
        [data-theme="dark"] .wrc-msg { color:#a0aec0; }
        [data-theme="dark"] .wrc-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wrc-msg.err { color:#ffb3b3; }
      </style>
      <div class="wrc-container">
        <div class="wrc-op" id="wrc-op"></div>
        <div class="wrc-steps" id="wrc-steps">La máquina espera: ¿cuál de las dos fracciones hay que voltear?</div>
        <div class="wrc-opts" id="wrc-opts"></div>
        <div class="wrc-msg" id="wrc-msg">Recuerda la regla: se voltea la que divide.</div>
        <div class="wrc-streak" id="wrc-streak">🔥 Racha: 0</div>
      </div>`;

    const opEl = document.getElementById('wrc-op');
    const stEl = document.getElementById('wrc-steps');
    const optsEl = document.getElementById('wrc-opts');
    const msgEl = document.getElementById('wrc-msg');
    const streakEl = document.getElementById('wrc-streak');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();

    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const mcd = (a, b) => { while (b) { const t = b; b = a % b; a = t; } return a || 1; };
    const fmt = (n, d) => { const g = mcd(n, d); const x = n / g, y = d / g; return y === 1 ? String(x) : x + '/' + y; };

    function nueva() {
      const b = rint(2, 9), a = rint(1, b - 1);
      const d = rint(2, 9), c = rint(1, d);
      cur = { a, b, c, d };
      answered = false;
      opEl.innerHTML = `${a}/${b} &divide; ${c}/${d}`;
      stEl.textContent = 'La máquina espera: ¿cuál de las dos fracciones hay que voltear?';
      optsEl.innerHTML = '';
      [['🔄 voltear la primera', 'p'], ['🔄 voltear la segunda', 's'], ['➡️ no voltear ninguna', 'n']]
        .sort(() => Math.random() - 0.5)
        .forEach(([txt, key]) => {
          const btn = document.createElement('button');
          btn.className = 'wrc-opt'; btn.textContent = txt;
          btn.onclick = () => responder(btn, key);
          optsEl.appendChild(btn);
        });
      msgEl.className = 'wrc-msg';
      msgEl.innerHTML = 'Recuerda la regla: se voltea la que divide.';
    }

    function responder(btn, key) {
      if (answered) return;
      answered = true;
      optsEl.querySelectorAll('.wrc-opt').forEach(b => {
        b.disabled = true;
        if (b.textContent.indexOf('segunda') > -1) b.classList.add('wrc-ok');
      });
      const { a, b, c, d } = cur;
      if (key === 's') {
        streak++;
        stEl.innerHTML = `${a}/${b} ÷ ${c}/${d} → ${a}/${b} × <span class="wrc-hl">${d}/${c}</span> = ${a * d}/${b * c} = <strong>${fmt(a * d, b * c)}</strong>`;
        msgEl.className = 'wrc-msg ok';
        msgEl.innerHTML = `✔ ¡Bien! Se voltea la segunda y se multiplica: el resultado es <strong>${fmt(a * d, b * c)}</strong>.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 5 && typeof pts === 'function') { awarded.add('r' + awarded.size); pts(2); }
      } else if (key === 'p') {
        btn.classList.add('wrc-no'); streak = 0;
        stEl.innerHTML = `${b}/${a} × ${c}/${d} = ${b * c}/${a * d} ❌ ese no es el resultado`;
        msgEl.className = 'wrc-msg err';
        msgEl.innerHTML = `💡 Volteaste la primera. La que se voltea es la que <strong>divide</strong>, o sea la segunda: ${a}/${b} × ${d}/${c} = <strong>${fmt(a * d, b * c)}</strong>.`;
        if (typeof sfx === 'function') sfx('no');
      } else {
        btn.classList.add('wrc-no'); streak = 0;
        stEl.innerHTML = `${a}/${b} × ${c}/${d} = ${a * c}/${b * d} ❌ eso es multiplicar, no dividir`;
        msgEl.className = 'wrc-msg err';
        msgEl.innerHTML = `💡 Sin voltear nada estarías multiplicando. Para dividir: ${a}/${b} × <strong>${d}/${c}</strong> = <strong>${fmt(a * d, b * c)}</strong>.`;
        if (typeof sfx === 'function') sfx('no');
      }
      streakEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3400);
    }

    nueva();
  }
};
