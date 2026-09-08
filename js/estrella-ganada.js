/* ============================================================
   M.E.T.A.S · La estrella se gana
   ------------------------------------------------------------
   Medido abriendo las 74 misiones y SIN TOCAR NADA: **34 daban
   estrellas de regalo, 125 en total**, con el XP en 0.

   | sección       | misiones que la regalaban al abrir |
   |---------------|-----------------------------------:|
   | s-evaluacion  | 34 |
   | s-aprende     | 33 |
   | s-tipos       | 32 |
   | s-errores     | 20 |
   | s-tareas      |  5 |
   | s-estructura  |  1 |

   Un puntaje que se consigue sin aprender no motiva: **enseña que el
   puntaje no significa nada**. Es la misma regla que este proyecto ya
   escribió para los videos —«ver un video no da XP ni marca la sección
   como hecha, porque nadie puede comprobar que el niño lo miró»— sin
   aplicarla al resto.

   ⚠️ **Lo ya ganado NO se le quita a nadie.** Un alumno que abrió la
   misión ayer tiene esas estrellas guardadas, y `loadProgress` las
   vuelve a poner escribiendo directamente en `done`, sin pasar por
   `fin`: por ahí no se toca nada. Lo que cambia es que a partir de hoy
   no se regalan más.

   ⚠️ **Esto se carga en el `<head>`, no al final del body.** Es lo
   único que hace que funcione: así su oyente de DOMContentLoaded queda
   registrado ANTES que el de la misión y llega a envolver `fin` antes
   de que el arranque lo llame. Cargado al final llegaría tarde y las
   estrellas ya estarían puestas.

   Y vive AQUÍ, no copiado en las 74, como el andamio de los juegos 3D,
   el aparato de videos, la barra de secciones y el teclado. No se toca
   ni una línea de ninguna misión: todo son envoltorios.
   ============================================================ */
