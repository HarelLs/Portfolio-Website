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

  // attach mail icon sound effect
  var contactMailAudio = new Audio("assets/sound/YOUVE GOT MAIL.mp3");
  contactMailAudio.preload = "auto";
  contactMailAudio.volume = 0.03;
  var mailBtn = document.getElementById("contact-mail-btn");
  if (mailBtn) {
    mailBtn.addEventListener("click", function () {
      contactMailAudio.currentTime = 0;
      contactMailAudio.play().catch(function () {
        // autoplay-blocking not expected on direct click, but ignore if it happens.
      });
    });
  }

  // Hebrew is the default language already rendered in the HTML,
  // so we don't re-apply translations on load — only on toggle.

  // ── XP windowed photo viewer ──
  var exifPropsWin = document.getElementById("exif-props-window");
  var exifList     = document.getElementById("exif-list");
  var exifValue    = document.getElementById("exif-value");
  var openWins     = {};   // key → DOM element
  var winZTop      = 2001;
  var cascadeCount = 0;

  function getExifFields() {
    var t = window.App.i18n.t.bind(window.App.i18n);
    return [
      [t("xp.exif.camera"), "camera"], [t("xp.exif.lens"), "lens"], [t("xp.exif.focal"), "focal"],
      [t("xp.exif.aperture"), "aperture"], [t("xp.exif.shutter"), "shutter"], [t("xp.exif.iso"), "iso"], [t("xp.exif.date"), "date"]
    ];
  }

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

  var lastSelectedField = "Camera";

  function updatePropsPanel(key) {
    var d = PHOTO_EXIF[key];
    exifList.innerHTML = ""; exifValue.textContent = "";
    if (d) {
      getExifFields().forEach(function(pair) {
        var li = document.createElement("li");
        li.textContent = pair[0];
        li.addEventListener("click", function() {
          exifList.querySelectorAll("li").forEach(function(el) { el.classList.remove("is-selected"); });
          li.classList.add("is-selected");
          lastSelectedField = pair[0];
          exifValue.textContent = d[pair[1]];
        });
        exifList.appendChild(li);
        if (pair[0] === lastSelectedField) {
          li.classList.add("is-selected");
          exifValue.textContent = d[pair[1]] || "";
        }
      });
    } else {
      exifList.innerHTML = '<li class="exif-no-data">' + window.App.i18n.t("xp.noData") + '</li>';
      exifValue.textContent = window.App.i18n.t("xp.noMeta");
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

    // calculate window size from photo's natural aspect ratio
    var TITLEBAR_H = 34;
    var isMobile = window.innerWidth <= 600;
    var maxW = Math.min(isMobile ? window.innerWidth - 16 : 700, window.innerWidth - 40);
    var maxH = Math.min(isMobile ? Math.round(window.innerHeight * 0.45) : 560, window.innerHeight - 80) - TITLEBAR_H;
    var nw = imgEl.naturalWidth  || 0;
    var nh = imgEl.naturalHeight || 0;
    var winW, winH;
    if (nw && nh) {
      var ratio = nw / nh;
      if (ratio > maxW / maxH) { winW = maxW; winH = Math.round(maxW / ratio); }
      else                      { winH = maxH; winW = Math.round(maxH * ratio); }
    } else {
      winW = 500; winH = 400;
    }

    // build window element
    var win = document.createElement("div");
    win.className = "xp-window";
    win.style.width  = winW + "px";
    win.style.height = (winH + TITLEBAR_H) + "px";
    win.style.left   = pos.left + "px";
    win.style.top    = pos.top  + "px";
    win.innerHTML =
      '<div class="xp-titlebar">' +
        '<img class="xp-title-icon" src="assets/images/ui/gallery-icon.png" alt="" aria-hidden="true" style="width:22px;min-width:22px;object-fit:contain;position:relative;top:-1px;" />' +
        '<span class="xp-title" data-i18n="gallery.winTitle">' + (window.App.i18n ? window.App.i18n.t("gallery.winTitle") : "Gallery") + '</span>' +
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
        var savedProps = loadPos("props");
        if (savedProps) {
          exifPropsWin.style.left = savedProps.left + "px";
          exifPropsWin.style.top  = savedProps.top  + "px";
        } else {
          var wr = win.getBoundingClientRect();
          var pw = exifPropsWin.offsetWidth || 340;
          var prLeft = wr.right + 8;
          if (prLeft + pw > window.innerWidth) prLeft = Math.max(0, wr.left - pw - 8);
          exifPropsWin.style.left = Math.max(0, prLeft) + "px";
          exifPropsWin.style.top  = Math.max(0, wr.top) + "px";
        }
        exifPropsWin.hidden = false;
      }
      bringToFront(exifPropsWin);
    });

    win.addEventListener("mousedown", function() {
      bringToFront(win);
      updatePropsPanel(key);
    });
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
  var helpMsgIcon = helpMsg.querySelector(".xp-msgbox-icon");
  var helpPressed = false;

  var PETER_QUOTES = [
    { q: "You know what really grinds my gears?",                                                       d: "Jan 8, 2006"  },
    { q: "Shut up, Meg.",                                                                                d: "Jan 31, 1999" },
    { q: "Holy crap!",                                                                                   d: "Jan 31, 1999" },
    { q: "Roadhouse.",                                                                                   d: "May 16, 1999" },
    { q: "It insists upon itself.",                                                                      d: "Nov 6, 2005"  },
    { q: "Oh my God, who the hell cares?",                                                              d: "Mar 28, 2004" },
    { q: "I'm not drunk, I'm just exhausted from being this awesome.",                                  d: "Oct 3, 2010"  },
    { q: "Freakin' sweet!",                                                                              d: "Sep 23, 2000" },
    { q: "This is worse than that time I met the ghost of Christmas future.",                            d: "Dec 21, 2003" },
    { q: "I have an idea so smart my head would explode if I even began to know what I'm talking about.", d: "Apr 11, 1999" },
    { q: "Cool Whip.",                                                                                   d: "Nov 27, 2005" },
    { q: "What the deuce?",                                                                              d: "Feb 7, 1999"  },
    { q: "Lois, this is the worst thing that's ever happened to our family.",                           d: "Jan 31, 1999" },
    { q: "Hehehehehe.",                                                                                  d: "Jan 31, 1999" },
    { q: "If I'm not back in ten minutes... wait longer.",                                               d: "May 2, 1999"  }
  ];

  var ZH_PETER_QUOTES = [
    { q: "你知道什么让我的齿轮磨碎？",                                   d: "2006年1月8日"  },
    { q: "闭嘴，梅格。",                                                   d: "1999年1月31日" },
    { q: "神圣的大便！",                                                   d: "1999年1月31日" },
    { q: "路边的房子。",                                                   d: "1999年5月16日" },
    { q: "它坚持它自己。",                                                 d: "2005年11月6日" },
    { q: "哦我的上帝，谁他妈在乎？",                                       d: "2004年3月28日" },
    { q: "我没有喝醉，我只是因为这么厉害而累了。",                         d: "2010年10月3日" },
    { q: "他妈的甜！",                                                     d: "2000年9月23日" },
    { q: "这比我遇到圣诞节未来的鬼那次更糟糕。",                           d: "2003年12月21日" },
    { q: "我的头会爆炸如果我甚至开始知道我在说什么的话的一个很聪明的主意。", d: "1999年4月11日" },
    { q: "冷的鞭子。",                                                     d: "2005年11月27日" },
    { q: "什么两个？",                                                     d: "1999年2月7日"  },
    { q: "洛伊斯，这是发生在我们家的最糟糕的事情了。",                     d: "1999年1月31日" },
    { q: "呵呵呵呵呵。",                                                   d: "1999年1月31日" },
    { q: "如果我十分钟后没回来……再等久一点。",                             d: "1999年5月2日"  }
  ];
  var lastPeterIdx = -1;

  makeWinDraggable(helpMsg, helpMsg.querySelector(".xp-titlebar"), "help");

  function showHelpMessage(anchorEl) {
    var isZh = window.App.i18n.current === "zh";
    if (!helpPressed) {
      helpPressed = true;
      helpMsgIcon.innerHTML = "\u2139";
      helpMsgIcon.style.cssText = "";
      helpMsgText.textContent = window.App.i18n.t("xp.help.firstMsg");
    } else {
      var pool = isZh ? ZH_PETER_QUOTES : PETER_QUOTES;
      var idx;
      do { idx = Math.floor(Math.random() * pool.length); } while (idx === lastPeterIdx);
      lastPeterIdx = idx;
      var p = pool[idx];
      helpMsgText.textContent = "\u201c" + p.q + "\u201d - P. Griffin " + p.d;
      helpMsgIcon.innerHTML = '<img src="assets/images/ui/peter-griffin.jpg" alt="Peter Griffin" style="width:60px;height:60px;object-fit:cover;border-radius:4px;" />';
    }
    var r = anchorEl.getBoundingClientRect();
    helpMsg.hidden = false;
    helpMsg.style.left = Math.min(r.left, window.innerWidth  - 310) + "px";
    helpMsg.style.top  = Math.min(r.bottom + 4, window.innerHeight - 160) + "px";
    bringToFront(helpMsg);
  }

  document.getElementById("exif-props-help-btn").addEventListener("click", function(e) {
    e.stopPropagation();
    showHelpMessage(e.currentTarget);
  });
  ["xp-help-close", "xp-help-ok"].forEach(function(id) {
    document.getElementById(id).addEventListener("click", function() { helpMsg.hidden = true; });
  });

  // \u2500\u2500 music cover XP windows \u2500\u2500
  var musicCascade = 0;

  function openMusicWindow(imgEl) {
    var posKey = "music-" + imgEl.src.replace(/.*\//, "").replace(/\.[^.]+$/, "");

    if (openWins[posKey]) { bringToFront(openWins[posKey]); return; }

    var TITLEBAR_H = 34;
    var isMobile = window.innerWidth <= 600;
    var maxW = Math.min(isMobile ? window.innerWidth - 16 : 600, window.innerWidth - 40);
    var maxH = Math.min(isMobile ? Math.round(window.innerHeight * 0.45) : 500, window.innerHeight - 80) - TITLEBAR_H;
    var nw = imgEl.naturalWidth || 0, nh = imgEl.naturalHeight || 0;
    var winW, winH;
    if (nw && nh) {
      var ratio = nw / nh;
      if (ratio > maxW / maxH) { winW = maxW; winH = Math.round(maxW / ratio); }
      else                      { winH = maxH; winW = Math.round(maxH * ratio); }
    } else { winW = 400; winH = 400; }

    var offset = (musicCascade % 8) * 28; musicCascade++;
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    var defPos = { left: Math.max(0, cx - winW / 2 + offset), top: Math.max(0, cy - (winH + TITLEBAR_H) / 2 + offset) };
    var pos = loadPos(posKey) || defPos;

    var win = document.createElement("div");
    win.className = "xp-window";
    win.style.width  = winW + "px";
    win.style.height = (winH + TITLEBAR_H) + "px";
    win.style.left   = pos.left + "px";
    win.style.top    = pos.top  + "px";
    win.innerHTML =
      '<div class="xp-titlebar">' +
        '<img class="xp-title-icon" src="assets/images/ui/gallery-icon.png" alt="" aria-hidden="true" style="width:22px;min-width:22px;object-fit:contain;position:relative;top:-1px;" />' +
        '<span class="xp-title">' + (imgEl.alt || "Cover") + '</span>' +
        '<div class="xp-title-btns">' +
          '<button class="xp-music-help-btn xp-btn-help-inline" aria-label="Help">?</button>' +
          '<button class="xp-title-close" aria-label="Close">&#x2715;</button>' +
        '</div>' +
      '</div>' +
      '<div class="exif-photo-body">' +
        '<img src="' + imgEl.src + '" alt="' + (imgEl.alt || "") + '" />' +
      '</div>';

    document.body.appendChild(win);
    openWins[posKey] = win;
    bringToFront(win);
    makeWinDraggable(win, win.querySelector(".xp-titlebar"), posKey);

    win.querySelector(".xp-title-close").addEventListener("click", function() {
      savePos(posKey, win); win.remove(); delete openWins[posKey];
    });
    win.querySelector(".xp-music-help-btn").addEventListener("click", function(e) {
      e.stopPropagation(); showHelpMessage(e.currentTarget);
    });
    win.addEventListener("mousedown", function() { bringToFront(win); });
  }

  // wire up gallery photo clicks
  document.querySelectorAll('.portfolio-grid[data-category="photos"] .gallery-track picture').forEach(function(pic) {
    if (pic.querySelector("img[aria-hidden]")) return;
    pic.style.cursor = "pointer";
    pic.addEventListener("click", function() { openPhotoWindow(pic.querySelector("img")); });
  });

  // wire up music cover clicks
  document.querySelectorAll('.portfolio-grid[data-category="music"] .portfolio-card picture').forEach(function(pic) {
    pic.style.cursor = "pointer";
    pic.addEventListener("click", function(e) { e.stopPropagation(); openMusicWindow(pic.querySelector("img")); });
  });

  // ── music sticky notes: pick up & place anywhere on the page ──
  // Notes start in the folder grid; dragging lifts them to position:absolute on the body.
  // Positions are session-only — cleared on every load so notes always start in the folder.

  // Clear any stale note positions saved in localStorage from previous sessions
  try {
    Object.keys(localStorage).filter(function(k){ return k.startsWith("xp-pos-note-"); }).forEach(function(k){ localStorage.removeItem(k); });
  } catch(e) {}

  var NOTE_COLORS = [
    { hue: "0deg",   sat: 1    },
    { hue: "80deg",  sat: 0.9  },
    { hue: "290deg", sat: 0.85 }
  ];

  var reorderBtn = document.getElementById("reorder-notes-btn");

  document.querySelectorAll('.portfolio-grid[data-category="music"] .portfolio-card').forEach(function (card, idx) {
    var c = NOTE_COLORS[idx] || NOTE_COLORS[0];
    card.style.setProperty("--note-hue", c.hue);
    card.style.setProperty("--note-sat", c.sat);
    card.dataset.noteIndex = idx;

    function placeOnPage(pageLeft, pageTop, w) {
      if (card.dataset.placed === "1") return;
      card.dataset.placed = "1";
      card.style.width    = (w || card.offsetWidth) + "px";
      card.style.margin   = "0";
      card.style.position = "absolute";
      card.style.left     = pageLeft + "px";
      card.style.top      = pageTop  + "px";
      document.body.appendChild(card);
      bringToFront(card);
      if (reorderBtn) reorderBtn.classList.add("is-visible");
    }


    var dragging = false, started = false, sx = 0, sy = 0, ox = 0, oy = 0;

    function start(cx, cy) {
      dragging = true; started = false;
      sx = cx; sy = cy;
      var r = card.getBoundingClientRect();
      ox = cx - r.left; oy = cy - r.top;
    }

    function move(cx, cy) {
      if (!dragging) return;
      if (!started) {
        if (Math.abs(cx - sx) < 4 && Math.abs(cy - sy) < 4) return;
        // first real movement — lift out of grid into absolute page position
        started = true;
        var r = card.getBoundingClientRect();
        var pageL = r.left + window.scrollX;
        var pageT = r.top  + window.scrollY;
        placeOnPage(pageL, pageT, r.width);
        ox = cx - r.left; oy = cy - r.top;
        bringToFront(card);
        document.body.style.cursor = "grabbing";
      }
      var pageX = cx + window.scrollX - ox;
      var pageY = cy + window.scrollY - oy;
      var maxX = window.scrollX + window.innerWidth  - card.offsetWidth;
      var maxY = window.scrollY + window.innerHeight - card.offsetHeight;
      card.style.left = Math.max(0, Math.min(pageX, maxX)) + "px";
      card.style.top  = Math.max(0, Math.min(pageY, maxY)) + "px";
    }

    function end() {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor = "";
    }

    // grab anywhere on the note except cover photo / links / buttons
    card.addEventListener("mousedown", function (e) {
      if (e.target.closest("a, button, picture, img")) return;
      start(e.clientX, e.clientY);
    });
    card.addEventListener("touchstart", function (e) {
      if (e.target.closest("a, button, picture, img")) return;
      start(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    window.addEventListener("mousemove", function (e) { move(e.clientX, e.clientY); });
    window.addEventListener("touchmove", function (e) {
      if (!dragging) return;
      if (started) e.preventDefault();
      move(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    window.addEventListener("mouseup",    end);
    window.addEventListener("touchend",   end, { passive: true });
    window.addEventListener("touchcancel", end, { passive: true });
  });

  if (reorderBtn) {
    reorderBtn.addEventListener("click", function () {
      function resetCards(selector, gridSelector, indexAttr) {
        var grid = document.querySelector(gridSelector);
        if (!grid) return;
        var cards = Array.from(document.querySelectorAll(selector));
        cards.sort(function (a, b) { return parseInt(a.dataset[indexAttr]) - parseInt(b.dataset[indexAttr]); });
        cards.forEach(function (card) {
          if (card.dataset.placed === "1") {
            card.dataset.placed = "0";
            card.style.width    = "";
            card.style.margin   = "";
            card.style.position = "";
            card.style.left     = "";
            card.style.top      = "";
            card.style.zIndex   = "";
          }
          grid.appendChild(card);
        });
      }
      resetCards('.portfolio-card[data-note-index]',  '.portfolio-grid[data-category="music"]', "noteIndex");
      resetCards('.video-card[data-video-index]',     '.portfolio-grid[data-category="video"]',  "videoIndex");
      document.querySelectorAll(".custom-note").forEach(function (n) { n.remove(); });
      reorderBtn.classList.remove("is-visible");
    });
  }

  // ── custom sticky notes (add-note button) ──
  var customNoteCount = 0;
  var CUSTOM_NOTE_HUES = ["55deg", "180deg", "290deg", "20deg", "140deg", "250deg", "320deg"];
  var draggingCustomNote = null, dnOX = 0, dnOY = 0;

  window.addEventListener("mousemove", function (e) {
    if (!draggingCustomNote) return;
    draggingCustomNote.style.left = Math.max(0, e.clientX + window.scrollX - dnOX) + "px";
    draggingCustomNote.style.top  = Math.max(0, e.clientY + window.scrollY - dnOY) + "px";
  });
  window.addEventListener("mouseup", function () {
    if (draggingCustomNote) { draggingCustomNote = null; document.body.style.cursor = ""; }
  });
  window.addEventListener("touchmove", function (e) {
    if (!draggingCustomNote) return;
    e.preventDefault();
    var t = e.touches[0];
    draggingCustomNote.style.left = Math.max(0, t.clientX + window.scrollX - dnOX) + "px";
    draggingCustomNote.style.top  = Math.max(0, t.clientY + window.scrollY - dnOY) + "px";
  }, { passive: false });
  window.addEventListener("touchend", function () { draggingCustomNote = null; }, { passive: true });

  function createNote() {
    var note = document.createElement("div");
    note.className = "custom-note";
    note.style.setProperty("--note-hue", CUSTOM_NOTE_HUES[customNoteCount % CUSTOM_NOTE_HUES.length]);
    note.style.setProperty("--note-sat", "0.85");
    var offset = (customNoteCount % 8) * 30;
    note.style.left = (window.scrollX + window.innerWidth  / 2 - 100 + offset) + "px";
    note.style.top  = (window.scrollY + window.innerHeight / 2 - 80  + offset) + "px";
    customNoteCount++;

    note.innerHTML =
      '<div class="custom-note-header">' +
        '<button class="custom-note-close" aria-label="מחק פתק">×</button>' +
      '</div>' +
      '<textarea class="custom-note-body" placeholder="…"></textarea>';

    document.body.appendChild(note);
    bringToFront(note);

    note.querySelector(".custom-note-close").addEventListener("click", function () { note.remove(); });

    note.addEventListener("mousedown", function () { bringToFront(note); });

    note.querySelector(".custom-note-header").addEventListener("mousedown", function (e) {
      if (e.target.closest("button")) return;
      var r = note.getBoundingClientRect();
      dnOX = e.clientX - r.left;
      dnOY = e.clientY - r.top;
      draggingCustomNote = note;
      bringToFront(note);
      document.body.style.cursor = "grabbing";
    });

    note.querySelector(".custom-note-header").addEventListener("touchstart", function (e) {
      if (e.target.closest("button")) return;
      var t = e.touches[0], r = note.getBoundingClientRect();
      dnOX = t.clientX - r.left;
      dnOY = t.clientY - r.top;
      draggingCustomNote = note;
      bringToFront(note);
    }, { passive: true });
  }

  var notepadFloat = document.getElementById("notepad-float");
  if (notepadFloat) {
    notepadFloat.addEventListener("click", function () { createNote(); });
    notepadFloat.addEventListener("touchend", function (e) {
      e.preventDefault();
      createNote();
    }, { passive: false });
  }

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

  // ── video cards: same drag-to-anywhere behaviour as music cards ──
  var VIDEO_COLORS = [
    { hue: "0deg",   sat: 1    },
    { hue: "155deg", sat: 0.75 },
    { hue: "310deg", sat: 0.8  }
  ];

  document.querySelectorAll('.portfolio-grid[data-category="video"] .video-card').forEach(function (card, idx) {
    var c = VIDEO_COLORS[idx] || VIDEO_COLORS[0];
    card.style.setProperty("--note-hue", c.hue);
    card.style.setProperty("--note-sat", c.sat);
    card.dataset.videoIndex = idx;

    function placeOnPage(pageLeft, pageTop, w) {
      if (card.dataset.placed === "1") return;
      card.dataset.placed = "1";
      card.style.width    = (w || card.offsetWidth) + "px";
      card.style.margin   = "0";
      card.style.position = "absolute";
      card.style.left     = pageLeft + "px";
      card.style.top      = pageTop  + "px";
      document.body.appendChild(card);
      bringToFront(card);
      if (reorderBtn) reorderBtn.classList.add("is-visible");
    }

    var dragging = false, started = false, sx = 0, sy = 0, ox = 0, oy = 0;

    function start(cx, cy) {
      dragging = true; started = false;
      sx = cx; sy = cy;
      var r = card.getBoundingClientRect();
      ox = cx - r.left; oy = cy - r.top;
    }

    function move(cx, cy) {
      if (!dragging) return;
      if (!started) {
        if (Math.abs(cx - sx) < 4 && Math.abs(cy - sy) < 4) return;
        started = true;
        var r = card.getBoundingClientRect();
        var pageL = r.left + window.scrollX;
        var pageT = r.top  + window.scrollY;
        placeOnPage(pageL, pageT, r.width);
        ox = cx - r.left; oy = cy - r.top;
        bringToFront(card);
        document.body.style.cursor = "grabbing";
      }
      var pageX = cx + window.scrollX - ox;
      var pageY = cy + window.scrollY - oy;
      var maxX = window.scrollX + window.innerWidth  - card.offsetWidth;
      var maxY = window.scrollY + window.innerHeight - card.offsetHeight;
      card.style.left = Math.max(0, Math.min(pageX, maxX)) + "px";
      card.style.top  = Math.max(0, Math.min(pageY, maxY)) + "px";
    }

    function end() {
      if (!dragging) return;
      dragging = false;
      document.body.style.cursor = "";
    }

    card.addEventListener("mousedown", function (e) {
      if (e.target.closest("iframe, a, button")) return;
      start(e.clientX, e.clientY);
    });
    var label = card.querySelector("p");
    if (label) {
      label.addEventListener("touchstart", function (e) {
        start(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
    }
    window.addEventListener("mousemove", function (e) { move(e.clientX, e.clientY); });
    window.addEventListener("touchmove", function (e) {
      if (!dragging) return;
      if (started) e.preventDefault();
      move(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: false });
    window.addEventListener("mouseup",    end);
    window.addEventListener("touchend",   end, { passive: true });
    window.addEventListener("touchcancel", end, { passive: true });
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
    window.addEventListener("touchend",    dragEnd, { passive: true });
    window.addEventListener("touchcancel", dragEnd, { passive: true });

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

  // ── Service card credits windows ──
  var MIXING_CREDITS = [
    { project: "אני לא נושם (אלבום)", artist: "Harel Lesnick",                      role: "Mixer & Engineer", year: "2024", tracks: ["אינטרו", "אני לא נושם", "דפוק", "חד וחלק", "״אני חושב שהצלחתי לברוח״", "משבר כתיבה", "אף אחד", "מתי כבר יגיע תורי", "הגענו עד לכאן", "סיכום"] },
    { project: "IZ 514",              artist: "aRL",                               role: "Mixer & Producer", year: "2025", tracks: ["2Fr33", "RUN1TUP", "EARS", "NO TIME"] },
    { project: "300 ק״מ",             artist: "Harel Lesnick",                      role: "Mixer & Engineer", year: "2024", tracks: [] },
    { project: "עוד רגע עוד",         artist: "Harel Lesnick feat. Where's The Plot", role: "Mixer & Engineer", year: "2024", tracks: [] },
    { project: "לחצים / קצת אור",     artist: "Harel Lesnick",                      role: "Mixer & Engineer", year: "2024", tracks: [] },
    { project: "I'M BACK",            artist: "aRL",                               role: "Mixer & Producer", year: "2024", tracks: [] },
    { project: "Froth",               artist: "Harel Lesnick",                      role: "Mixer & Engineer", year: "2025", tracks: [] },
    { project: "Pondering",           artist: "Harel Lesnick",                      role: "Mixer & Engineer", year: "2025", tracks: [] },
    { project: "אף אחד דמו 6.7.23",  artist: "Harel Lesnick",                      role: "Mixer & Engineer", year: "2025", tracks: [] }
  ];

  var MASTERING_CREDITS = [
    { project: "אני לא נושם (אלבום)", artist: "Harel Lesnick",                      role: "Mastering Engineer", year: "2024", tracks: ["אינטרו", "אני לא נושם", "דפוק", "חד וחלק", "״אני חושב שהצלחתי לברוח״", "משבר כתיבה", "אף אחד", "מתי כבר יגיע תורי", "הגענו עד לכאן", "סיכום"] },
    { project: "IZ 514",              artist: "aRL",                               role: "Mastering Engineer", year: "2025", tracks: ["2Fr33", "RUN1TUP", "EARS", "NO TIME"] },
    { project: "300 ק״מ",             artist: "Harel Lesnick",                      role: "Mastering Engineer", year: "2024", tracks: [] },
    { project: "עוד רגע עוד",         artist: "Harel Lesnick feat. Where's The Plot", role: "Mastering Engineer", year: "2024", tracks: [] },
    { project: "לחצים / קצת אור",     artist: "Harel Lesnick",                      role: "Mastering Engineer", year: "2024", tracks: [] },
    { project: "I'M BACK",            artist: "aRL",                               role: "Mastering Engineer", year: "2024", tracks: [] },
    { project: "Froth",               artist: "Harel Lesnick",                      role: "Mastering Engineer", year: "2025", tracks: [] },
    { project: "Pondering",           artist: "Harel Lesnick",                      role: "Mastering Engineer", year: "2025", tracks: [] },
    { project: "אף אחד דמו 6.7.23",  artist: "Harel Lesnick",                      role: "Mastering Engineer", year: "2025", tracks: [] }
  ];

  var ZH_MIXING_CREDITS = [
    { project: "我不呼吸（专辑）", artist: "哈雷尔·莱斯尼克",                         role: "Mixer & Engineer", year: "2024", tracks: ["介绍", "我不呼吸", "坏掉的", "尖锐和光滑", "\"我以为我成功逃跑了\"", "写作危机", "没有人", "我的轮到什么时候", "我们到达了这里", "总结"] },
    { project: "IZ 514",          artist: "aRL",                                      role: "Mixer & Producer", year: "2025", tracks: ["2Fr33", "RUN1TUP", "EARS", "NO TIME"] },
    { project: "300 公里",         artist: "哈雷尔·莱斯尼克",                         role: "Mixer & Engineer", year: "2024", tracks: [] },
    { project: "再一刻再",         artist: "哈雷尔·莱斯尼克 feat. 情节在哪里",        role: "Mixer & Engineer", year: "2024", tracks: [] },
    { project: "压力 / 一点光",    artist: "哈雷尔·莱斯尼克",                         role: "Mixer & Engineer", year: "2024", tracks: [] },
    { project: "我回来了",         artist: "aRL",                                      role: "Mixer & Producer", year: "2024", tracks: [] },
    { project: "泡沫",             artist: "哈雷尔·莱斯尼克",                         role: "Mixer & Engineer", year: "2025", tracks: [] },
    { project: "沉思",             artist: "哈雷尔·莱斯尼克",                         role: "Mixer & Engineer", year: "2025", tracks: [] },
    { project: "没有人 演示 6.7.23", artist: "哈雷尔·莱斯尼克",                       role: "Mixer & Engineer", year: "2025", tracks: [] }
  ];

  var ZH_MASTERING_CREDITS = [
    { project: "我不呼吸（专辑）", artist: "哈雷尔·莱斯尼克",                         role: "Mastering Engineer", year: "2024", tracks: ["介绍", "我不呼吸", "坏掉的", "尖锐和光滑", "\"我以为我成功逃跑了\"", "写作危机", "没有人", "我的轮到什么时候", "我们到达了这里", "总结"] },
    { project: "IZ 514",          artist: "aRL",                                      role: "Mastering Engineer", year: "2025", tracks: ["2Fr33", "RUN1TUP", "EARS", "NO TIME"] },
    { project: "300 公里",         artist: "哈雷尔·莱斯尼克",                         role: "Mastering Engineer", year: "2024", tracks: [] },
    { project: "再一刻再",         artist: "哈雷尔·莱斯尼克 feat. 情节在哪里",        role: "Mastering Engineer", year: "2024", tracks: [] },
    { project: "压力 / 一点光",    artist: "哈雷尔·莱斯尼克",                         role: "Mastering Engineer", year: "2024", tracks: [] },
    { project: "我回来了",         artist: "aRL",                                      role: "Mastering Engineer", year: "2024", tracks: [] },
    { project: "泡沫",             artist: "哈雷尔·莱斯尼克",                         role: "Mastering Engineer", year: "2025", tracks: [] },
    { project: "沉思",             artist: "哈雷尔·莱斯尼克",                         role: "Mastering Engineer", year: "2025", tracks: [] },
    { project: "没有人 演示 6.7.23", artist: "哈雷尔·莱斯尼克",                       role: "Mastering Engineer", year: "2025", tracks: [] }
  ];

  var mixingWin    = document.getElementById("mixing-credits-window");
  var masteringWin = document.getElementById("mastering-credits-window");

  var ROLE_ZH = {
    "Mixer & Engineer":    "混音师兼工程师",
    "Mastering Engineer":  "母带工程师",
    "Mixer & Producer":    "混音师兼制作人"
  };

  function renderCreditDetails(el, item) {
    var role = (window.App.i18n.current === "zh" && ROLE_ZH[item.role]) ? ROLE_ZH[item.role] : item.role;
    var html = '<div style="font-weight:700;margin-bottom:3px;">' + item.artist + '</div>' +
               '<div style="margin-bottom:4px;">' + role + ', ' + item.year + '</div>';
    if (item.tracks && item.tracks.length) {
      html += '<ul style="margin:0;padding-left:14px;">';
      item.tracks.forEach(function(t) { html += '<li>' + t + '</li>'; });
      html += '</ul>';
    }
    el.innerHTML = html;
  }

  function populateCreditsList(listEl, valueEl, credits) {
    listEl.innerHTML = ""; valueEl.innerHTML = "";
    credits.forEach(function(item, i) {
      var li = document.createElement("li");
      li.textContent = item.project;
      li.addEventListener("click", function() {
        listEl.querySelectorAll("li").forEach(function(el) { el.classList.remove("is-selected"); });
        li.classList.add("is-selected");
        renderCreditDetails(valueEl, item);
      });
      listEl.appendChild(li);
      if (i === 0) { li.classList.add("is-selected"); renderCreditDetails(valueEl, item); }
    });
  }

  function openCreditsWindow(type) {
    var win     = type === "mixing" ? mixingWin : masteringWin;
    var isZh    = window.App.i18n.current === "zh";
    var credits = type === "mixing"
      ? (isZh ? ZH_MIXING_CREDITS : MIXING_CREDITS)
      : (isZh ? ZH_MASTERING_CREDITS : MASTERING_CREDITS);
    var listEl  = document.getElementById(type + "-list");
    var valueEl = document.getElementById(type + "-value");
    populateCreditsList(listEl, valueEl, credits);
    if (win.hidden) {
      var posKey = type + "-credits";
      var saved  = loadPos(posKey);
      if (saved) {
        win.style.left = saved.left + "px";
        win.style.top  = saved.top  + "px";
      } else {
        win.style.left = Math.max(0, window.innerWidth  / 2 - 170) + "px";
        win.style.top  = Math.max(0, window.innerHeight / 2 - 180) + "px";
      }
      win.hidden = false;
    }
    bringToFront(win);
  }

  makeWinDraggable(mixingWin,    document.getElementById("mixing-credits-handle"),    "mixing-credits");
  makeWinDraggable(masteringWin, document.getElementById("mastering-credits-handle"), "mastering-credits");

  document.getElementById("mixing-close").addEventListener("click",    function() { mixingWin.hidden    = true; });
  document.getElementById("mixing-ok").addEventListener("click",       function() { mixingWin.hidden    = true; });
  document.getElementById("mastering-close").addEventListener("click", function() { masteringWin.hidden = true; });
  document.getElementById("mastering-ok").addEventListener("click",    function() { masteringWin.hidden = true; });

  document.querySelectorAll(".xp-credits-help-btn").forEach(function(btn) {
    btn.addEventListener("click", function(e) { e.stopPropagation(); showHelpMessage(e.currentTarget); });
  });

  // ── Service card click: arrow swipe + text fade then action ──
  function actOnCard(card, action) {
    card.classList.add("text-out");
    setTimeout(function() {
      action();
      card.classList.remove("text-out");
    }, 280);
  }

  document.querySelectorAll(".service-card").forEach(function(card) {
    var h3     = card.querySelector("h3");
    var keyEl  = h3 && (h3.querySelector("[data-i18n]") || h3);
    var key    = keyEl ? keyEl.getAttribute("data-i18n") : "";
    card.addEventListener("click", function() {
      card.classList.remove("arrow-swipe");
      void card.offsetWidth;
      card.classList.add("arrow-swipe");
      setTimeout(function() { card.classList.remove("arrow-swipe"); }, 600);
      if (key === "services.mix.title") {
        actOnCard(card, function() { openCreditsWindow("mixing"); });
      } else if (key === "services.master.title") {
        actOnCard(card, function() { openCreditsWindow("mastering"); });
      } else if (key === "services.sounddesign.title") {
        actOnCard(card, function() {
          var videoBtn = document.querySelector('.filter-btn[data-filter="video"]');
          if (videoBtn) videoBtn.click();
          var portfolio = document.getElementById("portfolio");
          if (portfolio) portfolio.scrollIntoView({ behavior: "smooth" });
        });
      }
    });
  });
});
