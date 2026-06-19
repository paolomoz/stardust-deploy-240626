/**
 * band — full-bleed photo band with heading, body, single CTA.
 *
 * Authoring (flat single cell or multi-row):
 *   - <picture>/<img> background
 *   - heading
 *   - body paragraph
 *   - CTA link (wrap in <strong> for primary or <em><strong> for white accent)
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

function mediaOf(el) {
  return el.matches('picture, img') ? el : el.querySelector('picture, img');
}

function headingOf(el) {
  return el.matches('h1,h2,h3,h4,h5,h6') ? el : el.querySelector('h1,h2,h3,h4,h5,h6');
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const media = nodes.find((n) => mediaOf(n));
  const heading = nodes.find((n) => headingOf(n));
  const ctaP = nodes.find((n) => n.matches('p') && n.querySelector('a'));
  const body = nodes.find((n) => n.matches('p') && !n.querySelector('a')
    && !(media && media.contains(n)));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (heading) {
    const h = document.createElement('h2');
    const hi = headingOf(heading);
    [...hi.childNodes].forEach((n) => h.append(n.cloneNode(true)));
    wrap.append(h);
  }
  if (body) wrap.append(body);
  if (ctaP && ctaP.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    [...ctaP.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    wrap.append(actions);
  }

  const bg = media ? mediaOf(media) : null;
  block.replaceChildren();
  if (bg) {
    bg.classList.add('bg');
    block.append(bg);
  }
  block.append(wrap);
}
