/**
 * hero — typographic lead (the page <h1>) with eyebrow, lede, CTA and a captioned figure.
 *
 * Authored shape (flexible — read by querying, not by fixed row index):
 *   - eyebrow text (short, link-free <p>)
 *   - <h1> headline (may contain <em> for the italic accent)
 *   - lede paragraph (sentence-length, link-free)
 *   - CTA: <strong><a>…</a></strong>  (cloned into .actions)
 *   - optional caption text for the figure (link-free, after the CTA)
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

  const heading = nodes.find((n) => n.matches('h1, h2, h3') || n.querySelector('h1, h2, h3'));
  const headingEl = heading && (heading.matches('h1, h2, h3') ? heading : heading.querySelector('h1, h2, h3'));
  const links = nodes.filter((n) => n.matches('a') || n.querySelector('a'));
  const textPs = nodes.filter((n) => n.matches('p') && !n.querySelector('a') && n !== heading);

  // order: eyebrow (short, first), lede (after heading), caption (last)
  const eyebrowText = textPs[0] ? textPs[0].textContent.trim() : '';
  const ledeText = textPs[1] ? textPs[1].textContent.trim() : '';
  const capText = textPs[2] ? textPs[2].textContent.trim() : 'Feeding the world, like family.';

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (eyebrowText) {
    const eb = document.createElement('p');
    eb.className = 'eyebrow';
    eb.textContent = eyebrowText;
    wrap.append(eb);
  }

  if (headingEl) {
    const h1 = document.createElement('h1');
    const inner = headingEl;
    [...inner.childNodes].forEach((n) => h1.append(n.cloneNode(true)));
    wrap.append(h1);
  }

  const meta = document.createElement('div');
  meta.className = 'meta';
  if (ledeText) {
    const lede = document.createElement('p');
    lede.className = 'lede';
    lede.textContent = ledeText;
    meta.append(lede);
  }
  const ctaLink = links[0] && (links[0].matches('a') ? links[0] : links[0].querySelector('a'));
  if (ctaLink) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.append(ctaLink.cloneNode(true));
    meta.append(actions);
  }
  wrap.append(meta);

  const figure = document.createElement('div');
  figure.className = 'figure';
  figure.setAttribute('role', 'img');
  figure.setAttribute('aria-label', 'A family shares a meal together');
  const figcap = document.createElement('span');
  figcap.className = 'figcap';
  figcap.textContent = capText;
  figure.append(figcap);
  wrap.append(figure);

  block.replaceChildren(wrap);
}
