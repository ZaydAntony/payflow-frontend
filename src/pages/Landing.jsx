import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TypewriterCode from "../components/TypewriterCode";
import Button from "../components/Button";

const STEPS = [
  {
    n: "01",
    title: "Copy the component",
    body: "A button, a hook, a webhook handler — pick the piece you need from the docs and paste it into your project. No SDK to learn.",
  },
  {
    n: "02",
    title: "Drop in your till number",
    body: "Connect your Daraja app once in the dashboard. Every component after that just needs your till or paybill.",
  },
  {
    n: "03",
    title: "Ship an STK push that actually works",
    body: "Token refresh, callback verification, retries — handled for you. You just wire up onSuccess and onFail.",
  },
];

const FEATURES = [
  {
    title: "Written for the way you actually build",
    body: "Paste it into a Cursor session, a v0 project, or a plain React app scaffolded ten minutes ago — it works the same. No account setup wall before you can see it run.",
  },
  {
    title: "The hard Daraja parts, already solved",
    body: "OAuth token refresh, callback signature checks, retry-on-timeout — the stuff that eats a weekend when you build it from the Safaricom docs yourself.",
  },
  {
    title: "Every secret encrypted, by default",
    body: "Consumer keys, secrets, and passkeys are encrypted at rest the moment you save them. You don't have to think about it — it's just how the platform works.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden bg-parchment">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* soft floating gradient blobs — the illustration layer */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-jade/20 blur-3xl [animation:float-blob_9s_ease-in-out_infinite]" />
          <div className="absolute right-0 top-32 h-96 w-96 rounded-full bg-mango/20 blur-3xl [animation:float-blob_11s_ease-in-out_infinite_1s]" />
          <div className="absolute left-1/3 bottom-0 h-64 w-64 rounded-full bg-teal/20 blur-3xl [animation:float-blob_10s_ease-in-out_infinite_0.5s]" />
        </div>

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="float-in">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-jade/20 bg-jade/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-jade-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-mango" />
              Built for vibe coders &amp; developers
            </p>

            <h1 className="text-balance font-display text-6xl leading-[1.02] tracking-tight text-text md:text-7xl">
              Don't code.
              <br />
              <span className="italic text-jade">Just paste.</span>
            </h1>

            <p className="mt-7 max-w-md text-lg leading-relaxed text-text-soft">
              Skip the Daraja docs, the OAuth dance, and the callback
              debugging. Grab a component, paste it into your app, and your
              users get a real M-Pesa prompt on their phone.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button as={Link} to="/register" size="lg">
                Create your free account
              </Button>
              <a
                href="#how"
                className="text-sm font-semibold text-text underline decoration-mango decoration-2 underline-offset-4"
              >
                See how it works
              </a>
            </div>
          </div>

          <div className="float-in [animation-delay:0.15s] flex justify-center">
            <TypewriterCode />
          </div>
        </div>

        <svg
          className="pointer-events-none absolute -bottom-10 left-0 w-full opacity-[0.08]"
          height="120"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,60 C300,120 400,0 700,60 C900,100 1000,20 1200,60"
            fill="none"
            stroke="#1F6F54"
            strokeWidth="2"
          />
        </svg>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-ink/8 bg-ink py-24 text-parchment">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-mango">
            The flow
          </p>
          <h2 className="mt-3 max-w-lg font-display text-4xl italic">
            Three steps between a blank file and a working checkout.
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.n} className="border-t border-parchment/15 pt-6">
                <span className="font-mono text-sm text-mango">{step.n}</span>
                <h3 className="mt-3 font-display text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-parchment/65">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-jade-deep">
            Why PayFlow
          </p>
          <h2 className="mt-3 max-w-lg text-balance font-display text-4xl italic text-text">
            The infrastructure part, done properly.
          </h2>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-ink/8 bg-white/40 p-7 transition-colors hover:border-jade/25"
              >
                <h3 className="font-semibold text-text">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-soft">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="border-t border-ink/8 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance font-display text-4xl italic text-text">
            Your next STK push is three lines of JSX away.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-text-soft">
            Free to start. You'll need a Daraja app and a till or paybill to
            go live.
          </p>
          <div className="mt-8 flex justify-center">
            <Button as={Link} to="/register" size="lg">
              Create your free account
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}