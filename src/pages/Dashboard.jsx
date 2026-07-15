import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard", label: "Payment profiles", end: true },
  { to: "/dashboard/checkout-pages", label: "Checkout pages" },
  { to: "/dashboard/transactions", label: "Transactions" },
  { to: "/dashboard/account", label: "Account" },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-parchment">
      {/* Mobile top bar — only shows below md, replaces the sidebar's logo row */}
      <div className="flex items-center justify-between border-b border-ink/8 bg-parchment px-4 py-3 md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
            <span className="h-2.5 w-2.5 rounded-full bg-mango" />
          </span>
          <span className="font-display text-xl italic text-text">PayFlow</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-lg border border-ink/12"
        >
          <span className="h-0.5 w-4 rounded-full bg-text" />
          <span className="h-0.5 w-4 rounded-full bg-text" />
          <span className="h-0.5 w-4 rounded-full bg-text" />
        </button>
      </div>

      {/* Backdrop, mobile only, shown while the drawer is open */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 md:hidden"
        />
      )}

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-6 md:px-6 md:py-10">
        <aside
          className={
            "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-parchment px-6 py-6 shadow-2xl transition-transform duration-300 ease-out " +
            "md:static md:z-auto md:w-56 md:shrink-0 md:translate-x-0 md:bg-transparent md:px-0 md:py-0 md:shadow-none " +
            (sidebarOpen ? "translate-x-0" : "-translate-x-full")
          }
        >
          <div className="flex items-center justify-between md:mb-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
                <span className="h-2.5 w-2.5 rounded-full bg-mango" />
              </span>
              <span className="font-display text-xl italic text-text">PayFlow</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-text-soft md:hidden"
            >
              ✕
            </button>
          </div>

          <p className="mb-1 mt-6 px-1 font-mono text-[11px] uppercase tracking-wider text-text-soft md:mt-0">
            Signed in as
          </p>
          <p className="mb-6 truncate px-1 text-sm font-semibold text-text">
            {user?.username}
          </p>

          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
                  (isActive
                    ? "bg-ink text-parchment"
                    : "text-text-soft hover:bg-ink/5 hover:text-text")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            onClick={logout}
            className="mt-8 px-3 text-left text-sm font-medium text-text-soft hover:text-coral"
          >
            Log out
          </button>
        </aside>

        <main className="min-w-0 flex-1 pt-4 md:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}