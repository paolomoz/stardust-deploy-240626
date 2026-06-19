/**
 * product-brands — dark band: a section head (eyebrow, h2) then a 1.4fr/1fr
 * grid. The FIRST card is a full-bleed feature with a brand background image;
 * the remaining cards form a stacked column.
 *
 * Authoring: leading head rows (eyebrow line + h2), then ONE row per brand
 * card. Each card row cells, by content: eyebrow line, heading (h3), body <p>,
 * link/CTA. The first card row becomes the feature (background image fixed).
 */

const FEATURE_BG = '/img/qualcomm/brand-agentic-age.webp';

function buildCardInner(cells, target) {
  cells.forEach((cell) => {
    const h = cell.querySelector('h1,h2,h3,h4,h5,h6');
    if (h) { const h3 = document.createElement('h3'); [...h.childNodes].forEach((n) => h3.append(n.cloneNode(true))); target.append(h3); return; }
    const a = cell.matches('a') ? cell : cell.querySelector('a');
    if (a) {
      const wrapper = cell.querySelector('strong, em');
      const actions = document.createElement('div');
      actions.className = 'pb-actions';
      if (wrapper) [...cell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
      else { const link = a.cloneNode(true); link.className = 'pillar-link'; actions.append(link); }
      target.append(actions);
      return;
    }
    const txt = cell.textContent.trim();
    if (!txt) return;
    if (!target.querySelector('.eyebrow') && txt.length < 40) {
      const eb = document.createElement('span'); eb.className = 'eyebrow'; eb.textContent = txt; target.append(eb);
    } else {
      const p = document.createElement('p'); p.textContent = txt; target.append(p);
    }
  });
}

export default async function decorate(block) {
  const rows = [...block.children];
  const headRows = [];
  const cardRows = [];
  let started = false;
  rows.forEach((row) => {
    const hasH = row.querySelector('h3, h4');
    if (!started && !hasH) headRows.push(row);
    else { started = true; cardRows.push(row); }
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const head = document.createElement('div');
  head.className = 'section-head';
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
    if (!head.querySelector('.eyebrow') && txt.length < 40) { const eb = document.createElement('span'); eb.className = 'eyebrow'; eb.textContent = txt; head.append(eb); }
    else { const p = document.createElement('p'); p.textContent = txt; head.append(p); }
  });
  wrap.append(head);

  const grid = document.createElement('div');
  grid.className = 'brands-grid';

  // feature = first card
  const featureRow = cardRows[0];
  const feature = document.createElement('article');
  feature.className = 'brand-feature';
  feature.style.backgroundImage = `linear-gradient(120deg, rgb(0 0 0 / 75%), rgb(0 0 0 / 10%)), url("${FEATURE_BG}")`;
  const ct = document.createElement('div');
  ct.className = 'ct';
  if (featureRow) buildCardInner([...featureRow.querySelectorAll(':scope > div')], ct);
  feature.append(ct);
  grid.append(feature);

  // stack = remaining cards
  const stack = document.createElement('div');
  stack.className = 'brand-stack';
  cardRows.slice(1).forEach((row) => {
    const card = document.createElement('div');
    card.className = 'brand-card';
    buildCardInner([...row.querySelectorAll(':scope > div')], card);
    stack.append(card);
  });
  grid.append(stack);

  wrap.append(grid);
  block.replaceChildren(wrap);
}
