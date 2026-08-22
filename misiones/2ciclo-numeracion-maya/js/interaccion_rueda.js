// js/interaccion_rueda.js
// Widget: La Rueda Calendárica. Los dos calendarios girando engranados es la
// imagen que explica de golpe por qué una fecha maya no se repite en 52 años.
// Es el mínimo común múltiplo de 260 y 365 sin llamarlo así, y el alumno lo ve
// llegar contando vueltas.

window.WidgetRuedaJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wrd-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wrd-ruedas { display:flex; justify-content:center; gap:1.4rem; margin-bottom:0.7rem; }
        .wrd-r { text-align:center; }
        .wrd-disco { width:84px; height:84px; border-radius:50%; border:4px solid #00695c; display:flex; align-items:center; justify-content:center; font-family:'Fredoka',sans-serif; font-weight:700; font-size:0.95rem; color:#00695c; transition:transform 0.5s ease; background:#e0f2f1; }
        .wrd-r.haab .wrd-disco { border-color:#bf6516; color:#bf6516; background:#fdf0e3; }
        .wrd-lbl { font-family:'Fredoka',sans-serif; font-size:0.76rem; color:#636e72; margin-top:0.25rem; }
        .wrd-dias { font-family:'Fira Code',monospace; font-size:1.15rem; font-weight:700; text-align:center; color:#1b2838; margin-bottom:0.5rem; }
        .wrd-btns { display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap; }
        .wrd-btn { font-family:'Fredoka',sans-serif; font-size:0.85rem; padding:0.45rem 0.9rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; }
        .wrd-btn:hover { background:#1565c0; color:#fff; }
        .wrd-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.8rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wrd-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        [data-theme="dark"] .wrd-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wrd-disco { background:#14322e; }
        [data-theme="dark"] .wrd-r.haab .wrd-disco { background:#33240f; }
        [data-theme="dark"] .wrd-dias { color:#e8f0fe; }
        [data-theme="dark"] .wrd-btn { background:#1e2130; color:#74b9ff; }
        [data-theme="dark"] .wrd-msg { color:#a0aec0; }
        [data-theme="dark"] .wrd-msg.ok { color:#7dedc9; }
      </style>
      <div class="wrd-container">
        <div class="wrd-ruedas">
          <div class="wrd-r"><div class="wrd-disco" id="wrd-tz">1</div><div class="wrd-lbl">🔮 tzolkín<br>260 días</div></div>
          <div class="wrd-r haab"><div class="wrd-disco" id="wrd-ha">1</div><div class="wrd-lbl">🌽 haab<br>365 días</div></div>
        </div>
        <div class="wrd-dias" id="wrd-dias">día 0</div>
        <div class="wrd-btns">
          <button class="wrd-btn" id="wrd-1">+1 día</button>
          <button class="wrd-btn" id="wrd-20">+1 uinal (20)</button>
          <button class="wrd-btn" id="wrd-360">+1 tun (360)</button>
          <button class="wrd-btn" id="wrd-fin">⏩ hasta que coincidan</button>
          <button class="wrd-btn" id="wrd-cero">↩️ Reiniciar</button>
        </div>
        <div class="wrd-msg" id="wrd-msg">Las dos ruedas empiezan juntas. Hazlas girar y mira cuándo vuelven a coincidir.</div>
      </div>`;

    const tzEl = document.getElementById('wrd-tz'), haEl = document.getElementById('wrd-ha');
    const diasEl = document.getElementById('wrd-dias'), msgEl = document.getElementById('wrd-msg');
    let dia = 0, giro = 0;
    const awarded = new Set();
    const CICLO = 18980;   // 260 y 365 vuelven a coincidir a los 18,980 días
    const fmt = x => x.toLocaleString('en-US');

    function pintar() {
      const tz = (dia % 260) + 1, ha = (dia % 365) + 1;
      tzEl.textContent = tz; haEl.textContent = ha;
      giro += 40;
      tzEl.style.transform = 'rotate(' + giro + 'deg)';
      haEl.style.transform = 'rotate(' + (-giro) + 'deg)';
      diasEl.textContent = 'día ' + fmt(dia);
      if (dia > 0 && dia % 260 === 0 && dia % 365 === 0) {
        msgEl.className = 'wrd-msg ok';
        msgEl.innerHTML = `🎉 ¡Coinciden otra vez! Han pasado <strong>${fmt(dia)} días</strong>, que son <strong>52 años</strong> del haab (${dia / 365}) y ${dia / 260} vueltas del tzolkín. A eso le llamaban la rueda calendárica.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 5 && typeof pts === 'function') { awarded.add('r' + awarded.size); pts(2); }
      } else if (dia === 0) {
        msgEl.className = 'wrd-msg';
        msgEl.textContent = 'Las dos ruedas empiezan juntas. Hazlas girar y mira cuándo vuelven a coincidir.';
      } else {
        msgEl.className = 'wrd-msg';
        const faltan = CICLO - (dia % CICLO);
        msgEl.innerHTML = `Van <strong>${fmt(dia)}</strong> días. El tzolkín va por el ${(dia % 260) + 1} y el haab por el ${(dia % 365) + 1}: todavía no coinciden. Faltan ${fmt(faltan)} días.`;
      }
    }

    function avanza(n) { dia += n; if (typeof sfx === 'function') sfx('click'); pintar(); }
    document.getElementById('wrd-1').onclick = () => avanza(1);
    document.getElementById('wrd-20').onclick = () => avanza(20);
    document.getElementById('wrd-360').onclick = () => avanza(360);
    document.getElementById('wrd-fin').onclick = () => { dia = CICLO; if (typeof sfx === 'function') sfx('click'); pintar(); };
    document.getElementById('wrd-cero').onclick = () => { dia = 0; giro = 0; if (typeof sfx === 'function') sfx('click'); pintar(); };
    pintar();
  }
};
