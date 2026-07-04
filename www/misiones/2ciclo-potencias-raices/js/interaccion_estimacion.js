// js/interaccion_estimacion.js
// Widget: ¿Entre qué cuadrados está? — estimación de raíces de números NO perfectos.
// Adaptativo: nivel 1 usa números pequeños con opciones muy separadas;
// al acertar sube a niveles con números mayores y opciones más cercanas.

window.WidgetEstimacionJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .we2-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .we2-level { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem; flex-wrap: wrap; gap: 0.4rem; }
        .we2-level-tag { font-family: 'Fredoka', sans-serif; font-size: 0.78rem; background: rgba(124,58,237,0.12); color: #7c3aed; padding: 0.25rem 0.7rem; border-radius: 20px; font-weight: 700; }
        .we2-streak { font-family: 'Fredoka', sans-serif; font-size: 0.78rem; color: #636e72; }
        .we2-q { font-family: 'Fredoka', sans-serif; font-size: 1.15rem; color: #1b2838; text-align: center; margin-bottom: 1rem; font-weight: 600; }
        .we2-q .we2-x { color: #f59e0b; font-size: 1.5rem; font-weight: 800; }
        .we2-opts { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem; }
        .we2-opt { font-family: 'Fredoka', sans-serif; font-size: 0.92rem; padding: 0.6rem 1rem; border: 2px solid #7c3aed; border-radius: 12px; background: white; color: #7c3aed; cursor: pointer; transition: all 0.2s; text-align: center; }
        .we2-opt:hover:not(:disabled) { background: #7c3aed; color: white; }
        .we2-opt.we2-ok { background: #00b894 !important; border-color: #00b894 !important; color: white !important; }
        .we2-opt.we2-no { background: #d63031 !important; border-color: #d63031 !important; color: white !important; }
        .we2-line-wrap { display: none; margin: 0.8rem 0; }
        .we2-line-wrap.show { display: block; animation: we2Fade 0.4s ease; }
        @keyframes we2Fade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .we2-line-labels { display: flex; justify-content: space-between; font-family: 'Fira Code', monospace; font-size: 0.85rem; color: #1b2838; margin-bottom: 0.25rem; }
        .we2-line-track { position: relative; height: 26px; background: linear-gradient(90deg, rgba(124,58,237,0.18), rgba(245,158,11,0.18)); border-radius: 13px; border: 1.5px solid #dcdde1; }
        .we2-dot { position: absolute; top: 50%; transform: translate(-50%,-50%); width: 18px; height: 18px; background: #f59e0b; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.25); }
        .we2-dot-lbl { position: absolute; top: -22px; transform: translateX(-50%); font-family: 'Fredoka', sans-serif; font-size: 0.8rem; color: #f59e0b; font-weight: 700; white-space: nowrap; }
        .we2-roots { display: flex; justify-content: space-between; font-size: 0.78rem; color: #636e72; margin-top: 0.25rem; }
        .we2-fb { font-size: 0.87rem; padding: 0.5rem 0.8rem; border-radius: 8px; display: none; line-height: 1.45; }
        .we2-fb.show { display: block; }
        .we2-fb.ok { background: rgba(0,184,148,0.15); color: #006d4e; }
        .we2-fb.err { background: rgba(214,48,49,0.10); color: #a00; }
        .we2-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.9rem; flex-wrap: wrap; }
        .we2-btn { font-family: 'Fredoka', sans-serif; background: #7c3aed; color: white; border: none; padding: 0.55rem 1.2rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: transform 0.2s; }
        .we2-btn:hover { transform: translateY(-2px); }
        [data-theme="dark"] .we2-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .we2-q, [data-theme="dark"] .we2-line-labels { color: #e8f0fe; }
        [data-theme="dark"] .we2-opt { background: #1e2130; }
        [data-theme="dark"] .we2-line-track { border-color: #2d3450; }
      </style>
      <div class="we2-container">
        <div class="we2-level">
          <span class="we2-level-tag" id="we2-level-tag">Nivel 1 · Detective de raíces</span>
          <span class="we2-streak" id="we2-streak">Racha: 0 ⭐</span>
        </div>
        <div class="we2-q" id="we2-q"></div>
        <div class="we2-opts" id="we2-opts"></div>
        <div class="we2-line-wrap" id="we2-line-wrap">
          <div class="we2-line-labels"><span id="we2-lbl-left"></span><span id="we2-lbl-right"></span></div>
          <div class="we2-line-track" id="we2-track">
            <div class="we2-dot-lbl" id="we2-dot-lbl"></div>
            <div class="we2-dot" id="we2-dot"></div>
          </div>
          <div class="we2-roots"><span id="we2-root-left"></span><span id="we2-root-right"></span></div>
        </div>
        <div class="we2-fb" id="we2-fb"></div>
        <div class="we2-btn-row">
          <button class="we2-btn" id="we2-btn-next">▶ Siguiente número</button>
        </div>
      </div>
    `;

    // Niveles adaptativos: rangos de la base f (raíz entera inferior).
    // Nivel 1: bases pequeñas y opciones bien separadas; nivel 3: bases grandes, opciones vecinas.
    const LEVELS = [
      { name: 'Nivel 1 · Detective de raíces', fMin: 2, fMax: 5,  spread: 2 },
      { name: 'Nivel 2 · Rastreador experto',  fMin: 5, fMax: 9,  spread: 1 },
      { name: 'Nivel 3 · Maestro estimador',   fMin: 9, fMax: 13, spread: 1 }
    ];
    let level = 0, streak = 0, current = null, answered = false;
    const awarded = new Set();

    const qEl = document.getElementById('we2-q');
    const optsEl = document.getElementById('we2-opts');
    const fbEl = document.getElementById('we2-fb');
    const lineWrap = document.getElementById('we2-line-wrap');
    const levelTag = document.getElementById('we2-level-tag');
    const streakEl = document.getElementById('we2-streak');
    const btnNext = document.getElementById('we2-btn-next');

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    function newQuestion() {
      answered = false;
      const cfg = LEVELS[level];
      const f = rint(cfg.fMin, cfg.fMax);
      // X no perfecto, estrictamente entre f² y (f+1)²
      const x = rint(f * f + 1, (f + 1) * (f + 1) - 1);
      current = { x, f };
      qEl.innerHTML = `El número <span class="we2-x">${x}</span> no es un cuadrado perfecto.<br>¿Entre cuáles cuadrados perfectos está?`;
      // Opciones: correcta + 2 distractores desplazados según el nivel
      const mk = (base) => ({ base, label: `Entre ${base}² (${base * base}) y ${base + 1}² (${(base + 1) * (base + 1)})` });
      const candidates = [mk(f)];
      const d1 = Math.max(1, f - cfg.spread), d2 = Math.min(13, f + cfg.spread);
      if (d1 !== f) candidates.push(mk(d1));
      if (d2 !== f && d2 !== d1) candidates.push(mk(d2));
      while (candidates.length < 3) {
        const alt = rint(1, 13);
        if (!candidates.some(c => c.base === alt)) candidates.push(mk(alt));
      }
      candidates.sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      candidates.forEach(c => {
        const b = document.createElement('button');
        b.className = 'we2-opt';
        b.textContent = c.label;
        b.addEventListener('click', () => answer(c.base, b));
        optsEl.appendChild(b);
      });
      fbEl.className = 'we2-fb';
      fbEl.textContent = '';
      lineWrap.className = 'we2-line-wrap';
      levelTag.textContent = cfg.name;
    }

    function showLine() {
      const { x, f } = current;
      const lo = f * f, hi = (f + 1) * (f + 1);
      document.getElementById('we2-lbl-left').textContent = lo;
      document.getElementById('we2-lbl-right').textContent = hi;
      document.getElementById('we2-root-left').textContent = `√${lo} = ${f}`;
      document.getElementById('we2-root-right').textContent = `√${hi} = ${f + 1}`;
      const pct = ((x - lo) / (hi - lo)) * 100;
      document.getElementById('we2-dot').style.left = pct + '%';
      const dotLbl = document.getElementById('we2-dot-lbl');
      dotLbl.style.left = pct + '%';
      dotLbl.textContent = x;
      lineWrap.className = 'we2-line-wrap show';
    }

    function answer(base, btn) {
      if (answered) return;
      answered = true;
      const isOk = base === current.f;
      optsEl.querySelectorAll('.we2-opt').forEach(b => { b.disabled = true; });
      btn.classList.add(isOk ? 'we2-ok' : 'we2-no');
      if (!isOk) {
        optsEl.querySelectorAll('.we2-opt').forEach(b => {
          if (b.textContent.startsWith(`Entre ${current.f}²`)) b.classList.add('we2-ok');
        });
      }
      showLine();
      const { x, f } = current;
      if (isOk) {
        streak++;
        fbEl.textContent = `✔ ¡Correcto! ${f}²=${f * f} < ${x} < ${(f + 1) * (f + 1)}=${f + 1}². Por eso √${x} está entre ${f} y ${f + 1} (no es un número entero).`;
        fbEl.className = 'we2-fb show ok';
        if (typeof sfx === 'function') sfx('ok');
        if (!awarded.has(x) && typeof pts === 'function') { awarded.add(x); pts(2); }
        // Subir de nivel cada 3 aciertos seguidos
        if (streak % 3 === 0 && level < LEVELS.length - 1) {
          level++;
          if (typeof showToast === 'function') showToast('🎯 ¡Subiste a ' + LEVELS[level].name + '!');
          if (typeof sfx === 'function') sfx('up');
        }
      } else {
        streak = 0;
        if (level > 0) level--; // baja un nivel para reforzar
        fbEl.textContent = `💡 Observa la recta: ${current.f}²=${f * f} y ${f + 1}²=${(f + 1) * (f + 1)}. El ${x} queda en medio, así que su raíz está entre ${f} y ${f + 1}.`;
        fbEl.className = 'we2-fb show err';
        if (typeof sfx === 'function') sfx('no');
      }
      streakEl.textContent = `Racha: ${streak} ⭐`;
    }

    btnNext.addEventListener('click', () => {
      if (typeof sfx === 'function') sfx('click');
      newQuestion();
    });

    newQuestion();
  }
};
