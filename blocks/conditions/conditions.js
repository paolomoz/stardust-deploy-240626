/**
 * conditions — eyebrow + heading + intro, then 3 full-card photo tiles.
 *
 * Authoring rows:
 *   head: eyebrow (short text), heading, intro paragraph — leading no-card rows
 *   cards: one row per condition, cells: <picture>|img, label/heading, link text
 *          (whole tile is the click target)
 */

function mediaOf(el) {
  return el.matches('picture, img') ? el : el.querySelector('picture, img');
}

function headingOf(el) {
  return el.matches('h1,h2,h3,h4,h5,h6') ? el : el.querySelector('h1,h2,h3,h4,h5,h6');
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const grid = document.createElement('div');
  grid.className = 'cond-grid';

  let headDone = false;
  let eyebrowSeen = false;

  rows.forEach((row) => {
    const nodes = [];
    [...row.children].forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length) nodes.push(...kids);
      else if (cell.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = cell.textContent.trim();
        nodes.push(p);
      }
    });
    if (!nodes.length) return;

    const media = nodes.find((n) => mediaOf(n));

    // Head rows have no media; cards always carry an image.
    if (!media && !headDone) {
      const heading = nodes.find((n) => headingOf(n));
      if (heading) {
        const h = document.createElement('h2');
        const hi = headingOf(heading);
        [...hi.childNodes].forEach((n) => h.append(n.cloneNode(true)));
        wrap.append(h);
        return;
      }
      const txt = nodes.find((n) => n.textContent.trim());
      if (txt) {
        const p = document.createElement('p');
        if (!eyebrowSeen) {
          p.className = 'eyebrow';
          eyebrowSeen = true;
        } else {
          p.className = 'intro';
        }
        [...(txt.matches('p') ? txt : txt).childNodes].forEach((n) => p.append(n.cloneNode(true)));
        wrap.append(p);
      }
      return;
    }

    headDone = true;

    // Build a condition tile
    const link = nodes.find((n) => n.matches('a') || n.querySelector('a'));
    let anchor = null;
    if (link) anchor = link.matches('a') ? link : link.querySelector('a');
    const href = anchor ? anchor.getAttribute('href') : '#';
    const headingNode = nodes.find((n) => headingOf(n));
    // remaining short text = the "explore" label
    const labelText = nodes
      .filter((n) => !mediaOf(n) && !headingOf(n) && !(n.matches('a') || n.querySelector('a')))
      .map((n) => n.textContent.trim())
      .find((t) => t) || (link ? link.textContent.trim() : 'Explore condition →');

    const tile = document.createElement('a');
    tile.className = 'cond';
    tile.href = href;
    const m = mediaOf(media);
    if (m) tile.append(m);

    const lab = document.createElement('span');
    lab.className = 'lab';
    const h3 = document.createElement('h3');
    if (headingNode) {
      const hi = headingOf(headingNode);
      [...hi.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
    }
    lab.append(h3);
    const ex = document.createElement('span');
    ex.textContent = labelText;
    lab.append(ex);
    tile.append(lab);
    grid.append(tile);
  });

  wrap.append(grid);
  block.replaceChildren(wrap);
}
