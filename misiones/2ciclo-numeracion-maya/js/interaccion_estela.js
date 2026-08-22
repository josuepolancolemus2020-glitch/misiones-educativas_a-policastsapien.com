// js/interaccion_estela.js
// Widget: Lee la Estela. El camino inverso al del escriba, y el que se pide en
// el examen. La estela se dibuja con los símbolos apilados como en la piedra,
// para que el alumno reconozca lo que hay en Copán si algún día lo visita.

window.WidgetEstelaJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wet-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wet-estela { background:linear-gradient(#efebe9,#d7ccc8); border:2px solid #a1887f; border-radius:12px 12px 6px 6px; padding:0.9rem 1.2rem; width:max-content; margin:0 auto 0.8rem; display:flex; flex-direction:column; gap:0.55rem; }
        .wet-nivel { display:flex; flex-direction:column; align-items:center; gap:3px; padding:0.3rem 0.5rem; border-bottom:1px solid rgba(0,0,0,0.10); }
        .wet-nivel:last-child { border-bottom:none; }
        .wet-fila { display:flex; gap:5px; }
        .wet-pt { width:11px; height:11px; border-radius:50%; background:#4e342e; }
        .wet-br { width:52px; height:7px; border-radius:3px; background:#4e342e; }
        .wet-co { font-size:1.05rem; line-height:1; }
        .wet-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wet-opt { font-family:'Fira Code',monospace; font-size:1.05rem; padding:0.5rem 1.2rem; border:2px solid #00695c; border-radius:20px; background:#fff; color:#00695c; cursor:pointer; font-weight:700; }
        .wet-opt:hover:not(:disabled) { background:#00695c; color:#fff; }
        .wet-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wet-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wet-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wet-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wet-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wet-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wet-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wet-estela { background:linear-gradient(#3e3a36,#2b2724); border-color:#5d4037; }
        [data-theme="dark"] .wet-pt, [data-theme="dark"] .wet-br { background:#e0d6c8; }
        [data-theme="dark"] .wet-opt { background:#1e2130; color:#4db6ac; }
        [data-theme="dark"] .wet-msg { color:#a0aec0; }
        [data-theme="dark"] .wet-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wet-msg.err { color:#ffb3b3; }
      </style>
      <div class="wet-container">
        <div class="wet-estela" id="wet-estela"></div>
        <div class="wet-opts" id="wet-opts"></div>
        <div class="wet-msg" id="wet-msg">Empieza por el nivel de abajo: el de arriba vale 20 veces más.</div>
        <div class="wet-streak" id="wet-streak">🔥 Racha: 0</div>
      </div>`;

    const estEl = document.getElementById('wet-estela'), optsEl = document.getElementById('wet-opts');
    const msgEl = document.getElementById('wet-msg'), stEl = document.getElementById('wet-streak');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    function dibujaNivel(v) {
      const barras = Math.floor(v / 5), puntos = v % 5;
      let s = '';
      if (v === 0) s = '<div class="wet-co">🐚</div>';
      else {
        if (puntos) s += '<div class="wet-fila">' + '<div class="wet-pt"></div>'.repeat(puntos) + '</div>';
        for (let i = 0; i < barras; i++) s += '<div class="wet-br"></div>';
      }
      return `<div class="wet-nivel">${s}</div>`;
    }

    function nueva() {
      const arriba = rint(1, 9), abajo = rint(0, 19);
      cur = { arriba, abajo, n: arriba * 20 + abajo };
      answered = false;
      estEl.innerHTML = dibujaNivel(arriba) + dibujaNivel(abajo);
      // El distractor clásico: leerlo como si el nivel de arriba valiera 10
      const malos = [arriba * 10 + abajo, Number('' + arriba + abajo), arriba + abajo];
      const ops = [...new Set([cur.n, ...malos])].slice(0, 3).sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      ops.forEach(v => {
        const b = document.createElement('button');
        b.className = 'wet-opt'; b.textContent = v;
        b.onclick = () => responder(b, v);
        optsEl.appendChild(b);
      });
      msgEl.className = 'wet-msg';
      msgEl.textContent = 'Empieza por el nivel de abajo: el de arriba vale 20 veces más.';
    }

    function responder(btn, v) {
      if (answered) return;
      answered = true;
      optsEl.querySelectorAll('.wet-opt').forEach(b => { b.disabled = true; if (+b.textContent === cur.n) b.classList.add('ok'); });
      if (v === cur.n) {
        streak++;
        msgEl.className = 'wet-msg ok';
        msgEl.innerHTML = `✔ ¡Leída! ${cur.arriba} × 20 + ${cur.abajo} = <strong>${cur.n}</strong>.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('t' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no'); streak = 0;
        msgEl.className = 'wet-msg err';
        msgEl.innerHTML = `💡 Era <strong>${cur.n}</strong>: ${cur.arriba} × 20 + ${cur.abajo}. Ojo, el nivel de arriba vale <strong>20</strong>, no 10.`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3200);
    }

    nueva();
  }
};
