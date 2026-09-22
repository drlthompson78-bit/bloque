# File manifest

## Product/source

- `.openai/hosting.json` — Sites static configuration and project ID.
- `dist/index.html` — complete static homepage and current copy/inline SVG.
- `dist/assets/18347.js` — split-text/vendor helper.
- `dist/assets/18348.js` — custom page transitions, scroll, sliders, video behavior.
- `dist/assets/22963.css` — custom responsive/layout overrides.
- `dist/assets/kravt.webflow.shared.299df9135.css` — original Webflow CSS/theme.
- `dist/assets/bloque-hero-light-v3.png` — current hero bitmap, light `#F3F4EF` ground.
- `dist/assets/bloque-hero-matte-v2.png` — prior darker matte hero variant.
- `dist/assets/bloque-hero.png` — first generated BLOQUE hero variant.
- `dist/assets/66a25fbf2aca7cf80f19e4d3_Ebene-541-edit.jpg` — original supplied KRAVT hero source.

## Supplied/vendor assets

`dist/assets/` also contains original AVIF/JPG/SVG case images, original Webflow/vendor JS, fonts embedded or referenced by CSS, GSAP, ScrollTrigger, Lenis, Barba, HLS and jQuery. Do not remove without visual regression checks.

## Review artifacts (untracked)

- `outputs/bloque-achtergrond.png` — first generated background.
- `outputs/bloque-achtergrond-mat-v2.png` — darker matte variant.
- `outputs/bloque-achtergrond-licht-v3.png` — current light-ground review image.
- `work/jordan.html`, `work/jordan.css` — downloaded reference page/CSS used to identify `#F3F4EF`.
- `work/*.tar.gz` — packaging archives for prior deployments; not required for source operation.

No credentials or tokens belong in this manifest.
