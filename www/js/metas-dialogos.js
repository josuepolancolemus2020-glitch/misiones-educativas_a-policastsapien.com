/* ══════════════════════════════════════════════════════════════
   VENTANAS M.E.T.A.S — reemplazo con marca propia de los diálogos
   nativos alert/confirm/prompt (que muestran la dirección del sitio
   y se ven poco profesionales, y en algunos navegadores móviles
   bloquean el segundo prompt seguido).

   API (todas devuelven Promise → usar con await):
     metasAlert(mensaje, {icono, titulo, okTxt})            → true
     metasConfirm(mensaje, {icono, titulo, okTxt, cancelTxt}) → true/false
     metasPrompt(mensaje, {icono, titulo, placeholder, value,
                           type, inputmode, maxlength,
                           okTxt, cancelTxt})               → texto | null
   Enter = Aceptar · Escape/fondo = Cancelar · 100% offline.
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const CSS = `
  .mdlg-backdrop {
    position: fixed; inset: 0; z-index: 99990;
    background: rgba(15, 23, 42, .55);
    display: flex; align-items: center; justify-content: center;
    padding: 18px; animation: mdlgFade .18s ease;
  }
  @keyframes mdlgFade { from { opacity: 0; } to { opacity: 1; } }
  .mdlg-card {
    background: #fff; color: #1c2733;
    width: 100%; max-width: 380px;
    border-radius: 18px; overflow: hidden;
    box-shadow: 0 18px 50px rgba(0,0,0,.35);
    animation: mdlgPop .2s ease;
    font-family: inherit;
  }
  @keyframes mdlgPop { from { transform: scale(.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .mdlg-head {
    display: flex; align-items: center; gap: 10px;
    background: #1e3a7c; color: #fff;
    padding: 12px 16px;
  }
  .mdlg-head-icon { font-size: 22px; }
  .mdlg-head-title { font-weight: 800; font-size: 15px; letter-spacing: .3px; }
  .mdlg-head-brand { margin-left: auto; font-size: 11px; font-weight: 800; opacity: .85; letter-spacing: 1px; }
  .mdlg-body { padding: 16px; font-size: 15px; line-height: 1.55; }
  .mdlg-body strong { color: #1e3a7c; }
  .mdlg-input {
    display: block; width: 100%; box-sizing: border-box;
    margin-top: 12px; padding: 12px 14px;
    font-size: 18px; font-weight: 700;
    border: 2px solid #cbd5e1; border-radius: 12px; outline: none;
    background: #f8fafc; color: #1c2733;
  }
  .mdlg-input:focus { border-color: #1e3a7c; background: #fff; }
  .mdlg-err { color: #b91c1c; font-size: 12.5px; font-weight: 700; margin: 6px 0 0; min-height: 16px; }
  .mdlg-btns {
    display: flex; gap: 10px; padding: 0 16px 16px;
  }
  .mdlg-btn {
    flex: 1; border: none; border-radius: 12px; cursor: pointer;
    padding: 12px 10px; font-size: 15px; font-weight: 800;
    transition: transform .12s;
  }
  .mdlg-btn:active { transform: scale(.96); }
  .mdlg-ok { background: #1e3a7c; color: #fff; }
  .mdlg-cancel { background: #eef2f7; color: #475569; }
  `;

  let _abierto = null;

  function _prep() {
    if (!document.getElementById('mdlg-css')) {
      const st = document.createElement('style');
      st.id = 'mdlg-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
  }

  function _esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  /* El mensaje admite texto plano con saltos de línea y **negritas** */
  function _fmt(msg) {
    return _esc(msg)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  function _abrir(o) {
    _prep();
    /* si quedó una ventana abierta, se cierra como cancelada */
    if (_abierto) { _abierto(null); _abierto = null; }

    return new Promise(resolve => {
      const back = document.createElement('div');
      back.className = 'mdlg-backdrop';
      back.innerHTML = `
        <div class="mdlg-card" role="dialog" aria-modal="true">
          <div class="mdlg-head">
            <span class="mdlg-head-icon">${_esc(o.icono || '🎓')}</span>
            <span class="mdlg-head-title">${_esc(o.titulo || 'M.E.T.A.S')}</span>
            <span class="mdlg-head-brand">M.E.T.A.S</span>
          </div>
          <div class="mdlg-body">
            ${_fmt(o.msg || '')}
            ${o.input ? `
              <input class="mdlg-input" id="mdlg-inp"
                type="${_esc(o.type || 'text')}"
                inputmode="${_esc(o.inputmode || 'text')}"
                ${o.maxlength ? `maxlength="${+o.maxlength}"` : ''}
                placeholder="${_esc(o.placeholder || '')}"
                value="${_esc(o.value || '')}"
                autocomplete="off" autocapitalize="off">
              <p class="mdlg-err" id="mdlg-err"></p>` : ''}
          </div>
          <div class="mdlg-btns">
            ${o.soloOk ? '' : `<button class="mdlg-btn mdlg-cancel" id="mdlg-cancel">${_esc(o.cancelTxt || 'Cancelar')}</button>`}
            <button class="mdlg-btn mdlg-ok" id="mdlg-ok">${_esc(o.okTxt || 'Aceptar')}</button>
          </div>
        </div>`;
      document.body.appendChild(back);

      const inp = back.querySelector('#mdlg-inp');
      const cerrar = valor => {
        _abierto = null;
        document.removeEventListener('keydown', onKey, true);
        back.remove();
        resolve(valor);
      };
      _abierto = cerrar;

      const aceptar = () => {
        if (!o.input) { cerrar(true); return; }
        const v = inp ? inp.value : '';
        if (o.valida) {
          const err = o.valida(v);
          if (err) {
            const e = back.querySelector('#mdlg-err');
            if (e) e.textContent = err;
            if (inp) inp.focus();
            return;
          }
        }
        cerrar(v);
      };
      const cancelar = () => cerrar(o.input ? null : (o.soloOk ? true : false));

      back.querySelector('#mdlg-ok').addEventListener('click', aceptar);
      const bc = back.querySelector('#mdlg-cancel');
      if (bc) bc.addEventListener('click', cancelar);
      back.addEventListener('click', e => { if (e.target === back) cancelar(); });

      const onKey = e => {
        if (e.key === 'Escape') { e.preventDefault(); cancelar(); }
        if (e.key === 'Enter' && (o.input || !(e.target && e.target.closest && e.target.closest('button')))) { e.preventDefault(); aceptar(); }
      };
      document.addEventListener('keydown', onKey, true);

      // Al abrir, enfocar y SELECCIONAR el texto precargado: así, si el
      // campo ya trae un valor (p. ej. el monto 600), escribir lo reemplaza
      // de una en el teléfono, en vez de acumularse ("600500") o costar borrar.
      setTimeout(() => {
        if (!inp) return;
        inp.focus();
        try { if (inp.value) inp.select(); } catch (_) {}
      }, 60);
    });
  }

  window.metasAlert = (msg, o) =>
    _abrir(Object.assign({ msg, soloOk: true, icono: 'ℹ️', okTxt: 'Entendido' }, o || {}));

  window.metasConfirm = (msg, o) =>
    _abrir(Object.assign({ msg, icono: '❓', okTxt: 'Sí' }, o || {}));

  window.metasPrompt = (msg, o) =>
    _abrir(Object.assign({ msg, input: true, icono: '✏️' }, o || {}));
})();
