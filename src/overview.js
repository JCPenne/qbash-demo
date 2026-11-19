import { loadTask } from "./task.js";

const t = loadTask(localStorage);
document.getElementById("version").textContent = "V" + (t.version || 1);
document.getElementById("last-edit").textContent = t.updatedAt
  ? "Edited main.py · " + new Date(t.updatedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
  : "Edited main.py";
