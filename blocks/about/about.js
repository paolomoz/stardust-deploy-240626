/**
 * about — eyebrow + heading + intro, a 3-up stats band, then 3 feature cards.
 *
 * Authoring rows:
 *   head: eyebrow (short), heading, intro paragraph
 *   stats: rows shaped "<number> · <label>" OR a number cell + label cell
 *          (group of 3, no media)
 *   features: one row per card, cells: <picture>|img, heading, body, link
 */

function mediaOf(el) {
  return el.matches('picture, img') ? el : el.querySelector('picture, img');
}

function headingOf(el) {
  return el.matches('h1,h2,h3,h4,h5,h6') ? el : el.querySelector('h1,h2,h3,h4,h5,h6');
}

function rowNodes(row) {
  const out = [];
  [...row.children].forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = cell.textContent.trim();
      out.push(p);
    }
  });
  return out;
}

export default async function decorate(block) {
  const rows = [...block.children];
  if (!rows.length) return;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  const statsEl = document.createElement('div');
  statsEl.className = 'stats';
  const features = document.createElement('div');
  features.className = 'features';

  let eyebrowSeen = false;
  let headDone = false;

  rows.forEach((row) => {
    const nodes = rowNodes(row);
    if (!nodes.length) return;
    const media = nodes.find((n) => mediaOf(n));
    const heading = nodes.find((n) => headingOf(n));

    // feature card = has media
    if (media) {
      headDone = true;
      const article = document.createElement('article');
      article.className = 'feat';
      const ph = document.createElement('div');
      ph.className = 'ph';
      ph.append(mediaOf(media));
      article.append(ph);
      const body = document.createElement('div');
      body.className = 'body';
      if (heading) {
        const h = document.createElement('h3');
        const hi = headingOf(heading);
        [...hi.childNodes].forEach((n) => h.append(n.cloneNode(true)));
        body.append(h);
      }
      const link = nodes.find((n) => n.matches('a') || n.querySelector('a'));
      nodes.filter((n) => n.matches('p') && n !== heading
        && !(link && (link === n || n.contains(link)))).forEach((p) => body.append(p));
      if (link) {
        const a = link.matches('a') ? link : link.querySelector('a');
        a.classList.add('go');
        body.append(a);
      }
      article.append(body);
      features.append(article);
      return;
    }

    // a stat line: "<number> · <label>" in one cell, or number+label
    const joined = nodes.map((n) => n.textContent.trim()).join(' · ');
    const statMatch = joined.match(/^([\d][\d,.+ ]*)\s*[·•|–-]\s*(.+)$/);
    if (headDone || statMatch) {
      if (statMatch) {
        headDone = true;
        const stat = document.createElement('div');
        stat.className = 'stat';
        const n = document.createElement('div');
        n.className = 'n';
        n.textContent = statMatch[1].trim();
        const l = document.createElement('div');
        l.className = 'l';
        l.textContent = statMatch[2].trim();
        stat.append(n, l);
        statsEl.append(stat);
        return;
      }
    }

    // head rows (no media, not a stat): eyebrow -> heading -> intro
    if (heading) {
      const h = document.createElement('h2');
      const hi = headingOf(heading);
      [...hi.childNodes].forEach((n) => h.append(n.cloneNode(true)));
      wrap.append(h);
      return;
    }
    const p = document.createElement('p');
    if (!eyebrowSeen) {
      p.className = 'eyebrow';
      eyebrowSeen = true;
    } else {
      p.className = 'intro';
    }
    p.textContent = nodes.map((n) => n.textContent.trim()).join(' ');
    wrap.append(p);
  });

  if (statsEl.children.length) wrap.append(statsEl);
  if (features.children.length) wrap.append(features);
  block.replaceChildren(wrap);
}
