import { useRef, useState } from "react";
import { Camera, Pencil, Trash2 } from "lucide-react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

const ROLE_LABELS = {
  admin: "Admin",
  adviser: "Adviser",
  co_admin: "Co-Admin",
  member: "PSG Member",
};

export default function ProfileViewPage() {
  const { user, refreshUser } = useAuth();
  const { notify } = useToast();
  const fileRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleSaveName(e) {
    e.preventDefault();
    setError("");
    if (!fullName.trim()) return setError("Full name can't be empty.");
    setSaving(true);
    try {
      const { data } = await apiClient.patch("/auth/me", { full_name: fullName.trim() });
      refreshUser({ full_name: data.full_name });
      setEditing(false);
      notify("Name updated.");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update your name.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePick(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return setError("Image is too large (max 5 MB).");
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await apiClient.post("/auth/me/avatar", form);
      refreshUser({ avatar_version: data.avatar_version });
      notify("Profile picture updated.");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not upload the picture.");
    } finally {
      setUploading(false);
    }
  }

  async function handleRemovePhoto() {
    try {
      await apiClient.delete("/auth/me/avatar");
      refreshUser({ avatar_version: null });
      notify("Profile picture removed.");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not remove the picture.");
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-lg text-center">
        <div className="relative mx-auto h-28 w-28">
          <Avatar user={user} size={112} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-navy-900 text-gold-400 shadow-soft hover:bg-navy-800 disabled:opacity-60"
            aria-label="Change profile picture"
            title="Change profile picture"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePick} />
        </div>
        {uploading && <p className="mt-2 text-xs text-navy-900/50">Uploading...</p>}
        {user?.avatar_version && !uploading && (
          <button
            onClick={handleRemovePhoto}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-navy-900/50 hover:text-red-600"
          >
            <Trash2 className="h-3 w-3" /> Remove photo
          </button>
        )}

        {editing ? (
          <form onSubmit={handleSaveName} className="mx-auto mt-5 flex max-w-xs items-center gap-2">
            <input
              autoFocus
              className="field-input text-center"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <button type="submit" disabled={saving} className="btn-primary !px-4 !py-2.5">
              {saving ? "..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setFullName(user?.full_name || "");
                setError("");
              }}
              className="text-xs text-navy-900/50 hover:text-navy-900"
            >
              Cancel
            </button>
          </form>
        ) : (
          <h1 className="mt-5 flex items-center justify-center gap-2 text-2xl font-semibold text-navy-950">
            {user?.full_name}
            <button
              onClick={() => setEditing(true)}
              aria-label="Edit name"
              className="text-navy-900/40 hover:text-navy-900"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </h1>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <p className="mt-1 text-sm text-navy-900/60">
          {ROLE_LABELS[user?.account_type] || "Member"}
          {user?.org_role ? ` · ${user.org_role}` : ""}
        </p>
        <div className="mt-2 flex justify-center">
          {/* You're viewing this page, so you're online by definition. */}
          <StatusBadge online />
        </div>

        <div className="card mt-8 text-left">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-navy-900/5 pb-3">
              <dt className="text-navy-900/50">Email</dt>
              <dd className="font-medium text-navy-900">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-900/50">Role</dt>
              <dd className="font-medium text-navy-900">
                {user?.org_role || ROLE_LABELS[user?.account_type] || "—"}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-navy-900/40">Email and role are fixed for now.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
