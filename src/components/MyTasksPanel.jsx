import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardList, Circle, Hourglass, X } from "lucide-react";
import apiClient from "../api/client";
import FileAttach from "./FileAttach";
import ProgressBar from "./ProgressBar";
import TaskItemCard from "./TaskItemCard";
import { useToast } from "../context/ToastContext";

function CompleteModal({ task, onClose, onDone }) {
  const { notify } = useToast();
  const [remarks, setRemarks] = useState("");
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [warn, setWarn] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!remarks.trim()) return setError("Please add remarks describing what you accomplished.");
    // Adviser asked for proof files: block with a pop-up warning.
    if (task.requires_files && files.length === 0) {
      setWarn(true);
      return;
    }
    setSaving(true);
    try {
      await apiClient.post(`/tasks/${task.id}/complete`, {
        remarks,
        proof_file_ids: files.map((f) => f.id),
      });
      notify(`Task ${task.number} marked as done. Your Adviser has been notified.`);
      onDone();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not mark this task as done.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-navy-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy-950">Complete Task {task.number}</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-4 w-4 text-navy-900/40" />
          </button>
        </div>
        <p className="mt-2 whitespace-pre-wrap rounded-xl bg-navy-900/[0.04] p-3 text-sm text-navy-900/80">
          {task.content}
        </p>

        {task.requires_files && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            Your Adviser needs file(s) as proof for this task. Attach them below before submitting.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="remarks" className="field-label">
              Remarks
            </label>
            <textarea
              id="remarks"
              rows={3}
              className="field-input"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="What did you do to finish this task?"
            />
          </div>
          <div>
            <p className="field-label">
              Proof files {task.requires_files ? <span className="text-red-600">(required)</span> : "(optional)"}
            </p>
            <FileAttach files={files} onChange={setFiles} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving} className="btn-gold w-full">
            {saving ? "Submitting..." : "Mark as Done"}
          </button>
        </form>
      </div>

      {warn && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-navy-950/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-soft">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-navy-950">File required</h3>
            <p className="mt-2 text-sm text-navy-900/70">
              Your Adviser needs file(s) as proof for this task. Please attach at least one file before marking it
              as done.
            </p>
            <button onClick={() => setWarn(false)} className="btn-primary mt-5 w-full">
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/** Task checklist for a PSG member (any role, incl. PIO). */
export default function MyTasksPanel() {
  const { notify } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(null);

  const load = useCallback(() => {
    apiClient
      .get("/tasks")
      .then(({ data }) => setTasks(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  async function handleToggle(task) {
    if (!task.is_completed) {
      setCompleting(task);
      return;
    }
    if (!window.confirm("Mark this task as not done? Your remarks and proof files will be removed.")) return;
    try {
      await apiClient.post(`/tasks/${task.id}/reopen`);
      load();
    } catch (err) {
      notify(err.response?.data?.detail || "Could not update the task.");
    }
  }

  const total = tasks.length;
  const done = tasks.filter((t) => t.is_completed).length;
  const percent = total ? Math.round((done / total) * 100) : 0;

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { icon: ClipboardList, label: "Tasks assigned", value: total },
          { icon: CheckCircle2, label: "Done", value: done },
          { icon: Hourglass, label: "Pending", value: total - done },
        ].map((s) => (
          <div key={s.label} className="card flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
              <s.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-navy-900/50">{s.label}</p>
              <p className="font-display text-2xl font-semibold text-navy-950">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-8">
        <p className="mb-3 text-sm font-semibold text-navy-950">Your progress</p>
        <ProgressBar percent={percent} segments={total} size="lg" />
      </div>

      {loading ? (
        <p className="text-sm text-navy-900/50">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <div className="card py-12 text-center text-sm text-navy-900/50">
          No tasks yet. When your Adviser gives you a task, you&apos;ll be notified and it will show up here.
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((t) => (
            <TaskItemCard
              key={t.id}
              task={t}
              leading={
                <button
                  onClick={() => handleToggle(t)}
                  className="mt-0.5 shrink-0"
                  aria-label={t.is_completed ? "Mark as not done" : "Mark as done"}
                  title={t.is_completed ? "Mark as not done" : "Mark as done"}
                >
                  {t.is_completed ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                  ) : (
                    <Circle className="h-6 w-6 text-navy-900/30 hover:text-gold-500" />
                  )}
                </button>
              }
            />
          ))}
        </div>
      )}

      {completing && (
        <CompleteModal
          task={completing}
          onClose={() => setCompleting(null)}
          onDone={() => {
            setCompleting(null);
            load();
          }}
        />
      )}
    </>
  );
}
