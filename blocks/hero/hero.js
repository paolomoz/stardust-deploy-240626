/**
 * hero — full-bleed photo hero with headline, sub, CTAs.
 *
 * Authoring (flattened single cell or multi-row, queried not indexed):
 *   - <picture>/<img> background
 *   - <h1> headline
 *   - link-free <p> sub copy
 *   - link-bearing <p> CTAs (<strong><a> primary, <em><a> secondary)
 */

function mediaOf(el) {
  return el.matches('picture, img') ? el : el.querySelector('picture, img');
}

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
  const media = nodes.find((n) => mediaOf(n));
  const heading = nodes.find((n) => n.matches('h1, h2') || n.querySelector('h1, h2'));
  const ps = nodes.filter((n) => n.matches('p') && !(media && media.contains(n)));
  const sub = ps.find((p) => !p.querySelector('a'));
  const ctaP = ps.find((p) => p.querySelector('a'));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (heading) {
    const inner = heading.matches('h1, h2') ? heading : heading.querySelector('h1, h2');
    const h1 = document.createElement('h1');
    [...inner.childNodes].forEach((n) => h1.append(n.cloneNode(true)));
    wrap.append(h1);
  }
  if (sub) {
    sub.classList.add('sub');
    wrap.append(sub);
  }
  if (ctaP && ctaP.querySelector('a')) {
    const row = document.createElement('div');
    row.className = 'cta-row';
    [...ctaP.childNodes].forEach((n) => row.append(n.cloneNode(true)));
    wrap.append(row);
  }

  const bg = media ? mediaOf(media) : null;
  block.replaceChildren();
  if (bg) {
    bg.classList.add('bg');
    block.append(bg);
  }
  block.append(wrap);
}
