# Font licensing

| File | Family | Foundry | Status |
|---|---|---|---|
| (none shipped) | Helvetica Neue LT Pro | Monotype / Adobe Fonts (Typekit) | PROPRIETARY — not self-hosted |

## Summary

The Smartly brand face named in the prototype is **Helvetica Neue LT Pro**, loaded
from the Adobe Fonts / Typekit CDN. It is a **proprietary, commercially-licensed**
typeface and is **not redistributable** — it cannot be self-hosted on the served
domain without a confirmed webfont/embedding license.

This build therefore ships **no proprietary woff2**. The brand font stack
(`--font` in `styles/styles.css`) falls back to a metric-matched system
**Helvetica / Arial** stack (same sans classification and width class), so the page
renders faithfully and license-clean by default.

## Go-live decision (`aem.live`)

- **License confirmed:** obtain a self-hostable `Helvetica Neue LT Pro` woff2,
  drop it in `styles/fonts/`, and add an `@font-face { font-family: "Helvetica Neue LT Pro"; ... }`
  to `styles/styles.css`. It is already the first family in the `--font` stack, so
  it activates automatically with no further edits.
- **License NOT confirmed (default / remove path):** ship as-is. The system
  Helvetica/Arial fallback is the intended license-clean default. Do not load the
  Typekit CDN stylesheet (it adds external coupling + CLS and embedding may still be
  out of license for this domain).
