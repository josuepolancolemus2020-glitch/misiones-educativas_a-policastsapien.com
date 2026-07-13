// js/interaccion_lector.js
// Lab 2: El Gran Lector por Períodos — el número se parte en bloques de 3 cifras;
// el estudiante toca cada bloque (de izquierda a derecha) y descubre su lectura.

window.WidgetLectorJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wlc-box { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.2rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wlc-chips { display: flex; gap: 0.4rem; justify-content: center; align-items: flex-end; flex-wrap: wrap; margin-bottom: 0.8rem; }
        .wlc-chip { border: 2.5px solid; border-radius: 12px; padding: 0.4rem 0.7rem; cursor: pointer; text-align: center; background: white; transition: transform 0.15s; min-width: 74px; }
        .wlc-chip:hover { transform: translateY(-3px); }
        .wlc-chip-per { font-family: 'Fredoka', sans-serif; font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
        .wlc-chip-num { font-family: 'Fira Code', monospace; font-size: 1.6rem; font-weight: 700; color: #1b2838; }
        .wlc-chip.per-mi { border-color: #6c5ce7; } .wlc-chip.per-mi .wlc-chip-per { color: #6c5ce7; }
        .wlc-chip.per-ml { border-color: #00838f; } .wlc-chip.per-ml .wlc-chip-per { color: #00838f; }
        .wlc-chip.per-un { border-color: #1565c0; } .wlc-chip.per-un .wlc-chip-per { color: #1565c0; }
        .wlc-chip.wlc-leido { background: rgba(0,184,148,0.10); border-color: #00b894 !important; }
        .wlc-coma { font-family: 'Fira Code', monospace; font-size: 2rem; font-weight: 700; color: #d63031; align-self: flex-end; padding-bottom: 0.3rem; }
        .wlc-lectura { min-height: 2.6rem; font-size: 0.95rem; text-align: center; font-family: 'Fredoka', sans-serif; color: #0d47a1; background: rgba(21,101,192,0.08); border-radius: 10px; padding: 0.5rem 0.7rem; line-height: 1.45; margin-bottom: 0.7rem; }
        .wlc-actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
        .wlc-act { font-family: 'Fredoka', sans-serif; font-size: 0.85rem; padding: 0.45rem 1.1rem; border: none; border-radius: 18px; cursor: pointer; font-weight: 700; color: white; background: #1565c0; }
        .wlc-msg { font-size: 0.82rem; text-align: center; color: #636e72; margin-top: 0.55rem; min-height: 1.2rem; }
        [data-theme="dark"] .wlc-box { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wlc-chip { background: #1e2130; }
        [data-theme="dark"] .wlc-chip-num { color: #e8f0fe; }
        [data-theme="dark"] .wlc-lectura { color: #90caf9; }
      </style>
      <div class="wlc-box">
        <div class="wlc-chips" id="wlc-chips"></div>
        <div class="wlc-lectura" id="wlc-lectura">👆 Toca los bloques de IZQUIERDA a DERECHA para leer el número por partes.</div>
        <div class="wlc-actions"><button class="wlc-act" id="wlc-new">🔀 Nuevo número</button></div>
        <div class="wlc-msg" id="wlc-msg">🔑 Regla de oro: cada bloque de 3 cifras se lee normal y se le agrega el apellido del período.</div>
      </div>
    `;

    let bloques = [], leidos = 0, partes = [];
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function words(n) { return (typeof numToWords === 'function') ? numToWords(n) : String(n); }

    function newNumber() {
      // 4 a 9 cifras: a veces con período de miles "limpio" (terminado en 000)
      const nd = [4, 5, 6, 6, 7, 8, 9][rint(0, 6)];
      let n = rint(Math.pow(10, nd - 1), Math.pow(10, nd) - 1);
      if (rint(0, 2) === 0) n = Math.floor(n / 1000) * 1000; // termina en 000: reto de los ceros
      const mi = Math.floor(n / 1000000), ml = Math.floor((n % 1000000) / 1000), un = n % 1000;
      bloques = [];
      if (mi) bloques.push({ v: mi, per: 'millones', cls: 'per-mi', lect: (mi === 1 ? 'un millón' : words(mi * 1000000)) });
      if (mi || ml) bloques.push({ v: ml, per: 'miles', cls: 'per-ml', lect: ml === 0 ? '(cero miles: no se lee nada)' : words(ml * 1000) });
      bloques.push({ v: un, per: 'unidades', cls: 'per-un', lect: un === 0 ? '(cero unidades: no se lee nada)' : words(un) });
      leidos = 0; partes = [];
      const chips = document.getElementById('wlc-chips'); chips.innerHTML = '';
      bloques.forEach((b, i) => {
        if (i > 0) { const c = document.createElement('span'); c.className = 'wlc-coma'; c.textContent = ','; chips.appendChild(c); }
        const chip = document.createElement('div');
        chip.className = 'wlc-chip ' + b.cls;
        chip.innerHTML = `<div class="wlc-chip-per">${b.per}</div><div class="wlc-chip-num">${i === 0 ? b.v : String(b.v).padStart(3, '0')}</div>`;
        chip.onclick = () => leer(chip, i);
        chips.appendChild(chip);
      });
      document.getElementById('wlc-lectura').textContent = '👆 Toca los bloques de IZQUIERDA a DERECHA para leer el número por partes.';
      document.getElementById('wlc-msg').textContent = '🔑 Regla de oro: cada bloque de 3 cifras se lee normal y se le agrega el apellido del período.';
    }

    function leer(chip, i) {
      if (chip.classList.contains('wlc-leido')) return;
      if (i !== leidos) { if (typeof sfx === 'function') sfx('no'); document.getElementById('wlc-msg').textContent = '⚠️ Los números grandes se leen de IZQUIERDA a derecha: toca primero el bloque más grande.'; return; }
      if (typeof sfx === 'function') sfx('click');
      chip.classList.add('wlc-leido');
      leidos++;
      const b = bloques[i];
      if (!b.lect.startsWith('(')) partes.push(b.lect);
      document.getElementById('wlc-lectura').innerHTML = '📖 ' + partes.join(' ') + (leidos < bloques.length ? ' …' : '');
      document.getElementById('wlc-msg').innerHTML = `Bloque «${b.per}»: <strong>${b.lect}</strong>`;
      if (leidos === bloques.length) {
        const total = bloques.reduce((acc, x) => acc * 1000 + x.v, 0);
        document.getElementById('wlc-lectura').innerHTML = `✔ <strong>${total.toLocaleString('en-US')}</strong> se lee: «<strong>${words(total)}</strong>»`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 5 && typeof pts === 'function') { awarded.add('a' + awarded.size); pts(2); document.getElementById('wlc-msg').textContent = '⭐ +2 XP · ¡Pide un nuevo número!'; }
      }
    }

    document.getElementById('wlc-new').onclick = () => { if (typeof sfx === 'function') sfx('click'); newNumber(); };
    newNumber();
  }
};
