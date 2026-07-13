/* Instalar como app (PWA) — M.E.T.A.S, jul 2026
   Botón flotante que aparece cuando el navegador permite instalar la app.
   - Android/Chrome y PC/Chrome-Edge: usa el evento beforeinstallprompt (1 clic).
   - iPhone/iPad (Safari): muestra instrucciones (Compartir -> Agregar a inicio).
   - Si ya está instalada (standalone), no aparece. */
(function () {
  'use strict';
  var deferred = null;

  function isStandalone() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
           window.navigator.standalone === true;
  }
  if (isStandalone()) return;

  var ua = navigator.userAgent || '';
  var isIOS = /iphone|ipad|ipod/i.test(ua);
  var isSafari = isIOS && /safari/i.test(ua) && !/crios|fxios|opios|edgios/i.test(ua);

  function injectStyle() {
    if (document.getElementById('metasInstallCss')) return;
    var s = document.createElement('style');
    s.id = 'metasInstallCss';
    s.textContent =
      '#metasInstallBtn{position:fixed;right:16px;bottom:16px;z-index:2147483000;' +
      'background:#114494;color:#fff;border:none;border-radius:999px;padding:12px 18px;' +
      'font-family:inherit;font-size:1rem;font-weight:700;line-height:1;' +
      'box-shadow:0 4px 14px rgba(0,0,0,.28);cursor:pointer;display:none;' +
      'align-items:center;gap:8px;max-width:calc(100vw - 32px)}' +
      '#metasInstallBtn:hover{background:#0d3576}#metasInstallBtn:active{transform:scale(.97)}' +
      '#metasIosSheet{position:fixed;inset:0;z-index:2147483001;background:rgba(0,0,0,.55);' +
      'display:none;align-items:flex-end;justify-content:center}' +
      '#metasIosSheet.open{display:flex}' +
      '#metasIosSheet .card{background:#fff;color:#1a1a1a;width:100%;max-width:480px;' +
      'border-radius:18px 18px 0 0;padding:20px 20px 28px;font-family:inherit;' +
      'font-size:1rem;line-height:1.5;box-shadow:0 -6px 24px rgba(0,0,0,.3)}' +
      '#metasIosSheet h3{margin:0 0 10px;font-size:1.15rem;color:#114494}' +
      '#metasIosSheet ol{margin:0 0 14px;padding-left:22px}#metasIosSheet li{margin:6px 0}' +
      '#metasIosSheet button{width:100%;background:#114494;color:#fff;border:none;' +
      'border-radius:12px;padding:12px;font-family:inherit;font-size:1rem;font-weight:700;cursor:pointer}' +
      '@media print{#metasInstallBtn{display:none!important}}';
    document.head.appendChild(s);
  }

  function makeBtn() {
    injectStyle();
    var b = document.getElementById('metasInstallBtn');
    if (b) return b;
    b = document.createElement('button');
    b.id = 'metasInstallBtn';
    b.type = 'button';
    b.textContent = '📲 Instalar app';
    b.setAttribute('aria-label', 'Instalar la aplicación M.E.T.A.S');
    document.body.appendChild(b);
    return b;
  }

  function iosSheet() {
    injectStyle();
    var w = document.getElementById('metasIosSheet');
    if (w) return w;
    w = document.createElement('div');
    w.id = 'metasIosSheet';
    w.innerHTML =
      '<div class="card" role="dialog" aria-modal="true" aria-label="Instalar la app">' +
      '<h3>📲 Instalar M.E.T.A.S</h3>' +
      '<ol><li>Toca el botón <b>Compartir</b> (el cuadro con la flecha hacia arriba) en la barra de Safari.</li>' +
      '<li>Desliza y elige <b>&laquo;Agregar a inicio&raquo;</b>.</li>' +
      '<li>Toca <b>&laquo;Agregar&raquo;</b>.</li></ol>' +
      '<p>Tendr&aacute;s el &iacute;cono de M.E.T.A.S en tu pantalla, como una app normal.</p>' +
      '<button type="button" id="metasIosClose">Entendido</button></div>';
    document.body.appendChild(w);
    w.addEventListener('click', function (e) { if (e.target === w) w.classList.remove('open'); });
    w.querySelector('#metasIosClose').addEventListener('click', function () { w.classList.remove('open'); });
    return w;
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    var b = makeBtn();
    b.style.display = 'flex';
    b.onclick = function () {
      if (!deferred) return;
      deferred.prompt();
      var choice = deferred.userChoice;
      var done = function () { deferred = null; b.style.display = 'none'; };
      if (choice && choice.then) { choice.then(done, done); } else { done(); }
    };
  });

  window.addEventListener('appinstalled', function () {
    var b = document.getElementById('metasInstallBtn');
    if (b) b.style.display = 'none';
    deferred = null;
  });

  if (isIOS && isSafari) {
    var start = function () {
      var b = makeBtn();
      b.style.display = 'flex';
      b.onclick = function () { iosSheet().classList.add('open'); };
    };
    if (document.body) { start(); } else { window.addEventListener('DOMContentLoaded', start); }
  }
})();
