// js/interaccion_mcd.js
// Widget: La Fábrica de Divisores — se muestran dos números y todos sus divisores
// como fichas. El estudiante toca los divisores COMUNES y luego corona al más
// grande: el M.C.D. Ronda perfecta (sin errores) otorga XP.

window.WidgetMcdJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wg-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wg-nums { font-family: 'Fredoka', sans-serif; font-size: 1.05rem; font-weight: 600; color: #1b2838; text-align: center; margin-bottom: 0.9rem; }
        .wg-nums strong { color: #1565c0; font-size: 1.3rem; }
        .wg-row { margin-bottom: 0.7rem; }
        .wg-row-lbl { font-family: 'Fredoka', sans-serif; font-size: 0.82rem; color: #636e72; margin-bottom: 0.3rem; }
        .wg-chips { display: flex; gap: 0.4rem; flex-wrap: wrap; }
        .wg-chip { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; font-weight: 600; padding: 0.4rem 0.85rem; border-radius: 18px; border: 2px solid #dcdde1; background: #fafafa; color: #1b2838; cursor: pointer; transition: all 0.2s; user-select: none; }
        .wg-chip:hover { transform: translateY(-2px); }
        .wg-chip.wg-common { border-color: #00b894; background: rgba(0,184,148,0.14); color: #006d4e; }
        .wg-chip.wg-wrong { border-color: #d63031; background: rgba(214,48,49,0.12); color: #a00; animation: wgShake 0.35s ease; }
        @keyframes wgShake { 0%,100% { transform: none; } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .wg-chip.wg-crown { border-color: #f59e0b; background: rgba(245,158,11,0.2); color: #b45309; box-shadow: 0 0 10px rgba(245,158,11,0.5); }
        .wg-phase { font-size: 0.88rem; text-align: center; padding: 0.4rem 0.6rem; border-radius: 8px; color: #636e72; min-height: 2rem; line-height: 1.45; margin-top: 0.5rem; }
        .wg-phase.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wg-phase.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wg-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.8rem; flex-wrap: wrap; }
        .wg-btn { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wg-btn:hover { transform: translateY(-2px); }
        .wg-btn.wg-btn-amber { background: #f59e0b; }
        [data-theme="dark"] .wg-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wg-nums { color: #e8f0fe; }
        [data-theme="dark"] .wg-chip { background: #171923; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .wg-phase { color: #a0aec0; }
      </style>
      <div class="wg-container">
        <div class="wg-nums" id="wg-nums"></div>
        <div class="wg-row">
          <div class="wg-row-lbl" id="wg-lbl-a"></div>
          <div class="wg-chips" id="wg-chips-a"></div>
        </div>
        <div class="wg-row">
          <div class="wg-row-lbl" id="wg-lbl-b"></div>
          <div class="wg-chips" id="wg-chips-b"></div>
        </div>
        <div class="wg-phase" id="wg-phase"></div>
        <div class="wg-btn-row">
          <button class="wg-btn wg-btn-amber" id="wg-new">🔄 Otros números</button>
        </div>
      </div>
    `;

    const numsEl = document.getElementById('wg-nums');
    const lblA = document.getElementById('wg-lbl-a');
    const lblB = document.getElementById('wg-lbl-b');
    const chipsA = document.getElementById('wg-chips-a');
    const chipsB = document.getElementById('wg-chips-b');
    const phaseEl = document.getElementById('wg-phase');

    const PAIRS = [[12, 18], [8, 20], [24, 36], [10, 15], [16, 24], [9, 12], [14, 21], [20, 30], [18, 27], [12, 16]];
    let A = 12, B = 18, commons = [], foundCommons = new Set(), phase = 1, mistakes = 0, xpAwards = 0;

    function divisorsOf(n) { const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }
    function gcd(x, y) { while (y) { [x, y] = [y, x % y]; } return x; }
    function setPhase(text, cls) { phaseEl.innerHTML = text; phaseEl.className = 'wg-phase' + (cls ? ' ' + cls : ''); }

    function onChipClick(chip, val) {
      if (typeof sfx === 'function') sfx('click');
      if (phase === 1) {
        if (commons.includes(val)) {
          document.querySelectorAll(`#wg-chips-a .wg-chip[data-v="${val}"], #wg-chips-b .wg-chip[data-v="${val}"]`).forEach(c => c.classList.add('wg-common'));
          foundCommons.add(val);
          if (typeof sfx === 'function') sfx('ok');
          if (foundCommons.size === commons.length) {
            phase = 2;
            setPhase(`✔ ¡Encontraste los ${commons.length} divisores comunes: ${commons.join(', ')}! Ahora toca el MÁS GRANDE para coronarlo 👑`, 'ok');
          } else {
            setPhase(`✔ ¡Bien! ${val} divide a ambos. Llevas ${foundCommons.size} de ${commons.length} divisores comunes.`, 'ok');
          }
        } else {
          mistakes++;
          chip.classList.add('wg-wrong');
          setTimeout(() => chip.classList.remove('wg-wrong'), 500);
          setPhase(`✘ ${val} solo divide a uno de los dos números; no es común.`, 'err');
          if (typeof sfx === 'function') sfx('no');
        }
      } else if (phase === 2) {
        if (!commons.includes(val)) { setPhase('👑 Corona uno de los divisores comunes (los verdes).', 'err'); if (typeof sfx === 'function') sfx('no'); return; }
        const m = gcd(A, B);
        if (val === m) {
          phase = 3;
          document.querySelectorAll(`#wg-chips-a .wg-chip[data-v="${val}"], #wg-chips-b .wg-chip[data-v="${val}"]`).forEach(c => { c.classList.add('wg-crown'); c.textContent = '👑 ' + val; });
          const perfect = mistakes === 0;
          setPhase(`🏆 ¡Correcto! M.C.D.(${A}, ${B}) = <strong>${m}</strong>: el divisor común más grande.` + (perfect && xpAwards < 3 ? ' ¡Ronda perfecta! +3 XP' : ''), 'ok');
          if (typeof sfx === 'function') sfx('fan');
          if (perfect && typeof pts === 'function' && xpAwards < 3) { pts(3); xpAwards++; }
        } else {
          mistakes++;
          setPhase(`✘ ${val} es común, pero hay uno más grande que también divide a ambos.`, 'err');
          if (typeof sfx === 'function') sfx('no');
        }
      }
    }

    function buildChips(target, n) {
      target.innerHTML = '';
      divisorsOf(n).forEach(v => {
        const chip = document.createElement('div');
        chip.className = 'wg-chip'; chip.textContent = v; chip.dataset.v = v;
        chip.onclick = () => onChipClick(chip, v);
        target.appendChild(chip);
      });
    }

    function newRound() {
      const [a, b] = PAIRS[Math.floor(Math.random() * PAIRS.length)];
      A = a; B = b;
      const dA = divisorsOf(A), dB = divisorsOf(B);
      commons = dA.filter(v => dB.includes(v));
      foundCommons = new Set(); phase = 1; mistakes = 0;
      numsEl.innerHTML = `🏭 Busquemos el M.C.D. de <strong>${A}</strong> y <strong>${B}</strong>`;
      lblA.textContent = `Divisores de ${A}:`;
      lblB.textContent = `Divisores de ${B}:`;
      buildChips(chipsA, A);
      buildChips(chipsB, B);
      setPhase(`Paso 1: toca todos los divisores que aparecen en LAS DOS filas (los comunes). Hay ${commons.length}.`);
    }

    document.getElementById('wg-new').onclick = () => { if (typeof sfx === 'function') sfx('click'); newRound(); };
    newRound();
  }
};
