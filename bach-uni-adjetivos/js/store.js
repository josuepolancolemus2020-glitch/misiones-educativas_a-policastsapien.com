// js/store.js

/**
 * Gestor de Estado Centralizado (Central State Management)
 * Al no usar ES6 Modules para evitar problemas de CORS locales,
 * exponemos el Store al contexto global (window).
 */
window.AppStore = (function() {
  const SAVE_KEY = 'adjetivo_avanzado_uni';

  const state = {
    xp: 0,
    maxXP: 250,
    done: new Set(),
    evalAnsVisible: false,
    evalFormNum: 1,
    unlockedAch: [],
    darkMode: false,
    prevLevel: 0,
    xpTracker: {
      fc: new Set(), qz: new Set(), cls: new Set(), id: new Set(),
      cmp: new Set(), reto: new Set(), sopa: new Set(),
    }
  };

  function saveProgress() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        doneSections: Array.from(state.done), 
        unlockedAch: state.unlockedAch, 
        evalFormNum: state.evalFormNum
      }));
    } catch(e) {}
  }

  function loadProgress() {
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY));
      if(!s) return;
      if(s.doneSections && Array.isArray(s.doneSections)) {
        s.doneSections.forEach(id => {
          state.done.add(id);
          // La manipulación del DOM debería idealmente ocurrir en otro lugar mediante eventos,
          // pero lo mantenemos aquí por compatibilidad temporal con tu código legacy.
          const b = document.querySelector(`[data-s="${id}"]`);
          if(b) b.classList.add('done');
        });
      }
      // Aseguramos que solo cargue logros válidos (esta validación dependía de ACHIEVEMENTS)
      if(s.unlockedAch && Array.isArray(s.unlockedAch)) {
        state.unlockedAch = s.unlockedAch; 
      }
      if(s.evalFormNum) state.evalFormNum = s.evalFormNum;
    } catch(e) {}
  }

  function addXP(points) {
    state.xp = Math.max(0, Math.min(state.maxXP, state.xp + points));
    saveProgress();
    return state.xp;
  }

  // API pública
  return {
    state,
    saveProgress,
    loadProgress,
    addXP,
    SAVE_KEY
  };
})();
