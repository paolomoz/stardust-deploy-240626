/**
 * insights — editorial index of articles on paper ground
 *
 * Authoring rows:
 *   1. chapter number ("05")
 *   2. eyebrow ("Explore Pebl insights")
 *   3. heading -> <h2>
 *   4..N. index items, one row each — a link whose text is "Date · Title"
 *         (author as a plain <a>; date is the segment before the first "·")
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

  const list = document.createElement('div');
  list.className = 'idx-list';
  rows.slice(3).forEach((row) => {
    const srcA = row.querySelector('a');
    const text = (srcA ? srcA.textContent : row.textContent).trim();
    if (!text) return;
    const parts = text.split(/\s*[·•|—–]\s*/);
    let date = '';
    let title = text;
    if (parts.length >= 2) {
      [date] = parts;
      title = parts.slice(1).join(' · ');
    }
    const a = document.createElement('a');
    a.className = 'idx-item';
    a.href = srcA ? srcA.getAttribute('href') : '#';
    const d = document.createElement('span');
    d.className = 'date';
    d.textContent = date;
    const h3 = document.createElement('h3');
    h3.textContent = title;
    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = '→';
    a.append(d, h3, arrow);
    list.append(a);
  });
  wrap.append(list);

  block.replaceChildren(wrap);
}
