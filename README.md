# PayFlow

**STK push, as copy-paste components.**

You know that feeling when a customer says "I'll pay via M-Pesa" and you suddenly
remember you have to deal with OAuth tokens, Base64 passwords, and a callback
URL that Safaricom will silently reject if it's not HTTPS? Yeah. PayFlow exists
so you never have to feel that again as a vibecoder.

Connect your till or paybill once. Get a payment link. Your customer's phone
buzzes with a real STK prompt. You get paid. That's the whole pitch.

---

## What's actually in here

- 🔐 **Multi-provider payments** — Daraja (M-Pesa) today, KCB Buni too. One `PaymentProfile`, one adapter interface, zero if/else spaghetti.
- 💳 **Checkout pages** — fixed price, "pay what you want," or fully
  API-driven. Shareable links, or embed the code directly.
- 📊 **Live transactions dashboard** — watches pending payments flip to
  completed in real time, no manual refresh required.
- 🔒 **Secrets encrypted at rest** — every credential, every provider, no
  exceptions.
- ⚡ **A frontend that doesn't look like a Bootstrap tutorial** — jade,
  parchment, and mango, with a signature ripple animation that shows up
  wherever something's actually happening.

## The stack

**Backend:** Django + DRF, JWT auth via Djoser, MySQL, Fernet encryption for
every stored secret.

**Frontend:** React + Vite + Tailwind, React Router, all wired against the
real API — no mock data anywhere.

## Get it running

### Backend
```bash
git clone https://github.com/ZaydAntony/Payflow-backend.git
cd Payflow-backend
pipenv install
Fill in your own .env credentials  # fill in your DB + Daraja/KCB credentials
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd payflow-frontend
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev
```

### The one gotcha that will eat an hour of your life if you skip this

Safaricom's sandbox **will not** call back to `localhost`. Tunnel your
backend (`ngrok http 8000`) and access it through that URL — not
`127.0.0.1` — or every STK push will 400 before it even reaches a phone.

## Testing a real push

1. Use `254708374149` — Safaricom's official sandbox number, auto-completes
   without a real PIN
2. Shortcode `174379` + the sandbox passkey from your Daraja app's
   **M-Pesa Express → Simulate** page (not your app's main credentials page)
3. Watch the Transactions tab — `pending` should flip to `completed` within
   a few seconds

## Status

Actively being built. Daraja is solid. KCB Buni adapter is in, sandbox
field names pending confirmation against KCB's actual docs. A real
`payflow-react` npm package is the logical next step — right now, "copy the
component" means copying the snippet from your dashboard, which is honest
and works, just isn't `npm install` yet.

---

*Built by Zayd . No ads, no dark patterns, no "contact sales" for an
API key.*