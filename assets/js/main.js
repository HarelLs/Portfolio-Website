/* =========================================================
   main.js — App bootstrap (runs after i18n/nav/filter are loaded)
   ========================================================= */

if (history.scrollRestoration) { history.scrollRestoration = "manual"; }
window.scrollTo(0, 0);

document.addEventListener("DOMContentLoaded", function () {
  window.App.nav.init();
  window.App.portfolioFilter.init();
  // Hebrew is the default language already rendered in the HTML,
  // so we don't re-apply translations on load — only on toggle.

  // Cards lift on press, return on release (music sticky notes + video cards)
  document.querySelectorAll(".portfolio-card, .video-card").forEach(function (card) {
    function lift()   { card.classList.add("is-lifted"); }
    function drop()   { card.classList.remove("is-lifted"); }
    card.addEventListener("mousedown",   lift);
    card.addEventListener("touchstart",  lift,  { passive: true });
    card.addEventListener("mouseup",     drop);
    card.addEventListener("mouseleave",  drop);
    card.addEventListener("touchend",    drop);
    card.addEventListener("touchcancel", drop);
  });

  // Clippy: hover GIF + dismiss button
  var clippy = document.getElementById("clippy");
  if (clippy) {
    clippy.addEventListener("mouseenter", function () {
      clippy.classList.add("show-a");
    });
    clippy.addEventListener("mouseleave", function () {
      clippy.classList.remove("show-a");
    });
    document.getElementById("clippy-close").addEventListener("click", function (e) {
      e.stopPropagation();
      clippy.style.display = "none";
    });
    clippy.addEventListener("click", function () {
      var contact = document.getElementById("contact");
      var mailBtn = document.getElementById("contact-mail-btn");
      contact.scrollIntoView({ behavior: "smooth" });
      if (mailBtn) {
        var observer = new IntersectionObserver(function (entries, obs) {
          if (entries[0].isIntersecting) {
            obs.disconnect();
            setTimeout(function () {
              mailBtn.classList.remove("shine-active");
              void mailBtn.offsetWidth;
              mailBtn.classList.add("shine-active");
              mailBtn.addEventListener("animationend", function () {
                mailBtn.classList.remove("shine-active");
              }, { once: true });
            }, 150);
          }
        }, { threshold: 0.6 });
        observer.observe(contact);
      }
    });
  }
});
