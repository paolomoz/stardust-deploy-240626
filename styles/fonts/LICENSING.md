# Font Licensing — REQUIRED before publishing to aem.live

This site self-hosts **proprietary** brand webfonts for design fidelity. They are
**not** redistributable under an open license. Do **not** publish to `aem.live`
until a webfont / domain-embedding license is confirmed for each face below.

| File | Family | Foundry | License status |
|---|---|---|---|
| `FKRomanStandard-Regular.woff2` | FK Roman Standard | Florian Karsten (foundry-direct) | ⚠️ UNCONFIRMED — license required |
| `FKRomanStandard-Bold.woff2` | FK Roman Standard | Florian Karsten (foundry-direct) | ⚠️ UNCONFIRMED — license required |
| `SharpEarth-Regular.woff2` | Sharp Earth | Sharp Type Co. | ⚠️ UNCONFIRMED — license required |
| `SharpEarth-Bold.woff2` | Sharp Earth | Sharp Type Co. | ⚠️ UNCONFIRMED — license required |
| `SharpEarth-Italic.woff2` | Sharp Earth | Sharp Type Co. | ⚠️ UNCONFIRMED — license required |

## Remove path (if licensing cannot be confirmed)

1. Delete the five `.woff2` files in this directory.
2. Delete the five brand `@font-face` rules at the top of `styles/styles.css`
   (the `"FK Roman Standard"` and `"Sharp Earth"` blocks).
3. The font stacks (`--serif`, `--body`) then fall back to the metric-matched
   `"Times New Roman"` / `"Arial"` overrides already in `styles.css` — zero CLS,
   generic glyphs. No further changes needed.
