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

  // Clippy: hover GIF + dismiss + drag + click-to-contact
  var clippy = document.getElementById("clippy");
  if (clippy) {
    // anchor to left/top immediately so RTL↔LTR toggle doesn't shift position
    (function () {
      var rect = clippy.getBoundingClientRect();
      clippy.style.right  = "auto";
      clippy.style.bottom = "auto";
      clippy.style.left   = rect.left + "px";
      clippy.style.top    = rect.top  + "px";
    })();

    var isDragging  = false;
    var hasDragged  = false;
    var dragOffsetX = 0;
    var dragOffsetY = 0;

    function dragStart(clientX, clientY) {
      var rect = clippy.getBoundingClientRect();
      // switch from bottom/right to top/left so we can position freely
      clippy.style.bottom = "auto";
      clippy.style.right  = "auto";
      clippy.style.left   = rect.left + "px";
      clippy.style.top    = rect.top  + "px";
      clippy.style.animationPlayState = "paused";
      dragOffsetX = clientX - rect.left;
      dragOffsetY = clientY - rect.top;
      isDragging  = true;
      hasDragged  = false;
      document.body.style.cursor = "grabbing";
    }

    function dragMove(clientX, clientY) {
      if (!isDragging) return;
      hasDragged = true;
      var x = Math.max(0, Math.min(clientX - dragOffsetX, window.innerWidth  - clippy.offsetWidth));
      var y = Math.max(0, Math.min(clientY - dragOffsetY, window.innerHeight - clippy.offsetHeight));
      clippy.style.left = x + "px";
      clippy.style.top  = y + "px";
    }

    function dragEnd() {
      if (!isDragging) return;
      isDragging = false;
      clippy.style.animationPlayState = "";
      document.body.style.cursor = "";
    }

    // mouse
    clippy.addEventListener("mousedown", function (e) {
      if (e.target.closest(".clippy-close")) return;
      e.preventDefault();
      dragStart(e.clientX, e.clientY);
    });
    window.addEventListener("mousemove", function (e) { dragMove(e.clientX, e.clientY); });
    window.addEventListener("mouseup",   dragEnd);

    // touch
    clippy.addEventListener("touchstart", function (e) {
      if (e.target.closest(".clippy-close")) return;
      dragStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener("touchmove", function (e) {
      if (!isDragging) return;
      e.preventDefault();
      dragMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    window.addEventListener("touchend", dragEnd, { passive: true });

    // hover GIF
    clippy.addEventListener("mouseenter", function () { clippy.classList.add("show-a"); });
    clippy.addEventListener("mouseleave", function () { clippy.classList.remove("show-a"); });

    // close button
    document.getElementById("clippy-close").addEventListener("click", function (e) {
      e.stopPropagation();
      clippy.style.display = "none";
    });

    // click-to-contact (only if not a drag)
    clippy.addEventListener("click", function () {
      if (hasDragged) { hasDragged = false; return; }
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
