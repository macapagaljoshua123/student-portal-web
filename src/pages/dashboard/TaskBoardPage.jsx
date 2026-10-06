import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Pencil, Plus, Trash2, X, FileWarning } from "lucide-react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";
import ThreeDotMenu from "../../components/ThreeDotMenu";
import FileAttach from "../../components/FileAttach";
import ProgressBar from "../../components/ProgressBar";
import TaskItemCard from "../../components/TaskItemCard";
import { PSG_ROLES } from "../../components/RoleDropdown";
import { useToast } from "../../context/ToastContext";

const ROLE_NAMES = PSG_ROLES.map((r) => r.value);
const blankItem = () => ({ key: Math.random().toString(36).slice(2), content: "", requires_files: false, files: [] });

function RoleSelect({ id, value, onChange }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="field-input">
      <option value="">Select a role</option>
      {ROLE_NAMES.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}

function CreateTaskForm({ onClose, onCreated }) {
  const { notify } = useToast();
  const [role, setRole] = useState("");
  const [items, setItems] = useState([blankItem()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function patch(key, changes) {
    setItems((prev) => prev.map((it) => (it.key === key ? { ...it, ...changes } : it)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!role) return setError("Please select the role you want to give tasks to.");
    if (items.some((it) => !it.content.trim())) return setError("Please write every task (or remove the empty ones).");

    setSubmitting(true);
    try {
      await apiClient.post("/tasks", {
        role,
        items: items.map((it) => ({
          content: it.content,
          requires_files: it.requires_files,
          attachment_ids: it.files.map((f) => f.id),
        })),
      });
      notify(`${items.length} task${items.length > 1 ? "s" : ""} sent to ${role}. They've been notified.`);
      onCreated();
    } catch (err) {
      setError(err.response?.data?.detail?.[0]?.msg || err.response?.data?.detail || "Could not submit the task(s).");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      onSubmit={handleSubmit}
      className="card mb-8 space-y-5"
    >
      <div className="flex items-start justify-between">
        <h2 className="font-display text-lg font-semibold text-navy-950">Create a Task</h2>
        <button type="button" onClick={onClose} aria-label="Close form">
          <X className="h-4 w-4 text-navy-900/40" />
        </button>
      </div>

      <div className="sm:max-w-xs">
        <label htmlFor="task-role" className="field-label">
          Select role
        </label>
        <RoleSelect id="task-role" value={role} onChange={setRole} />
      </div>

      <div className="space-y-4">
        {items.map((it, idx) => (
          <div key={it.key} className="rounded-2xl border border-navy-900/10 bg-navy-900/[0.02] p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="rounded-full bg-navy-900 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
                Task {idx + 1}
              </span>
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.filter((x) => x.key !== it.key))}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            <label htmlFor={`task-${it.key}`} className="field-label">
              Write a task
            </label>
            <textarea
              id={`task-${it.key}`}
              rows={3}
              className="field-input"
              value={it.content}
              onChange={(e) => patch(it.key, { content: e.target.value })}
              placeholder="Describe what needs to be done"
            />
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-navy-900/40">
                Attach files (optional)
              </p>
              <FileAttach
                files={it.files}
                onChange={(files) => patch(it.key, { files })}
                hint="Examples or references for this task. All file types are supported."
              />
            </div>
            <label className="mt-3 flex items-center gap-2 text-sm text-navy-900">
              <input
                type="checkbox"
                checked={it.requires_files}
                onChange={(e) => patch(it.key, { requires_files: e.target.checked })}
                className="h-4 w-4 rounded border-navy-900/30 text-gold-500 focus:ring-gold-500"
              />
              Member must attach file(s) as proof when finishing this task
            </label>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setItems((prev) => [...prev, blankItem()])}
        className="btn-outline !px-4 !py-2"
      >
        <Plus className="h-4 w-4" /> Add another task
      </button>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div>
        <button type="submit" disabled={submitting} className="btn-gold">
          {submitting ? "Submitting..." : "Submit Task"}
        </button>
      </div>
    </motion.form>
  );
}

function EditTaskModal({ task, onClose, onSaved }) {
  const { notify } = useToast();
  const [content, setContent] = useState(task.content);
  const [role, setRole] = useState(task.assigned_role);
  const [requiresFiles, setRequiresFiles] = useState(task.requires_files);
  const [files, setFiles] = useState(task.instruction_files);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!content.trim()) return setError("The task can't be empty.");
    setSaving(true);
    try {
      await apiClient.put(`/tasks/${task.id}`, {
        content,
        assigned_role: role,
        requires_files: requiresFiles,
        attachment_ids: files.map((f) => f.id),
      });
      notify("Task updated.");
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update the task.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-navy-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy-950">Edit Task</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-4 w-4 text-navy-900/40" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="edit-task-role" className="field-label">
              Role
            </label>
            <RoleSelect id="edit-task-role" value={role} onChange={setRole} />
          </div>
          <div>
            <label htmlFor="edit-task-content" className="field-label">
              Task
            </label>
            <textarea
              id="edit-task-content"
              rows={4}
              className="field-input"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div>
            <p className="field-label">Attached files</p>
            <FileAttach files={files} onChange={setFiles} />
          </div>
          <label className="flex items-center gap-2 text-sm text-navy-900">
            <input
              type="checkbox"
              checked={requiresFiles}
              onChange={(e) => setRequiresFiles(e.target.checked)}
              className="h-4 w-4 rounded border-navy-900/30 text-gold-500 focus:ring-gold-500"
            />
            Member must attach file(s) as proof
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function TaskBoardPage() {
  const { notify } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("All");

  const load = useCallback(() => {
    apiClient
      .get("/tasks")
      .then(({ data }) => setTasks(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(task) {
    if (!window.confirm(`Delete Task ${task.number} for ${task.assigned_role}? This can't be undone.`)) return;
    try {
      await apiClient.delete(`/tasks/${task.id}`);
      notify("Task deleted.");
      load();
    } catch (err) {
      notify(err.response?.data?.detail || "Could not delete the task.");
    }
  }

  const grouped = useMemo(() => {
    const map = {};
    for (const t of tasks) (map[t.assigned_role] ||= []).push(t);
    return ROLE_NAMES.filter((r) => map[r]).map((r) => ({ role: r, tasks: map[r] }));
  }, [tasks]);

  const visible = filter === "All" ? grouped : grouped.filter((g) => g.role === filter);

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">PSG Task Board</h1>
          <p className="mt-1 max-w-xl text-sm text-navy-900/60">
            Give numbered tasks to any PSG role. Members check them off with remarks, and the progress
            shows up in your Analytics.
          </p>
        </div>
        <button onClick={() => setShowCreate((v) => !v)} className="btn-primary">
          <Plus className="h-4 w-4" />
          {showCreate ? "Close" : "Create a Task"}
        </button>
      </div>

      {showCreate && (
        <CreateTaskForm
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            load();
          }}
        />
      )}

      {grouped.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {["All", ...grouped.map((g) => g.role)].map((r) => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                filter === r
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-900/15 text-navy-900/70 hover:border-navy-900/40"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-navy-900/50">Loading tasks...</p>
      ) : grouped.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 py-12 text-center text-sm text-navy-900/50">
          <ClipboardList className="h-8 w-8 text-navy-900/20" />
          No tasks yet. Use &ldquo;Create a Task&rdquo; to assign work to a PSG role.
        </div>
      ) : (
        <div className="space-y-8">
          {visible.map((g) => {
            const done = g.tasks.filter((t) => t.is_completed).length;
            const percent = Math.round((done / g.tasks.length) * 100);
            return (
              <section key={g.role}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-navy-950">{g.role}</h2>
                    <p className="text-xs text-navy-900/50">
                      {g.tasks[0].assignee_name || "No member assigned yet"} · {done}/{g.tasks.length} done
                    </p>
                  </div>
                  <div className="w-full sm:w-64">
                    <ProgressBar percent={percent} segments={g.tasks.length} />
                  </div>
                </div>
                <div className="space-y-3">
                  {g.tasks.map((t) => (
                    <TaskItemCard
                      key={t.id}
                      task={t}
                      menu={
                        <ThreeDotMenu
                          label={`Actions for Task ${t.number}`}
                          items={[
                            { label: "Edit", icon: Pencil, onClick: () => setEditing(t) },
                            { label: "Delete", icon: Trash2, danger: true, onClick: () => handleDelete(t) },
                          ]}
                        />
                      }
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {editing && (
        <EditTaskModal
          task={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </DashboardLayout>
  );
}
