# LEOMAX Website — Session Log

**Last Updated:** 2026-05-03
**Repo:** https://github.com/anasmsdramsees-collab/leomax-website
**Live URL:** https://anasmsdramsees-collab.github.io/leomax-website/

---

## Final File Structure

```
website/
├── index.html                      ← Redirect to main page (fixes 404)
├── LEOMAX_Website_Design.html      ← Main homepage
├── team.html                       ← Standalone team page
├── company-about.html
├── company-case-studies.html
├── company-contact.html            ← Calendly inline embed
├── company-founder.html            ← Dr. Anas new navy suit photo
├── company-process.html
├── system-01-growth.html           ← Calendly popup
├── system-02-ai.html               ← Calendly popup
├── system-03-marketing.html        ← Calendly popup
├── system-04-content.html          ← Calendly popup
├── system-05-launch.html           ← Calendly popup
├── case-*.html (14 files)
├── logo.png                        ← HQ transparent logo (4608x3072)
├── manifest.json
├── sw.js                           ← Service Worker v11
├── icons/
│   ├── icon-192.png                ← Lion head icon
│   └── icon-512.png                ← Lion head icon
└── team/
    ├── dr-anas.png                 ← Profile card (logo removed)
    ├── dr-anas-photo.png           ← Founder headshot navy suit
    ├── kaya-haddad.png
    ├── rita-nasser.png
    ├── rami-khalidi.png
    ├── haya-kuwari.png
    ├── laith-darwish.png
    ├── hani-masry.png
    ├── kamilia-fouad.png
    ├── yasin-sherif.png
    ├── mashari-otaibi.png
    ├── elhanouf-harbi.png
    ├── mira-mansoori.png
    ├── miral-hakimi.png
    ├── valeria-moreno.png
    ├── team-group.png
    ├── team-office.png
    └── Leomax_Team_Profiles_Master.pdf
```

---

## What Was Done — Session 1 (2026-05-02)

### 1. PWA Setup
- Created `manifest.json` — app name, theme color, icons
- Created `sw.js` — Service Worker for offline support
- Added PWA meta tags to all 23 HTML files
- Created `icons/icon-192.png` and `icons/icon-512.png`

### 2. Deployment to GitHub Pages
- Installed Node.js via nvm, installed and configured `gh` CLI
- Created GitHub repo: `anasmsdramsees-collab/leomax-website`
- Enabled GitHub Pages on `main` branch
- Added `index.html` redirect to fix 404 on root URL

### 3. Mobile Responsive CSS
- Added `@media (max-width: 768px)` to all 23 pages
- Added `@media (max-width: 390px)` for small phones
- Fixed nav padding, grid layouts, section padding
- Footer stacks to single column on mobile

### 4. Navigation Links Fixed
All broken `href="#"` elements now link to correct pages across the full site.

### 5. Full Navigation Footer on All Sub-Pages
Replaced simple footer on all sub-pages with a full 3-column footer:
- **Column 1:** Systems (5 links)
- **Column 2:** Company (6 links including Our Team)
- **Column 3:** Contact info + Home button

### 6. Calendly Integration
**URL:** `https://calendly.com/anas-msd-ramsees/30min`
- **Contact page:** Calendly inline widget embedded
- **All 5 System pages:** Calendly popup on CTA buttons

### 7. Service Worker Cache Management
- Network-first for HTML, cache-first for assets
- Bumped cache: v1 → v11 across sessions
- `reg.update()` on every page load + `controllerchange` auto-reload

---

## What Was Done — Session 2 (2026-05-03)

### 8. Navy + Silver Color Scheme (All 24 Pages)
- Background: `#010B1C` (deep navy matching team card design)
- Accent/text: `#B8B8B8` silver / `#D4D4D4` chrome
- Applied across all 24 HTML files

### 9. New HQ Transparent Logo
- Source: `97E80F21-939A-47A8-B190-6A1D1784DCA3.PNG`
- Background removed using brightness-as-alpha technique
- Output: `logo.png` (4608×3072, fully transparent background)
- Replaced base64 SVG in navbar with `logo.png`
- Output: `LEOMAX_Logo_HQ_Transparent.png` (saved in `/Downloads/leomax/`)

### 10. Lion Head Icon
- Extracted lion head from logo, auto-cropped tight bounds
- Saved at 512×512 and 1024×1024
- Used as PWA app icons (`icons/icon-192.png`, `icons/icon-512.png`)
- Output: `LEOMAX_Icon_Lion_512.png` (saved in `/Downloads/leomax/`)

### 11. Team Section on Main Page
- Group photo banner (`team/team-office.png`)
- 4-column grid with all 14 member profile cards
- Hover overlay showing name + role
- Section intro: "Introducing the Leomax AI Advisory Board"
- Tagline: "Human-led. AI-powered. Built for growth."

### 12. Team Profile Cards — Cleaned
- Restored original photos from git history (commit `34743e0`)
- **Removed:** LEOMAX logo (top-left) — painted over with navy
- **Removed:** "LEADERSHIP PROFILE" text (top-right) — top 125px cleared
- **Preserved:** Original colors (natural skin tones, navy background, gold accents)
- Previous attempts at gold→silver conversion were reverted (was changing skin tones)

