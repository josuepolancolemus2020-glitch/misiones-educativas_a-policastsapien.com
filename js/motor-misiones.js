/* ============================================================
   M.E.T.A.S · Motor de misiones
   ------------------------------------------------------------
   El código que las misiones tenían copiado, una vez. Se va pasando
   aquí por tandas pequeñas; cada misión sigue en su página de siempre,
   con su misma dirección y su misma llave de guardado.

   Hoy tiene tres piezas:

   1. EL EXAMEN POR FORMAS (`_evalRng`, `_shuffleF`, `_pickF`,
      `_injectFormaSel`). Estaban copiadas, idénticas, en 84 misiones.
      El selector de forma (círculos con número) y los botones del examen
      se pintan desde aquí para todas.
   2. EL REPARTO DE LA PRUEBA DE PENSAMIENTO CRÍTICO (`_repartoCritica`,
      `_formasCritica`, `_turnoCritica`, `_selectorCritica`): cada forma,
      de la 1 a la 50, lleva un conjunto de casos que no lleva ninguna otra.
   3. LA PUERTA (`mision.html?m=<carpeta>`), que lleva a una misión.

   Las funciones del examen se publican con el MISMO nombre global que
   tenían dentro de cada misión, porque el resto de la misión las llama
   así. Se cuelgan de `window` con una asignación y no con `function` o
   `const` a propósito: una misión que todavía trae su copia la declara
   encima sin chocar, así que este archivo se puede cargar en cualquier
   misión, migrada o no.
   ============================================================ */
