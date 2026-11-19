/* ============================================================
   M.E.T.A.S · Motor de misiones
   ------------------------------------------------------------
   El código que las misiones tenían copiado, una vez. Se va pasando
   aquí por tandas pequeñas; cada misión sigue en su página de siempre,
   con su misma dirección y su misma llave de guardado.

   Hoy tiene cuatro piezas:

   1. EL EXAMEN POR FORMAS (`_evalRng`, `_shuffleF`, `_pickF`,
      `_injectFormaSel`). Estaban copiadas, idénticas, en 84 misiones.
      El selector de forma (círculos con número) y los botones del examen
      se pintan desde aquí para todas.
   2. EL REPARTO DE LA PRUEBA DE PENSAMIENTO CRÍTICO (`_repartoCritica`,
      `_formasCritica`, `_turnoCritica`, `_selectorCritica`): cada forma,
      de la 1 a la 50, lleva un conjunto de casos que no lleva ninguna otra.
      Una misión con formas ya impresas las conserva (`_conFormasDeAntes`)
      y solo reparte las nuevas.
      Y EL BANCO GRANDE DEL EXAMEN CONCEPTUAL (`_formasConceptual`,
      `_repartoConceptual`): la misión que trae un banco nuevo al lado del
      de siempre ofrece formas nuevas, repartidas con las mismas ruedas.
   3. LA PUERTA (`mision.html?m=<carpeta>`), que lleva a una misión.
   4. EL CENTRO EN EL EXAMEN IMPRESO (`_envolverImpresiones`): el perfil
      del centro que el docente configura en Mi aula sale arriba de la
      hoja, y si tiene dos centros o más se le pregunta con cuál.

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

  /* La forma que dice el TÍTULO de cada prueba. Es lo que el alumno tiene
     delante, así que manda sobre todo lo demás: el círculo marcado tiene
     que ser esa.

     Hacía falta porque una misión puede BORRAR el selector y volver a
     crearlo en medio de una generación (Fin de grado lo hace en cada
     examen, para cambiar de materia), y el selector nuevo nacía sin saber
     qué forma acababa de salir: marcaba la siguiente. El título decía
     «Forma 2» y el círculo marcado era el 3, y al recargar pasaba lo mismo
     con el examen que la misión vuelve a armar. Leer el título lo arregla
     para cualquier misión, sin tocar ninguna: todas lo escriben igual
     («… Forma 7 …», o «Forma R-7» en la adaptada; «Form 7» si está en
     inglés). Un título sin forma (antes de generar) no cambia nada. */
  var TITULO_DE = {
    evalFormaSel: 'eval-screen-title',
    evalOpFormaSel: 'evalop-screen-title',
    evalCritFormaSel: 'evalcrit-screen-title'
  };
  function _formaDelTitulo(selId) {
    var doc = global.document, t = TITULO_DE[selId] && doc.getElementById(TITULO_DE[selId]);
    var m = t && (t.textContent || '').match(/\bForma?\s+(?:R-)?(\d+)\b/);
    return m ? parseInt(m[1], 10) : null;
  }
  function _alinearConTitulo(selId) {
    var el = global.document.getElementById(selId);
    if (!el || !el._fs) return;
    var s = el._fs, n = _formaDelTitulo(selId);
    if (!n || n > s.tope || n === s.mostrada) return;
    s.mostrada = n;
    s.vista = null;
    _pintar(el);
  }
  /* Se vigila el título, no la generación: la misión lo escribe DESPUÉS de
     rehacer el selector, y es ese último cambio el que cuenta. */
  function _seguirTitulo(selId) {
    var doc = global.document, t = TITULO_DE[selId] && doc.getElementById(TITULO_DE[selId]);
    if (!t || t._metasSigueForma || typeof global.MutationObserver !== 'function') return;
    t._metasSigueForma = true;
    new global.MutationObserver(function () { _alinearConTitulo(selId); })
      .observe(t, { childList: true, characterData: true, subtree: true });
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
    /* El encabezado de la hoja (Nombre, Fecha, Centro Educativo, Valor
       total) no es de la pantalla. 60 misiones lo esconden en su hoja; 22
       (Fin de grado y casi todas las de Matemáticas) no, y se veía encima
       del examen. La hoja impresa no lo usa: printEval arma la suya en
       otra ventana, con su propio encabezado. */
    '@media screen{.eval-print-header{display:none;}}',
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
    /* Si el título ya dice una forma (el selector se rehízo, o la misión
       armó el examen al abrir), esa es la que está en la pantalla. */
    var enTitulo = _formaDelTitulo(selId);
    if (enTitulo && enTitulo <= tope) s.mostrada = enTitulo;
    _seguirTitulo(selId);

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

  /* ══════════ 4 · El centro en el encabezado del examen impreso ══════════

     El docente configura su centro en Mi aula (nombre, logo, dirección).
     Aquí ese perfil sale arriba de la hoja impresa del examen: logo en
     gris a la izquierda, el nombre en mayúsculas, y en letra pequeña el
     lugar y el nombre del maestro. La raya «Centro Educativo: ____» se
     quita, porque ya está escrito arriba.

     Solo con un docente con sesión y un centro con nombre. Cualquier otro
     (sin cuenta, alumno, familia, docente que cerró sesión) imprime la
     hoja de siempre, con la raya en blanco.

     No se toca ninguna de las 84 misiones. Cada una arma su hoja en un
     texto y lo escribe en una ventana nueva (`printEval`, `printEvalOp`,
     `printEvalCrit`). Las tres se envuelven al cargar: la envoltura
     decide el centro, y mientras corre la impresión de la misión cambia
     solo el bloque `.ph` del texto ANTES de escribirlo, para que el
     ajuste de tamaño que trae la hoja mida ya el encabezado nuevo y la
     hoja siga cabiendo en una carta.

     Con dos centros o más, primero se pregunta con cuál. La impresión de
     la misión corre dentro del toque en el botón del centro: así la
     ventana nueva la abre un toque del docente y el navegador no la
     bloquea.

     La hoja que sale de aquí lleva `data-metas-encabezado`, y
     `MetasCentro.examen` (js/metas-centro.js) ya no la toca. */

  var LLAVE_CENTRO_EXAMEN = 'METAS_EXAMEN_CENTRO_V1';   // preferencia de vista: el último centro elegido
  var SIN_ENCABEZADO = 'sin';
  /* Cada impresión, con el dato que la misión revisa antes de imprimir.
     Sin ese dato la misión solo avisa «genera una evaluación primero»:
     no tiene sentido preguntar antes por el centro. */
  var IMPRESIONES = { printEval: '_evalPrintData', printEvalOp: '_evalOpData', printEvalCrit: '_evalCritData' };

  function _esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function _txt(t) { return String(t == null ? '' : t).trim(); }

  function _conSesion() {
    var MC = global.MetasCentro;
    return !!(MC && typeof MC.sesionDocente === 'function' && typeof MC.centros === 'function' && MC.sesionDocente());
  }
  /* Los centros que valen para el encabezado: hace falta la sesión del
     docente y, de cada centro, por lo menos el nombre. */
  function _centrosParaExamen() {
    if (!_conSesion()) return [];
    return (global.MetasCentro.centros() || []).filter(function (c) { return c && c.id && _txt(c.nombre); });
  }

  function _leerUltimo() { try { return global.localStorage.getItem(LLAVE_CENTRO_EXAMEN) || ''; } catch (e) { return ''; } }
  function _guardarUltimo(v) { try { global.localStorage.setItem(LLAVE_CENTRO_EXAMEN, v); } catch (e) { /* solo se pierde el recuerdo */ } }

  /* El logo solo si es una imagen de verdad: va dentro de un atributo. */
  function _logoSeguro(src) {
    src = _txt(src);
    return /^(data:image\/|https?:\/\/)/i.test(src) ? src.replace(/["'<>\s]/g, '') : '';
  }

  /* La segunda raya del alumno. Las 84 misiones la escriben siempre en
     el mismo orden, con estos rótulos: el centro como «Centro Educativo»,
     «Instituto» o «Universidad/Instituto»; el grado como «Grado y
     Sección», «Grado» o «Carrera/Sección»; el número como «N.º Lista»,
     «N.º» o «N.º Cuenta». Lo vigila _dev/verifica-encabezado-centro.js
     contra todas las hojas de las misiones. */
  var RAYA_CENTRO = /<div class="ph-line"><strong>(?:Centro Educativo|Instituto|Universidad\/Instituto):<\/strong><span class="ph-fill">&nbsp;<\/span><strong>(Grado y Sección|Grado|Carrera\/Sección):<\/strong><span class="ph-s">&nbsp;<\/span><strong>(N\.º Lista|N\.º|N\.º Cuenta):<\/strong><span class="ph-xs">&nbsp;<\/span><\/div>/g;
  var BLOQUE_PH = /<div class="ph">/g;

  /* Sin la raya del centro, el grado ocupa lo que queda del renglón,
     como el nombre en el de arriba. El de la universidad conserva sus
     rótulos; los de Básica dicen todos «Grado y Sección» y «N.º de lista». */
  function _rayaAlumno(m, grado, num) {
    var g = grado === 'Carrera/Sección' ? grado : 'Grado y Sección';
    var n = num === 'N.º Cuenta' ? num : 'N.º de lista';
    return '<div class="ph-line"><strong>' + g + ':</strong><span class="ph-fill">&nbsp;</span><strong>' + n
      + ':</strong><span class="ph-xs">&nbsp;</span></div>';
  }

  /* Compacto a propósito: el bloque suma unos 9 mm a la hoja. Las 160
     hojas con ajuste de tamaño lo absorben solas; las 8 de Fin de grado no
     traen ajuste y van cerca del final de la carta. El logo mide lo mismo
     que las dos líneas de texto para no agregar alto por su cuenta. */
  function _bloqueCentro(centro, docente) {
    var logo = _logoSeguro(centro.logo);
    var lugar = [];
    [centro.direccion, centro.municipio].forEach(function (p) {
      p = _txt(p);
      if (p && lugar.indexOf(p) < 0) lugar.push(p);
    });
    var bajo = [];
    if (lugar.length) bajo.push(_esc(lugar.join(', ')));
    if (_txt(docente)) bajo.push('Docente: ' + _esc(_txt(docente)));
    var lado = 'flex:none;width:34px;height:34px;';
    return '<div data-metas-centro style="display:flex;align-items:center;gap:8px;margin:0 0 0.1rem;">'
      + (logo ? '<img data-metas-logo alt="" src="' + logo + '" style="' + lado
        + 'object-fit:contain;filter:grayscale(1);-webkit-filter:grayscale(1);">' : '')
      + '<div style="flex:1;min-width:0;text-align:center;">'
      + '<div style="font-size:11.5pt;font-weight:700;letter-spacing:0.03em;line-height:1.15;">'
      + _esc(_txt(centro.nombre).toLocaleUpperCase('es')) + '</div>'
      + (bajo.length ? '<div style="font-size:8.5pt;color:#333;line-height:1.2;">' + bajo.join(' · ') + '</div>' : '')
      + '</div>'
      /* Del otro lado, un hueco del ancho del logo: así el nombre queda
         centrado en la hoja y no corrido a la derecha. */
      + (logo ? '<div aria-hidden="true" style="' + lado + '"></div>' : '')
      + '</div>';
  }

  /* El texto de la hoja, con el encabezado que toca. `centro` null es
     «Sin encabezado»: la hoja de siempre, con la raya para escribir el
     centro, solo marcada para que nadie la llene. Si una hoja no tiene la
     forma conocida, sale así también, sin perder nada. */
  function _hojaConEncabezado(html, centro, docente) {
    if (typeof html !== 'string' || html.indexOf('<div class="ph">') < 0) return html;
    var bloques = html.match(BLOQUE_PH).length;
    var rayas = (html.match(RAYA_CENTRO) || []).length;
    if (!centro || rayas !== bloques) {
      return html.replace(BLOQUE_PH, '<div class="ph" data-metas-encabezado="' + SIN_ENCABEZADO + '">');
    }
    var arriba = _bloqueCentro(centro, docente);
    var out = html
      .replace(RAYA_CENTRO, _rayaAlumno)
      .replace(BLOQUE_PH, function () { return '<div class="ph" data-metas-encabezado="centro">' + arriba; });
    /* Las 160 hojas que traen su ajuste (`fit`) ya miden con el bloque
       puesto. Las 8 de Fin de grado no traen ajuste y van al límite de la
       carta: la operativa de 5.º tiene un milímetro libre, y el bloque la
       mandaba a una segunda hoja. A esas se les quita exactamente lo que el
       bloque agrega: la hoja queda del mismo alto que hoy y se pagina
       igual, a cambio de verse un 3 o 4 % más chica. */
    if (out.indexOf('function fit(') < 0) {
      var ajuste = '<script>(function(){var b=document.querySelector("[data-metas-centro]");'
        + 'var p=b&&b.parentElement&&b.parentElement.parentElement;if(!p||p===document.body||p===document.documentElement)return;'
        + 'var H=p.getBoundingClientRect().height,h=b.getBoundingClientRect().height+(parseFloat(getComputedStyle(b).marginBottom)||0);'
        + 'if(h>0&&H>h*4)p.style.zoom=((H-h)/H).toFixed(4);})();</script>';
      var cierre = out.lastIndexOf('</body>');
      out = cierre >= 0 ? out.slice(0, cierre) + ajuste + out.slice(cierre) : out + ajuste;
    }
    return out;
  }

  function _docenteDe(centro) {
    if (centro && _txt(centro.docente)) return _txt(centro.docente);
    var ses = global.MetasCentro && global.MetasCentro.sesionDocente && global.MetasCentro.sesionDocente();
    return ses && _txt(ses.nombre) ? _txt(ses.nombre) : '';
  }

  /* Corre la impresión de la misión con la ventana nueva vigilada: lo que
     la misión escribe en ella pasa antes por `_hojaConEncabezado`. Solo
     durante esta llamada; después `window.open` queda como estaba. */
  function _imprimirCon(centro, original, yo, args) {
    var abrir = global.open;
    var docente = centro ? _docenteDe(centro) : '';
    global.open = function () {
      var win = abrir.apply(global, arguments);
      try {
        if (win && win.document && !win.__metasEncabezado) {
          win.__metasEncabezado = 1;
          var escribir = win.document.write;
          win.document.write = function (html) {
            if (typeof html === 'string') html = _hojaConEncabezado(html, centro, docente);
            return escribir.call(win.document, html);
          };
        }
      } catch (e) { /* la hoja sale como siempre */ }
      return win;
    };
    try { return original.apply(yo, args); }
    finally { global.open = abrir; }
  }

  var CSS_CENTRO = [
    '.metas-centro-velo{position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;padding:16px;}',
    '.metas-centro-caja{background:#fff;color:#0f172a;border-radius:16px;max-width:420px;width:100%;max-height:calc(100vh - 32px);overflow:auto;padding:20px 16px 16px;box-shadow:0 20px 50px rgba(0,0,0,.35);font-family:inherit;}',
    '.metas-centro-tit{font-size:1.05rem;font-weight:800;margin:0 0 12px;text-align:center;line-height:1.3;}',
    '.metas-centro-lista{display:flex;flex-direction:column;gap:8px;}',
    '.metas-centro-op{appearance:none;-webkit-appearance:none;display:flex;align-items:center;gap:10px;width:100%;min-height:56px;padding:8px 12px;border:2px solid #cbd5e1;border-radius:12px;background:#fff;color:#0f172a;font:inherit;font-size:.95rem;font-weight:700;text-align:left;cursor:pointer;line-height:1.25;}',
    '.metas-centro-op img{flex:none;width:40px;height:40px;object-fit:contain;filter:grayscale(1);-webkit-filter:grayscale(1);}',
    '.metas-centro-op .metas-centro-nom{flex:1;min-width:0;}',
    '.metas-centro-op .metas-centro-ult{display:block;font-size:.75rem;font-weight:600;color:#475569;margin-top:2px;}',
    '.metas-centro-op[data-ultimo]{border-color:var(--pri,#1e3a7c);}',
    '.metas-centro-op:focus-visible,.metas-centro-cerrar:focus-visible{outline:3px solid var(--pri,#1e3a7c);outline-offset:2px;}',
    '.metas-centro-sin{font-weight:600;min-height:48px;}',
    '.metas-centro-cerrar{appearance:none;-webkit-appearance:none;display:block;margin:12px auto 0;min-height:44px;min-width:120px;padding:0 16px;border:0;border-radius:12px;background:transparent;color:#334155;font:inherit;font-size:.9rem;font-weight:700;cursor:pointer;text-decoration:underline;}',
    '@media print{.metas-centro-velo{display:none!important;}}'
  ].join('\n');

  function _estilosCentro(doc) {
    if (doc.getElementById('metas-centro-css')) return;
    var st = doc.createElement('style');
    st.id = 'metas-centro-css';
    st.textContent = CSS_CENTRO;
    (doc.head || doc.documentElement).appendChild(st);
  }

  /* El selector: un botón por centro (logo y nombre) y «Sin encabezado».
     El último elegido lleva el borde de color y el foco, para que la
     próxima vez baste un toque. Cancelar no imprime nada. */
  function _elegirCentro(lista, alElegir) {
    var doc = global.document;
    var viejo = doc.getElementById('metas-centro-velo');
    if (viejo) viejo.parentNode.removeChild(viejo);
    _estilosCentro(doc);
    var ultimo = _leerUltimo();
    var antes = doc.activeElement;

    var velo = doc.createElement('div');
    velo.id = 'metas-centro-velo';
    velo.className = 'metas-centro-velo';
    var caja = doc.createElement('div');
    caja.className = 'metas-centro-caja';
    caja.setAttribute('role', 'dialog');
    caja.setAttribute('aria-modal', 'true');
    caja.setAttribute('aria-labelledby', 'metas-centro-tit');
    var h = '<h2 class="metas-centro-tit" id="metas-centro-tit">¿Con qué centro imprimes el examen?</h2><div class="metas-centro-lista">';
    lista.forEach(function (c) {
      var logo = _logoSeguro(c.logo);
      h += '<button type="button" class="metas-centro-op" data-centro="' + _esc(c.id) + '"' + (c.id === ultimo ? ' data-ultimo' : '') + '>'
        + (logo ? '<img alt="" src="' + logo + '">' : '')
        + '<span class="metas-centro-nom">' + _esc(_txt(c.nombre))
        + (c.id === ultimo ? '<span class="metas-centro-ult">✓ La última vez</span>' : '') + '</span></button>';
    });
    h += '<button type="button" class="metas-centro-op metas-centro-sin" data-centro=""' + (ultimo === SIN_ENCABEZADO ? ' data-ultimo' : '') + '>'
      + '<span class="metas-centro-nom">Sin encabezado (como antes)'
      + (ultimo === SIN_ENCABEZADO ? '<span class="metas-centro-ult">✓ La última vez</span>' : '') + '</span></button>';
    h += '</div><button type="button" class="metas-centro-cerrar">Cancelar</button>';
    caja.innerHTML = h;
    velo.appendChild(caja);
    doc.body.appendChild(velo);
    _traducir(caja);

    function cerrar() {
      doc.removeEventListener('keydown', teclas, true);
      if (velo.parentNode) velo.parentNode.removeChild(velo);
      try { if (antes && antes.focus) antes.focus({ preventScroll: true }); } catch (e) { }
    }
    function teclas(ev) {
      if (ev.key === 'Escape') { ev.preventDefault(); cerrar(); return; }
      if (ev.key !== 'Tab') return;
      // El foco no se sale del selector mientras está abierto.
      var botones = caja.querySelectorAll('button');
      var primero = botones[0], ultimoBtn = botones[botones.length - 1];
      if (ev.shiftKey && doc.activeElement === primero) { ev.preventDefault(); ultimoBtn.focus(); }
      else if (!ev.shiftKey && doc.activeElement === ultimoBtn) { ev.preventDefault(); primero.focus(); }
    }
    doc.addEventListener('keydown', teclas, true);
    velo.addEventListener('click', function (ev) { if (ev.target === velo) cerrar(); });
    caja.querySelector('.metas-centro-cerrar').addEventListener('click', cerrar);
    Array.prototype.forEach.call(caja.querySelectorAll('.metas-centro-op'), function (b) {
      b.addEventListener('click', function () {
        var id = b.getAttribute('data-centro');
        var centro = null;
        for (var i = 0; i < lista.length; i++) if (lista[i].id === id) centro = lista[i];
        _guardarUltimo(centro ? centro.id : SIN_ENCABEZADO);
        cerrar();
        alElegir(centro);
      });
    });
    var foco = caja.querySelector('[data-ultimo]') || caja.querySelector('.metas-centro-op');
    if (foco) foco.focus();
  }

  /* js/metas-registro.js envuelve printEval y printEvalOp después (para
     anotar la pauta impresa), así que la marca no se ve desde afuera: se
     lleva aquí la cuenta de lo envuelto. */
  var envueltas = [];
  function _envolverImpresion(nombre) {
    var original = global[nombre];
    if (typeof original !== 'function' || original.__metasCentro || envueltas.indexOf(nombre) >= 0) return;
    var dato = IMPRESIONES[nombre];
    var envuelta = function () {
      var yo = this, args = arguments;
      if (!global[dato] || !_conSesion()) return original.apply(yo, args);
      /* Con sesión, la hoja la decide siempre el motor: sin un centro con
         nombre sale la de siempre, marcada, y MetasCentro.examen no le
         pone a medias un logo o un nombre de otro lado. */
      var lista = _centrosParaExamen();
      if (!lista.length) return _imprimirCon(null, original, yo, args);
      if (lista.length === 1) return _imprimirCon(lista[0], original, yo, args);
      _elegirCentro(lista, function (centro) { _imprimirCon(centro, original, yo, args); });
    };
    envuelta.__metasCentro = true;
    envuelta.__original = original;
    global[nombre] = envuelta;
    envueltas.push(nombre);
  }
  function _envolverImpresiones() {
    Object.keys(IMPRESIONES).forEach(function (n) { try { _envolverImpresion(n); } catch (e) { } });
  }

  (function _alCargar() {
    var doc = global.document;
    if (!doc || typeof doc.addEventListener !== 'function' || typeof global.setTimeout !== 'function') return;
    var acortar = function () { try { _acortarBotones(doc); } catch (e) { } };
    /* El setTimeout espera a que terminen TODOS los DOMContentLoaded,
       también los de `window`, que es donde las misiones leen su progreso. */
    var alinear = function () { global.setTimeout(function () { try { _alinearConLaMision(); } catch (e) { } }, 0); };
    /* Las impresiones se envuelven cuando la misión ya las declaró: su
       archivo se carga después de este. */
    var envolver = function () { try { _envolverImpresiones(); } catch (e) { } };
    if (doc.readyState === 'loading') {
      doc.addEventListener('DOMContentLoaded', function () { _estilos(); acortar(); alinear(); envolver(); });
    } else { try { _estilos(); } catch (e) { } acortar(); alinear(); global.setTimeout(envolver, 0); }
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

  /* ── Las misiones con formas ya impresas ──

     Once misiones arman su prueba crítica con estructura propia, y sus
     formas 1 a 30 salían de un sorteo con la semilla. Esas 30 no repetían
     conjunto y hay maestros que las tienen impresas con su pauta: no se
     vuelven a repartir. La misión lo dice colgando de sus apartados
     cuántas formas son de antes y cómo salían:

        _conFormasDeAntes([[banco, 5], …], 30, function (forma) {
          return [casos del apartado 1, casos del apartado 2, …];
        })

     De ahí en adelante todo lo demás (`_repartoCritica`, `_formasCritica`,
     `_turnoCritica`, `_selectorCritica`) recibe esos mismos apartados y ya
     sabe qué hacer: hasta la última forma de antes devuelve lo que salía,
     y de la siguiente en adelante sigue el reparto de siempre desde su
     primera posición, SALTANDO los conjuntos que una forma de antes ya
     llevó. Así ninguna forma nueva repite a otra nueva (es el mismo
     reparto) ni a una de antes (se saltó).

     Los casos nuevos de un banco se añaden AL FINAL y en otro arreglo
     (`banco.concat(nuevos)`): el sorteo de antes baraja el banco entero,
     y un caso más en él cambiaría las 30 formas impresas. */
  function _conFormasDeAntes(apartados, cuantas, deAntes) {
    if (!(cuantas >= 1) || typeof deAntes !== 'function') throw new Error('Pensamiento crítico: las formas de antes piden cuántas son y cómo salían');
    apartados.formasDeAntes = Math.floor(cuantas);
    apartados.deAntes = deAntes;
    return apartados;
  }

  /* El conjunto de una forma, sin el orden: de cada apartado, las
     posiciones de sus casos en el banco. Un caso que no está en el banco
     de su apartado revienta aquí con su número. */
  function _llaveDeConjunto(ruedas, casos) {
    return ruedas.map(function (r, i) {
      var suyos = casos && casos[i];
      if (!Array.isArray(suyos) || suyos.length !== r.saca) throw new Error('Pensamiento crítico, apartado ' + (i + 1) + ': una forma de antes no trae los ' + r.saca + ' casos que saca');
      return suyos.map(function (c) {
        var pos = r.banco.indexOf(c);
        if (pos < 0) throw new Error('Pensamiento crítico, apartado ' + (i + 1) + ': una forma de antes trae un caso que no está en su banco');
        return pos;
      }).sort(function (a, b) { return a - b; }).join(',');
    }).join('|');
  }

  /* Los conjuntos que ya llevaron las formas de antes. Se guarda colgado
     de los mismos apartados: en un turno se pregunta varias veces. */
  function _usadosAntes(apartados, ruedas) {
    if (apartados._usadosAntes) return apartados._usadosAntes;
    var usados = {}, distintos = 0;
    for (var f = 1; f <= apartados.formasDeAntes; f++) {
      var llave = _llaveDeConjunto(ruedas, apartados.deAntes(f));
      if (!usados[llave]) { usados[llave] = f; distintos++; }
    }
    return (apartados._usadosAntes = { llaves: usados, distintos: distintos });
  }

  /* Cuántas formas tiene la prueba crítica de una misión: 50, o las que
     su banco dé si no alcanza. Nunca se ofrece una forma que repita. Con
     formas de antes, son esas más los conjuntos que quedaron libres. */
  function _formasCritica(apartados) {
    var posibles = _conjuntosCritica(apartados);
    if (!apartados.deAntes) return Math.min(FORMAS_CRITICA, posibles);
    return Math.min(FORMAS_CRITICA, apartados.formasDeAntes + posibles - _usadosAntes(apartados, _ruedasDe(apartados)).distintos);
  }

  /* Los casos de una forma: un arreglo por apartado, en el orden en que
     se declararon. No toca los bancos. */
  function _repartoCritica(forma, apartados) {
    var f = Math.max(1, Math.floor(forma) || 1) - 1;
    var ruedas = _ruedasDe(apartados);
    if (!apartados.deAntes) return _repartoDeRuedas(f, ruedas);
    var antes = apartados.formasDeAntes, usados = _usadosAntes(apartados, ruedas);
    var posibles = _conjuntosCritica(apartados);
    /* Agotadas las de antes y todos los conjuntos libres, vuelve la 1. */
    f = f % (antes + posibles - usados.distintos);
    if (f < antes) return apartados.deAntes(f + 1);
    /* La forma nueva número n es el n-ésimo conjunto del reparto que
       ninguna forma de antes llevó. */
    var faltan = f - antes + 1;
    for (var paso = 0; paso < posibles; paso++) {
      var casos = _repartoDeRuedas(paso, ruedas);
      if (!usados.llaves[_llaveDeConjunto(ruedas, casos)] && --faltan === 0) return casos;
    }
    throw new Error('Pensamiento crítico: no quedan conjuntos libres para la forma ' + forma);
  }

  /* El reparto de siempre, con `f` contando desde 0. */
  function _repartoDeRuedas(f, ruedas) {
    /* El orden de los casos DENTRO de un apartado no cambia el conjunto,
       pero sí cómo se ve la hoja: se baraja con el generador de siempre,
       con la semilla que ya usaba esta prueba. */
    var rng = _evalRng(200000 + f + 1);
    var peso = 1, pesos = [];
    return ruedas.map(function (r) {
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

  /* Los casos de una sección de selección, cada uno en una copia con sus
     opciones barajadas y la posición de la correcta movida con ellas. La
     correcta no se deja al azar de cada caso, que amontona: se REPARTE
     entre las letras. Se toman las letras en tandas barajadas (a, b, c, d
     en desorden; al acabarse, otra tanda), así en una misma hoja ninguna
     letra se repite hasta que salieron todas, y el orden no se adivina.
     Es para las formas NUEVAS de una misión con formas de antes: en las de
     antes las opciones van como estaban, que es como las tiene el maestro
     en su pauta. No toca el banco. `opciones` y `correcta` son los
     nombres de esos dos campos del caso; `correcta` puede guardar la
     posición o el texto de la opción buena. */
  function _conOpcionesRepartidas(casos, rng, opciones, correcta) {
    var tanda = [];
    return casos.map(function (caso) {
      var todas = caso[opciones], n = todas.length;
      var porTexto = typeof caso[correcta] !== 'number';
      var buena = porTexto ? todas.indexOf(caso[correcta]) : caso[correcta];
      if (!tanda.length) tanda = _shuffleF(todas.map(function (_, i) { return i; }), rng);
      var sitio = tanda.shift() % n;
      var nuevas = _shuffleF(todas.filter(function (_, i) { return i !== buena; }), rng);
      nuevas.splice(sitio, 0, todas[buena]);
      var copia = {};
      Object.keys(caso).forEach(function (k) { copia[k] = caso[k]; });
      copia[opciones] = nuevas;
      if (!porTexto) copia[correcta] = sitio;
      return copia;
    });
  }

  /* Barajar la columna de un pareado sin dejar ninguna respuesta en la
     fila de su pregunta: un pareado alineado se contesta sin leer. Vuelve
     a barajar con la misma semilla hasta que ninguna quede en su sitio.
     También solo para las formas NUEVAS; las de antes van como salían. */
  function _barajarSinFilaPropia(lista, rng) {
    var barajada = _shuffleF(lista, rng);
    for (var intento = 0; intento < 40 && lista.length > 1; intento++) {
      if (!barajada.some(function (x, i) { return x === lista[i]; })) break;
      barajada = _shuffleF(lista, rng);
    }
    return barajada;
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

  /* ══════════ 2b · El examen conceptual con banco grande ══════════

     El examen conceptual saca cinco preguntas de cada banco de diez, y un
     alumno que se aprende las primeras formas se sabe el banco entero. La
     misión que trae un banco NUEVO al lado del de siempre ofrece formas
     nuevas después de las que ya tenía (31 a 50, si tenía 30).

     Las formas de antes no se tocan: las sigue sacando el generador v1 de
     arriba, del banco de siempre, y por eso el banco nuevo va en OTRO
     arreglo y no añadido al primero (un ítem más en él cambiaría las
     formas impresas).

     Las nuevas se REPARTEN con las mismas ruedas de la prueba crítica.
     Cada sección (Completar, V/F, Selección, Pareados) son dos ruedas:
     tres preguntas del banco nuevo y dos del de antes. No se mezclan los
     dos bancos en una sola rueda a propósito. Se midió: con una rueda por
     sección las cuatro avanzan al mismo paso, y la primera forma nueva
     salía sin una sola pregunta nueva y otras con cuatro de veinte, que
     se aprueban de memoria. Con la cuota, TODA forma nueva lleva doce
     preguntas nuevas de veinte.

     Ninguna forma nueva repite a otra nueva (es el reparto de siempre) ni
     a una de antes (las de antes no llevan ninguna pregunta nueva).

     Solo en las formas nuevas se barajan las opciones de la selección,
     con la correcta repartida entre las letras, y los pareados no dejan
     ninguna definición en la fila de su término (decisión 2 del plan).

     ⚠️ Queda congelado igual que el reparto: añadir o quitar una pregunta
     del banco nuevo cambia todas las formas nuevas de esa misión. */
  var NUEVAS_POR_SECCION = 3, DE_ANTES_POR_SECCION = 2;
  var SECCIONES_CONCEPTUAL = ['cp', 'tf', 'mc', 'pr'];

  /* `grande` dice, por sección, el banco de antes y el nuevo:
     { cp: { deAntes: […], nuevas: […] }, tf: …, mc: …, pr: … } */
  function _apartadosConceptual(grande) {
    var apartados = [];
    SECCIONES_CONCEPTUAL.forEach(function (s) {
      var par = grande && grande[s];
      if (!par || !Array.isArray(par.deAntes) || !Array.isArray(par.nuevas))
        throw new Error('Examen conceptual, banco grande: falta el banco de antes o el nuevo de la sección ' + s);
      apartados.push([par.nuevas, NUEVAS_POR_SECCION], [par.deAntes, DE_ANTES_POR_SECCION]);
    });
    return apartados;
  }

  /* Cuántas formas tiene el examen conceptual: las de antes, y con banco
     grande hasta 50 (o hasta donde den sus conjuntos). */
  function _formasConceptual(deAntes, grande) {
    if (!grande) return deAntes;
    return Math.max(deAntes, Math.min(FORMAS_CRITICA, deAntes + _conjuntosCritica(_apartadosConceptual(grande))));
  }

  /* Las letras de las opciones («a) », «b) »…) van escritas en el banco:
     al barajarlas hay que volver a ponerlas en orden. */
  function _reletrar(casos) {
    return casos.map(function (caso) {
      caso.o = caso.o.map(function (texto, i) { return 'abcdef'.charAt(i) + ') ' + String(texto).replace(/^[a-f]\)\s*/i, ''); });
      return caso;
    });
  }

  /* Las preguntas de una forma NUEVA (la primera es `deAntes + 1`):
     cinco por sección ya mezcladas, y las definiciones de los pareados en
     el orden de la hoja. No toca los bancos. */
  function _repartoConceptual(forma, deAntes, grande) {
    var casos = _repartoCritica(forma - deAntes, _apartadosConceptual(grande));
    /* Otra semilla que la del examen de antes (la forma) y que la crítica
       (200000 + forma): la mezcla de aquí no tiene que parecerse a ninguna. */
    var rng = _evalRng(300000 + forma);
    var hoja = {};
    /* Nuevas y de antes revueltas: si las tres nuevas fueran siempre las
       primeras, el alumno sabría cuáles son sin leerlas. */
    SECCIONES_CONCEPTUAL.forEach(function (s, i) { hoja[s] = _shuffleF(casos[2 * i].concat(casos[2 * i + 1]), rng); });
    hoja.mc = _reletrar(_conOpcionesRepartidas(hoja.mc, rng, 'o', 'a'));
    hoja.defs = _barajarSinFilaPropia(hoja.pr, rng);
    return hoja;
  }

  /* El banco grande de la misión que está cargada, o null si no lo trae:
     los cuatro bancos de siempre y, al lado, los cuatro nuevos. Los lee por
     su nombre, que es el mismo en todas las misiones. Vivía en la plantilla
     (js/motor-mision.js) y solo le servía a la misión que la usa; aquí lo
     piden también las de archivo propio, sin copiarlo ninguna. */
  function _bancoGrandeConceptual() {
    if (typeof evalCPBankNuevo === 'undefined' || typeof evalTFBankNuevo === 'undefined' || typeof evalMCBankNuevo === 'undefined' || typeof evalPRBankNuevo === 'undefined') return null;
    return { cp: { deAntes: evalCPBank, nuevas: evalCPBankNuevo }, tf: { deAntes: evalTFBank, nuevas: evalTFBankNuevo }, mc: { deAntes: evalMCBank, nuevas: evalMCBankNuevo }, pr: { deAntes: evalPRBank, nuevas: evalPRBankNuevo } };
  }

  /* Hasta qué forma llega el examen conceptual de la misión cargada: sus
     formas de siempre (`EVAL_FORMAS`, las que tienen clave impresa) y, con
     banco grande, las nuevas. La misión pregunta antes si esta función
     existe: un teléfono con el motor de antes guardado no la tiene, y
     entonces su examen se queda en las formas de siempre, que no fallan. */
  function _topeConceptual() { return _formasConceptual(EVAL_FORMAS, _bancoGrandeConceptual()); }

  global._formasConceptual = _formasConceptual;
  global._repartoConceptual = _repartoConceptual;
  global._apartadosConceptual = _apartadosConceptual;
  global._bancoGrandeConceptual = _bancoGrandeConceptual;
  global._topeConceptual = _topeConceptual;

  global._repartoCritica = _repartoCritica;
  global._conFormasDeAntes = _conFormasDeAntes;
  global._conOpcionesRepartidas = _conOpcionesRepartidas;
  global._barajarSinFilaPropia = _barajarSinFilaPropia;
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
    conceptual: { formas: _formasConceptual, reparto: _repartoConceptual, apartados: _apartadosConceptual, bancoGrande: _bancoGrandeConceptual, tope: _topeConceptual, nuevasPorSeccion: NUEVAS_POR_SECCION, deAntesPorSeccion: DE_ANTES_POR_SECCION },
    critica: { formasMaximas: FORMAS_CRITICA, conjuntos: _conjuntosCritica, formas: _formasCritica, reparto: _repartoCritica, conFormasDeAntes: _conFormasDeAntes, conOpcionesRepartidas: _conOpcionesRepartidas, barajarSinFilaPropia: _barajarSinFilaPropia, selector: _selectorCritica, turno: _turnoCritica },
    abrirPedida: abrirPedida, buscar: buscar, carpetaDe: carpetaDe,
    centro: { hoja: _hojaConEncabezado, centros: _centrosParaExamen, envolver: _envolverImpresiones, envueltas: function () { return envueltas.slice(); } }
  };
/* `globalThis` y no `window` a secas: en el navegador son lo mismo, y las
   sondas que cargan esto en Node tienen un `window` de mentira que no es el
   objeto global, donde estos nombres no se verían. */
})(typeof globalThis !== 'undefined' ? globalThis : window);
