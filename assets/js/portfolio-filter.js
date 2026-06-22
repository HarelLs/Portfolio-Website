/* =========================================================
   portfolio-filter.js — Category filter (music / video)
   ========================================================= */

(function () {
  "use strict";

  function init() {
    var buttons = document.querySelectorAll(".filter-btn");
    var groups  = document.querySelectorAll(".portfolio-grid");
    var inner   = document.querySelector(".portfolio-inner");
    var folder  = document.querySelector(".portfolio-folder");
    if (!buttons.length || !groups.length) return;

    var currentFilter = "music";

    function applyFilter(filter) {
      currentFilter = filter;
      buttons.forEach(function (b) { b.classList.remove("is-active"); });
      document.querySelector('[data-filter="' + filter + '"]').classList.add("is-active");
      groups.forEach(function (group) {
        group.hidden = group.getAttribute("data-category") !== filter;
      });
      // flip toward the clicked tab's visual position
      if (folder) {
        folder.classList.remove("is-switching-left", "is-switching-right");
        void folder.offsetWidth;
        var idx = Array.from(buttons).findIndex(function (b) {
          return b.getAttribute("data-filter") === filter;
        });
        var isRTL = document.body.dir === "rtl";
        // LTR: tab 0 is left → flip left, tab 1 is right → flip right
        // RTL: mirrored — tab 0 is right → flip right, tab 1 is left → flip left
        var flipRight = isRTL ? idx === 0 : idx === 1;
        folder.classList.add(flipRight ? "is-switching-right" : "is-switching-left");
      }
    }

    // Lock min-height to the tallest tab so the background never resizes
    function lockHeight() {
      if (!inner) return;
      var max = 0;
      inner.style.minHeight = "";
      buttons.forEach(function (btn) {
        groups.forEach(function (g) {
          g.hidden = g.getAttribute("data-category") !== btn.getAttribute("data-filter");
        });
        max = Math.max(max, inner.offsetHeight);
      });
      inner.style.minHeight = max + "px";
      applyFilter(currentFilter);
    }

    var defaultBtn = document.querySelector(".filter-btn.is-active");
    applyFilter(defaultBtn ? defaultBtn.getAttribute("data-filter") : "music");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(btn.getAttribute("data-filter"));
      });
    });

    // Run after images have had a chance to load
    window.addEventListener("load", lockHeight);
  }

  window.App = window.App || {};
  window.App.portfolioFilter = { init: init };
})();
