import { loadTask, saveTask, isDirty, updateTask } from "./task.js";
import { highlight } from "./highlight.js";

const code = document.getElementById("code");
const hl = document.getElementById("hl");
const gutter = document.getElementById("gutter");
const saveBtn = document.getElementById("save");
const toast = document.getElementById("toast");

let saved = loadTask(localStorage);
let draft = { ...saved };

function paint() {
  hl.innerHTML = highlight(code.value);
  gutter.textContent = code.value.split("\n").map((_, i) => i + 1).join("\n");
  hl.scrollTop = code.scrollTop;
  gutter.scrollTop = code.scrollTop;
}

function refresh() {
  saveBtn.disabled = !isDirty(saved, draft);
}

function showToast(text) {
  document.getElementById("toast-text").textContent = text;
  toast.hidden = false;
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => (toast.hidden = true), 2500);
}

// Keep the task in sync while typing, so its edited time is current when you go back to the Overview.
code.addEventListener("input", () => {
  saved = updateTask(saved, { script: code.value });
  draft = { ...saved };
  paint();
  refresh();
});
code.addEventListener("scroll", paint);
code.addEventListener("keydown", (e) => {
  if (e.key === "Tab") { e.preventDefault(); document.execCommand("insertText", false, "    "); }
});

saveBtn.addEventListener("click", () => {
  saved = updateTask(saved, { script: draft.script, version: (saved.version || 1) + 1 });
  saveTask(localStorage, saved);
  draft = { ...saved };
  refresh();
  showToast("Saved · version " + saved.version);
});

code.value = saved.script;
paint();
refresh();
