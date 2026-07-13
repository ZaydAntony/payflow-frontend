import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import Button from "../components/Button";

export default function Login() {
  const { login } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.username, form.password);
      push("Welcome back.", "success");
      navigate("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Couldn't sign you in. Check your username and password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      <div className="float-in w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mango">
            <span className="h-2.5 w-2.5 rounded-full bg-ink" />
          </span>
          <span className="font-display text-xl italic text-parchment">PayFlow</span>
        </Link>

        <h1 className="font-display text-3xl italic text-parchment">Welcome back</h1>
        <p className="mt-2 text-sm text-parchment/60">
          Log in to manage your payment links.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-parchment/70">
              Username
            </label>
            <input
              required
              autoFocus
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full rounded-xl border border-parchment/15 bg-ink-soft px-4 py-3 text-sm text-parchment outline-none transition-colors focus:border-mango"
              placeholder="your_business"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-parchment/70">
              Password
            </label>
            <input
              required
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-parchment/15 bg-ink-soft px-4 py-3 text-sm text-parchment outline-none transition-colors focus:border-mango"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-parchment/60">
          New to PayFlow?{" "}
          <Link to="/register" className="font-semibold text-mango">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
