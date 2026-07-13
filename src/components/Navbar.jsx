import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-ink/8 bg-parchment/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink">
            <span className="h-2.5 w-2.5 rounded-full bg-mango" />
          </span>
          <span className="font-display text-xl italic">PayFlow</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-text-soft md:flex">
          <a href="/#how" className="hover:text-text">Components</a>
          <a href="/#pricing" className="hover:text-text">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button as={Link} to="/dashboard" variant="outline" size="sm">
                Dashboard
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button as={Link} to="/register" variant="primary" size="sm">
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
