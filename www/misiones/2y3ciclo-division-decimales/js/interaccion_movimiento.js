// js/interaccion_movimiento.js

window.WidgetMovimientoJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wm-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wm-pred-box { background: linear-gradient(135deg,rgba(108,92,231,0.08),rgba(25,118,210,0.08)); border: 2px solid #6c5ce7; border-radius: 12px; padding: 1rem 1.2rem; margin-bottom: 1.2rem; }
        .wm-pred-q { font-family: 'Fredoka', sans-serif; font-size: 1rem; color: #1b2838; margin-bottom: 0.7rem; font-weight: 600; }
        .wm-pred-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .wm-pred-btn { font-family: 'Fredoka', sans-serif; font-size: 0.85rem; padding: 0.45rem 0.9rem; border: 2px solid #6c5ce7; border-radius: 20px; background: white; color: #6c5ce7; cursor: pointer; transition: all 0.2s; }
        .wm-pred-btn:hover:not(:disabled) { background: #6c5ce7; color: white; }
        .wm-pred-btn.wm-ok { background: #00b894; border-color: #00b894; color: white; }
        .wm-pred-btn.wm-no { background: #d63031; border-color: #d63031; color: white; }
        .wm-pred-fb { font-size: 0.85rem; margin-top: 0.6rem; padding: 0.4rem 0.7rem; border-radius: 8px; display: none; }
        .wm-pred-fb.show { display: block; }
        .wm-pred-fb.ok { background: rgba(0,184,148,0.15); color: #006d4e; }
        .wm-pred-fb.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wm-display { width: 100%; min-height: 180px; background: #fdfdfd; border: 1.5px dashed #dcdde1; border-radius: 12px; margin-bottom: 1.2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; position: relative; padding: 1rem; }
        .wm-equation { display: flex; align-items: center; gap: 1rem; font-family: 'Fredoka', sans-serif; font-size: 2.5rem; color: #1b2838; font-weight: 700; margin-bottom: 1rem; flex-wrap: wrap; justify-content: center; }
        .wm-term { position: relative; padding: 0.5rem 1rem; border-radius: 12px; background: rgba(0,0,0,0.04); display: flex; align-items: center; justify-content: center; min-width: 140px; }
        .wm-term.dividend { color: #1976d2; border: 2px solid rgba(25,118,210,0.3); background: rgba(25,118,210,0.05); }
        .wm-term.divisor { color: #f57c00; border: 2px solid rgba(245,124,0,0.3); background: rgba(245,124,0,0.05); }
        .wm-operator { color: #636e72; font-size: 2rem; }
        .wm-result { font-size: 1.8rem; color: #00b894; opacity: 0; transition: opacity 0.3s; margin-top: 0.5rem; }
        .wm-controls { display: flex; flex-direction: column; gap: 1.2rem; }
        .wm-slider-wrap { width: 100%; }
        .wm-label { font-family: 'Fredoka', sans-serif; font-size: 1rem; color: #2d3436; margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
        .wm-slider { width: 100%; accent-color: #0984e3; cursor: pointer; }
        .wm-btn-rnd { font-family: 'Fredoka', sans-serif; background: #0984e3; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: transform 0.2s; align-self: center; }
        .wm-btn-rnd:hover { transform: translateY(-2px); }
        .wm-hint { font-size: 0.9rem; color: #636e72; text-align: center; font-style: italic; margin-top: 0.5rem; min-height: 1.5rem; }
        [data-theme="dark"] .wm-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wm-display { background: #0a0d16; border-color: #2d3450; }
        [data-theme="dark"] .wm-label, [data-theme="dark"] .wm-equation { color: #e8f0fe; }
        [data-theme="dark"] .wm-pred-q { color: #e8f0fe; }
        [data-theme="dark"] .wm-pred-btn { background: #1e2130; }
      </style>
      <div class="wm-container">
        <div class="wm-pred-box" id="wm-pred-box">
          <div class="wm-pred-q" id="wm-pred-q">🔮 Antes de ver la respuesta: para <span id="wm-pred-op">4.5 ÷ 0.5</span>, ¿el cociente será mayor, menor o igual que el dividendo?</div>
          <div class="wm-pred-opts" id="wm-pred-opts">
            <button class="wm-pred-btn" id="wm-p-mayor">↑ Mayor que 4.5</button>
            <button class="wm-pred-btn" id="wm-p-menor">↓ Menor que 4.5</button>
            <button class="wm-pred-btn" id="wm-p-igual">= Igual a 4.5</button>
          </div>
          <div class="wm-pred-fb" id="wm-pred-fb"></div>
        </div>
        <div class="wm-display">
          <div class="wm-equation">
            <div class="wm-term dividend" id="wm-divd">4.5</div>
            <div class="wm-operator">÷</div>
            <div class="wm-term divisor" id="wm-divr">0.5</div>
          </div>
          <div class="wm-result" id="wm-res">= 9</div>
          <div class="wm-hint" id="wm-hint">Responde la predicción de arriba, luego desliza para ver la transformación.</div>
        </div>
        <div class="wm-controls">
          <div class="wm-slider-wrap">
            <label class="wm-label" for="wm-slider"><span>Multiplicar por: <span id="wm-mult-lbl">1</span></span> <span>Mover punto: <span id="wm-step-lbl">0</span></span></label>
            <input type="range" id="wm-slider" class="wm-slider" min="0" max="3" value="0" step="1" disabled>
          </div>
          <button class="wm-btn-rnd" id="wm-btn-rnd">🔄 Variar Ejercicio</button>
        </div>
      </div>
    `;

    const pool = [
      { d: 4.5, r: 0.5, ans: 9 },
      { d: 1.25, r: 0.05, ans: 25 },
      { d: 3, r: 0.6, ans: 5 },
      { d: 0.24, r: 0.08, ans: 3 },
      { d: 15, r: 2.5, ans: 6 }
    ];
    let currIdx = 0;

    const divdEl = document.getElementById('wm-divd');
    const divrEl = document.getElementById('wm-divr');
    const resEl = document.getElementById('wm-res');
    const hintEl = document.getElementById('wm-hint');
    const slider = document.getElementById('wm-slider');
    const multLbl = document.getElementById('wm-mult-lbl');
    const stepLbl = document.getElementById('wm-step-lbl');
    const btnRnd = document.getElementById('wm-btn-rnd');

    function formatShift(num, steps) {
      if (steps === 0) return num.toString();
      let parts = num.toString().split('.');
      let intPart = parts[0];
      let decPart = parts[1] || "";
      
      let newDec = decPart;
      for(let i=0; i<steps; i++) {
        if (newDec.length > 0) {
          intPart += newDec[0];
          newDec = newDec.slice(1);
        } else {
          intPart += "0"; // Adding zeroes!
        }
      }
      // Remove leading zeros if it's an integer
      intPart = parseInt(intPart, 10).toString();
      return newDec.length > 0 ? `${intPart}.${newDec}` : intPart;
    }

    function update() {
      const step = parseInt(slider.value);
      const ex = pool[currIdx];
      
      stepLbl.textContent = step + (step === 1 ? " espacio" : " espacios");
      multLbl.textContent = "x" + Math.pow(10, step);

      const dStr = formatShift(ex.d, step);
      const rStr = formatShift(ex.r, step);

      divdEl.textContent = dStr;
      divrEl.textContent = rStr;

      // Logic to check if divisor is integer
      if (!rStr.includes('.')) {
        resEl.style.opacity = '1';
        resEl.textContent = `= ${ex.ans}`;
        hintEl.innerHTML = `<strong>¡Perfecto!</strong> El divisor (${rStr}) ya es un número entero. Ahora la división es fácil.`;
        hintEl.style.color = "#00b894";
        if (typeof sfx === 'function') sfx('ok');
      } else {
        resEl.style.opacity = '0';
        hintEl.innerHTML = "El divisor aún tiene decimales. Sigue moviendo el punto.";
        hintEl.style.color = "#636e72";
      }
    }

    const predOpEl = document.getElementById('wm-pred-op');
    const predFbEl = document.getElementById('wm-pred-fb');
    const predOptsEl = document.getElementById('wm-pred-opts');
    const pMayorBtn = document.getElementById('wm-p-mayor');
    const pMenorBtn = document.getElementById('wm-p-menor');
    const pIgualBtn = document.getElementById('wm-p-igual');

    function updatePrediction(ex) {
      if (predOpEl) {
        predOpEl.textContent = `${ex.d} ÷ ${ex.r}`;
        const divd = ex.d; const divr = ex.r;
        if (pMayorBtn) pMayorBtn.textContent = `↑ Mayor que ${divd}`;
        if (pMenorBtn) pMenorBtn.textContent = `↓ Menor que ${divd}`;
        if (pIgualBtn) pIgualBtn.textContent = `= Igual a ${divd}`;
      }
      if (predFbEl) { predFbEl.className = 'wm-pred-fb'; predFbEl.textContent = ''; }
      const allPBtns = predOptsEl ? predOptsEl.querySelectorAll('.wm-pred-btn') : [];
      allPBtns.forEach(b => { b.disabled = false; b.className = 'wm-pred-btn'; });
      slider.disabled = true;
      slider.value = 0;
    }

    function handlePrediction(chosen) {
      const ex = pool[currIdx];
      const correct = ex.r < 1 ? 'mayor' : ex.r > 1 ? 'menor' : 'igual';
      const allPBtns = predOptsEl ? predOptsEl.querySelectorAll('.wm-pred-btn') : [];
      allPBtns.forEach(b => { b.disabled = true; });
      const isOk = (chosen === correct);
      const clickedBtn = document.getElementById('wm-p-' + chosen);
      if (clickedBtn) clickedBtn.className = 'wm-pred-btn ' + (isOk ? 'wm-ok' : 'wm-no');
      if (!isOk) {
        const correctBtn = document.getElementById('wm-p-' + correct);
        if (correctBtn) correctBtn.className = 'wm-pred-btn wm-ok';
      }
      const labels = { mayor: 'MAYOR', menor: 'MENOR', igual: 'IGUAL' };
      const expl = ex.r < 1 ? 'El divisor es menor que 1, por eso el cociente CRECE.' : ex.r > 1 ? 'El divisor es mayor que 1, por eso el cociente DECRECE.' : 'El divisor es 1, el cociente es igual al dividendo.';
      if (predFbEl) {
        predFbEl.textContent = (isOk ? '✔ ¡Correcto! ' : '💡 La respuesta es ' + labels[correct] + '. ') + expl + ' Desliza el control para ver la transformación.';
        predFbEl.className = 'wm-pred-fb show ' + (isOk ? 'ok' : 'err');
      }
      slider.disabled = false;
      if (typeof sfx === 'function') sfx(isOk ? 'ok' : 'no');
    }

    if (pMayorBtn) pMayorBtn.addEventListener('click', () => handlePrediction('mayor'));
    if (pMenorBtn) pMenorBtn.addEventListener('click', () => handlePrediction('menor'));
    if (pIgualBtn) pIgualBtn.addEventListener('click', () => handlePrediction('igual'));

    slider.addEventListener('input', () => {
      if (typeof sfx === 'function') sfx('click');
      update();
    });

    btnRnd.addEventListener('click', () => {
      currIdx = (currIdx + 1) % pool.length;
      updatePrediction(pool[currIdx]);
      update();
      if (typeof sfx === 'function') sfx('click');
    });

    updatePrediction(pool[currIdx]);
    update();
  }
};