import { getConfig, getMetadata } from './ak.js';

async function loadStaticFragment(el, name) {
  if (!el) return;
  if (getMetadata(name) === 'off') return;
  const { codeBase } = getConfig();
  const resp = await fetch(`${codeBase}/fragments/${name}.html`);
  if (!resp.ok) return;
  const html = await resp.text();
  el.className = name;          // so header.header / footer.footer match
  el.innerHTML = html;
}

export default async function loadPostLCP() {
  const header = document.querySelector('header');
  const footer = document.querySelector('footer');
  await Promise.all([
    loadStaticFragment(header, 'header'),
    loadStaticFragment(footer, 'footer'),
  ]);
}
