/**
 * experience — full-bleed photographic moment ("An experience the competition can't match").
 *
 * A background photo (content-3.jpg) under a left-to-right legibility scrim,
 * with copy reading from the left edge. The background image is a FIXED block
 * asset committed root-relative under /img (#67) — not author-swappable — so
 * the JS builds the <img class="bg"> itself.
 *
 * Authoring (one cell, flat siblings — DA-flattened contract, #62):
 *   kicker — short link-free <p> (the eyebrow, e.g. "Why Pebl")
 *   <h2>   — section heading (use <em>/<span class="em"> for the pacific accent)
 *   lede   — sentence-length link-free <p>
 *   CTAs   — link-bearing <p>: <strong><a> → primary (mint), <em><a> → secondary (ghost)
 *
 * Authoring row shape:
 *   | experience |
 *   | Why Pebl |
 *   | <h2>An experience the <em>competition can't match.</em></h2> |
 *   | People-first support, AI-powered tools... |
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

  const bg = document.createElement('img');
  bg.className = 'bg';
  bg.src = `${BASE}/content-3.jpg`;
  bg.alt = '';
  bg.setAttribute('aria-hidden', 'true');
  bg.loading = 'lazy';

  const copy = document.createElement('div');
  copy.className = 'ex-copy';

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
    actions.className = 'ex-cta';
    [...ctaP.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    copy.append(actions);
  }

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.append(copy);

  block.replaceChildren(bg, wrap);
}
