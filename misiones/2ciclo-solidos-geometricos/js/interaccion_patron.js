// js/interaccion_patron.js
// Widget: El Armador de Patrones. El currículo pide construir sólidos «con
// patrones establecidos», y en el aula eso se hace con cartulina y tijeras.
// Aquí se practica el paso previo, que es el que falla: mirar un desarrollo
// aplanado y saber qué cuerpo va a salir antes de gastar la cartulina.

window.WidgetPatronJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const PATRONES = [
      { svg: 'cubo', n: 'cubo', pista: 'seis cuadrados iguales, cuatro en fila y dos de tapa' },
      { svg: 'cilindro', n: 'cilindro', pista: 'dos círculos y un rectángulo que se enrolla' },
      { svg: 'cono', n: 'cono', pista: 'un círculo de base y un sector que se cierra en punta' },
      { svg: 'piramide', n: 'pirámide cuadrangular', pista: 'un cuadrado y cuatro triángulos que suben' },
      { svg: 'prismaT', n: 'prisma triangular', pista: 'dos triángulos y tres rectángulos' }
    ];
    const DIBUJOS = {
      cubo: '<rect x="40" y="10" width="30" height="30"/><rect x="10" y="40" width="30" height="30"/><rect x="40" y="40" width="30" height="30"/><rect x="70" y="40" width="30" height="30"/><rect x="100" y="40" width="30" height="30"/><rect x="40" y="70" width="30" height="30"/>',
      cilindro: '<circle cx="30" cy="25" r="18"/><rect x="12" y="46" width="110" height="38"/><circle cx="30" cy="98" r="18"/>',
      cono: '<circle cx="30" cy="80" r="18"/><path d="M70 15 A45 45 0 0 1 118 75 L70 60 Z"/>',
      piramide: '<rect x="45" y="40" width="34" height="34"/><path d="M45 40 L62 6 L79 40 Z"/><path d="M45 74 L62 108 L79 74 Z"/><path d="M45 40 L11 57 L45 74 Z"/><path d="M79 40 L113 57 L79 74 Z"/>',
      prismaT: '<path d="M20 20 L44 20 L32 42 Z"/><rect x="14" y="46" width="36" height="46"/><rect x="52" y="46" width="36" height="46"/><rect x="90" y="46" width="36" height="46"/><path d="M20 96 L44 96 L32 118 Z"/>'
    };

    container.innerHTML = `
      <style>
        .wpa-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wpa-svg { display:flex; justify-content:center; margin-bottom:0.7rem; }
        .wpa-svg svg { max-width:190px; height:auto; }
        .wpa-svg svg rect, .wpa-svg svg path, .wpa-svg svg circle { fill:#e3f2fd; stroke:#1565c0; stroke-width:2; stroke-linejoin:round; }
        .wpa-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wpa-opt { font-family:'Fredoka',sans-serif; font-size:0.92rem; padding:0.5rem 1rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; }
        .wpa-opt:hover:not(:disabled) { background:#1565c0; color:#fff; }
        .wpa-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wpa-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wpa-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wpa-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wpa-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        .wpa-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; text-align:center; color:#636e72; margin-top:0.4rem; }
        [data-theme="dark"] .wpa-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wpa-svg svg rect, [data-theme="dark"] .wpa-svg svg path, [data-theme="dark"] .wpa-svg svg circle { fill:#22304a; stroke:#74b9ff; }
        [data-theme="dark"] .wpa-opt { background:#1e2130; color:#74b9ff; }
        [data-theme="dark"] .wpa-msg { color:#a0aec0; }
        [data-theme="dark"] .wpa-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wpa-msg.err { color:#ffb3b3; }
      </style>
      <div class="wpa-container">
        <div class="wpa-svg" id="wpa-svg"></div>
        <div class="wpa-opts" id="wpa-opts"></div>
        <div class="wpa-msg" id="wpa-msg">Este es el sólido desdoblado. ¿Qué se arma al doblarlo?</div>
        <div class="wpa-streak" id="wpa-streak">🔥 Racha: 0</div>
      </div>`;

    const svgEl = document.getElementById('wpa-svg');
    const optsEl = document.getElementById('wpa-opts');
    const msgEl = document.getElementById('wpa-msg');
    const stEl = document.getElementById('wpa-streak');
    let cur = null, answered = false, streak = 0;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    function nueva() {
      cur = PATRONES[rint(0, PATRONES.length - 1)];
      answered = false;
      svgEl.innerHTML = `<svg viewBox="0 0 140 125" role="img" aria-label="Patrón desdoblado">${DIBUJOS[cur.svg]}</svg>`;
      const otros = PATRONES.filter(p => p.n !== cur.n).sort(() => Math.random() - 0.5).slice(0, 2);
      const ops = [cur, ...otros].sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      ops.forEach(o => {
        const b = document.createElement('button');
        b.className = 'wpa-opt'; b.textContent = o.n;
        b.onclick = () => responder(b, o.n);
        optsEl.appendChild(b);
      });
      msgEl.className = 'wpa-msg';
      msgEl.textContent = 'Este es el sólido desdoblado. ¿Qué se arma al doblarlo?';
    }

    function responder(btn, n) {
      if (answered) return;
      answered = true;
      optsEl.querySelectorAll('.wpa-opt').forEach(b => { b.disabled = true; if (b.textContent === cur.n) b.classList.add('ok'); });
      if (n === cur.n) {
        streak++;
        msgEl.className = 'wpa-msg ok';
        msgEl.innerHTML = `✔ ¡Eso es! Se ve por las piezas: ${cur.pista}.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('p' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no'); streak = 0;
        msgEl.className = 'wpa-msg err';
        msgEl.innerHTML = `💡 Era el <strong>${cur.n}</strong>: ${cur.pista}. Cuenta las piezas del dibujo y mira de qué forma son.`;
        if (typeof sfx === 'function') sfx('no');
      }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3200);
    }

    nueva();
  }
};
