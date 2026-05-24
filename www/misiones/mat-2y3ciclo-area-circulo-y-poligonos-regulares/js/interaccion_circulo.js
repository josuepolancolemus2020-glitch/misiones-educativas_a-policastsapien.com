// js/interaccion_circulo.js

window.WidgetCirculoJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wc-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wc-svg-area { width: 100%; height: 280px; background: #fdfdfd; border: 1.5px dashed #dcdde1; border-radius: 12px; margin-bottom: 1.2rem; display: flex; justify-content: center; align-items: center; overflow: hidden; position: relative; }
        .wc-controls { display: flex; flex-direction: column; gap: 1.2rem; }
        .wc-slider-wrap { flex: 1; min-width: 200px; }
        .wc-label { font-family: 'Fredoka', sans-serif; font-size: 1rem; color: #2d3436; margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
        .wc-slider { width: 100%; accent-color: #e17055; cursor: pointer; }
        .wc-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; }
        .wc-stat-box { background: rgba(225,112,85,0.1); border-left: 4px solid #e17055; padding: 0.8rem; border-radius: 8px; }
        .wc-stat-title { font-size: 0.8rem; color: #636e72; font-weight: 700; text-transform: uppercase; }
        .wc-stat-value { font-family: 'Fredoka', sans-serif; font-size: 1.4rem; color: #e17055; }
        
        [data-theme="dark"] .wc-container { background: #1e2130; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .wc-label { color: #e8f0fe; }
        [data-theme="dark"] .wc-svg-area { background: #0a0d16; border-color: #2d3450; }
      </style>
      
      <div class="wc-container">
        <div class="wc-svg-area">
          <svg id="wc-svg" viewBox="-150 -150 300 300" width="100%" height="100%">
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2ddd4" stroke-width="0.5"/>
            </pattern>
            <rect x="-150" y="-150" width="300" height="300" fill="url(#grid)" />

            <circle id="wc-circle" cx="0" cy="0" r="60" fill="rgba(225,112,85,0.2)" stroke="#e17055" stroke-width="3" />
            
            <line id="wc-diameter" x1="-60" y1="0" x2="60" y2="0" stroke="#dcdde1" stroke-width="2" stroke-dasharray="4,4" />
            
            <line id="wc-radius" x1="0" y1="0" x2="60" y2="0" stroke="#e17055" stroke-width="4" stroke-linecap="round"/>
            <circle cx="0" cy="0" r="5" fill="#1b2838" />
            
            <text id="wc-lbl-r" x="30" y="-10" font-family="Fredoka" font-size="14" font-weight="700" fill="#1b2838" text-anchor="middle">r = 3</text>
          </svg>
        </div>

        <div class="wc-controls">
          <div class="wc-slider-wrap">
            <label class="wc-label" for="wc-range"><span>Medida del Radio (r)</span> <span id="wc-val-r" style="color:#e17055; font-weight:bold;">3 u</span></label>
            <input type="range" id="wc-range" class="wc-slider" min="2" max="7" value="3" step="1">
          </div>
        </div>

        <div class="wc-stats">
          <div class="wc-stat-box" style="border-color: #0984e3; background: rgba(9,132,227,0.1);">
            <div class="wc-stat-title" style="color:#0984e3;">Diámetro (d = 2r)</div>
            <div class="wc-stat-value" id="wc-val-d" style="color:#0984e3;">6 u</div>
          </div>
          <div class="wc-stat-box">
            <div class="wc-stat-title">Área (A ≈ 3.1416 × r²)</div>
            <div class="wc-stat-value" id="wc-val-a">28.27 u²</div>
          </div>
        </div>
      </div>
    `;

    const slider = document.getElementById('wc-range');
    const circle = document.getElementById('wc-circle');
    const lineRadius = document.getElementById('wc-radius');
    const lineDiameter = document.getElementById('wc-diameter');
    const lblR = document.getElementById('wc-lbl-r');
    
    const valR = document.getElementById('wc-val-r');
    const valD = document.getElementById('wc-val-d');
    const valA = document.getElementById('wc-val-a');

    const PI = 3.1416;
    const SCALE = 20; // 1 unidad = 20px

    function draw() {
      const r = parseInt(slider.value);
      const px = r * SCALE;

      // Update SVG
      circle.setAttribute('r', px);
      lineRadius.setAttribute('x2', px);
      lineDiameter.setAttribute('x1', -px);
      lineDiameter.setAttribute('x2', px);
      
      lblR.setAttribute('x', px / 2);
      lblR.textContent = `r = ${r}`;

      // Update Math
      valR.textContent = `${r} u`;
      valD.textContent = `${r * 2} u`;
      const area = PI * Math.pow(r, 2);
      valA.textContent = `${area.toFixed(2)} u²`;
    }

    slider.addEventListener('input', draw);
    draw();
  }
};