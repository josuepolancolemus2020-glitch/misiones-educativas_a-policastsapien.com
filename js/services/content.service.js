'use strict';

window.META_SERVICES = window.META_SERVICES || {};

(function registerContentService() {
  const cache = new Map();

  async function loadJSON(path) {
    if (cache.has(path)) return cache.get(path);
    const res = await fetch(path, { cache: 'no-cache' });
    if (!res.ok) throw new Error('No se pudo cargar contenido: ' + path);
    const data = await res.json();
    cache.set(path, data);
    return data;
  }

  window.META_SERVICES.content = {
    loadJSON,
    clearCache: function clearCache() { cache.clear(); }
  };
})();
