// js/interaccion_criba.js
// Widget Lab 1: La Criba Caza-Múltiplos — el estudiante toca TODOS los
// múltiplos del número pedido en la tabla del 1 al 30, como en la criba
// de Eratóstenes. El número objetivo cambia en cada ronda.

window.WidgetCribaJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wc-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wc-goal { font-family: 'Fredoka', sans-serif; font-size: 1.05rem; text-align: center; color: #1b2838; margin-bottom: 0.3rem; }
        .wc-goal strong { color: #1565c0; font-size: 1.3rem; }
        .wc-sub { font-size: 0.8rem; text-align: center; color: #636e72; margin-bottom: 0.9rem; }
        .wc-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 5px; max-width: 340px; margin: 0 auto 0.9rem; }
        .wc-cell { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; font-weight: 600; text-align: center; padding: 0.45rem 0; border: 2px solid #cfd8e3; border-radius: 10px; background: #f7f9fc; color: #1b2838; cursor: pointer; transition: all 0.15s; user-select: none; }
        .wc-cell:hover { transform: scale(1.08); border-color: #1565c0; }
        .wc-cell.wc-hit { background: #00b894; border-color: #00b894; color: white; transform: scale(1.05); }
        .wc-cell.wc-miss { background: #d63031; border-color: #d63031; color: white; animation: wcshake 0.3s; }
        @keyframes wcshake { 0%,100%{transform:translateX(0);} 25%{transform:translateX(-4px);} 75%{transform:translateX(4px);} }
        .wc-msg { font-size: 0.88rem; text-align: center; color: #636e72; min-height: 2.2rem; padding: 0.4rem 0.6rem; border-radius: 8px; line-height: 1.45; }
        .wc-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wc-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wc-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.8rem; flex-wrap: wrap; }
        .wc-btn { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wc-btn:hover { transform: translateY(-2px); }
        .wc-score { font-family: 'Fredoka', sans-serif; font-size: 0.78rem; text-align: center; color: #636e72; margin-top: 0.4rem; }
        [data-theme="dark"] .wc-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wc-goal { color: #e8f0fe; }
        [data-theme="dark"] .wc-cell { background: #262b40; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .wc-msg { color: #a0aec0; }
      </style>
      <div class="wc-container">
        <div class="wc-goal" id="wc-goal"></div>
        <div class="wc-sub" id="wc-sub"></div>
        <div class="wc-grid" id="wc-grid"></div>
        <div class="wc-msg" id="wc-msg">Toca todos los múltiplos del número pedido.</div>
        <div class="wc-score" id="wc-score">🏆 Rondas completadas: 0</div>
        <div class="wc-btn-row">
          <button class="wc-btn" id="wc-btn-new">🔄 Otra ronda</button>
        </div>
      </div>
    `;

    const TARGETS = [4, 5, 6, 7, 8, 9, 10];
    const MAX = 30;
    const gridEl = document.getElementById('wc-grid');
    const goalEl = document.getElementById('wc-goal');
    const subEl = document.getElementById('wc-sub');
    const msgEl = document.getElementById('wc-msg');
    const scoreEl = document.getElementById('wc-score');
    let n = 0, faltan = 0, rondas = 0, errores = 0;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wc-msg' + (cls ? ' ' + cls : ''); }

    function newRound() {
      n = TARGETS[rint(0, TARGETS.length - 1)];
      faltan = Math.floor(MAX / n);
      errores = 0;
      goalEl.innerHTML = `🎯 Caza los múltiplos de <strong>${n}</strong>`;
      subEl.textContent = `Hay ${faltan} escondidos entre el 1 y el ${MAX}. Recuerda: ${n}, ${n * 2}, ${n * 3}…`;
      setMsg('Toca todos los múltiplos del número pedido.');
      gridEl.innerHTML = '';
      for (let v = 1; v <= MAX; v++) {
        const c = document.createElement('div');
        c.className = 'wc-cell';
        c.textContent = v;
        c.addEventListener('click', () => {
          if (c.classList.contains('wc-hit') || faltan === 0) return;
          if (v % n === 0) {
            c.classList.add('wc-hit');
            faltan--;
            if (typeof sfx === 'function') sfx('ok');
            if (faltan === 0) {
              rondas++;
              scoreEl.textContent = '🏆 Rondas completadas: ' + rondas;
              setMsg(`🎉 ¡Criba completa! Cazaste todos los múltiplos de ${n}${errores === 0 ? ' sin fallar' : ''}. Son los resultados de la tabla del ${n}.`, 'ok');
              if (typeof sfx === 'function') sfx('fan');
              if (awarded.size < 5 && typeof pts === 'function') { awarded.add('r' + rondas); pts(2); }
            } else {
              setMsg(`✔ ¡Sí! ${v} = ${n} × ${v / n}. Te faltan <strong>${faltan}</strong> múltiplos.`, 'ok');
            }
          } else {
            errores++;
            c.classList.add('wc-miss');
            setTimeout(() => c.classList.remove('wc-miss'), 600);
            setMsg(`💡 El ${v} no está en la tabla del ${n}: ${n} × ${Math.floor(v / n)} = ${n * Math.floor(v / n)} y ${n} × ${Math.floor(v / n) + 1} = ${n * (Math.floor(v / n) + 1)}. ¡El ${v} queda en medio!`, 'err');
            if (typeof sfx === 'function') sfx('no');
          }
        });
        gridEl.appendChild(c);
      }
    }

    document.getElementById('wc-btn-new').addEventListener('click', () => {
      if (typeof sfx === 'function') sfx('click');
      newRound();
    });

    newRound();
  }
};
