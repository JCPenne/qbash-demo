import { test } from "node:test";
import assert from "node:assert/strict";
import { loadTask, saveTask, isDirty, updateTask, SEED } from "../src/task.js";

function memoryStorage() {
  const data = new Map();
  return { getItem: (k) => data.get(k) ?? null, setItem: (k, v) => data.set(k, String(v)) };
}

test("loads the seed task when storage is empty", () => {
  assert.equal(loadTask(memoryStorage()).name, SEED.name);
});

test("a saved task loads back", () => {
  const s = memoryStorage();
  saveTask(s, { ...SEED, description: "hello" });
  assert.equal(loadTask(s).description, "hello");
});

test("a changed description or name is dirty", () => {
  assert.equal(isDirty(SEED, { ...SEED, description: "x" }), true);
  assert.equal(isDirty(SEED, { ...SEED, name: "x" }), true);
  assert.equal(isDirty(SEED, { ...SEED }), false);
});

test("updateTask changes only the given fields", () => {
  const t = updateTask(SEED, { description: "new" }, 5);
  assert.equal(t.description, "new");
  assert.equal(t.name, SEED.name);
  assert.equal(t.updatedAt, 5);
});
