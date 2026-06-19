/**
 * pillars — light band: a section head (eyebrow, h2, lede) followed by a 3-up
 * grid of pillar cards (image, h3, body, text link).
 *
 * Authoring (one row per card after the head; head = leading no-card-heading
 * rows). Card row cells, by content: heading (h3), body <p>, link <p>.
 * Pillar imagery is a fixed brand asset assigned by card index (root-relative).
 */

const PILLAR_IMGS = [
  '/img/qualcomm/pillar-compute.webp',
  '/img/qualcomm/pillar-ai.webp',
  '/img/qualcomm/pillar-connectivity.webp',
];

function match(el, sel) { return el.matches(sel) || el.querySelector(sel); }

export default async function decorate(block) {
  const rows = [...block.children];
  // head = leading rows with no card heading (h3); cards = the rest
  const cardRows = [];
  const headRows = [];
  let started = false;
  rows.forEach((row) => {
    const hasH3 = row.querySelector('h3, h4');
    if (!started && !hasH3) headRows.push(row);
    else { started = true; cardRows.push(row); }
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // section head
  const head = document.createElement('div');
  head.className = 'section-head';
  // flatten every head cell's children so an eyebrow/h2/lede authored as flat
  // siblings inside one cell are each classified individually (#62).
  const headEls = [];
  headRows.forEach((row) => {
    [...row.querySelectorAll(':scope > div')].forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length) headEls.push(...kids);
      else if (cell.textContent.trim()) { const p = document.createElement('p'); p.textContent = cell.textContent.trim(); headEls.push(p); }
    });
  });
  headEls.forEach((el) => {
    const h = el.matches('h1,h2,h3,h4,h5,h6') ? el : el.querySelector('h1,h2,h3,h4,h5,h6');
    if (h) { const h2 = document.createElement('h2'); [...h.childNodes].forEach((n) => h2.append(n.cloneNode(true))); head.append(h2); return; }
    const txt = el.textContent.trim();
    if (!txt) return;
    if (!head.querySelector('.eyebrow') && txt.length < 40) {
      const eb = document.createElement('span'); eb.className = 'eyebrow'; eb.textContent = txt; head.append(eb);
    } else {
      const p = document.createElement('p'); p.textContent = txt; head.append(p);
    }
  });
  wrap.append(head);

  // cards
  const grid = document.createElement('div');
  grid.className = 'pillars-grid';
  cardRows.forEach((row, i) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const article = document.createElement('article');
    article.className = 'pillar';

    const img = document.createElement('div');
    img.className = 'pillar-img';
    img.style.backgroundImage = `url("${PILLAR_IMGS[i] || PILLAR_IMGS[0]}")`;
    article.append(img);

    const body = document.createElement('div');
    body.className = 'pillar-body';
    cells.forEach((cell) => {
      const h = cell.querySelector('h1,h2,h3,h4,h5,h6');
      if (h) { const h3 = document.createElement('h3'); [...h.childNodes].forEach((n) => h3.append(n.cloneNode(true))); body.append(h3); return; }
      const a = match(cell, 'a');
      if (a) { const link = a.cloneNode(true); link.className = 'pillar-link'; body.append(link); return; }
      const txt = cell.textContent.trim();
      if (txt) { const p = document.createElement('p'); p.textContent = txt; body.append(p); }
    });
    article.append(body);
    grid.append(article);
  });
  wrap.append(grid);

  block.replaceChildren(wrap);
}
