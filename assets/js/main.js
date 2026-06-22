/* =========================================================
   main.js — App bootstrap (runs after i18n/nav/filter are loaded)
   ========================================================= */

if (history.scrollRestoration) { history.scrollRestoration = "manual"; }
window.scrollTo(0, 0);

var PHOTO_EXIF = {
  "01-opt": null,
  "02-opt": { camera: "Nikon D3400", lens: "18–55mm f/3.5–5.6", focal: "18mm (27mm)", aperture: "f/4.5", shutter: "1/320s", iso: "ISO 100", date: "Sep 2, 2025" },
  "03-opt": { camera: "Nikon D3400", lens: "18–55mm f/3.5–5.6", focal: "18mm (27mm)", aperture: "f/3.5", shutter: "1/1250s", iso: "ISO 100", date: "Sep 8, 2025" },
  "04-opt": { camera: "Nikon D3400", lens: "18–55mm f/3.5–5.6", focal: "18mm (27mm)", aperture: "f/3.5", shutter: "1/2000s", iso: "ISO 100", date: "Apr 22, 2023" },
  "05-opt": { camera: "Nikon D3400", lens: "18–55mm f/3.5–5.6", focal: "18mm (27mm)", aperture: "f/5.6", shutter: "1/400s",  iso: "ISO 400", date: "Sep 19, 2025" }
};

