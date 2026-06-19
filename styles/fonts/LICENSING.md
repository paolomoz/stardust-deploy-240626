# Font licensing — REQUIRED before going live

This site self-hosts a **proprietary** brand typeface for fidelity in a
presales / redesign preview. **Do not publish to `aem.live`** until the
webfont / embedding license is confirmed.

| File | Family | Foundry / owner | License | Status |
|---|---|---|---|---|
| `NetflixSans_W_Rg.woff2` | Netflix Sans (400) | Netflix (designed by Dalton Maag) | Proprietary | ⚠️ UNCONFIRMED |
| `NetflixSans_W_Md.woff2` | Netflix Sans (500) | Netflix (designed by Dalton Maag) | Proprietary | ⚠️ UNCONFIRMED |
| `NetflixSans_W_Bd.woff2` | Netflix Sans (700) | Netflix (designed by Dalton Maag) | Proprietary | ⚠️ UNCONFIRMED |

Netflix Sans is a custom corporate typeface and is **not** redistributable under
an open license (no OFL/Apache). It is included here purely so the converted
page matches the Netflix brand for review.

## Remove path (if licensing cannot be confirmed)

1. Delete `styles/fonts/NetflixSans_W_Rg.woff2`, `NetflixSans_W_Md.woff2`,
   `NetflixSans_W_Bd.woff2`.
2. In `styles/styles.css`, delete the three `@font-face { font-family: "Netflix Sans"; … }`
   rules (keep the metric-matched `"Arial"` override `@font-face`).
3. The `--font` stack (`"Netflix Sans", system-ui, "Helvetica Neue", arial, …`)
   then falls back to the metric-matched local Arial — **zero layout shift**,
   the page keeps its rhythm, only the display face changes.
