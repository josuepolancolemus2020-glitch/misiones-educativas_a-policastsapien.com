// js/interaccion_bisectriz.js

window.WidgetBisectrizJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn("Contenedor del widget no encontrado:", containerId);
      return;
    }

    // --- HTML TEMPLATE ---
    container.innerHTML = `
      <style>
        .wb-container {
          background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; 
          padding: 1.5rem; font-family: 'Nunito', sans-serif;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0;
        }
        .wb-svg-area {
          width: 100%; height: 260px; background: #fdfdfd; 
          border: 1.5px dashed #dcdde1; border-radius: 12px;
          margin-bottom: 1.2rem; display: flex; justify-content: center; align-items: center;
          overflow: hidden; position: relative;
        }
        .wb-controls { display: flex; flex-direction: column; gap: 1.2rem; }
        .wb-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .wb-slider-wrap { flex: 1; min-width: 200px; }
        .wb-label { font-family: 'Fredoka', sans-serif; font-size: 1rem; color: #2d3436; margin-bottom: 0.5rem; display: block; }
        .wb-slider { width: 100%; accent-color: #00b894; cursor: pointer; }
        .wb-toggle-wrap { display: flex; align-items: center; gap: 0.6rem; cursor: pointer; }
        .wb-toggle-bg { width: 44px; height: 24px; background: #e2ddd4; border-radius: 12px; position: relative; transition: background 0.3s; }
        .wb-toggle-knob { width: 18px; height: 18px; background: white; border-radius: 50%; position: absolute; top: 3px; left: 3px; transition: transform 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        .wb-toggle-wrap.active .wb-toggle-bg { background: #00b894; }
        .wb-toggle-wrap.active .wb-toggle-knob { transform: translateX(20px); }
        .wb-btn { font-family: 'Fredoka', sans-serif; background: #0984e3; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: transform 0.2s; box-shadow: 0 4px 10px rgba(9,132,227,0.2); }
        .wb-btn:hover { transform: translateY(-2px); }
        .wb-btn:active { transform: translateY(0); }
        .wb-footer-text { background: rgba(0,184,148,0.1); padding: 0.8rem 1rem; border-left: 4px solid #00b894; border-radius: 8px; font-size: 0.95rem; color: #1b2838; margin-top: 1rem; }
        .wb-highlight { color: #00b894; font-weight: 700; }
        
        /* Tema oscuro dinámico si existe */
        [data-theme="dark"] .wb-container { background: #1e2130; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .wb-label { color: #e8f0fe; }
        [data-theme="dark"] .wb-svg-area { background: #0a0d16; border-color: #2d3450; }
        [data-theme="dark"] .wb-footer-text { color: #e8f0fe; }
      </style>
      
      <div class="wb-container">
        <div class="wb-svg-area">
          <svg id="wb-svg" viewBox="0 0 400 260" width="100%" height="100%">
            <!-- El (0,0) será reposicionado visualmente -->
            <g transform="translate(180, 220)">
              <!-- Total Arc -->
              <path id="wb-arc-total" fill="rgba(65,155,136,0.1)" stroke="#419b88" stroke-width="3" />
              <!-- Sub Arc 1 -->
              <path id="wb-arc-sub1" fill="none" class="wb-bisect-elem" stroke="#0984e3" stroke-width="4" style="opacity:0;" />
              <!-- Sub Arc 2 -->
              <path id="wb-arc-sub2" fill="none" class="wb-bisect-elem" stroke="#e84393" stroke-width="4" style="opacity:0;" />
              
              <!-- Rayo Base (Horizontal) -->
              <line x1="0" y1="0" x2="160" y2="0" stroke="#1b2838" stroke-width="4" stroke-linecap="round"/>
              <polygon points="160,-6 160,6 172,0" fill="#1b2838" />

              <!-- Rayo Móvil (Ángulo) -->
              <g id="wb-ray-angle">
                <line x1="0" y1="0" x2="160" y2="0" stroke="#1b2838" stroke-width="4" stroke-linecap="round"/>
                <polygon points="160,-6 160,6 172,0" fill="#1b2838" />
              </g>

              <!-- Rayo Bisectriz -->
              <g id="wb-ray-bisect" class="wb-bisect-elem" style="opacity:0;">
                <line x1="0" y1="0" x2="180" y2="0" stroke="#00b894" stroke-width="3" stroke-dasharray="6,6" stroke-linecap="round"/>
                <polygon points="180,-5 180,5 190,0" fill="#00b894" />
              </g>

              <!-- Etiquetas -->
              <text id="wb-lbl-total" x="0" y="-30" font-family="Fredoka" font-size="18" font-weight="700" fill="#419b88" text-anchor="middle">90°</text>
              <text id="wb-lbl-sub1" class="wb-bisect-elem" x="0" y="-30" font-family="Fredoka" font-size="14" font-weight="700" fill="#0984e3" text-anchor="middle" style="opacity:0;">45°</text>
              <text id="wb-lbl-sub2" class="wb-bisect-elem" x="0" y="-30" font-family="Fredoka" font-size="14" font-weight="700" fill="#e84393" text-anchor="middle" style="opacity:0;">45°</text>

              <!-- Vértice -->
              <circle cx="0" cy="0" r="5" fill="#e17055" />
            </g>
          </svg>
        </div>

        <div class="wb-controls">
          <div class="wb-row">
            <div class="wb-slider-wrap">
              <label class="wb-label" for="wb-range">Ángulo Total: <span id="wb-val">90</span>°</label>
              <input type="range" id="wb-range" class="wb-slider" min="10" max="180" value="90">
            </div>
            <button class="wb-btn" id="wb-btn-rnd">🎲 Ángulo Aleatorio</button>
          </div>
          <div class="wb-row" style="justify-content: flex-start;">
            <div class="wb-toggle-wrap" id="wb-toggle">
              <div class="wb-toggle-bg"><div class="wb-toggle-knob"></div></div>
              <span class="wb-label" style="margin:0;">Mostrar Bisectriz</span>
            </div>
          </div>
        </div>

        <div class="wb-footer-text" id="wb-footer" style="display:none;">
          La bisectriz divide el ángulo total en dos ángulos idénticos de <span class="wb-highlight" id="wb-foot-val">45°</span> cada uno.
        </div>
      </div>
    `;

    // --- LOGIC ---
    const slider = document.getElementById('wb-range');
    const valOut = document.getElementById('wb-val');
    const btnRnd = document.getElementById('wb-btn-rnd');
    const toggle = document.getElementById('wb-toggle');
    const footer = document.getElementById('wb-footer');
    const footVal = document.getElementById('wb-foot-val');

    const rayAngle = document.getElementById('wb-ray-angle');
    const rayBisect = document.getElementById('wb-ray-bisect');
    
    const arcTotal = document.getElementById('wb-arc-total');
    const arcSub1 = document.getElementById('wb-arc-sub1');
    const arcSub2 = document.getElementById('wb-arc-sub2');

    const lblTotal = document.getElementById('wb-lbl-total');
    const lblSub1 = document.getElementById('wb-lbl-sub1');
    const lblSub2 = document.getElementById('wb-lbl-sub2');

    const bisectElems = document.querySelectorAll('.wb-bisect-elem');

    let isBisectVisible = false;

    function polarToCartesian(radius, angleInDegrees) {
      // SVGs rotate clockwise generally (positive Y is down). 
      // To draw angle properly (counter clockwise), we use negative angles.
      const angleInRadians = (-angleInDegrees * Math.PI) / 180.0;
      return {
        x: radius * Math.cos(angleInRadians),
        y: radius * Math.sin(angleInRadians)
      };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {
      const start = polarToCartesian(radius, startAngle);
      const end = polarToCartesian(radius, endAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return `M ${x} ${y} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
    }

    function describeLineArc(radius, startAngle, endAngle) {
      const start = polarToCartesian(radius, startAngle);
      const end = polarToCartesian(radius, endAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
    }

    function draw() {
      const deg = parseInt(slider.value);
      valOut.textContent = deg;

      // Rotación del rayo principal (negativo para subir visualmente)
      rayAngle.setAttribute('transform', `rotate(${-deg})`);

      // Arco Total
      arcTotal.setAttribute('d', describeArc(0, 0, 45, 0, deg));
      
      // Etiqueta del Total (a la mitad del ángulo)
      const tPos = polarToCartesian(70, deg / 2);
      lblTotal.setAttribute('x', tPos.x);
      lblTotal.setAttribute('y', tPos.y + 5);
      lblTotal.textContent = deg + "°";

      if (isBisectVisible) {
        const half = deg / 2;
        footVal.textContent = (deg / 2) + "°";
        rayBisect.setAttribute('transform', `rotate(${-half})`);

        // Dibujar semicoronas congruentes a distintas distancias
        arcSub1.setAttribute('d', describeLineArc(50, 0, half));
        arcSub2.setAttribute('d', describeLineArc(40, half, deg));

        // Etiquetas relativas a la mitad de cada mitad
        const h0 = half / 2;
        const h1 = half + (half / 2);
        
        const pos1 = polarToCartesian(80, h0);
        lblSub1.setAttribute('x', pos1.x);
        lblSub1.setAttribute('y', pos1.y + 5);
        lblSub1.textContent = (Math.round(half*10)/10) + "°";

        const pos2 = polarToCartesian(80, h1);
        lblSub2.setAttribute('x', pos2.x);
        lblSub2.setAttribute('y', pos2.y + 5);
        lblSub2.textContent = (Math.round(half*10)/10) + "°";
      }
    }

    // -- EVENTS --
    slider.addEventListener('input', draw);
    
    btnRnd.addEventListener('click', () => {
      slider.value = Math.floor(Math.random() * (180 - 10 + 1)) + 10;
      draw();
    });

    toggle.addEventListener('click', () => {
      isBisectVisible = !isBisectVisible;
      toggle.classList.toggle('active', isBisectVisible);
      footer.style.display = isBisectVisible ? 'block' : 'none';
      lblTotal.style.opacity = isBisectVisible ? '0' : '1';
      arcTotal.style.fill = isBisectVisible ? 'none' : 'rgba(65,155,136,0.1)';

      bisectElems.forEach(el => {
        el.style.opacity = isBisectVisible ? '1' : '0';
      });
      draw();
    });

    // Iniciar
    draw();
  }
};
