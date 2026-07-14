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
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 md:flex-row md:gap-8 md:px-6 md:py-10">
        <aside className="flex shrink-0 flex-row items-center justify-between gap-4 md:w-56 md:flex-col md:items-stretch md:justify-start">
          <Link to="/" className="flex shrink-0 items-center gap-2 md:mb-8">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
              <span className="h-2.5 w-2.5 rounded-full bg-mango" />
            </span>
            <span className="font-display text-xl italic text-text">PayFlow</span>
          </Link>

          <div className="hidden md:block">
            <p className="mb-1 px-1 font-mono text-[11px] uppercase tracking-wider text-text-soft">
              Signed in as
            </p>
            <p className="mb-6 truncate px-1 text-sm font-semibold text-text">
              {user?.username}
            </p>
          </div>

          <button
            onClick={logout}
            className="shrink-0 text-xs font-medium text-text-soft hover:text-coral md:order-last md:mt-8 md:px-3 md:text-sm"
          >
            Log out
          </button>

          <nav className="order-3 -mx-4 flex gap-1 overflow-x-auto px-4 pb-1 md:order-none md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  "shrink-0 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-colors " +
                  (isActive
                    ? "bg-ink text-parchment"
                    : "text-text-soft hover:bg-ink/5 hover:text-text")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}