// js/interaccion_azulejos.js
// Widget: Los Azulejos del Producto. El currículo pide multiplicar fracciones
// "en forma gráfica usando azulejos mediante el concepto de área": el producto
// no es una regla que hay que creerse, es el pedacito que queda cuando se toma
// una parte DE otra parte. La rejilla lo enseña sin que nadie lo explique.

window.WidgetAzulejosJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .waz-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .waz-op { font-family:'Fredoka',sans-serif; font-size:1.35rem; font-weight:700; color:#1b2838; text-align:center; margin-bottom:0.7rem; }
        .waz-op .waz-f1 { color:#1565c0; } .waz-op .waz-f2 { color:#e17055; }
        .waz-gridwrap { display:flex; justify-content:center; margin-bottom:0.7rem; }
        .waz-grid { display:grid; gap:2px; background:#cfd8dc; padding:2px; border-radius:8px; }
        .waz-cell { width:26px; height:26px; background:#fff; border-radius:3px; transition:background 0.25s; }
        .waz-cell.waz-a { background:#bbdefb; }
        .waz-cell.waz-b { background:#ffccbc; }
        .waz-cell.waz-ab { background:#7e57c2; }
        .waz-leg { font-size:0.74rem; color:#636e72; text-align:center; margin-bottom:0.6rem; line-height:1.5; }
        .waz-leg i { display:inline-block; width:12px; height:12px; border-radius:3px; vertical-align:-1px; margin-right:2px; }
        .waz-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .waz-opt { font-family:'Fira Code',monospace; font-size:1rem; padding:0.5rem 1.2rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; transition:all 0.2s; }
        .waz-opt:hover:not(:disabled) { background:#1565c0; color:#fff; }
        .waz-opt.waz-ok { background:#00b894; border-color:#00b894; color:#fff; }
        .waz-opt.waz-no { background:#d63031; border-color:#d63031; color:#fff; }
        .waz-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .waz-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .waz-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .waz-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .waz-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .waz-op { color:#e8f0fe; }
        [data-theme="dark"] .waz-cell { background:#2d3450; }
        [data-theme="dark"] .waz-grid { background:#3a4260; }
        [data-theme="dark"] .waz-opt { background:#1e2130; }
        [data-theme="dark"] .waz-msg { color:#a0aec0; }
        [data-theme="dark"] .waz-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .waz-msg.err { color:#ffb3b3; }
        @media (max-width:420px){ .waz-cell{ width:20px; height:20px; } }
      </style>
      <div class="waz-container">
        <div class="waz-op" id="waz-op"></div>
        <div class="waz-gridwrap"><div class="waz-grid" id="waz-grid"></div></div>
        <div class="waz-leg" id="waz-leg"></div>
        <div class="waz-opts" id="waz-opts"></div>
        <div class="waz-msg" id="waz-msg">Mira la rejilla: lo morado es la parte que le toca a las dos. ¿Qué fracción del cuadro completo es?</div>
        <div class="waz-streak" id="waz-streak">🔥 Racha: 0</div>
      </div>`;

    const opEl = document.getElementById('waz-op');
    const gridEl = document.getElementById('waz-grid');
    const legEl = document.getElementById('waz-leg');
    const optsEl = document.getElementById('waz-opts');
    const msgEl = document.getElementById('waz-msg');
    const streakEl = document.getElementById('waz-streak');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();

    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const mcd = (a, b) => { while (b) { const t = b; b = a % b; a = t; } return a || 1; };
    const simpl = (n, d) => { const g = mcd(n, d); return [n / g, d / g]; };
    const fmt = (n, d) => { const s = simpl(n, d); return s[1] === 1 ? String(s[0]) : s[0] + '/' + s[1]; };

    function pintar(a, b, c, d) {
      // b columnas (denominador de la 1.ª) por d filas (denominador de la 2.ª)
      gridEl.style.gridTemplateColumns = `repeat(${b}, auto)`;
      gridEl.innerHTML = '';
      for (let f = 0; f < d; f++) {
        for (let col = 0; col < b; col++) {
          const cell = document.createElement('div');
          cell.className = 'waz-cell';
          const enA = col < a, enB = f < c;
          if (enA && enB) cell.classList.add('waz-ab');
          else if (enA) cell.classList.add('waz-a');
          else if (enB) cell.classList.add('waz-b');
          gridEl.appendChild(cell);
        }
      }
      legEl.innerHTML = `<i style="background:#bbdefb"></i> ${a}/${b} en columnas · <i style="background:#ffccbc"></i> ${c}/${d} en filas · <i style="background:#7e57c2"></i> lo que se cruza`;
    }

    function nueva() {
      const b = rint(2, 5), d = rint(2, 4);
      const a = rint(1, b - 1), c = rint(1, d - 1);
      cur = { a, b, c, d, n: a * c, m: b * d };
      answered = false;
      opEl.innerHTML = `<span class="waz-f1">${a}/${b}</span> × <span class="waz-f2">${c}/${d}</span> = ?`;
      pintar(a, b, c, d);
      // Distractores: sumar en vez de multiplicar, y multiplicar cruzado
      const buenas = [fmt(a * c, b * d)];
      const cand = [fmt(a + c, b + d), fmt(a * d, b * c), fmt(a + c, b * d)];
      cand.forEach(x => { if (!buenas.includes(x)) buenas.push(x); });
      const ops = buenas.slice(0, 3).sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      ops.forEach(txt => {
        const btn = document.createElement('button');
        btn.className = 'waz-opt'; btn.textContent = txt;
        btn.onclick = () => responder(btn, txt);
        optsEl.appendChild(btn);
      });
      msgEl.className = 'waz-msg';
      msgEl.innerHTML = 'Cuenta los cuadros morados y cuéntalos todos: esa es la fracción que buscas.';
    }

    function responder(btn, txt) {
      if (answered) return;
      answered = true;
      const bueno = fmt(cur.n, cur.m);
      optsEl.querySelectorAll('.waz-opt').forEach(b => {
        b.disabled = true;
        if (b.textContent === bueno) b.classList.add('waz-ok');
      });
      if (txt === bueno) {
        streak++;
        msgEl.className = 'waz-msg ok';
        msgEl.innerHTML = `✔ ¡Eso es! Hay <strong>${cur.n}</strong> cuadros morados de <strong>${cur.m}</strong> en total: ${cur.n}/${cur.m}${bueno !== cur.n + '/' + cur.m ? ' = <strong>' + bueno + '</strong>' : ''}. Arriba con arriba (${cur.a}×${cur.c}) y abajo con abajo (${cur.b}×${cur.d}).`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 5 && typeof pts === 'function') { awarded.add('a' + awarded.size); pts(2); }
      } else {
        btn.classList.add('waz-no');
        streak = 0;
        msgEl.className = 'waz-msg err';
        msgEl.innerHTML = `💡 Era <strong>${bueno}</strong>. Cuenta: ${cur.a}×${cur.c} = ${cur.n} cuadros morados, sobre ${cur.b}×${cur.d} = ${cur.m} cuadros del cuadro entero. Sumar los números no sirve aquí.`;
        if (typeof sfx === 'function') sfx('no');
      }
      streakEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3200);
    }

    nueva();
  }
};
