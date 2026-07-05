// js/interaccion_primo.js
// Widget: Detective de Primos — aparece un número del 2 al 60 y el estudiante
// decide si es primo o compuesto. El feedback muestra TODOS sus divisores,
// que es la prueba definitiva.

window.WidgetPrimoJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wdp-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wdp-num { font-family: 'Fira Code', monospace; font-size: 2.1rem; font-weight: 700; color: #1b2838; text-align: center; margin-bottom: 0.2rem; }
        .wdp-tip { font-size: 0.78rem; text-align: center; color: #636e72; margin-bottom: 0.8rem; }
        .wdp-opts { display: flex; gap: 0.6rem; flex-wrap: wrap; justify-content: center; }
        .wdp-opt { font-family: 'Fredoka', sans-serif; font-size: 1rem; padding: 0.55rem 1.4rem; border: 2px solid #1565c0; border-radius: 20px; background: white; color: #1565c0; cursor: pointer; transition: all 0.2s; font-weight: 700; }
        .wdp-opt:hover:not(:disabled) { background: #1565c0; color: white; }
        .wdp-opt.wdp-ok { background: #00b894; border-color: #00b894; color: white; }
        .wdp-opt.wdp-no { background: #d63031; border-color: #d63031; color: white; }
        .wdp-msg { font-size: 0.88rem; text-align: center; color: #636e72; min-height: 2.4rem; padding: 0.4rem 0.6rem; border-radius: 8px; margin-top: 0.7rem; line-height: 1.45; }
        .wdp-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wdp-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wdp-streak { font-family: 'Fredoka', sans-serif; font-size: 0.8rem; text-align: center; color: #636e72; margin-top: 0.4rem; }
        [data-theme="dark"] .wdp-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wdp-num { color: #e8f0fe; }
        [data-theme="dark"] .wdp-opt { background: #1e2130; }
        [data-theme="dark"] .wdp-msg { color: #a0aec0; }
      </style>
      <div class="wdp-container">
        <div class="wdp-num" id="wdp-num"></div>
        <div class="wdp-tip">🕵️ Pista de detective: prueba dividir entre 2, 3, 5 y 7.</div>
        <div class="wdp-opts">
          <button class="wdp-opt" id="wdp-btn-primo">💎 PRIMO</button>
          <button class="wdp-opt" id="wdp-btn-comp">🧱 COMPUESTO</button>
        </div>
        <div class="wdp-msg" id="wdp-msg">¿Este número tiene solo 2 divisores… o esconde más?</div>
        <div class="wdp-streak" id="wdp-streak">🔥 Racha: 0</div>
      </div>
    `;

    const numEl = document.getElementById('wdp-num');
    const msgEl = document.getElementById('wdp-msg');
    const streakEl = document.getElementById('wdp-streak');
    const btnPrimo = document.getElementById('wdp-btn-primo');
    const btnComp = document.getElementById('wdp-btn-comp');
    // se incluyen varios impares compuestos (9, 15, 21, 27, 33, 39, 49, 51, 57)
    // porque son las trampas clásicas de "parece primo"
    const POOL = [2, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 33, 35, 37, 39, 41, 43, 47, 49, 51, 53, 57, 59, 22, 26, 34, 38, 46, 58];
    let current = 0, answered = false, streak = 0;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wdp-msg' + (cls ? ' ' + cls : ''); }
    function esPrimo(n) { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
    function divisores(n) { const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; }

    function newRound() {
      current = POOL[rint(0, POOL.length - 1)];
      answered = false;
      btnPrimo.classList.remove('wdp-ok', 'wdp-no');
      btnComp.classList.remove('wdp-ok', 'wdp-no');
      btnPrimo.disabled = false; btnComp.disabled = false;
      numEl.textContent = current;
      setMsg('¿Este número tiene solo 2 divisores… o esconde más?');
    }

    function answer(dicePrimo) {
      if (answered) return;
      answered = true;
      btnPrimo.disabled = true; btnComp.disabled = true;
      const primo = esPrimo(current);
      const divs = divisores(current);
      const btn = dicePrimo ? btnPrimo : btnComp;
      const okBtn = primo ? btnPrimo : btnComp;
      if (dicePrimo === primo) {
        btn.classList.add('wdp-ok');
        streak++;
        setMsg(primo
          ? `✔ ¡Caso resuelto! El ${current} es PRIMO: sus únicos divisores son <strong>1 y ${current}</strong>.`
          : `✔ ¡Caso resuelto! El ${current} es COMPUESTO: sus divisores son <strong>${divs.join(', ')}</strong> (${divs.length} en total).`, 'ok');
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('a' + awarded.size); pts(2); }
      } else {
        btn.classList.add('wdp-no');
        okBtn.classList.add('wdp-ok');
        streak = 0;
        setMsg(primo
          ? `💡 El ${current} es PRIMO: por más que pruebes, solo 1 y ${current} lo dividen exacto.`
          : `💡 ¡Era una trampa! El ${current} es COMPUESTO: divisores <strong>${divs.join(', ')}</strong>. ${current % 2 !== 0 ? 'Recuerda: no todo impar es primo.' : ''}`, 'err');
        if (typeof sfx === 'function') sfx('no');
      }
      streakEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(newRound, 2600);
    }

    btnPrimo.addEventListener('click', () => answer(true));
    btnComp.addEventListener('click', () => answer(false));

    newRound();
  }
};
