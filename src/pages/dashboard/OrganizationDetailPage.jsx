import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2 } from "lucide-react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";
import CreateMemberForm from "../../components/CreateMemberForm";
import EditMemberModal from "../../components/EditMemberModal";

export default function OrganizationDetailPage() {
  const { orgId } = useParams();
  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  function loadAll() {
    setLoading(true);
    Promise.all([
      apiClient.get(`/organizations/${orgId}`),
      apiClient.get(`/organizations/${orgId}/members`),
    ])
      .then(([orgRes, membersRes]) => {
        setOrg(orgRes.data);
        setMembers(membersRes.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, [orgId]);

  async function handleDelete(memberId) {
    if (!window.confirm("Delete this member? This cannot be undone.")) return;
    setDeletingId(memberId);
    try {
      await apiClient.delete(`/organizations/${orgId}/members/${memberId}`);
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <DashboardLayout>
      <Link
        to="/dashboard/organizations"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy-900/60 hover:text-navy-900"
      >
        <ArrowLeft className="h-4 w-4" /> All Organizations
      </Link>

      {loading && !org ? (
        <p className="text-sm text-navy-900/50">Loading organization...</p>
      ) : (
        org && (
          <>
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-navy-950">{org.title}</h1>
                <p className="mt-1 max-w-xl text-sm text-navy-900/60">
                  {org.description || "No description provided."}
                </p>
              </div>
              <button onClick={() => setShowCreate((v) => !v)} className="btn-primary">
                <Plus className="h-4 w-4" />
                {showCreate ? "Close" : "Create Member"}
              </button>
            </div>

            {showCreate && (
              <CreateMemberForm
                orgId={orgId}
                onClose={() => setShowCreate(false)}
                onCreated={() => {
                  setShowCreate(false);
                  loadAll();
                }}
              />
            )}

            <div className="card overflow-x-auto p-0">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-navy-900/10 text-xs font-semibold uppercase tracking-wide text-navy-900/50">
                    <th className="px-6 py-4">Member Name</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Date Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-navy-900/50">
                        No members yet. Create the first one above.
                      </td>
                    </tr>
                  )}
                  {members.map((m) => (
                    <tr key={m.id} className="border-b border-navy-900/5 last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-medium text-navy-900">{m.full_name}</p>
                        <p className="text-xs text-navy-900/50">{m.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full bg-navy-900/5 px-3 py-1 text-xs font-medium text-navy-900">
                          {m.org_role || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-navy-900/60">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => setEditingMember(m)}
                            className="text-navy-900/50 hover:text-navy-900"
                            aria-label={`Edit ${m.full_name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            disabled={deletingId === m.id}
                            className="text-red-500/70 hover:text-red-600 disabled:opacity-40"
                            aria-label={`Delete ${m.full_name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}

      {editingMember && (
        <EditMemberModal
          orgId={orgId}
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSaved={() => {
            setEditingMember(null);
            loadAll();
          }}
        />
      )}
    </DashboardLayout>
  );
}
