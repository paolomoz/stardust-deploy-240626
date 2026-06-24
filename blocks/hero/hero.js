/**
 * hero — full-bleed feature banner with a single decisive product story.
 *
 * Authoring (flat, one cell): eyebrow, the page <h1>, a lede <p>, and a CTA
 * paragraph (primary <strong><a>, secondary <em><a>). Reads by querying so it
 * tolerates both the rich multi-row shape and the DA-flattened single cell.
 * The background is a fixed brand asset painted by hero.css (root-relative).
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out.length ? out : [...block.children];
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const headingSrc = nodes.find((n) => n.matches('h1, h2, h3, h4, h5, h6'));
  const paras = nodes.filter((n) => n.matches('p'));
  const ctaP = paras.find((p) => p.querySelector('a'));
  const textPs = paras.filter((p) => !p.querySelector('a'));
  const eyebrow = textPs[0];
  const lede = textPs[1];

  const inner = document.createElement('div');
  inner.className = 'wrap hero-inner';

  if (eyebrow && lede) {
    const eb = document.createElement('span');
    eb.className = 'eyebrow';
    eb.textContent = eyebrow.textContent.trim();
    inner.append(eb);
  }

  const h1 = document.createElement('h1');
  const hSrc = headingSrc && (headingSrc.querySelector('h1,h2,h3,h4,h5,h6') || headingSrc);
  if (hSrc) [...hSrc.childNodes].forEach((n) => h1.append(n.cloneNode(true)));
  inner.append(h1);

  if (lede) {
    const p = document.createElement('p');
    [...lede.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    inner.append(p);
  }

  if (ctaP && ctaP.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'hero-actions';
    [...ctaP.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    inner.append(actions);
  }

  const bg = document.createElement('div');
  bg.className = 'hero-bg';
  // The hero background is AUTHORABLE: an authored <picture>/<img> in the cell
  // becomes the background (in content → authorable, in .plain.html, carries
  // alt). If none is authored, hero.css paints the fixed brand asset fallback.
  const picSrc = nodes.find((n) => n.matches('picture, img') || n.querySelector?.('picture, img'));
  if (picSrc) {
    const media = picSrc.matches('picture, img') ? picSrc : picSrc.querySelector('picture, img');
    bg.append(media.cloneNode(true));
  }
  const scrim = document.createElement('div');
  scrim.className = 'hero-scrim';

  block.replaceChildren(bg, scrim, inner);
}
