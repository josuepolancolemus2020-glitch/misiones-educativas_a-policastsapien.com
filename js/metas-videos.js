/* =====================================================================
   M.E.T.A.S — js/metas-videos.js
   EL PUENTE DE LA NUBE: trae de F.A.R.O los videos de una misión.

   POR QUÉ ESTE ARCHIVO EXISTE Y NO ES UN TIPO MÁS DE metas-supabase.js
   -------------------------------------------------------------------
   Son DOS DESTINOS DISTINTOS. Los resultados de las evaluaciones van al
   proyecto de Supabase de M.E.T.A.S porque los consulta el maestro; los
   videos los pone el administrador, y el administrador trabaja en
   F.A.R.O. Es exactamente el mismo reparto que ya hacen `buzon.html` y
   `js/metas-sugerencias.js`, y por eso se hace igual: en un archivo
   aparte. La cola de `metas-supabase.js` es la que lleva las notas de
   los alumnos y no se toca para añadir un camino nuevo.

   EL SENTIDO DEL CABLE, QUE ES LO QUE LO HACE SEGURO
   --------------------------------------------------
   `metas-sugerencias.js` va de aquí HACIA F.A.R.O: el alumno escribe y
   la única puerta abierta solo sabe ESCRIBIR.

   Este va al revés: el administrador escribe en F.A.R.O y aquí solo se
   LEE. La única puerta abierta con esta clave es
   `metas_videos_publicos(...)`, que devuelve los videos ya publicados
   de UNA misión y nada más. Con esta clave no se puede añadir un video,
   ni corregirlo, ni borrarlo, ni ver los que están sin publicar.

   Por eso el alumno no puede meter videos en su misión: no hay una
   puerta de escritura que cerrar, porque no existe. Una comprobación en
   el navegador se saltaría con la consola en diez segundos; esto no.

   NUNCA BLOQUEA, Y NUNCA MIENTE
   -----------------------------
   La sección se pinta primero con lo que trae la misión escrito
   (`js/data/videos-misiones.js`) y solo después, si la nube contesta,
   se repinta con lo suyo. En un aula sin señal —que es el caso normal,
   no el raro— la sección se ve igual y dice de dónde salió lo que
   enseña.

   Lo último que contestó la nube se guarda en el aparato. No es un
   capricho de velocidad: es lo que hace que un video puesto ayer siga
   apareciendo hoy en el teléfono que ya no tiene datos. La lista se ve;
   los videos, esos sí necesitan internet, y la pantalla lo dice.
   ===================================================================== */
(function () {
  'use strict';

  /* El proyecto de F.A.R.O. La clave es «publicable»: va en el
     navegador porque así se diseña. Lo que la vuelve segura es que la
     seguridad por fila está cerrada y la única función expuesta solo
     lee lo publicado. Es la MISMA clave que ya viaja en
     js/metas-sugerencias.js, del mismo proyecto. */
  var SB_URL = 'https://bzrnjvalpwlcnpszvwim.supabase.co';
  var SB_KEY = 'sb_publishable_74mJW5LoxPZOWtIi7YrBEw_0y9JjSfM';
  try {
    SB_URL = localStorage.getItem('METAS_VID_SB_URL') || SB_URL;
    SB_KEY = localStorage.getItem('METAS_VID_SB_KEY') || SB_KEY;
  } catch (e) {}

  var CLAVE_CACHE = 'METAS_VIDEOS_CACHE_V1';

  /* Ocho segundos. La señal mala no siempre falla: muchas veces se
     queda colgada y no contesta nunca. Sin plazo, la promesa no se
     resuelve jamás y la sección se queda con el catálogo para siempre
     —que no es grave, pero tampoco se entera nadie de que la nube está
     caída—. Es la misma lección del plazo de Three.js en los juegos. */
  var TOPE = 8000;

  /* ── Lo guardado ──────────────────────────────────────────────────
     Un objeto por misión: { videos: [...], t: 1724... }. Se guarda
     entero y se poda por número de misiones, no por tamaño: un aparato
     con sesenta misiones abiertas no puede llenar el almacén. */
  var MAX_MISIONES = 40;

  function leerCache() {
    try { var o = JSON.parse(localStorage.getItem(CLAVE_CACHE)); return (o && typeof o === 'object') ? o : {}; }
    catch (e) { return {}; }
  }
  function guardarCache(mision, videos) {
    try {
      var o = leerCache();
      o[mision] = { videos: videos, t: Date.now() };
      var claves = Object.keys(o);
      if (claves.length > MAX_MISIONES) {
        /* Se van las más viejas primero: la misión que el alumno abrió
           hace tres meses le importa menos que la de esta semana. */
        claves.sort(function (a, b) { return (o[a].t || 0) - (o[b].t || 0); });
        claves.slice(0, claves.length - MAX_MISIONES).forEach(function (k) { delete o[k]; });
      }
      localStorage.setItem(CLAVE_CACHE, JSON.stringify(o));
    } catch (e) { /* modo privado, almacén lleno: se sigue sin guardar */ }
  }

  /* ── Traer ────────────────────────────────────────────────────────
     Devuelve SIEMPRE una promesa que se resuelve; nunca una que
     revienta. Quien la llama es la sección de una misión y no tiene
     nada mejor que hacer con un error que enseñar lo que ya tenía.

       { videos: [...], origen: 'nube' | 'guardado' | '' }

     `origen` no es un adorno: la sección lo escribe en pantalla. Si la
     nube no contestó, el maestro tiene que poder saber que está viendo
     lo que traía la misión —y no creer que nadie ha puesto nada—. */
  function traer(mision) {
    var guardado = leerCache()[mision];
    var deReserva = function () {
      return guardado && Array.isArray(guardado.videos)
        ? { videos: guardado.videos, origen: 'guardado' }
        : { videos: [], origen: '' };
    };

    if (!mision || typeof fetch !== 'function') return Promise.resolve(deReserva());
    if (navigator.onLine === false) return Promise.resolve(deReserva());

    /* AbortController corta la petición colgada de verdad. Un
       setTimeout que solo resuelve la promesa dejaría la conexión
       abierta comiéndose los datos del teléfono. */
    var corte = null, ctrl = null;
    try {
      ctrl = new AbortController();
      corte = setTimeout(function () { try { ctrl.abort(); } catch (e) {} }, TOPE);
    } catch (e) { ctrl = null; }

    return fetch(SB_URL + '/rest/v1/rpc/metas_videos_publicos', {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ p_mision: mision }),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (filas) {
        if (corte) clearTimeout(corte);
        if (!Array.isArray(filas)) throw new Error('respuesta rara');
        /* Se guarda TAL CUAL viene, sin limpiar: quien limpia es
           `normaliza()` del aparato, en un solo sitio y justo antes de
           pintar. Dos limpiezas en dos archivos se separan con el
           tiempo, y la que se queda vieja es siempre la que importa. */
        guardarCache(mision, filas);
        return { videos: filas, origen: 'nube' };
      })
      .catch(function () {
        if (corte) clearTimeout(corte);
        return deReserva();
      });
  }

  window.METAS_VIDEOS = {
    version: 1,
    url: SB_URL,
    traer: traer,
    guardados: function (mision) {
      var g = leerCache()[mision];
      return (g && Array.isArray(g.videos)) ? g.videos : [];
    },
    olvidar: function () { try { localStorage.removeItem(CLAVE_CACHE); } catch (e) {} }
  };
})();
