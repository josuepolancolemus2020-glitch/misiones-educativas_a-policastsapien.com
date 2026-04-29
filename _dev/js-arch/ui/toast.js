'use strict';

window.META_UI = window.META_UI || {};

window.META_UI.toast = function toast(msg) {
  let el = document.getElementById('meta-toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'meta-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(el._t);
  el._t = setTimeout(function hide() { el.style.opacity = '0'; }, 2000);
};
