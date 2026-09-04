# Project Context — Harel Lesnick Portfolio Landing Page

This file exists so a Claude Code session opened in this folder has full context without re-deriving it. Read this first.

## What this is
Final-project landing page for a college course ("מטלת סיום קורס" — KIC Ed "בניית דף נחיתה" assignment) and a real, working personal site for Harel Lesnick. The assignment requires going through a structured workflow (characterization → prompt → mockup → build → publish) and documenting the process. Harel's secondary goal: actually learn how this kind of site gets built with AI tools.

## Who Harel is / site content decisions
- Sound engineer, photographer, and video editor. Site is under his own name (no business name).
- Services offered: Mixing, Mastering, Sound design for video games.
- Target audience: potential clients (artists, game devs, content creators).
- Primary CTA: book a call/meeting via email (WhatsApp was removed — no phone number on site).
- Bilingual: Hebrew (RTL, default) + English (LTR), toggle switches both language and `dir`.
- Easter egg: spamming the language toggle 10+ times within 2 seconds switches the whole site to badly machine-translated Mandarin (zh mode). One click in zh mode returns to Hebrew. Commit messages hide this feature intentionally.
- Currently producing/mixing a full album for an artist as his college final project — "Current Project" section.
- Music links (DistroKid hyperfollow):
  - https://distrokid.com/hyperfollow/harellesnick/----2 (single)
  - https://distrokid.com/hyperfollow/harellesnick/-300 (single)
  - https://distrokid.com/hyperfollow/harellesnick/---3 (solo album)
  - https://distrokid.com/hyperfollow/arl51/iz-514 (electronic album, alias ARL51)
- Video: YouTube https://www.youtube.com/@Harel_Lesnick/videos; embedded: i_YLgCMyeo4 (first music video), FI3RQ0E-SA8 and RDNfOr1hkk0 (course final projects).
- Photo gallery: real photos are in place (assets/images/photos/01–14.webp/jpg).

## Design direction
- Dark mode, bold pixel typography — direction from roykafri.com and metroboominshop.com.
- Windows XP aesthetic for interactive elements (property windows, sticky notes, Clippy).
- Portfolio section with category filter (Music / Video / Photos).
- Warm, personal tone — direction from venustheory.com.

## Tech stack
Plain vanilla HTML/CSS/JS, no build step. Originally planned as Astro + Tailwind, but built in a sandboxed environment without npm access. Staying vanilla — site is live.

## Current file structure
```
.
├── index.html                        # full semantic markup, all sections
├── assets/
│   ├── css/                          # variables / base / layout / components / responsive
│   ├── js/
│   │   ├── i18n.js                   # he / en / zh dicts + setLanguage / toggle / t() helper
│   │   ├── nav.js                    # lang-switch spam detection + hamburger
│   │   ├── main.js                   # XP windows, sticky notes, Clippy/Peter Griffin, EXIF, credits
│   │   ├── portfolio-filter.js       # category filter tabs
│   │   ├── gallery.js                # photo gallery drag scroll
│   │   ├── lightbox.js               # photo lightbox
│   │   └── parallax.js               # background parallax
│   ├── fonts/
│   │   ├── UpheavalPro.ttf           # --font-base (Hebrew/default); narrowed via scaleX in he mode
│   │   ├── pixeloid.sans-bold.ttf    # --font-en (English + XP title bars); also loaded as "…Fit" @font-face (size-adjust:80%) for en body
│   │   ├── fusion-pixel-zh.woff2     # --font-zh (zh Easter egg, Simplified-Chinese pixel; SIL OFL 1.1)
│   │   └── fusion-pixel-OFL.txt      # license for the above
│   ├── audio/
│   │   └── YOUVE GOT MAIL.mp3
│   └── images/
│       ├── favicon.png
│       ├── current_project.jpg
│       ├── backgrounds/              # bg_intro + bg_port (jpg/webp/mobile + animated gif)
│       ├── music/                    # album art (jpg + webp)
│       ├── photos/                   # NN-opt real photos (jpg + webp); markup seeds 14 slots with 01–10 + 15–18; desktop shows the first 9 in a 3×3 collage, mobile shows all 14 in 2 cols; the slideshow cycles the full 01–18 pool through the visible slots
│       ├── logos/                    # Spotify / Apple Music / YouTube SVGs
│       └── ui/                       # XP icons, note textures, Clippy GIFs, Peter Griffin
├── docs/                             # course assignment docs + dev notes (not served)
│   ├── site-brief.md
│   ├── dev-notes.md
│   ├── analytics-plan.md             # spec for a future click-analytics feature — NOT built
│   ├── presentation.pptx
│   └── assignment.pdf
├── README.md
└── CLAUDE.md
```

## Key interactive features

