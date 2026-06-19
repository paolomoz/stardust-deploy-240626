# EDS conversion log — Netflix (Variant B)

Source prototype: `stardust/prototypes/home-B-proposed.html`
Branch: `redesign-netflix` · DA target: `netflix/index`

## ⚠️ FONT LICENSING REQUIRED BEFORE GOING LIVE
This conversion self-hosts **Netflix Sans** (proprietary, Netflix / Dalton Maag —
NOT redistributable). Shipped for brand fidelity in this presales/redesign preview
ONLY. DO NOT publish to `aem.live` until the webfont/embedding license is confirmed.
Alert is duplicated in: `styles/styles.css` banner, `styles/fonts/LICENSING.md`,
and the hand-off message. Remove path documented in LICENSING.md (delete the three
Netflix Sans `@font-face` rules + woff2 → falls back to metric-matched local Arial,
zero CLS).

## Block inventory (one prototype <section> = one block)
| Prototype section | Block | Notes |
|---|---|---|
| `.hero` | `hero` | full-bleed key-art (CSS bg `/img/netflix/hero.jpg`), display H1 with red `<em>` accent, email capture (non-submitting `<div>` + `type=button`, CSP-safe). The page's single `<h1>`. |
| `.band[trending]` | `trending` | indexed Top-10; rank numbers are the layout; 5 posters (authored content imgs). |
| `.band[reasons]` | `reasons` | 4 statement rows (display H3 + body + poster art). |
| `.band[faq]` | `faq` | CSS-only accordion via native `<details>`/`<summary>` (first open). |
| `.band.closing` | `closing` | "Ready to watch?" H2 + email capture (heading authored as `<h2>` in content). |

Header/footer = static fragments (`fragments/header.html`, `fragments/footer.html`),
verbatim chrome, asset/link paths rewritten. Sign-In is a non-submitting `<button type=button>`.

## Foundation
- `:root` tokens lifted verbatim from prototype.
- Reset incl. `img { display:block; max-width:100%; height:auto }` (#36).
- EDS section scaffold + global `.btn`/`.btn-primary`/`.btn-secondary` system.
- Self-hosted Netflix Sans (400/500/700) in `styles/fonts/`; metric-matched local
  "Arial" fallback (size-adjust 139.55%, ascent 72.73%, descent 18.77%) computed
  with fontTools from NetflixSans_W_Rg.woff2. body→body.session swap, zero CLS.
- No font lines in `head.html`.
- Header is absolutely positioned over the hero (not in flow), so no min-height
  reserve needed (#81 N/A); kept `header { background: var(--bg) }`.

## Local QA (harness + headless Chrome via CDP, viewport 1440)
- h1=1, h2=4 (correct outline). bodyFont = Netflix Sans, body.session active.
- trending 5 rows / 5 posters, reasons 4 stmts, faq 5 details — no dropped content.
- All blocks' `.wrap` constrained to 1200px (no full-bleed leak at wide viewport).
- No stretched images. Full-page screenshot matches prototype section-by-section.
- Decode fix during QA: closing block queries for a heading element, so the
  content authors its title as `<h2>` (other blocks read head text positionally).

## Lint
- `npm run lint` clean for all generated blocks + styles.css. Stylelint rejects BEM
  `__`, so all `__` class names were converted to single-hyphen kebab.
- One pre-existing lint error in `blocks/section-metadata/section-metadata.css`
  (boilerplate, untouched — no-descending-specificity).
