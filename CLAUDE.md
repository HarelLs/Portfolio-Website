# Project Context — Harel Lesnick Portfolio Landing Page

This file exists so a Claude Code session opened in this folder has full context without re-deriving it. Read this first.

## What this is
Final-project landing page for a college course ("מטלת סיום קורס" — KIC Ed "בניית דף נחיתה" assignment) and a real, working personal site for Harel Lesnick. The assignment requires going through a structured workflow (characterization → prompt → mockup → build → publish) and documenting the process. Harel's secondary goal: actually learn how this kind of site gets built with AI tools.

## Who Harel is / site content decisions
- Sound engineer, photographer, and video editor. Site is under his own name (no business name).
- Services offered: Mixing, Mastering, Sound design for video games.
- Target audience: potential clients (artists, game devs, content creators) who need these services.
- Primary CTA: book a call/meeting (WhatsApp + email).
- Bilingual: Hebrew (RTL, default) + English (LTR), toggle switches both language and `dir`.
- Currently producing/mixing a full album for an artist as his college final project — this gets its own "Current Project" section.
- Music links (DistroKid hyperfollow, auto-link to Spotify/Apple Music/YouTube):
  - https://distrokid.com/hyperfollow/harellesnick/----2 (single)
  - https://distrokid.com/hyperfollow/harellesnick/-300 (single)
  - https://distrokid.com/hyperfollow/harellesnick/---3 (solo album)
  - https://distrokid.com/hyperfollow/arl51/iz-514 (electronic album, alias ARL51)
- Video: YouTube channel https://www.youtube.com/@Harel_Lesnick/videos, embedded videos: i_YLgCMyeo4 (first music video), FI3RQ0E-SA8 and RDNfOr1hkk0 (course final projects).
- Photo gallery: Harel will supply real photos later — currently placeholders.

## Design direction (validated against real reference sites via Exa search)
- Dark mode, bold typography — direction from roykafri.com and metroboominshop.com.
- Portfolio section with category filter (All / Music / Video / Photos) — direction from roykafri.com.
- Warm, personal tone + embedded media players — direction from venustheory.com (a sound-designer-for-games portfolio, closely matches Harel's own services).
- "Ben Jordan" reference was dropped — no relevant portfolio site found under that name.

## Tech stack — and why it's plain HTML/CSS/JS, not Astro
The original plan (validated via Exa research) was **Astro + Tailwind CSS + TypeScript** — best fit for a static, i18n/RTL, component-based, clean-code portfolio site. That recommendation still stands as the *ideal* choice.

However, the build happened inside a Cowork sandbox with **no network access to the npm registry or github.com** (proxy returns 403/blocked-by-allowlist). Astro could not actually be scaffolded there. The site was built instead as clean, modular vanilla HTML/CSS/JS (no build step), which is also one of the deployment paths the assignment explicitly recommends (GitHub Pages for static HTML/CSS/JS sites).

**If you're reading this in Claude Code on Harel's actual machine**, npm registry access is NOT blocked there — migrating to Astro/Tailwind is a real, viable option now if Harel wants the original ideal setup. Don't assume vanilla HTML is a hard requirement; it was a sandbox workaround, not a deliberate constraint from Harel.

## Current file structure
```
.
├── index.html                  # full semantic markup, all sections
├── assets/css/                 # variables / base / layout / components / responsive
├── assets/js/                  # i18n.js / nav.js / portfolio-filter.js / main.js
├── assets/images/favicon.svg
├── 01-site-brief.md            # full 15-point characterization/prompt doc — for assignment submission
├── README.md                   # repo structure + remaining TODOs + deploy instructions
└── CLAUDE.md                   # this file
```

## Status
- Site is built, content-complete, syntax-checked, and all assets verified to load (HTTP 200 via local server test).
- Local git repo initialized with an initial commit. Harel has since pushed it to GitHub himself (push had to happen from his machine — the Cowork sandbox has no GitHub network access either).
- No GitHub MCP connector is available/connected in this Cowork account (checked via registry search) — Claude in Cowork cannot push or open PRs on Harel's behalf. Claude Code running locally (this session) CAN, since it uses Harel's real shell, git config, and network.

## Outstanding TODOs
1. Real WhatsApp number — `index.html` contact section currently links to a placeholder `https://wa.me/972000000000`.
2. Hero profile photo — currently a placeholder circle in `.hero-media-placeholder`.
3. Real photos for the gallery — 4 placeholder tiles in the "photos" portfolio category.
4. Confirm the actual song/album titles in the music portfolio cards (currently generic labels like "Single", "Solo Album" since exact titles weren't provided).
5. Optional: consider migrating to Astro/Tailwind now that npm is reachable locally (see Tech stack note above) — ask Harel before doing this, it's a meaningful rework, not a small tweak.
6. Assignment deliverable: Harel also needs to submit the process documentation (tools used, audience, workflow, challenges) per the course's "מטלת סיום קורס" requirements — `01-site-brief.md` covers most of this but the final submission email format wasn't drafted yet.
