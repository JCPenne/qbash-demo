// Pure note logic: no DOM, so it's easy to test.

export const STORAGE_KEY = "demo-notes";

export const SEED = [
  { id: "n1", title: "Launch checklist", body: "Launch checklist\nRecord the demo.\nCut the stats scene.\nShip it.", updatedAt: 0 },
  { id: "n2", title: "Groceries", body: "Groceries\nBeans\nStock\nOnions", updatedAt: 0 },
  { id: "n3", title: "Ideas", body: "Ideas\nA bot that fixes small bugs while I make lunch.", updatedAt: 0 },
];

export function loadNotes(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    const notes = raw ? JSON.parse(raw) : null;
    return Array.isArray(notes) && notes.length ? notes : SEED.map((n) => ({ ...n }));
  } catch {
    return SEED.map((n) => ({ ...n }));
  }
}

export function saveNotes(storage, notes) {
  storage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function isDirty(note, draft) {
  return Boolean(note) && note.body !== draft;
}

export function updateNote(notes, id, body, now = Date.now()) {
  return notes.map((n) => (n.id === id ? { ...n, body, updatedAt: now } : n));
}

export function titleOf(body) {
  const first = body.split("\n").find((line) => line.trim()) || "Untitled";
  return first.trim().slice(0, 40);
}
