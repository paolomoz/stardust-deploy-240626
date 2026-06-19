/**
 * metrics — 3-up stat band on pacific mint ground
 *
 * Authoring: one row per metric, single cell "NUMBER · LABEL"
 *   (e.g. "185+ · Countries covered")
 */

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const items = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      items.push([cells[0].textContent.trim(), cells[1].textContent.trim()]);
    } else if (cells[0]) {
      const t = cells[0].textContent.trim();
      const parts = t.split(/\s*[·•|—–-]\s*/);
      if (parts.length >= 2) items.push([parts[0], parts.slice(1).join(' ')]);
      else if (t) items.push([t, '']);
    }
  });
  if (!items.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  items.forEach(([num, lbl]) => {
    const m = document.createElement('div');
    m.className = 'metric';
    const n = document.createElement('div');
    n.className = 'num';
    n.textContent = num;
    const l = document.createElement('div');
    l.className = 'lbl';
    l.textContent = lbl;
    m.append(n, l);
    wrap.append(m);
  });

  block.replaceChildren(wrap);
}
