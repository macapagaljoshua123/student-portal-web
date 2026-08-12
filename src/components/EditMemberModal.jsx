import { useState } from "react";
import { X } from "lucide-react";
import apiClient from "../api/client";
import RoleDropdown from "./RoleDropdown";

export default function EditMemberModal({ orgId, member, onClose, onSaved }) {
  const [fullName, setFullName] = useState(member.full_name);
  const [email, setEmail] = useState(member.email);
  const [contactNumber, setContactNumber] = useState(member.contact_number || "");
  const [role, setRole] = useState(member.org_role || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await apiClient.put(`/organizations/${orgId}/members/${member.id}`, {
        full_name: fullName,
        email,
        contact_number: contactNumber || null,
        org_role: role || null,
      });
      onSaved();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not update member.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-navy-950">Edit Member</h2>
          <button onClick={onClose} aria-label="Close">
            <X className="h-4 w-4 text-navy-900/40" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="edit-name" className="field-label">
              Full Name
            </label>
            <input
              id="edit-name"
              required
              className="field-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="edit-email" className="field-label">
              Email
            </label>
            <input
              id="edit-email"
              type="email"
              required
              className="field-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="edit-contact" className="field-label">
              Contact Number
            </label>
            <input
              id="edit-contact"
              className="field-input"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="edit-role" className="field-label">
              Role
            </label>
            <RoleDropdown id="edit-role" value={role} onChange={setRole} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Saving..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
