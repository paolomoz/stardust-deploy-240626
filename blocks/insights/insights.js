/**
 * insights — editorial index of photo-led insight cards (Pebl "insights").
 *
 * A head row (h2 + "Explore all →" link), then N cards. Each card is a whole-
 * card anchor: photo figure + meta (TYPE · date) + h3 title + "Read → " arrow.
 *
 * Authoring (DA-flattened, #62). Head first, then one card per row:
 *   head row : the section <h2> + a link-bearing <p> ("Explore all →")
 *   card row : meta line  "Report · Oct 20, 2025"   (· or — separates type/date)
 *              <h3> card title
 *              a link-bearing <p>  ("Read the report →")
 * Card photos are FIXED block assets, mapped by card index, root-relative (#67).
 */

const BASE = '/img/velocity-global-refined';
const CARD_IMAGES = [
  'insight-hiring-report.jpg',
  'insight-rapid7.jpg',
  'insight-eor.jpg',
];

export default async function decorate(block) {
  const rows = [...block.children];

  // The head is everything before the first row that contains an <h3>.
  let firstCardIdx = rows.findIndex((r) => r.querySelector('h3'));
  if (firstCardIdx === -1) firstCardIdx = rows.length > 0 ? 1 : 0;

  const headRows = rows.slice(0, firstCardIdx);
  const cardRows = rows.slice(firstCardIdx);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // ---- head ----
  const head = document.createElement('div');
  head.className = 'ins-head';
  const headNodes = [];
  headRows.forEach((r) => r.querySelectorAll(':scope > div').forEach((c) => {
    [...c.children].forEach((k) => headNodes.push(k));
    if (!c.children.length && c.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = c.textContent.trim();
      headNodes.push(p);
    }
  }));
  const h2 = headNodes.find((n) => n.matches?.('h1, h2, h3'));
  if (h2) {
    const h = document.createElement('h2');
    const inner = h2.matches('h2') ? h2 : h2;
    [...inner.childNodes].forEach((n) => h.append(n.cloneNode(true)));
    head.append(h);
  }
  const allLinkP = headNodes.find((n) => n.matches?.('p') && n.querySelector('a'));
  if (allLinkP) {
    const a = allLinkP.querySelector('a');
    const all = document.createElement('a');
    all.className = 'all';
    all.href = a.getAttribute('href') || '#';
    all.textContent = a.textContent.trim();
    head.append(all);
  }
  wrap.append(head);

  // ---- cards ----
  const grid = document.createElement('div');
  grid.className = 'ins-grid';

  cardRows.forEach((row, i) => {
    // gather this card's nodes (cells may be one-per or flattened)
    const cardNodes = [];
    row.querySelectorAll(':scope > div').forEach((c) => {
      [...c.children].forEach((k) => cardNodes.push(k));
      if (!c.children.length && c.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = c.textContent.trim();
        cardNodes.push(p);
      }
    });
    if (!cardNodes.length) return;

    const titleNode = cardNodes.find((n) => n.matches?.('h1, h2, h3, h4'));
    const linkP = cardNodes.find((n) => n.matches?.('p') && n.querySelector('a'));
    const metaP = cardNodes.find((n) => n.matches?.('p') && !n.querySelector('a') && n !== titleNode);

    const card = document.createElement('a');
    card.className = 'ins-card';
    const cardLink = linkP && linkP.querySelector('a');
    card.href = cardLink ? cardLink.getAttribute('href') || '#' : '#';

    // figure
    const fig = document.createElement('div');
    fig.className = 'ins-figure';
    const img = document.createElement('img');
    img.src = `${BASE}/${CARD_IMAGES[i] || CARD_IMAGES[CARD_IMAGES.length - 1]}`;
    img.alt = titleNode ? titleNode.textContent.trim() : '';
    img.loading = 'lazy';
    fig.append(img);
    card.append(fig);

    const txt = document.createElement('div');
    txt.className = 'ins-text';

    if (metaP) {
      const meta = document.createElement('span');
      meta.className = 'meta';
      const raw = metaP.textContent.trim();
      const parts = raw.split(/\s*[·•|—–]\s*/);
      if (parts.length > 1) {
        const strong = document.createElement('strong');
        strong.textContent = parts[0].trim();
        meta.append(strong, document.createTextNode(parts.slice(1).join(' · ').trim()));
      } else {
        meta.textContent = raw;
      }
      txt.append(meta);
    }

    if (titleNode) {
      const h3 = document.createElement('h3');
      [...titleNode.childNodes].forEach((n) => h3.append(n.cloneNode(true)));
      txt.append(h3);
    }

    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = cardLink ? cardLink.textContent.trim() : 'Read more →';
    txt.append(arrow);

    card.append(txt);
    grid.append(card);
  });

  wrap.append(grid);
  block.replaceChildren(wrap);
}
