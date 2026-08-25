import { useEffect, useState } from "react";
import { getWalletTable } from "../api/client";
import { useToast } from "../components/Toast";

export default function Wallet() {
  const { push } = useToast();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getWalletTable();
        setRows(data);
      } catch {
        push("Couldn't load wallet data.", "error");
        setRows([]);
      }
    })();
  }, []);

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl italic text-text">Wallet</h1>
        <p className="mt-1 text-sm text-text-soft">
          Every split payment across your checkout pages — platform cut vs.
          organizer share.
        </p>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-white/50">
        {rows === null && (
          <div className="flex justify-center py-16">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/15 border-t-jade" />
          </div>
        )}

        {rows?.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-display text-2xl italic text-text">
              No split payments yet
            </p>
            <p className="mx-auto mt-2 max-w-xs text-sm text-text-soft">
              Once a checkout page gets paid, the split shows up here.
            </p>
          </div>
        )}

        {rows?.length > 0 && (
          <>
            <div className="divide-y divide-ink/5 md:hidden">
              {rows.map((r, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-text">{r.payment_profile}</p>
                    <span className="text-xs text-text-soft">
                      {new Date(r.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-text-soft">
                    {r.checkout_page}
                  </p>
                  <div className="mt-2 flex items-center justify-between font-mono text-xs">
                    <span className="text-jade-deep">
                      Platform: KES {r.platform_cut}
                    </span>
                    <span className="font-semibold text-text">
                      Organizer: KES {r.organizer_share}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <table className="hidden w-full text-left text-sm md:table">
              <thead>
                <tr className="border-b border-ink/8 text-xs uppercase tracking-wide text-text-soft">
                  <th className="px-5 py-3 font-medium">Created</th>
                  <th className="px-5 py-3 font-medium">Payment profile</th>
                  <th className="px-5 py-3 font-medium">Checkout page</th>
                  <th className="px-5 py-3 font-medium">Platform (5%)</th>
                  <th className="px-5 py-3 font-medium">Organizer share</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-ink/5 last:border-0">
                    <td className="px-5 py-3 text-xs text-text-soft">
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td className="px-5 py-3 font-medium text-text">
                      {r.payment_profile}
                    </td>
                    <td className="px-5 py-3 text-text-soft">
                      {r.checkout_page}
                    </td>
                    <td className="px-5 py-3 font-mono text-jade-deep">
                      KES {r.platform_cut}
                    </td>
                    <td className="px-5 py-3 font-mono text-text">
                      KES {r.organizer_share}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
