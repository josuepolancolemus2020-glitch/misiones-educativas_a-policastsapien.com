// js/interaccion_x10.js
// Widget: La Máquina ×10 — al multiplicar por 10, cada cifra se desplaza una
// posición a la izquierda en la tabla posicional; ÷10 lo deshace.
// Incluye predicción antes de la primera multiplicación.

window.WidgetX10JSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wx-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wx-table { display: flex; justify-content: center; gap: 0.35rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .wx-col { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
        .wx-pos-lbl { font-family: 'Fredoka', sans-serif; font-size: 0.68rem; color: #636e72; font-weight: 700; }
        .wx-cell { font-family: 'Fredoka', sans-serif; font-size: 1.5rem; font-weight: 700; width: 44px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: 2px dashed #dcdde1; color: #b0bec5; background: transparent; transition: all 0.3s; }
        .wx-cell.wx-filled { border: 2px solid #1565c0; background: rgba(21,101,192,0.10); color: #1565c0; }
        .wx-cell.wx-shift { animation: wxSlide 0.45s ease; }
        @keyframes wxSlide { 0% { transform: translateX(28px); opacity: 0.2; } 100% { transform: none; opacity: 1; } }
        .wx-cell.wx-shift-r { animation: wxSlideR 0.45s ease; }
        @keyframes wxSlideR { 0% { transform: translateX(-28px); opacity: 0.2; } 100% { transform: none; opacity: 1; } }
        .wx-value { font-family: 'Fira Code', monospace; font-size: 1.35rem; font-weight: 700; color: #1565c0; text-align: center; margin-bottom: 0.8rem; }
        .wx-pred { background: linear-gradient(135deg, rgba(108,92,231,0.08), rgba(21,101,192,0.08)); border: 2px solid #6c5ce7; border-radius: 12px; padding: 0.9rem 1.1rem; margin-bottom: 1rem; }
        .wx-pred-q { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; color: #1b2838; margin-bottom: 0.6rem; font-weight: 600; }
        .wx-pred-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .wx-pred-btn { font-family: 'Fredoka', sans-serif; font-size: 0.9rem; padding: 0.45rem 1rem; border: 2px solid #6c5ce7; border-radius: 20px; background: white; color: #6c5ce7; cursor: pointer; transition: all 0.2s; }
        .wx-pred-btn:hover:not(:disabled) { background: #6c5ce7; color: white; }
        .wx-pred-btn.wx-ok { background: #00b894; border-color: #00b894; color: white; }
        .wx-pred-btn.wx-no { background: #d63031; border-color: #d63031; color: white; }
        .wx-msg { font-size: 0.88rem; text-align: center; color: #636e72; min-height: 2.2rem; padding: 0.4rem 0.6rem; border-radius: 8px; line-height: 1.45; }
        .wx-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wx-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wx-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.9rem; flex-wrap: wrap; }
        .wx-btn { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wx-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .wx-btn:disabled { opacity: 0.45; cursor: default; }
        .wx-btn.wx-btn-teal { background: #00897b; }
        .wx-btn.wx-btn-amber { background: #f59e0b; }
        [data-theme="dark"] .wx-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wx-pred-q { color: #e8f0fe; }
        [data-theme="dark"] .wx-pred-btn { background: #1e2130; }
        [data-theme="dark"] .wx-cell { border-color: #2d3450; color: #4a5568; }
        [data-theme="dark"] .wx-cell.wx-filled { background: rgba(21,101,192,0.25); color: #74b9ff; }
        [data-theme="dark"] .wx-msg { color: #a0aec0; }
      </style>
      <div class="wx-container">
        <div class="wx-table" id="wx-table"></div>
        <div class="wx-value" id="wx-value"></div>
        <div class="wx-pred" id="wx-pred" style="display:none;">
          <div class="wx-pred-q" id="wx-pred-q"></div>
          <div class="wx-pred-opts" id="wx-pred-opts"></div>
        </div>
        <div class="wx-msg" id="wx-msg"></div>
        <div class="wx-btn-row">
          <button class="wx-btn" id="wx-btn-mul">⚡ Multiplicar ×10</button>
          <button class="wx-btn wx-btn-teal" id="wx-btn-div" disabled>↩ Dividir ÷10</button>
          <button class="wx-btn wx-btn-amber" id="wx-btn-new">🔄 Otro número</button>
        </div>
      </div>
    `;

    const POS_LABELS = ['C.M', 'D.M', 'U.M', 'C', 'D', 'U'];
    const tableEl = document.getElementById('wx-table');
    const valueEl = document.getElementById('wx-value');
    const msgEl = document.getElementById('wx-msg');
    const predEl = document.getElementById('wx-pred');
    const predQEl = document.getElementById('wx-pred-q');
    const predOptsEl = document.getElementById('wx-pred-opts');
    const btnMul = document.getElementById('wx-btn-mul');
    const btnDiv = document.getElementById('wx-btn-div');
    const btnNew = document.getElementById('wx-btn-new');

    let baseN = 37, value = 37, predicted = false;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function fmt(n) { return n.toLocaleString('en-US'); }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wx-msg' + (cls ? ' ' + cls : ''); }

    function renderTable(shiftDir) {
      const s = value.toString().padStart(6, ' ');
      tableEl.innerHTML = '';
      for (let i = 0; i < 6; i++) {
        const ch = s[i];
        const col = document.createElement('div');
        col.className = 'wx-col';
        const filled = ch !== ' ';
        const shiftCls = filled && shiftDir === 'left' ? ' wx-shift' : filled && shiftDir === 'right' ? ' wx-shift-r' : '';
        col.innerHTML = `<span class="wx-pos-lbl">${POS_LABELS[i]}</span><div class="wx-cell${filled ? ' wx-filled' : ''}${shiftCls}">${filled ? ch : ''}</div>`;
        tableEl.appendChild(col);
      }
      valueEl.textContent = fmt(value);
      btnMul.disabled = !predicted || value * 10 > 999999;
      btnDiv.disabled = value % 10 !== 0 || value < 10;
    }

    function showPrediction() {
      predicted = false;
      predEl.style.display = 'block';
      predQEl.textContent = `🔮 ¿Cuánto es ${fmt(baseN)} × 10?`;
      const options = [baseN * 10];
      [baseN + 10, baseN * 100].forEach(v => {
        if (options.length < 3 && v <= 999999 && !options.includes(v)) options.push(v);
      });
      while (options.length < 3) options.push(baseN * 10 + 10 * options.length);
      options.sort(() => Math.random() - 0.5);
      predOptsEl.innerHTML = '';
      options.forEach(v => {
        const b = document.createElement('button');
        b.className = 'wx-pred-btn';
        b.textContent = fmt(v);
        b.addEventListener('click', () => {
          if (predicted) return;
          predicted = true;
          predOptsEl.querySelectorAll('.wx-pred-btn').forEach(x => { x.disabled = true; });
          const isOk = v === baseN * 10;
          b.classList.add(isOk ? 'wx-ok' : 'wx-no');
          if (!isOk) predOptsEl.querySelectorAll('.wx-pred-btn').forEach(x => { if (x.textContent === fmt(baseN * 10)) x.classList.add('wx-ok'); });
          if (isOk) {
            setMsg(`✔ ¡Correcto! Multiplicar por 10 <strong>no cambia las cifras</strong>: solo las mueve una posición a la izquierda. Presiona <strong>×10</strong> para verlo.`, 'ok');
            if (typeof sfx === 'function') sfx('ok');
            if (!awarded.has(baseN) && typeof pts === 'function') { awarded.add(baseN); pts(2); }
          } else {
            setMsg(`💡 Es <strong>${fmt(baseN * 10)}</strong>: cada cifra se mueve UNA posición a la izquierda y aparece un cero en las unidades. Presiona <strong>×10</strong> para verlo.`, 'err');
            if (typeof sfx === 'function') sfx('no');
          }
          renderTable(null);
        });
        predOptsEl.appendChild(b);
      });
    }

    btnMul.addEventListener('click', () => {
      if (value * 10 > 999999) return;
      value *= 10;
      renderTable('left');
      setMsg(`⚡ ${fmt(value / 10)} × 10 = <strong>${fmt(value)}</strong>. Cada cifra ahora vale <strong>10 veces más</strong> porque subió una posición.`, 'ok');
      if (typeof sfx === 'function') sfx(value * 10 > 999999 ? 'fan' : 'flip');
    });

    btnDiv.addEventListener('click', () => {
      if (value % 10 !== 0 || value < 10) return;
      value = value / 10;
      renderTable('right');
      setMsg(`↩ ${fmt(value * 10)} ÷ 10 = <strong>${fmt(value)}</strong>. Dividir entre 10 <strong>deshace</strong> la multiplicación: cada cifra bajó una posición.`, 'ok');
      if (typeof sfx === 'function') sfx('flip');
    });

    btnNew.addEventListener('click', () => {
      if (typeof sfx === 'function') sfx('click');
      let n;
      do { n = rint(11, 99); } while (n === baseN || n % 10 === 0);
      baseN = n; value = n;
      setMsg('Primero predice el resultado, luego usa las máquinas.');
      showPrediction();
      renderTable(null);
    });

    setMsg('Primero predice el resultado, luego usa las máquinas.');
    showPrediction();
    renderTable(null);
  }
};
