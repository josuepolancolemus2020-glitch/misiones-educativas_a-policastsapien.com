/* ==========================================================================
   M.E.T.A.S. · Portal de Acceso y Catálogo de Colegios de Prebásica (Libro 1)
   Valida el acceso por centro educativo autorizado, prefijo 2027- o demo temporal
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

  /* Lista de revocación remota para bloquear centros educativos no autorizados */
  var COLEGIOS_REVOCADOS = [
    // Agregar nombres o claves a revocar remotamente
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

  function formatearNombreColegio(str) {
    if (!str) return '';
    var limpio = str.trim().replace(/\s+/g, ' ');
    if (!limpio) return '';

    var todoMinusculas = (limpio === limpio.toLowerCase());
    var todoMayusculas = (limpio === limpio.toUpperCase() && /[A-ZÁÉÍÓÚÑ]/.test(limpio));

    if (!todoMinusculas && !todoMayusculas) {
      return limpio;
    }

    var palabras = limpio.split(' ');
    var menores = ['de', 'del', 'la', 'las', 'el', 'los', 'en', 'y', 'e', 'o', 'u', 'al'];
    var formateadas = palabras.map(function (palabra, idx) {
      var low = palabra.toLowerCase();
      if (idx > 0 && menores.indexOf(low) !== -1) {
        return low;
      }
      return low.charAt(0).toUpperCase() + low.slice(1);
    });
    return formateadas.join(' ');
  }

  function estaColegioRevocado(nombre) {
    if (!nombre) return false;
    var revocados = window.COLEGIOS_REVOCADOS || COLEGIOS_REVOCADOS;
    if (!revocados || !Array.isArray(revocados) || revocados.length === 0) return false;
    var norm = normalizarTextoColegio(nombre);
    if (!norm) return false;
    for (var i = 0; i < revocados.length; i++) {
      var rNorm = normalizarTextoColegio(revocados[i]);
      if (rNorm && (norm === rNorm || norm.indexOf(rNorm) !== -1 || rNorm.indexOf(norm) !== -1)) {
        return true;
      }
    }
    return false;
  }

  function resolverNombreCatalogo(candidato) {
    var limpioCand = normalizarTextoColegio(candidato);
    if (!limpioCand) return null;
    for (var k = 0; k < CATALOGO_COLEGIOS_PREBASICA.length; k++) {
      var itemK = CATALOGO_COLEGIOS_PREBASICA[k];
      for (var l = 0; l < itemK.claves.length; l++) {
        var claveK = normalizarTextoColegio(itemK.claves[l]);
        if (limpioCand === claveK || limpioCand.indexOf(claveK) !== -1 || claveK.indexOf(limpioCand) !== -1) {
          return itemK.nombre;
        }
      }
    }
    return null;
  }

  function validarInstitucionPrebasica(input) {
    if (!input) return null;
    var raw = input.trim();
    if (!raw) return null;

    // 1. Detección de prefijo temporal DEMO (DEMO20-, DEMO7-, DEMO-, etc.)
    var regexDemo = /^DEMO(\d+)?\s*[-:]\s*(.+)$/i;
    var matchDemo = raw.match(regexDemo);
    if (matchDemo) {
      var dias = matchDemo[1] ? parseInt(matchDemo[1], 10) : 20;
      if (isNaN(dias) || dias <= 0) dias = 20;
      var candDemo = matchDemo[2].trim();
      if (candDemo.length >= 3) {
        if (estaColegioRevocado(candDemo)) return null;
        var nomDemoCat = resolverNombreCatalogo(candDemo);
        var nomDemoFinal = nomDemoCat || formatearNombreColegio(candDemo);
        return {
          nombre: nomDemoFinal,
          tipo: 'DEMO',
          expiraEn: Date.now() + (dias * 86400000),
          diasAsignados: dias
        };
      }
    }

    // 2. Detección de prefijo rápido oficial: 2027-, 2027:, METAS-, METAS:, METAS2027-
    var regexPrefijo = /^\s*(?:2027|metas|metas2027)\s*[-:]\s*(.+)$/i;
    var matchPrefijo = raw.match(regexPrefijo);
    if (matchPrefijo) {
      var candidato = matchPrefijo[1].trim();
      if (candidato.length >= 3) {
        if (estaColegioRevocado(candidato)) return null;
        var nomOficialCat = resolverNombreCatalogo(candidato);
        var nomOficialFinal = nomOficialCat || formatearNombreColegio(candidato);
        return {
          nombre: nomOficialFinal,
          tipo: 'OFICIAL'
        };
      }
    }

    var limpio = normalizarTextoColegio(raw);
    if (!limpio) return null;

    // 3. Búsqueda directa en el catálogo oficial (sin prefijo)
    for (var i = 0; i < CATALOGO_COLEGIOS_PREBASICA.length; i++) {
      var item = CATALOGO_COLEGIOS_PREBASICA[i];
      for (var j = 0; j < item.claves.length; j++) {
        var clave = normalizarTextoColegio(item.claves[j]);
        if (limpio === clave || limpio.indexOf(clave) !== -1 || clave.indexOf(limpio) !== -1) {
          if (estaColegioRevocado(item.nombre)) return null;
          return {
            nombre: item.nombre,
            tipo: 'OFICIAL'
          };
        }
      }
    }

    return null;
  }

  window.CATALOGO_COLEGIOS_PREBASICA = CATALOGO_COLEGIOS_PREBASICA;
  window.COLEGIOS_PREBASICA_AUTORIZADOS = CATALOGO_COLEGIOS_PREBASICA;
  window.COLEGIOS_REVOCADOS = COLEGIOS_REVOCADOS;
  window.normalizarTextoColegio = normalizarTextoColegio;
  window.formatearNombreColegio = formatearNombreColegio;
  window.estaColegioRevocado = estaColegioRevocado;
  window.validarInstitucionPrebasica = validarInstitucionPrebasica;
})();
