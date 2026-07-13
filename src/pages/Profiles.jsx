import { useEffect, useState } from "react";
import { listProfiles, createProfile, deleteProfile } from "../api/client";
import { useToast } from "../components/Toast";
import Button from "../components/Button";

// What each provider calls itself, and which credential fields it needs.
// Adding a new provider later is just adding an entry here (plus the
// matching adapter on the backend) — the form below reads this list, it
// doesn't hardcode Daraja or KCB anywhere.
const PROVIDERS = [
  { id: "daraja", label: "Daraja (M-Pesa)" },
  { id: "kcb", label: "KCB Buni" },
];

const CREDENTIAL_FIELDS = {
  daraja: [
    { key: "consumer_key", label: "Consumer key", required: true },
    { key: "consumer_secret", label: "Consumer secret", password: true, required: true },
    { key: "passkey", label: "Passkey", password: true, required: true },
  ],
  kcb: [
    { key: "consumer_key", label: "Consumer key", required: true },
    { key: "consumer_secret", label: "Consumer secret", password: true, required: true },
  ],
};

const EMPTY = {
  business_name: "",
  provider: "daraja",
  short_code: "",
  short_code_type: "till",
  phone_number: "",
  credentials: {},
};

export default function Profiles() {
  const { push } = useToast();
  const [profiles, setProfiles] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const load = async () => {
    try {
      const { data } = await listProfiles();
      setProfiles(data);
    } catch {
      push("Couldn't load your payment profiles.", "error");
      setProfiles([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const setCredential = (key) => (e) =>
    setForm({ ...form, credentials: { ...form.credentials, [key]: e.target.value } });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSaving(true);
    try {
      await createProfile(form);
      push("Payment profile connected.", "success");
      setForm(EMPTY);
      setShowForm(false);
      load();
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") setErrors(data);
      else push("Couldn't save that profile. Check the details and try again.", "error");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Remove this payment profile? Checkout pages using it will stop working.")) return;
    try {
      await deleteProfile(id);
      push("Profile removed.");
      load();
    } catch {
      push("Couldn't remove that profile.", "error");
    }
  };

  const credentialFields = CREDENTIAL_FIELDS[form.provider] ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl italic text-text">Payment profiles</h1>
          <p className="mt-1 text-sm text-text-soft">
            Connect a till or paybill to your provider's app credentials.
          </p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>Connect a profile</Button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="float-in mt-8 rounded-2xl border border-ink/10 bg-white/50 p-6"
        >
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-text-soft">
              Provider
            </label>
            <div className="flex gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setForm({ ...form, provider: p.id, credentials: {} })}
                  className={
                    "rounded-full px-4 py-2 text-sm font-medium transition-colors " +
                    (form.provider === p.id
                      ? "bg-ink text-parchment"
                      : "border border-ink/12 text-text-soft hover:border-ink/30")
                  }
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Business name" value={form.business_name} onChange={set("business_name")} error={errors.business_name?.[0]} required />
            <Field label="Phone number" value={form.phone_number} onChange={set("phone_number")} error={errors.phone_number?.[0]} placeholder="2547XXXXXXXX" required />

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-soft">
                Short code type
              </label>
              <select
                value={form.short_code_type}
                onChange={set("short_code_type")}
                className="w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none focus:border-jade"
              >
                <option value="till">Till</option>
                <option value="paybill">Paybill</option>
              </select>
            </div>
            <Field label="Short code" value={form.short_code} onChange={set("short_code")} error={errors.short_code?.[0]} placeholder="6 digits" required />

            {credentialFields.map((field) => (
              <Field
                key={field.key}
                label={field.label}
                type={field.password ? "password" : "text"}
                value={form.credentials[field.key] ?? ""}
                onChange={setCredential(field.key)}
                required={field.required}
              />
            ))}
          </div>

          {errors.credentials && (
            <p className="mt-4 rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
              {Array.isArray(errors.credentials) ? errors.credentials[0] : errors.credentials}
            </p>
          )}
          {errors.provider && (
            <p className="mt-4 rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
              {Array.isArray(errors.provider) ? errors.provider[0] : errors.provider}
            </p>
          )}

          <div className="mt-6 flex gap-3">
            <Button type="submit" loading={saving}>Save profile</Button>
            <Button type="button" variant="ghost" onClick={() => { setShowForm(false); setForm(EMPTY); }}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="mt-8">
        {profiles === null && (
          <div className="flex justify-center py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/15 border-t-jade" />
          </div>
        )}

        {profiles?.length === 0 && !showForm && (
          <EmptyState onAction={() => setShowForm(true)} />
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {profiles?.map((p) => (
            <div key={p.id} className="rounded-2xl border border-ink/10 bg-white/50 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-text">{p.business_name}</p>
                  <p className="mt-0.5 font-mono text-xs text-text-soft">{p.phone_number}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="rounded-full bg-jade/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-jade-deep">
                    {p.short_code_type}
                  </span>
                  <span className="rounded-full bg-mango/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-mango-deep">
                    {PROVIDERS.find((prov) => prov.id === p.provider)?.label ?? p.provider}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onDelete(p.id)}
                className="mt-4 text-xs font-medium text-coral hover:underline"
              >
                Remove profile
              </button>
            </div>
          ))}
        </div>
      </div>
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

export function EmptyState({ onAction }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/15 py-16 text-center">
      <p className="font-display text-2xl italic text-text">Nothing here yet</p>
      <p className="mx-auto mt-2 max-w-xs text-sm text-text-soft">
        Connect your first payment profile to start creating checkout links.
      </p>
      <Button onClick={onAction} className="mt-5">Connect a profile</Button>
    </div>
  );
}