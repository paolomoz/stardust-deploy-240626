/**
 * trust — logo band on arctic ground
 *
 * Authoring rows:
 *   1. label (e.g. "Trusted by global leaders")
 *   2. logo names — one delimited line ("Honeywell · Yelp · CAA · ...") or one per row
 */

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const texts = cells.map((c) => c.textContent.trim()).filter(Boolean);
  if (!texts.length) return;

  const label = texts[0] || '';
  let names = texts.slice(1);
  if (names.length === 1 && /[·•|,]/.test(names[0])) {
    names = names[0].split(/\s*[·•|,]\s*/).filter(Boolean);
  }

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const lbl = document.createElement('span');
  lbl.className = 'label';
  lbl.textContent = label;
  wrap.append(lbl);

  const logos = document.createElement('div');
  logos.className = 'logos';
  names.forEach((n) => {
    const s = document.createElement('span');
    s.textContent = n;
    logos.append(s);
  });
  wrap.append(logos);

  block.replaceChildren(wrap);
}
