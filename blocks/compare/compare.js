/**
 * compare — "A different class of enterprise AI" comparison table.
 *
 * Authoring:
 *   - eyebrow line
 *   - heading (-> <h2>)
 *   - rows of "Capability · Computer-value · Frontier-value" delimited lines;
 *     the FIRST such row is the header row (rendered as column labels).
 */

function collectLines(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const h = cell.querySelector('h1, h2, h3, h4, h5, h6');
    if (h) { out.push({ type: 'h', text: h.textContent.trim() }); return; }
    const t = cell.textContent.trim();
    if (t) out.push({ type: 'p', text: t });
  });
  return out;
}

export default async function decorate(block) {
  const lines = collectLines(block);
  if (!lines.length) return;

  const heading = lines.find((l) => l.type === 'h');
  const rows = lines.filter((l) => l.text.includes('·')).map((l) => l.text);
  const eyebrow = lines.find((l) => l !== heading && !l.text.includes('·'));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (eyebrow) {
    const ey = document.createElement('span');
    ey.className = 'eyebrow';
    ey.textContent = eyebrow.text;
    wrap.append(ey);
  }
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.text;
    wrap.append(h2);
  }

  const cmp = document.createElement('div');
  cmp.className = 'cmp';
  rows.forEach((r, i) => {
    const parts = r.split('·').map((s) => s.trim());
    const row = document.createElement('div');
    row.className = i === 0 ? 'row h' : 'row';
    const feat = document.createElement('div');
    feat.className = i === 0 ? '' : 'feat';
    feat.textContent = parts[0] || '';
    const us = document.createElement('div');
    us.className = i === 0 ? '' : 'us';
    us.textContent = parts[1] || '';
    const them = document.createElement('div');
    them.textContent = parts[2] || '';
    row.append(feat, us, them);
    cmp.append(row);
  });
  wrap.append(cmp);

  block.replaceChildren(wrap);
}
