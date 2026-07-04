// js/interaccion_escritura.js
// Widget: Escribe el Número — juego adaptativo de escritura en cifras.
// Se muestra la lectura en palabras y hay que elegir las cifras correctas.
// Nivel 1: miles redondos · Nivel 2: números completos · Nivel 3: trampas de ceros.

window.WidgetEscrituraJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .ws-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .ws-level { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.9rem; flex-wrap: wrap; gap: 0.4rem; }
        .ws-level-tag { font-family: 'Fredoka', sans-serif; font-size: 0.78rem; background: rgba(21,101,192,0.12); color: #1565c0; padding: 0.25rem 0.7rem; border-radius: 20px; font-weight: 700; }
        .ws-streak { font-family: 'Fredoka', sans-serif; font-size: 0.78rem; color: #636e72; }
        .ws-q { font-family: 'Fredoka', sans-serif; font-size: 1.05rem; color: #1b2838; text-align: center; margin-bottom: 1rem; line-height: 1.5; }
        .ws-q .ws-words { display: block; margin-top: 0.4rem; color: #00695c; background: rgba(0,137,123,0.10); border: 2px solid #00897b; border-radius: 12px; padding: 0.55rem 0.9rem; font-weight: 700; font-size: 1.1rem; }
        .ws-opts { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.8rem; }
        .ws-opt { font-family: 'Fira Code', monospace; font-size: 1.15rem; font-weight: 700; padding: 0.55rem 1rem; border: 2px solid #1565c0; border-radius: 12px; background: white; color: #1565c0; cursor: pointer; transition: all 0.2s; text-align: center; }
        .ws-opt:hover:not(:disabled) { background: #1565c0; color: white; }
        .ws-opt.ws-ok { background: #00b894 !important; border-color: #00b894 !important; color: white !important; }
        .ws-opt.ws-no { background: #d63031 !important; border-color: #d63031 !important; color: white !important; }
        .ws-fb { font-size: 0.87rem; padding: 0.5rem 0.8rem; border-radius: 8px; display: none; line-height: 1.45; }
        .ws-fb.show { display: block; }
        .ws-fb.ok { background: rgba(0,184,148,0.15); color: #006d4e; }
        .ws-fb.err { background: rgba(214,48,49,0.10); color: #a00; }
        .ws-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.9rem; flex-wrap: wrap; }
        .ws-btn { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.2rem; border-radius: 12px; cursor: pointer; font-size: 0.9rem; transition: transform 0.2s; }
        .ws-btn:hover { transform: translateY(-2px); }
        [data-theme="dark"] .ws-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .ws-q { color: #e8f0fe; }
        [data-theme="dark"] .ws-q .ws-words { color: #4ebaaa; }
        [data-theme="dark"] .ws-opt { background: #1e2130; }
      </style>
      <div class="ws-container">
        <div class="ws-level">
          <span class="ws-level-tag" id="ws-level-tag">Nivel 1 · Escritor de miles</span>
          <span class="ws-streak" id="ws-streak">Racha: 0 ⭐</span>
        </div>
        <div class="ws-q" id="ws-q"></div>
        <div class="ws-opts" id="ws-opts"></div>
        <div class="ws-fb" id="ws-fb"></div>
        <div class="ws-btn-row">
          <button class="ws-btn" id="ws-btn-next">▶ Siguiente número</button>
        </div>
      </div>
    `;

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

    const LEVELS = [
      { name: 'Nivel 1 · Escritor de miles' },
      { name: 'Nivel 2 · Escritor completo' },
      { name: 'Nivel 3 · Cazador de ceros' }
    ];
    let level = 0, streak = 0, current = null, answered = false;
    const awarded = new Set();

    const qEl = document.getElementById('ws-q');
    const optsEl = document.getElementById('ws-opts');
    const fbEl = document.getElementById('ws-fb');
    const levelTag = document.getElementById('ws-level-tag');
    const streakEl = document.getElementById('ws-streak');

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function fmt(n) { return n.toLocaleString('en-US'); }

    function genNumber() {
      if (level === 0) {
        // Miles redondos: d × 1,000 / 10,000 / 100,000
        const d = rint(2, 9);
        const k = [1000, 10000, 100000][rint(0, 2)];
        return d * k;
      }
      if (level === 1) {
        // Número completo de 5-6 cifras sin trampa fuerte
        return rint(10, 999) * 1000 + rint(100, 999);
      }
      // Nivel 3: trampas de ceros — grupo de miles + solo unidades/decenas (centenas en 0)
      return rint(5, 999) * 1000 + rint(1, 99);
    }

    function genDistractors(n) {
      const cands = [];
      const miles = Math.floor(n / 1000), resto = n % 1000;
      // Errores clásicos primero (trampas de ceros), genéricos después
      if (resto > 0 && resto < 100) cands.push(miles * 1000 + resto * 100); // 90,800 en vez de 90,008
      cands.push(miles * 100 + resto);           // grupo de miles encogido (9,008 en vez de 90,008)
      if (resto >= 100) cands.push(miles * 1000 + Math.floor(resto / 10)); // pierde el cero final
      cands.push(Math.floor(n / 10));            // le falta un cero
      cands.push(n * 10);                        // le sobra un cero
      cands.push(n + 1000);
      cands.push(n - 1000);
      const valid = [];
      for (const v of cands) {
        if (v >= 1 && v <= 999999 && v !== n && !valid.includes(v)) valid.push(v);
        if (valid.length === 2) break;
      }
      return valid;
    }

    function newQuestion() {
      answered = false;
      const n = genNumber();
      current = n;
      qEl.innerHTML = `¿Cómo se escribe en cifras?<span class="ws-words">«${numToWords(n)}»</span>`;
      const options = [n, ...genDistractors(n)];
      options.sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      options.forEach(v => {
        const b = document.createElement('button');
        b.className = 'ws-opt';
        b.textContent = fmt(v);
        b.addEventListener('click', () => answer(v, b));
        optsEl.appendChild(b);
      });
      fbEl.className = 'ws-fb';
      fbEl.textContent = '';
      levelTag.textContent = LEVELS[level].name;
    }

    function answer(v, btn) {
      if (answered) return;
      answered = true;
      const n = current;
      const isOk = v === n;
      optsEl.querySelectorAll('.ws-opt').forEach(b => { b.disabled = true; });
      btn.classList.add(isOk ? 'ws-ok' : 'ws-no');
      if (!isOk) {
        optsEl.querySelectorAll('.ws-opt').forEach(b => { if (b.textContent === fmt(n)) b.classList.add('ws-ok'); });
      }
      const miles = Math.floor(n / 1000), resto = n % 1000;
      const desglose = miles > 0
        ? `Grupo de miles: ${miles} → ${fmt(miles * 1000)} · Grupo de unidades: ${resto.toString().padStart(3, '0')}`
        : `Solo grupo de unidades: ${resto}`;
      if (isOk) {
        streak++;
        fbEl.textContent = `✔ ¡Correcto! ${fmt(n)}. ${desglose}.`;
        fbEl.className = 'ws-fb show ok';
        if (typeof sfx === 'function') sfx('ok');
        if (!awarded.has(n) && typeof pts === 'function') { awarded.add(n); pts(2); }
        if (streak % 3 === 0 && level < LEVELS.length - 1) {
          level++;
          if (typeof showToast === 'function') showToast('🎯 ¡Subiste a ' + LEVELS[level].name + '!');
          if (typeof sfx === 'function') sfx('up');
        }
      } else {
        streak = 0;
        if (level > 0) level--;
        fbEl.textContent = `💡 La respuesta es ${fmt(n)}. ${desglose}. Recuerda: los ceros de relleno conservan el lugar de cada cifra.`;
        fbEl.className = 'ws-fb show err';
        if (typeof sfx === 'function') sfx('no');
      }
      streakEl.textContent = `Racha: ${streak} ⭐`;
    }

    document.getElementById('ws-btn-next').addEventListener('click', () => {
      if (typeof sfx === 'function') sfx('click');
      newQuestion();
    });

    newQuestion();
  }
};
