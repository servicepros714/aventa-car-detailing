# Aventa Car Detailing — Setup Guide

Built to the Service Pros portfolio spec: Vite + React 18, 4-step booking flow,
shared `detailing-bookings` D1 database, Stripe checkout with Link/Apple Pay/
Google Pay, Cloudflare Pages + GitHub Actions.

## Site identifiers (registered for this build — don't reuse elsewhere)

| | |
|---|---|
| Business | Aventa Car Detailing (Anaheim, CA) |
| Source tag | `aventa-anaheim` |
| Booking ID prefix | `AVT-` |
| Worker URL (suggested) | `aventa-detailing-worker.austin80565.workers.dev` |
| Cloudflare Pages project | `aventa-car-detailing` |

> `premium-anaheim` is already used by Premium Detailing Solutions (Anaheim) —
> Aventa is a separate business, hence the distinct `aventa-anaheim` tag.

## 1. GitHub repo

1. Push this folder to a new GitHub repo.
2. Add repo secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`,
   `VITE_STRIPE_PUBLISHABLE_KEY` (the workflow only needs the first two — the
   Stripe key ships via the committed `.env.local`).

## 2. Cloudflare Pages

1. Create a Pages project named `aventa-car-detailing` (or update
   `.github/workflows/deploy.yml` if you name it differently).
2. Build command `npm run build`, output directory `dist`.
3. Connect the custom domain once DNS/Apple Pay domain verification is done.

## 3. Cloudflare Worker (dashboard, not CLI)

1. Create a Worker named `aventa-detailing-worker` and paste in `worker/index.js`.
2. Bind the shared D1 database `detailing-bookings` as `DB` (Settings > Bindings).
3. Run `worker/schema.sql` against the shared database once (safe — uses
   `IF NOT EXISTS`, won't affect other sites' data).
4. Add `STRIPE_SECRET_KEY` as an encrypted Worker secret.
5. Set the Worker's route/custom domain to match `VITE_API_URL` in `.env.local`.

## 4. Stripe

1. Use the existing Stripe account. In **test mode**, make sure Link is
   enabled if you want the Link button to appear while testing.
2. `automatic_payment_methods[enabled]=true` is already set server-side in
   the Worker — this is what makes Link/Apple Pay/Google Pay work without
   listing `payment_method_types[]`.
3. Complete Apple Pay domain verification for the production domain
   (infra step you handle outside this repo).

## 5. Local development

```bash
npm install
npm run dev
```

`.env.local` is committed with placeholder values — swap in the real
`VITE_API_URL` and `VITE_STRIPE_PUBLISHABLE_KEY` once the Worker and Stripe
are live. `.env` (if you use one) stays gitignored.

## 6. Admin dashboard compatibility

The Worker's `PATCH /api/bookings/:id` endpoint accepts the shared
`PATCHABLE` field set (`status`, `payment_status`, `reschedule_date`,
`reschedule_time`, `original_date`, `original_time`, `notes2`), so this site
is reschedule-compatible with the existing portfolio admin dashboard out of
the box — no extra wiring needed on the dashboard side.

## What's different from the rest of the portfolio (by design)

- **Palette:** Deep Navy / Steel Blue / Sky Accent / Chrome, pulled from the
  Aventa badge logo — distinct from Sleek Finish's black/gold.
- **Fonts:** Oswald (headings) + Manrope (body) + Rajdhani (accent/stats) —
  not used elsewhere in the portfolio.
- **Nav:** split-center nav (links left/right, badge wordmark centered) with
  a chrome underline on scroll.
- **Hero:** diagonal chrome-seam split, not a fullscreen background image.
- Everything else — booking flow, service pricing, D1 schema, Stripe
  pattern, sticky mobile bars — follows the shared portfolio standard.
