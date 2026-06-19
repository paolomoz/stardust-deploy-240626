/**
 * mission — serif lead statement + 3 routing cards.
 *
 * Authoring rows:
 *   1. lead statement (one cell) — may contain <em> for italic emphasis
 *   2..N. one row per route card, cells: <picture>|img, heading, body, link
 *         (also tolerates one flat cell per card with those as siblings)
 */

function mediaOf(el) {
  return el.matches('picture, img') ? el : el.querySelector('picture, img');
}

function headingOf(el) {
  return el.matches('h1,h2,h3,h4,h5,h6') ? el : el.querySelector('h1,h2,h3,h4,h5,h6');
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  // first row = lead
  const leadCell = rows[0].querySelector(':scope > div') || rows[0];
  const lead = document.createElement('p');
  lead.className = 'lead';
  const leadInner = leadCell.querySelector('p') || leadCell;
  [...leadInner.childNodes].forEach((n) => lead.append(n.cloneNode(true)));

  const routes = document.createElement('div');
  routes.className = 'routes';

  rows.slice(1).forEach((row) => {
    // collect this row's content nodes (flat cell or multiple cells)
    const nodes = [];
    const cells = [...row.children];
    cells.forEach((cell) => {
      const kids = [...cell.children];
      if (kids.length) nodes.push(...kids);
      else if (cell.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = cell.textContent.trim();
        nodes.push(p);
      }
    });
    if (!nodes.length) return;

    const media = nodes.find((n) => mediaOf(n));
    const heading = nodes.find((n) => headingOf(n));
    const link = nodes.find((n) => n.matches('a') || n.querySelector('a'));
    const bodies = nodes.filter((n) => n.matches('p') && n !== heading
      && !(media && media.contains(n)) && !(link && (link === n || n.contains(link))));

    const article = document.createElement('article');
    article.className = 'route';

    const ph = document.createElement('div');
    ph.className = 'ph';
    const m = media ? mediaOf(media) : null;
    if (m) ph.append(m);
    article.append(ph);

    const body = document.createElement('div');
    body.className = 'body';
    if (heading) {
      const h = document.createElement('h3');
      const hi = headingOf(heading);
      [...hi.childNodes].forEach((n) => h.append(n.cloneNode(true)));
      body.append(h);
    }
    bodies.forEach((b) => body.append(b));
    if (link) {
      const a = link.matches('a') ? link : link.querySelector('a');
      a.classList.add('go');
      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = '→';
      if (!a.querySelector('.arrow')) a.append(' ', arrow);
      body.append(a);
    }
    article.append(body);
    routes.append(article);
  });

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.append(lead, routes);
  block.replaceChildren(wrap);
}
