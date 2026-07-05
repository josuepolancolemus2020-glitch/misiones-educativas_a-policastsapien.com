// js/interaccion_punto.js
// Widget: El Punto Misterioso — un punto rojo marca una posición en la recta
// y el estudiante elige qué número es. Con 3 aciertos seguidos sube de nivel
// (escalas más difíciles).

window.WidgetPuntoJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wp-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wp-top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 0.6rem; }
        .wp-lvl { font-family: 'Fredoka', sans-serif; font-size: 0.8rem; background: rgba(21,101,192,0.12); color: #1565c0; border-radius: 14px; padding: 0.2rem 0.7rem; font-weight: 700; }
        .wp-streak { font-family: 'Fredoka', sans-serif; font-size: 0.8rem; color: #636e72; }
        .wp-line { display: flex; align-items: flex-end; margin: 1.2rem 0 0.9rem; }
        .wp-tick { flex: 1; text-align: center; position: relative; }
        .wp-rail { height: 3px; background: #1b2838; position: absolute; left: 0; right: 0; top: 20px; }
        .wp-pt { font-size: 1rem; height: 1.3rem; line-height: 1.3rem; color: #d63031; }
        .wp-dot { width: 12px; height: 12px; border-radius: 50%; border: 2.5px solid #1b2838; background: #fff; margin: 2px auto 4px; position: relative; z-index: 1; }
        .wp-lbl { font-family: 'Fredoka', sans-serif; font-size: 0.68rem; color: #1b2838; min-height: 1rem; }
        .wp-q { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; text-align: center; color: #1b2838; margin-bottom: 0.6rem; font-weight: 600; }
        .wp-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
        .wp-opt { font-family: 'Fredoka', sans-serif; font-size: 1rem; padding: 0.5rem 1.2rem; border: 2px solid #1565c0; border-radius: 20px; background: white; color: #1565c0; cursor: pointer; transition: all 0.2s; font-weight: 700; }
        .wp-opt:hover:not(:disabled) { background: #1565c0; color: white; }
        .wp-opt.wp-ok { background: #00b894; border-color: #00b894; color: white; }
        .wp-opt.wp-no { background: #d63031; border-color: #d63031; color: white; }
        .wp-msg { font-size: 0.88rem; text-align: center; color: #636e72; min-height: 2.2rem; padding: 0.4rem 0.6rem; border-radius: 8px; margin-top: 0.6rem; line-height: 1.45; }
        .wp-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wp-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        [data-theme="dark"] .wp-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wp-q { color: #e8f0fe; }
        [data-theme="dark"] .wp-lbl { color: #e8f0fe; }
        [data-theme="dark"] .wp-rail { background: #a0aec0; }
        [data-theme="dark"] .wp-dot { border-color: #a0aec0; background: #1e2130; }
        [data-theme="dark"] .wp-opt { background: #1e2130; }
        [data-theme="dark"] .wp-msg { color: #a0aec0; }
      </style>
      <div class="wp-container">
        <div class="wp-top">
          <span class="wp-lvl" id="wp-lvl"></span>
          <span class="wp-streak" id="wp-streak"></span>
        </div>
        <div class="wp-line" id="wp-line"></div>
        <div class="wp-q">🕵️ ¿Qué número marca el punto rojo 🔻?</div>
        <div class="wp-opts" id="wp-opts"></div>
        <div class="wp-msg" id="wp-msg">Observa los extremos de la recta y cuenta los saltos.</div>
      </div>
    `;

    const LEVELS = [
      { name: 'Nivel 1 · de 10 en 10', start: 0, step: 10 },
      { name: 'Nivel 2 · de 50 en 50', start: 0, step: 50 },
      { name: 'Nivel 3 · de 100 en 100', start: 0, step: 100 },
      { name: 'Nivel 4 · de 25 en 25', start: 200, step: 25 }
    ];
    const lineEl = document.getElementById('wp-line');
    const optsEl = document.getElementById('wp-opts');
    const msgEl = document.getElementById('wp-msg');
    const lvlEl = document.getElementById('wp-lvl');
    const streakEl = document.getElementById('wp-streak');
    let lvl = 0, streak = 0, k = 3, answer = 0, answered = false;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function fmt(n) { return n.toLocaleString('en-US'); }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wp-msg' + (cls ? ' ' + cls : ''); }
    function upTop() { lvlEl.textContent = '🏔️ ' + LEVELS[lvl].name; streakEl.textContent = `🔥 Racha: ${streak}/3 para subir de nivel`; }

    function newRound() {
      const L = LEVELS[lvl];
      k = rint(1, 9); answer = L.start + k * L.step; answered = false;
      upTop();
      lineEl.innerHTML = '';
      for (let i = 0; i <= 10; i++) {
        const t = document.createElement('div');
        t.className = 'wp-tick';
        const lbl = (i === 0 || i === 10) ? fmt(L.start + i * L.step) : '&nbsp;';
        t.innerHTML = `<div class="wp-rail"></div><div class="wp-pt">${i === k ? '🔻' : '&nbsp;'}</div><div class="wp-dot"></div><div class="wp-lbl">${lbl}</div>`;
        lineEl.appendChild(t);
      }
      const opts = [answer];
      [answer + L.step, answer - L.step, answer + 2 * L.step].forEach(v => { if (opts.length < 3 && v > L.start && v < L.start + 10 * L.step && !opts.includes(v)) opts.push(v); });
      while (opts.length < 3) opts.push(answer + 3 * L.step);
      opts.sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      opts.forEach(v => {
        const b = document.createElement('button');
        b.className = 'wp-opt';
        b.textContent = fmt(v);
        b.addEventListener('click', () => {
          if (answered) return;
          answered = true;
          optsEl.querySelectorAll('.wp-opt').forEach(x => { x.disabled = true; });
          const isOk = v === answer;
          b.classList.add(isOk ? 'wp-ok' : 'wp-no');
          if (!isOk) optsEl.querySelectorAll('.wp-opt').forEach(x => { if (x.textContent === fmt(answer)) x.classList.add('wp-ok'); });
          if (isOk) {
            streak++;
            setMsg(`✔ ¡Exacto! El punto está a ${k} saltos de ${fmt(LEVELS[lvl].start)}: ${k} × ${LEVELS[lvl].step}${LEVELS[lvl].start ? ' + ' + fmt(LEVELS[lvl].start) : ''} = <strong>${fmt(answer)}</strong>.`, 'ok');
            if (typeof sfx === 'function') sfx('ok');
            if (awarded.size < 6 && !awarded.has(lvl + '_' + answer) && typeof pts === 'function') { awarded.add(lvl + '_' + answer); pts(2); }
            if (streak >= 3 && lvl < LEVELS.length - 1) {
              lvl++; streak = 0;
              setMsg(`🎉 ¡3 seguidos! Subes al <strong>${LEVELS[lvl].name}</strong>.`, 'ok');
              if (typeof sfx === 'function') sfx('up');
            }
          } else {
            streak = 0;
            setMsg(`💡 Era <strong>${fmt(answer)}</strong>: el punto está a ${k} saltos de ${fmt(LEVELS[lvl].start)} y cada salto vale ${LEVELS[lvl].step}.`, 'err');
            if (typeof sfx === 'function') sfx('no');
          }
          upTop();
          setTimeout(newRound, 2200);
        });
        optsEl.appendChild(b);
      });
    }

    newRound();
  }
};
