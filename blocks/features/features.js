/**
 * features — "Chapter 01" editorial feature columns on paper ground
 *
 * Authoring rows:
 *   1. chapter number (e.g. "01")
 *   2. eyebrow (e.g. "End-to-End Global HR")
 *   3. section heading -> <h2>
 *   4..N. feature cards, one row each: "ROMAN · Title · Description"
 *         (e.g. "i. · Employer of Record · Compliantly hire ...")
 */

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const cellText = (row) => [...row.children].map((c) => c.textContent.trim());

  // head = first 3 rows; cards = the rest (delimited lines)
  const chapterNo = rows[0] ? rows[0].textContent.trim() : '';
  const eyebrow = rows[1] ? rows[1].textContent.trim() : '';
  const headingRow = rows[2];

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const head = document.createElement('div');
  head.className = 'chapter-head';
  const cn = document.createElement('span');
  cn.className = 'chapter-no';
  cn.textContent = chapterNo;
  head.append(cn);
  const headText = document.createElement('div');
  if (eyebrow) {
    const eb = document.createElement('p');
    eb.className = 'eyebrow';
    eb.textContent = eyebrow;
    headText.append(eb);
  }
  if (headingRow) {
    const h2 = document.createElement('h2');
    h2.textContent = headingRow.textContent.trim();
    headText.append(h2);
  }
  head.append(headText);
  wrap.append(head);

  const cols = document.createElement('div');
  cols.className = 'feat-cols';
  rows.slice(3).forEach((row) => {
    const txt = cellText(row);
    let n = '';
    let title = '';
    let desc = '';
    if (txt.length >= 3) {
      [n, title, desc] = txt;
    } else {
      const parts = (txt.join(' ')).split(/\s*[·•|]\s*/);
      [n = '', title = '', desc = ''] = parts;
      if (parts.length > 3) desc = parts.slice(2).join(' · ');
    }
    if (!title && !desc && !n) return;
    const fc = document.createElement('div');
    fc.className = 'fc';
    const nn = document.createElement('div');
    nn.className = 'n';
    nn.textContent = n;
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const p = document.createElement('p');
    p.textContent = desc;
    fc.append(nn, h3, p);
    cols.append(fc);
  });
  wrap.append(cols);

  block.replaceChildren(wrap);
}
