// js/interaccion_divisibilidad.js
// Widget: Detector de Divisibilidad — el estudiante predice si un número es
// divisible entre 2, 3, 5, 9, 10 u 11 y el detector revela la regla paso a paso:
// última cifra (2, 5, 10), suma de cifras (3, 9) o suma alternada (11).

window.WidgetDivisibilidadJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wd-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wd-question { font-family: 'Fredoka', sans-serif; font-size: 1.05rem; font-weight: 600; color: #1b2838; text-align: center; margin-bottom: 0.8rem; }
        .wd-digits { display: flex; justify-content: center; gap: 0.3rem; margin-bottom: 0.9rem; flex-wrap: wrap; }
        .wd-digit { font-family: 'Fredoka', sans-serif; font-size: 1.6rem; font-weight: 700; width: 46px; height: 54px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 2px solid #dcdde1; color: #1b2838; background: #fafafa; transition: all 0.35s; }
        .wd-digit.wd-hl { border-color: #f59e0b; background: rgba(245,158,11,0.16); color: #b45309; transform: translateY(-4px); }
        .wd-digit.wd-hl-b { border-color: #6c5ce7; background: rgba(108,92,231,0.14); color: #6c5ce7; transform: translateY(-4px); }
        .wd-divisor { text-align: center; font-family: 'Fredoka', sans-serif; font-size: 0.95rem; color: #636e72; margin-bottom: 0.9rem; }
        .wd-divisor strong { color: #1565c0; font-size: 1.2rem; }
        .wd-btns { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; margin-bottom: 0.9rem; }
        .wd-btn-si, .wd-btn-no { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; padding: 0.55rem 1.4rem; border-radius: 22px; border: 2px solid; cursor: pointer; background: white; transition: all 0.2s; }
        .wd-btn-si { border-color: #00b894; color: #00895f; }
        .wd-btn-no { border-color: #d63031; color: #d63031; }
        .wd-btn-si:hover:not(:disabled) { background: #00b894; color: white; }
        .wd-btn-no:hover:not(:disabled) { background: #d63031; color: white; }
        .wd-btn-si.wd-sel-ok, .wd-btn-no.wd-sel-ok { background: #00b894; border-color: #00b894; color: white; }
        .wd-btn-si.wd-sel-no, .wd-btn-no.wd-sel-no { background: #d63031; border-color: #d63031; color: white; }
        .wd-btn-si:disabled, .wd-btn-no:disabled { cursor: default; opacity: 0.85; }
        .wd-explain { background: linear-gradient(135deg, rgba(21,101,192,0.06), rgba(0,137,123,0.06)); border: 2px dashed #1565c0; border-radius: 12px; padding: 0.8rem 1rem; font-size: 0.88rem; color: #1b2838; line-height: 1.5; margin-bottom: 0.9rem; display: none; }
        .wd-explain.show { display: block; animation: wdFade 0.4s ease; }
        @keyframes wdFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
        .wd-explain .wd-calc { font-family: 'Fira Code', monospace; font-weight: 700; color: #1565c0; }
        .wd-msg { font-size: 0.88rem; text-align: center; min-height: 1.6rem; padding: 0.3rem 0.6rem; border-radius: 8px; color: #636e72; }
        .wd-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wd-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wd-footer { display: flex; gap: 0.6rem; justify-content: center; align-items: center; margin-top: 0.9rem; flex-wrap: wrap; }
        .wd-new { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wd-new:hover { transform: translateY(-2px); }
        .wd-streak { font-family: 'Fredoka', sans-serif; font-size: 0.82rem; color: #636e72; }
        [data-theme="dark"] .wd-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wd-question { color: #e8f0fe; }
        [data-theme="dark"] .wd-digit { background: #171923; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .wd-explain { color: #cbd5e0; }
        [data-theme="dark"] .wd-btn-si, [data-theme="dark"] .wd-btn-no { background: #1e2130; }
        [data-theme="dark"] .wd-msg { color: #a0aec0; }
      </style>
      <div class="wd-container">
        <div class="wd-question" id="wd-question"></div>
        <div class="wd-digits" id="wd-digits"></div>
        <div class="wd-divisor" id="wd-divisor"></div>
        <div class="wd-btns">
          <button class="wd-btn-si" id="wd-si">✔ SÍ es divisible</button>
          <button class="wd-btn-no" id="wd-no">✘ NO es divisible</button>
        </div>
        <div class="wd-explain" id="wd-explain"></div>
        <div class="wd-msg" id="wd-msg">Observa las cifras y haz tu predicción.</div>
        <div class="wd-footer">
          <button class="wd-new" id="wd-new">🔄 Otro número</button>
          <span class="wd-streak" id="wd-streak">🔥 Racha: 0</span>
        </div>
      </div>
    `;

    const qEl = document.getElementById('wd-question');
    const digitsEl = document.getElementById('wd-digits');
    const divEl = document.getElementById('wd-divisor');
    const btnSi = document.getElementById('wd-si');
    const btnNo = document.getElementById('wd-no');
    const explainEl = document.getElementById('wd-explain');
    const msgEl = document.getElementById('wd-msg');
    const streakEl = document.getElementById('wd-streak');

    const DIVISORS = [2, 3, 5, 9, 10, 11];
    const RULES = { 2: 'última cifra par (0,2,4,6,8)', 3: 'suma de cifras múltiplo de 3', 5: 'última cifra 0 o 5', 9: 'suma de cifras múltiplo de 9', 10: 'última cifra 0', 11: 'suma alternada 0 o múltiplo de 11' };
    let num = 0, dv = 2, answered = false, streak = 0, xpAwards = 0;

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function fmt(n) { return n.toLocaleString('en-US'); }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wd-msg' + (cls ? ' ' + cls : ''); }

    function newRound() {
      answered = false;
      dv = DIVISORS[rint(0, DIVISORS.length - 1)];
      if (Math.random() < 0.5) { num = dv * rint(Math.ceil(100 / dv), Math.floor(9999 / dv)); }
      else { do { num = rint(100, 9999); } while (num % dv === 0); }
      qEl.textContent = '🕵️ Caso nuevo: el número ' + fmt(num);
      digitsEl.innerHTML = '';
      num.toString().split('').forEach(d => {
        const cell = document.createElement('div'); cell.className = 'wd-digit'; cell.textContent = d; digitsEl.appendChild(cell);
      });
      divEl.innerHTML = `¿Es divisible entre <strong>${dv}</strong>? &nbsp;<span style="font-size:0.78rem;">(pista: ${RULES[dv]})</span>`;
      explainEl.className = 'wd-explain'; explainEl.innerHTML = '';
      btnSi.disabled = false; btnNo.disabled = false;
      btnSi.className = 'wd-btn-si'; btnNo.className = 'wd-btn-no';
      setMsg('Observa las cifras y haz tu predicción.');
    }

    function buildExplanation() {
      const digits = num.toString().split('').map(Number);
      const cells = digitsEl.querySelectorAll('.wd-digit');
      if (dv === 2 || dv === 5 || dv === 10) {
        cells[cells.length - 1].classList.add('wd-hl');
        const last = digits[digits.length - 1];
        return `🔎 Regla del ${dv}: miro solo la <strong>última cifra</strong>, que es <span class="wd-calc">${last}</span>. ` +
          (num % dv === 0 ? `Cumple la regla (${RULES[dv]}), así que <strong>SÍ es divisible</strong>. ${fmt(num)} ÷ ${dv} = ${fmt(num / dv)}.` : `No cumple la regla (${RULES[dv]}), así que <strong>NO es divisible</strong>.`);
      }
      if (dv === 3 || dv === 9) {
        cells.forEach(c => c.classList.add('wd-hl'));
        const suma = digits.reduce((a, b) => a + b, 0);
        return `🔎 Regla del ${dv}: sumo todas las cifras: <span class="wd-calc">${digits.join('+')} = ${suma}</span>. ` +
          (num % dv === 0 ? `${suma} es múltiplo de ${dv}, así que <strong>SÍ es divisible</strong>. ${fmt(num)} ÷ ${dv} = ${fmt(num / dv)}.` : `${suma} no es múltiplo de ${dv}, así que <strong>NO es divisible</strong>.`);
      }
      // 11: suma alternada desde la derecha
      let sImp = 0, sPar = 0;
      const rev = [...digits].reverse();
      rev.forEach((d, i) => { if (i % 2 === 0) sImp += d; else sPar += d; });
      cells.forEach((c, i) => {
        const posFromRight = cells.length - 1 - i;
        c.classList.add(posFromRight % 2 === 0 ? 'wd-hl' : 'wd-hl-b');
      });
      const diff = sImp - sPar;
      return `🔎 Regla del 11: separo las cifras alternadas desde la derecha. Naranjas: <span class="wd-calc">${sImp}</span> · Moradas: <span class="wd-calc">${sPar}</span>. Resto: <span class="wd-calc">${sImp} − ${sPar} = ${diff}</span>. ` +
        (num % 11 === 0 ? `${diff} es 0 o múltiplo de 11, así que <strong>SÍ es divisible</strong>. ${fmt(num)} ÷ 11 = ${fmt(num / 11)}.` : `${diff} no es 0 ni múltiplo de 11, así que <strong>NO es divisible</strong>.`);
    }

    function answer(saysYes) {
      if (answered) return;
      answered = true;
      const truth = (num % dv === 0);
      const correct = (saysYes === truth);
      const btnPressed = saysYes ? btnSi : btnNo;
      btnPressed.classList.add(correct ? 'wd-sel-ok' : 'wd-sel-no');
      if (!correct) (saysYes ? btnNo : btnSi).classList.add('wd-sel-ok');
      btnSi.disabled = true; btnNo.disabled = true;
      explainEl.innerHTML = buildExplanation();
      explainEl.classList.add('show');
      if (correct) {
        streak++;
        setMsg('✔ ¡Detective acertado!' + (xpAwards < 5 ? ' +2 XP' : ''), 'ok');
        if (typeof sfx === 'function') sfx('ok');
        if (typeof pts === 'function' && xpAwards < 5) { pts(2); xpAwards++; }
      } else {
        streak = 0;
        setMsg('💡 Revisa la explicación del detector y vuelve a intentarlo.', 'err');
        if (typeof sfx === 'function') sfx('no');
      }
      streakEl.textContent = '🔥 Racha: ' + streak;
    }

    btnSi.onclick = () => answer(true);
    btnNo.onclick = () => answer(false);
    document.getElementById('wd-new').onclick = () => { if (typeof sfx === 'function') sfx('click'); newRound(); };

    newRound();
  }
};