### 13. Standalone Team Page (`team.html`)
- Full page accessible at `/team.html`
- Founder section (Dr. Anas) + Regional Advisory Board grid
- Each member card shows: photo, name, role
- Clicking a card → modal popup shows full profile card image
- Dr. Anas card → links to `company-founder.html`
- Escape key / backdrop click closes modal
- Full footer with all navigation links

### 14. Clickable Team Cards on Main Page
- Each team member photo is clickable
- Opens a full-screen modal with their profile card
- Dr. Anas → navigates to `company-founder.html`

### 15. Founder Page Updated
- New photo: `team/dr-anas-photo.png` (navy suit headshot, `IMG_5169 2.PNG`)
- Replaced old `PHOTO-2025-12-12-11-14-59.jpg` reference

### 16. "Our Team" Added to Footer (All 24 Pages)
- Added under Company section in every page footer
- Links to `team.html`

---

## Color Palette

| Variable     | Value       | Usage                        |
|--------------|-------------|------------------------------|
| `--black`    | `#010B1C`   | Page background (deep navy)  |
| `--dark`     | `#060F1F`   | Section backgrounds          |
| `--charcoal` | `#0D1E35`   | Card backgrounds             |
| `--silver`   | `#B8B8B8`   | Accent text, borders, tags   |
| `--chrome`   | `#D4D4D4`   | Hover states, secondary text |
| `--white`    | `#FFFFFF`   | Headings                     |

---

## Team — AI Advisory Board

| Member               | Role                      | Region        |
|----------------------|---------------------------|---------------|
| Dr. Anas Elimam      | Founder & CEO             | Sudan/KSA/EGY |
| Kaya Haddad          | Chief Strategy Officer    | Lebanon       |
| Rita Nasser          | Head of Innovation        | Syria         |
| Rami Al Khalidi      | Operations Director       | Jordan        |
| Haya Al Kuwari       | Business Development Lead | KSA           |
| Laith Darwish        | AI & Technology Director  | UAE           |
| Hani El Masry        | Chief Financial Officer   | Egypt         |
| Kamilia Fouad        | Marketing & Brand Director| Egypt         |
| Yasin El Sherif      | Supply Chain Director     | Egypt         |
| Mashari Al Otaibi    | Investment Director       | KSA           |
| Elhanouf Al Harbi    | Sustainability Director   | KSA           |
| Mira Al Mansoori     | Partnerships Director     | UAE           |
| Miral Al Hakimi      | Regional Expansion Lead   | Egypt         |
| Valeria Moreno       | Executive Assistant       | Egypt         |

---

## Calendly
**URL:** `https://calendly.com/anas-msd-ramsees/30min`
- Contact page: inline widget (dark theme)
- System pages: popup widget on CTA buttons

---

## Install as App on Phone

**iOS (Safari):**
1. Open site in Safari
2. Tap Share → "Add to Home Screen"

**Android (Chrome):**
1. Open site in Chrome
2. Tap "Install App" banner

---

---

## What Was Done — Session 3 (2026-05-03)

### 17. Team Card Images — HTML Bug Fix
- **Root cause:** All 13 non-founder `<img>` tags in the team grid had **duplicate `style=` attributes**
- Browsers only read the first `style` attribute — `style="cursor:pointer"` was first, so `width:100%;aspect-ratio:3/4;object-fit:cover` were ignored
- Dr. Anas card was correct (had sizing in first style), all others were broken
- **Fix:** Merged into single correct style with `object-position:top` added so face is visible when cropped
- SW cache bumped: v11 → v12

### 18. Team Photos Restored to Original Colors
- Replaced all 13 processed team member PNGs with the original unmodified ChatGPT profile card images
- Full mapping confirmed by viewing each thumbnail:
  - `10_49_49` → dr-anas.png, `10_49_55` → kaya-haddad.png, `10_50_00` → rita-nasser.png
  - `10_50_06` → rami-khalidi.png, `10_50_12` → haya-kuwari.png, `10_50_19` → laith-darwish.png
  - `10_50_26` → hani-masry.png, `10_50_32` → kamilia-fouad.png, `10_50_38` → yasin-sherif.png
  - `10_50_43` → mashari-otaibi.png, `10_50_49` → elhanouf-harbi.png, `10_50_55` → mira-mansoori.png
  - `10_51_02` → miral-hakimi.png, `10_51_09` → valeria-moreno.png
- Natural skin tones and clothing colors fully preserved (no processing applied)
- SW cache bumped: v12 → v13

### 19. About Section Logo — Black Background Fixed
- The About section card was rendering a base64-encoded PNG with black background
- **Fix:** Replaced `<img src="data:image/png;base64,...">` with `<img src="logo.png">`
- `logo.png` is RGBA with 95.5% transparent pixels — blends seamlessly into navy background
- Two base64 images were found and replaced
- SW cache bumped: v13 → v14

---

## Known Notes
- SW cache v14 — updates automatically on every page load
- If old content appears: close browser completely and reopen
- All 24 pages have consistent navy + silver theme
- Team card photos: original ChatGPT profile card images (unmodified, natural colors)
- About section logo: transparent PNG, no black background
