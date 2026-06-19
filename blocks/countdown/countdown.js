/**
 * countdown — event rail: a title + subtitle, a 4-unit countdown timer, and a
 * register CTA. The timer values are static (authored) — no live ticking JS,
 * to keep the rail a faithful, deterministic lift of the prototype.
 *
 * Authoring (flat cell, by line):
 *   1. Title line                         -> .cd-label
 *   2. Subtitle line (date/time detail)   -> .cd-label small
 *   3. Timer line: "04 Days · 23 Hours · 38 Min · 45 Sec"
 *   4. CTA paragraph: <strong><a>Register…</a></strong>
 */

function lines(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  return cells;
}

export default async function decorate(block) {
  const cells = lines(block);
  // classify
  const ctaCell = cells.find((c) => c.querySelector('a'));
  const textCells = cells.filter((c) => c !== ctaCell);
  // the timer line is the dot-delimited line whose EVERY segment starts with a
  // number ("04 Days · 23 Hours · …") — distinct from a date subtitle that also
  // uses dots ("Join us live · June 24 · 2:15 PM ET").
  const isTimer = (c) => {
    const segs = c.textContent.split('·').map((s) => s.trim()).filter(Boolean);
    return segs.length >= 2 && segs.every((s) => /^\d/.test(s));
  };
  const timerCell = textCells.find(isTimer);
  const labelCells = textCells.filter((c) => c !== timerCell);

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const label = document.createElement('div');
  label.className = 'cd-label';
  if (labelCells[0]) label.append(document.createTextNode(labelCells[0].textContent.trim()));
  if (labelCells[1]) {
    const small = document.createElement('small');
    small.textContent = labelCells[1].textContent.trim();
    label.append(small);
  }
  wrap.append(label);

  if (timerCell) {
    const timer = document.createElement('div');
    timer.className = 'cd-timer';
    timerCell.textContent.split('·').forEach((seg) => {
      const parts = seg.trim().split(/\s+/);
      if (parts.length < 2) return;
      const unit = document.createElement('div');
      unit.className = 'cd-unit';
      const b = document.createElement('b');
      b.textContent = parts[0];
      const span = document.createElement('span');
      span.textContent = parts.slice(1).join(' ');
      unit.append(b, span);
      timer.append(unit);
    });
    wrap.append(timer);
  }

  if (ctaCell && ctaCell.querySelector('a')) {
    const actions = document.createElement('div');
    actions.className = 'cd-actions';
    [...ctaCell.childNodes].forEach((n) => actions.append(n.cloneNode(true)));
    wrap.append(actions);
  }

  block.replaceChildren(wrap);
}
