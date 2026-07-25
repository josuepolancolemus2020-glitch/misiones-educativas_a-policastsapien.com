/* ============================================================
   M.E.T.A.S · Motor de idioma para las misiones
   ------------------------------------------------------------
   Traducción de autor empaquetada con la misión: NO llama a
   ningún servicio de traducción, funciona sin internet y dentro
   del APK. El español es la fuente; el inglés vive en un archivo
   hermano  <mision>-en.js  que define window.MISION_EN.

   La misión se traduce por tres vías, de mayor a menor calidad:

   1. BLOQUES  — cada bloque estático de la misión lleva
      data-i18n="clave" y MISION_EN.html['clave'] trae su HTML en
      inglés ya redactado (con sus <strong>, tablas y emojis).
   2. BANCOS   — flashcards, quizzes, retos y bancos de examen se
      cambian en bloque: la misión expone MISION_APLICAR_IDIOMA()
      y este motor le pasa MISION_EN.data.
   3. FRASES   — los textos fijos que el JS genera al vuelo
      (rótulos de evaluación, retroalimentación, avisos) se
      traducen con un diccionario de frases exactas y fragmentos.
      Un MutationObserver los atrapa apenas aparecen, así no hay
      que tocar el código de cada misión.

   La preferencia se guarda en localStorage y se respeta al
   volver a entrar.
   ============================================================ */
