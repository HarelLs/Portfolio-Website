/* =========================================================
   portfolio-filter.js — Category filter (all / music / video / photos)
   ========================================================= */

(function () {
  "use strict";

  function init() {
    var buttons = document.querySelectorAll(".filter-btn");
    var groups = document.querySelectorAll(".portfolio-grid");
    if (!buttons.length || !groups.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");

        buttons.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");

        groups.forEach(function (group) {
          var category = group.getAttribute("data-category");
          var show = filter === "all" || filter === category;
          group.hidden = !show;
        });
      });
    });
  }

  window.App = window.App || {};
  window.App.portfolioFilter = { init: init };
})();