(function () {
  'use strict';

  /* Lo de la misión se alcanza por su nombre. `fin`, `pts`, `saveProgress`
     y `updateXPBar` son declaraciones de función —propiedades del objeto
     global, así que se pueden envolver—; `done`, `xp`, `xpTracker` y
     `SAVE_KEY` son let/const del ámbito léxico global, que otro script
     clásico sí ve por su nombre. */

  var huboGesto = false;
  var deSoloLeer = [];        // las que la misión intentó marcar al abrir
  var ESPERA = 3000;

  /* ⚠️ Estas dos NO entran en «de solo leer» aunque el arranque las
     marque: tienen su propia forma de ganarse —calificar la prueba,
     generar la tarea— y ponerles el centinela del final devolvería
     justo el regalo que se está quitando: bajar hasta el final del
     examen daría la estrella sin contestar una pregunta. */
  var CON_ACTIVIDAD = { 's-evaluacion': 1, 's-tareas': 1 };

  /* ── 1 · Antes del primer toque no se gana nada ─────────────
     Es la regla que de verdad resuelve: cubre las tres secciones de
     leer que se marcaban en el arranque Y la prueba que algunas
     misiones pre-generan ahí mismo, sin tener que saber cuáles son. */
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, function () { huboGesto = true; }, { capture: true, once: true, passive: true });
  });

  function envolver(nombre, antes, despues) {
    if (typeof window[nombre] !== 'function') return false;
    var orig = window[nombre];
    window[nombre] = function () {
      var st = antes ? antes.apply(null, arguments) : null;
      var r = orig.apply(this, arguments);
      if (despues) despues(st);
      return r;
    };
    return true;
  }

  function marcadas() { return (typeof done !== 'undefined' && done && done.has) ? done : null; }

  function desmarcar(id) {
    var d = marcadas();
    if (!d || !d.has(id)) return;
    d['delete'](id);
    var b = document.querySelector('[data-s="' + id + '"]');
    if (b) b.classList.remove('done');
    if (typeof saveProgress === 'function') saveProgress();
  }

  /* ── 2 · Las secciones de leer se ganan LEYÉNDOLAS ──────────
     Un centinela al final de la sección: cuando el alumno llega ahí
     —y se queda un momento, no de paso al cambiar de pestaña— la
     estrella es suya. Es lo único comprobable en una sección que solo
     tiene texto; cualquier otra cosa sería volver a regalarla.
     La LISTA no se escribe aquí ni en la misión: son exactamente las
     que la propia misión intentó marcar al abrir. */
  function ganarLeyendo(ids) {
    if (!ids.length || typeof IntersectionObserver === 'undefined') return;
    ids.forEach(function (id) {
      var sec = document.getElementById(id);
      if (!sec || sec.dataset.egPuesta) return;
      sec.dataset.egPuesta = '1';

      var centinela = document.createElement('div');
      centinela.className = 'eg-fin';
      centinela.setAttribute('aria-hidden', 'true');
      centinela.style.cssText = 'height:1px;margin-top:-1px;';
      sec.appendChild(centinela);

      var reloj = null;
      new IntersectionObserver(function (e) {
        var dentro = e[0] && e[0].isIntersecting && sec.classList.contains('active');
        if (dentro && !reloj) {
          reloj = setTimeout(function () { reloj = null; if (typeof fin === 'function') fin(id); }, ESPERA);
        } else if (!dentro && reloj) { clearTimeout(reloj); reloj = null; }
      }, { threshold: 0.9 }).observe(centinela);
    });
  }

  /* ── 3 · El XP no se vuelve a ganar recargando ──────────────
     xpTracker recuerda qué tarjeta, qué pregunta y qué palabra ya
     pagaron, pero NO se guardaba: al recargar volvía vacío y las
     mismas 14 tarjetas pagaban otra vez. La pantalla prometía
     «(primera vez)» en 84 páginas y no se cumplía.
     Se guarda en su propia llave, sin tocar el saveProgress de las 74
     —que tiene diez formas distintas—. */
  function llave(suf) { return (typeof SAVE_KEY !== 'undefined' ? SAVE_KEY : 'metas_mision') + suf; }

  function guardarTracker() {
    if (typeof xpTracker === 'undefined' || !xpTracker) return;
    var fuera = {};
    for (var k in xpTracker) if (xpTracker[k] instanceof Set) fuera[k] = Array.from(xpTracker[k]);
    try { localStorage.setItem(llave('_xpt'), JSON.stringify(fuera)); } catch (e) { }
  }

  function cargarTracker() {
    if (typeof xpTracker === 'undefined' || !xpTracker) return;
    var dentro;
    try { dentro = JSON.parse(localStorage.getItem(llave('_xpt'))); } catch (e) { return; }
    if (!dentro || typeof dentro !== 'object') return;
    for (var k in dentro) {
      if (xpTracker[k] instanceof Set && Array.isArray(dentro[k])) {
        dentro[k].forEach(function (v) { xpTracker[k].add(v); });
      }
    }
  }

  /* ── 4 · La prueba paga una vez ─────────────────────────────
     gradeEval da +8 XP cada vez que se toca «Calificar». Con las mismas
     respuestas puestas eso es una barra de XP que sube sola tocando un
     botón, y esa barra es la que sale en la Constancia. */
  function pagados() { try { return JSON.parse(localStorage.getItem(llave('_pagado'))) || {}; } catch (e) { return {}; } }
  function anotarPago(k) { var p = pagados(); p[k] = 1; try { localStorage.setItem(llave('_pagado'), JSON.stringify(p)); } catch (e) { } }

  function montar() {
    cargarTracker();

    /* fin() se envuelve ANTES de que el arranque de la misión lo llame:
       de eso se encarga el <link> en el <head>. */
    envolver('fin', function (id) {
      var d = marcadas();
      /* ⚠️ Se mira si YA estaba antes de la llamada. Sin esto se le
         quitaba al alumno una estrella ganada ayer: loadProgress la
         vuelve a poner en `done`, el arranque llama a fin() otra vez
         —que no hace nada, porque ya está— y el envoltorio la borraba
         igual. Costó una prueba que salió con la estrella desaparecida
         después de recargar. */
      return { id: id, antesDelGesto: !huboGesto, yaEstaba: d ? d.has(id) : true };
    }, function (st) {
      if (st && st.antesDelGesto && !st.yaEstaba) {
        /* La misión la marcó al abrir. No se gana así, pero SÍ dice cuál
           es: es la lista de las secciones que solo se leen, escrita por
           quien conoce el contenido. */
        if (!CON_ACTIVIDAD[st.id] && deSoloLeer.indexOf(st.id) < 0) deSoloLeer.push(st.id);
        desmarcar(st.id);
      }
    });

    /* Generar la prueba no es hacerla: la estrella la da calificarla. Se
       deshace lo que marcó la generación, salvo que ya estuviera ganado.

       ⚠️ `genTask` NO va aquí, y esto se vio tarde: la sección de tareas
       no tiene calificación —el alumno pide sus ejercicios y los resuelve
       en el cuaderno—, así que deshacer su marca la dejaba imposible de
       completar para siempre. Ahí basta la regla del primer toque: si la
       pidió él, la ganó; si la generó el arranque, no. */
    ['genEval', 'genEvalOp'].forEach(function (n) {
      envolver(n,
        function () { var d = marcadas(); return d ? d.has('s-evaluacion') : true; },
        function (yaEstaba) { if (!yaEstaba) desmarcar('s-evaluacion'); });
    });

    /* Calificar sí: eso es haber hecho la sección. Y paga una vez. */
    ['gradeEval', 'gradeEvalOp'].forEach(function (n) {
      var clave = n.toLowerCase();
      envolver(n,
        function () { return { xp: (typeof xp !== 'undefined' ? xp : 0), ya: !!pagados()[clave] }; },
        function (st) {
          if (st && typeof xp !== 'undefined' && xp > st.xp) {
            if (st.ya) {
              /* Se le devuelve la barra a donde estaba y se le DICE por
                 qué: una barra que sube y baja sin explicación es un
                 teléfono que el niño da por trabado. */
              xp = st.xp;
              if (typeof updateXPBar === 'function') updateXPBar();
              if (typeof saveProgress === 'function') saveProgress();
              if (typeof showToast === 'function') showToast('⭐ El XP de esta prueba ya lo ganaste');
            } else anotarPago(clave);
          }
          if (typeof fin === 'function') fin('s-evaluacion');
          guardarTracker();
        });
    });

    /* Cada punto que se dé queda apuntado, para que recargar no lo
       vuelva a pagar. */
    envolver('pts', null, guardarTracker);

    /* Y el observador de lectura, cuando la misión ya declaró cuáles
       son —o sea, después de su arranque—. */
    setTimeout(function () { ganarLeyendo(deSoloLeer); }, 0);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();

/* ============================================================
   CÓMO SE PONE EN UNA MISIÓN NUEVA — una línea, y va en el <head>:

     <script src="../../js/estrella-ganada.js"></script>

   ⚠️ En el <head>, no al final del body: tiene que registrar su
   oyente antes que la misión para llegar a envolver fin() antes de
   que el arranque lo llame.

   Lo comprueba _dev/verifica-estrella-ganada.js en TODAS.
   ============================================================ */
