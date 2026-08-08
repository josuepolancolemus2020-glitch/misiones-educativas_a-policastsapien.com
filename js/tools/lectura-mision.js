/* ══════════════════════════════════════════════════════════════
   📖 CONTROL DE LECTURA DENTRO DE UNA MISIÓN — motor

   La pestaña 📖 Lectura de Mi aula la maneja el MAESTRO: elige al
   alumno, escucha, cuenta los errores y marca las respuestas. Sirve
   para tomar la fluidez de 43 niños uno por uno.

   Esto es lo otro: el ALUMNO solo, con el teléfono en la mano, se
   cronometra un minuto sobre un texto del tema que está estudiando
   y contesta cinco preguntas. Es la «autoprueba dentro de la misión»
   que js/tools/lectura-fluidez.js dejó anotada como fase siguiente.

   Qué cambia por no haber maestro delante, y por qué:

   · NO se cuentan errores de lectura. Un niño no puede escucharse y
     contarse los tropiezos a la vez, y un dato inventado es peor que
     ningún dato. Por eso el resultado habla de VELOCIDAD y
     COMPRENSIÓN, y lo dice en pantalla: la precisión se toma con el
     maestro, en Mi aula.
   · Las preguntas son de selección múltiple y las contesta él mismo.
   · El veredicto le habla a ÉL, de tú, y nunca lo etiqueta: dice qué
     hacer esta semana, no lo que es.

   Dos modos de marcar, y los dos paran al cumplirse el minuto:

   · ✋ MARCO YO — lee en voz alta y va pasando el dedo por encima de
     las palabras; lo leído se pinta detrás. Es el mismo gesto que la
     pauta del maestro recomienda para leer con precisión («con el
     dedo bajo la línea»), así que la medición y el ejercicio son la
     misma cosa.
   · ✨ SE MARCA SOLA — las palabras se encienden solas al ritmo de la
     banda de su grado y él trata de no quedarse atrás. Aquí el
     aparato no mide: enseña a qué velocidad se siente ir al día.
     Al final marca hasta dónde llegó de verdad y ahí sí se mide.

   Las NORMAS (banda de palabras por minuto por grado, niveles) no
   viven aquí: se le preguntan a js/data/lectura-normas.js, que es el
   único archivo que hay que tocar si mañana la Secretaría de
   Educación publica su propia tabla.

   Los TEXTOS tampoco: cada misión trae su corpus (el de la misión de
   los adjetivos está en misiones/2y3ciclo-adjetivos/js/
   lectura-adjetivos.js) y se lo pasa en `corpus`. Este archivo no
   sabe de qué tema son, y por eso sirve para cualquier misión.

   Uso desde una misión:
     <script src="../../js/data/lectura-normas.js"></script>
     <script src="js/lectura-<tema>.js"></script>
     <script src="../../js/tools/lectura-mision.js"></script>
     LecturaMision.montar({
       contenedor: 'lm-root',
       corpus: LECTURA_ADJETIVOS,
       mision: 'adjetivos',
       tema: 'los adjetivos',
       alTerminar: function (r) { ... }   // XP y logros de la misión
     });
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CLAVE = 'METAS_LECTURA_MISION_V1';   /* resultados por misión y texto */
  var CLAVE_PREF = 'METAS_LECTURA_MISION_PREF';  /* grado y modo elegidos */
  var SEGUNDOS = 60;

  /* ── utilidades ── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function palabras(texto) { return String(texto || '').trim().split(/\s+/); }
  /* Quita puntuación para comparar palabras. \b de JavaScript no sirve con
     acentos («ú» no es carácter de palabra para el motor), así que el
     resaltado compara palabra contra palabra, ya limpias.
     Esta expresión tiene que ser IDÉNTICA a la de _dev/valida-lectura-mision.js:
     ahí se comprueba que cada adjetivo de la lista esté en el texto, y si las
     dos no limpian lo mismo el validador aprueba palabras que aquí no se
     resaltan. */
  var LIMPIA = /[.,;:()¿?¡!«»"“”'’…—–]/g;
  function clave(p) { return String(p).replace(LIMPIA, '').toLowerCase(); }
  function leerJSON(k, porDefecto) {
    try { var o = JSON.parse(localStorage.getItem(k)); return o && typeof o === 'object' ? o : porDefecto; }
    catch (e) { return porDefecto; }
  }
  function guardarJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function hoy() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function suena(t) { if (typeof window.sfx === 'function') { try { window.sfx(t); } catch (e) {} } }
  function vibra(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

  /* Grado del alumno, si ya se identificó en la misión. Viene escrito a
     mano («6to», «6º-1», «sexto»), así que se sacan los dígitos y si no
     hay ninguno se deja sin elegir: preguntarle es mejor que adivinarle
     el grado y medirlo contra la banda equivocada. */
  function gradoIdentificado(grados) {
    var id = leerJSON('METAS_ALUMNO_V1', null);
    if (!id || !id.grado) return null;
    var m = String(id.grado).match(/\d+/);
    if (!m) return null;
    var g = parseInt(m[0], 10);
    return grados.indexOf(g) >= 0 ? g : null;
  }

  /* ══════════════ CSS ══════════════
     Va aquí y no en el CSS de la misión a propósito: así una misión
     nueva estrena la sección con un solo <script>. Usa las variables
     de color de la misión, con respaldo por si alguna no las define. */
  var CSS = [
    '.lm-wrap{--lm-pri:var(--pri,#419b88);--lm-sec:var(--sec,#c49000);--lm-card:var(--card,#fff);',
    '--lm-borde:var(--border,#e2ddd4);--lm-txt:var(--dark,#1b2838);--lm-gris:var(--gray,#636e72);}',
    '.lm-grados{display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.6rem 0;}',
    '.lm-grado{font-family:"Fredoka",sans-serif;font-size:0.95rem;font-weight:600;min-width:56px;padding:0.5rem 0.8rem;',
    'border:2px solid var(--lm-borde);border-radius:12px;background:var(--lm-card);color:var(--lm-txt);cursor:pointer;transition:all 0.15s;}',
    '.lm-grado:hover{transform:translateY(-2px);}',
    '.lm-grado.on{background:linear-gradient(135deg,var(--lm-pri),var(--lm-sec));color:#fff;border-color:transparent;}',
    '.lm-pista{font-size:0.82rem;color:var(--lm-gris);line-height:1.55;margin:0.4rem 0;}',
    '.lm-lista{display:flex;flex-direction:column;gap:0.45rem;margin:0.6rem 0;}',
    '.lm-txt-row{display:block;width:100%;text-align:left;padding:0.6rem 0.75rem;border:2px solid var(--lm-borde);',
    'border-radius:12px;background:var(--lm-card);color:var(--lm-txt);cursor:pointer;font-family:inherit;transition:all 0.15s;}',
    '.lm-txt-row.on{border-color:var(--lm-pri);background:var(--pri-gl,rgba(65,155,136,0.12));}',
    '.lm-txt-tit{display:block;font-family:"Fredoka",sans-serif;font-size:0.98rem;font-weight:600;}',
    '.lm-txt-meta{display:block;font-size:0.76rem;color:var(--lm-gris);margin-top:0.15rem;}',
    '.lm-modos{display:flex;flex-wrap:wrap;gap:0.5rem;margin:0.7rem 0 0.3rem;}',
    '.lm-modo{flex:1;min-width:150px;text-align:left;padding:0.55rem 0.7rem;border:2px solid var(--lm-borde);border-radius:12px;',
    'background:var(--lm-card);color:var(--lm-txt);cursor:pointer;font-family:inherit;font-size:0.85rem;line-height:1.4;}',
    '.lm-modo.on{border-color:var(--lm-sec);background:var(--sec-gl,rgba(196,144,0,0.12));}',
    '.lm-modo b{display:block;font-family:"Fredoka",sans-serif;font-size:0.92rem;margin-bottom:0.1rem;}',
    '.lm-modo small{color:var(--lm-gris);font-size:0.76rem;}',
    /* cronómetro */
    '.lm-crono-caja{display:flex;align-items:center;gap:0.9rem;margin:0.6rem 0;flex-wrap:wrap;}',
    '.lm-crono{font-family:"Fredoka",sans-serif;font-size:2.6rem;font-weight:700;line-height:1;color:var(--lm-pri);',
    'font-variant-numeric:tabular-nums;min-width:3.4ch;}',
    '.lm-crono small{font-size:0.9rem;font-weight:400;color:var(--lm-gris);margin-left:0.1rem;}',
    '.lm-crono.lm-poco{color:var(--sec,#c49000);}',
    '.lm-crono.lm-fin{color:var(--red,#d63031);}',
    '.lm-barra{flex:1;min-width:120px;height:10px;border-radius:8px;background:var(--lm-borde);overflow:hidden;}',
    '.lm-barra i{display:block;height:100%;width:100%;background:linear-gradient(90deg,var(--lm-pri),var(--lm-sec));transition:width 0.1s linear;}',
    '.lm-crono-sub{font-size:0.8rem;color:var(--lm-gris);width:100%;}',
    /* el texto que se lee */
    /* text-align a la izquierda SIEMPRE, aunque la misión justifique sus
       párrafos: el texto justificado abre huecos desiguales entre palabras y
       el lector que va despacio pierde el renglón justo en esos huecos. */
    '.lm-texto{margin:0.7rem 0;font-size:1.16rem;line-height:2.05;text-align:left;',
    'user-select:none;-webkit-user-select:none;touch-action:pan-y;}',
    '.lm-p{padding:0.08em 0.06em;border-radius:5px;transition:background 0.12s,color 0.12s;}',
    '.lm-viva .lm-p{cursor:pointer;}',
    '.lm-p.lm-leida{background:var(--pri-gl,rgba(65,155,136,0.18));}',
    '.lm-p.lm-aqui{background:var(--lm-pri);color:#fff;font-weight:700;box-shadow:0 0 0 2px var(--lm-pri);}',
    '.lm-p.lm-adj{background:var(--sec-gl,rgba(196,144,0,0.22));color:var(--lm-txt);font-weight:700;',
    'box-shadow:inset 0 -0.18em 0 var(--sec,#c49000);}',
    '.lm-p.lm-det{background:var(--purple-gl,rgba(108,92,231,0.18));color:var(--lm-txt);font-weight:700;',
    'box-shadow:inset 0 -0.18em 0 var(--purple,#6c5ce7);}',
    '.lm-aviso{margin:0.5rem 0;padding:0.55rem 0.8rem;border-radius:10px;font-size:0.88rem;line-height:1.5;',
    'background:var(--sec-gl,rgba(196,144,0,0.12));border-left:4px solid var(--sec,#c49000);color:var(--lm-txt);}',
    /* preguntas */
    '.lm-preg{margin-bottom:0.9rem;padding-bottom:0.7rem;border-bottom:1px solid var(--lm-borde);}',
    '.lm-preg:last-of-type{border-bottom:none;}',
    '.lm-preg-q{font-size:0.95rem;font-weight:700;line-height:1.5;margin-bottom:0.4rem;}',
    '.lm-ops{display:flex;flex-direction:column;gap:0.35rem;}',
    '.lm-op{text-align:left;padding:0.45rem 0.65rem;border:2px solid var(--lm-borde);border-radius:10px;',
    'background:var(--lm-card);color:var(--lm-txt);cursor:pointer;font-family:inherit;font-size:0.88rem;line-height:1.45;}',
    '.lm-op.on{border-color:var(--lm-pri);background:var(--pri-gl,rgba(65,155,136,0.12));}',
    '.lm-op b{color:var(--lm-pri);margin-right:0.25rem;}',
    '.lm-op.lm-ok{border-color:var(--jade,#00b894);background:var(--jade-gl,rgba(0,184,148,0.14));}',
    '.lm-op.lm-no{border-color:var(--red,#d63031);background:var(--red-gl,rgba(214,48,49,0.10));}',
    '.lm-guia{margin-top:0.35rem;font-size:0.82rem;line-height:1.5;color:var(--lm-gris);}',
    /* resultado */
    '.lm-hero{text-align:center;margin:0.4rem 0 0.7rem;}',
    '.lm-hero b{display:block;font-family:"Fredoka",sans-serif;font-size:3.2rem;line-height:1;color:var(--lm-pri);}',
    '.lm-hero span{display:block;font-size:0.85rem;color:var(--lm-gris);margin-top:0.2rem;}',
    '.lm-chips{display:flex;flex-wrap:wrap;gap:0.45rem;margin:0.6rem 0;}',
    '.lm-chip{flex:1;min-width:132px;border:2px solid var(--lm-borde);border-radius:12px;padding:0.45rem 0.6rem;background:var(--lm-card);}',
    '.lm-chip span{display:block;font-size:0.72rem;color:var(--lm-gris);text-transform:uppercase;letter-spacing:0.4px;}',
    '.lm-chip b{display:block;font-family:"Fredoka",sans-serif;font-size:0.98rem;margin-top:0.1rem;}',
    '.lm-veredicto{margin:0.6rem 0;padding:0.7rem 0.9rem;border-radius:12px;font-size:0.92rem;line-height:1.6;',
    'background:var(--pri-gl,rgba(65,155,136,0.12));border-left:4px solid var(--lm-pri);}',
    '.lm-leyenda{display:flex;flex-wrap:wrap;gap:0.8rem;font-size:0.8rem;color:var(--lm-gris);margin:0.4rem 0;}',
    '.lm-leyenda i{font-style:normal;padding:0.05em 0.35em;border-radius:5px;font-weight:700;}',
    '.lm-btns{display:flex;flex-wrap:wrap;gap:0.55rem;margin-top:0.8rem;}',
    '@media (max-width:520px){.lm-texto{font-size:1.08rem;line-height:1.95;}.lm-hero b{font-size:2.6rem;}}'
  ].join('');

  function inyectaCSS() {
    if (document.getElementById('lm-css')) return;
    var s = document.createElement('style');
    s.id = 'lm-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  /* ══════════════ una instancia por misión ══════════════ */
  function montar(op) {
    var raiz = typeof op.contenedor === 'string' ? document.getElementById(op.contenedor) : op.contenedor;
    if (!raiz || !op.corpus) return null;
    if (typeof LECTURA_NORMAS === 'undefined' || typeof lecNivelVelocidad !== 'function') {
      raiz.innerHTML = '<div class="card"><p>📖 Las normas de lectura no cargaron en este equipo. ' +
        'Abre la misión una vez con internet y quedarán guardadas.</p></div>';
      return null;
    }
    inyectaCSS();
    raiz.classList.add('lm-wrap');

    var corpus = op.corpus;
    var mision = op.mision || 'mision';
    var tema = op.tema || 'el tema de esta misión';
    var grados = Object.keys(corpus).map(Number).filter(function (g) { return corpus[g] && corpus[g].length; }).sort(function (a, b) { return a - b; });

    var pref = leerJSON(CLAVE_PREF, {}) || {};
    var st = {
      fase: 'elegir',
      grado: (grados.indexOf(pref.grado) >= 0 ? pref.grado : null) || gradoIdentificado(grados),
      textoId: null,
      modo: pref.modo === 'guia' ? 'guia' : 'marco',
      ini: 0, seg: 0, idx: null, congelado: false, guiaIdx: 0,
      resp: [], revisado: false, guardado: null, timer: null
    };

    /* ── resultados guardados ── */
    function historial() {
      var todo = leerJSON(CLAVE, {}) || {};
      return todo[mision] || {};
    }
    function guardarResultado(textoId, dato) {
      var todo = leerJSON(CLAVE, {}) || {};
      todo[mision] = todo[mision] || {};
      var ant = todo[mision][textoId] || { intentos: 0, mejorPpm: 0 };
      todo[mision][textoId] = {
        intentos: (ant.intentos || 0) + 1,
        mejorPpm: Math.max(ant.mejorPpm || 0, dato.ppm),
        ppm: dato.ppm, comp: dato.comp, compDe: dato.compDe, f: hoy()
      };
      guardarJSON(CLAVE, todo);
      return todo[mision][textoId];
    }
    function guardarPref() { guardarJSON(CLAVE_PREF, { grado: st.grado, modo: st.modo }); }

    function textos() { return (st.grado && corpus[st.grado]) || []; }
    function actual() {
      var l = textos();
      for (var i = 0; i < l.length; i++) if (l[i].id === st.textoId) return l[i];
      return null;
    }
    function pararTimer() { if (st.timer) { clearInterval(st.timer); st.timer = null; } }
    function reiniciar() {
      pararTimer();
      st.fase = 'elegir'; st.ini = 0; st.seg = 0; st.idx = null;
      st.congelado = false; st.guiaIdx = 0; st.resp = []; st.revisado = false;
      st.guardado = null;
    }

    /* ══════════════ FASE 1 · elegir grado y lectura ══════════════ */
    function pintaElegir() {
      var hist = historial();
      var lista = textos();
      var banda = st.grado ? LECTURA_NORMAS.bandas[st.grado] : null;

      raiz.innerHTML =
        '<div class="card ac-teal">' +
          '<h2>📖 Control de lectura — un minuto</h2>' +
          '<p class="lm-pista">Lee en voz alta durante un minuto y contesta cinco preguntas. Las lecturas son de ' +
            esc(tema) + ', así que al terminar vas a ver, sobre el texto que acabas de leer, todos los adjetivos que traía.</p>' +
          '<p class="lm-pista"><strong>' + (st.grado ? 'Tu grado:' : '👇 Toca tu grado para ver tus cinco lecturas:') + '</strong></p>' +
          '<div class="lm-grados" role="group" aria-label="Elegir grado">' +
            grados.map(function (g) {
              return '<button class="lm-grado' + (g === st.grado ? ' on' : '') + '" data-lm-grado="' + g + '">' + g + 'º</button>';
            }).join('') +
          '</div>' +
          (banda ? '<p class="lm-pista">Al terminar ' + st.grado + 'º se espera leer entre <strong>' + banda[0] + ' y ' +
            banda[1] + ' palabras por minuto</strong> (' + esc(LECTURA_NORMAS.fuenteCorta) + '). Es la meta de <em>fin de año</em>: ' +
            'a mitad del curso es normal ir por debajo.</p>' : '') +
        '</div>' +
        (!st.grado ? '' :
        '<div class="card ac-gold">' +
          '<h2>📚 Tus cinco lecturas de ' + st.grado + 'º</h2>' +
          '<div class="lm-lista">' +
            lista.map(function (t) {
              var n = palabras(t.texto).length;
              var h = hist[t.id];
              return '<button class="lm-txt-row' + (t.id === st.textoId ? ' on' : '') + '" data-lm-texto="' + esc(t.id) + '">' +
                '<span class="lm-txt-tit">' + esc(t.titulo) + '</span>' +
                '<span class="lm-txt-meta">' + esc(t.genero) + ' · ' + n + ' palabras' +
                (h ? ' · ✅ tu mejor marca: ' + h.mejorPpm + ' ppm' : '') + '</span></button>';
            }).join('') +
          '</div>' +
          '<p class="lm-pista"><strong>¿Cómo quieres marcar lo que vas leyendo?</strong></p>' +
          '<div class="lm-modos" role="group" aria-label="Elegir modo de marcado">' +
            '<button class="lm-modo' + (st.modo === 'marco' ? ' on' : '') + '" data-lm-modo="marco">' +
              '<b>✋ Marco yo</b><small>Vas pasando el dedo por encima de las palabras mientras las lees. Lo leído se pinta detrás.</small></button>' +
            '<button class="lm-modo' + (st.modo === 'guia' ? ' on' : '') + '" data-lm-modo="guia">' +
              '<b>✨ Se marca sola</b><small>Las palabras se encienden solas al ritmo de ' + st.grado + 'º y tú las vas leyendo sin quedarte atrás.</small></button>' +
          '</div>' +
          '<p class="lm-pista">En los dos modos, <strong>al cumplirse el minuto todo se detiene</strong>.</p>' +
          '<div class="lm-btns">' +
            '<button class="btn btn-pri" id="lm-empezar"' + (st.textoId ? '' : ' disabled') + '>⏱️ Empezar el minuto</button>' +
          '</div>' +
        '</div>');

      cada('[data-lm-grado]', function (b) {
        b.onclick = function () {
          suena('click');
          st.grado = +b.dataset.lmGrado; st.textoId = null; guardarPref(); pinta();
        };
      });
      cada('[data-lm-texto]', function (b) {
        b.onclick = function () { suena('click'); st.textoId = b.dataset.lmTexto; pinta(); };
      });
      cada('[data-lm-modo]', function (b) {
        b.onclick = function () { suena('click'); st.modo = b.dataset.lmModo; guardarPref(); pinta(); };
      });
      var e = document.getElementById('lm-empezar');
      if (e) e.onclick = function () {
        if (!actual()) return;
        suena('click');
        st.fase = 'leer'; st.ini = 0; st.seg = 0; st.idx = null;
        st.congelado = false; st.guiaIdx = 0; st.resp = []; st.revisado = false;
        st.guardado = null;
        pinta();
      };
    }

    /* ══════════════ FASE 2 · el minuto ══════════════ */
    function pintaLeer() {
      var t = actual();
      if (!t) { reiniciar(); pinta(); return; }
      var ps = palabras(t.texto);
      var banda = LECTURA_NORMAS.bandas[st.grado];
      /* El ritmo de la guía es el PISO de la banda del grado, no su
         centro: es la velocidad que se espera alcanzar, y un modelo que
         va más rápido de lo exigido solo sirve para desanimar. */
      var ppmGuia = banda ? banda[0] : 100;
      var msPorPalabra = 60000 / ppmGuia;

      raiz.innerHTML =
        '<div class="card ac-teal">' +
          '<h2>⏱️ ' + esc(t.titulo) + '</h2>' +
          '<div class="lm-crono-caja">' +
            '<div class="lm-crono" id="lm-crono" role="timer" aria-live="off"><span id="lm-num">' + SEGUNDOS + '</span><small>s</small></div>' +
            '<div class="lm-barra"><i id="lm-barra"></i></div>' +
            '<div class="lm-crono-sub" id="lm-sub">' +
              (st.modo === 'guia'
                ? 'Cuando arranques, las palabras se encienden solas al ritmo de ' + st.grado + 'º (' + ppmGuia + ' por minuto). Léelas en voz alta.'
                : 'Cuando arranques, lee en voz alta y ve pasando el dedo por encima de las palabras.') +
            '</div>' +
          '</div>' +
          /* El botón de las preguntas va ARRIBA y ABAJO. Con un texto de 9º
             el alumno termina el minuto mirando el final del texto, y con
             uno de 4º mirando el principio: dejarlo en un solo sitio lo
             obliga a buscar por dónde seguir justo cuando ya terminó. */
          '<div class="lm-btns">' +
            '<button class="btn btn-pri" id="lm-arrancar">▶️ Arrancar</button>' +
            '<button class="btn btn-g" id="lm-termine" style="display:none">✅ Terminé el texto</button>' +
            '<button class="btn btn-g" id="lm-preguntas" style="display:none">❓ Ir a las cinco preguntas</button>' +
            '<button class="btn btn-d" id="lm-cancelar">Cancelar</button>' +
          '</div>' +
          '<div id="lm-avisos"></div>' +
          '<div class="lm-texto" id="lm-texto" aria-label="Texto para leer en voz alta">' +
            ps.map(function (p, i) { return '<span class="lm-p" data-i="' + i + '">' + esc(p) + '</span>'; }).join(' ') +
          '</div>' +
          '<div class="lm-btns"><button class="btn btn-g" id="lm-preguntas2" style="display:none">❓ Ir a las cinco preguntas</button></div>' +
        '</div>';

      var crono = document.getElementById('lm-crono');
      var num = document.getElementById('lm-num');
      var barra = document.getElementById('lm-barra');
      var sub = document.getElementById('lm-sub');
      var avisos = document.getElementById('lm-avisos');
      var caja = document.getElementById('lm-texto');
      var btnArr = document.getElementById('lm-arrancar');
      var btnFin = document.getElementById('lm-termine');
      var btnsPreg = [document.getElementById('lm-preguntas'), document.getElementById('lm-preguntas2')];
      var spans = caja.querySelectorAll('.lm-p');

      function marca(i) {
        if (i == null || i < 0 || i >= spans.length) return;
        st.idx = i;
        for (var k = 0; k < spans.length; k++) {
          spans[k].classList.toggle('lm-leida', k < i);
          spans[k].classList.toggle('lm-aqui', k === i);
        }
      }
      function aviso(html) { avisos.innerHTML = '<div class="lm-aviso">' + html + '</div>'; }

      /* ── el dedo: pintar arrastrando es el gesto natural de un niño
         siguiendo un renglón, y además es la técnica que la pauta del
         maestro recomienda para leer sin saltarse palabras ── */
      function palabraDe(ev) {
        var x = ev.clientX, y = ev.clientY;
        if (x == null) return null;
        var el = document.elementFromPoint(x, y);
        return el && el.classList && el.classList.contains('lm-p') ? +el.dataset.i : null;
      }
      var arrastrando = false;
      caja.addEventListener('pointerdown', function (ev) {
        if (!st.ini || st.congelado) return;
        arrastrando = true;
        /* Se captura el puntero para que el «soltar» llegue a esta caja
           aunque el dedo termine fuera. Con el listener en window se
           acumulaba uno por cada toma: el alumno que lee cinco textos
           seguidos dejaba cinco escuchas vivas apuntando a nada. */
        try { caja.setPointerCapture(ev.pointerId); } catch (e) {}
        var i = palabraDe(ev); if (i != null) marca(i);
      });
      caja.addEventListener('pointermove', function (ev) {
        if (!arrastrando || !st.ini || st.congelado) return;
        var i = palabraDe(ev); if (i != null) marca(i);
        ev.preventDefault();
      });
      caja.addEventListener('pointerup', function () { arrastrando = false; });
      caja.addEventListener('pointercancel', function () { arrastrando = false; });

      /* Teclado: en una computadora del aula o con el proyector no hay dedo
         que arrastrar. Las flechas mueven la marca palabra a palabra. */
      caja.setAttribute('tabindex', '0');
      caja.addEventListener('keydown', function (ev) {
        if (!st.ini) return;
        var paso = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[ev.key];
        if (paso) { marca(Math.max(0, Math.min(spans.length - 1, (st.idx == null ? -1 : st.idx) + paso))); ev.preventDefault(); }
        else if (ev.key === 'Home') { marca(0); ev.preventDefault(); }
        else if (ev.key === 'End') { marca(spans.length - 1); ev.preventDefault(); }
      });
      /* Después del minuto queda UN toque disponible: no para seguir
         leyendo, sino para corregir la marca si el dedo se quedó atrás
         de la voz. El cronómetro ya está parado en 60 s, así que ese
         toque no cambia el tiempo, solo dice hasta dónde llegó. */
      caja.addEventListener('click', function (ev) {
        if (!st.ini) return;
        var el = ev.target.closest ? ev.target.closest('.lm-p') : null;
        if (el) marca(+el.dataset.i);
      });

      function alPreguntas() {
        if (st.idx == null) { aviso('👆 Antes marca <strong>hasta dónde llegaste a leer</strong>: toca esa palabra.'); return; }
        pararTimer();
        st.resp = t.preguntas.map(function () { return null; });
        st.revisado = false;
        st.fase = 'preguntas';
        pinta();
      }

      function terminarMinuto(porTiempo) {
        pararTimer();
        st.congelado = true;
        st.seg = porTiempo ? SEGUNDOS : Math.max(1, Math.round((Date.now() - st.ini) / 100) / 10);
        num.textContent = porTiempo ? '0' : Math.max(0, SEGUNDOS - Math.round(st.seg));
        crono.classList.add('lm-fin');
        btnFin.style.display = 'none';
        btnsPreg.forEach(function (b) { b.style.display = ''; });
        suena('up'); vibra([180, 90, 180]);
        if (porTiempo) {
          if (st.modo === 'guia') {
            aviso('⏰ <strong>¡Minuto cumplido!</strong> La guía se detuvo en la palabra ' + (st.guiaIdx + 1) + ' de ' + ps.length +
              '. Ahora toca la palabra <strong>hasta donde llegaste tú</strong> leyendo en voz alta: si le seguiste el paso, es la misma.');
          } else {
            aviso('⏰ <strong>¡Minuto cumplido!</strong> Todo se detuvo aquí. Si tu dedo se quedó atrás de tu voz, ' +
              'toca ahora la <strong>última palabra que alcanzaste a leer</strong>.');
          }
        } else {
          aviso('✅ <strong>Terminaste el texto en ' + st.seg + ' segundos.</strong> Vamos a las preguntas.');
        }
      }

      btnArr.onclick = function () {
        if (st.ini) return;
        suena('click');
        st.ini = Date.now();
        btnArr.style.display = 'none';
        btnFin.style.display = '';
        caja.classList.add('lm-viva');
        sub.textContent = st.modo === 'guia'
          ? 'Sigue con la voz la palabra encendida. No te adelantes ni te quedes atrás.'
          : 'Ve pasando el dedo por encima de lo que vas leyendo.';
        if (st.modo === 'guia') marca(0);
        st.timer = setInterval(function () {
          var ms = Date.now() - st.ini;
          var quedan = Math.max(0, SEGUNDOS - ms / 1000);
          num.textContent = Math.ceil(quedan);
          crono.classList.toggle('lm-poco', quedan <= 10 && quedan > 0);
          barra.style.width = (quedan / SEGUNDOS * 100) + '%';
          if (st.modo === 'guia') {
            var i = Math.min(ps.length - 1, Math.floor(ms / msPorPalabra));
            if (i !== st.guiaIdx) { st.guiaIdx = i; marca(i); }
          }
          if (ms >= SEGUNDOS * 1000) terminarMinuto(true);
        }, 60);
      };

      btnFin.onclick = function () {
        if (!st.ini || st.congelado) return;
        /* Terminó todo el texto antes del minuto: la última palabra es
           la última, y el tiempo real es el que marca el cronómetro. */
        marca(ps.length - 1);
        terminarMinuto(false);
      };
      btnsPreg.forEach(function (b) { b.onclick = alPreguntas; });
      document.getElementById('lm-cancelar').onclick = function () { suena('click'); reiniciar(); pinta(); };
    }

    /* ══════════════ FASE 3 · las cinco preguntas ══════════════ */
    function pintaPreguntas() {
      var t = actual();
      if (!t) { reiniciar(); pinta(); return; }
      var contestadas = st.resp.filter(function (r) { return r !== null; }).length;
      var LETRA = ['a', 'b', 'c'];

      raiz.innerHTML =
        '<div class="card ac-gold">' +
          '<h2>❓ Cinco preguntas sobre «' + esc(t.titulo) + '»</h2>' +
          '<p class="lm-pista">Contesta sin volver a mirar el texto. Una de opinión no tiene una sola respuesta buena: ' +
            'elige la que mejor puedas defender.</p>' +
          t.preguntas.map(function (p, i) {
            return '<div class="lm-preg">' +
              '<div class="lm-preg-q">' + (i + 1) + '. ' + esc(p.q) + '</div>' +
              '<div class="lm-ops" role="group">' +
                p.o.map(function (o, j) {
                  var cls = 'lm-op';
                  if (st.resp[i] === j) cls += ' on';
                  if (st.revisado) {
                    if (j === p.c) cls += ' lm-ok';
                    else if (st.resp[i] === j) cls += ' lm-no';
                  }
                  return '<button class="' + cls + '" data-lm-resp="' + i + '" data-lm-op="' + j + '"' +
                    (st.revisado ? ' disabled' : '') + '><b>' + LETRA[j] + ')</b> ' + esc(o) + '</button>';
                }).join('') +
              '</div>' +
              (st.revisado && st.resp[i] !== p.c
                ? '<div class="lm-guia">💡 ' + esc(p.r) + '</div>'
                : '') +
            '</div>';
          }).join('') +
          '<div class="lm-btns">' +
            (st.revisado
              ? '<button class="btn btn-pri" id="lm-ver">📊 Ver mi resultado</button>'
              : '<button class="btn btn-g" id="lm-revisar"' + (contestadas === t.preguntas.length ? '' : ' disabled') + '>✅ ' +
                (contestadas === t.preguntas.length ? 'Revisar mis respuestas' : 'Contesta las ' + t.preguntas.length + ' (' + contestadas + '/' + t.preguntas.length + ')') + '</button>') +
            '<button class="btn btn-d" id="lm-salir">↩️ Salir sin guardar</button>' +
          '</div>' +
        '</div>';

      cada('[data-lm-resp]', function (b) {
        b.onclick = function () {
          if (st.revisado) return;
          st.resp[+b.dataset.lmResp] = +b.dataset.lmOp;
          suena('click');
          pinta();
        };
      });
      var rev = document.getElementById('lm-revisar');
      if (rev) rev.onclick = function () {
        if (st.resp.some(function (r) { return r === null; })) return;
        st.revisado = true;
        var ok = aciertos(t);
        suena(ok >= 4 ? 'ok' : 'click');
        pinta();
      };
      var ver = document.getElementById('lm-ver');
      if (ver) ver.onclick = function () { suena('click'); st.fase = 'resultado'; pinta(); };
      document.getElementById('lm-salir').onclick = function () { suena('click'); reiniciar(); pinta(); };
    }

    function aciertos(t) {
      return t.preguntas.reduce(function (s, p, i) { return s + (st.resp[i] === p.c ? 1 : 0); }, 0);
    }

    /* ══════════════ FASE 4 · resultado y adjetivos del texto ══════════════ */
    function pintaResultado() {
      var t = actual();
      if (!t) { reiniciar(); pinta(); return; }
      var ps = palabras(t.texto);
      var leidas = st.idx + 1;
      var ppm = st.seg > 0 ? Math.round((leidas / st.seg) * 60) : 0;
      var comp = aciertos(t);
      var vel = lecNivelVelocidad(st.grado, ppm);
      var nc = lecNivelComprension(comp, t.preguntas.length);

      /* Se guarda UNA sola vez por toma. Esta fase hoy no se vuelve a
         pintar, pero si mañana algo la repinta —un botón nuevo, el modo
         libro— la toma se contaría dos veces en el expediente del alumno,
         y un intento fantasma es un dato falso. */
      if (!st.guardado) {
        st.guardado = guardarResultado(t.id, { ppm: ppm, comp: comp, compDe: t.preguntas.length });
        registra(t, ppm, leidas, ps.length, comp);
      }
      var guardado = st.guardado;
      if (typeof op.alTerminar === 'function') {
        try {
          op.alTerminar({
            textoId: t.id, titulo: t.titulo, grado: st.grado, ppm: ppm, seg: st.seg,
            palabras: leidas, total: ps.length, comp: comp, compDe: t.preguntas.length,
            nivelVelocidad: vel.clave, intentos: guardado.intentos, modo: st.modo
          });
        } catch (e) {}
      }

      /* Adjetivos del texto: se marcan encima de lo que acaba de leer.
         Comparando palabra por palabra (no con indexOf) para no pintar
         «alto» dentro de «altos» ni media palabra suelta. */
      var setAdj = {}, setDet = {};
      (t.adjs || []).forEach(function (p) { setAdj[clave(p)] = 1; });
      (t.dets || []).forEach(function (p) { setDet[clave(p)] = 1; });
      var nAdj = 0, nDet = 0;
      var pintado = ps.map(function (p) {
        var k = clave(p);
        if (setAdj[k]) { nAdj++; return '<span class="lm-p lm-adj">' + esc(p) + '</span>'; }
        if (setDet[k]) { nDet++; return '<span class="lm-p lm-det">' + esc(p) + '</span>'; }
        return '<span class="lm-p">' + esc(p) + '</span>';
      }).join(' ');

      raiz.innerHTML =
        '<div class="card ac-jade">' +
          '<h2>📊 Tu minuto de lectura</h2>' +
          '<div class="lm-hero"><b>' + ppm + '</b><span>palabras por minuto</span></div>' +
          '<div class="lm-chips">' +
            chip('Velocidad · ' + st.grado + 'º: ' + vel.banda[0] + '–' + vel.banda[1], vel.etiqueta, vel.color) +
            chip('Comprensión · ' + comp + ' de ' + t.preguntas.length, nc ? nc.etiqueta : '—', nc ? nc.color : '') +
            chip('Lo que leíste', leidas + ' de ' + ps.length + ' palabras en ' + st.seg + ' s', '') +
          '</div>' +
          '<div class="lm-veredicto">🩺 ' + veredicto(vel, nc, ppm) + '</div>' +
          '<p class="lm-pista">La banda de ' + st.grado + 'º es de <strong>fin de grado</strong> (' + esc(LECTURA_NORMAS.fuenteCorta) + '): ' +
            'si estamos a mitad del año, es normal ir por debajo. Aquí no se mide la <em>precisión</em> —cuántas palabras se ' +
            'cambian o se saltan—, porque para eso alguien tiene que escucharte: esa parte la toma tu maestro en Mi aula.</p>' +
        '</div>' +

        '<div class="card ac-amber">' +
          '<h2>🎨 Los adjetivos de esta lectura</h2>' +
          '<p class="lm-pista">Esto es lo que estabas leyendo sin darte cuenta: <strong>' + nAdj + ' adjetivos calificativos</strong> ' +
            'y <strong>' + nDet + ' determinativos</strong> en un solo texto. Sin ellos no sabrías cómo era nada de lo que leíste.</p>' +
          '<div class="lm-leyenda">' +
            '<span><i class="lm-p lm-adj">calificativo</i> dice cómo es</span>' +
            '<span><i class="lm-p lm-det">determinativo</i> dice cuál, de quién o cuántos</span>' +
          '</div>' +
          '<div class="lm-texto">' + pintado + '</div>' +
          '<div class="lm-btns">' +
            '<button class="btn btn-pri" id="lm-otra">📚 Otra lectura</button>' +
            '<button class="btn btn-g" id="lm-repetir">🔁 Repetir esta</button>' +
          '</div>' +
          '<p class="lm-pista">Repetir <strong>el mismo texto</strong> dos o tres días seguidos es el ejercicio que más sube la ' +
            'fluidez. No es trampa: es entrenamiento.</p>' +
        '</div>';

      document.getElementById('lm-otra').onclick = function () { suena('click'); reiniciar(); pinta(); };
      document.getElementById('lm-repetir').onclick = function () {
        suena('click');
        pararTimer();
        st.fase = 'leer'; st.ini = 0; st.seg = 0; st.idx = null;
        st.congelado = false; st.guiaIdx = 0; st.resp = []; st.revisado = false;
        st.guardado = null;
        pinta();
      };
    }

    function chip(etq, valor, color) {
      return '<div class="lm-chip"><span>' + esc(etq) + '</span><b' + (color ? ' style="color:' + color + '"' : '') + '>' +
        esc(valor) + '</b></div>';
    }

    /* El veredicto le habla al ALUMNO, y nunca lo etiqueta: dice qué
       hacer esta semana. Mismo criterio que el de Mi aula (la velocidad
       sin comprensión no es fluidez), pero sin el dato de precisión,
       que aquí no se toma. */
    function veredicto(vel, nc, ppm) {
      var lento = vel.clave === 'apoyo' || vel.clave === 'acerca';
      var pctC = nc ? nc.pct : 100;
      if (pctC < 60 && !lento) {
        return 'Vas rápido, pero se te está escapando lo que dice el texto. Eso todavía no es leer: es descifrar de prisa. ' +
          'Prueba a bajar la marcha y leer «para contárselo a alguien» — la velocidad ya la tienes.';
      }
      if (pctC >= 80 && lento) {
        return 'Entendiste muy bien aunque todavía leas despacio, y ese es el camino difícil, que es el bueno. ' +
          'La velocidad sube sola con diez minutos diarios en voz alta; no la apures.';
      }
      if (vel.clave === 'avanzado' && pctC >= 80) {
        return '¡Vas por encima de lo que se espera en ' + st.grado + 'º y además entendiste! Estás listo para textos de un grado ' +
          'mayor, y para leerle en voz alta a alguien más pequeño: es el mejor ejercicio que existe.';
      }
      if (vel.clave === 'estandar' && pctC >= 80) {
        return 'Vas dentro de lo que se espera en ' + st.grado + 'º y entendiste el texto. Sostén diez minutos diarios de lectura ' +
          'en voz alta y cierras el año por arriba de la banda.';
      }
      if (!lento) {
        return 'La velocidad ya la tienes para ' + st.grado + 'º; lo que falta afinar es la comprensión. Relee este mismo texto ' +
          'y cuéntalo con tus palabras antes de contestar: verás cuánto cambia.';
      }
      return 'Todavía vas por debajo de la banda de ' + st.grado + 'º, y eso tiene remedio conocido: diez minutos diarios en voz ' +
        'alta, releyendo el mismo texto dos o tres días. La relectura es lo que más sube la fluidez.';
    }

    /* Evidencia para el maestro (registro.html y la nube). Si la misión
       no cargó la capa de registro, esto simplemente no ocurre. */
    function registra(t, ppm, leidas, total, comp) {
      if (!window.METAS || typeof window.METAS.registrar !== 'function') return;
      try {
        window.METAS.registrar('lectura', {
          textoId: t.id, titulo: t.titulo, gradoTexto: st.grado, modo: st.modo,
          ppm: ppm, seg: st.seg, palabras: leidas, total: total,
          comp: comp, compDe: t.preguntas.length
        });
      } catch (e) {}
    }

    function cada(sel, fn) { Array.prototype.forEach.call(raiz.querySelectorAll(sel), fn); }

    function pinta() {
      pararTimer();
      if (st.fase === 'leer') pintaLeer();
      else if (st.fase === 'preguntas') pintaPreguntas();
      else if (st.fase === 'resultado') pintaResultado();
      else pintaElegir();
    }

    pinta();
    return {
      repintar: pinta,
      /* Si el alumno se cambia de pestaña a media toma, el cronómetro
         no puede seguir corriendo a sus espaldas: se cancela y vuelve
         a la lista. Un minuto medido a medias no es un minuto. */
      soltar: function () { if (st.fase === 'leer' && st.ini) { reiniciar(); pinta(); } else pararTimer(); },
      estado: function () { return st.fase; }
    };
  }

  window.LecturaMision = { montar: montar, version: 1 };
})();
