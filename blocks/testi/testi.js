/**
 * testi — dark testimonial: quote + attribution + watch CTA, portrait image.
 *
 * Authoring (flat single cell or multi-row):
 *   - blockquote text (a paragraph)
 *   - name line (the bold attribution) — short
 *   - role/description line — short
 *   - CTA link (wrap in <strong> for primary red button)
 *   - <picture>/<img> portrait
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

function mediaOf(el) {
  return el.matches('picture, img') ? el : el.querySelector('picture, img');
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const media = nodes.find((n) => mediaOf(n));
  const ctaP = nodes.find((n) => n.matches('p') && n.querySelector('a'));
  const textP = nodes.filter((n) => n.matches('p') && !n.querySelector('a')
    && !(media && media.contains(n)));

  // longest paragraph = the quote; the two short lines = name + role
  const len = (p) => p.textContent.trim().length;
  const sorted = [...textP].sort((a, b) => len(b) - len(a));
  const quoteP = sorted[0];
  const rest = textP.filter((p) => p !== quoteP);
  const nameP = rest[0];
  const roleP = rest[1];

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const grid = document.createElement('div');
  grid.className = 'grid';

  const left = document.createElement('div');
  const q = document.createElement('span');
  q.className = 'q';
  q.textContent = '“';
  left.append(q);

  if (quoteP) {
    const bq = document.createElement('blockquote');
    [...quoteP.childNodes].forEach((n) => bq.append(n.cloneNode(true)));
    left.append(bq);
  }

  const cite = document.createElement('cite');
  if (nameP) {
    const b = document.createElement('b');
    b.textContent = nameP.textContent.trim();
    cite.append(b);
  }
  if (roleP) {
    const s = document.createElement('span');
    s.textContent = roleP.textContent.trim();
    cite.append(s);
  }
  left.append(cite);

  if (ctaP && ctaP.querySelector('a')) {
    const a = ctaP.querySelector('a');
    a.classList.add('watch');
    // idempotent ▶ marker
    const txt = a.textContent.replace(/^\s*▶\s*/, '').trim();
    a.textContent = `▶ ${txt}`;
    left.append(a);
  }
  grid.append(left);

  if (media) {
    const portrait = document.createElement('div');
    portrait.className = 'portrait';
    portrait.append(mediaOf(media));
    grid.append(portrait);
  }

  wrap.append(grid);
  block.replaceChildren(wrap);
}
