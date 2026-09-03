import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, X, Trash2, SlidersHorizontal } from "lucide-react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";
import ThreeDotMenu from "../../components/ThreeDotMenu";
import OrgLimitSubmenu from "../../components/OrgLimitSubmenu";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../context/ToastContext";

export default function AdminsPage() {
  const { notify } = useToast();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [savingLimitFor, setSavingLimitFor] = useState(null);

  function loadAdmins() {
    setLoading(true);
    apiClient
      .get("/admins")
      .then(({ data }) => setAdmins(data))
      .catch(() => setError("Could not load Admins."))
      .finally(() => setLoading(false));
  }

  useEffect(loadAdmins, []);

  // Prompt#1 3.1: Create Members — role is fixed to Admin (The Adviser).
  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiClient.post("/admins", {
        full_name: fullName,
        email,
        account_type: "admin",
        auto_generate_password: true,
      });
      setFullName("");
      setEmail("");
      setShowForm(false);
      notify(`Invite sent to ${email}. They'll receive a temporary password by email.`, {
        icon: "mail",
      });
      loadAdmins();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create Admin.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteAccount(admin) {
    if (
      !window.confirm(
        `Permanently remove ${admin.full_name}'s Admin account? This cannot be undone.`
      )
    )
      return;
    try {
      await apiClient.delete(`/admins/${admin.id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      notify(`${admin.full_name} was removed and notified by email.`, { icon: "mail" });
    } catch (err) {
      notify(err.response?.data?.detail || "Could not delete this Admin account.");
    }
  }

  async function handleSetLimit(admin, limit) {
    setSavingLimitFor(admin.id);
    try {
      await apiClient.patch(`/admins/${admin.id}/org-limit`, {
        create_organization_limit: limit,
      });
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, create_organization_limit: limit } : a))
      );
      notify(
        `Organization limit for ${admin.full_name} set to ${limit == null ? "Unlimited" : limit}.`
      );
    } catch (err) {
      notify(err.response?.data?.detail || "Could not update the organization limit.");
    } finally {
      setSavingLimitFor(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Admins</h1>
          <p className="mt-1 text-sm text-navy-900/60">
            Manage Admin (Adviser) accounts and their organization creation limits.
          </p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
          <Plus className="h-4 w-4" />
          {showForm ? "Close" : "Create Member"}
        </button>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleCreate}
          className="card mb-8 space-y-4"
        >
          <div className="flex items-start justify-between">
            <h2 className="font-display text-lg font-semibold text-navy-950">
              Create Admin (The Adviser)
            </h2>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Close form">
              <X className="h-4 w-4 text-navy-900/40" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="admin-full-name" className="field-label">
                Full Name
              </label>
              <input
                id="admin-full-name"
                required
                className="field-input"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="admin-email" className="field-label">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                required
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label">Role</label>
              <input className="field-input bg-navy-900/5 text-navy-900/50" value="Admin" disabled />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-gold">
            {submitting ? "Creating..." : "Create"}
          </button>
        </motion.form>
      )}

      {loading ? (
        <p className="text-sm text-navy-900/50">Loading Admins...</p>
      ) : admins.length === 0 ? (
        <div className="card text-center text-sm text-navy-900/50">
          No Admins yet. Create the first one above.
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-900/10 text-xs font-semibold uppercase tracking-wide text-navy-900/50">
                <th className="px-6 py-4">Admin</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Org Limit</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-navy-900/5 last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-medium text-navy-900">{admin.full_name}</p>
                    <p className="text-xs text-navy-900/50">{admin.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge online={Boolean(admin.is_online)} />
                  </td>
                  <td className="px-6 py-4 text-navy-900/70">
                    {admin.create_organization_limit == null
                      ? "Unlimited"
                      : admin.create_organization_limit}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ThreeDotMenu
                      items={[
                        {
                          label: "Set Create Organization Limit",
                          icon: SlidersHorizontal,
                          submenu: (
                            <OrgLimitSubmenu
                              currentLimit={admin.create_organization_limit}
                              submitting={savingLimitFor === admin.id}
                              onSubmit={(limit) => handleSetLimit(admin, limit)}
                            />
                          ),
                        },
                        {
                          label: "Delete Account",
                          icon: Trash2,
                          danger: true,
                          onClick: () => handleDeleteAccount(admin),
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
