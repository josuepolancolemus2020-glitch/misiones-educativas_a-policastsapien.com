// js/interaccion_posicion.js
// Widget: Detective de Posiciones — se resalta una cifra dentro de un número
// grande y el estudiante decide cuánto VALE según su posición.

window.WidgetPosicionJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wps-box { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wps-num { font-family: 'Fira Code', monospace; font-size: 2rem; font-weight: 700; color: #1b2838; text-align: center; margin-bottom: 0.4rem; letter-spacing: 0.06em; }
        .wps-num .wps-hl { color: #ffffff; background: #1565c0; border-radius: 6px; padding: 0 0.15em; }
        .wps-q { font-family: 'Fredoka', sans-serif; font-size: 0.92rem; text-align: center; color: #0d47a1; margin-bottom: 0.8rem; }
        .wps-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
        .wps-opt { font-family: 'Fira Code', monospace; font-size: 0.95rem; padding: 0.5rem 1.1rem; border: 2px solid #1565c0; border-radius: 18px; background: white; color: #1565c0; cursor: pointer; font-weight: 700; }
        .wps-opt:hover:not(:disabled) { background: #1565c0; color: white; }
        .wps-opt.wps-ok { background: #00b894; border-color: #00b894; color: white; }
        .wps-opt.wps-no { background: #d63031; border-color: #d63031; color: white; }
        .wps-msg { font-size: 0.86rem; text-align: center; color: #636e72; min-height: 2.4rem; padding: 0.4rem 0.6rem; border-radius: 8px; margin-top: 0.7rem; line-height: 1.45; }
        .wps-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wps-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wps-streak { font-family: 'Fredoka', sans-serif; font-size: 0.8rem; text-align: center; color: #636e72; margin-top: 0.4rem; }
        [data-theme="dark"] .wps-box { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wps-num { color: #e8f0fe; }
        [data-theme="dark"] .wps-opt { background: #1e2130; }
        [data-theme="dark"] .wps-q { color: #90caf9; }
      </style>
      <div class="wps-box">
        <div class="wps-num" id="wps-num"></div>
        <div class="wps-q" id="wps-q">¿Cuánto VALE la cifra resaltada?</div>
        <div class="wps-opts" id="wps-opts"></div>
        <div class="wps-msg" id="wps-msg">La misma cifra vale distinto según el lugar donde vive.</div>
        <div class="wps-streak" id="wps-streak">🔥 Racha: 0</div>
      </div>
    `;

    const POS_NAMES = ['unidades', 'decenas', 'centenas', 'unidades de millar', 'decenas de millar', 'centenas de millar', 'unidades de millón', 'decenas de millón', 'centenas de millón'];
    let current = 0, hlPos = 0, answered = false, streak = 0;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function fmt(n) { return n.toLocaleString('en-US'); }
    function setMsg(text, cls) { const m = document.getElementById('wps-msg'); m.innerHTML = text; m.className = 'wps-msg' + (cls ? ' ' + cls : ''); }

    function newRound() {
      answered = false;
      const nd = rint(4, 9);
      current = rint(Math.pow(10, nd - 1), Math.pow(10, nd) - 1);
      const s = String(current);
      // elegir una posición cuya cifra no sea 0 (el 0 vale 0 en cualquier lugar)
      let tries = 0;
      do { hlPos = rint(0, s.length - 1); tries++; } while (s[hlPos] === '0' && tries < 20);
      if (s[hlPos] === '0') { newRound(); return; }
      const digit = parseInt(s[hlPos], 10);
      const power = s.length - 1 - hlPos; // exponente de la posición
      const valor = digit * Math.pow(10, power);
      // pintar el número con la cifra resaltada (contando las comas)
      const conComas = fmt(current); let idx = 0, html = '';
      for (const ch of conComas) {
        if (ch === ',') { html += ','; continue; }
        html += (idx === hlPos) ? `<span class="wps-hl">${ch}</span>` : ch;
        idx++;
      }
      document.getElementById('wps-num').innerHTML = html;
      document.getElementById('wps-q').textContent = `El ${digit} resaltado está en las ${POS_NAMES[power]}. ¿Cuánto VALE?`;
      // opciones: valor correcto + trampas (la cifra sola y valor ÷10 o ×10)
      const trampas = new Set([digit, valor / 10 >= 1 ? valor / 10 : valor * 10, valor * 10]);
      trampas.delete(valor);
      const opts = [valor, ...[...trampas].slice(0, 2)].sort(() => Math.random() - 0.5);
      const box = document.getElementById('wps-opts'); box.innerHTML = '';
      opts.forEach(v => {
        const b = document.createElement('button');
        b.className = 'wps-opt'; b.textContent = fmt(v);
        b.onclick = () => answer(b, v, valor, digit, power);
        box.appendChild(b);
      });
      setMsg('La misma cifra vale distinto según el lugar donde vive.');
    }

    function answer(btn, v, valor, digit, power) {
      if (answered) return;
      answered = true;
      document.querySelectorAll('#wps-opts .wps-opt').forEach(b => { b.disabled = true; if (parseInt(b.textContent.replace(/,/g, ''), 10) === valor) b.classList.add('wps-ok'); });
      if (v === valor) {
        streak++;
        setMsg(`✔ ¡Detective certero! El ${digit} en las ${POS_NAMES[power]} vale ${digit} × ${fmt(Math.pow(10, power))} = <strong>${fmt(valor)}</strong>.`, 'ok');
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('a' + awarded.size); pts(2); }
      } else {
        btn.classList.add('wps-no');
        streak = 0;
        setMsg(`💡 Valía <strong>${fmt(valor)}</strong>: la posición multiplica. ${digit} en las ${POS_NAMES[power]} = ${digit} × ${fmt(Math.pow(10, power))}.`, 'err');
        if (typeof sfx === 'function') sfx('no');
      }
      document.getElementById('wps-streak').textContent = '🔥 Racha: ' + streak;
      setTimeout(newRound, 2600);
    }

    newRound();
  }
};
