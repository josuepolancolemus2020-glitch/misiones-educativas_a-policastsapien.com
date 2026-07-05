// js/interaccion_fabrica.js
// Widget Lab 2: La Fábrica de Factores Primos — llega un número y el
// estudiante lo va dividiendo con los martillos primos (2, 3, 5, 7)
// hasta dejarlo en 1. Al final la máquina muestra la factorización.

window.WidgetFabricaJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wfa-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wfa-num { font-family: 'Fira Code', monospace; font-size: 2rem; font-weight: 700; color: #1565c0; text-align: center; margin-bottom: 0.2rem; transition: transform 0.2s; }
        .wfa-num.wfa-pop { transform: scale(1.25); }
        .wfa-chain { font-family: 'Fira Code', monospace; font-size: 1rem; font-weight: 700; color: #00838f; text-align: center; min-height: 1.4rem; margin-bottom: 0.7rem; }
        .wfa-hammers { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; margin-bottom: 0.7rem; }
        .wfa-hammer { font-family: 'Fredoka', sans-serif; font-size: 1.05rem; padding: 0.5rem 1.2rem; border: 2px solid #1565c0; border-radius: 20px; background: white; color: #1565c0; cursor: pointer; transition: all 0.2s; font-weight: 700; }
        .wfa-hammer:hover:not(:disabled) { background: #1565c0; color: white; transform: translateY(-2px); }
        .wfa-hammer:disabled { opacity: 0.4; cursor: default; }
        .wfa-msg { font-size: 0.88rem; text-align: center; color: #636e72; min-height: 2.4rem; padding: 0.4rem 0.6rem; border-radius: 8px; line-height: 1.45; }
        .wfa-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wfa-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wfa-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.8rem; flex-wrap: wrap; }
        .wfa-btn { font-family: 'Fredoka', sans-serif; background: #1565c0; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wfa-btn:hover { transform: translateY(-2px); }
        .wfa-score { font-family: 'Fredoka', sans-serif; font-size: 0.78rem; text-align: center; color: #636e72; margin-top: 0.4rem; }
        [data-theme="dark"] .wfa-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wfa-hammer { background: #1e2130; }
        [data-theme="dark"] .wfa-msg { color: #a0aec0; }
      </style>
      <div class="wfa-container">
        <div class="wfa-num" id="wfa-num"></div>
        <div class="wfa-chain" id="wfa-chain">&nbsp;</div>
        <div class="wfa-hammers">
          <button class="wfa-hammer" data-p="2">🔨 ÷2</button>
          <button class="wfa-hammer" data-p="3">🔨 ÷3</button>
          <button class="wfa-hammer" data-p="5">🔨 ÷5</button>
          <button class="wfa-hammer" data-p="7">🔨 ÷7</button>
        </div>
        <div class="wfa-msg" id="wfa-msg">Golpea con un martillo primo que divida al número en forma exacta.</div>
        <div class="wfa-score" id="wfa-score">🏭 Piezas fabricadas: 0</div>
        <div class="wfa-btn-row">
          <button class="wfa-btn" id="wfa-btn-new">📦 Nueva pieza</button>
        </div>
      </div>
    `;

    const POOL = [12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 56, 60, 63, 70, 72, 75, 84, 90, 98, 100];
    const numEl = document.getElementById('wfa-num');
    const chainEl = document.getElementById('wfa-chain');
    const msgEl = document.getElementById('wfa-msg');
    const scoreEl = document.getElementById('wfa-score');
    let original = 0, actual = 0, factores = [], piezas = 0;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wfa-msg' + (cls ? ' ' + cls : ''); }
    function pop() { numEl.classList.add('wfa-pop'); setTimeout(() => numEl.classList.remove('wfa-pop'), 220); }

    function newPiece() {
      original = POOL[rint(0, POOL.length - 1)];
      actual = original;
      factores = [];
      numEl.textContent = actual;
      chainEl.innerHTML = '&nbsp;';
      container.querySelectorAll('.wfa-hammer').forEach(b => { b.disabled = false; });
      setMsg(`Llegó la pieza <strong>${original}</strong>. Divide con el menor primo posible hasta llegar a 1.`);
    }

    container.querySelectorAll('.wfa-hammer').forEach(btn => {
      btn.addEventListener('click', () => {
        if (actual <= 1) return;
        const p = parseInt(btn.dataset.p, 10);
        if (actual % p === 0) {
          factores.push(p);
          actual = actual / p;
          numEl.textContent = actual;
          pop();
          chainEl.textContent = original + ' = ' + factores.join(' × ') + (actual > 1 ? ' × ' + actual : '');
          if (typeof sfx === 'function') sfx('ok');
          if (actual === 1) {
            piezas++;
            scoreEl.textContent = '🏭 Piezas fabricadas: ' + piezas;
            chainEl.textContent = original + ' = ' + factores.join(' × ');
            setMsg(`🎉 ¡Pieza terminada! <strong>${original} = ${factores.join(' × ')}</strong>. Todos los factores son primos: esa es la descomposición factorial.`, 'ok');
            container.querySelectorAll('.wfa-hammer').forEach(b => { b.disabled = true; });
            if (typeof sfx === 'function') sfx('fan');
            if (awarded.size < 5 && typeof pts === 'function') { awarded.add('p' + piezas); pts(2); }
          } else if (window._esPrimoWfa(actual)) {
            if (actual <= 7) {
              setMsg(`✔ Va quedando <strong>${actual}</strong>, ¡que ya es primo! Dale el último golpe con el martillo ÷${actual}.`, 'ok');
            }
            if (actual > 7) { // primo fuera del alcance de los martillos: se empaca automáticamente
              factores.push(actual);
              actual = 1;
              piezas++;
              scoreEl.textContent = '🏭 Piezas fabricadas: ' + piezas;
              numEl.textContent = 1;
              chainEl.textContent = original + ' = ' + factores.join(' × ');
              setMsg(`🎉 El ${factores[factores.length - 1]} ya es primo, así que la máquina lo empacó: <strong>${original} = ${factores.join(' × ')}</strong>.`, 'ok');
              container.querySelectorAll('.wfa-hammer').forEach(b => { b.disabled = true; });
              if (typeof sfx === 'function') sfx('fan');
              if (awarded.size < 5 && typeof pts === 'function') { awarded.add('p' + piezas); pts(2); }
            }
          } else {
            setMsg(`✔ ${p} es factor primo. Ahora la pieza vale <strong>${actual}</strong>: sigue dividiendo.`, 'ok');
          }
        } else {
          setMsg(`💡 El ${p} no divide al ${actual} en forma exacta (quedaría residuo). Prueba con otro martillo primo.`, 'err');
          if (typeof sfx === 'function') sfx('no');
        }
      });
    });

    // primalidad simple para el rango de la fábrica
    window._esPrimoWfa = function(n) { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };

    document.getElementById('wfa-btn-new').addEventListener('click', () => {
      if (typeof sfx === 'function') sfx('click');
      newPiece();
    });

    newPiece();
  }
};
