// js/interaccion_areavol.js
// Widget: ¿Área o Volumen? El error no está en la fórmula: está en no saber
// cuál toca. Por eso aquí no se pide calcular nada, se pide DECIDIR, y con
// encargos de la vida real: pintar, forrar, llenar, cargar.

window.WidgetAreavolJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const CASOS = [
      { t: 'Pintar la pared del aula', v: false, u: 'm²', por: 'la pintura cubre una superficie' },
      { t: 'Llenar de agua un tanque', v: true, u: 'm³ o litros', por: 'el agua ocupa el espacio de dentro' },
      { t: 'Forrar una caja con papel', v: false, u: 'cm²', por: 'el papel cubre por fuera' },
      { t: 'Saber cuánta arena carga un camión', v: true, u: 'm³', por: 'la arena llena el cajón' },
      { t: 'Comprar lámina para un techo', v: false, u: 'm²', por: 'la lámina cubre una superficie' },
      { t: 'Calcular el aire de un cuarto', v: true, u: 'm³', por: 'el aire ocupa todo el espacio' },
      { t: 'Poner cerámica en el piso', v: false, u: 'm²', por: 'la cerámica cubre el suelo' },
      { t: 'Ver cuánto arroz cabe en un saco', v: true, u: 'dm³ o litros', por: 'el arroz llena el saco por dentro' },
      { t: 'Saber cuánto plástico lleva una botella', v: false, u: 'cm²', por: 'el plástico es la superficie de fuera' },
      { t: 'Medir la leche que aguanta una pichinga', v: true, u: 'litros', por: 'la leche ocupa el espacio de dentro' }
    ];

    container.innerHTML = `
      <style>
        .wav-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.3rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wav-caso { font-family:'Fredoka',sans-serif; font-size:1.1rem; font-weight:700; text-align:center; color:#1b2838; background:#f5f7fb; border-radius:10px; padding:0.8rem; margin-bottom:0.9rem; }
        .wav-opts { display:flex; gap:0.6rem; flex-wrap:wrap; justify-content:center; }
        .wav-opt { font-family:'Fredoka',sans-serif; font-size:0.95rem; padding:0.55rem 1.3rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; }
        .wav-opt:hover:not(:disabled) { background:#1565c0; color:#fff; }
        .wav-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wav-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wav-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wav-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wav-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wav-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wav-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wav-caso { background:#161a26; color:#e8f0fe; }
        [data-theme="dark"] .wav-opt { background:#1e2130; color:#74b9ff; }
        [data-theme="dark"] .wav-msg { color:#a0aec0; }
        [data-theme="dark"] .wav-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wav-msg.err { color:#ffb3b3; }
      </style>
      <div class="wav-container">
        <div class="wav-caso" id="wav-caso"></div>
        <div class="wav-opts">
          <button class="wav-opt" id="wav-area">📐 ÁREA</button>
          <button class="wav-opt" id="wav-vol">📦 VOLUMEN</button>
        </div>
        <div class="wav-msg" id="wav-msg">¿Hay que cubrir por fuera o llenar por dentro?</div>
        <div class="wav-streak" id="wav-streak">🔥 Racha: 0</div>
      </div>`;

    const casoEl = document.getElementById('wav-caso'), msgEl = document.getElementById('wav-msg');
    const stEl = document.getElementById('wav-streak');
    const bA = document.getElementById('wav-area'), bV = document.getElementById('wav-vol');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    function nueva() {
      cur = CASOS[rint(0, CASOS.length - 1)];
      answered = false;
      casoEl.textContent = cur.t;
      bA.disabled = false; bV.disabled = false;
      bA.classList.remove('ok', 'no'); bV.classList.remove('ok', 'no');
      msgEl.className = 'wav-msg';
      msgEl.textContent = '¿Hay que cubrir por fuera o llenar por dentro?';
    }

    function responder(diceVol, btn) {
      if (answered) return;
      answered = true;
      bA.disabled = true; bV.disabled = true;
      (cur.v ? bV : bA).classList.add('ok');
      if (diceVol === cur.v) {
        streak++;
        msgEl.className = 'wav-msg ok';
        msgEl.innerHTML = `✔ ¡Correcto! Es <strong>${cur.v ? 'volumen' : 'área'}</strong>: ${cur.por}. Se contesta en <strong>${cur.u}</strong>.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('a' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no'); streak = 0;
        msgEl.className = 'wav-msg err';
        msgEl.innerHTML = `💡 Es <strong>${cur.v ? 'volumen' : 'área'}</strong>: ${cur.por}. Se contesta en <strong>${cur.u}</strong>.`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3200);
    }

    bA.addEventListener('click', () => responder(false, bA));
    bV.addEventListener('click', () => responder(true, bV));
    nueva();
  }
};
