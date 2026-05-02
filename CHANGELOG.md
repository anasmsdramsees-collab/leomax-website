# LEOMAX Website — Session Log

**Date:** 2026-05-02  
**Repo:** https://github.com/anasmsdramsees-collab/leomax-website  
**Live URL:** https://anasmsdramsees-collab.github.io/leomax-website/

---

## What Was Done

### 1. PWA Setup
- Created `manifest.json` — app name, theme color, icons
- Created `sw.js` — Service Worker for offline support
- Added PWA meta tags to all 23 HTML files
- Created `icons/icon-192.png` and `icons/icon-512.png`
- Users can now install the site as an app on iOS & Android

### 2. Deployment to GitHub Pages
- Installed Node.js via nvm
- Installed and configured `gh` CLI
- Created GitHub repo: `anasmsdramsees-collab/leomax-website`
- Enabled GitHub Pages on `main` branch
- Site is live at the URL above

### 3. Mobile Responsive CSS
- Added `@media (max-width: 768px)` to all 23 pages
- Added `@media (max-width: 390px)` for small phones
- Fixed nav padding, grid layouts, section padding
- Inline grids override with `!important`
- Footer stacks to single column on mobile
- Footer links made larger and more visible

### 4. Navigation Links Fixed (Main Page)
All broken `href="#"` and `<button>` elements now link to correct pages:

| Element | Destination |
|---|---|
| "Start Transformation" (nav) | `company-contact.html` |
| "Book a Discovery Call" | `company-contact.html` |
| "Our Approach" | `company-process.html` |
| "Start Your Transformation" (CTA) | `company-contact.html` |
| System Card 01 | `system-01-growth.html` |
| System Card 02 | `system-02-ai.html` |
| System Card 03 | `system-03-marketing.html` |
| System Card 04 | `system-04-content.html` |
| System Card 05 | `system-05-launch.html` |
| Footer — Growth System | `system-01-growth.html` |
| Footer — AI Transformation | `system-02-ai.html` |
| Footer — Marketing Engine | `system-03-marketing.html` |
| Footer — Content System | `system-04-content.html` |
| Footer — Launch System | `system-05-launch.html` |
| Footer — About LEOMAX | `company-about.html` |
| Footer — Our Process | `company-process.html` |
| Footer — Case Studies | `company-case-studies.html` |
| Footer — Dr. Anas Imam | `company-founder.html` |
| Footer — Contact | `company-contact.html` |

### 5. Full Navigation Footer on All Sub-Pages
Replaced simple footer on all 23 sub-pages with a full 3-column footer:
- **Column 1:** Systems (5 links)
- **Column 2:** Company (5 links)
- **Column 3:** Contact info + Home button

### 6. Calendly Integration
**URL:** `https://calendly.com/anas-msd-ramsees/30min`

- **Contact page** (`company-contact.html`): Calendly inline widget embedded directly, replacing the static form
- **All 5 System pages**: Calendly popup button on both "Book This System" and "Book Your Transformation" CTAs

### 7. Founder Photo
- Replaced SVG placeholder in `company-founder.html` with actual photo
- Image file: `PHOTO-2025-12-12-11-14-59.jpg` (already in website folder)

### 8. Service Worker Cache Management
- Bumped cache versions: `v1` → `v2` → `v3` → `v4` → `v5`
- Changed HTML strategy: **network-first** (always fetch latest)
- Changed assets strategy: **cache-first** (fast load for images)
- Added `reg.update()` on every page load to force SW refresh
- Added `controllerchange` listener to auto-reload when new SW activates

---

## File Structure

```
website/
├── LEOMAX_Website_Design.html   ← Main homepage
├── company-about.html
├── company-case-studies.html
├── company-contact.html         ← Calendly inline embed
├── company-founder.html         ← Dr. Anas photo
├── company-process.html
├── system-01-growth.html        ← Calendly popup
├── system-02-ai.html            ← Calendly popup
├── system-03-marketing.html     ← Calendly popup
├── system-04-content.html       ← Calendly popup
├── system-05-launch.html        ← Calendly popup
├── case-*.html (14 files)
├── manifest.json
├── sw.js
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── PHOTO-2025-12-12-11-14-59.jpg
```

---

## To Install as App on Phone

**iOS (Safari):**
1. Open the site in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

**Android (Chrome):**
1. Open the site in Chrome
2. Tap the "Install App" banner (appears automatically)

---

## Known Notes
- If old content is cached, close browser completely and reopen
- Service Worker auto-updates on every page load (v5)
- Calendly uses dark theme matching the site design
