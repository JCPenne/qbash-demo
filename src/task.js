// Pure task logic for the demo copy of QBash's task pages: no DOM, so it's easy to test.

export const STORAGE_KEY = "qbash-demo-task";

export const SCRIPT = `"""Weekly report: posts a summary of last week's task runs to #team every Monday."""


def run():
    runs = qbash.integrations.postgres.execute_query(
        query="SELECT name, status FROM runs WHERE started_at > now() - interval '7 days'",
        output_format="json_rows",
    )["result"]
    failed = [r for r in runs if r["status"] == "failed"]
    summary = qbash.ai.run_prompt("weekly-summary", {"runs": runs, "failed": failed})
    qbash.integrations.slack.create_message(channel="#team", markdown_text=summary)
    return {"runs": len(runs), "failed": len(failed)}


qbash.output(run())
`;

export const SEED = {
  id: "weekly-report",
  name: "Weekly report",
  description: "Posts a summary of last week's task runs to #team every Monday.",
  script: SCRIPT,
  version: 3,
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
  return saved.script !== draft.script;
}

export function updateTask(task, patch, now = Date.now()) {
  return { ...task, ...patch, updatedAt: now };
}

// Typing changes only the draft; `saved` stays what was last saved, so the task reads as dirty.
export function applyEdit(saved, draft, script) {
  return { saved, draft: updateTask(draft, { script }) };
}
