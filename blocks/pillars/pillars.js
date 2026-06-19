/**
 * pillars -- light-surface feature grid: head (eyebrow + h2 + explore CTA),
 * then 3 pillar cards (kicker + h3 + body + "more" text link).
 *
 * Authored shape: leading no-card rows = head; each card = one row whose cells
 * are [kicker, h3, body, link] OR a flattened run segmented on h3 boundaries.
 */

function rows(block) { return [...block.querySelectorAll(':scope > div')]; }

function cellNodes(row) {
  const out = [];
  [...row.children].forEach((cell) => {
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

function buildCard(nodes) {
  const card = document.createElement('article');
  card.className = 'pillar';
  const h3 = nodes.find((n) => n.matches?.('h3, h4'));
  const link = nodes.find((n) => n.matches?.('a') || n.querySelector?.('a'));
  const ps = nodes.filter((n) => n.matches?.('p') && n !== link);
  const kicker = ps[0];
  const body = ps.slice(1);

  if (kicker) { const k = document.createElement('span'); k.className = 'k'; k.textContent = kicker.textContent.trim(); card.append(k); }
  if (h3) card.append(h3);
  body.forEach((p) => card.append(p));
  const a = link?.matches?.('a') ? link : link?.querySelector?.('a');
  if (a) { a.className = 'more'; card.append(a); }
  return card;
}

export default async function decorate(block) {
  const allRows = rows(block);

  // a card row contains an h3/h4; head rows do not
  const cardRows = allRows.filter((r) => r.querySelector('h3, h4'));
  const headRows = allRows.filter((r) => !r.querySelector('h3, h4'));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // head
  const head = document.createElement('div');
  head.className = 'pillars-head';
  const headLeft = document.createElement('div');
  const headNodes = headRows.flatMap((r) => cellNodes(r));
  const headH = headNodes.find((n) => n.matches?.('h1, h2'));
  const headEyebrow = headNodes.find((n) => n.matches?.('p') && !n.querySelector('a'));
  const headLink = headNodes.find((n) => n.matches?.('a') || n.querySelector?.('a'));
  if (headEyebrow) { headEyebrow.className = 'eyebrow dark'; headLeft.append(headEyebrow); }
  if (headH) { headH.style.marginTop = '14px'; headLeft.append(headH); }
  head.append(headLeft);
  // keep the CTA inside its emphasis wrapper so ak.js decorateButton() applies
  // the .btn class after block JS runs
  if (headLink) {
    const cta = document.createElement('div');
    cta.className = 'pillars-cta';
    cta.append(headLink);
    head.append(cta);
  }
  wrap.append(head);

  // grid
  const grid = document.createElement('div');
  grid.className = 'pillars-grid';
  cardRows.forEach((r) => grid.append(buildCard(cellNodes(r))));
  wrap.append(grid);

  block.replaceChildren(wrap);
}
