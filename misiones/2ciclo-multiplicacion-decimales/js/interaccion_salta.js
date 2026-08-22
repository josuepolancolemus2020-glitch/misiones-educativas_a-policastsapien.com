// js/interaccion_salta.js
// Widget: Salta el Punto. Multiplicar por 10, 100 o 1,000 no es una cuenta:
// es mover el punto. El que lo entiende resuelve de cabeza en el mercado; el
// que no, monta la multiplicación en columna y pierde medio minuto por cada
// precio. Aquí se practica el salto, no la cuenta.

window.WidgetSaltaJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wsl-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wsl-op { font-family:'Fira Code',monospace; font-size:1.7rem; font-weight:700; color:#1b2838; text-align:center; margin-bottom:0.8rem; }
        .wsl-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wsl-opt { font-family:'Fira Code',monospace; font-size:1.05rem; padding:0.5rem 1.1rem; border:2px solid #00838f; border-radius:20px; background:#fff; color:#00838f; cursor:pointer; font-weight:700; }
        .wsl-opt:hover:not(:disabled) { background:#00838f; color:#fff; }
        .wsl-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wsl-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wsl-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wsl-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wsl-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wsl-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wsl-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wsl-op { color:#e8f0fe; }
        [data-theme="dark"] .wsl-opt { background:#1e2130; }
        [data-theme="dark"] .wsl-msg { color:#a0aec0; }
        [data-theme="dark"] .wsl-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wsl-msg.err { color:#ffb3b3; }
      </style>
      <div class="wsl-container">
        <div class="wsl-op" id="wsl-op"></div>
        <div class="wsl-opts" id="wsl-opts"></div>
        <div class="wsl-msg" id="wsl-msg">Sin hacer la cuenta: solo mueve el punto.</div>
        <div class="wsl-streak" id="wsl-streak">🔥 Racha: 0</div>
      </div>`;

    const opEl = document.getElementById('wsl-op');
    const optsEl = document.getElementById('wsl-opts');
    const msgEl = document.getElementById('wsl-msg');
    const stEl = document.getElementById('wsl-streak');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const limpia = s => s.indexOf('.') > -1 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;

    function mueve(numStr, lugares) {
      // Se mueve el punto sobre el TEXTO: con coma flotante, 8.7 × 0.1 daría
      // 0.8700000000000001 y el widget enseñaría un disparate.
      let [ent, dec] = numStr.split('.');
      dec = dec || '';
      if (lugares > 0) {
        while (dec.length < lugares) dec += '0';
        ent = ent + dec.slice(0, lugares); dec = dec.slice(lugares);
      } else {
        let l = -lugares;
        while (ent.length < l + 1) ent = '0' + ent;
        dec = ent.slice(ent.length - l) + dec; ent = ent.slice(0, ent.length - l);
      }
      ent = ent.replace(/^0+(?=\d)/, '');
      return limpia(dec ? ent + '.' + dec : ent);
    }

    function nueva() {
      const base = (rint(105, 995) / 100).toFixed(2);
      const factores = [['10', 1], ['100', 2], ['1,000', 3], ['0.1', -1], ['0.01', -2]];
      const f = factores[rint(0, factores.length - 1)];
      cur = { base, f, res: mueve(base, f[1]) };
      answered = false;
      opEl.textContent = `${base} × ${f[0]}`;
      const malos = [mueve(base, f[1] > 0 ? f[1] + 1 : f[1] - 1), mueve(base, -f[1])];
      const ops = [...new Set([cur.res, ...malos])].slice(0, 3).sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      ops.forEach(t => {
        const b = document.createElement('button');
        b.className = 'wsl-opt'; b.textContent = t;
        b.onclick = () => responder(b, t);
        optsEl.appendChild(b);
      });
      msgEl.className = 'wsl-msg';
      msgEl.textContent = 'Sin hacer la cuenta: solo mueve el punto.';
    }

    function responder(btn, txt) {
      if (answered) return;
      answered = true;
      optsEl.querySelectorAll('.wsl-opt').forEach(b => { b.disabled = true; if (b.textContent === cur.res) b.classList.add('ok'); });
      const n = Math.abs(cur.f[1]);
      const lado = cur.f[1] > 0 ? 'derecha' : 'izquierda';
      if (txt === cur.res) {
        streak++;
        msgEl.className = 'wsl-msg ok';
        msgEl.innerHTML = `✔ ¡Bien! El punto saltó <strong>${n} lugar${n === 1 ? '' : 'es'} a la ${lado}</strong>: ${cur.res}.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('s' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no'); streak = 0;
        msgEl.className = 'wsl-msg err';
        msgEl.innerHTML = `💡 Era <strong>${cur.res}</strong>: con ${cur.f[0]} el punto salta ${n} lugar${n === 1 ? '' : 'es'} a la <strong>${lado}</strong>.`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3000);
    }

    nueva();
  }
};
