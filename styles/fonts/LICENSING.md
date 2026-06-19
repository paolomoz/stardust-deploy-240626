# ⚠️ FONT LICENSING — REQUIRED BEFORE GOING LIVE

This project self-hosts **proprietary commercial typefaces** purely to reproduce the
Pebl (Velocity Global) brand for a presales / preview deploy. These faces are **not**
open-license (OFL/Apache) and their webfont embedding rights must be confirmed by the
brand owner before publishing to `aem.live`.

| File | Family | Style / Weight | Foundry (commercial) | Status |
|---|---|---|---|---|
| `FKRomanStandard-Regular.woff2` | FK Roman Standard | 400 / normal | Florian Karsten (commercial) | ⛔ license unconfirmed |
| `FKRomanStandard-Bold.woff2` | FK Roman Standard | 700 / normal | Florian Karsten (commercial) | ⛔ license unconfirmed |
| `SharpEarth-Regular.woff2` | Sharp Earth | 400 / normal | Sharp Type Co. (commercial) | ⛔ license unconfirmed |
| `SharpEarth-Bold.woff2` | Sharp Earth | 700 / normal | Sharp Type Co. (commercial) | ⛔ license unconfirmed |
| `SharpEarth-Italic.woff2` | Sharp Earth | 400 / italic | Sharp Type Co. (commercial) | ⛔ license unconfirmed |

## Do not publish until

A valid **webfont / embedding license** for both **FK Roman Standard** and **Sharp Earth**
on the served domain is confirmed in writing.

## Remove path (if licensing cannot be confirmed)

1. Delete the five `.woff2` files in this folder.
2. In `styles/styles.css`, delete the five brand `@font-face` rules (FK Roman Standard +
   Sharp Earth) and the licensing banner at the top.
3. Leave the two metric-matched fallback `@font-face` rules (`"Times New Roman"` and
   `"Arial"`) in place — the `--serif` / `--body` stacks then fall back cleanly to those
   system faces with the brand's line metrics preserved (zero layout shift).

The metric-matched fallbacks mean the page degrades gracefully to Times (display) and
Arial (body) without breaking layout — it just loses the bespoke brand letterforms.
