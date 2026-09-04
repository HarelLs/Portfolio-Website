# Plan: self-hosted click analytics for harellesnick.com

> **Status: NOT BUILT.** Nothing in this document exists yet — no Worker, no database, no `analytics.js`, no changes to `index.html`.
>
> This is a specification written to be picked up and executed later by a future Claude instance. Harel will say when to start; until then, do not implement any part of it.
>
> **Before executing:** re-verify the file paths and line numbers below against the code at that time — they were accurate on 2026-09-04 but this repo changes. Every claim here about hosting, fonts and Cloudflare limits was verified on that date.

---

## 1. What Harel asked for

> "A way to see the metrics of the website clicks linked to the type of device that has been used — no personal data or cookies, just to see a general idea of what people click on."

Decisions he made during planning. These are settled — do not re-litigate them:

| Decision | Choice |
|---|---|
| Third-party service (Umami/Plausible/GoatCounter) | **No.** Fully self-built. |
| Scope | **Six events only** — outcomes that matter, not all ~40 clickables. |
| Ad-blocker proxy | Not a separate concern; the self-built design is first-party from day one. |
| Privacy note on the site | **Yes**, stating plainly that clicks are counted and nothing personal is stored. |
| Pruning events that get no clicks | **No — never remove them.** A zero is a real finding (§6). |
| Dashboard look | **Terminal / ASCII**, not XP-window chrome (§10). |

## 2. Current state of the site

- Plain vanilla HTML/CSS/JS. **No build step, no npm, no `package.json`.** Bilingual he (RTL, default) / en, plus a hidden `zh` Easter egg.
- Scripts, all `<script defer>` at `index.html:348-353`, in order: `parallax.js → i18n.js → nav.js → portfolio-filter.js → gallery.js → main.js`. `defer` preserves document order.
- Module pattern: IIFE + `"use strict"`, ending `window.App = window.App || {}; window.App.<name> = {...}` — see `i18n.js:219`, `nav.js:69`, `portfolio-filter.js:79`. `main.js` is one large `DOMContentLoaded` handler (`main.js:31-1072`).
- **Zero analytics today.** No `fetch`, no `sendBeacon`, no XHR, no third-party script anywhere. No CSP meta tag.
- Existing storage precedent: `localStorage` keys `xp-pos-*` for XP window positions (`main.js:100-103`). Functional state, not analytics — this matters for the wording of the privacy note.

### Hosting (verified by `curl`, 2026-09-04)

**GitHub Pages behind a Cloudflare proxy (orange-cloud).** `x-github-request-id` and Fastly headers underneath, `server: cloudflare` on top, Cloudflare nameservers (`apollo`/`martha.ns.cloudflare.com`), apex IP in Cloudflare range. Repo root has `CNAME` → `harellesnick.com`. No `.github/workflows`, no `_headers`, no `wrangler.toml` on `main`.

Two consequences:
- A **Worker route intercepts before GitHub Pages**, so a first-party endpoint on the main domain needs no hosting change.
- GitHub Pages ignores `_headers` entirely — don't go down that path.

Ignore the stale unmerged branch `origin/cloudflare/workers-autoconfig`; it migrates hosting to Workers static assets, a different and much larger change.

## 3. Architecture

A click fires a same-origin `POST /px/e`; a Cloudflare Worker derives the device class from the User-Agent and **increments a counter row** in D1; a gated dashboard renders the counters.

```
browser                     Cloudflare edge                 D1
click → analytics.js  ──▶  Worker (route /px/*)  ──▶  counters table
                            derives device from UA        (day, event, prop,
                            then DISCARDS the UA and IP    device, count)
```

### Why counters, not event rows — the central decision

The obvious design logs one row per click. **Don't.**

```sql
CREATE TABLE clicks (
  day    TEXT NOT NULL,   -- '2026-09-04'
  event  TEXT NOT NULL,   -- 'cv.open'
  prop   TEXT NOT NULL,   -- 'he'  ('' when the event has no property)
  device TEXT NOT NULL,   -- 'mobile' | 'tablet' | 'desktop'
  n      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, event, prop, device)
);
```

Every write is one UPSERT: `INSERT ... ON CONFLICT(day,event,prop,device) DO UPDATE SET n = n + 1`.

This makes the privacy claim **structural rather than promised**:

