(function () {
  "use strict";

  // Only run on screens where background-attachment: fixed is disabled
  if (!window.matchMedia("(max-width: 1024px)").matches) return;

  var root = document.documentElement;
  var sections = [
    { selector: ".hero-services-wrapper", prop: "--hero-bg-y" },
    { selector: ".portfolio",             prop: "--port-bg-y"  }
  ];
  var els = sections.map(function (s) {
    return { el: document.querySelector(s.selector), prop: s.prop };
  });

  function update() {
    var sy  = window.scrollY;
    var vh  = window.innerHeight;
    els.forEach(function (s) {
      if (!s.el) return;
      var top    = s.el.offsetTop;
      var height = s.el.offsetHeight;
      // progress: 0 when element enters viewport bottom → 1 when it leaves viewport top
      var progress = (sy - top + vh) / (height + vh);
      progress = Math.max(0, Math.min(1, progress));
      root.style.setProperty(s.prop, (progress * 100) + "%");
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update,  { passive: true });
  update();
})();
