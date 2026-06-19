/**
 * faq — accordion of questions on arctic ground (CSS-only via <details>)
 *
 * Authoring rows:
 *   1. chapter number ("06")
 *   2. eyebrow ("Questions")
 *   3. heading -> <h2>
 *   4..N. one row per Q/A — two cells: Question | Answer
 */

export default async function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

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

  const faq = document.createElement('div');
  faq.className = 'faq-acc';
  rows.slice(3).forEach((row, i) => {
    const cells = [...row.children];
    const q = cells[0] ? cells[0].textContent.trim() : '';
    const a = cells[1] ? cells[1].textContent.trim() : '';
    if (!q) return;
    const det = document.createElement('details');
    if (i === 0) det.open = true;
    const sum = document.createElement('summary');
    sum.textContent = q;
    const p = document.createElement('p');
    p.textContent = a;
    det.append(sum, p);
    faq.append(det);
  });
  wrap.append(faq);

  block.replaceChildren(wrap);
}
