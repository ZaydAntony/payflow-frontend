import { useEffect, useState } from "react";

// The signature element: a phone receiving a live STK push prompt, the way
// a customer would actually see it. A new prompt "arrives" every few
// seconds with a ripple, grounding the hero in exactly what the product does.
const PROMPTS = [
  { biz: "Amani Bookshop", amount: "KES 850" },
  { biz: "Jiko Grill", amount: "KES 1,200" },
  { biz: "Mama Njeri Fashions", amount: "KES 2,450" },
];

export default function PhoneMockup() {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState("idle"); // idle -> arriving -> shown

  useEffect(() => {
    setStage("arriving");
    const t1 = setTimeout(() => setStage("shown"), 550);
    const t2 = setTimeout(() => {
      setStage("idle");
      setIndex((i) => (i + 1) % PROMPTS.length);
    }, 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [index]);

  const prompt = PROMPTS[index];

  return (
    <div className="relative flex items-center justify-center">
      {/* ambient ripple rings behind the phone */}
      <div className="absolute h-40 w-40 rounded-full border border-mango/40 ripple-ring" />
      <div className="absolute h-40 w-40 rounded-full border border-mango/40 ripple-ring [animation-delay:0.9s]" />

      <div className="relative w-[240px] rounded-[2.2rem] border-[6px] border-ink bg-ink shadow-2xl">
        <div className="absolute left-1/2 top-0 h-4 w-20 -translate-x-1/2 rounded-b-xl bg-ink" />
        <div className="relative h-[440px] w-full overflow-hidden rounded-[1.7rem] bg-gradient-to-b from-ink-soft to-ink px-4 pt-10">
          <p className="text-center font-mono text-[10px] tracking-widest text-parchment/40">
            9:41
          </p>

          <div
            className={
              "mt-8 rounded-2xl bg-parchment p-4 shadow-lg transition-all duration-500 " +
              (stage === "idle"
                ? "translate-y-6 opacity-0"
                : stage === "arriving"
                ? "translate-y-0 opacity-100 buzz"
                : "translate-y-0 opacity-100")
            }
          >
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jade text-[11px] font-semibold text-parchment">
                M
              </span>
              <div>
                <p className="text-[11px] font-semibold text-text">M-PESA</p>
                <p className="text-[9px] text-text-soft">Payment request</p>
              </div>
              <span className="ml-auto h-2 w-2 rounded-full bg-mango" />
            </div>
            <p className="mt-3 text-[11px] leading-snug text-text">
              Enter M-PESA PIN to pay{" "}
              <span className="font-semibold">{prompt.amount}</span> to{" "}
              <span className="font-semibold">{prompt.biz}</span>
            </p>
            <div className="mt-3 flex justify-center gap-2">
              {[0, 1, 2, 3].map((d) => (
                <span key={d} className="h-2 w-2 rounded-full bg-ink/20" />
              ))}
            </div>
          </div>

          <p className="mt-6 text-center font-mono text-[9px] text-parchment/30">
            sent via PayFlow
          </p>
        </div>
      </div>
    </div>
  );
}
