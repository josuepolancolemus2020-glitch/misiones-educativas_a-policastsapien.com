// js/interaccion_movimiento.js

window.WidgetMovimientoJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wm-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
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
      </style>
      <div class="wm-container">
        <div class="wm-display">
          <div class="wm-equation">
            <div class="wm-term dividend" id="wm-divd">4.5</div>
            <div class="wm-operator">÷</div>
            <div class="wm-term divisor" id="wm-divr">0.5</div>
          </div>
          <div class="wm-result" id="wm-res">= 9</div>
          <div class="wm-hint" id="wm-hint">Estado inicial. ¡Tenemos decimales!</div>
        </div>
        <div class="wm-controls">
          <div class="wm-slider-wrap">
            <label class="wm-label" for="wm-slider"><span>Multiplicar por: <span id="wm-mult-lbl">1</span></span> <span>Mover punto: <span id="wm-step-lbl">0</span></span></label>
            <input type="range" id="wm-slider" class="wm-slider" min="0" max="3" value="0" step="1">
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

    slider.addEventListener('input', () => {
      if (typeof sfx === 'function') sfx('click');
      update();
    });

    btnRnd.addEventListener('click', () => {
      currIdx = (currIdx + 1) % pool.length;
      slider.value = 0;
      update();
      if (typeof sfx === 'function') sfx('click');
    });

    update();
  }
};