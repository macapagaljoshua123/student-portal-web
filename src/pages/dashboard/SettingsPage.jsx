import { useState } from "react";
import { KeyRound } from "lucide-react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isSuperAdmin = user?.account_type === "super_admin";

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
            <div className="flex justify-between border-b border-navy-900/5 pb-3">
              <dt className="text-navy-900/50">Full Name</dt>
              <dd className="font-medium text-navy-900">{user?.full_name}</dd>
            </div>
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
