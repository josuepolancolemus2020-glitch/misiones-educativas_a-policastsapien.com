/* ============================================================
   M.E.T.A.S · Motor de misiones
   ------------------------------------------------------------
   El código que las misiones tenían copiado, una vez. Se va pasando
   aquí por tandas pequeñas; cada misión sigue en su página de siempre,
   con su misma dirección y su misma llave de guardado.

   Hoy tiene dos piezas:

   1. EL EXAMEN POR FORMAS (`_evalRng`, `_shuffleF`, `_pickF`,
      `_injectFormaSel`). Estaban copiadas, idénticas, en 84 misiones.
   2. LA PUERTA (`mision.html?m=<carpeta>`), que lleva a una misión.

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

  /* El desplegable «Forma N» que va antes del botón de generar.
     `EVAL_FORMAS` y `saveProgress` son de la misión: cada una tiene su
     tope de formas (30, o 20 en Fin de grado) y su llave de guardado, y
     aquí solo se usan, no se deciden. */
  function _injectFormaSel(fnName, selId, actual, onPick) {
    var ya = document.getElementById(selId);
    if (ya) { ya.value = String(actual); return; }
    var btn = document.querySelector('[onclick*="' + fnName + '()"]');
    if (!btn || !btn.parentNode) return;
    var wrap = document.createElement('label');
    wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin:0 8px 6px 0;font-weight:700;font-size:0.95rem;';
    var ops = '';
    for (var i = 1; i <= EVAL_FORMAS; i++) ops += '<option value="' + i + '"' + (i === actual ? ' selected' : '') + '>Forma ' + i + '</option>';
    wrap.innerHTML = '📋 <select id="' + selId + '" style="padding:6px 10px;border-radius:8px;border:2px solid #888;font-weight:700;font-size:0.95rem;background:#fff;color:#222;" aria-label="Elegir número de forma exacta (1 a ' + EVAL_FORMAS + ')">' + ops + '</select>';
    btn.parentNode.insertBefore(wrap, btn);
    var sel = wrap.querySelector('select');
    if (sel) sel.addEventListener('change', function () { onPick(parseInt(this.value, 10) || 1); try { saveProgress(); } catch (e) { } });
  }

  global._evalRng = _evalRng;
  global._shuffleF = _shuffleF;
  global._pickF = _pickF;
  global._injectFormaSel = _injectFormaSel;

  /* ══════════ 2 · La puerta: mision.html?m=<carpeta> ══════════

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
    abrirPedida: abrirPedida, buscar: buscar, carpetaDe: carpetaDe
  };
/* `globalThis` y no `window` a secas: en el navegador son lo mismo, y las
   sondas que cargan esto en Node tienen un `window` de mentira que no es el
   objeto global, donde estos nombres no se verían. */
})(typeof globalThis !== 'undefined' ? globalThis : window);
