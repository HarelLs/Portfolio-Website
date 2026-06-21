/* =========================================================
   portfolio-filter.js — Category filter (music / video)
   ========================================================= */

(function () {
  "use strict";

  function init() {
    var buttons = document.querySelectorAll(".filter-btn");
    var groups  = document.querySelectorAll(".portfolio-grid");
    var inner   = document.querySelector(".portfolio-inner");
    if (!buttons.length || !groups.length) return;

    var currentFilter = "music";

    function applyFilter(filter) {
      currentFilter = filter;
      buttons.forEach(function (b) { b.classList.remove("is-active"); });
      document.querySelector('[data-filter="' + filter + '"]').classList.add("is-active");
      groups.forEach(function (group) {
        group.hidden = group.getAttribute("data-category") !== filter;
      });
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
