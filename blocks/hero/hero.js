/**
 * hero -- statement band #1 (purple): value-prop headline + sub + CTAs + 3 UI cards
 *
 * Authored shape (DA flattens to one cell; this reads by querying, not by index):
 *   - h1 ......... the page's single headline (may contain a <strong> for the
 *                  yellow-highlight word, which we re-wrap as .accent-y, #39)
 *   - p .......... the sub paragraph (link-free)
 *   - p (links) .. the CTA group (<em><strong><a> primary -> btn-accent yellow;
 *                  <em><a> secondary outline). ak.js applies the .btn classes.
 *   - 3x card lines: "Label · Title · NN%" -- rendered as the UI strip.
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

function highlightAccent(h) {
  const strong = h.querySelector('strong');
  if (strong) {
    const span = document.createElement('span');
    span.className = 'accent-y';
    span.append(...strong.childNodes);
    strong.replaceWith(span);
  }
}

function uiCard(label, title, pct, yellow) {
  const card = document.createElement('div');
  card.className = 'ui';
  card.innerHTML = `<span class="k">${label}</span><h4>${title}</h4>`
    + `<div class="meter${yellow ? ' y' : ''}"><span style="width:${pct}"></span></div>`;
  return card;
}

function hasLink(n) { return n.matches?.('a') || !!n.querySelector?.('a'); }

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const h = nodes.find((n) => n.matches?.('h1, h2, h3'));
  const ctaNodes = nodes.filter(hasLink);
  const textNodes = nodes.filter((n) => n.matches?.('p') && !hasLink(n));
  const cardLines = textNodes
    .filter((p) => /\d+%/.test(p.textContent))
    .map((p) => p.textContent.split(/\s*[·|]\s*/).map((s) => s.trim()));
  const sub = textNodes.find((p) => !/\d+%/.test(p.textContent) && p.textContent.trim());

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (h) {
    highlightAccent(h);
    wrap.append(h);
  }
  if (sub) { sub.className = 'sub'; wrap.append(sub); }
  if (ctaNodes.length) {
    const cta = document.createElement('div');
    cta.className = 'cta';
    ctaNodes.forEach((n) => cta.append(n));
    wrap.append(cta);
  }

  if (cardLines.length) {
    const strip = document.createElement('div');
    strip.className = 'hero-strip';
    cardLines.forEach(([label, title, pct], i) => {
      strip.append(uiCard(label || '', title || '', pct || '0%', i === 0));
    });
    wrap.append(strip);
  }

  block.replaceChildren(wrap);
}
