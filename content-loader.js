/* content-loader.js — Peques Site Content Loader
   Fetches content.json and applies values to elements with data-pq attributes.
   Runs silently — any failure is non-breaking. */
(function () {
  'use strict';

  function deepGet(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return o != null ? o[k] : undefined;
    }, obj);
  }

  function applyContent(content) {
    var els = document.querySelectorAll('[data-pq]');
    for (var i = 0; i < els.length; i++) {
      var el  = els[i];
      var key = el.getAttribute('data-pq');
      var val = deepGet(content, key);
      if (val !== undefined && val !== null && val !== '') {
        el.textContent = val;
      }
    }
  }

  fetch('/content.json?v=' + Date.now())
    .then(function (r) { return r.json(); })
    .then(applyContent)
    .catch(function () { /* silently ignore */ });
})();