### i18n / language system (i18n.js)
- Three dicts: `he` (default, RTL), `en` (LTR), `zh` (Easter egg — intentionally bad Mandarin).
- `applyTranslations(lang)` walks `[data-i18n]` and `[data-i18n-attr]` DOM attributes.
- `window.App.i18n.t(key)` — runtime key lookup for JS-generated content.
- Spam Easter egg: 10 clicks within 2s on the lang button → zh mode; button hides for 2s.
- XP window chrome (title bars, tabs, labels, OK buttons) stays English in he mode — only zh gets Chinese.
- `gallery.winTitle`: "גלריה" in he, "Gallery" in en, "图库" in zh.

### XP-style windows (main.js)
- Mixing credits window, Mastering credits window, Photo Properties (EXIF) window — all draggable.
- Credits data: `MIXING_CREDITS` and `MASTERING_CREDITS` arrays (project / track / artist / role).
- zh parallel arrays: `ZH_MIXING_CREDITS`, `ZH_MASTERING_CREDITS` with translated names/roles.
- EXIF field labels come from `getExifFields()` which uses `t()` so they translate in zh.
- `ROLE_ZH` map translates role strings in zh mode.
- Help msgbox: Peter Griffin image + random quote from `PETER_QUOTES` (or `ZH_PETER_QUOTES` in zh).

### Fonts in XP windows
- Window body content (tabs, labels, credits rows, buttons): Tahoma ("MS Sans Serif" fallback) — set on `.xp-dialog`.
- Window title bar text (`.xp-title`): `var(--font-en)` = Pixeloid Sans Bold — explicitly overrides Tahoma inheritance. Kept at original size (NOT the size-adjusted "Fit" face).

### Language fonts (base.css / variables.css)
- Body font per `html[lang]`: he → UpheavalPro; en → "Pixeloid Sans Bold Fit" (same TTF, `size-adjust:80%` so English matches Hebrew's visual size); zh → `--font-zh` (Fusion Pixel).
- Hero inherits the body font (the old Noto Sans Hebrew Google Fonts load was removed).
- Hebrew is horizontally compressed with `transform: scaleX(0.8)` on text-only blocks in he mode — keeps the font, just narrows it.
- zh mode re-points hardcoded-font components (xp titles/dialogs, cmd output, notepad label, clippy speech) at `--font-zh`.

### Clippy CTA (main.js)
- Clippy floats over the page (fixed position, draggable). Docked to the right edge (top ~42% desktop, ~55% mobile) and smaller on mobile than desktop.
- Shows a hint bubble ("תלחץ עליי!" / "Click me!" / zh variant) on a timer.
- Clicking Clippy runs `window.App.contactCTA()` — smooth-scroll to `#contact` + mail-button jump/shine. The mobile menu's "Contact" link calls the same function.
- Clippy can be dismissed (×); zh mode swaps the GIF to `clippy-hi-zh.gif` + Chinese speech bubble.
- On hover: swaps to `clippy-dig.gif` animation.

### Sticky notes (main.js)
- Draggable sticky notes created via notepad icon; can be closed.
- "You've Got Mail" sound plays on relevant interactions.

### Portfolio filter (portfolio-filter.js)
- Filters cards by `data-category` attribute (music / video / photos).
- Reorder button resets note positions.

## Hero / About section
- No separate portrait `<img>` — the hero background image (bg_intro.webp) IS the profile photo.
- The background fills the full `#about` section and serves as Harel's visual identity on the page.

## Status
- Site is **complete and live** at harellesnick.com. Developed locally on Harel's machine.
- **Hosting: GitHub Pages behind a Cloudflare proxy** (orange-cloud), verified from the response
  headers — GitHub Pages' `x-github-request-id` and Fastly headers underneath, `server: cloudflare`
  on top, Cloudflare nameservers. The repo root `CNAME` is the GitHub Pages custom-domain file.
  Not Cloudflare Pages — both CVs used to say so and were corrected. Practical consequences: no
  `_headers` support and no server-side redirects, but because the zone is proxied a Cloudflare
  Worker route can intercept a path before it reaches GitHub Pages.
- All assets load (real photos, backgrounds, music art, UI images, fonts, sound).
- All three language modes (he / en / zh) fully translated including XP window chrome.
- Assignment submitted.

## Planned, not built
`docs/analytics-plan.md` specifies a self-hosted click-analytics feature — a Cloudflare Worker on
`harellesnick.com/px/*` writing aggregate counters to D1, with a terminal-styled dashboard. **None
of it exists yet**; Harel will say when to start. Read that file before touching the subject, and
do not re-litigate the decisions recorded in its §1.

## Outstanding TODOs
None. CV PDFs are in (`assets/cv/CV_HE_Harel_Lesnick.pdf` / `CV_EN_Harel_Lesnick.pdf`); the `#cv` section (below Portfolio) has a translated `cv.heading` title over two XP document icons (`.doc-launcher`, icon `ui/xpdocicon.png`) that open the PDFs in a new tab. The captions are filenames — "קורות חיים.pdf" / "Resume.pdf" — so they stay fixed in every language; only the row order flips so the current language's document leads. `#cv` is in the main nav / hamburger as `nav.cv`.
