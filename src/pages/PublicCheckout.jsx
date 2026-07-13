import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicCheckout, submitStkPush } from "../api/client";
import Button from "../components/Button";

// Stages of the feedback loop a customer sees on a real checkout link:
// loading page -> form -> pushed (waiting on their phone) -> timeout/retry
export default function PublicCheckout() {
  const { publicId } = useParams();
  const [page, setPage] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState("form"); // form -> submitting -> pushed -> error
  const [error, setError] = useState(null);
  const [secondsWaiting, setSecondsWaiting] = useState(0);

  useEffect(() => {
    getPublicCheckout(publicId)
      .then(({ data }) => setPage(data))
      .catch(() => setNotFound(true));
  }, [publicId]);

  useEffect(() => {
    if (stage !== "pushed") return;
    setSecondsWaiting(0);
    const interval = setInterval(() => setSecondsWaiting((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [stage]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setStage("submitting");
    try {
      const payload = { phone_number: phone };
      if (page.page_type === "api") payload.amount = amount;
      const { data } = await submitStkPush(publicId, payload);
      setStage("pushed");
      setStage((s) => s); // no-op, keep for clarity
      window.__lastMessage = data.message;
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          err.response?.data?.phone_number?.[0] ||
          "Couldn't send the payment request. Check the number and try again."
      );
      setStage("form");
    }
  };

  if (notFound) {
    return (
      <CenteredShell>
        <p className="font-display text-3xl italic text-parchment">Link not found</p>
        <p className="mt-2 text-sm text-parchment/60">
          This checkout page doesn't exist or is no longer active.
        </p>
      </CenteredShell>
    );
  }

  if (!page) {
    return (
      <CenteredShell>
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-parchment/20 border-t-mango" />
      </CenteredShell>
    );
  }

  const displayAmount =
    page.page_type === "fixed"
      ? `KES ${page.amount}`
      : page.page_type === "flexible"
      ? `From KES ${page.amount}`
      : "Amount set below";

  return (
    <CenteredShell>
      <div className="w-full max-w-sm">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-mango">
          {page.business_name}
        </p>
        <h1 className="mt-2 text-center font-display text-3xl italic text-parchment">
          {page.title}
        </h1>
        {page.description && (
          <p className="mt-2 text-center text-sm text-parchment/60">{page.description}</p>
        )}
        <p className="mt-4 text-center font-mono text-2xl text-parchment">{displayAmount}</p>

        {stage !== "pushed" && (
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-parchment/70">
                M-Pesa phone number
              </label>
              <input
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX"
                className="w-full rounded-xl border border-parchment/15 bg-ink-soft px-4 py-3 text-center font-mono text-sm text-parchment outline-none focus:border-mango"
              />
            </div>

            {page.page_type === "api" && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-parchment/70">
                  Amount (KES)
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-parchment/15 bg-ink-soft px-4 py-3 text-center font-mono text-sm text-parchment outline-none focus:border-mango"
                />
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-coral/10 px-3 py-2 text-center text-sm text-coral">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" loading={stage === "submitting"}>
              Pay with M-Pesa
            </Button>
            <p className="text-center text-xs text-parchment/40">
              You'll get a prompt on your phone to enter your M-Pesa PIN.
            </p>
          </form>
        )}

        {stage === "pushed" && (
          <div className="float-in mt-10 flex flex-col items-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <div className="absolute h-24 w-24 rounded-full border border-mango/40 ripple-ring" />
              <div className="absolute h-24 w-24 rounded-full border border-mango/40 ripple-ring [animation-delay:0.9s]" />
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-mango text-ink">
                📱
              </div>
            </div>
            <p className="mt-6 text-center font-display text-xl italic text-parchment">
              Check your phone
            </p>
            <p className="mt-2 max-w-xs text-center text-sm text-parchment/60">
              Enter your M-Pesa PIN on the prompt sent to{" "}
              <span className="font-mono text-parchment">{phone}</span> to complete this payment.
            </p>
            <p className="mt-4 font-mono text-xs text-parchment/40">
              Waiting {secondsWaiting}s
            </p>

            {secondsWaiting > 25 && (
              <button
                onClick={() => setStage("form")}
                className="mt-6 text-xs font-semibold text-mango hover:underline"
              >
                Didn't get a prompt? Try again
              </button>
            )}
          </div>
        )}
      </div>
    </CenteredShell>
  );
}

function CenteredShell({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6">
      {children}
    </div>
  );
}
