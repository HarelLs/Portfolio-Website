# Harel Lesnick

דף נחיתה דו-לשוני (עברית RTL / אנגלית LTR) לפורטפוליו של הראל לסניק — מהנדס סאונד, צלם ועורך וידאו.
נבנה כ-HTML/CSS/JS טהור (ללא Build step), כי תהליך הבנייה לא דרש שום תלות חיצונית — מתאים להפצה ישירה ב-GitHub Pages / Netlify / Vercel.

*Header, Hero ו-Services חולקים עכשיו רקע אחיד באמצעות `assets/images/bg_intro.jpg`.*

## מבנה הריפו

```
.
├── index.html                 # מבנה הדף הנוכחי: Header שקוף עם כפתור שפה בלבד → Hero → Services → Portfolio → Current Project → Contact → Footer
├── assets/
│   ├── css/
│   │   ├── variables.css      # טוקנים: צבעים, פונטים, מרווחים
│   │   ├── base.css           # reset + טיפוגרפיה בסיסית + נגישות
│   │   ├── layout.css         # Header, מבנה סקשנים, fixed lang switch, Footer
│   │   ├── components.css     # כפתורים, כרטיסי שירות/פורטפוליו, גלריה, badge
│   │   └── responsive.css     # שינויים ל-Mobile
│   ├── js/
│   │   ├── i18n.js            # מילון תרגומים he/en + מתג שפה (משנה גם dir)
│   │   ├── nav.js             # כפתור שפה + תמיכה בניווט
│   │   ├── portfolio-filter.js # סינון תיק עבודות (הכול/מוזיקה/וידאו/תמונות)
│   │   └── main.js            # אתחול האפליקציה
│   └── images/
│       ├── favicon.svg
│       ├── albumphoto.png
│       ├── bg_intro.jpg       # רקע אחיד ל-Header/Hero/Services
│       ├── epphoto.png
│       ├── singlephoto.png
│       └── logos/             # לוגואים של Spotify / Apple Music / YouTube
└── 01-site-brief.md           # מסמך האפיון/פרומפט המלא (15 הסעיפים) — להגשה במטלה
```

## עקרונות קוד
- כל קובץ אחראי על דבר אחד בלבד (separation of concerns) — אין CSS/JS בתוך ה-HTML.
- כל הטקסטים מתורגמים דרך `data-i18n` + `assets/js/i18n.js` — לא קשיח בתוך הקומפוננטות.
- העברית היא ברירת המחדל בתוך ה-HTML (progressive enhancement: האתר תקין ונקרא גם בלי JS).
- צבעים/מרווחים/פונטים מנוהלים כמשתני CSS ב-`variables.css` בלבד.

## עדיין חסר / לפני פרסום
1. **תמונה אישית ל-Hero** — יש Placeholder עגול, צריך להחליף ב-`<img>` בפועל.
2. **גלריית תמונות** — 4 ריבועי Placeholder בקטגוריית "תמונות" בפורטפוליו, מוכנים להחלפה בתמונות אמיתיות.
3. **מספר WhatsApp אמיתי** — כרגע `https://wa.me/972000000000` הוא placeholder, יש להחליף במספר האמיתי.
4. כדאי לאמת ששמות השירים/האלבומים בכרטיסי המוזיקה תואמים את הכותרות הרשמיות בדיסטרוקיד.

## פרסום
- **GitHub Pages**: להעלות את כל התיקייה לריפו ולהפעיל Pages מה-branch הרלוונטי (תקין מכיוון שזה HTML/CSS/JS טהור).
- **Netlify / Vercel**: גרירת התיקייה ל-deploy ידני, או חיבור לריפו ב-GitHub.
- שני האפשרויות מספקות HTTPS אוטומטי.
