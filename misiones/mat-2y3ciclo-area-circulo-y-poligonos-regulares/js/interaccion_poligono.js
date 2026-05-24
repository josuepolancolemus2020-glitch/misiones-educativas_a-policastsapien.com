// js/interaccion_poligono.js

window.WidgetPoligonoJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wp-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wp-svg-area { width: 100%; height: 300px; background: #fdfdfd; border: 1.5px dashed #dcdde1; border-radius: 12px; margin-bottom: 1.2rem; display: flex; justify-content: center; align-items: center; overflow: hidden; position: relative; }
        .wp-controls { display: flex; flex-direction: column; gap: 1rem; }
        .wp-slider-wrap { width: 100%; }
        .wp-label { font-family: 'Fredoka', sans-serif; font-size: 1rem; color: #2d3436; margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
        .wp-slider { width: 100%; accent-color: #00b894; cursor: pointer; }
        .wp-data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-top: 1rem; }
        .wp-badge { background: #f8f9fa; border: 1px solid #dcdde1; padding: 0.6rem; border-radius: 8px; text-align: center; font-size: 0.9rem; }
        .wp-badge strong { display: block; font-family: 'Fredoka', sans-serif; font-size: 1.1rem; color: #00b894; }
        
        [data-theme="dark"] .wp-container { background: #1e2130; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .wp-label { color: #e8f0fe; }
        [data-theme="dark"] .wp-svg-area { background: #0a0d16; border-color: #2d3450; }
        [data-theme="dark"] .wp-badge { background: #0a0d16; border-color: #4a5568; color: #a0aec0; }
      </style>
      
      <div class="wp-container">
        <div class="wp-svg-area">
          <svg id="wp-svg" viewBox="-150 -150 300 300" width="100%" height="100%">
            <circle cx="0" cy="0" r="120" fill="none" stroke="#dcdde1" stroke-width="1.5" stroke-dasharray="4,4" />
            
            <polygon id="wp-poly" points="" fill="rgba(0,184,148,0.15)" stroke="#00b894" stroke-width="3" stroke-linejoin="round" />
            
            <line id="wp-radio" x1="0" y1="0" x2="0" y2="0" stroke="#b2bec3" stroke-width="2" />
            
            <line id="wp-apotema" x1="0" y1="0" x2="0" y2="0" stroke="#e84393" stroke-width="3" stroke-linecap="round" />
            
            <path id="wp-angle90" d="" fill="none" stroke="#e84393" stroke-width="1.5" />
            
            <circle cx="0" cy="0" r="5" fill="#2d3436" />
            
            <text id="wp-lbl-a" x="0" y="0" font-family="Fredoka" font-size="14" font-weight="700" fill="#e84393" text-anchor="middle">a</text>
          </svg>
        </div>

        <div class="wp-controls">
          <div class="wp-slider-wrap">
            <label class="wp-label" for="wp-slider-l"><span>Número de Lados (n)</span> <span id="wp-val-l" style="color:#00b894; font-weight:bold;">6 (Hexágono)</span></label>
            <input type="range" id="wp-slider-l" class="wp-slider" min="3" max="12" value="6">
          </div>
        </div>

        <div class="wp-data-grid">
          <div class="wp-badge">Apotema (a) <strong id="wp-out-a">8.66 u</strong></div>
          <div class="wp-badge">Lado (L) <strong id="wp-out-side" style="color:#0984e3;">10.00 u</strong></div>
          <div class="wp-badge">Perímetro (P) <strong id="wp-out-p" style="color:#e1b12c;">60.00 u</strong></div>
          <div class="wp-badge">Área = (P·a)/2 <strong id="wp-out-area" style="color:#6c5ce7;">259.81 u²</strong></div>
        </div>
      </div>
    `;

    const slider = document.getElementById('wp-slider-l');
    const poly = document.getElementById('wp-poly');
    const apotema = document.getElementById('wp-apotema');
    const radio = document.getElementById('wp-radio');
    const angle90 = document.getElementById('wp-angle90');
    const lblA = document.getElementById('wp-lbl-a');
    
    const valL = document.getElementById('wp-val-l');
    const outA = document.getElementById('wp-out-a');
    const outSide = document.getElementById('wp-out-side');
    const outP = document.getElementById('wp-out-p');
    const outArea = document.getElementById('wp-out-area');

    const NAMES = { 3:'Triángulo', 4:'Cuadrado', 5:'Pentágono', 6:'Hexágono', 7:'Heptágono', 8:'Octágono', 9:'Eneágono', 10:'Decágono', 11:'Hendecágono', 12:'Dodecágono' };
    const R_PX = 120; // Graphic radius
    const R_UNITS = 10; // Math radius (logic)

    function draw() {
      const n = parseInt(slider.value);
      valL.textContent = `${n} (${NAMES[n]})`;

      let points = [];
      let firstVert = null;
      let secondVert = null;
      
      const angleStep = (Math.PI * 2) / n;
      // Rotar -PI/2 para que siempre haya un vértice apuntando "arriba"
      const offset = -Math.PI / 2; 

      for(let i=0; i<n; i++) {
        const theta = offset + (i * angleStep);
        const x = R_PX * Math.cos(theta);
        const y = R_PX * Math.sin(theta);
        points.push(`${x},${y}`);
        
        if (i===0) firstVert = {x, y};
        if (i===1) secondVert = {x, y};
      }

      poly.setAttribute('points', points.join(' '));

      // Calcular punto medio del primer lado para la apotema visual
      const midX = (firstVert.x + secondVert.x) / 2;
      const midY = (firstVert.y + secondVert.y) / 2;
      
      apotema.setAttribute('x2', midX);
      apotema.setAttribute('y2', midY);
      
      radio.setAttribute('x2', secondVert.x);
      radio.setAttribute('y2', secondVert.y);

      // Posición de la etiqueta 'a' a la mitad de la apotema
      lblA.setAttribute('x', midX * 0.5 - 10);
      lblA.setAttribute('y', midY * 0.5);

      // Símbolo de 90 grados
      const dx = secondVert.x - firstVert.x;
      const dy = secondVert.y - firstVert.y;
      const len = Math.sqrt(dx*dx + dy*dy);
      const ux = dx/len; const uy = dy/len; // Vector unitario del lado
      const vx = -uy; const vy = ux; // Perpendicular
      const size = 12;
      
      // Camino: P1 -> Esquina -> P2
      const p1x = midX + ux * size; const p1y = midY + uy * size;
      const ex = p1x - vx * size;   const ey = p1y - vy * size;
      const p2x = midX - vx * size; const p2y = midY - vy * size;
      
      angle90.setAttribute('d', `M ${p1x} ${p1y} L ${ex} ${ey} L ${p2x} ${p2y}`);

      // --- MATHEMATICS ---
      const thetaMath = (Math.PI * 2) / n;
      // Lado L = 2 * R * sin(theta/2)
      const side = 2 * R_UNITS * Math.sin(thetaMath / 2);
      // Apotema a = R * cos(theta/2)
      const aMath = R_UNITS * Math.cos(thetaMath / 2);
      const pMath = n * side;
      const areaMath = (pMath * aMath) / 2;

      outA.textContent = `${aMath.toFixed(2)} u`;
      outSide.textContent = `${side.toFixed(2)} u`;
      outP.textContent = `${pMath.toFixed(2)} u`;
      outArea.textContent = `${areaMath.toFixed(2)} u²`;
    }

    slider.addEventListener('input', draw);
    draw();
  }
};