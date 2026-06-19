/**
 * insider — full-bleed red-washed CTA band over a brand background image.
 * Content: eyebrow, h2, lede, and a single accent CTA (white fill on red).
 *
 * Authoring (flat cell): eyebrow line, h2, lede <p>, CTA paragraph
 * (<em><strong><a>> → .btn.btn-accent white-on-red). Background is fixed.
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) { const p = document.createElement('p'); p.textContent = cell.textContent.trim(); out.push(p); }
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

  const ov = document.createElement('div');
  ov.className = 'ov';

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (eyebrow && lede) { const eb = document.createElement('span'); eb.className = 'eyebrow'; eb.textContent = eyebrow.textContent.trim(); wrap.append(eb); }

  const h2 = document.createElement('h2');
  const hSrc = headingSrc && (headingSrc.querySelector('h1,h2,h3,h4,h5,h6') || headingSrc);
  if (hSrc) [...hSrc.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
  wrap.append(h2);

  if (lede) { const p = document.createElement('p'); [...lede.childNodes].forEach((n) => p.append(n.cloneNode(true))); wrap.append(p); }

  if (ctaP && ctaP.querySelector('a')) {
    const actions = document.createElement('div'); actions.className = 'insider-actions';
    [...ctaP.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    wrap.append(actions);
  }

  block.replaceChildren(ov, wrap);
}
