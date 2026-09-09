/* ============================================================
   M.E.T.A.S · Las actividades se pueden hacer sin el dedo
   ------------------------------------------------------------
   Medido en las 74 misiones, abriendo todas las secciones: **2 314
   elementos que responden al clic y a los que el teclado no llegaba**.
   Clasifica, Identifica, Empareja, el memorama, las analogías. Un
   alumno con discapacidad motora podía leer la teoría entera y no
   hacer una sola actividad.

   ⚠️ Y el patrón que ya estaba en 18 misiones NO servía. centena.js
   pone role="button" y tabindex="0" en las fichas del banco, pero un
   <div> así **no responde a Enter ni a la barra espaciadora**: eso
   solo lo hace un <button> de verdad. Comprobado en el navegador: se
   enfoca, se ve enfocado, y al pulsar Enter no pasa nada; con un clic
   sí. Copiar ese patrón a las otras 56 misiones habría repartido 1 141
   paradas de tabulador que no llevan a ninguna parte — peor que no
   poder llegar, porque promete.

   Por eso esto vive AQUÍ y no copiado en las 74, como el andamio de
   los juegos 3D, el aparato de videos y la barra de secciones.

   Cuatro decisiones, y ninguna es de adorno:

   1. **La tecla se atiende una sola vez, en el documento.** Las
      actividades rehacen su HTML en cada pregunta; un oyente por
      elemento habría que volver a poner cada vez y se olvidaría en
      alguna. Se mira quién tiene el foco y se le da el clic.
   2. **La barra espaciadora se para** (preventDefault). Si no,
      además de contestar, desliza la página una pantalla entera y el
      alumno pierde de vista lo que estaba haciendo.
   3. ⚠️ **Una cuadrícula NO se convierte en cuarenta paradas.** La
      sopa de letras trae 144 celdas: tabular 144 veces para cruzar
      una actividad no es accesibilidad, es una trampa. Por encima de
      RACIMO_MAX hermanos iguales se deja fuera. La sopa, que además
      se juega arrastrando con eventos de puntero, tiene su propio
      diseño de teclado al final de este archivo: **una sola parada y
      las flechas por dentro**.
   4. **Lo que ya CONTIENE un control no se toca.** El velo que cierra
      el panel de logros lleva dentro sus botones: hacerlo parada de
      tabulador añade un salto que no hace falta y duplica el del
      botón que ya está dentro.
   ============================================================ */
