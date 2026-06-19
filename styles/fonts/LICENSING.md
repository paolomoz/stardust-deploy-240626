# ⚠️ FONT LICENSING REQUIRED BEFORE GOING LIVE

This site self-hosts **proprietary** brand webfonts lifted from the DevRev redesign
prototype (`stardust/prototypes/home-B-proposed.html`). They ship for visual fidelity,
but **do not publish to `aem.live` until the webfont/embedding license is confirmed**
for each face.

| File | Family | Weight | Foundry / Source | License status |
|---|---|---|---|---|
| chip-display-600.woff2 | Chip Display | 600 | Proprietary (DevRev brand; from `ChipDisp_Semibold.otf`) | ⛔ UNCONFIRMED |
| chip-display-700.woff2 | Chip Display | 700 | Proprietary (DevRev brand; from `ChipDisp_Bold.otf`) | ⛔ UNCONFIRMED |
| chip-text-400.woff2 | Chip Text | 400 | Proprietary (DevRev brand; from `ChipText_Regular.otf`) | ⛔ UNCONFIRMED |
| chip-text-500.woff2 | Chip Text | 500 | Proprietary (DevRev brand; from `ChipText_Medium.otf`) | ⛔ UNCONFIRMED |
| chip-text-600.woff2 | Chip Text | 600 | Proprietary (DevRev brand; from `ChipText_Semibold.otf`) | ⛔ UNCONFIRMED |
| chip-mono-400.woff2 | Chip Mono | 400 | Proprietary (DevRev brand; from `ChipMono_Regular.otf`) | ⛔ UNCONFIRMED |

The prototype's font stacks also name **Degular / Degular Display / Degular Mono**
(Pangram Pangram — commercial license) as secondary fallbacks. Those files are NOT
shipped; if "Chip" is unavailable on a client machine the stack degrades to the
metric-matched system fallback.

## Remove path (if licensing cannot be confirmed)

1. Delete the six `chip-*.woff2` files in this folder.
2. Delete the six `@font-face { font-family: "Chip …" }` blocks in `styles/styles.css`
   (the brand-webfont section, below the licensing banner).
3. The `--disp` / `--text` / `--mono` stacks then fall back to the metric-matched
   `Chip Display Fallback` / `Arial` / `Chip Mono Fallback` system faces already
   declared in `styles.css` — zero layout shift, system rendering.
