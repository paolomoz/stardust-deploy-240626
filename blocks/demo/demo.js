/**
 * demo -- purple band #3, split: left (eyebrow + h2 + body + 2 CTAs), right a
 * "live campaign snapshot" card with kicker + h4 + two labelled meters.
 *
 * Authored shape (flattened):
 *   - p (eyebrow), h2, p (body), p (CTAs: <em><strong><a> + <em><a>)
 *   - card kicker line "LUNEA · Spring launch"
 *   - h4 (card title)
 *   - 2x meter lines "Reach · 78%", "ROAS · 88%"
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

function meter(label, pct, yellow) {
  const el = document.createElement('div');
  el.className = 'meter-row';
  el.innerHTML = `<div class="ml">${label}</div>`
    + `<div class="meter${yellow ? ' y' : ''}"><span style="width:${pct}"></span></div>`;
  return el;
}

export default async function decorate(block) {
  const nodes = collectNodes(block);
  const hasLink = (n) => n.matches?.('a') || !!n.querySelector?.('a');
  const h = nodes.find((n) => n.matches?.('h2, h1, h3'));
  const cardTitle = nodes.find((n) => n.matches?.('h4'));
  const ctaNodes = nodes.filter(hasLink);
  const ps = nodes.filter((n) => n.matches?.('p') && !hasLink(n) && n.textContent.trim());
  const hIdx = nodes.indexOf(h);
  const eyebrow = ps.find((p) => nodes.indexOf(p) < hIdx);
  const meterLines = ps.filter((p) => /\d+%/.test(p.textContent));
  const body = ps.find((p) => p !== eyebrow && !meterLines.includes(p) && !/·/.test(p.textContent));
  const kicker = ps.find((p) => p !== eyebrow && p !== body
    && !meterLines.includes(p) && /·/.test(p.textContent));

  const wrap = document.createElement('div');
  wrap.className = 'wrap demo-grid';

  const left = document.createElement('div');
  if (eyebrow) { eyebrow.className = 'eyebrow light'; left.append(eyebrow); }
  if (h) { h.style.marginTop = '16px'; left.append(h); }
  if (body) left.append(body);
  if (ctaNodes.length) {
    const cta = document.createElement('div');
    cta.className = 'cta';
    ctaNodes.forEach((n) => cta.append(n));
    left.append(cta);
  }

  const card = document.createElement('div');
  card.className = 'demo-card';
  if (kicker) { const k = document.createElement('span'); k.className = 'k'; k.textContent = kicker.textContent.trim(); card.append(k); }
  if (cardTitle) card.append(cardTitle);
  meterLines.forEach((p, i) => {
    const [label, pct] = p.textContent.split(/\s*[·|]\s*/).map((s) => s.trim());
    card.append(meter(label || '', pct || '0%', i % 2 === 1));
  });

  wrap.append(left, card);
  block.replaceChildren(wrap);
}
