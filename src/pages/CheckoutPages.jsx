import { useEffect, useState } from "react";
import {
  createCheckoutPage,
  deleteCheckoutPage,
  listCheckoutPages,
  listProfiles,
} from "../api/client";
import Button from "../components/Button";
import CheckoutSnippet from "../components/CheckoutSnippet";
import { useToast } from "../components/Toast";
import { EmptyState } from "./Profiles";

const EMPTY = {
  profile: "",
  title: "",
  description: "",
  page_type: "fixed",
  fixed_amount: "",
  minimum_amount: "",
};

export default function CheckoutPages() {
  const { push } = useToast();
  const [pages, setPages] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [copiedId, setCopiedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const load = async () => {
    try {
      const [pagesRes, profilesRes] = await Promise.all([
        listCheckoutPages(),
        listProfiles(),
      ]);
      setPages(pagesRes.data);
      setProfiles(profilesRes.data);
    } catch {
      push("Couldn't load your checkout pages.", "error");
      setPages([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!form.profile) {
      setErrors({
        profile: ["Select a payment profile before creating a checkout page."],
      });
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form };
      if (payload.page_type !== "fixed") delete payload.fixed_amount;
      if (payload.page_type !== "flexible") delete payload.minimum_amount;
      await createCheckoutPage(payload);
      push("Checkout page created.", "success");
      setForm(EMPTY);
      setShowForm(false);
      load();
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === "object") setErrors(data);
      else
        push(
          "Couldn't create that page. Check the details and try again.",
          "error",
        );
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete this checkout page? Its link will stop working."))
      return;
    try {
      await deleteCheckoutPage(id);
      push("Checkout page deleted.");
      load();
    } catch {
      push("Couldn't delete that page.", "error");
    }
  };

  const copyLink = (page) => {
    navigator.clipboard.writeText(page.payment_url);
    setCopiedId(page.id);
    push("Link copied to clipboard.", "success");
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl italic text-text">
            Checkout pages
          </h1>
          <p className="mt-1 text-sm text-text-soft">
            Shareable links that trigger an STK push when a customer pays.
          </p>
        </div>
        {!showForm && profiles.length > 0 && (
          <Button onClick={() => setShowForm(true)}>New checkout page</Button>
        )}
      </div>

      {profiles.length === 0 && pages !== null && (
        <p className="mt-6 rounded-xl bg-mango/10 px-4 py-3 text-sm text-mango-deep">
          Connect a payment profile first — checkout pages need one to know
          where the money goes.
        </p>
      )}

      {showForm && (
        <form
          onSubmit={onSubmit}
          className="float-in mt-8 rounded-2xl border border-ink/10 bg-white/50 p-6"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-soft">
                Payment profile
              </label>
              <select
                required
                value={form.profile}
                onChange={set("profile")}
                className="w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none focus:border-jade"
              >
                <option value="" disabled>
                  Select a profile
                </option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.business_name}
                  </option>
                ))}
              </select>
              {errors.profile?.[0] && (
                <p className="mt-1 text-xs text-coral">{errors.profile[0]}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-text-soft">
                Page type
              </label>
              <select
                value={form.page_type}
                onChange={set("page_type")}
                className="w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none focus:border-jade"
              >
                <option value="fixed">Fixed amount</option>
                <option value="flexible">
                  Flexible (customer sets amount)
                </option>
                <option value="api">API-driven</option>
              </select>
            </div>

            <Field
              label="Title"
              value={form.title}
              onChange={set("title")}
              error={errors.title?.[0]}
              required
            />
            {form.page_type === "fixed" && (
              <Field
                label="Fixed amount (KES)"
                type="number"
                value={form.fixed_amount}
                onChange={set("fixed_amount")}
                error={errors.fixed_amount?.[0]}
                required
              />
            )}
            {form.page_type === "flexible" && (
              <Field
                label="Minimum amount (KES)"
                type="number"
                value={form.minimum_amount}
                onChange={set("minimum_amount")}
                error={errors.minimum_amount?.[0]}
                required
              />
            )}

            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-text-soft">
                Description
              </label>
              <textarea
                required
                value={form.description}
                onChange={set("description")}
                rows={3}
                className="w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none focus:border-jade"
              />
              {errors.description?.[0] && (
                <p className="mt-1 text-xs text-coral">
                  {errors.description[0]}
                </p>
              )}
            </div>
          </div>

          {(() => {
            const knownFields = [
              "profile",
              "title",
              "description",
              "fixed_amount",
              "minimum_amount",
            ];
            const leftover = Object.entries(errors).filter(
              ([key]) => !knownFields.includes(key),
            );
            if (leftover.length === 0) return null;
            return (
              <div className="mt-4 rounded-lg bg-coral/10 px-3 py-2 text-sm text-coral">
                {leftover.map(([key, messages]) => (
                  <p key={key}>
                    <span className="font-mono text-xs">{key}</span>:{" "}
                    {Array.isArray(messages)
                      ? messages.join(" ")
                      : String(messages)}
                  </p>
                ))}
              </div>
            );
          })()}

          <div className="mt-6 flex gap-3">
            <Button type="submit" loading={saving}>
              Create page
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                setForm(EMPTY);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="mt-8">
        {pages === null && (
          <div className="flex justify-center py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/15 border-t-jade" />
          </div>
        )}

        {pages?.length === 0 && !showForm && profiles.length > 0 && (
          <EmptyState onAction={() => setShowForm(true)} />
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {pages?.map((page) => (
            <div
              key={page.id}
              className={
                "rounded-2xl border border-ink/10 bg-white/50 p-5 " +
                (expandedId === page.id ? "md:col-span-2" : "")
              }
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-text">
                    {page.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-text-soft">
                    {page.description}
                  </p>
                </div>
                <span className="ml-3 shrink-0 rounded-full bg-jade/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-jade-deep">
                  {page.page_type}
                </span>
              </div>

              <p className="mt-3 font-mono text-xs text-text-soft">
                {page.page_type === "fixed" && `KES ${page.fixed_amount}`}
                {page.page_type === "flexible" &&
                  `From KES ${page.minimum_amount}`}
                {page.page_type === "api" && "Amount set by your app"}
              </p>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => copyLink(page)}
                  className="rounded-full bg-ink px-3.5 py-1.5 text-xs font-semibold text-parchment hover:bg-ink-soft"
                >
                  {copiedId === page.id ? "Copied ✓" : "Copy link"}
                </button>
                <a
                  href={page.payment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-jade-deep hover:underline"
                >
                  Open
                </a>
                <button
                  onClick={() =>
                    setExpandedId(expandedId === page.id ? null : page.id)
                  }
                  className="text-xs font-medium text-mango-deep hover:underline"
                >
                  {expandedId === page.id ? "Hide code" : "</> Get code"}
                </button>
                <button
                  onClick={() => onDelete(page.id)}
                  className="ml-auto text-xs font-medium text-coral hover:underline"
                >
                  Delete
                </button>
              </div>

              {expandedId === page.id && (
                <div className="float-in mt-4">
                  <CheckoutSnippet page={page} />
                </div>
              )}
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
      <label className="mb-1.5 block text-xs font-medium text-text-soft">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-xl border border-ink/12 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-jade"
      />
      {error && <p className="mt-1 text-xs text-coral">{error}</p>}
    </div>
  );
}
