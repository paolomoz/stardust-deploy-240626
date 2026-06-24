/**
 * metrics — the mint metric band ("Pebl by the numbers").
 *
 * Three numbers-first metrics on the signature mint ground, laid out as a
 * 3-column grid with vertical dividers (numbers bleed to the dividers — the
 * .wrap is the grid itself, padding-inline:0). Each metric stacks a big serif
 * number (with an authored superscript like "+", "hr", "#1"), a serif label,
 * and a soft sub-sentence.
 *
 * Authoring — ONE metric per row (preferred), each row a single cell carrying
 * the metric's parts as flat siblings (DA-flattened contract, #62):
 *   number  — a short link-free <p> (the big figure: "185+", "24hr", "#1").
 *             Wrap the unit/symbol in <sup> to render it as superscript:
 *             e.g. 185<sup>+</sup>, 24<sup>hr</sup>. Plain "#1" needs no sup.
 *   label   — a short link-free <p> (the bold serif label line).
 *   sub     — a longer link-free <p> (the supporting sentence).
 *
 * Authoring row shape (3 rows → 3 metrics):
 *   | metrics |
 *   | 185<sup>+</sup> |
 *   | Countries covered |
 *   | Hire, pay, and support talent anywhere through local entities. |
 *   |---|
 *   | 24<sup>hr</sup> |
 *   | To hire anywhere |
 *   | Onboard global employees in as little as a day, with no entity setup. |
 *   |---|
 *   | #1 |
 *   | Rated for compliance on G2 |
 *   | Backed by Baker McKenzie, the #1 global employment law firm. |
 *
 * Falls back to a single flat list of 9 nodes (3 per metric, in order) when the
 * author puts everything in one cell.
 */

function rowCells(block) {
  // Each :scope > div is one authored row; collect its flat content nodes.
  const rows = [...block.querySelectorAll(':scope > div')].map((row) => {
    const out = [];
    [...row.children].forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length) out.push(...kids);
      else if (cell.textContent.trim()) {
        const p = document.createElement('p');
        p.innerHTML = cell.innerHTML;
        out.push(p);
      }
    });
    return out;
  });
  return rows;
}

function segmentMetrics(block) {
  const rows = rowCells(block);
  const nonEmpty = rows.filter((r) => r.length);

  // Preferred: one row per metric, each row carrying num/label/sub.
  const multiNodeRows = nonEmpty.filter((r) => r.length >= 2);
  if (multiNodeRows.length >= 2) {
    return multiNodeRows.map((r) => ({
      num: r[0],
      lbl: r[1],
      sub: r[2],
    }));
  }

  // Fallback: everything flat — chunk into groups of 3 (num, label, sub).
  const flat = nonEmpty.flat();
  const metrics = [];
  for (let i = 0; i < flat.length; i += 3) {
    metrics.push({ num: flat[i], lbl: flat[i + 1], sub: flat[i + 2] });
  }
  return metrics;
}

export default async function decorate(block) {
  const metrics = segmentMetrics(block);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  metrics.forEach(({ num, lbl, sub }) => {
    if (!num) return;
    const metric = document.createElement('div');
    metric.className = 'metric';

    const numEl = document.createElement('div');
    numEl.className = 'num';
    // Author the figure as PLAIN TEXT ("185+", "24hr", "#1") — no raw <sup> in
    // content (David's Model #15). Split a leading numeric core from a trailing
    // unit ("+", "hr") and render the unit as <sup> here. If the author still
    // supplied a <sup>, honour their markup unchanged (back-compat).
    const rawNum = (num.innerHTML || num.textContent || '').trim();
    if (/<sup/i.test(rawNum)) {
      numEl.innerHTML = rawNum;
    } else {
      const m = num.textContent.trim().match(/^(\D*\d[\d.,]*)(.*)$/);
      if (m && m[2]) {
        numEl.textContent = m[1];
        const sup = document.createElement('sup');
        sup.textContent = m[2];
        numEl.append(sup);
      } else {
        numEl.textContent = num.textContent.trim();
      }
    }
    metric.append(numEl);

    if (lbl) {
      const lblEl = document.createElement('div');
      lblEl.className = 'lbl';
      lblEl.textContent = lbl.textContent.trim();
      metric.append(lblEl);
    }

    if (sub && sub.textContent.trim()) {
      const subEl = document.createElement('p');
      subEl.className = 'sub';
      subEl.textContent = sub.textContent.trim();
      metric.append(subEl);
    }

    wrap.append(metric);
  });

  block.replaceChildren(wrap);
}
