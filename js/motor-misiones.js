/* ============================================================
   M.E.T.A.S · Motor de misiones
   ------------------------------------------------------------
   El código que las misiones tenían copiado, una vez. Se va pasando
   aquí por tandas pequeñas; cada misión sigue en su página de siempre,
   con su misma dirección y su misma llave de guardado.

   Hoy tiene tres piezas:

   1. EL EXAMEN POR FORMAS (`_evalRng`, `_shuffleF`, `_pickF`,
      `_injectFormaSel`). Estaban copiadas, idénticas, en 84 misiones.
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

  /* El desplegable «Forma N» que va antes del botón de generar.
     `EVAL_FORMAS` y `saveProgress` son de la misión: cada una tiene su
     tope de formas (30, o 20 en Fin de grado) y su llave de guardado, y
     aquí solo se usan, no se deciden.
     `tope` es para la prueba que no llega hasta `EVAL_FORMAS`: la de
     pensamiento crítico reparte 50 formas aunque el examen conceptual de
     la misma misión siga en 30. Sin `tope`, todo queda como estaba. */
  function _opcionesDeForma(tope, actual) {
    var ops = '';
    for (var i = 1; i <= tope; i++) ops += '<option value="' + i + '"' + (i === actual ? ' selected' : '') + '>Forma ' + i + '</option>';
    return ops;
  }
  function _rotuloDeForma(tope) { return 'Elegir número de forma exacta (1 a ' + tope + ')'; }
  function _injectFormaSel(fnName, selId, actual, onPick, tope) {
    var ya = document.getElementById(selId);
    if (ya) {
      /* Un desplegable que se pintó con otro tope (el de una página
         guardada de antes, que lo pintaba con 30) se rehace: si no, las
         formas 31 a 50 no se podrían pedir. Sin `tope` no se mira nada
         más, como siempre: el examen conceptual sigue este camino. */
      if (tope && ya.options && ya.options.length !== tope) { ya.innerHTML = _opcionesDeForma(tope, actual); ya.setAttribute('aria-label', _rotuloDeForma(tope)); }
      ya.value = String(actual); return;
    }
    var btn = document.querySelector('[onclick*="' + fnName + '()"]');
    if (!btn || !btn.parentNode) return;
    tope = tope || EVAL_FORMAS;
    var rotulo = _rotuloDeForma(tope);
    var wrap = document.createElement('label');
    wrap.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin:0 8px 6px 0;font-weight:700;font-size:0.95rem;';
    wrap.innerHTML = '📋 <select id="' + selId + '" style="padding:6px 10px;border-radius:8px;border:2px solid #888;font-weight:700;font-size:0.95rem;background:#fff;color:#222;" aria-label="' + rotulo + '">' + _opcionesDeForma(tope, actual) + '</select>';
    btn.parentNode.insertBefore(wrap, btn);
    var sel = wrap.querySelector('select');
    if (sel) sel.addEventListener('change', function () { onPick(parseInt(this.value, 10) || 1); try { saveProgress(); } catch (e) { } });
  }

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

  /* El desplegable de la prueba crítica, con su propio tope. */
  function _selectorCritica(actual, apartados, onPick) {
    _injectFormaSel('genEvalCrit', 'evalCritFormaSel', actual, onPick, _formasCritica(apartados));
  }

  /* Lo que toda misión hacía igual al generar la prueba crítica: leer
     del desplegable qué forma se pidió, dejar apuntada la siguiente y
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
