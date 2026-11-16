/* =====================================================================
   M.E.T.A.S — js/datos/senal.js · ¿hay señal?
   ---------------------------------------------------------------------
   Lo ÚNICO que la app dice de la conexión es un punto gris con la señal
   tachada mientras no hay señal, y nada cuando sí hay (03, 3.9 y
   09-INTERFAZ.md): ni «Guardado», ni «Guardando…», ni «Sincronizado».
   Aquí solo se lleva la cuenta; el punto lo dibuja la pantalla (parte 2
   del corte 1) con alCambiar.

   No basta con navigator.onLine: un teléfono con datos pero sin saldo dice
   que está en línea. Por eso cuenta también lo que le pasó a la última
   petición de la cola.
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};

  var hay = !(w.navigator && w.navigator.onLine === false);
  var oyentes = [];

  function cambiar(v) {
    if (v === hay) return;
    hay = v;
    oyentes.forEach(function (f) { try { f(hay); } catch (e) { /* un oyente roto no cambia la señal */ } });
  }

  w.addEventListener('online', function () { cambiar(true); });
  w.addEventListener('offline', function () { cambiar(false); });

  M._senal = {
    hay: function () { return hay; },
    hubo: function (ok) { cambiar(!!ok); },
    alCambiar: function (f) { oyentes.push(f); },
  };
})(window);
