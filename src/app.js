import { loadTask, saveTask, isDirty, updateTask } from "./task.js";

const nameEl = document.getElementById("name");
const descEl = document.getElementById("description");
const saveBtn = document.getElementById("save");
const status = document.getElementById("status");

let saved = loadTask(localStorage);
let draft = { ...saved };

function renderPreview(t) {
  document.getElementById("p-name").textContent = t.name || "Untitled task";
  document.getElementById("p-desc").textContent = t.description;
  document.getElementById("p-trigger").textContent = t.trigger;
}

function refresh() {
  const dirty = isDirty(saved, draft);
  saveBtn.disabled = !dirty;
  status.classList.remove("saved");
  status.textContent = dirty ? "Unsaved changes" : "No changes";
}

const fields = [[nameEl, "name"], [descEl, "description"]];
for (const [el, field] of fields) {
  el.addEventListener("input", () => {
    draft = { ...draft, [field]: el.value };
    renderPreview(draft);
    refresh();
  });
}

saveBtn.addEventListener("click", () => {
  saved = updateTask(saved, { name: draft.name, description: draft.description });
  saveTask(localStorage, saved);
  draft = { ...saved };
  refresh();
  status.textContent = "Saved ✓";
  status.classList.add("saved");
});

nameEl.value = saved.name;
descEl.value = saved.description;
document.getElementById("trigger").textContent = saved.trigger;
renderPreview(saved);
refresh();
