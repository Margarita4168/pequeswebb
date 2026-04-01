/* content-loader.js — Peques Site Content Loader v2
   Applies content.json to elements with data-pq attributes.
   Also handles image replacement (logo, setting photos).
   Silent — any failure is non-breaking. */
(function () {
  'use strict';

  function deepGet(obj, path) {
    return path.split('.').reduce(function (o, k) {
      return o != null ? o[k] : undefined;
    }, obj);
  }

  function applyContent(content) {
    // Text fields
    var els = document.querySelectorAll('[data-pq]');
    for (var i = 0; i < els.length; i++) {
      var el  = els[i];
      var key = el.getAttribute('data-pq');
      var val = deepGet(content, key);
      if (val !== undefined && val !== null && val !== '') {
        el.textContent = val;
      }
    }

    // Images
    if (content.images) {
      // Logo — replace all img tags that carry the Peques logo base64 src
      if (content.images.logo) {
        document.querySelectorAll('img[alt*="Peques"]').forEach(function(img) {
          img.src = content.images.logo;
        });
      }
      // PFB setting photo placeholder
      if (content.images.pfb_photo) {
        var pfbSlot = document.querySelector('.setting-photo.fb .setting-photo-inner');
        if (pfbSlot) {
          pfbSlot.innerHTML = '<img src="' + content.images.pfb_photo + '" alt="Peques Fulham Broadway" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />';
        }
      }
      // PPG setting photo placeholder
      if (content.images.ppg_photo) {
        var ppgSlot = document.querySelector('.setting-photo.pg .setting-photo-inner');
        if (ppgSlot) {
          ppgSlot.innerHTML = '<img src="' + content.images.ppg_photo + '" alt="Peques Parsons Green" style="width:100%;height:100%;object-fit:cover;border-radius:inherit;" />';
        }
      }
    }
  }

  fetch('/content.json?v=' + Date.now())
    .then(function (r) { return r.json(); })
    .then(applyContent)
    .catch(function () { /* silently ignore */ });
})();
