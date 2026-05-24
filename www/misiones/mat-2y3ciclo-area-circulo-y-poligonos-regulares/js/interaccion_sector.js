// js/interaccion_sector.js

window.WidgetSectorJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .ws-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .ws-svg-area { width: 100%; height: 260px; background: #fdfdfd; border: 1.5px dashed #dcdde1; border-radius: 12px; margin-bottom: 1.2rem; display: flex; justify-content: center; align-items: center; overflow: hidden; position: relative; }
        .ws-controls { display: flex; flex-direction: column; gap: 1rem; }
        .ws-slider-wrap { width: 100%; }
        .ws-label { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; color: #2d3436; margin-bottom: 0.4rem; display: flex; justify-content: space-between; }
        .ws-slider { width: 100%; cursor: pointer; }
        #ws-slider-ang { accent-color: #0984e3; }
        .ws-calc-box { background: #f8f9fa; border: 1.5px solid #dcdde1; border-radius: 8px; padding: 1rem; margin-top: 1rem; font-family: 'Fira Code', monospace; font-size: 0.9rem; color: #2d3436; }
        .ws-hl { color: #0984e3; font-weight: bold; }
        
        [data-theme="dark"] .ws-container { background: #1e2130; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .ws-label, [data-theme="dark"] .ws-calc-box { color: #e8f0fe; }
        [data-theme="dark"] .ws-svg-area { background: #0a0d16; border-color: #2d3450; }
        [data-theme="dark"] .ws-calc-box { background: #0a0d16; border-color: #4a5568; }
      </style>
      
      <div class="ws-container">
        <div class="ws-svg-area">
          <svg id="ws-svg" viewBox="-130 -130 260 260" width="100%" height="100%">
            <circle cx="0" cy="0" r="100" fill="rgba(0,0,0,0.03)" stroke="#dcdde1" stroke-width="2" stroke-dasharray="4,4" />
            
            <path id="ws-sector" fill="rgba(9,132,227,0.2)" stroke="#0984e3" stroke-width="3" />
            
            <line x1="0" y1="0" x2="100" y2="0" stroke="#1b2838" stroke-width="3" stroke-linecap="round"/>
            <g id="ws-ray-movil">
              <line x1="0" y1="0" x2="100" y2="0" stroke="#1b2838" stroke-width="3" stroke-linecap="round"/>
            </g>
            
            <circle cx="0" cy="0" r="5" fill="#e17055" />
          </svg>
        </div>

        <div class="ws-controls">
          <div class="ws-slider-wrap">
            <label class="ws-label" for="ws-slider-ang"><span>Ángulo Central (α)</span> <span id="ws-val-ang" class="ws-hl">90°</span></label>
            <input type="range" id="ws-slider-ang" class="ws-slider" min="10" max="360" value="90">
          </div>
        </div>

        <div class="ws-calc-box">
          A = (π × r² × <span class="ws-hl">α</span>) / 360°<br>
          A = (3.1416 × 5² × <span class="ws-hl" id="ws-calc-ang">90</span>) / 360<br>
          <span style="display:block; margin-top:0.5rem; font-size:1.1rem; color:#00b894; font-weight:bold;">Área = <span id="ws-calc-res">19.64</span> u²</span>
          <div style="font-family:'Nunito', sans-serif; font-size:0.75rem; color:#636e72; margin-top:0.3rem;">* Asumiendo un radio fijo de r = 5 u</div>
        </div>
      </div>
    `;

    const sliderAng = document.getElementById('ws-slider-ang');
    const valAng = document.getElementById('ws-val-ang');
    const calcAng = document.getElementById('ws-calc-ang');
    const calcRes = document.getElementById('ws-calc-res');
    const rayMovil = document.getElementById('ws-ray-movil');
    const sector = document.getElementById('ws-sector');

    const R = 100; // Pixels
    const rReal = 5; // Unidades lógicas

    function polarToCartesian(radius, angleInDegrees) {
      const angleInRadians = (-angleInDegrees * Math.PI) / 180.0;
      return { x: radius * Math.cos(angleInRadians), y: radius * Math.sin(angleInRadians) };
    }

    function draw() {
      const ang = parseInt(sliderAng.value);
      valAng.textContent = `${ang}°`;
      calcAng.textContent = ang;
      
      // Math
      const area = (3.1416 * Math.pow(rReal, 2) * ang) / 360;
      calcRes.textContent = area.toFixed(2);

      // SVG
      rayMovil.setAttribute('transform', `rotate(${-ang})`);
      
      if (ang === 360) {
        sector.setAttribute('d', `M ${R} 0 A ${R} ${R} 0 1 0 ${R} -0.1 Z`);
      } else {
        const end = polarToCartesian(R, ang);
        const largeArcFlag = ang <= 180 ? "0" : "1";
        sector.setAttribute('d', `M 0 0 L ${R} 0 A ${R} ${R} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`);
      }
    }

    sliderAng.addEventListener('input', draw);
    draw();
  }
};