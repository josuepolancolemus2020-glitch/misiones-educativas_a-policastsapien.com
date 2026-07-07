/* =====================================================================
   M.E.T.A.S — metas-presentacion.js
   Accesibilidad de aula compartida por todas las misiones:

   - Letra grande PREDETERMINADA: la misión siempre arranca con la letra
     grande; el botón "🔎 Letra" la vuelve pequeña (y viceversa).
   - 📽️ Modo presentación (proyector): proporciones Normal / 16:9 / 4:3 /
     1:1 / 3:4 / 9:16 + control A−/A+ de escala (120%–220%). Escala todo
     desde la raíz (el CSS de las misiones usa rem) y encaja el contenido
     al ancho de la proporción. 16:9 y 4:3 activan pantalla completa.
   - 📖 Modo libro: cada tarjeta de la sección activa es una página; se
     pasa deslizando, con la barrita ⟨ n/m ⟩ al pie (se esconde sola) o
     con las flechas del teclado. En los extremos salta de sección.

   Las preferencias son GLOBALES (localStorage): se calibra el proyector
   una vez y aplica a todas las misiones del dispositivo.

   Uso en cada misión (después de los scripts propios de la misión):
     <script src="../../js/metas-presentacion.js"></script>
   ===================================================================== */
(function () {
  'use strict';

  var PRESENTA_KEY = 'METAS_PRESENTA';
  var ZOOM_KEY = 'METAS_PRESENTA_ZOOM';
  var LIBRO_KEY = 'METAS_LIBRO';

  function guardar(clave, valor) { try { localStorage.setItem(clave, valor); } catch (e) {} }
  function leer(clave) { try { return localStorage.getItem(clave); } catch (e) { return null; } }
  function suena() { if (typeof window.sfx === 'function') window.sfx('click'); }

  // ---------- estilos (con respaldo por si una misión no define la variable) ----------
  var CSS =
    /* letra grande genérica (las misiones con reglas propias las conservan) */
    'body.letra-grande p,body.letra-grande span,body.letra-grande li,body.letra-grande h2,body.letra-grande h3{font-size:125%!important;line-height:1.6;}' +
    /* modo presentación */
    'html[data-presenta] .main{transition:max-width 0.3s ease;}' +
    'html[data-presenta="169"] .main{max-width:min(96vw,calc(100vh*16/9));}' +
    'html[data-presenta="43"] .main{max-width:min(96vw,calc(100vh*4/3));}' +
    'html[data-presenta="11"] .main{max-width:min(96vw,100vh);}' +
    'html[data-presenta="34"] .main{max-width:min(96vw,calc(100vh*3/4));}' +
    'html[data-presenta="916"] .main{max-width:min(96vw,calc(100vh*9/16));}' +
    '.presenta-menu{position:fixed;right:0.8rem;bottom:3.4rem;z-index:1200;display:none;flex-direction:column;gap:0.3rem;background:var(--card,#fff);border:2px solid var(--pri,#1565c0);border-radius:14px;padding:0.5rem;box-shadow:0 8px 24px rgba(0,0,0,0.25);}' +
    '.presenta-menu.open{display:flex;}' +
    '.presenta-menu button{border:none;border-radius:9px;padding:0.5rem 0.9rem;background:var(--pri-gl,#e3f2fd);color:var(--pri,#1565c0);font-family:inherit;font-size:0.9rem;font-weight:700;cursor:pointer;text-align:left;}' +
    '.presenta-menu button:hover,.presenta-menu button.active{background:var(--pri,#1565c0);color:#fff;}' +
    '.presenta-zoom{display:flex;align-items:center;justify-content:space-between;gap:0.4rem;margin-top:0.3rem;padding-top:0.4rem;border-top:1.5px dashed var(--border,#dfe6e9);}' +
    '.presenta-zoom button{border:none;border-radius:9px;padding:0.45rem 0.8rem;background:var(--pri,#1565c0);color:#fff;font-family:inherit;font-size:0.95rem;font-weight:800;cursor:pointer;}' +
    '.presenta-zoom span{font-size:0.85rem;font-weight:700;color:var(--pri,#1565c0);min-width:3.2rem;text-align:center;}' +
    /* modo libro */
    '.modo-libro .card.libro-oculta{display:none!important;}' +
    '.modo-libro nav.nav{margin-bottom:2.8rem;}' +
    '.modo-libro footer{padding-bottom:2.8rem;}' +
    '.libro-entra-der{animation:libroDer 0.35s ease;}' +
    '.libro-entra-izq{animation:libroIzq 0.35s ease;}' +
    '@keyframes libroDer{from{opacity:0;transform:translateX(60px);}to{opacity:1;transform:none;}}' +
    '@keyframes libroIzq{from{opacity:0;transform:translateX(-60px);}to{opacity:1;transform:none;}}' +
    '.libro-barra{position:fixed;bottom:0.5rem;left:50%;transform:translateX(-50%);z-index:1100;display:flex;align-items:center;gap:0.05rem;background:var(--pri,#1565c0);border-radius:999px;padding:0.08rem 0.22rem;opacity:0.35;transition:opacity 0.4s;box-shadow:0 2px 8px rgba(0,0,0,0.18);}' +
    '.libro-barra:hover,.libro-barra:focus-within{opacity:1;}' +
    '.libro-barra.libro-escondida{opacity:0;pointer-events:none;}' +
    '.libro-paso{border:none;background:transparent;color:#fff;font-size:0.9rem;font-weight:800;cursor:pointer;padding:0.12rem 0.5rem;border-radius:999px;line-height:1;}' +
    '.libro-paso:hover{background:rgba(255,255,255,0.18);}' +
    '.libro-contador{color:#fff;font-size:0.7rem;font-weight:700;padding:0 0.25rem;pointer-events:none;white-space:nowrap;}';

  // ---------- letra grande predeterminada ----------
  // La misión siempre arranca con letra grande; "🔎 Letra" la vuelve pequeña.
  function letraGrandePredeterminada() {
    document.body.classList.add('letra-grande');
  }
  // Las 3 misiones sin botón Letra propio reciben uno equivalente
  function asegurarBotonLetra(tools) {
    if (typeof window.toggleLetra === 'function') return;
    window.toggleLetra = function () {
      document.body.classList.toggle('letra-grande');
      suena();
    };
    var b = document.createElement('button');
    b.className = 'cred-btn';
    b.type = 'button';
    b.textContent = '🔎 Letra';
    b.addEventListener('click', window.toggleLetra);
    tools.appendChild(b);
  }

  // ---------- modo presentación ----------
  var zoom = (function () {
    var z = parseInt(leer(ZOOM_KEY), 10);
    return (z >= 120 && z <= 220) ? z : 150;
  })();
  var MODOS = [
    ['', '🖥️ Normal'],
    ['169', '📽️ Panorámico 16:9'],
    ['43', '🖥️ Horizontal 4:3'],
    ['11', '⬜ Cuadrado 1:1'],
    ['34', '📱 Vertical 3:4'],
    ['916', '📲 Historia 9:16']
  ];
  function aplicarZoom() {
    var activo = document.documentElement.hasAttribute('data-presenta');
    document.documentElement.style.fontSize = activo ? zoom + '%' : '';
    var lbl = document.getElementById('presentaZoomLbl');
    if (lbl) lbl.textContent = zoom + '%';
  }
  function cambiarZoom(delta) {
    zoom = Math.min(220, Math.max(120, zoom + delta));
    guardar(ZOOM_KEY, zoom);
    aplicarZoom();
    suena();
  }
  function setPresenta(modo) {
    if (modo) document.documentElement.setAttribute('data-presenta', modo);
    else document.documentElement.removeAttribute('data-presenta');
    aplicarZoom();
    guardar(PRESENTA_KEY, modo);
    var menu = document.getElementById('presentaMenu');
    if (menu) {
      menu.classList.remove('open');
      menu.querySelectorAll('button[data-modo]').forEach(function (b) {
        b.classList.toggle('active', b.getAttribute('data-modo') === modo);
      });
    }
    if (modo === '169' || modo === '43') {
      if (document.documentElement.requestFullscreen && !document.fullscreenElement)
        document.documentElement.requestFullscreen().catch(function () {});
    } else if (!modo && document.fullscreenElement) {
      document.exitFullscreen().catch(function () {});
    }
    suena();
  }
  function togglePresenta() {
    var menu = document.getElementById('presentaMenu');
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'presentaMenu';
      menu.className = 'presenta-menu';
      menu.setAttribute('role', 'menu');
      menu.setAttribute('aria-label', 'Modo presentación');
      var actual = document.documentElement.getAttribute('data-presenta') || '';
      MODOS.forEach(function (par) {
        var b = document.createElement('button');
        b.type = 'button'; b.textContent = par[1]; b.setAttribute('data-modo', par[0]);
        if (par[0] === actual) b.classList.add('active');
        b.addEventListener('click', function () { setPresenta(par[0]); });
        menu.appendChild(b);
      });
      var libroBtn = document.createElement('button');
      libroBtn.type = 'button'; libroBtn.id = 'libroBtnMenu';
      libroBtn.textContent = '📖 Libro (deslizar páginas)';
      libroBtn.classList.toggle('active', libroActivo());
      libroBtn.addEventListener('click', toggleLibro);
      menu.appendChild(libroBtn);
      var fila = document.createElement('div');
      fila.className = 'presenta-zoom';
      var menos = document.createElement('button');
      menos.type = 'button'; menos.textContent = 'A−'; menos.setAttribute('aria-label', 'Letra más pequeña');
      menos.addEventListener('click', function () { cambiarZoom(-15); });
      var lbl = document.createElement('span');
      lbl.id = 'presentaZoomLbl'; lbl.textContent = zoom + '%';
      var mas = document.createElement('button');
      mas.type = 'button'; mas.textContent = 'A+'; mas.setAttribute('aria-label', 'Letra más grande');
      mas.addEventListener('click', function () { cambiarZoom(15); });
      fila.appendChild(menos); fila.appendChild(lbl); fila.appendChild(mas);
      menu.appendChild(fila);
      document.body.appendChild(menu);
    }
    menu.classList.toggle('open');
    suena();
  }

  // ---------- modo libro ----------
  var libroPag = 0;
  var libroEntrarPorElFinal = false;
  var barraTimer = null;
  function libroActivo() { return document.body.classList.contains('modo-libro'); }
  function libroCartas() {
    var sec = document.querySelector('.sec.active');
    return sec ? Array.prototype.slice.call(sec.querySelectorAll(':scope > .card')) : [];
  }
  function barraAsoma() {
    var ui = document.getElementById('libroUI');
    if (!ui || !libroActivo()) return;
    ui.classList.remove('libro-escondida');
    clearTimeout(barraTimer);
    barraTimer = setTimeout(function () {
      if (ui.matches(':hover')) { barraAsoma(); return; }
      ui.classList.add('libro-escondida');
    }, 3000);
  }
  ['touchstart', 'mousemove', 'scroll', 'keydown'].forEach(function (ev) {
    document.addEventListener(ev, function () { if (libroActivo()) barraAsoma(); }, { passive: true });
  });
  function libroPinta(dir) {
    var cartas = libroCartas();
    var lbl = document.getElementById('libroContador');
    if (!cartas.length) { if (lbl) lbl.textContent = ''; return; }
    libroPag = Math.min(Math.max(libroPag, 0), cartas.length - 1);
    cartas.forEach(function (c, i) {
      c.classList.toggle('libro-oculta', i !== libroPag);
      c.classList.remove('libro-entra-der', 'libro-entra-izq');
    });
    if (dir) { void cartas[libroPag].offsetWidth; cartas[libroPag].classList.add(dir > 0 ? 'libro-entra-der' : 'libro-entra-izq'); }
    var tab = document.querySelector('.nav-t.active[data-s]');
    if (lbl) lbl.textContent = (tab ? tab.textContent.trim() + ' · ' : '') + (libroPag + 1) + '/' + cartas.length;
    barraAsoma();
    // widgets que se miden al mostrarse (sopa, gráficos) recalculan
    window.dispatchEvent(new Event('resize'));
  }
  function libroMueve(delta) {
    if (!libroActivo()) return;
    var cartas = libroCartas();
    var destino = libroPag + delta;
    if (destino >= 0 && destino < cartas.length) {
      libroPag = destino;
      libroPinta(delta);
      window.scrollTo({ top: 0 });
    } else if (typeof window.go === 'function') {
      var secs = Array.prototype.slice.call(document.querySelectorAll('.nav-t[data-s]')).map(function (b) { return b.getAttribute('data-s'); });
      var activa = document.querySelector('.sec.active');
      var idx = secs.indexOf(activa ? activa.id : '');
      var sig = idx + (delta > 0 ? 1 : -1);
      if (sig < 0 || sig >= secs.length) return; // portada o contraportada
      libroEntrarPorElFinal = delta < 0;
      window.go(secs[sig]);
    }
    suena();
  }
  function toggleLibro() {
    var on = !libroActivo();
    document.body.classList.toggle('modo-libro', on);
    guardar(LIBRO_KEY, on);
    var ui = document.getElementById('libroUI');
    if (on) {
      if (!ui) {
        ui = document.createElement('div');
        ui.id = 'libroUI';
        ui.className = 'libro-barra';
        ui.innerHTML = '<button type="button" class="libro-paso libro-izq" aria-label="Página anterior">⟨</button>' +
          '<span id="libroContador" class="libro-contador" aria-live="polite"></span>' +
          '<button type="button" class="libro-paso libro-der" aria-label="Página siguiente">⟩</button>';
        document.body.appendChild(ui);
        ui.querySelector('.libro-izq').addEventListener('click', function () { libroMueve(-1); });
        ui.querySelector('.libro-der').addEventListener('click', function () { libroMueve(1); });
      }
      ui.style.display = '';
      libroPag = 0;
      libroPinta(0);
    } else {
      if (ui) ui.style.display = 'none';
      document.querySelectorAll('.card.libro-oculta').forEach(function (c) {
        c.classList.remove('libro-oculta', 'libro-entra-der', 'libro-entra-izq');
      });
    }
    var mb = document.getElementById('libroBtnMenu');
    if (mb) mb.classList.toggle('active', on);
    suena();
  }
  // al cambiar de sección (nav, botones "siguiente", fin, etc.) se repagina
  if (typeof window.go === 'function') {
    var goOrig = window.go;
    window.go = function (id) {
      var r = goOrig.apply(this, arguments);
      if (libroActivo()) {
        libroPag = libroEntrarPorElFinal ? 1e9 : 0;
        libroEntrarPorElFinal = false;
        libroPinta(0);
      }
      return r;
    };
  }
  // deslizar de lado a lado (se ignora sobre la sopa, campos y la barrita)
  var tX = null, tY = null;
  document.addEventListener('touchstart', function (e) {
    if (!libroActivo() || !e.touches || !e.touches.length) return;
    tX = e.touches[0].clientX; tY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (!libroActivo() || tX === null || !e.changedTouches || !e.changedTouches.length) return;
    if (e.target && e.target.closest && e.target.closest('.sopa-grid, input, textarea, select, canvas, .libro-paso')) { tX = null; return; }
    var t = e.changedTouches[0];
    var dx = t.clientX - tX, dy = t.clientY - tY;
    tX = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) libroMueve(dx < 0 ? 1 : -1);
  }, { passive: true });
  document.addEventListener('keydown', function (e) {
    if (!libroActivo()) return;
    if (document.activeElement && /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight') libroMueve(1);
    else if (e.key === 'ArrowLeft') libroMueve(-1);
  });

  // ---------- arranque ----------
  function iniciar() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    letraGrandePredeterminada();
    var tools = document.querySelector('.cred-tools');
    if (tools) {
      asegurarBotonLetra(tools);
      var b = document.createElement('button');
      b.className = 'cred-btn';
      b.id = 'presentaBtn';
      b.type = 'button';
      b.textContent = '📽️ Presentación';
      b.addEventListener('click', togglePresenta);
      tools.appendChild(b);
    }
    var m = leer(PRESENTA_KEY);
    if (m) { document.documentElement.setAttribute('data-presenta', m); aplicarZoom(); }
    if (leer(LIBRO_KEY) === 'true') toggleLibro();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  window.METAS_PRESENTA = { setPresenta: setPresenta, togglePresenta: togglePresenta, toggleLibro: toggleLibro, libroMueve: libroMueve };
})();
