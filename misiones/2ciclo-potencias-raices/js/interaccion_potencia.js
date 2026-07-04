// js/interaccion_potencia.js

window.WidgetPotenciaJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wp-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1.2rem 0; }
        .wp-visual-area { width: 100%; background: #f8f9fa; border: 1.5px dashed #dcdde1; border-radius: 12px; margin-bottom: 1.2rem; padding: 1.5rem 1rem; display: flex; flex-direction: column; gap: 1rem; }
        .wp-bar-wrap { display: flex; align-items: center; gap: 1rem; }
        .wp-bar-lbl { width: 90px; font-family: 'Fredoka', sans-serif; font-size: 0.9rem; color: #2d3436; text-align: right; }
        .wp-bar-track { flex: 1; height: 30px; background: #e2ddd4; border-radius: 6px; position: relative; overflow: hidden; }
        .wp-bar-fill { height: 100%; border-radius: 6px; display: flex; align-items: center; padding: 0 0.5rem; color: white; font-weight: bold; font-family: 'Fira Code', monospace; transition: width 0.2s ease; white-space: nowrap; overflow: hidden; }
        .wp-bar-n { background: #f59e0b; }
        .wp-bar-n2 { background: #7c3aed; }
        .wp-controls { display: flex; flex-direction: column; gap: 1rem; }
        .wp-slider-wrap { width: 100%; }
        .wp-label { font-family: 'Fredoka', sans-serif; font-size: 1rem; color: #2d3436; margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
        .wp-slider { width: 100%; accent-color: #00897b; cursor: pointer; }
        .wp-footer-text { padding: 0.8rem 1rem; border-radius: 8px; font-size: 1rem; color: #1b2838; margin-top: 1rem; text-align: center; background: #f8f9fa; border: 1.5px solid #dcdde1; transition: all 0.3s; }
        [data-theme="dark"] .wp-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wp-visual-area, [data-theme="dark"] .wp-footer-text { background: #0a0d16; border-color: #2d3450; color: #e8f0fe; }
        [data-theme="dark"] .wp-bar-lbl, [data-theme="dark"] .wp-label { color: #e8f0fe; }
        [data-theme="dark"] .wp-bar-track { background: #2d3450; }
      </style>
      <div class="wp-container">

        <div class="wp-visual-area">
          <div class="wp-bar-wrap">
            <div class="wp-bar-lbl">n</div>
            <div class="wp-bar-track">
              <div class="wp-bar-fill wp-bar-n" id="wp-n-bar">1</div>
            </div>
          </div>
          <div class="wp-bar-wrap">
            <div class="wp-bar-lbl" style="color: #7c3aed;">n²</div>
            <div class="wp-bar-track">
              <div class="wp-bar-fill wp-bar-n2" id="wp-n2-bar">1</div>
            </div>
          </div>
        </div>

        <div class="wp-controls">
          <div class="wp-slider-wrap">
            <label class="wp-label" for="wp-slider"><span>Ajusta n:</span> <span id="wp-n-val" style="color:#f59e0b; font-weight:bold;">1</span></label>
            <input type="range" id="wp-slider" class="wp-slider" min="1" max="14" value="1" step="1">
          </div>
        </div>

        <div class="wp-footer-text" id="wp-footer">
          <span id="wp-txt-n" style="color:#f59e0b; font-weight:bold;">1</span>² = <span style="color:#7c3aed; font-weight:bold;" id="wp-txt-n2">1</span><br>
          <span id="wp-txt-logic" style="font-size: 0.85rem; color: #636e72; display: block; margin-top: 0.5rem;">√1 = 1 — la raíz cuadrada deshace la potencia.</span>
        </div>
        <div style="margin-top:1.2rem;">
          <div style="font-family:'Fredoka',sans-serif;font-size:0.95rem;color:#2d3436;margin-bottom:0.5rem;">📊 Tabla de ejemplos (resaltado = valor actual)</div>
          <div style="overflow-x:auto;">
            <table id="wp-tabla" style="width:100%;border-collapse:collapse;font-size:0.85rem;">
              <thead>
                <tr style="background:rgba(124,58,237,0.1);">
                  <th style="padding:0.4rem 0.6rem;border:1px solid #ddd;text-align:left;font-family:'Fredoka',sans-serif;color:#7c3aed;">n</th>
                  <th style="padding:0.4rem 0.6rem;border:1px solid #ddd;text-align:left;font-family:'Fredoka',sans-serif;color:#7c3aed;">n²</th>
                  <th style="padding:0.4rem 0.6rem;border:1px solid #ddd;text-align:left;font-family:'Fredoka',sans-serif;color:#7c3aed;">√(n²)</th>
                </tr>
              </thead>
              <tbody id="wp-tabla-body">
                <tr data-n="2"><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">2</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">4</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">2</td></tr>
                <tr data-n="5"><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">5</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">25</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">5</td></tr>
                <tr data-n="8"><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">8</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">64</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">8</td></tr>
                <tr data-n="11"><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">11</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">121</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">11</td></tr>
                <tr data-n="14"><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">14</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">196</td><td style="padding:0.35rem 0.6rem;border:1px solid #ddd;">14</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    const slider = document.getElementById('wp-slider');
    const nVal = document.getElementById('wp-n-val');
    const nBar = document.getElementById('wp-n-bar');
    const n2Bar = document.getElementById('wp-n2-bar');
    const txtN = document.getElementById('wp-txt-n');
    const txtN2 = document.getElementById('wp-txt-n2');
    const txtLogic = document.getElementById('wp-txt-logic');

    const MAX_N = 14;
    const MAX_N2 = MAX_N * MAX_N;

    function update() {
      const n = parseInt(slider.value);
      const n2 = n * n;

      nVal.textContent = n;
      txtN.textContent = n;
      txtN2.textContent = n2;
      nBar.textContent = n;
      n2Bar.textContent = n2;

      nBar.style.width = Math.max(6, (n / MAX_N) * 100) + '%';
      n2Bar.style.width = Math.max(6, (n2 / MAX_N2) * 100) + '%';

      txtLogic.innerHTML = `√${n2} = ${n} — la raíz cuadrada deshace la potencia.`;
    }

    function highlightTableRow(n) {
      const rows = document.querySelectorAll('#wp-tabla-body tr');
      rows.forEach(row => {
        const rn = parseInt(row.dataset.n);
        row.style.background = rn === n ? 'rgba(124,58,237,0.12)' : '';
        row.style.fontWeight = rn === n ? '700' : '';
      });
    }

    slider.addEventListener('input', () => {
      update();
      highlightTableRow(parseInt(slider.value));
      if (typeof sfx === 'function') sfx('click');
    });
    update();
    highlightTableRow(1);
  }
};
