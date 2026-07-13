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

  return (
    <div className="min-h-screen bg-parchment">
      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-10">
        <aside className="w-56 shrink-0">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
              <span className="h-2.5 w-2.5 rounded-full bg-mango" />
            </span>
            <span className="font-display text-xl italic text-text">PayFlow</span>
          </Link>

          <p className="mb-1 px-1 font-mono text-[11px] uppercase tracking-wider text-text-soft">
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
            className="mt-8 px-3 text-sm font-medium text-text-soft hover:text-coral"
          >
            Log out
          </button>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}