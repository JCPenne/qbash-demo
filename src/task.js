// Pure task logic for the demo copy of QBash's Edit task page: no DOM, so it's easy to test.

export const STORAGE_KEY = "qbash-demo-task";

export const SEED = {
  id: "t1",
  name: "Weekly report",
  description: "Posts a summary of last week's runs to #team every Monday.",
  trigger: "Schedule · Mondays 9:00",
  updatedAt: 0,
};

export function loadTask(storage) {
  try {
    const t = JSON.parse(storage.getItem(STORAGE_KEY) || "null");
    return t && t.id ? t : { ...SEED };
  } catch {
    return { ...SEED };
  }
}

export function saveTask(storage, task) {
  storage.setItem(STORAGE_KEY, JSON.stringify(task));
}

export function isDirty(saved, draft) {
  return saved.name !== draft.name || saved.description !== draft.description;
}

export function updateTask(task, patch, now = Date.now()) {
  return { ...task, ...patch, updatedAt: now };
}
