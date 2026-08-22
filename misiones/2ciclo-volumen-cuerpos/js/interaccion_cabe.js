// js/interaccion_cabe.js
// Widget: ¿Cabe o No Cabe? Obliga a convertir antes de decidir, que es lo que
// pasa en una bodega de verdad: el recipiente viene en metros cúbicos y la
// mercancía en litros, y nadie contesta hasta poner las dos en la misma
// unidad. Sin esa conversión, la pregunta no se puede ni entender.

window.WidgetCabeJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wcb-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.3rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wcb-fila { display:flex; align-items:center; justify-content:center; gap:0.8rem; margin-bottom:0.9rem; flex-wrap:wrap; }
        .wcb-caja { background:#f5f7fb; border-radius:10px; padding:0.7rem 0.9rem; text-align:center; min-width:120px; }
        .wcb-caja .wcb-lbl { font-size:0.72rem; color:#636e72; font-family:'Fredoka',sans-serif; }
        .wcb-caja .wcb-val { font-family:'Fira Code',monospace; font-size:1.05rem; font-weight:700; color:#1b2838; }
        .wcb-vs { font-family:'Fredoka',sans-serif; font-size:0.9rem; color:#e17055; font-weight:700; }
        .wcb-opts { display:flex; gap:0.6rem; flex-wrap:wrap; justify-content:center; }
        .wcb-opt { font-family:'Fredoka',sans-serif; font-size:0.95rem; padding:0.55rem 1.3rem; border:2px solid #c49000; border-radius:20px; background:#fff; color:#8a6600; cursor:pointer; font-weight:700; }
        .wcb-opt:hover:not(:disabled) { background:#c49000; color:#fff; }
        .wcb-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wcb-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wcb-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.8rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wcb-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wcb-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wcb-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wcb-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wcb-caja { background:#161a26; }
        [data-theme="dark"] .wcb-caja .wcb-val { color:#e8f0fe; }
        [data-theme="dark"] .wcb-opt { background:#1e2130; color:#f0c674; }
        [data-theme="dark"] .wcb-msg { color:#a0aec0; }
        [data-theme="dark"] .wcb-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wcb-msg.err { color:#ffb3b3; }
      </style>
      <div class="wcb-container">
        <div class="wcb-fila">
          <div class="wcb-caja"><div class="wcb-lbl" id="wcb-l1">Recipiente</div><div class="wcb-val" id="wcb-v1"></div></div>
          <div class="wcb-vs">¿cabe?</div>
          <div class="wcb-caja"><div class="wcb-lbl" id="wcb-l2">Lo que se quiere meter</div><div class="wcb-val" id="wcb-v2"></div></div>
        </div>
        <div class="wcb-opts">
          <button class="wcb-opt" id="wcb-si">✅ SÍ CABE</button>
          <button class="wcb-opt" id="wcb-no">❌ NO CABE</button>
        </div>
        <div class="wcb-msg" id="wcb-msg">Pasa las dos cantidades a la misma unidad antes de decidir.</div>
        <div class="wcb-streak" id="wcb-streak">🔥 Racha: 0</div>
      </div>`;

    const v1El = document.getElementById('wcb-v1'), v2El = document.getElementById('wcb-v2');
    const l1El = document.getElementById('wcb-l1'), l2El = document.getElementById('wcb-l2');
    const msgEl = document.getElementById('wcb-msg'), stEl = document.getElementById('wcb-streak');
    const bSi = document.getElementById('wcb-si'), bNo = document.getElementById('wcb-no');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const fmt = x => (Math.round(x * 100) / 100).toLocaleString('en-US');

    const RECIPIENTES = [
      { n: 'Tanque', litros: () => rint(1, 3) * 1000, txt: v => (v / 1000) + ' m³' },
      { n: 'Pila', litros: () => rint(5, 15) * 100, txt: v => (v / 1000) + ' m³' },
      { n: 'Barril', litros: () => rint(100, 250), txt: v => v + ' dm³' },
      { n: 'Balde', litros: () => rint(10, 25), txt: v => v + ' litros' }
    ];

    function nueva() {
      const r = RECIPIENTES[rint(0, RECIPIENTES.length - 1)];
      const capacidad = r.litros();
      const cabe = rint(0, 1) === 1;
      const carga = cabe ? Math.round(capacidad * (rint(40, 90) / 100)) : Math.round(capacidad * (rint(110, 180) / 100));
      const enCm3 = rint(0, 2) === 0;
      cur = { capacidad, carga, cabe: carga <= capacidad, r };
      answered = false;
      l1El.textContent = r.n;
      v1El.textContent = r.txt(capacidad);
      l2El.textContent = 'Lo que se quiere meter';
      v2El.textContent = enCm3 ? fmt(carga * 1000) + ' cm³' : fmt(carga) + ' litros';
      bSi.disabled = false; bNo.disabled = false;
      bSi.classList.remove('ok', 'no'); bNo.classList.remove('ok', 'no');
      msgEl.className = 'wcb-msg';
      msgEl.textContent = 'Pasa las dos cantidades a la misma unidad antes de decidir.';
    }

    function responder(dice, btn) {
      if (answered) return;
      answered = true;
      bSi.disabled = true; bNo.disabled = true;
      (cur.cabe ? bSi : bNo).classList.add('ok');
      const detalle = `el ${cur.r.n.toLowerCase()} aguanta <strong>${fmt(cur.capacidad)} litros</strong> y se quieren meter <strong>${fmt(cur.carga)}</strong>`;
      if (dice === cur.cabe) {
        streak++;
        msgEl.className = 'wcb-msg ok';
        msgEl.innerHTML = `✔ ¡Correcto! En litros: ${detalle}, así que ${cur.cabe ? 'sí cabe y sobran ' + fmt(cur.capacidad - cur.carga) : 'no cabe: se pasan ' + fmt(cur.carga - cur.capacidad)} litros.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('b' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no'); streak = 0;
        msgEl.className = 'wcb-msg err';
        msgEl.innerHTML = `💡 ${cur.cabe ? 'Sí cabía' : 'No cabía'}. Pásalo todo a litros: ${detalle}. Recuerda: 1 m³ = 1,000 litros y 1,000 cm³ = 1 litro.`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3600);
    }

    bSi.addEventListener('click', () => responder(true, bSi));
    bNo.addEventListener('click', () => responder(false, bNo));
    nueva();
  }
};
