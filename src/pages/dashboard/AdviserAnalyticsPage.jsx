import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, Hourglass, Users } from "lucide-react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";
import ProgressBar from "../../components/ProgressBar";
import TaskItemCard from "../../components/TaskItemCard";
import StatusBadge from "../../components/StatusBadge";
import { useOrgPresence } from "../../hooks/usePresence";

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="card flex items-center gap-4">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-900 text-gold-400">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-900/50">{label}</p>
        <p className="font-display text-2xl font-semibold text-navy-950">{value}</p>
      </div>
    </div>
  );
}

export default function AdviserAnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("All");
  const presence = useOrgPresence(data?.organization?.id);

  // Poll so new accomplishments show up without a manual refresh.
  useEffect(() => {
    let active = true;
    function load() {
      apiClient
        .get("/tasks/analytics")
        .then(({ data }) => active && setData(data))
        .catch(() => {})
        .finally(() => active && setLoading(false));
    }
    load();
    const interval = setInterval(load, 20000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const roles = data?.roles || [];
  const active = selected === "All" ? null : roles.find((r) => r.role === selected);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-navy-950">Analytics</h1>
        <p className="mt-1 text-sm text-navy-900/60">
          Track what every PSG member has accomplished from the tasks you gave them
          {data?.organization ? ` in ${data.organization.title}` : ""}.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-navy-900/50">Loading analytics...</p>
      ) : !data ? (
        <div className="card text-center text-sm text-navy-900/50">
          Analytics aren&apos;t available yet. Make sure you&apos;re assigned to an organization.
        </div>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Stat icon={ClipboardList} label="Tasks given" value={data.overall.total} />
            <Stat icon={CheckCircle2} label="Accomplished" value={data.overall.completed} />
            <Stat icon={Hourglass} label="Pending" value={data.overall.total - data.overall.completed} />
          </div>

          <div className="card mb-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-navy-950">Overall PSG progress</p>
              <p className="text-xs text-navy-900/50">
                {data.overall.completed} of {data.overall.total} tasks done
              </p>
            </div>
            <ProgressBar percent={data.overall.percent} segments={data.overall.total} size="lg" />
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {[{ role: "All" }, ...roles].map((r) => (
              <button
                key={r.role}
                onClick={() => setSelected(r.role)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                  selected === r.role
                    ? "border-navy-900 bg-navy-900 text-white"
                    : "border-navy-900/15 text-navy-900/70 hover:border-navy-900/40"
                }`}
              >
                {r.role === "All" ? "All Members" : r.role}
              </button>
            ))}
          </div>

          {!active ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {roles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => setSelected(r.role)}
                  className="card text-left transition hover:border-gold-500/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-base font-semibold text-navy-950">{r.role}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-navy-900/50">
                        <Users className="h-3.5 w-3.5 shrink-0" />
                        {r.member_name || "— vacant —"}
                      </p>
                      {r.member_id && (
                        <div className="mt-1.5">
                          <StatusBadge online={Boolean(presence[r.member_id])} />
                        </div>
                      )}
                    </div>
                    <span className="shrink-0 text-xs text-navy-900/50">
                      {r.completed}/{r.total} tasks
                    </span>
                  </div>
                  <div className="mt-4">
                    {r.total === 0 ? (
                      <p className="text-xs text-navy-900/40">No tasks assigned yet</p>
                    ) : (
                      <ProgressBar percent={r.percent} segments={r.total} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <section>
              <div className="card mb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-navy-950">{active.role}</h2>
                    <p className="text-sm text-navy-900/60">
                      {active.member_name || "No member assigned"}
                      {active.member_email ? ` · ${active.member_email}` : ""}
                    </p>
                    {active.member_id && (
                      <div className="mt-1.5">
                        <StatusBadge online={Boolean(presence[active.member_id])} />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-navy-900/60">
                    {active.completed} of {active.total} tasks accomplished
                  </p>
                </div>
                <div className="mt-4">
                  <ProgressBar percent={active.percent} segments={active.total} size="lg" />
                </div>
              </div>

              {active.tasks.length === 0 ? (
                <div className="card text-center text-sm text-navy-900/50">
                  You haven&apos;t given {active.role} any tasks yet. Add some from the PSG Task Board.
                </div>
              ) : (
                <div className="space-y-3">
                  {active.tasks.map((t) => (
                    <TaskItemCard key={t.id} task={t} />
                  ))}
                </div>
              )}
            </section>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
