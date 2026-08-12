import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import apiClient from "../api/client";
import RoleDropdown, { PSG_ROLES } from "./RoleDropdown";

export default function CreateMemberForm({ orgId, onClose, onCreated }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [role, setRole] = useState("");
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!role) {
      setError("Please select a role.");
      return;
    }
    if (!autoGenerate && (!password || password.length < 8)) {
      setError("Password must be at least 8 characters.");
      return;
    }

    const roleMeta = PSG_ROLES.find((r) => r.value === role);

    setSubmitting(true);
    try {
      await apiClient.post(`/organizations/${orgId}/members`, {
        full_name: fullName,
        email,
        contact_number: contactNumber || null,
        account_type: roleMeta.accountType,
        org_role: role,
        auto_generate_password: autoGenerate,
        password: autoGenerate ? null : password,
      });
      onCreated();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not create member.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      onSubmit={handleSubmit}
      className="card mb-8 space-y-4"
    >
      <div className="flex items-start justify-between">
        <h2 className="font-display text-lg font-semibold text-navy-950">Create Member</h2>
        <button type="button" onClick={onClose} aria-label="Close form">
          <X className="h-4 w-4 text-navy-900/40" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="full-name" className="field-label">
            Full Name
          </label>
          <input
            id="full-name"
            required
            className="field-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="member-email" className="field-label">
            Email
          </label>
          <input
            id="member-email"
            type="email"
            required
            className="field-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="contact-number" className="field-label">
            Contact Number
          </label>
          <input
            id="contact-number"
            className="field-input"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="09XXXXXXXXX"
          />
        </div>
        <div>
          <label htmlFor="role" className="field-label">
            Role
          </label>
          <RoleDropdown id="role" value={role} onChange={setRole} />
        </div>
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-navy-800">
          <input
            type="checkbox"
            checked={autoGenerate}
            onChange={(e) => setAutoGenerate(e.target.checked)}
            className="h-4 w-4 rounded border-navy-900/30 text-gold-500 focus:ring-gold-500"
          />
          Auto-Generate Password (sent to member&apos;s Gmail)
        </label>
        <input
          type="password"
          disabled={autoGenerate}
          value={autoGenerate ? "" : password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={autoGenerate ? "Will be generated automatically" : "Enter a password"}
          className="field-input disabled:cursor-not-allowed disabled:bg-navy-900/5 disabled:text-navy-900/40"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-gold">
        {submitting ? "Creating..." : "Create"}
      </button>
    </motion.form>
  );
}
