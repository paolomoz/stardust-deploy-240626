/**
 * statement — big editorial blockquote on arctic ground
 *
 * Authoring rows:
 *   1. eyebrow ("Meet Pebl")
 *   2. statement -> <h2> for outline (use <em> for the accent phrase)
 *   3. attribution sentence
 *   4. CTA links — <strong><a> primary, <em><a> secondary
 */

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  if (!cells.length) return;

  const eyebrow = cells[0] ? cells[0].textContent.trim() : '';
  const stmtCell = cells[1];
  const attr = cells[2] ? cells[2].textContent.trim() : '';
  const ctaCell = cells.find((c) => c.querySelector('a'));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (eyebrow) {
    const eb = document.createElement('p');
    eb.className = 'eyebrow';
    eb.textContent = eyebrow;
    wrap.append(eb);
  }

  if (stmtCell) {
    const bq = document.createElement('h2');
    bq.className = 'statement-quote';
    const inner = stmtCell.querySelector('h1, h2, h3') || stmtCell;
    [...inner.childNodes].forEach((c) => bq.append(c.cloneNode(true)));
    wrap.append(bq);
  }

  if (attr) {
    const a = document.createElement('p');
    a.className = 'attr';
    a.textContent = attr;
    wrap.append(a);
  }

  if (ctaCell && ctaCell !== cells[1] && ctaCell.querySelector('a')) {
    const cta = document.createElement('div');
    cta.className = 'hero-cta';
    [...ctaCell.childNodes].forEach((n) => cta.append(n.cloneNode(true)));
    wrap.append(cta);
  }

  block.replaceChildren(wrap);
}
