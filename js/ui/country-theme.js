'use strict';

window.META_UI = window.META_UI || {};

window.META_UI.applyCountryTheme = function applyCountryTheme(theme) {
  if (!theme) return;
  const r = document.documentElement.style;
  r.setProperty('--brand', theme.brand || '');
  r.setProperty('--brand-mid', theme.brandMid || '');
  r.setProperty('--brand-light', theme.brandLight || '');
};
