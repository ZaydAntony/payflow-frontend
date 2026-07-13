import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import Button from "../components/Button";

export default function Register() {
  const { register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      await register(form);
      push("Account created. Let's set up your payment profile.", "success");
      navigate("/dashboard");
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") {
        setErrors(data);
      } else {
        setErrors({ non_field_errors: ["Something went wrong. Try again."] });
      }
    } finally {
      setLoading(false);
    }
  };

  const fieldError = (key) => errors[key]?.[0];

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 py-16">
      <div className="float-in w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-mango">
            <span className="h-2.5 w-2.5 rounded-full bg-ink" />
          </span>
          <span className="font-display text-xl italic text-parchment">PayFlow</span>
        </Link>

        <h1 className="font-display text-3xl italic text-parchment">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-parchment/60">
          Takes a minute. You'll connect your Daraja app next.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" value={form.first_name} onChange={set("first_name")} error={fieldError("first_name")} />
            <Field label="Last name" value={form.last_name} onChange={set("last_name")} error={fieldError("last_name")} />
          </div>
          <Field label="Username" value={form.username} onChange={set("username")} error={fieldError("username")} required />
          <Field label="Email" type="email" value={form.email} onChange={set("email")} error={fieldError("email")} required />
          <Field label="Password" type="password" value={form.password} onChange={set("password")} error={fieldError("password")} required />

          {fieldError("non_field_errors") && (
            <p className="rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
              {fieldError("non_field_errors")}
            </p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-parchment/60">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-mango">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, error, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-parchment/70">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl border border-parchment/15 bg-ink-soft px-4 py-3 text-sm text-parchment outline-none transition-colors focus:border-mango"
      />
      {error && <p className="mt-1 text-xs text-coral">{error}</p>}
    </div>
  );
}
