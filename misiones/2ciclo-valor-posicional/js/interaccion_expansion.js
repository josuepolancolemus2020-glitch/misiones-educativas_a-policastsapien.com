// js/interaccion_expansion.js

window.WidgetExpansionJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .we-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1.2rem 0; }
        .we-visual-area { width: 100%; background: #f8f9fa; border: 1.5px dashed #dcdde1; border-radius: 12px; margin-bottom: 1.2rem; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 1rem; }
        .we-bar-wrap { display: flex; align-items: center; gap: 1rem; }
        .we-bar-lbl { width: 110px; font-family: 'Fredoka', sans-serif; font-size: 0.85rem; color: #2d3436; text-align: right; }
        .we-bar-track { flex: 1; height: 30px; background: #e2ddd4; border-radius: 6px; position: relative; overflow: hidden; }
        .we-bar-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; padding: 0 0.5rem; color: white; font-weight: bold; font-family: 'Fira Code', monospace; transition: width 0.2s ease, background 0.3s ease; white-space: nowrap; overflow: hidden; }
        .we-bar-fijo { background: #636e72; }
        .we-bar-total { background: #1565c0; }
        .we-controls { display: flex; flex-direction: column; gap: 1rem; }
        .we-slider-wrap { width: 100%; }
        .we-label { font-family: 'Fredoka', sans-serif; font-size: 1rem; color: #2d3436; margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
        .we-slider { width: 100%; accent-color: #00897b; cursor: pointer; }
        .we-footer-text { padding: 0.8rem 1rem; border-radius: 8px; font-size: 1rem; color: #1b2838; margin-top: 1rem; text-align: center; background: #f8f9fa; border: 1.5px solid #dcdde1; transition: all 0.3s; }
        [data-theme="dark"] .we-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .we-visual-area, [data-theme="dark"] .we-footer-text { background: #0a0d16; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .we-bar-lbl, [data-theme="dark"] .we-label { color: #e8f0fe; }
        [data-theme="dark"] .we-bar-track { background: #2d3450; }
      </style>
      <div class="we-container">

        <div class="we-visual-area">
          <div class="we-bar-wrap">
            <div class="we-bar-lbl">Valor fijo</div>
            <div class="we-bar-track">
              <div class="we-bar-fill we-bar-fijo" id="we-fijo-bar">300,502</div>
            </div>
          </div>
          <div class="we-bar-wrap">
            <div class="we-bar-lbl" style="color: #1565c0;">Número total</div>
            <div class="we-bar-track">
              <div class="we-bar-fill we-bar-total" id="we-total-bar">300,502</div>
            </div>
          </div>
        </div>

        <div class="we-controls">
          <div class="we-slider-wrap">
            <label class="we-label" for="we-slider"><span>Ajusta el dígito de la Decena de Millar:</span> <span id="we-digit-val" style="color:#00897b; font-weight:bold;">0</span></label>
            <input type="range" id="we-slider" class="we-slider" min="0" max="9" value="0" step="1">
          </div>
        </div>

        <div class="we-footer-text" id="we-footer">
          300,502 + (<span id="we-txt-digit" style="color:#00897b; font-weight:bold;">0</span> × 10,000) = <span style="color:#1565c0; font-weight:bold;" id="we-txt-total">300,502</span><br>
          <span id="we-txt-logic" style="font-size: 0.85rem; color: #636e72; display: block; margin-top: 0.5rem;">El dígito de las Decenas de Millar está en 0: no suma nada extra.</span>
        </div>
        <div style="margin-top:1.2rem;">
          <div style="font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#2d3436;margin-bottom:0.5rem;">📊 Tabla de ejemplos (resaltado = valor actual)</div>
          <div style="overflow-x:auto;">
            <table id="we-tabla" style="width:100%;border-collapse:collapse;font-size:0.85rem;">
              <thead>
                <tr style="background:rgba(21,101,192,0.1);">
                  <th style="padding:0.4rem 0.6rem;border:1px solid #ddd;text-align:left;font-family:'Fredoka',sans-serif;color:#1565c0;">Dígito</th>
                  <th style="padding:0.4rem 0.6rem;border:1px solid #ddd;text-align:left;font-family:'Fredoka',sans-serif;color:#1565c0;">Aporta</th>
                  <th style="padding:0.4rem 0.6rem;border:1px solid #ddd;text-align:left;font-family:'Fredoka',sans-serif;color:#1565c0;">Número total</th>
                </tr>
              </thead>
              <tbody id="we-tabla-body">
                <tr data-d="0"><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">0</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">+0</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">300,502</td></tr>
                <tr data-d="3"><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">3</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">+30,000</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">330,502</td></tr>
                <tr data-d="5"><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">5</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">+50,000</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">350,502</td></tr>
                <tr data-d="7"><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">7</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">+70,000</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">370,502</td></tr>
                <tr data-d="9"><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">9</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">+90,000</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">390,502</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    const slider = document.getElementById('we-slider');
    const digitVal = document.getElementById('we-digit-val');
    const totalBar = document.getElementById('we-total-bar');
    const txtDigit = document.getElementById('we-txt-digit');
    const txtTotal = document.getElementById('we-txt-total');
    const txtLogic = document.getElementById('we-txt-logic');

    const FIXED_VALUE = 300502;
    const PLACE_VALUE = 10000;
    const MAX_TOTAL = FIXED_VALUE + 9 * PLACE_VALUE;

    function fmt(n) { return n.toLocaleString('en-US'); }

    function update() {
      const digit = parseInt(slider.value);
      const total = FIXED_VALUE + digit * PLACE_VALUE;

      digitVal.textContent = digit;
      txtDigit.textContent = digit;
      txtTotal.textContent = fmt(total);
      totalBar.textContent = fmt(total);

      const widthPct = Math.min((total / MAX_TOTAL) * 100, 100);
      totalBar.style.width = widthPct + '%';

      if (digit === 0) {
        txtLogic.innerHTML = `El dígito de las Decenas de Millar está en 0: no suma nada extra.`;
      } else {
        txtLogic.innerHTML = `Cada vez que aumentas 1 en esta posición (Decena de Millar), el número crece en <strong>10,000</strong>.`;
      }
    }

    function highlightTableRow(digit) {
      const rows = document.querySelectorAll('#we-tabla-body tr');
      let closestRow = null; let minDist = Infinity;
      rows.forEach(row => {
        const d = parseInt(row.dataset.d);
        const dist = Math.abs(d - digit);
        if (dist < minDist) { minDist = dist; closestRow = row; }
      });
      rows.forEach(row => { row.style.background = ''; row.style.fontWeight = ''; });
      if (closestRow && minDist === 0) {
        closestRow.style.background = 'rgba(21,101,192,0.12)';
        closestRow.style.fontWeight = '700';
      }
    }

    slider.addEventListener('input', () => {
      update();
      highlightTableRow(parseInt(slider.value));
      if (typeof sfx === 'function') sfx('click');
    });
    update();
    highlightTableRow(0);
  }
};
