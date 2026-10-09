import { useState } from "react";
import { KeyRound, Moon, Pencil, Sun } from "lucide-react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useTheme } from "../../context/ThemeContext";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const { notify } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editingName, setEditingName] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState("");

  const isSuperAdmin = user?.account_type === "super_admin";

  // Prompt#1 3.1/3.2: "Can edit Full Name — Role and Email are fixed
  // (non-editable for now)."
  async function handleSaveName(e) {
    e.preventDefault();
    setNameError("");
    if (!fullName.trim()) {
      setNameError("Full name can't be empty.");
      return;
    }
    setSavingName(true);
    try {
      await apiClient.patch("/auth/me", { full_name: fullName.trim() });
      refreshUser?.({ full_name: fullName.trim() });
      setEditingName(false);
      notify("Full name updated.");
    } catch (err) {
      setNameError(err.response?.data?.detail || "Could not update your name.");
    } finally {
      setSavingName(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post("/auth/reset-password", {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-semibold text-navy-950">Settings</h1>
      <p className="mt-1 text-sm text-navy-900/60">Manage your account details.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-display text-lg font-semibold text-navy-950">Profile</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3 border-b border-navy-900/5 pb-3">
              <dt className="shrink-0 text-navy-900/50">Full Name</dt>
              {editingName ? (
                <form onSubmit={handleSaveName} className="flex flex-1 items-center gap-2">
                  <input
                    autoFocus
                    className="field-input !py-1.5 text-sm"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  <button type="submit" disabled={savingName} className="btn-primary !px-3 !py-1.5 text-xs">
                    {savingName ? "..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingName(false);
                      setFullName(user?.full_name || "");
                      setNameError("");
                    }}
                    className="text-xs text-navy-900/50 hover:text-navy-900"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <dd className="flex items-center gap-2 font-medium text-navy-900">
                  {user?.full_name}
                  <button
                    onClick={() => setEditingName(true)}
                    aria-label="Edit full name"
                    className="text-navy-900/40 hover:text-navy-900"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </dd>
              )}
            </div>
            {nameError && <p className="text-xs text-red-600">{nameError}</p>}
            <div className="flex justify-between border-b border-navy-900/5 pb-3">
              <dt className="text-navy-900/50">Email</dt>
              <dd className="font-medium text-navy-900">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-navy-900/50">Role</dt>
              <dd className="font-medium capitalize text-navy-900">
                {user?.account_type?.replace("_", " ")}
              </dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-navy-900/40">Role and Email are fixed for now.</p>
        </div>

        <div className="card">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
            {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-navy-950">Appearance</h2>
          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-navy-900">Dark mode</p>
              <p className="text-xs text-navy-900/50">Easier on the eyes in low light. Saved on this device.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={theme === "dark"}
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                theme === "dark" ? "bg-gold-500" : "bg-navy-900/25"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  theme === "dark" ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {!isSuperAdmin && (
          <div className="card">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <h2 className="mt-4 font-display text-lg font-semibold text-navy-950">
              Change Password
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="settings-new-password" className="field-label">
                  New Password
                </label>
                <input
                  id="settings-new-password"
                  type="password"
                  required
                  minLength={8}
                  className="field-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="settings-confirm-password" className="field-label">
                  Confirm Password
                </label>
                <input
                  id="settings-confirm-password"
                  type="password"
                  required
                  minLength={8}
                  className="field-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {message && <p className="text-sm text-green-600">{message}</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? "Saving..." : "Update Password"}
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
