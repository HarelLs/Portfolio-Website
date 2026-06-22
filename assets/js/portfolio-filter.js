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
    var initialized   = false;

    function applyFilter(filter) {
      currentFilter = filter;

      var btnArray  = Array.from(buttons);
      var activeIdx = btnArray.findIndex(function (b) { return b.getAttribute("data-filter") === filter; });

      buttons.forEach(function (b, i) {
        var isActive = i === activeIdx;
        b.classList.toggle("is-active", isActive);
        // active = 4; inactive: closer to active tab = higher z (natural depth stacking)
        b.style.zIndex = isActive ? 4 : 3 - Math.abs(i - activeIdx);
      });

      groups.forEach(function (group) {
        group.hidden = group.getAttribute("data-category") !== filter;
      });
      if (folder && initialized) {
        folder.classList.remove("is-switching");
        void folder.offsetWidth;
        folder.classList.add("is-switching");
      }
    }

    // Lock min-height to the tallest tab so the background never resizes
    function lockHeight() {
      if (!inner) return;
      // On mobile the photos grid is static, so don't lock — let each tab size naturally
      if (window.innerWidth <= 720) {
        inner.style.minHeight = "";
        applyFilter(currentFilter);
        return;
      }
      var max = 0;
      inner.style.minHeight = "";
      buttons.forEach(function (btn) {
        if (btn.getAttribute("data-filter") === "photos") return; // absolute-positioned on desktop, skip
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
    initialized = true;

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
