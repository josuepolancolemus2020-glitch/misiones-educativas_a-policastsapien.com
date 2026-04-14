// js/interaccion_explorador.js

window.WidgetExploradorJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // --- HTML TEMPLATE ---
    container.innerHTML = `
      <style>
        .we-container {
          background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; 
          padding: 1.5rem; font-family: 'Nunito', sans-serif;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0;
        }
        .we-svg-area {
          width: 100%; height: 320px; background: #faf9f7; /* Ligero tono cálido */
          border: 1.5px dashed #dcdde1; border-radius: 12px;
          margin-bottom: 1.2rem; display: flex; justify-content: center; align-items: center;
          overflow: hidden; position: relative;
        }
        .we-controls { display: flex; flex-direction: column; gap: 1.5rem; }
        .we-slider-wrap { width: 100%; }
        .we-label { font-family: 'Fredoka', sans-serif; font-size: 1.05rem; color: #2d3436; margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
        .we-slider { width: 100%; cursor: pointer; }
        
        /* Tema y Tipos Dinámicos */
        .we-footer-card {
            padding: 1rem; border-radius: 12px; text-align: center;
            font-size: 1rem; color: white; font-family: 'Fredoka', sans-serif;
            transition: all 0.3s;
        }
        
        /* Data Colors */
        :root {
            --we-agudo: #0984e3;
            --we-recto: #00b894;
            --we-obtuso: #e1b12c;
            --we-llano: #2d3436;
            --we-concavo: #e84393;
            --we-completo: #6c5ce7;
        }

        #we-slider-ang { accent-color: var(--we-agudo); } /* default */
        #we-slider-rot { accent-color: #b2bec3; }

      </style>
      
      <div class="we-container">
        <div class="we-svg-area">
          <svg id="we-svg" viewBox="-200 -200 400 400" width="100%" height="100%">
            <!-- Grid de fondo para ayudar en la percepción espacial -->
            <g opacity="0.1">
              <circle cx="0" cy="0" r="50" fill="none" stroke="#2d3436" stroke-width="1" stroke-dasharray="2,2"/>
              <circle cx="0" cy="0" r="100" fill="none" stroke="#2d3436" stroke-width="1" stroke-dasharray="2,2"/>
              <circle cx="0" cy="0" r="150" fill="none" stroke="#2d3436" stroke-width="1" stroke-dasharray="2,2"/>
              <line x1="-180" y1="0" x2="180" y2="0" stroke="#2d3436" stroke-width="1" />
              <line x1="0" y1="-180" x2="0" y2="180" stroke="#2d3436" stroke-width="1" />
            </g>

            <!-- TODO ROTA CON ESTE GRUPO ESPACIAL -->
            <g id="we-compass" style="transition: transform 0.1s linear;">
              
              <!-- Elementos de Marcado -->
              <!-- Rectángulo para el ángulo de 90 -->
              <rect id="we-rect-90" x="0" y="-30" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2.5" style="display:none;" />
              
              <!-- Circulo completo 360 -->
              <circle id="we-circ-360" cx="0" cy="0" r="50" fill="rgba(0,0,0,0.1)" stroke="currentColor" stroke-width="3" style="display:none;" />

              <!-- Arco Principal SVG -->
              <path id="we-arc" fill="rgba(0,0,0,0.1)" stroke="currentColor" stroke-width="3" />

              <!-- Eje Base Seguro (Fijo relativo al compass) -->
              <g id="we-ray-base">
                <line x1="0" y1="0" x2="160" y2="0" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
                <polygon points="160,-6 160,6 175,0" fill="currentColor" />
              </g>

              <!-- El Rayo Que se Abre -->
              <g id="we-ray-top">
                <line x1="0" y1="0" x2="160" y2="0" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/>
                <polygon points="160,-6 160,6 175,0" fill="currentColor" />
              </g>

              <!-- Vértice Central -->
              <circle cx="0" cy="0" r="6" fill="#2d3436" />

            </g>

            <!-- Texto de Grados FLOTANTE que nunca rota de cabeza -->
            <text id="we-lbl-deg" x="0" y="0" font-family="Fredoka" font-size="20" font-weight="700" fill="currentColor" text-anchor="middle">45°</text>
          </svg>
        </div>

        <div class="we-controls">
          <div class="we-slider-wrap">
            <label class="we-label" for="we-slider-ang"><span>Abertura del Ángulo:</span> <span id="we-val-ang" style="font-weight:700; color:var(--we-agudo);">45°</span></label>
            <input type="range" id="we-slider-ang" class="we-slider" min="0" max="360" value="45">
          </div>
          
          <div class="we-slider-wrap">
            <label class="we-label" for="we-slider-rot" style="color:#636e72;"><span>Orientación (Base):</span> <span id="we-val-rot">0°</span></label>
            <input type="range" id="we-slider-rot" class="we-slider" min="-180" max="180" value="0">
          </div>
        </div>

        <div class="we-footer-card" id="we-footer" style="background-color: var(--we-agudo);">
          <h3 style="margin:0 0 0.2rem 0;" id="we-foot-title">Ángulo Agudo</h3>
          <p style="margin:0; font-family:'Nunito',sans-serif; font-size:0.9rem;" id="we-foot-desc">Mide menos de 90°.</p>
        </div>
      </div>
    `;

    // --- LOGIC ---
    const sliderAng = document.getElementById('we-slider-ang');
    const valAng = document.getElementById('we-val-ang');
    const sliderRot = document.getElementById('we-slider-rot');
    const valRot = document.getElementById('we-val-rot');

    const compass = document.getElementById('we-compass');
    const rayTop = document.getElementById('we-ray-top');
    const rayBase = document.getElementById('we-ray-base');
    const arc = document.getElementById('we-arc');
    const rect90 = document.getElementById('we-rect-90');
    const circ360 = document.getElementById('we-circ-360');
    const lblDeg = document.getElementById('we-lbl-deg');

    const footer = document.getElementById('we-footer');
    const footTitle = document.getElementById('we-foot-title');
    const footDesc = document.getElementById('we-foot-desc');

    const TYPES = [
      { max: 89, class: 'we-agudo', hex: '#0984e3', title: 'Ángulo Agudo', desc: 'Mide menos de 90°.' },
      { max: 90, class: 'we-recto', hex: '#00b894', title: 'Ángulo Recto', desc: 'Mide exactamente 90°. Forma una esquina perfecta.' },
      { max: 179, class: 'we-obtuso', hex: '#e1b12c', title: 'Ángulo Obtuso', desc: 'Mide más de 90° y menos de 180°. Es muy abierto.' },
      { max: 180, class: 'we-llano', hex: '#2d3436', title: 'Ángulo Llano', desc: 'Mide exactamente 180°. Sus rayos forman una línea completamente recta.' },
      { max: 359, class: 'we-concavo', hex: '#e84393', title: 'Ángulo Cóncavo (Entrante)', desc: 'Mide más de 180°. La abertura da la vuelta.' },
      { max: 360, class: 'we-completo', hex: '#6c5ce7', title: 'Ángulo Completo', desc: 'Mide exactamente 360°. Dio la vuelta entera sobre sí mismo.' }
    ];

    function polarToCartesian(radius, angleInDegrees) {
      // SVG Y is inverted (down), so -angle makes it go counter-clockwise (visual math standard).
      const angleInRadians = (-angleInDegrees * Math.PI) / 180.0;
      return {
        x: radius * Math.cos(angleInRadians),
        y: radius * Math.sin(angleInRadians)
      };
    }

    function update() {
      const ang = parseInt(sliderAng.value);
      const rot = parseInt(sliderRot.value);

      // 1. Text UI
      valAng.textContent = ang + "°";
      valRot.textContent = rot + "°";
      lblDeg.textContent = ang + "°";

      // 2. Determine Type & Color
      let config = TYPES[0];
      for(let t of TYPES) {
        if(ang <= t.max) {
          config = t; break;
        }
      }

      sliderAng.style.accentColor = config.hex;
      valAng.style.color = config.hex;
      footer.style.backgroundColor = config.hex;
      footTitle.textContent = config.title;
      footDesc.textContent = config.desc;

      // Colorizing elements
      rayTop.setAttribute('color', config.hex);
      rayBase.setAttribute('color', config.hex);
      arc.setAttribute('color', config.hex);
      rect90.setAttribute('color', config.hex);
      circ360.setAttribute('color', config.hex);
      lblDeg.setAttribute('fill', config.hex);

      // 3. Transformations
      // The compass rotates the whole scene
      compass.style.transform = `rotate(${-rot}deg)`;
      
      // Top Ray rotates independently inside the compass to open the angle
      rayTop.style.transform = `rotate(${-ang}deg)`;

      // 4. Arc Drawing
      rect90.style.display = 'none';
      circ360.style.display = 'none';
      arc.style.display = 'block';

      if (ang === 0) {
        arc.style.display = 'none';
        lblDeg.setAttribute('display', 'none');
      } else {
        lblDeg.setAttribute('display', 'block');
        if (ang === 90) {
          arc.style.display = 'none';
          rect90.style.display = 'block';
        } else if (ang === 360) {
          arc.style.display = 'none';
          circ360.style.display = 'block';
        } else {
          // Standard Arc
          const radius = 50;
          const end = polarToCartesian(radius, ang);
          // start is always (radius, 0) relative to compass
          const largeArcFlag = ang <= 180 ? "0" : "1";
          
          // M start.x start.y A r r 0 large-arc sweep(0 for -Y) end.x end.y
          const pathD = `M ${radius} 0 A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
          
          // fill coloring depending on size to keep it clean
          if (ang < 180) {
              arc.setAttribute('d', pathD + " L 0 0 Z");
              arc.setAttribute('fill', `rgba(${hexToRgb(config.hex)}, 0.15)`);
          } else {
              arc.setAttribute('d', pathD);
              arc.setAttribute('fill', 'none'); // For very large angles, filled pie looks odd, use just stroke
          }
        }
      }

      // 5. Position Label 
      // It must hover half-way the angle, BUT considering the rotation offset so it moves smoothly
      // However, we apply text outside the compass so it doesn't rotate upside down!
      let halfAng = ang / 2;
      if(ang === 360) halfAng = 180; // place somewhere nice

      // Absolute angle = rot + halfAng
      const absAng = rot + halfAng; 
      
      // We will place the text a bit further than the arc
      let tRad = ang < 40 ? 80 : 70; 
      if(ang === 90) tRad = 60;
      
      const lblPos = polarToCartesian(tRad, absAng);
      
      lblDeg.setAttribute('x', lblPos.x);
      lblDeg.setAttribute('y', lblPos.y + 6); // +6 for font vertical centering
    }

    // Help tool
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? 
            `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,0,0';
    }

    // Events
    sliderAng.addEventListener('input', update);
    sliderRot.addEventListener('input', update);

    // Initial render
    update();
  }
};
