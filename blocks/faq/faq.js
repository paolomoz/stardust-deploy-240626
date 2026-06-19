/**
 * faq — accordion on dark teal, two-column layout.
 *
 * Left column = head group (kicker + h2 + intro). Right column = a
 * <details>/<summary> accordion list of Q/A pairs. The first item is open.
 *
 * Authoring (one cell, flat siblings — DA-flattened contract, #62):
 *   kicker — short link-free <p> (the eyebrow, e.g. "Questions")
 *   <h2>   — the FAQ heading (e.g. "FAQs")
 *   intro  — sentence-length link-free <p> (the lede under the heading)
 *   then ALTERNATING Q→A rows:
 *     question — a <p> (or <h3>) that ENDS WITH "?" → becomes <summary>
 *     answer   — the following <p>                  → becomes the details body
 *
 * Segmentation is content-based, not index-based: the head is (first kicker p,
 * first heading, the intro p that precedes the first question). A question is
 * detected as a node whose text ends with "?"; the node(s) after it up to the
 * next question form its answer.
 *
 * Authoring row shape:
 *   | faq |
 *   | Questions |
 *   | <h2>FAQs</h2> |
 *   | The questions a board asks before approving global expansion, answered. |
 *   | How does Pebl ensure compliance with local labor laws in 185+ countries? |
 *   | Our regional legal teams monitor regulatory shifts... |
 *   | How does Pebl prevent worker misclassification when hiring internationally? |
 *   | With Pebl as the legal Employer of Record... |
 *   | ...further Q→A pairs... |
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

const isQuestion = (n) => {
  const t = n?.textContent.trim() || '';
  return t.endsWith('?') || n?.matches?.('h3');
};

export default async function decorate(block) {
  const nodes = collectNodes(block);

  const heading = nodes.find((n) => n.matches?.('h2'));
  // index of the first question — everything before it (minus heading) is head copy
  const firstQ = nodes.findIndex((n) => isQuestion(n) && n !== heading);
  const headNodes = firstQ === -1 ? nodes : nodes.slice(0, firstQ);
  const qaNodes = firstQ === -1 ? [] : nodes.slice(firstQ);

  // --- head column ---
  const head = document.createElement('div');
  const headPs = headNodes.filter((n) => n.matches?.('p') && !n.querySelector?.('a'));
  const kicker = headPs[0];
  const intro = headPs[1];

  if (kicker) {
    const k = document.createElement('span');
    k.className = 'kicker';
    k.textContent = kicker.textContent.trim();
    head.append(k);
  }
  if (heading) {
    const h2 = document.createElement('h2');
    [...heading.childNodes].forEach((n) => h2.append(n.cloneNode(true)));
    head.append(h2);
  }
  if (intro) {
    const p = document.createElement('p');
    p.className = 'fl';
    [...intro.childNodes].forEach((n) => p.append(n.cloneNode(true)));
    head.append(p);
  }

  // --- accordion column ---
  const list = document.createElement('div');
  list.className = 'faq';

  let i = 0;
  let first = true;
  while (i < qaNodes.length) {
    const qNode = qaNodes[i];
    if (!isQuestion(qNode)) { i += 1; continue; }
    // answer = following nodes up to the next question
    const answers = [];
    let j = i + 1;
    while (j < qaNodes.length && !isQuestion(qaNodes[j])) {
      answers.push(qaNodes[j]);
      j += 1;
    }

    const details = document.createElement('details');
    if (first) { details.open = true; first = false; }

    const summary = document.createElement('summary');
    [...qNode.childNodes].forEach((n) => summary.append(n.cloneNode(true)));
    const ic = document.createElement('span');
    ic.className = 'ic';
    ic.setAttribute('aria-hidden', 'true');
    ic.textContent = '+';
    summary.append(ic);
    details.append(summary);

    answers.forEach((a) => {
      const p = document.createElement('p');
      [...a.childNodes].forEach((n) => p.append(n.cloneNode(true)));
      details.append(p);
    });

    list.append(details);
    i = j;
  }

  const wrap = document.createElement('div');
  wrap.className = 'wrap faq-grid';
  wrap.append(head, list);

  block.replaceChildren(wrap);
}
