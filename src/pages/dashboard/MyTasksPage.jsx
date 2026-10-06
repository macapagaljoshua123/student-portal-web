import DashboardLayout from "../../components/DashboardLayout";
import MyTasksPanel from "../../components/MyTasksPanel";
import { useAuth } from "../../context/AuthContext";

export default function MyTasksPage() {
  const { user } = useAuth();
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-navy-950">My Tasks</h1>
        <p className="mt-1 text-sm text-navy-900/60">
          Tasks from your Adviser{user?.org_role ? ` for ${user.org_role}` : ""}. Check them off with remarks
          once they&apos;re done.
        </p>
      </div>
      <MyTasksPanel />
    </DashboardLayout>
  );
}
