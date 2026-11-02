/* ==========================================================================
   M.E.T.A.S. · Portal de Acceso y Catálogo de Colegios de Prebásica (Libro 1)
   Valida el acceso por centro educativo autorizado o mediante prefijo de activación
   ========================================================================== */
(function () {
  'use strict';

  var CATALOGO_COLEGIOS_PREBASICA = [
    { nombre: 'CEPB María Consuelo', claves: ['mariaconsuelo', 'consuelo'] },
    { nombre: 'Coral Bilingual School', claves: ['coral', 'coralbilingual'] },
    { nombre: 'CEPB Rafael Pineda Ponce', claves: ['rafael', 'pineda', 'ponce', 'pinedaponce'] },
    { nombre: 'CEPB Nimia Baquedano', claves: ['nimia', 'baquedano', 'nimiabaquedano'] },
    { nombre: 'CEPB Dionisio de Herrera', claves: ['dionisio', 'herrera', 'dionisiodeherrera'] },
    { nombre: 'CEPB Amigo de los Niños', claves: ['amigo', 'amigodelosninos', 'amigosdelosninos'] },
    { nombre: 'CEBNG Blessing Bilingual School', claves: ['blessing', 'blessingbilingual'] },
    { nombre: 'CEBNG Simiente Santa', claves: ['simiente', 'simientesanta'] },
    { nombre: 'CEPB Marina Name', claves: ['marina', 'marinaname'] },
    { nombre: 'John Cook School', claves: ['johncook', 'john', 'cook', 'jhoncook'] },
    { nombre: 'Liceo Panamericano', claves: ['panamericano', 'liceopanamericano'] },
    { nombre: 'Edición Oficial M.E.T.A.S. · Evelyn S. Castellanos H.', claves: ['metas', 'evelyn', 'castellanos', 'demo'] }
  ];

  function normalizarTextoColegio(str) {
    if (!str) return '';
    return str
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar tildes y diacríticos
      .replace(/[^a-z0-9]/g, '');       // Eliminar espacios, guiones y caracteres especiales
  }

  function validarInstitucionPrebasica(input) {
    if (!input) return null;
    var raw = input.trim();
    if (!raw) return null;

    // Regla de activación para cualquier escuela nueva: prefijo METAS- o 2027-
    var matchPrefijo = raw.match(/^(metas|2027)[-\s:]+(.+)$/i);
    if (matchPrefijo && matchPrefijo[2].trim()) {
      return matchPrefijo[2].trim();
    }

    var limpio = normalizarTextoColegio(raw);
    if (!limpio) return null;

    // Búsqueda en el catálogo oficial
    for (var i = 0; i < CATALOGO_COLEGIOS_PREBASICA.length; i++) {
      var item = CATALOGO_COLEGIOS_PREBASICA[i];
      for (var j = 0; j < item.claves.length; j++) {
        var clave = normalizarTextoColegio(item.claves[j]);
        if (limpio === clave || limpio.indexOf(clave) !== -1 || clave.indexOf(limpio) !== -1) {
          return item.nombre;
        }
      }
    }

    return null;
  }

  window.CATALOGO_COLEGIOS_PREBASICA = CATALOGO_COLEGIOS_PREBASICA;
  window.normalizarTextoColegio = normalizarTextoColegio;
  window.validarInstitucionPrebasica = validarInstitucionPrebasica;
})();
