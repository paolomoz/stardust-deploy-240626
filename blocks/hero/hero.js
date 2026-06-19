/**
 * hero — full-bleed cinematic video hero (Pebl Variant D signature).
 *
 * One full-screen background <video> (muted autoplay loop, playsinline) with a
 * poster still + legibility scrim; copy reads bottom-left over the film.
 * Reduced-motion → video hidden, poster still shown (built in CSS).
 *
 * Authoring (one cell, flat siblings — DA-flattened contract, #62):
 *   eyebrow  — short link-free <p> (the uppercase line)
 *   <h1>     — the page's single headline (use <em>/<span class="em"> for accent)
 *   lede     — sentence-length link-free <p>
 *   CTAs     — link-bearing <p>: <strong><a> primary, <em><a> secondary
 *
 * Video assets are FIXED block assets, root-relative under /img (#67).
 */

const BASE = '/img/velocity-global-refined';

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

  const heading = nodes.find((n) => n.matches?.('h1, h2'));
  const paras = nodes.filter((n) => n.matches?.('p'));
  const ledeAndCtas = paras.filter((p) => p !== heading);
  const ctaP = ledeAndCtas.find((p) => p.querySelector('a'));
  const textPs = ledeAndCtas.filter((p) => !p.querySelector('a'));
  const eyebrow = textPs[0];
  const lede = textPs[1];

  // media plane (poster + video) — built, not authored
  const media = document.createElement('div');
  media.className = 'hero-media';
  media.setAttribute('aria-hidden', 'true');
  media.innerHTML = `
    <img class="poster" src="${BASE}/hero-poster.jpg" alt="" loading="eager">
    <video id="hero-video" class="plane-a" autoplay muted loop playsinline preload="auto"
           poster="${BASE}/hero-poster.jpg">
      <source src="${BASE}/hero-mobile.mp4" type="video/mp4" media="(max-width:640px)">
      <source src="${BASE}/hero-desktop.mp4" type="video/mp4">
    </video>`;

  const copy = document.createElement('div');
  copy.className = 'hero-copy';

  if (eyebrow) {
    const eb = document.createElement('span');
    eb.className = 'hero-eyebrow';
    eb.textContent = eyebrow.textContent.trim();
    copy.append(eb);
  }

  if (heading) {
    const h1 = document.createElement('h1');
    const inner = heading.matches('h1, h2') ? heading : heading.querySelector('h1, h2') || heading;
    [...inner.childNodes].forEach((n) => h1.append(n.cloneNode(true)));
    copy.append(h1);
  }

  const foot = document.createElement('div');
  foot.className = 'hero-foot';
  if (lede) {
    const p = document.createElement('p');
    [...lede.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    foot.append(p);
  }
  if (ctaP && ctaP.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'hero-cta';
    [...ctaP.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    foot.append(actions);
  }
  copy.append(foot);

  const inner = document.createElement('div');
  inner.className = 'hero-inner';
  inner.append(copy);

  block.replaceChildren(media, inner);
}
