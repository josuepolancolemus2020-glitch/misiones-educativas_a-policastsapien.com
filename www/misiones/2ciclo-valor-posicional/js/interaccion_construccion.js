// js/interaccion_construccion.js

window.WidgetConstructorJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wc2-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wc2-pred-box { background: linear-gradient(135deg,rgba(108,92,231,0.08),rgba(21,101,192,0.08)); border: 2px solid #6c5ce7; border-radius: 12px; padding: 1rem 1.2rem; margin-bottom: 1.2rem; }
        .wc2-pred-q { font-family: 'Fredoka', sans-serif; font-size: 1rem; color: #1b2838; margin-bottom: 0.7rem; font-weight: 600; }
        .wc2-pred-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .wc2-pred-btn { font-family: 'Fredoka', sans-serif; font-size: 0.82rem; padding: 0.45rem 0.9rem; border: 2px solid #6c5ce7; border-radius: 20px; background: white; color: #6c5ce7; cursor: pointer; transition: all 0.2s; }
        .wc2-pred-btn:hover:not(:disabled) { background: #6c5ce7; color: white; }
        .wc2-pred-btn.wc2-ok { background: #00b894; border-color: #00b894; color: white; }
        .wc2-pred-btn.wc2-no { background: #d63031; border-color: #d63031; color: white; }
        .wc2-pred-fb { font-size: 0.85rem; margin-top: 0.6rem; padding: 0.4rem 0.7rem; border-radius: 8px; display: none; }
        .wc2-pred-fb.show { display: block; }
        .wc2-pred-fb.ok { background: rgba(0,184,148,0.15); color: #006d4e; }
        .wc2-pred-fb.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wc2-display { width: 100%; min-height: 170px; background: #fdfdfd; border: 1.5px dashed #dcdde1; border-radius: 12px; margin-bottom: 1.2rem; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 1rem; }
        .wc2-number { display: flex; gap: 0.35rem; margin-bottom: 0.8rem; flex-wrap: wrap; justify-content: center; }
        .wc2-digit { font-family: 'Fredoka', sans-serif; font-size: 1.7rem; font-weight: 700; padding: 0.4rem 0.6rem; border-radius: 10px; background: rgba(0,0,0,0.04); color: #1b2838; border: 2px solid transparent; transition: all 0.25s; }
        .wc2-digit.wc2-active { border-color: #1565c0; background: rgba(21,101,192,0.12); color: #1565c0; transform: translateY(-4px); }
        .wc2-value { font-size: 1.1rem; color: #00897b; min-height: 1.6rem; font-weight: 700; }
        .wc2-poslabel { font-size: 0.85rem; color: #636e72; min-height: 1.3rem; }
        .wc2-controls { display: flex; flex-direction: column; gap: 1.1rem; }
        .wc2-slider-wrap { width: 100%; }
        .wc2-label { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; color: #2d3436; margin-bottom: 0.5rem; display: flex; justify-content: space-between; }
        .wc2-slider { width: 100%; accent-color: #1565c0; cursor: pointer; }
        .wc2-btn-rnd { font-family: 'Fredoka', sans-serif; background: #00897b; color: white; border: none; padding: 0.6rem 1.2rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: transform 0.2s; align-self: center; }
        .wc2-btn-rnd:hover { transform: translateY(-2px); }
        [data-theme="dark"] .wc2-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wc2-display { background: #0a0d16; border-color: #2d3450; }
        [data-theme="dark"] .wc2-label, [data-theme="dark"] .wc2-digit { color: #e8f0fe; }
        [data-theme="dark"] .wc2-pred-q { color: #e8f0fe; }
        [data-theme="dark"] .wc2-pred-btn { background: #1e2130; }
      </style>
      <div class="wc2-container">
        <div class="wc2-pred-box" id="wc2-pred-box">
          <div class="wc2-pred-q" id="wc2-pred-q">🔮 Cargando predicción...</div>
          <div class="wc2-pred-opts" id="wc2-pred-opts"></div>
          <div class="wc2-pred-fb" id="wc2-pred-fb"></div>
        </div>
        <div class="wc2-display">
          <div class="wc2-number" id="wc2-number"></div>
          <div class="wc2-poslabel" id="wc2-poslabel">Responde la predicción y desliza para explorar</div>
          <div class="wc2-value" id="wc2-value"></div>
        </div>
        <div class="wc2-controls">
          <div class="wc2-slider-wrap">
            <label class="wc2-label" for="wc2-slider"><span>Explorar posición:</span> <span id="wc2-slider-lbl">—</span></label>
            <input type="range" id="wc2-slider" class="wc2-slider" min="0" max="5" value="0" step="1" disabled>
          </div>
          <button class="wc2-btn-rnd" id="wc2-btn-rnd">🔄 Variar número</button>
        </div>
      </div>
    `;

    const POS_LABELS = ['Centena de Millar (C.M)', 'Decena de Millar (D.M)', 'Unidad de Millar (U.M)', 'Centena (C)', 'Decena (D)', 'Unidad (U)'];
    const POS_VALUES = [100000, 10000, 1000, 100, 10, 1];

    const pool = [
      { n: 452318, posA: 0, posB: 5 },
      { n: 706040, posA: 0, posB: 2 },
      { n: 300502, posA: 1, posB: 3 },
      { n: 615932, posA: 2, posB: 4 },
      { n: 999999, posA: 0, posB: 1 },
      { n: 100001, posA: 1, posB: 2 }
    ];
    let currIdx = 0;

    const numberEl = document.getElementById('wc2-number');
    const posLabelEl = document.getElementById('wc2-poslabel');
    const valueEl = document.getElementById('wc2-value');
    const slider = document.getElementById('wc2-slider');
    const sliderLbl = document.getElementById('wc2-slider-lbl');
    const btnRnd = document.getElementById('wc2-btn-rnd');
    const predQEl = document.getElementById('wc2-pred-q');
    const predOptsEl = document.getElementById('wc2-pred-opts');
    const predFbEl = document.getElementById('wc2-pred-fb');

    function digitsOf(n) { return n.toString().padStart(6, '0').split('').map(Number); }
    function fmt(n) { return n.toLocaleString('en-US'); }

    function renderNumber(highlightIdx) {
      const ex = pool[currIdx];
      const digits = digitsOf(ex.n);
      numberEl.innerHTML = '';
      digits.forEach((dgt, i) => {
        const box = document.createElement('div');
        box.className = 'wc2-digit' + (i === highlightIdx ? ' wc2-active' : '');
        box.textContent = dgt;
        numberEl.appendChild(box);
      });
    }

    function updateSlider() {
      const idx = parseInt(slider.value);
      const ex = pool[currIdx];
      const digits = digitsOf(ex.n);
      const dgt = digits[idx];
      const val = dgt * POS_VALUES[idx];
      renderNumber(idx);
      sliderLbl.textContent = POS_LABELS[idx];
      posLabelEl.textContent = `Número: ${fmt(ex.n)} — dígito señalado: ${dgt}`;
      valueEl.textContent = dgt === 0 ? 'Este dígito vale 0 (cero de relleno)' : `Este dígito vale: ${fmt(val)}`;
    }

    function loadPrediction() {
      const ex = pool[currIdx];
      const digits = digitsOf(ex.n);
      const valA = digits[ex.posA] * POS_VALUES[ex.posA];
      const valB = digits[ex.posB] * POS_VALUES[ex.posB];
      const correct = valA > valB ? 'a' : valA < valB ? 'b' : 'igual';
      predQEl.textContent = `🔮 En el número ${fmt(ex.n)}, ¿cuál dígito vale más: el de la posición ${POS_LABELS[ex.posA]} o el de la posición ${POS_LABELS[ex.posB]}?`;
      predOptsEl.innerHTML = `
        <button class="wc2-pred-btn" id="wc2-p-a">El de ${POS_LABELS[ex.posA]}</button>
        <button class="wc2-pred-btn" id="wc2-p-b">El de ${POS_LABELS[ex.posB]}</button>
        <button class="wc2-pred-btn" id="wc2-p-igual">Valen igual</button>`;
      predFbEl.className = 'wc2-pred-fb';
      predFbEl.textContent = '';
      slider.disabled = true;
      slider.value = 0;
      renderNumber(-1);
      posLabelEl.textContent = 'Responde la predicción y desliza para explorar';
      valueEl.textContent = '';

      function handlePred(chosen) {
        document.querySelectorAll('.wc2-pred-btn').forEach(b => { b.disabled = true; });
        const isOk = chosen === correct;
        const clickedBtn = document.getElementById('wc2-p-' + chosen);
        if (clickedBtn) clickedBtn.className = 'wc2-pred-btn ' + (isOk ? 'wc2-ok' : 'wc2-no');
        if (!isOk) {
          const correctBtn = document.getElementById('wc2-p-' + correct);
          if (correctBtn) correctBtn.className = 'wc2-pred-btn wc2-ok';
        }
        const correctLabel = correct === 'igual' ? 'Valen igual' : `El de ${POS_LABELS[correct === 'a' ? ex.posA : ex.posB]} (${fmt(correct === 'a' ? valA : valB)})`;
        predFbEl.textContent = (isOk ? '✔ ¡Correcto! ' : '💡 La respuesta correcta es: ' + correctLabel + '. ') + 'Ahora desliza el control para explorar el valor de cada posición.';
        predFbEl.className = 'wc2-pred-fb show ' + (isOk ? 'ok' : 'err');
        slider.disabled = false;
        if (typeof sfx === 'function') sfx(isOk ? 'ok' : 'no');
      }
      document.getElementById('wc2-p-a').addEventListener('click', () => handlePred('a'));
      document.getElementById('wc2-p-b').addEventListener('click', () => handlePred('b'));
      document.getElementById('wc2-p-igual').addEventListener('click', () => handlePred('igual'));
    }

    slider.addEventListener('input', () => {
      if (typeof sfx === 'function') sfx('click');
      updateSlider();
    });

    btnRnd.addEventListener('click', () => {
      currIdx = (currIdx + 1) % pool.length;
      loadPrediction();
      if (typeof sfx === 'function') sfx('click');
    });

    loadPrediction();
  }
};
