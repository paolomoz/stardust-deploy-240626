/**
 * capabilities — editorial ruled list + wide dashboard mockup banner.
 *
 * A section head (kicker + h2 + intro), then SIX ruled rows (each: an
 * auto-generated roman numeral i..vi, a serif h3 title, and a description),
 * then a fixed wide "Your team" dashboard mockup banner.
 *
 * The roman numerals are GENERATED in JS by index — do NOT author them.
 * The mockup image is a FIXED block asset, root-relative under /img (#67).
 *
 * Authoring — section head first, then ONE capability per row.
 *
 * Head (one cell, flat siblings — DA-flattened contract, #62):
 *   kicker — short link-free <p> (the eyebrow) — first text line
 *   <h2>   — the section headline (use <em>/<span class="em"> for accent)
 *   intro  — sentence-length link-free <p>
 *
 * Each capability row (one cell each):
 *   <h3>   — the capability title
 *   desc   — a link-free <p> describing it
 *
 * Authoring row shape (head row + 6 capability rows):
 *   | capabilities |
 *   | End-to-End Global HR (kicker) |
 *   | ## One platform for the entire employment lifecycle. |
 *   | Hiring, payroll, compliance... handled in every market. (intro) |
 *   |---|
 *   | ### Employer of Record |
 *   | Compliantly hire, onboard, and pay global employees... |
 *   |---|  (…repeat for the remaining five capabilities)
 *
 * Falls back to a single flat cell: kicker/h2/intro lead, then h3+p pairs.
 */

const BASE = '/img/velocity-global-refined';
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

function rowNodes(block) {
  return [...block.querySelectorAll(':scope > div')].map((row) => {
    const out = [];
    [...row.children].forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length) out.push(...kids);
      else if (cell.textContent.trim()) {
        const p = document.createElement('p');
        p.innerHTML = cell.innerHTML;
        out.push(p);
      }
    });
    return out;
  }).filter((r) => r.length);
}

function cloneInner(node, tag) {
  const el = document.createElement(tag);
  const inner = node.matches?.(tag) ? node : node.querySelector?.(tag) || node;
  [...inner.childNodes].forEach((n) => el.append(n.cloneNode(true)));
  return el;
}

export default async function decorate(block) {
  const rows = rowNodes(block);
  const flat = rows.flat();

  // Section head: kicker (first link-free p before h2), h2, intro p.
  const h2 = flat.find((n) => n.matches?.('h2'));
  const headRow = rows.find((r) => r.some((n) => n.matches?.('h2')));

  let kicker;
  let intro;
  if (headRow) {
    const ps = headRow.filter((n) => n.matches?.('p') && !n.querySelector?.('a'));
    kicker = ps[0];
    intro = ps[1];
  }

  // Capabilities: each h3 + the following description paragraph.
  const caps = [];
  const heads = flat.filter((n) => n.matches?.('h3'));
  if (heads.length) {
    heads.forEach((h) => {
      // description = next sibling p in the flat order
      const i = flat.indexOf(h);
      const desc = flat.slice(i + 1).find((n) => n.matches?.('p, h3'));
      caps.push({ title: h, desc: desc && desc.matches('p') ? desc : null });
    });
  }

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  // --- section head ---
  const head = document.createElement('div');
  head.className = 'section-head';
  if (kicker) {
    const k = document.createElement('span');
    k.className = 'kicker';
    k.textContent = kicker.textContent.trim();
    head.append(k);
  }
  if (h2) head.append(cloneInner(h2, 'h2'));
  if (intro) {
    const p = document.createElement('p');
    [...intro.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    head.append(p);
  }
  wrap.append(head);

  // --- ruled capability list ---
  const list = document.createElement('div');
  list.className = 'caps';
  caps.forEach(({ title, desc }, i) => {
    const cap = document.createElement('div');
    cap.className = 'cap';

    const idx = document.createElement('span');
    idx.className = 'idx';
    idx.textContent = ROMAN[i] || String(i + 1);
    cap.append(idx);

    const body = document.createElement('div');
    body.className = 'cap-body';
    body.append(cloneInner(title, 'h3'));
    if (desc) {
      const p = document.createElement('p');
      [...desc.childNodes].forEach((n) => p.append(n.cloneNode(true)));
      body.append(p);
    }
    cap.append(body);
    list.append(cap);
  });
  wrap.append(list);

  // --- fixed dashboard mockup banner ---
  const figure = document.createElement('figure');
  figure.className = 'caps-visual';
  const img = document.createElement('img');
  img.src = `${BASE}/your-team-mockup.png`;
  img.alt = "The Pebl platform 'Your team' dashboard, showing global employees managed in one place.";
  img.loading = 'lazy';
  figure.append(img);
  wrap.append(figure);

  block.replaceChildren(wrap);
}