(function (global) {
  'use strict';

  /* ══════════ 1 · El examen por formas ══════════ */

  /* ⚠️ GENERADOR v1, CONGELADO. No se cambia ni una constante, ni el
     orden de las operaciones, ni se «mejora». Con este generador se
     armaron las formas que los maestros ya imprimieron con su clave: si
     cambia, la Forma 7 deja de ser la Forma 7 y la clave impresa califica
     mal. Lo vigila `_dev/verifica-formas-oro.js` contra la referencia de
     `_dev/formas-oro/`. Lo que haga falta de nuevo va en OTRO generador,
     al lado, nunca aquí. */
  function _evalRng(forma) {
    var s = (forma * 2654435761 + 909090909) >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      var t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* También congelados: el orden en que consumen el generador decide
     qué preguntas caen en cada forma. */
  function _shuffleF(arr, rng) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function _pickF(arr, n, rng) { return _shuffleF(arr, rng).slice(0, n); }

  /* El selector de forma: arriba, pastillas de grupos de diez (1–10,
     11–20…, solo las que existan); debajo, una fila con los diez círculos
     del grupo elegido. Va encima de los botones del examen. Era un desplegable, y el
     desplegable tenía dos defectos que el maestro veía:

     · al recargar enseñaba «Forma 1» aunque la guardada fuera otra: la
       misión lo pintaba antes de leer su progreso (el progreso se lee en
       un DOMContentLoaded de `window`, que llega DESPUÉS que el de
       `document`, que es donde se pintaba);
     · después de generar la Forma 4 enseñaba la 5, la que vendría, así
       que el título decía una forma y el desplegable otra.

     Ahora el círculo marcado es la forma que está en la pantalla: la que
     dice el título. Si todavía no se generó ninguna, es la que va a salir
     al tocar «Nueva». Tocar un círculo genera esa forma en el acto, para
     que nunca quede marcado un número que no es el de la hoja.

     `EVAL_FORMAS` y `saveProgress` son de la misión: cada una tiene su
     tope de formas (30, o 20 en Fin de grado) y su llave de guardado, y
     aquí solo se usan, no se deciden.
     `tope` es para la prueba que no llega hasta `EVAL_FORMAS`: la de
     pensamiento crítico reparte 50 formas aunque el examen conceptual de
     la misma misión siga en 30. Sin `tope`, todo queda como estaba.

     La misión sigue leyendo `document.getElementById(selId).value`, como
     cuando era un desplegable: el contenedor de los círculos responde a
     `value` (y a `options.length`) igual que respondía el <select>. Así
     no se toca ninguna de las 84 misiones. */
  function _opcionesDeForma(tope, actual) {
    var ops = '';
    for (var i = 1; i <= tope; i++) ops += '<option value="' + i + '"' + (i === actual ? ' selected' : '') + '>Forma ' + i + '</option>';
    return ops;
  }
  function _rotuloDeForma(tope) { return 'Elegir número de forma exacta (1 a ' + tope + ')'; }

  /* La variable donde cada misión guarda la forma que le toca. Se lee
     por su nombre UNA vez, cuando la misión ya leyó su progreso, para
     corregir lo que se pintó antes de tiempo. Los nombres son los mismos
     en las 84 misiones (Fin de grado lleva una por materia). */
  var VARIABLE_DE = {
    evalFormaSel: "typeof evalMateria !== 'undefined' && typeof evalFormNumEsp !== 'undefined' ? (evalMateria === 'esp' ? evalFormNumEsp : evalFormNumMat) : (typeof evalFormNum !== 'undefined' ? evalFormNum : null)",
    evalOpFormaSel: "typeof evalOpFormNum !== 'undefined' ? evalOpFormNum : null",
    evalCritFormaSel: "typeof evalCritFormNum !== 'undefined' ? evalCritFormNum : null"
  };
  function _formaDeLaMision(selId) {
    var expr = VARIABLE_DE[selId];
    if (!expr) return null;
    /* `new Function` y no `window.evalFormNum`: la misión la declara con
       `let`, que no cuelga de `window` pero sí se ve desde una función
       creada así, que vive en el ámbito global. */
    try { var n = parseInt((new Function('return (' + expr + ');'))(), 10); return n >= 1 ? n : null; } catch (e) { return null; }
  }

  /* Los botones del examen, más bajos y con el texto corto. El texto
     largo queda como nombre del botón (lo lee el lector de pantalla y
     sale al dejar el puntero encima), y es el que ya traduce
     js/metas-i18n.js. Los cortos tienen su traducción allí mismo.
     «👁 Ver Pauta» se queda como está: ya es corto. */
  var BOTON_CORTO = {
    '🔄 Nueva Evaluación': '🔄 Nueva', '🔄 Nueva Prueba': '🔄 Nueva', '🔄 Nueva Prueba Operativa': '🔄 Nueva',
    '🧮 Calificar prueba': '🧮 Calificar', '🧮 Calcular Total': '🧮 Total'
  };

  /* Se escribe una vez, desde aquí, para las 84 misiones: cada misión
     trae su propia hoja de estilos copiada y no hay otra hoja común a
     todas. El color es `--pri`, el de cada misión. */
  var CSS_FORMAS = [
    /* Centrado: el título del examen ya no lleva párrafo debajo, y el
       bloque de formas a un lado dejaba la tarjeta cargada a la izquierda. */
    '.metas-formas{margin:0 0 .7rem;text-align:center;}',
    '.metas-formas-tit{font-weight:700;font-size:.8rem;opacity:.85;margin:0 0 .35rem;}',
    /* Las pastillas de grupo: 1–10, 11–20… Solo cambian qué diez círculos
       se ven; no generan nada. */
    '.metas-grupos{display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin:0 0 .4rem;}',
    '.metas-grupo{appearance:none;-webkit-appearance:none;font:inherit;font-size:.75rem;font-weight:700;line-height:1;min-height:32px;min-width:48px;padding:0 .75rem;border-radius:999px;border:2px solid transparent;background:rgba(127,127,127,.16);color:inherit;cursor:pointer;font-variant-numeric:tabular-nums;-webkit-tap-highlight-color:transparent;}',
    '.metas-grupo[aria-pressed="true"]{background:var(--pri,#555);border-color:var(--pri,#555);color:#fff;font-weight:800;}',
    '.metas-grupo:focus-visible{outline:3px solid var(--pri,#555);outline-offset:2px;}',
    /* La fila de diez. En el teléfono toma del relleno de la tarjeta solo
       lo que le falta para llegar a 350 px, y nunca más que ese relleno:
       sin eso, en una pantalla de 360 px diez círculos no caben a 32 px. */
    '.metas-formas-rejilla{display:grid;grid-template-columns:repeat(10,minmax(32px,1fr));gap:0;margin:0 max(-1.2rem,min(0px,calc((100% - 350px) / 2)));}',
    '.metas-forma{appearance:none;-webkit-appearance:none;background:none;border:0;margin:0;padding:0;min-width:32px;min-height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer;font:inherit;color:inherit;-webkit-tap-highlight-color:transparent;}',
    '.metas-forma-num{box-sizing:border-box;width:32px;height:32px;flex:none;border-radius:50%;border:2px solid var(--pri,#555);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:.8rem;line-height:1;font-variant-numeric:tabular-nums;}',
    '.metas-forma[aria-pressed="true"] .metas-forma-num{background:var(--pri,#555);color:#fff;font-weight:800;}',
    '.metas-forma:focus-visible{outline:none;}',
    '.metas-forma:focus-visible .metas-forma-num{outline:3px solid var(--pri,#555);outline-offset:2px;}',
    '@media (hover:hover){.metas-forma:hover .metas-forma-num{box-shadow:0 0 0 2px var(--pri,#555) inset;}}',
    /* Entre 360 y 379 px la casilla mide 32 justos: el círculo se dibuja
       a 30 para que no se toquen, y el dedo sigue teniendo los 32. */
    '@media (max-width:379px){.metas-forma-num{width:30px;height:30px;}}',
    /* En la pantalla más angosta (320 px) diez no caben ni así: van de
       cinco en cinco antes que achicar el círculo por debajo del dedo. */
    '@media (max-width:359px){.metas-formas-rejilla{grid-template-columns:repeat(5,minmax(32px,1fr));margin:0;}}',
    '@media (min-width:600px){.metas-formas-rejilla{grid-template-columns:repeat(10,40px);gap:4px;margin:0;justify-content:center;}}',
    /* Los cuatro botones: una fila en la computadora, dos en el teléfono. */
    '.eval-controls.metas-botones{display:flex;flex-wrap:nowrap;align-items:center;justify-content:center;gap:.4rem;}',
    '.eval-controls.metas-botones>.btn{font-size:.78rem;padding:.3rem .75rem;min-height:32px;border-radius:10px;gap:.3rem;white-space:nowrap;line-height:1.2;}',
    '@media (max-width:599px){.eval-controls.metas-botones{display:grid;grid-template-columns:1fr 1fr;}.eval-controls.metas-botones>.btn{justify-content:center;}.eval-controls.metas-botones>:not(.btn){grid-column:1/-1;}}',
    /* «Completar el espacio» en la pantalla: una raya gruesa donde va la
       palabra, como en la hoja impresa, y no una caja de formulario. Se
       sigue escribiendo y calificando igual. Solo `screen`: el papel sale
       de otra ventana (printEval) y no cambia. `#evalOut` sube la
       especificidad por encima de la hoja copiada de cada misión (también
       de su `:focus`) y deja fuera las cajas de los laboratorios. La raya
       usa `currentColor` y no un color fijo para que en el tema oscuro no
       desaparezca. */
    '@media screen{',
    '#evalOut input.eval-cp-input{border:0;border-bottom:3px solid currentColor;border-radius:0;background:transparent;box-shadow:none;padding:.15rem .3rem .1rem;}',
    '#evalOut input.eval-cp-input:focus{outline:none;border-bottom-color:var(--pri,currentColor);}',
    /* Al teclado, además, un contorno: la raya de otro color sola no basta. */
    '#evalOut input.eval-cp-input:focus-visible{outline:2px solid var(--pri,currentColor);outline-offset:2px;}',
    /* Calificada: la raya toma el color y el renglón un tinte; el ✓ o el
       «Revisar» lo dice en letras el comentario de cada pregunta. */
    '#evalOut input.eval-cp-input.eval-input-ok{border-bottom-color:var(--jade,#00b894);background:rgba(0,184,148,.1);}',
    '#evalOut input.eval-cp-input.eval-input-no{border-bottom-color:var(--red,#d63031);background:rgba(214,48,49,.08);}',
    '}',
    /* En el papel solo va «Forma N», que ya lleva la hoja. */
    '@media print{.metas-formas,.eval-controls{display:none!important;}}'
  ].join('\n');

  function _estilos() {
    var doc = global.document;
    if (!doc || !doc.getElementById || doc.getElementById('metas-formas-css')) return;
    var st = doc.createElement('style');
    st.id = 'metas-formas-css';
    st.textContent = CSS_FORMAS;
    (doc.head || doc.documentElement).appendChild(st);
  }

  function _traducir(el) {
    try { if (global.MetasI18N && global.MetasI18N.idioma() === 'en') global.MetasI18N.traducirZona(el); } catch (e) { }
  }

  function _acortarBotones(raiz) {
    if (!raiz || !raiz.querySelectorAll) return;
    var filas = raiz.classList && raiz.classList.contains('eval-controls') ? [raiz] : raiz.querySelectorAll('.eval-controls');
    Array.prototype.forEach.call(filas, function (fila) {
      if (fila.classList.contains('metas-botones')) return;
      fila.classList.add('metas-botones');
      Array.prototype.forEach.call(fila.querySelectorAll('button'), function (b) {
        var largo = (b.textContent || '').trim(), corto = BOTON_CORTO[largo];
        if (!corto) return;
        b.setAttribute('aria-label', largo);
        b.setAttribute('title', largo);
        b.textContent = corto;
        _traducir(b);
      });
    });
  }

  /* Lo que se marca: la forma de la pantalla, o la que va a salir. */
  function _marcada(s) { return s.mostrada || s.pendiente; }

  var POR_GRUPO = 10;
  function _boton(doc, clase, texto, rotulo) {
    var b = doc.createElement('button');
    b.type = 'button';
    b.className = clase;
    b.setAttribute('aria-label', rotulo);
    b.innerHTML = texto;
    return b;
  }

  function _pintar(el) {
    var s = el._fs, marcada = _marcada(s), doc = global.document;
    var grupos = Math.ceil(s.tope / POR_GRUPO);
    /* Cada vez que cambia la forma marcada (se generó otra, o se leyó el
       progreso) se abre su grupo. Tocar una pastilla solo cambia el grupo
       a la vista, y la marcada sigue siendo la misma. */
    if (marcada !== s.vista) { s.vista = marcada; s.grupo = Math.floor((marcada - 1) / POR_GRUPO); }
    s.grupo = Math.min(Math.max(0, s.grupo), grupos - 1);

    if (s.pastillas.length !== grupos) {
      s.cajaGrupos.innerHTML = '';
      s.pastillas = [];
      for (var g = 0; g < grupos; g++) {
        var desde = g * POR_GRUPO + 1, hasta = Math.min(s.tope, desde + POR_GRUPO - 1);
        var p = _boton(doc, 'metas-grupo', desde + '–' + hasta, 'Formas ' + desde + ' a ' + hasta);
        p.setAttribute('data-grupo', String(g));
        s.cajaGrupos.appendChild(p);
        s.pastillas.push(p);
      }
      /* Con diez formas o menos no hay grupos que elegir. */
      s.cajaGrupos.hidden = grupos < 2;
      el.setAttribute('aria-label', _rotuloDeForma(s.tope));
      _traducir(s.cajaGrupos);
    }
    s.pastillas.forEach(function (p, i) { p.setAttribute('aria-pressed', i === s.grupo ? 'true' : 'false'); });

    var clave = s.grupo + '/' + s.tope;
    if (s.filaPintada !== clave) {
      s.filaPintada = clave;
      el.innerHTML = '';
      s.botones = [];
      var ini = s.grupo * POR_GRUPO + 1, fin = Math.min(s.tope, ini + POR_GRUPO - 1);
      for (var i = ini; i <= fin; i++) {
        var b = _boton(doc, 'metas-forma', '<span class="metas-forma-num" aria-hidden="true">' + i + '</span>', 'Forma ' + i);
        b.setAttribute('data-forma', String(i));
        el.appendChild(b);
        s.botones.push(b);
      }
      _traducir(el);
    }
    s.botones.forEach(function (b) { b.setAttribute('aria-pressed', parseInt(b.getAttribute('data-forma'), 10) === marcada ? 'true' : 'false'); });
  }

  /* Lo que pasa mientras se genera, para saber qué forma quedó en la
     pantalla. La misión lee `value` justo antes de sembrar el examen:
     ese número es la forma que sale. Si una misión no lo leyera, vale la
     primera forma que la misión le pasa al selector durante el toque. */
  function _empezarGenerar(s) { s.turno = { primera: null, llamadas: 0, leyo: false }; }
  function _terminarGenerar(el) {
    var s = el._fs, t = s.turno;
    s.turno = null;
    if (t && !t.leyo && t.llamadas && t.primera) s.mostrada = t.primera;
    /* Después de generar se vuelve a abrir el grupo de la forma generada,
       aunque el maestro hubiera estado mirando otro. */
    if (t && (t.leyo || t.llamadas)) s.vista = null;
    _pintar(el);
  }

  function _crearSelector(fnName, selId, actual, onPick, tope, btn) {
    _estilos();
    var doc = global.document;
    var caja = doc.createElement('div');
    caja.className = 'metas-formas';
    var titulo = doc.createElement('div');
    titulo.className = 'metas-formas-tit';
    titulo.textContent = 'Elige la forma';
    var cajaGrupos = doc.createElement('div');
    cajaGrupos.className = 'metas-grupos';
    cajaGrupos.setAttribute('role', 'group');
    cajaGrupos.setAttribute('aria-label', 'Grupos de formas');
    var el = doc.createElement('div');
    el.id = selId;
    el.className = 'metas-formas-rejilla';
    el.setAttribute('role', 'group');
    caja.appendChild(titulo);
    caja.appendChild(cajaGrupos);
    caja.appendChild(el);
    var s = el._fs = { fnName: fnName, onPick: onPick, tope: tope, pendiente: actual, mostrada: null, leida: null, botones: [], pastillas: [], cajaGrupos: cajaGrupos, grupo: 0, vista: null, filaPintada: '', turno: null };

    cajaGrupos.addEventListener('click', function (ev) {
      var p = ev.target && ev.target.closest ? ev.target.closest('.metas-grupo') : null;
      if (!p) return;
      s.grupo = parseInt(p.getAttribute('data-grupo'), 10) || 0;
      _pintar(el);
    });

    Object.defineProperty(el, 'value', {
      configurable: true,
      get: function () { s.leida = s.pendiente; if (s.turno) s.turno.leyo = true; return String(s.pendiente); },
      set: function (v) { var n = parseInt(v, 10); if (n >= 1 && n <= s.tope) { s.pendiente = n; _pintar(el); } }
    });
    /* Como el desplegable: tantas «opciones» como formas, aunque a la vista
       haya diez. */
    Object.defineProperty(el, 'options', { configurable: true, get: function () { return { length: s.tope }; } });
    /* Quien cambie `value` desde fuera y avise con «change» (como se hacía
       con el desplegable) pide esa forma, igual que antes. */
    el.addEventListener('change', function () { s.onPick(s.pendiente); try { saveProgress(); } catch (e) { } });

    el.addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest('.metas-forma') : null;
      if (!b) return;
      var n = parseInt(b.getAttribute('data-forma'), 10);
      if (!(n >= 1 && n <= s.tope)) return;
      s.pendiente = n;
      s.leida = null;
      s.onPick(n);
      try { saveProgress(); } catch (e) { }
      var gen = global[s.fnName];
      if (typeof gen !== 'function') { _pintar(el); return; }
      _empezarGenerar(s);
      try { gen(); } finally { _terminarGenerar(el); }
    });

    /* El botón «Nueva» de la misión también se sigue, por si una misión
       no lee `value`. Se escucha en `document` para que la misión ya haya
       generado cuando se mira qué quedó. */
    doc.addEventListener('click', function (ev) {
      if (!el.isConnected || !ev.target || !ev.target.closest) return;
      var b = ev.target.closest('[onclick*="' + s.fnName + '()"]');
      if (b && s.turno) _terminarGenerar(el);
    });
    doc.addEventListener('click', function (ev) {
      if (!el.isConnected || !ev.target || !ev.target.closest) return;
      if (ev.target.closest('[onclick*="' + s.fnName + '()"]')) _empezarGenerar(s);
    }, true);

    /* Va encima de la fila de botones y no dentro: así los botones quedan
       en su fila y los círculos en la suya. */
    var fila = btn.parentNode;
    if (fila.classList && fila.classList.contains('eval-controls') && fila.parentNode) {
      fila.parentNode.insertBefore(caja, fila);
      _acortarBotones(fila);
    } else fila.insertBefore(caja, btn);
    _pintar(el);
    _traducir(caja);
  }

  function _injectFormaSel(fnName, selId, actual, onPick, tope) {
    var ya = document.getElementById(selId);
    actual = parseInt(actual, 10) || 1;
    if (ya && ya._fs) {
      var s = ya._fs;
      if (tope && tope !== s.tope) s.tope = tope;
      if (s.turno) { s.turno.llamadas++; if (s.turno.primera === null) s.turno.primera = actual; }
      /* Si la misión ya leyó la forma para generar, esta llamada trae la
         SIGUIENTE: la leída es la que quedó en la pantalla. */
      if (s.leida !== null) { s.mostrada = s.leida; s.leida = null; s.vista = null; }
      s.pendiente = Math.min(s.tope, Math.max(1, actual));
      s.onPick = onPick || s.onPick;
      _pintar(ya);
      return;
    }
    if (ya) {
      /* Algo con ese id que no pintó este motor (la página de mentira de
         las sondas, o un desplegable de una página guardada de antes): se
         trata como el desplegable de siempre, con el mismo efecto. */
      if (tope && ya.options && ya.options.length !== tope) { ya.innerHTML = _opcionesDeForma(tope, actual); ya.setAttribute('aria-label', _rotuloDeForma(tope)); }
      ya.value = String(actual); return;
    }
    var btn = document.querySelector('[onclick*="' + fnName + '()"]');
    if (!btn || !btn.parentNode) return;
    _crearSelector(fnName, selId, actual, onPick, tope || EVAL_FORMAS, btn);
  }

  /* Ya con el progreso leído, cada selector que nadie usó todavía se pone
     en la forma que la misión tiene guardada. */
  function _alinearConLaMision() {
    var doc = global.document;
    Object.keys(VARIABLE_DE).forEach(function (id) {
      var el = doc.getElementById(id);
      if (!el || !el._fs || el._fs.mostrada) return;
      var n = _formaDeLaMision(id);
      if (n && n <= el._fs.tope && n !== el._fs.pendiente) { el._fs.pendiente = n; _pintar(el); }
    });
  }

  (function _alCargar() {
    var doc = global.document;
    if (!doc || typeof doc.addEventListener !== 'function' || typeof global.setTimeout !== 'function') return;
    var acortar = function () { try { _acortarBotones(doc); } catch (e) { } };
    /* El setTimeout espera a que terminen TODOS los DOMContentLoaded,
       también los de `window`, que es donde las misiones leen su progreso. */
    var alinear = function () { global.setTimeout(function () { try { _alinearConLaMision(); } catch (e) { } }, 0); };
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', function () { _estilos(); acortar(); alinear(); });
    } else { try { _estilos(); } catch (e) { } acortar(); alinear(); }
    if (typeof global.addEventListener === 'function') global.addEventListener('load', alinear);
  })();

  global._evalRng = _evalRng;
  global._shuffleF = _shuffleF;
  global._pickF = _pickF;
  global._injectFormaSel = _injectFormaSel;

  /* ══════════ 2 · La prueba de pensamiento crítico: reparto sin repetir ══════════

     La prueba de pensamiento crítico sacaba sus casos al azar con el
     generador de arriba, y el azar repite: dos maestros con la Forma 4 y
     la Forma 19 podían tener en la mano la misma hoja. Aquí las formas
     no se sortean, se REPARTEN: cada forma, de la 1 a la 50, lleva un
     conjunto de casos que no lleva ninguna otra.

     La misión dice qué apartados tiene su prueba, con el banco de cada
     uno y cuántos casos saca: `[[critCaseBank, 1], [critCauseBank, 2]]`.

     Cómo se reparte. Cada apartado es una rueda con todas las maneras de
     sacar sus casos (de un banco de 5 sacando 2 hay 10). Con cada forma,
     todas las ruedas avanzan un paso. Y cada vez que las ruedas de antes
     completan su vuelta, la siguiente se adelanta un paso más: ese
     adelanto es lo que impide que todas vuelvan a coincidir antes de
     haber pasado por TODAS las combinaciones del banco. No es una
     apuesta: una forma no repite a otra mientras el número de forma no
     pase del total de conjuntos (lo comprueba, banco por banco,
     `_dev/verifica-critica-sin-repetir.js`).

     Depende solo del número de forma, del tamaño de cada banco y de
     cuántos se sacan. No del texto: por eso la Forma 7 en inglés lleva
     los mismos casos que la Forma 7 en español.

     ⚠️ CONGELADO, igual que el generador: con este reparto se arma la
     referencia de `_dev/formas-oro/`. Añadir o quitar un caso de un banco
     cambia todas las formas críticas de esa misión, y la pauta que el
     maestro ya imprimió deja de corresponder a su hoja. */

  /* Hasta qué forma llega la prueba crítica, si el banco alcanza. */
  var FORMAS_CRITICA = 50;
  /* De aquí en adelante un peso ya es mayor que cualquier número de forma
     y da igual cuánto mayor: se deja de multiplicar para no salirse de
     los enteros exactos con los bancos grandes. */
  var PESO_TOPE = 1e9;

  /* De cuántas maneras se sacan k casos de un banco de n. */
  function _maneras(n, k) {
    var r = 1;
    for (var i = 1; i <= k; i++) r = r * (n - k + i) / i;
    return Math.round(r);
  }
  function _mcd(a, b) { return b ? _mcd(b, a % b) : a; }

  /* El tranco con que avanza una rueda de r posiciones. Si avanzara de
     una en una, dos formas seguidas (las que el maestro reparte a dos
     alumnos de la misma banca) llevarían casi los mismos casos. Con un
     tranco cercano a 0,618 de la vuelta, las vecinas caen lejos. Tiene
     que no compartir divisores con r, o la rueda se saltaría posiciones. */
  function _tranco(r) {
    if (r < 3) return 1;
    var z0 = Math.round(r * 0.6180339887);
    for (var d = 0; d < r; d++) {
      if (z0 + d < r && _mcd(z0 + d, r) === 1) return z0 + d;
      if (z0 - d >= 1 && _mcd(z0 - d, r) === 1) return z0 - d;
    }
    return 1;
  }

  /* La manera número d (desde 0) de sacar k de n, en el orden del
     diccionario: 0 es {0,1,2}, 1 es {0,1,3}… Devuelve posiciones del banco. */
  function _maneraNumero(n, k, d) {
    var posiciones = [], x = 0;
    for (var faltan = k; faltan >= 1; faltan--) {
      for (; ; x++) {
        var conEsta = _maneras(n - x - 1, faltan - 1);
        if (d < conEsta) { posiciones.push(x); x++; break; }
        d -= conEsta;
      }
    }
    return posiciones;
  }

  /* Lee los apartados y dice de cuántas maneras se saca cada uno. Un
     apartado mal escrito revienta aquí con su nombre, y no más abajo con
     un «undefined» en medio de la hoja. */
  function _ruedasDe(apartados) {
    if (!Array.isArray(apartados) || !apartados.length) throw new Error('La prueba de pensamiento crítico no tiene apartados');
    return apartados.map(function (ap, i) {
      var banco = ap && ap[0], saca = ap && ap[1];
      if (!Array.isArray(banco) || !(saca >= 1) || saca > banco.length || saca !== Math.floor(saca))
        throw new Error('Pensamiento crítico, apartado ' + (i + 1) + ': hace falta un banco y cuántos casos saca, y que el banco alcance');
      return { banco: banco, saca: saca, maneras: _maneras(banco.length, saca) };
    });
  }

  /* Cuántos conjuntos de casos distintos permiten los bancos. */
  function _conjuntosCritica(apartados) {
    return _ruedasDe(apartados).reduce(function (total, r) { return Math.min(total * r.maneras, Number.MAX_SAFE_INTEGER); }, 1);
  }

  /* Cuántas formas tiene la prueba crítica de una misión: 50, o las que
     su banco dé si no alcanza. Nunca se ofrece una forma que repita. */
  function _formasCritica(apartados) { return Math.min(FORMAS_CRITICA, _conjuntosCritica(apartados)); }

  /* Los casos de una forma: un arreglo por apartado, en el orden en que
     se declararon. No toca los bancos. */
  function _repartoCritica(forma, apartados) {
    var f = Math.max(1, Math.floor(forma) || 1) - 1;
    /* El orden de los casos DENTRO de un apartado no cambia el conjunto,
       pero sí cómo se ve la hoja: se baraja con el generador de siempre,
       con la semilla que ya usaba esta prueba. */
    var rng = _evalRng(200000 + f + 1);
    var peso = 1, pesos = [];
    return _ruedasDe(apartados).map(function (r) {
      /* Un apartado con una sola manera (un banco de 1, o sacar los 3 de
         3) no es una rueda: sale igual en todas las formas. */
      if (r.maneras === 1) return _shuffleF(r.banco.slice(0, r.saca), rng);
      var resto = f % peso;
      var paso = Math.floor(f / peso);
      for (var j = 0; j < pesos.length; j++) paso += Math.floor(resto / pesos[j]);
      var posicion = (_tranco(r.maneras) * (paso % r.maneras)) % r.maneras;
      pesos.push(peso);
      if (peso < PESO_TOPE) peso *= r.maneras;
      var casos = _maneraNumero(r.banco.length, r.saca, posicion).map(function (i) { return r.banco[i]; });
      return _shuffleF(casos, rng);
    });
  }

  /* El selector de la prueba crítica, con su propio tope. */
  function _selectorCritica(actual, apartados, onPick) {
    _injectFormaSel('genEvalCrit', 'evalCritFormaSel', actual, onPick, _formasCritica(apartados));
  }

  /* Lo que toda misión hacía igual al generar la prueba crítica: leer
     del selector qué forma se pidió, dejar apuntada la siguiente y
     sacar los casos. `onPick` recibe la forma siguiente para que la
     misión la guarde en su variable; guardar el progreso sigue siendo
     cosa de la misión. */
  function _turnoCritica(actual, apartados, onPick) {
    var tope = _formasCritica(apartados);
    _selectorCritica(actual, apartados, onPick);
    var sel = document.getElementById('evalCritFormaSel');
    var pedida = sel && parseInt(sel.value, 10);
    var forma = Math.min(tope, Math.max(1, pedida || parseInt(actual, 10) || 1));
    var siguiente = (forma % tope) + 1;
    onPick(siguiente);
    _selectorCritica(siguiente, apartados, onPick);
    return { forma: forma, formas: tope, casos: _repartoCritica(forma, apartados) };
  }

  global._repartoCritica = _repartoCritica;
  global._formasCritica = _formasCritica;
  global._conjuntosCritica = _conjuntosCritica;
  global._selectorCritica = _selectorCritica;
  global._turnoCritica = _turnoCritica;

  /* ══════════ 3 · La puerta: mision.html?m=<carpeta> ══════════

     Recibe `mision.html?m=<carpeta>` y lleva a esa misión. No hay
     pantalla intermedia: quien llega ya eligió la misión, y mostrarle su
     nombre con un botón «Entrar» sería hacerle confirmar lo que acaba de
     pedir. Solo cuando no se puede abrir hay algo que decir, y entonces
     se dice una cosa y se ofrece un botón.

     La carpeta es lo que identifica a la misión (`2y3ciclo-la-celula`),
     entera y sin forma corta. No su número: los números del catálogo no
     son correlativos. Por eso `?id=N` no se atiende. */

  /* La carpeta de una misión sale de su dirección en el catálogo
     (`misiones/<carpeta>/<página>.html`): así no hay un segundo dato que
     mantener al día junto al catálogo. */
  function carpetaDe(mision) {
    var partes = String((mision && mision.url) || '').split('/');
    return partes.length >= 3 && partes[0] === 'misiones' ? partes[1] : '';
  }

  /* Hay dos catálogos: el de las misiones del alumno (`MISSIONS`, en
     js/data/misiones.js) y el de las misiones del maestro (`MF_AREAS`, en
     js/tools/formacion-docente.js). De las del maestro solo cuentan las
     que ya tienen `url`; las demás son temario que todavía no existe.
     La puerta no decide quién puede ver una misión del maestro: eso lo
     comprueba la propia misión al abrirse, igual que cuando se entra
     desde las herramientas del aula. */
  function catalogo() {
    var lista = (typeof MISSIONS !== 'undefined' && Array.isArray(MISSIONS)) ? MISSIONS.slice() : [];
    if (typeof MF_AREAS !== 'undefined' && Array.isArray(MF_AREAS)) {
      MF_AREAS.forEach(function (area) {
        (area.temas || []).forEach(function (tema) { if (tema && tema.url) lista.push(tema); });
      });
    }
    return lista;
  }

  /* Se compara sin distinguir mayúsculas: hay una carpeta con mayúsculas
     y un enlace copiado a mano no debería fallar por eso. */
  function buscar(carpeta) {
    var pedida = String(carpeta || '').trim().toLowerCase();
    if (!pedida) return null;
    var lista = catalogo();
    for (var i = 0; i < lista.length; i++) {
      if (carpetaDe(lista[i]).toLowerCase() === pedida) return lista[i];
    }
    return null;
  }

  function pedidaEn(busqueda) {
    try { return (new URLSearchParams(busqueda || '').get('m') || '').trim(); }
    catch (e) { return ''; }
  }

  /* La dirección sale siempre del catálogo, nunca del enlace: lo que
     viene en `?m=` solo sirve para buscar. Así esta página no puede
     usarse para mandar a nadie a otro sitio. */
  function direccionDe(mision) {
    return mision.url.split('/').map(encodeURIComponent).join('/');
  }

  function mostrarAviso(pedida) {
    var doc = global.document;
    var texto = doc.getElementById('aviso-texto');
    if (texto) {
      texto.textContent = pedida
        ? 'Puede que el enlace esté mal escrito o que la misión haya cambiado de nombre.'
        : 'Este enlace no dice qué misión abrir.';
    }
    doc.documentElement.classList.remove('abriendo');
    var boton = doc.getElementById('aviso-boton');
    if (boton && boton.focus) boton.focus();
  }

  /* La llama mision.html. No se corre sola al cargar el archivo porque
     ahora también lo cargan las misiones, y ahí no hay nada que abrir. */
  function abrirPedida() {
    var pedida = pedidaEn(global.location.search);
    var mision = buscar(pedida);
    if (mision) {
      /* `replace` y no `href`: si quedara en el historial, el botón de
         atrás del teléfono volvería a esta puerta y la puerta lo
         devolvería a la misión. No se podría salir. */
      global.location.replace(direccionDe(mision));
      return;
    }
    mostrarAviso(pedida);
  }

  global.MotorMisiones = {
    examen: { rng: _evalRng, barajar: _shuffleF, elegir: _pickF, selectorDeForma: _injectFormaSel },
    critica: { formasMaximas: FORMAS_CRITICA, conjuntos: _conjuntosCritica, formas: _formasCritica, reparto: _repartoCritica, selector: _selectorCritica, turno: _turnoCritica },
    abrirPedida: abrirPedida, buscar: buscar, carpetaDe: carpetaDe
  };
/* `globalThis` y no `window` a secas: en el navegador son lo mismo, y las
   sondas que cargan esto en Node tienen un `window` de mentira que no es el
   objeto global, donde estos nombres no se verían. */
})(typeof globalThis !== 'undefined' ? globalThis : window);
