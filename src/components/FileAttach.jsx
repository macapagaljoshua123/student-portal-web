import { useRef, useState } from "react";
import { Paperclip, X, Loader2, Download } from "lucide-react";
import apiClient from "../api/client";

export function formatSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export async function downloadFile(file) {
  const res = await apiClient.get(`/files/${file.id}/download`, { responseType: "blob" });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.original_name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Read-only file chip; click to download. */
export function FileChip({ file }) {
  return (
    <button
      type="button"
      onClick={() => downloadFile(file).catch(() => {})}
      className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-2.5 py-1.5 text-xs text-navy-900 hover:border-gold-500/60"
      title={`Download ${file.original_name}`}
    >
      <Paperclip className="h-3.5 w-3.5 shrink-0 text-navy-900/50" />
      <span className="truncate">{file.original_name}</span>
      <span className="shrink-0 text-navy-900/40">{formatSize(file.size)}</span>
      <Download className="h-3 w-3 shrink-0 text-navy-900/40" />
    </button>
  );
}

/**
 * Multi-file picker. Any file type is accepted. Files upload immediately and
 * the parent receives the list of uploaded file records (ids are what the
 * task endpoints expect).
 */
export default function FileAttach({ files, onChange, disabled = false, hint }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handlePick(e) {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (!picked.length) return;
    setError("");
    setUploading(true);
    const uploaded = [];
    for (const f of picked) {
      try {
        const form = new FormData();
        form.append("file", f);
        const { data } = await apiClient.post("/files", form);
        uploaded.push({ ...data, pending: true });
      } catch (err) {
        setError(err.response?.data?.detail || `Could not upload ${f.name}.`);
      }
    }
    setUploading(false);
    if (uploaded.length) onChange([...files, ...uploaded]);
  }

  function remove(file) {
    if (file.pending) apiClient.delete(`/files/${file.id}`).catch(() => {});
    onChange(files.filter((f) => f.id !== file.id));
  }

  return (
    <div>
      <input ref={inputRef} type="file" multiple hidden onChange={handlePick} />
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-xl border border-dashed border-navy-900/25 px-3.5 py-2 text-xs font-semibold text-navy-900/70 transition hover:border-gold-500 hover:text-navy-900 disabled:opacity-50"
      >
        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Paperclip className="h-3.5 w-3.5" />}
        {uploading ? "Uploading..." : "Attach files"}
      </button>
      {hint && <p className="mt-1 text-xs text-navy-900/40">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {files.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-navy-900/10 bg-navy-900/[0.03] px-2.5 py-1.5 text-xs text-navy-900"
            >
              <Paperclip className="h-3.5 w-3.5 shrink-0 text-navy-900/50" />
              <span className="truncate">{f.original_name}</span>
              <span className="shrink-0 text-navy-900/40">{formatSize(f.size)}</span>
              <button type="button" onClick={() => remove(f)} aria-label={`Remove ${f.original_name}`}>
                <X className="h-3.5 w-3.5 text-navy-900/40 hover:text-red-600" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
