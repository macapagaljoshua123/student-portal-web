import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Pencil, Trash2, MailPlus } from "lucide-react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";
import CreateMemberForm from "../../components/CreateMemberForm";
import EditMemberModal from "../../components/EditMemberModal";
import ThreeDotMenu from "../../components/ThreeDotMenu";
import StatusBadge from "../../components/StatusBadge";
import { useOrgPresence } from "../../hooks/usePresence";
import { useToast } from "../../context/ToastContext";

export default function OrganizationDetailPage() {
  const { orgId } = useParams();
  const { notify } = useToast();
  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const presence = useOrgPresence(orgId);

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

  // Prompt#1 3.2: deleting a member must notify them by email, and they
  // have to be re-invited afterwards — there is no self re-signup.
  async function handleDelete(member) {
    if (
      !window.confirm(
        `Remove ${member.full_name} from this organization? They'll be notified by email and will need to be re-invited to regain access.`
      )
    )
      return;
    setDeletingId(member.id);
    try {
      await apiClient.delete(`/organizations/${orgId}/members/${member.id}`);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      notify(`${member.full_name} was removed and notified by email.`, { icon: "mail" });
    } catch (err) {
      notify(err.response?.data?.detail || "Could not remove this member.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleReinvite(member) {
    try {
      await apiClient.post(`/organizations/${orgId}/members/${member.id}/reinvite`);
      notify(`Invitation resent to ${member.email}.`, { icon: "mail" });
    } catch (err) {
      notify(err.response?.data?.detail || "Could not resend the invitation.");
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
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-navy-900/50">
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
                      <td className="px-6 py-4">
                        <StatusBadge online={Boolean(presence[m.id])} />
                      </td>
                      <td className="px-6 py-4 text-navy-900/60">
                        {new Date(m.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ThreeDotMenu
                          label={`Actions for ${m.full_name}`}
                          items={[
                            { label: "Edit", icon: Pencil, onClick: () => setEditingMember(m) },
                            {
                              label: "Re-invite",
                              icon: MailPlus,
                              onClick: () => handleReinvite(m),
                            },
                            {
                              label: deletingId === m.id ? "Deleting..." : "Delete User",
                              icon: Trash2,
                              danger: true,
                              onClick: () => handleDelete(m),
                            },
                          ]}
                        />
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
