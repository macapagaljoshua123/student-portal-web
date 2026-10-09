import { useEffect, useState } from "react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import Avatar from "../../components/Avatar";
import { useOrgPresence } from "../../hooks/usePresence";

// Prompt#1 3.2: roles the Analytics POV must show live status for.
const TRACKED_ROLES = [
  "President",
  "VP Internal",
  "VP External",
  "VP Sports",
  "Secretary",
  "Treasurer",
  "Auditor",
  "PIO",
  "EducSoc Governor",
  "BMA Governor",
];

export default function AdminAnalyticsPage() {
  const [orgs, setOrgs] = useState([]);
  const [activeOrgId, setActiveOrgId] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/organizations")
      .then(({ data }) => {
        setOrgs(data);
        if (data.length) setActiveOrgId(data[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeOrgId) return;
    apiClient.get(`/organizations/${activeOrgId}/members`).then(({ data }) => setMembers(data));
  }, [activeOrgId]);

  const presence = useOrgPresence(activeOrgId);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-navy-950">Analytics</h1>
        <p className="mt-1 text-sm text-navy-900/60">
          Live online status of every Adviser and PSG officer: President, VP Internal &amp; External, VP Sports, Secretary,
          Treasurer, Auditor, PIO, EducSoc Governor, and BMA Governor.
        </p>
      </div>

      {orgs.length > 1 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {orgs.map((org) => (
            <button
              key={org.id}
              onClick={() => setActiveOrgId(org.id)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                activeOrgId === org.id
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-900/15 text-navy-900/70 hover:border-navy-900/40"
              }`}
            >
              {org.title}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-navy-900/50">Loading...</p>
      ) : orgs.length === 0 ? (
        <div className="card text-center text-sm text-navy-900/50">
          Create an organization first to see role activity here.
        </div>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-navy-900/10 text-xs font-semibold uppercase tracking-wide text-navy-900/50">
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {members
                .filter((m) => m.account_type === "adviser")
                .map((adv) => (
                  <tr key={adv.id} className="border-b border-navy-900/5 bg-gold-500/[0.04]">
                    <td className="px-6 py-4 font-medium text-navy-900">Adviser</td>
                    <td className="px-6 py-4 text-navy-900/70">
                      <span className="inline-flex items-center gap-2">
                        <Avatar user={adv} size={24} /> {adv.full_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge online={Boolean(presence[adv.id])} />
                    </td>
                  </tr>
                ))}
              {TRACKED_ROLES.map((role) => {
                const member = members.find((m) => m.org_role === role);
                return (
                  <tr key={role} className="border-b border-navy-900/5 last:border-0">
                    <td className="px-6 py-4 font-medium text-navy-900">{role}</td>
                    <td className="px-6 py-4 text-navy-900/70">
                      {member ? (
                        <span className="inline-flex items-center gap-2">
                          <Avatar user={member} size={24} /> {member.full_name}
                        </span>
                      ) : (
                        "— vacant —"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {member ? (
                        <StatusBadge online={Boolean(presence[member.id])} />
                      ) : (
                        <span className="text-xs text-navy-900/30">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
