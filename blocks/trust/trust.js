/**
 * trust — "Trusted by..." caption + a row of company wordmarks.
 *
 * Authoring:
 *   - caption line (the "Trusted by..." text)
 *   - one delimited line of logo names ("Mdistral · Axiom · Northwind · ...")
 *     OR several rows each a single logo name.
 */

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    if (cell.textContent.trim()) out.push(cell.textContent.trim());
  });
  return out;
}

export default async function decorate(block) {
  const lines = collectNodes(block);
  if (!lines.length) return;

  const caption = lines[0];
  let names = [];
  if (lines.length === 2 && lines[1].includes('·')) {
    names = lines[1].split('·').map((s) => s.trim()).filter(Boolean);
  } else {
    names = lines.slice(1).flatMap((l) => (l.includes('·')
      ? l.split('·').map((s) => s.trim()) : [l])).filter(Boolean);
  }

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const p = document.createElement('p');
  p.textContent = caption;
  wrap.append(p);

  const logos = document.createElement('div');
  logos.className = 'logos';
  names.forEach((n) => {
    const span = document.createElement('span');
    span.textContent = n;
    logos.append(span);
  });
  wrap.append(logos);

  block.replaceChildren(wrap);
}
