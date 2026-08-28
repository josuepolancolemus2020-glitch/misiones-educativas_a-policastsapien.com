/* =====================================================================
   M.E.T.A.S — js/videos-mision.js
   LA SECCIÓN 🎬 VIDEOS DE UNA MISIÓN.

   APARATO COMPARTIDO, NO COPIADO
   ------------------------------
   Vive aquí y no dentro de la misión porque va a acabar en las 57
   misiones y siguen entrando. Es la misma decisión —y por la misma
   razón— que `js/3d/parque-3d.js`: el andamio de los juegos 3D estuvo
   copiado doce veces y cuando el lienzo se sentó encima de los botones
   hubo que arreglarlo en doce sitios; una de las copias se quedó sin
   arreglar y nadie se enteró.

   Montarlo en una misión son tres líneas. Ver el pie de este archivo.

   QUÉ RESUELVE
   ------------
   El alumno que no entendió el texto quiere que se lo expliquen. En un
   aula sin proyector y con tres teléfonos, «búscalo en YouTube» es
   mandarlo a una pantalla donde lo que sale después no lo eligió nadie.

   Aquí los videos los pone el ADMINISTRADOR desde F.A.R.O, se ven
   DENTRO de la misión, y al acabar no se abre la parrilla de
   sugerencias de YouTube sino una tapa nuestra.

   ═══════════════════════════════════════════════════════════════════
   POR QUÉ EL ALUMNO NO PUEDE AGREGAR VIDEOS, Y POR QUÉ NO ES COSA DE
   ESTA PANTALLA
   ═══════════════════════════════════════════════════════════════════
   Una comprobación en el navegador se salta con la consola en diez
   segundos: cualquiera que abra F12 puede llamar a lo que quiera. Así
   que esto no se sostiene aquí, se sostiene en el servidor:

     · en F.A.R.O se pone un video con la sesión de la familia puesta,
       y quien manda es la seguridad por fila;
     · lo único que M.E.T.A.S puede llamar con su clave publicable es
       una función que SOLO LEE lo ya publicado.

   No hay una puerta de escritura abierta que cerrar: no existe. Es el
   espejo exacto de las Sugerencias, donde la única puerta abierta solo
   sabe escribir y no puede leer nada.

   ═══════════════════════════════════════════════════════════════════
   LA REGLA DE ORO: POR AQUÍ NO PASA NUNCA UNA DIRECCIÓN
   ═══════════════════════════════════════════════════════════════════
   El dato acaba dentro del `src` de un `<iframe>`. La normativa de la
   casa (ver las Sugerencias en CLAUDE.md) dice que ningún dato de estas
   tablas se interpola dentro de un atributo del HTML, porque una
   comilla cierra el atributo y lo que siga se convierte en un atributo
   de verdad —un `onload`, por ejemplo— que corre DENTRO de la página.

   Aquí no se puede evitar que el dato vaya a un atributo. Lo que se
   hace es quitarle al dato la capacidad de hacer daño: se guarda el
   IDENTIFICADOR de once caracteres, nunca la dirección. En
   [A-Za-z0-9_-] no hay comillas, ni espacios, ni dos puntos, ni barras:
   `javascript:` no se puede ni escribir. La dirección la arma este
   archivo, con un literal delante, y se pone con `setAttribute`.

   Se comprueba en `vmId()` antes de pintar, y otra vez en el `check` de
   la columna del SQL de F.A.R.O. Las dos hacen falta: la pantalla no
   puede fiarse de la base y la base no puede fiarse de la pantalla.

   ═══════════════════════════════════════════════════════════════════
   LOS ANUNCIOS: LO QUE SE PUEDE PROMETER Y LO QUE NO
   ═══════════════════════════════════════════════════════════════════
   NO se pueden quitar. No existe un parámetro de YouTube que lo haga, y
   `youtube-nocookie.com` corta el rastreo, no la publicidad. Prometer
   lo contrario sería mentirle al maestro.

   Lo que sí se hace, y son tres cosas:

     1. RECORTAR (`ini` y `fin`): el trozo que sirve, sin la paja.
     2. AVISAR de Brave, que es un NAVEGADOR (no un buscador) que
        bloquea los anuncios de YouTube. El aviso va siempre a la vista
        bajo el reproductor, porque quien lo instala es el maestro o la
        familia y solo se acuerdan de mirarlo el día que sale uno.
     3. Elegir canales que no monetizan, que eso es del administrador.

   ═══════════════════════════════════════════════════════════════════
   POR QUÉ HAY FACHADA Y NO EL REPRODUCTOR DIRECTO
   ═══════════════════════════════════════════════════════════════════
   Hasta que el alumno no toca ▶ no sale UNA SOLA petición hacia
   YouTube. Seis videos serían seis reproductores y varios megas en la
   conexión de un pueblo, por una sección que a lo mejor nadie abre.
   ===================================================================== */
