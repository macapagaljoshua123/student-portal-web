import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Users2, ArrowRight, X } from "lucide-react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

export default function OrganizationsPage() {
  const { user } = useAuth();
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Prompt#1 3.2: "Admin can create organizations, but limited by the limit
  // set by Super Admin." null/undefined limit = unlimited.
  const limit = user?.create_organization_limit;
  const limitReached =
    user?.account_type === "admin" && limit != null && orgs.length >= limit;

  function loadOrgs() {
    setLoading(true);
    apiClient
      .get("/organizations")
      .then(({ data }) => setOrgs(data))
      .finally(() => setLoading(false));
  }

  useEffect(loadOrgs, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiClient.post("/organizations", { title, description });
      setTitle("");
      setDescription("");
      setShowForm(false);
      loadOrgs();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create organization.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Organizations</h1>
          <p className="mt-1 text-sm text-navy-900/60">
            Every PSG-affiliated organization on the portal.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <button
            onClick={() => setShowForm((v) => !v)}
            disabled={limitReached}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            {showForm ? "Close" : "Create Organization"}
          </button>
          {user?.account_type === "admin" && (
            <span className="text-xs text-navy-900/40">
              {limit == null
                ? "Unlimited organizations"
                : `${orgs.length} / ${limit} organizations used`}
            </span>
          )}
        </div>
      </div>

      {limitReached && (
        <div className="card mb-6 border-gold-500/40 bg-gold-500/5 text-sm text-navy-900">
          You&apos;ve reached your organization limit ({limit}). Contact the Super Admin to
          raise it.
        </div>
      )}

      {showForm && !limitReached && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={handleCreate}
          className="card mb-8 space-y-4"
        >
          <div className="flex items-start justify-between">
            <h2 className="font-display text-lg font-semibold text-navy-950">
              New Organization
            </h2>
            <button type="button" onClick={() => setShowForm(false)} aria-label="Close form">
              <X className="h-4 w-4 text-navy-900/40" />
            </button>
          </div>

          <div>
            <label htmlFor="org-title" className="field-label">
              Title of Organization
            </label>
            <input
              id="org-title"
              required
              className="field-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Partylist Student Government"
            />
          </div>
          <div>
            <label htmlFor="org-description" className="field-label">
              Description of Organization
            </label>
            <textarea
              id="org-description"
              rows={3}
              className="field-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of this organization's purpose"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-gold">
            {submitting ? "Creating..." : "Create"}
          </button>
        </motion.form>
      )}

      {loading ? (
        <p className="text-sm text-navy-900/50">Loading organizations...</p>
      ) : orgs.length === 0 ? (
        <div className="card text-center text-sm text-navy-900/50">
          No organizations yet. Create your first one above.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <Link
              key={org.id}
              to={`/dashboard/organizations/${org.id}`}
              className="card group flex flex-col justify-between transition hover:border-gold-500/50"
            >
              <div>
                <h3 className="font-display text-lg font-semibold text-navy-950">
                  {org.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm text-navy-900/60">
                  {org.description || "No description provided."}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="inline-flex items-center gap-1.5 text-navy-900/60">
                  <Users2 className="h-4 w-4" /> {org.member_count} members
                </span>
                <ArrowRight className="h-4 w-4 text-gold-600 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
