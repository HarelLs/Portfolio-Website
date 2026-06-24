(function () {
  "use strict";

  // Photo grid slideshow: one slot fades out/in every 5s, random slot, no repeated photo
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
      { jpg: "11-opt.jpg", webp: "11-opt.webp", alt: "צילום עבודתי 11" },
      { jpg: "12-opt.jpg", webp: "12-opt.webp", alt: "צילום עבודתי 12" },
      { jpg: "13-opt.jpg", webp: "13-opt.webp", alt: "צילום עבודתי 13" },
      { jpg: "14-opt.jpg", webp: "14-opt.webp", alt: "צילום עבודתי 14" }
    ];

    var track = document.querySelector('.portfolio-grid[data-category="photos"] .gallery-track');
    if (!track) return;
    var slots = Array.from(track.querySelectorAll(".photo-slot"));
    if (!slots.length) return;

    var slotContents = slots.map(function(_, i) { return i; }); // photo index currently in each slot
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
      var slotIdx;
      do { slotIdx = Math.floor(Math.random() * slots.length); } while (slotIdx === lastSlotIdx && slots.length > 1);
      lastSlotIdx = slotIdx;

      if (!queue.length) buildQueue();
      var photoIdx = queue.shift();

      var slot = slots[slotIdx];
      var photo = PHOTOS[photoIdx];

      slot.style.opacity = "0";
      setTimeout(function () {
        var img = slot.querySelector("img");
        var src = slot.querySelector("source");
        if (img) { img.src = BASE + photo.jpg; img.alt = photo.alt; }
        if (src) { src.srcset = BASE + photo.webp; }
        slotContents[slotIdx] = photoIdx;
        slot.style.opacity = "1";
      }, 650);
    }

    setInterval(swapSlot, 5000);
  })();
})();
