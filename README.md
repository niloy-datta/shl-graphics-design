# SHL GROUP — Executive Leadership Poster Design

Premium executive announcement poster for **SHL GROUP** welcoming **Sara Huang** (Supply Chain Manager, Shanghai Office).

## Overview
- **Canvas Size:** 1080 × 1350 px (4:5 Aspect Ratio for LinkedIn / Social Media)
- **Design Standard:** Luxury editorial & corporate leadership typography (Cinzel, Cormorant Garamond, Plus Jakarta Sans)
- **Subject:** Sara Huang, Supply Chain Manager (20+ Years of Experience)
- **High-Res Export:** `shl-sara-huang-linkedin.png` (1080 × 1350 px)

## Project Structure
- `poster.html` — Master poster markup & design system
- `index.html` — Dev server redirect to `poster.html`
- `export.js` — Automated high-res Playwright PNG exporter
- `assets/`
  - `sara-huang.png` — Original portrait
  - `sara-huang-cutout.png` — Clean feathered alpha cutout
- `shl-sara-huang-linkedin.png` — Rendered production poster

## Quick Start

### 1. Start Live Dev Server
```bash
pnpm dev
# or: npm run dev
```
Serves at `http://127.0.0.1:5173/poster.html` with hot reloading.

### 2. Export Production PNG Poster
```bash
pnpm export
# or: node export.js
```
Captures the `#poster` element at exact 1080×1350 resolution to `shl-sara-huang-linkedin.png`.


## Shanghai background photography

- **Photographer:** Ted McDonnell / Pexels
- **Image:** [Aerial View of Shanghai Skyline at Night](https://www.pexels.com/photo/aerial-view-of-shanghai-skyline-at-night-32467111/)
- **License:** [Pexels License](https://www.pexels.com/license/) — usable for commercial marketing and social media; attribution appreciated, though not required.
- **Local asset:** `assets/shanghai-night.png` (downloaded once by the poster export workflow and committed to the repository).

The poster layers the photograph under dark navy gradients, leaving Sara Huang's authentic portrait and all typography clear. The editable poster remains `poster.html`, and GitHub Actions exports the 1080 × 1350 image to `shl-sara-huang-linkedin.png`.
