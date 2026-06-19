/**
 * hero — DevRev "What's missing from your AI?" lead with a team router grid.
 *
 * Authoring (flat, one cell per row tolerated):
 *   - eyebrow text (short, link-free)        -> .eyebrow
 *   - <h1> headline                          -> the page's single <h1>
 *   - lede paragraph (link-free sentence)    -> .lede
 *   - CTA paragraph (link-bearing)           -> .hero-foot (.btn via decorateButton)
 *   - 6 route rows: each "Who · Title · Task" delimited line
 *   - optional trailing small note line       -> .small
 *
 * The router is presentational (each route is an <a>); block JS builds the grid.
 */

/* One logical field per inner cell — robust to both the DA-flattened single-cell
   shape and the harness's per-row shape. */
function collectCells(block) {
  return [...block.querySelectorAll(':scope > div > div')].filter(
    (c) => c.textContent.trim() || c.querySelector('picture, img'),
  );
}

function buildRoute(line) {
  const parts = line.split('·').map((s) => s.trim()).filter(Boolean);
  const a = document.createElement('a');
  a.className = 'route';
  a.href = '#';
  const who = parts[0] || '';
  const title = parts[1] || '';
  const task = parts[2] || '';
  a.innerHTML = `<span class="who">${who}</span><h3>${title}</h3><span class="task">${task}</span><span class="go">&rarr;</span>`;
  return a;
}

export default async function decorate(block) {
  const cells = collectCells(block);

  const h1 = cells.find((c) => c.querySelector('h1, h2, h3, h4'));
  const ctaCell = cells.find((c) => c.querySelector('a:not(.route)')
    && !c.textContent.includes('·'));
  const routeLines = cells
    .filter((c) => c.textContent.includes('·'))
    .map((c) => c.textContent.trim());
  const textCells = cells.filter((c) => c !== h1 && c !== ctaCell
    && !c.textContent.includes('·') && !c.querySelector('a'));
  const eyebrowEl = textCells.find((c) => c.textContent.trim().length < 60);
  const ledeEl = textCells.find((c) => c !== eyebrowEl && c.textContent.trim().length >= 60);
  const smallEl = textCells.find((c) => c !== eyebrowEl && c !== ledeEl);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (eyebrowEl) {
    const ey = document.createElement('span');
    ey.className = 'eyebrow';
    ey.textContent = eyebrowEl.textContent.trim();
    wrap.append(ey);
  }

  if (h1) {
    const inner = h1.querySelector('h1, h2, h3, h4, h5, h6') || h1;
    const heading = document.createElement('h1');
    [...inner.childNodes].forEach((n) => heading.append(n.cloneNode(true)));
    wrap.append(heading);
  }

  if (ledeEl) {
    const lede = document.createElement('p');
    lede.className = 'lede';
    lede.textContent = ledeEl.textContent.trim();
    wrap.append(lede);
  }

  if (routeLines.length) {
    const label = document.createElement('div');
    label.className = 'router-label';
    label.textContent = 'Start with your team';
    wrap.append(label);

    const router = document.createElement('div');
    router.id = 'router';
    router.className = 'router';
    routeLines.forEach((l) => router.append(buildRoute(l)));
    wrap.append(router);
  }

  const foot = document.createElement('div');
  foot.className = 'hero-foot';
  if (ctaCell) {
    // CTAs in their OWN wrapper so decorateButton's sibling check passes
    // (a text node like the .small note as a sibling would block decoration).
    const actions = document.createElement('p');
    actions.className = 'actions';
    const cta = ctaCell.querySelector('p') || ctaCell;
    [...cta.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    foot.append(actions);
  }
  if (smallEl) {
    const small = document.createElement('span');
    small.className = 'small';
    small.textContent = smallEl.textContent.trim();
    foot.append(small);
  }
  if (foot.childNodes.length) wrap.append(foot);

  block.replaceChildren(wrap);
}
