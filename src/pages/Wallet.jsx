import { useEffect, useState } from "react";
import { listProfiles, getWallet, withdrawWallet } from "../api/client";
import { useToast } from "../components/Toast";
import Button from "../components/Button";

export default function Wallet() {
  const { push } = useToast();
  const [wallets, setWallets] = useState(null); // [{ profile, balance, entries }]
  const [withdrawingId, setWithdrawingId] = useState(null);

  const load = async () => {
    try {
      const { data: profiles } = await listProfiles();
      const results = await Promise.all(
        profiles.map(async (profile) => {
          try {
            const { data } = await getWallet(profile.id);
            return { profile, ...data };
          } catch {
            return { profile, balance: "0.00", entries: [] };
          }
        })
      );
      setWallets(results);
    } catch {
      push("Couldn't load your wallet.", "error");
      setWallets([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onWithdraw = async (profileId) => {
    setWithdrawingId(profileId);
    try {
      const { data } = await withdrawWallet(profileId);
      push(`Withdrawal initiated — KES ${data.amount}`, "success");
      load();
    } catch (err) {
      push(err.response?.data?.detail ?? "Withdrawal failed.", "error");
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div>
      <div>
        <h1 className="font-display text-3xl italic text-text">Wallet</h1>
        <p className="mt-1 text-sm text-text-soft">
          Your share of every split payment, ready to withdraw to M-Pesa.
        </p>
      </div>

      {wallets === null && (
        <div className="flex justify-center py-16">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-ink/15 border-t-jade" />
        </div>
      )}

      {wallets?.length === 0 && (
        <div className="mt-8 rounded-2xl border border-ink/10 bg-white/50 py-16 text-center">
          <p className="font-display text-2xl italic text-text">No wallet yet</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-text-soft">
            Connect a payment profile and take a payment to see a balance here.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {wallets?.map(({ profile, balance, entries }) => (
          <div key={profile.id} className="rounded-2xl border border-ink/10 bg-white/50 p-5">
            <div className="flex items-start justify-between">
              <p className="font-semibold text-text">{profile.business_name}</p>
              <span className="rounded-full bg-jade/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-jade-deep">
                Wallet
              </span>
            </div>

            <p className="mt-4 font-display text-3xl italic text-text">
              KES {balance}
            </p>
            <p className="mt-1 text-xs text-text-soft">Available to withdraw</p>

            <Button
              onClick={() => onWithdraw(profile.id)}
              loading={withdrawingId === profile.id}
              disabled={Number(balance) <= 0}
              className="mt-4 w-full md:w-auto"
            >
              Withdraw
            </Button>

            {entries?.length > 0 && (
              <div className="mt-5 divide-y divide-ink/5 border-t border-ink/8 pt-3">
                {entries.slice(0, 5).map((e, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-xs">
                    <span className="text-text-soft">
                      {new Date(e.created_at).toLocaleDateString()}
                    </span>
                    <span className="font-mono text-text">
                      +{e.merchant_amount} <span className="text-text-soft">of {e.gross_amount}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}