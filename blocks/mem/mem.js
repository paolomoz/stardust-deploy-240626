/**
 * mem — 2-column memory explainer: text column (eyebrow, h2, body, CTA) + image.
 *
 * Authoring:
 *   - eyebrow line
 *   - heading (-> <h2>)
 *   - body paragraph
 *   - CTA paragraph (link-bearing)
 *   - image cell (<picture>/<img>) — optional
 */

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const pic = block.querySelector('picture, img');

  let eyebrow;
  let heading;
  let body;
  let ctaCell;
  cells.forEach((cell) => {
    if (cell.querySelector('picture, img')) return;
    const h = cell.querySelector('h1, h2, h3, h4, h5, h6');
    if (h && !heading) { heading = h.textContent.trim(); return; }
    if (cell.querySelector('a') && !ctaCell) { ctaCell = cell; return; }
    const t = cell.textContent.trim();
    if (!t) return;
    if (!eyebrow && t.length < 60) { eyebrow = t; return; }
    if (!body) body = t;
  });

  const grid = document.createElement('div');
  grid.className = 'wrap mem-grid';

  const col = document.createElement('div');
  if (eyebrow) {
    const ey = document.createElement('span');
    ey.className = 'eyebrow';
    ey.textContent = eyebrow;
    col.append(ey);
  }
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading;
    col.append(h2);
  }
  if (body) {
    const p = document.createElement('p');
    p.textContent = body;
    col.append(p);
  }
  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    col.append(actions);
  }
  grid.append(col);

  const imgWrap = document.createElement('div');
  imgWrap.className = 'mem-img';
  if (pic) imgWrap.append(pic.closest('picture') || pic);
  grid.append(imgWrap);

  block.replaceChildren(grid);
}
