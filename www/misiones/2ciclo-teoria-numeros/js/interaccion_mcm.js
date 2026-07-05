// js/interaccion_mcm.js
// Widget: La Carrera al m.c.m. — la rana salta de a en a y el conejo de b en b
// sobre una recta numérica. El estudiante predice en qué casilla caen juntos por
// primera vez (el m.c.m.) y luego ve la animación de los saltos.

window.WidgetMcmJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wm-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wm-selects { display: flex; gap: 0.8rem; justify-content: center; align-items: center; flex-wrap: wrap; margin-bottom: 0.9rem; font-family: 'Fredoka', sans-serif; font-size: 0.9rem; color: #1b2838; }
        .wm-sel { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; padding: 0.35rem 0.6rem; border: 2px solid #1565c0; border-radius: 10px; background: white; color: #1565c0; cursor: pointer; }
        .wm-pred { background: linear-gradient(135deg, rgba(108,92,231,0.08), rgba(21,101,192,0.08)); border: 2px solid #6c5ce7; border-radius: 12px; padding: 0.9rem 1.1rem; margin-bottom: 1rem; }
        .wm-pred-q { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; color: #1b2838; margin-bottom: 0.6rem; font-weight: 600; }
        .wm-pred-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .wm-pred-btn { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; padding: 0.45rem 1.1rem; border: 2px solid #6c5ce7; border-radius: 20px; background: white; color: #6c5ce7; cursor: pointer; transition: all 0.2s; }
        .wm-pred-btn:hover:not(:disabled) { background: #6c5ce7; color: white; }
        .wm-pred-btn.wm-ok { background: #00b894; border-color: #00b894; color: white; }
        .wm-pred-btn.wm-no { background: #d63031; border-color: #d63031; color: white; }
        .wm-track-wrap { overflow-x: auto; padding-bottom: 0.4rem; margin-bottom: 0.5rem; }
        .wm-track { display: flex; gap: 3px; min-width: max-content; padding: 0.4rem 0.2rem; }
        .wm-cell { position: relative; width: 34px; height: 58px; border-radius: 8px; border: 1.5px solid #dcdde1; background: #fafafa; display: flex; align-items: flex-end; justify-content: center; font-family: 'Fredoka', sans-serif; font-size: 0.68rem; color: #636e72; padding-bottom: 3px; flex-shrink: 0; transition: all 0.3s; }
        .wm-cell.wm-rana { background: rgba(0,184,148,0.16); border-color: #00b894; }
        .wm-cell.wm-conejo { background: rgba(245,158,11,0.16); border-color: #f59e0b; }
        .wm-cell.wm-both { background: linear-gradient(135deg, rgba(0,184,148,0.25), rgba(245,158,11,0.25)); border-color: #6c5ce7; box-shadow: 0 0 8px rgba(108,92,231,0.5); }
        .wm-cell.wm-mcm { border-width: 2.5px; border-color: #6c5ce7; animation: wmPulse 1s ease infinite alternate; }
        @keyframes wmPulse { from { transform: scale(1); } to { transform: scale(1.12); } }
        .wm-anim { position: absolute; top: 2px; left: 0; right: 0; text-align: center; font-size: 0.9rem; line-height: 1; }
        .wm-msg { font-size: 0.88rem; text-align: center; min-height: 2rem; padding: 0.4rem 0.6rem; border-radius: 8px; color: #636e72; line-height: 1.45; }
        .wm-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wm-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wm-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.7rem; flex-wrap: wrap; }
        .wm-btn { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wm-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .wm-btn:disabled { opacity: 0.45; cursor: default; }
        .wm-btn.wm-btn-amber { background: #f59e0b; }
        .wm-legend { display: flex; gap: 1rem; justify-content: center; font-size: 0.78rem; color: #636e72; margin-bottom: 0.5rem; flex-wrap: wrap; }
        [data-theme="dark"] .wm-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wm-selects { color: #e8f0fe; }
        [data-theme="dark"] .wm-sel { background: #1e2130; }
        [data-theme="dark"] .wm-pred-q { color: #e8f0fe; }
        [data-theme="dark"] .wm-pred-btn { background: #1e2130; }
        [data-theme="dark"] .wm-cell { background: #171923; border-color: #2d3450; color: #a0aec0; }
        [data-theme="dark"] .wm-msg { color: #a0aec0; }
      </style>
      <div class="wm-container">
        <div class="wm-selects">
          🐸 salta de <select class="wm-sel" id="wm-sel-a"></select> en <span id="wm-lbl-a">3</span>
          &nbsp;·&nbsp;
          🐰 salta de <select class="wm-sel" id="wm-sel-b"></select> en <span id="wm-lbl-b">4</span>
        </div>
        <div class="wm-pred" id="wm-pred">
          <div class="wm-pred-q" id="wm-pred-q"></div>
          <div class="wm-pred-opts" id="wm-pred-opts"></div>
        </div>
        <div class="wm-legend"><span>🐸 verde = rana</span><span>🐰 anaranjado = conejo</span><span>💜 morado = ¡caen juntos!</span></div>
        <div class="wm-track-wrap"><div class="wm-track" id="wm-track"></div></div>
        <div class="wm-msg" id="wm-msg">Elige los saltos, haz tu predicción y presiona ¡Saltar!</div>
        <div class="wm-btn-row">
          <button class="wm-btn" id="wm-btn-go">🏁 ¡Saltar!</button>
          <button class="wm-btn wm-btn-amber" id="wm-btn-new">🔄 Nueva carrera</button>
        </div>
      </div>
    `;

    const selA = document.getElementById('wm-sel-a');
    const selB = document.getElementById('wm-sel-b');
    const lblA = document.getElementById('wm-lbl-a');
    const lblB = document.getElementById('wm-lbl-b');
    const predQ = document.getElementById('wm-pred-q');
    const predOpts = document.getElementById('wm-pred-opts');
    const track = document.getElementById('wm-track');
    const msgEl = document.getElementById('wm-msg');
    const btnGo = document.getElementById('wm-btn-go');
    const btnNew = document.getElementById('wm-btn-new');

    for (let v = 2; v <= 10; v++) {
      selA.add(new Option(v, v));
      selB.add(new Option(v, v));
    }
    let a = 3, b = 4, running = false, predicted = false, xpAwards = 0;

    function gcd(x, y) { while (y) { [x, y] = [y, x % y]; } return x; }
    function lcm(x, y) { return (x * y) / gcd(x, y); }
    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wm-msg' + (cls ? ' ' + cls : ''); }

    function buildTrack() {
      const m = lcm(a, b);
      const limit = Math.min(m + Math.min(a, b), 90);
      track.innerHTML = '';
      for (let i = 1; i <= limit; i++) {
        const cell = document.createElement('div');
        cell.className = 'wm-cell'; cell.id = 'wm-c-' + i; cell.textContent = i;
        const anim = document.createElement('div'); anim.className = 'wm-anim'; anim.id = 'wm-a-' + i;
        cell.appendChild(anim);
        track.appendChild(cell);
      }
    }

    function buildPred() {
      predicted = false;
      const m = lcm(a, b);
      const wrongs = new Set();
      wrongs.add(a * b === m ? m + Math.min(a, b) : a * b);
      wrongs.add(gcd(a, b) === m ? m * 2 : gcd(a, b) === 1 ? Math.max(a, b) : gcd(a, b));
      const opts = [...wrongs].filter(v => v !== m).slice(0, 2);
      opts.push(m);
      opts.sort(() => Math.random() - 0.5);
      predQ.textContent = `🔮 Predicción: ¿en qué casilla caerán JUNTOS por primera vez la rana (de ${a} en ${a}) y el conejo (de ${b} en ${b})?`;
      predOpts.innerHTML = '';
      opts.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'wm-pred-btn'; btn.textContent = 'En la casilla ' + v;
        btn.onclick = () => {
          if (predicted) return;
          predicted = true;
          predOpts.querySelectorAll('.wm-pred-btn').forEach(x => { x.disabled = true; });
          if (v === m) {
            btn.classList.add('wm-ok');
            setMsg('✔ ¡Buena predicción!' + (xpAwards < 4 ? ' +3 XP.' : '') + ' Ahora presiona ¡Saltar! para comprobarlo.', 'ok');
            if (typeof pts === 'function' && xpAwards < 4) { pts(3); xpAwards++; }
            if (typeof sfx === 'function') sfx('ok');
          } else {
            btn.classList.add('wm-no');
            predOpts.querySelectorAll('.wm-pred-btn').forEach(x => { if (x.textContent === 'En la casilla ' + m) x.classList.add('wm-ok'); });
            setMsg('💡 Era la casilla ' + m + '. Presiona ¡Saltar! y observa por qué.', 'err');
            if (typeof sfx === 'function') sfx('no');
          }
        };
        predOpts.appendChild(btn);
      });
    }

    function reset() {
      a = parseInt(selA.value, 10); b = parseInt(selB.value, 10);
      lblA.textContent = a; lblB.textContent = b;
      running = false; btnGo.disabled = false;
      buildTrack(); buildPred();
      setMsg('Haz tu predicción y presiona ¡Saltar!');
    }

    async function race() {
      if (running) return;
      running = true; btnGo.disabled = true;
      if (typeof sfx === 'function') sfx('click');
      const m = lcm(a, b);
      const limit = Math.min(m + Math.min(a, b), 90);
      const delay = ms => new Promise(r => setTimeout(r, ms));
      const ranaSet = new Set(), conejoSet = new Set();
      for (let paso = 1; paso * Math.min(a, b) <= limit; paso++) {
        const pa = paso * a, pb = paso * b;
        if (pa <= limit && !ranaSet.has(pa)) {
          ranaSet.add(pa);
          const c = document.getElementById('wm-c-' + pa);
          if (c) { c.classList.add(conejoSet.has(pa) ? 'wm-both' : 'wm-rana'); document.getElementById('wm-a-' + pa).textContent = conejoSet.has(pa) ? '🐸🐰' : '🐸'; c.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }
        }
        if (pb <= limit && !conejoSet.has(pb)) {
          conejoSet.add(pb);
          const c = document.getElementById('wm-c-' + pb);
          if (c) { const both = ranaSet.has(pb); c.classList.remove('wm-rana'); c.classList.add(both ? 'wm-both' : 'wm-conejo'); document.getElementById('wm-a-' + pb).textContent = both ? '🐸🐰' : '🐰'; }
        }
        if (typeof sfx === 'function') sfx('tick');
        await delay(420);
        if (ranaSet.has(m) && conejoSet.has(m)) break;
      }
      const mc = document.getElementById('wm-c-' + m);
      if (mc) { mc.classList.add('wm-both', 'wm-mcm'); document.getElementById('wm-a-' + m).textContent = '🐸🐰'; mc.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' }); }
      setMsg(`🏆 ¡Cayeron juntos en la casilla <strong>${m}</strong>! Por eso m.c.m.(${a}, ${b}) = <strong>${m}</strong>: es el primer múltiplo que comparten.`, 'ok');
      if (typeof sfx === 'function') sfx('fan');
      running = false;
    }

    selA.onchange = reset;
    selB.onchange = reset;
    btnGo.onclick = race;
    btnNew.onclick = () => {
      if (typeof sfx === 'function') sfx('click');
      selA.value = rint(2, 10); selB.value = rint(2, 10);
      if (selA.value === selB.value) selB.value = (parseInt(selB.value, 10) % 9) + 2;
      reset();
    };

    selA.value = 3; selB.value = 4;
    reset();
  }
};
