/**
 * demo — full-bleed yellow CTA takeover: eyebrow, h2, body, CTA. Centered.
 *
 * Authoring:
 *   - eyebrow line
 *   - heading (-> <h2>)
 *   - body paragraph
 *   - CTA paragraph (link-bearing; <strong><a> -> .btn.btn-primary)
 */

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];

  let eyebrow;
  let heading;
  let body;
  let ctaCell;
  cells.forEach((cell) => {
    const h = cell.querySelector('h1, h2, h3, h4, h5, h6');
    if (h && !heading) { heading = h.textContent.trim(); return; }
    if (cell.querySelector('a') && !ctaCell) { ctaCell = cell; return; }
    const t = cell.textContent.trim();
    if (!t) return;
    if (!eyebrow && t.length < 60) { eyebrow = t; return; }
    if (!body) body = t;
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (eyebrow) {
    const ey = document.createElement('span');
    ey.className = 'eyebrow';
    ey.textContent = eyebrow;
    wrap.append(ey);
  }
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading;
    wrap.append(h2);
  }
  if (body) {
    const p = document.createElement('p');
    p.textContent = body;
    wrap.append(p);
  }
  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    wrap.append(actions);
  }

  block.replaceChildren(wrap);
}
