/**
 * split — two-column editorial row: copy + a large glyph "frame"
 *   Reused for the G2, speed, and advantage chapters.
 *
 * Authoring rows (single cell each):
 *   1. variant keywords — any of "paper" (light ground) / "reversed" (frame on left)
 *   2. chapter number ("02")
 *   3. eyebrow
 *   4. heading -> <h2>
 *   5. body paragraph
 *   6. frame glyph / text (e.g. "★", "24h", "↗")
 */

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  if (!cells.length) return;

  const variant = (cells[0] ? cells[0].textContent : '').toLowerCase();
  if (variant.includes('paper')) block.classList.add('paper');
  if (variant.includes('rev')) block.classList.add('rev');

  const chapterNo = cells[1] ? cells[1].textContent.trim() : '';
  const eyebrow = cells[2] ? cells[2].textContent.trim() : '';
  const headingCell = cells[3];
  const bodyCell = cells[4];
  const frame = cells[5] ? cells[5].textContent.trim() : '';

  const copy = document.createElement('div');
  copy.className = 'copy';

  if (chapterNo) {
    const cn = document.createElement('span');
    cn.className = 'chapter-no';
    cn.textContent = chapterNo;
    copy.append(cn);
  }
  if (eyebrow) {
    const eb = document.createElement('p');
    eb.className = 'eyebrow';
    eb.textContent = eyebrow;
    copy.append(eb);
  }
  if (headingCell) {
    const h2 = document.createElement('h2');
    h2.textContent = headingCell.textContent.trim();
    copy.append(h2);
  }
  if (bodyCell) {
    const p = document.createElement('p');
    p.textContent = bodyCell.textContent.trim();
    copy.append(p);
  }

  const frameEl = document.createElement('div');
  frameEl.className = 'frame';
  frameEl.textContent = frame;

  const grid = document.createElement('div');
  grid.className = 'split-grid';
  if (block.classList.contains('rev')) {
    grid.append(frameEl, copy);
  } else {
    grid.append(copy, frameEl);
  }

  block.replaceChildren(grid);
}
