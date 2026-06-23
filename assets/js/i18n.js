/* =========================================================
   i18n.js — Translation dictionary + language switching
   No build step / no fetch (avoids CORS issues on file://)
   ========================================================= */

(function () {
  "use strict";

  var translations = {
    zh: {
      "meta.title": "哈雷尔·莱斯尼克",
      "meta.description": "哈雷尔·莱斯尼克 - 声音工程师，拍照人，视频剪辑人。",
      "a11y.skipLink": "跳到内容",
      "nav.home": "家",
      "nav.about": "关于",
      "nav.services": "服务",
      "nav.portfolio": "作品袋",
      "nav.contact": "联系",
      "nav.currentProject": "现在的项目",
      "nav.langSwitch": "逃跑",
      "hero.title": "哈雷尔·莱斯尼克",
      "hero.subtitle": "声音工程师，拍照人，视频剪辑人",
      "hero.tagline": "做所有可能的事情还有更多<br>如果你不发送，你怎么得到？",
      "hero.cta": "打电话给我",
      "placeholders.heroImage": "照片 — 快来了",
      "placeholders.photo": "照片快来了",
      "about.heading": "关于我少少",
      "about.text": "我是哈雷尔·莱斯尼克。我做声音很好。我拍照片和视频也很好。每个项目我都像是我自己的项目一样对待。我接受任何工作，从录音到最终完成，非常高质量。",
      "services.heading": "服务们",
      "services.mix.title": "混合液体",
      "services.mix.desc": "为单曲和专辑混合，所有类型所有情绪",
      "services.master.title": "大师父",
      "services.master.desc": "带颜色的完成，干净、吵闹、值得尊重",
      "services.sounddesign.title": "电脑游戏声音",
      "services.sounddesign.desc": "效果，大气，音乐",
      "portfolio.heading": "工作袋",
      "portfolio.filters.all": "全部",
      "portfolio.filters.music": "音乐",
      "portfolio.filters.video": "视频",
      "portfolio.filters.photos": "照片们",
      "portfolio.reorder": "回到地方",
      "portfolio.music.tag": "音乐",
      "portfolio.music.single1": "单曲一首",
      "portfolio.music.single2": "单曲一首",
      "portfolio.music.album": "个人专辑",
      "portfolio.music.electronic": "电子专辑",
      "portfolio.music.listen": "在Spotify / Apple Music / YouTube听",
      "portfolio.video.first": "第一个音乐视频",
      "portfolio.video.final1": "课程最终作业",
      "portfolio.video.final2": "课程最终作业",
      "portfolio.video.more": "更多在YouTube频道",
      "gallery.title": "照片们",
      "gallery.winTitle": "图库",
      "currentProject.winTitle": "当前项目.jpg",
      "currentProject.badge": "进行中",
      "currentProject.heading": "现在在工作",
      "currentProject.text": "在相册上面为一个手艺人，像我的大学结束项目 - 将要有更新将要有。",
      "contact.heading": "联系",
      "contact.text": "你有钱吗？",
      "contact.email": "电子邮件还存在",
      "footer.rights": "© 2026 哈雷尔·莱斯尼克。所有权利被保留了。",
      "xp.ok": "好的",
      "xp.help.title": "帮助",
      "xp.help.firstMsg": "你以为会发生什么？",
      "xp.mixing.title": "混合液体属性",
      "xp.mastering.title": "大师父属性",
      "xp.photo.title": "照片属性",
      "xp.credits.tab": "学分",
      "xp.photo.tab": "设置",
      "xp.mixing.groupLabel": "混合液体学分",
      "xp.mastering.groupLabel": "大师父学分",
      "xp.photo.groupLabel": "相机信息",
      "xp.credits.colProject": "项目：",
      "xp.credits.colDetails": "详情：",
      "xp.photo.colItem": "项目名称：",
      "xp.photo.colValue": "值：",
      "xp.noData": "没有数据",
      "xp.noMeta": "没有相机信息。",
      "xp.exif.camera": "相机",
      "xp.exif.lens": "镜头",
      "xp.exif.focal": "焦距",
      "xp.exif.aperture": "光圈",
      "xp.exif.shutter": "快门速度",
      "xp.exif.iso": "感光度",
      "xp.exif.date": "日期",
      "portfolio.tag.latestSingle": "最新单曲",
      "portfolio.tag.ep": "EP",
      "portfolio.tag.lp": "LP",
      "notepad.label": "记事本.EXE"
    },
    he: {
      "meta.title": "הראל לסניק",
      "meta.description": "הראל לסניק - מהנדס סאונד, צלם ועורך וידאו. מיקס, מאסטרינג וסאונד דיזיין למשחקי מחשב.",
      "a11y.skipLink": "דלגו לתוכן הראשי",
      "nav.home": "בית",
      "nav.about": "אודות",
      "nav.services": "שירותים",
      "nav.portfolio": "תיק עבודות",
      "nav.contact": "יצירת קשר",
      "nav.currentProject": "פרויקט נוכחי",
      "nav.langSwitch": "EN",
      "hero.title": "הראל לסניק",
      "hero.subtitle": "מהנדס סאונד, צלם ועורך וידאו",
      "hero.tagline": "עושה את כל מה שפה ואפילו קצת יותר<br>אם לא תשלח, איך תקח?",
      "hero.cta": "קבעו שיחה",
      "placeholders.heroImage": "תמונת פרופיל — בקרוב",
      "placeholders.photo": "תמונה בקרוב",
      "about.heading": "קצת עליי",
      "about.text": "אני הראל לסניק — מהנדס סאונד, צלם ועורך וידאו. אני משלב טכניקה מדויקת עם תשוקה אמיתית לסאונד ולתמונה, ועובד על כל פרויקט כאילו הוא שלי. אני פתוח לכל סוג עבודה, מהקלטה ועד גימור סופי, בקליבר גבוה.",
      "services.heading": "שירותים",
      "services.mix.title": "מיקסינג",
      "services.mix.desc": "לסינגלים ואלבומים, כל ז׳אנר כל מוד",
      "services.master.title": "מאסטרינג",
      "services.master.desc": "פינש עם צבע אקרילי, סטרילי ורועש בקטע מכבד",
      "services.sounddesign.title": "סאונד למשחקי מחשב",
      "services.sounddesign.desc": "אפקטים, אטמוספרות ומוזיקה",
      "portfolio.heading": "תיק עבודות",
      "portfolio.filters.all": "הכול",
      "portfolio.filters.music": "מוזיקה",
      "portfolio.filters.video": "וידאו",
      "portfolio.filters.photos": "תמונות",
      "portfolio.reorder": "חזרה למקום",
      "portfolio.music.tag": "מוזיקה",
      "portfolio.music.single1": "סינגל",
      "portfolio.music.single2": "סינגל",
      "portfolio.music.album": "אלבום אישי",
      "portfolio.music.electronic": "אלבום אלקטרוני",
      "portfolio.music.listen": "האזינו ב-Spotify / Apple Music / YouTube",
      "portfolio.video.first": "קליפ ראשון",
      "portfolio.video.final1": "עבודת סוף קורס",
      "portfolio.video.final2": "עבודת סוף קורס",
      "portfolio.video.more": "עוד בערוץ היוטיוב",
      "gallery.title": "תמונות",
      "gallery.winTitle": "גלריה",
      "currentProject.winTitle": "current_project.jpg",
      "currentProject.badge": "בתהליך",
      "currentProject.heading": "בעבודה כרגע",
      "currentProject.text": "על אלבום לאומן, כפרויקט הגמר שלי במכללה - יהיו עדכונים שיהיו ;-)",
      "contact.heading": "יצירת קשר",
      "contact.text": "יש לכם רעיון או משהו מגניב?",
      "contact.email": "דברו איתי",
      "footer.rights": "© 2026 הראל לסניק. כל הזכויות שמורות.",
      "xp.ok": "OK",
      "xp.help.title": "Help",
      "xp.help.firstMsg": "What did you expect to happen?",
      "xp.mixing.title": "Mixing Properties",
      "xp.mastering.title": "Mastering Properties",
      "xp.photo.title": "Photo Properties",
      "xp.credits.tab": "Credits",
      "xp.photo.tab": "Settings",
      "xp.mixing.groupLabel": "Mixing credits",
      "xp.mastering.groupLabel": "Mastering credits",
      "xp.photo.groupLabel": "Camera information",
      "xp.credits.colProject": "Project:",
      "xp.credits.colDetails": "Details:",
      "xp.photo.colItem": "Item name:",
      "xp.photo.colValue": "Value:",
      "xp.noData": "No data",
      "xp.noMeta": "No camera metadata available.",
      "xp.exif.camera": "Camera",
      "xp.exif.lens": "Lens",
      "xp.exif.focal": "Focal Length",
      "xp.exif.aperture": "Aperture",
      "xp.exif.shutter": "Shutter Speed",
      "xp.exif.iso": "ISO",
      "xp.exif.date": "Date",
      "portfolio.tag.latestSingle": "Latest Single",
      "portfolio.tag.ep": "EP",
      "portfolio.tag.lp": "LP",
      "notepad.label": "NOTEPAD.EXE"
    },
    en: {
      "meta.title": "Harel Lesnick",
      "meta.description": "Harel Lesnick - sound engineer, photographer and video editor. Mixing, mastering and sound design for video games.",
      "a11y.skipLink": "Skip to main content",
      "nav.home": "Home",
      "nav.about": "About",
      "nav.services": "Services",
      "nav.portfolio": "Portfolio",
      "nav.contact": "Contact",
      "nav.currentProject": "Current Project",
      "nav.langSwitch": "עברית",
      "hero.title": "Harel Lesnick",
      "hero.subtitle": "Sound Engineer, Photographer & Video Editor",
      "hero.tagline": "Doing all that is plausible and possible<br>hit clippy up",
      "hero.cta": "Book a call",
      "placeholders.heroImage": "Profile photo — coming soon",
      "placeholders.photo": "Photo coming soon",
      "about.heading": "A bit about me",
      "about.text": "I'm Harel Lesnick — a sound engineer, photographer and video editor. I combine precise technique with real passion for sound and image, treating every project like it's my own. I'm open to any kind of work, from recording to final polish, at a high caliber.",
      "services.heading": "Services",
      "services.mix.title": "Mixing",
      "services.mix.desc": "Mixing for singles and albums across genres and use-cases.",
      "services.master.title": "Mastering",
      "services.master.desc": "Clear, loud, and punchy mastering to make tracks stand out.",
      "services.sounddesign.title": "Game Sound Design",
      "services.sounddesign.desc": "Designing sound effects, atmospheres, and music.",
      "portfolio.heading": "Portfolio",
      "portfolio.filters.all": "All",
      "portfolio.filters.music": "Music",
      "portfolio.filters.video": "Video",
      "portfolio.filters.photos": "Photos",
      "portfolio.reorder": "Reorder",
      "portfolio.music.tag": "Music",
      "portfolio.music.single1": "Single",
      "portfolio.music.single2": "Single",
      "portfolio.music.album": "Solo Album",
      "portfolio.music.electronic": "Electronic Album",
      "portfolio.music.listen": "Listen on Spotify / Apple Music / YouTube",
      "portfolio.video.first": "First music video",
      "portfolio.video.final1": "Final course project",
      "portfolio.video.final2": "Final course project",
      "portfolio.video.more": "More on the YouTube channel",
      "gallery.title": "Photos",
      "gallery.winTitle": "Gallery",
      "currentProject.winTitle": "current_project.jpg",
      "currentProject.badge": "In progress",
      "currentProject.heading": "Currently working on",
      "currentProject.text": "an album for an artist as my final college project. Updates in the near future :-)",
      "contact.heading": "Contact",
      "contact.text": "You've got a fresh Idea?",
      "contact.email": "Email is still a thing",
      "footer.rights": "© 2026 Harel Lesnick. All rights reserved.",
      "xp.ok": "OK",
      "xp.help.title": "Help",
      "xp.help.firstMsg": "What did you expect to happen?",
      "xp.mixing.title": "Mixing Properties",
      "xp.mastering.title": "Mastering Properties",
      "xp.photo.title": "Photo Properties",
      "xp.credits.tab": "Credits",
      "xp.photo.tab": "Settings",
      "xp.mixing.groupLabel": "Mixing credits",
      "xp.mastering.groupLabel": "Mastering credits",
      "xp.photo.groupLabel": "Camera information",
      "xp.credits.colProject": "Project:",
      "xp.credits.colDetails": "Details:",
      "xp.photo.colItem": "Item name:",
      "xp.photo.colValue": "Value:",
      "xp.noData": "No data",
      "xp.noMeta": "No camera metadata available.",
      "xp.exif.camera": "Camera",
      "xp.exif.lens": "Lens",
      "xp.exif.focal": "Focal Length",
      "xp.exif.aperture": "Aperture",
      "xp.exif.shutter": "Shutter Speed",
      "xp.exif.iso": "ISO",
      "xp.exif.date": "Date",
      "portfolio.tag.latestSingle": "Latest Single",
      "portfolio.tag.ep": "EP",
      "portfolio.tag.lp": "LP",
      "notepad.label": "NOTEPAD.EXE"
    }
  };

  function applyTranslations(lang) {
    var dict = translations[lang] || translations.he;

    document.documentElement.lang = lang;
    document.body.dir = lang === "he" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key]) {
        if (el.hasAttribute("data-i18n-html")) {
          el.innerHTML = dict[key];
        } else {
          el.textContent = dict[key];
        }
      }
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
      document.dispatchEvent(new CustomEvent("languagechange", { detail: { lang: lang } }));
    },
    toggle: function () {
      this.setLanguage(this.current === "he" ? "en" : "he");
    },
    t: function (key) {
      var dict = translations[this.current];
      return (dict && dict[key] !== undefined) ? dict[key] : (translations.en[key] || key);
    }
  };
})();
