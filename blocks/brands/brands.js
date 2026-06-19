/**
 * brands — section head (index 01 + title + intro) and an 8-up brand-name tile grid.
 *
 * Authored shape:
 *   - <h2> section title
 *   - intro paragraph
 *   - one cell/row per brand name (plain text)
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

function sectionHead(idx, headingEl, introText) {
  const head = document.createElement('div');
  head.className = 'head';
  const idxEl = document.createElement('div');
  idxEl.className = 'idx';
  idxEl.textContent = idx;
  const ht = document.createElement('div');
  ht.className = 'ht';
  if (headingEl) {
    const h2 = document.createElement('h2');
    [...headingEl.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    ht.append(h2);
  }
  if (introText) {
    const p = document.createElement('p');
    p.textContent = introText;
    ht.append(p);
  }
  head.append(idxEl, ht);
  return head;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const heading = nodes.find((n) => n.matches('h1, h2, h3') || n.querySelector('h1, h2, h3'));
  const headingEl = heading && (heading.matches('h1, h2, h3') ? heading : heading.querySelector('h1, h2, h3'));
  const intro = nodes.find((n) => n.matches('p') && !n.querySelector('a') && n !== heading);

  const tiles = nodes.filter((n) => n !== heading && n !== intro && n.textContent.trim());

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.append(sectionHead('01', headingEl, intro ? intro.textContent.trim() : ''));

  const grid = document.createElement('div');
  grid.className = 'brand-grid';
  tiles.forEach((t) => {
    const tile = document.createElement('div');
    tile.className = 'brand-tile';
    tile.textContent = t.textContent.trim();
    grid.append(tile);
  });
  wrap.append(grid);

  block.replaceChildren(wrap);
}
