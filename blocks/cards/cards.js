/**
 * cards — canonical card band. ONE block; the brand look comes from a VARIANT
 * class on the block (`cards pillars`, `cards brands`, `cards compact`). The JS
 * is fully generic: it splits a section head from N card rows and classifies
 * each card's cells by content. ALL brand styling — grid shape, ground colour,
 * imagery (as CSS backgrounds on `.card-media`) — lives in the variant CSS.
 *
 * This collapses the former bespoke pillars / product-brands / developer blocks
 * (David's Model #1/#9/#11): same authored structure, brand skin via a class.
 *
 * Authoring: leading head rows (eyebrow / heading / lede / CTA), then ONE row
 * per card. Card cells, by content: eyebrow (short link-free text), heading
 * (any hN → card h3), body <p>, link/CTA (kept as <strong>/<em> so the global
 * button decorator styles it). A `.card-media` slot is always emitted for the
 * variant CSS to fill with a background image or hide.
 */

function flattenCells(row) {
  const out = [];
  [...row.querySelectorAll(':scope > div')].forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out;
}

const headingOf = (el) => (el.matches('h1,h2,h3,h4,h5,h6') ? el : el.querySelector('h1,h2,h3,h4,h5,h6'));
const anchorOf = (el) => (el.matches('a') ? el : el.querySelector('a'));

function renderHead(headEls) {
  const head = document.createElement('div');
  head.className = 'section-head';
  headEls.forEach((el) => {
    const h = headingOf(el);
    if (h) {
      const h2 = document.createElement('h2');
      [...h.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
      head.append(h2);
      return;
    }
    if (anchorOf(el)) {
      const actions = document.createElement('div');
      actions.className = 'head-actions';
      [...el.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
      head.append(actions);
      return;
    }
    const txt = el.textContent.trim();
    if (!txt) return;
    if (!head.querySelector('.eyebrow') && txt.length < 40) {
      const eb = document.createElement('span');
      eb.className = 'eyebrow';
      eb.textContent = txt;
      head.append(eb);
    } else {
      const p = document.createElement('p');
      [...el.childNodes].forEach((n) => p.append(n.cloneNode(true)));
      head.append(p);
    }
  });
  return head;
}

function renderCard(row) {
  const card = document.createElement('article');
  card.className = 'card';

  const media = document.createElement('div');
  media.className = 'card-media';
  card.append(media);

  const body = document.createElement('div');
  body.className = 'card-body';
  flattenCells(row).forEach((el) => {
    // editorial image: an authored <picture>/<img> goes in the media slot (in
    // content → authorable, in .plain.html, carries alt). Decorative imagery is
    // a CSS background on an empty .card-media instead (variant CSS).
    const pic = el.matches('picture, img') ? el : el.querySelector('picture, img');
    if (pic) { media.append(pic.cloneNode(true)); return; }
    const h = headingOf(el);
    if (h) {
      const h3 = document.createElement('h3');
      [...h.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      body.append(h3);
      return;
    }
    if (anchorOf(el)) {
      const wrapper = el.querySelector('strong, em');
      const actions = document.createElement('div');
      actions.className = 'card-actions';
      if (wrapper) {
        [...el.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
      } else {
        const link = anchorOf(el).cloneNode(true);
        link.className = 'card-link';
        actions.append(link);
      }
      body.append(actions);
      return;
    }
    const txt = el.textContent.trim();
    if (!txt) return;
    // a short link-free line before the heading is the card eyebrow/label
    if (!body.querySelector('.eyebrow') && !body.querySelector('h3') && txt.length < 40) {
      const eb = document.createElement('span');
      eb.className = 'eyebrow';
      eb.textContent = txt;
      body.append(eb);
    } else {
      const p = document.createElement('p');
      [...el.childNodes].forEach((n) => p.append(n.cloneNode(true)));
      body.append(p);
    }
  });
  card.append(body);
  return card;
}

export default async function decorate(block) {
  // Section head as DEFAULT CONTENT (David's Model #1): the eyebrow/heading/lede
  // is authored as default content in the section, so the block TABLE holds only
  // the repeating cards (clean in DA / `.plain.html`). When the block is preceded
  // by a `.default-content-wrapper`, REABSORB it as the head — the decorated DOM
  // is then IDENTICAL to the in-block-head form, so CSS/pixels are unchanged.
  // Fallback (back-compat): a head authored as leading non-card rows in the block.
  const rows = [...block.children];
  let headEls = [];
  let cardRows = rows;
  // The default-content head is a sibling of the block's section-level WRAPPER
  // (`.block-content` in this runtime), not of the block itself. Match both this
  // runtime's `.default-content` and vanilla EDS `.default-content-wrapper`.
  const blockWrapper = block.closest('.block-content') || block;
  const dcw = blockWrapper.previousElementSibling;
  if (dcw && (dcw.classList.contains('default-content') || dcw.classList.contains('default-content-wrapper'))) {
    headEls = [...dcw.children];
    dcw.remove();
  } else {
    const headRows = [];
    cardRows = [];
    let started = false;
    rows.forEach((row) => {
      const isCard = !!row.querySelector('h3, h4');
      if (!started && !isCard) headRows.push(row);
      else { started = true; cardRows.push(row); }
    });
    headEls = headRows.flatMap((r) => flattenCells(r));
  }

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (headEls.length) wrap.append(renderHead(headEls));

  const grid = document.createElement('div');
  grid.className = 'cards-grid';
  cardRows.forEach((row) => grid.append(renderCard(row)));
  wrap.append(grid);

  block.replaceChildren(wrap);
}
