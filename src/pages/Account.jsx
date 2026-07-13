import { useEffect, useState } from "react";
import { updateMe, changePassword } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import Button from "../components/Button";

export default function Account() {
  const { user, refreshUser } = useAuth();
  const { push } = useToast();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});

  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [savingPassword, setSavingPassword] = useState(false);
  const [pwErrors, setPwErrors] = useState({});

  useEffect(() => {
    if (!user) return;
    setForm({
      username: user.username ?? "",
      email: user.email ?? "",
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
    });
  }, [user]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const setPw = (key) => (e) => setPwForm({ ...pwForm, [key]: e.target.value });

  const onSaveProfile = async (e) => {
    e.preventDefault();
    setProfileErrors({});
    setSavingProfile(true);
    try {
      await updateMe(form);
      await refreshUser();
      push("Account details updated.", "success");
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") setProfileErrors(data);
      else push("Couldn't save those changes.", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const onChangePassword = async (e) => {
    e.preventDefault();
    setPwErrors({});

    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwErrors({ confirm_password: ["Passwords don't match."] });
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        current_password: pwForm.current_password,
        new_password: pwForm.new_password,
      });
      push("Password changed.", "success");
      setPwForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") setPwErrors(data);
      else push("Couldn't change your password.", "error");
    } finally {
      setSavingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center py-16">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/15 border-t-jade" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl italic text-text">Account</h1>
      <p className="mt-1 text-sm text-text-soft">
        Manage the details tied to your PayFlow login.
      </p>

      <form onSubmit={onSaveProfile} className="mt-8 rounded-2xl border border-ink/10 bg-white/50 p-6">
        <h2 className="font-semibold text-text">Profile details</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="First name" value={form.first_name} onChange={set("first_name")} error={profileErrors.first_name?.[0]} />
          <Field label="Last name" value={form.last_name} onChange={set("last_name")} error={profileErrors.last_name?.[0]} />
          <Field label="Username" value={form.username} onChange={set("username")} error={profileErrors.username?.[0]} required />
          <Field label="Email" type="email" value={form.email} onChange={set("email")} error={profileErrors.email?.[0]} required />
        </div>
        <Button type="submit" loading={savingProfile} className="mt-6">
          Save changes
        </Button>
      </form>

      <form onSubmit={onChangePassword} className="mt-6 rounded-2xl border border-ink/10 bg-white/50 p-6">
        <h2 className="font-semibold text-text">Change password</h2>
        <div className="mt-4 grid gap-4">
          <Field
            label="Current password"
            type="password"
            value={pwForm.current_password}
            onChange={setPw("current_password")}
            error={pwErrors.current_password?.[0]}
            required
          />
          <Field
            label="New password"
            type="password"
            value={pwForm.new_password}
            onChange={setPw("new_password")}
            error={pwErrors.new_password?.[0]}
            required
          />
          <Field
            label="Confirm new password"
            type="password"
            value={pwForm.confirm_password}
            onChange={setPw("confirm_password")}
            error={pwErrors.confirm_password?.[0]}
            required
          />
        </div>
        <Button type="submit" loading={savingPassword} className="mt-6">
          Update password
        </Button>
      </form>
    </div>
  );
}

function Field({ label, error, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-text-soft">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-jade"
      />
      {error && <p className="mt-1 text-xs text-coral">{error}</p>}
    </div>
  );
}