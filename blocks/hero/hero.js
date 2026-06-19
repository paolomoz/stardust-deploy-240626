/**
 * hero — editorial masthead (page lead)
 *
 * Authoring rows (each its own single-cell row):
 *   1. masthead labels — delimited line ("AI-Powered Employer of Record | 185+ Countries | ...")
 *   2. headline — becomes the page <h1>
 *   3. lede paragraph
 *   4. CTA links — <strong><a> primary, <em><a> secondary
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
  if (!nodes.length) return;

  const heading = nodes.find((n) => n.matches('h1, h2, h3') || n.querySelector('h1, h2, h3'));
  const paras = nodes.filter((n) => n.matches('p') && !n.querySelector('a'));
  const ctaNodes = nodes.filter((n) => n.matches('a') || n.querySelector('a'));

  const mastheadP = paras.find((p) => /[|·•]/.test(p.textContent)) || paras[0];
  const lede = paras.find((p) => p !== mastheadP) || null;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (mastheadP) {
    const mt = document.createElement('div');
    mt.className = 'masthead-top';
    mastheadP.textContent.split(/\s*[|·•]\s*/).filter(Boolean).forEach((t) => {
      const s = document.createElement('span');
      s.textContent = t.trim();
      mt.append(s);
    });
    wrap.append(mt);
  }

  if (heading) {
    const inner = heading.matches('h1, h2, h3') ? heading : heading.querySelector('h1, h2, h3');
    const h1 = document.createElement('h1');
    [...inner.childNodes].forEach((c) => h1.append(c.cloneNode(true)));
    wrap.append(h1);
  }

  const foot = document.createElement('div');
  foot.className = 'hero-foot';
  if (lede) {
    const p = document.createElement('p');
    [...lede.childNodes].forEach((c) => p.append(c.cloneNode(true)));
    foot.append(p);
  }
  if (ctaNodes.length) {
    const cta = document.createElement('div');
    cta.className = 'hero-cta';
    ctaNodes.forEach((n) => cta.append(n.cloneNode(true)));
    foot.append(cta);
  }
  wrap.append(foot);

  block.replaceChildren(wrap);
}
