import { loadNotes, saveNotes, isDirty, updateNote, titleOf } from "./notes.js";

const list = document.getElementById("list");
const editor = document.getElementById("body");
const saveBtn = document.getElementById("save");
const status = document.getElementById("status");

let notes = loadNotes(localStorage);
let currentId = notes[0].id;

const current = () => notes.find((n) => n.id === currentId);

function renderList() {
  list.innerHTML = "";
  for (const n of notes) {
    const li = document.createElement("li");
    li.className = n.id === currentId ? "active" : "";
    li.dataset.id = n.id;
    const t = document.createElement("div");
    t.className = "t";
    t.textContent = titleOf(n.body);
    const p = document.createElement("div");
    p.className = "p";
    p.textContent = n.body.split("\n").slice(1).join(" ") || " ";
    li.append(t, p);
    li.addEventListener("click", () => open(n.id));
    list.append(li);
  }
}

function refreshSave() {
  const dirty = isDirty(current(), editor.value);
  saveBtn.disabled = !dirty;
  status.textContent = dirty ? "Unsaved changes" : "Saved";
}

function open(id) {
  currentId = id;
  editor.value = current().body;
  renderList();
  refreshSave();
}

editor.addEventListener("input", refreshSave);

saveBtn.addEventListener("click", () => {
  notes = updateNote(notes, currentId, editor.value);
  saveNotes(localStorage, notes);
  renderList();
  refreshSave();
});

open(currentId);
