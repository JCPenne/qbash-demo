import { test } from "node:test";
import assert from "node:assert/strict";
import { loadNotes, saveNotes, isDirty, updateNote, titleOf, SEED } from "../src/notes.js";

function memoryStorage() {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)) };
}

test("loads the seed notes when storage is empty", () => {
  assert.equal(loadNotes(memoryStorage()).length, SEED.length);
});

test("saved notes load back", () => {
  const s = memoryStorage();
  saveNotes(s, [{ id: "a", title: "A", body: "hello", updatedAt: 1 }]);
  assert.equal(loadNotes(s)[0].body, "hello");
});

test("a draft that differs from the note is dirty", () => {
  assert.equal(isDirty({ body: "a" }, "b"), true);
  assert.equal(isDirty({ body: "a" }, "a"), false);
});

test("updateNote changes only that note", () => {
  const notes = updateNote(SEED, "n2", "Beans", 5);
  assert.equal(notes[1].body, "Beans");
  assert.equal(notes[1].updatedAt, 5);
  assert.equal(notes[0].body, SEED[0].body);
});

test("titleOf uses the first non-empty line", () => {
  assert.equal(titleOf("\n  Hello\nworld"), "Hello");
  assert.equal(titleOf(""), "Untitled");
});
