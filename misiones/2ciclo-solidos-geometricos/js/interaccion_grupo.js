// js/interaccion_grupo.js
// Widget: ¿Poliedro o Cuerpo Redondo? La pregunta parece fácil hasta que sale
// el cilindro, que tiene dos caras planas y despista a media clase. Por eso
// el feedback no dice solo «bien» o «mal»: dice DÓNDE está la superficie
// curva, que es lo que hay que aprender a mirar.

window.WidgetGrupoJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const SOL = [
      { n: 'cubo', e: '🧊', pol: true, por: 'sus seis caras son cuadrados planos' },
      { n: 'prisma triangular', e: '⛺', pol: true, por: 'dos triángulos y tres rectángulos, todos planos' },
      { n: 'pirámide cuadrangular', e: '🔺', pol: true, por: 'una base cuadrada y cuatro triángulos planos' },
      { n: 'prisma hexagonal', e: '✏️', pol: true, por: 'dos hexágonos y seis rectángulos planos' },
      { n: 'cilindro', e: '🥫', pol: false, por: 'sus dos bases son planas, pero la superficie de alrededor es curva' },
      { n: 'cono', e: '🍦', pol: false, por: 'la base es plana, pero la superficie que sube a la punta es curva' },
      { n: 'esfera', e: '⚽', pol: false, por: 'no tiene ni una sola cara plana' }
    ];

    container.innerHTML = `
      <style>
        .wgr-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.3rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wgr-fig { font-size:3rem; text-align:center; }
        .wgr-nom { font-family:'Fredoka',sans-serif; font-size:1.1rem; font-weight:700; text-align:center; color:#1b2838; margin-bottom:0.8rem; }
        .wgr-opts { display:flex; gap:0.6rem; flex-wrap:wrap; justify-content:center; }
        .wgr-opt { font-family:'Fredoka',sans-serif; font-size:0.95rem; padding:0.55rem 1.2rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; }
        .wgr-opt:hover:not(:disabled) { background:#1565c0; color:#fff; }
        .wgr-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wgr-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wgr-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wgr-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wgr-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wgr-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wgr-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wgr-nom { color:#e8f0fe; }
        [data-theme="dark"] .wgr-opt { background:#1e2130; color:#74b9ff; }
        [data-theme="dark"] .wgr-msg { color:#a0aec0; }
        [data-theme="dark"] .wgr-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wgr-msg.err { color:#ffb3b3; }
      </style>
      <div class="wgr-container">
        <div class="wgr-fig" id="wgr-fig"></div>
        <div class="wgr-nom" id="wgr-nom"></div>
        <div class="wgr-opts">
          <button class="wgr-opt" id="wgr-pol">🧊 POLIEDRO</button>
          <button class="wgr-opt" id="wgr-red">⚽ CUERPO REDONDO</button>
        </div>
        <div class="wgr-msg" id="wgr-msg">¿Todas sus caras son planas?</div>
        <div class="wgr-streak" id="wgr-streak">🔥 Racha: 0</div>
      </div>`;

    const figEl = document.getElementById('wgr-fig'), nomEl = document.getElementById('wgr-nom');
    const msgEl = document.getElementById('wgr-msg'), stEl = document.getElementById('wgr-streak');
    const bPol = document.getElementById('wgr-pol'), bRed = document.getElementById('wgr-red');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    function nueva() {
      cur = SOL[rint(0, SOL.length - 1)];
      answered = false;
      figEl.textContent = cur.e; nomEl.textContent = cur.n;
      bPol.disabled = false; bRed.disabled = false;
      bPol.classList.remove('ok', 'no'); bRed.classList.remove('ok', 'no');
      msgEl.className = 'wgr-msg';
      msgEl.textContent = '¿Todas sus caras son planas?';
    }

    function responder(dice, btn) {
      if (answered) return;
      answered = true;
      bPol.disabled = true; bRed.disabled = true;
      (cur.pol ? bPol : bRed).classList.add('ok');
      if (dice === cur.pol) {
        streak++;
        msgEl.className = 'wgr-msg ok';
        msgEl.innerHTML = `✔ ¡Correcto! El ${cur.n} es <strong>${cur.pol ? 'poliedro' : 'cuerpo redondo'}</strong>: ${cur.por}.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('g' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no'); streak = 0;
        msgEl.className = 'wgr-msg err';
        msgEl.innerHTML = `💡 Es <strong>${cur.pol ? 'poliedro' : 'cuerpo redondo'}</strong>: ${cur.por}.`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3000);
    }

    bPol.addEventListener('click', () => responder(true, bPol));
    bRed.addEventListener('click', () => responder(false, bRed));
    nueva();
  }
};