document.addEventListener("DOMContentLoaded", function () {
  window.App.nav.init();
  window.App.portfolioFilter.init();
  // Hebrew is the default language already rendered in the HTML,
  // so we don't re-apply translations on load — only on toggle.

  // ── XP windowed photo viewer ──
  var exifPropsWin = document.getElementById("exif-props-window");
  var exifList     = document.getElementById("exif-list");
  var exifValue    = document.getElementById("exif-value");
  var openWins     = {};   // key → DOM element
  var winZTop      = 2001;
  var cascadeCount = 0;

  var EXIF_FIELDS = [
    ["Camera", "camera"], ["Lens", "lens"], ["Focal Length", "focal"],
    ["Aperture", "aperture"], ["Shutter Speed", "shutter"], ["ISO", "iso"], ["Date", "date"]
  ];

  function loadPos(storageKey) {
    try { return JSON.parse(localStorage.getItem("xp-pos-" + storageKey)); } catch(e) { return null; }
  }
  function savePos(storageKey, win) {
    try { var r = win.getBoundingClientRect(); localStorage.setItem("xp-pos-" + storageKey, JSON.stringify({ left: r.left, top: r.top })); } catch(e) {}
  }

  function bringToFront(win) { win.style.zIndex = ++winZTop; }

  function makeWinDraggable(win, handle, storageKey) {
    var dragging = false, ox = 0, oy = 0;
    function start(cx, cy) {
      dragging = true;
      bringToFront(win);
      var r = win.getBoundingClientRect();
      ox = cx - r.left; oy = cy - r.top;
      document.body.style.cursor = "grabbing";
    }
    function move(cx, cy) {
      if (!dragging) return;
      win.style.left = Math.max(0, Math.min(cx - ox, window.innerWidth  - win.offsetWidth))  + "px";
      win.style.top  = Math.max(0, Math.min(cy - oy, window.innerHeight - win.offsetHeight)) + "px";
    }
    function end() {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor = "";
      if (storageKey) savePos(storageKey, win);
    }
    handle.addEventListener("mousedown",  function(e) { if (!e.target.closest("button")) { e.preventDefault(); start(e.clientX, e.clientY); } });
    handle.addEventListener("touchstart", function(e) { if (!e.target.closest("button")) start(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
    window.addEventListener("mousemove",  function(e) { move(e.clientX, e.clientY); });
    window.addEventListener("touchmove",  function(e) { if (dragging) { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY); } }, { passive: false });
    window.addEventListener("mouseup",    end);
    window.addEventListener("touchend",   end, { passive: true });
  }

  function updatePropsPanel(key) {
    var d = PHOTO_EXIF[key];
    exifList.innerHTML = ""; exifValue.textContent = "";
    if (d) {
      EXIF_FIELDS.forEach(function(pair, i) {
        var li = document.createElement("li");
        li.textContent = pair[0];
        li.addEventListener("click", function() {
          exifList.querySelectorAll("li").forEach(function(el) { el.classList.remove("is-selected"); });
          li.classList.add("is-selected");
          exifValue.textContent = d[pair[1]];
        });
        exifList.appendChild(li);
        if (i === 0) { li.classList.add("is-selected"); exifValue.textContent = d[pair[1]]; }
      });
    } else {
      exifList.innerHTML = '<li class="exif-no-data">No data</li>';
      exifValue.textContent = "No camera metadata available.";
    }
  }

  function openPhotoWindow(imgEl) {
    var key = ((imgEl.src.match(/(\d{2}-opt)/) || [])[1]) || imgEl.src;

    // if already open, bring to front and update props
    if (openWins[key]) {
      bringToFront(openWins[key]);
      updatePropsPanel(key);
      return;
    }

    // default cascade position
    var offset = (cascadeCount % 8) * 28;
    cascadeCount++;
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    var defPos = { left: Math.max(0, cx - 280 + offset), top: Math.max(0, cy - 210 + offset) };
    var pos = loadPos(key) || defPos;

    // build window element
    var win = document.createElement("div");
    win.className = "xp-window";
    win.style.width = "500px";
    win.style.height = "400px";
    win.style.left   = pos.left + "px";
    win.style.top    = pos.top  + "px";
    win.innerHTML =
      '<div class="xp-titlebar">' +
        '<div class="xp-title-icon"></div>' +
        '<span class="xp-title" data-i18n="gallery.winTitle">' + ((window.App.i18n && window.App.i18n.current === "he") ? "גלריה" : "Gallery") + '</span>' +
        '<div class="xp-title-btns">' +
          '<button class="xp-btn-help xp-prop-btn" aria-label="Properties">?</button>' +
          '<button class="xp-title-close" aria-label="Close">&#x2715;</button>' +
        '</div>' +
      '</div>' +
      '<div class="exif-photo-body">' +
        '<img src="' + imgEl.src + '" alt="' + (imgEl.alt || "") + '" />' +
      '</div>';

    document.body.appendChild(win);
    openWins[key] = win;
    bringToFront(win);

    makeWinDraggable(win, win.querySelector(".xp-titlebar"), key);

    win.querySelector(".xp-title-close").addEventListener("click", function() {
      savePos(key, win);
      win.remove();
      delete openWins[key];
      savePos("props", exifPropsWin);
      exifPropsWin.hidden = true;
    });

    win.querySelector(".xp-prop-btn").addEventListener("click", function(e) {
      e.stopPropagation();
      updatePropsPanel(key);
      if (exifPropsWin.hidden) {
        exifPropsWin.hidden = false;
        var pr = loadPos("props");
        if (!pr) {
          var wr = win.getBoundingClientRect();
          pr = { left: Math.min(wr.right + 8, window.innerWidth - 350), top: wr.top };
        }
        exifPropsWin.style.left = pr.left + "px";
        exifPropsWin.style.top  = pr.top  + "px";
      }
      bringToFront(exifPropsWin);
    });

    win.addEventListener("mousedown", function() { bringToFront(win); });
  }

  // props window drag + close
  makeWinDraggable(exifPropsWin, document.getElementById("exif-props-handle"), "props");
  document.getElementById("exif-close").addEventListener("click", function() {
    savePos("props", exifPropsWin);
    exifPropsWin.hidden = true;
  });
  document.getElementById("exif-ok").addEventListener("click", function() {
    savePos("props", exifPropsWin);
    exifPropsWin.hidden = true;
  });

  // ── ? help message box ──
  var helpMsg     = document.getElementById("xp-help-msg");
  var helpMsgText = helpMsg.querySelector(".xp-msgbox-text p");
  var helpPressed = false;

  var PETER_QUOTES = [
    "You know what really grinds my gears?",
    "Shut up, Meg.",
    "Holy crap!",
    "Roadhouse.",
    "It insists upon itself.",
    "Oh my God, who the hell cares?",
    "I'm not drunk, I'm just exhausted from being this awesome.",
    "Giggity giggity goo!",
    "This is worse than that time I met the ghost of Christmas future.",
    "I have an idea so smart my head would explode if I even began to know what I'm talking about.",
    "Cool Whip.",
    "Why you little—",
    "Lois, this is the worst thing that's ever happened to our family.",
    "Hehehehehe.",
    "If I'm not back in ten minutes... wait longer."
  ];
  var lastPeterIdx = -1;

  makeWinDraggable(helpMsg, helpMsg.querySelector(".xp-titlebar"), "help");

  document.querySelector(".xp-btn-help").addEventListener("click", function(e) {
    e.stopPropagation();
    if (!helpPressed) {
      helpPressed = true;
      helpMsgText.textContent = "What did you expect to happen?";
    } else {
      var idx;
      do { idx = Math.floor(Math.random() * PETER_QUOTES.length); } while (idx === lastPeterIdx);
      lastPeterIdx = idx;
      helpMsgText.textContent = "“" + PETER_QUOTES[idx] + "” — P.griffin";
    }
    var r = e.currentTarget.getBoundingClientRect();
    helpMsg.hidden = false;
    helpMsg.style.left = Math.min(r.left, window.innerWidth  - 310) + "px";
    helpMsg.style.top  = Math.min(r.bottom + 4, window.innerHeight - 160) + "px";
    bringToFront(helpMsg);
  });
  ["xp-help-close", "xp-help-ok"].forEach(function(id) {
    document.getElementById(id).addEventListener("click", function() { helpMsg.hidden = true; });
  });

  // wire up gallery photo clicks
  document.querySelectorAll('.portfolio-grid[data-category="photos"] .gallery-track picture').forEach(function(pic) {
    if (pic.querySelector("img[aria-hidden]")) return;
    pic.style.cursor = "pointer";
    pic.addEventListener("click", function() { openPhotoWindow(pic.querySelector("img")); });
  });

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
