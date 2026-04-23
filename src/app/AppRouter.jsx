import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

import TrackPage from "../pages/TrackPage";
import StatusPage from "../pages/StatusPage";

import AdminLoginPage from "../pages/admin/AdminLoginPage";
import AdminTestsPage from "../pages/admin/AdminTestsPage";
import AdminEditTestPage from "../pages/admin/AdminEditTestPage";

import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<TrackPage />} />
          <Route path="/status/:trackingId" element={<StatusPage />} />
        </Route>

        {/* ADMIN LOGIN (public page) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ADMIN (protected) */}
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/admin"
            element={<Navigate to="/admin/tests" replace />}
          />
          <Route path="/admin/tests" element={<AdminTestsPage />} />
          <Route
            path="/admin/tests/:trackingId"
            element={<AdminEditTestPage />}
          />
        </Route>

        {/* NOT FOUND */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="rounded-xl border bg-white p-6">
                <p className="text-lg font-semibold">404 - Page not found</p>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
