import { Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../../services/authService";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("dna_admin_auth");

    if (!raw) return;

    try {
      const session = JSON.parse(raw);

      if (!session.expiresAt) return;

      const timeLeft = session.expiresAt - Date.now();

      // If already expired
      if (timeLeft <= 0) {
        logout();
        navigate("/admin/login");
        return;
      }

      // Set auto logout timer
      const timer = setTimeout(() => {
        logout();
        alert("Session expired. Please login again.");
        navigate("/admin/login");
      }, timeLeft);

      return () => clearTimeout(timer);
    } catch (err) {
      console.error("Session error:", err);
    }
  }, [navigate]); // ✅ important

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/admin/tests" className="text-lg font-bold flex ">
            <img src="/smartdnalogo.webp" width={100} alt="" />
            <span className="text-slate-500">• Admin</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link to="/admin/tests" className="hover:underline">
              Tests
            </Link>
            <button
              onClick={handleLogout}
              className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-sm text-slate-600">
          <span>Admin only</span>
          <span>© DNA Center</span>
        </div>
      </footer>
    </div>
  );
}
