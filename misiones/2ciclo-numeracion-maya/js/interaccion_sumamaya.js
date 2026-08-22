// js/interaccion_sumamaya.js
// Widget: Suma Maya. El cambio de cinco puntos por una barra es el mismo
// «llevo una» de nuestra suma, y verlo aquí explica el nuestro de paso. El
// widget muestra el montón antes y después del cambio, que es donde está lo
// que hay que entender.

window.WidgetSumamayaJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wsm-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wsm-op { font-family:'Fredoka',sans-serif; font-size:1rem; text-align:center; color:#636e72; margin-bottom:0.5rem; }
        .wsm-monton { background:#f5f7fb; border-radius:10px; padding:0.7rem; text-align:center; margin-bottom:0.6rem; font-family:'Fredoka',sans-serif; font-size:0.92rem; color:#1b2838; line-height:1.7; }
        .wsm-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wsm-opt { font-family:'Fira Code',monospace; font-size:1.05rem; padding:0.5rem 1.2rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; }
        .wsm-opt:hover:not(:disabled) { background:#1565c0; color:#fff; }
        .wsm-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wsm-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wsm-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.8rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wsm-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wsm-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wsm-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wsm-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wsm-monton { background:#161a26; color:#e8f0fe; }
        [data-theme="dark"] .wsm-opt { background:#1e2130; color:#74b9ff; }
        [data-theme="dark"] .wsm-msg { color:#a0aec0; }
        [data-theme="dark"] .wsm-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wsm-msg.err { color:#ffb3b3; }
      </style>
      <div class="wsm-container">
        <div class="wsm-op" id="wsm-op"></div>
        <div class="wsm-monton" id="wsm-monton"></div>
        <div class="wsm-opts" id="wsm-opts"></div>
        <div class="wsm-msg" id="wsm-msg">Junta los símbolos y haz los cambios: cinco puntos son una barra.</div>
        <div class="wsm-streak" id="wsm-streak">🔥 Racha: 0</div>
      </div>`;

    const opEl = document.getElementById('wsm-op'), monEl = document.getElementById('wsm-monton');
    const optsEl = document.getElementById('wsm-opts'), msgEl = document.getElementById('wsm-msg');
    const stEl = document.getElementById('wsm-streak');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const txt = v => { if (v === 0) return 'una concha'; const b = Math.floor(v / 5), p = v % 5, s = [];
      if (b) s.push(b + ' barra' + (b > 1 ? 's' : '')); if (p) s.push(p + ' punto' + (p > 1 ? 's' : '')); return s.join(' y '); };

    function nueva() {
      const a = rint(3, 17), b = rint(3, 17);
      cur = { a, b, s: a + b };
      answered = false;
      opEl.innerHTML = `<strong>${txt(a)}</strong> más <strong>${txt(b)}</strong>`;
      const barras = Math.floor(a / 5) + Math.floor(b / 5), puntos = (a % 5) + (b % 5);
      monEl.innerHTML = `Al juntarlos hay <strong>${barras} barra${barras === 1 ? '' : 's'} y ${puntos} punto${puntos === 1 ? '' : 's'}</strong>` +
        (puntos >= 5 ? '<br><span style="font-size:0.82rem;color:#c05621;">⚠️ hay cinco puntos o más: toca cambiar</span>' : '');
      const malos = [barras * 5 + puntos + 5, Math.abs(a - b), a + b + 1];
      const ops = [...new Set([cur.s, ...malos])].slice(0, 3).sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      ops.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'wsm-opt'; btn.textContent = v;
        btn.onclick = () => responder(btn, v);
        optsEl.appendChild(btn);
      });
      msgEl.className = 'wsm-msg';
      msgEl.textContent = 'Junta los símbolos y haz los cambios: cinco puntos son una barra.';
    }

    function responder(btn, v) {
      if (answered) return;
      answered = true;
      optsEl.querySelectorAll('.wsm-opt').forEach(b => { b.disabled = true; if (+b.textContent === cur.s) b.classList.add('ok'); });
      const niv = cur.s >= 20 ? ` Y como pasa de 19, sube un punto al nivel de arriba: ${Math.floor(cur.s / 20)} arriba y ${cur.s % 20} abajo.` : '';
      if (v === cur.s) {
        streak++;
        msgEl.className = 'wsm-msg ok';
        msgEl.innerHTML = `✔ ¡Correcto! ${cur.a} + ${cur.b} = <strong>${cur.s}</strong>, o sea ${txt(cur.s % 20)}${cur.s >= 20 ? ' abajo' : ''}.${niv}`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('s' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no'); streak = 0;
        msgEl.className = 'wsm-msg err';
        msgEl.innerHTML = `💡 Era <strong>${cur.s}</strong> (${cur.a} + ${cur.b}). Cada cinco puntos hacen una barra, y no se pierde nada en el cambio.${niv}`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3600);
    }

    nueva();
  }
};
