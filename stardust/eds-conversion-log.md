# Eli Lilly — EDS conversion log

Source prototype: `stardust/prototypes/home-A-proposed.html` (Variant A). Single-page conversion.

## Blocks (one prototype <section> = one block)
- `hero` — full-bleed photo hero, ultra headline (h1), sub, 2 CTAs (white accent + ghost).
- `mission` — warm-bg serif lead + 3 routing cards (image, h3, body, "go" text link).
- `conditions` — eyebrow + serif h2 + intro + 3 full-card photo tiles (whole tile is the anchor).
- `band` — full-bleed photo band, serif h2, body, white CTA.
- `testi` — dark testimonial: red quote mark, serif blockquote, cite, "▶ Watch patient story" CTA, portrait.
- `about` — eyebrow + serif h2 + intro + 3-up stats band (number + label) + 3 feature cards.

The boilerplate `hero` block was replaced. `fragment` and `section-metadata` blocks kept untouched.

## Foundation
- `:root` tokens lifted from prototype (--red #D31710, --ink, --warm, --serif, --sans, --ultra, --maxw 1240, --pad 64).
- Reset, EDS section scaffold, global `.wrap` + `.eyebrow`, global button system mapping
  `<strong><a>`→btn-primary (red), `<em><a>`→btn-secondary (ghost; light-on-dark on hero/band),
  `<em><strong><a>`→btn-accent (white fill = prototype's btn-light).
- `img { display:block; max-width:100%; height:auto }` (#36).

## Fonts (all OFL / SIL 1.1 — NO licensing alert required)
Self-hosted in `styles/fonts/`:
- Archivo (body/sans) — variable woff2.
- Archivo Black (display/ultra, used in hero h1 + stat numbers) — static 400 woff2.
- EB Garamond (serif, used for leads/headings) — variable + italic woff2.
Metric-matched fallbacks computed with fonttools:
- "Arial" override (body sans): size-adjust 119.62% / ascent 73.40% / descent 17.56%.
- "Archivo Black Fallback" (above-fold hero h1 display): size-adjust 147.71% / ascent 59.44% / descent 14.22%.
- "Times New Roman" override (serif): size-adjust 129.81% / ascent 77.57% / descent 22.96%.
Body defaults to arial; `body.session` (set by ak.js) switches to var(--sans). No font lines in head.html.

## Chrome
- `fragments/header.html` — absolute nav (logo pill + control buttons + Sign In), CSS-only, buttons are type="button".
- `fragments/footer.html` — red footer, 4-col link grid, lifted footer's own box styles onto footer.footer.

## Content
- DA body fragment at `content/eli-lilly/index.html`: metadata block (Title from h1, Description), exactly one h1, section titles h2, card titles h3.
- Images are real external Adobe AEM Cloud delivery URLs (.avif) authored as content <img> — fully qualified, left as-is.
- Stats authored as "150 · Years making medicine" delimited lines (#50); about block parses on the · delimiter.

## QA
- npm lint clean (eslint blocks, stylelint blocks + styles).
- Local harness (port 3420) rendered headless: h1=1, h2=3; decoration markers confirmed (3 routes, 3 cond tiles, 3 stats, 3 feats, blockquote+portrait, btn-primary/secondary/accent applied).
- Visual check: all 6 sections match the prototype design.
- stardust:diff probes NOT run — Playwright not installed in this environment. Substituted headless-Chrome marker counts + per-section screenshot review.
- URL gate clean: no absolute origins in blocks/.

## Notes for next person
- The `overused-font` impeccable hook flags on "Arial" in styles.css are false positives — Arial is only the metric-matched fallback face, never the displayed brand font.
- Local QA aem dev server died once mid-session (port 3420); relaunched detached.
