// js/interaccion_lector.js
// Widget: El Gran Lector — construye un número con flechas por posición
// y observa en vivo cómo se escribe con palabras. Señala los ceros de relleno.

window.WidgetLectorJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wl-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wl-board { display: flex; justify-content: center; gap: 0.4rem; margin-bottom: 1.1rem; flex-wrap: wrap; }
        .wl-col { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
        .wl-pos-lbl { font-family: 'Fredoka', sans-serif; font-size: 0.68rem; color: #636e72; font-weight: 700; }
        .wl-step { font-family: 'Fredoka', sans-serif; width: 40px; height: 24px; border: 1.5px solid #1565c0; border-radius: 8px; background: white; color: #1565c0; cursor: pointer; font-size: 0.8rem; transition: all 0.15s; }
        .wl-step:hover { background: #1565c0; color: white; }
        .wl-digit { font-family: 'Fredoka', sans-serif; font-size: 1.6rem; font-weight: 700; width: 44px; height: 52px; display: flex; align-items: center; justify-content: center; border-radius: 10px; background: rgba(21,101,192,0.10); border: 2px solid #1565c0; color: #1565c0; transition: all 0.25s; }
        .wl-digit.wl-lead { opacity: 0.3; border-style: dashed; }
        .wl-digit.wl-zero-fill { background: rgba(245,158,11,0.18); border-color: #f59e0b; color: #b45309; }
        .wl-value { font-family: 'Fira Code', monospace; font-size: 1.5rem; font-weight: 700; color: #1565c0; text-align: center; margin-bottom: 0.5rem; }
        .wl-words { font-family: 'Fredoka', sans-serif; font-size: 1.05rem; color: #00695c; background: rgba(0,137,123,0.10); border: 2px solid #00897b; border-radius: 12px; padding: 0.7rem 1rem; text-align: center; min-height: 2.8rem; line-height: 1.5; margin-bottom: 0.7rem; }
        .wl-note { font-size: 0.8rem; color: #636e72; text-align: center; min-height: 1.3rem; }
        .wl-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.9rem; flex-wrap: wrap; }
        .wl-btn { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wl-btn:hover { transform: translateY(-2px); }
        .wl-btn.wl-btn-teal { background: #00897b; }
        [data-theme="dark"] .wl-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wl-step { background: #1e2130; }
        [data-theme="dark"] .wl-digit { background: rgba(21,101,192,0.25); color: #74b9ff; }
        [data-theme="dark"] .wl-words { color: #4ebaaa; }
      </style>
      <div class="wl-container">
        <div class="wl-board" id="wl-board"></div>
        <div class="wl-value" id="wl-value">0</div>
        <div class="wl-words" id="wl-words">cero</div>
        <div class="wl-note" id="wl-note">Usa las flechas ▲▼ para cambiar cada cifra y mira cómo cambia la lectura.</div>
        <div class="wl-btn-row">
          <button class="wl-btn" id="wl-btn-rnd">🎲 Número sorpresa</button>
          <button class="wl-btn wl-btn-teal" id="wl-btn-zero">🔄 Poner en cero</button>
        </div>
      </div>
    `;

    const POS_LABELS = ['C.M', 'D.M', 'U.M', 'C', 'D', 'U'];
    let digits = [0, 0, 0, 0, 0, 0];

    // --- Número a palabras en español (0 a 999,999) ---
    const UNITS = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'];
    const TENS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const HUNDREDS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

    function threeDigits(x, apocope) {
      if (x === 0) return '';
      if (x === 100) return 'cien';
      const out = [];
      const h = Math.floor(x / 100), rest = x % 100;
      if (h) out.push(HUNDREDS[h]);
      if (rest) {
        if (rest < 30) {
          let w = UNITS[rest];
          if (apocope) { if (rest === 1) w = 'un'; else if (rest === 21) w = 'veintiún'; }
          out.push(w);
        } else {
          const t = Math.floor(rest / 10), u = rest % 10;
          if (u) {
            let uw = UNITS[u];
            if (apocope && u === 1) uw = 'un';
            out.push(TENS[t] + ' y ' + uw);
          } else out.push(TENS[t]);
        }
      }
      return out.join(' ');
    }

    function numToWords(n) {
      if (n === 0) return 'cero';
      const miles = Math.floor(n / 1000), resto = n % 1000;
      const parts = [];
      if (miles === 1) parts.push('mil');
      else if (miles > 1) parts.push(threeDigits(miles, true) + ' mil');
      if (resto) parts.push(threeDigits(resto, false));
      return parts.join(' ');
    }
    // ---------------------------------------------------

    const boardEl = document.getElementById('wl-board');
    const valueEl = document.getElementById('wl-value');
    const wordsEl = document.getElementById('wl-words');
    const noteEl = document.getElementById('wl-note');

    function currentValue() { return digits.reduce((acc, d) => acc * 10 + d, 0); }

    function render() {
      const n = currentValue();
      // Índice de la primera cifra significativa (para atenuar ceros a la izquierda)
      let firstSig = digits.findIndex(d => d !== 0);
      if (firstSig === -1) firstSig = 5;
      boardEl.innerHTML = '';
      digits.forEach((d, i) => {
        const col = document.createElement('div');
        col.className = 'wl-col';
        const isLead = i < firstSig;
        const isZeroFill = d === 0 && !isLead && i < 5 || (d === 0 && i === 5 && n > 0 && !isLead);
        col.innerHTML = `
          <span class="wl-pos-lbl">${POS_LABELS[i]}</span>
          <button class="wl-step" data-dir="1" data-pos="${i}" aria-label="Subir ${POS_LABELS[i]}">▲</button>
          <div class="wl-digit${isLead ? ' wl-lead' : ''}${isZeroFill ? ' wl-zero-fill' : ''}">${d}</div>
          <button class="wl-step" data-dir="-1" data-pos="${i}" aria-label="Bajar ${POS_LABELS[i]}">▼</button>`;
        boardEl.appendChild(col);
      });
      boardEl.querySelectorAll('.wl-step').forEach(btn => {
        btn.addEventListener('click', () => {
          const pos = parseInt(btn.dataset.pos), dir = parseInt(btn.dataset.dir);
          digits[pos] = (digits[pos] + dir + 10) % 10;
          if (typeof sfx === 'function') sfx('click');
          render();
        });
      });
      valueEl.textContent = n.toLocaleString('en-US');
      wordsEl.textContent = numToWords(n);
      const hasZeroFill = digits.some((d, i) => d === 0 && i > firstSig);
      if (n === 0) noteEl.textContent = 'Usa las flechas ▲▼ para cambiar cada cifra y mira cómo cambia la lectura.';
      else if (hasZeroFill) noteEl.textContent = '🟠 Las casillas anaranjadas son ceros de relleno: ocupan el lugar para que las otras cifras no pierdan su valor.';
      else noteEl.textContent = 'Ninguna posición está vacía. ¡Prueba poner alguna cifra en 0 para ver un cero de relleno!';
    }

    document.getElementById('wl-btn-rnd').addEventListener('click', () => {
      const n = Math.floor(Math.random() * 999000) + 1000; // 1,000 a 999,999
      const s = n.toString().padStart(6, '0');
      digits = s.split('').map(Number);
      if (typeof sfx === 'function') sfx('flip');
      render();
    });
    document.getElementById('wl-btn-zero').addEventListener('click', () => {
      digits = [0, 0, 0, 0, 0, 0];
      if (typeof sfx === 'function') sfx('click');
      render();
    });

    render();
  }
};
