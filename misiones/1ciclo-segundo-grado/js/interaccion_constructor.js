// js/interaccion_constructor.js
// Lab 1: La Escalera Mágica — constructor de números de hasta 9 cifras.
// El reto llega ESCRITO EN LETRAS: el estudiante debe armarlo con los botones ▲▼.

window.WidgetConstructorJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const POS = [
      { k: 'cmi', lbl: 'C', per: 'millones' }, { k: 'dmi', lbl: 'D', per: 'millones' }, { k: 'umi', lbl: 'U', per: 'millones' },
      { k: 'cm', lbl: 'C', per: 'miles' }, { k: 'dm', lbl: 'D', per: 'miles' }, { k: 'um', lbl: 'U', per: 'miles' },
      { k: 'c', lbl: 'C', per: 'unidades' }, { k: 'd', lbl: 'D', per: 'unidades' }, { k: 'u', lbl: 'U', per: 'unidades' }
    ];

    container.innerHTML = `
      <style>
        .wcn-box { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wcn-reto { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; text-align: center; background: rgba(21,101,192,0.10); border: 2px dashed #1565c0; border-radius: 12px; padding: 0.55rem 0.7rem; color: #0d47a1; margin-bottom: 0.8rem; line-height: 1.35; }
        .wcn-display { font-family: 'Fira Code', monospace; font-size: 1.9rem; font-weight: 700; text-align: center; color: #1b2838; letter-spacing: 0.05em; margin-bottom: 0.2rem; }
        .wcn-words { font-size: 0.82rem; text-align: center; color: #636e72; font-style: italic; min-height: 1.3rem; margin-bottom: 0.7rem; }
        .wcn-periods { display: flex; gap: 0.45rem; justify-content: center; flex-wrap: wrap; }
        .wcn-period { border: 2px solid; border-radius: 12px; padding: 0.35rem 0.3rem 0.45rem; text-align: center; }
        .wcn-period.p-mi { border-color: #6c5ce7; background: rgba(108,92,231,0.07); }
        .wcn-period.p-ml { border-color: #00838f; background: rgba(0,131,143,0.07); }
        .wcn-period.p-un { border-color: #1565c0; background: rgba(21,101,192,0.07); }
        .wcn-period-lbl { font-family: 'Fredoka', sans-serif; font-size: 0.62rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 0.25rem; }
        .p-mi .wcn-period-lbl { color: #6c5ce7; } .p-ml .wcn-period-lbl { color: #00838f; } .p-un .wcn-period-lbl { color: #1565c0; }
        .wcn-slots { display: flex; gap: 0.25rem; justify-content: center; }
        .wcn-slot { display: flex; flex-direction: column; align-items: center; gap: 0.12rem; }
        .wcn-slot-lbl { font-family: 'Fredoka', sans-serif; font-size: 0.6rem; color: #636e72; font-weight: 700; }
        .wcn-btn { width: 30px; height: 22px; border: none; border-radius: 6px; background: #1565c0; color: white; font-size: 0.7rem; cursor: pointer; line-height: 1; }
        .wcn-btn:active { transform: scale(0.92); }
        .wcn-digit { font-family: 'Fira Code', monospace; font-size: 1.15rem; font-weight: 700; width: 30px; text-align: center; color: #1b2838; background: white; border: 1.5px solid #e2ddd4; border-radius: 6px; }
        .wcn-actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; margin-top: 0.8rem; }
        .wcn-act { font-family: 'Fredoka', sans-serif; font-size: 0.85rem; padding: 0.45rem 1.1rem; border: none; border-radius: 18px; cursor: pointer; font-weight: 700; color: white; }
        .wcn-check { background: #00b894; } .wcn-new { background: #1565c0; }
        .wcn-msg { font-size: 0.85rem; text-align: center; min-height: 2rem; margin-top: 0.6rem; padding: 0.4rem 0.6rem; border-radius: 8px; color: #636e72; line-height: 1.4; }
        .wcn-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wcn-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        [data-theme="dark"] .wcn-box { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wcn-display, [data-theme="dark"] .wcn-digit { color: #e8f0fe; }
        [data-theme="dark"] .wcn-digit { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wcn-reto { color: #90caf9; }
        @media (max-width: 480px) { .wcn-btn, .wcn-digit { width: 26px; } .wcn-display { font-size: 1.4rem; } }
      </style>
      <div class="wcn-box">
        <div class="wcn-reto" id="wcn-reto"></div>
        <div class="wcn-display" id="wcn-display">0</div>
        <div class="wcn-words" id="wcn-words">cero</div>
        <div class="wcn-periods">
          <div class="wcn-period p-mi"><div class="wcn-period-lbl">Millones</div><div class="wcn-slots" id="wcn-per-millones"></div></div>
          <div class="wcn-period p-ml"><div class="wcn-period-lbl">Miles</div><div class="wcn-slots" id="wcn-per-miles"></div></div>
          <div class="wcn-period p-un"><div class="wcn-period-lbl">Unidades</div><div class="wcn-slots" id="wcn-per-unidades"></div></div>
        </div>
        <div class="wcn-actions">
          <button class="wcn-act wcn-check" id="wcn-check">✅ ¡Lo formé!</button>
          <button class="wcn-act wcn-new" id="wcn-new">🔀 Nuevo reto</button>
        </div>
        <div class="wcn-msg" id="wcn-msg">Usa los botones ▲▼ para formar el número pedido.</div>
      </div>
    `;

    const digits = Array(9).fill(0);
    let target = 0;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function value() { return digits.reduce((acc, d) => acc * 10 + d, 0); }
    function words(n) { return (typeof numToWords === 'function') ? numToWords(n) : String(n); }
    function setMsg(text, cls) { const m = document.getElementById('wcn-msg'); m.innerHTML = text; m.className = 'wcn-msg' + (cls ? ' ' + cls : ''); }

    function render() {
      const v = value();
      document.getElementById('wcn-display').textContent = v.toLocaleString('en-US');
      document.getElementById('wcn-words').textContent = words(v);
      POS.forEach((p, i) => { const el = document.getElementById('wcn-dig-' + i); if (el) el.textContent = digits[i]; });
    }

    function buildSlots() {
      POS.forEach((p, i) => {
        const wrap = document.getElementById('wcn-per-' + p.per);
        const slot = document.createElement('div'); slot.className = 'wcn-slot';
        slot.innerHTML = `<span class="wcn-slot-lbl">${p.lbl}</span><button class="wcn-btn" aria-label="Subir ${p.lbl} de ${p.per}">▲</button><div class="wcn-digit" id="wcn-dig-${i}">0</div><button class="wcn-btn" aria-label="Bajar ${p.lbl} de ${p.per}">▼</button>`;
        const [up, down] = slot.querySelectorAll('.wcn-btn');
        up.onclick = () => { digits[i] = (digits[i] + 1) % 10; if (typeof sfx === 'function') sfx('click'); render(); };
        down.onclick = () => { digits[i] = (digits[i] + 9) % 10; if (typeof sfx === 'function') sfx('click'); render(); };
        wrap.appendChild(slot);
      });
    }

    function newChallenge() {
      // Sube de nivel: 3, 4, 5, 6, 7 o 9 cifras, a veces con ceros escondidos
      const nd = [3, 4, 5, 6, 7, 9][rint(0, 5)];
      let n = rint(Math.pow(10, nd - 1), Math.pow(10, nd) - 1);
      if (rint(0, 1)) { // forzar un cero interior: los ceros de relleno son el reto real
        const s = String(n).split(''); s[rint(1, s.length - 2)] = '0'; n = parseInt(s.join(''), 10);
      }
      target = n;
      document.getElementById('wcn-reto').innerHTML = '🎯 Forma el número: <strong>«' + words(target) + '»</strong>';
      setMsg('Usa los botones ▲▼ para formar el número pedido.');
    }

    document.getElementById('wcn-check').onclick = () => {
      const v = value();
      if (v === target) {
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 5 && typeof pts === 'function') { awarded.add('a' + awarded.size); pts(2); }
        setMsg(`✔ ¡Excelente! «${words(target)}» = <strong>${target.toLocaleString('en-US')}</strong>. +2 XP · ¡Pide otro reto!`, 'ok');
        if (typeof launchConfetti === 'function') launchConfetti();
      } else {
        if (typeof sfx === 'function') sfx('no');
        setMsg(`💡 Tienes <strong>${v.toLocaleString('en-US')}</strong> («${words(v)}»). Revisa posición por posición: ¿pusiste los ceros de relleno?`, 'err');
      }
    };
    document.getElementById('wcn-new').onclick = () => { if (typeof sfx === 'function') sfx('click'); newChallenge(); };

    buildSlots();
    render();
    newChallenge();
  }
};
