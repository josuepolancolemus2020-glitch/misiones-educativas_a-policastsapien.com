/* ══════════════════════════════════════════════════════════════════════════════
   M.E.T.A.S. — Catálogo de Misiones
   Exporta y sincroniza la lista completa de misiones del proyecto,
   incluyendo Educación Básica (1.° a 9.°) y la sección especial de Prebásica.
   ══════════════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var rutasRef = (typeof RUTAS !== 'undefined') ? RUTAS : {
    numero:   { nombre: 'Ruta del Número',   emoji: '🧭', color: 'mat'  },
    forma:    { nombre: 'Ruta de la Forma',  emoji: '📐', color: 'mat'  },
    palabra:  { nombre: 'Ruta de la Palabra', emoji: '✍️', color: 'esp'  },
    planeta:  { nombre: 'Ruta del Planeta',  emoji: '🌎', color: 'csoc' },
    cuerpo:   { nombre: 'Ruta del Cuerpo',   emoji: '🧠', color: 'cnat' },
    vida:     { nombre: 'Ruta de la Vida',   emoji: '🌱', color: 'cnat' },
    materia:  { nombre: 'Ruta de la Materia', emoji: '⚡', color: 'cnat' },
    tiempo:   { nombre: 'Ruta del Tiempo',   emoji: '🏛️', color: 'csoc' },
    codigo:   { nombre: 'Ruta del Código',   emoji: '💻', color: 'tec'  },
    robots:   { nombre: 'Ruta de los Robots', emoji: '🤖', color: 'tec'  },
    primeras: { nombre: 'Ruta de las Primeras Palabras', emoji: '🗣️', color: 'ing' },
    patria:   { nombre: 'Ruta de la Patria', emoji: '🇭🇳', color: 'civ' },
    meta:     { nombre: 'Ruta de la Meta', emoji: '🎯', color: 'rep' },
    maquina:  { nombre: 'Ruta de la Máquina que Aprende', emoji: '✨', color: 'ia' },
    raiz:     { nombre: 'Ruta de la Raíz', emoji: '🌳', color: 'filo' },
    manitas:  { nombre: 'Ruta de las Manitas', emoji: '🖐️', color: 'preb' }
  };

  var misionesRef = (typeof MISSIONS !== 'undefined') ? MISSIONS : [];

  var prebasicaMission = {
    id: 85,
    title: 'Prebásica (3.° Grado): Técnicas Gráficas y No Gráficas — Libro 1',
    subject: 'prebasica',
    color: 'preb',
    grade: 'Prebásica (3.° Grado)',
    cycle: 'prebasica',
    ruta: 'manitas',
    etapa: 1,
    xp: 40,
    icon: '🐝',
    pais: 'HN',
    url: 'misiones/prebasica-tecnicas-libro1/prebasica-libro1.html',
    badgeAdult: true,
    subtitle: 'Técnicas Gráficas, Trazos, Letras y Rompecabezas · Libro 1 (Evelyn S. Castellanos H.)'
  };

  if (misionesRef.length && !misionesRef.some(function (m) { return m.id === 85; })) {
    misionesRef.push(prebasicaMission);
  }

  var catalogo = {
    RUTAS: rutasRef,
    MISSIONS: misionesRef,
    PREBASICA: prebasicaMission
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = catalogo;
  }
  if (typeof global !== 'undefined') {
    global.CatalogoMisiones = catalogo;
  }
})(typeof window !== 'undefined' ? window : globalThis);
