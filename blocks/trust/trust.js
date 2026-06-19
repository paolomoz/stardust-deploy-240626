/**
 * trust — the logo wall on dark teal ("Trusted by global leaders").
 *
 * A centered uppercase label over a 6x2 grid of client logos. The logos are
 * FIXED block assets committed root-relative under /img (#67) — not
 * author-swappable — so the JS builds the logo row itself.
 *
 * Authoring (one cell, flat siblings — DA-flattened contract, #62):
 *   label — a single short link-free <p> (the uppercase eyebrow line).
 *           If omitted, falls back to "Trusted by global leaders".
 *
 * Authoring row shape:
 *   | trust |
 *   | Trusted by global leaders |
 */

const BASE = '/img/velocity-global-refined';

const LOGOS = [
  ['logo-honeywell.png', 'Honeywell'],
  ['logo-yelp.png', 'Yelp'],
  ['logo-caa.png', 'CAA'],
  ['logo-penguin.png', 'Penguin Random House', true],
  ['logo-crunchbase.png', 'Crunchbase'],
  ['logo-glaukos.png', 'Glaukos'],
  ['logo-lastpass.png', 'LastPass'],
  ['logo-attentive.png', 'Attentive'],
  ['logo-consensys.png', 'Consensys'],
  ['logo-anuvu.png', 'Anuvu'],
  ['logo-linksys.png', 'Linksys'],
  ['logo-paige.png', 'Paige'],
];

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

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const labelNode = nodes.find((n) => n.matches?.('p, h2, h3, span'));
  const labelText = labelNode?.textContent.trim() || 'Trusted by global leaders';

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const label = document.createElement('span');
  label.className = 'label';
  label.textContent = labelText;

  const row = document.createElement('div');
  row.className = 'logo-row';
  LOGOS.forEach(([file, alt, tall]) => {
    const img = document.createElement('img');
    img.src = `${BASE}/${file}`;
    img.alt = alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.width = 220;
    img.height = 130;
    if (tall) img.className = 'tall';
    row.append(img);
  });

  wrap.append(label, row);
  block.replaceChildren(wrap);
}
