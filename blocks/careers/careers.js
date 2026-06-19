/**
 * careers — section head (03) + 2-col body: a serif italic pull-quote | prose + CTA.
 *
 * Authored shape:
 *   - <h2> section title
 *   - blockquote / quote paragraph (the pull-quote)
 *   - body paragraph
 *   - CTA: <strong><a>…</a></strong>
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
  const heading = nodes.find((n) => n.matches('h1, h2, h3') || n.querySelector('h1, h2, h3'));
  const headingEl = heading && (heading.matches('h1, h2, h3') ? heading : heading.querySelector('h1, h2, h3'));
  const quote = nodes.find((n) => n.matches('blockquote') || n.querySelector('blockquote'));
  const quoteEl = quote && (quote.matches('blockquote') ? quote : quote.querySelector('blockquote'));
  const textPs = nodes.filter((n) => n.matches('p') && !n.querySelector('a') && n !== heading && n !== quote);
  // if no blockquote tag, treat the first link-free paragraph as the quote
  const quoteText = quoteEl ? quoteEl.textContent.trim() : (textPs[0] ? textPs[0].textContent.trim() : '');
  const bodyText = quoteEl ? (textPs[0] ? textPs[0].textContent.trim() : '') : (textPs[1] ? textPs[1].textContent.trim() : '');
  const linkNode = nodes.find((n) => n.matches('a') || n.querySelector('a'));
  const ctaLink = linkNode && (linkNode.matches('a') ? linkNode : linkNode.querySelector('a'));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const head = document.createElement('div');
  head.className = 'head';
  const idx = document.createElement('div');
  idx.className = 'idx';
  idx.textContent = '03';
  const ht = document.createElement('div');
  ht.className = 'ht';
  if (headingEl) {
    const h2 = document.createElement('h2');
    [...headingEl.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    ht.append(h2);
  }
  head.append(idx, ht);
  wrap.append(head);

  const body = document.createElement('div');
  body.className = 'body';
  const bq = document.createElement('blockquote');
  bq.textContent = quoteText;
  const col = document.createElement('div');
  if (bodyText) {
    const p = document.createElement('p');
    p.textContent = bodyText;
    col.append(p);
  }
  if (ctaLink) {
    const actions = document.createElement('div');
    actions.className = 'actions';
    actions.append(ctaLink.cloneNode(true));
    col.append(actions);
  }
  body.append(bq, col);
  wrap.append(body);

  block.replaceChildren(wrap);
}
