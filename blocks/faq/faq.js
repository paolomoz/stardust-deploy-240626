/**
 * faq — CSS-only accordion built on native <details>/<summary>.
 *
 * Authoring rows:
 *   1. eyebrow text
 *   2. heading text
 *   3..N. Q/A rows, each with cells:  question | answer
 *         (or one cell per row alternating question / answer if DA flattens).
 */

export default async function decorate(block) {
  const rows = [...block.children];
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // Build a flat list of cell texts to classify.
  const cellTexts = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 2) {
      cellTexts.push({ q: cells[0].textContent.trim(), a: cells[1].textContent.trim() });
    } else if (cells.length === 1) {
      cellTexts.push({ single: cells[0].textContent.trim() });
    }
  });

  // head = first two single-text entries; remainder are Q/A.
  const singles = cellTexts.filter((c) => 'single' in c).map((c) => c.single).filter(Boolean);
  const pairs = cellTexts.filter((c) => 'q' in c);

  // If everything came as singles, treat first two as head and the rest as
  // alternating question/answer.
  let eyebrow = '';
  let heading = '';
  let qa = pairs;
  if (!pairs.length && singles.length) {
    [eyebrow, heading] = singles;
    const rest = singles.slice(2);
    qa = [];
    for (let i = 0; i < rest.length; i += 2) {
      qa.push({ q: rest[i], a: rest[i + 1] || '' });
    }
  } else {
    // head rows were authored as singles before the Q/A pair rows
    [eyebrow, heading] = singles;
  }

  if (eyebrow) {
    const e = document.createElement('span');
    e.className = 'eyebrow';
    e.textContent = eyebrow;
    wrap.append(e);
  }
  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading;
    wrap.append(h2);
  }

  const list = document.createElement('div');
  list.className = 'faq-list';

  qa.forEach((item, i) => {
    if (!item.q) return;
    const det = document.createElement('details');
    if (i === 0) det.open = true;
    const sum = document.createElement('summary');
    sum.textContent = item.q;
    const body = document.createElement('div');
    body.className = 'faq-body';
    body.textContent = item.a;
    det.append(sum, body);
    list.append(det);
  });

  wrap.append(list);
  block.replaceChildren(wrap);
}
