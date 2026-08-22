// js/interaccion_punto.js
// Widget: El Colocador de Punto. Al multiplicar decimales el alumno casi nunca
// falla la multiplicación: falla el punto. Aquí la cuenta viene ya hecha, así
// que lo único que se practica es lo que de verdad se falla, y la estimación
// aparece al lado para que aprenda a comprobarse solo.

window.WidgetPuntoJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wpt-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wpt-op { font-family:'Fira Code',monospace; font-size:1.2rem; text-align:center; color:#636e72; margin-bottom:0.3rem; }
        .wpt-crudo { font-family:'Fira Code',monospace; font-size:2rem; font-weight:700; color:#1b2838; text-align:center; letter-spacing:0.12em; margin-bottom:0.2rem; }
        .wpt-slots { display:flex; justify-content:center; gap:0.35rem; flex-wrap:wrap; margin-bottom:0.7rem; }
        .wpt-slot { font-family:'Fira Code',monospace; font-size:1.05rem; padding:0.4rem 0.75rem; border:2px dashed #90a4ae; border-radius:8px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; }
        .wpt-slot:hover:not(:disabled) { background:#e3f2fd; border-style:solid; }
        .wpt-slot.wpt-ok { background:#00b894; border-color:#00b894; color:#fff; border-style:solid; }
        .wpt-slot.wpt-no { background:#d63031; border-color:#d63031; color:#fff; border-style:solid; }
        .wpt-est { font-size:0.8rem; text-align:center; color:#8a6600; background:#fdf3d6; border-radius:8px; padding:0.35rem 0.6rem; margin-bottom:0.6rem; }
        .wpt-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; line-height:1.45; }
        .wpt-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wpt-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wpt-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wpt-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wpt-crudo { color:#e8f0fe; }
        [data-theme="dark"] .wpt-slot { background:#1e2130; color:#74b9ff; }
        [data-theme="dark"] .wpt-est { background:#2d2a1e; color:#f0c674; }
        [data-theme="dark"] .wpt-msg { color:#a0aec0; }
        [data-theme="dark"] .wpt-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wpt-msg.err { color:#ffb3b3; }
      </style>
      <div class="wpt-container">
        <div class="wpt-op" id="wpt-op"></div>
        <div class="wpt-crudo" id="wpt-crudo"></div>
        <div class="wpt-est" id="wpt-est"></div>
        <div class="wpt-slots" id="wpt-slots"></div>
        <div class="wpt-msg" id="wpt-msg">La cuenta ya está hecha. ¿Dónde va el punto?</div>
        <div class="wpt-streak" id="wpt-streak">🔥 Racha: 0</div>
      </div>`;

    const opEl = document.getElementById('wpt-op');
    const crudoEl = document.getElementById('wpt-crudo');
    const estEl = document.getElementById('wpt-est');
    const slotsEl = document.getElementById('wpt-slots');
    const msgEl = document.getElementById('wpt-msg');
    const stEl = document.getElementById('wpt-streak');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    function conPunto(digitos, cifras) {
      let s = digitos;
      while (s.length <= cifras) s = '0' + s;
      return cifras === 0 ? s : s.slice(0, s.length - cifras) + '.' + s.slice(s.length - cifras);
    }

    function nueva() {
      const ea = rint(11, 99), eb = rint(11, 99);
      const ca = 1, cb = rint(0, 1) ? 1 : 0;   // 1.2 × 3.4  o  1.2 × 34
      const a = ea / Math.pow(10, ca), b = eb / Math.pow(10, cb);
      const digitos = String(ea * eb);
      cur = { a, b, cifras: ca + cb, digitos };
      answered = false;
      opEl.textContent = `${a} × ${b}`;
      crudoEl.textContent = digitos + '  ← la cuenta sin el punto';
      estEl.innerHTML = `🎯 Estimación: ${Math.round(a)} × ${Math.round(b)} = <strong>${Math.round(a) * Math.round(b)}</strong>`;
      slotsEl.innerHTML = '';
      [0, 1, 2, 3].forEach(c => {
        const b2 = document.createElement('button');
        b2.className = 'wpt-slot'; b2.textContent = conPunto(digitos, c);
        b2.onclick = () => responder(b2, c);
        slotsEl.appendChild(b2);
      });
      msgEl.className = 'wpt-msg';
      msgEl.textContent = 'La cuenta ya está hecha. ¿Dónde va el punto?';
    }

    function responder(btn, c) {
      if (answered) return;
      answered = true;
      const bueno = conPunto(cur.digitos, cur.cifras);
      slotsEl.querySelectorAll('.wpt-slot').forEach(b => {
        b.disabled = true;
        if (b.textContent === bueno) b.classList.add('wpt-ok');
      });
      if (c === cur.cifras) {
        streak++;
        msgEl.className = 'wpt-msg ok';
        msgEl.innerHTML = `✔ ¡Correcto! ${cur.a} trae ${String(cur.a).split('.')[1] ? String(cur.a).split('.')[1].length : 0} cifra decimal y ${cur.b} trae ${String(cur.b).split('.')[1] ? String(cur.b).split('.')[1].length : 0}: <strong>${cur.cifras}</strong> en total. Y la estimación cuadra.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('p' + awarded.size); pts(2); }
      } else {
        btn.classList.add('wpt-no'); streak = 0;
        msgEl.className = 'wpt-msg err';
        msgEl.innerHTML = `💡 Era <strong>${bueno}</strong>: entre los dos factores hay ${cur.cifras} cifra${cur.cifras === 1 ? '' : 's'} decimal${cur.cifras === 1 ? '' : 'es'}. Fíjate en la estimación: es la que delata el punto mal puesto.`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3400);
    }

    nueva();
  }
};
