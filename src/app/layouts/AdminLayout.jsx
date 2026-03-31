import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/admin/tests" className="text-lg font-bold flex ">
            <img src="/smartdnalogo.webp" width={100} alt="" />
            <span className="text-slate-500">• Admin</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link to="/admin/tests" className="hover:underline">
              Tests
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 mx-auto max-w-5xl px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 text-sm text-slate-600">
          <span>Admin only</span>
          <span>© DNA Center</span>
        </div>
      </footer>
    </div>
  );
}
