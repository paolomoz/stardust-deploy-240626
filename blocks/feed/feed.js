/**
 * feed — section head (05) + a 3-up card grid (image, <h3>, teaser, text link).
 *
 * Authored shape (one row per unit):
 *   row 1: <h2> section title
 *   rows 2..N: one card per row, cell holds <h3> title, <p> teaser, <a> link.
 *
 * Card imagery is fixed brand art (root-relative /img/tyson/…), applied by card index
 * because the prototype pins each card to a specific photo.
 */

const CARD_IMAGES = [
  '/img/tyson/blog-grilling.jpg',
  '/img/tyson/blog-chicken.jpg',
  '/img/tyson/blog-stagecoach.jpg',
];

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  let headingEl = null;
  const cards = [];

  rows.forEach((row) => {
    const cell = row.firstElementChild || row;
    const h2 = cell.querySelector('h2');
    const h3 = cell.querySelector('h3');
    if (h2 && !h3) { headingEl = h2; return; }
    if (h3) {
      const p = cell.querySelector('p');
      const a = cell.querySelector('a');
      cards.push({
        title: h3.textContent.trim(),
        body: p ? p.textContent.trim() : '',
        linkText: a ? a.textContent.trim() : '',
        href: a ? a.getAttribute('href') : '/tyson/',
      });
    }
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const head = document.createElement('div');
  head.className = 'head';
  const ix = document.createElement('div');
  ix.className = 'idx';
  ix.textContent = '05';
  const ht = document.createElement('div');
  ht.className = 'ht';
  if (headingEl) {
    const h2 = document.createElement('h2');
    [...headingEl.childNodes].forEach((c) => h2.append(c.cloneNode(true)));
    ht.append(h2);
  }
  head.append(ix, ht);
  wrap.append(head);

  const grid = document.createElement('div');
  grid.className = 'feed-grid';
  cards.forEach((c, i) => {
    const card = document.createElement('article');
    card.className = 'feed-card';
    const ph = document.createElement('div');
    ph.className = 'ph';
    ph.style.backgroundImage = `url("${CARD_IMAGES[i % CARD_IMAGES.length]}")`;
    const h3 = document.createElement('h3');
    h3.textContent = c.title;
    const p = document.createElement('p');
    p.textContent = c.body;
    const a = document.createElement('a');
    a.className = 'lnk';
    a.href = c.href || '/tyson/';
    a.textContent = c.linkText || 'Read ›';
    card.append(ph, h3, p, a);
    grid.append(card);
  });
  wrap.append(grid);

  block.replaceChildren(wrap);
}
