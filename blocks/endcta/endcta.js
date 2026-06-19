/**
 * endcta — mint-drench closing CTA in full FK Roman voice (Pebl "endcta").
 *
 * Centered: kicker eyebrow, oversized headline, a pair of CTAs.
 *
 * Authoring (one cell, flat siblings — DA-flattened, #62):
 *   kicker   — short link-free <p> ("Build teams anywhere")
 *   <h2>     — the big closing headline (use <em>/<span class="em"> accent)
 *   CTAs     — link-bearing <p>: <em><strong><a> primary (dark fill),
 *              <em><a> secondary (dark outline on the mint ground)
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

  const heading = nodes.find((n) => n.matches?.('h1, h2, h3'));
  const ctaP = nodes.find((n) => n.matches?.('p') && n.querySelector('a'));
  const kicker = nodes.find((n) => n.matches?.('p') && !n.querySelector('a') && n !== heading);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (kicker) {
    const k = document.createElement('span');
    k.className = 'kicker';
    k.textContent = kicker.textContent.trim();
    wrap.append(k);
  }

  if (heading) {
    const h2 = document.createElement('h2');
    const inner = heading.matches('h2') ? heading : heading;
    [...inner.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    wrap.append(h2);
  }

  if (ctaP && ctaP.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'ec-cta';
    [...ctaP.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    wrap.append(actions);
  }

  block.replaceChildren(wrap);
}
