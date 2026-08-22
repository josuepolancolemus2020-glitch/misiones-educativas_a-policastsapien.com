// js/interaccion_cancela.js
// Widget: Cancela en Cruz. Multiplicar 8/9 × 3/4 sin simplificar antes da
// 24/36, y ahí se pierde media clase buscando entre qué se divide. Cancelando
// primero salen números de una cifra y la cuenta se hace de memoria, que es
// justo lo que necesita un alumno que no tiene calculadora en el pupitre.

window.WidgetCancelaJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wcn-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wcn-op { display:flex; align-items:center; justify-content:center; gap:0.7rem; margin-bottom:0.9rem; }
        .wcn-fr { display:flex; flex-direction:column; align-items:center; }
        .wcn-num, .wcn-den { font-family:'Fira Code',monospace; font-size:1.35rem; font-weight:700; color:#1b2838; padding:0.15rem 0.6rem; border-radius:6px; cursor:pointer; border:2px solid transparent; transition:all 0.18s; }
        .wcn-num:hover, .wcn-den:hover { background:#e3f2fd; }
        .wcn-num.wcn-sel, .wcn-den.wcn-sel { border-color:#1565c0; background:#e3f2fd; }
        .wcn-num.wcn-done, .wcn-den.wcn-done { color:#9aa5b1; text-decoration:line-through; cursor:default; }
        .wcn-bar { width:100%; height:2px; background:#1b2838; margin:2px 0; }
        .wcn-x { font-family:'Fredoka',sans-serif; font-size:1.2rem; color:#636e72; }
        .wcn-mini { font-size:0.7rem; color:#00b894; font-weight:800; height:0.9rem; font-family:'Fredoka',sans-serif; }
        .wcn-acts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; margin-top:0.4rem; }
        .wcn-btn { font-family:'Fredoka',sans-serif; font-size:0.9rem; padding:0.45rem 1.1rem; border:2px solid #00838f; border-radius:20px; background:#fff; color:#00838f; cursor:pointer; font-weight:700; }
        .wcn-btn:hover { background:#00838f; color:#fff; }
        .wcn-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wcn-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wcn-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wcn-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wcn-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wcn-num, [data-theme="dark"] .wcn-den { color:#e8f0fe; }
        [data-theme="dark"] .wcn-num:hover, [data-theme="dark"] .wcn-den:hover { background:#2d3450; }
        [data-theme="dark"] .wcn-num.wcn-sel, [data-theme="dark"] .wcn-den.wcn-sel { background:#2d3450; }
        [data-theme="dark"] .wcn-bar { background:#e8f0fe; }
        [data-theme="dark"] .wcn-btn { background:#1e2130; }
        [data-theme="dark"] .wcn-msg { color:#a0aec0; }
        [data-theme="dark"] .wcn-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wcn-msg.err { color:#ffb3b3; }
      </style>
      <div class="wcn-container">
        <div class="wcn-op" id="wcn-op"></div>
        <div class="wcn-acts">
          <button class="wcn-btn" id="wcn-listo">✅ Ya no se puede más</button>
          <button class="wcn-btn" id="wcn-otra">🔄 Otra operación</button>
        </div>
        <div class="wcn-msg" id="wcn-msg">Toca un número de arriba y uno de abajo que se puedan dividir entre lo mismo.</div>
        <div class="wcn-streak" id="wcn-streak">🔥 Racha: 0</div>
      </div>`;

    const opEl = document.getElementById('wcn-op');
    const msgEl = document.getElementById('wcn-msg');
    const streakEl = document.getElementById('wcn-streak');
    let cur = null, sel = null, streak = 0, cerrada = false;
    const awarded = new Set();

    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const mcd = (a, b) => { while (b) { const t = b; b = a % b; a = t; } return a || 1; };

    function pintar() {
      opEl.innerHTML = '';
      const frs = [[cur.a, cur.b, 'a', 'b'], [cur.c, cur.d, 'c', 'd']];
      frs.forEach(([n, d, kn, kd], idx) => {
        if (idx === 1) { const x = document.createElement('span'); x.className = 'wcn-x'; x.textContent = '×'; opEl.appendChild(x); }
        const box = document.createElement('div'); box.className = 'wcn-fr';
        const mn = document.createElement('div'); mn.className = 'wcn-mini'; mn.textContent = cur.min[kn] || '';
        const num = document.createElement('div'); num.className = 'wcn-num'; num.textContent = n; num.dataset.k = kn;
        const bar = document.createElement('div'); bar.className = 'wcn-bar';
        const den = document.createElement('div'); den.className = 'wcn-den'; den.textContent = d; den.dataset.k = kd;
        const md = document.createElement('div'); md.className = 'wcn-mini'; md.textContent = cur.min[kd] || '';
        [num, den].forEach(el => { el.onclick = () => tocar(el); });
        box.append(mn, num, bar, den, md);
        opEl.appendChild(box);
      });
    }

    function tocar(el) {
      if (cerrada) return;
      const k = el.dataset.k;
      const esArriba = (k === 'a' || k === 'c');
      if (!sel) { sel = k; el.classList.add('wcn-sel'); if (typeof sfx === 'function') sfx('click'); return; }
      if (sel === k) { sel = null; el.classList.remove('wcn-sel'); return; }
      const selArriba = (sel === 'a' || sel === 'c');
      if (selArriba === esArriba) {
        msgEl.className = 'wcn-msg err';
        msgEl.innerHTML = '💡 Uno de <strong>arriba</strong> y uno de <strong>abajo</strong>. Simplificar es dividir un numerador y un denominador entre el mismo número.';
        opEl.querySelectorAll('.wcn-sel').forEach(x => x.classList.remove('wcn-sel'));
        sel = null; if (typeof sfx === 'function') sfx('no');
        return;
      }
      const g = mcd(cur[sel], cur[k]);
      if (g > 1) {
        cur.min[sel] = cur[sel] / g; cur.min[k] = cur[k] / g;
        cur[sel] = cur[sel] / g; cur[k] = cur[k] / g;
        cur.hechos++;
        msgEl.className = 'wcn-msg ok';
        msgEl.innerHTML = `✂️ ¡Cancelado entre <strong>${g}</strong>! Ahora los números son más chicos. ¿Se puede otra vez?`;
        if (typeof sfx === 'function') sfx('ok');
      } else {
        msgEl.className = 'wcn-msg err';
        msgEl.innerHTML = `💡 <strong>${cur[sel]}</strong> y <strong>${cur[k]}</strong> no se dividen entre el mismo número (su máximo común divisor es 1). Prueba otra pareja.`;
        if (typeof sfx === 'function') sfx('no');
      }
      opEl.querySelectorAll('.wcn-sel').forEach(x => x.classList.remove('wcn-sel'));
      sel = null;
      cur.min = { a: '', b: '', c: '', d: '' };
      pintar();
    }

    function cerrar() {
      if (cerrada) return;
      cerrada = true;
      const quedan = mcd(cur.a, cur.d) > 1 || mcd(cur.c, cur.b) > 1 || mcd(cur.a, cur.b) > 1 || mcd(cur.c, cur.d) > 1;
      const prod = cur.a * cur.c, den = cur.b * cur.d;
      if (!quedan) {
        streak++;
        msgEl.className = 'wcn-msg ok';
        msgEl.innerHTML = `✔ ¡Correcto! Ya no se puede cancelar más. Ahora la cuenta sale de memoria: ${cur.a}×${cur.c} = <strong>${prod}</strong> arriba y ${cur.b}×${cur.d} = <strong>${den}</strong> abajo → <strong>${den === 1 ? prod : prod + '/' + den}</strong>.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('x' + awarded.size); pts(2); }
      } else {
        streak = 0;
        msgEl.className = 'wcn-msg err';
        msgEl.innerHTML = `💡 Todavía se puede cancelar. Mira otra vez arriba y abajo: siempre queda una pareja que se divide entre el mismo número.`;
        if (typeof sfx === 'function') sfx('no');
      }
      setTimeout(nueva, 3400);
    }

    function nueva() {
      // Se arman con factores comunes a propósito: si no hay nada que cancelar,
      // el widget no enseña nada.
      const g1 = [2, 3, 4, 5][rint(0, 3)], g2 = [2, 3, 4][rint(0, 2)];
      const a = g1 * rint(1, 3), d = g1 * rint(1, 3);
      const c = g2 * rint(1, 3), b = g2 * rint(1, 4);
      cur = { a, b, c, d, min: { a: '', b: '', c: '', d: '' }, hechos: 0 };
      sel = null; cerrada = false;
      pintar();
      msgEl.className = 'wcn-msg';
      msgEl.innerHTML = 'Toca un número de <strong>arriba</strong> y uno de <strong>abajo</strong> que se puedan dividir entre lo mismo.';
    }

    document.getElementById('wcn-listo').onclick = cerrar;
    document.getElementById('wcn-otra').onclick = () => { if (typeof sfx === 'function') sfx('click'); nueva(); };
    nueva();
  }
};
