/* =====================================================================
   M.E.T.A.S — js/datos/ids.js · el id de cada dato, una sola vez
   ---------------------------------------------------------------------
   Cada fila nace con su id en el aparato, en el momento en que el docente
   la anota (03, 3.1 regla 3). Con ese id la base sabe que un reenvío es
   el MISMO dato y no otro: por eso el id tiene que ser imposible de
   repetir entre aparatos.

   Nunca Math.random (regla 16 de CLAUDE.md): en teléfonos baratos repite,
   y dos pagos con el mismo id serían un pago perdido. Primero
   crypto.randomUUID; en navegadores que no lo tienen, un uuid v4 armado
   con crypto.getRandomValues.
   ===================================================================== */
(function (w) {
  'use strict';
  var M = w.MetasDatos = w.MetasDatos || {};

  function hex(b) {
    var s = '';
    for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? '0' : '') + b[i].toString(16);
    return s;
  }

  function nuevo() {
    var c = w.crypto;
    if (c && typeof c.randomUUID === 'function') return c.randomUUID();
    if (!c || typeof c.getRandomValues !== 'function') {
      // Sin azar de verdad no se inventa un id: es mejor que el aparato
      // diga que no puede anotar a que anote dos datos con el mismo id.
      throw new Error('este navegador no puede generar ids seguros');
    }
    var b = c.getRandomValues(new Uint8Array(16));
    b[6] = (b[6] & 0x0f) | 0x40;   // versión 4
    b[8] = (b[8] & 0x3f) | 0x80;   // variante RFC 4122
    var h = hex(b);
    return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
  }

  M.ids = { nuevo: nuevo };
})(window);
