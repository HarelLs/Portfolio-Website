/* =========================================================
   portfolio-filter.js — Category filter (all / music / video / photos)
   ========================================================= */

(function () {
  "use strict";

  function init() {
    var buttons = document.querySelectorAll(".filter-btn");
    var groups = document.querySelectorAll(".portfolio-grid");
    if (!buttons.length || !groups.length) return;

    function applyFilter(filter) {
      buttons.forEach(function (b) { b.classList.remove("is-active"); });
      document.querySelector('[data-filter="' + filter + '"]').classList.add("is-active");
      groups.forEach(function (group) {
        group.hidden = group.getAttribute("data-category") !== filter;
      });
    }

    var defaultBtn = document.querySelector(".filter-btn.is-active");
    applyFilter(defaultBtn ? defaultBtn.getAttribute("data-filter") : "music");

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyFilter(btn.getAttribute("data-filter"));
      });
    });
  }

  window.App = window.App || {};
  window.App.portfolioFilter = { init: init };
})();
