# EDS Conversion Log — Pebl (Velocity Global) "Variant D Refined"

Branch: `velocity-global-refined` (off `origin/eds-base`, the clean AuthorKit runtime).
Source prototype: `stardust/prototypes/home-D-refined.html` (single-file, inline `<style>`).
DA target: `velocity-global-refined/index` · ORG `paolomoz` · REPO `stardust-deploy-240626`.
Live (folder root): https://velocity-global-refined--stardust-deploy-240626--paolomoz.aem.page/velocity-global-refined/

## ⚠️ FONT LICENSING ALERT (proprietary faces — #80)

This site self-hosts TWO proprietary commercial typefaces for brand fidelity:
- **FK Roman Standard** (display serif) — Florian Karsten (commercial)
- **Sharp Earth** (body sans) — Sharp Type Co. (commercial)

**DO NOT PUBLISH TO aem.live until FK Roman + Sharp Earth embedding/webfont licenses
are confirmed.** Alert raised in three places: this log, the `styles/styles.css`
banner, and `styles/fonts/LICENSING.md` (which documents the remove path → falls back
to metric-matched Times / Arial).

## Block inventory (12 — one prototype `<section>` each)

| Block | Prototype section | Surface | Notes |
|---|---|---|---|
| `hero` | `.hero` | dark | Full-bleed cinematic VIDEO (signature). poster + muted autoplay loop playsinline; reduced-motion → poster still. Single page `<h1>`. |
| `trust` | `.trust` | dark | 12-logo wall (6×2). Logos fixed root-relative assets. |
| `metrics` | `.metrics` | mint | 3-number band; `<sup>` units; 3-col grid bleeds to dividers. |
| `capabilities` | `.section#capabilities` | mint | Ruled editorial list (roman i–vi generated) + your-team-mockup banner. |
| `meet-pebl` | `.meet` | dark | 2-col copy + pebl-og-img visual. |
| `hire` | `.hire` | mint | 2nd signature VIDEO (hire-anywhere.mp4); reduced-motion → poster. Dark-fill CTAs (accent). |
| `experience` | `.experience` | dark | Full-bleed content-3 photo + scrim. |
| `g2-proof` | `.g2` | mint | content-1 photo + text-link CTA (not a button). |
| `testimonial` | `.quote` | dark | Water-still bg + serif blockquote. |
| `insights` | `.insights` | mint | 3 photo-led cards; images mapped by index. |
| `faq` | `.faq-sec` | dark | `<details>` accordion, first open. |
| `endcta` | `.endcta` | mint | Mint drench, oversized FK Roman headline. |

## Decisions locked

- Block name = prototype section class, kebab-cased. Renamed reserved/ambiguous:
  `.meet`→`meet-pebl`, `.g2`→`g2-proof`, `.faq-sec`→`faq`, `.quote`→`testimonial`.
- VIDEO + IMAGE assets are FIXED block assets committed root-relative under
  `img/velocity-global-refined/` and referenced from block JS/CSS (#67). NOT
  author-swappable, NOT absolute origins. Faithful presales deploy.
- Fonts self-hosted in `styles/fonts/`, `@font-face` only in `styles.css`,
  `body.session` gate, metric-matched Arial (body) + Times (display) fallbacks.
  Computed metric overrides: Sharp Earth→Arial size-adjust 129.36% / asc 81.17% /
  desc 27.06%; FK Roman→Times size-adjust 146.04% / asc 65.74% / desc 21.91%.
- Buttons via the EDS author convention: `<strong><a>`→primary (mint),
  `<em><a>`→secondary (ghost / surface-aware outline), `<em><strong><a>`→accent
  (dark fill, used by hire + endcta on light grounds). The prototype's `.btn`
  system was lifted into the global button system mapped to these classes.
- Header/footer = static fragments (`fragments/header.html`, `fragments/footer.html`),
  CSS-only, asset paths rewritten to the branch host.
- Header CLS reserve: bare `header { min-height: 74px; background: arctic-900 }`
  matches the sticky nav so the late `postlcp.js` injection doesn't shift the hero
  (#81). Hero is full-bleed below a translucent sticky header.

## Images optimized

Large source PNG/JPG photos resized + recompressed via sips (content-1 2.9MB→263KB,
content-3 4MB→266KB, insight-eor 5.7MB→222KB, etc.). Big PNG photos → JPG. Videos
kept (hero-desktop 3.7MB, hero-mobile 1.3MB, hire-anywhere 5.6MB).

## Anti-patterns avoided

- #36 img reset `height:auto`; #40 NO `body{display:none}` gate (kept body visible,
  `body.session` is font-only); #62/#71 cell-cascade collector defaults across blocks;
  #67/#44 fixed assets root-relative (grep clean); #81 header height reserved;
  #35 exactly one `<h1>` (hero); #34 metadata block (Title/Description from `<h1>`);
  reduced-motion freezes BOTH videos to poster stills.

## Next person should know

- The two videos and the section photos live ONLY in the branch code under
  `img/velocity-global-refined/`. They are not in DA Media Bus.
- If fonts can't be licensed: follow `styles/fonts/LICENSING.md` remove path.
