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
      RACIMO_MAX hermanos iguales se deja fuera —y la sopa, además,
      se juega arrastrando con eventos de puntero, así que necesita su
      propio diseño de teclado; queda dicho y sin hacer.
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
   CÓMO SE PONE EN UNA MISIÓN NUEVA — dos líneas:

     <link rel="stylesheet" href="../../css/teclado-actividades.css">
     <script src="../../js/teclado-actividades.js"></script>

   Lo comprueba _dev/verifica-teclado.js en TODAS.
   ============================================================ */
