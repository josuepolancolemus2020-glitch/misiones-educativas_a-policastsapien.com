// js/interaccion_revolucion.js
// Widget: La Máquina de Revolución. «Obtienen conos, cilindros y esferas por
// revolución de figuras en torno a un eje» está en el currículo de 6.º y es
// lo primero que se cae de la clase, porque sin verlo girar hay que creérselo.
// Aquí el alumno predice y después ve girar la figura de verdad.

window.WidgetRevolucionJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const CASOS = [
      { fig: 'rectángulo', forma: '<rect x="60" y="20" width="34" height="80"/>', sale: 'cilindro', e: '🥫', por: 'los dos lados cortos barren las tapas circulares' },
      { fig: 'triángulo rectángulo', forma: '<path d="M60 100 L60 20 L100 100 Z"/>', sale: 'cono', e: '🍦', por: 'el lado inclinado barre la superficie que sube a la punta' },
      { fig: 'semicírculo', forma: '<path d="M60 20 A40 40 0 0 1 60 100 Z"/>', sale: 'esfera', e: '⚽', por: 'la curva barre la superficie por todos lados' },
      { fig: 'cuadrado', forma: '<rect x="60" y="30" width="60" height="60"/>', sale: 'cilindro', e: '🥫', por: 'igual que el rectángulo: sale un cilindro, solo que más ancho' }
    ];

    container.innerHTML = `
      <style>
        .wrv-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wrv-esc { display:flex; justify-content:center; margin-bottom:0.5rem; }
        .wrv-esc svg { max-width:180px; }
        .wrv-esc svg .figura { fill:#e3f2fd; stroke:#1565c0; stroke-width:2; transform-origin:60px 60px; }
        .wrv-esc svg .figura.gira { animation:wrvGiro 1.4s ease-in-out; }
        @keyframes wrvGiro { 0% { transform:scaleX(1); } 50% { transform:scaleX(-1); } 100% { transform:scaleX(1); } }
        .wrv-esc svg .eje { stroke:#e17055; stroke-width:2; stroke-dasharray:5 4; }
        .wrv-nom { font-family:'Fredoka',sans-serif; font-size:0.95rem; text-align:center; color:#636e72; margin-bottom:0.7rem; }
        .wrv-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wrv-opt { font-family:'Fredoka',sans-serif; font-size:0.95rem; padding:0.5rem 1.2rem; border:2px solid #5e35b1; border-radius:20px; background:#fff; color:#5e35b1; cursor:pointer; font-weight:700; }
        .wrv-opt:hover:not(:disabled) { background:#5e35b1; color:#fff; }
        .wrv-opt.ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wrv-opt.no { background:#d63031; border-color:#d63031; color:#fff; }
        .wrv-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.8rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wrv-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wrv-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        [data-theme="dark"] .wrv-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wrv-esc svg .figura { fill:#22304a; stroke:#74b9ff; }
        [data-theme="dark"] .wrv-opt { background:#1e2130; color:#b39ddb; }
        [data-theme="dark"] .wrv-msg { color:#a0aec0; }
        [data-theme="dark"] .wrv-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wrv-msg.err { color:#ffb3b3; }
      </style>
      <div class="wrv-container">
        <div class="wrv-esc" id="wrv-esc"></div>
        <div class="wrv-nom" id="wrv-nom"></div>
        <div class="wrv-opts" id="wrv-opts"></div>
        <div class="wrv-msg" id="wrv-msg">La línea naranja es el eje. ¿Qué sólido barre la figura al girar?</div>
      </div>`;

    const escEl = document.getElementById('wrv-esc'), nomEl = document.getElementById('wrv-nom');
    const optsEl = document.getElementById('wrv-opts'), msgEl = document.getElementById('wrv-msg');
    let cur = null, answered = false;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    function nueva() {
      cur = CASOS[rint(0, CASOS.length - 1)];
      answered = false;
      escEl.innerHTML = `<svg viewBox="0 0 180 120" role="img" aria-label="Figura junto a su eje de giro">
        <line class="eje" x1="60" y1="8" x2="60" y2="112"/>
        <g class="figura" id="wrv-fig">${cur.forma}</g></svg>`;
      nomEl.textContent = 'Figura: ' + cur.fig;
      optsEl.innerHTML = '';
      ['cilindro', 'cono', 'esfera'].sort(() => Math.random() - 0.5).forEach(o => {
        const b = document.createElement('button');
        b.className = 'wrv-opt'; b.textContent = o;
        b.onclick = () => responder(b, o);
        optsEl.appendChild(b);
      });
      msgEl.className = 'wrv-msg';
      msgEl.textContent = 'La línea naranja es el eje. ¿Qué sólido barre la figura al girar?';
    }

    function responder(btn, o) {
      if (answered) return;
      answered = true;
      optsEl.querySelectorAll('.wrv-opt').forEach(b => { b.disabled = true; if (b.textContent === cur.sale) b.classList.add('ok'); });
      const fig = document.getElementById('wrv-fig');
      if (fig) fig.classList.add('gira');
      if (o === cur.sale) {
        msgEl.className = 'wrv-msg ok';
        msgEl.innerHTML = `✔ ¡Sale un <strong>${cur.sale}</strong>! ${cur.e} ${cur.por}.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('r' + awarded.size); pts(2); }
      } else {
        btn.classList.add('no');
        msgEl.className = 'wrv-msg err';
        msgEl.innerHTML = `💡 Sale un <strong>${cur.sale}</strong> ${cur.e}: ${cur.por}.`;
        if (typeof sfx === 'function') sfx('no');
      }
      setTimeout(nueva, 3400);
    }

    nueva();
  }
};