(function () {
  'use strict';

  var NATIVOS = 'a[href],button,input,select,textarea,summary,[contenteditable="true"]';
  var ENFOCABLE = NATIVOS + ',[tabindex]:not([tabindex="-1"])';

  /* Por encima de esto ya no es una lista de opciones: es una
     cuadrícula. El memorama trae 16 fichas y el crucigrama 16 casillas
     —esas sí se tabulan, son las opciones del juego—; la sopa trae 144. */
  var RACIMO_MAX = 40;

  function respondeAlClic(el) {
    return typeof el.onclick === 'function' || el.hasAttribute('onclick');
  }

  function marcar(raiz) {
    if (!raiz) return 0;
    var todos = raiz.querySelectorAll('*');
    var sueltos = [];
    for (var i = 0; i < todos.length; i++) {
      var e = todos[i];
      if (!respondeAlClic(e)) continue;
      /* ⚠️ Se salta lo NATIVO, no lo enfocable. Es la distinción que
         costó la primera versión: las fichas de centena.js ya traen
         tabindex="0", así que «ya llega el teclado» las dejaba fuera —y
         son justo las 155 que se enfocan y al pulsar Enter no hacen
         nada—. Un <button> lo resuelve el navegador; un <div>, no,
         aunque tenga tabindex y role. */
      if (e.matches(NATIVOS)) continue;
      if (e.querySelector(ENFOCABLE)) continue;    // regla 4
      /* ⚠️ La sopa entera se deja fuera de aquí: tiene su propio
         teclado al final de este archivo (una parada y las flechas
         por dentro). Y hacía falta decirlo con el selector, no con
         RACIMO_MAX: los grupos se reconocen por la CLASE del padre y
         del elemento, así que en cuanto el alumno encontraba una
         palabra, sus celdas cambiaban de clase a «sopa-c hallada»,
         formaban un grupo de cuatro —por debajo del tope— y se
         volvían cuatro paradas de tabulador que no llevan a ninguna
         parte. Estaba pasando en las 8 misiones del maestro. */
      if (e.closest('#sopaGrid')) continue;
      sueltos.push(e);
    }

    /* Se agrupan por padre y clase para reconocer las cuadrículas. */
    var grupos = {};
    for (var j = 0; j < sueltos.length; j++) {
      var el = sueltos[j];
      var p = el.parentElement;
      var k = (p ? (p.id || String(p.className)) : '') + '|' + String(el.className);
      (grupos[k] = grupos[k] || []).push(el);
    }

    var puestos = 0;
    for (var k2 in grupos) {
      var v = grupos[k2];
      if (v.length > RACIMO_MAX) continue;         // regla 3
      for (var n = 0; n < v.length; n++) {
        if (!v[n].matches('[tabindex]')) v[n].setAttribute('tabindex', '0');
        if (!v[n].getAttribute('role')) v[n].setAttribute('role', 'button');
        v[n].classList.add('ta-tecla');
        puestos++;
      }
    }
    return puestos;
  }

  /* Regla 1 y 2: un solo oyente, y quien tiene el foco recibe el clic. */
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ' && ev.key !== 'Spacebar') return;
    if (ev.repeat || ev.ctrlKey || ev.metaKey || ev.altKey) return;
    var el = document.activeElement;
    if (!el || !el.classList || !el.classList.contains('ta-tecla')) return;
    ev.preventDefault();
    el.click();
  });

  var pendiente = false;
  function repasar() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(function () {
      pendiente = false;
      /* Solo la sección abierta: es la única que se ve y la única que
         el alumno puede tabular. Recorrer las veinte en cada pregunta
         costaría veinte veces más para el mismo resultado. */
      marcar(document.querySelector('.sec.active') || document.querySelector('main.main') || document.body);
    });
  }

  function montar() {
    if (document.body.dataset.taPuesto) return;
    document.body.dataset.taPuesto = '1';
    repasar();

    /* Las actividades rehacen su HTML en cada pregunta. Se mira SOLO el
       árbol, nunca los atributos: marcar() escribe tabindex y class, y
       con los atributos vigilados se llamaría a sí misma sin parar. */
    var main = document.querySelector('main.main') || document.body;
    new MutationObserver(repasar).observe(main, { childList: true, subtree: true });

    /* Cambiar de sección no toca el árbol de la nueva —ya estaba
       pintada—, así que el observador de arriba no se entera. Se mira
       la clase de CADA sección, y sin subtree.

       ⚠️ Sin subtree a propósito: las actividades encienden y apagan
       clases todo el rato (la sopa marca una celda en cada movimiento
       del dedo), y con el árbol vigilado se repasaría la sección
       entera en cada fotograma del arrastre, en un teléfono barato y
       justo mientras el alumno juega. */
    var secs = document.querySelectorAll('.sec');
    var obsSec = new MutationObserver(repasar);
    for (var i = 0; i < secs.length; i++) obsSec.observe(secs[i], { attributes: true, attributeFilter: ['class'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', montar);
  else montar();
})();

/* ============================================================
   M.E.T.A.S · La sopa de letras, sin el dedo
   ------------------------------------------------------------
   Era el único agujero que esta normativa dejaba escrito y sin
   tapar: «se juega arrastrando con eventos de puntero sobre la
   cuadrícula, así que necesita su propio diseño de teclado. Está
   dicho y sin hacer.» Son **65 misiones del alumno y 8 del maestro**
   —144 celdas cada una— donde el alumno que no puede arrastrar
   podía leer la teoría entera y no encontrar una sola palabra.

   Lo que hizo falta para poder hacerlo no fue inventar un juego
   nuevo: **el juego con teclas ya existía y nadie lo sabía**. El
   `pointerup` de las misiones del alumno tiene una rama para cuando
   el dedo NO se movió —toca una celda, toca la otra, y la palabra
   queda entre las dos—, y las 8 del maestro no tienen arrastre
   ninguno: son dos toques y ya. Así que el teclado no imita el
   arrastre, que es lo que no se puede hacer con teclas: **hace los
   mismos dos toques**, y por eso el alumno con teclado juega al
   mismo juego que su compañero, no a una versión de repuesto.

   Seis reglas, y ninguna es de adorno:

   1. ⚠️ **UNA parada de tabulador, no 144.** Es la regla 3 de arriba
      cumplida, no saltada: al tabulador se entra una vez y se sale
      una vez. Por dentro se anda con las flechas. Dar tabulador a
      las 144 celdas habría hecho falta pulsar Tab 144 veces para
      llegar al botón de abajo.
   2. **Las flechas NO deslizan la página** (`preventDefault`). Es la
      regla 2 de la barra espaciadora: el alumno está mirando la
      cuadrícula y una flecha que además mueve la pantalla le quita
      de la vista justo lo que está leyendo.
   3. ⚠️ **El cursor sobrevive al repintado.** Las dos variantes
      rehacen la cuadrícula entera —la del maestro, en CADA toque—.
      Sin esto, el foco se cae al `<body>` en cuanto marca la primera
      letra y el alumno se queda fuera de la sopa sin saber por qué:
      un teléfono trabado, otra vez.
   4. **El principio se puede soltar** (Esc, o Enter otra vez en la
      misma celda). Con el dedo se suelta tocando fuera; con el
      teclado, sin esto, una marca puesta por error no se quita.
   5. ⚠️ **El estado es UNO, el del juego.** El principio marcado se
      guarda en la variable de la propia misión (`sopaFirstClickCell`),
      no en una nuestra: si no, el que marca con el dedo y remata con
      la tecla —que es lo que hace cualquiera con un teclado y una
      pantalla táctil— acabaría con dos principios marcados y ninguna
      palabra encontrada.
   6. **Y se dice cómo se juega.** Es la regla de la barra de
      secciones: «se podía deslizar desde siempre; lo que faltaba era
      decirlo». La ayuda sale SOLO cuando la cuadrícula tiene el foco
      del teclado, para que no le robe pantalla al que juega con el
      dedo.

   ⚠️ **Y si la misión no trae con qué rematar la palabra, aquí no se
   pone teclado.** Es la lección de `centena.js`: una parada de
   tabulador que promete y no cumple es peor que no poder llegar.
   ============================================================ */
(function () {
  'use strict';

  var CELDAS = '#sopaGrid .sopa-cell, #sopaGrid .sopa-c';

  function grid() { return document.getElementById('sopaGrid'); }
  function celdas() { return Array.prototype.slice.call(document.querySelectorAll(CELDAS)); }

  /* Las dos variantes guardan la posición de formas distintas: la del
     alumno en data-row/data-col, la del maestro en el id («sc3-7»). Y
     si mañana entra una tercera, quedan las columnas contadas por la
     primera fila que cambia de altura. */
  function coord(cel, cols) {
    if (cel.dataset && cel.dataset.row !== undefined) return [+cel.dataset.row, +cel.dataset.col];
    var m = /^sc(\d+)-(\d+)$/.exec(cel.id || '');
    if (m) return [+m[1], +m[2]];
    var i = celdas().indexOf(cel);
    return [Math.floor(i / cols), i % cols];
  }

  function columnas(cs) {
    for (var i = 1; i < cs.length; i++) if (cs[i].offsetTop > cs[0].offsetTop) return i;
    return Math.round(Math.sqrt(cs.length)) || cs.length;
  }

  function celdaEn(f, c, cols, cs) {
    for (var i = 0; i < cs.length; i++) {
      var k = coord(cs[i], cols);
      if (k[0] === f && k[1] === c) return cs[i];
    }
    return null;
  }

  /* Regla 5: el principio marcado es el de la misión, no el nuestro.
     Son variables `let` de un <script> clásico, así que se ven desde
     aquí; en modo estricto, si no existieran, leerlas o escribirlas
     lanza y se cae a la copia local en vez de romper el juego. */
  var inicioLocal = null;
  function inicioLee() {
    try { return sopaFirstClickCell; } catch (_) { return inicioLocal; }   // eslint-disable-line
  }
  function inicioPon(v) {
    inicioLocal = v;
    try { sopaFirstClickCell = v; } catch (_) { /* la misión no la tiene */ }   // eslint-disable-line
  }
  function selPon(v) {
    try { sopaSelectedCells = v; return true; } catch (_) { return false; }   // eslint-disable-line
  }

  /* ¿Esta sopa se puede rematar con el teclado? Dos formas, y basta
     una: la del maestro responde al clic en la celda; la del alumno
     no, pero deja a mano las dos funciones que arman y comprueban la
     palabra. Si no hay ninguna, no se pone parada de tabulador. */
  function comoRemata(cel) {
    if (cel && (cel.hasAttribute('onclick') || typeof cel.onclick === 'function')) return 'clic';
    if (typeof window.getSopaPath === 'function' && typeof window.checkSopaSelection === 'function') return 'ruta';
    return null;
  }

  var cursor = null;      // [fila, columna] — sobrevive al repintado (regla 3)
  var teniaFoco = false;

  function ponCursor(cel, cs) {
    var antes = document.querySelector('#sopaGrid [tabindex="0"]');
    if (antes && antes !== cel) antes.removeAttribute('tabindex');
    if (!cel) return;
    cel.setAttribute('tabindex', '0');
    var cols = columnas(cs || celdas());
    var k = coord(cel, cols);
    cursor = k;
    /* Quien no ve la pantalla necesita saber DÓNDE está, no solo qué
       letra hay: sin la fila y la columna, una cuadrícula de 144
       letras leída en voz alta no se puede recorrer. */
    cel.setAttribute('aria-label', (cel.textContent || '').trim() + ', fila ' + (k[0] + 1) + ', columna ' + (k[1] + 1));
  }

  function repasarSopa() {
    var g = grid();
    if (!g) return;
    var cs = celdas();
    if (!cs.length) return;
    if (!comoRemata(cs[0])) return;                       // no se promete lo que no se cumple

    g.setAttribute('aria-label', 'Sopa de letras: flechas para moverte, Enter para marcar');
    ayuda(g);

    var cols = columnas(cs);
    var cel = cursor ? celdaEn(cursor[0], cursor[1], cols, cs) : null;
    if (!cel) cel = cs[0];
    if (!document.querySelector('#sopaGrid [tabindex="0"]')) ponCursor(cel, cs);
    /* Regla 3: si el foco estaba dentro y el repintado se lo llevó, se
       devuelve a la misma casilla donde estaba. */
    if (teniaFoco && !g.contains(document.activeElement)) { try { cel.focus(); } catch (_) {} }
  }

  /* Regla 6: la ayuda existe, y se ve solo con el foco del teclado. */
  function ayuda(g) {
    if (document.getElementById('sopa-ayuda-teclas')) return;
    var p = document.createElement('p');
    p.id = 'sopa-ayuda-teclas';
    p.className = 'sopa-teclas-ayuda';
    p.textContent = 'Con teclado: flechas para moverte · Enter marca el principio y el final de la palabra · Esc suelta';
    if (g.parentNode) g.parentNode.insertBefore(p, g.nextSibling);
  }

  function mover(df, dc) {
    var cs = celdas(); if (!cs.length) return;
    var cols = columnas(cs);
    var filas = Math.ceil(cs.length / cols);
    var k = cursor || [0, 0];
    var f = Math.min(filas - 1, Math.max(0, k[0] + df));
    var c = Math.min(cols - 1, Math.max(0, k[1] + dc));
    var cel = celdaEn(f, c, cols, cs);
    if (!cel) return;
    ponCursor(cel, cs);
    cel.focus();
  }

  function rematar(cel) {
    var modo = comoRemata(cel);
    if (modo === 'clic') { cel.click(); return; }          // el maestro: sopaToca() hace lo suyo

    var ini = inicioLee();
    if (!ini || !document.contains(ini)) {                  // primer toque: se marca el principio
      inicioPon(cel);
      cel.classList.add('sopa-start');
      return;
    }
    if (ini === cel) {                                      // regla 4: se suelta
      cel.classList.remove('sopa-start');
      inicioPon(null);
      return;
    }
    var cs = celdas(), cols = columnas(cs);
    var a = coord(ini, cols), b = coord(cel, cols);
    ini.classList.remove('sopa-start');
    inicioPon(null);
    var ruta = window.getSopaPath(a[0], a[1], b[0], b[1]) || [];
    var sel = [];
    for (var i = 0; i < ruta.length; i++) {
      var pc = celdaEn(ruta[i][0], ruta[i][1], cols, cs);
      if (pc) { pc.classList.add('sopa-sel'); sel.push(pc); }
    }
    if (!selPon(sel)) {                                     // sin dónde dejarlas no se puede comprobar
      for (var j = 0; j < sel.length; j++) sel[j].classList.remove('sopa-sel');
      return;
    }
    window.checkSopaSelection();
  }

  document.addEventListener('keydown', function (ev) {
    var g = grid();
    if (!g) return;
    var el = document.activeElement;
    if (!el || !g.contains(el) || !el.matches('.sopa-cell, .sopa-c')) return;
    if (ev.ctrlKey || ev.metaKey || ev.altKey) return;

    switch (ev.key) {
      case 'ArrowUp':    ev.preventDefault(); mover(-1, 0); return;   // regla 2
      case 'ArrowDown':  ev.preventDefault(); mover(1, 0); return;
      case 'ArrowLeft':  ev.preventDefault(); mover(0, -1); return;
      case 'ArrowRight': ev.preventDefault(); mover(0, 1); return;
      case 'Home':       ev.preventDefault(); mover(0, -999); return;
      case 'End':        ev.preventDefault(); mover(0, 999); return;
      case 'Escape': {
        /* ⚠️ Soltar es soltarlo TAMBIÉN en la misión, no solo aquí. En
           las 8 del maestro el principio lo guarda `sopaToca` en una
           variable suya que desde aquí no se ve; borrar la nuestra y
           dejar la suya puesta deja el juego a medio marcar y la
           palabra siguiente no la encuentra nunca. Tocar otra vez la
           misma celda es como se suelta con el dedo, y ahí sí se
           entera. */
        if (comoRemata(el) === 'clic') {
          var m = document.querySelector('#sopaGrid .sopa-c.sel, #sopaGrid .sopa-cell.sel');
          if (m) { ev.preventDefault(); m.click(); }
          return;
        }
        var ini = inicioLee();
        if (ini) { ini.classList.remove('sopa-start'); inicioPon(null); ev.preventDefault(); }
        return;
      }
      case 'Enter': case ' ': case 'Spacebar':
        if (ev.repeat) return;
        ev.preventDefault();
        rematar(el);
        return;
    }
  });

  document.addEventListener('focusin', function (ev) {
    var g = grid();
    teniaFoco = !!(g && g.contains(ev.target));
    if (teniaFoco && ev.target.matches('.sopa-cell, .sopa-c')) ponCursor(ev.target, celdas());
  });

  function montarSopa() {
    var g = grid();
    if (!g || g.dataset.skPuesto) return;
    g.dataset.skPuesto = '1';
    repasarSopa();
    /* Solo el árbol, nunca los atributos: el arrastre con el dedo
       enciende y apaga clases en cada fotograma, y con los atributos
       vigilados esto se llamaría a sí mismo mientras el alumno juega,
       en un teléfono barato. Es el mismo aviso del observador de
       secciones de arriba. */
    new MutationObserver(repasarSopa).observe(g, { childList: true });
  }

  /* La cuadrícula se pinta al abrir la sección, no al cargar la
     página: por eso se busca también cuando el documento cambia. */
  function vigilar() {
    montarSopa();
    var raiz = document.querySelector('main.main') || document.body;
    new MutationObserver(montarSopa).observe(raiz, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', vigilar);
  else vigilar();
})();

/* ============================================================
   CÓMO SE PONE EN UNA MISIÓN NUEVA — dos líneas:

     <link rel="stylesheet" href="../../css/teclado-actividades.css">
     <script src="../../js/teclado-actividades.js"></script>

   Lo comprueba _dev/verifica-teclado.js en TODAS.
   ============================================================ */
