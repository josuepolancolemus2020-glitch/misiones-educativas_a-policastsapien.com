// js/interaccion_cazapunto.js
// Widget: Cazador de Puntos Mal Puestos. Es el gesto que hay que dejarle hecho
// costumbre: antes de entregar, redondear y comparar. Un punto corrido en una
// cuenta de tienda son diez veces más lempiras, y el que revisa lo caza en
// tres segundos sin volver a hacer la multiplicación.

window.WidgetCazapuntoJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wcp-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.3rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wcp-card { background:#f5f7fb; border-radius:12px; padding:0.9rem; text-align:center; margin-bottom:0.8rem; }
        .wcp-op { font-family:'Fira Code',monospace; font-size:1.45rem; font-weight:700; color:#1b2838; }
        .wcp-firma { font-size:0.76rem; color:#636e72; margin-top:0.3rem; font-style:italic; }
        .wcp-opts { display:flex; gap:0.6rem; flex-wrap:wrap; justify-content:center; }
        .wcp-opt { font-family:'Fredoka',sans-serif; font-size:1rem; padding:0.55rem 1.3rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; }
        .wcp-opt:hover:not(:disabled) { background:#1565c0; color:#fff; }
        .wcp-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wcp-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wcp-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.8rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wcp-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wcp-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wcp-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wcp-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wcp-card { background:#161a26; }
        [data-theme="dark"] .wcp-op { color:#e8f0fe; }
        [data-theme="dark"] .wcp-opt { background:#1e2130; }
        [data-theme="dark"] .wcp-msg { color:#a0aec0; }
        [data-theme="dark"] .wcp-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wcp-msg.err { color:#ffb3b3; }
      </style>
      <div class="wcp-container">
        <div class="wcp-card">
          <div class="wcp-op" id="wcp-op"></div>
          <div class="wcp-firma" id="wcp-firma"></div>
        </div>
        <div class="wcp-opts">
          <button class="wcp-opt" id="wcp-bien">✅ El punto está BIEN</button>
          <button class="wcp-opt" id="wcp-mal">🚨 El punto está MAL</button>
        </div>
        <div class="wcp-msg" id="wcp-msg">Redondea de cabeza y compara: ¿ese resultado es razonable?</div>
        <div class="wcp-streak" id="wcp-streak">🔥 Racha: 0</div>
      </div>`;

    const opEl = document.getElementById('wcp-op');
    const firmaEl = document.getElementById('wcp-firma');
    const msgEl = document.getElementById('wcp-msg');
    const stEl = document.getElementById('wcp-streak');
    const bBien = document.getElementById('wcp-bien'), bMal = document.getElementById('wcp-mal');
    const NOMBRES = ['Ana', 'Luis', 'Marta', 'José', 'Carmen', 'Pedro', 'Sofía', 'Iván'];
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const limpia = s => s.indexOf('.') > -1 ? s.replace(/0+$/, '').replace(/\.$/, '') : s;

    function conPunto(dig, cif) {
      let s = dig;
      while (s.length <= cif) s = '0' + s;
      return limpia(cif === 0 ? s : s.slice(0, s.length - cif) + '.' + s.slice(s.length - cif));
    }

    function nueva() {
      const ea = rint(12, 98), eb = rint(12, 98);
      const a = ea / 10, b = eb / 10;
      const bueno = conPunto(String(ea * eb), 2);
      const esBueno = rint(0, 1) === 1;
      const desvio = rint(0, 1) ? 1 : -1;
      const mostrado = esBueno ? bueno : conPunto(String(ea * eb), Math.max(0, 2 + desvio));
      cur = { a, b, bueno, esBueno: mostrado === bueno };
      answered = false;
      opEl.textContent = `${a} × ${b} = ${mostrado}`;
      firmaEl.textContent = 'lo entregó ' + NOMBRES[rint(0, NOMBRES.length - 1)];
      bBien.disabled = false; bMal.disabled = false;
      bBien.classList.remove('ok', 'no'); bMal.classList.remove('ok', 'no');
      msgEl.className = 'wcp-msg';
      msgEl.textContent = 'Redondea de cabeza y compara: ¿ese resultado es razonable?';
    }

    function responder(dice, btn) {
      if (answered) return;
      answered = true;
      bBien.disabled = true; bMal.disabled = true;
      const ok = cur.esBueno ? bBien : bMal;
      ok.classList.add('ok');
      const est = Math.round(cur.a) * Math.round(cur.b);
      if (dice === cur.esBueno) {
        streak++;
        msgEl.className = 'wcp-msg ok';
        msgEl.innerHTML = `✔ ¡Cazado! Redondeando: ${Math.round(cur.a)} × ${Math.round(cur.b)} = <strong>${est}</strong>, y el resultado correcto es <strong>${cur.bueno}</strong>.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('z' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no'); streak = 0;
        msgEl.className = 'wcp-msg err';
        msgEl.innerHTML = `💡 El punto estaba <strong>${cur.esBueno ? 'bien' : 'mal'}</strong>. La estimación es ${Math.round(cur.a)} × ${Math.round(cur.b)} = ${est}, y lo correcto es <strong>${cur.bueno}</strong>.`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3400);
    }

    bBien.addEventListener('click', () => responder(true, bBien));
    bMal.addEventListener('click', () => responder(false, bMal));
    nueva();
  }
};
