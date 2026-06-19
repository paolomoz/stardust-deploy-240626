/**
 * endcta — closing call-to-action on pacific mint ground (centered)
 *
 * Authoring rows:
 *   1. heading -> <h2> (use <em> for the accent phrase)
 *   2. CTA links — <em><strong><a> accent (dark fill) primary, <em><a> secondary
 */

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  if (!cells.length) return;

  const headingCell = cells.find((c) => !c.querySelector('a'));
  const ctaCell = cells.find((c) => c.querySelector('a'));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (headingCell) {
    const h2 = document.createElement('h2');
    const inner = headingCell.querySelector('h1, h2, h3') || headingCell;
    [...inner.childNodes].forEach((c) => h2.append(c.cloneNode(true)));
    wrap.append(h2);
  }

  if (ctaCell && ctaCell.querySelector('a')) {
    const cta = document.createElement('div');
    cta.className = 'hero-cta';
    [...ctaCell.childNodes].forEach((n) => cta.append(n.cloneNode(true)));
    wrap.append(cta);
  }

  block.replaceChildren(wrap);
}
