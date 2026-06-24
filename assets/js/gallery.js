(function () {
  "use strict";

  function initGallery(wrapper) {
    var track = wrapper.querySelector(".gallery-track");
    if (!track) return;

    var speed       = 0.8;
    var isPaused    = false;
    var resumeTimer = null;
    var halfWidth   = 0;
    var offset      = 0;

    function measureHalfWidth() {
      var w = track.offsetWidth;
      if (w > wrapper.offsetWidth) halfWidth = w / 2;
    }

    function normalize() {
      if (halfWidth <= 0) return;
      offset = offset % halfWidth;
      if (offset > 0) offset -= halfWidth;
    }

    function applyOffset() {
      track.style.transform = "translateX(" + Math.round(offset) + "px)";
    }

    function pauseBriefly(ms) {
      isPaused = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(function () { isPaused = false; }, ms || 1500);
    }

    function tick() {
      if (halfWidth <= 0) measureHalfWidth();
      if (!isPaused && halfWidth > 0) {
        offset -= speed;
        normalize();
        applyOffset();
      }
      requestAnimationFrame(tick);
    }

    wrapper.addEventListener("wheel", function (e) {
      e.preventDefault();
      if (halfWidth <= 0) return;
      offset -= (e.deltaY !== 0 ? e.deltaY : e.deltaX);
      normalize();
      applyOffset();
      pauseBriefly(500);
    }, { passive: false });

    var touchStartX = 0;
    wrapper.addEventListener("touchstart", function (e) {
      if (halfWidth <= 0) return;
      touchStartX = e.touches[0].clientX;
      isPaused = true;
      clearTimeout(resumeTimer);
    }, { passive: true });

    wrapper.addEventListener("touchmove", function (e) {
      if (halfWidth <= 0) return;
      var dx = e.touches[0].clientX - touchStartX;
      offset += dx;
      normalize();
      applyOffset();
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener("touchend", function () {
      pauseBriefly(800);
    }, { passive: true });

    var isDragging      = false;
    var dragStartX      = 0;
    var dragStartOffset = 0;

    wrapper.addEventListener("mousedown", function (e) {
      if (halfWidth <= 0) return;
      isDragging = true;
      dragStartX = e.pageX;
      dragStartOffset = offset;
      isPaused = true;
      clearTimeout(resumeTimer);
      wrapper.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", function (e) {
      if (!isDragging || halfWidth <= 0) return;
      offset = dragStartOffset + (e.pageX - dragStartX);
      normalize();
      applyOffset();
    });

    window.addEventListener("mouseup", function () {
      if (!isDragging) return;
      isDragging = false;
      wrapper.style.cursor = "";
      pauseBriefly(1500);
    });

    requestAnimationFrame(tick);
  }

  document.querySelectorAll(".gallery-track-wrapper").forEach(function (wrapper) {
    // skip the portfolio photos grid — it uses a static collage, not a scroll track
    if (wrapper.closest('.portfolio-grid[data-category="photos"]')) return;
    initGallery(wrapper);
  });

  // Photo grid slideshow: show 5 at a time, cycle every 30s, wrap-around
  (function () {
    var track = document.querySelector('.portfolio-grid[data-category="photos"] .gallery-track');
    if (!track) return;
    var pics = Array.from(track.querySelectorAll("picture"));
    if (pics.length <= 5) return;

    var PAGE = 5;
    var start = 0;

    function showPage() {
      pics.forEach(function (p) { p.classList.remove("grid-last"); p.style.display = "none"; });
      for (var i = 0; i < PAGE; i++) {
        var p = pics[(start + i) % pics.length];
        p.style.display = "";
        if (i === PAGE - 1) p.classList.add("grid-last");
      }
    }

    showPage();
    setInterval(function () {
      start = (start + PAGE) % pics.length;
      showPage();
    }, 30000);
  })();
})();
