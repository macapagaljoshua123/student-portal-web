import { Megaphone } from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import MyTasksPanel from "../../components/MyTasksPanel";
import { useAuth } from "../../context/AuthContext";

export default function PIODashboardPage() {
  const { user } = useAuth();
  return (
    <DashboardLayout>
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-navy-950 p-8 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(circle at 85% 20%, rgba(201,162,39,0.35), transparent 45%)",
          }}
        />
        <div className="relative flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-500 text-navy-950">
            <Megaphone className="h-7 w-7" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gold-400">
              Public Information Officer
            </p>
            <h1 className="mt-1 text-2xl font-semibold">PIO Dashboard</h1>
            <p className="mt-1 text-sm text-white/60">
              Welcome, {user?.full_name}. Here are the tasks your Adviser gave you.
            </p>
          </div>
        </div>
      </div>
      <MyTasksPanel />
    </DashboardLayout>
  );
}
