// js/interaccion_cambista.js
// Widget: El Cambista ×10 — la escalera del valor posicional funciona por canjes:
// ¿cuántas decenas caben en 1,000? ¿cuántos miles hay en un millón?

window.WidgetCambistaJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wcb-box { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wcb-q { font-family: 'Fredoka', sans-serif; font-size: 1.05rem; text-align: center; color: #0d47a1; margin-bottom: 0.35rem; line-height: 1.4; }
        .wcb-visual { font-size: 0.8rem; text-align: center; color: #636e72; margin-bottom: 0.8rem; font-family: 'Fredoka', sans-serif; }
        .wcb-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
        .wcb-opt { font-family: 'Fira Code', monospace; font-size: 0.95rem; padding: 0.5rem 1.2rem; border: 2px solid #1565c0; border-radius: 18px; background: white; color: #1565c0; cursor: pointer; font-weight: 700; }
        .wcb-opt:hover:not(:disabled) { background: #1565c0; color: white; }
        .wcb-opt.wcb-ok { background: #00b894; border-color: #00b894; color: white; }
        .wcb-opt.wcb-no { background: #d63031; border-color: #d63031; color: white; }
        .wcb-msg { font-size: 0.86rem; text-align: center; color: #636e72; min-height: 2.4rem; padding: 0.4rem 0.6rem; border-radius: 8px; margin-top: 0.7rem; line-height: 1.45; }
        .wcb-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wcb-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wcb-streak { font-family: 'Fredoka', sans-serif; font-size: 0.8rem; text-align: center; color: #636e72; margin-top: 0.4rem; }
        [data-theme="dark"] .wcb-box { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wcb-opt { background: #1e2130; }
        [data-theme="dark"] .wcb-q { color: #90caf9; }
      </style>
      <div class="wcb-box">
        <div class="wcb-q" id="wcb-q"></div>
        <div class="wcb-visual" id="wcb-visual"></div>
        <div class="wcb-opts" id="wcb-opts"></div>
        <div class="wcb-msg" id="wcb-msg">Cada peldaño de la escalera vale 10 veces el anterior.</div>
        <div class="wcb-streak" id="wcb-streak">🔥 Racha: 0</div>
      </div>
    `;

    // La escalera: [nombre plural, nombre singular con artículo, valor]
    const LADDER = [
      ['unidades', '1 unidad', 1], ['decenas', '1 decena', 10], ['centenas', '1 centena', 100],
      ['unidades de millar', '1 unidad de millar', 1000], ['decenas de millar', '1 decena de millar', 10000],
      ['centenas de millar', '1 centena de millar', 100000], ['millones', 'un millón', 1000000]
    ];
    let answered = false, streak = 0, ansVal = 0;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function fmt(n) { return n.toLocaleString('en-US'); }
    function setMsg(text, cls) { const m = document.getElementById('wcb-msg'); m.innerHTML = text; m.className = 'wcb-msg' + (cls ? ' ' + cls : ''); }

    function newRound() {
      answered = false;
      // elegir peldaño bajo y peldaño alto (1 a 3 saltos de distancia)
      const lo = rint(0, LADDER.length - 2);
      const hi = Math.min(LADDER.length - 1, lo + rint(1, 3));
      const [nomLo, , valLo] = LADDER[lo];
      const [, singHi, valHi] = LADDER[hi];
      ansVal = valHi / valLo;
      document.getElementById('wcb-q').innerHTML = `💱 ¿Cuántas <strong>${nomLo}</strong> se necesitan para formar <strong>${singHi}</strong> (${fmt(valHi)})?`;
      document.getElementById('wcb-visual').textContent = `Escalera: cada una vale ${fmt(valLo)} · la meta vale ${fmt(valHi)}`;
      const trampas = new Set([ansVal * 10, ansVal / 10 >= 1 ? ansVal / 10 : ansVal * 100]);
      trampas.delete(ansVal);
      const opts = [ansVal, ...[...trampas].slice(0, 2)].sort(() => Math.random() - 0.5);
      const box = document.getElementById('wcb-opts'); box.innerHTML = '';
      opts.forEach(v => {
        const b = document.createElement('button');
        b.className = 'wcb-opt'; b.textContent = fmt(v);
        b.onclick = () => answer(b, v, nomLo, valLo, valHi);
        box.appendChild(b);
      });
      setMsg('Cada peldaño de la escalera vale 10 veces el anterior.');
    }

    function answer(btn, v, nomLo, valLo, valHi) {
      if (answered) return;
      answered = true;
      document.querySelectorAll('#wcb-opts .wcb-opt').forEach(b => { b.disabled = true; if (parseInt(b.textContent.replace(/,/g, ''), 10) === ansVal) b.classList.add('wcb-ok'); });
      if (v === ansVal) {
        streak++;
        setMsg(`✔ ¡Canje perfecto! ${fmt(ansVal)} × ${fmt(valLo)} = ${fmt(valHi)}.`, 'ok');
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('a' + awarded.size); pts(2); }
      } else {
        btn.classList.add('wcb-no');
        streak = 0;
        setMsg(`💡 Se necesitan <strong>${fmt(ansVal)}</strong>: divide ${fmt(valHi)} ÷ ${fmt(valLo)}. ¡Cuenta los saltos ×10 en la escalera!`, 'err');
        if (typeof sfx === 'function') sfx('no');
      }
      document.getElementById('wcb-streak').textContent = '🔥 Racha: ' + streak;
      setTimeout(newRound, 2600);
    }

    newRound();
  }
};