(function () {
  'use strict';

  var CLAVE = 'metas-idioma';
  var idiomaActual = 'es';
  var observador = null;
  var originales = new WeakMap();   // elemento → HTML original en español

  /* ---------- utilidades ---------- */

  function hayIngles() {
    return !!(window.MISION_EN && (window.MISION_EN.html || window.MISION_EN.frases));
  }

  function guardado() {
    try { return localStorage.getItem(CLAVE) || 'es'; } catch (e) { return 'es'; }
  }

  function guardar(lang) {
    try { localStorage.setItem(CLAVE, lang); } catch (e) { }
  }

  /* ---------- 3. diccionario de frases ---------- */

  /* Los fragmentos se aplican en el orden en que la misión los declara:
     cada par es [texto o expresión regular, reemplazo]. El autor los ordena
     de más específico a más general (p. ej. «Forma 3» antes que el título
     completo que ya la contiene). */
  function fragmentos() {
    return (window.MISION_EN && window.MISION_EN.fragmentos) || [];
  }

  function aplicarFragmentos(texto) {
    var out = texto, lista = fragmentos();
    for (var i = 0; i < lista.length; i++) {
      var busca = lista[i][0], pon = lista[i][1];
      if (typeof busca === 'string') {
        if (out.indexOf(busca) !== -1) out = out.split(busca).join(pon);
      } else {
        out = out.replace(busca, pon);
      }
    }
    return out;
  }

  function tr(texto) {
    if (idiomaActual !== 'en' || !texto) return texto;
    var frases = (window.MISION_EN && window.MISION_EN.frases) || {};
    var limpio = texto.trim();
    if (Object.prototype.hasOwnProperty.call(frases, limpio)) {
      // Conserva los espacios/saltos que rodean al texto original.
      return texto.replace(limpio, frases[limpio]);
    }
    return aplicarFragmentos(texto);
  }

  /* Traduce el documento completo que se manda a imprimir (se abre en
     otra ventana, fuera del alcance del observador). */
  function trDocumento(html) {
    if (idiomaActual !== 'en' || !html) return html;
    var frases = (window.MISION_EN && window.MISION_EN.frases) || {};
    // Frases de más larga a más corta: «II. Verdadero o Falso» debe caer
    // antes que «Falso», o quedarían mitades sin traducir.
    var claves = Object.keys(frases).sort(function (a, b) { return b.length - a.length; });
    var out = html;
    for (var i = 0; i < claves.length; i++) {
      if (out.indexOf(claves[i]) !== -1) out = out.split(claves[i]).join(frases[claves[i]]);
    }
    out = aplicarFragmentos(out);
    return out.replace('<html lang="es"', '<html lang="en"');
  }

  // Los <text> de los SVG sí se traducen (rótulos del robot del laboratorio).
  var SALTAR = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1 };

  /* Los nodos de texto se traducen en su sitio, así que hay que recordar el
     español para poder devolverlo: sin esto, al regresar a español se
     quedaban en inglés los pies de página y las pestañas. */
  var textosES = [];

  function podarTextos() {
    textosES = textosES.filter(function (r) { return r.n.isConnected; });
  }

  function restaurarTextos() {
    for (var i = 0; i < textosES.length; i++) {
      if (textosES[i].n.isConnected) textosES[i].n.nodeValue = textosES[i].es;
    }
    textosES = [];
  }

  function traducirNodo(nodo) {
    if (idiomaActual !== 'en') return;
    if (nodo.nodeType === 3) {
      var p = nodo.parentNode;
      if (p && (SALTAR[p.nodeName] || p.closest('[data-i18n-omitir]'))) return;
      if (!nodo.nodeValue || !nodo.nodeValue.trim()) return;
      var viejo = nodo.nodeValue;
      var nuevo = tr(viejo);
      if (nuevo !== viejo) {
        nodo.nodeValue = nuevo;
        textosES.push({ n: nodo, es: viejo });
        if (textosES.length > 4000) podarTextos();
      }
      return;
    }
    if (nodo.nodeType !== 1) return;
    if (SALTAR[nodo.nodeName] || nodo.hasAttribute('data-i18n-omitir')) return;
    var it = document.createTreeWalker(nodo, NodeFilter.SHOW_TEXT, null);
    var n, pend = [];
    while ((n = it.nextNode())) pend.push(n);
    pend.forEach(traducirNodo);
  }

  function traducirZona(el) { if (el) traducirNodo(el); }

  function iniciarObservador() {
    if (observador || typeof MutationObserver === 'undefined') return;
    observador = new MutationObserver(function (muts) {
      if (idiomaActual !== 'en') return;
      for (var i = 0; i < muts.length; i++) {
        var m = muts[i];
        if (m.type === 'characterData') { traducirNodo(m.target); continue; }
        for (var j = 0; j < m.addedNodes.length; j++) traducirNodo(m.addedNodes[j]);
      }
    });
    observador.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  function detenerObservador() {
    if (observador) { observador.disconnect(); observador = null; }
  }

  /* ---------- 1. bloques estáticos ---------- */

  function aplicarBloques(lang) {
    var dic = (window.MISION_EN && window.MISION_EN.html) || {};
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var clave = el.getAttribute('data-i18n');
      if (!originales.has(el)) originales.set(el, el.innerHTML);
      if (lang === 'en' && dic[clave] != null) el.innerHTML = dic[clave];
      else el.innerHTML = originales.get(el);
    });
    var attrs = (window.MISION_EN && window.MISION_EN.attrs) || {};
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (par) {
        var t = par.split(':'), attr = t[0].trim(), clave = (t[1] || '').trim();
        var memo = 'i18n_' + attr;
        if (el.dataset[memo] == null) el.dataset[memo] = el.getAttribute(attr) || '';
        if (lang === 'en' && attrs[clave] != null) el.setAttribute(attr, attrs[clave]);
        else el.setAttribute(attr, el.dataset[memo]);
      });
    });
  }

  /* ---------- 4. textos que viven en el CSS ----------
     Algunos rótulos decorativos son content: '…' de un ::before y ningún
     recorrido del DOM los alcanza. La misión los reescribe en MISION_EN.css
     con reglas propias colgadas de body[data-idioma="en"]. */
  function inyectarCSS() {
    var extra = window.MISION_EN && window.MISION_EN.css;
    if (!extra || document.getElementById('metas-i18n-mision-css')) return;
    var s = document.createElement('style');
    s.id = 'metas-i18n-mision-css';
    s.textContent = extra;
    document.head.appendChild(s);
  }

  /* ---------- botón ---------- */

  function estilos() {
    if (document.getElementById('metas-i18n-css')) return;
    var s = document.createElement('style');
    s.id = 'metas-i18n-css';
    s.textContent = [
      '.metas-lang-btn{display:inline-flex;align-items:center;gap:5px;border:2px solid rgba(255,255,255,.55);',
      'background:rgba(255,255,255,.18);color:#fff;border-radius:20px;padding:3px 10px;font:inherit;',
      'font-size:.72rem;font-weight:800;line-height:1;cursor:pointer;white-space:nowrap;letter-spacing:.3px;',
      'transition:transform .15s cubic-bezier(.34,1.4,.64,1),background .2s,border-color .2s,box-shadow .2s;}',
      '.metas-lang-btn:hover{background:rgba(255,255,255,.32);border-color:#fff;transform:translateY(-1px);',
      'box-shadow:0 4px 12px rgba(0,0,0,.18);}',
      '.metas-lang-btn:active{transform:scale(.94);}',
      '.metas-lang-btn .mlb-flag{font-size:.95rem;line-height:1;}',
      '.metas-lang-btn .mlb-txt{font-size:.68rem;}',
      '.metas-lang-btn .mlb-cod{background:rgba(255,255,255,.9);color:#0e7490;border-radius:6px;',
      'padding:2px 5px;font-size:.62rem;font-weight:900;letter-spacing:.5px;}',
      '@media(max-width:420px){.metas-lang-btn{padding:3px 7px;}.metas-lang-btn .mlb-txt{display:none;}}',
      '.metas-lang-suelto{position:fixed;right:18px;bottom:72px;z-index:6;background:#0e7490;',
      'border-color:#0e7490;padding:11px 16px;font-size:.85rem;box-shadow:0 6px 16px rgba(14,116,144,.4);}',
      '.metas-lang-suelto .mlb-txt{font-size:.85rem;}',
      '@media print{.metas-lang-btn,.metas-lang-toast{display:none !important;}}',
      '.metas-lang-toast{position:fixed;left:50%;bottom:86px;transform:translateX(-50%);z-index:9999;',
      'background:#0f172a;color:#fff;padding:9px 16px;border-radius:22px;font-size:.82rem;font-weight:700;',
      'box-shadow:0 8px 24px rgba(0,0,0,.28);opacity:0;transition:opacity .25s;}',
      '.metas-lang-toast.ver{opacity:1;}'
    ].join('');
    document.head.appendChild(s);
  }

  function pintarBoton(btn) {
    var aIngles = idiomaActual === 'es';
    // Globo y no bandera: Windows no dibuja las banderas emoji y se veían
    // como dos letras sueltas («us English»).
    btn.innerHTML = '<span class="mlb-flag">🌐</span>' +
      '<span class="mlb-txt">' + (aIngles ? 'English' : 'Español') + '</span>' +
      '<span class="mlb-cod">' + (aIngles ? 'EN' : 'ES') + '</span>';
    btn.title = aIngles ? 'Read this mission in English' : 'Leer esta misión en español';
    btn.setAttribute('aria-label', btn.title);
  }

  function crearBoton() {
    if (!hayIngles() || document.querySelector('.metas-lang-btn')) return;
    estilos();
    var btn = document.createElement('button');
    btn.className = 'metas-lang-btn';
    btn.type = 'button';
    btn.setAttribute('data-i18n-omitir', '');
    btn.addEventListener('click', function () {
      cambiar(idiomaActual === 'es' ? 'en' : 'es');
      pintarBoton(btn);
    });
    pintarBoton(btn);
    var barra = document.querySelector('.xp-bar');
    if (barra) {
      var ref = barra.querySelector('.xp-pts');
      if (ref) barra.insertBefore(btn, ref); else barra.appendChild(btn);
    } else {
      // Fichas imprimibles: no hay barra de XP, así que el botón se acomoda
      // junto al de imprimir y desaparece al mandar a papel.
      btn.classList.add('metas-lang-suelto');
      document.body.appendChild(btn);
    }
  }

  function aviso(msg) {
    var t = document.querySelector('.metas-lang-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'metas-lang-toast';
      t.setAttribute('data-i18n-omitir', '');
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(function () { t.classList.add('ver'); });
    clearTimeout(t._tid);
    t._tid = setTimeout(function () { t.classList.remove('ver'); }, 2200);
  }

  /* ---------- cambio de idioma ---------- */

  function cambiar(lang, silencioso) {
    if (lang === 'en' && !hayIngles()) return;
    idiomaActual = lang;
    guardar(lang);
    document.documentElement.lang = lang;
    document.body.setAttribute('data-idioma', lang);

    detenerObservador();
    inyectarCSS();
    if (lang !== 'en') restaurarTextos();
    aplicarBloques(lang);

    // Título de la pestaña (y de la cabecera al imprimir desde el navegador)
    if (window.MISION_EN && window.MISION_EN.titulo) {
      if (!document.body.dataset.tituloEs) document.body.dataset.tituloEs = document.title;
      document.title = (lang === 'en') ? window.MISION_EN.titulo : document.body.dataset.tituloEs;
    }

    // 2. bancos de datos + repintado de los juegos de la misión
    if (typeof window.MISION_APLICAR_IDIOMA === 'function') {
      try { window.MISION_APLICAR_IDIOMA(lang); } catch (e) { console.warn('[i18n] repintado:', e); }
    }

    if (lang === 'en') {
      traducirNodo(document.body);
      iniciarObservador();
    }
    if (!silencioso) aviso(lang === 'en' ? '🌐 Now in English' : '🌐 Ahora en español');
    document.dispatchEvent(new CustomEvent('metas:idioma', { detail: { lang: lang } }));
  }

  /* ---------- arranque ---------- */

  function iniciar() {
    crearBoton();
    var pref = guardado();
    if (pref === 'en' && hayIngles()) cambiar('en', true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();

  window.MetasI18N = {
    idioma: function () { return idiomaActual; },
    set: cambiar,
    tr: tr,
    trDocumento: trDocumento,
    traducirZona: traducirZona
  };

  // Atajo para las misiones: envuelve el HTML que se manda a imprimir.
  window.METAS_TR = trDocumento;
})();
