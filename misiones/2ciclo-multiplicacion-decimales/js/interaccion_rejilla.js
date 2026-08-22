// js/interaccion_rejilla.js
// Widget: La Rejilla de las Centésimas. Decirle a un niño que 0.2 × 0.3 = 0.06
// suena a truco de la maestra. Con el cuadro partido en 100 lo cuenta él: son
// seis cuadritos de cien. Ahí deja de ser un truco y pasa a tener sentido, que
// es la diferencia entre recordarlo en marzo y recordarlo en noviembre.

window.WidgetRejillaJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wrj-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wrj-op { font-family:'Fredoka',sans-serif; font-size:1.3rem; font-weight:700; color:#1b2838; text-align:center; margin-bottom:0.7rem; }
        .wrj-op .wrj-a { color:#1565c0; } .wrj-op .wrj-b { color:#e17055; }
        .wrj-wrap { display:flex; justify-content:center; margin-bottom:0.6rem; }
        .wrj-grid { display:grid; grid-template-columns:repeat(10, 1fr); gap:1px; background:#cfd8dc; padding:1px; border-radius:6px; width:min(230px, 70vw); }
        .wrj-c { aspect-ratio:1; background:#fff; border-radius:1px; transition:background 0.2s; }
        .wrj-c.a { background:#bbdefb; } .wrj-c.b { background:#ffccbc; } .wrj-c.ab { background:#7e57c2; }
        .wrj-leg { font-size:0.75rem; text-align:center; color:#636e72; margin-bottom:0.6rem; }
        .wrj-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wrj-opt { font-family:'Fira Code',monospace; font-size:1rem; padding:0.5rem 1.2rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; }
        .wrj-opt:hover:not(:disabled) { background:#1565c0; color:#fff; }
        .wrj-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wrj-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wrj-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wrj-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wrj-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        [data-theme="dark"] .wrj-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wrj-op { color:#e8f0fe; }
        [data-theme="dark"] .wrj-c { background:#2d3450; }
        [data-theme="dark"] .wrj-grid { background:#3a4260; }
        [data-theme="dark"] .wrj-opt { background:#1e2130; }
        [data-theme="dark"] .wrj-msg { color:#a0aec0; }
        [data-theme="dark"] .wrj-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wrj-msg.err { color:#ffb3b3; }
      </style>
      <div class="wrj-container">
        <div class="wrj-op" id="wrj-op"></div>
        <div class="wrj-wrap"><div class="wrj-grid" id="wrj-grid"></div></div>
        <div class="wrj-leg" id="wrj-leg"></div>
        <div class="wrj-opts" id="wrj-opts"></div>
        <div class="wrj-msg" id="wrj-msg">Cuenta los cuadritos morados: son los que se llevan los dos factores.</div>
      </div>`;

    const opEl = document.getElementById('wrj-op');
    const gridEl = document.getElementById('wrj-grid');
    const legEl = document.getElementById('wrj-leg');
    const optsEl = document.getElementById('wrj-opts');
    const msgEl = document.getElementById('wrj-msg');
    let cur = null, answered = false;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    function nueva() {
      const da = rint(1, 6), db = rint(1, 6);
      cur = { da, db, cruce: da * db };
      answered = false;
      opEl.innerHTML = `<span class="wrj-a">0.${da}</span> × <span class="wrj-b">0.${db}</span> = ?`;
      gridEl.innerHTML = '';
      for (let f = 0; f < 10; f++) {
        for (let c = 0; c < 10; c++) {
          const d = document.createElement('div');
          const eA = c < da, eB = f < db;
          d.className = 'wrj-c' + (eA && eB ? ' ab' : eA ? ' a' : eB ? ' b' : '');
          gridEl.appendChild(d);
        }
      }
      legEl.innerHTML = `azul: 0.${da} a lo ancho · anaranjado: 0.${db} a lo alto · <strong>morado: lo que se cruza</strong>`;
      const bueno = (cur.cruce / 100).toFixed(2);
      const ops = [bueno, (cur.cruce / 10).toFixed(1), String(cur.cruce)].sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      ops.forEach(t => {
        const b = document.createElement('button');
        b.className = 'wrj-opt'; b.textContent = t;
        b.onclick = () => responder(b, t, bueno);
        optsEl.appendChild(b);
      });
      msgEl.className = 'wrj-msg';
      msgEl.textContent = 'Cuenta los cuadritos morados: son los que se llevan los dos factores.';
    }

    function responder(btn, txt, bueno) {
      if (answered) return;
      answered = true;
      optsEl.querySelectorAll('.wrj-opt').forEach(b => { b.disabled = true; if (b.textContent === bueno) b.classList.add('ok'); });
      if (txt === bueno) {
        msgEl.className = 'wrj-msg ok';
        msgEl.innerHTML = `✔ ¡Eso es! Son <strong>${cur.cruce} cuadritos de 100</strong>, o sea ${bueno}. El cuadro entero vale 1, así que cada cuadrito vale una centésima.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 5 && typeof pts === 'function') { awarded.add('j' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no');
        msgEl.className = 'wrj-msg err';
        msgEl.innerHTML = `💡 Era <strong>${bueno}</strong>. Hay ${cur.cruce} cuadritos morados y el cuadro tiene 100: ${cur.cruce} de 100 son ${bueno}, no ${txt}.`;
        if (typeof sfx === 'function') sfx('no');
      }
      setTimeout(nueva, 3400);
    }

    nueva();
  }
};
