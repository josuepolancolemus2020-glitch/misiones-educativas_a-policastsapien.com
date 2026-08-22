// js/interaccion_escriba.js
// Widget: El Escriba de Copán. Escribir el número, y no solo leerlo, es lo
// que obliga a decidir cuántos veintes caben y qué sobra. Los símbolos se
// dibujan con CSS y no con emojis exóticos: en los teléfonos del aula
// cualquier signo raro sale como un cuadrito, y aquí el signo ES el contenido.

window.WidgetEscribaJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wec-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wec-meta { font-family:'Fredoka',sans-serif; font-size:1.05rem; text-align:center; color:#1b2838; margin-bottom:0.8rem; }
        .wec-meta strong { color:#1565c0; font-size:1.4rem; }
        .wec-niveles { display:flex; flex-direction:column; align-items:center; gap:0.5rem; margin-bottom:0.7rem; }
        .wec-nivel { border:2px dashed #b0bec5; border-radius:10px; padding:0.5rem 0.9rem; min-width:150px; text-align:center; background:#fafafa; }
        .wec-nivel .wec-val { font-size:0.68rem; color:#78909c; font-family:'Fredoka',sans-serif; display:block; margin-bottom:0.25rem; }
        .wec-simb { min-height:30px; display:flex; flex-direction:column; align-items:center; gap:3px; justify-content:center; }
        .wec-fila { display:flex; gap:5px; }
        .wec-pt { width:11px; height:11px; border-radius:50%; background:#1565c0; }
        .wec-br { width:52px; height:7px; border-radius:3px; background:#00695c; }
        .wec-co { font-size:1.05rem; line-height:1; }
        .wec-btns { display:flex; gap:0.35rem; justify-content:center; flex-wrap:wrap; margin-top:0.35rem; }
        .wec-b { font-family:'Fredoka',sans-serif; font-size:0.76rem; padding:0.25rem 0.6rem; border:1.5px solid #90a4ae; border-radius:14px; background:#fff; color:#455a64; cursor:pointer; }
        .wec-b:hover { background:#eceff1; }
        .wec-acts { display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap; margin-top:0.6rem; }
        .wec-btn { font-family:'Fredoka',sans-serif; font-size:0.9rem; padding:0.45rem 1.1rem; border:2px solid #1565c0; border-radius:20px; background:#fff; color:#1565c0; cursor:pointer; font-weight:700; }
        .wec-btn:hover { background:#1565c0; color:#fff; }
        .wec-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wec-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wec-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        [data-theme="dark"] .wec-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wec-meta { color:#e8f0fe; }
        [data-theme="dark"] .wec-nivel { background:#161a26; border-color:#2d3450; }
        [data-theme="dark"] .wec-pt { background:#74b9ff; }
        [data-theme="dark"] .wec-br { background:#4db6ac; }
        [data-theme="dark"] .wec-b, [data-theme="dark"] .wec-btn { background:#1e2130; color:#a0aec0; }
        [data-theme="dark"] .wec-msg { color:#a0aec0; }
        [data-theme="dark"] .wec-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wec-msg.err { color:#ffb3b3; }
      </style>
      <div class="wec-container">
        <div class="wec-meta">Talla el número <strong id="wec-meta"></strong></div>
        <div class="wec-niveles" id="wec-niveles"></div>
        <div class="wec-acts">
          <button class="wec-btn" id="wec-comp">✅ Comprobar</button>
          <button class="wec-btn" id="wec-otro">🔄 Otro número</button>
        </div>
        <div class="wec-msg" id="wec-msg">Pon puntos (1) y barras (5) en cada nivel. El de arriba vale 20 veces más.</div>
      </div>`;

    const metaEl = document.getElementById('wec-meta');
    const nivEl = document.getElementById('wec-niveles');
    const msgEl = document.getElementById('wec-msg');
    let meta = 0, niveles = [0, 0];
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    function pintar() {
      nivEl.innerHTML = '';
      // el nivel de arriba se dibuja primero: así se ve como en la estela
      [1, 0].forEach(k => {
        const v = niveles[k];
        const d = document.createElement('div');
        d.className = 'wec-nivel';
        const barras = Math.floor(v / 5), puntos = v % 5;
        let simb = '';
        if (v === 0) simb = '<div class="wec-co">🐚</div>';
        else {
          if (puntos) simb += '<div class="wec-fila">' + '<div class="wec-pt"></div>'.repeat(puntos) + '</div>';
          for (let i = 0; i < barras; i++) simb += '<div class="wec-br"></div>';
        }
        d.innerHTML = `<span class="wec-val">nivel ${k + 1} · cada símbolo vale ×${k === 0 ? 1 : 20}</span>
          <div class="wec-simb">${simb}</div>
          <div class="wec-btns">
            <button class="wec-b" data-k="${k}" data-v="1">+ punto</button>
            <button class="wec-b" data-k="${k}" data-v="5">+ barra</button>
            <button class="wec-b" data-k="${k}" data-v="0">borrar</button>
          </div>`;
        nivEl.appendChild(d);
      });
      nivEl.querySelectorAll('.wec-b').forEach(b => {
        b.onclick = () => {
          const k = +b.dataset.k, v = +b.dataset.v;
          if (v === 0) niveles[k] = 0;
          else if (niveles[k] + v <= 19) niveles[k] += v;
          else { msgEl.className = 'wec-msg err'; msgEl.innerHTML = '💡 En un nivel no cabe más de <strong>19</strong>: al llegar a 20 hay que subir al nivel de arriba.'; if (typeof sfx === 'function') sfx('no'); return; }
          if (typeof sfx === 'function') sfx('click');
          pintar();
        };
      });
    }

    function nuevo() {
      meta = rint(6, 199);
      niveles = [0, 0];
      metaEl.textContent = meta;
      msgEl.className = 'wec-msg';
      msgEl.textContent = 'Pon puntos (1) y barras (5) en cada nivel. El de arriba vale 20 veces más.';
      pintar();
    }

    document.getElementById('wec-comp').onclick = () => {
      const total = niveles[0] + niveles[1] * 20;
      if (total === meta) {
        msgEl.className = 'wec-msg ok';
        msgEl.innerHTML = `✔ ¡Bien tallado! ${niveles[1]} × 20 + ${niveles[0]} = <strong>${meta}</strong>.`;
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('e' + awarded.size); pts(2); }
        setTimeout(nuevo, 2600);
      } else {
        msgEl.className = 'wec-msg err';
        msgEl.innerHTML = `💡 Llevas <strong>${total}</strong> y buscas ${meta}. Pista: ${meta} ÷ 20 = ${Math.floor(meta / 20)} y sobran ${meta % 20}.`;
        if (typeof sfx === 'function') sfx('no');
      }
    };
    document.getElementById('wec-otro').onclick = () => { if (typeof sfx === 'function') sfx('click'); nuevo(); };
    nuevo();
  }
};
