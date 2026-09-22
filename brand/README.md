# BLOQUE header wordmark

`dist/assets/bloque-wordmark.svg` is the editable, outlined master. The same geometry is inline in the `.bloque-brand` link in `dist/index.html` so the header can follow the existing section themes. Keep both copies in sync when editing the outlines.

Typography reference: https://www.monks.com/, inspected 22 September 2026. Its stylesheet names the broad display face **Helvetica Now Extended**, weight 800. These capital outlines use that display face, with tighter spacing and a custom straight orange Q tail. Monks' own lowercase logo is a separate drawn SVG; this is a BLOQUE wordmark, not a claim that the two logos share identical custom geometry. There is no runtime webfont request for the wordmark.

The Q uses the same round body as O. Its straight diagonal begins inside the counter and crosses the bowl in a continuous, wider stroke, filled with the site's `#FF4600`. A small outlined copyright mark (©) sits above and to the right of E. Both details are vector paths. The header reserves space for the mark while keeping the original size of the six letters. Default ink is `#191B20`. The header turns white over dark content and uses white letters with a dark tail over orange content/menu panels so the accent remains legible. Styling, sizing and focus indication live in `dist/assets/bloque-header.css`.

The link uses the existing `#start` anchor and navigation-close handlers. The approved hero movie and its typography are independent of this header logo.

## Page typography

The page text now uses Helvetica Now, matching the Monks reference's regular (400) and medium (500) text faces. The WOFF2 files are served locally from `dist/assets/fonts/`, preloaded in the document head, and assigned in `dist/assets/bloque-typography.css`. Their original font metadata is retained. Existing type sizes, weights and explicit headline lines remain in the original layout rules.

The two source resources inspected on 22 September 2026 were:
- Regular: https://www.monks.com/themes/custom/monks/static/fonts/5c2e1d99.woff2
- Medium: https://www.monks.com/themes/custom/monks/static/fonts/882730d9.woff2

Page animation initialization waits for `document.fonts.ready` so text splitting and scroll positions are measured with the final typeface.
