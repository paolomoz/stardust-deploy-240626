/**
 * statement -- purple band #2, centered: eyebrow + big headline + yellow sub.
 * Authored shape (flattened): p(eyebrow), h2, p(sub).
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

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const h = nodes.find((n) => n.matches?.('h2, h1, h3'));
  const ps = nodes.filter((n) => n.matches?.('p') && n.textContent.trim());
  const hIndex = nodes.indexOf(h);
  const eyebrow = ps.find((p) => nodes.indexOf(p) < hIndex);
  const sub = ps.find((p) => nodes.indexOf(p) > hIndex);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  if (eyebrow) { eyebrow.className = 'eyebrow light'; wrap.append(eyebrow); }
  if (h) { h.style.marginTop = '20px'; wrap.append(h); }
  if (sub) { sub.className = 'sub'; wrap.append(sub); }

  block.replaceChildren(wrap);
}
