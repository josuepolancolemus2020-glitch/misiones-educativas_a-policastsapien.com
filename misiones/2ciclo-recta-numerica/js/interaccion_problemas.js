// js/interaccion_problemas.js
// Widget: Máquina de Problemas — genera problemas breves de suma y resta.
// Paso 1: decidir la operación. Paso 2: escribir el resultado.

window.WidgetProblemasJSON = {
  mount: function(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wq-container { background: #ffffff; border: 2px solid #e2ddd4; border-radius: 16px; padding: 1.3rem; font-family: 'Nunito', sans-serif; box-shadow: 0 4px 15px rgba(0,0,0,0.05); margin: 1rem 0; }
        .wq-prob { font-size: 1rem; line-height: 1.5; color: #1b2838; background: rgba(0,131,143,0.08); border-left: 4px solid #00838f; border-radius: 8px; padding: 0.8rem 1rem; margin-bottom: 0.9rem; }
        .wq-step { font-family: 'Fredoka', sans-serif; font-size: 0.85rem; color: #636e72; margin-bottom: 0.4rem; font-weight: 600; }
        .wq-ops { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.8rem; }
        .wq-op-btn { font-family: 'Fredoka', sans-serif; font-size: 0.95rem; padding: 0.5rem 1.2rem; border: 2px solid #00838f; border-radius: 20px; background: white; color: #00838f; cursor: pointer; transition: all 0.2s; font-weight: 700; }
        .wq-op-btn:hover:not(:disabled) { background: #00838f; color: white; }
        .wq-op-btn.wq-ok { background: #00b894; border-color: #00b894; color: white; }
        .wq-op-btn.wq-no { background: #d63031; border-color: #d63031; color: white; }
        .wq-ans-row { display: flex; gap: 0.6rem; align-items: center; flex-wrap: wrap; margin-bottom: 0.6rem; }
        .wq-input { font-family: 'Fira Code', monospace; font-size: 1.05rem; padding: 0.45rem 0.7rem; border: 2px solid #e2ddd4; border-radius: 10px; width: 130px; background: #fff; color: #1b2838; }
        .wq-input.wq-in-ok { border-color: #00b894; background: rgba(0,184,148,0.10); }
        .wq-input.wq-in-no { border-color: #d63031; background: rgba(214,48,49,0.08); }
        .wq-btn { font-family: 'Fredoka', sans-serif; background: #d84315; color: white; border: none; padding: 0.55rem 1.1rem; border-radius: 12px; cursor: pointer; font-size: 0.88rem; transition: transform 0.2s; }
        .wq-btn:hover:not(:disabled) { transform: translateY(-2px); }
        .wq-btn:disabled { opacity: 0.45; cursor: default; }
        .wq-btn.wq-btn-teal { background: #00838f; }
        .wq-msg { font-size: 0.88rem; color: #636e72; min-height: 2.2rem; padding: 0.4rem 0.6rem; border-radius: 8px; line-height: 1.45; }
        .wq-msg.ok { background: rgba(0,184,148,0.12); color: #006d4e; }
        .wq-msg.err { background: rgba(214,48,49,0.10); color: #a00; }
        [data-theme="dark"] .wq-container { background: #1e2130; border-color: #2d3450; }
        [data-theme="dark"] .wq-prob { color: #e8f0fe; }
        [data-theme="dark"] .wq-op-btn { background: #1e2130; }
        [data-theme="dark"] .wq-input { background: #1e2130; color: #e8f0fe; border-color: #2d3450; }
        [data-theme="dark"] .wq-msg { color: #a0aec0; }
      </style>
      <div class="wq-container">
        <div class="wq-prob" id="wq-prob"></div>
        <div class="wq-step">Paso 1 · ¿Con qué operación se resuelve?</div>
        <div class="wq-ops">
          <button class="wq-op-btn" id="wq-op-suma">➕ Con una SUMA</button>
          <button class="wq-op-btn" id="wq-op-resta">➖ Con una RESTA</button>
        </div>
        <div class="wq-step">Paso 2 · Resuelve y escribe la respuesta:</div>
        <div class="wq-ans-row">
          <input class="wq-input" id="wq-input" type="text" inputmode="numeric" autocomplete="off" placeholder="Respuesta" disabled>
          <button class="wq-btn" id="wq-check" disabled>✅ Comprobar</button>
          <button class="wq-btn wq-btn-teal" id="wq-new">🔄 Otro problema</button>
        </div>
        <div class="wq-msg" id="wq-msg">Lee el problema con calma y decide primero la operación.</div>
      </div>
    `;

    const NAMES = ['Ana', 'Luis', 'Marta', 'José', 'Carmen', 'Pedro', 'Sofía', 'Iván'];
    const OBJS = ['mangos', 'libros', 'canicas', 'boletos', 'lápices', 'tapitas'];
    const probEl = document.getElementById('wq-prob');
    const msgEl = document.getElementById('wq-msg');
    const inputEl = document.getElementById('wq-input');
    const btnCheck = document.getElementById('wq-check');
    const btnSuma = document.getElementById('wq-op-suma');
    const btnResta = document.getElementById('wq-op-resta');
    let cur = null, opChosen = false, solved = false;
    const awarded = new Set();

    function rint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function setMsg(text, cls) { msgEl.innerHTML = text; msgEl.className = 'wq-msg' + (cls ? ' ' + cls : ''); }

    function genProblem() {
      const tp = rint(0, 4);
      const n1 = NAMES[rint(0, NAMES.length - 1)];
      let n2 = NAMES[rint(0, NAMES.length - 1)];
      while (n2 === n1) n2 = NAMES[rint(0, NAMES.length - 1)];
      const obj = OBJS[rint(0, OBJS.length - 1)];
      if (tp === 0) { const a = rint(45, 480), b = rint(35, 450); return { text: `${n1} tiene ${a} ${obj} y consigue ${b} más. ¿Cuántos ${obj} tiene ahora?`, op: 'suma', a, b, ans: a + b, expr: `${a} + ${b}` }; }
      if (tp === 1) { const a = rint(200, 900), b = rint(60, a - 40); return { text: `${n1} tenía ${a} ${obj} y regaló ${b}. ¿Cuántos ${obj} le quedan?`, op: 'resta', a, b, ans: a - b, expr: `${a} − ${b}` }; }
      if (tp === 2) { const a = rint(300, 950), b = rint(80, a - 50); return { text: `${n1} quiere reunir ${a} lempiras y ya tiene ${b}. ¿Cuántos lempiras le faltan?`, op: 'resta', a, b, ans: a - b, expr: `${a} − ${b}` }; }
      if (tp === 3) { const a = rint(300, 900), b = rint(60, a - 40); return { text: `${n1} recorrió ${a} metros y ${n2} recorrió ${b}. ¿Cuántos metros más recorrió ${n1}?`, op: 'resta', a, b, ans: a - b, expr: `${a} − ${b}` }; }
      const a = rint(120, 450), b = rint(120, 450); return { text: `En la escuela hay ${a} niñas y ${b} niños. ¿Cuántos estudiantes hay en total?`, op: 'suma', a, b, ans: a + b, expr: `${a} + ${b}` };
    }

    function newRound() {
      cur = genProblem(); opChosen = false; solved = false;
      probEl.textContent = '📖 ' + cur.text;
      [btnSuma, btnResta].forEach(b => { b.disabled = false; b.className = 'wq-op-btn'; });
      inputEl.value = ''; inputEl.disabled = true; inputEl.className = 'wq-input';
      btnCheck.disabled = true;
      setMsg('Lee el problema con calma y decide primero la operación.');
    }

    function chooseOp(op, btn, otherBtn) {
      if (opChosen) return;
      opChosen = true;
      [btnSuma, btnResta].forEach(b => { b.disabled = true; });
      const isOk = op === cur.op;
      btn.classList.add(isOk ? 'wq-ok' : 'wq-no');
      if (!isOk) otherBtn.classList.add('wq-ok');
      if (isOk) {
        setMsg(`✔ ¡Correcto! Se resuelve con <strong>${cur.op}</strong>: ${cur.expr}. Ahora calcula el resultado.`, 'ok');
        if (typeof sfx === 'function') sfx('ok');
        if (awarded.size < 12 && typeof pts === 'function') { awarded.add('op' + awarded.size); pts(1); }
      } else {
        setMsg(`💡 Se resuelve con <strong>${cur.op}</strong>: ${cur.expr}. Fíjate en lo que pide el problema. Ahora calcula el resultado.`, 'err');
        if (typeof sfx === 'function') sfx('no');
      }
      inputEl.disabled = false; btnCheck.disabled = false; inputEl.focus();
    }

    btnSuma.addEventListener('click', () => chooseOp('suma', btnSuma, btnResta));
    btnResta.addEventListener('click', () => chooseOp('resta', btnResta, btnSuma));

    btnCheck.addEventListener('click', () => {
      if (solved) return;
      const raw = (inputEl.value || '').trim().replace(/[,\s]/g, '');
      const n = parseInt(raw, 10);
      if (isNaN(n)) { setMsg('Escribe un número en la casilla.', 'err'); return; }
      solved = true;
      const isOk = n === cur.ans;
      inputEl.classList.add(isOk ? 'wq-in-ok' : 'wq-in-no');
      if (isOk) {
        setMsg(`🎉 ¡Excelente! ${cur.expr} = <strong>${cur.ans}</strong>. Presiona "Otro problema" para seguir.`, 'ok');
        if (typeof sfx === 'function') sfx('fan');
        if (awarded.size < 12 && typeof pts === 'function') { awarded.add('res' + awarded.size); pts(2); }
      } else {
        setMsg(`💡 Revisa: ${cur.expr} = <strong>${cur.ans}</strong>. Alinea bien las cifras y cuida las llevadas o los préstamos.`, 'err');
        if (typeof sfx === 'function') sfx('no');
      }
    });
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') btnCheck.click(); });
    document.getElementById('wq-new').addEventListener('click', () => { if (typeof sfx === 'function') sfx('click'); newRound(); });

    newRound();
  }
};
