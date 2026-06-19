/**
 * closing — final "Ready to watch?" heading with an email capture form.
 *
 * Authoring rows:
 *   1. heading text
 *   2. capture label paragraph
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
  const heading = nodes.find((n) => n.matches('h1, h2, h3, h4, h5, h6'));
  const label = nodes.find((n) => n.matches('p'));

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.textContent.trim();
    wrap.append(h2);
  }

  const form = document.createElement('div');
  form.className = 'capture';
  if (label) {
    label.classList.add('capture-label');
    form.append(label);
  }
  const row = document.createElement('div');
  row.className = 'capture-row';
  row.innerHTML = '<input type="email" placeholder="Email address" aria-label="Email address">'
    + '<button type="button" class="btn-capture">Get Started &rsaquo;</button>';
  form.append(row);
  wrap.append(form);

  block.replaceChildren(wrap);
}
