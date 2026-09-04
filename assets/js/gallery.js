(function () {
  "use strict";

  // Photo grid slideshow: one slot fades out/in every 5s, random slot, no repeated photo
  (function () {
    var BASE = "assets/images/photos/";
    var PHOTOS = [];
    for (var n = 1; n <= 18; n++) {
      var id = (n < 10 ? "0" : "") + n;
      PHOTOS.push({ id: id, jpg: id + "-opt.jpg", webp: id + "-opt.webp", alt: "צילום עבודתי " + id });
    }

    var track = document.querySelector('.portfolio-grid[data-category="photos"] .gallery-track');
    if (!track) return;
    var slots = Array.from(track.querySelectorAll(".photo-slot"));
    if (!slots.length) return;

    // Which photo each slot currently holds — read off the markup, not assumed
    // to be slot order (the slots in index.html are not photos 1..N in sequence).
    var slotContents = slots.map(function (slot) {
      var img = slot.querySelector("img");
      var file = img ? img.getAttribute("src").split("/").pop() : "";
      for (var i = 0; i < PHOTOS.length; i++) {
        if (PHOTOS[i].jpg === file) return i;
      }
      return -1;
    });

    var lastSlotIdx = -1;
    var queue = [];

    function buildQueue() {
      var visible = {};
      slotContents.forEach(function(p) { visible[p] = true; });
      var candidates = [];
      for (var i = 0; i < PHOTOS.length; i++) {
        if (!visible[i]) candidates.push(i);
      }
      for (var j = candidates.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = candidates[j]; candidates[j] = candidates[k]; candidates[k] = tmp;
      }
      queue = candidates;
    }

    buildQueue();

    function swapSlot() {
      // Only cycle slots that are actually on screen — slots hidden by the
      // desktop/mobile breakpoints (and the whole tab when it's not active)
      // shouldn't burn a turn.
      var live = [];
      slots.forEach(function (slot, i) { if (slot.offsetParent !== null) live.push(i); });
      if (!live.length) return;

      var slotIdx;
      do { slotIdx = live[Math.floor(Math.random() * live.length)]; } while (slotIdx === lastSlotIdx && live.length > 1);
      lastSlotIdx = slotIdx;

      if (!queue.length) buildQueue();
      var photoIdx = queue.shift();
      var photo = PHOTOS[photoIdx];
      // Every photo is already on screen — nothing to swap in. Bail out before
      // touching opacity, or the slot would fade out and never come back.
      if (!photo) return;

      var slot = slots[slotIdx];

      slot.style.opacity = "0";
      setTimeout(function () {
        var img = slot.querySelector("img");
        var src = slot.querySelector("source");
        if (src) { src.srcset = BASE + photo.webp; }
        if (img) { img.src = BASE + photo.jpg; img.alt = photo.alt; }
        slotContents[slotIdx] = photoIdx;
        slot.style.opacity = "1";
      }, 650);
    }

    setInterval(swapSlot, 5000);
  })();
})();
