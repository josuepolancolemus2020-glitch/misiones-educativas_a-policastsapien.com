// js/interaccion_caja.js
// Widget: La Caja de la Pulpería. Es el sitio donde esta operación se usa de
// verdad, y donde equivocarse cuesta dinero de la familia. Además del total se
// pide el vuelto: es la comprobación que hace cualquier cliente y la que
// obliga a mirar si el resultado tiene sentido.

window.WidgetCajaJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wcj-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wcj-top { display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem; }
        .wcj-timer { font-family:'Fredoka',sans-serif; font-size:0.95rem; font-weight:700; color:#e17055; }
        .wcj-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; color:#636e72; }
        .wcj-ticket { background:#fffdf5; border:1px dashed #c49000; border-radius:10px; padding:0.8rem 1rem; margin-bottom:0.7rem; font-family:'Fira Code',monospace; font-size:0.95rem; color:#1b2838; }
        .wcj-ticket .wcj-l { display:flex; justify-content:space-between; }
        .wcj-preg { font-family:'Fredoka',sans-serif; font-size:0.95rem; text-align:center; color:#1b2838; margin-bottom:0.5rem; }
        .wcj-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wcj-opt { font-family:'Fira Code',monospace; font-size:1rem; padding:0.5rem 1.1rem; border:2px solid #c49000; border-radius:20px; background:#fff; color:#8a6600; cursor:pointer; font-weight:700; }
        .wcj-opt:hover:not(:disabled) { background:#c49000; color:#fff; }
        .wcj-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wcj-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wcj-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wcj-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wcj-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        [data-theme="dark"] .wcj-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wcj-ticket { background:#221f14; color:#f5e6c8; }
        [data-theme="dark"] .wcj-preg { color:#e8f0fe; }
        [data-theme="dark"] .wcj-opt { background:#1e2130; color:#f0c674; }
        [data-theme="dark"] .wcj-msg { color:#a0aec0; }
        [data-theme="dark"] .wcj-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wcj-msg.err { color:#ffb3b3; }
      </style>
      <div class="wcj-container">
        <div class="wcj-top">
          <span class="wcj-timer" id="wcj-timer">⏳ 20</span>
          <span class="wcj-streak" id="wcj-streak">🔥 Racha: 0</span>
        </div>
        <div class="wcj-ticket" id="wcj-ticket"></div>
        <div class="wcj-preg" id="wcj-preg"></div>
        <div class="wcj-opts" id="wcj-opts"></div>
        <div class="wcj-msg" id="wcj-msg">Cóbrale bien: el punto en su sitio.</div>
      </div>`;

    const tkEl = document.getElementById('wcj-ticket');
    const pgEl = document.getElementById('wcj-preg');
    const optsEl = document.getElementById('wcj-opts');
    const msgEl = document.getElementById('wcj-msg');
    const tmEl = document.getElementById('wcj-timer');
    const stEl = document.getElementById('wcj-streak');
    const COSAS = [['libras de arroz', 18.75], ['libras de frijoles', 22.50], ['panes', 2.50], ['refrescos', 15.50],
                   ['cuadernos', 24.25], ['libras de azúcar', 16.25], ['mangos', 6.50], ['libras de queso', 45.00]];
    let cur = null, answered = false, streak = 0, seg = 20, tick = null;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const lps = c => 'L ' + (c / 100).toFixed(2);

    function parar() { if (tick) { clearInterval(tick); tick = null; } }
    function correr() {
      parar(); seg = 20; tmEl.textContent = '⏳ ' + seg;
      tick = setInterval(() => { seg--; tmEl.textContent = '⏳ ' + seg; if (seg <= 0) { parar(); if (!answered) cerrar(null, true); } }, 1000);
    }

    function nueva() {
      const c = COSAS[rint(0, COSAS.length - 1)];
      const k = rint(2, 6);
      // Todo en centavos enteros: en coma flotante 3 × 18.75 puede dar 56.249999
      const precio = Math.round(c[1] * 100);
      const total = precio * k;
      const paga = Math.ceil(total / 5000) * 5000;
      const vuelto = paga - total;
      const pideVuelto = rint(0, 1) === 1 && vuelto > 0;
      cur = { c, k, precio, total, paga, vuelto, pideVuelto };
      answered = false;
      tkEl.innerHTML = `<div class="wcj-l"><span>${k} ${c[0]}</span><span>a ${lps(precio)} c/u</span></div>` +
        (pideVuelto ? `<div class="wcj-l"><span>paga con</span><span>${lps(paga)}</span></div>` : '');
      pgEl.textContent = pideVuelto ? '¿Cuánto le devuelves de vuelto?' : '¿Cuánto es el total?';
      const bueno = pideVuelto ? vuelto : total;
      const malos = pideVuelto
        ? [paga - precio * (k + 1), Math.abs(paga - precio)]
        : [precio * k * 10, Math.round(precio * k / 10)];
      const ops = [...new Set([bueno, ...malos])].slice(0, 3).sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      ops.forEach(v => {
        const b = document.createElement('button');
        b.className = 'wcj-opt'; b.textContent = lps(v);
        b.onclick = () => cerrar(b, false, v);
        optsEl.appendChild(b);
      });
      msgEl.className = 'wcj-msg';
      msgEl.textContent = 'Cóbrale bien: el punto en su sitio.';
      correr();
    }

    function cerrar(btn, porTiempo, v) {
      if (answered) return;
      answered = true; parar();
      const bueno = cur.pideVuelto ? cur.vuelto : cur.total;
      optsEl.querySelectorAll('.wcj-opt').forEach(b => { b.disabled = true; if (b.textContent === lps(bueno)) b.classList.add('ok'); });
      const cuenta = `${cur.k} × ${lps(cur.precio)} = ${lps(cur.total)}` + (cur.pideVuelto ? `, y ${lps(cur.paga)} − ${lps(cur.total)} = ${lps(cur.vuelto)}` : '');
      if (!porTiempo && v === bueno) {
        streak++;
        msgEl.className = 'wcj-msg ok';
        msgEl.innerHTML = `✔ ¡Caja cuadrada! ${cuenta}.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('k' + awarded.size); pts(2); }
      } else {
        streak = 0;
        if (btn) btn.classList.add('no');
        msgEl.className = 'wcj-msg err';
        msgEl.innerHTML = `${porTiempo ? '⏰ Se acabó el tiempo. ' : '💡 '}Era <strong>${lps(bueno)}</strong>: ${cuenta}.`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3200);
    }

    nueva();
  }
};
