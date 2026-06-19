/**
 * score — dark scoreboard band: eyebrow, h2, 4 stat cells, a note.
 *
 * Authoring:
 *   - eyebrow line
 *   - heading line (-> <h2>)
 *   - 4 stat rows, each "Number · Key · Value" delimited
 *   - trailing note line
 */

function collectLines(block) {
  const out = [];
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const h = cell.querySelector('h1, h2, h3, h4, h5, h6');
    if (h) { out.push({ type: 'h', text: h.textContent.trim() }); return; }
    const t = cell.textContent.trim();
    if (t) out.push({ type: 'p', text: t });
  });
  return out;
}

export default async function decorate(block) {
  const lines = collectLines(block);
  if (!lines.length) return;

  const heading = lines.find((l) => l.type === 'h');
  const statLines = lines.filter((l) => l.text.includes('·'));
  const plain = lines.filter((l) => l !== heading && !l.text.includes('·'));
  const eyebrow = plain[0];
  const note = plain[plain.length - 1] !== eyebrow ? plain[plain.length - 1] : null;

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  if (eyebrow) {
    const ey = document.createElement('span');
    ey.className = 'eyebrow';
    ey.textContent = eyebrow.text;
    wrap.append(ey);
  }

  if (heading) {
    const h2 = document.createElement('h2');
    h2.textContent = heading.text;
    wrap.append(h2);
  }

  const board = document.createElement('div');
  board.className = 'board';
  statLines.forEach((l) => {
    const parts = l.text.split('·').map((s) => s.trim());
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.innerHTML = `<div class="n">${parts[0] || ''}</div>`
      + `<div class="k">${parts[1] || ''}</div>`
      + `<div class="v">${parts[2] || ''}</div>`;
    board.append(cell);
  });
  wrap.append(board);

  if (note) {
    const p = document.createElement('p');
    p.className = 'score-note';
    p.textContent = note.text;
    wrap.append(p);
  }

  block.replaceChildren(wrap);
}
