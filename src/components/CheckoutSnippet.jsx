import { useState } from "react";

// Per-checkout-page code you can actually paste into a project. Two framework
// tabs (HTML/vanilla JS, React) and two integration styles: a redirect button
// (zero setup, always works) and an inline form that fires the STK push
// without leaving the page (needs CORS enabled for the embedding domain).
const TABS = ["html", "react"];
const MODES = [
  { id: "redirect", label: "Redirect button" },
  { id: "inline", label: "Inline form" },
];

export default function CheckoutSnippet({ page }) {
  const [framework, setFramework] = useState("html");
  const [mode, setMode] = useState("redirect");
  const [copied, setCopied] = useState(false);

  const code = getSnippet({ page, framework, mode });

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-parchment/10 bg-ink-soft">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment/10 px-4 py-3">
        <div className="flex items-center gap-1 rounded-full bg-parchment/5 p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={
                "rounded-full px-3 py-1 font-mono text-[10px] font-semibold transition-colors " +
                (mode === m.id
                  ? "bg-mango text-ink"
                  : "text-parchment/60 hover:text-parchment")
              }
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setFramework(t)}
              className={
                "rounded-md px-2.5 py-1 font-mono text-[10px] font-semibold uppercase transition-colors " +
                (framework === t
                  ? "bg-parchment/15 text-parchment"
                  : "text-parchment/50 hover:text-parchment/80")
              }
            >
              {t === "html" ? "HTML" : "React"}
            </button>
          ))}
          <button
            onClick={copy}
            className="ml-2 rounded-md bg-parchment/10 px-2.5 py-1 font-mono text-[10px] font-medium text-parchment/80 transition-colors hover:bg-parchment/20"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>

      <pre className="overflow-x-auto px-5 py-4 text-[11.5px] leading-relaxed text-parchment/85">
        <code className="font-mono">{code}</code>
      </pre>

      {mode === "inline" && (
        <p className="border-t border-parchment/10 px-5 py-2.5 font-mono text-[10px] text-parchment/40">
          Needs CORS enabled on the backend for the domain you paste this into.
        </p>
      )}
    </div>
  );
}

function getSnippet({ page, framework, mode }) {
  const apiUrl = page.payment_url;
  // A human clicking this link should land on the polished checkout page,
  // not the raw DRF API endpoint. The inline mode below calls apiUrl
  // directly since that's a programmatic fetch, not a page a person visits.
  const humanUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/pay/${page.public_id}/`
      : apiUrl;
  const isFixed = page.page_type === "fixed";
  const isApi = page.page_type === "api";

  if (mode === "redirect") {
    if (framework === "html") {
      return `<a
  href="${humanUrl}"
  target="_blank"
  rel="noopener noreferrer"
  style="display:inline-block;padding:12px 24px;border-radius:9999px;
         background:#1F6F54;color:#fff;font-weight:600;text-decoration:none;"
>
  Pay with M-Pesa
</a>`;
    }
    return `export function PayButton() {
  return (
    <a
      href="${humanUrl}"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full bg-emerald-700 px-6 py-3 font-semibold text-white"
    >
      Pay with M-Pesa
    </a>
  );
}`;
  }

  const url = apiUrl;
  // inline mode — posts straight to the checkout endpoint
  const amountField = isApi
    ? `${framework === "html" ? "document.getElementById('amount').value" : "amount"}`
    : null;

  if (framework === "html") {
    return `<form id="payflow-form">
  <input id="phone" type="tel" placeholder="07XXXXXXXX" required />
${isApi ? `  <input id="amount" type="number" placeholder="Amount (KES)" required />\n` : ""}  <button type="submit">Pay with M-Pesa</button>
</form>

<script>
  document.getElementById('payflow-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch("${url}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone_number: document.getElementById('phone').value,${isApi ? `\n        amount: ${amountField},` : ""}
      }),
    });
    const data = await res.json();
    alert(data.message ?? "Check your phone to complete payment.");
  });
</script>`;
  }

  return `import { useState } from "react";

export function PayForm() {
  const [phone, setPhone] = useState("");${isApi ? `\n  const [amount, setAmount] = useState("");` : ""}
  const [status, setStatus] = useState("idle");

  const pay = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("${url}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phone${isApi ? ", amount" : ""} }),
    });
    const data = await res.json();
    setStatus(res.ok ? "pushed" : "error");
  };

  return (
    <form onSubmit={pay}>
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXX" required />
${isApi ? `      <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (KES)" required />\n` : ""}      <button type="submit" disabled={status === "sending"}>
        {status === "pushed" ? "Check your phone" : "Pay with M-Pesa"}
      </button>
    </form>
  );
}`;
}