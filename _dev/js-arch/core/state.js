'use strict';

window.META_CORE = window.META_CORE || {};

(function registerStateModule() {
  const key = (window.META_CORE.CONSTANTS && window.META_CORE.CONSTANTS.STORAGE_KEY) || 'meta_v2';

  function blankState() {
    return { name: '', grade: '2y3ciclo', country: 'HN', xp: 0, visited: [], lastVisited: [] };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(key);
      if (raw) return Object.assign(blankState(), JSON.parse(raw));
    } catch (_) {}
    return blankState();
  }

  function saveState(state) {
    try { localStorage.setItem(key, JSON.stringify(state)); } catch (_) {}
  }

  window.META_CORE.STATE = { blankState, loadState, saveState };
})();
