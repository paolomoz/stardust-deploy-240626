/**
 * trending — indexed "Top 10" list where the rank numbers are the layout.
 *
 * Authoring rows (positional, head first then one row per item):
 *   1. eyebrow text          (e.g. "Top 10 in your country")
 *   2. heading text          (e.g. "Trending Now")
 *   3..N. item rows, each with cells:  rank | <picture> poster | title | meta
 *         (DA may flatten an item to a single cell holding the same siblings;
 *          we segment on the presence of a picture either way.)
 */

function media(el) {
  return el.matches('picture, img') ? el : el.querySelector('picture, img');
}

export default async function decorate(block) {
  const rows = [...block.children];
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const items = [];
  const head = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    const hasMedia = cells.some((c) => media(c));
    if (hasMedia) items.push(cells);
    else head.push(row);
  });

  // head: eyebrow (first), heading (second)
  const headTexts = head
    .map((r) => r.textContent.trim())
    .filter(Boolean);
  if (headTexts[0]) {
    const eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    [eyebrow.textContent] = headTexts;
    wrap.append(eyebrow);
  }
  if (headTexts[1]) {
    const h2 = document.createElement('h2');
    [, h2.textContent] = headTexts;
    wrap.append(h2);
  }

  const list = document.createElement('div');
  list.className = 'idx';

  items.forEach((cells, i) => {
    const mediaCell = cells.find((c) => media(c));
    const textCells = cells.filter((c) => !media(c));
    const texts = textCells.map((c) => c.textContent.trim()).filter(Boolean);

    // rank: an explicit leading numeric cell, else positional
    let rank = String(i + 1);
    let title = texts[0] || '';
    let meta = texts[1] || '';
    if (texts.length >= 3 && /^\d+$/.test(texts[0])) {
      [rank, title, meta] = texts;
    } else if (/^\d+$/.test(texts[0] || '')) {
      [rank, title] = texts;
      meta = texts[2] || '';
    }

    const itemEl = document.createElement('div');
    itemEl.className = 'idx-row';

    const n = document.createElement('span');
    n.className = 'idx-n';
    n.textContent = rank;
    itemEl.append(n);

    const pic = media(mediaCell);
    if (pic) {
      pic.classList.add('idx-poster');
      itemEl.append(pic);
    }

    const titleEl = document.createElement('span');
    titleEl.className = 'idx-title';
    titleEl.append(document.createTextNode(title));
    if (meta) {
      const sub = document.createElement('span');
      sub.textContent = meta;
      titleEl.append(sub);
    }
    itemEl.append(titleEl);

    list.append(itemEl);
  });

  wrap.append(list);
  block.replaceChildren(wrap);
}
