(function () {
  "use strict";

  var wrapper = document.querySelector(".gallery-track-wrapper");
  var track   = document.querySelector(".gallery-track");
  if (!wrapper || !track) return;

  var speed       = 0.8;
  var isPaused    = false;
  var resumeTimer = null;
  var halfWidth   = 0;
  var offset      = 0;

  function normalize() {
    if (halfWidth <= 0) return;
    offset = offset % halfWidth;
    if (offset > 0) offset -= halfWidth;
  }

  function applyOffset() {
    track.style.transform = "translateX(" + offset + "px)";
  }

  function pauseBriefly(ms) {
    isPaused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () { isPaused = false; }, ms || 1500);
  }

  function tick() {
    if (!isPaused) {
      offset -= speed;
      normalize();
      applyOffset();
    }
    requestAnimationFrame(tick);
  }

  // Mouse wheel
  wrapper.addEventListener("wheel", function (e) {
    e.preventDefault();
    offset -= (e.deltaY !== 0 ? e.deltaY : e.deltaX);
    normalize();
    applyOffset();
    pauseBriefly(500);
  }, { passive: false });

  // Touch drag
  var touchStartX = 0;
  wrapper.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].clientX;
    isPaused = true;
    clearTimeout(resumeTimer);
  }, { passive: true });

  wrapper.addEventListener("touchmove", function (e) {
    var dx = e.touches[0].clientX - touchStartX;
    offset += dx;
    normalize();
    applyOffset();
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  wrapper.addEventListener("touchend", function () {
    pauseBriefly(800);
  }, { passive: true });

  // Click-drag
  var isDragging    = false;
  var dragStartX    = 0;
  var dragStartOffset = 0;

  wrapper.addEventListener("mousedown", function (e) {
    isDragging = true;
    dragStartX = e.pageX;
    dragStartOffset = offset;
    isPaused = true;
    clearTimeout(resumeTimer);
    wrapper.style.cursor = "grabbing";
  });

  window.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
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

  window.addEventListener("load", function () {
    halfWidth = track.scrollWidth / 2;
    offset = 0;
    requestAnimationFrame(tick);
  });
})();
