// js/interaccion_contador.js
// Widget: Contador de Partes. Contar aristas de memoria sale mal; contarlas
// con la figura delante y comprobar con la cuenta de Euler enseña además a
// no depender de la maestra para saber si acertó.

window.WidgetContadorJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const SOLIDOS = [
      { k: 'cubo', n: 'Cubo', e: '🧊', c: 6, a: 12, v: 8 },
      { k: 'prismaT', n: 'Prisma triangular', e: '⛺', c: 5, a: 9, v: 6 },
      { k: 'piramideC', n: 'Pirámide cuadrangular', e: '🔺', c: 5, a: 8, v: 5 },
      { k: 'piramideT', n: 'Pirámide triangular', e: '📐', c: 4, a: 6, v: 4 },
      { k: 'prismaP', n: 'Prisma pentagonal', e: '🏛️', c: 7, a: 15, v: 10 },
      { k: 'prismaH', n: 'Prisma hexagonal', e: '✏️', c: 8, a: 18, v: 12 }
    ];

    container.innerHTML = `
      <style>
        .wct-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wct-chips { display:flex; gap:0.4rem; flex-wrap:wrap; justify-content:center; margin-bottom:0.8rem; }
        .wct-chip { font-family:'Fredoka',sans-serif; font-size:0.82rem; padding:0.35rem 0.75rem; border:2px solid #90a4ae; border-radius:20px; background:#fff; color:#455a64; cursor:pointer; }
        .wct-chip.sel { background:#1565c0; border-color:#1565c0; color:#fff; }
        .wct-fig { font-size:2.6rem; text-align:center; margin-bottom:0.4rem; }
        .wct-nom { font-family:'Fredoka',sans-serif; font-size:1rem; font-weight:700; text-align:center; color:#1b2838; margin-bottom:0.7rem; }
        .wct-row { display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap; margin-bottom:0.6rem; }
        .wct-campo { display:flex; flex-direction:column; align-items:center; gap:0.2rem; }
        .wct-campo label { font-size:0.74rem; color:#636e72; font-family:'Fredoka',sans-serif; }
        .wct-campo input { width:64px; padding:0.4rem; border:2px solid #cfd8dc; border-radius:8px; text-align:center; font-family:'Fira Code',monospace; font-size:1rem; }
        .wct-campo input.ok { border-color:#00b894; background:rgba(0,184,148,0.10); }
        .wct-campo input.no { border-color:#d63031; background:rgba(214,48,49,0.08); }
        .wct-btn { font-family:'Fredoka',sans-serif; font-size:0.9rem; padding:0.45rem 1.2rem; border:2px solid #00838f; border-radius:20px; background:#fff; color:#00838f; cursor:pointer; font-weight:700; display:block; margin:0 auto; }
        .wct-btn:hover { background:#00838f; color:#fff; }
        .wct-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wct-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wct-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        [data-theme="dark"] .wct-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wct-nom { color:#e8f0fe; }
        [data-theme="dark"] .wct-chip { background:#1e2130; color:#a0aec0; }
        [data-theme="dark"] .wct-campo input { background:#161a26; color:#e8f0fe; border-color:#2d3450; }
        [data-theme="dark"] .wct-btn { background:#1e2130; }
        [data-theme="dark"] .wct-msg { color:#a0aec0; }
        [data-theme="dark"] .wct-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wct-msg.err { color:#ffb3b3; }
      </style>
      <div class="wct-container">
        <div class="wct-chips" id="wct-chips"></div>
        <div class="wct-fig" id="wct-fig"></div>
        <div class="wct-nom" id="wct-nom"></div>
        <div class="wct-row">
          <div class="wct-campo"><label>🟦 caras</label><input id="wct-c" type="text" inputmode="numeric" autocomplete="off"></div>
          <div class="wct-campo"><label>📏 aristas</label><input id="wct-a" type="text" inputmode="numeric" autocomplete="off"></div>
          <div class="wct-campo"><label>📍 vértices</label><input id="wct-v" type="text" inputmode="numeric" autocomplete="off"></div>
        </div>
        <button class="wct-btn" id="wct-comp">✅ Comprobar</button>
        <div class="wct-msg" id="wct-msg">Elige un sólido, cuenta sus partes y comprueba.</div>
      </div>`;

    const chipsEl = document.getElementById('wct-chips');
    const figEl = document.getElementById('wct-fig');
    const nomEl = document.getElementById('wct-nom');
    const cEl = document.getElementById('wct-c'), aEl = document.getElementById('wct-a'), vEl = document.getElementById('wct-v');
    const msgEl = document.getElementById('wct-msg');
    let cur = SOLIDOS[0];
    const awarded = new Set();

    function pintarChips() {
      chipsEl.innerHTML = '';
      SOLIDOS.forEach(s => {
        const b = document.createElement('button');
        b.className = 'wct-chip' + (s.k === cur.k ? ' sel' : '');
        b.textContent = s.e + ' ' + s.n;
        b.onclick = () => { cur = s; if (typeof sfx === 'function') sfx('click'); pintar(); };
        chipsEl.appendChild(b);
      });
    }

    function pintar() {
      pintarChips();
      figEl.textContent = cur.e;
      nomEl.textContent = cur.n;
      [cEl, aEl, vEl].forEach(i => { i.value = ''; i.className = ''; });
      msgEl.className = 'wct-msg';
      msgEl.textContent = 'Cuenta sus caras, aristas y vértices, y comprueba.';
    }

    document.getElementById('wct-comp').onclick = () => {
      const okC = parseInt(cEl.value, 10) === cur.c, okA = parseInt(aEl.value, 10) === cur.a, okV = parseInt(vEl.value, 10) === cur.v;
      cEl.className = okC ? 'ok' : 'no'; aEl.className = okA ? 'ok' : 'no'; vEl.className = okV ? 'ok' : 'no';
      if (okC && okA && okV) {
        msgEl.className = 'wct-msg ok';
        msgEl.innerHTML = `✔ ¡Los tres bien! Compruébalo con Euler: ${cur.c} + ${cur.v} = <strong>${cur.c + cur.v}</strong> y ${cur.a} + 2 = <strong>${cur.a + 2}</strong>. Cuadra.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 5 && !awarded.has(cur.k) && typeof pts === 'function') { awarded.add(cur.k); pts(2); }
      } else {
        msgEl.className = 'wct-msg err';
        msgEl.innerHTML = `💡 El ${cur.n} tiene <strong>${cur.c}</strong> caras, <strong>${cur.a}</strong> aristas y <strong>${cur.v}</strong> vértices. Fíjate: ${cur.c} + ${cur.v} = ${cur.a} + 2.`;
        if (typeof sfx === 'function') sfx('no');
      }
    };

    pintar();
  }
};
