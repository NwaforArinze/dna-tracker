import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className=" flex min-h-screen flex-col bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link to="/track" className="text-lg font-bold">
            <img src="/smartdnalogo.webp" width={150} alt="" />
          </Link>
          {/* <nav className="flex items-center gap-4 text-sm">
            <Link to="/track" className="hover:underline">
              Track
            </Link>
            <Link to="/admin/login" className="hover:underline">
              Admin
            </Link>
          </nav> */}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto flex gap-3 md:gap-0 flex-col md:flex-row max-w-5xl items-center justify-between px-4 py-4 text-sm text-slate-600">
          <span>© 2026 Smart DNA. All rights reserved.</span>
          <span>
            Get in Touch:{" "}
            <a href="mailto:care@smartdna.com.ng" className="hover:underline">
              care@smartdna.com.ng
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}
