/* =========================================================
   nav.js — Mobile hamburger menu + language switch button
   ========================================================= */

(function () {
  "use strict";

  function initHamburger() {
    var btn = document.getElementById("hamburger");
    var nav = document.getElementById("main-nav");
    if (!btn || !nav) return;

    btn.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });

    // Close menu after a nav link is clicked (mobile UX)
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initLangSwitch() {
    var btn = document.getElementById("lang-switch");
    if (!btn) return;

    var spamCount = 0;
    var spamTimer = null;
    var SPAM_THRESHOLD = 10;

    btn.addEventListener("click", function () {
      if (window.App.i18n.current === "zh") {
        spamCount = 0;
        window.App.i18n.setLanguage("he");
        return;
      }

      spamCount++;
      clearTimeout(spamTimer);
      spamTimer = setTimeout(function () { spamCount = 0; }, 2000);

      if (spamCount >= SPAM_THRESHOLD) {
        spamCount = 0;
        clearTimeout(spamTimer);
        window.App.i18n.setLanguage("zh");
        btn.style.visibility = "hidden";
        setTimeout(function () { btn.style.visibility = ""; }, 2000);
        return;
      }

      window.App.i18n.toggle();
    });
  }

  window.App = window.App || {};
  window.App.nav = { init: function () { initHamburger(); initLangSwitch(); } };
})();
