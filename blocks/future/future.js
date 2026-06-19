/**
 * future — dark maroon band: section head (02) + 2-col body (prose + CTA | image figure).
 *
 * Authored shape:
 *   - <h2> section title
 *   - body paragraph
 *   - CTA: <strong><a>…</a></strong>
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
  const bodyP = nodes.find((n) => n.matches('p') && !n.querySelector('a') && n !== heading);
  const linkNode = nodes.find((n) => n.matches('a') || n.querySelector('a'));
  const ctaLink = linkNode && (linkNode.matches('a') ? linkNode : linkNode.querySelector('a'));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const head = document.createElement('div');
  head.className = 'head';
  const idx = document.createElement('div');
  idx.className = 'idx';
  idx.textContent = '02';
  const ht = document.createElement('div');
  ht.className = 'ht';
  if (headingEl) {
    const h2 = document.createElement('h2');
    [...headingEl.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    ht.append(h2);
  }
  head.append(idx, ht);
  wrap.append(head);

  const bodyRow = document.createElement('div');
  bodyRow.className = 'future-body';
  const col = document.createElement('div');
  if (bodyP) {
    const p = document.createElement('p');
    p.textContent = bodyP.textContent.trim();
    col.append(p);
  }
  if (ctaLink) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.append(ctaLink.cloneNode(true));
    col.append(actions);
  }
  const figure = document.createElement('div');
  figure.className = 'figure';
  figure.setAttribute('role', 'img');
  figure.setAttribute('aria-label', 'New Tyson chicken products');
  bodyRow.append(col, figure);
  wrap.append(bodyRow);

  block.replaceChildren(wrap);
}
