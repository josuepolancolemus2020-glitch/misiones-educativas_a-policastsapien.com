// js/interaccion_caza.js
// Widget: Caza Sólidos en tu Casa. La geometría del espacio se entiende
// cuando se reconoce fuera del cuaderno. Todos los objetos son de una casa
// hondureña de verdad, para que el alumno pueda ir a buscarlos después.

window.WidgetCazaJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const OBJ = [
      { o: 'una lata de leche', e: '🥫', s: 'cilindro' },
      { o: 'un dado', e: '🎲', s: 'cubo' },
      { o: 'una pelota de fútbol', e: '⚽', s: 'esfera' },
      { o: 'un barquillo de helado', e: '🍦', s: 'cono' },
      { o: 'una caja de fósforos', e: '📦', s: 'prisma rectangular' },
      { o: 'un lápiz de seis lados', e: '✏️', s: 'prisma hexagonal' },
      { o: 'un gorro de fiesta', e: '🎉', s: 'cono' },
      { o: 'una naranja', e: '🍊', s: 'esfera' },
      { o: 'un vaso recto', e: '🥛', s: 'cilindro' },
      { o: 'una tienda de campaña', e: '⛺', s: 'prisma triangular' },
      { o: 'un tarro de café', e: '☕', s: 'cilindro' },
      { o: 'una caja de zapatos', e: '👟', s: 'prisma rectangular' }
    ];
    const TODOS = [...new Set(OBJ.map(x => x.s))];

    container.innerHTML = `
      <style>
        .wcz-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.3rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wcz-obj { font-size:3rem; text-align:center; }
        .wcz-nom { font-family:'Fredoka',sans-serif; font-size:1.05rem; font-weight:700; text-align:center; color:#1b2838; margin-bottom:0.8rem; }
        .wcz-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wcz-opt { font-family:'Fredoka',sans-serif; font-size:0.88rem; padding:0.5rem 1rem; border:2px solid #c49000; border-radius:20px; background:#fff; color:#8a6600; cursor:pointer; font-weight:700; }
        .wcz-opt:hover:not(:disabled) { background:#c49000; color:#fff; }
        .wcz-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wcz-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wcz-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wcz-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wcz-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wcz-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wcz-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wcz-nom { color:#e8f0fe; }
        [data-theme="dark"] .wcz-opt { background:#1e2130; color:#f0c674; }
        [data-theme="dark"] .wcz-msg { color:#a0aec0; }
        [data-theme="dark"] .wcz-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wcz-msg.err { color:#ffb3b3; }
      </style>
      <div class="wcz-container">
        <div class="wcz-obj" id="wcz-obj"></div>
        <div class="wcz-nom" id="wcz-nom"></div>
        <div class="wcz-opts" id="wcz-opts"></div>
        <div class="wcz-msg" id="wcz-msg">¿Qué sólido geométrico tiene esta forma?</div>
        <div class="wcz-streak" id="wcz-streak">🔥 Racha: 0</div>
      </div>`;

    const objEl = document.getElementById('wcz-obj'), nomEl = document.getElementById('wcz-nom');
    const optsEl = document.getElementById('wcz-opts'), msgEl = document.getElementById('wcz-msg');
    const stEl = document.getElementById('wcz-streak');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    function nueva() {
      cur = OBJ[rint(0, OBJ.length - 1)];
      answered = false;
      objEl.textContent = cur.e; nomEl.textContent = cur.o;
      const otros = TODOS.filter(s => s !== cur.s).sort(() => Math.random() - 0.5).slice(0, 2);
      optsEl.innerHTML = '';
      [cur.s, ...otros].sort(() => Math.random() - 0.5).forEach(s => {
        const b = document.createElement('button');
        b.className = 'wcz-opt'; b.textContent = s;
        b.onclick = () => responder(b, s);
        optsEl.appendChild(b);
      });
      msgEl.className = 'wcz-msg';
      msgEl.textContent = '¿Qué sólido geométrico tiene esta forma?';
    }

    function responder(btn, s) {
      if (answered) return;
      answered = true;
      optsEl.querySelectorAll('.wcz-opt').forEach(b => { b.disabled = true; if (b.textContent === cur.s) b.classList.add('ok'); });
      if (s === cur.s) {
        streak++;
        msgEl.className = 'wcz-msg ok';
        msgEl.innerHTML = `✔ ¡Cazado! ${cur.o} es un <strong>${cur.s}</strong>. Búscalo en tu casa y compruébalo.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('c' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no'); streak = 0;
        msgEl.className = 'wcz-msg err';
        msgEl.innerHTML = `💡 ${cur.o} es un <strong>${cur.s}</strong>. Piensa en sus bases y en si rueda.`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3000);
    }

    nueva();
  }
};
