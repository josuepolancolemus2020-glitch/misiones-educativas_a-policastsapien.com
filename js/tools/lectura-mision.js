/* ══════════════════════════════════════════════════════════════
   📖 CONTROL DE LECTURA DENTRO DE UNA MISIÓN — motor

   La pestaña 📖 Lectura de Mi aula la maneja el MAESTRO: elige al
   alumno, escucha, cuenta los errores y marca las respuestas. Sirve
   para tomar la fluidez de 43 niños uno por uno.

   Esto es lo otro: el ALUMNO solo, con el teléfono en la mano. Lee un
   minuto en voz alta y después TRABAJA ese mismo texto en cuatro
   actividades. La lectura no es la meta: es la materia prima.

   ── Por qué hay un solo modo de leer ──
   La primera versión le preguntaba al alumno si quería marcar él con
   el dedo o dejar que las palabras se encendieran solas. Se quitó: el
   maestro reportó que esa pregunta, puesta JUSTO ANTES de arrancar,
   distraía muchísimo — el niño se ponía a probar los dos modos en vez
   de leer, y llegaba al minuto sin haber leído nada. Ahora hay una
   sola forma, la que además mide de verdad: lee en voz alta y va
   pasando el dedo por lo que lee. Al minuto, todo se detiene.

   ── Qué cambia por no haber maestro delante ──
   · NO se cuentan errores de lectura. Un niño no puede escucharse y
     contarse los tropiezos a la vez, y un dato inventado es peor que
     ningún dato. Se mide VELOCIDAD y COMPRENSIÓN, y la pantalla lo
     dice: la precisión se toma con el maestro, en Mi aula.
   · El veredicto le habla a ÉL, de tú, y nunca lo etiqueta: dice qué
     hacer esta semana, no lo que es.

   ── El taller: cuatro actividades sobre el texto recién leído ──
   1. ❓ ¿Qué entendiste? — las cinco preguntas, UNA A LA VEZ y en
      letra grande. Antes iban las cinco juntas y en letra chica: en
      un teléfono eso es un muro de texto y el niño contesta por
      contestar.
   2. 🎯 Caza de adjetivos — los toca sobre el texto que acaba de leer
      en voz alta. Aquí está la razón de que la lectura viva dentro de
      la misión: el tema que estudió aparece encima de algo suyo.
   3. 🗂️ ¿Califica o determina? — clasifica los que cazó. Encontrar no
      es lo mismo que entender qué clase de adjetivo es.
   4. ✏️ ¿Cómo lo decía el texto? — vuelve a la lectura de memoria a
      buscar el adjetivo exacto. Comprensión y vocabulario a la vez.

   El motor no sabe de qué tema son los textos: las tres primeras
   actividades salen de `adjs`/`dets`/`neutros` y la cuarta se arma
   sola con las oraciones del texto. Una misión nueva escribe su
   corpus y ya tiene su taller.

   Las NORMAS (banda de palabras por minuto por grado) viven en
   js/data/lectura-normas.js; las CLASES de palabra que no se dejan al
   criterio de nadie (artículos, determinativos) en
   js/data/lectura-clases.js. Aquí no se escribe ninguna de las dos.

   Uso desde una misión:
     <script src="../../js/data/lectura-normas.js"></script>
     <script src="../../js/data/lectura-clases.js"></script>
     <script src="js/lectura-<tema>.js"></script>
     <script src="../../js/tools/lectura-mision.js"></script>
     LecturaMision.montar({
       contenedor: 'lm-root', corpus: LECTURA_ADJETIVOS,
       mision: 'adjetivos', tema: 'los adjetivos',
       alTerminar: function (r) { ... }   // XP y logros de la misión
     });
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CLAVE = 'METAS_LECTURA_MISION_V1';   /* resultados por misión y texto */
  var CLAVE_PREF = 'METAS_LECTURA_MISION_PREF';  /* grado elegido */
  var SEGUNDOS = 60;
  var META_CAZA = 10;       /* adjetivos que hay que cazar para cumplir */
  var CLASIFICA_N = 6;      /* palabras que se clasifican */
  var COMPLETA_N = 4;       /* huecos de «¿cómo lo decía el texto?» */

  /* ── utilidades ── */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function palabras(texto) { return String(texto || '').trim().split(/\s+/); }
  /* Quita puntuación para comparar palabras. \b de JavaScript no sirve con
     acentos («ú» no es carácter de palabra para el motor), así que se
     compara palabra contra palabra, ya limpias. Esta expresión tiene que
     ser IDÉNTICA a la de _dev/valida-lectura-mision.js: si no, el
     validador aprueba palabras que aquí no se reconocen. */
  var LIMPIA = /[.,;:()¿?¡!«»"“”'’…—–]/g;
  function clave(p) { return String(p).replace(LIMPIA, '').toLowerCase(); }
  /* Marca del hueco de «¿cómo lo decía el texto?». Es un carácter que no
     puede aparecer en una lectura, para poder sustituirlo sin miedo. */
  var HUECO = '';
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

  /* Barajado con semilla: el MISMO texto da SIEMPRE las mismas
     actividades. La misión le pide al alumno que relea el texto dos o
     tres días —es lo que más sube la fluidez—, y con actividades que
     cambian cada vez no podría notar que va mejorando. */
  function semilla(txt) {
    var h = 2166136261;
    for (var i = 0; i < txt.length; i++) { h ^= txt.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6D2B79F5; var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function baraja(arr, rnd) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }

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

  /* Oraciones como rangos de índices de palabra: las necesitan la
     actividad de clasificar (para dar contexto) y la de completar. */
  function oraciones(ps) {
    var out = [], ini = 0;
    ps.forEach(function (p, i) {
      if (/[.:;!?»]$/.test(p) || /[.!?]»$/.test(p)) {
        if (i - ini >= 3) out.push({ ini: ini, fin: i });
        ini = i + 1;
      }
    });
    if (ps.length - ini >= 3) out.push({ ini: ini, fin: ps.length - 1 });
    return out;
  }

  /* ══════════════ CSS ══════════════
     Va aquí y no en el CSS de la misión a propósito: así una misión
     nueva estrena la sección con un solo <script>. Usa las variables
     de color de la misión, con respaldo por si alguna no las define.

     La LETRA DE LAS ACTIVIDADES es deliberadamente grande. Lo pidió el
     maestro y tiene razón: esto lo lee un niño en un teléfono, muchas
     veces con poca luz, y una pregunta que no se lee cómoda se
     contesta a la ligera. */
  var CSS = [
    '.lm-wrap{--lm-pri:var(--pri,#419b88);--lm-sec:var(--sec,#c49000);--lm-card:var(--card,#fff);',
    '--lm-borde:var(--border,#e2ddd4);--lm-txt:var(--dark,#1b2838);--lm-gris:var(--gray,#636e72);',
    '--lm-ok:var(--jade,#00b894);--lm-no:var(--red,#d63031);--lm-det:var(--purple,#6c5ce7);}',
    '.lm-grados{display:flex;flex-wrap:wrap;gap:0.4rem;margin:0.6rem 0;}',
    '.lm-grado{font-family:"Fredoka",sans-serif;font-size:1rem;font-weight:600;min-width:58px;padding:0.55rem 0.85rem;',
    'border:2px solid var(--lm-borde);border-radius:12px;background:var(--lm-card);color:var(--lm-txt);cursor:pointer;transition:all 0.15s;}',
    '.lm-grado:hover{transform:translateY(-2px);}',
    '.lm-grado.on{background:linear-gradient(135deg,var(--lm-pri),var(--lm-sec));color:#fff;border-color:transparent;}',
    '.lm-pista{font-size:0.88rem;color:var(--lm-gris);line-height:1.6;margin:0.4rem 0;}',
    '.lm-lista{display:flex;flex-direction:column;gap:0.45rem;margin:0.6rem 0;}',
    '.lm-txt-row{display:block;width:100%;text-align:left;padding:0.65rem 0.8rem;border:2px solid var(--lm-borde);',
    'border-radius:12px;background:var(--lm-card);color:var(--lm-txt);cursor:pointer;font-family:inherit;transition:all 0.15s;}',
    '.lm-txt-row.on{border-color:var(--lm-pri);background:var(--pri-gl,rgba(65,155,136,0.12));}',
    '.lm-txt-tit{display:block;font-family:"Fredoka",sans-serif;font-size:1.02rem;font-weight:600;}',
    '.lm-txt-meta{display:block;font-size:0.8rem;color:var(--lm-gris);margin-top:0.15rem;}',
    '.lm-pasos{display:flex;gap:0.35rem;align-items:center;font-size:0.8rem;color:var(--lm-gris);margin-bottom:0.5rem;flex-wrap:wrap;}',
    '.lm-paso{width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;',
    'border:2px solid var(--lm-borde);font-size:0.8rem;background:var(--lm-card);}',
    '.lm-paso.on{border-color:var(--lm-pri);background:var(--lm-pri);color:#fff;font-weight:700;}',
    '.lm-paso.ya{border-color:var(--lm-ok);color:var(--lm-ok);}',
    /* cronómetro */
    '.lm-crono-caja{display:flex;align-items:center;gap:0.9rem;margin:0.6rem 0;flex-wrap:wrap;}',
    '.lm-crono{font-family:"Fredoka",sans-serif;font-size:2.6rem;font-weight:700;line-height:1;color:var(--lm-pri);',
    'font-variant-numeric:tabular-nums;min-width:3.4ch;}',
    '.lm-crono small{font-size:0.9rem;font-weight:400;color:var(--lm-gris);margin-left:0.1rem;}',
    '.lm-crono.lm-poco{color:var(--lm-sec);}',
    '.lm-crono.lm-fin{color:var(--lm-no);}',
    '.lm-barra{flex:1;min-width:120px;height:10px;border-radius:8px;background:var(--lm-borde);overflow:hidden;}',
    '.lm-barra i{display:block;height:100%;width:100%;background:linear-gradient(90deg,var(--lm-pri),var(--lm-sec));transition:width 0.1s linear;}',
    '.lm-crono-sub{font-size:0.85rem;color:var(--lm-gris);width:100%;}',
    /* el texto que se lee y se caza */
    /* text-align a la izquierda SIEMPRE, aunque la misión justifique sus
       párrafos: el texto justificado abre huecos desiguales entre palabras
       y el lector que va despacio pierde el renglón justo en esos huecos. */
    '.lm-texto{margin:0.7rem 0;font-size:1.18rem;line-height:2.05;text-align:left;',
    'user-select:none;-webkit-user-select:none;touch-action:pan-y;}',
    '.lm-p{padding:0.08em 0.06em;border-radius:5px;transition:background 0.12s,color 0.12s;}',
    '.lm-viva .lm-p{cursor:pointer;}',
    '.lm-p.lm-leida{background:var(--pri-gl,rgba(65,155,136,0.18));}',
    '.lm-p.lm-aqui{background:var(--lm-pri);color:#fff;font-weight:700;box-shadow:0 0 0 2px var(--lm-pri);}',
    '.lm-p.lm-adj{background:var(--sec-gl,rgba(196,144,0,0.22));color:var(--lm-txt);font-weight:700;',
    'box-shadow:inset 0 -0.18em 0 var(--lm-sec);}',
    '.lm-p.lm-det{background:var(--purple-gl,rgba(108,92,231,0.18));color:var(--lm-txt);font-weight:700;',
    'box-shadow:inset 0 -0.18em 0 var(--lm-det);}',
    '.lm-p.lm-hallada{background:var(--jade-gl,rgba(0,184,148,0.22));color:var(--lm-txt);font-weight:700;',
    'box-shadow:inset 0 -0.18em 0 var(--lm-ok);}',
    '.lm-p.lm-fallo{background:var(--red-gl,rgba(214,48,49,0.16));animation:lm-tiembla 0.3s;}',
    '@keyframes lm-tiembla{0%,100%{transform:translateX(0)}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}',
    '.lm-aviso{margin:0.5rem 0;padding:0.6rem 0.85rem;border-radius:10px;font-size:0.95rem;line-height:1.55;',
    'background:var(--sec-gl,rgba(196,144,0,0.12));border-left:4px solid var(--lm-sec);color:var(--lm-txt);}',
    '.lm-aviso.lm-av-ok{background:var(--jade-gl,rgba(0,184,148,0.14));border-left-color:var(--lm-ok);}',
    '.lm-aviso.lm-av-no{background:var(--red-gl,rgba(214,48,49,0.10));border-left-color:var(--lm-no);}',
    /* preguntas y actividades — letra grande a propósito */
    '.lm-preg-q{font-size:1.18rem;font-weight:700;line-height:1.5;margin:0.5rem 0 0.7rem;color:var(--lm-txt);}',
    '.lm-ops{display:flex;flex-direction:column;gap:0.5rem;}',
    '.lm-op{text-align:left;padding:0.7rem 0.85rem;border:2px solid var(--lm-borde);border-radius:12px;',
    'background:var(--lm-card);color:var(--lm-txt);cursor:pointer;font-family:inherit;font-size:1.05rem;line-height:1.5;}',
    '.lm-op:hover{border-color:var(--lm-pri);}',
    '.lm-op b{color:var(--lm-pri);margin-right:0.3rem;}',
    '.lm-op.lm-ok{border-color:var(--lm-ok);background:var(--jade-gl,rgba(0,184,148,0.14));}',
    '.lm-op.lm-no{border-color:var(--lm-no);background:var(--red-gl,rgba(214,48,49,0.10));}',
    '.lm-op[disabled]{cursor:default;opacity:0.95;}',
    '.lm-guia{margin-top:0.5rem;font-size:0.95rem;line-height:1.55;color:var(--lm-txt);',
    'background:var(--pri-gl,rgba(65,155,136,0.10));border-radius:10px;padding:0.55rem 0.75rem;}',
    '.lm-marcador{display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;font-family:"Fredoka",sans-serif;',
    'font-size:1.05rem;font-weight:600;color:var(--lm-txt);margin:0.4rem 0;}',
    '.lm-marcador em{font-style:normal;color:var(--lm-gris);font-size:0.85rem;font-weight:400;}',
    '.lm-frase{font-size:1.15rem;line-height:1.8;margin:0.6rem 0;color:var(--lm-txt);}',
    '.lm-frase u{text-decoration:none;background:var(--sec-gl,rgba(196,144,0,0.28));border-radius:5px;',
    'padding:0.06em 0.25em;font-weight:700;box-shadow:inset 0 -0.18em 0 var(--lm-sec);}',
    '.lm-hueco{display:inline-block;min-width:5.5em;border-bottom:3px solid var(--lm-sec);text-align:center;',
    'font-weight:700;color:var(--lm-sec);}',
    '.lm-dosbtn{display:flex;gap:0.6rem;flex-wrap:wrap;margin-top:0.5rem;}',
    '.lm-dosbtn button{flex:1;min-width:150px;padding:0.8rem 0.7rem;border-radius:14px;border:2px solid var(--lm-borde);',
    'background:var(--lm-card);color:var(--lm-txt);cursor:pointer;font-family:inherit;font-size:1.02rem;line-height:1.4;text-align:center;}',
    '.lm-dosbtn button b{display:block;font-family:"Fredoka",sans-serif;font-size:1.1rem;}',
    '.lm-dosbtn button small{display:block;color:var(--lm-gris);font-size:0.85rem;margin-top:0.15rem;}',
    '.lm-dosbtn button.lm-b-adj:hover{border-color:var(--lm-sec);}',
    '.lm-dosbtn button.lm-b-det:hover{border-color:var(--lm-det);}',
    /* resultado */
    '.lm-hero{text-align:center;margin:0.4rem 0 0.7rem;}',
    '.lm-hero b{display:block;font-family:"Fredoka",sans-serif;font-size:3.2rem;line-height:1;color:var(--lm-pri);}',
    '.lm-hero span{display:block;font-size:0.9rem;color:var(--lm-gris);margin-top:0.2rem;}',
    '.lm-chips{display:flex;flex-wrap:wrap;gap:0.45rem;margin:0.6rem 0;}',
    '.lm-chip{flex:1;min-width:136px;border:2px solid var(--lm-borde);border-radius:12px;padding:0.5rem 0.65rem;background:var(--lm-card);}',
    '.lm-chip span{display:block;font-size:0.75rem;color:var(--lm-gris);text-transform:uppercase;letter-spacing:0.4px;}',
    '.lm-chip b{display:block;font-family:"Fredoka",sans-serif;font-size:1.02rem;margin-top:0.1rem;}',
    '.lm-veredicto{margin:0.6rem 0;padding:0.75rem 0.9rem;border-radius:12px;font-size:1rem;line-height:1.65;',
    'background:var(--pri-gl,rgba(65,155,136,0.12));border-left:4px solid var(--lm-pri);}',
    '.lm-leyenda{display:flex;flex-wrap:wrap;gap:0.8rem;font-size:0.85rem;color:var(--lm-gris);margin:0.4rem 0;}',
    '.lm-leyenda i{font-style:normal;padding:0.05em 0.35em;border-radius:5px;font-weight:700;}',
    '.lm-btns{display:flex;flex-wrap:wrap;gap:0.55rem;margin-top:0.8rem;}',
    '@media (max-width:520px){.lm-texto{font-size:1.1rem;line-height:1.95;}.lm-hero b{font-size:2.6rem;}',
    '.lm-preg-q{font-size:1.1rem;}.lm-op{font-size:1rem;}}'
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
    /* Artículos y palabras discutidas: no cuentan ni a favor ni en contra
       en la cacería. El porqué está en js/data/lectura-clases.js. */
    var NEUTROS_GLOBAL = (typeof LECTURA_CLASES !== 'undefined' && LECTURA_CLASES.neutros) ? LECTURA_CLASES.neutros : [];

    var ACTIVIDADES = [
      { id: 'comprension', icono: '❓', titulo: '¿Qué entendiste?' },
      { id: 'caza', icono: '🎯', titulo: 'Caza de adjetivos' },
      { id: 'clasifica', icono: '🗂️', titulo: '¿Califica o determina?' },
      { id: 'completa', icono: '✏️', titulo: '¿Cómo lo decía el texto?' }
    ];

    var pref = leerJSON(CLAVE_PREF, {}) || {};
    var st = null;
    function limpio(fase) {
      return {
        fase: fase || 'elegir',
        grado: st ? st.grado : null,
        textoId: st ? st.textoId : null,
        ini: 0, seg: 0, idx: null, congelado: false,
        acto: 0,                 /* actividad del taller en curso */
        pregIdx: 0, resp: [],    /* comprensión */
        caza: [], cazaFallos: 0, cazaRendido: false,
        clasIdx: 0, clasResp: [],
        compIdx: 0, compResp: [],
        guardado: null, timer: null
      };
    }
    st = limpio('elegir');
    st.grado = (grados.indexOf(pref.grado) >= 0 ? pref.grado : null) || gradoIdentificado(grados);

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
        ppm: dato.ppm, comp: dato.comp, compDe: dato.compDe, puntos: dato.puntos, f: hoy()
      };
      guardarJSON(CLAVE, todo);
      return todo[mision][textoId];
    }

    function textos() { return (st.grado && corpus[st.grado]) || []; }
    function actual() {
      var l = textos();
      for (var i = 0; i < l.length; i++) if (l[i].id === st.textoId) return l[i];
      return null;
    }
    function pararTimer() { if (st.timer) { clearInterval(st.timer); st.timer = null; } }
    function reiniciar() { pararTimer(); var g = st.grado; st = limpio('elegir'); st.grado = g; }

    /* ══════════════ Datos derivados de la lectura ══════════════ */
    function inventario(t) {
      var adj = {}, det = {}, neu = {};
      (t.adjs || []).forEach(function (p) { adj[clave(p)] = 1; });
      (t.dets || []).forEach(function (p) { det[clave(p)] = 1; });
      (t.neutros || []).forEach(function (p) { neu[clave(p)] = 1; });
      NEUTROS_GLOBAL.forEach(function (p) { neu[clave(p)] = 1; });
      return { adj: adj, det: det, neu: neu };
    }
    /* Índices de palabra que son adjetivo (para la cacería). Se guardan
       los ÍNDICES y no las palabras: si «verde» sale tres veces, cada
       aparición se caza por separado, como en el papel. */
    function indicesAdjetivos(ps, inv) {
      var out = [];
      ps.forEach(function (p, i) {
        var k = clave(p);
        if (inv.adj[k]) out.push({ i: i, clase: 'adj' });
        else if (inv.det[k]) out.push({ i: i, clase: 'det' });
      });
      return out;
    }
    /* Las seis palabras de «¿califica o determina?»: mitad y mitad,
       siempre las mismas para este texto (semilla). */
    function itemsClasifica(t, ps) {
      var rnd = semilla(t.id + '·clasifica');
      var adj = baraja(t.adjs || [], rnd), det = baraja(t.dets || [], rnd);
      var nDet = Math.min(3, det.length);
      var nAdj = Math.min(CLASIFICA_N - nDet, adj.length);
      var lista = adj.slice(0, nAdj).map(function (p) { return { palabra: p, clase: 'adj' }; })
        .concat(det.slice(0, nDet).map(function (p) { return { palabra: p, clase: 'det' }; }));
      return baraja(lista, rnd).map(function (it) {
        it.contexto = contextoDe(ps, it.palabra);
        return it;
      });
    }
    /* Un pedazo de la oración donde vive la palabra: clasificar «bajas»
       sin contexto es adivinar («las nubes bajas» o «las casas bajas»). */
    function contextoDe(ps, palabra) {
      var k = clave(palabra);
      var pos = -1;
      for (var i = 0; i < ps.length; i++) if (clave(ps[i]) === k) { pos = i; break; }
      if (pos < 0) return '';
      var a = Math.max(0, pos - 4), b = Math.min(ps.length - 1, pos + 4);
      return (a > 0 ? '… ' : '') + ps.slice(a, b + 1).map(function (p, j) {
        return (a + j === pos) ? '<u>' + esc(p) + '</u>' : esc(p);
      }).join(' ') + (b < ps.length - 1 ? ' …' : '');
    }
    /* «¿Cómo lo decía el texto?»: se tapa un calificativo dentro de su
       oración y se ofrecen otros dos del MISMO texto. Los distractores
       salen de la misma lectura a propósito: así no se acierta por
       descarte de vocabulario, hay que acordarse de lo que se leyó. */
    function itemsCompleta(t, ps) {
      var rnd = semilla(t.id + '·completa');
      var inv = inventario(t);
      var ors = oraciones(ps);
      var candidatos = [];
      ors.forEach(function (o) {
        for (var i = o.ini; i <= o.fin; i++) {
          if (inv.adj[clave(ps[i])]) { candidatos.push({ pos: i, ini: o.ini, fin: o.fin }); break; }
        }
      });
      var elegidos = baraja(candidatos, rnd).slice(0, COMPLETA_N);
      return elegidos.map(function (c) {
        var correcta = ps[c.pos].replace(LIMPIA, '');
        /* Los distractores salen de t.adjs TAL CUAL están escritos, no
           normalizados: si la correcta fuera «Querida» con mayúscula y las
           otras dos en minúscula, la mayúscula sola cantaría la respuesta. */
        var otros = baraja((t.adjs || []).filter(function (p) { return clave(p) !== clave(correcta); }), rnd).slice(0, 2);
        var ops = baraja([correcta].concat(otros), rnd);
        /* El hueco va con una marca que no puede salir del texto. Con un
           «?» literal, `replace('?')` reventaba en las oraciones que ya
           traían un signo de interrogación antes del hueco. */
        var frase = [];
        for (var i = c.ini; i <= c.fin; i++) {
          frase.push(i === c.pos ? HUECO + esc(ps[i].replace(/^[^.,;:!?»]*/, '')) : esc(ps[i]));
        }
        return { frase: frase.join(' '), ops: ops, c: ops.map(clave).indexOf(clave(correcta)) };
      });
    }

    /* ══════════════ FASE 1 · elegir grado y lectura ══════════════ */
    function pintaElegir() {
      var hist = historial();
      var lista = textos();
      var banda = st.grado ? LECTURA_NORMAS.bandas[st.grado] : null;

      raiz.innerHTML =
        '<div class="card ac-teal">' +
          '<h2>📖 Control de lectura</h2>' +
          '<p class="lm-pista">Lees <strong>un minuto en voz alta</strong> pasando el dedo por lo que vas leyendo. ' +
            'Al cumplirse el minuto todo se detiene, y después trabajas ese mismo texto en <strong>cuatro actividades</strong>: ' +
            'entender lo que leíste, cazar los adjetivos tocándolos, clasificarlos y recordar cómo lo decía la lectura.</p>' +
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
          '<p class="lm-pista">Todas son de Honduras y de ' + esc(tema) + '.</p>' +
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
          '<div class="lm-btns">' +
            '<button class="btn btn-pri" id="lm-empezar"' + (st.textoId ? '' : ' disabled') + '>⏱️ Empezar el minuto</button>' +
          '</div>' +
        '</div>');

      cada('[data-lm-grado]', function (b) {
        b.onclick = function () {
          suena('click');
          st.grado = +b.dataset.lmGrado; st.textoId = null;
          guardarJSON(CLAVE_PREF, { grado: st.grado });
          pinta();
        };
      });
      cada('[data-lm-texto]', function (b) {
        b.onclick = function () { suena('click'); st.textoId = b.dataset.lmTexto; pinta(); };
      });
      var e = document.getElementById('lm-empezar');
      if (e) e.onclick = function () {
        if (!actual()) return;
        suena('click');
        var g = st.grado, id = st.textoId;
        st = limpio('leer'); st.grado = g; st.textoId = id;
        pinta();
      };
    }

    /* ══════════════ FASE 2 · el minuto ══════════════ */
    function pintaLeer() {
      var t = actual();
      if (!t) { reiniciar(); pinta(); return; }
      var ps = palabras(t.texto);

      raiz.innerHTML =
        '<div class="card ac-teal">' +
          '<h2>⏱️ ' + esc(t.titulo) + '</h2>' +
          '<div class="lm-crono-caja">' +
            '<div class="lm-crono" id="lm-crono" role="timer" aria-live="off"><span id="lm-num">' + SEGUNDOS + '</span><small>s</small></div>' +
            '<div class="lm-barra"><i id="lm-barra"></i></div>' +
            '<div class="lm-crono-sub" id="lm-sub">Cuando arranques, <strong>lee en voz alta</strong> y ve pasando el dedo por encima de las palabras.</div>' +
          '</div>' +
          /* El botón de seguir va ARRIBA y ABAJO: con un texto de 9º el
             alumno termina el minuto mirando el final, y con uno de 4º
             mirando el principio. Dejarlo en un solo sitio lo obliga a
             buscar por dónde seguir justo cuando ya terminó. */
          '<div class="lm-btns">' +
            '<button class="btn btn-pri" id="lm-arrancar">▶️ Arrancar</button>' +
            '<button class="btn btn-g" id="lm-termine" style="display:none">✅ Terminé el texto</button>' +
            '<button class="btn btn-g" id="lm-seguir" style="display:none">👉 Seguir a las actividades</button>' +
            '<button class="btn btn-d" id="lm-cancelar">Cancelar</button>' +
          '</div>' +
          '<div id="lm-avisos"></div>' +
          '<div class="lm-texto" id="lm-texto" aria-label="Texto para leer en voz alta">' +
            ps.map(function (p, i) { return '<span class="lm-p" data-i="' + i + '">' + esc(p) + '</span>'; }).join(' ') +
          '</div>' +
          '<div class="lm-btns"><button class="btn btn-g" id="lm-seguir2" style="display:none">👉 Seguir a las actividades</button></div>' +
        '</div>';

      var crono = document.getElementById('lm-crono');
      var num = document.getElementById('lm-num');
      var barra = document.getElementById('lm-barra');
      var sub = document.getElementById('lm-sub');
      var avisos = document.getElementById('lm-avisos');
      var caja = document.getElementById('lm-texto');
      var btnArr = document.getElementById('lm-arrancar');
      var btnFin = document.getElementById('lm-termine');
      var btnsSeguir = [document.getElementById('lm-seguir'), document.getElementById('lm-seguir2')];
      var spans = caja.querySelectorAll('.lm-p');

      function marca(i) {
        if (i == null || i < 0 || i >= spans.length) return;
        st.idx = i;
        for (var k = 0; k < spans.length; k++) {
          spans[k].classList.toggle('lm-leida', k < i);
          spans[k].classList.toggle('lm-aqui', k === i);
        }
      }
      function aviso(html, cls) { avisos.innerHTML = '<div class="lm-aviso ' + (cls || '') + '">' + html + '</div>'; }

      /* ── el dedo: pintar arrastrando es el gesto natural de un niño
         siguiendo un renglón, y además es la técnica que la pauta del
         maestro recomienda para leer sin saltarse palabras ── */
      function palabraDe(ev) {
        if (ev.clientX == null) return null;
        var el = document.elementFromPoint(ev.clientX, ev.clientY);
        return el && el.classList && el.classList.contains('lm-p') ? +el.dataset.i : null;
      }
      var arrastrando = false;
      caja.addEventListener('pointerdown', function (ev) {
        if (!st.ini || st.congelado) return;
        arrastrando = true;
        /* Se captura el puntero para que el «soltar» llegue a esta caja
           aunque el dedo termine fuera. Con el listener en window se
           acumulaba uno por cada toma. */
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
      /* Después del minuto queda el toque disponible: no para seguir
         leyendo, sino para corregir la marca si el dedo se quedó atrás
         de la voz. El cronómetro ya está parado, así que ese toque no
         cambia el tiempo, solo dice hasta dónde llegó. */
      caja.addEventListener('click', function (ev) {
        if (!st.ini) return;
        var el = ev.target.closest ? ev.target.closest('.lm-p') : null;
        if (el) marca(+el.dataset.i);
      });
      /* Teclado: en una computadora del aula o con el proyector no hay
         dedo que arrastrar. Las flechas mueven la marca. */
      caja.setAttribute('tabindex', '0');
      caja.addEventListener('keydown', function (ev) {
        if (!st.ini) return;
        var paso = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[ev.key];
        if (paso) { marca(Math.max(0, Math.min(spans.length - 1, (st.idx == null ? -1 : st.idx) + paso))); ev.preventDefault(); }
        else if (ev.key === 'Home') { marca(0); ev.preventDefault(); }
        else if (ev.key === 'End') { marca(spans.length - 1); ev.preventDefault(); }
      });

      function alTaller() {
        if (st.idx == null) { aviso('👆 Antes marca <strong>hasta dónde llegaste a leer</strong>: toca esa palabra.', 'lm-av-no'); return; }
        pararTimer();
        st.resp = t.preguntas.map(function () { return null; });
        st.fase = 'taller'; st.acto = 0; st.pregIdx = 0;
        pinta();
      }

      function terminarMinuto(porTiempo) {
        pararTimer();
        st.congelado = true;
        st.seg = porTiempo ? SEGUNDOS : Math.max(1, Math.round((Date.now() - st.ini) / 100) / 10);
        num.textContent = porTiempo ? '0' : Math.max(0, SEGUNDOS - Math.round(st.seg));
        crono.classList.add('lm-fin');
        btnFin.style.display = 'none';
        btnsSeguir.forEach(function (b) { b.style.display = ''; });
        suena('up'); vibra([180, 90, 180]);
        aviso(porTiempo
          ? '⏰ <strong>¡Minuto cumplido!</strong> Todo se detuvo aquí. Si tu dedo se quedó atrás de tu voz, toca ahora la ' +
            '<strong>última palabra que alcanzaste a leer</strong>.'
          : '✅ <strong>Leíste todo el texto en ' + st.seg + ' segundos.</strong> Vamos a las actividades.',
          porTiempo ? '' : 'lm-av-ok');
      }

      btnArr.onclick = function () {
        if (st.ini) return;
        suena('click');
        st.ini = Date.now();
        btnArr.style.display = 'none';
        btnFin.style.display = '';
        caja.classList.add('lm-viva');
        sub.innerHTML = 'Ve pasando el dedo por encima de lo que vas leyendo.';
        st.timer = setInterval(function () {
          var ms = Date.now() - st.ini;
          var quedan = Math.max(0, SEGUNDOS - ms / 1000);
          num.textContent = Math.ceil(quedan);
          crono.classList.toggle('lm-poco', quedan <= 10 && quedan > 0);
          barra.style.width = (quedan / SEGUNDOS * 100) + '%';
          if (ms >= SEGUNDOS * 1000) terminarMinuto(true);
        }, 60);
      };
      btnFin.onclick = function () {
        if (!st.ini || st.congelado) return;
        marca(ps.length - 1);
        terminarMinuto(false);
      };
      btnsSeguir.forEach(function (b) { b.onclick = alTaller; });
      document.getElementById('lm-cancelar').onclick = function () { suena('click'); reiniciar(); pinta(); };
    }

    /* ══════════════ FASE 3 · el taller de actividades ══════════════ */
    function cabecera(t) {
      return '<div class="lm-pasos">' +
        ACTIVIDADES.map(function (a, i) {
          return '<span class="lm-paso ' + (i === st.acto ? 'on' : (i < st.acto ? 'ya' : '')) + '">' +
            (i < st.acto ? '✓' : (i + 1)) + '</span>';
        }).join('') +
        '<span>Actividad ' + (st.acto + 1) + ' de ' + ACTIVIDADES.length + ' · «' + esc(t.titulo) + '»</span></div>';
    }
    function siguienteActo() {
      st.acto++;
      if (st.acto >= ACTIVIDADES.length) st.fase = 'resultado';
      pinta();
    }

    function pintaTaller() {
      var t = actual();
      if (!t) { reiniciar(); pinta(); return; }
      var acto = ACTIVIDADES[st.acto];
      if (acto.id === 'comprension') actoComprension(t);
      else if (acto.id === 'caza') actoCaza(t);
      else if (acto.id === 'clasifica') actoClasifica(t);
      else actoCompleta(t);
    }

    /* ── 1 · Comprensión: UNA pregunta a la vez y en letra grande ── */
    function actoComprension(t) {
      var i = st.pregIdx;
      var p = t.preguntas[i];
      var dada = st.resp[i];
      var LETRA = ['a', 'b', 'c'];
      var esUltima = i === t.preguntas.length - 1;

      raiz.innerHTML =
        '<div class="card ac-gold">' +
          cabecera(t) +
          '<h2>❓ ¿Qué entendiste?</h2>' +
          '<p class="lm-pista">Pregunta ' + (i + 1) + ' de ' + t.preguntas.length + ' · contesta sin volver a mirar el texto.</p>' +
          '<div class="lm-preg-q">' + esc(p.q) + '</div>' +
          '<div class="lm-ops" role="group">' +
            p.o.map(function (o, j) {
              var cls = 'lm-op';
              if (dada != null) {
                if (j === p.c) cls += ' lm-ok';
                else if (dada === j) cls += ' lm-no';
              }
              return '<button class="' + cls + '" data-lm-op="' + j + '"' + (dada != null ? ' disabled' : '') + '>' +
                '<b>' + LETRA[j] + ')</b> ' + esc(o) + '</button>';
            }).join('') +
          '</div>' +
          (dada == null ? '' :
            '<div class="lm-guia">' +
              (dada === p.c ? '✅ <strong>¡Correcto!</strong> ' : '💡 <strong>La respuesta era la ' + LETRA[p.c] + ').</strong> ') +
              esc(p.r) +
              (p.tipo === 'critica' ? '<br><br>🗣️ En las preguntas de <strong>opinión</strong> también vale otra respuesta si la ' +
                'defiendes con un buen porqué. Cuéntasela a tu maestro.' : '') +
            '</div>' +
            '<div class="lm-btns"><button class="btn btn-pri" id="lm-sig">' +
              (esUltima ? '🎯 Ir a la caza de adjetivos' : 'Siguiente pregunta ▶') + '</button></div>') +
        '</div>';

      cada('[data-lm-op]', function (b) {
        b.onclick = function () {
          if (st.resp[i] != null) return;
          st.resp[i] = +b.dataset.lmOp;
          suena(st.resp[i] === p.c ? 'ok' : 'no');
          pinta();
        };
      });
      var sig = document.getElementById('lm-sig');
      if (sig) sig.onclick = function () {
        suena('click');
        if (esUltima) siguienteActo();
        else { st.pregIdx++; pinta(); }
      };
    }

    /* ── 2 · Caza de adjetivos: se tocan sobre el texto leído ── */
    function actoCaza(t) {
      var ps = palabras(t.texto);
      var inv = inventario(t);
      var todos = indicesAdjetivos(ps, inv);
      var meta = Math.min(META_CAZA, todos.length);
      var hallados = st.caza.length;
      var cumplida = hallados >= meta || st.cazaRendido;

      raiz.innerHTML =
        '<div class="card ac-jade">' +
          cabecera(t) +
          '<h2>🎯 Caza de adjetivos</h2>' +
          '<p class="lm-pista">En esta lectura hay <strong>' + todos.length + ' adjetivos</strong>. Encuentra ' +
            '<strong>al menos ' + meta + '</strong> y tócalos: valen los que dicen <strong>cómo es</strong> algo y los que ' +
            'dicen <strong>cuál, de quién o cuántos</strong>. Los artículos (el, la, un, una) no cuentan.</p>' +
          '<div class="lm-marcador">🎯 ' + Math.min(hallados, meta) + ' de ' + meta + ' encontrados' +
            (hallados > meta ? ' <em>(¡y llevas ' + hallados + ' en total!)</em>' : '') +
            /* El contador de fallos se actualiza SIN repintar: repintar
               borraría el temblor de la palabra y el mensaje que explica
               por qué no era adjetivo, que es lo único que enseña. */
            '<em id="lm-fallos">' + (st.cazaFallos ? ' · ' + st.cazaFallos + ' intento(s) fallido(s)' : '') + '</em></div>' +
          '<div id="lm-avisos">' + (cumplida
            ? '<div class="lm-aviso lm-av-ok">🎉 <strong>' + (st.cazaRendido ? 'Aquí los tienes todos.' : '¡Meta cumplida!') + '</strong> ' +
              (st.cazaRendido ? 'Los que te faltaban quedaron marcados.' : 'Puedes seguir cazando o pasar a la siguiente actividad.') + '</div>'
            : '') + '</div>' +
          '<div class="lm-texto lm-viva" id="lm-texto">' +
            ps.map(function (p, i) {
              var esta = st.caza.indexOf(i) >= 0;
              var cls = 'lm-p' + (esta ? ' lm-hallada' : '');
              if (st.cazaRendido && !esta) {
                var k = clave(p);
                if (inv.adj[k]) cls = 'lm-p lm-adj';
                else if (inv.det[k]) cls = 'lm-p lm-det';
              }
              return '<span class="' + cls + '" data-i="' + i + '">' + esc(p) + '</span>';
            }).join(' ') +
          '</div>' +
          '<div class="lm-btns">' +
            (cumplida ? '<button class="btn btn-pri" id="lm-sig">🗂️ Seguir: clasificarlos</button>' : '') +
            (!st.cazaRendido ? '<button class="btn btn-d" id="lm-rindo">😕 No encuentro más</button>' : '') +
          '</div>' +
        '</div>';

      var caja = document.getElementById('lm-texto');
      var avisos = document.getElementById('lm-avisos');
      caja.addEventListener('click', function (ev) {
        var el = ev.target.closest ? ev.target.closest('.lm-p') : null;
        if (!el || st.cazaRendido) return;
        var i = +el.dataset.i, k = clave(ps[i]);
        if (st.caza.indexOf(i) >= 0) return;
        if (inv.adj[k] || inv.det[k]) {
          st.caza.push(i);
          suena('ok');
          pinta();
          return;
        }
        if (inv.neu[k]) {
          avisos.innerHTML = '<div class="lm-aviso">🤝 «' + esc(ps[i].replace(LIMPIA, '')) + '» es un <strong>artículo</strong> ' +
            '(o una palabra discutida). En esta cacería no cuenta: ni bien ni mal.</div>';
          return;
        }
        st.cazaFallos++;
        var cf = document.getElementById('lm-fallos');
        if (cf) cf.textContent = ' · ' + st.cazaFallos + ' intento(s) fallido(s)';
        suena('no');
        el.classList.add('lm-fallo');
        setTimeout(function () { el.classList.remove('lm-fallo'); }, 320);
        avisos.innerHTML = '<div class="lm-aviso lm-av-no">❌ «' + esc(ps[i].replace(LIMPIA, '')) + '» no es adjetivo. ' +
          'Un adjetivo dice <strong>cómo es</strong> algo (grande, frío, alegre) o <strong>cuál, de quién o cuántos</strong> ' +
          '(este, mi, tres).</div>';
      });
      var sig = document.getElementById('lm-sig');
      if (sig) sig.onclick = function () { suena('click'); siguienteActo(); };
      var rindo = document.getElementById('lm-rindo');
      if (rindo) rindo.onclick = function () { suena('click'); st.cazaRendido = true; pinta(); };
    }

    /* ── 3 · ¿Califica o determina? ── */
    function actoClasifica(t) {
      var ps = palabras(t.texto);
      var items = itemsClasifica(t, ps);
      if (!items.length) { siguienteActo(); return; }
      var i = Math.min(st.clasIdx, items.length - 1);
      var it = items[i];
      var dada = st.clasResp[i];
      var esUltima = i === items.length - 1;

      raiz.innerHTML =
        '<div class="card ac-purple">' +
          cabecera(t) +
          '<h2>🗂️ ¿Califica o determina?</h2>' +
          '<p class="lm-pista">Palabra ' + (i + 1) + ' de ' + items.length + ' · míralas en su oración antes de decidir.</p>' +
          '<div class="lm-frase">' + it.contexto + '</div>' +
          '<div class="lm-dosbtn">' +
            '<button class="lm-b-adj' + (dada ? (it.clase === 'adj' ? ' lm-ok' : (dada === 'adj' ? ' lm-no' : '')) : '') + '" ' +
              'data-lm-clase="adj"' + (dada ? ' disabled' : '') + '><b>✨ Califica</b><small>dice cómo es</small></button>' +
            '<button class="lm-b-det' + (dada ? (it.clase === 'det' ? ' lm-ok' : (dada === 'det' ? ' lm-no' : '')) : '') + '" ' +
              'data-lm-clase="det"' + (dada ? ' disabled' : '') + '><b>📌 Determina</b><small>dice cuál, de quién o cuántos</small></button>' +
          '</div>' +
          (!dada ? '' :
            '<div class="lm-guia">' +
              (dada === it.clase ? '✅ <strong>¡Correcto!</strong> ' : '💡 <strong>Era ' + (it.clase === 'adj' ? 'calificativo' : 'determinativo') + '.</strong> ') +
              '«' + esc(it.palabra) + '» ' + (it.clase === 'adj'
                ? 'te dice <strong>cómo es</strong> lo que acompaña: es una cualidad.'
                : 'no dice cómo es nada; señala <strong>cuál</strong>, <strong>de quién</strong> o <strong>cuántos</strong>.') +
            '</div>' +
            '<div class="lm-btns"><button class="btn btn-pri" id="lm-sig">' +
              (esUltima ? '✏️ Seguir: ¿cómo lo decía el texto?' : 'Siguiente palabra ▶') + '</button></div>') +
        '</div>';

      cada('[data-lm-clase]', function (b) {
        b.onclick = function () {
          if (st.clasResp[i]) return;
          st.clasResp[i] = b.dataset.lmClase;
          suena(st.clasResp[i] === it.clase ? 'ok' : 'no');
          pinta();
        };
      });
      var sig = document.getElementById('lm-sig');
      if (sig) sig.onclick = function () {
        suena('click');
        if (esUltima) siguienteActo();
        else { st.clasIdx = i + 1; pinta(); }
      };
    }

    /* ── 4 · ¿Cómo lo decía el texto? ── */
    function actoCompleta(t) {
      var ps = palabras(t.texto);
      var items = itemsCompleta(t, ps);
      if (!items.length) { siguienteActo(); return; }
      var i = Math.min(st.compIdx, items.length - 1);
      var it = items[i];
      var dada = st.compResp[i];
      var esUltima = i === items.length - 1;
      var LETRA = ['a', 'b', 'c'];

      raiz.innerHTML =
        '<div class="card ac-amber">' +
          cabecera(t) +
          '<h2>✏️ ¿Cómo lo decía el texto?</h2>' +
          '<p class="lm-pista">Oración ' + (i + 1) + ' de ' + items.length + ' · las tres palabras salen de esta misma lectura. ' +
            'Acuérdate de cuál iba aquí.</p>' +
          '<div class="lm-frase">' + it.frase.replace(HUECO, dada != null
            ? '<u>' + esc(it.ops[it.c]) + '</u>'
            : '<span class="lm-hueco">?</span>') + '</div>' +
          '<div class="lm-ops" role="group">' +
            it.ops.map(function (o, j) {
              var cls = 'lm-op';
              if (dada != null) {
                if (j === it.c) cls += ' lm-ok';
                else if (dada === j) cls += ' lm-no';
              }
              return '<button class="' + cls + '" data-lm-op="' + j + '"' + (dada != null ? ' disabled' : '') + '>' +
                '<b>' + LETRA[j] + ')</b> ' + esc(o) + '</button>';
            }).join('') +
          '</div>' +
          (dada == null ? '' :
            '<div class="lm-guia">' +
              (dada === it.c
                ? '✅ <strong>¡Así era!</strong> Fíjate en cuánto cambia la oración según el adjetivo que se le ponga.'
                : '💡 La lectura decía <strong>«' + esc(it.ops[it.c]) + '»</strong>. Las otras dos también salen de este texto, ' +
                  'pero acompañaban a otra cosa.') +
            '</div>' +
            '<div class="lm-btns"><button class="btn btn-pri" id="lm-sig">' +
              (esUltima ? '📊 Ver mi resultado' : 'Siguiente oración ▶') + '</button></div>') +
        '</div>';

      cada('[data-lm-op]', function (b) {
        b.onclick = function () {
          if (st.compResp[i] != null) return;
          st.compResp[i] = +b.dataset.lmOp;
          suena(st.compResp[i] === it.c ? 'ok' : 'no');
          pinta();
        };
      });
      var sig = document.getElementById('lm-sig');
      if (sig) sig.onclick = function () {
        suena('click');
        if (esUltima) siguienteActo();
        else { st.compIdx = i + 1; pinta(); }
      };
    }

    /* ══════════════ FASE 4 · resultado ══════════════ */
    function pintaResultado() {
      var t = actual();
      if (!t) { reiniciar(); pinta(); return; }
      var ps = palabras(t.texto);
      var inv = inventario(t);
      var todosAdj = indicesAdjetivos(ps, inv);
      var leidas = st.idx + 1;
      var ppm = st.seg > 0 ? Math.round((leidas / st.seg) * 60) : 0;
      var comp = t.preguntas.reduce(function (s, p, i) { return s + (st.resp[i] === p.c ? 1 : 0); }, 0);
      var itemsCl = itemsClasifica(t, ps), itemsCo = itemsCompleta(t, ps);
      var clas = itemsCl.reduce(function (s, it, i) { return s + (st.clasResp[i] === it.clase ? 1 : 0); }, 0);
      var completa = itemsCo.reduce(function (s, it, i) { return s + (st.compResp[i] === it.c ? 1 : 0); }, 0);
      var cazados = st.caza.length;
      var metaCaza = Math.min(META_CAZA, todosAdj.length);
      var vel = lecNivelVelocidad(st.grado, ppm);
      var nc = lecNivelComprension(comp, t.preguntas.length);
      var puntos = comp + Math.min(cazados, metaCaza) + clas + completa;
      var deTotal = t.preguntas.length + metaCaza + itemsCl.length + itemsCo.length;

      /* Se guarda UNA sola vez por toma: si algo repintara esta fase, la
         toma se contaría dos veces en el expediente del alumno. */
      if (!st.guardado) {
        st.guardado = guardarResultado(t.id, { ppm: ppm, comp: comp, compDe: t.preguntas.length, puntos: puntos });
        registra(t, ppm, leidas, ps.length, comp, puntos, deTotal);
        if (typeof op.alTerminar === 'function') {
          try {
            op.alTerminar({
              textoId: t.id, titulo: t.titulo, grado: st.grado, ppm: ppm, seg: st.seg,
              palabras: leidas, total: ps.length, comp: comp, compDe: t.preguntas.length,
              caza: cazados, cazaDe: todosAdj.length, clasifica: clas, completa: completa,
              puntos: puntos, puntosDe: deTotal,
              nivelVelocidad: vel.clave, intentos: st.guardado.intentos
            });
          } catch (e) {}
        }
      }

      var nAdj = 0, nDet = 0;
      var pintado = ps.map(function (p) {
        var k = clave(p);
        if (inv.adj[k]) { nAdj++; return '<span class="lm-p lm-adj">' + esc(p) + '</span>'; }
        if (inv.det[k]) { nDet++; return '<span class="lm-p lm-det">' + esc(p) + '</span>'; }
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
          '<div class="lm-veredicto">🩺 ' + veredicto(vel, nc) + '</div>' +
          '<p class="lm-pista">La banda de ' + st.grado + 'º es de <strong>fin de grado</strong> (' + esc(LECTURA_NORMAS.fuenteCorta) + '): ' +
            'si estamos a mitad del año, es normal ir por debajo. Aquí no se mide la <em>precisión</em> —cuántas palabras se ' +
            'cambian o se saltan—, porque para eso alguien tiene que escucharte: esa parte la toma tu maestro en Mi aula.</p>' +
        '</div>' +

        '<div class="card ac-purple">' +
          '<h2>🏅 Tu trabajo con el texto</h2>' +
          '<div class="lm-hero"><b>' + puntos + '</b><span>de ' + deTotal + ' puntos en las cuatro actividades</span></div>' +
          '<div class="lm-chips">' +
            chip('❓ Comprensión', comp + ' de ' + t.preguntas.length, '') +
            chip('🎯 Adjetivos cazados', cazados + ' de ' + todosAdj.length, '') +
            chip('🗂️ Clasificados', clas + ' de ' + itemsCl.length, '') +
            chip('✏️ Recordados', completa + ' de ' + itemsCo.length, '') +
          '</div>' +
        '</div>' +

        '<div class="card ac-amber">' +
          '<h2>🎨 Todos los adjetivos de esta lectura</h2>' +
          '<p class="lm-pista">Esto es lo que estabas leyendo sin darte cuenta: <strong>' + nAdj + ' calificativos</strong> ' +
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
            'fluidez, y las actividades son las mismas para que notes cuánto mejoraste. No es trampa: es entrenamiento.</p>' +
        '</div>';

      document.getElementById('lm-otra').onclick = function () { suena('click'); reiniciar(); pinta(); };
      document.getElementById('lm-repetir').onclick = function () {
        suena('click');
        var g = st.grado, id = st.textoId;
        pararTimer();
        st = limpio('leer'); st.grado = g; st.textoId = id;
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
    function veredicto(vel, nc) {
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
    function registra(t, ppm, leidas, total, comp, puntos, puntosDe) {
      if (!window.METAS || typeof window.METAS.registrar !== 'function') return;
      try {
        window.METAS.registrar('lectura', {
          textoId: t.id, titulo: t.titulo, gradoTexto: st.grado,
          ppm: ppm, seg: st.seg, palabras: leidas, total: total,
          comp: comp, compDe: t.preguntas.length, puntos: puntos, puntosDe: puntosDe
        });
      } catch (e) {}
    }

    function cada(sel, fn) { Array.prototype.forEach.call(raiz.querySelectorAll(sel), fn); }

    function pinta() {
      pararTimer();
      if (st.fase === 'leer') pintaLeer();
      else if (st.fase === 'taller') pintaTaller();
      else if (st.fase === 'resultado') pintaResultado();
      else pintaElegir();
    }

    pinta();
    return {
      repintar: pinta,
      /* Si el alumno se cambia de pestaña a media toma, el cronómetro no
         puede seguir corriendo a sus espaldas: se cancela y vuelve a la
         lista. Un minuto medido a medias no es un minuto. El taller, en
         cambio, no tiene reloj: ahí se puede ir y volver sin perder nada. */
      soltar: function () { if (st.fase === 'leer' && st.ini) { reiniciar(); pinta(); } else pararTimer(); },
      estado: function () { return st.fase; }
    };
  }

  window.LecturaMision = { montar: montar, version: 2 };
})();
