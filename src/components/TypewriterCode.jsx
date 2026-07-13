import { useEffect, useState } from "react";

const RAW = `import { useState } from "react";

export function PayButton({ phone }) {
  const [status, setStatus] = useState("idle");

  const pay = async () => {
    setStatus("sending");
    const res = await fetch(
      "https://your-domain.com/api/v1/pay/<checkout-id>/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone }),
      }
    );
    const data = await res.json();
    setStatus(data.message);
  };

  return (
    <button onClick={pay}>
      {status === "sending" ? "Check your phone…" : "Pay with M-Pesa"}
    </button>
  );
}`;

// Types the snippet out, holds, clears, and loops — the whole point being
// visible in motion: this is all there is to it, watch it appear.
export default function TypewriterCode() {
  const [shown, setShown] = useState("");
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    let i = 0;
    let timeout;

    const tick = () => {
      if (phase === "typing") {
        if (i <= RAW.length) {
          setShown(RAW.slice(0, i));
          i += 1;
          timeout = setTimeout(tick, 14 + Math.random() * 18);
        } else {
          timeout = setTimeout(() => setPhase("holding"), 1800);
        }
      } else if (phase === "holding") {
        setPhase("erasing");
      } else {
        if (i >= 0) {
          // shrink from current full length back to 0
        }
      }
    };
    tick();
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (phase !== "erasing") return;
    let len = RAW.length;
    const erase = () => {
      len -= 3;
      if (len > 0) {
        setShown(RAW.slice(0, len));
        setTimeout(erase, 6);
      } else {
        setShown("");
        setTimeout(() => setPhase("typing"), 500);
      }
    };
    const t = setTimeout(erase, 6);
    return () => clearTimeout(t);
  }, [phase]);

  return (
    <div className="w-full max-w-md overflow-hidden rounded-2xl border border-parchment/10 bg-ink-soft shadow-2xl">
      <div className="flex items-center gap-2 border-b border-parchment/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-coral/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-mango/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal/70" />
        <span className="ml-2 font-mono text-[11px] text-parchment/40">Checkout.jsx</span>
      </div>
      <pre className="min-h-[280px] overflow-x-auto px-5 py-5 text-[12.5px] leading-relaxed text-parchment/85">
        <code className="font-mono">
          {shown}
          <span className="animate-pulse text-mango">▍</span>
        </code>
      </pre>
    </div>
  );
}