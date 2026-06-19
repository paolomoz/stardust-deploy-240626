/**
 * g2-proof — G2 compliance proof, two columns on the light ground.
 *
 * Copy left (kicker + h2 + paragraph + a styled TEXT LINK "Simplify
 * compliance →"), real photography right (content-1.jpg — a FIXED block asset,
 * root-relative under /img, #67). The "Simplify compliance →" link is a styled
 * TEXT LINK (class g2-link), NOT a button — author it as a plain link and it is
 * styled per-block.
 *
 * Authoring (one cell, flat siblings — DA-flattened contract, #62):
 *   kicker — short link-free <p> (the eyebrow line)
 *   <h2>   — the headline
 *   body   — sentence-length link-free <p>
 *   link   — a link-bearing <p> with a SINGLE plain <a> ("Simplify compliance →").
 *            Do NOT wrap it in <strong>/<em> — it must stay a text link, not a button.
 *
 * Authoring row shape:
 *   | g2-proof |
 *   | Rated #1 on G2 |
 *   | ## Compliance you can put in front of a board. |
 *   | Pebl delivers the local expertise to navigate labor laws... |
 *   | [Simplify compliance →](#) |
 */

const BASE = '/img/velocity-global-refined';

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = cell.innerHTML;
      out.push(p);
    }
  });
  return out.length ? out : [...block.children];
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const heading = nodes.find((n) => n.matches?.('h2, h3'));
  const paras = nodes.filter((n) => n.matches?.('p'));
  const linkP = paras.find((p) => p.querySelector('a'));
  const textPs = paras.filter((p) => p !== linkP && !p.querySelector('a'));
  const kicker = textPs[0];
  const body = textPs[1];

  // --- copy column ---
  const copy = document.createElement('div');
  copy.className = 'g2-copy';

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

  if (body) {
    const p = document.createElement('p');
    [...body.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    copy.append(p);
  }

  const link = linkP?.querySelector('a');
  if (link) {
    const a = link.cloneNode(true);
    a.classList.add('g2-link');
    a.classList.remove('btn', 'btn-primary', 'btn-secondary', 'btn-accent');
    copy.append(a);
  }

  // --- media column (fixed asset) ---
  const figure = document.createElement('figure');
  figure.className = 'g2-media';
  figure.innerHTML = `
    <picture>
      <source type="image/webp" srcset="${BASE}/content-1.webp">
      <img src="${BASE}/content-1.jpg"
           alt="Pebl rated 4.7 stars and #1 on G2 for compliance, with five G2 badges."
           loading="lazy" decoding="async" width="1200" height="910">
    </picture>`;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.append(copy, figure);

  block.replaceChildren(wrap);
}
