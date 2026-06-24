/**
 * text — canonical prose / CTA band: eyebrow, heading (h2), lede, and CTAs.
 * Generic; brand treatment via a VARIANT class (`text feature` = full-bleed
 * image-washed CTA band). Replaces the bespoke `insider` block.
 *
 * Authoring (one flat cell): eyebrow line, h2, lede <p>, CTA paragraph
 * (<strong><a> primary · <em><a> secondary · <em><strong><a> accent — styled by
 * the global button decorator). The feature background image lives in the CSS.
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out.length ? out : [...block.children];
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const headingSrc = nodes.find((n) => n.matches('h1,h2,h3,h4,h5,h6'));
  const paras = nodes.filter((n) => n.matches('p'));
  const ctaP = paras.find((p) => p.querySelector('a'));
  const textPs = paras.filter((p) => !p.querySelector('a'));
  const eyebrow = textPs[0];
  const lede = textPs[1];

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (eyebrow && lede) {
    const eb = document.createElement('span');
    eb.className = 'eyebrow';
    eb.textContent = eyebrow.textContent.trim();
    wrap.append(eb);
  }

  const h2 = document.createElement('h2');
  const hSrc = headingSrc && (headingSrc.querySelector('h1,h2,h3,h4,h5,h6') || headingSrc);
  if (hSrc) [...hSrc.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
  wrap.append(h2);

  if (lede) {
    const p = document.createElement('p');
    [...lede.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    wrap.append(p);
  }

  if (ctaP && ctaP.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'text-actions';
    [...ctaP.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    wrap.append(actions);
  }

  block.replaceChildren(wrap);
}
