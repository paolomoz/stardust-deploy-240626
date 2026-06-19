# Font licensing — REQUIRED BEFORE GOING LIVE

This site self-hosts brand webfonts for visual fidelity. One of them is
**proprietary** and must have its embedding/redistribution license confirmed
for the served domain before publishing to `aem.live`.

| File | Family | Foundry / License | Status |
|---|---|---|---|
| `qualcommnext-400.woff2` | QualcommNext (display, 400) | Qualcomm — **proprietary corporate typeface** | ⚠️ LICENSE UNCONFIRMED |
| `qualcommnext-500.woff2` | QualcommNext (display, 500) | Qualcomm — **proprietary corporate typeface** | ⚠️ LICENSE UNCONFIRMED |
| `roboto-flex-variable.woff2` | Roboto Flex (body) | Google — Apache License 2.0 | ✅ OK to redistribute |

## Why self-hosted anyway

The default is brand-faithful. Falling back to a system font for the display
face reads as broken to the client. So the proprietary face is lifted from the
prototype and self-hosted — but the licensing obligation is surfaced loudly
(this file, the banner at the top of `styles/styles.css`, the conversion log,
and the deploy hand-off message).

## Remove path (if licensing cannot be confirmed)

1. Delete `styles/fonts/qualcommnext-400.woff2` and `styles/fonts/qualcommnext-500.woff2`.
2. Delete the two `@font-face { font-family: "QualcommNext"; … }` rules in `styles/styles.css`.
3. The `--display` stack `"QualcommNext", "Arial Narrow", arial, sans-serif`
   then falls back to the metric-matched **"Arial Narrow"** (condensed) face —
   no layout shift, width-class preserved. Headings keep a condensed character.

Roboto Flex (Apache 2.0) may stay.
