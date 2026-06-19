/**
 * news — section head (04) + a list of dated news rows (each links out) + a CTA.
 *
 * Authored shape (one row per logical unit):
 *   row 1: <h2> section title                       -> the section head
 *   rows 2..N-1: one news item per row, cell holds:
 *       <p>date</p> <h3>headline</h3> <p>sub</p>     (date first, then h3, then sub)
 *   last row: CTA cell -> <strong><a>…</a></strong>
 *
 * Robust to flattening: each <h3> opens a news item; the date is the text node that
 * immediately precedes the heading, the sub is the text that follows it.
 */

function rowsOf(block) {
  return [...block.querySelectorAll(':scope > div')];
}

function firstHeading(el, sel) {
  return el.matches(sel) ? el : el.querySelector(sel);
}

export default async function decorate(block) {
  const rows = rowsOf(block);

  let headingEl = null;
  let ctaLink = null;
  const items = [];

  rows.forEach((row) => {
    const cell = row.firstElementChild || row;
    const h2 = cell.querySelector('h2');
    const h3 = cell.querySelector('h3');
    const a = cell.querySelector('a');

    if (h2 && !h3) { headingEl = h2; return; }
    if (a && !h3) { ctaLink = a; return; }
    if (h3) {
      // date = first <p>/text before the h3; sub = text after it
      const ps = [...cell.querySelectorAll('p')].map((p) => p.textContent.trim()).filter(Boolean);
      const subEl = cell.querySelector('.sub');
      let date = '';
      let sub = '';
      if (subEl) {
        sub = subEl.textContent.trim();
        date = ps.find((t) => t !== sub) || '';
      } else {
        date = ps[0] || '';
        sub = ps[1] || '';
      }
      items.push({ date, title: h3.textContent.trim(), sub });
    }
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const head = document.createElement('div');
  head.className = 'head';
  const ix = document.createElement('div');
  ix.className = 'idx';
  ix.textContent = '04';
  const ht = document.createElement('div');
  ht.className = 'ht';
  if (headingEl) {
    const h2 = document.createElement('h2');
    [...firstHeading(headingEl, 'h2').childNodes].forEach((c) => h2.append(c.cloneNode(true)));
    ht.append(h2);
  }
  head.append(ix, ht);
  wrap.append(head);

  const list = document.createElement('div');
  list.className = 'news-list';
  items.forEach((it) => {
    const rowA = document.createElement('a');
    rowA.className = 'news-row';
    rowA.href = '/tyson/';
    const date = document.createElement('div');
    date.className = 'date';
    date.textContent = it.date;
    const mid = document.createElement('div');
    const h3 = document.createElement('h3');
    h3.textContent = it.title;
    mid.append(h3);
    if (it.sub) {
      const sub = document.createElement('div');
      sub.className = 'sub';
      sub.textContent = it.sub;
      mid.append(sub);
    }
    const more = document.createElement('span');
    more.className = 'lnk';
    more.textContent = 'Read ›';
    rowA.append(date, mid, more);
    list.append(rowA);
  });
  wrap.append(list);

  if (ctaLink) {
    const foot = document.createElement('div');
    foot.className = 'news-foot';
    foot.append(ctaLink.cloneNode(true));
    wrap.append(foot);
  }

  block.replaceChildren(wrap);
}
