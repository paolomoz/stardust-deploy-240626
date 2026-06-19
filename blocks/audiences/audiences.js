/**
 * audiences -- white split: left (eyebrow + h2 + lead), right 2 audience cards.
 *
 * Authored shape: head rows (eyebrow p, h2, lead p) then one row per card whose
 * cells are [kicker, h4, body] OR a flattened run segmented on h4 boundaries.
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

function buildAud(nodes) {
  const aud = document.createElement('div');
  aud.className = 'aud';
  const h4 = nodes.find((n) => n.matches?.('h4, h3'));
  const ps = nodes.filter((n) => n.matches?.('p'));
  const kicker = ps[0];
  const body = ps.slice(1);
  if (kicker) { const k = document.createElement('span'); k.className = 'k'; k.textContent = kicker.textContent.trim(); aud.append(k); }
  if (h4) aud.append(h4);
  body.forEach((p) => aud.append(p));
  return aud;
}

export default async function decorate(block) {
  const allRows = rows(block);
  const cardRows = allRows.filter((r) => r.querySelector('h4, h3'));
  const headRows = allRows.filter((r) => !r.querySelector('h4, h3'));

  const wrap = document.createElement('div');
  wrap.className = 'wrap twoup';

  const left = document.createElement('div');
  const headNodes = headRows.flatMap((r) => cellNodes(r));
  const headH = headNodes.find((n) => n.matches?.('h1, h2'));
  const hIdx = headNodes.indexOf(headH);
  const ps = headNodes.filter((n) => n.matches?.('p') && n.textContent.trim());
  const eyebrow = ps.find((p) => headNodes.indexOf(p) < hIdx);
  const lead = ps.find((p) => headNodes.indexOf(p) > hIdx);
  if (eyebrow) { eyebrow.className = 'eyebrow dark'; left.append(eyebrow); }
  if (headH) { headH.style.marginTop = '16px'; left.append(headH); }
  if (lead) { lead.className = 'lead'; left.append(lead); }

  const right = document.createElement('div');
  right.className = 'aud-list';
  cardRows.forEach((r) => right.append(buildAud(cellNodes(r))));

  wrap.append(left, right);
  block.replaceChildren(wrap);
}
