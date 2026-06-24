# Harel Lesnick — Portfolio

דף נחיתה דו-לשוני (עברית RTL / אנגלית LTR) לפורטפוליו של הראל לסניק — מהנדס סאונד, צלם ועורך וידאו.
נבנה כ-HTML/CSS/JS טהור (ללא Build step), מתאים להפצה ישירה ב-GitHub Pages / Netlify / Vercel.

## מבנה הריפו

```
.
├── index.html                        # מבנה הדף: Header → Hero → Services → Portfolio → Current Project → Contact → Footer
├── assets/
│   ├── css/
│   │   ├── variables.css             # טוקנים: צבעים, פונטים (UpheavalPro / Pixeloid / Tahoma), מרווחים
│   │   ├── base.css                  # reset + טיפוגרפיה + he/en/zh font switching
│   │   ├── layout.css                # Header, Footer, מבנה סקשנים
│   │   ├── components.css            # XP windows, sticky notes, portfolio cards, gallery, badge, Clippy
│   │   └── responsive.css            # Mobile breakpoints
│   ├── js/
│   │   ├── i18n.js                   # מילוני he / en / zh + spam-click Easter egg (מעבר למנדרינית)
│   │   ├── nav.js                    # כפתור שפה + spam detection + hamburger
│   │   ├── main.js                   # XP windows (credits + EXIF), sticky notes, Clippy/Peter Griffin, sounds
│   │   ├── portfolio-filter.js       # סינון תיק עבודות (מוזיקה / וידאו / תמונות)
│   │   ├── gallery.js                # גלריית תמונות עם drag scroll
│   │   ├── lightbox.js               # lightbox לתמונות הגלריה
│   │   └── parallax.js               # אפקט parallax לרקעים
│   ├── fonts/
│   │   ├── UpheavalPro.ttf           # פונט ברירת מחדל (עברית + כללי)
│   │   └── pixeloid.sans-bold.ttf    # פונט אנגלית
│   ├── audio/
│   │   └── YOUVE GOT MAIL.mp3        # צליל "You've Got Mail" לפתיחת חלונות XP
│   └── images/
│       ├── favicon.png
│       ├── current_project.jpg       # תמונת הפרויקט הנוכחי
│       ├── backgrounds/              # bg_intro + bg_port (jpg / webp / mobile variants)
│       ├── music/                    # albumphoto / epphoto / singlephoto (jpg + webp)
│       ├── photos/                   # 01–14 (jpg + webp) — גלריית הצילום האמיתית
│       ├── logos/                    # Spotify / Apple Music / YouTube / music-note SVG
│       └── ui/                       # Clippy GIFs, notepad, note textures, XP icons, Peter Griffin
└── docs/                             # מסמכי הקורס + רשימות פיתוח (לא מוגש לאתר)
    ├── site-brief.md                 # מסמך האפיון המלא (15 סעיפים)
    ├── dev-notes.md                  # בעיות קשות ואיך פתרנו אותן
    ├── presentation.pptx
    └── assignment.pdf
```

## עקרונות קוד
- כל קובץ JS אחראי על דבר אחד בלבד — `i18n.js` תרגום, `main.js` אינטראקטיביות, `nav.js` ניווט.
- כל הטקסטים מתורגמים דרך `data-i18n` — לא קשיח בתוך ה-HTML.
- שני שפות: עברית (ברירת מחדל), אנגלית.
- חלונות XP (credits מיקסינג/מאסטרינג, Photo Properties) — גרירה, טאבים, כפתורי chrome, אנימציית סגירה.
- Clippy צף מעל הדף (draggable), מציג hint bubble ולחיצה עליו גוללת ל-`#contact` — ה-CTA הראשי של הדף.
- Peter Griffin - ציטוטים אקראיים שלו hehehe 
- חלון XP: body content = Tahoma; title bar = Pixeloid (font ה-site).
- צבעים/מרווחים/פונטים מנוהלים כמשתני CSS ב-`variables.css` בלבד.

## סטטוס
האתר **הושלם ופורסם**. תמונת הפרופיל היא תמונת הרקע של סקשן ה-Hero (bg_intro.webp) — אין `<img>` נפרד. אין פריטים פתוחים.

## פרסום
- **GitHub Pages**: להפעיל Pages מה-branch הרלוונטי (HTML/CSS/JS טהור — עובד ישירות).
- depoly in github pages with a cloudflare domain
