import { CheckCircle2, Circle, FileWarning } from "lucide-react";
import { FileChip } from "./FileAttach";

/**
 * One numbered task. Shared by the Adviser's Task Board / Analytics and the
 * PSG member's My Tasks. `leading` (e.g. a checkbox) and `menu` (3-dot) are slots.
 */
export default function TaskItemCard({ task, leading, menu, showRole = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 transition ${
        task.is_completed ? "border-emerald-500/30 bg-emerald-50/50" : "border-navy-900/10 bg-white"
      }`}
    >
      <div className="flex items-start gap-3">
        {leading ?? (
          <span className="mt-0.5 shrink-0">
            {task.is_completed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <Circle className="h-5 w-5 text-navy-900/25" />
            )}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-navy-900 px-2.5 py-0.5 text-xs font-semibold text-gold-400">
              Task {task.number}
            </span>
            {showRole && (
              <span className="rounded-full bg-navy-900/5 px-2.5 py-0.5 text-xs font-medium text-navy-900">
                {task.assigned_role}
              </span>
            )}
            {task.requires_files && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
                <FileWarning className="h-3 w-3" /> Files required
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                task.is_completed ? "bg-emerald-100 text-emerald-800" : "bg-navy-900/5 text-navy-900/60"
              }`}
            >
              {task.is_completed ? "Completed" : "Pending"}
            </span>
          </div>

          <p className="mt-2 whitespace-pre-wrap text-sm text-navy-900">{task.content}</p>

          {task.instruction_files.length > 0 && (
            <div className="mt-3">
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-navy-900/40">
                From Adviser
              </p>
              <div className="flex flex-wrap gap-2">
                {task.instruction_files.map((f) => (
                  <FileChip key={f.id} file={f} />
                ))}
              </div>
            </div>
          )}

          {task.is_completed && (
            <div className="mt-3 rounded-xl border border-emerald-500/20 bg-white p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Accomplishment
                {task.completed_at && (
                  <span className="ml-2 font-normal normal-case text-navy-900/40">
                    {new Date(task.completed_at).toLocaleString()}
                    {task.completed_by_name ? ` · ${task.completed_by_name}` : ""}
                  </span>
                )}
              </p>
              <p className="mt-1.5 whitespace-pre-wrap text-sm text-navy-900/80">
                <span className="font-medium text-navy-900">Remarks: </span>
                {task.remarks}
              </p>
              {task.proof_files.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {task.proof_files.map((f) => (
                    <FileChip key={f.id} file={f} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {menu}
      </div>
    </div>
  );
}
