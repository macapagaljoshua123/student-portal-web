import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";
import apiClient from "../api/client";
import { useAuth } from "../context/AuthContext";

const DASHBOARD_ROUTES = {
  super_admin: "/dashboard/analytics",
  admin: "/dashboard/organizations",
  co_admin: "/dashboard/profile",
  member: "/dashboard/profile",
};

export default function ResetPasswordPage() {
  const { user, completePasswordReset } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await apiClient.post("/auth/reset-password", {
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      completePasswordReset();
      navigate(DASHBOARD_ROUTES[user?.account_type] || "/dashboard/profile");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-900/[0.03] px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm card"
      >
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
          <KeyRound className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-xl font-semibold text-navy-950">Create a new password</h1>
        <p className="mt-2 text-sm text-navy-900/60">
          For your security, set a permanent password before continuing to
          your dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="newPassword" className="field-label">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              className="field-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="field-label">
              Retype New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              minLength={8}
              className="field-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Saving..." : "Save Password & Continue"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
