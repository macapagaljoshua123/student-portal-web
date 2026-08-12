import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ArrowDownAZ, ArrowUpAZ, Sparkles } from "lucide-react";
import apiClient from "../../api/client";
import DashboardLayout from "../../components/DashboardLayout";

const PIE_COLORS = ["#122544", "#C9A227", "#33578F"];

const FILTERS = [
  { key: "created", label: "Date Created" },
  { key: "increase", label: "Increasing" },
  { key: "decrease", label: "Decreasing" },
];

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("created");

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiClient
      .get("/analytics")
      .then(({ data }) => active && setData(data))
      .catch(() => active && setError("Could not load analytics."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  const orgSeries = useMemo(() => {
    if (!data) return [];
    const series = [...data.organizations_over_time];
    if (filter === "increase") series.sort((a, b) => a.count - b.count);
    else if (filter === "decrease") series.sort((a, b) => b.count - a.count);
    return series;
  }, [data, filter]);

  const pieData = useMemo(() => {
    if (!data) return [];
    const { admins, co_admins, users } = data.role_distribution;
    return [
      { name: "Users", value: users },
      { name: "Admins", value: admins },
      { name: "Co-Admins", value: co_admins },
    ];
  }, [data]);

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-950">Analytics</h1>
          <p className="mt-1 text-sm text-navy-900/60">
            Portal-wide activity across every organization.
          </p>
        </div>
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                filter === f.key
                  ? "border-navy-900 bg-navy-900 text-white"
                  : "border-navy-900/15 text-navy-900/70 hover:border-navy-900/40"
              }`}
            >
              {f.key === "increase" && <ArrowUpAZ className="h-3.5 w-3.5" />}
              {f.key === "decrease" && <ArrowDownAZ className="h-3.5 w-3.5" />}
              {f.key === "created" && <Sparkles className="h-3.5 w-3.5" />}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-sm text-navy-900/50">Loading analytics...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {data && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Total Organizations" value={data.total_organizations} />
            <StatCard label="Total Members" value={data.total_members} />
            <StatCard
              label="Admins"
              value={data.role_distribution.admins}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="card">
              <h2 className="font-display text-lg font-semibold text-navy-950">
                Organizations Created
              </h2>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orgSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#12254414" />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#0B1B3399" }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#0B1B3399" }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#C9A227" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <h2 className="font-display text-lg font-semibold text-navy-950">
                Users, Admins & Co-Admins
              </h2>
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card">
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-900/50">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold text-navy-950">{value}</p>
    </div>
  );
}
