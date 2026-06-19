/**
 * hire — "Hire in 24 hours" video section.
 *
 * Two columns on the light mint ground: copy left, the SIGNATURE second video
 * right (muted autoplay loop, playsinline) with a poster still + reduced-motion
 * fallback — same pattern as the hero. Reduced motion → poster shown, video
 * hidden (handled in CSS). The poster + mp4 are FIXED block assets, root-
 * relative under /img (#67).
 *
 * Authoring (one cell, flat siblings — DA-flattened contract, #62):
 *   kicker — short link-free <p> (the eyebrow line)
 *   <h2>   — the headline (use <em>/<span class="em"> for the mint accent)
 *   lede   — sentence-length link-free <p>
 *   CTAs   — link-bearing <p>. hire uses DARK-fill CTAs on this light section:
 *            primary   → <em><strong><a>  (.btn.btn-accent, dark teal fill)
 *            secondary → <em><a>           (.btn.btn-secondary, dark outline)
 *
 * Authoring row shape:
 *   | hire |
 *   | Hire in 24 hours |
 *   | ## Hire anywhere, <em>in as little as a day.</em> |
 *   | Onboard global employees instantly, with no entities to set up... |
 *   | <em><strong>[Get started](#)</strong></em> <em>[See how Pebl compares](#)</em> |
 */

const BASE = '/img/velocity-global-refined';

function collectNodes(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const kids = [...cell.children];
    if (kids.length) out.push(...kids);
    else if (cell.textContent.trim()) {
      const p = document.createElement('p');
      p.innerHTML = cell.innerHTML;
      out.push(p);
    }
  });
  return out.length ? out : [...block.children];
}

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const heading = nodes.find((n) => n.matches?.('h2, h3'));
  const paras = nodes.filter((n) => n.matches?.('p'));
  const ctaP = paras.find((p) => p.querySelector('a'));
  const textPs = paras.filter((p) => p !== ctaP && !p.querySelector('a'));
  const kicker = textPs[0];
  const lede = textPs[1];

  // --- copy column ---
  const copy = document.createElement('div');
  copy.className = 'hire-copy';

  if (kicker) {
    const k = document.createElement('span');
    k.className = 'kicker';
    k.textContent = kicker.textContent.trim();
    copy.append(k);
  }

  if (heading) {
    const h2 = document.createElement('h2');
    const inner = heading.matches('h2, h3') ? heading : heading.querySelector('h2, h3') || heading;
    [...inner.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    copy.append(h2);
  }

  if (lede) {
    const p = document.createElement('p');
    [...lede.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    copy.append(p);
  }

  if (ctaP && ctaP.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'hire-cta';
    [...ctaP.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    copy.append(actions);
  }

  // --- media column (poster + video) — built, not authored ---
  // This video is below the fold and 5.4MB; it must NOT download on first paint.
  // The poster (webp + jpg) shows immediately; the <video> is preload=none with
  // no <source> attached, and is only loaded + played when the section nears the
  // viewport (IntersectionObserver, rootMargin 200px).
  const media = document.createElement('figure');
  media.className = 'hire-media';
  media.setAttribute('aria-hidden', 'true');
  media.innerHTML = `
    <picture>
      <source type="image/webp" srcset="${BASE}/pebl-og-img.webp">
      <img class="poster" src="${BASE}/pebl-og-img.jpg" alt="" aria-hidden="true"
           loading="lazy" decoding="async" width="1100" height="619">
    </picture>
    <video id="hire-video" muted loop playsinline preload="none"
           poster="${BASE}/pebl-og-img.jpg">
    </video>`;

  const startHireVideo = () => {
    const video = media.querySelector('#hire-video');
    if (!video || video.dataset.loaded) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    video.dataset.loaded = 'true';
    const src = document.createElement('source');
    src.src = `${BASE}/hire-anywhere.mp4`;
    src.type = 'video/mp4';
    video.append(src);
    video.load();
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          startHireVideo();
          obs.disconnect();
        }
      });
    }, { rootMargin: '200px' });
    io.observe(media);
  } else {
    startHireVideo();
  }

  const wrap = document.createElement('div');
  wrap.className = 'wrap';
  wrap.append(copy, media);

  block.replaceChildren(wrap);
}
