/* ============================================================
   M.E.T.A.S · Solo para el maestro registrado
   ------------------------------------------------------------
   Las misiones del maestro y sus fichas se anuncian como «solo las ve
   el maestro registrado», pero quien lo comprobaba era la portada: no
   mostraba el botón ni la lista sin cuenta. La misión en sí no miraba
   nada, y con la dirección en la mano se abría igual.

   Este guion va en el <head> de cada misión del maestro y de cada
   ficha suya, y hace la MISMA comprobación que la portada
   (`mfLogueado`, en js/tools/formacion-docente.js): que en este
   teléfono haya una cuenta de maestro guardada.

   · Con cuenta: no hace nada. Ni un paso nuevo, ni una espera.
   · Sin cuenta: tapa la página y dice dónde entrar.

   ⚠️ Es un candado de cortesía, no de seguridad. El sitio es de
   archivos sueltos: quien sepa buscar puede leer el archivo de la
   misión sin pasar por aquí. Sirve para que un alumno o un curioso que
   llega con el enlace no se encuentre dentro, que es lo que la portada
   promete. Lo que de verdad no deba leerse no puede vivir en una
   página: tendría que servirse desde la nube con la sesión.

   Va en el <head> y sin `defer` a propósito: tiene que decidir ANTES
   del primer pintado, o quien no tiene cuenta vería la misión un
   instante antes de que se tape.
   ============================================================ */
(function () {
  'use strict';

  /* La misma llave y la misma condición que la portada. Si allá cambia,
     cambia aquí: lo vigila _dev/verifica-solo-docente.js. */
  function conCuenta() {
    try { var d = JSON.parse(localStorage.getItem('METAS_DOCENTE_V1')); return !!(d && d.codigo); }
    catch (e) { return false; }
  }
  if (conCuenta()) return;

  /* La portada, desde donde esté esta página: se saca de la dirección de
     este mismo guion (js/solo-docente.js), que siempre cuelga de la raíz. */
  var portada = '../index.html';
  try { portada = new URL('../index.html', document.currentScript.src).href; } catch (e) { /* queda la relativa */ }

  /* Se tapa TODO lo de la página, también en papel: una ficha impresa
     sin cuenta saldría en blanco con el aviso, no con su contenido. */
  var raiz = document.documentElement;
  raiz.classList.add('solo-docente');
  var estilo = document.createElement('style');
  estilo.textContent =
    'html.solo-docente body > *:not(#solo-docente-aviso){display:none !important}' +
    'html.solo-docente body{background:#f1f5f9 !important;margin:0}' +
    '#solo-docente-aviso{max-width:420px;margin:0 auto;padding:64px 20px;text-align:center;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#0f172a}' +
    '#solo-docente-aviso .sd-icono{font-size:3rem;line-height:1;margin:0 0 16px}' +
    '#solo-docente-aviso h1{font-size:1.4rem;font-weight:800;margin:0 0 10px;color:#0f172a}' +
    '#solo-docente-aviso p{font-size:1rem;line-height:1.5;margin:0 0 28px;color:#475569}' +
    '#solo-docente-aviso a{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 28px;border-radius:14px;background:#1e3a7c;color:#fff;font-size:1rem;font-weight:700;text-decoration:none}' +
    '#solo-docente-aviso a:focus-visible{outline:3px solid #3b82f6;outline-offset:3px}';
  (document.head || raiz).appendChild(estilo);

  function avisar() {
    if (document.getElementById('solo-docente-aviso')) return;
    var aviso = document.createElement('main');
    aviso.id = 'solo-docente-aviso';
    aviso.innerHTML =
      '<p class="sd-icono" aria-hidden="true">🔒</p>' +
      '<h1>Solo para el maestro registrado</h1>' +
      '<p>Esta página es de formación docente. Entra con tu cuenta de maestro y vuelve a abrir este enlace.</p>';
    var boton = document.createElement('a');
    boton.href = portada;
    boton.textContent = 'Entrar a M.E.T.A.S';
    aviso.appendChild(boton);
    document.body.insertBefore(aviso, document.body.firstChild);
    document.title = 'Solo para el maestro registrado · M.E.T.A.S';
    if (boton.focus) boton.focus();
  }
  if (document.body) avisar();
  else document.addEventListener('DOMContentLoaded', avisar);
})();
