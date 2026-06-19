/**
 * airsync — connector showcase: eyebrow, h2, body paragraph, full-width image.
 *
 * Authoring:
 *   - eyebrow line
 *   - heading (-> <h2>)
 *   - body paragraph
 *   - image cell (<picture>/<img>) — optional
 */

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const pic = block.querySelector('picture, img');

  let eyebrow;
  let heading;
  let body;
  cells.forEach((cell) => {
    if (cell.querySelector('picture, img')) return;
    const h = cell.querySelector('h1, h2, h3, h4, h5, h6');
    if (h && !heading) { heading = h.textContent.trim(); return; }
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
  if (pic) {
    const figure = document.createElement('div');
    figure.className = 'airsync-img';
    figure.append(pic.closest('picture') || pic);
    wrap.append(figure);
  }

  block.replaceChildren(wrap);
}
