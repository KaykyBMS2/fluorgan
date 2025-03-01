
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import SignUp from "@/pages/auth/SignUp";
import Dashboard from "@/pages/dashboard/Dashboard";
import Tasks from "@/pages/dashboard/tasks/Tasks";
import Settings from "@/pages/dashboard/settings/Settings";
import Reports from "@/pages/dashboard/reports/Reports";
import NotFound from "@/pages/NotFound";
import Pricing from "@/pages/pricing/Pricing";
import Boards from "@/pages/boards/Boards";
import BoardPage from "@/pages/boards/BoardPage";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><Index /></PublicRoute>} />
      <Route path="/auth/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/auth/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/pricing" element={<Pricing />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
      <Route path="/boards" element={<ProtectedRoute><Boards /></ProtectedRoute>} />
      <Route path="/boards/:id" element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
