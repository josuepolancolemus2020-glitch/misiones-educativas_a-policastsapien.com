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

  /* Rótulos que NO son de ninguna misión en particular: los arman
     js/metas-registro.js (identificarse, buzón de sugerencias, reporte) y
     js/metas-presentacion.js. Viven aquí para que las 56 misiones los
     hereden y no haya que repetirlos en cada archivo -en.js. Si una misión
     declara la misma frase, la suya manda. */
  var BASE_FRASES = {
    /* — identificación del alumno — */
    '👋 ¡Hola, explorador!': '👋 Hi there, explorer!',
    'Identifícate': 'Identify yourself',
    '👤 Tu nombre o código de alumno': '👤 Your name or student code',
    '🔢 Tu número de lista (opcional)': '🔢 Your student number (optional)',
    '🏫 Tu escuela o centro educativo': '🏫 Your school',
    '📚 Grado y sección': '📚 Grade and section',
    '🔑 Código de aula (te lo da tu maestro)': '🔑 Classroom code (your teacher gives it to you)',
    '✅ Guardar': '✅ Save', 'Ahora no': 'Not right now', 'Cancelar': 'Cancel',
    /* ejemplos de los campos (viven en el atributo placeholder) */
    'Ej: Ana López o A07': 'e.g., Ana López or A07', 'Ej: 7': 'e.g., 7',
    'Ej: Esc. Francisco Morazán': 'e.g., Francisco Morazán School', 'Ej: 6to A': 'e.g., 6th A',
    'Ej: K2M9P': 'e.g., K2M9P', 'Escribe aquí con tus palabras...': 'Write here in your own words…',
    '👤 Aún no te has identificado': '👤 You have not identified yourself yet',
    '✍️ Escribir mis datos': '✍️ Enter my details',
    '👤 Cambiar alumno': '👤 Change student',
    '⏳ Buscando…': '⏳ Searching…',
    '❌ Código no encontrado. Pídeselo de nuevo a tu maestro.': '❌ Code not found. Ask your teacher for it again.',
    '📴 Sin internet: se confirmará al reconectar.': '📴 No internet: it will be confirmed once you reconnect.',
    '📤 Enviar resultados': '📤 Send results',
    'Estudiante': 'Student',
    /* — buzón de sugerencias — */
    '💬 Buzón de sugerencias': '💬 Suggestion box', 'Sugerencias': 'Suggestions',
    '🏷️ Tipo de mensaje': '🏷️ Type of message', '✍️ Tu mensaje': '✍️ Your message',
    '💡 Tengo una idea': '💡 I have an idea',
    '📚 Encontré un error en el contenido': '📚 I found a mistake in the content',
    '🔧 Algo no funciona bien': '🔧 Something is not working properly',
    '🎉 Quiero felicitar al equipo': '🎉 I want to congratulate the team',
    '📤 Enviar': '📤 Send',
    '💬 ¡Gracias! Tu mensaje fue registrado y se enviará al equipo.': '💬 Thank you! Your message was saved and will be sent to the team.',
    /* — modo presentación — */
    '📽️ Presentación': '📽️ Slideshow', 'Modo presentación': 'Slideshow mode',
    'Letra más grande': 'Bigger text', 'Letra más pequeña': 'Smaller text',
    '📖 Libro (deslizar páginas)': '📖 Book (swipe pages)',
    '📱 Vertical 3:4': '📱 Portrait 3:4', '📽️ Panorámico 16:9': '📽️ Widescreen 16:9',
    '📲 Historia 9:16': '📲 Story 9:16',
    'Página anterior': 'Previous page', 'Página siguiente': 'Next page'
  };

  var BASE_FRAGMENTOS = [
    [/^Escribe tus datos $/, 'Write your details '],
    [/^una sola vez$/, 'just once'],
    [/^ para que tu maestro sepa que estos logros son tuyos\.$/, ' so your teacher knows these achievements are yours.'],
    [/^👤 Alumno: /, '👤 Student: '],
    [/^🧑‍🏫 Maestro: /, '🧑‍🏫 Teacher: '],
    [/^🚀 Misión: /, '🚀 Mission: '],
    [/^📚 Grado y sección: /, '📚 Grade and section: '],
    [/^⏱️ Tiempo activo: /, '⏱️ Time on task: '],
    [/: aún sin calificar/, ': not graded yet']
  ];

  function tr(texto) {
    if (idiomaActual !== 'en' || !texto) return texto;
    var frases = (window.MISION_EN && window.MISION_EN.frases) || {};
    var limpio = texto.trim();
    if (Object.prototype.hasOwnProperty.call(frases, limpio)) {
      // Conserva los espacios/saltos que rodean al texto original.
      return texto.replace(limpio, frases[limpio]);
    }
    if (Object.prototype.hasOwnProperty.call(BASE_FRASES, limpio)) {
      return texto.replace(limpio, BASE_FRASES[limpio]);
    }
    var out = aplicarFragmentos(texto);
    if (out !== texto) return out;
    for (var i = 0; i < BASE_FRAGMENTOS.length; i++) {
      var b = BASE_FRAGMENTOS[i][0], r = BASE_FRAGMENTOS[i][1];
      if (b.test(out)) return out.replace(b, r);
    }
    return out;
  }

  /* Los paneles compartidos se arman por JS y su texto de ayuda vive en
     atributos (placeholder, title, aria-label), fuera del alcance de un
     recorrido de nodos de texto. */
  var ATTRS_TR = ['placeholder', 'title', 'aria-label'];
  var attrsES = [];

  function restaurarAttrs() {
    for (var i = 0; i < attrsES.length; i++) {
      var a = attrsES[i];
      if (a.el.isConnected) a.el.setAttribute(a.attr, a.es);
    }
    attrsES = [];
  }

  function traducirAttrs(el) {
    if (!el.getAttribute) return;
    for (var i = 0; i < ATTRS_TR.length; i++) {
      var attr = ATTRS_TR[i], viejo = el.getAttribute(attr);
      if (!viejo || !viejo.trim()) continue;
      if (el.hasAttribute('data-i18n-attr')) continue;   // ya lo maneja aplicarBloques
      var nuevo = tr(viejo);
      if (nuevo !== viejo) {
        el.setAttribute(attr, nuevo);
        attrsES.push({ el: el, attr: attr, es: viejo });
      }
    }
  }

  /* Traduce el documento completo que se manda a imprimir (se abre en
     otra ventana, fuera del alcance del observador). */
  function trDocumento(html) {
    if (idiomaActual !== 'en' || !html) return html;
    var propias = (window.MISION_EN && window.MISION_EN.frases) || {};
    var frases = {}, k;
    for (k in BASE_FRASES) frases[k] = BASE_FRASES[k];
    for (k in propias) frases[k] = propias[k];      // la misión manda sobre la base
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
    traducirAttrs(nodo);
    nodo.querySelectorAll('[placeholder],[title],[aria-label]').forEach(traducirAttrs);
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
    if (lang !== 'en') { restaurarTextos(); restaurarAttrs(); }
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

  /* ---------- rescate: el archivo de inglés no llegó ----------
     Si el alumno dejó la misión en inglés y al volver el navegador sirvió una
     copia vieja del HTML (o el teléfono estaba sin red la primera vez), este
     archivo no existe y la misión se veía en español SIN AVISAR. Aquí se
     intenta traerlo una vez más y, si no se puede, se le dice al alumno. */

  function urlIngles() {
    var ss = document.querySelectorAll('script[src]'), i, src;
    for (i = 0; i < ss.length; i++) {           // el HTML sí lo declara
      src = ss[i].getAttribute('src') || '';
      if (/-en\.js(\?|$)/.test(src)) return src;
    }
    for (i = 0; i < ss.length; i++) {           // deducirlo del JS de la misión
      src = ss[i].getAttribute('src') || '';
      var m = /^js\/([A-Za-z0-9_-]+)\.js(\?.*)?$/.exec(src);
      if (m && m[1] !== 'html2canvas') return 'js/' + m[1] + '-en.js';
    }
    return null;
  }

  function cargarIngles(listo) {
    var url = urlIngles();
    if (!url) return listo(false);
    var s = document.createElement('script');
    s.src = url + (url.indexOf('?') < 0 ? '?reintento=1' : '&reintento=1');
    s.onload = function () { listo(hayIngles()); };
    s.onerror = function () { listo(false); };
    document.head.appendChild(s);
  }

  /* ---------- arranque ---------- */

  function iniciar() {
    crearBoton();
    if (guardado() !== 'en') return;
    if (hayIngles()) { cambiar('en', true); return; }
    cargarIngles(function (ok) {
      if (ok) { crearBoton(); cambiar('en', true); }
      // Bilingüe a propósito: el alumno pidió inglés pero está viendo español.
      else aviso('🌐 English not available offline yet · Conéctate una vez para descargarlo');
    });
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
