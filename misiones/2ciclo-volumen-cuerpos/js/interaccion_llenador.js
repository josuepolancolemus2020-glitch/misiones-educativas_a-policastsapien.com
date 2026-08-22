// js/interaccion_llenador.js
// Widget: El Llenador de Cubitos. La fórmula largo × ancho × alto se aprende
// de memoria y se olvida; llenando la caja capa por capa se ve que solo está
// contando cubitos, y eso ya no se olvida. Es el paso que en el aula se hace
// con tapitas y cajas de fósforos cuando hay tiempo, y casi nunca lo hay.

window.WidgetLlenadorJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wll-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wll-ctrl { display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap; margin-bottom:0.7rem; }
        .wll-campo { display:flex; flex-direction:column; align-items:center; gap:0.15rem; }
        .wll-campo label { font-size:0.72rem; color:#636e72; font-family:'Fredoka',sans-serif; }
        .wll-campo select { padding:0.3rem 0.5rem; border:2px solid #cfd8dc; border-radius:8px; font-family:'Fira Code',monospace; font-size:0.95rem; background:#fff; color:#1b2838; }
        .wll-caja { display:flex; flex-direction:column; align-items:center; gap:3px; margin-bottom:0.5rem; min-height:70px; justify-content:flex-end; }
        .wll-capa { display:grid; gap:2px; padding:2px; border-radius:4px; background:rgba(21,101,192,0.08); animation:wllCae 0.35s ease; }
        @keyframes wllCae { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:none; } }
        .wll-cubo { width:13px; height:13px; background:#64b5f6; border-radius:2px; }
        .wll-cuenta { font-family:'Fredoka',sans-serif; font-size:0.85rem; text-align:center; color:#636e72; margin-bottom:0.5rem; }
        .wll-btns { display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap; }
        .wll-btn { font-family:'Fredoka',sans-serif; font-size:0.88rem; padding:0.45rem 1rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; }
        .wll-btn:hover:not(:disabled) { background:#1565c0; color:#fff; }
        .wll-btn:disabled { opacity:0.45; cursor:default; }
        .wll-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wll-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        [data-theme="dark"] .wll-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wll-campo select { background:#161a26; color:#e8f0fe; border-color:#2d3450; }
        [data-theme="dark"] .wll-btn { background:#1e2130; color:#74b9ff; }
        [data-theme="dark"] .wll-msg { color:#a0aec0; }
        [data-theme="dark"] .wll-msg.ok { color:#7dedc9; }
      </style>
      <div class="wll-container">
        <div class="wll-ctrl">
          <div class="wll-campo"><label>largo (cm)</label><select id="wll-l"></select></div>
          <div class="wll-campo"><label>ancho (cm)</label><select id="wll-a"></select></div>
          <div class="wll-campo"><label>alto (cm)</label><select id="wll-h"></select></div>
        </div>
        <div class="wll-caja" id="wll-caja"></div>
        <div class="wll-cuenta" id="wll-cuenta"></div>
        <div class="wll-btns">
          <button class="wll-btn" id="wll-capa">➕ Poner una capa</button>
          <button class="wll-btn" id="wll-todo">⚡ Llenarla</button>
          <button class="wll-btn" id="wll-vaciar">↩️ Vaciar</button>
        </div>
        <div class="wll-msg" id="wll-msg">Elige las medidas y ve llenando la caja con cubitos de 1 cm³.</div>
      </div>`;

    const lEl = document.getElementById('wll-l'), aEl = document.getElementById('wll-a'), hEl = document.getElementById('wll-h');
    const cajaEl = document.getElementById('wll-caja'), cuentaEl = document.getElementById('wll-cuenta'), msgEl = document.getElementById('wll-msg');
    [[lEl, 4], [aEl, 3], [hEl, 3]].forEach(([sel, def]) => {
      for (let i = 1; i <= 6; i++) sel.innerHTML += `<option value="${i}"${i === def ? ' selected' : ''}>${i}</option>`;
      sel.onchange = vaciar;
    });
    let puestas = 0;
    const awarded = new Set();
    const dims = () => [parseInt(lEl.value, 10), parseInt(aEl.value, 10), parseInt(hEl.value, 10)];

    function pintar() {
      const [l, a, h] = dims();
      cajaEl.innerHTML = '';
      for (let c = 0; c < puestas; c++) {
        const capa = document.createElement('div');
        capa.className = 'wll-capa';
        capa.style.gridTemplateColumns = `repeat(${l}, 13px)`;
        for (let k = 0; k < l * a; k++) { const d = document.createElement('div'); d.className = 'wll-cubo'; capa.appendChild(d); }
        cajaEl.appendChild(capa);
      }
      cuentaEl.innerHTML = puestas
        ? `${puestas} capa${puestas === 1 ? '' : 's'} × ${l * a} cubitos = <strong>${puestas * l * a} cm³</strong>`
        : `caja vacía · cada capa lleva ${l} × ${a} = ${l * a} cubitos`;
      document.getElementById('wll-capa').disabled = puestas >= h;
      document.getElementById('wll-todo').disabled = puestas >= h;
    }

    function vaciar() { puestas = 0; msgEl.className = 'wll-msg'; msgEl.textContent = 'Elige las medidas y ve llenando la caja con cubitos de 1 cm³.'; pintar(); }

    function comprobarLlena() {
      const [l, a, h] = dims();
      if (puestas < h) return;
      msgEl.className = 'wll-msg ok';
      msgEl.innerHTML = `✔ ¡Llena! ${h} capas de ${l * a} cubitos son <strong>${l * a * h} cm³</strong>. Y eso es justo ${l} × ${a} × ${h}: la fórmula solo cuenta cubitos.`;
      if (typeof sfx === 'function') sfx('ok');
      const clave = l + 'x' + a + 'x' + h;
      if (awarded.size < 5 && !awarded.has(clave) && typeof pts === 'function') { awarded.add(clave); pts(2); }
    }

    document.getElementById('wll-capa').onclick = () => { const [, , h] = dims(); if (puestas < h) { puestas++; if (typeof sfx === 'function') sfx('click'); pintar(); comprobarLlena(); } };
    document.getElementById('wll-todo').onclick = () => { const [, , h] = dims(); puestas = h; if (typeof sfx === 'function') sfx('click'); pintar(); comprobarLlena(); };
    document.getElementById('wll-vaciar').onclick = () => { if (typeof sfx === 'function') sfx('click'); vaciar(); };
    pintar();
  }
};
