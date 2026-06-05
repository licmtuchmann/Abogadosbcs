// Lightweight word-level diff for showing reform changes.
// Returns array of { type: 'eq'|'add'|'del', text }

export function wordDiff(oldText, newText) {
  const oldWords = tokenize(oldText);
  const newWords = tokenize(newText);
  const lcs = lcsTable(oldWords, newWords);
  const out = [];
  let i = oldWords.length, j = newWords.length;
  while (i > 0 && j > 0) {
    if (oldWords[i - 1] === newWords[j - 1]) {
      out.unshift({ type: 'eq', text: oldWords[i - 1] });
      i--; j--;
    } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
      out.unshift({ type: 'del', text: oldWords[i - 1] });
      i--;
    } else {
      out.unshift({ type: 'add', text: newWords[j - 1] });
      j--;
    }
  }
  while (i > 0) { out.unshift({ type: 'del', text: oldWords[--i] }); }
  while (j > 0) { out.unshift({ type: 'add', text: newWords[--j] }); }
  return collapse(out);
}

function tokenize(s) {
  if (!s) return [];
  // Keep whitespace as separate tokens to preserve formatting
  return s.split(/(\s+)/).filter(t => t.length);
}

function lcsTable(a, b) {
  const m = a.length, n = b.length;
  const t = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      t[i + 1][j + 1] = a[i] === b[j] ? t[i][j] + 1 : Math.max(t[i][j + 1], t[i + 1][j]);
    }
  }
  return t;
}

function collapse(tokens) {
  const out = [];
  for (const t of tokens) {
    const last = out[out.length - 1];
    if (last && last.type === t.type) last.text += t.text;
    else out.push({ ...t });
  }
  return out;
}
