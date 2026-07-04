// js/interaccion_impares.js
// Widget: La Escalera de los Impares — muestra que 1+3+5+...+(2n-1) = n²
// Cada "capa" en L (gnomon) agrega el siguiente número impar y el cuadrado crece.

window.WidgetImparesJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wi-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wi-display { width: 100%; min-height: 240px; background: #fdfdfd; border: 1.5px dashed #dcdde1; border-radius: 12px; margin-bottom: 1.2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 1rem; gap: 0.8rem; }
        .wi-grid { display: grid; gap: 2px; }
        .wi-cell { border-radius: 3px; transition: background 0.25s, transform 0.25s; }
        .wi-cell.wi-new { animation: wiPop 0.4s ease; }
        @keyframes wiPop { 0% { transform: scale(0.3); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
        .wi-sum { font-family: 'Fredoka', sans-serif; font-size: 1.05rem; color: #1b2838; text-align: center; line-height: 1.6; }
        .wi-sum .wi-odd { display: inline-block; padding: 0.05rem 0.35rem; border-radius: 6px; color: white; font-weight: 700; margin: 0 0.08rem; }
        .wi-sum .wi-total { color: #00b894; font-weight: 700; font-size: 1.25rem; }
        .wi-legend { font-size: 0.82rem; color: #636e72; text-align: center; }
        .wi-controls { display: flex; flex-direction: column; gap: 0.9rem; }
        .wi-label { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; color: #2d3436; margin-bottom: 0.4rem; display: flex; justify-content: space-between; }
        .wi-slider { width: 100%; accent-color: #f59e0b; cursor: pointer; }
        .wi-btn-row { display: flex; gap: 0.6rem; justify-content: center; flex-wrap: wrap; }
        .wi-btn { font-family: 'Fredoka', sans-serif; background: #7c3aed; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wi-btn:hover { transform: translateY(-2px); }
        .wi-btn.wi-btn-amber { background: #f59e0b; }
        [data-theme="dark"] .wi-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wi-display { background: #0a0d16; border-color: #2d3450; }
        [data-theme="dark"] .wi-sum, [data-theme="dark"] .wi-label { color: #e8f0fe; }
      </style>
      <div class="wi-container">
        <div class="wi-display">
          <div class="wi-grid" id="wi-grid"></div>
          <div class="wi-sum" id="wi-sum"></div>
          <div class="wi-legend" id="wi-legend">Cada capa en forma de "L" agrega el siguiente número impar.</div>
        </div>
        <div class="wi-controls">
          <div>
            <label class="wi-label" for="wi-slider"><span>Tamaño del cuadrado (n):</span> <span id="wi-n-lbl">1</span></label>
            <input type="range" id="wi-slider" class="wi-slider" min="1" max="14" value="1" step="1">
          </div>
          <div class="wi-btn-row">
            <button class="wi-btn" id="wi-btn-add">➕ Agregar capa impar</button>
            <button class="wi-btn wi-btn-amber" id="wi-btn-reset">🔄 Reiniciar</button>
          </div>
        </div>
      </div>
    `;

    const LAYER_COLORS = ['#7c3aed', '#f59e0b', '#00b894', '#0984e3', '#e84393', '#e17055', '#6c5ce7'];
    const gridEl = document.getElementById('wi-grid');
    const sumEl = document.getElementById('wi-sum');
    const legendEl = document.getElementById('wi-legend');
    const slider = document.getElementById('wi-slider');
    const nLbl = document.getElementById('wi-n-lbl');
    const btnAdd = document.getElementById('wi-btn-add');
    const btnReset = document.getElementById('wi-btn-reset');

    function layerColor(k) { return LAYER_COLORS[(k - 1) % LAYER_COLORS.length]; }

    function render(n, animateLast) {
      const size = Math.min(20, Math.floor(220 / n));
      gridEl.style.gridTemplateColumns = `repeat(${n},${size}px)`;
      gridEl.style.gridTemplateRows = `repeat(${n},${size}px)`;
      gridEl.innerHTML = '';
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          const layer = Math.max(r, c) + 1;
          const cell = document.createElement('div');
          cell.className = 'wi-cell' + (animateLast && layer === n ? ' wi-new' : '');
          cell.style.width = size + 'px';
          cell.style.height = size + 'px';
          cell.style.background = layerColor(layer);
          gridEl.appendChild(cell);
        }
      }
      const odds = [];
      for (let k = 1; k <= n; k++) odds.push(2 * k - 1);
      let sumHtml;
      if (n <= 7) {
        sumHtml = odds.map((o, i) => `<span class="wi-odd" style="background:${layerColor(i + 1)}">${o}</span>`).join(' + ');
      } else {
        const first = odds.slice(0, 3).map((o, i) => `<span class="wi-odd" style="background:${layerColor(i + 1)}">${o}</span>`).join(' + ');
        const last = `<span class="wi-odd" style="background:${layerColor(n)}">${odds[n - 1]}</span>`;
        sumHtml = `${first} + ⋯ + ${last}`;
      }
      sumEl.innerHTML = `${sumHtml} = <span class="wi-total">${n * n}</span> &nbsp;→&nbsp; ${n}² = ${n * n}`;
      legendEl.textContent = n === 1
        ? 'Empezamos con 1 cuadrito: 1² = 1. Presiona "Agregar capa impar".'
        : `La capa nueva (en "L") agregó ${2 * n - 1} cuadritos. ¡Sumando impares seguidos siempre se forma un cuadrado perfecto!`;
      nLbl.textContent = n;
      slider.value = n;
    }

    slider.addEventListener('input', () => {
      if (typeof sfx === 'function') sfx('click');
      render(parseInt(slider.value), false);
    });
    btnAdd.addEventListener('click', () => {
      const n = Math.min(14, parseInt(slider.value) + 1);
      if (typeof sfx === 'function') sfx(n === 14 ? 'fan' : 'ok');
      render(n, true);
    });
    btnReset.addEventListener('click', () => {
      if (typeof sfx === 'function') sfx('click');
      render(1, false);
    });

    render(1, false);
  }
};
