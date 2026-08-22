// js/interaccion_escalera.js
// Widget: La Escalera de Unidades. El error de cambiar de unidad "de 100 en
// 100" viene de arrastrar la regla del área. Aquí cada escalón se ve y se
// toca, y el fallo se corrige con el número delante en vez de con un regaño.

window.WidgetEscaleraJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wes-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wes-esc { display:flex; justify-content:center; align-items:flex-end; gap:2px; margin-bottom:0.8rem; }
        .wes-pel { font-family:'Fredoka',sans-serif; font-size:0.78rem; padding:0.3rem 0.5rem; border-radius:6px 6px 0 0; background:#e3f2fd; color:#1565c0; border:1px solid #90caf9; }
        .wes-pel.act { background:#1565c0; color:#fff; }
        .wes-op { font-family:'Fira Code',monospace; font-size:1.35rem; font-weight:700; color:#1b2838; text-align:center; margin-bottom:0.8rem; }
        .wes-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wes-opt { font-family:'Fira Code',monospace; font-size:1rem; padding:0.5rem 1.1rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; }
        .wes-opt:hover:not(:disabled) { background:#1565c0; color:#fff; }
        .wes-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wes-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wes-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wes-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wes-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wes-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wes-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wes-op { color:#e8f0fe; }
        [data-theme="dark"] .wes-pel { background:#22304a; color:#74b9ff; border-color:#2d3450; }
        [data-theme="dark"] .wes-opt { background:#1e2130; color:#74b9ff; }
        [data-theme="dark"] .wes-msg { color:#a0aec0; }
        [data-theme="dark"] .wes-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wes-msg.err { color:#ffb3b3; }
      </style>
      <div class="wes-container">
        <div class="wes-esc" id="wes-esc"></div>
        <div class="wes-op" id="wes-op"></div>
        <div class="wes-opts" id="wes-opts"></div>
        <div class="wes-msg" id="wes-msg">Cada escalón vale 1,000, nunca 100.</div>
        <div class="wes-streak" id="wes-streak">🔥 Racha: 0</div>
      </div>`;

    const UNI = [{ u: 'm³', i: 0 }, { u: 'dm³', i: 1 }, { u: 'cm³', i: 2 }];
    const escEl = document.getElementById('wes-esc'), opEl = document.getElementById('wes-op');
    const optsEl = document.getElementById('wes-opts'), msgEl = document.getElementById('wes-msg');
    const stEl = document.getElementById('wes-streak');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const fmt = x => x.toLocaleString('en-US');

    function nueva() {
      let d = rint(0, 2), h = rint(0, 2);
      while (h === d) h = rint(0, 2);
      const litro = rint(0, 3) === 0;
      const saltos = h - d;
      const v = rint(1, 9) * (saltos < 0 ? Math.pow(1000, -saltos) : 1);
      const res = saltos > 0 ? v * Math.pow(1000, saltos) : v / Math.pow(1000, -saltos);
      cur = { v, de: UNI[d].u, a: litro && UNI[h].u === 'dm³' ? 'litros' : UNI[h].u, res, saltos, d, h };
      answered = false;
      escEl.innerHTML = '';
      UNI.forEach((u, k) => {
        const p = document.createElement('div');
        p.className = 'wes-pel' + (k === d || k === h ? ' act' : '');
        p.style.height = (46 - k * 12) + 'px';
        p.textContent = u.u;
        escEl.appendChild(p);
      });
      opEl.innerHTML = `${fmt(v)} ${cur.de} = ? ${cur.a}`;
      const malos = [res * (saltos > 0 ? 0.1 : 10), res * (saltos > 0 ? 0.001 : 1000)];
      const ops = [...new Set([res, ...malos].map(x => Math.round(x * 1000) / 1000))].slice(0, 3).sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      ops.forEach(x => {
        const b = document.createElement('button');
        b.className = 'wes-opt'; b.textContent = fmt(x);
        b.onclick = () => responder(b, x);
        optsEl.appendChild(b);
      });
      msgEl.className = 'wes-msg';
      msgEl.textContent = 'Cada escalón vale 1,000, nunca 100.';
    }

    function responder(btn, x) {
      if (answered) return;
      answered = true;
      const bueno = Math.round(cur.res * 1000) / 1000;
      optsEl.querySelectorAll('.wes-opt').forEach(b => { b.disabled = true; if (b.textContent === fmt(bueno)) b.classList.add('ok'); });
      const n = Math.abs(cur.saltos), lado = cur.saltos > 0 ? 'bajas' : 'subes';
      if (x === bueno) {
        streak++;
        msgEl.className = 'wes-msg ok';
        msgEl.innerHTML = `✔ ¡Bien! ${lado === 'bajas' ? 'Bajas' : 'Subes'} ${n} escalón${n === 1 ? '' : 'es'}, así que ${cur.saltos > 0 ? 'multiplicas' : 'divides'} entre 1,000 ${n === 1 ? 'una vez' : n + ' veces'}: <strong>${fmt(bueno)} ${cur.a}</strong>.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('e' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no'); streak = 0;
        msgEl.className = 'wes-msg err';
        msgEl.innerHTML = `💡 Era <strong>${fmt(bueno)} ${cur.a}</strong>. Ojo: en volumen cada escalón vale <strong>1,000</strong>, no 100 (eso es del área).`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3400);
    }

    nueva();
  }
};
