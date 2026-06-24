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

  // Photo grid slideshow: one slot fades out/in every 5s, cycling all 11 photos
  (function () {
    var BASE = "assets/images/photos/";
    var PHOTOS = [
      { jpg: "01-opt.jpg", webp: "01-opt.webp", alt: "צילום עבודתי 01" },
      { jpg: "02-opt.jpg", webp: "02-opt.webp", alt: "צילום עבודתי 02" },
      { jpg: "03-opt.jpg", webp: "03-opt.webp", alt: "צילום עבודתי 03" },
      { jpg: "04-opt.jpg", webp: "04-opt.webp", alt: "צילום עבודתי 04" },
      { jpg: "05-opt.jpg", webp: "05-opt.webp", alt: "צילום עבודתי 05" },
      { jpg: "06-opt.jpg", webp: "06-opt.webp", alt: "צילום עבודתי 06" },
      { jpg: "07-opt.jpg", webp: "07-opt.webp", alt: "צילום עבודתי 07" },
      { jpg: "08-opt.jpg", webp: "08-opt.webp", alt: "צילום עבודתי 08" },
      { jpg: "09-opt.jpg", webp: "09-opt.webp", alt: "צילום עבודתי 09" },
      { jpg: "10-opt.jpg", webp: "10-opt.webp", alt: "צילום עבודתי 10" },
      { jpg: "11-opt.jpg", webp: "11-opt.webp", alt: "צילום עבודתי 11" }
    ];

    var track = document.querySelector('.portfolio-grid[data-category="photos"] .gallery-track');
    if (!track) return;
    var slots = Array.from(track.querySelectorAll(".photo-slot"));
    if (!slots.length) return;

    var nextOut = 0;          // which slot gets replaced next (round-robin)
    var nextIn = slots.length; // index into PHOTOS of next photo to show

    function swapSlot() {
      var slot = slots[nextOut];
      var photo = PHOTOS[nextIn % PHOTOS.length];

      slot.style.opacity = "0";
      setTimeout(function () {
        var img = slot.querySelector("img");
        var src = slot.querySelector("source");
        if (img) { img.src = BASE + photo.jpg; img.alt = photo.alt; }
        if (src) { src.srcset = BASE + photo.webp; }
        slot.style.opacity = "1";
      }, 650);

      nextOut = (nextOut + 1) % slots.length;
      nextIn++;
    }

    setInterval(swapSlot, 5000);
  })();
})();
