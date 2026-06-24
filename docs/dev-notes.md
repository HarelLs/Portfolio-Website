# Hardest Problems & How They Were Solved

## 1. Clippy GIF Frame Artifacts (Icon Transparency)
Clippy's digging GIF had ghost frames bleeding through between animations. Tried changing CSS `object-fit`, frame disposal methods via gifsicle, and reprocessing the GIF multiple times. Even after using Photoshop AI auto-remove background, the result still needed manual hand-fixing frame by frame.

## 2. Titlebar Icon Sizing Hell
Getting the gallery icon to visually match the other XP titlebar icons took six commits of nudging 1–2px at a time, trimming whitespace, adjusting aspect ratio, and reprocessing the source image. Root cause: inconsistent padding baked into the original PNG files.

## 3. Mobile Drag Broken Across Multiple Features
Music cards, sticky notes, and Clippy all had separate mobile drag bugs. Cards had `!important` position overrides that blocked touch drag. Notes needed viewport clamping to prevent horizontal scroll. Each component needed its own individual fix pass.

## 4. Portfolio Background Shifting on Mobile Tab Switch
Chased across 4–5 commits. Tried hiding the background on mobile, locking the height, setting `500vh`, and more. The real fix was measuring each tab's height in real DOM flow — measuring from a collapsed/absolute state gave wrong values.

## 5. Hebrew RTL Reversing Music Link Order
The JS was injecting music platform links in reverse order in Hebrew mode. Fix was to force LTR order regardless of document direction — counterintuitive since the page is RTL, but correct because these are external service logos, not text content.

## 6. Notepad Box-Select Feature Ping-Pong
Added a Windows-style drag-to-select box for creating sticky notes. The drag event logic conflicted with everything else on the page (z-index, existing drag handlers, click vs. mousedown). After several attempts with inline styles and moving listeners to `window`, the feature was scrapped and replaced with plain single-click.

## 7. iOS Parallax Completely Broken
`background-attachment: fixed` silently does nothing on iOS Safari. Had to write a custom JS parallax using `touchmove` + `requestAnimationFrame`. Even that had jitter that needed a separate guard fix to measure `halfWidth` only once and round pixel offsets.

## 8. XP Window Chrome Staying English in Hebrew Mode
After adding full i18n support, the XP window title bars, tabs, and buttons were getting translated into Hebrew along with the rest of the page. Needed a two-track system: window chrome stays English in `he` mode but does translate in `zh` mode — required splitting the i18n logic into two separate behaviors.

## 9. Stale `EXIF_FIELDS` ReferenceError
After refactoring EXIF field labels to use the `t()` i18n helper, a stale direct reference was left in a separate code path. It only threw a `ReferenceError` at runtime when the properties window was opened — classic "refactored one place, missed another" bug.

## 10. Mobile Photos Tab Blank Space / Overflow
The height-locking logic that worked correctly for the Music and Video tabs caused the Photos tab to leave a giant blank space below the content on mobile. Had to skip height locking specifically for the photos tab on mobile, then revisit again when that broke the RTL mobile layout.
