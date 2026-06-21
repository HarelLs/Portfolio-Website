(function () {
  "use strict";

  var wrapper = document.querySelector(".gallery-track-wrapper");
  var track   = document.querySelector(".gallery-track");
  if (!wrapper || !track) return;

  var speed       = 0.8;
  var isPaused    = false;
  var resumeTimer = null;
  var halfWidth   = 0;

  function normalize() {
    if (halfWidth <= 0) return;
    if (wrapper.scrollLeft >= halfWidth) wrapper.scrollLeft -= halfWidth;
    if (wrapper.scrollLeft < 0)          wrapper.scrollLeft += halfWidth;
  }

  function pauseBriefly(ms) {
    isPaused = true;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(function () { isPaused = false; }, ms || 1500);
  }

  function tick() {
    if (!isPaused) {
      wrapper.scrollLeft += speed;
      normalize();
    }
    requestAnimationFrame(tick);
  }

  // Mouse-wheel
  wrapper.addEventListener("wheel", function (e) {
    e.preventDefault();
    wrapper.scrollLeft += e.deltaY !== 0 ? e.deltaY : e.deltaX;
    normalize();
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
    var dx = touchStartX - e.touches[0].clientX;
    wrapper.scrollLeft += dx;
    normalize();
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  wrapper.addEventListener("touchend", function () {
    pauseBriefly(800);
  }, { passive: true });

  // Click-drag
  var isDragging    = false;
  var dragStartX    = 0;
  var dragStartScroll = 0;

  wrapper.addEventListener("mousedown", function (e) {
    isDragging = true;
    dragStartX = e.pageX;
    dragStartScroll = wrapper.scrollLeft;
    pauseBriefly(9999);
  });

  window.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    wrapper.scrollLeft = dragStartScroll - (e.pageX - dragStartX);
    normalize();
  });

  window.addEventListener("mouseup", function () {
    if (isDragging) { isDragging = false; pauseBriefly(1500); }
  });

  window.addEventListener("load", function () {
    halfWidth = track.scrollWidth / 2;
    wrapper.scrollLeft = 0;
    requestAnimationFrame(tick);
  });
})();
