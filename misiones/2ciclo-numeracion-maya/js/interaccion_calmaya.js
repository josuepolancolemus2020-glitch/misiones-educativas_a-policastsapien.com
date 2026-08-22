// js/interaccion_calmaya.js
// Widget: Calculadora del Calendario. La tabla de periodos se memoriza y se
// olvida; convirtiendo en los dos sentidos se queda. Y el tun aparece con sus
// 360 días siempre, porque la excepción hay que verla, no esquivarla.

window.WidgetCalmayaJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const PER = [
      { n: 'kin', d: 1, e: '☀️', q: 'un día' },
      { n: 'uinal', d: 20, e: '🌙', q: '20 kines' },
      { n: 'tun', d: 360, e: '📅', q: '18 uinales, no 20' },
      { n: 'katún', d: 7200, e: '🏛️', q: '20 tunes' },
      { n: 'baktún', d: 144000, e: '🗿', q: '20 katunes' }
    ];

    container.innerHTML = `
      <style>
        .wcm-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wcm-preg { font-family:'Fredoka',sans-serif; font-size:1.05rem; text-align:center; color:#1b2838; background:#f5f7fb; border-radius:10px; padding:0.8rem; margin-bottom:0.8rem; }
        .wcm-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wcm-opt { font-family:'Fira Code',monospace; font-size:1rem; padding:0.5rem 1.1rem; border:2px solid #00695c; border-radius:20px; background:#fff; color:#00695c; cursor:pointer; font-weight:700; }
        .wcm-opt:hover:not(:disabled) { background:#00695c; color:#fff; }
        .wcm-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wcm-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wcm-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wcm-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wcm-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wcm-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wcm-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wcm-preg { background:#161a26; color:#e8f0fe; }
        [data-theme="dark"] .wcm-opt { background:#1e2130; color:#4db6ac; }
        [data-theme="dark"] .wcm-msg { color:#a0aec0; }
        [data-theme="dark"] .wcm-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wcm-msg.err { color:#ffb3b3; }
      </style>
      <div class="wcm-container">
        <div class="wcm-preg" id="wcm-preg"></div>
        <div class="wcm-opts" id="wcm-opts"></div>
        <div class="wcm-msg" id="wcm-msg">kin 1 · uinal 20 · tun 360 · katún 7,200 · baktún 144,000</div>
        <div class="wcm-streak" id="wcm-streak">🔥 Racha: 0</div>
      </div>`;

    const pregEl = document.getElementById('wcm-preg'), optsEl = document.getElementById('wcm-opts');
    const msgEl = document.getElementById('wcm-msg'), stEl = document.getElementById('wcm-streak');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const fmt = x => x.toLocaleString('en-US');

    function nueva() {
      const p = PER[rint(1, 3)];
      const k = rint(2, 9);
      const alReves = rint(0, 2) === 0;
      answered = false;
      if (alReves) {
        cur = { res: k, expl: `${fmt(k * p.d)} ÷ ${fmt(p.d)} = ${k}` };
        pregEl.innerHTML = `${p.e} ${fmt(k * p.d)} días, ¿cuántos <strong>${p.n}${k > 1 ? 'es' : ''}</strong> son?`;
      } else {
        cur = { res: k * p.d, expl: `${k} × ${fmt(p.d)} = ${fmt(k * p.d)}` };
        pregEl.innerHTML = `${p.e} ${k} <strong>${p.n}${k > 1 ? 'es' : ''}</strong>, ¿cuántos días son?`;
      }
      cur.p = p;
      const malos = alReves ? [k * 2, k + 1] : [k * p.d * 10, k * (p.d === 360 ? 400 : p.d * 2)];
      const ops = [...new Set([cur.res, ...malos])].slice(0, 3).sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      ops.forEach(v => {
        const b = document.createElement('button');
        b.className = 'wcm-opt'; b.textContent = fmt(v);
        b.onclick = () => responder(b, v);
        optsEl.appendChild(b);
      });
      msgEl.className = 'wcm-msg';
      msgEl.textContent = 'kin 1 · uinal 20 · tun 360 · katún 7,200 · baktún 144,000';
    }

    function responder(btn, v) {
      if (answered) return;
      answered = true;
      optsEl.querySelectorAll('.wcm-opt').forEach(b => { b.disabled = true; if (b.textContent === fmt(cur.res)) b.classList.add('ok'); });
      if (v === cur.res) {
        streak++;
        msgEl.className = 'wcm-msg ok';
        msgEl.innerHTML = `✔ ¡Correcto! ${cur.expl}. Recuerda que un ${cur.p.n} son ${cur.p.q}.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('c' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no'); streak = 0;
        msgEl.className = 'wcm-msg err';
        msgEl.innerHTML = `💡 Era <strong>${fmt(cur.res)}</strong>: ${cur.expl}. Un ${cur.p.n} son ${cur.p.q}.`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3400);
    }

    nueva();
  }
};