- No per-visitor row, no session id, no visitor hash, no IP, no timestamp finer than the day. Not "deleted after 24h" — never written.
- It cannot be deanonymised later, leaked, or subpoenaed, because the data does not exist.
- Plausible and Umami both retain a rotating per-visitor hash to count uniques. This is strictly more private than either.
- Tiny: 6 events × ~3 props × 3 devices × 365 days ≈ 20k rows/year, against a 500 MB free-tier ceiling.

Cost of the trade: no unique visitors, no sessions, no journeys. Correct for *"a general idea of what people click on"*. If visitor counts are ever wanted, enable Cloudflare Web Analytics (§11) — free, zero-code, and complementary.

### Storage: D1, not Analytics Engine

Analytics Engine is Cloudflare's purpose-built telemetry store (100k data points/day free) but has **no UI** — you query SQL from Grafana — and ~90-day retention. D1 gives permanent history, real SQL, and a dashboard we control.

## 4. Cost: $0

Everything runs on permanent free tiers. No card, no trial.

| | Free allowance | Needed here |
|---|---|---|
| Workers requests | **100,000/day** | ~1 per click |
| Workers CPU | 10 ms per invocation | One JSON parse + one UPSERT; D1 wait is I/O, not CPU |
| D1 rows written | 100,000/day | 1 per click |
| D1 rows read | 5M/day | Only when the dashboard is opened |
| D1 storage | 5 GB (500 MB/database) | ~20k rows/year |
| Workers routes | 1,000 per zone | 1 |
| Cloudflare Access | 50 users | 1 |

Workers Paid is $5/month minimum; nothing here needs it. Reaching the ceiling would take ~100,000 clicks in one day. Note the free request limit is **account-wide** across all Workers.

D1 began *enforcing* free-tier daily limits on 2026-09-01 — queries fail rather than silently billing. If a limit were ever hit, the Worker returns error 1027 and clicks stop counting; **the site is unaffected**, since the route covers only `/px/*` and the client swallows all errors.

## 5. Prerequisites (Harel, in the Cloudflare dashboard)

1. Confirm the Workers Free plan is active on the account holding the `harellesnick.com` zone.
2. Create a D1 database (suggested name `px`).
3. After the Worker is deployed, add the route `harellesnick.com/px/*` (and `www.harellesnick.com/px/*` if www is served).
4. Enable Cloudflare Access (Zero Trust free) and add an application covering `harellesnick.com/px/dash*`, with an email one-time-PIN policy for his own address.

## 6. What gets tracked

Six events. The `RULES` map in `analytics.js` is the single source of truth — a name not in it does not exist.

| Event | Prop | Selector | Markup |
|---|---|---|---|
| `cv.open` | `he` \| `en` | `a.doc-launcher` (by `href`) | `index.html:265-272` |
| `music.link` | `apple` \| `spotify` \| `youtube` | `a.music-link` (×9, via `aria-label`) | `index.html:145-198` |
| `contact.mail` | — | `#contact-mail-btn` | `index.html:283` |
| `credits.open` | `mixing` \| `mastering` | `#mix-credits-btn`, `#master-credits-btn` | `index.html:75, 88` |
| `filter.tab` | `music` \| `video` \| `photos` | `.filter-btn[data-filter]` | `index.html:125-127` |
| `photo.open` | photo id, e.g. `07` | `.photo-slot` | `index.html:235-248` |

Naming rules: ASCII, lowercase, `area.thing`; prop values from a closed enum. **Never derive a name from `textContent`** — it changes across he/en/zh and would put Hebrew and Chinese strings in the dashboard.

**Never delete an event for lack of clicks.** Harel was explicit. An event sitting at zero is information — "nobody opens the CV on mobile" is exactly the kind of finding this exists to surface, and deleting the row would destroy the comparison and break the historical series.

Not tracked: Clippy, notepad.exe, sticky notes, XP window chrome, the zh Easter egg (kept off the record, consistent with how commit messages treat it), nav links, scroll depth, hover.

**YouTube iframes cannot be tracked** — cross-origin, clicks are unobservable. Do not attempt a window-blur or IntersectionObserver proxy: it fires on alt-tab and devtools and produces a number that looks like play counts but isn't. YouTube Studio provides this properly, for free.

## 7. Files

**New**
- `assets/js/analytics.js` — client module
- `worker/src/index.js` — collector + dashboard
- `worker/wrangler.toml` — Worker + D1 binding + route
- `worker/schema.sql` — the table in §3
- `worker/README.md` — deploy steps

