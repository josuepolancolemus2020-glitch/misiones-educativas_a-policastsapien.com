// js/interaccion_mixta.js
// Widget: Mixta Exprés. Convertir la mixta en impropia es un paso de diez
// segundos que se olvida en el examen y arrastra toda la operación. Aquí se
// practica contra reloj hasta que sale sin pensarlo, que es como tiene que
// salir el día de la prueba.

window.WidgetMixtaJSON = {
  mount: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <style>
        .wmx-container { background:#ffffff; border:2px solid #e2ddd4; border-radius:16px; padding:1.2rem; font-family:'Nunito',sans-serif; box-shadow:0 4px 15px rgba(0,0,0,0.05); margin:1rem 0; }
        .wmx-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:0.5rem; }
        .wmx-timer { font-family:'Fredoka',sans-serif; font-size:0.95rem; font-weight:700; color:#e17055; }
        .wmx-streak { font-family:'Fredoka',sans-serif; font-size:0.8rem; color:#636e72; }
        .wmx-mixta { font-family:'Fira Code',monospace; font-size:2rem; font-weight:700; color:#1b2838; text-align:center; margin:0.5rem 0 0.3rem; }
        .wmx-pista { font-size:0.78rem; color:#636e72; text-align:center; margin-bottom:0.8rem; }
        .wmx-opts { display:flex; gap:0.5rem; flex-wrap:wrap; justify-content:center; }
        .wmx-opt { font-family:'Fira Code',monospace; font-size:1.05rem; padding:0.5rem 1.3rem; border:2px solid #c49000; border-radius:20px; background:#fff; color:#8a6600; cursor:pointer; font-weight:700; transition:all 0.2s; }
        .wmx-opt:hover:not(:disabled) { background:#c49000; color:#fff; }
        .wmx-opt.wmx-ok { background:#00b894; border-color:#00b894; color:#fff; }
        .wmx-opt.wmx-no { background:#d63031; border-color:#d63031; color:#fff; }
        .wmx-msg { font-size:0.88rem; text-align:center; color:#636e72; min-height:2.6rem; padding:0.45rem 0.6rem; border-radius:8px; margin-top:0.7rem; line-height:1.45; }
        .wmx-msg.ok { background:rgba(0,184,148,0.12); color:#075e44; font-weight:700; }
        .wmx-msg.err { background:rgba(214,48,49,0.10); color:#8f1d1d; font-weight:700; }
        [data-theme="dark"] .wmx-container { background:#1e2130; border-color:#2d3450; }
        [data-theme="dark"] .wmx-mixta { color:#e8f0fe; }
        [data-theme="dark"] .wmx-opt { background:#1e2130; color:#f0c674; }
        [data-theme="dark"] .wmx-msg { color:#a0aec0; }
        [data-theme="dark"] .wmx-msg.ok { color:#7dedc9; }
        [data-theme="dark"] .wmx-msg.err { color:#ffb3b3; }
      </style>
      <div class="wmx-container">
        <div class="wmx-top">
          <span class="wmx-timer" id="wmx-timer">⏳ 12</span>
          <span class="wmx-streak" id="wmx-streak">🔥 Racha: 0</span>
        </div>
        <div class="wmx-mixta" id="wmx-mixta"></div>
        <div class="wmx-pista">entero × denominador + numerador, sobre el mismo denominador</div>
        <div class="wmx-opts" id="wmx-opts"></div>
        <div class="wmx-msg" id="wmx-msg">Conviértela en impropia antes de que se acabe el tiempo.</div>
      </div>`;

    const mxEl = document.getElementById('wmx-mixta');
    const optsEl = document.getElementById('wmx-opts');
    const msgEl = document.getElementById('wmx-msg');
    const tmEl = document.getElementById('wmx-timer');
    const stEl = document.getElementById('wmx-streak');
    let cur = null, answered = false, streak = 0, seg = 12, tick = null;
    const awarded = new Set();
    const rint = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    function parar() { if (tick) { clearInterval(tick); tick = null; } }

    function correr() {
      parar(); seg = 12; tmEl.textContent = '⏳ ' + seg;
      tick = setInterval(() => {
        seg--; tmEl.textContent = '⏳ ' + seg;
        if (seg <= 0) { parar(); if (!answered) fallar(null, true); }
      }, 1000);
    }

    function nueva() {
      const e = rint(1, 6), d = rint(2, 9), n = rint(1, d - 1);
      cur = { e, n, d, imp: e * d + n };
      answered = false;
      mxEl.innerHTML = `${e} <span style="font-size:0.75em">${n}/${d}</span>`;
      const buenas = [cur.imp + '/' + d];
      const cand = [(e * d) + '/' + d, ('' + e + n) + '/' + d, (e + n) + '/' + d, (e * d + n) + '/' + (d + n)];
      cand.forEach(x => { if (!buenas.includes(x) && buenas.length < 3) buenas.push(x); });
      const ops = buenas.sort(() => Math.random() - 0.5);
      optsEl.innerHTML = '';
      ops.forEach(txt => {
        const b = document.createElement('button');
        b.className = 'wmx-opt'; b.textContent = txt;
        b.onclick = () => responder(b, txt);
        optsEl.appendChild(b);
      });
      msgEl.className = 'wmx-msg';
      msgEl.textContent = 'Conviértela en impropia antes de que se acabe el tiempo.';
      correr();
    }

    function marcarBuena() {
      const bueno = cur.imp + '/' + cur.d;
      optsEl.querySelectorAll('.wmx-opt').forEach(b => {
        b.disabled = true;
        if (b.textContent === bueno) b.classList.add('wmx-ok');
      });
    }

    function fallar(btn, porTiempo) {
      answered = true; parar(); streak = 0; marcarBuena();
      if (btn) btn.classList.add('wmx-no');
      msgEl.className = 'wmx-msg err';
      msgEl.innerHTML = `${porTiempo ? '⏰ Se acabó el tiempo. ' : '💡 '}Era <strong>${cur.imp}/${cur.d}</strong>: ${cur.e}×${cur.d} = ${cur.e * cur.d}, más ${cur.n} da ${cur.imp}, y el denominador no cambia.`;
      if (typeof sfx === 'function') sfx('no');
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 3000);
    }

    function responder(btn, txt) {
      if (answered) return;
      const bueno = cur.imp + '/' + cur.d;
      if (txt !== bueno) { fallar(btn, false); return; }
      answered = true; parar(); streak++; marcarBuena();
      msgEl.className = 'wmx-msg ok';
      msgEl.innerHTML = `✔ ¡Exacto! ${cur.e}×${cur.d}+${cur.n} = <strong>${cur.imp}</strong>, sobre ${cur.d}. Ahora ya se puede multiplicar o dividir.`;
      if (typeof sfx === 'function') sfx('ok');
      if (awarded.size < 6 && typeof pts === 'function') { awarded.add('m' + awarded.size); pts(2); }
      stEl.textContent = '🔥 Racha: ' + streak;
      setTimeout(nueva, 2600);
    }

    nueva();
  }
};
