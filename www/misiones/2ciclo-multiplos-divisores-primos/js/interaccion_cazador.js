// js/interaccion_cazador.js
// Widget: Cazador de Divisores — dado un número, el estudiante toca en el
// tablero del 1 al 12 todos los que son divisores. El feedback enseña la
// división exacta o el residuo que delata al intruso.

window.WidgetCazadorJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wcd-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wcd-goal { font-family: 'Fredoka', sans-serif; font-size: 1.05rem; text-align: center; color: #1b2838; margin-bottom: 0.3rem; }
        .wcd-goal strong { color: #1565c0; font-size: 1.35rem; }
        .wcd-sub { font-size: 0.8rem; text-align: center; color: #636e72; margin-bottom: 0.9rem; }
        .wcd-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; max-width: 320px; margin: 0 auto 0.9rem; }
        .wcd-cell { font-family: 'Fredoka', sans-serif; font-size: 1rem; font-weight: 700; text-align: center; padding: 0.5rem 0; border: 2px solid #cfd8e3; border-radius: 10px; background: #f7f9fc; color: #1b2838; cursor: pointer; transition: all 0.15s; user-select: none; }
        .wcd-cell:hover { transform: scale(1.08); border-color: #1565c0; }
        .wcd-cell.wcd-hit { background: #00b894; border-color: #00b894; color: white; }
        .wcd-cell.wcd-miss { background: #d63031; border-color: #d63031; color: white; animation: wcdshake 0.3s; }
        @keyframes wcdshake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-4px);} 75%{transform:translateX(4px);} }
        .wcd-msg { font-size: 0.88rem; text-align: center; color: #636e72; min-height: 2.4rem; padding: 0.4rem 0.6rem; border-radius: 8px; line-height: 1.45; }
        .wcd-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wcd-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wcd-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.8rem; flex-wrap: wrap; }
        .wcd-btn { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wcd-btn:hover { transform: translateY(-2px); }
        .wcd-score { font-family: 'Fredoka', sans-serif; font-size: 0.78rem; text-align: center; color: #636e72; margin-top: 0.4rem; }
        [data-theme="dark"] .wcd-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wcd-goal { color: #e8f0fe; }
        [data-theme="dark"] .wcd-cell { background: #262b40; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .wcd-msg { color: #a0aec0; }
      </style>
      <div class="wcd-container">
        <div class="wcd-goal" id="wcd-goal"></div>
        <div class="wcd-sub" id="wcd-sub"></div>
        <div class="wcd-grid" id="wcd-grid"></div>
        <div class="wcd-msg" id="wcd-msg">Toca todos los divisores que encuentres en el tablero.</div>
        <div class="wcd-score" id="wcd-score">🏆 Cacerías completas: 0</div>
        <div class="wcd-btn-row">
          <button class="wcd-btn" id="wcd-btn-new">🔄 Otro número</button>
        </div>
      </div>
    `;

    const POOL = [12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 44, 45, 48, 60];
    const gridEl = document.getElementById('wcd-grid');
    const goalEl = document.getElementById('wcd-goal');
    const subEl = document.getElementById('wcd-sub');
    const msgEl = document.getElementById('wcd-msg');
    const scoreEl = document.getElementById('wcd-score');
    let n = 0, faltan = 0, cacerias = 0;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wcd-msg' + (cls ? ' ' + cls : ''); }

    function newRound() {
      n = POOL[rint(0, POOL.length - 1)];
      const targets = [];
      for (let v = 1; v <= 12; v++) if (n % v === 0) targets.push(v);
      faltan = targets.length;
      goalEl.innerHTML = `🎯 Caza los divisores de <strong>${n}</strong>`;
      subEl.textContent = `En el tablero del 1 al 12 se esconden ${faltan} divisores. Pista: búscalos en parejas (si a×b=${n}, ambos cuentan).`;
      setMsg('Toca todos los divisores que encuentres en el tablero.');
      gridEl.innerHTML = '';
      for (let v = 1; v <= 12; v++) {
        const c = document.createElement('div');
        c.className = 'wcd-cell';
        c.textContent = v;
        c.addEventListener('click', () => {
          if (c.classList.contains('wcd-hit') || faltan === 0) return;
          if (n % v === 0) {
            c.classList.add('wcd-hit');
            faltan--;
            if (typeof sfx === 'function') sfx('ok');
            if (faltan === 0) {
              cacerias++;
              scoreEl.textContent = '🏆 Cacerías completas: ' + cacerias;
              const divsAll = [];
              for (let i = 1; i <= n; i++) if (n % i === 0) divsAll.push(i);
              setMsg(`🎉 ¡Cacería completa! Del 1 al 12 atrapaste todos. TODOS los divisores de ${n} son: <strong>${divsAll.join(', ')}</strong>.`, 'ok');
              if (typeof sfx === 'function') sfx('fan');
              if (awarded.size < 5 && typeof pts === 'function') { awarded.add('c' + cacerias); pts(2); }
            } else {
              setMsg(`✔ ¡Atrapado! ${n} ÷ ${v} = ${n / v} exacto: el ${v} y el ${n / v} son pareja de divisores. Faltan <strong>${faltan}</strong>.`, 'ok');
            }
          } else {
            c.classList.add('wcd-miss');
            setTimeout(() => c.classList.remove('wcd-miss'), 600);
            setMsg(`💡 El ${v} no es divisor: ${n} ÷ ${v} = ${Math.floor(n / v)} y sobra un residuo de ${n % v}. La división debe ser exacta.`, 'err');
            if (typeof sfx === 'function') sfx('no');
          }
        });
        gridEl.appendChild(c);
      }
    }

    document.getElementById('wcd-btn-new').addEventListener('click', () => {
      if (typeof sfx === 'function') sfx('click');
      newRound();
    });

    newRound();
  }
};
