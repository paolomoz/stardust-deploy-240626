/**
 * reasons — "More reasons to join" statement rows; large display headings
 * paired with a poster, separated by hairlines.
 *
 * Authoring rows:
 *   1. eyebrow text
 *   2. heading text
 *   3..N. statement rows, each with cells:  heading(h3) | body(p) | <picture>
 *         (heading-boundary segmentation if DA flattens to one cell).
 */

function media(el) {
  return el.matches('picture, img') ? el : el.querySelector('picture, img');
}

function isHeading(el) {
  return el.matches('h1, h2, h3, h4, h5, h6');
}

export default async function decorate(block) {
  const rows = [...block.children];
  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // separate head rows (no media, no statement heading) from statement rows
  const stmtRows = [];
  const headRows = [];
  rows.forEach((row) => {
    const cells = [...row.children];
    const flat = cells.flatMap((c) => (c.children.length ? [...c.children] : [c]));
    const hasStmt = flat.some((c) => media(c)) || cells.some((c) => media(c));
    if (hasStmt) stmtRows.push(row);
    else headRows.push(row);
  });

  const headTexts = headRows.map((r) => r.textContent.trim()).filter(Boolean);
  if (headTexts[0]) {
    const eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    [eyebrow.textContent] = headTexts;
    wrap.append(eyebrow);
  }
  if (headTexts[1]) {
    const h2 = document.createElement('h2');
    [, h2.textContent] = headTexts;
    wrap.append(h2);
  }

  const stmts = document.createElement('div');
  stmts.className = 'statements';

  stmtRows.forEach((row) => {
    const cells = [...row.children];
    // collect candidate elements across cells
    const els = cells.flatMap((c) => (c.children.length ? [...c.children] : [c]));
    const headingEl = els.find((e) => isHeading(e));
    const pic = cells.map((c) => media(c)).find(Boolean) || els.map(media).find(Boolean);
    const bodyEl = els.find((e) => e.matches('p') && e !== headingEl);

    const stmt = document.createElement('div');
    stmt.className = 'stmt';

    const textWrap = document.createElement('div');
    textWrap.className = 'stmt-text';
    if (headingEl) {
      const h3 = document.createElement('h3');
      h3.textContent = headingEl.textContent.trim();
      textWrap.append(h3);
    }
    if (bodyEl) {
      const p = document.createElement('p');
      p.textContent = bodyEl.textContent.trim();
      textWrap.append(p);
    }
    stmt.append(textWrap);

    if (pic) {
      pic.classList.add('stmt-art');
      stmt.append(pic);
    }

    stmts.append(stmt);
  });

  wrap.append(stmts);
  block.replaceChildren(wrap);
}
