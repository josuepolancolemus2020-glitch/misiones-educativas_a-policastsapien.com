// js/interaccion_maquina.js
// Widget: La Máquina Inversa — un número entra a la máquina "x²" y luego a la
// máquina "√": el estudiante predice qué saldrá y comprueba que vuelve el original.

window.WidgetMaquinaJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wm2-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.5rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wm2-flow { display: flex; align-items: center; justify-content: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.1rem; min-height: 90px; }
        .wm2-box { font-family: 'Fredoka', sans-serif; font-size: 1.5rem; font-weight: 700; min-width: 74px; min-height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 12px; padding: 0.4rem 0.8rem; transition: all 0.3s; }
        .wm2-num { background: rgba(245,158,11,0.15); border: 2px solid #f59e0b; color: #b45309; }
        .wm2-machine { background: #7c3aed; color: white; font-size: 1.15rem; position: relative; box-shadow: 0 4px 12px rgba(124,58,237,0.35); }
        .wm2-machine.wm2-raiz { background: #00897b; box-shadow: 0 4px 12px rgba(0,137,123,0.35); }
        .wm2-machine.wm2-working { animation: wm2Shake 0.5s ease; }
        @keyframes wm2Shake { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-4deg) scale(1.06); } 75% { transform: rotate(4deg) scale(1.06); } }
        .wm2-out { background: rgba(124,58,237,0.12); border: 2px dashed #7c3aed; color: #7c3aed; }
        .wm2-out.wm2-empty { color: #b0a8c9; }
        .wm2-out.wm2-back { background: rgba(0,184,148,0.15); border: 2px solid #00b894; color: #00695c; animation: wm2Pop 0.45s ease; }
        @keyframes wm2Pop { 0% { transform: scale(0.4); } 70% { transform: scale(1.15); } 100% { transform: scale(1); } }
        .wm2-arrow { font-size: 1.3rem; color: #636e72; }
        .wm2-pred { background: linear-gradient(135deg, rgba(108,92,231,0.08), rgba(124,58,237,0.08)); border: 2px solid #6c5ce7; border-radius: 12px; padding: 0.9rem 1.1rem; margin-bottom: 1rem; }
        .wm2-pred-q { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; color: #1b2838; margin-bottom: 0.6rem; font-weight: 600; }
        .wm2-pred-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .wm2-pred-btn { font-family: 'Fredoka', sans-serif; font-size: 0.9rem; padding: 0.45rem 1rem; border: 2px solid #6c5ce7; border-radius: 20px; background: white; color: #6c5ce7; cursor: pointer; transition: all 0.2s; }
        .wm2-pred-btn:hover:not(:disabled) { background: #6c5ce7; color: white; }
        .wm2-pred-btn.wm2-ok { background: #00b894; border-color: #00b894; color: white; }
        .wm2-pred-btn.wm2-no { background: #d63031; border-color: #d63031; color: white; }
        .wm2-msg { font-size: 0.88rem; text-align: center; color: #636e72; min-height: 2.2rem; padding: 0.4rem 0.6rem; border-radius: 8px; line-height: 1.45; }
        .wm2-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wm2-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wm2-btn-row { display: flex; gap: 0.6rem; justify-content: center; margin-top: 0.9rem; flex-wrap: wrap; }
        .wm2-btn { font-family: 'Fredoka', sans-serif; background: #7c3aed; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wm2-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .wm2-btn:disabled { opacity: 0.45; cursor: default; }
        .wm2-btn.wm2-btn-teal { background: #00897b; }
        .wm2-btn.wm2-btn-amber { background: #f59e0b; }
        [data-theme="dark"] .wm2-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wm2-pred-q { color: #e8f0fe; }
        [data-theme="dark"] .wm2-pred-btn { background: #1e2130; }
        [data-theme="dark"] .wm2-msg { color: #a0aec0; }
      </style>
      <div class="wm2-container">
        <div class="wm2-flow">
          <div class="wm2-box wm2-num" id="wm2-in">5</div>
          <span class="wm2-arrow">→</span>
          <div class="wm2-box wm2-machine" id="wm2-m1">x²</div>
          <span class="wm2-arrow">→</span>
          <div class="wm2-box wm2-out wm2-empty" id="wm2-mid">?</div>
          <span class="wm2-arrow">→</span>
          <div class="wm2-box wm2-machine wm2-raiz" id="wm2-m2">√</div>
          <span class="wm2-arrow">→</span>
          <div class="wm2-box wm2-out wm2-empty" id="wm2-end">?</div>
        </div>
        <div class="wm2-pred" id="wm2-pred" style="display:none;">
          <div class="wm2-pred-q" id="wm2-pred-q"></div>
          <div class="wm2-pred-opts" id="wm2-pred-opts"></div>
        </div>
        <div class="wm2-msg" id="wm2-msg">Presiona <strong>Elevar al cuadrado</strong> para meter el número a la primera máquina.</div>
        <div class="wm2-btn-row">
          <button class="wm2-btn" id="wm2-btn-pow">⚡ Elevar al cuadrado</button>
          <button class="wm2-btn wm2-btn-teal" id="wm2-btn-root" disabled>🌱 Sacar la raíz</button>
          <button class="wm2-btn wm2-btn-amber" id="wm2-btn-new">🔄 Otro número</button>
        </div>
      </div>
    `;

    const inEl = document.getElementById('wm2-in');
    const midEl = document.getElementById('wm2-mid');
    const endEl = document.getElementById('wm2-end');
    const m1El = document.getElementById('wm2-m1');
    const m2El = document.getElementById('wm2-m2');
    const msgEl = document.getElementById('wm2-msg');
    const predEl = document.getElementById('wm2-pred');
    const predQEl = document.getElementById('wm2-pred-q');
    const predOptsEl = document.getElementById('wm2-pred-opts');
    const btnPow = document.getElementById('wm2-btn-pow');
    const btnRoot = document.getElementById('wm2-btn-root');
    const btnNew = document.getElementById('wm2-btn-new');

    let n = 5, stage = 0; // 0=inicio, 1=elevado (esperando predicción), 2=predicho, 3=raíz sacada
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wm2-msg' + (cls ? ' ' + cls : ''); }

    function reset(newN) {
      n = newN;
      stage = 0;
      inEl.textContent = n;
      midEl.textContent = '?'; midEl.className = 'wm2-box wm2-out wm2-empty';
      endEl.textContent = '?'; endEl.className = 'wm2-box wm2-out wm2-empty';
      predEl.style.display = 'none';
      btnPow.disabled = false;
      btnRoot.disabled = true;
      setMsg('Presiona <strong>Elevar al cuadrado</strong> para meter el número a la primera máquina.');
    }

    function showPrediction() {
      predEl.style.display = 'block';
      predQEl.textContent = `🔮 El ${n * n} va a entrar a la máquina √. ¿Qué número saldrá?`;
      const options = [n];
      const alt1 = n * n - n; // distractor típico: "restar en vez de raíz"
      const alt2 = Math.round((n * n) / 2); // distractor típico: "la mitad"
      [alt1, alt2, n + 1, n - 1].forEach(v => {
        if (options.length < 3 && v >= 1 && !options.includes(v)) options.push(v);
      });
      options.sort(() => Math.random() - 0.5);
      predOptsEl.innerHTML = '';
      options.forEach(v => {
        const b = document.createElement('button');
        b.className = 'wm2-pred-btn';
        b.textContent = v;
        b.addEventListener('click', () => {
          if (stage !== 1) return;
          stage = 2;
          predOptsEl.querySelectorAll('.wm2-pred-btn').forEach(x => { x.disabled = true; });
          const isOk = v === n;
          b.classList.add(isOk ? 'wm2-ok' : 'wm2-no');
          if (!isOk) predOptsEl.querySelectorAll('.wm2-pred-btn').forEach(x => { if (parseInt(x.textContent) === n) x.classList.add('wm2-ok'); });
          if (isOk) {
            setMsg(`✔ ¡Predicción correcta! Ahora presiona <strong>Sacar la raíz</strong> para comprobarlo.`, 'ok');
            if (typeof sfx === 'function') sfx('ok');
            if (!awarded.has(n) && typeof pts === 'function') { awarded.add(n); pts(2); }
          } else {
            setMsg(`💡 Saldrá <strong>${n}</strong>: la raíz cuadrada busca el número que multiplicado por sí mismo da ${n * n}. Presiona <strong>Sacar la raíz</strong> para verlo.`, 'err');
            if (typeof sfx === 'function') sfx('no');
          }
          btnRoot.disabled = false;
        });
        predOptsEl.appendChild(b);
      });
    }

    btnPow.addEventListener('click', () => {
      if (stage !== 0) return;
      stage = 1;
      btnPow.disabled = true;
      m1El.classList.add('wm2-working');
      setTimeout(() => m1El.classList.remove('wm2-working'), 500);
      setTimeout(() => {
        midEl.textContent = n * n;
        midEl.className = 'wm2-box wm2-out';
        setMsg(`La máquina x² convirtió el <strong>${n}</strong> en <strong>${n * n}</strong> (${n}×${n}). Antes de sacar la raíz… ¡predice!`);
        showPrediction();
        if (typeof sfx === 'function') sfx('flip');
      }, 350);
      if (typeof sfx === 'function') sfx('click');
    });

    btnRoot.addEventListener('click', () => {
      if (stage !== 2) return;
      stage = 3;
      btnRoot.disabled = true;
      m2El.classList.add('wm2-working');
      setTimeout(() => m2El.classList.remove('wm2-working'), 500);
      setTimeout(() => {
        endEl.textContent = n;
        endEl.className = 'wm2-box wm2-out wm2-back';
        setMsg(`🎉 ¡Volvió el <strong>${n}</strong> original! √${n * n} = ${n}. La raíz cuadrada <strong>deshace</strong> lo que hace la potencia: son operaciones inversas.`, 'ok');
        if (typeof sfx === 'function') sfx('fan');
      }, 350);
    });

    btnNew.addEventListener('click', () => {
      if (typeof sfx === 'function') sfx('click');
      let newN;
      do { newN = rint(2, 14); } while (newN === n);
      reset(newN);
    });

    reset(5);
  }
};
