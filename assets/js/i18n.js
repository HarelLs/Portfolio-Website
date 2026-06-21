/* =========================================================
   i18n.js — Translation dictionary + language switching
   No build step / no fetch (avoids CORS issues on file://)
   ========================================================= */

(function () {
  "use strict";

  var translations = {
    he: {
      "meta.title": "הראל לסניק | מהנדס סאונד, צלם ועורך וידאו",
      "meta.description": "הראל לסניק - מהנדס סאונד, צלם ועורך וידאו. מיקס, מאסטרינג וסאונד דיזיין למשחקי מחשב.",
      "a11y.skipLink": "דלגו לתוכן הראשי",
      "nav.home": "בית",
      "nav.about": "אודות",
      "nav.services": "שירותים",
      "nav.portfolio": "תיק עבודות",
      "nav.contact": "יצירת קשר",
      "nav.langSwitch": "EN",
      "hero.title": "הראל לסניק",
      "hero.subtitle": "מהנדס סאונד, צלם ועורך וידאו",
      "hero.tagline": "מיקס, מאסטרינג וסאונד דיזיין למשחקי מחשב — מוכן לכל סוג עבודה, בקליבר גבוה.",
      "hero.cta": "קבעו שיחה",
      "placeholders.heroImage": "תמונת פרופיל — בקרוב",
      "placeholders.photo": "תמונה בקרוב",
      "about.heading": "קצת עליי",
      "about.text": "אני הראל לסניק — מהנדס סאונד, צלם ועורך וידאו. אני משלב טכניקה מדויקת עם תשוקה אמיתית לסאונד ולתמונה, ועובד על כל פרויקט כאילו הוא שלי. אני פתוח לכל סוג עבודה, מהקלטה ועד גימור סופי, בקליבר גבוה.",
      "services.heading": "שירותים",
      "services.mix.title": "מיקס",
      "services.mix.desc": "מיקס מקצועי לסינגלים ואלבומים, עם דגש על בהירות ואיזון.",
      "services.master.title": "מאסטרינג",
      "services.master.desc": "מאסטרינג בסטנדרט תעשייתי, מוכן להפצה בכל הפלטפורמות.",
      "services.sounddesign.title": "סאונד דיזיין למשחקים",
      "services.sounddesign.desc": "עיצוב אפקטים ואטמוספרות סאונד למשחקי מחשב.",
      "portfolio.heading": "תיק עבודות",
      "portfolio.filters.all": "הכול",
      "portfolio.filters.music": "מוזיקה",
      "portfolio.filters.video": "וידאו",
      "portfolio.filters.photos": "תמונות",
      "portfolio.music.tag": "מוזיקה",
      "portfolio.music.single1": "סינגל",
      "portfolio.music.single2": "סינגל",
      "portfolio.music.album": "אלבום אישי",
      "portfolio.music.electronic": "אלבום אלקטרוני (ARL51)",
      "portfolio.music.listen": "האזינו ב-Spotify / Apple Music / YouTube",
      "portfolio.video.first": "קליפ ראשון",
      "portfolio.video.final1": "עבודת סוף קורס",
      "portfolio.video.final2": "עבודת סוף קורס",
      "portfolio.video.more": "עוד בערוץ היוטיוב",
      "currentProject.badge": "בתהליך",
      "currentProject.heading": "בעבודה כרגע",
      "currentProject.text": "אני מפיק ומקסס אלבום מלא לאומן, כפרויקט הגמר שלי במכללה. עדכונים והאזנות יתווספו כאן בקרוב.",
      "contact.heading": "יצירת קשר",
      "contact.text": "יש לכם פרויקט בראש? בואו נדבר.",
      "contact.whatsapp": "וואטסאפ",
      "contact.email": "דוא\"ל",
      "footer.rights": "© 2026 הראל לסניק. כל הזכויות שמורות."
    },
    en: {
      "meta.title": "Harel Lesnick | Sound Engineer, Photographer & Video Editor",
      "meta.description": "Harel Lesnick - sound engineer, photographer and video editor. Mixing, mastering and sound design for video games.",
      "a11y.skipLink": "Skip to main content",
      "nav.home": "Home",
      "nav.about": "About",
      "nav.services": "Services",
      "nav.portfolio": "Portfolio",
      "nav.contact": "Contact",
      "nav.langSwitch": "עברית",
      "hero.title": "Harel Lesnick",
      "hero.subtitle": "Sound Engineer, Photographer & Video Editor",
      "hero.tagline": "Mixing, mastering and sound design for video games — ready for any job, at a high caliber.",
      "hero.cta": "Book a call",
      "placeholders.heroImage": "Profile photo — coming soon",
      "placeholders.photo": "Photo coming soon",
      "about.heading": "A bit about me",
      "about.text": "I'm Harel Lesnick — a sound engineer, photographer and video editor. I combine precise technique with real passion for sound and image, treating every project like it's my own. I'm open to any kind of work, from recording to final polish, at a high caliber.",
      "services.heading": "Services",
      "services.mix.title": "Mixing",
      "services.mix.desc": "Professional mixing for singles and albums, with a focus on clarity and balance.",
      "services.master.title": "Mastering",
      "services.master.desc": "Industry-standard mastering, ready for distribution on every platform.",
      "services.sounddesign.title": "Game Sound Design",
      "services.sounddesign.desc": "Sound effects and atmosphere design for video games.",
      "portfolio.heading": "Portfolio",
      "portfolio.filters.all": "All",
      "portfolio.filters.music": "Music",
      "portfolio.filters.video": "Video",
      "portfolio.filters.photos": "Photos",
      "portfolio.music.tag": "Music",
      "portfolio.music.single1": "Single",
      "portfolio.music.single2": "Single",
      "portfolio.music.album": "Solo Album",
      "portfolio.music.electronic": "Electronic Album (ARL51)",
      "portfolio.music.listen": "Listen on Spotify / Apple Music / YouTube",
      "portfolio.video.first": "First music video",
      "portfolio.video.final1": "Final course project",
      "portfolio.video.final2": "Final course project",
      "portfolio.video.more": "More on the YouTube channel",
      "currentProject.badge": "In progress",
      "currentProject.heading": "Currently working on",
      "currentProject.text": "I'm producing and mixing a full album for an artist, as my final college project. Updates and previews will be added here soon.",
      "contact.heading": "Contact",
      "contact.text": "Have a project in mind? Let's talk.",
      "contact.whatsapp": "WhatsApp",
      "contact.email": "Email",
      "footer.rights": "© 2026 Harel Lesnick. All rights reserved."
    }
  };

  function applyTranslations(lang) {
    var dict = translations[lang] || translations.he;

    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key]) el.textContent = dict[key];
    });

    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      var parts = el.getAttribute("data-i18n-attr").split(":");
      var attr = parts[0];
      var key = parts[1];
      if (dict[key]) el.setAttribute(attr, dict[key]);
    });

    if (dict["meta.title"]) document.title = dict["meta.title"];
  }

  window.App = window.App || {};
  window.App.i18n = {
    current: "he",
    setLanguage: function (lang) {
      this.current = lang;
      applyTranslations(lang);
    },
    toggle: function () {
      this.setLanguage(this.current === "he" ? "en" : "he");
    }
  };
})();
