# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, hot reload)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint (0 warnings allowed)
```

No test suite is configured.

## Architecture

React + Vite SPA, no TypeScript, no routing library. The entire app is a single-page flow controlled by a step state machine in `src/App.jsx`.

### Step flow
`welcome` → `breed` → `gender` → `thinking` → `results`

Each step is a full-screen component swapped in `src/App.jsx`. The logo header (`/anipet.png`) is always visible above the step content. State (`dogType`, `gender`) is lifted to App and passed down as props.

### Key files
- `src/data/names.js` — dog name database keyed by `names[gender][dogType]`. `getRandomNames(gender, dogType, count)` shuffles and returns a subset.
- `src/utils/generateShareImage.js` — Canvas 2D image generator (1080×1080 PNG). Draws background, logo, illustrated dog face, name boxes, CTA, and URL. Exports `generateShareImage({ favoriteNames, gender, dogOption })` returning `{ blob, objectUrl }`.
- `src/components/ShareModal.jsx` — Share flow: generates canvas image on mount, detects `navigator.canShare` for mobile native share (passes PNG file), falls back to download + text links on desktop.

### Styling conventions
- Global CSS variables in `src/index.css`: `--green` (#b6d267), `--pink` (#e04792), `--pink-dark`, `--white`, `--dark-text`, `--shadow-card` (4px pixel shadow, no blur), `--shadow-btn` (3D bottom shadow).
- Polka-dot background via `radial-gradient` on `body`.
- All UI is RTL Hebrew (`dir="rtl"`). Fonts: Rubik 900 (headings), Varela Round (body/buttons), Press Start 2P (step numbers).
- 3D button press: `box-shadow: 0 6px 0 var(--pink-dark)` + `translateY(6px)` on `:active`.
- Hard pixel shadows throughout — no Gaussian blur on UI elements.

### Dog name picker in share image
`generateShareImage` accepts a `dogOption` param: `{ type: 'preset', index: 0–3 }` or `{ type: 'photo', src: '<objectURL>' }`. The drawn dog face uses color variants for presets; photo uploads are clipped into a circle.
