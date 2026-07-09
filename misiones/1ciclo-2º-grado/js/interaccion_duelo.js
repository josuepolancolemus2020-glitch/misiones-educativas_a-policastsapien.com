// js/interaccion_duelo.js
// Widget: Duelo de Gigantes — comparar dos números grandes. El feedback enseña
// la regla: más cifras gana; con igual cantidad, se compara de izquierda a derecha.

window.WidgetDueloJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wdl-box { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wdl-arena { display: flex; gap: 0.6rem; justify-content: center; align-items: center; flex-wrap: wrap; margin-bottom: 0.9rem; }
        .wdl-side { text-align: center; border: 2.5px solid #1565c0; border-radius: 14px; padding: 0.5rem 0.9rem; min-width: 120px; }
        .wdl-side.b { border-color: #00838f; }
        .wdl-tag { font-family: 'Fredoka', sans-serif; font-size: 0.7rem; font-weight: 700; color: #1565c0; }
        .wdl-side.b .wdl-tag { color: #00838f; }
        .wdl-val { font-family: 'Fira Code', monospace; font-size: 1.45rem; font-weight: 700; color: #1b2838; }
        .wdl-cifras { font-size: 0.68rem; color: #636e72; font-family: 'Fredoka', sans-serif; }
        .wdl-vs { font-family: 'Fredoka', sans-serif; font-size: 1.1rem; font-weight: 700; color: #d63031; }
        .wdl-opts { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
        .wdl-opt { font-family: 'Fredoka', sans-serif; font-size: 0.88rem; padding: 0.5rem 1rem; border: 2px solid #1565c0; border-radius: 18px; background: white; color: #1565c0; cursor: pointer; font-weight: 700; }
        .wdl-opt:hover:not(:disabled) { background: #1565c0; color: white; }
        .wdl-opt.wdl-ok { background: #00b894; border-color: #00b894; color: white; }
        .wdl-opt.wdl-no { background: #d63031; border-color: #d63031; color: white; }
        .wdl-msg { font-size: 0.86rem; text-align: center; color: #636e72; min-height: 2.4rem; padding: 0.4rem 0.6rem; border-radius: 8px; margin-top: 0.7rem; line-height: 1.45; }
        .wdl-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wdl-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        .wdl-streak { font-family: 'Fredoka', sans-serif; font-size: 0.8rem; text-align: center; color: #636e72; margin-top: 0.4rem; }
        [data-theme="dark"] .wdl-box { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wdl-val { color: #e8f0fe; }
        [data-theme="dark"] .wdl-opt { background: #1e2130; }
      </style>
      <div class="wdl-box">
        <div class="wdl-arena">
          <div class="wdl-side a"><div class="wdl-tag">A</div><div class="wdl-val" id="wdl-a"></div><div class="wdl-cifras" id="wdl-a-c"></div></div>
          <div class="wdl-vs">vs</div>
          <div class="wdl-side b"><div class="wdl-tag">B</div><div class="wdl-val" id="wdl-b"></div><div class="wdl-cifras" id="wdl-b-c"></div></div>
        </div>
        <div class="wdl-opts">
          <button class="wdl-opt" id="wdl-mayor">↑ A ES MAYOR</button>
          <button class="wdl-opt" id="wdl-igual">= SON IGUALES</button>
          <button class="wdl-opt" id="wdl-menor">↓ A ES MENOR</button>
        </div>
        <div class="wdl-msg" id="wdl-msg">Pista secreta: antes de comparar cifra por cifra… ¡cuenta las cifras!</div>
        <div class="wdl-streak" id="wdl-streak">🔥 Racha: 0</div>
      </div>
    `;

    let A = 0, B = 0, answered = false, streak = 0;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function fmt(n) { return n.toLocaleString('en-US'); }
    function setMsg(text, cls) { const m = document.getElementById('wdl-msg'); m.innerHTML = text; m.className = 'wdl-msg' + (cls ? ' ' + cls : ''); }

    function newRound() {
      answered = false;
      const modo = rint(0, 3);
      if (modo === 0) { // distinta cantidad de cifras: la trampa clásica 99,999 vs 100,000
        const nd = rint(4, 8);
        A = rint(Math.pow(10, nd - 1), Math.pow(10, nd) - 1);
        B = rint(Math.pow(10, nd), Math.pow(10, nd + 1) - 1);
        if (rint(0, 1)) { const t = A; A = B; B = t; }
      } else if (modo === 1) { // frontera exacta: 99,999 vs 100,000
        const p = Math.pow(10, rint(3, 8));
        A = p - rint(1, 9); B = p;
        if (rint(0, 1)) { const t = A; A = B; B = t; }
      } else if (modo === 2) { // iguales
        A = rint(1000, 999999999); B = A;
      } else { // mismas cifras: comparar de izquierda a derecha
        const nd = rint(4, 9);
        A = rint(Math.pow(10, nd - 1), Math.pow(10, nd) - 1);
        const s = String(A).split('');
        const i = rint(0, s.length - 1);
        s[i] = String((parseInt(s[i], 10) + rint(1, 8)) % 10);
        if (i === 0 && s[0] === '0') s[0] = '1';
        B = parseInt(s.join(''), 10);
        if (B === A) B = A + 1;
      }
      document.getElementById('wdl-a').textContent = fmt(A);
      document.getElementById('wdl-b').textContent = fmt(B);
      document.getElementById('wdl-a-c').textContent = String(A).length + ' cifras';
      document.getElementById('wdl-b-c').textContent = String(B).length + ' cifras';
      ['wdl-mayor', 'wdl-igual', 'wdl-menor'].forEach(id => { const b = document.getElementById(id); b.disabled = false; b.classList.remove('wdl-ok', 'wdl-no'); });
      setMsg('Pista secreta: antes de comparar cifra por cifra… ¡cuenta las cifras!');
    }

    function answer(rel) {
      if (answered) return;
      answered = true;
      const correcto = A > B ? 'mayor' : A < B ? 'menor' : 'igual';
      const btns = { mayor: document.getElementById('wdl-mayor'), igual: document.getElementById('wdl-igual'), menor: document.getElementById('wdl-menor') };
      Object.values(btns).forEach(b => b.disabled = true);
      btns[correcto].classList.add('wdl-ok');
      const ca = String(A).length, cb = String(B).length;
      const regla = ca !== cb
        ? `A tiene ${ca} cifras y B tiene ${cb}: <strong>gana el de más cifras</strong>.`
        : (A === B ? 'Tienen las mismas cifras en las mismas posiciones: son iguales.' : 'Tienen igual cantidad de cifras: se compara <strong>de izquierda a derecha</strong> hasta la primera cifra diferente.');
      if (rel === correcto) {
        streak++;
        setMsg('✔ ¡Duelo ganado! ' + regla, 'ok');
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 6 && typeof pts === 'function') { awarded.add('a' + awarded.size); pts(2); }
      } else {
        btns[rel].classList.add('wdl-no');
        streak = 0;
        setMsg('💡 ' + regla, 'err');
        if (typeof sfx === 'function') sfx('no');
      }
      document.getElementById('wdl-streak').textContent = '🔥 Racha: ' + streak;
      setTimeout(newRound, 2600);
    }

    document.getElementById('wdl-mayor').addEventListener('click', () => answer('mayor'));
    document.getElementById('wdl-igual').addEventListener('click', () => answer('igual'));
    document.getElementById('wdl-menor').addEventListener('click', () => answer('menor'));

    newRound();
  }
};
