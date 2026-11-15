/* ============================================================
   M.E.T.A.S · Lo pesado se pide cuando hace falta
   ------------------------------------------------------------
   La portada bajaba 39 guiones antes de pintar nada, y dos de ellos
   pesan más que casi todo lo demás junto sin que la mayoría de las
   visitas los use: los textos del Control de lectura (980 KB) y la
   biblioteca que saca la foto de las calificaciones (199 KB). El
   maestro que solo viene a pasar lista los pagaba igual, con la señal
   que hay.

   Aquí se piden la primera vez que alguien los necesita, y una sola
   vez: quien llega segundo recibe la misma promesa, no otra descarga.

   Las direcciones llevan su sello ?v= ESCRITO, igual que en las
   páginas: es lo que le dice al service worker que esa copia exacta
   vale para siempre, y el de html2canvas tiene que ser el mismo que
   usan las misiones para que el teléfono que ya la bajó en una no la
   vuelva a bajar aquí (lo vigila _dev/verifica-html2canvas.js).
   ============================================================ */
(function () {
  'use strict';

  var GUIONES = {
    html2canvas: 'js/html2canvas.min.js?v=462',
    lecturaTextos: 'js/data/lectura-textos.js?v=462'
  };
  var enCurso = {};

  function cargar(url) {
    if (enCurso[url]) return enCurso[url];
    enCurso[url] = new Promise(function (listo, fallo) {
      var s = document.createElement('script');
      s.src = url;
      s.onload = function () { listo(); };
      s.onerror = function () {
        /* Si falló por la señal, se olvida el intento: el siguiente toque
           del maestro tiene que poder probar otra vez, no heredar el fallo. */
        delete enCurso[url];
        s.remove();
        fallo(new Error('no cargó ' + url));
      };
      document.head.appendChild(s);
    });
    return enCurso[url];
  }

  /* La foto de las calificaciones. Devuelve la función html2canvas. */
  window.metasCargarHtml2canvas = function () {
    if (typeof window.html2canvas === 'function') return Promise.resolve(window.html2canvas);
    return cargar(GUIONES.html2canvas).then(function () { return window.html2canvas; });
  };

  /* Los textos del Control de lectura. LECTURA_TEXTOS es un `const` de
     guion clásico: no cuelga de window, así que no se devuelve nada y
     quien llama lo lee por su nombre cuando la promesa se cumple. */
  window.metasCargarLecturaTextos = function () {
    return cargar(GUIONES.lecturaTextos);
  };
})();
