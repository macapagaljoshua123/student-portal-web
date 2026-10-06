import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

import AnalyticsPage from "./pages/dashboard/AnalyticsPage";
import AdminAnalyticsPage from "./pages/dashboard/AdminAnalyticsPage";
import AdminsPage from "./pages/dashboard/AdminsPage";
import OrganizationsPage from "./pages/dashboard/OrganizationsPage";
import OrganizationDetailPage from "./pages/dashboard/OrganizationDetailPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import ProfileViewPage from "./pages/dashboard/ProfileViewPage";
import AdviserAnalyticsPage from "./pages/dashboard/AdviserAnalyticsPage";
import TaskBoardPage from "./pages/dashboard/TaskBoardPage";
import MyTasksPage from "./pages/dashboard/MyTasksPage";
import PIODashboardPage from "./pages/dashboard/PIODashboardPage";

const DASHBOARD_ROUTES = {
  super_admin: "/dashboard/analytics",
  admin: "/dashboard/organizations",
  adviser: "/dashboard/adviser-analytics",
  // /dashboard/home sends PIO to their own dashboard, everyone else to My Tasks.
  co_admin: "/dashboard/home",
  member: "/dashboard/home",
};

function PSGHomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user?.org_role === "PIO" ? "/dashboard/pio" : "/dashboard/my-tasks"} replace />;
}

function RootRedirect() {
  
  return <LandingPage />;
}

function ResetPasswordGuard({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route
            path="/reset-password"
            element={
              <ResetPasswordGuard>
                <ResetPasswordPage />
              </ResetPasswordGuard>
            }
          />

          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admins"
            element={
              <ProtectedRoute allowedRoles={["super_admin"]}>
                <AdminsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/activity"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/organizations"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "admin", "adviser"]}>
                <OrganizationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/organizations/:orgId"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "admin", "adviser"]}>
                <OrganizationDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute allowedRoles={["super_admin", "admin", "adviser", "co_admin", "member"]}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute allowedRoles={["co_admin", "member"]}>
                <ProfileViewPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/adviser-analytics"
            element={
              <ProtectedRoute allowedRoles={["adviser"]}>
                <AdviserAnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/task-board"
            element={
              <ProtectedRoute allowedRoles={["adviser"]}>
                <TaskBoardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/home"
            element={
              <ProtectedRoute allowedRoles={["co_admin", "member"]}>
                <PSGHomeRedirect />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-tasks"
            element={
              <ProtectedRoute allowedRoles={["co_admin", "member"]}>
                <MyTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/pio"
            element={
              <ProtectedRoute allowedRoles={["co_admin", "member"]}>
                <PIODashboardPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export { DASHBOARD_ROUTES };
