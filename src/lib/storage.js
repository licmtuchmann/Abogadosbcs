// Tiny localStorage wrapper for case notebooks and user preferences.
// All data stays on-device.

const PREFIX = 'bpx:';

export function get(key, fallback = null) {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v == null ? fallback : JSON.parse(v);
  } catch { return fallback; }
}

export function set(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch {}
}

export function del(key) {
  try { localStorage.removeItem(PREFIX + key); } catch {}
}

const NOTEBOOKS_KEY = 'notebooks:v1';

export function loadNotebooks() {
  return get(NOTEBOOKS_KEY, [
    { id: 'default', name: 'Cuaderno general', notes: [] },
  ]);
}

export function saveNotebooks(notebooks) {
  set(NOTEBOOKS_KEY, notebooks);
}

export function addNote(notebookId, note) {
  const all = loadNotebooks();
  const nb = all.find(n => n.id === notebookId);
  if (!nb) return;
  nb.notes.push({
    id: `n_${Date.now()}_${Math.floor(Math.random() * 1e4)}`,
    created_at: new Date().toISOString(),
    ...note,
  });
  saveNotebooks(all);
}

export function removeNote(notebookId, noteId) {
  const all = loadNotebooks();
  const nb = all.find(n => n.id === notebookId);
  if (!nb) return;
  nb.notes = nb.notes.filter(n => n.id !== noteId);
  saveNotebooks(all);
}
