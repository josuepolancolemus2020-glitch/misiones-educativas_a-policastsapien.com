// js/interaccion_comple_suple.js

window.WidgetCompleSupleJSON = {
  prompt: "Simulador interactivo de ángulos complementarios y suplementarios...",
  
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn("Contenedor del widget comple/suple no encontrado:", containerId);
      return;
    }

    // --- HTML TEMPLATE ---
    container.innerHTML = `
      <style>
        .wc-container {
          background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; 
          padding: 1.5rem; font-family: 'Nunito', sans-serif;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1.2rem 0;
        }
        .wc-svg-area {
          width: 100%; height: 260px; background: #fdfdfd; 
          border: 1.5px dashed #dcdde1; border-radius: 12px;
          margin-bottom: 1.2rem; display: flex; justify-content: center; align-items: center;
          overflow: hidden; position: relative;
        }
        .wc-controls { display: flex; flex-direction: column; gap: 1rem; }
        .wc-mode-toggles { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
        .wc-btn-mode { 
          flex: 1; min-width: 120px; text-align: center; font-family: 'Fredoka', sans-serif; 
          background: #f5f2ed; color: #636e72; border: 2px solid #e2ddd4; 
          padding: 0.6rem 1rem; border-radius: 12px; cursor: pointer; transition: all 0.2s; 
        }
        .wc-btn-mode.active.wc-comp { background: #6c5ce7; border-color: #6c5ce7; color: white; box-shadow: 0 4px 12px rgba(108,92,231,0.2); }
        .wc-btn-mode.active.wc-supl { background: #e17055; border-color: #e17055; color: white; box-shadow: 0 4px 12px rgba(225,112,85,0.2); }
        
        .wc-slider-wrap { width: 100%; }
        .wc-label { font-family: 'Fredoka', sans-serif; font-size: 1rem; color: #2d3436; margin-bottom: 0.5rem; display: block; }
        .wc-slider { width: 100%; accent-color: #0984e3; cursor: pointer; }
        
        .wc-footer-text { 
          padding: 0.8rem 1rem; border-radius: 8px; font-size: 1rem; color: #1b2838; 
          margin-top: 1rem; font-family: 'Fira Code', monospace; text-align: center;
          background: #f8f9fa; border: 1.5px solid #dcdde1; transition: all 0.3s;
        }
        .wc-badge { padding: 0.15rem 0.5rem; border-radius: 6px; color: white; font-weight: bold; }
        .wc-bdg-a { background: #0984e3; }
        .wc-bdg-b { background: #a29bfe; }
        .wc-bdg-s { background: #fdcb6e; color: #1b2838; }

        /* Tema oscuro dinámico si el proyecto lo usa */
        [data-theme="dark"] .wc-container { background: #1e2130; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .wc-label { color: #e8f0fe; }
        [data-theme="dark"] .wc-svg-area { background: #0a0d16; border-color: #2d3450; }
        [data-theme="dark"] .wc-btn-mode { background: #2d3450; color: #a0aec0; border-color: #4a5568; }
        [data-theme="dark"] .wc-footer-text { background: #0a0d16; color: #e8f0fe; border-color: #4a5568;}
      </style>
      
      <div class="wc-container">
        
        <div class="wc-mode-toggles">
          <button class="wc-btn-mode wc-comp active" id="wc-btn-comp">🧩 Complementarios (90°)</button>
          <button class="wc-btn-mode wc-supl" id="wc-btn-supl">🔗 Suplementarios (180°)</button>
        </div>

        <div class="wc-svg-area">
          <svg id="wc-svg" viewBox="0 0 400 220" width="100%" height="100%">
            <!-- El (0,0) reposicionado al centro-abajo -->
            <g transform="translate(200, 180)">
              <!-- Total Reference Ray (Static 90 or 180 depending on mode) -->
              <g id="wc-ray-total-ref">
                <line x1="0" y1="0" x2="160" y2="0" stroke="#dcdde1" stroke-width="3" stroke-dasharray="6,4"/>
              </g>

              <!-- Base Line (0°) -->
              <line x1="0" y1="0" x2="160" y2="0" stroke="#1b2838" stroke-width="4" stroke-linecap="round"/>
              <polygon points="160,-6 160,6 172,0" fill="#1b2838" />
              
              <!-- Si es Llano (180°), mostramos un rayo opuesto fijo -->
              <g id="wc-ray-left" style="display:none;">
                <line x1="0" y1="0" x2="-160" y2="0" stroke="#1b2838" stroke-width="4" stroke-linecap="round"/>
                <polygon points="-160,-6 -160,6 -172,0" fill="#1b2838" />
              </g>

              <!-- Arco B (Restante) -->
              <path id="wc-arc-b" fill="rgba(162,155,254,0.2)" stroke="#a29bfe" stroke-width="3" />
              
              <!-- Arco A (Seleccionado) -->
              <path id="wc-arc-a" fill="rgba(9,132,227,0.2)" stroke="#0984e3" stroke-width="3" />

              <!-- Rayo Separador (Middle) -->
              <g id="wc-ray-mid">
                <line x1="0" y1="0" x2="160" y2="0" stroke="#0984e3" stroke-width="4" stroke-linecap="round"/>
                <polygon points="160,-6 160,6 172,0" fill="#0984e3" />
              </g>

              <!-- Vértice -->
              <circle cx="0" cy="0" r="5" fill="#e17055" />

              <!-- Textos SVG -->
              <text id="wc-lbl-a" x="0" y="0" font-family="Fredoka" font-size="14" font-weight="700" fill="#0984e3" text-anchor="middle">A</text>
              <text id="wc-lbl-b" x="0" y="0" font-family="Fredoka" font-size="14" font-weight="700" fill="#a29bfe" text-anchor="middle">B</text>
            </g>
          </svg>
        </div>

        <div class="wc-controls">
          <div class="wc-slider-wrap">
            <label class="wc-label" for="wc-range">Ángulo <span style="color:#0984e3;">A</span>: <span id="wc-val">45</span>°</label>
            <input type="range" id="wc-range" class="wc-slider" min="5" max="85" value="45">
          </div>
        </div>

        <div class="wc-footer-text" id="wc-footer">
          <span class="wc-badge wc-bdg-s" id="wc-eq-total">90°</span> = 
          <span class="wc-badge wc-bdg-a" id="wc-eq-a">45°</span> + 
          <span class="wc-badge wc-bdg-b" id="wc-eq-b">45°</span>
        </div>

      </div>
    `;

    // --- LOGIC ---
    let mode = 90; // 90 for Comp, 180 for Supl

    const btnComp = document.getElementById('wc-btn-comp');
    const btnSupl = document.getElementById('wc-btn-supl');
    const slider = document.getElementById('wc-range');
    const valOut = document.getElementById('wc-val');
    
    // UI Elements
    const arcA = document.getElementById('wc-arc-a');
    const arcB = document.getElementById('wc-arc-b');
    const rayMid = document.getElementById('wc-ray-mid');
    const rayTotalRef = document.getElementById('wc-ray-total-ref');
    const rayLeft = document.getElementById('wc-ray-left');
    const lblA = document.getElementById('wc-lbl-a');
    const lblB = document.getElementById('wc-lbl-b');

    // Equation Elements
    const eqTotal = document.getElementById('wc-eq-total');
    const eqA = document.getElementById('wc-eq-a');
    const eqB = document.getElementById('wc-eq-b');
    const footerUi = document.getElementById('wc-footer');

    function polarToCartesian(radius, angleInDegrees) {
      // Ángulo negativo porque en SVG el eje Y crece hacia abajo
      const angleInRadians = (-angleInDegrees * Math.PI) / 180.0;
      return {
        x: radius * Math.cos(angleInRadians),
        y: radius * Math.sin(angleInRadians)
      };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {
      if (startAngle === endAngle) return `M ${x} ${y}`;
      const start = polarToCartesian(radius, startAngle);
      const end = polarToCartesian(radius, endAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      // M x y L start A rx ry x-axis-rotation large-arc-flag sweep-flag end Z
      return `M ${x} ${y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
    }

    function updateColors() {
      if(mode === 90) {
        footerUi.style.borderColor = "#a29bfe"; // purple-ish logic
        eqTotal.style.background = "#6c5ce7";
        eqTotal.style.color = "white";
        arcB.setAttribute('fill', 'rgba(108,92,231,0.2)');
        arcB.setAttribute('stroke', '#6c5ce7');
        lblB.setAttribute('fill', '#6c5ce7');
        eqB.style.background = "#6c5ce7";
      } else {
        footerUi.style.borderColor = "#e17055"; // amber logic
        eqTotal.style.background = "#e17055";
        eqTotal.style.color = "white";
        arcB.setAttribute('fill', 'rgba(225,112,85,0.2)');
        arcB.setAttribute('stroke', '#e17055');
        lblB.setAttribute('fill', '#e17055');
        eqB.style.background = "#e17055";
      }
    }

    function draw() {
      const angleA = parseInt(slider.value);
      const angleB = mode - angleA;
      
      valOut.textContent = angleA;

      // Rotate mid ray
      rayMid.setAttribute('transform', `rotate(${-angleA})`);
      
      // Update Ref Ray boundary
      rayTotalRef.setAttribute('transform', `rotate(${-mode})`);

      // Arcs
      arcA.setAttribute('d', describeArc(0, 0, 60, 0, angleA));
      arcB.setAttribute('d', describeArc(0, 0, 65, angleA, mode));

      // Labels relative positioning
      const posA = polarToCartesian(80, angleA / 2);
      lblA.setAttribute('x', posA.x);
      lblA.setAttribute('y', posA.y + 5);
      lblA.textContent = angleA + "°";

      const posB = polarToCartesian(90, angleA + (angleB / 2));
      lblB.setAttribute('x', posB.x);
      lblB.setAttribute('y', posB.y + 5);
      lblB.textContent = angleB + "°";

      // Re-populate math equation
      eqTotal.textContent = mode + "°";
      eqA.textContent = angleA + "°";
      eqB.textContent = angleB + "°";
    }

    // -- EVENTS --
    slider.addEventListener('input', draw);

    btnComp.addEventListener('click', () => {
      mode = 90;
      btnComp.classList.add('active');
      btnSupl.classList.remove('active');
      rayLeft.style.display = 'none';
      slider.max = 85; 
      if (parseInt(slider.value) > 85) slider.value = 85;
      updateColors();
      draw();
    });

    btnSupl.addEventListener('click', () => {
      mode = 180;
      btnSupl.classList.add('active');
      btnComp.classList.remove('active');
      rayLeft.style.display = 'block';
      slider.max = 175;
      updateColors();
      draw();
    });

    // Iniciar
    updateColors();
    draw();
  }
};
