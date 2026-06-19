/**
 * developer — gradient band, 2-col: an intro column (eyebrow, h2, lede, CTA)
 * and a 2x2 grid of developer tiles (h4 + body each).
 *
 * Authoring: leading intro rows (eyebrow line, h2, lede <p>, CTA paragraph),
 * then ONE row per tile (heading h4 + body <p>). Tiles are detected as rows
 * whose heading is h4 (intro h2 stays in the intro column).
 */

export default async function decorate(block) {
  const rows = [...block.children];
  const introRows = [];
  const tileRows = [];
  rows.forEach((row) => {
    if (row.querySelector('h4')) tileRows.push(row);
    else introRows.push(row);
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // intro column
  const intro = document.createElement('div');
  intro.className = 'dev-intro';
  // flatten the intro cell's children so eyebrow/h2/lede/CTA authored as flat
  // siblings inside one cell are each classified individually (#62).
  const introEls = [];
  introRows.forEach((row) => {
    [...row.querySelectorAll(':scope > div')].forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length) introEls.push(...kids);
      else if (cell.textContent.trim()) { const p = document.createElement('p'); p.textContent = cell.textContent.trim(); introEls.push(p); }
    });
  });
  introEls.forEach((el) => {
    const a = el.matches('a') ? el : el.querySelector('a');
    if (a) {
      const actions = document.createElement('div'); actions.className = 'dev-actions';
      [...el.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
      intro.append(actions); return;
    }
    const h = el.matches('h1,h2,h3,h4,h5,h6') ? el : el.querySelector('h1,h2,h3,h4,h5,h6');
    if (h) { const h2 = document.createElement('h2'); [...h.childNodes].forEach((n) => h2.append(n.cloneNode(true))); intro.append(h2); return; }
    const txt = el.textContent.trim();
    if (!txt) return;
    if (!intro.querySelector('.eyebrow') && txt.length < 40) { const eb = document.createElement('span'); eb.className = 'eyebrow'; eb.textContent = txt; intro.append(eb); }
    else { const p = document.createElement('p'); p.textContent = txt; intro.append(p); }
  });
  wrap.append(intro);

  // tiles
  const grid = document.createElement('div');
  grid.className = 'dev-grid';
  tileRows.forEach((row) => {
    const tile = document.createElement('div');
    tile.className = 'dev-tile';
    [...row.querySelectorAll(':scope > div')].forEach((cell) => {
      const h = cell.querySelector('h1,h2,h3,h4,h5,h6');
      if (h) { const h4 = document.createElement('h4'); [...h.childNodes].forEach((n) => h4.append(n.cloneNode(true))); tile.append(h4); return; }
      const txt = cell.textContent.trim();
      if (txt) { const p = document.createElement('p'); p.textContent = txt; tile.append(p); }
    });
    grid.append(tile);
  });
  wrap.append(grid);

  block.replaceChildren(wrap);
}
