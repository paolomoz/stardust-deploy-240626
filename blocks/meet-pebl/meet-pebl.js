/**
 * meet-pebl — the "Meet Pebl" marquee moment on dark teal.
 *
 * Two columns: copy (kicker + h2 + lede + CTAs) on the left, a tall image
 * visual on the right. The visual image (pebl-og-img.jpg) is a FIXED block
 * asset committed root-relative under /img (#67) — not author-swappable —
 * so the JS builds the visual itself.
 *
 * Authoring (one cell, flat siblings — DA-flattened contract, #62):
 *   kicker — short link-free <p> (the eyebrow, e.g. "Meet Pebl")
 *   <h2>   — section heading (use <em>/<span class="em"> for the pacific accent)
 *   lede   — sentence-length link-free <p>
 *   CTAs   — link-bearing <p>: <strong><a> → primary (mint), <em><a> → secondary (ghost)
 *
 * Authoring row shape:
 *   | meet-pebl |
 *   | Meet Pebl |
 *   | <h2>The only platform you need to <em>build global teams.</em></h2> |
 *   | Manage your global workforce in one place... |
 *   | <strong><a href="#">Get a demo</a></strong> <em><a href="#">Explore the platform</a></em> |
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

  const heading = nodes.find((n) => n.matches?.('h2, h3'));
  const paras = nodes.filter((n) => n.matches?.('p'));
  const ctaP = paras.find((p) => p.querySelector('a'));
  const textPs = paras.filter((p) => !p.querySelector('a'));
  const kicker = textPs[0];
  const lede = textPs[1];

  const copy = document.createElement('div');
  copy.className = 'meet-copy';

  if (kicker) {
    const k = document.createElement('span');
    k.className = 'kicker';
    k.textContent = kicker.textContent.trim();
    copy.append(k);
  }

  if (heading) {
    const h2 = document.createElement('h2');
    const inner = heading.matches('h2, h3') ? heading : heading.querySelector('h2, h3') || heading;
    [...inner.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    copy.append(h2);
  }

  if (lede) {
    const p = document.createElement('p');
    [...lede.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    copy.append(p);
  }

  if (ctaP) {
    const actions = document.createElement('div');
    actions.className = 'meet-cta';
    [...ctaP.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    copy.append(actions);
  }

  const visual = document.createElement('div');
  visual.className = 'meet-visual';
  visual.innerHTML = `<img src="${BASE}/pebl-og-img.jpg" alt="The Pebl platform: hire, pay, and support global teams in one place." loading="lazy">`;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.append(copy, visual);

  block.replaceChildren(wrap);
}
