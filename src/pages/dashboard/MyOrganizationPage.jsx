import { useEffect, useState } from "react";
import { Building2, Users2 } from "lucide-react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";
import StatusBadge from "../../components/StatusBadge";
import Avatar from "../../components/Avatar";
import { useOrgPresence } from "../../hooks/usePresence";

/** Read-only view of the organization a PSG member belongs to, and the people the Adviser added to it. */
export default function MyOrganizationPage() {
  const [org, setOrg] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const presence = useOrgPresence(org?.id);

  useEffect(() => {
    let active = true;
    function load() {
      apiClient
        .get("/organizations")
        .then(async ({ data }) => {
          const mine = data[0];
          if (!active) return;
          setOrg(mine || null);
          if (mine) {
            const res = await apiClient.get(`/organizations/${mine.id}/members`);
            if (active) setMembers(res.data);
          }
        })
        .catch(() => {})
        .finally(() => active && setLoading(false));
    }
    load();
    const interval = setInterval(load, 30000); // new members show up on their own
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const sorted = [...members].sort((a, b) => {
    const rank = (m) => (m.account_type === "adviser" ? 0 : 1);
    return rank(a) - rank(b) || a.full_name.localeCompare(b.full_name);
  });

  return (
    <DashboardLayout>
      {loading ? (
        <p className="text-sm text-navy-900/50">Loading organization...</p>
      ) : !org ? (
        <div className="card py-12 text-center text-sm text-navy-900/50">
          You haven&apos;t been added to an organization yet.
        </div>
      ) : (
        <>
          <div className="mb-8 flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
              <Building2 className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-2xl font-semibold text-navy-950">{org.title}</h1>
              <p className="mt-1 max-w-xl text-sm text-navy-900/60">
                {org.description || "No description provided."}
              </p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-navy-900/50">
                <Users2 className="h-3.5 w-3.5" /> {org.member_count} people
                {org.adviser_names?.length ? ` · Adviser: ${org.adviser_names.join(", ")}` : ""}
              </p>
            </div>
          </div>

          <div className="card overflow-x-auto p-0">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-navy-900/10 text-xs font-semibold uppercase tracking-wide text-navy-900/50">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((m) => (
                  <tr key={m.id} className="border-b border-navy-900/5 last:border-0">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar user={m} size={36} />
                        <div>
                          <p className="font-medium text-navy-900">{m.full_name}</p>
                          <p className="text-xs text-navy-900/50">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-navy-900/5 px-3 py-1 text-xs font-medium text-navy-900">
                        {m.org_role || (m.account_type === "adviser" ? "Adviser" : "—")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge online={Boolean(presence[m.id])} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
