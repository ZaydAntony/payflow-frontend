import { useEffect, useRef, useState } from "react";
import { listTransactions, listCheckoutPages } from "../api/client";
import { useToast } from "../components/Toast";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "completed", label: "Completed" },
  { id: "failed", label: "Failed" },
];

const STATUS_STYLES = {
  pending: "bg-mango/15 text-mango-deep",
  completed: "bg-teal/15 text-teal",
  failed: "bg-coral/15 text-coral",
};

// Transactions move from pending -> completed/failed asynchronously, driven
// by M-Pesa's callback hitting the backend — not by anything the merchant
// does in this tab. So this page polls quietly while anything is still
// pending, rather than making the merchant hit refresh to find out.
export default function Transactions() {
  const { push } = useToast();
  const [transactions, setTransactions] = useState(null);
  const [pageTitles, setPageTitles] = useState({});
  const [filter, setFilter] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);
  const pollRef = useRef(null);

  const load = async (silent = false) => {
    try {
      const [txRes, pagesRes] = await Promise.all([
        listTransactions(),
        listCheckoutPages(),
      ]);
      setTransactions(txRes.data);
      setPageTitles(
        Object.fromEntries(pagesRes.data.map((p) => [p.id, p.title]))
      );
      setLastUpdated(new Date());
    } catch {
      if (!silent) push("Couldn't load transactions.", "error");
      setTransactions((t) => t ?? []);
    }
  };

  useEffect(() => {
    load();
    return () => clearInterval(pollRef.current);
  }, []);

  useEffect(() => {
    clearInterval(pollRef.current);
    const hasPending = transactions?.some((t) => t.status === "pending");
    if (hasPending) {
      pollRef.current = setInterval(() => load(true), 8000);
    }
    return () => clearInterval(pollRef.current);
  }, [transactions]);

  const filtered =
    filter === "all"
      ? transactions
      : transactions?.filter((t) => t.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl italic text-text">Transactions</h1>
          <p className="mt-1 text-sm text-text-soft">
            Every STK push sent from your checkout pages, and how it resolved.
          </p>
        </div>
        {lastUpdated && (
          <p className="font-mono text-[11px] text-text-soft">
            Updated {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-1 rounded-full bg-ink/5 p-1 w-fit">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={
              "rounded-full px-4 py-1.5 text-xs font-semibold transition-colors " +
              (filter === f.id
                ? "bg-ink text-parchment"
                : "text-text-soft hover:text-text")
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white/50">
        {transactions === null && (
          <div className="flex justify-center py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/15 border-t-jade" />
          </div>
        )}

        {transactions?.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-display text-2xl italic text-text">No transactions yet</p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-text-soft">
              Once someone pays through one of your checkout pages, it'll show up here.
            </p>
          </div>
        )}

        {filtered?.length > 0 && (
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-ink/8 text-xs uppercase tracking-wide text-text-soft">
                <th className="px-5 py-3 font-medium">Checkout page</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Receipt</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-5 py-3 font-medium text-text">
                    {pageTitles[t.checkout_page] ?? `Page #${t.checkout_page}`}
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-text-soft">{t.phone_number}</td>
                  <td className="px-5 py-3 font-mono text-text">KES {t.amount}</td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize " +
                        STATUS_STYLES[t.status]
                      }
                    >
                      {t.status === "pending" && (
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                      )}
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-text-soft">
                    {t.receipt_number ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-xs text-text-soft">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>
    </div>
  );
}