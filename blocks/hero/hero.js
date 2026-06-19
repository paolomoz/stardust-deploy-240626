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

  // media plane (poster + video) — built, not authored.
  // The poster is the LCP element: an eager <img> (webp + jpg fallback) sized to
  // the hero box, painted instantly. The video is preload=none and does NOT
  // autoplay-load; its <source>s are attached + played only after window load
  // (so it never competes with LCP). Below the hero the look is identical because
  // the poster is the video's first frame.
  const media = document.createElement('div');
  media.className = 'hero-media';
  media.setAttribute('aria-hidden', 'true');
  media.innerHTML = `
    <picture>
      <source type="image/webp" srcset="${BASE}/hero-poster.webp">
      <img class="hero-poster poster" src="${BASE}/hero-poster.jpg" alt=""
           fetchpriority="high" loading="eager" decoding="async" width="1600" height="787">
    </picture>
    <video id="hero-video" class="plane-a" muted loop playsinline preload="none"
           poster="${BASE}/hero-poster.jpg">
    </video>`;

  // Lazily build the video sources + start playback only after the page has
  // loaded, so the 1.3–3.7MB mp4 never blocks LCP. Skip entirely under
  // reduced-motion (CSS keeps the poster shown, video hidden).
  const startHeroVideo = () => {
    const video = media.querySelector('#hero-video');
    if (!video || video.dataset.loaded) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    video.dataset.loaded = 'true';
    const mobile = document.createElement('source');
    mobile.src = `${BASE}/hero-mobile.mp4`;
    mobile.type = 'video/mp4';
    mobile.media = '(max-width:640px)';
    const desktop = document.createElement('source');
    desktop.src = `${BASE}/hero-desktop.mp4`;
    desktop.type = 'video/mp4';
    video.append(mobile, desktop);
    video.load();
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  };
  if (document.readyState === 'complete') startHeroVideo();
  else window.addEventListener('load', startHeroVideo, { once: true });

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
