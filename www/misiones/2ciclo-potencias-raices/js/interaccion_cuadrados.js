// js/interaccion_cuadrados.js

window.WidgetCuadradosJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wq-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wq-pred-box { background: linear-gradient(135deg,rgba(108,92,231,0.08),rgba(124,58,237,0.08)); border: 2px solid #6c5ce7; border-radius: 12px; padding: 1rem 1.2rem; margin-bottom: 1.2rem; }
        .wq-pred-q { font-family: 'Fredoka', sans-serif; font-size: 1rem; color: #1b2838; margin-bottom: 0.7rem; font-weight: 600; }
        .wq-pred-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .wq-pred-btn { font-family: 'Fredoka', sans-serif; font-size: 0.85rem; padding: 0.45rem 0.9rem; border: 2px solid #6c5ce7; border-radius: 20px; background: white; color: #6c5ce7; cursor: pointer; transition: all 0.2s; }
        .wq-pred-btn:hover:not(:disabled) { background: #6c5ce7; color: white; }
        .wq-pred-btn.wq-ok { background: #00b894; border-color: #00b894; color: white; }
        .wq-pred-btn.wq-no { background: #d63031; border-color: #d63031; color: white; }
        .wq-pred-fb { font-size: 0.85rem; margin-top: 0.6rem; padding: 0.4rem 0.7rem; border-radius: 8px; display: none; }
        .wq-pred-fb.show { display: block; }
        .wq-pred-fb.ok { background: rgba(0,184,148,0.15); color: #006d4e; }
        .wq-pred-fb.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wq-display { width: 100%; min-height: 220px; background: #fdfdfd; border: 1.5px dashed #dcdde1; border-radius: 12px; margin-bottom: 1.2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 1rem; gap: 0.7rem; }
        .wq-grid { display: grid; gap: 3px; }
        .wq-cell { background: #7c3aed; border-radius: 3px; transition: background 0.2s; }
        .wq-equation { font-family: 'Fredoka', sans-serif; font-size: 1.6rem; color: #1b2838; font-weight: 700; }
        .wq-equation .wq-n { color: #7c3aed; }
        .wq-equation .wq-res { color: #00897b; }
        .wq-controls { display: flex; flex-direction: column; gap: 1.1rem; }
        .wq-slider-wrap { width: 100%; }
        .wq-label { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; color: #2d3436; margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
        .wq-slider { width: 100%; accent-color: #7c3aed; cursor: pointer; }
        [data-theme="dark"] .wq-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wq-display { background: #0a0d16; border-color: #2d3450; }
        [data-theme="dark"] .wq-label, [data-theme="dark"] .wq-equation { color: #e8f0fe; }
        [data-theme="dark"] .wq-pred-q { color: #e8f0fe; }
        [data-theme="dark"] .wq-pred-btn { background: #1e2130; }
      </style>
      <div class="wq-container">
        <div class="wq-pred-box" id="wq-pred-box">
          <div class="wq-pred-q" id="wq-pred-q">🔮 Cargando predicción...</div>
          <div class="wq-pred-opts" id="wq-pred-opts"></div>
          <div class="wq-pred-fb" id="wq-pred-fb"></div>
        </div>
        <div class="wq-display">
          <div class="wq-grid" id="wq-grid"></div>
          <div class="wq-equation" id="wq-equation"><span class="wq-n">1</span>² = <span class="wq-res">1</span></div>
        </div>
        <div class="wq-controls">
          <div class="wq-slider-wrap">
            <label class="wq-label" for="wq-slider"><span>Tamaño del lado (n):</span> <span id="wq-slider-lbl">1</span></label>
            <input type="range" id="wq-slider" class="wq-slider" min="1" max="14" value="1" step="1">
          </div>
        </div>
      </div>
    `;

    const gridEl = document.getElementById('wq-grid');
    const equationEl = document.getElementById('wq-equation');
    const slider = document.getElementById('wq-slider');
    const sliderLbl = document.getElementById('wq-slider-lbl');
    const predQEl = document.getElementById('wq-pred-q');
    const predOptsEl = document.getElementById('wq-pred-opts');
    const predFbEl = document.getElementById('wq-pred-fb');

    const CELL_MAX_PX = 20;

    function renderGrid(n) {
      const size = Math.min(CELL_MAX_PX, Math.floor(200 / n));
      gridEl.style.gridTemplateColumns = `repeat(${n},${size}px)`;
      gridEl.style.gridTemplateRows = `repeat(${n},${size}px)`;
      gridEl.innerHTML = '';
      for (let i = 0; i < n * n; i++) {
        const cell = document.createElement('div');
        cell.className = 'wq-cell';
        cell.style.width = size + 'px';
        cell.style.height = size + 'px';
        gridEl.appendChild(cell);
      }
    }

    function updateSlider() {
      const n = parseInt(slider.value);
      sliderLbl.textContent = n;
      renderGrid(n);
      equationEl.innerHTML = `<span class="wq-n">${n}</span>² = <span class="wq-res">${n * n}</span>`;
    }

    let predPair = [7, 9];

    function loadPrediction() {
      const [a, b] = predPair;
      predQEl.textContent = `🔮 ¿Cuál cuadrado perfecto es mayor: ${a}² o ${b}²?`;
      predOptsEl.innerHTML = `
        <button class="wq-pred-btn" id="wq-p-a">${a}²</button>
        <button class="wq-pred-btn" id="wq-p-b">${b}²</button>
        <button class="wq-pred-btn" id="wq-p-igual">Son iguales</button>`;
      predFbEl.className = 'wq-pred-fb';
      predFbEl.textContent = '';
      const correct = a > b ? 'a' : a < b ? 'b' : 'igual';

      function handlePred(chosen) {
        document.querySelectorAll('.wq-pred-btn').forEach(btn => { btn.disabled = true; });
        const isOk = chosen === correct;
        const clickedBtn = document.getElementById('wq-p-' + chosen);
        if (clickedBtn) clickedBtn.className = 'wq-pred-btn ' + (isOk ? 'wq-ok' : 'wq-no');
        if (!isOk) {
          const correctBtn = document.getElementById('wq-p-' + correct);
          if (correctBtn) correctBtn.className = 'wq-pred-btn wq-ok';
        }
        const winner = correct === 'igual' ? 'Son iguales' : `${correct === 'a' ? a : b}² = ${correct === 'a' ? a*a : b*b}`;
        predFbEl.textContent = (isOk ? '✔ ¡Correcto! ' : '💡 La respuesta correcta es: ' + winner + '. ') + 'Entre más grande la base (n), más grande el cuadrado perfecto (n²). Desliza el control para explorarlo.';
        predFbEl.className = 'wq-pred-fb show ' + (isOk ? 'ok' : 'err');
        if (typeof sfx === 'function') sfx(isOk ? 'ok' : 'no');
      }
      document.getElementById('wq-p-a').addEventListener('click', () => handlePred('a'));
      document.getElementById('wq-p-b').addEventListener('click', () => handlePred('b'));
      document.getElementById('wq-p-igual').addEventListener('click', () => handlePred('igual'));
    }

    slider.addEventListener('input', () => {
      if (typeof sfx === 'function') sfx('click');
      updateSlider();
    });

    updateSlider();
    loadPrediction();
  }
};
