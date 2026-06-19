/**
 * value -- white-canvas split: eyebrow + headline (left), lede + 3 numbered
 * benefit rows (right).
 *
 * Authored shape (one cell, flattened):
 *   - p (eyebrow) ..... short label, becomes .eyebrow.dark
 *   - h2 ............. headline (may contain <em>/<strong> for the purple accent)
 *   - p (lede) ....... the right-column intro paragraph
 *   - 3x p lines ..... "Bold lead — supporting sentence" -> numbered rows
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

function accentEm(h) {
  const em = h.querySelector('em');
  if (em) {
    const span = document.createElement('span');
    span.className = 'accent';
    span.append(...em.childNodes);
    em.replaceWith(span);
  }
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const h = nodes.find((n) => n.matches?.('h2, h1, h3'));
  const ps = nodes.filter((n) => n.matches?.('p'));

  const hIndex = nodes.indexOf(h);
  const eyebrow = ps.find((p) => nodes.indexOf(p) < hIndex);
  const rest = ps.filter((p) => nodes.indexOf(p) > hIndex && p.textContent.trim());
  const lede = rest[0];
  const rows = rest.slice(1);

  if (h) accentEm(h);

  const wrap = document.createElement('div');
  wrap.className = 'wrap value-grid';

  const left = document.createElement('div');
  if (eyebrow) {
    eyebrow.className = 'eyebrow dark';
    left.append(eyebrow);
  }
  if (h) left.append(h);

  const right = document.createElement('div');
  right.className = 'rt';
  if (lede) right.append(lede);
  rows.forEach((p, i) => {
    const parts = p.textContent.split(/\s*[—–-]\s*/);
    const lead = parts.shift() || '';
    const supp = parts.join(' — ');
    const row = document.createElement('div');
    row.className = 'row';
    row.innerHTML = `<span class="n${i % 2 === 1 ? ' y' : ''}">${i + 1}</span>`
      + `<div><b>${lead}</b><span>${supp}</span></div>`;
    right.append(row);
  });

  wrap.append(left, right);
  block.replaceChildren(wrap);
}
