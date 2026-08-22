// js/interaccion_crece.js
// Widget: Radar ¿Crece o Encoge? Con enteros, multiplicar siempre agranda y
// dividir siempre achica; con fracciones puede pasar lo contrario, y el alumno
// llega a 6.º con la costumbre hecha. Decidir ANTES de calcular es lo que
// rompe esa costumbre: si el resultado le sorprende, es que la tenía.

window.WidgetCreceJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wce-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.3rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wce-op { font-family:'Fira Code',monospace; font-size:1.9rem; font-weight:700; color:#1b2838; text-align:center; margin-bottom:0.9rem; letter-spacing:0.05em; }
        .wce-bar { display:flex; align-items:flex-end; justify-content:center; gap:1.2rem; height:74px; margin-bottom:0.8rem; }
        .wce-col { width:52px; border-radius:6px 6px 0 0; transition:height 0.5s ease; position:relative; }
        .wce-col span { position:absolute; top:-1.1rem; left:0; right:0; text-align:center; font-family:'Fredoka',sans-serif; font-size:0.72rem; color:#636e72; }
        .wce-col.wce-ini { background:#90a4ae; }
        .wce-col.wce-fin { background:#1565c0; }
        .wce-opts { display:flex; gap:0.6rem; flex-wrap:wrap; justify-content:center; }
        .wce-opt { font-family:'Fredoka',sans-serif; font-size:1rem; padding:0.55rem 1.4rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; transition:all 0.2s; }
        .wce-opt:hover:not(:disabled) { background:#1565c0; color:#fff; }
        .wce-opt.wce-ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wce-opt.wce-no { background:#d63031; border-color:#d63031; color:#fff; }
        .wce-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wce-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wce-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wce-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wce-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wce-op { color:#e8f0fe; }
        [data-theme="dark"] .wce-opt { background:#1e2130; }
        [data-theme="dark"] .wce-msg { color:#a0aec0; }
        [data-theme="dark"] .wce-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wce-msg.err { color:#ffb3b3; }
      </style>
      <div class="wce-container">
        <div class="wce-op" id="wce-op"></div>
        <div class="wce-bar" id="wce-bar" style="visibility:hidden;">
          <div class="wce-col wce-ini" id="wce-ini" style="height:40px;"><span id="wce-ini-l"></span></div>
          <div class="wce-col wce-fin" id="wce-fin" style="height:40px;"><span id="wce-fin-l"></span></div>
        </div>
        <div class="wce-opts">
          <button class="wce-opt" id="wce-btn-crece">📈 CRECE</button>
          <button class="wce-opt" id="wce-btn-encoge">📉 ENCOGE</button>
        </div>
        <div class="wce-msg" id="wce-msg">Sin calcular: ¿el resultado será mayor o menor que el número de partida?</div>
        <div class="wce-streak" id="wce-streak">🔥 Racha: 0</div>
      </div>`;

    const opEl = document.getElementById('wce-op');
    const barEl = document.getElementById('wce-bar');
    const iniEl = document.getElementById('wce-ini'), finEl = document.getElementById('wce-fin');
    const iniL = document.getElementById('wce-ini-l'), finL = document.getElementById('wce-fin-l');
    const msgEl = document.getElementById('wce-msg');
    const streakEl = document.getElementById('wce-streak');
    const btnC = document.getElementById('wce-btn-crece'), btnE = document.getElementById('wce-btn-encoge');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();

    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const CASOS = [
      // [signo, numerador, denominador] con fracciones que dan resultado entero
      { s: '×', menor: true }, { s: '×', menor: false }, { s: '÷', menor: true }, { s: '÷', menor: false }
    ];

    function nueva() {
      const caso = CASOS[rint(0, 3)];
      const d = [2, 3, 4, 5][rint(0, 3)];
      const n = caso.menor ? rint(1, d - 1) : rint(d + 1, d + 4);
      const base = d * rint(2, 6);
      const res = caso.s === '×' ? base * n / d : base * d / n;
      cur = { base, n, d, s: caso.s, res, crece: res > base };
      answered = false;
      opEl.textContent = `${base} ${caso.s} ${n}/${d}`;
      barEl.style.visibility = 'hidden';
      btnC.disabled = false; btnE.disabled = false;
      btnC.classList.remove('wce-ok', 'wce-no'); btnE.classList.remove('wce-ok', 'wce-no');
      msgEl.className = 'wce-msg';
      msgEl.textContent = 'Sin calcular: ¿el resultado será mayor o menor que el número de partida?';
    }

    function responder(diceCrece, btn) {
      if (answered) return;
      answered = true;
      btnC.disabled = true; btnE.disabled = true;
      const okBtn = cur.crece ? btnC : btnE;
      const { base, n, d, s, res } = cur;
      const alto = v => Math.max(10, Math.round(70 * v / Math.max(base, res)));
      iniEl.style.height = alto(base) + 'px'; finEl.style.height = alto(res) + 'px';
      iniL.textContent = base; finL.textContent = Math.round(res * 100) / 100;
      barEl.style.visibility = 'visible';
      const porque = s === '×'
        ? (n < d ? `${n}/${d} es <strong>menos</strong> que un entero: te quedas con un pedazo de ${base}`
                 : `${n}/${d} es <strong>más</strong> que un entero: te llevas ${base} y un poco más`)
        : (n < d ? `caben muchos pedazos de ${n}/${d} dentro de ${base}`
                 : `${n}/${d} es <strong>más</strong> que un entero, así que caben menos de ${base}`);
      if (diceCrece === cur.crece) {
        streak++; okBtn.classList.add('wce-ok');
        msgEl.className = 'wce-msg ok';
        msgEl.innerHTML = `✔ ¡Radar certero! ${base} ${s} ${n}/${d} = <strong>${Math.round(res * 100) / 100}</strong>. ${porque}.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('c' + awarded.size); pts(2); }
      } else {
        streak = 0; btn.classList.add('wce-no'); okBtn.classList.add('wce-ok');
        msgEl.className = 'wce-msg err';
        msgEl.innerHTML = `💡 Da <strong>${Math.round(res * 100) / 100}</strong>, o sea que ${cur.crece ? 'CRECE' : 'ENCOGE'}: ${porque}.`;
        if (typeof sfx === 'function') sfx('no');
      }
      streakEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3200);
    }

    btnC.addEventListener('click', () => responder(true, btnC));
    btnE.addEventListener('click', () => responder(false, btnE));
    nueva();
  }
};
