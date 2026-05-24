// js/interaccion_cociente.js

window.WidgetCocienteJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wc-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1.2rem 0; }
        .wc-visual-area { width: 100%; background: #f8f9fa; border: 1.5px dashed #dcdde1; border-radius: 12px; margin-bottom: 1.2rem; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 1rem; }
        .wc-bar-wrap { display: flex; align-items: center; gap: 1rem; }
        .wc-bar-lbl { width: 80px; font-family: 'Fredoka', sans-serif; font-size: 0.9rem; color: #2d3436; text-align: right; }
        .wc-bar-track { flex: 1; height: 30px; background: #e2ddd4; border-radius: 6px; position: relative; overflow: hidden; }
        .wc-bar-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; padding: 0 0.5rem; color: white; font-weight: bold; font-family: 'Fira Code', monospace; transition: width 0.2s ease, background 0.3s ease; white-space: nowrap; overflow: hidden;}
        
        /* Bar Colors */
        .wc-bar-divd { background: #0984e3; width: 33.33%; /* 10 units out of max 30 visual units */ }
        .wc-bar-coc { background: #00b894; width: 0%; }

        .wc-controls { display: flex; flex-direction: column; gap: 1rem; }
        .wc-slider-wrap { width: 100%; }
        .wc-label { font-family: 'Fredoka', sans-serif; font-size: 1rem; color: #2d3436; margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
        .wc-slider { width: 100%; accent-color: #e17055; cursor: pointer; }
        
        .wc-footer-text { padding: 0.8rem 1rem; border-radius: 8px; font-size: 1rem; color: #1b2838; margin-top: 1rem; text-align: center; background: #f8f9fa; border: 1.5px solid #dcdde1; transition: all 0.3s; }
        [data-theme="dark"] .wc-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wc-visual-area, [data-theme="dark"] .wc-footer-text { background: #0a0d16; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .wc-bar-lbl, [data-theme="dark"] .wc-label { color: #e8f0fe; }
        [data-theme="dark"] .wc-bar-track { background: #2d3450; }
      </style>
      <div class="wc-container">
        
        <div class="wc-visual-area">
          <div class="wc-bar-wrap">
            <div class="wc-bar-lbl">Dividendo</div>
            <div class="wc-bar-track">
              <div class="wc-bar-fill wc-bar-divd">10</div>
            </div>
          </div>
          <div class="wc-bar-wrap">
            <div class="wc-bar-lbl" style="color: #00b894;">Cociente</div>
            <div class="wc-bar-track">
              <div class="wc-bar-fill wc-bar-coc" id="wc-coc-bar">20</div>
            </div>
          </div>
        </div>

        <div class="wc-controls">
          <div class="wc-slider-wrap">
            <label class="wc-label" for="wc-slider"><span>Ajusta el Divisor:</span> <span id="wc-divr-val" style="color:#e17055; font-weight:bold;">0.5</span></label>
            <input type="range" id="wc-slider" class="wc-slider" min="0.1" max="4.0" value="0.5" step="0.1">
          </div>
        </div>

        <div class="wc-footer-text" id="wc-footer">
          10 ÷ <span style="color:#e17055; font-weight:bold;" id="wc-txt-divr">0.5</span> = <span style="color:#00b894; font-weight:bold;" id="wc-txt-coc">20</span><br>
          <span id="wc-txt-logic" style="font-size: 0.85rem; color: #636e72; display: block; margin-top: 0.5rem;">Como el divisor es MENOR que 1, el cociente es MAYOR que 10.</span>
        </div>
      </div>
    `;

    const slider = document.getElementById('wc-slider');
    const divrVal = document.getElementById('wc-divr-val');
    const cocBar = document.getElementById('wc-coc-bar');
    const txtDivr = document.getElementById('wc-txt-divr');
    const txtCoc = document.getElementById('wc-txt-coc');
    const txtLogic = document.getElementById('wc-txt-logic');

    const DIVIDEND = 10;
    const MAX_VISUAL_VAL = 100; // 10 / 0.1 = 100 (Max possible quotient in this widget)

    function update() {
      const divisor = parseFloat(slider.value);
      const quotient = DIVIDEND / divisor;

      // Formatear para no mostrar decimales larguísimos si ocurre
      const formattedQ = Math.round(quotient * 10) / 10;
      const formattedD = divisor.toFixed(1);

      divrVal.textContent = formattedD;
      txtDivr.textContent = formattedD;
      txtCoc.textContent = formattedQ;
      cocBar.textContent = formattedQ;

      // Calcular el ancho de la barra (relativo al máximo visual)
      const widthPct = Math.min((quotient / MAX_VISUAL_VAL) * 100, 100);
      cocBar.style.width = widthPct + "%";

      // Cambiar color y lógica según el tamaño del divisor
      if (divisor < 1) {
        cocBar.style.background = "#00b894"; // Green (Greater)
        txtCoc.style.color = "#00b894";
        txtLogic.innerHTML = `Como el divisor (< 1) es pequeño, el cociente se vuelve <strong>MAYOR</strong> que 10.`;
      } else if (divisor === 1) {
        cocBar.style.background = "#636e72"; // Gray (Equal)
        txtCoc.style.color = "#636e72";
        txtLogic.innerHTML = `El divisor es exactamente 1, el cociente es <strong>IGUAL</strong> a 10.`;
      } else {
        cocBar.style.background = "#e84393"; // Pink/Red (Smaller)
        txtCoc.style.color = "#e84393";
        txtLogic.innerHTML = `Como el divisor (> 1) es grande, el cociente se vuelve <strong>MENOR</strong> que 10.`;
      }
    }

    slider.addEventListener('input', update);
    update();
  }
};