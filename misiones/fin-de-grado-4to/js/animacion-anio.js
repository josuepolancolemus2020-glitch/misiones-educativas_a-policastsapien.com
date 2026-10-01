/* ============================================================
   Animación de la Prueba de Fin de Grado de 4º
   ------------------------------------------------------------
   La escena es la MISMA en los cuatro grados y vive en
   ../../js/escena-anio.js: el año de Kenia, mes a mes. Aquí solo se monta
   en el bloque de esta misión, con su grado y su id propio. Un id repetido
   entre misiones hace que la sonda del navegador las revise con el lector
   que no es.
   ============================================================ */
(function () {
  'use strict';
  if (!window.AnimacionMision || typeof window.EscenaAnio !== 'function' || !document.getElementById('amAnio4')) return;
  var escena = window.EscenaAnio({ grado: '4º' });
  if (escena) AnimacionMision.montar('#amAnio4', escena);
})();
