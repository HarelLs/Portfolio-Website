/* =========================================================
   main.js — App bootstrap (runs after i18n/nav/filter are loaded)
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  window.App.nav.init();
  window.App.portfolioFilter.init();
  // Hebrew is the default language already rendered in the HTML,
  // so we don't re-apply translations on load — only on toggle.
});
