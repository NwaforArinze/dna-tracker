import { Outlet, Link } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className=" flex min-h-screen flex-col bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-lg font-bold">
            <img src="/smartdnalogo.webp" width={150} alt="" />
          </Link>
          <Link
            to="https://smartdna.com.ng"
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <button>← back to smartdna.com.ng</button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 flex-1">
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto flex gap-3 md:gap-0 flex-col md:flex-row max-w-7xl items-center justify-between px-4 py-4 text-sm text-slate-600">
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
