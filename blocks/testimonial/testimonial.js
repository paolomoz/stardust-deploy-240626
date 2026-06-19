/**
 * testimonial — board-grade quote over the water still (Pebl "quote" section).
 *
 * Full-bleed dark background photo with a legibility gradient; a serif
 * blockquote + attribution sit on top.
 *
 * Authoring (one cell, flat siblings — DA-flattened, #62):
 *   blockquote text — a <p> or <blockquote> (use <em>/<span class="em"> accent)
 *   who            — a <p>: "Name — Role" (em-dash or comma splits name/role),
 *                    or two lines (name, role)
 *   CTA link       — a link-bearing <p> with a plain <a> (styled text link, not a button)
 *
 * Background photo is a FIXED block asset, root-relative under /img (#67).
 */

const BASE = '/img/velocity-global-refined';

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

  const quoteNode = nodes.find((n) => n.matches?.('blockquote'))
    || nodes.find((n) => n.matches?.('p') && !n.querySelector('a') && n.textContent.trim().length > 60);
  const linkP = nodes.find((n) => n.matches?.('p') && n.querySelector('a'));
  const whoP = nodes.find((n) => n.matches?.('p') && n !== quoteNode && !n.querySelector('a'));

  // background plane
  const bg = document.createElement('img');
  bg.className = 'bg';
  bg.src = `${BASE}/testimonials-water-real.jpg`;
  bg.alt = '';
  bg.setAttribute('aria-hidden', 'true');
  bg.loading = 'lazy';

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (quoteNode) {
    const bq = document.createElement('blockquote');
    const inner = quoteNode.matches('blockquote') ? quoteNode : quoteNode;
    [...inner.childNodes].forEach((n) => bq.append(n.cloneNode(true)));
    wrap.append(bq);
  }

  const attr = document.createElement('div');
  attr.className = 'attr';

  if (whoP) {
    const who = document.createElement('span');
    who.className = 'who';
    const raw = whoP.textContent.trim();
    const parts = raw.split(/\s+[—–-]\s+|,\s+/);
    if (parts.length > 1) {
      who.append(document.createTextNode(parts[0].trim()));
      const role = document.createElement('span');
      role.textContent = parts.slice(1).join(', ').trim();
      who.append(role);
    } else {
      who.textContent = raw;
    }
    attr.append(who);
  }

  if (linkP && linkP.querySelector('a')) {
    const a = linkP.querySelector('a');
    const cs = document.createElement('a');
    cs.className = 'cs';
    cs.href = a.getAttribute('href') || '#';
    cs.textContent = a.textContent.trim();
    attr.append(cs);
  }

  if (attr.childNodes.length) wrap.append(attr);

  block.replaceChildren(bg, wrap);
}