(function () {
  'use strict';

  /* ─────────── Constantes ───────────
     El dominio es el «privacy enhanced» de YouTube: no deja cookies de
     rastreo hasta que el alumno le da al play. No quita anuncios —ver
     arriba—, pero es gratis y es lo correcto para una pantalla que
     abren niños. */
  var YT_EMBED = 'https://www.youtube-nocookie.com/embed/';
  var YT_API = 'https://www.youtube.com/iframe_api';
  var YT_MIRA = 'https://www.youtube.com/watch?v=';
  var YT_MINI = 'https://i.ytimg.com/vi/';
  var BRAVE = 'https://brave.com/es/download/';

  var CLAVE_VISTOS = 'METAS_VIDEOS_VISTOS_V1';

  /* Los dos plazos, y son distintos a propósito. Ver `vigilar()`. */
  var TOPE_API = 12000;   // que llegue la API de YouTube
  var TOPE_LISTO = 9000;  // que el reproductor diga que está montado

  /* ═══════════ LAS COMPROBACIONES ═══════════ */

  /* El identificador de YouTube: ONCE caracteres y nada más.
     Devuelve '' si no lo es, y con '' el video no se pinta.

     No se «limpia» un identificador malo quitándole lo que sobra: si
     no es exactamente esto, es que alguien escribió otra cosa, y otra
     cosa lleva a OTRO VIDEO. Se descarta entero, que es lo barato. */
  function vmId(s) {
    var t = (s == null ? '' : String(s)).trim();
    return /^[A-Za-z0-9_-]{11}$/.test(t) ? t : '';
  }

  /* Los segundos de `ini` y `fin`. Enteros, nunca negativos, y con
     tope: `start=1e30` en la dirección es basura dentro del src. */
  function vmSeg(n) {
    var v = parseInt(n, 10);
    if (!isFinite(v) || v <= 0) return 0;
    return v > 86400 ? 0 : v;
  }

  /* Texto para pintar. Se recorta por largo y punto: NO se escapa a
     mano, porque aquí no se arma HTML con datos —todo va por
     textContent— y una función de escapar propia es justo lo que
     acaba olvidándose en el sitio que importa. */
  function vmTxt(s, max) {
    var t = (s == null ? '' : String(s)).trim();
    return t.length > max ? t.slice(0, max) : t;
  }

  /* Una entrada cruda —del catálogo o de la nube— en una segura, o
     null si no lo es. Todo lo que se pinta ha pasado por aquí. */
  function normaliza(v, i) {
    if (!v || typeof v !== 'object') return null;
    var yt = vmId(v.yt || v.yt_id);
    if (!yt) return null;
    var ini = vmSeg(v.ini), fin = vmSeg(v.fin);
    /* Un final antes del principio deja el video en cero segundos: se
       ve un parpadeo negro y el alumno cree que está roto. Se ignora
       el final y se ve entero, que es el fallo menos malo. */
    if (fin && ini && fin <= ini) fin = 0;
    return {
      id: vmTxt(v.id, 60) || ('v-' + yt + '-' + i),
      yt: yt,
      titulo: vmTxt(v.titulo, 160) || 'Video',
      nota: vmTxt(v.nota, 400),
      dura: vmTxt(v.dura, 12),
      canal: vmTxt(v.canal, 80),
      ini: ini,
      fin: fin,
      preguntas: vmPreguntas(v.preguntas)
    };
  }

  /* Las preguntas del propio video, limpiadas antes de pintarlas.

     Todo lo que llegue de fuera pasa por aquí, y lo que no sea una
     pregunta contestable se descarta ENTERO. La razón es la de siempre:
     esta pantalla la abre un niño solo, y una pregunta sin respuesta
     correcta —o con una sola opción— es una pantalla trabada de la que
     no puede salir. Es preferible un video sin quiz a un quiz roto.

     `ok` es el ÍNDICE de la buena, y se comprueba que exista de verdad:
     un `ok` que apunte fuera de la lista dejaría el acierto imposible. */
  function vmPreguntas(lista) {
    if (!Array.isArray(lista)) return [];
    var salida = [];
    for (var i = 0; i < lista.length && salida.length < 3; i++) {
      var q = lista[i];
      if (!q || typeof q !== 'object') continue;
      var texto = vmTxt(q.p, 200);
      if (!texto) continue;
      var ops = Array.isArray(q.ops) ? q.ops : [];
      var limpias = [];
      for (var j = 0; j < ops.length && limpias.length < 4; j++) {
        var o = vmTxt(ops[j], 120);
        if (o) limpias.push(o);
      }
      if (limpias.length < 2) continue;
      var ok = parseInt(q.ok, 10);
      if (!isFinite(ok) || ok < 0 || ok >= limpias.length) continue;
      salida.push({ p: texto, ops: limpias, ok: ok });
    }
    return salida;
  }

  /* ═══════════ LAS DOS CAPAS ═══════════
     El catálogo del repositorio y lo que trajo la nube. Manda la nube
     cuando coinciden en `id`: así se corrige un título desde la tableta
     sin esperar a un despliegue. Lo que solo está en el catálogo se ve
     igual, que es lo que sostiene la Fase 0.

     Las LÁPIDAS (`del`) son el motivo por el que esto no es un simple
     concat: quitar un video de la nube no puede dejar vivo al del
     catálogo, o el que se retiró por estar mal seguiría en pantalla. */
  function fusiona(catalogo, nube) {
    var salida = [], porId = {}, i, v;
    for (i = 0; i < catalogo.length; i++) {
      v = normaliza(catalogo[i], i);
      if (v) { porId[v.id] = salida.length; salida.push(v); }
    }
    for (i = 0; i < nube.length; i++) {
      var crudo = nube[i];
      if (!crudo) continue;
      var id = vmTxt(crudo.id, 60);
      if (crudo.del) {                       // lápida: se va de la lista
        if (id && porId[id] !== undefined) salida[porId[id]] = null;
        continue;
      }
      v = normaliza(crudo, catalogo.length + i);
      if (!v) continue;
      if (porId[v.id] !== undefined) salida[porId[v.id]] = v;
      else { porId[v.id] = salida.length; salida.push(v); }
    }
    return salida.filter(function (x) { return !!x; });
  }

  /* ═══════════ LO YA VISTO ═══════════
     Solo un rótulo para el alumno («✓ Ya lo viste») y una línea en la
     Evidencia del maestro. NO da XP y NO marca la sección como hecha:
     nadie puede comprobar que el niño miró el video, y un puntaje que
     se consigue dándole al play y yéndose es un puntaje regalado. */
  function vistos() {
    try { var o = JSON.parse(localStorage.getItem(CLAVE_VISTOS)); return (o && typeof o === 'object') ? o : {}; }
    catch (e) { return {}; }
  }
  function marcarVisto(mision, v) {
    try {
      var o = vistos();
      o[mision + '|' + v.id] = Date.now();
      localStorage.setItem(CLAVE_VISTOS, JSON.stringify(o));
    } catch (e) {}
    /* La Evidencia de misiones lleva ya todo lo que el alumno hace.
       Un video abierto es un dato del maestro: le dice que el tema no
       se entendió con el texto. */
    try {
      if (window.METAS && typeof window.METAS.registrar === 'function') {
        window.METAS.registrar('video', { video: v.id, yt: v.yt, video_titulo: v.titulo });
      }
    } catch (e) {}
  }

  /* ═══════════ PINTAR ═══════════
     createElement y textContent, sin una sola plantilla con datos
     dentro. La única cosa que llega a un atributo es el identificador
     de once, y va con setAttribute después de vmId(). */
  function el(tag, clase, texto) {
    var n = document.createElement(tag);
    if (clase) n.className = clase;
    if (texto != null) n.textContent = texto;
    return n;
  }

  /* La dirección del reproductor. Es el ÚNICO sitio de todo el archivo
     donde se arma una dirección de YouTube, y se arma con un literal
     delante y un identificador ya comprobado detrás.

     Qué hace cada parámetro, porque ninguno está de adorno:
       rel=0             no ofrece videos de otros canales
       modestbranding=1  quita el logotipo grande
       playsinline=1     en iPhone NO salta al reproductor del sistema,
                         que es la forma más rápida de salirse de aquí
       iv_load_policy=3  sin anotaciones encima del video
       cc_lang_pref=es   subtítulos en español cuando el video los trae
       enablejsapi=1     sin esto no hay forma de saber que terminó, y
                         sin saberlo no se puede tapar la parrilla */
  function direccion(v) {
    var p = ['rel=0', 'modestbranding=1', 'playsinline=1', 'iv_load_policy=3',
             'cc_lang_pref=es', 'enablejsapi=1', 'autoplay=1'];
    if (v.ini) p.push('start=' + v.ini);
    if (v.fin) p.push('end=' + v.fin);
    /* El origen se le dice a YouTube por seguridad de la propia API.
       Solo si es http/https: abierto como archivo suelto el origen es
       «null» y la API se niega a hablar. */
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      p.push('origin=' + encodeURIComponent(location.origin));
    }
    return YT_EMBED + v.yt + '?' + p.join('&');
  }

  /* El aviso de Brave. Se arma aquí una vez y se clona: es el mismo
     texto en todas las tarjetas y en el panel de fallo. */
  function avisoBrave() {
    var d = el('div', 'vm-brave');
    d.appendChild(el('span', null, '🦁'));
    var t = el('div');
    t.appendChild(document.createTextNode('¿Te salen anuncios? Abre M.E.T.A.S dentro del navegador '));
    var a = el('a', null, 'Brave');
    a.setAttribute('href', BRAVE);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    t.appendChild(a);
    t.appendChild(document.createTextNode(': bloquea los anuncios de YouTube y gasta menos datos.'));
    d.appendChild(t);
    return d;
  }

  /* ═══════════ EL MOTOR ═══════════ */

  var apiPedida = false, apiLista = false, esperandoApi = [];

  /* La API de YouTube se baja una vez para toda la página, y solo
     cuando alguien toca el primer ▶. Es la misma regla que Three.js en
     los juegos 3D: primero se mira si ya está puesta, para que una
     sonda pueda ponerle una de mentira y para que guardar una copia
     propia el día de mañana sea cambiar una línea y no cuarenta. */
  function pedirApi(cuando) {
    if (apiLista || (window.YT && window.YT.Player)) { apiLista = true; return cuando(true); }
    esperandoApi.push(cuando);
    if (apiPedida) return;
    apiPedida = true;

    /* onYouTubeIframeAPIReady es un global y solo hay uno. Se encadena
       con lo que hubiera antes en vez de pisarlo: si mañana otra pieza
       de la misión usa la API, pisarlo la dejaría muda y el fallo sería
       invisible. */
    var previo = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = function () {
      apiLista = true;
      if (typeof previo === 'function') { try { previo(); } catch (e) {} }
      var cola = esperandoApi; esperandoApi = [];
      cola.forEach(function (f) { try { f(true); } catch (e) {} });
    };

    var s = document.createElement('script');
    s.src = YT_API;
    s.async = true;
    s.onerror = function () { rendirse(); };
    document.head.appendChild(s);

    /* La señal mala no siempre falla: muchas veces se queda colgada y
       no contesta nunca. Sin este plazo, quien espera a la API espera
       para siempre y la tarjeta se queda en negro. */
    setTimeout(function () { if (!apiLista) rendirse(); }, TOPE_API);

    function rendirse() {
      var cola = esperandoApi; esperandoApi = [];
      cola.forEach(function (f) { try { f(false); } catch (e) {} });
    }
  }

  /* ═══════════ UNA TARJETA ═══════════ */
  function tarjeta(v, ctx) {
    var card = el('div', 'vm-card');
    card.setAttribute('data-vm-id', v.id);

    /* ── La fachada ── */
    var fach = el('button', 'vm-fachada');
    fach.type = 'button';
    /* El nombre del video en el botón, para quien navega con lector de
       pantalla: sin esto se oye «botón», catorce veces. */
    fach.setAttribute('aria-label', 'Reproducir: ' + v.titulo);

    var mini = document.createElement('img');
    mini.className = 'vm-mini';
    mini.setAttribute('loading', 'lazy');
    mini.setAttribute('alt', '');
    mini.setAttribute('src', YT_MINI + v.yt + '/hqdefault.jpg');
    /* Sin señal la miniatura no llega. Se esconde sola y queda el
       degradado de la misión debajo: una tarjeta de color con su
       título, nunca un icono de imagen rota. */
    mini.onerror = function () { mini.style.display = 'none'; };
    fach.appendChild(mini);
    fach.appendChild(el('span', 'vm-play', '▶'));
    if (v.dura) fach.appendChild(el('span', 'vm-dura', v.dura));
    card.appendChild(fach);

    /* ── Lo escrito ── */
    var cuerpo = el('div', 'vm-cuerpo');
    cuerpo.appendChild(el('h3', 'vm-titulo', v.titulo));
    if (v.canal) cuerpo.appendChild(el('p', 'vm-canal', v.canal));
    if (v.nota) cuerpo.appendChild(el('p', 'vm-nota', '👩‍🏫 ' + v.nota));
    var visto = el('span', 'vm-visto', '✓ Ya lo viste');
    visto.hidden = !ctx.vistos[ctx.mision + '|' + v.id];
    cuerpo.appendChild(visto);
    card.appendChild(cuerpo);

    /* Al toque Y al clic. Un navegador de tableta que no sintetice el
       clic dejaría al alumno con la tarjeta delante y sin poder
       abrirla: la misma regla 7 de los juegos 3D. */
    var abierto = false;
    function abrir(e) {
      if (e) e.preventDefault();
      if (abierto) return;
      abierto = true;
      reproducir(card, fach, v, ctx, visto);
    }
    fach.addEventListener('click', abrir);
    fach.addEventListener('touchend', abrir);

    return card;
  }

  /* ═══════════ REPRODUCIR ═══════════ */
  function reproducir(card, fachada, v, ctx, visto) {
    card.classList.add('vm-abierta');

    var marco = el('div', 'vm-marco');
    var frame = document.createElement('iframe');
    frame.setAttribute('title', v.titulo);
    frame.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
    frame.setAttribute('allowfullscreen', '');
    /* referrerpolicy: YouTube no necesita saber la dirección completa
       de la misión para servir el video. */
    frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.setAttribute('src', direccion(v));   // ← el único atributo con dato
    marco.appendChild(frame);

    /* La fachada se va y el reproductor ocupa su sitio exacto. No se
       esconde con hidden: dejarla debajo mantiene viva su miniatura y
       un hueco de 16/9 de más al final de la tarjeta. */
    card.replaceChild(marco, fachada);

    card.querySelector('.vm-cuerpo').appendChild(avisoBrave());

    marcarVisto(ctx.mision, v);
    visto.hidden = false;

    vigilar(marco, frame, v, ctx);
  }

  /* ═══════════ VIGILAR EL REPRODUCTOR ═══════════
     Aquí están las dos cosas que de verdad importan: tapar el final y
     no mentir cuando algo falla.

     Y son DOS plazos distintos a propósito:

       · si la API de YouTube no llega, no podemos saber NADA del
         video —pero el video puede estar viéndose perfectamente—. Ahí
         NO se tapa: se pone debajo una tira pequeña por si no se ve.
         Tapar un video que está corriendo es el peor fallo posible.

       · si la API llegó y aun así el reproductor no dice «listo»,
         entonces sí: el video no está. Ahí se tapa y se explica. */
  function vigilar(marco, frame, v, ctx) {
    var listo = false, terminado = false;

    pedirApi(function (hayApi) {
      if (!hayApi) { tiraDeAyuda(marco, v); return; }

      var player;
      try {
        player = new window.YT.Player(frame, {
          events: {
            onReady: function () { listo = true; },
            onStateChange: function (e) {
              /* 0 = ENDED. Es el instante exacto en el que YouTube
                 pinta su parrilla de sugerencias encima del video, con
                 «Ver en YouTube». La tapa cae aquí. */
              if (e && e.data === 0 && !terminado) {
                terminado = true;
                taparFinal(marco, v, ctx, player);
              }
            },
            onError: function (e) {
              /* El mejor dato que da YouTube, y el que resuelve el
                 caso que no se puede adivinar de otra forma:
                   2       identificador mal escrito
                   5       el reproductor no puede con este video
                   100     borrado o privado
                   101/150 el DUEÑO no deja incrustarlo
                 Los dos últimos son el motivo del botón «Comprobar»
                 de F.A.R.O: no hay manera de saberlo sin intentarlo. */
              listo = true;   // contestó: no es que no haya llegado
              fallo(marco, v, motivoDe(e && e.data));
            }
          }
        });
      } catch (e) { tiraDeAyuda(marco, v); return; }

      setTimeout(function () {
        if (!listo) fallo(marco, v, 'No se pudo cargar el video. Puede ser la señal, o que la red de la escuela bloquee YouTube.');
      }, TOPE_LISTO);
    });
  }

  function motivoDe(codigo) {
    if (codigo === 101 || codigo === 150) return 'El dueño de este video no permite verlo dentro de otras páginas.';
    if (codigo === 100) return 'Este video ya no existe o se hizo privado.';
    if (codigo === 2) return 'La dirección de este video quedó mal escrita.';
    return 'El reproductor de YouTube no pudo abrir este video.';
  }

  /* La tapa del final: lo que cumple «que no salga de la misión». */
  function taparFinal(marco, v, ctx, player) {
    if (marco.querySelector('.vm-tapa')) return;
    var tapa = el('div', 'vm-tapa');

    /* SI EL VIDEO TRAE PREGUNTAS, SE PREGUNTA. Y si no, se ofrece lo de
       siempre. Mandar al alumno al Quiz de la misión era un salto raro:
       aquel pregunta por el tema entero, no por lo que acaba de ver, y
       además se lo lleva de la sección sin comprobar nada. */
    if (v.preguntas && v.preguntas.length) {
      /* ⚠️ CON QUIZ, LA TAPA DEJA DE ESTAR ENCAJADA EN EL 16/9.

         El hueco del video en un teléfono de 393 px de ancho mide 221 px
         de alto. Una pregunta con tres opciones no cabe ahí ni de lejos:
         se veía el enunciado cortado por arriba y «Saltar las preguntas»
         cortado por abajo. Se podía deslizar por dentro, pero eso es
         justo lo que la regla 8 de los juegos 3D dice que no basta —y
         aquí es peor, porque lo que se corta es la pregunta.

         Con esta marca, el marco suelta su proporción fija y la tapa
         entra EN FLUJO: el marco crece hasta lo que ocupe el quiz. El
         reproductor sigue detrás, estirado y tapado. Lo cazó una
         captura de pantalla, no una aserción. */
      marco.classList.add('vm-marco-quiz');
      tapa.classList.add('vm-tapa-quiz');
      quizDelVideo(tapa, marco, v, ctx, player);
    } else {
      tapa.appendChild(el('p', 'vm-tapa-tit', '✅ Terminaste este video'));
      tapa.appendChild(botonesFinales(tapa, v, ctx, player));
    }
    marco.appendChild(tapa);
  }

  /* Los dos botones de siempre: verlo otra vez y seguir. */
  function botonesFinales(tapa, v, ctx, player) {
    var btns = el('div', 'vm-tapa-btns');

    var otra = el('button', 'vm-btn', '▶ Verlo otra vez');
    otra.type = 'button';
    otra.addEventListener('click', function () {
      /* El marco recupera su proporción de video: si se quedara con el
         alto que pidió el quiz, el reproductor volvería a salir dentro
         de una caja demasiado alta y con franjas negras. */
      var m = tapa.parentNode;
      if (m && m.classList) m.classList.remove('vm-marco-quiz');
      tapa.remove();
      try { player.seekTo(v.ini || 0, true); player.playVideo(); }
      catch (e) { /* si la API se cayó, al menos la tapa se quitó */ }
    });
    btns.appendChild(otra);

    /* A dónde se va después. Lo dice la misión al montar: cada una
       tiene sus secciones y este archivo no las conoce. */
    if (ctx.siguiente && ctx.siguiente.id) {
      var ir = el('button', 'vm-btn vm-btn-pri', ctx.siguiente.texto || 'Seguir');
      ir.type = 'button';
      ir.addEventListener('click', function () {
        if (typeof window.go === 'function') window.go(ctx.siguiente.id);
      });
      btns.appendChild(ir);
    }
    return btns;
  }

  /* ═══════════ EL QUIZ DEL PROPIO VIDEO ═══════════
     Dos o tres preguntas sobre lo que acaba de ver, escritas por quien
     eligió el video. Cinco decisiones, y ninguna es de adorno:

     1. UNA PREGUNTA A LA VEZ, y en letra grande. Es la misma lección
        que ya está escrita para la lectura de las misiones: las cinco
        juntas y en letra chica son un muro de texto en un teléfono, y
        el niño contesta por contestar.

     2. SE CORRIGE EN EL SITIO, no al final. Si la corrección llega
        después de tres preguntas, ya no se acuerda de por qué contestó
        eso. Se pinta la buena en verde, la suya en rojo si falló, y se
        sigue.

     3. FALLAR OFRECE VOLVER AL MINUTO. Es lo que un quiz sobre un video
        puede hacer y uno sobre un tema no: si no lo entendió, el sitio
        donde estaba explicado son estos mismos cinco minutos.

     4. NO DA XP. Sigue siendo la regla de la sección: nadie puede
        comprobar que el niño vio el video, y aquí las preguntas se
        pueden acertar a la tercera. Lo que sí queda es el resultado
        apuntado en la Evidencia del maestro, que es el dato que de
        verdad le sirve: un video visto y tres preguntas falladas le
        dice que el tema sigue sin entenderse.

     5. SE PUEDE SALTAR. Un alumno que vio el video para repasar y no
        quiere examen tiene que poder cerrar. Un quiz obligatorio al
        final de un video es la forma más rápida de que no se abra
        ningún video más. */
  function quizDelVideo(tapa, marco, v, ctx, player) {
    var i = 0, aciertos = 0, contestada = false;

    var cab = el('p', 'vm-tapa-tit', '🧠 ¿Qué entendiste?');
    tapa.appendChild(cab);

    var paso = el('p', 'vm-quiz-paso');
    tapa.appendChild(paso);

    var cuerpo = el('div', 'vm-quiz');
    tapa.appendChild(cuerpo);

    pintarPregunta();

    function pintarPregunta() {
      contestada = false;
      cuerpo.textContent = '';
      paso.textContent = 'Pregunta ' + (i + 1) + ' de ' + v.preguntas.length;
      var q = v.preguntas[i];

      cuerpo.appendChild(el('p', 'vm-quiz-p', q.p));

      var ops = el('div', 'vm-quiz-ops');
      q.ops.forEach(function (texto, j) {
        var b = el('button', 'vm-quiz-op', texto);
        b.type = 'button';
        b.addEventListener('click', function () { responder(q, j, ops); });
        ops.appendChild(b);
      });
      cuerpo.appendChild(ops);

      /* Saltar el quiz, siempre a la vista. Ver la decisión 5. */
      var salta = el('button', 'vm-quiz-salta', 'Saltar las preguntas');
      salta.type = 'button';
      salta.addEventListener('click', terminar);
      cuerpo.appendChild(salta);
    }

    function responder(q, elegida, ops) {
      /* Un dedo impaciente contesta dos veces la misma pregunta y se
         cuenta doble. Es la misma razón por la que los juegos 3D dejan
         un respiro después de cambiar de pantalla. */
      if (contestada) return;
      contestada = true;
      if (elegida === q.ok) aciertos++;

      var botones = ops.querySelectorAll('.vm-quiz-op');
      for (var k = 0; k < botones.length; k++) {
        botones[k].disabled = true;
        if (k === q.ok) botones[k].classList.add('vm-quiz-bien');
        else if (k === elegida) botones[k].classList.add('vm-quiz-mal');
      }

      var pie = el('div', 'vm-quiz-pie');
      pie.appendChild(el('span', 'vm-quiz-dice',
        elegida === q.ok ? '✅ Correcto' : '❌ La correcta era: ' + q.ops[q.ok]));

      var sigue = el('button', 'vm-btn vm-btn-pri',
        i + 1 < v.preguntas.length ? 'Siguiente →' : 'Ver resultado');
      sigue.type = 'button';
      sigue.addEventListener('click', function () {
        i++;
        if (i < v.preguntas.length) pintarPregunta();
        else terminar();
      });
      pie.appendChild(sigue);
      cuerpo.appendChild(pie);
    }

    function terminar() {
      cuerpo.textContent = '';
      paso.textContent = '';
      var total = v.preguntas.length;
      cab.textContent = aciertos === total
        ? '🎉 ' + aciertos + ' de ' + total
        : '🧠 ' + aciertos + ' de ' + total;

      cuerpo.appendChild(el('p', 'vm-quiz-p',
        aciertos === total ? '¡Entendiste el video!'
          : aciertos > 0 ? 'Bien, pero hay algo que se te escapó.'
          : 'Este video merece otra pasada.'));

      /* Que quede en la Evidencia del maestro. Es lo que de verdad le
         sirve: un video visto con las preguntas falladas le dice que el
         tema sigue sin entenderse, y eso no se lo dice ninguna otra
         pantalla. */
      try {
        if (window.METAS && typeof window.METAS.registrar === 'function') {
          window.METAS.registrar('video_quiz', {
            video: v.id, yt: v.yt, video_titulo: v.titulo,
            aciertos: aciertos, total: total
          });
        }
      } catch (e) {}

      cuerpo.appendChild(botonesFinales(tapa, v, ctx, player));
    }
  }

  /* El video no se puede ver, y la pantalla lo DICE.
     Un cuadro negro y mudo parece la aplicación rota, y una aplicación
     que parece rota no se vuelve a abrir. */
  function fallo(marco, v, motivo) {
    if (marco.querySelector('.vm-fallo')) return;
    var p = el('div', 'vm-fallo');
    p.appendChild(el('div', 'vm-fallo-tit', '📵 No se pudo ver aquí'));
    p.appendChild(el('div', 'vm-fallo-txt', motivo));
    var btns = el('div', 'vm-tapa-btns');
    btns.appendChild(enlaceYouTube(v, 'vm-btn vm-btn-pri'));
    p.appendChild(btns);
    p.appendChild(avisoBrave());
    marco.appendChild(p);
  }

  /* Salir a YouTube es el ÚLTIMO recurso y por eso solo aparece cuando
     ya se sabe que dentro no se puede: ofrecerlo siempre sería poner
     la puerta de salida al lado del video. */
  function enlaceYouTube(v, clase) {
    var a = el('a', clase, '▶ Abrirlo en YouTube');
    a.setAttribute('href', YT_MIRA + v.yt + (v.ini ? '&t=' + v.ini : ''));
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    return a;
  }

  /* Cuando no llegó la API: el video PUEDE estar viéndose, así que no
     se tapa nada. Solo una tira pequeña debajo por si acaso. */
  function tiraDeAyuda(marco, v) {
    if (marco.parentNode.querySelector('.vm-ayuda')) return;
    var d = el('div', 'vm-brave vm-ayuda');
    d.appendChild(el('span', null, '❓'));
    var t = el('div');
    t.appendChild(document.createTextNode('¿No se ve el video? '));
    t.appendChild(enlaceYouTube(v, ''));
    d.appendChild(t);
    marco.parentNode.appendChild(d);
  }

  /* ═══════════ MONTAR LA SECCIÓN ═══════════ */
  function montar(opciones) {
    opciones = opciones || {};
    var mision = opciones.mision || '';
    var destino = typeof opciones.destino === 'string'
      ? document.querySelector(opciones.destino) : opciones.destino;
    if (!destino || !mision) return;

    /* La marca del territorio del aparato, y no es de adorno: TODAS las
       reglas de color de `videos-mision.css` cuelgan de ella.

       Motivo, y es el que decide que esto funcione en las 57 misiones:
       cada misión trae su propia hoja de estilos, y ahí dentro hay
       reglas como `.card p { color: ... }`. Esa regla tiene MÁS
       especificidad que un `.vm-origen` a secas, así que le gana — y el
       aparato vive dentro de una `.card`. El primer síntoma fue el
       título de la tapa del final saliendo GRIS SOBRE NEGRO, o sea
       ilegible, y lo cazó una captura de pantalla.

       No se arregla con `!important` repartido: se arregla dando una
       raíz de la que colgar, que además deja escrito hasta dónde llega
       lo del aparato. */
    destino.classList.add('vm-raiz');

    var ctx = { mision: mision, vistos: vistos(), siguiente: opciones.siguiente || null };

    var catalogo = [];
    try {
      var C = window.VIDEOS_MISIONES;
      if (C && Array.isArray(C[mision])) catalogo = C[mision];
    } catch (e) {}

    pintar(destino, ctx, catalogo, [], 'catalogo');

    /* La nube, si el puente está puesto. Va después de pintar, nunca
       antes: la sección tiene que verse aunque la nube no conteste
       nunca, que es lo que pasa en un aula sin señal. */
    if (window.METAS_VIDEOS && typeof window.METAS_VIDEOS.traer === 'function') {
      window.METAS_VIDEOS.traer(mision).then(function (r) {
        if (!r || !Array.isArray(r.videos)) return;
        /* NO se repinta si ya hay un video abierto, y esto no es un
           detalle: la nube tarda entre medio segundo y ocho, y en ese
           rato el alumno ya pudo tocar ▶. Repintar vacía el destino, o
           sea que le arranca de la pantalla el video que está viendo,
           sin decir por qué. La lista nueva se verá la próxima vez que
           entre, que es cuando no le cuesta nada. */
        if (destino.querySelector('.vm-abierta')) return;
        pintar(destino, ctx, catalogo, r.videos, r.origen || 'nube');
      }).catch(function () { /* se queda lo del catálogo, ya pintado */ });
    }
  }

  function pintar(destino, ctx, catalogo, nube, origen) {
    var lista = fusiona(catalogo, nube);
    /* Se releen aquí y no al montar: entre lo uno y lo otro el alumno
       pudo ver un video, y con la lista vieja se le borraría de la
       pantalla el «✓ Ya lo viste» que acaba de ganarse. */
    ctx.vistos = vistos();
    destino.textContent = '';

    /* Sin conexión los videos no se van a poder abrir. Decirlo ARRIBA
       ahorra seis toques que no llevan a ninguna parte. La LISTA sí se
       ve: viene del catálogo o de lo que se guardó la última vez. */
    if (navigator.onLine === false) {
      destino.appendChild(el('div', 'vm-sinred',
        '📴 Ahora mismo no hay internet. La lista se ve, pero los videos necesitan conexión para reproducirse.'));
    }

    if (!lista.length) {
      var vacio = el('div', 'vm-estado');
      vacio.appendChild(el('b', null, 'Todavía no hay videos en esta misión'));
      vacio.appendChild(document.createTextNode(
        'Los videos los elige y los pone el equipo de M.E.T.A.S. Vuelve a entrar en unos días: cuando haya alguno, aparecerá aquí.'));
      destino.appendChild(vacio);
      return;
    }

    var rejilla = el('div', 'vm-lista');
    lista.forEach(function (v) { rejilla.appendChild(tarjeta(v, ctx)); });
    destino.appendChild(rejilla);

    /* De dónde salió la lista, siempre escrito. Si la nube no
       contestó, el maestro tiene que poder saber que está viendo lo
       que traía la misión —y no creer que nadie ha puesto nada. */
    var rotulos = {
      catalogo: '📚 Videos incluidos con la misión',
      nube: '☁️ Lista actualizada por el equipo de M.E.T.A.S',
      guardado: '💾 Última lista guardada en este aparato'
    };
    destino.appendChild(el('p', 'vm-origen', rotulos[origen] || rotulos.catalogo));
  }

  /* ═══════════ CÓMO SE MONTA EN UNA MISIÓN ═══════════

     1. En el HTML, DESPUÉS del CSS de la misión (se tiñe de su --pri y
        su --sec, así que el orden importa):

          <link rel="stylesheet" href="../../css/videos-mision.css">

     2. En el HTML, la sección y su pestaña:

          <div class="sec" id="s-videos" role="tabpanel">
            <div class="card">
              <h2>🎬 Videos del tema</h2>
              <div id="vmLista"></div>
            </div>
          </div>

     3. Al final del HTML, después del JS de la misión:

          <script src="../../js/data/videos-misiones.js"></script>
          <script src="../../js/metas-videos.js"></script>
          <script src="../../js/videos-mision.js"></script>
          <script>
            VideosMision.montar({
              mision: '2y3ciclo-fracciones',
              destino: '#vmLista',
              siguiente: { id: 's-quiz', texto: '🧠 Ir al Quiz' }
            });
          </script>

     Y SI EL APARATO NO ESTÁ, la misión sigue entera: la sección enseña
     lo que traiga escrito el HTML y nada más se rompe. Por eso el
     bloque lleva dentro su propio mensaje de reserva.
     ================================================================= */

  window.VideosMision = {
    version: 1,
    montar: montar,
    /* Lo de dentro se saca para la sonda: son las comprobaciones que
       hay que poder probar sin abrir un video de verdad. */
    _id: vmId,
    _seg: vmSeg,
    _normaliza: normaliza,
    _fusiona: fusiona,
    _direccion: direccion
  };
})();