**Modified**
- `index.html` — one `<script defer>` after `main.js` (line 353); one footer line in `.site-footer` (`index.html:342-346`)
- `assets/js/i18n.js` — `footer.privacy` key in **all three** dicts (he/en/zh — omitting zh breaks the Easter egg's consistency)
- `CLAUDE.md` — record the event taxonomy and its source of truth

Do **not** add a `package.json` to the repo root. The site has no build step by design; deploy the Worker with `npx wrangler` from `worker/`.

## 8. Client module — `assets/js/analytics.js`

House style: IIFE + `"use strict"`, ending `window.App.analytics = {...}`.

**One capture-phase delegated listener on `document`** — not per-element wiring:

```js
document.addEventListener("click", onClick, { capture: true });
```

Capture phase is **required, not stylistic.** `main.js` calls `stopPropagation()` in nine places — verified at lines `231, 337, 397, 416, 825, 972, 1023, 1027, 1031` — including both credits buttons (`1023`, `1027`). A bubble-phase listener would silently never see `credits.open`.

Resolution is an **ordered rule array**, first match wins, resolved at click time via `closest()`:

```js
var RULES = [
  { sel: ".doc-launcher",     name: "cv.open",      prop: cvLang },
  { sel: ".music-link",       name: "music.link",   prop: storeName },
  { sel: "#contact-mail-btn", name: "contact.mail" },
  // ...
];
```

Why a rule map rather than `data-*` attributes on elements: several targets (photo slot contents, credit rows, XP windows) are **generated by JS**, so attributes would mean spreading analytics concerns into the 1000-line `main.js` bootstrap. The map also serves as a single readable manifest of everything measured. Cost: a class rename silently kills a metric — mitigate with debug mode and comments in `RULES` citing markup lines.

**Guards, in order:**

1. `if (!e.isTrusted) return;` — `main.js:1033` calls `videoBtn.click()` synthetically. Without this, pressing "see_my_work" fabricates a `filter.tab` nobody clicked.
2. **Drag guard** — a `{capture:true, passive:true}` `pointerdown` listener records `{x,y,t}`; reject a click that moved >8px within 2s. Must be `passive`: the site runs non-passive `touchmove` handlers (`main.js:504, 713`) and a non-passive document pointer listener risks mobile scroll jank. Only apply the distance test when a recent `pointerdown` exists, or keyboard-activated clicks (stale coordinates) get misread as drags.
3. Wrap the whole handler in `try/catch`. **Never** call `preventDefault`, `stopPropagation`, or mutate the event.

**Sending:**

```js
navigator.sendBeacon("/px/e", JSON.stringify({ e: name, p: prop }));
```

That is the entire payload. The client sends **nothing about the device** — the Worker derives it. Fall back to `fetch(..., {keepalive:true})` where `sendBeacon` is unavailable; swallow all errors.

No unload-timing complexity is needed: nothing on this site navigates the current tab (music links and CVs are `target="_blank"`, credits use `window.open` at `main.js:980`, contact is `mailto:`). Leave a comment saying so, so nobody adds it later.

**Off switches:** respect `navigator.doNotTrack === "1"`, and `localStorage.setItem("px.off", 1)` for Harel's own browser. Auto-enable a console `debug` mode on `localhost`.

**The worst realistic failure is "no data", never "broken site"** — the module never mutates events, never touches the DOM, never modifies `main.js`.

## 9. Worker — `worker/src/index.js`

Route **`harellesnick.com/px/*`** — narrow, so a Worker bug can never take down the site. `harellesnick.com/*` would put the Worker in front of everything; do not.

- **`POST /px/e`** — reject if `Origin` isn't `https://harellesnick.com`; validate `e` against the six-name allowlist and `p` against its enum (unknown → drop, so a hostile POST cannot invent rows); bucket the device; UPSERT; return `204`. Wrap the D1 write in `ctx.waitUntil()` so the response doesn't wait on it, and fail open.
- **`GET /px/dash`** — dashboard page.
- **`GET /px/data`** — JSON aggregates for the dashboard.
- **Anything else under `/px/*`** — 404. Never an open proxy.

**Device bucketing** — from `Sec-CH-UA-Mobile` where present, else a coarse UA regex, into exactly `mobile` / `tablet` / `desktop`. The UA and IP are read in memory and **never written anywhere**. This is why no UA sniffing enters the site's own JS: the codebase has zero `navigator.userAgent` today and should keep it that way. (Existing device logic is width-based only: `parallax.js:5`, `portfolio-filter.js:47`, and a duplicated `isMobile` at `main.js:182` and `main.js:353`.)

**Bot filtering** is largely free: events require real JS execution *and* `isTrusted`, which excludes crawlers. A short UA denylist covers the rest.

## 10. Dashboard — terminal aesthetic

### Immediately, before the dashboard page exists

- **Cloudflare dashboard → Workers & Pages → D1 → database → Console.** Paste SQL, get a table.
- **Terminal:** `npx wrangler d1 execute px --remote --command "SELECT event, device, SUM(n) n FROM clicks GROUP BY 1,2 ORDER BY n DESC"`

Because the data is stored pre-aggregated, these are one-liners — there is no raw log to wade through.

### The dashboard page: `harellesnick.com/px/dash`

Open the URL in any browser; Cloudflare Access asks for an email and sends a one-time PIN. Works on mobile. Nothing to install, no password to store.

A single self-contained HTML file served by the Worker: inline CSS and JS, **no chart library, no images, no external assets**.

**Make it a terminal, not an XP window.** Harel chose this explicitly over the Luna-chrome alternative. It should read as a console readout — the same family as the site's `.cmd-btn` / `.cmd-output` panels, but standing alone:

- **Monospace throughout** — `"Lucida Console", "Courier New", monospace`, the stack already used by `.cmd-output` and `.custom-note-body`. Do not use the pixel display fonts; this is a readout, not a title.
- **Dark ground, phosphor text.** Near-black background, green foreground, dim grey for labels and rules.
- **Frame the whole thing in box-drawing characters** — `┌ ─ ┐ │ └ ┘` — as literal text in a `<pre>`, not CSS borders. The frame is content.
- **Bars are block characters** — `█` repeated, scaled to the max value in each group. Not `div` widths, not SVG. This keeps the entire page renderable as monospace text, which is the point.
- **The daily trend is a sparkline** built from `▁▂▃▄▅▆▇█`, one character per day.
- **Range switcher** as bracketed pseudo-buttons: `[7d] [30d] [90d] [all]`, the active one marked.
- No gradients, no rounded corners, no shadows, no animation beyond an optional blinking `_` cursor.

Target output — this mockup is the spec, match it:

```
┌─ analytics ────────────────────────── [7d] [30d] [90d] [all] ─┐
│                                                                │
│  1,284 clicks · 31 days                                        │
│                                                                │
│  music.link      ████████████████████████████  512             │
│  photo.open      ██████████████████            331             │
│  cv.open         ████████████                  198             │
│  filter.tab      ████████                      142             │
│  credits.open    ████                           68             │
│  contact.mail    ██                             33             │
│                                                                │
│  ── by device ───────────────────────────────────────────────  │
│                    mobile    tablet   desktop                  │
│  music.link          309        24       179                   │
│  photo.open          198        11       122                   │
│  cv.open              41         6       151   ← desktop skew   │
│  contact.mail         12         1        20                   │
│                                                                │
│  ── music.link ──────────────  ── cv.open ───────────────────  │
│  spotify   ████████████  241    he  ████████████████   142     │
│  apple     ████████      163    en  ██████              56     │
│  youtube   ████          108                                   │
│                                                                │
│  ── daily ───────────────────────────────────────────────────  │
│  ▁▂▅▃▂▇█▄▂▁▃▅▂▁▂▄▃▁▂▆█▅▃▂▁▂▃▄▂▁                               │
└────────────────────────────────────────────────────────────────┘
```

That "desktop skew" annotation on `cv.open` is the point of the whole feature: if nobody opens the CV on mobile, that's a layout problem worth knowing about. Every panel is one `GROUP BY` over the counter table.

**On mobile:** the fixed-width frame will not fit a phone. Either drop the outer box below ~480px and keep the rules and bars, or let the `<pre>` scroll horizontally inside an `overflow-x: auto` wrapper. Do not reflow the bars — a monospace layout that wraps is worse than one that scrolls.

**Access control:** Cloudflare Access on `/px/dash*` — email one-time-PIN, zero code. Plus `noindex`, a `robots.txt` disallow, and the Worker skipping its own dashboard path. Using Access rather than a `?token=` URL avoids leak-via-referer, and access control is the step most people skip when self-building analytics.

## 11. Privacy note

Harel asked for this to be explicit, not buried. One clear translated sentence in the footer, keyed `footer.privacy` across he/en/zh:

> **EN:** "This site counts clicks to see which parts get used. No cookies, no accounts, no personal data — only anonymous totals."

Keep the wording accurate on one point: the site already writes `localStorage` for XP window positions (`main.js:100-103`). That is functional state, not analytics — so say "no cookies and nothing personal", **not** "stores nothing", which anyone with devtools could disprove.

**No cookie banner is required.** ePrivacy consent attaches to storing or reading information on the visitor's device; this stores and reads nothing.

**Optional complement (zero code):** enabling Cloudflare Web Analytics from the CF dashboard auto-injects a beacon at the edge for proxied zones, adding pageviews and Core Web Vitals. It supports **no custom events** ("Not yet" per their FAQ), so it complements this feature and cannot replace it.

## 12. Verification

**Locally** (`python3 -m http.server 8000` from the repo root — not `file://`):
- `/px/e` will 404. This *is* the "endpoint blocked or down" test: click everything, confirm zero console errors and zero behaviour change.
- Debug mode logs each resolved `{name, prop}` without a network. Walk all six targets and confirm:
  - both credits buttons fire — proves capture phase beat the `stopPropagation` at `main.js:1023/1027`;
  - `#sounddesign-btn` produces **no** `filter.tab` — proves the `isTrusted` guard against `main.js:1033`;
  - dragging a music card out of the folder produces nothing;
  - `#contact-mail-btn` fires once, not twice, and still plays the mail sound.

**Worker**, before wiring the client: `curl -X POST https://harellesnick.com/px/e` with a good and a bad `Origin` → `204` / `403`; confirm rows appear via `wrangler d1 execute --remote`.

**Production:** devtools Network shows a request to `harellesnick.com/px/e` and **no third-party domain anywhere**. Load with uBlock Origin enabled — it should survive, being first-party and innocuously named. Check on a phone that the row lands with `device='mobile'`.

**Exclude yourself:** `localStorage.setItem("px.off", 1)` in Harel's browser.

## 13. Risks

1. **Over-broad Worker route** — must be `/px/*`, never `/*`. The only change here that could take the site down.
2. **Selector rot** — a class rename silently kills a metric with no error. Mitigated by debug mode and comments in `RULES` citing markup line numbers.
3. **Rule ordering** — `.music-link` must precede any broader card rule. Caught by the manual walkthrough, not by any automated check.
4. **D1 free-tier enforcement** (since 2026-09-01) — irrelevant at this scale, but if a bot floods `/px/e`, writes fail until midnight UTC. The `Origin` check and enum allowlist are the defence; add Cloudflare rate limiting if it ever happens.
5. **No test suite in this repo** — verification is the manual walkthrough in §12, which is why it is written out in that detail.

## 14. Sequencing

| Phase | Work | Touches the live site? |
|---|---|---|
| 1 | Worker + D1 + schema + route; verify with `curl` | No — inert until the client exists |
| 2 | `assets/js/analytics.js` + one script tag; local walkthrough | First commit |
| 3 | Deploy; confirm first-party-only; let data accumulate | — |
| 4 | `/px/dash` + Cloudflare Access | Separate commit |
| 5 | Footer privacy line + 3 i18n keys | Separate commit |

Phases 1 and 2 are independently reversible: the Worker does nothing until the script tag exists, and removing the script tag fully stops collection.

## 15. Deliberately rejected

- **Third-party services** (Umami, Plausible, GoatCounter, Fathom) — Harel's decision to keep it self-built.
- **Cloudflare Web Analytics as the solution** — supports no custom events at all.
- **Raw event rows** — counters are more private and sufficient for the question.
- **Analytics Engine** — no UI, ~90-day retention.
- **Self-hosting Plausible** — Elixir + ClickHouse + 2 GB RAM to count clicks on a portfolio.
- **XP-window chrome for the dashboard** — considered and rejected in favour of the terminal readout in §10.
- **Umami's `data-umami-event` attributes** — they suppress other listeners on the element (umami#2586), which would break this site's interactivity. Irrelevant now that we're self-building, but noted so it isn't reintroduced.
- **A `package.json` in the repo root** — the site has no build step by design.
- **Tracking the zh Easter egg.**
- **Pruning events with no clicks** — explicitly rejected by Harel; see §6.
