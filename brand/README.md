# BLOQUE header wordmark

`dist/assets/bloque-wordmark.svg` is the editable, outlined master. The same geometry is inline in the `.bloque-brand` link in `dist/index.html` so the header can follow the existing section themes. Keep both copies in sync when editing the outlines.

Typography reference: https://www.monks.com/, inspected 22 September 2026. Its stylesheet names the broad display face **Helvetica Now Extended**, weight 800. These capital outlines use that display face, with tighter spacing and a custom straight orange Q tail. Monks' own lowercase logo is a separate drawn SVG; this is a BLOQUE wordmark, not a claim that the two logos share identical custom geometry. There is no runtime webfont request for the wordmark.

The Q uses the same round body as O. Its straight diagonal is a separate path, filled with the site's `#FF4600`. Default ink is `#191B20`. The header turns white over dark content and uses white letters with a dark tail over orange content/menu panels so the accent remains legible. Styling, sizing and focus indication live in `dist/assets/bloque-header.css`.

The link uses the existing `#start` anchor and navigation-close handlers. The approved hero movie and its typography are independent of this header logo.
