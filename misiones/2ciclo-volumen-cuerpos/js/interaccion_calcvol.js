// js/interaccion_calcvol.js
// Widget: Calculadora de Volumen. No da el resultado y ya: enseña la fórmula
// con los números puestos, paso por paso, y además lo convierte a litros. Esa
// conversión es la que le da sentido al ejercicio: un tanque no se mide en
// centímetros cúbicos, se mide en litros de agua.

window.WidgetCalcvolJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wcv-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wcv-tabs { display:flex; gap:0.4rem; justify-content:center; flex-wrap:wrap; margin-bottom:0.8rem; }
        .wcv-tab { font-family:'Fredoka',sans-serif; font-size:0.85rem; padding:0.4rem 0.9rem; border:2px solid #90a4ae; border-radius:20px; background:#fff; color:#455a64; cursor:pointer; }
        .wcv-tab.sel { background:#00838f; border-color:#00838f; color:#fff; }
        .wcv-campos { display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap; margin-bottom:0.7rem; }
        .wcv-campo { display:flex; flex-direction:column; align-items:center; gap:0.15rem; }
        .wcv-campo label { font-size:0.72rem; color:#636e72; font-family:'Fredoka',sans-serif; }
        .wcv-campo input { width:74px; padding:0.4rem; border:2px solid #cfd8dc; border-radius:8px; text-align:center; font-family:'Fira Code',monospace; font-size:1rem; }
        .wcv-btn { font-family:'Fredoka',sans-serif; font-size:0.9rem; padding:0.45rem 1.2rem; border:2px solid #00838f; border-radius:20px; background:#fff; color:#00838f; cursor:pointer; font-weight:700; display:block; margin:0 auto; }
        .wcv-btn:hover { background:#00838f; color:#fff; }
        .wcv-pasos { background:#f5f7fb; border-radius:10px; padding:0.7rem 0.9rem; margin-top:0.7rem; font-family:'Fira Code',monospace; font-size:0.92rem; color:#1b2838; line-height:1.9; min-height:2.4rem; text-align:center; }
        .wcv-pasos .wcv-res { color:#075e44; font-weight:700; }
        [data-theme="dark"] .wcv-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wcv-tab { background:#1e2130; color:#a0aec0; }
        [data-theme="dark"] .wcv-campo input { background:#161a26; color:#e8f0fe; border-color:#2d3450; }
        [data-theme="dark"] .wcv-btn { background:#1e2130; }
        [data-theme="dark"] .wcv-pasos { background:#161a26; color:#e8f0fe; }
        [data-theme="dark"] .wcv-pasos .wcv-res { color:#7dedc9; }
      </style>
      <div class="wcv-container">
        <div class="wcv-tabs">
          <button class="wcv-tab sel" data-t="cubo">🧊 Cubo</button>
          <button class="wcv-tab" data-t="prisma">📦 Prisma</button>
          <button class="wcv-tab" data-t="cilindro">🥫 Cilindro</button>
        </div>
        <div class="wcv-campos" id="wcv-campos"></div>
        <button class="wcv-btn" id="wcv-calc">🧮 Calcular</button>
        <div class="wcv-pasos" id="wcv-pasos">Elige el cuerpo, escribe sus medidas en centímetros y calcula.</div>
      </div>`;

    const camposEl = document.getElementById('wcv-campos'), pasosEl = document.getElementById('wcv-pasos');
    let tipo = 'cubo';
    const awarded = new Set();
    const CAMPOS = {
      cubo: [['a', 'arista (cm)', 4]],
      prisma: [['l', 'largo (cm)', 10], ['an', 'ancho (cm)', 6], ['al', 'alto (cm)', 4]],
      cilindro: [['r', 'radio (cm)', 5], ['h', 'altura (cm)', 20]]
    };

    function pintarCampos() {
      camposEl.innerHTML = '';
      CAMPOS[tipo].forEach(([k, lbl, def]) => {
        const d = document.createElement('div'); d.className = 'wcv-campo';
        d.innerHTML = `<label>${lbl}</label><input id="wcv-${k}" type="text" inputmode="decimal" value="${def}" autocomplete="off">`;
        camposEl.appendChild(d);
      });
    }

    function val(k) { const el = document.getElementById('wcv-' + k); const v = parseFloat((el ? el.value : '').replace(',', '.')); return isNaN(v) ? 0 : v; }
    const red = x => Math.round(x * 100) / 100;

    document.querySelectorAll('.wcv-tab').forEach(b => {
      b.onclick = () => {
        document.querySelectorAll('.wcv-tab').forEach(x => x.classList.remove('sel'));
        b.classList.add('sel'); tipo = b.dataset.t; pintarCampos();
        pasosEl.textContent = 'Escribe las medidas en centímetros y calcula.';
        if (typeof sfx === 'function') sfx('click');
      };
    });

    document.getElementById('wcv-calc').onclick = () => {
      let v = 0, pasos = '';
      if (tipo === 'cubo') {
        const a = val('a'); v = a * a * a;
        pasos = `V = ${a} × ${a} × ${a} = <span class="wcv-res">${red(v)} cm³</span>`;
      } else if (tipo === 'prisma') {
        const l = val('l'), an = val('an'), al = val('al'); v = l * an * al;
        pasos = `V = ${l} × ${an} × ${al} = <span class="wcv-res">${red(v)} cm³</span>`;
      } else {
        const r = val('r'), h = val('h'); v = 3.14 * r * r * h;
        pasos = `V = 3.14 × ${r}² × ${h}<br>V = 3.14 × ${red(r * r)} × ${h} = <span class="wcv-res">${red(v)} cm³</span>`;
      }
      const litros = red(v / 1000);
      pasos += `<br><span style="font-size:0.84rem;color:#636e72;">y en capacidad: ${red(v)} cm³ ÷ 1,000 = <strong>${litros} litros</strong></span>`;
      pasosEl.innerHTML = pasos;
      if (typeof sfx === 'function') sfx('ok');
      if (awarded.size < 5 && typeof pts === 'function') { awarded.add('v' + awarded.size); pts(2); }
    };

    pintarCampos();
  }
};
